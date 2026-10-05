/* ============================================================================
   BATTLE MODE — CONFIGURATIE & BALANSTABELLEN (pure data)
   ----------------------------------------------------------------------------
   Alle balanswaarden, klassen, synergie, combos, facties/themas, commanders
   en avatar-/niveau-/mastery-tabellen. Pas getallen hier aan ZONDER de logica
   in battle.js te wijzigen. Wordt vóór battle.js geladen.
   ============================================================================ */

/* ---- CONFIGURATIETABEL: KLASSEN (8 stuks) ----
   Elke klasse: 2 basis-vaardigheden (goedkoop, kies 1), 2 medium-vaardigheden
   (kies 1), 1 legendarische (duurst, geen keuze) — alle 5 elke ronde opnieuw
   beschikbaar. Balans is doorgerekend (waarde per AP, incl. passieven) zodat
   geen enkele klasse of los onderdeel ver uit de band valt; zie het gesprek
   d.d. 2026-07 voor de doorrekening. Alle balanswaarden staan hier. Pas
   getallen aan zonder de logica te wijzigen.
   passive.masterVal/masterTiers/masterDesc: versterkte passief bij ★★★★★ klasbeheersing
   in die klasse (zie bmPassiveVal() in battle.js; volgt de docent-schakelaar
   masteryBonuses). */
