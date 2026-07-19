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
   een apart, afwijkend paneel.

   `secret:true` op ALLE titels: nog niet behaalde eretitels tonen daardoor
   "???"/"Geheim eerbewijs" op het profiel (dezelfde achGroupsHTML-renderItem-
   afhandeling als geheime Battle Mode-eerbewijzen) i.p.v. de naam/omschrijving
   te verklappen — voorkomt verhaalspoilers. Eenmaal behaald tonen ze gewoon
   normaal (secret geldt alleen zolang !got). */
const SP_TITLES = [
  { id:"boogschutter_orakel", nm:"Boogschutter van het Orakel", icon:"eagle", cat:"chronica", secret:true,
    ds:"Koos de boog toen het Orakel van Chronos ontwaakte.", bonus:null },
  { id:"hopliet_orakel", nm:"Hopliet van het Orakel", icon:"shield", cat:"chronica", secret:true,
    ds:"Koos het schild toen het Orakel van Chronos ontwaakte.", bonus:null },
  { id:"cavalerist_orakel", nm:"Cavalerist van het Orakel", icon:"column", cat:"chronica", secret:true,
    ds:"Koos de teugels toen het Orakel van Chronos ontwaakte.", bonus:null },
  { id:"bewaarder_herinnering", nm:"Bewaarder van de Herinnering", icon:"star", cat:"chronica", secret:true,
    ds:"Ontcijferde het Orakel van Chronos en voltooide de proloog.",
    bonus:{ scope:["battle","boss","totalwar"], type:"be_on_fast", val:1,
            desc:"+1 BE bij een snel juist antwoord" } },
  // Hoofdstuk 1 — drie parallelle lijnen (A/B/C, zie SP_CH1_CNS). Elke lijn
  // leert de volledige hoofdstuk-1-grammatica; welke titel je krijgt hangt af
  // van welke lijn je speelde. Alle drie zonder bonus (bewust) — bonussen
  // blijven voorbehouden aan de grotere mijlpalen (zoals de proloog-titel).
  { id:"ch1_a_midas", nm:"Bevrijder van Midas", icon:"amphora", cat:"chronica", secret:true,
    ds:"Hielp koning Midas van zijn gouden vloek te verlossen.", bonus:null },
  { id:"ch1_b_athena", nm:"Getuige van Athena's Geboorte", icon:"owl", cat:"chronica", secret:true,
    ds:"Was aanwezig toen Athena voltallig gewapend uit Zeus' hoofd sprong.", bonus:null },
  { id:"ch1_c_prometheus", nm:"Vriend van de Mensheid", icon:"torch", cat:"chronica", secret:true,
    ds:"Stond de mensheid bij toen het vuur — en de hoop — hun deel werden.", bonus:null },
  // Hoofdstuk 2 — vier parallelle lijnen (L/S/K/H, zie SP_CH2_CNS) rond Hera's
  // jaloezie, plus een mijlpaal voor Athena's overgang van zwijgend getuige
  // naar actieve mentor zodra alle vier Herinneringsfragmenten binnen zijn.
  { id:"ch2_latona", nm:"Toevlucht op Delos", icon:"trident", cat:"chronica", secret:true,
    ds:"Bleef Latona trouw tot ze op het drijvende eiland Delos een plek vond om te bevallen.", bonus:null },
  { id:"ch2_semele", nm:"Getuige van Semeles Val", icon:"torch", cat:"chronica", secret:true,
    ds:"Zag Semele's wens om Jupiters ware gedaante te aanschouwen fataal aflopen — en Bacchus geboren worden uit zijn as.", bonus:null },
  { id:"ch2_kallisto", nm:"Onder de Sterren Herenigd", icon:"star", cat:"chronica", secret:true,
    ds:"Volgde Kallisto's lot van nimf tot berin tot sterrenbeeld aan het firmament.", bonus:null },
  { id:"ch2_herakles_eerste_taken", nm:"Overwinnaar van Leeuw en Hydra", icon:"shield", cat:"chronica", secret:true,
    ds:"Stond Herakles bij tijdens zijn eerste twee beproevingen voor Eurystheus.", bonus:null },
  { id:"ch2_athena_mentor", nm:"Athena's Vertrouweling", icon:"owl", cat:"chronica", secret:true,
    ds:"Zag Athena, na vier stille getuigenissen, eindelijk spreken als mentor.", bonus:null },
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
    verhaal:"Hera's jaloezie jaagt op iedereen die Zeus ooit heeft liefgehad. Vier parallelle lijnen: Latona (afgerond), Semele (grijpt terug naar Bacchus/H1), Kallisto (introduceert Artemis) en Herakles (intro + eerste werken — afgerond in Hoofdstuk 3).",
    pallas:"Les 3-4: Herakles en zijn werken", minerva:"Hoofdstuk 3: Latona, Apollo en Artemis",
    grammatica:"Praesens, werkwoordstammen, imperativus, esse, posse",
    gameplay:"Acties uitvoeren via werkwoorden",
    personages:"Herakles, Latona, Semele, Kallisto, Zeus/Jupiter, Hera/Juno, Apollo, Diana/Artemis, Bacchus",
    thema:"Taal beschrijft wat mensen doen — en jaloezie beschrijft wat goden doen",
    illustratie:"De geboorte van Apollo en Diana op Delos",
    zijverhalen:"Bellerophon & Chimaira (A-tier, ideale RPG-boss); Atalanta + Calydonische ever (A-tier, boss fight)" },
  { id:"ch3", nr:3, boek:"I — De Ontwaakte Herinnering", type:"hoofdstuk", nm:"Beloften van Goden en Mensen",
    periode:"Mythische wereld",
    verhaal:"De speler ontdekt relaties tussen goden en mensen. Bezit, afkomst en geschenken worden belangrijk. Herakles' lijn gaat verder waar Hoofdstuk 2 ophield (Leeuw + Hydra volbracht, 2/12 werken) en rondt zijn overige taken af.",
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

/* ---- WERELDKAART — geïllustreerde panelen (Gemini, stripstijl "antieke
   atlas") met onthullende locatie-pins. De volledige wereld (Britannia tot
   India, zie Chronica.md) is verdeeld in panelen zodat elk leesbaar blijft;
   nu alleen paneel "aegean" getekend (dekt Proloog + Hoofdstuk 1). Referentie
   voor de kustlijnen/liggingen: twee CC-gelicenseerde kaarten (Aeneas- en
   Odysseus-reis) zijn als geografisch naslagwerk gebruikt, niet overgenomen
   — geen attributieplicht, want geen bewerking van hun bestand.

   Een locatie verschijnt pas als `unlockCodex` al in SP_STATE.codex zit —
   hergebruikt bewust de bestaande codex-hook (geen nieuw trackingsysteem).
   `x`/`y` zijn percentages t.o.v. de paneelafbeelding (linksboven = 0,0).
   BOUWSTATUS: x/y zijn een eerste schatting op het oog — nog te verfijnen
   zodra `panel1_aegean.png` op schijf staat en pixel-precies afgelezen kan
   worden. ---- */
// Volgorde = knopvolgorde in SCREENS.spWorldMap (singleplayer.js): western
// links, aegean in het midden (én de standaardkaart waar de speler op
// landt — zie SP_MAP_CURRENT_PANEL), eastern rechts. Zo kan de speler vanuit
// het vertrouwde middelste "thuis"-paneel naar links (het Westen) of rechts
// (het Oosten) navigeren.
const SP_MAP_PANELS = {
  western: { nm:"Het Westen — Sicilië, Carthago, Gades & de Alpen", img:"panel2_western.png" },
  aegean: { nm:"Italië en Griekenland — Egeïsche Zee & West-Klein-Azië", img:"panel1_aegean.png" },
  eastern: { nm:"Het Oosten — Kaukasus, Perzië, Egypte & de rand van India", img:"panel3_eastern.png" },
};
const SP_MAP_LOCATIONS = [
  // x/y afgelezen op het echte panel1_aegean.png (1376×768px): temple-icoon
  // op het Latium-schiereiland, de gloeiende tempel in de wolken boven de
  // Olympos, en het rode gebouwencomplex in de oostelijke heuvels (Sardis).
  { id:"latium", nm:"Latium", panel:"aegean", x:12.7, y:20.2,
    unlockCodex:"codex_orakel_van_chronos",
    desc:"Waar alles begon: het veld waar je het Orakel van Chronos vond." },
  { id:"olympos", nm:"Olympos", panel:"aegean", x:41.1, y:13.0,
    unlockCodex:"codex_geboorte_athena",
    desc:"De woonplaats van de goden, waar Athena voltallig gewapend uit Zeus' hoofd sprong." },
  { id:"sardis", nm:"Sardis, Lydië", panel:"aegean", x:74.1, y:47.5,
    unlockCodex:"codex_gouden_aanraking",
    desc:"Waar koning Midas alles wat hij aanraakte in goud veranderde." },
  // x/y afgelezen op het echte panel3_eastern.png (1376×768px): de geketende
  // gedaante tegen de besneeuwde Kaukasus-bergketen, linksboven in beeld.
  // Overige plekken op western/eastern (Carthago, Sicilië, Gades, Hesperiden,
  // Alpen, Gallië, Perzië, Egypte, India) horen bij hoofdstukken die nog niet
  // geschreven zijn — hun pins volgen zodra die codex-entries echt bestaan.
  { id:"kaukasus", nm:"De Kaukasus", panel:"eastern", x:44.9, y:22.4,
    unlockCodex:"codex_doos_van_pandora",
    desc:"De rots waar Prometheus geketend ligt, gestraft omdat hij het vuur aan de mensheid gaf." },
];
function spLocationUnlocked(loc, codexArr){
  return !loc.unlockCodex || (codexArr||[]).includes(loc.unlockCodex);
}

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

/* ---- PUZZELS — opgezocht door PUZZLE-hook o.b.v. de id in de CNS-tekst ----
   Hoofdstuk 1 (drie lijnen, elk dezelfde grammatica in een ander mythisch
   jasje — zie SP_CAMPAIGN ch1.grammatica): Grieks lidwoord+zn, Latijnse
   nominativus/accusativus (met een groep-1/2-bijvoeglijk-naamwoord toegelicht
   in de scène-tekst zelf, niet als aparte vraag — Regel 5: geen losse
   quizvragen), en Latijnse vocativus. Bewust drie verschillende vocativus-
   patronen over de lijnen verspreid: Bacche (regelmatig -us→-e), Pallas
   (blijft ongewijzigd), Prometheu (Grieks-afkomstige naam op -eus→-eu) —
   laat zien dat niet elk woord in de vocativus verandert. ---- */
const SP_PUZZLES = {
  puzzle_orakel_symbolen_01: {
    type:"greek-transliteration",
    woord:{ grieks:"ΧΡΟΝΟΣ", antwoord:"chronos" },
  },

  // ---- Lijn A: Het Goud van Midas ----
  puzzle_ch1a_lidwoord: { type:"multiple-choice",
    vraag:"Boven de poort van het paleis staat een woord gebeiteld: δεσπότης (heer, meester). Welk lidwoord hoort erbij?",
    opties:["ὁ","ἡ","τό"], antwoord:"ὁ",
    hint:"δεσπότης is mannelijk — welk lidwoord past daarbij?" },
  puzzle_ch1a_naamval: { type:"multiple-choice",
    vraag:"“Rex aurum tangit” — de koning raakt het goud aan. Welk woord is de accusativus, het lijdend voorwerp?",
    opties:["Rex","aurum","tangit"], antwoord:"aurum",
    hint:"De accusativus ondergaat de handeling — wat wordt er aangeraakt?" },
  puzzle_ch1a_vocativus: { type:"multiple-choice",
    vraag:"Midas valt op zijn knieën en roept om Bacchus' aandacht. Wat roept hij?",
    opties:["Bacchus!","Bacche!","Bacchum!","Bacchi!"], antwoord:"Bacche!",
    hint:"De vocativus van een woord op -us eindigt vaak op -e." },

  // ---- Lijn B: De Geboorte van Athena ----
  puzzle_ch1b_lidwoord: { type:"multiple-choice",
    vraag:"Onder de goden gaat gefluister rond over θεά (een godin) die eraan komt. Welk lidwoord hoort bij θεά?",
    opties:["ὁ","ἡ","τό"], antwoord:"ἡ",
    hint:"θεά is vrouwelijk — welk lidwoord past daarbij?" },
  puzzle_ch1b_naamval: { type:"multiple-choice",
    vraag:"“Vulcanus caput aperit” — Hephaistos opent het hoofd. Welk woord is de accusativus?",
    opties:["Vulcanus","caput","aperit"], antwoord:"caput",
    hint:"De accusativus ondergaat de handeling — wat wordt er geopend?" },
  puzzle_ch1b_vocativus: { type:"multiple-choice",
    vraag:"Zeus, stomverbaasd, spreekt zijn nieuwe dochter aan. Hoe noemt hij haar?",
    opties:["Palladem!","Pallade!","Pallas!","Palladis!"], antwoord:"Pallas!",
    hint:"Niet elk woord verandert in de vocativus — sommige blijven gelijk aan de nominativus." },

  // ---- Lijn C: Prometheus en Pandora ----
  puzzle_ch1c_lidwoord: { type:"multiple-choice",
    vraag:"Prometheus reikt naar πῦρ (vuur) op de Olympos. Welk lidwoord hoort bij πῦρ?",
    opties:["ὁ","ἡ","τό"], antwoord:"τό",
    hint:"πῦρ is onzijdig — welk lidwoord past daarbij?" },
  puzzle_ch1c_naamval: { type:"multiple-choice",
    vraag:"“Pandora pyxidem aperit” — Pandora opent de doos. Welk woord is de accusativus?",
    opties:["Pandora","pyxidem","aperit"], antwoord:"pyxidem",
    hint:"De accusativus ondergaat de handeling — wat wordt er geopend?" },
  puzzle_ch1c_vocativus: { type:"multiple-choice",
    vraag:"De mensheid roept wanhopig om Prometheus. Wat roepen ze?",
    opties:["Prometheus!","Prometheu!","Prometheum!","Promethei!"], antwoord:"Prometheu!",
    hint:"Griekse namen op -eus krijgen in de vocativus vaak de uitgang -eu." },

  // ---- Hoofdstuk 2, Lijn L: Latona ----
  puzzle_ch2l_praesens: { type:"multiple-choice",
    vraag:"Latona doolt eindeloos rond, op zoek naar een schuilplaats. “Latona per terras ___” — welke vorm van errare (dwalen) past hier, praesens 3e persoon enkelvoud?",
    opties:["errat","errant","erras","erratis"], antwoord:"errat",
    hint:"Praesens 3e persoon enkelvoud van een eerste-conjugatiewerkwoord (op -are) eindigt op -at." },
  puzzle_ch2l_imperativus: { type:"multiple-choice",
    vraag:"Een doodsbange reiziger ziet de python naderen en schreeuwt naar Latona. Wat roept hij?",
    opties:["Fuge!","Fugit!","Fugere!","Fugis!"], antwoord:"Fuge!",
    hint:"De imperativus enkelvoud van een derde-conjugatiewerkwoord (fugere) eindigt op een korte -e." },
  puzzle_ch2l_posse: { type:"multiple-choice",
    vraag:"Niemand durft Latona te helpen, uit angst voor Juno's wraak. “Nemo eam adiuvare ___” — welke vorm van posse (kunnen) past hier?",
    opties:["potest","possunt","potes","possum"], antwoord:"potest",
    hint:"Derde persoon enkelvoud van posse is 'potest' — net als bij esse buigt dit werkwoord onregelmatig." },

  // ---- Hoofdstuk 2, Lijn S: Semele ----
  puzzle_ch2s_praesens: { type:"multiple-choice",
    vraag:"Semele mint Jupiter in het diepste geheim. “Semele Iovem ___” — welke vorm van amare (liefhebben) past hier, praesens 3e persoon enkelvoud?",
    opties:["amat","amant","amas","amatis"], antwoord:"amat",
    hint:"Praesens 3e persoon enkelvoud van een eerste-conjugatiewerkwoord (op -are) eindigt op -at." },
  puzzle_ch2s_imperativus: { type:"multiple-choice",
    vraag:"Nu Jupiter aan zijn eed gebonden is, spreekt Semele haar eis uit. Wat eist ze?",
    opties:["Ostende te!","Ostendis te!","Ostendere te!","Ostendit te!"], antwoord:"Ostende te!",
    hint:"De imperativus enkelvoud van een derde-conjugatiewerkwoord (ostendere) eindigt op een korte -e." },
  puzzle_ch2s_esse: { type:"multiple-choice",
    vraag:"Het licht van Jupiters ware gedaante is dodelijk voor een sterveling. “Ignis nimium potens ___” — welke vorm van esse (zijn) past hier?",
    opties:["est","sunt","es","sum"], antwoord:"est",
    hint:"Derde persoon enkelvoud van esse is 'est'." },

  // ---- Hoofdstuk 2, Lijn K: Kallisto ----
  puzzle_ch2k_imperativus: { type:"multiple-choice",
    vraag:"Artemis, ontzet door wat ze ontdekt, verstoot Kallisto uit haar gezelschap. Wat roept ze?",
    opties:["Abi!","Abit!","Abire!","Abis!"], antwoord:"Abi!",
    hint:"Abire is een samengesteld werkwoord van ire (gaan) — de imperativus enkelvoud is net zo kort als bij ire zelf: 'i!'." },
  puzzle_ch2k_praesens: { type:"multiple-choice",
    vraag:"Kallisto vlucht, alleen en verstoten, het woud in. “Callisto per silvas ___” — welke vorm van currere (rennen) past hier, praesens 3e persoon enkelvoud?",
    opties:["currit","currunt","curris","curritis"], antwoord:"currit",
    hint:"Praesens 3e persoon enkelvoud van een derde-conjugatiewerkwoord (op -ere) eindigt op -it." },
  puzzle_ch2k_esse: { type:"multiple-choice",
    vraag:"Hera's vloek verandert Kallisto voorgoed. “Callisto ursa ___” — welke vorm van esse (zijn) past hier?",
    opties:["est","sunt","es","sum"], antwoord:"est",
    hint:"Derde persoon enkelvoud van esse is 'est'." },

  // ---- Hoofdstuk 2, Lijn H: Herakles (loopt door in Hoofdstuk 3) ----
  puzzle_ch2h_praesens: { type:"multiple-choice",
    vraag:"Als baby wurgt Herakles moeiteloos de slangen die Hera naar zijn wieg stuurde. “Infans serpentem ___” — welke vorm van necare (doden) past hier, praesens 3e persoon enkelvoud?",
    opties:["necat","necant","necas","necatis"], antwoord:"necat",
    hint:"Praesens 3e persoon enkelvoud van een eerste-conjugatiewerkwoord (op -are) eindigt op -at." },
  puzzle_ch2h_imperativus: { type:"multiple-choice",
    vraag:"Het orakel van Delphi spreekt Herakles' boetedoening uit. Wat draagt het hem op?",
    opties:["Servi Eurystheo!","Servis Eurystheo!","Servire Eurystheo!","Servit Eurystheo!"], antwoord:"Servi Eurystheo!",
    hint:"Servire is een vierde-conjugatiewerkwoord — de imperativus enkelvoud laat gewoon de -re van de infinitief vallen: servi!" },
  puzzle_ch2h_posse: { type:"multiple-choice",
    vraag:"Zonder vuur om de wonden dicht te schroeien, blijft de Hydra onoverwinnelijk. “Nemo eam sine igne vincere ___” — welke vorm van posse (kunnen) past hier?",
    opties:["potest","possunt","potes","possum"], antwoord:"potest",
    hint:"Derde persoon enkelvoud van posse is 'potest'." },
};

/* ---- CODEX MEMORIAE — het in-fictie naslagwerk van de speler, met zes
   tabbladen in SCREENS.spCodex (singleplayer.js): Mythologie, Geschiedenis,
   Personen, Grammatica, Vocabulaire, Afbeeldingen. Elk tabblad heeft zijn
   eigen kleine databron + eigen ontgrendel-hook, maar hergebruikt allemaal
   hetzelfde idee: een CNS-scène zet een meta-sectie, een hook in
   singleplayer.js verwerkt 'm stil, en het scherm toont alleen wat al
   verdiend is. ----

   MYTHOLOGIE/GESCHIEDENIS/GRAMMATICA — via de bestaande CODEX:-sectie
   (spHookCodex) en SP_CODEX_ENTRIES hieronder (titel/tekst/categorie, en bij
   grammatica optioneel een `table` voor rijtjes). Nieuwe hoofdstukken breiden
   dit uit: elke CODEX:-id die ergens wordt uitgedeeld, hoort hier een entry
   te krijgen, anders toont de Codex alleen een kale id.

   BELANGRIJK — grammatica ontgrendelt VROEG, niet pas aan het eind: de
   leerling moet een mislukte puzzel meteen kunnen opzoeken. Daarom zet
   CH1_000 (de hub, vóór de keuze tussen de drie lijnen) meteen de twee
   hoofdstuk-1-grammatica-entries; CH1_ROBE voegt daarna nog een
   samenvattend "overzicht" toe als afsluitend beloningsmoment. ---- */
const SP_CODEX_ENTRIES = {
  codex_orakel_van_chronos: { cat:"mythologie", titel:"Het Orakel van Chronos",
    tekst:"Chronos — de belichaming van de tijd zelf, niet te verwarren met de titaan Kronos, vader van Zeus — wordt in latere, orfische overleveringen beschreven als een kracht die ouder is dan de goden van de Olympos zelf. Het bronzen orakel dat jij in een Latijns korenveld vond, is doordrenkt van die kracht: het scheurt de sluier tussen de wereld waarin de klassieke mythen langzaam vervagen, en de wereld waarin jij leeft." },
  codex_gouden_aanraking: { cat:"mythologie", titel:"De Gouden Aanraking van Midas",
    tekst:"Koning Midas van Sardis, in Lydië, verdiende de dankbaarheid van Bacchus door diens dronken metgezel Silenus tien dagen lang gastvrij te onthalen. Zijn wens — dat alles wat hij aanraakt in goud verandert — bleek een vloek zodra ze ook zijn voedsel, zijn wijn en uiteindelijk zijn eigen dochter trof. Bacchus hief de vloek op door hem te laten baden in de rivier de Pactolus, die sindsdien met gouden korrels doorspekt zou zijn." },
  codex_geboorte_athena: { cat:"mythologie", titel:"De Geboorte van Athena",
    tekst:"Zeus verzwolg zijn zwangere eerste vrouw Metis uit angst voor een profetie: hun zoon zou hem onttronen, zoals hij ooit zijn eigen vader Kronos onttroonde. Toen het kind — een dochter — niettemin geboren wilde worden, spleet Hephaistos Zeus' schedel open met een bijl, en Pallas Athena sprong eruit, al volwassen en volledig gewapend: godin van wijsheid en doordachte oorlogvoering." },
  codex_doos_van_pandora: { cat:"mythologie", titel:"Prometheus, Pandora en de Doos",
    tekst:"Prometheus, een titaan die tijdens de Titanomachie voor Zeus koos, vormde samen met Athena de eerste mensen en stal later het vuur van de goden om hen te redden van de kou. Zeus strafte hem met eeuwige ketenen op de Kaukasus, en strafte de mensheid met Pandora — het eerste geschenk van alle goden samen — wier nieuwsgierigheid alle kwaad ter wereld losliet uit een verzegelde doos. Alleen Elpis, de Hoop, bleef achter." },

  codex_grammatica_ch1_lidwoord: { cat:"grammatica", titel:"Grammatica: het Griekse lidwoord",
    tekst:"Het Griekse lidwoord verandert mee met het grammaticale geslacht van het zelfstandig naamwoord waar het bij hoort — niet met wat het woord in het echt betekent, maar met de vorm van het woord zelf. Er zijn drie geslachten: mannelijk, vrouwelijk en onzijdig, elk met hun eigen lidwoord in de nominativus.",
    table:{ headers:["Geslacht","Lidwoord","Voorbeeld uit het verhaal"],
      rows:[["Mannelijk","ὁ","ὁ δεσπότης — de heer/meester (boven de poort van Sardis)"],
            ["Vrouwelijk","ἡ","ἡ θεά — de godin (het gefluister op de Olympos)"],
            ["Onzijdig","τό","τό πῦρ — het vuur (bij de haard van de goden)"]] } },
  // LET OP: de "Athena"-kolom toont "Vulcanus", niet "Hephaistos" — dit is
  // bewust géén inconsistentie. De verteltekst in lijn B gebruikt overal de
  // Griekse naam Hephaistos (zie SP_CODEX_PERSONS.hephaistos), maar déze
  // tabel demonstreert de Latijnse naamvallen aan de hand van de exacte
  // Latijnse oefenzin uit puzzle_ch1b_naamval ("Vulcanus caput aperit") —
  // die zin MOET de Latijnse vorm gebruiken, anders klopt de tabel niet meer
  // met het juiste antwoord van de puzzel.
  codex_grammatica_ch1_naamvallen: { cat:"grammatica", titel:"Grammatica: nominativus, accusativus, vocativus",
    tekst:"Een naamval laat zien welke rol een woord in de zin speelt. De nominativus is de vorm van het onderwerp: wie handelt. De accusativus is de vorm van het lijdend voorwerp: wie of wat de handeling ondergaat. De vocativus, ten slotte, is de vorm waarmee je iemand rechtstreeks aanspreekt — en die vorm wijkt bij sommige woorden af van de nominativus, bij andere weer niet.",
    table:{ headers:["Naamval","Functie","Midas","Athena","Prometheus/Pandora"],
      rows:[["Nominativus","onderwerp: wie handelt","rex (de koning)","Vulcanus","Pandora"],
            ["Accusativus","lijdend voorwerp: wie/wat ondergaat","aurum flavum (het gele goud)","caput durum (het harde hoofd)","pyxidem novam (de nieuwe doos)"],
            ["Vocativus","aanspreekvorm: tot wie je spreekt","Bacche! (uitgang -e i.p.v. -us)","Pallas! (blijft gelijk aan de nominativus)","Prometheu! (namen op -eus krijgen -eu)"]] } },
  codex_grammatica_ch1_overzicht: { cat:"grammatica", titel:"Grammatica: Hoofdstuk 1 samengevat",
    tekst:"Je hebt nu alle drie de verhalen van dit hoofdstuk gehoord, en met ze de volledige basisgrammatica: het Griekse lidwoord (ὁ/ἡ/τό, gestuurd door geslacht, niet door betekenis) en de Latijnse naamvallen nominativus/accusativus/vocativus (wie handelt, wie ondergaat, tot wie je spreekt). Onthoud vooral dat niet elk woord in de vocativus verandert — Griekse eigennamen als Pallas blijven vaak gelijk aan de nominativus, terwijl gewone Latijnse woorden op -us vaak overgaan naar -e." },

  codex_geboorte_apollo_diana: { cat:"mythologie", titel:"De Geboorte van Apollo en Diana",
    tekst:"Latona, een titanide en minnares van Jupiter, werd door de jaloerse Juno vervloekt: geen enkel stuk vaste grond mocht haar ooit een plek geven om te bevallen. Achtervolgd door de python Juno op haar afstuurde, vond ze uiteindelijk toevlucht op Delos — een rondzwervend eiland dat, omdat het aan geen enkel koninkrijk verankerd lag, strikt genomen buiten de vloek viel. Daar bracht ze de tweeling Apollo en Diana ter wereld, en verankerde Delos zichzelf voorgoed in de golven." },
  codex_geboorte_bacchus: { cat:"mythologie", titel:"De Geboorte van Bacchus (uit Jupiters Dij)",
    tekst:"Semele, prinses van Thebe en minnares van Jupiter, werd door de jaloerse Juno — vermomd als haar eigen oude voedster — overgehaald om haar minnaar te vragen zich in zijn ware goddelijke gedaante te tonen. Gebonden aan een onherroepelijke eed bij de Styx kon Jupiter niet weigeren: zijn verzengende glorie doodde de sterfelijke Semele op slag. Uit de as redde hij hun ongeboren kind en naaide het in zijn eigen dij, waar het de resterende maanden voldragen werd — zo werd Bacchus de enige god die tweemaal geboren werd." },
  codex_metamorfose_kallisto: { cat:"mythologie", titel:"De Metamorfose van Kallisto",
    tekst:"Kallisto, een jachtgezellin van Artemis gebonden aan dezelfde eed van kuisheid als haar godin, werd verleid door Zeus, die zich vermomde als Artemis zelf om haar wantrouwen te omzeilen. Toen haar zwangerschap aan het licht kwam, verbande Artemis haar uit de band — zonder de ware toedracht te kennen — en veranderde de jaloerse Hera haar in een berin. Jaren later, toen haar eigen zoon Arcas haar bijna doodde tijdens de jacht, greep Zeus alsnog in en plaatste beiden onder de sterren: Kallisto als de Grote Beer, Arcas als de Kleine Beer." },
  codex_herakles_beproevingen: { cat:"mythologie", titel:"Herakles: Waanzin en de Eerste Beproevingen",
    tekst:"Herakles, zoon van Zeus en de sterfelijke Alcmene, werd al vóór zijn geboorte door Hera gehaat — ze vertraagde zijn geboorte zodat zijn neef Eurystheus eerder ter wereld kwam en het geboorterecht op de troon van Mycene kreeg. Als baby wurgde Herakles moeiteloos twee slangen die Hera naar zijn wieg had gestuurd, een eerste teken van de kracht die hem zou definiëren. Als volwassen man, getrouwd met Megara en vader van hun kinderen, werd hij door Hera getroffen met een waanzin die hem zijn eigen gezin deed doden. Uit wroeging raadpleegde hij het orakel van Delphi, dat hem opdroeg tien jaar in dienst van Eurystheus beproevingen te volbrengen als boetedoening — een getal dat later op twaalf zou uitkomen, nadat Eurystheus twee ervan afkeurde. De eerste twee: de onkwetsbare Nemeïsche Leeuw, gewurgd met blote handen, en de veelkoppige Hydra van Lerna, alleen verslagen met de hulp van vuur." },

  // LET OP: dezelfde "vroeg ontgrendelen"-regel als Hoofdstuk 1 (§7.2.1 in
  // Chronica.md) — deze drie entries worden al bij CH2_000 gezet, vóór de
  // eerste puzzel, zodat een leerling die vastloopt meteen kan terugbladeren.
  codex_grammatica_ch2_praesens: { cat:"grammatica", titel:"Grammatica: de praesens",
    tekst:"De praesens beschrijft wat er nu gebeurt — 'hij doolt', 'zij vlucht'. Elk werkwoord heeft een eigen stam (het deel vóór de persoonsuitgang) die afhangt van de conjugatie (werkwoordgroep). De persoonsuitgangen zelf zijn voor de meeste werkwoorden gelijk: -o, -s, -t, -mus, -tis, -nt.",
    table:{ headers:["Persoon","Uitgang","errare (1e conj., dwalen)","fugere (3e conj., vluchten)"],
      rows:[["ik","-o","erro","fugio"],
            ["jij","-s","erras","fugis"],
            ["hij/zij/het","-t","errat","fugit"],
            ["wij","-mus","erramus","fugimus"],
            ["jullie","-tis","erratis","fugitis"],
            ["zij","-nt","errant","fugiunt"]] } },
  codex_grammatica_ch2_imperativus: { cat:"grammatica", titel:"Grammatica: de imperativus",
    tekst:"De imperativus is de gebiedende wijs: een bevel of dringende oproep, zonder onderwerp ('Vlucht!', 'Ga!'). Je vormt hem door de persoonsuitgangen weg te laten van de werkwoordstam — enkelvoud is meestal gewoon de kale stam (of stam + korte -e bij de 3e conjugatie), meervoud krijgt -te erbij.",
    table:{ headers:["Vorm","errare (dwalen)","fugere (vluchten)","esse (zijn)"],
      rows:[["jij (enkelvoud)","erra!","fuge!","es!"],
            ["jullie (meervoud)","errate!","fugite!","este!"]] } },
  codex_grammatica_ch2_esse_posse: { cat:"grammatica", titel:"Grammatica: esse en posse",
    tekst:"Esse ('zijn') en posse ('kunnen') zijn twee van de belangrijkste onregelmatige werkwoorden in het Latijn — ze volgen geen enkele vaste conjugatie en moet je gewoon uit het hoofd kennen. Posse is eigenlijk 'pot-' (van potis, in staat) + esse samengevoegd, wat verklaart waarom de vormen zo op elkaar lijken.",
    table:{ headers:["Persoon","esse (zijn)","posse (kunnen)"],
      rows:[["ik","sum","possum"],
            ["jij","es","potes"],
            ["hij/zij/het","est","potest"],
            ["wij","sumus","possumus"],
            ["jullie","estis","potestis"],
            ["zij","sunt","possunt"]] } },
  codex_grammatica_ch2_overzicht: { cat:"grammatica", titel:"Grammatica: Hoofdstuk 2 samengevat",
    tekst:"Dit hoofdstuk draaide om wat mensen en goden dóen: de praesens (nu-tijd, met persoonsuitgangen -o/-s/-t/-mus/-tis/-nt op een werkwoordstam), de imperativus (bevelsvorm, kale stam of stam+e, meervoud +te), en de twee onmisbare onregelmatige werkwoorden esse (zijn) en posse (kunnen) — die zo vaak voorkomen dat je ze simpelweg uit het hoofd moet kennen." },
};

/* ---- PERSONEN — tweetraps-onthulling: een SPOILERVRIJE `intro`-tekst
   verschijnt zodra de speler iemand voor het eerst ontmoet (via een
   PERSON:-sectie met "id:intro" in de CNS-scène, spHookPerson), en wordt pas
   AANGEVULD met de rijkere `full`-tekst zodra het bijbehorende verhaal ook
   echt is afgerond ("id:full" op de scène die dat verhaal afsluit). Niet elk
   personage heeft per se een `full`: bijfiguren zonder eigen afgerond verhaal
   (bv. Zeus, Hephaistos, Epimetheus in Hoofdstuk 1) blijven op het intro-niveau
   staan totdat een later hoofdstuk hun eigen verhaal vertelt.
   Kronos/Athena/Hermes-bio's zijn geïnspireerd op de "Certamen Character
   Bible" (Single Player Mode.docx) — dat document is met de komst van
   Chronica.md niet meer de bron van waarheid, maar de personagebeschrijvingen
   daarin waren te goed om te laten liggen. ---- */
const SP_CODEX_PERSONS = {
  midas: { nm:"Midas", epithet:"Koning van Sardis, Lydië",
    intro:"Een rijke koning wiens naam onder handelaars en reizigers wordt gefluisterd — half spottend, half jaloers — sinds hij een god een gunst bewees.",
    full:"Midas' gastvrijheid jegens Silenus werd beloond met een wens die hij niet had doordacht: alles wat hij aanraakte veranderde in goud, ook zijn eigen dochter. Pas toen hij zichzelf waste in de rivier de Pactolus, hief Bacchus de vloek op — en liet de rivier voorgoed doorspekt achter met gouden korrels." },
  bacchus: { nm:"Bacchus (Dionysus)", epithet:"God van de wijn, extase en het onverwachte",
    intro:"Een god die zelden zonder wijnranken en een loom meelopende luipaard verschijnt — geamuseerd, gul, maar met een glimlach die je niet helemaal vertrouwt.",
    full:"Bacchus beloonde Midas' gastvrijheid tegenover Silenus met een wens naar keuze — en liet hem vervolgens zelf ontdekken dat een wens zonder nadenken zelden een zegen blijft. Zijn straf was geen wraak, eerder een les: hij hief de vloek net zo gemakkelijk op als hij hem had geschonken. Zijn eigen geboorte was al even ongewoon: zijn sterfelijke moeder Semele stierf voordat hij voldragen was, en Jupiter naaide het ongeboren kind in zijn eigen dij om de zwangerschap af te maken — Bacchus is daarmee de enige god die tweemaal geboren werd." },
  athena: { nm:"Pallas Athena (Minerva)", introNm:"???", epithet:"Godin van de wijsheid en doordachte oorlogvoering",
    introEpithet:"Nog onbekend",
    intro:"Op de Olympos gaat een gefluisterd woord rond — θεά, een godin — over iemand die nog niet eens geboren is, maar wier komst de goden nu al onrustig maakt.",
    full:"Pallas Athena sprong volwassen en volledig gewapend uit het hoofd van Zeus, na een geboorte die de hele Olympos deed sidderen. Ze werd de eerste onder de goden die vraagt voordat ze oordeelt — godin van wijsheid en doordachte oorlogvoering, met een naam die weldra door heel Hellas zal worden uitgesproken. Bij de Romeinen kreeg ze een andere naam voor dezelfde godin: Minerva." },
  zeus: { nm:"Zeus (Jupiter)", epithet:"Koning van de Olympische goden",
    intro:"Heerser van de Olympos, die zijn eigen vader Kronos onttroonde uit angst voor een profetie — en nu, naar verluidt, bang is dat de geschiedenis zich gaat herhalen. Bij de Romeinen heet hij Jupiter." },
  hephaistos: { nm:"Hephaistos (Vulcanus)", epithet:"Goddelijke smid",
    intro:"Als kind door zijn eigen moeder Hera van de Olympos gegooid, opgevangen door de zeenimf Thetis, en uitgegroeid tot de meest begaafde smid onder de goden — de enige die ruw genoeg is voor het werk dat nu op zijn schouders rust. Bij de Romeinen heet hij Vulcanus." },
  prometheus: { nm:"Prometheus", epithet:"Titaan, medeschepper van de mensheid",
    intro:"Een titaan die tijdens de oorlog tussen goden en titanen de kant van Zeus koos — en die, samen met Athena, de eerste mensen uit klei en water vormde.",
    full:"Uit medelijden met de naakte, hulpeloze mensheid stal Prometheus het vuur van de goden — en betaalde daarvoor eeuwig met ketenen op de Kaukasus en een adelaar die dagelijks zijn lever komt opeten. Vuur en hoop, zegt hij zelf, waren het risico waard." },
  pandora: { nm:"Pandora", epithet:"\"Zij die alles geschonken kreeg\"",
    intro:"Een vrouw van verbluffende schoonheid, door alle goden en godinnen samen gemaakt en met gaven overladen — en met een verzegelde doos die ze nooit had mogen openen.",
    full:"Pandora's nieuwsgierigheid liet alle ellende van de wereld — ziekte, oorlog, verdriet — ontsnappen uit haar doos, tot ze het deksel net op tijd sloot om tenminste Elpis, de Hoop, binnen te houden. Ze bracht geen kwaad met opzet — ze was, zoals haar naam al zei, gewoon nooit anders dan een geschenk bedoeld." },
  epimetheus: { nm:"Epimetheus", epithet:"Titaan, broer van Prometheus",
    intro:"De broer die vergat de mensheid een gave te schenken toen hij ze verdeelde onder alle levende wezens — en die, jaren later, ondanks Prometheus' waarschuwing, verliefd wordt op een geschenk van Zeus." },

  hera: { nm:"Hera (Juno)", epithet:"Koningin van de goden, bewaakster van het huwelijk",
    intro:"Zeus' vrouw, en degene die elke ontrouw van haar man — hoe klein of groot ook — nooit onbestraft laat. Bij de Romeinen heet ze Juno; onder die naam is ze net zo vindingrijk en net zo onverbiddelijk." },
  latona: { nm:"Latona (Leto)", epithet:"Titanide, minnares van Jupiter",
    intro:"Een titanide die, sinds Jupiter zijn oog op haar liet vallen, niets anders dan Juno's woede heeft gekend.",
    full:"Verstoten door elk stuk vaste grond en achtervolgd door de python Python, vond Latona uiteindelijk toevlucht op het rondzwervende eiland Delos — dat, omdat het aan geen enkel koninkrijk verankerd lag, buiten Juno's vloek viel. Daar bracht ze de tweeling Apollo en Diana ter wereld, en gaf ze de wereld twee nieuwe goden die voorgoed met haar naam verbonden blijven." },
  apollo: { nm:"Apollo", epithet:"God van licht, muziek en profetie",
    intro:"De zoon van Latona en Jupiter, amper geboren en al omgeven door een licht dat zijn naam voorgoed zal dragen." },
  diana: { nm:"Diana (Artemis)", epithet:"Godin van de jacht en de wildernis",
    intro:"Latona's dochter, geboren vlak vóór haar tweelingbroer Apollo — en volgens sommige verhalen was zij het die haar moeder meteen daarna bijstond bij zijn geboorte.",
    full:"Diana leidt een groep jachtgezellinnen die, net als zijzelf, een eed van kuisheid hebben afgelegd — een eed die ze onverbiddelijk handhaaft, zelfs wanneer een van hen (zoals Kallisto) buiten haar eigen schuld wordt misleid. Bij de Grieken heet ze Artemis." },
  semele: { nm:"Semele", epithet:"Prinses van Thebe, minnares van Jupiter",
    intro:"Een sterfelijke prinses, dochter van koning Cadmus van Thebe, die 's nachts bezocht wordt door een minnaar die zijn ware aard voor haar verborgen houdt.",
    full:"Semele, opgehitst door de als voedster vermomde Juno, eiste dat Jupiter zich in zijn ware goddelijke gedaante zou tonen — gebonden aan een eed bij de Styx kon hij niet weigeren, en zijn verzengende glorie doodde haar op slag. Uit de as redde Jupiter hun ongeboren kind, dat hij in zijn eigen dij naaide om de zwangerschap te voltooien: zo werd Bacchus geboren." },
  kallisto: { nm:"Kallisto", epithet:"Nimf, jachtgezellin van Artemis",
    intro:"Een toegewijde jachtgezellin van Artemis, gebonden aan dezelfde eed van kuisheid als haar godin — tot Zeus haar op een dag alleen aantreft.",
    full:"Verleid door Zeus, die zich vermomde als Artemis zelf, verbannen uit de jachtband zodra haar zwangerschap aan het licht kwam, en door de jaloerse Hera veranderd in een berin — Kallisto's verhaal eindigt uiteindelijk aan de hemel, waar Zeus haar en haar zoon Arcas onder de sterren plaatste als de Grote en de Kleine Beer." },
  herakles: { nm:"Herakles (Hercules)", epithet:"Zoon van Zeus, sterkste sterveling ooit",
    intro:"Een kind dat als baby al twee slangen wurgde die Hera naar zijn wieg had gestuurd — een eerste teken van een kracht die de hele klassieke wereld zal kennen, en van een godin die hem al haatte voor hij kon spreken.",
    full:"Getroffen door een door Hera opgelegde waanzin doodde Herakles zijn eigen vrouw Megara en hun kinderen — een daad die hem, eenmaal weer bij zinnen, verwoestte. Op advies van het orakel van Delphi diende hij zijn neef Eurystheus als boetedoening en volbracht de eerste van wat uiteindelijk twaalf beproevingen zouden worden: de Nemeïsche Leeuw gewurgd met blote handen, de Hydra van Lerna verslagen met vuur. Zijn verhaal — en zijn straf — is nog lang niet voorbij." },
  megara: { nm:"Megara", epithet:"Prinses van Thebe, vrouw van Herakles",
    intro:"De vrouw van Herakles en moeder van zijn kinderen, hem gegeven als beloning nadat hij Thebe had verdedigd tegen een belegerend leger — tot Hera's wraak alles wat ze samen hadden opbouwde in één ogenblik verwoestte." },
};

/* ---- HERINNERINGSFRAGMENTEN (Fragmentum Memoriae) — Hoofdstuk 2 introduceert
   een ander soort hoofdstuk-gate dan Hoofdstuk 1: i.p.v. "één lijn voltooien
   = door naar het volgende hoofdstuk" moet de speler hier ALLE vier de
   lijnen afronden. Elke lijn geeft aan het eind een eigen fragment i.p.v.
   een klassieke "beloning" (FRAGMENT:-sectie, spHookFragment in
   singleplayer.js); zodra alle vier binnen zijn, ontgrendelt een
   [REQUIRE:fragments=4]-keuze op de hub (CH2_000) de weg naar Athena en het
   Orakel. Zie Chronica.md §7.6. ---- */
const SP_FRAGMENTS = {
  latona:   { nm:"Volharding", icon:"🍃" },
  kallisto: { nm:"Onschuld",   icon:"🐻" },
  semele:   { nm:"Waarheid",   icon:"⚡" },
  herakles: { nm:"Moed",       icon:"🦁" },
};

/* ---- COMBAT-BRIDGE — Chronica's eigen gevechtssysteem (§8 in Chronica.md,
   vanaf Hoofdstuk 2 geïntroduceerd). Werkt in dezelfde geest als Battle Mode
   (vraag → EP → actie), maar is een VOLLEDIG NIEUWE, lokale implementatie —
   Battle Mode's eigen lus (bmAnswer/bmTick/bmResolve, battle.js) is te sterk
   gekoppeld aan Firebase-multiplayer-state (BM_STATE/BM_TEAMS/...) om
   rechtstreeks te hergebruiken. Chronica-gevechten zijn altijd 1 speler tegen
   1 tegenstander, en hebben — omdat het singleplayer is — geen kunstmatige
   wachttijd tussen vraag en actie nodig (geen andere spelers om op te
   wachten): zodra je genoeg EP hebt, kun je meteen aanvallen.
   COMBAT:-sectie in een CNS-scène bevat de bare id van een entry hieronder;
   spStartCombatFromScene (singleplayer.js) start het gevecht, en bij winst
   gaat het verder naar de (enige) keuze van die scène. ---- */
// `img` is optioneel (pad relatief aan certamen/) — ontbreekt het, dan valt
// SCREENS.spCombat terug op het `icon`-emoji, exact dezelfde regel als
// Boss Battle se bmBossSpriteHTML() (bossbattle.js): een baas is een
// ENKELVOUDIGE statische illustratie, geen motion-sheet, en object-fit:contain
// verdraagt elk brondimensieformaat. De Hydra hergebruikt bewust het
// bestaande Boss Battle-bestand (dezelfde mythologische Hydra, geen nieuwe
// tekening nodig); de Leeuw van Nemea heeft nog geen bestand — het `img`-pad
// hieronder is alvast ingevuld zodat het meteen oppikt zodra het bestand er
// staat (net als de bestaande Cerberus/Chimera/Lamia/Succubus-bestanden in
// assets/bosses/, die ook al klaarliggen voor toekomstige bazen).
// `heads` (alleen Hydra): de romp-afbeelding heeft de kale nekstompjes al
// ingetekend, en elke los kop-bestand is een even groot canvas dat er
// precies overheen past (geen offsets nodig, gewoon absoluut stapelen) —
// exact dezelfde 8-bestanden-opzet als Boss Battle se BOSS_PRESETS.hydra
// (bossbattle.js). Zonder deze laag zou je alleen de romp met stompjes zien,
// nooit de koppen. Aantal nog "levende" koppen = spCombatAliveHeads(),
// dezelfde ceil((hp/maxHp)*7)-formule als bmBossAliveHeads() daar.
const SP_COMBAT_ENEMIES = {
  nemeische_leeuw: { nm:"De Nemeïsche Leeuw", icon:"🦁", img:"assets/bosses/nemeische_leeuw.png", hp:40,
    intro:"Een leeuw met een huid die geen enkel wapen kan doorboren — Herakles zal hem uiteindelijk met blote handen moeten wurgen." },
  hydra: { nm:"De Hydra van Lerna", icon:"🐍", img:"assets/bosses/hydra.png",
    heads:["assets/bosses/hydrahead1.png","assets/bosses/hydrahead2.png","assets/bosses/hydrahead3.png",
           "assets/bosses/hydrahead4.png","assets/bosses/hydrahead5.png","assets/bosses/hydrahead6.png",
           "assets/bosses/hydrahead7.png"],
    hp:60,
    intro:"Een veelkoppig moeras-monster dat voor elke afgehakte kop er twee nieuwe laat aangroeien — alleen vuur kan de wonden dichtschroeien voor ze weer aangroeien." },
};

/* ---- VOCABULAIRE — start-woordenlijst Grieks + Latijn, per hoofdstuk
   aangevuld via VOCAB:-secties (spHookVocab, singleplayer.js). Bewust
   compacter dan de frequentielijst uit de andere Certamen-modi (die blijft
   relevanter voor Training/Vrij Oefenen) — dit is de pool waaruit een
   toekomstig Chronica-gevecht (Combat-bridge, nog te bouwen) zijn vragen kan
   putten, dus voorlopig alleen woorden die ook echt in het verhaal vielen. ---- */
const SP_VOCAB_ENTRIES = {
  grieks_despotes:  { taal:"grieks", woord:"δεσπότης", transcript:"despotēs", betekenis:"heer, meester" },
  grieks_thea:      { taal:"grieks", woord:"θεά",       transcript:"theá",     betekenis:"godin" },
  grieks_pyr:       { taal:"grieks", woord:"πῦρ",       transcript:"pŷr",      betekenis:"vuur" },
  latijn_rex:       { taal:"latijn", woord:"rex",       betekenis:"koning" },
  latijn_aurum:     { taal:"latijn", woord:"aurum",     betekenis:"goud" },
  latijn_flavus:    { taal:"latijn", woord:"flavus, flava, flavum", betekenis:"geel" },
  latijn_tangit:    { taal:"latijn", woord:"tangit",    betekenis:"hij/zij raakt aan" },
  latijn_caput:     { taal:"latijn", woord:"caput",     betekenis:"hoofd" },
  latijn_durus:     { taal:"latijn", woord:"durus, dura, durum", betekenis:"hard" },
  latijn_aperit:    { taal:"latijn", woord:"aperit",    betekenis:"hij/zij opent" },
  latijn_pyxis:     { taal:"latijn", woord:"pyxis, pyxidem", betekenis:"doos" },
  latijn_novus:     { taal:"latijn", woord:"novus, nova, novum", betekenis:"nieuw" },
  latijn_errare:    { taal:"latijn", woord:"errare (errat)", betekenis:"dwalen" },
  latijn_fugere:    { taal:"latijn", woord:"fugere (fugit, fuge!)", betekenis:"vluchten" },
  latijn_posse:     { taal:"latijn", woord:"posse (potest)", betekenis:"kunnen" },
  latijn_adiuvare:  { taal:"latijn", woord:"adiuvare", betekenis:"helpen" },
  latijn_terra:     { taal:"latijn", woord:"terra, terrae", betekenis:"aarde, land" },
  latijn_nemo:      { taal:"latijn", woord:"nemo", betekenis:"niemand" },
  latijn_amare:     { taal:"latijn", woord:"amare (amat)", betekenis:"liefhebben" },
  latijn_ostendere: { taal:"latijn", woord:"ostendere (ostende!)", betekenis:"tonen, laten zien" },
  latijn_ignis:     { taal:"latijn", woord:"ignis, ignis", betekenis:"vuur" },
  latijn_potens:    { taal:"latijn", woord:"potens, potens, potens", betekenis:"machtig" },
  latijn_currere:   { taal:"latijn", woord:"currere (currit)", betekenis:"rennen" },
  latijn_abire:     { taal:"latijn", woord:"abire (abi!)", betekenis:"weggaan, vertrekken" },
  latijn_ursa:      { taal:"latijn", woord:"ursa, ursae", betekenis:"berin" },
  latijn_silva:     { taal:"latijn", woord:"silva, silvae", betekenis:"bos, woud" },
  latijn_necare:    { taal:"latijn", woord:"necare (necat)", betekenis:"doden" },
  latijn_servire:   { taal:"latijn", woord:"servire (servi!)", betekenis:"dienen" },
  latijn_vincere:   { taal:"latijn", woord:"vincere (vincit)", betekenis:"overwinnen" },
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
  // "ch1_voltooid" wordt door ALLE DRIE de Hoofdstuk-1-lijnen op dezelfde
  // manier gezet (FLAG: ch1_lijn=X; ch1_voltooid=true) — één flag, geen 3
  // aparte eretitel-checks nodig. Het Orakel overhandigt de mantel narratief
  // in CH1_ROBE zodra je een willekeurige lijn hebt afgerond.
  "armor:robe":   { flag:"ch1_voltooid" },
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

IMAGE:
prologue_ploegen.png

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

CHOICES:

* Stap door de poort -> CH1_000

END
`.trim();

/* ---- HOOFDSTUK 1: "DE NAMEN VAN DE WERELD" (scène-ID's CH1_###) ----
   Drie parallelle plotlijnen die NIET convergeren (vastgelegd besluit,
   Chronica.md §7.1): A "Het Goud van Midas" (Latijn-zwaartepunt, Bacchus),
   B "De Geboorte van Athena" (Grieks-zwaartepunt), C "Prometheus en Pandora"
   (S-tier mythen uit SP_MYTH_CANON). Elke lijn leert de VOLLEDIGE hoofdstuk-
   1-grammatica (zn/bn groep 1-2/lidwoord/nom/acc/voc — zie SP_CAMPAIGN ch1),
   in een ander mythisch jasje; één lijn voltooien volstaat om door te gaan
   naar hoofdstuk 2 (nog te bouwen). De andere twee lijnen zijn optioneel —
   ideaal om met de 2 overige saveslots te spelen.

   VASTGELEGDE REGEL (2026-07): elk scène-blok vóór een keuze krijgt 2-3
   alinea's beschrijvende/verhalende tekst, niet één summiere zin — dat geeft
   ruimte voor historische/mythologische diepgang (bv. de Silenus-episode bij
   Midas, Metis' zwangerschap bij Zeus, Prometheus als mensenschepper,
   Pandora's naam) en voor de grammatica/vocabulaire om ergens in te landen.
   Dat betekent ook MEER nodes per lijn dan in de allereerste versie — een
   beat per node, niet meerdere beats samengeperst. Geldt voor Hoofdstuk 2+;
   de proloog blijft bewust korter (een introductie, geen vol hoofdstuk).

   FLAG "ch1_lijn" (A/B/C) en "ch1_voltooid" dragen de gemaakte keuze door
   naar latere hoofdstukken (bv. voor NPC's die op je pad reageren) — het
   "meer kruisen"-idee (vertakkingen die van elkaar weten) is uitdrukkelijk
   voor een latere bouwstap, nu bewust drie onafhankelijke lijnen naast
   elkaar. */
const SP_CH1_CNS = `
=== SCENE: CH1_000 ===

TITLE:
De Namen van de Wereld

TEXT:
De boodschapper wijst met een hand die niet helemaal vast lijkt in deze wereld. Achter haar scheurt de poort verder open, tot je niets meer ziet dan licht — en daarachter, vaag, de contouren van bergen die je nooit eerder hebt gezien. "Ga," zegt ze. "Daar wachten namen die dreigen te verdwijnen. Vind ze terug, voor het te laat is."

Je stapt door. Wanneer het licht wegtrekt, sta je niet langer in Latium. De lucht ruikt naar tijm en zilte wind, en de grond onder je voeten is steniger, droger, ouder aanvoelend dan de akkers die je kende. Je staat aan de rand van een land dat mensen ooit Hellas noemden — bergen die recht uit zee lijken te groeien, olijfbomen die zich krommen naar een fellere zon, en ergens hierin, verspreid over drie zeer verschillende plekken, wachten verhalen die jou nodig hebben.

CODEX:
codex_grammatica_ch1_lidwoord, codex_grammatica_ch1_naamvallen

CHOICES:

* Naar Sardis, waar een koning alles tot goud maakt -> CH1_A01
* Naar de top van de Olympos, waar iets op het punt staat te barsten -> CH1_B01
* Naar een kille vallei, waar het eerste vuur nog gestolen moet worden -> CH1_C01

END

=== SCENE: CH1_A01 ===

TITLE:
De Weg naar Sardis

TEXT:
De weg naar Sardis voert je oostwaarts, weg van de kust, het land van Hellas uit en een ander landschap in: dat van Lydia, waar de heuvels geleidelijk plaatsmaken voor brede, gouden korenvelden. In de verte rijst de berg Tmolus op, en aan zijn voet kronkelt een rivier die de zon vangt op een manier die geen gewoon water zou moeten doen — de Pactolus, zo hoor je een reiziger onderweg zeggen, alsof die naam op zichzelf al een verhaal is dat hij liever niet hardop vertelt.

Lydia staat, zelfs hier, aan de rand van de wereld die je kent, al bekend als een land van ongelofelijke rijkdom. Handelaars met karavanen vol textiel en zilverwerk trekken dezelfde weg als jij, en meer dan een van hen noemt, half spottend, half jaloers, de naam van hun koning: Midas. Er gaat een gerucht dat hij zojuist een gunst heeft terugbetaald aan een god — en gunsten aan goden, zo weet iedereen, worden altijd op de een of andere manier beantwoord.

PERSON:
midas:intro

CHOICES:

* Ga direct de stad Sardis binnen -> CH1_A02
* Vraag eerst een langsreizende koopman naar het laatste nieuws -> CH1_A01B

END

=== SCENE: CH1_A01B ===

TITLE:
Geruchten op de Weg

TEXT:
De koopman, die net zijn ezel bijstuurt langs een steile bocht, is maar al te bereid zijn last even te laten staan voor een goed verhaal. Hij vertelt over een dronken oude sater die dagenlang zoek was in de rozentuinen van het paleis — Silenus, zegt hij, alsof de naam alles verklaart, de trouwe metgezel en leermeester van Bacchus zelf, altijd op wijn en altijd op het randje van een wijsheid die niemand anders lijkt te bezitten.

Wat de koning met hem heeft gedaan, weet de koopman niet precies, maar het gerucht dat al door Sardis waart is duidelijk genoeg: Midas heeft iets gedaan waarvoor een god nu een gunst schuldig is — en gunsten van goden, voegt de koopman er met een veelbetekenende blik aan toe, brengen zelden alleen maar geluk.

CHOICES:

* Knik kort en loop meteen door, je aandacht al bij het paleis [SEVERITAS] -> CH1_A02
* Luister beleefd, maar zonder een duidelijk oordeel over wat je net hoorde [NEUTRAL] -> CH1_A02
* Bedank de koopman voor zijn verhaal voor je verdergaat [CLEMENTIA] -> CH1_A02

END

=== SCENE: CH1_A02 ===

TITLE:
Het Paleis van Sardis

TEXT:
Het paleis van Sardis torent boven de rest van de stad uit als een aankondiging van welvaart: elke zuil is bedekt met een dunne glans, elk kozijn afgezet met een rand die te helder oogt om zomaar verf te zijn. Binnen de poorten lopen bedienden met neergeslagen ogen en snelle passen, en telkens wanneer twee van hen elkaar passeren, valt er een naam — half fluisterend, half angstig — koning Midas.

Je vangt flarden op van wat er is gebeurd: een oude, dronken metgezel van de wijngod zelf zou verdwaald zijn in de rozentuinen van het paleis, en de koning zou hem, in plaats van hem weg te sturen, tien dagen lang als eregast hebben onthaald voordat hij hem eigenhandig terugbracht naar zijn god. Zulke gastvrijheid, zeggen de bedienden tegen elkaar, wordt zelden onbeloond gelaten.

Boven de hoofdpoort naar de troonzaal staat, diep in de steen gebeiteld, een enkel Grieks woord — een titel, geen naam, alsof de steenhouwer wilde vastleggen wat deze plek regeert.

PUZZLE:
puzzle_ch1a_lidwoord

CHOICES:

* Ontcijfer het woord boven de poort -> CH1_A03

END

=== SCENE: CH1_A03 ===

TITLE:
Silenus, de Dronken Wijze

TEXT:
Binnen de troonzaal hoor je het verhaal in meer detail, verteld door een hoveling die duidelijk geniet van het navertellen. Silenus — oud, dik, altijd op de rand van dronkenschap, en toch, naar men zegt, doordrenkt van een wijsheid die zelfs goden soms komen raadplegen — was op een nacht zijn eigen feest ontgroeid en simpelweg weggewaggeld, het bos in, tot niemand meer wist waar hij was.

Het waren Midas' eigen schaapherders die hem vonden, verstrikt in rozenstruiken, snurkend en glimlachend in zijn slaap. In plaats van hem als een indringer te behandelen, herkende Midas onmiddellijk wie voor hem lag — een metgezel en leermeester van Bacchus zelf — en beval een feestmaal dat tien dagen en tien nachten duurde. Pas daarna bracht hij Silenus eigenhandig terug naar zijn god.

Nu, zo vertelt de hoveling, staat Bacchus zelf op het punt zijn opwachting te maken in de troonzaal — en een god die een gunst moet terugbetalen, is nooit een god die met lege handen komt.

CHOICES:

* Wacht af wat Bacchus te bieden heeft -> CH1_A04

END

=== SCENE: CH1_A04 ===

TITLE:
Een Gevaarlijke Wens

TEXT:
Bacchus verschijnt niet zozeer als dat hij binnenkomt — de lucht in de zaal verandert eerst, wordt zwaarder van de geur van rijpe druiven en omgewoelde aarde, en dan is hij er gewoon, omringd door wijnranken die zich als slingers om de zuilen lijken te vlechten. Een luipaard beweegt loom naast hem, ogen half dicht, alsof zelfs roofdieren in zijn nabijheid hun scherpte verliezen.

"Vraag wat je wilt," zegt de god, en er klinkt oprechte, geamuseerde genegenheid in zijn stem — dit is geen verplichting die hem zwaar valt. Midas, koning van een van de rijkste steden die je ooit hebt gezien, met schatkamers die al overlopen van zilver en fijn bewerkt textiel, aarzelt geen moment. Zijn ogen glinsteren op een manier die je onrustig maakt.

"Laat alles wat ik aanraak in goud veranderen," zegt hij. Er valt een korte stilte. Bacchus glimlacht — een glimlach die je niet helemaal vertrouwt, alsof hij iets weet wat Midas nog moet leren — en knikt.

IMAGE:
midas.png

PERSON:
bacchus:intro

CHOICES:

* Blijf kijken wat er gebeurt -> CH1_A05

END

=== SCENE: CH1_A05 ===

TITLE:
De Gouden Aanraking

TEXT:
Midas test zijn nieuwe gave voorzichtig eerst, dan steeds roekelozer. Een eikentakje in zijn hand: goud, tot in de kleinste nerf. Een steen van de vloer: goud, zwaarder dan een steen zou moeten zijn. Hij lacht, een lach die luider wordt met elke aanraking, en rent door de zaal als een kind — de drempel van zijn eigen deur, een zuil, een appel die hij van een schaal grist, allemaal veranderen ze onder zijn vingers.

PUZZLE:
puzzle_ch1a_naamval

CHOICES:

* Kijk toe hoe hij verder gaat -> CH1_A06

END

=== SCENE: CH1_A06 ===

TITLE:
Het Gouden Feestmaal

TEXT:
Precies zoals in de zin die je net ontrafelde raakt Rex — de koning — aurum aan: het goud. Let op hoe flavum, "geel", er in de zin bij zou passen: rex aurum flavum tangit, de koning raakt het gele goud aan — flavum buigt mee met aurum, allebei in de accusativus. Midas laat een feestmaal aanrichten om zijn nieuwe gave te vieren, trots gezeten aan het hoofd van een tafel beladen met alles wat Sardis te bieden heeft.

Hij grijpt naar brood — en het verstart tussen zijn vingers voordat het zijn lippen bereikt, hard en koud en onmogelijk te breken. Hij grijpt naar zijn beker wijn, wanhopig nu, en de vloeistof zelf verandert zodra ze zijn mond raakt, een gouden druppel die tegen zijn tanden tikt in plaats van te lessen. Voor het eerst sinds de wens is uitgesproken, verschijnt er iets anders dan verrukking op zijn gezicht: paniek.

CHOICES:

* Kijk onbewogen toe — hij wist waar hij om vroeg [SEVERITAS] -> CH1_A07
* Kijk toe, nog niet goed wetend wat je van dit alles moet denken [NEUTRAL] -> CH1_A07
* Kijk met groeiend medeleven hoe zijn paniek toeneemt [CLEMENTIA] -> CH1_A07

END

=== SCENE: CH1_A07 ===

TITLE:
Wat Goud Niet Kan Voeden

TEXT:
Zijn dochter, die het feestmaal binnenkomt en niets vermoedt van wat er zojuist is gebeurd, rent op hem af zoals ze elke avond doet — bezorgd om het geluid dat ze net hoorde, maar blij hem te zien. Midas, in een reflex die sneller is dan zijn eigen doodsangst, steekt zijn handen niet op tijd weg.

Hij omarmt haar voordat hij zich kan inhouden, en zij verstart in zijn armen — koud, glanzend, voor altijd stil, een standbeeld waar zojuist nog een levend kind stond. Het geluid dat uit Midas komt, is niet menselijk meer te noemen.

CHOICES:

* Grijp hem stevig bij zijn schouders, om hem tot bezinning te schudden [SEVERITAS] -> CH1_A08
* Grijp hem bij zijn schouders, zelf niet zeker of dit troost of een schok moet zijn [NEUTRAL] -> CH1_A08
* Grijp hem voorzichtig bij zijn schouders, om hem te troosten [CLEMENTIA] -> CH1_A08

END

=== SCENE: CH1_A08 ===

TITLE:
Een Vloek Erkend

TEXT:
Midas zakt op zijn knieën naast het gouden standbeeld dat zijn dochter was, zijn handen trillend boven haar gezicht, bang haar nogmaals aan te raken en toch niet in staat haar los te laten. De schatkamers die hij ooit te klein vond, de wens die hem eindeloos toescheen, liggen nu als een aanklacht om hem heen.

Voor het eerst sinds je hem zag, ziet hij eruit als een gewone man — geen koning, geen bezitter van ongekende rijkdom, maar een vader die zojuist alles heeft verloren wat werkelijk telde. "Neem het terug," fluistert hij, tegen niemand in het bijzonder. "Neem het alsjeblieft terug."

CHOICES:

* Blijf eerst naast hem zitten, zodat hij niet alleen is met wat hij heeft gedaan [CLEMENTIA] -> CH1_A08B
* Blijf besluiteloos naast hem zitten, niet zeker wat je nu moet zeggen [NEUTRAL] -> CH1_A08B
* Wijs hem meteen op Bacchus, die alles zag gebeuren [SEVERITAS] -> CH1_A09

END

=== SCENE: CH1_A08B ===

TITLE:
Een Ogenblik van Stilte

TEXT:
Je knielt naast hem neer zonder iets te zeggen — er is toch geen woord dat recht doet aan wat er zojuist is gebeurd. Midas' handen trillen nog altijd boven het gouden gezicht van zijn dochter, alsof aanraken en niet-aanraken tegelijk ondraaglijk zijn geworden.

Pas na een lange stilte, wanneer zijn ademhaling eindelijk iets rustiger wordt, durf je hem eraan te herinneren dat er misschien nog een uitweg is — een god die een gunst gaf, kan een gunst ook terugnemen.

CHOICES:

* Wijs hem op Bacchus, die alles zag gebeuren -> CH1_A09

END

=== SCENE: CH1_A09 ===

TITLE:
De Aanroeping

TEXT:
Midas heft zijn gezicht naar de wijnranken die nog altijd om de zuilen hangen — Bacchus is nooit echt weggegaan, dat voel je, ook al is de god zelf niet meer zichtbaar. Er is een moment waarop Midas alleen maar naar de ranken staart, zijn lippen bewegend zonder geluid, alsof hij bang is dat de woorden hem zullen verraden zoals zijn wens dat deed.

Dan, met een stem die breekt op elke lettergreep, roept hij.

PUZZLE:
puzzle_ch1a_vocativus

CHOICES:

* Wacht op het antwoord van de god -> CH1_A10

END

=== SCENE: CH1_A10 ===

TITLE:
De Rivier de Pactolus

TEXT:
Bacchus verschijnt opnieuw, niet wreed maar ook niet haastig — bijna alsof hij dit al had voorzien. "Je wens was nooit het probleem," zegt hij, "je onvermogen om tevreden te zijn wel. Maar ik ben geen god die geniet van andermans verdriet. Was jezelf in de rivier de Pactolus, en de vloek stroomt met het water mee."

Midas rent zoals hij nog nooit heeft gerend, struikelt over zijn eigen gouden drempel, en dompelt zich onder in de rivier die je onderweg al zag glinsteren. Wanneer hij weer opstaat, druipend en buiten adem, is het goud uit zijn handen verdwenen — en achter hem, waar het water over zijn huid stroomde, glinstert de rivierbedding voortaan doorspekt met fijne, gouden korrels. Reizigers zullen deze rivier eeuwenlang de Pactolus blijven noemen, en handelaars uit deze streek zullen nog generaties later spreken over het goud dat letterlijk uit haar water wordt gezeefd.

Zijn dochter, zo vertelt men je later, terwijl Midas nog druipend aan de oever zit, keerde terug tot leven zodra de laatste gouden druppel zijn huid verliet — springlevend, ongedeerd, zonder enige herinnering aan het standbeeld dat ze even was.

CODEX:
codex_gouden_aanraking

PERSON:
midas:full, bacchus:full

EERETITEL:
ch1_a_midas

QUEST:
quest_boodschapper_van_kronos: hoofdstuk 1 voltooid (lijn: Midas)

FLAG:
ch1_lijn=A; ch1_voltooid=true

CHOICES:

* Loop meteen door — er wacht nog werk aan de naam die je moet redden [SEVERITAS] -> CH1_A11
* Werp een laatste blik terug, zonder er verder bij stil te staan [NEUTRAL] -> CH1_A11
* Kijk nog eenmaal om, met medeleven voor de man die zoveel verloor en terugkreeg [CLEMENTIA] -> CH1_A11

END

=== SCENE: CH1_A11 ===

TITLE:
Het Orakel Verschijnt

TEXT:
Terwijl je van de rivieroever wegloopt, met Midas' dochter weer levend en de vloek verdwenen, begint de lucht om je heen opnieuw te trillen — precies zoals toen je de bronzen schijf in Latium voor het eerst aanraakte. Uit het niets gloeit het orakel weer op, en de vertrouwde stem van de Boodschapper van Kronos klinkt, deze keer met iets dat verdacht veel op oprechte tevredenheid lijkt.

"Je hebt de naam van Midas teruggegeven aan de herinnering," zegt de stem, "en met hem het gevaar van een wens die niet doordacht is. Sardis, Bacchus, de Pactolus — ze bestaan weer, precies zoals ze altijd hadden moeten bestaan."

IMAGE:
orakel_verschijnt.png

MUSIC:
the_oracle_awakens.mp3

CHOICES:

* Luister verder -> CH1_ROBE

END

=== SCENE: CH1_B01 ===

TITLE:
Metis, de Eerste Vrouw van Zeus

TEXT:
Voordat je de top van de Olympos bereikt, hoor je het verhaal al van een herder die de berg met angstige blikken observeert: over Metis, een Titanide zo doordrenkt van sluw inzicht dat zelfs Zeus haar ooit als raadgeefster nodig had — en haar uiteindelijk tot zijn eerste vrouw maakte. Ze was, toen dit allemaal begon, zwanger van hun eerste kind.

Een oude profetie, afkomstig van Gaia en Ouranos zelf, waarschuwde Zeus voor wat komen zou: Metis zou eerst een dochter baren, even wijs en dapper als haar vader — en daarna een zoon die hem zou onttronen, precies zoals Zeus ooit zijn eigen vader Kronos onttroonde, en Kronos vóór hem Ouranos. Een patroon dat zich, zo leek het, eindeloos zou herhalen.

Zeus, vastberaden dat patroon te breken, deed het enige wat hem logisch leek: hij slikte Metis in het geheel in, zwanger nog van hun dochter. Sindsdien, zo vertelt de herder terwijl hij zich haastig uit de voeten maakt, draagt hij iets in zich mee dat niet stil wil blijven liggen.

PERSON:
zeus:intro

CHOICES:

* Beklim direct de laatste helling naar de top -> CH1_B02
* Vraag de herder waarom hij zo angstig wegvlucht -> CH1_B01B

END

=== SCENE: CH1_B01B ===

TITLE:
Een Patroon dat Zich Herhaalt

TEXT:
De herder aarzelt, alsof hij al spijt heeft van wat hij heeft losgelaten, maar antwoordt toch. "Ik was er zelf niet bij toen hij zijn eigen vader onttroonde, jongen, maar mijn vader wel. Kronos verslond zijn kinderen uit angst voor een profetie — en Zeus ontsnapte alleen omdat zijn moeder hem verborg en Kronos een steen liet inslikken in zijn plaats."

Hij wijst naar de donderwolken die zich al om de top samenpakken. "Als de zoon zo bang was voor zijn eigen kinderen dat hij naar dít soort maatregelen greep, wil ik niet weten wat er vandaag gebeurt." Met die woorden verdwijnt hij tussen de rotsen, en jij blijft achter met een onbehaaglijk gevoel dat groeit met elke stap die je verder omhoog zet.

CHOICES:

* Je hebt geen tijd voor meer vragen en klimt meteen door [SEVERITAS] -> CH1_B02
* Overweeg zijn woorden een moment, en klim dan verder [NEUTRAL] -> CH1_B02
* Bedank de herder voor zijn waarschuwing voor je verdergaat [CLEMENTIA] -> CH1_B02

END

=== SCENE: CH1_B02 ===

TITLE:
Onweer op de Olympos

TEXT:
De top van de Olympos ligt onder een lucht die niet wil beslissen tussen doodse stilte en een naderende storm. Zeus zit ineengedoken op zijn troon, beide handen tegen zijn slapen gedrukt, alsof zijn eigen schedel te klein is geworden voor wat erin groeit. Zijn gewoonlijk donderende stem is niet meer dan een schor gekreun.

De andere goden houden zich op afstand, fluisterend onder elkaar, niemand goed wetend wat te doen. Er is iets aan het gebeuren waar zelfs zij, onsterfelijk en machtig, geen grip op hebben — een geboorte die zich niet aan de gewone regels houdt.

CHOICES:

* Blijf nuchter — een pijnlijke geboorte is nog geen excuus voor wat hij Metis aandeed [SEVERITAS] -> CH1_B03
* Kijk toe zonder een duidelijke mening te vormen over wat je ziet [NEUTRAL] -> CH1_B03
* Voel medelijden met Zeus, ondanks alles wat hij heeft gedaan [CLEMENTIA] -> CH1_B03

END

=== SCENE: CH1_B03 ===

TITLE:
Een Naam voor het Ongeborene

TEXT:
Twee nimfen fluisteren een woord tussen de zuilen door, telkens weer, bijna als een bezwering die ze zelf nog niet helemaal geloven: θεά. Een godin. Iets — iemand — is onderweg, en zelfs de goden weten nog niet goed hoe ze haar moeten noemen, laat staan wat haar komst zal betekenen voor de orde die ze allemaal kennen.

PUZZLE:
puzzle_ch1b_lidwoord

PERSON:
athena:intro

CHOICES:

* Volg het gefluister naar Zeus' troon -> CH1_B04

END

=== SCENE: CH1_B04 ===

TITLE:
De Bijl van Hephaistos

TEXT:
Hephaistos wordt erbij gehaald — de enige onder de goden die ruw genoeg is, en tegelijk precies genoeg, voor wat nu moet gebeuren. Je herkent hem aan zijn manke gang: als kind door zijn eigen moeder Hera van de Olympos gegooid vanwege die onvolkomenheid, opgevangen en grootgebracht door de zeenimf Thetis, tot hij uitgroeide tot de meest begaafde smid die de goden ooit hebben gekend.

Hij weegt zijn bijl in zijn handen, kijkt naar Zeus' gebogen hoofd, en aarzelt — een ademtocht lang, niet meer. Dan heft hij het wapen.

PUZZLE:
puzzle_ch1b_naamval

PERSON:
hephaistos:intro

CHOICES:

* Kijk niet weg -> CH1_B05

END

=== SCENE: CH1_B05 ===

TITLE:
Wat uit het Hoofd Breekt

TEXT:
Vulcanus caput aperit — Hephaistos opent het hoofd, en durum, "hard", past feilloos bij caput: vulcanus caput durum aperit, Hephaistos opent het harde hoofd, allebei in de accusativus. De klap valt, zwaarder en voller van gevolg dan enige andere klap die ooit op de Olympos is uitgedeeld. De hemel zelf lijkt even zijn adem in te houden.

En dan, uit de opening, niet met bloed maar met een licht dat je ogen doet knipperen: een gestalte, al volwassen, al volledig gewapend — een speer stevig in haar hand, een helm die zonder enige hulp precies op haar plek valt, alsof ze nooit anders bedoeld was dan om zo geboren te worden.

IMAGE:
birth_of_athena.png

CHOICES:

* Kijk hoe ze voor het eerst ademhaalt -> CH1_B06

END

=== SCENE: CH1_B06 ===

TITLE:
Pallas Athena

TEXT:
Ze richt zich op tot haar volle lengte, ogen grijs als een naderend onweer dat net is gaan liggen. Wanneer ze haar strijdkreet slaakt, huivert de hemel zelf, en beneden op aarde, zo zul je later horen, deinden de zeeën even hoog op alsof ook zij haar wilden begroeten.

Geen enkele andere god zegt iets. Ze staan als bevroren, kijkend naar deze dochter die in enkele ogenblikken is verschenen met een wijsheid en gestrengheid die ouder lijkt dan haar eigen geboorte. Zeus, nog altijd duizelig van de klap, is de eerste die zijn stem hervindt.

PUZZLE:
puzzle_ch1b_vocativus

CHOICES:

* Kijk hoe Zeus als eerste zijn stem hervindt -> CH1_B07
* Kijk naar de andere goden, die zich stilletjes terugtrekken -> CH1_B06B

END

=== SCENE: CH1_B06B ===

TITLE:
Niet Iedereen Kijkt met Bewondering

TEXT:
Niet iedereen op de Olympos kijkt met dezelfde verwondering toe. Ares, god van de oorlog, staart naar haar speer met iets dat verdacht veel op jaloezie lijkt — een nieuwe godin, amper geboren, die instinctief beter met een wapen lijkt om te gaan dan hij na eeuwen strijd. Hera, Zeus' eigen vrouw, kijkt toe met een uitdrukking die het midden houdt tussen argwaan en berekening, alsof ze zich nu al afvraagt wat deze onverwachte dochter voor haar eigen positie zal betekenen.

Alleen Hermes glimlacht oprecht, alsof hij nu al verheugd is op alle verhalen die deze geboorte ongetwijfeld zal opleveren. Terwijl de goden zo, ieder op hun eigen manier, op haar komst reageren, is het Zeus die als eerste zijn stem hervindt.

CHOICES:

* Wacht af hoe zij antwoordt -> CH1_B07

END

=== SCENE: CH1_B07 ===

TITLE:
De Aanroeping van Zeus

TEXT:
Ze buigt haar hoofd naar hem, niet onderdanig maar erkennend — een dochter die haar vader ziet, geen onderdaan die een koning ziet. Er is iets in de manier waarop ze hem aankijkt dat verraadt dat ze al precies weet wie ze is, en wat haar plaats zal zijn tussen deze goden die haar zojuist pas hebben ontmoet.

Zeus, met een mengeling van opluchting en ontzag die je zelden op zijn gezicht ziet, strekt zijn hand naar haar uit.

CHOICES:

* Kijk toe, vooral benieuwd wat haar aanwezigheid voor de Olympos gaat betekenen [SEVERITAS] -> CH1_B08
* Kijk toe, vooral afwachtend wat er nu gaat gebeuren [NEUTRAL] -> CH1_B08
* Kijk toe, ontroerd door het moment tussen vader en dochter [CLEMENTIA] -> CH1_B08

END

=== SCENE: CH1_B08 ===

TITLE:
Wijsheid Neemt Haar Plaats In

TEXT:
Vanaf die dag zal ze naast Zeus staan, niet als een wapen dat hij inzet, maar als een raadgeefster die hij raadpleegt — de eerste onder de goden die vraagt voordat ze oordeelt, die nadenkt voordat ze toeslaat. Waar oorlog voor anderen enkel kracht en woede betekent, zal voor haar altijd ook strategie en overleg gelden.

De andere goden zwijgen nog, onwennig met deze nieuwe aanwezigheid, maar jij voelt het al aan: er is zojuist iets in de wereld gekomen dat niet meer zal verdwijnen. Wijsheid heeft een gezicht gekregen, een speer, en een naam die weldra door heel Hellas zal worden uitgesproken — Pallas Athena.

CODEX:
codex_geboorte_athena

PERSON:
athena:full

EERETITEL:
ch1_b_athena

QUEST:
quest_boodschapper_van_kronos: hoofdstuk 1 voltooid (lijn: Athena)

FLAG:
ch1_lijn=B; ch1_voltooid=true

CHOICES:

* Daal meteen af — er is nog werk te doen [SEVERITAS] -> CH1_B09
* Daal af, nog steeds nadenkend over wat je zojuist hebt gezien [NEUTRAL] -> CH1_B09
* Daal af, dankbaar dat je bij zo'n geboorte mocht zijn [CLEMENTIA] -> CH1_B09

END

=== SCENE: CH1_B09 ===

TITLE:
Het Orakel Verschijnt

TEXT:
Terwijl Pallas Athena naast Zeus haar plaats inneemt en de Olympos langzaam tot rust komt, trilt de lucht om je heen — net als toen je de bronzen schijf in Latium voor het eerst aanraakte. Het orakel gloeit weer op, en de stem van de Boodschapper van Kronos klinkt, deze keer met iets dat verdacht veel op oprechte tevredenheid lijkt.

"Je hebt de geboorte van Pallas Athena teruggegeven aan de herinnering," zegt de stem. "Wijsheid heeft weer een gezicht, een speer, en een naam die door heel Hellas wordt uitgesproken. Zonder jou was ook zij vervaagd, net als al het andere dat deze wereld dreigde te verliezen."

IMAGE:
orakel_verschijnt.png

MUSIC:
the_oracle_awakens.mp3

CHOICES:

* Luister verder -> CH1_ROBE

END

=== SCENE: CH1_C01 ===

TITLE:
De Titaan die Mensen Vormde

TEXT:
Onderweg naar de kille vallei hoor je, van een oude vrouw die stokoude verhalen nog kent, hoe de mensheid ooit is ontstaan. Prometheus, een titaan, koos tijdens de grote oorlog tussen goden en titanen de kant van Zeus — een verraad aan zijn eigen familie dat hem, anders dan de meeste titanen, een geprivilegieerde plek onder de nieuwe orde opleverde. Hij zag de afloop van die oorlog aankomen voordat iemand anders dat deed, zegt de vrouw, en koos dienovereenkomstig.

Het was Prometheus die, samen met Athena, de eerste mensen vormde uit klei en water, en hun een sprankje van het goddelijke inblies dat andere dieren nooit hebben gekregen. Zijn broer Epimetheus kreeg de taak om aan elk levend wezen een gave te schenken — snelheid, kracht, vacht, vleugels, scherpe tanden — maar verdeelde zijn voorraad zo onbezonnen dat er, tegen de tijd dat hij bij de mensen aankwam, niets meer over was.

Naakt, langzaam, zonder klauwen of vacht of vleugels, stonden de eerste mensen daar hulpelozer dan enig ander schepsel onder de zon. Prometheus, zo besluit de oude vrouw haar verhaal, heeft zich dat nooit kunnen vergeven — en dat is precies waarom hij deed wat hij deed.

PERSON:
prometheus:intro

CHOICES:

* Loop resoluut door — verhalen zijn mooi, maar je wilt het zelf zien [SEVERITAS] -> CH1_C02
* Loop verder in gedachten, niet meteen overtuigd van het hele verhaal [NEUTRAL] -> CH1_C02
* Haast je naar de vallei, bewogen door het verhaal van de oude vrouw [CLEMENTIA] -> CH1_C02

END

=== SCENE: CH1_C02 ===

TITLE:
De Kille Vallei

TEXT:
Beneden, in een vallei zonder enig vuur, klappertanden de eerste mensen tegen de nacht. Ze hebben geen manier om zich te warmen wanneer de zon ondergaat, geen licht tegen het duister waarin roofdieren wél goed kunnen zien, geen manier om hun voedsel te veranderen in iets meer dan rauwe, ongenietbare kou.

Prometheus, die vanaf de rand van de Olympos naar beneden kijkt, ziet elke avond dezelfde ellende zich herhalen. Zijn eigen schepping, hulpeloos gelaten door zijn broers vergeetachtigheid, overleeft nauwelijks de nachten. Hij kan niet langer toekijken zonder in te grijpen — ook al weet hij precies wat voor risico dat met zich meebrengt.

CHOICES:

* Volg hem meteen, vastbesloten als hij is -> CH1_C03
* Wacht tot het donker is, zodat hij ongezien de Olympos op kan -> CH1_C02B

END

=== SCENE: CH1_C02B ===

TITLE:
Wachten op het Duister

TEXT:
Prometheus wacht tot de laatste gloed van de zonsondergang is weggezakt, wetend dat zelfs een titaan die ooit aan Zeus' zijde streed geen enkele garantie heeft wanneer hij zich aan diefstal van de goden waagt. In het duister, tussen de rotsen die de weg naar de top markeren, oefent hij zijn tocht in gedachten nog een laatste keer.

Je ziet de twijfel over zijn gezicht trekken — niet over wat hij gaat doen, dat staat allang vast, maar over de prijs die hij er ooit voor zal moeten betalen. Toch, wanneer de sterren eindelijk helder genoeg staan, zet hij de eerste stap naar boven.

CHOICES:

* Volg hem terwijl hij zich naar het vuur van de goden waagt -> CH1_C03

END

=== SCENE: CH1_C03 ===

TITLE:
Het Woord voor Vuur

TEXT:
Bij de haard van de goden zelf, hoog op de Olympos, brandt het vuur ongetemd en helder, gevoed dag en nacht zonder dat iemand het ooit hoeft aan te wakkeren. Op de rand van de haardsteen staat, half door rook verweerd, een enkel woord gekrast — alsof zelfs de goden ooit de behoefte voelden om te benoemen wat hen zo warm houdt.

Prometheus sluipt dichterbij, zijn hart bonzend op een manier die niet bij een onsterfelijke titaan lijkt te passen.

PUZZLE:
puzzle_ch1c_lidwoord

CHOICES:

* Kijk hoe Prometheus een vonk verbergt -> CH1_C04

END

=== SCENE: CH1_C04 ===

TITLE:
De Diefstal

TEXT:
Prometheus verbergt een enkele gloeiende vonk in de holte van een vijgentakstengel — een plant waarvan het merg smeult zonder de vlam zelf te voeden, precies genoeg om een vonk levend te houden tijdens een lange tocht. Hij glipt terug naar de aarde, sneller en stiller dan een god hem ooit zou toevertrouwen.

Beneden, in de vallei, geeft hij het vuur aan de mensen die er het hardst naar smachtten. Voor het eerst zie je licht op hun gezichten dat niet van de maan komt: verwondering eerst, dan iets wat verdacht veel op hoop begint te lijken. Ze leren binnen een enkele nacht hoe ze hout moeten stoken, hoe ze vlees moeten roosteren, hoe ze een cirkel om de vlam moeten vormen tegen de kou.

CHOICES:

* Kijk toe hoe de hemel dit opmerkt -> CH1_C05

END

=== SCENE: CH1_C05 ===

TITLE:
Zeus' Woede en Twee Straffen

TEXT:
Zeus ziet, vanaf zijn troon, de vuren beneden oplichten als stipjes die er niet hadden mogen zijn — een belediging, een overtreding van de grens tussen goden en mensen die hij niet ongestraft kan laten. Zijn woede, wanneer hij begrijpt wat er is gebeurd en wie erachter zit, is zo groot dat de bergen zelf ervan trillen.

Voor Prometheus bedenkt hij een straf die eeuwig zal duren: vastgeketend aan een rots, zijn lever elke dag opnieuw opgegeten door een adelaar, en elke nacht weer aangroeiend zodat de kwelling nooit eindigt. Maar voor de mensheid, die hij evenzeer wil straffen voor het ontvangen van wat niet voor hen bedoeld was, bedenkt hij iets subtielers — een geschenk dat zich pas later als een vloek zal ontpoppen.

CHOICES:

* Kijk toe zonder oordeel — de goden doen wat goden doen [SEVERITAS] -> CH1_C06
* Wacht simpelweg af wat Zeus heeft bedacht [NEUTRAL] -> CH1_C06
* Vrees voor wat dit gaat opleveren, met medelijden voor wie straks de gevolgen zal dragen [CLEMENTIA] -> CH1_C06

END

=== SCENE: CH1_C06 ===

TITLE:
Pandora, het Alomgeschonken Geschenk

TEXT:
Zeus beveelt Hephaistos haar te maken zoals ooit de eerste mensen werden gemaakt: uit klei en water, gevormd tot een vrouw van verbluffende schoonheid. Maar waar Prometheus zijn schepselen enkel een vonk van het goddelijke meegaf, geeft elke god en godin op de Olympos haar nu iets van zichzelf — Aphrodite schenkt haar onweerstaanbare gratie, Hermes een gladde tong en de gave om te misleiden, Athena vaardigheid in het weven van de fijnste stof.

Zo krijgt ze een naam die simpelweg beschrijft wat ze is: Pandora, "zij die alles geschonken kreeg" — pan, alles, en dooron, geschenk. Een naam die klinkt als een zegen, en die evengoed als een waarschuwing gelezen kan worden.

Zeus geeft haar een verzegelde doos mee wanneer hij haar naar de aarde stuurt, met een uitdrukkelijke instructie: nooit, onder geen enkele omstandigheid, mag ze hem openen.

PERSON:
pandora:intro

CHOICES:

* Volg Pandora naar de mensenwereld -> CH1_C07

END

=== SCENE: CH1_C07 ===

TITLE:
De Doos die Ze Meekreeg

TEXT:
Pandora wordt naar Epimetheus gestuurd — de broer die de mensheid ooit vergat te bedelen, en die nu, stralend van geluk over dit onverwachte geschenk, haar met open armen ontvangt. Prometheus had hem uitdrukkelijk gewaarschuwd: aanvaard nooit een geschenk van Zeus, wat het ook is. Maar Epimetheus, betoverd door haar schoonheid, vergeet die waarschuwing zodra hij haar ziet.

Pandora zelf voelt de doos als een gewicht dat ze overal met zich meedraagt, een nieuwsgierigheid die met elke dag groeit. Ze weet niet precies wat erin zit — alleen dat het haar op een dag te veel zal worden om niet te kijken.

PUZZLE:
puzzle_ch1c_naamval

PERSON:
epimetheus:intro

CHOICES:

* Kijk toe op het moment dat ze het deksel licht -> CH1_C08
* Kijk hoe Epimetheus probeert haar aandacht af te leiden -> CH1_C07B

END

=== SCENE: CH1_C07B ===

TITLE:
Een Poging tot Afleiding

TEXT:
Epimetheus, die de onrust in haar ogen allang heeft opgemerkt, doet wat hij kan om haar gedachten af te leiden — een wandeling door de boomgaard, een nieuw geweven kleed, elk cadeau dat hij kan bedenken om die ene, verzegelde doos uit haar gedachten te verdrijven. Een tijdlang lijkt het zelfs te werken.

Maar 's avonds, wanneer het huis stil is geworden en Epimetheus allang slaapt, vindt Pandora zichzelf toch weer terug bij de doos, haar vingers al op het deksel voordat ze zich ook maar bewust wordt van wat ze doet.

CHOICES:

* Kijk toe op het moment dat ze het deksel licht -> CH1_C08

END

=== SCENE: CH1_C08 ===

TITLE:
Wat uit de Doos Ontsnapt

TEXT:
Pandora pyxidem aperit — Pandora opent de doos, en novam, "nieuw", buigt keurig mee met pyxidem: pandora pyxidem novam aperit, Pandora opent de nieuwe doos, allebei in de accusativus. Het deksel klikt open na weken van weerstand, en op hetzelfde moment beseft ze wat ze heeft gedaan — maar te laat.

Er stroomt geen licht naar buiten, maar schaduwen: ziekte, verdriet, oorlog, honger, en ontelbare andere kwalen die zich in de lucht oplossen en de wereld in trekken voordat ook maar iemand ze kan grijpen of tegenhouden. Pandora deinst achteruit, haar handen tegen haar mond, terwijl de eerste ellende die de mensheid ooit zal kennen zich over de aarde verspreidt.

IMAGE:
pandora.png

CHOICES:

* Richt je blik meteen op de doos — is dit werkelijk alles wat erin zat? [SEVERITAS] -> CH1_C09
* Kijk toe, niet goed wetend wie of wat hier het meest je aandacht verdient [NEUTRAL] -> CH1_C09
* Kniel bij Pandora neer, die verstijfd is van schrik en schuldgevoel [CLEMENTIA] -> CH1_C09

END

=== SCENE: CH1_C09 ===

TITLE:
Wat Achterblijft

TEXT:
Op de bodem, half verscholen tussen de laatste schaduwen die nog naar buiten kringelen, blijft iets kleins achter: een zacht, warm licht dat niet weg wil vliegen zoals de rest. Elpis. Hoop. Het enige wat Zeus, om redenen die niemand ooit helemaal heeft doorgrond, in de doos achterliet toen hij haar verzegelde.

Pandora, nog trillend van wat ze heeft aangericht, sluit het deksel voordat ook dit laatste beetje licht kan ontsnappen — en zo blijft, te midden van alle kwaad dat nu over de wereld waart, tenminste iets achter waar de mensen zich aan vast kunnen houden, wat er ook gebeurt.

PERSON:
pandora:full

CHOICES:

* Ga naar hem toe, vooral nieuwsgierig naar wat een titaan drijft tot zo'n offer [SEVERITAS] -> CH1_C10
* Ga naar hem toe, zonder meteen te weten wat je tegen hem wilt zeggen [NEUTRAL] -> CH1_C10
* Ga naar hem toe, vervuld van medelijden voor wat hij voor de mensheid heeft opgeofferd [CLEMENTIA] -> CH1_C10

END

=== SCENE: CH1_C10 ===

TITLE:
Geketend, Niet Gebroken

TEXT:
Hoog tegen een rots, ver van de vallei waar alles begon, vind je Prometheus — vastgeketend door Zeus' eigen bevel, zijn straf nog maar net begonnen aan wat een eeuwigheid dreigt te worden. Een adelaar cirkelt al boven hem, wachtend tot de avond valt om zijn dagelijkse, gruwelijke maaltijd te beginnen.

Beneden hem, onzichtbaar vanaf de rots maar voelbaar tot in zijn eigen botten, branden inmiddels duizend kleine vuren verspreid over de valleien. Mensen die ooit klappertandden, warmen zich nu. Mensen die niets hadden dan duisternis, hebben licht om bij te koken, te werken, samen te komen. Ergens tussen hen in draagt iemand, zonder het ooit te beseffen, nog altijd Elpis met zich mee.

PUZZLE:
puzzle_ch1c_vocativus

CHOICES:

* Beantwoord zijn blik -> CH1_C11

END

=== SCENE: CH1_C11 ===

TITLE:
Vuur en Hoop

TEXT:
Prometheus glimlacht, ondanks de ketenen, ondanks de rots, ondanks de adelaar die hij elke avond opnieuw zal moeten doorstaan. "Het was het waard," zegt hij zacht — niet tegen jou, niet tegen de goden, maar tegen niemand in het bijzonder, alsof hij deze woorden al heel lang tegen zichzelf herhaalt om vol te kunnen houden.

Vuur en hoop: twee dingen die de mensheid, wat de goden ook nog mogen bedenken om haar te straffen of te beproeven, nooit meer zal kwijtraken. Je daalt af van de rots met dat besef stevig in je meegedragen, terug naar een wereld die voorgoed is veranderd door wat één titaan bereid was te riskeren.

CODEX:
codex_doos_van_pandora

PERSON:
prometheus:full

EERETITEL:
ch1_c_prometheus

QUEST:
quest_boodschapper_van_kronos: hoofdstuk 1 voltooid (lijn: Prometheus)

FLAG:
ch1_lijn=C; ch1_voltooid=true

CHOICES:

* Loop verder, terug naar de bewoonde wereld -> CH1_C12

END

=== SCENE: CH1_C12 ===

TITLE:
Het Orakel Verschijnt

TEXT:
Terwijl je van Prometheus' rots wegloopt, met vuur en hoop nu onlosmakelijk verbonden aan de mensheid, trilt de lucht om je heen — net als toen je de bronzen schijf in Latium voor het eerst aanraakte. Het orakel gloeit weer op, en de stem van de Boodschapper van Kronos klinkt, deze keer met iets dat verdacht veel op oprechte tevredenheid lijkt.

"Je hebt het vuur van Prometheus, de doos van Pandora en de hoop die erin achterbleef teruggegeven aan de herinnering," zegt de stem. "Een titaan die alles riskeerde voor een schepping die niet eens de zijne was — zonder jou was ook dat verhaal voorgoed verdwenen."

IMAGE:
orakel_verschijnt.png

MUSIC:
the_oracle_awakens.mp3

CHOICES:

* Luister verder -> CH1_ROBE

END

=== SCENE: CH1_ROBE ===

TITLE:
De Mantel

TEXT:
De stem zwijgt even, en dan — bijna geamuseerd — klinkt er iets nieuws. "Maar voordat je verdergaat: kijk eens naar jezelf." Je kijkt omlaag naar je eigen kleren: de vodden van een boer uit Latium, gescheurd en met aarde besmeurd, nog altijd dezelfde kleren waarin je van je eigen akker vertrok.

"Een boodschapper die de herinnering van hele beschavingen bewaart, verdient beter dan vodden," zegt de stem. Uit het licht van het orakel vouwt zich iets stofachtigs, dat neerdaalt om je schouders — een eenvoudige, goed gesneden mantel, zwaar genoeg om je te beschermen tegen de kou van elke tijd en elke plaats waar je nog terecht zult komen.

CODEX:
codex_grammatica_ch1_overzicht

VOCAB:
grieks_despotes, grieks_thea, grieks_pyr, latijn_rex, latijn_aurum, latijn_flavus, latijn_tangit, latijn_caput, latijn_durus, latijn_aperit, latijn_pyxis, latijn_novus

CHOICES:

* Trek de mantel aan -> CH1_CODEX_UITLEG

END

=== SCENE: CH1_CODEX_UITLEG ===

TITLE:
De Codex Memoriae

TEXT:
De Boodschapper spreekt nog één keer, dit keer met iets dat op een instructie lijkt. "Alles wat je hier leert — de namen, de verhalen, de vormen van hun eigen taal — verdwijnt te makkelijk als niemand het vastlegt. Daarom houd ik voor jou de Codex Memoriae bij: een levend register van alles wat je hebt herontdekt."

"Elke naam die je terugvindt en elk stukje taal dat je ontcijfert, wordt automatisch aan de Codex toegevoegd — grammatica net zo goed als mythologie. Raadpleeg haar wanneer je maar wilt, vanaf het opslagscherm: niets wat eenmaal is vastgelegd, kan opnieuw verdwijnen."

CHOICES:

* Doorgaan -> CH1_EINDE

END

=== SCENE: CH1_EINDE ===

TITLE:
Het Einde van Hoofdstuk 1

TEXT:
De Boodschapper knikt, en de poort achter je opent zich weer — ditmaal niet naar een vergeten hoofdstuk, maar naar iets wat nog geschreven moet worden. "Hoofdstuk 2 wacht al ergens verderop," zegt de stem. "Kom mee."

CHOICES:

* Stap door de poort -> CH2_000

END
`.trim();

/* ---- HOOFDSTUK 2: "DE WERKEN VAN DE HELDEN" (scène-ID's CH2_###) ----
   Thema: Hera (Juno) als jaloerse vrouw. Vier parallelle lijnen i.p.v.
   Hoofdstuk 1's drie — NIET allemaal even lang of even "compleet":
   - L (Latona): Grieks mythe Leto, maar VERTELD met Romeinse namen (Latona,
     Jupiter, Juno, Apollo, Diana) — wordt in dit hoofdstuk volledig afgerond.
   - S (Semele): ook Romeins verteld (Jupiter, Juno, Bacchus) — grijpt terug
     naar Bacchus uit Hoofdstuk 1 lijn A. NOG TE BOUWEN.
   - K (Kallisto): Grieks verteld (Zeus, Hera, Artemis) — introduceert
     Artemis. NOG TE BOUWEN.
   - H (Herakles): Grieks verteld (Herakles, niet Hercules) — BEWUST
     ONVOLLEDIG: dekt alleen zijn geboorte + de eerste taken, de rest volgt
     in Hoofdstuk 3 (zie SP_CAMPAIGN ch3). Rondt daarom NIET het hoofdstuk af
     (geen ch2_voltooid-FLAG) en leidt terug naar de hub in plaats van naar
     het gedeelde Orakel-epiloog. NOG TE BOUWEN.

   NAAMGEVINGSREGEL (zie ook Chronica.md): L/S gebruiken overal Romeinse
   namen, K/H overal Griekse — dezelfde regel als Hoofdstuk 1 (A=Romeins,
   B/C=Grieks). Elke god/godin heeft ondertussen maar ÉÉN Codex-persoon-id
   (bv. "hera", niet ook nog een aparte "juno") met nm "Primaire naam
   (secundaire naam)" — ongeacht welke naam de verteltekst van een
   specifieke lijn gebruikt.

   L en S CONVERGEREN zodra beide hun geboorte-climax hebben gehad (Apollo/
   Diana resp. Bacchus) — via een gedeelde CH2_BIRTHS-scène, analoog aan hoe
   Hoofdstuk 1's drie lijnen elkaars mythen al kenden zonder dat de speler ze
   zelf hoefde te spelen. Tot lijn S bestaat, leidt L direct naar het
   gedeelde Orakel-epiloog (CH2_ORAKEL); zodra S gebouwd is, wordt CH2_BIRTHS
   ertussen gevoegd.

   BOUWSTATUS (2026-07): alleen lijn L (Latona) staat hieronder volledig
   uitgeschreven, plus de hub (CH2_000, nu met maar één klikbare keuze) en
   het gedeelde Orakel-epiloog. Lijnen S/K/H volgen in een latere bouwstap —
   zelfde aanpak als Hoofdstuk 1, dat ook in meerdere stappen is gegroeid. */
const SP_CH2_CNS = `
=== SCENE: CH2_000 ===

TITLE:
Wanneer Goden Beminnen

TEXT:
De boodschapper wijst opnieuw naar een nieuwe scheur in de werkelijkheid. "Hera," zegt ze, "kent vele gezichten. Vier stervelingen, vier verhalen, één godin die zich telkens anders toont — als achtervolger, als vervloeker, als manipulator, als onverzoenlijke vijand. Volg ze alle vier, en je zult begrijpen waarom heldendom nooit gaat over geluk hebben."

Ergens op de achtergrond, zoals wel vaker wanneer sterfelijke zaken zich ontvouwen, zie je Athena zwijgend toekijken — armen over elkaar, haar gezicht onleesbaar. Ze grijpt niet in. Nog niet.

CODEX:
codex_grammatica_ch2_praesens, codex_grammatica_ch2_imperativus, codex_grammatica_ch2_esse_posse

CHOICES:

* Volg het spoor van Latona, een titanide die Jupiters kind draagt en nergens welkom is -> CH2_L01
* Volg het lot van Semele, een prinses van Thebe die niet weet wie haar minnaar werkelijk is -> CH2_S01
* Volg Kallisto, een jachtgezellin van Artemis die niemand kan vertrouwen wat ze ziet -> CH2_K01
* Volg Herakles, Zeus' sterfelijke zoon die Hera al haat sinds voor zijn geboorte -> CH2_H01
* Spreek het Orakel aan, nu alle vier de verhalen zijn gehoord [REQUIRE:fragments=4] -> CH2_ATHENA

END

=== SCENE: CH2_L01 ===

TITLE:
Latona, Titanide en Minnares van Jupiter

TEXT:
Latona, een titanide net als haar zuster Asteria, was voor Juno nooit meer dan een naam om te wantrouwen — tot Jupiter zijn blik op haar liet vallen, en zij zwanger raakte van zijn kind. Voor Juno, koningin van de goden en bewaakster van elk huwelijksbelofte die haar man breekt, was dat een belediging die niet onbestraft kon blijven.

Ze sprak een vloek uit die eenvoudig was in haar wreedheid: geen enkel stuk vaste grond, nergens ter wereld, mocht Latona ooit een plek geven om te bevallen. Latona, hoogzwanger en doodsbang, moet nu een toevlucht vinden op een aarde die haar overal weigert.

PERSON:
latona:intro, hera:intro

CHOICES:

* Volg Latona op haar zoektocht -> CH2_L02

END

=== SCENE: CH2_L02 ===

TITLE:
Overal Geweigerd

TEXT:
Latona trekt van stad naar stad, van kust naar kust, en overal is het antwoord hetzelfde: geen enkele koning, geen enkel dorp durft het aan om Juno's woede over zich af te roepen. Deuren sluiten voor ze de kans krijgt uit te leggen wie ze is; velden die er verlaten uitzagen, blijken plots "al bezet" zodra ze te dichtbij komt.

Op een avond, uitgeput en wanhopig, bereikt ze een klein dorp aan de rand van een moeras. De inwoners zien haar zwangere buik en wenden zich meteen af — allemaal, op één oude herder na, die haar met een snelle blik naar een schuilplaats in het riet wijst voor hij zelf haastig wegloopt.

CHOICES:

* Trek weifelend verder — je weet niet goed wat je van de herder moet denken [NEUTRAL] -> CH2_L03
* Schuil dankbaar in het riet, ontroerd door zijn stille moed [CLEMENTIA] -> CH2_L02B
* Trek meteen verder — je vertrouwt niemand meer die zo snel weer verdwijnt [SEVERITAS] -> CH2_L03

END

=== SCENE: CH2_L02B ===

TITLE:
Een Stil Gebaar

TEXT:
Je blijft een nacht in het riet, beschut tegen de kou, en beseft dat zelfs in een wereld die doodsbang is voor Juno, er mensen zijn die het risico nemen om toch iets van vriendelijkheid te tonen — al is het maar door een blik, een gebaar, nooit een woord hardop. Bij zonsopgang is de herder allang verdwenen, maar Latona trekt versterkt verder.

CHOICES:

* Ga met haar mee, verder op zoek naar een echte schuilplaats -> CH2_L03

END

=== SCENE: CH2_L03 ===

TITLE:
Eindeloos Dwalen

TEXT:
Latona doolt weken lang rond, van het ene geweigerde land naar het andere, haar voeten open en haar hoop klein. Elke stad die ze nadert, elke rivier die ze oversteekt, brengt haar geen stap dichter bij rust — enkel verder van de plek waar ze ooit vandaan kwam.

PUZZLE:
puzzle_ch2l_praesens

CHOICES:

* Blijf haar volgen, ondanks alles -> CH2_L04

END

=== SCENE: CH2_L04 ===

TITLE:
De Python van Juno

TEXT:
Juno, ongeduldig geworden met de traagheid van haar eigen vloek, stuurt iets rechtstreekser: Python, een monsterlijke slang geboren uit de modder die achterbleef na de grote vloed, met de opdracht Latona op te sporen en te vernietigen voor haar kind ooit geboren kan worden.

Het beest kronkelt met een snelheid die niet bij zijn omvang past; de aarde zelf lijkt te sidderen onder zijn gewicht. Een groepje reizigers dat haar pad kruist, ziet het monster het eerst naderen.

CHOICES:

* Wacht af wat ze doen -> CH2_L05

END

=== SCENE: CH2_L05 ===

TITLE:
"Fuge!"

TEXT:
Een van de reizigers, doodsbleek, grijpt Latona bij haar arm en schreeuwt het enige woord dat er nog toe doet.

PUZZLE:
puzzle_ch2l_imperativus

CHOICES:

* Ren met haar mee -> CH2_L06

END

=== SCENE: CH2_L06 ===

TITLE:
Niemand Die Helpen Kan

TEXT:
Latona rent zo hard haar zwangere lichaam het toelaat, de python akelig dichtbij, en overal om haar heen wijken mensen simpelweg opzij — niemand die het aandurft zich tussen haar en Juno's wraak te plaatsen.

PUZZLE:
puzzle_ch2l_posse

CHOICES:

* Kijk uit naar een laatste toevlucht -> CH2_L07

END

=== SCENE: CH2_L07 ===

TITLE:
Delos, het Drijvende Eiland

TEXT:
Ver op zee, drijvend en zonder wortels, ligt een eiland dat aan geen enkel koninkrijk trouw is verschuldigd: Delos, ooit zelf een verstoten nimf die door Neptunus aan de golven werd toevertrouwd. Omdat het nergens "vast" aan de aarde verankerd ligt, valt het strikt genomen buiten Juno's vloek — geen vaste grond mag Latona ontvangen, en Delos is, letterlijk, geen vaste grond.

Latona smeekt het eiland om toevlucht, haar stem schor van uitputting en angst. Vanaf een verre rots, onzichtbaar voor iedereen behalve jou, kijkt Athena toe — haar gezicht gespannen, haar handen tot vuisten gebald, en toch grijpt ze niet in. Wat er ook gebeurt, dit is niet haar verhaal om te veranderen.

PERSON:
athena:intro

CHOICES:

* Wijs het eiland erop dat het toch al niets te verliezen heeft, rondzwervend als het is [SEVERITAS] -> CH2_L08
* Smeek het eiland gewoon om hulp, zonder overtuigingskracht te zoeken [NEUTRAL] -> CH2_L08
* Beloof het eiland eeuwige verering als het haar redt [CLEMENTIA] -> CH2_L08

END

=== SCENE: CH2_L08 ===

TITLE:
De Geboorte van Apollo en Diana

TEXT:
Delos, ontroerd — of overtuigd, het maakt weinig uit — staat stil in de golven en biedt voor het eerst in zijn bestaan een vaste plek onder Latona's voeten. Daar, tussen de rotsen van een eiland dat zelf ooit nergens bij hoorde, brengt ze twee kinderen ter wereld: eerst een dochter, Diana, die haar moeder onmiddellijk bijstaat bij de geboorte van haar broer; dan een zoon, Apollo, stralend als het licht dat zijn naam voortaan zal dragen.

Delos, dat eeuwenlang rondzwierf zonder doel, verankert zichzelf vanaf die dag voorgoed in de golven — de eerste vaste plek op aarde die vrijwillig een risico nam voor iemand die niemand anders durfde te helpen.

Terwijl Diana en Apollo hun eerste ademteugen nemen, voel je — zonder het te kunnen verklaren — dat elders, in Thebe, een ander verhaal zich op datzelfde moment ontvouwt: een ander slachtoffer van dezelfde jaloezie, een ander kind dat nog geboren moet worden.

CODEX:
codex_geboorte_apollo_diana

PERSON:
latona:full, apollo:intro, diana:intro

EERETITEL:
ch2_latona

QUEST:
quest_boodschapper_van_kronos: lijn Latona afgerond (Hoofdstuk 2)

FLAG:
ch2_lijn_latona=true

FRAGMENT:
latona

CHOICES:

* Keer terug — er wachten nog meer verhalen -> CH2_000

END

=== SCENE: CH2_S01 ===

TITLE:
Semele, Prinses van Thebe

TEXT:
Semele, dochter van koning Cadmus van Thebe en diens vrouw Harmonia, is al wekenlang 's nachts bezoek gewend van een minnaar die zijn gezicht nooit helemaal in het licht laat komen. Hij komt na zonsondergang, vertrekt voor de dageraad, en spreekt nooit over waar hij overdag is — en Semele, verliefd en nieuwsgierig tegelijk, heeft tot nu toe geen vragen gesteld die hij niet wilde beantwoorden.

Wat ze niet weet: haar mysterieuze minnaar is Jupiter zelf, opnieuw stiekem afgedwaald van zijn eigen troon en zijn eigen vrouw.

PERSON:
semele:intro

CHOICES:

* Volg Semele door de volgende nacht -> CH2_S02

END

=== SCENE: CH2_S02 ===

TITLE:
De Oude Voedster

TEXT:
Juno, zodra ze van de zwangerschap verneemt, kookt van een woede die ze deze keer met geduld in plaats van een vloek uit — ze vermomt zich als Beroë, Semele's aloude, vertrouwde voedster, en wint moeiteloos haar vertrouwen terug. Dagenlang luistert ze mee, knikt bezorgd, en laat dan, langzaam en met schijnbare tegenzin, haar twijfel vallen: "Hoe weet je eigenlijk zeker dat je minnaar is wie hij zegt te zijn, kind? Een sterveling kan net zo makkelijk liegen over goddelijkheid als een god de waarheid kan verzwijgen."

Semele, die nooit eerder aan hem getwijfeld had, voelt de vraag als een steen die niet meer weg wil.

CHOICES:

* Luister aandachtig — haar wantrouwen groeit met elk woord [SEVERITAS] -> CH2_S03
* Weet zelf niet goed wat je van haar woorden moet denken [NEUTRAL] -> CH2_S02B
* Wuif de twijfel eerst weg, uit vertrouwen in haar minnaar [CLEMENTIA] -> CH2_S02B

END

=== SCENE: CH2_S02B ===

TITLE:
Toch Twijfel

TEXT:
Ondanks haar vertrouwen blijft de vraag aan haar knagen, als een steentje in een schoen dat je jezelf wijsmaakt te kunnen negeren. Tegen middernacht, wanneer haar minnaar weer door het raam naar binnen glipt, merkt ze dat ze de woorden van haar voedster toch niet kan laten liggen.

CHOICES:

* Stel hem de vraag die ze niet meer kan inslikken -> CH2_S03

END

=== SCENE: CH2_S03 ===

TITLE:
Een Onmogelijke Eed

TEXT:
Wanneer Jupiter die nacht weer verschijnt, eist Semele — voordat ze hem vertelt wat ze werkelijk wil — dat hij zweert haar elke wens te vervullen, wat die ook is. Jupiter, verliefd en op dat moment onvoorzichtiger dan een god zou moeten zijn, zweert bij de rivier de Styx: de meest bindende eed die er bestaat, een eed die zelfs hijzelf onder geen enkele omstandigheid kan breken zonder verschrikkelijke gevolgen.

PUZZLE:
puzzle_ch2s_praesens

CHOICES:

* Wacht af wat Semele nu van hem vraagt -> CH2_S04

END

=== SCENE: CH2_S04 ===

TITLE:
De Wens

TEXT:
Nu hij onherroepelijk gebonden is, spreekt Semele eindelijk haar wens uit: ze wil hem zien zoals hij werkelijk is, in zijn volle goddelijke glorie — precies zoals hij zich aan Juno toont, zijn eigen vrouw. Geen vermomming meer, geen nachtelijke schaduw. De ware Jupiter, in het volle licht.

PUZZLE:
puzzle_ch2s_imperativus

CHOICES:

* Kijk hoe Jupiter reageert op haar eis -> CH2_S05

END

=== SCENE: CH2_S05 ===

TITLE:
Jupiters Wanhoop

TEXT:
Jupiter verbleekt — voor zover een god kan verbleken — want hij weet precies wat er zal gebeuren als hij toegeeft. Geen sterveling heeft ooit zijn ware gedaante overleefd; zelfs zijn nabijheid in volle glorie is al meer dan een mens kan verdragen. Maar de eed bij de Styx laat geen enkele ruimte voor terugtrekken, ook niet voor de koning van de goden zelf.

Vanaf een verre wolkenbank, onzichtbaar voor iedereen behalve jou, kijkt Athena toe — haar gezicht een en al gespannen stilte. Ook hier grijpt ze niet in.

PERSON:
athena:intro

CHOICES:

* Denk streng — hij had zo'n eed nooit lichtzinnig mogen zweren [SEVERITAS] -> CH2_S06
* Kijk toe, niet goed wetend wie hier eigenlijk het meeste medelijden verdient [NEUTRAL] -> CH2_S06
* Voel meelij met Jupiter, gevangen door zijn eigen onbezonnen woord [CLEMENTIA] -> CH2_S06

END

=== SCENE: CH2_S06 ===

TITLE:
Verschroeid door Glorie

TEXT:
Jupiter verschijnt in zijn volle staat: bliksem die de lucht openrijt, donder die de fundamenten van het paleis doet schudden, een licht zo verzengend dat het geen onderscheid maakt tussen liefde en vernietiging. Semele's sterfelijke lichaam kan het niet verdragen — ze wordt op slag verteerd door het vuur van zijn ware gedaante, nog voor ze heeft kunnen beseffen wat ze eigenlijk had gevraagd.

PUZZLE:
puzzle_ch2s_esse

CHOICES:

* Kijk of er nog iets van haar te redden valt -> CH2_S07

END

=== SCENE: CH2_S07 ===

TITLE:
Gered uit de As

TEXT:
Te midden van de rokende as vindt Jupiter, met een haast die niets meer met koninklijke waardigheid te maken heeft, hun ongeboren kind — nog veel te vroeg om zelfstandig te overleven. Hij snijdt een opening in zijn eigen dij en naait het kind erin, waar het de resterende maanden zal voldragen worden, verborgen voor Juno's alziende jaloezie.

Geen enkele andere geboorte in de hele mythologie zal ooit zo verlopen als deze.

CHOICES:

* Wacht de laatste maanden af -> CH2_S08

END

=== SCENE: CH2_S08 ===

TITLE:
De Geboorte van Bacchus

TEXT:
Wanneer de tijd eindelijk daar is, opent Jupiter zijn eigen dij, en wordt Bacchus geboren — de enige god die ooit tweemaal geboren werd, eerst uit een sterfelijke moeder en dan uit zijn eigen goddelijke vader. Waar Semele's nieuwsgierigheid haar het leven kostte, overleeft haar zoon dankzij de wanhopige vindingrijkheid van een vader die haar niet op tijd kon redden, maar hun kind wel.

Ergens, ver van hier, weet je dat dit dezelfde god is die je ooit — in een ander leven, op een ander moment — hebt zien helpen bij het opheffen van een vloek over gouden vingers.

CODEX:
codex_geboorte_bacchus

PERSON:
semele:full, bacchus:full

EERETITEL:
ch2_semele

QUEST:
quest_boodschapper_van_kronos: lijn Semele afgerond (Hoofdstuk 2)

FLAG:
ch2_lijn_semele=true

FRAGMENT:
semele

CHOICES:

* Keer terug — er wachten nog meer verhalen -> CH2_000

END

=== SCENE: CH2_K01 ===

TITLE:
Kallisto, Nimf van Artemis

TEXT:
Kallisto is een van Artemis' meest toegewijde jachtgezellinnen — een groep nimfen die, net als hun godin, een plechtige eed van kuisheid heeft afgelegd. Samen jagen ze door de bergen van Arcadië, vrij en ongebonden, zonder ooit een man toe te laten in hun kring.

Op een middag, ver van de rest van de groep, treft Zeus haar alleen aan terwijl ze uitrust bij een bron — en ziet meteen een kans die hij niet wil laten liggen.

PERSON:
kallisto:intro, diana:intro

CHOICES:

* Kijk toe wat Zeus van plan is -> CH2_K02

END

=== SCENE: CH2_K02 ===

TITLE:
Vermomd als Artemis

TEXT:
Zeus, die weet dat Kallisto nooit een vreemde man zou vertrouwen, neemt de gedaante aan van Artemis zelf — de enige gestalte waarvoor Kallisto haar waakzaamheid volledig laat zakken. Onder die vermomming misleidt hij haar, en pas wanneer hij weer verdwijnt, beseft ze dat er iets grondig mis is met wat ze zojuist heeft meegemaakt.

Ze vertelt het aan niemand. Wie zou haar geloven dat "Artemis" haar bedrogen heeft?

CHOICES:

* Blijf nuchter — dit is hoe goden nu eenmaal met stervelingen omgaan [SEVERITAS] -> CH2_K03
* Weet niet goed wat je van Zeus' gedrag moet vinden [NEUTRAL] -> CH2_K03
* Voel woede namens Kallisto, die niets van dit alles kon vermoeden [CLEMENTIA] -> CH2_K03

END

=== SCENE: CH2_K03 ===

TITLE:
Een Zoon, Arcas

TEXT:
Maanden gaan voorbij, en Kallisto verbergt haar zwangerschap zo lang ze kan — tot ze in het geheim bevalt van een zoon, Arcas, ergens diep in het woud, ver van de rest van de band. Even is er alleen opluchting: het kind is gezond, en niemand heeft nog iets gemerkt.

CHOICES:

* Volg haar terug naar de groep -> CH2_K04

END

=== SCENE: CH2_K04 ===

TITLE:
Ontdekt door de Band

TEXT:
Bij de volgende rituele badplaats, waar de hele groep zich ontkleedt om zich te wassen, valt het haar collega-nimfen eindelijk op wat Kallisto al maanden verbergt. Artemis, die haar eigen eed van kuisheid onverbiddelijk handhaaft — zonder de ware toedracht ooit te kennen — kijkt haar aan met een mengeling van verraden vertrouwen en koude woede.

PUZZLE:
puzzle_ch2k_imperativus

CHOICES:

* Kijk toe hoe Kallisto de groep verlaat -> CH2_K05

END

=== SCENE: CH2_K05 ===

TITLE:
Op de Vlucht

TEXT:
Alleen, verstoten uit de enige gemeenschap die ze ooit heeft gekend, en met een pasgeboren zoon om voor te zorgen, vlucht Kallisto de bergen in — weg van iedereen die haar ooit vertrouwde, weg van de plek die ooit haar thuis was.

PUZZLE:
puzzle_ch2k_praesens

CHOICES:

* Blijf haar volgen, ondanks alles -> CH2_K06

END

=== SCENE: CH2_K06 ===

TITLE:
Hera's Ontdekking

TEXT:
Hera, die van meet af aan had vermoed dat haar man weer iets had uitgespookt, spoort uiteindelijk de volledige waarheid op — en richt haar woede, zoals zo vaak, niet op Zeus, maar op de vrouw die hij misleidde en gebruikte.

CHOICES:

* Weet allang dat genade nooit Hera's stijl is geweest [SEVERITAS] -> CH2_K07
* Wacht simpelweg af wat Hera gaat doen [NEUTRAL] -> CH2_K07
* Hoop in stilte dat Hera deze ene keer genade toont [CLEMENTIA] -> CH2_K07

END

=== SCENE: CH2_K07 ===

TITLE:
Veranderd in een Berin

TEXT:
Hera verandert Kallisto in een berin — haar menselijke stem, haar gezicht, haar handen verdwijnen onder ruige vacht en klauwen, terwijl haar geest, gevangen in het lichaam van een dier dat ze nooit had willen zijn, volledig intact blijft. Ze kan niet meer spreken, niet meer huilen op een manier die iemand zou herkennen — enkel nog grommen, in een lichaam dat niet langer het hare voelt.

Vanaf een verre bergkam, onzichtbaar voor iedereen behalve jou, kijkt Athena toe. Ook nu grijpt ze niet in.

PUZZLE:
puzzle_ch2k_esse

PERSON:
athena:intro

CHOICES:

* Volg haar spoor de jaren door -> CH2_K08

END

=== SCENE: CH2_K08 ===

TITLE:
Arcas, de Jager

TEXT:
Jaren gaan voorbij. Arcas groeit op, niet wetend wie zijn moeder werkelijk was, en wordt een bekwame jager in dezelfde bergen waar zij ooit rondzwierf. Op een dag kruist zijn pad dat van een grote, oude berin — zijn eigen moeder, die hem na al die jaren nog altijd herkent, ook al kan hij haar onmogelijk herkennen.

Arcas, die enkel een gevaarlijk dier ziet, heft zijn speer.

CHOICES:

* Wacht af wat er gebeurt -> CH2_K09

END

=== SCENE: CH2_K09 ===

TITLE:
Onder de Sterren

TEXT:
Vlak voordat de speer haar kan doorboren, grijpt Zeus in — de enige keer in dit hele hoofdstuk dat hij zelf probeert recht te zetten wat zijn eigen onbezonnenheid heeft aangericht. Hij tilt moeder en zoon samen op naar de hemel en verandert hen in sterrenbeelden: Kallisto wordt de Grote Beer, Arcas de Kleine Beer, voor altijd naast elkaar aan het firmament, ver buiten Hera's bereik.

Daar, aan de nachtelijke hemel, blijft hun verhaal zichtbaar voor iedereen die ooit omhoog kijkt en de sterren leert lezen.

CODEX:
codex_metamorfose_kallisto

PERSON:
kallisto:full, diana:full

EERETITEL:
ch2_kallisto

QUEST:
quest_boodschapper_van_kronos: lijn Kallisto afgerond (Hoofdstuk 2)

FLAG:
ch2_lijn_kallisto=true

FRAGMENT:
kallisto

CHOICES:

* Keer terug — er wachten nog meer verhalen -> CH2_000

END

=== SCENE: CH2_H01 ===

TITLE:
Herakles, Zoon van Zeus

TEXT:
Herakles is de zoon van Zeus en de sterfelijke Alcmene — en Hera haatte hem al voor hij geboren werd. Toen zijn geboorte naderde, liet Zeus zich ontvallen dat een kind dat die nacht ter wereld zou komen ooit over heel Mycene zou heersen. Hera, ziedend, vertraagde Herakles' geboorte en versnelde die van zijn neef Eurystheus, zodat het geboorterecht naar hem ging in plaats van naar haar mans onwettige zoon.

Vanaf dat eerste moment staat de rest van Herakles' leven al vast: een man met de kracht van een god, gedwongen te dienen onder een neef die hij met gemak zou kunnen verpletteren — puur omdat een uur het verschil maakte.

PERSON:
herakles:intro, zeus:intro, hera:intro

CHOICES:

* Kijk naar zijn eerste dagen als baby -> CH2_H02

END

=== SCENE: CH2_H02 ===

TITLE:
De Slangen in de Wieg

TEXT:
Niet tevreden met enkel het geboorterecht te hebben afgepakt, stuurt Hera twee giftige slangen naar Herakles' wieg terwijl hij nog maar enkele maanden oud is. Zijn tweelingbroer Iphikles, gewoon sterfelijk verwekt, gilt van doodsangst zodra de slangen zich om de spijlen kronkelen.

Herakles daarentegen grijpt, zonder enig teken van angst, een slang in elke hand — en wurgt ze allebei voor iemand kan ingrijpen, lachend alsof het een spelletje betreft.

PUZZLE:
puzzle_ch2h_praesens

CHOICES:

* Kijk hoe de familie op dit voorteken reageert -> CH2_H03

END

=== SCENE: CH2_H03 ===

TITLE:
Een Voorteken

TEXT:
Het nieuws verspreidt zich snel: een baby die slangen wurgt alsof het niets is, kan onmogelijk een gewoon kind zijn. Sommigen in Thebe fluisteren vol ontzag over wat deze jongen ooit zal kunnen volbrengen; anderen worden juist stil van een angst die ze niet meteen kunnen verklaren.

CHOICES:

* Voel onbehagen — een kracht als deze trekt altijd rampspoed aan [SEVERITAS] -> CH2_H04
* Weet niet goed wat je van dit voorteken moet denken [NEUTRAL] -> CH2_H04
* Voel bewondering voor wat dit kind ooit zal worden [CLEMENTIA] -> CH2_H04

END

=== SCENE: CH2_H04 ===

TITLE:
Een Vrouw en Kinderen

TEXT:
Herakles groeit op tot een man wiens kracht geen weerga kent, en wanneer Thebe wordt belegerd, is hij het die de stad verdedigt en de aanvallers verjaagt. Als dank geeft koning Kreon hem zijn dochter Megara tot vrouw. Jaren van eenvoudig, oprecht geluk volgen: een gezin, kinderen die opgroeien, een vader die — ondanks zijn goddelijke afkomst — precies het leven leidt dat hij zich nooit had durven wensen.

Voor het eerst in zijn leven lijkt Hera's schaduw ver weg.

CHOICES:

* Blijf nog even bij dit geluk stilstaan, voor het te laat is -> CH2_H05

END

=== SCENE: CH2_H05 ===

TITLE:
Hera's Waanzin

TEXT:
Hera, die nooit vergeet en nooit vergeeft, kan dit geluk niet langer verdragen. Ze stuurt Lyssa, de geest van de razernij zelf, om Herakles' geest te grijpen — niet met een zwaard, niet met een monster, maar met iets veel wreders: zijn eigen verstand, dat plotseling niet meer te vertrouwen is.

Je voelt het onheil aankomen, onontkoombaar, lang voor Herakles zelf ook maar iets in de gaten heeft.

CHOICES:

* Weet dat dit een noodlot is dat niemand had kunnen afwenden [SEVERITAS] -> CH2_H06
* Kijk toe, verlamd door een onheil dat je niet kunt plaatsen [NEUTRAL] -> CH2_H06
* Wil wanhopig ingrijpen, wetend wat er komen gaat [CLEMENTIA] -> CH2_H06

END

=== SCENE: CH2_H06 ===

TITLE:
De Daad die Niet Ongedaan Kan Worden

TEXT:
De waanzin grijpt Herakles zo volledig dat de wereld om hem heen vervormt tot iets wat niet meer herkenbaar is — vijanden waar geen vijanden zijn, gevaar waar alleen zijn eigen gezin staat. Wat er in die verduisterde ogenblikken precies gebeurt, zal hij zich later nooit meer helder kunnen herinneren, en jij ziet het evenmin — enkel de stilte die erop volgt.

Wanneer het licht in zijn ogen terugkeert, staat Herakles alleen in een huis dat niet langer een thuis is. Megara. De kinderen. Allemaal weg, door zijn eigen hand, in een waanzin die niet de zijne was maar wel zijn daad. Het geluid dat uit hem komt wanneer het besef doordringt, is niet het geluid van een held.

CHOICES:

* Blijf bij hem, ook al is er niets meer te zeggen -> CH2_H07

END

=== SCENE: CH2_H07 ===

TITLE:
Het Orakel van Delphi

TEXT:
Verwoest door wat hij heeft aangericht, en niet in staat zichzelf te vergeven, reist Herakles naar het orakel van Delphi om te vragen hoe — of ooit — hij zich van deze schuld kan reinigen. Het antwoord dat hij krijgt is even eenvoudig als zwaar: hij moet zich onderwerpen aan zijn neef Eurystheus, koning van Mycene, en tien jaar lang volbrengen wat die hem opdraagt.

Eurystheus, die Herakles altijd al vreesde en benijdde tegelijk, aanvaardt de opdracht met nauwelijks verholen genoegen — eindelijk een excuus om de sterkste man ter wereld het onmogelijke te laten proberen.

PUZZLE:
puzzle_ch2h_imperativus

CHOICES:

* Wacht af welke eerste beproeving hem te wachten staat -> CH2_H08

END

=== SCENE: CH2_H08 ===

TITLE:
De Eerste Taak: de Nemeïsche Leeuw

TEXT:
De eerste beproeving voert Herakles naar de vallei van Nemea, waar een leeuw huist wiens huid door geen enkel wapen — geen zwaard, geen speer, geen pijl — kan worden doorboord. Jarenlang heeft het beest de omliggende dorpen geterroriseerd, en generaties jagers zijn met hun wapens tevergeefs tegen die onverwoestbare vacht gebotst.

Herakles, die inmiddels heeft geleerd dat niet elke vijand met staal te verslaan is, stapt de grot van het beest in gewapend met niet veel meer dan zijn eigen twee handen.

COMBAT:
nemeische_leeuw

CHOICES:

* Kijk hoe hij zich herstelt van het gevecht -> CH2_H09

END

=== SCENE: CH2_H09 ===

TITLE:
Ontsnapt aan de Klauwen

TEXT:
Waar geen wapen doorheen kwam, bleek Herakles' eigen kracht wél genoeg: hij wurgt de leeuw met blote handen, precies zoals hij ooit als baby twee slangen wurgde. Vanaf die dag draagt hij de onkwetsbare huid van het beest als mantel — het enige harnas dat hem ooit nodig zal zijn, en een teken voor iedereen die hem ziet aankomen dat de Nemeïsche Leeuw niet langer bestaat.

Eurystheus, die eigenlijk had verwacht dat deze eerste taak Herakles' laatste zou zijn, is zo geschokt door zijn terugkeer dat hij voortaan een grote bronzen pot laat klaarzetten om zich in te verstoppen wanneer Herakles nadert.

CHOICES:

* Vraag je af wat de volgende beproeving zal zijn -> CH2_H10

END

=== SCENE: CH2_H10 ===

TITLE:
De Tweede Taak: de Hydra van Lerna

TEXT:
De tweede beproeving is nog wreder: de Hydra van Lerna, een veelkoppig moerasmonster dat voor elke afgehakte kop er meteen twee nieuwe laat aangroeien. Een gewoon zwaard maakt het beest dus alleen maar gevaarlijker, nooit zwakker. Herakles neemt zijn neef Iolaos mee als wagenmenner en helper — en samen bedenken ze de enige oplossing die werkt: bij elke kop die Herakles afhakt, schroeit Iolaos de wond onmiddellijk dicht met een fakkel, voor er nieuwe koppen kunnen aangroeien.

PUZZLE:
puzzle_ch2h_posse

CHOICES:

* Volg hen het moeras in -> CH2_H11

END

=== SCENE: CH2_H11 ===

TITLE:
In het Moeras

TEXT:
Kop na kop valt, geschroeid voor er iets nieuws kan aangroeien, tot alleen de laatste, onsterfelijke kop overblijft — die Herakles onder een rotsblok begraaft in plaats van hem te doden, want onsterfelijk laat zich nu eenmaal niet vernietigen.

COMBAT:
hydra

CHOICES:

* Kijk hoe het gevecht wordt beoordeeld -> CH2_H12

END

=== SCENE: CH2_H12 ===

TITLE:
Tien Wordt Twaalf

TEXT:
Eurystheus, bij het horen van dit verslag, weigert de Hydra als volwaardige beproeving te erkennen — Herakles kreeg immers hulp van Iolaos, en dat was, vindt de koning, niet eerlijk gespeeld. Wat als tien beproevingen begon, dreigt daardoor uiteindelijk op twaalf uit te komen, naarmate Eurystheus ook andere taken om vergelijkbare technische redenen zal afkeuren.

Twee beproevingen liggen achter je: de leeuw, gewurgd; de Hydra, verslagen met vuur. Herakles' schuld is nog lang niet ingelost, en de rest van zijn beproevingen wachten nog ergens verderop in de tijd — maar voor het eerst sinds die verschrikkelijke dag voelt hij iets wat op vooruitgang lijkt.

CODEX:
codex_herakles_beproevingen

PERSON:
herakles:full, megara:intro

EERETITEL:
ch2_herakles_eerste_taken

QUEST:
quest_boodschapper_van_kronos: lijn Herakles — eerste twee beproevingen volbracht (Hoofdstuk 2)

FLAG:
ch2_lijn_herakles=true; herakles_taken_voltooid=2

FRAGMENT:
herakles

CHOICES:

* Keer terug — er wachten nog meer verhalen -> CH2_000

END

=== SCENE: CH2_ATHENA ===

TITLE:
De Godin Spreekt

TEXT:
Athena stapt voor het eerst dit hoofdstuk naar voren, niet langer een zwijgende getuige aan de rand van het beeld. Haar blik is grijs en kalm, als een onweer dat net is gaan liggen — en toch voel je dat wat ze nu gaat zeggen, ze al die tijd heeft zitten vormen terwijl ze toekeek.

"Je hebt vier verhalen gezien," zegt ze. "Vier keer greep Hera in. Vier keer reageerden stervelingen anders. Sommigen bezweken. Sommigen verloren alles. Eén bleef opstaan." Ze zwijgt even, alsof ze de stilte zelf laat meewegen. "Heldendom ontstaat niet wanneer het lot je gunstig gezind is, maar wanneer je weigert eraan ten onder te gaan."

Vanaf dit moment, voel je, is ze niet langer enkel een toeschouwer.

PERSON:
athena:full

EERETITEL:
ch2_athena_mentor

CHOICES:

* Laat haar woorden bezinken -> CH2_ORAKEL

END

=== SCENE: CH2_ORAKEL ===

TITLE:
Het Orakel Keert Terug

TEXT:
De lucht rond je trilt weer op de vertrouwde manier, en de stem van de Boodschapper van Kronos klinkt, warmer dan ooit. "Vier herinneringsfragmenten, vier gezichten van dezelfde jaloezie," zegt de stem. "Latona, Kallisto, Semele, Herakles — stuk voor stuk weer stevig verankerd in de herinnering, en met hen het hele verhaal van een liefde die een godin niet kon vergeven."

CODEX:
codex_grammatica_ch2_overzicht

VOCAB:
latijn_errare, latijn_fugere, latijn_posse, latijn_adiuvare, latijn_terra, latijn_nemo, latijn_amare, latijn_ostendere, latijn_ignis, latijn_potens, latijn_currere, latijn_abire, latijn_ursa, latijn_silva, latijn_necare, latijn_servire, latijn_vincere

QUEST:
quest_boodschapper_van_kronos: hoofdstuk 2 volledig voltooid

CHOICES:

* Luister verder -> CH2_EINDE

END

=== SCENE: CH2_EINDE ===

TITLE:
Het Einde van Hoofdstuk 2

TEXT:
"Hoofdstuk 3 wacht al ergens verderop," zegt de stem, "en met hem de rest van Herakles' beproevingen — zijn eerste werken heb je al gezien, maar er wachten er nog velen." De poort keert terug tot een dunne streep licht, en je neemt vier herinneringen met je mee: volharding, onschuld, waarheid, moed.

END
`.trim();
