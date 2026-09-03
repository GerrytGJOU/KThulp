/* VERBFORMS — werkwoordsvormen-dataset voor Certamen (Latijn + Grieks).
   Latijn wordt algoritmisch gegenereerd uit hoofdvormen (regelmatig systeem,
   nieuwe werkwoorden toevoegen = één regel data). Grieks wordt met de hand
   ingevoerd (accentverschuiving is niet betrouwbaar automatisch af te leiden —
   zelfde reden als combat-questions.js's CQ_GR_VERBA).
   Wordt vóór verbquiz.js geladen en is wereldwijd beschikbaar. */

/* ===================== Latijn ===================== */

const VF_PRONOMEN = ["ik","jij","hij","wij","jullie","zij"];
const VF_PERSOONLABEL = ["1e persoon enkelvoud","2e persoon enkelvoud","3e persoon enkelvoud","1e persoon meervoud","2e persoon meervoud","3e persoon meervoud"];
const VF_TIJDEN_LA = ["praesens","imperfectum","perfectum","plusquamperfectum","futurum","futurumexactum"];
const VF_TIJD_NM = {praesens:"praesens", imperfectum:"imperfectum", perfectum:"perfectum", plusquamperfectum:"plusquamperfectum", futurum:"futurum simplex", futurumexactum:"futurum exactum"};
const VF_WIJZEN = ["indicativus","coniunctivus"];
const VF_GENERA = ["activum","passivum"];

// Stamgroepen zoals Pallas/Minerva ze aanhoudt — groep is gelijk aan conj
// voor reguliere werkwoorden (dus ook "3io", los van groep 3), en "irr"
// voor de onregelmatige werkwoorden onderaan dit bestand.
const VF_GROEP_NAMEN = {1:"A-stammen", 2:"E-stammen", 3:"Medeklinkerstammen", "3io":"Korte I-stammen", 4:"Lange I-stammen", irr:"Onregelmatig"};
const VF_GROEP_VOLGORDE = [1,2,3,"3io",4,"irr"];

