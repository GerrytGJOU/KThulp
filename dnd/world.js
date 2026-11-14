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
  const KNOWN_REGIONS = {}; Object.keys(TRAVEL).forEach(k => k.split("|").forEach(r => { KNOWN_REGIONS[r] = true; }));
  const knownPlace = (world, loc) => !!loc && (KNOWN_REGIONS[loc] === true || !!(String(loc).indexOf("REG-") !== 0 && regionOf(world, loc)));
  const reasonOk = r => typeof r === "string" && r.trim().length >= 5;

  /* ---------- controle van een worldDelta ---------- */
  function validateDelta(world, delta, ctx) {
    ctx = ctx || {};
    const errors = [], warnings = [];
    const plan = { calendar: null, npcs: {}, quests: {}, clocks: {}, companions: {}, events: [], divergences: [] };
    const W = clone(world || {});
    W.companions = W.companions || {};
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

    /* companions */
    const partyRegion = (typeof delta.region === "string" && /^REG-[A-Z]+$/.test(delta.region)) ? delta.region : (W.sceneRegion || null);
    const activeCount = () => Object.values(W.companions).filter(r => r.stage === "active" && r.mode !== "remote" && r.mode !== "contact").length;
    const resOk = (r, k) => isObj(r) && isObj(r[k]);
    (Array.isArray(delta.companions) ? delta.companions : []).forEach(op => {
      if (!isObj(op) || typeof op.id !== "string") return err("companions: elk item heeft een id nodig");
      const id = op.id, npc = W.npcs[id], rec = W.companions[id];
      if (COMPANION_OPS.indexOf(op.op) < 0) return err("Companion " + id + ": op moet " + COMPANION_OPS.join("/") + " zijn");
      if (!npc) return err("Companion " + id + " bestaat niet als NPC");
      if (npc.status === "deceased") return err("Companion " + id + " (" + npc.name + ") is overleden");
      if (!rec) return err("Companion " + id + " (" + npc.name + ") heeft geen companion-record (statblock); een companion zonder statblock kan niet meedoen aan combat");
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
    return { ok: errors.length === 0, errors: errors, warnings: warnings, plan: plan };
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
    if (plan.calendar) put("world/calendar", plan.calendar);
    plan.divergences.forEach(d => { const k = opts.newKey(); prev.push({ p: "world/divergences/" + k, v: null }); set["world/divergences/" + k] = d; });
    plan.events.forEach(ev => { const k = opts.newKey(); prev.push({ p: "world/events/" + k, v: null }); set["world/events/" + k] = Object.assign({ t: opts.now || null }, ev); });
    if (typeof opts.region === "string" && /^REG-[A-Z]+$/.test(opts.region)) put("world/sceneRegion", opts.region);
    return { set: set, prev: prev };
  }

  return { NPC_STATUS: NPC_STATUS, QUEST_STATUS: QUEST_STATUS, QUEST_NEXT: QUEST_NEXT, ID_RE: ID_RE, TRAVEL: TRAVEL, FELLOWSHIP: FELLOWSHIP, validateDelta: validateDelta, companionDue: companionDue, COMPANION_MODES: COMPANION_MODES, auditWorld: auditWorld, commitPaths: commitPaths, worldContext: worldContext, travelDays: travelDays, regionOf: regionOf, dateCmp: dateCmp, dateOk: dateOk };
});
