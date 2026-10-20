/* ============================================================================
   CASTRA HEROUM — TROEPENBOMEN PER VOLK (151 vormen) — M1
   ----------------------------------------------------------------------------
   Vervangt de losse evolutielijnen (CASTRA_LINES, nu CASTRA_LINES_LEGACY, alleen
   nog voor de migratie). Ontwerp: CASTRA_TROEPENBOMEN.md (bron van waarheid).
   Elk volk heeft een rekruut (tier 1); bij evolueren KIES je de tak (definitief),
   tot tier 4. Stats: type-basis × tier-vermenigvuldiger × leveltoename; evolueren
   bij level 16/32/50 (per type iets anders), vraagt campus-niveau, grondstoffen
   en soms stabula/navalia (nog niet gebouwd = zichtbaar maar niet kiesbaar).
   Een soldaat blijft {line, lvl, xp, indoles, ingenium, insignis}, waarbij `line`
   nu het vorm-id is (bv. "rom_hastatus"; max 20 tekens i.v.m. de Legio-regels).
   Laadt NA castra-data.js, VÓÓR castra.js (castraLine staat hier).
   ============================================================================ */

const CASTRA_TIER_MULT = [1, 1.6, 2.4, 3.2];
const CASTRA_LVL_GROWTH = 0.025;           // +2,5% per level boven 1
const CASTRA_LVL_PER_PRAE = 10;            // levelcap = 10 × praetorium-level (max 50)
const CASTRA_EVO = {
  lvl:{ rec:[16], inf:[16,32,50], cav:[18,34,50], rng:[14,30,46], sup:[14,28,44], myth:[12,26,42] },
  campus:[2,4,5],
  cost:[ { frumentum:50, aes:25 }, { frumentum:100, aes:50 }, { frumentum:200, aes:100 } ],
};
const CASTRA_WILD_TIER_W = [60, 28, 10, 2];            // kans per tier in het wild (%)
const CASTRA_WILD_TIER_PRAE = [1, 2, 4, 5];            // minimaal praetorium-level voor die tier in het wild
function castraXpToNext(lvl){ return 3*lvl; }
function castraSoldierCap(){ return CASTRA_LVL_PER_PRAE*castraLvl("praetorium"); }

/* ---- volken ---- */
const CASTRA_FOLKS = {
  rom:{ nm:"Romeinen",   rec:"Tiro",             region:"latium",  cape:"rood",  look:{ huid:"licht",  haar:"kort",   haarkleur:"zwart" } },
  gra:{ nm:"Grieken",    rec:"Ephebus",          region:"graecia", cape:"blauw", look:{ huid:"getint", haar:"middel", haarkleur:"bruin" } },
  spa:{ nm:"Spartanen",  rec:"Puer Laco",        region:"graecia", cape:"rood",  look:{ huid:"getint", haar:"lang",   haarkleur:"zwart" } },
  tro:{ nm:"Trojanen",   rec:"Tiro Troianus",    region:"troia",   cape:"paars", look:{ huid:"licht",  haar:"kort",   haarkleur:"bruin" } },
  gla:{ nm:"Gladiatoren",rec:"Novicius",         region:"roma",    cape:"oranje",look:{ huid:"olijf",  haar:"wild",   haarkleur:"bruin" } },
  gal:{ nm:"Galliërs",   rec:"Iuvenis Gallus",   region:"gallia",  cape:"groen", look:{ huid:"zeerlicht", haar:"wild", haarkleur:"blond" } },
  ger:{ nm:"Germanen",   rec:"Iuvenis Germanus", region:"germania",cape:"groen", look:{ huid:"zeerlicht", haar:"lang", haarkleur:"blond" } },
  aeg:{ nm:"Egyptenaren",rec:"Iuvenis Aegyptius",region:"aegyptus",cape:"goud",  look:{ huid:"brons",  haar:"kort",   haarkleur:"zwart" } },
  per:{ nm:"Perzen",     rec:"Iuvenis Persa",    region:"persis",  cape:"paars", look:{ huid:"olijf",  haar:"kort",   haarkleur:"zwart" } },
  car:{ nm:"Carthagers", rec:"Iuvenis Poenus",   region:"africa",  cape:"oranje",look:{ huid:"brons",  haar:"kort",   haarkleur:"zwart" } },
  ama:{ nm:"Amazones",   rec:"Virgo Amazon",     region:"themiscyra",cape:"groen",look:{ huid:"licht", haar:"vlecht", haarkleur:"rood" } },
  myt:{ nm:"Mythische wezens", rec:null,         region:null,      cape:"geen",  look:{} },
};

