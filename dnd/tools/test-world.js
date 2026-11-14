#!/usr/bin/env node
/* Tests voor dnd/world.js (wereldmodel + consistentiecontrole). Draai: node dnd/tools/test-world.js */
"use strict";
const W = require("../world.js");
let pass = 0, fail = 0;
function t(name, fn) { try { fn(); pass++; } catch (e) { fail++; console.log("FAIL:", name, "\n   ", e.message); } }
const eq = (a, b, m) => { if (a !== b) throw new Error((m || "") + " verwacht " + JSON.stringify(b) + ", kreeg " + JSON.stringify(a)); };
const yes = (c, m) => { if (!c) throw new Error(m || "voorwaarde onwaar"); };
const bad = (r, frag) => { yes(!r.ok, "had een fout moeten geven"); yes(r.errors.join(" | ").toLowerCase().indexOf(frag.toLowerCase()) >= 0, "fout bevat niet '" + frag + "': " + r.errors.join(" | ")); };
const clone = o => JSON.parse(JSON.stringify(o));

function world() {
  return clone({
    calendar: { y: 3018, m: 10, d: 24 },
    locations: { "LOC-RIV": { id: "LOC-RIV", name: "Rivendell", region: "REG-RIVENDELL" }, "LOC-BREE": { id: "LOC-BREE", name: "Bree", region: "REG-ERIADOR" }, "LOC-E01": { id: "LOC-E01", name: "Huis van de Drie Elzen", region: "REG-ERIADOR" }, "LOC-MINAS": { id: "LOC-MINAS", name: "Minas Tirith", region: "REG-GONDOR" } },
    npcs: {
      "TOL-ELROND": { id: "TOL-ELROND", name: "Elrond", status: "recurring", canon: "C", tolkien: true, location: "LOC-RIV", locationSince: { y: 3018, m: 1, d: 1 } },
      "TOL-BOROMIR": { id: "TOL-BOROMIR", name: "Boromir", status: "named", canon: "C", tolkien: true, location: "LOC-RIV", locationSince: { y: 3018, m: 10, d: 24 } },
      "NPC-E01": { id: "NPC-E01", name: "Mara", status: "named", canon: "V", location: "LOC-E01", locationSince: { y: 3018, m: 10, d: 1 } },
      "CMP-R03": { id: "CMP-R03", name: "Brynja", status: "companion_candidate", canon: "V", location: "LOC-RIV", locationSince: { y: 3018, m: 10, d: 20 } },
      "NPC-D01": { id: "NPC-D01", name: "Oude veerman", status: "deceased", canon: "N", location: "LOC-BREE", locationSince: { y: 3018, m: 10, d: 2 } }
    },
    quests: {
      "SQ-01": { id: "SQ-01", title: "Het gebroken zegel", kind: "side", status: "available", region: "REG-ERIADOR", expires: { y: 3018, m: 11, d: 30 }, ifIgnored: "Een contactpunt schort verzendingen op", canon: "V", history: [] },
      "SQ-02": { id: "SQ-02", title: "De wintervoorraad", kind: "side", status: "completed", region: "REG-ERIADOR", open: true, canon: "V", history: [] },
      "SQ-03": { id: "SQ-03", title: "De onwillige veerman", kind: "side", status: "dormant", region: "REG-ERIADOR", expires: { y: 3018, m: 10, d: 28 }, ifIgnored: "Oversteek blijft beperkt", canon: "V", history: [] },
      "MAIN-A1": { id: "MAIN-A1", title: "De twee berichten", kind: "main", status: "active", region: "REG-RIVENDELL", open: true, canon: "B", history: [] }
    },
    clocks: { "CLK-A": { id: "CLK-A", value: 0, max: 6, label: "Verstoorde berichten" }, "CLK-C": { id: "CLK-C", value: 6, max: 6, label: "Orc-druk" } },
    factions: {}
  });
}
function applyPlan(w, plan) {
  w = clone(w);
  if (plan.calendar) w.calendar = plan.calendar;
  ["npcs", "quests", "clocks"].forEach(k => Object.assign(w[k], plan[k]));
  if (plan.divergences.length) { w.divergences = w.divergences || {}; plan.divergences.forEach((d, i) => { w.divergences["D" + Object.keys(w.divergences).length + i] = d; }); }
  return w;
}
const run = (w, d, ctx) => W.validateDelta(w, d, ctx || { round: 5 });

