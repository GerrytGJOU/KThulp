/* ============================================================================
   BATTLE MODE — CONFIGURATIE & BALANSTABELLEN (pure data)
   ----------------------------------------------------------------------------
   Alle balanswaarden, klassen, synergie, combos, facties/themas, commanders
   en avatar-/niveau-/mastery-tabellen. Pas getallen hier aan ZONDER de logica
   in battle.js te wijzigen. Wordt vóór battle.js geladen.
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

/* ---- CONFIGURATIETABEL: COMMANDER SPECTRES ---- */
// Puur visueel — verschijnt als semi-transparante geest bij combo's / ultimates / team-buffs.
// Nieuwe factie toevoegen: 1) voeg afbeelding toe in assets/commanders/, 2) voeg één entry toe.
// Vervang .svg door .png zodra echte artwork beschikbaar is (één regelwijziging per commandant).
const BM_COMMANDERS = {
  rome_gaul: {
    A: { nm:"Julius Caesar",   img:"assets/commanders/romans/caesar.png"       },
    B: { nm:"Vercingetorix",   img:"assets/commanders/gauls/vercingetorix.png" },
  },
  athene_sparta: {
    A: { nm:"Pericles",        img:"assets/commanders/athenians/perikles.png"  },
    B: { nm:"Leonidas",        img:"assets/commanders/spartans/leonidas.png"   },
  },
  grieken_perzen: {
    A: { nm:"Themistokles",    img:"assets/commanders/athenians/themistocles.png" },
    B: { nm:"Xerxes",          img:"assets/commanders/persians/xerxes.png"     },
  },
  rome_carthago: {
    A: { nm:"Julius Caesar",   img:"assets/commanders/romans/caesar.png"       },
    B: { nm:"Hannibal",        img:"assets/commanders/carthage/hannibal.png"   },
  },
  grieken_trojanen: {
    A: { nm:"Agamemnon",       img:"assets/commanders/greeks/agamemnon.png"    },
    B: { nm:"Hector",          img:"assets/commanders/trojans/hector.png"      },
  },
  goden_titanen: {
    A: { nm:"Zeus",            img:"assets/commanders/gods/zeus.png"           },
    B: { nm:"Kronos",          img:"assets/commanders/titans/kronos.png"       },
  },
};

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
  armor:  { nm:"Wapenrusting",     opts:[
    { id:"vodden",      nm:"Vodden" },
    { id:"robe",        nm:"Mantel" },
    { id:"licht",       nm:"Licht",        requires:{level:2} },
    { id:"middel",      nm:"Middel",       requires:{level:5} },
    { id:"hopliet",     nm:"Hopliet",      requires:{level:7} },
    { id:"zwaar",       nm:"Zwaar",        requires:{level:9} },
    { id:"ceremonieel", nm:"Ceremonieel",  requires:{mastery:5} },
  ]},
  helm:   { nm:"Helm",             opts:[
    { id:"geen",     nm:"Geen helm" },
    { id:"bandana",  nm:"Bandana" },
    { id:"standard", nm:"Standaard",      requires:{level:2} },
    { id:"open",     nm:"Open",           requires:{level:4} },
    { id:"hopliet",  nm:"Hopliet",        requires:{level:8} },
    { id:"kroon",    nm:"Kroon",          requires:{level:10} },
  ]},
  schild: { nm:"Schild",           opts:[
    { id:"geen",     nm:"Geen schild" },
    { id:"rond",     nm:"Rond",           requires:{level:3} },
    { id:"ovaal",    nm:"Puntig",         requires:{level:3} },
    { id:"vierkant", nm:"Metaal Rond",    requires:{level:6} },
    { id:"tower",    nm:"Metaal Puntig",  requires:{level:6} },
  ]},
  wapen:  { nm:"Wapen",            opts:[
    { id:"knuppel", nm:"Knuppel" },
    { id:"hooivork",nm:"Hooivork" },
    { id:"zwaard",  nm:"Zwaard",          requires:{level:2} },
    { id:"speer",   nm:"Speer",           requires:{level:2} },
    { id:"boog",    nm:"Boog",            requires:{level:4} },
    { id:"staf",    nm:"Staf",            requires:{level:4} },
  ]},
  haar:   { nm:"Haar",             opts:[
    { id:"kort",    nm:"Kort" },
    { id:"lang",    nm:"Lang" },
    { id:"kaal",    nm:"Kaal" },
    { id:"wild",    nm:"Wild",            requires:{level:5} },
    { id:"vlecht",  nm:"Vlecht",          requires:{level:6} },
    { id:"middel",  nm:"Middel",          requires:{level:6} },
    { id:"knot",    nm:"Knot",            requires:{level:7} },
    { id:"hanekam", nm:"Hanekam",         requires:{level:7} },
  ]},
  haarkleur:{ nm:"Haarkleur",      opts:[
    { id:"blond",  nm:"Blond" },
    { id:"bruin",  nm:"Bruin" },
    { id:"zwart",  nm:"Zwart" },
    { id:"rood",   nm:"Rood" },
    { id:"blauw",  nm:"Blauw",            requires:{level:8} },
    { id:"groen",  nm:"Groen",            requires:{level:8} },
  ]},
  baard:  { nm:"Gezichtshaar",     opts:[
    { id:"geen",      nm:"Geen" },
    { id:"snor",      nm:"Snor" },
    { id:"baard",     nm:"Baard" },
    { id:"baardsnor", nm:"Baard en snor" },
    { id:"sikensnor", nm:"Sik en snor",   requires:{level:7} },
  ]},
  cape:   { nm:"Cape",             opts:[
    { id:"geen", nm:"Geen" },
    { id:"kort", nm:"Kort",              requires:{level:5} },
    { id:"lang", nm:"Lang",              requires:{level:7} },
    // Vleugels: zeer hoge status — pas ontgrendeld ná niveau 10 (Imperator),
    // bij de eerste Legioenster (zie core.js: calcPrestige()/xpBarInfo()).
    // Capekleur (BM_CAPEKLEUR_FILTER) heeft bewust geen effect op deze drie —
    // zie _bmPixelLayers() in battle.js.
    { id:"engelenvleugels",  nm:"Engelenvleugels",  requires:{prestige:1} },
    { id:"duivelsvleugels",  nm:"Duivelsvleugels",  requires:{prestige:1} },
    { id:"vlindervleugels",  nm:"Vlindervleugels",  requires:{prestige:1} },
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
    { id:"juichen",       nm:"Juichen" },
    { id:"zwaardhefffen", nm:"Zwaard heffen", requires:{level:5} },
  ]},
  // ── Onderaan: coin-only categorieën. requires:{coins:N} = ontgrendelen met
  //    munten (denarii/drachmae). Verdienen van munten regelen we later.
  extra:  { nm:"Extra's",       opts:[
    { id:"geen",       nm:"Geen" },
    { id:"blush",      nm:"Blos",          requires:{coins:60} },
    { id:"oorbel",     nm:"Oorbel",        requires:{coins:80} },
    { id:"litteken",   nm:"Litteken",      requires:{coins:80} },
    { id:"ooglapje",   nm:"Ooglapje",      requires:{coins:100} },
    { id:"darkeyes",   nm:"Donkere ogen",  requires:{coins:120} },
    { id:"warstripes", nm:"Oorlogsverf",   requires:{coins:150} },
    { id:"clown",      nm:"Clown",         requires:{coins:200} },
  ]},
  legendary: { nm:"Legendarisch",  opts:[
    { id:"geen",      nm:"Geen" },
    { id:"achilles",  nm:"Achilles",       requires:{coins:500} },
    { id:"ajax",      nm:"Ajax de Grote",  requires:{coins:500} },
    { id:"odysseus",  nm:"Odysseus",       requires:{coins:600} },
    { id:"aeneas",    nm:"Aeneas",         requires:{coins:600} },
  ]},
  // requires:{achCategory:"..."} = ontgrendeld door ALLE eerbewijzen in die
  // categorie te behalen (core.js: ACHIEVEMENTS_DEF/ACH_CATEGORIES/
  // achCategoryComplete()) — kleurt de hele pixel-hero goud i.p.v. een los
  // onderdeel, zie _bmPixelLayers() hieronder in battle.js.
  prestige: { nm:"Legioensglans",  opts:[
    { id:"geen",      nm:"Geen" },
    { id:"klassiek",  nm:"Klassiek Goud",     requires:{achCategory:"klassiek"} },
    { id:"algemeen",  nm:"Geleerde Goud",     requires:{achCategory:"algemeen"} },
    { id:"battle",    nm:"Strijder Goud",     requires:{achCategory:"battle"} },
    { id:"mastery",   nm:"Meester Goud",      requires:{achCategory:"mastery"} },
    { id:"boss",      nm:"Bedwinger Goud",    requires:{achCategory:"boss"} },
    { id:"totalwar",  nm:"Bouwmeester Goud",  requires:{achCategory:"totalwar"} },
    { id:"geheim",    nm:"Legendarisch Goud", requires:{achCategory:"geheim"} },
  ]},
};

