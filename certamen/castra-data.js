/* ============================================================================
   CASTRA HEROUM — DATA (pure data, geen logica)
   ----------------------------------------------------------------------------
   Gebouwen, grondstoffen, soldatenlijnen, helden, aanleg/karakters en de
   kaartindeling van de castra. Bron van waarheid voor het ontwerp is
   CASTRA_HEROUM.md in de repo-root; pas getallen en teksten hier aan zonder
   castra.js te wijzigen. Latijnse teksten (lat) zijn voorlopig en door Gerben
   te controleren; nl = vertaalhulp (tik op een tekst in het spel).
   Wordt vóór castra.js geladen.
   ============================================================================ */

/* ---- Grondstoffen ---- */
const CASTRA_RES = [
  { id:"frumentum", nm:"Frumentum", nl:"graan",  icon:"🌾" },
  { id:"lignum",    nm:"Lignum",    nl:"hout",   icon:"🪵" },
  { id:"aes",       nm:"Aes",       nl:"brons",  icon:"🪙" },
  { id:"gloria",    nm:"Gloria",    nl:"roem",   icon:"🏆" },
];
const CASTRA_START_RES = { frumentum:100, lignum:150, aes:150, gloria:0 };

/* ---- Stats (Latijnse namen, gekoppeld aan Battle Mode — zie CASTRA_HEROUM.md) ----
   vita = HP, impetus = schade, tutela = schild/verdediging;
   celeritas (snelheid) en ambitus (bereik) alleen voor tower defence. */
const CASTRA_STATS = [
  { id:"vita",      nm:"Vita",      bm:"HP" },
  { id:"impetus",   nm:"Impetus",   bm:"schade" },
  { id:"tutela",    nm:"Tutela",    bm:"schild" },
  { id:"celeritas", nm:"Celeritas", bm:null },
  { id:"ambitus",   nm:"Ambitus",   bm:null },
];

/* ---- Gebouwen ----
   phase:  1 = nu in het spel, anders nog niet gebouwd/zichtbaar.
   slot:   {x,y} linksboven op de kaart (2×2 tegels), of null als nog niet geplaatst.
   prod:   { res, perHour } per level (alleen producerende gebouwen).
   cost:   basiskosten voor level 1→2; schaalt met level^costExp (zie castra.js).
   maxLvl: bovengrens; alle gebouwen behalve het praetorium zijn bovendien
           begrensd door het praetorium-level. */
