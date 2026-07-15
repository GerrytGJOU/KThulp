/* ============================================================================
   CHRONICA CLASSICA — SINGLE PLAYER MODE (pure data)
   ----------------------------------------------------------------------------
   Verhaal-, puzzel- en klassedata voor de singleplayer-RPG "Chronica
   Classica" (zie "Single Player Mode.docx" in de root voor de volledige
   Game Bible / Character Bible / Master Timeline). Wordt vóór singleplayer.js
   geladen. Bevat GEEN logica — alleen scène-content en configuratietabellen.

   BOUWSTATUS: alleen de PROLOOG ("De Boer van Latium"/"Het Orakel van
   Chronos") staat hieronder uitgewerkt als CNS-scènes, als verticale slice.
   De overige hoofdstukken staan als metadata-skelet in SP_CAMPAIGN zodat de
   wereldkaart/hoofdstukoverzicht er al naar kan verwijzen; hun scènes volgen
   later, in CNS-formaat, gebouwd op de grammatica die per hoofdstuk hieronder
   al vastligt (gesynchroniseerd met Pallas/Minerva).

   SP_CAMPAIGN vervangt de eerdere "13 boeken"-indeling (Master Timeline v1.0
   uit de Game Bible) door de latere, gedetailleerdere Proloog+11 hoofdstukken
   +Finale-structuur die 1-op-1 aan Pallas- en Minerva-lessen gekoppeld is —
   dié structuur is nu leidend voor de bouwvolgorde.

   CNS ("Chronica Narrative Script"): platte-tekstformaat waarin scènes
   geschreven worden, geparsed door singleplayer.js (CNSParser). Bewust GEEN
   YAML — dat stond wel zo in een eerder architectuurdocument, maar de
   daadwerkelijk geteste engine gebruikt dit eenvoudiger tekstformaat; dat is
   leidend. Zie CNSParser in singleplayer.js voor het exacte formaat.

   Belangrijke afwijkingen t.o.v. het aangeleverde testscenario:
   - De speler heeft GEEN naam (Game Bible: "juist daardoor kan iedere leerling
     zichzelf in hem herkennen") — {player.name} is overal uit de tekst gehaald.
   - De VERTELTEKST staat in de TWEEDE PERSOON ("je"/"jij"): de speler wordt
     rechtstreeks aangesproken en is zo letterlijk de hoofdpersoon. De
     gender-keuze (hij/zij/die) blijft bestaan, maar dient alleen voor later —
     wanneer personages in dialoog in de derde persoon óver de speler praten.
     Zie de uitgebreide toelichting bij SP_PROLOOG_CNS.
   ============================================================================ */

/* ---- SAVESLOTS — leerlingen krijgen 3 losse opslagplekken, zodat ze het
   verhaal met alle drie de klassen kunnen uitspelen voordat ze een save
   moeten wissen. Zie SCREENS.spSlots (singleplayer.js). ---- */
const SP_MAX_SLOTS = 3;

/* ---- EERETITELS — verdiend door voortgang/keuzes in Chronica Classica,
   ACCOUNT-breed (niet per saveslot: een titel die je in slot 2 behaalt blijft
   ook zichtbaar als je in slot 1 speelt). Toegekend door een `EERETITEL:`-
   sectie in een CNS-scène (zie CNSParser/spHookTitle in singleplayer.js).
   Zichtbaar op het profiel; één titel is kiesbaar om te tonen in de Battle
   Mode/Boss Battle-lobby (bmDoJoin/bmRenderHostLobby in battle.js).

   `bonus`: optionele passieve bonus voor Battle Mode/Boss Battle/Total War.
   BOUWSTATUS: alleen het DATA-veld en de lobby-weergave staan al; de bonus
   zelf nog NIET verrekend in de gevechtsberekening (battle.js se
   bmCalcAbilityEffect/BE-gain zitten op meerdere plekken verspreid — dat
   hoort bij de Combat-bridge-bouwstap, niet bij Titles zelf). Tot die tijd is
   een title.bonus puur informatief (getoond, niet toegepast).

   Velden `ds`/`icon`/`cat` zijn met opzet gelijk aan ACHIEVEMENTS_DEF-items
   (core.js): SP_TITLES wordt in SCREENS.collection (games.js) samen met de
   algemene eerbewijzen door dezelfde achGroupsHTML()-groepering gerenderd
   (cat:"chronica", zie ACH_CATEGORIES in core.js), zodat "Chronica Classica"
   als eigen categorie naast "Algemeen"/"Klassieke Spellen" verschijnt i.p.v.
   een apart, afwijkend paneel. */
