/* ============================================================================
   ⚔️  BATTLE MODE — Milestone 3
   Identiteitssysteem · Host · Speler · Rondelus · Resultaat
   8 klassen (data-gedreven) · Synergie · Combo-abilities · Class Mastery
   ============================================================================ */

/* ---- CONFIGURATIETABEL: KLASSEN (8 stuks) ---- */
// Alle balanswaarden staan hier. Pas getallen aan zonder de logica te wijzigen.
const BM_CLASSES = [
  { id:"hopliet",      nm:"Hopliet",     icon:"shield", color:"#c8392a",
    passive:{ desc:"+1 BE bij Verdedigen",                    type:"be_on_defend", val:1 },
    abilities:[
      { id:"schildmuur",    nm:"Schildmuur",    tier:"basic",    cost:2,  desc:"Geeft je team +4 schild",                   type:"team_shield",          shld:4 },
      { id:"formatie",      nm:"Formatie",      tier:"advanced", cost:5,  desc:"Alle teamgenoten +2 BE",                    type:"team_be",              teamBE:2 },
      { id:"achilleshiel",  nm:"Achilleshiel",  tier:"ultimate", cost:9,  desc:"Aanval (+6) die tegenschild omzeilt",       type:"attack_bypass",        dmg:6 },
    ]},
  { id:"spartaan",     nm:"Spartaan",    icon:"helmet", color:"#8B1A1A",
    passive:{ desc:"+20% aanvalsschade",                       type:"atk_bonus",   val:0.20 },
    abilities:[
      { id:"speer",         nm:"Speeraanval",   tier:"basic",    cost:3,  desc:"Aanval op het vijandelijk leger (+6)",      type:"attack",               dmg:6 },
      { id:"berserk",       nm:"Berserk",       tier:"advanced", cost:5,  desc:"Zware aanval op het vijandelijk leger (+9)",type:"attack",               dmg:9 },
      { id:"leeuwensprong", nm:"Leeuwensprong", tier:"ultimate", cost:10, desc:"Massieve aanval die schild omzeilt (+14)",  type:"attack_bypass",        dmg:14 },
    ]},
  { id:"boogschutter", nm:"Boogschutter",icon:"eagle",  color:"#2e6fb0",
    passive:{ desc:"+1 schade bij aanval",                     type:"atk_flat",    val:1 },
    abilities:[
      { id:"pijlregen",     nm:"Pijlregen",     tier:"basic",    cost:3,  desc:"Aanval op het vijandelijk leger (+5)",      type:"attack",               dmg:5 },
      { id:"zwakpunt",      nm:"Zwak punt",      tier:"advanced", cost:5,  desc:"Aanval (+7, of +17 als vijand ≤30% HP)",  type:"attack_weakspot",      dmg:7, bonusDmg:10 },
      { id:"dodenarrow",    nm:"Dodenarrow",    tier:"ultimate", cost:9,  desc:"Dodelijke pijl op het vijandelijk leger (+13)", type:"attack",           dmg:13 },
    ]},
  { id:"cavalerie",    nm:"Cavalerie",   icon:"column", color:"#9B6914",
    passive:{ desc:"+2 BE bij snel correct antwoord",          type:"be_on_fast",  val:2 },
    abilities:[
      { id:"charge",        nm:"Charge",        tier:"basic",    cost:3,  desc:"Snelle aanval op het vijandelijk leger (+7)", type:"attack",             dmg:7 },
      { id:"flankbeweging", nm:"Flankbeweging", tier:"advanced", cost:5,  desc:"Aanval (+5) én schild voor je team (+3)",   type:"attack_and_defend",    dmg:5, shld:3 },
      { id:"stormloop",     nm:"Stormloop",     tier:"ultimate", cost:9,  desc:"Verwoestende aanval (+13)",                  type:"attack",               dmg:13 },
    ]},
  { id:"priester",     nm:"Priester",    icon:"torch",  color:"#3f9d52",
    passive:{ desc:"+1 heling bij helen",                      type:"heal_flat",   val:1 },
    abilities:[
      { id:"gebed",         nm:"Gebed",         tier:"basic",    cost:3,  desc:"Heelt je eigen leger (+9)",                 type:"heal",                 heal:9 },
      { id:"zegen",         nm:"Zegen",         tier:"advanced", cost:5,  desc:"Alle teamgenoten +3 BE",                    type:"team_be",              teamBE:3 },
      { id:"godenvuur",     nm:"Godenvuur",     tier:"ultimate", cost:9,  desc:"Heelt leger (+12) én schaadt vijand (+4)",  type:"heal_and_attack",      heal:12, dmg:4 },
    ]},
  { id:"centurio",     nm:"Centurio",    icon:"laurel", color:"#6B2D8B",
    passive:{ desc:"+1 BE per ronde (altijd)",                 type:"be_passive",  val:1 },
    abilities:[
      { id:"bevel",         nm:"Bevel",         tier:"basic",    cost:2,  desc:"Geeft je team +3 schild",                   type:"team_shield",          shld:3 },
      { id:"strijdformatie",nm:"Strijdformatie",tier:"advanced", cost:4,  desc:"Alle teamgenoten +3 BE",                    type:"team_be",              teamBE:3 },
      { id:"testudo",       nm:"Testudo",       tier:"ultimate", cost:8,  desc:"Massiefschild (+7) én team +2 BE",          type:"testudo",              shld:7, teamBE:2 },
    ]},
  { id:"genie",        nm:"Genie",       icon:"amphora",color:"#C87533",
    passive:{ desc:"Aanvallen verminderen ook vijandelijk schild (−2)", type:"shld_pierce", val:2 },
    abilities:[
      { id:"katapult",      nm:"Katapult",      tier:"basic",    cost:3,  desc:"Aanval op het vijandelijk leger (+5)",      type:"attack",               dmg:5 },
      { id:"valgreppel",    nm:"Valgreppel",    tier:"advanced", cost:4,  desc:"Verwijdert vijandelijk schild (−6)",        type:"shield_remove",        shldRemove:6 },
      { id:"vuurtoren",     nm:"Vuurtoren",     tier:"ultimate", cost:8,  desc:"Zware aanval (+9) én schild weg (−4)",     type:"attack_siege",         dmg:9, shldRemove:4 },
    ]},
  { id:"verkenner",    nm:"Verkenner",   icon:"eagle",  color:"#2D8B7A",
    passive:{ desc:"Basis-abilities kosten 1 BE minder",       type:"cost_reduce", val:1 },
    abilities:[
      { id:"verkenning",    nm:"Verkenning",    tier:"basic",    cost:2,  desc:"Aanval (+4) én saboteer vijandelijk schild (−2)", type:"attack_and_shld_remove", dmg:4, shldRemove:2 },
      { id:"sabotage",      nm:"Sabotage",      tier:"advanced", cost:4,  desc:"Verwijdert vijandelijk schild (−6)",        type:"shield_remove",        shldRemove:6 },
      { id:"hinderlaag",    nm:"Hinderlaag",    tier:"ultimate", cost:7,  desc:"Zware aanval (+10) én schild voor team (+3)", type:"attack_and_defend",   dmg:10, shld:3 },
    ]},
];

/* ---- CONFIGURATIETABEL: SYNERGIE ---- */
// Flat BE-bonus per speler per ronde op basis van klasdiversiteit binnen het team.
const BM_SYNERGY = [
  { minClasses:3, beBonus:2 },  // ≥3 unieke klassen → +2 BE per speler
  { minClasses:5, beBonus:4 },  // ≥5 unieke klassen → +4 BE per speler
  { minClasses:7, beBonus:6 },  // ≥7 unieke klassen → +6 BE per speler
];

/* ---- CONFIGURATIETABEL: COMBO-ABILITIES ---- */
// Beide spelers moeten in dezelfde ronde "Combo" kiezen; host detecteert het bij resolutie.
const BM_COMBOS = [
  { id:"schildmuur_schieten", nm:"Schildmuur met Schieten", classes:["hopliet","boogschutter"],     cost:4, desc:"Schild (+6) én gecombineerde pijlaanval (+6)",                  shld:6, dmg:6 },
  { id:"strijdszegen",        nm:"Strijdszegen",            classes:["priester","spartaan"],         cost:4, desc:"Massale BE-bonus voor het hele team (+5 per speler)",            teamBE:5 },
  { id:"vuursalvo",           nm:"Vuursalvo",               classes:["genie","boogschutter"],        cost:4, desc:"Gecombineerde zware aanval (+12)",                               dmg:12 },
  { id:"testudo_formatie",    nm:"Testudo-formatie",         classes:["centurio","hopliet"],          cost:4, desc:"Massief gecombineerd schild voor het hele team (+10)",            shld:10 },
  { id:"hinderlaag_aanval",   nm:"Hinderlaag & Aanval",      classes:["verkenner","cavalerie"],       cost:4, desc:"Gecombineerde aanval (+13) én vijandelijk schild weg (−3)",     dmg:13, shldRemove:3 },
];

/* ---- CONFIGURATIETABEL: FACTIES / THEMA'S ---- */
// cssVars: alleen de velden die afwijken van de standaard hoeven ingevuld.
// Nieuwe factie toevoegen = één entry hier; geen andere code wijzigen.
const BM_FACTIONS = [
  { id:"rome_gaul",       nm:"Romeinen vs Galliërs",    default:true,
    teams:{ A:{ nm:"Legio Romani",   icon:"laurel"  }, B:{ nm:"Gallische Stam",  icon:"shield"  }},
    cssVars:{ "--teamA":"#b03a2e","--glowA":"176,58,46","--teamB":"#3a7a30","--glowB":"58,122,48" },
    classLabels:{} },
  { id:"athene_sparta",   nm:"Athene vs Sparta",
    teams:{ A:{ nm:"Atheners",       icon:"column"  }, B:{ nm:"Spartanen",       icon:"helmet"  }},
    cssVars:{ "--teamA":"#2e6fb0","--glowA":"46,111,176","--teamB":"#8b1a1a","--glowB":"139,26,26" },
    classLabels:{ hopliet:"Atheense Hopliet", spartaan:"Lakedaimoniër" } },
  { id:"grieken_perzen",  nm:"Grieken vs Perzen",
    teams:{ A:{ nm:"Hellenen",       icon:"column"  }, B:{ nm:"Perzen",          icon:"eagle"   }},
    cssVars:{ "--teamA":"#2e6fb0","--glowA":"46,111,176","--teamB":"#7a3a80","--glowB":"122,58,128" },
    classLabels:{} },
  { id:"rome_carthago",   nm:"Romeinen vs Carthago",
    teams:{ A:{ nm:"Legio Romani",   icon:"laurel"  }, B:{ nm:"Carthago",        icon:"amphora" }},
    cssVars:{ "--teamA":"#b03a2e","--glowA":"176,58,46","--teamB":"#9b6914","--glowB":"155,105,20" },
    classLabels:{} },
  { id:"grieken_trojanen",nm:"Grieken vs Trojanen",
    teams:{ A:{ nm:"Grieken",        icon:"column"  }, B:{ nm:"Trojanen",        icon:"helmet"  }},
    cssVars:{ "--teamA":"#2e6fb0","--glowA":"46,111,176","--teamB":"#9b6914","--glowB":"155,105,20" },
    classLabels:{} },
  { id:"goden_titanen",   nm:"Goden vs Titanen",
    teams:{ A:{ nm:"Olympiërs",      icon:"torch"   }, B:{ nm:"Titanen",         icon:"shield"  }},
    cssVars:{ "--teamA":"#d4af37","--glowA":"212,175,55","--teamB":"#4a2d6a","--glowB":"74,45,106",
              "--stone":"#100a1a","--stone2":"#180f28","--stone3":"#1f1530","--stone4":"#2a1a3e" },
    classLabels:{ priester:"Orakel", centurio:"Halfgod" } },
];

