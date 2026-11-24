/* Setting "The Witcher — De Noordelijke Koninkrijken" (id witcher): boekcanon van Sapkowski, vóór Thanedd. Aangeleverd als JSON door Gerben; hier ingebouwd via
   settings-spec.js (de herhalende stukken komen uit dezelfde gegevens). Afwijkingen t.o.v. de JSON: creator.lineage ingevuld (nodig voor Elf), S3 als DM-document
   gemarkeerd (secret) en trefwoorden op S2/S3 voor Gemini. Registreert zichzelf bij DNDSettings. */
(function (root) {
  "use strict";
  const D = typeof module === "object" && module.exports ? require("./settings-data.js") : root.DNDSettings;
  const Spec = typeof module === "object" && module.exports ? require("./settings-spec.js") : root.DNDSettingsSpec;
  D.register(Spec.build({
    id: "witcher", name: "The Witcher — De Noordelijke Koninkrijken", year: 1267, exRegA: "REG-TEMERIA", exRegB: "REG-REDANIA",
    blurb: "De tweede oorlog met Nilfgaard dreigt; monsters, pogroms en rivaliserende vorsten maken neutraliteit moeilijk.",
    source: "boekcanon van Sapkowski; games en televisieseries zijn geen baseline",
    magic: "Geralt, Yennefer en Ciri zijn geen standaard companions. Witchers zijn gemuteerde mensen, geen species; Fighter/Ranger met passende flavor, Signs via bestaande spells. Magie vereist talent, opleiding of een bovennatuurlijke bron; geen automatische mutaties.",
    limits: "Contracten vragen onderzoek: sporen, getuigen, vloekoorzaak en onderhandelingen; niet elk monster is vijandig. Zilver is geen universele automatische zwakte; gebruik statblocks. Start vóór Thanedd; gebeurtenissen daarna zijn toekomst, geen voorkennis.",
    loot: "kronen, oren, zilveren monstercontracten, alchemistische ingrediënten", common: "Common Speech",
    styleBase: "donkere laatmiddeleeuwse olieverf, modder, verweerd hout, Slavische folklore, gedempt licht",
    langs: ["Elder Speech", "Dwarvish", "Nilfgaardiaans", "Skelligs", "Gnomish", "Common Sign Language"],
    regions: [
      ["REG-TEMERIA", "Temeria", "Vizima, koninklijk hof en moerassen; Foltest regeert."], ["REG-REDANIA", "Redania", "Tretogor en Oxenfurt; spionage en geleerden."],
      ["REG-KAEDWEN", "Kaedwen", "Ard Carraigh, koude bossen en Kaer Morhen, afgelegen witcherfort."], ["REG-AEDIRN", "Aedirn", "Vengerberg en Dol Blathanna, betwiste Elfenvallei."],
      ["REG-LYRIA", "Lyria en Rivia", "Koningin Meve, grensforten en landbouw."], ["REG-CINTRA", "Cintra", "Door Nilfgaard bezet sinds de eerste oorlog; vluchtelingen en verzet."],
      ["REG-SODDEN", "Sodden", "Slagvelden, grensovergangen en oorlogsgraven."], ["REG-BRUGGE", "Brugge", "Klein rijk tussen Temeria en de zuidelijke grens."],
      ["REG-KERACK", "Kerack", "Kusthandel en kleine havens."], ["REG-SKELLIGE", "Skellige", "Eilandclans, druïden en zeevaart; Kaer Trolde."],
      ["REG-KOVIR", "Kovir en Poviss", "Rijke mijnen, handel en politieke neutraliteit."], ["REG-NILFGAARD", "Nilfgaard", "Keizerlijk kernland ver in het zuiden; bureaucratie en leger."],
      ["REG-NAZAIR", "Nazair", "Onderworpen zuidelijke provincie met oude lokale adel."], ["REG-MAHAKAM", "Mahakam", "Dwergenbergen, mijnen en smederijen."],
      ["REG-BROKILON", "Brokilon", "Dryadenwoud; vreemdelingen lopen gevaar."], ["REG-THANEDD", "Thanedd", "Eiland bij Gors Velen, Aretuza en magische politiek."],
      ["REG-NOVIGRAD", "Novigrad", "Vrije handelsstad, Eeuwig Vuur en onderwereld."], ["REG-DOLBLATHANNA", "Dol Blathanna", "Elfenland in de oostelijke bergen, status afhankelijk van oorlog."],
      ["REG-ANGREN", "Angren", "Moerassen, bossen en guerrilla."], ["REG-TOUSSAINT", "Toussaint", "Wijngaarden, riddercultuur en Nilfgaardse invloed."]
    ],
    travel: {
      "REG-TEMERIA|REG-REDANIA": 4, "REG-TEMERIA|REG-AEDIRN": 5, "REG-TEMERIA|REG-SODDEN": 4, "REG-TEMERIA|REG-BRUGGE": 3, "REG-TEMERIA|REG-BROKILON": 4, "REG-TEMERIA|REG-THANEDD": 3, "REG-TEMERIA|REG-NOVIGRAD": 5,
      "REG-REDANIA|REG-KAEDWEN": 6, "REG-REDANIA|REG-KOVIR": 12, "REG-REDANIA|REG-NOVIGRAD": 2, "REG-KAEDWEN|REG-AEDIRN": 5, "REG-AEDIRN|REG-LYRIA": 4, "REG-AEDIRN|REG-MAHAKAM": 3, "REG-AEDIRN|REG-DOLBLATHANNA": 3,
      "REG-LYRIA|REG-ANGREN": 4, "REG-LYRIA|REG-SODDEN": 5, "REG-CINTRA|REG-SODDEN": 3, "REG-CINTRA|REG-BRUGGE": 3, "REG-CINTRA|REG-SKELLIGE": 5, "REG-CINTRA|REG-NAZAIR": 10, "REG-SODDEN|REG-ANGREN": 3,
      "REG-BRUGGE|REG-KERACK": 3, "REG-KERACK|REG-BROKILON": 2, "REG-KERACK|REG-SKELLIGE": 5, "REG-NAZAIR|REG-NILFGAARD": 15, "REG-NAZAIR|REG-TOUSSAINT": 7, "REG-MAHAKAM|REG-TEMERIA": 4,
      "REG-THANEDD|REG-NOVIGRAD": 3, "REG-ANGREN|REG-NAZAIR": 8, "REG-TOUSSAINT|REG-NILFGAARD": 15
    },
    factions: [["Broederschap van Tovenaars", "Magische opleiding en invloed op vorsten; interne verdeeldheid."], ["Scoia’tael", "Gewapende niet-menselijke verzetsgroepen; lokale cellen verschillen."],
      ["Nilfgaardse leger", "Expansie, logistiek, inlichtingen en provinciaal bestuur."], ["Eeuwig Vuur", "Religieuze macht in Novigrad; intolerantie en liefdadigheid bestaan naast elkaar."],
      ["Witcherscholen", "Kleine verspreide tradities van gemuteerde monsterjagers; geen groot leger."], ["Tempel van Melitele", "Genezing, opvang en onderwijs; Nenneke is een bekende priesteres."],
      ["Redaanse inlichtingendienst", "Netwerken van informanten en politieke manipulatie."], ["Handelsgilden", "Krediet, routes en voedselvoorziening; oorlog bedreigt contracten."]],
    species: {
      Human: { label: "Mens", speed: 30, size: "Medium of Small", traits: [["Resourceful", "Heroic Inspiration na Long Rest."], ["Skillful", "Eén extra skill proficiency."], ["Versatile", "Extra Origin Feat."]] },
      Elf: { label: "Aen Seidhe", speed: 30, size: "Medium", traits: [["Darkvision", "60 ft."], ["Elven Lineage", "Kies de officiële 2024-lineage met bijbehorende spells."], ["Fey Ancestry", "Advantage tegen charmed."], ["Keen Senses", "Insight, Perception of Survival proficiency."], ["Trance", "Long Rest via 4 uur meditatie."]] },
      Dwarf: { label: "Dwerg van Mahakam", speed: 30, size: "Medium", traits: [["Darkvision", "120 ft."], ["Dwarven Resilience", "Poison resistance en advantage tegen poisoned."], ["Dwarven Toughness", "+1 HP per level."], ["Stonecunning", "Bonus Action: tremorsense 60 ft op steen, 10 minuten, PB× per Long Rest."]] },
      Halfling: { label: "Halfling", speed: 30, size: "Small", traits: [["Brave", "Advantage tegen frightened."], ["Halfling Nimbleness", "Beweeg door ruimte van grotere wezens."], ["Luck", "Herrol een 1 op d20 Test."], ["Naturally Stealthy", "Hide achter grotere wezens."]] },
      Gnome: { label: "Gnoom", speed: 30, size: "Small", traits: [["Darkvision", "60 ft."], ["Gnomish Cunning", "Advantage op INT, WIS en CHA saves."], ["Gnomish Lineage", "Forest of Rock volgens PHB 2024."]] }
    },
    classes: { Barbarian: "Skellige-krijger", Bard: "Rondreizende dichter", Cleric: "Priester van melitele", Druid: "Skellige-druïde", Fighter: "Huurling of witcher", Monk: "Gedisciplineerde vechter", Paladin: "Ridder met persoonlijke eed", Ranger: "Monsterjager", Rogue: "Spion of smokkelaar", Sorcerer: "Magisch talent", Warlock: "Vervloekte pactdrager", Wizard: "Aretuza- of ban ard-opgeleide magiër" },
    inspiration: [["A", "Huurling of witcher", "Human", "Fighter", "REG-TEMERIA"], ["B", "Rondreizende dichter", "Elf", "Bard", "REG-REDANIA"], ["C", "Priester van melitele", "Dwarf", "Cleric", "REG-KAEDWEN"], ["D", "Monsterjager", "Halfling", "Ranger", "REG-AEDIRN"], ["E", "Spion of smokkelaar", "Gnome", "Rogue", "REG-LYRIA"], ["F", "Aretuza- of ban ard-opgeleide magiër", "Human", "Wizard", "REG-CINTRA"]],
    figures: [["Geralt van Rivia", "Witcher; onafhankelijk, zoekt Ciri en weigert eenvoudige morele antwoorden."], ["Yennefer van Vengerberg", "Tovenares; ambitieus, beschermt Ciri, eigen politieke belangen."], ["Ciri", "Erfgename van Cintra; haar afkomst is gevaarlijke kennis, geen publiek feit."], ["Dandelion", "Dichter en reiziger; loyaal maar praat te veel."], ["Vesemir", "Oude witcher in Kaer Morhen; mentor, geen universele questgever."], ["Foltest", "Koning van Temeria; pragmatisch en beschermt dynastie."], ["Vizimir II", "Koning van Redania; zijn lot volgt de gekozen datum."], ["Dijkstra", "Redaanse spionnenmeester; informatie is zijn macht."], ["Philippa Eilhart", "Tovenares met politieke ambities; geen voorkennis."], ["Emhyr var Emreis", "Keizer van Nilfgaard; strategisch, geheime motieven blijven geheim."], ["Meve", "Koningin van Lyria en Rivia; standvastig en militair bekwaam."], ["Eithné", "Leidster van Brokilon; beschermt haar woud."], ["Brouver Hoog", "Leider van Mahakam; bewaakt autonomie."], ["Triss Merigold", "Tovenares, verbonden met Temeria en andere magiërs."]],
    kwS2: "magie,magiër,tovenaar,tovenares,spell,sign,vloek,mutatie,witcher,priester,tempel,melitele,eeuwig vuur,broederschap,scoia,dood,sterf,resurrection,geloof",
    kwS3: "geralt,yennefer,ciri,dandelion,vesemir,foltest,vizimir,dijkstra,philippa,emhyr,meve,eithné,eithne,brouver,triss,aen seidhe,elf,dwerg,gnoom,halfling,species,volk,koning,keizer,koningin"
  }));
})(typeof self !== "undefined" ? self : this);
