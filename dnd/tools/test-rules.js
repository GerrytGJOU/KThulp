#!/usr/bin/env node
/* Test van de Realtime Database-regels voor dnd/ zonder emulator (die vraagt Java): een kleine simulator van de regeltaal
   (data, newData, root, auth, $-variabelen, .write-cascade, .validate in de geschreven deelboom) draait echte schrijfacties
   (de uitvoer van world.js commitPaths, ook de herstelgegevens van Terug) en bewust foute schrijfacties tegen de regels.
   Gebruik: node dnd/tools/test-rules.js [--rules=certamen/database.rules.proposed.json] [--dump=dnd-dump.json]
   Zonder --dump wordt /dnd (leesbaar voor jou) via de Firebase CLI opgehaald. Geen geheimen in dit bestand. */
"use strict";
const fs = require("fs"), path = require("path"), { spawnSync } = require("child_process");
const World = require("../world.js");
const flags = {}; process.argv.slice(2).forEach(a => { if (a.startsWith("--")) { const i = a.indexOf("="); flags[a.slice(2, i < 0 ? undefined : i)] = i < 0 ? true : a.slice(i + 1); } });
const rulesFile = typeof flags.rules === "string" ? flags.rules : path.join(__dirname, "..", "..", "certamen", "database.rules.proposed.json");
const RULES = JSON.parse(fs.readFileSync(rulesFile, "utf8")).rules;
const clone = o => JSON.parse(JSON.stringify(o));
const isObj = o => o && typeof o === "object" && !Array.isArray(o);

/* ---------- regeltaal ---------- */
/* strings krijgen de rules-methoden */
Object.defineProperties(String.prototype, {
  contains: { value: function (s) { return this.indexOf(s) >= 0; }, configurable: true, writable: true },
  beginsWith: { value: function (s) { return this.indexOf(s) === 0; }, configurable: true, writable: true },
  endsWith: { value: function (s) { return this.slice(-s.length) === s; }, configurable: true, writable: true },
  matches: { value: function (re) { return re.test(String(this)); }, configurable: true, writable: true }
});
function getAt(tree, p) { let c = tree; for (const k of p) { if (!isObj(c) && !Array.isArray(c)) return undefined; c = c[k]; if (c === undefined || c === null) return undefined; } return c; }
class Snap {
  constructor(tree, p) { this.tree = tree; this.p = p; }
  _v() { return getAt(this.tree, this.p); }
  child(x) { return new Snap(this.tree, this.p.concat(String(x).split("/").filter(Boolean))); }
  parent() { return new Snap(this.tree, this.p.slice(0, -1)); }
  val() { const v = this._v(); return v === undefined ? null : v; }
  exists() { return this._v() !== undefined; }
  hasChild(x) { return this.child(x).exists(); }
  hasChildren(l) { const v = this._v(); if (!isObj(v)) return false; return !l || l.every(k => v[k] !== undefined && v[k] !== null); }
  isString() { return typeof this._v() === "string"; }
  isNumber() { return typeof this._v() === "number"; }
  isBoolean() { return typeof this._v() === "boolean"; }
}
const compiled = new Map();
function evalRule(expr, vars, ctx) {
  if (typeof expr === "boolean") return expr;
  const names = Object.keys(vars);
  const key = expr + "|" + names.join(",");
  let fn = compiled.get(key);
  if (!fn) { fn = new Function("data", "newData", "root", "auth", "now", ...names, "return (" + expr + ");"); compiled.set(key, fn); }
  try { return !!fn(ctx.data, ctx.newData, ctx.root, ctx.auth, Date.now(), ...names.map(n => vars[n])); } catch (e) { throw new Error("regel kon niet worden geëvalueerd: " + expr.slice(0, 120) + " → " + e.message); }
}
function ruleChild(node, key) { if (node[key] && typeof node[key] === "object") return { n: node[key], vars: {} }; const w = Object.keys(node).find(k => k[0] === "$"); return w ? { n: node[w], vars: { [w]: key } } : null; }
function setIn(tree, p, v) { if (!p.length) return v; const t = isObj(tree) ? tree : {}; const out = Object.assign({}, t); const [h, ...r] = p; const nv = setIn(t[h], r, v); if (nv === null || nv === undefined) delete out[h]; else out[h] = nv; return Object.keys(out).length || !r.length ? out : undefined; }

