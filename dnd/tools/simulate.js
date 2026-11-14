#!/usr/bin/env node
/* Langdurige simulaties van het wereldmodel (dnd/world.js): een deterministische "nep-DM" speelt honderden beurten
   door de echte validatie- en opslaglaag (validateDelta, commitPaths, undo) zonder API-kosten, met opzettelijke fouten
   ("slechte zetten") die altijd geweigerd moeten worden. Draait tegen het wereldsjabloon uit de database of een bestand.
   Gebruik:
     node dnd/tools/simulate.js [--scenario=long|missed|death|split|retry|all] [--seed=7] [--turns=700] [--template | --cid=c1 | --file=wereld.json] [--quiet]
   Uitgangscode 1 bij een schending van een invariant (dan staat er wat en wanneer). Geen geheimen in dit bestand; de DM-inhoud komt uit de database. */
"use strict";
const { spawnSync } = require("child_process");
const fs = require("fs");
const W = require("../world.js");

const argv = process.argv.slice(2), flags = {};
argv.forEach(a => { if (a.startsWith("--")) { const i = a.indexOf("="); flags[a.slice(2, i < 0 ? undefined : i)] = i < 0 ? true : a.slice(i + 1); } });
const clone = o => JSON.parse(JSON.stringify(o));
const isObj = o => o && typeof o === "object" && !Array.isArray(o);

function fbGet(p) {
  const r = spawnSync("firebase database:get \"" + p + "\" --project kthulp-certamen", { shell: true, encoding: "utf8", maxBuffer: 1 << 28, env: { ...process.env, MSYS_NO_PATHCONV: "1" } });
  if (r.status !== 0) throw new Error("firebase faalde: " + (r.stderr || r.stdout).slice(0, 300));
  return JSON.parse(r.stdout);
}
function loadWorld() {
  if (typeof flags.file === "string") return JSON.parse(fs.readFileSync(flags.file, "utf8"));
  if (typeof flags.cid === "string") return fbGet("/dnd/campaigns/" + flags.cid + "/world");
  return fbGet("/dnd/worldTemplate/world");
}

/* ---------- hulpfuncties ---------- */
function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const addDays = (d, n) => { const x = new Date(Date.UTC(d.y, d.m - 1, d.d + n)); return { y: x.getUTCFullYear(), m: x.getUTCMonth() + 1, d: x.getUTCDate() }; };
const fmt = d => d.d + "-" + d.m + "-" + d.y;
function setPath(o, p, v) { const k = p.split("/"); let c = o; for (let i = 0; i < k.length - 1; i++) { if (!isObj(c[k[i]])) c[k[i]] = {}; c = c[k[i]]; } if (v === null || v === undefined) delete c[k[k.length - 1]]; else c[k[k.length - 1]] = v; }
const sortDeep = o => Array.isArray(o) ? o.map(sortDeep) : isObj(o) ? Object.keys(o).sort().reduce((a, k) => (o[k] === null || o[k] === undefined ? a : (a[k] = sortDeep(o[k]), a)), {}) : o;
const stable = w => { const c = clone(w); delete c.jobs; return JSON.stringify(sortDeep(c)); };
const regionOf = (w, loc) => W.regionOf(w, loc);
const TERMINAL = ["completed", "failed", "expired", "changed"];

