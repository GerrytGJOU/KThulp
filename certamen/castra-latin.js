/* ============================================================================
   CASTRA HEROUM — LATIJNSE TEKSTEN + VERTAALHULP
   ----------------------------------------------------------------------------
   Alle speltekst is Latijn; vertaalhulp is altijd één tik weg en kost niets:
   - tik op een woord  -> betekenis (CASTRA_GLOSS)
   - tik op "ⓘ"        -> vertaling van de hele zin
   Elk gebruik wordt gelogd in CASTRA.help (per woord en per zin) voor het
   toekomstige docentoverzicht. Teksten en glossarium zijn pure data, door
   Gerben aan te passen zonder code (zie CASTRA_HEROUM.md, "Latijn in het spel").
   Latijnse teksten zijn voorlopig en ter controle door Gerben.
   Laadt NA castra-data.js, VÓÓR castra.js/castra-venatio.js.
   ============================================================================ */

/* ---- Vaste zinnen: id -> {la, nl} ---- */
const CASTRA_LA = {
  venatio_titel:   { la:"Venatio", nl:"De jacht" },
  venatio_intro:   { la:"Quo venaris, dux?", nl:"Waar ga je jagen, leider?" },
  venare:          { la:"Venare!", nl:"Ga jagen!" },
  clausum:         { la:"Clausum", nl:"Gesloten" },
  explorator:      { la:"Explorator nuntiat:", nl:"De verkenner meldt:" },
  quem_mittis:     { la:"Quem militem mittis?", nl:"Welke soldaat stuur je?" },
  nullus_miles:    { la:"Nullum militem habes. Ipse pugnas, dux!", nl:"Je hebt geen soldaat. Je vecht zelf, leider!" },
  oppugna:         { la:"Oppugna!", nl:"Val aan!" },
  defende:         { la:"Defende!", nl:"Verdedig!" },
  miles_oppugnat:  { la:"Miles tuus hostem vulnerat.", nl:"Je soldaat verwondt de vijand." },
  hostis_oppugnat: { la:"Hostis militem tuum vulnerat.", nl:"De vijand verwondt je soldaat." },
  miles_defendit:  { la:"Miles tuus se defendit.", nl:"Je soldaat verdedigt zich." },
  optime:          { la:"Optime!", nl:"Uitstekend!" },
  male:            { la:"Male!", nl:"Slecht!" },
  vicisti:         { la:"Vicisti!", nl:"Je hebt gewonnen!" },
  victus_es:       { la:"Victus es.", nl:"Je bent verslagen." },
  hostis_fugit:    { la:"Hostis fugit.", nl:"De vijand vlucht." },
  praeda:          { la:"Praedam capis.", nl:"Je neemt de buit." },
  vulneratus:      { la:"Miles tuus vulneratus est.", nl:"Je soldaat is gewond." },
  hostis_dicit:    { la:"Hostis victus dicit: Te sequar, dux.", nl:"De verslagen vijand zegt: Ik zal je volgen, leider." },
  visne_recipere:  { la:"Visne eum in castra recipere?", nl:"Wil je hem in het kamp opnemen?" },
  recipio:         { la:"Recipio.", nl:"Ik neem hem op." },
  dimitto:         { la:"Dimitto.", nl:"Ik laat hem gaan." },
  castra_plena:    { la:"Castra plena sunt.", nl:"Het kamp zit vol." },
  redi:            { la:"Redi in castra.", nl:"Keer terug naar het kamp." },
  iterum:          { la:"Iterum venare!", nl:"Ga opnieuw jagen!" },
  campus_titel:    { la:"Campus Martius", nl:"Het oefenveld" },
  exerce:          { la:"Exerce!", nl:"Train!" },
  exercetur:       { la:"Exercetur.", nl:"Hij traint." },
  collige:         { la:"Collige!", nl:"Haal op!" },
  evolve:          { la:"Promove!", nl:"Bevorder!" },
  missio_honesta:  { la:"Missio honesta", nl:"Eervol ontslag" },
  nullus_exercitus:{ la:"Nullos milites habes.", nl:"Je hebt geen soldaten." },
  elige_viam:      { la:"Quam viam eligis?", nl:"Welke weg kies je?" },
  meliora:         { la:"Meliora", nl:"Verbeter" },
  claude:          { la:"Claude", nl:"Sluit" },
  gradus:          { la:"Gradus", nl:"Niveau" },
  gradus_max:      { la:"Gradus maximus.", nl:"Hoogste niveau." },
  praetorium_prius:{ la:"Praetorium prius meliora.", nl:"Verbeter eerst het praetorium." },
  proventus:       { la:"Proventus", nl:"Opbrengst" },
  paratum:         { la:"Paratum", nl:"Klaar" },
  capacitas:       { la:"Capacitas", nl:"Opslagmaximum" },
  milites:         { la:"Milites", nl:"Soldaten" },
  conscribe:       { la:"Conscribe militem!", nl:"Werf een soldaat!" },
  legio_mox:       { la:"Legio mox aderit.", nl:"De Legio komt binnenkort." },
  porta_clausa:    { la:"Haec porta nondum aperta est.", nl:"Deze poort is nog niet open." },
  loca:            { la:"Loca", nl:"Plaatsen" },
  hodie:           { la:"Hodie", nl:"Vandaag" },
  loca_plena:      { la:"Loca exercitationis plena sunt.", nl:"Alle oefenplekken zijn bezet." },
  frumentum_deest: { la:"Frumentum deest.", nl:"Je hebt niet genoeg graan." },
  satis_exercitati:{ la:"Hodie satis exercitati sunt.", nl:"Vandaag is er genoeg getraind." },
  collectum:       { la:"Collectum!", nl:"Opgehaald!" },
  plenum:          { la:"Horreum plenum est.", nl:"Je opslag is vol." },
  melioratum:      { la:"Melioratum!", nl:"Verbeterd!" },
  exercitatio_finita:{ la:"Exercitatio finita est.", nl:"De training is klaar." },
  visne_dimittere: { la:"Visne hunc militem honeste dimittere?", nl:"Wil je deze soldaat eervol ontslaan?" },
  adiungit:        { la:"se tibi adiungit.", nl:"sluit zich bij je aan." },
  intellego:       { la:"Intellego.", nl:"Ik begrijp het." },
  intro:           { la:"Salve, dux! Haec sunt castra tua. Collige ligna et aes, meliora praetorium, et venare in Latio.", nl:"Gegroet, leider! Dit is jouw kamp. Verzamel hout en brons, verbeter het praetorium en ga jagen in Latium." },
  accipio:         { la:"Accipio.", nl:"Ik accepteer het." },
  non_nunc:        { la:"Non nunc.", nl:"Nu niet." },
  gratias:         { la:"Gratias!", nl:"Dank je!" },
  vale:            { la:"Vale!", nl:"Vaarwel!" },
  aeneas:          { la:"Aeneas", nl:"Aeneas" },
  aen_hi:          { la:"Salve, hospes! Aeneas sum. Hostes in silva vexant. Tres hostes in silva vince, et auxilium meum habebis.", nl:"Gegroet, gast! Ik ben Aeneas. Vijanden in het bos zijn lastig. Versla drie vijanden in het bos, en je krijgt mijn hulp." },
  aen_accepted:    { la:"Bene! Tres hostes in silva vince.", nl:"Goed! Versla drie vijanden in het bos." },
  aen_done:        { la:"Optime! Tres hostes vicisti. Gratias tibi ago. Tecum venio.", nl:"Uitstekend! Je hebt drie vijanden verslagen. Ik dank je. Ik kom met je mee." },
  aen_bye:         { la:"Vale, dux! Iter bonum!", nl:"Vaarwel, leider! Goede reis!" },
  aen_joined:      { la:"Aeneas se tibi adiungit.", nl:"Aeneas sluit zich bij je aan." },
  proelium_titel:  { la:"Proelium", nl:"Het gevecht" },
  proelium_ini:    { la:"In proelium!", nl:"Het gevecht in!" },
  incipe:          { la:"Incipe!", nl:"Begin!" },
  celerius:        { la:"Celerius", nl:"Sneller" },
  vita_castrorum:  { la:"Vita castrorum", nl:"Levens van het kamp" },
  ala:             { la:"Ala", nl:"Golf" },
  elige_loca:      { la:"Elige militem et loca eum.", nl:"Kies een soldaat en plaats hem." },
  castra_defensa:  { la:"Castra defendisti!", nl:"Je hebt het kamp verdedigd!" },
  castra_capta:    { la:"Castra capta sunt.", nl:"Het kamp is ingenomen." },
  praemium:        { la:"Praemium", nl:"Beloning" },
  acies_plena:     { la:"Acies plena est.", nl:"Je slagorde is vol." },
  iterum_pugna:    { la:"Iterum pugna!", nl:"Vecht opnieuw!" },
  colloquium:      { la:"Colloquium", nl:"Gesprek" },
  fides:           { la:"Fides", nl:"Vertrouwen" },
  assigna:         { la:"Assigna", nl:"Wijs toe" },
  colloquia_hodie: { la:"Colloquia hodie", nl:"Gesprekken vandaag" },
  satis_colloquia: { la:"Hodie satis locuti sumus.", nl:"Vandaag hebben we genoeg gepraat." },
  recte:           { la:"Recte!", nl:"Juist!" },
  non_recte:       { la:"Non recte.", nl:"Niet juist." },
  non_convenit:    { la:"Hoc non convenit.", nl:"Dat past niet." },
  heroes_nulli:    { la:"Nullos heroes habes.", nl:"Je hebt nog geen helden." },
  vestigia_quaere: { la:"Quaere eum in Latio.", nl:"Zoek hem in Latium." },
  heroum_novum:    { la:"Heros in heroum venit.", nl:"De held komt naar je heroum." },
  venare_in:       { la:"Venare in", nl:"Jagen in" },
  perge:           { la:"Perge!", nl:"Ga verder!" },
  vestigia:        { la:"Vestigia viri magni vides.", nl:"Je ziet sporen van een groot man." },
};

