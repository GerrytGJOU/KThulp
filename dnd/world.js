/* Wereldmodel en consistentiecontrole voor de Midden-aarde D&D-app (dnd/).
   Eén bestand dat zowel in de browser (window.DNDWorld) als in Node (require) werkt.
   Het model: stabiele IDs, NPC-levenscyclus, quest-levenscyclus, klokken, kalender en een eventlog.
   validateDelta() controleert een door de DM voorgestelde wijziging (worldDelta) tegen de actuele wereld en
   geeft een plan terug dat de app atomair kan opslaan. Geen geheimen in dit bestand. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.DNDWorld = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  const NPC_STATUS = ["ambient", "named", "recurring", "companion_candidate", "recruited", "inactive", "departed", "deceased"];
  const NPC_RANK = { ambient: 0, named: 1, recurring: 2, companion_candidate: 3, recruited: 4 };
  const QUEST_STATUS = ["dormant", "available", "active", "completed", "failed", "expired", "changed"];
  const QUEST_NEXT = {
    dormant: ["available", "active", "expired", "changed"],
    available: ["dormant", "active", "expired", "changed"],
    active: ["completed", "failed", "expired", "changed"],
    completed: [], failed: [], expired: [], changed: []
  };
  const CANON_TAGS = ["B", "C", "I", "N", "V"]; // B bestaand, C Tolkien-canon, I interpretatie, N nieuw (ingevoerd in spel), V voorstel
  const ID_RE = /^[A-Z]{2,5}-[A-Z0-9][A-Z0-9-]*$/;

  /* Reistijd in dagen (ondergrens: snelst aannemelijk, te paard of per boot); schattingen, niet uit de boeken afgeleid. */
  const TRAVEL = {
    "REG-RIVENDELL|REG-ERIADOR": 3, "REG-RIVENDELL|REG-MISTY": 2, "REG-RIVENDELL|REG-ANDUIN": 8,
    "REG-ERIADOR|REG-SHIRE": 5, "REG-ERIADOR|REG-MISTY": 4, "REG-MISTY|REG-ANDUIN": 4,
    "REG-ANDUIN|REG-MIRKWOOD": 2, "REG-ANDUIN|REG-EREBOR": 6, "REG-MIRKWOOD|REG-EREBOR": 5,
    "REG-RIVENDELL|REG-MIRKWOOD": 10, "REG-RIVENDELL|REG-EREBOR": 14, "REG-RIVENDELL|REG-ROHAN": 18,
    "REG-RIVENDELL|REG-GONDOR": 30, "REG-ROHAN|REG-GONDOR": 6, "REG-ERIADOR|REG-ROHAN": 16, "REG-ERIADOR|REG-GONDOR": 28,
    "REG-MISTY|REG-ROHAN": 12, "REG-ANDUIN|REG-ROHAN": 10, "REG-ANDUIN|REG-GONDOR": 20
  };
  const FELLOWSHIP = ["TOL-FRODO", "TOL-SAM", "TOL-MERRY", "TOL-PIPPIN", "TOL-GANDALF", "TOL-ARAGORN", "TOL-LEGOLAS", "TOL-GIMLI", "TOL-BOROMIR"];
  /* Canon-ankers: wie mag na welke datum niet meer in Rivendell zijn (tenzij een afwijking is vastgelegd). */
  const LEFT_RIVENDELL = { date: { y: 3018, m: 12, d: 25 }, ids: FELLOWSHIP, region: "REG-RIVENDELL", note: "Fellowship vertrekt op 25 december 3018" };

  const clone = o => JSON.parse(JSON.stringify(o));
  const isObj = o => o && typeof o === "object" && !Array.isArray(o);
  function dateOk(d) { return isObj(d) && Number.isInteger(d.y) && Number.isInteger(d.m) && Number.isInteger(d.d) && d.m >= 1 && d.m <= 12 && d.d >= 1 && d.d <= 31; }
  function days(d) { return Math.floor(Date.UTC(d.y, d.m - 1, d.d) / 86400000); }
  function dateCmp(a, b) { return days(a) - days(b); }
  function fmt(d) { return d.d + "-" + d.m + "-" + d.y; }
  function regionOf(world, loc) {
    if (!loc) return null;
    if (String(loc).indexOf("REG-") === 0) return loc;
    const l = world.locations && world.locations[loc];
    return l ? l.region || null : null;
  }
  function travelDays(a, b) {
    if (!a || !b || a === b) return 0;
    const k1 = a + "|" + b, k2 = b + "|" + a;
    return TRAVEL[k1] != null ? TRAVEL[k1] : (TRAVEL[k2] != null ? TRAVEL[k2] : null);
  }
  const reasonOk = r => typeof r === "string" && r.trim().length >= 5;

  /* ---------- controle van een worldDelta ---------- */
  function validateDelta(world, delta, ctx) {
    ctx = ctx || {};
    const errors = [], warnings = [];
    const plan = { calendar: null, npcs: {}, quests: {}, clocks: {}, events: [], divergences: [] };
    const W = clone(world || {});
    W.npcs = W.npcs || {}; W.quests = W.quests || {}; W.clocks = W.clocks || {}; W.locations = W.locations || {}; W.factions = W.factions || {};
    const touched = { npcs: {}, quests: {}, clocks: {} };
    const err = m => errors.push(m), warn = m => warnings.push(m);
    delta = isObj(delta) ? delta : {};
    let now = W.calendar && dateOk(W.calendar) ? clone(W.calendar) : null;

    /* tijd */
    if (delta.time != null) {
      const t = delta.time;
      if (!isObj(t) || !dateOk(t.to)) err("time.to is geen geldige datum {y,m,d}");
      else if (!now) { now = clone(t.to); plan.calendar = clone(t.to); }
      else {
        const dd = dateCmp(t.to, now);
        if (dd < 0) err("Tijd mag niet teruggaan (" + fmt(t.to) + " ligt vóór " + fmt(now) + ")");
        else {
          if (dd > 21 && t.worldTick !== true) err("Tijdsprong van " + dd + " dagen vereist time.worldTick:true");
          if (dd > 0 && !reasonOk(t.reason)) err("Tijdsprong vereist een time.reason");
          if (dd > 0) { now = clone(t.to); plan.calendar = clone(t.to); }
        }
      }
    }

    function eventFor(kind, summary, refs, canon, extra) {
      plan.events.push(Object.assign({ type: kind, summary: summary, refs: refs || {}, canon: canon || "V", ingame: now || null, round: ctx.round || null, auto: true }, extra || {}));
    }
    const exists = (kind, id) => !!(W[kind] && W[kind][id]);

    /* NPC's */
    (Array.isArray(delta.npcs) ? delta.npcs : []).forEach(op => {
      if (!isObj(op) || typeof op.id !== "string") return err("npcs: elk item heeft een id nodig");
      const id = op.id;
      if (!ID_RE.test(id)) return err("npc-id '" + id + "' heeft geen geldig formaat (bv. NPC-E05)");
      const set = isObj(op.set) ? op.set : {};
      const cur = W.npcs[id];
      if (op.op === "create") {
        if (cur) return err("NPC " + id + " bestaat al (gebruik op:'update')");
        if (typeof set.name !== "string" || !set.name.trim()) return err("NPC " + id + ": naam ontbreekt");
        if (CANON_TAGS.indexOf(set.canon) < 0) return err("NPC " + id + ": canon moet B/C/I/N/V zijn");
        if (set.tolkien === true) return err("NPC " + id + ": Tolkien-figuren worden niet in het spel aangemaakt");
        const dup = Object.values(W.npcs).find(n => String(n.name).toLowerCase() === set.name.trim().toLowerCase());
        if (dup) return err("NPC-naam '" + set.name + "' bestaat al als " + dup.id);
        const st = set.status || "named";
        if (NPC_STATUS.indexOf(st) < 0) return err("NPC " + id + ": onbekende status " + st);
        if (set.location && !regionOf(W, set.location)) return err("NPC " + id + ": onbekende locatie " + set.location);
        const rec = Object.assign({ id: id, name: set.name.trim(), status: st, canon: set.canon, location: null, knows: [], tolkien: false }, set);
        rec.name = set.name.trim(); rec.status = st;
        if (rec.location && now) rec.locationSince = clone(now);
        W.npcs[id] = rec; plan.npcs[id] = rec; touched.npcs[id] = true;
        eventFor("npc_created", rec.name + " (" + id + ") aangemaakt als " + st, { npcs: [id] }, set.canon);
        return;
      }
      if (op.op !== "update") return err("NPC " + id + ": op moet 'create' of 'update' zijn");
      if (!cur) return err("NPC " + id + " bestaat niet (eerst create)");
      const next = clone(cur);
      if (cur.status === "deceased") {
        if (Object.keys(set).some(k => k !== "knows" && k !== "note")) return err("NPC " + id + " (" + cur.name + ") is overleden en kan niet meer wijzigen of verschijnen");
        return;
      }
      if (set.status != null && set.status !== cur.status) {
        if (NPC_STATUS.indexOf(set.status) < 0) return err("NPC " + id + ": onbekende status " + set.status);
        const a = NPC_RANK[cur.status], b = NPC_RANK[set.status];
        if (a != null && b != null && b < a) err("NPC " + id + ": status mag niet terug van " + cur.status + " naar " + set.status);
        if (a != null && b != null && b > a + 1 && !reasonOk(op.reason)) err("NPC " + id + ": overslaan van promotiestappen (" + cur.status + " → " + set.status + ") vereist een reason");
        if (set.status === "recruited" && cur.status !== "companion_candidate" && cur.status !== "departed" && cur.status !== "inactive" && !reasonOk(op.reason)) err("NPC " + id + ": recruteren vereist eerst companion_candidate of een reason");
        if (set.status === "deceased" && !reasonOk(op.reason)) err("NPC " + id + ": overlijden vereist een reason");
        next.status = set.status;
        eventFor("npc_status", cur.name + ": " + cur.status + " → " + set.status + (op.reason ? " (" + op.reason + ")" : ""), { npcs: [id] }, "V");
      }
      if (set.location != null && set.location !== cur.location) {
        const to = regionOf(W, set.location);
        if (!to) err("NPC " + id + ": onbekende locatie " + set.location);
        else {
          const from = regionOf(W, cur.location);
          if (from && to !== from && now && cur.locationSince) {
            const need = travelDays(from, to), spent = dateCmp(now, cur.locationSince);
            if (need == null) warn("NPC " + id + ": reistijd " + from + " → " + to + " onbekend");
            else if (spent < need && !(isObj(op.travel) && reasonOk(op.travel.reason))) err("NPC " + id + " (" + cur.name + ") kan niet in " + spent + " dag(en) van " + from + " naar " + to + " reizen (minimaal ~" + need + " dagen)");
          }
          next.location = set.location;
          if (now) next.locationSince = clone(now);
        }
      }
      ["goal", "availability", "attitude", "note", "name"].forEach(k => { if (set[k] != null && k !== "name") next[k] = set[k]; });
      if (Array.isArray(set.knows)) next.knows = (cur.knows || []).concat(set.knows).filter((v, i, a) => a.indexOf(v) === i);
      W.npcs[id] = next; plan.npcs[id] = next; touched.npcs[id] = true;
    });

    /* quests */
    (Array.isArray(delta.quests) ? delta.quests : []).forEach(op => {
      if (!isObj(op) || typeof op.id !== "string") return err("quests: elk item heeft een id nodig");
      const id = op.id, set = isObj(op.set) ? op.set : {}, cur = W.quests[id];
      if (!ID_RE.test(id)) return err("quest-id '" + id + "' heeft geen geldig formaat (bv. DQ-0001)");
      if (op.op === "create") {
        if (cur) return err("Quest " + id + " bestaat al");
        ["title", "hook", "region", "ifIgnored"].forEach(k => { if (typeof set[k] !== "string" || !set[k].trim()) err("Quest " + id + ": " + k + " ontbreekt"); });
        if (set.region && !regionOf(W, set.region)) err("Quest " + id + ": onbekende regio " + set.region);
        if (!(dateOk(set.expires) || set.open === true)) err("Quest " + id + ": expires {y,m,d} of open:true ontbreekt");
        if (CANON_TAGS.indexOf(set.canon) < 0) err("Quest " + id + ": canon moet B/C/I/N/V zijn");
        const dup = Object.values(W.quests).find(q => String(q.title).toLowerCase() === String(set.title || "").trim().toLowerCase());
        if (dup) err("Quest-titel bestaat al als " + dup.id);
        (Array.isArray(set.npcs) ? set.npcs : []).forEach(n => { if (!exists("npcs", n)) err("Quest " + id + ": onbekende NPC " + n); });
        if (errors.length) return;
        const rec = Object.assign({ id: id, status: "available", kind: "dynamic", history: [] }, set);
        if (QUEST_STATUS.indexOf(rec.status) < 0) return err("Quest " + id + ": onbekende status");
        W.quests[id] = rec; plan.quests[id] = rec; touched.quests[id] = true;
        eventFor("quest_created", "Quest " + id + " '" + rec.title + "' aangemaakt", { quests: [id] }, set.canon);
        return;
      }
      if (op.op !== "update") return err("Quest " + id + ": op moet 'create' of 'update' zijn");
      if (!cur) return err("Quest " + id + " bestaat niet");
      const next = clone(cur);
      if (set.status != null && set.status !== cur.status) {
        if (QUEST_STATUS.indexOf(set.status) < 0) return err("Quest " + id + ": onbekende status " + set.status);
        if (QUEST_NEXT[cur.status].indexOf(set.status) < 0) return err("Quest " + id + ": overgang " + cur.status + " → " + set.status + " is niet toegestaan");
        if (set.status === "active" && cur.expires && now && dateCmp(now, cur.expires) > 0) return err("Quest " + id + " is verlopen (" + fmt(cur.expires) + ") en kan niet meer starten");
        if (!reasonOk(op.reason)) return err("Quest " + id + ": statuswijziging vereist een reason");
        if (set.status === "changed" && !(typeof set.changedTo === "string" && exists("quests", set.changedTo))) return err("Quest " + id + ": 'changed' vereist changedTo met een bestaande quest");
        next.status = set.status; if (set.changedTo) next.changedTo = set.changedTo;
        next.history = (cur.history || []).concat([{ status: set.status, at: now, reason: op.reason }]);
        eventFor("quest_status", "Quest " + id + ": " + cur.status + " → " + set.status + " (" + op.reason + ")", { quests: [id] }, "V");
      }
      ["hook", "ifIgnored", "region"].forEach(k => { if (set[k] != null) next[k] = set[k]; });
      if (Array.isArray(set.clues)) next.clues = (cur.clues || []).concat(set.clues).filter((v, i, a) => a.indexOf(v) === i);
      W.quests[id] = next; plan.quests[id] = next; touched.quests[id] = true;
    });

    /* klokken */
    (Array.isArray(delta.clocks) ? delta.clocks : []).forEach(op => {
      if (!isObj(op) || typeof op.id !== "string") return err("clocks: elk item heeft een id nodig");
      const c = W.clocks[op.id];
      if (!c) return err("Klok " + op.id + " bestaat niet");
      if (!Number.isInteger(op.delta) || op.delta === 0 || Math.abs(op.delta) > 2) return err("Klok " + op.id + ": delta moet 1 of 2 (of -1, -2) zijn");
      if (!reasonOk(op.reason)) return err("Klok " + op.id + ": een wijziging vereist een reason");
      const max = c.max != null ? c.max : 6, v = c.value + op.delta;
      if (v < 0 || v > max) return err("Klok " + op.id + ": waarde " + v + " valt buiten 0-" + max);
      const next = Object.assign({}, c, { value: v });
      W.clocks[op.id] = next; plan.clocks[op.id] = next; touched.clocks[op.id] = true;
      eventFor("clock", "Klok " + op.id + " " + (op.delta > 0 ? "+" : "") + op.delta + " → " + v + " (" + op.reason + ")", {}, "V", { clock: op.id });
    });

    /* vrije events (bv. afwijkingen van de canon) */
    (Array.isArray(delta.events) ? delta.events : []).forEach(e => {
      if (!isObj(e) || typeof e.type !== "string" || typeof e.summary !== "string" || e.summary.trim().length < 5) return err("events: type en summary (≥5 tekens) zijn verplicht");
      const refs = isObj(e.refs) ? e.refs : {};
      ["npcs", "quests"].forEach(k => (Array.isArray(refs[k]) ? refs[k] : []).forEach(id => { if (!exists(k, id)) err("Event verwijst naar onbekende " + k.slice(0, -1) + " " + id); }));
      if (e.divergence === true) {
        if (!reasonOk(e.cause)) return err("Een canon-afwijking vereist een cause (oorzaak)");
        plan.divergences.push({ at: now, cause: e.cause, summary: e.summary });
      }
      plan.events.push({ type: e.type, summary: e.summary.trim(), refs: refs, canon: CANON_TAGS.indexOf(e.canon) >= 0 ? e.canon : "N", ingame: now || null, round: ctx.round || null, divergence: e.divergence === true });
    });

    /* canon-anker: Fellowship-leden verlaten Rivendell op 25 december 3018 */
    const divergent = plan.divergences.length > 0 || (W.divergences && Object.keys(W.divergences).length > 0);
    if (now && !divergent && dateCmp(now, LEFT_RIVENDELL.date) > 0) {
      Object.keys(plan.npcs).forEach(id => {
        const n = plan.npcs[id];
        if (LEFT_RIVENDELL.ids.indexOf(id) >= 0 && regionOf(W, n.location) === LEFT_RIVENDELL.region) err(n.name + " kan na 25 december 3018 niet in Rivendell zijn zonder vastgelegde canon-afwijking (" + LEFT_RIVENDELL.note + ")");
      });
    }

    /* verlopen quests bij tijdsverloop */
    if (now && plan.calendar) {
      Object.values(W.quests).forEach(q => {
        if ((q.status === "available" || q.status === "dormant") && q.expires && dateOk(q.expires) && dateCmp(now, q.expires) > 0 && !plan.quests[q.id]) {
          const n = Object.assign({}, q, { status: "expired", history: (q.history || []).concat([{ status: "expired", at: now, reason: "verlopen op " + fmt(q.expires) }]) });
          plan.quests[q.id] = n;
          eventFor("quest_status", "Quest " + q.id + " is verlopen (" + fmt(q.expires) + "): " + (q.ifIgnored || "gevolg onbekend"), { quests: [q.id] }, "V");
          warn("Quest " + q.id + " verlopen: " + (q.ifIgnored || ""));
        }
      });
    }
    return { ok: errors.length === 0, errors: errors, warnings: warnings, plan: plan };
  }

  /* ---------- compacte wereldcontext voor de DM ---------- */
  function worldContext(world, opts) {
    opts = opts || {};
    const hay = String(opts.hay || "").toLowerCase(), max = opts.maxChars || 4000;
    if (!world) return "";
    const out = [];
    if (world.calendar && dateOk(world.calendar)) out.push("Datum: " + fmt(world.calendar) + (world.calendar.tod ? " (" + world.calendar.tod + ")" : ""));
    const clocks = Object.values(world.clocks || {});
    if (clocks.length) out.push("Klokken: " + clocks.map(c => c.id + "=" + c.value + "/" + (c.max != null ? c.max : 6) + " " + (c.label || "")).join("; "));
    const here = opts.region ? String(opts.region) : null;
    const quests = Object.values(world.quests || {}).filter(q => q.status === "active" || q.status === "available" || hay.indexOf(q.id.toLowerCase()) >= 0 || (q.title && hay.indexOf(String(q.title).toLowerCase()) >= 0))
      .filter(q => q.status === "active" || !here || !q.region || q.region === here || hay.indexOf(q.id.toLowerCase()) >= 0 || q.kind === "main");
    if (quests.length) out.push("Quests:\n" + quests.slice(0, 14).map(q => "- " + q.id + " [" + q.status + "] " + q.title + (q.region ? " @" + q.region : "") + (q.expires && dateOk(q.expires) ? " tot " + fmt(q.expires) : "")).join("\n"));
    const npcs = Object.values(world.npcs || {}).filter(n => n.status !== "deceased" || hay.indexOf(String(n.name).toLowerCase()) >= 0)
      .filter(n => n.status === "recruited" || hay.indexOf(String(n.name).toLowerCase()) >= 0 || hay.indexOf(n.id.toLowerCase()) >= 0 || (here && regionOf(world, n.location) === here && n.status !== "ambient" && !n.tolkien));
    if (npcs.length) out.push("NPC's (id, status, plek):\n" + npcs.slice(0, 24).map(n => "- " + n.id + " " + n.name + " [" + n.status + (n.status === "deceased" ? ", OVERLEDEN" : "") + "] @" + (n.location || "?")).join("\n"));
    const dead = Object.values(world.npcs || {}).filter(n => n.status === "deceased").map(n => n.name);
    if (dead.length) out.push("Overleden (niet laten terugkomen): " + dead.join(", "));
    return out.join("\n").slice(0, max);
  }

  /* ---------- statische controle van een hele wereld (verwijzingen, statussen, tijdlijn) ---------- */
  function auditWorld(world) {
    const issues = [];
    const W = world || {};
    const npcs = W.npcs || {}, quests = W.quests || {}, clocks = W.clocks || {}, locs = W.locations || {}, facs = W.factions || {};
    const bad = (kind, id, msg) => issues.push({ level: "fout", kind: kind, id: id, msg: msg });
    const note = (kind, id, msg) => issues.push({ level: "let op", kind: kind, id: id, msg: msg });
    if (!(W.calendar && dateOk(W.calendar))) bad("kalender", "-", "geen geldige kalender");
    Object.keys(npcs).forEach(id => {
      const n = npcs[id];
      if (!ID_RE.test(id) || n.id !== id) bad("npc", id, "id komt niet overeen met de sleutel of heeft een ongeldig formaat");
      if (NPC_STATUS.indexOf(n.status) < 0) bad("npc", id, "onbekende status " + n.status);
      if (n.location && !regionOf(W, n.location)) bad("npc", id, "onbekende locatie " + n.location);
      if (n.status === "deceased" && n.location) note("npc", id, n.name + " is overleden maar heeft nog een locatie");
      if (CANON_TAGS.indexOf(n.canon) < 0) bad("npc", id, "canon-tag ontbreekt of ongeldig");
      if (n.tolkien && n.canon !== "C") note("npc", id, "Tolkien-figuur zonder canon-tag C");
    });
    Object.keys(quests).forEach(id => {
      const q = quests[id];
      if (!ID_RE.test(id) || q.id !== id) bad("quest", id, "id komt niet overeen of ongeldig formaat");
      if (QUEST_STATUS.indexOf(q.status) < 0) bad("quest", id, "onbekende status " + q.status);
      if (q.region && !regionOf(W, q.region)) bad("quest", id, "onbekende regio " + q.region);
      (Array.isArray(q.npcs) ? q.npcs : []).forEach(n => { if (!npcs[n]) bad("quest", id, "verwijst naar onbekende NPC " + n); });
      if (q.status === "changed" && !quests[q.changedTo]) bad("quest", id, "changedTo wijst naar een onbekende quest");
      if (!q.open && !dateOk(q.expires) && ["available", "active", "dormant"].indexOf(q.status) >= 0) note("quest", id, "geen expires en niet open: kan nooit verlopen");
      if (q.expires && dateOk(q.expires) && W.calendar && dateOk(W.calendar) && dateCmp(W.calendar, q.expires) > 0 && (q.status === "available" || q.status === "dormant")) bad("quest", id, "verlopen op " + fmt(q.expires) + " maar nog " + q.status);
      if (!q.ifIgnored && ["available", "active", "dormant"].indexOf(q.status) >= 0 && q.kind !== "main") note("quest", id, "geen ifIgnored: gevolg bij negeren ontbreekt");
    });
    Object.keys(clocks).forEach(id => { const c = clocks[id]; if (!(c.value >= 0 && c.value <= (c.max != null ? c.max : 6))) bad("klok", id, "waarde buiten bereik"); });
    Object.keys(locs).forEach(id => { if (!locs[id].region) bad("locatie", id, "regio ontbreekt"); });
    const ev = W.events || {};
    Object.keys(ev).forEach(k => {
      const r = ev[k].refs || {};
      (r.npcs || []).forEach(n => { if (!npcs[n]) bad("event", k, "verwijst naar onbekende NPC " + n); });
      (r.quests || []).forEach(q => { if (!quests[q]) bad("event", k, "verwijst naar onbekende quest " + q); });
    });
    Object.keys(facs).forEach(id => { if (!ID_RE.test(id)) bad("factie", id, "ongeldig id-formaat"); });
    return issues;
  }

  /* ---------- plan omzetten naar opslagpaden (met herstelgegevens voor 'Terug') ---------- */
  function getPath(obj, path) { return path.split("/").reduce((a, k) => (a == null ? undefined : a[k]), obj); }
  function commitPaths(world, plan, opts) {
    opts = opts || {};
    const set = {}, prev = [];
    const put = (path, val) => { const cur = getPath(world || {}, path.replace(/^world\//, "")); prev.push({ p: path, v: cur === undefined ? null : cur }); set[path] = val; };
    Object.keys(plan.npcs).forEach(id => put("world/npcs/" + id, plan.npcs[id]));
    Object.keys(plan.quests).forEach(id => put("world/quests/" + id, plan.quests[id]));
    Object.keys(plan.clocks).forEach(id => put("world/clocks/" + id, plan.clocks[id]));
    if (plan.calendar) put("world/calendar", plan.calendar);
    plan.divergences.forEach(d => { const k = opts.newKey(); prev.push({ p: "world/divergences/" + k, v: null }); set["world/divergences/" + k] = d; });
    plan.events.forEach(ev => { const k = opts.newKey(); prev.push({ p: "world/events/" + k, v: null }); set["world/events/" + k] = Object.assign({ t: opts.now || null }, ev); });
    if (typeof opts.region === "string" && /^REG-[A-Z]+$/.test(opts.region)) put("world/sceneRegion", opts.region);
    return { set: set, prev: prev };
  }

  return { NPC_STATUS: NPC_STATUS, QUEST_STATUS: QUEST_STATUS, QUEST_NEXT: QUEST_NEXT, ID_RE: ID_RE, TRAVEL: TRAVEL, FELLOWSHIP: FELLOWSHIP, validateDelta: validateDelta, auditWorld: auditWorld, commitPaths: commitPaths, worldContext: worldContext, travelDays: travelDays, regionOf: regionOf, dateCmp: dateCmp, dateOk: dateOk };
});