/* --- tijd --- */
t("tijd mag niet terug", () => bad(run(world(), { time: { to: { y: 3018, m: 10, d: 20 }, reason: "test" } }), "niet teruggaan"));
t("tijdsprong >21 dagen vereist worldTick", () => bad(run(world(), { time: { to: { y: 3018, m: 12, d: 1 }, reason: "weken reizen" } }), "worldTick"));
t("tijdsprong met worldTick en reden mag", () => yes(run(world(), { time: { to: { y: 3018, m: 12, d: 1 }, reason: "weken reizen", worldTick: true } }).ok));
t("tijd zonder reden bij sprong wordt geweigerd", () => bad(run(world(), { time: { to: { y: 3018, m: 10, d: 26 } } }), "time.reason"));
t("ongeldige datum", () => bad(run(world(), { time: { to: { y: 3018, m: 14, d: 1 }, reason: "x y z a b" } }), "geldige datum"));

/* --- NPC's --- */
t("overleden NPC kan niet terugkomen", () => bad(run(world(), { npcs: [{ id: "NPC-D01", op: "update", set: { location: "LOC-RIV" } }] }), "overleden"));
t("overleden NPC kan niet van status wisselen", () => bad(run(world(), { npcs: [{ id: "NPC-D01", op: "update", set: { status: "recurring" }, reason: "tot leven" }] }), "overleden"));
t("NPC kan niet teleporteren", () => bad(run(world(), { npcs: [{ id: "TOL-BOROMIR", op: "update", set: { location: "LOC-MINAS" } }] }), "kan niet in"));
t("NPC reist na genoeg tijd", () => {
  const w = world(), r = run(w, { time: { to: { y: 3018, m: 10, d: 28 }, reason: "enkele dagen verstreken" }, npcs: [{ id: "NPC-E01", op: "update", set: { location: "LOC-RIV" } }] });
  yes(r.ok, r.errors.join("|"));
});
t("NPC reist te snel (Mara net aangekomen in Eriador, wil direct naar Rivendell)", () => { const w = world(); w.npcs["NPC-E01"].locationSince = { y: 3018, m: 10, d: 24 }; bad(run(w, { npcs: [{ id: "NPC-E01", op: "update", set: { location: "LOC-RIV" } }] }), "kan niet in"); });
t("NPC die al weken ter plaatse is mag wel vertrekken", () => yes(run(world(), { npcs: [{ id: "NPC-E01", op: "update", set: { location: "LOC-RIV" } }] }).ok));
t("onbekende locatie", () => bad(run(world(), { npcs: [{ id: "NPC-E01", op: "update", set: { location: "LOC-NERGENS" } }] }), "onbekende locatie"));
t("NPC create vereist naam en canon", () => bad(run(world(), { npcs: [{ id: "NPC-E10", op: "create", set: { name: "Tavin" } }] }), "canon"));
t("NPC create dubbele naam", () => bad(run(world(), { npcs: [{ id: "NPC-E10", op: "create", set: { name: "mara", canon: "N" } }] }), "bestaat al"));
t("NPC create bestaat al (idempotent: tweede keer faalt)", () => {
  const d = { npcs: [{ id: "NPC-E10", op: "create", set: { name: "Tavin", canon: "N", location: "LOC-BREE" } }] };
  const r1 = run(world(), d); yes(r1.ok, r1.errors.join("|"));
  bad(run(applyPlan(world(), r1.plan), d), "bestaat al");
});
t("Tolkien-figuur niet aanmaken", () => bad(run(world(), { npcs: [{ id: "TOL-X", op: "create", set: { name: "Nieuwe Tolkien", canon: "C", tolkien: true } }] }), "tolkien"));
t("ongeldig id-formaat", () => bad(run(world(), { npcs: [{ id: "mara", op: "update", set: {} }] }), "formaat"));
t("promotie terug is verboden", () => bad(run(world(), { npcs: [{ id: "CMP-R03", op: "update", set: { status: "named" } }] }), "terug"));
t("promotie overslaan vereist reason", () => bad(run(world(), { npcs: [{ id: "NPC-E01", op: "update", set: { status: "recruited" } }] }), "reason"));
t("recruteren vanuit candidate mag", () => yes(run(world(), { npcs: [{ id: "CMP-R03", op: "update", set: { status: "recruited" }, reason: "De PCs hebben haar voorwaarden vervuld" }] }).ok));
t("overlijden vereist reason", () => bad(run(world(), { npcs: [{ id: "NPC-E01", op: "update", set: { status: "deceased" } }] }), "reason"));