/* ---- Typen in het Latijn: meervoud (verkenningsbericht) en enkelvoud (je eigen soldaat) ---- */
const CASTRA_TYPE_LA = {
  inf:  { pl:"pedites",   sg:"pedes",       nl_pl:"voetsoldaten",  nl_sg:"voetsoldaat" },
  cav:  { pl:"equites",   sg:"eques",       nl_pl:"ruiters",       nl_sg:"ruiter" },
  rng:  { pl:"sagittarii",sg:"sagittarius", nl_pl:"boogschutters", nl_sg:"boogschutter" },
  sup:  { pl:"auxilia",   sg:"auxiliarius", nl_pl:"hulptroepen",   nl_sg:"hulptroep" },
  myth: { pl:"monstra",   sg:"monstrum",    nl_pl:"monsters",      nl_sg:"monster" },
};

/* ---- Karakters: Latijns bijvoeglijk naamwoord + vertaling ---- */
const CASTRA_INGENIUM_NL = {
  ferox:"fel", cautus:"voorzichtig", celer:"snel", robustus:"sterk gebouwd", acer:"scherp",
  longus:"lang", firmus:"standvastig", agilis:"wendbaar", fortis:"dapper", sagax:"scherpzinnig",
};

/* ---- Terreinen per regio (zeldzaamheid: sommige lijnen alleen op bepaald terrein) ---- */
const CASTRA_VENATIO = {
  latium: {
    nm:"Latium", min:1, max:3,
    terrains:[
      { id:"silva",  la:"In silva",  nl:"In het bos",
        lines:[ {id:"legioen",w:3},{id:"licht",w:3},{id:"rangen",w:1},{id:"saters",w:1} ] },
      { id:"campus", la:"In campo",  nl:"Op het veld",
        lines:[ {id:"legioen",w:3},{id:"ruiterij",w:3},{id:"rangen",w:2},{id:"licht",w:1} ] },
      { id:"via",    la:"In via",    nl:"Op de weg",
        lines:[ {id:"rangen",w:2},{id:"ruiterij",w:2},{id:"legioen",w:2},{id:"licht",w:2} ] },
      { id:"tiberis",la:"Ad Tiberim",nl:"Bij de Tiber",
        lines:[ {id:"vloot",w:3},{id:"legioen",w:2},{id:"licht",w:2},{id:"nimfen",w:1} ] },
    ],
    // Kans op een spoor naar een held na een gewonnen jacht (missieketen volgt in fase 3).
    traces:[ "aeneas","romulus","horatius","cloelia","mucius","camilla" ],
    traceChance:0.15,
  },
  graecia: {
    nm:"Graecia", min:3, max:6,
    terrains:[
      { id:"mons",  la:"In monte", nl:"Op de berg",
        lines:[ {id:"phalanx",w:3},{id:"psili",w:3},{id:"gryps",w:1},{id:"saters",w:1} ] },
      { id:"olea",  la:"In oleis", nl:"In de olijfgaarden",
        lines:[ {id:"kreta",w:2},{id:"psili",w:2},{id:"nimfen",w:1},{id:"phalanx",w:2} ] },
      { id:"litus", la:"Ad litus", nl:"Aan de kust",
        lines:[ {id:"vloot",w:3},{id:"phalanx",w:2},{id:"harpijen",w:1} ] },
      { id:"urbs",  la:"In urbe", nl:"In de stad",
        lines:[ {id:"phalanx",w:3},{id:"macedonie",w:2},{id:"kreta",w:1} ] },
    ],
    traces:[ "hercules","perseus","theseus","atalanta","iason" ], traceChance:0.15,
  },
  troia: {
    nm:"Troia", min:6, max:9,
    terrains:[
      { id:"muros",     la:"Ante muros", nl:"Voor de muren",
        lines:[ {id:"phalanx",w:3},{id:"psili",w:2},{id:"macedonie",w:2},{id:"rangen",w:1} ] },
      { id:"campus",    la:"In campo", nl:"Op het veld",
        lines:[ {id:"macedonie",w:3},{id:"kreta",w:2},{id:"phalanx",w:2},{id:"ruiterij",w:1} ] },
      { id:"litus",     la:"Ad litus", nl:"Aan de kust",
        lines:[ {id:"vloot",w:3},{id:"harpijen",w:1},{id:"phalanx",w:2},{id:"kreta",w:1} ] },
      { id:"scamander", la:"Ad Scamandrum", nl:"Bij de Scamander",
        lines:[ {id:"nimfen",w:2},{id:"psili",w:2},{id:"vloot",w:1},{id:"gryps",w:1} ] },
    ],
    traces:[ "achilles","hector","ulixes","penthesilea" ], traceChance:0.15,
  },
};