const CASTRA_BUILDINGS = [
  { id:"praetorium",  nm:"Praetorium",  nl:"Hoofdgebouw", icon:"🏛️", phase:1, slot:{x:3,y:1},  maxLvl:5,
    prod:{ res:"frumentum", perHour:8 }, cost:{ lignum:60, aes:60 },
    lat:"Hic est praetorium. Ibi dux habitat.", desc:"Bepaalt het maximale level van alle andere gebouwen." },
  { id:"contubernia", nm:"Contubernia", nl:"Barakken",    icon:"⛺", phase:1, slot:{x:10,y:2}, maxLvl:5,
    cost:{ lignum:50, aes:30 },
    lat:"Hic milites dormiunt.", desc:"Hier staan je soldaten. Meer level = meer soldaten tegelijk." },
  { id:"lignatio",    nm:"Lignatio",    nl:"Houthakker",  icon:"🪓", phase:1, slot:{x:13,y:1}, maxLvl:5,
    prod:{ res:"lignum", perHour:20 }, cost:{ lignum:40, aes:40 },
    lat:"Hic ligna caeduntur.", desc:"Levert lignum (hout)." },
  { id:"campus",      nm:"Campus",      nl:"Trainen en evolueren", icon:"🏟️", phase:1, slot:{x:2,y:6}, maxLvl:5,
    cost:{ lignum:70, aes:50 },
    lat:"Hic milites exercentur.", desc:"Soldaten trainen en laten evolueren. (Volgt in een latere stap.)" },
  { id:"metallum",    nm:"Metallum",    nl:"Mijn",        icon:"⛏️", phase:1, slot:{x:12,y:8}, maxLvl:5,
    prod:{ res:"aes", perHour:20 }, cost:{ lignum:50, aes:40 },
    lat:"Hic aes effoditur.", desc:"Levert aes (brons)." },
  { id:"horreum",     nm:"Horreum",     nl:"Opslag",      icon:"🏺", phase:1, slot:{x:4,y:8},  maxLvl:5,
    cost:{ lignum:60, aes:30 },
    lat:"Hic frumentum servatur.", desc:"Verhoogt het opslagmaximum van je grondstoffen." },
  { id:"principia",   nm:"Principia",   nl:"Klassenevenementen", icon:"🚩", phase:1, slot:{x:7,y:5}, maxLvl:1, fixed:true,
    lat:"Hic legio convenit.", desc:"Midden in het kamp: hier start straks de Legio (klassenevenement)." },
  // Nog niet geplaatst (zie CASTRA_HEROUM.md, tabel Gebouwen):
  { id:"ludus",        nm:"Ludus",        nl:"Nieuwe aanvallen leren", phase:9, slot:null, maxLvl:5, cost:{ lignum:80, aes:60 } },
  { id:"fabrica",      nm:"Fabrica",      nl:"Smederij",       phase:9, slot:null, maxLvl:5, cost:{ lignum:80, aes:80 } },
  { id:"heroum",       nm:"Heroum",       nl:"Heldenzaal",     icon:"⭐", phase:1, slot:{x:9,y:7}, maxLvl:5, cost:{ lignum:100, aes:100 },
    lat:"Hic heroes habitant.", desc:"Hier wonen je helden: praat met ze, wijs ze toe aan een gebouw en neem ze mee het gevecht in." },
  { id:"valetudinarium",nm:"Valetudinarium",nl:"Herstel",      icon:"🩹", phase:1, slot:{x:2,y:8}, maxLvl:5, cost:{ lignum:60, aes:40 },
    lat:"Hic vulnerati curantur.", desc:"Gewonde soldaten herstellen hier sneller; tegen betaling genezen ze meteen." },
  { id:"dilectus",     nm:"Dilectus",     nl:"Werving",        icon:"📜", phase:1, slot:{x:13,y:3}, maxLvl:5, cost:{ lignum:60, aes:60 },
    lat:"Hic milites novi conscribuntur.", desc:"Elke paar uur nieuwe rekruten; de trainer beoordeelt hun aanleg in het Latijn." },
  { id:"templum",      nm:"Templum",      nl:"Zegen van een god", phase:9, slot:null, maxLvl:5, cost:{ lignum:90, aes:90 } },
  { id:"forum",        nm:"Forum",        nl:"Ruilen",         phase:9, slot:null, maxLvl:5, cost:{ lignum:70, aes:70 } },
  { id:"navalia",      nm:"Navalia",      nl:"Scheepswerf",    icon:"⚓", phase:1, slot:{x:12,y:11}, start:0, maxLvl:5, cost:{ lignum:120, aes:80 },
    lat:"Hic naves aedificantur.", desc:"Scheepswerf: ontgrendelt de vlootvormen (Remex, Classiarius, Navarchus)." },
  { id:"stabula",      nm:"Stabula",      nl:"Stallen",        icon:"🐎", phase:1, slot:{x:2,y:11}, start:0, maxLvl:5, cost:{ lignum:90, aes:60 },
    lat:"Hic equi et currus parantur.", desc:"Stallen: ontgrendelt ruiterij, strijdwagens en olifanten in de troepenbomen." },
  { id:"bibliotheca",  nm:"Bibliotheca",  nl:"Codex",          phase:9, slot:null, maxLvl:5, cost:{ lignum:70, aes:50 } },
  { id:"murus",        nm:"Murus",        nl:"Verdediging",    phase:9, slot:null, maxLvl:5, cost:{ lignum:100, aes:60 } },
  { id:"arcus",        nm:"Arcus triumphalis", nl:"Decoratie", phase:9, slot:null, maxLvl:1, cost:{ lignum:0, aes:0 } },
];

/* ---- Kaart van de castra (tegels van 48px) ---- */
const CASTRA_MAP = {
  cols:16, rows:15, tile:48,
  start:{ x:8, y:13, dir:"up" },
  // Poorten liggen in de kampmuur; erdoor lopen = activiteit kiezen.
  gates:[
    { id:"decumana",  nm:"Porta decumana",  to:"venatio",  nl:"Naar de jacht (venatio)",     tiles:[{x:7,y:0},{x:8,y:0}] },
    { id:"praetoria", nm:"Porta praetoria", to:"proelium", nl:"Naar de campagnekaart (proelium)", tiles:[{x:15,y:5},{x:15,y:6}] },
  ],
};

