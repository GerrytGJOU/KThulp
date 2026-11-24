/* Companion-/NPC-statblocks per regelset (voor tools/jobs.js en de tests).
   D&D 2024 (geen R.companion): {hp 5-200, ac 8-22, resources:{naam:{max 1-10, rest short|long}}, text} — ongewijzigd t.o.v. de oorspronkelijke jobs.js.
   Andere regelsets: R.companion = {noHp, hp:[min,max], ac:[min,max]|null, meters:[{k, label, max:[min,max], rest, zero, required}], focus, text}; zie settings-rulesets-other.js.
   Meters staan in world/companions/{id}.resources; "zero" betekent: een teller die van 0 omhoog loopt (wounds, strain, fatigue) en bij rust op 0 komt. */
"use strict";
const Rulesets = (() => { require("../settings-all.js"); return require("../settings-rulesets.js"); })();

function spec(R) { return R && R.companion ? R.companion : null; }

function instructions(cid, R) {
  const C = spec(R);
  if (!C) return null;
  const meters = (C.meters || []).map(m => m.k + " (" + m.label + ", max " + m.max[0] + "-" + m.max[1] + (m.zero ? ", teller vanaf 0" : "") + ", rest " + m.rest + (m.required ? ", verplicht" : "") + ")").join("; ");
  return "Maak een vereenvoudigd NPC-statblock voor " + R.label + " (NIET D&D: geen AC, Hit Dice of spell slots tenzij hieronder genoemd; zie canon r1_regelreferentie via node dnd/tools/claude-dm.js context " + cid + " --canon=r1_regelreferentie). " +
    "Vorm: JSON {" + (C.noHp ? "" : "hp (geheel getal " + C.hp[0] + "-" + C.hp[1] + "), ") + (C.ac ? "ac (geheel getal " + C.ac[0] + "-" + C.ac[1] + "), " : "") + "resources:{" + (C.meters || []).map(m => m.k + ":{max,rest}").join(", ") + "}, text:'markdown-statblock', notes}. " +
    (C.noHp ? "Dit systeem kent geen HP: laat hp weg. " : "") + "Meters: " + (meters || "geen") + ". " + C.focus + " Lees het NPC-record hieronder en eerdere verhaalfeiten; verzin geen geheimen over bestaande canonieke NPC's. Bewaar met submit-statblock; het blijft een voorstel (sheetStatus proposed).";
}

/* Geeft {er:[...], hp, noHp, ac, resources}. */
function validate(sb, R) {
  const er = [], C = spec(R), res = {};
  const text = typeof sb.text === "string" ? sb.text : "";
  if (!C) { /* D&D 2024, letterlijk de oorspronkelijke controle */
    if (!(Number.isInteger(sb.hp) && sb.hp >= 5 && sb.hp <= 200)) er.push("hp moet een geheel getal 5-200 zijn");
    if (!(Number.isInteger(sb.ac) && sb.ac >= 8 && sb.ac <= 22)) er.push("ac moet een geheel getal 8-22 zijn");
    Object.keys(sb.resources || {}).forEach(k => { const r = sb.resources[k]; if (!(r && Number.isInteger(r.max) && r.max >= 1 && r.max <= 10 && (r.rest === "short" || r.rest === "long"))) er.push("hulpbron " + k + ": {max 1-10, rest short|long}"); else res[k] = { cur: r.max, max: r.max, rest: r.rest }; });
    if (text.trim().length < 200) er.push("text (markdown-statblock) ontbreekt of is te kort");
    if (/spellcasting\s*:\s*(yes|ja)|\b(wizard|paladin)\b/i.test(text)) er.push("low-magic: geen Wizard/Paladin/spellcasting zonder goedkeuring");
    return { er, hp: sb.hp, noHp: false, ac: sb.ac, resources: res };
  }
  if (C.noHp) { if (sb.hp != null && sb.hp !== 0) er.push("dit systeem kent geen HP: laat hp weg"); }
  else if (!(Number.isInteger(sb.hp) && sb.hp >= C.hp[0] && sb.hp <= C.hp[1])) er.push("hp moet een geheel getal " + C.hp[0] + "-" + C.hp[1] + " zijn");
  if (C.ac) { if (!(Number.isInteger(sb.ac) && sb.ac >= C.ac[0] && sb.ac <= C.ac[1])) er.push("ac moet een geheel getal " + C.ac[0] + "-" + C.ac[1] + " zijn"); }
  else if (sb.ac != null) er.push("dit systeem kent geen AC: laat ac weg");
  const defs = {}; (C.meters || []).forEach(m => { defs[m.k] = m; });
  Object.keys(sb.resources || {}).forEach(k => {
    const d = defs[k], r = sb.resources[k];
    if (!d) { er.push("onbekende meter " + k + " (toegestaan: " + (Object.keys(defs).join(", ") || "geen") + ")"); return; }
    if (!(r && Number.isInteger(r.max) && r.max >= d.max[0] && r.max <= d.max[1])) { er.push("meter " + k + ": max " + d.max[0] + "-" + d.max[1]); return; }
    const rest = r.rest || d.rest; if (["short", "long", "none"].indexOf(rest) < 0) { er.push("meter " + k + ": rest short|long|none"); return; }
    res[k] = { cur: d.zero ? 0 : r.max, max: r.max, rest }; if (d.zero) res[k].zero = true;
  });
  (C.meters || []).forEach(m => { if (m.required && !res[m.k]) er.push("verplichte meter ontbreekt: " + m.k); });
  if (text.trim().length < 200) er.push("text (markdown-statblock) ontbreekt of is te kort");
  return { er, hp: C.noHp ? 0 : sb.hp, noHp: !!C.noHp, ac: C.ac ? sb.ac : null, resources: res };
}

/* De record dat in world/companions/{id} komt. */
function record(id, V, jobId) {
  const rec = { id, stage: "candidate", hp: { cur: V.hp, max: V.hp }, resources: V.resources, conditions: [], evidence: [], sheetStatus: "proposed", source: "job " + jobId };
  if (V.ac != null) rec.ac = V.ac;
  if (V.noHp) rec.noHp = true;
  return rec;
}
function summary(V) { return V.noHp ? Object.keys(V.resources).map(k => k + " " + V.resources[k].max).join(", ") || "geen meters" : "HP " + V.hp + (V.ac != null ? ", AC " + V.ac : ""); }
module.exports = { spec, instructions, validate, record, summary, Rulesets };