/* controle van één schrijfactie (een multi-pad-update is een reeks paden die samen worden toegepast) */
function check(oldTree, update, auth) {
  let nt = clone(oldTree);
  Object.keys(update).forEach(p => { nt = setIn(nt, p.split("/").filter(Boolean), update[p] === undefined ? null : clone(update[p])) || {}; });
  const root = new Snap(oldTree, []);
  const problems = [];
  Object.keys(update).forEach(p => {
    const segs = p.split("/").filter(Boolean);
    let node = RULES, vars = {}, granted = false, ok = true;
    for (let i = 0; i <= segs.length; i++) {
      const ctx = { data: new Snap(oldTree, segs.slice(0, i)), newData: new Snap(nt, segs.slice(0, i)), root: root, auth: auth };
      if (node[".write"] !== undefined && !granted) { if (evalRule(node[".write"], vars, ctx)) granted = true; }
      if (i === segs.length) break;
      const c = ruleChild(node, segs[i]); if (!c) { ok = false; break; } node = c.n; vars = Object.assign({}, vars, c.vars);
    }
    if (!granted) { problems.push("schrijven niet toegestaan: " + p); return; }
    /* .validate in de geschreven deelboom */
    (function walk(n, vs, segsHere) {
      const nd = new Snap(nt, segsHere);
      if (!nd.exists()) return;
      const ctx = { data: new Snap(oldTree, segsHere), newData: nd, root: root, auth: auth };
      if (n[".validate"] !== undefined && !evalRule(n[".validate"], vs, ctx)) problems.push("validatie mislukt op " + segsHere.join("/"));
      const v = nd.val(); if (!isObj(v)) return;
      Object.keys(v).forEach(k => { const c = ruleChild(n, k); if (c) walk(c.n, Object.assign({}, vs, c.vars), segsHere.concat(k)); else if (n["$other"] === undefined) { /* geen regel: alleen toegestaan als er geen validatie is */ } });
    })(node, vars, segs);
  });
  return problems;
}

/* ---------- gegevens ---------- */
function loadDump() {
  if (typeof flags.dump === "string") return JSON.parse(fs.readFileSync(flags.dump, "utf8"));
  const r = spawnSync("firebase database:get /dnd --project kthulp-certamen", { shell: true, encoding: "utf8", maxBuffer: 1 << 28, env: { ...process.env, MSYS_NO_PATHCONV: "1" } });
  if (r.status !== 0) throw new Error("ophalen mislukt: " + r.stderr.slice(0, 200)); return JSON.parse(r.stdout);
}
const dump = loadDump();
const OK = { uid: "u-gerben", token: { email_verified: true, email: "x@example.com" } }, NOPE = { uid: "u-vreemde", token: { email_verified: false, email: "y@example.com" } };
const tree = { dndAccess: { "u-gerben": true }, dnd: clone(dump) };
let pass = 0, fail = 0;
const t = (name, fn) => { try { fn(); pass++; } catch (e) { fail++; console.log("FAIL:", name, "\n   ", e.message); } };
const allowed = (update, who, tr) => { const p = check(tr || tree, update, who || OK); if (p.length) throw new Error("had moeten slagen: " + p.join("; ")); };
const denied = (update, frag, who, tr) => { const p = check(tr || tree, update, who || OK); if (!p.length) throw new Error("had moeten falen"); if (frag && p.join(" ").indexOf(frag) < 0) throw new Error("verkeerde reden: " + p.join("; ")); };
const C = "c1", wb = "dnd/campaigns/" + C + "/world/";
const world = dump.campaigns[C].world, tpl = dump.worldTemplate;

/* ---------- toegang ---------- */
t("niet-toegestane gebruiker mag niets schrijven in dnd", () => { denied({ "dnd/campaigns/c1/turn/status": "waiting" }, "niet toegestaan", NOPE); denied({ "dnd/config/geminiModel": "x" }, "niet toegestaan", NOPE); });
t("speler schrijft gewone verhaaldata zoals voorheen", () => {
  allowed({ "dnd/campaigns/c1/messages/k1": { type: "action", text: "x" }, "dnd/campaigns/c1/turn": { round: 2, status: "waiting" }, "dnd/campaigns/c1/state": "{}", "dnd/campaigns/c1/canon/a1/text": "t", "dnd/campaignIndex/c1/round": 2, "dnd/npcs/aragorn/img": "data:x", "dnd/characters/wulfgrim/hp": 40, "dnd/config/dmMode": "gemini", "dnd/campaigns/c1/dmnotes/k": "v", "dnd/campaigns/c1/stands/r1/json": "{}" });
});
t("een heel verhaal verwijderen mag (savegame wissen)", () => allowed({ "dnd/campaigns/c1": null, "dnd/campaignIndex/c1": null }));
t("een heel verhaal overschrijven met nieuwe data mag niet", () => denied({ "dnd/campaigns/c1": { turn: {} } }, "niet toegestaan"));
t("worldTemplate is alleen-lezen voor de browser", () => denied({ "dnd/worldTemplate/world/calendar/d": 3 }, "niet toegestaan"));

