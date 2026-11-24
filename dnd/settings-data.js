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
  function list() { return Object.keys(SETTINGS).map(function (id) { return { id: id, name: SETTINGS[id].name, blurb: SETTINGS[id].blurb || "", custom: !!SETTINGS[id].custom }; }); }
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
  /* ---------- eigen settings (M4) ----------
     Ingebouwde settings zijn de bestanden settings-*.js; na het laden daarvan beveiligt lockBuiltins() hun id's.
     Eigen settings staan in Firebase (dnd/settings/{id}/json) en worden met registerCustom() toegevoegd of vervangen;
     een campagne bewaart bij het aanmaken een snapshot (campaigns/{cid}/setting) zodat latere aanpassingen haar niet raken. */
  let BUILTIN = {};
  function lockBuiltins() { BUILTIN = {}; Object.keys(SETTINGS).forEach(function (k) { BUILTIN[k] = true; }); }
  function isBuiltin(id) { return !!BUILTIN[id]; }
  function registerCustom(s) { if (!s || !s.id || BUILTIN[s.id]) return false; s.custom = true; SETTINGS[s.id] = s; return true; }
  function unregister(id) { if (BUILTIN[id]) return false; delete SETTINGS[id]; return true; }

  /* Controle van een (eigen) setting; geeft een lijst met meldingen (leeg = goed). Hetzelfde geldt voor een campagne-snapshot. */
  function validate(s) {
    const e = [], str = function (v, n, min) { return typeof v === "string" && v.trim().length >= (min || 1) && v.length <= (n || 4000); };
    const isO = function (o) { return o && typeof o === "object" && !Array.isArray(o); };
    if (!isO(s)) return ["Geen geldige setting."];
    if (!str(s.id, 40) || !/^[a-z0-9_-]+$/.test(s.id)) e.push("id: alleen kleine letters, cijfers, - en _ (max 40).");
    if (!str(s.name, 60)) e.push("naam ontbreekt of is te lang (max 60).");
    const P = s.prompt, C = s.creator, K = s.canonParts;
    if (!isO(P)) e.push("prompt ontbreekt"); else {
      ["world", "naming", "noOvershadow", "bigFigure", "geoCheck", "exInGame", "exPlace", "lootTone", "lootNo", "bookFigures", "idLegend", "noCreateFig", "canonName"].forEach(function (k) { if (!str(P[k], 3000)) e.push("prompt." + k + " ontbreekt of is te lang"); });
      if (!/^[0-9]{1,4}$/.test(String(P.exYear)) || Number(P.exYear) < 1) e.push("prompt.exYear moet een jaar 1 t/m 9999 zijn");
      ["exRegA", "exRegB"].forEach(function (k) { if (!/^REG-[A-Z]+$/.test(String(P[k]))) e.push("prompt." + k + " moet een REG-id zijn (REG- + hoofdletters, bv. REG-NOORD)"); });
    }
    if (!isO(s.style) || !str(s.style.base, 1500) || !str(s.style.avoid, 1500) || typeof s.style.portraitNote !== "string" || typeof s.style.locNote !== "string") e.push("style: base en avoid zijn verplicht, portraitNote en locNote moeten tekst zijn");
    if (s.world != null) {
      const T = s.world.travel; if (T != null) { if (!isO(T)) e.push("world.travel moet een object zijn"); else Object.keys(T).forEach(function (k) { if (!/^REG-[A-Z]+\|REG-[A-Z]+$/.test(k) || !(Number.isInteger(T[k]) && T[k] >= 0 && T[k] <= 400)) e.push("reistijd '" + k + "': formaat REG-A|REG-B = dagen (0 t/m 400)"); }); }
    }
    if (!isO(C)) e.push("creator ontbreekt"); else {
      ["magicWorld", "intro", "langsTip", "bgNote", "spellTip", "magicTip", "commonLang", "helperSys", "speciesTip", "aanleiding"].forEach(function (k) { if (!str(C[k], 3000)) e.push("creator." + k + " ontbreekt of is te lang"); });
      if (!isO(C.species) || !Object.keys(C.species).length) e.push("creator.species: minstens één species");
      else Object.keys(C.species).forEach(function (k) { const x = C.species[k]; if (!isO(x) || !str(x.label, 120) || !str(x.tolk, 600) || !(x.speed >= 5 && x.speed <= 120) || !str(x.size, 40) || !Array.isArray(x.traits) || !x.traits.length || !x.traits.every(function (t) { return Array.isArray(t) && t.length === 2 && str(t[0], 80) && str(t[1], 400); })) e.push("species " + k + ": label, tolk, speed (5-120), size en traits [[naam, uitleg], ...] zijn verplicht"); });
      if (!isO(C.lineage)) e.push("creator.lineage moet een object zijn (mag leeg)");
      if (!Array.isArray(C.langs) || C.langs.length < 2 || !C.langs.every(function (x) { return str(x, 60); })) e.push("creator.langs: minstens twee talen");
      if (!Array.isArray(C.inspiration) || !C.inspiration.length || !C.inspiration.every(function (x) { return str(x, 400); })) e.push("creator.inspiration: minstens één regel");
      if (!isO(C.classTolk)) e.push("creator.classTolk moet een object zijn (mag leeg)");
    }
    if (!isO(K)) e.push("canonParts ontbreekt"); else ["namingRule", "tone", "settingRules", "premise", "canonNpcs", "consistent"].forEach(function (k) { if (!str(K[k], 6000)) e.push("canonParts." + k + " ontbreekt of is te lang"); });
    if (s.canon != null) { if (!isO(s.canon)) e.push("canon moet een object met documenten zijn"); else Object.keys(s.canon).forEach(function (k) { const d = s.canon[k]; if (!/^[a-z0-9_]+$/.test(k) || !isO(d) || !str(d.title, 200) || !str(d.text, 60000)) e.push("canondocument '" + k + "': sleutel (a-z, 0-9, _), titel en tekst zijn verplicht"); }); }
    if (s.map && s.map.enabled !== false && s.map.maps) { const ML = typeof module === "object" && module.exports ? require("./map-lib.js") : (typeof self !== "undefined" ? self.DNDMapLib : null); if (ML) ML.validate(s.map).forEach(function (m) { e.push("kaart: " + m); }); }
    if (JSON.stringify(s).length > 250000) e.push("de setting is te groot (max 250 KB)");
    return e;
  }
  return { SETTINGS: SETTINGS, DEFAULT_ID: "middenaarde", resolve: resolve, get: function (id) { return resolve(SETTINGS[id]); }, register: register, list: list, canonDocs: canonDocs,
    lockBuiltins: lockBuiltins, isBuiltin: isBuiltin, registerCustom: registerCustom, unregister: unregister, validate: validate };
});