// stam = praesensstam (incl. thematische klinker, bv. "ama", "audi"), perf = perfectumstam
// (bv. "amav"), ppp = stam van het volt. deelw. (bv. "amat" -> amatus), conj = 1|2|3|"3io"|4.
// nl = {inf, pres:[6], past:[6], part} voor de Nederlandse glossen (zie vfLatijnGlos).
const VF_LA_VERBS = [
  // ---- A-stammen (1e vervoeging) ----
  { lemma:"amo",   stam:"ama",  perf:"amav",  ppp:"amat",  conj:1, groep:1, betekenis:"liefhebben, houden van",
    nl:{ inf:"liefhebben", pres:["heb lief","hebt lief","heeft lief","hebben lief","hebben lief","hebben lief"],
         past:["had lief","had lief","had lief","hadden lief","hadden lief","hadden lief"], part:"liefgehad" } },
  { lemma:"voco",  stam:"voca", perf:"vocav", ppp:"vocat", conj:1, groep:1, betekenis:"roepen",
    nl:{ inf:"roepen", pres:["roep","roept","roept","roepen","roepen","roepen"],
         past:["riep","riep","riep","riepen","riepen","riepen"], part:"geroepen" } },
  { lemma:"puto",  stam:"puta", perf:"putav", ppp:"putat", conj:1, groep:1, betekenis:"menen, denken",
    nl:{ inf:"menen", pres:["meen","meent","meent","menen","menen","menen"],
         past:["meende","meende","meende","meenden","meenden","meenden"], part:"gemeend" } },
  { lemma:"paro",  stam:"para", perf:"parav", ppp:"parat", conj:1, groep:1, betekenis:"voorbereiden, klaarmaken",
    nl:{ inf:"voorbereiden", pres:["bereid voor","bereidt voor","bereidt voor","bereiden voor","bereiden voor","bereiden voor"],
         past:["bereidde voor","bereidde voor","bereidde voor","bereidden voor","bereidden voor","bereidden voor"], part:"voorbereid" } },
  { lemma:"laudo", stam:"lauda",perf:"laudav",ppp:"laudat",conj:1, groep:1, betekenis:"prijzen",
    nl:{ inf:"prijzen", pres:["prijs","prijst","prijst","prijzen","prijzen","prijzen"],
         past:["prees","prees","prees","prezen","prezen","prezen"], part:"geprezen" } },

  // ---- E-stammen (2e vervoeging) ----
  { lemma:"teneo", stam:"tene", perf:"tenu",  ppp:"tent",  conj:2, groep:2, betekenis:"vasthouden",
    nl:{ inf:"vasthouden", pres:["houd vast","houdt vast","houdt vast","houden vast","houden vast","houden vast"],
         past:["hield vast","hield vast","hield vast","hielden vast","hielden vast","hielden vast"], part:"vastgehouden" } },
  { lemma:"habeo", stam:"habe", perf:"habu",  ppp:"habit", conj:2, groep:2, betekenis:"hebben, houden",
    nl:{ inf:"hebben", pres:["heb","hebt","heeft","hebben","hebben","hebben"],
         past:["had","had","had","hadden","hadden","hadden"], part:"gehad" } },
  { lemma:"video", stam:"vide", perf:"vid",   ppp:"vis",   conj:2, groep:2, betekenis:"zien",
    nl:{ inf:"zien", pres:["zie","ziet","ziet","zien","zien","zien"],
         past:["zag","zag","zag","zagen","zagen","zagen"], part:"gezien" } },
  { lemma:"iubeo", stam:"iube", perf:"iuss",  ppp:"iuss",  conj:2, groep:2, betekenis:"bevelen",
    nl:{ inf:"bevelen", pres:["beveel","beveelt","beveelt","bevelen","bevelen","bevelen"],
         past:["beval","beval","beval","bevalen","bevalen","bevalen"], part:"bevolen" } },
  { lemma:"debeo", stam:"debe", perf:"debu",  ppp:"debit", conj:2, groep:2, betekenis:"moeten",
    nl:{ inf:"moeten", pres:["moet","moet","moet","moeten","moeten","moeten"],
         past:["moest","moest","moest","moesten","moesten","moesten"], part:"gemoeten" } },

  // ---- Medeklinkerstammen (3e vervoeging) ----
  { lemma:"mitto", stam:"mitt", perf:"mis",   ppp:"miss",  conj:3, groep:3, betekenis:"sturen, zenden",
    nl:{ inf:"sturen", pres:["stuur","stuurt","stuurt","sturen","sturen","sturen"],
         past:["stuurde","stuurde","stuurde","stuurden","stuurden","stuurden"], part:"gestuurd" } },
  { lemma:"dico",  stam:"dic",  perf:"dix",   ppp:"dict",  conj:3, groep:3, betekenis:"zeggen",
    nl:{ inf:"zeggen", pres:["zeg","zegt","zegt","zeggen","zeggen","zeggen"],
         past:["zei","zei","zei","zeiden","zeiden","zeiden"], part:"gezegd" } },
  { lemma:"ago",   stam:"ag",   perf:"eg",    ppp:"act",   conj:3, groep:3, betekenis:"doen, handelen",
    nl:{ inf:"doen", pres:["doe","doet","doet","doen","doen","doen"],
         past:["deed","deed","deed","deden","deden","deden"], part:"gedaan" } },
  { lemma:"vinco", stam:"vinc", perf:"vic",   ppp:"vict",  conj:3, groep:3, betekenis:"overwinnen",
    nl:{ inf:"overwinnen", pres:["overwin","overwint","overwint","overwinnen","overwinnen","overwinnen"],
         past:["overwon","overwon","overwon","overwonnen","overwonnen","overwonnen"], part:"overwonnen" } },
  { lemma:"pono",  stam:"pon",  perf:"posu",  ppp:"posit", conj:3, groep:3, betekenis:"zetten, leggen, plaatsen",
    nl:{ inf:"zetten", pres:["zet","zet","zet","zetten","zetten","zetten"],
         past:["zette","zette","zette","zetten","zetten","zetten"], part:"gezet" } },

  // ---- Korte I-stammen (3e vervoeging op -io) ----
  { lemma:"capio",   stam:"capi",   perf:"cep",   ppp:"capt",   conj:"3io", groep:"3io", betekenis:"pakken, nemen, veroveren",
    nl:{ inf:"pakken", pres:["pak","pakt","pakt","pakken","pakken","pakken"],
         past:["pakte","pakte","pakte","pakten","pakten","pakten"], part:"gepakt" } },
  { lemma:"facio",   stam:"faci",   perf:"fec",   ppp:"fact",   conj:"3io", groep:"3io", betekenis:"maken, doen",
    nl:{ inf:"maken", pres:["maak","maakt","maakt","maken","maken","maken"],
         past:["maakte","maakte","maakte","maakten","maakten","maakten"], part:"gemaakt" } },
  { lemma:"accipio", stam:"accipi", perf:"accep", ppp:"accept", conj:"3io", groep:"3io", betekenis:"ontvangen",
    nl:{ inf:"ontvangen", pres:["ontvang","ontvangt","ontvangt","ontvangen","ontvangen","ontvangen"],
         past:["ontving","ontving","ontving","ontvingen","ontvingen","ontvingen"], part:"ontvangen" } },
  { lemma:"fugio",   stam:"fugi",   perf:"fug",   ppp:"fugit",  conj:"3io", groep:"3io", betekenis:"vluchten",
    nl:{ inf:"vluchten", pres:["vlucht","vlucht","vlucht","vluchten","vluchten","vluchten"],
         past:["vluchtte","vluchtte","vluchtte","vluchtten","vluchtten","vluchtten"], part:"gevlucht", aux:"zijn" } },
  { lemma:"recipio", stam:"recipi", perf:"recep", ppp:"recept", conj:"3io", groep:"3io", betekenis:"terugnemen, terugtrekken",
    nl:{ inf:"terugnemen", pres:["neem terug","neemt terug","neemt terug","nemen terug","nemen terug","nemen terug"],
         past:["nam terug","nam terug","nam terug","namen terug","namen terug","namen terug"], part:"teruggenomen" } },

  // ---- Lange I-stammen (4e vervoeging) ----
  { lemma:"audio", stam:"audi", perf:"audiv", ppp:"audit", conj:4, groep:4, betekenis:"horen",
    nl:{ inf:"horen", pres:["hoor","hoort","hoort","horen","horen","horen"],
         past:["hoorde","hoorde","hoorde","hoorden","hoorden","hoorden"], part:"gehoord" } },
  { lemma:"venio", stam:"veni", perf:"ven",   ppp:"vent",  conj:4, groep:4, betekenis:"komen",
    nl:{ inf:"komen", pres:["kom","komt","komt","komen","komen","komen"],
         past:["kwam","kwam","kwam","kwamen","kwamen","kwamen"], part:"gekomen", aux:"zijn" } },
  { lemma:"scio",  stam:"sci",  perf:"sciv",  ppp:"scit",  conj:4, groep:4, betekenis:"weten",
    nl:{ inf:"weten", pres:["weet","weet","weet","weten","weten","weten"],
         past:["wist","wist","wist","wisten","wisten","wisten"], part:"geweten" } },
  { lemma:"sentio",stam:"senti",perf:"sens",  ppp:"sens",  conj:4, groep:4, betekenis:"voelen, merken",
    nl:{ inf:"voelen", pres:["voel","voelt","voelt","voelen","voelen","voelen"],
         past:["voelde","voelde","voelde","voelden","voelden","voelden"], part:"gevoeld" } },
  { lemma:"aperio",stam:"aperi",perf:"aperu", ppp:"apert", conj:4, groep:4, betekenis:"openen",
    nl:{ inf:"openen", pres:["open","opent","opent","openen","openen","openen"],
         past:["opende","opende","opende","openden","openden","openden"], part:"geopend" } },
];

