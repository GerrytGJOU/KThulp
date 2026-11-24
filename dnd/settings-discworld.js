/* Setting "Discworld — De Schijfwereld" (id discworld): late City Watch/Industrial Revolution-periode, na Going Postal en Making Money, vóór Raising Steam.
   Aangeleverd als JSON door Gerben; hier ingebouwd. Het regio-overzicht, de factielijsten en de class-/species-lijsten worden uit dezelfde gegevens opgebouwd.
   Afwijkingen t.o.v. de JSON: creator.lineage ingevuld (nodig voor Elf), S3 als DM-document gemarkeerd (secret), trefwoorden op S2/S3 voor Gemini.
   Registreert zichzelf bij DNDSettings. */
(function (root) {
  "use strict";
  const D = typeof module === "object" && module.exports ? require("./settings-data.js") : root.DNDSettings;
  const F = typeof module === "object" && module.exports ? require("./settings-factory.js") : root.DNDSettingsFactory;
  const NL = String.fromCharCode(10);
  const NAME = "Discworld — De Schijfwereld";
  const PERIOD = "late City Watch/Industrial Revolution-periode, na Going Postal en Making Money, vóór Raising Steam; jaar 1 is appconventie";
  const TONE = "satirische fantasy met menselijke ernst; humor uit instituties, taal, botsende belangen en narratieve causaliteit, geen imitatie van Pratchetts proza";
  const MAGIC = "wizardry, witchcraft, headology, geloof, narrativium en incidentele wilde magie";
  const RULES = "Narratieve causaliteit is een fictief patroon, geen recht op automatisch succes. Geloof kan goden versterken maar verandert geen spell slots. Headology gebruikt sociale vaardigheden en passende spells, geen automatische mind control. Elfen, Death en de Auditors zijn geen gewone lootbronnen. Gilden hebben lokale bevoegdheden. Geen imitatie van de auteur; vertel in eigen Nederlands. Gebruik geen moderne techniek buiten de gekozen chronologie.";

  /* regio's: id, naam, omschrijving */
  const REG = [
    ["REG-ANKHMORPORK", "Ankh-Morpork", "Tweelingstad aan de Ankh; Patrician, gilden, Unseen University, City Watch, Shades, docks en Clacks."],
    ["REG-STO", "Sto Lat", "Nabijgelegen koninkrijk van Queen Kelirehenna; landbouw en handel met de stad."],
    ["REG-STOHELIT", "Sto Helit", "Hertogdom op de Sto Plains; oude aristocratie en landwegen."],
    ["REG-STOPLAINS", "Sto Plains", "Koolvelden, dorpen, handelswegen en kleine vorstendommen."],
    ["REG-LANCRE", "Lancre", "Ramtops, heksen, kleine monarchie en grens met het feeënrijk."],
    ["REG-RAMTOPS", "Ramtops", "Bergpassen, dwergenmijnen, trollen en afgelegen kloosters."],
    ["REG-UBERWALD", "Überwald", "Vampierfamilies, weerwolven, dwergenpolitiek, bossen en Bonk."],
    ["REG-QUIRM", "Quirm", "Kunst, wijn, gastronomie en kusthandel."],
    ["REG-PSEUDOPOLIS", "Pseudopolis", "Onafhankelijke stad met academische en commerciële rivaliteit."],
    ["REG-GENUA", "Genua", "Rivierdelta, moerassen, voodoo en de erfenis van sprookjespolitiek."],
    ["REG-OMNIA", "Kom", "Religieus rijk met veranderende instituties na Brutha; geloof en handel."],
    ["REG-EPHEBE", "Ephebe", "Filosofen, democratie, bibliotheken en kusthandel."],
    ["REG-TSORT", "Tsort", "Oude rivaliteit met Ephebe, ruïnes en handelsroutes."],
    ["REG-DJELIBEYBI", "Djelibeybi", "Rivierkoninkrijk, piramiden en bureaucratische tradities."],
    ["REG-KLATCH", "Al Khali", "Grote steden, woestijnen, handelsroutes en diverse culturen."],
    ["REG-HERSHEBA", "Hersheba", "Grensland met politieke spanningen en droge vlakten."],
    ["REG-HOWND", "Howondaland", "Uitgestrekte regio met uiteenlopende gemeenschappen; geen uniforme cultuur."],
    ["REG-AGATEAN", "Hunghung", "Counterweight Continent; keizerlijke bureaucratie en veranderende macht na Cohen."],
    ["REG-FOURECKS", "Bugarup", "Afgelegen continent met eigen ecologie en absurde gevaren."],
    ["REG-HUB", "Cori Celesti", "Berg van de goden; geen normale toeristische bestemming."],
    ["REG-DEATH", "Death’s Domain", "Tijdloze verblijfplaats van Death; toegang door uitzonderlijke gebeurtenissen."],
    ["REG-FAIRY", "Elfenrijk", "Onbetrouwbare tijd en glamour; toegang via grensplaatsen en bijzondere omstandigheden."],
    ["REG-LSPACE", "L-space", "Bibliotheken kunnen onder bijzondere omstandigheden ruimtelijk verbonden zijn; geen vrij teleportnetwerk."]
  ];
  const TRAVEL = {
    "REG-ANKHMORPORK|REG-STO": 1, "REG-STO|REG-STOHELIT": 2, "REG-STO|REG-STOPLAINS": 1, "REG-STOPLAINS|REG-LANCRE": 5, "REG-LANCRE|REG-RAMTOPS": 2, "REG-RAMTOPS|REG-UBERWALD": 5,
    "REG-ANKHMORPORK|REG-QUIRM": 3, "REG-ANKHMORPORK|REG-PSEUDOPOLIS": 4, "REG-PSEUDOPOLIS|REG-GENUA": 12, "REG-QUIRM|REG-GENUA": 10, "REG-QUIRM|REG-KLATCH": 8, "REG-KLATCH|REG-OMNIA": 5,
    "REG-OMNIA|REG-EPHEBE": 3, "REG-EPHEBE|REG-TSORT": 3, "REG-TSORT|REG-DJELIBEYBI": 2, "REG-DJELIBEYBI|REG-KLATCH": 4, "REG-KLATCH|REG-HERSHEBA": 5, "REG-HERSHEBA|REG-HOWND": 8,
    "REG-ANKHMORPORK|REG-AGATEAN": 35, "REG-ANKHMORPORK|REG-FOURECKS": 40, "REG-RAMTOPS|REG-HUB": 15, "REG-LANCRE|REG-FAIRY": 1, "REG-ANKHMORPORK|REG-LSPACE": 1, "REG-ANKHMORPORK|REG-DEATH": 1
  };
  const FACTIONS = [["City Watch", "Wetshandhaving en publieke verantwoordelijkheid; interne meningsverschillen."], ["Assassins’ Guild", "Gereguleerde moordcontracten, etiquette en eliteopleiding."],
    ["Thieves’ Guild", "Gereguleerde diefstal; licenties en ongeoorloofde concurrentie."], ["Unseen University", "Magisch onderzoek en academische rivaliteit."], ["Witches", "Lokale verantwoordelijkheid en praktische hulp; geen centraal bevel."],
    ["Ankh-Morpork Times", "Nieuws, drukpers en publieke controle."], ["Clacks operators", "Communicatie, arbeid en commerciële macht."], ["Golem Trust", "Vrijheid en rechten van golems."],
    ["Dwarf clans", "Mijnbouw, traditie en politieke verandering; geen uniforme partij."], ["Troll communities", "Eigen cultuur, handel en familieverbanden."], ["Patrician’s office", "Bestuurlijk evenwicht en informatie."], ["Omnian church", "Geloof en veranderende interpretaties."]];
  const regName = id => (REG.find(r => r[0] === id) || [])[1];
  const conns = id => Object.keys(TRAVEL).filter(k => k.split("|").indexOf(id) >= 0).map(k => { const p = k.split("|"), o = p[0] === id ? p[1] : p[0]; return regName(o) + " (" + TRAVEL[k] + " dagen)"; }).join(", ");
  const CLASSES = { Barbarian: "Barbaar uit de Hublanden", Bard: "Gildenartiest, journalist of verteller", Cleric: "Priester van een god met werkelijk geloof", Druid: "Heks of landkundige", Fighter: "Watch-officier, huurling of barbaar", Monk: "Monnik van de History Monks of vechtschool", Paladin: "Eedgebonden Watch-officier of ridder", Ranger: "Woudwachter of reiziger", Rogue: "Gildedief, spion of oplichter", Sorcerer: "Onbedoelde magische aanleg", Warlock: "Onvoorzichtige afspraak met een bovennatuurlijke macht", Wizard: "Wizard van Unseen University of andere school" };
  const SP = (label, speed, size, traits, tolk) => ({ label: label, speed: speed, size: size, traits: traits, tolk: tolk });
  const species = {
    Human: SP("Human", 30, "Medium of Small", [["Resourceful", "Heroic Inspiration na Long Rest."], ["Skillful", "Eén extra skill proficiency."], ["Versatile", "Extra Origin Feat."]], "Mensen uit alle landen van de Schijf."),
    Dwarf: SP("Dwarf", 30, "Medium", [["Darkvision", "120 ft."], ["Dwarven Resilience", "Poison resistance en advantage tegen poisoned."], ["Dwarven Toughness", "+1 HP per level."], ["Stonecunning", "Bonus Action: tremorsense 60 ft op steen, 10 minuten, PB× per Long Rest."]], "Dwergen, mijnbouwcultuur en uiteenlopende opvattingen over traditie."),
    Goliath: SP("Troll (Goliath)", 35, "Medium", [["Giant Ancestry", "Kies officiële reuzenlijn; PB× per Long Rest."], ["Large Form", "Level 5: Bonus Action, 10 minuten Large, advantage STR checks, +10 ft speed; 1× per Long Rest."], ["Powerful Build", "Advantage om grappled te beëindigen; groter draagvermogen."]], "Troll als mechanische reskin; steenlichaam geeft geen extra immuniteiten."),
    Halfling: SP("Nac Mac Feegle (Halfling, voorstel)", 30, "Small", [["Brave", "Advantage tegen frightened."], ["Halfling Nimbleness", "Beweeg door ruimte van grotere wezens."], ["Luck", "Herrol een 1 op d20 Test."], ["Naturally Stealthy", "Hide achter grotere wezens."]], "Nac Mac Feegle als sterk vereenvoudigde reskin; geen automatische bovenmenselijke kracht."),
    Gnome: SP("Gnome", 30, "Small", [["Darkvision", "60 ft."], ["Gnomish Cunning", "Advantage op INT, WIS en CHA saves."], ["Gnomish Lineage", "Forest of Rock volgens PHB 2024."]], "Gnomes en kleine stadsbewoners."),
    Elf: SP("Elf", 30, "Medium", [["Darkvision", "60 ft."], ["Elven Lineage", "Kies de officiële 2024-lineage met bijbehorende spells."], ["Fey Ancestry", "Advantage tegen charmed."], ["Keen Senses", "Insight, Perception of Survival proficiency."], ["Trance", "Long Rest via 4 uur meditatie."]], "Elfen zijn doorgaans gevaarlijke bezoekers uit het feeënrijk; alleen uitzonderlijke PC met DM-akkoord."),
    Orc: SP("Orc", 30, "Medium", [["Adrenaline Rush", "Bonus Action Dash en PB temporary HP; PB× per Short of Long Rest."], ["Darkvision", "120 ft."], ["Relentless Endurance", "Bij 0 HP zonder directe dood naar 1 HP; 1× per Long Rest."]], "Orcs bestaan; hun geschiedenis is geen morele bestemming."),
    Tiefling: SP("Tiefling", 30, "Medium of Small", [["Darkvision", "60 ft."], ["Fiendish Legacy", "Abyssal, Chthonic of Infernal volgens PHB 2024."], ["Otherworldly Presence", "Thaumaturgy."]], "Uitzonderlijke bovennatuurlijke afkomst, uitsluitend als voorstel.")
  };
  const FIGURES = [
    ["Havelock Vetinari", "Ankh-Morpork", "Patrician; bestuurt via informatie en evenwicht, niet via openlijke heldendaden."], ["Samuel Vimes", "Ankh-Morpork", "Commander van de Watch; wantrouwt macht, inclusief zijn eigen."],
    ["Sybil Ramkin", "Ankh-Morpork", "Drakenliefhebber en invloedrijke burger met eigen netwerk."], ["Carrot Ironfoundersson", "Ankh-Morpork", "Watch-officier, opgevoed door dwergen; gezag door vertrouwen."],
    ["Angua von Überwald", "Ankh-Morpork", "Weerwolf en Watch-officier; professionele autonomie."], ["Detritus", "Ankh-Morpork", "Troll en Watch-officier; temperatuur beïnvloedt zijn denken in de fictie."],
    ["Cheery Littlebottom", "Ankh-Morpork", "Forensisch onderzoeker en dwerg; gender en traditie zijn persoonlijke en politieke kwesties."], ["Moist von Lipwig", "Ankh-Morpork", "Voormalige oplichter, nu hervormer van post en bank."],
    ["Adora Belle Dearheart", "Ankh-Morpork", "Golemrechten en scherpe zakelijke onafhankelijkheid."], ["Mustrum Ridcully", "Unseen University", "Archchancellor; praktisch, luid en machtig."],
    ["Ponder Stibbons", "Unseen University", "Onderzoeker en beheerder van Hex."], ["The Librarian", "Unseen University", "Orang-oetan en bibliothecaris; geen aap noemen."],
    ["Rincewind", "Unseen University", "Overlever met talent voor vluchten; geen betrouwbare magische redder."], ["Esmerelda Weatherwax", "Lancre", "Heks met zelfbeheersing en scherpe kennis van mensen."],
    ["Gytha Ogg", "Lancre", "Heks, matriarch en sociaal netwerk."], ["Magrat Garlick", "Lancre", "Koningin en heks; eigen oordeel."], ["Tiffany Aching", "Chalk", "Jonge heks; precieze leeftijd afhankelijk van gekozen boekchronologie."],
    ["Death", "Death’s Domain", "Personificatie van de dood, nieuwsgierig naar mensen; geen gewone vijand."], ["Susan Sto Helit", "Sto Helit", "Kleindochter van Death; onafhankelijk, rationeel."],
    ["Cohen the Barbarian", "Onbekend", "Na The Last Hero niet als gewone beschikbare NPC behandelen."], ["William de Worde", "Ankh-Morpork", "Journalist; zoekt feiten ondanks druk."], ["Sacharissa Cripslock", "Ankh-Morpork", "Journalist met eigen professionele oordeel."]
  ];
  const HOOKS = ["Een onverklaarbare Clacks-boodschap", "Een diefstal zonder vergunning", "Een bibliotheekboek dat terugschrijft", "Een dorp met een te perfect sprookje", "Een golem met een betwiste arbeidsovereenkomst", "Een journalist met een verdwenen bron"];
  const INSP = [["A", HOOKS[0], "Human", "Fighter"], ["B", HOOKS[1], "Human", "Monk"], ["C", HOOKS[2], "Human", "Paladin"], ["D", HOOKS[3], "Human", "Ranger"], ["E", HOOKS[4], "Human", "Rogue"], ["F", HOOKS[5], "Human", "Sorcerer"]]
    .map(x => x[0] + " · " + x[1] + " — " + x[2] + " · " + x[3] + ": verbind dit gegeven aan een persoonlijke verplichting en een plaats uit S1.");
  const classTolk = {}; Object.keys(CLASSES).forEach(k => { classTolk[k] = CLASSES[k]; });

  const S1 = ["# S1 De wereld", "", "## 1. Tijd en uitgangspunt",
    NAME + "; " + PERIOD + ". " + TONE.charAt(0) + TONE.slice(1) + ". De app gebruikt een numeriek jaar en gewone maandnamen als conventie, niet als claim over een canonkalender.", "",
    "## 2. Geografie", "",
    REG.map(r => "### " + r[0] + " — " + r[1] + NL + r[2] + NL + NL + "[I] Reisverbindingen: " + conns(r[0]) + ". Gebruik de hub als referentie, niet als enige nederzetting.").join(NL + NL), "",
    "## 3. Facties", FACTIONS.map(f => "- **" + f[0] + ":** " + f[1]).join(NL), "",
    "## 4. Reizen en economie", "Reisduur is een spelmatige schatting, geen officiële afstand. Lokale valuta worden voor de mechaniek omgerekend naar gp/sp/cp; gebruik passende lokale namen en ruilhandel. Leg transport, kosten en toegang vast voordat de reis begint.", "",
    "## 5. Campagne-aanleidingen [N]", HOOKS.map(h => "- " + h).join(NL)].join(NL);
  const S2 = ["# S2 Magie en bovennatuurlijke machten", "", "## 1. Bron en grenzen", MAGIC + ".", "", RULES, "",
    "## 2. Spelmechaniek", "Gebruik de 2024-regels waar passend; afwijkingen zijn huisregels en moeten expliciet worden vastgelegd. Geen piety-systeem uit Oikoumenè overnemen. Spells behouden hun mechanische werking tenzij een goedgekeurde conversie anders bepaalt.", "",
    "## 3. Tradities per class", Object.keys(CLASSES).map(k => "- **" + k + ":** " + CLASSES[k] + ".").join(NL)].join(NL);
  const S3 = ["# S3 Volken en vaste figuren", "", "## 1. Species", Object.keys(species).map(k => "- **" + k + ":** " + species[k].tolk).join(NL), "",
    "## 2. Vaste figuren", FIGURES.map(f => "- **" + f[0] + "** — " + f[1] + ". " + f[2]).join(NL), "",
    "## 3. Canonbeheer", "Vaste figuren zijn geen nieuw aangemaakte NPC’s. Verifieer hun actuele locatie en kennis voor een ontmoeting. Geheimen in deze tekst zijn DM-informatie, niet automatisch spelerkennis. Nieuwe NPC’s krijgen een eigen ID, motivatie, relatie en herkomst."].join(NL);

  D.register({
    id: "discworld", name: NAME, version: 1,
    blurb: NAME + "; " + PERIOD + ". Satirische fantasy met menselijke ernst; humor uit instituties, taal, botsende belangen en narratieve causaliteit, geen imitatie van pratchetts proza.",
    world: { travel: TRAVEL, anchors: [] }, map: { enabled: false }, ui: { name: NAME },
    prompt: {
      world: NAME + "; " + PERIOD,
      naming: "Gebruik de oorspronkelijke canonieke eigennamen zoals in S1–S3; nieuwe namen volgen de lokale taal en cultuur. Houd spelling consequent in worldDelta, location en newNpcs.",
      noOvershadow: "Canonfiguren hebben eigen doelen, kennisgrenzen en verplichtingen. Zij lossen de missie niet op en vervangen geen PC.",
      bigFigure: "een ontmoeting met een vaste canonfiguur of bovennatuurlijke macht",
      geoCheck: "Controleer S1 en de volgende regio-ID’s: " + REG.map(r => r[0]).join(", ") + ". Reistijden zijn schattingen tussen hubs, geen garantie op toegang; bijzondere routes vereisen een fictieve aanleiding.",
      exInGame: "{\"inGame\":{\"date\":\"1 september 1\",\"timeOfDay\":\"ochtend\",\"location\":\"Ankh-Morpork\"},", exPlace: "'Ankh-Morpork'", exYear: "1", exRegA: "REG-ANKHMORPORK", exRegB: "REG-STO",
      lootTone: "Lokale handelswaar, loon, informatie, gereedschap, erfstukken en passende beloningen; " + MAGIC,
      lootNo: "Geen unieke canonartefacten, wereldveranderende macht of gratis toegang tot bovennatuurlijke gebieden; geen beloningen die de settingregels omzeilen.",
      bookFigures: "Gebruik S3 en de gekozen canonperiode; geen voorkennis of latere vermogens. Onzekerheden markeren als interpretatie.",
      idLegend: "FIG- vaste canonfiguren", noCreateFig: "Vaste figuren (FIG-) maak je niet aan", canonName: "Registreer afwijkingen van de canon met datum, oorzaak en gevolgen."
    },
    style: {
      base: "Hand-drawn ink and watercolor fantasy illustration, whimsical crowded medieval-industrial streets, expressive believable characters, warm paper texture, intricate visual storytelling, original designs",
      portraitNote: "Follow written age, appearance, clothing and equipment; maintain continuity; no actor likenesses.", locNote: "Follow S1 geography, local architecture, materials, season and chronology.",
      avoid: "Avoid photorealism, 3D game render, modern objects outside the setting, text, captions, watermarks, logos, borders."
    },
    creator: {
      magicWorld: MAGIC,
      intro: "Nieuw personage in " + NAME + "; " + PERIOD + ". D&D 2024 als basis, level 3, point buy 27, achtergrond volgens 2024. " + RULES,
      langsTip: "Common plus twee passende talen of dialecten; dialecten zijn campagneconventies, geen automatische taalbarrières.",
      bgNote: "Kies een herkomst uit S1, een beroep, een persoonlijke band en een reden om te reizen. Verbind je verleden aan een lokale factie zonder verplichte loyaliteit.",
      spellTip: RULES, magicTip: "Magie: " + MAGIC + ". Leg bron en beperkingen vast; geen nieuwe mechaniek zonder DM-akkoord.", commonLang: "Common",
      helperSys: "Je bent schrijfhulp voor D&D 2024 in " + NAME + "; " + PERIOD + ". Nederlands, Engelse speltermen. Respecteer S1–S3 en spelerkeuzes; markeer aanvullingen (voorstel). " + RULES,
      species: species, lineage: { "High Elf": F.LINEAGE_STD["High Elf"], "Wood Elf": F.LINEAGE_STD["Wood Elf"], "Drow": F.LINEAGE_STD["Drow"] },
      langs: ["Dwarvish", "Troll", "Klatchian", "Agatean", "Omnian", "Ephebian", "Quirmian", "Uberwaldean", "Golem signs"], inspiration: INSP,
      speciesTip: "Toegestaan: Human, Dwarf, Goliath, Halfling, Gnome, Elf, Orc, Tiefling. Andere species uitsluitend na DM-akkoord en passende canonverklaring.",
      aanleiding: "Waarom ben je hier, wie verwacht iets van je en wat staat er voor jou op het spel?", classTolk: classTolk
    },
    canonParts: {
      namingRule: "Gebruik de oorspronkelijke canonieke eigennamen zoals in S1–S3; nieuwe namen volgen de lokale taal en cultuur. Houd spelling consequent in worldDelta, location en newNpcs.",
      tone: TONE,
      settingRules: ["- D&D 2024; level 3, point buy 27, milestones, achtergrond volgens 2024. Sociale en slimme oplossingen tellen even zwaar.", "- " + RULES,
        "- Spelers rollen zelf; DM toont bonus en werkelijk uitgevoerde NPC-worpen. Geen verzonnen worpen; als geen dobbeltool beschikbaar is, vraag om worp. Natural 20 geeft extra effect en natural 1 complicatie als huisregel, nooit automatisch dood.",
        "- Geen retcons om spelers te redden; log gevolgen. Heroic Inspiration voor sterk rollenspel.", "- Beloningen ook voor onderzoek en vermeden gevechten. Reistijden in dagen, symmetrische richtwaarden; weer, vervoer en toegang wijzigen ze.",
        "- Nederlands voor vertelling, Engelse speltermen. Eindig met situatie zonder keuzemenu."].join(NL),
      premise: "Nieuwe campagne; startpunt volgt de backstories. DM legt premisse vast in C1 en Stand. Alle PC’s krijgen gelijkwaardige aandacht. Facties handelen ook buiten beeld. Grote obstakels hebben waar geloofwaardig een sociale, slimme en gewelddadige route.",
      canonNpcs: "Respecteer S3, kennisgrenzen en chronologie. Iedere belangrijke NPC heeft een doel, waarde, angst en geheim. [C] expliciete canon, [I] interpretatie, [N] nieuwe campagne-inhoud; log afwijkingen. Geen vaste uitkomst afdwingen.",
      consistent: NAME + "; " + PERIOD
    },
    canon: {
      s1_wereld: { title: "S1 De wereld", text: S1 },
      s2_goden: { title: "S2 Magie en bovennatuurlijke machten", text: S2, keywords: "magie,wizard,heks,witch,headology,geloof,god,priester,narrativium,spell,death,auditor,elf,vloek,golem" },
      s3_volken_en_helden: { title: "S3 Volken en vaste figuren", text: S3, secret: true,
        keywords: "vetinari,vimes,sybil,carrot,angua,detritus,cheery,moist,adora,ridcully,ponder,librarian,rincewind,weatherwax,ogg,magrat,tiffany,death,susan,cohen,william,sacharissa,troll,dwerg,species,volk" }
    }
  });
})(typeof self !== "undefined" ? self : this);