/* ---- CONFIGURATIETABELLEN: M6 AVATAR / NIVEAU / MASTERY / ACHIEVEMENTS ---- */

// Alle avatar-onderdelen. requires:{level:N} of {mastery:N} = vereist niveau/mastery om te ontgrendelen.
const BM_AVATAR_PARTS = {
  geslacht:{ nm:"Geslacht",        opts:[
    { id:"man",   nm:"Man" },
    { id:"vrouw", nm:"Vrouw" },
  ]},
  huid:   { nm:"Huidskleur",       opts:[
    { id:"licht",  nm:"Licht" },
    { id:"donker", nm:"Donker" },
  ]},
  helm:   { nm:"Helm",             opts:[
    { id:"geen",     nm:"Geen helm" },
    { id:"standard", nm:"Standaard" },
    { id:"open",     nm:"Open" },
    { id:"hopliet",  nm:"Hopliet",     requires:{level:5} },
    { id:"kroon",    nm:"Kroon",      requires:{mastery:3} },
  ]},
  haar:   { nm:"Haar",             opts:[
    { id:"kort",   nm:"Kort" },
    { id:"lang",   nm:"Lang" },
    { id:"kaal",   nm:"Kaal" },
    { id:"vlecht", nm:"Vlecht",       requires:{level:3} },
  ]},
  haarkleur:{ nm:"Haarkleur",      opts:[
    { id:"blond",  nm:"Blond" },
    { id:"bruin",  nm:"Bruin" },
    { id:"zwart",  nm:"Zwart" },
    { id:"rood",   nm:"Rood" },
    { id:"blauw",  nm:"Blauw",        requires:{level:4} },
    { id:"groen",  nm:"Groen",        requires:{level:4} },
  ]},
  baard:  { nm:"Gezichtshaar",     opts:[
    { id:"geen",      nm:"Geen" },
    { id:"baard",     nm:"Baard" },
    { id:"snor",      nm:"Snor" },
    { id:"baardsnor", nm:"Baard en snor" },
  ]},
  armor:  { nm:"Wapenrusting",     opts:[
    { id:"licht",       nm:"Licht" },
    { id:"middel",      nm:"Middel" },
    { id:"hopliet",     nm:"Hopliet",     requires:{level:3} },
    { id:"zwaar",       nm:"Zwaar",       requires:{level:5} },
    { id:"ceremonieel", nm:"Ceremonieel", requires:{mastery:5} },
  ]},
  schild: { nm:"Schild",           opts:[
    { id:"geen",     nm:"Geen schild" },
    { id:"rond",     nm:"Rond" },
    { id:"ovaal",    nm:"Puntig" },
    { id:"vierkant", nm:"Metaal Rond" },
    { id:"tower",    nm:"Metaal Puntig", requires:{level:7} },
  ]},
  wapen:  { nm:"Wapen",            opts:[
    { id:"zwaard", nm:"Zwaard" },
    { id:"speer",  nm:"Speer" },
    { id:"boog",   nm:"Boog" },
    { id:"staf",   nm:"Staf",           requires:{level:4} },
  ]},
  cape:   { nm:"Cape",             opts:[
    { id:"geen", nm:"Geen" },
    { id:"kort", nm:"Kort" },
    { id:"lang", nm:"Lang",            requires:{level:6} },
  ]},
  capekleur:{ nm:"Capekleur",      opts:[
    { id:"goud",   nm:"Goud" },
    { id:"rood",   nm:"Rood" },
    { id:"blauw",  nm:"Blauw" },
    { id:"groen",  nm:"Groen" },
    { id:"paars",  nm:"Paars" },
    { id:"oranje", nm:"Oranje" },
  ]},
  victoryAnim: { nm:"Overwinningsanimatie", opts:[
    { id:"juichen",      nm:"Juichen" },
    { id:"zwaardhefffen",nm:"Zwaard heffen", requires:{level:5} },
  ]},
};

// XP-drempels en titels per niveau (1–20). Aanpasbaar zonder logica te wijzigen.
const BM_LEVELS = [
  { level:1,  xp:0,    title:"Tiro",       unlock:null },
  { level:2,  xp:100,  title:"Miles",      unlock:{part:"haar",       opt:"lang"} },
  { level:3,  xp:250,  title:"Optio",      unlock:{part:"haar",       opt:"vlecht"} },
  { level:4,  xp:500,  title:"Signifer",   unlock:{part:"wapen",      opt:"staf"} },
  { level:5,  xp:900,  title:"Aquilifer",  unlock:{part:"helm",       opt:"fedder"} },
  { level:6,  xp:1400, title:"Centurio",   unlock:{part:"cape",       opt:"lang"} },
  { level:7,  xp:2100, title:"Praefectus", unlock:{part:"schild",     opt:"tower"} },
  { level:8,  xp:3000, title:"Tribunus",   unlock:{part:"armor",      opt:"zwaar"} },
  { level:9,  xp:4200, title:"Legatus",    unlock:{part:"helm",       opt:"kroon"} },
  { level:10, xp:6000, title:"Imperator",  unlock:{part:"victoryAnim",opt:"zwaardhefffen"} },
];

// score = rounds*5 + damage + healing  → mastery-sterren (0–5)
const BM_MASTERY_TIERS = [
  { stars:0, score:0   },
  { stars:1, score:15  },
  { stars:2, score:40  },
  { stars:3, score:80  },
  { stars:4, score:140 },
  { stars:5, score:220 },
];

// Uitbreidbaar via één extra entry; geen andere code wijzigen.
// BM_ACHIEVEMENTS is vervangen door ACHIEVEMENTS_DEF in core.js (geunificeerd systeem)

/* ---- BATTLE IDENTITY ---- */
const BM_IDENT_KEY = "certamen_battle_identity";
let BM_IDENT = null;
// Scherm waar de avatar-editor naar terugkeert (gezet door de oproepende knop).
let BM_AV_RETURN = "battleProfile";

function bmIdentLoad(){ try{ const r=localStorage.getItem(BM_IDENT_KEY); return r?JSON.parse(r):null; }catch(e){return null;} }
function bmIdentSave(o){ try{ localStorage.setItem(BM_IDENT_KEY,JSON.stringify(o)); }catch(e){} }
function bmIdentClear(){ try{ localStorage.removeItem(BM_IDENT_KEY); }catch(e){} }
async function bmIdentGet(klas,lcode){ if(!fbDB)return null; const s=await fbDB.ref("identities/"+klas+"/"+lcode).once("value"); return s.exists()?s.val():null; }
async function bmIdentCreate(klas,lcode,name){ const d={name,coins:0,xp:0,battles:0,level:1,avatar:bmAvatarDefaults(),color:P.color,classHistory:{},achievements:[]}; if(fbDB)await fbDB.ref("identities/"+klas+"/"+lcode).set(d); return d; }

/* ---- M6: AVATAR / NIVEAU / MASTERY HELPERS ---- */

function bmAvatarDefaults(){
  return{helm:"standard",haar:"kort",baard:"geen",armor:"licht",
         schild:"rond",wapen:"zwaard",cape:"geen",kleur:"#b03a2e",victoryAnim:"juichen",
         huid:"licht",geslacht:"man",haarkleur:"blond",capekleur:"goud"};
}
function bmAvatarMerge(saved){
  // backward compat: string-avatar (pre-M6) → object
  if(!saved||typeof saved==="string") return bmAvatarDefaults();
  return{...bmAvatarDefaults(),...saved};
}

function bmAvatarSVG(av,size=60){
  const a=bmAvatarMerge(av);
  const col=a.kleur||"#b03a2e";
  const armorFill={licht:"#9a8870",middel:"#6a5840",zwaar:"#3e3230",ceremonieel:col}[a.armor]||"#9a8870";
  const helmFill={standard:"#7a6a48",open:"#8a7a58",fedder:col,kroon:"#d4af37"}[a.helm]||"#7a6a48";
  const hairFill={kort:"#5c3c1a",lang:"#3c280c",kaal:null,vlecht:"#5c3c1a"}[a.haar];
  const skin="#d4a476"; const wc="#c8a860";

  const cape=a.cape==="lang"
    ?`<path d="M18,30 Q7,55 10,76 Q30,70 50,76 Q53,55 42,30" fill="${col}" opacity=".65"/>`
    :a.cape==="kort"
    ?`<path d="M20,30 Q13,50 16,66 Q30,62 44,66 Q47,50 40,30" fill="${col}" opacity=".65"/>`
    :"";

  const shields={
    rond:`<circle cx="9" cy="44" r="8" fill="${col}" opacity=".85"/><circle cx="9" cy="44" r="5.5" fill="none" stroke="rgba(255,255,255,.25)" stroke-width="1.2"/>`,
    ovaal:`<ellipse cx="9" cy="44" rx="6" ry="9" fill="${col}" opacity=".85"/>`,
    vierkant:`<rect x="2" y="36" width="14" height="16" rx="2" fill="${col}" opacity=".85"/>`,
    tower:`<path d="M3,32 L3,56 Q9,60 15,56 L15,32 Q12,28 9,32 Q6,28 3,32Z" fill="${col}" opacity=".85"/>`,
  };
  const weapons={
    zwaard:`<line x1="52" y1="24" x2="52" y2="54" stroke="${wc}" stroke-width="3" stroke-linecap="round"/><line x1="47" y1="37" x2="57" y2="37" stroke="${wc}" stroke-width="2.5" stroke-linecap="round"/>`,
    speer:`<line x1="52" y1="16" x2="52" y2="58" stroke="#a08040" stroke-width="2.5" stroke-linecap="round"/><polygon points="52,10 55,22 49,22" fill="${wc}"/>`,
    boog:`<path d="M52,18 Q62,38 52,58" fill="none" stroke="#a08040" stroke-width="2.5"/><line x1="52" y1="18" x2="52" y2="58" stroke="${wc}" stroke-width="1"/>`,
    staf:`<line x1="52" y1="14" x2="52" y2="60" stroke="#7a5030" stroke-width="3" stroke-linecap="round"/><circle cx="52" cy="12" r="5" fill="#d4af37" opacity=".9"/>`,
  };
  const helms={
    standard:`<path d="M18,20 Q18,9 30,8 Q42,9 42,20 L40,24 L20,24 Z" fill="${helmFill}"/><rect x="18" y="24" width="24" height="3" rx="1" fill="${helmFill}" opacity=".75"/>`,
    open:`<path d="M19,22 Q19,10 30,9 Q41,10 41,22" fill="none" stroke="${helmFill}" stroke-width="4.5" stroke-linecap="round"/>`,
    fedder:`<path d="M18,20 Q18,9 30,8 Q42,9 42,20 L40,24 L20,24 Z" fill="${helmFill}"/><rect x="18" y="24" width="24" height="3" rx="1" fill="${helmFill}" opacity=".75"/><path d="M22,9 Q14,2 9,6 Q13,14 20,16" fill="${col}" opacity=".9"/>`,
    kroon:`<path d="M18,22 L18,12 L24,17 L30,10 L36,17 L42,12 L42,22 Z" fill="${helmFill}"/>`,
  };
  const hairSVG=!hairFill?"":a.haar==="vlecht"
    ?`<path d="M24,20 Q21,28 24,34" fill="none" stroke="${hairFill}" stroke-width="4" stroke-linecap="round"/>`
    :a.haar==="lang"
    ?`<path d="M20,22 Q17,32 20,42" fill="none" stroke="${hairFill}" stroke-width="5" stroke-linecap="round"/><path d="M40,22 Q43,32 40,42" fill="none" stroke="${hairFill}" stroke-width="5" stroke-linecap="round"/>`
    :`<path d="M20,22 Q20,14 30,13 Q40,14 40,22" fill="${hairFill}"/>`;
  const bc=hairFill||"#5c3c1a";
  const beards={
    geen:"",
    baard:`<path d="M22,32 Q30,40 38,32 Q37,38 30,41 Q23,38 22,32" fill="${bc}"/>`,
    snor:`<path d="M24,30 Q30,33 36,30 Q33,33 30,34 Q27,33 24,30" fill="${bc}"/>`,
  };
  const w=size, h=Math.round(size*80/60);
  return `<svg viewBox="0 0 60 80" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg" style="display:block">
    ${cape}${shields[a.schild]||shields.rond}
    <rect x="19" y="30" width="22" height="24" rx="3" fill="${armorFill}"/>
    <rect x="19" y="30" width="22" height="5" rx="2" fill="${armorFill}" opacity=".65"/>
    <rect x="15" y="34" width="6" height="12" rx="2" fill="${armorFill}" opacity=".8"/>
    <rect x="39" y="34" width="6" height="12" rx="2" fill="${armorFill}" opacity=".8"/>
    ${weapons[a.wapen]||weapons.zwaard}
    <circle cx="30" cy="24" r="11" fill="${skin}"/>
    ${hairSVG}${beards[a.baard]||""}${helms[a.helm]||helms.standard}
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
function bmIsUnlocked(opt,ident){
  if(!opt.requires)return true;
  const{level:rL,mastery:rM}=opt.requires;
  if(rL&&bmCalcLevel(ident?.xp||0).level<rL)return false;
  if(rM&&!Object.values(ident?.classHistory||{}).some(h=>bmCalcMastery(h)>=rM))return false;
  return true;
}
function bmStars(n,max=5){
  return Array.from({length:max},(_,i)=>`<span style="color:${i<n?"#d4af37":"var(--stone4)"};font-size:14px">★</span>`).join("");
}

