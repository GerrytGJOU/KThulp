/* Gevechtskaart: gedeelde logica (app en DM-script) en het tekenen ervan (alleen in de browser).
   De kaart staat in de Stand: state.battle = {title, grid:["..TT..",...], pos:{"Wulfgrim":"G6"}, size:{"Warg":2}, speed:{"Orc 1":30}, from:{}}.
   Spelers sturen hun zet mee in hun actie als "[kaart: Naam G6>K5, 20 ft, Dash]"; advance() verwerkt die vóór de wijzigingen van de DM. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory(); else root.BattleMap = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  const BLOCK = { T: "boom", R: "rots", "#": "muur", C: "vuur", x: "obstakel", W: "diep water of afgrond" };
  const HARD = { w: "ondiep water", b: "struiken of puin" };
  const OPEN = { ".": "gras of grond", p: "pad", s: "stenen vloer", e: "kale aarde" };
  const MAXW = 30, MAXH = 24;

  /* ---------- vakjes ---------- */
  const col = x => (x >= 26 ? "A" : "") + String.fromCharCode(65 + x % 26);
  const sq = (x, y) => col(x) + (y + 1);
  function parse(s) {
    const m = /^\s*([A-Za-z]{1,2})\s*(\d{1,2})\s*$/.exec(String(s || "")); if (!m) return null;
    const c = m[1].toUpperCase(), x = c.length === 1 ? c.charCodeAt(0) - 65 : (c.charCodeAt(0) - 64) * 26 + c.charCodeAt(1) - 65;
    return [x, Number(m[2]) - 1];
  }

  /* ---------- model uit de Stand ---------- */
  const lower = s => String(s).toLowerCase();
  const find = (obj, name) => { const w = lower(name); const e = Object.entries(obj || {}).find(([k, v]) => lower(k) === w || lower((v && v.name) || "") === w); return e ? (e[1] || {}) : null; };
  function order(state) { const i = state && state.initiative; return (Array.isArray(i) ? i : (i && Array.isArray(i.order) ? i.order : [])).map(o => typeof o === "string" ? { name: o } : o).filter(o => o && o.name); }
  function hasGrid(b) { return !!(b && Array.isArray(b.grid) && b.grid.length && b.grid.every(r => typeof r === "string")); }
  function active(state) { return hasGrid(state && state.battle) && order(state).length > 0; }
  /* speeds: {naam: voet} van de karakterbladen */
  function model(state, speeds) {
    const b = state && state.battle; if (!hasGrid(b)) return null;
    const grid = b.grid.slice(0, MAXH).map(r => r.slice(0, MAXW)), W = Math.max.apply(null, grid.map(r => r.length)), H = grid.length;
    const ord = order(state), tokens = [];
    Object.entries(b.pos || {}).forEach(([name, at]) => {
      const p = parse(at); if (!p) return;
      const o = ord.find(x => lower(x.name) === lower(name)), pc = find(state.pcs, name), comp = find(state.companions, name);
      let side = pc ? "pc" : comp ? "ally" : !o ? "neutral" : (o.enemy === false || o.ally === true) ? "ally" : "foe";
      if (o && o.enemy === true) side = "foe";
      const hp = pc && pc.hp, cur = hp && typeof hp === "object" ? (hp.current != null ? hp.current : hp.cur) : typeof hp === "number" ? hp : null;
      const out = !!o && (/gevlucht|overgegeven|verslagen|dood|gedood|bewusteloos|uitgeschakeld/i.test(String(o.status || "")) || (o.health != null && Number(o.health) === 0)) || cur === 0;
      const size = Math.max(1, Math.min(4, Number((b.size || {})[name]) || 1));
      const speed = Number((b.speed || {})[name]) || Number((speeds || {})[name]) || 30;
      tokens.push({ name, x: p[0], y: p[1], size, side, out, speed });
    });
    return { grid, W, H, tokens, title: String(b.title || ""), from: b.from || {} };
  }
  const terrain = (m, x, y) => (x < 0 || y < 0 || x >= m.W || y >= m.H) ? "" : (m.grid[y][x] || ".");
  const wall = (m, x, y) => { const c = terrain(m, x, y); return !c || !!BLOCK[c]; };
  const cells = (t, x, y) => { const r = []; for (let i = 0; i < t.size; i++) for (let j = 0; j < t.size; j++) r.push([(x == null ? t.x : x) + i, (y == null ? t.y : y) + j]); return r; };
  const occ = (m, x, y, not) => m.tokens.find(t => t !== not && !t.out && cells(t).some(c => c[0] === x && c[1] === y));
  const foes = (a, b) => a.side !== "neutral" && b.side !== "neutral" && (a.side === "foe") !== (b.side === "foe");
  /* afstand in vakjes (diagonaal telt als 1, zoals op een 5e-raster) */
  function dist(a, b, ax, ay) { let d = 999; cells(a, ax, ay).forEach(p => cells(b).forEach(q => { d = Math.min(d, Math.max(Math.abs(p[0] - q[0]), Math.abs(p[1] - q[1]))); })); return d; }
  /* goedkoopste routes: 5 ft per vak, moeilijk terrein 10; muren blokkeren, vijanden mag je niet passeren, bondgenoten wel */
  function routes(m, t, max) {
    const best = {}, q = [{ x: t.x, y: t.y, c: 0, k: 0, prev: null }]; best[t.x + "," + t.y] = q[0];
    while (q.length) {
      q.sort((a, b) => a.c - b.c || a.k - b.k); const n = q.shift(); if (n !== best[n.x + "," + n.y]) continue;
      for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) {
        if (!dx && !dy) continue;
        const x = n.x + dx, y = n.y + dy, cs = cells(t, x, y);
        if (cs.some(([a, b]) => { if (wall(m, a, b)) return true; const o = occ(m, a, b, t); return !!o && foes(o, t); })) continue;
        if (dx && dy && (wall(m, n.x + dx, n.y) || wall(m, n.x, n.y + dy))) continue; /* niet schuin langs een hoek */
        const c = n.c + (cs.some(([a, b]) => HARD[terrain(m, a, b)]) ? 10 : 5); if (c > max) continue;
        const k = x + "," + y, kk = n.k + (dx && dy ? 1 : 0);
        if (!best[k] || c < best[k].c || (c === best[k].c && kk < best[k].k)) { best[k] = { x, y, c, k: kk, prev: n }; q.push(best[k]); }
      }
    }
    return best;
  }
  const canStop = (m, t, x, y) => !cells(t, x, y).some(([a, b]) => wall(m, a, b) || occ(m, a, b, t));
  const pathOf = n => { const p = []; for (; n; n = n.prev) p.unshift([n.x, n.y]); return p; };
  /* vijanden uit wier bereik (5 ft) deze route wegloopt */
  function opportunity(m, t, path) {
    const r = [];
    for (let i = 1; i < path.length; i++) m.tokens.filter(o => !o.out && foes(o, t)).forEach(o => { if (dist(t, o, path[i - 1][0], path[i - 1][1]) <= 1 && dist(t, o, path[i][0], path[i][1]) > 1 && r.indexOf(o.name) < 0) r.push(o.name); });
    return r;
  }
  /* ligt er iets hoogs op de lijn tussen twee tokens? (vereenvoudigd) */
  function cover(m, a, b) {
    const ax = a.x + a.size / 2, ay = a.y + a.size / 2, bx = b.x + b.size / 2, by = b.y + b.size / 2;
    for (let i = 1; i < 60; i++) { const c = terrain(m, Math.floor(ax + (bx - ax) * i / 60), Math.floor(ay + (by - ay) * i / 60)); if (c === "T" || c === "R" || c === "#" || c === "x") return BLOCK[c]; }
    return null;
  }

  /* ---------- zetten van spelers ---------- */
  function moveTag(mv) { return mv.name + " " + mv.from + ">" + mv.to + ", " + mv.ft + " ft" + (mv.dash ? ", Dash" : "") + (mv.disengage ? ", Disengage" : "") + (mv.oa && mv.oa.length ? ", lokt Opportunity Attack uit van " + mv.oa.join(" en ") : ""); }
  function parseMoves(text) {
    const r = [], re = /\[kaart:\s*([^\]]*?)\s+([A-Za-z]{1,2}\d{1,2})>([A-Za-z]{1,2}\d{1,2}),\s*(\d+)\s*ft([^\]]*)\]/gi; let x;
    while ((x = re.exec(String(text || "")))) r.push({ name: x[1].trim(), from: x[2].toUpperCase(), to: x[3].toUpperCase(), ft: Number(x[4]), dash: /\bDash\b/.test(x[5]), disengage: /Disengage/.test(x[5]), oa: (/uit van ([^,\]]+)/.exec(x[5]) || [, ""])[1].split(" en ").filter(Boolean) });
    return r;
  }

  /* ---------- controle ---------- */
  function check(state, prev) {
    const errors = [], warnings = [], b = state && state.battle; if (!b) return { errors, warnings, bad: [] };
    const bad = [];
    if (!hasGrid(b)) { errors.push("battle.grid ontbreekt of is geen lijst tekstregels"); return { errors, warnings, bad }; }
    const w = b.grid[0].length;
    if (b.grid.length > MAXH || w > MAXW) errors.push("de kaart is te groot (hoogstens " + MAXW + " breed en " + MAXH + " hoog)");
    if (b.grid.some(r => r.length !== w)) errors.push("niet alle regels van battle.grid zijn even lang");
    const onbekend = [...new Set(b.grid.join("").split(""))].filter(c => !BLOCK[c] && !HARD[c] && !OPEN[c]);
    if (onbekend.length) errors.push("onbekende terreintekens: " + onbekend.join(" "));
    Object.entries(b.pos || {}).forEach(([n, at]) => { if (!parse(at)) { errors.push(n + ": ongeldig vakje \"" + at + "\""); bad.push(n); } });
    const m = model(state); const names = order(state).map(o => o.name);
    m.tokens.forEach((t, i) => {
      const c = cells(t);
      if (c.some(([x, y]) => wall(m, x, y))) { errors.push(t.name + " staat op " + sq(t.x, t.y) + " buiten de kaart of op " + (BLOCK[terrain(m, t.x, t.y)] || "een blokkade")); bad.push(t.name); }
      if (!t.out) m.tokens.slice(i + 1).forEach(o => { if (!o.out && cells(o).some(([x, y]) => c.some(p => p[0] === x && p[1] === y))) { errors.push(t.name + " en " + o.name + " staan op hetzelfde vakje"); bad.push(o.name); } });
    });
    names.filter(n => !Object.keys(b.pos || {}).some(k => lower(k) === lower(n))).forEach(n => warnings.push(n + " staat in initiative maar niet op de kaart (battle.pos)"));
    m.tokens.filter(t => t.side === "neutral").forEach(t => warnings.push(t.name + " staat op de kaart maar niet in initiative"));
    const pm = prev && hasGrid(prev.battle) ? model(prev) : null;
    if (pm) m.tokens.forEach(t => {
      const o = pm.tokens.find(x => x.name === t.name); if (!o || (o.x === t.x && o.y === t.y)) return;
      const r = routes(pm, o, o.speed * 2)[t.x + "," + t.y];
      if (!r) warnings.push(t.name + " verplaatst van " + sq(o.x, o.y) + " naar " + sq(t.x, t.y) + ": verder dan met Dash kan, of geen vrije route");
      else if (r.c > o.speed) warnings.push(t.name + " loopt " + r.c + " ft bij snelheid " + o.speed + ": dat vraagt Dash");
    });
    return { errors: [...new Set(errors)], warnings, bad: [...new Set(bad)] };
  }
  /* nieuwe Stand na een beurt: eerst de zetten van de spelers, dan de wijzigingen van de DM (die gaan voor), daarna het spoor ("from") */
  function advance(prev, actions, patch, merge) {
    const base = JSON.parse(JSON.stringify(prev || {}));
    if (hasGrid(base.battle)) (actions || []).forEach(a => parseMoves(a && a.text).forEach(mv => { const k = Object.keys(base.battle.pos || {}).find(n => lower(n) === lower(mv.name)); if (k) base.battle.pos[k] = mv.to; }));
    const state = merge(base, patch || {});
    if (state.battle && !order(state).length) delete state.battle; /* gevecht voorbij: kaart weg */
    if (!state.battle) return { state, errors: [], warnings: [], bad: [] };
    const res = check(state, prev);
    if (hasGrid(state.battle)) {
      const from = {}, old = prev && prev.battle && JSON.stringify(prev.battle.grid) === JSON.stringify(state.battle.grid) ? prev.battle.pos || {} : {};
      Object.entries(state.battle.pos || {}).forEach(([n, at]) => { if (old[n] && String(old[n]).toUpperCase() !== String(at).toUpperCase()) from[n] = old[n]; });
      state.battle.from = from;
    }
    return Object.assign({ state }, res);
  }

  /* ---------- tekstweergave voor de DM ---------- */
  function ascii(state, speeds) {
    const m = model(state, speeds); if (!m) return "";
    const mark = "123456789abcdefghijklmnopqrstuvwyz", g = m.grid.map(r => r.padEnd(m.W, ".").split(""));
    m.tokens.forEach((t, i) => cells(t).forEach(([x, y]) => { if (g[y] && x < m.W) g[y][x] = mark[i] || "?"; }));
    const head = [...Array(m.W)].map((_, x) => col(x).slice(-1)).join("");
    const out = [(m.title ? m.title + " " : "") + "(" + m.W + "x" + m.H + ", 1 vak = 5 ft)", "    " + head].concat(g.map((r, y) => String(y + 1).padStart(3) + " " + r.join("")));
    out.push("Terrein: . p s e = vrij; w b = moeilijk; T R # x C W = geblokkeerd.");
    m.tokens.forEach((t, i) => {
      const near = m.tokens.filter(o => !o.out && foes(o, t)).map(o => o.name + " " + dist(t, o) * 5 + " ft" + (cover(m, t, o) && dist(t, o) > 1 ? " (dekking)" : ""));
      out.push((mark[i] || "?") + " = " + t.name + " [" + t.side + (t.out ? ", uitgeschakeld" : "") + (t.size > 1 ? ", " + t.size + "x" + t.size : "") + "] " + sq(t.x, t.y) + ", snelheid " + t.speed + (!t.out && near.length ? " | tot: " + near.join(", ") : ""));
    });
    return out.join("\n");
  }

  /* ---------- tekenen (browser) ---------- */
  const S = 50;
  function el(tag, a, parent) { const e = document.createElementNS("http://www.w3.org/2000/svg", tag); for (const k in a) e.setAttribute(k, a[k]); if (parent) parent.appendChild(e); return e; }
  function drawTerrain(svg, m) {
    let seed = 7; const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    const g = el("g", {}, svg), ink = "#4a3a22";
    el("rect", { x: -22, y: -22, width: m.W * S + 30, height: m.H * S + 30, fill: "#2a2118" }, g);
    for (let y = 0; y < m.H; y++) for (let x = 0; x < m.W; x++) {
      const ch = terrain(m, x, y) || ".", X = x * S, Y = y * S;
      const fill = { p: "#cdb585", w: "#7ea3a8", W: "#2f4a55", s: "#bdb4a0", "#": "#bdb4a0", x: "#bdb4a0", e: "#a8916b", T: "#93a064", b: "#a6ab6e" }[ch] || (rnd() < .5 ? "#b9b27e" : "#b3ae78");
      el("rect", { x: X, y: Y, width: S + .5, height: S + .5, fill }, g);
      if (ch === ".") for (let i = 0; i < 3; i++) { const a = X + 6 + rnd() * 38, b = Y + 10 + rnd() * 34; el("path", { d: "M" + a + " " + b + "l2 -6M" + (a + 4) + " " + b + "l1 -5", stroke: "#7d8248", "stroke-width": 1.2, fill: "none" }, g); }
      if (ch === "p" || ch === "e") for (let i = 0; i < 5; i++) el("circle", { cx: X + rnd() * S, cy: Y + rnd() * S, r: 1 + rnd() * 2, fill: "#8d7550", opacity: .8 }, g);
      if (ch === "w" || ch === "W") for (let i = 0; i < 2; i++) { const a = X + 4 + rnd() * 20, b = Y + 12 + i * 22 + rnd() * 6; el("path", { d: "M" + a + " " + b + "q6 -6 12 0t12 0", stroke: "#e6efe6", "stroke-width": 1.6, fill: "none", opacity: ch === "W" ? .35 : .75 }, g); }
      if (ch === "s") el("path", { d: "M" + (X + 2) + " " + (Y + S / 2) + "H" + (X + S - 2) + "M" + (X + S * .4) + " " + (Y + 2) + "V" + (Y + S / 2) + "M" + (X + S * .65) + " " + (Y + S / 2) + "V" + (Y + S - 2), stroke: "#8d8471", "stroke-width": 1.2, fill: "none" }, g);
    }
    /* voorwerpen bovenop, zodat ze over de vakrand mogen steken */
    for (let y = 0; y < m.H; y++) for (let x = 0; x < m.W; x++) {
      const ch = terrain(m, x, y), cx = x * S + S / 2, cy = y * S + S / 2, X = x * S, Y = y * S;
      if (ch === "#") { el("rect", { x: X + 1, y: Y + 1, width: S - 2, height: S - 2, rx: 4, fill: "#6f6657", stroke: ink, "stroke-width": 2.5 }, g); el("path", { d: "M" + (X + 3) + " " + cy + "H" + (X + S - 3) + "M" + cx + " " + (Y + 3) + "V" + cy + "M" + (cx - 12) + " " + cy + "V" + (Y + S - 3), stroke: ink, "stroke-width": 1.5, fill: "none" }, g); }
      if (ch === "x") { el("rect", { x: X + 7, y: Y + 7, width: S - 14, height: S - 14, rx: 3, fill: "#9a6f3f", stroke: ink, "stroke-width": 2.5 }, g); el("path", { d: "M" + (X + 9) + " " + (Y + 9) + "L" + (X + S - 9) + " " + (Y + S - 9) + "M" + (X + S - 9) + " " + (Y + 9) + "L" + (X + 9) + " " + (Y + S - 9), stroke: ink, "stroke-width": 1.8, fill: "none" }, g); }
      if (ch === "b") for (let i = 0; i < 6; i++) el("circle", { cx: cx - 15 + rnd() * 30, cy: cy - 15 + rnd() * 30, r: 6 + rnd() * 5, fill: "#6f8340", stroke: "#3f5224", "stroke-width": 1.2, opacity: .9 }, g);
      if (ch === "R") { const p = []; for (let i = 0; i < 7; i++) { const a = i / 7 * 6.283, r = 17 + rnd() * 8; p.push((cx + Math.cos(a) * r) + "," + (cy + Math.sin(a) * r)); } el("polygon", { points: p.join(" "), fill: "#8f877a", stroke: ink, "stroke-width": 2.5, "stroke-linejoin": "round" }, g); el("path", { d: "M" + (cx - 10) + " " + (cy - 2) + "l9 -9l11 6M" + (cx - 2) + " " + (cy - 8) + "l2 14", stroke: ink, "stroke-width": 1.2, fill: "none" }, g); }
      if (ch === "T") { el("ellipse", { cx: cx + 5, cy: cy + 7, rx: 24, ry: 21, fill: "#000", opacity: .18 }, g); const p = []; for (let i = 0; i < 14; i++) { const a = i / 14 * 6.283, r = (i % 2 ? 20 : 28) + rnd() * 4; p.push((cx + Math.cos(a) * r) + "," + (cy + Math.sin(a) * r)); } el("polygon", { points: p.join(" "), fill: rnd() < .5 ? "#4f7038" : "#5d7d3c", stroke: "#243a18", "stroke-width": 2, "stroke-linejoin": "round" }, g); el("circle", { cx: cx - 5, cy: cy - 5, r: 9, fill: "#7c9a4d", opacity: .8 }, g); }
      if (ch === "C") { for (let i = 0; i < 8; i++) { const a = i / 8 * 6.283; el("circle", { cx: cx + Math.cos(a) * 17, cy: cy + Math.sin(a) * 17, r: 5, fill: "#7d756a", stroke: ink }, g); } el("path", { d: "M" + cx + " " + (cy - 14) + "q14 14 0 24q-14 -10 0 -24z", fill: "#e0782a", stroke: "#8a2f10", "stroke-width": 1.5 }, g); el("path", { d: "M" + cx + " " + (cy - 4) + "q6 7 0 12q-6 -5 0 -12z", fill: "#f6c94a" }, g); }
    }
    const lines = el("g", { stroke: "#3c2f1c", "stroke-width": 1, opacity: .28 }, svg);
    for (let x = 0; x <= m.W; x++) el("line", { x1: x * S, y1: 0, x2: x * S, y2: m.H * S }, lines);
    for (let y = 0; y <= m.H; y++) el("line", { x1: 0, y1: y * S, x2: m.W * S, y2: y * S }, lines);
    for (let x = 0; x < m.W; x++) el("text", { x: x * S + S / 2, y: -7, "text-anchor": "middle", "font-size": 13, fill: "#c8a24a" }, svg).textContent = col(x);
    for (let y = 0; y < m.H; y++) el("text", { x: -12, y: y * S + S / 2 + 5, "text-anchor": "middle", "font-size": 13, fill: "#c8a24a" }, svg).textContent = y + 1;
  }
  /* view = {pic(naam), pct(naam), current:[namen], budget:{routes, left} | null, path, target, mover} */
  function render(svg, m, view) {
    const sig = JSON.stringify(m.grid);
    if (svg._sig !== sig) {
      svg._sig = sig; svg.innerHTML = ""; svg._tok = {};
      svg.setAttribute("viewBox", "-22 -22 " + (m.W * S + 30) + " " + (m.H * S + 30));
      const defs = el("defs", {}, svg), clip = el("clipPath", { id: "bmrond", clipPathUnits: "objectBoundingBox" }, defs); el("circle", { cx: .5, cy: .5, r: .5 }, clip);
      drawTerrain(svg, m);
      svg._hi = el("g", { "pointer-events": "none" }, svg); svg._tg = el("g", {}, svg); svg._over = el("g", { "pointer-events": "none" }, svg);
    }
    const hi = svg._hi, over = svg._over; hi.innerHTML = ""; over.innerHTML = "";
    const mid = (x, y, size) => [(x + size / 2) * S, (y + size / 2) * S];
    if (view.budget) Object.values(view.budget.routes).forEach(n => {
      const t = view.mover; if ((n.x === t.x && n.y === t.y) || !canStop(m, t, n.x, n.y)) return; const g = n.c <= view.budget.left;
      el("rect", { x: n.x * S + 3, y: n.y * S + 3, width: S - 6, height: S - 6, rx: 6, fill: g ? "#2f7fd0" : "#e8a02a", "fill-opacity": g ? .34 : .08, stroke: g ? "#bfe0ff" : "#a86a10", "stroke-opacity": g ? .5 : .55, "stroke-dasharray": g ? "none" : "3 5" }, hi);
    });
    /* spoor: waar wie vandaan kwam */
    m.tokens.forEach(t => { const f = parse(m.from[t.name]); if (!f) return; const a = mid(f[0], f[1], t.size), b = mid(t.x, t.y, t.size);
      const c = t.side === "foe" ? "#9c2414" : "#1f5e9c";
      el("line", { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: c, "stroke-width": 4, "stroke-dasharray": "3 9", "stroke-linecap": "round", opacity: .8 }, hi);
      el("circle", { cx: a[0], cy: a[1], r: 7, fill: "none", stroke: c, "stroke-width": 3, opacity: .8 }, hi); });
    const seen = {};
    m.tokens.forEach(t => {
      seen[t.name] = true;
      const d = t.size * S, r = d / 2 - 3, c = d / 2, pic = view.pic(t.name), key = (pic ? "p" : "t") + t.size + t.side;
      let o = svg._tok[t.name];
      if (!o || o.key !== key) {
        if (o) o.g.remove();
        const g = el("g", { class: "bmtok" }, svg._tg), color = t.side === "pc" ? "#4f8fc4" : t.side === "ally" ? "#5aa86a" : t.side === "foe" ? "#c0523a" : "#9a917f";
        el("circle", { cx: c + 2, cy: c + 3, r: r + 1, fill: "#000", opacity: .35 }, g); el("circle", { cx: c, cy: c, r, fill: "#3a1812" }, g);
        if (pic) el("image", { href: pic, x: c - r, y: c - r, width: 2 * r, height: 2 * r, "clip-path": "url(#bmrond)", preserveAspectRatio: "xMidYMid slice" }, g);
        else { const p = t.name.split(" "), nr = /^(\d+|[A-Z])$/.test(p[p.length - 1]) && p.length > 1 ? p[p.length - 1] : ""; el("text", { x: c, y: c + (t.size > 1 ? 14 : 7), "text-anchor": "middle", "font-size": t.size > 1 ? 40 : nr ? 17 : 22, fill: "#f2d9c8" }, g).textContent = t.name[0] + nr; }
        el("circle", { cx: c, cy: c, r, fill: "none", stroke: color, "stroke-width": 4 }, g);
        o = { g, key, glow: el("circle", { cx: c, cy: c, r: r + 5, fill: "none", stroke: "#ffd86b", "stroke-width": 3, class: "bmpulse" }, g), back: el("rect", { x: c - 22, y: d - 8, width: 44, height: 6, rx: 3, fill: "#000" }, g), bar: el("rect", { x: c - 21, y: d - 7, height: 4, rx: 2 }, g) };
        el("text", { x: c, y: d + 8, "text-anchor": "middle", "font-size": 11, fill: "#fff", stroke: "#000", "stroke-width": 3, "paint-order": "stroke" }, g).textContent = t.name.length > 16 ? t.name.slice(0, 15) + "…" : t.name;
        svg._tok[t.name] = o;
      }
      o.g.style.transform = "translate(" + t.x * S + "px," + t.y * S + "px)"; o.g.style.opacity = t.out ? .3 : 1;
      const pct = view.pct(t.name);
      o.back.style.display = o.bar.style.display = pct == null ? "none" : "";
      if (pct != null) { o.bar.setAttribute("width", 42 * pct / 100); o.bar.setAttribute("fill", pct > 60 ? "#5aa86a" : pct > 25 ? "#c9a13b" : "#c0523a"); }
      o.glow.style.display = view.current.indexOf(t.name) >= 0 && !t.out ? "" : "none";
    });
    Object.keys(svg._tok).forEach(n => { if (!seen[n]) { svg._tok[n].g.remove(); delete svg._tok[n]; } });
    if (view.path) { el("polyline", { points: view.path.map(([x, y]) => mid(x, y, view.mover.size).join(",")).join(" "), fill: "none", stroke: "#fff4c4", "stroke-width": 5, "stroke-dasharray": "10 7", "stroke-linecap": "round", "stroke-linejoin": "round" }, over);
      const l = view.path[view.path.length - 1], p = mid(l[0], l[1], view.mover.size); el("circle", { cx: p[0], cy: p[1], r: view.mover.size * S / 2 - 5, fill: "#fff4c4", "fill-opacity": .35, stroke: "#fff4c4", "stroke-width": 3 }, over); }
    if (view.target) {
      const t = view.target, b = mid(t.x, t.y, t.size);
      el("circle", { cx: b[0], cy: b[1], r: t.size * S / 2 + 3, fill: "none", stroke: "#ff5b44", "stroke-width": 4, class: "bmpulse" }, over);
      if (view.aim) { const a = mid(view.aim.x, view.aim.y, view.aim.size);
        el("line", { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: "#c0261a", "stroke-width": 3, "stroke-dasharray": "4 6" }, over);
        el("text", { x: (a[0] + b[0]) / 2, y: (a[1] + b[1]) / 2 - 6, "text-anchor": "middle", "font-size": 17, fill: "#fff", stroke: "#000", "stroke-width": 4, "paint-order": "stroke" }, over).textContent = dist(view.aim, t) * 5 + " ft"; }
    }
  }
  /* vakje onder de muis of vinger */
  function cellAt(svg, ev) { const p = svg.createSVGPoint(); p.x = ev.clientX; p.y = ev.clientY; const q = p.matrixTransform(svg.getScreenCTM().inverse()); return [Math.floor(q.x / S), Math.floor(q.y / S)]; }

  return { BLOCK, HARD, OPEN, S, col, sq, parse, order, hasGrid, active, model, terrain, wall, cells, occ, foes, dist, routes, canStop, pathOf, opportunity, cover, moveTag, parseMoves, check, advance, ascii, render, cellAt };
});