/* ---- Onregelmatige werkwoorden — volledig met de hand uitgeschreven, net
   als de Griekse dataset hieronder: deze volgen geen enkele vervoegingsklasse
   en zijn niet uit hoofdvormen af te leiden. `glossen` bevat alleen
   indicativus per tijd; coniunctivus hergebruikt de gelijknamige
   indicativus-glos + " (coniunctivus)" (zelfde conventie als de
   Vocare-Excel/vfLatijnGlos). `glossenPass` alleen waar een passivum bestaat
   (uitsluitend fero heeft dat in dit rijtje). ---- */
const VF_LA_IRREGULARIS = [
  { lemma:"sum", betekenis:"zijn", irregular:true, groep:"irr",
    vormen:{
      "praesens|indicativus|activum":["sum","es","est","sumus","estis","sunt"],
      "imperfectum|indicativus|activum":["eram","eras","erat","eramus","eratis","erant"],
      "futurum|indicativus|activum":["ero","eris","erit","erimus","eritis","erunt"],
      "perfectum|indicativus|activum":["fui","fuisti","fuit","fuimus","fuistis","fuerunt"],
      "plusquamperfectum|indicativus|activum":["fueram","fueras","fuerat","fueramus","fueratis","fuerant"],
      "futurumexactum|indicativus|activum":["fuero","fueris","fuerit","fuerimus","fueritis","fuerint"],
      "praesens|coniunctivus|activum":["sim","sis","sit","simus","sitis","sint"],
      "imperfectum|coniunctivus|activum":["essem","esses","esset","essemus","essetis","essent"],
      "perfectum|coniunctivus|activum":["fuerim","fueris","fuerit","fuerimus","fueritis","fuerint"],
      "plusquamperfectum|coniunctivus|activum":["fuissem","fuisses","fuisset","fuissemus","fuissetis","fuissent"],
    },
    glossen:{
      praesens:["ik ben","jij bent","hij is","wij zijn","jullie zijn","zij zijn"],
      imperfectum:["ik was","jij was","hij was","wij waren","jullie waren","zij waren"],
      futurum:["ik zal zijn","jij zal zijn","hij zal zijn","wij zullen zijn","jullie zullen zijn","zij zullen zijn"],
      perfectum:["ik ben geweest","jij bent geweest","hij is geweest","wij zijn geweest","jullie zijn geweest","zij zijn geweest"],
      plusquamperfectum:["ik was geweest","jij was geweest","hij was geweest","wij waren geweest","jullie waren geweest","zij waren geweest"],
      futurumexactum:["ik zal zijn geweest","jij zal zijn geweest","hij zal zijn geweest","wij zullen zijn geweest","jullie zullen zijn geweest","zij zullen zijn geweest"],
    } },
  { lemma:"possum", betekenis:"kunnen", irregular:true, groep:"irr",
    vormen:{
      "praesens|indicativus|activum":["possum","potes","potest","possumus","potestis","possunt"],
      "imperfectum|indicativus|activum":["poteram","poteras","poterat","poteramus","poteratis","poterant"],
      "futurum|indicativus|activum":["potero","poteris","poterit","poterimus","poteritis","poterunt"],
      "perfectum|indicativus|activum":["potui","potuisti","potuit","potuimus","potuistis","potuerunt"],
      "plusquamperfectum|indicativus|activum":["potueram","potueras","potuerat","potueramus","potueratis","potuerant"],
      "futurumexactum|indicativus|activum":["potuero","potueris","potuerit","potuerimus","potueritis","potuerint"],
      "praesens|coniunctivus|activum":["possim","possis","possit","possimus","possitis","possint"],
      "imperfectum|coniunctivus|activum":["possem","posses","posset","possemus","possetis","possent"],
      "perfectum|coniunctivus|activum":["potuerim","potueris","potuerit","potuerimus","potueritis","potuerint"],
      "plusquamperfectum|coniunctivus|activum":["potuissem","potuisses","potuisset","potuissemus","potuissetis","potuissent"],
    },
    glossen:{
      praesens:["ik kan","jij kunt","hij kan","wij kunnen","jullie kunnen","zij kunnen"],
      imperfectum:["ik kon","jij kon","hij kon","wij konden","jullie konden","zij konden"],
      futurum:["ik zal kunnen","jij zal kunnen","hij zal kunnen","wij zullen kunnen","jullie zullen kunnen","zij zullen kunnen"],
      perfectum:["ik heb gekund","jij hebt gekund","hij heeft gekund","wij hebben gekund","jullie hebben gekund","zij hebben gekund"],
      plusquamperfectum:["ik had gekund","jij had gekund","hij had gekund","wij hadden gekund","jullie hadden gekund","zij hadden gekund"],
      futurumexactum:["ik zal hebben gekund","jij zal hebben gekund","hij zal hebben gekund","wij zullen hebben gekund","jullie zullen hebben gekund","zij zullen hebben gekund"],
    } },
  { lemma:"volo", betekenis:"willen", irregular:true, groep:"irr",
    vormen:{
      "praesens|indicativus|activum":["volo","vis","vult","volumus","vultis","volunt"],
      "imperfectum|indicativus|activum":["volebam","volebas","volebat","volebamus","volebatis","volebant"],
      "futurum|indicativus|activum":["volam","voles","volet","volemus","voletis","volent"],
      "perfectum|indicativus|activum":["volui","voluisti","voluit","voluimus","voluistis","voluerunt"],
      "plusquamperfectum|indicativus|activum":["volueram","volueras","voluerat","volueramus","volueratis","voluerant"],
      "futurumexactum|indicativus|activum":["voluero","volueris","voluerit","voluerimus","volueritis","voluerint"],
      "praesens|coniunctivus|activum":["velim","velis","velit","velimus","velitis","velint"],
      "imperfectum|coniunctivus|activum":["vellem","velles","vellet","vellemus","velletis","vellent"],
      "perfectum|coniunctivus|activum":["voluerim","volueris","voluerit","voluerimus","volueritis","voluerint"],
      "plusquamperfectum|coniunctivus|activum":["voluissem","voluisses","voluisset","voluissemus","voluissetis","voluissent"],
    },
    glossen:{
      praesens:["ik wil","jij wilt","hij wil","wij willen","jullie willen","zij willen"],
      imperfectum:["ik wilde","jij wilde","hij wilde","wij wilden","jullie wilden","zij wilden"],
      futurum:["ik zal willen","jij zal willen","hij zal willen","wij zullen willen","jullie zullen willen","zij zullen willen"],
      perfectum:["ik heb gewild","jij hebt gewild","hij heeft gewild","wij hebben gewild","jullie hebben gewild","zij hebben gewild"],
      plusquamperfectum:["ik had gewild","jij had gewild","hij had gewild","wij hadden gewild","jullie hadden gewild","zij hadden gewild"],
      futurumexactum:["ik zal hebben gewild","jij zal hebben gewild","hij zal hebben gewild","wij zullen hebben gewild","jullie zullen hebben gewild","zij zullen hebben gewild"],
    } },
  { lemma:"nolo", betekenis:"niet willen", irregular:true, groep:"irr",
    vormen:{
      "praesens|indicativus|activum":["nolo","non vis","non vult","nolumus","non vultis","nolunt"],
      "imperfectum|indicativus|activum":["nolebam","nolebas","nolebat","nolebamus","nolebatis","nolebant"],
      "futurum|indicativus|activum":["nolam","noles","nolet","nolemus","noletis","nolent"],
      "perfectum|indicativus|activum":["nolui","noluisti","noluit","noluimus","noluistis","noluerunt"],
      "plusquamperfectum|indicativus|activum":["nolueram","nolueras","noluerat","nolueramus","nolueratis","noluerant"],
      "futurumexactum|indicativus|activum":["noluero","nolueris","noluerit","noluerimus","nolueritis","noluerint"],
      "praesens|coniunctivus|activum":["nolim","nolis","nolit","nolimus","nolitis","nolint"],
      "imperfectum|coniunctivus|activum":["nollem","nolles","nollet","nollemus","nolletis","nollent"],
      "perfectum|coniunctivus|activum":["noluerim","nolueris","noluerit","noluerimus","nolueritis","noluerint"],
      "plusquamperfectum|coniunctivus|activum":["noluissem","noluisses","noluisset","noluissemus","noluissetis","noluissent"],
    },
    glossen:{
      praesens:["ik wil niet","jij wilt niet","hij wil niet","wij willen niet","jullie willen niet","zij willen niet"],
      imperfectum:["ik wilde niet","jij wilde niet","hij wilde niet","wij wilden niet","jullie wilden niet","zij wilden niet"],
      futurum:["ik zal niet willen","jij zal niet willen","hij zal niet willen","wij zullen niet willen","jullie zullen niet willen","zij zullen niet willen"],
      perfectum:["ik heb niet gewild","jij hebt niet gewild","hij heeft niet gewild","wij hebben niet gewild","jullie hebben niet gewild","zij hebben niet gewild"],
      plusquamperfectum:["ik had niet gewild","jij had niet gewild","hij had niet gewild","wij hadden niet gewild","jullie hadden niet gewild","zij hadden niet gewild"],
      futurumexactum:["ik zal niet hebben gewild","jij zal niet hebben gewild","hij zal niet hebben gewild","wij zullen niet hebben gewild","jullie zullen niet hebben gewild","zij zullen niet hebben gewild"],
    } },
  { lemma:"malo", betekenis:"liever willen", irregular:true, groep:"irr",
    vormen:{
      "praesens|indicativus|activum":["malo","mavis","mavult","malumus","mavultis","malunt"],
      "imperfectum|indicativus|activum":["malebam","malebas","malebat","malebamus","malebatis","malebant"],
      "futurum|indicativus|activum":["malam","males","malet","malemus","maletis","malent"],
      "perfectum|indicativus|activum":["malui","maluisti","maluit","maluimus","maluistis","maluerunt"],
      "plusquamperfectum|indicativus|activum":["malueram","malueras","maluerat","malueramus","malueratis","maluerant"],
      "futurumexactum|indicativus|activum":["maluero","malueris","maluerit","maluerimus","malueritis","maluerint"],
      "praesens|coniunctivus|activum":["malim","malis","malit","malimus","malitis","malint"],
      "imperfectum|coniunctivus|activum":["mallem","malles","mallet","mallemus","malletis","mallent"],
      "perfectum|coniunctivus|activum":["maluerim","malueris","maluerit","maluerimus","malueritis","maluerint"],
      "plusquamperfectum|coniunctivus|activum":["maluissem","maluisses","maluisset","maluissemus","maluissetis","maluissent"],
    },
    glossen:{
      praesens:["ik wil liever","jij wilt liever","hij wil liever","wij willen liever","jullie willen liever","zij willen liever"],
      imperfectum:["ik wilde liever","jij wilde liever","hij wilde liever","wij wilden liever","jullie wilden liever","zij wilden liever"],
      futurum:["ik zal liever willen","jij zal liever willen","hij zal liever willen","wij zullen liever willen","jullie zullen liever willen","zij zullen liever willen"],
      perfectum:["ik heb liever gewild","jij hebt liever gewild","hij heeft liever gewild","wij hebben liever gewild","jullie hebben liever gewild","zij hebben liever gewild"],
      plusquamperfectum:["ik had liever gewild","jij had liever gewild","hij had liever gewild","wij hadden liever gewild","jullie hadden liever gewild","zij hadden liever gewild"],
      futurumexactum:["ik zal liever hebben gewild","jij zal liever hebben gewild","hij zal liever hebben gewild","wij zullen liever hebben gewild","jullie zullen liever hebben gewild","zij zullen liever hebben gewild"],
    } },
  { lemma:"eo", betekenis:"gaan", irregular:true, groep:"irr",
    vormen:{
      "praesens|indicativus|activum":["eo","is","it","imus","itis","eunt"],
      "imperfectum|indicativus|activum":["ibam","ibas","ibat","ibamus","ibatis","ibant"],
      "futurum|indicativus|activum":["ibo","ibis","ibit","ibimus","ibitis","ibunt"],
      "perfectum|indicativus|activum":["ii","isti","iit","iimus","istis","ierunt"],
      "plusquamperfectum|indicativus|activum":["ieram","ieras","ierat","ieramus","ieratis","ierant"],
      "futurumexactum|indicativus|activum":["iero","ieris","ierit","ierimus","ieritis","ierint"],
      "praesens|coniunctivus|activum":["eam","eas","eat","eamus","eatis","eant"],
      "imperfectum|coniunctivus|activum":["irem","ires","iret","iremus","iretis","irent"],
      "perfectum|coniunctivus|activum":["ierim","ieris","ierit","ierimus","ieritis","ierint"],
      "plusquamperfectum|coniunctivus|activum":["issem","isses","isset","issemus","issetis","issent"],
    },
    glossen:{
      praesens:["ik ga","jij gaat","hij gaat","wij gaan","jullie gaan","zij gaan"],
      imperfectum:["ik ging","jij ging","hij ging","wij gingen","jullie gingen","zij gingen"],
      futurum:["ik zal gaan","jij zal gaan","hij zal gaan","wij zullen gaan","jullie zullen gaan","zij zullen gaan"],
      perfectum:["ik ben gegaan","jij bent gegaan","hij is gegaan","wij zijn gegaan","jullie zijn gegaan","zij zijn gegaan"],
      plusquamperfectum:["ik was gegaan","jij was gegaan","hij was gegaan","wij waren gegaan","jullie waren gegaan","zij waren gegaan"],
      futurumexactum:["ik zal zijn gegaan","jij zal zijn gegaan","hij zal zijn gegaan","wij zullen zijn gegaan","jullie zullen zijn gegaan","zij zullen zijn gegaan"],
    } },
  { lemma:"fero", betekenis:"dragen, brengen", irregular:true, groep:"irr",
    vormen:{
      "praesens|indicativus|activum":["fero","fers","fert","ferimus","fertis","ferunt"],
      "imperfectum|indicativus|activum":["ferebam","ferebas","ferebat","ferebamus","ferebatis","ferebant"],
      "futurum|indicativus|activum":["feram","feres","feret","feremus","feretis","ferent"],
      "perfectum|indicativus|activum":["tuli","tulisti","tulit","tulimus","tulistis","tulerunt"],
      "plusquamperfectum|indicativus|activum":["tuleram","tuleras","tulerat","tuleramus","tuleratis","tulerant"],
      "futurumexactum|indicativus|activum":["tulero","tuleris","tulerit","tulerimus","tuleritis","tulerint"],
      "praesens|coniunctivus|activum":["feram","feras","ferat","feramus","feratis","ferant"],
      "imperfectum|coniunctivus|activum":["ferrem","ferres","ferret","ferremus","ferretis","ferrent"],
      "perfectum|coniunctivus|activum":["tulerim","tuleris","tulerit","tulerimus","tuleritis","tulerint"],
      "plusquamperfectum|coniunctivus|activum":["tulissem","tulisses","tulisset","tulissemus","tulissetis","tulissent"],
      "praesens|indicativus|passivum":["feror","ferris","fertur","ferimur","ferimini","feruntur"],
      "imperfectum|indicativus|passivum":["ferebar","ferebaris","ferebatur","ferebamur","ferebamini","ferebantur"],
      "futurum|indicativus|passivum":["ferar","fereris","feretur","feremur","feremini","ferentur"],
      "perfectum|indicativus|passivum":["latus sum","latus es","latus est","lati sumus","lati estis","lati sunt"],
      "plusquamperfectum|indicativus|passivum":["latus eram","latus eras","latus erat","lati eramus","lati eratis","lati erant"],
      "futurumexactum|indicativus|passivum":["latus ero","latus eris","latus erit","lati erimus","lati eritis","lati erunt"],
      "praesens|coniunctivus|passivum":["ferar","feraris","feratur","feramur","feramini","ferantur"],
      "imperfectum|coniunctivus|passivum":["ferrer","ferreris","ferretur","ferremur","ferremini","ferrentur"],
      "perfectum|coniunctivus|passivum":["latus sim","latus sis","latus sit","lati simus","lati sitis","lati sint"],
      "plusquamperfectum|coniunctivus|passivum":["latus essem","latus esses","latus esset","lati essemus","lati essetis","lati essent"],
    },
    glossen:{
      praesens:["ik breng","jij brengt","hij brengt","wij brengen","jullie brengen","zij brengen"],
      imperfectum:["ik bracht","jij bracht","hij bracht","wij brachten","jullie brachten","zij brachten"],
      futurum:["ik zal brengen","jij zal brengen","hij zal brengen","wij zullen brengen","jullie zullen brengen","zij zullen brengen"],
      perfectum:["ik heb gebracht","jij hebt gebracht","hij heeft gebracht","wij hebben gebracht","jullie hebben gebracht","zij hebben gebracht"],
      plusquamperfectum:["ik had gebracht","jij had gebracht","hij had gebracht","wij hadden gebracht","jullie hadden gebracht","zij hadden gebracht"],
      futurumexactum:["ik zal hebben gebracht","jij zal hebben gebracht","hij zal hebben gebracht","wij zullen hebben gebracht","jullie zullen hebben gebracht","zij zullen hebben gebracht"],
    },
    glossenPass:{
      praesens:["ik word gebracht","jij wordt gebracht","hij wordt gebracht","wij worden gebracht","jullie worden gebracht","zij worden gebracht"],
      imperfectum:["ik werd gebracht","jij werd gebracht","hij werd gebracht","wij werden gebracht","jullie werden gebracht","zij werden gebracht"],
      futurum:["ik zal worden gebracht","jij zal worden gebracht","hij zal worden gebracht","wij zullen worden gebracht","jullie zullen worden gebracht","zij zullen worden gebracht"],
      perfectum:["ik ben gebracht","jij bent gebracht","hij is gebracht","wij zijn gebracht","jullie zijn gebracht","zij zijn gebracht"],
      plusquamperfectum:["ik was gebracht","jij was gebracht","hij was gebracht","wij waren gebracht","jullie waren gebracht","zij waren gebracht"],
      futurumexactum:["ik zal zijn gebracht","jij zal zijn gebracht","hij zal zijn gebracht","wij zullen zijn gebracht","jullie zullen zijn gebracht","zij zullen zijn gebracht"],
    } },
];
VF_LA_VERBS.push(...VF_LA_IRREGULARIS);

