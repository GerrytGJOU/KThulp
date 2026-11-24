/* Kaarten van de vaste settings (dnd/): per setting de kaartbestanden, de plaatsen (pins) en de regiopunten, in de vorm van map-lib.js.
   Coördinaten zijn pixels van het kaartbestand (zie maps[id].w/h) en zijn met tools/map-check.js met het oog gecontroleerd; wijzig ze nooit op gevoel.
   Dit bestand hangt de gegevens aan de al geregistreerde settings (laden ná settings-*.js). Eén bestand voor browser en Node. Geen geheimen. */
(function (root) {
  "use strict";
  const D = typeof module === "object" && module.exports ? require("./settings-data.js") : root.DNDSettings;
  /* id, naam, kaart, x, y, aliassen (kleine letters, deelstring-match; langste wint), extra: { region, zoom, also: { kaart: [x, y] } } */
  const P = (id, name, map, x, y, alias, extra) => Object.assign({ id: id, name: name, map: map, x: x, y: y, alias: alias || [] }, extra || {});
  const R = (name, map, x, y, primary) => Object.assign({ name: name, map: map, x: x, y: y }, primary ? { primary: primary } : {});
  const attach = (id, map) => { const s = D.SETTINGS[id]; if (s) s.map = map; };

  /* ===== Oikoumenè (Mors Vincta): wereld > streken > stad ===== */
  attach("grieks-mythisch", {
    enabled: true, start: "oikoumene",
    maps: {
      oikoumene: { name: "De Oikoumenè", file: "assets/oikoumene.jpg", w: 1536, h: 1024 },
      aigaios: { name: "Mare Aigaion", file: "assets/aigaios.jpg", w: 1536, h: 1024, parent: "oikoumene" },
      achaia: { name: "Achaia", file: "assets/achaia.jpg", w: 1535, h: 1024, parent: "oikoumene" },
      korinthia: { name: "Korinthia", file: "assets/korinthia.jpg", w: 1535, h: 1024, parent: "achaia" },
      melitta: { name: "Melitta", file: "assets/melitta.jpg", w: 1122, h: 1402, parent: "korinthia" }
    },
    places: [
      /* wereldkaart */
      P("thule", "Thule", "oikoumene", 292, 112, ["thule", "rhipaeïsche", "rhipaeische", "noordmannen"], { region: "REG-THULE" }),
      P("alba_longa", "Alba Longa (Latium)", "oikoumene", 258, 425, ["alba longa", "latium", "hesperia"], { region: "REG-HESPERIA" }),
      P("ithaka", "Ithaka", "oikoumene", 745, 466, ["ithaka", "kerkyra"], { region: "REG-IONISCHEEILANDEN" }),
      P("delphoi", "Delphoi", "oikoumene", 850, 420, ["delphoi", "parnassos", "pythia"], { region: "REG-PHOKIS", also: { achaia: [760, 150] } }),
      P("achaia", "Achaia (kaart)", "oikoumene", 850, 505, ["achaia", "peloponnesos"], { zoom: "achaia" }),
      P("aigaios", "De Aigaiische eilanden (kaart)", "oikoumene", 1130, 500, ["aigaiische", "aigaios", "kykladen", "aegean"], { zoom: "aigaios", region: "REG-AIGAIOS" }),
      P("lemnos", "Lemnos", "oikoumene", 1075, 382, ["lemnos", "kabeiroi"], { region: "REG-LEMNOS", also: { aigaios: [880, 250] } }),
      P("ilion", "Ilion (Troas)", "oikoumene", 1200, 392, ["ilion", "troas", "troje"], { region: "REG-TROAS", also: { aigaios: [1290, 290] } }),
      P("kreta", "Kreta", "oikoumene", 1030, 592, ["kreta", "labyrint"], { region: "REG-KRETA" }),
      P("feniciers", "Fenicische havensteden", "oikoumene", 1295, 545, ["fenicisch", "fenicië", "phoenician", "de oosten", "gemeenschap van het woord"], { region: "REG-OOSTEN" }),
      P("kemet", "Kemet (de piramiden)", "oikoumene", 1230, 782, ["kemet", "piramide", "weegzaal"], { region: "REG-KEMET" }),
      P("kaukasos", "De Kaukasos", "oikoumene", 1345, 205, ["kaukasos", "kaukasus"], { region: "REG-KAUKASOS" }),
      /* Achaia (met doorverwijzingen naar Korinthia) */
      P("thebai", "Thebai", "achaia", 1030, 182, ["thebai", "kadmos", "kithairon"], { region: "REG-BOIOTIA" }),
      P("athenai", "Athenai", "achaia", 1325, 418, ["athenai", "akropolis van athenai", "areopagos", "kerameikos", "attika"], { region: "REG-ATTIKA" }),
      P("eleusis", "Eleusis", "achaia", 1180, 372, ["eleusis", "telesterion", "mysteriën", "mysterien"]),
      P("megara", "Megara", "achaia", 985, 402, ["megara"], { also: { korinthia: [1425, 205] } }),
      P("peiraieus", "Peiraieus", "achaia", 1210, 460, ["peiraieus", "kantharos", "zea"]),
      P("laurion", "Laurion", "achaia", 1385, 520, ["laurion", "zilvermijnen"]),
      P("aigina", "Aigina", "achaia", 1215, 590, ["aigina", "salamis"], { also: { aigaios: [545, 548] } }),
      P("sparta", "Sparta", "achaia", 555, 780, ["sparta", "menelaos", "lakonia"], { region: "REG-LAKONIA" }),
      P("tainaron", "Tainaron (ingang van de Onderwereld)", "achaia", 640, 895, ["tainaron", "onderwereld", "hades' rijk", "styx"], { region: "REG-ONDERWERELD" }),
      P("arkadia", "Arkadia", "achaia", 400, 650, ["arkadia", "pan "], { region: "REG-ARKADIA" }),
      P("phokis_parnassos", "De Parnassos", "achaia", 775, 70, ["parnassos"]),
      /* Korinthia (hoofdkaart van de streek) */
      P("ephyra", "Ephyra (Korinthe)", "korinthia", 755, 380, ["ephyra", "korinthe", "thersandros", "isthmos"], { region: "REG-KORINTHIA", zoom: "korinthia", also: { achaia: [745, 395] } }),
      P("akrokorinthos", "Akrokorinthos", "korinthia", 760, 460, ["akrokorinthos", "peirene", "hierodouloi", "aphrodite-tempel"], { also: { achaia: [725, 440] } }),
      P("lechaion", "Lechaion", "korinthia", 830, 275, ["lechaion"], { also: { achaia: [792, 358] } }),
      P("kenchreai", "Kenchreai", "korinthia", 1250, 490, ["kenchreai", "sleeppad", "diolkos"], { region: "REG-SARONISCHEGOLF", also: { achaia: [885, 487] } }),
      P("sikyon", "Sikyon", "korinthia", 440, 345, ["sikyon", "pankration"], { also: { achaia: [695, 368] } }),
      P("melitta", "Melitta", "korinthia", 170, 318, ["melitta", "lykos"], { zoom: "melitta", also: { achaia: [598, 375] } }),
      P("mykenai", "Mykenai", "korinthia", 540, 760, ["mykenai", "agamemnon", "cyclopische"], { also: { achaia: [645, 592] } }),
      P("argos", "Argos", "korinthia", 560, 935, ["argos", "kleonai", "oneia"], { region: "REG-ARGOLIS", also: { achaia: [648, 678] } }),
      /* Aigaiische kaart */
      P("delos", "Delos", "aigaios", 850, 495, ["delos"]),
      P("naxos", "Naxos", "aigaios", 960, 640, ["naxos"]),
      P("knossos", "Knossos", "aigaios", 850, 830, ["knossos", "labyrint van minos"]),
      /* Melitta (stadskaart) */
      P("melitta_akropolis", "De burcht van Lykos", "melitta", 610, 235, ["akropolis van lykos", "burcht van lykos", "melitta, de burcht", "melitta, de akropolis"]),
      P("melitta_agora", "De agora van Melitta", "melitta", 545, 665, ["melitta, de agora", "agora van melitta", "melitta agora", "agora, melitta"]),
      P("melitta_hieron_hermes", "Het Hieron van Hermes (Melitta)", "melitta", 775, 610, ["hieron van hermes", "melitta, het hieron", "tempel van hermes in melitta"]),
      P("melitta_stadion", "Het Stadion van Melitta", "melitta", 1000, 450, ["melitta, het stadion", "stadion van melitta", "westpoort van melitta"]),
      P("melitta_nekropolis", "De Nekropolis van Melitta", "melitta", 150, 420, ["nekropolis van melitta", "melitta, de nekropolis"]),
      P("melitta_oostpoort", "De Oostpoort van Melitta", "melitta", 180, 690, ["oostpoort van melitta", "melitta, de oostpoort", "melitta, oostpoort"]),
      P("melitta_westpoort", "De Westpoort van Melitta", "melitta", 905, 780, ["westpoort van melitta", "melitta, de westpoort", "melitta, westpoort"]),
      P("melitta_limen", "De haven (Limen) van Melitta", "melitta", 500, 1045, ["limen", "melitta, de haven", "haven van melitta", "twee dolfijnen"])
    ],
    regions: {
      "REG-KORINTHIA": R("Korinthia", "korinthia", 755, 380, "ephyra"), "REG-SARONISCHEGOLF": R("De Saronische Golf", "achaia", 1050, 520, "kenchreai"),
      "REG-ATTIKA": R("Attika", "achaia", 1290, 400, "athenai"), "REG-ARGOLIS": R("Argolis", "achaia", 650, 590, "argos"),
      "REG-ARKADIA": R("Arkadia", "achaia", 400, 650, "arkadia"), "REG-LAKONIA": R("Lakonia", "achaia", 560, 780, "sparta"),
      "REG-BOIOTIA": R("Boiotia", "achaia", 1050, 200, "thebai"), "REG-PHOKIS": R("Phokis", "achaia", 780, 160, "delphoi"),
      "REG-THESSALIA": R("Thessalia", "oikoumene", 820, 330), "REG-EPEIROS": R("Epeiros", "oikoumene", 740, 345),
      "REG-IONISCHEEILANDEN": R("De Ionische Eilanden", "oikoumene", 745, 466, "ithaka"), "REG-AIGAIOS": R("De Aigaios", "oikoumene", 1130, 500, "aigaios"),
      "REG-KRETA": R("Kreta", "oikoumene", 1030, 592, "kreta"), "REG-LEMNOS": R("Lemnos", "oikoumene", 1075, 382, "lemnos"),
      "REG-TROAS": R("De Troas", "oikoumene", 1200, 392, "ilion"), "REG-THRAKIA": R("Thrakia", "oikoumene", 1000, 318),
      "REG-HESPERIA": R("Hesperia", "oikoumene", 258, 425, "alba_longa"), "REG-AIAIA": R("Aiaia", "oikoumene", 330, 560),
      "REG-THULE": R("Thule", "oikoumene", 292, 112, "thule"), "REG-KEMET": R("Kemet", "oikoumene", 1230, 782, "kemet"),
      "REG-OOSTEN": R("Het Oosten", "oikoumene", 1295, 545, "feniciers"), "REG-KAUKASOS": R("De Kaukasos", "oikoumene", 1345, 205, "kaukasos"),
      "REG-ONDERWERELD": R("De Onderwereld", "achaia", 640, 895, "tainaron")
    }
  });

  /* ===== Westeros ===== (kaart van Sándor Cziegler; Essos ligt buiten de kaart) */
  attach("westeros", {
    enabled: true, start: "westeros",
    maps: { westeros: { name: "Westeros", file: "assets/maps/westeros.webp", w: 1800, h: 3119 } },
    places: [
      P("spookbos", "Het Spookbos (voorbij de Muur)", "westeros", 1104, 390, ["haunted forest", "spookbos", "voorbij de muur", "wildlingen", "land of always winter"]),
      P("castle_black", "Castle Black (de Muur)", "westeros", 1190, 662, ["castle black", "de muur", "the wall", "night's watch", "nachtwacht"], { region: "REG-DEMUUR" }),
      P("eastwatch", "Eastwatch-by-the-Sea", "westeros", 1318, 662, ["eastwatch"]),
      P("shadow_tower", "Shadow Tower", "westeros", 1062, 666, ["shadow tower", "schaduwtoren"]),
      P("skagos", "Skagos", "westeros", 1530, 670, ["skagos"]),
      P("last_hearth", "Last Hearth", "westeros", 1232, 829, ["last hearth", "umber"]),
      P("karhold", "Karhold", "westeros", 1434, 942, ["karhold", "karstark"]),
      P("deepwood_motte", "Deepwood Motte", "westeros", 750, 962, ["deepwood motte", "glover"]),
      P("bear_island", "Bear Island", "westeros", 742, 803, ["bear island", "berene", "mormont"]),
      P("dreadfort", "Dreadfort", "westeros", 1254, 1044, ["dreadfort", "bolton"]),
      P("winterfell", "Winterfell", "westeros", 948, 1086, ["winterfell", "stark", "wolfswood", "het noorden"], { region: "REG-NOORDEN" }),
      P("white_harbor", "White Harbor", "westeros", 1132, 1428, ["white harbor", "manderly"]),
      P("moat_cailin", "Moat Cailin", "westeros", 979, 1491, ["moat cailin", "de nek", "the neck"]),
      P("flints_finger", "Flint's Finger", "westeros", 593, 1515, ["flint's finger", "flint"]),
      P("three_sisters", "De Three Sisters", "westeros", 1192, 1536, ["three sisters", "sisterton"]),
      P("twins", "De Twins", "westeros", 911, 1751, ["the twins", "de twins", "frey"]),
      P("seaguard", "Seagard", "westeros", 889, 1808, ["seagard", "seaguard", "mallister"]),
      P("pyke", "Pyke (IJzereilanden)", "westeros", 588, 1922, ["pyke", "greyjoy", "ijzereilanden", "iron islands", "verdronken god"], { region: "REG-IJZEREILANDEN" }),
      P("riverrun", "Riverrun", "westeros", 900, 2012, ["riverrun", "tully", "rivierlanden", "riverlands", "drietand", "trident"], { region: "REG-RIVIERLANDEN" }),
      P("harrenhal", "Harrenhal", "westeros", 1105, 2073, ["harrenhal"]),
      P("eyrie", "De Eyrie (Vale van Arryn)", "westeros", 1237, 1892, ["eyrie", "arryn", "gates of the moon", "vale of arryn", "maanpoort"], { region: "REG-VALE" }),
      P("gulltown", "Gulltown", "westeros", 1505, 1896, ["gulltown"]),
      P("casterly_rock", "Casterly Rock (Lannisport)", "westeros", 576, 2232, ["casterly rock", "lannisport", "lannister", "westerlands", "westerlanden"], { region: "REG-WESTERLANDEN" }),
      P("kings_landing", "King's Landing", "westeros", 1205, 2314, ["king's landing", "kings landing", "rode burcht", "red keep", "ijzeren troon", "iron throne", "vlooienbak", "flea bottom"], { region: "REG-KROONLANDEN" }),
      P("dragonstone", "Dragonstone", "westeros", 1484, 2142, ["dragonstone"]),
      P("storms_end", "Storm's End", "westeros", 1408, 2529, ["storm's end", "storms end", "baratheon", "stormlanden", "stormlands"], { region: "REG-STORMLANDEN" }),
      P("tarth", "Tarth", "westeros", 1545, 2466, ["tarth"]),
      P("highgarden", "Highgarden", "westeros", 744, 2600, ["highgarden", "tyrell", "the reach", "reach"], { region: "REG-REACH" }),
      P("oldtown", "Oldtown (de Citadel)", "westeros", 538, 2815, ["oldtown", "citadel", "maester"]),
      P("starfall", "Starfall", "westeros", 742, 2920, ["starfall", "dayne"]),
      P("sunspear", "Sunspear (Dorne)", "westeros", 1526, 2960, ["sunspear", "martell", "dorne"], { region: "REG-DORNE" })
    ],
    regions: {
      "REG-NOORDEN": R("Het Noorden", "westeros", 948, 1086, "winterfell"), "REG-DEMUUR": R("De Muur", "westeros", 1190, 662, "castle_black"),
      "REG-RIVIERLANDEN": R("De Rivierlanden", "westeros", 900, 2012, "riverrun"), "REG-VALE": R("De Vale van Arryn", "westeros", 1237, 1892, "eyrie"),
      "REG-IJZEREILANDEN": R("De IJzereilanden", "westeros", 588, 1922, "pyke"), "REG-WESTERLANDEN": R("De Westerlanden", "westeros", 576, 2232, "casterly_rock"),
      "REG-KROONLANDEN": R("De Kroonlanden", "westeros", 1205, 2314, "kings_landing"), "REG-STORMLANDEN": R("De Stormlanden", "westeros", 1408, 2529, "storms_end"),
      "REG-REACH": R("De Reach", "westeros", 744, 2600, "highgarden"), "REG-DORNE": R("Dorne", "westeros", 1526, 2960, "sunspear"),
      "REG-ESSOS": R("Essos (over de Smalle Zee, buiten de kaart)", "westeros", 1690, 2300)
    }
  });

  /* ===== Thedas ===== */
  attach("thedas", {
    enabled: true, start: "thedas",
    maps: { thedas: { name: "Thedas", file: "assets/maps/thedas.webp", w: 3000, h: 2121 } },
    places: [
      P("denerim", "Denerim (Ferelden)", "thedas", 2192, 1617, ["denerim", "alienage", "ferelden"], { region: "REG-FERELDEN" }),
      P("highever", "Highever", "thedas", 1937, 1475, ["highever", "cousland"]),
      P("amaranthine", "Amaranthine", "thedas", 2103, 1472, ["amaranthine"]),
      P("south_reach", "South Reach", "thedas", 1993, 1770, ["south reach", "brecilian"]),
      P("redcliffe", "Redcliffe (Lake Calenhad)", "thedas", 1703, 1842, ["redcliffe", "lake calenhad", "calenhad", "lothering"]),
      P("orzammar", "Orzammar", "thedas", 1594, 1613, ["orzammar", "diepe paden", "deep roads", "dwergen"], { region: "REG-DIEPEPADEN" }),
      P("skyhold", "Skyhold (Frostbacks)", "thedas", 1505, 1717, ["skyhold", "frostback", "frostbacks"]),
      P("west_hills", "West Hills", "thedas", 1814, 2004, ["west hills", "kocari"]),
      P("val_royeaux", "Val Royeaux (Orlais)", "thedas", 1155, 1575, ["val royeaux", "orlais", "empire of orlais", "het grote spel", "chevalier"], { region: "REG-ORLAIS" }),
      P("kirkwall", "Kirkwall (Vrije Marken)", "thedas", 1750, 1405, ["kirkwall", "vrije marken", "free marches"], { region: "REG-VRIJEMARKEN" }),
      P("ostwick", "Ostwick", "thedas", 2167, 1333, ["ostwick"]),
      P("starkhaven", "Starkhaven", "thedas", 1898, 1105, ["starkhaven"]),
      P("antiva_city", "Antiva City", "thedas", 2270, 820, ["antiva city", "antiva", "antivan crows", "crows"], { region: "REG-ANTIVA" }),
      P("dairsmuid", "Dairsmuid (Rivain)", "thedas", 2467, 637, ["dairsmuid", "rivain", "sooth"], { region: "REG-RIVAIN" }),
      P("nevarra", "Nevarra (de stad)", "thedas", 1292, 1242, ["nevarra", "pentaghast"], { region: "REG-NEVARRA" }),
      P("minrathous", "Minrathous (Tevinter)", "thedas", 1263, 333, ["minrathous", "tevinter", "magister", "tevene"], { region: "REG-TEVINTER" }),
      P("weisshaupt", "Weisshaupt (Grey Wardens)", "thedas", 930, 828, ["weisshaupt", "anderfels", "grey warden", "grey wardens"], { region: "REG-ANDERFELS" }),
      P("hossberg", "Hossberg", "thedas", 842, 633, ["hossberg"]),
      P("seheron", "Seheron", "thedas", 1542, 247, ["seheron"]),
      P("qunandar", "Qunandar (Par Vollen)", "thedas", 2278, 80, ["qunandar", "par vollen", "qunari", "qun"], { region: "REG-PARVOLLEN" })
    ],
    regions: {
      "REG-FERELDEN": R("Ferelden", "thedas", 2192, 1617, "denerim"), "REG-ORLAIS": R("Orlais", "thedas", 1155, 1575, "val_royeaux"),
      "REG-VRIJEMARKEN": R("De Vrije Marken", "thedas", 1750, 1405, "kirkwall"), "REG-ANTIVA": R("Antiva", "thedas", 2270, 820, "antiva_city"),
      "REG-NEVARRA": R("Nevarra", "thedas", 1292, 1242, "nevarra"), "REG-TEVINTER": R("Het Tevinter Imperium", "thedas", 1263, 333, "minrathous"),
      "REG-ANDERFELS": R("De Anderfels", "thedas", 930, 828, "weisshaupt"), "REG-RIVAIN": R("Rivain", "thedas", 2467, 637, "dairsmuid"),
      "REG-PARVOLLEN": R("Par Vollen", "thedas", 2278, 80, "qunandar"), "REG-DIEPEPADEN": R("De Diepe Paden (Orzammar)", "thedas", 1594, 1613, "orzammar")
    }
  });

  /* ===== Theros ===== (kaart "The World of Theros") */
  attach("theros", {
    enabled: true, start: "theros",
    maps: { theros: { name: "Theros", file: "assets/maps/theros.webp", w: 1800, h: 2400 } },
    places: [
      P("meletis", "Meletis", "theros", 847, 1120, ["meletis", "kring der denkers", "meletis harbor"], { region: "REG-MELETIS" }),
      P("akros", "Akros", "theros", 935, 811, ["akros", "titan's stairs", "pharagax"], { region: "REG-AKROS" }),
      P("setessa", "Setessa", "theros", 1202, 1084, ["setessa", "nessian wood", "nexus"], { region: "REG-SETESSA" }),
      P("tethmos", "Tethmos", "theros", 1188, 877, ["tethmos"]),
      P("skophos", "Skophos", "theros", 892, 449, ["skophos", "purphoros"], { region: "REG-SKOPHOS" }),
      P("odunos", "Odunos", "theros", 664, 794, ["odunos"]),
      P("deyda_harbor", "Deyda Harbor", "theros", 798, 1030, ["deyda"]),
      P("altrisos", "Altrisos", "theros", 772, 1176, ["altrisos"]),
      P("glossion", "Glossion", "theros", 806, 1216, ["glossion"]),
      P("oxus", "Oxus", "theros", 898, 1178, ["oxus"]),
      P("sitrium", "Sitrium", "theros", 888, 1224, ["sitrium"]),
      P("neolantin", "Neolantin", "theros", 712, 1402, ["neolantin"]),
      P("asphodel", "Asphodel", "theros", 1128, 1326, ["asphodel", "blood tree", "hetos mire"]),
      P("mt_vesios", "Mount Vesios", "theros", 1056, 541, ["vesios", "ashlands"]),
      P("sun_mirror", "Sun's Mirror", "theros", 1236, 708, ["sun's mirror", "oreskos"])
    ],
    regions: {
      "REG-MELETIS": R("Meletis", "theros", 847, 1120, "meletis"), "REG-AKROS": R("Akros", "theros", 935, 811, "akros"), "REG-SETESSA": R("Setessa", "theros", 1202, 1084, "setessa"),
      "REG-SKOPHOS": R("Skophos", "theros", 892, 449, "skophos"), "REG-ZEE": R("De Siren Sea", "theros", 414, 1106)
    }
  });

  /* ===== Faerûn: de Zwaardkust en het Noorden, met een detailkaart van de omgeving van Neverwinter ===== */
  attach("faerun", {
    enabled: true, start: "zwaardkust",
    maps: {
      zwaardkust: { name: "De Zwaardkust en het Noorden", file: "assets/maps/faerun.webp", w: 3000, h: 1941 },
      neverwinter: { name: "Omgeving van Neverwinter", file: "assets/maps/neverwinter.webp", w: 1700, h: 2369, parent: "zwaardkust" }
    },
    places: [
      P("waterdeep", "Waterdeep", "zwaardkust", 1355, 720, ["waterdeep", "yawning portal", "dock ward", "undermountain", "lords of waterdeep"], { region: "REG-WATERDEEP" }),
      P("neverwinter", "Neverwinter", "zwaardkust", 1150, 395, ["neverwinter", "neverember", "hotenow"], { region: "REG-NEVERWINTER", zoom: "neverwinter" }),
      P("luskan", "Luskan", "zwaardkust", 1113, 263, ["luskan"]),
      P("mirabar", "Mirabar", "zwaardkust", 1303, 197, ["mirabar"]),
      P("icewind_dale", "Icewind Dale (Ten-Towns)", "zwaardkust", 1067, 100, ["icewind dale", "ten-towns", "ten towns"], { region: "REG-ICEWINDDALE" }),
      P("silverymoon", "Silverymoon", "zwaardkust", 1597, 292, ["silverymoon"], { region: "REG-SILVERYMOON" }),
      P("high_forest", "Het High Forest", "zwaardkust", 1753, 430, ["high forest"]),
      P("anauroch", "Anauroch", "zwaardkust", 2250, 808, ["anauroch", "thay", "red wizards"]),
      P("baldurs_gate", "Baldur's Gate", "zwaardkust", 1572, 1253, ["baldur's gate", "baldurs gate", "flaming fist", "elfsong tavern", "lower city", "upper city"], { region: "REG-BALDURSGATE" }),
      P("candlekeep", "Candlekeep", "zwaardkust", 1526, 1400, ["candlekeep"]),
      P("elturgard", "Elturgard", "zwaardkust", 1796, 1205, ["elturgard", "elturel"]),
      P("cormyr", "Cormyr", "zwaardkust", 2188, 1233, ["cormyr", "suzail", "purple dragons"], { region: "REG-CORMYR" }),
      P("dalelands", "De Dalelands", "zwaardkust", 2687, 1097, ["dalelands", "daggerdale", "harpers"], { region: "REG-DALELANDS" }),
      P("amn", "Amn", "zwaardkust", 1763, 1636, ["amn", "athkatla"], { region: "REG-AMN" }),
      P("moonshae", "De Moonshae-eilanden", "zwaardkust", 892, 1083, ["moonshae"]),
      /* detailkaart rond Neverwinter */
      P("nw_neverwinter", "Neverwinter (stad)", "neverwinter", 385, 1110, ["neverwinter, de stad", "neverwinter stad"]),
      P("nw_hotenow", "Mount Hotenow", "neverwinter", 587, 701, ["mount hotenow"]),
      P("nw_thundertree", "Thundertree", "neverwinter", 703, 1110, ["thundertree"]),
      P("nw_circle_of_thunder", "Circle of Thunder", "neverwinter", 1236, 1047, ["circle of thunder"]),
      P("nw_conyberry", "Conyberry", "neverwinter", 1405, 1254, ["conyberry", "agatha"]),
      P("nw_butterskull", "Butterskull Ranch", "neverwinter", 1494, 1245, ["butterskull"]),
      P("nw_dragon_barrow", "Dragon Barrow", "neverwinter", 657, 1356, ["dragon barrow"]),
      P("nw_cragmaw_castle", "Cragmaw Castle", "neverwinter", 935, 1429, ["cragmaw castle", "cragmaw"]),
      P("nw_old_owl_well", "Old Owl Well", "neverwinter", 1551, 1441, ["old owl well"]),
      P("nw_wyvern_tor", "Wyvern Tor", "neverwinter", 1551, 1585, ["wyvern tor"]),
      P("nw_wayside_inn", "Wayside Inn", "neverwinter", 684, 1732, ["wayside inn"]),
      P("nw_mountains_toe", "Mountain's Toe Gold Mine", "neverwinter", 1174, 1690, ["mountain's toe", "gold mine"]),
      P("nw_icespire", "Icespire Peak", "neverwinter", 1328, 1710, ["icespire", "icespire hold"]),
      P("nw_phandalin", "Phandalin", "neverwinter", 968, 1810, ["phandalin", "stonehill inn", "sleeping giant"]),
      P("nw_leilon", "Leilon", "neverwinter", 712, 2022, ["leilon"]),
      P("nw_gnomengarde", "Gnomengarde", "neverwinter", 1148, 1927, ["gnomengarde"]),
      P("nw_axeholm", "Axeholm", "neverwinter", 941, 2030, ["axeholm"])
    ],
    regions: {
      "REG-WATERDEEP": R("Waterdeep", "zwaardkust", 1355, 720, "waterdeep"), "REG-NEVERWINTER": R("Neverwinter", "zwaardkust", 1150, 395, "neverwinter"),
      "REG-BALDURSGATE": R("Baldur's Gate", "zwaardkust", 1572, 1253, "baldurs_gate"), "REG-ICEWINDDALE": R("Icewind Dale", "zwaardkust", 1067, 100, "icewind_dale"),
      "REG-SILVERYMOON": R("Silverymoon", "zwaardkust", 1597, 292, "silverymoon"), "REG-DALELANDS": R("De Dalelands", "zwaardkust", 2687, 1097, "dalelands"),
      "REG-CORMYR": R("Cormyr", "zwaardkust", 2188, 1233, "cormyr"), "REG-AMN": R("Amn", "zwaardkust", 1763, 1636, "amn"),
      "REG-CALIMSHAN": R("Calimshan (verder naar het zuiden, buiten de kaart)", "zwaardkust", 1750, 1890)
    }
  });
})(typeof self !== "undefined" ? self : this);
