/* Bouwt dnd/settings-ruleref.js uit de regeldossiers in dnd/tools/dossiers/: het regelreferentiedocument (R1) van elke regelset.
   Gebruik: node dnd/tools/build-ruleref.js   (na elke wijziging aan een dossier). Sectie 12 (voorbeeldblad) en Bronnen vallen eruit. */
"use strict";
const fs = require("fs"), path = require("path");
const DIR = path.join(__dirname, "dossiers"), OUT = path.join(__dirname, "..", "settings-ruleref.js");
const MAP = { dg: "delta-green", coc: "call-of-cthulhu", cda: "cthulhu-dark-ages", ose: "old-school-essentials", sw: "star-wars-rpg", avatar: "avatar-legends", ww: "wands-and-wizards" };
const out = {};
Object.keys(MAP).forEach(id => {
  const f = path.join(DIR, MAP[id] + "-regeldossier.md"); if (!fs.existsSync(f)) return;
  const txt = fs.readFileSync(f, "utf8").replace(/\r/g, ""), parts = txt.split(/^## /m), head = parts.shift().trim().split("\n");
  const keep = parts.filter(p => !/^(Bronnen|12\.)/.test(p));
  const title = head[0].replace(/^#\s*/, "");
  out[id] = ("# R1 Regelreferentie — " + title.replace(/ — regeldossier$/, "") + "\n(" + (head.find(l => /^Versie/.test(l)) || "").replace(/^Versie [\d.]+ — /, "") + ")\n\n" + keep.map(p => "## " + p.trim()).join("\n\n")).replace(/\n{3,}/g, "\n\n").trim();
});
const js = "/* GEGENEREERD door dnd/tools/build-ruleref.js uit dnd/tools/dossiers/*.md — niet met de hand wijzigen. Zet het regelreferentiedocument (R1) op elke regelset. */\n(function (root) {\n  \"use strict\";\n  const RS = typeof module === \"object\" && module.exports ? require(\"./settings-rulesets.js\") : root.DNDRulesets;\n  const REF = " + JSON.stringify(out, null, 1) + ";\n  Object.keys(REF).forEach(function (k) { if (RS.has(k)) RS.get(k).ref = REF[k]; });\n})(typeof self !== \"undefined\" ? self : this);\n";
fs.writeFileSync(OUT, js);
console.log("geschreven:", Object.keys(out).map(k => k + " (" + out[k].length + ")").join(", "));
