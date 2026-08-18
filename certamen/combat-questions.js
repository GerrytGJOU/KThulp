/* ============================================================================
   COMBAT-QUESTIONS — gedeelde vraagtype-bank + Leitner-mastery
   ----------------------------------------------------------------------------
   Eén vraaggenerator voor ALLE Certamen-modi. Tot 2026-08-18 had elke modus
   zijn eigen lus met precies één vraagtype (LA/GR-woord → 4 NL-opties):
   spCombatNextQuestion() en spRaceNextQuestion() (singleplayer.js) en Battle
   Mode's eigen vraagselectie (battle.js). Die konden alleen receptieve
   woordherkenning toetsen.

   Deze module levert vijf vraagtypes, elk met een `zwaarte` 1-3 die de
   Chronica-combat gebruikt voor de moeilijkheidskeuze ("snelle uitval /
   gerichte slag / genadeslag", COMBAT_OVERHAUL.md voorstel B):

     zwaarte 1  betekenis        LA/GR → NL, meerkeuze
     zwaarte 1  productie        NL → LA/GR, meerkeuze  (BEWUST nooit getypt:
                                 zonder context is er te vaak meer dan één
                                 verdedigbaar antwoord)
     zwaarte 2  vorm_herkenning  "urbem: welke naamval?", meerkeuze
     zwaarte 2  zinsfragment     korte zin → kies de juiste vertaling
     zwaarte 3  vorm_productie   "genitivus enkelvoud van rex?", GETYPT

   LEITNER-MASTERY. `SP_STATE.mastery` (of een equivalent per modus) is een
   platte map masteryKey → box 0-5. Selectie weegt naar lage boxen, zodat een
   woord dat je vijf keer fout deed vaker terugkomt dan een woord dat je blind
   kent — de oude `pick()` trok uniform random en maakte dat onderscheid niet.
   Fout → box terug naar 0; goed → box +1 (max 5).

   MORFOLOGIE. Latijn wordt GEGENEREERD uit paradigma's (CQ_LA_NOMINA /
   CQ_LA_VERBA + de generatoren onderaan): declinatie 1-5 en conjugatie
   1/2/3/3-io/4 zijn regelmatig genoeg om betrouwbaar af te leiden, en de
   bank groeit dan vanzelf mee als er een woord bij komt. Grieks staat
   BEWUST voluit uitgeschreven (CQ_GR_PARADIGMA'S): accentverspringing
   (θάνατος → θανάτου, πολίτης → πολῖται) is niet betrouwbaar te genereren,
   en een leerling een verkeerd geaccentueerde vorm voorschotelen is erger
   dan een kleinere bank.

   UITBREIDEN. Een woord toevoegen aan de vormbank = één regel in
   CQ_LA_NOMINA/CQ_LA_VERBA (Latijn) of één paradigma in CQ_GR_PARADIGMA'S
   (Grieks). Een zin toevoegen = één entry in CQ_ZINNEN. Alles is optioneel:
   ontbreekt er materiaal voor een gevraagd type, dan valt next() netjes
   terug op een lichter type in plaats van te falen.
   ============================================================================ */

/* ---- NAAMVAL- EN TIJDSVOLGORDE — projectafspraak (CLAUDE.md): altijd
   nominativus, genitivus, dativus, accusativus, (ablativus), vocativus. ---- */
const CQ_CASUS_LA = ["nominativus","genitivus","dativus","accusativus","ablativus","vocativus"];
const CQ_CASUS_GR = ["nominativus","genitivus","dativus","accusativus","vocativus"];
const CQ_GETAL    = ["enkelvoud","meervoud"];
const CQ_TIJD_LA  = ["praesens","imperfectum","perfectum"];
const CQ_TIJD_GR  = ["praesens","imperfectum","aoristus"];
const CQ_PERSOON  = ["1e enkelvoud","2e enkelvoud","3e enkelvoud","1e meervoud","2e meervoud","3e meervoud"];

// Wat een naamval "doet" — gebruikt in het micro-onderwijs bij een fout
// antwoord, zodat een misser een leermoment wordt in plaats van een straf.
const CQ_CASUS_FUNCTIE = {
  nominativus:  "onderwerp",
  genitivus:    "bezit, 'van ...'",
  dativus:      "meewerkend voorwerp, 'aan/voor ...'",
  accusativus:  "lijdend voorwerp",
  ablativus:    "middel, plaats, tijd — 'door/met/in ...'",
  vocativus:    "aanspreekvorm",
};

/* ============================================================================
   LATIJNSE NOMINA — nom + genitivus + declinatie + geslacht.
   Alleen woorden die ook echt in SP_VOCAB_ENTRIES staan, zodat de vormbank
   het verhaal volgt en geen eigen woordenlijst wordt.
   decl: 1 | 2 | "2er" | "2n" | 3 | "3n" | "3i" | "3in" | 4 | 5
   ============================================================================ */
const CQ_LA_NOMINA = [
  // ---- Declinatie 1 (f) ----
  { lemma:"terra",      stam:"terr",     decl:1, genus:"f", betekenis:"aarde, land" },
  { lemma:"silva",      stam:"silv",     decl:1, genus:"f", betekenis:"bos, woud" },
  { lemma:"ursa",       stam:"urs",      decl:1, genus:"f", betekenis:"berin" },
  { lemma:"cerva",      stam:"cerv",     decl:1, genus:"f", betekenis:"hinde" },
  { lemma:"dea",        stam:"de",       decl:1, genus:"f", betekenis:"godin" },
  { lemma:"sapientia",  stam:"sapienti", decl:1, genus:"f", betekenis:"wijsheid" },
  { lemma:"ala",        stam:"al",       decl:1, genus:"f", betekenis:"vleugel" },
  { lemma:"cera",       stam:"cer",      decl:1, genus:"f", betekenis:"was" },
  { lemma:"lacrima",    stam:"lacrim",   decl:1, genus:"f", betekenis:"traan" },
  { lemma:"ira",        stam:"ir",       decl:1, genus:"f", betekenis:"woede, wrok" },

  // ---- Declinatie 2 (m op -us / -er, n op -um) ----
  { lemma:"nuntius",    stam:"nunti",    decl:2,   genus:"m", betekenis:"bode, boodschapper" },
  { lemma:"labyrinthus",stam:"labyrinth",decl:2,   genus:"m", betekenis:"doolhof, labyrint" },
  { lemma:"populus",    stam:"popul",    decl:2,   genus:"m", betekenis:"volk" },
  { lemma:"malleus",    stam:"malle",    decl:2,   genus:"m", betekenis:"hamer" },
  { lemma:"ventus",     stam:"vent",     decl:2,   genus:"m", betekenis:"wind" },
  { lemma:"aper",       stam:"apr",      decl:"2er", genus:"m", betekenis:"everzwijn" },
  { lemma:"aurum",      stam:"aur",      decl:"2n", genus:"n", betekenis:"goud" },
  { lemma:"bellum",     stam:"bell",     decl:"2n", genus:"n", betekenis:"oorlog" },
  { lemma:"regnum",     stam:"regn",     decl:"2n", genus:"n", betekenis:"koninkrijk" },
  { lemma:"filum",      stam:"fil",      decl:"2n", genus:"n", betekenis:"draad" },
  { lemma:"sacrificium",stam:"sacrifici",decl:"2n", genus:"n", betekenis:"offer" },
  { lemma:"velum",      stam:"vel",      decl:"2n", genus:"n", betekenis:"zeil" },

  // ---- Declinatie 3, medeklinkerstam (m/f) ----
  { lemma:"rex",        stam:"reg",      decl:3, genus:"m", betekenis:"koning" },
  { lemma:"Iuno",       stam:"Iunon",    decl:3, genus:"f", betekenis:"Juno (godin)" },
  { lemma:"Titan",      stam:"Titan",    decl:3, genus:"m", betekenis:"titaan" },
  { lemma:"draco",      stam:"dracon",   decl:3, genus:"m", betekenis:"draak" },
  { lemma:"soror",      stam:"soror",    decl:3, genus:"f", betekenis:"zuster" },
  { lemma:"frater",     stam:"fratr",    decl:3, genus:"m", betekenis:"broer" },
  { lemma:"pater",      stam:"patr",     decl:3, genus:"m", betekenis:"vader" },
  { lemma:"amor",       stam:"amor",     decl:3, genus:"m", betekenis:"liefde" },

  // ---- Declinatie 3, onzijdig ----
  { lemma:"caput",      stam:"capit",    decl:"3n", genus:"n", betekenis:"hoofd" },
  { lemma:"fulmen",     stam:"fulmin",   decl:"3n", genus:"n", betekenis:"bliksem(schicht)" },
  { lemma:"vellus",     stam:"veller",   decl:"3n", genus:"n", betekenis:"vacht, vlies" },
  { lemma:"vulnus",     stam:"vulner",   decl:"3n", genus:"n", betekenis:"wond" },

  // ---- Declinatie 3, i-stam ----
  { lemma:"ignis",      stam:"ign",      decl:"3i", genus:"m", betekenis:"vuur" },
  { lemma:"avis",       stam:"av",       decl:"3i", genus:"f", betekenis:"vogel" },
  { lemma:"navis",      stam:"nav",      decl:"3i", genus:"f", betekenis:"schip" },
  { lemma:"classis",    stam:"class",    decl:"3i", genus:"f", betekenis:"vloot" },
  { lemma:"pars",       stam:"part",     decl:"3i", genus:"f", betekenis:"deel" },
  { lemma:"mare",       stam:"mar",      decl:"3in", genus:"n", betekenis:"zee" },

  // ---- Declinatie 4 en 5 ----
  { lemma:"currus",     stam:"curr",     decl:4, genus:"m", betekenis:"wagen, strijdwagen" },
  { lemma:"spes",       stam:"sp",       decl:5, genus:"f", betekenis:"hoop" },
];