const SP_TITLES = [
  { id:"boogschutter_orakel", nm:"Boogschutter van het Orakel", icon:"eagle", cat:"chronica",
    ds:"Koos de boog toen het Orakel van Chronos ontwaakte.", bonus:null },
  { id:"hopliet_orakel", nm:"Hopliet van het Orakel", icon:"shield", cat:"chronica",
    ds:"Koos het schild toen het Orakel van Chronos ontwaakte.", bonus:null },
  { id:"cavalerist_orakel", nm:"Cavalerist van het Orakel", icon:"column", cat:"chronica",
    ds:"Koos de teugels toen het Orakel van Chronos ontwaakte.", bonus:null },
  { id:"bewaarder_herinnering", nm:"Bewaarder van de Herinnering", icon:"star", cat:"chronica",
    ds:"Ontcijferde het Orakel van Chronos en voltooide de proloog.",
    bonus:{ scope:["battle","boss","totalwar"], type:"be_on_fast", val:1,
            desc:"+1 BE bij een snel juist antwoord" } },
];

/* ---- CAMPAGNEKAART — Proloog + 19 hoofdstukken (5 "Boeken"), gesynchroniseerd
   met Pallas (Grieks) en Minerva (Latijn), klas 2 t/m 6 gymnasium.

   SAMENSMELTING van twee bronnen (2026-07): de vroegere, compactere "11
   hoofdstukken + Finale"-indeling (rijker aan gameplay/personages/thema/
   illustratie-ideeën, uit een eerder gesprek) en de latere, gedetailleerdere
   "Master Campaign Map"-docx (5 Boeken, 19 hoofdstukken, exacte Pallas/
   Minerva-lesnummers, plus een S/A/B-tier mythencanon). De docx-structuur is
   leidend voor de INDELING (aantal hoofdstukken, Pallas/Minerva-koppeling,
   grammatica-volgorde); de rijkere velden (gameplay/personages/thema/
   illustratie) uit de oudere bron zijn overgenomen waar de hoofdstukken
   overeenkomen, en voor de hoofdstukken die alleen in de docx bestonden
   (10-19) opnieuw ontworpen — deels met personages/gameplay-ideeën die al in
   de Character Bible vastlagen (Herodotos: bronnen vergelijken; Athena:
   vragen stellen i.p.v. antwoorden geven).

   `zijverhalen`: 1-3 suggesties uit SP_MYTH_CANON die goed bij dit hoofdstuk
   passen (thematisch/periode) — geen verplichting, wel een vertrekpunt voor
   extra plotlijnen/zijquests. Niet elk canon-verhaal is al ergens genoemd;
   de rest blijft vrij te plaatsen wanneer een hoofdstuk wordt uitgebouwd.

   Elk hoofdstuk legt vast: welke Pallas/Minerva-les erbij hoort, welke
   grammatica de puzzels/opdrachten voedt, de hoofdpersonages, en de
   illustratie die er (in stripstijl, door Gemini) bij hoort. Verhaal gaat
   vóór lesstof — de grammatica hieronder is de BASIS voor puzzels, niet het
   doel van de scène. ---- */