function vfLatijnVormIrr(v, tijd, wijs, genus, i){
  const arr = v.vormen[tijd+"|"+wijs+"|"+genus];
  return arr ? arr[i] : null;
}
function vfLatijnGlosIrr(v, tijd, wijs, genus, i){
  const table = (genus==="passivum" && v.glossenPass) ? v.glossenPass : v.glossen;
  const arr = table[tijd];
  if(!arr) return null;
  return wijs==="coniunctivus" ? arr[i]+" (coniunctivus)" : arr[i];
}

// Infinitivus activi (nodig voor imperfectum coniunctivus = infinitief + persoonsuitgang).
function vfLatijnInfinitief(v){
  if(v.conj===3) return v.stam+"ere";
  if(v.conj==="3io") return v.stam.slice(0,-1)+"ere";
  return v.stam+"re"; // 1, 2, 4
}

// Genereert één Latijnse werkwoordsvorm. persoonIdx 0-5 = ik/jij/hij/wij/jullie/zij.
// Retourneert null voor combinaties die niet bestaan (futurum(exactum) coniunctivus,
// of — bij onregelmatige werkwoorden — een genus/wijs die dat werkwoord niet heeft).
function vfLatijnVorm(v, tijd, modus, genus, persoonIdx){
  if(v.irregular) return vfLatijnVormIrr(v, tijd, modus, genus, persoonIdx);
  const s = v.stam, i = persoonIdx;
  if(modus==="coniunctivus" && (tijd==="futurum" || tijd==="futurumexactum")) return null;

  if(modus==="coniunctivus"){
    if(tijd==="perfectum"){
      const u = genus==="activum" ? ["erim","eris","erit","erimus","eritis","erint"]
                                   : [" sim"," sis"," sit"];
      if(genus==="activum") return v.perf+u[i];
      const ppU=[" sim"," sis"," sit"," simus"," sitis"," sint"];
      return v.ppp+(i<3?"us":"i")+ppU[i];
    }
    if(tijd==="plusquamperfectum"){
      if(genus==="activum") return v.perf+["issem","isses","isset","issemus","issetis","issent"][i];
      const ppU=[" essem"," esses"," esset"," essemus"," essetis"," essent"];
      return v.ppp+(i<3?"us":"i")+ppU[i];
    }
    // praesens / imperfectum coniunctivus
    const isConj1 = v.conj===1;
    if(tijd==="praesens"){
      const kern = isConj1 ? s.slice(0,-1)+"e" : s+"a";
      if(genus==="activum") return kern+["m","s","t","mus","tis","nt"][i];
      return kern+["r","ris","tur","mur","mini","ntur"][i];
    }
    if(tijd==="imperfectum"){
      const inf = vfLatijnInfinitief(v);
      if(genus==="activum") return inf+["m","s","t","mus","tis","nt"][i];
      return inf+["r","ris","tur","mur","mini","ntur"][i];
    }
    return null;
  }

  // indicativus
  if(tijd==="perfectum"){
    if(genus==="activum") return v.perf+["i","isti","it","imus","istis","erunt"][i];
    const u=[" sum"," es"," est"," sumus"," estis"," sunt"];
    return v.ppp+(i<3?"us":"i")+u[i];
  }
  if(tijd==="plusquamperfectum"){
    if(genus==="activum") return v.perf+["eram","eras","erat","eramus","eratis","erant"][i];
    const u=[" eram"," eras"," erat"," eramus"," eratis"," erant"];
    return v.ppp+(i<3?"us":"i")+u[i];
  }
  if(tijd==="futurumexactum"){
    if(genus==="activum") return v.perf+["ero","eris","erit","erimus","eritis","erint"][i];
    const u=[" ero"," eris"," erit"," erimus"," eritis"," erunt"];
    return v.ppp+(i<3?"us":"i")+u[i];
  }
  if(tijd==="imperfectum"){
    const infix = (v.conj===1||v.conj===2) ? "ba" : "eba";
    if(genus==="activum") return s+infix+["m","s","t","mus","tis","nt"][i];
    return s+infix+["r","ris","tur","mur","mini","ntur"][i];
  }
  if(tijd==="futurum"){
    if(v.conj===1||v.conj===2){
      if(genus==="activum") return s+["bo","bis","bit","bimus","bitis","bunt"][i];
      return s+"b"+["or","eris","itur","imur","imini","untur"][i];
    }
    if(genus==="activum") return s+["am","es","et","emus","etis","ent"][i];
    return s+["ar","eris","etur","emur","emini","entur"][i];
  }
  // praesens
  switch(v.conj){
    case 1:
      if(genus==="activum") return [s.slice(0,-1)+"o", s+"s", s+"t", s+"mus", s+"tis", s+"nt"][i];
      return [s.slice(0,-1)+"or", s+"ris", s+"tur", s+"mur", s+"mini", s+"ntur"][i];
    case 2:
      if(genus==="activum") return [s+"o", s+"s", s+"t", s+"mus", s+"tis", s+"nt"][i];
      return [s+"or", s+"ris", s+"tur", s+"mur", s+"mini", s+"ntur"][i];
    case 3:
      if(genus==="activum") return [s+"o", s+"is", s+"it", s+"imus", s+"itis", s+"unt"][i];
      return [s+"or", s+"eris", s+"itur", s+"imur", s+"imini", s+"untur"][i];
    case "3io": {
      const bare = s.slice(0,-1);
      if(genus==="activum") return [s+"o", bare+"is", bare+"it", bare+"imus", bare+"itis", s+"unt"][i];
      return [s+"or", bare+"eris", s+"tur", s+"mur", s+"mini", s+"untur"][i];
    }
    case 4:
      if(genus==="activum") return [s+"o", s+"s", s+"t", s+"mus", s+"tis", s+"unt"][i];
      return [s+"or", s+"ris", s+"tur", s+"mur", s+"mini", s+"untur"][i];
  }
  return null;
}