/* ---------- world: aanmaken en beveiligen ---------- */
t("een nieuw verhaal krijgt het wereldsjabloon (hele world, alle records geldig)", () => allowed({ "dnd/campaigns/nieuw/world": tpl.world, "dnd/campaigns/nieuw/dmnotes": tpl.dmnotes, "dnd/campaigns/nieuw/turn": { round: 0, status: "claude" }, "dnd/campaignIndex/nieuw": { title: "x" } }));
t("het bestaande c1-register voldoet aan alle validatieregels (herschrijven van elk record)", () => { const up = {}; ["npcs", "quests", "clocks", "companions", "agendas", "backstories"].forEach(k => Object.keys(world[k] || {}).forEach(id => { up[wb + k + "/" + id] = world[k][id]; })); allowed(up); });
t("het hele register vervangen of verwijderen is verboden", () => { denied({ [wb.slice(0, -1)]: { calendar: world.calendar } }, "niet toegestaan"); denied({ [wb.slice(0, -1)]: null }, "niet toegestaan"); denied({ [wb + "npcs"]: null }, "niet toegestaan"); denied({ [wb + "quests"]: {} }, "niet toegestaan"); });
t("onbekende sleutels in world zijn verboden", () => denied({ [wb + "geheim"]: "x" }, "niet toegestaan"));
t("factions, locations en profiles zijn niet door de browser te wijzigen", () => { denied({ [wb + "factions/FAC-X"]: { id: "FAC-X", name: "x" } }, "niet toegestaan"); denied({ [wb + "profiles/NPC-E01"]: { text: "t", status: "proposed" } }, "niet toegestaan"); });
t("jobs: de browser mag alleen nieuwe wachtende jobs aanmaken", () => {
  allowed({ [wb + "jobs/JOB-PORT-NPC-E77"]: { id: "JOB-PORT-NPC-E77", type: "portrait", subject: "NPC-E77", status: "queued", attempts: 0 } });
  denied({ [wb + "jobs/JOB-PORT-NPC-E77"]: { id: "JOB-PORT-NPC-E77", type: "portrait", subject: "NPC-E77", status: "done" } }, "validatie");
  const j = Object.keys(world.jobs || {})[0]; if (j) { denied({ [wb + "jobs/" + j + "/status"]: "done" }, "niet toegestaan"); denied({ [wb + "jobs/" + j]: null }, "niet toegestaan"); }
});

/* ---------- world: waardebereiken ---------- */
t("klok buiten bereik, onbekende status en id-mismatch worden geweigerd", () => {
  denied({ [wb + "clocks/CLK-A"]: { id: "CLK-A", value: 9, max: 6 } }, "validatie"); denied({ [wb + "clocks/CLK-A"]: { id: "CLK-B", value: 1, max: 6 } }, "validatie");
  denied({ [wb + "quests/MAIN-A1/status"]: "kapot" }, "validatie"); denied({ [wb + "npcs/NPC-E01/status"]: "zombie" }, "validatie"); denied({ [wb + "npcs/NPC-E01/id"]: "NPC-E99" }, "validatie");
  denied({ [wb + "calendar"]: { y: 3018, m: 13, d: 1 } }, "validatie"); denied({ [wb + "sceneRegion"]: "ERIADOR" }, "validatie"); denied({ [wb + "lastRound"]: -1 }, "validatie");
});
t("companion: hp binnen grenzen en geldige stage", () => {
  const id = Object.keys(world.companions)[0], rec = clone(world.companions[id]);
  allowed({ [wb + "companions/" + id]: rec }); const bad = clone(rec); bad.hp.cur = bad.hp.max + 1; denied({ [wb + "companions/" + id]: bad }, "validatie");
  const bad2 = clone(rec); bad2.stage = "zweeft"; denied({ [wb + "companions/" + id]: bad2 }, "validatie");
});
t("agenda en achtergrond: structuur wordt afgedwongen", () => {
  const id = Object.keys(world.agendas)[0], a = clone(world.agendas[id]); a.status = "klaar"; denied({ [wb + "agendas/" + id]: a }, "validatie");
  const a2 = clone(world.agendas[id]); a2.stepIdx = 9; denied({ [wb + "agendas/" + id]: a2 }, "validatie");
  const b = Object.keys(world.backstories)[0]; const bs = clone(world.backstories[b]); delete bs.layers; denied({ [wb + "backstories/" + b]: bs }, "validatie");
});

