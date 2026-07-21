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
  // Hoofdstuk 3 — twee hoofdlijnen (Io, met Argus/Mercurius en een
  // Europa-coda erin verweven, en Herakles' laatste tien werken) plus een
  // afsluitend gesprek met Athena.
  { id:"ch3_io", nm:"Bevrijder van Io", icon:"eagle", cat:"chronica", secret:true,
    ds:"Stond Io bij van vervloekte vaars tot herwonnen vrijheid in Egypte.", bonus:null },
  { id:"ch3_herakles_labores", nm:"Voltooier van de Twaalf Werken", icon:"crown", cat:"chronica", secret:true,
    ds:"Zag Herakles al zijn twaalf beproevingen tot een einde brengen.", bonus:null },
  { id:"ch3_athena_gesprek", nm:"Leerling van Athena", icon:"column", cat:"chronica", secret:true,
    ds:"Hoorde Athena's afsluitende woorden over de twee vormen van vrijheid.", bonus:null },
  // Hoofdstuk 4 — twee hoofdlijnen (Theseus in het Labyrint van Kreta, met
  // Ariadne en Daidalos/Ikaros erin verweven; en Phaëthon, die zijn afkomst
  // bewijst bij het Paleis van de Zon) plus een afsluitend gesprek met Athena.
  { id:"ch4_theseus_labyrint", nm:"Overwinnaar van het Labyrint", icon:"shield", cat:"chronica", secret:true,
    ds:"Versloeg de Minotaurus in het hart van het Labyrint van Kreta — en droeg de prijs van een vergeten belofte.", bonus:null },
  { id:"ch4_phaethon", nm:"Getuige van Phaëthons Val", icon:"torch", cat:"chronica", secret:true,
    ds:"Zag Phaëthon de zonnewagen mennen, en de aarde ternauwernood gered worden van zijn val.", bonus:null },
  { id:"ch4_athena_gesprek", nm:"Kenner van het Labyrint", icon:"column", cat:"chronica", secret:true,
    ds:"Hoorde Athena's afsluitende woorden over twee beloften die niemand meer ongedaan kon maken.", bonus:null },
  // Hoofdstuk 5 — één doorlopende tochtenlogboek-lijn i.p.v. parallelle lijnen
  // (zie Chronica.md §7.10), dus twee titels i.p.v. drie: één voor de tocht
  // zelf, één voor de duistere coda in Korinthe.
  { id:"ch5_argonauten", nm:"Gezel van de Argonauten", icon:"trident", cat:"chronica", secret:true,
    ds:"Voer mee met de Argo, van Iolcus tot Colchis, en bracht het Gulden Vlies veilig aan boord.", bonus:null },
  { id:"ch5_medea_korinthe", nm:"Getuige van Medea's Wraak", icon:"torch", cat:"chronica", secret:true,
    ds:"Zag jaren later, in Korinthe, hoe ver een verbroken belofte een mens kan drijven.", bonus:null },
  // Hoofdstuk 6 — net als Hoofdstuk 5 geen hub/lijnen maar één doorlopend
  // verhaal, ditmaal met generatiesprongen; twee titels rond de twee
  // climaxen (de Epigonen-overwinning en Pentheus' ondergang) i.p.v. een
  // titel per naam — dit hoofdstuk heeft simpelweg te veel namen voor dat.
  { id:"ch6_epigonen", nm:"Getuige van de Wraak der Epigonen", icon:"shield", cat:"chronica", secret:true,
    ds:"Zag Diomedes, tien jaar na zijn vaders dood, Thebe alsnog laten vallen.", bonus:null },
  { id:"ch6_pentheus", nm:"Getuige van Pentheus' Ondergang", icon:"owl", cat:"chronica", secret:true,
    ds:"Zag wat er gebeurt wanneer een sterveling weigert een nieuwe god te erkennen.", bonus:null },
];

/* ---- CAMPAGNEKAART — Proloog + 28 hoofdstukken (5 "Boeken"), gesynchroniseerd
   met Pallas (Grieks) en Minerva (Latijn), klas 2 t/m 6 gymnasium.

   SAMENSMELTING van twee bronnen (2026-07): de vroegere, compactere "11
   hoofdstukken + Finale"-indeling (rijker aan gameplay/personages/thema/
   illustratie-ideeën, uit een eerder gesprek) en de latere, gedetailleerdere
   "Master Campaign Map"-docx (5 Boeken, oorspronkelijk 19 hoofdstukken,
   exacte Pallas/Minerva-lesnummers, plus een S/A/B-tier mythencanon). De
   docx-structuur is leidend voor de INDELING; de rijkere velden (gameplay/
   personages/thema/illustratie) uit de oudere bron zijn overgenomen waar de
   hoofdstukken overeenkomen.

   CANON-UITBREIDING (2026-07-20 e.v., zie Chronica.md §7 voor de volledige
   redenering): de 19 hoofdstukken zijn uitgebreid naar 28, telkens omdat een
   hoofdstuk te veel Pallas-lessen of Minerva-hoofdstukken droeg voor zijn
   eigen verhaal, of omdat er een historisch gat zat tussen twee bestaande
   hoofdstukken. Ilion in Vlammen (7 Pallas-lessen) splitste in "De Appel der
   Tweedracht" / "De Wrok van Achilles" / "Ilion in Vlammen", met "Het Gulden
   Vlies" en "De Vloek van Thebe" ervoor als nieuwe hoofdstukken over de
   generatie vóór Troje. De Zoon van Troje en Mensen Achter de Mythen zijn
   samengevoegd tot twee gedeelde hoofdstukken met Odysseus/Aeneas als
   parallelle lijnen ("Vluchten uit Troje" / "Tussen Liefde en Lot"), gevolgd
   door hun eigen aparte vervolghoofdstukken ("Odysseus' Wraak" / "Het Begin
   van Rome"). De Stad van Athena (9 Pallas-lessen) en De Eeuwige Stad zijn
   ieder in tweeën gesplitst. Tussen de vroege Republiek en Caesar ontbrak de
   aanloop naar de burgeroorlogen — "De Gracchen" en "Marius en Sulla" vullen
   dat gat. `Chronica.md` is de bron van waarheid; deze array volgt daar
   1-op-1 uit.

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
    verhaal:"Tussen heden en oudheid staat een orakel van brons, ouder dan wie het zich herinnert. Wie het aanraakt, wordt meegezogen in de tijd.",
    pallas:"Les 1: De Grieken en wij", minerva:"Hoofdstuk 1: Het Latijn en de Romeinen",
    grammatica:"Grieks alfabet, taalbewustzijn, eerste Latijnse woorden",
    gameplay:"Codex Memoriae, inscripties lezen, eerste keuzes",
    personages:"Hermes/Mercurius, Orakel van Chronos",
    illustratie:"De ontdekking van het bronzen Orakel" },

  // ---- BOEK I — DE ONTWAAKTE HERINNERING (hoofdstuk 1-9) ----
  { id:"ch1", nr:1, boek:"I — De Ontwaakte Herinnering", type:"hoofdstuk", nm:"De Namen van de Wereld",
    periode:"Mythisch Griekenland",
    verhaal:"Een koning wenst dat alles wat hij aanraakt in goud verandert — en ontdekt dat namen macht hebben, en dat wie ze vergeet, alles kan verliezen.",
    pallas:"Les 2: De Griekse goden", minerva:"Hoofdstuk 2: Midas",
    grammatica:"Zelfstandig naamwoord, bijvoeglijk naamwoord (alleen groep 1/2 — dezelfde uitgangen als zn groep 1/2), lidwoord, nominativus, accusativus, vocativus",
    gameplay:"Wie handelt? Wie ondergaat? Wie wordt aangesproken?",
    personages:"Midas, Dionysus, Olympische goden",
    thema:"Een naam maakt iets herkenbaar",
    illustratie:"Midas in zijn paleis met gouden voorwerpen",
    zijverhalen:"Prometheus (S-tier); Pandora (S-tier) — al in gebruik als plotlijnen B/C naast Midas (A)" },
  { id:"ch2", nr:2, boek:"I — De Ontwaakte Herinnering", type:"hoofdstuk", nm:"De Werken van de Helden",
    periode:"Heroïsche tijd",
    verhaal:"Hera's jaloezie jaagt op iedereen die Zeus ooit heeft liefgehad. Een moeder vlucht met haar kinderen, een geliefde ontdekt te laat wie er tegenover haar staat, een jaagster verandert in haar eigen prooi — en ergens tussen hen in groeit een kind op dat ooit twaalf onmogelijke beproevingen zal moeten doorstaan.",
    pallas:"Les 3-4: Herakles en zijn werken", minerva:"Hoofdstuk 3: Latona, Apollo en Artemis",
    grammatica:"Praesens, werkwoordstammen, imperativus, esse, posse",
    gameplay:"Acties uitvoeren via werkwoorden",
    personages:"Herakles, Latona, Semele, Kallisto, Zeus/Jupiter, Hera/Juno, Apollo, Diana/Artemis, Bacchus",
    thema:"Taal beschrijft wat mensen doen — en jaloezie beschrijft wat goden doen",
    illustratie:"De geboorte van Apollo en Diana op Delos",
    zijverhalen:"Bellerophon & Chimaira (A-tier, ideale RPG-boss); Atalanta + Calydonische ever (A-tier, boss fight)" },
  { id:"ch3", nr:3, boek:"I — De Ontwaakte Herinnering", type:"hoofdstuk", nm:"Beloften van Goden en Mensen",
    periode:"Mythische wereld",
    verhaal:"Jupiter probeert een geheime liefde te verbergen voor Juno's argwanende blik — met gevolgen die niemand had zien aankomen. Ondertussen zet een bekende held zijn beproevingen onverstoorbaar voort.",
    pallas:"Les 5: Apotheose van Herakles", minerva:"Hoofdstuk 4: Jupiter en Io",
    grammatica:"Genitivus, dativus, bijstelling",
    gameplay:"Relaties begrijpen, voorwerpen koppelen aan eigenaars",
    personages:"Herakles, Zeus/Jupiter, Hera/Juno, Io, Argus Panoptes, Hermes/Mercurius, Europa",
    thema:"Taal laat zien hoe mensen verbonden zijn",
    illustratie:"Zeus en Io onder goddelijke bescherming",
    zijverhalen:"Europa (A-tier, begin van Kreta); Ganymedes (B-tier); Danaïden (B-tier)" },
  { id:"ch4", nr:4, boek:"I — De Ontwaakte Herinnering", type:"hoofdstuk", nm:"Het Labyrint van Herinneringen",
    periode:"Kreta / het Paleis van de Zon",
    verhaal:"In het donkere labyrint van Kreta wacht een monster op de held die het aandurft. Een vader belooft zijn zoon veilig thuis te komen; een uitvinder en zijn zoon ontsnappen op vleugels van was en veren; en elders dwingt een andere zoon zijn vader tot een eed waarvan geen weg terug is.",
    pallas:"Les 6-7: Theseus, Ariadne, Minotauros, terugreis", minerva:"Hoofdstuk 5: Phaëthon · Hoofdstuk 6: De Familia",
    grammatica:"Infinitivus, vocativus, imperfectum, perfectum, ablativus",
    gameplay:"Twee parallelle lijnen (Theseus/Ariadne/Minotaurus/Daidalos & Ikaros, en Phaëthon), zelfde principe als Hoofdstuk 3's Io/Herakles; Combat-bridge tegen de Minotaurus",
    personages:"Theseus, Ariadne, Minos, Daidalos, Ikaros, Aegeus, Phaëthon, Sol/Helios, Epaphus",
    thema:"Gebeurtenissen hebben een verleden en gevolg — een belofte weegt niet minder omdat ze lichtvaardig werd gegeven",
    illustratie:"Theseus in het donkere Labyrint",
    zijverhalen:"Daidalos & Ikaros (S-tier, onmisbaar — direct verbonden aan het Labyrint zelf, en verweven in de Theseus-lijn i.p.v. een aparte lijn)" },
  { id:"ch5", nr:5, boek:"I — De Ontwaakte Herinnering", type:"hoofdstuk", nm:"Het Gulden Vlies",
    periode:"Vóór de Trojaanse Oorlog — de vorige generatie",
    verhaal:"Jason verzamelt de dapperste helden van Griekenland aan boord van de Argo, op zoek naar het legendarische Gulden Vlies. Aan het einde van de tocht wacht een tovenares wier hulp een prijs heeft.",
    pallas:"— (herhaling, valt buiten de lesnummering)", minerva:"— (herhaling, valt buiten de lesnummering)",
    grammatica:"Herhaling nominativus t/m ablativus — geen nieuwe grammatica",
    gameplay:"Tochtenlogboek met vaste bemanningsleden; combat/puzzel-afwisseling zoals bij Herakles' werken",
    personages:"Jason, Medea, Peleus, Telamon, Laertes, Herakles (cameo), Orpheus (cameo), Argos (cameo, scheepsbouwer), Atalanta (cameo), Kastor & Polydeukes (cameo), Meleager (cameo), Nestor (cameo), Philoktetes (cameo), Theseus (cameo), Tydeus (cameo)",
    thema:"De generatie vóór de helden die de speler al kent",
    illustratie:"De Argo verlaat de haven, bemanning aan boord",
    zijverhalen:"Uitgebreide cameo-cast van Argonauten die later terugkeren, korte momenten i.p.v. uitgewerkte lijnen (zelfde principe als Hoofdstuk 2/3's zijpersonages): Argos (scheepsbouwer van de Argo — bewust zo gespeld i.p.v. 'Argus', om verwarring met de honderdogige bewaker Argus Panoptes uit Hoofdstuk 3 te vermijden), Atalanta (in sommige versies Argonaut, elders althans gevraagd — komt terug bij de Spelen in Hoofdstuk 14 en in het latere Calydonische-ever-vignet met Meleager), Kastor & Polydeukes (broers van Helena, relevant vanaf Hoofdstuk 7), Meleager (Argonaut — zelfde latere Calydonische-ever-vignet als Atalanta), Nestor (hier nog jong, later de stem van ervaring vóór Troje), Philoktetes (draagt hier al Herakles' boog, cruciaal voor de latere val van Troje), Theseus (de speler kent hem al uit Hoofdstuk 4 — deze tocht speelt zich af vóór zijn eigen Labyrint-avontuur, dus bewuste dramatische ironie i.p.v. foreshadowing) en Tydeus (vader van Diomedes)." },
  { id:"ch6", nr:6, boek:"I — De Ontwaakte Herinnering", type:"hoofdstuk", nm:"De Vloek van Thebe",
    periode:"Mythisch Thebe, meerdere generaties",
    verhaal:"Kadmos sticht een stad door drakentanden in de aarde te zaaien. Generaties later worstelt zijn nageslacht met een raadsel, een vloek en een erfenis die niemand vrijwillig zou kiezen.",
    pallas:"— (herhaling, valt buiten de lesnummering)", minerva:"— (herhaling, valt buiten de lesnummering)",
    grammatica:"Herhaling praesens t/m perfectum — geen nieuwe grammatica",
    gameplay:"Generatiesprongen binnen één hoofdstuk; het raadsel van de Sfinx als taalpuzzel; De Zeven tegen Thebe krijgt bewust TWEE golven, tien jaar uit elkaar — de vaders (Polyneikes/Eteokles' oorlog, waarin ook Tydeus sneuvelt) en daarna hun zonen, de Epigonen, die Thebe alsnog innemen — dezelfde generatiesprong-structuur als de rest van het hoofdstuk, nu ook binnen dit ene subverhaal",
    personages:"Kadmos, Niobe, Oedipus, Iokaste, Eteokles, Polyneikes, Antigone, Creon, Pentheus, Tydeus (cameo, terugkerend uit Hoofdstuk 5 — sneuvelt hier), Diomedes (cameo)",
    zijverhalen:"Diomedes (cameo) — zoon van Tydeus (Hoofdstuk 5), vecht tien jaar later mee bij de Epigonen om zijn vader te wreken; komt zelf later terug in de Trojaanse Oorlog-hoofdstukken",
    illustratie:"De Sfinx voor de poorten van Thebe" },
  { id:"ch7", nr:7, boek:"I — De Ontwaakte Herinnering", type:"hoofdstuk", nm:"De Appel der Tweedracht",
    periode:"Aanloop naar de Trojaanse Oorlog",
    verhaal:"Op de bruiloft van Peleus en Thetis werpt de godin van de tweedracht een gouden appel tussen de gasten — 'voor de mooiste'. Drie godinnen eisen hem op, en een sterveling moet oordelen wie gelijk heeft. Die keuze zal de wereld in vuur en vlam zetten.",
    pallas:"— (herhaling, bewust grammatica-arm)", minerva:"— (herhaling, bewust grammatica-arm)",
    grammatica:"Herhaling — bewust grammatica-arm, een adempauze (zoals Pallas Les 2/14 en Minerva H1/H13)",
    gameplay:"Geen puzzel-gate, puur verhalend hoofdstuk",
    personages:"Peleus, Thetis, Eris, Paris, Hera, Athena, Aphrodite, Leda, Tyndareos, Helena",
    illustratie:"Paris met de gouden appel, drie godinnen ervoor" },
  { id:"ch8", nr:8, boek:"I — De Ontwaakte Herinnering", type:"hoofdstuk", nm:"De Wrok van Achilles",
    periode:"Trojaanse Oorlog, tiende jaar",
    verhaal:"Voor Troje ligt het beleg al tien jaar te sudderen wanneer Achilles, de sterkste held van Griekenland, breekt met zijn eigen legeraanvoerder. Wat volgt is een wrok die het lot van de hele oorlog zal bepalen.",
    pallas:"Les 8-11: expeditie naar Troje, de wrok van Achilles, Patroklos, wraak en medelijden", minerva:"Hoofdstuk 8: Onderwijs",
    grammatica:"Imperfectum, sigmatische/thematische aoristus, znw medeklinkergroep, aanwijzende/persoonlijke voornaamwoorden",
    gameplay:"Combat-bridge (Hector); Clementia/Severitas-keuzes bij Priamus' smeekbede",
    personages:"Achilles, Chiron, Agamemnon, Patroklos, Hector, Priamus",
    illustratie:"Achilles treurt over Patroklos" },
  { id:"ch9", nr:9, boek:"I — De Ontwaakte Herinnering", type:"hoofdstuk", nm:"Ilion in Vlammen",
    periode:"Val van Troje",
    verhaal:"De strijd om Troje nadert een breekpunt. Terwijl helden onderling ruziën over eer en erfenis, bedenkt Odysseus een list die de geschiedenis zal veranderen — en jij kiest zelf aan welke kant je staat.",
    pallas:"Les 12-14: de held Ajax, de ondergang van Troje, goden en mythen in de kunst", minerva:"Hoofdstuk 7: Slavernij",
    grammatica:"Comparativus/superlativus, A.C.I., znw groep 3, congruentie",
    gameplay:"Historische keuzes, factiesysteem",
    personages:"Ajax, Odysseus, Priamus, Hecuba, Andromache, Cassandra",
    thema:"Verhalen worden doorgegeven door taal",
    vertakkingen:"Trojaans / Grieks / Neutraal",
    illustratie:"Troje brandt" },

  // ---- BOEK II — HELDEN EN KONINGEN (hoofdstuk 10-15) ----
  { id:"ch10", nr:10, boek:"II — Helden en Koningen", type:"hoofdstuk", nm:"Vluchten uit Troje",
    periode:"Direct na de val van Troje",
    verhaal:"Na de val van Troje verspreiden de overlevenden zich over zee, ieder op zoek naar een nieuw thuis. Niet iedereen zal dezelfde weg nemen — en niet iedereen komt ongeschonden aan.",
    pallas:"Les 15-16: Odysseus bij de Faiaken, de Kykloop Polyfemos", minerva:"Hoofdstuk 9: Ontstaan van de mens (Deucalion & Pyrrha, niet Prometheus — die is al gebruikt in Hoofdstuk 1)",
    grammatica:"Medium, passief, aoristus passief op -θην; Minerva: plusquamperfectum, conjunctivus in de bijzin",
    gameplay:"Twee parallelle lijnen (Odysseus/Aeneas), zelfde principe als Hoofdstuk 3's Io/Herakles",
    personages:"Kleine Ajax, Odysseus, Polyfemos, Aeneas, Anchises, Baucis, Philemon, Arachne",
    thema:"Niet iedereen die vlucht komt behouden thuis",
    illustratie:"Twee schepen op woeste zee" },
  { id:"ch11", nr:11, boek:"II — Helden en Koningen", type:"hoofdstuk", nm:"Tussen Liefde en Lot",
    periode:"Vervolg van de omzwervingen",
    verhaal:"Twee zwervers moeten afdalen naar de onderwereld zelf om hun weg te vinden — de een op zoek naar antwoorden, de ander op zoek naar zijn vader. Onderweg wacht verleiding die niet zonder gevolgen blijft.",
    pallas:"Les 17-18: de tovenares Kirke, het huis van Hades", minerva:"Hoofdstuk 10: Aeneas",
    grammatica:"Participium, genitivus absolutus; Minerva: Accusativus cum Infinitivo (A.c.I.)",
    gameplay:"Vervolg van de twee parallelle lijnen; katabasis als gedeeld motief",
    personages:"Kirke, Tiresias, Dido, Anchises",
    thema:"Verleiding en het gewicht van het verleden",
    illustratie:"De poort van de onderwereld, twee figuren die naar binnen lopen" },
  { id:"ch12", nr:12, boek:"II — Helden en Koningen", type:"hoofdstuk", nm:"Odysseus' Wraak",
    periode:"Ithaka",
    verhaal:"Na twintig jaar bereikt een zwerver eindelijk zijn eigen kust — maar zijn huis is niet meer wat hij achterliet. Niet elke thuiskomst verloopt hetzelfde.",
    pallas:"Les 19-21: op Ithaka, de wraak van Odysseus, de dood van Agamemnon", minerva:"— (Odysseus-lijn, geen Minerva-koppeling)",
    grammatica:"Betrekkelijk voornaamwoord, conjunctivus, alpha-werkwoorden",
    gameplay:"Combat-bridge (de vrijers)",
    personages:"Odysseus, Penelope, Telemachus, Agamemnon, Clytemnestra",
    illustratie:"Odysseus spant de boog" },
  { id:"ch13", nr:13, boek:"II — Helden en Koningen", type:"hoofdstuk", nm:"Het Begin van Rome",
    periode:"Stichting van Rome",
    verhaal:"Twee broers, als baby's achtergelaten en opgevoed door een wolvin, stichten samen een nieuwe stad aan de oevers van de Tiber.",
    pallas:"— (Aeneas-lijn, geen Pallas-koppeling)", minerva:"Hoofdstuk 11: Het begin van Rome · H12: Tirannen en vrienden",
    grammatica:"Passief, participium perfectum passief (ppp), deponentia, betrekkelijk voornaamwoord",
    gameplay:"Stad-bouw-keuzes",
    personages:"Romulus, Remus, de Sabijnse vrouwen",
    illustratie:"Romulus trekt de eerste voren van de stadsmuur" },
  { id:"ch14", nr:14, boek:"II — Helden en Koningen", type:"hoofdstuk", nm:"De Stad van Athena",
    periode:"Klassiek Athene",
    verhaal:"In de stad die haar naam draagt, draait alles om overtuigen: met woorden, met wetten, met wedstrijden. Athena zelf is er nooit ver weg — en herinnert zich de helden die ze ooit een handje hielp.",
    pallas:"Les 22-27: Athena en haar stad, de Atheense democratie, de vrouw, de slavernij, onderwijs en sport, de Olympische Spelen", minerva:"Hoofdstuk 16: Dieren in het dagelijks leven",
    grammatica:"Futurum, optativus, mi-werkwoorden, stamaoristus, Nominativus cum Infinitivo (N.C.I.)",
    gameplay:"Retorica/debat; Atalanta's hardloopwedstrijd als minigame",
    personages:"Athena, Perseus (verteld), Bellerophon (verteld), Atalanta",
    thema:"Taal overtuigt mensen",
    illustratie:"De Agora van Athene",
    zijverhalen:"Calydonische ever & Meleager (A-tier) — samen met Atalanta één vault-vignet" },
  { id:"ch15", nr:15, boek:"II — Helden en Koningen", type:"hoofdstuk", nm:"Oorlog en Overwinning",
    periode:"Perzische Oorlogen / Romeinse expansie",
    verhaal:"Een handjevol Grieken houdt stand tegen een overmacht bij een nauwe bergpas, terwijl in het westen een generaal met olifanten een onmogelijke tocht over de Alpen waagt.",
    pallas:"Les 28: De Perzische Oorlogen", minerva:"Hoofdstuk 17: Hannibal over de Alpen · H18: Hannibal verslagen",
    grammatica:"Perfectum, futurum, futurum exactum, ablativus absolutus",
    gameplay:"Strategie en militaire keuzes",
    personages:"Leonidas, Themistocles, Hannibal",
    illustratie:"Slagveld met Grieken en Perzen",
    zijverhalen:"Regulus, Cato (⭐⭐⭐) — Punische-Oorlogen-deugdverhalen" },

  // ---- BOEK III — DE WERELD VAN MENSEN (hoofdstuk 16-18) ----
  { id:"ch16", nr:16, boek:"III — De Wereld van Mensen", type:"hoofdstuk", nm:"De Vader van de Geschiedenis",
    periode:"5e eeuw v.Chr.",
    verhaal:"Niet elk verhaal dat verteld wordt is waar, en niet elke bron is te vertrouwen. Herodotos trekt de wereld rond om getuigenissen te verzamelen — en vraagt zich bij elke af: wie heeft er eigenlijk gelijk?",
    pallas:"Overgang naar historiografie (Herodotos)", minerva:"Hoofdstuk 21: De Romeinen en de dood",
    grammatica:"Historische taal, bronanalyse; Minerva: conjunctivus praesens en perfectum",
    gameplay:"Bronnen vergelijken, verschillende versies van hetzelfde verhaal ontdekken (Herodotos se rol uit de Character Bible)",
    personages:"Herodotos, Xenofon",
    thema:"Niet alles wat verteld wordt is automatisch waar",
    illustratie:"Herodotos die getuigenissen verzamelt op de agora" },
  { id:"ch17", nr:17, boek:"III — De Wereld van Mensen", type:"hoofdstuk", nm:"De Stem van de Filosofen",
    periode:"Klassiek Athene",
    verhaal:"Op de Agora van Athene stelt een man voortdurend vragen — nooit antwoorden. Zijn manier van denken zal de wereld voor altijd veranderen.",
    pallas:"Filosofen: Socrates, Plato, Aristoteles", minerva:"Hoofdstuk 22: Caesars carrière",
    grammatica:"Complexe zinsbouw, argumentatie; Minerva: gerundium, genitivus subjectivus/objectivus",
    gameplay:"Socratische dialoog — vragen stellen i.p.v. antwoorden geven (Athena se rol uit de Character Bible)",
    personages:"Socrates, Plato, Aristoteles",
    illustratie:"Socrates in gesprek op de Agora, omringd door leerlingen" },
  { id:"ch18", nr:18, boek:"III — De Wereld van Mensen", type:"hoofdstuk", nm:"Alexander en de Grenzen van de Wereld",
    periode:"Hellenistische Tijd",
    verhaal:"Een jonge koning trekt met zijn leger verder dan wie ook vóór hem — en neemt zijn taal en cultuur mee tot in de verste uithoeken van de bekende wereld.",
    pallas:"Alexander de Grote", minerva:"Hoofdstuk 23: Caesar in België en Nederland",
    grammatica:"Complexe werkwoorden, participia; Minerva: gerundivum",
    gameplay:"Taalverspreiding volgen over een groeiende kaart",
    personages:"Alexander de Grote, Philippus II",
    illustratie:"Alexander bij de Gordiaanse Knoop" },

  // ---- BOEK IV — ROME VERRIJST (hoofdstuk 19-25) ----
  { id:"ch19", nr:19, boek:"IV — Rome Verrijst", type:"hoofdstuk", nm:"Onder de Koningen",
    periode:"Koninkrijk Rome, latere koningen",
    verhaal:"Rome staat nog onder koningen, en niet allemaal regeren ze even rechtvaardig. Een tweekamp tussen naburige steden en een daad van onrecht binnen de eigen muren zetten iets in beweging dat niemand meer kan stoppen.",
    pallas:"—", minerva:"Hoofdstuk 24: Augustus en Nero (conjunctivus-gedeelte)",
    grammatica:"Verdieping naamvallen; Minerva: conjunctivus",
    gameplay:"Legendes van vroege Romeinse deugd/moed naspelen",
    personages:"Tullus Hostilius, de Horatii, de Curiatii, Tarquinius Superbus, Lucretia, Brutus",
    illustratie:"Lucretia en Brutus voor het volk van Rome" },
  { id:"ch20", nr:20, boek:"IV — Rome Verrijst", type:"hoofdstuk", nm:"Verdedigers van de Republiek",
    periode:"Vroege Republiek",
    verhaal:"Een verjaagde koning wil zijn troon terug en brengt een vreemd leger naar de poorten van Rome. Wat er dan gebeurt, wordt eeuwenlang naverteld als het toonbeeld van Romeinse moed.",
    pallas:"—", minerva:"Hoofdstuk 24: Augustus en Nero (N.C.I./semi-deponentia-gedeelte)",
    grammatica:"Verdieping naamvallen; Minerva: N.C.I., semi-deponentia",
    gameplay:"Legendes van vroege Romeinse deugd/moed naspelen",
    personages:"Horatius Cocles, Mucius Scaevola, Cloelia, Cincinnatus, Coriolanus, Camillus",
    illustratie:"Horatius Cocles alleen op de brug" },
  { id:"ch21", nr:21, boek:"IV — Rome Verrijst", type:"hoofdstuk", nm:"De Gracchen",
    periode:"Late Republiek, 133-121 v.Chr.",
    verhaal:"Een jonge volkstribuun wil het land eerlijker verdelen tussen arm en rijk — en ontdekt hoe gevaarlijk het is om de macht van de senaat uit te dagen.",
    pallas:"—", minerva:"— (herhaling, valt buiten de lesnummering)",
    grammatica:"Herhaling — bewust grammatica-arm",
    gameplay:"Politieke keuzes: hervormen versus de status quo bewaren",
    personages:"Tiberius Gracchus, Gaius Gracchus, Cornelia",
    illustratie:"Tiberius Gracchus voor de senaat" },
  { id:"ch22", nr:22, boek:"IV — Rome Verrijst", type:"hoofdstuk", nm:"Marius en Sulla",
    periode:"Late Republiek, ca. 107-78 v.Chr.",
    verhaal:"Twee machtige generaals, ooit bondgenoten, raken verwikkeld in een rivaliteit die de Republiek tot in haar fundamenten zal schudden.",
    pallas:"—", minerva:"— (herhaling, valt buiten de lesnummering)",
    grammatica:"Herhaling — bewust grammatica-arm",
    gameplay:"Militaire/politieke strategie-keuzes",
    personages:"Gaius Marius, Lucius Cornelius Sulla",
    illustratie:"Sulla's legioenen bij de poorten van Rome" },
  { id:"ch23", nr:23, boek:"IV — Rome Verrijst", type:"hoofdstuk", nm:"Caesar Schrijft Geschiedenis",
    periode:"Late Republiek",
    verhaal:"Caesar schrijft zijn eigen verslag van zijn veldtochten — en ontdekt dat wie de pen vasthoudt, ook de geschiedenis vormgeeft.",
    pallas:"Verdieping", minerva:"Hoofdstuk 22-23: Caesar",
    grammatica:"Gerundium, gerundivum (herhaling)",
    gameplay:"Bronnen analyseren",
    personages:"Caesar",
    illustratie:"Caesar schrijft zijn Commentarii",
    zijverhalen:"Spartacus (⭐⭐⭐⭐⭐); Cicero (⭐⭐⭐⭐)" },
  { id:"ch24", nr:24, boek:"IV — Rome Verrijst", type:"hoofdstuk", nm:"Augustus en de Pax Romana",
    periode:"Vroege Keizertijd",
    verhaal:"Onder Augustus keert de vrede terug naar Rome — en een dichter genaamd Vergilius begint aan een episch gedicht dat Rome's oorsprong voor altijd zal verbinden met de val van Troje.",
    pallas:"Verdieping", minerva:"Hoofdstuk 24: Augustus",
    grammatica:"Literair Latijn",
    personages:"Augustus, Vergilius",
    illustratie:"Augustus bij de Ara Pacis",
    zijverhalen:"Eros & Psyche, Pygmalion (A-tier) — verteld als verhaal-in-een-verhaal door een dichter" },
  { id:"ch25", nr:25, boek:"IV — Rome Verrijst", type:"hoofdstuk", nm:"Keizers en Dichters",
    periode:"Romeinse Keizertijd",
    verhaal:"Een keizer, berucht om zijn wreedheid, en een dichter, berucht om zijn gedurfde verzen — hun woorden en daden bepalen hoe het nageslacht naar Rome zal kijken.",
    pallas:"Verdieping", minerva:"Hoofdstuk 25: Latijnse literatuur",
    grammatica:"Verdieping naamvallen",
    personages:"Nero, Ovidius",
    illustratie:"Nero en het Colosseum" },

  // ---- BOEK V — DE LAATSTE HERINNERING (hoofdstuk 26-28, finale) ----
  { id:"ch26", nr:26, boek:"V — De Laatste Herinnering", type:"hoofdstuk", nm:"De Bibliotheek van Mnemosyne",
    periode:"Buiten Tijd en Ruimte",
    verhaal:"In een bibliotheek buiten tijd en ruimte bewaart de godin van het geheugen elk verhaal dat ooit verteld is — ook de fragmenten die nergens anders een plek vonden.",
    pallas:"Eigen content", minerva:"Eigen content",
    grammatica:"Herhaling van alle grammatica",
    personages:"Mnemosyne",
    zijverhalen:"Narcissus & Echo (A-tier) als spiegel-/geluidspuzzel; eerste hints van De Titanenstrijd (S-tier), die in de Finale terugkeert" },
  { id:"ch27", nr:27, boek:"V — De Laatste Herinnering", type:"hoofdstuk", nm:"De Rivier Lethe",
    periode:"Mythologische Eindwereld",
    verhaal:"Aan de oevers van een rivier die alle herinnering wist, wordt duidelijk hoe kostbaar het is om je iets te blijven herinneren.",
    pallas:"Eigen content", minerva:"Eigen content",
    grammatica:"Integratie Grieks & Latijn",
    personages:"Lethe",
    zijverhalen:"Orpheus & Eurydice (S-tier — Orpheus verschijnt zo twee keer, jong in Hoofdstuk 5, gebroken hier) & Persephone/Demeter (A-tier) — beide onderwereld-terugkeerverhalen" },
  { id:"finale", nr:28, boek:"V — De Laatste Herinnering", type:"finale", nm:"Chronica Classica",
    periode:"Tijdloos",
    thema:"De strijd tegen de Vergetelheid",
    verhaal:"Alles wat je onderweg hebt geleerd komt hier samen. Aan het einde van de reis wacht het orakel zelf — en een waarheid die alles in een ander licht zet.",
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
   alle drie panelen zijn getekend. Referentie voor de kustlijnen/liggingen:
   twee CC-gelicenseerde kaarten (Aeneas- en Odysseus-reis) zijn als
   geografisch naslagwerk gebruikt, niet overgenomen — geen attributieplicht,
   want geen bewerking van hun bestand.

   Een locatie verschijnt pas als `unlockCodex` al in SP_STATE.codex zit —
   hergebruikt bewust de bestaande codex-hook (geen nieuw trackingsysteem).
   BELANGRIJK: dit is PER SAVEGAME, niet per hoofdstuk-metadata. De
   canon-uitbreiding (2026-07, zie Chronica.md §7) voegde 9 nieuwe hoofdstukken
   toe (Het Gulden Vlies t/m Marius en Sulla e.a.), maar geen daarvan heeft al
   geschreven scènes — dus ook nog geen `CODEX:`-secties om een pin aan te
   koppelen. Nieuwe `SP_MAP_LOCATIONS`-entries (Troje, Kolchis, Thebe, Sparta,
   Korinthe, Ithaka, Carthago, ...) horen er pas bij zodra het bijbehorende
   hoofdstuk daadwerkelijk geschreven is en een echte codex-id oplevert —
   anders is de pin dode data die nooit oplicht.
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
  aegean: { nm:"Italië en Griekenland — Egeïsche Zee, Troje & West-Klein-Azië", img:"panel1_aegean.png" },
  eastern: { nm:"Het Oosten — Kaukasus, Kolchis, Perzië, Egypte & de rand van India", img:"panel3_eastern.png" },
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

/* ---- CLEMENTIA/SEVERITAS-AANSPREKING — vanaf Hoofdstuk 3 mogen NPC's de
   speler aanspreken naar aanleiding van de stil opgebouwde Clementia/
   Severitas-houding (zie spApproachTendency, singleplayer.js). %NOUN% wordt
   vervangen door het gender-passende zelfstandig naamwoord (SP_TENDENCY_NOUN)
   voor gebruik via {tendency_address}/{tendency_address_cap} in TEXT/DIALOGUE
   (SpTextResolver). Bewust meerdere varianten per houding — en géén "wiens"/
   "wier" in de neutrale zinnen, want die zijn niet gender-neutraal genoeg. */
