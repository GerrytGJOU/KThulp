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

   Belangrijke afwijking t.o.v. het aangeleverde testscenario: de Game Bible
   is expliciet dat de speler GEEN naam heeft ("juist daardoor kan iedere
   leerling zichzelf in hem herkennen") — {player.name} is dus overal uit de
   tekst gehaald. Gender (en dus voornaamwoorden: hij/zij/die) kiest de speler
   wél, één keer, vóór de proloog begint.
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
   een title.bonus puur informatief (getoond, niet toegepast). */
const SP_TITLES = [
  { id:"boogschutter_orakel", nm:"Boogschutter van het Orakel",
    desc:"Koos de boog toen het Orakel van Chronos ontwaakte.", bonus:null },
  { id:"hopliet_orakel", nm:"Hopliet van het Orakel",
    desc:"Koos het schild toen het Orakel van Chronos ontwaakte.", bonus:null },
  { id:"cavalerist_orakel", nm:"Cavalerist van het Orakel",
    desc:"Koos de teugels toen het Orakel van Chronos ontwaakte.", bonus:null },
  { id:"bewaarder_herinnering", nm:"Bewaarder van de Herinnering",
    desc:"Ontcijferde het Orakel van Chronos en voltooide de proloog.",
    bonus:{ scope:["battle","boss","totalwar"], type:"be_on_fast", val:1,
            desc:"+1 BE bij een snel juist antwoord" } },
];

/* ---- CAMPAGNEKAART — Proloog + 11 hoofdstukken + Finale, gesynchroniseerd
   met Pallas (Grieks) en Minerva (Latijn), klas 2 t/m 6 gymnasium. Elk
   hoofdstuk legt vast: welke Pallas/Minerva-les erbij hoort, welke grammatica
   de puzzels/opdrachten van dat hoofdstuk voeden, de hoofdpersonages, en de
   illustratie die er (in stripstijl, door Gemini) bij hoort. Verhaal gaat
   vóór lesstof — de grammatica hieronder is de BASIS voor puzzels, niet het
   doel van de scène. ---- */
const SP_CAMPAIGN = [
  { id:"proloog", nr:0, type:"proloog", nm:"Het Orakel van Chronos",
    periode:"Tijdloos / overgang tussen heden en oudheid",
    verhaal:"De speler ontdekt het Orakel van Chronos en wordt opgenomen in de wereld van de klassieke oudheid.",
    pallas:"Les 1: Griekse wereld en alfabet", minerva:"Hoofdstuk 1: Latijn en Romeinen",
    grammatica:"Alfabet, taalbewustzijn, eerste woorden",
    gameplay:"Codex Memoriae, inscripties lezen, eerste keuzes",
    personages:"Hermes/Mercurius, Orakel van Chronos",
    illustratie:"De ontdekking van het bronzen Orakel" },
  { id:"ch1", nr:1, type:"hoofdstuk", nm:"De Namen van de Wereld",
    periode:"Mythisch Griekenland",
    verhaal:"De speler ontdekt dat namen macht hebben. Zonder namen verdwijnen goden en helden uit de herinnering.",
    pallas:"Les 2: De Griekse goden", minerva:"Hoofdstuk 2: Midas",
    grammatica:"Zelfstandig naamwoord, bijvoeglijk naamwoord, lidwoord, nominativus, accusativus, vocativus",
    gameplay:"Wie handelt? Wie ondergaat? Wie wordt aangesproken?",
    personages:"Midas, Dionysus, Olympische goden",
    thema:"Een naam maakt iets herkenbaar",
    illustratie:"Midas in zijn paleis met gouden voorwerpen" },
  { id:"ch2", nr:2, type:"hoofdstuk", nm:"De Werken van de Helden",
    periode:"Heroïsche tijd",
    verhaal:"De speler helpt Herakles en ontdekt dat helden worden gevormd door hun daden.",
    pallas:"Les 3-4: Herakles", minerva:"Hoofdstuk 3: Latona",
    grammatica:"Praesens, werkwoordstammen, imperativus, esse, posse",
    gameplay:"Acties uitvoeren via werkwoorden",
    personages:"Herakles, Latona, Apollo, Artemis",
    thema:"Taal beschrijft wat mensen doen",
    illustratie:"Herakles tijdens één van zijn opdrachten" },
  { id:"ch3", nr:3, type:"hoofdstuk", nm:"Beloften van Goden en Mensen",
    periode:"Mythische wereld",
    verhaal:"De speler ontdekt relaties tussen goden en mensen. Bezit, afkomst en geschenken worden belangrijk.",
    pallas:"Les 5: Herakles wordt god", minerva:"Hoofdstuk 4: Jupiter en Io",
    grammatica:"Genitivus, dativus, bijstelling",
    gameplay:"Relaties begrijpen, voorwerpen koppelen aan eigenaars",
    personages:"Herakles, Zeus/Jupiter, Io",
    thema:"Taal laat zien hoe mensen verbonden zijn",
    illustratie:"Zeus en Io onder goddelijke bescherming" },
  { id:"ch4", nr:4, type:"hoofdstuk", nm:"De Doolhof van Keuzes",
    periode:"Kreta en Griekse heldentijd",
    verhaal:"Theseus betreedt het Labyrint. De speler ontdekt dat tijd en herinnering meerdere lagen hebben.",
    pallas:"Les 6-7: Theseus en Minotauros", minerva:"Hoofdstuk 5-6: Phaëthon en Familia",
    grammatica:"Praesens, infinitivus, vocativus, imperfectum, perfectum, ablativus",
    gameplay:"Eerste grote keuzes, tijdsherkenning",
    personages:"Theseus, Ariadne, Minotauros, Phaëthon",
    thema:"Gebeurtenissen hebben een verleden en gevolg",
    illustratie:"Theseus in het donkere Labyrint" },
  { id:"ch5", nr:5, type:"hoofdstuk", nm:"De Val van Troje",
    periode:"Trojaanse Oorlog",
    verhaal:"De speler belandt in het tiende jaar van de oorlog.",
    pallas:"Les 8-14", minerva:"Hoofdstuk 7-10",
    grammatica:"Imperfectum, aoristus, participia, A.C.I., betrekkelijke bijzinnen",
    gameplay:"Historische keuzes, factiesysteem",
    personages:"Achilles, Hector, Odysseus, Aeneas",
    thema:"Verhalen worden doorgegeven door taal",
    vertakkingen:"Trojaans / Grieks / Neutraal",
    illustratie:"Troje brandt" },
  { id:"ch6", nr:6, type:"hoofdstuk", nm:"De Stichting van Rome",
    periode:"Van Troje naar Rome",
    verhaal:"De speler reist mee met Aeneas en ontdekt hoe een mythe een nationale geschiedenis wordt.",
    pallas:"Herhaling Troje", minerva:"Hoofdstuk 10-11",
    grammatica:"A.C.I., passief, participium perfectum passief, deponentia",
    gameplay:"Legendes reconstrueren",
    personages:"Aeneas, Anchises, Romulus",
    thema:"Geschiedenis en mythe lopen door elkaar",
    illustratie:"Aeneas vlucht uit Troje" },
  { id:"ch7", nr:7, type:"hoofdstuk", nm:"Mensen Achter de Mythen",
    periode:"Vroege Griekse en Romeinse samenleving",
    verhaal:"De speler ontdekt het dagelijks leven achter de grote verhalen.",
    pallas:"Les 15-18: Odysseus", minerva:"Hoofdstuk 7-8, 14-16",
    grammatica:"Medium, passief, participium, voornaamwoorden",
    gameplay:"Dialoog, sociale keuzes",
    personages:"Odysseus, Kirke, gewone burgers",
    thema:"Niet alleen helden maken geschiedenis",
    illustratie:"Odysseus bij Kirke" },
  { id:"ch8", nr:8, type:"hoofdstuk", nm:"Athene en Rome",
    periode:"Klassieke periode",
    verhaal:"De speler ontdekt politiek, onderwijs en cultuur.",
    pallas:"Les 22-27", minerva:"Hoofdstuk 19-20",
    grammatica:"Futurum, conjunctivus, vraagzinnen, vergelijkingen",
    gameplay:"Retorica, debat, overtuigen",
    personages:"Athena, Atheense burgers, Romeinen",
    thema:"Taal overtuigt mensen",
    illustratie:"De Agora van Athene" },
  { id:"ch9", nr:9, type:"hoofdstuk", nm:"Oorlog en Macht",
    periode:"Perzische oorlogen en Romeinse expansie",
    verhaal:"De speler ziet hoe steden en rijken worden gevormd door keuzes.",
    pallas:"Les 28: Perzische oorlogen", minerva:"Hoofdstuk 17-18: Hannibal",
    grammatica:"Perfectum, futurum, futurum exactum, ablativus absolutus",
    gameplay:"Strategie en militaire keuzes",
    personages:"Leonidas, Themistocles, Hannibal",
    illustratie:"Slagveld met Grieken en Perzen" },
  { id:"ch10", nr:10, type:"hoofdstuk", nm:"Caesar en de Geschreven Geschiedenis",
    periode:"Late Republiek",
    verhaal:"De speler ontdekt dat degene die schrijft bepaalt wat herinnerd wordt.",
    pallas:"Verdieping Grieks", minerva:"Hoofdstuk 22-23",
    grammatica:"Infinitivus, gerundium, gerundivum",
    gameplay:"Bronnen analyseren",
    personages:"Caesar",
    illustratie:"Caesar schrijft zijn Commentarii" },
  { id:"ch11", nr:11, type:"hoofdstuk", nm:"De Keizers en de Waarheid",
    periode:"Romeinse keizertijd",
    verhaal:"De speler ontdekt hoe macht invloed heeft op herinnering.",
    pallas:"Filosofie en literatuur", minerva:"Hoofdstuk 24-25",
    grammatica:"N.C.I., complexe naamvallen, literair lezen",
    gameplay:"Morele keuzes",
    personages:"Augustus, Nero",
    illustratie:"Romeins paleis en keizerlijke macht" },
  { id:"finale", nr:12, type:"finale", nm:"De Laatste Herinnering",
    thema:"De strijd tegen de Vergetelheid",
    verhaal:"De speler gebruikt alle opgedane taalvaardigheid.",
    gameplay:"Alle Codex-kennis wordt gebruikt",
    eindboodschap:"Wie de taal bewaart, bewaart de geschiedenis" },
];

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

/* ---- BOEK I — PROLOOG: "DE BOER VAN LATIUM" ----
   Herschreven t.o.v. het aangeleverde testscenario: geen {player.name} (de
   Game Bible wil een naamloze speler), voornaamwoorden via gender-keuze.
   CH1_009 had in de brontekst een foutief hergebruikt {subject} voor de
   Boodschapper i.p.v. de speler — hier vervangen door een vaste aanduiding
   ("ze") zodat het niet met de spelerspronomen meeloopt. */
const SP_CH1_CNS = `
=== SCENE: CH1_001 ===

TITLE:
Het Veld bij Latium

TEXT:
Al sinds zonsopgang werkt {subject} op het veld aan de rand van Latium. De aarde is droog en zwaar onder de ploeg. Wanneer {subject} hem weer naar voren duwt, klinkt er een doffe klap. De ploeg zit vast.

CHOICES:

* Graaf meteen verder -> CH1_002
* Veeg eerst voorzichtig het zand weg -> CH1_001B

END

=== SCENE: CH1_001B ===

TITLE:
Voorzichtig

TEXT:
{subject_cap} veegt het losse zand weg met {possessive} handen. Onder een dunne laag aarde tekent zich hout af — bewerkt hout, geen steen.

CHOICES:

* Graaf de kist op -> CH1_002

END

=== SCENE: CH1_002 ===

TITLE:
De Kist

TEXT:
Na enig graven ligt een oude, verweerde houten kist voor {object}. Het hout is donker geworden door de jaren in de grond, maar het slot is nog intact.

CHOICES:

* Open de kist -> CH1_003
* Laat de kist gesloten en keer terug naar het dorp -> CH1_002B

END

=== SCENE: CH1_002B ===

TITLE:
Twijfel

TEXT:
{subject_cap} besluit de kist ongemoeid te laten en loopt terug naar het dorp. De rest van de dag blijft de gedachte aan de kist {object} niet loslaten.

END

=== SCENE: CH1_003 ===

TITLE:
Drie Voorwerpen

TEXT:
Het deksel kraakt open. Binnenin liggen drie voorwerpen, elk gewikkeld in verweerd linnen: een jachtboog met een gespannen pees, een oude bronzen speerpunt aan een verweerde schacht, en een paar bronzen ruitersporen.

CHOICES:

* Neem de jachtboog -> CH1_004A
* Neem de speer -> CH1_004B
* Neem de ruitersporen -> CH1_004C

END

=== SCENE: CH1_004A ===

TITLE:
De Boogschutter

TEXT:
{subject_cap} pakt de jachtboog op. Het gewicht voelt vertrouwd aan, alsof {possessive} handen deze vorm al kenden. Observatie, snelheid en precisie — dit worden vanaf nu {possessive} eerste instincten.

REWARD:
class=Boogschutter; traits=observatie,snelheid,precisie

EERETITEL:
boogschutter_orakel

CHOICES:

* Verder zoeken in de kist -> CH1_005

END

=== SCENE: CH1_004B ===

TITLE:
De Hopliet

TEXT:
{subject_cap} grijpt de speer. Het brons is koud, maar het gewicht geeft een vreemde rust. Kracht, moed en verdediging voelen vanaf nu als {possessive} tweede natuur.

REWARD:
class=Hopliet; traits=kracht,moed,verdediging

EERETITEL:
hopliet_orakel

CHOICES:

* Verder zoeken in de kist -> CH1_005

END

=== SCENE: CH1_004C ===

TITLE:
De Cavalerist

TEXT:
{subject_cap} tilt de bronzen ruitersporen op. Ze zijn lichter dan verwacht. Mobiliteit, tactiek en snelheid — {subject} voelt meteen waarvoor ze bedoeld zijn.

REWARD:
class=Cavalerist; traits=mobiliteit,tactiek,snelheid

EERETITEL:
cavalerist_orakel

CHOICES:

* Verder zoeken in de kist -> CH1_005

END

=== SCENE: CH1_005 ===

TITLE:
De Bronzen Schijf

TEXT:
Onder het linnen, dieper in de kist, ligt nog iets: een ronde bronzen schijf, bedekt met tekens die {subject} niet herkent. Ze voelt warm aan, alsof ze nooit echt in de grond heeft gelegen.

CODEX:
codex_orakel_van_chronos

CHOICES:

* Raak de schijf aan -> CH1_006
* Trek {possessive} hand terug -> CH1_005B

END

=== SCENE: CH1_005B ===

TITLE:
Aarzeling

TEXT:
{subject_cap} aarzelt. Maar de schijf lijkt {object} te roepen, zacht en aanhoudend, alsof ze wacht.

CHOICES:

* Raak de schijf alsnog aan -> CH1_006

END

=== SCENE: CH1_006 ===

TITLE:
Vervorming

TEXT:
Zodra {possessive} vingers de schijf raken, begint de lucht te trillen. De kleuren van het veld vervagen. Latium zelf lijkt zich om {object} heen te herschikken.

IMAGE:
tijdvervorming_veld.jpg

CHOICES:

* Laat het gebeuren -> CH1_007

END

=== SCENE: CH1_007 ===

TITLE:
Het Orakel van Chronos

TEXT:
Uit de schijf rijzen tekens op die in de lucht blijven hangen — een patroon, wachtend om ontcijferd te worden voordat de poort zich verder opent.

PUZZLE:
puzzle_orakel_symbolen_01

CHOICES:

* Ontcijfer het patroon -> CH1_008

END

=== SCENE: CH1_008 ===

TITLE:
De Poort

TEXT:
Het patroon valt op zijn plaats. Voor {object} scheurt de lucht open tot een poort van licht zonder kleur. Aan de andere kant staat een gestalte, nauwelijks zichtbaar.

QUEST:
quest_boodschapper_van_kronos: gestart

CHOICES:

* Spreek de gestalte aan -> CH1_009

END

=== SCENE: CH1_009 ===

TITLE:
De Boodschapper

TEXT:
De gestalte spreekt niet meteen. Wanneer {subject} eindelijk een stem hoort, klinkt die kalm en van ver weg — alsof ze van buiten de tijd zelf komt.

DIALOGUE:
De Boodschapper van Kronos
De wereld vergeet.

EERETITEL:
bewaarder_herinnering

END
`.trim();
