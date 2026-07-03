/* ============================================================================
   BOSS BATTLE — co-op PvE-uitbreiding op Battle Mode
   ----------------------------------------------------------------------------
   Boss Battle hergebruikt de volledige Team A/B-resolutie-engine uit battle.js
   ONGEWIJZIGD: Team A = de klas (alle spelers samen), Team B = de baas (geen
   spelers, scripted tegenstander). Spelersacties (aanval/schild/heal/combo's,
   BM_CLASSES/BM_COMBOS/BM_SYNERGY) richten zich via de bestaande
   bmCalcAbilityEffect()/bmResolve()-pijplijn al automatisch op BM_TEAMS.B,
   dat hier de baas-HP bevat — geen wijziging nodig aan de klassen-data.
   Dit bestand bevat alleen: de baas-presets/moeilijkheidsgraden, en de
   scripted tegenaanval/rage-logica die battle.js's bmResolve() na de normale
   schadeberekening aanroept.
   ============================================================================ */

/* ---- CONFIGURATIETABEL: MOEILIJKHEIDSGRADEN ---- */
const BOSS_DIFFICULTIES = {
  easy:      { id:"easy",      nm:"Easy",      m:0.5 },
  normal:    { id:"normal",    nm:"Normal",    m:1.0 },
  hard:      { id:"hard",      nm:"Hard",      m:1.5 },
  heroic:    { id:"heroic",    nm:"Heroic",    m:2.2 },
  legendary: { id:"legendary", nm:"Legendary", m:3.5 },
};
const BOSS_DIFF_ORDER = ["easy","normal","hard","heroic","legendary"];

/* ---- CONFIGURATIETABEL: BAZEN ---- */
// Unieke fase-mechanics (Hydra-koppen, Cycloop-countdown, Minotaurus-schild+
// enrage) zijn bewust nog niet geïmplementeerd — zie het architectuurplan:
// eerst de generieke aanval/fase-loop werkend, mechanics volgen als vervolgstap.
// `img` (romp/basisillustratie) en `heads` (Hydra: losse koppen bovenop de
// romp) zijn optioneel — ontbreekt `img`, dan valt bmBossSpriteHTML() terug
// op de emoji-placeholder.
// `hero` = de mythologische held die traditioneel tegen déze baas streed —
// vervangt in Boss Battle de factie-commandant van team A (de baas zelf
// heeft geen commandant, zie CommanderSpectre.show() in battle.js).
const BOSS_PRESETS = {
  hydra:    { id:"hydra",    nm:"De Hydra van Lerna",   emoji:"🐉", color:"#2e7d32",
    desc:"Groeit extra koppen en geneest zichzelf naarmate ze HP verliest.",
    img:"assets/bosses/hydra.png",
    heads:["assets/bosses/hydrahead1.png","assets/bosses/hydrahead2.png","assets/bosses/hydrahead3.png",
           "assets/bosses/hydrahead4.png","assets/bosses/hydrahead5.png","assets/bosses/hydrahead6.png",
           "assets/bosses/hydrahead7.png"],
    hero:{ nm:"Herakles", img:"assets/commanders/heroes/herakles.png" } },
  cyclops:  { id:"cyclops",  nm:"Polyfemus de Cycloop", emoji:"👁️", color:"#ef6c00",
    desc:"Een oogstraal-countdown dwingt de klas tot snel gezamenlijk handelen.",
    img:"assets/bosses/cyclops.png",
    hero:{ nm:"Odysseus", img:"assets/commanders/heroes/odysseus.png" } },
  minotaur: { id:"minotaur", nm:"De Minotaurus",        emoji:"🐂", color:"#c62828",
    desc:"Verstopt zich achter een Labyrinth-schild en gaat daarna in Enrage.",
    img:"assets/bosses/Minotaur.png",
    hero:{ nm:"Theseus", img:"assets/commanders/heroes/theseus.png" } },
  // Verborgen baas voor Total War-belegeringen (twStartAttack() in
  // totalwar.js) — bewust NIET in BOSS_PRESET_ORDER, dus nooit los kiesbaar
  // in het normale Boss Battle-menu. Geen mythologische held/tegenstander,
  // maar de muren/torens/garnizoen van de aangevallen provincie zelf; de
  // garnizoensbonus zit al in de HP (zie bmStartBossGame() in battle.js).
  garrison: { id:"garrison", nm:"Het Garnizoen",         emoji:"🏰", color:"#6b5d4f",
    desc:"De muren, torens en het garnizoen van de belegerde provincie.",
    img:"assets/bosses/fort.png" }, // placeholder, wordt later vervangen
};
const BOSS_PRESET_ORDER = ["hydra","cyclops","minotaur"];

