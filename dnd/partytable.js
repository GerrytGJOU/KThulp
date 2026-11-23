/* Tafel der Draden: de partyvorming (De Tweede Raad) van de Midden-aarde D&D-app (dnd/).
   Eén bestand dat in de browser (window.PartyTable) en in Node (require, voor de tests) werkt.
   Twee spelers werken niet tegelijk: ze voeren per kandidaat een kort gesprek (de DM antwoordt bij de volgende beurt),
   leggen elk privé draden op vijf plekken en zien pas de uitkomst als beiden klaar zijn.
   Gegevens: dnd/campaigns/{cid}/partyTable (cands/talks/picks/ready/voorspraak/beraad/final, door de DM geopend met `claude-dm.js table-set`).
   Geen geheimen in dit bestand. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.PartyTable = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  const SLOTS = [
    { id: "reis", icon: "🧳", label: "Reisgroep", info: "Reist mee: kost voorraden en brengt risico, en deelt de spotlight met jullie." },
    { id: "voorhoede", icon: "🏹", label: "Voorhoede", info: "Gaat een etappe vooruit: levert informatie, maar loopt gevaar." },
    { id: "contact", icon: "🏠", label: "Contactpost", info: "Blijft in Rivendell of een knooppunt: helpt later met berichten en middelen." },
    { id: "wacht", icon: "⏳", label: "Wacht", info: "Nu geen akkoord: kan later nog aansluiten." },
    { id: "afscheid", icon: "👋", label: "Afscheid", info: "Bedankt: gaat zijn of haar eigen weg." }
  ];
  const SLOT_IDS = SLOTS.map(s => s.id);
  const MAX_LINES = 2;            /* spelersberichten per gesprek */
  const MAX_TEXT = 700;
  const PHASES = ["gesprekken", "leggen", "klaar"];

  const keyOf = s => String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "").slice(0, 60) || "x";
  const vals = o => o ? Object.keys(o).sort().map(k => o[k]) : [];

  /* zijn alle spelers klaar met leggen? */
  function allReady(data, players) {
    const r = (data && data.ready) || {};
    return players.length > 0 && players.every(p => r[keyOf(p)] === true);
  }
  /* per kandidaat: wat legt iedereen, en is dat gelijk? (een ontbrekende keuze telt als "wacht") */
  function compare(data, players) {
    const picks = (data && data.picks) || {}, cands = (data && data.cands) || {};
    return Object.keys(cands).map(ck => {
      const by = {}; players.forEach(p => { const v = (picks[keyOf(p)] || {})[ck]; by[p] = SLOT_IDS.includes(v) ? v : "wacht"; });
      const set = new Set(Object.values(by));
      return { key: ck, name: cands[ck].name || ck, by: by, agree: set.size === 1, slot: set.size === 1 ? Object.values(by)[0] : null };
    });
  }
  /* aantal gesprekken (door de speler) en of een nieuw bericht nog mag */
  function talkInfo(data, player, ck) {
    const t = (((data || {}).talks || {})[keyOf(player)] || {})[ck] || {};
    const msgs = vals(t.msgs).sort((a, b) => (a.t || 0) - (b.t || 0));
    const lines = msgs.filter(m => m.from === "speler").length;
    const state = t.state || (lines ? "pending" : "free");
    return { msgs: msgs, lines: lines, state: state, summary: t.summary || "", canWrite: state !== "pending" && state !== "done" && lines < MAX_LINES };
  }
  function clean(s) { return String(s || "").replace(/\s+/g, " ").trim().slice(0, MAX_TEXT); }
  /* wat de DM nog moet beantwoorden (voor de DM-context) */
  function pendingTalks(data, players) {
    const out = []; if (!data) return out;
    Object.keys(data.talks || {}).forEach(pk => Object.keys(data.talks[pk] || {}).forEach(ck => {
      const t = data.talks[pk][ck]; if (t && t.state === "pending") out.push({ player: players.find(p => keyOf(p) === pk) || pk, npc: ck, msgs: vals(t.msgs).sort((a, b) => (a.t || 0) - (b.t || 0)) });
    }));
    return out;
  }

  /* ---------- weergave ---------- */
  let openTalk = null;
  /* korte uitleg die de eerste keer open staat; onthouden per speler en verhaal (alleen een gemak, mag ontbreken) */
  const TUT = '<ol style="margin:6px 0 0 18px;padding:0"><li><b>Spreek</b> elke kandidaat apart aan met 💬 (hoogstens ' + MAX_LINES + ' korte berichten, in karakter). De DM antwoordt bij de volgende beurt. Van de ander zie je alleen een korte samenvatting.</li>' +
    '<li><b>Leg een draad</b> per kandidaat op een plek: 🧳 Reisgroep, 🏹 Voorhoede, 🏠 Contactpost, ⏳ Wacht of 👋 Afscheid. Dat kan zodra de DM de fase “leggen” opent. Druk daarna op Klaar.</li>' +
    '<li><b>Onthulling:</b> pas als jullie allebei klaar zijn, zie je elkaars keuzes. Bij verschil schrijf je één overtuigende zin en kies je eenmalig een Voorspraak.</li>' +
    '<li>De DM sluit het beraad af en zegt waar iedereen belandt. Een kandidaat mag nog steeds weigeren.</li></ol>';
  function tutKey(ctx) { return 'ptTut_' + (ctx.cid || '') + '_' + keyOf(ctx.me.name); }
  function tutSeen(ctx) { try { return localStorage.getItem(tutKey(ctx)) === '1'; } catch (e) { return false; } }
  function render(box, ctx) {
    const d = ctx.data, esc = ctx.esc;
    if (!d || !d.open) { box.innerHTML = '<div class="card">De Tafel der Draden is nog niet geopend. Het verhaal komt er vanzelf bij.</div>'; return; }
    const me = ctx.me.name, mk = keyOf(me), players = ctx.players, others = players.filter(p => p !== me);
    const phase = PHASES.includes(d.phase) ? d.phase : "gesprekken";
    const cands = d.cands || {}, ck = Object.keys(cands);
    const ready = allReady(d, players), myReady = ((d.ready || {})[mk]) === true;
    const final = d.final || null, done = phase === "klaar" || !!final;
    const keep = {}; box.querySelectorAll("textarea[data-k]").forEach(t => { keep[t.dataset.k] = t.value; });
    const myPicks = (d.picks || {})[mk] || {};
    let h = '<h2>🧵 Tafel der Draden</h2>';
    if (d.title) h += '<div class="card"><h3>' + esc(d.title) + '</h3>' + (d.intro ? '<div style="white-space:pre-wrap">' + esc(d.intro) + '</div>' : '') + '</div>';
    const seen = tutSeen(ctx);
    h += '<div class="card"><details' + (seen ? '' : ' open') + '><summary>' + (seen ? 'Hoe werkt de Tafel der Draden?' : '🧵 Zo werkt de Tafel der Draden (lees dit eerst)') + '</summary>' + TUT + (seen ? '' : '<div class="row" style="margin-top:8px"><button class="b sm" data-pt="tutok">Begrepen</button></div>') + '</details></div>';
    const stat = players.map(p => { const k = keyOf(p), rd = ((d.ready || {})[k]) === true; const n = ck.filter(c => talkInfo(d, p, c).lines > 0).length; return esc(p) + ': ' + n + '/' + ck.length + ' gesproken' + (rd ? ', klaar met leggen' : ''); }).join(' · ');
    h += '<div class="status" style="border:0;border-radius:8px;margin-bottom:10px"><b>' + (done ? 'Beraad afgerond' : phase === 'gesprekken' ? 'Stap 1: voorgesprekken' : ready ? 'Stap 3: de draden zijn onthuld' : 'Stap 2: draden leggen') + '</b><br>' + stat + '<br><small>' +
      (done ? '' : phase === 'gesprekken' ? 'Spreek elke kandidaat kort onder vier ogen (hoogstens ' + MAX_LINES + ' berichten). De DM antwoordt bij de volgende beurt. Je ziet van de ander alleen een korte samenvatting.' :
       ready ? 'Jullie keuzes zijn zichtbaar. Bij verschil: één zin als beraad, en één Voorspraak per speler.' : 'Leg per kandidaat een draad op een plek en druk daarna op Klaar. Pas als jullie allebei klaar zijn, worden de keuzes onthuld.') + '</small></div>';
    ck.forEach(c => {
      const nd = cands[c], ti = talkInfo(d, me, c), img = (ctx.npcs[c] || ctx.npcs[keyOf(nd.name)] || {}).img;
      h += '<div class="card"><div class="npc">' + (img ? '<img class="th" src="' + esc(img) + '" alt="">' : '<div class="th">' + esc((nd.name || c).slice(0, 1)) + '</div>') + '<div class="info"><b>' + esc(nd.name || c) + '</b>' + (nd.role ? ' <small>' + esc(nd.role) + '</small>' : '') +
        (nd.demands ? '<div style="margin-top:4px;font-style:italic">“' + esc(nd.demands) + '”</div>' : '') + '</div></div>';
      const info = [nd.wants && ['Wil', nd.wants], nd.fears && ['Vreest', nd.fears]].filter(Boolean).map(x => '<div><b>' + x[0] + ':</b> ' + esc(x[1]) + '</div>').join('') +
        vals(nd.dossier).map(x => '<div>• ' + esc(x.text || x) + '</div>').join('');
      if (info) h += '<details><summary>Wat jullie weten</summary>' + info + '</details>';
      others.forEach(o => { const oi = talkInfo(d, o, c); if (oi.summary) h += '<div style="margin:4px 0"><small>' + esc(o) + ' sprak hierover: ' + esc(oi.summary) + '</small></div>'; else if (oi.lines) h += '<div style="margin:4px 0"><small>' + esc(o) + ' heeft hierover gesproken.</small></div>'; });
      const open = openTalk === c;
      h += '<div class="row" style="margin-top:6px"><button class="b alt sm" data-pt="talk" data-k="' + esc(c) + '">💬 ' + (ti.lines ? 'Gesprek (' + ti.lines + '/' + MAX_LINES + ')' : 'Spreek met ' + esc((nd.name || c).split(' ')[0])) + '</button></div>';
      if (open) {
        h += '<div style="margin-top:8px">' + (ti.msgs.map(m => '<div class="q' + (m.from === 'speler' ? '' : ' done') + '"><small>' + (m.from === 'speler' ? esc(me) : esc(nd.name || c)) + '</small><br>' + esc(m.text) + '</div>').join('') || '<small>Nog niets gezegd.</small>');
        if (ti.state === 'pending') h += '<div><small>⏳ ' + esc(nd.name || c) + ' antwoordt bij de volgende beurt.</small></div>';
        else if (ti.canWrite) h += '<textarea data-k="' + esc(c) + '" maxlength="' + MAX_TEXT + '" placeholder="Wat zeg of vraag je? (kort, je personage spreekt)" style="min-height:60px">' + esc(keep[c] || '') + '</textarea><div class="row"><button class="b sm" data-pt="send" data-k="' + esc(c) + '">Zeg het</button></div>';
        else h += '<div><small>Dit gesprek is afgerond.</small></div>';
        h += '</div>';
      }
      if (phase !== 'gesprekken' || myReady) {
        const mine = myPicks[c], locked = myReady || done || phase !== 'leggen', info2 = (nd.slotInfo || {});
        h += '<div class="chips" style="gap:6px;margin-top:8px">' + SLOTS.map(s => '<button class="b sm' + (mine === s.id ? '' : ' alt') + '" ' + (locked ? 'disabled ' : '') + 'data-pt="pick" data-k="' + esc(c) + '" data-s="' + s.id + '" title="' + esc(info2[s.id] || s.info) + '">' + s.icon + ' ' + s.label + '</button>').join('') + '</div>';
        if (mine) h += '<div><small>' + esc((info2[mine] || (SLOTS.find(s => s.id === mine) || {}).info || '')) + '</small></div>';
      }
      if (final && final[c]) h += '<div class="q" style="margin-top:8px"><b>' + esc(((SLOTS.find(s => s.id === final[c].slot) || {}).icon || '') + ' ' + ((SLOTS.find(s => s.id === final[c].slot) || {}).label || final[c].slot)) + '</b>' + (final[c].note ? '<br>' + esc(final[c].note) : '') + '</div>';
      h += '</div>';
    });
    if (phase === 'leggen' && !myReady && !done) h += '<button class="b" data-pt="ready">✅ Klaar met leggen (nog niet gekozen telt als Wacht)</button>';
    else if (myReady && !ready && !done) h += '<div class="card">Jouw draden liggen klaar. Wacht tot ' + esc(others.join(', ') || 'de ander') + ' ook klaar is.</div>';
    if (myReady && !ready && !done) h += '<button class="b alt sm" data-pt="unready">Toch nog wijzigen</button>';
    if (ready || done) {
      const cmp = compare(d, players);
      h += '<h2>De onthulling</h2><div class="card">';
      cmp.forEach(r => {
        const sl = r.by, mism = !r.agree, my = ((d.beraad || {})[mk] || {})[r.key];
        h += '<div class="q' + (mism ? '' : ' done') + '"><b>' + esc(r.name) + '</b>: ' + players.map(p => esc(p) + ' ' + ((SLOTS.find(s => s.id === sl[p]) || {}).icon || '') + ' ' + ((SLOTS.find(s => s.id === sl[p]) || {}).label || sl[p])).join(' · ') + (mism ? ' <b>(verschil)</b>' : ' ✓');
        if (mism && !done) {
          players.forEach(p => { const v = ((d.beraad || {})[keyOf(p)] || {})[r.key]; if (v) h += '<br><small>' + esc(p) + ': “' + esc(v) + '”</small>'; });
          if (!my) h += '<br><textarea data-k="b_' + esc(r.key) + '" maxlength="220" placeholder="Eén zin om de ander te overtuigen" style="min-height:44px">' + esc(keep['b_' + r.key] || '') + '</textarea><button class="b sm" data-pt="beraad" data-k="' + esc(r.key) + '">Zeg het</button>';
        }
        h += '</div>';
      });
      const vs = (d.voorspraak || {})[mk];
      if (!done) h += '<div class="row" style="margin-top:8px"><b>Voorspraak (één per speler):</b> ' + (vs ? esc((cands[vs] || {}).name || vs) + ' (gekozen)' : '<select data-pt="vsel">' + '<option value="">Kies een kandidaat</option>' + ck.filter(c => talkInfo(d, me, c).lines > 0).map(c => '<option value="' + esc(c) + '">' + esc(cands[c].name || c) + '</option>').join('') + '</select><button class="b sm" data-pt="voorspraak">Gebruik</button>') + '</div>';
      players.forEach(p => { const v = (d.voorspraak || {})[keyOf(p)]; if (v && p !== me) h += '<div><small>' + esc(p) + ' koos voor een Voorspraak voor ' + esc((cands[v] || {}).name || v) + '.</small></div>'; });
      h += '</div>';
      if (!done) h += '<div class="card"><small>De DM sluit het beraad bij de volgende beurt af en bevestigt waar iedereen belandt.</small></div>';
    }
    box.innerHTML = h;
    box.querySelectorAll("[data-pt]").forEach(b => { b.onclick = () => act(b, ctx, box); });
  }

  function act(b, ctx, box) {
    const d = ctx.data || {}, me = ctx.me.name, mk = keyOf(me), base = ctx.base, db = ctx.db, a = b.dataset.pt, c = b.dataset.k;
    if (a === "tutok") { try { localStorage.setItem(tutKey(ctx), "1"); } catch (e) {} render(box, ctx); return; }
    if (a === "talk") { openTalk = openTalk === c ? null : c; render(box, ctx); return; }
    if (a === "send") {
      const ta = box.querySelector('textarea[data-k="' + c + '"]'); const text = clean(ta && ta.value); if (!text) return;
      const ti = talkInfo(d, me, c); if (!ti.canWrite) return;
      const id = db.ref(base + "/talks").push().key, up = {};
      up["talks/" + mk + "/" + c + "/msgs/" + id] = { from: "speler", text: text, t: Date.now() }; up["talks/" + mk + "/" + c + "/state"] = "pending";
      db.ref(base).update(up); return;
    }
    if (a === "pick") { if (!SLOT_IDS.includes(b.dataset.s) || ((d.ready || {})[mk])) return; db.ref(base + "/picks/" + mk + "/" + c).set(b.dataset.s); return; }
    if (a === "ready") {
      const up = { ["ready/" + mk]: true }; Object.keys(d.cands || {}).forEach(k => { if (!((d.picks || {})[mk] || {})[k]) up["picks/" + mk + "/" + k] = "wacht"; });
      db.ref(base).update(up); return;
    }
    if (a === "unready") { if (allReady(d, ctx.players)) return; db.ref(base + "/ready/" + mk).set(false); return; }
    if (a === "beraad") { const ta = box.querySelector('textarea[data-k="b_' + c + '"]'); const text = clean(ta && ta.value).slice(0, 220); if (!text) return; db.ref(base + "/beraad/" + mk + "/" + c).set(text); return; }
    if (a === "voorspraak") { const s = box.querySelector('select[data-pt="vsel"]'); if (!s || !s.value) return; db.ref(base + "/voorspraak/" + mk).set(s.value); return; }
  }

  /* is er iets dat de speler nog moet doen? (voor een stip in het menu) */
  function needsMe(data, me, players) {
    if (!data || !data.open || data.final || data.phase === "klaar") return false;
    const mk = keyOf(me), c = Object.keys(data.cands || {});
    if ((data.phase || "gesprekken") === "gesprekken") return c.some(k => talkInfo(data, me, k).lines === 0);
    return !((data.ready || {})[mk]);
  }

  return { TUT: TUT, SLOTS: SLOTS, SLOT_IDS: SLOT_IDS, MAX_LINES: MAX_LINES, PHASES: PHASES, keyOf: keyOf, allReady: allReady, compare: compare, talkInfo: talkInfo, pendingTalks: pendingTalks, clean: clean, needsMe: needsMe, render: render };
});
