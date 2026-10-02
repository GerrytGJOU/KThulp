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
// Unieke fase-mechanics (Hydra-regen, Cycloop-metgezellenmaaltijd, Minotaurus-
// Labyrinth-schild+Enrage) zitten in bmBossResolveTick() hieronder, per bossId
// vertakt — gebalanceerd tegen de echte bossMaxHP/classMaxHP-formules uit
// bmStartBossGame() (battle.js). Percentages die aan bossMaxHP hangen krijgen
// bewust GEEN aparte moeilijkheids-vermenigvuldiging (bossMaxHP zelf schaalt
// al met diffM); percentages die aan classMaxHP hangen wel, net als de
// generieke aanval hieronder.
// `img` (romp/basisillustratie) en `heads` (Hydra: losse koppen bovenop de
// romp) zijn optioneel — ontbreekt `img`, dan valt bmBossSpriteHTML() terug
// op de emoji-placeholder.
// `hero` = de mythologische held die traditioneel tegen déze baas streed —
// vervangt in Boss Battle de factie-commandant van team A (de baas zelf
// heeft geen commandant, zie CommanderSpectre.show() in battle.js).
const BOSS_PRESETS = {
  hydra:    { id:"hydra",    nm:"De Hydra van Lerna",   emoji:"🐉", color:"#2e7d32",
    desc:"Geneest zichzelf zodra de klas geen forse klap uitdeelt — koppen groeien terug.",
    img:"assets/bosses/hydra.png",
    heads:["assets/bosses/hydrahead1.png","assets/bosses/hydrahead2.png","assets/bosses/hydrahead3.png",
           "assets/bosses/hydrahead4.png","assets/bosses/hydrahead5.png","assets/bosses/hydrahead6.png",
           "assets/bosses/hydrahead7.png"],
    hero:{ nm:"Herakles", img:"assets/commanders/heroes/herakles.png" } },
  cyclops:  { id:"cyclops",  nm:"Polyfemus de Cycloop", emoji:"👁️", color:"#ef6c00",
    desc:"Elke paar rondes dreigt een metgezellenmaaltijd — alleen gezamenlijk schild kan die nog onderbreken.",
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
   bmBossResolveTick(boss, ctx)
   Pure functie (geen Firebase-IO): berekent de baas-kant van één ronde-
   resolutie. Wordt aangeroepen door bmResolve() in battle.js, ná de normale
   schade-op-de-baas-berekening (die al via de bestaande engine loopt).
   ctx = { classMaxHP, bossMaxHP, diffM, noDamageAnswerCount, bossId,
           dmgDealtThisRound, shieldThisRound }

   - Basisaanval (alle bazen): elke BOSS_ROUNDS_PER_ATTACK[fase] rondes
     verliest de klas classMaxHP * 0.05 * Md — percentage-gebaseerd, dus
     onafhankelijk van N.
   - Rage (alle bazen): elke speler die deze ronde meedeed zonder schade toe
     te brengen (proxy voor een gemist/fout antwoord — vermijdt individuele
     bestraffing) voedt de rage-balk met 5%*Md. Bij 100% volgt een extra
     tegenaanval van 8%*Md los van de normale cadans, rage reset naar 0.
   - Hydra: geneest 2% van bossMaxHP zodra de klas dit ronde ONDER de 3% van
     bossMaxHP aan schade toebrengt — beloont een paar gebundelde harde
     klappen (combo/legendarisch) boven constant kleine pokes.
   - Cycloop: iedere 3 rondes een "metgezellenmaaltijd"-dreiging met een
     fuse van 2 rondes (te tellen vanaf de ronde ná de aankondiging). Alleen gezamenlijk schild (team_shield-acties samen
     ≥ bmBossShieldNeed() die ronde, + de gratis actie "Schild heffen")
     onderbreekt 'm. Loopt de fuse af: 6% van classMaxHP
     schade aan de klas, én de Cycloop heelt 4% van bossMaxHP (Polyfemus'
     dagelijkse maaltijd van Odysseus' metgezellen).
   - Minotaurus: het Labyrinth-schild zelf leeft NIET hier (dat is
     persistente baas-state en moet vóór newHB al worden verrekend in
     bmResolve() in battle.js) — hier alleen de Enrage-omschakeling: zodra
     ctx.labyrinthBroken waar is (of fase 3 bereikt is) gaat b.enraged
     blijvend aan: de baas valt dan elke ronde aan én elke klap doet
     BOSS_ENRAGE_DMG_MULT keer zoveel schade. (Vóór 2026-10-02 was Enrage
     niet blijvend — labyrinthBroken is alleen waar in de breekronde — en
     ging het alleen om de cadans, wat vanaf fase 2 toch al elke ronde is.)
   ---------------------------------------------------------------------------- */
// Benodigd gezamenlijk schild om de Cycloop-maaltijd te onderbreken (en om
// een Enrage-klap van de Minotaurus maximaal op te vangen). Schaalt
// met de klasgrootte (vroeger vast 8×moeilijkheid — onhaalbaar voor een klas
// zonder Hopliet/Bevelvoerder). Op Normal ≈ 60% van de klas die "Schild
// heffen" (+2, BM_BASIC_ACTIONS) kiest; de moeilijkheid telt maar tot ×1,5
// mee, anders wordt het op Heroic/Legendary wiskundig onhaalbaar.
function bmBossShieldNeed(n,diffM){
  return Math.max(3, Math.ceil(Math.max(1,n||0)*1.2*Math.min(diffM||1,1.5)));
}

// Minotaurus-Enrage: zoveel keer zwaarder slaat hij per basisaanval, en
// zoveel daarvan vangt gezamenlijk schild maximaal op (bij ≥
// bmBossShieldNeed() schild die ronde; minder schild = naar verhouding
// minder). Gewone schilden houden baasklappen verder NIET tegen (die gaan
// buiten de schild-verrekening van bmResolve() om) — dit is dé
// overleg-tegenzet tegen Enrage. Gebalanceerd (2026-10-02) met een
// simulatie die op een echt gewonnen Cycloop-gevecht (7 lln, 28 rondes)
// was gekalibreerd: zonder schild verliest de klas, met ~30% van de klas op
// schild wint ze krap (vergelijkbaar met een samenwerkende klas tegen de
// Cycloop), met meer schild wint ze veilig maar duurt het veel langer.
const BOSS_ENRAGE_DMG_MULT = 1.35;
const BOSS_ENRAGE_MAX_BLOCK = 0.8;

function bmBossResolveTick(boss, ctx){
  const {classMaxHP, bossMaxHP, diffM, noDamageAnswerCount, bossId, dmgDealtThisRound=0, shieldThisRound=0, labyrinthBroken=false, playerCount=0} = ctx;
  const b={...boss};
  let classDamage=0, bossHeal=0;
  const events=[];

  // ---- Hydra: regen bij een te zwakke ronde ----
  if(bossId==="hydra" && bossMaxHP){
    const threshold=0.03*bossMaxHP, regen=0.02*bossMaxHP;
    if(dmgDealtThisRound<threshold){
      bossHeal+=regen;
      events.push({type:"boss_regen", heal:Math.round(regen)});
    }
  }

  // ---- Cycloop: metgezellenmaaltijd-countdown ----
  if(bossId==="cyclops" && bossMaxHP){
    b.mealCycle=(b.mealCycle||0)+1;
    // De dreiging begint pas NA deze ronde: het schild van de ronde waarin
    // hij aangekondigd wordt telt niet mee (niemand wist er toen nog van) —
    // zo heeft de klas echt 2 gewaarschuwde rondes om te reageren.
    if(!b.charging && b.mealCycle>=3){
      b.charging=true; b.chargeLeft=2; b.mealCycle=0;
      b.mealNeed=bmBossShieldNeed(playerCount,diffM);
      events.push({type:"boss_meal_warn",need:b.mealNeed});
    }
    else if(b.charging){
      if(shieldThisRound>=(b.mealNeed||Math.ceil(8*diffM))){
        b.charging=false; b.chargeLeft=0;
        events.push({type:"boss_meal_interrupted"});
      } else {
        b.chargeLeft=(b.chargeLeft||1)-1;
        if(b.chargeLeft<=0){
          b.charging=false;
          const mealDmg=Math.round(classMaxHP*0.06*diffM);
          const mealHeal=0.04*bossMaxHP;
          classDamage+=mealDmg; bossHeal+=mealHeal;
          events.push({type:"boss_meal_attack", dmg:mealDmg, heal:Math.round(mealHeal)});
        }
      }
    }
  }

  // ---- Minotaurus: Enrage (blijvend) zodra het Labyrinth breekt of fase 3 ----
  if(bossId==="minotaur" && !b.enraged && (labyrinthBroken || (b.phase||1)>=3)){
    b.enraged=true;
    events.push({type:"boss_enrage", cause:labyrinthBroken?"laby":"phase"});
  }
  const enraged=bossId==="minotaur" && !!b.enraged;
  if(enraged) b.parryNeed=bmBossShieldNeed(playerCount,diffM);

  // ---- Basisaanval (in Enrage: elke ronde en zwaarder) ----
  b.roundsSinceAttack=(b.roundsSinceAttack||0)+1;
  const cadence=enraged?1:(BOSS_ROUNDS_PER_ATTACK[b.phase||1]||1);
  if(b.roundsSinceAttack>=cadence){
    b.roundsSinceAttack=0;
    let dmg=Math.round(classMaxHP*0.05*diffM*(enraged?BOSS_ENRAGE_DMG_MULT:1));
    let blocked=0;
    if(enraged && shieldThisRound>0){
      const frac=Math.min(1, shieldThisRound/(b.parryNeed||1));
      blocked=Math.round(dmg*BOSS_ENRAGE_MAX_BLOCK*frac);
      dmg-=blocked;
    }
    classDamage+=dmg;
    events.push(enraged?{type:"boss_attack",dmg,enraged:true,blocked}:{type:"boss_attack",dmg});
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

  return{boss:b,classDamage,bossHeal,events};
}

// Host-only statusregel voor boss-mechanics (Cycloop-countdown/Minotaurus-
// schild) — bewust ALLEEN via bmHostUpdateNote() in battle.js (het
// hostscherm/projectiescherm), niet op losse leerling-toestellen.
function bmBossStatusNote(){
  if(BM_META?.mode!=="boss") return "";
  const preset=bmBossPreset(BM_META?.bossId);
  // Total War-belegering: rondelimiet zichtbaar maken (TW_SIEGE_MAX_ROUNDS,
  // totalwar.js §5.4.1) — zonder dit zou de klas niet weten dat er
  // tijdsdruk staat vóórdat de terugtrekking ineens gebeurt.
  if(BM_META?.garrisonProvince && typeof TW_SIEGE_MAX_ROUNDS==="number"){
    // Catapult (TOTAL_WAR.md §5.9) verhoogt deze limiet voor de duur van
    // precies deze aanvalspoging — twEffectiveSiegeMaxRounds() (totalwar.js).
    const maxRounds=twEffectiveSiegeMaxRounds(BM_META.garrisonProvince);
    const n=BM_STATE?.round?.n||1;
    const left=Math.max(0,maxRounds-n+1);
    return "⏳ Ronde "+n+"/"+maxRounds+(left<=5?" — nog "+left+" over, bijna terugtrekken!":"");
  }
  // Alle actieve dreigingen naast elkaar — vroeger gaf dit er maar één terug,
  // waardoor de Cycloop-maaltijdwaarschuwing onzichtbaar bleef zolang er
  // handlangers leefden (precies de fase waarin hij het vaakst dreigt).
  return bmBossAlerts().map(a=>a.short).join(" · ");
}

// Actieve baas-dreigingen als lijst {id, kind, short, title, text}. Gedeeld
// door de statusregel onder het slagveld (host) en de grote banner bovenin het
// slagveld (host én leerling-toestellen, bmBossAlertHTML()).
// kind: "danger" (rood, pulserend — nu ingrijpen!) of "info" (goud).
function bmBossAlerts(){
  if(BM_META?.mode!=="boss" || BM_META?.garrisonProvince) return [];
  const preset=bmBossPreset(BM_META?.bossId);
  const diffM=bmBossDiff(BM_META?.bossDifficulty).m;
  const out=[];
  if(preset.id==="cyclops" && BM_BOSS?.charging){
    const n=BM_BOSS.chargeLeft||0, need=BM_BOSS.mealNeed||Math.ceil(8*diffM);
    out.push({id:"meal", kind:"danger",
      short:"⚠️ Maaltijd "+(n<=1?"na DEZE ronde":"over "+n+" rondes")+" — samen ≥"+need+" schild!",
      title:"🍖 Polyfemus wil eten! "+(n<=1?"Laatste kans: DEZE ronde":"Nog "+n+" rondes"),
      text:"Zet samen minstens <b>"+need+" schild</b> in (één ronde) om hem te onderbreken — iedereen kan gratis <b>🛡️ Schild heffen</b> (+2). Anders verslindt hij metgezellen: schade aan de klas én hij geneest zichzelf."});
  }
  if(preset.id==="minotaur" && (BM_BOSS?.labyrinthShield>0)){
    const s=Math.round(BM_BOSS.labyrinthShield);
    out.push({id:"laby", kind:"info", short:"🛡️ Labyrinth-schild: "+s,
      title:"🛡️ Labyrinth-schild: "+s, text:"Al je schade gaat eerst naar het schild. Breekt het, dan raakt de Minotaurus in <b>Enrage</b> en slaat hij harder!"});
  }
  if(preset.id==="minotaur" && BM_BOSS?.enraged){
    const pct=Math.round(BOSS_ENRAGE_DMG_MULT*100-100);
    out.push({id:"enrage", kind:"danger", short:"😤 Enrage — elke ronde een aanval, +"+pct+"% schade",
      title:"😤 De Minotaurus is in Enrage!",
      text:"Hij valt <b>elke ronde</b> aan en slaat <b>"+pct+"% harder</b>. Vang zijn klap samen op: met <b>"+(BM_BOSS.parryNeed||"genoeg")+" schild</b> houd je "+Math.round(BOSS_ENRAGE_MAX_BLOCK*100)+"% tegen (minder schild = minder). Iedereen kan gratis <b>🛡️ Schild heffen</b> — verdeel de klas over schild en aanval!"});
  }
  const live=(BM_BOSS?.minions||[]).filter(m=>m.hp>0);
  if(live.length){
    const tot=live.reduce((s,m)=>s+m.hp,0);
    out.push({id:"minions", kind:"info",
      short:"👹 "+live.length+" handlanger"+(live.length===1?"":"s")+" ("+tot+" HP) — schade op de baas gehalveerd",
      title:"👹 "+live.length+" handlanger"+(live.length===1?" beschermt":"s beschermen")+" "+esc(bmBossShortNm(preset.id,true)),
      text:"Zolang ze leven doet elke aanval op de baas maar <b>half</b> zoveel schade. Kies ze als <b>doelwit</b> — Pijlregen en Vuurtoren raken ze allemaal tegelijk."});
  }
  return out;
}

// Korte baasnaam voor meldingen: "Polyfemus", "De Hydra", "De Minotaurus".
// mid=true: midden in een zin ("de Hydra").
function bmBossShortNm(id,mid){
  const w=bmBossPreset(id).nm.split(" ");
  const s=w[0]==="De"?w.slice(0,2).join(" "):w[0];
  return mid?s.replace(/^De /,"de "):s;
}

// Banner bovenin het slagveld met de actieve dreigingen (zie bmBossAlerts).
function bmBossAlertHTML(){
  return bmBossAlerts().map(a=>`<div class="bm-boss-alert ${a.kind}">
    <div class="bm-boss-alert-t">${a.title}</div><div class="bm-boss-alert-x">${a.text}</div></div>`).join("");
}

// Grote, kortstondige melding midden op het slagveld voor wat de baas deze
// ronde deed (log-entry.bossEvents, zie bmBossResolveTick hierboven en de
// handlanger-oproep in bmResolve(), battle.js). Aangeroepen vanuit
// bmPlayAnimations() — draait dus op het projectiescherm én de leerling-
// toestellen. De gewone basisaanval krijgt bewust géén kaart (zou elke ronde
// zijn), alleen een drijvend getal.
function bmBossAnnounce(bossEvents){
  if(BM_META?.mode!=="boss" || !Array.isArray(bossEvents) || !bossEvents.length) return;
  const nm=bmBossShortNm(BM_META?.bossId), nmMid=bmBossShortNm(BM_META?.bossId,true);
  const cards=[];
  for(const e of bossEvents){
    if(e.type==="boss_meal_warn") cards.push({k:"danger", t:"🍖 "+nm+" krijgt honger!", x:"Over 2 rondes eet hij metgezellen op. Zet samen "+(e.need?e.need+" ":"")+"schild in — iedereen kan gratis 🛡️ Schild heffen!"});
    else if(e.type==="boss_meal_interrupted") cards.push({k:"good", t:"🛡️ Maaltijd onderbroken!", x:"Jullie gezamenlijke schild hield "+nmMid+" tegen."});
    else if(e.type==="boss_meal_attack") cards.push({k:"danger", t:"🍖 "+nm+" verslindt metgezellen!", x:"−"+e.dmg+" HP voor de klas · "+nm+" geneest +"+e.heal+" HP"});
    else if(e.type==="boss_rage_attack") cards.push({k:"danger", t:"😡 "+nm+" ontsteekt in woede!", x:"Te veel gemiste antwoorden — extra aanval: −"+e.dmg+" HP"});
    else if(e.type==="boss_regen") cards.push({k:"warn", t:"🐍 Koppen groeien terug!", x:"Te weinig schade deze ronde — de Hydra geneest +"+e.heal+" HP"});
    else if(e.type==="boss_enrage") cards.push({k:"danger",
      t:e.cause==="laby"?"💥 Het Labyrinth is doorbroken!":"😤 "+nm+" raakt in Enrage!",
      x:e.cause==="laby"?nm+" raakt in Enrage: hij valt nu elke ronde aan en slaat "+Math.round(BOSS_ENRAGE_DMG_MULT*100-100)+"% harder!"
                        :"Hij valt nu elke ronde aan en slaat "+Math.round(BOSS_ENRAGE_DMG_MULT*100-100)+"% harder. Vang zijn klappen samen op met schild!"});
    else if(e.type==="boss_minions") cards.push({k:"warn", t:"👹 "+nm+" roept "+e.n+" handlangers op!", x:"Schade op de baas wordt gehalveerd tot ze verslagen zijn."});
    else if(e.type==="boss_minion_down") cards.push({k:"good", t:"💀 Handlanger verslagen!", x:e.left?"Nog "+e.left+" over.":"Allemaal weg — volle schade op de baas!"});
  }
  const parried=bossEvents.reduce((s,e)=>s+(e.type==="boss_attack"&&e.blocked?e.blocked:0),0);
  if(parried>0 && typeof bmFloat==="function") setTimeout(()=>bmFloat("🛡️ "+parried+" opgevangen","#7fb2ff",2),800);
  const heal=bossEvents.reduce((s,e)=>s+((e.type==="boss_meal_attack"||e.type==="boss_regen")?(e.heal||0):0),0);
  if(heal>0 && typeof bmFloat==="function") setTimeout(()=>bmFloat("+"+heal+" 🩸","var(--green-bright)",3),700);
  const cont=document.getElementById("bmBfx"); if(!cont) return;
  cards.forEach((c,i)=>setTimeout(()=>{
    const d=document.createElement("div");
    d.className="bm-boss-card "+c.k;
    d.innerHTML=`<div class="bm-boss-card-t">${c.t}</div><div class="bm-boss-card-x">${c.x}</div>`;
    cont.appendChild(d);
    setTimeout(()=>d.remove(),3400);
  },900+i*1800));
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
  // Militie op tier 0 is nog geen echt garnizoen — gewoon de boeren.
  const nm = (key==="militia" && tier===0) ? "De Boeren" : (TW_STAGE_NAME[key]||"Het Garnizoen");
  // Achtergrondlaag: het torenspoor (boerderij/wachttoren/fort) is altijd de
  // "plek" van de belegering, ongeacht welk werk nu bevochten wordt — puur
  // decor, hoeft zelf niet verslagen te worden (tenzij dat toevallig de
  // huidige stage zelf is, dan is bgImg gelijk aan img en tonen we 'm niet dubbel).
  const towerTier=twStructureTier(gp[TW_STRUCTURES.towers.field]);
  const bgImg=twSpriteFor("towers",towerTier,gp.defenderCivId);
  return { key, tier, nm, img:twSpriteFor(key,tier,gp.defenderCivId), bgImg };
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
    const showBg = stageInfo.bgImg && stageInfo.bgImg!==stageInfo.img;
    const bgLayer = showBg
      ? `<img src="${stageInfo.bgImg}?${SPRITE_VER}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain;opacity:.6" alt="" onerror="this.style.display='none'">`
      : "";
    art = stageInfo.img
      ? `<div class="bm-boss-art" style="filter:drop-shadow(0 0 14px ${preset.color}66)">
           ${bgLayer}
           <img src="${stageInfo.img}?${SPRITE_VER}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain" alt="" onerror="this.style.display='none'">
         </div>`
      : `<div class="bm-boss-emoji" style="filter:drop-shadow(0 0 10px ${preset.color}88)">${preset.emoji}</div>`;
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
    art=`<div class="bm-boss-art" style="filter:drop-shadow(0 0 14px ${preset.color}66)">${layers.join("")}</div>`;
  } else {
    art=`<div class="bm-boss-emoji" style="filter:drop-shadow(0 0 10px ${preset.color}88)">${preset.emoji}</div>`;
  }

  // Handlangers (Minion Summon, BOSS_BATTLE.md §4) als kleinere figuren
  // vóór de baas, elk met eigen HP-balk en hetzelfde nummer als de
  // doelwit-chip op de leerling-toestellen (bmMinionLabel). Zolang ze leven
  // krijgt de baas een blauwe schildgloed: schade op hem wordt gehalveerd.
  const live=(boss?.minions||[]).filter(m=>m.hp>0);
  // Zonder eigen handlanger-tekening: een kleinere, donkerdere versie van de
  // baas zelf (Hydra: romp + alle koppen = een jonge hydra).
  const mLayers=preset.minionImg?[preset.minionImg]:preset.img?[preset.img,...(preset.heads||[])]:[];
  const minions=live.length?`<div class="bm-minions">${live.map(m=>{
    const f=m.maxHp?Math.max(0,Math.min(1,m.hp/m.maxHp)):0;
    return `<div class="bm-minion">
      ${mLayers.length?`<div class="bm-minion-art">${mLayers.map(src=>`<img src="${src}?${SPRITE_VER}" alt="">`).join("")}</div>`:`<div class="bm-minion-emoji">${preset.emoji}</div>`}
      <div class="bm-minion-hp"><div style="transform:scaleX(${f})"></div></div>
      <div class="bm-minion-nm">${bmMinionLabel(m)}<br><span>${m.hp} HP</span></div>
    </div>`;}).join("")}</div>`:"";
  if(live.length) art=art.replace('class="bm-boss-art"','class="bm-boss-art shielded"').replace('class="bm-boss-emoji"','class="bm-boss-emoji shielded"');

  return `<div class="bm-fcol" style="align-items:center;justify-content:center;flex:1">
    <div class="bm-boss-row">
      ${minions}
      <div class="bm-av" style="text-align:center">
        ${art}
        <div class="avn">${esc(displayNm)}</div>
        <div class="avncls">Fase ${phase} · Rage ${rage}%${live.length?" · 🛡️ beschermd":""}</div>
      </div>
    </div>
  </div>`;
}

// Vast nummer per handlanger (uit zijn id "m0".."m3"), zodat "Handlanger 2"
// op het slagveld en op de doelwit-chip dezelfde blijft, ook als nummer 1 al
// verslagen is.
function bmMinionLabel(m){
  const n=parseInt(String(m?.id||"").replace(/\D/g,""),10);
  return "Handlanger "+(isNaN(n)?"?":n+1);
}

/* ============================================================================
   HALL OF FAME (BOSS_BATTLE.md §8.1)
   Elke gewonnen Boss Battle (niet de Total War-belegeringen) wordt — als de
   host als docent is ingelogd — vastgelegd onder bossHof/{docentUid}/{id}:
   per docent gescheiden, net als de Total War-campagnes. De groep is de
   klascode van de meeste deelnemers (identityKey "klas:leerling").
   Records per baas: snelste / meeste schade één speler / minste HP verloren
   per baas+moeilijkheid, "Hoogste moeilijkheid" over alle niveaus heen.
   ============================================================================ */
let BM_HOF_RETURN="battleHome", BM_HOF_BOSS=null, BM_HOF_DIFF="all", BM_HOF_CACHE=null, BM_HOF_RESULT=null;

function bmBossHofOwner(){
  return (typeof teacherNet==="function" && teacherNet().isTeacherLoggedIn()) ? teacherNet().getTeacherUid() : null;
}
// Klascode met de meeste deelnemers (bots en gasten zonder profiel tellen niet).
function bmBossHofKlas(players){
  const cnt={};
  (players||[]).forEach(p=>{
    const k=String(p?.identityKey||"").split(":")[0];
    if(k && k!=="bot") cnt[k]=(cnt[k]||0)+1;
  });
  const top=Object.entries(cnt).sort((a,b)=>b[1]-a[1]);
  return top.length ? top[0][0] : "Gastgroep";
}
function bmHofDiffIdx(d){ return Math.max(0,BOSS_DIFF_ORDER.indexOf(d)); }
function bmHofHpPct(e){ return e.hpMax ? Math.max(0,e.hpLeft||0)/e.hpMax : 0; }
function bmHofDur(ms){ const m=Math.floor(ms/60000), s=Math.round((ms%60000)/1000); return m+":"+String(s).padStart(2,"0")+" min"; }
function bmHofDate(ts){
  const d=new Date(ts||0);
  return d.toLocaleDateString("nl-NL",{day:"numeric",month:"short",year:"numeric"})+" "+d.toLocaleTimeString("nl-NL",{hour:"2-digit",minute:"2-digit"});
}
// Vergelijkers: <0 betekent "a is beter dan b".
const BM_HOF_CATS=[
  {id:"fast", nm:"Snelste overwinning", emoji:"⚡", perDiff:true,
    cmp:(a,b)=>(a.rounds-b.rounds)||((a.durMs||1e12)-(b.durMs||1e12)),
    val:e=>e.rounds+" rondes"+(e.durMs?" · "+bmHofDur(e.durMs):"")},
  {id:"dmg", nm:"Meeste schade (één speler)", emoji:"⚔️", perDiff:true,
    cmp:(a,b)=>(b.topDmg||0)-(a.topDmg||0),
    val:e=>(e.topDmg||0)+" schade"+(e.topNm?" — "+e.topNm:"")},
  {id:"hp", nm:"Minste klas-HP verloren", emoji:"🛡️", perDiff:true,
    cmp:(a,b)=>bmHofHpPct(b)-bmHofHpPct(a),
    val:e=>Math.round(bmHofHpPct(e)*100)+"% HP over"},
  {id:"diff", nm:"Hoogste moeilijkheid", emoji:"👑", perDiff:false,
    cmp:(a,b)=>(bmHofDiffIdx(b.diff)-bmHofDiffIdx(a.diff))||(a.rounds-b.rounds),
    val:e=>bmBossDiff(e.diff).nm+" · "+e.rounds+" rondes"},
];
// Beste entry per categorie. diff="all": de perDiff-categorieën over alle
// niveaus heen; anders alleen dat niveau ("Hoogste moeilijkheid" kijkt altijd
// naar alles van deze baas).
function bmBossHofRecords(entries,bossId,diff){
  const ofBoss=entries.filter(e=>e.bossId===bossId);
  return BM_HOF_CATS.map(cat=>{
    const pool=(cat.perDiff&&diff!=="all")?ofBoss.filter(e=>e.diff===diff):ofBoss;
    return {cat, best:[...pool].sort(cat.cmp)[0]||null};
  });
}
async function bmBossHofLoad(owner){
  if(!fbDB||!owner) return [];
  const snap=await fbDB.ref("bossHof/"+owner).once("value");
  return Object.entries(snap.val()||{}).map(([id,e])=>({id,...e}));
}

// Aangeroepen door bmHostResult() (battle.js) met een momentopname van het
// gevecht, vóór cleanup()/reset. Resultaat komt in BM_HOF_RESULT terecht
// (gelezen door de overwinningskaart in bmNextAward). Schrijffouten (bv.
// rules nog niet gepubliceerd) mogen de prijsuitreiking nooit blokkeren.
async function bmBossHofRecord(snap){
  BM_HOF_RESULT=null;
  try{
    if(!snap || snap.mode!=="boss" || snap.garrison || snap.winner!=="A") return null;
    if(!snap.bossId || !BOSS_PRESET_ORDER.includes(snap.bossId)) return null;
    const owner=bmBossHofOwner();
    if(!owner||!fbDB) return (BM_HOF_RESULT={saved:false, reason:"login"});
    const players=snap.players||[];
    const top=[...players].sort((a,b)=>(b.damage||0)-(a.damage||0))[0];
    const now=Date.now();
    const entry={
      bossId:snap.bossId, diff:snap.diff||"normal", klas:bmBossHofKlas(players),
      ts:now, rounds:Math.max(1,snap.rounds||1),
      durMs:snap.startedAt?Math.max(0,now-snap.startedAt):0,
      n:players.length, hpLeft:Math.max(0,Math.round(snap.hpLeft||0)), hpMax:Math.round(snap.hpMax||0),
      topNm:String(top?.name||"").slice(0,40), topDmg:Math.round(top?.damage||0),
      totalDmg:Math.round(players.reduce((s,p)=>s+(p.damage||0),0)),
    };
    const before=await bmBossHofLoad(owner);
    const newRecords=bmBossHofRecords(before,entry.bossId,entry.diff)
      .filter(({cat,best})=>best && cat.cmp(entry,best)<0).map(({cat})=>cat.emoji+" "+cat.nm);
    const first=!before.some(e=>e.bossId===entry.bossId&&e.diff===entry.diff);
    await fbDB.ref("bossHof/"+owner).push(entry);
    BM_HOF_CACHE=null;
    return (BM_HOF_RESULT={saved:true, entry, first, newRecords});
  }catch(e){
    console.warn("Hall of Fame opslaan mislukt",e);
    return (BM_HOF_RESULT={saved:false, reason:"error"});
  }
}

// HTML-blokje voor de overwinningskaart in de prijsuitreiking.
function bmBossHofBadgeHTML(){
  const r=BM_HOF_RESULT;
  if(!r) return "";
  if(!r.saved) return r.reason==="login"
    ? `<div class="note" style="margin-top:8px">Log in als docent om overwinningen in de 🏆 Hall of Fame te bewaren.</div>` : "";
  const lines=r.first
    ? ["Eerste overwinning op "+esc(bmBossPreset(r.entry.bossId).nm)+" ("+esc(bmBossDiff(r.entry.diff).nm)+")!"]
    : r.newRecords.map(t=>"Nieuw record: "+esc(t));
  return `<div class="bm-hof-badge">
    <div class="bm-hof-badge-t">🏆 ${esc(r.entry.klas)} staat in de Hall of Fame</div>
    ${lines.map(l=>`<div class="bm-hof-badge-x">${l}</div>`).join("")}
  </div>`;
}

function bmOpenBossHof(ret,bossId){
  BM_HOF_RETURN=ret||"battleHome";
  if(bossId && BOSS_PRESET_ORDER.includes(bossId)) BM_HOF_BOSS=bossId;
  go("bossHallOfFame");
}
async function bmBossHofDelete(id){
  const owner=bmBossHofOwner(); if(!owner||!id) return;
  if(!confirm("Deze overwinning uit de Hall of Fame verwijderen?")) return;
  try{ await fbDB.ref("bossHof/"+owner+"/"+id).remove(); BM_HOF_CACHE=null; SCREENS.bossHallOfFame(); }
  catch(e){ toast("Verwijderen mislukt", String(e?.message||e).slice(0,100)); }
}

/* ---- SCHERM: bossHallOfFame ---- */
SCREENS.bossHallOfFame = async function(){
  const owner=bmBossHofOwner();
  if(!BM_HOF_BOSS || !BOSS_PRESET_ORDER.includes(BM_HOF_BOSS)) BM_HOF_BOSS=BOSS_PRESET_ORDER[0];
  const head=`<div class="scrhead"><button class="back" onclick="go(BM_HOF_RETURN)">${iconSVG("shield",20,"currentColor")}</button><h2>🏆 Hall of Fame</h2></div>`;
  if(!owner){
    H(brand(false)+head+`<div class="panel"><div class="note">De Hall of Fame wordt per docent bijgehouden. Log in als docent en host daarna je Boss Battle, dan worden de overwinningen van je klassen hier bewaard.</div></div>`+foot());
    return;
  }
  H(brand(false)+head+`<div id="bmHofBody"><div class="panel"><div class="note" style="text-align:center">Laden…</div></div></div>`+foot());
  let entries=null;
  try{ entries=BM_HOF_CACHE||await bmBossHofLoad(owner); BM_HOF_CACHE=entries; }catch(e){}
  const body=el("bmHofBody"); if(!body) return;
  if(!entries){ body.innerHTML=`<div class="panel"><div class="note">Kon de Hall of Fame niet laden.</div></div>`; return; }
  const bossId=BM_HOF_BOSS, preset=bmBossPreset(bossId), diff=BM_HOF_DIFF;
  const recs=bmBossHofRecords(entries,bossId,diff);
  const list=entries.filter(e=>e.bossId===bossId&&(diff==="all"||e.diff===diff)).sort((a,b)=>(b.ts||0)-(a.ts||0));
  const cnt=id=>entries.filter(e=>e.bossId===id).length;
  body.innerHTML=`
  <div class="panel">
    <div class="chips">${BOSS_PRESET_ORDER.map(id=>{const p=BOSS_PRESETS[id];return `<button class="chip ${bossId===id?"on":""}" onclick="BM_HOF_BOSS='${id}';SCREENS.bossHallOfFame()">${p.emoji} ${esc(p.nm)} (${cnt(id)})</button>`;}).join("")}</div>
    <div class="chips" style="margin-top:6px">
      <button class="chip ${diff==="all"?"on":""}" onclick="BM_HOF_DIFF='all';SCREENS.bossHallOfFame()">Alle niveaus</button>
      ${BOSS_DIFF_ORDER.map(id=>`<button class="chip ${diff===id?"on":""}" onclick="BM_HOF_DIFF='${id}';SCREENS.bossHallOfFame()">${BOSS_DIFFICULTIES[id].nm}</button>`).join("")}
    </div>
  </div>
  <div class="bm-hof-grid">
    ${recs.map(({cat,best})=>`<div class="bm-hof-rec">
      <div class="bm-hof-rec-h">${cat.emoji} ${esc(cat.nm)}${(!cat.perDiff&&diff!=="all")?` <span class="note">(alle niveaus)</span>`:""}</div>
      ${best?`<div class="bm-hof-rec-klas" style="color:${preset.color}">${esc(best.klas)}</div>
        <div class="bm-hof-rec-v">${esc(cat.val(best))}</div>
        <div class="note">${esc(bmBossDiff(best.diff).nm)} · ${esc(bmHofDate(best.ts))}</div>`
      :`<div class="note" style="margin-top:6px">Nog niet verslagen${diff!=="all"&&cat.perDiff?" op dit niveau":""}.</div>`}
    </div>`).join("")}
  </div>
  <div class="panel">
    <label class="fld">Alle overwinningen op ${esc(preset.nm)}${diff!=="all"?" ("+esc(bmBossDiff(diff).nm)+")":""}</label>
    ${list.length?`<div style="overflow-x:auto"><table class="bm-hof-table">
      <tr><th>Datum</th><th>Groep</th><th>Niveau</th><th>Rondes</th><th>Tijd</th><th>Spelers</th><th>HP over</th><th>Topschade</th><th></th></tr>
      ${list.map(e=>`<tr>
        <td>${esc(bmHofDate(e.ts))}</td><td><b>${esc(e.klas||"?")}</b></td><td>${esc(bmBossDiff(e.diff).nm)}</td>
        <td>${e.rounds}</td><td>${e.durMs?esc(bmHofDur(e.durMs)):"—"}</td><td>${e.n||"—"}</td>
        <td>${Math.round(bmHofHpPct(e)*100)}%</td><td>${e.topDmg||0}${e.topNm?" — "+esc(e.topNm):""}</td>
        <td><button class="bm-hof-del" title="Verwijderen" onclick="bmBossHofDelete('${esc(e.id)}')">✕</button></td>
      </tr>`).join("")}
    </table></div>`:`<div class="note">Nog geen overwinningen${diff!=="all"?" op dit niveau":""}. Versla ${esc(preset.nm)} in Boss Battle om hier te verschijnen!</div>`}
  </div>`;
};