const BM_CLASSES = [
  { id:"hopliet",      nm:"Hopliet",     icon:"shield", color:"#c8392a",
    passive:{ desc:"+1 AP bij Verdedigen",                    type:"be_on_defend", val:1, masterVal:2,    masterDesc:"+2 AP bij Verdedigen" },
    abilities:[
      { id:"schildmuur",    nm:"Schildmuur",    tier:"basic",    cost:2,  desc:"Geeft je team +4 schild",                   type:"team_shield",          shld:4 },
      { id:"schildslag",    nm:"Schildslag",    tier:"basic",    cost:2,  desc:"Aanval op het vijandelijk leger (+4)",      type:"attack",               dmg:4 },
      { id:"formatie",      nm:"Formatie",      tier:"medium",   cost:5,  desc:"Alle teamgenoten +2 AP",                    type:"team_be",              teamBE:2 },
      { id:"linie_sluiten", nm:"Linie Sluiten",  tier:"medium",   cost:5,  desc:"Geeft je team +7 schild",                   type:"team_shield",          shld:7 },
      { id:"achilleshiel",  nm:"Achilleshiel",  tier:"legendary",cost:9,  desc:"Aanval (+10) die tegenschild omzeilt",      type:"attack_bypass",        dmg:10 },
      { id:"thermopylae",   nm:"Thermopylae",   tier:"prestige", cost:13, desc:"Onbreekbare falanx: schild voor je team (+14) én tegenstoot (+8)", type:"attack_and_defend", dmg:8, shld:14 },
    ]},
  { id:"spartaan",     nm:"Voorvechter", icon:"helmet", color:"#8B1A1A",
    passive:{ desc:"+20% aanvalsschade",                       type:"atk_bonus",   val:0.20, masterVal:0.30, masterDesc:"+30% aanvalsschade" },
    abilities:[
      { id:"speer",         nm:"Speerstoot",    tier:"basic",    cost:3,  desc:"Aanval op het vijandelijk leger (+6)",      type:"attack",               dmg:6 },
      { id:"genadeslag",    nm:"Genadeslag",    tier:"basic",    cost:3,  desc:"Aanval (+3, of +8 als vijand ≤30% HP)",     type:"attack_weakspot",      dmg:3, bonusDmg:5 },
      { id:"berserk",       nm:"Berserk",       tier:"medium",   cost:5,  desc:"Zware aanval op het vijandelijk leger (+9)",type:"attack",               dmg:9 },
      { id:"bloedroof",     nm:"Bloedroof",     tier:"medium",   cost:6,  desc:"Aanval (+6) én eigen leger heelt mee (+5) — levensroof", type:"heal_and_attack", dmg:6, heal:5 },
      { id:"leeuwensprong", nm:"Leeuwensprong", tier:"legendary",cost:10, desc:"Massieve aanval die schild omzeilt (+14)",  type:"attack_bypass",        dmg:14 },
      { id:"aristeia",      nm:"Aristeia",      tier:"prestige", cost:13, desc:"Heldenmoment: verwoestende aanval die schild omzeilt (+20)", type:"attack_bypass", dmg:20 },
    ]},
  { id:"boogschutter", nm:"Boogschutter",icon:"eagle",  color:"#2e6fb0",
    passive:{ desc:"+1 schade bij aanval",                     type:"atk_flat",    val:1, masterVal:2,    masterDesc:"+2 schade bij aanval" },
    abilities:[
      { id:"pijlregen",     nm:"Pijlregen",     tier:"basic",    cost:3,  desc:"AoE-aanval op alle doelen (+5 elk)",        type:"attack",               dmg:5, aoe:true },
      { id:"gericht_schot", nm:"Gericht Schot", tier:"basic",    cost:3,  desc:"Aanval (+2) én vijandelijk schild −2",      type:"attack_and_shld_remove", dmg:2, shldRemove:2 },
      { id:"zwakpunt",      nm:"Zwak Punt",     tier:"medium",   cost:5,  desc:"Aanval (+7, of +17 als vijand ≤30% HP)",    type:"attack_weakspot",      dmg:7, bonusDmg:10 },
      { id:"doorborend",    nm:"Doorborend Schot", tier:"medium", cost:6,  desc:"Aanval (+7) die tegenschild omzeilt",       type:"attack_bypass",        dmg:7 },
      { id:"dodenarrow",    nm:"Dodenarrow",    tier:"legendary",cost:9,  desc:"Dodelijke pijl op het vijandelijk leger (+13)", type:"attack",           dmg:13 },
      { id:"apollos_pijlen",nm:"Pijlen van Apollo", tier:"prestige", cost:13, desc:"Pijlenstorm op alle doelen (+14 elk) die schild omzeilt", type:"attack_bypass", dmg:14, aoe:true },
    ]},
  { id:"cavalerie",    nm:"Cavalerie",   icon:"column", color:"#9B6914",
    passive:{ desc:"+2 AP bij snel correct antwoord",          type:"be_on_fast",  val:2, masterVal:3,    masterDesc:"+3 AP bij snel correct antwoord" },
    abilities:[
      { id:"charge",        nm:"Charge",        tier:"basic",    cost:3,  desc:"Snelle aanval op het vijandelijk leger (+7)", type:"attack",             dmg:7 },
      { id:"snelle_uitval", nm:"Snelle Uitval", tier:"basic",    cost:3,  desc:"Aanval (+3) én +2 eigen AP",                type:"attack",               dmg:3, selfBE:2 },
      { id:"flankbeweging", nm:"Flankbeweging", tier:"medium",   cost:5,  desc:"Aanval (+5) én schild voor je team (+3)",   type:"attack_and_defend",    dmg:5, shld:3 },
      { id:"stormram",      nm:"Stormram",      tier:"medium",   cost:6,  desc:"Aanval (+8) én vijandelijk schild −4",      type:"attack_and_shld_remove", dmg:8, shldRemove:4 },
      { id:"stormloop",     nm:"Stormloop",     tier:"legendary",cost:9,  desc:"Verwoestende aanval (+13)",                  type:"attack",               dmg:13 },
      { id:"alexanders_charge", nm:"Charge van Alexander", tier:"prestige", cost:13, desc:"Doorbraak (+16) én vijandelijk schild −6", type:"attack_and_shld_remove", dmg:16, shldRemove:6 },
    ]},
  { id:"priester",     nm:"Priester",    icon:"torch",  color:"#3f9d52",
    passive:{ desc:"+1 heling bij helen",                      type:"heal_flat",   val:1, masterVal:2,    masterDesc:"+2 heling bij helen" },
    abilities:[
      { id:"gebed",         nm:"Gebed",         tier:"basic",    cost:3,  desc:"Heelt je eigen leger (+7)",                 type:"heal",                 heal:7 },
      { id:"vloek",         nm:"Vloek",         tier:"basic",    cost:3,  desc:"Aanval op het vijandelijk leger (+5)",      type:"attack",               dmg:5 },
      { id:"zegen",         nm:"Zegen",         tier:"medium",   cost:5,  desc:"Alle teamgenoten +3 AP",                    type:"team_be",              teamBE:3 },
      { id:"reinigend_licht", nm:"Reinigend Licht", tier:"medium", cost:6, desc:"Heelt leger (+7) én schaadt vijand (+2)",  type:"heal_and_attack",      heal:7, dmg:2 },
      { id:"godenvuur",     nm:"Godenvuur",     tier:"legendary",cost:9,  desc:"Heelt leger (+12) én schaadt vijand (+4)",  type:"heal_and_attack",      heal:12, dmg:4 },
      { id:"asklepios",     nm:"Hand van Asklepios", tier:"prestige", cost:13, desc:"Heelt leger (+20) én schaadt vijand (+6)", type:"heal_and_attack", heal:20, dmg:6 },
    ]},
  { id:"centurio",     nm:"Bevelvoerder",icon:"laurel", color:"#6B2D8B",
    passive:{ desc:"+1 AP per ronde (altijd)",                 type:"be_passive",  val:1, masterVal:2,    masterDesc:"+2 AP per ronde (altijd)" },
    abilities:[
      { id:"bevel",         nm:"Bevel",         tier:"basic",    cost:2,  desc:"Geeft je team +3 schild",                   type:"team_shield",          shld:3 },
      { id:"aanmoediging",  nm:"Aanmoediging",  tier:"basic",    cost:2,  desc:"Alle teamgenoten +1 AP",                    type:"team_be",              teamBE:1 },
      { id:"strijdformatie",nm:"Strijdformatie",tier:"medium",   cost:4,  desc:"Alle teamgenoten +3 AP",                    type:"team_be",              teamBE:3 },
      { id:"veldverzorging",nm:"Veldverzorging",tier:"medium",   cost:4,  desc:"Heelt je eigen leger (+9)",                 type:"heal",                 heal:9 },
      { id:"testudo",       nm:"Testudo",       tier:"legendary",cost:8,  desc:"Massiefschild (+7), team +2 AP, én heelt (+3)", type:"testudo",          shld:7, teamBE:2, heal:3 },
      { id:"triumphus",     nm:"Triumphus",     tier:"prestige", cost:13, desc:"Schild (+10), team +3 AP én heelt (+6)", type:"testudo", shld:10, teamBE:3, heal:6 },
    ]},
  { id:"genie",        nm:"Genie",       icon:"amphora",color:"#C87533",
    passive:{ desc:"Aanvallen verminderen ook vijandelijk schild (−2)", type:"shld_pierce", val:2, masterVal:3,    masterDesc:"Aanvallen verminderen ook vijandelijk schild (−3)" },
    abilities:[
      { id:"katapult",      nm:"Katapult",      tier:"basic",    cost:3,  desc:"Aanval op het vijandelijk leger (+5)",      type:"attack",               dmg:5 },
      { id:"valstrik",      nm:"Valstrik",      tier:"basic",    cost:3,  desc:"Verwijdert vijandelijk schild (−6)",        type:"shield_remove",        shldRemove:6 },
      { id:"valgreppel",    nm:"Valgreppel",    tier:"medium",   cost:4,  desc:"Verwijdert vijandelijk schild (−6)",        type:"shield_remove",        shldRemove:6 },
      { id:"veldreparatie", nm:"Veldreparatie", tier:"medium",   cost:4,  desc:"Schild (+3) én heling (+3) voor je team",   type:"shield_and_heal",      shld:3, heal:3 },
      { id:"vuurtoren",     nm:"Vuurtoren",     tier:"legendary",cost:8,  desc:"Zware AoE-aanval op alle doelen (+9 elk) én schild weg (−4)", type:"attack_siege", dmg:9, shldRemove:4, aoe:true },
      { id:"archimedes",    nm:"Spiegels van Archimedes", tier:"prestige", cost:13, desc:"Brandende stralen op alle doelen (+14 elk) én schild weg (−8)", type:"attack_siege", dmg:14, shldRemove:8, aoe:true },
    ]},
  { id:"verkenner",    nm:"Verkenner",   icon:"eagle",  color:"#2D8B7A",
    passive:{ desc:"Basis-abilities kosten 1 AP minder",       type:"cost_reduce", val:1, masterTiers:["basic","medium"], masterDesc:"Basis- én medium-abilities kosten 1 AP minder" },
    abilities:[
      { id:"verkenning",    nm:"Verkenning",    tier:"basic",    cost:2,  desc:"Aanval (+4) én saboteer vijandelijk schild (−2)", type:"attack_and_shld_remove", dmg:4, shldRemove:2 },
      { id:"sluipaanval",   nm:"Sluipaanval",   tier:"basic",    cost:2,  desc:"Aanval (+2, of +8 als vijand ≤30% HP)",     type:"attack_weakspot",      dmg:2, bonusDmg:6 },
      { id:"sabotage",      nm:"Sabotage",      tier:"medium",   cost:4,  desc:"Verwijdert vijandelijk schild (−6)",        type:"shield_remove",        shldRemove:6 },
      { id:"ontwapenen",    nm:"Ontwapenen",    tier:"medium",   cost:4,  desc:"Aanval (+4) én vijandelijk schild −4",      type:"attack_and_shld_remove", dmg:4, shldRemove:4 },
      { id:"hinderlaag",    nm:"Hinderlaag",    tier:"legendary",cost:7,  desc:"Zware aanval (+10) én schild voor team (+3)", type:"attack_and_defend",   dmg:10, shld:3 },
      { id:"teutoburg",     nm:"Teutoburgerwoud", tier:"prestige", cost:12, desc:"Vernietigende hinderlaag (+15) én schild voor team (+5)", type:"attack_and_defend", dmg:15, shld:5 },
    ]},
];