const SP_TENDENCY_NOUN = { man:"man", vrouw:"vrouw", nonbinair:"persoon" };
const SP_TENDENCY_PHRASES = {
  clementia: [
    "%NOUN% met een vriendelijke reputatie",
    "zachtmoedige %NOUN%",
    "%NOUN% bekend om een zachte hand",
    "%NOUN% die eerder troost dan straft, naar men zegt",
  ],
  severitas: [
    "strenge %NOUN%",
    "%NOUN% met een onverbiddelijke reputatie",
    "%NOUN% die geen moment aarzelt, naar men zegt",
    "%NOUN% bekend om een harde hand",
  ],
  neutraal: [
    "%NOUN% van wie de reputatie nog alle kanten op kan",
    "%NOUN% die zich nog niet heeft laten kennen",
    "onvoorspelbare %NOUN%",
    "%NOUN% van wie de daden tot nu toe geen duidelijke kant hebben gekozen",
  ],
};

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

  // ---- Hoofdstuk 3, Lijn Io (met Argus/Mercurius) ----
  puzzle_ch3io_genitivus: { type:"multiple-choice",
    vraag:"Io is voortaan serva ___ — welke vorm van Iuno (koningin der goden) past hier, genitivus enkelvoud?",
    opties:["Iunonis","Iunoni","Iunonem","Iuno"], antwoord:"Iunonis",
    hint:"Genitivus enkelvoud van een derde-declinatie naam als Iuno, Iunonis eindigt op -is." },
  puzzle_ch3io_dativus: { type:"multiple-choice",
    vraag:"“Iuppiter ___ nubem dat” — Jupiter geeft Io een wolk. Welke vorm van Io past hier, dativus enkelvoud?",
    opties:["Io","Ionis","Ioni","Ionem"], antwoord:"Ioni",
    hint:"De dativus (meewerkend voorwerp — 'aan wie?') van dit soort namen eindigt vaak op -i." },
  puzzle_ch3io_bijstelling: { type:"multiple-choice",
    vraag:"“Mercurius, ___ deorum, Argum in somnum canit” — Mercurius, bode der goden, zingt Argus in slaap. Welke vorm van nuntius past hier?",
    opties:["nuntius","nuntii","nuntio","nuntium"], antwoord:"nuntius",
    hint:"Een bijstelling staat in dezelfde naamval als het woord waar hij bij hoort — Mercurius staat in de nominativus, dus ook nuntius." },

  // ---- Hoofdstuk 3, Lijn Herakles (resterende tien werken) ----
  puzzle_ch3h_genitivus: { type:"multiple-choice",
    vraag:"De Cerynitische Hinde is cerva ___ — welke vorm van Diana past hier, genitivus enkelvoud?",
    opties:["Dianae","Dianam","Diana","Dianas"], antwoord:"Dianae",
    hint:"Genitivus enkelvoud van een eerste-declinatie naam op -a eindigt op -ae." },
  puzzle_ch3h_dativus: { type:"multiple-choice",
    vraag:"“Hercules ___ partem promittit” — Hercules belooft de koning een deel. Welke vorm van rex past hier, dativus enkelvoud?",
    opties:["regi","regis","regem","rex"], antwoord:"regi",
    hint:"Dativus enkelvoud van rex, regis (derde declinatie) is regi." },
  puzzle_ch3h_bijstelling: { type:"multiple-choice",
    vraag:"“Minerva, ___ sapientiae, Herculi crotala dat” — Minerva, godin van de wijsheid, geeft Hercules een ratel. Welke vorm van dea past hier?",
    opties:["dea","deae","deam","dearum"], antwoord:"dea",
    hint:"De bijstelling staat in dezelfde naamval als Minerva — nominativus, dus ook dea." },
  puzzle_ch3h_bijstelling2: { type:"multiple-choice",
    vraag:"“Atlas, ___ caelifer, caelum umeris tenet” — Atlas, de hemeldragende titaan, draagt de hemel op zijn schouders. Welke vorm van titan past hier?",
    opties:["titan","titanis","titani","titanem"], antwoord:"titan",
    hint:"Ook hier staat de bijstelling in dezelfde naamval als Atlas — nominativus." },
  puzzle_ch3h_dativus2: { type:"multiple-choice",
    vraag:"Boven het open water, waar de vogels zich nergens meer kunnen verschuilen, schiet Hercules zijn pijlen af. “Hercules ___ sagittas mittit” — welke vorm van avis (vogel) past hier, dativus meervoud?",
    opties:["avibus","avium","aves","avis"], antwoord:"avibus",
    hint:"Dativus meervoud van een derde-declinatie woord als avis, avis eindigt op -ibus." },
  puzzle_ch3h_genitivus2: { type:"multiple-choice",
    vraag:"Ladon bewaakt de boom met de gouden appels van de Hesperiden dag en nacht. “Ladon arborem ___ custodit” — welke vorm van aurum (goud) past hier, genitivus enkelvoud?",
    opties:["auri","auro","aurum","aure"], antwoord:"auri",
    hint:"Genitivus enkelvoud van een tweede-declinatie onzijdig woord als aurum, auri eindigt op -i." },

  // ---- Hoofdstuk 4, Lijn Theseus (Ariadne, Minotaurus, Daidalos & Ikaros) ----
  puzzle_ch4t_infinitivus: { type:"multiple-choice",
    vraag:"“Aegeus Theseum vela mutare iubet” — Aegeus draagt Theseus op de zeilen te verwisselen. Welk woord is de infinitivus?",
    opties:["Aegeus","Theseum","vela","mutare"], antwoord:"mutare",
    hint:"De infinitivus is de 'woordenboekvorm' van een werkwoord, hier 'mutare' — (te) veranderen." },
  puzzle_ch4t_vocativus: { type:"multiple-choice",
    vraag:"Daidalos ziet zijn zoon te hoog vliegen en roept wanhopig zijn naam. Wat roept hij?",
    opties:["Icarus!","Icare!","Icarum!","Icari!"], antwoord:"Icare!",
    hint:"Net als Bacchus -> Bacche wordt Icarus in de vocativus Icare." },
  puzzle_ch4t_ablativus: { type:"multiple-choice",
    vraag:"“Theseus ___ labyrinthum relinquit” — Theseus verlaat het labyrint met behulp van de draad. Welke vorm van filum (draad) past hier, ablativus enkelvoud?",
    opties:["filum","fili","filo","filis"], antwoord:"filo",
    hint:"De ablativus van middel ('waarmee?') van een tweede-declinatie onzijdig woord als filum, fili eindigt op -o." },

  // ---- Hoofdstuk 4, Lijn Phaëthon ----
  puzzle_ch4p_imperfectum: { type:"multiple-choice",
    vraag:"“Sol filium diu ___” — Sol bleef zijn zoon lange tijd waarschuwen. Welke vorm van monere (waarschuwen) past hier, imperfectum 3e persoon enkelvoud?",
    opties:["monet","monebat","monuit","monebit"], antwoord:"monebat",
    hint:"De imperfectum beschrijft een handeling die duurde of zich herhaalde — 'hij bleef waarschuwen', niet 'hij waarschuwde één keer'." },
  puzzle_ch4p_perfectum: { type:"multiple-choice",
    vraag:"“Iuppiter fulmen ___” — Jupiter wierp de bliksem. Welke vorm van mittere (sturen, werpen) past hier, perfectum 3e persoon enkelvoud?",
    opties:["mittit","mittebat","misit","mittet"], antwoord:"misit",
    hint:"De perfectum beschrijft een voltooide, eenmalige handeling in het verleden — 'hij wierp', één keer, klaar." },

  // ---- Hoofdstuk 5 — Het Gulden Vlies (herhaling nom. t/m abl., geen
  // nieuwe grammatica — zie SP_CAMPAIGN ch5.grammatica). Vijf puzzels, één
  // per naamval, bewust verspreid over vier verschillende puzzeltypes
  // (inclusief het nieuwe "tile-swap") in plaats van oplopende moeilijkheid,
  // want dit hoofdstuk bouwt geen nieuwe stof op — zie Chronica.md §7.10.
  puzzle_ch5_nominativus: { type:"multiple-choice",
    vraag:"Bij het afvaren wijst de stuurman iedereen zijn plaats. “Iason navem regit” — Jason stuurt het schip. Welk woord is de nominativus, het onderwerp?",
    opties:["Iason","navem","regit"], antwoord:"Iason",
    hint:"De nominativus voert de handeling uit — wie stuurt hier?" },
  puzzle_ch5_accusativus: { type:"typed-latin",
    vraag:"“Atalanta aprum prima vulnerat” — Atalanta verwondt als eerste het everzwijn. Typ het Latijnse woord dat de accusativus is, het lijdend voorwerp.",
    antwoord:"aprum",
    hint:"De accusativus ondergaat de handeling — wat wordt er verwond?" },
  puzzle_ch5_genitivus: { type:"multiple-choice",
    vraag:"“Amycus, rex ___, omnes peregrinos ad pugnam vocat” — Amycus, koning van het volk, daagt elke vreemdeling uit tot een gevecht. Welke vorm van populus (volk) past hier, genitivus enkelvoud?",
    opties:["populi","populo","populum","populus"], antwoord:"populi",
    hint:"Genitivus enkelvoud van een tweede-declinatie woord als populus, populi eindigt op -i." },
  puzzle_ch5_dativus: { type:"typed-greek",
    vraag:"Philoktetes wijdt zijn pijl toe aan de godin van de jacht. Typ met het Griekse toetsenbord de dativus enkelvoud van θεά (godin) — 'aan de godin'.",
    antwoord:"θεᾳ",
    hint:"De dativus enkelvoud van een eerste-declinatie woord als θεά krijgt een iota subscriptum: θεᾳ." },
  puzzle_ch5_ablativus: { type:"tile-swap",
    vraag:"Argos verstevigt de romp vlak voor de doorvaart. “Argus navem ___ firmat” — Argos verstevigt het schip met de hamer. Zet de tegels in de juiste volgorde voor de ablativus (het middel) van malleus (hamer).",
    tiles:["m","a","l","l","e","o"],
    hint:"De ablativus van middel ('waarmee?') van een tweede-declinatie woord als malleus, mallei eindigt op -o." },

  // ---- Hoofdstuk 6 — De Vloek van Thebe (herhaling praesens t/m perfectum,
  // geen nieuwe grammatica — zie SP_CAMPAIGN ch6.grammatica). Zes puzzels,
  // verdeeld over vier types incl. het nieuwe "matching" — zie Chronica.md
  // §7.11. Bewust GEEN naamval-puzzels dit hoofdstuk (dat was Hoofdstuk 5) —
  // dit hoofdstuk herhaalt werkwoordstijden, geen naamvallen.
  puzzle_ch6_praesens: { type:"multiple-choice",
    vraag:"“Niobe multos liberos ___” — Niobe heeft veel kinderen, meer dan Latona zelf, schept ze op. Welke vorm van habere (hebben) past hier, praesens 3e persoon enkelvoud?",
    opties:["habet","habent","habes","habetis"], antwoord:"habet",
    hint:"Praesens 3e persoon enkelvoud van een tweede-conjugatiewerkwoord (op -ēre) eindigt op -et." },
  puzzle_ch6_sfinx: { type:"multiple-choice",
    vraag:"De Sfinx stelt haar raadsel: wat loopt 's ochtends op vier poten, 's middags op twee, en 's avonds op drie? “___ mane quadrupes, meridie bipes, vespere tripes ambulat” — welk woord vult de zin aan?",
    opties:["homo","canis","avis","deus"], antwoord:"homo",
    hint:"Het antwoord op het raadsel is de mens zelf — als baby kruipt hij (vier), als volwassene loopt hij (twee), op zijn oude dag steunt hij op een stok (de 'derde poot')." },
  puzzle_ch6_imperfectum: { type:"multiple-choice",
    vraag:"Elk jaar zou de troon wisselen — maar toen het zover was, weigerde Eteokles telkens weer. “Eteocles regnum fratri tradere ___” — Eteokles bleef weigeren de troon aan zijn broer over te dragen. Welke vorm van recusare (weigeren) past hier, imperfectum 3e persoon enkelvoud?",
    opties:["recusabat","recusavit","recusat","recusabit"], antwoord:"recusabat",
    hint:"De imperfectum beschrijft een handeling die duurde of zich herhaalde — 'hij bleef weigeren', niet 'hij weigerde één keer'." },
  puzzle_ch6_matching_tempora: { type:"matching",
    vraag:"Koppel elke praesensvorm aan zijn perfectumvorm — dezelfde werkwoorden die je al kent uit eerdere hoofdstukken.",
    pairs:[
      { left:"vincit",  right:"vicit"    },
      { left:"mittit",  right:"misit"    },
      { left:"cadit",   right:"cecidit"  },
      { left:"regit",   right:"rexit"    },
    ],
    hint:"Kijk goed — niet elke perfectumstam lijkt op de praesensstam." },
  puzzle_ch6_perfectum: { type:"typed-latin",
    vraag:"“Antigone fratrem contra Creontis edictum ___” — Antigone begroef haar broer, tegen Creons bevel in. Typ de perfectumvorm van sepelire (begraven), 3e persoon enkelvoud.",
    antwoord:"sepelivit",
    hint:"Perfectum van een vierde-conjugatiewerkwoord als sepelire krijgt vaak de uitgang -ivit." },
  puzzle_ch6_vocativus_grieks: { type:"typed-greek",
    vraag:"Pentheus roept, vol ongeloof, de naam van de vreemde god die zijn stad in extase heeft gebracht. Typ met het Griekse toetsenbord de vocativus van Βάκχος (Bacchus).",
    antwoord:"Βάκχε",
    hint:"Net als Bacchus → Bacche in het Latijn (Hoofdstuk 1), wordt Βάκχος in de vocativus Βάκχε." },
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

  // LET OP: dezelfde "vroeg ontgrendelen"-regel als Hoofdstuk 1/2 — deze drie
  // entries worden al bij CH3_000 gezet, vóór de eerste puzzel.
  codex_grammatica_ch3_genitivus: { cat:"grammatica", titel:"Grammatica: de genitivus",
    tekst:"De genitivus laat bezit of een 'van'-relatie zien: 'Iunonis' is 'van Juno', 'van wie Juno de eigenaar is'. Elk zelfstandig naamwoord heeft een eigen genitivus-uitgang, afhankelijk van de declinatie (naamvalgroep) — je herkent de declinatie van een woord juist aan zijn genitivus enkelvoud, wat in een woordenboek dan ook altijd meteen naast de nominativus staat vermeld.",
    table:{ headers:["Declinatie","Voorbeeld","Nominativus","Genitivus enkelvoud"],
      rows:[["1e (op -a)","Diana","Diana","Dianae"],
            ["3e (medeklinker)","Iuno","Iuno","Iunonis"],
            ["3e (medeklinker)","rex","rex","regis"]] } },
  codex_grammatica_ch3_dativus: { cat:"grammatica", titel:"Grammatica: de dativus",
    tekst:"De dativus is de naamval van het meewerkend voorwerp: aan wie of voor wie iets gebeurt. 'Iuppiter Ioni nubem dat' — Jupiter geeft AAN Io een wolk: Ioni staat in de dativus. Net als bij de genitivus hangt de exacte uitgang af van de declinatie van het woord.",
    table:{ headers:["Declinatie","Voorbeeld","Nominativus","Dativus enkelvoud"],
      rows:[["2e (op -us)","Io (als -o-stam behandeld)","Io","Ioni"],
            ["3e (medeklinker)","rex","rex","regi"]] } },
  codex_grammatica_ch3_bijstelling: { cat:"grammatica", titel:"Grammatica: de bijstelling",
    tekst:"Een bijstelling (appositie) is een extra woord of woordgroep die een zelfstandig naamwoord nader omschrijft, zonder er grammaticaal een aparte zin van te maken — bijvoorbeeld 'Mercurius, nuntius deorum' ('Mercurius, bode der goden'). De gouden regel: een bijstelling staat ALTIJD in dezelfde naamval als het woord waar hij bij hoort. Staat Mercurius in de nominativus, dan staat nuntius ook in de nominativus, ook al verandert de rest van de zin.",
    table:{ headers:["Zin","Naamwoord","Bijstelling","Naamval (allebei)"],
      rows:[["Mercurius, nuntius deorum, canit.","Mercurius","nuntius","Nominativus"],
            ["Minerva, dea sapientiae, dat.","Minerva","dea","Nominativus"],
            ["Atlas, titan caelifer, tenet.","Atlas","titan","Nominativus"]] } },
  codex_grammatica_ch3_overzicht: { cat:"grammatica", titel:"Grammatica: Hoofdstuk 3 samengevat",
    tekst:"Dit hoofdstuk draaide om relaties tussen woorden: de genitivus (bezit, een 'van'-relatie, bv. Iunonis — van Juno), de dativus (het meewerkend voorwerp, aan/voor wie iets gebeurt, bv. Ioni — aan Io), en de bijstelling (een omschrijving die altijd in dezelfde naamval staat als het woord dat ze nader verklaart, bv. Mercurius, nuntius deorum). Samen laten ze zien hoe het Latijn niet alleen wie handelt en wie ondergaat kan uitdrukken, maar ook hoe woorden onderling met elkaar verbonden zijn." },

  codex_io_argus: { cat:"mythologie", titel:"Io, Argus Panoptes en de Ogen van de Pauw",
    tekst:"Io, priesteres van Juno, werd door Jupiter in een witte vaars veranderd om een affaire te verbergen — een list die averechts werkte toen Juno haar alsnog opeiste en de honderdogige Argus Panoptes als wachter aanstelde. Mercurius, op Jupiters bevel, suste Argus met verhalen en fluitspel in slaap en doodde hem. Juno, in rouw, plaatste Argus' honderd ogen voorgoed op de staart van de pauw. Daarna joeg ze Io met een steekvlieg de wereld rond, tot Jupiter in Egypte eindelijk zijn ontrouw goedmaakte — waar Io haar menselijke gedaante terugkreeg en later als godin vereerd werd, vereenzelvigd met Isis." },
  codex_europa: { cat:"mythologie", titel:"Europa en de Witte Stier",
    tekst:"Waar Jupiter Io in een dier veranderde om zijn affaire te verbergen, veranderde hij zichzelf in een dier — een tamme, witte stier — om zijn affaire met de Fenicische prinses Europa te beginnen. Argeloos beklom ze zijn rug op het strand; de stier zwom vervolgens met haar de zee over, helemaal naar Kreta. Daar baarde Europa hem drie zonen, onder wie de latere koning Minos. Haar naam bleef achter op een heel werelddeel." },
  codex_chiron: { cat:"mythologie", titel:"Chiron, de Wijze Centaur",
    tekst:"Tijdens de jacht op de Erymanthische Ever raakte een van Herakles' met Hydra-gif vergiftigde pijlen per ongeluk zijn eigen oude leermeester Chiron — de wijze, onsterfelijke centaur die hem ooit onderwees. Omdat Chiron onsterfelijk is, kon het gif hem niet doden, enkel eindeloos kwellen. Jaren later zou Chiron zijn eigen onsterfelijkheid vrijwillig afstaan aan de geketende Prometheus, om zo zelf eindelijk verlost te worden van de pijn." },
  codex_augiasstal: { cat:"mythologie", titel:"De Augiasstal",
    tekst:"Voor zijn vijfde beproeving moest Herakles de nooit-uitgemeste stallen van koning Augias in één enkele dag schoonmaken — een vernedering, geen gevecht. In plaats van te scheppen leidde hij de rivieren Alpheus en Peneus dwars door de stallen, die het vuil in enkele uren wegspoelden. Omdat Herakles in het geheim een beloning had afgesproken met Augias, keurde Eurystheus deze beproeving — net als de Hydra — af als niet volwaardig." },
  codex_atlas: { cat:"mythologie", titel:"Atlas en de Appels van de Hesperiden",
    tekst:"Voor de gouden appels van de Hesperiden, bewaakt door de draak Ladon, bood Herakles aan tijdelijk de hemel over te nemen van de titaan Atlas, zodat die zelf de appels kon plukken. Atlas, eenmaal bevrijd, overwoog Herakles voorgoed met de last achter te laten — tot Herakles hem, met een list in plaats van kracht, overhaalde de hemel nog één keer over te nemen zodat hij zijn mantel kon opvouwen. Zodra Atlas de last weer droeg, liep Herakles gewoon weg met de appels." },
  codex_herakles_twaalf_werken: { cat:"mythologie", titel:"Herakles: de Twaalf Werken Voltooid",
    tekst:"Na de Nemeïsche Leeuw en de Hydra van Lerna (Hoofdstuk 2) volbracht Herakles nog tien beproevingen: de Cerynitische Hinde gevangen zonder een wond, de Erymanthische Ever bedwongen (ten koste van zijn leermeester Chiron), de Augiasstal in één dag schoongespoeld, de Stymfalische Vogels verjaagd met Minerva's bronzen ratel, de Kretenzische Stier gevangen, de mensenetende Merries van Diomedes getemd met hun eigen meester als voer, de Gordel van Hippolyte behaald ten koste van haar leven door Juno's list, het vee van Geryon veroverd aan de rand van de wereld, de gouden Appels van de Hesperiden buitgemaakt met een list tegen Atlas, en tot slot Cerberus zelf, de driekoppige hond van de onderwereld, met blote handen overmeesterd. Tien jaar dienstbaarheid — opgelegd na de ergste daad van zijn leven — eindigen met deze twaalfde taak." },

  // LET OP: dezelfde "vroeg ontgrendelen"-regel als Hoofdstuk 1/2/3 — deze
  // vijf entries worden al bij CH4_000 gezet, vóór de eerste puzzel.
  codex_grammatica_ch4_infinitivus: { cat:"grammatica", titel:"Grammatica: de infinitivus",
    tekst:"De infinitivus is de 'woordenboekvorm' van een werkwoord — geen persoon, geen tijd, gewoon de handeling zelf ('veranderen', 'waarschuwen'). Je gebruikt hem vaak na een ander werkwoord, zoals iubere (bevelen) of posse (kunnen): 'Aegeus Theseum vela mutare iubet' — Aegeus draagt Theseus op de zeilen te veranderen.",
    table:{ headers:["Conjugatie","Uitgang","Voorbeeld uit dit hoofdstuk","Betekenis"],
      rows:[["1e","-are","mutare","veranderen"],
            ["2e","-ēre","monere","waarschuwen"],
            ["3e","-ere","relinquere","achterlaten, verlaten"],
            ["4e","-ire","servire (Hoofdstuk 2)","dienen"]] } },
  codex_grammatica_ch4_vocativus: { cat:"grammatica", titel:"Grammatica: de vocativus (vervolg)",
    tekst:"Je kende de vocativus al uit Hoofdstuk 1 (Bacche!, Pallas!, Prometheu!) — dit hoofdstuk voegt er nieuwe voorbeelden aan toe. Nog altijd geldt: niet elk woord verandert, en Griekse namen op -eus volgen hun eigen patroon.",
    table:{ headers:["Type","Voorbeeld (nominativus)","Vocativus"],
      rows:[["Regelmatig op -us (2e declinatie)","Icarus","Icare!"],
            ["Grieks op -eus","Theseus","Theseu!"],
            ["Blijft gelijk aan de nominativus","Minos","Minos!"]] } },
  codex_grammatica_ch4_imperfectum: { cat:"grammatica", titel:"Grammatica: de imperfectum",
    tekst:"De imperfectum beschrijft een handeling die in het verleden duurde of zich herhaalde — 'hij was aan het waarschuwen', 'hij bleef waarschuwen' — in tegenstelling tot de perfectum, die een handeling als afgerond en eenmalig weergeeft. Je herkent de imperfectum aan het tussenvoegsel -ba- vóór de persoonsuitgang.",
    table:{ headers:["Persoon","monere (waarschuwen) — imperfectum"],
      rows:[["ik","monebam"],["jij","monebas"],["hij/zij/het","monebat"],
            ["wij","monebamus"],["jullie","monebatis"],["zij","monebant"]] } },
  codex_grammatica_ch4_perfectum: { cat:"grammatica", titel:"Grammatica: de perfectum",
    tekst:"De perfectum beschrijft een voltooide, eenmalige handeling in het verleden — 'hij wierp', één keer, klaar. Anders dan de imperfectum heeft de perfectum geen vast, voorspelbaar tussenvoegsel: elk werkwoord heeft zijn eigen perfectumstam, die je apart moet leren (net als esse/posse in Hoofdstuk 2 al onregelmatig waren).",
    table:{ headers:["Werkwoord (infinitivus)","Perfectum (hij/zij-vorm)","Betekenis"],
      rows:[["mittere","misit","hij/zij stuurde, wierp"],
            ["monere","monuit","hij/zij waarschuwde"],
            ["cadere","cecidit","hij/zij viel"]] } },
  codex_grammatica_ch4_ablativus: { cat:"grammatica", titel:"Grammatica: de ablativus (van middel)",
    tekst:"Een ablativus van middel laat zien WAARMEE iets gebeurt, zonder voorzetsel: 'Theseus filo labyrinthum relinquit' — Theseus verlaat het labyrint MET (behulp van) de draad. Net als bij de genitivus/dativus (Hoofdstuk 3) hangt de exacte uitgang af van de declinatie van het woord.",
    table:{ headers:["Declinatie","Voorbeeld","Ablativus enkelvoud","Betekenis"],
      rows:[["2e (onzijdig, op -um)","filum, fili","filo","met/door de draad"],
            ["1e (op -a)","cera, cerae","cera","met/door was"],
            ["3e (medeklinker)","fulmen, fulminis","fulmine","met/door de bliksem"]] } },
  codex_grammatica_ch4_overzicht: { cat:"grammatica", titel:"Grammatica: Hoofdstuk 4 samengevat",
    tekst:"Dit hoofdstuk draaide om beloften en hun gevolgen, verteld in de juiste tijden: de infinitivus (de 'kale' werkwoordsvorm, bv. mutare — veranderen), de vocativus (aanspreekvorm, met nieuwe voorbeelden naast Hoofdstuk 1), de imperfectum (een handeling die duurde: monebat — hij bleef waarschuwen) tegenover de perfectum (een handeling die voltooid was: misit — hij wierp), en de ablativus van middel (waarmee iets gebeurt: filo — met de draad, fulmine — met de bliksem). Samen laten ze zien hoe het Latijn niet alleen WIE iets doet kan uitdrukken, maar ook WANNEER en WAARMEE." },

  codex_labyrint_minotaurus: { cat:"mythologie", titel:"Het Labyrint en de Minotaurus",
    tekst:"Koning Minos van Kreta beloofde ooit de zeegod Neptunus een verblindend witte stier te offeren als teken van zijn koningschap — en brak die belofte toen hij het dier te mooi vond om te doden. Neptunus strafte hem door zijn vrouw Pasiphaë een onnatuurlijk verlangen naar de stier te geven; wat daaruit geboren werd, de Minotaurus, half mens en half stier, kon nergens anders wonen dan in een bouwwerk dat zijn eigen weg naar buiten verbergt. Minos' hofbouwmeester Daidalos ontwierp dat labyrint — zo listig dat zelfs zijn eigen maker de weg er nauwelijks in kon vinden. Elk jaar voedde het offer uit Athene het monster, en hield het tegelijk Minos' oude, gebroken belofte verborgen achter zijn eigen stenen muren." },
  codex_daidalos_ikaros: { cat:"mythologie", titel:"Daidalos en Ikaros",
    tekst:"Toen Minos ontdekte dat het labyrint zijn geheim niet had bewaard, sloot hij Daidalos en diens zoon Ikaros zelf op in het bouwwerk — de enige plek op Kreta waaruit zelfs de bouwmeester niet zomaar kon ontsnappen. Daidalos verzamelde veren, bond ze samen met draad en verzegelde ze met was tot twee paar vleugels, met de dringende waarschuwing aan zijn zoon om de middenweg te vliegen: niet te laag, niet te hoog. Ikaros, dronken van de vreugde van het vliegen zelf, steeg hoger dan zijn vader had bevolen — tot de zon de was deed smelten en hij in de zee viel die sindsdien zijn naam draagt: de Icarische Zee." },
  codex_ariadne_bacchus: { cat:"mythologie", titel:"Ariadne op Naxos",
    tekst:"Nadat ze Theseus met haar garen door het labyrint had geholpen, kon Ariadne nooit meer veilig terugkeren naar haar vaders paleis — en toch liet Theseus haar, slapend, achter op het eiland Naxos. Daar vond Bacchus haar, de god die je al kent van koning Midas' vloek (Hoofdstuk 1): hij trouwde met haar, maakte haar onsterfelijk, en plaatste haar bruidskroon voorgoed tussen de sterren. Van alle gebroken beloften in dit hoofdstuk is het de enige die alsnog met iets goeds eindigt." },
  codex_phaethon: { cat:"mythologie", titel:"Phaëthon en de Zonnewagen",
    tekst:"Phaëthon, die aan zijn eigen goddelijke afkomst twijfelde, reisde naar het Paleis van de Zon om zijn vader Sol om bewijs te vragen. Sol, die per ongeluk al een onherroepelijke eed bij de Styx had gezworen elke wens in te willigen, kon zijn zoon niet meer weigeren toen die vroeg de zonnewagen te mogen mennen. Phaëthon verloor de wagen bijna meteen uit controle — de aarde bevroor, verschroeide, en dreigde te vergaan — tot Jupiter hem met een bliksemschicht neerhaalde om de wereld te redden. Zijn zusters, de Heliaden, weenden zo lang aan zijn graf dat ze veranderden in populieren, hun tranen verhard tot amber." },

  // ---- Hoofdstuk 5 — Het Gulden Vlies (geen nieuwe grammatica-entries dit
  // hoofdstuk, zie SP_CAMPAIGN ch5.grammatica: bewust herhaling) ----
  codex_gulden_vlies: { cat:"mythologie", titel:"Het Gulden Vlies",
    tekst:"Lang voor Jason geboren werd, redde een gouden ram met sprekende stem de kinderen Phrixus en Helle van een dodelijke stiefmoeder door hen door de lucht weg te dragen. Helle viel onderweg in de zee die sindsdien haar naam draagt (de Hellespont); Phrixus bereikte veilig Colchis, offerde de ram uit dankbaarheid aan Jupiter, en hing zijn gouden vacht — het Gulden Vlies — op in een heilig woud, waar koning Aeëtes het sindsdien laat bewaken door een nooit slapende draak." },
  codex_argonauten_bemanning: { cat:"mythologie", titel:"De Bemanning van de Argo",
    tekst:"Op Jasons oproep meldt zich een bonte verzameling helden aan boord van de Argo — sommigen al beroemd, de meesten nog jong genoeg om hun grootste verhalen nog vóór zich te hebben. Onder hen Peleus en Telamon (ooit de vaders van Achilles en Ajax), Laertes (ooit de vader van Odysseus), de sterke Herakles, de begaafde muzikant Orpheus, de scheepsbouwer Argos die de Argo zelf ontwierp, en nog veel meer — een bemanning die de latere geschiedenis van heel Griekenland in zich draagt, lang voordat iemand van hen dat kan weten." },
  codex_atalanta_meleager: { cat:"mythologie", titel:"Atalanta en Meleager",
    tekst:"Atalanta, opgevoed door een berin nadat haar vader haar als baby te vondeling had gelegd, is de enige vrouw aan boord van de Argo — in sommige verhalen als volwaardige Argonaut, in andere op zijn minst uitgenodigd. Meleager, prins van Calydon, vaart mee als een van de jongste helden. Hun namen zullen niet voor het laatst samen genoemd worden: ooit zullen ze ook naast elkaar tegenover een reusachtig everzwijn staan, met een veel bitterder einde dan deze tocht." },
  codex_dioscuren: { cat:"mythologie", titel:"Kastor en Polydeukes, de Dioscuren",
    tekst:"De tweelingbroers Kastor en Polydeukes — samen 'de Dioscuren' genoemd, 'zonen van Zeus' — vullen elkaar precies aan: Kastor is de beroemdste ruiter van Griekenland, Polydeukes de onverslaanbare bokser. Hun zuster is nog te jong om te weten hoe beroemd haar eigen naam ooit zal worden: Helena." },
  codex_argos_schip: { cat:"mythologie", titel:"Argos en de Bouw van de Argo",
    tekst:"Argos, zoon van Arestor, bouwde de Argo op aanwijzing van Athena zelf — het snelste en sterkste schip dat Griekenland ooit had gezien, met in de boeg zelfs een balk uit het orakelbos van Dodona verwerkt, die naar verluidt af en toe met een eigen stem kan waarschuwen. Niet te verwarren met de honderdogige Argus Panoptes uit Hoofdstuk 3 — twee heel verschillende figuren die toevallig bijna dezelfde naam droegen." },
  codex_nestor_philoktetes: { cat:"mythologie", titel:"Nestor en Philoktetes",
    tekst:"Nestor, hier nog een van de jongere Argonauten, is nu al bekend om een geduld en wijsheid die zijn leeftijdgenoten missen — een reputatie die hem decennia later, als oudste raadsman voor Troje, nog verder vooruit zal snellen. Philoktetes, een ongeëvenaard boogschutter, is dan allang de man die niemand kan missen: het orakel zal zeggen dat Troje nooit zal vallen zonder hem en de boog die hij ooit van Herakles zelf zal erven." },
  codex_medea_wraak: { cat:"mythologie", titel:"Medea's Wraak in Korinthe",
    tekst:"Jaren na de terugkeer van de Argo verlaat Jason Medea voor een politiek huwelijk met de dochter van de koning van Korinthe — ondanks alles wat Medea voor hem opgaf en verried. Medea's wraak wordt een van de duisterste verhalen uit de hele mythologie: een vergiftigd bruidsgeschenk voor de nieuwe bruid, en een verlies dat Jason voor de rest van zijn leven zal achtervolgen. Geen enkel verhaal in Chronica Classica vertelt dit lichtvaardig — het is de prijs die blijkt te horen bij een belofte die uiteindelijk toch verbroken werd, net als bij Theseus en Aegeus in Hoofdstuk 4, maar dan zonder enige verzachting." },

  // ---- Hoofdstuk 6 — De Vloek van Thebe ----
  codex_kadmos_thebe: { cat:"mythologie", titel:"Kadmos en de Stichting van Thebe",
    tekst:"Op zoek naar zijn geschaakte zuster Europa (Hoofdstuk 3) raadpleegde Kadmos het orakel van Delphi, dat hem opdroeg de zoektocht te staken en in plaats daarvan een koe te volgen tot ze uitgeput neerviel — daar moest hij een stad stichten. Om een offer te brengen doodde hij een draak die de plaatselijke bron bewaakte, en zaaide op Athena's advies de tanden van het beest in de aarde. Uit de grond rezen gewapende krijgers op die elkaar bijna allemaal doodden; de vijf overlevenden werden de eerste Thebanen. Diezelfde tanden — de andere helft van hetzelfde monster — zouden generaties later ook koning Aeëtes van Colchis van pas komen (Hoofdstuk 5)." },
  codex_niobe: { cat:"mythologie", titel:"Niobe's Hoogmoed",
    tekst:"Niobe, koningin van Thebe en moeder van veertien kinderen, schepte op dat ze méér reden had om vereerd te worden dan de titanide Latona (Hoofdstuk 2), die er slechts twee had. Apollo en Diana namen wraak voor hun moeder door al Niobe's kinderen te doden, de een na de ander. Niobe, verlamd van verdriet, veranderde in steen — een rots op de berg Sipylos die, zegt de overlevering, tot op de dag van vandaag water blijft laten druppelen, als tranen die nooit ophouden." },
  codex_oedipus: { cat:"mythologie", titel:"Oedipus en het Raadsel van de Sfinx",
    tekst:"Een orakel voorspelde koning Laius van Thebe dat zijn eigen zoon hem ooit zou doden; uit angst liet hij de pasgeboren Oedipus te vondeling leggen, maar het kind overleefde en groeide ver van Thebe op, zonder zijn ware afkomst te kennen. Toen een orakel Oedipus zelf dezelfde voorspelling deed, vluchtte hij weg van wie hij dacht dat zijn ouders waren — en doodde onderweg, zonder het te beseffen, zijn werkelijke vader bij een geschil op de weg. Bij Thebe versloeg hij de Sfinx, een monster dat de stad gijzelde met een raadsel, en werd tot koning gekroond — waarna hij trouwde met de weduwe van de vorige koning, zijn eigen moeder Iokaste. Jaren later kwam de waarheid alsnog aan het licht; geen van beiden kon ermee verder leven." },
  codex_zeven_tegen_thebe: { cat:"mythologie", titel:"De Zeven tegen Thebe",
    tekst:"Oedipus' zonen Eteokles en Polyneikes spraken af de troon van Thebe jaarlijks te delen — een afspraak die Eteokles, eenmaal koning, niet nakwam. Polyneikes verzamelde zes andere champions, onder wie de Argonaut Tydeus (Hoofdstuk 5), om de stad met geweld in te nemen. De aanval mislukte: bijna alle zeven champions sneuvelden, en de broers doodden elkaar in een laatste tweegevecht. Tydeus zelf stierf op het slagveld — op het punt dat Athena hem onsterfelijkheid wilde schenken voor zijn moed, deed hij iets zo wreeds tegenover een gevallen vijand dat ze zich vol afschuw afwendde en de gave introk." },
  codex_epigonen: { cat:"mythologie", titel:"De Epigonen",
    tekst:"Tien jaar na de nederlaag van hun vaders trokken de zonen van de Zeven — de Epigonen, 'de nakomelingen' — opnieuw tegen Thebe op, dit keer met succes. Onder hen Diomedes, de zoon van Tydeus, die zijn vader nooit goed heeft kunnen kennen maar hem hier alsnog wreekt. Thebe viel definitief, en Diomedes' naam zou nog veel groter worden: jaren later zou hij een van de dapperste Griekse helden voor Troje worden." },
  codex_antigone: { cat:"mythologie", titel:"Antigone's Verzet",
    tekst:"Na de oorlog verklaarde regent Creon dat Polyneikes — die zijn eigen stad had aangevallen — als verrader nooit begraven mocht worden, een verschrikkelijke straf volgens Griekse religieuze overtuiging. Antigone, Polyneikes' zuster, trotseerde het bevel en begroef hem alsnog met de juiste rituelen, overtuigd dat de wetten van de goden zwaarder wegen dan die van een sterfelijke koning. Creon liet haar levend inmetselen in een graftombe; Antigone koos zelf het moment van haar dood, in plaats van te wachten tot de tombe dat voor haar deed." },
  codex_pentheus_bacchus: { cat:"mythologie", titel:"Pentheus en de Bacchanten",
    tekst:"Pentheus, kleinzoon van Kadmos en koning van Thebe, weigerde de nieuwe god Bacchus te erkennen — ook al was die god, de zoon van Semele (Hoofdstuk 2), zijn eigen neef. Toen hij vermomd de extatische riten van Bacchus' vrouwelijke volgelingen probeerde te bespieden, werd hij ontdekt door de Bacchanten zelf, onder wie — in hun door de god opgewekte waanzin — zijn eigen moeder Agave. Wat er die middag op de berg gebeurde, is het duisterste verhaal dat dit hoofdstuk te vertellen heeft: toen Agave weer bij zinnen kwam, besefte ze pas wat haar handen hadden gedaan." },
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

  io: { nm:"Io", epithet:"Priesteres van Juno, minnares van Jupiter",
    intro:"Een priesteres van Juno zelf in Argos — een wrede ironie, want het is uitgerekend haar eigen godin die straks haar ergste vijand wordt, zodra Jupiter zijn oog op haar laat vallen.",
    full:"Om haar te beschermen tegen Juno's argwaan veranderde Jupiter Io in een witte vaars — een vermomming die haar lot alleen maar erger maakte toen Juno haar alsnog opeiste en de honderdogige Argus Panoptes als bewaker aanstelde. Na Argus' dood joeg Juno haar met een steekvlieg de hele wereld rond, tot Jupiter eindelijk voor haar pleitte in Egypte, waar ze haar menselijke gedaante terugkreeg en de moeder werd van Epaphus." },
  argus: { nm:"Argus Panoptes", epithet:"Honderdogige reus, wachter van Juno",
    intro:"Een reus met honderd ogen verspreid over zijn hele lichaam — altijd waakzaam, want terwijl een deel van zijn ogen slaapt, blijven de andere onophoudelijk open.",
    full:"Aangesteld door Juno om de betoverde Io te bewaken, werd Argus uiteindelijk in slaap gesust door Mercurius' verhalen en fluitspel, en gedood terwijl al zijn honderd ogen eindelijk tegelijk gesloten waren. Juno, ontroostbaar, plaatste zijn ogen voorgoed op de staart van de pauw — haar heilige vogel." },
  hermes: { nm:"Hermes (Mercurius)", epithet:"Boodschapper der goden",
    intro:"De vleugelvoetige boodschapper van de goden, net zo bedreven in welbespraaktheid en list als in snelheid — Jupiter stuurt hem wanneer een probleem meer geduld dan geweld vraagt.",
    full:"Op Jupiters bevel verkleedde Mercurius zich als eenvoudige herder en suste Argus Panoptes met verhalen en fluitspel in slaap, voordat hij de honderdogige wachter doodde en Io bevrijdde. Jaren later begeleidde hij Herakles ook tot aan de poort van de onderwereld, voor diens twaalfde en laatste beproeving. Bij de Grieken heet hij Hermes." },
  europa: { nm:"Europa", epithet:"Prinses van Tyrus, naamgeefster van een werelddeel",
    intro:"Een Fenicische prinses die met haar dienaressen op het strand speelt, zonder te vermoeden dat de opvallend tamme, witte stier die zich bij de kudde voegt geen gewoon dier is.",
    full:"Jupiter, ditmaal vermomd als een tamme witte stier in plaats van een wolk, liet Europa argeloos op zijn rug klimmen — en zwom vervolgens met haar de zee op, helemaal naar Kreta. Daar baarde ze hem drie zonen, onder wie Minos, de latere koning van Kreta wiens naam voorgoed verbonden zal blijven met een labyrint dat nog gebouwd moet worden. Haar naam bleef achter op een heel werelddeel: Europa." },
  pholus: { nm:"Pholus", epithet:"Wijze centaur, gastheer van Herakles",
    intro:"Een centaur die, anders dan de meeste van zijn soort, bekendstaat om zijn gastvrijheid — tot een gedeelde wijnkruik zijn hele kudde in een dodelijke chaos stort." },

  theseus: { nm:"Theseus", epithet:"Prins van Athene, doder van de Minotaurus",
    intro:"De pas erkende zoon van koning Aegeus, die zich vrijwillig aanmeldt voor het bloedigste offer dat Athene ooit aan Kreta heeft moeten betalen.",
    full:"Theseus versloeg de Minotaurus in het hart van het Labyrint, dankzij Ariadnes garen — en liet haarzelf achter op Naxos voordat hij thuisvoer. Zijn grootste overwinning en zijn grootste fout vallen in hetzelfde verhaal samen: hij vergat de belofte aan zijn vader over de kleur van zijn zeilen, en werd koning van Athene op dezelfde dag dat die vergetelheid zijn vader het leven kostte." },
  aegeus: { nm:"Aegeus", epithet:"Koning van Athene",
    intro:"Een vader die zijn net teruggevonden zoon dreigt te verliezen aan een tol die zijn eigen stad al negen jaar aan Kreta betaalt.",
    full:"Aegeus liet zijn zoon beloven witte zeilen te hijsen als teken dat hij de Minotaurus had overleefd. Toen het schip terugkeerde onder het gewone zwarte rouwzeil — vergeten, niet verwisseld — wierp hij zich zonder aarzelen van de klippen in de zee. Die zee draagt sindsdien zijn naam: de Egeïsche Zee." },
  ariadne: { nm:"Ariadne", epithet:"Prinses van Kreta, dochter van Minos",
    intro:"Minos' dochter, die in de veertien ten dode opgeschreven Atheners voor het eerst iemand ziet voor wie ze meer voelt dan medelijden met zichzelf.",
    full:"Ariadne verried haar eigen vader door Theseus Daidalos' plan — een kluwen garen — in handen te spelen, in ruil voor de belofte dat hij haar zou meenemen. Theseus liet haar niettemin slapend achter op Naxos. Daar vond Bacchus haar, trouwde met haar en maakte haar onsterfelijk — het enige verhaal in dit hoofdstuk waar een gebroken belofte alsnog goed afloopt." },
  minos: { nm:"Minos", epithet:"Koning van Kreta, zoon van Europa en Jupiter",
    intro:"De machtige koning van Kreta — dezelfde naam die Athena in Hoofdstuk 3 al noemde toen ze over Europa vertelde — wiens jaarlijkse eis aan Athene een oude, verzwegen schuld verbergt.",
    full:"Minos' eigen gebroken belofte aan Neptunus — een witte stier die hij weigerde te offeren — kostte hem uiteindelijk zijn eer: zijn vrouw Pasiphaë baarde de Minotaurus, en zijn dochter Ariadne koos voor een vreemdeling boven haar eigen vader. Zijn woede om dat verraad trof uiteindelijk niet Theseus, maar Daidalos, de man die het allemaal mogelijk had gemaakt." },
  daidalos: { nm:"Daidalos (Daedalus)", epithet:"Beroemdste bouwmeester van zijn tijd",
    intro:"De hofbouwmeester van Minos, wiens vindingrijkheid net zo gevaarlijk als nuttig blijkt te zijn — hij ontwierp zowel het labyrint als, in het geheim, de manier om het te verslaan.",
    full:"Voor zijn hulp aan Ariadne en Theseus werd Daidalos samen met zijn zoon Ikaros zelf in zijn eigen labyrint opgesloten. Hij ontsnapte op zelfgemaakte vleugels van veren en was — en vloog vervolgens, alleen, met zijn zoon niet langer naast zich, verder dan hij ooit had willen vliegen." },
  ikaros: { nm:"Ikaros (Icarus)", epithet:"Zoon van Daidalos",
    intro:"Een jongen die voor het eerst van zijn leven vliegt, aan de zijde van zijn vader, met maar één regel om zich aan te houden: blijf de middenweg volgen.",
    full:"Ikaros vloog, dronken van vreugde, hoger dan zijn vader had bevolen — tot de zon de was tussen zijn veren deed smelten. Hij viel in de zee die sindsdien zijn naam draagt: de Icarische Zee. Zijn vader riep zijn naam keer op keer, zonder ooit nog antwoord te krijgen." },
  phaethon: { nm:"Phaëthon", epithet:"Zoon van Sol, twijfelaar aan zijn eigen afkomst",
    intro:"Een jongen die alleen het woord van zijn moeder heeft dat zijn vader de zonnegod is — tot spot van een vriend hem naar het Paleis van de Zon drijft om het zelf te bewijzen.",
    full:"Phaëthon dwong zijn vader Sol, gebonden aan een onherroepelijke eed bij de Styx, om hem de zonnewagen te laten mennen. Hij verloor de controle bijna onmiddellijk, bracht de aarde op de rand van de ondergang, en werd door Jupiters bliksem uit de lucht gehaald om erger te voorkomen. Zijn zusters, de Heliaden, treuren nog altijd — nu als populieren aan de oever van de Eridanus." },
  sol: { nm:"Sol (Helios)", epithet:"God van de Zon",
    intro:"De god die dagelijks de zon over de hemel voert, in een paleis van goud en brons aan de rand van de wereld — en die een zoon verwelkomt van wie hij het bestaan nooit heeft ontkend.",
    full:"Sol zwoer, voor hij goed en wel wist wat zijn zoon zou vragen, een eed bij de Styx die zelfs goden nooit breken. Toen Phaëthon de zonnewagen opeiste, kon Sol niet meer terug — en moest toezien hoe zijn eigen belofte zijn zoon het leven kostte." },
  epaphus: { nm:"Epaphus", epithet:"Zoon van Jupiter en Io",
    intro:"De zoon die Io (Hoofdstuk 3) in Egypte baarde, inmiddels oud genoeg om zijn vriend Phaëthon te tarten diens eigen goddelijke afkomst te bewijzen." },
  tellus: { nm:"Tellus", epithet:"Belichaming van de Aarde",
    intro:"De aarde zelf, die haar stem verheft tot aan de Olympos wanneer Phaëthons wilde rit haar dreigt te verschroeien." },

  // ---- Hoofdstuk 5 — Het Gulden Vlies ----
  jason: { nm:"Jason", epithet:"Aanvoerder van de Argonauten",
    intro:"De rechtmatige troonopvolger van Iolcus, weggehouden van de troon door zijn oom Pelias — die hem, in de hoop dat hij nooit terugkeert, op een schijnbaar onmogelijke queeste stuurt: het Gulden Vlies uit Colchis halen.",
    full:"Jason verzamelde de dapperste helden van Griekenland, voer met hen dwars over zee naar Colchis, en kreeg het Vlies uiteindelijk alleen dankzij Medea's hulp — een schuld die hij haar, jaren later in Korinthe, met verraad zou terugbetalen." },
  medea: { nm:"Medea", epithet:"Prinses van Colchis, tovenares",
    intro:"De dochter van koning Aeëtes van Colchis, en een begaafde tovenares — die, tot haar eigen verrassing, op slag verliefd wordt op de vreemdeling die haar vaders Vlies komt opeisen.",
    full:"Medea verraadde haar eigen vader om Jason te helpen: ze temperde de vuurspuwende stieren, hielp de aardgeboren krijgers tegen elkaar opzetten, en suste de nooit slapende draak in slaap. Jaren later, in Korinthe, verliet Jason haar voor een politiek huwelijk — en Medea's wraak daarop is een van de duisterste verhalen die de mythologie kent." },
  aeetes: { nm:"Aeëtes", epithet:"Koning van Colchis",
    intro:"De koning van het verre Colchis, aan de rand van de bekende wereld, die het Gulden Vlies al jaren bewaakt met een nooit slapende draak — en niet van plan is het zomaar aan een vreemdeling af te staan." },
  peleus: { nm:"Peleus", epithet:"Argonaut, later koning van Phthia",
    intro:"Een van de sterkste helden aan boord van de Argo — de latere geschiedenis kent hem vooral als de vader van een zoon die nog geboren moet worden: Achilles." },
  telamon: { nm:"Telamon", epithet:"Argonaut, later koning van Salamis",
    intro:"Peleus' trouwe metgezel aan boord van de Argo, en de latere vader van een andere naam die de speler nog zal leren kennen: Ajax." },
  laertes: { nm:"Laërtes", epithet:"Argonaut, later koning van Ithaka",
    intro:"Een kalme, betrouwbare aanwezigheid aan boord — en de latere vader van de sluwste held die Griekenland ooit zal voortbrengen: Odysseus." },
  argos: { nm:"Argos", epithet:"Scheepsbouwer van de Argo",
    intro:"De bouwmeester die de Argo zelf ontwierp, op aanwijzing van Athena — niet te verwarren met de honderdogige bewaker Argus Panoptes uit Hoofdstuk 3.",
    full:"Argos kent elke plank en elke naad van zijn eigen schip zo goed dat hij het, waar nodig, ook onderweg weer weet te repareren — inclusief de balk uit het orakelbos van Dodona die hij bewust in de boeg liet verwerken." },
  atalanta: { nm:"Atalanta", epithet:"Jaagster, snelste sterveling van Griekenland",
    intro:"Een jaagster, opgevoed door een berin nadat haar vader haar als baby te vondeling legde omdat hij een zoon wilde — inmiddels de snelste en scherpste boogschutter aan boord van de Argo." },
  meleager: { nm:"Meleager", epithet:"Prins van Calydon",
    intro:"De jonge prins van Calydon, een van de gretigste helden aan boord — zijn naam zal, samen met die van Atalanta, ooit nog veel bekender worden bij een heel ander everzwijn dan dit." },
  kastor_polydeukes: { nm:"Kastor en Polydeukes", introNm:"De Dioscuren", epithet:"De Dioscuren, tweelingzonen van Zeus/Leda",
    intro:"Een onafscheidelijk tweetal aan boord: Kastor de beste ruiter van Griekenland, Polydeukes de onverslaanbare bokser — hun zuster is nog te jong om te weten hoe beroemd haar naam ooit zal worden.",
    full:"Kastor en Polydeukes vullen elkaar precies aan zoals ze dat hun hele leven zullen blijven doen — de een te paard, de ander met de vuisten. Hun zuster, nu nog een kind in Sparta, heet Helena." },
  nestor: { nm:"Nestor", epithet:"Jonge Argonaut, later raadsman voor Troje",
    intro:"Een van de jongere helden aan boord, nu al opvallend geduldig en verstandig voor zijn leeftijd — een reputatie die hem decennia later, als oudste raadsman voor Troje, nog veel verder vooruit zal snellen." },
  philoktetes: { nm:"Philoktetes", epithet:"Ongeëvenaard boogschutter",
    intro:"Een jonge boogschutter met een precisie die zelfs op deze tocht al opvalt — pas veel later zal blijken hoe onmisbaar die precisie ooit wordt, met een boog die hij dan van Herakles zelf zal hebben geërfd." },
  tydeus: { nm:"Tydeus", epithet:"Argonaut, vader van Diomedes",
    intro:"Een korte lont en een nog kortere twijfel — Tydeus is de eerste die zijn zwaard trekt en de laatste die er spijt van heeft. Zijn zoon Diomedes zal ooit net zo onstuimig blijken." },
  orpheus: { nm:"Orpheus", epithet:"Muzikant, zoon van een Muze",
    intro:"Een muzikant wiens lier en stem, naar men zegt, zelfs bomen en rotsen tot bewegen kunnen brengen — aan boord van de Argo houdt zijn spel de riemslag gelijk en de gemoederen kalm." },

  // ---- Hoofdstuk 6 — De Vloek van Thebe ----
  kadmos: { nm:"Kadmos", epithet:"Stichter van Thebe",
    intro:"Een Fenicische prins, op zoek naar zijn geschaakte zuster Europa (je kent haar al uit Hoofdstuk 3), die de zoektocht opgeeft op advies van het orakel van Delphi en in plaats daarvan een eigen stad sticht: Thebe.",
    full:"Kadmos doodde een draak die een heilige bron bewaakte en zaaide, op Athena's advies, de tanden van het beest in de aarde — daaruit rezen gewapende krijgers op die elkaar bijna allemaal doodden, op vijf na, die met hem de eerste inwoners van Thebe werden. Dezelfde soort tanden die, generaties later, ver naar het oosten in Colchis, ook koning Aeëtes zou gebruiken." },
  niobe: { nm:"Niobe", epithet:"Koningin van Thebe",
    intro:"De trotse koningin van Thebe, moeder van veertien kinderen, die geen enkele reden ziet om zich klein te houden voor wie dan ook — zelfs niet voor een godin.",
    full:"Niobe schepte op dat ze, met veertien kinderen tegenover Latona's twee, de betere moeder was — en eiste dat de Thebanen hun offers aan Latona staakten. Apollo en Diana (Hoofdstuk 2) doodden uit wraak al haar kinderen, één voor één. Niobe, verstard van verdriet, veranderde in steen — een rots die, zegt men, tot op de dag van vandaag nog water laat druppelen, als tranen die nooit ophouden." },
  laius: { nm:"Laius", epithet:"Koning van Thebe, vader van Oedipus",
    intro:"Een koning die een orakel raadpleegt over zijn ongeboren zoon, en een antwoord krijgt dat hem voorgoed zal achtervolgen: die zoon zal hem ooit doden." },
  oedipus: { nm:"Oedipus", epithet:"Koning van Thebe, oplosser van het raadsel van de Sfinx",
    intro:"Een vondeling, opgevoed ver van Thebe zonder te weten wie zijn werkelijke ouders zijn — tot een orakel ook hem een verschrikkelijke voorspelling doet, en hij alles op alles zet om die te ontlopen.",
    full:"Op de vlucht voor een profetie die hij niet kon navolgen zonder haar te vervullen, doodde Oedipus zonder het te weten zijn eigen vader Laius bij een geschil op de weg, loste hij het raadsel van de Sfinx op en werd koning van Thebe — en trouwde met de weduwe van de vorige koning, zonder te beseffen dat het zijn eigen moeder was. Toen de waarheid jaren later aan het licht kwam, kon geen van beiden ermee verder leven." },
  iokaste: { nm:"Iokaste", epithet:"Koningin van Thebe",
    intro:"De weduwe van koning Laius, die haar stad na de Sfinx eindelijk weer bevrijd ziet — en hertrouwt met de vreemdeling die dat voor elkaar kreeg, zonder enig vermoeden wie hij werkelijk is." },
  eteokles: { nm:"Eteokles", epithet:"Koning van Thebe, zoon van Oedipus",
    intro:"De oudste zoon van Oedipus, die met zijn broer Polyneikes afspreekt de troon van Thebe jaarlijks te delen — een afspraak die hij, eenmaal koning, niet van plan is na te komen." },
  polyneikes: { nm:"Polyneikes", epithet:"Verbannen prins van Thebe",
    intro:"Oedipus' andere zoon, verbannen uit zijn eigen stad zodra zijn broer weigert de troon na een jaar weer af te staan — en vastbesloten die met geweld terug te eisen." },
  antigone: { nm:"Antigone", epithet:"Prinses van Thebe, dochter van Oedipus",
    intro:"Oedipus' dochter, die weigert te aanvaarden dat haar eigen broer onbegraven mag blijven liggen — zelfs als dat weigeren haar het leven kan kosten.",
    full:"Tegen het uitdrukkelijke bevel van koning Creon in begroef Antigone haar broer Polyneikes met de juiste rituelen, uit overtuiging dat de wetten van de goden zwaarder wegen dan die van een sterfelijke koning. Ze werd ervoor levend ingemetseld — en koos zelf het moment van haar dood, in plaats van te wachten tot de tombe dat voor haar deed." },
  creon: { nm:"Creon", epithet:"Regent van Thebe",
    intro:"Iokaste's broer, die na de wederzijdse ondergang van Eteokles en Polyneikes de troon van Thebe overneemt — en meteen een bevel uitvaardigt dat het hele koninkrijk zal verscheuren." },
  diomedes: { nm:"Diomedes", epithet:"Zoon van Tydeus, latere held van Troje",
    intro:"De zoon van Tydeus (Hoofdstuk 5), die tien jaar na zijn vaders dood zelf oud genoeg is om mee te trekken tegen Thebe — en net zo onstuimig blijkt als de vader die hij amper heeft gekend." },
  pentheus: { nm:"Pentheus", epithet:"Koning van Thebe, kleinzoon van Kadmos",
    intro:"Kadmos' kleinzoon en de huidige koning van Thebe, die weigert een vreemde nieuwe god te erkennen — ook al is die god, zoals hij niet weet te verhinderen, zijn eigen neef.",
    full:"Pentheus verzette zich fel tegen de verering van Bacchus (de zoon van Semele, Hoofdstuk 2) en probeerde de extatische riten van diens vrouwelijke volgelingen, de Bacchanten, met geweld te onderdrukken. Vermomd bespiedde hij hun rituelen op de berg — en werd ontdekt door de vrouwen zelf, onder wie, in hun goddelijk opgewekte waanzin, zijn eigen moeder Agave." },
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
  // Hoofdstuk 3 — bewust ANDERE ids dan "herakles" hierboven (Hoofdstuk 2),
  // want SP_STATE.fragments is één doorlopende array over alle hoofdstukken;
  // hergebruik van dezelfde id zou geen nieuw fragment toevoegen.
  io:       { nm:"Vrijheid",   icon:"🕊️" },
  labores:  { nm:"Volbrenging",icon:"⚔️" },
  // Hoofdstuk 4 — bewust ANDERE ids dan alle voorgaande fragmenten, want
  // SP_STATE.fragments is één doorlopende array; de hub-gate naar Athena
  // staat daarom op [REQUIRE:fragments=8] (de zes hierboven + deze twee).
  theseus:  { nm:"Uitweg",     icon:"🧵" },
  phaethon: { nm:"Overmoed",   icon:"☀️" },
};