/* ---- Soldatenlijnen (18 lijnen, ~45 vormen; zie CASTRA_HEROUM.md) ----
   type: inf (infanterie) > cav (ruiterij) > rng (afstand) > inf; sup/myth vallen
   buiten de driehoek. stages: naam per stadium; een array = vertakking. */
const CASTRA_TYPES = {
  rec:  { nm:"Rekruut",    beats:null },
  inf:  { nm:"Infanterie", beats:"cav" },
  cav:  { nm:"Ruiterij",   beats:"rng" },
  rng:  { nm:"Afstand",    beats:"inf" },
  sup:  { nm:"Ondersteuning", beats:null },
  myth: { nm:"Mythisch",   beats:null },
};
const CASTRA_LINES_LEGACY = [   // alleen voor de migratie van oude saves; de troepenbomen staan in castra-troops.js
  { id:"legioen",   type:"inf",  role:"Zware infanterie, blokkeert het pad", stages:["Hastatus","Princeps","Triarius"] },
  { id:"rangen",    type:"inf",  role:"Leider, versterkt soldaten om zich heen", stages:["Miles","Optio","Centurio"] },
  { id:"licht",     type:"rng",  role:"Afstand", stages:["Veles","Funditor","Sagittarius"] },
  { id:"ruiterij",  type:"cav",  role:"Snel, valt flanken aan", stages:["Eques","Decurio","Praefectus alae"] },
  { id:"vaandel",   type:"sup",  role:"Ondersteuning, verhoogt moreel", stages:["Tubicen","Signifer","Aquilifer"] },
  { id:"zorg",      type:"sup",  role:"Genezer", stages:["Capsarius","Medicus"] },
  { id:"beleg",     type:"rng",  role:"Schade op een gebied", stages:["Faber","Ballistarius","Architectus"] },
  { id:"verkenning",type:"sup",  role:"Onthult verborgen vijanden", stages:["Explorator","Speculator"] },
  { id:"vloot",     type:"inf",  role:"Sterk bij water en havens", stages:["Remex","Classiarius","Navarchus"] },
  { id:"arena",     type:"inf",  role:"Duellist; vertakt in drie richtingen", stages:["Tiro",["Murmillo","Retiarius","Secutor"]] },
  { id:"phalanx",   type:"inf",  role:"Grieks, blokkeert in formatie", stages:["Ephebus","Hoplites","Lochagus"] },
  { id:"psili",     type:"rng",  role:"Grieks, snel op afstand", stages:["Psilus","Peltasta"] },
  { id:"kreta",     type:"rng",  role:"Grieks, boogschutter te paard", stages:["Toxota","Hippotoxota"] },
  { id:"macedonie", type:"cav",  role:"Grieks, zware ruiterij", stages:["Hippeus","Hetairus"] },
  { id:"saters",    type:"myth", role:"Mythisch, verwart vijanden", stages:["Satyrus","Silenus"] },
  { id:"nimfen",    type:"myth", role:"Mythisch, geneest; vertakt", stages:["Nympha",["Dryas","Naias"]] },
  { id:"harpijen",  type:"myth", role:"Mythisch, vliegt over obstakels", stages:["Harpyia"] },
  { id:"gryps",     type:"myth", role:"Mythisch, sterke vlieger", stages:["Gryps"] },
];

/* Basiswaarden per type (stadium 1); elk volgend stadium ×CASTRA_STAGE_MULT. */
const CASTRA_BASE_STATS = {
  rec:  { vita:24, impetus:5, tutela:4, celeritas:4, ambitus:2 },
  inf:  { vita:30, impetus:6, tutela:8, celeritas:3, ambitus:1 },
  cav:  { vita:24, impetus:8, tutela:4, celeritas:7, ambitus:1 },
  rng:  { vita:18, impetus:7, tutela:2, celeritas:4, ambitus:5 },
  sup:  { vita:22, impetus:3, tutela:4, celeritas:4, ambitus:3 },
  myth: { vita:20, impetus:6, tutela:3, celeritas:6, ambitus:3 },
};
const CASTRA_STAGE_MULT = [1, 1.6, 2.4];