/* ---- CONFIGURATIETABEL: AP-ECONOMIE ----
   In een gevecht met een hele klas liep de Actiepunten volledig uit de hand:
   leerlingen hadden 65 AP of meer terwijl de duurste actie 10 kost. Twee
   oorzaken, allebei met de klasgrootte meegegroeid:
   1. De synergiebonus hieronder is per speler per ronde en gaat op klas-
      diversiteit. Met 17 spelers per team zijn alle acht klassen altijd
      vertegenwoordigd, dus wat als zeldzame beloning bedoeld was (+6) werd
      gegarandeerd basisinkomen.
   2. team_be-abilities (bv. Centurio's "Strijdformatie", +3 AP voor het team)
      geven AP aan ÉLKE teamgenoot. Drie Centurio's die dat samen doen leveren
      iedereen +9 op — die stapeling schaalt lineair mee met de teamgrootte.
   Daarom drie grenzen. Alle drie zijn losse knoppen: verlaag BM_BE_MAX voor
   krappere keuzes, verhoog 'm als leerlingen te vaak niets kunnen doen. */
const BM_BE_MAX = 15;               // maximale voorraad AP per speler (duurste ability kost 10)
const BM_BE_ROUND_BONUS_CAP = 4;    // max passief AP per ronde (synergie + passieven + mastery + traits samen)
const BM_TEAMBE_ROUND_CAP = 4;      // max AP dat team_be-abilities + combo's samen per ronde aan een teamgenoot geven
const BM_WRONG_BE_PENALTY = 2;      // AP die je kwijtraakt bij een fout antwoord (nooit onder 0)
// "Snel" antwoord: goed beantwoord binnen dit deel van de timer (0.25 = het
// eerste kwart, bij 10 s dus binnen 2,5 s). Geeft +1 AP, het Cavalerie-passief
// en de Ciceronianus-bonus. Was tot 2026-10-05 "meer dan de helft van de tijd
// over" — dat bleek te ruim: bijna elk goed antwoord telde als snel.
const BM_FAST_FRACTION = 0.25;

