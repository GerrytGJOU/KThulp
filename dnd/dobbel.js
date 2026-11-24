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
  /* ---------- Avatar Legends: 2d6 + stat; 10+ strong hit, 7-9 weak hit, 6- miss ---------- */
  function judge2d6(d1, d2, bonus) {
    const total = d1 + d2 + bonus, label = total >= 10 ? "strong hit" : total >= 7 ? "weak hit" : "miss";
    return { total, label, level: total >= 10 ? 2 : total >= 7 ? 1 : 0, success: total >= 7 };
  }
  function line2d6(label, d1, d2, bonus, j) { return label + ": 2d6(" + d1 + "," + d2 + ")" + (bonus < 0 ? "-" : "+") + Math.abs(bonus) + " = " + j.total + ", " + j.label; }

  /* ---------- Star Wars (FFG/Edge): dobbelpool met symbolen ----------
     s success, f failure, a advantage, t threat, r triumph (telt ook als success), d despair (telt ook als failure). */
  const SW_FACES = {
    G: ["", "s", "s", "ss", "a", "a", "sa", "aa"],                                   /* Ability d8, groen */
    Y: ["", "s", "s", "ss", "ss", "a", "sa", "sa", "sa", "aa", "aa", "r"],           /* Proficiency d12, geel */
    P: ["", "f", "ff", "t", "t", "t", "ft", "tt"],                                   /* Difficulty d8, paars */
    R: ["", "f", "f", "ff", "ff", "t", "t", "ft", "ft", "tt", "tt", "d"],            /* Challenge d12, rood */
    B: ["", "", "s", "sa", "aa", "a"],                                               /* Boost d6, blauw */
    K: ["", "", "f", "f", "t", "t"]                                                  /* Setback d6, zwart */
  };
  const SW_NAMES = { G: "Ability (d8)", Y: "Proficiency (d12)", P: "Difficulty (d8)", R: "Challenge (d12)", B: "Boost (d6)", K: "Setback (d6)" };
  /* pool = {Y:1,G:1,B:0,P:2,R:0,K:0}: digitaal gooien → telling van de symbolen (voor het annuleren) */
  function swRoll(pool, rng) {
    const R = rng || rnd, t = { s: 0, f: 0, a: 0, t: 0, r: 0, d: 0 };
    Object.keys(SW_FACES).forEach(k => { for (let i = 0; i < (pool[k] || 0); i++) { const face = SW_FACES[k][R(SW_FACES[k].length) - 1]; for (const ch of face) t[ch]++; } });
    return { s: t.s, f: t.f, a: t.a, t: t.t, r: t.r, d: t.d };
  }
  /* t = symbolen (r telt ook als success, d ook als failure) → netto uitkomst */
  function swNet(t) {
    const S = (t.s || 0) + (t.r || 0), F = (t.f || 0) + (t.d || 0), A = t.a || 0, T = t.t || 0, ns = S - F, na = A - T;
    return { success: ns >= 1, ns, na, triumph: t.r || 0, despair: t.d || 0 };
  }
  function swText(n) {
    const p = [];
    p.push(n.ns >= 0 ? n.ns + " Success" : -n.ns + " Failure");
    if (n.na !== 0) p.push(n.na > 0 ? n.na + " Advantage" : -n.na + " Threat");
    if (n.triumph) p.push(n.triumph + " Triumph"); if (n.despair) p.push(n.despair + " Despair");
    return p.join(", ");
  }
  function swPoolText(pool) { return ["Y", "G", "B", "P", "R", "K"].filter(k => pool[k]).map(k => pool[k] + k).join(" ") || "geen dobbelstenen"; }
  return { roll, d100, rnd, cocTens, judge, judgeCoc, judgeDg, dgOpposed, rollLine, calc, LEVELS, judge2d6, line2d6, SW_FACES, SW_NAMES, swRoll, swNet, swText, swPoolText };
});