// Toekennen van XP en achievements na afloop van een gevecht (player-side).
async function bmAwardBattle(){
  if(!BM_IDENT||!fbDB)return null;
  const{klascode:klas,leerlingcode:lcode}=BM_IDENT;
  if(!klas||!lcode)return null;
  // Dubbele toekenning voorkomen per kamer-sessie
  const guardKey="bm_award_"+BM_CODE;
  if(sessionStorage.getItem(guardKey))return null;
  try{sessionStorage.setItem(guardKey,"1");}catch(e){}

  const correct=BM_MY_CORRECT||0, wrong=BM_MY_WRONG||0, total=correct+wrong;
  const won=BM_STATE.winner===BM_MY_TEAM;
  const isScholar=total>=5&&correct/total>=0.9;
  // Nieuwe XP-formule: +2/goed, +5/deelname, +1/ronde, +15/winst, +8/scholar
  const xpEarned=correct*2+5+total*1+(won?15:0)+(isScholar?8:0);

  const snap=await fbDB.ref("identities/"+klas+"/"+lcode).once("value");
  const data=snap.val()||{};
  const oldXp=data.xp||0, newXp=oldXp+xpEarned;
  const battles=(data.battles||0)+1;
  const oldLv=bmCalcLevel(oldXp), newLv=bmCalcLevel(newXp);

  // Mastery-rondes bijwerken voor huidige klasse
  const cls=BM_MY_CLASS;
  const upd={xp:newXp,battles};
  if(cls){
    const hist=data.classHistory?.[cls]||{};
    upd["classHistory/"+cls+"/rounds"]=(hist.rounds||0)+Math.max(1,total);
    upd["classHistory/"+cls+"/damage"]=(hist.damage||0)+(BM_MY_DMG||0);
    upd["classHistory/"+cls+"/healing"]=(hist.healing||0)+(BM_MY_HEAL||0);
  }

  await fbDB.ref("identities/"+klas+"/"+lcode).update(upd);
  const merged={...data,...upd,xp:newXp,battles,achievements:data.achievements||[]};
  BM_IDENT={...BM_IDENT,...merged};
  bmIdentSave({...bmIdentLoad(),...BM_IDENT});

  // Lokaal profiel (core.js) bijwerken
  P.stats.battlesPlayed++; if(won)P.stats.battlesWon++;
  P.stats.totalCorrect+=correct; P.stats.totalWrong+=wrong;
  P.stats.totalDamage+=(BM_MY_DMG||0); P.stats.totalHealing+=(BM_MY_HEAL||0);
  addXP(xpEarned);  // addXP roept saveProfile() aan
  checkAch({mode:"battle", won, isScholar});

  const earned=await bmCheckAchievements(merged,{won,isScholar});
  return{xpEarned,oldLv,newLv,levelUp:newLv.level>oldLv.level,earned};
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
  const clsPlayed=Object.keys(ident.classHistory||{});
  check("strateeg",clsPlayed.length>=5);
  check("commandant",clsPlayed.length>=8);
  for(const cls of BM_CLASSES){
    const stars=bmCalcMastery(ident.classHistory?.[cls.id]);
    check("vet_"+cls.id, stars>=3);
    check("mees_"+cls.id, stars>=5);
  }
  if(newOnes.length){
    const updated=[...new Set([...current,...newOnes])];
    await fbDB.ref("identities/"+klas+"/"+lcode+"/achievements").set(updated);
    BM_IDENT={...BM_IDENT,achievements:updated};
    bmIdentSave({...bmIdentLoad(),...BM_IDENT,achievements:updated});
  }
  return newOnes;
}
async function bmSaveAvatar(){
  if(!BM_AV_EDIT||!BM_IDENT)return;
  if(!fbDB && typeof initFirebase==="function") initFirebase(); // beste-effort
  try{
    // Sla op in Firebase indien beschikbaar; altijd in lokale cache.
    if(fbDB){
      const{klascode:klas,leerlingcode:lcode}=BM_IDENT;
      await fbDB.ref("identities/"+klas+"/"+lcode+"/avatar").set(BM_AV_EDIT);
    }
    BM_IDENT={...BM_IDENT,avatar:{...BM_AV_EDIT}};
    bmIdentSave({...bmIdentLoad(),...BM_IDENT});
    BM_AV_EDIT=null;
    toast("Opgeslagen!","Avatar bijgewerkt.");
    go(BM_AV_RETURN||"battleProfile");
  }catch(e){toast("Fout","Avatar opslaan mislukt.");}
}

/* ---- ABILITY HELPERS ---- */
function bmGetAbilityCost(cls,abl){
  let c=abl.cost;
  if(cls?.passive?.type==="cost_reduce"&&abl.tier==="basic") c=Math.max(1,c-cls.passive.val);
  return c;
}
function bmCalcAbilityEffect(p,cls,abl){
  const fx={dmg:0,heal:0,shld:0,teamBE:0,selfBE:0,shldRemove:0,bypass:false};
  const t=abl.type, pasv=cls?.passive, mt=p.team;
  const isDmg=["attack","attack_bypass","attack_weakspot","attack_and_defend","attack_and_shld_remove","attack_siege","heal_and_attack"].includes(t);
  if(isDmg){
    let d=abl.dmg||0;
    if(pasv?.type==="atk_flat")  d+=pasv.val;
    if(pasv?.type==="atk_bonus") d=Math.round(d*(1+pasv.val));
    if(t==="attack_weakspot"){
      const et=mt==="A"?"B":"A";const eh=BM_TEAMS[et]||{health:100,maxHealth:100};
      if(eh.maxHealth>0&&eh.health/eh.maxHealth<=0.30) d+=(abl.bonusDmg||0);
    }
    fx.dmg=d; fx.bypass=(t==="attack_bypass");
    if(pasv?.type==="shld_pierce") fx.shldRemove+=pasv.val; // genie passief
  }
  if(["team_shield","testudo","attack_and_defend"].includes(t)) fx.shld=abl.shld||0;
  if(["team_shield","testudo"].includes(t)&&pasv?.type==="be_on_defend") fx.selfBE+=pasv.val;
  if(["heal","heal_and_attack"].includes(t)){ let h=abl.heal||0; if(pasv?.type==="heal_flat") h+=pasv.val; fx.heal=h; }
  if(["team_be","testudo"].includes(t)) fx.teamBE=abl.teamBE||0;
  if(["shield_remove","attack_and_shld_remove","attack_siege"].includes(t)) fx.shldRemove+=(abl.shldRemove||0);
  return fx;
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
  const need=Math.max(1,BM_META.respawnRequired||5);
  const meter=(p.respawnMeter||0)+1;
  if(meter>=need){
    return {revived:true, upd:{isAlive:true, hp:p.maxHp||BM_META.heroMaxHp||15, armor:0, respawnMeter:0}};
  }
  return {revived:false, upd:{respawnMeter:meter}};
}

/* ---- FACTIE / THEMA HELPERS ---- */
let BM_THEME_SAVED=[]; // opgeslagen originele CSS-var-waarden voor herstel bij bmLeave
function bmFaction(id){ return BM_FACTIONS.find(f=>f.id===id)||BM_FACTIONS.find(f=>f.default)||BM_FACTIONS[0]; }
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
function bmTeamNm(team){ return bmFaction(BM_META?.theme).teams[team]?.nm||(team==="A"?"Team A":"Team B"); }
function bmTeamIcon(team){ return bmFaction(BM_META?.theme).teams[team]?.icon||(team==="A"?"shield":"helmet"); }
function bmClsNmThemed(clsId){ return bmFaction(BM_META?.theme).classLabels?.[clsId]||bmClsName(clsId); }

/* ---- BATTLE GAME STATE ---- */
let BM_CODE=null, BM_PID=null, BM_META=null;
let BM_STATE={}, BM_TEAMS={}, BM_PLAYERS={};
let BM_MY_BE=0, BM_MY_Q=null, BM_MY_CLASS=null, BM_MY_TEAM=null;
let BM_ANSWERED=false, BM_ACTION_LOCKED=false, BM_RESOLVING=false;
const BM_MISSED={}; // { pid:{ wordLa:count } } host-only, adaptief leren