/* ---- CONFIGURATIETABEL: BASISACTIES ----
   Acties die iédereen kan doen, ook zonder gekozen klasse en met 0 AP. Ze
   bestaan om één reden: niemand zit een ronde werkloos toe te kijken. Dat
   overkwam leerlingen die te laat instapten (die joinen zonder klasse) of die
   in de lobby vergaten te kiezen — voor hen was er letterlijk geen knop. En het
   overkomt sinds de AP-boete ook spelers mét klasse die even niets kunnen
   betalen.
   Ze zijn bewust zwak: minder dan de goedkoopste klasse-ability, zodat kiezen
   voor je eigen klasse altijd beter blijft. Gratis, dus er valt niets af te
   wegen — je kunt er toch maar één actie per ronde uitvoeren. */
const BM_BASIC_ACTIONS = [
  { id:"basic_worp",   nm:"Steen gooien",   tier:"basic", cost:0, desc:"Kleine aanval (+2)",              type:"attack",       dmg:2 },
  { id:"basic_dekking",nm:"Dekking zoeken", tier:"basic", cost:0, desc:"Klein schild voor je team (+1)",  type:"team_shield",  shld:1 },
  { id:"basic_moed",   nm:"Aanmoedigen",    tier:"basic", cost:0, desc:"+1 AP voor je hele team",         type:"team_be",      teamBE:1 },
  // Alleen zichtbaar zolang de Cycloop dreigt te eten (BM_BOSS.charging) of
  // de Minotaurus in Enrage is (BM_BOSS.enraged) — bossbattle.js: zonder dit
  // kon een klas zonder Hopliet/Bevelvoerder daar vrijwel niets tegen doen.
  // Kost je actie van die ronde.
  { id:"basic_schildheffen", nm:"Schild heffen", tier:"basic", cost:0, desc:"Samen schild: +2 schild voor je team", type:"team_shield", shld:2, bossMealOnly:true },
];