/* ---- de catalogus: [volk, naam, tier, tak, type, ouder(s), gebouweis, lijn(myth)] ----
   type: rec | inf | rng | cav | sup | myth. Ouder: naam (binnen het volk) of lijst; null = geen. */
const _TF = (v, rows)=>rows.map(r=>[v, ...r]);
const _GLAD2 = ["Murmillo","Secutor","Hoplomachus","Retiarius","Thraex","Dimachaerus"];
const CASTRA_FORM_ROWS = [].concat(
  _TF("rom",[
    ["Tiro",1,"Rekruut","rec",null],
    ["Hastatus",2,"Infanterie","inf","Tiro"], ["Princeps",3,"Infanterie","inf","Hastatus"], ["Triarius",4,"Infanterie","inf","Princeps"],
    ["Optio",3,"Infanterie","inf","Hastatus"], ["Centurio",4,"Infanterie","inf","Optio"],
    ["Signifer",3,"Infanterie","sup","Hastatus"], ["Aquilifer",4,"Infanterie","sup","Signifer"],
    ["Veles",2,"Licht en afstand","rng","Tiro"], ["Funditor",3,"Licht en afstand","rng","Veles"], ["Sagittarius",4,"Licht en afstand","rng","Funditor"],
    ["Explorator",3,"Licht en afstand","rng","Veles"], ["Speculator",4,"Licht en afstand","rng","Explorator"],
    ["Eques",2,"Ruiterij","cav","Tiro","stabula"], ["Decurio",3,"Ruiterij","cav","Eques","stabula"], ["Praefectus alae",4,"Ruiterij","cav","Decurio","stabula"],
    ["Faber",2,"Technisch","sup","Tiro"], ["Ballistarius",3,"Technisch","rng","Faber"], ["Architectus",4,"Technisch","rng","Ballistarius"],
    ["Capsarius",3,"Technisch","sup","Faber"], ["Medicus",4,"Technisch","sup","Capsarius"],
    ["Remex",2,"Vloot","inf","Tiro","navalia"], ["Classiarius",3,"Vloot","inf","Remex","navalia"], ["Navarchus",4,"Vloot","inf","Classiarius","navalia"],
  ]),
  _TF("gra",[
    ["Ephebus",1,"Rekruut","rec",null],
    ["Hoplites",2,"Infanterie","inf","Ephebus"], ["Epilectus",3,"Infanterie","inf","Hoplites"], ["Lochagus",4,"Infanterie","inf","Epilectus"],
    ["Psilus",2,"Licht en afstand","rng","Ephebus"], ["Peltasta",3,"Licht en afstand","rng","Psilus"],
    ["Toxota",3,"Licht en afstand","rng","Psilus"], ["Toxota Cretensis",4,"Licht en afstand","rng","Toxota"],
    ["Hippeus",2,"Ruiterij","cav","Ephebus","stabula"], ["Prodromus",3,"Ruiterij","cav","Hippeus","stabula"], ["Hetairus",4,"Ruiterij","cav","Prodromus","stabula"],
    ["Hippotoxota",3,"Ruiterij","cav","Hippeus","stabula"],
  ]),
  _TF("spa",[
    ["Puer Laco",1,"Rekruut","rec",null],
    ["Spartiates",2,"Infanterie","inf","Puer Laco"], ["Trecentus",3,"Infanterie","inf","Spartiates"], ["Polemarchus",4,"Infanterie","inf","Trecentus"],
    ["Perioecus",2,"Licht en verkenning","rng","Puer Laco"], ["Sciritas",3,"Licht en verkenning","rng","Perioecus"],
  ]),
  _TF("tro",[
    ["Tiro Troianus",1,"Rekruut","rec",null],
    ["Hastifer",2,"Infanterie","inf","Tiro Troianus"], ["Propugnator",3,"Infanterie","inf","Hastifer"], ["Custos Pergami",4,"Infanterie","inf","Propugnator"],
    ["Custos portae",3,"Infanterie","inf","Hastifer"],
    ["Sagittarius Troianus",2,"Afstand","rng","Tiro Troianus"], ["Sagittarius Lycius",3,"Afstand","rng","Sagittarius Troianus"],
    ["Auriga",2,"Strijdwagens","cav","Tiro Troianus","stabula"], ["Bellator curru",3,"Strijdwagens","cav","Auriga","stabula"],
    ["Minister templi",2,"Priesters","sup","Tiro Troianus"], ["Sacerdos Apollinis",3,"Priesters","sup","Minister templi"], ["Vates",4,"Priesters","sup","Sacerdos Apollinis"],
  ]),
  _TF("gla",[
    ["Novicius",1,"Rekruut","rec",null],
    ["Murmillo",2,"Zwaar","inf","Novicius"], ["Secutor",2,"Zwaar","inf","Novicius"], ["Hoplomachus",2,"Zwaar","inf","Novicius"],
    ["Retiarius",2,"Licht","rng","Novicius"], ["Thraex",2,"Licht","inf","Novicius"], ["Dimachaerus",2,"Licht","inf","Novicius"],
    ["Primus palus",3,"Zwaar en licht","inf",_GLAD2],
    ["Essedarius",2,"Wagen","cav","Novicius","stabula"],
    ["Rudiarius",3,"Veteraan","sup",_GLAD2],
  ]),
  _TF("gal",[
    ["Iuvenis Gallus",1,"Rekruut","rec",null],
    ["Gaesatus",2,"Infanterie","inf","Iuvenis Gallus"], ["Bellator Gallus",3,"Infanterie","inf","Gaesatus"], ["Soldurius",4,"Infanterie","inf","Bellator Gallus"],
    ["Eques Gallus",2,"Ruiterij","cav","Iuvenis Gallus","stabula"], ["Eques nobilis",3,"Ruiterij","cav","Eques Gallus","stabula"],
    ["Bardus",2,"Druïden","sup","Iuvenis Gallus"], ["Druida",3,"Druïden","sup","Bardus"], ["Summus druida",4,"Druïden","sup","Druida"],
  ]),
  _TF("ger",[
    ["Iuvenis Germanus",1,"Rekruut","rec",null],
    ["Frameatus",2,"Infanterie","inf","Iuvenis Germanus"], ["Centenus",3,"Infanterie","inf","Frameatus"], ["Comes",4,"Infanterie","inf","Centenus"],
    ["Eques Germanus",2,"Ruiterij","cav","Iuvenis Germanus","stabula"], ["Batavus",3,"Ruiterij","cav","Eques Germanus","stabula"],
    ["Saga",2,"Zieneressen","sup","Iuvenis Germanus"], ["Vates Germana",3,"Zieneressen","sup","Saga"],
  ]),
  _TF("aeg",[
    ["Iuvenis Aegyptius",1,"Rekruut","rec",null],
    ["Machimus",2,"Infanterie","inf","Iuvenis Aegyptius"], ["Satelles",3,"Infanterie","inf","Machimus"], ["Custos Pharaonis",4,"Infanterie","inf","Satelles"],
    ["Sagittarius Aegyptius",2,"Afstand","rng","Iuvenis Aegyptius"], ["Sagittarius Nubius",3,"Afstand","rng","Sagittarius Aegyptius"],
    ["Auriga Aegyptius",2,"Strijdwagens","cav","Iuvenis Aegyptius","stabula"], ["Bellator curru Aegyptius",3,"Strijdwagens","cav","Auriga Aegyptius","stabula"],
    ["Scriba",2,"Priesters","sup","Iuvenis Aegyptius"], ["Sacerdos Isidis",3,"Priesters","sup","Scriba"],
  ]),
  _TF("per",[
    ["Iuvenis Persa",1,"Rekruut","rec",null],
    ["Sparabara",2,"Infanterie","inf","Iuvenis Persa"], ["Immortalis",3,"Infanterie","inf","Sparabara"], ["Melophorus",4,"Infanterie","inf","Immortalis"],
    ["Sagittarius Persa",2,"Afstand","rng","Iuvenis Persa"], ["Sagittarius Scytha",3,"Afstand","rng","Sagittarius Persa"],
    ["Eques Persa",2,"Ruiterij","cav","Iuvenis Persa","stabula"], ["Cataphractus",3,"Ruiterij","cav","Eques Persa","stabula"], ["Clibanarius",4,"Ruiterij","cav","Cataphractus","stabula"],
    ["Magus",2,"Magiërs","sup","Iuvenis Persa"], ["Archimagus",3,"Magiërs","sup","Magus"],
  ]),
  _TF("car",[
    ["Iuvenis Poenus",1,"Rekruut","rec",null],
    ["Libyus",2,"Infanterie","inf","Iuvenis Poenus"], ["Veteranus Libyus",3,"Infanterie","inf","Libyus"], ["Miles sacer",4,"Infanterie","inf","Veteranus Libyus"],
    ["Funditor Balearicus",2,"Afstand","rng","Iuvenis Poenus"],
    ["Eques Numida",2,"Ruiterij","cav","Iuvenis Poenus","stabula"], ["Numida nobilis",3,"Ruiterij","cav","Eques Numida","stabula"],
    ["Rector elephanti",2,"Olifanten","cav","Iuvenis Poenus","stabula"], ["Elephantus bellicus",3,"Olifanten","cav","Rector elephanti","stabula"], ["Elephantus turritus",4,"Olifanten","cav","Elephantus bellicus","stabula"],
  ]),
  _TF("ama",[
    ["Virgo Amazon",1,"Rekruut","rec",null],
    ["Sagittaria",2,"Afstand","rng","Virgo Amazon"], ["Sagittaria equestris",3,"Afstand","cav","Sagittaria"],
    ["Peltasta Amazon",2,"Infanterie","rng","Virgo Amazon"], ["Securifera",3,"Infanterie","inf","Peltasta Amazon"],
  ]),
  _TF("myt",[
    ["Satyrus",1,"Saters","myth",null], ["Silenus",2,"Saters","myth","Satyrus"],
    ["Nympha",1,"Nimfen","myth",null], ["Dryas",2,"Nimfen","myth","Nympha"], ["Naias",2,"Nimfen","myth","Nympha"], ["Oreas",2,"Nimfen","myth","Nympha"], ["Nereis",2,"Nimfen","myth","Nympha"],
    ["Pullus centauri",1,"Centauren","myth",null], ["Centaurus",2,"Centauren","myth","Pullus centauri"], ["Centaurus sagittarius",3,"Centauren","myth","Centaurus"],
    ["Harpyia",1,"Harpijen","myth",null],
    ["Pullus grypis",1,"Grijpvogels","myth",null], ["Gryps",2,"Grijpvogels","myth","Pullus grypis"],
    ["Siren",1,"Sirenen","myth",null],
    ["Cyclops pastor",1,"Cyclopen","myth",null], ["Cyclops faber",2,"Cyclopen","myth","Cyclops pastor"],
    ["Hippocampus",1,"Zeepaarden","myth",null],
    ["Umbra",1,"Schimmen","myth",null], ["Lemur",2,"Schimmen","myth","Umbra"], ["Larva",3,"Schimmen","myth","Lemur"],
    ["Formica",1,"Myrmidonen","myth",null], ["Myrmido",2,"Myrmidonen","myth","Formica"],
    ["Dens draconis",1,"Gezaaide mannen","myth",null], ["Spartus",2,"Gezaaide mannen","myth","Dens draconis"],
    ["Anguis",1,"Draken","myth",null], ["Serpens",2,"Draken","myth","Anguis"], ["Draco",3,"Draken","myth","Serpens"],
    ["Pullus alatus",1,"Gevleugelde paarden","myth",null], ["Equus alatus",2,"Gevleugelde paarden","myth","Pullus alatus"],
    ["Phoenix",1,"Feniks","myth",null],
    ["Lupus",1,"Wolven van Mars","myth",null], ["Lupus Martius",2,"Wolven van Mars","myth","Lupus"],
    ["Aquila",1,"Adelaars van Jupiter","myth",null], ["Aquila Iovis",2,"Adelaars van Jupiter","myth","Aquila"],
  ]),
);

