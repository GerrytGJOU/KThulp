/* Settings voor de D&D-machine (dnd/). Een setting is een pakket dat de DM-prompt en (later) creator, kaart, beeldstijl en wereld bepaalt.
   M1: alleen de prompt-laag; "middenaarde" is de standaard en de terugval voor elke campagne zonder eigen setting, zodat de lopende campagne
   exact dezelfde prompt krijgt als voorheen. Eén bestand voor browser (window.DNDSettings) en Node. Geen geheimen: alleen publieke wereldtekst. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.DNDSettings = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  const SETTINGS = {
    middenaarde: {
      id: "middenaarde", name: "Midden-aarde", version: 1,
      /* wereldregels voor world.js (reistijden, canon-ankers): null = de ingebouwde Midden-aarde-waarden van world.js; zie World.configure */
      world: null,
      /* kaart: Midden-aarde heeft een eigen kaart (map-data.js); een setting zonder kaart verbergt de Kaart-tab en de kaartplaatsen in de DM-prompt */
      map: { enabled: true },
      /* korte omschrijving voor de keuze bij "nieuw verhaal" */
      blurb: "Tolkiens Midden-aarde tijdens de War of the Ring (3018). Met kaart, vaste NPC's en de lopende campagne.",
      ui: { name: "Midden-aarde" },
      style: {
        base: "Classic hand-drawn / painterly Tolkien-style tabletop RPG fantasy illustration: traditional details, visible ink outlines, atmospheric lighting, believable anatomy, historical materials.",
        portraitNote: "If this is a character from Tolkien's books, follow the written descriptions in the books, not the likeness of any film actor.",
        locNote: "If this is a place from Tolkien's books, follow the written descriptions in the books.",
        avoid: "Avoid: photorealism, cartoon or anime look, 3D game render, modern objects, text, captions, watermarks, logos, borders."
      },
      creator: {
        magicWorld: "magie in Midden-aarde",
        intro: "Dit is een nieuw personage in Midden-aarde (Third Age 3018): Tolkien met speelruimte, D&amp;D 2024 als regelsysteem. Geen vuurwapens, geen willekeurige magische voorwerpen.",
        "langsTip": "Je spreekt Common (Westron) plus twee Standard Languages naar keuze. Midden-aarde-vertaling: Dwarvish = Khuzdul/Zwergentaal, Elvish = Sindarin/Quenya, Orc = Zwarte Spraak (beperkt), Halfling = Hobbitish.",
        bgNote: "Kies wat geloofwaardig is in Midden-aarde 3018.",
        "species": {
          "Human": {
            "label": "Human",
            "speed": 30,
            "size": "Medium of Small",
            "tolk": "Dúnedain, Rohirrim, Gondorianen, Beornings, Mannen van Dale of Eriador.",
            "traits": [
              [
                "Resourceful",
                "Heroic Inspiration na elke Long Rest."
              ],
              [
                "Skillful",
                "Proficiency in één extra skill naar keuze."
              ],
              [
                "Versatile",
                "Een extra Origin Feat naar keuze."
              ]
            ]
          },
          "Elf": {
            "label": "Elf",
            "speed": 30,
            "size": "Medium",
            "tolk": "Noldor, Sindar of Silvan (Rivendell, Lórien, Mirkwood, de Grijze Havens).",
            "traits": [
              [
                "Darkvision",
                "60 ft."
              ],
              [
                "Fey Ancestry",
                "Advantage op saves tegen Charmed."
              ],
              [
                "Keen Senses",
                "Proficiency in Insight, Perception of Survival."
              ],
              [
                "Trance",
                "Geen slaap; 4 uur trance telt als Long Rest."
              ]
            ]
          },
          "Dwarf": {
            "label": "Dwarf",
            "speed": 30,
            "size": "Medium",
            "tolk": "Durins Volk (Erebor, IJzerheuvels, Blauwe Bergen); Khazad-dûm/Moria is verloren.",
            "traits": [
              [
                "Darkvision",
                "120 ft."
              ],
              [
                "Dwarven Resilience",
                "Resistance tegen Poison damage; Advantage op saves tegen Poisoned."
              ],
              [
                "Dwarven Toughness",
                "+1 maximum HP per level (al verwerkt)."
              ],
              [
                "Stonecunning",
                "Bonus Action: tremorsense 60 ft op steen (PB keer per Long Rest)."
              ]
            ]
          },
          "Halfling": {
            "label": "Hobbit (Halfling)",
            "speed": 30,
            "size": "Small",
            "tolk": "Hobbits van de Shire, Bree of de Vales van Anduin (Stoors, Harfoots, Fallohides).",
            "traits": [
              [
                "Brave",
                "Advantage op saves tegen Frightened."
              ],
              [
                "Halfling Nimbleness",
                "Je mag door de ruimte van grotere wezens bewegen."
              ],
              [
                "Luck",
                "Gooi een natural 1 op een d20 opnieuw (moet het nieuwe resultaat gebruiken)."
              ],
              [
                "Naturally Stealthy",
                "Je kunt je verbergen achter een groter wezen."
              ]
            ],
            "sheetLabel": "Halfling (Hobbit)"
          }
        },
        "lineage": {
          "High Elf": "Cantrip Prestidigitation (INT, WIS of CHA); level 3: Detect Magic; level 5: Misty Step. (Noldor/Sindar-achtig; magie = DM-check)",
          "Wood Elf": "Speed 35 ft; cantrip Druidcraft; level 3: Longstrider; level 5: Pass without Trace. (Silvan/Mirkwood-achtig)"
        },
        "langs": [
          "Dwarvish",
          "Elvish",
          "Halfling (Hobbitish)",
          "Orc",
          "Goblin",
          "Giant",
          "Draconic",
          "Gnomish",
          "Common Sign Language"
        ],
        "inspiration": [
          "A · Dúnedain-wachter — Human · Ranger/Fighter: zwervende beschermer van Eriador",
          "B · Elf met een lang verleden — Fighter/Ranger/Bard",
          "C · Dwarf op een persoonlijke missie — Fighter/Barbarian/Paladin",
          "D · Krijger uit Rohan of Gondor — Fighter/Paladin/Barbarian",
          "E · Zoeker naar verboden kennis — Wizard/Warlock/Sorcerer (vraagt DM-goedkeuring)",
          "F · Buitenstaander met een geheim — Human/Hobbit · Rogue/Bard/Monk"
        ],
        "speciesTip": "Standaard toegestaan: Human, Elf, Dwarf en Hobbit (Halfling-mechanieken). Andere species alleen als voorstel via de DM.",
        "aanleiding": "Aanleiding / startsituatie (bv. waarom ben je in Rivendell voor de Council?)",
        "classTolk": null,
        helperSys: "Je bent een schrijfhulp voor een D&D 5e (2024)-personage in een campagne in Midden-aarde (Tolkien, Third Age 3018, rond de Council of Elrond). Schrijf in het Nederlands, gebruik Engelse D&D-termen. Wees trouw aan Tolkien-canon, maar met speelruimte; geen vuurwapens, geen willekeurige magie. Verzin geen spelregels. Wat de speler zelf heeft vastgesteld mag je niet veranderen; eigen aanvullingen markeer je met \"(voorstel)\".",
        spellTip: "Beschrijf spells met een passende Tolkien-uitleg en bespreek twijfelgevallen met de DM.",
        magicTip: "Magie vraagt DM-goedkeuring; denk aan een Tolkien-passende verklaring.",
        commonLang: "Common (Westron)",
      },
      prompt: {
        "world": "Midden-aarde",
        "naming": "Gebruik voor alle Tolkien-namen (plaatsen, volken, personen, voorwerpen, titels) altijd de Engelse benaming uit het origineel, nooit een Nederlandse vertaling: the Shire (niet de Gouw), Rivendell, Bree, Mirkwood, the Misty Mountains, Hobbit, Dwarves, Elves, Wizard, Ranger, enzovoort. Dat geldt ook voor namen in worldDelta, location en newNpcs.",
        "noOvershadow": "Tolkien-personages overschaduwen de PC's niet.",
        "bigFigure": "een ontmoeting met een Tolkien-hoofdfiguur",
        "geoCheck": "Controleer geografie met Tolkiens kaart (Rivendell ligt in Eriador aan de westzijde van de Misty Mountains, ver van de Ered Luin).",
        "exInGame": "{\"inGame\":{\"date\":\"24 oktober 3018\",\"timeOfDay\":\"ochtend\",\"location\":\"Rivendell, Last Homely House\"},",
        "exPlace": "'Rivendell, de stallen'",
        "exYear": "3018",
        "exRegA": "REG-RIVENDELL",
        "exRegB": "REG-ERIADOR",
        "lootTone": "Tolkien (niet D&D-achtig)",
        "lootNo": "geen Ringen van Macht of unieke Tolkien-artefacten",
        "bookFigures": "Voor figuren uit Tolkiens boeken: beschrijf zoals in de boeken.",
        "idLegend": "TOL- Tolkien-figuren",
        "noCreateFig": "Tolkien-figuren (TOL-) maak je niet aan",
        "canonName": "een afwijking van de Tolkien-canon registreer je"
      }
    }
  };
  /* Vul ontbrekende promptvelden aan met de Midden-aarde-waarden zodat een half ingevulde setting de DM-prompt nooit met "undefined" vult. */
  function resolve(s) {
    const base = SETTINGS.middenaarde, out = Object.assign({}, base, s || {});
    ['prompt', 'ui', 'style', 'creator', 'map'].forEach(function (k) { out[k] = Object.assign({}, base[k], (s && s[k]) || {}); });
    return out;
  }
  /* Extra settings registreren zichzelf (settings-aldmark.js e.d.). Een onbekend id valt terug op Midden-aarde. */
  function register(s) { if (!s || !s.id) throw new Error("setting zonder id"); SETTINGS[s.id] = s; }
  function list() { return Object.keys(SETTINGS).map(function (id) { return { id: id, name: SETTINGS[id].name, blurb: SETTINGS[id].blurb || "" }; }); }
  function canonLib() { return typeof module === "object" && module.exports ? require("./settings-canon.js") : (typeof self !== "undefined" ? self : this).DNDSettingsCanon; }
  /* Canondocumenten voor een NIEUWE campagne van deze setting (a1, c1 en de eigen documenten van de setting). Midden-aarde heeft er geen:
     die gebruikt het sjabloon in Firebase (worldTemplateBijbel). Het regelreferentiedocument r1 komt uit dat sjabloon (setting-neutraal). */
  function canonDocs(id) {
    const st = SETTINGS[id]; if (!st || !st.canonParts) return null; const L = canonLib(), now = Date.now(), docs = {};
    docs.a1_spelregels_en_besluiten = { title: "A1 Spelregels en besluiten", text: L.a1(st.canonParts), t: now };
    docs.c1_dm_campagnebijbel_en_wereld = { title: "C1 DM Campagnebijbel en wereld (DM-geheim)", text: L.c1(), secret: true, t: now };
    Object.keys(st.canon || {}).forEach(function (k) { docs[k] = Object.assign({ t: now }, st.canon[k]); });
    return docs;
  }
  return { SETTINGS: SETTINGS, DEFAULT_ID: "middenaarde", resolve: resolve, get: function (id) { return resolve(SETTINGS[id]); }, register: register, list: list, canonDocs: canonDocs };
});
