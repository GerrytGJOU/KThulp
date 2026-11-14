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
  if (plan.companions) w.companions = Object.assign({}, w.companions || {}, plan.companions);
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
  yes(w2.jobs && w2.jobs["JOB-PORT-NPC-E10"], "jobs blijven bewust bestaan na Terug"); delete w2.jobs;
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

/* ---------- companion-engine ---------- */
function cworld() {
  const w = world();
  w.sceneRegion = "REG-RIVENDELL";
  w.npcs["CMP-R03"].introduced = true;
  w.npcs["CMP-R01"] = { id: "CMP-R01", name: "Lírien", status: "companion_candidate", canon: "V", introduced: true, location: "LOC-RIV", locationSince: { y: 3018, m: 10, d: 20 } };
  w.npcs["CMP-R08"] = { id: "CMP-R08", name: "Tobin", status: "named", canon: "V", introduced: false, location: "LOC-RIV", locationSince: { y: 3018, m: 10, d: 20 } };
  const rec = (id, hp, res) => ({ id: id, stage: "candidate", hp: { cur: hp, max: hp }, resources: res || {}, conditions: [], evidence: [] });
  w.companions = { "CMP-R03": rec("CMP-R03", 33, { "Second Wind": { cur: 1, max: 1, rest: "short" }, "Shield Interpose": { cur: 2, max: 2, rest: "short" } }), "CMP-R01": rec("CMP-R01", 24, { "Field Dressing": { cur: 3, max: 3, rest: "long" } }), "CMP-R08": rec("CMP-R08", 22) };
  return w;
}
function apply2(w, plan) { const n = applyPlan(w, plan); n.companions = Object.assign({}, w.companions, plan.companions || {}); return n; }
const rec3 = { id: "CMP-R03", op: "recruit", mode: "permanent", reason: "Gedeeld belang: de weg naar het noorden bewaken" };
t("recruteren via npcs-route is verboden (gebruik companions)", () => bad(run(cworld(), { npcs: [{ id: "CMP-R03", op: "update", set: { status: "recruited" }, reason: "De PCs hebben haar voorwaarden vervuld" }] }), "companions op"));
t("companion recruteren: status, hp, locatie", () => {
  const r = run(cworld(), { companions: [rec3] }); yes(r.ok, r.errors.join("|"));
  eq(r.plan.npcs["CMP-R03"].status, "recruited"); eq(r.plan.companions["CMP-R03"].stage, "active"); eq(r.plan.companions["CMP-R03"].hp.cur, 33);
  yes(r.plan.events.some(e => e.type === "companion_recruited"));
});
t("recruteren vereist introductie", () => {
  const w = cworld(); w.npcs["CMP-R08"].status = "companion_candidate";
  bad(run(w, { companions: [{ id: "CMP-R08", op: "recruit", mode: "etappe", reason: "Hij wil mee voor de reis" }] }), "voorgesteld");
});
t("recruteren vereist companion_candidate", () => { const w = cworld(); w.npcs["CMP-R03"].status = "named"; bad(run(w, { companions: [rec3] }), "companion_candidate"); });
t("recruteren vereist reason en geldige mode", () => {
  bad(run(cworld(), { companions: [{ id: "CMP-R03", op: "recruit", mode: "permanent" }] }), "reason");
  bad(run(cworld(), { companions: [{ id: "CMP-R03", op: "recruit", mode: "vast", reason: "Gedeeld belang genoeg" }] }), "mode");
});
t("kandidaat elders is niet recruteerbaar", () => { const w = cworld(); w.sceneRegion = "REG-ERIADOR"; bad(run(w, { companions: [rec3] }), "niet bij de party"); });
t("remote ally mag elders blijven", () => { const w = cworld(); w.sceneRegion = "REG-ERIADOR"; yes(run(w, { companions: [Object.assign({}, rec3, { mode: "remote" })] }).ok); });
t("companion zonder record kan niet meedoen", () => { const w = cworld(); delete w.companions["CMP-R03"]; bad(run(w, { companions: [rec3] }), "statblock"); });
t("weigeren en pas later opnieuw vragen", () => {
  let w = cworld(); const d = run(w, { companions: [{ id: "CMP-R03", op: "decline", reason: "Haar familie heeft haar nodig", retryAfter: { y: 3018, m: 11, d: 10 } }] }); yes(d.ok, d.errors.join("|"));
  w = apply2(w, d.plan); bad(run(w, { companions: [rec3] }), "pas weer na");
  w.calendar = { y: 3018, m: 11, d: 11 }; yes(run(w, { companions: [rec3] }).ok);
});
t("party boven de richtwaarde geeft een waarschuwing", () => {
  let cur = cworld();
  ["CMP-R01", "CMP-R03"].forEach(id => { const r = run(cur, { companions: [{ id: id, op: "recruit", mode: "permanent", reason: "Gedeeld belang voor de reis" }] }); yes(r.ok, r.errors.join("|")); cur = apply2(cur, r.plan); });
  ["CMP-R08", "CMP-R04"].forEach(id => { if (!cur.npcs[id]) { cur.npcs[id] = { id: id, name: "Extra " + id, status: "companion_candidate", canon: "V", introduced: true, location: "LOC-RIV", locationSince: { y: 3018, m: 10, d: 20 } }; cur.companions[id] = { id: id, stage: "candidate", hp: { cur: 20, max: 20 }, resources: {}, conditions: [], evidence: [] }; } cur.npcs[id].status = "companion_candidate"; cur.npcs[id].introduced = true; });
  { const r1 = run(cur, { companions: [{ id: "CMP-R08", op: "recruit", mode: "permanent", reason: "Hij kan sloten openen" }] }); yes(r1.ok && r1.warnings.join(" ").toLowerCase().indexOf("reizigers") < 0, "5 reizigers is nog binnen de richtwaarde"); cur = apply2(cur, r1.plan); }
  const r = run(cur, { companions: [{ id: "CMP-R04", op: "recruit", mode: "permanent", reason: "Hij kan ook goed schieten" }] }); yes(r.ok);
  yes(r.warnings.join(" ").toLowerCase().indexOf("reizigers") >= 0, "geen party-waarschuwing: " + r.warnings.join("|"));
});
function active3() { let w = cworld(); const r = run(w, { companions: [rec3] }); w = apply2(w, r.plan); return w; }
t("hp- en hulpbronbeheer met grenzen", () => {
  const w = active3();
  const a = run(w, { companions: [{ id: "CMP-R03", op: "update", hp: { delta: -10 }, resources: { "Second Wind": { delta: -1 } } }] }); yes(a.ok, a.errors.join("|")); eq(a.plan.companions["CMP-R03"].hp.cur, 23); eq(a.plan.companions["CMP-R03"].resources["Second Wind"].cur, 0);
  bad(run(w, { companions: [{ id: "CMP-R03", op: "update", hp: { delta: -34 } }] }), "buiten 0-33");
  bad(run(w, { companions: [{ id: "CMP-R03", op: "update", hp: { delta: 1 } }] }), "buiten 0-33");
  bad(run(w, { companions: [{ id: "CMP-R03", op: "update", resources: { "Second Wind": { delta: -2 } } }] }), "buiten 0-1");
  bad(run(w, { companions: [{ id: "CMP-R03", op: "update", resources: { Spreuk: { cur: 1 } } }] }), "onbekende hulpbron");
});
t("0 HP is geen dood; dood vereist een npcs-status met reden", () => {
  let w = active3(); const r = run(w, { companions: [{ id: "CMP-R03", op: "update", hp: { cur: 0 } }] }); yes(r.ok && r.warnings.join(" ").indexOf("0 HP") >= 0); w = apply2(w, r.plan); eq(w.npcs["CMP-R03"].status, "recruited");
  bad(run(w, { npcs: [{ id: "CMP-R03", op: "update", set: { status: "deceased" } }] }), "reason");
  const d = run(w, { npcs: [{ id: "CMP-R03", op: "update", set: { status: "deceased" }, reason: "Gevallen bij de doorwaadbare plaats" }] }); yes(d.ok, d.errors.join("|")); eq(d.plan.companions["CMP-R03"].stage, "deceased");
});
t("overleden companion kan nergens meer aan meedoen", () => {
  let w = active3(); const d = run(w, { npcs: [{ id: "CMP-R03", op: "update", set: { status: "deceased" }, reason: "Gevallen bij de doorwaadbare plaats" }] }); w = apply2(w, d.plan);
  bad(run(w, { companions: [{ id: "CMP-R03", op: "update", hp: { cur: 5 } }] }), "overleden");
  bad(run(w, { companions: [{ id: "CMP-R03", op: "return", reason: "Hij komt toch terug" }] }), "overleden");
});
t("rust herstelt hulpbronnen en hp", () => {
  let w = active3(); w = apply2(w, run(w, { companions: [{ id: "CMP-R03", op: "update", hp: { cur: 5 }, resources: { "Second Wind": { cur: 0 }, "Shield Interpose": { cur: 0 } }, conditions: { add: ["poisoned"] } }] }).plan);
  const s = run(w, { companions: [{ id: "CMP-R03", op: "rest", kind: "short" }] }); eq(s.plan.companions["CMP-R03"].hp.cur, 5); eq(s.plan.companions["CMP-R03"].resources["Second Wind"].cur, 1); yes(s.plan.companions["CMP-R03"].conditions.indexOf("poisoned") >= 0);
  const l = run(w, { companions: [{ id: "CMP-R03", op: "rest", kind: "long" }] }); eq(l.plan.companions["CMP-R03"].hp.cur, 33); eq(l.plan.companions["CMP-R03"].conditions.length, 0);
  bad(run(w, { companions: [{ id: "CMP-R03", op: "rest", kind: "lang" }] }), "short of long");
});
t("bewijslogboek: concrete ervaringen, geen meter", () => {
  const w = active3(); const r = run(w, { companions: [{ id: "CMP-R03", op: "update", evidence: "De PCs hielden hun belofte bij de brug" }] }); yes(r.ok); eq(r.plan.companions["CMP-R03"].evidence.length, 1);
  bad(run(w, { companions: [{ id: "CMP-R03", op: "update", evidence: "ok" }] }), "concrete");
  yes(!("loyalty" in r.plan.companions["CMP-R03"]), "er mag geen cijfer-meter zijn");
});
t("vertrek: reden, bestemming, voorwaarden; npc wordt departed", () => {
  const w = active3();
  bad(run(w, { companions: [{ id: "CMP-R03", op: "depart" }] }), "reason");
  bad(run(w, { companions: [{ id: "CMP-R03", op: "depart", reason: "Familieplicht roept haar", destination: "REG-NERGENS" }] }), "bestemming");
  const r = run(w, { companions: [{ id: "CMP-R03", op: "depart", reason: "Familieplicht roept haar", destination: "REG-ERIADOR", returnIf: "haar clan is veilig", expectedReturn: { y: 3018, m: 12, d: 1 } }] }); yes(r.ok, r.errors.join("|"));
  eq(r.plan.npcs["CMP-R03"].status, "departed"); eq(r.plan.companions["CMP-R03"].stage, "departed"); eq(r.plan.npcs["CMP-R03"].location, "REG-ERIADOR");
  bad(run(w, { npcs: [{ id: "CMP-R03", op: "update", set: { status: "departed" }, reason: "ze gaat weg" }] }), "companions op");
});
t("terugkeer: reistijd, status en history", () => {
  let w = active3(); w.calendar = { y: 3018, m: 10, d: 25 }; w = apply2(w, run(w, { companions: [{ id: "CMP-R03", op: "depart", reason: "Familieplicht roept haar", destination: "REG-ERIADOR" }] }).plan);
  bad(run(w, { companions: [{ id: "CMP-R03", op: "return", reason: "Ze is er zo weer" }] }), "kan niet in 0 dag");
  w.calendar = { y: 3018, m: 10, d: 29 };
  const r = run(w, { companions: [{ id: "CMP-R03", op: "return", reason: "Haar clan is veilig, ze komt terug" }] }); yes(r.ok, r.errors.join("|"));
  eq(r.plan.npcs["CMP-R03"].status, "recruited"); eq(r.plan.companions["CMP-R03"].stage, "active"); eq(r.plan.companions["CMP-R03"].history.length, 1); eq(r.plan.companions["CMP-R03"].departure, null);
  bad(run(active3(), { companions: [{ id: "CMP-R03", op: "return", reason: "Ze was niet weg" }] }), "na een vertrek");
});
t("vertrokken companion: geen combatstatus wijzigen", () => {
  let w = active3(); w = apply2(w, run(w, { companions: [{ id: "CMP-R03", op: "depart", reason: "Familieplicht roept haar", destination: "REG-ERIADOR" }] }).plan);
  bad(run(w, { companions: [{ id: "CMP-R03", op: "update", hp: { cur: 5 } }] }), "vertrokken");
  yes(run(w, { companions: [{ id: "CMP-R03", op: "update", evidence: "Stuurde een bericht via een koerier" }] }).ok);
});
t("autonomie: verplichting en verwachte terugkeer komen in de context", () => {
  let w = active3(); w = apply2(w, run(w, { companions: [{ id: "CMP-R03", op: "update", obligation: { text: "Terug naar de familiehal voor het winterfeest", due: { y: 3018, m: 11, d: 5 } }, nextAction: "wil de brug bewaken" }] }).plan);
  w.calendar = { y: 3018, m: 11, d: 6 };
  const ctx = W.worldContext(w, { hay: "", maxChars: 4000 });
  yes(ctx.indexOf("Companions:") >= 0 && ctx.indexOf("HP 33/33") >= 0 && ctx.indexOf("Aan de orde") >= 0 && ctx.indexOf("winterfeest") >= 0, ctx);
  const r = run(w, { time: { to: { y: 3018, m: 11, d: 8 }, reason: "de reis duurt voort" } }); yes(r.ok && r.warnings.join(" ").indexOf("aan de orde") >= 0, r.warnings.join("|"));
});
t("audit: companion-consistentie", () => {
  const w = active3(); eq(W.auditWorld(w).filter(i => i.level === "fout").length, 0, "schone wereld");
  const a = clone(w); a.companions["CMP-R03"].hp.cur = 99; yes(W.auditWorld(a).some(i => /hp/.test(i.msg)));
  const b = clone(w); b.npcs["CMP-R03"].status = "departed"; yes(W.auditWorld(b).some(i => /past niet/.test(i.msg)));
  const c = clone(w); delete c.companions["CMP-R03"]; yes(W.auditWorld(c).some(i => /geen companion-record/.test(i.msg)));
});
t("commitPaths: companions met herstelgegevens (undo-roundtrip)", () => {
  const w = cworld(); const r = run(w, { companions: [rec3] }); let n = 0; const c = W.commitPaths(w, r.plan, { newKey: () => "k" + (n++), now: 1 });
  yes(c.set["world/companions/CMP-R03"] && c.set["world/npcs/CMP-R03"]);
  const p = c.prev.find(x => x.p === "world/companions/CMP-R03"); eq(p.v.stage, "candidate");
});
t("simulatie: 300 beurten met companions: invarianten blijven waar", () => {
  let seed = 7; const rnd = () => (seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296;
  let w = cworld(); w.npcs["CMP-R08"].status = "companion_candidate"; w.npcs["CMP-R08"].introduced = true;
  const ids = ["CMP-R01", "CMP-R03", "CMP-R08"], dead = new Set(); let ok = 0, no = 0;
  for (let i = 0; i < 300; i++) {
    const id = ids[Math.floor(rnd() * 3)], k = Math.floor(rnd() * 8), d = {};
    if (rnd() < 0.2) { const b = w.calendar, nd = new Date(Date.UTC(b.y, b.m - 1, b.d + Math.floor(rnd() * 6))); d.time = { to: { y: nd.getUTCFullYear(), m: nd.getUTCMonth() + 1, d: nd.getUTCDate() }, reason: "tijd verstrijkt", worldTick: true }; }
    if (k === 0) d.companions = [{ id: id, op: "recruit", mode: ["permanent", "etappe", "remote"][Math.floor(rnd() * 3)], reason: "Gedeeld belang in de simulatie" }];
    if (k === 1) d.companions = [{ id: id, op: "depart", reason: "Eigen verplichting in de simulatie", destination: ["REG-ERIADOR", "REG-MISTY"][Math.floor(rnd() * 2)] }];
    if (k === 2) d.companions = [{ id: id, op: "return", reason: "Terug na de verplichting" }];
    if (k === 3) d.companions = [{ id: id, op: "update", hp: { delta: Math.floor(rnd() * 20) - 12 } }];
    if (k === 4) d.companions = [{ id: id, op: "rest", kind: rnd() < 0.5 ? "short" : "long" }];
    if (k === 5) d.companions = [{ id: id, op: "decline", reason: "Niet nu, de simulatie weigert", retryAfter: { y: 3018, m: 11, d: 1 } }];
    if (k === 6 && rnd() < 0.15) d.npcs = [{ id: id, op: "update", set: { status: "deceased" }, reason: "Gesneuveld in de simulatie" }];
    if (k === 7) d.region = ["REG-RIVENDELL", "REG-ERIADOR"][Math.floor(rnd() * 2)];
    const r = W.validateDelta(w, d, { round: i });
    if (r.ok) { ok++; w = apply2(w, r.plan); if (d.region) w.sceneRegion = d.region; } else no++;
    Object.values(w.npcs).forEach(n => { if (n.status === "deceased") dead.add(n.id); });
    dead.forEach(x => { yes(w.npcs[x].status === "deceased", x + " keerde terug"); if (w.companions[x]) eq(w.companions[x].stage, "deceased"); });
    const errs = W.auditWorld(w).filter(x => x.level === "fout" && x.kind === "companion"); yes(errs.length === 0, "audit beurt " + i + ": " + JSON.stringify(errs));
  }
  yes(ok > 40 && no > 40, "te weinig variatie " + ok + "/" + no);
});

/* ---------- job-wachtrij ---------- */
const mk = (id, name, status, extra) => Object.assign({ id: id, name: name, status: status, canon: "V", location: "LOC-BREE", locationSince: { y: 3018, m: 10, d: 20 } }, extra || {});
t("NPC aanmaken als named zet portret- en profielJob klaar", () => {
  const r = run(world(), { npcs: [{ id: "NPC-E20", op: "create", set: { name: "Sella", canon: "N", status: "named", location: "LOC-BREE" } }] }); yes(r.ok, r.errors.join("|"));
  eq(Object.keys(r.plan.jobs).sort().join(","), "JOB-PORT-NPC-E20,JOB-PROF-NPC-E20"); eq(r.plan.jobs["JOB-PORT-NPC-E20"].status, "queued"); eq(r.plan.jobs["JOB-PORT-NPC-E20"].required, false);
  yes(r.plan.events.some(e => e.type === "job_queued"));
});
t("ambient: geen jobs; promotie naar named: wel", () => {
  let w = world(); const a = run(w, { npcs: [{ id: "NPC-E21", op: "create", set: { name: "Marktkraamster", canon: "N", status: "ambient" } }] }); yes(a.ok); eq(Object.keys(a.plan.jobs).length, 0);
  w = applyPlan(w, a.plan); const b = run(w, { npcs: [{ id: "NPC-E21", op: "update", set: { status: "named" }, reason: "De PCs vroegen naar haar naam" }] }); yes(b.ok, b.errors.join("|")); eq(Object.keys(b.plan.jobs).length, 2);
});
t("bestaand portret: alleen profielJob", () => {
  const r = run(world(), { npcs: [{ id: "NPC-E22", op: "create", set: { name: "Tavin", canon: "N", status: "named" } }] }, { round: 5, hasPortrait: n => n.name === "Tavin" }); yes(r.ok);
  eq(Object.keys(r.plan.jobs).join(","), "JOB-PROF-NPC-E22");
});
t("Tolkien en overleden NPC's krijgen geen jobs; update zonder statuswijziging ook niet", () => {
  const r = run(world(), { npcs: [{ id: "NPC-E01", op: "update", set: { goal: "voedsel verdelen" } }] }); yes(r.ok); eq(Object.keys(r.plan.jobs).length, 0);
});
t("companion_candidate zonder statblock zet een verplichte statblock-job klaar (en blokkeert recruit)", () => {
  let w = world(); w.sceneRegion = "REG-ERIADOR"; w.npcs["NPC-E01"].status = "recurring";
  const r = run(w, { npcs: [{ id: "NPC-E01", op: "update", set: { status: "companion_candidate", introduced: true }, reason: "Mara wil mee en de PCs vertrouwen haar" }] }); yes(r.ok, r.errors.join("|"));
  const j = r.plan.jobs["JOB-STAT-NPC-E01"]; yes(j && j.required === true && j.type === "statblock");
  w = applyPlan(w, r.plan); w.jobs = Object.assign({}, w.jobs, r.plan.jobs);
  bad(run(w, { companions: [{ id: "NPC-E01", op: "recruit", mode: "etappe", reason: "Gedeeld belang in de regio" }] }), "statblock-job JOB-STAT-NPC-E01 staat queued");
});
t("idempotent: bestaande job wordt niet nogmaals aangemaakt", () => {
  const w = world(); w.jobs = { "JOB-PROF-NPC-E23": { id: "JOB-PROF-NPC-E23", type: "profile", subject: "NPC-E23", status: "done", result: { notes: "klaar" }, attempts: 1 } };
  const r = run(w, { npcs: [{ id: "NPC-E23", op: "create", set: { name: "Oren", canon: "N", status: "named" } }] }); eq(Object.keys(r.plan.jobs).join(","), "JOB-PORT-NPC-E23");
});
t("de DM mag geen jobs meegeven", () => bad(run(world(), { jobs: [{ id: "JOB-X" }] }), "jobs worden door de app beheerd"));
t("job-levenscyclus: claim, lease, afronden, pogingen, verboden overgangen", () => {
  const j0 = { id: "JOB-PORT-NPC-E20", type: "portrait", subject: "NPC-E20", status: "queued", attempts: 0 };
  eq(W.jobTransition(j0, "done", { result: { notes: "klaar" } }, 1).ok, false);
  eq(W.jobTransition(j0, "claimed", {}, 1).ok, false);
  const c = W.jobTransition(j0, "claimed", { by: "runner-1", leaseUntil: 100 }, 10); yes(c.ok); eq(c.job.attempts, 1); eq(c.job.leaseUntil, 100);
  bad2(W.jobTransition(c.job, "done", { result: {} }, 11), "result.notes");
  const d = W.jobTransition(c.job, "done", { result: { notes: "portret opgeslagen" } }, 12); yes(d.ok); eq(d.job.leaseUntil, undefined);
  bad2(W.jobTransition(d.job, "queued", {}, 13), "niet toegestaan");
  const f = W.jobTransition(c.job, "failed", { reason: "ChatGPT gaf een afwijkend gezicht" }, 12); yes(f.ok); const q = W.jobTransition(f.job, "queued", {}, 13); yes(q.ok);
  let j = q.job; j.attempts = 3; bad2(W.jobTransition(j, "claimed", { by: "x" }, 14), "pogingen");
});
function bad2(r, frag) { yes(!r.ok && r.error.indexOf(frag) >= 0, "verwacht fout met '" + frag + "', kreeg " + JSON.stringify(r)); }
t("pendingJobs: volgorde, verlopen lease, wees- en ambient-jobs", () => {
  const w = world(); w.npcs["NPC-E20"] = mk("NPC-E20", "A", "named"); w.npcs["NPC-E21"] = mk("NPC-E21", "B", "named"); w.npcs["NPC-E22"] = mk("NPC-E22", "C", "ambient");
  w.jobs = {
    "JOB-PORT-NPC-E20": { id: "JOB-PORT-NPC-E20", type: "portrait", subject: "NPC-E20", status: "queued", attempts: 0, required: false, createdRound: 1 },
    "JOB-STAT-NPC-E21": { id: "JOB-STAT-NPC-E21", type: "statblock", subject: "NPC-E21", status: "queued", attempts: 0, required: true, createdRound: 9 },
    "JOB-PORT-NPC-E21": { id: "JOB-PORT-NPC-E21", type: "portrait", subject: "NPC-E21", status: "claimed", claimedBy: "x", leaseUntil: 50, attempts: 1, createdRound: 2 },
    "JOB-PORT-NPC-E22": { id: "JOB-PORT-NPC-E22", type: "portrait", subject: "NPC-E22", status: "queued", attempts: 0, createdRound: 1 },
    "JOB-PORT-NPC-E99": { id: "JOB-PORT-NPC-E99", type: "portrait", subject: "NPC-E99", status: "queued", attempts: 0, createdRound: 1 }
  };
  eq(W.pendingJobs(w, { nowMs: 40 }).map(j => j.id).join(","), "JOB-STAT-NPC-E21,JOB-PORT-NPC-E20");
  eq(W.pendingJobs(w, { nowMs: 60 }).map(j => j.id).join(","), "JOB-STAT-NPC-E21,JOB-PORT-NPC-E20,JOB-PORT-NPC-E21");
  eq(W.pendingJobs(w, { nowMs: 60, types: ["portrait"] }).length, 2);
});
t("audit: jobs", () => {
  const w = world(); w.jobs = { "JOB-PROF-NPC-E01": { id: "JOB-PROF-NPC-E01", type: "profile", subject: "NPC-E01", status: "done", attempts: 1 }, "JOB-X": { id: "JOB-X", type: "foto", subject: "NPC-E01", status: "queued" } };
  const a = W.auditWorld(w).filter(i => i.kind === "job"); yes(a.some(i => /zonder resultaat/.test(i.msg)) && a.some(i => /onbekend type/.test(i.msg)));
});

/* ---------- factie-agenda's en acties buiten beeld ---------- */
function aworld() {
  const w = world();
  w.factions = { "FAC-SILENT-NET": { id: "FAC-SILENT-NET", name: "Het Stille Net" }, "FAC-LOCAL": { id: "FAC-LOCAL", name: "Lokale gemeenschappen" } };
  w.npcs["NPC-E02"] = { id: "NPC-E02", name: "Oren", status: "named", canon: "V", location: "REG-ERIADOR", locationSince: { y: 3018, m: 10, d: 24 } };
  w.clocks["CLK-B"] = { id: "CLK-B", value: 0, max: 6, label: "Vertrouwen" };
  w.quests["SQ-06"] = { id: "SQ-06", title: "Het spoor van de terugtocht", kind: "side", status: "dormant", region: "REG-ERIADOR", open: true, ifIgnored: "Herinneringen vervagen", canon: "V", history: [] };
  w.quests["SQ-05"] = { id: "SQ-05", title: "De stille wachttoren", kind: "side", status: "dormant", region: "REG-ERIADOR", open: true, ifIgnored: "Waarschuwingen komen te laat", canon: "V", history: [] };
  w.agendas = {
    "AG-NET-1": { id: "AG-NET-1", owner: "FAC-SILENT-NET", title: "Het Stille Net verstoort de berichten", status: "active", canon: "V", stepIdx: 0, nextAt: { y: 3018, m: 11, d: 3 }, history: [], ifUnopposed: "Verzendingen vallen stil", thwartedBy: ["SQ-06"],
      steps: [
        { text: "Een koerier wordt onderschept", afterDays: 10, clock: [{ id: "CLK-A", delta: 1 }] },
        { text: "Een tweede cel zaait wantrouwen", afterDays: 14, clock: [{ id: "CLK-A", delta: 1 }], quest: { id: "SQ-05", to: "available" } },
        { text: "Het contactpunt valt uit", afterDays: 21, clock: [{ id: "CLK-A", delta: 2 }] }] },
    "AG-ORE-1": { id: "AG-ORE-1", owner: "NPC-E02", title: "Oren brengt zijn bericht naar Rivendell", status: "active", canon: "V", stepIdx: 0, nextAt: { y: 3018, m: 10, d: 27 }, history: [], steps: [{ text: "Oren bereikt Rivendell met een verkeerd begrepen bericht", afterDays: 3, moves: [{ id: "NPC-E02", to: "REG-RIVENDELL" }] }] }
  };
  return w;
}
const adv = (w, plan) => { const n = apply2(w, plan); n.agendas = Object.assign({}, w.agendas, plan.agendas || {}); n.events = n.events || {}; (plan.events || []).forEach((e, i) => { n.events["E" + Object.keys(n.events).length + i] = Object.assign({ t: Object.keys(n.events).length }, e); }); if (plan.calendar) n.calendar = plan.calendar; return n; };
const tickTo = (w, y, m, d, ctx) => run(w, { time: { to: { y: y, m: m, d: d }, reason: "de dagen verstrijken", worldTick: true } }, ctx);
t("geen tijdsprong, geen tick", () => { const r = run(aworld(), { clocks: [] }); eq(Object.keys(r.plan.agendas).length, 0); eq(r.plan.events.length, 0); });
t("tick voert alleen stappen uit die aan de beurt zijn", () => {
  const r = tickTo(aworld(), 3018, 10, 30); yes(r.ok, r.errors.join("|"));
  const a = r.plan.agendas["AG-ORE-1"]; eq(a.status, "completed"); eq(r.plan.npcs["NPC-E02"].location, "REG-RIVENDELL");
  yes(!r.plan.agendas["AG-NET-1"], "net-agenda hoort nog niet aan de beurt te zijn");
  const ev = r.plan.events.filter(e => e.type === "offscreen"); eq(ev.length, 1); eq(ev[0].visibility, "dm_only"); eq(ev[0].ingame.d, 27);
});
t("reistijd wordt gerespecteerd: Oren is te vroeg", () => {
  const w = aworld(); w.npcs["NPC-E02"].locationSince = { y: 3018, m: 10, d: 26 };
  const r = tickTo(w, 3018, 10, 30); yes(r.ok); yes(!r.plan.npcs["NPC-E02"] || r.plan.npcs["NPC-E02"].location !== "REG-RIVENDELL"); yes(r.warnings.join(" ").indexOf("kan niet in") >= 0, r.warnings.join("|"));
});
t("inhalen: meerdere stappen in één sprong, klokken binnen de grenzen", () => {
  const r = tickTo(aworld(), 3018, 12, 20); yes(r.ok, r.errors.join("|"));
  const a = r.plan.agendas["AG-NET-1"]; eq(a.status, "completed"); eq(a.stepIdx, 3); eq(r.plan.clocks["CLK-A"].value, 4);
  eq(r.plan.quests["SQ-05"].status, "available"); eq(r.plan.events.filter(e => e.agenda === "AG-NET-1" && e.type === "offscreen").length, 3);
  eq(r.plan.events.filter(e => e.ingame && e.agenda === "AG-NET-1" && e.type === "offscreen").map(e => e.ingame.m + "-" + e.ingame.d).join(","), "11-3,11-17,12-8");
});
t("klok loopt nooit over de grens", () => {
  const w = aworld(); w.clocks["CLK-A"].value = 5; const r = tickTo(w, 3018, 12, 20); yes(r.ok); eq(r.plan.clocks["CLK-A"].value, 6); yes(r.warnings.join(" ").indexOf("begrensd") >= 0);
});
t("spelers dwarsbomen een agenda door de aanleiding op te lossen", () => {
  const w = aworld(); w.quests["SQ-06"].status = "completed";
  const r = tickTo(w, 3018, 12, 20); eq(r.plan.agendas["AG-NET-1"].status, "thwarted"); yes(!r.plan.clocks["CLK-A"]); yes(r.plan.events.some(e => e.type === "agenda_thwarted" && /anders: Verzendingen/.test(e.summary)));
});
t("holdIfActive: de agenda wacht zolang de spelers ermee bezig zijn", () => {
  const w = aworld(); w.agendas["AG-NET-1"].holdIfActive = ["MAIN-A1"]; const r = tickTo(w, 3018, 11, 5); yes(r.ok);
  eq(r.plan.agendas["AG-NET-1"].stepIdx, 0); yes(W.dateCmp(r.plan.agendas["AG-NET-1"].nextAt, { y: 3018, m: 11, d: 5 }) > 0);
  yes(!r.plan.clocks["CLK-A"]);
});
t("requires: stap wordt overgeslagen als de voorwaarde niet klopt", () => {
  const w = aworld(); w.agendas["AG-NET-1"].steps[0].requires = { id: "SQ-05", status: "active" };
  const r = tickTo(w, 3018, 11, 4); yes(r.ok); eq(r.plan.agendas["AG-NET-1"].stepIdx, 1); yes(!r.plan.clocks["CLK-A"]); yes(r.plan.events.some(e => /overgeslagen/.test(e.summary)));
});
t("overleden of gerecruteerde NPC's en Tolkien-figuren worden niet verplaatst", () => {
  const w = aworld(); w.npcs["NPC-E02"].status = "deceased"; let r = tickTo(w, 3018, 10, 30); yes(r.ok); yes(!r.plan.npcs["NPC-E02"]);
  const w2 = aworld(); w2.npcs["NPC-E02"].tolkien = true; r = tickTo(w2, 3018, 10, 30); yes(!r.plan.npcs["NPC-E02"]);
});
t("DM-ops: dwarsbomen, pauzeren, vertragen, hervatten (met reden en statusregels)", () => {
  const w = aworld();
  bad(run(w, { agendas: [{ id: "AG-NET-1", op: "pause" }] }), "reason");
  const p = run(w, { agendas: [{ id: "AG-NET-1", op: "pause", reason: "De spelers hebben de koeriers gewaarschuwd" }] }); yes(p.ok); eq(p.plan.agendas["AG-NET-1"].status, "paused");
  const w2 = adv(w, p.plan); const tk = tickTo(w2, 3018, 12, 20); yes(!tk.plan.agendas["AG-NET-1"], "gepauzeerd mag niet tikken");
  bad(run(w2, { agendas: [{ id: "AG-NET-1", op: "pause", reason: "nog een keer pauzeren" }] }), "alleen bij active");
  const rs = run(w2, { time: { to: { y: 3018, m: 11, d: 10 }, reason: "tijd verstrijkt" }, agendas: [{ id: "AG-NET-1", op: "resume", reason: "De waarschuwing hielp niet" }] }); yes(rs.ok, rs.errors.join("|"));
  const d = run(w, { agendas: [{ id: "AG-NET-1", op: "delay", days: 5, reason: "Slecht weer op de weg" }] }); eq(d.plan.agendas["AG-NET-1"].nextAt.d, 8);
  bad(run(w, { agendas: [{ id: "AG-NET-1", op: "delay", days: 99, reason: "te lang uitstellen" }] }), "days");
  const th = run(w, { agendas: [{ id: "AG-NET-1", op: "thwart", reason: "De cel is opgerold door de spelers" }] }); yes(th.ok); bad(run(adv(w, th.plan), { agendas: [{ id: "AG-NET-1", op: "resume", reason: "toch maar weer" }] }), "paused");
});
t("DM-op create: validatie van eigenaar, stappen en effecten", () => {
  const w = aworld(), mk2 = s => ({ id: "AG-NEW-1", op: "create", reason: "Lokale boeren sparen voor de winter", set: Object.assign({ owner: "FAC-LOCAL", title: "De winterpacht", canon: "N", steps: [{ text: "De boeren verzamelen het graan", afterDays: 7, clock: [{ id: "CLK-B", delta: 1 }] }] }, s) });
  const ok = run(w, { agendas: [mk2({})] }); yes(ok.ok, ok.errors.join("|")); eq(ok.plan.agendas["AG-NEW-1"].nextAt.d, 31);
  bad(run(w, { agendas: [mk2({ owner: "FAC-NIETS" })] }), "owner");
  bad(run(w, { agendas: [mk2({ steps: [{ text: "Iets gebeurt vandaag", afterDays: 0 }] })] }), "afterDays");
  bad(run(w, { agendas: [mk2({ steps: [{ text: "Een klok die niet bestaat", afterDays: 3, clock: [{ id: "CLK-Z", delta: 1 }] }] })] }), "onbekende klok");
  bad(run(w, { agendas: [mk2({ steps: [{ text: "Een enorme klokstap", afterDays: 3, clock: [{ id: "CLK-A", delta: 5 }] }] })] }), "klok-delta");
  bad(run(w, { agendas: [mk2({ title: "Het Stille Net verstoort de berichten" })] }), "bestaat al");
  const dead = aworld(); dead.npcs["NPC-E02"].status = "deceased"; bad(run(dead, { agendas: [mk2({ owner: "NPC-E02" })] }), "owner");
});
t("agenda-undo en context", () => {
  const w = aworld(); const r = tickTo(w, 3018, 11, 5); let n = 0; const c = W.commitPaths(w, r.plan, { now: 1, newKey: () => "k" + (n++) });
  yes(c.set["world/agendas/AG-NET-1"]); const prev = c.prev.find(x => x.p === "world/agendas/AG-NET-1"); eq(prev.v.stepIdx, 0);
  const ctx = W.worldContext(adv(w, r.plan), { hay: "", maxChars: 6000 }); yes(ctx.indexOf("Agenda's") >= 0 && ctx.indexOf("Recent buiten beeld") >= 0 && ctx.indexOf("koerier wordt onderschept") >= 0, ctx);
});
t("audit: agenda's", () => {
  const w = aworld(); eq(W.auditWorld(w).filter(i => i.level === "fout").length, 0);
  const a = clone(w); a.agendas["AG-NET-1"].steps[0].clock[0].id = "CLK-Q"; yes(W.auditWorld(a).some(i => /onbekende klok/.test(i.msg)));
  const b = clone(w); b.agendas["AG-NET-1"].owner = "FAC-WEG"; yes(W.auditWorld(b).some(i => /owner/.test(i.msg)));
  const c = clone(w); c.agendas["AG-NET-1"].nextAt = null; yes(W.auditWorld(c).some(i => /nextAt/.test(i.msg)));
  const d = clone(w); d.agendas["AG-NET-1"].status = "completed"; yes(W.auditWorld(d).some(i => /afgerond maar/.test(i.msg)));
});
t("simulatie: 200 tijdsprongen met agenda's: invarianten blijven waar", () => {
  let seed = 11; const rnd = () => (seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296;
  let w = aworld(); let applied = 0, off = 0, done = new Set();
  for (let i = 0; i < 200; i++) {
    const b = w.calendar, nd = addD(b, Math.floor(rnd() * 9)); const d = { time: { to: nd, reason: "tijd verstrijkt", worldTick: true } };
    if (rnd() < 0.15) d.agendas = [{ id: "AG-NET-1", op: ["pause", "resume", "delay", "thwart"][Math.floor(rnd() * 4)], days: 3, reason: "willekeurige test" }];
    if (rnd() < 0.1) d.quests = [{ id: "SQ-06", op: "update", set: { status: rnd() < 0.5 ? "active" : "completed" }, reason: "De spelers losten het op" }];
    const r = W.validateDelta(w, d, { round: i });
    if (r.ok) { applied++; off += r.plan.events.filter(e => e.type === "offscreen").length; const wasDone = Object.keys(w.agendas).filter(k => ["completed", "thwarted"].indexOf(w.agendas[k].status) >= 0); w = adv(w, r.plan); wasDone.forEach(k => yes(["completed", "thwarted"].indexOf(w.agendas[k].status) >= 0, k + " werd heropend")); }
    Object.values(w.clocks).forEach(c => yes(c.value >= 0 && c.value <= (c.max || 6), "klok buiten bereik"));
    yes(W.auditWorld(w).filter(x => x.level === "fout" && x.kind === "agenda").length === 0, "agenda-audit beurt " + i);
  }
  yes(applied > 80 && off >= 1, "te weinig variatie " + applied + "/" + off);
});
function addD(d, n) { const x = new Date(Date.UTC(d.y, d.m - 1, d.d + n)); return { y: x.getUTCFullYear(), m: x.getUTCMonth() + 1, d: x.getUTCDate() }; }

/* ---------- afloop-evaluator en Act-verloop ---------- */
function eworld(goals, clocks) {
  const w = world(); w.clocks["CLK-A"].value = clocks[0]; w.clocks["CLK-B"] = { id: "CLK-B", value: clocks[1], max: 6 }; w.clocks["CLK-C"].value = clocks[2];
  [["msg", "MAIN-A4-MSG"], ["cor", "MAIN-A4-CORRIDOR"], ["dis", "MAIN-A4-DISINFO"]].forEach(([k, id]) => { if (goals[k]) w.quests[id] = { id: id, title: id, kind: "main", status: goals[k], region: "REG-ERIADOR", open: true, canon: "B", history: [] }; });
  return w;
}
const endIds = w => W.evaluateEndings(w).candidates.map(c => c.id).join(",");
t("afloop: sterk netwerk bij drie doelen en gezonde klokken", () => eq(endIds(eworld({ msg: "completed", cor: "completed", dis: "completed" }, [2, 4, 3])), "sterk_netwerk"));
t("afloop: drie doelen maar zware schade is sterk netwerk met littekens", () => eq(endIds(eworld({ msg: "completed", cor: "completed", dis: "completed" }, [5, 1, 5])), "sterk_netwerk_met_littekens"));
t("afloop: versplinterde overwinning", () => eq(endIds(eworld({ msg: "completed", cor: "failed", dis: "failed" }, [3, 3, 3])), "versplinterde_overwinning"));
t("afloop: kostbaar behoud", () => eq(endIds(eworld({ msg: "failed", cor: "completed", dis: "failed" }, [3, 3, 3])), "kostbaar_behoud"));
t("afloop: mislukte missie", () => eq(endIds(eworld({ msg: "failed", cor: "failed", dis: "expired" }, [5, 1, 5])), "mislukte_missie"));
t("afloop: onverwacht als niets past", () => eq(endIds(eworld({ msg: "failed", cor: "failed", dis: "completed" }, [3, 3, 3])), "speleroplossing"));
t("afloop: nog niet beslist zolang een doel openstaat; zonder doelen niets", () => {
  const p = W.evaluateEndings(eworld({ msg: "completed", cor: "active", dis: "failed" }, [3, 3, 3])); yes(p.pending && p.candidates.length === 0);
  yes(W.evaluateEndings(world()).candidates.length === 0);
});
t("afloop: context toont kandidaten pas in Act IV", () => {
  const w = eworld({ msg: "completed", cor: "failed", dis: "failed" }, [3, 3, 3]); yes(W.worldContext(w, { hay: "" }).indexOf("Versplinterde overwinning") >= 0);
  yes(W.worldContext(world(), { hay: "" }).indexOf("Afloop-kandidaten") < 0);
});
t("Act-agenda: Fellowship-vertrek, voorjaar en eindspel maken de Acts beschikbaar op de canondata", () => {
  const w = world(); w.factions = { "FAC-RIVENDELL": { id: "FAC-RIVENDELL", name: "Rivendell" } };
  ["MAIN-A2", "MAIN-A3", "MAIN-A4"].forEach(id => { w.quests[id] = { id: id, title: id, kind: "main", status: "dormant", region: "REG-ERIADOR", open: true, canon: "B", history: [] }; });
  w.agendas = { "AG-ACT-1": { id: "AG-ACT-1", owner: "FAC-RIVENDELL", title: "Acts", status: "active", canon: "I", stepIdx: 0, nextAt: { y: 3018, m: 12, d: 26 }, history: [], steps: [
    { text: "Act II begint", afterDays: 1, quest: { id: "MAIN-A2", to: "available" } }, { text: "Winter", afterDays: 40 }, { text: "Act III begint", afterDays: 25, quest: { id: "MAIN-A3", to: "available" } }, { text: "Act IV begint", afterDays: 13, quest: { id: "MAIN-A4", to: "available" } }, { text: "Nieuws van het einde", afterDays: 11 }] } };
  const a = run(w, { time: { to: { y: 3018, m: 12, d: 27 }, reason: "de feestdagen verstrijken", worldTick: true } }); eq(a.plan.quests["MAIN-A2"].status, "available"); yes(!a.plan.quests["MAIN-A3"]);
  const b = run(w, { time: { to: { y: 3019, m: 3, d: 2 }, reason: "de winter gaat voorbij", worldTick: true } }); eq(b.plan.quests["MAIN-A3"].status, "available"); yes(!b.plan.quests["MAIN-A4"]);
  const c = run(w, { time: { to: { y: 3019, m: 3, d: 20 }, reason: "de oorlogsweken", worldTick: true } }); eq(c.plan.quests["MAIN-A4"].status, "available"); eq(c.plan.agendas["AG-ACT-1"].stepIdx, 4);
  const d = run(w, { time: { to: { y: 3019, m: 4, d: 1 }, reason: "de nasleep", worldTick: true } }); eq(d.plan.agendas["AG-ACT-1"].status, "completed");
});

/* ---------- verhaalrol, eigen quest en gelaagde achtergrond per NPC ---------- */
function sworld() {
  const w = cworld();
  w.quests["CQ-R03"] = { id: "CQ-R03", title: "De schuld van Brynja's huis", kind: "companion", status: "dormant", region: "REG-RIVENDELL", open: true, ifIgnored: "Ze gaat alleen terug", canon: "V", history: [], stages: ["Het bericht openen", "De schuld begrijpen", "Een antwoord geven"], npcs: ["CMP-R03"] };
  w.backstories = { "CMP-R03": { id: "CMP-R03", npc: "CMP-R03", role: "Dwergse verdediger", quest: "CQ-R03", canon: "V", revealed: null, layers: [
    { n: 1, title: "Het schild", text: "Ze beschermt anderen instinctief.", know: "Brynja stapt tussen bedreiging en zwakkeren.", gate: { t: "met" } },
    { n: 2, title: "Het bericht", text: "Haar familie verwacht haar thuis.", know: "Brynja heeft een bericht van haar familie.", gate: { t: "evidence", min: 2 } },
    { n: 3, title: "Het antwoord", text: "Ze moet kiezen.", know: "Brynja moet kiezen.", gate: { t: "stage", quest: "CQ-R03", min: 2 } }] } };
  return w;
}
const rv = (n, reason) => ({ reveals: [{ npc: "CMP-R03", layer: n, reason: reason || "De spelers vroegen er rustig naar" }] });
t("laag 1 kan zodra de spelers de persoon kennen; laag 2 pas na bewijs; volgorde verplicht", () => {
  let w = sworld(); w.npcs["CMP-R03"].introduced = false;
  bad(run(w, rv(1)), "kennen"); w.npcs["CMP-R03"].introduced = true;
  const a = run(w, rv(1)); yes(a.ok, a.errors.join("|")); eq(a.plan.backstories["CMP-R03"].revealed[1].reason, "De spelers vroegen er rustig naar");
  bad(run(w, rv(2)), "eerst worden onthuld");
  w = apply2(w, run(w, { companions: [rec3] }).plan); w.backstories = Object.assign({}, w.backstories, a.plan.backstories);
  bad(run(w, rv(2)), "bewijslogboek");
  w = apply2(w, run(w, { companions: [{ id: "CMP-R03", op: "update", evidence: "De PC's hielden hun belofte bij de brug" }, { id: "CMP-R03", op: "update", evidence: "Brynja werd door de PC's gedekt" }] }).plan);
  const b = run(w, rv(2)); yes(b.ok, b.errors.join("|"));
});
t("onthullen vereist reden; dubbel onthullen en onbekende lagen worden geweigerd", () => {
  const w = sworld(); w.npcs["CMP-R03"].introduced = true;
  bad(run(w, rv(1, "kort")), "reason"); bad(run(w, rv(9)), "geen laag 9");
  w.backstories["CMP-R03"].revealed = { 1: { reason: "eerder" } }; bad(run(w, rv(1)), "al onthuld");
  bad(run(w, { reveals: [{ npc: "NPC-NERGENS", layer: 1, reason: "bestaat niet echt" }] }), "bestaat niet");
});
t("quest-stage: alleen vooruit, alleen bij een actieve quest, met reden; opent laag 3", () => {
  let w = sworld(); w.npcs["CMP-R03"].introduced = true; w.backstories["CMP-R03"].revealed = { 1: { reason: "x" }, 2: { reason: "y" } };
  bad(run(w, { quests: [{ id: "CQ-R03", op: "update", set: { stage: 1 }, reason: "stap bereikt" }] }), "active");
  const act = run(w, { quests: [{ id: "CQ-R03", op: "update", set: { status: "active" }, reason: "De spelers helpen Brynja" }] }); yes(act.ok); w = applyPlan(w, act.plan);
  bad(run(w, { quests: [{ id: "CQ-R03", op: "update", set: { stage: 7 }, reason: "te ver vooruit" }] }), "stage moet");
  bad(run(w, { reveals: [{ npc: "CMP-R03", layer: 3, reason: "te vroeg onthuld" }] }), "stap 2");
  const s = run(w, { quests: [{ id: "CQ-R03", op: "update", set: { stage: 2 }, reason: "Het bericht is geopend" }], reveals: [{ npc: "CMP-R03", layer: 3, reason: "Het bericht is geopend" }] }); yes(s.ok, s.errors.join("|"));
  w = applyPlan(w, s.plan); bad(run(w, { quests: [{ id: "CQ-R03", op: "update", set: { stage: 1 }, reason: "terugzetten kan niet" }] }), "stage moet");
});
t("overleden NPC onthult geen lagen meer", () => { const w = sworld(); w.npcs["CMP-R03"].introduced = true; w.npcs["CMP-R03"].status = "deceased"; bad(run(w, rv(1)), "overleden"); });
t("context: verborgen laag blijft verborgen tot de gate klopt (geen vooruit lopen)", () => {
  const w = sworld(); w.npcs["CMP-R03"].introduced = true; w.backstories["CMP-R03"].revealed = { 1: { reason: "x" } };
  let c = W.worldContext(w, { hay: "brynja" }); yes(c.indexOf("Verhaallagen") >= 0 && c.indexOf("nog niet") >= 0 && c.indexOf("Haar familie verwacht haar thuis") < 0, c);
  w.companions["CMP-R03"].stage = "active"; w.companions["CMP-R03"].evidence = [{ text: "a ervaring" }, { text: "b ervaring" }];
  c = W.worldContext(w, { hay: "brynja" }); yes(c.indexOf("KAN NU ONTHULD WORDEN") >= 0 && c.indexOf("Haar familie verwacht haar thuis") >= 0, c);
});
t("audit: achtergronden", () => {
  const w = sworld(); eq(W.auditWorld(w).filter(i => i.level === "fout").length, 0);
  const a = clone(w); a.backstories["CMP-R03"].quest = "CQ-X"; yes(W.auditWorld(a).some(i => /bestaat niet/.test(i.msg)));
  const b = clone(w); b.backstories["CMP-R03"].revealed = { 2: {} }; yes(W.auditWorld(b).some(i => /aaneengesloten/.test(i.msg)));
  const c = clone(w); c.backstories["CMP-R03"].layers[1].gate = { t: "stage", quest: "CQ-NOPE", min: 1 }; yes(W.auditWorld(c).some(i => /onbekende quest/.test(i.msg)));
  const d = clone(w); d.quests["CQ-R03"].stage = 9; yes(W.auditWorld(d).some(i => /stage valt buiten/.test(i.msg)));
});
t("reveal-undo: commitPaths bewaart herstelgegevens", () => {
  const w = sworld(); w.npcs["CMP-R03"].introduced = true; const r = run(w, rv(1)); let n = 0; const c = W.commitPaths(w, r.plan, { now: 1, newKey: () => "k" + (n++) });
  const p = c.prev.find(x => x.p === "world/backstories/CMP-R03"); yes(p && !p.v.revealed);
});

/* ---------- scene/party, idempotentie, reistijd-closure (uit de simulaties) ---------- */
t("party teleporteert niet: regiowissel vraagt reistijd of een travel.reason", () => {
  const w = cworld(); w.sceneSince = { y: 3018, m: 10, d: 24 };
  bad(run(w, { region: "REG-ERIADOR" }), "kan niet in 0 dag");
  const ok = run(w, { time: { to: { y: 3018, m: 10, d: 27 }, reason: "reis naar Eriador" }, region: "REG-ERIADOR" }); yes(ok.ok, ok.errors.join("|")); eq(ok.plan.scene.region, "REG-ERIADOR");
  yes(run(w, { region: "REG-ERIADOR", travel: { reason: "een snel paard en een noodgeval" } }).ok);
  bad(run(w, { region: "ERIADOR" }), "REG-id");
});
t("live companions reizen mee, remote niet, vertrokken niet", () => {
  let w = cworld(); w.sceneSince = { y: 3018, m: 10, d: 24 }; ["CMP-R03", "CMP-R01"].forEach(id => { w = apply2(w, run(w, { companions: [{ id: id, op: "recruit", mode: id === "CMP-R03" ? "permanent" : "remote", reason: "Gedeeld belang voor de reis" }] }).plan); });
  const r = run(w, { time: { to: { y: 3018, m: 10, d: 28 }, reason: "reis naar Eriador" }, region: "REG-ERIADOR" }); yes(r.ok);
  eq(r.plan.npcs["CMP-R03"].location, "REG-ERIADOR"); yes(!r.plan.npcs["CMP-R01"], "remote ally blijft staan");
});
t("companion buiten de scene kan niet worden bijgewerkt of rusten", () => {
  let w = active3(); w.sceneSince = { y: 3018, m: 10, d: 24 }; w.npcs["CMP-R03"].location = "REG-ERIADOR"; w.sceneRegion = "REG-RIVENDELL";
  bad(run(w, { companions: [{ id: "CMP-R03", op: "update", hp: { delta: -2 } }] }), "niet bij de party"); bad(run(w, { companions: [{ id: "CMP-R03", op: "rest", kind: "short" }] }), "niet bij de party");
  yes(run(w, { companions: [{ id: "CMP-R03", op: "update", evidence: "Stuurde nieuws via een koerier" }] }).ok);
});
t("idempotentie: een al verwerkte ronde wordt niet nogmaals toegepast; Terug maakt herhalen weer mogelijk", () => {
  const w = world(); const d = { clocks: [{ id: "CLK-A", delta: 1, reason: "Een koerier verdween" }] };
  const r = W.validateDelta(w, d, { round: 4 }); yes(r.ok); let n = 0; const c = W.commitPaths(w, r.plan, { now: 1, newKey: () => "k" + (n++) });
  yes(c.set["world/lastRound"] === 4); const w2 = clone(w); Object.keys(c.set).forEach(p => setPath(w2, p.replace(/^world\//, ""), c.set[p]));
  const again = W.validateDelta(w2, d, { round: 4 }); bad(again, "al verwerkt"); bad(W.validateDelta(w2, d, { round: 3 }), "al verwerkt"); yes(W.validateDelta(w2, d, { round: 5 }).ok);
  c.prev.forEach(x => setPath(w2, x.p.replace(/^world\//, ""), x.v)); yes(W.validateDelta(w2, d, { round: 4 }).ok, "na Terug moet dezelfde ronde opnieuw kunnen");
});
t("agenda van een overleden eigenaar stopt bij de volgende tijdsprong", () => {
  const w = aworld(); w.npcs["NPC-E02"].status = "deceased"; const r = tickTo(w, 3018, 10, 30); eq(r.plan.agendas["AG-ORE-1"].status, "cancelled"); yes(r.plan.events.some(e => e.type === "agenda_cancelled"));
  eq(Object.keys(W.auditWorld(adv(w, r.plan)).filter(i => i.level === "fout")).length, 0);
});
t("reistijd: ontbrekende paren volgen de kortste route over bekende verbindingen", () => {
  eq(W.travelDays("REG-ERIADOR", "REG-ANDUIN"), 8); eq(W.travelDays("REG-MISTY", "REG-GONDOR"), 18); eq(W.travelDays("REG-ANDUIN", "REG-ANDUIN"), 0); eq(W.travelDays("REG-ERIADOR", "REG-NERGENS"), null);
});

console.log(pass + " geslaagd, " + fail + " mislukt");
process.exit(fail ? 1 : 0);