const CASTRA_FORMS = {};
(function build(){
  const idOf = (v,n)=> v + "_" + n.toLowerCase().replace(/[^a-z]/g,"").slice(0,16);
  const byName = {};
  CASTRA_FORM_ROWS.forEach(r=>{
    const [v,nm,tier,tak,type,from,needs] = r;
    const id = idOf(v,nm); if(CASTRA_FORMS[id]) throw new Error("dubbel vorm-id: "+id);
    CASTRA_FORMS[id] = { id, volk:v, nm, tier, tak, type, needs:needs||null, from:[], next:[], cat:(tak==="Vloot"?"navy":type) };
    byName[v+"|"+nm] = id;
  });
  CASTRA_FORM_ROWS.forEach(r=>{
    const [v,nm,,, ,from] = r; const f = CASTRA_FORMS[byName[v+"|"+nm]];
    (from? (Array.isArray(from)?from:[from]) : []).forEach(pn=>{
      const pid = byName[v+"|"+pn]; if(!pid) throw new Error("ouder ontbreekt: "+pn+" bij "+nm);
      f.from.push(pid); CASTRA_FORMS[pid].next.push(f.id);
    });
  });
})();
const CASTRA_FORM_LIST = Object.keys(CASTRA_FORMS).map(k=>CASTRA_FORMS[k]);
function castraLine(id){ return CASTRA_FORMS[id] || CASTRA_FORMS["rom_tiro"]; }
function castraFolkNm(formId){ const f = CASTRA_FORMS[formId]; return f ? (CASTRA_FOLKS[f.volk]||{nm:""}).nm : ""; }
// Hoofdvolk van een regio = het volk met het hoogste gewicht; alles daarbuiten is een "vreemdeling".
function castraMainFolk(region){ let best = null; Object.keys(region.folk).forEach(k=>{ if(!best || region.folk[k]>region.folk[best]) best = k; }); return best; }
function castraFormByName(volk, nm){ return CASTRA_FORM_LIST.find(f=>f.volk===volk && f.nm===nm); }
function castraFormRec(volk){ return CASTRA_FORM_LIST.find(f=>f.volk===volk && f.tier===1 && f.type==="rec") || null; }
// Gebouweis: een vorm van tier t vraagt het gebouw op niveau max(1, t−1) (stabula voor ruiterij/wagens/olifanten, navalia voor de vloot).
function castraNeedLvl(f){ return f.needs ? Math.max(1, f.tier-1) : 0; }
function castraNeedsInfo(bid){
  const rows = {};
  CASTRA_FORM_LIST.filter(f=>f.needs===bid).forEach(f=>{ (rows[castraNeedLvl(f)] = rows[castraNeedLvl(f)] || []).push(f.nm); });
  return rows;
}
function castraEvoLevel(f){ const t = (CASTRA_EVO.lvl[f.type]||CASTRA_EVO.lvl.inf); return t[Math.min(t.length-1, f.tier-1)]; }

