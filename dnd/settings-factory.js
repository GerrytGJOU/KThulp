/* Fabriek voor vaste settings (dnd/): bouwt uit een compacte beschrijving een volledige setting met dezelfde structuur als Aldmark
   (prompt, ui, stijl, creator, wereldregels, canon). De standaardwaarden zijn setting-neutraal; elke setting vult alleen in wat anders is.
   Eén bestand voor browser (window.DNDSettingsFactory) en Node. Geen geheimen: alleen publieke wereldtekst in eigen woorden. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.DNDSettingsFactory = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  const AVOID = "Avoid: photorealism, cartoon or anime look, 3D game render, modern objects, text, captions, watermarks, logos, borders.";

  /* Standaard species (PHB 2024) in het kort: label, speed, size, traits [naam, uitleg]. Een setting kiest er een deel uit (allowed) en geeft per species
     een eigen kleurtekst (tolk). De speler leest de volledige regels in zijn PHB; dit is alleen een geheugensteun in de creator. */
  const STD = {
    Human: { label: "Human", speed: 30, size: "Medium of Small", traits: [["Resourceful", "Heroic Inspiration na elke Long Rest."], ["Skillful", "Proficiency in één extra skill naar keuze."], ["Versatile", "Een extra Origin Feat naar keuze."]] },
    Elf: { label: "Elf", speed: 30, size: "Medium", traits: [["Darkvision", "60 ft."], ["Fey Ancestry", "Advantage op saves tegen Charmed."], ["Keen Senses", "Proficiency in Insight, Perception of Survival."], ["Trance", "Geen slaap; 4 uur trance telt als Long Rest."]] },
    Dwarf: { label: "Dwarf", speed: 30, size: "Medium", traits: [["Darkvision", "120 ft."], ["Dwarven Resilience", "Resistance tegen Poison damage; Advantage op saves tegen Poisoned."], ["Dwarven Toughness", "+1 maximum HP per level (al verwerkt)."], ["Stonecunning", "Bonus Action: tremorsense 60 ft op steen (PB keer per Long Rest)."]] },
    Halfling: { label: "Halfling", speed: 30, size: "Small", traits: [["Brave", "Advantage op saves tegen Frightened."], ["Halfling Nimbleness", "Je mag door de ruimte van grotere wezens bewegen."], ["Luck", "Gooi een natural 1 op een d20 opnieuw (moet het nieuwe resultaat gebruiken)."], ["Naturally Stealthy", "Je kunt je verbergen achter een groter wezen."]] },
    Gnome: { label: "Gnome", speed: 30, size: "Small", traits: [["Darkvision", "60 ft."], ["Gnomish Cunning", "Advantage op Intelligence-, Wisdom- en Charisma-saves."], ["Gnomish Lineage", "Forest Gnome (Minor Illusion, Speak with Animals) of Rock Gnome (Mending, Prestidigitation)."]] },
    Dragonborn: { label: "Dragonborn", speed: 30, size: "Medium", traits: [["Draconic Ancestry", "Kies een draak; die bepaalt je damage type."], ["Breath Weapon", "Vervangt een aanval uit je Attack action; schade naar level; PB keer per Long Rest."], ["Damage Resistance", "Resistance tegen het damage type van je voorouder."], ["Darkvision", "60 ft."], ["Draconic Flight", "Vanaf level 5: Bonus Action, vleugels, 10 minuten vliegen (1x per Long Rest)."]] },
    Tiefling: { label: "Tiefling", speed: 30, size: "Medium of Small", traits: [["Darkvision", "60 ft."], ["Fiendish Legacy", "Kies Abyssal, Chthonic of Infernal: resistance, een cantrip en spells op level 3 en 5."], ["Otherworldly Presence", "Cantrip Thaumaturgy."]] },
    Orc: { label: "Orc", speed: 30, size: "Medium", traits: [["Adrenaline Rush", "Dash als Bonus Action en tijdelijke HP gelijk aan PB (PB keer per Short of Long Rest)."], ["Darkvision", "120 ft."], ["Relentless Endurance", "Zakt je naar 0 HP, dan val je terug op 1 HP (1x per Long Rest)."]] },
    Aasimar: { label: "Aasimar", speed: 30, size: "Medium of Small", traits: [["Celestial Resistance", "Resistance tegen Necrotic en Radiant damage."], ["Darkvision", "60 ft."], ["Healing Hands", "Magic action: genees HP gelijk aan PB d4's (1x per Long Rest)."], ["Light Bearer", "Cantrip Light."], ["Celestial Revelation", "Vanaf level 3: een kortdurende hemelse vorm (Heavenly Wings, Inner Radiance of Necrotic Shroud)."]] },
    Goliath: { label: "Goliath", speed: 35, size: "Medium", traits: [["Giant Ancestry", "Kies een reuzenerfenis (Cloud, Fire, Frost, Hill, Stone of Storm) met een eigen kleine kracht; PB keer per Long Rest."], ["Large Form", "Vanaf level 5: even Large worden (1x per Long Rest)."], ["Powerful Build", "Advantage om grappled te ontsnappen; je telt als een grootte groter voor dragen."]] }
  };
  const LINEAGE_STD = {
    "High Elf": "Cantrip Prestidigitation (INT, WIS of CHA); level 3: Detect Magic; level 5: Misty Step.",
    "Wood Elf": "Speed 35 ft; cantrip Druidcraft; level 3: Longstrider; level 5: Pass without Trace.",
    "Drow": "Darkvision 120 ft; cantrip Dancing Lights; level 3: Faerie Fire; level 5: Darkness."
  };
  const LANGS_STD = ["Dwarvish", "Elvish", "Halfling", "Orc", "Goblin", "Giant", "Draconic", "Gnomish", "Infernal", "Sylvan", "Common Sign Language"];

  /* o.species: { Naam: { tolk: "...", [eigen velden voor een nieuw species: label, speed, size, traits] } }; bestaat Naam in STD, dan worden de standaardvelden aangevuld. */
  function buildSpecies(map) {
    const out = {};
    Object.keys(map).forEach(function (k) {
      const base = STD[k] ? JSON.parse(JSON.stringify(STD[k])) : {};
      out[k] = Object.assign(base, map[k]);
      if (!out[k].label || !out[k].traits) throw new Error("species " + k + ": label en traits ontbreken");
    });
    return out;
  }

  function build(o) {
    const P = o.prompt || {}, C = o.creator || {}, K = o.canonParts || {};
    const prompt = {
      world: o.world,
      naming: P.naming || "Gebruik voor alle eigennamen (plaatsen, volken, personen, voorwerpen, titels) exact de schrijfwijze uit de campagnecanon en vertaal ze niet; verzin nieuwe namen in dezelfde stijl en gebruik ze daarna consequent. Dat geldt ook voor namen in worldDelta, location en newNpcs.",
      noOvershadow: P.noOvershadow || "Grote NPC's en wereldfiguren uit de canon overschaduwen de PC's niet.",
      bigFigure: P.bigFigure || "een ontmoeting met een belangrijke figuur uit de canon",
      geoCheck: P.geoCheck, exInGame: P.exInGame, exPlace: P.exPlace, exYear: String(o.exYear), exRegA: o.exRegA, exRegB: o.exRegB,
      lootTone: P.lootTone, lootNo: P.lootNo,
      bookFigures: P.bookFigures || "Voor figuren uit de canon: beschrijf zoals in de canon is vastgelegd.",
      idLegend: "FIG- vaste figuren uit de canon", noCreateFig: "Vaste figuren (FIG-) maak je niet aan", canonName: "een afwijking van de canon registreer je"
    };
    const creator = {
      magicWorld: C.magicWorld, intro: C.intro, langsTip: C.langsTip, bgNote: C.bgNote || "Kies wat geloofwaardig is in " + o.name + ".",
      spellTip: C.spellTip || "Beschrijf spells in de sfeer van " + o.name + " en bespreek twijfelgevallen met de DM.",
      magicTip: C.magicTip || "Magie vraagt DM-goedkeuring in " + o.name + "; denk aan een passende verklaring.",
      commonLang: C.commonLang || "Common",
      helperSys: C.helperSys || "Je bent een schrijfhulp voor een D&D 5e (2024)-personage in een campagne in " + o.world + ". Schrijf in het Nederlands, gebruik Engelse D&D-termen. Wees trouw aan de canon van de setting, maar met speelruimte; verzin geen spelregels. Wat de speler zelf heeft vastgesteld mag je niet veranderen; eigen aanvullingen markeer je met \"(voorstel)\".",
      species: buildSpecies(C.species), lineage: C.lineage || {}, langs: C.langs || LANGS_STD, inspiration: C.inspiration, speciesTip: C.speciesTip, aanleiding: C.aanleiding,
      classTolk: C.classTolk || {}
    };
    return {
      id: o.id, name: o.name, version: 1, blurb: o.blurb,
      world: { travel: o.travel || {}, anchors: [] },
      map: { enabled: false }, ui: { name: o.name },
      prompt: prompt,
      style: { base: o.style, portraitNote: o.portraitNote || "Follow the written description exactly; no famous actor likenesses.", locNote: o.locNote || "Follow the written description of the place.", avoid: AVOID },
      creator: creator,
      canonParts: { namingRule: K.namingRule || "eigennamen volgens de canon van de setting en consequent gebruikt.", tone: K.tone, settingRules: K.settingRules, premise: K.premise, canonNpcs: K.canonNpcs, consistent: K.consistent || "passend bij de wereld" },
      canon: o.canon
    };
  }

  /* gedeelde premisse/NPC-tekst voor settings met een bestaande wereld (canon als uitgangspunt) */
  function premiseCanon(name, extra) {
    return [
      "- Dit is een NIEUWE campagne in " + name + ". Beginpunt, premisse en dreiging staan nog open (tenzij de spelers een startsituatie hebben opgegeven in document P1): de DM kiest bij de openingsbeurt een startsituatie die past bij de backstories van de gekozen personages, schrijft die vast in de DM-bijbel (C1) en de Stand, en laat elke PC een geloofwaardige reden hebben om erbij te zijn." + (extra ? " " + extra : ""),
      "- De DM heeft volledige creatieve vrijheid over de overkoepelende campagne (dreiging, antagonisten, mysteries, facties, companions, sidequests) binnen deze afspraken. De hoofdplot draait niet exclusief om één PC; alle PCs worden gelijkwaardig geïntegreerd."
    ].join("\n");
  }
  function npcCanon(extra) {
    return [
      "- Vaste figuren uit de canon (S1) leven en handelen waar de chronologie het toelaat. Respecteer hun geschiedenis, karakter, relaties, vermogens, locatie en kennisgrenzen; geen voorkennis van latere gebeurtenissen. Grote figuren overschaduwen de PCs niet en lossen hun missie niet op; ze zijn niet altijd beschikbaar." + (extra ? " " + extra : ""),
      "- Onderscheid [C] expliciete canon, [I] interpretatie, [N] nieuwe campagne-inhoud. Canon is de baseline; leg elke door spelers veroorzaakte afwijking vast met datum, oorzaak en gevolgen. Originele NPC's vullen de tussenruimte."
    ].join("\n");
  }
  return { build: build, STD: STD, LINEAGE_STD: LINEAGE_STD, LANGS_STD: LANGS_STD, AVOID: AVOID, premiseCanon: premiseCanon, npcCanon: npcCanon };
});