/* ============================================================================
   LATIJNSE VERBA — praesensstam + perfectumstam + conjugatie.
   conj: 1 | 2 | 3 | "3io" | 4
   ============================================================================ */
const CQ_LA_VERBA = [
  { lemma:"errare",     stam:"erra",    perf:"errav",     conj:1, betekenis:"dwalen" },
  { lemma:"amare",      stam:"ama",     perf:"amav",      conj:1, betekenis:"liefhebben" },
  { lemma:"necare",     stam:"neca",    perf:"necav",     conj:1, betekenis:"doden" },
  { lemma:"mutare",     stam:"muta",    perf:"mutav",     conj:1, betekenis:"veranderen" },
  { lemma:"volare",     stam:"vola",    perf:"volav",     conj:1, betekenis:"vliegen" },
  { lemma:"vulnerare",  stam:"vulnera", perf:"vulnerav",  conj:1, betekenis:"verwonden" },
  { lemma:"iurare",     stam:"iura",    perf:"iurav",     conj:1, betekenis:"zweren" },
  { lemma:"recusare",   stam:"recusa",  perf:"recusav",   conj:1, betekenis:"weigeren" },
  { lemma:"rogare",     stam:"roga",    perf:"rogav",     conj:1, betekenis:"vragen" },
  { lemma:"pugnare",    stam:"pugna",   perf:"pugnav",    conj:1, betekenis:"vechten, strijden" },

  { lemma:"monere",     stam:"mone",    perf:"monu",      conj:2, betekenis:"waarschuwen" },
  { lemma:"habere",     stam:"habe",    perf:"habu",      conj:2, betekenis:"hebben" },
  { lemma:"iubere",     stam:"iube",    perf:"iuss",      conj:2, betekenis:"bevelen, opdragen" },

  { lemma:"currere",    stam:"curr",    perf:"cucurr",    conj:3, betekenis:"rennen" },
  { lemma:"vincere",    stam:"vinc",    perf:"vic",       conj:3, betekenis:"overwinnen" },
  { lemma:"regere",     stam:"reg",     perf:"rex",       conj:3, betekenis:"besturen, regeren" },
  { lemma:"relinquere", stam:"relinqu", perf:"reliqu",    conj:3, betekenis:"achterlaten, verlaten" },
  { lemma:"mittere",    stam:"mitt",    perf:"mis",       conj:3, betekenis:"sturen, werpen" },
  { lemma:"cadere",     stam:"cad",     perf:"cecid",     conj:3, betekenis:"vallen" },
  { lemma:"promittere", stam:"promitt", perf:"promis",    conj:3, betekenis:"beloven" },
  { lemma:"cognoscere", stam:"cognosc", perf:"cognov",    conj:3, betekenis:"leren kennen" },

  { lemma:"fugere",     stam:"fugi",    perf:"fug",       conj:"3io", betekenis:"vluchten" },
  { lemma:"rapere",     stam:"rapi",    perf:"rapu",      conj:"3io", betekenis:"roven, schaken" },
  { lemma:"recipere",   stam:"recipi",  perf:"recep",     conj:"3io", betekenis:"terugpakken" },

  { lemma:"servire",    stam:"servi",   perf:"serviv",    conj:4, betekenis:"dienen" },
  { lemma:"sepelire",   stam:"sepeli",  perf:"sepeliv",   conj:4, betekenis:"begraven" },
  { lemma:"invenire",   stam:"inveni",  perf:"inven",     conj:4, betekenis:"vinden" },
  { lemma:"pervenire",  stam:"perveni", perf:"perven",    conj:4, betekenis:"bereiken, aankomen" },
  { lemma:"aperire",    stam:"aperi",   perf:"aperu",     conj:4, betekenis:"openen" },
];

/* ============================================================================
   GRIEKSE PARADIGMA'S — voluit uitgeschreven (zie de kop van dit bestand
   voor het waarom). Volgorde nomina: nom, gen, dat, acc, (voc) — eerst
   enkelvoud, dan meervoud. Volgorde verba: 1e/2e/3e enkelvoud, 1e/2e/3e
   meervoud, per tijd.
   ============================================================================ */