/* ---- uiterlijk (avatar-lagen per volk, rol en tier; alleen bestaande top-down onderdelen) ---- */
function castraFormLook(f){
  const fo = CASTRA_FOLKS[f.volk] || CASTRA_FOLKS.rom, t = Math.max(1, Math.min(4, f.tier));
  const o = { baard:"geen", schild:"geen", wapen:"zwaard", cape:"geen", capekleur:fo.cape==="geen"?"rood":fo.cape,
    armor:["vodden","middel","middel","ceremonieel"][t-1], helm:["geen","bandana","open","standard"][t-1], ...fo.look };
  if(f.type==="rec"){ o.armor = "vodden"; o.helm = "geen"; }
  if(f.type==="rng"){ o.armor = t>=3 ? "middel" : "vodden"; o.helm = t>=2 ? "bandana" : "geen"; }
  if(f.type==="cav"){ o.cape = "lang"; }
  if(f.type==="sup"){ o.armor = t>=3 ? "ceremonieel" : "robe"; o.helm = "geen"; o.cape = t>=3 ? "kort" : "geen"; }
  if(t>=3 && f.type==="inf") o.cape = "kort";
  if(f.type==="myth"){
    const wings = { Saters:"duivelsvleugels", Nimfen:"vlindervleugels", Harpijen:"engelenvleugels", Grijpvogels:"engelenvleugels", "Gevleugelde paarden":"engelenvleugels", Feniks:"engelenvleugels", "Adelaars van Jupiter":"engelenvleugels", Draken:"duivelsvleugels", Schimmen:"duivelsvleugels" };
    o.armor = f.tak==="Nimfen" ? "robe" : "vodden"; o.helm = "geen"; o.cape = wings[f.tak] || "geen";
  }
  if(f.volk==="spa"){ o.helm = t>=2 ? "open" : "geen"; o.baard = "baard"; }
  if(f.volk==="per" || f.volk==="car" || f.volk==="aeg") o.baard = t>=2 ? "snor" : "geen";
  if(f.volk==="gla"){ o.armor = "vodden"; o.helm = t>=3 ? "open" : "geen"; }
  return o;
}