/* ---- CONFIGURATIETABEL: SYNERGIE ---- */
// Flat AP-bonus per speler per ronde op basis van klasdiversiteit binnen het team.
const BM_SYNERGY = [
  { minClasses:3, beBonus:2 },  // ≥3 unieke klassen → +2 AP per speler
  { minClasses:5, beBonus:4 },  // ≥5 unieke klassen → +4 AP per speler
  { minClasses:7, beBonus:6 },  // ≥7 unieke klassen → +6 AP per speler
];

/* ---- CONFIGURATIETABEL: BOSS BATTLE ANTI-CARRY (BOSS_BATTLE.md §5) ---- */
// Inspiratie-buff: na 3 opeenvolgende foute antwoorden geeft de eerstvolgende
// gebruikte ability bonusschade (vlak, zelfde schaal als een basis-ability).
const BM_INSPIRE_BONUS_DMG = 4;
// Brede-deelname-bonus (herinterpretatie van "Combo Chain" voor Boss Battle se
// ronde-gebaseerde architectuur, geen live per-antwoord-tijdstip): ≥N
// verschillende spelers die in dezelfde ronde schade aan de baas toebrachten
// geeft het team een vlakke bonus op de totale ronde-schade. Aflopend gecheckt.
const BM_CHAIN_BONUS = [
  { min:5, bonus:6 },
  { min:3, bonus:3 },
];

/* ---- CONFIGURATIETABEL: MINION SUMMON (BOSS_BATTLE.md §4) ---- */
// Generieke "alle bazen"-mechanic: bij de overgang van fase 1 naar fase 2
// roept de baas 2-4 handlangers op. Elke handlanger heeft een vast percentage
// van de baas se max-HP. Niet van toepassing op BM_META.bossId==="garrison"
// (Total War-belegeringen) — dat zou de garnizoensbalans ongevraagd raken.
const BM_MINION_HP_PCT = 0.12;
const BM_MINION_COUNT_MIN = 2;
const BM_MINION_COUNT_MAX = 4;