function bmLeave(){
  _bmFormHash="";
  bmClearTheme();
  BM_CODE=null;BM_PID=null;BM_META=null;BM_STATE={};BM_TEAMS={};BM_PLAYERS={};
  BM_MY_BE=0;BM_MY_Q=null;BM_MY_CLASS=null;BM_MY_TEAM=null;
  BM_ANSWERED=false;BM_ACTION_LOCKED=false;BM_RESOLVING=false;
  BM_MY_CORRECT=0;BM_MY_WRONG=0;BM_MY_DMG=0;BM_MY_HEAL=0;
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
      <span style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)">${bmAvatarSVG(bmAvatarMerge(BM_IDENT.avatar),44)}</span>
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
  const m={basic:["Basis","#3f9d52"],advanced:["Gevorderd","#2e6fb0"],ultimate:["Ultiem","#C87533"]};
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
    <div class="note" style="margin-top:6px">Dit herhaalt zich tot een leger verslagen is.</div>`)}

  ${sec("Battle Energy (BE)",false,`
    <div class="note">BE is je actiemunt. Je verdient het door vragen goed te beantwoorden. Elke ability kost
    BE (zie hieronder). Sommige klassen genereren extra BE voor zichzelf of het hele team. Spaar je BE op
    voor een krachtige <b>ultieme</b> ability, of geef het meteen uit aan goedkope acties — dat is jouw
    tactische keuze.</div>`)}

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

  ${sec("Profiel, rang en eerbewijzen",false,`
    <div class="note">Alles wat je doet telt mee voor één profiel (zie <b>Mijn profiel</b> in het
    hoofdmenu):</div>
    <ul style="margin:6px 0 0;padding-left:18px;font-size:13px;line-height:1.6">
      <li><b>XP &amp; rang</b> — je klimt van Tiro tot Imperator door te spelen en te winnen.</li>
      <li><b>Klasbeheersing</b> — speel je vaak dezelfde klasse, dan verdien je sterren (★ tot ★★★★★).</li>
      <li><b>Eerbewijzen</b> — speciale prestaties, ook geheime. Verschijnen op je profiel.</li>
      <li><b>Avatar</b> — pas je held-avatar aan via je profiel; nieuwe onderdelen unlock je door te levelen.</li>
    </ul>`)}

  ${sec("Voor docenten",false,`
    <div class="note">Bij het starten van een gevecht stel je in: woordbereik en taal, antwoordtijd, en onder
    <b>Geavanceerde instellingen</b> o.a. legersterkte, adaptief leren (foute woorden komen vaker terug),
    combo's aan/uit, mastery-bonussen, animaties (uit bij trage Chromebooks), geluid, en de
    <b>Heldenmodus</b> met HP-per-held en herrijz-drempel. Battle Mode vereist Firebase voor de realtime
    synchronisatie en het identiteitssysteem.</div>`)}

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
    <label class="fld" style="margin-top:12px">Weergavenaam</label>
    <input id="bmNaam" type="text" placeholder="bv. Marcus">
  </div>
  <div id="bmIdentErr" class="note warn" style="display:none;margin-bottom:10px"></div>
  <button class="btn btn-gold btn-block lg" onclick="bmIdentLogin()">Aanmelden</button>
  `}
  ${foot()}`);
};
async function bmIdentLogin(){
  initFirebase(); // beste-effort; bmIdentGet/Create werken ook offline (lokale fallback)
  const klas=(el("bmKlas")?.value||"").trim().toUpperCase();
  const lcode=(el("bmLcode")?.value||"").trim().toLowerCase();
  const name=(el("bmNaam")?.value||"").trim();
  const err=el("bmIdentErr");
  if(!klas||!lcode||!name){if(err){err.textContent="Vul alle velden in.";err.style.display="";}return;}
  if(err)err.style.display="none";
  try{
    let data=await bmIdentGet(klas,lcode);
    const isNew=!data;
    if(!data)data=await bmIdentCreate(klas,lcode,name);
    // Eenmalige migratie: lokaal profiel importeren als Firebase-identiteit nieuw is
    if(isNew&&fbDB){
      const localXp=P.xp||0, localCorrect=P.stats?.totalCorrect||0;
      if((localXp>0||localCorrect>0)&&confirm("Je hebt al Certamen-voortgang ("+localCorrect+" goede antwoorden, "+localXp+" XP). Wil je deze importeren in je Battle Mode-profiel?")){
        const imp={xp:localXp,coins:P.coins||0,achievements:P.achievements||[]};
        await fbDB.ref("identities/"+klas+"/"+lcode).update(imp);
        data={...data,...imp};
      }
    }
    BM_IDENT={klascode:klas,leerlingcode:lcode,...data,name,avatar:bmAvatarMerge(data.avatar)};
    // Volledige identiteit cachen (xp, classHistory, battles, achievements) zodat 'Mijn profiel' offline klopt
    bmIdentSave({klascode:klas,leerlingcode:lcode,...data,name});
    go("battleJoin");
  }catch(e){console.error("bmIdentLogin fout:",e);if(err){err.textContent="Aanmelden mislukt: "+(e?.message||e||"onbekende fout");err.style.display="";}}
}
async function bmIdentContinue(){
  const saved=bmIdentLoad(); if(!saved){SCREENS.battleIdentity();return;}
  BM_IDENT=saved;
  try{const d=await bmIdentGet(saved.klascode,saved.leerlingcode);if(d){BM_IDENT={...saved,...d};bmIdentSave({...saved,...d});}}catch(e){}
  go("battleJoin");
}

// Haalt de nieuwste Battle Mode-identiteit uit Firebase en ververst de cache + (optioneel) het scherm.
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
      if(rerenderScreen&&SCREENS[rerenderScreen])SCREENS[rerenderScreen]();
    }
  }catch(e){}
}
function bmIdentSwitch(){bmIdentClear();BM_IDENT=null;SCREENS.battleIdentity();}

/* ---- SCHERM: battleHostSettings ---- */
let BM_ADV_OPEN=false;
SCREENS.battleHostSettings = function(){
  if(!BM_META)BM_META={};
  const th=BM_META.theme||(BM_FACTIONS.find(f=>f.default)||BM_FACTIONS[0]).id;
  if(!BM_META.theme)BM_META.theme=th;
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
  <div class="panel">
    <label class="fld">Factie / Thema</label>
    <select style="width:100%;padding:10px 12px;background:var(--stone3);color:var(--cream);border:1px solid var(--stone4);border-radius:8px;font-size:15px;font-family:inherit" onchange="BM_META.theme=this.value;SCREENS.battleHostSettings()">
      ${BM_FACTIONS.map(f=>`<option value="${f.id}"${th===f.id?" selected":""}>${f.nm}</option>`).join("")}
    </select>
    <div class="note" style="margin-top:6px">${iconSVG(fac.teams.A.icon,13,fac.cssVars["--teamA"]||"var(--teamA)")} ${esc(fac.teams.A.nm)} vs ${iconSVG(fac.teams.B.icon,13,fac.cssVars["--teamB"]||"var(--teamB)")} ${esc(fac.teams.B.nm)}</div>
  </div>
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
    theme:BM_META.theme||(BM_FACTIONS.find(f=>f.default)||BM_FACTIONS[0]).id,
    background:BM_META.background||"geen",
    animations:BM_META.animations!==false,
    combos:BM_META.combos!==false,
    masteryBonuses:BM_META.masteryBonuses!==false,
    sfx:BM_META.sfx!==false,
    heroMode:BM_META.heroMode===true,
    heroMaxHp:BM_META.heroMaxHp||15,
    respawnRequired:BM_META.respawnRequired||5,
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
  H(brand(false)+`
  <div class="scrhead"><button class="back" onclick="leaveAll();bmLeave();go('home')">${iconSVG("shield",20,"currentColor")}</button><h2>${esc(fac.nm)} — Lobby</h2></div>
  <div class="codecard">
    <div class="lbl">Spelcode — geef dit aan de klas</div>
    <div class="code">${BM_CODE}</div>
  </div>
  <div class="panel">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
      <h3 style="margin:0">Spelers <span id="bmLN"></span></h3>
      <button class="btn btn-ghost" style="padding:9px 14px" onclick="bmAutoTeams()">⚖ Teams</button>
    </div>
    <div class="plist" id="bmPlist"></div>
  </div>
  <button class="btn btn-gold btn-block lg" id="bmSB" onclick="bmStartGame()" disabled>Start het gevecht</button>
  ${foot()}`);
  const rP=fbDB.ref("rooms/"+BM_CODE+"/players"), fP=rP.on("value",s=>{BM_PLAYERS=s.val()||{};bmRenderHostLobby();});
  const rT=fbDB.ref("rooms/"+BM_CODE+"/teams"), fT=rT.on("value",s=>{BM_TEAMS=s.val()||{};});
  BM_UNSUBS=[()=>rP.off("value",fP),()=>rT.off("value",fT)];
};
function bmRenderHostLobby(){
  const ln=el("bmLN"); if(ln)ln.textContent="("+Object.keys(BM_PLAYERS).length+")";
  const pl=el("bmPlist"); if(!pl)return;
  pl.innerHTML=Object.values(BM_PLAYERS).map(p=>`<span class="ptag">
    ${avatarHTML(p.avatar||"helmet",p.color||COLORS[0],30)} ${esc(p.name)}
    ${p.team?`<span class="pill" style="background:${p.team==="A"?"var(--teamA)":"var(--teamB)"};border:none">${esc(bmTeamNm(p.team))}</span>`:""}
    ${p.class?`<span class="pill">${bmClsName(p.class)}</span>`:""}
  </span>`).join("")||`<div class="note">Wachten op spelers…</div>`;
  const sb=el("bmSB"); if(sb)sb.disabled=Object.keys(BM_PLAYERS).length<2;
}
function bmAutoTeams(){
  const pids=shuffle(Object.keys(BM_PLAYERS)),up={};
  pids.forEach((pid,i)=>{up[pid+"/team"]=i%2===0?"A":"B";});
  fbDB.ref("rooms/"+BM_CODE+"/players").update(up);
}
async function bmStartGame(){
  if(Object.keys(BM_PLAYERS).length<2){toast("Te weinig spelers","Wacht op minstens 2 deelnemers.");return;}
  const unassigned=Object.keys(BM_PLAYERS).filter(pid=>!BM_PLAYERS[pid]?.team);
  if(unassigned.length)bmAutoTeams();
  await new Promise(r=>setTimeout(r,300));
  await bmDistributeQs(1);
  go("battleHostGame");
}

/* ---- VRAGEN VERDELEN (host) ---- */
async function bmDistributeQs(roundN){
  const pids=Object.keys(BM_PLAYERS);if(!pids.length)return;
  const at=BM_META?.answerTimer||10;
  // Synergiebonus (flat BE per speler) + passief BE voor Centurio
  const synA=bmCalcSynergy(BM_PLAYERS,"A"),synB=bmCalcSynergy(BM_PLAYERS,"B");
  const up={};
  for(const pid of pids){
    const p=BM_PLAYERS[pid]||{};
    const cls=BM_CLASSES.find(c=>c.id===p.class);
    let beBonus=p.team==="A"?synA:synB;
    if(cls?.passive?.type==="be_passive") beBonus+=cls.passive.val;
    if(BM_META?.masteryBonuses!==false) beBonus+=(p.masteryBonus||0);
    const pool=bmPersonalPool(pid,POOL);
    up["players/"+pid+"/currentQ"]=JSON.stringify(makeQuestion(pool));
    up["players/"+pid+"/answeredRound"]=-1;
    up["players/"+pid+"/lockedAction"]=null;
    if(beBonus>0) up["players/"+pid+"/be"]=(p.be||0)+beBonus;
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
  up["teams/A/classes"]=clsA;
  up["teams/B/classes"]=clsB;
  await fbDB.ref("rooms/"+BM_CODE).update(up);
}
function bmPersonalPool(pid,pool){
  if(!BM_META?.adaptive)return pool;
  const missed=BM_MISSED[pid]||{};
  const w=[...pool];
  pool.forEach(word=>{const c=missed[word.la]||0;for(let i=0;i<Math.min(c,3);i++)w.push(word);});
  return w.length?w:pool;
}

/* ---- SCHERM: battleHostGame ---- */
SCREENS.battleHostGame = function(){
  bmApplyTheme(BM_META?.theme);
  const appEl=document.getElementById("app");
  if(appEl)appEl.classList.add("bm-host-mode");
  H(`<div class="bm-host-wrap">
    <div class="bm-ctrl-bar">
      <span id="bmRndLabel" class="bm-cb-round">Ronde —</span>
      <span id="bmPhaseLabel" class="bm-cb-phase">—</span>
      <span id="bmTimer" class="bm-cb-timer">—</span>
      <button id="bmPauseBtn" onclick="bmTogglePause()">⏸ Pauzeer</button>
      <button onclick="bmSkipRound()">⏭ Sla over</button>
      <button onclick="bmReplaceQ()">🔄 Vervang</button>
      <button onclick="bmRestartRound()">↩ Herstart</button>
      <button class="bm-btn-end" style="margin-left:auto" onclick="bmEndGame()">✕ Beëindig</button>
    </div>
    <div class="bm-hp-row">
      <div class="bm-hp-side" id="bmArmyA"></div>
      <div class="bm-hp-vs">⚔️</div>
      <div class="bm-hp-side side-b" id="bmArmyB"></div>
    </div>
    <div id="bmField" class="${bmBgTheme(BM_META?.theme)}" style="${bmArenaBgStyle()}">
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
  });
  const rT=fbDB.ref("rooms/"+BM_CODE+"/teams"),fT=rT.on("value",s=>{
    BM_TEAMS=s.val()||{};
    bmHostUpdateArmies();
  });
  BM_UNSUBS.push(()=>rS.off("value",fS),()=>rP.off("value",fP),()=>rT.off("value",fT));
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

  // Spelersgrid
  const grid=el("bmPlayerGrid");if(!grid)return;
  grid.innerHTML=entries.map(([,p])=>{
    const cls=BM_CLASSES.find(c=>c.id===p.class);
    const col=cls?.color||"var(--muted)";
    const hasAnswered=p.answeredRound===round.n;
    const hasLocked=!!p.lockedAction;
    const dotCls=hasAnswered?"on":hasLocked?"locked":"";
    return `<div class="bm-pcard" style="border-color:${col}44">
      <div style="position:relative">
        ${bmAvatarSVG(bmAvatarMerge(p.avatar),32)}
        <span class="bm-pdot ${dotCls}"></span>
      </div>
      <div class="bm-pname">${esc(p.name)}</div>
      <div class="bm-pcls" style="color:${col}">${esc(cls?.nm||"")}</div>
    </div>`;
  }).join("");

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
  if(round.phase==="question")note.textContent="Beantwoord: "+answered+"/"+total;
  else if(round.phase==="action")note.textContent="Actie vergrendeld: "+locked+"/"+total;
  else note.textContent="";
}
function bmArmyBarHTML(team,nm,d){
  const scale=d.maxHealth?Math.max(0,d.health/d.maxHealth):0;
  const col=team==="A"?"var(--teamA)":"var(--teamB)";
  const crit=d.maxHealth&&d.health/d.maxHealth<0.25?" bm-crit":"";
  const isB=team==="B";
  const origin=isB?"right center":"left center";
  return `<div>
    <div class="bm-hp-nm${isB?" side-b":""}" style="color:${col}">${esc(nm)}</div>
    <div class="bm-hp-track">
      <div class="bm-hp-fill${crit}" style="width:100%;background:${col};transform:scaleX(${scale});transform-origin:${origin};will-change:transform"></div>
    </div>
    <div class="bm-hp-num${isB?" side-b":""}">${d.health}/${d.maxHealth} HP</div>
  </div>`;
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
  "grasland": { nm:"Grasvlakte", floor:"assets/battlebacks/Grassland1.png", wall:"assets/battlebacks/Grassland2.png" },
  "woestijn": { nm:"Woestijn",   floor:"assets/battlebacks/Desert1.png",    wall:"assets/battlebacks/Desert2.png" },
  "tempel":   { nm:"Tempel",     floor:"assets/battlebacks/Paved1.png",     wall:"assets/battlebacks/Temple2.png" },
  "fort":     { nm:"Fort",       floor:"assets/battlebacks/Fort1.png",      wall:"assets/battlebacks/Fort2.png" },
};
// Inline style-string voor #bmField op basis van de gekozen achtergrond.
// Muur eerst genoemd (bovenste laag), vloer als tweede (eronder).
function bmArenaBgStyle(){
  const key=BM_META&&BM_META.background;
  const bg=key&&BATTLE_BACKGROUNDS[key];
  if(!bg||key==="geen")return"";
  const v=SPRITE_VER?("?"+SPRITE_VER):"";
  return `background-image:url('${bg.wall}${v}'),url('${bg.floor}${v}');`
       + `background-repeat:no-repeat,no-repeat;background-position:center bottom,center bottom;`
       + `background-size:cover,cover;image-rendering:pixelated;`;
}
// Herbevestig de achtergrond op een bestaand #bmField (na herbouw).
function bmApplyArenaBg(field){
  if(!field)return;
  field.style.cssText=bmArenaBgStyle();
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
  bases:  { "licht":       "assets/sprites/base_light.png",
            "donker":      "assets/sprites/base_dark.png",
            "licht_vrouw": "assets/sprites/base_light_female.png",
            "donker_vrouw":"assets/sprites/base_dark_female.png" },
  armor:  { "licht":"assets/sprites/armor_licht.png",
            "middel":"assets/sprites/armor_middel.png",
            "zwaar":"assets/sprites/armor_zwaar.png",
            "hopliet":"assets/sprites/armor_hopliet.png",
            "ceremonieel":"assets/sprites/armor_ceremonieel.png" },
  helm:   { "geen":"",
            "standard":"assets/sprites/helm_standaard.png",
            "open":"assets/sprites/helm_open.png",
            "hopliet":"assets/sprites/helm_hopliet.png",
            "kroon":"assets/sprites/helm_kroon.png" },
  haar:   { "kort":"assets/sprites/haar_kort.png",
            "lang":"assets/sprites/haar_lang.png",
            "kaal":"assets/sprites/haar_kaal.png",
            "vlecht":"assets/sprites/haar_vlecht.png" },
  baard:  { "geen":"assets/sprites/baard_geen.png",
            "baard":"assets/sprites/baard_baard.png",
            "snor":"assets/sprites/baard_snor.png" },
  schild: { "geen":"",
            "rond":"assets/sprites/schild_rond.png",
            "ovaal":"assets/sprites/schild_ovaal.png",
            "vierkant":"assets/sprites/schild_vierkant.png",
            "tower":"assets/sprites/schild_tower.png" },
  wapen:  { "zwaard":"assets/sprites/wapen_zwaard.png",
            "speer":"assets/sprites/wapen_speer.png",
            "boog":"assets/sprites/wapen_boog.png",
            "staf":"assets/sprites/wapen_staf.png" },
  cape:   { "geen":"assets/sprites/cape_geen.png",
            "kort":"assets/sprites/cape_kort.png",
            "lang":"assets/sprites/cape_lang.png" },
};

