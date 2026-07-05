/* ============================================================================
   CERTAMEN — app-logica
   ============================================================================ */
"use strict";

/* ---------- mini helpers ---------- */
const app = document.getElementById("app");
// Vervangt de scherminhoud. Scrollt NIET automatisch naar boven, zodat een
// in-place herrender (bv. een optie aanklikken) de scrollpositie behoudt.
// Echte navigatie scrollt wel naar boven via go().
function H(html){ app.innerHTML = html; }
function el(id){ return document.getElementById(id); }
function esc(s){ return String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c])); }
function rand(n){ return Math.floor(Math.random()*n); }
function pick(a){ return a[rand(a.length)]; }
function shuffle(a){ a=a.slice(); for(let i=a.length-1;i>0;i--){ const j=rand(i+1); [a[i],a[j]]=[a[j],a[i]]; } return a; }
function clamp(v,lo,hi){ return Math.max(lo,Math.min(hi,v)); }
function nowMs(){ return Date.now(); }
function norm(s){ return String(s||"").toLowerCase().trim().replace(/[.,;:!?'"()]/g,"").replace(/\s+/g," "); }
function code4(){ const A="ABCDEFGHJKLMNPQRSTUVWXYZ"; let s=""; for(let i=0;i<4;i++)s+=A[rand(A.length)]; return s; }
function uid(){ return "p"+Math.random().toString(36).slice(2,9); }

/* ---------- vocab: filtering & categories ---------- */
const CATS = [
  {id:"all",  nm:"Alle woorden", tags:null},
  {id:"verb", nm:"Werkwoorden",  tags:["verb"]},
  {id:"subst",nm:"Zelfst. nw.",  tags:["subst"]},
  {id:"adj",  nm:"Bijv. nw.",    tags:["adj"]},
  {id:"adv",  nm:"Bijwoorden",   tags:["adv"]},
  {id:"pron", nm:"Voornaamw.",   tags:["pron"]},
  {id:"prep", nm:"Voorzetsels",  tags:["prep"]},
  {id:"conj", nm:"Voegwoorden",  tags:["cj","vw"]},
];
function posMatch(w, catId){
  const c = CATS.find(x=>x.id===catId);
  if(!c || !c.tags) return true;
  const pos = String(w.pos||"").toLowerCase();
  return c.tags.some(t=>pos.includes(t));
}
// Some frequency entries are stem-form stubs ("pf. sum: zijn") — skip those as quiz words.
function usable(w){
  if(!w.la || !w.nl) return false;
  if(/^(pf|ppp|inf|imp)\./i.test(w.nl.trim())) return false;
  return true;
}
function catCount(list, catId){ return list.filter(w=>usable(w)&&posMatch(w,catId)).length; }
function baseList(lang){ return lang==="el" ? VOCAB_EL : VOCAB_LA; }

function buildPool(draft){
  if(draft.source==="custom"){
    return parseCustom(draft.customText);
  }
  let list = baseList(draft.lang).filter(usable);
  const lo = Math.min(draft.fromN, draft.toN), hi = Math.max(draft.fromN, draft.toN);
  list = list.filter(w => (w.f||0) >= lo && (w.f||0) <= hi);
  if(draft.cat && draft.cat!=="all") list = list.filter(w=>posMatch(w, draft.cat));
  // keep only what we need for the quiz
  return list.map(w=>({la:w.la, nl:w.nl, pos:w.pos||""}));
}
function parseCustom(text){
  const out=[];
  (text||"").split(/\r?\n/).forEach(line=>{
    line=line.trim(); if(!line) return;
    const m = line.split(/\s*(?:=|:|—|–|\t|;)\s*/);
    if(m.length>=2){ const la=m[0].trim(); const nl=m.slice(1).join(" / ").trim(); if(la&&nl) out.push({la,nl,pos:""}); }
  });
  return out;
}
function ansText(w){ return cleanNL(w.nl); }
function cleanNL(nl){ return String(nl||"").split(/\s*\|\s*|\s*;\s*/)[0].replace(/^\d+\.\s*/,"").trim(); }

function makeQuestion(pool){
  const w = pick(pool);
  const correct = ansText(w);
  const opts=[correct];
  const samePos = w.pos ? pool.filter(x=>x.pos===w.pos) : pool;
  const distPool = samePos.length >= 4 ? samePos : pool;
  for(const x of shuffle(distPool)){
    const a = ansText(x);
    if(!opts.some(o=>norm(o)===norm(a))){ opts.push(a); if(opts.length>=4) break; }
  }
  while(opts.length<2) opts.push("…");
  const shuffled = shuffle(opts);
  return { la:w.la, pos:w.pos, options:shuffled, correctIdx: shuffled.findIndex(o=>norm(o)===norm(correct)) };
}

/* ============================================================================
   AVATARS, MEDALS, ACHIEVEMENTS, PROFIEL (localStorage per leerling)
   ============================================================================ */
const AVATARS = [
  {id:"helmet", nm:"Helm",     cost:0,    icon:"helmet"},
  {id:"laurel", nm:"Lauwer",   cost:0,    icon:"laurel"},
  {id:"shield", nm:"Schild",   cost:0,    icon:"shield"},
  {id:"owl",    nm:"Uil",      cost:80,   icon:"owl"},
  {id:"horse",  nm:"Paard",    cost:80,   icon:"horse"},
  {id:"amphora",nm:"Amfoor",   cost:120,  icon:"amphora"},
  {id:"trident",nm:"Drietand", cost:150,  icon:"trident"},
  {id:"eagle",  nm:"Adelaar",  cost:200,  icon:"eagle"},
  {id:"crown",  nm:"Kroon",    cost:400,  icon:"crown"},
];
const COLORS = ["#c0392b","#2e6fb0","#e0b15a","#3f9d52","#8e44ad","#d35400","#16a085","#c44569","#2c89c9","#e08e3b"];

/* ---- XP-niveaus en rangen (10 niveaus) ---- */
const XP_LEVELS = [
  {level:1,  xp:0,    rank:"Tiro"},
  {level:2,  xp:100,  rank:"Miles"},
  {level:3,  xp:250,  rank:"Optio"},
  {level:4,  xp:500,  rank:"Signifer"},
  {level:5,  xp:900,  rank:"Aquilifer"},
  {level:6,  xp:1400, rank:"Centurio"},
  {level:7,  xp:2100, rank:"Praefectus"},
  {level:8,  xp:3000, rank:"Tribunus"},
  {level:9,  xp:4200, rank:"Legatus"},
  {level:10, xp:6000, rank:"Imperator"},
];
function calcLevel(xp){
  let cur=XP_LEVELS[0];
  for(const l of XP_LEVELS){if((xp||0)>=l.xp)cur=l;else break;}
  const next=XP_LEVELS.find(l=>l.level===cur.level+1)||null;
  const prog=next?Math.min(1,((xp||0)-cur.xp)/(next.xp-cur.xp)):1;
  return{...cur,next,progress:prog,prestige:next?null:calcPrestige(xp)};
}

/* ---- Legioensterren: XP-vooruitgang ná niveau 10 (Imperator) ----
   Voorkomt een harde eindstreep — een gemotiveerde leerling loopt nooit
   "klaar", maar de stap is bewust iets groter dan niveau 9→10 (1800 XP),
   zodat het als prestige aanvoelt i.p.v. als een snelle formaliteit. */
const PRESTIGE_XP_STEP = 3000;
function calcPrestige(xp){
  const base = XP_LEVELS[XP_LEVELS.length-1].xp; // 6000
  const over = Math.max(0,(xp||0)-base);
  const stars = Math.floor(over/PRESTIGE_XP_STEP);
  const intoNext = over-stars*PRESTIGE_XP_STEP;
  return { stars, xpForNext: base+(stars+1)*PRESTIGE_XP_STEP, progress: intoNext/PRESTIGE_XP_STEP };
}
// Herbruikbare XP-balkweergave: normale niveauvoortgang, of — op niveau 10 —
// Legioenster-voortgang i.p.v. een dode "max bereikt"-tekst. Gebruikt door
// SCREENS.collection (games.js) en SCREENS.battleProfile (battle.js).
function xpBarInfo(lv){
  if(lv.next) return { pct:Math.round(lv.progress*100), label:"→ "+lv.next.xp+" XP voor "+(lv.next.title||lv.next.rank), starSuffix:"" };
  const p=lv.prestige||calcPrestige(0);
  const label = p.stars>0
    ? "★"+p.stars+" · → "+p.xpForNext+" XP voor ★"+(p.stars+1)
    : "→ "+p.xpForNext+" XP voor eerste Legioenster ★";
  return { pct:Math.round(p.progress*100), label, starSuffix: p.stars>0?" ★"+p.stars:"" };
}

/* ---- Data-gedreven achievement-definities ---- */
const _BM_CLS_IDS = ["hopliet","spartaan","boogschutter","cavalerie","priester","centurio","genie","verkenner"];
const _BM_CLS_NMS = {hopliet:"Hopliet",spartaan:"Spartaan",boogschutter:"Boogschutter",cavalerie:"Cavalerie",priester:"Priester",centurio:"Centurio",genie:"Genie",verkenner:"Verkenner"};
const ACHIEVEMENTS_DEF = [
  // Algemeen
  {id:"eerste_stap",    nm:"Eerste stap",      ds:"Speel voor het eerst Certamen",               icon:"helmet", cat:"algemeen"},
  {id:"woordenkenner",  nm:"Woordenkenner",     ds:"100 vragen goed beantwoord",                  icon:"owl",    cat:"algemeen"},
  {id:"taalmeester",    nm:"Taalmeester",       ds:"500 vragen goed beantwoord",                  icon:"crown",  cat:"algemeen"},
  {id:"veelzijdig",     nm:"Veelzijdig",        ds:"Alle vier de modi gespeeld",                  icon:"amphora",cat:"algemeen"},
  {id:"veteraan_all",   nm:"Veteraan",          ds:"50 spellen gespeeld",                         icon:"eagle",  cat:"algemeen"},
  {id:"snelle_geest",   nm:"Snelle geest",      ds:"10 vragen op rij goed beantwoord",            icon:"torch",  cat:"algemeen"},
  // Touwtrekken
  {id:"eerste_bloed",   nm:"Eerste bloed",      ds:"Je eerste Touwtrekken gewonnen",              icon:"shield", cat:"klassiek"},
  {id:"anker",          nm:"Ankerman/-vrouw",   ds:"5 Touwtrekkens gewonnen",                    icon:"laurel", cat:"klassiek"},
  // Marathon
  {id:"doorzetter",     nm:"Doorzetter",        ds:"Eerste Marathon gespeeld",                    icon:"horse",  cat:"klassiek"},
  {id:"finisher",       nm:"Finisher",          ds:"Eerste Marathon gewonnen",                    icon:"laurel", cat:"klassiek"},
  // Snelvuur
  {id:"vonk",           nm:"Vonk",              ds:"Eerste Snelvuur gespeeld",                    icon:"torch",  cat:"klassiek"},
  {id:"bliksem",        nm:"Bliksem",           ds:"Eerste plek in Snelvuur",                     icon:"star",   cat:"klassiek"},
  {id:"ontembaar",      nm:"Ontembaar",         ds:"Drie keer eerste plek in Snelvuur",           icon:"crown",  cat:"klassiek"},
  // Battle Mode — algemeen
  {id:"eerste_gevecht", nm:"Eerste gevecht",    ds:"Eerste Battle Mode gespeeld",                 icon:"helmet", cat:"battle", mode:"battle"},
  {id:"overwinnaar",    nm:"Overwinnaar",        ds:"Eerste Battle Mode gewonnen",                 icon:"laurel", cat:"battle", mode:"battle"},
  {id:"scholar",        nm:"Scholar",           ds:"≥90% accuratesse in een gevecht (min. 5 vr.)",icon:"owl",    cat:"battle", mode:"battle"},
  {id:"onbreekbaar",    nm:"Onbreekbaar",       ds:"Gewonnen zonder health-verlies van je team",  icon:"shield", cat:"battle", mode:"battle"},
  {id:"strateeg",       nm:"Strateeg",          ds:"5 verschillende klassen gespeeld",            icon:"column", cat:"battle", mode:"battle"},
  {id:"commandant",     nm:"Commandant",        ds:"Alle 8 klassen minstens één keer gespeeld",   icon:"eagle",  cat:"battle", mode:"battle"},
  {id:"combokunstenaar",nm:"Combokunstenaar",   ds:"10 combo-abilities uitgevoerd",               icon:"trident",cat:"battle", mode:"battle"},
  {id:"legendarisch",   nm:"Legendarisch",      ds:"Niveau 10 (Imperator) bereikt",              icon:"crown",  cat:"battle", mode:"battle"},
  // Klasse-mastery (ster 3 en ster 5, voor alle 8 klassen)
  ..._BM_CLS_IDS.flatMap(c=>[
    {id:"vet_"+c,  nm:"Veteraan "+_BM_CLS_NMS[c],  ds:"Ster 3 bereikt als "+_BM_CLS_NMS[c],  icon:"helmet", cat:"mastery", mode:"battle"},
    {id:"mees_"+c, nm:"Meester "+_BM_CLS_NMS[c],   ds:"Ster 5 bereikt als "+_BM_CLS_NMS[c],  icon:"crown",  cat:"mastery", mode:"battle"},
  ]),
  {id:"grootmeester",   nm:"Grootmeester",       ds:"Alle 8 klassen op 5★ beheersing",              icon:"crown",  cat:"mastery", mode:"battle"},
  // Boss Battle
  {id:"eerste_baas",    nm:"Baasoverwinnaar",    ds:"Je eerste baasgevecht gewonnen",              icon:"shield",  cat:"boss", mode:"battle"},
  {id:"baas_trio",      nm:"Drie Monsters",      ds:"Hydra, Cycloop en Minotaurus elk verslagen",  icon:"trident", cat:"boss", mode:"battle"},
  {id:"baas_heroic",    nm:"Heroïsch",           ds:"Een baas verslagen op Heroic",                icon:"torch",   cat:"boss", mode:"battle"},
  {id:"baas_legendary", nm:"Legendarische Jacht",ds:"Een baas verslagen op Legendary",             icon:"crown",   cat:"boss", mode:"battle"},
  {id:"eenling",        nm:"Eenling",            ds:"Een baas alleen verslagen",                   icon:"star",    cat:"boss", mode:"battle"},
  // Total War / Training Mode
  {id:"eerste_training",nm:"Thuisfront",         ds:"Je eerste Training Mode-sessie",              icon:"amphora", cat:"totalwar", mode:"battle"},
  {id:"drie_sporen",    nm:"Alleskunner",        ds:"Bijgedragen aan garnizoen, muur én toren",    icon:"column",  cat:"totalwar", mode:"battle"},
  {id:"steenhouwer",    nm:"Steenhouwer",        ds:"100 bouwpunten bijgedragen aan Total War",    icon:"helmet",  cat:"totalwar", mode:"battle"},
  {id:"bouwmeester",    nm:"Bouwmeester",        ds:"1000 bouwpunten bijgedragen aan Total War",   icon:"eagle",   cat:"totalwar", mode:"battle"},
  {id:"belegeraar",     nm:"Belegeraar",         ds:"Een belegering gewonnen als aanvaller",       icon:"shield",  cat:"totalwar", mode:"battle"},
  // Langetermijn (spreiding belonen, niet snelheid)
  {id:"week_vol",       nm:"Wekelijkse Discipline",ds:"Op 5 verschillende dagen binnen 1 week gespeeld", icon:"torch", cat:"algemeen"},
  {id:"dertig_dagen",   nm:"Vaste Klant",        ds:"In totaal op 30 verschillende dagen gespeeld", icon:"laurel", cat:"algemeen"},
  // Geheimen
  {id:"geheim_rij",   nm:"???", ds:"Geheim eerbewijs",        icon:"star", secret:true, cat:"geheim"},
  {id:"geheim_groot", nm:"???", ds:"Geheim eerbewijs",        icon:"star", secret:true, cat:"geheim"},
  {id:"geheim_heal",  nm:"???", ds:"Geheim eerbewijs",        icon:"star", secret:true, cat:"geheim"},
  {id:"geheim_norage",nm:"???", ds:"Geheim eerbewijs",        icon:"star", secret:true, cat:"geheim", mode:"battle"},
];
// Volgorde = ook de weergavevolgorde op het profielscherm en in de
// avatar-editor (zie battle-data.js: BM_AVATAR_PARTS.goud).
const ACH_CATEGORIES = {
  algemeen: "Algemeen",
  klassiek: "Klassieke Spellen",
  battle:   "Battle Mode",
  mastery:  "Klasse-mastery",
  boss:     "Boss Battle",
  totalwar: "Total War",
  geheim:   "Geheimen",
};
// Compleet-check voor een eerbewijs-categorie (bv. voor het "gouden"
// avatar-onderdeel per categorie, zie bmIsUnlocked() in battle.js) —
// achievedIds moet zowel P.achievements als BM_IDENT.achievements bevatten,
// want die twee arrays samen dekken alle categorieën.
function achCategoryComplete(cat, achievedIds){
  const items = ACHIEVEMENTS_DEF.filter(a=>a.cat===cat);
  return items.length>0 && items.every(a=>achievedIds.includes(a.id));
}
// Groepeert een lijst eerbewijs-items per categorie (ACH_CATEGORIES-volgorde)
// in ingeklapte <details>-secties — voorkomt dat het profielscherm één lange
// ononderbroken tegelmuur wordt naarmate er meer eerbewijzen bijkomen.
// renderItem(a) levert de HTML voor één item; leeg gebleven categorieën
// worden overgeslagen.
function achGroupsHTML(items, achievedIds, renderItem){
  return Object.keys(ACH_CATEGORIES).map(cat=>{
    const inCat = items.filter(a=>a.cat===cat);
    if(!inCat.length) return "";
    const gotN = inCat.filter(a=>achievedIds.includes(a.id)).length;
    const complete = gotN===inCat.length;
    return `<details style="margin-bottom:8px">
      <summary class="eyebrow l" style="cursor:pointer;list-style:revert">${complete?"⭐ ":""}${ACH_CATEGORIES[cat]} (${gotN}/${inCat.length})</summary>
      <div class="achgrid" style="margin-top:8px">${inCat.map(renderItem).join("")}</div>
    </details>`;
  }).join("");
}

/* ---- Profiel (localStorage) ---- */
const PKEY = "certamen_profile_v2";
function loadProfile(){
  const def = {
    name:"", color:COLORS[0], avatar:"helmet",
    coins:0, owned:["helmet","laurel","shield"],
    achievements:[], xp:0, level:1, rank:"Tiro",
    stats:{
      totalCorrect:0, totalWrong:0, currentStreak:0, bestStreak:0, totalCombos:0,
      tournamentsPlayed:0, tournamentsWon:0,
      marathonsPlayed:0,   marathonsWon:0,
      snelvuurPlayed:0,    snelvuurWon:0,
      battlesPlayed:0,     battlesWon:0,
      totalDamage:0,       totalHealing:0,
      playDates:[] // ISO-datums (YYYY-MM-DD), gededupliceerd — voor week_vol/dertig_dagen
    }
  };
  try{
    const v2=localStorage.getItem(PKEY);
    if(v2){
      const p=JSON.parse(v2);
      if(!p.stats) p.stats=def.stats;
      else p.stats=Object.assign({},def.stats,p.stats);
      return Object.assign({},def,p);
    }
    // Migreer van v1
    const v1=localStorage.getItem("certamen_profile_v1");
    if(v1){
      const o=JSON.parse(v1);
      def.coins=o.coins||0; def.owned=o.owned||def.owned;
      def.avatar=o.avatar||def.avatar; def.name=o.name||"";
      def.color=o.color||def.color;
      def.stats.totalCorrect=o.correct||0;
      def.stats.bestStreak=o.bestStreak||0;
      if(o.gamesPlayed?.touwtrekken) def.stats.tournamentsPlayed=1;
      if(o.gamesPlayed?.marathon)    def.stats.marathonsPlayed=1;
      if(o.gamesPlayed?.snelvuur)    def.stats.snelvuurPlayed=1;
      def.xp=Math.min(500,(o.correct||0)*2+(o.wins||0)*10);
      const lv=calcLevel(def.xp); def.level=lv.level; def.rank=lv.rank;
    }
    return def;
  }catch(e){ return def; }
}
function saveProfile(){ try{ localStorage.setItem(PKEY, JSON.stringify(P)); }catch(e){} }
let P = loadProfile();

function addCoins(n){ P.coins += n; if(P.coins<0)P.coins=0; saveProfile(); }
// skipSync=true: gebruik dit als de aanroeper de gedeelde Firebase-identiteit
// AL zelf heeft bijgewerkt (bv. bmAwardBattle, dat zijn eigen transaction
// gebruikt) — anders zou de xp-winst daar dubbel worden opgeteld.
function addXP(n, skipSync){
  if(!n||n<=0) return;
  recordPlayDay();
  P.xp=(P.xp||0)+n;
  const lv=calcLevel(P.xp);
  if(lv.level>(P.level||1)){
    P.level=lv.level; P.rank=lv.rank;
    setTimeout(()=>toast("Niveau omhoog!","Je bent nu "+lv.rank+" (niveau "+lv.level+")",medalSVG("crown",34)),400);
  } else { P.level=lv.level; P.rank=lv.rank; }
  saveProfile();
  if(!skipSync) syncXpDelta(n);
}

/* ============================================================================
   PROFIELSYNC BUITEN BATTLE MODE
   ----------------------------------------------------------------------------
   Het algemene profiel (P, dit bestand) is standaard puur lokaal (localStorage)
   en synct dus NIET vanzelf tussen toestellen — dat gold ook voor XP totdat
   dit hier werd toegevoegd. In plaats van een tweede identiteitssysteem te
   bouwen, hergebruiken we de identiteit die Battle Mode al heeft (klascode +
   zelf gekozen leerlingcode, /identities/{klas}/{lcode} in Firebase RTDB) —
   zie battle.js: bmIdentLoad/bmIdentSave/bmIdentGet/bmIdentDoLogin. Zodra een
   leerling die identiteit heeft (via Battle Mode aangemaakt, of hier gekoppeld),
   loopt P.xp automatisch gelijk met identities/{klas}/{lcode}.xp op elk
   toestel. Geen identiteit gekoppeld? Dan werkt alles gewoon lokaal, zoals
   voorheen — koppelen is nooit verplicht.
   ============================================================================ */
function profileIdentity(){ return (typeof bmIdentLoad==="function") ? bmIdentLoad() : null; }
function profileIsLinked(){ const id=profileIdentity(); return !!(id&&id.klascode&&id.leerlingcode); }

// Verhoog xp lokaal én (indien gekoppeld) in de gedeelde Firebase-identiteit
// via een transaction (voorkomt verloren updates bij bijna-gelijktijdig
// schrijven vanaf twee toestellen/tabbladen — zie battle.js: bmAwardBattle).
function syncXpDelta(n){
  if(!n) return;
  const id=profileIdentity(); if(!id||!id.klascode||!id.leerlingcode) return;
  if(typeof hasFirebase==="undefined"||!hasFirebase) return;
  try{
    if(typeof initFirebase==="function") initFirebase();
    if(typeof fbDB==="undefined"||!fbDB) return;
    fbDB.ref("identities/"+id.klascode+"/"+id.leerlingcode+"/xp").transaction(cur=>(cur||0)+n);
    if(typeof bmIdentSave==="function") bmIdentSave({...id, xp:(id.xp||0)+n});
    if(typeof BM_IDENT!=="undefined"&&BM_IDENT) BM_IDENT.xp=(BM_IDENT.xp||0)+n;
  }catch(e){}
}

// Haal de nieuwste xp uit Firebase en werk P.xp bij als dit toestel achterloopt
// (bv. na spelen op een ander toestel terwijl dit toestel/tabblad al open stond).
// rerenderScreen: alleen herrenderen als de speler nog op dat scherm staat.
async function syncProfileFromCloud(rerenderScreen){
  const id=profileIdentity(); if(!id||!id.klascode||!id.leerlingcode) return;
  if(typeof bmIdentGet!=="function") return;
  try{
    if(typeof initFirebase==="function") initFirebase();
    const d=await bmIdentGet(id.klascode,id.leerlingcode);
    if(d && typeof d.xp==="number" && d.xp!==P.xp){
      P.xp=d.xp;
      const lv=calcLevel(P.xp); P.level=lv.level; P.rank=lv.rank;
      saveProfile();
      if(typeof BM_IDENT!=="undefined"&&BM_IDENT) BM_IDENT.xp=d.xp;
      if(rerenderScreen && typeof _screen!=="undefined" && _screen===rerenderScreen
         && typeof SCREENS!=="undefined" && SCREENS[rerenderScreen]) SCREENS[rerenderScreen]();
    }
  }catch(e){}
}
/* ---- Speeldag-tracking (week_vol/dertig_dagen) — bewust op kalenderdagen,
   niet op sessies of antwoorden, zodat deze eerbewijzen alleen behaald worden
   door over tijd te spreiden, niet door in één avond te grinden. Aangeroepen
   vanuit addXP() (elke XP-gevende actie in elke modus telt als "gespeeld"). ---- */
function recordPlayDay(){
  const today=new Date().toISOString().slice(0,10);
  const arr=P.stats.playDates||(P.stats.playDates=[]);
  if(arr[arr.length-1]!==today){
    arr.push(today);
    if(arr.length>60) P.stats.playDates=arr.slice(-60); // cap groei, ruim boven de dertig_dagen-drempel
    saveProfile();
  }
}
function distinctDaysWithinLast(days){
  const arr=P.stats.playDates||[]; if(!arr.length) return 0;
  const cutoff=Date.now()-days*86400000;
  return arr.filter(d=>{ const t=Date.parse(d+"T00:00:00Z"); return !isNaN(t)&&t>=cutoff; }).length;
}
function checkAch(ctx={}){
  const got=[], s=P.stats;
  const add=(id,cond)=>{ if(cond&&!P.achievements.includes(id)){ P.achievements.push(id); got.push(id); } };
  const allP=s.tournamentsPlayed+s.marathonsPlayed+s.snelvuurPlayed+s.battlesPlayed;
  add("eerste_stap",   allP>=1);
  add("woordenkenner", s.totalCorrect>=100);
  add("taalmeester",   s.totalCorrect>=500);
  add("veelzijdig",    s.tournamentsPlayed>=1&&s.marathonsPlayed>=1&&s.snelvuurPlayed>=1&&s.battlesPlayed>=1);
  add("veteraan_all",  allP>=50);
  add("snelle_geest",  s.bestStreak>=10);
  add("eerste_bloed",  s.tournamentsWon>=1);
  add("anker",         s.tournamentsWon>=5);
  add("doorzetter",    s.marathonsPlayed>=1);
  add("finisher",      s.marathonsWon>=1);
  add("vonk",          s.snelvuurPlayed>=1);
  add("ontembaar",     s.snelvuurWon>=3);
  add("eerste_gevecht",s.battlesPlayed>=1);
  add("overwinnaar",   s.battlesWon>=1);
  add("combokunstenaar",s.totalCombos>=10);
  add("legendarisch",  (P.level||1)>=10);
  add("bliksem",       ctx.isFirst&&ctx.mode==="snelvuur");
  add("geheim_rij",    s.bestStreak>=10);
  add("geheim_groot",  ctx.largeGame);
  add("geheim_heal",   ctx.healOnly);
  add("week_vol",      distinctDaysWithinLast(7)>=5);
  add("dertig_dagen",  (s.playDates||[]).length>=30);
  if(got.length){
    saveProfile();
    got.forEach((id,i)=>setTimeout(()=>{ const a=ACHIEVEMENTS_DEF.find(x=>x.id===id); if(a)toastAch(a); },i*900));
  }
}

/* ---------- icon / medal art ---------- */
function iconSVG(name, size, color){
  const s=size||40, c=color||"var(--hi)";
  const W=`<svg viewBox="0 0 48 48" width="${s}" height="${s}" xmlns="http://www.w3.org/2000/svg">`;
  const P2={
    back:`<path d="M30 12L18 24l12 12" fill="none" stroke=""+c+"" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`,
    helmet:`<path d="M11 30c0-10 5-17 13-17s13 7 13 17v2H26l-1-6-2 6h-3l-2-6-1 6H11z" fill="${c}"/><path d="M22 10c1-2 4-2 5 0l1 4h-7z" fill="${c}" opacity=".7"/>`,
    laurel:`<path d="M24 8v30" stroke="${c}" stroke-width="2.5" fill="none"/><path d="M24 14c-5-3-9-2-11 1 4 0 7 1 11 4zM24 14c5-3 9-2 11 1-4 0-7 1-11 4zM24 22c-5-3-9-2-11 1 4 0 7 1 11 4zM24 22c5-3 9-2 11 1-4 0-7 1-11 4z" fill="${c}"/>`,
    shield:`<path d="M24 9c5 2 11 3 11 3v9c0 9-5 14-11 17-6-3-11-8-11-17v-9s6-1 11-3z" fill="${c}"/><path d="M24 16v18M16 22h16" stroke="rgba(0,0,0,.35)" stroke-width="2"/>`,
    owl:`<circle cx="24" cy="24" r="13" fill="${c}"/><circle cx="19" cy="22" r="4" fill="#15110a"/><circle cx="29" cy="22" r="4" fill="#15110a"/><circle cx="19" cy="22" r="1.6" fill="#fff"/><circle cx="29" cy="22" r="1.6" fill="#fff"/><path d="M22 27l2 2 2-2z" fill="#15110a"/>`,
    horse:`<path d="M14 36c0-9 4-14 9-16l-2-6 6 3c4 2 7 6 7 13v6h-4v-5l-3 2v3h-4v-4l-3 2v2z" fill="${c}"/>`,
    amphora:`<path d="M19 12h10l-2 4c3 2 5 6 5 11s-3 9-8 9-8-4-8-9 2-9 5-11z" fill="${c}"/><path d="M18 14c-2 1-3 3-2 5M30 14c2 1 3 3 2 5" stroke="${c}" stroke-width="2" fill="none"/>`,
    trident:`<path d="M24 10v28" stroke="${c}" stroke-width="3"/><path d="M16 12v6c0 3 3 4 8 4s8-1 8-4v-6" stroke="${c}" stroke-width="3" fill="none"/><path d="M16 12l-2-3M32 12l2-3" stroke="${c}" stroke-width="3"/>`,
    eagle:`<path d="M24 14l-3 5h6zM12 22c6-4 9-2 12 3 3-5 6-7 12-3-4 0-7 2-12 8-5-6-8-8-12-8z" fill="${c}"/><path d="M21 28h6l-2 9h-2z" fill="${c}"/>`,
    crown:`<path d="M12 32l-2-14 8 6 6-10 6 10 8-6-2 14z" fill="${c}"/><rect x="12" y="32" width="24" height="5" rx="1.5" fill="${c}" opacity=".75"/>`,
    column:`<rect x="16" y="12" width="16" height="4" fill="${c}"/><rect x="18" y="16" width="12" height="18" fill="${c}"/><rect x="14" y="34" width="20" height="4" fill="${c}"/><path d="M20 16v18M24 16v18M28 16v18" stroke="rgba(0,0,0,.3)" stroke-width="1.4"/>`,
    torch:`<path d="M24 10c4 5 7 8 7 12a7 7 0 01-14 0c0-3 2-5 4-8 .5 2 1.5 2.5 2 1 .5-3-1-4 1-5z" fill="${c}"/><rect x="22" y="28" width="4" height="10" rx="1.5" fill="${c}" opacity=".7"/>`,
    star:`<path d="M24 10l4 9 10 1-7 7 2 10-9-5-9 5 2-10-7-7 10-1z" fill="${c}"/>`,
  };
  return W+(P2[name]||P2.helmet)+`</svg>`;
}
function medalSVG(name, size){
  const s=size||64;
  const ring=`<defs><radialGradient id="rg" cx="38%" cy="32%" r="75%"><stop offset="0%" stop-color="#f6dd8e"/><stop offset="45%" stop-color="#d4af37"/><stop offset="100%" stop-color="#9c7c1f"/></radialGradient></defs>
    <circle cx="24" cy="24" r="22" fill="url(#rg)" stroke="#7a5410" stroke-width="1.5"/>`;
  return `<svg viewBox="0 0 48 48" width="${s}" height="${s}" xmlns="http://www.w3.org/2000/svg">${ring}${iconInner(name)}</svg>`;
}
function iconInner(name){
  // dark icon centred inside the gold medal
  const c="#5a3a0c";
  const raw = iconSVG(name, 30, c);
  // extract the inner paths, place with translate
  const inner = raw.replace(/^<svg[^>]*>/,"").replace(/<\/svg>$/,"");
  return `<g transform="translate(9,9) scale(0.625)">${inner}</g>`;
}
function avatarHTML(av, color, size){
  const a = AVATARS.find(x=>x.id===av) || AVATARS[0];
  const s=size||30;
  return `<span style="width:${s}px;height:${s}px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;background:${color||"#888"}">${iconSVG(a.icon, Math.round(s*0.7), "#fff")}</span>`;
}

/* ---------- sound (lichte WebAudio beeps, geen extra library) ---------- */
let AC=null;
function ac(){ if(!AC){ try{ AC=new (window.AudioContext||window.webkitAudioContext)(); }catch(e){} } return AC; }
function beep(kind){
  const a=ac(); if(!a) return;
  const o=a.createOscillator(), g=a.createGain(); o.connect(g); g.connect(a.destination);
  const t=a.currentTime; let f=440;
  if(kind==="good"){ f=660; } else if(kind==="bad"){ f=200; } else if(kind==="win"){ f=520; } else if(kind==="ach"){ f=760; }
  o.frequency.setValueAtTime(f,t); o.type = kind==="bad"?"sawtooth":"triangle";
  g.gain.setValueAtTime(.0001,t); g.gain.exponentialRampToValueAtTime(.16,t+.02); g.gain.exponentialRampToValueAtTime(.0001,t+.22);
  o.start(t); o.stop(t+.24);
  if(kind==="good"||kind==="win"||kind==="ach"){ const o2=a.createOscillator(),g2=a.createGain(); o2.connect(g2);g2.connect(a.destination);
    o2.frequency.setValueAtTime(f*1.5,t+.1);o2.type="triangle";g2.gain.setValueAtTime(.0001,t+.1);g2.gain.exponentialRampToValueAtTime(.12,t+.12);g2.gain.exponentialRampToValueAtTime(.0001,t+.3);o2.start(t+.1);o2.stop(t+.32); }
}
document.addEventListener("pointerdown",function once(){ ac(); document.removeEventListener("pointerdown",once); },{once:true});

/* ---------- toast & overlay ---------- */
let toastT;
function toast(title, msg, medal){
  el("toastM").innerHTML = medal || iconSVG("star",34,"var(--hi)");
  el("toastT").textContent = title; el("toastN").textContent = msg;
  const t=el("toast"); t.classList.add("show"); clearTimeout(toastT); toastT=setTimeout(()=>t.classList.remove("show"),3200);
}
function toastAch(a){ if(!a)return; beep("ach"); toast("Nieuw eerbewijs", a.nm, medalSVG(a.icon,34)); }
function closeOverlay(){ el("overlay").classList.remove("show"); }


/* ============================================================================
   ROUTER + GLOBALE STATE
   ============================================================================ */
let CODE=null, PID=null, ROLE=null, POOL=[], META=null;
let unsubState=null, unsubPlayers=null, botTimer=null, freezeTimer=null;
let STATE={}, PLAYERS={};
let DRAFT = { game:"touwtrekken", lang:"la", source:"freq", fromN:1, toN:100, cat:"all", customText:"",
  target:15, penalty:"back", freezeSec:4 };
let myStreak=0;
let BM_UNSUBS=[], BM_PHASE_TIMER=null, _bmTicking=false, _bmFormHash="";
let BM_MY_CORRECT=0, BM_MY_WRONG=0, BM_MY_DMG=0, BM_MY_HEAL=0; // voor XP/stats na gevecht
let BM_AV_EDIT=null;                 // werkkopie in de avatar-editor

function cleanup(){
  if(unsubState){unsubState();unsubState=null;}
  if(unsubPlayers){unsubPlayers();unsubPlayers=null;}
  if(botTimer){clearInterval(botTimer);botTimer=null;}
  if(freezeTimer){clearInterval(freezeTimer);freezeTimer=null;}
  BM_UNSUBS.forEach(u=>{try{u();}catch(e){}});BM_UNSUBS=[];
  if(BM_PHASE_TIMER){clearInterval(BM_PHASE_TIMER);BM_PHASE_TIMER=null;}_bmTicking=false;
}
function leaveAll(){ cleanup(); CODE=null;PID=null;ROLE=null;POOL=[];META=null;STATE={};PLAYERS={}; }

/* ---------- brand + footer ---------- */
function brand(showCoins){
  return `<div class="brand">
    <span class="mark">${medalSVG("laurel",48)}</span>
    <div><div class="t">CERTAMEN</div><div class="s">Klassieke Talen Arena</div></div>
    ${showCoins?`<button class="coins" onclick="go('collection')"><span>${iconSVG("amphora",16,"var(--hi)")}</span><b>${P.coins}</b> <small>munten</small></button>`:""}
  </div>`;
}
function foot(){ return `<div class="foot">© Gerben de Jong · 2026 · ${hasFirebase?"":"Oefenmodus — Firebase niet ingesteld"}</div>`; }

/* ====================== SCHERMEN ====================== */
const SCREENS = {};
let _screen='home';
function go(name){ _screen=name; cleanup(); document.body.classList.toggle("greek", themeFor(name)==="greek"); SCREENS[name](); window.scrollTo(0,0); }
function themeFor(name){
  // marathon-gerelateerde schermen krijgen het Griekse thema
  if((ROLE==="host" && DRAFT.game==="marathon") || (META && META.game==="marathon")) {
    if(["hostLobby","hostGame","playerLobby","playerGame","result"].includes(name)) return "greek";
  }
  if(name==="hostSettings" && DRAFT.game==="marathon") return "greek";
  return "roman";
}
