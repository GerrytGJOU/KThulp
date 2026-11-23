/* Setting "Aldmark": klassieke high fantasy (eigen wereld, geen Tolkien of Forgotten Realms). Registreert zichzelf bij DNDSettings.
   Eén bestand voor browser en Node. Geen DM-geheimen: de dreiging en de plot schrijft de DM zelf bij de openingsbeurt in C1. */
(function (root) {
  "use strict";
  const D = typeof module === "object" && module.exports ? require("./settings-data.js") : root.DNDSettings;
  const AVOID = "Avoid: photorealism, cartoon or anime look, 3D game render, modern objects, text, captions, watermarks, logos, borders.";

  /* species: 2024-spelregels in het kort (de speler leest de volledige tekst in zijn PHB); label, speed, size, tolk = Aldmark-kleur, traits = [naam, uitleg] */
  const species = {
    Human: { label: "Human", speed: 30, size: "Medium of Small", tolk: "Mensen uit het Kroonland, de Havenkust of de Grensbergen; de talrijkste volken van Aldmark.",
      traits: [["Resourceful", "Heroic Inspiration na elke Long Rest."], ["Skillful", "Proficiency in één extra skill naar keuze."], ["Versatile", "Een extra Origin Feat naar keuze."]] },
    Elf: { label: "Elf", speed: 30, size: "Medium", tolk: "Elfen van het Zilverbos; lang levend, met een lang geheugen voor oude verdragen.",
      traits: [["Darkvision", "60 ft."], ["Fey Ancestry", "Advantage op saves tegen Charmed."], ["Keen Senses", "Proficiency in Insight, Perception of Survival."], ["Trance", "Geen slaap; 4 uur trance telt als Long Rest."]] },
    Dwarf: { label: "Dwarf", speed: 30, size: "Medium", tolk: "Dwergen van de Onderberg en de Grensbergen; smeden, mijnwerkers en bewaarders van eden.",
      traits: [["Darkvision", "120 ft."], ["Dwarven Resilience", "Resistance tegen Poison damage; Advantage op saves tegen Poisoned."], ["Dwarven Toughness", "+1 maximum HP per level (al verwerkt)."], ["Stonecunning", "Bonus Action: tremorsense 60 ft op steen (PB keer per Long Rest)."]] },
    Halfling: { label: "Halfling", speed: 30, size: "Small", tolk: "Halflingen van de Havenkust en de rivierdorpen; handelaars, boodschappers en verhalenvertellers.",
      traits: [["Brave", "Advantage op saves tegen Frightened."], ["Halfling Nimbleness", "Je mag door de ruimte van grotere wezens bewegen."], ["Luck", "Gooi een natural 1 op een d20 opnieuw (moet het nieuwe resultaat gebruiken)."], ["Naturally Stealthy", "Je kunt je verbergen achter een groter wezen."]] },
    Gnome: { label: "Gnome", speed: 30, size: "Small", tolk: "Gnomen uit de werkplaatsen van de Onderberg en de bossen van het Zilverbos; vindingrijk en nieuwsgierig.",
      traits: [["Darkvision", "60 ft."], ["Gnomish Cunning", "Advantage op Intelligence-, Wisdom- en Charisma-saves."], ["Gnomish Lineage", "Forest Gnome (Minor Illusion, Speak with Animals) of Rock Gnome (Mending, Prestidigitation)."]] },
    Dragonborn: { label: "Dragonborn", speed: 30, size: "Medium", tolk: "Drakenbloedigen uit de Asvelden en de oude clanhallen; trots, met een zware erfenis.",
      traits: [["Draconic Ancestry", "Kies een draak; die bepaalt je damage type."], ["Breath Weapon", "Vervangt een aanval uit je Attack action; schade naar level; PB keer per Long Rest."], ["Damage Resistance", "Resistance tegen het damage type van je voorouder."], ["Darkvision", "60 ft."], ["Draconic Flight", "Vanaf level 5: Bonus Action, vleugels, 10 minuten vliegen (1x per Long Rest)."]] },
    Tiefling: { label: "Tiefling", speed: 30, size: "Medium of Small", tolk: "Tieflings met een bloedlijn die teruggaat tot het Gezonken Rijk; vaak wantrouwd, zelden onopgemerkt.",
      traits: [["Darkvision", "60 ft."], ["Fiendish Legacy", "Kies Abyssal, Chthonic of Infernal: resistance, een cantrip en spells op level 3 en 5."], ["Otherworldly Presence", "Cantrip Thaumaturgy."]] },
    Orc: { label: "Orc", speed: 30, size: "Medium", tolk: "Orks van de Grensbergen, nu vaak huurling of grenswachter; geen monsters maar een volk met een eigen eer.",
      traits: [["Adrenaline Rush", "Dash als Bonus Action en tijdelijke HP gelijk aan PB (PB keer per Short of Long Rest)."], ["Darkvision", "120 ft."], ["Relentless Endurance", "Zakt je naar 0 HP, dan val je terug op 1 HP (1x per Long Rest)."]] }
  };
  const lineage = {
    "High Elf": "Cantrip Prestidigitation (INT, WIS of CHA); level 3: Detect Magic; level 5: Misty Step.",
    "Wood Elf": "Speed 35 ft; cantrip Druidcraft; level 3: Longstrider; level 5: Pass without Trace.",
    "Drow": "Darkvision 120 ft; cantrip Dancing Lights; level 3: Faerie Fire; level 5: Darkness."
  };

  D.register({
    id: "aldmark", name: "Aldmark", version: 1,
    blurb: "Klassieke high fantasy in een eigen wereld: oude koninkrijken na de val van het Gezonken Rijk, ruïnes, magie en gevaar. Zonder kaart; de DM bouwt de wereld in het spel op.",
    world: {
      /* reistijden in dagen tussen regio's (ondergrens: snelst aannemelijk, te paard of per boot) */
      travel: {
        "REG-KROONLAND|REG-HAVENKUST": 4, "REG-KROONLAND|REG-GRENSBERGEN": 6, "REG-KROONLAND|REG-ZILVERBOS": 5,
        "REG-KROONLAND|REG-ASVELDEN": 9, "REG-GRENSBERGEN|REG-ONDERBERG": 3, "REG-GRENSBERGEN|REG-ASVELDEN": 7,
        "REG-HAVENKUST|REG-ZILVERBOS": 8, "REG-ZILVERBOS|REG-ONDERBERG": 10, "REG-HAVENKUST|REG-ASVELDEN": 12
      },
      anchors: []
    },
    map: { enabled: false },
    ui: { name: "Aldmark" },
    prompt: {
      world: "Aldmark (klassieke high fantasy)",
      naming: "Gebruik voor alle eigennamen (plaatsen, volken, personen, voorwerpen, titels) exact de schrijfwijze uit de campagnecanon en vertaal ze niet; verzin nieuwe namen in dezelfde stijl en gebruik ze daarna consequent. Dat geldt ook voor namen in worldDelta, location en newNpcs.",
      noOvershadow: "Grote NPC's en wereldfiguren uit de canon overschaduwen de PC's niet.",
      bigFigure: "een ontmoeting met een belangrijke figuur uit de canon",
      geoCheck: "Controleer geografie met de regio's uit de canon (Kroonland, Grensbergen, Zilverbos, Havenkust, Asvelden, Onderberg).",
      exInGame: "{\"inGame\":{\"date\":\"12 april 1204\",\"timeOfDay\":\"ochtend\",\"location\":\"Hoogvoorde, herberg De Gouden Raaf\"},",
      exPlace: "'Hoogvoorde, de stallen'",
      exYear: "1204", exRegA: "REG-KROONLAND", exRegB: "REG-GRENSBERGEN",
      lootTone: "Aldmark (klassieke high fantasy, geen standaard D&D-clichés)",
      lootNo: "geen artefacten die de hele wereld kunnen veranderen en geen unieke legendarische voorwerpen uit de canon",
      bookFigures: "Voor figuren uit de canon: beschrijf zoals in de canon is vastgelegd.",
      idLegend: "FIG- vaste figuren uit de canon", noCreateFig: "Vaste figuren (FIG-) maak je niet aan",
      canonName: "een afwijking van de canon registreer je"
    },
    style: {
      base: "Classic high fantasy tabletop RPG illustration, painterly with visible brushwork, warm dramatic lighting, believable anatomy, detailed period costume, armor and architecture.",
      portraitNote: "Follow the written description exactly; no famous actor likenesses.",
      locNote: "Follow the written description of the place.",
      avoid: AVOID
    },
    creator: {
      magicWorld: "krachtige magie in Aldmark",
      spellTip: "Beschrijf spells in de sfeer van Aldmark en bespreek twijfelgevallen met de DM.",
      magicTip: "Magie is in Aldmark bekend; krachtige magie vraagt DM-goedkeuring.",
      commonLang: "Common",
      intro: "Dit is een nieuw personage in Aldmark, een klassieke high-fantasywereld (D&amp;D 2024 als regelsysteem). Magie en vreemde volken bestaan; krachtige magie en de oude ruïnes blijven gevaarlijk.",
      langsTip: "Je spreekt Common plus twee Standard Languages naar keuze. Aldmark-vertaling: Dwarvish = de taal van de Onderberg, Elvish = de zangtaal van het Zilverbos, Draconic = de taal van de clanhallen, Infernal en Sylvan zijn zeldzaam.",
      bgNote: "Kies wat geloofwaardig is in Aldmark.",
      helperSys: "Je bent een schrijfhulp voor een D&D 5e (2024)-personage in een campagne in Aldmark, een klassieke high-fantasywereld. Schrijf in het Nederlands, gebruik Engelse D&D-termen. Wees trouw aan de canon van de setting, maar met speelruimte; verzin geen spelregels. Wat de speler zelf heeft vastgesteld mag je niet veranderen; eigen aanvullingen markeer je met \"(voorstel)\".",
      species: species, lineage: lineage,
      langs: ["Dwarvish", "Elvish", "Halfling", "Orc", "Goblin", "Giant", "Draconic", "Gnomish", "Infernal", "Sylvan", "Common Sign Language"],
      inspiration: [
        "A · Ridder zonder heer — Human · Fighter/Paladin: trouw aan een eed waar niemand nog in gelooft",
        "B · Geleerde van de Zilveren Lamp — Elf/Human · Wizard/Cleric: zoekt kennis uit het Gezonken Rijk",
        "C · Dwerg met een schuld — Dwarf · Fighter/Cleric: moet een oud wapen terugbrengen",
        "D · Dief met een geweten — Halfling/Tiefling · Rogue/Bard: kent de straten van de Havenkust",
        "E · Grenswachter — Orc/Human · Ranger/Barbarian: bewaakt de Grensbergen en zijn geheimen",
        "F · Gebrandmerkt door een erfenis — Dragonborn/Tiefling · Sorcerer/Warlock (vraagt DM-goedkeuring)"
      ],
      speciesTip: "Standaard toegestaan: Human, Elf, Dwarf, Halfling, Gnome, Dragonborn, Tiefling en Orc. Andere species alleen als voorstel via de DM.",
      aanleiding: "Aanleiding / startsituatie (bv. waarom reis je naar Hoogvoorde, of wat heeft je naar de Grensbergen gedreven?)",
      classTolk: {}
    },
    canonParts: {
      namingRule: "eigennamen volgens de canon van de setting en consequent gebruikt.",
      tone: "klassieke high fantasy: heldhaftigheid, wonder, oude geheimen, gevaar en gevolgen, met ruimte voor humor, rust en kleine menselijke momenten.",
      settingRules: [
        "- Aldmark, een eigen high-fantasywereld (zie S1): D&D 5e 2024 als mechanische basis, met weinig beperkingen. Alle species en classes uit de PHB zijn als concept mogelijk; de DM beslist per spell of voorwerp over beschikbaarheid. Class- en spell-mechanieken blijven ongewijzigd tenzij expliciet goedgekeurd."
      ].join("\n"),
      premise: [
        "- Dit is een NIEUWE campagne in Aldmark. Beginpunt, premisse en dreiging staan nog open (tenzij de spelers een startsituatie hebben opgegeven in document P1): de DM kiest bij de openingsbeurt een startsituatie die past bij de backstories van de gekozen personages, schrijft die vast in de DM-bijbel (C1) en de Stand, en laat elke PC een geloofwaardige reden hebben om erbij te zijn.",
        "- De DM heeft volledige creatieve vrijheid over de overkoepelende campagne (dreiging, antagonisten, mysteries, facties, companions, sidequests) binnen deze afspraken. De hoofdplot draait niet exclusief om één PC; alle PCs worden gelijkwaardig geïntegreerd."
      ].join("\n"),
      canonNpcs: [
        "- Vaste figuren uit de canon (S1) leven en handelen waar de chronologie het toelaat. Respecteer hun geschiedenis, karakter, relaties, vermogens, locatie en kennisgrenzen; geen voorkennis van latere gebeurtenissen. Grote figuren overschaduwen de PCs niet en lossen hun missie niet op; ze zijn niet altijd beschikbaar.",
        "- Onderscheid [C] expliciete canon, [I] interpretatie, [N] nieuwe campagne-inhoud. Leg elke door spelers veroorzaakte afwijking van de canon vast met datum, oorzaak en gevolgen. Originele NPC's vullen de tussenruimte."
      ].join("\n"),
      consistent: "passend bij de wereld"
    },
    /* eigen canondocumenten van de setting (worden bij het aanmaken van een campagne gekopieerd) */
    canon: {
      s1_wereld_aldmark: {
        title: "S1 Aldmark: de wereld (publiek voor spelers en DM)",
        text: [
          "# S1 Aldmark: de wereld",
          "Aldmark is een continent van oude koninkrijken die opkwamen na de val van het Gezonken Rijk, een keizerrijk dat driehonderd jaar geleden in één nacht in zee verdween. Zijn ruïnes, wapens en geheimen liggen overal verspreid en trekken avonturiers, geleerden en grafrovers aan. Het huidige jaar is 1204 na de Val. Een jaar heeft twaalf maanden (januari t/m december), de dagen volgen de gewone week.",
          "",
          "## Regio's (REG-id's)",
          "- REG-KROONLAND: het vruchtbare hart van Aldmark: akkers, rivierstadjes en de koningsstad Valdoren. Hier woont de meerderheid; koning Aldric III regeert, zijn raad is verdeeld.",
          "- REG-GRENSBERGEN: ruw bergland in het noorden met mijnstadjes, forten en bandieten. Ligt aan de grens met de Asvelden.",
          "- REG-ZILVERBOS: oud bos in het westen, thuis van de elfen. Vreemdelingen zijn niet welkom zonder uitnodiging.",
          "- REG-HAVENKUST: handelssteden en zeehavens in het zuiden; geld, geruchten en smokkel.",
          "- REG-ASVELDEN: een dode, grijze vlakte vol ruïnes van het Gezonken Rijk. Gevaarlijk en vol schatten.",
          "- REG-ONDERBERG: het rijk van de dwergen en gnomen, onder de bergen; poorten, mijnen en smidsen.",
          "",
          "## Machten",
          "- De Kroonraad: de koning en zijn hovelingen; regeren, belasten en twisten over opvolging.",
          "- De Orde van de Zilveren Lamp: een geleerdengenootschap dat de ruïnes van het Gezonken Rijk bestudeert en bewaakt; sommige leden zoeken meer dan kennis.",
          "- Het Gilde van de Gouden Schalen: handelaars en bankiers van de Havenkust, met een eigen vloot.",
          "- De Grenswachters: huurlingen en vrijwilligers die de Grensbergen bewaken tegen wat uit de Asvelden komt.",
          "",
          "## Magie en gevaar",
          "Magie is bekend maar niet alledaags: de meeste mensen zien hooguit een dorpsgenezer of een rondtrekkende magiër. Spreuken die wereldschokkend zijn (bijvoorbeeld Wish of massale doden) vragen een grote, geloofwaardige oorzaak en de goedkeuring van de DM. Goden worden vereerd, maar hun directe optreden is zeldzaam.",
          "",
          "(De dreiging, geheime plannen en de hoofdplot schrijft de DM zelf in C1; dit document is alleen de gedeelde wereldbasis.)"
        ].join("\n")
      }
    }
  });
})(typeof self !== "undefined" ? self : this);