const SP_CAMPAIGN = [
  { id:"proloog", nr:0, boek:null, type:"proloog", nm:"Het Orakel van Chronos",
    periode:"Tijdloos / overgang tussen heden en oudheid",
    verhaal:"De speler ontdekt het Orakel van Chronos en wordt de klassieke wereld ingezogen.",
    pallas:"Les 1: De Grieken en wij", minerva:"Hoofdstuk 1: Het Latijn en de Romeinen",
    grammatica:"Grieks alfabet, taalbewustzijn, eerste Latijnse woorden",
    gameplay:"Codex Memoriae, inscripties lezen, eerste keuzes",
    personages:"Hermes/Mercurius, Orakel van Chronos",
    illustratie:"De ontdekking van het bronzen Orakel" },

  // ---- BOEK I — DE ONTWAAKTE HERINNERING (hoofdstuk 1-5) ----
  { id:"ch1", nr:1, boek:"I — De Ontwaakte Herinnering", type:"hoofdstuk", nm:"De Namen van de Wereld",
    periode:"Mythisch Griekenland",
    verhaal:"De speler ontdekt dat namen macht hebben. Zonder namen verdwijnen goden en helden uit de herinnering.",
    pallas:"Les 2: De Griekse goden", minerva:"Hoofdstuk 2: Midas",
    grammatica:"Zelfstandig naamwoord, bijvoeglijk naamwoord (alleen groep 1/2 — dezelfde uitgangen als zn groep 1/2), lidwoord, nominativus, accusativus, vocativus",
    gameplay:"Wie handelt? Wie ondergaat? Wie wordt aangesproken?",
    personages:"Midas, Dionysus, Olympische goden",
    thema:"Een naam maakt iets herkenbaar",
    illustratie:"Midas in zijn paleis met gouden voorwerpen",
    zijverhalen:"Prometheus (S-tier); Pandora (S-tier) — al in gebruik als plotlijnen B/C naast Midas (A)" },
  { id:"ch2", nr:2, boek:"I — De Ontwaakte Herinnering", type:"hoofdstuk", nm:"De Werken van de Helden",
    periode:"Heroïsche tijd",
    verhaal:"De speler helpt Herakles en ontdekt dat heldendom wordt verdiend door daden.",
    pallas:"Les 3-4: Herakles en zijn werken", minerva:"Hoofdstuk 3: Latona, Apollo en Artemis",
    grammatica:"Praesens, werkwoordstammen, imperativus, esse, posse",
    gameplay:"Acties uitvoeren via werkwoorden",
    personages:"Herakles, Latona, Apollo, Artemis",
    thema:"Taal beschrijft wat mensen doen",
    illustratie:"Herakles tijdens één van zijn opdrachten",
    zijverhalen:"Bellerophon & Chimaira (A-tier, ideale RPG-boss); Atalanta + Calydonische ever (A-tier, boss fight)" },
  { id:"ch3", nr:3, boek:"I — De Ontwaakte Herinnering", type:"hoofdstuk", nm:"Beloften van Goden en Mensen",
    periode:"Mythische wereld",
    verhaal:"De speler ontdekt relaties tussen goden en mensen. Bezit, afkomst en geschenken worden belangrijk.",
    pallas:"Les 5: Apotheose van Herakles", minerva:"Hoofdstuk 4: Jupiter en Io",
    grammatica:"Genitivus, dativus, bijstelling",
    gameplay:"Relaties begrijpen, voorwerpen koppelen aan eigenaars",
    personages:"Herakles, Zeus/Jupiter, Io",
    thema:"Taal laat zien hoe mensen verbonden zijn",
    illustratie:"Zeus en Io onder goddelijke bescherming",
    zijverhalen:"Europa (A-tier, begin van Kreta); Ganymedes (B-tier); Danaïden (B-tier)" },
  { id:"ch4", nr:4, boek:"I — De Ontwaakte Herinnering", type:"hoofdstuk", nm:"Het Labyrint van Herinneringen",
    periode:"Kreta",
    verhaal:"Theseus verdwaalt in een labyrint waarin herinneringen verdwijnen. De speler ontdekt dat tijd en herinnering meerdere lagen hebben.",
    pallas:"Les 6-7: Theseus, Ariadne, Minotauros, terugreis", minerva:"Hoofdstuk 5: Phaëthon · Hoofdstuk 6: De Familia",
    grammatica:"Infinitivus, vocativus, imperfectum, perfectum, ablativus",
    gameplay:"Eerste grote keuzes, tijdsherkenning",
    personages:"Theseus, Ariadne, Minotauros, Phaëthon",
    thema:"Gebeurtenissen hebben een verleden en gevolg",
    illustratie:"Theseus in het donkere Labyrint",
    zijverhalen:"Daidalos & Ikaros (S-tier, onmisbaar — direct verbonden aan het Labyrint zelf)" },
  { id:"ch5", nr:5, boek:"I — De Ontwaakte Herinnering", type:"hoofdstuk", nm:"Ilion in Vlammen",
    periode:"Trojaanse Oorlog",
    verhaal:"De speler belandt in het tiende jaar van de oorlog en kiest tussen Grieken, Trojanen of neutraliteit. Homeros verschijnt.",
    pallas:"Les 8-14: Trojaanse Oorlog, Achilles, Patroklos, Ajax, Odysseus, Val van Troje", minerva:"Hoofdstuk 7: Slavernij · H8: Onderwijs · H9: Ontstaan van de mens · H10: Aeneas",
    grammatica:"Imperfectum, aoristus, participia, A.C.I., betrekkelijke bijzinnen/voornaamwoorden",
    gameplay:"Historische keuzes, factiesysteem",
    personages:"Achilles, Patroklos, Ajax, Hector, Odysseus, Aeneas, Homeros",
    thema:"Verhalen worden doorgegeven door taal",
    vertakkingen:"Trojaans / Grieks / Neutraal",
    illustratie:"Troje brandt" },

  // ---- BOEK II — HELDEN EN KONINGEN (hoofdstuk 6-9) ----
  { id:"ch6", nr:6, boek:"II — Helden en Koningen", type:"hoofdstuk", nm:"De Zoon van Troje",
    periode:"Reis van Aeneas",
    verhaal:"De speler reist met Aeneas naar Latium en ontdekt hoe een mythe een nationale geschiedenis wordt.",
    pallas:"Herhaling Troje", minerva:"Hoofdstuk 10-11: Aeneas, Romulus en de stichting van Rome",
    grammatica:"Passief, participium perfectum passief, deponentia",
    gameplay:"Legendes reconstrueren",
    personages:"Aeneas, Anchises, Romulus",
    thema:"Geschiedenis en mythe lopen door elkaar",
    illustratie:"Aeneas vlucht uit Troje",
    zijverhalen:"Romulus & Remus (⭐⭐⭐⭐⭐); Sabijnse maagdenroof (⭐⭐⭐⭐⭐) — de stichting van Rome zelf" },
  { id:"ch7", nr:7, boek:"II — Helden en Koningen", type:"hoofdstuk", nm:"Mensen Achter de Mythen",
    periode:"Archaïsche Wereld",
    verhaal:"De speler ontdekt het dagelijks leven van gewone mensen naast de grote helden.",
    pallas:"Les 15-18: Odysseus, Faiaken, Polyfemos, Kirke, Hades", minerva:"Hoofdstuk 14: Rome als multiculturele samenleving · H15/H16: dagelijks leven",
    grammatica:"Medium, passief, participium, voornaamwoorden",
    gameplay:"Dialoog, sociale keuzes",
    personages:"Odysseus, Kirke, gewone burgers",
    thema:"Niet alleen helden maken geschiedenis",
    illustratie:"Odysseus bij Kirke" },
  { id:"ch8", nr:8, boek:"II — Helden en Koningen", type:"hoofdstuk", nm:"De Stad van Athena",
    periode:"Klassiek Athene",
    verhaal:"De speler ontdekt politiek, onderwijs en cultuur. Democratie en filosofie staan centraal; Athena wordt mentor.",
    pallas:"Les 19-27: Ithaka, Wraak van Odysseus, Agamemnon, Athena, Democratie, Olympische Spelen", minerva:"Hoofdstuk 19: Dagelijks leven · H20: Vermaak in Rome",
    grammatica:"Futurum, conjunctivus, comparativus, vraagzinnen",
    gameplay:"Retorica, debat, overtuigen",
    personages:"Athena, Atheense burgers, Romeinen",
    thema:"Taal overtuigt mensen",
    illustratie:"De Agora van Athene",
    zijverhalen:"Oedipus & de Sfinx (S-tier, perfect voor grammatica-puzzels — een raadsel dat letterlijk om taal draait)" },
  { id:"ch9", nr:9, boek:"II — Helden en Koningen", type:"hoofdstuk", nm:"Oorlog en Overwinning",
    periode:"Perzische Oorlogen / Romeinse expansie",
    verhaal:"De speler ziet hoe oorlog de geschiedenis vormt.",
    pallas:"Les 28: De Perzische Oorlogen", minerva:"Hoofdstuk 17: Hannibal over de Alpen · H18: Hannibal verslagen",
    grammatica:"Perfectum, futurum, futurum exactum, ablativus absolutus",
    gameplay:"Strategie en militaire keuzes",
    personages:"Leonidas, Themistocles, Hannibal",
    illustratie:"Slagveld met Grieken en Perzen" },

  // ---- BOEK III — DE WERELD VAN MENSEN (hoofdstuk 10-12, nieuw t.o.v. de oudere indeling) ----
  { id:"ch10", nr:10, boek:"III — De Wereld van Mensen", type:"hoofdstuk", nm:"De Vader van de Geschiedenis",
    periode:"5e eeuw v.Chr.",
    verhaal:"De speler ontmoet Herodotos en leert kritisch naar bronnen kijken.",
    pallas:"Overgang naar historiografie (Herodotos)", minerva:"Hoofdstuk 21: De Romeinen en de dood",
    grammatica:"Historische taal, bronanalyse",
    gameplay:"Bronnen vergelijken, verschillende versies van hetzelfde verhaal ontdekken (Herodotos se rol uit de Character Bible)",
    personages:"Herodotos",
    thema:"Niet alles wat verteld wordt is automatisch waar",
    illustratie:"Herodotos die getuigenissen verzamelt op de agora" },
  { id:"ch11", nr:11, boek:"III — De Wereld van Mensen", type:"hoofdstuk", nm:"De Stem van de Filosofen",
    periode:"Klassiek Athene",
    verhaal:"Socrates, Plato en Aristoteles: filosofie en kritisch denken vormen de kern.",
    pallas:"Filosofen: Socrates, Plato, Aristoteles", minerva:"Hoofdstuk 22: Caesars carrière",
    grammatica:"Complexe zinsbouw, argumentatie",
    gameplay:"Socratische dialoog — vragen stellen i.p.v. antwoorden geven (Athena se rol uit de Character Bible)",
    personages:"Socrates, Plato, Aristoteles",
    illustratie:"Socrates in gesprek op de Agora, omringd door leerlingen" },
  { id:"ch12", nr:12, boek:"III — De Wereld van Mensen", type:"hoofdstuk", nm:"Alexander en de Grenzen van de Wereld",
    periode:"Hellenistische Tijd",
    verhaal:"De Griekse taal verspreidt zich over de wereld met Alexander de Grote.",
    pallas:"Alexander de Grote", minerva:"Hoofdstuk 23: Caesar in België en Nederland",
    grammatica:"Complexe werkwoorden, participia",
    gameplay:"Taalverspreiding volgen over een groeiende kaart",
    personages:"Alexander de Grote, Philippus II",
    illustratie:"Alexander bij de Gordiaanse Knoop" },

  // ---- BOEK IV — ROME VERRIJST (hoofdstuk 13-16, nieuw t.o.v. de oudere indeling) ----
  { id:"ch13", nr:13, boek:"IV — Rome Verrijst", type:"hoofdstuk", nm:"De Eeuwige Stad",
    periode:"Koninkrijk & Republiek",
    verhaal:"Rome groeit uit tot wereldmacht. Livius verschijnt.",
    pallas:"Verdieping Griekse cultuur", minerva:"Hoofdstuk 24: Augustus en Nero",
    grammatica:"Conjunctivus, N.C.I., semi-deponentia",
    gameplay:"Legendes van vroege Romeinse deugd/moed naspelen",
    personages:"Livius",
    zijverhalen:"Horatii & Curiatii, Cloelia, Horatius Cocles, Mucius Scaevola, Lucretia, Cincinnatus (alle ⭐⭐⭐⭐) — de vroege-Republiek-deugdverhalen" },
  { id:"ch14", nr:14, boek:"IV — Rome Verrijst", type:"hoofdstuk", nm:"Caesar Schrijft Geschiedenis",
    periode:"Late Republiek",
    verhaal:"Caesar leert dat schrijvers de geschiedenis mede vormgeven.",
    pallas:"Verdieping", minerva:"Hoofdstuk 22-23: Caesar",
    grammatica:"Gerundium, gerundivum",
    gameplay:"Bronnen analyseren",
    personages:"Caesar",
    illustratie:"Caesar schrijft zijn Commentarii",
    zijverhalen:"Spartacus (⭐⭐⭐⭐⭐); Cicero (⭐⭐⭐⭐); Coriolanus, Camillus, Regulus, Cato (⭐⭐⭐)" },
  { id:"ch15", nr:15, boek:"IV — Rome Verrijst", type:"hoofdstuk", nm:"Augustus en de Pax Romana",
    periode:"Vroege Keizertijd",
    verhaal:"Vergilius verbindt Troje en Rome.",
    pallas:"Verdieping", minerva:"Hoofdstuk 24: Augustus",
    grammatica:"Literair Latijn",
    personages:"Augustus, Vergilius",
    illustratie:"Augustus bij de Ara Pacis" },
  { id:"ch16", nr:16, boek:"IV — Rome Verrijst", type:"hoofdstuk", nm:"Keizers en Dichters",
    periode:"Romeinse Keizertijd",
    verhaal:"Macht, propaganda en literatuur bepalen het beeld van de geschiedenis.",
    pallas:"Verdieping", minerva:"Hoofdstuk 25: Latijnse literatuur",
    grammatica:"Verdieping naamvallen",
    personages:"Nero, Ovidius",
    illustratie:"Nero en het Colosseum" },

  // ---- BOEK V — DE LAATSTE HERINNERING (hoofdstuk 17-19, finale) ----
  { id:"ch17", nr:17, boek:"V — De Laatste Herinnering", type:"hoofdstuk", nm:"De Bibliotheek van Mnemosyne",
    periode:"Buiten Tijd en Ruimte",
    verhaal:"Alle opgedane kennis komt samen.",
    pallas:"Eigen content", minerva:"Eigen content",
    grammatica:"Herhaling van alle grammatica",
    personages:"Mnemosyne" },
  { id:"ch18", nr:18, boek:"V — De Laatste Herinnering", type:"hoofdstuk", nm:"De Rivier Lethe",
    periode:"Mythologische Eindwereld",
    verhaal:"De speler ontdekt de ware aard van Lethe en de kracht van vergetelheid.",
    pallas:"Eigen content", minerva:"Eigen content",
    grammatica:"Integratie Grieks & Latijn",
    personages:"Lethe",
    zijverhalen:"Persephone (onderwereld) & Demeter (seizoenen) — A-tier, thematisch verwant aan de rivier van vergetelheid" },
  { id:"finale", nr:19, boek:"V — De Laatste Herinnering", type:"finale", nm:"Chronica Classica",
    periode:"Tijdloos",
    thema:"De strijd tegen de Vergetelheid",
    verhaal:"Kronos, Athena, Mnemosyne, Kleio, Homeros, Herodotos, Livius en Vergilius komen samen. De speler gebruikt alles wat hij, zij of die heeft geleerd om de herinnering aan de klassieke wereld veilig te stellen.",
    grammatica:"Eindtoets van alle grammatica en taalvaardigheid",
    gameplay:"Alle Codex-kennis wordt gebruikt",
    eindboodschap:"Wie de taal bewaart, bewaart de geschiedenis" },
];