/* ---- advies van de trainer in het Latijn (op basis van de aanleg) ---- */
const CASTRA_ADV_ADJ = { vita:["robustus","stevig"], impetus:["fortis","sterk"], tutela:["firmus","standvastig"], celeritas:["celer","snel"], ambitus:["acer","scherp"] };
const CASTRA_ADV_TYPE = { vita:"inf", impetus:"inf", tutela:"inf", celeritas:"cav", ambitus:"rng" };
function castraAdvice(s){
  const f = castraLine(s.line), opts = f.next.map(id=>CASTRA_FORMS[id]);
  let best = null; CASTRA_STATS.forEach(st=>{ const v = s.indoles[st.id]||0; if(!best || v>best.v) best = { id:st.id, v }; });
  const want = CASTRA_ADV_TYPE[best.id];
  const pick = opts.find(o=>o.type===want) || opts.find(o=>o.type!=="sup") || opts[0] || null;
  if(!pick) return null;
  const sg = (CASTRA_TYPE_LA[f.type]||CASTRA_TYPE_LA.inf).sg, adj = CASTRA_ADV_ADJ[best.id];
  const nmLa = pick.nm.toLowerCase();
  return { pick:pick.id,
    la:`Hic ${sg} ${adj[0]} est; bonus ${nmLa} fiet.`,
    nl:`Deze ${(CASTRA_TYPE_LA[f.type]||CASTRA_TYPE_LA.inf).nl_sg} is ${adj[1]}; hij wordt een goede ${pick.nm}.` };
}