/* ---- Glossarium: woord (kleine letters, zonder leestekens) -> betekenis ---- */
const CASTRA_GLOSS = {
  "venatio":"jacht", "quo":"waarheen / waar", "venaris":"jaagt (je)", "venare":"jaag! / ga jagen!",
  "dux":"leider", "latium":"Latium (streek rond Rome)", "clausum":"gesloten",
  "explorator":"verkenner", "nuntiat":"meldt", "in":"in / op / naar", "silva":"bos", "campo":"veld",
  "via":"weg", "ad":"bij / naar", "tiberim":"de Tiber (4e naamval)",
  "pedites":"voetsoldaten", "pedes":"voetsoldaat", "equites":"ruiters", "eques":"ruiter",
  "sagittarii":"boogschutters", "sagittarius":"boogschutter", "auxilia":"hulptroepen",
  "auxiliarius":"hulptroep", "monstra":"monsters", "monstrum":"monster",
  "adsunt":"zijn er / zijn aanwezig", "hostis":"vijand", "est":"is", "sunt":"zijn", "es":"je bent",
  "ferox":"fel", "cautus":"voorzichtig", "celer":"snel", "robustus":"sterk gebouwd", "acer":"scherp",
  "longus":"lang", "firmus":"standvastig", "agilis":"wendbaar", "fortis":"dapper", "sagax":"scherpzinnig",
  "quem":"wie / welke (4e naamval)", "militem":"soldaat (4e naamval)", "mittis":"je stuurt",
  "nullum":"geen", "habes":"je hebt", "ipse":"zelf", "pugnas":"je vecht",
  "oppugna":"val aan!", "defende":"verdedig!", "oppugnat":"valt aan",
  "miles":"soldaat", "tuus":"jouw", "tuum":"jouw (4e naamval)", "hostem":"vijand (4e naamval)",
  "vulnerat":"verwondt", "vulneratus":"gewond", "se":"zich", "defendit":"verdedigt",
  "optime":"uitstekend", "male":"slecht", "vicisti":"je hebt gewonnen", "victus":"verslagen",
  "fugit":"vlucht", "praedam":"buit (4e naamval)", "capis":"je neemt / pakt",
  "dicit":"zegt", "te":"jou", "sequar":"ik zal volgen", "visne":"wil je?", "eum":"hem",
  "castra":"kamp", "recipere":"opnemen", "recipio":"ik neem op", "dimitto":"ik laat gaan",
  "plena":"vol", "redi":"keer terug!", "iterum":"opnieuw", "vestigia":"sporen",
  "viri":"van een man",
  "achille":"Achilles (met Achilles)", "achilles":"Achilles (Griekse held)", "achillis":"van Achilles", "aedificamus":"wij bouwen", "aedificat":"bouwt", "aedificavisti":"je hebt gebouwd", "aerem":"lucht (4e naamval)", "agamemnon":"Agamemnon (Griekse koning)", "alata":"gevleugelde", "album":"wit (4e naamval)", "altum":"hoog (4e naamval)", "altus":"hoog", "amas":"je houdt van", "amat":"houdt van", "amazones":"Amazones (vrouwelijke krijgers)", "amazonum":"van de Amazones", "ambulo":"ik loop", "amicis":"aan vrienden", "amicum":"vriend (4e naamval)", "amicus":"vriend", "andromacha":"Andromache (vrouw van Hector)", "andromedam":"Andromeda (4e naamval)", "ante":"voor", "aprum":"everzwijn (4e naamval)", "apud":"bij", "aqua":"water", "aquam":"water (4e naamval)", "aquilam":"adelaar (4e naamval)", "arcum":"boog (4e naamval)", "ardeam":"Ardea (4e naamval)", "argo":"Argo (het schip van Jason)", "ariadna":"Ariadne", "atalanta":"Atalanta (snelle jageres)", "atalantam":"Atalanta (4e naamval)", "athena":"Athena (godin)", "audax":"dapper / vermetel", "audio":"ik hoor", "aurea":"gouden", "aurei":"van goud", "aureum":"gouden (4e naamval)", "caelo":"hemel (in de lucht)", "callidus":"sluw", "calydonium":"Calydonisch", "calypso":"Calypso (nimf)", "camilla":"Camilla (jageres)", "camillam":"Camilla (4e naamval)", "campum":"veld (4e naamval)", "capio":"ik pak / neem", "capit":"pakt / neemt", "capite":"hoofd (op het hoofd)", "caput":"hoofd", "casa":"huisje", "cassandra":"Cassandra", "castris":"kamp (uit het kamp)", "causa":"vanwege", "celeriter":"snel", "celerrima":"de snelste", "centum":"honderd", "circe":"Circe (tovenares)", "cloelia":"Cloelia (Romeinse vrouw)", "cloeliam":"Cloelia (4e naamval)", "colchide":"Colchis (in Colchis)", "confecisti":"je hebt volbracht", "consilium":"plan", "cum":"met", "curris":"je rent", "curro":"ik ren", "cursu":"het hardlopen", "dat":"geeft", "dextram":"rechterhand (4e naamval)", "dimittit":"laat gaan", "dolorem":"pijn (4e naamval)", "domi":"thuis", "dormio":"ik slaap", "dormire":"slapen", "draconem":"draak (4e naamval)", "duodecim":"twaalf", "duos":"twee (4e naamval)", "ego":"ik", "eius":"zijn / haar", "eo":"ik ga", "equis":"paarden (met de paarden)", "equo":"paard (te paard / in het paard)", "equus":"paard", "eram":"ik was", "erat":"was", "exeo":"ik ga uit", "exspectat":"wacht op", "facimus":"wij doen", "facit":"doet", "familiam":"familie (4e naamval)", "feminae":"vrouwen", "filum":"draad", "flores":"bloemen", "fortes":"dappere", "fortiter":"dapper", "fratres":"broers", "fugi":"ik ben gevlucht", "fui":"ik ben geweest", "gladium":"zwaard (4e naamval)", "gorgones":"Gorgonen", "graecorum":"van de Grieken", "habesne":"heb je?", "habet":"heeft", "habito":"ik woon", "hector":"Hector (Trojaanse held)", "hectoris":"van Hector", "helena":"Helena", "helenam":"Helena (4e naamval)", "hera":"Hera (godin)", "hercules":"Hercules (Griekse held)", "hostibus":"vijanden (voor de vijanden)", "hostium":"van de vijanden", "hydra":"Hydra (monster met vele koppen)", "hydram":"Hydra (4e naamval)", "iason":"Jason", "iasonem":"Jason (4e naamval)", "igne":"vuur (in het vuur)", "ignem":"vuur (4e naamval)", "infirmum":"zwak (4e naamval)", "infirmus":"zwak", "intramus":"wij gaan binnen", "ira":"woede", "it":"gaat", "ita":"ja / zo", "iuvamus":"wij helpen", "iuvas":"je helpt", "iuvat":"helpt", "iuvisti":"je hebt geholpen", "iuvo":"ik help", "labor":"opdracht / zware taak", "laboras":"je werkt", "laborem":"opdracht (4e naamval)", "labores":"opdrachten", "laboro":"ik werk", "labyrintho":"labyrint (in het labyrint)", "labyrinthum":"labyrint (4e naamval)", "labyrinthus":"labyrint", "latent":"verbergen zich", "laudant":"prijzen", "laudat":"prijst", "lente":"langzaam", "leonem":"leeuw (4e naamval)", "leones":"leeuwen", "libenter":"graag", "liberavisti":"je hebt bevrijd", "libros":"boeken (4e naamval)", "librum":"boek (4e naamval)", "ligneum":"houten (4e naamval)", "ligneus":"houten", "litus":"kust", "lunam":"maan (4e naamval)", "lyram":"lier (4e naamval)", "magnam":"grote (4e naamval)", "mala":"appels", "mane":"'s ochtends", "maneo":"ik blijf", "manus":"hand", "mater":"moeder", "matrem":"moeder (4e naamval)", "mecum":"met mij", "medea":"Medea (tovenares)", "medusa":"Medusa", "medusae":"van Medusa", "medusam":"Medusa (4e naamval)", "minotaurum":"Minotaurus (4e naamval)", "minotaurus":"Minotaurus (stiermens)", "mittit":"schiet / stuurt", "mitto":"ik schiet / stuur", "monte":"berg (op de berg)", "mucium":"Mucius (4e naamval)", "mucius":"Mucius (Romeinse held)", "multos":"veel (4e naamval)", "muri":"muren", "murum":"muur (4e naamval)", "nam":"want", "nautas":"zeelieden (4e naamval)", "navem":"schip (4e naamval)", "naves":"schepen", "necare":"doden", "nemeaeum":"Nemeïsche", "nix":"sneeuw", "nocte":"'s nachts", "nomen":"naam", "num":"soms? / toch niet?", "numquam":"nooit", "obses":"gijzelaar", "oculos":"ogen (4e naamval)", "oculum":"oog (4e naamval)", "odi":"ik haat", "olea":"olijfboom", "oleis":"olijfbomen (in de olijfgaarden)", "omnia":"alles", "oppugnamus":"wij vallen aan", "otium":"rust", "palude":"moeras (in het moeras)", "paride":"Paris (met Paris)", "parvi":"kleine", "patria":"vaderland", "patroclus":"Patroclus (vriend van Achilles)", "pecunia":"geld", "pedem":"voet (4e naamval)", "pellis":"huid", "penelope":"Penelope (vrouw van Odysseus)", "penthesilea":"Penthesilea (koningin van de Amazones)", "penthesileam":"Penthesilea (4e naamval)", "per":"door", "perseus":"Perseus (Griekse held)", "pigri":"luie", "polyphemus":"Polyphemus (cycloop)", "ponit":"legt", "pono":"ik leg", "portare":"dragen", "possum":"ik kan", "priamus":"Priamus (koning van Troje)", "primus":"eerste", "prope":"vlakbij", "pueri":"jongens", "pugnant":"vechten", "pugnat":"vecht", "pugno":"ik vecht", "purgavisti":"je hebt schoongemaakt", "quae":"welke / wie", "quaerimus":"wij zoeken", "quando":"wanneer", "redire":"terugkeren", "regem":"koning (4e naamval)", "rex":"koning", "romani":"Romeinen", "sagittas":"pijlen (4e naamval)", "sagittis":"pijlen (met pijlen)", "scaevola":"Scaevola (linkshandige)", "scamandrum":"Scamander (rivier bij Troje, 4e naamval)", "sed":"maar", "sequor":"ik volg", "serpentes":"slangen", "servat":"beschermt", "silvas":"bossen (4e naamval)", "statua":"standbeeld", "talaria":"gevleugelde sandalen", "talus":"hiel", "tardant":"houden op", "tardat":"houdt op", "tegit":"bedekt", "teneo":"ik houd vast", "tertium":"derde (4e naamval)", "theseus":"Theseus (Atheense held)", "thetis":"Thetis (zeegodin)", "timeo":"ik ben bang", "transeo":"ik steek over", "troiae":"van Troje", "troiam":"Troje (4e naamval)", "troiani":"Trojanen", "ulixem":"Odysseus (4e naamval)", "ulixes":"Odysseus (Ulixes)", "unum":"één (4e naamval)", "uxor":"echtgenote", "velleris":"van het vlies", "vellus":"vlies", "venis":"je komt", "venor":"ik jaag", "venus":"Venus (godin)", "vespere":"'s avonds", "vincit":"verslaat", "vinco":"ik versla", "vincor":"ik word verslagen", "viros":"mannen (4e naamval)", "volo":"ik wil", 
  "aedifico":"ik bouw", "aegyptum":"Egypte (4e naamval)", "amici":"vrienden", "amicos":"vrienden (4e naamval)", "amo":"ik hou van", "assigna":"wijs toe!", "athenae":"Athene", "aurum":"goud", "auxilio":"tot hulp", "campus":"veld / oefenveld", "cecidit":"is gevallen", "cibum":"eten (4e naamval)", "colle":"heuvel (6e naamval: op de heuvel)", "colloquia":"gesprekken", "colloquium":"gesprek", "condit":"sticht", "condo":"ik sticht", "cur":"waarom", "dea":"godin", "defendis":"je verdedigt", "defendo":"ik verdedig", "dei":"goden", "delent":"vernietigen", "domum":"huis (4e naamval)", "duco":"ik leid", "equum":"paard (4e naamval)", "eris":"je zult zijn", "erit":"zal zijn", "etiam":"ook / zelfs", "exercitati":"getraind", "facio":"ik doe", "facis":"je doet", "fides":"vertrouwen", "filium":"zoon (4e naamval)", "fratrem":"broer (4e naamval)", "frumentum":"graan", "fugio":"ik vlucht", "graeciam":"Griekenland (4e naamval)", "habeo":"ik heb", "habitant":"wonen", "heroes":"helden", "heroum":"zaal van de helden", "hic":"hier / deze", "hoc":"dit", "horatius":"Horatius (held die de brug verdedigde)", "italiam":"Italië (4e naamval)", "iuvant":"helpen", "latinam":"Latijnse (4e naamval)", "locuti":"gesproken", "lupa":"wolvin", "magna":"groot", "mari":"zee (in de zee)", "me":"mij", "mea":"mijn", "meam":"mijn (4e naamval)", "meus":"mijn", "mihi":"aan mij", "montem":"berg (4e naamval)", "muros":"muren (4e naamval)", "murus":"muur", "nato":"ik zwem", "navigat":"zeilt", "navigo":"ik zeil", "navis":"schip", "nemo":"niemand", "nihil":"niets", "nolo":"ik wil niet", "nostros":"onze (4e naamval)", "novam":"nieuwe (4e naamval)", "nutrivit":"heeft gevoed", "omnes":"allen", "palatino":"Palatijn (van de Palatijn)", "pater":"vader", "patrem":"vader (4e naamval)", "patriam":"vaderland (4e naamval)", "pecuniam":"geld (4e naamval)", "pons":"brug", "pontem":"brug (4e naamval)", "portat":"draagt", "porto":"ik draag", "primum":"eerste (4e naamval)", "pro":"voor", "pugna":"vecht!", "pugnare":"vechten", "quaere":"zoek!", "quaerit":"zoekt", "quaero":"ik zoek", "quattuor":"vier", "quia":"omdat", "quid":"wat", "quis":"wie", "quomodo":"hoe", "quoque":"ook", "recte":"juist", "regina":"koningin", "relinquo":"ik verlaat", "remum":"Remus (4e naamval)", "ripam":"oever (4e naamval)", "roma":"Rome", "romulum":"Romulus (4e naamval)", "romulus":"Romulus (stichter van Rome)", "salio":"ik spring", "salit":"springt", "secundum":"tweede (4e naamval)", "senex":"oud / grijsaard", "servavisti":"je hebt gered", "servo":"ik bescherm", "silvam":"bos (4e naamval)", "solus":"alleen", "sublicius":"Sublicische (houten brug)", "sumus":"wij zijn", "tiberi":"de Tiber (in de Tiber)", "troia":"Troje", "tu":"jij", "ubi":"waar", "umeris":"schouders (op de schouders)", "urbe":"stad (6e naamval)", "urbem":"stad (4e naamval)", "urbs":"stad", "veniam":"ik zal komen (zou komen)", "venit":"komt", "vocatur":"wordt genoemd",  "proelium":"gevecht", "incipe":"begin!", "celerius":"sneller", "vita":"leven", "castrorum":"van het kamp", "ala":"golf (vleugel van een leger)",
  "veniunt":"komen", "prima":"eerste", "secunda":"tweede", "tertia":"derde", "quarta":"vierde", "elige":"kies!", "defendisti":"je hebt verdedigd", "capta":"ingenomen", "praemium":"beloning",
  "acies":"slagorde", "defensio":"verdediging", "latina":"Latijnse", "oppugnatio":"aanval", "ardeae":"van Ardea", "ex":"uit", "accipio":"ik accepteer", "non":"niet", "nunc":"nu", "gratias":"dank", "vale":"vaarwel", "aeneas":"Aeneas (Trojaanse held)",
  "hospes":"gast / vreemdeling", "sum":"ik ben", "hostes":"vijanden", "vexant":"vallen lastig", "tres":"drie", "vince":"versla!", "auxilium":"hulp", "meum":"mijn", "habebis":"je zult hebben",
  "bene":"goed", "vicisti":"je hebt verslagen", "tibi":"aan jou", "ago":"ik doe / ik breng", "tecum":"met jou", "venio":"ik kom", "iter":"reis", "bonum":"goed", "quot":"hoeveel", "heros":"held", "novus":"nieuw",
  "adiungit":"voegt zich bij", "meliora":"verbeter!", "claude":"sluit!", "gradus":"niveau", "maximus":"hoogste", "prius":"eerst",
  "proventus":"opbrengst", "hora":"uur", "paratum":"klaar", "capacitas":"opslagmaximum", "conscribe":"werf!", "mox":"binnenkort", "aderit":"zal er zijn",
  "porta":"poort", "haec":"deze / dit", "nondum":"nog niet", "aperta":"open", "loca":"plaatsen", "exercitationis":"van de training", "plena":"vol",
  "hodie":"vandaag", "deest":"ontbreekt", "satis":"genoeg", "collectum":"opgehaald", "horreum":"opslagplaats voor graan", "plenum":"vol",
  "melioratum":"verbeterd", "finita":"afgelopen", "exercitatio":"training", "visne":"wil je?", "hunc":"deze (4e naamval)", "honeste":"eervol",
  "dimittere":"ontslaan", "adiungit":"voegt zich bij", "intellego":"ik begrijp het", "salve":"gegroet!", "tua":"jouw", "et":"en", "latio":"Latium (in Latium)",
  "ibi":"daar", "habitat":"woont", "dormiunt":"slapen", "caeduntur":"worden gehakt", "exercentur":"worden getraind", "effoditur":"wordt gedolven",
  "servatur":"wordt bewaard", "legio":"legioen", "convenit":"komt samen", "ligna":"hout (meervoud)", "aes":"brons", "praetorium":"hoofdkwartier van de leider", "perge":"ga verder!", "herba":"gras", "alta":"hoog", "martius":"van Mars", "exerce":"train!", "exercetur":"wordt getraind", "collige":"haal op!", "promove":"bevorder!", "missio":"ontslag", "honesta":"eervol", "quam":"welke", "viam":"weg (4e naamval)", "eligis":"je kiest", "nullos":"geen (4e naamval)", "milites":"soldaten", "magni":"groot", "vides":"je ziet",
};