/* ---- MYTHENCANON — S/A/B-tier prioriteitenlijst + de nog ontbrekende
   Romeinse verhalen, uit de "Master Campaign Map"-docx. Naslagwerk voor
   zijverhalen/extra plotlijnen bij toekomstige hoofdstukken (zie `zijverhalen`
   hierboven) — GEEN uitputtende toewijzing: veel entries staan hier nog vrij
   en kunnen bij elk hoofdstuk ingezet worden waar ze passen. ---- */
const SP_MYTH_CANON = {
  sTier: ["Prometheus","Pandora","Perseus & Medusa","Jason & de Argonauten",
          "Orpheus & Eurydice","Daidalos & Ikaros","Oedipus & de Sfinx",
          "Bellerophon & Chimaira","De Argonautentocht","De Titanenstrijd"],
  aTier: ["Persephone","Demeter","Europa","Kadmos","De Zeven tegen Thebe",
          "Antigone","Medea","Atalanta","Calydonische ever","Meleager",
          "Niobe","Narcissus","Echo","Eros & Psyche","Pygmalion"],
  bTier: ["Arion","Arachne","Baucis & Philemon","Tantalos","Sisyphos","Ixion",
          "Danaïden","Midas (uitbreiding)","Actaeon","Pentheus","Hippolytos",
          "Hippodameia","Ganymedes","Endymion","Selene"],
  romeins: ["Romulus & Remus","Sabijnse maagdenroof","Horatii & Curiatii",
            "Cloelia","Horatius Cocles","Mucius Scaevola","Lucretia",
            "Cincinnatus","Coriolanus","Camillus","Regulus","Cato","Spartacus","Cicero"],
};

