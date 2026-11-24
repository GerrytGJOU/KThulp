/* Dobbelmodule voor niet-D&D-regelsets (dnd/). Eén bestand voor browser (window.DNDDice) en Node (tests).
   - roll("3d6+2"): willekeurige dobbelexpressie (ook d100/d%).
   - judge(sys, doel, worp): uitkomstniveau van een d100-worp voor "coc" (Call of Cthulhu/Dark Ages) of "dg" (Delta Green).
   - cocTens(): bonus-/penaltydobbelstenen bij CoC (extra tientallen-dobbelsteen).
   - rollLine(): de tekst "[worp: ...]" zoals de DM-prompt hem verwacht. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.DNDDice = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  const g = typeof self !== "undefined" ? self : globalThis;
  function rnd(n) { /* gelijkmatig 1..n; crypto waar mogelijk */
    if (g.crypto && g.crypto.getRandomValues) { const lim = Math.floor(4294967296 / n) * n; let x; do { x = g.crypto.getRandomValues(new Uint32Array(1))[0]; } while (x >= lim); return 1 + x % n; }
    return 1 + Math.floor(Math.random() * n);
  }
  /* "3d6+2", "1d100", "d%", "2d6-1", "4". Geeft {expr, dice, mod, total} of null als de expressie niet klopt. */
  function roll(expr, rng) {
    const R = rng || rnd, s = String(expr == null ? "" : expr).replace(/\s+/g, "").toLowerCase().replace(/d%/g, "d100");
    const m = s.match(/^(\d*)d(\d+)([+-]\d+)?$/);
    if (!m) { const k = s.match(/^[+-]?\d+$/); return k ? { expr: s, dice: [], mod: Number(s), total: Number(s) } : null; }
    const n = m[1] === "" ? 1 : Number(m[1]), f = Number(m[2]), mod = m[3] ? Number(m[3]) : 0;
    if (n < 1 || n > 100 || f < 2 || f > 1000) return null;
    const dice = []; for (let i = 0; i < n; i++) dice.push(R(f));
    return { expr: s, dice, mod, total: dice.reduce((a, b) => a + b, 0) + mod };
  }
  /* Eén d100 (1..100): tientallen- en eenhedendobbelsteen, 00+0 = 100. */
  function d100(rng) { const R = rng || rnd; const t = R(10) - 1, u = R(10) - 1; return val(t, u); }
  function val(tens, units) { const v = tens * 10 + units; return v === 0 ? 100 : v; }
  /* CoC bonus-/penaltydobbelstenen: de eenheden blijven, er komen extra tientallen bij; bonus houdt het laagste totaal, penalty het hoogste.
     basis = de gewone d100 (1..100); extraTens = lijst met extra tientallen (0..9); n>0 bonus, n<0 penalty. */
  function cocTens(basis, extraTens, mode) {
    const b = basis === 100 ? 0 : basis, tens0 = Math.floor(b / 10), units = b % 10, all = [tens0].concat(extraTens || []);
    const vals = all.map(t => val(t, units));
    const pick = mode === "bonus" ? Math.min.apply(null, vals) : mode === "penalty" ? Math.max.apply(null, vals) : vals[0];
    return pick;
  }
  const LEVELS = ["Fumble", "Failure", "Regular Success", "Hard Success", "Extreme Success", "Critical Success"];
  /* Call of Cthulhu 7e: worp en doel (skill of kenmerk) → niveau. */
  function judgeCoc(target, r) {
    const t = Math.max(0, Math.floor(target));
    let lvl;
    if (r === 1) lvl = 5;
    else if (r === 100 || (r >= 96 && t < 50)) lvl = 0;
    else if (r <= Math.floor(t / 5)) lvl = 4;
    else if (r <= Math.floor(t / 2)) lvl = 3;
    else if (r <= t) lvl = 2;
    else lvl = 1;
    return { level: lvl, label: LEVELS[lvl], success: lvl >= 2, crit: lvl === 5, fumble: lvl === 0, hard: lvl >= 3, extreme: lvl >= 4, target: t, roll: r };
  }
  /* Delta Green: doel = skill (of stat×5) plus modifier; 01 en geslaagde doubles zijn Critical Success, mislukte doubles en 00 Fumble. */
  function judgeDg(target, r) {
    const t = Math.floor(target), dbl = r !== 100 && r % 11 === 0;
    let label, success = r === 1 || (r !== 100 && r <= t), crit = false, fumble = false;
    if (r === 100) { success = false; fumble = true; }
    else if (r === 1) { success = true; crit = true; }
    else if (dbl && success) crit = true;
    else if (dbl && !success) fumble = true;
    label = crit ? "Critical Success" : fumble ? "Fumble" : success ? "Success" : "Failure";
    return { level: crit ? 3 : fumble ? 0 : success ? 2 : 1, label, success, crit, fumble, target: t, roll: r };
  }
  function judge(sys, target, r) { return sys === "dg" ? judgeDg(target, r) : judgeCoc(target, r); }
  /* DG tegenstelling: de hoogste geslaagde worp wint; een crit verslaat een gewoon succes. Geeft 1 (a wint), -1 (b wint) of 0 (gelijk/beiden mislukt). */
  function dgOpposed(a, b) {
    const rank = x => !x.success ? -1 : x.crit ? 2 : 1;
    const ra = rank(a), rb = rank(b); if (ra < 0 && rb < 0) return 0;
    if (ra !== rb) return ra > rb ? 1 : -1;
    return a.roll === b.roll ? 0 : (a.roll > b.roll ? 1 : -1);
  }
  /* De regel die de speler (en de DM) in de actie ziet: [worp: Naam: 34 vs 55 = Regular Success] */
  function rollLine(sys, label, j, o) {
    o = o || {};
    let shown = String(j.roll).padStart(2, "0");
    if (sys === "coc" && o.extra && o.extra.length) shown = String(j.roll).padStart(2, "0") + " (" + (o.mode === "bonus" ? "bonus" : "penalty") + "-tientallen " + o.extra.join(",") + ")";
    const tgt = sys === "dg" && o.mod ? (j.target + " (" + (o.mod > 0 ? "+" : "−") + Math.abs(o.mod) + ")") : String(j.target);
    return label + ": " + shown + " vs " + tgt + " = " + j.label;
  }
  /* Afgeleide waarden: formules met kenmerknamen, floor/ceil/min/max. Alleen eigen (ingebouwde) formules. */
  function calc(formula, vars) {
    const names = Object.keys(vars || {});
    if (!/^[\w\s+\-*/(),×]*$/.test(formula)) return null; /* geen punt: geen eigenschappen of methoden */
    const ids = String(formula).match(/[A-Za-z_]\w*/g) || [];
    if (ids.some(function (w) { return names.indexOf(w) < 0 && ["floor", "ceil", "min", "max"].indexOf(w) < 0; })) return null;
    try { return Function.apply(null, names.concat(["floor", "ceil", "min", "max", "return (" + String(formula).replace(/×/g, "*") + ");"])).apply(null, names.map(n => vars[n]).concat([Math.floor, Math.ceil, Math.min, Math.max])); } catch (e) { return null; }
  }
  return { roll, d100, rnd, cocTens, judge, judgeCoc, judgeDg, dgOpposed, rollLine, calc, LEVELS };
});