// Nederlandse glans bij een vorm — zelfde patroon als in de Vocare-Excel
// (coniunctivus hergebruikt de indicativus-tekst + achtervoegsel).
function vfLatijnGlos(v, tijd, modus, genus, persoonIdx){
  if(v.irregular) return vfLatijnGlosIrr(v, tijd, modus, genus, persoonIdx);
  const i = persoonIdx, nl = v.nl, pron = VF_PRONOMEN[i];
  const zullen = ["zal","zal","zal","zullen","zullen","zullen"][i];
  // aux ("hebben"/"zijn", default "hebben") bepaalt het hulpwerkwoord voor
  // perfectum/plusquamperfectum/futurum exactum activum (venio/fugio -> "ben gekomen/gevlucht").
  const auxPres = (nl.aux==="zijn" ? ["ben","bent","is","zijn","zijn","zijn"] : ["heb","hebt","heeft","hebben","hebben","hebben"])[i];
  const auxPast = (nl.aux==="zijn" ? ["was","was","was","waren","waren","waren"] : ["had","had","had","hadden","hadden","hadden"])[i];
  const wordenPres = ["word","wordt","wordt","worden","worden","worden"][i];
  const wordenPast = ["werd","werd","werd","werden","werden","werden"][i];
  const zijnPres = ["ben","bent","is","zijn","zijn","zijn"][i];
  const zijnPast = ["was","was","was","waren","waren","waren"][i];
  let basis;
  if(genus==="activum"){
    basis = tijd==="praesens" ? `${pron} ${nl.pres[i]}`
      : tijd==="imperfectum" ? `${pron} ${nl.past[i]}`
      : tijd==="futurum" ? `${pron} ${zullen} ${nl.inf}`
      : tijd==="perfectum" ? `${pron} ${auxPres} ${nl.part}`
      : tijd==="plusquamperfectum" ? `${pron} ${auxPast} ${nl.part}`
      : `${pron} ${zullen} ${nl.aux==="zijn"?"zijn":"hebben"} ${nl.part}`; // futurumexactum
  } else {
    basis = tijd==="praesens" ? `${pron} ${wordenPres} ${nl.part}`
      : tijd==="imperfectum" ? `${pron} ${wordenPast} ${nl.part}`
      : tijd==="futurum" ? `${pron} ${zullen} worden ${nl.part}`
      : tijd==="perfectum" ? `${pron} ${zijnPres} ${nl.part}`
      : tijd==="plusquamperfectum" ? `${pron} ${zijnPast} ${nl.part}`
      : `${pron} ${zullen} zijn ${nl.part}`; // futurumexactum
  }
  return modus==="coniunctivus" ? basis+" (coniunctivus)" : basis;
}