/* ---- VOORNAAMWOORDEN — uitbreidbaar, nieuw gender toevoegen = 1 regel ---- */
const SP_PRONOUNS = {
  man:       { subj:"hij", obj:"hem",  poss:"zijn" },
  vrouw:     { subj:"zij", obj:"haar", poss:"haar" },
  nonbinair: { subj:"die", obj:"hen",  poss:"hun"  },
};
const SP_GENDER_OPTIONS = [
  { id:"man",       label:"hij / hem / zijn" },
  { id:"vrouw",     label:"zij / haar / haar" },
  { id:"nonbinair", label:"die / hen / hun" },
];

/* ---- GRIEKS ALFABET — transcriptietabel, getoond tijdens puzzels ---- */
const SP_GREEK_ALPHABET = [
  { letter:"Α α", nm:"alfa",    translit:"a"  },
  { letter:"Β β", nm:"bèta",    translit:"b"  },
  { letter:"Γ γ", nm:"gamma",   translit:"g"  },
  { letter:"Δ δ", nm:"delta",   translit:"d"  },
  { letter:"Ε ε", nm:"epsilon", translit:"e"  },
  { letter:"Ζ ζ", nm:"zèta",    translit:"z"  },
  { letter:"Η η", nm:"èta",     translit:"è"  },
  { letter:"Θ θ", nm:"thèta",   translit:"th" },
  { letter:"Ι ι", nm:"iota",    translit:"i"  },
  { letter:"Κ κ", nm:"kappa",   translit:"k"  },
  { letter:"Λ λ", nm:"lambda",  translit:"l"  },
  { letter:"Μ μ", nm:"mu",      translit:"m"  },
  { letter:"Ν ν", nm:"nu",      translit:"n"  },
  { letter:"Ξ ξ", nm:"ksi",     translit:"x"  },
  { letter:"Ο ο", nm:"omikron", translit:"o"  },
  { letter:"Π π", nm:"pi",      translit:"p"  },
  { letter:"Ρ ρ", nm:"rho",     translit:"r"  },
  { letter:"Σ σ", nm:"sigma",   translit:"s"  },
  { letter:"Τ τ", nm:"tau",     translit:"t"  },
  { letter:"Υ υ", nm:"ypsilon", translit:"y"  },
  { letter:"Φ φ", nm:"fi",      translit:"f"  },
  { letter:"Χ χ", nm:"chi",     translit:"ch" },
  { letter:"Ψ ψ", nm:"psi",     translit:"ps" },
  { letter:"Ω ω", nm:"omega",   translit:"oo" },
];