const CQ_GR_NOMINA = [
  { lemma:"θεός", betekenis:"god", genus:"m", type:"o-stam",
    sg:{ nominativus:"θεός", genitivus:"θεοῦ", dativus:"θεῷ", accusativus:"θεόν", vocativus:"θεέ" },
    pl:{ nominativus:"θεοί", genitivus:"θεῶν", dativus:"θεοῖς", accusativus:"θεούς" } },
  { lemma:"δῆμος", betekenis:"volk, gemeente", genus:"m", type:"o-stam",
    sg:{ nominativus:"δῆμος", genitivus:"δήμου", dativus:"δήμῳ", accusativus:"δῆμον", vocativus:"δῆμε" },
    pl:{ nominativus:"δῆμοι", genitivus:"δήμων", dativus:"δήμοις", accusativus:"δήμους" } },
  { lemma:"θάνατος", betekenis:"dood", genus:"m", type:"o-stam",
    sg:{ nominativus:"θάνατος", genitivus:"θανάτου", dativus:"θανάτῳ", accusativus:"θάνατον", vocativus:"θάνατε" },
    pl:{ nominativus:"θάνατοι", genitivus:"θανάτων", dativus:"θανάτοις", accusativus:"θανάτους" } },
  { lemma:"τύραννος", betekenis:"tiran, alleenheerser", genus:"m", type:"o-stam",
    sg:{ nominativus:"τύραννος", genitivus:"τυράννου", dativus:"τυράννῳ", accusativus:"τύραννον", vocativus:"τύραννε" },
    pl:{ nominativus:"τύραννοι", genitivus:"τυράννων", dativus:"τυράννοις", accusativus:"τυράννους" } },
  { lemma:"νόστος", betekenis:"thuiskomst", genus:"m", type:"o-stam",
    sg:{ nominativus:"νόστος", genitivus:"νόστου", dativus:"νόστῳ", accusativus:"νόστον", vocativus:"νόστε" },
    pl:{ nominativus:"νόστοι", genitivus:"νόστων", dativus:"νόστοις", accusativus:"νόστους" } },

  { lemma:"ἔργον", betekenis:"werk, daad", genus:"n", type:"o-stam onzijdig",
    sg:{ nominativus:"ἔργον", genitivus:"ἔργου", dativus:"ἔργῳ", accusativus:"ἔργον" },
    pl:{ nominativus:"ἔργα", genitivus:"ἔργων", dativus:"ἔργοις", accusativus:"ἔργα" } },
  { lemma:"τόξον", betekenis:"boog", genus:"n", type:"o-stam onzijdig",
    sg:{ nominativus:"τόξον", genitivus:"τόξου", dativus:"τόξῳ", accusativus:"τόξον" },
    pl:{ nominativus:"τόξα", genitivus:"τόξων", dativus:"τόξοις", accusativus:"τόξα" } },

  { lemma:"ἀρετή", betekenis:"deugd, moed", genus:"f", type:"η-stam",
    sg:{ nominativus:"ἀρετή", genitivus:"ἀρετῆς", dativus:"ἀρετῇ", accusativus:"ἀρετήν" },
    pl:{ nominativus:"ἀρεταί", genitivus:"ἀρετῶν", dativus:"ἀρεταῖς", accusativus:"ἀρετάς" } },
  { lemma:"τιμή", betekenis:"eer, aanzien", genus:"f", type:"η-stam",
    sg:{ nominativus:"τιμή", genitivus:"τιμῆς", dativus:"τιμῇ", accusativus:"τιμήν" },
    pl:{ nominativus:"τιμαί", genitivus:"τιμῶν", dativus:"τιμαῖς", accusativus:"τιμάς" } },
  { lemma:"κεφαλή", betekenis:"hoofd", genus:"f", type:"η-stam",
    sg:{ nominativus:"κεφαλή", genitivus:"κεφαλῆς", dativus:"κεφαλῇ", accusativus:"κεφαλήν" },
    pl:{ nominativus:"κεφαλαί", genitivus:"κεφαλῶν", dativus:"κεφαλαῖς", accusativus:"κεφαλάς" } },

  { lemma:"θεά", betekenis:"godin", genus:"f", type:"α-stam",
    sg:{ nominativus:"θεά", genitivus:"θεᾶς", dativus:"θεᾷ", accusativus:"θεάν" },
    pl:{ nominativus:"θεαί", genitivus:"θεῶν", dativus:"θεαῖς", accusativus:"θεάς" } },
  { lemma:"σοφία", betekenis:"wijsheid", genus:"f", type:"α-stam",
    sg:{ nominativus:"σοφία", genitivus:"σοφίας", dativus:"σοφίᾳ", accusativus:"σοφίαν" },
    pl:{ nominativus:"σοφίαι", genitivus:"σοφιῶν", dativus:"σοφίαις", accusativus:"σοφίας" } },
  { lemma:"ξενία", betekenis:"gastvrijheid", genus:"f", type:"α-stam",
    sg:{ nominativus:"ξενία", genitivus:"ξενίας", dativus:"ξενίᾳ", accusativus:"ξενίαν" },
    pl:{ nominativus:"ξενίαι", genitivus:"ξενιῶν", dativus:"ξενίαις", accusativus:"ξενίας" } },
  { lemma:"σκιά", betekenis:"schaduw, schim", genus:"f", type:"α-stam",
    sg:{ nominativus:"σκιά", genitivus:"σκιᾶς", dativus:"σκιᾷ", accusativus:"σκιάν" },
    pl:{ nominativus:"σκιαί", genitivus:"σκιῶν", dativus:"σκιαῖς", accusativus:"σκιάς" } },
  { lemma:"θάλασσα", betekenis:"zee", genus:"f", type:"korte α-stam",
    sg:{ nominativus:"θάλασσα", genitivus:"θαλάσσης", dativus:"θαλάσσῃ", accusativus:"θάλασσαν" },
    pl:{ nominativus:"θάλασσαι", genitivus:"θαλασσῶν", dativus:"θαλάσσαις", accusativus:"θαλάσσας" } },

  { lemma:"πολίτης", betekenis:"burger", genus:"m", type:"ης-stam",
    sg:{ nominativus:"πολίτης", genitivus:"πολίτου", dativus:"πολίτῃ", accusativus:"πολίτην", vocativus:"πολῖτα" },
    pl:{ nominativus:"πολῖται", genitivus:"πολιτῶν", dativus:"πολίταις", accusativus:"πολίτας" } },
  { lemma:"δεσπότης", betekenis:"heer, meester", genus:"m", type:"ης-stam",
    sg:{ nominativus:"δεσπότης", genitivus:"δεσπότου", dativus:"δεσπότῃ", accusativus:"δεσπότην", vocativus:"δέσποτα" },
    pl:{ nominativus:"δεσπόται", genitivus:"δεσποτῶν", dativus:"δεσπόταις", accusativus:"δεσπότας" } },
];