function bmBossPreset(id){ return BOSS_PRESETS[id]||BOSS_PRESETS.hydra; }
function bmBossDiff(id){ return BOSS_DIFFICULTIES[id]||BOSS_DIFFICULTIES.normal; }

// Faseovergangen op 66%/33% resterende HP (intro → de breuk → execute-fase).
function bmBossPhaseFor(hpPct){ return hpPct<=0.33?3:hpPct<=0.66?2:1; }

// Hydra: aantal nog levende koppen bij een gegeven HP-percentage. De 7 koppen
// zijn gelijk verdeeld over de HP-balk — bij 100% zijn alle 7 zichtbaar, bij
// 0% geen. ceil() zorgt dat een kop pas verdwijnt zodra zijn 1/7e-aandeel
// volledig weg is (dus niet al bij het eerste beetje schade).
function bmBossAliveHeads(headCount,hpPct){
  return Math.max(0,Math.min(headCount,Math.ceil((hpPct||0)*headCount)));
}

// Aantal resolutie-rondes tussen elke basisaanval van de baas, per fase.
// Ronden zijn hier de "klok" (i.p.v. een los wall-clock-ticker): dat voorkomt
// een tweede, onafhankelijke Firebase-schrijver die met bmResolve() zou kunnen
// racen. Fase 1 is rustig (introductie), fase 2/3 vallen elke ronde aan.
const BOSS_ROUNDS_PER_ATTACK = {1:2, 2:1, 3:1};

/* ----------------------------------------------------------------------------
   bmBossResolveTick(boss, classMaxHP, diffM, noDamageAnswerCount)
   Pure functie (geen Firebase-IO): berekent de baas-kant van één ronde-
   resolutie. Wordt aangeroepen door bmResolve() in battle.js, ná de normale
   schade-op-de-baas-berekening (die al via de bestaande engine loopt).

   - Basisaanval: elke BOSS_ROUNDS_PER_ATTACK[fase] rondes verliest de klas
     classMaxHP * 0.05 * Md — percentage-gebaseerd, dus onafhankelijk van N.
   - Rage: elke speler die deze ronde meedeed zonder schade toe te brengen
     (proxy voor een gemist/fout antwoord — vermijdt individuele bestraffing)
     voedt de rage-balk met 5%*Md. Bij 100% volgt een extra tegenaanval van
     8%*Md los van de normale cadans, en de rage-balk reset naar 0.
   ---------------------------------------------------------------------------- */
function bmBossResolveTick(boss, classMaxHP, diffM, noDamageAnswerCount){
  const b={...boss};
  let classDamage=0;
  const events=[];

  b.roundsSinceAttack=(b.roundsSinceAttack||0)+1;
  const cadence=BOSS_ROUNDS_PER_ATTACK[b.phase||1]||1;
  if(b.roundsSinceAttack>=cadence){
    b.roundsSinceAttack=0;
    const dmg=Math.round(classMaxHP*0.05*diffM);
    classDamage+=dmg;
    events.push({type:"boss_attack",dmg});
  }

  if(noDamageAnswerCount>0){
    b.rage=Math.min(100,(b.rage||0)+noDamageAnswerCount*5*diffM);
    if(b.rage>=100){
      b.rage=0;
      const dmg=Math.round(classMaxHP*0.08*diffM);
      classDamage+=dmg;
      events.push({type:"boss_rage_attack",dmg});
    }
  }

  return{boss:b,classDamage,events};
}