/* ---- PUZZELS — opgezocht door PUZZLE-hook o.b.v. de id in de CNS-tekst ---- */
const SP_PUZZLES = {
  puzzle_orakel_symbolen_01: {
    type:"greek-transliteration",
    woord:{ grieks:"ΧΡΟΝΟΣ", antwoord:"chronos" },
  },
};

/* ---- KLASSEKEUZE — koppelt REWARD-tekst (Dutch, auteursvriendelijk) aan
   de bestaande Battle Mode-klasse-id (battle-data.js: BM_CLASSES), zodat
   stat-bonussen/unlocks automatisch doorwerken. ---- */
const SP_CLASS_REWARD_MAP = {
  "Boogschutter": "boogschutter",
  "Hopliet":      "hopliet",
  "Cavalerist":   "cavalerie",
};

/* ---- COMBAT AVATAR — ontgrendelingen ----
   Chronica Classica hergebruikt Battle Mode se pixel-sprite-avatar (dezelfde
   PNG-lagen uit assets/sprites/, BM_AVATAR_PARTS voor labels/iconen), maar
   met een EIGEN ontgrendellogica: geen level/mastery/munten, maar VERHAAL.
   - SP_AVATAR_FREE_PARTS: categorieën die je vanaf het begin vrij kiest
     (uiterlijk, geen gevechtsuitrusting) — alle opties, ongeacht wat
     BM_AVATAR_PARTS voor Battle Mode als level-gated aanmerkt.
   - Startuitrusting: armor "vodden" + wapen "hooivork" (de boer uit de
     proloog) — altijd beschikbaar, geen aparte entry nodig.
   - SP_AVATAR_STORY_UNLOCKS: elke andere uitrustingsoptie moet hier expliciet
     aan een verdiende eretitel (of later: flag) gekoppeld zijn, anders blijft
     hij op slot ("ontgrendelt later in het verhaal"). Nu alleen de drie
     wapens die je letterlijk in de proloog oppakt; nieuwe hoofdstukken breiden
     dit uit naarmate het verhaal nieuwe uitrusting oplevert. ---- */