/* ---- Weergave ---- */
function castraNorm(w){ return w.toLowerCase().replace(/[^a-zāēīōū]/g,"").replace(/[āēīōū]/g,c=>({ā:"a",ē:"e",ī:"i",ō:"o",ū:"u"}[c])); }

// HTML van een Latijnse zin: elk woord tikbaar, plus ⓘ voor de hele vertaling.
// la/nl mogen vrij samengesteld zijn (dynamische zinnen); sid = log-sleutel.
function castraLaHTML(la, nl, sid){
  const words = la.split(/(\s+)/).map(p=>{
    if(!p.trim()) return p;
    return `<span class="cl-w" data-w="${esc(castraNorm(p))}" onclick="castraTapWord(event,this)" style="cursor:pointer;border-bottom:1px dotted #b8975a">${esc(p)}</span>`;
  }).join("");
  const id = "cl"+Math.random().toString(36).slice(2,8);
  return `<span class="cl-s">${words} <button class="cl-i" data-la="${esc(la)}" onclick="castraTapSentence('${id}','${esc(sid||la).replace(/'/g,"")}',this)" title="Vertaling" style="background:none;border:1px solid #8a6d2f;color:#d4af37;border-radius:50%;width:20px;height:20px;font-size:12px;line-height:1;padding:0;cursor:pointer">ⓘ</button><span id="${id}" class="cl-nl" style="display:none;font-size:13px;opacity:.85;font-style:italic"><br>${esc(nl)}</span></span>`;
}
function castraLa(id){ const t = CASTRA_LA[id]; return t ? castraLaHTML(t.la, t.nl, id) : esc(id); }
function castraLaText(id){ return CASTRA_LA[id] ? CASTRA_LA[id].la : id; }

