/* Gevechtskaart in het spel: tonen, bewegen en richten. Logica en tekenwerk staan in battlemap.js.
   Gebruikt de globale gegevens van index.html (getState, turn, pending, me, npcs, chars, rollTgt, ...). */
const BMUI = (function () {
  "use strict";
  let round = null, moves = [], dest = null, dash = false, diseng = false, editing = false, note = "", tab = "map", zoom = 0, ctx = null, drag = false, down = null, lastGrid = "";
  const q = s => document.querySelector(s), low = s => String(s).toLowerCase();
  function reset() { moves = []; dest = null; dash = false; diseng = false; editing = false; note = ""; }
  const speeds = () => { const r = {}; allChars().forEach(c => { if (c.name) r[c.name] = Number(c.speed) || 30; }); return r; };
  function pic(name) {
    let n = npcs[slug(name)]; if (n && n.img) return n.img;
    const p = String(name).split(" "); if (p.length > 1 && /^(\d+|[A-Z])$/.test(p[p.length - 1])) n = npcs[slug(p.slice(0, -1).join(" "))];
    return n && n.img ? n.img : "";
  }
  const myPend = () => me && turn && pending[me.uid] && pending[me.uid].round === turn.round ? pending[me.uid] : null;

  /* alles wat nu op de kaart te zien is: de Stand, daaroverheen de al verstuurde zetten en die van jou in wording */
  function build() {
    const S = getState(); if (!window.BattleMap || !BattleMap.active(S)) return null;
    if (turn && turn.round !== round) { round = turn.round; reset(); }
    const m = BattleMap.model(S, speeds()), c = myChar();
    const find = n => m.tokens.find(t => low(t.name) === low(n));
    const mine = c && c.name ? find(c.name) : null, sent = myPend();
    const waiting = !!(turn && turn.status === "waiting"), myTurn = waiting && awaitingNames().includes(me.name);
    const canMove = !!(mine && !mine.out && waiting && ((myTurn && !sent) || editing));
    const place = (t, at) => { const p = BattleMap.parse(at); if (t && p) { t.x = p[0]; t.y = p[1]; } };
    Object.values(pending || {}).filter(p => turn && p.round === turn.round).forEach(p => { if (editing && p.name === me.name) return; BattleMap.parseMoves(p.text).forEach(mv => { place(find(mv.name), mv.to); if (find(mv.name)) delete m.from[find(mv.name).name]; }); });
    if (canMove && moves.length) { place(mine, moves[moves.length - 1].to); delete m.from[mine.name]; }
    const info = combatInfo(S), list = info ? info.list : [], entry = n => list.find(x => low(x.o.name) === low(n));
    const target = rollTgt ? find(rollTgt) : null;
    return { S, m, c, mine, canMove, sent, entry, info, target: target && !target.out ? target : null };
  }
  const used = () => moves.reduce((a, x) => a + x.ft, 0);
  const left = () => ctx.mine.speed * (dash ? 2 : 1) - used();
  const reachRoutes = () => BattleMap.routes(ctx.m, ctx.mine, Math.max(0, left()) + (dash ? 0 : ctx.mine.speed));

  /* welke aanvallen van het blad halen het doelwit? */
  function weaponLine() {
    const { c, m, mine, target } = ctx; if (!target) return "";
    const from = dest && ctx.canMove ? Object.assign({}, mine, { x: dest.x, y: dest.y }) : mine;
    if (!from) return "🎯 <b>" + esc(target.name) + "</b>";
    const ft = BattleMap.dist(from, target) * 5, cov = ft > 5 ? BattleMap.cover(m, from, target) : null;
    const close = m.tokens.some(o => !o.out && BattleMap.foes(o, from) && BattleMap.dist(from, o) <= 1);
    let sharpAny = false;
    const parts = isGen(c) ? [] : attacksOf(c).map(a => {
      const base = low(a.base || a.name), w = CC_W.filter(x => base.indexOf(low(x[0])) >= 0).sort((x, y) => y[0].length - x[0].length)[0];
      const props = w ? w[5] : String(a.notes || ""), rm = /(\d+)\s*\/\s*(\d+)/.exec(props), ranged = !!w && w[2] === "r", reach = /\bReach\b/.test(props) ? 10 : 5;
      const sharp = ranged && featAtk(c, a).sharp; if (sharp) sharpAny = true;
      const nm = esc(a.name || "Aanval"), ok = t => '<span class="bmok">✔ ' + nm + t + "</span>", warn = t => '<span class="bmwarn">' + nm + t + "</span>", no = '<span class="bmbad">✖ ' + nm + "</span>";
      if (!ranged && ft <= reach) return ok("");
      if (rm && (ranged || /thrown|werp/i.test(props))) {
        if (ft > Number(rm[2])) return no;
        if (ft > Number(rm[1])) return sharp ? ok(" (ver, geen nadeel)") : warn(": ver (nadeel)");
        if (close && !sharp) return warn(": vijand naast je (nadeel)");
        return ok(ranged ? "" : " (werpen)");
      }
      return no;
    });
    return "🎯 <b>" + esc(target.name) + "</b> op " + ft + " ft" + (parts.length ? ": " + parts.join(" · ") : "") + (cov ? ' · <span class="bmwarn">dekking (' + cov + ")" + (sharpAny ? ", telt niet voor je boog (half of ¾)" : "") + "</span>" : "");
  }

  function bar() {
    const b = q("#bmbar"); if (!b) return;
    const { mine, canMove, sent, m, c } = ctx; let h = "";
    if (canMove) {
      h += "<span><b>" + esc(mine.name) + "</b> · nog <b>" + Math.max(0, left()) + " ft</b> van " + mine.speed * (dash ? 2 : 1) + '</span><label><input type="checkbox" id="bmdash"' + (dash ? " checked" : "") + '>Dash</label><label><input type="checkbox" id="bmdis"' + (diseng ? " checked" : "") + ">Disengage</label>";
      if (dest) {
        const over = dest.c > left(), oa = diseng ? [] : BattleMap.opportunity(m, mine, BattleMap.pathOf(dest));
        h += "<span>" + BattleMap.sq(mine.x, mine.y) + " → <b>" + BattleMap.sq(dest.x, dest.y) + "</b>, " + dest.c + " ft</span>" +
          (over ? '<span class="bmwarn">⚠ Alleen met Dash (kost je actie)</span>' : "") + (oa.length ? '<span class="bmbad">⚠ Opportunity Attack van ' + esc(oa.join(" en ")) + "</span>" : "") +
          '<button type="button" class="b sm" id="bmok">' + (over ? "Dash en loop" : "Loop") + '</button><button type="button" class="b alt sm" id="bmno">Annuleer</button>';
      } else if (moves.length) h += '<span class="bmok">👣 ' + moves.map(x => x.from + "→" + x.to).join(", ") + ' (gaat mee met je actie)</span><button type="button" class="b alt sm" id="bmundo">↶ Beweging terug</button>';
      else h += '<span class="bmmute">Tik een vakje of sleep je token. Tik een vijand om te richten.</span>';
    } else h += '<span class="bmmute">' + (!c ? "Je hebt geen personage op deze kaart." : !mine ? esc(c.name) + " staat nog niet op de kaart." : mine.out ? esc(mine.name) + " is uitgeschakeld." : sent ? 'Je actie is verstuurd. Wil je anders lopen: kies "wijzig".' : "Je kunt bewegen als je aan de beurt bent. Tik een vijand om afstanden te zien.") + "</span>";
    if (ctx.target) h += '<span class="bmline">' + weaponLine() + "</span>";
    if (note) h += '<span class="bmline bmbad">' + esc(note) + "</span>";
    if (b.innerHTML !== h) b.innerHTML = h; else return;
    const d = q("#bmdash"); if (d) d.onchange = e => { if (!e.target.checked && used() > mine.speed) note = "Je loopt al verder dan je snelheid; zet eerst je beweging terug."; else { dash = e.target.checked; note = ""; } dest = null; b.innerHTML = ""; draw(); };
    const ds = q("#bmdis"); if (ds) ds.onchange = e => { diseng = e.target.checked; draw(); };
    const ok = q("#bmok"); if (ok) ok.onclick = commit;
    const no = q("#bmno"); if (no) no.onclick = () => { dest = null; draw(); };
    const u = q("#bmundo"); if (u) u.onclick = () => { moves = []; dest = null; dash = false; note = ""; draw(); };
  }
  function commit() {
    if (!ctx || !dest || !ctx.canMove) return;
    if (dest.c > left()) dash = true;
    const t = ctx.mine;
    moves.push({ name: t.name, from: BattleMap.sq(t.x, t.y), to: BattleMap.sq(dest.x, dest.y), ft: dest.c, dash, disengage: diseng, oa: diseng ? [] : BattleMap.opportunity(ctx.m, t, BattleMap.pathOf(dest)) });
    dest = null; draw();
  }
  function setTarget(name) {
    const e = ctx && ctx.entry(name); if (e) name = String(e.o.name);
    rollTgt = rollTgt === name ? "" : name;
    if (q("#rsel")) updateRoll();
    draw();
  }
  function pick(x, y) {
    if (!ctx) return; const { m, mine, canMove } = ctx; note = "";
    const o = BattleMap.occ(m, x, y);
    if (o && o !== mine) { if (o.side === "foe") setTarget(o.name); else { note = "Daar staat " + o.name + "; je kunt er niet eindigen."; dest = null; draw(); } return; }
    if (!canMove || (x === mine.x && y === mine.y)) { dest = null; draw(); return; }
    if (BattleMap.wall(m, x, y)) { note = "Daar kun je niet staan: " + (BattleMap.BLOCK[BattleMap.terrain(m, x, y)] || "buiten de kaart") + "."; dest = null; draw(); return; }
    const n = reachRoutes()[x + "," + y];
    if (!n || !BattleMap.canStop(m, mine, x, y)) { dest = null; note = BattleMap.sq(x, y) + (n ? " is bezet." : " is te ver, ook met Dash, of niet bereikbaar."); } else dest = n;
    draw();
  }
  function draw() {
    ctx = build(); const svg = q("#bmsvg"); if (!ctx || !svg) return;
    const { m, mine, canMove, entry, info } = ctx;
    if (!canMove) dest = null; else if (dest) { dest = reachRoutes()[dest.x + "," + dest.y] || null; }
    let current = [];
    if (turn && turn.status === "waiting") awaitingNames().forEach(n => { const k = (partyOf() || {})[n], c = k && chars[k]; const ch = c || allChars().find(x => x.player === n); if (ch) current.push(...m.tokens.filter(t => low(t.name) === low(ch.name)).map(t => t.name)); });
    if (!current.length && info) current = info.list.filter(x => x.act).map(x => m.tokens.find(t => low(t.name) === low(x.o.name))).filter(Boolean).map(t => t.name);
    BattleMap.render(svg, m, { pic, pct: n => { const e = entry(n); return e ? e.pct : null; }, current, mover: mine,
      budget: canMove ? { routes: reachRoutes(), left: left() } : null, path: dest ? BattleMap.pathOf(dest) : null,
      target: ctx.target, aim: ctx.target && mine ? (dest ? Object.assign({}, mine, { x: dest.x, y: dest.y }) : mine) : null });
    q("#bmtitle").textContent = m.title;
    bar();
  }
  function fit() {
    const box = q("#bmscroll"), svg = q("#bmsvg"); if (!box || !svg || !ctx || !box.clientWidth) return;
    const vw = ctx.m.W * BattleMap.S + 30, vh = ctx.m.H * BattleMap.S + 30, narrow = innerWidth < 1000;
    const all = Math.min((box.clientWidth - 16) / vw, (box.clientHeight - 16) / vh);
    const k = narrow && zoom !== -1 ? Math.max(all, Math.min((box.clientHeight - 16) / vh, .8), .5) : all;
    const z = Math.max(.2, k) * Math.pow(1.3, zoom); svg.style.width = vw * z + "px"; svg.style.height = vh * z + "px"; focus();
  }
  /* als de kaart groter is dan het venster: schuif naar je eigen token */
  function focus() {
    const box = q("#bmscroll"), svg = q("#bmsvg"), t = ctx && (ctx.mine || ctx.m.tokens[0]); if (!t || !svg.style.width) return;
    const z = parseFloat(svg.style.width) / (ctx.m.W * BattleMap.S + 30), S = BattleMap.S;
    box.scrollLeft = (t.x * S + 22 + S / 2) * z - box.clientWidth / 2; box.scrollTop = (t.y * S + 22 + S / 2) * z - box.clientHeight / 2;
  }
  function setTab(t) {
    tab = t; const w = q("#gamewrap"); if (w) w.dataset.bt = t;
    document.querySelectorAll("#bmtabs button").forEach(b => b.classList.toggle("alt", b.dataset.bt !== t));
    if (t === "map") fit(); else { const th = q("#thread"); if (th) { seenNarr = null; renderGame(); } }
  }
  function mount(col) {
    col.innerHTML = '<div id="bmtitle"></div><div id="bmzoom"><button type="button" data-z="-1" aria-label="Uitzoomen">−</button><button type="button" data-z="0">Passend</button><button type="button" data-z="1" aria-label="Inzoomen">+</button></div><div id="bmscroll"><svg id="bmsvg" role="img" aria-label="Gevechtskaart"></svg></div><div id="bmbar"></div>';
    col.querySelectorAll("[data-z]").forEach(b => b.onclick = () => { const d = Number(b.dataset.z); zoom = d ? Math.max(-2, Math.min(5, zoom + d)) : (innerWidth < 1000 ? -1 : 0); fit(); });
    const svg = q("#bmsvg"), own = c => ctx && ctx.canMove && c[0] === ctx.mine.x && c[1] === ctx.mine.y;
    svg.addEventListener("touchstart", e => { if (e.touches.length === 1 && own(BattleMap.cellAt(svg, e.touches[0]))) e.preventDefault(); }, { passive: false });
    svg.addEventListener("pointerdown", e => { const c = BattleMap.cellAt(svg, e); down = [e.clientX, e.clientY]; drag = own(c); if (drag) { try { svg.setPointerCapture(e.pointerId); } catch (err) {} } });
    svg.addEventListener("pointermove", e => { if (!drag || !down) return; const [x, y] = BattleMap.cellAt(svg, e), n = reachRoutes()[x + "," + y];
      const nw = n && (x !== ctx.mine.x || y !== ctx.mine.y) && BattleMap.canStop(ctx.m, ctx.mine, x, y) ? n : null;
      if ((nw && nw.x + "," + nw.y) !== (dest && dest.x + "," + dest.y)) { dest = nw; draw(); } });
    svg.addEventListener("pointerup", e => { if (!down) return; const moved = Math.hypot(e.clientX - down[0], e.clientY - down[1]), was = drag; down = null; drag = false; if (was || moved < 10) pick(...BattleMap.cellAt(svg, e)); });
    svg.addEventListener("pointercancel", () => { down = null; drag = false; });
    new ResizeObserver(() => fit()).observe(q("#bmscroll"));
  }
  /* aangeroepen door renderGame */
  function render() {
    const wrap = q("#gamewrap"), col = q("#battlecol"), tabs = q("#bmtabs"); if (!wrap || !col) return;
    ctx = build();
    wrap.classList.toggle("battle", !!ctx);
    if (!ctx) { col.innerHTML = ""; tabs.innerHTML = ""; lastGrid = ""; delete wrap.dataset.bt; return; }
    const fresh = !q("#bmsvg"); if (fresh) mount(col);
    if (!tabs.innerHTML) { tabs.innerHTML = '<button type="button" class="b sm" data-bt="map">🗺 Kaart</button><button type="button" class="b sm" data-bt="story">📜 Verhaal</button>'; tabs.querySelectorAll("button").forEach(b => b.onclick = () => setTab(b.dataset.bt)); }
    wrap.dataset.bt = tab; tabs.querySelectorAll("button").forEach(b => b.classList.toggle("alt", b.dataset.bt !== tab));
    draw();
    const g = JSON.stringify(ctx.m.grid); if (fresh || g !== lastGrid) { lastGrid = g; fit(); }
  }
  /* op een smal scherm eerst het verhaal van een nieuwe beurt lezen */
  function showStory() { tab = "story"; const w = q("#gamewrap"); if (w && w.classList.contains("battle")) { w.dataset.bt = tab; document.querySelectorAll("#bmtabs button").forEach(b => b.classList.toggle("alt", b.dataset.bt !== tab)); } }
  /* bij versturen: de zetten als tekst; null = de speler wil eerst zijn zet afmaken */
  function tags() {
    if (!ctx || !ctx.canMove) return "";
    if (dest && !confirm("Je hebt een zet klaarstaan die nog niet met \"Loop\" is vastgelegd. Toch versturen zonder die zet?")) return null;
    return moves.map(x => "  [kaart: " + BattleMap.moveTag(x) + "]").join("");
  }
  function sent() { reset(); }
  /* "wijzig": de al verstuurde zetten weer bewerkbaar maken */
  function edit(text) { reset(); if (!window.BattleMap) return; moves = BattleMap.parseMoves(text); dash = moves.some(x => x.dash); diseng = moves.some(x => x.disengage); editing = true; }
  const strip = t => String(t || "").replace(/\s*\[kaart:[^\]]*\]/gi, "");
  return { render, draw, tags, sent, edit, strip, showStory, reset, setTab };
})();