/* ---------- echte beurten (world.js) en hun Terug ---------- */
function turn(wd, delta, round) {
  const v = World.validateDelta(wd, delta, { round: round }); if (!v.ok) throw new Error("testbeurt ongeldig: " + v.errors.join("; "));
  let n = 0; const c = World.commitPaths(wd, v.plan, { now: 1, region: delta.region, newKey: () => "T" + round + "_" + (++n) });
  const apply = {}; Object.keys(c.set).forEach(p => { apply["dnd/campaigns/" + C + "/" + p] = c.set[p]; });
  const undo = {}; c.prev.forEach(x => { undo["dnd/campaigns/" + C + "/" + x.p] = x.v; });
  return { apply: apply, undo: undo, c: c };
}
t("een echte beurt (tijd, regio, quest, klok, NPC, companion, agenda-tick) en zijn Terug worden toegestaan", () => {
  const w0 = clone(world); w0.sceneRegion = "REG-RIVENDELL"; w0.npcs["CMP-R01"].introduced = true; w0.npcs["CMP-R01"].status = "companion_candidate";
  const tr = clone(tree); tr.dnd.campaigns[C].world = w0;
  const t1 = turn(w0, { time: { to: { y: 3018, m: 11, d: 5 }, reason: "enkele dagen verstrijken", worldTick: true }, companions: [{ id: "CMP-R01", op: "recruit", mode: "permanent", reason: "Gedeeld belang voor de reis" }], quests: [{ id: "MAIN-A1", op: "update", set: { stage: 1 }, reason: "stap" }].slice(0, 0), clocks: [{ id: "CLK-A", delta: 1, reason: "Een koerier verdween" }], npcs: [{ id: "NPC-E90", op: "create", set: { name: "Passant", canon: "N", status: "named", location: "REG-RIVENDELL" } }] }, 1);
  allowed(t1.apply, OK, tr);
  const after = clone(tr); Object.keys(t1.apply).forEach(p => { after.dnd = setIn(after.dnd, p.replace(/^dnd\//, "").split("/"), clone(t1.apply[p])) || {}; });
  allowed(t1.undo, OK, after);
});
t("elke fase-4..7-schrijfactie uit world.js is toegestaan: reveals, agenda-ops, rust, vertrek en terugkeer", () => {
  let w0 = clone(world); w0.sceneRegion = "REG-RIVENDELL"; const upd = (w, v) => { const c = World.commitPaths(w, v.plan, { now: 1, newKey: (() => { let i = 0; return () => "K" + (++i) + Math.random().toString(36).slice(2, 6); })() }); const n = clone(w); Object.keys(c.set).forEach(p => { const segs = p.replace(/^world\//, "").split("/"); const o = setIn(n, segs, c.set[p]); Object.keys(n).forEach(k => delete n[k]); Object.assign(n, o); }); return { w: n, c: c }; };
  w0.npcs["CMP-R03"].introduced = true; w0.npcs["CMP-R03"].status = "companion_candidate";
  const steps = [
    { time: { to: { y: 3018, m: 10, d: 28 }, reason: "enkele dagen verstrijken", worldTick: true } },
    { companions: [{ id: "CMP-R03", op: "recruit", mode: "permanent", reason: "Gedeeld belang voor de reis" }] },
    { companions: [{ id: "CMP-R03", op: "update", hp: { delta: -3 }, evidence: "De PC's dekten haar bij de brug", conditions: { add: ["moe"] } }] },
    { companions: [{ id: "CMP-R03", op: "rest", kind: "long" }] },
    { agendas: [{ id: "AG-NET-1", op: "delay", days: 3, reason: "Slecht weer op de wegen" }] },
    { companions: [{ id: "CMP-R03", op: "depart", reason: "Een eigen verplichting roept haar", destination: "REG-RIVENDELL", returnIf: "ze is klaar" }] },
    { time: { to: { y: 3018, m: 11, d: 20 }, reason: "veel tijd verstrijkt", worldTick: true } }
  ];
  steps.forEach((d, i) => { const v = World.validateDelta(w0, d, { round: i + 1 }); if (!v.ok) throw new Error("stap " + (i + 1) + ": " + v.errors.join("; ")); const r = upd(w0, v); const apply = {}; Object.keys(r.c.set).forEach(p => { apply["dnd/campaigns/" + C + "/" + p] = r.c.set[p]; }); const tr = clone(tree); tr.dnd.campaigns[C].world = w0; allowed(apply, OK, tr); w0 = r.w; });
});

console.log(pass + " geslaagd, " + fail + " mislukt");
process.exit(fail ? 1 : 0);