/* ---------- de simulator ---------- */
function makeSim(world, seed, name, opt) {
  const rnd = rng(seed), int = n => Math.floor(rnd() * n), pick = a => a[int(a.length)];
  const S = { w: clone(world), name: name, round: Number.isInteger(world.lastRound) ? world.lastRound : 0, accepted: 0, rejected: 0, unexpected: {}, expectedRejects: 0, breaches: [], rejects: {}, undoChecks: 0, replays: 0, ctxMax: 0, ctxSum: 0, ctxN: 0, ids: { npc: 0, quest: 0, agenda: 0 }, last: null, kills: 0, log: [] };
  const breach = (m) => { S.breaches.push("beurt " + S.accepted + "/" + S.round + " (" + (S.w.calendar ? fmt(S.w.calendar) : "?") + "): " + m); };
  let keyN = 0; const newKey = () => "S" + (++keyN);
  const cat = e => String(e).replace(/[A-Z]{2,5}-[A-Z0-9-]+/g, "ID").replace(/\d+/g, "N").slice(0, 60);

  function snapshotCheck(prev, next, plan) {
    const a = W.auditWorld(next).filter(i => i.level === "fout"); if (a.length) breach("audit: " + a.slice(0, 2).map(i => i.kind + " " + i.id + ": " + i.msg).join(" | "));
    if (W.dateCmp(next.calendar, prev.calendar) < 0) breach("tijd ging terug");
    Object.keys(prev.npcs || {}).forEach(id => { const p = prev.npcs[id], n = next.npcs[id]; if (p.status === "deceased" && !(n && n.status === "deceased")) breach(id + " is teruggekomen"); });
    Object.keys(prev.quests || {}).forEach(id => { const p = prev.quests[id], n = next.quests[id]; if (TERMINAL.indexOf(p.status) >= 0 && n.status !== p.status) breach("quest " + id + " is heropend"); if ((n.stage || 0) < (p.stage || 0)) breach("quest " + id + " stap ging terug"); });
    Object.keys(next.clocks || {}).forEach(id => { const c = next.clocks[id]; if (!(c.value >= 0 && c.value <= (c.max != null ? c.max : 6))) breach("klok " + id + " buiten bereik"); });
    Object.keys(prev.backstories || {}).forEach(id => { Object.keys(prev.backstories[id].revealed || {}).forEach(n => { if (!((next.backstories[id].revealed || {})[n])) breach("laag " + n + " van " + id + " werd ongedaan"); }); });
    const pe = Object.keys(prev.events || {}).length, ne = Object.keys(next.events || {}).length; if (ne < pe) breach("events verdwenen");
    const divergent = next.divergences && Object.keys(next.divergences).length;
    if (!divergent && W.dateCmp(next.calendar, { y: 3018, m: 12, d: 25 }) > 0) W.FELLOWSHIP.forEach(id => { const n = next.npcs[id]; if (n && regionOf(next, n.location) === "REG-RIVENDELL" && (!prev.npcs[id] || regionOf(prev, prev.npcs[id].location) !== "REG-RIVENDELL")) breach(id + " staat na 25 dec in Rivendell"); });
    const ctx = W.worldContext(next, { hay: (S.lastText || "").toLowerCase(), region: next.sceneRegion, maxChars: 1e9 }).length; S.ctxMax = Math.max(S.ctxMax, ctx); S.ctxSum += ctx; S.ctxN++;
  }

  /* dien een delta in zoals de app doet: valideren, dan atomair vastleggen (en bewaar herstelgegevens) */
  S.submit = function (delta, label, expect) {
    const r = W.validateDelta(S.w, delta, { round: S.round + 1, hasPortrait: () => false });
    if (!r.ok) {
      S.rejected++; const c = cat(r.errors[0]); S.rejects[c] = (S.rejects[c] || 0) + 1;
      if (expect === "ok") { S.unexpected[c] = (S.unexpected[c] || 0) + 1; S.lastUnexpected = label + ": " + r.errors.join(" | "); }
      else S.expectedRejects++;
      return r;
    }
    if (expect === "reject") { breach("SLECHTE ZET GEACCEPTEERD (" + label + ")"); }
    const prev = clone(S.w), c = W.commitPaths(S.w, r.plan, { now: S.accepted + 1, region: delta.region, newKey: newKey });
    Object.keys(c.set).forEach(p => setPath(S.w, p.replace(/^world\//, ""), c.set[p]));
    S.round++; S.accepted++; S.last = { c: c, prev: prev, delta: delta, round: S.round };
    S.lastText = (delta.npcs || []).map(n => n.id).concat((delta.quests || []).map(q => q.id), (delta.companions || []).map(x => x.id)).join(" ");
    snapshotCheck(prev, S.w, r.plan);
    if (S.accepted % 9 === 0) { /* Terug + Opnieuw */
      const before = stable(prev), after = stable(S.w);
      c.prev.forEach(x => setPath(S.w, x.p.replace(/^world\//, ""), x.v));
      if (stable(S.w) !== before) breach("na Terug is de wereld niet gelijk aan de vorige stand");
      Object.keys(c.set).forEach(p => setPath(S.w, p.replace(/^world\//, ""), c.set[p]));
      if (stable(S.w) !== after) breach("na Opnieuw is de wereld niet gelijk aan de gespeelde stand");
      S.undoChecks++;
    }
    return r;
  };

  /* ---------- goede zetten ---------- */
  const w = () => S.w, now = () => S.w.calendar, region = () => S.w.sceneRegion;
  const alive = n => n.status !== "deceased";
  const present = n => regionOf(w(), n.location) === region();
  const M = {};
  M.time = () => { const n = rnd() < 0.06 ? 7 + int(14) : 1 + int(2); return { time: { to: addDays(now(), n), reason: "de dagen verstrijken", worldTick: true } }; };
  M.travel = () => {
    const from = region(), opts = Object.keys(W.TRAVEL).map(k => k.split("|")).filter(p => p.indexOf(from) >= 0).map(p => p[0] === from ? p[1] : p[0]).filter(r => W.travelDays(from, r) <= 12);
    if (!opts.length) return null; const to = pick(opts), need = W.travelDays(from, to), since = w().sceneSince || now();
    let target = addDays(since, need); if (W.dateCmp(target, now()) < 0) target = clone(now());
    const d = { region: to }; if (W.dateCmp(target, now()) > 0) d.time = { to: target, reason: "reis naar " + to, worldTick: true }; return d;
  };
  M.intro = () => { const c = Object.values(w().npcs).filter(n => !n.tolkien && !n.introduced && alive(n) && n.status !== "ambient" && present(n)); if (!c.length) return null; const n = pick(c); return { npcs: [{ id: n.id, op: "update", set: { introduced: true } }] }; };
  M.promote = () => {
    const nx = { ambient: "named", named: "recurring", recurring: "companion_candidate" };
    const c = Object.values(w().npcs).filter(n => !n.tolkien && alive(n) && nx[n.status] && (n.status !== "recurring" || /^CMP-/.test(n.id))); if (!c.length) return null; const n = pick(c);
    return { npcs: [{ id: n.id, op: "update", set: { status: nx[n.status] }, reason: "Het verhaal heeft deze persoon belangrijker gemaakt" }] };
  };
  M.recruit = () => { const c = Object.values(w().companions || {}).filter(r => r.stage === "candidate" && w().npcs[r.id].status === "companion_candidate" && w().npcs[r.id].introduced === true && present(w().npcs[r.id])); if (!c.length) return null; return { companions: [{ id: pick(c).id, op: "recruit", mode: pick(["permanent", "etappe", "temporary"]), reason: "Gedeeld belang en een geloofwaardig verzoek" }] }; };
  M.companion = () => {
    const cs = Object.values(w().companions || {}).filter(r => r.stage === "active" || r.stage === "departed"); if (!cs.length) return null; const r = pick(cs), n = w().npcs[r.id];
    if (r.stage === "departed") { const need = W.travelDays(regionOf(w(), n.location), region()), at = r.departure && r.departure.at ? addDays(r.departure.at, need || 0) : now(); const d = { companions: [{ id: r.id, op: "return", reason: "De verplichting is voorbij" }] }; if (W.dateCmp(at, now()) > 0) d.time = { to: at, reason: "wachten op de terugkeer", worldTick: true }; return d; }
    const k = int(5);
    if (k === 0) return { companions: [{ id: r.id, op: "update", hp: { delta: -Math.min(r.hp.cur, 1 + int(8)) } }] };
    if (k === 1) return { companions: [{ id: r.id, op: "update", evidence: "De PC's hielden een afspraak met " + n.name }] };
    if (k === 2) return { companions: [{ id: r.id, op: "rest", kind: pick(["short", "long"]) }] };
    if (k === 3 && rnd() < 0.5) return { companions: [{ id: r.id, op: "depart", reason: "Een eigen verplichting roept " + n.name, destination: pick(["REG-ERIADOR", "REG-RIVENDELL", "REG-MISTY"]), returnIf: "de verplichting is voorbij" }] };
    return { companions: [{ id: r.id, op: "update", nextAction: "bewaakt de achterhoede" }] };
  };
  M.quest = () => {
    const qs = Object.values(w().quests).filter(q => TERMINAL.indexOf(q.status) < 0 && !(q.expires && W.dateOk(q.expires) && W.dateCmp(now(), q.expires) > 0)); if (!qs.length) return null; const q = pick(qs);
    if (q.status === "dormant" || q.status === "available") return { quests: [{ id: q.id, op: "update", set: { status: "active" }, reason: "De spelers gaan erop in" }] };
    if (q.stages && (q.stage || 0) < q.stages.length) return { quests: [{ id: q.id, op: "update", set: { stage: (q.stage || 0) + 1 }, reason: "De spelers kwamen een stap verder" }] };
    return { quests: [{ id: q.id, op: "update", set: { status: rnd() < 0.7 ? "completed" : "failed" }, reason: "Een duidelijke afloop in het verhaal" }] };
  };
  M.reveal = () => { for (const b of Object.values(w().backstories || {})) { const n = w().npcs[b.npc], rv = b.revealed || {}, nxt = (b.layers || []).find(l => !rv[l.n]); if (n && alive(n) && nxt && W.gateOk(w(), b.npc, nxt.gate, now())) return { reveals: [{ npc: b.npc, layer: nxt.n, reason: "De scène bood een natuurlijk moment" }] }; } return null; };
  M.agenda = () => { const a = Object.values(w().agendas || {}).filter(x => x.status === "active" || x.status === "paused"); if (!a.length) return null; const x = pick(a); const r = rnd();
    if (x.status === "paused") return { agendas: [{ id: x.id, op: "resume", reason: "De aanleiding bestaat nog" }] };
    if (r < 0.15) return { agendas: [{ id: x.id, op: "thwart", reason: "De spelers verstoorden het plan" }] }; if (r < 0.4) return { agendas: [{ id: x.id, op: "pause", reason: "Een tijdelijke belemmering" }] };
    return { agendas: [{ id: x.id, op: "delay", days: 1 + int(10), reason: "Slecht weer en onbegaanbare wegen" }] }; };
  M.clock = () => { const cs = Object.values(w().clocks); if (!cs.length) return null; const c = pick(cs), up = rnd() < 0.5, max = c.max != null ? c.max : 6; const dd = up ? 1 : -1; if (c.value + dd < 0 || c.value + dd > max) return null; return { clocks: [{ id: c.id, delta: dd, reason: "Een geloofwaardige gebeurtenis in het verhaal" }] }; };
  M.kill = () => { const c = Object.values(w().npcs).filter(n => !n.tolkien && alive(n) && n.id !== "NPC-EADMUND"); if (!c.length) return null; const n = pick(c); S.kills++; return { npcs: [{ id: n.id, op: "update", set: { status: "deceased" }, reason: "Gesneuveld in het verhaal" }] }; };
  M.create = () => { const k = int(3);
    if (k === 0) { const id = "NPC-S" + (++S.ids.npc); return { npcs: [{ id: id, op: "create", set: { name: "Passant " + id, canon: "N", status: "named", location: region() } }] }; }
    if (k === 1) { const id = "DQ-" + String(++S.ids.quest).padStart(4, "0"); return { quests: [{ id: id, op: "create", set: { title: "Dynamische quest " + id, hook: "Een verzoek onderweg", region: region(), ifIgnored: "Het verzoek verstrijkt", canon: "N", expires: addDays(now(), 30) } }] }; }
    const owners = Object.keys(w().factions || {}); if (!owners.length) return null; const id = "AG-D" + (++S.ids.agenda);
    return { agendas: [{ id: id, op: "create", reason: "Een geloofwaardig motief en middelen", set: { owner: pick(owners), title: "Dynamische agenda " + id, canon: "N", steps: [{ text: "Een eerste stap buiten beeld", afterDays: 5 + int(10), clock: [{ id: pick(Object.keys(w().clocks)), delta: rnd() < 0.5 ? 1 : -1 }] }] } }] }; };

  /* ---------- slechte zetten: elke moet worden geweigerd ---------- */
  const B = {};
  B.teleport = () => { const from = region(); const o = Object.keys(W.TRAVEL).map(k => k.split("|")).filter(p => p.indexOf(from) >= 0).map(p => p[0] === from ? p[1] : p[0]).filter(r => { const need = W.travelDays(from, r), spent = w().sceneSince ? W.dateCmp(now(), w().sceneSince) : 99; return need > spent; }); return o.length ? { region: pick(o) } : null; };
  B.tijdTerug = () => ({ time: { to: addDays(now(), -1 - int(5)), reason: "terug in de tijd", worldTick: true } });
  B.tijdsprongZonderTick = () => ({ time: { to: addDays(now(), 30), reason: "een maand verstrijkt" } });
  B.opstanding = () => { const d = Object.values(w().npcs).filter(n => n.status === "deceased"); return d.length ? { npcs: [{ id: pick(d).id, op: "update", set: { status: "named", location: region() }, reason: "Hij leeft toch nog" }] } : null; };
  B.questHeropenen = () => { const q = Object.values(w().quests).filter(x => TERMINAL.indexOf(x.status) >= 0); return q.length ? { quests: [{ id: pick(q).id, op: "update", set: { status: "active" }, reason: "We spelen het opnieuw" }] } : null; };
  B.klokOverloop = () => { const c = Object.values(w().clocks); return { clocks: [{ id: pick(c).id, delta: 5, reason: "Alles gaat mis" }] }; };
  B.klokZonderReden = () => ({ clocks: [{ id: pick(Object.keys(w().clocks)), delta: 1 }] });
  B.laagZonderGate = () => { for (const b of Object.values(w().backstories || {})) { const rv = b.revealed || {}, nxt = (b.layers || []).find(l => !rv[l.n]); if (nxt && !W.gateOk(w(), b.npc, nxt.gate, now()) && nxt.gate.t !== "free") return { reveals: [{ npc: b.npc, layer: nxt.n, reason: "Te vroeg onthuld" }] }; } return null; };
  B.laagOverslaan = () => { for (const b of Object.values(w().backstories || {})) { const rv = b.revealed || {}; if (!rv[1] && b.layers.length > 1) return { reveals: [{ npc: b.npc, layer: 2, reason: "Sla een laag over" }] }; } return null; };
  B.recruitGeenKandidaat = () => { const r = Object.values(w().companions || {}).filter(x => x.stage !== "candidate"); return r.length ? { companions: [{ id: pick(r).id, op: "recruit", mode: "permanent", reason: "Nogmaals werven" }] } : null; };
  B.tolkienAanmaken = () => ({ npcs: [{ id: "TOL-NIEUW", op: "create", set: { name: "Nieuwe Tolkien", canon: "C", tolkien: true } }] });
  B.jobsInjectie = () => ({ jobs: [{ id: "JOB-PORT-X" }] });
  B.dodeCompanion = () => { const d = Object.values(w().companions || {}).filter(r => r.stage === "deceased"); return d.length ? { companions: [{ id: pick(d).id, op: "update", hp: { cur: 5 } }] } : null; };
  B.stageTeVer = () => { const q = Object.values(w().quests).filter(x => x.stages); return q.length ? { quests: [{ id: pick(q).id, op: "update", set: { stage: 99 }, reason: "Alles tegelijk" }] } : null; };
  B.agendaZonderReden = () => { const a = Object.values(w().agendas || {}).filter(x => x.status === "active"); return a.length ? { agendas: [{ id: pick(a).id, op: "pause" }] } : null; };
  B.dubbeleIndiening = () => (S.last ? { __replay: true, delta: S.last.delta } : null);
  B.statusTerug = () => { const n = Object.values(w().npcs).filter(x => x.status === "recurring" && !x.tolkien); return n.length ? { npcs: [{ id: pick(n).id, op: "update", set: { status: "named" }, reason: "Toch minder belangrijk" }] } : null; };
  B.recruitViaNpcs = () => { const n = Object.values(w().npcs).filter(x => /^CMP-/.test(x.id) && x.status === "companion_candidate"); return n.length ? { npcs: [{ id: pick(n).id, op: "update", set: { status: "recruited" }, reason: "Ze gaat gewoon mee" }] } : null; };

  S.bad = function () {
    const names = Object.keys(B); for (let i = 0; i < 8; i++) { const nm = pick(names), d = B[nm](); if (!d) continue;
      if (d.__replay) { /* dezelfde ronde nogmaals: moet worden geweigerd */
        const r = W.validateDelta(S.w, d.delta, { round: S.round, hasPortrait: () => false }); S.replays++;
        if (r.ok) breach("DUBBELE INDIENING GEACCEPTEERD (ronde " + S.round + ")"); else S.expectedRejects++; return nm; }
      S.submit(d, nm, "reject"); return nm; }
    return null;
  };
  S.good = function (weights) {
    const names = Object.keys(weights), tot = names.reduce((a, k) => a + weights[k], 0); for (let tries = 0; tries < 12; tries++) { let x = rnd() * tot, nm = names[0]; for (const k of names) { x -= weights[k]; if (x <= 0) { nm = k; break; } } const d = M[nm](); if (!d) continue; return S.submit(d, nm, "ok"), nm; }
    return S.submit(M.time(), "time", "ok"), "time";
  };
  S.M = M; S.rnd = rnd; S.int = int; S.pick = pick; S.breach = breach;
  return S;
}

/* ---------- scenario's ---------- */
const END = { y: 3019, m: 5, d: 1 };
function runRandom(world, name, seed, turns, weights, badChance, extra) {
  const S = makeSim(world, seed, name);
  for (let i = 0; i < turns && W.dateCmp(S.w.calendar, END) < 0; i++) {
    if (S.rnd() < badChance) S.bad();
    S.good(weights);
    if (extra) extra(S, i);
  }
  return S;
}
const W_LONG = { time: 2.2, travel: 1.2, intro: 2, promote: 1.6, recruit: 1.6, companion: 3, quest: 3, reveal: 2, agenda: 0.6, clock: 0.8, kill: 0.12, create: 0.8 };

function scenarioLong(world, seed, turns) { return runRandom(world, "long", seed, turns, W_LONG, 0.12); }
function scenarioMissed(world, seed) {
  const S = runRandom(world, "missed", seed, 400, { time: 4, travel: 1 }, 0.05);
  const q = S.w.quests, ag = S.w.agendas;
  const hist = {}; Object.values(q).forEach(x => { hist[x.status] = (hist[x.status] || 0) + 1; });
  S.report = "quests per status " + JSON.stringify(hist) + "; agenda's: " + Object.values(ag).map(a => a.id + "=" + a.status).join(" ") + "; klokken " + Object.values(S.w.clocks).map(c => c.id + "=" + c.value).join(" ");
  const act = ag["AG-ACT-1"]; if (act && W.dateCmp(S.w.calendar, { y: 3019, m: 4, d: 10 }) > 0 && act.status !== "completed") S.breach("Act-agenda is niet afgerond terwijl het einde van de oorlog voorbij is");
  if (W.dateCmp(S.w.calendar, { y: 3019, m: 3, d: 20 }) > 0 && q["MAIN-A4"] && q["MAIN-A4"].status === "dormant") S.breach("MAIN-A4 is nooit beschikbaar geworden");
  return S;
}
function scenarioDeath(world, seed, turns) {
  const dead = new Set();
  const S = runRandom(world, "death", seed, turns, Object.assign({}, W_LONG, { kill: 2.5 }), 0.1, (s) => { Object.values(s.w.npcs).forEach(n => { if (n.status === "deceased") dead.add(n.id); }); });
  /* na de dood: elke actie op een overledene moet worden geweigerd */
  let refused = 0, tried = 0;
  dead.forEach(id => { const r = W.validateDelta(S.w, { npcs: [{ id: id, op: "update", set: { location: S.w.sceneRegion, goal: "komt terug" } }] }, { round: S.round + 1 }); tried++; if (r.ok) S.breach(id + ": een overledene kan nog worden gewijzigd"); else refused++; });
  Object.keys(S.w.agendas || {}).forEach(id => { const a = S.w.agendas[id], o = S.w.npcs[a.owner]; if (o && o.status === "deceased" && a.status === "active" && S.w.calendar && W.dateCmp(S.w.calendar, a.nextAt || S.w.calendar) > 0) S.breach("agenda " + id + " loopt door na de dood van " + a.owner); });
  S.report = S.kills + " doden gesimuleerd, " + dead.size + " overleden NPC's, " + refused + "/" + tried + " acties op overledenen geweigerd";
  return S;
}
function scenarioRetry(world, seed, turns) {
  const S = runRandom(world, "retry", seed, turns, W_LONG, 0.45, (s) => { if (s.last && s.rnd() < 0.3) { const r = W.validateDelta(s.w, s.last.delta, { round: s.round }); s.replays++; if (r.ok) s.breach("herhaling van een verwerkte ronde werd geaccepteerd"); else s.expectedRejects++; } });
  S.report = S.replays + " herhalingen van een verwerkte ronde, alle geweigerd; " + S.undoChecks + " Terug/Opnieuw-controles";
  return S;
}
function scenarioSplit(world, seed) {
  const S = makeSim(world, seed, "split"), w = () => S.w, step = (d, l) => S.submit(d, l, "ok"), must = (d, l, frag) => { const r = S.submit(d, l, "reject"); if (r.ok) return; if (frag && r.errors.join(" ").toLowerCase().indexOf(frag) < 0) S.breach(l + ": verkeerde reden: " + r.errors.join(" | ")); };
  const ids = ["CMP-R03", "CMP-R01"];
  ids.forEach(id => { step({ npcs: [{ id: id, op: "update", set: { introduced: true } }] }, "voorstellen " + id); [["named", "recurring"], ["recurring", "companion_candidate"]].forEach(p => { if (w().npcs[id].status === p[0]) step({ npcs: [{ id: id, op: "update", set: { status: p[1] }, reason: "De spelers hebben veel met hem te maken" }] }, "promotie " + id); }); });
  ids.forEach(id => step({ companions: [{ id: id, op: "recruit", mode: "permanent", reason: "Gedeeld belang voor de reis" }] }, "recruteren " + id));
  must({ region: "REG-GONDOR" }, "teleport naar Gondor", "kan niet in");
  step({ time: { to: addDays(w().calendar, 4), reason: "reis naar Eriador", worldTick: true }, region: "REG-ERIADOR" }, "reis naar Eriador");
  ids.forEach(id => { if (regionOf(w(), w().npcs[id].location) !== "REG-ERIADOR") S.breach(id + " reisde niet mee"); });
  /* de groep splitst: Brynja blijft in Eriador, de rest gaat naar het gebergte */
  step({ companions: [{ id: "CMP-R03", op: "depart", reason: "Blijft bij de achterblijvers in Eriador", destination: "REG-ERIADOR", returnIf: "de groep weer samenkomt" }] }, "splitsen");
  step({ time: { to: addDays(w().calendar, 4), reason: "reis naar het gebergte", worldTick: true }, region: "REG-MISTY" }, "reis naar het gebergte");
  if (regionOf(w(), w().npcs["CMP-R01"].location) !== "REG-MISTY") S.breach("Lírien reisde niet mee met de groep");
  if (regionOf(w(), w().npcs["CMP-R03"].location) !== "REG-ERIADOR") S.breach("Brynja is niet bij de achterblijvers");
  must({ companions: [{ id: "CMP-R03", op: "update", hp: { delta: -3 } }] }, "gevecht met een afwezige companion", "vertrokken");
  step({ companions: [{ id: "CMP-R01", op: "depart", reason: "Lírien haalt voorraad in Rivendell", destination: "REG-RIVENDELL", returnIf: "ze terug is met voorraad" }] }, "boodschap van Lírien");
  must({ companions: [{ id: "CMP-R01", op: "return", reason: "Ze is meteen weer terug" }] }, "directe terugkeer", "kan niet in");
  step({ time: { to: addDays(w().calendar, 4), reason: "De groepen komen weer samen", worldTick: true }, companions: [{ id: "CMP-R03", op: "return", reason: "De groepen komen weer samen" }, { id: "CMP-R01", op: "return", reason: "Terug met voorraad" }] }, "terugkeer na reistijd");
  if (regionOf(w(), w().npcs["CMP-R03"].location) !== "REG-MISTY") S.breach("Brynja is niet bij de herenigde groep");
  must({ time: { to: addDays(w().calendar, 1), reason: "snel naar Gondor", worldTick: true }, region: "REG-GONDOR" }, "te snelle reis", "kan niet in");
  S.report = "splitsing, aparte reistijd en hereniging doorlopen; " + S.accepted + " beurten geaccepteerd";
  return S;
}

/* ---------- main ---------- */
function main() {
  const world = loadWorld(); if (!world || !world.calendar) throw new Error("Geen geldige wereld geladen");
  const which = typeof flags.scenario === "string" ? flags.scenario : "all", seed = Number(flags.seed) || 7, turns = Number(flags.turns) || 700;
  const list = which === "all" ? ["long", "missed", "death", "split", "retry"] : [which];
  const fns = { long: () => scenarioLong(world, seed, turns), missed: () => scenarioMissed(world, seed), death: () => scenarioDeath(world, seed + 1, turns), split: () => scenarioSplit(world, seed), retry: () => scenarioRetry(world, seed + 2, turns) };
  let fail = 0; const t0 = Date.now();
  list.forEach(nm => {
    if (!fns[nm]) throw new Error("Onbekend scenario " + nm);
    const S = fns[nm]();
    const un = Object.keys(S.unexpected).map(k => S.unexpected[k] + "x " + k).join("; ");
    console.log("\n== " + nm + " (seed " + seed + ") ==");
    console.log("einddatum " + fmt(S.w.calendar) + " | beurten geaccepteerd " + S.accepted + ", geweigerd " + S.rejected + " (opzettelijk fout: " + S.expectedRejects + ") | Terug/Opnieuw-controles " + S.undoChecks + " | context max " + S.ctxMax + " tekens (gem " + Math.round(S.ctxSum / Math.max(1, S.ctxN)) + ")");
    if (S.report) console.log(S.report);
    const q = {}; Object.values(S.w.quests).forEach(x => { q[x.status] = (q[x.status] || 0) + 1; });
    if (nm === "long") console.log("quests " + JSON.stringify(q) + " | companions actief " + Object.values(S.w.companions || {}).filter(r => r.stage === "active").length + ", onthulde lagen " + Object.values(S.w.backstories || {}).reduce((a, b) => a + Object.keys(b.revealed || {}).length, 0) + " | events " + Object.keys(S.w.events || {}).length + " | jobs " + Object.keys(S.w.jobs || {}).length);
    if (nm === "long") { const e = W.evaluateEndings(S.w); console.log("afloop: " + (e.pending ? "nog niet beslist" : e.candidates.map(c => c.label).join(", "))); }
    if (!flags.quiet && un) console.log("onverwacht geweigerde goede zetten: " + un + (S.lastUnexpected ? "\n  laatste: " + S.lastUnexpected.slice(0, 260) : ""));
    if (S.ctxMax > 14000) { S.breach("context te groot: " + S.ctxMax + " tekens"); }
    if (S.breaches.length) { fail++; console.log("SCHENDINGEN (" + S.breaches.length + "):\n  - " + S.breaches.slice(0, 8).join("\n  - ")); } else console.log("geen schendingen");
  });
  console.log("\n" + (fail ? fail + " scenario(s) met schendingen" : "alle scenario's zonder schendingen") + " in " + ((Date.now() - t0) / 1000).toFixed(1) + " s");
  process.exit(fail ? 1 : 0);
}
try { main(); } catch (e) { console.error("Fout: " + e.message); process.exit(2); }
