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

  /* ---------- afbeeldingen (gesneden door tools/slice-battle-sheets.py) ---------- */
  const ART = "assets/battle/", ARTV = "?v=1";
  const art = f => ART + f + ".webp" + ARTV;
  /* battle.floor = ondergrond onder "." en onder voorwerpen */
  const FLOORS = { gras: "gras", bos: "bos", aarde: "aarde", keien: "keien", plavuis: "plavuis", grot: "grot", planken: "planken", sneeuw: "sneeuw", zand: "zand", moeras: "moeras", puin: "puingrond" };
  /* battle.decor = {"C4":"tent"}; de waarde is de schaal ten opzichte van een vak */
  const PROPS = { loofboom: 1.5, den: 1.5, dodeboom: 1.5, stronk: 1.1, rots: 1.2, rotsblokken: 1.1, struik: 1.15, doornstruik: 1.15, boomstam: 1.5, riet: 1.1, waterlelies: 1, paddenstoelen: .9, varens: 1.15, wortels: 1.15, brandhout: 1, graspol: 1,
    kampvuur: 1.15, tent: 1.6, slaaprol: 1, kist: .95, ton: .95, kratten: 1.05, tafel: 1.15, kar: 1.5, zuil: 1.4, muurstuk: 1.3, puin: 1.15, sokkel: 1.05, put: 1.2, vuurkorf: 1, altaar: 1.2, deur: 1 };
  /* standaardvoorwerp per terreinteken */
  const THING = { T: ["loofboom", "den"], R: ["rots", "rots", "rotsblokken"], b: ["struik", "struik", "varens", "doornstruik"], x: ["kratten", "ton", "kist"], C: ["kampvuur"] };
  /* portret voor een vijand zonder eigen portret, op naam; eerste treffer telt */
  const FOES = [[/warg.*(ruiter|rider|berijder)|(ruiter|rider).*warg/, "wargruiter"], [/\bwarg/, "warg"], [/\b(wolf|wolven)\b/, "wolf"], [/goblin|snaga/, "goblin"],
    [/\bor[ck].*(boog|schutter|archer)/, "orkboog"], [/\bor[ck].*(hoofd|aanvoerder|kapitein|captain|leider)/, "orkhoofd"], [/\buruk|\bor[ck].*(zwaar|grote?\b|gepantserd)|(zware|grote) or[ck]/, "orkzwaar"], [/\b(orcs?|ork(s|en)?)\b/, "ork"],
    [/\btroll?(en)?\b/, "trol"], [/\b(reuzen)?spin(nen)?\b|spider/, "spin"], [/grafgeest|wight|wraith/, "grafgeest"], [/skelet|skeleton/, "skelet"], [/rover|bandiet|bandit/, "rover"],
    [/oosterling|easterling|haradrim|southron/, "oosterling"], [/vleermui[sz]|\bbats\b/, "vleermuizen"], [/gestalte|onbekende/, "gestalte"]];
  const foeArt = name => { const f = FOES.find(x => x[0].test(String(name).toLowerCase())); return f ? art("v-" + f[1]) : ""; };

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
    return { grid, W, H, tokens, title: String(b.title || ""), from: b.from || {}, floor: FLOORS[b.floor] ? b.floor : "gras", decor: b.decor || {} };
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
    if (b.floor && !FLOORS[b.floor]) errors.push("onbekende battle.floor \"" + b.floor + "\" (kies uit: " + Object.keys(FLOORS).join(", ") + ")");
    Object.entries(b.decor || {}).forEach(([at, n]) => {
      const p = parse(at);
      if (!p || p[0] >= w || p[1] < 0 || p[1] >= b.grid.length) errors.push("battle.decor: vakje \"" + at + "\" ligt niet op de kaart");
      if (!Object.prototype.hasOwnProperty.call(PROPS, n)) errors.push("battle.decor: onbekend voorwerp \"" + n + "\" (kies uit: " + Object.keys(PROPS).join(", ") + ")");
    });
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
  /* grondtegel: eigen tegel per teken; onder een voorwerp de meest voorkomende vrije grond ernaast */
  function ground(m, x, y) {
    const own = { ".": FLOORS[m.floor], p: "karrenpad", s: "plavuis", e: "aarde", w: "water", W: "diepwater", "#": m.floor === "grot" ? "rotswand" : "muur" };
    const ch = terrain(m, x, y) || ".";
    if (own[ch]) return own[ch];
    const n = {}; let best = FLOORS[m.floor], max = 1;
    [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => { const c = terrain(m, x + dx, y + dy); if (OPEN[c]) { n[c] = (n[c] || 0) + 1; if (n[c] > max) { max = n[c]; best = own[c]; } } });
    return best;
  }
  /* voorwerpen met hun vakje; decor vervangt het standaardvoorwerp van dat vak */
  function things(m) {
    const at = {};
    for (let y = 0; y < m.H; y++) for (let x = 0; x < m.W; x++) { const l = THING[terrain(m, x, y)]; if (l) at[x + "," + y] = { x, y, name: l[((((x + 1) * 73856093) ^ ((y + 1) * 19349663)) >>> 4) % l.length] }; }
    Object.entries(m.decor || {}).forEach(([k, name]) => { const p = parse(k); if (p && PROPS[name] && p[0] < m.W && p[1] >= 0 && p[1] < m.H) at[p[0] + "," + p[1]] = { x: p[0], y: p[1], name }; });
    return Object.values(at).sort((a, b) => a.y - b.y || a.x - b.x);
  }
  const TILE = { muur: 100, planken: 100 }; /* hoe groot een grondtegel herhaalt (1 vak = 50) */
  const FLAT = { gras: "#8f9440", bos: "#555a2c", aarde: "#9a7248", karrenpad: "#71543a", keien: "#a2937b", plavuis: "#a89a80", grot: "#6f6558", planken: "#7a5230", water: "#587b6c", diepwater: "#143c3e", sneeuw: "#dfe4ee", zand: "#cfa968", moeras: "#5b5a30", puingrond: "#8d7a64", muur: "#a89878", rotswand: "#6c675f" };
  function drawTerrain(svg, m, defs) {
    const g = el("g", {}, svg), used = {}, ink = "#241a0e";
    /* de karrensporen op de tegel lopen schuin: draai ze mee met de richting van het pad */
    const pc = []; m.grid.forEach((r, y) => [...r].forEach((c, x) => { if (c === "p") pc.push([x, y]); }));
    const span = i => Math.max(...pc.map(p => p[i])) - Math.min(...pc.map(p => p[i])), turn = pc.length && span(1) >= span(0) ? -31 : 59;
    el("rect", { x: -22, y: -22, width: m.W * S + 30, height: m.H * S + 30, fill: "#2a2118" }, g);
    for (let y = 0; y < m.H; y++) for (let x = 0; x < m.W; x++) {
      const t = ground(m, x, y), a = { x: x * S, y: y * S, width: S + .5, height: S + .5 };
      if (!used[t]) { used[t] = true; const d = TILE[t] || 150, p = el("pattern", { id: "bmg-" + t, patternUnits: "userSpaceOnUse", width: d, height: d }, defs); if (t === "karrenpad") p.setAttribute("patternTransform", "rotate(" + turn + ")"); el("image", { href: art("g-" + t), width: d + .5, height: d + .5, preserveAspectRatio: "none" }, p); }
      el("rect", Object.assign({ fill: FLAT[t] }, a), g); /* kleur eronder zolang de afbeelding laadt */
      el("rect", Object.assign({ fill: "url(#bmg-" + t + ")" }, a), g);
    }
    /* rand om muren en diep water, zodat blokkades goed te zien zijn */
    let edge = "";
    for (let y = 0; y < m.H; y++) for (let x = 0; x < m.W; x++) {
      const c = terrain(m, x, y); if (c !== "#" && c !== "W") continue;
      const X = x * S, Y = y * S, open = (a, b) => { const o = terrain(m, a, b); return o && o !== c; };
      if (open(x, y - 1)) edge += "M" + X + " " + Y + "h" + S; if (open(x, y + 1)) edge += "M" + X + " " + (Y + S) + "h" + S;
      if (open(x - 1, y)) edge += "M" + X + " " + Y + "v" + S; if (open(x + 1, y)) edge += "M" + (X + S) + " " + Y + "v" + S;
    }
    if (edge) el("path", { d: edge, stroke: ink, "stroke-width": 4, "stroke-linecap": "round", fill: "none" }, g);
    /* voorwerpen bovenop, zodat ze over de vakrand mogen steken */
    things(m).forEach(o => {
      const d = S * PROPS[o.name], cx = o.x * S + S / 2, cy = o.y * S + S / 2;
      if (o.name !== "waterlelies" && o.name !== "deur") el("ellipse", { cx: cx + 5, cy: cy + 8, rx: d * .38, ry: d * .3, fill: "#000", opacity: .22 }, g);
      el("image", { href: art("o-" + o.name), x: cx - d / 2, y: cy - d / 2, width: d, height: d }, g);
    });
    const lines = el("g", { stroke: "#3c2f1c", "stroke-width": 1, opacity: .28 }, svg);
    for (let x = 0; x <= m.W; x++) el("line", { x1: x * S, y1: 0, x2: x * S, y2: m.H * S }, lines);
    for (let y = 0; y <= m.H; y++) el("line", { x1: 0, y1: y * S, x2: m.W * S, y2: y * S }, lines);
    for (let x = 0; x < m.W; x++) el("text", { x: x * S + S / 2, y: -7, "text-anchor": "middle", "font-size": 13, fill: "#c8a24a" }, svg).textContent = col(x);
    for (let y = 0; y < m.H; y++) el("text", { x: -12, y: y * S + S / 2 + 5, "text-anchor": "middle", "font-size": 13, fill: "#c8a24a" }, svg).textContent = y + 1;
  }
  /* view = {pic(naam), pct(naam), current:[namen], budget:{routes, left} | null, path, target, mover} */
  function render(svg, m, view) {
    const sig = JSON.stringify([m.grid, m.floor, m.decor]);
    if (svg._sig !== sig) {
      svg._sig = sig; svg.innerHTML = ""; svg._tok = {};
      svg.setAttribute("viewBox", "-22 -22 " + (m.W * S + 30) + " " + (m.H * S + 30));
      const defs = el("defs", {}, svg), clip = el("clipPath", { id: "bmrond", clipPathUnits: "objectBoundingBox" }, defs); el("circle", { cx: .5, cy: .5, r: .5 }, clip);
      drawTerrain(svg, m, defs);
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
      const d = t.size * S, r = d / 2 - 3, c = d / 2, pic = view.pic(t.name, t.side), key = (pic ? "p" : "t") + t.size + t.side;
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

  return { BLOCK, HARD, OPEN, FLOORS, PROPS, S, art, foeArt, ground, things, col, sq, parse, order, hasGrid, active, model, terrain, wall, cells, occ, foes, dist, routes, canStop, pathOf, opportunity, cover, moveTag, parseMoves, check, advance, ascii, render, cellAt };
});