const CQ_GR_VERBA = [
  { lemma:"λύω", betekenis:"losmaken, verbreken",
    praesens:   ["λύω","λύεις","λύει","λύομεν","λύετε","λύουσι(ν)"],
    imperfectum:["ἔλυον","ἔλυες","ἔλυε(ν)","ἐλύομεν","ἐλύετε","ἔλυον"],
    aoristus:   ["ἔλυσα","ἔλυσας","ἔλυσε(ν)","ἐλύσαμεν","ἐλύσατε","ἔλυσαν"] },
  { lemma:"πέμπω", betekenis:"zenden",
    praesens:   ["πέμπω","πέμπεις","πέμπει","πέμπομεν","πέμπετε","πέμπουσι(ν)"],
    imperfectum:["ἔπεμπον","ἔπεμπες","ἔπεμπε(ν)","ἐπέμπομεν","ἐπέμπετε","ἔπεμπον"],
    aoristus:   ["ἔπεμψα","ἔπεμψας","ἔπεμψε(ν)","ἐπέμψαμεν","ἐπέμψατε","ἔπεμψαν"] },
  { lemma:"πιστεύω", betekenis:"vertrouwen, geloven",
    praesens:   ["πιστεύω","πιστεύεις","πιστεύει","πιστεύομεν","πιστεύετε","πιστεύουσι(ν)"],
    imperfectum:["ἐπίστευον","ἐπίστευες","ἐπίστευε(ν)","ἐπιστεύομεν","ἐπιστεύετε","ἐπίστευον"],
    aoristus:   ["ἐπίστευσα","ἐπίστευσας","ἐπίστευσε(ν)","ἐπιστεύσαμεν","ἐπιστεύσατε","ἐπίστευσαν"] },
  { lemma:"φεύγω", betekenis:"vluchten",
    praesens:   ["φεύγω","φεύγεις","φεύγει","φεύγομεν","φεύγετε","φεύγουσι(ν)"],
    imperfectum:["ἔφευγον","ἔφευγες","ἔφευγε(ν)","ἐφεύγομεν","ἐφεύγετε","ἔφευγον"],
    aoristus:   ["ἔφυγον","ἔφυγες","ἔφυγε(ν)","ἐφύγομεν","ἐφύγετε","ἔφυγον"] },
  { lemma:"βάλλω", betekenis:"treffen, werpen",
    praesens:   ["βάλλω","βάλλεις","βάλλει","βάλλομεν","βάλλετε","βάλλουσι(ν)"],
    imperfectum:["ἔβαλλον","ἔβαλλες","ἔβαλλε(ν)","ἐβάλλομεν","ἐβάλλετε","ἔβαλλον"],
    aoristus:   ["ἔβαλον","ἔβαλες","ἔβαλε(ν)","ἐβάλομεν","ἐβάλετε","ἔβαλον"] },
  { lemma:"λαμβάνω", betekenis:"nemen, krijgen",
    praesens:   ["λαμβάνω","λαμβάνεις","λαμβάνει","λαμβάνομεν","λαμβάνετε","λαμβάνουσι(ν)"],
    imperfectum:["ἐλάμβανον","ἐλάμβανες","ἐλάμβανε(ν)","ἐλαμβάνομεν","ἐλαμβάνετε","ἐλάμβανον"],
    aoristus:   ["ἔλαβον","ἔλαβες","ἔλαβε(ν)","ἐλάβομεν","ἐλάβετε","ἔλαβον"] },
  { lemma:"λέγω", betekenis:"zeggen",
    praesens:   ["λέγω","λέγεις","λέγει","λέγομεν","λέγετε","λέγουσι(ν)"],
    imperfectum:["ἔλεγον","ἔλεγες","ἔλεγε(ν)","ἐλέγομεν","ἐλέγετε","ἔλεγον"],
    aoristus:   ["εἶπον","εἶπες","εἶπε(ν)","εἴπομεν","εἴπετε","εἶπον"] },
];

/* ============================================================================
   ZINSFRAGMENTEN (vraagtype 5) — korte zin, vier Nederlandse vertalingen.
   ONTWERPREGEL: de drie afleiders verschillen op precies ÉÉN grammaticaal
   punt van het goede antwoord (naamval, tijd, getal of persoon), nooit op
   woordbetekenis. Zo toetst de vraag echt leesvaardigheid en is er altijd
   iets uit te leggen bij een fout — zie `let` bij elke entry.
   Uitbreiden: één entry erbij, `hoofdstuk` is puur informatief.
   ============================================================================ */