const SP_AVATAR_FREE_PARTS = ["geslacht","huid","haar","haarkleur","baard"];
const SP_AVATAR_STORY_UNLOCKS = {
  "wapen:boog":   { title:"boogschutter_orakel" },
  "wapen:speer":  { title:"hopliet_orakel" },
  "wapen:zwaard": { title:"cavalerist_orakel" }, // cavalerist: dichtstbijzijnde sprite (geen ruitersporen-wapen)
};

/* ---- PROLOOG: "DE BOER VAN LATIUM" (scène-ID's PRO_###) ----
   De proloog gebruikt het prefix PRO_; hoofdstuk 1 e.v. krijgen CH1_/CH2_ enz.
   (was eerder ook CH1_, wat botste met het echte hoofdstuk 1 — hernoemd).
   VERTELPERSPECTIEF = TWEEDE PERSOON. De verteltekst spreekt de speler
   rechtstreeks aan met "je"/"jij" — dat maakt de speler letterlijk de
   hoofdpersoon en is immersiever dan een hij/zij-verteller. Er staan dus
   BEWUST geen {subject}/{object}/{possessive}-templates in de narration.
   De gender-keuze (SP_PRONOUNS) blijft wél bestaan: die is er voor later,
   wanneer PERSONAGES in DIALOGUE in de derde persoon óver de speler praten
   ("ik zie dat {subject} moe is" → hij/zij/die). In de proloog komt dat nog
   niet voor, dus de gender-keuze heeft hier nog geen zichtbaar effect.
   Geen {player.name}: de speler is naamloos (Game Bible). */