/* --- quests --- */
t("voltooide quest kan niet opnieuw starten", () => bad(run(world(), { quests: [{ id: "SQ-02", op: "update", set: { status: "active" }, reason: "opnieuw beginnen" }] }), "niet toegestaan"));
t("statuswijziging vereist reason", () => bad(run(world(), { quests: [{ id: "MAIN-A1", op: "update", set: { status: "completed" } }] }), "reason"));
t("actieve quest voltooien mag", () => yes(run(world(), { quests: [{ id: "MAIN-A1", op: "update", set: { status: "completed" }, reason: "Beide berichten zijn verklaard" }] }).ok));
t("verlopen quest kan niet starten", () => bad(run(world(), { time: { to: { y: 3018, m: 10, d: 30 }, reason: "zes dagen later" }, quests: [{ id: "SQ-03", op: "update", set: { status: "active" }, reason: "Toch maar gaan" }] }), "verlopen"));
t("quests verlopen automatisch bij tijdsverloop", () => {
  const r = run(world(), { time: { to: { y: 3018, m: 12, d: 5 }, reason: "weken verstreken", worldTick: true } });
  yes(r.ok, r.errors.join("|")); eq(r.plan.quests["SQ-01"].status, "expired"); yes(r.warnings.length > 0, "waarschuwing verwacht");
});
t("nieuwe quest vereist velden", () => bad(run(world(), { quests: [{ id: "DQ-0001", op: "create", set: { title: "Vreemd geluid" } }] }), "ontbreekt"));
t("nieuwe quest met dubbele titel", () => bad(run(world(), { quests: [{ id: "DQ-0001", op: "create", set: { title: "Het gebroken zegel", hook: "h", region: "REG-ERIADOR", ifIgnored: "x", open: true, canon: "N" } }] }), "bestaat al"));
t("nieuwe quest geldig", () => yes(run(world(), { quests: [{ id: "DQ-0001", op: "create", set: { title: "De verdwenen reiziger", hook: "Een reiziger kwam niet aan in Bree", region: "REG-ERIADOR", ifIgnored: "De familie zoekt zelf", expires: { y: 3018, m: 11, d: 15 }, canon: "N", npcs: ["NPC-E01"] } }] }).ok));
t("nieuwe quest met onbekende NPC", () => bad(run(world(), { quests: [{ id: "DQ-0002", op: "create", set: { title: "X quest", hook: "h", region: "REG-ERIADOR", ifIgnored: "x", open: true, canon: "N", npcs: ["NPC-ONBEKEND"] } }] }), "onbekende npc"));
t("changed vereist bestaande changedTo", () => bad(run(world(), { quests: [{ id: "MAIN-A1", op: "update", set: { status: "changed", changedTo: "DQ-9999" }, reason: "Het plan veranderde" }] }), "changedTo"));

/* --- klokken --- */
t("klok boven maximum", () => bad(run(world(), { clocks: [{ id: "CLK-C", delta: 1, reason: "Orc-successen" }] }), "buiten"));
t("klok delta te groot", () => bad(run(world(), { clocks: [{ id: "CLK-A", delta: 3, reason: "grote onderschepping" }] }), "delta"));
t("klok zonder reden", () => bad(run(world(), { clocks: [{ id: "CLK-A", delta: 1 }] }), "reason"));
t("klok geldig + event", () => { const r = run(world(), { clocks: [{ id: "CLK-A", delta: 1, reason: "Koerier onderschept bij Bree" }] }); yes(r.ok); eq(r.plan.clocks["CLK-A"].value, 1); yes(r.plan.events.length === 1); });
t("onbekende klok", () => bad(run(world(), { clocks: [{ id: "CLK-Z", delta: 1, reason: "test test" }] }), "bestaat niet"));