const CQ_ZINNEN = [
  // ---- Latijn ----
  { id:"zin_la_01", taal:"latijn", hoofdstuk:1, zin:"Rex aurum tangit.",
    antwoord:"De koning raakt het goud aan.",
    afleiders:["Het goud raakt de koning aan.","De koningen raken het goud aan.","De koning raakte het goud aan."],
    let:"aurum is accusativus (lijdend voorwerp), rex nominativus (onderwerp) — de volgorde zegt niets, de naamval alles." },
  { id:"zin_la_02", taal:"latijn", hoofdstuk:2, zin:"Nuntius regi epistulam dat.",
    antwoord:"De bode geeft de koning een brief.",
    afleiders:["De bode geeft de brief van de koning.","De koning geeft de bode een brief.","De boden geven de koning een brief."],
    let:"regi is dativus (aan wie?), niet genitivus — vergelijk regis 'van de koning'." },
  { id:"zin_la_03", taal:"latijn", hoofdstuk:2, zin:"Herculem timebant.",
    antwoord:"Zij vreesden Hercules.",
    afleiders:["Zij vrezen Hercules.","Hercules vreesde hen.","Hij vreesde Hercules."],
    let:"timebant is imperfectum (verleden) én 3e meervoud — twee dingen tegelijk: tijd én persoon." },
  { id:"zin_la_04", taal:"latijn", hoofdstuk:3, zin:"Draco vellus custodit.",
    antwoord:"De draak bewaakt het vlies.",
    afleiders:["Het vlies bewaakt de draak.","De draken bewaken het vlies.","De draak bewaakte het vlies."],
    let:"vellus is onzijdig: nominativus en accusativus zijn gelijk — het werkwoord en de context beslissen." },
  { id:"zin_la_05", taal:"latijn", hoofdstuk:4, zin:"Theseus filum in labyrintho relinquit.",
    antwoord:"Theseus laat de draad in het labyrint achter.",
    afleiders:["Theseus laat het labyrint in de draad achter.","Theseus liet de draad in het labyrint achter.","De draad laat Theseus in het labyrint achter."],
    let:"in labyrintho is ablativus na in — plaats waar, niet richting waarheen (dan zou er accusativus staan)." },
  { id:"zin_la_06", taal:"latijn", hoofdstuk:4, zin:"Icarus ad solem volabat.",
    antwoord:"Icarus vloog naar de zon.",
    afleiders:["Icarus vliegt naar de zon.","De zon vloog naar Icarus.","Zij vlogen naar de zon."],
    let:"volabat is imperfectum enkelvoud: een handeling die aan de gang was, niet een die net begon." },
  { id:"zin_la_07", taal:"latijn", hoofdstuk:5, zin:"Nautae navem parant.",
    antwoord:"De zeelieden maken het schip klaar.",
    afleiders:["De zeeman maakt het schip klaar.","De schepen maken de zeeman klaar.","De zeelieden maakten het schip klaar."],
    let:"nautae is hier nominativus meervoud — dezelfde vorm kan ook genitivus enkelvoud zijn, het werkwoord parant beslist." },
  { id:"zin_la_08", taal:"latijn", hoofdstuk:6, zin:"Oedipus patrem non cognoscit.",
    antwoord:"Oedipus kent zijn vader niet.",
    afleiders:["De vader kent Oedipus niet.","Oedipus kende zijn vader niet.","Oedipus kent de vaders niet."],
    let:"patrem is accusativus enkelvoud (lijdend voorwerp); pater zou nominativus zijn." },
  { id:"zin_la_09", taal:"latijn", hoofdstuk:8, zin:"Achilles arma sua non capit.",
    antwoord:"Achilles pakt zijn wapens niet.",
    afleiders:["Achilles' wapens pakken hem niet.","Achilles pakte zijn wapens niet.","Zij pakken Achilles' wapens niet."],
    let:"arma is onzijdig meervoud (nom./acc. gelijk) — capit is enkelvoud, dus Achilles moet het onderwerp zijn." },
  { id:"zin_la_10", taal:"latijn", hoofdstuk:9, zin:"Graeci urbem igne deleverunt.",
    antwoord:"De Grieken verwoestten de stad met vuur.",
    afleiders:["De Grieken verwoesten de stad met vuur.","Het vuur verwoestte de stad van de Grieken.","De Griek verwoestte de stad met vuur."],
    let:"igne is ablativus: het middel waarmee ('met vuur'). deleverunt is perfectum meervoud." },
  { id:"zin_la_11", taal:"latijn", hoofdstuk:12, zin:"Ulixes in patriam pervenit.",
    antwoord:"Odysseus kwam in zijn vaderland aan.",
    afleiders:["Odysseus komt in zijn vaderland aan.","Het vaderland bereikte Odysseus.","Zij kwamen in het vaderland aan."],
    let:"pervenit kan praesens én perfectum zijn — hier beslist de context (in patriam, het einde van de tocht)." },
  { id:"zin_la_12", taal:"latijn", hoofdstuk:13, zin:"Romulus fratrem necavit.",
    antwoord:"Romulus doodde zijn broer.",
    afleiders:["De broer doodde Romulus.","Romulus doodt zijn broer.","Romulus doodde zijn broers."],
    let:"necavit is perfectum enkelvoud; fratrem accusativus enkelvoud — één broer, één keer, voltooid." },

  // ---- Grieks ----
  { id:"zin_gr_01", taal:"grieks", hoofdstuk:1, zin:"ὁ θεὸς τὸ πῦρ πέμπει.",
    antwoord:"De god zendt het vuur.",
    afleiders:["Het vuur zendt de god.","De goden zenden het vuur.","De god zond het vuur."],
    let:"ὁ θεός staat in de nominativus, τὸ πῦρ is onzijdig accusativus — het lidwoord verraadt de naamval." },
  { id:"zin_gr_02", taal:"grieks", hoofdstuk:2, zin:"ἡ θεὰ τὸν ἄνδρα φυλάττει.",
    antwoord:"De godin beschermt de man.",
    afleiders:["De man beschermt de godin.","De godinnen beschermen de man.","De godin beschermde de man."],
    let:"τὸν ἄνδρα is accusativus enkelvoud — de uitgang én het lidwoord wijzen allebei dezelfde kant op." },
  { id:"zin_gr_03", taal:"grieks", hoofdstuk:3, zin:"οἱ πολῖται τὸν τύραννον φεύγουσιν.",
    antwoord:"De burgers ontvluchten de tiran.",
    afleiders:["De tiran ontvlucht de burgers.","De burger ontvlucht de tiran.","De burgers ontvluchtten de tiran."],
    let:"οἱ πολῖται is nominativus meervoud (vergelijk gen. πολιτῶν); φεύγουσιν is praesens 3e meervoud." },
  { id:"zin_gr_04", taal:"grieks", hoofdstuk:5, zin:"οἱ ναῦται εἰς τὴν θάλασσαν ἔπλεον.",
    antwoord:"De zeelieden voeren de zee op.",
    afleiders:["De zeelieden varen de zee op.","De zee voer naar de zeelieden.","De zeeman voer de zee op."],
    let:"ἔπλεον is imperfectum (het augment ἐ- verraadt verleden tijd); εἰς + accusativus is richting." },
  { id:"zin_gr_05", taal:"grieks", hoofdstuk:6, zin:"ἡ σοφία τῷ δήμῳ τιμὴν φέρει.",
    antwoord:"Wijsheid brengt het volk eer.",
    afleiders:["Wijsheid brengt de eer van het volk.","Het volk brengt wijsheid eer.","Wijsheid bracht het volk eer."],
    let:"τῷ δήμῳ is dativus (aan wie?), τιμήν accusativus (wat?) — twee voorwerpen, twee naamvallen." },
  { id:"zin_gr_06", taal:"grieks", hoofdstuk:8, zin:"ὁ Ἀχιλλεὺς τὴν μῆνιν οὐ λύει.",
    antwoord:"Achilles laat zijn wrok niet los.",
    afleiders:["De wrok laat Achilles niet los.","Achilles liet zijn wrok niet los.","Zij laten hun wrok niet los."],
    let:"λύει is praesens 3e enkelvoud; ἔλυε zou imperfectum zijn — let op het augment." },
  { id:"zin_gr_07", taal:"grieks", hoofdstuk:10, zin:"ὁ μάντις τῷ βασιλεῖ τὴν μαντείαν λέγει.",
    antwoord:"De ziener vertelt de koning de profetie.",
    afleiders:["De ziener vertelt de profetie van de koning.","De koning vertelt de ziener de profetie.","De zieners vertellen de koning de profetie."],
    let:"τῷ βασιλεῖ is dativus — de persoon aan wie iets verteld wordt, niet de bezitter." },
  { id:"zin_gr_08", taal:"grieks", hoofdstuk:11, zin:"αἱ σκιαὶ ἐν τῷ Ἅιδῃ ἔμενον.",
    antwoord:"De schimmen bleven in de Hades.",
    afleiders:["De schimmen blijven in de Hades.","De schim bleef in de Hades.","De Hades bleef bij de schimmen."],
    let:"ἔμενον is imperfectum meervoud; αἱ σκιαί nominativus meervoud (vergelijk ἡ σκιά enkelvoud)." },
  { id:"zin_gr_09", taal:"grieks", hoofdstuk:15, zin:"οἱ Ἕλληνες τὴν ἐλευθερίαν ἔλαβον.",
    antwoord:"De Grieken kregen de vrijheid.",
    afleiders:["De Grieken krijgen de vrijheid.","De vrijheid kreeg de Grieken.","De Griek kreeg de vrijheid."],
    let:"ἔλαβον is aoristus (tweede aoristus van λαμβάνω): één afgeronde gebeurtenis in het verleden." },
  { id:"zin_gr_10", taal:"grieks", hoofdstuk:16, zin:"ἡ ξενία τοῖς ἀνθρώποις ἀρετή ἐστιν.",
    antwoord:"Gastvrijheid is voor de mensen een deugd.",
    afleiders:["Gastvrijheid is de deugd van de mensen.","De mensen zijn een deugd voor de gastvrijheid.","Gastvrijheid was voor de mensen een deugd."],
    let:"τοῖς ἀνθρώποις is dativus meervoud ('voor de mensen'); de genitivus zou τῶν ἀνθρώπων zijn." },
];

/* ============================================================================
   GENERATOREN — Latijnse paradigma's
   ============================================================================ */