/* ===================== Grieks ===================== */
// Met de hand ingevoerd (indicativus activum, alleen de tijden waarvoor
// betrouwbare vormen beschikbaar zijn — zie hoofdbestand-commentaar).
// λύω/λαμβάνω/λέγω zijn gecontroleerd tegen combat-questions.js's CQ_GR_VERBA;
// εἰμί/ἔχω/λαμβάνω/λέγω komen uit de door Gerben aangeleverde Excel;
// ἀγγέλλω/ποιέω zijn vers uitgeschreven standaardparadigma's (liquide stam,
// resp. contractwerkwoord op -εω) — verdienen een proefleesronde.
// nl.praesens/imperfectum/aoristus/futurum bevat de Nederlandse glans per vorm,
// zelfde lengte-array als de vorm zelf (bij syncretisme — 1sg/3pl vallen samen
// in imperfectum/aoristus — dus 5 vormen i.p.v. 6, is nl ook 5 lang). Aoristus
// hergebruikt vaak dezelfde Nederlandse tekst als imperfectum met "(aor)"
// erachter, zoals in de brontabel (ἔχω, λέγω, λαμβάνω) — Nederlands maakt geen
// onderscheid tussen beide verleden tijden, alleen het Grieks wel.
const VF_TIJDEN_EL = ["praesens","imperfectum","aoristus","futurum"];
const VF_EL_VERBS = [
  { lemma:"λύω", betekenis:"losmaken, verbreken",
    praesens:   ["λύω","λύεις","λύει","λύομεν","λύετε","λύουσι(ν)"],
    imperfectum:["ἔλυον","ἔλυες","ἔλυε(ν)","ἐλύομεν","ἐλύετε","ἔλυον"],
    aoristus:   ["ἔλυσα","ἔλυσας","ἔλυσε(ν)","ἐλύσαμεν","ἐλύσατε","ἔλυσαν"],
    futurum:    ["λύσω","λύσεις","λύσει","λύσομεν","λύσετε","λύσουσι(ν)"],
    nl:{ praesens:   ["ik maak los","jij maakt los","hij maakt los","wij maken los","jullie maken los","zij maken los"],
         imperfectum:["ik maakte los / zij maakten los","jij maakte los","hij maakte los","wij maakten los","jullie maakten los","ik maakte los / zij maakten los"],
         aoristus:   ["ik maakte los / zij maakten los (aor)","jij maakte los (aor)","hij maakte los (aor)","wij maakten los (aor)","jullie maakten los (aor)","ik maakte los / zij maakten los (aor)"],
         futurum:    ["ik zal losmaken","jij zal losmaken","hij zal losmaken","wij zullen losmaken","jullie zullen losmaken","zij zullen losmaken"] } },
  { lemma:"ἀγγέλλω", betekenis:"aankondigen, berichten",
    praesens:   ["ἀγγέλλω","ἀγγέλλεις","ἀγγέλλει","ἀγγέλλομεν","ἀγγέλλετε","ἀγγέλλουσι(ν)"],
    imperfectum:["ἤγγελλον","ἤγγελλες","ἤγγελλε(ν)","ἠγγέλλομεν","ἠγγέλλετε","ἤγγελλον"],
    aoristus:   ["ἤγγειλα","ἤγγειλας","ἤγγειλε(ν)","ἠγγείλαμεν","ἠγγείλατε","ἤγγειλαν"],
    futurum:    ["ἀγγελῶ","ἀγγελεῖς","ἀγγελεῖ","ἀγγελοῦμεν","ἀγγελεῖτε","ἀγγελοῦσι(ν)"],
    nl:{ praesens:   ["ik kondig aan","jij kondigt aan","hij kondigt aan","wij kondigen aan","jullie kondigen aan","zij kondigen aan"],
         imperfectum:["ik kondigde aan / zij kondigden aan","jij kondigde aan","hij kondigde aan","wij kondigden aan","jullie kondigden aan","ik kondigde aan / zij kondigden aan"],
         aoristus:   ["ik kondigde aan / zij kondigden aan (aor)","jij kondigde aan (aor)","hij kondigde aan (aor)","wij kondigden aan (aor)","jullie kondigden aan (aor)","ik kondigde aan / zij kondigden aan (aor)"],
         futurum:    ["ik zal aankondigen","jij zal aankondigen","hij zal aankondigen","wij zullen aankondigen","jullie zullen aankondigen","zij zullen aankondigen"] } },
  { lemma:"ποιέω", betekenis:"maken, doen",
    praesens:   ["ποιῶ","ποιεῖς","ποιεῖ","ποιοῦμεν","ποιεῖτε","ποιοῦσι(ν)"],
    imperfectum:["ἐποίουν","ἐποίεις","ἐποίει","ἐποιοῦμεν","ἐποιεῖτε","ἐποίουν"],
    aoristus:   ["ἐποίησα","ἐποίησας","ἐποίησε(ν)","ἐποιήσαμεν","ἐποιήσατε","ἐποίησαν"],
    futurum:    ["ποιήσω","ποιήσεις","ποιήσει","ποιήσομεν","ποιήσετε","ποιήσουσι(ν)"],
    nl:{ praesens:   ["ik maak / doe","jij maakt / doet","hij maakt / doet","wij maken / doen","jullie maken / doen","zij maken / doen"],
         imperfectum:["ik maakte / deed, zij maakten / deden","jij maakte / deed","hij maakte / deed","wij maakten / deden","jullie maakten / deden","ik maakte / deed, zij maakten / deden"],
         aoristus:   ["ik maakte / deed (aor)","jij maakte / deed (aor)","hij maakte / deed (aor)","wij maakten / deden (aor)","jullie maakten / deden (aor)","zij maakten / deden (aor)"],
         futurum:    ["ik zal maken / doen","jij zal maken / doen","hij zal maken / doen","wij zullen maken / doen","jullie zullen maken / doen","zij zullen maken / doen"] } },
  { lemma:"εἰμί", betekenis:"zijn",
    praesens:   ["εἰμῐ́","εἶ","ἐστῐ́(ν)","ἐσμέν","ἐστέ","εἰσῐ́(ν)"],
    imperfectum:["ἦ / ἦν","ἦσθᾰ","ἦν","ἦμεν","ἦτε","ἦσᾰν"],
    nl:{ praesens:   ["ik ben","jij bent","hij is","wij zijn","jullie zijn","zij zijn"],
         imperfectum:["ik was","jij was","hij was","wij waren","jullie waren","zij waren"] } },
  { lemma:"ἔχω", betekenis:"hebben",
    praesens:   ["ἔχω","ἔχεις","ἔχει","ἔχομεν","ἔχετε","ἔχουσῐ(ν)"],
    imperfectum:["εἶχον","εἶχες","εἶχε(ν)","εἴχομεν","εἴχετε","εἶχον"],
    aoristus:   ["ἔσχον","ἔσχες","ἔσχε(ν)","ἔσχομεν","ἔσχετε","ἔσχον"],
    nl:{ praesens:   ["ik heb","jij hebt","hij heeft","wij hebben","jullie hebben","zij hebben"],
         imperfectum:["ik had / zij hadden","jij had","hij had","wij hadden","jullie hadden","ik had / zij hadden"],
         aoristus:   ["ik had / zij hadden (aor)","jij had (aor)","hij had (aor)","wij hadden (aor)","jullie hadden (aor)","ik had / zij hadden (aor)"] } },
  { lemma:"λαμβάνω", betekenis:"nemen, pakken",
    praesens:   ["λᾰμβᾰ́νω","λᾰμβᾰ́νεις","λᾰμβᾰ́νει","λᾰμβᾰ́νομεν","λᾰμβᾰ́νετε","λᾰμβᾰ́νουσῐ(ν)"],
    imperfectum:["ἐλᾰ́μβᾰνον","ἐλᾰ́μβᾰνες","ἐλᾰ́μβᾰνε(ν)","ἐλᾰμβᾰ́νομεν","ἐλᾰμβᾰ́νετε","ἐλᾰ́μβᾰνον"],
    aoristus:   ["ἔλᾰβον","ἔλᾰβες","ἔλᾰβε(ν)","ἐλᾰ́βομεν","ἐλᾰ́βετε","ἔλᾰβον"],
    nl:{ praesens:   ["ik neem","jij neemt","hij/zij/het neemt","wij nemen","jullie nemen","zij nemen"],
         imperfectum:["ik nam / zij namen","jij nam","hij nam","wij namen","jullie namen","ik nam / zij namen"],
         aoristus:   ["ik nam / zij namen (aor)","jij nam (aor)","hij nam (aor)","wij namen (aor)","jullie namen (aor)","ik nam / zij namen (aor)"] } },
  { lemma:"λέγω", betekenis:"zeggen",
    praesens:   ["λέγω","λέγεις","λέγει","λέγομεν","λέγετε","λέγουσῐ(ν)"],
    imperfectum:["ἔλεγον","ἔλεγες","ἔλεγε(ν)","ἐλέγομεν","ἐλέγετε","ἔλεγον"],
    aoristus:   ["εἶπον","εἶπες","εἶπε(ν)","εἴπομεν","εἴπετε","εἶπον"],
    nl:{ praesens:   ["ik zeg","jij zegt","hij/zij/het zegt","wij zeggen","jullie zeggen","zij zeggen"],
         imperfectum:["ik zei / zij zeiden","jij zei","hij zei","wij zeiden","jullie zeiden","ik zei / zij zeiden"],
         aoristus:   ["ik zei / zij zeiden (aor)","jij zei (aor)","hij zei (aor)","wij zeiden (aor)","jullie zeiden (aor)","ik zei / zij zeiden (aor)"] } },
];