/* ---- CONFIGURATIETABEL: COMBO-ABILITIES ---- */
// Beide spelers moeten in dezelfde ronde "Combo" kiezen; host detecteert het bij resolutie.
const BM_COMBOS = [
  { id:"schildmuur_schieten", nm:"Schildmuur met Schieten", classes:["hopliet","boogschutter"],     cost:4, desc:"Schild (+6) én gecombineerde pijlaanval (+6)",                  shld:6, dmg:6 },
  { id:"strijdszegen",        nm:"Strijdszegen",            classes:["priester","spartaan"],         cost:4, desc:"Massale AP-bonus voor het hele team (+5 per speler)",            teamBE:5 },
  { id:"vuursalvo",           nm:"Vuursalvo",               classes:["genie","boogschutter"],        cost:4, desc:"Gecombineerde zware aanval (+12)",                               dmg:12 },
  { id:"testudo_formatie",    nm:"Testudo-formatie",         classes:["centurio","hopliet"],          cost:4, desc:"Massief gecombineerd schild voor het hele team (+10)",            shld:10 },
  { id:"hinderlaag_aanval",   nm:"Hinderlaag & Aanval",      classes:["verkenner","cavalerie"],       cost:4, desc:"Gecombineerde aanval (+13) én vijandelijk schild weg (−3)",     dmg:13, shldRemove:3 },
  { id:"genezende_vesting",   nm:"Genezende Vesting",        classes:["priester","genie"],            cost:4, desc:"Heelt je leger (+10) én saboteert het vijandelijke schild (−4)", heal:10, shldRemove:4 },
  { id:"verkende_aanval",     nm:"Verkende Aanval",          classes:["verkenner","boogschutter"],    cost:4, desc:"Ontdekt de zwakke plek: aanval (+10) én vijandelijk schild weg (−4)", dmg:10, shldRemove:4 },
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
    A: { nm:"Scipio Africanus", img:"assets/commanders/romans/scipio.png"      },
    B: { nm:"Hannibal",         img:"assets/commanders/carthage/hannibal.png"  },
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

/* ---- CONFIGURATIETABEL: TOTAL WAR SIEGE SPECTRES ---- */
// Gekoppeld aan TW_CIVS-sleutels (civId). Actief bij belegering (bossId="garrison")
// als de aanvallende beschaving de commandant bepaalt.
// Boss Battle-helden staan in BOSS_PRESETS[id].hero (zie bossbattle.js).
// Nieuwe beschaving: 1) voeg PNG toe, 2) voeg één regel toe — geen code nodig.
const TW_CIV_COMMANDERS = {
  roma:     { nm:"Julius Caesar",      img:"assets/commanders/romans/caesar.png"                  },
  gallii:   { nm:"Vercingetorix",      img:"assets/commanders/gauls/vercingetorix.png"            },
  germani:  { nm:"Arminius",           img:"assets/commanders/germans/arminius.png"               },
  athenae:  { nm:"Alexander de Grote", img:"assets/commanders/greeks/alexander the great.png"     },
  persae:   { nm:"Xerxes",             img:"assets/commanders/persians/xerxes.png"                },
  carthago: { nm:"Hannibal",           img:"assets/commanders/carthage/hannibal.png"              },
  aegyptii: { nm:"Cleopatra",          img:"assets/commanders/egyptians/cleopatra.png"            },
  britanni: { nm:"Boudicca",           img:"assets/commanders/britons/boudica.png"                },
};

/* ---- CONFIGURATIETABELLEN: M6 AVATAR / NIVEAU / MASTERY / ACHIEVEMENTS ---- */

// Alle avatar-onderdelen. requires:{level:N} of {mastery:N} = vereist niveau/mastery om te ontgrendelen.
const BM_AVATAR_PARTS = {
  // Zes huidtinten. "licht" en "donker" zijn exact de twee oorspronkelijke
  // sprites; de vier tussenvormen zijn er in 2026-08-28 uit gegenereerd
  // (tools/gen_sprites.js) door de zes huidkleuren van het palet om te wisselen.
  // Bestaande profielen hoeven dus niet gemigreerd te worden.
  huid:   { nm:"Huidskleur",       opts:[
    { id:"zeerlicht", nm:"Zeer licht" },
    { id:"licht",     nm:"Licht" },
    { id:"getint",    nm:"Getint" },
    { id:"olijf",     nm:"Olijf" },
    { id:"brons",     nm:"Brons" },
    { id:"donker",    nm:"Donker" },
  ]},
  // Oogkleur: een eigen spritelaag over het lichaam heen (de iris bestaat uit
  // precies twee paletkleuren), dus onafhankelijk van de huidtint. Wordt als
  // ronde swatches getoond, net als haar- en capekleur.
  oogkleur:{ nm:"Oogkleur",        opts:[
    { id:"blauw",       nm:"Blauw" },
    { id:"bruin",       nm:"Bruin" },
    { id:"donkerbruin", nm:"Donkerbruin" },
    { id:"groen",       nm:"Groen" },
    { id:"grijs",       nm:"Grijs" },
    { id:"amber",       nm:"Amber" },
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
  baard:  { nm:"Gezichtshaar",     opts:[
    { id:"geen",      nm:"Geen" },
    { id:"snor",      nm:"Snor" },
    { id:"baard",     nm:"Baard" },
    { id:"baardsnor", nm:"Baard en snor" },
    { id:"sikensnor", nm:"Sik en snor",   requires:{level:7} },
  ]},
  haarkleur:{ nm:"Haarkleur",      opts:[
    { id:"blond",  nm:"Blond" },
    { id:"bruin",  nm:"Bruin" },
    { id:"zwart",  nm:"Zwart" },
    { id:"grijs",  nm:"Grijs" },
    { id:"wit",    nm:"Wit" },
    { id:"rood",   nm:"Rood" },
    // Vrije opties eerst, daarna oplopend op niveau (zie CLAUDE.md). Oranje is
    // feller dan een natuurlijke haarkleur — net als blauw en groen fantasie,
    // dus ook op niveau 8 in plaats van vrij zoals de andere haarkleuren.
    { id:"blauw",  nm:"Blauw",            requires:{level:8} },
    { id:"groen",  nm:"Groen",            requires:{level:8} },
    { id:"oranje", nm:"Oranje",           requires:{level:8} },
  ]},
  // Borstband: losse schakelaar in plaats van het oude "Geslacht"-onderdeel.
  // Dat koos vroeger een compleet ander lichaam (base_*_female.png); die twee
  // sprites bleken alleen in deze band te verschillen, dus is de band er als
  // eigen laag uit gelicht en kiest iedereen 'm los van huidtint en oogkleur.
  // Zit onder de wapenrusting: alleen zichtbaar bij vodden of een mantel.
  borstband:{ nm:"Borstband",      opts:[
    { id:"geen", nm:"Zonder" },
    { id:"aan",  nm:"Met" },
  ]},
  armor:  { nm:"Wapenrusting",     opts:[
    { id:"vodden",      nm:"Vodden" },
    { id:"robe",        nm:"Mantel" },
    { id:"licht",       nm:"Licht",        requires:{level:2} },
    { id:"middel",      nm:"Middel",       requires:{level:5} },
    { id:"hopliet",     nm:"Hopliet",      requires:{level:7} },
    { id:"zwaar",       nm:"Zwaar",        requires:{level:9} },
    // Kampioensharnas: blijft een Battle Mode-eigen streven (5★ beheersing in
    // één klasse), nu dat het Ceremoniële Harnas losgekoppeld is (zie hieronder).
    { id:"kampioen",    nm:"Kampioen",     requires:{mastery:5} },
    // Ceremonieel Harnas: het 100%-sluitstuk van Chronica Classica (Single
    // Player) — bewust NIET meer via Battle Mode-mastery te ontgrendelen, zodat
    // uitspelen van de campagne ook ná afloop nog zichtbaar blijft in de klas-
    // arena (Gerbens verzoek 2026-08-25). Zie bmIsUnlocked()/bmChronicaFinaleVoltooid()
    // in battle.js voor hoe dit uit de Chronica-saves (localStorage) gelezen wordt.
    { id:"ceremonieel", nm:"Ceremonieel",  requires:{spFinale:true} },
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

// ── Eenmalige munten-bonus bij het ontgrendelen van bepaalde verborgen
// traits (batch 2, zie ACHIEVEMENTS_DEF in core.js) — toegepast in
// bmAwardBattle()/bmCheckHostTraits() (battle.js). Traits zonder entry hier
// geven geen munten (puur badge, of een vlakke gameplay-bonus elders).
const TRAIT_COIN_BONUS = {
  trait_drieling: 10,
  trait_balans: 10,
  trait_stijlvol_verlies: 5,
  trait_nachtwacht: 10,
  trait_marathonzitting: 15,
  trait_volledige_cirkel: 30,
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

// Klasbeheersing: onzichtbare klasse-XP (classHistory/{cls}/mxp) → ster
// (index+1). Per gevecht vast BM_MASTERY_XP (zie bmMasteryXpForBattle() in
// battle.js), dus de lengte van een gevecht maakt niet uit: gemiddeld ±12 per
// gevecht → ★5 na ±10 gevechten, ★10 na ±50 met dezelfde klasse.
// ★1–★5 gewoon, ★6–★10 = prestige (de vijf sterren "upgraden").
// Exponentieel: elke stap kost meer dan de vorige (gaten 10, 15, 22, 32, 46 |
// 60, 75, 95, 120, 150). ★10 = prestigeklasse → tier:"prestige"-vaardigheid
// in BM_CLASSES. Gelezen door bmCalcMastery() in battle.js.
const BM_MASTERY_TIERS = [10, 25, 47, 79, 125, 185, 260, 355, 475, 625];
const BM_MASTERY_XP = { base:10, win:5 };  // per gevecht, vóór schaling
// Oude profielen (alleen `rounds`, dubbel geteld) → mxp = rounds / deze deler.
const BM_MASTERY_LEGACY_DIV = 3;
const BM_MASTERY_PRESTIGE = 10; // ster waarop de prestige-vaardigheid vrijkomt

// Uitbreidbaar via één extra entry; geen andere code wijzigen.
// BM_ACHIEVEMENTS is vervangen door ACHIEVEMENTS_DEF in core.js (geunificeerd systeem)
