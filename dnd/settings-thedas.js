/* Setting "Thedas": de wereld van Dragon Age: Ferelden, Orlais, de Vrije Marken, Antiva, Nevarra, Tevinter, de Anderfels, Rivain en het Qunari-schiereiland.
   Eigen samenvatting (geen overname van uitgegeven tekst). Registreert zichzelf bij DNDSettings. Geen DM-geheimen. */
(function (root) {
  "use strict";
  const D = typeof module === "object" && module.exports ? require("./settings-data.js") : root.DNDSettings;
  const F = typeof module === "object" && module.exports ? require("./settings-factory.js") : root.DNDSettingsFactory;
  const N = "Thedas";

  D.register(F.build({
    id: "thedas", name: N,
    blurb: "Thedas (Dragon Age): Ferelden, Orlais, de Vrije Marken, Antiva, Nevarra, Tevinter en meer. Magie, de Fade, de Chantry, de Doemen en ingewikkelde politiek. Zonder kaart.",
    world: "Thedas (de wereld van Dragon Age)",
    exYear: 935, exRegA: "REG-FERELDEN", exRegB: "REG-ORLAIS",
    /* reistijden in dagen te paard of per schip; schattingen */
    travel: {
      "REG-FERELDEN|REG-ORLAIS": 14, "REG-FERELDEN|REG-VRIJEMARKEN": 16, "REG-FERELDEN|REG-DIEPEPADEN": 4, "REG-ORLAIS|REG-VRIJEMARKEN": 12, "REG-ORLAIS|REG-NEVARRA": 10,
      "REG-ORLAIS|REG-ANTIVA": 14, "REG-ORLAIS|REG-RIVAIN": 18, "REG-VRIJEMARKEN|REG-TEVINTER": 12, "REG-VRIJEMARKEN|REG-ANDERFELS": 18, "REG-NEVARRA|REG-TEVINTER": 10,
      "REG-NEVARRA|REG-ANDERFELS": 12, "REG-TEVINTER|REG-ANDERFELS": 14, "REG-TEVINTER|REG-PARVOLLEN": 16, "REG-RIVAIN|REG-PARVOLLEN": 10, "REG-ANTIVA|REG-RIVAIN": 8,
      "REG-ORLAIS|REG-DIEPEPADEN": 12, "REG-ANDERFELS|REG-DIEPEPADEN": 20
    },
    prompt: {
      geoCheck: "Controleer geografie met de regio's uit de canon (Ferelden, Orlais, Vrije Marken, Antiva, Nevarra, Tevinter, Anderfels, Rivain, Par Vollen, Diepe Paden).",
      exInGame: "{\"inGame\":{\"date\":\"12 april 935\",\"timeOfDay\":\"ochtend\",\"location\":\"Denerim, de Alienage\"},",
      exPlace: "'Denerim, de Alienage'",
      lootTone: "Thedas (lyrium, maker's zegen en duistere rommel: praktische en soms gevaarlijke voorwerpen, geen standaard D&D-clichés)",
      lootNo: "geen Fade-artefacten van een Old God of een Archdemon en geen unieke legendarische voorwerpen uit de canon"
    },
    style: "Dark fantasy illustration, painterly with dramatic chiaroscuro, gothic-medieval architecture, weathered armor and robes, grey-blue and amber palette, moody atmosphere, believable anatomy.",
    creator: {
      magicWorld: "magie in Thedas (gevaarlijk en gereguleerd)",
      intro: "Dit is een nieuw personage in Thedas, de wereld van Dragon Age (D&amp;D 2024 als regelsysteem). Magie komt uit de Fade; mages worden gevreesd, de Chantry en de Templars houden toezicht, en elke streek heeft zijn eigen wetten en vooroordelen.",
      langsTip: "Je spreekt Trade Tongue plus twee talen naar keuze. De lijst bevat o.a. Antivan, Orlesian, Tevene (Tevinter), Qunlat (Qunari), Dwarvish en Elvish (Elvhen); gebruik die waar het personage vandaan komt.",
      commonLang: "Trade Tongue",
      species: {
        Human: { tolk: "Mensen uit Ferelden, Orlais, de Vrije Marken, Antiva, Nevarra, Tevinter of Rivain; de talrijkste volken van Thedas." },
        Elf: { tolk: "Elven: Dalish die vrij trekken of stadselven uit de Alienage; geen onsterfelijkheid. De mechanica volgt de PHB; flavor in overleg met de DM." },
        Dwarf: { tolk: "Dwergen van Orzammar of Kal-Sharok, of oppervlaktedwergen (Surface Dwarves); kaste, eer en steen zijn alles. Droomt niet, zingt niet, kent de Diepe Paden." },
        Qunari: { label: "Qunari", speed: 30, size: "Medium", tolk: "Qunari van Par Vollen of Tal-Vashoth (zonder Qun): groot, gedisciplineerd. Eigen species; vraagt DM-goedkeuring.",
          traits: [["Disciplined Mind", "Advantage op saves tegen Charmed en Frightened."], ["Powerful Build", "Advantage om grappled te ontsnappen; je telt als een grootte groter voor dragen."], ["Qun-training", "Proficiency in Athletics of Intimidation."]] }
      },
      lineage: { "High Elf": "Cantrip Prestidigitation (INT, WIS of CHA); level 3: Detect Magic; level 5: Misty Step. (Stadself uit de Alienage)", "Wood Elf": "Speed 35 ft; cantrip Druidcraft; level 3: Longstrider; level 5: Pass without Trace. (Dalish)" },
      langs: ["Antivan", "Orlesian", "Tevene", "Qunlat", "Dwarvish", "Elvish (Elvhen)", "Common Sign Language"],
      inspiration: [
        "A · Chantry-zuster of -broeder — Human · Cleric/Paladin: gelooft in de Maker, twijfelt over de Chantry",
        "B · Dalish jager — Elf · Ranger/Druid: draagt de herinnering van een verdwenen volk",
        "C · Dwerg zonder kaste — Dwarf · Rogue/Fighter: heeft Orzammar verlaten en kent de Diepe Paden",
        "D · Circle-mage — Human/Elf · Wizard/Sorcerer: kent de Fade en weet wat ze kost (vraagt DM-goedkeuring)",
        "E · Orlesiaanse spion — Human · Bard/Rogue: speelt het Spel om macht en gunst",
        "F · Overlevende van de Vervloeking — Human/Qunari · Fighter/Barbarian: draagt een Warden-teken of een Qun-eed"
      ],
      speciesTip: "Standaard toegestaan: Human, Elf, Dwarf en Qunari (eigen species met DM-goedkeuring). Andere species alleen als voorstel via de DM.",
      aanleiding: "Aanleiding / startsituatie (bv. waarom reis je naar Orlais, waar ben je ontsnapt, of in welke dienst sta je?)",
      classTolk: {
        Barbarian: "Past bij Avvar, Fereldaanse berglandbewoners of Qunari-krijgers: geschikt.",
        Bard: "Past bij Orlesiaanse hofbarden en het Spel, of een zingende rondreiziger: zeer geschikt.",
        Cleric: "Vraagt interpretatie: Chantry-zuster of -broeder (Andraste, de Maker); krachten moeten kloppen met de Chantry; DM-goedkeuring.",
        Druid: "Vraagt interpretatie: Dalish Keeper of Avvar-sjamaan; magie blijft Fade-gebonden; DM-goedkeuring.",
        Fighter: "Past zeer eenvoudig: soldaat, chevalier, huurling.",
        Monk: "Vraagt een goede reden (Qunari-training, Chantry-monnik); DM-goedkeuring.",
        Paladin: "Vraagt interpretatie: Templar, chevalier of ordebroeder; Divine Smite = Templar-training of geloof; DM-goedkeuring.",
        Ranger: "Past eenvoudig: Dalish jager, Grey Warden-verkenner of grensbewaker.",
        Rogue: "Past zeer eenvoudig: spion, dief of Antivan Crow.",
        Sorcerer: "Past als geboren mage; zonder Circle of Chantry-toezicht ben je apostaat; zeer gevaarlijk; DM-goedkeuring.",
        Warlock: "Vraagt een pact met een Fade-geest of bloedmagie; zeer gevaarlijk en verboden; DM-goedkeuring.",
        Wizard: "Past bij een Circle-mage of Tevinter-magister; wet en Templars bepalen de gevolgen; DM-goedkeuring."
      }
    },
    canonParts: {
      tone: "donkere fantasy: gevaar, morele keuzes, loyaliteit en verraad, politiek en verlies; met ruimte voor humor, kameraadschap en kleine menselijke momenten.",
      settingRules: "- Thedas (zie S1): D&D 5e 2024 als mechanische basis met de volgende beperkingen. Species: Human, Elf, Dwarf en Qunari (DM-goedkeuring). Magie komt uit de Fade: de DM past Chantry-toezicht, Templars en bezetenheid toe; mages in het openbaar hebben gevolgen. Class- en spell-mechanieken blijven ongewijzigd tenzij expliciet goedgekeurd.",
      premise: F.premiseCanon(N, "De wereld bevindt zich in een instabiele tijd: Doemen, Circles, de Chantry en grote machten wedijveren."),
      canonNpcs: F.npcCanon("Bekende figuren (de Empress, de Divine, de Grey Warden-commander, Magisters) zijn niet altijd bereikbaar en handelen vanuit hun eigen belang."),
      consistent: "passend bij Thedas"
    },
    canon: {
      s1_wereld_thedas: {
        title: "S1 Thedas: de wereld (publiek voor spelers en DM)",
        text: [
          "# S1 Thedas: de wereld",
          "Thedas is een continent met oude imperiums, trotse koninkrijken en een lange geschiedenis van oorlog en geloof. Magie komt uit de Fade, de wereld van dromen en geesten; demonen zoeken manieren om erin door te dringen. De Chantry vereert de Maker en zijn profeet Andraste. Magiërs staan onder toezicht van de Circles of Magi en de Templars. Onder de grond leven darkspawn; elke paar eeuwen volgt een Blight, geleid door een Archdemon, en alleen de Grey Wardens kunnen die stoppen.",
          "",
          "## Tijdperk en kalender",
          "Het Dragon Age (jaar 9:xx). Standaard speelt de campagne rond 9:35 Dragon (de jaartelling is 9:35 = 935 in de app): na de Vijfde Blight in Ferelden en voor de grote Mage-Templar-oorlog. Andere periodes zijn mogelijk als de spelers dat in de startsituatie vragen. We gebruiken gewone maanden (januari t/m december); schrijf datums als \"12 april 9:35 Dragon\".",
          "",
          "## Regio's (REG-id's)",
          "- REG-FERELDEN: een ruw, koud land met trotse boeren, hondenfokkers en een recente opstand tegen Orlais; hoofdstad Denerim, Redcliffe, Lothering, de Frostbacks. Veel vluchtelingen en een beschadigde bevolking.",
          "- REG-ORLAIS: het grote keizerrijk in het noorden: strikte etiquette, maskerspel (het Grote Spel), chevaliers, hoofdstad Val Royeaux, rijk en gevaarlijk; eigen wet voor magiërs.",
          "- REG-VRIJEMARKEN: een rij onafhankelijke stadstaten (Kirkwall, Starkhaven, Ostwick, Hasmal, Markham): wisselende bondgenootschappen, handel en gevaar; veel vluchtelingen.",
          "- REG-ANTIVA: warm zuidelijk land van kooplieden en prinsen; hier opereren de Antivan Crows, een beruchte orde van huurmoordenaars.",
          "- REG-NEVARRA: oud koninkrijk met eigen doodscultuur (necropolissen); streng, formeel en vol traditie.",
          "- REG-TEVINTER: het imperium van magisters: slavernij, bloedmagie, politiek en oude Vyrantium-ruïnes; magiërs regeren er openlijk, het geloof is tegen de Chantry in.",
          "- REG-ANDERFELS: hoog en koud, met Weisshaupt, de burcht van de Grey Wardens; trots en isolerend.",
          "- REG-RIVAIN: schiereiland met eigen cultuur, zieners (de Sooth) en een eigen verhouding tot geloof en magie.",
          "- REG-PARVOLLEN: het Qunari-thuisland: een gedisciplineerde samenleving onder de Qun, waarin magiërs worden gebonden; grensconflicten met Tevinter.",
          "- REG-DIEPEPADEN: de ondergrondse paden van de dwergen en de darkspawn; Orzammar is de grootste dwergenstad; gevaarlijk en bijna vergeten.",
          "",
          "## Machten en instellingen",
          "- De Chantry: de grote kerk, met een Divine aan het hoofd, de Chantry-zusters en broeders en de Templars.",
          "- De Circles of Magi: opleidingscentra waar magiërs onder toezicht leven; er zijn ook vrije magiërs (apostates).",
          "- De Grey Wardens: een oude orde die de Blights bestrijdt, met eigen wetten en offers.",
          "- De Antivan Crows en de Qunari: gedisciplineerde organisaties met eigen doctrines.",
          "- De elven: Dalish (zwervende clans met eigen geloof) en stadselven in de Alienages van menselijke steden, vaak onderdrukt.",
          "- De dwergen: een kastensysteem (adel, krijgers, smeden, handelaars), de oppervlaktedwergen zonder kaste.",
          "",
          "## Magie en gevaar",
          "Elke magiër staat in verbinding met de Fade; zwakke gemoederen worden door demonen verleid. Bloedmagie is verboden maar machtig. Lyrium is een zeldzaam mineraal dat magie voedt en verslavend werkt. Spreuken in het openbaar leiden tot argwaan, Templar-aandacht of vervolging, afhankelijk van de regio.",
          "",
          "(De dreiging, geheime plannen en de hoofdplot schrijft de DM zelf in C1; dit document is alleen de gedeelde wereldbasis. Details uit de canon zijn een samenvatting; de DM mag ze aanvullen en moet ze consequent houden.)"
        ].join("\n")
      }
    }
  }));
})(typeof self !== "undefined" ? self : this);
