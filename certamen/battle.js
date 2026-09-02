/* ============================================================================
   ⚔️  BATTLE MODE — Milestone 3
   Identiteitssysteem · Host · Speler · Rondelus · Resultaat
   8 klassen (data-gedreven) · Synergie · Combo-abilities · Class Mastery
   ============================================================================ */

/* Configuratie- en balanstabellen staan in battle-data.js (vóór dit bestand
   geladen): BM_CLASSES, BM_SYNERGY, BM_COMBOS, facties/themas, BM_COMMANDERS,
   BM_AVATAR_PARTS en de niveau-/mastery-tabellen. */

/* ---- COMMANDER SPECTRE MODULE ---- */
// Herbruikbaar visueel component. Gebruik CommanderSpectre.show(team) vanuit elke game mode.
const CommanderSpectre = (() => {
  // Automatisch afgeleid uit BM_CLASSES — loopt mee met toekomstige ability-wijzigingen.
  const ULTIMATE_IDS = new Set(
    BM_CLASSES.flatMap(c => c.abilities.filter(a => a.tier === "legendary").map(a => a.id))
  );

  function _ensureEls() {
    const field = document.getElementById("bmField");
    if (!field) return false;
    for (const t of ["A", "B"]) {
      if (!document.getElementById("bm-spectre-" + t)) {
        const d = document.createElement("div");
        d.id = "bm-spectre-" + t;
        d.className = "bm-spectre bm-spectre-" + t;
        field.insertBefore(d, field.firstChild);
      }
    }
    return true;
  }

  function show(team) {
    if (BM_META?.animations === false) return;
    // Boss Battle: geen factie-vs-factie — team B (baas) heeft nooit een spectre.
    // Team A krijgt: de mythologische held (boss preset) of, bij een belegering
    // (garrison), de aanvallende beschavingscommandant uit TW_CIV_COMMANDERS.
    let cfg;
    if (BM_META?.mode === "boss") {
      if (team !== "A") cfg = null;
      else if (BM_META.bossId === "garrison") cfg = TW_CIV_COMMANDERS[BM_META.attackerCivId] ?? null;
      else cfg = bmBossPreset(BM_META.bossId)?.hero ?? null;
    } else {
      cfg = BM_COMMANDERS[BM_META?.theme]?.[team] ?? null;
    }
    if (!cfg) return;
    if (!_ensureEls()) return;
    const el = document.getElementById("bm-spectre-" + team);
    if (!el) return;
    el.style.backgroundImage = `url("${cfg.img}")`;
    el.title = cfg.nm;
    el.classList.remove("bm-spectre-active");
    void el.offsetWidth; // herstart animatie
    el.classList.add("bm-spectre-active");
  }

  function isUltimate(abilityId) { return ULTIMATE_IDS.has(abilityId); }

  return { show, isUltimate };
})();

/* ---- BATTLE IDENTITY ---- */
const BM_IDENT_KEY = "certamen_battle_identity";
let BM_IDENT = null;
// Scherm waar de avatar-editor naar terugkeert (gezet door de oproepende knop).
let BM_AV_RETURN = "battleProfile";
// Scherm waar het aanmeldscherm (SCREENS.battleIdentity) na een geslaagde
// login naar terugkeert — default blijft Battle Mode se eigen "battleJoin",
// maar andere aanroepers (bv. Training Mode) zetten dit vooraf om zelf de
// leerling terug te krijgen na het inloggen. Zelfde patroon als BM_AV_RETURN.
let BM_IDENT_RETURN = "battleJoin";
// Kamercode die de unified "Meedoen"-stap (games.js: joinDetectGame) al heeft
// opgezocht — vult #bmJC hieronder alvast in zodat de leerling 'm niet
// nogmaals hoeft te typen. Wordt bij het renderen meteen weer leeggemaakt.
let BM_JOIN_PREFILL_CODE = null;

function bmIdentLoad(){ try{ const r=localStorage.getItem(BM_IDENT_KEY); return r?JSON.parse(r):null; }catch(e){return null;} }
function bmIdentSave(o){ try{ localStorage.setItem(BM_IDENT_KEY,JSON.stringify(o)); }catch(e){} }
function bmIdentClear(){ try{ localStorage.removeItem(BM_IDENT_KEY); }catch(e){} }
async function bmIdentGet(klas,lcode){ if(!fbDB)return null; const s=await fbDB.ref("identities/"+klas+"/"+lcode).once("value"); return s.exists()?s.val():null; }
async function bmIdentCreate(klas,lcode,name){
  const d={name,coins:0,xp:0,battles:0,level:1,avatar:bmAvatarDefaults(),color:P.color,classHistory:{},achievements:[]};
  if(fbDB){
    await fbDB.ref("identities/"+klas+"/"+lcode).set(d);
    // Lichte klascode-index (usedKlascodes/{klas}, zie net.js:
    // FBNet.getKlascodes()/getKlascodeCounts()) meegroeien bij elke nieuwe
    // leerling — voorkomt dat het docentenportaal ooit weer de volledige
    // identities-boom hoeft te lezen.
    fbDB.ref("usedKlascodes/"+klas).transaction(cur=>(cur||0)+1).catch(()=>{});
  }
  return d;
}

/* ---- M6: AVATAR / NIVEAU / MASTERY HELPERS ---- */

function bmAvatarDefaults(){
  return{helm:"geen",haar:"kort",baard:"geen",armor:"vodden",
         schild:"geen",wapen:"knuppel",cape:"geen",kleur:"#b03a2e",victoryAnim:"juichen",
         huid:"licht",haarkleur:"blond",capekleur:"goud",oogkleur:"blauw",borstband:"geen",
         extra:"geen",legendary:"geen",prestige:"geen"};
}
// Migratie van opgeslagen avatars naar het huidige onderdelenmodel. Draait in
// zowel bmAvatarMerge() als spAvatarMerge() (singleplayer.js), zodat een oud
// profiel in Battle Mode én in Chronica hetzelfde wordt bijgewerkt.
//   geslacht (2026-08-28 vervallen): koos een compleet ander lichaam, terwijl
//   base_light_female.png alleen in de borstband van base_light.png bleek te
//   verschillen. "vrouw" wordt dus de borstband; het lichaam is nu enkel nog
//   de huidtint. Het veld blijft in oude saves staan en wordt genegeerd.
// "a" is het al samengevoegde object, "saved" de ruwe opgeslagen avatar — die
// tweede is nodig omdat de defaults borstband altijd invullen, waardoor je aan
// "a" alleen niet meer kunt zien of de speler er ooit zelf iets voor koos.
function bmAvatarMigrate(a, saved){
  if(saved && saved.borstband===undefined && saved.geslacht==="vrouw") a.borstband = "aan";
  return a;
}
function bmAvatarMerge(saved){
  // backward compat: string-avatar (pre-M6) → object
  if(!saved||typeof saved==="string") return bmAvatarDefaults();
  return bmAvatarMigrate({...bmAvatarDefaults(),...saved}, saved);
}

function bmAvatarSVG(av,size=60){
  const a=bmAvatarMerge(av);
  const col=a.kleur||"#b03a2e";
  // Elke id uit BM_AVATAR_PARTS (battle-data.js) hoort hier een eigen vorm te
  // hebben. Ontbreekt er een, dan valt de optie terug op een andere en lijken
  // twee keuzes in de avatar-editor identiek. Zo "verdween" de Knuppel: die
  // stond niet in weapons, viel dus terug op het zwaard, en zodra een leerling
  // niveau 2 haalde en het échte Zwaard erbij kwam, leek de Knuppel er niet
  // meer te zijn. Zelfde gold voor Geen helm/Geen schild, Bandana, Hopliet-helm,
  // Baard en snor, Sik en snor en vijf haarstijlen.
  const armorFill={vodden:"#8a7350",robe:"#6a5a8a",licht:"#9a8870",middel:"#6a5840",
                   hopliet:"#a8712c",zwaar:"#3e3230",kampioen:"#c9a227",ceremonieel:col}[a.armor]||"#9a8870";
  const helmFill={bandana:col,standard:"#7a6a48",open:"#8a7a58",hopliet:"#b07a30",kroon:"#d4af37"}[a.helm]||"#7a6a48";
  const hairCol=(typeof BM_HAARKLEUR_SWATCH!=="undefined"&&BM_HAARKLEUR_SWATCH[a.haarkleur])||"#5c3c1a";
  const hairFill=a.haar==="kaal"?null:hairCol;
  // Zelfde ladder als de sprites (PIXEL_ASSETS.bases), maar dan als één vlakke
  // kleur — dit is de SVG-terugval én de kleine voorbeeldpop in de editor.
  const skin={zeerlicht:"#f0c3a4",licht:"#d4a476",getint:"#bd8f63",
              olijf:"#a8804f",brons:"#8f6a48",donker:"#8a5a34"}[a.huid]||"#d4a476";
  const wc="#c8a860";

  // Ook de drie vleugelcapes krijgen een eigen vorm — anders zijn ze in de
  // editor niet te onderscheiden van "Geen cape".
  const wing=(fill,d)=>`<path d="${d}" fill="${fill}" opacity=".8"/><path d="${d}" fill="${fill}" opacity=".8" transform="translate(60,0) scale(-1,1)"/>`;
  const cape=a.cape==="lang"
    ?`<path d="M18,30 Q7,55 10,76 Q30,70 50,76 Q53,55 42,30" fill="${col}" opacity=".65"/>`
    :a.cape==="kort"
    ?`<path d="M20,30 Q13,50 16,66 Q30,62 44,66 Q47,50 40,30" fill="${col}" opacity=".65"/>`
    :a.cape==="engelenvleugels"
    ?wing("#f2ead6","M24,32 Q10,26 4,36 Q10,38 6,46 Q14,46 16,52 Q22,44 24,32Z")
    :a.cape==="duivelsvleugels"
    ?wing("#7a2020","M24,32 Q10,24 3,32 L9,36 L4,42 L11,42 L9,50 Q19,46 24,32Z")
    :a.cape==="vlindervleugels"
    ?wing("#c07ad0","M24,32 Q12,22 5,30 Q3,38 12,40 Q4,44 8,52 Q18,50 24,32Z")
    :"";

  const shields={
    geen:"",
    rond:`<circle cx="9" cy="44" r="8" fill="${col}" opacity=".85"/><circle cx="9" cy="44" r="5.5" fill="none" stroke="rgba(255,255,255,.25)" stroke-width="1.2"/>`,
    ovaal:`<ellipse cx="9" cy="44" rx="6" ry="9" fill="${col}" opacity=".85"/>`,
    vierkant:`<rect x="2" y="36" width="14" height="16" rx="2" fill="${col}" opacity=".85"/>`,
    tower:`<path d="M3,32 L3,56 Q9,60 15,56 L15,32 Q12,28 9,32 Q6,28 3,32Z" fill="${col}" opacity=".85"/>`,
  };
  const weapons={
    knuppel:`<path d="M50,58 L49,38 Q45,28 52,19 Q59,28 55,38 L54,58 Z" fill="#8a6a3a"/><circle cx="51" cy="28" r="1.8" fill="#6a4c26"/><circle cx="55" cy="33" r="1.5" fill="#6a4c26"/>`,
    hooivork:`<line x1="52" y1="22" x2="52" y2="60" stroke="#a08040" stroke-width="2.5" stroke-linecap="round"/><line x1="45" y1="22" x2="59" y2="22" stroke="${wc}" stroke-width="2" stroke-linecap="round"/><line x1="46" y1="22" x2="46" y2="13" stroke="${wc}" stroke-width="2" stroke-linecap="round"/><line x1="52" y1="22" x2="52" y2="11" stroke="${wc}" stroke-width="2" stroke-linecap="round"/><line x1="58" y1="22" x2="58" y2="13" stroke="${wc}" stroke-width="2" stroke-linecap="round"/>`,
    zwaard:`<line x1="52" y1="24" x2="52" y2="54" stroke="${wc}" stroke-width="3" stroke-linecap="round"/><line x1="47" y1="37" x2="57" y2="37" stroke="${wc}" stroke-width="2.5" stroke-linecap="round"/>`,
    speer:`<line x1="52" y1="16" x2="52" y2="58" stroke="#a08040" stroke-width="2.5" stroke-linecap="round"/><polygon points="52,10 55,22 49,22" fill="${wc}"/>`,
    boog:`<path d="M52,18 Q62,38 52,58" fill="none" stroke="#a08040" stroke-width="2.5"/><line x1="52" y1="18" x2="52" y2="58" stroke="${wc}" stroke-width="1"/>`,
    staf:`<line x1="52" y1="14" x2="52" y2="60" stroke="#7a5030" stroke-width="3" stroke-linecap="round"/><circle cx="52" cy="12" r="5" fill="#d4af37" opacity=".9"/>`,
  };
  const helms={
    geen:"",
    bandana:`<path d="M18,20 Q30,14 42,20 L42,24 Q30,18 18,24 Z" fill="${helmFill}"/><path d="M42,21 Q47,24 46,30 Q43,27 41,24 Z" fill="${helmFill}" opacity=".85"/>`,
    standard:`<path d="M18,20 Q18,9 30,8 Q42,9 42,20 L40,24 L20,24 Z" fill="${helmFill}"/><rect x="18" y="24" width="24" height="3" rx="1" fill="${helmFill}" opacity=".75"/>`,
    open:`<path d="M19,22 Q19,10 30,9 Q41,10 41,22" fill="none" stroke="${helmFill}" stroke-width="4.5" stroke-linecap="round"/>`,
    hopliet:`<path d="M18,20 Q18,9 30,8 Q42,9 42,20 L40,24 L20,24 Z" fill="${helmFill}"/><path d="M28,26 L28,20 Q30,17 32,20 L32,26 Z" fill="#3a2c1c"/><path d="M20,7 Q30,-2 40,7 Q30,3 20,7 Z" fill="${col}"/>`,
    kroon:`<path d="M18,22 L18,12 L24,17 L30,10 L36,17 L42,12 L42,22 Z" fill="${helmFill}"/>`,
  };
  const hairSVG=!hairFill?"":
     a.haar==="vlecht"
    ?`<path d="M20,22 Q20,14 30,13 Q40,14 40,22" fill="${hairFill}"/><path d="M24,22 Q21,30 24,36" fill="none" stroke="${hairFill}" stroke-width="4" stroke-linecap="round"/>`
    :a.haar==="lang"
    ?`<path d="M20,22 Q20,14 30,13 Q40,14 40,22" fill="${hairFill}"/><path d="M20,22 Q17,32 20,42" fill="none" stroke="${hairFill}" stroke-width="5" stroke-linecap="round"/><path d="M40,22 Q43,32 40,42" fill="none" stroke="${hairFill}" stroke-width="5" stroke-linecap="round"/>`
    :a.haar==="middel"
    ?`<path d="M20,22 Q20,14 30,13 Q40,14 40,22" fill="${hairFill}"/><path d="M19,21 Q17,28 19,33" fill="none" stroke="${hairFill}" stroke-width="5" stroke-linecap="round"/><path d="M41,21 Q43,28 41,33" fill="none" stroke="${hairFill}" stroke-width="5" stroke-linecap="round"/>`
    :a.haar==="wild"
    ?`<path d="M19,22 Q20,13 30,12 Q40,13 41,22 L38,17 L35,21 L32,14 L28,21 L25,15 L22,20 Z" fill="${hairFill}"/>`
    :a.haar==="knot"
    ?`<path d="M20,22 Q20,14 30,13 Q40,14 40,22" fill="${hairFill}"/><circle cx="30" cy="8" r="4.5" fill="${hairFill}"/>`
    :a.haar==="hanekam"
    ?`<path d="M27,20 Q27,8 30,5 Q33,8 33,20 Z" fill="${hairFill}"/>`
    :`<path d="M20,22 Q20,14 30,13 Q40,14 40,22" fill="${hairFill}"/>`;
  const bc=hairFill||"#5c3c1a";
  const beards={
    geen:"",
    baard:`<path d="M22,32 Q30,40 38,32 Q37,38 30,41 Q23,38 22,32" fill="${bc}"/>`,
    snor:`<path d="M24,30 Q30,33 36,30 Q33,33 30,34 Q27,33 24,30" fill="${bc}"/>`,
    baardsnor:`<path d="M22,32 Q30,40 38,32 Q37,38 30,41 Q23,38 22,32" fill="${bc}"/><path d="M24,30 Q30,33 36,30 Q33,33 30,34 Q27,33 24,30" fill="${bc}"/>`,
    sikensnor:`<path d="M24,30 Q30,33 36,30 Q33,33 30,34 Q27,33 24,30" fill="${bc}"/><path d="M27,36 Q30,34 33,36 Q32,40 30,41 Q28,40 27,36 Z" fill="${bc}"/>`,
  };
  const w=size, h=Math.round(size*80/60);
  // Prestige-glans (zie _bmPixelLayers/BM_PRESTIGE_FILTER): dezelfde filter,
  // zodat de kleine onderdeel-swatches in de avatar-editor 'm ook tonen.
  const prestigeStyle = (a.prestige&&a.prestige!=="geen") ? `filter:${BM_PRESTIGE_FILTER};` : "";
  return `<svg viewBox="0 0 60 80" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg" style="display:block;${prestigeStyle}">
    ${cape}${shields[a.schild] ?? shields.rond}
    <rect x="19" y="30" width="22" height="24" rx="3" fill="${armorFill}"/>
    <rect x="19" y="30" width="22" height="5" rx="2" fill="${armorFill}" opacity=".65"/>
    ${/* In de sprites zit de band ónder de wapenrusting; hier bewust erboven,
          anders zijn "Zonder" en "Met" in de editor niet uit elkaar te houden. */
      a.borstband==="aan"?`<rect x="19" y="36" width="22" height="4" rx="1" fill="#4a3f3a"/>`:""}
    <rect x="15" y="34" width="6" height="12" rx="2" fill="${armorFill}" opacity=".8"/>
    <rect x="39" y="34" width="6" height="12" rx="2" fill="${armorFill}" opacity=".8"/>
    ${weapons[a.wapen] ?? weapons.zwaard}
    <circle cx="30" cy="24" r="11" fill="${skin}"/>
    ${hairSVG}${beards[a.baard] ?? ""}${helms[a.helm] ?? helms.standard}
  </svg>`;
}

function bmCalcLevel(xp){
  const lv=calcLevel(xp);  // XP_LEVELS uit core.js
  const lvDef=BM_LEVELS.find(l=>l.level===lv.level)||BM_LEVELS[0];
  return{...lv, title:lvDef.title, unlock:lvDef.unlock};
}
function bmCalcMastery(hist){
  if(!hist)return 0;
  const r=hist.rounds||0, tiers=[5,15,35,70,120];
  let stars=0; for(const t of tiers){if(r>=t)stars++;} return stars;
}
// Leest de Chronica Classica-saves (localStorage, zelfde apparaat/profiel als
// Battle Mode — zie SP_SLOTS_KEY in singleplayer.js) en checkt of ÉÉN van de
// slots de Finale ("Het Ceremoniële Harnas", FIN_BEKRONING) heeft gehaald.
// Bewust alleen localStorage: dit is een synchrone check binnen bmIsUnlocked(),
// en Chronica is toch al offline-first/localStorage-als-bron-van-waarheid.
function bmChronicaFinaleVoltooid(){
  try{
    const slots = JSON.parse(localStorage.getItem("certamen_chronica_slots")||"{}");
    return Object.values(slots).some(s=>s?.flags?.fin_ceremonieel_harnas===true);
  }catch(e){ return false; }
}
function bmIsUnlocked(opt,ident,key){
  if(!opt.requires)return true;
  if(ident?.admin)return true;
  const{level:rL,mastery:rM,coins:rC,achCategory:rCat,prestige:rP,spFinale:rSF}=opt.requires;
  // Coin-onderdeel: alleen ontgrendeld ná aankoop (staat in ident.unlocked).
  if(rC) return (ident?.unlocked||[]).includes(key);
  if(rL&&bmCalcLevel(ident?.xp||0).level<rL)return false;
  if(rM&&!Object.values(ident?.classHistory||{}).some(h=>bmCalcMastery(h)>=rM))return false;
  // prestige:N = pas ontgrendeld ná niveau 10, bij Legioenster N (of hoger) —
  // de hoogste-status-eis in het spel, zie core.js: calcPrestige().
  if(rP&&(bmCalcLevel(ident?.xp||0).prestige?.stars||0)<rP)return false;
  if(rSF&&!bmChronicaFinaleVoltooid())return false;
  if(rCat){
    // Eerbewijzen staan verspreid over P.achievements (algemeen/klassiek) en
    // ident.achievements (Battle Mode/Boss Battle/Total War/mastery) — samen
    // dekken ze elke categorie, zie core.js: achCategoryComplete().
    const achieved=[...new Set([...(P.achievements||[]),...(ident?.achievements||[])])];
    if(!achCategoryComplete(rCat,achieved))return false;
  }
  return true;
}
// Muntnaam volgens thema (Latijn = denarii, Grieks = drachmae).
function bmCoinName(){
  const t=(BM_META&&BM_META.theme)||"";
  return /griek|greek|athen|sparta|troje|troy|goden|titan|olymp/i.test(t) ? "drachmae" : "denarii";
}
function bmStars(n,max=5){
  return Array.from({length:max},(_,i)=>`<span style="color:${i<n?"#d4af37":"var(--stone4)"};font-size:14px">★</span>`).join("");
}
// Leesbare ontgrendel-voorwaarde voor een avatar-optie ({short, full} of null).
function bmReqText(opt){
  const r=opt&&opt.requires; if(!r) return null;
  if(r.level)   return { short:"Niv. "+r.level, full:"Bereik niveau "+r.level };
  if(r.mastery) return { short:r.mastery+"★",   full:r.mastery+"★ beheersing in één klasse (speel veel rondes met die klasse)" };
  if(r.coins)   return { short:r.coins+" 🪙",   full:"Koop voor "+r.coins+" "+bmCoinName() };
  if(r.prestige) return { short:"★"+r.prestige+" Legioen", full:"Bereik Legioenster ★"+r.prestige+" (niveau 10 + "+(r.prestige*PRESTIGE_XP_STEP)+" XP extra) — voor de echte legendes" };
  if(r.spFinale)  return { short:"Chronica ✓", full:"Speel Chronica Classica (Single Player) volledig uit tot en met de Finale" };
  if(r.achCategory){
    const nm=ACH_CATEGORIES[r.achCategory]||r.achCategory;
    return { short:"Alle "+nm, full:"Behaal alle eerbewijzen in de categorie "+nm };
  }
  return null;
}
// Toon de voorwaarde bij het aantikken van een vergrendelde optie (touch-vriendelijk).
function bmShowLockInfo(optNm, full){
  toast("🔒 "+optNm, full+" om dit te ontgrendelen.");
}

// Toekennen van XP en achievements na afloop van een gevecht (player-side).
async function bmAwardBattle(){
  if(!BM_IDENT||!fbDB)return null;
  const{klascode:klas,leerlingcode:lcode}=BM_IDENT;
  if(!klas||!lcode)return null;
  // Eerst de eigen cijfers vastleggen, vóór de eerste await hieronder: zet de
  // docent meteen een nieuw gevecht klaar, dan zet bmResetMatchLocals() deze
  // tellers op nul terwijl de uitkering nog loopt.
  const correct0=BM_MY_CORRECT||0, wrong0=BM_MY_WRONG||0;
  const won0=BM_STATE.winner===BM_MY_TEAM;
  const myDmg0=BM_MY_DMG||0, myHeal0=BM_MY_HEAL||0, myBe0=BM_MY_BE||0;
  const myTeamHealth0=Math.max(0,BM_TEAMS[BM_MY_TEAM]?.health||0);
  // Aandeel van het gevecht dat deze speler heeft meegemaakt (1 = vanaf ronde 1).
  const rounds0=Math.max(1,BM_STATE.round?.n||1);
  const joined0=Math.max(1,BM_PLAYERS[BM_PID]?.joinRound||1);
  const share0=Math.min(1,Math.max(0,(rounds0-joined0+1))/rounds0);
  // Dubbele toekenning voorkomen — per GÉVECHT, niet per kamer. De kamer (en
  // dus de spelcode) blijft bestaan als de docent "Nieuw gevecht — zelfde
  // spelers" gebruikt; met de oude sleutel op BM_CODE kreeg iedereen dan vanaf
  // het tweede gevecht niets meer. state/matchId wordt door bmDistributeQs()
  // bij ronde 1 van elk gevecht ververst. Ontbreekt hij (oudere kamer), dan
  // valt de sleutel terug op de spelcode — zelfde gedrag als voorheen.
  let matchId=null;
  try{ matchId=(await fbDB.ref("rooms/"+BM_CODE+"/state/matchId").once("value")).val(); }catch(e){}
  const guardKey="bm_award_"+BM_CODE+"_"+(matchId||"legacy");
  if(sessionStorage.getItem(guardKey))return{alreadyAwarded:true};
  try{sessionStorage.setItem(guardKey,"1");}catch(e){}

  const correct=correct0, wrong=wrong0, total=correct+wrong;
  const won=won0;
  const isScholar=total>=5&&correct/total>=0.9;
  // Boss Battle-context (ook belegeringen, zie totalwar.js: twStartAttack()
  // zet BM_META.mode="boss" + bossId="garrison") — voor de nieuwe
  // baas-/belegerings-eerbewijzen hieronder in bmCheckAchievements().
  const isBoss=BM_META?.mode==="boss";
  const bossId=BM_META?.bossId;
  const bossDifficulty=BM_META?.bossDifficulty||"normal";
  const isSiegeWin=!!(BM_META?.garrisonProvince)&&won;
  const partySize=Object.values(BM_PLAYERS||{}).filter(p=>p.team==="A").length||1;
  const rageMaxed=!!(BM_BOSS&&BM_BOSS.rageMaxed);
  // XP-formule: +2/goed, +1/beantwoorde vraag, +5 deelname, +15 winst, +8 scholar.
  // De eerste twee zijn wat je zélf gedaan hebt en tellen onverkort mee; de drie
  // vaste bonussen schalen met share0 — wie pas halverwege instapt, krijgt de
  // halve deelname- en winstbonus. Zonder dat verschil leverde instappen in de
  // laatste ronde van een gewonnen gevecht evenveel op als het hele gevecht
  // meespelen, en dat is nu juist het gedrag dat we niet willen belonen.
  const flatXp=5+(won?15:0)+(isScholar?8:0);
  const xpEarned=Math.max(1,Math.round(correct*2+total*1+flatXp*share0));
  // Muntbeloning: alleen deelname + winst (geen munten per goed antwoord —
  // dat liep te snel op). Odysseus (legendarisch) geeft +% bonus.
  const legBonus=bmLegendaryOf(BM_IDENT);
  let coinsEarned=Math.max(1,Math.round((3+(won?10:0))*share0));
  if(legBonus?.incomeMult) coinsEarned=Math.round(coinsEarned*(1+legBonus.incomeMult));

  // Batch 2 — lokale (device-only) toeval-tracking voor trait_drieling en
  // trait_marathonzitting. Beide horen bij "wat er toevallig op dit toestel
  // gebeurde", niet bij het cross-device profiel — vandaar P.stats i.p.v.
  // Firebase, zelfde afweging als bestStreak/currentStreak.
  if(won){
    const margin=myTeamHealth0;
    P.stats.lastWinMargins=[...(P.stats.lastWinMargins||[]),margin].slice(-3);
  } else {
    P.stats.lastWinMargins=[]; // reeks doorbroken bij verlies
  }
  const drieling=(P.stats.lastWinMargins||[]).length===3
    &&P.stats.lastWinMargins.every(v=>v===P.stats.lastWinMargins[0]);
  const nowTs=Date.now();
  P.stats.recentBattleTimestamps=[...(P.stats.recentBattleTimestamps||[]),nowTs]
    .filter(t=>nowTs-t<=3600000);
  const marathonzitting=P.stats.recentBattleTimestamps.length>=3;
  saveProfile();

  // Lees-wijzig-schrijf via transaction() i.p.v. once()+update(): als hetzelfde
  // profiel (klascode+leerlingcode) rond hetzelfde moment vanaf een ander
  // toestel/tabblad wegschrijft, herhaalt Firebase de transactie op de
  // nieuwste stand i.p.v. die overschrijven — xp/munten kunnen zo nooit
  // "verdwijnen" en blijven tussen toestellen synchroon.
  const cls=BM_MY_CLASS;
  let oldXp=0,newXp=0,newCoins=0,battles=0,mergedData=null;
  const identRef=fbDB.ref("identities/"+klas+"/"+lcode);
  await identRef.transaction(cur=>{
    const data=cur||{};
    oldXp=data.xp||0; newXp=oldXp+xpEarned;
    newCoins=(data.coins||0)+coinsEarned;
    battles=(data.battles||0)+1;
    const next={...data,xp:newXp,coins:newCoins,battles};
    if(cls){
      const hist=(data.classHistory&&data.classHistory[cls])||{};
      const firstTime=!hist.rounds; // nog geen classHistory-entry voor deze klasse
      next.classHistory={...(data.classHistory||{}),[cls]:{
        ...hist,
        rounds:(hist.rounds||0)+Math.max(1,total),
        damage:(hist.damage||0)+myDmg0,
        healing:(hist.healing||0)+myHeal0,
      }};
      // trait_volledige_cirkel: legt vast in welke volgorde elke klasse voor
      // het eerst gespeeld werd (nooit herschreven zodra een klasse erin staat).
      if(firstTime&&!(data.classPlayOrder||[]).includes(cls)){
        next.classPlayOrder=[...(data.classPlayOrder||[]),cls];
      }
    }
    mergedData=next;
    return next;
  });
  const data=mergedData||{};
  const oldCoins=Math.max(0,newCoins-coinsEarned);
  const oldLv=bmCalcLevel(oldXp), newLv=bmCalcLevel(newXp);
  const merged={...data,achievements:data.achievements||[]};
  BM_IDENT={...BM_IDENT,...merged};
  bmIdentSave({...bmIdentLoad(),...BM_IDENT});

  // Lokaal profiel (core.js) bijwerken
  P.stats.battlesPlayed++; if(won)P.stats.battlesWon++;
  P.stats.totalCorrect+=correct; P.stats.totalWrong+=wrong;
  P.stats.totalDamage+=myDmg0; P.stats.totalHealing+=myHeal0;
  // skipSync=true: de xp-/muntenwinst staat al in de identities/{klas}/{lcode}-
  // transactie hierboven; nogmaals syncen zou 'm dubbel optellen. P.coins en
  // BM_IDENT.coins zijn dezelfde portemonnee (zie core.js: addCoins/syncCoinsDelta).
  addXP(xpEarned, true);  // addXP roept saveProfile() aan
  addCoins(coinsEarned, true);
  checkAch({mode:"battle", won, isScholar});

  const totalPlayers=Object.keys(BM_PLAYERS||{}).length;
  const earned=await bmCheckAchievements(merged,{won,isScholar,isBoss,bossId,bossDifficulty,isSiegeWin,partySize,rageMaxed,
    clutchStreak:BM_MY_CLUTCH_BEST, noAbilitiesUsed:BM_MY_ABILITIES_USED===0, myClass:cls,
    largeGame:totalPlayers>=12, healedEnough:myHeal0>=40,
    // Batch 2
    noBeLeft:won&&myBe0===0, drieling, noCorrect:won&&correct===0,
    isPacifist:won&&cls==="priester"&&!BM_MY_DEALT_DMG_ABILITY,
    nightWatch:new Date().getHours()<5, marathonzitting,
    classPicks:BM_MY_CLASS_PICKS||0});
  // Eenmalige munten-bonus voor nieuw ontgrendelde traits (naast de gewone
  // deelname/winst-munten hierboven) — zie TRAIT_COIN_BONUS.
  const coinBonus=earned.reduce((s,id)=>s+(TRAIT_COIN_BONUS[id]||0),0);
  if(coinBonus>0){ identRef.child("coins").transaction(cur=>(cur||0)+coinBonus); addCoins(coinBonus, true); }
  // oldXp/newXp en oldCoins/newCoins gaan mee terug zodat het resultaatscherm
  // "van … naar …" kan laten meetellen (bmRenderXpGain).
  return{xpEarned,coinsEarned,oldXp,newXp,oldCoins,newCoins,
         joinRound:joined0,rounds:rounds0,share:share0,
         legendaryBonus:legBonus,oldLv,newLv,levelUp:newLv.level>oldLv.level,earned};
}
async function bmCheckAchievements(ident,result={}){
  if(!fbDB||!BM_IDENT)return[];
  const{klascode:klas,leerlingcode:lcode}=BM_IDENT;
  if(!klas||!lcode)return[];
  const current=ident.achievements||[], newOnes=[];
  const check=(id,cond)=>{if(!current.includes(id)&&cond)newOnes.push(id);};
  check("eerste_gevecht",true);
  check("scholar",result.isScholar);
  check("onbreekbaar",result.won&&result.noHealthLoss);
  check("overwinnaar",result.won);
  check("trait_ciceronianus",(result.clutchStreak||0)>=5);
  check("trait_laconisch",result.won&&result.myClass==="spartaan"&&result.noAbilitiesUsed);
  check("geheim_groot",result.largeGame);
  check("geheim_heal",result.healedEnough);
  const clsPlayed=Object.keys(ident.classHistory||{});
  check("strateeg",clsPlayed.length>=5);
  check("commandant",clsPlayed.length>=8);
  for(const cls of BM_CLASSES){
    const stars=bmCalcMastery(ident.classHistory?.[cls.id]);
    check("vet_"+cls.id, stars>=3);
    check("mees_"+cls.id, stars>=5);
  }
  check("grootmeester", BM_CLASSES.every(cls=>bmCalcMastery(ident.classHistory?.[cls.id])>=5));

  // Batch 2 — puur-toeval-traits (trait_balans/trait_stijlvol_verlies zijn
  // host-granted, zie bmCheckHostTraits() hieronder, niet hier).
  check("trait_exacte_nul", result.noBeLeft);
  check("trait_drieling", result.drieling);
  check("trait_stille_kracht", result.noCorrect);
  check("trait_middelmatig", clsPlayed.length>=8
    &&BM_CLASSES.every(cls=>bmCalcMastery(ident.classHistory?.[cls.id])<=1));
  check("trait_pacifist", result.isPacifist);
  check("trait_nachtwacht", result.nightWatch);
  check("trait_marathonzitting", result.marathonzitting);
  check("trait_draaideur", (result.classPicks||0)>=6);
  const clsOrder=ident.classPlayOrder||[];
  const alphaIds=BM_CLASSES.map(c=>c.id).slice().sort();
  check("trait_volledige_cirkel", clsOrder.length===8
    &&clsOrder.every((id,i)=>id===alphaIds[i]));

  // Boss Battle — bossId/bossDifficulty/partySize/rageMaxed komen uit
  // bmAwardBattle() (Boss Battle hergebruikt de volledige Team A/B-engine,
  // zie bossbattle.js). Belegeringen (totalwar.js: twStartAttack()) lopen
  // via dezelfde weg, met bossId="garrison" — die tellen NIET mee voor
  // baas_trio (geen mythologische baas) maar wel voor de rest.
  let bossKills=ident.bossKills||{}, bossKillsChanged=false;
  if(result.isBoss){
    check("eerste_baas", result.won);
    check("baas_heroic", result.won&&["heroic","legendary"].includes(result.bossDifficulty));
    check("baas_legendary", result.won&&result.bossDifficulty==="legendary");
    check("eenling", result.won&&(result.partySize||1)<=1);
    check("geheim_norage", result.won&&!result.rageMaxed);
    check("belegeraar", result.isSiegeWin);
    if(result.won&&result.bossId&&result.bossId!=="garrison"&&!bossKills[result.bossId]){
      bossKills={...bossKills,[result.bossId]:true};
      bossKillsChanged=true;
      await fbDB.ref("identities/"+klas+"/"+lcode+"/bossKills").set(bossKills);
    }
    check("baas_trio", ["hydra","cyclops","minotaur"].every(id=>bossKills[id]));
  }

  if(newOnes.length){
    const updated=[...new Set([...current,...newOnes])];
    await fbDB.ref("identities/"+klas+"/"+lcode+"/achievements").set(updated);
    BM_IDENT={...BM_IDENT,achievements:updated,bossKills};
    bmIdentSave({...bmIdentLoad(),...BM_IDENT,achievements:updated,bossKills});
  } else if(bossKillsChanged){
    BM_IDENT={...BM_IDENT,bossKills};
    bmIdentSave({...bmIdentLoad(),...BM_IDENT,bossKills});
  }
  return newOnes;
}
async function bmSaveAvatar(){
  if(!BM_AV_EDIT||!BM_IDENT)return;
  if(!fbDB && typeof initFirebase==="function") initFirebase(); // beste-effort
  // Leerlingfeedback (2026-08-17): een mislukte Firebase-sync (bv. een
  // tijdelijke netwerkhapering) liet de hele opslag falen — óók de lokale
  // cache werd dan niet bijgewerkt en de editor bleef openstaan, terwijl de
  // bedoeling altijd was "Firebase best-effort, lokaal altijd". Firebase-
  // sync staat daarom nu in zijn eigen try/catch, los van de lokale opslag.
  let syncError = null;
  if(fbDB){
    try{
      const{klascode:klas,leerlingcode:lcode}=BM_IDENT;
      await fbDB.ref("identities/"+klas+"/"+lcode+"/avatar").set(BM_AV_EDIT);
    }catch(e){ syncError = e?.message || String(e) || "onbekende fout"; }
  }
  BM_IDENT={...BM_IDENT,avatar:{...BM_AV_EDIT}};
  bmIdentSave({...bmIdentLoad(),...BM_IDENT});
  BM_AV_EDIT=null;
  if(syncError) toast("Lokaal opgeslagen","Avatar bijgewerkt op dit toestel, maar niet gesynchroniseerd: "+syncError);
  else toast("Opgeslagen!","Avatar bijgewerkt.");
  go(BM_AV_RETURN||"battleProfile");
}

// Bewaar munten + ontgrendelingen (lokaal + Firebase indien beschikbaar).
function bmPersistIdentity(){
  try{ bmIdentSave({...bmIdentLoad(),...BM_IDENT}); }catch(e){}
  if(fbDB && BM_IDENT && BM_IDENT.klascode && BM_IDENT.leerlingcode){
    try{ fbDB.ref("identities/"+BM_IDENT.klascode+"/"+BM_IDENT.leerlingcode)
      .update({coins:BM_IDENT.coins||0, unlocked:BM_IDENT.unlocked||[]}); }catch(e){}
  }
}
// Koop een coin-vergrendeld avatar-onderdeel en rust het direct uit.
function bmBuyPart(partId, optId, price, optNm){
  if(!BM_IDENT||!BM_AV_EDIT) return;
  const key=partId+":"+optId;
  if((BM_IDENT.unlocked||[]).includes(key)){ BM_AV_EDIT[partId]=optId; SCREENS.battleAvatarEdit(); return; }
  const coins=BM_IDENT.coins||0;
  if(coins<price){ toast("Niet genoeg "+bmCoinName(), "Je hebt "+price+" nodig, je hebt "+coins+"."); return; }
  if(!confirm(optNm+" kopen voor "+price+" "+bmCoinName()+"?")) return;
  BM_IDENT.coins=coins-price;
  BM_IDENT.unlocked=[...(BM_IDENT.unlocked||[]), key];
  BM_AV_EDIT[partId]=optId;
  bmPersistIdentity();
  // skipSync=true: bmPersistIdentity() schreef de nieuwe stand al naar
  // Firebase; dit spiegelt alleen het algemene profiel (P.coins), dat
  // dezelfde portemonnee is als BM_IDENT.coins (zie core.js).
  addCoins(-price, true);
  toast("Ontgrendeld!", optNm+" is nu van jou.");
  SCREENS.battleAvatarEdit();
}

// Legendarische bonus van een speler (of null). Werkt op zowel BM_PLAYERS-
// entries (p.avatar) als op een los identiteits-object ({avatar}).
function bmLegendaryOf(p){
  const raw=p&&p.avatar; if(!raw)return null;
  const av=bmAvatarMerge(raw);
  const id=av.legendary&&av.legendary!=="geen"?av.legendary:null;
  return id?(BM_LEGENDARY_BONUS[id]||null):null;
}

/* ---- ABILITY HELPERS ---- */
function bmGetAbilityCost(cls,abl){
  let c=abl.cost;
  if(cls?.passive?.type==="cost_reduce"&&abl.tier==="basic") c=Math.max(1,c-cls.passive.val);
  return c;
}
// Ability-types die schade toebrengen — canoniek gedeeld met bmChooseAbility()
// (trait_pacifist: "Pacifistische Priester" checkt of dit type ooit gekozen is).
const BM_DMG_TYPES=["attack","attack_bypass","attack_weakspot","attack_and_defend","attack_and_shld_remove","attack_siege","heal_and_attack"];
function bmCalcAbilityEffect(p,cls,abl){
  const fx={dmg:0,heal:0,shld:0,teamBE:0,selfBE:0,shldRemove:0,bypass:false,aoe:!!abl.aoe};
  const t=abl.type, pasv=cls?.passive, mt=p.team;
  const leg=bmLegendaryOf(p); // legendarische avatar-bonus (Achilles/Ajax/Aeneas/Odysseus)
  const isDmg=BM_DMG_TYPES.includes(t);
  if(isDmg){
    let d=abl.dmg||0;
    if(pasv?.type==="atk_flat")  d+=pasv.val;
    if(pasv?.type==="atk_bonus") d=Math.round(d*(1+pasv.val));
    if(t==="attack_weakspot"){
      const et=mt==="A"?"B":"A";const eh=BM_TEAMS[et]||{health:100,maxHealth:100};
      if(eh.maxHealth>0&&eh.health/eh.maxHealth<=0.30) d+=(abl.bonusDmg||0);
    }
    if(leg?.atkMult) d=Math.round(d*(1+leg.atkMult)); // Achilles
    fx.dmg=d; fx.bypass=(t==="attack_bypass");
    if(pasv?.type==="shld_pierce") fx.shldRemove+=pasv.val; // genie passief
  }
  if(["team_shield","testudo","attack_and_defend","shield_and_heal"].includes(t)){
    let s=abl.shld||0;
    if(leg?.shldMult) s=Math.round(s*(1+leg.shldMult)); // Ajax de Grote
    if(p.traitLaconisch) s+=1; // Laconische Breviteit: vlakke +1 schild
    if(p.traitPacifist) s+=1; // Pacifistische Priester: vlakke +1 schild
    fx.shld=s;
  }
  if(["team_shield","testudo"].includes(t)&&pasv?.type==="be_on_defend") fx.selfBE+=pasv.val;
  if(["heal","heal_and_attack","shield_and_heal","testudo"].includes(t)){
    let h=abl.heal||0; if(pasv?.type==="heal_flat") h+=pasv.val;
    if(leg?.healMult) h=Math.round(h*(1+leg.healMult)); // Aeneas
    if(p.traitHeal) h+=1; // Levensbron: vlakke +1 heling
    fx.heal=h;
  }
  if(["team_be","testudo"].includes(t)) fx.teamBE=abl.teamBE||0;
  if(["shield_remove","attack_and_shld_remove","attack_siege"].includes(t)) fx.shldRemove+=(abl.shldRemove||0);
  if(abl.selfBE) fx.selfBE+=abl.selfBE; // rechtstreekse eigen-BE-vaardigheden (bv. Cavalerie: Snelle Uitval)
  return fx;
}
// Klem BE op 0..BM_BE_MAX. Overal gebruiken waar BE wordt weggeschreven —
// zowel host-side (bmResolve/bmDistributeQs) als client-side (bmAnswer).
function bmClampBE(v){
  const max=(typeof BM_BE_MAX==="number"?BM_BE_MAX:15);  // fallback = zelfde waarde als in battle-data.js
  return Math.max(0,Math.min(max,Math.round(v||0)));
}
function bmCalcSynergy(players,team){
  const unique=new Set(Object.values(players).filter(p=>p.team===team&&p.class).map(p=>p.class)).size;
  let bonus=0;
  for(const tier of BM_SYNERGY){if(unique>=tier.minClasses)bonus=tier.beBonus;}
  return bonus;
}

/* ============================================================================
   ⚔️ HELDENMODUS — schaderoutering (Fase 1)
   Levende helden vormen een frontlinie: binnenkomende teamschade put eerst
   pantser+HP van de levende helden uit (in stabiele volgorde), het overschot
   gaat naar het leger. Totale schade blijft behouden — geen vermenigvuldiging.
   Schrijft per getroffen held {hp,armor,isAlive} naar `out` (los van pUpd).
   Geeft de resterende schade voor het leger terug.
   ============================================================================ */
function bmRouteHeroDamage(team,incoming,players,out){
  let dmg=incoming;
  if(dmg<=0)return 0;
  const heroes=Object.entries(players)
    .filter(([,p])=>p.team===team&&p.isAlive!==false&&(p.maxHp||0)>0)
    .sort((a,b)=>a[0]<b[0]?-1:a[0]>b[0]?1:0);
  for(const[pid,p]of heroes){
    if(dmg<=0)break;
    let armor=p.armor||0, hp=p.hp||0;
    if(armor>0){const a=Math.min(armor,dmg);armor-=a;dmg-=a;}
    if(dmg>0){const h=Math.min(hp,dmg);hp-=h;dmg-=h;}
    const u={armor,hp};
    if(hp<=0)u.isAlive=false;
    out[pid]=u;
  }
  return dmg; // overschot → leger
}

/* Herrijzing (Fase 1): een gevallen held vult per goed antwoord zijn meter;
   bij het bereiken van de drempel herrijst hij met volle HP. Pure functie zodat
   ze testbaar is — geeft de te schrijven velden terug of null als er niets verandert. */
function bmRespawnProgress(p){
  if(!BM_META?.heroMode||!p||p.isAlive!==false)return null;
  let need=Math.max(1,BM_META.respawnRequired||5);
  if(p.traitFeniks) need=Math.max(1,need-1); // Feniks: vlak 1 sneller herrijzen
  const meter=(p.respawnMeter||0)+1;
  if(meter>=need){
    return {revived:true, upd:{isAlive:true, hp:p.maxHp||BM_META.heroMaxHp||15, armor:0, respawnMeter:0, timesRevived:(p.timesRevived||0)+1}};
  }
  return {revived:false, upd:{respawnMeter:meter}};
}

/* ---- FACTIE / THEMA HELPERS ---- */
let BM_THEME_SAVED=[]; // opgeslagen originele CSS-var-waarden voor herstel bij bmLeave
function bmFaction(id){ return BM_FACTIONS.find(f=>f.id===id)||BM_FACTIONS.find(f=>f.default)||BM_FACTIONS[0]; }
// Novelty-verval tegengaan: de voorgestelde factie wisselt per kalenderweek
// i.p.v. altijd dezelfde default te tonen. Docent kan nog altijd overschrijven
// via de dropdown in battleHostSettings; dit bepaalt alleen het startpunt.
function bmWeekFactionId(){
  const wk=Math.floor(Date.now()/(7*24*3600*1000));
  return BM_FACTIONS[wk%BM_FACTIONS.length].id;
}
function bmApplyTheme(themeId){
  bmClearTheme(); // herstel eerst eventueel vorig thema
  const f=bmFaction(themeId);
  const root=document.documentElement;
  for(const[k,v]of Object.entries(f.cssVars||{})){
    BM_THEME_SAVED.push([k,root.style.getPropertyValue(k)]);
    root.style.setProperty(k,v);
  }
}
function bmClearTheme(){
  const root=document.documentElement;
  for(const[k,v]of BM_THEME_SAVED){
    if(v)root.style.setProperty(k,v);else root.style.removeProperty(k);
  }
  BM_THEME_SAVED=[];
}
function bmTeamNm(team){
  if(BM_META?.mode==="boss"){
    if(team==="B"){
      // Total War-belegering: naam volgt de huidige stage (Garnizoen/Muur/Fort)
      // i.p.v. altijd "Het Garnizoen" — zie bmGarrisonStageInfo() in bossbattle.js.
      if(BM_META.bossId==="garrison"){
        const info=bmGarrisonStageInfo();
        if(info) return info.nm;
      }
      return bmBossPreset(BM_META.bossId).nm;
    }
    if(team==="A")return "De Klas";
  }
  return bmFaction(BM_META?.theme).teams[team]?.nm||(team==="A"?"Team A":"Team B");
}
function bmTeamIcon(team){ return bmFaction(BM_META?.theme).teams[team]?.icon||(team==="A"?"shield":"helmet"); }
function bmClsNmThemed(clsId){ return bmFaction(BM_META?.theme).classLabels?.[clsId]||bmClsName(clsId); }

/* ---- BATTLE GAME STATE ---- */
let BM_CODE=null, BM_PID=null, BM_META=null;
let BM_STATE={}, BM_TEAMS={}, BM_PLAYERS={}, BM_BOSS={};
let BM_MY_BE=0, BM_MY_Q=null, BM_MY_CLASS=null, BM_MY_TEAM=null;
let BM_ANSWERED=false, BM_ACTION_LOCKED=false, BM_RESOLVING=false;
let BM_MY_TARGET="boss", BM_TARGET_ROUND=-1; // Minion Summon (BOSS_BATTLE.md §4): gekozen doelwit voor de volgende ability
// Laatste antwoord van deze speler — nodig om de goed/fout-uitslag te blijven
// tonen nadat de spelers-listener het paneel opnieuw heeft opgebouwd.
let BM_MY_PICK=null, BM_MY_PICK_OK=false, BM_MY_PICK_ROUND=-1;
// Verborgen-trait-tracking (session-only, zie ACHIEVEMENTS_DEF: trait_ciceronianus/trait_laconisch)
let BM_MY_CLUTCH_STREAK=0, BM_MY_CLUTCH_BEST=0, BM_MY_ABILITIES_USED=0;
// Batch 2: klassewissels in de lobby (trait_draaideur) + ooit een schade-
// type ability gekozen (trait_pacifist, "Pacifistische Priester")
let BM_MY_CLASS_PICKS=0, BM_MY_DEALT_DMG_ABILITY=false;

function bmLeave(){
  _bmFormHash="";_bmRankRound=-1;_bmRankMap={};BM_FIELD_SOLO=false;
  bmClearTheme();
  BM_CODE=null;BM_PID=null;BM_META=null;BM_STATE={};BM_TEAMS={};BM_PLAYERS={};BM_BOSS={};
  BM_MY_BE=0;BM_MY_Q=null;BM_MY_CLASS=null;BM_MY_TEAM=null;
  BM_ANSWERED=false;BM_ACTION_LOCKED=false;BM_RESOLVING=false;BM_MY_TARGET="boss";
  BM_MY_CORRECT=0;BM_MY_WRONG=0;BM_MY_DMG=0;BM_MY_HEAL=0;
  BM_MY_CLUTCH_STREAK=0;BM_MY_CLUTCH_BEST=0;BM_MY_ABILITIES_USED=0;
  BM_MY_CLASS_PICKS=0;BM_MY_DEALT_DMG_ABILITY=false;
}

/* ---- SCHERM: battleHome ---- */
SCREENS.battleHome = function(){
  document.body.classList.remove("greek");
  H(brand(true)+`
  <div class="scrhead"><button class="back" onclick="go('home')">${iconSVG("shield",20,"currentColor")}</button><h2>⚔️ Battle Mode</h2></div>
  <div class="panel"><div class="note">Twee teams strijden om woordkennis. Verdien Battle Energy met goede antwoorden en kies je aanval.</div></div>
  <button class="tile" onclick="bmStartHost()">
    <span class="corner">${iconSVG("column",88,"currentColor")}</span>
    <span class="ic">${iconSVG("helmet",44,"currentColor")}</span>
    <h3>Gevecht starten — docent</h3>
    <p>Kies woorden, verdeel teams en start het gevecht.</p>
  </button>
  <button class="tile" onclick="go('battleIdentity')">
    <span class="ic">${iconSVG("shield",44,"currentColor")}</span>
    <h3>Meedoen — leerling</h3>
    <p>Meld je aan en doe mee aan het gevecht van de docent.</p>
  </button>
  <button class="tile" onclick="go('battleFAQ')">
    <span class="ic">${iconSVG("torch",44,"currentColor")}</span>
    <h3>Handleiding & FAQ</h3>
    <p>Hoe werkt Battle Mode? Lees over de klassen, combo's, helden en meer.</p>
  </button>
  ${BM_IDENT?`
  <button class="tile" onclick="go('battleProfile')">
    <span class="ic" style="position:relative">
      <span style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)">${renderPixelHeroIcon(BM_IDENT.avatar,44)}</span>
    </span>
    <h3>Mijn profiel</h3>
    <p>${esc(BM_IDENT.name||"")} · Niveau ${bmCalcLevel(BM_IDENT.xp||0).level} · ${esc(bmCalcLevel(BM_IDENT.xp||0).title)}</p>
  </button>`:""
  }
  ${!hasFirebase?`<div class="panel"><div class="note warn">Firebase is vereist voor Battle Mode (identiteitssysteem + realtime sync).</div></div>`:""}
  ${foot()}`);
};
function bmStartHost(){
  if(!hasFirebase){toast("Firebase vereist","Stel Firebase in om Battle Mode te hosten.");return;}
  // Een gewone, losstaande hostsessie mag nooit een Total War-belegering
  // erven van een eerder afgebroken twStartAttack() (certamen/totalwar.js) —
  // zonder deze reset zou bmCreateRoom() dat garrisonProvince/attackerCivId
  // per ongeluk meenemen naar een ongerelateerd gevecht.
  if(BM_META){ BM_META.garrisonProvince=null; BM_META.attackerCivId=null; }
  ROLE="host"; DRAFT.game="battle"; go("hostSource");
}
// Directe ingang vanuit het hoofdmenu: start het gevecht-hosten met Boss
// Battle alvast als speltype vooringesteld (docent kan dit in de
// instellingen alsnog terugzetten naar Team vs Team).
function bmStartBossHost(){
  if(!hasFirebase){toast("Firebase vereist","Stel Firebase in om Battle Mode te hosten.");return;}
  if(!BM_META)BM_META={};
  BM_META.mode="boss";
  // Zie bmStartHost() hierboven: ook deze losstaande ingang mag geen
  // Total War-belegering erven.
  BM_META.garrisonProvince=null; BM_META.attackerCivId=null;
  ROLE="host"; DRAFT.game="battle"; go("hostSource");
}

/* ============================================================================
   SCHERM: battleFAQ — Handleiding & uitleg
   Klassen, combo's en synergie worden DATA-GEDREVEN gerenderd uit BM_CLASSES /
   BM_COMBOS / BM_SYNERGY, zodat ze automatisch meelopen met spelwijzigingen.
   De prozasecties (spelverloop, BE, heldenmodus, profiel) werk je handmatig bij.
   Conventie: bij elke Battle Mode-wijziging deze FAQ controleren/updaten.
   ============================================================================ */
function bmTierBadge(tier){
  const m={basic:["Basis","#3f9d52"],medium:["Middel","#2e6fb0"],legendary:["Legendarisch","#C87533"]};
  const[lbl,col]=m[tier]||[tier,"var(--muted)"];
  return `<span class="pill" style="background:${col};border:none;font-size:10px">${lbl}</span>`;
}
SCREENS.battleFAQ = function(){
  document.body.classList.remove("greek");
  const sec=(title,open,body)=>`<details ${open?"open":""} style="margin-bottom:8px">
    <summary class="eyebrow l" style="cursor:pointer;list-style:revert">${title}</summary>
    <div class="panel" style="margin-top:6px">${body}</div></details>`;

  // Klassen — data-gedreven uit BM_CLASSES
  const classesHTML=BM_CLASSES.map(c=>`
    <div style="border-top:1px solid var(--stone4);padding:10px 0">
      <div style="display:flex;align-items:center;gap:10px">
        <span style="flex:0 0 auto">${iconSVG(c.icon,30,c.color)}</span>
        <div><div style="font-size:16px;font-weight:700;color:${c.color}">${esc(c.nm)}</div>
        <div class="note">Passief: ${esc(c.passive?.desc||"—")}</div></div>
      </div>
      <div style="margin-top:8px;display:flex;flex-direction:column;gap:5px">
        ${c.abilities.map(a=>`<div style="display:flex;align-items:baseline;gap:6px;flex-wrap:wrap">
          ${bmTierBadge(a.tier)}
          <b style="font-size:13px">${esc(a.nm)}</b>
          <span class="note" style="color:var(--hi)">${a.cost} BE</span>
          <span class="note" style="flex:1 1 100%;margin-left:2px">${esc(a.desc)}</span>
        </div>`).join("")}
      </div>
    </div>`).join("");

  // Combo's — data-gedreven uit BM_COMBOS
  const comboHTML=BM_COMBOS.map(co=>{
    const eff=[co.dmg?`schade +${co.dmg}`:"",co.shld?`schild +${co.shld}`:"",
      co.heal?`heling +${co.heal}`:"",co.teamBE?`+${co.teamBE} BE p.p.`:"",
      co.shldRemove?`vijandschild −${co.shldRemove}`:""].filter(Boolean).join(", ");
    const namen=co.classes.map(id=>bmClsName(id)).join(" + ");
    return `<div style="border-top:1px solid var(--stone4);padding:8px 0">
      <b style="font-size:13px">${esc(co.nm)}</b> <span class="note" style="color:var(--hi)">${co.cost} BE p.p.</span>
      <div class="note">${esc(namen)} — ${esc(eff)}</div>
      <div class="note" style="opacity:.8">${esc(co.desc)}</div></div>`;
  }).join("");

  // Synergie — data-gedreven uit BM_SYNERGY
  const synHTML=BM_SYNERGY.map(s=>`<li>${s.minClasses}+ verschillende klassen in je team → <b>+${s.beBonus} BE</b> per speler per ronde</li>`).join("");

  // Boss Battle — data-gedreven uit BOSS_PRESETS/BOSS_DIFFICULTIES
  const bossPresetsHTML=BOSS_PRESET_ORDER.map(id=>{const p=BOSS_PRESETS[id];return`
    <div style="border-top:1px solid var(--stone4);padding:8px 0;display:flex;gap:10px;align-items:flex-start">
      <span style="font-size:26px;line-height:1">${p.emoji}</span>
      <div><b style="font-size:13px;color:${p.color}">${esc(p.nm)}</b>
      <div class="note">${esc(p.desc)}</div></div>
    </div>`;}).join("");
  const bossDiffHTML=BOSS_DIFF_ORDER.map(id=>`<li>${BOSS_DIFFICULTIES[id].nm} — schaalfactor ×${BOSS_DIFFICULTIES[id].m}</li>`).join("");

  H(brand(true)+`
  <div class="scrhead"><button class="back" onclick="go('battleHome')">${iconSVG("shield",20,"currentColor")}</button><h2>Handleiding & FAQ</h2></div>

  ${sec("Wat is Battle Mode?",true,`
    <div class="note">Battle Mode is een teamspel om woordkennis. Twee teams (A en B) strijden tot het
    leger van één team op 0 HP staat. Je verslaat de tegenstander niet door snelheid alleen, maar door
    <b>samen te werken</b>: goede antwoorden geven je <b>Battle Energy (BE)</b>, en met die energie kies je
    aanvallen, schilden of helingen. Elke leerling speelt op een eigen apparaat; de docent projecteert het
    slagveld op het bord.</div>`)}

  ${sec("Hoe verloopt een ronde?",false,`
    <ol style="margin:0;padding-left:18px;font-size:13px;line-height:1.6">
      <li><b>Vraagfase</b> — iedereen krijgt een woord en kiest het juiste antwoord. Goed = je verdient BE
        (sneller antwoorden kan extra opleveren).</li>
      <li><b>Actiefase</b> — geef je BE uit aan een ability van je klasse. Je kunt ook samen een
        <b>combo</b> kiezen.</li>
      <li><b>Resolutie</b> — alle acties van beide teams worden tegelijk uitgevoerd: schade, schilden en
        helingen verrekend, en het slagveld animeert het resultaat.</li>
    </ol>
    <div class="note" style="margin-top:6px">Dit herhaalt zich tot een leger verslagen is.</div>
    <div class="note" style="margin-top:6px"><b>Basisacties.</b> Heb je nog geen klasse gekozen, of te weinig BE voor
    je vaardigheden? Dan staan er drie gratis acties klaar: Steen gooien (kleine aanval), Dekking zoeken
    (klein schild) en Aanmoedigen (+1 BE voor je team). Ze zijn zwakker dan je klasse-vaardigheden, maar je
    zit nooit een ronde werkloos toe te kijken. Heb je nog geen klasse, dan kun je er ook midden in het
    gevecht één kiezen — daarna ligt die vast tot het gevecht voorbij is. In de lobby mag je zo vaak
    wisselen als je wilt.</div>
    <div class="note" style="margin-top:6px">Kom je later binnen? Dat kan: de spelcode staat tijdens het gevecht
    bovenin op het docentscherm. Je doet vanaf de volgende ronde mee. Je deelname- en winstbonus tellen dan
    naar rato van het aantal rondes dat je meespeelde — je goede antwoorden leveren gewoon volledig XP op.</div>
    <div class="note" style="margin-top:6px"><b>Je plek op het slagveld.</b> Je klasse bepaalt in welk blok je
    staat: Hopliet, Voorvechter en Bevelvoerder vooraan, Priester, Genie en Cavalerie in het midden,
    Boogschutter en Verkenner achteraan. Binnen dat blok staat wie het meest bijdraagt het verst naar
    voren — eerst telt je aantal goede antwoorden, bij gelijke stand je schade, heling en schild samen.
    De volgorde wordt tussen twee rondes bijgewerkt.</div>`)}

  ${sec("Battle Energy (BE)",false,`
    <div class="note">BE is je actiemunt. Je verdient het door vragen goed te beantwoorden. Elke ability kost
    BE (zie hieronder). Sommige klassen genereren extra BE voor zichzelf of het hele team. Spaar je BE op
    voor een krachtige <b>ultieme</b> ability, of geef het meteen uit aan goedkope acties — dat is jouw
    tactische keuze.</div>
    <div class="note" style="margin-top:6px">Je kunt maximaal <b>${BM_BE_MAX} BE</b> in voorraad hebben; wat
    daarboven komt vervalt. Sparen heeft dus een grens — gebruik je BE.</div>
    <div class="note" style="margin-top:6px">Een <b>fout antwoord</b> kost je <b>${BM_WRONG_BE_PENALTY} BE</b>,
    levert niets op én je loopt de passieve rondebonus (synergie, klassepassief) mis. Heb je daarna te weinig over voor je goedkoopste vaardigheid, dan kun je die ronde
    niet aanvallen. Je ziet na elk antwoord meteen of het goed of fout was, met het juiste antwoord erbij.</div>`)}

  ${sec("De acht klassen",false,classesHTML)}

  ${sec("Combo-aanvallen",false,`
    <div class="note" style="margin-bottom:4px">Twee teamgenoten van de juiste klassen kiezen in dezelfde
    ronde allebei <b>Combo</b>. Dan voert het team samen een krachtige gecombineerde actie uit:</div>
    ${comboHTML}`)}

  ${sec("Teamsynergie",false,`
    <div class="note" style="margin-bottom:4px">Hoe diverser je team, hoe meer bonus-BE iedereen krijgt:</div>
    <ul style="margin:0;padding-left:18px;font-size:13px;line-height:1.6">${synHTML}</ul>
    <div class="note" style="margin-top:6px">Een gevarieerd team met verschillende rollen is dus sterker dan
    vijf dezelfde klassen.</div>`)}

  ${sec("Heldenmodus (optioneel)",false,`
    <div class="note">De docent kan <b>Heldenmodus</b> aanzetten. Dan krijgt elke speler een persoonlijke
    <b>held met eigen HP</b> die als frontlinie het leger beschermt:</div>
    <ul style="margin:6px 0 0;padding-left:18px;font-size:13px;line-height:1.6">
      <li>Vijandelijke schade treft <b>eerst de levende helden</b> (pantser, dan HP); pas als die vallen
        krijgt het leger klappen.</li>
      <li>Een <b>gevallen held</b> blijft gewoon meespelen: je verdient nog BE en kiest acties — je held
        is alleen even geen schild meer voor het leger.</li>
      <li><b>Herrijzen:</b> beantwoord een aantal vragen goed (de docent stelt het aantal in) en je held
        keert terug met volle HP. De gouden meter <b>↻</b> onder je held toont je voortgang.</li>
    </ul>`)}

  ${sec("Boss Battle (co-op)",false,`
    <div class="note">In <b>Boss Battle</b> vecht de hele klas samen tegen één mythologische baas — er is
    geen tegenstander-team, dus dit werkt ook prima om <b>alleen te trainen</b>. Je klasse, abilities en
    combo's werken precies hetzelfde als in Team vs Team: je acties richten zich nu alleen op de baas in
    plaats van een vijandelijk leger, en XP/munten tellen mee op hetzelfde profiel als een normaal gevecht.</div>
    <ul style="margin:8px 0 0;padding-left:18px;font-size:13px;line-height:1.6">
      <li>De klas deelt één gezondheidsbalk die meeschaalt met het aantal spelers.</li>
      <li>Een fout antwoord doet geen schade, maar vult de <b>rage-balk</b> van de baas — bij 100% volgt
        een extra tegenaanval.</li>
      <li>Het gevecht kent 3 fases (100–66%, 66–33%, 33–0% baas-HP): de baas valt in latere fases vaker aan.</li>
    </ul>
    <div class="note" style="margin-top:8px;font-weight:700">Bazen</div>
    ${bossPresetsHTML}
    <div class="note" style="margin-top:8px;font-weight:700">Moeilijkheidsgraden</div>
    <ul style="margin:4px 0 0;padding-left:18px;font-size:13px;line-height:1.6">${bossDiffHTML}</ul>
    <div class="note" style="margin-top:8px">Unieke baas-mechanics (bv. de Hydra die koppen laat groeien, of
    het Labyrinth-schild van de Minotaurus) zijn nog in ontwikkeling — nu heeft elke baas dezelfde
    generieke aanval/fase-opbouw.</div>`)}

  ${sec("Total War & Training Mode",false,`
    <div class="note">Naast losse gevechten is er <b>Total War</b>: een doorlopende veldtocht op één
    gedeelde kaart van Europa. Elke klas hoort blijvend bij één <b>beschaving</b> (bv. Romeinen,
    Grieken, Galliërs) en strijdt samen met andere klassen van diezelfde beschaving om de
    provincies op de kaart — een campagne die weken of maanden loopt, niet één les.</div>
    <ul style="margin:8px 0 0;padding-left:18px;font-size:13px;line-height:1.6">
      <li><b>Verdedigen via Training Mode</b> — thuis, solo en zonder klascode-invoer van een host:
      elk goed beantwoord woord bouwt direct mee aan één van drie verdedigingswerken van een
      provincie van jouw beschaving — <b>garnizoen</b>, <b>muur</b> of <b>wachttoren</b> — die elk
      twee niveaus kennen (basis → volledig). Hoe kleiner je klas, hoe zwaarder elk goed antwoord
      meetelt, zodat een kleine klas net zo hard kan bouwen als een grote.</li>
      <li><b>Veroveren via belegering</b> — een neutrale of vijandelijke buurprovincie inpalmen
      gebeurt via een <b>Boss Battle</b> tegen het garnizoen van die provincie: eerst het garnizoen,
      dan de muur, dan het fort — elk verdedigingswerk moet apart verslagen worden. Wint de
      aanvallende klas alle drie, dan kleurt de provincie om in hun beschaving; verlies je
      halverwege, dan onthoudt de provincie tot waar de belegering kwam voor een volgende poging.</li>
      <li><b>Status</b> — Total War is in Beta: het docentendeel (veldtochtkaart, klas↔beschaving-koppeling,
      aanvalsflow) en Training Mode zijn allebei speelbaar. Zelf een belegering starten als leerling komt
      nog (nu bereidt de docent een aanval voor via de docentenweergave).</li>
      <li><b>De veldtocht bekijken</b> — via "Bekijk de veldtocht" (Total War-scherm) zie je, zonder
      inloggen, de live kaart, een legenda van welke klas welke beschaving speelt, en seizoensrecords
      (grootste rijk, meeste veroveringen, bloedigste veldslag, sterkste solo-speler, grootste bouwer).</li>
      <li><b>Seizoenen</b> — de veldtocht loopt als een genummerd seizoen met een eigen titel (nu
      Seizoen 1). De docent kan de kaart en records via de docentenweergave resetten voor een nieuw
      seizoen (bv. na een schooljaar); klas↔beschaving-koppelingen blijven daarbij staan.</li>
      <li><b>Steden en provinciebonussen</b> — elke provincie heeft nu 1-3 historische steden (met een
      korte sfeertag, puur informatief) én een echte <b>provinciebonus</b>: bezit je die provincie, dan
      bouwt Training Mode één specifiek spoor (garnizoen/muur/toren) daar 20-25% sneller, gebaseerd op
      de historische specialiteit (bv. Aegyptus' graanschuur versnelt torenpunten). Diezelfde bonus telt
      ook mee tíjdens een belegering: dat spoor heeft dan ook 20-25% meer boss-HP, dus een goed gekozen
      provinciebonus maakt een gebied niet alleen sneller op te bouwen, maar ook echt lastiger te
      veroveren. Zichtbaar in het provincie-infopaneel én tijdens het trainen zelf.</li>
      <li><b>Zeeroutes op de kaart</b> — provincies die alleen over zee bereikbaar zijn (bv. Britannia
      vanuit Gallië) tonen nu een blauwe stippellijn tussen de twee gebieden, zodat die aanvalsroute
      ook visueel duidelijk is.</li>
      <li><b>Vlaggenschipprovincies</b> — 11 historisch cruciale provincies (de 8 hoofdsteden van elke
      beschaving, plus Dacia, Asia en Judea) geven de bezittende beschaving een 👑-badge en een vaste,
      niet-stapelende rijksbrede beloning: <b>+1 XP</b> per goed antwoord in Training Mode en een
      <b>hogere dagcap</b> (35 i.p.v. 25). Bewust geen extra bouw- of verdedigingskracht — dat zou grote
      rijken alleen maar onverslaanbaar maken. <b>Let op:</b> je eigen hoofdstad telt niet mee (die heb
      je nooit veroverd) — de beloning gaat pas in zodra je een écht ander vlaggenschip inneemt, van een
      tegenstander of een van de drie neutrale (Dacia/Asia/Judea). Bij verovering én bij 4 weken
      onafgebroken bezit (Legacy) verdien je bovendien een eigen eerbewijs per vlaggenschip, met een
      korte, echte geschiedenisanekdote in het provincie-infopaneel (bv. over de bibliotheek van
      Alexandrië of Trajanus' verovering van Dacië) — ook die gelden alleen voor écht veroverde
      vlaggenschepen, niet voor je eigen startprovincie.</li>
      <li><b>Rebellen (uitgeroeide beschaving)</b> — verliest een beschaving écht al haar provincies,
      dan is ze niet meteen uit het spel. Op de docentenkaart verschijnt dan een 💀-label in de legenda,
      en de enige nog beschikbare actie is een <b>opstand</b> op de eigen vlaggenschipprovincie (haar
      oude hoofdstad), ongeacht wie die nu bezet en zonder de normale grens-eis. Win je die belegering,
      dan doet de beschaving weer volledig mee — verlies je, dan blijft de opstand mogelijk zolang er
      geen andere provincies bij zijn gekomen. Training Mode is niet bruikbaar tot de opstand slaagt.</li>
    </ul>`)}

  ${sec("Profiel, rang en eerbewijzen",false,`
    <div class="note">Alles wat je doet telt mee voor één profiel (zie <b>Mijn profiel</b> in het
    hoofdmenu):</div>
    <ul style="margin:6px 0 0;padding-left:18px;font-size:13px;line-height:1.6">
      <li><b>XP &amp; rang</b> — je klimt van Tiro tot Imperator door te spelen en te winnen. Eenmaal
      Imperator loop je door met <b>Legioensterren</b> (★1, ★2, …) — er is dus geen harde eindstreep.</li>
      <li><b>Klasbeheersing</b> — speel je vaak dezelfde klasse, dan verdien je sterren (★ tot ★★★★★).</li>
      <li><b>Eerbewijzen</b> — speciale prestaties, ook geheime. Verschijnen op je profiel, inclusief eigen
      reeksen voor Boss Battle (bazen verslaan, solo, hoge moeilijkheidsgraad) en Total War/Training Mode
      (bijdragen aan garnizoen/muur/toren, belegeringen winnen).</li>
      <li><b>Getoonde naam</b> — koos je een naam waar je spijt van hebt? Via <b>Mijn profiel</b> pas je
      met het potloodje naast je naam je getoonde naam aan. Je klascode en leerlingcode blijven gelijk, dus
      je hoeft geen nieuw account te maken en je voortgang blijft behouden.</li>
      <li><b>Avatar</b> — pas je held-avatar aan via je profiel. <b>Huidskleur</b> (zes tinten),
      <b>Oogkleur</b>, <b>Haarkleur</b> en de schakelaar <b>Borstband</b> zijn vanaf het begin vrij: dat
      is hoe jij eruitziet, niet iets wat je moet verdienen. Je kiest ze los van elkaar, dus elke
      combinatie kan. De meeste andere onderdelen unlock je door te
      levelen; de categorieën <b>Extra's</b> en <b>Legendarisch</b> (onderaan) koop je met munten
      (denarii/drachmae). De laatste categorie, <b>Legioensglans</b>, kleurt je hele avatar goud zodra je
      álle eerbewijzen in één categorie hebt behaald (bv. alle Boss Battle- of alle Total War-eerbewijzen)
      — één gouden variant per categorie, dus meerdere te verzamelen.</li>
    </ul>
    <div class="note" style="margin-top:8px">Training Mode geeft de eerste ~25 goede antwoorden per dag
    volledige XP en bouwpunten; daarna nog wel halve bouwpunten (het klasdoel groeit door) maar geen XP
    meer — zo blijft thuis oefenen lonend zonder dat je in één avond naar niveau 10 kunt sprinten.</div>
    <div class="note" style="margin-top:8px">Je kunt je profiel optioneel koppelen aan je Google-account
    (via <b>Mijn profiel</b>) — handig op een nieuw toestel, want dan hoef je niet elke keer je klascode en
    leerlingcode opnieuw te typen: "Inloggen met Google" op het aanmeldscherm vindt je profiel dan zelf.
    Koppelen is nooit verplicht; zonder koppeling blijft de klascode+leerlingcode gewoon werken.</div>`)}

  ${sec("Voor docenten",false,`
    <div class="note">Bij het starten van een gevecht stel je in: woordbereik en taal, antwoordtijd, en onder
    <b>Geavanceerde instellingen</b> o.a. legersterkte, adaptief leren (foute woorden komen vaker terug),
    combo's aan/uit, mastery-bonussen, animaties (uit bij trage Chromebooks), geluid, en de
    <b>Heldenmodus</b> met HP-per-held en herrijz-drempel. Battle Mode vereist Firebase voor de realtime
    synchronisatie en het identiteitssysteem.</div>
    <div class="note" style="margin-top:6px">De ingestelde <b>legersterkte</b> geldt voor een team van vier
    spelers; bij de start wordt hij automatisch omhoog geschaald met de grootte van je klas. Anders zou
    een gevecht met een volle klas al na twee rondes voorbij zijn.</div>
    <div class="note" style="margin-top:6px">In de lobby verdeel je de teams door leerlingen tussen de twee kolommen te
    <b>slepen</b> (of met het ⇄-knopje, dat ook op een aanraakscherm werkt). Tijdens het gevecht blijft de
    <b>spelcode</b> linksboven staan: een leerling die te laat is of eruit vloog kan alsnog instappen. Die krijgt
    de deelname- en winstbonus naar rato van het aantal rondes dat hij meespeelde; goede antwoorden tellen
    onverkort mee. Een leerling zonder klasse (late instapper, of vergeten in de lobby) kan er tijdens het
    gevecht alsnog één kiezen, en heeft ondertussen drie gratis <b>basisacties</b> — niemand zit nog
    werkloos toe te kijken. In de lobby mogen leerlingen onbeperkt van klasse wisselen; zodra het gevecht
    lóópt ligt de keuze vast, zodat de klassebeheersing per klasse blijft kloppen. Boven het slagveld staat
    per team het aantal spelers.</div>
    <div class="note" style="margin-top:6px">Na afloop staat er onder de awards en de statistieken een knop
    <b>↻ Nieuw gevecht — zelfde spelers</b>. Daarmee begin je meteen een nieuwe partij in dezelfde kamer:
    de klas hoeft niet opnieuw in te loggen en houdt naam, avatar, team en klasse.</div>`)}

  ${foot()}`);
};

/* ---- SCHERM: battleIdentity ---- */
SCREENS.battleIdentity = function(){
  if(!hasFirebase){ toast("Firebase vereist","Battle Mode vereist Firebase."); go("battleHome"); return; }
  const saved=bmIdentLoad();
  H(brand(true)+`
  <div class="scrhead"><button class="back" onclick="go('home')">${iconSVG("shield",20,"currentColor")}</button><h2>Aanmelden</h2></div>
  ${saved?`
  <div class="panel" style="text-align:center">
    <div style="margin-bottom:10px">${avatarHTML(saved.avatar||P.avatar,saved.color||P.color,54)}</div>
    <div style="font-size:22px">${esc(saved.name)}</div>
    <div class="note" style="margin-top:4px">${esc(saved.klascode)} · ${esc(saved.leerlingcode)}</div>
    <div class="btnrow" style="margin-top:16px;justify-content:center">
      <button class="btn btn-gold lg" onclick="bmIdentContinue()">Verdergaan</button>
      <button class="btn btn-ghost" onclick="bmIdentSwitch()">Andere leerling?</button>
    </div>
  </div>
  `:`
  <div class="panel">
    <label class="fld">Klascode (van de docent)</label>
    <input id="bmKlas" type="text" placeholder="bv. LATIJN3B" style="text-transform:uppercase" oninput="this.value=this.value.toUpperCase()">
    <label class="fld" style="margin-top:12px">Leerlingcode (zelf gekozen)</label>
    <input id="bmLcode" type="text" placeholder="bv. marcus42">
    <label class="fld" style="margin-top:12px">Weergavenaam <small style="text-transform:none">(optioneel — leeg = klasse+avatar, bv. "Hopliet 42")</small></label>
    <input id="bmNaam" type="text" placeholder="bv. Marcus of leeg laten">
  </div>
  <div id="bmIdentErr" class="note warn" style="display:none;margin-bottom:10px"></div>
  <button class="btn btn-gold btn-block lg" onclick="bmIdentLogin()">Aanmelden</button>
  <div class="note" style="text-align:center;margin:14px 0">— of —</div>
  <button class="btn btn-ghost btn-block lg" onclick="bmGoogleLoginFresh()">Inloggen met Google</button>
  <div class="note" style="margin-top:8px">Werkt alleen als je je profiel al eerder hebt gekoppeld via "Mijn profiel".</div>
  `}
  ${foot()}`);
};
// Kernlogica van het aanmelden/aanmaken van een gedeelde identiteit
// (klascode+leerlingcode). Herbruikt door zowel het Battle Mode-aanmeldscherm
// als de "koppel dit toestel"-actie in het algemene profiel (SCREENS.collection),
// zodat XP (en later munten) via dezelfde /identities/{klas}/{lcode}-node op
// elk toestel gelijk blijven — niet alleen binnen Battle Mode.
async function bmIdentDoLogin(klas,lcode,name){
  initFirebase(); // beste-effort; bmIdentGet/Create werken ook offline (lokale fallback)
  klas=(klas||"").trim().toUpperCase();
  lcode=(lcode||"").trim().toLowerCase();
  // Weergavenaam is optioneel: leeg veld levert een klasse+avatar-badge op
  // (bv. "Hopliet 42") i.p.v. verplichte vrije tekst — voorkomt dat leerlingen
  // gedwongen worden een herkenbare of ongepaste naam te typen.
  name=(name||"").trim()||bmAutoName();
  if(!klas||!lcode) return{ok:false,error:"Vul klascode en leerlingcode in."};
  try{
    let data=await bmIdentGet(klas,lcode);
    const isNew=!data;
    if(isNew&&fbDB){
      const valid=await fbDB.ref("klascodes/"+klas).once("value");
      if(!valid.exists()) return{ok:false,error:"Klascode '"+klas+"' is onbekend. Vraag je docent om de juiste code."};
    }
    if(!data)data=await bmIdentCreate(klas,lcode,name);
    // Eenmalige migratie: lokaal profiel importeren als Firebase-identiteit nieuw is
    if(isNew&&fbDB){
      const localXp=P.xp||0, localCorrect=P.stats?.totalCorrect||0;
      if((localXp>0||localCorrect>0)&&confirm("Je hebt al Certamen-voortgang ("+localCorrect+" goede antwoorden, "+localXp+" XP). Wil je deze importeren in je gekoppelde profiel?")){
        const imp={xp:localXp,coins:P.coins||0,achievements:P.achievements||[]};
        await fbDB.ref("identities/"+klas+"/"+lcode).update(imp);
        data={...data,...imp};
      }
    }
    // Bestaand profiel: houd de opgeslagen (evt. zelfgekozen) getoonde naam aan;
    // alleen bij een nieuw profiel geldt de zojuist getypte naam. Zo overschrijft
    // opnieuw inloggen een via 'Mijn profiel' aangepaste naam niet.
    const effName = isNew ? name : (data.name || name);
    BM_IDENT={klascode:klas,leerlingcode:lcode,...data,name:effName,avatar:bmAvatarMerge(data.avatar)};
    // Volledige identiteit cachen (xp, classHistory, battles, achievements) zodat 'Mijn profiel' offline klopt
    bmIdentSave({klascode:klas,leerlingcode:lcode,...data,name:effName});
    return{ok:true,ident:BM_IDENT};
  }catch(e){console.error("bmIdentDoLogin fout:",e);return{ok:false,error:"Aanmelden mislukt: "+(e?.message||e||"onbekende fout")};}
}
// Genereert een badge uit een willekeurige klassenaam (BM_CLASSES, dezelfde
// lijst als de klassekeuze in het gevecht zelf) + volgnummer, als vervanging
// voor een verplichte vrije-tekst weergavenaam.
function bmAutoName(){
  return pick(BM_CLASSES).nm+" "+(1+rand(99));
}
async function bmIdentLogin(){
  const klas=el("bmKlas")?.value, lcode=el("bmLcode")?.value, name=el("bmNaam")?.value;
  const err=el("bmIdentErr");
  if(err)err.style.display="none";
  const r=await bmIdentDoLogin(klas,lcode,name);
  if(!r.ok){ if(err){err.textContent=r.error;err.style.display="";} return; }
  go(BM_IDENT_RETURN||"battleJoin");
}
async function bmIdentContinue(){
  const saved=bmIdentLoad(); if(!saved){SCREENS.battleIdentity();return;}
  BM_IDENT=saved;
  try{const d=await bmIdentGet(saved.klascode,saved.leerlingcode);if(d){BM_IDENT={...saved,...d};bmIdentSave({...saved,...d});}}catch(e){}
  go(BM_IDENT_RETURN||"battleJoin");
}

// ---- Optionele Google-koppeling: hergebruikt bmIdent* hierboven, voegt alleen een
// alternatieve inlogweg + koppel/ontkoppel-actie toe. Zie net.js voor bmGoogle*-helpers.
async function bmGoogleLinkCurrentIdent(identOverride){
  const ident=identOverride||BM_IDENT||bmIdentLoad();
  if(!ident||!ident.klascode||!ident.leerlingcode){ toast("Geen profiel","Meld je eerst aan met je klascode en leerlingcode."); return; }
  const r=await bmGoogleSignIn({action:"link", klas:ident.klascode, lid:ident.leerlingcode, returnScreen:_screen});
  if(r.redirecting) return; // pagina navigeert weg; wordt afgehandeld na terugkomst
  if(!r.ok){ toast("Koppelen mislukt", r.error||"Onbekende fout"); return; }
  const w=await bmGoogleWriteLink(r.uid, ident.klascode, ident.leerlingcode);
  if(!w.ok){ toast("Koppelen mislukt", w.error); return; }
  if(BM_IDENT) BM_IDENT.googleUid=r.uid;
  bmIdentSave({...ident, googleUid:r.uid});
  toast("Gekoppeld!","Je kunt nu ook met dit Google-account inloggen op een nieuw toestel.");
}
// Zoekt de gekoppelde identiteit op voor een zojuist ingelogde Google-uid en laadt hem in
// BM_IDENT, precies zoals de klascode-flow dat doet. Gedeeld door bmGoogleLoginFresh
// (popup-pad) en bmGoogleHandleRedirectResult in net.js (redirect-fallback-pad).
async function bmGoogleFinishLogin(uid){
  const link=await bmGoogleLookupLink(uid);
  if(!link) return {ok:false, error:"Dit Google-account is nog niet gekoppeld aan een profiel. Meld je eerst aan met je klascode en koppel daarna via 'Mijn profiel'."};
  const data=await bmIdentGet(link.klas, link.lid);
  if(!data) return {ok:false, error:"Gekoppeld profiel niet gevonden."};
  BM_IDENT={klascode:link.klas, leerlingcode:link.lid, ...data, avatar:bmAvatarMerge(data.avatar)};
  bmIdentSave({klascode:link.klas, leerlingcode:link.lid, ...data});
  return {ok:true};
}
async function bmGoogleLoginFresh(){
  const err=el("bmIdentErr");
  if(err)err.style.display="none";
  const r=await bmGoogleSignIn({action:"login", returnScreen:"battleIdentity"});
  if(r.redirecting) return;
  if(!r.ok){ if(err){err.textContent=r.error;err.style.display="";} return; }
  const fin=await bmGoogleFinishLogin(r.uid);
  if(!fin.ok){ if(err){err.textContent=fin.error;err.style.display="";} return; }
  go(BM_IDENT_RETURN||"battleJoin");
}
async function bmGoogleUnlink(){
  const ident=BM_IDENT||bmIdentLoad();
  if(!ident||!ident.googleUid) return;
  const r=await bmGoogleRemoveLink(ident.googleUid, ident.klascode, ident.leerlingcode);
  if(!r.ok){ toast("Ontkoppelen mislukt", r.error); return; }
  if(BM_IDENT) delete BM_IDENT.googleUid;
  const saved=bmIdentLoad();
  if(saved){ delete saved.googleUid; bmIdentSave(saved); }
  toast("Ontkoppeld","Je profiel is niet meer gekoppeld aan een Google-account.");
}

// Haalt de nieuwste Battle Mode-identiteit uit Firebase en ververst de cache + (optioneel) het scherm.
// Zo tonen twee toestellen (zelfde klascode+leerlingcode) altijd hetzelfde
// xp/muntsaldo, ook als het ene toestel al een tijdje een oud tabblad open
// had staan terwijl er elders is bijgeschreven.
async function bmRefreshIdentCache(rerenderScreen){
  const saved=(typeof bmIdentLoad==="function")?bmIdentLoad():null;
  if(!saved||!saved.klascode||!saved.leerlingcode)return;
  if(!initFirebase())return;
  try{
    const d=await bmIdentGet(saved.klascode,saved.leerlingcode);
    if(d){
      const merged={...saved,...d};
      bmIdentSave(merged);
      if(BM_IDENT)BM_IDENT={...BM_IDENT,...d};
      // Alleen herrenderen als de speler nog op datzelfde scherm staat (anders
      // overschrijf je bv. een avatar-bewerking die intussen is gestart).
      if(rerenderScreen&&SCREENS[rerenderScreen]&&_screen===rerenderScreen)SCREENS[rerenderScreen]();
    }
  }catch(e){}
}
function bmIdentSwitch(){bmIdentClear();BM_IDENT=null;SCREENS.battleIdentity();}

/* ---- SCHERM: battleHostSettings ---- */
let BM_ADV_OPEN=false;
SCREENS.battleHostSettings = function(){
  if(!BM_META)BM_META={};
  // Total War-belegering (zie twStartAttack() in totalwar.js): speltype en
  // baas liggen vast — een belegering is altijd Boss Battle tegen het
  // verborgen garnizoen, nooit een keuze van de docent.
  const isSiege=!!BM_META.garrisonProvince;
  if(isSiege){ BM_META.mode="boss"; BM_META.bossId="garrison"; }
  const th=BM_META.theme||bmWeekFactionId();
  if(!BM_META.theme)BM_META.theme=th;
  const mode=BM_META.mode||"pvp";
  if(!BM_META.mode)BM_META.mode=mode;
  const bossId=BM_META.bossId||BOSS_PRESET_ORDER[0];
  if(!BM_META.bossId)BM_META.bossId=bossId;
  const siegeProvinceNm=isSiege?((_twRegistry?.[BM_META.garrisonProvince.id]?.displayName)||BM_META.garrisonProvince.id):"";
  const siegeCivNm=isSiege?(TW_CIVS[BM_META.attackerCivId]?.nm||BM_META.attackerCivId):"";
  const bossDiff=BM_META.bossDifficulty||"normal";
  if(!BM_META.bossDifficulty)BM_META.bossDifficulty=bossDiff;
  const at=BM_META.answerTimer||10;
  const ah=BM_META.armyHealth||100;
  const adp=BM_META.adaptive!==false;
  const anim=BM_META.animations!==false;
  const combos=BM_META.combos!==false;
  const mastery=BM_META.masteryBonuses!==false;
  const sfx=BM_META.sfx!==false;
  const hero=BM_META.heroMode===true;
  const hhp=BM_META.heroMaxHp||15;
  const rsp=BM_META.respawnRequired||5;
  const tog=(key,val)=>`BM_META.${key}=${val};SCREENS.battleHostSettings()`;
  const chips=(key,vals,cur,fmt=v=>v)=>vals.map(v=>`<button class="chip ${cur===v?"on":""}" onclick="${tog(key,JSON.stringify(v))}">${fmt(v)}</button>`).join("");
  const onoff=(key,cur)=>`<button class="chip ${cur?"on":""}" onclick="${tog(key,true)}">Aan</button><button class="chip ${!cur?"on":""}" onclick="${tog(key,false)}">Uit</button>`;
  const fac=bmFaction(th);
  H(brand(true)+`
  <div class="scrhead"><button class="back" onclick="go('hostSource')">${iconSVG("shield",20,"currentColor")}</button><h2>Battle — Instellingen</h2></div>
  ${isSiege?`
  <div class="panel" style="border-color:var(--hi-dim)">
    <label class="fld">Total War — belegering</label>
    <div class="note">⚔ Je bestormt <b>${esc(siegeProvinceNm)}</b> namens ${esc(siegeCivNm)} — dit is altijd een Boss Battle tegen het garnizoen van de provincie, niet te wijzigen.</div>
  </div>
  `:`
  <div class="panel">
    <label class="fld">Speltype</label>
    <div class="chips">
      <button class="chip ${mode==="pvp"?"on":""}" onclick="BM_META.mode='pvp';SCREENS.battleHostSettings()">Team vs Team</button>
      <button class="chip ${mode==="boss"?"on":""}" onclick="BM_META.mode='boss';SCREENS.battleHostSettings()">Boss Battle (co-op)</button>
    </div>
    <div class="note" style="margin-top:6px">${mode==="boss"?"De hele klas vecht samen tegen één baas — geen tegenstander-team nodig, ook geschikt om alleen te trainen.":"Twee teams strijden tegen elkaar tot één leger op 0 HP staat."}</div>
  </div>
  ${mode==="boss"?"":`
  <div class="panel">
    <label class="fld">Factie / Thema</label>
    <select style="width:100%;padding:10px 12px;background:var(--stone3);color:var(--cream);border:1px solid var(--stone4);border-radius:8px;font-size:15px;font-family:inherit" onchange="BM_META.theme=this.value;SCREENS.battleHostSettings()">
      ${BM_FACTIONS.map(f=>`<option value="${f.id}"${th===f.id?" selected":""}>${f.nm}</option>`).join("")}
    </select>
    <div class="note" style="margin-top:6px">${iconSVG(fac.teams.A.icon,13,fac.cssVars["--teamA"]||"var(--teamA)")} ${esc(fac.teams.A.nm)} vs ${iconSVG(fac.teams.B.icon,13,fac.cssVars["--teamB"]||"var(--teamB)")} ${esc(fac.teams.B.nm)}</div>
  </div>`}
  `}
  ${mode==="boss"?`
  <div class="panel">
    <label class="fld">${isSiege?"Tegenstander":"Kies de baas"}</label>
    ${isSiege?`
    <div class="note">${bmBossPreset("garrison").emoji} <b>${esc(bmBossPreset("garrison").nm)}</b> — ${esc(bmBossPreset("garrison").desc)}</div>
    `:`
    <div class="chips">${BOSS_PRESET_ORDER.map(id=>{const p=BOSS_PRESETS[id];return `<button class="chip ${bossId===id?"on":""}" onclick="BM_META.bossId='${id}';SCREENS.battleHostSettings()">${p.emoji} ${esc(p.nm)}</button>`;}).join("")}</div>
    <div class="note" style="margin-top:6px">${esc(bmBossPreset(bossId).desc)}</div>
    `}
  </div>
  <div class="panel">
    <label class="fld">Moeilijkheidsgraad</label>
    <div class="chips">${BOSS_DIFF_ORDER.map(id=>`<button class="chip ${bossDiff===id?"on":""}" onclick="BM_META.bossDifficulty='${id}';SCREENS.battleHostSettings()">${BOSS_DIFFICULTIES[id].nm}</button>`).join("")}</div>
  </div>`:""}
  <div class="panel">
    <label class="fld">Antwoordtijd per ronde</label>
    <div class="chips">${chips("answerTimer",[8,10,12,15],at,v=>v+"s")}</div>
  </div>
  <div class="panel">
    <label class="fld">Slagveld-achtergrond</label>
    <select style="width:100%;padding:10px 12px;background:var(--stone3);color:var(--cream);border:1px solid var(--stone4);border-radius:8px;font-size:15px;font-family:inherit" onchange="BM_META.background=this.value;SCREENS.battleHostSettings()">
      <option value="geen"${(BM_META.background||"geen")==="geen"?" selected":""}>Standaard (thema-landschap)</option>
      ${Object.entries(BATTLE_BACKGROUNDS).map(([k,b])=>`<option value="${k}"${BM_META.background===k?" selected":""}>${esc(b.nm)}</option>`).join("")}
    </select>
    <div class="note" style="margin-top:6px">Kies een veldslag-decor (vloer + horizon). Plaats de afbeeldingen in <code>assets/battlebacks/</code>.</div>
  </div>
  <button class="btn btn-gold btn-block lg" onclick="bmCreateRoom()">Gevecht aanmaken</button>
  <button class="btn btn-ghost btn-block" onclick="BM_ADV_OPEN=!BM_ADV_OPEN;SCREENS.battleHostSettings()" style="margin-top:8px">
    ${BM_ADV_OPEN?"▲":"▼"} Geavanceerde instellingen
  </button>
  ${BM_ADV_OPEN?`
  <div class="panel" style="margin-top:8px">
    <label class="fld">Legersterkte per team</label>
    <div class="chips">${chips("armyHealth",[50,100,150,200],ah)}</div>
  </div>
  <div class="panel">
    <label class="fld">Heldenmodus <span class="pill" style="background:var(--ox);border:none">BETA</span></label>
    <div class="chips">${onoff("heroMode",hero)}</div>
    <div class="note" style="margin-top:6px">Elke speler krijgt een eigen held met persoonlijke HP. Helden vormen een frontlinie die het leger beschermt: schade treft eerst de levende helden, daarna pas het leger.</div>
    ${hero?`<label class="fld" style="margin-top:10px">HP per held</label>
    <div class="chips">${chips("heroMaxHp",[10,15,20,30],hhp)}</div>
    <label class="fld" style="margin-top:10px">Goede antwoorden om te herrijzen</label>
    <div class="chips">${chips("respawnRequired",[3,5,8],rsp)}</div>
    <div class="note" style="margin-top:6px">Een gevallen held herrijst zodra de speler dit aantal vragen goed beantwoordt.</div>`:""}
  </div>
  <div class="panel">
    <label class="fld">Adaptief leren</label>
    <div class="chips">${onoff("adaptive",adp)}</div>
    <div class="note" style="margin-top:6px">Foute woorden komen vaker terug voor die leerling.</div>
  </div>
  <div class="panel">
    <label class="fld">Combo-abilities</label>
    <div class="chips">${onoff("combos",combos)}</div>
    <div class="note" style="margin-top:6px">Stelt spelers in staat samen combo-aanvallen te doen.</div>
  </div>
  <div class="panel">
    <label class="fld">Mastery-bonussen</label>
    <div class="chips">${onoff("masteryBonuses",mastery)}</div>
    <div class="note" style="margin-top:6px">★★★+ klassemastery geeft +1 starting BE.</div>
  </div>
  <div class="panel">
    <label class="fld">Slagveld-animaties</label>
    <div class="chips">${onoff("animations",anim)}</div>
    <div class="note" style="margin-top:6px">Schakel uit bij trage Chromebooks.</div>
  </div>
  <div class="panel">
    <label class="fld">Geluidseffecten</label>
    <div class="chips">${onoff("sfx",sfx)}</div>
  </div>`:""}
  ${foot()}`);
};

/* ---- KAMER AANMAKEN ---- */
async function bmCreateRoom(){
  if(!initFirebase()){toast("Firebase vereist","Stel Firebase in om Battle Mode te hosten.");return;}
  const pool=buildPool(DRAFT);
  if(pool.length<4){toast("Te weinig woorden","Kies een groter bereik of voeg meer woorden toe.");return;}
  POOL=pool;
  if(!BM_META)BM_META={};
  const ah=BM_META.armyHealth||100;
  const meta={game:"battle",lang:DRAFT.lang,source:DRAFT.source,fromN:DRAFT.fromN,toN:DRAFT.toN,
    cat:DRAFT.cat,customText:DRAFT.customText||"",armyHealth:ah,
    answerTimer:BM_META.answerTimer||10,adaptive:BM_META.adaptive!==false,
    theme:BM_META.theme||bmWeekFactionId(),
    background:BM_META.background||"geen",
    animations:BM_META.animations!==false,
    combos:BM_META.combos!==false,
    masteryBonuses:BM_META.masteryBonuses!==false,
    sfx:BM_META.sfx!==false,
    heroMode:BM_META.heroMode===true,
    heroMaxHp:BM_META.heroMaxHp||15,
    respawnRequired:BM_META.respawnRequired||5,
    mode:BM_META.mode||"pvp",
    bossId:BM_META.bossId||BOSS_PRESET_ORDER[0],
    bossDifficulty:BM_META.bossDifficulty||"normal",
    // Total War-belegering (zie twStartAttack() in totalwar.js): deze twee
    // velden moeten expliciet worden overgenomen, anders gaan ze verloren
    // zodra BM_META hieronder vervangen wordt door dit meta-object — en dan
    // ziet bmStartBossGame()/bmResolve() nooit dat dit gevecht een belegering is.
    garrisonProvince:BM_META.garrisonProvince||null,
    attackerCivId:BM_META.attackerCivId||null,
    status:"lobby"};
  BM_META=meta;
  try{
    let code=code4();
    for(let i=0;i<5;i++){const ex=await FBNet.exists(code);if(!ex)break;code=code4();}
    BM_CODE=CODE=code;
    await fbDB.ref("rooms/"+code).set({
      meta,pool,
      state:{status:"lobby",round:null,winner:null},
      teams:{A:{health:ah,maxHealth:ah},B:{health:ah,maxHealth:ah}},
      players:{},log:{}
    });
    go("battleHostLobby");
  }catch(e){
    toast("Fout bij aanmaken","Fout: "+(e&&e.message?e.message:String(e)));
  }
}

/* ---- SCHERM: battleHostLobby ---- */
SCREENS.battleHostLobby = function(){
  bmApplyTheme(BM_META?.theme);
  const fac=bmFaction(BM_META?.theme);
  const isBoss=BM_META?.mode==="boss";
  const title=isBoss?bmBossPreset(BM_META.bossId).nm:fac.nm;
  H(brand(false)+`
  <div class="scrhead"><button class="back" onclick="leaveAll();bmLeave();go('home')">${iconSVG("shield",20,"currentColor")}</button><h2>${esc(title)} — Lobby</h2></div>
  <div class="codecard">
    <div class="lbl">Spelcode — geef dit aan de klas</div>
    <div class="code">${BM_CODE}</div>
  </div>
  <div class="panel">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
      <h3 style="margin:0">Spelers <span id="bmLN"></span></h3>
      ${isBoss?"":`<button class="btn btn-ghost" style="padding:9px 14px" onclick="bmAutoTeams()">⚖ Teams</button>`}
    </div>
    <div class="plist" id="bmPlist"></div>
    ${isBoss?"":`<div class="note" style="margin-top:8px">Sleep een leerling naar de andere kolom om van team te wisselen — of gebruik het ⇄-knopje (dat werkt ook op een aanraakscherm).</div>`}
  </div>
  <div class="panel">
    <label class="fld">AI-teamgenoten toevoegen</label>
    <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
      ${isBoss?"":`<select id="bmBotTeam" style="padding:7px 10px;background:var(--stone3);color:var(--cream);border:1px solid var(--stone4);border-radius:8px;font-size:14px;font-family:inherit">
        <option value="A">${esc(fac.teams.A.nm)}</option>
        <option value="B">${esc(fac.teams.B.nm)}</option>
      </select>`}
      <select id="bmBotAcc" style="padding:7px 10px;background:var(--stone3);color:var(--cream);border:1px solid var(--stone4);border-radius:8px;font-size:14px;font-family:inherit">
        <option value="0.95">Excellent (95%)</option>
        <option value="0.75" selected>Gemiddeld (75%)</option>
        <option value="0.5">Zwak (50%)</option>
        <option value="0.25">Erg zwak (25%)</option>
      </select>
      <button class="btn btn-gold" style="padding:8px 14px" onclick="bmAddBot()">+ Bot</button>
    </div>
    <div class="note" style="margin-top:6px">Bots beantwoorden vragen automatisch en kiezen een willekeurige actie.</div>
  </div>
  <button class="btn btn-gold btn-block lg" id="bmSB" onclick="bmStartGame()" disabled>Start het gevecht</button>
  ${foot()}`);
  const rP=fbDB.ref("rooms/"+BM_CODE+"/players"), fP=rP.on("value",s=>{BM_PLAYERS=s.val()||{};bmRenderHostLobby();});
  const rT=fbDB.ref("rooms/"+BM_CODE+"/teams"), fT=rT.on("value",s=>{BM_TEAMS=s.val()||{};});
  BM_UNSUBS=[()=>rP.off("value",fP),()=>rT.off("value",fT)];
};
function bmAddBot(){
  const team=el("bmBotTeam")?.value||"A";
  const acc=parseFloat(el("bmBotAcc")?.value||"0.75");
  const cls=BM_CLASSES[Math.floor(Math.random()*BM_CLASSES.length)];
  const names=["Maximus","Iulia","Marcus","Livia","Brutus","Cornelia","Titus","Flavia","Cassius","Helena"];
  const name=names[Math.floor(Math.random()*names.length)]+" (bot)";
  const pid="bot_"+Date.now();
  const bot={name,team,class:cls.id,isBot:true,botAcc:acc,be:2,correct:0,wrong:0,damage:0,healing:0,
    avatar:bmAvatarDefaults(),color:cls.color||COLORS[0],identityKey:"bot:"+pid};
  fbDB.ref("rooms/"+BM_CODE+"/players/"+pid).set(bot);
}
function bmRenderHostLobby(){
  const ln=el("bmLN"); if(ln)ln.textContent="("+Object.keys(BM_PLAYERS).length+")";
  const pl=el("bmPlist"); if(!pl)return;
  const fac=bmFaction(BM_META?.theme);
  const isBoss=BM_META?.mode==="boss";
  const q=s=>"'"+String(s).replace(/\\/g,"\\\\").replace(/'/g,"\\'")+"'";
  const row=([pid,p])=>`<div class="ptag${isBoss?"":" bm-draggable"}"${isBoss?"":` draggable="true" ondragstart="bmDragStart(event,${q(pid)})" ondragend="bmDragEnd(event)" title="Sleep naar het andere team"`}
    style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;padding:5px 0;border-bottom:0.5px solid var(--stone4)">
    <span style="flex:1;display:flex;align-items:center;gap:6px;min-width:0">
      ${p.isBot?`<span style="font-size:16px" title="AI-bot">🤖</span>`:`${avatarHTML(p.avatar||"helmet",p.color||COLORS[0],26)}`}
      <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(p.name)}</span>
      ${p.title?`<span class="pill" style="font-size:10px;background:var(--hi-dim)">⭐ ${esc(p.title)}</span>`:""}
      ${p.class?`<span class="pill" style="font-size:11px">${esc(bmClsName(p.class))}</span>`:""}
    </span>
    ${isBoss?"":`<button class="chip" style="font-size:11px" title="Wissel van team" onclick="bmSwitchTeam(${q(pid)})">⇄</button>`}
    <button class="chip" style="font-size:11px;color:#e07060;border-color:rgba(90,18,12,.4)" title="Verwijder" onclick="bmKickPlayer(${q(pid)})">✕</button>
  </div>`;
  const entries=Object.entries(BM_PLAYERS);
  if(isBoss){
    pl.classList.remove("bm-lobby-teams");
    pl.innerHTML=entries.map(row).join("")||`<div class="note">Wachten op spelers…</div>`;
  } else {
    // Twee kolommen naast elkaar, in dezelfde volgorde als op het slagveld:
    // team A links, team B rechts. Zo ziet de klas op de projector meteen bij
    // wie ze horen en tegen wie ze straks spelen.
    pl.classList.add("bm-lobby-teams");
    const col=(t,nm)=>{
      const mem=entries.filter(([,p])=>p.team===t);
      return `<div class="bm-lteam side-${t.toLowerCase()}"
        ondragover="bmDragOver(event)" ondragleave="bmDragLeave(event)" ondrop="bmDropTeam(event,'${t}')">
        <div class="bm-lteam-hd">${esc(nm)} <span>${mem.length}</span></div>
        ${mem.map(row).join("")||`<div class="note">Nog niemand</div>`}
      </div>`;
    };
    const rest=entries.filter(([,p])=>p.team!=="A"&&p.team!=="B");
    // Ongelijke teams zijn príma — de legersterkte compenseert dat (bmTeamHP).
    // Wel even zeggen, anders lijken de twee HP-balken straks een fout.
    const nA=entries.filter(([,p])=>p.team==="A").length;
    const nB=entries.filter(([,p])=>p.team==="B").length;
    const scheef=(nA&&nB&&nA!==nB)
      ? `<div class="note" style="grid-column:1/-1;margin-top:2px">Teams zijn ongelijk (${nA} tegen ${nB}). Dat mag: het kleinste team krijgt evenredig méér legersterkte, zodat het gevecht voor allebei even lang duurt.</div>`
      : "";
    pl.innerHTML=col("A",fac.teams.A.nm)+col("B",fac.teams.B.nm)+scheef
      +(rest.length?`<div class="bm-lteam side-none">
        <div class="bm-lteam-hd">Nog niet ingedeeld <span>${rest.length}</span></div>
        ${rest.map(row).join("")}
        <div class="note">Druk op "Teams" om ze te verdelen.</div>
      </div>`:"");
  }
  const sb=el("bmSB"); if(sb)sb.disabled=Object.keys(BM_PLAYERS).length<1;
}
function bmSetTeam(pid,team){
  const p=BM_PLAYERS[pid]; if(!p||p.team===team) return;
  fbDB.ref("rooms/"+BM_CODE+"/players/"+pid+"/team").set(team);
}
function bmSwitchTeam(pid){
  const p=BM_PLAYERS[pid]; if(!p) return;
  bmSetTeam(pid,p.team==="A"?"B":"A");
}

/* ---- SLEPEN TUSSEN TEAMS (docentlobby) ----
   Sneller dan het ⇄-knopje bij een hele klas: pak een leerling op en laat 'm
   in de andere kolom vallen. Het knopje blijft bestaan — HTML5-slepen werkt
   niet op een aanraakscherm, dus op een tablet is dat nog steeds de weg. */
let BM_DRAG_PID=null;
function bmDragStart(ev,pid){
  BM_DRAG_PID=pid;
  try{ ev.dataTransfer.setData("text/plain",pid); ev.dataTransfer.effectAllowed="move"; }catch(e){}
  ev.currentTarget.classList.add("bm-dragging");
}
function bmDragEnd(ev){
  BM_DRAG_PID=null;
  ev.currentTarget.classList.remove("bm-dragging");
  document.querySelectorAll(".bm-drop-hover").forEach(e=>e.classList.remove("bm-drop-hover"));
}
function bmDragOver(ev){
  ev.preventDefault();
  try{ ev.dataTransfer.dropEffect="move"; }catch(e){}
  ev.currentTarget.classList.add("bm-drop-hover");
}
function bmDragLeave(ev){
  // Alleen opruimen als de muis de kolom écht verlaat, niet bij elk kind-element
  if(ev.currentTarget.contains(ev.relatedTarget)) return;
  ev.currentTarget.classList.remove("bm-drop-hover");
}
function bmDropTeam(ev,team){
  ev.preventDefault();
  ev.currentTarget.classList.remove("bm-drop-hover");
  let pid=BM_DRAG_PID;
  if(!pid){ try{ pid=ev.dataTransfer.getData("text/plain"); }catch(e){} }
  BM_DRAG_PID=null;
  if(pid) bmSetTeam(pid,team);
}
function bmKickPlayer(pid){
  const p=BM_PLAYERS[pid]; if(!p) return;
  if(!confirm("Verwijder '"+p.name+"' uit het spel?")) return;
  fbDB.ref("rooms/"+BM_CODE+"/players/"+pid).remove();
}
function bmAutoTeams(){
  const pids=shuffle(Object.keys(BM_PLAYERS)),up={};
  pids.forEach((pid,i)=>{up[pid+"/team"]=i%2===0?"A":"B";});
  fbDB.ref("rooms/"+BM_CODE+"/players").update(up);
}
/* ---- LEGER-HP SCHAALT MEE MET HET AANTAL TEGENSTANDERS ----
   Een leger gaat kapot aan de schade van de óverkant, dus zijn HP hoort te
   schalen met het aantal spelers dáár — niet met de eigen teamgrootte. Alleen
   zo kost het beide teams evenveel rondes om verslagen te worden, en maakt het
   niet uit of de teams even groot zijn.

   Uiterste voorbeeld: 1 speler tegen 100. De honderd delen per ronde honderd
   keer zoveel schade uit, dus als beide legers evenveel HP hebben is die ene
   speler kansloos vóór hij één vraag beantwoord heeft. Met deze formule krijgt
   hij honderd keer zoveel HP als zij, en duurt het aan beide kanten even lang.
   In de praktijk gaat het om kleinere verschillen — 16 tegen 17 geeft 6 % —
   maar ook één speler verschil hoort door te tellen.

   De HP-chips in de docentinstellingen (50/100/150/200) zijn getuned op een
   team van BM_HP_REF_TEAM spelers: met ~2 aanvallen per ronde à ~8 schade duurt
   100 HP dan een stuk of zes rondes.

   De gekozen waarde blijft de ondergrens voor het zwákste leger. Die ondergrens
   werkt op beide legers tegelijk (dezelfde factor k), anders zou juist het
   verschil dat we hier proberen te maken weer platgedrukt worden.

   Boss Battle heeft geen tegenstander-team en rekent apart, zie
   bmStartBossGame() hieronder. */
const BM_HP_REF_TEAM=4;
function bmTeamHP(players,base){
  const b=base||100;
  const all=Object.values(players||{});
  const nA=Math.max(1,all.filter(p=>p&&p.team==="A").length);
  const nB=Math.max(1,all.filter(p=>p&&p.team==="B").length);
  // HP van een team volgt het aantal spelers aan de óverkant
  const rawA=b*nB/BM_HP_REF_TEAM;
  const rawB=b*nA/BM_HP_REF_TEAM;
  const k=Math.max(1,b/Math.min(rawA,rawB));   // ondergrens, verhouding blijft
  return {A:Math.max(1,Math.round(rawA*k)), B:Math.max(1,Math.round(rawB*k))};
}
async function bmStartGame(){
  if(BM_META?.mode==="boss"){await bmStartBossGame();return;}
  if(Object.keys(BM_PLAYERS).length<2){toast("Te weinig spelers","Wacht op minstens 2 deelnemers.");return;}
  const unassigned=Object.keys(BM_PLAYERS).filter(pid=>!BM_PLAYERS[pid]?.team);
  if(unassigned.length)bmAutoTeams();
  await new Promise(r=>setTimeout(r,300));
  // Pas híer is het echte spelersaantal bekend (spelers joinen ná bmCreateRoom),
  // dus pas hier kan de legersterkte geschaald worden. .update() i.p.v. .set(),
  // want teams/{A,B}/classes wordt zo meteen door bmDistributeQs() gevuld.
  const hp=bmTeamHP(BM_PLAYERS,BM_META?.armyHealth);
  await fbDB.ref("rooms/"+BM_CODE+"/teams").update(
    {"A/health":hp.A,"A/maxHealth":hp.A,"B/health":hp.B,"B/maxHealth":hp.B});
  BM_TEAMS={...BM_TEAMS,A:{...(BM_TEAMS.A||{}),health:hp.A,maxHealth:hp.A},
                        B:{...(BM_TEAMS.B||{}),health:hp.B,maxHealth:hp.B}};
  await bmDistributeQs(1);
  go("battleHostGame");
}
// Boss Battle-variant van bmStartGame(): iedereen op team A (de klas, geen
// tegenstander-team), en klas-/baas-HP geschaald met het daadwerkelijke
// spelersaantal N (pas nu bekend — spelers joinen ná bmCreateRoom()).
// Bepaalt, voor een belegering, welke werken (militia/walls/towers) er
// echt bevochten moeten worden — sporen met tier 0 (nooit getraind) worden
// overgeslagen — in de vaste TW_STAGE_ORDER-volgorde (militie/garnizoen dan
// muur dan fort). Gedeeld door bmStartBossGame() en bmResolve() hieronder.
function bmSiegeStageKeys(gp){
  if(!gp) return [];
  // Militie staat altijd vooraan, ook op tier 0 ("De Boeren") — die stage
  // wordt nooit overgeslagen. Muur/toren tellen alleen mee als ze echt
  // getraind zijn (tier 0 = nog niet gebouwd, dus niks om te bevechten).
  return TW_STAGE_ORDER.filter(key=> key==="militia" || twStructureTier(gp[TW_STRUCTURES[key].field]) > 0);
}

async function bmStartBossGame(){
  const pids=Object.keys(BM_PLAYERS);
  if(pids.length<1){toast("Geen spelers","Wacht op minstens 1 deelnemer.");return;}
  const N=pids.length;
  const diffM=bmBossDiff(BM_META.bossDifficulty).m;
  const classMaxHP=N*100;
  // bossMaxHP = N * verwachte aantal correcte antwoorden per speler (15) *
  // gemiddelde schade per hit. De ontwerpdoc ging uit van DMG_base=100, maar
  // de echte BM_CLASSES-abilities liggen op 4-14 schade per hit — 8 is de
  // realistische gemiddelde schaal hier; bijstellen kan door alleen deze
  // ene constante te wijzigen. Bij een belegering (garrisonProvince) wordt
  // dit vervangen door de eerste te bevechten stage se eigen HP — drie
  // losse gevechten na elkaar (militie/garnizoen → muur → fort), zie
  // TOTAL_WAR.md §5 en het sessieplan.
  let bossMaxHP=Math.max(1,Math.round(N*15*8*diffM));
  let bossStartHP=bossMaxHP;
  let stageIdx=0;
  const gp=BM_META.garrisonProvince;
  if(gp){
    const stageKeys=bmSiegeStageKeys(gp);
    if(stageKeys.length){
      const lastStage=gp.siege && gp.siege.lastStage;
      const resumeIdx=lastStage ? stageKeys.indexOf(lastStage) : 0;
      stageIdx=resumeIdx>=0 ? resumeIdx : 0;
      const stageKey=stageKeys[stageIdx];
      const stageMax=twStageMaxHP(gp, stageKey);
      const dmg=(gp.siege && gp.siege.stageDamage && gp.siege.stageDamage[stageKey])||0;
      bossMaxHP=stageMax;
      bossStartHP=Math.max(1, stageMax-dmg);
    }
    // stageKeys.length===0: niks ooit getraind — generieke basisformule
    // hierboven blijft ongewijzigd staan, geen belegeringsfases.
  }
  const teamUp={};
  for(const pid of pids)teamUp[pid+"/team"]="A";
  await fbDB.ref("rooms/"+BM_CODE+"/players").update(teamUp);
  const teams={A:{health:classMaxHP,maxHealth:classMaxHP},B:{health:bossStartHP,maxHealth:bossMaxHP}};
  await fbDB.ref("rooms/"+BM_CODE+"/teams").set(teams);
  // Minotaurus start met een persistent Labyrinth-schild (30% van zijn
  // max-HP) — baas-eigen state, zie bmResolve() hieronder voor hoe dat
  // vóór newHB wordt verrekend, en bmBossResolveTick() (bossbattle.js)
  // voor de Enrage-omschakeling zodra het doorbroken is.
  const bossInit={phase:1,rage:0,roundsSinceAttack:0,stage:stageIdx};
  if(BM_META.bossId==="minotaur") bossInit.labyrinthShield=Math.round(0.30*bossMaxHP);
  await fbDB.ref("rooms/"+BM_CODE+"/boss").set(bossInit);
  BM_TEAMS=teams;
  await new Promise(r=>setTimeout(r,300));
  await bmDistributeQs(1);
  go("battleHostGame");
}

/* ---- VRAGEN VERDELEN (host) ---- */
async function bmDistributeQs(roundN){
  const pids=Object.keys(BM_PLAYERS);if(!pids.length)return;
  const at=BM_META?.answerTimer||10;
  // Synergiebonus (flat BE per speler) + passief BE voor Bevelvoerder
  const synA=bmCalcSynergy(BM_PLAYERS,"A"),synB=bmCalcSynergy(BM_PLAYERS,"B");
  const up={};
  for(const pid of pids){
    const p=BM_PLAYERS[pid]||{};
    const cls=BM_CLASSES.find(c=>c.id===p.class);
    let beBonus=p.team==="A"?synA:synB;
    if(cls?.passive?.type==="be_passive") beBonus+=cls.passive.val;
    if(BM_META?.masteryBonuses!==false) beBonus+=(p.masteryBonus||0);
    // Verborgen traits: vlakke +1 BE per ronde, los van de mastery-toggle
    // (permanent account-brede unlock, geen in-klas-verdiende bonus)
    if(p.traitGroot) beBonus+=1;
    if(p.traitNorage) beBonus+=1;
    // Alle passieve bronnen samen begrensd — zie BM_BE_ROUND_BONUS_CAP in
    // battle-data.js: met een volle klas is de hoogste synergietrap altijd
    // gehaald, en dan is +6 per speler per ronde geen beloning meer maar
    // gratis basisinkomen.
    beBonus=Math.min(beBonus,BM_BE_ROUND_BONUS_CAP);
    // Alleen ná een goed antwoord. Anders kwam een fout antwoord (−BM_WRONG_BE_
    // PENALTY) aan het begin van de volgende ronde alsnog positief uit doordat
    // de passieve bonus onvoorwaardelijk werd uitgekeerd. Ronde 1 is de
    // uitzondering: dan heeft nog niemand kunnen antwoorden.
    if(roundN>1&&!(p.lastAnswerRound===roundN-1&&p.lastAnswerOk===true)) beBonus=0;
    const pool=bmPersonalPool(pid,POOL,roundN);
    up["players/"+pid+"/currentQ"]=JSON.stringify(makeQuestion(pool));
    up["players/"+pid+"/answeredRound"]=-1;
    up["players/"+pid+"/lockedAction"]=null;
    if(beBonus>0) up["players/"+pid+"/be"]=bmClampBE((p.be||0)+beBonus);
    // Heldenmodus: initialiseer persoonlijke HP bij de eerste ronde
    if(roundN===1&&BM_META?.heroMode){
      const hhp=BM_META.heroMaxHp||15;
      up["players/"+pid+"/hp"]=hhp;
      up["players/"+pid+"/maxHp"]=hhp;
      up["players/"+pid+"/armor"]=0;
      up["players/"+pid+"/isAlive"]=true;
      up["players/"+pid+"/respawnMeter"]=0;
    }
  }
  // Team-klassenlijst schrijven zodat spelers combo's kunnen zien
  const clsA=[...new Set(Object.values(BM_PLAYERS).filter(p=>p.team==="A"&&p.class).map(p=>p.class))];
  const clsB=[...new Set(Object.values(BM_PLAYERS).filter(p=>p.team==="B"&&p.class).map(p=>p.class))];
  // Schrijf state-velden apart zodat resolvedRound niet wordt overschreven
  up["state/status"]="playing";
  up["state/round"]={n:roundN,phase:"question",deadline:Date.now()+at*1000};
  up["state/winner"]=null;
  // Unieke id per gevecht. De XP-/muntenuitkering gebruikt 'm als sleutel voor
  // zijn "al toegekend"-guard (bmAwardBattle). Die guard stond eerst op de
  // spelcode — maar sinds "Nieuw gevecht — zelfde spelers" blijft de kamer
  // (en dus de code) bestaan, waardoor het tweede en volgende gevecht in
  // dezelfde kamer geen XP en munten meer uitkeerde.
  if(roundN===1) up["state/matchId"]=Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,7);
  up["teams/A/classes"]=clsA;
  up["teams/B/classes"]=clsB;
  await fbDB.ref("rooms/"+BM_CODE).update(up);
  // Bot auto-answer: bots antwoorden na een willekeurige vertraging
  const botEntries=Object.entries(BM_PLAYERS).filter(([,p])=>p.isBot);
  if(botEntries.length){
    for(const[pid,p] of botEntries){
      const acc=p.botAcc??0.75;
      const delay=1500+Math.random()*Math.max(0,(at-3)*1000);
      setTimeout(()=>{
        const correct=Math.random()<acc;
        const botBe=bmClampBE((BM_PLAYERS[pid]?.be||0)+(correct?1:0));
        const cls=BM_CLASSES.find(c=>c.id===p.class);
        const abilities=cls?.abilities||[];
        const affordable=abilities.filter(a=>(a.cost||0)<=botBe);
        const chosenAbility=affordable.length?affordable[Math.floor(Math.random()*affordable.length)]:null;
        const action=chosenAbility?{type:"ability",abilityId:chosenAbility.id,cost:chosenAbility.cost||0}:null;
        const botUp={};
        botUp["players/"+pid+"/answeredRound"]=roundN;
        botUp["players/"+pid+"/lastAnswerOk"]=correct;
        botUp["players/"+pid+"/lastAnswerRound"]=roundN;
        botUp["players/"+pid+"/correct"]=(p.correct||0)+(correct?1:0);
        botUp["players/"+pid+"/wrong"]=(p.wrong||0)+(correct?0:1);
        botUp["players/"+pid+"/be"]=bmClampBE(botBe-(action?.cost||0));
        if(action) botUp["players/"+pid+"/lockedAction"]=action;
        fbDB.ref("rooms/"+BM_CODE).update(botUp).catch(()=>{});
      },delay);
    }
  }
}
// Vervalteller (Leitner-achtig, zie benchmark-toetsing/02-wat-overnemen.md):
// een gemist woord krijgt pas ná een oplopend aantal rondes weer extra
// gewicht i.p.v. mogelijk de eerstvolgende ronde alweer. `due` (geschreven in
// bmAnswer) is de rondeteller vanaf wanneer het woord weer meetelt.
function bmPersonalPool(pid,pool,roundN){
  if(!BM_META?.adaptive)return pool;
  // Hergebruik de per-speler "missed"-telling die al naar Firebase geschreven
  // wordt bij een fout antwoord (zie bmAnswer) — geen apart lokaal register nodig.
  const missedEntries=Object.values(BM_PLAYERS[pid]?.missed||{});
  const w=[...pool];
  pool.forEach(word=>{
    const m=missedEntries.find(e=>e.p===word.la);
    if(!m||(roundN!=null&&m.due!=null&&roundN<m.due))return;
    for(let i=0;i<Math.min(m.c||0,3);i++)w.push(word);
  });
  return w.length?w:pool;
}

// Maakt bmPersonalPool()'s gewicht zichtbaar voor de speler zelf — puur
// motiverende feedback, geen effect op de spellogica. Toont de (max 5)
// woorden die deze sessie al eens fout gingen, dus dezelfde woorden die
// bmPersonalPool() extra laat terugkomen.
function bmAdaptiveHintHTML(){
  if(BM_META?.adaptive===false) return "";
  const missed=Object.values(BM_PLAYERS[BM_PID]?.missed||{}).sort((a,b)=>(b.c||0)-(a.c||0));
  const words=missed.slice(0,5).map(m=>m.p).filter(Boolean);
  if(!words.length) return "";
  return `<div class="note" style="margin-bottom:8px;color:var(--hi)">🎯 Je oefent nu extra op: <b>${words.map(esc).join(", ")}</b></div>`;
}

/* ---- SCHERM: battleHostGame ---- */
SCREENS.battleHostGame = function(){
  bmApplyTheme(BM_META?.theme);
  BM_FIELD_SOLO=false; _bmFormHash="";  // projectorscherm: de hele opstelling
  const appEl=document.getElementById("app");
  if(appEl)appEl.classList.add("bm-host-mode");
  H(`<div class="bm-host-wrap">
    <div class="bm-ctrl-bar">
      <span class="bm-cb-code" title="Leerlingen kunnen hiermee ook tijdens het gevecht instappen">Code <b>${BM_CODE}</b></span>
      <span id="bmRndLabel" class="bm-cb-round">Ronde —</span>
      <span id="bmPhaseLabel" class="bm-cb-phase">—</span>
      <span id="bmTimer" class="bm-cb-timer">—</span>
      <button id="bmPauseBtn" onclick="bmTogglePause()">⏸ Pauzeer</button>
      <button onclick="bmSkipRound()">⏭ Sla over</button>
      <button onclick="bmReplaceQ()">🔄 Vervang</button>
      <button onclick="bmRestartRound()">↩ Herstart</button>
      <button onclick="bmShowCommanders()" title="Toon commandanten van beide teams">👁 Commanders</button>
      <button class="bm-btn-end" style="margin-left:auto" onclick="bmEndGame()">✕ Beëindig</button>
    </div>
    <div class="bm-hp-row">
      <div class="bm-hp-side" id="bmArmyA"></div>
      <div class="bm-hp-vs">⚔️</div>
      <div class="bm-hp-side side-b" id="bmArmyB"></div>
    </div>
    <div id="bmField" class="${bmBgTheme(BM_META?.theme)}">
      <div class="bm-back2" id="bmBack2"></div>
      <div class="bm-back1" id="bmBack1"></div>
      <div id="bmFormA" class="bm-form"></div>
      <div id="bmFormB" class="bm-form"></div>
      <div id="bmBfx"></div>
    </div>
    <div class="bm-status-row">
      <span id="bmStatusNote"></span>
      <span style="flex:1"></span>
      <span id="bmPartPct" style="color:var(--green-bright)"></span>
      <div style="width:70px;height:4px;border-radius:2px;background:rgba(0,0,0,.4);overflow:hidden;margin-left:6px">
        <div id="bmPartBar" style="height:100%;width:0%;background:var(--green-bright);transition:width .35s"></div>
      </div>
    </div>
    <div class="bm-pgrid" id="bmPlayerGrid"></div>
  </div>`);
  BM_UNSUBS=[()=>{if(appEl)appEl.classList.remove("bm-host-mode");}];
  const timerInterval=setInterval(()=>{
    const round=BM_STATE.round||{};
    const te=el("bmTimer");if(!te)return;
    if(BM_PAUSED){te.textContent="⏸";return;}
    const tl=round.deadline?Math.max(0,Math.round((round.deadline-Date.now())/1000)):0;
    te.textContent=tl+"s";
  },500);
  BM_UNSUBS.push(()=>clearInterval(timerInterval));
  const rS=fbDB.ref("rooms/"+BM_CODE+"/state"),fS=rS.on("value",s=>{
    BM_STATE=s.val()||{};
    bmHostUpdateRound();
    if(BM_STATE.status==="finished")bmHostResult();
  });
  const rP=fbDB.ref("rooms/"+BM_CODE+"/players"),fP=rP.on("value",s=>{
    BM_PLAYERS=s.val()||{};
    bmHostUpdatePlayers();
    bmHostUpdateArmies();   // spelersaantal naast de teamnaam bijwerken
  });
  const rT=fbDB.ref("rooms/"+BM_CODE+"/teams"),fT=rT.on("value",s=>{
    BM_TEAMS=s.val()||{};
    bmHostUpdateArmies();
  });
  const rBoss=fbDB.ref("rooms/"+BM_CODE+"/boss"),fBoss=rBoss.on("value",s=>{
    BM_BOSS=s.val()||{};
    if(el("bmFormA"))bmBuildBattlefield();
  });
  BM_UNSUBS.push(()=>rS.off("value",fS),()=>rP.off("value",fP),()=>rT.off("value",fT),()=>rBoss.off("value",fBoss));
  bmSubscribeLog(BM_CODE);
  bmBuildBattlefield();
  bmHostStartTimer();
};
function bmHostUpdateRound(){
  const round=BM_STATE.round||{};
  const rndLbl=el("bmRndLabel");if(rndLbl)rndLbl.textContent="Ronde "+(round.n||"—");
  const phLbl=el("bmPhaseLabel");
  if(phLbl){
    if(round.phase==="question"){phLbl.textContent="VRAAGFASE";phLbl.style.color="var(--hi-bright)";}
    else if(round.phase==="action"){phLbl.textContent="ACTIEFASE";phLbl.style.color="var(--hi)";}
    else if(round.phase){phLbl.textContent="RESOLUTIE";phLbl.style.color="var(--muted2)";}
    else{phLbl.textContent="—";phLbl.style.color="";}
  }
  bmHostUpdateNote();
}
function bmHostUpdateArmies(){
  const tA=BM_TEAMS.A||{health:100,maxHealth:100},tB=BM_TEAMS.B||{health:100,maxHealth:100};
  const ea=el("bmArmyA"),eb=el("bmArmyB");
  if(ea)ea.innerHTML=bmArmyBarHTML("A",bmTeamNm("A"),tA);
  if(eb)eb.innerHTML=bmArmyBarHTML("B",bmTeamNm("B"),tB);
}
function bmHostUpdatePlayers(){
  const round=BM_STATE.round||{};
  const entries=Object.entries(BM_PLAYERS);
  const total=entries.length;
  const answered=entries.filter(([,p])=>p.answeredRound===round.n).length;

  // Participatie-balk
  const pct=total>0?Math.round(answered/total*100):0;
  const pb=el("bmPartBar"); if(pb)pb.style.width=pct+"%";
  const pp=el("bmPartPct"); if(pp)pp.textContent=answered+"/"+total+" ("+pct+"%)";

  // Spelersgrid — gesplitst per team, zodat de klas onder in beeld meteen ziet
  // wie bij wie hoort en tegen wie ze spelen. In Boss Battle is er maar één
  // team, dan blijft het één brede rij.
  const grid=el("bmPlayerGrid");if(!grid)return;
  const q=s=>"'"+String(s).replace(/\\/g,"\\\\").replace(/'/g,"\\'")+"'";
  const isBoss=BM_META?.mode==="boss";
  grid.classList.toggle("bm-dense",total>20);
  const ic=total>24?26:32;
  const card=([pid,p])=>{
    const cls=BM_CLASSES.find(c=>c.id===p.class);
    const col=cls?.color||"var(--muted)";
    const hasAnswered=p.answeredRound===round.n;
    const hasLocked=!!p.lockedAction;
    const dotCls=hasAnswered?"on":hasLocked?"locked":"";
    const teamCol=p.team==="A"?"var(--teamA)":p.team==="B"?"var(--teamB)":"var(--muted)";
    return `<div class="bm-pcard" style="border-color:${col}44">
      <div style="position:relative">
        ${p.isBot?`<span style="font-size:${ic-8}px;line-height:${ic}px;display:block;text-align:center">🤖</span>`:renderPixelHeroIcon(p.avatar,ic)}
        <span class="bm-pdot ${dotCls}"></span>
      </div>
      <div class="bm-pname" style="border-bottom:2px solid ${teamCol}40">${esc(p.name)}</div>
      <div class="bm-pcls" style="color:${col}">${esc(cls?.nm||"")}</div>
      <div class="bm-pactions">
        ${isBoss?"":`<button class="chip" style="font-size:10px;padding:2px 6px" title="Wissel team" onclick="bmSwitchTeam(${q(pid)})">⇄</button>`}
        <button class="chip" style="font-size:10px;padding:2px 6px;color:#e07060;border-color:rgba(90,18,12,.4)" title="Verwijder" onclick="bmKickPlayer(${q(pid)})">✕</button>
      </div>
    </div>`;
  };
  if(isBoss){
    grid.classList.remove("bm-pgrid-teams");
    grid.innerHTML=`<div class="bm-pteam-cards">${entries.map(card).join("")}</div>`;
  } else {
    grid.classList.add("bm-pgrid-teams");
    let html=["A","B"].map(t=>{
      const mem=entries.filter(([,p])=>p.team===t);
      const ans=mem.filter(([,p])=>p.answeredRound===round.n).length;
      return `<div class="bm-pteam side-${t.toLowerCase()}">
        <div class="bm-pteam-hd">${esc(bmTeamNm(t))} <span>${mem.length} · ${ans} beantwoord</span></div>
        <div class="bm-pteam-cards">${mem.map(card).join("")||`<div class="note">Nog niemand</div>`}</div>
      </div>`;
    }).join("");
    const rest=entries.filter(([,p])=>p.team!=="A"&&p.team!=="B");
    if(rest.length)html+=`<div class="bm-pteam side-none">
      <div class="bm-pteam-hd">Zonder team <span>${rest.length}</span></div>
      <div class="bm-pteam-cards">${rest.map(card).join("")}</div></div>`;
    grid.innerHTML=html;
  }

  bmHostUpdateNote();
  if(el("bmFormA"))bmBuildBattlefield();
}
function bmHostUpdateNote(){
  const round=BM_STATE.round||{};
  const note=el("bmStatusNote");if(!note)return;
  const all=Object.values(BM_PLAYERS);
  const answered=all.filter(p=>p.answeredRound===round.n).length;
  const locked=all.filter(p=>p.lockedAction).length;
  const total=all.length;
  let txt="";
  if(round.phase==="question")txt="Beantwoord: "+answered+"/"+total;
  else if(round.phase==="action")txt="Actie vergrendeld: "+locked+"/"+total;
  // Boss-mechanics-status: bewust alleen hier (hostscherm), niet op
  // leerling-toestellen — zie bmBossStatusNote() in bossbattle.js.
  const bossNote=(typeof bmBossStatusNote==="function")?bmBossStatusNote():"";
  note.textContent=bossNote?(txt?txt+" · "+bossNote:bossNote):txt;
}
// Aantal spelers in een team — zichtbaar naast de teamnaam, zodat de klas ziet
// hoe de teams verdeeld zijn (en waarom de legersterktes verschillen: die
// schalen met het aantal tegenstanders, zie bmTeamHP).
function bmTeamCount(team){
  return Object.values(BM_PLAYERS||{}).filter(p=>p&&p.team===team).length;
}
function bmArmyBarHTML(team,nm,d){
  const scale=d.maxHealth?Math.max(0,d.health/d.maxHealth):0;
  const col=team==="A"?"var(--teamA)":"var(--teamB)";
  const crit=d.maxHealth&&d.health/d.maxHealth<0.25?" bm-crit":"";
  const isB=team==="B";
  const origin=isB?"right center":"left center";
  // In Boss Battle heeft team B geen spelers — dan geen "0 spelers" naast de baas.
  const n=bmTeamCount(team);
  const telling=(BM_META?.mode==="boss"&&team==="B")?""
    :`<span class="bm-hp-cnt">${n} speler${n===1?"":"s"}</span>`;
  return `<div>
    <div class="bm-hp-nm${isB?" side-b":""}" style="color:${col}">${esc(nm)}${telling}</div>
    <div class="bm-hp-track">
      <div class="bm-hp-fill${crit}" style="width:100%;background:${col};transform:scaleX(${scale});transform-origin:${origin};will-change:transform"></div>
    </div>
    <div class="bm-hp-num${isB?" side-b":""}">${d.health}/${d.maxHealth} HP</div>
  </div>`;
}
// Toont kort een wit/zilver schild-segment vlak vóór (in de richting van inkomende
// schade) de echte HP-balk, die op dat moment al de nieuwe waarde toont — en
// laat het daarna wegkrimpen. Puur visueel: het schild zelf blijft één ronde
// geldig (zie bmResolve()/blockedA/blockedB), er verandert niets aan de
// spelregels. Host-only, want alleen daar bestaat #bmArmyA/#bmArmyB.
function bmShowShieldBlock(team,blocked){
  const track=document.querySelector(team==="A"?"#bmArmyA .bm-hp-track":"#bmArmyB .bm-hp-track");
  const t=BM_TEAMS[team];
  if(!track||!t?.maxHealth||blocked<=0)return;
  const curPct=Math.max(0,Math.min(1,(t.health||0)/t.maxHealth))*100;
  const pct=Math.min(100-curPct,blocked/t.maxHealth*100);
  if(pct<=0)return;
  const ov=document.createElement("div");
  ov.className="bm-hp-shield";
  ov.style.cssText=team==="A"?`left:${curPct}%;width:${pct}%`:`right:${curPct}%;width:${pct}%`;
  track.appendChild(ov);
  requestAnimationFrame(()=>{ov.style.width="0"});
  setTimeout(()=>ov.remove(),650);
}
function bmClsName(id){const c=BM_CLASSES.find(x=>x.id===id);return c?c.nm:id;}

/* ======================================================
   BATTLE MODE M5 — ANIMATIE-ENGINE
   Alle animaties draaien client-side op basis van log-events.
   Enige Firebase-sync: host schrijft log; clients lezen het.
   ====================================================== */

/* ======================================================
   BATTLE MODE M9 — SVG SPRITES & LANDSCHAPSTHEMA
   ====================================================== */

// Achtergrondklasse op basis van factie-thema
function bmBgTheme(theme){
  const greek=["athenai","spartiatai","hellas","makedones"];
  const gods=["theoi","titanes","olympici","chthonioi"];
  if(greek.includes(theme))return"bm-bg-greek";
  if(gods.includes(theme))return"bm-bg-gods";
  return"bm-bg-roman";
}

/* ── Slagveld-achtergronden (Battleback) ──────────────────────────────────
   RPG Maker MV bouwt achtergronden uit twee lagen: een 'vloer' (Battleback1)
   en een 'muur'/horizon (Battleback2). De docent kiest een set bij de
   instellingen; we leggen ze via inline CSS over elkaar op #bmField.
   Plaats de PNG's in assets/battlebacks/ (zie README aldaar). "geen" = val
   terug op het standaard CSS-landschapsthema. */
const BATTLE_BACKGROUNDS = {
  // Tweelaags (RPG Maker MV): floor = Battleback1, wall = Battleback2.
  "grasland":    { nm:"Grasvlakte",  floor:"assets/battlebacks/Grassland1.png",  wall:"assets/battlebacks/Grassland2.png" },
  "woestijn":    { nm:"Woestijn",    floor:"assets/battlebacks/Desert1.png",     wall:"assets/battlebacks/Desert2.png" },
  "tempel":      { nm:"Tempel",      floor:"assets/battlebacks/Temple1.png",     wall:"assets/battlebacks/Temple2.png" },
  "ruines":      { nm:"Ruïnes",      floor:"assets/battlebacks/Ruins1.png",      wall:"assets/battlebacks/Ruins2.png" },
  "fort":        { nm:"Fort",        floor:"assets/battlebacks/Fort1.png",       wall:"assets/battlebacks/Fort2.png" },
  "stad":        { nm:"Stad",        floor:"assets/battlebacks/Town1.png",       wall:"assets/battlebacks/Town2.png" },
  "haven":       { nm:"Haven",       floor:"assets/battlebacks/Port1.png",       wall:"assets/battlebacks/Port2.png" },
  "wolken":      { nm:"Wolken",      floor:"assets/battlebacks/Clouds1.png",     wall:"assets/battlebacks/Clouds2.png" },
  "hemel":       { nm:"Hemel",       floor:"assets/battlebacks/Sky1.png",        wall:"assets/battlebacks/Sky2.png" },
  "onderwereld": { nm:"Onderwereld", floor:"assets/battlebacks/Underworld1.png", wall:"assets/battlebacks/Underworld2.png" },
  // Enkellaags (één afbeelding, bv. een foto/JPG): gebruik 'single'.
  "olympus":     { nm:"Olympus",     single:"assets/battlebacks/Olympus.jpg", smooth:true },
};
// Inline style-string voor #bmField op basis van de gekozen achtergrond.
// Tweelaags: muur eerst genoemd (bovenste laag), vloer als tweede (eronder).
// Enkellaags ('single'): één afbeelding die het hele veld vult.
function bmArenaBgStyle(){
  const key=BM_META&&BM_META.background;
  const bg=key&&BATTLE_BACKGROUNDS[key];
  if(!bg||key==="geen")return"";
  const v=SPRITE_VER?("?"+SPRITE_VER):"";
  // 'smooth' (bv. fotomateriaal/JPG) niet pixelaten; pixel-art battlebacks wel.
  const render=bg.smooth?"auto":"pixelated";
  if(bg.single){
    return `background-image:url('${bg.single}${v}');`
         + `background-repeat:no-repeat;background-position:center bottom;`
         + `background-size:cover;image-rendering:${render};`;
  }
  return `background-image:url('${bg.wall}${v}'),url('${bg.floor}${v}');`
       + `background-repeat:no-repeat,no-repeat;background-position:center bottom,center bottom;`
       + `background-size:cover,cover;image-rendering:${render};`;
}
// Herbevestig de achtergrond op een bestaand #bmField (na herbouw).
// RPG Maker MV-methode: twee lagen. bmBack2 = muur/horizon (battleback2, hele
// veld), bmBack1 = vloer/grond (battleback1, onderste strook, ervoor).
function bmApplyArenaBg(field){
  if(!field)return;
  const b1=field.querySelector("#bmBack1"), b2=field.querySelector("#bmBack2");
  const key=BM_META&&BM_META.background;
  const bg=key&&key!=="geen"&&BATTLE_BACKGROUNDS[key];
  field.classList.toggle("bm-has-bg",!!bg);
  field.classList.toggle("bm-field-photo",!!(bg&&bg.smooth));
  field.style.cssText="";               // geen inline bg meer op het veld zelf
  if(!b1||!b2)return;
  const v=SPRITE_VER?("?"+SPRITE_VER):"";
  if(!bg){ b1.style.backgroundImage=""; b2.style.backgroundImage=""; return; }
  if(bg.single){ b2.style.backgroundImage=`url('${bg.single}${v}')`; b1.style.backgroundImage=""; return; }
  b2.style.backgroundImage=`url('${bg.wall}${v}')`;   // battleback2 → muur (achter)
  b1.style.backgroundImage=`url('${bg.floor}${v}')`;  // battleback1 → vloer (voor)
}

// Confetti-regen bij overwinning
function bmConfetti(){
  if(BM_META?.animations===false)return;
  const cont=el("bmField");if(!cont)return;
  const cols=["#ffd700","#c83020","#4080c8","#40a860","#d47820","#9040c0","#ffffff"];
  for(let i=0;i<24;i++){
    const d=document.createElement("div");
    d.className="bm-confetti";
    d.style.cssText=`left:${5+Math.random()*90}%;bottom:${15+Math.random()*65}%;background:${cols[i%cols.length]};animation-delay:${(Math.random()*.6).toFixed(2)}s;animation-duration:${(1.3+Math.random()*.8).toFixed(2)}s`;
    cont.appendChild(d);
    setTimeout(()=>d.remove(),2800);
  }
}

// SVG pijl-projectiel (vervangt emoji voor boogschutter)
function bmArrowProj(teamFrom, row){
  if(BM_META?.animations===false)return;
  const cont=el("bmBfx");if(!cont)return;
  const isR=teamFrom==="A";
  const d=document.createElement("div");
  d.className="bm-arrow "+(isR?"r":"l");
  d.style.setProperty("--row",row||0);
  d.innerHTML=`<svg viewBox="0 0 40 8" width="40" height="8" xmlns="http://www.w3.org/2000/svg">
    <line x1="0" y1="4" x2="36" y2="4" stroke="#c8a060" stroke-width="2"/>
    <polygon points="40,4 32,1 32,7" fill="#c89020"/>
    <line x1="2" y1="4" x2="2" y2="1" stroke="#8b5010" stroke-width="1.5"/>
    <line x1="5" y1="4" x2="5" y2="1.5" stroke="#8b5010" stroke-width="1"/>
  </svg>`;
  cont.appendChild(d);
  setTimeout(()=>d.remove(),950);
}

// Zij-aanzicht SVG sprite per klasse (altijd naar rechts; team B wordt gespiegeld via CSS)
function bmSpriteSVG(clsId){
  const sh=`<ellipse cx="30" cy="88" rx="15" ry="3.5" fill="rgba(0,0,0,.28)"/>`;
  switch(clsId){
    case"hopliet":return`<svg viewBox="0 0 60 90" xmlns="http://www.w3.org/2000/svg" class="bm-sprite" style="overflow:visible;display:block">
      ${sh}
      <rect x="21" y="63" width="9" height="22" rx="3" fill="#b08030"/>
      <rect x="32" y="63" width="9" height="22" rx="3" fill="#b08030"/>
      <rect x="17" y="35" width="28" height="28" rx="5" fill="#b08030" stroke="#d4a030" stroke-width="1.2"/>
      <line x1="17" y1="47" x2="45" y2="47" stroke="#d4a030" stroke-width=".8" opacity=".5"/>
      <rect x="17" y="58" width="28" height="6" rx="2" fill="#c8392a" opacity=".75"/>
      <ellipse cx="11" cy="49" rx="12" ry="15" fill="#c8392a" stroke="#d4a030" stroke-width="1.5"/>
      <ellipse cx="11" cy="49" rx="7.5" ry="9.5" fill="none" stroke="#d4a030" stroke-width="1" opacity=".55"/>
      <line x1="50" y1="7" x2="46" y2="78" stroke="#7a5018" stroke-width="2.5"/>
      <polygon points="50,5 45.5,17 54.5,13" fill="#c0c0c0"/>
      <circle cx="31" cy="22" r="10" fill="#d4a574"/>
      <path d="M20 20 Q31 5 42 20 L39.5 25 Q31 13 22.5 25Z" fill="#c8392a" stroke="#d4a030" stroke-width=".8"/>
      <rect x="29" y="14" width="4" height="14" rx="1.5" fill="#c8392a"/>
      <path d="M21.5 14 Q31 3 40.5 14" stroke="#8b1010" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    </svg>`;
    case"spartaan":return`<svg viewBox="0 0 60 90" xmlns="http://www.w3.org/2000/svg" class="bm-sprite" style="overflow:visible;display:block">
      ${sh}
      <rect x="21" y="63" width="9" height="22" rx="3" fill="#8b1a1a"/>
      <rect x="32" y="63" width="9" height="22" rx="3" fill="#8b1a1a"/>
      <rect x="21" y="67" width="9" height="15" rx="2" fill="#5a0808" opacity=".8"/>
      <rect x="32" y="67" width="9" height="15" rx="2" fill="#5a0808" opacity=".8"/>
      <rect x="16" y="34" width="29" height="29" rx="5" fill="#5a0808" stroke="#8b1a1a" stroke-width="1.2"/>
      <text x="30.5" y="53" text-anchor="middle" font-size="11" fill="#8b1a1a" font-family="serif" font-weight="bold" font-style="italic">λ</text>
      <ellipse cx="9" cy="48" rx="13" ry="16.5" fill="#8b1a1a" stroke="#c03020" stroke-width="2"/>
      <ellipse cx="9" cy="48" rx="8.5" ry="10.5" fill="none" stroke="#c03020" stroke-width="1.2"/>
      <text x="9" y="52" text-anchor="middle" font-size="9" fill="#c03020" font-weight="bold" font-family="serif">λ</text>
      <line x1="52" y1="5" x2="46" y2="82" stroke="#6a3010" stroke-width="2.5"/>
      <polygon points="52,3 47,15 57,11" fill="#b5b5b5"/>
      <circle cx="31" cy="21" r="10" fill="#d4a574"/>
      <path d="M20 19 Q31 4 42 19 L40 24.5 Q31 12 22 24.5Z" fill="#8b1a1a"/>
      <rect x="29" y="14" width="4" height="14.5" rx="1.5" fill="#8b1a1a"/>
      <path d="M20.5 13 Q31 1 41.5 13" stroke="#0a0a0a" stroke-width="4.5" fill="none" stroke-linecap="round"/>
    </svg>`;
    case"centurio":return`<svg viewBox="0 0 60 90" xmlns="http://www.w3.org/2000/svg" class="bm-sprite" style="overflow:visible;display:block">
      ${sh}
      <rect x="21" y="63" width="9" height="22" rx="3" fill="#6b2d8b"/>
      <rect x="32" y="63" width="9" height="22" rx="3" fill="#6b2d8b"/>
      <rect x="17" y="34" width="28" height="28" rx="4" fill="#c0a060" stroke="#d4a030" stroke-width="1.2"/>
      <line x1="17" y1="42" x2="45" y2="42" stroke="#d4a030" stroke-width=".9" opacity=".6"/>
      <line x1="17" y1="50" x2="45" y2="50" stroke="#d4a030" stroke-width=".9" opacity=".6"/>
      <rect x="17" y="58" width="28" height="5" rx="2" fill="#6b2d8b" opacity=".8"/>
      <rect x="5" y="36" width="17" height="27" rx="3" fill="#6b2d8b" stroke="#d4b060" stroke-width="1.5"/>
      <line x1="13.5" y1="36" x2="13.5" y2="63" stroke="#d4b060" stroke-width="1.5"/>
      <line x1="5" y1="49.5" x2="22" y2="49.5" stroke="#d4b060" stroke-width="1.5"/>
      <rect x="47" y="38" width="4" height="28" rx="2" fill="#c8c8c8"/>
      <rect x="44" y="36" width="10" height="4" rx="1.5" fill="#8b6010"/>
      <rect x="46" y="32" width="6" height="6" rx="1" fill="#d4a030"/>
      <circle cx="31" cy="21" r="10" fill="#d4a574"/>
      <path d="M21 19.5 Q31 7 41 19.5 L39 24 Q31 12 23 24Z" fill="#c0a060" stroke="#d4a030" stroke-width=".8"/>
      <path d="M17 13 L45 13" stroke="#c83020" stroke-width="4.5" stroke-linecap="round"/>
    </svg>`;
    case"boogschutter":return`<svg viewBox="0 0 60 90" xmlns="http://www.w3.org/2000/svg" class="bm-sprite" style="overflow:visible;display:block">
      ${sh}
      <rect x="22" y="62" width="9" height="23" rx="3" fill="#2e6fb0"/>
      <rect x="33" y="62" width="9" height="23" rx="3" fill="#2e6fb0"/>
      <rect x="18" y="36" width="25" height="26" rx="5" fill="#1a3060" stroke="#2e6fb0" stroke-width="1"/>
      <rect x="42" y="28" width="8" height="26" rx="3" fill="#5a3010"/>
      <rect x="43" y="26" width="6" height="5" rx="1" fill="#7a5020"/>
      <line x1="44.5" y1="29" x2="44" y2="22" stroke="#c8a060" stroke-width="1.5"/>
      <line x1="46.5" y1="29" x2="47" y2="21" stroke="#c8a060" stroke-width="1.5"/>
      <line x1="48.5" y1="29" x2="49" y2="22" stroke="#c8a060" stroke-width="1.5"/>
      <path d="M8 20 Q1 46 8 72" stroke="#7a5010" stroke-width="3.2" fill="none"/>
      <line x1="8" y1="20" x2="8" y2="72" stroke="#d4a060" stroke-width="1.2" stroke-dasharray="2,4"/>
      <line x1="8" y1="46" x2="22" y2="46" stroke="#c8a060" stroke-width="1.5"/>
      <polygon points="22,46 18,43 18,49" fill="#b08030"/>
      <rect x="9" y="38" width="7" height="17" rx="3.5" fill="#d4a574" transform="rotate(-8,12,46.5)"/>
      <rect x="15" y="40" width="13" height="6" rx="3" fill="#d4a574" transform="rotate(-5,21,43)"/>
      <circle cx="31" cy="21" r="10" fill="#d4a574"/>
      <path d="M21 21 Q31 7 41 21Z" fill="#2e6fb0" stroke="#1a3060" stroke-width=".8"/>
      <circle cx="31" cy="9.5" r="2.2" fill="#2e6fb0"/>
    </svg>`;
    case"cavalerie":return`<svg viewBox="0 0 60 90" xmlns="http://www.w3.org/2000/svg" class="bm-sprite" style="overflow:visible;display:block">
      ${sh}
      <ellipse cx="31" cy="72" rx="24" ry="11" fill="#7a5020"/>
      <ellipse cx="46" cy="60" rx="10.5" ry="8" fill="#7a5020" transform="rotate(-20,46,60)"/>
      <ellipse cx="51.5" cy="52" rx="6.5" ry="8.5" fill="#8b5e28" transform="rotate(-30,51.5,52)"/>
      <circle cx="53.5" cy="49" r="1.5" fill="#1a0a00"/>
      <rect x="12" y="78" width="5.5" height="13" rx="2.2" fill="#6a4018"/>
      <rect x="21" y="78" width="5.5" height="13" rx="2.2" fill="#6a4018"/>
      <rect x="35" y="78" width="5.5" height="13" rx="2.2" fill="#6a4018"/>
      <rect x="44" y="78" width="5.5" height="13" rx="2.2" fill="#6a4018"/>
      <rect x="18" y="37" width="23" height="23" rx="5" fill="#9b6914" stroke="#d4a030" stroke-width="1.2"/>
      <line x1="18" y1="48" x2="41" y2="48" stroke="#d4a030" stroke-width=".8" opacity=".5"/>
      <line x1="49" y1="18" x2="25" y2="60" stroke="#8b5010" stroke-width="2.5"/>
      <polygon points="49,16 44.5,26 53.5,24" fill="#c0c0c0"/>
      <circle cx="29" cy="24" r="9.5" fill="#d4a574"/>
      <path d="M19.5 23.5 Q29 10 38.5 23.5 L36.5 28 Q29 16 21.5 28Z" fill="#9b6914" stroke="#d4a030" stroke-width=".8"/>
      <line x1="29" y1="10" x2="29" y2="3" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" opacity=".9"/>
    </svg>`;
    case"priester":return`<svg viewBox="0 0 60 90" xmlns="http://www.w3.org/2000/svg" class="bm-sprite" style="overflow:visible;display:block">
      ${sh}
      <path d="M16 37 L15 85 Q30 89 45 85 L44 37Z" fill="#1a4028" stroke="#3f9d52" stroke-width="1.2"/>
      <path d="M16 37 Q9 58 11 85" stroke="#3f9d52" stroke-width="2.2" fill="none"/>
      <path d="M44 37 Q51 58 49 85" stroke="#3f9d52" stroke-width="2.2" fill="none"/>
      <line x1="46" y1="16" x2="48.5" y2="82" stroke="#5a3010" stroke-width="2.5"/>
      <circle cx="46" cy="14" r="5.5" fill="#d4a030" opacity=".92"/>
      <circle cx="46" cy="14" r="3.2" fill="none" stroke="#3f9d52" stroke-width="1.5"/>
      <rect x="40" y="44" width="7.5" height="13" rx="3.5" fill="#d4a574"/>
      <circle cx="30" cy="22" r="10" fill="#d4a574"/>
      <path d="M20 22 Q30 10 40 22" fill="none" stroke="#3f9d52" stroke-width="3.5" stroke-linecap="round"/>
      <circle cx="21" cy="22" r="2.2" fill="#3f9d52"/>
      <circle cx="25.5" cy="14.5" r="2" fill="#3f9d52"/>
      <circle cx="30" cy="12" r="2.2" fill="#3f9d52"/>
      <circle cx="34.5" cy="14.5" r="2" fill="#3f9d52"/>
      <circle cx="39" cy="22" r="2.2" fill="#3f9d52"/>
    </svg>`;
    case"genie":return`<svg viewBox="0 0 60 90" xmlns="http://www.w3.org/2000/svg" class="bm-sprite" style="overflow:visible;display:block">
      ${sh}
      <rect x="22" y="62" width="9" height="23" rx="3" fill="#7a4010"/>
      <rect x="33" y="62" width="9" height="23" rx="3" fill="#7a4010"/>
      <rect x="18" y="36" width="25" height="27" rx="5" fill="#7a4010" stroke="#c87533" stroke-width="1.2"/>
      <rect x="18" y="57" width="25" height="4.5" rx="1.5" fill="#c87533"/>
      <line x1="42" y1="62" x2="55" y2="35" stroke="#5a3010" stroke-width="3"/>
      <rect x="50" y="26" width="11" height="11" rx="2" fill="#707070" transform="rotate(30,55.5,31.5)"/>
      <rect x="39" y="42" width="8.5" height="17" rx="3.5" fill="#d4a574" transform="rotate(-22,43,50.5)"/>
      <circle cx="11" cy="51" r="9.5" fill="#c87533" stroke="#d47820" stroke-width="1.5"/>
      <circle cx="11" cy="51" r="4.5" fill="#d47820" opacity=".55"/>
      <circle cx="30" cy="22" r="9.5" fill="#d4a574"/>
      <path d="M21 22 Q30 9.5 39 22Z" fill="#c87533" stroke="#d47820" stroke-width=".8"/>
      <rect x="21" y="19.5" width="18" height="4" rx="2" fill="#c87533" opacity=".75"/>
    </svg>`;
    case"verkenner":return`<svg viewBox="0 0 60 90" xmlns="http://www.w3.org/2000/svg" class="bm-sprite" style="overflow:visible;display:block">
      ${sh}
      <rect x="22" y="59" width="9" height="25" rx="3" fill="#1a4a3a" transform="rotate(-6,26.5,71.5)"/>
      <rect x="33" y="61" width="9" height="24" rx="3" fill="#1a4a3a" transform="rotate(6,37.5,73)"/>
      <rect x="19" y="36" width="24" height="24" rx="5" fill="#1a4a3a" stroke="#2d8b7a" stroke-width="1"/>
      <path d="M19 36 Q7 54 10 83" stroke="#2d8b7a" stroke-width="3" fill="none" stroke-linecap="round" opacity=".75"/>
      <rect x="6" y="42" width="3.5" height="15" rx="1.8" fill="#d0d0d0" transform="rotate(22,7.75,49.5)"/>
      <rect x="4" y="41" width="7.5" height="3.5" rx="1" fill="#5a3010" transform="rotate(22,7.75,49.5)"/>
      <rect x="47" y="40" width="3.5" height="15" rx="1.8" fill="#d0d0d0" transform="rotate(-16,48.75,47.5)"/>
      <rect x="45" y="39" width="7.5" height="3.5" rx="1" fill="#5a3010" transform="rotate(-16,48.75,47.5)"/>
      <rect x="8" y="38" width="7.5" height="13" rx="3.5" fill="#d4a574" transform="rotate(26,11.75,44.5)"/>
      <rect x="42" y="38" width="7.5" height="13" rx="3.5" fill="#d4a574" transform="rotate(-18,45.75,44.5)"/>
      <circle cx="30" cy="21" r="10" fill="#d4a574"/>
      <path d="M19 24 Q30 5.5 41 24 Q30 18 19 24Z" fill="#2d8b7a" opacity=".88"/>
      <path d="M21 22 Q30 13 39 22 Q30 18.5 21 22Z" fill="rgba(0,0,0,.32)"/>
    </svg>`;
    default:return`<svg viewBox="0 0 60 90" xmlns="http://www.w3.org/2000/svg" class="bm-sprite" style="overflow:visible;display:block">
      ${sh}<rect x="22" y="60" width="9" height="24" rx="3" fill="#888"/><rect x="33" y="60" width="9" height="24" rx="3" fill="#888"/>
      <rect x="18" y="36" width="25" height="25" rx="5" fill="#666"/><circle cx="30" cy="22" r="10" fill="#d4a574"/>
    </svg>`;
  }
}

/* ============================================================================
   PIXEL ART PAPER DOLL ENGINE (RPG Maker VX Ace $-sprite, 32×32 per frame)
   ============================================================================ */

// Zet op true zodra de sprite-bestanden in assets/sprites/ aanwezig zijn.
// Zolang false: automatische fallback naar de ingebouwde SVG-sprites.
const BM_PIXEL_ART = true;

// Sleutel = avatar-id (uit BM_AVATAR_PARTS), waarde = pad naar spritesheet.
// Character sprites: 576×384px (RPG Maker MV 8-char sheet, frame = 48×48).
// Wapen sprites:     288×64px  (3 aanvals-frames, elk 96×64).
const PIXEL_ASSETS = {
  // Zes huidtinten, alle zes gegenereerd uit base_light.png door de zes
  // huidkleuren van het palet om te wisselen — zie tools/gen_sprites.js.
  // "licht" en "donker" zijn pixelgelijk aan de vroegere base_light.png /
  // base_dark.png, dus bestaande avatars veranderen niet van uiterlijk.
  bases:  { "zeerlicht":"assets/sprites/base_zeerlicht.png",
            "licht":    "assets/sprites/base_licht.png",
            "getint":   "assets/sprites/base_getint.png",
            "olijf":    "assets/sprites/base_olijf.png",
            "brons":    "assets/sprites/base_brons.png",
            "donker":   "assets/sprites/base_donker.png" },
  // Alleen de irispixels (twee paletkleuren), dus onafhankelijk van de huidtint.
  ogen:   { "blauw":      "assets/sprites/ogen_blauw.png",
            "bruin":      "assets/sprites/ogen_bruin.png",
            "donkerbruin":"assets/sprites/ogen_donkerbruin.png",
            "groen":      "assets/sprites/ogen_groen.png",
            "grijs":      "assets/sprites/ogen_grijs.png",
            "amber":      "assets/sprites/ogen_amber.png" },
  // Het enige echte verschil tussen de vroegere man- en vrouw-sprites.
  borstband:{ "geen":"",
            "aan":"assets/sprites/borstband.png" },
  armor:  { "vodden":"assets/sprites/armor_vodden.png",
            "robe":"assets/sprites/armor_robe.png",
            "licht":"assets/sprites/armor_licht.png",
            "middel":"assets/sprites/armor_middel.png",
            "zwaar":"assets/sprites/armor_zwaar.png",
            "hopliet":"assets/sprites/armor_hopliet.png",
            // Kampioen hergebruikt de "zwaar"-sprite met een gouden tint
            // (BM_ARMOR_TINT_FILTER) — geen apart bestand nodig, zelfde aanpak
            // als BM_CAPEKLEUR_FILTER/BM_HAARKLEUR_FILTER hieronder.
            "kampioen":"assets/sprites/armor_zwaar.png",
            "ceremonieel":"assets/sprites/armor_ceremonieel.png" },
  helm:   { "geen":"",
            "bandana":"assets/sprites/helm_bandana.png",
            "standard":"assets/sprites/helm_standaard.png",
            "open":"assets/sprites/helm_open.png",
            "hopliet":"assets/sprites/helm_hopliet.png",
            "kroon":"assets/sprites/helm_kroon.png" },
  haar:   { "kort":"assets/sprites/haar_kort.png",
            "lang":"assets/sprites/haar_lang.png",
            "kaal":"assets/sprites/haar_kaal.png",
            "wild":"assets/sprites/haar_wild.png",
            "vlecht":"assets/sprites/haar_vlecht.png",
            "middel":"assets/sprites/haar_middel.png",
            "knot":"assets/sprites/haar_knot.png",
            "hanekam":"assets/sprites/haar_hanekam.png" },
  baard:  { "geen":"assets/sprites/baard_geen.png",
            "baard":"assets/sprites/baard_baard.png",
            "snor":"assets/sprites/baard_snor.png",
            "sikensnor":"assets/sprites/baard_sik%20en%20snor.png" },
  // Coin-only categorieën (576×384 SV-battler sheets, net als de rest).
  extra:  { "geen":"",
            "blush":"assets/sprites/extra_blush.png",
            "clown":"assets/sprites/extra_clown.png",
            "darkeyes":"assets/sprites/extra_dark%20eyes.png",
            "litteken":"assets/sprites/extra_litteken.png",
            "ooglapje":"assets/sprites/extra_ooglapje.png",
            "oorbel":"assets/sprites/extra_oorbel.png",
            "warstripes":"assets/sprites/extra_warstripes.png" },
  legendary:{ "geen":"",
            "achilles":"assets/sprites/legendary_Achilles.png",
            "aeneas":"assets/sprites/legendary_Aeneas.png",
            "ajax":"assets/sprites/legendary_Ajax%20de%20Grote.png",
            "odysseus":"assets/sprites/legendary_Odysseus.png" },
  schild: { "geen":"",
            "rond":"assets/sprites/schild_rond.png",
            "ovaal":"assets/sprites/schild_ovaal.png",
            "vierkant":"assets/sprites/schild_vierkant.png",
            "tower":"assets/sprites/schild_tower.png" },
  wapen:  { "knuppel":"assets/sprites/wapen_knuppel.png",
            "hooivork":"assets/sprites/wapen_hooivork.png",
            "zwaard":"assets/sprites/wapen_zwaard.png",
            "speer":"assets/sprites/wapen_speer.png",
            "boog":"assets/sprites/wapen_boog.png",
            "staf":"assets/sprites/wapen_staf.png" },
  cape:   { "geen":"assets/sprites/cape_geen.png",
            "kort":"assets/sprites/cape_kort.png",
            "lang":"assets/sprites/cape_lang.png",
            "engelenvleugels":"assets/sprites/cape_engelenvleugels.png",
            "duivelsvleugels":"assets/sprites/cape_duivelsvleugels.png",
            "vlindervleugels":"assets/sprites/cape_vlindervleugels.png" },
};

// Rendert een gelaagde pixel art held (RPG Maker MV paper doll).
// Laagvolgorde: base → cape → armor → schild → wapen → haar → baard → helm.
// (ogen en borstband liggen direct op de base, dus onder haar en wapenrusting.)
// Valt terug op bmSpriteSVG() als BM_PIXEL_ART=false of base-asset ontbreekt.
// De huidtint ís de sleutel naar de base-sprite. (Tot 2026-08-28 werd hier ook
// het geslacht in verwerkt — dat koos een aparte "_female"-sprite; die bleek
// alleen in de borstband te verschillen en is nu een eigen laag.)
function _bmBaseKey(cosm){
  const h = cosm.huid || "licht";
  return PIXEL_ASSETS.bases[h] ? h : "licht";
}

// Versie-achtervoegsel voor sprite-bestanden → forceert verse download na een
// asset-wijziging (bump dit getal als je een PNG vervangt).
const SPRITE_VER = "v=8";

// CSS-filters per haarkleur (sprites zijn standaard blond in RPG Maker MV).
const BM_HAARKLEUR_FILTER = {
  "blond":  "none",
  "bruin":  "hue-rotate(-30deg) brightness(0.6) saturate(0.8)",
  "zwart":  "brightness(0.2) saturate(0.2)",
  // De haarsprites zijn blond (luma 94-239); grijs is dus simpelweg alle
  // kleur eruit, wit hetzelfde maar lichter opgetrokken.
  "grijs":  "grayscale(1) brightness(0.8)",
  "wit":    "grayscale(1) brightness(1.15)",
  "rood":   "hue-rotate(-20deg) saturate(1.5)",
  "blauw":  "hue-rotate(140deg) brightness(0.9)",
  "groen":  "hue-rotate(60deg) brightness(0.9)",
};

// CSS-filters per capekleur (cape_kort.png is goud/geel als basis).
const BM_CAPEKLEUR_FILTER = {
  "goud":   "none",
  "rood":   "hue-rotate(-55deg) brightness(0.75) saturate(1.4)",
  "blauw":  "hue-rotate(165deg) brightness(0.75) saturate(1.3)",
  "groen":  "hue-rotate(65deg) brightness(0.65) saturate(1.1)",
  "paars":  "hue-rotate(215deg) brightness(0.65) saturate(1.3)",
  "oranje": "hue-rotate(-25deg) brightness(0.85) saturate(1.5)",
};
// Vleugel-capes (zeer hoge status, requires:{prestige:1} — zie
// BM_AVATAR_PARTS.cape in battle-data.js) negeren capekleur bewust: het zijn
// eigen illustraties (veren/vlindervleugels), geen gekleurd stofmotief zoals
// cape_kort/cape_lang, dus een hue-rotate-filter zou ze alleen maar ontkleuren.
const BM_CAPE_NO_TINT = new Set(["engelenvleugels","duivelsvleugels","vlindervleugels"]);
// Weergavekleur (swatch) per capekleur, afgestemd op de team-banierkleuren.
const BM_CAPEKLEUR_SWATCH = {
  "goud":"#d4af37","rood":"#b03a2e","blauw":"#2e6fb0",
  "groen":"#3a7a30","paars":"#6b2d8b","oranje":"#c87533",
};
// Weergavekleur (swatch) per haarkleur — zelfde kleurenkiezer-stijl als de cape.
const BM_HAARKLEUR_SWATCH = {
  "blond":"#e3c56b","bruin":"#7a4a24","zwart":"#2a2a2a","grijs":"#9a9a95","wit":"#e8e6df",
  "rood":"#a5442a","blauw":"#3a6ea5","groen":"#3a7d3a",
};
// Weergavekleur (swatch) per oogkleur — het hooglicht van de iris uit
// PIXEL_ASSETS.ogen, zodat de bolletjes in de editor de sprite volgen.
const BM_OOGKLEUR_SWATCH = {
  "blauw":"#68b8ff","bruin":"#9c6636","donkerbruin":"#684226",
  "groen":"#6ab460","grijs":"#aab6bc","amber":"#de9e3a",
};
// Eén CSS-filter voor ALLE "prestige"-onderdelen (BM_AVATAR_PARTS.prestige,
// battle-data.js) — ongeacht welke categorie ontgrendeld werd, is het effect
// dezelfde gouden glans over de HELE sprite (dus over cape/haarkleur-filters
// heen, die zelf onveranderd blijven — een CSS-filter op de buitenste div
// werkt op het al-samengestelde resultaat van de laag-filters eronder).
const BM_PRESTIGE_FILTER = "sepia(0.85) saturate(4.5) hue-rotate(-8deg) brightness(1.08)";
// Gouden tint voor het Kampioensharnas (hergebruikt armor_zwaar.png — zie
// PIXEL_ASSETS.armor.kampioen), zodat de 5★-mastery-eis een eigen, herkenbaar
// uiterlijk krijgt zonder een nieuwe sprite te tekenen.
const BM_ARMOR_TINT_FILTER = { "kampioen": "sepia(0.7) saturate(3) hue-rotate(-12deg) brightness(1.05)" };

// Bouwt de gelaagde sprite-lagen als HTML-string.
// Z-index van achter naar voren (RPG Maker MV SV correct):
//   cape → wapen → base → ogen → borstband → haar → pantser → baard → schild → helm.
// Het wapen valt áchter het lichaam (achterste hand), vóór de cape; de baard
// valt vóór het pantser (anders bedekt de kraag hem); het schild valt vóór het
// pantser; de helm is de bovenste laag.
// extraClass op de buitenste div (bv. "pixel-preview" voor statische weergave).
function _bmPixelLayers(cosm, dirCls, extraClass="") {
  // Prestige-glans (BM_AVATAR_PARTS.prestige): één filter over de HELE
  // sprite, ongeacht welke categorie 'm ontgrendelde — zie BM_PRESTIGE_FILTER.
  const prestigeOn = !!(cosm.prestige && cosm.prestige!=="geen");
  const wrapStyle = prestigeOn ? ` style="filter:${BM_PRESTIGE_FILTER}"` : "";
  // Legendarische held: vervangt de paper doll (één MV SV-Actor-grid-sheet,
  // 9x6, vandaar ook "mv-motion-layer") — behalve wapen en schild: die
  // blijven de eigen keuze van de speler en worden er gewoon overheen
  // gelegd, net als bij een normale avatar (wapen erachter, schild ervoor).
  // "L" is hieronder als function-declaration gedefinieerd en dus al
  // beschikbaar (hoisting) vóór deze regel.
  const legId = cosm.legendary && cosm.legendary!=="geen" ? cosm.legendary : null;
  if (legId && PIXEL_ASSETS.legendary[legId]) {
    const lurl = PIXEL_ASSETS.legendary[legId] + "?"+SPRITE_VER;
    return `<div class="pixel-hero ${dirCls}${extraClass?" "+extraClass:""}"${wrapStyle}>
      ${L(PIXEL_ASSETS.wapen[cosm.wapen||"zwaard"]," sprite-weapon wpn-"+(cosm.wapen||"zwaard"),"",false)}
      <div class="sprite-layer mv-motion-layer" style="background-image:url('${lurl}')"></div>
      ${L(PIXEL_ASSETS.schild[cosm.schild||"rond"])}
    </div>`;
  }
  const baseSrc = PIXEL_ASSETS.bases[_bmBaseKey(cosm)];
  if (!baseSrc) return null;
  // mvGrid=true (default): laag volgt het MV-motion-grid (rij/kolom via
  // BattleMotion). Alleen het wapen (ander sheet-formaat, eigen animatie)
  // krijgt mvGrid=false en blijft buiten de motion state machine.
  function L(src, cls="", style="", mvGrid=true) {
    if (!src) return "";
    const url = src + (src.indexOf("?")<0 ? "?"+SPRITE_VER : "");
    const st = `background-image:url('${url}')${style?";"+style:""}`;
    const gridCls = mvGrid ? " mv-motion-layer" : "";
    return `<div class="sprite-layer${gridCls}${cls}" style="${st}"></div>`;
  }
  const haarFilter = BM_HAARKLEUR_FILTER[cosm.haarkleur||"blond"] || "none";
  const haarStyle = haarFilter !== "none" ? `filter:${haarFilter}` : "";
  const capeFilter = BM_CAPE_NO_TINT.has(cosm.cape) ? "none" : (BM_CAPEKLEUR_FILTER[cosm.capekleur||"goud"] || "none");
  const capeStyle = capeFilter !== "none" ? `filter:${capeFilter}` : "";
  const A = PIXEL_ASSETS;
  // Gezichtshaar: 'baardsnor' stapelt baard + snor; anders één laag.
  const baardId = cosm.baard||"geen";
  const baardLayers = baardId==="baardsnor"
    ? L(A.baard.baard,"",haarStyle)+L(A.baard.snor,"",haarStyle)
    : L(A.baard[baardId],"",haarStyle);
  return `<div class="pixel-hero ${dirCls}${extraClass?" "+extraClass:""}"${wrapStyle}>
    ${L(A.wapen[cosm.wapen||"zwaard"]," sprite-weapon wpn-"+(cosm.wapen||"zwaard"),"",false)}
    ${L(A.cape[cosm.cape||"geen"],"",capeStyle)}
    ${L(baseSrc)}
    ${L(A.ogen[cosm.oogkleur||"blauw"])}
    ${L(A.borstband[cosm.borstband||"geen"])}
    ${L(A.haar[cosm.haar||"kort"],"",haarStyle)}
    ${L(A.armor[cosm.armor||"licht"],"", BM_ARMOR_TINT_FILTER[cosm.armor] ? `filter:${BM_ARMOR_TINT_FILTER[cosm.armor]}` : "")}
    ${baardLayers}
    ${L(A.extra[cosm.extra||"geen"])}
    ${L(A.schild[cosm.schild||"rond"])}
    ${L(A.helm[cosm.helm||"standard"]," sprite-helm hlm-"+(cosm.helm||"standard"))}
  </div>`;
}

// Geanimeerde sprite voor het slagveld.
function renderPixelHero(pid, p, team) {
  if (!BM_PIXEL_ART) return bmSpriteSVG(p.class);
  const cosm = p.avatar ? bmAvatarMerge(p.avatar) : bmAvatarDefaults();
  return _bmPixelLayers(cosm, team === "B" ? "dir-left" : "dir-right") || bmSpriteSVG(p.class);
}

// Statische vooraanzicht-sprite voor profiel en avatar-editor.
// Toont het eerste frame, geen animatie. showWeapon=true toont ook het wapen
// (in de avatar-editor, zodat je je held mét wapen ziet).
function renderPixelHeroPreview(av, showWeapon) {
  if (!BM_PIXEL_ART) return "";
  const cosm = bmAvatarMerge(av);
  const cls = "pixel-preview" + (showWeapon ? " pp-weapon" : "");
  return _bmPixelLayers(cosm, "dir-right", cls) || "";
}

// Kleine, vaste-pixelgrootte weergave van de pixel-hero — vervangt
// bmAvatarSVG(av,size) op alle plekken waar tot nu toe nog de oude
// paper-doll-SVG stond (spelerslijst, scoreboard, lobby-kop e.d.).
// .pixel-hero is normaal 96px (144px vanaf 900px breed, zie index.html) —
// .pixel-hero-mini dwingt de 96px-basis af zodat de hier berekende
// schaalfactor overal klopt, en schaalt 'm daarna naar de gevraagde grootte.
function renderPixelHeroIcon(av, sizePx) {
  const inner = renderPixelHeroPreview(av);
  if (!inner) return "";
  const scale = (sizePx/96).toFixed(4);
  return `<span class="pixel-hero-mini" style="width:${sizePx}px;height:${sizePx}px"><span style="transform:scale(${scale})">${inner}</span></span>`;
}

// Klasse → formatiepositie (voor/midden/achter). Cavalerie staat bewust in het
// midden en niet achteraan: ruiters vechten van dichtbij, dus ze horen vóór de
// boogschutters en verkenners te staan.
const BM_FORM_POS={
  front:["hopliet","spartaan","centurio"],
  mid:["priester","genie","cavalerie"],
  back:["boogschutter","verkenner"]
};
function bmFormPos(clsId){
  for(const[p,ids]of Object.entries(BM_FORM_POS))if(ids.includes(clsId))return p;
  return "mid";
}

// Ability-type → animatie-categorie (geschreven in log voor clients)
function bmAblAnim(ablType){
  if(!ablType)return"none";
  const ATK=["attack","attack_bypass","attack_weakspot","attack_and_shld_remove",
              "attack_siege","attack_and_defend","heal_and_attack"];
  if(ATK.includes(ablType))return"attack";
  if(ablType==="heal")return"heal";
  if(ablType==="team_shield"||ablType==="testudo")return"shield";
  if(ablType==="team_be")return"teambe";
  if(ablType==="shield_remove")return"shldremove";
  return"none";
}

// Avatar DOM-id (veilig voor Firebase push-ids)
function bmAvId(pid){return"bmAv-"+pid.replace(/\W/g,"_");}

// Verwijder een animatie-klasse na aflopen
function bmAnimTmp(el,cls,ms){
  if(!el)return;
  el.classList.add(cls);
  setTimeout(()=>el.classList.remove(cls),ms||700);
}
// Koppelt bestaande CSS-animatieklassen (translateX-lunge/flits/pulse-VFX,
// ongewijzigd) aan een MV-motion (echte rij/frame-wissel op de spritesheet
// via BattleMotion — zie battle-motion.js). anim-ok/anim-bad zijn puur
// antwoord-feedback, geen slagveld-actie, en krijgen dus geen motion.
function bmMotionForAnimClass(cls,p){
  if(cls==="anim-hit")    return "damage";
  if(cls==="anim-heal")   return "spell";
  if(cls==="anim-shield") return "guard";
  if(cls==="anim-combo")  return "skill";
  if(cls==="anim-win")    return "victory";
  if(cls==="anim-lose")   return "dead";
  if(cls==="anim-atk-r"||cls==="anim-atk-l"){
    const wapen=(p&&p.avatar?bmAvatarMerge(p.avatar):bmAvatarDefaults()).wapen;
    if(wapen==="boog")  return "missile";
    if(wapen==="staf")  return "spell";
    if(wapen==="speer") return "thrust";
    return "swing"; // zwaard/knuppel/hooivork
  }
  if(cls==="anim-chg-r"||cls==="anim-chg-l") return "thrust"; // cavalerie-charge
  return null;
}
function bmAnimAv(pid,cls,ms){
  bmAnimTmp(el(bmAvId(pid)),cls,ms);
  if(typeof BattleMotion!=="undefined"){
    const motion=bmMotionForAnimClass(cls,BM_PLAYERS[pid]);
    if(motion){
      const heroEl=el(bmAvId(pid))?.querySelector(".pixel-hero");
      if(heroEl) BattleMotion.play(heroEl,motion);
    }
  }
}
function bmAnimTeam(team,cls,ms){
  if(BM_META?.animations===false)return;
  Object.entries(BM_PLAYERS).filter(([,p])=>p.team===team)
    .forEach(([pid])=>bmAnimAv(pid,cls,ms));
}

// Drijvend tekstgetal (dmg/heal) boven het slagveld-midden
function bmFloat(text,color,offsetPct){
  if(BM_META?.animations===false)return;
  const cont=el("bmBfx");if(!cont)return;
  const d=document.createElement("div");
  d.className="bm-float";
  d.style.cssText=`color:${color};bottom:${30+(offsetPct||0)*20}%`;
  d.textContent=text;
  cont.appendChild(d);
  setTimeout(()=>d.remove(),1400);
}

// Vliegend projectiel of boogvlucht
function bmProj(emoji,teamFrom,arc,row){
  if(BM_META?.animations===false)return;
  const cont=el("bmBfx");if(!cont)return;
  const isR=teamFrom==="A";
  const d=document.createElement("div");
  d.className="bm-proj"+(arc?" arc":"")+" "+(isR?"r":"l");
  d.style.setProperty("--row",row||0);
  d.textContent=emoji;
  cont.appendChild(d);
  setTimeout(()=>d.remove(),900);
}

// Gloed-ring op positie (linker- of rechterkant van slagveld)
function bmGlowFx(team,col){
  if(BM_META?.animations===false)return;
  const cont=el("bmBfx");if(!cont)return;
  const d=document.createElement("div");
  d.className="bm-glow";
  d.style.cssText=`width:70px;height:70px;background:radial-gradient(circle,${col||"rgba(212,175,55,.65)"},transparent 70%);`+
    (team==="A"?"left:8%;top:15%":"right:8%;top:15%");
  cont.appendChild(d);
  setTimeout(()=>d.remove(),950);
}

// Kleine HP-balk onder een held-sprite (alleen in heldenmodus)
function bmHeroHpHTML(p){
  if(!BM_META?.heroMode||!p.maxHp)return"";
  const pct=Math.max(0,Math.min(1,(p.hp||0)/p.maxHp));
  const dead=p.isAlive===false||pct<=0;
  const col=dead?"#777":pct<0.3?"#c0392b":"#3f9d52";
  if(dead){
    const need=Math.max(1,BM_META.respawnRequired||5);
    const meter=Math.min(need,p.respawnMeter||0);
    return `<div class="bm-hero-hp" title="Gevallen — herrijst bij ${need} goede antwoorden">
      <div class="bm-hero-hp-fill" style="transform:scaleX(${meter/need});background:var(--hi)"></div>
    </div><div class="bm-hero-respawn">↻ ${meter}/${need}</div>`;
  }
  return `<div class="bm-hero-hp" title="Held: ${p.hp||0}/${p.maxHp} HP">
      <div class="bm-hero-hp-fill" style="transform:scaleX(${pct});background:${col}"></div>
    </div>${p.armor?`<div class="bm-hero-armor">🛡 ${p.armor}</div>`:""}`;
}
/* ── Opstelling op het slagveld (raster, RPG Maker MV-stijl) ──────────────
   Elke formatiegroep (achter/midden/voor) staat als blok op het veld. Binnen
   een blok worden de leden verdeeld over lanen (breedte) × rijen (diepte):
   elke rij naar voren staat een stukje lager, iets dichter bij de vijand en
   iets groter. Zo staat een groep achter elkáár op de grond in plaats van
   recht boven elkaar te zweven — vergelijk MV's
   Sprite_Actor.setActorHome(600 + index*32, 280 + index*48).
   16 spelers per team passen zo in 4×4; Boss Battle zet de hele klas (tot 32)
   op één helft en gaat daarom 5 rijen diep. */
const BM_GRID_ROWS=4;        // max rijen diepte per formatiegroep
const BM_GRID_ROWS_BOSS=5;   // Boss Battle: tot 32 spelers op één helft

// Verdeelt n leden rijsgewijs over lanen × rijen: eerst de voorste rij vullen,
// dan de rij daarachter, enzovoort. row 0 = de VOORSTE rij (op de grond, het
// dichtst bij de vijand), row rows-1 = de achterste. Rijsgewijs vullen is nodig
// voor de rangorde hieronder: zo staan de eerste négen namen uit de sortering
// ook echt vooraan in beeld, in plaats van verspreid over de lanen.
function bmGridSlots(n,rowsMax){
  const max=Math.max(1,rowsMax||BM_GRID_ROWS);
  const lanes=Math.max(1,Math.ceil(n/max));
  const rows=Math.max(1,Math.ceil(n/lanes));
  const out=[];
  for(let i=0;i<n;i++)out.push({lane:i%lanes,row:Math.floor(i/lanes),rows,lanes});
  return out;
}

/* Rangorde binnen een formatieblok: wie het meest bijdraagt, staat vooraan.
   Eerst het aantal goede antwoorden — dat is waar het spel over gaat, en het is
   klasse-neutraal (een Priester kan net zo goed vooraan komen als een
   Voorvechter). Bij gelijke stand telt de spelbijdrage: schade + heling +
   schild. Wil je liever puur op spelbijdrage sorteren, dan is dit de enige plek
   die je hoeft te wijzigen.
   De sortering is stabiel, dus bij het begin van een gevecht (iedereen op nul)
   blijft gewoon de volgorde van binnenkomst staan. De opstelling wordt per
   ronde opnieuw opgebouwd, dus de rangorde schuift tussen rondes mee — niet
   midden in een ronde. */
function bmContribCompare(a,b){
  const c=(b.correct||0)-(a.correct||0);
  if(c) return c;
  return ((b.damage||0)+(b.healing||0)+(b.shielding||0))
       - ((a.damage||0)+(a.healing||0)+(a.shielding||0));
}

// Eén poppetje op een rasterplek. --gl = laan-index (breedte), --d = diepte
// vanaf de voorste rij (0 = vooraan); de CSS in index.html vertaalt dat naar
// links/rechts, hoogte, schaal en z-volgorde.
function bmSlotAvHTML(pid,p,round,gl,d){
  const hasAnswered=p.answeredRound===round.n;
  const hasLocked=!!p.lockedAction;
  const dotCls=hasAnswered?"on":hasLocked?"locked":"";
  const dead=BM_META?.heroMode&&p.isAlive===false;
  // Idle-animaties uit elkaar trekken zodat een groep niet synchroon deint
  const idle=((gl*0.23+d*0.37)%2.4).toFixed(2);
  return `<div class="bm-av cls-${p.class||""}${dead?" bm-hero-dead":""}" id="${bmAvId(pid)}"
      style="--gl:${gl.toFixed(2)};--d:${d};--bm-idle:${idle}s;z-index:${100-d*5}"
      title="${esc(p.name)} · ${esc(bmClsNmThemed(p.class||""))}">
      ${renderPixelHero(pid, p, p.team)}
      <div class="bm-dot ${dotCls}"></div>
      <div class="avn">${esc(p.name)}</div>
      <div class="avncls">${esc(bmClsNmThemed(p.class||""))}</div>
      ${bmHeroHpHTML(p)}
    </div>`;
}

function bmFormationHTML(team){
  const round=BM_STATE.round||{};
  // Rangorde één keer per ronde vastzetten. Tijdens de vraagfase verandert
  // p.correct bij elk antwoord; zonder deze bevriezing zouden de poppetjes
  // midden in het antwoorden van plaats wisselen.
  const rn=round.n||0;
  if(_bmRankRound!==rn){
    _bmRankRound=rn; _bmRankMap={};
    Object.entries(BM_PLAYERS).sort((x,y)=>bmContribCompare(x[1],y[1]))
      .forEach(([pid],i)=>{_bmRankMap[pid]=i;});
  }
  const cols={front:[],mid:[],back:[]};
  for(const[pid,p]of Object.entries(BM_PLAYERS))
    if(p.team===team)cols[bmFormPos(p.class)].push([pid,p]);
  // Diepte: normaal 4 rijen (16 spelers = 4×4). Zit er meer volk op één helft
  // — Boss Battle (hele klas, tot 32) of een uitzonderlijk grote klas met meer
  // dan 16 in één team — dan gaan we een rij dieper, zodat het aantal lanen
  // (en dus de breedte) niet uit de hand loopt.
  const total=cols.back.length+cols.mid.length+cols.front.length;
  const rowsMax=(BM_META?.mode==="boss"||total>16)?BM_GRID_ROWS_BOSS:BM_GRID_ROWS;
  // Blokken van achter naar voren. Lanen worden gemeten vanaf de eigen
  // buitenrand van het veld, dus voor béide teams in dezelfde volgorde: het
  // spiegelen zit in de CSS (team A left:, team B right:).
  const out=[];
  let lane0=0,dmax=0;
  for(const k of ["back","mid","front"]){
    const grp=cols[k];
    if(!grp.length)continue;
    grp.sort((x,y)=>(_bmRankMap[x[0]]??1e9)-(_bmRankMap[y[0]]??1e9)); // meeste bijdrage vooraan
    const slots=bmGridSlots(grp.length,rowsMax);
    dmax=Math.max(dmax,slots[0].rows-1);
    grp.forEach(([pid,p],i)=>{
      const s=slots[i];
      out.push(bmSlotAvHTML(pid,p,round,lane0+s.lane,s.row));
    });
    lane0+=slots[0].lanes+0.4;   // luchtje tussen twee blokken
  }
  if(!out.length)return "";
  // Laanafstand: normaal de vaste --bm-lanegap, maar bij veel lanen knijpen we
  // ze samen zodat de hele opstelling op de eigen veldhelft blijft staan. De
  // beschikbare ruimte is de halve veldbreedte min de breedte van één poppetje,
  // de schuine rij-verspringing en de randmarge; 96% laat een gootje vrij in
  // het midden zodat de twee legers elkaar niet overlappen.
  // De ondergrens (--bm-mingap) voorkomt dat de lanen bij extreem veel spelers
  // op een smal scherm op nul of negatief uitkomen; ze schuiven dan gewoon
  // verder over elkaar heen in plaats van de veldhelft uit te lopen.
  const spread=lane0-0.4-1;                      // aantal laan-stappen
  const gap=spread>0
    ? `max(var(--bm-mingap),min(var(--bm-lanegap),calc((96% - var(--bm-uw) - ${dmax} * var(--bm-rowshift) - 2 * var(--bm-pad)) / ${spread.toFixed(2)})))`
    : "var(--bm-lanegap)";
  // Vijf rijen diep worden anders te hoog voor het veld: dan wat dichter op
  // elkaar. Staat hier en niet in de CSS, want het hangt van de opstelling af,
  // niet van de spelmodus.
  const rg=dmax>3?"calc(var(--bm-rowgap) * .78)":"var(--bm-rowgap)";
  return `<div class="bm-gridform" style="--gap:${gap};--rg:${rg};--dmax:${dmax}">${out.join("")}</div>`;
}
// (Her)bouw het volledige slagveld (aangeroepen na speler-update of ronde-start)
/* Solo-slagveld voor het spelerscherm: alleen je eigen held. De hele opstelling
   staat al op het bord in de klas; op een telefoon is die niet te lezen en kost
   hij het meeste rekenwerk van alles — bij 35 spelers zijn dat 35 poppetjes van
   acht spritelagen, die bij elk antwoord van elke klasgenoot opnieuw getekend
   werden. Je eigen held blijft wél bewegen: bmAnimAv() zoekt de sprite op id, dus
   aanvallen, treffers en helingen spelen gewoon op jouw poppetje af. */
function bmSoloFieldHTML(){
  const p=BM_PLAYERS[BM_PID];
  if(!p)return"";
  const round=BM_STATE.round||{};
  const dotCls=p.answeredRound===round.n?"on":(p.lockedAction?"locked":"");
  const dead=BM_META?.heroMode&&p.isAlive===false;
  return `<div class="bm-av bm-solo cls-${p.class||""}${p.team==="B"?" bm-mirror":""}${dead?" bm-hero-dead":""}"
      id="${bmAvId(BM_PID)}" title="${esc(p.name)}">
      ${renderPixelHero(BM_PID, p, p.team)}
      <div class="bm-dot ${dotCls}"></div>
      <div class="avn">${esc(p.name)}</div>
      <div class="avncls">${esc(bmClsNmThemed(p.class||""))}</div>
      ${bmHeroHpHTML(p)}
    </div>`;
}

function bmBuildBattlefield(){
  const fA=el("bmFormA"),fB=el("bmFormB");
  // Op het spelerscherm hangt de hash alleen aan de eigen speler, zodat een
  // antwoord van een klasgenoot dit toestel niets meer laat hertekenen.
  const hash=BM_FIELD_SOLO
    ? (()=>{const p=BM_PLAYERS[BM_PID]||{};
        return "solo:"+BM_PID+":"+p.class+":"+p.team+":"+(p.answeredRound||0)
          +":"+(p.lockedAction?"L":"")+":"+(p.hp??"")+":"+(p.armor||0)
          +":"+(p.isAlive===false?"D":"")+":"+(p.respawnMeter||0);})()
    : Object.entries(BM_PLAYERS).map(([id,p])=>
        id+":"+p.class+":"+p.team+":"+(p.answeredRound||0)+":"+(p.lockedAction?"L":"")
        +":"+(p.hp??"")+":"+(p.armor||0)+":"+(p.isAlive===false?"D":"")+":"+(p.respawnMeter||0)
      ).sort().join("|");
  if(hash!==_bmFormHash){
    _bmFormHash=hash;
    if(BM_FIELD_SOLO){
      if(fA)fA.innerHTML=bmSoloFieldHTML();
      if(fB)fB.innerHTML="";
    } else {
      if(fA)fA.innerHTML=bmFormationHTML("A");
      if(fB)fB.innerHTML=BM_META?.mode==="boss"?"":bmFormationHTML("B");
    }
    // Verse DOM-nodes na een rebuild: elke avatar begint in idle. Een motion
    // die vlak hierna via bmAnimAv wordt getriggerd (bv. binnen dezelfde
    // ronde-resolutie) overschrijft dit meteen weer — zelfde volgorde-
    // tolerantie als het bestaande class-gedreven systeem (bmAvId-lookup
    // gebeurt altijd opnieuw op het moment van triggeren).
    if(typeof BattleMotion!=="undefined"){
      document.querySelectorAll("#bmFormA .pixel-hero, #bmFormB .pixel-hero")
        .forEach(heroEl=>BattleMotion.ensureIdle(heroEl));
    }
  }
  // Boss Battle: team B heeft geen spelers — toon in plaats daarvan de
  // baas-placeholder (naam/fase/rage). Buiten de hash-gate: fase/rage
  // wijzigen immers los van de spelersformatie.
  if(fB&&BM_META?.mode==="boss")fB.innerHTML=bmBossSpriteHTML(BM_BOSS,bmTeamNm("B"));
  const field=el("bmField");
  if(field){
    // Landscape-thema
    ["bm-bg-roman","bm-bg-greek","bm-bg-gods"].forEach(cl=>field.classList.remove(cl));
    field.classList.add(bmBgTheme(BM_META?.theme));
    // Boss Battle: de hele klas staat op helft A — die helft krijgt in de CSS
    // meer breedte, want daar kunnen tot 32 poppetjes in het raster staan.
    field.classList.toggle("bm-boss",BM_META?.mode==="boss");
    if(BM_META?.animations===false)field.classList.add("bm-noanim");
    else field.classList.remove("bm-noanim");
    bmApplyArenaBg(field); // docent-gekozen battleback (overschrijft thema-bg)
  }
  // Kritieke health check (nieuwe klasse bm-hp-fill)
  const tA=BM_TEAMS.A||{health:0,maxHealth:100};
  const tB=BM_TEAMS.B||{health:0,maxHealth:100};
  const critA=tA.maxHealth&&tA.health/tA.maxHealth<0.25;
  const critB=tB.maxHealth&&tB.health/tB.maxHealth<0.25;
  document.querySelectorAll("#bmArmyA .bm-hp-fill").forEach(b=>critA?b.classList.add("bm-crit"):b.classList.remove("bm-crit"));
  document.querySelectorAll("#bmArmyB .bm-hp-fill").forEach(b=>critB?b.classList.add("bm-crit"):b.classList.remove("bm-crit"));
}

// Hoofddispatcher: trigger animaties vanuit één log-entry
function bmPlayAnimations(entry){
  if(!entry||BM_META?.animations===false)return;
  const{events=[],efA=0,efB=0,blockedA=0,blockedB=0,healA=0,healB=0,winner}=entry;

  // Drijvende totaalgetallen
  if(efA>0)setTimeout(()=>bmFloat("-"+efA,"#e05555",0),500);
  if(efB>0)setTimeout(()=>bmFloat("-"+efB,"#e05555",1),550);
  if(healA>0)setTimeout(()=>bmFloat("+"+healA,"var(--green-bright)",2),600);
  if(healB>0)setTimeout(()=>bmFloat("+"+healB,"var(--green-bright)",3),650);
  // Schild-blok kort tonen vlak vóór de (al bijgewerkte) HP-balk, dan weg laten krimpen
  if(blockedA>0)setTimeout(()=>bmShowShieldBlock("A",blockedA),480);
  if(blockedB>0)setTimeout(()=>bmShowShieldBlock("B",blockedB),530);

  // Per event met stagger
  let d=0;
  for(const ev of events){
    const delay=d;d+=130;
    setTimeout(()=>{
      if(ev.type==="combo"){
        const combo=BM_COMBOS.find(c=>c.id===ev.comboId)||{};
        bmAnimTeam(ev.team,"anim-combo",750);
        if(combo.dmg)bmProj("✨",ev.team,false,1);
        if(combo.shld)bmGlowFx(ev.team,"rgba(100,160,255,.6)");
        if(combo.heal)bmGlowFx(ev.team,"rgba(100,210,100,.6)");
        const enemy=ev.team==="A"?"B":"A";
        if(combo.dmg)setTimeout(()=>bmAnimTeam(enemy,"anim-hit",500),320);
        setTimeout(()=>CommanderSpectre.show(ev.team),200);
        return;
      }
      const{pid,team,cls,anim,dmg=0,heal=0}=ev;
      const isR=team==="A";
      if(anim==="attack"){
        const atkCls=cls==="cavalerie"?(isR?"anim-chg-r":"anim-chg-l"):(isR?"anim-atk-r":"anim-atk-l");
        bmAnimAv(pid,atkCls,750);
        // klasse-specifiek projectiel
        if(cls==="boogschutter")bmArrowProj(team,0);
        else if(cls==="genie")bmProj("🪨",team,true,0);
        else if(cls==="verkenner")bmProj("⚡",team,false,0);
        const enemy=team==="A"?"B":"A";
        setTimeout(()=>bmAnimTeam(enemy,"anim-hit",500),320);
      } else if(anim==="heal"){
        bmAnimAv(pid,"anim-heal",650);
        bmAnimTeam(team,"anim-heal",700);
        bmGlowFx(team,"rgba(100,210,100,.65)");
      } else if(anim==="shield"){
        bmAnimAv(pid,"anim-shield",750);
        bmAnimTeam(team,"anim-shield",700);
        bmGlowFx(team,"rgba(100,160,255,.55)");
      } else if(anim==="teambe"){
        bmGlowFx(team,"rgba(212,175,55,.6)");
      }
      // Commander Spectre bij ultimates en team-buffs
      if(CommanderSpectre.isUltimate(ev.abilityId)||anim==="teambe"){
        setTimeout(()=>CommanderSpectre.show(team),200);
      }
    },delay);
  }

  // Eind-animaties (overwinning / nederlaag)
  if(winner==="A"||winner==="B"){
    const loser=winner==="A"?"B":"A";
    setTimeout(()=>{bmAnimTeam(winner,"anim-win",1400);bmAnimTeam(loser,"anim-lose",1300);bmConfetti();},900);
  }
}

function bmShowCommanders(){
  CommanderSpectre.show("A");
  // De baas heeft geen commandant (geen tegenstander-team) — alleen team A telt.
  if(BM_META?.mode!=="boss")CommanderSpectre.show("B");
}

// Abonneer op log; trigger animaties bij nieuwe entry (beperkt tot laatste 1 om backfill te vermijden)
function bmSubscribeLog(code){
  if(!fbDB)return;
  const rLog=fbDB.ref("rooms/"+code+"/log").limitToLast(1);
  // Bepaal eerst de bestaande laatste ronde (backfill), abonneer daarná pas.
  // Zo slaan we alleen écht bestaande entries over — de éérste ronde van een
  // nieuw gevecht (lege log) wordt nu wél geanimeerd. Voorheen sloeg de
  // 'firstFire'-vlag bij een lege log onterecht de eerste aanval over.
  rLog.once("value").then(snap=>{
    let lastRound=-1;
    snap.forEach(ch=>{const r=ch.val()&&ch.val().round; if(typeof r==="number")lastRound=Math.max(lastRound,r);});
    const fLog=rLog.on("child_added",s=>{
      const entry=s.val();
      const r=entry&&typeof entry.round==="number"?entry.round:null;
      if(r!==null&&r<=lastRound)return;      // backfill / al verwerkt → overslaan
      if(r!==null)lastRound=r;
      if(el("bmFormA"))bmBuildBattlefield();   // formatie bijwerken
      setTimeout(()=>bmPlayAnimations(entry),250);
    });
    BM_UNSUBS.push(()=>rLog.off("child_added",fLog));
  });
}

/* ---- HOST TIMER ---- */
function bmHostStartTimer(){
  if(_bmTicking)return; _bmTicking=true;
  BM_PHASE_TIMER=setInterval(bmTick,500);
}
async function bmTick(){
  if(!BM_STATE.round||BM_STATE.status!=="playing"||BM_RESOLVING)return;
  if(Object.keys(BM_PLAYERS).length===0)return; // wacht tot spelers geladen zijn na herverbinding
  const{phase,deadline,n}=BM_STATE.round;
  if(Date.now()<deadline)return;
  clearInterval(BM_PHASE_TIMER);BM_PHASE_TIMER=null;_bmTicking=false;
  if(phase==="question"){
    await fbDB.ref("rooms/"+BM_CODE+"/state/round").update({phase:"action",deadline:Date.now()+10000});
    bmHostStartTimer();
  } else if(phase==="action"){
    await bmResolve(n);
  }
}

/* ---- RESOLUTIE (host-autoritair, data-gedreven) ---- */
// Vervangt elke undefined door null. Firebase weigert een schrijfactie met
// undefined erin ("contains undefined in property ..."), en zo'n weigering
// midden in bmResolve() liet vroeger de hele ronde stranden.
function bmGeenUndefined(v){
  if(v===undefined) return null;
  if(Array.isArray(v)) return v.map(bmGeenUndefined);
  if(v&&typeof v==="object"&&v.constructor===Object){
    const uit={};
    for(const[k,x]of Object.entries(v)) uit[k]=bmGeenUndefined(x);
    return uit;
  }
  return v;
}

async function bmResolve(roundN){
  BM_RESOLVING=true;
  try{
    const guardSnap=await fbDB.ref("rooms/"+BM_CODE+"/state/resolvedRound").once("value");
    if(guardSnap.val()===roundN)return;
    await fbDB.ref("rooms/"+BM_CODE+"/state/resolvedRound").set(roundN);

    const players=BM_PLAYERS;
    // Effecten komend VAN elk team (richting het andere)
    const from={A:{dmg:0,bypassDmg:0,shldRemove:0},B:{dmg:0,bypassDmg:0,shldRemove:0}};
    // Effecten TEN VOORDELE van elk team
    const for_={A:{heal:0,shld:0,teamBE:0},B:{heal:0,shld:0,teamBE:0}};
    const events=[];
    const pUpd={}; // pid → {be, damage, healing, lockedAction:null}

    // Pas 1: individuele abilities
    const isBossFight=BM_META?.mode==="boss";
    const chainContributors=new Set(); // Boss Battle: unieke spelers die schade toebrachten (baas of handlanger)
    // Minions (BOSS_BATTLE.md §4): lokale, muteerbare kopie van de handlangers
    // zoals ze vóór deze ronde bestonden — schade tijdens pas 1 wordt hierop
    // toegepast, de opgeschoonde stand wordt later teruggeschreven naar
    // rooms/{code}/boss (zie het boss-blok verderop in deze functie).
    const minions=(isBossFight?(BM_BOSS.minions||[]):[]).map(m=>({...m}));
    for(const[pid,p]of Object.entries(players)){
      const action=p.lockedAction;
      if(!action||action.type==="combo")continue;
      const cls=BM_CLASSES.find(c=>c.id===p.class);
      // Basisacties (BM_BASIC_ACTIONS) staan los van een klasse: een speler
      // zonder gekozen klasse heeft hier geen `cls`, en dan moet de actie nog
      // steeds gevonden worden.
      const abl=cls?.abilities.find(a=>a.id===action.abilityId)
             || BM_BASIC_ACTIONS.find(a=>a.id===action.abilityId);
      if(!abl)continue;
      const mt=p.team,et=mt==="A"?"B":"A";
      const fx=bmCalcAbilityEffect(p,cls,abl);
      // Inspiratie van Athena (Boss Battle, BOSS_BATTLE.md §5.3): verbruikt
      // bij de eerstvolgende ability-keuze, ongeacht schade, zodat de buff
      // nooit blijft hangen.
      const usedInspiration=isBossFight&&p.inspired;
      if(usedInspiration&&fx.dmg>0) fx.dmg+=BM_INSPIRE_BONUS_DMG;
      // Minion-doelwit (BOSS_BATTLE.md §4): een schade-ability kan op een
      // levende handlanger gericht worden i.p.v. de baas — dan gaat de volle
      // schade naar die handlanger. Blijven er handlangers over (ongeacht
      // doelwit), dan vangen zij de helft van de resterende baas-schade op.
      // AoE-abilities (Pijlregen/Vuurtoren, aoe:true) slaan doelwitkeuze en
      // halvering over: ze raken de baas ÓÓk elke levende handlanger, elk
      // voor het volle schadegetal.
      let minionDmg=0;
      // targetMinion staat bewust BÚITEN de if/else: hij wordt verderop in
      // events.push() gelezen. Stond hij binnen de else-tak (met const), dan
      // gooide een AoE-aanval op levende handlangers een ReferenceError — en
      // omdat dat middenin bmResolve() gebeurt, bleef de hele ronde hángen:
      // geen nieuwe vragen, timer stil. Dat kon pas gebeuren vanaf het moment
      // dat er handlangers waren, dus vanaf de overgang naar fase 2.
      let targetMinion=null;
      if(isBossFight&&mt==="A"&&fx.dmg>0&&fx.aoe){
        minions.filter(m=>m.hp>0).forEach(m=>{
          minionDmg+=Math.min(fx.dmg,m.hp);
          m.hp=Math.max(0,m.hp-fx.dmg);
        });
        // fx.dmg blijft staan — telt hieronder ook nog naar de baas
      } else {
        targetMinion=(isBossFight&&mt==="A"&&fx.dmg>0&&action.target&&action.target!=="boss")
          ? minions.find(m=>m.id===action.target&&m.hp>0) : null;
        if(targetMinion){
          minionDmg=Math.min(fx.dmg,targetMinion.hp);
          targetMinion.hp=Math.max(0,targetMinion.hp-fx.dmg);
          fx.dmg=0;
        } else if(isBossFight&&mt==="A"&&fx.dmg>0&&minions.some(m=>m.hp>0)){
          fx.dmg=Math.round(fx.dmg/2);
        }
      }
      if(fx.bypass)  from[mt].bypassDmg+=fx.dmg;
      else           from[mt].dmg+=fx.dmg;
      from[mt].shldRemove+=fx.shldRemove;
      for_[mt].shld+=fx.shld;
      for_[mt].heal+=fx.heal;
      for_[mt].teamBE+=fx.teamBE;
      if(isBossFight&&mt==="A"&&(fx.dmg>0||minionDmg>0)) chainContributors.add(pid);
      pUpd[pid]={be:bmClampBE((p.be||0)-(action.cost||0)+(fx.selfBE||0)),
                 damage:(p.damage||0)+fx.dmg, healing:(p.healing||0)+fx.heal,
                 // shielding telt mee in bmContribCompare(): zonder dit zou een
                 // Hopliet die het hele gevecht schildt altijd achteraan staan.
                 shielding:(p.shielding||0)+fx.shld, lockedAction:null,
                 ...(usedInspiration?{inspired:false}:{}),
                 ...(minionDmg>0?{minionDamage:(p.minionDamage||0)+minionDmg}:{})};
      events.push({pid,abilityId:abl.id,team:mt,dmg:fx.dmg,heal:fx.heal,shld:fx.shld,
                   // ||null : een speler zonder gekozen klasse heeft hier
                   // undefined (Firebase slaat class:null niet op, dus bij het
                   // teruglezen ontbreekt het veld), en Firebase weigert elke
                   // undefined in een push — dat liet de hele ronde stranden.
                   cls:p.class||null,anim:bmAblAnim(abl.type),
                   ...(minionDmg>0?{minionDmg,...(targetMinion?{target:targetMinion.id}:{})}:{})});
    }
    // Brede-deelname-bonus (Boss Battle, herinterpretatie van BOSS_BATTLE.md
    // §5.1 "Combo Chain" voor de ronde-gebaseerde architectuur): ≥3
    // verschillende spelers die deze ronde schade toebrachten geeft het team
    // een vlakke bonus, zodat één speler het gevecht niet alleen kan dragen.
    if(isBossFight){
      const tier=BM_CHAIN_BONUS.find(t=>chainContributors.size>=t.min);
      if(tier){
        from.A.dmg+=tier.bonus;
        events.push({type:"chain_bonus",n:chainContributors.size,bonus:tier.bonus});
        // "Combo Koning" (Boss-Battle-scorebord, BOSS_BATTLE.md §8):
        // herinterpretatie als "vaakst bijdrager aan een ronde die de
        // brede-deelname-bonus haalde" — alleen geteld als de bonus ook echt
        // toegepast werd.
        for(const pid of chainContributors){
          const prev=pUpd[pid]||{be:players[pid].be||0,damage:players[pid].damage||0,healing:players[pid].healing||0,shielding:players[pid].shielding||0,lockedAction:null};
          pUpd[pid]={...prev,chainCount:(players[pid].chainCount||0)+1};
        }
      }
    }

    // Pas 2: combo's — zoek overeenkomende paren binnen hetzelfde team
    const comboPids=Object.entries(players).filter(([,p])=>p.lockedAction?.type==="combo");
    for(const combo of BM_COMBOS){
      const[c0,c1]=combo.classes;
      const pa=comboPids.find(([,p])=>p.class===c0&&p.lockedAction?.comboId===combo.id);
      const pb=comboPids.find(([,p])=>p.class===c1&&p.lockedAction?.comboId===combo.id&&p.team===(pa?.[1]?.team));
      if(!pa||!pb)continue;
      const mt=pa[1].team;
      if(combo.dmg)   from[mt].dmg+=(combo.dmg||0);
      if(combo.shld)  for_[mt].shld+=(combo.shld||0);
      if(combo.heal)  for_[mt].heal+=(combo.heal||0);
      if(combo.teamBE)for_[mt].teamBE+=(combo.teamBE||0);
      if(combo.shldRemove)from[mt].shldRemove+=(combo.shldRemove||0);
      for(const[pid]of[pa,pb]){
        const p=players[pid];
        const prev=pUpd[pid]||{be:p.be||0,damage:p.damage||0,healing:p.healing||0,shielding:p.shielding||0};
        pUpd[pid]={...prev,be:bmClampBE(prev.be-(combo.cost||4)),lockedAction:null};
      }
      events.push({type:"combo",comboId:combo.id,team:mt,pids:[pa[0],pb[0]]});
    }

    // Pas 3: teamBE verdelen over alle teamgenoten. Begrensd op
    // BM_TEAMBE_ROUND_CAP: elke team_be-ability geeft BE aan élke teamgenoot,
    // dus zonder grens stapelen meerdere Centurio's in een grote klas tot een
    // onuitgeefbare berg BE (zie battle-data.js).
    for(const t of["A","B"]) for_[t].teamBE=Math.min(for_[t].teamBE,BM_TEAMBE_ROUND_CAP);
    for(const[pid,p]of Object.entries(players)){
      const bonus=for_[p.team]?.teamBE||0;
      if(!bonus)continue;
      const prev=pUpd[pid]||{be:p.be||0,damage:p.damage||0,healing:p.healing||0,shielding:p.shielding||0,lockedAction:null};
      pUpd[pid]={...prev,be:bmClampBE((prev.be)+bonus)};
    }

    // Schrijf spelerupdates
    for(const[pid,upd]of Object.entries(pUpd)){
      await fbDB.ref("rooms/"+BM_CODE+"/players/"+pid).update(upd);
    }

    // Berekening effectieve schade (schild absorbeert, bypass negeert schild)
    const shldA=Math.max(0,for_.A.shld-from.B.shldRemove);
    const shldB=Math.max(0,for_.B.shld-from.A.shldRemove);
    // Hoeveel van de aanval het schild écht heeft opgevangen (voor de witte
    // schild-animatie op de HP-balk — zie bmShowShieldBlock()). Bypass-schade
    // omzeilt het schild per definitie, dus telt hier niet mee.
    const blockedA=Math.min(shldA,from.B.dmg);
    const blockedB=Math.min(shldB,from.A.dmg);
    const efA=Math.max(0,from.B.dmg-shldA)+from.B.bypassDmg;
    const efB=Math.max(0,from.A.dmg-shldB)+from.A.bypassDmg;
    const tA=BM_TEAMS.A||{health:100,maxHealth:100},tB=BM_TEAMS.B||{health:100,maxHealth:100};
    // Heldenmodus: route schade eerst door de levende helden, overschot naar het leger
    let armyDmgA=efA, armyDmgB=efB;
    if(BM_META?.heroMode){
      const heroUpd={};
      armyDmgA=bmRouteHeroDamage("A",efA,players,heroUpd);
      armyDmgB=bmRouteHeroDamage("B",efB,players,heroUpd);
      for(const[pid,u]of Object.entries(heroUpd)){
        await fbDB.ref("rooms/"+BM_CODE+"/players/"+pid).update(u);
      }
    }
    // Minotaurus: het Labyrinth-schild is persistente baas-state (i.t.t.
    // speler-schild, dat maar één ronde geldt) en absorbeert schade aan de
    // baas VÓÓR newHB berekend wordt. Alleen relevant in Boss Battle tegen
    // deze ene baas — raakt Team-vs-Team of andere bazen niet aan.
    let labyrinthShield=BM_BOSS?.labyrinthShield;
    let labyrinthBroken=false;
    if(BM_META?.mode==="boss" && BM_META?.bossId==="minotaur" && labyrinthShield>0){
      const absorbed=Math.min(labyrinthShield,armyDmgB);
      labyrinthShield-=absorbed;
      armyDmgB-=absorbed;
      if(labyrinthShield<=0){ labyrinthShield=0; labyrinthBroken=true; }
    }
    // Eerst álle schade van deze ronde verrekenen, dan pas de heling, en pas
    // daarna klemmen op 0..maxHealth. Anders ging heling verloren: in Boss
    // Battle werd de klap van de baas (tick.classDamage hieronder) pas ná het
    // klemmen verrekend, dus healde een Priester tegen een nog volle balk
    // terwijl de schade daarna alsnog binnenkwam.
    let rawHA=tA.health-armyDmgA;
    let rawHB=tB.health-armyDmgB;

    // Boss Battle: de baas (team B) is scripted i.p.v. speler-gestuurd — na de
    // normale schade-op-de-baas-berekening hierboven (die al vanzelf via de
    // bestaande team-A/B-engine loopt) valt de baas zelf de klas (team A) aan.
    // Unieke bazen-mechanics (Hydra-regen/Cycloop-metgezellenmaaltijd/
    // Minotaurus-Enrage) zitten in bmBossResolveTick() (bossbattle.js).
    let bossEvents=[];
    if(BM_META?.mode==="boss"){
      const diffM=bmBossDiff(BM_META.bossDifficulty).m;
      // Fase op basis van de HP ná de schade van de klas, maar vóór heling
      // (de baas heeft geen heling van team B; alleen zijn eigen regen hieronder).
      const provHB=Math.max(0,Math.min(tB.maxHealth,rawHB));
      const phase=bmBossPhaseFor(tB.maxHealth?provHB/tB.maxHealth:0);
      // Proxy voor "fout antwoord": speler deed mee maar bracht geen schade
      // toe (geen vergrendelde actie) — zo straffen we niet individueel maar
      // voedt het wel de rage-balk, conform het ontwerp.
      const noDamageCount=Object.values(players).filter(p=>p.answeredRound===roundN&&!p.lockedAction).length;
      const bossIn={...BM_BOSS,phase};
      if(BM_META?.bossId==="minotaur") bossIn.labyrinthShield=labyrinthShield;
      const tick=bmBossResolveTick(bossIn,{
        classMaxHP:tA.maxHealth, bossMaxHP:tB.maxHealth, diffM, noDamageAnswerCount:noDamageCount,
        bossId:BM_META?.bossId, dmgDealtThisRound:efB, shieldThisRound:shldA, labyrinthBroken,
      });
      rawHA-=tick.classDamage;
      rawHB+=(tick.bossHeal||0);
      bossEvents=tick.events;
      // rageMaxed is sticky (voor het "geheim_norage"-eerbewijs): eenmaal waar,
      // blijft waar voor de rest van het gevecht, ook al reset rage() zelf naar 0.
      const rageMaxed=!!BM_BOSS.rageMaxed||bossEvents.some(e=>e.type==="boss_rage_attack");
      // Minion Summon (BOSS_BATTLE.md §4): bij de overgang van fase 1 naar
      // fase 2, en alleen als er nog geen (levende) handlangers zijn, roept de
      // baas er 2-4 op. Niet voor het verborgen garrison-preset (Total War-
      // belegeringen) — dat zou de garnizoensbalans ongevraagd raken.
      let liveMinions=minions.filter(m=>m.hp>0);
      if(BM_META?.bossId!=="garrison" && (BM_BOSS.phase||1)===1 && tick.boss.phase===2 && !liveMinions.length){
        const n=BM_MINION_COUNT_MIN+Math.floor(Math.random()*(BM_MINION_COUNT_MAX-BM_MINION_COUNT_MIN+1));
        const mHp=Math.max(1,Math.round(tB.maxHealth*BM_MINION_HP_PCT));
        liveMinions=Array.from({length:n},(_,i)=>({id:"m"+i,hp:mHp,maxHp:mHp}));
      }
      const bossUpd={...tick.boss,rageMaxed,minions:liveMinions};
      await fbDB.ref("rooms/"+BM_CODE+"/boss").update(bossUpd);
      BM_BOSS=bossUpd;
    }

    // Pas hier de heling erbij, klemmen — zie de toelichting hierboven — en
    // afronden. Dat laatste moet: de Hydra-regen is 2 % van zijn maximum en dus
    // zelden een rond getal, waardoor er "725.5999999999999/840 HP" op het
    // scorebord kwam te staan.
    const newHA=Math.round(Math.max(0,Math.min(tA.maxHealth,rawHA+for_.A.heal)));
    const newHB=Math.round(Math.max(0,Math.min(tB.maxHealth,rawHB+for_.B.heal)));
    await fbDB.ref("rooms/"+BM_CODE+"/teams").update({"A/health":newHA,"B/health":newHB});
    const logWinner=newHA<=0?"B":newHB<=0?"A":null;
    const roundParticipants=Object.values(players).filter(p=>p.answeredRound===roundN).length;
    // "Geluksbrenger" (Boss-Battle-scorebord, BOSS_BATTLE.md §8): benadering
    // van de genadeklap — de speler met de hoogste schade in de ronde die de
    // baas op 0 bracht (de architectuur kent geen exacte volgorde binnen een
    // ronde, zelfde beperking als bij de brede-deelname-bonus).
    const finishingBlowPid=(isBossFight&&newHB<=0)
      ? (events.filter(e=>e.team==="A"&&e.dmg>0).sort((a,b)=>b.dmg-a.dmg)[0]?.pid||null) : null;
    // Vangnet: één undefined ergens in dit log-bericht laat Firebase de push
    // weigeren, en dan strandt de hele ronde. De inhoud komt uit een stuk of
    // vijf plekken (abilities, combo's, chain-bonus, baas-mechanics), dus we
    // maken er hier nog één keer null van in plaats van erop te vertrouwen.
    fbDB.ref("rooms/"+BM_CODE+"/log").push(bmGeenUndefined({round:roundN,events,efA,efB,blockedA,blockedB,healA:for_.A.heal,healB:for_.B.heal,newHA,newHB,winner:logWinner,participants:roundParticipants,bossEvents,finishingBlowPid}));

    // Mastery bijhouden in identities (fire-and-forget)
    bmUpdateMastery(players,pUpd,events);

    if(newHA<=0||newHB<=0){
      // Total War-belegering: drie losse gevechten na elkaar. Zodra de
      // huidige stage (militie/garnizoen → muur → fort) op 0 komt maar er
      // nog een volgende stage is, is dit GEEN einde van het gevecht — de
      // klas-HP blijft ongewijzigd staan (geen gratis heal tussen stages),
      // alleen de baas krijgt de volgende stage se verse HP.
      const gp=BM_META?.garrisonProvince;
      const stageKeys=gp?bmSiegeStageKeys(gp):[];
      const curStageIdx=BM_BOSS?.stage||0;
      const curStageKey=stageKeys[curStageIdx];
      if(newHB<=0 && curStageKey && curStageIdx<stageKeys.length-1){
        const nextIdx=curStageIdx+1;
        const nextKey=stageKeys[nextIdx];
        const nextMax=twStageMaxHP(gp, nextKey);
        const dmg=(gp.siege && gp.siege.stageDamage && gp.siege.stageDamage[nextKey])||0;
        const nextStart=Math.max(1, nextMax-dmg);
        await fbDB.ref("rooms/"+BM_CODE+"/teams/B").set({health:nextStart,maxHealth:nextMax});
        await fbDB.ref("rooms/"+BM_CODE+"/boss").update({stage:nextIdx,phase:1,rage:0,roundsSinceAttack:0});
        BM_TEAMS={...BM_TEAMS,B:{health:nextStart,maxHealth:nextMax}};
        await bmDistributeQs(roundN+1);
        bmHostStartTimer();
        return;
      }
      const winner=newHA<=0?"B":"A";
      // trait_balans ("Perfect in Balans"): een écht gelijktijdige dubbele-KO
      // — beide legers raken in dezelfde ronde op 0. De ternary hierboven
      // kiest dan altijd B als winnaar (geen apart tie-break), maar dit veld
      // legt het zeldzame toeval zelf vast voor bmCheckHostTraits().
      const exactTie=newHA<=0&&newHB<=0;
      await fbDB.ref("rooms/"+BM_CODE+"/state").update({status:"finished",winner,exactTie});
      // Schrijf het resultaat terug naar de aangevallen provincie
      // (eigendomswissel bij winst, "slijtageslag"-schade op de huidige stage
      // bij verlies). Alleen relevant als dit gevecht vanuit twStartAttack()
      // gestart is.
      if(gp) twResolveSiege(winner,curStageKey||"towers",tB.maxHealth,newHB,players).catch(()=>{});
      setTimeout(()=>Net.deleteRoom(BM_CODE).catch(()=>{}), 5000);
      return;
    }
    await bmDistributeQs(roundN+1);
    bmHostStartTimer();
  }catch(e){
    // Een onverwachte fout middenin het verrekenen mag nooit het hele gevecht
    // laten vastlopen. Dat gebeurde wel bij de targetMinion-fout hierboven: de
    // ronde werd nooit afgerond, dus stopte de timer en kregen de leerlingen
    // geen nieuwe vragen meer. We melden het aan de docent en gaan door met de
    // volgende ronde — een half verrekende ronde is minder erg dan een
    // bevroren klas.
    console.error("bmResolve",e);
    // Het bericht meesturen: zonder tekst is er achteraf niets te herleiden —
    // een docent kan de console niet openen midden in een les.
    const msg=(e&&e.message?String(e.message):String(e)).slice(0,120);
    toast("Ronde overgeslagen","Er ging iets mis bij het verrekenen: "+msg+" — het gevecht gaat door.");
    try{ await bmDistributeQs(roundN+1); bmHostStartTimer(); }catch(e2){ console.error("bmResolve herstel",e2); }
  }finally{BM_RESOLVING=false;}
}

function bmUpdateMastery(players,pUpd,events){
  if(!fbDB)return;
  for(const[pid,p]of Object.entries(players)){
    const cls=p.class;if(!cls||!p.identityKey)continue;
    const[klas,lcode]=(p.identityKey||"").split(":");if(!klas||!lcode)continue;
    const evs=events.filter(e=>e.pid===pid);
    const contrib={
      rounds:firebase.database.ServerValue.increment(1),
      damage:firebase.database.ServerValue.increment(evs.reduce((s,e)=>s+(e.dmg||0),0)),
      healing:firebase.database.ServerValue.increment(evs.reduce((s,e)=>s+(e.heal||0),0)),
    };
    fbDB.ref("identities/"+klas+"/"+lcode+"/classHistory/"+cls).update(contrib).catch(()=>{});
  }
}
function bmEndGame(){
  if(fbDB)fbDB.ref("rooms/"+BM_CODE+"/state").update({status:"finished",winner:"_stopped"})
    .then(()=>Net.deleteRoom(BM_CODE)).catch(()=>{});
  cleanup();bmLeave();go("home");
}

/* ---- GEVECHTSCONTROLE (host-side, live) ---- */
let BM_PAUSED=false, BM_PAUSED_DEADLINE=0;
function bmTogglePause(){
  const btn=el("bmPauseBtn");
  if(!BM_PAUSED){
    BM_PAUSED=true;
    BM_PAUSED_DEADLINE=BM_STATE.round?.deadline||Date.now();
    clearInterval(BM_PHASE_TIMER);BM_PHASE_TIMER=null;_bmTicking=false;
    // Zet deadline ver weg zodat de leerling-timer niet afloopt
    if(fbDB)fbDB.ref("rooms/"+BM_CODE+"/state/round/deadline").set(Date.now()+99999000);
    if(btn)btn.textContent="▶ Hervatten";
  } else {
    BM_PAUSED=false;
    const remainingMs=Math.max(3000,BM_PAUSED_DEADLINE-Date.now());
    const newDeadline=Date.now()+remainingMs;
    if(fbDB)fbDB.ref("rooms/"+BM_CODE+"/state/round/deadline").set(newDeadline);
    BM_PAUSED_DEADLINE=0;
    if(btn)btn.textContent="⏸ Pauzeer";
    bmHostStartTimer();
  }
}
async function bmSkipRound(){
  if(!BM_STATE.round||BM_RESOLVING)return;
  clearInterval(BM_PHASE_TIMER);BM_PHASE_TIMER=null;_bmTicking=false;BM_PAUSED=false;
  await bmDistributeQs((BM_STATE.round.n||0)+1);
  bmHostStartTimer();
}
async function bmReplaceQ(){
  if(!BM_STATE.round||BM_RESOLVING)return;
  clearInterval(BM_PHASE_TIMER);BM_PHASE_TIMER=null;_bmTicking=false;
  await bmDistributeQs(BM_STATE.round.n||1);
  bmHostStartTimer();
}
async function bmRestartRound(){
  if(!BM_STATE.round||BM_RESOLVING)return;
  const at=BM_META?.answerTimer||10;
  const n=BM_STATE.round.n||1;
  const up={"state/round/deadline":Date.now()+at*1000,"state/round/phase":"question"};
  for(const pid of Object.keys(BM_PLAYERS)){
    up["players/"+pid+"/answeredRound"]=-1;
    up["players/"+pid+"/lockedAction"]=null;
  }
  clearInterval(BM_PHASE_TIMER);BM_PHASE_TIMER=null;_bmTicking=false;BM_PAUSED=false;
  await fbDB.ref("rooms/"+BM_CODE).update(up);
  bmHostStartTimer();
}

/* ---- NIEUW GEVECHT MET DEZELFDE SPELERS ----
   Na afloop hoefde de klas voorheen opnieuw in te loggen: de docent verliet de
   kamer en iedereen moest de spelcode en zijn leerlingcode opnieuw invoeren.
   Deze functie hergebruikt dezelfde kamer en dezelfde players-tak — alleen de
   wedstrijdgegevens worden gewist. De leerlingen zien hun resultaatscherm
   vanzelf terugspringen naar de lobby (zie de status-listener in
   SCREENS.battleResult), met hun naam, avatar, team en klasse nog ingevuld. */
async function bmNewMatchSamePlayers(){
  if(!fbDB||!BM_CODE){go("home");return;}
  const btns=document.querySelectorAll(".bm-again-btn");
  btns.forEach(b=>{b.disabled=true;b.textContent="Nieuw gevecht klaarzetten…";});
  const base=BM_META?.armyHealth||100;   // definitieve HP wordt bij de start opnieuw geschaald
  const up={
    "state":{status:"lobby",round:null,winner:null},
    "log":null,
    "boss":null,
    "teams":{A:{health:base,maxHealth:base},B:{health:base,maxHealth:base}}
  };
  // Per speler: alles wat bij dít gevecht hoorde op nul. Identiteit, avatar,
  // eretitel, team, klasse, mastery- en traitvlaggen blijven staan, zodat
  // niemand opnieuw hoeft in te loggen of te kiezen.
  for(const pid of Object.keys(BM_PLAYERS)){
    const b="players/"+pid+"/";
    up[b+"be"]=0; up[b+"correct"]=0; up[b+"wrong"]=0;
    up[b+"damage"]=0; up[b+"healing"]=0; up[b+"shielding"]=0;
    up[b+"answeredRound"]=-1; up[b+"lockedAction"]=null;
    up[b+"currentQ"]=null; up[b+"missed"]=null; up[b+"inspired"]=null;
    up[b+"hp"]=null; up[b+"maxHp"]=null; up[b+"armor"]=null;
    up[b+"isAlive"]=null; up[b+"respawnMeter"]=null;
  }
  try{
    await fbDB.ref("rooms/"+BM_CODE).update(up);
  }catch(e){
    toast("Mislukt","Kon geen nieuw gevecht klaarzetten: "+(e&&e.message?e.message:String(e)));
    btns.forEach(b=>{b.disabled=false;b.textContent="↻ Nieuw gevecht — zelfde spelers";});
    return;
  }
  cleanup();
  BM_AWARD_DATA=null;BM_LOG=null;BM_AWARD_STEP=0;
  if(BM_AWARD_TIMER){clearTimeout(BM_AWARD_TIMER);BM_AWARD_TIMER=null;}
  BM_STATE={status:"lobby"};BM_PAUSED=false;BM_RESOLVING=false;_bmFormHash="";_bmRankRound=-1;_bmRankMap={};
  BM_TEAMS={A:{health:base,maxHealth:base},B:{health:base,maxHealth:base}};
  const appEl=document.getElementById("app");
  if(appEl)appEl.classList.remove("bm-host-mode");
  go("battleHostLobby");
}

/* ---- EINDE GEVECHT → AWARD-CEREMONY ---- */
let BM_AWARD_DATA=null,BM_AWARD_STEP=0,BM_AWARD_TIMER=null;
let BM_LOG=null;

function bmHostResult(){
  cleanup();
  BM_PAUSED=false;
  // Sla spelerdata op vóór BM_PLAYERS wordt gereset
  BM_AWARD_DATA={winner:BM_STATE.winner,exactTie:!!BM_STATE.exactTie,all:Object.values(BM_PLAYERS)};
  bmSyncClassMissedWords(BM_AWARD_DATA.all);
  go("battleHostAwards");
}

// Telt gemiste woorden van dit gevecht bij de klasbrede, maandelijkse teller op
// (los van bmComputeAnalytics(), dat alleen déze ene sessie toont) — zie
// tpRenderClassAnalytics() in games.js voor de docentweergave "moeilijkste
// woorden deze maand". Fire-and-forget, host-only (net als bmUpdateMastery).
function bmSyncClassMissedWords(players){
  if(!fbDB) return;
  const month=new Date().toISOString().slice(0,7);
  const byKlas={};
  players.forEach(p=>{
    const klas=(p.identityKey||"").split(":")[0];
    if(!klas||klas==="bot") return;
    const map=byKlas[klas]||(byKlas[klas]={});
    Object.values(p.missed||{}).forEach(v=>{
      if(!v.p) return;
      const wk=bmWordKey(v.p);
      if(!map[wk]) map[wk]={p:v.p,a:v.a||"",c:0};
      map[wk].c+=(v.c||0);
    });
  });
  Object.entries(byKlas).forEach(([klas,map])=>{
    const upd={};
    Object.entries(map).forEach(([wk,w])=>{
      const base="classAnalytics/"+klas+"/"+month+"/"+wk+"/";
      upd[base+"p"]=w.p;
      upd[base+"a"]=w.a;
      upd[base+"c"]=firebase.database.ServerValue.increment(w.c);
    });
    fbDB.ref().update(upd).catch(()=>{});
  });
}

/* ---- M7: AWARD-BEREKENING ---- */
function bmComputeAwards(players, log){
  const entries=Object.values(log||{}).sort((a,b)=>(a.round||0)-(b.round||0));
  const shieldCnt={},comboCnt={};
  entries.forEach(e=>(e.events||[]).forEach(ev=>{
    if(ev.anim==="shield"&&ev.pid) shieldCnt[ev.pid]=(shieldCnt[ev.pid]||0)+1;
    if(ev.type==="combo")(ev.pids||[]).forEach(pid=>{comboCnt[pid]=(comboCnt[pid]||0)+1;});
  }));
  const pidMap={};
  Object.entries(BM_PLAYERS).forEach(([pid,p])=>pidMap[pid]=p);
  const sort=(arr,fn)=>[...arr].sort(fn);
  const byDmg=sort(players,(a,b)=>(b.damage||0)-(a.damage||0));
  const byHeal=sort(players,(a,b)=>(b.healing||0)-(a.healing||0));
  const byAcc=players.filter(p=>(p.correct||0)+(p.wrong||0)>=3)
    .sort((a,b)=>{const ta=(a.correct||0)+(a.wrong||0),tb=(b.correct||0)+(b.wrong||0);
      return (b.correct||0)/tb-(a.correct||0)/ta;});
  const bySpd=players.filter(p=>(p.respondCount||0)>=2)
    .sort((a,b)=>(a.totalResponseMs||0)/a.respondCount-(b.totalResponseMs||0)/b.respondCount);
  const shldTop=Object.entries(shieldCnt).sort((a,b)=>b[1]-a[1])[0];
  const cmbTop=Object.entries(comboCnt).sort((a,b)=>b[1]-a[1])[0];
  const p2=(e)=>e?{...(pidMap[e[0]]||{}),_val:e[1]}:null;
  return[
    {nm:"Meeste Schade",    icon:"trident", emoji:"⚔️",  player:byDmg[0]||null,  value:byDmg[0]?(byDmg[0].damage||0)+" schade":""},
    {nm:"Beste Verdediger", icon:"shield",  emoji:"🛡️",  player:p2(shldTop),      value:shldTop?shldTop[1]+" schild-acties":""},
    {nm:"Beste Support",    icon:"torch",   emoji:"💚",  player:byHeal[0]||null,  value:byHeal[0]?(byHeal[0].healing||0)+" healing":""},
    {nm:"Scholar",          icon:"owl",     emoji:"📚",  player:byAcc[0]||null,   value:byAcc[0]?Math.round((byAcc[0].correct||0)/((byAcc[0].correct||0)+(byAcc[0].wrong||0))*100)+"%":""},
    {nm:"Snelste Denker",   icon:"horse",   emoji:"⚡",  player:bySpd[0]||null,   value:bySpd[0]?Math.round((bySpd[0].totalResponseMs||0)/(bySpd[0].respondCount||1)/100)/10+"s gem.":""},
    {nm:"Beste Teamspeler", icon:"column",  emoji:"🤝",  player:p2(cmbTop),       value:cmbTop?cmbTop[1]+" combo's":""},
  ];
}

// Boss-Battle-eigen scorebord (BOSS_BATTLE.md §8) — Boss Battle hergebruikte
// tot nu toe 100% bmComputeAwards() hierboven, met categorieën die in een
// coöperatief gevecht niet kloppen ("Beste Verdediger" tegen je eigen team?).
// Zelfde vorm/patroon (pidMap/p2/sort), andere databronnen.
function bmComputeBossAwards(players, log){
  const entries=Object.values(log||{}).sort((a,b)=>(a.round||0)-(b.round||0));
  const pidMap={};
  Object.entries(BM_PLAYERS).forEach(([pid,p])=>pidMap[pid]=p);
  const sort=(arr,fn)=>[...arr].sort(fn);
  const byDmg=sort(players,(a,b)=>(b.damage||0)-(a.damage||0));
  const byHeal=sort(players,(a,b)=>(b.healing||0)-(a.healing||0));
  const byMinionDmg=players.filter(p=>(p.minionDamage||0)>0).sort((a,b)=>(b.minionDamage||0)-(a.minionDamage||0));
  const byStreak=players.filter(p=>(p.bestCorrectStreak||0)>0).sort((a,b)=>(b.bestCorrectStreak||0)-(a.bestCorrectStreak||0));
  const byChain=players.filter(p=>(p.chainCount||0)>0).sort((a,b)=>(b.chainCount||0)-(a.chainCount||0));
  const finishEntry=entries.find(e=>e.finishingBlowPid);
  const finisher=finishEntry?pidMap[finishEntry.finishingBlowPid]:null;
  const awards=[
    {nm:"De Sloper",             icon:"trident", emoji:"⚔️", player:byDmg[0]||null,    value:byDmg[0]?(byDmg[0].damage||0)+" schade aan de baas":""},
    {nm:"Medic van het Legioen", icon:"torch",   emoji:"💚", player:byHeal[0]||null,   value:byHeal[0]?(byHeal[0].healing||0)+" healing":""},
    {nm:"De Onsterfelijke",      icon:"laurel",  emoji:"🔥", player:byStreak[0]||null, value:byStreak[0]?byStreak[0].bestCorrectStreak+" op rij goed":""},
    {nm:"Combo Koning",          icon:"column",  emoji:"🤝", player:byChain[0]||null,  value:byChain[0]?byChain[0].chainCount+"x brede aanval":""},
    {nm:"Geluksbrenger",         icon:"star",    emoji:"💀", player:finisher||null,    value:finisher?"gaf de genadeklap":""},
  ];
  // Minion Opruimer alleen tonen als er in dit gevecht daadwerkelijk
  // handlangers waren om op te ruimen.
  if(byMinionDmg.length) awards.push(
    {nm:"Minion Opruimer", icon:"eagle", emoji:"🎯", player:byMinionDmg[0], value:(byMinionDmg[0].minionDamage||0)+" schade aan handlangers"}
  );
  return awards;
}

// Host-only: kent traits toe die alleen met kennis van BEIDE teams (of van
// een écht gelijktijdige dubbele-KO) te bepalen zijn — spelers zien elkaars
// stats nooit live (M2 "scoped listeners"), dus de host legt de link direct
// na het gevecht en schrijft rechtstreeks naar de identiteit via identityKey.
function bmGrantHostTrait(player, id){
  if(!player)return;
  const[klas,lcode]=(player.identityKey||"").split(":");
  if(!klas||!lcode)return;
  const bonus=TRAIT_COIN_BONUS[id]||0;
  fbDB.ref("identities/"+klas+"/"+lcode+"/achievements").transaction(cur=>{
    const list=cur||[];
    if(list.includes(id))return;
    return[...list,id];
  }).then(res=>{
    if(bonus>0&&res.committed){
      fbDB.ref("identities/"+klas+"/"+lcode+"/coins").transaction(c=>(c||0)+bonus);
      // Alleen lokaal spiegelen als de host zichzelf bekroont — voor een
      // andere leerling in de kamer haalt diens eigen toestel de nieuwe
      // stand later op via syncProfileFromCloud()/opnieuw inloggen.
      if(BM_IDENT&&BM_IDENT.klascode===klas&&BM_IDENT.leerlingcode===lcode) addCoins(bonus, true);
    }
  }).catch(()=>{});
}
function bmCheckHostTraits(players, winnerTeam, exactTie){
  if(!fbDB||!winnerTeam||winnerTeam==="_stopped")return;
  const mvp=[...players].sort((a,b)=>(b.damage||0)-(a.damage||0))[0];
  // Feniks: MVP (hoogste schade over beide teams) van het winnende team,
  // minstens 1x herrezen (Heldenmodus, p.timesRevived — bmRespawnProgress()).
  if(mvp&&mvp.team===winnerTeam&&(mvp.timesRevived||0)>=1) bmGrantHostTrait(mvp,"trait_feniks");
  // Verlies met Stijl: diezelfde MVP-berekening, maar op het verliezende team.
  if(mvp&&mvp.team!==winnerTeam) bmGrantHostTrait(mvp,"trait_stijlvol_verlies");
  // Perfect in Balans: gedeeld toeval, dus voor alle spelers in de kamer.
  if(exactTie) players.forEach(p=>bmGrantHostTrait(p,"trait_balans"));
}

function bmComputeAnalytics(players,log){
  const logEntries=Object.values(log||{}).sort((a,b)=>(a.round||0)-(b.round||0));
  // Sinds de legersterkte per team met het aantal tegenstanders meeschaalt
  // (bmTeamHP), kunnen de twee maxima ver uit elkaar liggen. De grafiek tekent
  // daarom elk team als percentage van zijn éígen maximum — anders zou de lijn
  // van het team met weinig HP plat op de bodem liggen.
  const maxOf=(t,pick)=>(BM_TEAMS?.[t]?.maxHealth)
    ||Math.max(1,BM_META?.armyHealth||100,...logEntries.map(e=>Math.max(0,pick(e)||0)));
  const hpTimeline=logEntries.map(e=>({round:e.round,hA:Math.max(0,e.newHA||0),hB:Math.max(0,e.newHB||0),part:e.participants||0}));
  const wordMap={};
  players.forEach(p=>Object.entries(p.missed||{}).forEach(([,v])=>{
    const key=v.p||"";if(!key)return;
    if(!wordMap[key])wordMap[key]={p:v.p,a:v.a||"",c:0};
    wordMap[key].c+=(v.c||0);
  }));
  const topMissed=Object.values(wordMap).sort((a,b)=>b.c-a.c).slice(0,5);
  const totC=players.reduce((s,p)=>s+(p.correct||0),0);
  const totA=players.reduce((s,p)=>s+(p.correct||0)+(p.wrong||0),0);
  const avgAcc=totA>0?Math.round(totC/totA*100):null;
  const maxA=maxOf("A",e=>e.newHA), maxB=maxOf("B",e=>e.newHB);
  return{hpTimeline,topMissed,avgAcc,maxA,maxB,players};
}

function bmHPChart(timeline,maxA,maxB){
  if(!timeline.length)return`<div class="note" style="text-align:center">Geen rondedata beschikbaar.</div>`;
  const W=320,H=100,n=timeline.length;
  const mA=Math.max(1,maxA||100), mB=Math.max(1,maxB||maxA||100);
  const px=i=>32+i*(W-42)/Math.max(1,n-1);
  // Verticale as = percentage van de eigen legersterkte (zie bmComputeAnalytics)
  const pyPct=f=>H-12-Math.max(0,Math.min(1,f))*(H-22);
  const py=f=>pyPct(f);
  const ptA=timeline.map((e,i)=>px(i)+","+pyPct(e.hA/mA)).join(" ");
  const ptB=timeline.map((e,i)=>px(i)+","+pyPct(e.hB/mB)).join(" ");
  const step=Math.max(1,Math.floor(n/7));
  const labels=timeline.map((e,i)=>{if(i%step!==0&&i!==n-1)return"";
    return`<text x="${px(i)}" y="${H-2}" fill="var(--muted)" font-size="8" text-anchor="middle">${e.round}</text>`;}).join("");
  const colA="var(--teamA)",colB="var(--teamB)";
  return`<svg viewBox="0 0 ${W} ${H}" width="100%" style="max-height:100px" xmlns="http://www.w3.org/2000/svg">
    <line x1="32" y1="${py(0)}" x2="${W-10}" y2="${py(0)}" stroke="var(--stone4)" stroke-width="1"/>
    <line x1="32" y1="${py(.5)}" x2="${W-10}" y2="${py(.5)}" stroke="var(--stone4)" stroke-width="1" stroke-dasharray="3,3"/>
    <text x="28" y="${py(1)+3}" fill="var(--muted)" font-size="8" text-anchor="end">100%</text>
    <text x="28" y="${py(0)+3}" fill="var(--muted)" font-size="8" text-anchor="end">0%</text>
    <polyline points="${ptA}" fill="none" stroke="${colA}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
    <polyline points="${ptB}" fill="none" stroke="${colB}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
    <rect x="34" y="7" width="12" height="4" fill="${colA}" rx="1"/>
    <text x="49" y="12" fill="var(--muted)" font-size="9">${esc(bmTeamNm("A"))}</text>
    <rect x="34" y="14" width="12" height="4" fill="${colB}" rx="1"/>
    <text x="49" y="19" fill="var(--muted)" font-size="9">${esc(bmTeamNm("B"))}</text>
    ${labels}
  </svg>`;
}

async function bmExportCSV(){
  const players=BM_AWARD_DATA?.all||Object.values(BM_PLAYERS);
  let XLSX;try{XLSX=await loadSheetJS();}catch(e){toast("Fout","SheetJS kon niet worden geladen.");return;}
  const rows=players.map(p=>{
    const total=(p.correct||0)+(p.wrong||0);
    const acc=total>0?Math.round((p.correct||0)/total*100):0;
    const missed=Object.values(p.missed||{}).sort((a,b)=>(b.c||0)-(a.c||0)).map(w=>w.p||"").join(", ");
    return{"Naam":p.name||"","Klas":(p.identityKey||"").split(":")[0]||"","Klasse":bmClsName(p.class)||"",
      "Goed%":acc,"Goed":p.correct||0,"Fout":p.wrong||0,"Gemiste woorden":missed,
      "Schade":p.damage||0,"Healing":p.healing||0,"Rondes actief":total};
  });
  const ws=XLSX.utils.json_to_sheet(rows);
  const wb=XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb,ws,"Gevecht");
  XLSX.writeFile(wb,"battlemode_"+(BM_CODE||"export")+"_"+new Date().toISOString().substring(0,10)+".csv");
}

// Icoon van een eerbewijs: het eigen SVG-icoon uit de app (zelfde stijl als de
// klasse-iconen, en niet afhankelijk van welke emoji-font een toestel heeft).
// Valt terug op de emoji zolang een eerbewijs nog geen icoon meegekregen heeft.
function bmAwardIcon(award,size){
  return award&&award.icon
    ? iconSVG(award.icon,size,"var(--hi-bright)")
    : `<span style="font-size:${Math.round(size*0.8)}px;line-height:1">${(award&&award.emoji)||""}</span>`;
}

/* Erepodium: alle eerbewijzen nog één keer samen in beeld, met daaronder de
   totaalscore van de klas. De ceremonie laat ze één voor één zien (3,5 s per
   stuk) en dat gaat snel voorbij — wie even niet keek, miste zijn eigen naam.
   Dit scherm blijft staan tot de docent doorklikt. */
function bmRenderPodium(stage){
  const aw=BM_AWARD_DATA||{};
  const players=aw.all||[];
  const awards=(aw.awards||[]).filter(a=>a&&a.player&&a.player.name);
  const w=aw.winner;
  const tot=players.reduce((a,p)=>({
    correct:a.correct+(p.correct||0), wrong:a.wrong+(p.wrong||0),
    damage:a.damage+(p.damage||0), healing:a.healing+(p.healing||0),
    shielding:a.shielding+(p.shielding||0),
  }),{correct:0,wrong:0,damage:0,healing:0,shielding:0});
  const vragen=tot.correct+tot.wrong;
  const acc=vragen?Math.round(tot.correct/vragen*100):null;
  const rondes=Object.keys(BM_LOG||{}).length;
  const winHTML=(w==="A"||w==="B")
    ? `<div class="bm-podium-win">${iconSVG(bmTeamIcon(w),26,"var(--team"+w+")")}<span style="color:var(--team${w})">${esc(bmTeamNm(w))}</span> wint</div>`
    : `<div class="bm-podium-win">Gevecht gestopt</div>`;
  const cards=awards.map(a=>`
    <div class="bm-podium-card">
      <div class="bm-podium-ic">${bmAwardIcon(a,30)}</div>
      <div class="bm-podium-nm">${esc(a.nm)}</div>
      ${renderPixelHeroIcon(a.player.avatar,44)}
      <div class="bm-podium-player">${esc(a.player.name)}</div>
      <div class="bm-podium-val">${esc(String(a.value||""))}</div>
    </div>`).join("")
    || `<div class="note">Geen eerbewijzen — er is te weinig gespeeld om ze te bepalen.</div>`;
  stage.innerHTML=`
    ${winHTML}
    <div class="bm-podium-hd">🏆 Erepodium</div>
    <div class="bm-podium">${cards}</div>
    <div class="bm-classscore">
      <div class="bm-cs-lbl">Samen goed vertaald</div>
      <div class="bm-cs-big">${tot.correct}</div>
      <div class="bm-cs-row">
        <span>${acc!==null?acc+"% juist":"—"}</span>
        <span>${vragen} vragen</span>
        <span>${rondes} ronde${rondes===1?"":"n"}</span>
        <span>${players.length} spelers</span>
      </div>
      <div class="bm-cs-row bm-cs-sub">
        <span>⚔️ ${tot.damage} schade</span>
        <span>💚 ${tot.healing} heling</span>
        <span>🛡️ ${tot.shielding} schild</span>
      </div>
    </div>`;
  // Doorklik-knoppen aanpassen: de ceremonie is voorbij, dus "Volgende" wordt
  // de doorgang naar het klassenoverzicht en "Sla over" heeft geen zin meer.
  const nb=el("bmAwardNext");
  if(nb){ nb.textContent="📊 Klassenoverzicht →"; nb.setAttribute("onclick","go('battleHostAnalytics')"); }
  const sb=el("bmAwardSkip"); if(sb) sb.style.display="none";
}

function bmNextAward(){
  if(BM_AWARD_TIMER){clearTimeout(BM_AWARD_TIMER);BM_AWARD_TIMER=null;}
  BM_AWARD_STEP++;
  const stage=el("bmAwardStage");if(!stage)return;
  const aw=BM_AWARD_DATA;if(!aw)return;

  if(BM_AWARD_STEP===1){
    const w=aw.winner;
    const wonHTML=w==="A"||w==="B"
      ?`${iconSVG(bmTeamIcon(w),72,"var(--team"+w+")")}<h2 style="color:var(--hi-bright);font-size:28px;margin:10px 0;animation:bmAwardIn .6s">${esc(bmTeamNm(w))} wint!</h2>`
      :`<div style="font-size:64px">⚔️</div><h2 style="color:var(--muted);font-size:24px;margin:10px 0">Gevecht gestopt</h2>`;
    stage.innerHTML=`<div style="animation:bmWin .7s;text-align:center">${wonHTML}</div>`;
    beep("win");
    BM_AWARD_TIMER=setTimeout(bmNextAward,3500);
    return;
  }

  const awards=aw.awards||[];
  const idx=BM_AWARD_STEP-2;
  if(idx>=awards.length){
    // Einde ceremonie: alles nóg een keer samen in beeld, en daar blijft het
    // staan — geen timer die doorspringt naar het klassenoverzicht.
    bmRenderPodium(stage);
    return;
  }

  const award=awards[idx];
  const p=award.player;
  if(!p||!p.name){BM_AWARD_STEP++;bmNextAward();return;} // geen winnaar → oversla

  stage.innerHTML=`<div class="bm-award-card">
    <div class="bm-award-ic">${bmAwardIcon(award,44)}</div>
    <div style="font-size:14px;color:var(--muted);letter-spacing:.06em;text-transform:uppercase;margin-bottom:4px">${esc(award.nm)}</div>
    ${renderPixelHeroIcon(p.avatar,80)}
    <div style="font-size:24px;font-weight:700;margin-top:8px">${esc(p.name)}</div>
    <div style="font-size:20px;color:var(--hi-bright)">${esc(String(award.value))}</div>
  </div>`;
  beep("good");
  BM_AWARD_TIMER=setTimeout(bmNextAward,3500);
}

/* ---- SCHERM: battleHostAwards ---- */
SCREENS.battleHostAwards = async function(){
  if(!BM_AWARD_DATA){go("home");return;}
  BM_AWARD_STEP=0;
  if(BM_AWARD_TIMER){clearTimeout(BM_AWARD_TIMER);BM_AWARD_TIMER=null;}
  H(brand(false)+`
  <div class="scrhead"><h2>⚔️ Gevecht afgelopen</h2></div>
  <div id="bmAwardStage" style="min-height:55vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px 16px;gap:8px">
    <div class="note" style="text-align:center">Laden…</div>
  </div>
  <div style="padding:0 16px 8px;display:flex;gap:8px">
    <button class="btn btn-gold" style="flex:1" id="bmAwardNext" onclick="bmNextAward()">Volgende ▶</button>
    <button class="btn" id="bmAwardSkip" onclick="go('battleHostAnalytics')">Sla over →</button>
  </div>
  <div style="padding:0 16px 10px">
    <button class="btn btn-block bm-again-btn" onclick="bmNewMatchSamePlayers()">↻ Nieuw gevecht — zelfde spelers</button>
  </div>
  ${foot()}`);
  try{
    if(fbDB&&BM_CODE){const snap=await fbDB.ref("rooms/"+BM_CODE+"/log").once("value");BM_LOG=snap.val()||{};}
  }catch(e){BM_LOG={};}
  if(!el("bmAwardStage"))return;
  BM_AWARD_DATA.awards=BM_META?.mode==="boss"
    ? bmComputeBossAwards(BM_AWARD_DATA.all,BM_LOG)
    : bmComputeAwards(BM_AWARD_DATA.all,BM_LOG);
  bmCheckHostTraits(BM_AWARD_DATA.all, BM_AWARD_DATA.winner, BM_AWARD_DATA.exactTie);
  bmNextAward();
};

/* ---- SCHERM: battleHostAnalytics ---- */
let BM_ANALYTICS_TAB="klas";
SCREENS.battleHostAnalytics = async function(){
  const players=BM_AWARD_DATA?.all||Object.values(BM_PLAYERS);
  H(brand(false)+`
  <div class="scrhead">
    <button class="back" onclick="bmLeave();go('home')">${iconSVG("shield",20,"currentColor")}</button>
    <h2>📊 Klassenoverzicht</h2>
  </div>
  <div class="panel" style="padding:8px 12px">
    <div class="chips">
      <button class="chip${BM_ANALYTICS_TAB==="klas"?" on":""}" onclick="BM_ANALYTICS_TAB='klas';SCREENS.battleHostAnalytics()">Klas</button>
      <button class="chip${BM_ANALYTICS_TAB==="leerlingen"?" on":""}" onclick="BM_ANALYTICS_TAB='leerlingen';SCREENS.battleHostAnalytics()">Leerlingen</button>
    </div>
  </div>
  <div id="bmAnalContent"><div class="panel"><div class="note" style="text-align:center">Laden…</div></div></div>
  <div style="padding:0 16px 8px;display:flex;flex-direction:column;gap:8px">
    <button class="btn btn-gold btn-block bm-again-btn" onclick="bmNewMatchSamePlayers()">↻ Nieuw gevecht — zelfde spelers</button>
    <button class="btn btn-block" onclick="bmExportCSV()">📥 Exporteer CSV</button>
  </div>
  ${foot()}`);
  if(!BM_LOG&&fbDB&&BM_CODE){
    try{const snap=await fbDB.ref("rooms/"+BM_CODE+"/log").once("value");BM_LOG=snap.val()||{};}catch(e){BM_LOG={};}
  }
  const content=el("bmAnalContent");if(!content)return;
  const an=bmComputeAnalytics(players,BM_LOG);

  if(BM_ANALYTICS_TAB==="klas"){
    const chart=bmHPChart(an.hpTimeline,an.maxA,an.maxB);
    const missedHTML=an.topMissed.length
      ?an.topMissed.map(w=>`<div style="display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid var(--stone4)">
          <div><div style="font-size:13px">${esc(w.p)}</div><div style="font-size:11px;color:var(--muted)">${esc(w.a)}</div></div>
          <div style="color:var(--acc2);font-weight:700;flex:0 0 auto;margin-left:8px">${w.c}×</div></div>`).join("")
      :`<div class="note">Geen gemiste woorden bijgehouden (vereist speeldata uit dit gevecht).</div>`;
    content.innerHTML=`
    <div class="panel">
      <div class="eyebrow l">HP-verloop per ronde (% van de eigen legersterkte)</div>
      ${chart}
    </div>
    <div class="panel">
      <div class="eyebrow l">Gemiddelde accuratesse</div>
      <div style="font-size:32px;font-weight:700;color:var(--hi-bright);text-align:center;padding:6px 0">${an.avgAcc!==null?an.avgAcc+"%":"—"}</div>
    </div>
    <div class="panel">
      <div class="eyebrow l">Top 5 gemiste woorden</div>
      ${missedHTML}
    </div>`;
  } else {
    const sorted=[...players].sort((a,b)=>{
      const ta=(a.correct||0)+(a.wrong||0),tb=(b.correct||0)+(b.wrong||0);
      return tb>0&&ta>0?(b.correct||0)/tb-(a.correct||0)/ta:tb-ta;
    });
    const rows=sorted.map(p=>{
      const tot=(p.correct||0)+(p.wrong||0);
      const acc=tot>0?Math.round((p.correct||0)/tot*100):null;
      const contrib=(p.damage||0)+(p.healing||0);
      const cls=BM_CLASSES.find(c=>c.id===p.class);
      const pid=Object.keys(BM_PLAYERS).find(k=>BM_PLAYERS[k]===p)||"";
      return`<tr onclick="bmShowPlayerDetail('${pid}')" style="cursor:pointer">
        <td><div style="display:flex;align-items:center;gap:7px">
          ${renderPixelHeroIcon(p.avatar,24)}
          <div><div style="font-size:12px;font-weight:700">${esc(p.name)}</div>
          <div style="font-size:10px;color:${cls?.color||"var(--muted)"}">${esc(cls?.nm||"")}</div></div>
        </div></td>
        <td style="text-align:center;font-weight:700;color:${acc!==null&&acc>=80?"var(--green-bright)":""}">${acc!==null?acc+"%":"—"}</td>
        <td style="text-align:center">${contrib}</td>
        <td style="text-align:center">${tot}</td>
      </tr>`;
    }).join("");
    content.innerHTML=`
    <div class="panel" style="padding:0;overflow:hidden">
      <table class="bm-tbl">
        <thead><tr><th>Leerling</th><th>Goed%</th><th>Bijdr.</th><th>Actief</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
    <div class="note" style="text-align:center;margin-bottom:8px">Klik op een leerling voor details.</div>`;
  }
};

function bmShowPlayerDetail(pid){
  const p=BM_PLAYERS[pid];if(!p)return;
  const tot=(p.correct||0)+(p.wrong||0);
  const acc=tot>0?Math.round((p.correct||0)/tot*100):null;
  const avgMs=p.respondCount>0?Math.round(p.totalResponseMs/p.respondCount/100)/10:null;
  const missed=Object.values(p.missed||{}).sort((a,b)=>(b.c||0)-(a.c||0)).slice(0,5);
  const missedHTML=missed.length
    ?missed.map(w=>`<div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid var(--stone4)">
        <div style="font-size:12px">${esc(w.p)} <span style="color:var(--muted)">→ ${esc(w.a)}</span></div>
        <div style="color:var(--acc2);font-weight:700;font-size:12px">${w.c}×</div></div>`).join("")
    :`<div class="note">Geen gemiste woorden.</div>`;
  const cls=BM_CLASSES.find(c=>c.id===p.class);
  const ov=el("overlay");if(!ov)return;
  ov.innerHTML=`<div class="modal">
    <div style="display:flex;gap:12px;align-items:center;margin-bottom:14px">
      ${renderPixelHeroIcon(p.avatar,60)}
      <div><div style="font-size:20px;font-weight:700">${esc(p.name)}</div>
        <div class="pill" style="margin-top:4px;background:${cls?.color||""}22;color:${cls?.color||"var(--muted)"}">${esc(cls?.nm||"")}</div></div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">
      <div class="panel" style="text-align:center;padding:10px"><div style="font-size:24px;font-weight:700;color:var(--hi-bright)">${acc!==null?acc+"%":"—"}</div><div class="note">Accuratesse</div></div>
      <div class="panel" style="text-align:center;padding:10px"><div style="font-size:24px;font-weight:700">${avgMs!==null?avgMs+"s":"—"}</div><div class="note">Gem. responstijd</div></div>
      <div class="panel" style="text-align:center;padding:10px"><div style="font-size:24px;font-weight:700">${p.damage||0}</div><div class="note">Schade</div></div>
      <div class="panel" style="text-align:center;padding:10px"><div style="font-size:24px;font-weight:700">${p.healing||0}</div><div class="note">Healing</div></div>
    </div>
    <div class="eyebrow l">Gemiste woorden</div>
    <div style="margin-bottom:14px">${missedHTML}</div>
    <button class="btn btn-block" onclick="closeOverlay()">Sluiten</button>
  </div>`;
  ov.classList.add("show");
}

/* ---- SCHERM: battleJoin ---- */
SCREENS.battleJoin = function(){
  if(!BM_IDENT){go("battleIdentity");return;}
  const savedSess=(()=>{try{const s=sessionStorage.getItem("bm_session");return s?JSON.parse(s):null;}catch(e){return null;}})();
  const prefillCode=BM_JOIN_PREFILL_CODE||""; BM_JOIN_PREFILL_CODE=null;
  H(brand(true)+`
  <div class="scrhead"><button class="back" onclick="go('home')">${iconSVG("shield",20,"currentColor")}</button><h2>Meedoen — Battle Mode</h2></div>
  ${savedSess?`<div class="panel"><div class="note">Je was al actief in gevecht <b>${esc(savedSess.code)}</b>.</div>
    <button class="btn btn-gold btn-block" style="margin-top:8px" onclick="bmRejoin()">Heraansluiten</button>
    <button class="btn btn-ghost btn-block" style="margin-top:6px" onclick="sessionStorage.removeItem('bm_session');SCREENS.battleJoin()">Nieuw spel</button>
  </div>`:""}
  <div class="panel">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px">
      ${avatarHTML(BM_IDENT.avatar||P.avatar,BM_IDENT.color||P.color,44)}
      <div><div style="font-size:20px">${esc(BM_IDENT.name)}</div>
        <div class="note">${esc(BM_IDENT.klascode)} · ${esc(BM_IDENT.leerlingcode)}</div></div>
    </div>
    <label class="fld">Spelcode van het bord</label>
    <input id="bmJC" type="text" placeholder="ABCD" value="${esc(prefillCode)}" style="text-transform:uppercase;font-size:26px;text-align:center;letter-spacing:.2em" maxlength="4" oninput="this.value=this.value.toUpperCase()">
    <div id="bmJE" class="note warn" style="display:none;margin-top:8px"></div>
  </div>
  <button class="btn btn-gold btn-block lg" onclick="bmDoJoin()">Doe mee</button>
  ${foot()}`);
};
async function bmDoJoin(){
  if(!initFirebase()){toast("Firebase vereist","Battle Mode vereist Firebase.");return;}
  const code=(el("bmJC")?.value||"").trim().toUpperCase();
  const err=el("bmJE");
  if(code.length<3){if(err){err.textContent="Voer de spelcode in.";err.style.display="";}return;}
  if(err)err.style.display="none";
  let meta,stateSnap;
  try{
    const[ms,ss]=await Promise.all([
      fbDB.ref("rooms/"+code+"/meta").once("value"),
      fbDB.ref("rooms/"+code+"/state").once("value")
    ]);
    meta=ms.val();stateSnap=ss.val();
  }catch(e){if(err){err.textContent="Kan kamer niet vinden — controleer je internetverbinding.";err.style.display="";}return;}
  if(!meta||meta.game!=="battle"){if(err){err.textContent="Geen Battle Mode spel met code "+code+".";err.style.display="";}return;}
  if(stateSnap?.status==="finished"){if(err){err.textContent="Dit spel is al afgelopen.";err.style.display="";}return;}
  BM_CODE=CODE=code;BM_META=meta;
  bmApplyTheme(meta.theme);
  const isPlaying=stateSnap?.status==="playing";
  let team=null;
  if(isPlaying){
    if(meta.mode==="boss"){
      team="A"; // Boss Battle: geen tegenstander-team, iedereen vecht mee tegen de baas
    } else {
      // late join: wijs toe aan kleinste team
      const ps=await fbDB.ref("rooms/"+code+"/players").once("value");
      const all=Object.values(ps.val()||{});
      const cA=all.filter(p=>p.team==="A").length,cB=all.filter(p=>p.team==="B").length;
      team=cA<=cB?"A":"B";
    }
  }
  const pd={name:BM_IDENT.name,color:BM_IDENT.color||P.color,avatar:BM_IDENT.avatar||P.avatar,
    team,class:null,be:0,correct:0,wrong:0,damage:0,healing:0,
    answeredRound:isPlaying?(stateSnap.round?.n||0):- 1, // sla huidige ronde over bij late join
    // Ronde waarin deze speler instapte (1 = vanaf het begin). bmAwardBattle()
    // schaalt de vaste deelname- en winstbonus hiermee: wie pas in ronde 8 van
    // 10 binnenkomt, krijgt niet dezelfde beloning als wie er het hele gevecht
    // bij was. Wat je zélf doet (goede antwoorden) telt onverkort mee.
    joinRound:isPlaying?(stateSnap.round?.n||1):1,
    lockedAction:null,online:true,
    // Chronica Classica-eretitel (indien gekozen): puur presentatie in de
    // lobby, zie SP_TITLES/spEquippedTitleDisplayName (singleplayer.js).
    title:spEquippedTitleDisplayName(),
    identityKey:BM_IDENT.klascode+":"+BM_IDENT.leerlingcode};
  const ref=fbDB.ref("rooms/"+code+"/players").push();
  ref.onDisconnect().update({online:false});
  await ref.set(pd);BM_PID=ref.key;
  try{sessionStorage.setItem("bm_session",JSON.stringify({pid:BM_PID,code:BM_CODE}));}catch(e){}
  go(isPlaying?"battlePlayerGame":"battlePlayerLobby");
}

async function bmRejoin(){
  try{
    const s=sessionStorage.getItem("bm_session");if(!s)return false;
    const{pid,code}=JSON.parse(s);
    const[ps,ms,ss]=await Promise.all([
      fbDB.ref("rooms/"+code+"/players/"+pid).once("value"),
      fbDB.ref("rooms/"+code+"/meta").once("value"),
      fbDB.ref("rooms/"+code+"/state").once("value")
    ]);
    const p=ps.val(),meta=ms.val(),st=ss.val();
    if(!p||!meta||meta.game!=="battle"||st?.status==="finished")return false;
    BM_CODE=CODE=code;BM_PID=pid;BM_META=meta;
    BM_IDENT=bmIdentLoad()||BM_IDENT;BM_MY_BE=p.be||0;
    bmApplyTheme(meta.theme);
    const ref=fbDB.ref("rooms/"+code+"/players/"+pid);
    ref.onDisconnect().update({online:false});
    await ref.update({online:true});
    go(st?.status==="playing"?"battlePlayerGame":"battlePlayerLobby");
    return true;
  }catch(e){return false;}
}

/* ---- SCHERM: battlePlayerLobby ---- */
SCREENS.battlePlayerLobby = function(){
  bmApplyTheme(BM_META?.theme);
  const myClass=BM_MY_CLASS||BM_PLAYERS[BM_PID]?.class||null;
  const fac=bmFaction(BM_META?.theme);
  H(brand(false)+`
  <div class="scrhead"><button class="back" onclick="cleanup();bmLeave();go('battleHome')">${iconSVG("shield",20,"currentColor")}</button><h2>${esc(fac.nm)}</h2></div>
  <div class="panel" style="display:flex;gap:14px;align-items:center">
    ${renderPixelHeroIcon(BM_IDENT?.avatar,56)}
    <div style="flex:1;min-width:0">
      <div style="display:flex;align-items:center;gap:6px;min-width:0">
        <div style="font-size:18px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(BM_IDENT?.name||"")}</div>
        <button class="chip" onclick="bmRenameSelf('battlePlayerLobby')" title="Wijzig de naam die je klasgenoten zien" style="flex:0 0 auto;padding:3px 9px">✏️ Naam</button>
      </div>
      <div class="pill" style="margin:4px 0">Niveau ${bmCalcLevel(BM_IDENT?.xp||0).level} · ${esc(bmCalcLevel(BM_IDENT?.xp||0).title)}</div>
      <div class="note">Code: ${BM_CODE}</div>
    </div>
    <button class="btn" onclick="go('battleAvatarEdit')" title="Avatar aanpassen" style="flex:0 0 auto;padding:6px 10px">${iconSVG("column",18,"currentColor")}</button>
  </div>
  <div class="panel">
    <div class="eyebrow l">Kies je klasse</div>
    <div class="note" style="margin-bottom:8px">${myClass?`Je speelt als <b>${esc(bmClsName(myClass))}</b>. Wisselen mag, zolang het gevecht nog niet begonnen is.`:"Wisselen mag zo vaak je wilt — zodra het gevecht begint ligt je keuze vast."}</div>
    ${BM_CLASSES.map(c=>{
      const sel=myClass===c.id;
      const ms=bmCalcMastery(BM_IDENT?.classHistory?.[c.id]);
      return `<button class="tile" style="margin-bottom:8px;padding:12px 14px${sel?";border:2px solid "+c.color:""}" onclick="bmPickClass('${c.id}')">
        <div style="display:flex;align-items:flex-start;gap:12px">
          ${iconSVG(c.icon,30,c.color)}
          <div style="flex:1">
            <div style="font-size:15px;font-weight:700;color:${c.color}">${c.nm} <span style="font-size:11px;opacity:.7">${bmStars(ms)}</span></div>
            <div class="note" style="margin:2px 0">⚡ ${c.passive.desc}${ms>=3?" · +1 BE":""}</div>
            <div style="display:flex;flex-wrap:wrap;gap:3px;margin-top:4px">
              ${c.abilities.map(a=>`<span class="pill" style="font-size:10px">${a.nm}&nbsp;${bmGetAbilityCost(c,a)}BE</span>`).join("")}
            </div>
          </div>
          ${sel?`<span style="font-size:20px;align-self:center">✅</span>`:""}
        </div>
      </button>`;
    }).join("")}
  </div>
  <div class="note" style="text-align:center">Wachten tot de docent het gevecht start…</div>
  ${foot()}`);
  // scoped: alleen state/status
  const rSt=fbDB.ref("rooms/"+BM_CODE+"/state/status");
  const fSt=rSt.on("value",s=>{if(s.val()==="playing"){rSt.off("value",fSt);go("battlePlayerGame");}});
  BM_UNSUBS=[()=>rSt.off("value",fSt)];
};
function bmPickClass(cid){
  // In de lobby mag je zo vaak wisselen als je wilt. Zodra het gevecht loópt
  // ligt de keuze vast: class mastery telt rondes, schade en heling per klásse
  // op, en wie halverwege wisselt schrijft zijn bijdrage aan de verkeerde
  // klasse bij. Wie op dat moment nog géén klasse heeft — vergeten in de lobby,
  // of later ingestroomd — krijgt dus precies één keuze.
  // De huidige stand komt uit Firebase (players/{pid}/class) en niet alleen uit
  // de lokale variabele, zodat een herladen tabblad 'm ook kent.
  const inGevecht=_screen==="battlePlayerGame";
  const huidig=BM_PLAYERS[BM_PID]?.class||BM_MY_CLASS;
  if(inGevecht&&huidig){
    if(huidig!==cid) toast("Klasse ligt vast","Je speelt dit gevecht als "+bmClsName(huidig)+". Wisselen kan alleen in de lobby, vóór het gevecht begint.");
    return;
  }
  BM_MY_CLASS=cid;
  BM_MY_CLASS_PICKS++;
  // mastery-bonus: ★★★+ geeft +1 starting BE (minimale spelbonus)
  const ms=bmCalcMastery(BM_IDENT?.classHistory?.[cid]);
  // Verborgen traits: alleen als vlag op het player-node te lezen voor de
  // host (bmCalcAbilityEffect/bmRespawnProgress draaien host-side en kennen
  // BM_IDENT niet) — zelfde reden waarom masteryBonus al zo werkt.
  const achs=BM_IDENT?.achievements||[];
  fbDB.ref("rooms/"+BM_CODE+"/players/"+BM_PID).update({
    class:cid, masteryBonus:ms>=3?1:0,
    traitLaconisch:achs.includes("trait_laconisch"),
    traitFeniks:achs.includes("trait_feniks"),
    traitHeal:achs.includes("geheim_heal"),
    traitGroot:achs.includes("geheim_groot"),
    traitNorage:achs.includes("geheim_norage"),
    traitPacifist:achs.includes("trait_pacifist"),
  });
  toast("Klasse gekozen",bmClsName(cid)+(ms>=3?" · +1 BE mastery-bonus":""));
  // Ook bruikbaar tijdens een lopend gevecht (late instappers kiezen daar hun
  // klasse) — dan het spelerspaneel verversen i.p.v. terug naar de lobby.
  if(_screen==="battlePlayerGame") bmPlayerRender();
  else SCREENS.battlePlayerLobby();
}

/* ---- SCHERM: battlePlayerGame ---- */
SCREENS.battlePlayerGame = function(){
  bmApplyTheme(BM_META?.theme);
  BM_ANSWERED=false;BM_ACTION_LOCKED=false;BM_MY_BE=0;BM_MY_Q=null;
  BM_FIELD_SOLO=true; _bmFormHash="";   // alleen de eigen held op dit toestel
  H(`<div class="bm-player-wrap">
    <div class="bm-player-field" style="position:relative">
      <div id="bmField" class="${bmBgTheme(BM_META?.theme)} bm-field-solo" style="${bmArenaBgStyle()}">
        <div id="bmFormA" class="bm-form"></div>
        <div id="bmFormB" class="bm-form"></div>
        <div id="bmBfx"></div>
      </div>
      <button class="bm-back-btn" onclick="cleanup();bmLeave();go('battleHome')" title="Verlaat gevecht">
        ${iconSVG("shield",16,"currentColor")}
      </button>
    </div>
    <div class="bm-player-panel" id="bmPR"></div>
  </div>`);
  // Spelers-listener voor sprites op slagveld
  const rP=fbDB.ref("rooms/"+BM_CODE+"/players"),
    fP=rP.on("value",s=>{BM_PLAYERS=s.val()||{};bmBuildBattlefield();});
  const rR=fbDB.ref("rooms/"+BM_CODE+"/state/round"),
    fR=rR.on("value",s=>{BM_STATE.round=s.val()||{};bmPlayerRender();});
  const rSt=fbDB.ref("rooms/"+BM_CODE+"/state/status"),
    fSt=rSt.on("value",s=>{
      BM_STATE.status=s.val();
      if(BM_STATE.status==="finished"){
        fbDB.ref("rooms/"+BM_CODE+"/state/winner").once("value").then(ws=>{BM_STATE.winner=ws.val();cleanup();go("battleResult");});
      } else if(BM_STATE.status==="lobby"){
        // De docent heeft een nieuw gevecht klaargezet. Normaal ziet een
        // leerling eerst het resultaatscherm (en krijgt daar zijn XP), maar als
        // dit toestel de tussenliggende "finished"-stand mist — even geen
        // netwerk, scherm op slot — zou het hier blijven hangen zonder vragen.
        bmResetMatchLocals(); cleanup(); go("battlePlayerLobby");
      }
    });
  const rM=fbDB.ref("rooms/"+BM_CODE+"/players/"+BM_PID),
    fM=rM.on("value",s=>{const p=s.val();if(p){BM_MY_BE=p.be||0;BM_MY_CLASS=p.class||null;BM_MY_TEAM=p.team||null;BM_ACTION_LOCKED=!!p.lockedAction;BM_ANSWERED=p.answeredRound===(BM_STATE.round?.n);BM_MY_CORRECT=p.correct||0;BM_MY_WRONG=p.wrong||0;BM_MY_DMG=p.damage||0;BM_MY_HEAL=p.healing||0;}bmPlayerRender();});
  const rT=fbDB.ref("rooms/"+BM_CODE+"/teams"),
    fT=rT.on("value",s=>{BM_TEAMS=s.val()||{};bmPlayerRender();});
  const rBoss=fbDB.ref("rooms/"+BM_CODE+"/boss"),
    fBoss=rBoss.on("value",s=>{BM_BOSS=s.val()||{};bmBuildBattlefield();});
  BM_UNSUBS=[()=>rP.off("value",fP),()=>rR.off("value",fR),()=>rSt.off("value",fSt),()=>rM.off("value",fM),()=>rT.off("value",fT),()=>rBoss.off("value",fBoss)];
  bmSubscribeLog(BM_CODE);
  bmBuildBattlefield();
};
function bmPlayerRender(){
  const root=el("bmPR"); if(!root)return;
  const round=BM_STATE.round||{};
  // Nieuwe ronde → doelwit terug naar de baas (handlangers kunnen intussen
  // gewisseld/gestorven zijn, zie Minion Summon BOSS_BATTLE.md §4).
  if(round.n!==BM_TARGET_ROUND){ BM_TARGET_ROUND=round.n; BM_MY_TARGET="boss"; }
  const tl=round.deadline?Math.max(0,Math.round((round.deadline-Date.now())/1000)):0;
  const tA=BM_TEAMS.A||{health:100,maxHealth:100},tB=BM_TEAMS.B||{health:100,maxHealth:100};
  // Percentage i.p.v. het absolute getal: de twee legers kunnen sinds bmTeamHP()
  // een heel verschillende maximale sterkte hebben (het kleinste team krijgt er
  // meer), en dan zeggen "10000" en "100" naast elkaar niets. Het aandeel wel.
  function miniBar(nm,team,d){
    const frac=d.maxHealth?Math.max(0,Math.min(1,d.health/d.maxHealth)):0;
    const col=team==="A"?"var(--teamA)":"var(--teamB)";
    const crit=frac<0.25;
    return `<div class="bm-mini-hp">
      <span class="bm-mini-nm" style="color:${col}">${nm} <span class="bm-mini-cnt">${bmTeamCount(team)}</span></span>
      <div class="bm-mini-track">
        <div class="bm-mini-fill" style="background:${col};transform:scaleX(${frac})"></div>
      </div><span class="bm-mini-pct"${crit?' style="color:#e07060"':""}>${Math.round(frac*100)}%</span>
    </div>`;
  }
  let content="";
  if(round.phase==="question"){
    if(BM_ANSWERED){
      // Uitslag blijven tonen: vraag + antwoorden met groen/rood, en een
      // duidelijke regel erboven. Zonder dit verving deze hertekening de
      // markering meteen door een leeg wachtscherm en wist een leerling niet
      // eens dat hij fout zat.
      const showFb=BM_MY_Q&&BM_MY_Q._round===round.n&&BM_MY_PICK!==null&&BM_MY_PICK_ROUND===round.n;
      if(showFb){
        const goed=(BM_MY_Q.options||[])[BM_MY_Q.correctIdx]||"";
        const pen=(typeof BM_WRONG_BE_PENALTY==="number"?BM_WRONG_BE_PENALTY:2);
        const banner=BM_MY_PICK_OK
          ? `<div class="bm-fb ok">✅ Goed!</div>`
          : `<div class="bm-fb bad">❌ Fout — het juiste antwoord is <b>${esc(goed)}</b><br>
             <span>Je verliest ${pen} BE${BM_MY_BE<2?" en kunt deze ronde niets doen":""}.</span></div>`;
        const lang=BM_META?.lang==="el"?"Griekse":"Latijnse";
        content=`
        ${banner}
        <div class="qcard">
          <div class="kick">Vertaal het ${lang} woord</div>
          <div class="word">${esc(BM_MY_Q.la)}</div>
          ${BM_MY_Q.pos?`<div class="pos">${esc(BM_MY_Q.pos)}</div>`:""}
        </div>
        <div class="choices">
          ${(BM_MY_Q.options||[]).map((opt,i)=>{
            const cl=i===BM_MY_Q.correctIdx?"correct":(i===BM_MY_PICK?"wrong":"dim");
            return `<button class="choice ${cl}" disabled><span class="n">${i+1}</span>${esc(opt)}</button>`;
          }).join("")}
        </div>
        <div class="note" style="text-align:center;margin-top:8px">Wachten op andere spelers…</div>`;
      } else {
        content=`<div class="panel" style="text-align:center"><div style="font-size:40px">✅</div><div class="note">Wachten op andere spelers…</div></div>`;
      }
    } else if(!BM_MY_Q||BM_MY_Q._round!==round.n){
      fbDB.ref("rooms/"+BM_CODE+"/players/"+BM_PID+"/currentQ").once("value").then(s=>{
        if(s.val()){try{BM_MY_Q={...JSON.parse(s.val()),_round:round.n};BM_ANSWERED=false;bmPlayerRender();}catch(e){}}
      });
      content=`<div class="note" style="text-align:center">Vraag laden…</div>`;
    } else {
      const lang=BM_META?.lang==="el"?"Griekse":"Latijnse";
      content=`
      <div class="qcard">
        <div class="kick">Vertaal het ${lang} woord</div>
        <div class="word">${esc(BM_MY_Q.la)}</div>
        ${BM_MY_Q.pos?`<div class="pos">${esc(BM_MY_Q.pos)}</div>`:""}
      </div>
      <div class="choices">
        ${(BM_MY_Q.options||[]).map((opt,i)=>`
          <button class="choice" id="bmC${i}" onclick="bmAnswer(${i})">
            <span class="n">${i+1}</span>${esc(opt)}
          </button>`).join("")}
      </div>`;
    }
  } else if(round.phase==="action"){
    if(BM_ACTION_LOCKED){
      content=`<div class="panel" style="text-align:center"><div style="font-size:40px">⚔️</div><div class="note">Actie vergrendeld — resolutie volgt…</div></div>`;
    } else {
      const cls=BM_CLASSES.find(c=>c.id===BM_MY_CLASS);
      if(!cls){
        // Geen klasse gekozen — late instapper, of iemand die het in de lobby
        // vergat. Die stond hier voorheen met een lege melding en kon een heel
        // gevecht lang niets doen. Nu: alsnog een klasse kiezen (dat mag ook
        // midden in een gevecht) én meteen de basisacties, zodat deze ronde
        // niet verloren is.
        content=`<div class="panel">
          <div class="note" style="margin-bottom:8px">Je hebt nog geen klasse gekozen. Kies er hieronder één — dat kan gewoon nu — of doe deze ronde een basisactie.</div>
          <div class="chips" style="margin-bottom:10px">
            ${BM_CLASSES.map(c=>`<button class="chip" style="border-color:${c.color}66" onclick="bmPickClass('${c.id}')">${esc(c.nm)}</button>`).join("")}
          </div>
          ${bmBasicActionsHTML()}
        </div>`;
      } else {
        const teamClasses=BM_TEAMS[BM_MY_TEAM||"A"]?.classes||[];
        const availCombos=BM_META?.combos===false?[]:BM_COMBOS.filter(combo=>
          combo.classes.includes(BM_MY_CLASS)&&
          combo.classes.some(c=>c!==BM_MY_CLASS&&teamClasses.includes(c))
        );
        const tierDot=t=>t==="basic"?"●":t==="medium"?"●●":"●●●";
        const inspired=BM_META?.mode==="boss"&&BM_PLAYERS[BM_PID]?.inspired;
        // Minion Summon (BOSS_BATTLE.md §4): doelwit-chips alleen tonen als
        // er nog levende handlangers zijn — daarbuiten heeft "kiezen" geen zin.
        const liveMinions=(BM_META?.mode==="boss"&&(BM_BOSS.minions||[]).filter(m=>m.hp>0))||[];
        const targetPicker=liveMinions.length?`<div style="margin-bottom:8px">
          <div class="note" style="margin-bottom:4px">🎯 Doelwit</div>
          <div class="chips">
            <button class="chip ${BM_MY_TARGET==="boss"?"on":""}" onclick="bmSetTarget('boss')">Baas</button>
            ${liveMinions.map((m,i)=>`<button class="chip ${BM_MY_TARGET===m.id?"on":""}" onclick="bmSetTarget('${m.id}')">Handlanger ${i+1} (${m.hp} HP)</button>`).join("")}
          </div>
        </div>`:"";
        content=`<div class="panel">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
            <span style="font-weight:700;color:${cls.color}">${cls.nm}</span>
            <span style="color:var(--hi-bright)">⚡ ${BM_MY_BE}/${BM_BE_MAX} BE — ${tl}s</span>
          </div>
          ${(()=>{
            // Niets te doen deze ronde: meestal doordat een fout antwoord BE
            // kostte. Benoem dat, anders lijken de vaardigheden gewoon stuk.
            const goedkoopste=Math.min(...cls.abilities.map(a=>bmGetAbilityCost(cls,a)));
            if(BM_MY_BE>=goedkoopste) return "";
            const foutDezeRonde=BM_MY_PICK_ROUND===round.n&&BM_MY_PICK!==null&&!BM_MY_PICK_OK;
            return `<div class="bm-fb bad" style="margin-bottom:8px">⚠️ Te weinig BE voor je vaardigheden${foutDezeRonde?" — je antwoord was fout":""}.<br>
              <span>Je hebt ${BM_MY_BE} BE, je goedkoopste vaardigheid kost ${goedkoopste}. Je kunt wel een basisactie doen.</span></div>
              ${bmBasicActionsHTML("Basisacties — gratis")}`;
          })()}
          ${inspired?`<div class="note" style="color:var(--hi-bright);margin-bottom:6px">⚡ Geïnspireerd! Je volgende aanval doet extra schade.</div>`:""}
          ${targetPicker}
          ${cls.abilities.map(a=>{
            const cost=bmGetAbilityCost(cls,a);
            const ok=BM_MY_BE>=cost;
            return `<button class="tile" style="margin-bottom:6px;padding:11px 13px${ok?"":";opacity:.4;pointer-events:none"}" onclick="bmChooseAbility('${a.id}',${cost})">
              <div style="font-size:13px;font-weight:700">${a.nm} <span class="pill">${cost}&nbsp;BE</span> <span style="opacity:.6;font-size:10px">${tierDot(a.tier)}</span></div>
              <div class="note" style="margin-top:2px">${a.desc}</div>
              ${a.aoe?`<div class="note" style="color:var(--hi);margin-top:2px">🌪️ Raakt alle doelen — doelwitkeuze maakt hier niet uit</div>`:""}
            </button>`;
          }).join("")}
          ${availCombos.map(combo=>{
            const ok=BM_MY_BE>=combo.cost;
            const partnerNm=BM_CLASSES.find(c=>c.id===combo.classes.find(x=>x!==BM_MY_CLASS))?.nm||"";
            return `<button class="tile" style="margin-bottom:6px;padding:11px 13px;border:1px solid var(--hi)${ok?"":";opacity:.4;pointer-events:none"}" onclick="bmChooseCombo('${combo.id}',${combo.cost})">
              <div style="font-size:13px;font-weight:700">⚡ ${combo.nm} <span class="pill">${combo.cost}&nbsp;BE</span></div>
              <div class="note" style="margin-top:2px">${combo.desc}</div>
              <div class="note" style="color:var(--hi);margin-top:2px">Vraag ${esc(partnerNm)} ook Combo te kiezen!</div>
            </button>`;
          }).join("")}
          <div class="note" style="margin-top:6px">Geen keuze = BE sparen voor de volgende ronde.</div>
        </div>`;
      }
    }
  } else {
    content=`<div class="panel" style="text-align:center"><div class="note">Resolutie…</div></div>`;
  }
  root.innerHTML=`
  <div class="bm-mini-row">
    ${miniBar(bmTeamNm("A"),"A",tA)}
    <span class="bm-mini-vs">⚔</span>
    ${miniBar(bmTeamNm("B"),"B",tB)}
  </div>
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
    <span class="pill">Ronde ${round.n||"—"}</span>
    <span style="color:var(--hi-bright)">⚡ ${BM_MY_BE} BE</span>
    <span style="color:var(--muted)">${tl}s</span>
  </div>
  ${bmAdaptiveHintHTML()}
  ${content}`;
}
function bmWordKey(w){ return (w||"").replace(/[.#$\[\]\/]/g,"_").substring(0,80); }
function bmAnswer(idx){
  if(BM_ANSWERED||!BM_MY_Q)return;
  BM_ANSWERED=true;
  const ok=idx===BM_MY_Q.correctIdx;
  // Onthouden voor bmPlayerRender(): de spelers-listener hertekent het paneel
  // meteen na het antwoord, en daarmee verdween voorheen de rood/groen-
  // markering vóórdat een leerling 'm gezien had. Nu blijft de uitslag de hele
  // vraagfase staan, mét het juiste antwoord erbij.
  BM_MY_PICK=idx; BM_MY_PICK_OK=ok; BM_MY_PICK_ROUND=BM_STATE.round?.n;
  [0,1,2,3].forEach(i=>{
    const c=el("bmC"+i);if(!c)return;
    if(i===BM_MY_Q.correctIdx)c.classList.add("correct");
    else if(i===idx&&!ok)c.classList.add("wrong");
    else c.classList.add("dim");
    c.disabled=true;
  });
  beep(ok?"good":"bad");
  bmAnimAv(BM_PID,ok?"anim-ok":"anim-bad",600);
  const round=BM_STATE.round||{};
  const at=BM_META?.answerTimer||10;
  const timeLeft=round.deadline?Math.max(0,(round.deadline-Date.now())/1000):0;
  const fast=ok&&timeLeft>at/2;
  const cls=BM_CLASSES.find(c=>c.id===BM_MY_CLASS);
  let beGain=ok?3:0;
  // Fout antwoord kost BE (BM_WRONG_BE_PENALTY, battle-data.js). Voorheen
  // leverde fout simpelweg 0 BE op — geen zichtbare consequentie, en met de
  // ruime BE-toevoer merkte een leerling er niets van. Kom je hierdoor onder
  // de prijs van je goedkoopste vaardigheid, dan kun je deze ronde inderdaad
  // niet aanvallen; dat is de bedoeling.
  if(!ok) beGain=-(typeof BM_WRONG_BE_PENALTY==="number"?BM_WRONG_BE_PENALTY:2);
  if(fast){ beGain+=cls?.passive?.type==="be_on_fast"?cls.passive.val:1; }
  // Ciceronianus: opeenvolgende correcte antwoorden in de laatste 5 sec van de timer
  const clutch=ok&&timeLeft<=5;
  if(clutch){ BM_MY_CLUTCH_STREAK++; BM_MY_CLUTCH_BEST=Math.max(BM_MY_CLUTCH_BEST,BM_MY_CLUTCH_STREAK); }
  else BM_MY_CLUTCH_STREAK=0;
  if(fast&&(BM_IDENT?.achievements||[]).includes("trait_ciceronianus")) beGain+=1;
  // Responstijd meten (ms verstreken sinds start vraagfase)
  const elapsedMs=Math.max(200,at*1000-Math.max(0,round.deadline?round.deadline-Date.now():0));
  fbDB.ref("rooms/"+BM_CODE+"/players/"+BM_PID).once("value").then(s=>{
    const p=s.val()||{};
    const upd={
      answeredRound:round.n||0,
      be:bmClampBE((p.be||0)+beGain),
      // Uitslag van deze ronde — bmDistributeQs() geeft de passieve
      // rondebonus alleen ná een goed antwoord (zie daar).
      lastAnswerOk:ok, lastAnswerRound:round.n||0,
      correct:ok?(p.correct||0)+1:(p.correct||0),
      wrong:!ok?(p.wrong||0)+1:(p.wrong||0),
      totalResponseMs:(p.totalResponseMs||0)+elapsedMs,
      respondCount:(p.respondCount||0)+1,
    };
    // Inspiratie van Athena (Boss Battle, BOSS_BATTLE.md §5.3): na 3
    // opeenvolgende foute antwoorden geeft het eerstvolgende goede antwoord
    // een gemarkeerde bonus op de eerstvolgende gebruikte ability (bmResolve()).
    if(BM_META?.mode==="boss"){
      const prevWrongStreak=p.wrongStreak||0;
      if(ok){
        upd.wrongStreak=0;
        if(prevWrongStreak>=3) upd.inspired=true;
      } else {
        upd.wrongStreak=prevWrongStreak+1;
      }
      // "De Onsterfelijke" (Boss-Battle-scorebord, BOSS_BATTLE.md §8):
      // langste foutloze reeks. Symmetrisch aan wrongStreak hierboven.
      const prevCorrectStreak=p.correctStreak||0;
      upd.correctStreak=ok?prevCorrectStreak+1:0;
      upd.bestCorrectStreak=Math.max(p.bestCorrectStreak||0, upd.correctStreak);
    }
    if(!ok&&BM_MY_Q){
      // Gemist woord bijhouden voor analytics (host leest na afloop) én voor
      // de adaptieve pool. "due" (bmPersonalPool()) laat het woord pas na een
      // oplopend aantal rondes weer extra gewicht krijgen — 1 ronde na de
      // eerste fout, 2 na de tweede, 3 na de derde e.v. — i.p.v. mogelijk de
      // eerstvolgende ronde alweer, zodat er echt sprake is van spreiding.
      const wk=bmWordKey(BM_MY_Q.la);
      const prev=p.missed?.[wk]||{c:0};
      const newC=(prev.c||0)+1;
      upd["missed/"+wk+"/c"]=newC;
      upd["missed/"+wk+"/p"]=BM_MY_Q.la;
      upd["missed/"+wk+"/a"]=BM_MY_Q.options?.[BM_MY_Q.correctIdx]||"";
      upd["missed/"+wk+"/due"]=(round.n||0)+Math.min(newC,3);
    }
    // Heldenmodus: gevallen held vult zijn herrijzingsmeter met goede antwoorden
    if(ok){
      const rs=bmRespawnProgress(p);
      if(rs){ Object.assign(upd,rs.upd); if(rs.revived){ beep("win"); toast("Je held herrijst!","Terug in de strijd met volle HP.",medalSVG("laurel",34)); } }
    }
    fbDB.ref("rooms/"+BM_CODE+"/players/"+BM_PID).update(upd);
  });
}
/* Knoppenrij met de basisacties (BM_BASIC_ACTIONS, battle-data.js). Iedereen
   kan ze doen, ze kosten niets en ze zijn zwak — ze bestaan alleen zodat
   niemand een ronde werkloos toekijkt. */
function bmBasicActionsHTML(kop){
  return `<div class="note" style="margin-bottom:4px">${esc(kop||"Basisacties — gratis, voor iedereen")}</div>
    ${BM_BASIC_ACTIONS.map(a=>`
      <button class="tile" style="margin-bottom:6px;padding:10px 13px" onclick="bmChooseAbility('${a.id}',0)">
        <div style="font-size:13px;font-weight:700">${esc(a.nm)} <span class="pill">gratis</span></div>
        <div class="note" style="margin-top:2px">${esc(a.desc)}</div>
      </button>`).join("")}`;
}
function bmSetTarget(id){ BM_MY_TARGET=id; bmPlayerRender(); }
function bmChooseAbility(abilityId,cost){
  if(BM_ACTION_LOCKED||BM_MY_BE<cost)return;
  BM_ACTION_LOCKED=true;
  BM_MY_ABILITIES_USED++;
  const cls=BM_CLASSES.find(c=>c.id===BM_MY_CLASS);
  const abl=cls?.abilities.find(a=>a.id===abilityId)
         || BM_BASIC_ACTIONS.find(a=>a.id===abilityId);
  if(abl&&BM_DMG_TYPES.includes(abl.type)) BM_MY_DEALT_DMG_ABILITY=true; // trait_pacifist
  // Minion Summon (BOSS_BATTLE.md §4): doelwit meegeven zolang er handlangers
  // leven; buiten Boss Battle of zonder handlangers is "boss" het enige zinnige.
  fbDB.ref("rooms/"+BM_CODE+"/players/"+BM_PID).update({lockedAction:{type:"ability",abilityId,cost,target:BM_MY_TARGET}});
  toast("Actie vergrendeld",abl?.nm||abilityId);
  bmPlayerRender();
}
function bmChooseCombo(comboId,cost){
  if(BM_ACTION_LOCKED||BM_MY_BE<cost)return;
  BM_ACTION_LOCKED=true;
  BM_MY_ABILITIES_USED++;
  fbDB.ref("rooms/"+BM_CODE+"/players/"+BM_PID).update({lockedAction:{type:"combo",comboId,cost}});
  toast("Combo aangekondigd!",BM_COMBOS.find(c=>c.id===comboId)?.nm||comboId);
  bmPlayerRender();
}

/* ---- SCHERM: battleResult ---- */
// Zet de per-gevecht-tellers van deze leerling terug op nul. Wordt gebruikt
// als de docent een nieuw gevecht met dezelfde spelers start: de speler blijft
// ingelogd in dezelfde kamer, maar begint wel met een schone lei.
function bmResetMatchLocals(){
  BM_ANSWERED=false;BM_ACTION_LOCKED=false;BM_RESOLVING=false;BM_MY_TARGET="boss";
  BM_MY_BE=0;BM_MY_Q=null;
  BM_MY_CORRECT=0;BM_MY_WRONG=0;BM_MY_DMG=0;BM_MY_HEAL=0;
  BM_MY_CLUTCH_STREAK=0;BM_MY_CLUTCH_BEST=0;BM_MY_ABILITIES_USED=0;
  BM_MY_CLASS_PICKS=0;BM_MY_DEALT_DMG_ABILITY=false;
  BM_MY_PICK=null;BM_MY_PICK_OK=false;BM_MY_PICK_ROUND=-1;
  BM_STATE={};BM_TEAMS={};BM_BOSS={};_bmFormHash="";_bmRankRound=-1;_bmRankMap={};
}

/* Telt een getal in beeld op van `from` naar `to`. Staan animaties uit (of is
   er niets te tellen), dan verschijnt de eindwaarde meteen. */
function bmCountTo(id,from,to,ms,prefix){
  const e=el(id); if(!e)return;
  const fin=()=>{e.textContent=(prefix||"")+to;};
  if(BM_META?.animations===false||from===to||typeof requestAnimationFrame!=="function"){fin();return;}
  const t0=performance.now();
  (function step(t){
    if(!document.body.contains(e))return;
    const p=Math.min(1,(t-t0)/ms);
    const v=Math.round(from+(to-from)*(1-Math.pow(1-p,3)));  // ease-out
    e.textContent=(prefix||"")+v;
    if(p<1)requestAnimationFrame(step); else fin();
  })(t0);
}

/* Toont de XP- en muntenwinst als "huidig + verdiend = nieuw totaal", met de
   getallen live oplopend. Leerlingen zagen voorheen alleen een kaal eindgetal
   (of een leeg vak) en klikten weg vóór de uitkering rond was. */
function bmRenderXpGain(r){
  const box=el("bmXpResult"); if(!box)return;
  const oldXp=r.oldXp??0, newXp=r.newXp??oldXp+(r.xpEarned||0);
  const oldCo=r.oldCoins??0, newCo=r.newCoins??oldCo+(r.coinsEarned||0);
  const coinNm=bmCoinName();
  const barOld=xpBarInfo(r.oldLv||bmCalcLevel(oldXp));
  const barNew=xpBarInfo(r.newLv||bmCalcLevel(newXp));
  box.innerHTML=`
    <div class="bm-gain">
      <div class="bm-gain-row">
        <span class="bm-gain-ic">⚡</span>
        <span class="bm-gain-old">${oldXp}</span>
        <span class="bm-gain-plus" id="bmGainXpPlus">+0</span>
        <span class="bm-gain-arrow">→</span>
        <span class="bm-gain-new" id="bmGainXpNew">${oldXp}</span>
        <span class="bm-gain-lbl">XP</span>
      </div>
      <div class="bm-xpbar"><div class="bm-xpbar-fill" id="bmGainBar" style="width:${barOld.pct}%"></div></div>
      <div class="note" id="bmGainBarLbl">Niveau ${(r.oldLv||{}).level||1} · ${esc((r.oldLv||{}).title||"")}</div>
      <div class="bm-gain-row" style="margin-top:12px">
        <span class="bm-gain-ic">🪙</span>
        <span class="bm-gain-old">${oldCo}</span>
        <span class="bm-gain-plus" id="bmGainCoPlus">+0</span>
        <span class="bm-gain-arrow">→</span>
        <span class="bm-gain-new" id="bmGainCoNew">${oldCo}</span>
        <span class="bm-gain-lbl">${esc(coinNm)}</span>
      </div>
      ${(r.share!==undefined&&r.share<0.999)?`<div class="note" style="margin-top:8px">Je stapte in vanaf ronde ${r.joinRound} van ${r.rounds}, dus je deelname- en winstbonus tellen naar rato. Je goede antwoorden tellen gewoon volledig mee.</div>`:""}
      <div id="bmGainExtra"></div>
    </div>`;
  const dur=(BM_META?.animations===false)?0:1100;
  bmCountTo("bmGainXpPlus",0,r.xpEarned||0,dur,"+");
  bmCountTo("bmGainXpNew",oldXp,newXp,dur);
  setTimeout(()=>{
    bmCountTo("bmGainCoPlus",0,r.coinsEarned||0,dur,"+");
    bmCountTo("bmGainCoNew",oldCo,newCo,dur);
  },dur?350:0);
  // XP-balk: bij niveau-omhoog eerst vol laten lopen, dan verder op het nieuwe niveau
  const bar=el("bmGainBar"), lbl=el("bmGainBarLbl");
  const setLbl=lv=>{ if(lbl) lbl.textContent="Niveau "+lv.level+" · "+(lv.title||""); };
  if(bar){
    if(!dur){ bar.style.width=barNew.pct+"%"; setLbl(r.newLv||{level:1,title:""}); }
    else if(r.levelUp){
      requestAnimationFrame(()=>{bar.style.width="100%";});
      setTimeout(()=>{
        bar.style.transition="none"; bar.style.width="0%";
        setLbl(r.newLv||{level:1,title:""});
        requestAnimationFrame(()=>{bar.style.transition=""; bar.style.width=barNew.pct+"%";});
      },dur);
    } else {
      requestAnimationFrame(()=>{bar.style.width=barNew.pct+"%";});
    }
  }
  // Niveau-omhoog, eerbewijzen en legendarische bonus komen ná het tellen
  setTimeout(()=>{
    const ex=el("bmGainExtra"); if(!ex)return;
    const lvUp=r.levelUp?`<div class="bm-gain-lvup">🎉 Niveau omhoog! Je bent nu ${esc(r.newLv.title)} (${r.newLv.level})</div>`:"";
    const achHTML=(r.earned||[]).length?`<div style="margin-top:6px;color:var(--hi)">${r.earned.map(id=>{const a=ACHIEVEMENTS_DEF.find(x=>x.id===id);return a?"🏅 "+esc(a.nm):""}).join(" · ")}</div>`:"";
    const legHTML=r.legendaryBonus?`<div style="margin-top:4px;font-size:12px;color:var(--hi)">⚡ ${esc(r.legendaryBonus.nm)}-bonus: ${esc(r.legendaryBonus.desc)}</div>`:"";
    ex.innerHTML=lvUp+achHTML+legHTML;
  },dur?dur+300:0);
  (r.earned||[]).forEach(id=>{const a=ACHIEVEMENTS_DEF.find(x=>x.id===id); if(a)toastAch(a);});
}

SCREENS.battleResult = function(){
  const w=BM_STATE.winner;
  H(brand(false)+`
  <div class="scrhead"><button class="back" onclick="bmLeave();go('home')">${iconSVG("shield",20,"currentColor")}</button><h2>Gevecht voorbij</h2></div>
  <div class="panel" style="text-align:center">
    <div style="font-size:56px">${w==="A"||w==="B"?iconSVG(bmTeamIcon(w),56,"var(--team"+w+")"):"⚔️"}</div>
    <h2 style="color:var(--hi-bright);margin:8px 0">${w==="A"||w==="B"?esc(bmTeamNm(w))+" wint!":"Gevecht gestopt"}</h2>
  </div>
  <div id="bmXpResult" class="panel" style="text-align:center;color:var(--muted)">
    <div style="font-size:15px;color:var(--hi-bright)">⚡ Je XP en ${esc(bmCoinName())} worden bijgeschreven…</div>
    <div class="note" style="margin-top:4px">Blijf even op dit scherm.</div>
  </div>
  <div class="note" style="text-align:center;margin-top:10px">Blijf hier als de docent nog een gevecht start — je springt dan vanzelf terug naar de lobby.</div>
  <button class="btn btn-gold btn-block lg" id="bmResHome" style="margin-top:14px" disabled onclick="bmLeave();go('home')">Terug naar hoofdmenu</button>
  <button class="btn btn-block" id="bmResProfile" style="margin-top:8px" disabled onclick="bmLeave();go('battleProfile')">Mijn profiel bekijken</button>
  ${foot()}`);
  // De knoppen staan uit tot de uitkering rond is: wie hier wegklikt vóórdat
  // bmAwardBattle() klaar is, loopt zijn XP en munten mis.
  // … en ze gaan pas open als de teller ook echt uitgeteld is: minimaal
  // BM_RESULT_MIN_MS na binnenkomst. Het bijschrijven duurt meestal minder dan
  // een seconde, en zonder die ondergrens klikte een snelle leerling door
  // vóórdat hij zijn eigen winst had zien oplopen (de animatie loopt ~1,8 s).
  const BM_RESULT_MIN_MS=3000;
  const t0=Date.now();
  let unlocked=false;
  const unlock=()=>{
    if(unlocked)return; unlocked=true;
    setTimeout(()=>{["bmResHome","bmResProfile"].forEach(id=>{const b=el(id); if(b)b.disabled=false;});},
      Math.max(0,BM_RESULT_MIN_MS-(Date.now()-t0)));
  };
  // Vangnet: blijft de uitkering hangen (geen netwerk), dan gaan de knoppen na
  // 6 seconden alsnog open — een leerling mag nooit opgesloten raken.
  setTimeout(unlock,6000);
  bmAwardBattle().then(r=>{
    const box=el("bmXpResult");
    if(box){
      if(r&&r.alreadyAwarded){
        box.innerHTML=`<div class="note">XP en ${esc(bmCoinName())} voor dit gevecht zijn al bijgeschreven.</div>`;
      } else if(!r){
        box.innerHTML=`<div class="note">XP kon niet worden bijgeschreven — controleer je verbinding. Je voortgang uit eerdere gevechten blijft bewaard.</div>`;
      } else {
        bmRenderXpGain(r);
      }
    }
    unlock();
  }).catch(()=>{
    const b=el("bmXpResult");
    if(b)b.innerHTML=`<div class="note">XP kon niet worden bijgeschreven — controleer je verbinding.</div>`;
    unlock();
  });
  // Zet de docent een nieuw gevecht klaar met dezelfde spelers
  // (bmNewMatchSamePlayers()), dan gaat state/status terug naar "lobby". De
  // leerling hoeft dan niet opnieuw in te loggen: we springen gewoon terug
  // naar de lobby van dezelfde kamer, met naam, avatar, team en klasse intact.
  if(fbDB&&BM_CODE&&BM_PID){
    const rSt=fbDB.ref("rooms/"+BM_CODE+"/state/status");
    const fSt=rSt.on("value",snap=>{
      const st=snap.val();
      if(st!=="lobby"&&st!=="playing")return;
      rSt.off("value",fSt);
      bmResetMatchLocals();
      toast("Nieuw gevecht","De docent start een nieuw gevecht.");
      go(st==="playing"?"battlePlayerGame":"battlePlayerLobby");
    });
    BM_UNSUBS.push(()=>rSt.off("value",fSt));
  }
};

// Leerling past zelf de getoonde naam aan (bv. na een grappig-bedoelde naam).
// De inlog (klascode + leerlingcode) blijft ongewijzigd; alleen identities/.../name
// verandert. Zo hoeft een leerling geen nieuw account aan te maken.
async function bmRenameSelf(back){
  if(!BM_IDENT) return;
  const cur=BM_IDENT.name||"";
  const nm=(prompt("Kies je nieuwe naam — dit is de naam die je klasgenoten en de docent zien. \n(Je klascode en leerlingcode blijven gelijk.)",cur)||"").trim();
  if(!nm||nm===cur) return;
  if(nm.length>60){ toast("Te lang","Gebruik maximaal 60 tekens."); return; }
  BM_IDENT.name=nm;
  try{ bmIdentSave({...(bmIdentLoad()||{}),...BM_IDENT,name:nm}); }catch(e){}
  try{
    if(fbDB && BM_IDENT.klascode && BM_IDENT.leerlingcode)
      await fbDB.ref("identities/"+BM_IDENT.klascode+"/"+BM_IDENT.leerlingcode+"/name").set(nm);
  }catch(e){ toast("Niet gesynct","Naam lokaal aangepast, maar kon niet online opslaan."); }
  // Zit je al in een kamer, dan moet de naam daar óók mee — anders blijft de
  // oude naam in de lobby, op het slagveld en op het docentscherm staan.
  try{
    if(fbDB && BM_CODE && BM_PID)
      await fbDB.ref("rooms/"+BM_CODE+"/players/"+BM_PID+"/name").set(nm);
  }catch(e){}
  toast("Naam gewijzigd",nm);
  const scr=back||"battleProfile";
  if(SCREENS[scr]) SCREENS[scr]();
}

/* ---- SCHERM: battleProfile ---- */
SCREENS.battleProfile = function(){
  if(!BM_IDENT){go("battleIdentity");return;}
  const av=bmAvatarMerge(BM_IDENT.avatar);
  const xp=BM_IDENT.xp||0;
  const lv=bmCalcLevel(xp);
  const xb=xpBarInfo(lv);
  const battles=BM_IDENT.battles||0;
  const achs=BM_IDENT.achievements||[];

  const masteryHTML=BM_CLASSES.map(c=>{
    const ms=bmCalcMastery(BM_IDENT.classHistory?.[c.id]);
    return `<div style="background:${c.color}18;border:1px solid ${c.color}44;border-radius:10px;padding:8px 4px;text-align:center">
      ${iconSVG(c.icon,20,c.color)}
      <div style="font-size:9px;color:var(--muted);margin:2px 0">${esc(c.nm)}</div>
      <div style="line-height:1">${bmStars(ms)}</div>
    </div>`;
  }).join("");

  const bmAchDef=ACHIEVEMENTS_DEF.filter(a=>a.mode==="battle"||["eerste_gevecht","overwinnaar","scholar","onbreekbaar","strateeg","commandant","combokunstenaar","legendarisch"].includes(a.id));
  const bmAchievedIds=[...new Set([...achs,...(P.achievements||[])])];
  const achHTML=achGroupsHTML(bmAchDef,bmAchievedIds,a=>{
    const got=bmAchievedIds.includes(a.id);
    if(a.secret&&!got) return `<div class="bm-ach locked"><div class="aic">${iconSVG("star",22,"var(--muted2)")}</div><div class="atx"><div class="anm">🔒 ???</div><div class="ads">Geheim eerbewijs</div></div></div>`;
    return `<div class="bm-ach${got?"":" locked"}">
      <div class="aic">${got?iconSVG(a.icon,24,"var(--hi)"):iconSVG(a.icon,22,"var(--muted2)")}</div>
      <div class="atx">
        <div class="anm">${got?"":"🔒 "}${esc(a.nm)}</div>
        <div class="ads">${esc(a.ds)}</div>
      </div>
    </div>`;
  });

  const from=history.state?.from||"battleHome";
  H(brand(false)+`
  <div class="scrhead">
    <button class="back" onclick="go('${from}')">${iconSVG("shield",20,"currentColor")}</button>
    <h2>Mijn profiel</h2>
  </div>
  <div class="panel" style="display:flex;gap:14px;align-items:center">
    <div style="flex:0 0 auto">${renderPixelHeroPreview(av) || bmAvatarSVG(av,72)}</div>
    <div style="flex:1;min-width:0">
      <div style="display:flex;align-items:center;gap:6px;min-width:0">
        <div style="font-size:20px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(BM_IDENT.name||"")}</div>
        <button class="chip" onclick="bmRenameSelf()" title="Wijzig de naam die anderen zien" style="flex:0 0 auto;padding:3px 9px">✏️ Naam</button>
      </div>
      <div class="pill" style="margin:4px 0">Niveau ${lv.level} · ${esc(lv.title)}${xb.starSuffix}</div>
      <div style="font-size:12px;color:var(--muted)">${xp} XP · ${battles} gevecht${battles!==1?"en":""} · ${BM_IDENT.coins||0} 🪙 ${esc(bmCoinName())}</div>
      <div style="margin-top:6px">
        <div style="height:7px;border-radius:4px;background:rgba(0,0,0,.4);overflow:hidden">
          <div style="height:100%;width:${xb.pct}%;background:linear-gradient(90deg,var(--hi-dim),var(--hi-bright));transition:width .5s"></div>
        </div>
        <div style="font-size:10px;color:var(--hi);margin-top:2px">${xb.label}</div>
      </div>
    </div>
  </div>
  ${BM_IDENT.googleUid?`
  <div class="panel" style="text-align:center;padding:10px 16px;margin:14px 0">
    <div class="note">✅ Gekoppeld aan een Google-account</div>
    <button class="btn btn-ghost" style="font-size:13px;margin-top:8px" onclick="bmGoogleUnlink().then(()=>SCREENS.battleProfile())">Ontkoppelen</button>
  </div>
  `:`
  <div class="panel" style="text-align:center;padding:10px 16px;margin:14px 0">
    <div class="note">Koppel je Google-account om op een nieuw toestel in te loggen zonder codes te typen.</div>
    <button class="btn btn-gold" style="font-size:13px;margin-top:8px" onclick="bmGoogleLinkCurrentIdent().then(()=>SCREENS.battleProfile())">Koppel Google-account</button>
  </div>
  `}
  <button class="btn btn-gold btn-block" onclick="BM_AV_RETURN='battleProfile';go('battleAvatarEdit')" style="margin-bottom:14px">Avatar aanpassen</button>
  <div class="panel" style="display:flex;gap:14px;align-items:center;margin-bottom:14px">
    <div style="flex:0 0 auto">${(function(){const sav=spAvatarMerge(spAvatarLoadLocal());return renderPixelHeroPreview(sav)||bmAvatarSVG(sav,64);})()}</div>
    <div style="flex:1;min-width:0">
      <div style="font-weight:700">Chronica Classica Avatar</div>
      <div class="note" style="margin-top:2px">Je verschijning in Chronica Classica-gevechten, los van je Battle Mode-avatar. Uitrusting ontgrendel je door het verhaal te spelen.</div>
      <button class="btn btn-ghost" style="font-size:13px;margin-top:8px" onclick="SP_AV_RETURN='battleProfile';go('spAvatarEdit')">Chronica Classica Avatar aanpassen</button>
    </div>
  </div>
  ${(function(){
    const best = spBestStatsSlot();
    if(!best) return "";
    const cls = BM_CLASSES.find(c=>c.id===best.slot.classId);
    const pts = best.slot.skillpoints||0;
    return `<div class="panel" style="display:flex;gap:14px;align-items:center;margin-bottom:14px">
      <div style="flex:0 0 auto">${cls?iconSVG(cls.icon,36,"currentColor"):""}</div>
      <div style="flex:1;min-width:0">
        <div style="font-weight:700">Karakter Informatie — ${esc(cls?cls.nm:"")}</div>
        <div class="note" style="margin-top:2px">${pts?`${pts} statpunt${pts===1?"":"en"} te besteden.`:"Vis, Agilitas, Robur, Ingenium, Prudentia, Gratia."}</div>
        <button class="btn btn-ghost" style="font-size:13px;margin-top:8px" onclick="spResumeSlotToStats(${best.n})">Karakter Informatie bekijken</button>
      </div>
    </div>`;
  })()}
  ${spTitlesSectionHTML(spTitlesLoadLocal(), spEquippedTitleLoadLocal())}
  <div class="eyebrow l">Class Mastery</div>
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:16px">${masteryHTML}</div>
  <div class="eyebrow l">Achievements (${bmAchievedIds.filter(id=>bmAchDef.some(a=>a.id===id)).length}/${bmAchDef.length})</div>
  <div style="margin-bottom:16px">${achHTML}</div>
  ${foot()}`);
  // Ververs op de achtergrond met de laatste Firebase-stand (bv. na spelen op
  // een ander toestel) en herrender pas als er echt iets veranderd is.
  bmRefreshIdentCache("battleProfile");
};

/* ---- SCHERM: battleAvatarEdit ---- */
SCREENS.battleAvatarEdit = function(){
  // Geen actieve sessie nodig: laad identiteit uit cache (bv. vanuit 'Mijn profiel').
  if(!BM_IDENT){
    const cached=(typeof bmIdentLoad==="function")?bmIdentLoad():null;
    if(cached) BM_IDENT=cached;
    else { go("battleIdentity"); return; }
  }
  if(!BM_AV_EDIT) BM_AV_EDIT={...bmAvatarMerge(BM_IDENT.avatar)};
  const av=BM_AV_EDIT;
  // Munt-/xp-saldo op de achtergrond verversen (geen herrender, dat zou de
  // openstaande avatar-bewerking resetten) zodat aankopen altijd tegen het
  // actuele saldo worden getoetst, ook als dit toestel al even open stond.
  bmRefreshIdentCache();

  function partSection(partId){
    const part=BM_AVATAR_PARTS[partId]; if(!part)return"";
    // Kleurenkiezers: cape- én haarkleur als ronde swatches (respecteren sloten).
    const SW = partId==="capekleur"?BM_CAPEKLEUR_SWATCH
             : partId==="haarkleur"?BM_HAARKLEUR_SWATCH
             : partId==="oogkleur"?BM_OOGKLEUR_SWATCH : null;
    if(SW){
      const sw=part.opts.map(o=>{
        const key=partId+":"+o.id;
        const col=SW[o.id]||"#888";
        const locked=!bmIsUnlocked(o,BM_IDENT,key);
        const sel=av[partId]===o.id;
        if(locked){
          const req=bmReqText(o);
          return `<button title="🔒 ${esc(req?req.full:o.nm)}"
            onclick="bmShowLockInfo('${esc(o.nm)}','${esc(req?req.full:"")}')"
            style="width:34px;height:34px;border-radius:50%;background:${col};border:3px solid transparent;
            opacity:.45;cursor:help;flex:0 0 auto;display:flex;align-items:center;justify-content:center;font-size:13px">🔒</button>`;
        }
        return `<button title="${esc(o.nm)}"
          onclick="BM_AV_EDIT['${partId}']='${o.id}';SCREENS.battleAvatarEdit()"
          style="width:34px;height:34px;border-radius:50%;background:${col};
          border:3px solid ${sel?"var(--hi-bright)":"transparent"};cursor:pointer;flex:0 0 auto"></button>`;
      }).join("");
      return`<div class="eyebrow l">${esc(part.nm)}</div>
        <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:14px">${sw}</div>`;
    }
    const opts=part.opts.map(o=>{
      const key=partId+":"+o.id;
      const coinReq=o.requires&&o.requires.coins;
      const purchased=(BM_IDENT.unlocked||[]).includes(key);
      const locked=!bmIsUnlocked(o,BM_IDENT,key);
      const sel=av[partId]===o.id;
      const preview=bmAvatarSVG({...av,[partId]:o.id},38);
      // Legendarische strijders geven ook een vaste gevechtsbonus: toon 'm.
      const bonus=partId==="legendary"?BM_LEGENDARY_BONUS[o.id]:null;
      const bonusHTML=bonus?`<div class="bm-lockreq" style="color:var(--hi)">⚡ ${esc(bonus.desc)}</div>`:"";
      // Coin-onderdeel dat nog niet gekocht is: tik = koopdialoog.
      if(locked&&coinReq&&!purchased){
        return `<button class="bm-opt locked" title="Koop ${esc(o.nm)} voor ${coinReq} ${esc(bmCoinName())}${bonus?" · "+esc(bonus.desc):""}"
          onclick="bmBuyPart('${partId}','${o.id}',${coinReq},'${esc(o.nm)}')">
          ${preview}
          <div class="onm">${esc(o.nm)}</div>
          <div class="bm-lockreq">🪙 ${coinReq}</div>
          ${bonusHTML}
        </button>`;
      }
      const req=locked?bmReqText(o):null;
      if(locked&&req){
        return `<button class="bm-opt locked" title="🔒 ${esc(req.full)}"
          onclick="bmShowLockInfo('${esc(o.nm)}','${esc(req.full)}')">
          ${preview}
          <div class="onm">${esc(o.nm)}</div>
          <div class="bm-lockreq">🔒 ${esc(req.short)}</div>
        </button>`;
      }
      return `<button class="bm-opt${sel?" on":""}" title="${bonus?esc(bonus.desc):""}"
        onclick="BM_AV_EDIT['${partId}']='${o.id}';SCREENS.battleAvatarEdit()">
        ${preview}
        <div class="onm">${esc(o.nm)}</div>
        ${bonusHTML}
      </button>`;
    }).join("");
    return`<div class="eyebrow l">${esc(part.nm)}</div>
      <div class="bm-opts">${opts}</div>`;
  }

  H(brand(false)+`
  <div class="scrhead">
    <button class="back" onclick="BM_AV_EDIT=null;go(BM_AV_RETURN||'battleProfile')">${iconSVG("shield",20,"currentColor")}</button>
    <h2>Avatar aanpassen</h2>
  </div>
  <div class="panel bm-av-sticky" style="text-align:center;padding:14px 16px;display:flex;justify-content:center;align-items:flex-end;min-height:120px">
    ${renderPixelHeroPreview(av,true) || bmAvatarSVG(av,96)}
  </div>
  ${Object.keys(BM_AVATAR_PARTS).map(partSection).join("")}
  <button class="btn btn-gold btn-block lg" onclick="bmSaveAvatar()" style="margin-bottom:16px">Opslaan</button>
  ${foot()}`);
};
