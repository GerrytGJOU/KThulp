/* ============================================================================
   CASTRA HEROUM — ELEMENTEN, STATUSAANDOENINGEN EN STAT-STAGES (data en pure regels van het jachtgevecht)
   ----------------------------------------------------------------------------
   Naar de gevechtsregels van Pokémon (generatie 3-4), in eigen vorm. Geen DOM, geen tekst-HTML: castra-moves.js gebruikt dit.
   - Elementen: ignis, aqua, terra, aer, umbra, lux. Mythische wezens en helden hebben er één of twee; gewone soldaten geen
     (zij vechten met hun wapenklasse: de driehoek infanterie > ruiterij > afstand > infanterie blijft zoals hij was).
     Een move kan een element hebben (STAB: x1,25 als het element ook bij de gebruiker hoort). Elementen werken op elk element
     van de verdediger: x1,5 sterk, x0,75 zwak (dubbel type kan dus 2,25 of 0,56 worden). Ring: aqua > ignis > terra > aer > aqua;
     lux en umbra zijn elkaars tegenpool.
   - Statussen (één tegelijk, alleen in dit gevecht): vulnus (wond), ustio (brandwond), somnus (slaap), pavor (schrik).
   - Stat-stages (-6..+6) voor impetus, tutela, celeritas, nauwkeurigheid (acc) en ontwijken (eva); blijven tot wisselen of einde.
   Laadt VOOR castra-moves.js.
   ============================================================================ */

const CASTRA_ELEMS = {
  ignis: { la:"Ignis", nl:"vuur",    icon:"🔥", beats:"terra", fx:{ st:"ustio", p:20 } },
  aqua:  { la:"Aqua",  nl:"water",   icon:"💧", beats:"ignis", fx:{ stage:["cel",-1], p:25 } },
  terra: { la:"Terra", nl:"aarde",   icon:"🪨", beats:"aer",   fx:{ stage:["tut",-1], p:20 } },
  aer:   { la:"Aer",   nl:"lucht",   icon:"🌬️", beats:"aqua",  fx:{ stage:["acc",-1], p:20 } },
  umbra: { la:"Umbra", nl:"schaduw", icon:"🌑", beats:"lux",   fx:{ st:"pavor", p:20 } },
  lux:   { la:"Lux",   nl:"licht",   icon:"☀️", beats:"umbra", fx:{ st:"somnus", p:12 } },
};
const CASTRA_ELEM_BAL = { adv:1.5, dis:0.75, stab:1.25 };
// één element tegen één element
function castraElemMult(att, def){
  const A = CASTRA_ELEMS[att], D = CASTRA_ELEMS[def]; if(!A || !D) return 1;
  if(A.beats===def) return CASTRA_ELEM_BAL.adv;
  if(D.beats===att) return CASTRA_ELEM_BAL.dis;
  return 1;
}
// een move-element tegen alle elementen van de verdediger
function castraElemVs(att, defElems){ let m = 1; (defElems||[]).forEach(d=>{ m *= castraElemMult(att, d); }); return m; }

/* ---- welke wezens en helden hebben welk element ---- */
const CASTRA_TAK_ELEM = {
  "Saters":["terra"], "Nimfen":["aqua"], "Centauren":["terra"], "Harpijen":["aer"], "Grijpvogels":["aer"], "Sirenen":["aqua"],
  "Cyclopen":["ignis","terra"], "Zeepaarden":["aqua"], "Schimmen":["umbra"], "Myrmidonen":["terra"], "Gezaaide mannen":["terra"],
  "Draken":["ignis"], "Gevleugelde paarden":["aer","lux"], "Feniks":["ignis","lux"], "Wolven van Mars":["ignis"],
  "Adelaars van Jupiter":["aer","lux"],
};
const CASTRA_FORM_ELEM = { myt_dryas:["terra"], myt_oreas:["terra"], myt_larva:["umbra","aqua"], myt_draco:["ignis","umbra"] };
const CASTRA_HERO_ELEM = {
  aeneas:["lux"], romulus:["ignis"], horatius:["aqua"], cloelia:["aqua"], mucius:["ignis"], camilla:["aer"], hercules:["terra"],
  perseus:["aer"], theseus:["terra"], atalanta:["aer"], iason:["aqua"], medea:["ignis","umbra"], daedalus:["aer"], prometheus:["ignis"],
  achilles:["ignis"], hector:["terra"], ulixes:["aqua"], penthesilea:["ignis"], cassandra:["lux"], circe:["umbra"],
};
// Elementen van een eenheid (soldaat, vijand, held of dux); leeg voor gewone soldaten.
function castraUnitElems(unit){
  if(!unit || unit.dux) return [];
  if(unit.hero && unit.h) return CASTRA_HERO_ELEM[unit.h.id] || [];
  const f = unit.line && typeof castraLine==="function" ? castraLine(unit.line) : null;
  if(!f || f.volk!=="myt") return [];
  return CASTRA_FORM_ELEM[f.id || unit.line] || CASTRA_TAK_ELEM[f.tak] || [];
}

/* ---- statusaandoeningen ---- */
const CASTRA_STATUS = {
  vulnus: { la:"Vulnus", nl:"wond",      icon:"🩸", dot:1/16 },
  ustio:  { la:"Ustio",  nl:"brandwond", icon:"🔥", dot:1/16, impMult:0.5 },
  somnus: { la:"Somnus", nl:"slaap",     icon:"💤", turns:[1,3] },
  pavor:  { la:"Pavor",  nl:"schrik",    icon:"😨", skipP:0.25, celMult:0.5 },
};
// Probeer een status te zetten; geeft true als hij erop komt. rng is de gevechts-rng.
function castraStatusApply(S, id, rng){
  if(!S || S.hp<=0 || S.status || !CASTRA_STATUS[id]) return false;
  S.status = id;
  if(id==="somnus"){ const t = CASTRA_STATUS.somnus.turns; S.sleep = t[0] + Math.floor(rng()*(t[1]-t[0]+1)); }
  return true;
}

/* ---- stat-stages ---- */
const CASTRA_STAGE_STATS = { imp:"impetus", tut:"tutela", cel:"celeritas", acc:"nauwkeurigheid", eva:"ontwijken" };
const CASTRA_STAGE_NL = { imp:"aanval", tut:"verdediging", cel:"snelheid", acc:"nauwkeurigheid", eva:"ontwijken" };
// (2+n)/2 voor +n, 2/(2-n) voor -n (zoals de stats van Pokémon); nauwkeurigheid en ontwijken gebruiken (3+n)/3.
function castraStageMult(stat, n){
  n = Math.max(-6, Math.min(6, n|0));
  if(stat==="acc" || stat==="eva") return n>=0 ? (3+n)/3 : 3/(3-n);
  return n>=0 ? (2+n)/2 : 2/(2-n);
}
function castraStageChange(S, stat, d){
  const st = S.stages || (S.stages = {}), old = st[stat]||0, nw = Math.max(-6, Math.min(6, old+d));
  st[stat] = nw; return nw - old;     // feitelijke verandering (0 = al op het maximum)
}