/* Aanleg (IV's): 0..CASTRA_INDOLES_MAX per waarde, bij het werven bepaald. */
const CASTRA_INDOLES_MAX = 15;
/* Karakters: +10% / −10%. */
const CASTRA_INGENIA = [
  { id:"ferox",    nm:"Ferox",    up:"impetus",   down:"tutela" },
  { id:"cautus",   nm:"Cautus",   up:"tutela",    down:"celeritas" },
  { id:"celer",    nm:"Celer",    up:"celeritas", down:"vita" },
  { id:"robustus", nm:"Robustus", up:"vita",      down:"celeritas" },
  { id:"acer",     nm:"Acer",     up:"impetus",   down:"vita" },
  { id:"longus",   nm:"Longus",   up:"ambitus",   down:"tutela" },
  { id:"firmus",   nm:"Firmus",   up:"tutela",    down:"impetus" },
  { id:"agilis",   nm:"Agilis",   up:"celeritas", down:"impetus" },
  { id:"fortis",   nm:"Fortis",   up:"vita",      down:"ambitus" },
  { id:"sagax",    nm:"Sagax",    up:"ambitus",   down:"vita" },
];
const CASTRA_INSIGNIS_CHANCE = 1/200;

/* ---- Helden (uniek, evolueren niet; missieketens volgen in fase 3) ---- */
const CASTRA_HEROES = [
  { id:"aeneas",    nm:"Aeneas",    region:"latium" },
  { id:"romulus",   nm:"Romulus",   region:"latium" },
  { id:"horatius",  nm:"Horatius Cocles", region:"latium" },
  { id:"cloelia",   nm:"Cloelia",   region:"latium" },
  { id:"mucius",    nm:"Mucius Scaevola", region:"latium" },
  { id:"camilla",   nm:"Camilla",   region:"latium" },
  { id:"hercules",  nm:"Hercules",  region:"graecia" },
  { id:"perseus",   nm:"Perseus",   region:"graecia" },
  { id:"theseus",   nm:"Theseus",   region:"graecia" },
  { id:"atalanta",  nm:"Atalanta",  region:"graecia" },
  { id:"iason",     nm:"Iason",     region:"graecia" },
  { id:"achilles",  nm:"Achilles",  region:"troia" },
  { id:"hector",    nm:"Hector",    region:"troia" },
  { id:"ulixes",    nm:"Ulixes",    region:"troia" },
  { id:"penthesilea",nm:"Penthesilea", region:"troia" },
];

/* ---- Regio's (venatio/proelium; inhoud volgt in fase 1b/2) ---- */
const CASTRA_REGIONS = [
  { id:"latium",  nm:"Latium",  nl:"Midden-Italië" },
  { id:"graecia", nm:"Graecia", nl:"Griekenland" },
  { id:"troia",   nm:"Troia",   nl:"Troje" },
  { id:"gallia",  nm:"Gallia",  nl:"Gallië" },
  { id:"aegyptus", nm:"Aegyptus", nl:"Egypte" },
  { id:"inferi",  nm:"Inferi",  nl:"De Onderwereld" },
];

/* ---- Balans ---- */
const CASTRA_BAL = {
  maxLvl: 5,
  costExp: 1.6,            // kosten level L→L+1 = basis × L^costExp
  walletBase: 300,         // opslagmaximum grondstoffen = base + perHorreumLvl × horreum-level
  walletPerHorreum: 300,
  producerStoreHours: 4,   // een producent loopt maximaal 4 uur vol
  prodPerLevelMult: 1,     // opbrengst per uur = perHour × level
  barracksBase: 6,         // aantal soldaten = base + perLvl × contubernia-level
  barracksPerLvl: 4,
  recruitCost: { frumentum:20 },   // testwerving (tot de Dilectus er is)
  // Evolutie: stadium 1->2 en 2->3 vragen een soldaat-level én een campus-level.
  evo: [ { lvl:5, campus:2 }, { lvl:10, campus:4 } ],
  // Bijtrainen (Day Care): hooguit ~een kwart van wat vechten oplevert, kost
  // frumentum, heeft een dagmaximum en loopt in realtime (tijdstempel).
  train: { cost:{ frumentum:10 }, minutes:20, xpBase:5, xpPerCampusLvl:2, perDay:5 },
  // Missio honesta: eervol ontslag geeft een deel van de grondstoffen terug.
  releaseRefund: { frumentum:10, aes:5 },
};