// Rendert een gelaagde pixel art held (RPG Maker MV paper doll).
// Laagvolgorde: base → cape → armor → schild → wapen → haar → baard → helm.
// Valt terug op bmSpriteSVG() als BM_PIXEL_ART=false of base-asset ontbreekt.
// Kiest de juiste base-sprite op basis van huid + geslacht.
function _bmBaseKey(cosm){
  const h = cosm.huid || "licht";
  return (cosm.geslacht === "vrouw") ? h + "_vrouw" : h;
}

// Versie-achtervoegsel voor sprite-bestanden → forceert verse download na een
// asset-wijziging (bump dit getal als je een PNG vervangt).
const SPRITE_VER = "v=3";

// CSS-filters per haarkleur (sprites zijn standaard blond in RPG Maker MV).
const BM_HAARKLEUR_FILTER = {
  "blond":  "none",
  "bruin":  "hue-rotate(-30deg) brightness(0.6) saturate(0.8)",
  "zwart":  "brightness(0.2) saturate(0.2)",
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
// Weergavekleur (swatch) per capekleur, afgestemd op de team-banierkleuren.
const BM_CAPEKLEUR_SWATCH = {
  "goud":"#d4af37","rood":"#b03a2e","blauw":"#2e6fb0",
  "groen":"#3a7a30","paars":"#6b2d8b","oranje":"#c87533",
};

// Bouwt de gelaagde sprite-lagen als HTML-string.
// Z-index van achter naar voren (RPG Maker MV SV correct):
//   cape → wapen → base → baard → haar → pantser → schild → helm.
// Het wapen valt áchter het lichaam (achterste hand), vóór de cape; het schild
// valt vóór het pantser; de helm is de bovenste laag.
// extraClass op de buitenste div (bv. "pixel-preview" voor statische weergave).
function _bmPixelLayers(cosm, dirCls, extraClass="") {
  const baseSrc = PIXEL_ASSETS.bases[_bmBaseKey(cosm)];
  if (!baseSrc) return null;
  function L(src, cls="", style="") {
    if (!src) return "";
    const url = src + (src.indexOf("?")<0 ? "?"+SPRITE_VER : "");
    const st = `background-image:url('${url}')${style?";"+style:""}`;
    return `<div class="sprite-layer${cls}" style="${st}"></div>`;
  }
  const haarFilter = BM_HAARKLEUR_FILTER[cosm.haarkleur||"blond"] || "none";
  const haarStyle = haarFilter !== "none" ? `filter:${haarFilter}` : "";
  const capeFilter = BM_CAPEKLEUR_FILTER[cosm.capekleur||"goud"] || "none";
  const capeStyle = capeFilter !== "none" ? `filter:${capeFilter}` : "";
  const A = PIXEL_ASSETS;
  // Gezichtshaar: 'baardsnor' stapelt baard + snor; anders één laag.
  const baardId = cosm.baard||"geen";
  const baardLayers = baardId==="baardsnor"
    ? L(A.baard.baard,"",haarStyle)+L(A.baard.snor,"",haarStyle)
    : L(A.baard[baardId],"",haarStyle);
  return `<div class="pixel-hero ${dirCls}${extraClass?" "+extraClass:""}">
    ${L(A.cape[cosm.cape||"geen"],"",capeStyle)}
    ${L(A.wapen[cosm.wapen||"zwaard"]," sprite-weapon")}
    ${L(baseSrc)}
    ${baardLayers}
    ${L(A.haar[cosm.haar||"kort"],"",haarStyle)}
    ${L(A.armor[cosm.armor||"licht"])}
    ${L(A.schild[cosm.schild||"rond"])}
    ${L(A.helm[cosm.helm||"standard"])}
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

// Klasse → formatiepositie (voor/midden/achter)
const BM_FORM_POS={
  front:["hopliet","spartaan","centurio"],
  mid:["priester","genie"],
  back:["boogschutter","cavalerie","verkenner"]
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
function bmAnimAv(pid,cls,ms){bmAnimTmp(el(bmAvId(pid)),cls,ms);}
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

// Bouw formatie-HTML voor één team
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
function bmFormationHTML(team){
  const members=Object.entries(BM_PLAYERS).filter(([,p])=>p.team===team);
  const round=BM_STATE.round||{};
  const cols={front:[],mid:[],back:[]};
  for(const[pid,p]of members){
    const pos=bmFormPos(p.class);
    const hasAnswered=p.answeredRound===round.n;
    const hasLocked=!!p.lockedAction;
    const dotCls=hasAnswered?"on":hasLocked?"locked":"";
    const dead=BM_META?.heroMode&&p.isAlive===false;
    cols[pos].push(`<div class="bm-av cls-${p.class||""}${dead?" bm-hero-dead":""}" id="${bmAvId(pid)}" title="${esc(p.name)} · ${esc(bmClsNmThemed(p.class||""))}">
      ${renderPixelHero(pid, p, team)}
      <div class="bm-dot ${dotCls}"></div>
      <div class="avn">${esc(p.name)}</div>
      <div class="avncls">${esc(bmClsNmThemed(p.class||""))}</div>
      ${bmHeroHpHTML(p)}
    </div>`);
  }
  // Team A: back | mid | front (front rechts, naar vijand)
  // Team B: front | mid | back (front links, naar vijand)
  const order=team==="A"?["back","mid","front"]:["front","mid","back"];
  return order.map(k=>cols[k].length
    ?`<div class="bm-fcol">${cols[k].join("")}</div>`
    :""
  ).join("");
}

// (Her)bouw het volledige slagveld (aangeroepen na speler-update of ronde-start)
function bmBuildBattlefield(){
  const fA=el("bmFormA"),fB=el("bmFormB");
  // Herbouw formatie als samenstelling of participatiestatus wijzigt
  const hash=Object.entries(BM_PLAYERS).map(([id,p])=>
    id+":"+p.class+":"+p.team+":"+(p.answeredRound||0)+":"+(p.lockedAction?"L":"")
    +":"+(p.hp??"")+":"+(p.armor||0)+":"+(p.isAlive===false?"D":"")+":"+(p.respawnMeter||0)
  ).sort().join("|");
  if(hash!==_bmFormHash){
    _bmFormHash=hash;
    if(fA)fA.innerHTML=bmFormationHTML("A");
    if(fB)fB.innerHTML=bmFormationHTML("B");
  }
  const field=el("bmField");
  if(field){
    // Landscape-thema
    ["bm-bg-roman","bm-bg-greek","bm-bg-gods"].forEach(cl=>field.classList.remove(cl));
    field.classList.add(bmBgTheme(BM_META?.theme));
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
  const{events=[],efA=0,efB=0,healA=0,healB=0,winner}=entry;

  // Drijvende totaalgetallen
  if(efA>0)setTimeout(()=>bmFloat("-"+efA,"#e05555",0),500);
  if(efB>0)setTimeout(()=>bmFloat("-"+efB,"#e05555",1),550);
  if(healA>0)setTimeout(()=>bmFloat("+"+healA,"var(--green-bright)",2),600);
  if(healB>0)setTimeout(()=>bmFloat("+"+healB,"var(--green-bright)",3),650);

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
    },delay);
  }

  // Eind-animaties (overwinning / nederlaag)
  if(winner==="A"||winner==="B"){
    const loser=winner==="A"?"B":"A";
    setTimeout(()=>{bmAnimTeam(winner,"anim-win",1400);bmAnimTeam(loser,"anim-lose",1300);bmConfetti();},900);
  }
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
    for(const[pid,p]of Object.entries(players)){
      const action=p.lockedAction;
      if(!action||action.type==="combo")continue;
      const cls=BM_CLASSES.find(c=>c.id===p.class);
      const abl=cls?.abilities.find(a=>a.id===action.abilityId);
      if(!abl)continue;
      const mt=p.team,et=mt==="A"?"B":"A";
      const fx=bmCalcAbilityEffect(p,cls,abl);
      if(fx.bypass)  from[mt].bypassDmg+=fx.dmg;
      else           from[mt].dmg+=fx.dmg;
      from[mt].shldRemove+=fx.shldRemove;
      for_[mt].shld+=fx.shld;
      for_[mt].heal+=fx.heal;
      for_[mt].teamBE+=fx.teamBE;
      pUpd[pid]={be:Math.max(0,(p.be||0)-(action.cost||0)+(fx.selfBE||0)),
                 damage:(p.damage||0)+fx.dmg, healing:(p.healing||0)+fx.heal, lockedAction:null};
      events.push({pid,abilityId:abl.id,team:mt,dmg:fx.dmg,heal:fx.heal,shld:fx.shld,
                   cls:p.class,anim:bmAblAnim(abl.type)});
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
        const prev=pUpd[pid]||{be:p.be||0,damage:p.damage||0,healing:p.healing||0};
        pUpd[pid]={...prev,be:Math.max(0,prev.be-(combo.cost||4)),lockedAction:null};
      }
      events.push({type:"combo",comboId:combo.id,team:mt,pids:[pa[0],pb[0]]});
    }

    // Pas 3: teamBE verdelen over alle teamgenoten
    for(const[pid,p]of Object.entries(players)){
      const bonus=for_[p.team]?.teamBE||0;
      if(!bonus)continue;
      const prev=pUpd[pid]||{be:p.be||0,damage:p.damage||0,healing:p.healing||0,lockedAction:null};
      pUpd[pid]={...prev,be:(prev.be)+bonus};
    }

    // Schrijf spelerupdates
    for(const[pid,upd]of Object.entries(pUpd)){
      await fbDB.ref("rooms/"+BM_CODE+"/players/"+pid).update(upd);
    }

    // Berekening effectieve schade (schild absorbeert, bypass negeert schild)
    const shldA=Math.max(0,for_.A.shld-from.B.shldRemove);
    const shldB=Math.max(0,for_.B.shld-from.A.shldRemove);
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
    const newHA=Math.max(0,Math.min(tA.maxHealth,tA.health-armyDmgA+for_.A.heal));
    const newHB=Math.max(0,Math.min(tB.maxHealth,tB.health-armyDmgB+for_.B.heal));
    await fbDB.ref("rooms/"+BM_CODE+"/teams").update({"A/health":newHA,"B/health":newHB});
    const logWinner=newHA<=0?"B":newHB<=0?"A":null;
    const roundParticipants=Object.values(players).filter(p=>p.answeredRound===roundN).length;
    fbDB.ref("rooms/"+BM_CODE+"/log").push({round:roundN,events,efA,efB,healA:for_.A.heal,healB:for_.B.heal,newHA,newHB,winner:logWinner,participants:roundParticipants});

    // Mastery bijhouden in identities (fire-and-forget)
    bmUpdateMastery(players,pUpd,events);

    if(newHA<=0||newHB<=0){
      await fbDB.ref("rooms/"+BM_CODE+"/state").update({status:"finished",winner:newHA<=0?"B":"A"});
      return;
    }
    await bmDistributeQs(roundN+1);
    bmHostStartTimer();
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
  if(fbDB)fbDB.ref("rooms/"+BM_CODE+"/state").update({status:"finished",winner:"_stopped"});
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

/* ---- EINDE GEVECHT → AWARD-CEREMONY ---- */
let BM_AWARD_DATA=null,BM_AWARD_STEP=0,BM_AWARD_TIMER=null;
let BM_LOG=null;

function bmHostResult(){
  cleanup();
  BM_PAUSED=false;
  // Sla spelerdata op vóór BM_PLAYERS wordt gereset
  BM_AWARD_DATA={winner:BM_STATE.winner,all:Object.values(BM_PLAYERS)};
  go("battleHostAwards");
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
    {nm:"Meeste Schade",    emoji:"⚔️",  player:byDmg[0]||null,  value:byDmg[0]?(byDmg[0].damage||0)+" schade":""},
    {nm:"Beste Verdediger", emoji:"🛡️",  player:p2(shldTop),      value:shldTop?shldTop[1]+" schild-acties":""},
    {nm:"Beste Support",    emoji:"💚",  player:byHeal[0]||null,  value:byHeal[0]?(byHeal[0].healing||0)+" healing":""},
    {nm:"Scholar",          emoji:"📚",  player:byAcc[0]||null,   value:byAcc[0]?Math.round((byAcc[0].correct||0)/((byAcc[0].correct||0)+(byAcc[0].wrong||0))*100)+"%":""},
    {nm:"Snelste Denker",   emoji:"⚡",  player:bySpd[0]||null,   value:bySpd[0]?Math.round((bySpd[0].totalResponseMs||0)/(bySpd[0].respondCount||1)/100)/10+"s gem.":""},
    {nm:"Beste Teamspeler", emoji:"🤝",  player:p2(cmbTop),       value:cmbTop?cmbTop[1]+" combo's":""},
  ];
}

function bmComputeAnalytics(players,log){
  const logEntries=Object.values(log||{}).sort((a,b)=>(a.round||0)-(b.round||0));
  const maxHP=(BM_TEAMS?.A?.maxHealth||BM_META?.armyHealth||100);
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
  return{hpTimeline,topMissed,avgAcc,maxHP,players};
}

function bmHPChart(timeline,maxHP){
  if(!timeline.length)return`<div class="note" style="text-align:center">Geen rondedata beschikbaar.</div>`;
  const W=320,H=100,n=timeline.length;
  const px=i=>32+i*(W-42)/Math.max(1,n-1);
  const py=v=>H-12-(Math.max(0,v)/maxHP)*(H-22);
  const ptA=timeline.map((e,i)=>px(i)+","+py(e.hA)).join(" ");
  const ptB=timeline.map((e,i)=>px(i)+","+py(e.hB)).join(" ");
  const step=Math.max(1,Math.floor(n/7));
  const labels=timeline.map((e,i)=>{if(i%step!==0&&i!==n-1)return"";
    return`<text x="${px(i)}" y="${H-2}" fill="var(--muted)" font-size="8" text-anchor="middle">${e.round}</text>`;}).join("");
  const colA="var(--teamA)",colB="var(--teamB)";
  return`<svg viewBox="0 0 ${W} ${H}" width="100%" style="max-height:100px" xmlns="http://www.w3.org/2000/svg">
    <line x1="32" y1="${py(0)}" x2="${W-10}" y2="${py(0)}" stroke="var(--stone4)" stroke-width="1"/>
    <line x1="32" y1="${py(maxHP*.5)}" x2="${W-10}" y2="${py(maxHP*.5)}" stroke="var(--stone4)" stroke-width="1" stroke-dasharray="3,3"/>
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
    stage.innerHTML=`<div style="text-align:center"><div style="font-size:48px">📊</div>
      <h2 style="color:var(--hi-bright);margin:10px 0">Klassenoverzicht</h2>
      <div class="note">Momentje…</div></div>`;
    BM_AWARD_TIMER=setTimeout(()=>go("battleHostAnalytics"),1500);
    return;
  }

  const award=awards[idx];
  const p=award.player;
  if(!p||!p.name){BM_AWARD_STEP++;bmNextAward();return;} // geen winnaar → oversla

  stage.innerHTML=`<div class="bm-award-card">
    <div style="font-size:36px">${award.emoji}</div>
    <div style="font-size:14px;color:var(--muted);letter-spacing:.06em;text-transform:uppercase;margin-bottom:4px">${esc(award.nm)}</div>
    ${bmAvatarSVG(bmAvatarMerge(p.avatar),80)}
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
    <button class="btn btn-gold" style="flex:1" onclick="bmNextAward()">Volgende ▶</button>
    <button class="btn" onclick="go('battleHostAnalytics')">Sla over →</button>
  </div>
  ${foot()}`);
  try{
    if(fbDB&&BM_CODE){const snap=await fbDB.ref("rooms/"+BM_CODE+"/log").once("value");BM_LOG=snap.val()||{};}
  }catch(e){BM_LOG={};}
  if(!el("bmAwardStage"))return;
  BM_AWARD_DATA.awards=bmComputeAwards(BM_AWARD_DATA.all,BM_LOG);
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
  <div style="padding:0 16px 8px">
    <button class="btn btn-block" onclick="bmExportCSV()">📥 Exporteer CSV</button>
  </div>
  ${foot()}`);
  if(!BM_LOG&&fbDB&&BM_CODE){
    try{const snap=await fbDB.ref("rooms/"+BM_CODE+"/log").once("value");BM_LOG=snap.val()||{};}catch(e){BM_LOG={};}
  }
  const content=el("bmAnalContent");if(!content)return;
  const an=bmComputeAnalytics(players,BM_LOG);

  if(BM_ANALYTICS_TAB==="klas"){
    const chart=bmHPChart(an.hpTimeline,an.maxHP);
    const missedHTML=an.topMissed.length
      ?an.topMissed.map(w=>`<div style="display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid var(--stone4)">
          <div><div style="font-size:13px">${esc(w.p)}</div><div style="font-size:11px;color:var(--muted)">${esc(w.a)}</div></div>
          <div style="color:var(--acc2);font-weight:700;flex:0 0 auto;margin-left:8px">${w.c}×</div></div>`).join("")
      :`<div class="note">Geen gemiste woorden bijgehouden (vereist speeldata uit dit gevecht).</div>`;
    content.innerHTML=`
    <div class="panel">
      <div class="eyebrow l">HP-verloop per ronde</div>
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
          ${bmAvatarSVG(bmAvatarMerge(p.avatar),24)}
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
      ${bmAvatarSVG(bmAvatarMerge(p.avatar),60)}
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
    <input id="bmJC" type="text" placeholder="ABCD" style="text-transform:uppercase;font-size:26px;text-align:center;letter-spacing:.2em" maxlength="4" oninput="this.value=this.value.toUpperCase()">
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
    // late join: wijs toe aan kleinste team
    const ps=await fbDB.ref("rooms/"+code+"/players").once("value");
    const all=Object.values(ps.val()||{});
    const cA=all.filter(p=>p.team==="A").length,cB=all.filter(p=>p.team==="B").length;
    team=cA<=cB?"A":"B";
  }
  const pd={name:BM_IDENT.name,color:BM_IDENT.color||P.color,avatar:BM_IDENT.avatar||P.avatar,
    team,class:null,be:0,correct:0,wrong:0,damage:0,healing:0,
    answeredRound:isPlaying?(stateSnap.round?.n||0):- 1, // sla huidige ronde over bij late join
    lockedAction:null,online:true,
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
    ${bmAvatarSVG(bmAvatarMerge(BM_IDENT?.avatar),56)}
    <div style="flex:1">
      <div style="font-size:18px;font-weight:700">${esc(BM_IDENT?.name||"")}</div>
      <div class="pill" style="margin:4px 0">Niveau ${bmCalcLevel(BM_IDENT?.xp||0).level} · ${esc(bmCalcLevel(BM_IDENT?.xp||0).title)}</div>
      <div class="note">Code: ${BM_CODE}</div>
    </div>
    <button class="btn" onclick="go('battleAvatarEdit')" title="Avatar aanpassen" style="flex:0 0 auto;padding:6px 10px">${iconSVG("column",18,"currentColor")}</button>
  </div>
  <div class="panel">
    <div class="eyebrow l">Kies je klasse</div>
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
  BM_MY_CLASS=cid;
  // mastery-bonus: ★★★+ geeft +1 starting BE (minimale spelbonus)
  const ms=bmCalcMastery(BM_IDENT?.classHistory?.[cid]);
  fbDB.ref("rooms/"+BM_CODE+"/players/"+BM_PID).update({class:cid,masteryBonus:ms>=3?1:0});
  toast("Klasse gekozen",bmClsName(cid)+(ms>=3?" · +1 BE mastery-bonus":""));
  SCREENS.battlePlayerLobby();
}