// Total War-belegering (BOSS_PRESETS.garrison): welk werk wordt nu bevochten
// (stage-index in BM_BOSS.stage, zie bmSiegeStageKeys() in battle.js), met
// bijpassende naam/sprite. Gedeeld door bmBossSpriteHTML() hieronder en
// bmTeamNm() in battle.js.
const TW_STAGE_NAME = { militia:"Het Garnizoen", walls:"De Muur", towers:"Het Fort" };
function bmGarrisonStageInfo(){
  const gp=BM_META?.garrisonProvince; if(!gp) return null;
  const stageKeys=(typeof bmSiegeStageKeys==="function")?bmSiegeStageKeys(gp):[];
  const idx=BM_BOSS?.stage||0;
  const key=stageKeys[idx]||"towers";
  const tier=twStructureTier(gp[TW_STRUCTURES[key].field]);
  return { key, tier, nm:TW_STAGE_NAME[key]||"Het Garnizoen", img:twSpriteFor(key,tier,gp.defenderCivId) };
}

/* ---- UI-HELPER: baas-placeholder op het slagveld (team-B-formatie) ---- */
// Vervangt bmFormationHTML("B") wanneer er geen spelers op team B staan
// (Boss Battle heeft geen menselijke tegenstander-team).
function bmBossSpriteHTML(boss,nm){
  const preset=bmBossPreset(BM_META?.bossId);
  const phase=boss?.phase||1;
  const rage=Math.round(boss?.rage||0);
  const tB=BM_TEAMS?.B||{health:1,maxHealth:1};
  const hpPct=tB.maxHealth?tB.health/tB.maxHealth:1;

  // Belegering: sprite/naam volgen de huidige stage (Garnizoen/Muur/Fort)
  // i.p.v. de vaste preset-afbeelding — drie losse gevechten na elkaar.
  const stageInfo = preset.id==="garrison" ? bmGarrisonStageInfo() : null;
  let art, displayNm=nm;
  if(stageInfo){
    displayNm=stageInfo.nm;
    art = stageInfo.img
      ? `<div style="position:relative;width:168px;height:168px;margin:0 auto;filter:drop-shadow(0 0 10px ${preset.color}66)">
           <img src="${stageInfo.img}?${SPRITE_VER}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain" alt="" onerror="this.style.display='none'">
         </div>`
      : `<div style="font-size:64px;line-height:1;filter:drop-shadow(0 0 8px ${preset.color}88)">${preset.emoji}</div>`;
  } else if(preset.img){
    // Romp (met de kale stompjes al ingetekend) + optioneel losse koppen
    // erbovenop. Elke kop-laag is een even groot canvas als de romp, dus
    // gewoon absoluut stapelen volstaat — geen offsets nodig. Een verslagen
    // kop verdwijnt simpelweg (de stomp op de rompillustratie komt bloot).
    const layers=[`<img src="${preset.img}?${SPRITE_VER}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain" alt="">`];
    if(preset.heads?.length){
      const alive=bmBossAliveHeads(preset.heads.length,hpPct);
      preset.heads.forEach((h,i)=>{
        if(i<alive)layers.push(`<img src="${h}?${SPRITE_VER}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain" alt="">`);
      });
    }
    art=`<div style="position:relative;width:168px;height:168px;margin:0 auto;filter:drop-shadow(0 0 10px ${preset.color}66)">${layers.join("")}</div>`;
  } else {
    art=`<div style="font-size:64px;line-height:1;filter:drop-shadow(0 0 8px ${preset.color}88)">${preset.emoji}</div>`;
  }

  return `<div class="bm-fcol" style="align-items:center;justify-content:center;flex:1">
    <div class="bm-av" style="text-align:center">
      ${art}
      <div class="avn">${esc(displayNm)}</div>
      <div class="avncls">Fase ${phase} · Rage ${rage}%</div>
    </div>
  </div>`;
}