/* --- canon --- */
t("Fellowship na 25 dec niet in Rivendell", () => {
  const w = world(); w.npcs["TOL-BOROMIR"].location = "LOC-BREE"; w.calendar = { y: 3019, m: 1, d: 1 };
  bad(run(w, { npcs: [{ id: "TOL-BOROMIR", op: "update", set: { location: "LOC-RIV", note: "terug" } }], time: { to: { y: 3019, m: 1, d: 12 }, reason: "elf dagen later", worldTick: false } }), "canon-afwijking");
});
t("afwijking vereist cause", () => bad(run(world(), { events: [{ type: "divergence", summary: "Boromir overleeft", divergence: true }] }), "cause"));
t("event met onbekende NPC", () => bad(run(world(), { events: [{ type: "note", summary: "Iets gebeurt", refs: { npcs: ["NPC-X9"] } }] }), "onbekende"));

/* --- opslag en terugdraaien --- */
function setPath(o, path, val) { const parts = path.split("/"); let cur = o; parts.slice(0, -1).forEach(k => { cur[k] = cur[k] || {}; cur = cur[k]; }); if (val === null) delete cur[parts[parts.length - 1]]; else cur[parts[parts.length - 1]] = val; }
t("commitPaths + terugdraaien herstelt de wereld exact", () => {
  const w0 = world(); let n = 0;
  const r = run(w0, { time: { to: { y: 3018, m: 10, d: 26 }, reason: "twee dagen verstrijken" }, npcs: [{ id: "NPC-E10", op: "create", set: { name: "Passant", canon: "N", location: "LOC-BREE" } }, { id: "NPC-E01", op: "update", set: { note: "wacht" } }], quests: [{ id: "MAIN-A1", op: "update", set: { status: "completed" }, reason: "afgerond na het onderzoek" }], clocks: [{ id: "CLK-A", delta: 2, reason: "twee koeriers verdwenen" }], events: [{ type: "note", summary: "Iets noemenswaardigs" }] });
  yes(r.ok, r.errors.join("|"));
  const cm = W.commitPaths(w0, r.plan, { now: 1, region: "REG-ERIADOR", newKey: () => "K" + (++n) });
  const w1 = clone(w0); Object.keys(cm.set).forEach(p => setPath(w1, p.replace(/^world\//, ""), cm.set[p]));
  eq(w1.clocks["CLK-A"].value, 2); eq(w1.quests["MAIN-A1"].status, "completed"); eq(w1.sceneRegion, "REG-ERIADOR"); yes(w1.npcs["NPC-E10"] && Object.keys(w1.events).length >= 4, "events/NPC ontbreken");
  const w2 = clone(w1); cm.prev.forEach(x => setPath(w2, x.p.replace(/^world\//, ""), x.v));
  eq(JSON.stringify(sortDeep(prune(w2))), JSON.stringify(sortDeep(prune(w0))), "wereld na undo");
});
function prune(x) { if (Array.isArray(x)) return x.map(prune); if (x && typeof x === "object") { const r = {}; Object.keys(x).forEach(k => { const v = prune(x[k]); if (!(v && typeof v === "object" && !Array.isArray(v) && Object.keys(v).length === 0)) r[k] = v; }); return r; } return x; }
function sortDeep(x) { return Array.isArray(x) ? x.map(sortDeep) : (x && typeof x === "object") ? Object.keys(x).sort().reduce((r, k) => (r[k] = sortDeep(x[k]), r), {}) : x; }

/* --- audit van een hele wereld --- */
t("auditWorld vindt dode verwijzingen en verlopen quests", () => {
  const w = world(); w.quests["SQ-01"].npcs = ["NPC-ONBEKEND"]; w.calendar = { y: 3019, m: 1, d: 5 }; w.npcs["NPC-E01"].location = "LOC-NERGENS"; w.clocks["CLK-A"].value = 9;
  const msgs = W.auditWorld(w).map(i => i.kind + ":" + i.id + ":" + i.msg).join(" | ");
  ["onbekende NPC", "verlopen", "onbekende locatie", "buiten bereik"].forEach(f => yes(msgs.indexOf(f) >= 0, "audit mist '" + f + "': " + msgs));
});
t("auditWorld geeft geen fouten op een geldige wereld", () => yes(W.auditWorld(world()).filter(i => i.level === "fout").length === 0, JSON.stringify(W.auditWorld(world()))));

/* --- context --- */
t("wereldcontext toont overledenen en blijft kort", () => {
  const c = W.worldContext(world(), { hay: "mara praat over het zegel", region: "REG-ERIADOR", maxChars: 1500 });
  yes(c.indexOf("Oude veerman") >= 0 && c.indexOf("Mara") >= 0, "context mist overledene of Mara: " + c); yes(c.length <= 1500);
});

const NPC_PICK = ["ambient", "named", "recurring", "companion_candidate", "recruited", "inactive", "departed", "deceased"];
t("de context blijft begrensd bij honderden NPC's en quests (hervatten na honderden beurten)", () => {
  const w = world();
  for (let i = 0; i < 600; i++) w.npcs["NPC-X" + (1000 + i)] = { id: "NPC-X" + (1000 + i), name: "Figurant " + i, status: i % 3 ? "named" : "recurring", canon: "N", location: "LOC-BREE" };
  for (let i = 0; i < 400; i++) w.quests["DQ-" + (1000 + i)] = { id: "DQ-" + (1000 + i), title: "Quest " + i, kind: "dynamic", status: i % 2 ? "available" : "completed", region: "REG-ERIADOR", open: true, canon: "N", history: [] };
  const c = W.worldContext(w, { hay: "figurant 12 en quest 7", region: "REG-ERIADOR", maxChars: 4500 });
  yes(c.length <= 4500, "context te lang: " + c.length); yes(c.indexOf("Datum:") === 0, "datum ontbreekt");
});
/* --- lange simulatie met willekeurige geldige/ongeldige wijzigingen (zaaiwaarde vast) --- */
t("simulatie van 400 beurten behoudt de invarianten", () => {
  let seed = 12345; const rnd = () => (seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296;
  let w = world(), applied = 0, rejected = 0;
  const ids = () => Object.keys(w.npcs), qids = () => Object.keys(w.quests);
  const dead = new Set(["NPC-D01"]), terminal = new Set(["SQ-02"]);
  for (let i = 0; i < 400; i++) {
    const delta = {};
    if (rnd() < 0.3) { const dd = Math.floor(rnd() * 8); const base = W.dateOk(w.calendar) ? w.calendar : { y: 3018, m: 10, d: 24 }; const nd = new Date(Date.UTC(base.y, base.m - 1, base.d + dd)); delta.time = { to: { y: nd.getUTCFullYear(), m: nd.getUTCMonth() + 1, d: nd.getUTCDate() }, reason: "tijd verstrijkt", worldTick: true }; }
    const k = Math.floor(rnd() * 5);
    const id = ids()[Math.floor(rnd() * ids().length)], q = qids()[Math.floor(rnd() * qids().length)];
    if (k === 0) delta.npcs = [{ id: id, op: "update", set: { location: ["LOC-RIV", "LOC-BREE", "LOC-E01", "LOC-MINAS"][Math.floor(rnd() * 4)] } }];
    if (k === 1) delta.npcs = [{ id: id, op: "update", set: { status: NPC_PICK[Math.floor(rnd() * NPC_PICK.length)] }, reason: "willekeurige test" }];
    if (k === 2) delta.quests = [{ id: q, op: "update", set: { status: W.QUEST_STATUS[Math.floor(rnd() * W.QUEST_STATUS.length)], changedTo: "MAIN-A1" }, reason: "willekeurige test" }];
    if (k === 3) delta.clocks = [{ id: "CLK-A", delta: rnd() < 0.5 ? 1 : -1, reason: "willekeurige test" }];
    if (k === 4) delta.npcs = [{ id: "NPC-N" + (1000 + i), op: "create", set: { name: "Passant " + i, canon: "N", location: "LOC-BREE" } }];
    const r = W.validateDelta(w, delta, { round: i });
    if (r.ok) { w = applyPlan(w, r.plan); applied++; Object.values(w.npcs).forEach(n => { if (n.status === "deceased") dead.add(n.id); }); Object.values(w.quests).forEach(x => { if (["completed", "failed", "expired", "changed"].indexOf(x.status) >= 0) terminal.add(x.id); }); }
    else rejected++;
    dead.forEach(d => yes(w.npcs[d].status === "deceased", d + " is teruggekomen"));
    terminal.forEach(x => yes(["completed", "failed", "expired", "changed"].indexOf(w.quests[x].status) >= 0, x + " werd heropend"));
    Object.values(w.clocks).forEach(c => yes(c.value >= 0 && c.value <= (c.max || 6), "klok buiten bereik"));
  }
  yes(applied > 50 && rejected > 50, "te weinig variatie: " + applied + "/" + rejected);
});

console.log(pass + " geslaagd, " + fail + " mislukt");
process.exit(fail ? 1 : 0);