const SP_PROLOOG_CNS = `
=== SCENE: PRO_001 ===

TITLE:
Het Veld bij Latium

TEXT:
De zon is net over de heuvels van Latium gekropen, en jij bent al uren aan het werk. Het zweet prikt in je ogen; de aarde is hier droog en koppig, zwaar als steen onder de ploeg. Je zet je schrap en duwt — en dan, met een doffe klap die je tot in je polsen voelt, staat de ploeg stil. Iets onder de grond geeft niet mee.

CHOICES:

* Graaf meteen verder -> PRO_002
* Veeg eerst voorzichtig het zand weg -> PRO_001B

END

=== SCENE: PRO_001B ===

TITLE:
Voorzichtig

TEXT:
Je knielt en veegt het losse zand weg, handvol na handvol, tot je vingertoppen iets hards raken. Geen steen. Hout — donker, bewerkt hout, met de rechte lijn van een rand die ooit door mensenhanden is gemaakt.

CHOICES:

* Graaf de kist op -> PRO_002

END

=== SCENE: PRO_002 ===

TITLE:
De Kist

TEXT:
Na lang graven ligt ze eindelijk voor je: een oude houten kist, zwart geworden van de jaren onder de grond. Het deksel is gebarsten en het beslag is verroest, maar het slot houdt nog altijd stand. Iemand heeft deze kist ooit met zorg begraven. De vraag is alleen: om haar te bewaren, of om haar te verbergen?

CHOICES:

* Open de kist -> PRO_003
* Laat de kist gesloten en keer terug naar het dorp -> PRO_002B

END

=== SCENE: PRO_002B ===

TITLE:
Twijfel

TEXT:
Je laat de kist waar ze is en loopt terug naar het dorp, de ploeg achter je aan. Maar de hele dag, bij elke voor die je trekt, dwaalt je gedachte terug naar dat donkere hout in de aarde — en naar wat je daar misschien hebt laten liggen.

END

=== SCENE: PRO_003 ===

TITLE:
Drie Voorwerpen

TEXT:
Het slot geeft toe met een droge knak. Onder een laag vergeeld linnen liggen drie voorwerpen, zorgvuldig naast elkaar gelegd: een jachtboog, de pees na al die jaren nog strak gespannen; een bronzen speerpunt op een verweerde schacht; en een paar zware ruitersporen, groen uitgeslagen. Het is alsof ze op jou hebben liggen wachten. Je mag er één meenemen.

CHOICES:

* Neem de jachtboog -> PRO_004A
* Neem de speer -> PRO_004B
* Neem de ruitersporen -> PRO_004C

END

=== SCENE: PRO_004A ===

TITLE:
De Boogschutter

TEXT:
Je sluit je hand om de boog. Het hout ligt warm en vertrouwd in je greep, alsof je vingers deze vorm al kenden voordat je hem ooit zag. Afstand. Geduld. Het juiste moment, geen tel te vroeg. Vanaf nu zijn dat jouw instincten.

REWARD:
class=Boogschutter; traits=observatie,snelheid,precisie

EERETITEL:
boogschutter_orakel

CHOICES:

* Verder zoeken in de kist -> PRO_005

END

=== SCENE: PRO_004B ===

TITLE:
De Hopliet

TEXT:
Je grijpt de speer. Het brons is koud, maar het gewicht ervan geeft je een vreemde kalmte, alsof de grond onder je voeten steviger wordt. Standhouden. Je linie niet verlaten, wat er ook op je afkomt. Vanaf nu voelt dat als je tweede natuur.

REWARD:
class=Hopliet; traits=kracht,moed,verdediging

EERETITEL:
hopliet_orakel

CHOICES:

* Verder zoeken in de kist -> PRO_005

END

=== SCENE: PRO_004C ===

TITLE:
De Cavalerist

TEXT:
Je tilt de ruitersporen op; ze zijn lichter dan je had verwacht. In je handen voel je meteen waarvoor ze gemaakt zijn — voor snelheid, voor de aanval die begint voordat de vijand hem ziet aankomen. Beweging. Overzicht. Als eerste zijn. Vanaf nu draagt je lichaam die belofte met zich mee.

REWARD:
class=Cavalerist; traits=mobiliteit,tactiek,snelheid

EERETITEL:
cavalerist_orakel

CHOICES:

* Verder zoeken in de kist -> PRO_005

END

=== SCENE: PRO_005 ===

TITLE:
De Bronzen Schijf

TEXT:
Dieper in de kist, onder een laatste laag linnen, ligt nog iets. Een ronde schijf van brons, niet groter dan je handpalm, bedekt met tekens die je nooit eerder zag — geen letters die je kent, en toch lijken ze iets te willen zeggen. De schijf is warm. Warm alsof iemand haar zojuist heeft vastgehouden, hier, diep onder de koude grond.

IMAGE:
prologue.png

CODEX:
codex_orakel_van_chronos

CHOICES:

* Raak de schijf aan -> PRO_006
* Trek je hand terug -> PRO_005B

END

=== SCENE: PRO_005B ===

TITLE:
Aarzeling

TEXT:
Je aarzelt, je hand zweeft boven het brons. Maar de schijf lijkt naar je te reiken — geen geluid, geen beweging, en toch een roep, zacht en aanhoudend, alsof ze al die tijd precies op jou heeft gewacht.

CHOICES:

* Raak de schijf alsnog aan -> PRO_006

END

=== SCENE: PRO_006 ===

TITLE:
Vervorming

TEXT:
Op het moment dat je vingertoppen het brons raken, begint de lucht te trillen als water waarin een steen valt. De kleuren van het veld lopen uit, de heuvels vervagen, het geluid van de wind valt weg. Latium zelf lijkt zich om je heen te herschikken — of misschien is het de tijd die dat doet.

IMAGE:
tijdvervorming_veld.jpg

CHOICES:

* Laat het gebeuren -> PRO_007

END

=== SCENE: PRO_007 ===

TITLE:
Het Orakel van Chronos

TEXT:
Uit de schijf rijzen de tekens omhoog en blijven in de lucht hangen, gloeiend en geduldig. Samen vormen ze een patroon — een woord, vermoed je, in een taal die ouder is dan de jouwe. Het wacht. Alsof de poort zich pas verder opent wanneer jij het weet te lezen.

PUZZLE:
puzzle_orakel_symbolen_01

CHOICES:

* Ontcijfer het patroon -> PRO_008

END

=== SCENE: PRO_008 ===

TITLE:
De Poort

TEXT:
De tekens vallen op hun plaats, en er gaat een siddering door de lucht. Vlak voor je scheurt de wereld open tot een poort van licht — licht zonder kleur, zonder warmte. Aan de andere kant, half zichtbaar, staat een gestalte roerloos te wachten. Op jou.

QUEST:
quest_boodschapper_van_kronos: gestart

CHOICES:

* Spreek de gestalte aan -> PRO_009

END

=== SCENE: PRO_009 ===

TITLE:
De Boodschapper

TEXT:
De gestalte beweegt niet en spreekt niet. Pas wanneer je dichterbij komt, hoor je een stem — kalm, helder en van onmetelijk ver weg, alsof ze niet uit deze plaats komt maar van buiten de tijd zelf.

DIALOGUE:
De Boodschapper van Kronos
De wereld vergeet. En jij bent de eerste sinds lange tijd die het merkt.

EERETITEL:
bewaarder_herinnering

END
`.trim();