/* ---- SCHERM: battlePlayerGame ---- */
SCREENS.battlePlayerGame = function(){
  bmApplyTheme(BM_META?.theme);
  BM_ANSWERED=false;BM_ACTION_LOCKED=false;BM_MY_BE=0;BM_MY_Q=null;
  H(`<div class="bm-player-wrap">
    <div class="bm-player-field" style="position:relative">
      <div id="bmField" class="${bmBgTheme(BM_META?.theme)}" style="${bmArenaBgStyle()}">
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
      }
    });
  const rM=fbDB.ref("rooms/"+BM_CODE+"/players/"+BM_PID),
    fM=rM.on("value",s=>{const p=s.val();if(p){BM_MY_BE=p.be||0;BM_MY_CLASS=p.class||null;BM_MY_TEAM=p.team||null;BM_ACTION_LOCKED=!!p.lockedAction;BM_ANSWERED=p.answeredRound===(BM_STATE.round?.n);BM_MY_CORRECT=p.correct||0;BM_MY_WRONG=p.wrong||0;}bmPlayerRender();});
  const rT=fbDB.ref("rooms/"+BM_CODE+"/teams"),
    fT=rT.on("value",s=>{BM_TEAMS=s.val()||{};bmPlayerRender();});
  BM_UNSUBS=[()=>rP.off("value",fP),()=>rR.off("value",fR),()=>rSt.off("value",fSt),()=>rM.off("value",fM),()=>rT.off("value",fT)];
  bmSubscribeLog(BM_CODE);
  bmBuildBattlefield();
};
function bmPlayerRender(){
  const root=el("bmPR"); if(!root)return;
  const round=BM_STATE.round||{};
  const tl=round.deadline?Math.max(0,Math.round((round.deadline-Date.now())/1000)):0;
  const tA=BM_TEAMS.A||{health:100,maxHealth:100},tB=BM_TEAMS.B||{health:100,maxHealth:100};
  function miniBar(nm,team,d){
    const scale=d.maxHealth?Math.max(0,d.health/d.maxHealth):0;
    const col=team==="A"?"var(--teamA)":"var(--teamB)";
    return `<div style="display:flex;align-items:center;gap:8px">
      <span style="color:${col};font-size:12px;width:36px">${nm}</span>
      <div style="flex:1;height:8px;border-radius:4px;background:rgba(0,0,0,.4);overflow:hidden">
        <div style="height:100%;width:100%;background:${col};transform:scaleX(${scale});transform-origin:left center;transition:transform .4s"></div>
      </div><span style="font-size:11px;color:var(--muted)">${d.health}</span>
    </div>`;
  }
  let content="";
  if(round.phase==="question"){
    if(BM_ANSWERED){
      content=`<div class="panel" style="text-align:center"><div style="font-size:40px">✅</div><div class="note">Wachten op andere spelers…</div></div>`;
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
        content=`<div class="panel"><div class="note warn">Kies eerst een klasse in de lobby voordat je een actie kunt uitvoeren.</div></div>`;
      } else {
        const teamClasses=BM_TEAMS[BM_MY_TEAM||"A"]?.classes||[];
        const availCombos=BM_META?.combos===false?[]:BM_COMBOS.filter(combo=>
          combo.classes.includes(BM_MY_CLASS)&&
          combo.classes.some(c=>c!==BM_MY_CLASS&&teamClasses.includes(c))
        );
        const tierDot=t=>t==="basic"?"●":t==="advanced"?"●●":"●●●";
        content=`<div class="panel">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
            <span style="font-weight:700;color:${cls.color}">${cls.nm}</span>
            <span style="color:var(--hi-bright)">⚡ ${BM_MY_BE} BE — ${tl}s</span>
          </div>
          ${cls.abilities.map(a=>{
            const cost=bmGetAbilityCost(cls,a);
            const ok=BM_MY_BE>=cost;
            return `<button class="tile" style="margin-bottom:6px;padding:11px 13px${ok?"":";opacity:.4;pointer-events:none"}" onclick="bmChooseAbility('${a.id}',${cost})">
              <div style="font-size:13px;font-weight:700">${a.nm} <span class="pill">${cost}&nbsp;BE</span> <span style="opacity:.6;font-size:10px">${tierDot(a.tier)}</span></div>
              <div class="note" style="margin-top:2px">${a.desc}</div>
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
  <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;padding-bottom:7px;border-bottom:1px solid var(--stone4)">
    ${miniBar(bmTeamNm("A"),"A",tA)}
    <span style="color:var(--muted2);font-size:11px">vs</span>
    ${miniBar(bmTeamNm("B"),"B",tB)}
  </div>
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
    <span class="pill">Ronde ${round.n||"—"}</span>
    <span style="color:var(--hi-bright)">⚡ ${BM_MY_BE} BE</span>
    <span style="color:var(--muted)">${tl}s</span>
  </div>
  ${content}`;
}
function bmWordKey(w){ return (w||"").replace(/[.#$\[\]\/]/g,"_").substring(0,80); }
function bmAnswer(idx){
  if(BM_ANSWERED||!BM_MY_Q)return;
  BM_ANSWERED=true;
  const ok=idx===BM_MY_Q.correctIdx;
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
  if(fast){ beGain+=cls?.passive?.type==="be_on_fast"?cls.passive.val:1; }
  // Responstijd meten (ms verstreken sinds start vraagfase)
  const elapsedMs=Math.max(200,at*1000-Math.max(0,round.deadline?round.deadline-Date.now():0));
  fbDB.ref("rooms/"+BM_CODE+"/players/"+BM_PID).once("value").then(s=>{
    const p=s.val()||{};
    const upd={
      answeredRound:round.n||0,
      be:(p.be||0)+beGain,
      correct:ok?(p.correct||0)+1:(p.correct||0),
      wrong:!ok?(p.wrong||0)+1:(p.wrong||0),
      totalResponseMs:(p.totalResponseMs||0)+elapsedMs,
      respondCount:(p.respondCount||0)+1,
    };
    if(!ok&&BM_MY_Q){
      // Gemist woord bijhouden voor analytics (host leest na afloop)
      const wk=bmWordKey(BM_MY_Q.la);
      const prev=p.missed?.[wk]||{c:0};
      upd["missed/"+wk+"/c"]=(prev.c||0)+1;
      upd["missed/"+wk+"/p"]=BM_MY_Q.la;
      upd["missed/"+wk+"/a"]=BM_MY_Q.options?.[BM_MY_Q.correctIdx]||"";
    }
    // Heldenmodus: gevallen held vult zijn herrijzingsmeter met goede antwoorden
    if(ok){
      const rs=bmRespawnProgress(p);
      if(rs){ Object.assign(upd,rs.upd); if(rs.revived){ beep("win"); toast("Je held herrijst!","Terug in de strijd met volle HP.",medalSVG("laurel",34)); } }
    }
    fbDB.ref("rooms/"+BM_CODE+"/players/"+BM_PID).update(upd);
  });
}
function bmChooseAbility(abilityId,cost){
  if(BM_ACTION_LOCKED||BM_MY_BE<cost)return;
  BM_ACTION_LOCKED=true;
  fbDB.ref("rooms/"+BM_CODE+"/players/"+BM_PID).update({lockedAction:{type:"ability",abilityId,cost}});
  const cls=BM_CLASSES.find(c=>c.id===BM_MY_CLASS);
  toast("Actie vergrendeld",cls?.abilities.find(a=>a.id===abilityId)?.nm||abilityId);
  bmPlayerRender();
}
function bmChooseCombo(comboId,cost){
  if(BM_ACTION_LOCKED||BM_MY_BE<cost)return;
  BM_ACTION_LOCKED=true;
  fbDB.ref("rooms/"+BM_CODE+"/players/"+BM_PID).update({lockedAction:{type:"combo",comboId,cost}});
  toast("Combo aangekondigd!",BM_COMBOS.find(c=>c.id===comboId)?.nm||comboId);
  bmPlayerRender();
}

/* ---- SCHERM: battleResult ---- */
SCREENS.battleResult = function(){
  const w=BM_STATE.winner;
  H(brand(false)+`
  <div class="scrhead"><button class="back" onclick="bmLeave();go('home')">${iconSVG("shield",20,"currentColor")}</button><h2>Gevecht voorbij</h2></div>
  <div class="panel" style="text-align:center">
    <div style="font-size:56px">${w==="A"||w==="B"?iconSVG(bmTeamIcon(w),56,"var(--team"+w+")"):"⚔️"}</div>
    <h2 style="color:var(--hi-bright);margin:8px 0">${w==="A"||w==="B"?esc(bmTeamNm(w))+" wint!":"Gevecht gestopt"}</h2>
  </div>
  <div id="bmXpResult" class="panel" style="text-align:center;color:var(--muted)">XP berekenen…</div>
  <button class="btn btn-gold btn-block lg" style="margin-top:14px" onclick="bmLeave();go('home')">Terug naar hoofdmenu</button>
  <button class="btn btn-block" style="margin-top:8px" onclick="bmLeave();go('battleProfile')">Mijn profiel bekijken</button>
  ${foot()}`);
  // XP toekennen (fire-and-forget; toont resultaat in #bmXpResult)
  bmAwardBattle().then(r=>{
    const box=el("bmXpResult"); if(!box)return;
    if(!r){box.textContent="";return;}
    const lvUp=r.levelUp?`<div style="color:var(--hi-bright);font-size:16px;margin-top:6px">🎉 Niveau omhoog! Je bent nu ${esc(r.newLv.title)} (${r.newLv.level})</div>`:"";
    const achHTML=r.earned.length?`<div style="margin-top:6px;color:var(--hi)">${r.earned.map(id=>{const a=ACHIEVEMENTS_DEF.find(x=>x.id===id);return a?"🏅 "+esc(a.nm):""}).join(" · ")}</div>`:"";
    box.innerHTML=`<div style="font-size:22px;font-weight:700;color:var(--hi-bright)">+${r.xpEarned} XP</div>
      <div style="font-size:12px;color:var(--muted);margin-top:2px">Totaal: ${BM_IDENT?.xp||r.newLv.xp} XP · Niveau ${r.newLv.level} · ${esc(r.newLv.title)}</div>
      ${lvUp}${achHTML}`;
  }).catch(()=>{const b=el("bmXpResult");if(b)b.textContent="";});
};

/* ---- SCHERM: battleProfile ---- */
SCREENS.battleProfile = function(){
  if(!BM_IDENT){go("battleIdentity");return;}
  const av=bmAvatarMerge(BM_IDENT.avatar);
  const xp=BM_IDENT.xp||0;
  const lv=bmCalcLevel(xp);
  const prog=Math.round(lv.progress*100);
  const battles=BM_IDENT.battles||0;
  const achs=BM_IDENT.achievements||[];
  const xpLeft=lv.next?lv.next.xp-xp:null;

  const masteryHTML=BM_CLASSES.map(c=>{
    const ms=bmCalcMastery(BM_IDENT.classHistory?.[c.id]);
    return `<div style="background:${c.color}18;border:1px solid ${c.color}44;border-radius:10px;padding:8px 4px;text-align:center">
      ${iconSVG(c.icon,20,c.color)}
      <div style="font-size:9px;color:var(--muted);margin:2px 0">${esc(c.nm)}</div>
      <div style="line-height:1">${bmStars(ms)}</div>
    </div>`;
  }).join("");

  const bmAchDef=ACHIEVEMENTS_DEF.filter(a=>a.mode==="battle"||["eerste_gevecht","overwinnaar","scholar","onbreekbaar","strateeg","commandant","combokunstenaar","legendarisch"].includes(a.id));
  const achHTML=bmAchDef.map(a=>{
    const got=achs.includes(a.id);
    if(a.secret&&!got) return `<div class="bm-ach locked"><div class="aic">${iconSVG("star",22,"var(--muted2)")}</div><div class="atx"><div class="anm">🔒 ???</div><div class="ads">Geheim eerbewijs</div></div></div>`;
    return `<div class="bm-ach${got?"":" locked"}">
      <div class="aic">${got?iconSVG(a.icon,24,"var(--hi)"):iconSVG(a.icon,22,"var(--muted2)")}</div>
      <div class="atx">
        <div class="anm">${got?"":"🔒 "}${esc(a.nm)}</div>
        <div class="ads">${esc(a.ds)}</div>
      </div>
    </div>`;
  }).join("");

  const from=history.state?.from||"battleHome";
  H(brand(false)+`
  <div class="scrhead">
    <button class="back" onclick="go('${from}')">${iconSVG("shield",20,"currentColor")}</button>
    <h2>Mijn profiel</h2>
  </div>
  <div class="panel" style="display:flex;gap:14px;align-items:center">
    <div style="flex:0 0 auto">${renderPixelHeroPreview(av) || bmAvatarSVG(av,72)}</div>
    <div style="flex:1;min-width:0">
      <div style="font-size:20px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(BM_IDENT.name||"")}</div>
      <div class="pill" style="margin:4px 0">Niveau ${lv.level} · ${esc(lv.title)}</div>
      <div style="font-size:12px;color:var(--muted)">${xp} XP · ${battles} gevecht${battles!==1?"en":""}</div>
      <div style="margin-top:6px">
        <div style="height:7px;border-radius:4px;background:rgba(0,0,0,.4);overflow:hidden">
          <div style="height:100%;width:${prog}%;background:linear-gradient(90deg,var(--hi-dim),var(--hi-bright));transition:width .5s"></div>
        </div>
        ${xpLeft!==null?`<div style="font-size:10px;color:var(--muted);margin-top:2px">${xpLeft} XP naar ${esc(lv.next.title)}</div>`:`<div style="font-size:10px;color:var(--hi);margin-top:2px">Maximaal niveau bereikt!</div>`}
      </div>
    </div>
  </div>
  <button class="btn btn-gold btn-block" onclick="BM_AV_RETURN='battleProfile';go('battleAvatarEdit')" style="margin-bottom:14px">Avatar aanpassen</button>
  <div class="eyebrow l">Class Mastery</div>
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:16px">${masteryHTML}</div>
  <div class="eyebrow l">Achievements (${achs.length}/${bmAchDef.length})</div>
  <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:16px">${achHTML}</div>
  ${foot()}`);
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

  function partSection(partId){
    const part=BM_AVATAR_PARTS[partId]; if(!part)return"";
    if(partId==="capekleur"){
      const sw=part.opts.map(o=>{
        const col=BM_CAPEKLEUR_SWATCH[o.id]||"#d4af37";
        return `<button title="${esc(o.nm)}"
          onclick="BM_AV_EDIT.capekleur='${o.id}';SCREENS.battleAvatarEdit()"
          style="width:34px;height:34px;border-radius:50%;background:${col};
          border:3px solid ${av.capekleur===o.id?"var(--hi-bright)":"transparent"};
          cursor:pointer;flex:0 0 auto"></button>`;
      }).join("");
      return`<div class="eyebrow l">${esc(part.nm)}</div>
        <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:14px">${sw}</div>`;
    }
    const opts=part.opts.map(o=>{
      const locked=!bmIsUnlocked(o,BM_IDENT);
      const sel=av[partId]===o.id;
      const preview=bmAvatarSVG({...av,[partId]:o.id},38);
      const title=locked?(o.requires?.level?"Niveau "+o.requires.level+" vereist":"Mastery ★★★+ vereist"):"";
      return `<button class="bm-opt${sel?" on":""}${locked?" locked":""}"
        ${locked?`disabled title="${title}"`:`onclick="BM_AV_EDIT['${partId}']='${o.id}';SCREENS.battleAvatarEdit()"`}>
        ${preview}
        <div class="onm">${esc(o.nm)}</div>
        ${locked?`<div style="font-size:9px;color:var(--muted2)">🔒</div>`:""}
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

/* ============================================================================
   WAR MODE — AANSLUITPUNTEN VOOR TOEKOMSTIGE UITBREIDINGEN
   Elke hook heeft een vaste signatuur. Implementeer de functie en roep hem
   aan op het aangegeven punt in de bestaande code (zie BATTLE_MODE.md).
   ============================================================================ */

// WAR MODE HOOK: morale(teamId, delta)
//   Pas moreel van teamId aan met delta. Moreel beinvloedt BE-winst per ronde.
//   Aansluitpunt: bmResolve() na elke reeks correcte antwoorden van een team.
// function morale(teamId, delta){}

// WAR MODE HOOK: momentum(teamId, delta)
//   Verhoog/verlaag momentum bij teamId. Hoge momentum -> tijdelijke schade-bonus.
//   Aansluitpunt: bmResolve() na opeenvolgende correcte antwoorden (streak).
// function momentum(teamId, delta){}

// WAR MODE HOOK: supplyCheck(teamId)
//   Controleer of teamId nog voorraden heeft. Geeft false terug als acties beperkt zijn.
//   Aansluitpunt: bmDistributeQs(), voor het uitdelen van abilities.
// function supplyCheck(teamId){}

// WAR MODE HOOK: fortificationApply(teamId, type)
//   Voeg een versterking toe aan teamId (bijv. "muur", "toren"). Fungeert als HP-buffer.
//   Aansluitpunt: bmResolve() action-fase, bij Fortify-ability (nog te implementeren).
// function fortificationApply(teamId, type){}

// WAR MODE HOOK: heroHealthUpdate(pid, delta)
//   Pas eigen HP van speler pid aan. Bij 0 HP -> respawn of uitschakeling.
//   Aansluitpunt: bmResolve() schadeverdeling, na teamHP-update.
// function heroHealthUpdate(pid, delta){}

// WAR MODE HOOK: objectiveCaptured(objectiveId, teamId)
//   Registreer verovering van doelpunt objectiveId door teamId.
//   Aansluitpunt: bmResolve() als aan capture-conditie wordt voldaan.
// function objectiveCaptured(objectiveId, teamId){}

// WAR MODE HOOK: fogOfWarUpdate(state)
//   Herbereken zichtbaarheidsstatus op basis van actuele spelstatus state.
//   Aansluitpunt: bmHostUpdatePlayers() en bmPlayerRender(), na elke roundupdate.
// function fogOfWarUpdate(state){}