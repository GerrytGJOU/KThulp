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
  /* Companion-engine (Bible §15): npc.status blijft de levenscyclus (companion_candidate → recruited ⇄ departed, deceased);
     world/companions/{CMP-id} bewaart het combat-statblock-gedeelte: hp, hulpbronnen, conditions, bewijslogboek (geen vertrouwensmeter),
     vertrek/terugkeer, weigering en een verplichting die een vertrek kan afdwingen. */
  const COMPANION_OPS = ["recruit", "decline", "depart", "return", "update", "rest"];
  const COMPANION_MODES = ["permanent", "etappe", "temporary", "contact", "remote"];
  const COMPANION_STAGES = ["candidate", "active", "departed", "deceased"];
  const PARTY_SOFT_LIMIT = 5; // reizigers incl. 2 PC's: richtwaarde (Bible §15.2), geen harde limiet
  /* Job-wachtrij (Bible 15.5/15.7): asynchroon, idempotent, blokkeert het verhaal nooit en wijzigt nooit spelstatus.
     Jobs ontstaan automatisch bij NPC-promotie (validateDelta); de DM kan ze niet aanmaken of wijzigen. Een runner
     (dnd/tools/jobs.js) claimt ze met een lease en rondt ze af. */
  const JOB_TYPES = ["portrait", "profile", "statblock", "location"];
  const JOB_STATUS = ["queued", "claimed", "done", "failed", "blocked", "cancelled"];
  const JOB_NEXT = { queued: ["claimed", "blocked", "cancelled"], claimed: ["done", "failed", "queued", "cancelled"], failed: ["queued", "cancelled"], blocked: ["queued", "cancelled"], done: [], cancelled: [] };
  const JOB_TAG = { portrait: "PORT", profile: "PROF", statblock: "STAT", location: "LOC" };
  const JOB_MAX_ATTEMPTS = 3;
  const jobId = (type, subject, version) => "JOB-" + JOB_TAG[type] + "-" + subject + (version > 1 ? "-V" + version : "");
  /* Factie-agenda's en NPC-acties buiten beeld (Bible 08/09): een agenda is een korte reeks stappen van een factie of NPC.
     Bij een tijdsprong voert de engine alle stappen uit die inmiddels aan de beurt zijn (deterministisch, begrensd, nooit alwetend):
     klokken, NPC-verplaatsingen (met reistijd), quests die beschikbaar worden en een DM-only event. Spelers kunnen een agenda
     dwarsbomen (thwartedBy / DM-op thwart), pauzeren of vertragen. Geen stap zonder reden, geen teleport, geen overleden actoren. */
  const AGENDA_STATUS = ["active", "paused", "completed", "thwarted", "cancelled"];
  const AGENDA_OPS = ["create", "thwart", "pause", "resume", "delay"];
  const AGENDA_MAX_STEPS = 6, AGENDA_TICK_GUARD = 8;
  const addDays = (d, n) => { const x = new Date(Date.UTC(d.y, d.m - 1, d.d + n)); return { y: x.getUTCFullYear(), m: x.getUTCMonth() + 1, d: x.getUTCDate() }; };
  /* Gelaagde achtergronden (Baldur's Gate-stijl): elke NPC heeft een verhaalrol, een eigen quest en lagen die pas worden onthuld
     als de voorwaarde (gate) klopt. De DM ziet de tekst van een volgende laag pas als de gate vervuld is; lagen gaan op volgorde. */
  const GATE_TYPES = ["met", "evidence", "quest", "stage", "date", "free"];
  function gateOk(W, npcId, gate, now) {
    if (!isObj(gate)) return false;
    const npc = (W.npcs || {})[npcId] || {};
    if (gate.t === "met") return npc.introduced === true || npc.status === "recruited";
    if (gate.t === "evidence") { const r = (W.companions || {})[npcId]; return !!(r && r.stage === "active" && (r.evidence || []).length >= (gate.min || 1)); }
    if (gate.t === "quest") { const q = (W.quests || {})[gate.id]; return !!(q && q.status === gate.status); }
    if (gate.t === "stage") { const q = (W.quests || {})[gate.quest]; return !!(q && (q.stage || 0) >= (gate.min || 1)); }
    if (gate.t === "date") return !!(now && dateOk(gate) && dateCmp(now, gate) >= 0);
    return gate.t === "free";
  }
  function gateText(g) {
    if (!isObj(g)) return "onbekend";
    if (g.t === "met") return "de spelers moeten de persoon eerst kennen";
    if (g.t === "evidence") return "minstens " + (g.min || 1) + " concrete ervaring(en) in het bewijslogboek van de actieve companion";
    if (g.t === "quest") return "quest " + g.id + " moet " + g.status + " zijn";
    if (g.t === "stage") return "quest " + g.quest + " moet minstens stap " + (g.min || 1) + " bereikt hebben";
    if (g.t === "date") return "niet vóór " + g.d + "-" + g.m + "-" + g.y;
    return "naar eigen inzicht van de DM, met reden";
  }
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
  /* Ontbrekende regioparen: kortste route over de bekende verbindingen (alleen een ondergrens als er geen directe schatting is). */
  let CLOSURE = null;
  function closure() {
    if (CLOSURE) return CLOSURE;
    const nodes = Object.keys(KNOWN_REGIONS), d = {};
    nodes.forEach(x => { d[x] = {}; nodes.forEach(y => { d[x][y] = x === y ? 0 : Infinity; }); });
    Object.keys(TRAVEL).forEach(k => { const p = k.split("|"); d[p[0]][p[1]] = d[p[1]][p[0]] = TRAVEL[k]; });
    nodes.forEach(k => nodes.forEach(i => nodes.forEach(j => { if (d[i][k] + d[k][j] < d[i][j]) d[i][j] = d[i][k] + d[k][j]; })));
    CLOSURE = d; return d;
  }
  function travelDays(a, b) {
    if (!a || !b || a === b) return 0;
    const k1 = a + "|" + b, k2 = b + "|" + a;
    if (TRAVEL[k1] != null) return TRAVEL[k1];
    if (TRAVEL[k2] != null) return TRAVEL[k2];
    const c = closure(); return c[a] && c[a][b] != null && c[a][b] < Infinity ? c[a][b] : null;
  }
  const knownPlace = (world, loc) => !!loc && (KNOWN_REGIONS[loc] === true || !!(String(loc).indexOf("REG-") !== 0 && regionOf(world, loc)));
  const KNOWN_REGIONS = {}; Object.keys(TRAVEL).forEach(k => k.split("|").forEach(r => { KNOWN_REGIONS[r] = true; }));
  const reasonOk = r => typeof r === "string" && r.trim().length >= 5;

  /* ---------- agenda-tick: voert alle stappen uit die tot en met 'now' aan de beurt zijn ---------- */
  function tickAgendas(world, now) {
    const out = { agendas: {}, clocks: {}, npcs: {}, quests: {}, events: [], warnings: [] };
    if (!world || !now || !dateOk(now)) return out;
    const npcs = clone(world.npcs || {}), quests = clone(world.quests || {}), clocks = clone(world.clocks || {});
    Object.keys(world.agendas || {}).sort().forEach(aid => {
      let a = clone(world.agendas[aid]), changed = false, guard = 0;
      const ev = (type, summary, refs, at, extra) => out.events.push(Object.assign({ type: type, summary: summary, refs: refs || {}, canon: a.canon || "V", ingame: at, visibility: "dm_only", agenda: aid }, extra || {}));
      if (a.status === "active" && npcs[a.owner] && npcs[a.owner].status === "deceased") { a.status = "cancelled"; a.history = (a.history || []).concat([{ at: clone(now), what: "eigenaar overleden" }]); ev("agenda_cancelled", "Agenda " + aid + " '" + a.title + "' stopt: de eigenaar is overleden", {}, clone(now)); out.agendas[aid] = a; return; }
      while (a.status === "active" && a.stepIdx < (a.steps || []).length && dateOk(a.nextAt) && dateCmp(a.nextAt, now) <= 0 && guard++ < AGENDA_TICK_GUARD) {
        const at = clone(a.nextAt), s = a.steps[a.stepIdx], q = id => quests[id] && quests[id].status;
        changed = true;
        if ((a.thwartedBy || []).some(id => q(id) === "completed")) { a.status = "thwarted"; a.history = (a.history || []).concat([{ at: at, what: "dwarsgebomd door afgeronde quest" }]); ev("agenda_thwarted", "Agenda " + aid + " '" + a.title + "' is dwarsgebomd doordat de spelers de aanleiding oplosten" + (a.ifUnopposed ? " (anders: " + a.ifUnopposed + ")" : ""), {}, at); break; }
        if ((a.holdIfActive || []).some(id => q(id) === "active")) { a.nextAt = addDays(a.nextAt, 7); a.history = (a.history || []).concat([{ at: at, what: "uitgesteld: spelers zijn ermee bezig" }]); continue; }
        const refs = { npcs: [], quests: [] }, parts = [];
        if (s.requires && q(s.requires.id) !== s.requires.status) {
          parts.push("overgeslagen: voorwaarde " + s.requires.id + "=" + s.requires.status + " niet vervuld");
        } else {
          (s.clock || []).forEach(c => { const cl = clocks[c.id]; if (!cl) return; const max = cl.max != null ? cl.max : 6, v = Math.max(0, Math.min(max, cl.value + c.delta)); if (v !== cl.value + c.delta) out.warnings.push("Agenda " + aid + ": klok " + c.id + " begrensd op " + v); if (v !== cl.value) { clocks[c.id] = Object.assign({}, cl, { value: v }); out.clocks[c.id] = clocks[c.id]; parts.push(c.id + " " + (c.delta > 0 ? "+" : "") + c.delta + " naar " + v); } });
          (s.moves || []).forEach(m => {
            const n = npcs[m.id]; if (!n) return;
            if (n.status === "deceased" || n.status === "recruited" || n.tolkien === true) { out.warnings.push("Agenda " + aid + ": " + n.name + " (" + (n.tolkien === true ? "Tolkien-figuur, vaste tijdlijn" : n.status) + ") wordt niet verplaatst"); return; }
            const from = regionOf({ locations: world.locations }, n.location), to = regionOf({ locations: world.locations }, m.to);
            if (from && to && from !== to && n.locationSince && dateOk(n.locationSince)) { const need = travelDays(from, to), spent = dateCmp(at, n.locationSince); if (need != null && spent < need) { out.warnings.push("Agenda " + aid + ": " + n.name + " kan niet in " + spent + " dag(en) naar " + to + " (minimaal ~" + need + ")"); parts.push(n.name + " blijft nog onderweg"); return; } }
            npcs[m.id] = Object.assign({}, n, { location: m.to, locationSince: clone(at) }); out.npcs[m.id] = npcs[m.id]; refs.npcs.push(m.id); parts.push(n.name + " naar " + m.to);
          });
          if (s.quest) { const qq = quests[s.quest.id]; if (qq && qq.status === "dormant" && !(dateOk(qq.expires) && dateCmp(at, qq.expires) > 0)) { quests[qq.id] = Object.assign({}, qq, { status: "available", history: (qq.history || []).concat([{ status: "available", at: at, reason: "agenda " + aid }]) }); out.quests[qq.id] = quests[qq.id]; refs.quests.push(qq.id); parts.push("quest " + qq.id + " wordt beschikbaar"); } else out.warnings.push("Agenda " + aid + ": quest " + s.quest.id + " kon niet beschikbaar worden"); }
        }
        a.history = (a.history || []).concat([{ at: at, step: a.stepIdx + 1, what: s.text }]).slice(-12);
        ev("offscreen", "[" + aid + "] " + s.text + (parts.length ? " (" + parts.join("; ") + ")" : ""), refs, at, { step: a.stepIdx + 1, of: a.steps.length });
        a.stepIdx++;
        if (a.stepIdx >= a.steps.length) { a.status = "completed"; ev("agenda_completed", "Agenda " + aid + " '" + a.title + "' is afgerond", {}, at); }
        else a.nextAt = addDays(at, a.steps[a.stepIdx].afterDays);
      }
      if (changed) out.agendas[aid] = a;
    });
    return out;
  }

  /* ---------- controle van een worldDelta ---------- */
  function validateDelta(world, delta, ctx) {
    ctx = ctx || {};
    const errors = [], warnings = [];
    const plan = { calendar: null, npcs: {}, quests: {}, clocks: {}, companions: {}, jobs: {}, agendas: {}, backstories: {}, scene: null, round: null, events: [], divergences: [] };
    const W = clone(world || {});
    W.companions = W.companions || {}; W.jobs = W.jobs || {}; W.agendas = W.agendas || {}; W.backstories = W.backstories || {};
    W.npcs = W.npcs || {}; W.quests = W.quests || {}; W.clocks = W.clocks || {}; W.locations = W.locations || {}; W.factions = W.factions || {};
    const touched = { npcs: {}, quests: {}, clocks: {} };
    const err = m => errors.push(m), warn = m => warnings.push(m);
    delta = isObj(delta) ? delta : {};
    if (Number.isInteger(ctx.round) && Number.isInteger(W.lastRound) && ctx.round <= W.lastRound) err("Ronde " + ctx.round + " is al verwerkt (laatste verwerkte ronde: " + W.lastRound + "); een dubbele indiening wordt niet nogmaals toegepast");
    plan.round = Number.isInteger(ctx.round) ? ctx.round : null;
    if (delta.jobs != null) err("jobs worden door de app beheerd (geef geen jobs mee in de worldDelta)");
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
        if ((/^CMP-/.test(id) || W.companions[id]) && (set.status === "recruited" || set.status === "departed")) return err("NPC " + id + ": gebruik companions op:'" + (set.status === "recruited" ? "recruit" : "depart") + "' voor " + set.status);
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
      ["goal", "availability", "attitude", "note"].forEach(k => { if (set[k] != null) next[k] = set[k]; });
      if (set.introduced === true) next.introduced = true;
      if (Array.isArray(set.knows)) next.knows = (cur.knows || []).concat(set.knows).filter((v, i, a) => a.indexOf(v) === i);
      W.npcs[id] = next; plan.npcs[id] = next; touched.npcs[id] = true;
    });

    /* scene/party: een regiowissel kost reistijd (de party teleporteert niet); live companions reizen mee */
    if (delta.region != null) {
      if (typeof delta.region !== "string" || !/^REG-[A-Z]+$/.test(delta.region)) err("region moet een REG-id zijn (bv. REG-ERIADOR)");
      else if (!KNOWN_REGIONS[delta.region]) warn("Onbekende regio " + delta.region + ": reistijd kan niet worden gecontroleerd");
      if (typeof delta.region === "string" && /^REG-[A-Z]+$/.test(delta.region) && delta.region !== W.sceneRegion) {
        if (W.sceneRegion && W.sceneSince && dateOk(W.sceneSince) && now) {
          const need = travelDays(W.sceneRegion, delta.region), spent = dateCmp(now, W.sceneSince);
          if (need == null) warn("Reistijd " + W.sceneRegion + " naar " + delta.region + " onbekend");
          else if (spent < need && !(isObj(delta.travel) && reasonOk(delta.travel.reason))) err("De party kan niet in " + spent + " dag(en) van " + W.sceneRegion + " naar " + delta.region + " reizen (minimaal ~" + need + " dagen): geef eerst tijd (time) of een travel.reason");
        }
        W.sceneRegion = delta.region; W.sceneSince = now ? clone(now) : null;
        plan.scene = { region: W.sceneRegion, since: W.sceneSince };
        Object.keys(W.companions).forEach(cid => {
          const r = W.companions[cid], n = W.npcs[cid];
          if (r.stage === "active" && r.mode !== "remote" && r.mode !== "contact" && n && n.status === "recruited") { const nn = clone(n); nn.location = W.sceneRegion; if (now) nn.locationSince = clone(now); W.npcs[cid] = nn; plan.npcs[cid] = nn; }
        });
      }
    }

    /* companions */
    const partyRegion = W.sceneRegion || null;
    const activeCount = () => Object.values(W.companions).filter(r => r.stage === "active" && r.mode !== "remote" && r.mode !== "contact").length;
    const resOk = (r, k) => isObj(r) && isObj(r[k]);
    (Array.isArray(delta.companions) ? delta.companions : []).forEach(op => {
      if (!isObj(op) || typeof op.id !== "string") return err("companions: elk item heeft een id nodig");
      const id = op.id, npc = W.npcs[id], rec = W.companions[id];
      if (COMPANION_OPS.indexOf(op.op) < 0) return err("Companion " + id + ": op moet " + COMPANION_OPS.join("/") + " zijn");
      if (!npc) return err("Companion " + id + " bestaat niet als NPC");
      if (npc.status === "deceased") return err("Companion " + id + " (" + npc.name + ") is overleden");
      if (!rec) return err("Companion " + id + " (" + npc.name + ") heeft geen companion-record (statblock); een companion zonder statblock kan niet meedoen aan combat" + (W.jobs[jobId("statblock", id)] ? " (statblock-job " + jobId("statblock", id) + " staat " + W.jobs[jobId("statblock", id)].status + ")" : ""));
      if (rec.stage === "deceased") return err("Companion " + id + " is overleden");
      const nx = clone(rec), refs = { npcs: [id] };
      const needReason = () => reasonOk(op.reason);
      if (op.op === "decline") {
        if (rec.stage !== "candidate") return err("Companion " + id + ": weigeren kan alleen bij een kandidaat (stage " + rec.stage + ")");
        if (!needReason()) return err("Companion " + id + ": weigeren vereist een reason");
        nx.declined = { at: now ? clone(now) : null, reason: op.reason, retryAfter: dateOk(op.retryAfter) ? clone(op.retryAfter) : null };
        eventFor("companion_declined", npc.name + " weigert mee te gaan: " + op.reason, refs, "V");
      } else if (op.op === "recruit") {
        if (rec.stage !== "candidate") return err("Companion " + id + ": recruteren kan alleen bij een kandidaat (stage " + rec.stage + "); gebruik 'return' na een vertrek");
        if (npc.status !== "companion_candidate") return err("Companion " + id + ": NPC-status is " + npc.status + "; promoveer eerst naar companion_candidate");
        if (npc.introduced !== true) return err("Companion " + id + " (" + npc.name + ") is nog niet aan de spelers voorgesteld (npc.introduced)");
        if (COMPANION_MODES.indexOf(op.mode) < 0) return err("Companion " + id + ": mode moet " + COMPANION_MODES.join("/") + " zijn");
        if (!needReason()) return err("Companion " + id + ": recruteren vereist een reason (gedeeld belang, wederzijdse verwachtingen)");
        if (rec.declined && rec.declined.retryAfter && now && dateCmp(now, rec.declined.retryAfter) < 0) return err("Companion " + id + " heeft geweigerd en vraagt pas weer na " + fmt(rec.declined.retryAfter));
        if (!(rec.hp && rec.hp.max > 0)) return err("Companion " + id + ": statblock (hp.max) ontbreekt");
        if (rec.sheetStatus === "proposed") warn("Statblock van " + npc.name + " is nog een voorstel (niet goedgekeurd)");
        const live = op.mode !== "remote";
        if (live && partyRegion && npc.location && regionOf(W, npc.location) !== partyRegion) return err("Companion " + id + " (" + npc.name + ") is niet bij de party (" + (regionOf(W, npc.location) || "?") + " ≠ " + partyRegion + ")");
        nx.stage = "active"; nx.mode = op.mode; nx.joinedAt = now ? clone(now) : null; nx.departure = null; delete nx.declined;
        nx.hp = { cur: rec.hp.max, max: rec.hp.max };
        const nn = clone(npc); nn.status = "recruited"; if (live && partyRegion) { nn.location = partyRegion; if (now) nn.locationSince = clone(now); }
        W.npcs[id] = nn; plan.npcs[id] = nn;
        eventFor("companion_recruited", npc.name + " gaat mee (" + op.mode + "): " + op.reason, refs, "V");
        W.companions[id] = nx;
        const trav = activeCount() + 2;
        if (live && trav > PARTY_SOFT_LIMIT) warn("Party telt nu " + trav + " reizigers (richtwaarde " + PARTY_SOFT_LIMIT + "): vraag een narratief/logistiek plan (voedsel, onderdak, opvallendheid)");
      } else if (op.op === "depart") {
        if (rec.stage !== "active") return err("Companion " + id + ": vertrekken kan alleen als actief (stage " + rec.stage + ")");
        if (!needReason()) return err("Companion " + id + ": vertrek vereist een reason");
        let dest = npc.location;
        if (op.destination != null) { if (!knownPlace(W, op.destination)) return err("Companion " + id + ": onbekende bestemming " + op.destination); dest = op.destination; }
        if (op.expectedReturn != null && !dateOk(op.expectedReturn)) return err("Companion " + id + ": expectedReturn is geen geldige datum");
        nx.stage = "departed";
        nx.departure = { at: now ? clone(now) : null, reason: op.reason, destination: dest || null, condition: op.condition || null, returnIf: op.returnIf || null, expectedReturn: op.expectedReturn ? clone(op.expectedReturn) : null };
        const nn = clone(npc); nn.status = "departed"; nn.location = dest || null; if (now) nn.locationSince = clone(now);
        W.npcs[id] = nn; plan.npcs[id] = nn;
        eventFor("companion_departed", npc.name + " verlaat de party: " + op.reason, refs, "V");
      } else if (op.op === "return") {
        if (rec.stage !== "departed") return err("Companion " + id + ": terugkeren kan alleen na een vertrek (stage " + rec.stage + ")");
        if (!needReason()) return err("Companion " + id + ": terugkeer vereist een reason");
        const from = regionOf(W, npc.location);
        if (from && partyRegion && from !== partyRegion && now && rec.departure && rec.departure.at) {
          const need = travelDays(from, partyRegion), spent = dateCmp(now, rec.departure.at);
          if (need == null) warn("Companion " + id + ": reistijd " + from + " → " + partyRegion + " onbekend");
          else if (spent < need && !(isObj(op.travel) && reasonOk(op.travel.reason))) return err("Companion " + id + " (" + npc.name + ") kan niet in " + spent + " dag(en) van " + from + " naar " + partyRegion + " terugkeren (minimaal ~" + need + " dagen)");
        }
        nx.stage = "active"; nx.history = (rec.history || []).concat(rec.departure ? [rec.departure] : []); nx.departure = null;
        const nn = clone(npc); nn.status = "recruited"; if (partyRegion) { nn.location = partyRegion; if (now) nn.locationSince = clone(now); }
        W.npcs[id] = nn; plan.npcs[id] = nn;
        eventFor("companion_returned", npc.name + " keert terug: " + op.reason, refs, "V");
      } else if (op.op === "update") {
        const live = rec.stage === "active";
        if (live && (op.hp || op.resources || op.conditions) && rec.mode !== "remote" && rec.mode !== "contact" && partyRegion && regionOf(W, npc.location) !== partyRegion) return err("Companion " + id + " (" + npc.name + ") is niet bij de party (" + (regionOf(W, npc.location) || "?") + " ≠ " + partyRegion + ")");
        if (rec.stage === "departed" && (op.hp || op.resources || op.conditions)) return err("Companion " + id + " is vertrokken: alleen evidence/nextAction/obligation kunnen veranderen");
        if (rec.stage === "candidate" && (op.hp || op.resources || op.conditions)) return err("Companion " + id + " is nog kandidaat: geen combatstatus wijzigen");
        if (op.hp != null) {
          if (!isObj(op.hp)) return err("Companion " + id + ": hp moet {cur} of {delta} zijn");
          const v = op.hp.cur != null ? op.hp.cur : (op.hp.delta != null ? nx.hp.cur + op.hp.delta : null);
          if (!Number.isInteger(v) || v < 0 || v > nx.hp.max) return err("Companion " + id + ": hp valt buiten 0-" + nx.hp.max);
          nx.hp.cur = v;
          if (v === 0) warn("Companion " + id + " (" + npc.name + ") staat op 0 HP: bewusteloos; overlijden alleen via npcs status:'deceased' met reden");
        }
        if (op.resources != null) {
          if (!isObj(op.resources)) return err("Companion " + id + ": resources moet een object zijn");
          let bad = false;
          Object.keys(op.resources).forEach(k => {
            if (!resOk(nx.resources, k)) { bad = true; return err("Companion " + id + ": onbekende hulpbron '" + k + "'"); }
            const r = op.resources[k], cur = r.cur != null ? r.cur : (r.delta != null ? nx.resources[k].cur + r.delta : null);
            if (!Number.isInteger(cur) || cur < 0 || cur > nx.resources[k].max) { bad = true; return err("Companion " + id + ": hulpbron '" + k + "' valt buiten 0-" + nx.resources[k].max); }
            nx.resources[k].cur = cur;
          });
          if (bad) return;
        }
        if (op.conditions != null) {
          const c = isObj(op.conditions) ? op.conditions : {};
          const add = Array.isArray(c.add) ? c.add.filter(x => typeof x === "string") : [], rm = Array.isArray(c.remove) ? c.remove : [];
          nx.conditions = (nx.conditions || []).filter(x => rm.indexOf(x) < 0).concat(add).filter((v, i, a) => a.indexOf(v) === i);
        }
        if (op.evidence != null) {
          if (typeof op.evidence !== "string" || op.evidence.trim().length < 5) return err("Companion " + id + ": evidence moet een concrete ervaring zijn (≥5 tekens)");
          nx.evidence = (nx.evidence || []).concat([{ at: now ? clone(now) : null, text: op.evidence.trim() }]).slice(-30);
        }
        if (op.nextAction != null) nx.nextAction = String(op.nextAction);
        if (op.obligation != null) {
          if (!isObj(op.obligation) || typeof op.obligation.text !== "string" || op.obligation.text.trim().length < 5 || (op.obligation.due != null && !dateOk(op.obligation.due))) return err("Companion " + id + ": obligation vraagt {text, due?}");
          nx.obligation = { text: op.obligation.text.trim(), due: op.obligation.due ? clone(op.obligation.due) : null };
        }
        if (!live && rec.stage !== "departed" && rec.stage !== "candidate") return err("Companion " + id + ": onbekende stage");
      } else if (op.op === "rest") {
        if (rec.stage !== "active") return err("Companion " + id + ": rusten kan alleen als actief");
        if (rec.mode !== "remote" && rec.mode !== "contact" && partyRegion && regionOf(W, npc.location) !== partyRegion) return err("Companion " + id + " (" + npc.name + ") is niet bij de party om te rusten");
        if (op.kind !== "short" && op.kind !== "long") return err("Companion " + id + ": rest.kind moet short of long zijn");
        Object.keys(nx.resources || {}).forEach(k => { const r = nx.resources[k]; if (r.rest === "short" || (op.kind === "long" && r.rest === "long")) r.cur = r.max; });
        if (op.kind === "long") { nx.hp.cur = nx.hp.max; nx.conditions = []; }
        eventFor("companion_rest", npc.name + " neemt een " + (op.kind === "long" ? "lange" : "korte") + " rust", refs, "V");
      }
      W.companions[id] = nx; plan.companions[id] = nx; touched.companions = touched.companions || {}; touched.companions[id] = true;
    });
    /* overlijden van een companion via npcs: record meenemen */
    Object.keys(plan.npcs).forEach(id => {
      const n = plan.npcs[id], r = W.companions[id];
      if (n.status === "deceased" && r && r.stage !== "deceased") { const d = Object.assign({}, r, { stage: "deceased", hp: { cur: 0, max: r.hp ? r.hp.max : 0 }, departure: null }); W.companions[id] = d; plan.companions[id] = d; }
    });

    /* jobs bij NPC-promotie (idempotent; deterministische id's) */
    Object.keys(plan.npcs).forEach(id => {
      const n = plan.npcs[id], before = (world && world.npcs && world.npcs[id]) || null;
      if (n.tolkien === true || NPC_RANK[n.status] == null) return;
      const rb = before && NPC_RANK[before.status] != null ? NPC_RANK[before.status] : -1, ra = NPC_RANK[n.status];
      const queue = (type, required, trigger) => {
        const jid = jobId(type, id);
        if (W.jobs[jid]) return;
        const rec = { id: jid, type: type, subject: id, status: "queued", required: required, attempts: 0, trigger: trigger, createdAt: now ? clone(now) : null, createdRound: ctx.round || null };
        W.jobs[jid] = rec; plan.jobs[jid] = rec;
        eventFor("job_queued", "Job " + jid + " in de wachtrij (" + trigger + ")", { npcs: [id] }, "V");
      };
      if (rb < 1 && ra >= 1) {
        if (!(typeof ctx.hasPortrait === "function" && ctx.hasPortrait(n))) queue("portrait", false, "npc_named");
        queue("profile", false, "npc_named");
      }
      if (rb < 3 && ra >= 3 && !W.companions[id]) queue("statblock", true, "companion_candidate_zonder_statblock");
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
      if (set.stage != null) {
        const stages = Array.isArray(cur.stages) ? cur.stages : [];
        if (!Number.isInteger(set.stage) || set.stage <= (cur.stage || 0) || set.stage > stages.length) return err("Quest " + id + ": stage moet een geheel getal boven " + (cur.stage || 0) + " en hoogstens " + stages.length + " zijn");
        if (next.status !== "active") return err("Quest " + id + ": een stap vooruit kan alleen als de quest active is");
        if (!reasonOk(op.reason)) return err("Quest " + id + ": een stap vooruit vereist een reason");
        next.stage = set.stage; eventFor("quest_stage", "Quest " + id + " stap " + set.stage + "/" + stages.length + ": " + stages[set.stage - 1] + " (" + op.reason + ")", { quests: [id] }, "V");
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

    /* achtergrondlagen onthullen */
    (Array.isArray(delta.reveals) ? delta.reveals : []).forEach(op => {
      if (!isObj(op) || typeof op.npc !== "string" || !Number.isInteger(op.layer)) return err("reveals: elk item heeft npc en layer (geheel getal) nodig");
      const bs = W.backstories[op.npc], npc = W.npcs[op.npc];
      if (!bs || !npc) return err("Achtergrond van " + op.npc + " bestaat niet");
      if (npc.status === "deceased") return err("NPC " + op.npc + " is overleden: geen nieuwe lagen onthullen");
      if (!reasonOk(op.reason)) return err("Onthulling " + op.npc + " laag " + op.layer + ": een reason (wat gebeurde in het verhaal) is verplicht");
      const layer = (bs.layers || []).find(l => l.n === op.layer);
      if (!layer) return err("Achtergrond " + op.npc + " heeft geen laag " + op.layer);
      const rv = bs.revealed || {};
      if (rv[op.layer]) return err("Laag " + op.layer + " van " + op.npc + " is al onthuld");
      for (let i = 1; i < op.layer; i++) if (!rv[i]) return err("Laag " + i + " van " + op.npc + " moet eerst worden onthuld (de lagen gaan op volgorde)");
      if (!gateOk(W, op.npc, layer.gate, now)) return err("Laag " + op.layer + " van " + op.npc + " kan nog niet: " + gateText(layer.gate));
      const nb = clone(bs); nb.revealed = Object.assign({}, rv); nb.revealed[op.layer] = { at: now ? clone(now) : null, reason: op.reason };
      W.backstories[op.npc] = nb; plan.backstories[op.npc] = nb;
      eventFor("backstory_revealed", npc.name + ": laag " + op.layer + " '" + layer.title + "' onthuld (" + op.reason + ")", { npcs: [op.npc] }, "V");
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

    /* agenda's: DM-ops */
    const stepErr = (aid, s, i) => {
      if (!isObj(s) || typeof s.text !== "string" || s.text.trim().length < 5) return "Agenda " + aid + " stap " + (i + 1) + ": text (minstens 5 tekens) ontbreekt";
      if (!(Number.isInteger(s.afterDays) && s.afterDays >= 1 && s.afterDays <= 60)) return "Agenda " + aid + " stap " + (i + 1) + ": afterDays moet 1-60 zijn";
      for (const c of (Array.isArray(s.clock) ? s.clock : [])) { if (!isObj(c) || !W.clocks[c.id]) return "Agenda " + aid + " stap " + (i + 1) + ": onbekende klok " + (c && c.id); if (!Number.isInteger(c.delta) || c.delta === 0 || Math.abs(c.delta) > 2) return "Agenda " + aid + " stap " + (i + 1) + ": klok-delta moet 1 of 2 (of -1, -2) zijn"; }
      for (const m of (Array.isArray(s.moves) ? s.moves : [])) { if (!isObj(m) || !W.npcs[m.id]) return "Agenda " + aid + " stap " + (i + 1) + ": onbekende NPC " + (m && m.id); if (!knownPlace(W, m.to) && !regionOf(W, m.to)) return "Agenda " + aid + " stap " + (i + 1) + ": onbekende bestemming " + m.to; }
      if (s.quest != null && !(isObj(s.quest) && W.quests[s.quest.id] && s.quest.to === "available")) return "Agenda " + aid + " stap " + (i + 1) + ": quest moet {id, to:'available'} zijn met een bestaande quest";
      if (s.requires != null && !(isObj(s.requires) && W.quests[s.requires.id] && QUEST_STATUS.indexOf(s.requires.status) >= 0)) return "Agenda " + aid + " stap " + (i + 1) + ": requires moet {quest-id, status} zijn";
      return null;
    };
    (Array.isArray(delta.agendas) ? delta.agendas : []).forEach(op => {
      if (!isObj(op) || typeof op.id !== "string") return err("agendas: elk item heeft een id nodig");
      const id = op.id, cur = W.agendas[id];
      if (!ID_RE.test(id)) return err("agenda-id '" + id + "' heeft geen geldig formaat (bv. AG-ORC-2)");
      if (AGENDA_OPS.indexOf(op.op) < 0) return err("Agenda " + id + ": op moet " + AGENDA_OPS.join("/") + " zijn");
      if (op.op === "create") {
        if (cur) return err("Agenda " + id + " bestaat al");
        const set = isObj(op.set) ? op.set : {};
        const owner = set.owner, ownerOk = typeof owner === "string" && ((W.factions && W.factions[owner]) || (W.npcs[owner] && W.npcs[owner].status !== "deceased"));
        if (!ownerOk) return err("Agenda " + id + ": owner moet een bestaande factie of een levende NPC zijn");
        if (typeof set.title !== "string" || !set.title.trim()) return err("Agenda " + id + ": title ontbreekt");
        if (CANON_TAGS.indexOf(set.canon) < 0) return err("Agenda " + id + ": canon moet B/C/I/N/V zijn");
        if (!Array.isArray(set.steps) || set.steps.length < 1 || set.steps.length > AGENDA_MAX_STEPS) return err("Agenda " + id + ": 1-" + AGENDA_MAX_STEPS + " steps vereist");
        if (!now) return err("Agenda " + id + ": een agenda starten vereist een kalender");
        if (!reasonOk(op.reason)) return err("Agenda " + id + ": aanmaken vereist een reason (welk motief en welke middelen)");
        for (let i = 0; i < set.steps.length; i++) { const e = stepErr(id, set.steps[i], i); if (e) return err(e); }
        const dup = Object.values(W.agendas).find(a => String(a.title).toLowerCase() === set.title.trim().toLowerCase());
        if (dup) return err("Agenda-titel bestaat al als " + dup.id);
        const rec = { id: id, owner: owner, title: set.title.trim(), status: "active", canon: set.canon, steps: clone(set.steps), stepIdx: 0, nextAt: addDays(now, set.steps[0].afterDays), history: [], created: clone(now) };
        ["thwartedBy", "holdIfActive"].forEach(k => { if (Array.isArray(set[k])) { set[k].forEach(q => { if (!W.quests[q]) err("Agenda " + id + ": " + k + " verwijst naar onbekende quest " + q); }); rec[k] = set[k].slice(); } });
        if (typeof set.ifUnopposed === "string") rec.ifUnopposed = set.ifUnopposed;
        W.agendas[id] = rec; plan.agendas[id] = rec;
        eventFor("agenda_created", "Agenda " + id + " '" + rec.title + "' gestart (" + owner + "): " + op.reason, { npcs: W.npcs[owner] ? [owner] : [] }, set.canon, { visibility: "dm_only" });
        return;
      }
      if (!cur) return err("Agenda " + id + " bestaat niet");
      if (!reasonOk(op.reason)) return err("Agenda " + id + ": " + op.op + " vereist een reason");
      const nx = clone(cur);
      if (op.op === "thwart") {
        if (cur.status !== "active" && cur.status !== "paused") return err("Agenda " + id + ": dwarsbomen kan alleen bij active of paused (nu " + cur.status + ")");
        nx.status = "thwarted"; nx.history = (cur.history || []).concat([{ at: now ? clone(now) : null, what: "dwarsgebomd: " + op.reason }]);
        eventFor("agenda_thwarted", "Agenda " + id + " dwarsgebomd: " + op.reason + (cur.ifUnopposed ? " (anders: " + cur.ifUnopposed + ")" : ""), {}, "V", { visibility: "dm_only" });
      } else if (op.op === "pause") {
        if (cur.status !== "active") return err("Agenda " + id + ": pauzeren kan alleen bij active (nu " + cur.status + ")");
        nx.status = "paused"; eventFor("agenda_paused", "Agenda " + id + " gepauzeerd: " + op.reason, {}, "V", { visibility: "dm_only" });
      } else if (op.op === "resume") {
        if (cur.status !== "paused") return err("Agenda " + id + ": hervatten kan alleen bij paused (nu " + cur.status + ")");
        nx.status = "active"; if (now && dateCmp(nx.nextAt, now) < 0) nx.nextAt = clone(now);
        eventFor("agenda_resumed", "Agenda " + id + " hervat: " + op.reason, {}, "V", { visibility: "dm_only" });
      } else if (op.op === "delay") {
        if (cur.status !== "active") return err("Agenda " + id + ": vertragen kan alleen bij active (nu " + cur.status + ")");
        if (!(Number.isInteger(op.days) && op.days >= 1 && op.days <= 30)) return err("Agenda " + id + ": days moet 1-30 zijn");
        nx.nextAt = addDays(cur.nextAt, op.days); eventFor("agenda_delayed", "Agenda " + id + " " + op.days + " dagen vertraagd: " + op.reason, {}, "V", { visibility: "dm_only" });
      }
      W.agendas[id] = nx; plan.agendas[id] = nx;
    });

    /* agenda's: automatische tick bij tijdsverloop (alleen bij een echte tijdsprong; Bible 09) */
    if (now && plan.calendar && !errors.length) {
      const tk = tickAgendas(W, now);
      Object.keys(tk.agendas).forEach(id => { W.agendas[id] = tk.agendas[id]; plan.agendas[id] = tk.agendas[id]; });
      Object.keys(tk.clocks).forEach(id => { W.clocks[id] = tk.clocks[id]; plan.clocks[id] = tk.clocks[id]; });
      Object.keys(tk.npcs).forEach(id => { W.npcs[id] = tk.npcs[id]; plan.npcs[id] = tk.npcs[id]; });
      Object.keys(tk.quests).forEach(id => { W.quests[id] = tk.quests[id]; plan.quests[id] = tk.quests[id]; });
      tk.events.forEach(e => plan.events.push(Object.assign({ round: ctx.round || null, auto: true }, e)));
      tk.warnings.forEach(w => warn(w));
    }

    /* verlopen quests bij tijdsverloop */
    if (now && plan.calendar) {
      companionDue({ npcs: W.npcs, companions: W.companions }, now).forEach(m => warn("Companion aan de orde: " + m));
      Object.values(W.quests).forEach(q => {
        if ((q.status === "available" || q.status === "dormant") && q.expires && dateOk(q.expires) && dateCmp(now, q.expires) > 0 && !plan.quests[q.id]) {
          const n = Object.assign({}, q, { status: "expired", history: (q.history || []).concat([{ status: "expired", at: now, reason: "verlopen op " + fmt(q.expires) }]) });
          plan.quests[q.id] = n;
          eventFor("quest_status", "Quest " + q.id + " is verlopen (" + fmt(q.expires) + "): " + (q.ifIgnored || "gevolg onbekend"), { quests: [q.id] }, "V");
          warn("Quest " + q.id + " verlopen: " + (q.ifIgnored || ""));
        }
      });
    }
    /* grote momenten: de app kan de volgende beurt aan Claude Code overdragen (met alle informatie en geheimen) */
    const major = [], base = world || {};
    if (plan.scene) major.push("reis naar " + plan.scene.region + " (afsluiten van de vorige plek)");
    Object.keys(plan.quests).forEach(id => { const b = (base.quests || {})[id], a = plan.quests[id]; if (!b || b.status === a.status) return;
      if (a.kind === "main" && ["available", "active", "completed", "failed"].indexOf(a.status) >= 0) major.push("quest " + id + " is " + a.status);
      else if (["big", "personal", "companion"].indexOf(a.kind) >= 0 && ["completed", "failed"].indexOf(a.status) >= 0) major.push("quest " + id + " is " + a.status); });
    Object.keys(plan.backstories).forEach(id => { const b = (base.backstories || {})[id], a = plan.backstories[id]; Object.keys(a.revealed || {}).forEach(n => { if (Number(n) >= 3 && !((b && b.revealed) || {})[n]) major.push("diepste laag van " + id + " onthuld"); }); });
    Object.keys(plan.companions).forEach(id => { const b = (base.companions || {})[id], a = plan.companions[id]; if (b && b.stage !== a.stage) major.push("companion " + id + ": " + b.stage + " naar " + a.stage); });
    Object.keys(plan.npcs).forEach(id => { const b = (base.npcs || {})[id], a = plan.npcs[id]; if (b && b.status !== "deceased" && a.status === "deceased" && ["recurring", "companion_candidate", "recruited"].indexOf(b.status) >= 0) major.push(a.name + " is overleden"); });
    plan.major = major;
    return { ok: errors.length === 0, errors: errors, warnings: warnings, plan: plan };
  }

  /* Een job-overgang controleren en toepassen (runner-kant). patch: {by, leaseUntil, result, reason}. */
  function jobTransition(job, to, patch, nowMs) {
    patch = patch || {};
    if (!job || JOB_STATUS.indexOf(job.status) < 0) return { ok: false, error: "onbekende job of status" };
    if (JOB_STATUS.indexOf(to) < 0) return { ok: false, error: "onbekende doelstatus " + to };
    if (JOB_NEXT[job.status].indexOf(to) < 0) return { ok: false, error: "overgang " + job.status + " naar " + to + " is niet toegestaan" };
    const j = clone(job); j.status = to; j.updatedAt = nowMs || null;
    if (to === "claimed") {
      if (!patch.by) return { ok: false, error: "claimen vereist by" };
      if ((job.attempts || 0) >= JOB_MAX_ATTEMPTS) return { ok: false, error: "maximaal " + JOB_MAX_ATTEMPTS + " pogingen bereikt; zet de job handmatig op blocked of cancelled" };
      j.attempts = (job.attempts || 0) + 1; j.claimedBy = patch.by; j.claimedAt = nowMs || null; j.leaseUntil = patch.leaseUntil || null;
    } else {
      delete j.leaseUntil;
      if (to === "done") { if (!(isObj(patch.result) && typeof patch.result.notes === "string" && patch.result.notes.trim().length >= 5)) return { ok: false, error: "afronden vereist result.notes (minstens 5 tekens)" }; j.result = patch.result; delete j.error; }
      if (to === "failed" || to === "blocked" || to === "cancelled") { if (!reasonOk(patch.reason)) return { ok: false, error: to + " vereist een reason" }; j.error = patch.reason; }
      if (to === "queued") { delete j.claimedBy; delete j.claimedAt; }
    }
    return { ok: true, job: j };
  }
  /* Eerstvolgende jobs: eerst verplichte, dan oudste; verlopen leases tellen als queued. */
  function pendingJobs(world, opts) {
    opts = opts || {};
    const types = opts.types || JOB_TYPES, nowMs = opts.nowMs || 0, npcs = (world && world.npcs) || {};
    return Object.values((world && world.jobs) || {}).filter(j => types.indexOf(j.type) >= 0 && (j.status === "queued" || (j.status === "claimed" && j.leaseUntil && j.leaseUntil < nowMs)) && (j.attempts || 0) < JOB_MAX_ATTEMPTS)
      .filter(j => j.type === "location" ? ((world.locations || {})[j.subject]) : (npcs[j.subject] && npcs[j.subject].status !== "ambient"))
      .sort((a, b) => (b.required ? 1 : 0) - (a.required ? 1 : 0) || (a.createdRound || 0) - (b.createdRound || 0) || (a.id < b.id ? -1 : 1));
  }

  /* Wat is er bij een companion aan de orde? (autonomie: de DM krijgt dit te zien, het spel beslist niet zelf) */
  function companionDue(world, now) {
    const out = [];
    if (!world || !now || !dateOk(now)) return out;
    const npcs = world.npcs || {};
    Object.values(world.companions || {}).forEach(r => {
      const nm = (npcs[r.id] && npcs[r.id].name) || r.id;
      if (r.stage === "departed" && r.departure && dateOk(r.departure.expectedReturn) && dateCmp(now, r.departure.expectedReturn) >= 0) out.push(r.id + " " + nm + ": verwachte terugkeer (" + fmt(r.departure.expectedReturn) + ") is bereikt" + (r.departure.returnIf ? "; voorwaarde: " + r.departure.returnIf : ""));
      if (r.stage === "active" && r.obligation && dateOk(r.obligation.due) && dateCmp(now, r.obligation.due) >= 0) out.push(r.id + " " + nm + ": verplichting is aan de orde ('" + r.obligation.text + "')" + (r.departureConditions ? "; vertrekvoorwaarde: " + r.departureConditions : ""));
    });
    return out;
  }

  /* ---------- afloop-evaluator (Bible 03, Act IV): geeft KANDIDAAT-eindes met redenen; de DM beslist ---------- */
  const END_GOALS = { msg: "MAIN-A4-MSG", cor: "MAIN-A4-CORRIDOR", dis: "MAIN-A4-DISINFO" };
  function evaluateEndings(world) {
    const W = world || {}, qs = W.quests || {}, cl = W.clocks || {};
    const st = id => (qs[id] ? qs[id].status : null), val = id => (cl[id] ? cl[id].value : null);
    const goals = {}; Object.keys(END_GOALS).forEach(k => { goals[k] = st(END_GOALS[k]); });
    const terminal = s => ["completed", "failed", "expired", "changed"].indexOf(s) >= 0;
    const vals = Object.keys(goals).map(k => goals[k]);
    const done = vals.filter(s => s === "completed").length, lost = vals.filter(s => s === "failed" || s === "expired").length;
    const A = val("CLK-A"), B = val("CLK-B"), C = val("CLK-C");
    const res = { goals: goals, completed: done, lost: lost, clocks: { A: A, B: B, C: C }, pending: vals.some(s => s != null && !terminal(s)), candidates: [] };
    const add = (id, label, why) => res.candidates.push({ id: id, label: label, why: why });
    if (vals.every(s => s == null)) { res.pending = true; return res; }
    if (res.pending) return res;
    const bad = (A != null && A >= 5) || (C != null && C >= 6);
    if (done === 3 && !(A != null && A > 3) && !(B != null && B < 3) && !(C != null && C > 4)) add("sterk_netwerk", "Sterk netwerk", "alle drie doelen gehaald en de klokken blijven gezond");
    if (goals.msg === "completed" && done < 3) add("versplinterde_overwinning", "Versplinterde overwinning", "de boodschap kwam aan, maar " + (3 - done) + " doel(en) niet");
    if (goals.cor === "completed" && goals.msg !== "completed") add("kostbaar_behoud", "Kostbaar behoud", "de corridor bleef open, de kernboodschap kwam niet aan" + (goals.dis !== "completed" ? " en de desinformatie bestaat nog" : ""));
    if (done === 0 && (lost >= 2 || bad)) add("mislukte_missie", "Mislukte missie", "geen enkel doel gehaald; verbindingen blijvend beschadigd");
    if (done === 3 && res.candidates.length === 0) add("sterk_netwerk_met_littekens", "Sterk netwerk met littekens", "alle doelen gehaald, maar de klokken tonen blijvende schade");
    if (res.candidates.length === 0) add("speleroplossing", "Onverwachte speleroplossing", "geen standaardeinde past; laat de fictie en de regels beslissen");
    return res;
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
    const comps = Object.values(world.companions || {}).filter(r => r.stage === "active" || r.stage === "departed");
    if (comps.length) out.push("Companions:\n" + comps.slice(0, 8).map(r => {
      const n = (world.npcs || {})[r.id] || {};
      const res = Object.keys(r.resources || {}).map(k => k + " " + r.resources[k].cur + "/" + r.resources[k].max).join(", ");
      const ev = (r.evidence || []).slice(-2).map(e => e.text).join(" | ");
      if (r.stage === "departed") return "- " + r.id + " " + (n.name || "") + " [vertrokken " + (r.departure && r.departure.at ? fmt(r.departure.at) : "?") + " → " + (r.departure && r.departure.destination || "?") + "; reden: " + (r.departure && r.departure.reason || "?") + (r.departure && r.departure.returnIf ? "; keert terug als: " + r.departure.returnIf : "") + "]";
      return "- " + r.id + " " + (n.name || "") + " [" + r.mode + "] HP " + r.hp.cur + "/" + r.hp.max + (res ? "; " + res : "") + ((r.conditions || []).length ? "; conditions: " + r.conditions.join(", ") : "") + (r.nextAction ? "; wil: " + r.nextAction : "") + (ev ? "; bewijs: " + ev : "");
    }).join("\n"));
    const due = companionDue(world, world.calendar);
    if (due.length) out.push("Aan de orde (companions):\n" + due.map(d => "- " + d).join("\n"));
    const bsl = Object.values(world.backstories || {}).filter(b => { const n = (world.npcs || {})[b.npc]; return n && n.status !== "deceased" && (n.status === "recruited" || hay.indexOf(String(n.name).toLowerCase()) >= 0 || hay.indexOf(b.npc.toLowerCase()) >= 0 || (here && regionOf(world, n.location) === here && n.introduced === true)); });
    if (bsl.length) out.push("Verhaallagen (laag voor laag, nooit vooruit lopen; onthul via reveals met reden):\n" + bsl.slice(0, 6).map(b => {
      const n = world.npcs[b.npc], rv = b.revealed || {}, total = (b.layers || []).length, nxt = (b.layers || []).find(l => !rv[l.n]), q = world.quests && b.quest ? world.quests[b.quest] : null;
      const head = "- " + b.npc + " " + n.name + ": rol: " + b.role + " | quest " + (b.quest || "-") + (q ? " [" + q.status + (q.stages ? ", stap " + (q.stage || 0) + "/" + q.stages.length : "") + "]" : "") + " | onthuld " + Object.keys(rv).length + "/" + total;
      if (!nxt) return head + " (alles onthuld)";
      return head + " | " + (gateOk(world, b.npc, nxt.gate, world.calendar) ? "KAN NU ONTHULD WORDEN: laag " + nxt.n + " '" + nxt.title + "': " + nxt.text : "volgende laag " + nxt.n + " nog niet (" + gateText(nxt.gate) + ")");
    }).join("\n"));
    const ags = Object.values(world.agendas || {}).filter(a => a.status === "active" || a.status === "paused").sort((a, b) => (dateOk(a.nextAt) && dateOk(b.nextAt) ? dateCmp(a.nextAt, b.nextAt) : 0));
    if (ags.length) out.push("Agenda's (alleen DM; voer niet zelf uit, de app tikt ze bij tijdsprongen):\n" + ags.slice(0, 7).map(a => "- " + a.id + " [" + a.owner + (a.status === "paused" ? ", gepauzeerd" : "") + "] " + a.title + ": stap " + (a.stepIdx + 1) + "/" + a.steps.length + (dateOk(a.nextAt) ? " op " + fmt(a.nextAt) : "") + " - " + (a.steps[a.stepIdx] ? a.steps[a.stepIdx].text : "klaar")).join("\n"));
    const off = Object.values(world.events || {}).filter(e => e.type === "offscreen").sort((a, b) => (a.t || 0) - (b.t || 0)).slice(-4);
    if (off.length) out.push("Recent buiten beeld (de PC's weten dit pas als nieuws hen bereikt; nooit alwetend laten reageren):\n" + off.map(e => "- " + (e.ingame && dateOk(e.ingame) ? fmt(e.ingame) + ": " : "") + e.summary).join("\n"));
    const act4 = ["MAIN-A4", "MAIN-A4-MSG", "MAIN-A4-CORRIDOR", "MAIN-A4-DISINFO"].some(id => world.quests && world.quests[id] && (world.quests[id].status === "available" || world.quests[id].status === "active" || world.quests[id].status === "completed" || world.quests[id].status === "failed"));
    if (act4) { const ev = evaluateEndings(world); out.push("Afloop-kandidaten (richtsnoer, jij beslist): " + (ev.pending ? "nog niet beslist (doelen " + Object.keys(ev.goals).map(k => k + "=" + (ev.goals[k] || "-")).join(", ") + ")" : ev.candidates.map(c => c.label + " (" + c.why + ")").join("; "))); }
    const nextNum = (obj, re) => Object.keys(obj || {}).reduce((m, k) => { const x = re.exec(k); return x ? Math.max(m, Number(x[1])) : m; }, 0) + 1;
    out.push("Vrije ID's voor nieuwe records (bestaande ID's nooit hergebruiken): NPC-E" + String(nextNum(world.npcs, /^NPC-E(\d+)$/)).padStart(2, "0") + ", DQ-" + String(nextNum(world.quests, /^DQ-(\d+)$/)).padStart(4, "0") + ", AG-D" + nextNum(world.agendas, /^AG-D(\d+)$/));
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
    const comps = W.companions || {}, STAGE_NPC = { candidate: null, active: ["recruited"], departed: ["departed", "inactive"], deceased: ["deceased"] };
    Object.keys(comps).forEach(id => {
      const r = comps[id], n = npcs[id];
      if (!n) return bad("companion", id, "geen bijbehorende NPC");
      if (r.id !== id) bad("companion", id, "id komt niet overeen met de sleutel");
      if (COMPANION_STAGES.indexOf(r.stage) < 0) return bad("companion", id, "onbekende stage " + r.stage);
      if (STAGE_NPC[r.stage] && STAGE_NPC[r.stage].indexOf(n.status) < 0) bad("companion", id, "stage " + r.stage + " past niet bij NPC-status " + n.status);
      if (r.stage === "candidate" && ["recruited", "departed"].indexOf(n.status) >= 0) bad("companion", id, "NPC is " + n.status + " maar record staat nog op candidate");
      if (!(r.hp && Number.isInteger(r.hp.max) && r.hp.max > 0 && r.hp.cur >= 0 && r.hp.cur <= r.hp.max)) bad("companion", id, "hp ontbreekt of valt buiten bereik");
      Object.keys(r.resources || {}).forEach(k => { const x = r.resources[k]; if (!(x.cur >= 0 && x.cur <= x.max)) bad("companion", id, "hulpbron " + k + " buiten bereik"); });
      if (r.stage === "departed" && !r.departure) bad("companion", id, "vertrokken zonder departure-gegevens");
      if (r.stage === "active" && (!r.mode || COMPANION_MODES.indexOf(r.mode) < 0)) bad("companion", id, "actief zonder geldige mode");
    });
    Object.keys(npcs).forEach(id => { if (npcs[id].status === "recruited" && !comps[id]) bad("companion", id, "NPC is recruited maar heeft geen companion-record (statblock)"); });
    const bsx = W.backstories || {};
    Object.keys(bsx).forEach(id => {
      const b = bsx[id];
      if (!npcs[id] || b.npc !== id) return bad("achtergrond", id, "geen bijbehorende NPC of npc-veld klopt niet");
      if (b.quest && !quests[b.quest]) bad("achtergrond", id, "quest " + b.quest + " bestaat niet");
      const L = Array.isArray(b.layers) ? b.layers : [];
      if (!L.length) return bad("achtergrond", id, "geen lagen");
      L.forEach((l, i) => { if (l.n !== i + 1) bad("achtergrond", id, "lagen moeten 1..N genummerd zijn"); if (!isObj(l.gate) || GATE_TYPES.indexOf(l.gate.t) < 0) bad("achtergrond", id, "laag " + l.n + ": onbekende gate"); else { if (l.gate.t === "quest" && !quests[l.gate.id]) bad("achtergrond", id, "laag " + l.n + ": gate verwijst naar onbekende quest"); if (l.gate.t === "stage" && !quests[l.gate.quest]) bad("achtergrond", id, "laag " + l.n + ": gate verwijst naar onbekende quest"); } if (!l.text || !l.know) bad("achtergrond", id, "laag " + l.n + ": text en know zijn verplicht"); });
      const rv = Object.keys(b.revealed || {}).map(Number).sort((a, c) => a - c);
      rv.forEach((n, i) => { if (n !== i + 1) bad("achtergrond", id, "onthulde lagen moeten een aaneengesloten reeks vanaf 1 zijn"); });
    });
    Object.keys(quests).forEach(id => { const q = quests[id]; if (q.stage != null && !(Array.isArray(q.stages) && q.stage >= 0 && q.stage <= q.stages.length)) bad("quest", id, "stage valt buiten stages"); });
    const ags = W.agendas || {};
    Object.keys(ags).forEach(id => {
      const a = ags[id];
      if (!ID_RE.test(id) || a.id !== id) bad("agenda", id, "id komt niet overeen of ongeldig formaat");
      if (AGENDA_STATUS.indexOf(a.status) < 0) return bad("agenda", id, "onbekende status " + a.status);
      if (!(npcs[a.owner] || facs[a.owner])) bad("agenda", id, "owner " + a.owner + " bestaat niet");
      if (!Array.isArray(a.steps) || !a.steps.length || a.steps.length > AGENDA_MAX_STEPS) bad("agenda", id, "steps ontbreken of zijn te veel");
      else {
        if (!(Number.isInteger(a.stepIdx) && a.stepIdx >= 0 && a.stepIdx <= a.steps.length)) bad("agenda", id, "stepIdx buiten bereik");
        if (a.status === "active" && a.stepIdx < a.steps.length && !dateOk(a.nextAt)) bad("agenda", id, "actief zonder geldige nextAt");
        if (a.status === "completed" && a.stepIdx !== a.steps.length) bad("agenda", id, "afgerond maar niet alle stappen uitgevoerd");
        a.steps.forEach((s, i) => {
          (s.clock || []).forEach(c => { if (!clocks[c.id]) bad("agenda", id, "stap " + (i + 1) + ": onbekende klok " + c.id); else if (!Number.isInteger(c.delta) || Math.abs(c.delta) > 2 || c.delta === 0) bad("agenda", id, "stap " + (i + 1) + ": klok-delta ongeldig"); });
          (s.moves || []).forEach(m => { if (!npcs[m.id]) bad("agenda", id, "stap " + (i + 1) + ": onbekende NPC " + m.id); });
          if (s.quest && !quests[s.quest.id]) bad("agenda", id, "stap " + (i + 1) + ": onbekende quest " + s.quest.id);
          if (s.requires && !quests[s.requires.id]) bad("agenda", id, "stap " + (i + 1) + ": requires verwijst naar onbekende quest");
        });
      }
      (a.thwartedBy || []).concat(a.holdIfActive || []).forEach(q => { if (!quests[q]) bad("agenda", id, "verwijst naar onbekende quest " + q); });
      if (npcs[a.owner] && npcs[a.owner].status === "deceased" && a.status === "active") note("agenda", id, "eigenaar is overleden maar de agenda is nog actief");
    });
    const jobs = W.jobs || {};
    Object.keys(jobs).forEach(id => {
      const j = jobs[id];
      if (!ID_RE.test(id) || j.id !== id) bad("job", id, "id komt niet overeen of ongeldig formaat");
      if (JOB_TYPES.indexOf(j.type) < 0) bad("job", id, "onbekend type " + j.type);
      if (JOB_STATUS.indexOf(j.status) < 0) bad("job", id, "onbekende status " + j.status);
      if (j.type === "location" ? !locs[j.subject] : !npcs[j.subject]) note("job", id, "verwijst naar onbekende " + (j.type === "location" ? "locatie " : "NPC ") + j.subject + " (wordt bij het claimen geannuleerd)");
      if (j.status === "done" && !(j.result && j.result.notes)) bad("job", id, "klaar zonder resultaat");
      if (j.status === "claimed" && !j.claimedBy) bad("job", id, "geclaimd zonder claimedBy");
      if (j.type === "statblock" && j.status === "done" && !comps[j.subject]) bad("job", id, "statblock-job klaar maar geen companion-record voor " + j.subject);
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
    Object.keys(plan.companions || {}).forEach(id => put("world/companions/" + id, plan.companions[id]));
    Object.keys(plan.agendas || {}).forEach(id => put("world/agendas/" + id, plan.agendas[id]));
    Object.keys(plan.backstories || {}).forEach(id => put("world/backstories/" + id, plan.backstories[id]));
    /* jobs: bewust zonder herstelgegevens; een job loopt asynchroon en mag niet door Terug verdwijnen (de runner annuleert wees-jobs) */
    Object.keys(plan.jobs || {}).forEach(id => { set["world/jobs/" + id] = plan.jobs[id]; });
    if (plan.calendar) put("world/calendar", plan.calendar);
    plan.divergences.forEach(d => { const k = opts.newKey(); prev.push({ p: "world/divergences/" + k, v: null }); set["world/divergences/" + k] = d; });
    plan.events.forEach(ev => { const k = opts.newKey(); prev.push({ p: "world/events/" + k, v: null }); set["world/events/" + k] = Object.assign({ t: opts.now || null }, ev); });
    if (Number.isInteger(plan.round)) put("world/lastRound", plan.round);
    if (plan.scene) { put("world/sceneRegion", plan.scene.region); put("world/sceneSince", plan.scene.since); }
    else if (typeof opts.region === "string" && /^REG-[A-Z]+$/.test(opts.region)) put("world/sceneRegion", opts.region);
    return { set: set, prev: prev };
  }

  return { NPC_STATUS: NPC_STATUS, QUEST_STATUS: QUEST_STATUS, QUEST_NEXT: QUEST_NEXT, ID_RE: ID_RE, TRAVEL: TRAVEL, FELLOWSHIP: FELLOWSHIP, validateDelta: validateDelta, gateOk: gateOk, gateText: gateText, evaluateEndings: evaluateEndings, tickAgendas: tickAgendas, AGENDA_STATUS: AGENDA_STATUS, JOB_TYPES: JOB_TYPES, JOB_STATUS: JOB_STATUS, JOB_NEXT: JOB_NEXT, JOB_MAX_ATTEMPTS: JOB_MAX_ATTEMPTS, jobId: jobId, jobTransition: jobTransition, pendingJobs: pendingJobs, companionDue: companionDue, COMPANION_MODES: COMPANION_MODES, auditWorld: auditWorld, commitPaths: commitPaths, worldContext: worldContext, travelDays: travelDays, regionOf: regionOf, dateCmp: dateCmp, dateOk: dateOk };
});