// Eén naamvalsvorm van een Latijns nomen. Geeft null als de combinatie voor
// dit woord niet bestaat (bv. vocativus bij een onzijdig woord waar hij
// samenvalt, of ablativus in het Grieks).
function cqLatijnNomenVorm(n, naamval, getal){
  const s = n.stam, sg = getal==="enkelvoud";
  switch(n.decl){
    case 1: return sg
      ? { nominativus:s+"a", genitivus:s+"ae", dativus:s+"ae", accusativus:s+"am", ablativus:s+"a", vocativus:s+"a" }[naamval]
      : { nominativus:s+"ae", genitivus:s+"arum", dativus:s+"is", accusativus:s+"as", ablativus:s+"is", vocativus:s+"ae" }[naamval];
    case 2: return sg
      // -ius krijgt in de vocativus enkelvoud alleen -i (nuntius → nunti), niet -ie
      ? { nominativus:s+"us", genitivus:s+"i", dativus:s+"o", accusativus:s+"um", ablativus:s+"o",
          vocativus: n.lemma.endsWith("ius") ? s+"i" : s+"e" }[naamval]
      : { nominativus:s+"i", genitivus:s+"orum", dativus:s+"is", accusativus:s+"os", ablativus:s+"is", vocativus:s+"i" }[naamval];
    case "2er": return sg
      // nominativus/vocativus houden de -er (aper), de rest gebruikt de stam (apr-)
      ? { nominativus:n.lemma, genitivus:s+"i", dativus:s+"o", accusativus:s+"um", ablativus:s+"o", vocativus:n.lemma }[naamval]
      : { nominativus:s+"i", genitivus:s+"orum", dativus:s+"is", accusativus:s+"os", ablativus:s+"is", vocativus:s+"i" }[naamval];
    case "2n": return sg
      ? { nominativus:s+"um", genitivus:s+"i", dativus:s+"o", accusativus:s+"um", ablativus:s+"o", vocativus:s+"um" }[naamval]
      : { nominativus:s+"a", genitivus:s+"orum", dativus:s+"is", accusativus:s+"a", ablativus:s+"is", vocativus:s+"a" }[naamval];
    case 3: return sg
      ? { nominativus:n.lemma, genitivus:s+"is", dativus:s+"i", accusativus:s+"em", ablativus:s+"e", vocativus:n.lemma }[naamval]
      : { nominativus:s+"es", genitivus:s+"um", dativus:s+"ibus", accusativus:s+"es", ablativus:s+"ibus", vocativus:s+"es" }[naamval];
    case "3n": return sg
      ? { nominativus:n.lemma, genitivus:s+"is", dativus:s+"i", accusativus:n.lemma, ablativus:s+"e", vocativus:n.lemma }[naamval]
      : { nominativus:s+"a", genitivus:s+"um", dativus:s+"ibus", accusativus:s+"a", ablativus:s+"ibus", vocativus:s+"a" }[naamval];
    case "3i": return sg
      ? { nominativus:n.lemma, genitivus:s+"is", dativus:s+"i", accusativus:s+"em", ablativus:s+"e", vocativus:n.lemma }[naamval]
      : { nominativus:s+"es", genitivus:s+"ium", dativus:s+"ibus", accusativus:s+"es", ablativus:s+"ibus", vocativus:s+"es" }[naamval];
    case "3in": return sg
      ? { nominativus:n.lemma, genitivus:s+"is", dativus:s+"i", accusativus:n.lemma, ablativus:s+"i", vocativus:n.lemma }[naamval]
      : { nominativus:s+"ia", genitivus:s+"ium", dativus:s+"ibus", accusativus:s+"ia", ablativus:s+"ibus", vocativus:s+"ia" }[naamval];
    case 4: return sg
      ? { nominativus:s+"us", genitivus:s+"us", dativus:s+"ui", accusativus:s+"um", ablativus:s+"u", vocativus:s+"us" }[naamval]
      : { nominativus:s+"us", genitivus:s+"uum", dativus:s+"ibus", accusativus:s+"us", ablativus:s+"ibus", vocativus:s+"us" }[naamval];
    case 5: return sg
      ? { nominativus:s+"es", genitivus:s+"ei", dativus:s+"ei", accusativus:s+"em", ablativus:s+"e", vocativus:s+"es" }[naamval]
      : { nominativus:s+"es", genitivus:s+"erum", dativus:s+"ebus", accusativus:s+"es", ablativus:s+"ebus", vocativus:s+"es" }[naamval];
  }
  return null;
}

const CQ_LA_PERF_UITGANG = ["i","isti","it","imus","istis","erunt"];
// persoonIdx 0-5 = 1e/2e/3e enkelvoud, 1e/2e/3e meervoud (CQ_PERSOON)
function cqLatijnVerbumVorm(v, tijd, persoonIdx){
  const s = v.stam;
  if(tijd==="perfectum") return v.perf + CQ_LA_PERF_UITGANG[persoonIdx];
  if(tijd==="imperfectum"){
    // conj. 1/2 nemen -ba-, conj. 3/3io/4 nemen -eba- (reg → regebam, audi → audiebam)
    const infix = (v.conj===1||v.conj===2) ? "ba" : "eba";
    return s + infix + ["m","s","t","mus","tis","nt"][persoonIdx];
  }
  // praesens
  switch(v.conj){
    case 1:     return [s.slice(0,-1)+"o", s+"s", s+"t", s+"mus", s+"tis", s+"nt"][persoonIdx];
    case 2:     return [s+"o", s+"s", s+"t", s+"mus", s+"tis", s+"nt"][persoonIdx];
    case 3:     return [s+"o", s+"is", s+"it", s+"imus", s+"itis", s+"unt"][persoonIdx];
    case "3io": return [s+"o", s.slice(0,-1)+"is", s.slice(0,-1)+"it", s.slice(0,-1)+"imus", s.slice(0,-1)+"itis", s+"unt"][persoonIdx];
    case 4:     return [s+"o", s+"s", s+"t", s+"mus", s+"tis", s+"unt"][persoonIdx];
  }
  return null;
}

/* ============================================================================
   PUBLIEKE API
   ============================================================================ */