// ── Legendarische strijders: vervangen de HELE avatar (zie _bmPixelLayers)
// én geven een vaste gevechtsbonus. Vermenigvuldigers zijn +N% t.o.v. de
// normale waarde. Uitbreidbaar: nieuwe entry hier + optie hierboven volstaat.
const BM_LEGENDARY_BONUS = {
  achilles: { nm:"Achilles",      desc:"+20% aanvalsschade",        atkMult:0.20 },
  ajax:     { nm:"Ajax de Grote", desc:"+25% schildsterkte",        shldMult:0.25 },
  odysseus: { nm:"Odysseus",      desc:"+25% munten na het gevecht",incomeMult:0.25 },
  aeneas:   { nm:"Aeneas",        desc:"+20% genezing",             healMult:0.20 },
};

// XP-drempels en titels per niveau (1–10). Aanpasbaar zonder logica te wijzigen.
const BM_LEVELS = [
  { level:1,  xp:0,    title:"Tiro",       unlock:null },
  { level:2,  xp:100,  title:"Miles",      unlock:{part:"armor",      opt:"licht",        nm:"Wapenrusting: Licht"} },
  { level:3,  xp:250,  title:"Optio",      unlock:{part:"schild",     opt:"rond",         nm:"Schild: Rond & Puntig"} },
  { level:4,  xp:500,  title:"Signifer",   unlock:{part:"helm",       opt:"open",         nm:"Helm: Open"} },
  { level:5,  xp:900,  title:"Aquilifer",  unlock:{part:"cape",       opt:"kort",         nm:"Cape: Kort & Zwaard heffen"} },
  { level:6,  xp:1400, title:"Centurio",   unlock:{part:"schild",     opt:"vierkant",     nm:"Schild: Metaal Rond & Metaal Puntig"} },
  { level:7,  xp:2100, title:"Praefectus", unlock:{part:"armor",      opt:"hopliet",      nm:"Wapenrusting: Hopliet & Cape: Lang"} },
  { level:8,  xp:3000, title:"Tribunus",   unlock:{part:"helm",       opt:"hopliet",      nm:"Helm: Hopliet & Haarkleur: Blauw/Groen"} },
  { level:9,  xp:4200, title:"Legatus",    unlock:{part:"armor",      opt:"zwaar",        nm:"Wapenrusting: Zwaar"} },
  { level:10, xp:6000, title:"Imperator",  unlock:{part:"helm",       opt:"kroon",        nm:"Helm: Kroon"} },
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