/* ---- HERINNERINGEN/SOUVENIRS — het "museum van Mnemosyne"-mechanisme
   (Chronica.md §7.2.1a): uit elk afgerond verhaal neemt de speler één
   tastbaar voorwerp mee, opgehaald via een SOUVENIR:-sectie
   (spHookSouvenir, singleplayer.js) en zichtbaar in de nieuwe eerste
   Codex-tab "Herinneringen" (spCodexSouvenirsHTML). Losstaand van
   SP_FRAGMENTS hierboven — fragmenten zijn een ONZICHTBARE hoofdstukgate,
   souvenirs zijn juist bedoeld om gezien te worden. Bewust ambigu wie of wat
   deze voorwerpen precies verzamelt/bewaart (het Orakel van Chronos, in de
   verteltekst) — dat wordt pas een echt "museum" zodra Hoofdstuk 26 "De
   Bibliotheek van Mnemosyne" (SP_CAMPAIGN) gebouwd wordt.
   `img` optioneel (relatief aan assets/chronica/souvenirs/, nog geen
   bestanden op schijf); ontbreekt het of faalt het laden, dan valt
   spCodexSouvenirsHTML terug op `icon` — zelfde patroon als
   SP_COMBAT_ENEMIES. ---- */
const SP_SOUVENIRS = {
  souvenir_midas: { nm:"Een Gouden Roos", icon:"🌹", img:"souvenir_midas.png",
    caption:"Een gouden roos uit het paleis van Midas." },
  souvenir_athena_geboorte: { nm:"Een Bronzen Splinter", icon:"🪓", img:"souvenir_athena_geboorte.png",
    caption:"Een splinter brons van de bijl waarmee Athena ter wereld kwam." },
  souvenir_prometheus: { nm:"Een Nooit Dovend Kooltje", icon:"🔥", img:"souvenir_prometheus.png",
    caption:"Een kooltje van het vuur dat Prometheus voor de mensheid stal." },
  souvenir_latona: { nm:"Een Waterlelie", icon:"🌸", img:"souvenir_latona.png",
    caption:"Een waterlelie uit de vijver waar boeren Latona het water misgunden." },
  souvenir_semele: { nm:"Een Wijnrank die Nooit Verwelkt", icon:"🍇", img:"souvenir_semele.png",
    caption:"Een wijnrank uit de as waaruit Bacchus werd geboren." },
  souvenir_kallisto: { nm:"Een Zilverglanzende Haarlok", icon:"🐻", img:"souvenir_kallisto.png",
    caption:"Een haarlok berenvacht die in het donker zwak lijkt te glanzen, als sterrenlicht." },
  souvenir_herakles_leeuw: { nm:"Een Klauw van de Nemeïsche Leeuw", icon:"🦁", img:"souvenir_herakles_leeuw.png",
    caption:"Een klauw, losgeraakt uit de leeuwenhuid die Herakles nu als mantel draagt." },
  souvenir_io: { nm:"Een Pauwenveer met een Oog", icon:"🦚", img:"souvenir_io.png",
    caption:"Een pauwenveer met een van Argus' honderd ogen erin geweven." },
  souvenir_herakles_labores: { nm:"Een Gouden Appel van de Hesperiden", icon:"🍎", img:"souvenir_herakles_labores.png",
    caption:"Een gouden appel die Herakles je toevertrouwt nu al zijn twaalf werken volbracht zijn." },
  souvenir_theseus: { nm:"Een Restje van Ariadne's Garen", icon:"🧵", img:"souvenir_theseus.png",
    caption:"Het laatste stukje van de draad waarmee Theseus het Labyrint van Kreta weer uit vond." },
  souvenir_phaethon: { nm:"Een Druppel Amber", icon:"🟠", img:"souvenir_phaethon.png",
    caption:"Een druppel amber, ooit een traan van een van de Heliaden om Phaëthon." },
  souvenir_argonauten: { nm:"Een Schilfer van het Gulden Vlies", icon:"🐑", img:"souvenir_argonauten.png",
    caption:"Een klein, gouden schilfertje van het Vlies dat de Argo helemaal naar Colchis en terug voerde." },
  souvenir_thebe: { nm:"Een Verstenen Traan", icon:"🪨", img:"souvenir_thebe.png",
    caption:"Een druppel water, hard geworden tot steen, van de rots waarin Niobe voor altijd blijft wenen." },
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

  // ---- Hoofdstuk 3, Lijn Herakles — nog geen eigen tekeningen (net als de
  // Leeuw van Nemea vóór Hoofdstuk 2 klaarstond); `img` wijst alvast naar het
  // toekomstige bestand en valt tot dan terug op `icon` (spCombatSpriteHTML).
  // Cerberus hergebruikt bewust het bestaande Boss Battle-bestand
  // (assets/bosses/Cerberus.png) — geen losse koppen-bestanden beschikbaar,
  // dus één enkele statische illustratie i.p.v. de Hydra-koppenstapeling.
  centauren: { nm:"De Dronken Centaurenkudde", icon:"🐴", img:"assets/bosses/centauren.png", hp:50,
    intro:"Een woeste kudde centauren, dronken van Pholus' gedeelde wijnkruik en meteen vijandig tegenover elke indringer." },
  kretenzische_stier: { nm:"De Kretenzische Stier", icon:"🐂", img:"assets/bosses/kretenzische_stier.png", hp:55,
    intro:"Een reusachtige, door Neptunus razend gemaakte stier die al jaren de akkers van Kreta verwoest." },
  merries_van_diomedes: { nm:"De Merries van Diomedes", icon:"🐎", img:"assets/bosses/merries_van_diomedes.png", hp:55,
    intro:"Vier merries, afgericht op mensenvlees door hun eigen meester — enkel honger drijft hun waanzin aan." },
  amazones: { nm:"De Amazones", icon:"🏹", img:"assets/bosses/amazones.png", hp:60,
    intro:"Hippolytes trouwe strijdsters, opgehitst door een gerucht dat Juno zelf verspreidde — een gevecht dat nooit had moeten plaatsvinden." },
  geryon: { nm:"Geryon", icon:"👹", img:"assets/bosses/geryon.png", hp:70,
    intro:"Een reus met drie gekoppelde lichamen op één paar benen, die zijn kudde rood vee met drievoudige kracht verdedigt." },
  cerberus: { nm:"Cerberus", icon:"🐕", img:"assets/bosses/Cerberus.png", hp:80,
    intro:"De driekoppige hond die de poort van de onderwereld bewaakt — de zwaarste van alle twaalf beproevingen, en de enige die met blote handen gewonnen moet worden." },

  // ---- Hoofdstuk 4, Lijn Theseus ----
  minotaurus: { nm:"De Minotaurus", icon:"🐃", img:"assets/bosses/minotaurus.png", hp:65,
    intro:"Half mens, half stier — het gevolg van een oude, gebroken belofte van koning Minos — al negen jaar gevoed met Atheens offervlees, en vandaag voor het eerst tegenover iemand die niet van plan is zich te laten offeren." },

  // ---- Hoofdstuk 5 — Het Gulden Vlies ----
  amycus: { nm:"Amycus", icon:"🥊", img:"assets/bosses/amycus.png", hp:55,
    intro:"De reusachtige koning van de Bebryciërs, die elke vreemdeling die aan land komt verplicht tot een bokswedstrijd daagt — een uitdaging die tot nu toe niemand heeft overleefd." },
  drakon_vlies: { nm:"De Draak van Colchis", icon:"🐉", img:"assets/bosses/drakon_vlies.png", hp:75,
    intro:"Een nooit slapende draak, al jaren opgerold rond de boom waar het Gulden Vlies hangt — koning Aeëtes' laatste en zwaarste verdediging." },

  // ---- Hoofdstuk 6 — De Vloek van Thebe ----
  laodamas: { nm:"Laodamas", icon:"🛡️", img:"assets/bosses/laodamas.png", hp:60,
    intro:"De zoon van Eteokles en de laatste verdediger van Thebe's poorten — vastbesloten zijn vaders stad niet te verliezen aan de zonen van de mannen die zijn vader ooit versloeg." },
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
  latijn_iuno:      { taal:"latijn", woord:"Iuno, Iunonis", betekenis:"Juno (godin)" },
  latijn_nuntius:   { taal:"latijn", woord:"nuntius, nuntii", betekenis:"bode, boodschapper" },
  latijn_dea:       { taal:"latijn", woord:"dea, deae", betekenis:"godin" },
  latijn_sapientia: { taal:"latijn", woord:"sapientia, sapientiae", betekenis:"wijsheid" },
  latijn_crotala:   { taal:"latijn", woord:"crotala", betekenis:"(bronzen) ratel" },
  latijn_cerva:     { taal:"latijn", woord:"cerva, cervae", betekenis:"hinde" },
  latijn_pars:      { taal:"latijn", woord:"pars, partis", betekenis:"deel" },
  latijn_promittit: { taal:"latijn", woord:"promittere (promittit)", betekenis:"beloven" },
  latijn_titan:     { taal:"latijn", woord:"Titan, Titanis", betekenis:"titaan" },
  latijn_avis:      { taal:"latijn", woord:"avis, avis", betekenis:"vogel" },

  // ---- Hoofdstuk 4 ----
  latijn_vela:        { taal:"latijn", woord:"velum, veli (mv. vela)", betekenis:"zeil" },
  latijn_mutare:      { taal:"latijn", woord:"mutare (mutat)", betekenis:"veranderen" },
  latijn_iubet:       { taal:"latijn", woord:"iubere (iubet)", betekenis:"bevelen, opdragen" },
  latijn_filum:       { taal:"latijn", woord:"filum, fili", betekenis:"draad" },
  latijn_labyrinthus: { taal:"latijn", woord:"labyrinthus, labyrinthi", betekenis:"doolhof, labyrint" },
  latijn_relinquit:   { taal:"latijn", woord:"relinquere (relinquit)", betekenis:"achterlaten, verlaten" },
  latijn_volare:      { taal:"latijn", woord:"volare (volat)", betekenis:"vliegen" },
  latijn_ala:         { taal:"latijn", woord:"ala, alae", betekenis:"vleugel" },
  latijn_cera:        { taal:"latijn", woord:"cera, cerae", betekenis:"was" },
  latijn_monebat:     { taal:"latijn", woord:"monere (monebat)", betekenis:"waarschuwen" },
  latijn_currus:      { taal:"latijn", woord:"currus, currus", betekenis:"wagen, strijdwagen" },
  latijn_fulmen:      { taal:"latijn", woord:"fulmen, fulminis", betekenis:"bliksem(schicht)" },
  latijn_misit:       { taal:"latijn", woord:"mittere (misit)", betekenis:"sturen, werpen" },
  latijn_soror:       { taal:"latijn", woord:"soror, sororis", betekenis:"zuster" },
  latijn_lacrima:     { taal:"latijn", woord:"lacrima, lacrimae", betekenis:"traan" },
  latijn_cadere:      { taal:"latijn", woord:"cadere (cadit)", betekenis:"vallen" },

  // ---- Hoofdstuk 5 — Het Gulden Vlies ----
  latijn_navis:     { taal:"latijn", woord:"navis, navis", betekenis:"schip" },
  latijn_mare:      { taal:"latijn", woord:"mare, maris", betekenis:"zee" },
  latijn_vellus:    { taal:"latijn", woord:"vellus, velleris", betekenis:"vacht, vlies" },
  latijn_draco:     { taal:"latijn", woord:"draco, draconis", betekenis:"draak" },
  latijn_populus:   { taal:"latijn", woord:"populus, populi", betekenis:"volk" },
  latijn_malleus:   { taal:"latijn", woord:"malleus, mallei", betekenis:"hamer" },
  latijn_aper:      { taal:"latijn", woord:"aper, apri", betekenis:"everzwijn" },
  latijn_regit:     { taal:"latijn", woord:"regere (regit)", betekenis:"sturen, besturen, regeren" },
  latijn_vulnerat:  { taal:"latijn", woord:"vulnerare (vulnerat)", betekenis:"verwonden" },
  grieks_toxon:     { taal:"grieks", woord:"τόξον", transcript:"tóxon", betekenis:"boog" },

  // ---- Hoofdstuk 6 — De Vloek van Thebe ----
  latijn_habere:    { taal:"latijn", woord:"habere (habet)", betekenis:"hebben" },
  latijn_recusare:  { taal:"latijn", woord:"recusare (recusat)", betekenis:"weigeren" },
  latijn_sepelire:  { taal:"latijn", woord:"sepelire (sepelivit)", betekenis:"begraven" },
  latijn_regnum:    { taal:"latijn", woord:"regnum, regni", betekenis:"koninkrijk" },
  latijn_frater:    { taal:"latijn", woord:"frater, fratris", betekenis:"broer" },
  latijn_quadrupes: { taal:"latijn", woord:"quadrupes, quadrupedis", betekenis:"viervoetig" },
  grieks_bakchos:   { taal:"grieks", woord:"Βάκχος", transcript:"Bákchos", betekenis:"Bacchus (bijnaam van Dionysos)" },
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
  // Herakles draagt vanaf CH2_H09 de huid van de Nemeïsche Leeuw als eigen
  // mantel en heeft zijn oude harnas niet meer nodig — hij geeft het aan de
  // (voor de rest van het verhaal onzichtbare) speler.
  "armor:licht":  { flag:"herakles_harnas" },
  // Hoofdstuk 5: bij vertrek uit Iolcus krijgt de hele bemanning van de Argo
  // (dus ook de speler) een standaard reisharnas én een bandana tegen zon en
  // zeewind — één FLAG voor beide, want het is letterlijk hetzelfde moment
  // (zie Chronica.md §5.1 equip-routekaart).
  "armor:middel": { flag:"ch5_bemanning_uitrusting" },
  "helm:bandana": { flag:"ch5_bemanning_uitrusting" },
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
Je laat de kist waar ze is en loopt terug naar het dorp, de ploeg achter je aan. Maar de hele dag, bij elke voor die je trekt, dwaalt je gedachte terug naar dat donkere hout in de aarde — en naar wat je daar misschien hebt laten liggen. Tegen de avond geef je het op: je kunt het niet laten rusten.

CHOICES:

* Keer terug naar het veld en graaf de kist alsnog open -> PRO_003

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

Terwijl Midas zijn dochter omhelst, valt je oog op iets tussen de rozenstruiken bij het pad: één enkele roos, nog altijd star en goudkleurig, die de vloek blijkbaar net had gemist voordat die werd opgeheven. Je raapt hem op — het voelt alsof het Orakel wil dat je dat doet.

CODEX:
codex_gouden_aanraking

PERSON:
midas:full, bacchus:full

SOUVENIR:
souvenir_midas

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

Op de vloer, tussen de scherven van het moment dat Zeus' schedel weer sloot, ligt nog een klein splintertje brons — afkomstig van Hephaistos' bijl. Niemand lijkt het te missen. Je steekt het bij je, met het onbestemde gevoel dat het Orakel dit zo heeft gewild.

CODEX:
codex_geboorte_athena

PERSON:
athena:full

SOUVENIR:
souvenir_athena_geboorte

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

Onderaan de rots gloeit nog een enkel kooltje in de as van een vuur dat allang gedoofd had moeten zijn. Je sluit het in je handen, en het brandt door — alsof het weet dat het Orakel het wil bewaren.

CODEX:
codex_doos_van_pandora

PERSON:
prometheus:full

SOUVENIR:
souvenir_prometheus

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

* Volg het spoor van Latona, een titanide die Jupiters kind draagt en nergens welkom is [DONE:ch2_lijn_latona] -> CH2_L01
* Volg het lot van Semele, een prinses van Thebe die niet weet wie haar minnaar werkelijk is [DONE:ch2_lijn_semele] -> CH2_S01
* Volg Kallisto, een jachtgezellin van Artemis die niemand kan vertrouwen wat ze ziet [DONE:ch2_lijn_kallisto] -> CH2_K01
* Volg Herakles, Zeus' sterfelijke zoon die Hera al haat sinds voor zijn geboorte [DONE:ch2_lijn_herakles] -> CH2_H01
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

IMAGE:
geboorte_apollo_diana.png

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

* Kijk wat er nog met Latona gebeurt, nu haar tweeling geboren is -> CH2_L08B

END

=== SCENE: CH2_L08B ===

TITLE:
De Vijver van de Boeren

TEXT:
Nog uitgeput van de bevalling trekt Latona met haar pasgeboren tweeling verder, op zoek naar water om haar dorst te lessen. Ze vindt een heldere vijver, omringd door boeren die net hun kudden hebben laten drinken — maar wanneer ze vraagt of ze mag drinken, weigeren ze haar zelfs dat kleine gebaar, en roeren ze met opzet de bodem om tot het water te troebel is om te drinken.

Latona, die al zoveel wreedheid heeft doorstaan zonder zich ooit te wreken, verliest voor het eerst haar geduld: ze vervloekt de boeren om voorgoed in hun eigen vijver te blijven leven — als kikkers, kwakend in het water dat ze haar weigerden. Waar hun voeten ooit stonden, groeit nu een enkele witte waterlelie. Je plukt hem voorzichtig — het lijkt bijna of het Orakel al wist dat hij daar zou staan.

SOUVENIR:
souvenir_latona

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

IMAGE:
semele_verteerd.png

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

Tussen de as, ongedeerd, ligt een enkele wijnrank — nog groen, nog levend, alsof het vuur haar bewust had overgeslagen. Je windt hem om je pols; hij verwelkt niet, en zal dat, voor zover je kunt zien, ook nooit doen.

IMAGE:
geboorte_bacchus.png

CODEX:
codex_geboorte_bacchus

PERSON:
semele:full, bacchus:full

SOUVENIR:
souvenir_semele

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

IMAGE:
kallisto_berin.png

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

Op de plek waar Kallisto zojuist nog stond, vind je een enkele haarlok berenvacht, achtergebleven in het gras. In het donker lijkt hij zwak te glanzen — bijna alsof er nog een beetje sterrenlicht in is blijven hangen. Je stopt hem weg, met het vage gevoel dat het Orakel dat wil.

IMAGE:
kallisto_sterrenbeeld.png

CODEX:
codex_metamorfose_kallisto

PERSON:
kallisto:full, diana:full

SOUVENIR:
souvenir_kallisto

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

IMAGE:
herakles_nasleep.png

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

Voor hij verdergaat, houdt Herakles even stil en kijkt, met een blik die net iets te gericht is voor toeval, recht in jouw richting — alsof hij, net als Athena eerder dit hoofdstuk, iets aanvoelt van een aanwezigheid die niemand anders opmerkt. "Een boodschapper die dit allemaal ziet gebeuren, verdient beter dan vodden onder een geleende mantel," zegt hij, en gooit zijn eigen, nu overbodige harnas in jouw richting — het brons dat hij droeg voor de leeuwenhuid het overbodig maakte. "Ik heb het toch niet meer nodig." Het landt zwaarder in je handen dan je had verwacht, nog warm en ruikend naar ijzer en Nemeïsch stof.

FLAG:
herakles_harnas=true

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

Bij het aantrekken van zijn nieuwe leeuwenhuid-mantel raakt er één klauw los, te klein om te missen tussen zoveel meer. Herakles merkt het niet eens; jij raapt hem op, met het vertrouwde gevoel dat het Orakel dit soort dingen graag bewaard ziet.

CODEX:
codex_herakles_beproevingen

PERSON:
herakles:full, megara:intro

SOUVENIR:
souvenir_herakles_leeuw

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

IMAGE:
athena_mentor_ch2.png

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

CHOICES:

* Stap door de poort -> CH3_000

END
`.trim();

/* ---- HOOFDSTUK 3 — "Beloften van Goden en Mensen" (SP_CAMPAIGN ch3).
   Twee kiesbare hoofdlijnen i.p.v. Hoofdstuk 2's vier: IO (met Argus Panoptes
   en Mercurius als climax van diezelfde lijn, en een Europa-coda erin
   verweven als NPC-commentaar, niet als eigen lijn) en HERAKLES (de
   resterende tien van zijn twaalf werken, na de eerste twee uit Hoofdstuk 2).
   Elke lijn levert een eigen Herinneringsfragment ("io", "labores" — bewust
   ANDERE ids dan Hoofdstuk 2's "herakles", want SP_STATE.fragments is één
   doorlopende, hoofdstuk-overschrijdende array); de hub-gate naar het Orakel
   staat daarom op [REQUIRE:fragments=6] (Hoofdstuk 2's vier + deze twee).
   Grammatica dit hoofdstuk: genitivus, dativus, bijstelling — zie
   codex_grammatica_ch3_*. Athena is sinds CH2_ATHENA actieve mentor, dus
   spreekt vanaf hier gewoon mee in scènes i.p.v. zwijgend toe te kijken.
   Vanaf dit hoofdstuk reageren NPC's ook voor het eerst op de stil
   opgebouwde Clementia/Severitas-houding via {tendency_address}/
   {tendency_address_cap} (SpTextResolver, singleplayer.js). ---- */
const SP_CH3_CNS = `
=== SCENE: CH3_000 ===

TITLE:
Beloften van Goden en Mensen

TEXT:
De boodschapper wijst naar twee nieuwe scheuren in de werkelijkheid, dicht naast elkaar. "Ditmaal geen vier lijnen," zegt ze, "maar twee — al blijkt de ene, zodra je erin stapt, meer dan één verhaal in zich te dragen. Volg Io, en je zult ontdekken hoe ver een god gaat om zijn eigen ontrouw te verbergen. Volg Herakles, en je ziet hoe ver een sterveling gaat om een schuld in te lossen die niet eens helemaal de zijne was."

Athena staat er dit keer niet zwijgend bij — ze knikt je toe, kort maar oprecht, zoals een mentor doet die weet dat je de rest zelf aankunt.

CODEX:
codex_grammatica_ch3_genitivus, codex_grammatica_ch3_dativus, codex_grammatica_ch3_bijstelling

CHOICES:

* Volg Io, priesteres van Juno en Jupiters volgende geheime liefde [DONE:ch3_lijn_io] -> CH3_IO01
* Volg Herakles, die tien beproevingen te gaan heeft [DONE:ch3_lijn_herakles] -> CH3_H01
* Spreek het Orakel aan, nu beide verhalen zijn gehoord [REQUIRE:fragments=6] -> CH3_ATHENA

END

=== SCENE: CH3_IO01 ===

TITLE:
Io, Priesteres van Juno

TEXT:
Io dient als priesteres in de tempel van Juno te Argos — een leven van rust en toewijding aan een godin die, dat weet ze nog niet, straks haar felste vijand zal worden. Ze is de dochter van de riviergod Inachus, en niemand in Argos twijfelt aan haar vroomheid.

Jupiter, die haar op een dag bij de rivier ziet, vergeet moeiteloos dat ze uitgerekend aan zijn eigen vrouw is toegewijd. Voor hem is dat geen reden tot terughoudendheid — eerder een uitdaging.

PERSON:
io:intro, hera:intro

CHOICES:

* Kijk hoe Jupiter zijn kans grijpt -> CH3_IO02

END

=== SCENE: CH3_IO02 ===

TITLE:
Een Wolk op een Heldere Dag

TEXT:
Jupiter, die weet dat zijn vrouw elke onverklaarbare afwezigheid van hem wantrouwt, bedenkt ditmaal geen list met een vermomming maar met verhulling: hij trekt een dichte, donkere wolk over de vallei van Argos, zodat niemand — sterveling noch god — kan zien wat daarbinnen gebeurt.

Io, die de wolk ziet naderen op een verder onbewolkte dag, voelt eerder onbehagen dan nieuwsgierigheid. Tegen de tijd dat ze begrijpt wie er werkelijk voor haar staat, is er allang geen weg meer terug.

PUZZLE:
puzzle_ch3io_genitivus

CHOICES:

* Kijk wat er gebeurt wanneer de wolk optrekt -> CH3_IO03

END

=== SCENE: CH3_IO03 ===

TITLE:
Een Vaars in Plaats van een Vrouw

TEXT:
Juno, hoog op de Olympos, ziet de vreemde wolk hangen op een verder kraakheldere dag — en herkent onmiddellijk het patroon van haar mans vindingrijkheid. Ze daalt af om poolshoogte te nemen, sneller dan Jupiter had verwacht.

In doodsangst grijpt hij naar de enige list die hem nog rest: hij verandert Io ter plekke in een sneeuwwitte vaars, ogenblikken voordat Juno de wolk binnenstapt. Io, gevangen in een lichaam dat niet het hare is, kan niet eens meer roepen wat er zojuist met haar is gebeurd.

CHOICES:

* Voel medelijden met Io, die niets van dit alles heeft gekozen [CLEMENTIA] -> CH3_IO04
* Voel vooral verachting voor Jupiters lafheid — hij redt zichzelf, niet haar [SEVERITAS] -> CH3_IO04
* Kijk toe, niet goed wetend wie hier meer medelijden verdient [NEUTRAL] -> CH3_IO04

END

=== SCENE: CH3_IO04 ===

TITLE:
Een Ongemakkelijk Cadeau

TEXT:
Juno, die de vaars met een half oog bekijkt en meteen doorheeft dat er iets niet klopt aan een dier van zo'n opvallende schoonheid, prijst hem overdreven hardop — en vraagt Jupiter dan, met een glimlach die geen weigering toestaat, of ze de vaars als geschenk mag krijgen.

Jupiter, die weet dat weigeren zijn schuld zou bevestigen, heeft geen enkele uitweg meer. Met tegenzin geeft hij Io — nog altijd gevangen in haar eigen, sprakeloze lichaam — aan de vrouw die haar het felst zal blijven haten.

PUZZLE:
puzzle_ch3io_dativus

CHOICES:

* Kijk wat Juno met haar nieuwe bezit van plan is -> CH3_IO05

END

=== SCENE: CH3_IO05 ===

TITLE:
Argus Panoptes, de Honderdogige Wachter

TEXT:
Juno vertrouwt haar nieuwe vaars toe aan Argus Panoptes, een reus met honderd ogen verspreid over zijn hele lichaam — nooit voluit slapend, want terwijl een deel van zijn ogen rust, blijven de andere onophoudelijk open. Geen betere wachter bestaat er op aarde of Olympos.

Io wordt vastgebonden aan een olijfboom in een weiland, dag en nacht bekeken door een wezen dat nooit werkelijk wegkijkt.

IMAGE:
argus_bewaakt_io.png

PERSON:
argus:intro

CHOICES:

* Kijk hoe Io haar nieuwe gevangenschap doorstaat -> CH3_IO06

END

=== SCENE: CH3_IO06 ===

TITLE:
Een Naam in het Zand

TEXT:
Io, die geen menselijk woord meer kan uitbrengen, ontdekt op een dag dat haar eigen vader Inachus — de riviergod naar wie ze vernoemd is — langs de oever van zijn rivier loopt, zoekend naar de dochter die spoorloos is verdwenen. Wanhopig schrijft ze met haar hoef de enige letters die ze nog kan vormen in het zachte zand aan de rivieroever: haar eigen naam.

Inachus, die het schrift herkent en dan pas beseft welk dier voor hem staat, breekt bijna van verdriet — een vader die zijn dochter eindelijk terugvindt, enkel om te ontdekken dat hij haar niet meer kan redden.

CHOICES:

* Blijf bij dit moment stilstaan, geraakt door zoveel onmacht [CLEMENTIA] -> CH3_IO07
* Concludeer nuchter dat medelijden hier niets zal veranderen [SEVERITAS] -> CH3_IO07
* Kijk toe, zonder goed te weten wat je met dit verdriet aan moet [NEUTRAL] -> CH3_IO07

END

=== SCENE: CH3_IO07 ===

TITLE:
Jupiter Stuurt Hulp

TEXT:
Jupiter, die Io's lijden vanaf de Olympos gadeslaat en het niet langer kan verdragen — deels uit schuldgevoel, deels omdat hij nog altijd niet van haar af wil — roept Mercurius bij zich, zijn vleugelvoetige boodschapper, net zo bedreven in list en welbespraaktheid als in snelheid.

"Argus moet slapen," zegt Jupiter simpelweg, "en jij bent de enige die daarin kan slagen."

PERSON:
hermes:intro

CHOICES:

* Volg Mercurius op zijn missie -> CH3_IO08

END

=== SCENE: CH3_IO08 ===

TITLE:
De Herder met de Fluit

TEXT:
Mercurius verkleedt zich als een eenvoudige herder en gaat naast Argus zitten, zijn vleugelsandalen en staf zorgvuldig verborgen. Hij speelt op een rietfluit, de syrinx, en vertelt daarna verhaal na verhaal — traag, meanderend, doelbewust saai op de plekken waar Argus' aandacht het meest dreigt te verslappen.

Oog na oog sluit zich, tot zelfs de laatste paar — die altijd als laatste wakker blijven — eindelijk toegeven aan de slaap.

PUZZLE:
puzzle_ch3io_bijstelling

CHOICES:

* Kijk wat Mercurius doet zodra Argus eindelijk volledig slaapt -> CH3_IO09

END

=== SCENE: CH3_IO09 ===

TITLE:
Honderd Ogen, voor het Laatst Gesloten

TEXT:
Zodra ook het laatste oog is gesloten, aarzelt Mercurius geen moment langer — hij doodt de slapende wachter met een enkele, geoefende slag, en bevrijdt Io van haar ketting aan de olijfboom. Ze rent weg, nog altijd een vaars, maar voor het eerst in weken zonder honderd ogen die haar volgen.

Juno, die het nieuws van Argus' dood ontvangt, rouwt oprecht — hij diende haar trouw tot het einde.

CODEX:
codex_io_argus

CHOICES:

* Kijk hoe Juno haar trouwe wachter eert -> CH3_IO10

END

=== SCENE: CH3_IO10 ===

TITLE:
Honderd Ogen op een Pauwenstaart

TEXT:
Juno neemt Argus' honderd ogen, één voor één, en plaatst ze voor eeuwig op de staart van haar heilige vogel — de pauw. Sindsdien draagt elke pauw ter wereld het waakzame erfgoed van een wachter die zijn plicht met zijn leven bekocht, zichtbaar voor iedereen die ooit een pauwenstaart open ziet vallen.

Maar Argus' dood lost niets op voor Io zelf — Juno, nu pas echt woedend, zoekt onmiddellijk naar een nieuwe manier om haar te kwellen.

IMAGE:
pauw_ogen_argus.png

CHOICES:

* Wacht af wat Juno nu bedenkt -> CH3_IO11

END

=== SCENE: CH3_IO11 ===

TITLE:
De Steekvlieg

TEXT:
Juno stuurt een steekvlieg — oestrus — die Io onophoudelijk achtervolgt en steekt, dag na dag, nacht na nacht, zonder ooit rust te gunnen. Krankzinnig van de pijn rent Io de wereld rond, over zeeën die naar haar vernoemd zullen worden en langs een zeestraat die later de "Runnenoversteek" — Bosporus — zal heten, precies vanwege haar wanhopige tocht als vaars.

Je volgt haar over land en zee, door berg na vallei na kust, terwijl ze wegrent van een pijn die haar overal blijft vinden.

CHOICES:

* Blijf haar volgen, hoe uitputtend het ook wordt -> CH3_IO12

END

=== SCENE: CH3_IO12 ===

TITLE:
Aangespoeld in Egypte

TEXT:
Na weken van doelloze, door pijn gedreven vlucht bereikt Io uiteindelijk de oever van de Nijl in Egypte, uitgeput tot op het bot, haar krachten voorgoed verbruikt. Daar, aan de rand van een rivier die niets met haar eigen vader gemeen heeft, zakt ze eindelijk neer — te moe zelfs om nog te vluchten.

Jupiter, die haar lijden al die tijd is blijven volgen, beseft dat dit de laatste kans is om het goed te maken, tegenover Io en tegenover zichzelf.

CHOICES:

* Kijk wat Jupiter nu onderneemt -> CH3_IO13

END

=== SCENE: CH3_IO13 ===

TITLE:
Terug in Menselijke Gedaante

TEXT:
Jupiter zweert Juno plechtig dat hij Io nooit meer zal aanraken als minnares — een belofte die, voor deze ene keer, oprecht genoeg klinkt om Juno te doen toegeven. Ze laat de vloek los, en Io krijgt haar menselijke gedaante terug, huilend van opluchting op de oever van de Nijl.

In Egypte baart ze Jupiters zoon Epaphus, en wordt ze door de Egyptenaren vereerd als een godin op zichzelf — vereenzelvigd met Isis, wier verering zich van daaruit over de hele Middellandse Zee zal verspreiden. Wat begon als vervolging eindigt, tegen alle verwachting in, als een nieuw soort goddelijkheid.

Op de oever, half tussen het riet, ligt een enkele pauwenveer — met, midden in het patroon, iets dat verdacht veel op een oog lijkt. Je herkent het meteen: een van Argus' honderd ogen, ver van de rest van de staart geraakt. Je bewaart hem, zoals het Orakel dat wil.

CODEX:
codex_io_argus

PERSON:
io:full, argus:full, hermes:full

SOUVENIR:
souvenir_io

EERETITEL:
ch3_io

QUEST:
quest_boodschapper_van_kronos: lijn Io afgerond (Hoofdstuk 3)

FLAG:
ch3_lijn_io=true

FRAGMENT:
io

CHOICES:

* Wacht op wat Athena hierover te zeggen heeft -> CH3_IO14

END

=== SCENE: CH3_IO14 ===

TITLE:
Athena over Europa

TEXT:
Athena, die het hele verhaal zwijgend heeft gadegeslagen zoals ze dat sinds Hoofdstuk 2 wel vaker doet voor ze uiteindelijk toch iets zegt, kijkt je nu recht aan. "Je hebt Io gezien worden veranderd in een dier om Jupiters ontrouw te verbergen," zegt ze. "Onthoud die vorm goed — want ergens anders, op ditzelfde moment, speelt hetzelfde patroon zich af met de rollen omgekeerd."

Ze vertelt, kort maar met duidelijke afkeuring in haar stem, over Europa: een Fenicische prinses die met haar dienaressen op het strand speelt, tot een opvallend tamme, sneeuwwitte stier zich bij de kudde voegt. Europa, argeloos, klimt op zijn rug — en de stier, die Jupiter zelf is, zwemt met haar de zee op, helemaal naar Kreta. Daar zal ze drie zonen baren, onder wie Minos — een naam die je, zegt Athena met een blik die meer weet dan ze nu al prijsgeeft, nog wel eens terug zult horen.

"Bij Io wordt de vrouw een dier om de affaire te verbergen," besluit Athena. "Bij Europa wordt de god zelf een dier om de affaire te beginnen. Twee kanten van dezelfde ontrouw — en jij, {tendency_address}, hebt inmiddels wel gemerkt dat Jupiter zelden de prijs betaalt die anderen voor hem betalen."

IMAGE:
europa_stier.png

CODEX:
codex_europa

PERSON:
europa:intro

CHOICES:

* Keer terug naar de Boodschapper — Herakles' beproevingen wachten nog -> CH3_000

END

=== SCENE: CH3_H01 ===

TITLE:
Acht Beproevingen te Gaan

TEXT:
Twee van Herakles' twaalf werken liggen achter hem — de Nemeïsche Leeuw gewurgd, de Hydra van Lerna verslagen met vuur, al telt Eurystheus die laatste vanwege Iolaos' hulp niet volwaardig mee. Tien beproevingen resten er nog, en Eurystheus, veilig verscholen achter de rand van zijn bronzen pot, kondigt de derde alvast aan met zichtbaar plezier in de moeilijkheidsgraad die hij ditmaal heeft bedacht.

"Geen monster deze keer," zegt hij. "Een hert. Hoe moeilijk kan dat nu helemaal zijn?"

CHOICES:

* Wacht af wat er zo lastig kan zijn aan een hert -> CH3_H02

END

=== SCENE: CH3_H02 ===

TITLE:
De Cerynitische Hinde

TEXT:
Het "hert" blijkt de Cerynitische Hinde te zijn — een dier met gouden gewei en bronzen hoeven, heilig aan Diana zelf, zo snel dat geen enkele jager het ooit heeft kunnen vangen. Het doden ervan zou Diana's woede over Herakles afroepen; het simpelweg laten lopen zou de opdracht onvervuld laten.

Herakles kiest voor geduld in plaats van kracht: hij volgt het spoor van de hinde, zonder ooit dichtbij genoeg te komen om te jagen, een vol jaar lang, door bergen en valleien tot ver buiten Griekenland.

PUZZLE:
puzzle_ch3h_genitivus

CHOICES:

* Kijk hoe die lange achtervolging eindigt -> CH3_H03

END

=== SCENE: CH3_H03 ===

TITLE:
Gevangen zonder een Wond

TEXT:
Uiteindelijk, uitgeput en zonder enige list meer over, ziet Herakles zijn kans wanneer de hinde probeert een rivier over te steken — hij grijpt haar vast zonder haar te verwonden, precies op het moment dat Diana zelf verschijnt, woedend over wie haar heilige dier durft aan te raken.

Herakles legt uit wat Eurystheus van hem eist, en belooft de hinde ongedeerd vrij te laten zodra hij haar heeft getoond. Diana, die zijn oprechtheid herkent, staat het toe — op voorwaarde dat hij zijn belofte ook werkelijk nakomt.

CHOICES:

* Kijk of Herakles zijn woord houdt -> CH3_H04

END

=== SCENE: CH3_H04 ===

TITLE:
De Erymanthische Ever

TEXT:
De vierde beproeving voert Herakles naar de besneeuwde hellingen van de berg Erymanthos, waar een reusachtige ever huishoudt. Onderweg zoekt hij onderdak bij de wijze centaur Pholus, die hem gastvrij ontvangt en, tegen beter weten in, een kruik wijn opent die aan alle centauren gezamenlijk toebehoort.

De geur van de wijn trekt al snel de rest van de centaurenkudde aan — dronken, wild, en meteen agressief bij het zien van een indringer aan hun gezamenlijke voorraad.

PERSON:
pholus:intro

CHOICES:

* Kijk hoe Herakles zich verdedigt tegen de woedende kudde -> CH3_H05

END

=== SCENE: CH3_H05 ===

TITLE:
De Centaurenstrijd

TEXT:
Herakles grijpt naar zijn pijlen — dezelfde die hij ooit doopte in het onuitwisbare gif van de Hydra van Lerna — en verdedigt zichzelf tegen de aanstormende centauren, die in hun dronken woede geen onderscheid meer maken tussen indringer en oude vriendschap.

COMBAT:
centauren

CHOICES:

* Kijk wat de vergiftigde pijlen hebben aangericht -> CH3_H06

END

=== SCENE: CH3_H06 ===

TITLE:
Chiron

TEXT:
Te midden van de chaos raakt een van Herakles' pijlen, afgeketst of simpelweg verdwaald, zijn eigen oude leermeester Chiron — de wijze, onsterfelijke centaur die hem ooit, jaren geleden, onderwees in geneeskunde, muziek en rechtvaardigheid. Chiron, anders dan de andere centauren, was nooit vijandig — hij stond enkel toevallig te dichtbij.

Het gif van de Hydra, dat geen enkele wond ooit laat helen, brengt Chiron ondraaglijke pijn — en omdat hij onsterfelijk is, kan hij niet eens sterven om er een einde aan te maken. Herakles, ontzet over wat hij zijn eigen leermeester heeft aangedaan, kan niets anders doen dan toekijken.

CHOICES:

* Voel intens medelijden met Chiron, gestraft voor andermans dronkenschap [CLEMENTIA] -> CH3_H07
* Erken de wrede ironie zonder je erin te laten meeslepen — Herakles moet door [SEVERITAS] -> CH3_H07
* Weet niet goed hoe je dit noodlot moet plaatsen [NEUTRAL] -> CH3_H07

END

=== SCENE: CH3_H07 ===

TITLE:
Een Onsterfelijkheid Weggegeven

TEXT:
Chiron zal, jaren later, zijn eigen onsterfelijkheid vrijwillig afstaan aan Prometheus — nog altijd geketend aan zijn rots, nog altijd dagelijks gekweld door een adelaar — om zo eindelijk zelf verlost te worden van een pijn die nooit meer zal helen. Het is een verhaal dat nog moet gebeuren, maar dat Herakles, terwijl hij nu wegloopt van het bloedbad dat hij per ongeluk heeft aangericht, al met zich meedraagt als een schuld naast al zijn andere schulden.

De ever zelf blijkt, na dit alles, het makkelijkste deel van de beproeving: Herakles drijft hem een diepe sneeuwbank in, waar het uitgeputte dier vastraakt en levend gevangen kan worden. Eurystheus, bij het zien van de ever, duikt voor de zoveelste keer zijn bronzen pot in.

CODEX:
codex_chiron

CHOICES:

* Ga door naar de volgende, heel andere soort beproeving -> CH3_H08

END

=== SCENE: CH3_H08 ===

TITLE:
De Augiasstal

TEXT:
De vijfde taak is geen gevecht maar een vernedering, bewust zo gekozen door Eurystheus: de stallen van koning Augias, die duizenden runderen huisvesten en al jaren niet zijn uitgemest, in slechts één enkele dag volledig schoonmaken. Geen sterveling, laat staan een held, heeft ooit zoiets geprobeerd.

Herakles, die zijn kracht ditmaal niet kan gebruiken, sluit in het geheim een overeenkomst met Augias: een tiende van zijn kudde in ruil voor het karwei — zonder te vermelden dat hij dit sowieso al van Eurystheus moet doen.

PUZZLE:
puzzle_ch3h_dativus

CHOICES:

* Kijk hoe Herakles het onmogelijke voor elkaar krijgt -> CH3_H09

END

=== SCENE: CH3_H09 ===

TITLE:
Twee Rivieren Omgeleid

TEXT:
In plaats van te scheppen en te vegen, breekt Herakles simpelweg de muren aan beide kanten van de stallen open en leidt de rivieren Alpheus en Peneus er dwars doorheen — het water spoelt in enkele uren weg wat generaties vee hebben achtergelaten, en laat de stallen schoner achter dan ze ooit zijn geweest.

Augias, die achteraf spijt krijgt van zijn belofte, weigert de afgesproken kudde te betalen. En Eurystheus, die hoort dat Herakles voor deze taak (bijna) betaald zou zijn geweest, verklaart — net als bij de Hydra — dat ook deze beproeving niet meetelt, puur op een technisch punt.

IMAGE:
augiasstal.png

CODEX:
codex_augiasstal

CHOICES:

* Ga door naar de zesde beproeving, ondanks de onrechtvaardige afwijzing -> CH3_H10

END

=== SCENE: CH3_H10 ===

TITLE:
De Stymfalische Vogels

TEXT:
Een zwerm vleesetende vogels met bronzen snavels, klauwen en veren scherp genoeg om als pijlen te dienen, teistert het moerasgebied bij het meer Stymfalos — te talrijk en te goed verscholen in het dichte riet om met kracht alleen te bestrijden.

Athena, die sinds Hoofdstuk 2 niet langer zwijgend toekijkt maar actief helpt waar ze kan, verschijnt met een geschenk van Hephaistos: een bronzen ratel, krotala genoemd, luid genoeg om zelfs de sluwste vogels uit hun schuilplaats te jagen.

PUZZLE:
puzzle_ch3h_bijstelling

PERSON:
athena:full

CHOICES:

* Kijk wat er gebeurt zodra de vogels opvliegen -> CH3_H11

END

=== SCENE: CH3_H11 ===

TITLE:
Vogels uit het Riet

TEXT:
Herakles schudt de ratel met een lawaai dat over het hele moeras schalt — duizenden vogels stijgen tegelijk op, verrast en ontregeld, weg uit het riet waarin geen enkel wapen ze ooit had kunnen bereiken. Boven het open water, waar ze zich nergens meer kunnen verschuilen, is geen kracht meer nodig — enkel een rustige hand en een oog dat weet waar te mikken.

PUZZLE:
puzzle_ch3h_dativus2

CHOICES:

* Kijk hoe deze beproeving wordt afgesloten -> CH3_H12

END

=== SCENE: CH3_H12 ===

TITLE:
De Kretenzische Stier

TEXT:
Op Kreta huishoudt een reusachtige stier die Neptunus ooit aan koning Minos schonk — en die Minos, in plaats van hem te offeren zoals afgesproken, voor zichzelf hield. Neptunus, beledigd, maakte het dier razend, en het verwoest sindsdien akker na akker over het hele eiland.

Minos, allang blij om van het beest af te zijn, staat Herakles zonder aarzeling toe om het mee te nemen — al weet niemand op Kreta nog wat er met de stier moet gebeuren zodra hij eenmaal gevangen is.

COMBAT:
kretenzische_stier

CHOICES:

* Kijk waar Herakles de gevangen stier naartoe brengt -> CH3_H13

END

=== SCENE: CH3_H13 ===

TITLE:
Losgelaten bij Marathon

TEXT:
Herakles brengt de bedwongen stier helemaal naar Eurystheus, die — zoals inmiddels een vast patroon is geworden — meteen zijn bronzen pot induikt bij het zien van het woeste dier. Zonder verder nut voor de koning wordt de stier losgelaten in de vlakte bij Marathon, waar hij jarenlang zal blijven rondzwerven.

Je voelt, zonder precies te weten waarom, dat dit dier zijn verhaal nog niet af heeft — ergens in de toekomst zal een andere held de "Marathonische Stier" nog moeten temmen.

CHOICES:

* Ga door naar de zevende beproeving -> CH3_H14

END

=== SCENE: CH3_H14 ===

TITLE:
De Merries van Diomedes

TEXT:
Koning Diomedes van Thracië bezit vier merries die niet op hooi maar op mensenvlees zijn afgericht — nietsvermoedende reizigers die zijn koninkrijk binnenkomen, worden hem regelmatig voorgeworpen als voer. Eurystheus draagt Herakles op de merries levend naar Mycene te brengen.

Herakles, die het paleis binnendringt en de stallen probeert te bereiken, ontdekt al snel dat Diomedes zijn wachters niet zomaar zal laten passeren.

COMBAT:
merries_van_diomedes

CHOICES:

* Kijk hoe Herakles de merries uiteindelijk kalmeert -> CH3_H15

END

=== SCENE: CH3_H15 ===

TITLE:
Poëtische Gerechtigheid

TEXT:
Herakles overmeestert Diomedes zelf en, in een wraak die niemand hem kwalijk neemt, voert de koning aan zijn eigen mensenetende merries — die, eenmaal verzadigd, plotsklaps kalm en handelbaar worden, alsof enkel honger hun waanzin had gevoed. Wat begon als een verschrikking eindigt met een vreemd soort rechtvaardigheid.

Hij leidt de nu rustige dieren naar Mycene, waar Eurystheus ze, na de gebruikelijke vlucht in zijn pot, laat vrijlaten op de berg Olympos zelf.

CHOICES:

* Ga door naar de achtste beproeving -> CH3_H16

END

=== SCENE: CH3_H16 ===

TITLE:
De Gordel van Hippolyte

TEXT:
Eurystheus' dochter begeert de gordel van Hippolyte, koningin van de Amazones — een geschenk ooit van Mars zelf, symbool van haar gezag over haar volk. Herakles reist naar hun land, verwachtend een gevecht, maar Hippolyte, onder de indruk van zijn reputatie, biedt de gordel spontaan en vreedzaam aan.

Voor één keer lijkt een beproeving zonder bloedvergieten te kunnen eindigen.

CHOICES:

* Vertrouw op deze vreedzame afloop, opgelucht dat het geweld hier uitblijft [CLEMENTIA] -> CH3_H17
* Blijf op je hoede — na alles wat je hebt gezien, wantrouw je een te gemakkelijke afloop [SEVERITAS] -> CH3_H17
* Wacht simpelweg af of het inderdaad zo eenvoudig blijft [NEUTRAL] -> CH3_H17

END

=== SCENE: CH3_H17 ===

TITLE:
Juno's Laatste List

TEXT:
Juno, die Herakles al sinds zijn geboorte haat en dit ongewoon vreedzame verloop niet kan verdragen, vermomt zich als een Amazone en verspreidt onder de kudde het gerucht dat de vreemdeling van plan is hun koningin te ontvoeren. Paniek en verwarring breken uit voor iemand de leugen kan ontkrachten.

In de chaos die volgt, vallen de Amazones Herakles' schip aan — en Hippolyte zelf komt om, niet door zijn hand met opzet, maar in een gevecht dat nooit had moeten plaatsvinden als Juno zich er niet mee had bemoeid.

COMBAT:
amazones

CHOICES:

* Draag de gordel mee, zwaarder dan hij had moeten zijn -> CH3_H18

END

=== SCENE: CH3_H18 ===

TITLE:
Het Vee van Geryon

TEXT:
De tiende beproeving voert Herakles naar het uiterste westen van de bekende wereld, naar Geryon — een reus met drie gekoppelde lichamen op één paar benen, eigenaar van een kudde rood vee bewaakt door een tweekoppige hond. Onderweg splijt Herakles een berg in tweeën om een doorgang naar de oceaan te scheppen: de rotsen die aan weerszijden achterblijven, zullen eeuwenlang bekendstaan als de Zuilen van Herakles.

De doorgang die hij zo schept, markeert voortaan de rand van de wereld die de Ouden kennen — en de poort naar alles wat daarbuiten ligt.

CHOICES:

* Kijk hoe Herakles de kudde probeert te bemachtigen -> CH3_H19

END

=== SCENE: CH3_H19 ===

TITLE:
Drie Lichamen, Eén Val

TEXT:
Geryon, gewaarschuwd door het geblaf van zijn tweekoppige waakhond, komt zelf met al drie zijn lichamen tegelijk aanstormen om zijn kudde te verdedigen — een tegenstander die, in tegenstelling tot de meeste andere beproevingen, drie keer zoveel klappen kan uitdelen als een gewone man.

COMBAT:
geryon

CHOICES:

* Drijf de veroverde kudde helemaal terug naar Mycene -> CH3_H20

END

=== SCENE: CH3_H20 ===

TITLE:
De Appels van de Hesperiden

TEXT:
De elfde taak voert Herakles naar de tuin van de Hesperiden, aan de rand van de wereld, waar een boom met gouden appels groeit — een huwelijksgeschenk van Gaia aan Juno zelf, bewaakt door de nooit-slapende draak Ladon, wiens honderd koppen (zo vertelt men, al is niemand het helemaal eens over het exacte aantal) zich eindeloos om de stam winden.

Herakles, die weet dat kracht alleen hier niet genoeg zal zijn — geen zwaard doorboort honderd koppen tegelijk — herkent het patroon meteen: hetzelfde probleem als Argus Panoptes, alleen dan met een dier dat zich nooit láát afleiden door verhalen of fluitspel. In plaats daarvan valt hij terug op wat hij bij de Cerynitische Hinde al leerde: geduld. Nacht na nacht bestudeert hij hoe de koppen bewegen, tot hij het ene ogenblik ontdekt waarop ze allemaal, even, dezelfde kant op kijken.

PUZZLE:
puzzle_ch3h_genitivus2

CHOICES:

* Kijk hoe Herakles daarna de appels zelf probeert te bemachtigen -> CH3_H21

END

=== SCENE: CH3_H21 ===

TITLE:
De Last van Atlas

TEXT:
Met Ladon omzeild weet Herakles nog altijd niet hoe hij zelf de appels mag plukken — enkel de titaan Atlas, die de hemel op zijn schouders draagt vlakbij de tuin, kent de weg naar de boom zonder het lot van de wachter te delen. Herakles biedt aan tijdelijk de hemel over te nemen, zodat Atlas de appels voor hem kan halen.

Atlas, eindelijk bevrijd van een last die hij al eeuwen torst, plukt de appels — en overweegt dan hardop om nooit meer terug te komen, Herakles voorgoed achterlatend onder het gewicht van de hemel.

IMAGE:
atlas_hemel.png

PUZZLE:
puzzle_ch3h_bijstelling2

CHOICES:

* Kijk hoe Herakles zich uit deze list weet te redden -> CH3_H22

END

=== SCENE: CH3_H22 ===

TITLE:
De Hemel Teruggegeven

TEXT:
Herakles, die doorziet wat Atlas van plan is, speelt het spel mee: hij vraagt slechts om een kort moment om zijn mantel op te vouwen als kussen onder de last. Atlas, zonder enig wantrouwen, neemt de hemel nog één keer over — en Herakles grijpt op datzelfde ogenblik de appels en loopt weg, de titaan voorgoed achterlatend met zijn oorspronkelijke last.

Met de appels veilig bij Eurystheus (die ze, zodra hij zeker weet dat Herakles echt weg is, teruggeeft aan Athena, want een sterveling mag zulke goddelijke vruchten niet permanent bezitten) rest er nog maar één beproeving — de zwaarste van allemaal.

CODEX:
codex_atlas

CHOICES:

* Wacht af wat Eurystheus voor de twaalfde en laatste taak heeft bedacht -> CH3_H23

END

=== SCENE: CH3_H23 ===

TITLE:
De Twaalfde Taak

TEXT:
Eurystheus, die na elf beproevingen wanhopig op zoek is naar iets wat Herakles onmogelijk kan volbrengen, bedenkt uiteindelijk de zwaarste opdracht van allemaal: Cerberus, de driekoppige hond die de poort van de onderwereld bewaakt, levend naar Mycene brengen — zonder wapens, met enkel blote handen.

Hades zelf, wanneer Herakles via een grot bij Tainaron afdaalt naar zijn rijk, staat de beproeving toe — op voorwaarde dat Herakles Cerberus zonder geweld overmeestert. Athena en Mercurius, beiden inmiddels vertrouwde bondgenoten, begeleiden hem tot aan de rand van de onderwereld.

PERSON:
hermes:full

CHOICES:

* Daal af naar de poort van de onderwereld -> CH3_H24

END

=== SCENE: CH3_H24 ===

TITLE:
Cerberus, aan de Poort van de Onderwereld

TEXT:
Cerberus, drie koppen op één enkel, reusachtig lichaam, elk met een gegrom dat zelfs schaduwen doet terugdeinzen, bewaakt de poort zoals hij dat al eeuwen doet — niemand levend naar binnen, niemand dood weer naar buiten.

Herakles, die zijn wapens heeft achtergelaten zoals beloofd, stapt op het beest af met enkel zijn blote handen en een leeuwenhuid als enige bescherming.

COMBAT:
cerberus

CHOICES:

* Kijk hoe Herakles het driekoppige beest weet te overmeesteren -> CH3_H25

END

=== SCENE: CH3_H25 ===

TITLE:
Twaalf Werken Volbracht

TEXT:
Herakles bedwingt Cerberus met blote handen, precies zoals afgesproken, en draagt hem — grommend, maar ongedeerd — helemaal naar Mycene. Eurystheus, bij het zien van het driekoppige monster op zijn eigen binnenplaats, duikt voor de allerlaatste keer zijn bronzen pot in en smeekt Herakles het beest onmiddellijk terug te brengen naar waar het vandaan kwam.

Herakles brengt Cerberus, zoals beloofd, ongedeerd terug naar de onderwereld — en met die laatste daad zijn alle twaalf werken volbracht. Tien jaar dienstbaarheid, opgelegd door een orakel na de ergste daad van zijn leven, eindigen hier. De schuld die hij droeg sinds die vreselijke dag met Megara en hun kinderen is, voor zover een orakel dat kan bepalen, ingelost.

Voor je afscheid neemt, drukt Herakles je zelf iets in handen: een van de gouden appels van de Hesperiden, die hij nooit heeft opgegeten. "Bewaar die," zegt hij. "Ik heb aan het bewijs dat ik ze heb gehaald genoeg — een verhaal onthoud je toch beter met iets dat je kunt vasthouden."

IMAGE:
cerberus_voltooid.png

CODEX:
codex_herakles_twaalf_werken

PERSON:
herakles:full

SOUVENIR:
souvenir_herakles_labores

EERETITEL:
ch3_herakles_labores

QUEST:
quest_boodschapper_van_kronos: lijn Herakles — alle twaalf werken volbracht (Hoofdstuk 3)

FLAG:
ch3_lijn_herakles=true; herakles_taken_voltooid=12

FRAGMENT:
labores

CHOICES:

* Keer terug naar de Boodschapper -> CH3_000

END

=== SCENE: CH3_ATHENA ===

TITLE:
Wat Vrijheid Werkelijk Betekent

TEXT:
Athena wacht je op bij de Boodschapper, ditmaal niet als toeschouwer maar als iemand die duidelijk al een tijd op dit gesprek heeft zitten wachten. "Io kreeg haar vrijheid terug nadat een god eindelijk verantwoordelijkheid nam voor wat hij had aangericht," zegt ze. "Herakles kreeg de zijne terug door tien jaar lang, beproeving na beproeving, een schuld in te lossen die hem was opgelegd voor iets wat niet volledig zijn eigen keuze was."

"Twee soorten vrijheid," vervolgt ze, "en jij, {tendency_address_cap}, hebt inmiddels gezien dat geen van beide vanzelf komt — niet voor een god, en al helemaal niet voor een sterveling."

IMAGE:
athena_mentor_ch3.png

PERSON:
athena:full

EERETITEL:
ch3_athena_gesprek

CHOICES:

* Laat haar woorden bezinken -> CH3_ORAKEL

END

=== SCENE: CH3_ORAKEL ===

TITLE:
Het Orakel Keert Terug

TEXT:
De lucht rond je trilt weer op de vertrouwde manier, en de stem van de Boodschapper van Kronos klinkt, warm en tevreden. "Io, bevrijd van Argus en van haarzelf. Herakles, bevrijd van een schuld die tien jaar heeft geduurd," zegt de stem. "Twee verhalen over wat het kost om vrij te zijn — en wat het waard is zodra je het eindelijk bent."

CODEX:
codex_grammatica_ch3_overzicht

VOCAB:
latijn_iuno, latijn_nuntius, latijn_dea, latijn_sapientia, latijn_crotala, latijn_cerva, latijn_pars, latijn_promittit, latijn_titan, latijn_avis

QUEST:
quest_boodschapper_van_kronos: hoofdstuk 3 volledig voltooid

CHOICES:

* Luister verder -> CH3_EINDE

END

=== SCENE: CH3_EINDE ===

TITLE:
Het Einde van Hoofdstuk 3

TEXT:
"Hoofdstuk 4 wacht al ergens verderop," zegt de stem, "waar een ander soort labyrint op je wacht — niet van steen deze keer, maar van herinnering zelf." De poort keert terug tot een dunne streep licht, en je neemt twee nieuwe herinneringen met je mee: vrijheid, en volbrenging.

CHOICES:

* Stap door de poort -> CH4_000

END
`.trim();

/* ---- HOOFDSTUK 4 — "Het Labyrint van Herinneringen" (SP_CAMPAIGN ch4).
   Twee hoofdlijnen, net als Hoofdstuk 3: THESEUS (Ariadne, de Minotaurus, en
   Daidalos & Ikaros erin verweven i.p.v. een aparte lijn — zie Chronica.md
   §7 "zijverhalen") en PHAETHON (het Paleis van de Zon, de zonnewagen). Beide
   lijnen draaien om dezelfde kern: een belofte, licht gedaan, die niemand
   meer ongedaan kan maken — Aegeus' zeilen-afspraak met Theseus, en Sol se
   eed bij de Styx aan Phaëthon. Elke lijn levert een eigen Herinneringsfragment
   ("theseus", "phaethon" — bewust ANDERE ids dan alle voorgaande hoofdstukken,
   want SP_STATE.fragments is één doorlopende array); de hub-gate naar het
   Orakel staat daarom op [REQUIRE:fragments=8] (de zes van Hoofdstuk 2/3 +
   deze twee). Grammatica dit hoofdstuk: infinitivus, vocativus (vervolg op
   Hoofdstuk 1), imperfectum, perfectum, ablativus (van middel) — zie
   codex_grammatica_ch4_*. Lijn Theseus (Pallas Les 6-7) draagt drie van de
   vijf grammaticapunten (infinitivus/vocativus/ablativus), lijn Phaëthon
   (Minerva H5) de resterende twee (imperfectum/perfectum) — bewust niet
   symmetrisch verdeeld, zelfde flexibiliteit als Hoofdstuk 2. Athena is sinds
   Hoofdstuk 2 actieve mentor en gebruikt hier ook weer {tendency_address}
   (sinds Hoofdstuk 3). ---- */
const SP_CH4_CNS = `
=== SCENE: CH4_000 ===

TITLE:
Het Labyrint van Herinneringen

TEXT:
De Boodschapper wijst je ditmaal naar twee scheuren die verder uit elkaar liggen dan ooit — niet naast elkaar zoals bij Io en Herakles, maar aan de twee uiteinden van eenzelfde waarheid. "Twee verhalen," zegt ze, "en in allebei staat één belofte centraal — een belofte die niemand meer ongedaan kan maken zodra ze eenmaal is uitgesproken. Volg Theseus naar Kreta, en zie wat er gebeurt wanneer een sterveling zo'n belofte vergeet. Volg Phaëthon naar het Paleis van de Zon, en zie wat er gebeurt wanneer een sterveling er juist te veel van eist."

Athena, die sinds Hoofdstuk 2 niet langer zwijgt, voegt er zacht aan toe: "Onthoud dit hoofdstuk goed. Van alle herinneringen die je nog zult verzamelen, zijn deze twee misschien wel de zwaarste — niet omdat de monsters groter zijn, maar omdat de fout menselijker is."

CODEX:
codex_grammatica_ch4_infinitivus, codex_grammatica_ch4_vocativus, codex_grammatica_ch4_imperfectum, codex_grammatica_ch4_perfectum, codex_grammatica_ch4_ablativus

CHOICES:

* Volg Theseus naar Kreta, waar een labyrint en een monster op hem wachten [DONE:ch4_lijn_theseus] -> CH4_T01
* Volg Phaëthon, die aan zijn eigen afkomst twijfelt [DONE:ch4_lijn_phaethon] -> CH4_P01
* Spreek het Orakel aan, nu beide verhalen zijn gehoord [REQUIRE:fragments=8] -> CH4_ATHENA

END

=== SCENE: CH4_T01 ===

TITLE:
Een Belofte in Athene

TEXT:
Al negen jaar betaalt Athene een prijs die geen enkele stad zou moeten betalen: zeven jongens en zeven meisjes, in de bloei van hun leven, verscheept naar Kreta om te worden opgeofferd aan een wezen dat koning Minos gevangen houdt in een bouwwerk zonder uitgang. De tol is de straf voor een oude schuld — Minos' eigen zoon Androgeos stierf ooit op Atheense bodem, en niets minder dan mensenlevens kon zijn woede sindsdien sussen.

Theseus, zoon van koning Aegeus, is nog maar net in Athene aangekomen — erkend als troonopvolger na een jeugd ver van het paleis — wanneer de derde lichting van het offer wordt samengesteld. Tegen elke smeekbede van zijn vader in meldt hij zichzelf vrijwillig aan als een van de veertien.

PERSON:
theseus:intro, aegeus:intro

CHOICES:

* Voel vooral medelijden met Aegeus, die zijn net teruggevonden zoon dreigt te verliezen [CLEMENTIA] -> CH4_T02
* Erken nuchter dat iemand dit moet doen, en dat vrijwilligers zeldzaam zijn [SEVERITAS] -> CH4_T02
* Voel de spanning tussen trots en angst, zonder een duidelijke kant te kiezen [NEUTRAL] -> CH4_T02

END

=== SCENE: CH4_T02 ===

TITLE:
De Belofte van de Zeilen

TEXT:
Vlak voor het schip vertrekt, roept Aegeus zijn zoon nog één keer bij zich, aan de rand van de kade. Het schip vaart altijd onder zwarte zeilen — het rouwzeil van een offer dat vermoedelijk niet terugkeert — en die aanblik, weet Aegeus, zal hem elke dag opnieuw naar de klippen drijven om uit te kijken.

"Beloof me één ding," zegt hij, zijn stem nauwelijks vast. "Als je overleeft — als je dat monster verslaat en teruggevaren wordt — hijs dan witte zeilen in plaats van zwarte, zodra de kust in zicht komt. Dan weet ik het al voor het schip de haven bereikt. Beloof het me, Theseus." Theseus belooft het zonder aarzelen — een belofte die op dit moment vederlicht aanvoelt, een kleinigheid vergeleken met het monster dat voor hem ligt.

PUZZLE:
puzzle_ch4t_infinitivus

CHOICES:

* Vaar mee naar Kreta -> CH4_T03

END

=== SCENE: CH4_T03 ===

TITLE:
Aankomst op Kreta

TEXT:
Het schip meert aan in Knossos, de machtige hoofdstad van Kreta, waar koning Minos de veertien Atheners met weinig meer dan een koele blik in ontvangst neemt. Naast hem staat zijn dochter Ariadne — en waar haar vader enkel de jaarlijkse routine ziet, ziet zij, voor het eerst in negen jaar, iemand voor wie ze meer voelt dan medelijden met zichzelf.

Theseus, die niets van dit alles weet, ziet enkel een paleis groter dan hij ooit heeft gezien, en ergens daaronder — hij voelt het bijna door de vloer heen — het labyrint waar Daidalos, de beroemdste bouwmeester van zijn tijd, ooit een bouwwerk optrok dat zelfs zijn eigen maker bijna niet meer kon verlaten.

PERSON:
ariadne:intro, minos:intro, daidalos:intro

CHOICES:

* Kijk wat Ariadne besluit te doen -> CH4_T04

END

=== SCENE: CH4_T04 ===

TITLE:
Het Monster in het Labyrint

TEXT:
Het wezen waarvoor Athene al negen jaar boet, is de Minotaurus — half mens, half stier — en zijn bestaan is zelf al het gevolg van een oude, gebroken belofte. Jaren geleden vroeg Minos de zeegod Neptunus om een teken dat de goden zijn koningschap goedkeurden; Neptunus liet een verblindend witte stier uit de golven oprijzen, op voorwaarde dat het dier meteen aan hem geofferd zou worden. Minos, die het dier te mooi vond om te doden, offerde een ander dier in zijn plaats — en Neptunus, beledigd, zorgde ervoor dat Minos' eigen vrouw Pasiphaë een onnatuurlijk verlangen naar de stier ontwikkelde. Wat daaruit werd geboren, kon nergens anders wonen dan in een bouwwerk dat zijn eigen weg naar buiten verbergt.

Daidalos bouwde dat bouwwerk in opdracht van Minos: een labyrint met zoveel kronkelende gangen dat niemand die er eenmaal in verdwaalt, ooit vanzelf de uitgang terugvindt. Elk jaar voedt het offer uit Athene het monster — en houdt het tegelijk Minos' eigen, decennia oude schuld verborgen achter stenen muren.

CODEX:
codex_labyrint_minotaurus

CHOICES:

* Kijk wat Ariadne voor Theseus overheeft -> CH4_T05

END

=== SCENE: CH4_T05 ===

TITLE:
Ariadne's Keuze

TEXT:
Ariadne, die weet dat niemand het labyrint ooit levend heeft verlaten, zoekt Daidalos in het geheim op — de enige die de gangen ooit heeft doorgrond, omdat hij ze zelf ontwierp. Wat ze hem vraagt, is verraad aan haar eigen vader; wat hij haar geeft, is doodeenvoudig: een kluwen garen, groot genoeg om van de ingang tot in het diepste hart van het labyrint te reiken en weer terug.

Ze weet wat ontdekking zou betekenen — voor Daidalos, voor haarzelf. Toch zoekt ze Theseus diezelfde nacht in het geheim op, en drukt hem het garen in handen, samen met een zwaard dat scherp genoeg is voor wat hem te wachten staat. In ruil vraagt ze maar één ding: dat hij haar meeneemt wanneer hij vertrekt, want na dit verraad kan ze nooit meer veilig in haar vaders paleis blijven. Theseus zweert het haar, net zo snel als hij eerder zijn vader iets zwoer aan de kade van Athene.

CHOICES:

* Bewonder vooral haar moed om tegen haar eigen vader in te gaan [CLEMENTIA] -> CH4_T06
* Erken vooral hoe berekenend haar hulp is — ze vraagt er tenslotte iets voor terug [SEVERITAS] -> CH4_T06
* Twijfel of dit nu liefde is, wanhoop, of iets van beide [NEUTRAL] -> CH4_T06

END

=== SCENE: CH4_T06 ===

TITLE:
De Ingang van het Labyrint

TEXT:
Bij de ingang bindt Theseus het uiteinde van het garen vast aan een steunbalk en loopt de duisternis in, de draad ontrollend achter zich terwijl de gangen zich vertakken, kronkelen en in elkaar overlopen tot geen enkele richting nog vanzelfsprekend is.

Diep in het labyrint, waar zelfs het geluid van zijn eigen voetstappen vervormd terugkaatst, hoort hij voor het eerst iets ademen dat geen mens is.

PUZZLE:
puzzle_ch4t_ablativus

CHOICES:

* Ga het duister in, op het geluid af -> CH4_T07

END

=== SCENE: CH4_T07 ===

TITLE:
De Minotaurus

TEXT:
De Minotaurus komt op hem af — reusachtig, met de kop van een stier op het lichaam van een man, meer honger dan wraak in zijn ogen. Negen jaar lang heeft hij alleen maar gekregen wat men hem verplicht bracht; vandaag, voor het eerst, staat er iemand tegenover hem die niet van plan is zich zomaar te laten offeren.

COMBAT:
minotaurus

CHOICES:

* Kijk wat er van het monster overblijft -> CH4_T08

END

=== SCENE: CH4_T08 ===

TITLE:
Terug langs de Draad

TEXT:
Met het monster verslagen volgt Theseus het garen terug — elke bocht die hij eerder blindelings nam, wijst nu feilloos de weg naar buiten. Bij de ingang wacht Ariadne, en samen met de dertien andere Atheners die niet langer geofferd hoeven te worden, vluchten ze diezelfde nacht nog naar het schip, voor Minos ook maar vermoedt wat er is gebeurd.

CHOICES:

* Vaar weg van Kreta -> CH4_T09

END

=== SCENE: CH4_T09 ===

TITLE:
Naxos

TEXT:
Onderweg meert het schip aan op het eiland Naxos om te rusten. Terwijl Ariadne slaapt, uitgeput van een nacht zonder slaap en een vlucht zonder pauze, vaart Theseus — om redenen die de latere verhalen zelf niet eens eensluidend kunnen navertellen: vergeetachtigheid, een goddelijke influistering, gewoon menselijke lafheid — zonder haar verder.

Wat de reden ook was, het is dezelfde soort vergissing die dit hele hoofdstuk verbindt: een belofte, licht gedaan, zwaar gebroken.

CHOICES:

* Voel vooral woede namens Ariadne, die dit niet verdiende [SEVERITAS] -> CH4_T10
* Zoek naar begrip voor Theseus, die net een monster heeft overleefd en amper meer helder kan denken [CLEMENTIA] -> CH4_T10
* Laat het oordeel voorlopig in het midden [NEUTRAL] -> CH4_T10

END

=== SCENE: CH4_T10 ===

TITLE:
Bacchus Vindt Ariadne

TEXT:
Ariadne ontwaakt alleen op een onbekend strand — tot Bacchus, de god die je al kent van koning Midas' vloek (Hoofdstuk 1), haar daar vindt, huilend en verraden. Waar Theseus haar in de steek liet, blijft Bacchus: hij trouwt met haar, maakt haar onsterfelijk, en plaatst haar bruidskroon voorgoed tussen de sterren.

Het is geen volledig gelukkig einde — geen enkel verhaal in dit hoofdstuk krijgt dat — maar het is het enige moment waarop een gebroken belofte alsnog met iets goeds eindigt.

CODEX:
codex_ariadne_bacchus

PERSON:
ariadne:full

CHOICES:

* Keer terug naar Theseus, die niet weet wat hij heeft achtergelaten -> CH4_T11

END

=== SCENE: CH4_T11 ===

TITLE:
Minos' Wraak

TEXT:
Op Kreta ontdekt Minos al snel dat het labyrint zijn geheim niet heeft weten te bewaren — en er is maar één man die het garen-trucje had kunnen bedenken. In blinde woede laat hij Daidalos en diens jonge zoon Ikaros zelf opsluiten in het labyrint, de enige plek op het eiland waaruit zelfs de bouwmeester zelf niet zomaar weg kan komen.

PERSON:
ikaros:intro

CHOICES:

* Kijk hoe Daidalos zijn eigen gevangenschap probeert te ontlopen -> CH4_T12

END

=== SCENE: CH4_T12 ===

TITLE:
Vleugels van Veren en Was

TEXT:
Minos beheerst elke uitweg over land en zee, maar niet de lucht — en dat is precies waar Daidalos zijn toevlucht zoekt. Geduldig verzamelt hij veren die door het labyrint dwarrelen, bindt ze samen met draad en verzegelt ze met gesmolten was tot twee paar vleugels, één voor hemzelf, één voor zijn zoon.

Voor ze opstijgen, drukt hij Ikaros op het hart wat hem het meest zorgen baart: "Vlieg de middenweg. Niet te laag, want de zeenevel maakt de veren zwaar en nat. Niet te hoog, want de zon smelt de was. Blijf dicht bij mij, en volg precies waar ik vlieg."

CHOICES:

* Kijk hoe de vlucht begint -> CH4_T13

END

=== SCENE: CH4_T13 ===

TITLE:
De Val van Ikaros

TEXT:
Aanvankelijk houdt Ikaros zich keurig aan zijn vaders route, vlak achter hem, zijn ogen groot van verwondering over een wereld die hij nog nooit van bovenaf heeft gezien. Maar de vreugde van het vliegen zelf wordt hem te machtig — hij stijgt hoger, en hoger, dronken van een vrijheid die hij nog nooit heeft gevoeld, ver voorbij zijn vaders geroep om voorzichtigheid.

De zon doet precies wat Daidalos vreesde: de was tussen de veren smelt, eerst onmerkbaar, dan in een oogwenk. Veer na veer laat los, en Ikaros valt — zijn armen nog wapperend in de vorm van vleugels die niet langer bestaan — de zee in die sindsdien zijn naam draagt.

"Icare!" roept Daidalos, keer op keer, terwijl hij cirkelt boven het water — maar er komt geen antwoord meer, enkel verspreide veren die langzaam op de golven neerdalen.

PUZZLE:
puzzle_ch4t_vocativus

CHOICES:

* Voel vooral verdriet om een vader die zijn zoon niet kon redden [CLEMENTIA] -> CH4_T14
* Erken nuchter dat een gewaarschuwde zoon ook zelf verantwoordelijkheid draagt [SEVERITAS] -> CH4_T14
* Weet niet goed bij wie het verdriet of de schuld het zwaarst hoort te wegen [NEUTRAL] -> CH4_T14

END

=== SCENE: CH4_T14 ===

TITLE:
Daidalos in Sicilië

TEXT:
Daidalos vliegt door, alleen nu, tot hij landt op Sicilië — te ver van huis om nog ergens anders naartoe te vluchten, te gebroken om nog trots te zijn op vleugels die hem wel maar zijn zoon niet konden redden. Hij begraaft wat de zee van Ikaros teruggeeft aan de kust van een eiland dat later Icaria zal heten, naar de jongen die er nooit levend aankwam.

CODEX:
codex_daidalos_ikaros

PERSON:
daidalos:full, ikaros:full

CHOICES:

* Keer terug naar het schip van Theseus, dat inmiddels Athene nadert -> CH4_T15

END

=== SCENE: CH4_T15 ===

TITLE:
Het Zwarte Zeil

TEXT:
Op het schip naar Athene is Theseus met zijn gedachten bij alles behalve zijn vaders belofte — het monster, Ariadne die hij ergens onderweg is kwijtgeraakt, de veertien levens die hij heeft gered. Tussen dat alles verdwijnt één simpele afspraak volledig uit zijn hoofd: hij vergeet de zeilen te verwisselen.

Op de klippen bij Athene staat Aegeus al dagenlang uit te kijken, precies zoals hij zijn zoon had beloofd te zullen doen. Wanneer het schip eindelijk in zicht komt — nog altijd onder zwart zeil — twijfelt hij geen moment aan wat dat betekent.

CHOICES:

* Kijk wat Aegeus doet -> CH4_T16

END

=== SCENE: CH4_T16 ===

TITLE:
De Zee van Aegeus

TEXT:
Zonder een moment te wachten op bevestiging, zonder het schip de haven te laten bereiken, werpt Aegeus zich van de klip in de zee eronder — overtuigd dat de zoon voor wie hij zoveel vreesde, alsnog is omgekomen. De zee die zijn val opvangt, draagt sindsdien zijn naam: de Egeïsche Zee.

Theseus, die pas aan land beseft wat er is gebeurd, staat oog in oog met het gewicht van een belofte die hem, uren eerder, nog vederlicht had geleken. Hij wordt koning van Athene op dezelfde dag dat hij zijn vader verliest — een troon gewonnen met een vergetelheid die hij zichzelf nooit helemaal zal vergeven.

In je zak, waar je het niet had verwacht, vind je nog een laatste stukje van Ariadne's garen — te kort om ooit nog een labyrint mee terug te vinden, lang genoeg om je eraan te herinneren dat iemand je ooit een weg naar buiten gaf.

CODEX:
codex_labyrint_minotaurus

PERSON:
theseus:full, aegeus:full, minos:full

SOUVENIR:
souvenir_theseus

EERETITEL:
ch4_theseus_labyrint

QUEST:
quest_boodschapper_van_kronos: lijn Theseus afgerond (Hoofdstuk 4)

FLAG:
ch4_lijn_theseus=true

FRAGMENT:
theseus

CHOICES:

* Keer terug naar de Boodschapper — Phaëthons verhaal wacht nog -> CH4_000

END

=== SCENE: CH4_P01 ===

TITLE:
Twijfel aan een Vader

TEXT:
Phaëthon, een jongen die opgroeit met niets dan zijn moeders woord dat zijn vader Sol is — de god die dagelijks de zon over de hemel voert — wordt op een dag hardop uitgelachen door zijn vriend Epaphus, zelf de zoon van Jupiter en de ooit vervloekte Io. "Iedereen kan beweren dat zijn vader een god is," zegt Epaphus. "Bewijs het maar."

De spot blijft aan Phaëthon kleven, dagenlang, tot hij besluit zelf naar het Paleis van de Zon te reizen — helemaal aan de rand van de wereld — om zijn vader eindelijk rechtstreeks om bewijs te vragen.

PERSON:
phaethon:intro, epaphus:intro

CHOICES:

* Volg Phaëthon op zijn tocht naar het oosten -> CH4_P02

END

=== SCENE: CH4_P02 ===

TITLE:
Het Paleis van de Zon

TEXT:
Het paleis van Sol overtreft alles wat Phaëthon zich had voorgesteld: zuilen van goud en brons, deuren bewerkt met beelden van de hele wereld, en middenin, op een troon die zelf licht lijkt uit te stralen, zijn vader — stralender dan Phaëthon zich in zijn stoutste dromen had durven wensen.

Sol herkent zijn zoon meteen, verwelkomt hem hartelijk, en zweert — voor Phaëthon zelfs zijn vraag heeft kunnen stellen — een eed bij de rivier de Styx: elke wens die zijn zoon uitspreekt, zal hij inwilligen, wat het ook is. Het is de zwaarst mogelijke eed die een god kan afleggen — zelfs Jupiter zelf durft een eed bij de Styx nooit te breken.

PERSON:
sol:intro

CHOICES:

* Kijk welke wens Phaëthon uitspreekt -> CH4_P03

END

=== SCENE: CH4_P03 ===

TITLE:
Een Onmogelijke Wens

TEXT:
Phaëthon, die eigenlijk alleen bevestiging kwam zoeken, laat zich meeslepen door de eed die hem plotseling alles belooft. "Laat mij, voor één dag, de zonnewagen mennen," zegt hij. "Laat heel de wereld zien dat ik werkelijk jouw zoon ben."

Sol verbleekt — zijn eigen belofte, nog geen moment oud, wordt nu zijn grootste angst. Hij smeekte, probeerde alles wat hij verder nog te bieden had als vervanging aan te dragen, maar een eed bij de Styx laat geen ruimte voor spijt.

PUZZLE:
puzzle_ch4p_imperfectum

CHOICES:

* Voel vooral medelijden met Sol, die zichzelf in de val heeft gepraat [CLEMENTIA] -> CH4_P04
* Erken nuchter dat een eed nu eenmaal een eed is, hoe onverstandig ook [SEVERITAS] -> CH4_P04
* Twijfel of Sol dit wel had mogen beloven voor hij de vraag zelfs kende [NEUTRAL] -> CH4_P04

END

=== SCENE: CH4_P04 ===

TITLE:
De Zonnewagen

TEXT:
Bij zonsopgang mag Phaëthon plaatsnemen in de wagen die zijn vader dagelijks over de hemel voert — vier vurige paarden ervoor gespannen, elk krachtiger dan enig sterfelijk dier ooit zou kunnen temmen. Sol geeft hem in allerijl nog instructies: houd de teugels stevig, volg het gebaande spoor, niet te hoog, niet te laag.

Zodra de paarden voelen dat een minder ervaren hand de teugels vasthoudt dan gewoonlijk, breken ze uit hun vaste baan — en Phaëthon, die nooit eerder iets bestuurd heeft groter dan een gewone kar, verliest de wagen bijna onmiddellijk uit controle.

CHOICES:

* Kijk waar de wagen naartoe raast -> CH4_P05

END

=== SCENE: CH4_P05 ===

TITLE:
De Aarde in Vlammen

TEXT:
De zonnewagen zwenkt eerst te hoog, waardoor de aarde in ijzige duisternis verzinkt, en dan, in een poging het recht te trekken, veel te laag — zo laag dat de hitte akkers verschroeit, rivieren laat opdrogen, en een streep van de aarde voorgoed in verzengd, dor land verandert: het gebied dat later de Sahara zal heten.

Steden vatten vlam, bossen verkolen tot as, en overal op aarde roepen mensen om hulp tegen een zon die niet langer haar vaste baan volgt.

CHOICES:

* Kijk wie deze ramp uiteindelijk moet stoppen -> CH4_P06

END

=== SCENE: CH4_P06 ===

TITLE:
Tellus Smeekt om Hulp

TEXT:
Tellus, de aarde zelf, verheft haar stem tot aan de Olympos — verzengd, half verstikt door haar eigen rook — en smeekt Jupiter in te grijpen voor er niets meer over is om te redden. Zelfs de goden, zegt ze, hebben straks geen wereld meer om over te heersen als dit nog één moment langer doorgaat.

PERSON:
tellus:intro

CHOICES:

* Kijk hoe Jupiter reageert -> CH4_P07

END

=== SCENE: CH4_P07 ===

TITLE:
Jupiters Bliksem

TEXT:
Jupiter, die geen andere keus meer ziet, grijpt naar zijn bliksem — niet uit woede jegens de jongen zelf, maar omdat één enkel leven, hoe onschuldig zijn fout ook begon, niet opweegt tegen de hele wereld. Met één worp treft hij de wagen en slingert Phaëthon, brandend, uit de lucht.

PUZZLE:
puzzle_ch4p_perfectum

CHOICES:

* Vind Jupiters daad gerechtvaardigd, hoe hard ook [SEVERITAS] -> CH4_P08
* Blijf medelijden voelen met Phaëthon, ondanks alles [CLEMENTIA] -> CH4_P08
* Erken dat er hier geen echt goede uitkomst meer mogelijk was [NEUTRAL] -> CH4_P08

END

=== SCENE: CH4_P08 ===

TITLE:
De Rivier Eridanus

TEXT:
Phaëthon valt, nog nasmeulend, in de verre rivier de Eridanus — ver van huis, ver van het paleis waar hij ooit alleen maar bevestiging kwam zoeken dat zijn vader echt zijn vader was. De rivier koelt wat er van hem over is, en begraaft de rest van het verhaal in zijn stroom.

CHOICES:

* Kijk wie er rouwt om zijn dood -> CH4_P09

END

=== SCENE: CH4_P09 ===

TITLE:
De Heliaden

TEXT:
Phaëthons zusters, de Heliaden, vinden zijn graf aan de oever van de Eridanus en blijven er wenen, dag na dag, tot hun voeten wortel schieten in de grond en hun armen uitgroeien tot takken. Ze veranderen, traan voor traan, in populieren — en de tranen die ze al die tijd blijven huilen, verharden in het water tot amber.

Amber wordt sindsdien gevonden langs precies dat soort rivieroevers — bevroren verdriet, zeggen sommigen, van een rouw die nooit is opgehouden.

CODEX:
codex_phaethon

PERSON:
phaethon:full, sol:full

CHOICES:

* Kijk wie er nog meer treurt -> CH4_P10

END

=== SCENE: CH4_P10 ===

TITLE:
Cycnus wordt een Zwaan

TEXT:
Ook Cycnus, een verre verwant en dierbare vriend van Phaëthon, treurt zo diep dat de goden hem uit medelijden veranderen in een zwaan — een vogel die sindsdien liever op meren en rivieren zwemt dan de lucht in vliegt, uit angst voor een hemel die zijn vriend het leven kostte.

Tussen de populieren aan de oever vind je één druppel amber, nog warm alsof hij zojuist pas gevallen is — een traan van een van de Heliaden, voorgoed gestold. Je sluit hem in je vuist, zoals het Orakel dat blijkbaar wil.

SOUVENIR:
souvenir_phaethon

EERETITEL:
ch4_phaethon

QUEST:
quest_boodschapper_van_kronos: lijn Phaëthon afgerond (Hoofdstuk 4)

FLAG:
ch4_lijn_phaethon=true

FRAGMENT:
phaethon

CHOICES:

* Keer terug naar de Boodschapper — Theseus' verhaal wacht nog -> CH4_000

END

=== SCENE: CH4_ATHENA ===

TITLE:
Athena over Twee Beloften

TEXT:
Athena wacht je ditmaal niet zwijgend op, maar spreekt zodra je bij haar aankomt — vanzelfsprekend inmiddels, als mentor. "Twee vaders," zegt ze, "twee beloften, twee soorten verlies. Aegeus verloor zijn zoon aan een belofte die vergeten werd. Sol verloor zijn zoon aan een belofte die hij nooit had mogen doen — en toch, eenmaal uitgesproken, niet meer kon intrekken."

"Dat is de kern van dit hele hoofdstuk, {tendency_address}: een belofte weegt niet minder omdat ze lichtvaardig werd gegeven. Onthoud dat goed — het labyrint dat je dit hoofdstuk doorkruiste, was uiteindelijk niet van steen, maar van gevolgen die niemand meer ongedaan kon maken."

EERETITEL:
ch4_athena_gesprek

CHOICES:

* Laat haar woorden bezinken -> CH4_ORAKEL

END

=== SCENE: CH4_ORAKEL ===

TITLE:
Het Orakel Keert Terug

TEXT:
De vertrouwde stem van de Boodschapper van Kronos klinkt weer, warm en enigszins plechtig. "Theseus, bevrijd van een monster maar niet van zijn eigen vergetelheid. Phaëthon, die zijn afkomst bewees met een vraag die hem het leven kostte. Twee beloften die de wereld voorgoed veranderden — de een een zee, de ander een streep amberkleurige rivieroever."

CODEX:
codex_grammatica_ch4_overzicht

VOCAB:
latijn_vela, latijn_mutare, latijn_iubet, latijn_filum, latijn_labyrinthus, latijn_relinquit, latijn_volare, latijn_ala, latijn_cera, latijn_monebat, latijn_currus, latijn_fulmen, latijn_misit, latijn_soror, latijn_lacrima, latijn_cadere

QUEST:
quest_boodschapper_van_kronos: hoofdstuk 4 volledig voltooid

CHOICES:

* Luister verder -> CH4_EINDE

END

=== SCENE: CH4_EINDE ===

TITLE:
Het Einde van Hoofdstuk 4

TEXT:
"Hoofdstuk 5 wacht al ergens verderop," zegt de stem, "waar geen labyrint meer op je wacht, maar een schip vol helden — en het begin van een tocht naar het Gulden Vlies." De poort keert terug tot een dunne streep licht, en je neemt twee nieuwe herinneringen met je mee: uitweg, en overmoed.

CHOICES:

* Stap door de poort -> CH5_000

END
`.trim();

/* ---- HOOFDSTUK 5 — "Het Gulden Vlies" (SP_CAMPAIGN ch5). Bewust ANDERE
   structuur dan Hoofdstuk 2/3/4: geen hub met parallelle, zelf te kiezen
   lijnen, maar één doorlopend TOCHTENLOGBOEK (zie SP_CAMPAIGN
   ch5.gameplay) — de speler volgt de Argo van stop tot stop. Geen
   Herinneringsfragment-gate dan ook (geen lijnen om te "voltooien"), en
   geen nieuwe grammatica (herhaling nom. t/m abl., zie SP_CAMPAIGN
   ch5.grammatica) — dus ook geen nieuwe codex_grammatica_ch5_*-entries.

   NEGEN CAMEO-CLUSTERS langs de route (zie Chronica.md §7.10 voor de
   volledige redenering): Theseus (herkenning, dramatische ironie — de
   speler kent zijn Labyrint-verhaal al uit Hoofdstuk 4), Tydeus (temperament),
   Atalanta & Meleager samen bij een zwijnenjacht op Cyzicus (voorecho van
   hun latere, veel duisterdere Calydonische ever), Kastor & Polydeukes samen
   bij de bokswedstrijd tegen Amycus, Herakles & Hylas op Mysië (bestaand
   canoniek moment), Argos bij de Symplegades, Orpheus & Tydeus samen bij een
   sussend muziekmoment, en Nestor & Philoktetes samen vlak voor Colchis.

   "ANDER PERSPECTIEF, ZELFDE INHOUD" (2026-07, vastgelegd na gesprek met de
   auteur): bij Cyzicus mag de speler kiezen MET WIE ze meekijkt tijdens de
   jacht (Atalanta of Meleager) — dat verandert alleen de vertelde invalshoek
   (CH5_008A/CH5_008B), niet de uitkomst: beide keuzes voeren terug naar
   dezelfde volgende scène (CH5_009) en de speler ontmoet linksom of rechtsom
   sowieso beide personages. Bewust GEEN blijvend gemiste content (zoals bij
   Hoofdstuk 1-4's lijnen, waar je een lijn ook daadwerkelijk kunt missen in
   één playthrough) — dat zou het bestaande "je ziet alles binnen één
   playthrough"-model van dit spel doorbreken, en de auteur koos daar bewust
   niet voor.

   NIEUW PUZZELTYPE "tile-swap" (schuifpuzzel, zie spRenderTileSwapPuzzle in
   singleplayer.js) gebruikt bij CH5_017 (ablativus, bij Argos/de Symplegades)
   — verder een mix van alle vijf puzzeltypes over de vijf naamvallen heen.

   TWEE Combat-bridge-gevechten: Amycus (CH5_013) en de Draak van Colchis
   (CH5_026) — de klassieke "Medea sust de draak in slaap"-versie van het
   verhaal bestaat naast oudere afbeeldingen waarin Jason wél met het beest
   vecht (sommige antieke vaasschilderingen tonen hem zelfs uit de bek van de
   draak tevoorschijn komend); CH5_026 combineert beide: Medea's gezang
   kalmeert het beest genoeg om dichterbij te komen, maar het schrikt alsnog
   wakker voor Jason het Vlies kan losmaken.

   MEDEA'S WRAAK IN KORINTHE (CH5_029/CH5_EINDE): een van de duisterste
   verhalen uit de klassieke mythologie (Medea doodt, in haar wraak op Jason,
   uiteindelijk ook hun eigen kinderen). Chronica.md noemt dit bewust een
   "duister drieluik" samen met Niobe en Pentheus (Hoofdstuk 6) — hier verteld
   met dezelfde terughoudendheid als Aegeus' zelfmoord in Hoofdstuk 4: het
   gebeuren wordt nooit ontkend of vergoelijkt, maar ook nooit grafisch
   uitgesponnen. Geen COMBAT/PUZZLE op dit moment — dit hoofdstuk eindigt,
   net als Hoofdstuk 4, op stilte in plaats van een beproeving.

   EQUIP: CH5_006 (vertrek uit Iolcus) zet de FLAG "ch5_bemanning_uitrusting",
   die zowel armor:middel als helm:bandana ontgrendelt (zie
   SP_AVATAR_STORY_UNLOCKS) — Chronica.md §5.1 equip-routekaart, "uitgedeeld
   aan de hele bemanning bij vertrek". ---- */
const SP_CH5_CNS = `
=== SCENE: CH5_000 ===

TITLE:
Het Gulden Vlies

TEXT:
"Dit hoofdstuk," zegt de Boodschapper, "is geen labyrint en geen paleis — het is een schip." Ze wijst naar een scheur in het licht die groter is dan alle voorgaande, alsof hij een hele zee moet doorlaten in plaats van één verhaal. "Volg Jason en zijn bemanning op hun tocht naar Colchis, aan de rand van de bekende wereld, waar een Vlies van goud hangt dat niemand ooit eerder heeft weten te bemachtigen."

Athena voegt eraan toe, zachter dan anders: "Let deze keer goed op wie er nog meer aan boord staat. Sommige namen ken je al. De meeste ken je nog niet — maar dat komt nog."

VOCAB:
latijn_navis, latijn_mare, latijn_vellus, latijn_draco, latijn_populus, latijn_malleus, latijn_aper, latijn_regit, latijn_vulnerat, grieks_toxon

CODEX:
codex_gulden_vlies

CHOICES:

* Volg Jason naar de haven van Iolcus -> CH5_001

END

=== SCENE: CH5_001 ===

TITLE:
De Uitdaging van Pelias

TEXT:
Iolcus, aan de voet van de Pelionberg, is de stad die Jason rechtens toebehoort — zijn oom Pelias hield de troon vast nadat hij Jasons vader had verdreven, en verwachtte niet dat de rechtmatige erfgenaam ooit zou terugkeren om hem op te eisen. Toen Jason dat toch deed, verzon Pelias meteen een uitweg die op een gunst leek en een doodvonnis was: haal het Gulden Vlies terug uit Colchis, en de troon is voor jou.

Niemand is ooit teruggekeerd uit Colchis met het Vlies. Jason, jong en onverschrokken genoeg om dat geen reden te vinden om te weigeren, laat de oproep alvast door heel Griekenland gaan: wie durft mee te varen?

PERSON:
jason:intro

CHOICES:

* Kijk wie er allemaal op die oproep afkomen -> CH5_002

END

=== SCENE: CH5_002 ===

TITLE:
De Bemanning van de Argo

TEXT:
Binnen een paar weken ligt de haven van Iolcus vol met de beroemdste namen van Griekenland — allemaal aangetrokken door hetzelfde onmogelijke verhaal. Peleus en Telamon, twee onafscheidelijke strijdmakkers, zijn er als eersten, breed grijnzend om niets anders dan het vooruitzicht van een nieuw avontuur. Laertes, rustiger dan de rest, monstert het schip van boeg tot achtersteven voor hij ook maar één voet aan boord zet — alsof hij precies wil weten waar hij aan begint.

Bij het schip zelf staat de man die het heeft gebouwd: Argos, zoon van Arestor, die — op aanwijzing van Athena zelf, zegt men — een balk uit het orakelbos van Dodona in de boeg heeft verwerkt. "Ze waarschuwt weleens," zegt hij droog, als iemand ernaar vraagt, "maar nooit op tijd om nog iets te kunnen doen met de waarschuwing."

CODEX:
codex_argonauten_bemanning

PERSON:
peleus:intro, telamon:intro, laertes:intro, argos:intro

CHOICES:

* Kijk wie er nog meer aan boord stapt -> CH5_003

END

=== SCENE: CH5_003 ===

TITLE:
Een Bekend Gezicht

TEXT:
Tussen de nieuwkomers valt één gezicht je meteen op — niet omdat hij opvalt tussen al die andere helden, maar omdat je hem al kent. Theseus, inmiddels weer terug in Athene na Kreta, meldt zich aan voor nóg een tocht voor hij zelf koning wordt. Hij loopt met dezelfde vastberadenheid het schip op die je je nog herinnert uit het Labyrint — maar jij weet iets wat hij hier, op dit moment, nog niet weet: wat die vastberadenheid hem straks, met zijn vader, zal kosten.

Hij groet je kort, zonder enig vermoeden dat je zijn hele verhaal al hebt gezien — het verhaal dat voor hem, hier op de kade van Iolcus, nog moet beginnen.

CHOICES:

* Zoek in zijn ogen naar een spoor van wat hij nog gaat vergeten [CLEMENTIA] -> CH5_004
* Bekijk hem nuchter als gewoon nog een bemanningslid, niets meer [SEVERITAS] -> CH5_004
* Laat het vreemde gevoel van iets-weten-wat-hij-niet-weet gewoon op je inwerken [NEUTRAL] -> CH5_004

END

=== SCENE: CH5_004 ===

TITLE:
Een Korte Lont

TEXT:
Niet iedereen aan boord is even geduldig. Tydeus, een gedrongen krijger met een stem die harder klinkt dan nodig, is nog geen uur aan boord of hij heeft al ruzie met een roeier over wie welke plaats krijgt — zijn hand ligt al op zijn zwaardgreep voor de ander goed en wel iets heeft kunnen terugzeggen.

Jason sust het meningsverschil met een paar korte woorden, maar de blik die Tydeus achterlaat, maakt duidelijk dat dit niet de laatste keer zal zijn. "Die man," mompelt iemand naast je, "trekt sneller zijn zwaard dan zijn adem."

PERSON:
tydeus:intro

CHOICES:

* Kijk hoe de tocht wordt voorbereid -> CH5_005

END

=== SCENE: CH5_005 ===

TITLE:
De Stuurman Wijst de Plaatsen

TEXT:
Vlak voor het vertrek loopt de stuurman langs elke bank om te bepalen wie waar roeit — een kwestie van kracht, gewicht en geduld, niet van eer. Boven het geroezemoes van tachtig stemmen probeert Jason zelf orde te scheppen, in het Latijn dat hij van zijn leermeester Chiron heeft geleerd.

PUZZLE:
puzzle_ch5_nominativus

CHOICES:

* Vaar uit Iolcus weg -> CH5_006

END

=== SCENE: CH5_006 ===

TITLE:
Het Vertrek

TEXT:
Vlak voor de Argo de haven uit vaart, deelt Argos uit wat er nog in het ruim lag opgeslagen: voor de hele bemanning — ook voor jou — een eenvoudig reisharnas en een hoofddoek tegen de zon en de zoute wind die de komende weken niet zullen ophouden. "Niets moois," zegt hij, "maar het houdt je droog en het houdt je koel. Meer heb je op deze tocht niet nodig."

Achter de Argo verdwijnt Iolcus langzaam in de nevel, en voor haar strekt zich een zee uit die verder gaat dan de meesten aan boord ooit hebben gevaren.

FLAG:
ch5_bemanning_uitrusting=true

CHOICES:

* Vaar de open zee op -> CH5_007

END

=== SCENE: CH5_007 ===

TITLE:
Cyzicus

TEXT:
Na de eerste dagen op zee meert de Argo aan bij het eiland Cyzicus, waar de plaatselijke koning de bemanning hartelijk ontvangt — op voorwaarde dat ze eerst een probleem voor hem oplossen. Een reusachtig everzwijn huist op de berghelling boven de stad en verscheurt al weken alles wat de jagers erop afsturen.

Twee van de jongste helden aan boord melden zich meteen: Atalanta, opgevoed door een berin en de scherpste jaagster van heel Griekenland, en Meleager, de jonge prins van Calydon, net zo gretig als zij. Ze kennen elkaar amper, maar de blik die ze wisselen is er meteen een van wedijver — en van iets dat verdacht veel op vriendschap lijkt.

PERSON:
atalanta:intro, meleager:intro

CHOICES:

* Kijk wie het everzwijn het eerst weet te vinden -> CH5_008

END

=== SCENE: CH5_008 ===

TITLE:
Met Wie Kijk Je Mee?

TEXT:
De jacht splitst zich al snel in twee groepen die elk hun eigen kant van de berghelling nemen — Atalanta stil en geduldig door het kreupelhout, Meleager luidruchtiger, met een groep andere Argonauten in zijn kielzog. Je kunt niet allebei tegelijk volgen.

CHOICES:

* Volg Atalanta, die op haar eigen spoor jaagt -> CH5_008A
* Volg Meleager, die met de groep meejaagt -> CH5_008B

END

=== SCENE: CH5_008A ===

TITLE:
Atalanta's Spoor

TEXT:
Atalanta beweegt zich bijna geluidloos tussen de struiken, haar boog al gespannen voor je het dier zelf ziet. Ze leest de grond zoals anderen een geschreven tekst lezen — een omgewoelde wortel hier, een afgebroken tak daar — en is het everzwijn al drie keer voorbij zijn eigen spoor te slim af voor de rest van de jacht haar bijbenen.

Vlak voordat het beest tussen de rotsen opduikt, fluistert ze, meer tegen zichzelf dan tegen jou: "Wie het eerst raakt, telt vandaag niet. Wie het eerst ziet, wel."

CHOICES:

* Kijk hoe de jacht samenkomt -> CH5_009

END

=== SCENE: CH5_008B ===

TITLE:
Meleagers Groep

TEXT:
Meleager jaagt luider, met meer mensen om zich heen, meer geroep en meer risico — maar ook met een aanstekelijk soort moed die de rest van de groep meesleept. Waar Atalanta het spoor leest, leest hij vooral de stemming: wie moe wordt, wie te dichtbij komt, wie een aanmoediging nodig heeft.

"Het gaat niet om wie het dier velt," roept hij naar de anderen, half lachend, half serieus, terwijl ze de laatste helling op klauteren. "Het gaat om wie het overleeft om het verhaal te vertellen."

CHOICES:

* Kijk hoe de jacht samenkomt -> CH5_009

END

=== SCENE: CH5_009 ===

TITLE:
Het Everzwijn

TEXT:
Beide groepen drijven het everzwijn uiteindelijk naar dezelfde kloof, waar het geen kant meer op kan. Atalanta is de eerste die raak schiet — een pijl diep in de flank van het dier, genoeg om het te vertragen zonder het meteen te doden. Meleager, die als laatste toehapt, velt het definitief.

Geen van beiden claimt de eer alleen. "Zonder jouw pijl had ik hem nooit ingehaald," zegt Meleager, en Atalanta knikt, voor het eerst die dag zonder een spoor van wedijver in haar blik.

PUZZLE:
puzzle_ch5_accusativus

CHOICES:

* Kijk hoe de koning van Cyzicus reageert -> CH5_010

END

=== SCENE: CH5_010 ===

TITLE:
Twee Namen om te Onthouden

TEXT:
De koning houdt zijn woord en bevoorraadt de Argo rijkelijk voor het vervolg van de tocht. Terwijl de bemanning het ruim vult, blijf je nog even staan bij Atalanta en Meleager, die zij aan zij tegen de reling geleund het dier napraten alsof ze al jaren samen jagen in plaats van amper één middag.

Iets aan hoe moeiteloos ze samenwerken, blijft je bij — een gevoel dat dit niet de laatste keer zal zijn dat hun namen in één adem genoemd worden.

CODEX:
codex_atalanta_meleager

CHOICES:

* Vaar verder, naar het land van de Bebryciërs -> CH5_011

END

=== SCENE: CH5_011 ===

TITLE:
De Uitdaging van Amycus

TEXT:
Bij het land van de Bebryciërs verwelkomt niemand de Argo — koning Amycus, een reus van een man, staat de bemanning al op te wachten met een eis in plaats van een groet: elke vreemdeling die hier aan land komt, moet hem uitdagen tot een bokswedstrijd. Wie weigert, vertrekt niet levend.

Twee broers stappen meteen naar voren: Kastor, de beste ruiter van Griekenland, en Polydeukes, zijn tweelingbroer — onverslaanbaar met de vuisten, zegt men, al sinds hij nog een jongen was. "Dit," zegt Polydeukes rustig, terwijl hij zijn handen inzwachtelt, "is precies waar ik goed in ben."

PERSON:
kastor_polydeukes:intro

CHOICES:

* Kijk wat Amycus over zijn eigen rijk te zeggen heeft voor het gevecht begint -> CH5_012

END

=== SCENE: CH5_012 ===

TITLE:
Het Rijk van Amycus

TEXT:
Amycus buldert zijn eigen faam nog eens rond voor hij zijn vuisten heft — hoeveel vreemdelingen hij al heeft verslagen, hoe lang zijn volk hem al onbevochten kent. Polydeukes luistert er nauwelijks naar, zijn blik al gericht op de eerste opening die hij straks zal vinden.

PUZZLE:
puzzle_ch5_genitivus

CHOICES:

* Kijk hoe het gevecht verloopt -> CH5_013

END

=== SCENE: CH5_013 ===

TITLE:
Polydeukes tegen Amycus

TEXT:
Amycus is groter, zwaarder en gewend te winnen — maar Polydeukes is sneller, en heeft, anders dan elke tegenstander die Amycus ooit versloeg, geen enkele angst in zijn ogen. Waar de reus met volle kracht uithaalt, ontwijkt Polydeukes en antwoordt met precisie in plaats van gewicht.

COMBAT:
amycus

CHOICES:

* Kijk wat er van Amycus' rijk wordt na zijn nederlaag -> CH5_014

END

=== SCENE: CH5_014 ===

TITLE:
Een Reus Geveld

TEXT:
Amycus valt, voor het eerst in zijn leven verslagen, en zijn volk — dat hem eerder uit angst dan uit liefde volgde — verwelkomt de Argonauten meteen als bevrijders in plaats van indringers. Kastor slaat zijn broer trots op de schouder; het is duidelijk dat dit niet de laatste keer is dat deze twee samen iets overwinnen dat groter is dan zijzelf.

CODEX:
codex_dioscuren

CHOICES:

* Vaar verder, naar de kust van Mysië [CLEMENTIA] -> CH5_015
* Vaar verder — een tiran minder op de kaart, verder geen traan aan verspild [SEVERITAS] -> CH5_015
* Vaar verder, zonder er verder nog bij stil te staan [NEUTRAL] -> CH5_015

END

=== SCENE: CH5_015 ===

TITLE:
Herakles Blijft Achter

TEXT:
Bij Mysië gaat Herakles aan land om een nieuwe roeiriem te snijden, met zijn jonge metgezel Hylas mee om water te halen. Hylas keert nooit terug — de waternimfen van de bron waar hij put, betoveren hem en trekken hem mee de diepte in, verliefd op zijn schoonheid.

Herakles zoekt de hele nacht, roepend door de bossen van Mysië, doof voor elke aanmaning om terug aan boord te komen. Tegen de ochtend besluit de bemanning, met tegenzin, zonder hem verder te varen — Herakles, wanneer hij eindelijk het strand terugvindt en het schip al weg ziet, blijft alleen achter, zijn zoektocht naar Hylas nog altijd niet opgegeven.

CHOICES:

* Vaar verder zonder Herakles -> CH5_016

END

=== SCENE: CH5_016 ===

TITLE:
De Symplegades

TEXT:
Verderop wacht een gevaar dat geen zwaard en geen boog kan verslaan: de Symplegades, twee rotswanden die bij elke doorvaart als een kaak op elkaar klappen en alles ertussen verpletteren. Geen enkel schip heeft de doortocht ooit overleefd.

Argos, die zijn eigen schip kent tot in de laatste plank, bestudeert het ritme van de botsende rotsen langer dan wie ook geduld voor heeft. "Elke kaak heeft een moment dat hij weer opengaat," zegt hij uiteindelijk. "Wij hebben er maar één nodig."

CHOICES:

* Kijk hoe Argos de doortocht voorbereidt -> CH5_017

END

=== SCENE: CH5_017 ===

TITLE:
Argos Verstevigt het Schip

TEXT:
Voor de doorvaart zelf versterkt Argos in allerijl de romp van de Argo, precies op de plekken waar hij weet dat het schip het meest te lijden zal krijgen.

PUZZLE:
puzzle_ch5_ablativus

CHOICES:

* Vaar op het juiste moment de Symplegades in -> CH5_018

END

=== SCENE: CH5_018 ===

TITLE:
Tussen de Rotsen Door

TEXT:
Op Argos' teken roeit de hele bemanning met alles wat ze in zich hebben, precies op het moment dat de rotsen weer uiteen wijken. De Argo schiet erdoorheen en is nog maar net voorbij wanneer de wanden achter haar met een oorverdovende klap weer op elkaar slaan — op een haar na alleen het uiterste puntje van de achtersteven rakend.

Sinds die dag, zegt men, bewegen de Symplegades niet meer: een schip dat de doortocht overleeft, bevriest de rotsen voorgoed op hun plaats. Wat er ook van waar is, geen enkel schip na de Argo heeft ze ooit nog zien bewegen.

CODEX:
codex_argos_schip

CHOICES:

* Vaar verder, langs de kust van de Zwarte Zee -> CH5_019

END

=== SCENE: CH5_019 ===

TITLE:
Gespannen Riemen

TEXT:
Weken op zee slijten aan iedereens geduld, ook aan dat van Tydeus, die op een avond een roeier bijna naar zijn keel vliegt om niet meer dan een verkeerd geplaatste opmerking. Voor iemand kan ingrijpen, klinkt er muziek over het dek — Orpheus, die zijn lier pakt en speelt zoals hij weet dat alleen hij kan spelen.

De ruzie sterft vanzelf weg, niet omdat iemand gelijk kreeg, maar omdat niemand meer de puf heeft om boos te blijven terwijl die muziek klinkt. Zelfs Tydeus, met zijn vuisten nog half gebald, laat zich zonder het zelf te merken terugzakken op zijn bank.

PERSON:
orpheus:intro

CHOICES:

* Laat de avond verder in stilte voorbijgaan -> CH5_020

END

=== SCENE: CH5_020 ===

TITLE:
Raad en Richting

TEXT:
Vlak voor de laatste etappe naar Colchis brengt de stuurman de koers in kaart, en het is Nestor — nog een van de jongste aan boord, maar nu al opvallend kalm en verstandig voor zijn leeftijd — wiens advies de doorslag geeft over welke route het veiligst is.

Philoktetes, intussen, oefent zijn boogschot op een stuk drijfhout achter het schip — raak, en raak, en nog eens raak, met een precisie die zelfs de meest doorgewinterde Argonauten aan boord stil doet worden.

PERSON:
nestor:intro, philoktetes:intro

CHOICES:

* Vraag Philoktetes om zijn precisie nog eens te bewijzen -> CH5_021

END

=== SCENE: CH5_021 ===

TITLE:
Een Pijl voor de Godin

TEXT:
Voor zijn laatste schot wijdt Philoktetes zijn pijl hardop toe aan de godin van de jacht — een klein gebaar van respect dat hij, zegt hij, van zijn eigen leermeester heeft overgenomen.

PUZZLE:
puzzle_ch5_dativus

CHOICES:

* Vaar de laatste etappe naar Colchis -> CH5_022

END

=== SCENE: CH5_022 ===

TITLE:
Twee Namen voor Later

TEXT:
Terwijl de kust van Colchis al vaag aan de horizon verschijnt, bedenk je dat Nestor en Philoktetes — allebei nu nog jong, allebei nu nog maar twee van de tachtig namen aan boord — ooit nog een keer samen genoemd zullen worden. Niet hier. Niet op deze tocht. Maar het gevoel dat dit geen toeval is, laat je niet meer los.

CODEX:
codex_nestor_philoktetes

CHOICES:

* Vaar de haven van Colchis binnen -> CH5_023

END

=== SCENE: CH5_023 ===

TITLE:
Colchis

TEXT:
Colchis ligt aan de rand van de bekende wereld, verder naar het oosten dan de meeste Grieken ooit zijn gevaren. Koning Aeëtes ontvangt de Argonauten koeltjes — hij bewaakt het Gulden Vlies al jaren met een nooit slapende draak, en is niet van plan het zomaar aan een groep vreemdelingen af te staan.

Naast hem staat zijn dochter Medea, een begaafde tovenares — en de eerste die haar vaders koelte niet deelt zodra ze Jason ziet. Wat ze voor hem voelt, overvalt haarzelf net zo hard als het jou overvalt: het lijkt in niets op wat ze had verwacht.

PERSON:
medea:intro, aeetes:intro

CHOICES:

* Kijk welke voorwaarde Aeëtes aan het Vlies verbindt -> CH5_024

END

=== SCENE: CH5_024 ===

TITLE:
De Beproevingen van Aeëtes

TEXT:
Aeëtes stelt een voorwaarde waarvan hij zeker weet dat ze onmogelijk is: eerst twee vuurspuwende stieren voor de ploeg spannen, dan een veld ermee omploegen, en ten slotte drakentanden erin zaaien — dezelfde soort tanden waaruit ooit, ver hiervandaan in Thebe, een heel volk van gewapende mannen uit de aarde opstond. Uit elke tand die Jason zaait, groeit binnen een oogwenk een gewapende krijger, klaar om hem te doden.

Zonder hulp zou geen sterveling dit overleven — en Medea, die haar vader al in het geheim heeft verraden voor de vreemdeling die haar hart heeft gestolen, geeft Jason een zalf tegen het vuur en één cruciale raad: gooi een steen tussen de opgerezen krijgers, en laat ze elkaar aanzien voor de vijand in plaats van jou.

CHOICES:

* Kijk hoe Medea haar keuze rechtvaardigt -> CH5_025

END

=== SCENE: CH5_025 ===

TITLE:
Medea's Keuze

TEXT:
Wat Medea doet, is geen kleinigheid: ze verraadt haar eigen vader, haar eigen koninkrijk, voor een vreemdeling die ze amper een paar dagen kent. Het is, beseft je, precies wat Ariadne op Kreta ook deed voor Theseus — dezelfde soort keuze, dezelfde soort risico, misschien wel hetzelfde soort liefde.

"Ik weet wat dit betekent," zegt Medea zacht, meer tegen zichzelf dan tegen jou. "Ik kan nooit meer terug. Maar ik kan hem ook niet laten sterven."

CHOICES:

* Bewonder vooral haar moed om alles op te geven voor wat ze voelt [CLEMENTIA] -> CH5_026
* Erken vooral hoe roekeloos het is om je eigen vader zo te verraden [SEVERITAS] -> CH5_026
* Herken vooral het patroon — weer een vrouw die alles waagt voor een man die haar dat misschien nooit teruggeeft [NEUTRAL] -> CH5_026

END

=== SCENE: CH5_026 ===

TITLE:
De Nooit Slapende Draak

TEXT:
Het Gulden Vlies hangt diep in een heilig woud, bewaakt door een draak die naar verluidt nog nooit heeft geslapen. Medea neuriet een zacht, oud gezang dat het beest langzaam kalmeert — genoeg om Jason dichterbij te laten komen, maar niet genoeg om het volledig in slaap te sussen. Vlak voor hij het Vlies kan losmaken, schrikt de draak alsnog wakker.

COMBAT:
drakon_vlies

CHOICES:

* Kijk wat er van het Gulden Vlies wordt -> CH5_027

END

=== SCENE: CH5_027 ===

TITLE:
Het Gulden Vlies

TEXT:
Met de draak verslagen snijdt Jason het Vlies eindelijk los — zwaarder en warmer in zijn handen dan hij had verwacht, alsof het al die jaren wachten zelf ook gewicht heeft gekregen. Medea, haar eigen vader en koninkrijk nu voorgoed achter zich latend, vaart met de Argo mee terug naar Griekenland.

In je vuist voel je een klein, gouden schilfertje dat losraakte van het Vlies tijdens het gevecht — koud eerst, dan langzaam warm, alsof het net zo lang op jou heeft liggen wachten als het Vlies zelf op Jason wachtte.

SOUVENIR:
souvenir_argonauten

EERETITEL:
ch5_argonauten

CHOICES:

* Volg de terugreis naar Griekenland -> CH5_028

END

=== SCENE: CH5_028 ===

TITLE:
De Terugreis

TEXT:
De terugtocht duurt bijna net zo lang als de heentocht, over andere zeeën en langs andere kusten, tot de Argo eindelijk weer thuis aanlegt in Iolcus — te laat om Pelias nog op zijn woord te houden, en te laat om te voorkomen dat de troon inmiddels alweer stevig in zijn handen ligt.

Jason en Medea trekken verder, uiteindelijk naar Korinthe, waar ze jarenlang samen leven en kinderen krijgen — een rustige tijd die, achteraf gezien, nooit bedoeld was om te blijven duren.

CHOICES:

* Kijk wat er jaren later, in Korinthe, gebeurt -> CH5_029

END

=== SCENE: CH5_029 ===

TITLE:
Korinthe, Jaren Later

TEXT:
In Korinthe verlaat Jason Medea uiteindelijk voor een politiek huwelijk met de dochter van de plaatselijke koning — een verstandige zet voor zijn eigen toekomst, zegt hij, alsof verstandig genoeg reden is om te vergeten wat Medea voor hem heeft opgegeven: haar vader, haar vaderland, alles.

Medea's wraak is er een die de latere verhalen zelf nauwelijks durven navertellen. Ze stuurt de nieuwe bruid een huwelijksgeschenk dat er op het eerste gezicht prachtig uitziet, maar vergiftigd blijkt te zijn. En daar houdt haar wraak niet op — in haar woede en verdriet neemt ze van Jason ook het enige wat hij nooit meer terug zou kunnen krijgen. Geen enkel lied vertelt dat deel graag in detail, en dit verhaal ook niet.

CODEX:
codex_medea_wraak

PERSON:
medea:full

QUEST:
quest_boodschapper_van_kronos: hoofdstuk 5 volledig voltooid

CHOICES:

* Luister verder -> CH5_EINDE

END

=== SCENE: CH5_EINDE ===

TITLE:
Het Einde van Hoofdstuk 5

TEXT:
"Niet elke belofte breekt met een klip en een zwart zeil," zegt de stem, stiller dan anders. "Sommige breken langzaam, over jaren — en de prijs daarvan kan verschrikkelijker zijn dan wie dan ook had kunnen voorzien, aan het begin van een tocht die met zoveel hoop van wal stak." De poort keert terug tot een dunne streep licht, en je neemt een nieuwe herinnering met je mee, zwaarder dan de vorige: een schilfer goud, en alles wat het je heeft geleerd over wat een belofte werkelijk kan kosten.

EERETITEL:
ch5_medea_korinthe

CHOICES:

* Stap door de poort -> CH6_000

END
`.trim();

/* ---- HOOFDSTUK 6 — "De Vloek van Thebe" (SP_CAMPAIGN ch6). Bewust NIET
   chronologisch verteld — zie de toelichting in CH6_000 en Chronica.md
   §7.11 — maar in de volgorde die het patroon van het hoofdstuk het
   duidelijkst maakt: hoogmoed, gevolgd door een straf die het hardst op
   kinderen neerkomt. Opent met Niobe (Kadmos' stad, nog jong), gaat via
   Oedipus/de Sfinx/de Zeven tegen Thebe/de Epigonen (met Diomedes, zoon van
   Tydeus uit Hoofdstuk 5) naar Antigone, en sluit af — bewust ACHTERUIT in
   de tijd, Pentheus regeerde Thebe eigenlijk al vóór Oedipus — met Pentheus
   en de Bacchanten, samen met Niobe en Medea (Hoofdstuk 5) het "duistere
   drieluik" van moeder/kind-tragedies (zie Chronica.md §7).

   Geen hub, geen lijnen, geen Herinneringsfragment-gate (zelfde afwijking
   als Hoofdstuk 5, zie SP_CAMPAIGN ch6.gameplay) en geen nieuwe grammatica:
   herhaling praesens t/m perfectum (werkwoordstijden, GEEN naamvallen —
   dat was Hoofdstuk 5). Zes puzzels over vier types, incl. het nieuwe
   "matching" (koppelpuzzel, zie singleplayer.js). Eén Combat-bridge-gevecht
   (Laodamas, de laatste verdediger van Thebe tegen de Epigonen) — de rest
   van dit hoofdstuk drijft op noodlot en menselijke fouten, niet op
   monsters, met uitzondering van de Sfinx (die met een raadsel wordt
   verslagen, niet met een zwaard — vandaar een PUZZLE, geen COMBAT, zelfde
   principe als Ladon bij Herakles' werken). ---- */
const SP_CH6_CNS = `
=== SCENE: CH6_000 ===

TITLE:
De Vloek van Thebe

TEXT:
"Dit hoofdstuk vertel ik je niet in de volgorde waarin het gebeurde," zegt de Boodschapper, ongewoon voorzichtig. "Thebe's geschiedenis springt heen en weer door generaties, en als ik je alles op volgorde van jaartal zou vertellen, zou je het patroon nooit zien. Dus vertel ik het je op de volgorde die het patroon wél laat zien: hoogmoed, telkens weer — en een straf die daarna bijna nooit bij de hoogmoedige zelf terechtkomt, maar bij de kinderen."

Athena knikt, zwijgender dan anders. "Sommige vloeken slaan in bij de stichting van een stad, en wachten dan gewoon — generatie na generatie — tot er weer iemand geboren wordt om ze te laten uitkomen."

VOCAB:
latijn_habere, latijn_recusare, latijn_sepelire, latijn_regnum, latijn_frater, latijn_quadrupes, grieks_bakchos

CODEX:
codex_kadmos_thebe

CHOICES:

* Begin bij het begin — de stichting van Thebe -> CH6_001

END

=== SCENE: CH6_001 ===

TITLE:
De Stichting van Thebe

TEXT:
Kadmos, een Fenicische prins op zoek naar zijn geschaakte zuster Europa — je kent haar verhaal al uit Hoofdstuk 3 — geeft die zoektocht op advies van het orakel van Delphi uiteindelijk op. Volg een koe, zegt het orakel, en sticht een stad waar ze uitgeput neervalt. Kadmos doet wat hem gezegd wordt.

Om een offer te brengen doodt hij een draak die de bron ter plekke bewaakt — en zaait, op advies van Athena zelf, de tanden van het beest in de aarde. Gewapende krijgers rijzen op uit de grond en doden elkaar bijna allemaal; de vijf die overblijven worden de eerste inwoners van de stad die Kadmos Thebe noemt.

PERSON:
kadmos:intro

CHOICES:

* Jij hebt dit soort tanden al eerder gehoord — kijk waar de rest van de draak bleef -> CH6_002

END

=== SCENE: CH6_002 ===

TITLE:
Dezelfde Tanden, een Andere Koning

TEXT:
Het valt je meteen op: dezelfde soort drakentanden hoorde je Aeëtes al noemen, ver naar het oosten in Colchis, toen Jason zijn beproevingen moest doorstaan. Eén draak, twee koningen, generaties en een hele wereld uit elkaar — allebei met precies dezelfde gewapende-mannen-uit-de-aarde-truc.

"Zo werkt een vloek soms," zegt Athena. "Hij plant zichzelf, letterlijk, en wacht dan gewoon af wie hem opgraaft."

CHOICES:

* Kijk naar de eerste koningin van deze jonge stad -> CH6_003

END

=== SCENE: CH6_003 ===

TITLE:
Niobe's Hoogmoed

TEXT:
Enkele generaties later regeert Niobe als koningin over Thebe — trots, geliefd, en moeder van veertien kinderen. Op een feest ter ere van Latona (je kent haar inmiddels goed uit Hoofdstuk 2) kan Niobe haar mond niet houden: waarom zou een godin met slechts twee kinderen meer offers verdienen dan een koningin met veertien?

PUZZLE:
puzzle_ch6_praesens

CHOICES:

* Kijk hoe Latona's kinderen op deze belediging reageren -> CH6_004

END

=== SCENE: CH6_004 ===

TITLE:
Apollo en Diana's Wraak

TEXT:
Apollo en Diana laten de belediging aan hun moeder niet ongestraft. Met hun pijl en boog doden ze, de een na de ander, al Niobe's veertien kinderen — tot er niemand meer overblijft om nog trots op te zijn.

Niobe, verstard van verdriet, verandert ter plekke in steen. Nog altijd, zegt men, laat de rots op de berg Sipylos water druppelen — tranen die na al die generaties nog altijd niet zijn opgehouden.

CODEX:
codex_niobe

SOUVENIR:
souvenir_thebe

CHOICES:

* Vind veertien levens een verschrikkelijk zware prijs voor één opschepperige zin [CLEMENTIA] -> CH6_005
* Erken dat een belediging aan een godin nu eenmaal nooit zonder gevolgen blijft [SEVERITAS] -> CH6_005
* Laat het gewoon op je inwerken, zonder meteen een kant te kiezen [NEUTRAL] -> CH6_005

END

=== SCENE: CH6_005 ===

TITLE:
Een Voorspelling voor Laius

TEXT:
Generaties na Niobe regeert Laius over Thebe. Een orakel voorspelt hem iets verschrikkelijks: zijn eigen, nog ongeboren zoon zal hem ooit doden. Uit angst laat Laius het kind, zodra het geboren is, te vondeling leggen op een berghelling — zijn voeten doorboord en aan elkaar gebonden, zodat niemand ooit zou vermoeden dat het om een prins gaat.

Het kind overleeft. Een herder vindt de baby, en uiteindelijk groeit hij op aan het hof van Corinthe, geadopteerd door een koning en koningin die hem nooit vertellen dat hij niet echt hun zoon is. Zijn naam: Oedipus — "gezwollen voet", naar de wond die hij als baby overhield.

PERSON:
laius:intro, oedipus:intro

CHOICES:

* Kijk wat Oedipus doet zodra hij zelf volwassen is -> CH6_006

END

=== SCENE: CH6_006 ===

TITLE:
De Weg naar Thebe

TEXT:
Als jongvolwassene krijgt Oedipus zijn eigen, verschrikkelijke voorspelling: hij zal ooit zijn vader doden en met zijn moeder trouwen. In de overtuiging dat zijn Corinthische ouders zijn ware ouders zijn, vlucht hij weg van Corinthe om het lot te ontlopen — recht op Thebe af, zonder dat hij het weet.

Onderweg, bij een smal kruispunt, weigert een oudere man met zijn wagen opzij te gaan. Het geschil escaleert, en Oedipus doodt de man — zonder ook maar te vermoeden dat het zijn eigen vader Laius is, op weg naar hetzelfde orakel dat hem ooit al zoveel verdriet bracht.

CHOICES:

* Volg Oedipus verder naar de poorten van Thebe -> CH6_007

END

=== SCENE: CH6_007 ===

TITLE:
De Sfinx

TEXT:
Bij de poorten van Thebe houdt een monster de hele stad al maandenlang gegijzeld: de Sfinx, met het lichaam van een leeuw, de vleugels van een adelaar en het gezicht van een vrouw. Iedereen die de stad in of uit wil, moet haar raadsel oplossen — en wie faalt, wordt ter plekke verslonden.

Oedipus, die toch al niets meer te verliezen heeft, biedt aan het te proberen.

CODEX:
codex_oedipus

CHOICES:

* Luister naar het raadsel van de Sfinx -> CH6_008

END

=== SCENE: CH6_008 ===

TITLE:
Het Raadsel

TEXT:
"Welk wezen," vraagt de Sfinx, "loopt 's ochtends op vier poten, 's middags op twee, en 's avonds op drie — en is het zwakst naarmate het er meer heeft?"

PUZZLE:
puzzle_ch6_sfinx

CHOICES:

* Geef het antwoord -> CH6_009

END

=== SCENE: CH6_009 ===

TITLE:
Koning van Thebe

TEXT:
"De mens," antwoordt Oedipus — als baby kruipt hij op handen en voeten, als volwassene loopt hij rechtop, en op zijn oude dag steunt hij op een stok, de "derde poot". De Sfinx, voor het eerst ooit verslagen, werpt zich in wanhoop van de rotsen.

Thebe, bevrijd, kroont Oedipus tot nieuwe koning — en geeft hem, zoals gebruikelijk, ook de hand van de weduwe van de vorige koning: Iokaste. Jaren gaan voorbij. Ze krijgen samen vier kinderen: Eteokles, Polyneikes, Antigone, en een dochter die verder in dit verhaal geen grote rol speelt. Niemand in Thebe vermoedt wie Iokaste werkelijk is voor haar nieuwe man.

PERSON:
iokaste:intro, eteokles:intro, polyneikes:intro, antigone:intro

CHOICES:

* Spring jaren vooruit, naar het moment dat de waarheid aan het licht komt -> CH6_010

END

=== SCENE: CH6_010 ===

TITLE:
De Waarheid

TEXT:
Jaren later teistert een verschrikkelijke plaag Thebe, en een orakel wijst de oorzaak aan: de moordenaar van de vorige koning loopt nog vrij rond, onbestraft, in de stad zelf. Oedipus, vastbesloten de dader te vinden, ontrafelt stukje bij beetje zijn eigen verleden — tot de waarheid onontkoombaar wordt: hij doodde zijn eigen vader op die weg naar Thebe, en trouwde daarna, zonder het te weten, met zijn eigen moeder.

Iokaste kan niet leven met wat ze ontdekt. Oedipus, die het niet langer kan verdragen te zien wat zijn eigen ogen hem hebben laten aanrichten, verblindt zichzelf en verlaat Thebe voorgoed, een ballingschap in die hem de rest van zijn leven zal achtervolgen.

PERSON:
oedipus:full, iokaste:full

CHOICES:

* Voel vooral medelijden — geen van beiden koos er ooit voor om dit te worden [CLEMENTIA] -> CH6_011
* Erken nuchter dat onwetendheid de gevolgen niet ongedaan maakt, hoe oneerlijk dat ook voelt [SEVERITAS] -> CH6_011
* Laat het oordeel maar aan iemand anders — dit voelt te groot om zomaar een kant te kiezen [NEUTRAL] -> CH6_011

END

=== SCENE: CH6_011 ===

TITLE:
Een Troon, Twee Broers

TEXT:
Eteokles en Polyneikes spreken af de troon van Thebe om het jaar te delen — eerst de een, dan de ander. Het eerste jaar is aan Eteokles. Maar wanneer het jaar om is en Polyneikes zijn beurt komt opeisen, weigert Eteokles.

PUZZLE:
puzzle_ch6_imperfectum

CHOICES:

* Kijk wat Polyneikes onderneemt -> CH6_012

END

=== SCENE: CH6_012 ===

TITLE:
De Zeven tegen Thebe

TEXT:
Verbannen uit zijn eigen stad, verzamelt Polyneikes zes andere champions om Thebe met geweld terug te veroveren — samen bekend als de Zeven tegen Thebe. Onder hen een gezicht dat je al kent: Tydeus, de kortlontige Argonaut van de Argo (Hoofdstuk 5), even onstuimig als altijd.

"Als er íémand een stadspoort met kracht in plaats van geduld openkrijgt," zegt Tydeus grimmig, terwijl hij zijn wapenrusting aantrekt, "dan ben ik dat wel."

CHOICES:

* Kijk hoe de aanval op Thebe verloopt -> CH6_013

END

=== SCENE: CH6_013 ===

TITLE:
De Zeven Poorten

TEXT:
Elk van de zeven champions valt een andere poort van Thebe aan — en bijna allemaal sneuvelen ze, poort na poort, tegen Thebe's verdedigers. Voor de laatste, wanhopige aanval moet iedereen die nog vecht zijn Latijn haarscherp houden.

PUZZLE:
puzzle_ch6_matching_tempora

CHOICES:

* Kijk hoe het tussen de twee broers zelf afloopt -> CH6_014

END

=== SCENE: CH6_014 ===

TITLE:
Broedermoord

TEXT:
Eteokles en Polyneikes, vastbesloten dit voor eens en altijd zelf uit te vechten, treffen elkaar in een laatste tweegevecht — en doden elkaar tegelijkertijd, geen van beiden lang genoeg in leven om nog te weten wie er "gewonnen" heeft.

Tydeus zelf ligt intussen dodelijk gewond op het slagveld, precies op het moment dat Athena naar hem toe komt om hem — voor zijn moed — onsterfelijkheid te schenken. Wat ze daar aantreft, doet haar zich vol afschuw afwenden en de gave intrekken. Tydeus sterft alsnog, sterfelijk na alles, ver van de zoon die hij amper heeft leren kennen.

CODEX:
codex_zeven_tegen_thebe

CHOICES:

* Kijk wie er na deze slachting de troon van Thebe overneemt -> CH6_015

END

=== SCENE: CH6_015 ===

TITLE:
Creons Bevel

TEXT:
Met beide broers dood en Oedipus allang verbannen, neemt Iokaste's broer Creon de troon over. Zijn eerste daad als regent is een bevel dat heel Thebe zal verscheuren: Eteokles krijgt een eervolle begrafenis, als verdediger van de stad — maar Polyneikes, die zijn eigen stad aanviel, mag van Creon nooit begraven worden. Zijn lichaam moet buiten de muren blijven liggen, prooi voor de vogels.

Voor de Grieken is dit een verschrikkelijke straf — zonder de juiste rituelen kan een ziel nooit rust vinden. Antigone, Polyneikes' zuster, is niet van plan zich daarbij neer te leggen.

PERSON:
creon:intro

CHOICES:

* Kijk wat Antigone besluit te doen -> CH6_016

END

=== SCENE: CH6_016 ===

TITLE:
Antigone's Verzet

TEXT:
Tegen Creons uitdrukkelijke bevel in begraaft Antigone haar broer in het geheim, met de juiste rituelen — overtuigd dat de wetten van de goden zwaarder wegen dan die van een sterfelijke koning.

PUZZLE:
puzzle_ch6_perfectum

CHOICES:

* Kijk hoe Creon reageert zodra hij ontdekt wat ze heeft gedaan -> CH6_017

END

=== SCENE: CH6_017 ===

TITLE:
Levend Ingemetseld

TEXT:
Creon laat Antigone, zodra hij ontdekt wat ze heeft gedaan, levend inmetselen in een graftombe — geen executie in naam, maar wel een ter dood veroordeling. Antigone wacht niet af tot de tombe haar langzaam laat sterven: ze kiest zelf het moment.

PERSON:
antigone:full

CODEX:
codex_antigone

CHOICES:

* Bewonder haar moed om voor haar overtuiging te sterven [CLEMENTIA] -> CH6_018
* Erken dat Creon, hoe hard ook, zijn bevel niet zomaar kon laten passeren zonder gezichtsverlies [SEVERITAS] -> CH6_018
* Zie vooral twee mensen die geen van beiden meer terug konden zonder alles te verliezen [NEUTRAL] -> CH6_018

END

=== SCENE: CH6_018 ===

TITLE:
De Epigonen

TEXT:
Tien jaar na de nederlaag van de Zeven tegen Thebe zijn hun zonen oud genoeg om zelf te vechten — de Epigonen, "de nakomelingen", vastbesloten hun vaders alsnog te wreken. Onder hen Diomedes, Tydeus' zoon, die zijn vader nauwelijks heeft gekend maar wiens naam hij zijn hele jeugd heeft horen fluisteren.

"Ik weet niet veel over mijn vader," zegt Diomedes, terwijl hij zijn wapenrusting aantrekt, net zoals Tydeus dat tien jaar eerder deed. "Maar ik weet wel hoe hij stierf. Dat is genoeg om vandaag mee te beginnen."

PERSON:
diomedes:intro

CHOICES:

* Kijk hoe de tweede aanval op Thebe verloopt -> CH6_019

END

=== SCENE: CH6_019 ===

TITLE:
Laodamas Verdedigt de Poorten

TEXT:
Waar Thebe de eerste aanval overleefde, staat er dit keer een verdediger klaar die vastbesloten is de stad opnieuw te redden: Laodamas, zoon van Eteokles, die de poorten met dezelfde koppigheid verdedigt als zijn vader ooit deed.

COMBAT:
laodamas

CHOICES:

* Kijk wat er van Thebe wordt na Laodamas' nederlaag -> CH6_020

END

=== SCENE: CH6_020 ===

TITLE:
De Val van Thebe

TEXT:
Met Laodamas verslagen valt Thebe eindelijk, tien jaar nadat de vaders van de Epigonen er zelf faalden. Diomedes staat tussen de puinhopen van een stad die zijn eigen vader het leven kostte — niet met vreugde, merk je, maar met iets stillers. Wraak, ontdekt hij, voelt anders dan hij zich had voorgesteld.

Zijn naam zal hier niet ophouden. Jaren later, ver van Thebe, zal Diomedes een van de dapperste helden voor de poorten van een heel andere belegerde stad worden.

CODEX:
codex_epigonen

FLAG:
ch6_diomedes_epigonen=true

EERETITEL:
ch6_epigonen

CHOICES:

* Spring nu terug in de tijd — naar een koning die vóór Oedipus over Thebe regeerde -> CH6_021

END

=== SCENE: CH6_021 ===

TITLE:
Terug in de Tijd

TEXT:
"Eén verhaal resteert nog," zegt de Boodschapper, "en het speelt zich eigenlijk af vóór alles wat je tot nu toe hebt gezien — nog vóór Oedipus, nog vóór Laius. Ik bewaarde het voor het laatst, niet omdat het het laatste was, maar omdat het het duidelijkst laat zien waar deze hele vloek ooit begon. Jij, als {tendency_address}, herkent dat patroon inmiddels vast al voor ik het uitleg."

Terug in de tijd dus, naar Pentheus — kleinzoon van Kadmos zelf, en de op twee na eerste koning van Thebe na de stichter.

CHOICES:

* Kijk wat voor koning Pentheus is -> CH6_022

END

=== SCENE: CH6_022 ===

TITLE:
Een Nieuwe God

TEXT:
Een vreemde nieuwe verering verspreidt zich door Thebe: de cultus van Bacchus, god van wijn en extase — en, zoals niemand in de stad hardop durft te zeggen, de zoon van Semele, Kadmos' eigen dochter. Pentheus, Semele's neef en de huidige koning, weigert te geloven dat zijn eigen nicht een god heeft gebaard. Hij verbiedt de verering en probeert de vrouwen van Thebe, die massaal de bergen in trekken om Bacchus te aanbidden, met geweld terug te dwingen.

PERSON:
pentheus:intro

CHOICES:

* Kijk wat Pentheus onderneemt om de Bacchanten te stoppen -> CH6_023

END

=== SCENE: CH6_023 ===

TITLE:
Vermomd de Berg Op

TEXT:
Wanneer dreigementen niets uithalen, vermomt Pentheus zich en sluipt in het geheim de berg op om de riten van de Bacchanten met eigen ogen te bespieden — in de hoop bewijs te vinden om de verering voorgoed te verbieden.

Hij wordt ontdekt. In de door Bacchus opgewekte, goddelijke waanzin herkennen de vrouwen hem niet meer als de koning van Thebe — en niet eens meer als mens.

CHOICES:

* Roep de naam van de god die dit alles heeft losgemaakt -> CH6_024

END

=== SCENE: CH6_024 ===

TITLE:
Een Naam Zonder Antwoord

TEXT:
Pentheus, eindelijk beseffend hoe verkeerd hij dit heeft ingeschat, roept vol ongeloof de naam van de god die hij zo lang heeft geweigerd te erkennen.

PUZZLE:
puzzle_ch6_vocativus_grieks

CHOICES:

* Kijk wat er met Pentheus gebeurt -> CH6_025

END

=== SCENE: CH6_025 ===

TITLE:
Agave

TEXT:
Wat er die middag op de berg gebeurt, is het duisterste dat dit hoofdstuk te vertellen heeft. Onder de vrouwen die Pentheus omsingelen bevindt zich, in haar eigen door de god opgewekte waanzin, zijn moeder Agave — die in hem geen zoon meer ziet, maar een wild dier.

Pas uren later, weer bij zinnen, beseft Agave ten volle wat haar eigen handen hebben aangericht. Van alle vloeken die dit hoofdstuk over Thebe uitspreekt, is dit de wreedste: niet een vreemde straf van een verre god, maar een moeder tegen haar eigen kind, zonder dat ze ooit had willen kiezen.

CODEX:
codex_pentheus_bacchus

PERSON:
pentheus:full

QUEST:
quest_boodschapper_van_kronos: hoofdstuk 6 volledig voltooid

EERETITEL:
ch6_pentheus

CHOICES:

* Luister verder -> CH6_EINDE

END

=== SCENE: CH6_EINDE ===

TITLE:
Het Einde van Hoofdstuk 6

TEXT:
"Je hebt nu een hele stad gezien," zegt de Boodschapper zacht, "over generaties heen, altijd hetzelfde patroon: hoogmoed, en dan een straf die zelden bij de hoogmoedige zelf terechtkomt. Niet elke vloek wordt in één leven uitgesproken. Sommige wachten gewoon op de volgende generatie om hem alsnog te laten uitkomen."

De poort keert terug tot een dunne streep licht. Je neemt geen tastbare herinnering mee dit keer — alleen het besef dat een vloek niet altijd hardop wordt uitgesproken. Soms wordt hij gewoon, generatie na generatie, doorgegeven.

END
`.trim();