const CombatQuestions = (function(){
  "use strict";

  // Lokale helpers — bewust niet afhankelijk van core.js' pick()/shuffle(),
  // zodat deze module ook los (bv. in een test-harnas) bruikbaar blijft.
  function _pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
  function _shuffle(arr){
    const a = arr.slice();
    for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; }
    return a;
  }
  // Drie afleiders kiezen uit een pool, met voorkeur voor kandidaten die
  // qua VORM op het goede antwoord lijken (zelfde aantal woorden) — anders
  // valt het juiste antwoord op zonder dat je de taal kent. Overgenomen uit
  // de oude spCombatNextQuestion() (leerlingfeedback 2026-08-13).
  function _afleiders(pool, correct, n){
    const woordAantal = s => (s||"").trim().split(/\s+/).length;
    const doel = woordAantal(correct);
    const uniek = pool.filter((v,i,a)=>v!==correct && a.indexOf(v)===i);
    let kandidaten = uniek.filter(v=>woordAantal(v)===doel);
    if(kandidaten.length<n) kandidaten = uniek.filter(v=>Math.abs(woordAantal(v)-doel)<=1);
    if(kandidaten.length<n) kandidaten = uniek;
    return _shuffle(kandidaten).slice(0,n);
  }

  /* ---- Leitner ---------------------------------------------------------- */
  const MAX_BOX = 5;
  // Trekkingsgewicht per box: box 0 (nooit goed gehad / net fout) komt zes
  // keer zo vaak langs als box 5 (beheerst). Nooit 0 — ook een beheerst
  // woord moet af en toe terugkomen, anders verdwijnt de spaced repetition
  // die de oude uniforme trekking per ongeluk al goed deed.
  const BOX_GEWICHT = [6,5,4,3,2,1];
  function box(mastery, key){
    const b = mastery && mastery[key];
    return (typeof b==="number" && b>=0 && b<=MAX_BOX) ? b : 0;
  }
  function gewogenTrek(items, mastery, keyVan, vermijd){
    const bruikbaar = items.filter(it=>!vermijd || !vermijd.includes(keyVan(it)));
    const pool = bruikbaar.length ? bruikbaar : items;
    if(!pool.length) return null;
    const gewichten = pool.map(it=>BOX_GEWICHT[box(mastery, keyVan(it))]);
    const totaal = gewichten.reduce((a,b)=>a+b,0);
    let r = Math.random()*totaal;
    for(let i=0;i<pool.length;i++){ r -= gewichten[i]; if(r<=0) return pool[i]; }
    return pool[pool.length-1];
  }
  // Fout → helemaal terug naar box 0 (het woord moet opnieuw verdiend
  // worden). Goed → één box omhoog. Geeft de nieuwe box terug.
  function noteerAntwoord(mastery, key, goed){
    if(!mastery || !key) return 0;
    const nieuw = goed ? Math.min(MAX_BOX, box(mastery,key)+1) : 0;
    mastery[key] = nieuw;
    return nieuw;
  }

  /* ---- Vocabulaire-hulpjes ---------------------------------------------- */
  // De vocab-entries waaruit getrokken mag worden, gefilterd op taalspoor.
  // Taalspoor "beide" (of geen keuze, vóór Hoofdstuk 10) filtert niet —
  // zie Chronica.md §7.19/B24.
  function _vocabPool(opts){
    const bron = (typeof SP_VOCAB_ENTRIES!=="undefined") ? SP_VOCAB_ENTRIES : {};
    const ids = (opts.vocabIds && opts.vocabIds.length) ? opts.vocabIds : Object.keys(bron);
    let entries = ids.map(id=>bron[id]).filter(Boolean);
    if(opts.taalspoor==="latijn" || opts.taalspoor==="grieks"){
      const gefilterd = entries.filter(e=>e.taal===opts.taalspoor);
      if(gefilterd.length) entries = gefilterd;
    }
    return entries;
  }
  function _vocabKey(e){ return "woord:"+e.woord; }
  // Grieks krijgt zijn transcriptie erbij in het micro-onderwijs — zonder
  // die brug is een fout Grieks woord voor een beginner niet na te lezen.
  function _woordLabel(e){
    return e.taal==="grieks" && e.transcript ? e.woord+" ("+e.transcript+")" : e.woord;
  }

  /* ---- Vraagtype 1: betekenis (LA/GR → NL, meerkeuze) -------------------- */
  function _betekenis(opts){
    const entries = _vocabPool(opts);
    if(entries.length<4) return null;
    const w = gewogenTrek(entries, opts.mastery, _vocabKey, opts.vermijd);
    if(!w) return null;
    const opties = _shuffle([w.betekenis, ..._afleiders(entries.map(x=>x.betekenis), w.betekenis, 3)]);
    if(opties.length<4) return null;
    return {
      type:"betekenis", zwaarte:1, taal:w.taal, invoer:"mc",
      vraag:"Wat betekent <em>"+w.woord+"</em>?",
      vraagTekst:"Wat betekent "+w.woord+"?",
      opties, antwoord:w.betekenis, masteryKey:_vocabKey(w),
      uitleg:"<strong>"+_woordLabel(w)+"</strong> — "+w.betekenis+".",
    };
  }

  /* ---- Vraagtype 2: productie (NL → LA/GR) — ALTIJD meerkeuze ------------ */
  function _productie(opts){
    const entries = _vocabPool(opts);
    if(entries.length<4) return null;
    const w = gewogenTrek(entries, opts.mastery, _vocabKey, opts.vermijd);
    if(!w) return null;
    // Afleiders uit dezelfde taal, anders is het antwoord op het schrift te zien
    const zelfdeTaal = entries.filter(e=>e.taal===w.taal);
    if(zelfdeTaal.length<4) return null;
    const opties = _shuffle([w.woord, ..._afleiders(zelfdeTaal.map(x=>x.woord), w.woord, 3)]);
    if(opties.length<4) return null;
    const taalNm = w.taal==="grieks" ? "Grieks" : "Latijns";
    return {
      type:"productie", zwaarte:1, taal:w.taal, invoer:"mc",
      vraag:"Welk "+taalNm+" woord betekent <em>"+w.betekenis+"</em>?",
      vraagTekst:"Welk "+taalNm+" woord betekent "+w.betekenis+"?",
      opties, antwoord:w.woord, masteryKey:_vocabKey(w),
      uitleg:"<strong>"+_woordLabel(w)+"</strong> — "+w.betekenis+".",
    };
  }

  /* ---- Vormbank: alle beschikbare (vorm, analyse)-paren ------------------ */
  // Levert platte kandidaten op waaruit type 3 en 4 putten. Wordt bij elke
  // aanroep opnieuw opgebouwd — de banken zijn klein genoeg (enkele honderden
  // vormen) dat cachen niets oplevert, en zo blijft een uitbreiding meteen
  // zichtbaar zonder herstart.
  function _vormKandidaten(taalspoor){
    const uit = [];
    const wilLatijn = taalspoor!=="grieks";
    const wilGrieks = taalspoor!=="latijn";
    if(wilLatijn){
      for(const n of CQ_LA_NOMINA){
        for(const getal of CQ_GETAL){
          for(const naamval of CQ_CASUS_LA){
            const vorm = cqLatijnNomenVorm(n, naamval, getal);
            if(!vorm) continue;
            uit.push({ taal:"latijn", soort:"nomen", vorm, lemma:n.lemma, betekenis:n.betekenis,
                       as:"naamval", waarde:naamval, getal, extra:n.genus });
          }
        }
      }
      for(const v of CQ_LA_VERBA){
        for(const tijd of CQ_TIJD_LA){
          for(let p=0;p<6;p++){
            const vorm = cqLatijnVerbumVorm(v, tijd, p);
            if(!vorm) continue;
            uit.push({ taal:"latijn", soort:"verbum", vorm, lemma:v.lemma, betekenis:v.betekenis,
                       as:"tijd", waarde:tijd, persoon:CQ_PERSOON[p], persoonIdx:p });
          }
        }
      }
    }
    if(wilGrieks){
      for(const n of CQ_GR_NOMINA){
        for(const [getalKey, getal] of [["sg","enkelvoud"],["pl","meervoud"]]){
          for(const naamval of CQ_CASUS_GR){
            const vorm = n[getalKey][naamval];
            if(!vorm) continue;
            uit.push({ taal:"grieks", soort:"nomen", vorm, lemma:n.lemma, betekenis:n.betekenis,
                       as:"naamval", waarde:naamval, getal, extra:n.genus });
          }
        }
      }
      for(const v of CQ_GR_VERBA){
        for(const tijd of CQ_TIJD_GR){
          (v[tijd]||[]).forEach((vorm,p)=>{
            uit.push({ taal:"grieks", soort:"verbum", vorm, lemma:v.lemma, betekenis:v.betekenis,
                       as:"tijd", waarde:tijd, persoon:CQ_PERSOON[p], persoonIdx:p });
          });
        }
      }
    }
    return uit;
  }
  function _vormKey(k){ return "vorm:"+k.taal+":"+k.lemma+":"+k.waarde+":"+(k.getal||k.persoon); }

  // Twee vormen zijn voor een leerling niet te onderscheiden als ze er
  // hetzelfde uitzien (rosae = gen./dat. enkelvoud én nom. meervoud). Zo'n
  // vorm mag NOOIT als herkenningsvraag langskomen: er is dan meer dan één
  // goed antwoord. Deze test filtert ze eruit.
  function _isEenduidig(kandidaat, alle){
    const gelijk = alle.filter(k =>
      k.taal===kandidaat.taal && k.lemma===kandidaat.lemma && k.vorm===kandidaat.vorm);
    return gelijk.every(k => k.waarde===kandidaat.waarde);
  }

  /* ---- Vraagtype 3: vormherkenning (meerkeuze) --------------------------- */
  function _vormHerkenning(opts){
    const alle = _vormKandidaten(opts.taalspoor);
    const eenduidig = alle.filter(k=>_isEenduidig(k, alle));
    if(eenduidig.length<4) return null;
    const k = gewogenTrek(eenduidig, opts.mastery, _vormKey, opts.vermijd);
    if(!k) return null;
    const asLijst = k.as==="naamval"
      ? (k.taal==="grieks" ? CQ_CASUS_GR : CQ_CASUS_LA)
      : (k.taal==="grieks" ? CQ_TIJD_GR : CQ_TIJD_LA);
    const afleiders = _shuffle(asLijst.filter(x=>x!==k.waarde)).slice(0,3);
    if(afleiders.length<2) return null;
    const opties = _shuffle([k.waarde, ...afleiders]);
    const vraagKop = k.as==="naamval"
      ? "In welke naamval staat <em>"+k.vorm+"</em>?"
      : "In welke tijd staat <em>"+k.vorm+"</em>?";
    const staart = k.as==="naamval"
      ? k.vorm+" is "+k.waarde+" "+k.getal+" van "+k.lemma+" ("+k.betekenis+") — "+CQ_CASUS_FUNCTIE[k.waarde]+"."
      : k.vorm+" is "+k.waarde+", "+k.persoon+", van "+k.lemma+" ("+k.betekenis+").";
    return {
      type:"vorm_herkenning", zwaarte:2, taal:k.taal, invoer:"mc",
      vraag:vraagKop+' <span class="note">(van '+k.lemma+", "+k.betekenis+")</span>",
      vraagTekst:(k.as==="naamval"?"In welke naamval staat ":"In welke tijd staat ")+k.vorm+"?",
      opties, antwoord:k.waarde, masteryKey:_vormKey(k),
      uitleg:"<strong>"+staart+"</strong>",
    };
  }

  /* ---- Vraagtype 4: vormproductie (getypt) ------------------------------- */
  function _vormProductie(opts){
    const alle = _vormKandidaten(opts.taalspoor);
    // Twee filters:
    // (1) Vormen met een variant tussen haakjes (λύουσι(ν)) zijn prima om te
    //     HERKENNEN, maar oneerlijk om te laten typen — welke van de twee zou
    //     je moeten intikken?
    // (2) Vormen die gelijk zijn aan het lemma dat in de vraag staat ("geef
    //     de genitivus enkelvoud van ignis" → ignis) toetsen niets: het
    //     antwoord staat al in de opdracht.
    const typbaar = alle.filter(k=>!/[()]/.test(k.vorm) && k.vorm!==k.lemma);
    if(!typbaar.length) return null;
    const k = gewogenTrek(typbaar, opts.mastery, _vormKey, opts.vermijd);
    if(!k) return null;
    const opdracht = k.as==="naamval"
      ? "Geef de <strong>"+k.waarde+" "+k.getal+"</strong> van <em>"+k.lemma+"</em>"
      : "Geef de <strong>"+k.persoon+" "+k.waarde+"</strong> van <em>"+k.lemma+"</em>";
    return {
      type:"vorm_productie", zwaarte:3, taal:k.taal,
      invoer: k.taal==="grieks" ? "typed-greek" : "typed-latin",
      vraag:opdracht+' <span class="note">('+k.betekenis+")</span>",
      vraagTekst:(k.as==="naamval"
        ? "Geef de "+k.waarde+" "+k.getal+" van "+k.lemma
        : "Geef de "+k.persoon+" "+k.waarde+" van "+k.lemma),
      antwoord:k.vorm, masteryKey:_vormKey(k),
      uitleg:"<strong>"+k.vorm+"</strong> — "+(k.as==="naamval"
        ? k.waarde+" "+k.getal+" van "+k.lemma+" ("+k.betekenis+"), "+CQ_CASUS_FUNCTIE[k.waarde]+"."
        : k.persoon+" "+k.waarde+" van "+k.lemma+" ("+k.betekenis+")."),
    };
  }

  /* ---- Vraagtype 5: zinsfragment (meerkeuze) ----------------------------- */
  function _zinsfragment(opts){
    let pool = CQ_ZINNEN;
    if(opts.taalspoor==="latijn" || opts.taalspoor==="grieks"){
      const gefilterd = pool.filter(z=>z.taal===opts.taalspoor);
      if(gefilterd.length) pool = gefilterd;
    }
    // Nooit een zin uit een hoofdstuk dat de speler nog niet bereikt heeft —
    // anders toets je op stof die het verhaal nog niet gegeven heeft.
    if(opts.hoofdstuk){
      const bereikt = pool.filter(z=>!z.hoofdstuk || z.hoofdstuk<=opts.hoofdstuk);
      if(bereikt.length) pool = bereikt;
    }
    if(!pool.length) return null;
    const z = gewogenTrek(pool, opts.mastery, x=>"zin:"+x.id, opts.vermijd);
    if(!z) return null;
    // De zin staat mét slotpunt in de bank (zo hoort hij ook in de uitleg te
    // staan), maar in de vraagzin zelf zou dat "…ἔλαβον.?" opleveren.
    const zonderPunt = z.zin.replace(/\.$/, "");
    return {
      type:"zinsfragment", zwaarte:2, taal:z.taal, invoer:"mc",
      vraag:"Wat betekent <em>"+zonderPunt+"</em>?",
      vraagTekst:"Wat betekent "+zonderPunt+"?",
      opties:_shuffle([z.antwoord, ...z.afleiders]), antwoord:z.antwoord,
      masteryKey:"zin:"+z.id,
      uitleg:"<strong>"+z.zin+"</strong> — "+z.antwoord+"<br><span class=\"note\">"+z.let+"</span>",
    };
  }

  const GENERATOREN = {
    betekenis:       _betekenis,
    productie:       _productie,
    vorm_herkenning: _vormHerkenning,
    vorm_productie:  _vormProductie,
    zinsfragment:    _zinsfragment,
  };
  // Welke types horen bij welke zwaarte (= welke aanvalsvorm de speler koos).
  const PER_ZWAARTE = {
    1: ["betekenis","productie"],
    2: ["vorm_herkenning","zinsfragment"],
    3: ["vorm_productie"],
  };

  /* ---- next() ------------------------------------------------------------
     opts:
       zwaarte     1|2|3 (default 1)
       vocabIds    array met SP_VOCAB_ENTRIES-sleutels (de al geleerde woorden)
       taalspoor   "latijn"|"grieks"|"beide"|undefined
       mastery     object masteryKey → box 0-5 (wordt niet gemuteerd door next)
       vermijd     array masteryKeys die deze ronde al langskwamen
       hoofdstuk   hoogste bereikte hoofdstuknummer (filtert de zinnenbank)
       types       optionele witte lijst van vraagtypes
     Geeft null als er echt niets te genereren viel (lege vocab-pool).
     Valt binnen een zwaarte terug op een ander type, en daarna op een
     lichtere zwaarte — een gevecht mag nooit stilvallen omdat de bank voor
     dit taalspoor te dun is.
  ------------------------------------------------------------------------- */
  function next(opts){
    opts = opts||{};
    const gevraagd = Math.min(3, Math.max(1, opts.zwaarte||1));
    for(let z=gevraagd; z>=1; z--){
      let types = PER_ZWAARTE[z].slice();
      if(opts.types) types = types.filter(t=>opts.types.includes(t));
      for(const t of _shuffle(types)){
        const q = GENERATOREN[t](opts);
        if(q){ q.gevraagdeZwaarte = gevraagd; return q; }
      }
    }
    return null;
  }

  /* ---- controleer() ------------------------------------------------------
     Meerkeuze vergelijkt letterlijk. Getypt Latijn negeert hoofdletters en
     randspaties; getypt Grieks gaat via spNormalizeGreek() (singleplayer.js)
     zodat accenten niet meetellen maar spiritus en iota subscriptum wél —
     precies dezelfde regel als bij de bestaande typed-greek-puzzels.
  ------------------------------------------------------------------------- */
  function controleer(q, antwoord){
    if(!q) return false;
    const geg = (antwoord==null?"":String(antwoord));
    if(q.invoer==="typed-greek"){
      if(typeof spNormalizeGreek==="function") return spNormalizeGreek(geg)===spNormalizeGreek(q.antwoord);
      return geg.trim()===q.antwoord.trim();
    }
    if(q.invoer==="typed-latin"){
      const norm = s=>s.trim().toLowerCase().replace(/\s+/g," ");
      return norm(geg)===norm(q.antwoord);
    }
    return geg===q.antwoord;
  }

  return { next, controleer, noteerAntwoord, box, MAX_BOX,
           // voor tests/validatie en voor een toekomstig docentrapport
           _vormKandidaten, PER_ZWAARTE };
})();
