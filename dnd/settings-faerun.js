/* Setting "Faerûn": de standaard-D&D-wereld (Forgotten Realms) rond de Zwaardkust en het Noorden: Waterdeep, Baldur's Gate, Neverwinter e.d.
   Alle tekst is een eigen samenvatting (geen overname van uitgegeven tekst). Registreert zichzelf bij DNDSettings. Geen DM-geheimen. */
(function (root) {
  "use strict";
  const D = typeof module === "object" && module.exports ? require("./settings-data.js") : root.DNDSettings;
  const F = typeof module === "object" && module.exports ? require("./settings-factory.js") : root.DNDSettingsFactory;
  const N = "Faerûn";

  D.register(F.build({
    id: "faerun", name: N,
    blurb: "De standaard D&D-wereld (Forgotten Realms), jaar 1492 DR: Waterdeep, Baldur's Gate, Neverwinter, de Zwaardkust, het Noorden en de Underdark. Zonder kaart.",
    world: "Faerûn (de Forgotten Realms, Zwaardkust en het Noorden, 1492 DR)",
    exYear: 1492, exRegA: "REG-WATERDEEP", exRegB: "REG-BALDURSGATE",
    /* reistijden in dagen (ondergrens: snelst aannemelijk, te paard of per schip); schattingen */
    travel: {
      "REG-WATERDEEP|REG-NEVERWINTER": 7, "REG-WATERDEEP|REG-BALDURSGATE": 12, "REG-WATERDEEP|REG-SILVERYMOON": 12, "REG-WATERDEEP|REG-DALELANDS": 14,
      "REG-WATERDEEP|REG-ICEWINDDALE": 16, "REG-NEVERWINTER|REG-SILVERYMOON": 7, "REG-NEVERWINTER|REG-ICEWINDDALE": 12, "REG-SILVERYMOON|REG-ICEWINDDALE": 9,
      "REG-BALDURSGATE|REG-AMN": 8, "REG-BALDURSGATE|REG-CORMYR": 20, "REG-BALDURSGATE|REG-CALIMSHAN": 18, "REG-AMN|REG-CALIMSHAN": 7,
      "REG-CORMYR|REG-DALELANDS": 9, "REG-WATERDEEP|REG-UNDERDARK": 3, "REG-NEVERWINTER|REG-UNDERDARK": 3, "REG-BALDURSGATE|REG-UNDERDARK": 3
    },
    prompt: {
      geoCheck: "Controleer geografie met de regio's uit de canon (Waterdeep, Neverwinter, Baldur's Gate, Silverymoon, Icewind Dale, Dalelands, Cormyr, Amn, Calimshan, Underdark).",
      exInGame: "{\"inGame\":{\"date\":\"15 Kythorn 1492\",\"timeOfDay\":\"ochtend\",\"location\":\"Waterdeep, De Yawning Portal\"},",
      exPlace: "'Waterdeep, de Dock Ward'",
      lootTone: "Faerûn (klassieke D&D-fantasy: gewone, nuttige voorwerpen en af en toe een legende)",
      lootNo: "geen artefacten van goden of Chosen en geen unieke legendarische voorwerpen uit de canon"
    },
    style: "Classic high fantasy tabletop RPG illustration, painterly with rich colors and visible brushwork, dramatic lighting, believable anatomy, detailed medieval-fantasy architecture, armor and costume.",
    creator: {
      magicWorld: "krachtige magie in Faerûn",
      intro: "Dit is een nieuw personage in Faerûn, de Forgotten Realms rond de Zwaardkust (1492 DR; D&amp;D 2024 als regelsysteem). Magie, goden en vreemde volken zijn gewoon; wereldschokkende magie niet.",
      langsTip: "Je spreekt Common plus twee Standard Languages naar keuze. In Faerûn horen daar o.a. Dwarvish (Dethek), Elvish (Espruar), Halfling, Draconic en Giant bij; Orc, Goblin, Infernal en Sylvan zijn minder gangbaar.",
      commonLang: "Common",
      species: {
        Human: { tolk: "Mensen uit Waterdeep, Baldur's Gate, Neverwinter, Amn, Cormyr of de Dales; de talrijkste volken van de kust." },
        Elf: { tolk: "Elfen (maan-, zon-, bos- of drow): van Evermeet, de Zilverbomen of de Underdark; lang levend, met een lang geheugen." },
        Dwarf: { tolk: "Dwergen van de Zwaardkust, Mithral Hall en de bergen: schilddwergen, vaak smeden, mijnwerkers en clanvolk." },
        Halfling: { tolk: "Halflingen van de Zwaardkust en Luiren; handelaars, reizigers en vrolijke huisgezinnen." },
        Gnome: { tolk: "Gnomen (Rock, Forest of Deep): uitvinders en illusionisten, vaak bij de dwergen of in Lantan." },
        Dragonborn: { tolk: "Draconische clanleden van oude geslachten; trots, vaak huurling of ridder." },
        Tiefling: { tolk: "Tieflings met een infernale erfenis (bv. de bloedlijnen van Calimshan of Neverwinter); vaak wantrouwd." },
        Orc: { tolk: "Orks van de Spine of the World of de stammen rond Neverwinter; geen monsters per definitie." },
        Aasimar: { tolk: "Aasimars met een hemelse stem in zich, vaak in dienst van een tempel of een god." },
        Goliath: { tolk: "Goliaths uit de bergen en de koude Noorden; sterk, trots en op prestaties gericht." }
      },
      lineage: { "High Elf": "Cantrip Prestidigitation (INT, WIS of CHA); level 3: Detect Magic; level 5: Misty Step. (Maan-/zonne-elf)", "Wood Elf": "Speed 35 ft; cantrip Druidcraft; level 3: Longstrider; level 5: Pass without Trace. (Bos-elf)", "Drow": "Darkvision 120 ft; cantrip Dancing Lights; level 3: Faerie Fire; level 5: Darkness. (Underdark)" },
      inspiration: [
        "A · Soldaat van de Flaming Fist — Human/Half-orc · Fighter/Paladin: loyaal aan een kompaan, niet aan het bevel",
        "B · Leerling van een bibliotheek — Elf/Gnome · Wizard/Cleric: zoekt een boek in Candlekeep",
        "C · Waterdhaviaanse straatrat — Halfling/Tiefling · Rogue/Bard: kent elke gang van de Dock Ward",
        "D · Dwerg met een clanschuld — Dwarf · Fighter/Cleric: moet een erfstuk terugbrengen",
        "E · Verkenner van de Emerald Enclave — Human/Elf · Ranger/Druid: bewaakt het evenwicht",
        "F · Gebrandmerkt door een hemelse of duistere erfenis — Aasimar/Tiefling · Sorcerer/Warlock (vraagt DM-goedkeuring)"
      ],
      speciesTip: "Standaard toegestaan: alle PHB-species (Human, Elf, Dwarf, Halfling, Gnome, Dragonborn, Tiefling, Orc, Aasimar en Goliath). Andere species alleen als voorstel via de DM.",
      aanleiding: "Aanleiding / startsituatie (bv. waarom ben je in Waterdeep of Baldur's Gate, of wie heeft je naar het Noorden gestuurd?)"
    },
    canonParts: {
      tone: "klassieke D&D-fantasy: avontuur, wonder, humor, gevaarlijke dungeons en politieke intriges, met ruimte voor rust en kleine menselijke momenten.",
      settingRules: "- Faerûn, de standaardwereld van D&D (zie S1), rond de Zwaardkust en het Noorden: D&D 5e 2024 als mechanische basis, met weinig beperkingen. Alle species en classes uit de PHB zijn als concept mogelijk; de DM beslist per spell of voorwerp over beschikbaarheid. Class- en spell-mechanieken blijven ongewijzigd tenzij expliciet goedgekeurd.",
      premise: F.premiseCanon(N),
      canonNpcs: F.npcCanon("Belangrijke figuren zoals de heersers van de grote steden of de machtige magiërs zijn niet altijd bereikbaar."),
      consistent: "passend bij Faerûn"
    },
    canon: {
      s1_wereld_faerun: {
        title: "S1 Faerûn: de wereld (publiek voor spelers en DM)",
        text: [
          "# S1 Faerûn: de wereld",
          "Faerûn is het westelijke deel van het continent Toril. Deze campagne speelt rond de Zwaardkust en het Noorden, in het jaar 1492 DR (Dalereckoning). De Tijd van Wanorde (de Spellplague) ligt ver achter ons; het land is relatief stabiel maar vol oude ruïnes, dungeons, geheime genootschappen en nieuwe dreigingen. Magie komt uit het Weave; Mystra bewaakt het. Goden zijn echt en hebben cultussen, tempels en soms sterfelijke dienaren.",
          "",
          "## Kalender",
          "Het jaar heeft twaalf maanden van dertig dagen plus feestdagen; in de app tellen we alleen de maanden: 1 Hammer, 2 Alturiak, 3 Ches, 4 Tarsakh, 5 Mirtul, 6 Kythorn, 7 Flamerule, 8 Eleasis, 9 Eleint, 10 Marpenoth, 11 Uktar, 12 Nightal. Schrijf datums in de tekst als \"15 Kythorn 1492\" en gebruik in worldDelta het maandnummer (Kythorn = 6).",
          "",
          "## Regio's (REG-id's)",
          "- REG-WATERDEEP: de Stad van de Pracht, de grootste havenstad van de Zwaardkust. Geregeerd door de Lords of Waterdeep, onder wie een Open Lord die in het publiek optreedt; de rest draagt maskers. Onder de stad ligt Undermountain, de gevaarlijkste dungeon van het Noorden.",
          "- REG-NEVERWINTER: de Juweel van het Noorden, na een vulkaanuitbarsting en een lange wederopbouw nu weer een bloeiende stad onder Lord Neverember. Aan de kust ligt de ruïne van het oude hart.",
          "- REG-BALDURSGATE: de grote havenstad van de zuidelijke Zwaardkust, bestuurd door een raad en bewaakt door de Flaming Fist, huurlingen en stadswacht. Handel, corruptie en vroom volk wonen er dicht bij elkaar.",
          "- REG-SILVERYMOON: de stad van magie en geleerdheid in het Noorden, vrij en vriendelijk voor vreemde volken, geleid door de Lady van Silverymoon.",
          "- REG-ICEWINDDALE: het ijskoude uiterste noorden met de Ten-Towns; eenzaam, hard, vol sneeuwstormen en oude geheimen.",
          "- REG-DALELANDS: een reeks dalen in het binnenland, boeren, ridders en de Harpers.",
          "- REG-CORMYR: een oud koninkrijk in het oosten met de Purple Dragons als beroemd ridderleger.",
          "- REG-AMN en REG-CALIMSHAN: de handelsrijke zuidelijke landen, Amn met zijn kooplieden, Calimshan met genieën, sultans en oude pacten.",
          "- REG-UNDERDARK: de onderwereld onder de hele regio, met drow-steden zoals Menzoberranzan, duistere markten, paddenstoelenwouden en zeer oude gevaren. Elke grote stad heeft ingangen.",
          "",
          "## Machten en facties",
          "- De Harpers: een geheim genootschap tegen tirannie en voor vrijheid en kennis.",
          "- De Lords' Alliance: een bondgenootschap van steden dat de beschaving verdedigt, met een eigen agenda.",
          "- De Order of the Gauntlet: strijders die het kwaad bestrijden en het recht handhaven.",
          "- De Emerald Enclave: druïden en jagers die de natuur en het evenwicht beschermen.",
          "- De Zhentarim: een zwarte markt en huurlingennetwerk dat macht via dienstverlening zoekt.",
          "- De Red Wizards van Thay: een machtig, gevaarlijk magisch regime in het oosten met invloed tot aan de Zwaardkust.",
          "",
          "## Magie en goden (kort)",
          "Het Weave wordt door spreuken, geheimen en tempels gebruikt. Bekende goden: Tyr (recht), Mystra (magie), Lathander (zonsopgang), Bane (tirannie), Bhaal (moord), Selûne (maan) en Shar (duisternis). Cultussen werken in het geheim.",
          "",
          "(De dreiging, geheime plannen en de hoofdplot schrijft de DM zelf in C1; dit document is alleen de gedeelde wereldbasis. De details van de canon (namen, politiek) zijn een samenvatting; de DM mag ze aanvullen en moet ze consequent houden.)"
        ].join("\n")
      }
    }
  }));
})(typeof self !== "undefined" ? self : this);