function castraLogHelp(kind, key, text){
  if(typeof CASTRA==="undefined" || !CASTRA) return;
  const h = CASTRA.help || (CASTRA.help = { words:{}, sentences:{} });
  const m = h[kind] || (h[kind] = {});
  m[key] = (m[key]||0)+1;
  if(typeof castraSave==="function") castraSave();
  castraHelpSync(kind, key, text);
}
// Geaggregeerd per klas/maand, nooit per leerling: classAnalyticsCastra/{klas}/{YYYY-MM}/{w_woord|s_zin}
// = { p: tekst, k: "w"|"s", c: aantal }. Zelfde patroon als classAnalyticsChronica; alleen voor
// ingelogde leerlingen (BM_IDENT). Docentweergave: tpRenderCastraAnalytics() in games.js.
function castraHelpSync(kind, key, text){
  try{
    if(typeof fbDB==="undefined" || !fbDB || typeof BM_IDENT==="undefined" || !BM_IDENT || !BM_IDENT.klascode) return;
    const month = new Date().toISOString().slice(0,7);
    const k = (kind==="words" ? "w_" : "s_") + String(key).toLowerCase().replace(/[^a-z0-9]+/g,"_").slice(0,60);
    const path = "classAnalyticsCastra/"+BM_IDENT.klascode+"/"+month+"/"+k+"/";
    const upd = {};
    upd[path+"p"] = String(text||key).slice(0,80);
    upd[path+"k"] = kind==="words" ? "w" : "s";
    upd[path+"c"] = firebase.database.ServerValue.increment(1);
    fbDB.ref().update(upd).catch(()=>{});
  }catch(e){}
}
function castraTapWord(ev, node){
  ev.stopPropagation();
  const w = node.getAttribute("data-w");
  const meaning = CASTRA_GLOSS[w] || "(geen vertaling beschikbaar)";
  castraLogHelp("words", w, node.textContent);
  let box = document.getElementById("castraGloss");
  if(!box){
    box = document.createElement("div"); box.id = "castraGloss";
    box.style.cssText = "position:fixed;left:50%;bottom:18px;transform:translateX(-50%);z-index:9998;background:#1b150e;color:#f1e6c4;border:1px solid #d4af37;border-radius:10px;padding:8px 14px;font-size:15px;box-shadow:0 4px 14px rgba(0,0,0,.5);max-width:90vw";
    document.body.appendChild(box);
  }
  box.innerHTML = `<b>${esc(node.textContent)}</b> = ${esc(meaning)}`;
  box.style.display = "block";
  clearTimeout(box._t); box._t = setTimeout(()=>{ box.style.display="none"; }, 3500);
}
function castraTapSentence(id, sid, btn){
  const n = document.getElementById(id); if(!n) return;
  const show = n.style.display==="none";
  n.style.display = show ? "inline" : "none";
  if(show) castraLogHelp("sentences", sid, btn && btn.getAttribute("data-la"));
}
