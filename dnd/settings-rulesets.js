/* Regelsets (spelsystemen) voor de DM-prompt. Een setting kiest er één via setting.ruleset (standaard "dnd2024").
   Elk veld is een stukje DM-prompttekst dat systemPrompt() in de kern invoegt; de rest van de prompt is regelset-onafhankelijk. */
(function (root, factory) { if (typeof module === "object" && module.exports) module.exports = factory(); else root.DNDRulesets = factory(); })(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  const sets = {};
  const API = {
    DEFAULT: "dnd2024",
    register(r) { if (!r || !r.id) throw new Error("ruleset zonder id"); sets[r.id] = r; return r; },
    get(id) { return sets[id] || sets[API.DEFAULT]; },
    list() { return Object.keys(sets).map(k => ({ id: k, name: sets[k].label })); },
    has(id) { return !!sets[id]; }
  };
  API.register({
    "id": "dnd2024",
    "label": "D&D 5e (2024)",
    "name": "D&D 5e (2024)",
    "terms": "Engelse 2024-spelregeltermen",
    "dice": "Spelers rollen zelf fysiek; hun worp staat in hun actie (\"[worp: ...]\"). Vraag een check via nextTurn.checks (naam → welke check en waarom); verklap DC's niet.\n- Voor worpen van NPC's/vijanden gebruik je UITSLUITEND de meegegeven voorgegooide dobbelstenen, in volgorde (d20 voor aanvallen/checks/saves, d6/d8/d10/d12 voor schade). Noem de worp kort in de vertelling.",
    "pcStats": "\"hp\":{\"current\":41,\"max\":41,\"temp\":0},\"resources\":{\"Hit Dice\":\"3d10\"},\"conditions\":[]",
    "lootPower": "Ongeveer één nieuw magisch voorwerp per personage per milestone (hoogstens drie per Act), tot +1 (vanaf level 9 een enkele keer +2), uncommon of rare",
    "rollEx": "{\"who\":\"Orc 1\",\"what\":\"Attack Roll\",\"natural\":14,\"mod\":5,\"total\":19,\"result\":\"Hit\"}; bij schade {\"who\",\"what\":\"Damage\",\"dice\":\"1d8+3\",\"total\":9}",
    "crit": "Verwerk een nat 20 of nat 1 als klein extra gevolg in de vertelling.",
    "playerRolls": "Spelerworpen komen binnen als \"[worp: Perception: 14 + 2 = 16]\": het totaal is al uitgerekend met het karakterblad, reken niet opnieuw. Vraag je om een check, benoem dan de skill of save duidelijk (bv. \"Perception\", \"Strength Saving Throw\").",
    "passive": "zijn passieve score (10 + modifier uit het karakterblad)"
  });
  return API;
});