/* ---- het wild: wie komt er tevoorschijn? ---- */
function castraWildMaxTier(){ const p = castraLvl("praetorium"); let t = 1; CASTRA_WILD_TIER_PRAE.forEach((need,i)=>{ if(p>=need) t = i+1; }); return t; }
function castraWildPick(region, terrain, rng){
  // 1. tier (60/28/10/2), begrensd door het praetorium-level
  const maxT = Math.min(castraWildMaxTier(), region.tierMax||4); let r = rng()*CASTRA_WILD_TIER_W.slice(0,maxT).reduce((a,b)=>a+b,0), tier = 1;
  for(let i=0;i<maxT;i++){ r -= CASTRA_WILD_TIER_W[i]; if(r<=0){ tier = i+1; break; } }
  // 2. mythisch wezen? (alleen terreinen die dat toestaan)
  let form = null;
  if(terrain.myth && rng() < terrain.myth.p){
    const pool = CASTRA_FORM_LIST.filter(f=>f.volk==="myt" && terrain.myth.taks.includes(f.tak));
    const tiers = pool.filter(f=>f.tier<=Math.min(tier,3)); const useT = tiers.length ? tiers : pool;
    form = castraWeighted(useT.map(f=>({ f, w: f.tier===1 ? 6 : f.tier===2 ? 3 : 1 })), rng).f;
  } else {
    // 3. volk uit de regio (af en toe een vreemde), 4. vorm van die tier, gewogen op het terrein
    const folk = castraWeighted(Object.keys(region.folk).map(k=>({ k, w:region.folk[k] })), rng).k;
    let cand = [];
    for(let t=tier; t>=1 && !cand.length; t--) cand = CASTRA_FORM_LIST.filter(f=>f.volk===folk && f.tier===t);
    form = castraWeighted(cand.map(f=>({ f, w: f.tier===1 ? 1 : (terrain.prefs&&terrain.prefs[f.cat]!=null ? terrain.prefs[f.cat] : 0.4) })), rng).f;
  }
  // 5. level: rekruten volgens het gebied, hogere tiers vanaf hun evolutiedrempel
  let lvl;
  if(form.tier<=1) lvl = region.min + Math.floor(rng()*(region.max-region.min+1));
  else lvl = Math.min(50, castraEvoLevel(CASTRA_FORMS[form.from[0]]) + Math.floor(rng()*4));
  return { form, lvl };
}
function castraWeighted(list, rng){ const tot = list.reduce((a,x)=>a+x.w,0); let r = rng()*tot; for(const x of list){ r -= x.w; if(r<=0) return x; } return list[list.length-1]; }

/* ---- migratie van oude soldaten (lijn+stadium+tak -> vorm-id) ---- */
const CASTRA_LEGACY = {
  legioen:["rom_hastatus","rom_princeps","rom_triarius"], rangen:["rom_tiro","rom_optio","rom_centurio"],
  licht:["rom_veles","rom_funditor","rom_sagittarius"], ruiterij:["rom_eques","rom_decurio","rom_praefectusalae"],
  vaandel:["rom_signifer","rom_signifer","rom_aquilifer"], zorg:["rom_capsarius","rom_medicus"],
  beleg:["rom_faber","rom_ballistarius","rom_architectus"], verkenning:["rom_explorator","rom_speculator"],
  vloot:["rom_remex","rom_classiarius","rom_navarchus"], arena:["gla_novicius",["gla_murmillo","gla_retiarius","gla_secutor"]],
  phalanx:["gra_ephebus","gra_hoplites","gra_lochagus"], psili:["gra_psilus","gra_peltasta"], kreta:["gra_toxota","gra_hippotoxota"],
  macedonie:["gra_hippeus","gra_hetairus"], saters:["myt_satyrus","myt_silenus"], nimfen:["myt_nympha",["myt_dryas","myt_naias"]],
  harpijen:["myt_harpyia"], gryps:["myt_gryps"],
};
function castraMigrateSoldier(s){
  if(!s || (CASTRA_FORMS[s.line] && s.stage===undefined)) return s;
  const leg = CASTRA_LEGACY[s.line]; let id = null;
  if(leg){ let e = leg[Math.min(s.stage||0, leg.length-1)]; if(Array.isArray(e)) e = e[Math.min(s.branch||0, e.length-1)]; id = e; }
  if(!CASTRA_FORMS[id]) id = CASTRA_FORMS[s.line] ? s.line : "rom_tiro";
  const out = { ...s, line:id, lvl:Math.min(50, Math.max(1, Math.round((s.lvl||1)*3.2))), xp:0 };
  delete out.stage; delete out.branch; return out;
}
