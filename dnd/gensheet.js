/* Generiek personagenblad voor niet-D&D-regelsets (dnd/): tekent uit R.sheet (settings-rulesets-*.js) een blad, een editor en een worppaneel.
   Drie soorten (R.sheet.kind): "d100" (Delta Green, Call of Cthulhu), "2d6" (Avatar Legends: 2d6 + stat) en "pool" (Star Wars: dobbelpool met symbolen).
   Eén bestand voor browser (window.DNDGenSheet) en Node (DM-tools: sheetText). De D&D-bladcode in index.html blijft ongemoeid.
   Karakterrecord: {ruleset, name, player, profession, age, stats:{STR:12}, skills:{"Firearms":50}, extra:"Naam | waarde", meterMax:{hp:12}, lists:{bonds:[{name,score}]},
   equipment, personality, appearance, backstory, secrets, dmHooks, + de extraText-velden van de regelset}. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory(require("./dobbel.js"));
  else root.DNDGenSheet = factory(root.DNDDice);
})(typeof self !== "undefined" ? self : this, function (Dice) {
  "use strict";
  const esc = s => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const num = (x, d) => { const n = Number(x); return isFinite(n) ? n : d; };
  const sgn = n => (n >= 0 ? "+" : "−") + Math.abs(n);
  const kindOf = R => (R.sheet && R.sheet.kind) || "d100";

  /* ---------- rekenen ---------- */
  function statDefault(R) { const d = R.sheet.statDefault; return d != null ? d : (R.sys === "dg" ? 10 : 50); }
  function stat(R, c, k) { const v = c && c.stats && c.stats[k]; return num(v, statDefault(R)); }
  function skillBase(R, c, sk) {
    const b = sk.base; if (typeof b === "number") return b;
    const m = String(b == null ? "0" : b).match(/^([A-Z]+)(\/2)?$/); if (!m) return 0;
    const s = stat(R, c, m[1]); return m[2] ? Math.floor(s / 2) : s;
  }
  function skillVal(R, c, sk) { /* d100: percentage; pool: rank; 2d6: de gekoppelde stat */
    const kind = kindOf(R); if (kind === "2d6") return stat(R, c, sk.stat);
    const v = c && c.skills && c.skills[sk.k]; return v == null || v === "" ? skillBase(R, c, sk) : num(v, skillBase(R, c, sk));
  }
  function extraSkills(R, c) { /* d100 "Naam | waarde"; 2d6 "Naam | Stat"; pool "Naam | rank | Characteristic" */
    const kind = R ? kindOf(R) : "d100";
    return String((c && c.extra) || "").split(/\n/).map(l => l.trim()).filter(Boolean).map(l => {
      const p = l.split("|").map(x => x.trim()), o = { k: p[0], label: p[0], val: 0 };
      if (kind === "2d6") o.stat = (R.sheet.stats.find(s => s.toLowerCase() === (p[1] || "").toLowerCase()) || R.sheet.stats[0]);
      else if (kind === "pool") { o.val = Math.max(0, Math.min(5, num(p[1], 0))); o.ch = (R.sheet.stats.find(s => s.toLowerCase() === (p[2] || "").toLowerCase()) || R.sheet.stats[0]); }
      else o.val = num(p[1], 0);
      return o;
    }).filter(x => x.k);
  }
  function vars(R, c) {
    const v = {}; R.sheet.stats.forEach(k => { v[k] = stat(R, c, k); });
    const un = R.sheet.skills.find(s => s.k === "Unnatural"), my = R.sheet.skills.find(s => s.k === "Cthulhu Mythos");
    v.UNNATURAL = un ? skillVal(R, c, un) : 0; v.MYTHOS = my ? skillVal(R, c, my) : 0;
    return v;
  }
  function meterMax(R, c) {
    const v = vars(R, c), o = {}; R.sheet.meters.forEach(m => { const own = c && c.meterMax && c.meterMax[m.k]; o[m.k] = own != null && own !== "" ? num(own, m.max(v)) : m.max(v); }); return o;
  }
  function derived(R, c) { const v = vars(R, c); return (R.sheet.derived || []).map(d => ({ k: d.k, label: d.label, val: (c && c.derived && c.derived[d.k] != null && c.derived[d.k] !== "") ? c.derived[d.k] : d.fn(v) })); }
  function aboveBase(R, c) {
    if (kindOf(R) !== "d100") return 0;
    let n = 0; R.sheet.skills.forEach(s => { const d = skillVal(R, c, s) - skillBase(R, c, s); if (d > 0) n += d; }); extraSkills(R, c).forEach(x => { n += x.val; }); return n;
  }
  function blank(R, player) {
    const c = { ruleset: R.id, name: "", player: player || "", stats: {}, skills: {}, lists: {} };
    R.sheet.stats.forEach(k => { c.stats[k] = statDefault(R); });
    (R.sheet.lists || []).forEach(l => { c.lists[l.k] = []; });
    return c;
  }
  function rollStats(R, c) { /* dobbelt alle kenmerken (alleen waar de regelset statDice heeft) */
    const o = Object.assign({}, c.stats || {}), mult = R.sheet.statGenMult || 1;
    if (!R.sheet.statDice) return o;
    R.sheet.stats.forEach(k => { const r = Dice.roll(R.sheet.statDice[k] || "3d6"); o[k] = r.total * mult; });
    return o;
  }

  /* ---------- worplijst ---------- */
  function rollList(R, c) {
    const kind = kindOf(R), out = [], mult = R.sheet.statMult || 1;
    if (kind === "d100") {
      R.sheet.stats.forEach(k => out.push({ key: "stat:" + k, group: mult > 1 ? "Stat × " + mult : "Kenmerk", label: k + (mult > 1 ? "×" + mult : ""), target: stat(R, c, k) * mult, disp: stat(R, c, k) * mult + "%" }));
      (R.sheet.meters || []).filter(m => m.k === "luck").forEach(m => { const t = num(c && c.luckNow, num(c && c.meterMax && c.meterMax.luck, 50)); out.push({ key: "luck", group: "Kenmerk", label: "Luck", target: t, disp: t + "%" }); });
      R.sheet.skills.forEach(s => { const t = skillVal(R, c, s); out.push({ key: "skill:" + s.k, group: "Skill", label: s.label, target: t, disp: t + "%" }); });
      extraSkills(R, c).forEach((x, i) => out.push({ key: "extra:" + i, group: "Extra skill", label: x.label, target: x.val, disp: x.val + "%" }));
    } else if (kind === "2d6") {
      R.sheet.stats.forEach(k => out.push({ key: "stat:" + k, group: "Stat", label: k, target: stat(R, c, k), disp: sgn(stat(R, c, k)) }));
      R.sheet.skills.forEach(s => { const t = stat(R, c, s.stat); out.push({ key: "skill:" + s.k, group: s.group || "Move", label: s.label, target: t, disp: sgn(t) + " " + s.stat }); });
      extraSkills(R, c).forEach((x, i) => { const t = stat(R, c, x.stat); out.push({ key: "extra:" + i, group: "Extra move", label: x.label, target: t, disp: sgn(t) + " " + x.stat }); });
    } else { /* pool */
      R.sheet.stats.forEach(k => out.push({ key: "stat:" + k, group: "Characteristic", label: k, target: 0, ch: stat(R, c, k), rank: 0, disp: stat(R, c, k) + "/0" }));
      R.sheet.skills.forEach(s => { const rk = skillVal(R, c, s), ch = stat(R, c, s.ch); out.push({ key: "skill:" + s.k, group: s.group || "Skill", label: s.label, target: rk, ch, rank: rk, disp: ch + "/" + rk + " " + s.ch.slice(0, 2) }); });
      extraSkills(R, c).forEach((x, i) => { const ch = stat(R, c, x.ch); out.push({ key: "extra:" + i, group: "Extra skill", label: x.label, target: x.val, ch, rank: x.val, disp: ch + "/" + x.val }); });
    }
    return out;
  }
  function findRoll(R, c, key) { return rollList(R, c).find(r => r.key === key) || null; }
  /* Leidt uit een DM-vraag ("Alertness", "POW×5", "Spot Hidden", "Assess a Situation") de worpsleutel af. */
  function matchCheck(R, c, text) {
    const t = String(text || "").toLowerCase(), list = rollList(R, c);
    let best = null; list.forEach(r => { const l = r.label.toLowerCase().replace(/×\d+$/, ""); const re = new RegExp("(^|[^a-z])" + l.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "([^a-z]|$)"); if (re.test(t) && (!best || l.length > best.l)) best = { k: r.key, l: l.length }; });
    return best ? best.k : "";
  }

  /* ---------- rollers per soort: besturing, lezen, digitaal gooien, beoordelen ---------- */
  const sel = (id, title, opts, cur) => '<select id="' + id + '" title="' + esc(title) + '">' + opts.map(x => '<option value="' + x[0] + '"' + (String(cur) === String(x[0]) ? " selected" : "") + '>' + esc(x[1]) + '</option>').join("") + '</select>';
  const nin = (id, ph, val, w, max) => '<input type="number" id="' + id + '" inputmode="numeric" min="0"' + (max ? ' max="' + max + '"' : "") + ' placeholder="' + esc(ph) + '" title="' + esc(ph) + '" value="' + esc(val == null ? "" : val) + '" style="width:' + (w || 64) + 'px">';
  const ROLLERS = {
    d100: {
      html(R, c, r, o) {
        const m = R.sys === "dg" ? sel("rmod", "Modifier op je doel", [[40, "+40"], [20, "+20"], [0, "±0"], [-20, "−20"], [-40, "−40"]], o.mod || 0)
          : sel("rmod", "Bonus- of penaltydobbelsteen", [["", "geen bonus/penalty"], ["bonus", "Bonus die"], ["penalty", "Penalty die"]], o.mode || "") + '<input type="text" id="rext" inputmode="numeric" placeholder="extra tiental(len), bv. 2 of 2,5" value="' + esc(o.ext || "") + '" style="width:150px;' + (o.mode ? "" : "display:none") + '">';
        return '<input type="number" id="rnat" inputmode="numeric" min="1" max="100" placeholder="d100" value="' + esc(o.nat || "") + '" style="width:90px">' + m;
      },
      read(R, root, o) {
        const q = s => root.querySelector(s), n = q("#rnat"), m = q("#rmod"), x = q("#rext");
        if (n) o.nat = n.value; if (m) { if (R.sys === "dg") o.mod = m.value; else o.mode = m.value; } if (x) { o.ext = x.value; x.style.display = o.mode ? "" : "none"; }
      },
      digital(R, root, c, r, o) { const q = s => root.querySelector(s); q("#rnat").value = Dice.d100(); if (R.sys !== "dg" && o.mode && q("#rext")) q("#rext").value = String(Dice.rnd(10) - 1); },
      eval(R, c, r, o) {
        const nat = Math.floor(num(o.nat, 0)); if (!(nat >= 1 && nat <= 100)) return null;
        let roll = nat, target = r.target, extra = null, mode = null, mod = 0;
        if (R.sys === "dg") { mod = num(o.mod, 0); target = Math.max(0, target + mod); }
        else if (o.mode === "bonus" || o.mode === "penalty") {
          extra = String(o.ext == null ? "" : o.ext).split(/[,\s]+/).filter(x => x !== "").map(Number).filter(x => isFinite(x) && x >= 0 && x <= 9);
          if (!extra.length) return null; mode = o.mode; roll = Dice.cocTens(nat, extra, mode);
        }
        const j = Dice.judge(R.sys, target, roll);
        return { j, roll, line: Dice.rollLine(R.sys, r.label, j, { mod, extra, mode }), text: "= " + roll + " · " + j.label };
      },
      hint: r => "doel " + r.disp + " · vul je d100 in"
    },
    "2d6": {
      html(R, c, r, o) { return nin("rnat", "dobbelsteen 1", o.nat, 64, 6) + nin("rd2", "dobbelsteen 2", o.d2, 64, 6) + sel("rmod", "Bijzonder: conditions, Prepared, Empowered e.d.", [[2, "+2"], [1, "+1"], [0, "±0"], [-1, "−1"], [-2, "−2"], [-3, "−3"]], o.mod || 0); },
      read(R, root, o) { const q = s => root.querySelector(s); if (q("#rnat")) o.nat = q("#rnat").value; if (q("#rd2")) o.d2 = q("#rd2").value; if (q("#rmod")) o.mod = q("#rmod").value; },
      digital(R, root) { const q = s => root.querySelector(s); q("#rnat").value = Dice.rnd(6); q("#rd2").value = Dice.rnd(6); },
      eval(R, c, r, o) {
        const d1 = Math.floor(num(o.nat, 0)), d2 = Math.floor(num(o.d2, 0)); if (!(d1 >= 1 && d1 <= 6 && d2 >= 1 && d2 <= 6)) return null;
        const bonus = r.target + num(o.mod, 0), j = Dice.judge2d6(d1, d2, bonus);
        return { j, roll: j.total, line: Dice.line2d6(r.label, d1, d2, bonus, j), text: "= " + j.total + " · " + j.label };
      },
      hint: r => "bonus " + r.disp + " · vul je twee d6 in"
    },
    pool: {
      html(R, c, r, o) {
        return sel("rdif", "Difficulty (paarse dobbelstenen)", ["Simple (0)", "Easy (1)", "Average (2)", "Hard (3)", "Daunting (4)", "Formidable (5)"].map((t, i) => [i, t]), o.dif != null && o.dif !== "" ? o.dif : 2) +
          nin("rchl", "Challenge-upgrades (rood)", o.chl, 56, 5) + nin("rbst", "Boost (blauw)", o.bst, 56, 5) + nin("rsbk", "Setback (zwart)", o.sbk, 56, 5) +
          '<span style="display:block;width:100%"></span>' + [["rsu", "Success"], ["rfa", "Failure"], ["rad", "Advantage"], ["rth", "Threat"], ["rtr", "Triumph"], ["rde", "Despair"]].map(x => nin(x[0], x[1], o[x[0]], 74)).join("");
      },
      read(R, root, o) { ["rdif", "rchl", "rbst", "rsbk", "rsu", "rfa", "rad", "rth", "rtr", "rde"].forEach(id => { const e = root.querySelector("#" + id); if (e) o[({ rdif: "dif", rchl: "chl", rbst: "bst", rsbk: "sbk" })[id] || id] = e.value; }); },
      pool(r, o) { /* samenstelling van de pool */
        const pos = Math.max(r.ch, r.rank), prof = Math.min(r.ch, r.rank), dif = Math.max(0, Math.min(5, Math.floor(num(o.dif, 2)))), chl = Math.max(0, Math.min(dif, Math.floor(num(o.chl, 0))));
        return { Y: prof, G: pos - prof, B: Math.max(0, Math.floor(num(o.bst, 0))), P: dif - chl, R: chl, K: Math.max(0, Math.floor(num(o.sbk, 0))) };
      },
      digital(R, root, c, r, o) {
        const pool = ROLLERS.pool.pool(r, o), t = Dice.swRoll(pool), set = (id, v) => { const e = root.querySelector("#" + id); if (e) e.value = v; };
        set("rsu", t.s); set("rfa", t.f); set("rad", t.a); set("rth", t.t); set("rtr", t.r); set("rde", t.d);
      },
      eval(R, c, r, o) {
        const f = ["rsu", "rfa", "rad", "rth", "rtr", "rde"]; if (!f.some(k => String(o[k] == null ? "" : o[k]).trim() !== "")) return null;
        const g = k => Math.max(0, Math.floor(num(o[k], 0))), n = Dice.swNet({ s: g("rsu"), f: g("rfa"), a: g("rad"), t: g("rth"), r: g("rtr"), d: g("rde") });
        const pool = ROLLERS.pool.pool(r, o), txt = Dice.swText(n), verdict = n.success ? "Success" : "Failure";
        return { j: { label: verdict, success: n.success }, roll: n.ns, net: n, line: r.label + ": " + Dice.swPoolText(pool) + " -> " + txt + " = " + verdict, text: txt + " = " + verdict };
      },
      hint: r => "pool " + r.disp + " · gooi en vul de symbolen in"
    }
  };
  const roller = R => ROLLERS[kindOf(R)];
  function evaluate(R, c, r, o) { return roller(R).eval(R, c, r, o || {}); }

  /* ---------- tekst voor de DM ---------- */
  function sheetText(R, c) {
    const sh = R.sheet, v = vars(R, c), mm = meterMax(R, c), kind = kindOf(R);
    const lists = (sh.lists || []).map(l => { const a = (c.lists && c.lists[l.k]) || []; return l.label + ": " + (a.length ? a.map(x => x.name + " " + x.score).join(", ") : "—"); });
    const txt = (t, x, n) => x ? t + ": " + String(x).replace(/\n+/g, " ").slice(0, n || 500) + "\n" : "";
    let sk;
    if (kind === "d100") sk = "Skills boven/anders dan basis: " + (sh.skills.filter(s => skillVal(R, c, s) !== skillBase(R, c, s)).map(s => s.label + " " + skillVal(R, c, s)).concat(extraSkills(R, c).map(x => x.label + " " + x.val)).join(", ") || "—") + ". Alle andere skills staan op hun basiswaarde (zie regelset).";
    else if (kind === "2d6") sk = "Moves gebruiken de gekoppelde stat (" + sh.skills.map(s => s.label + " " + sgn(stat(R, c, s.stat))).join("; ") + ")" + (extraSkills(R, c).length ? "; extra: " + extraSkills(R, c).map(x => x.label + " " + sgn(stat(R, c, x.stat))).join(", ") : "") + ".";
    else sk = "Skill ranks (boven 0): " + (sh.skills.filter(s => skillVal(R, c, s) > 0).map(s => s.label + " " + skillVal(R, c, s)).concat(extraSkills(R, c).map(x => x.label + " " + x.val)).join(", ") || "—") + ".";
    const extra = (sh.extraText || []).map(x => txt(x[1].split(",")[0], c[x[0]], 400)).join("");
    return "## " + c.name + " (speler: " + c.player + ") — " + R.label + (c.profession ? ", " + c.profession : "") + (c.age ? ", " + c.age + " jaar" : "") + "\n" +
      sh.stats.map(k => k + " " + (sh.statMult > 1 ? v[k] + " (×" + sh.statMult + " = " + v[k] * sh.statMult + ")" : (kind === "2d6" ? sgn(v[k]) : v[k]))).join(", ") + "\n" +
      "Max/start: " + sh.meters.map(m => m.label + " " + (m.start ? m.start(v) + " (max " + mm[m.k] + ")" : mm[m.k])).join(", ") + ((sh.derived || []).length ? ". " + derived(R, c).map(d => d.label + " " + d.val).join(", ") : "") + ".\n" +
      sk + "\n" + (lists.length ? lists.join("; ") + "\n" : "") + txt("Uitrusting", c.equipment) + extra + txt("Persoonlijkheid", c.personality, 400) + txt("Haken", c.dmHooks);
  }

  /* ---------- weergave ---------- */
  const mtr = (s, k) => { const v = s && s[k]; if (v == null) return null; if (typeof v === "object") { const cur = num(v.current != null ? v.current : v.cur, NaN), max = num(v.max, NaN); return isFinite(cur) ? { cur, max: isFinite(max) ? max : null } : null; } return isFinite(Number(v)) ? { cur: Number(v), max: null } : null; };
  function skillRow(R, c, s, ctx, key) {
    const kind = kindOf(R), on = ctx.rollKey === key ? " on" : "";
    if (kind === "d100") { const val = skillVal(R, c, s), base = skillBase(R, c, s); return '<div class="rl' + on + '" data-gr="' + esc(key) + '"><span style="color:' + (val > base ? "var(--gold)" : "var(--mute)") + '">' + esc(s.label) + '</span><b>' + val + '%</b></div>'; }
    if (kind === "2d6") return '<div class="rl' + on + '" data-gr="' + esc(key) + '"><span>' + esc(s.label) + ' <small>' + esc(s.stat) + '</small></span><b>' + sgn(stat(R, c, s.stat)) + '</b></div>';
    const rk = skillVal(R, c, s); return '<div class="rl' + on + '" data-gr="' + esc(key) + '"><span style="color:' + (rk > 0 ? "var(--gold)" : "var(--mute)") + '">' + esc(s.label) + ' <small>' + esc(s.ch.slice(0, 2)) + '</small></span><b>' + "●".repeat(rk) + "○".repeat(Math.max(0, 5 - rk)) + '</b></div>';
  }
  function viewHtml(R, c, ctx) {
    const sh = R.sheet, kind = kindOf(R), mm = meterMax(R, c), dv = derived(R, c), live = ctx.live || null, mine = ctx.me && c.player === ctx.me, v = vars(R, c);
    const strip = sh.meters.map(m => { const l = live && mtr(live, m.k); const txt = l ? l.cur + (l.max != null ? " / " + l.max : "") : (m.start ? m.start(v) + " / " + mm[m.k] : String(mm[m.k])); return '<div' + (m.k === "luck" ? ' data-gr="luck" class="rl"' : "") + '><small>' + esc(m.label) + '</small><b>' + esc(txt) + '</b></div>'; }).join("") + dv.map(d => '<div><small>' + esc(d.label) + '</small><b>' + esc(d.val) + '</b></div>').join("");
    let h = '<div class="card sh"' + (c.dead ? ' style="opacity:.7"' : "") + '><div class="ppl">' + (ctx.avatar ? ctx.avatar(c.name) : "") + '<div><h3 style="margin:0">' + (c.dead ? "☠ " : "") + esc(c.name) + (c.dead ? ' <small style="color:var(--red)">(gesneuveld)</small>' : "") + '</h3><small style="color:var(--mute)">' + esc(R.label) + (c.profession ? " · " + esc(c.profession) : "") + (c.age ? " · " + esc(c.age) + " jaar" : "") + '</small><br><small style="color:var(--mute)">' + esc(c.player ? "Speler: " + c.player : "") + '</small></div></div></div>';
    h += '<div class="sh-strip">' + strip + '</div>';
    const statTitle = sh.statMult > 1 ? "Stats (× " + sh.statMult + ")" : (kind === "pool" ? "Characteristics" : "Kenmerken");
    const statRows = sh.stats.map(k => { const r = findRoll(R, c, "stat:" + k); return '<div class="rl' + (ctx.rollKey === r.key ? " on" : "") + '" data-gr="' + r.key + '"><span><b>' + k + '</b> ' + (kind === "d100" ? stat(R, c, k) : "") + ' <small>' + esc(sh.statLabels[k] || "") + '</small></span><b>' + (kind === "d100" ? r.disp : kind === "2d6" ? sgn(stat(R, c, k)) : stat(R, c, k)) + '</b></div>'; }).join("");
    const grp = sh.skills.some(s => s.group) ? [...new Set(sh.skills.map(s => s.group || ""))] : [""];
    const skillRows = grp.map(g => (g ? '<h4 style="margin:8px 0 2px;color:var(--mute);font-size:13px">' + esc(g) + '</h4>' : "") + sh.skills.filter(s => (s.group || "") === g).map(s => skillRow(R, c, s, ctx, "skill:" + s.k)).join("")).join("") +
      extraSkills(R, c).map((x, i) => '<div class="rl' + (ctx.rollKey === "extra:" + i ? " on" : "") + '" data-gr="extra:' + i + '"><span style="color:var(--gold)">' + esc(x.label) + '</span><b>' + esc(kind === "d100" ? x.val + "%" : kind === "2d6" ? sgn(stat(R, c, x.stat)) : "●".repeat(x.val)) + '</b></div>').join("");
    h += '<div class="sh-two"><div class="card"><h3>' + statTitle + '</h3>' + statRows + '</div><div class="card"><h3>' + esc(sh.skillsTitle || (kind === "2d6" ? "Moves" : "Skills")) + '</h3>' + skillRows + '</div></div>';
    (sh.lists || []).forEach(l => { const a = (c.lists && c.lists[l.k]) || []; if (a.length) h += '<div class="card"><h3>' + esc(l.label) + '</h3>' + a.map(x => '<div class="rl"><span>' + esc(x.name) + '</span><b>' + esc(x.score) + '</b></div>').join("") + '</div>'; });
    const txt = (t, v2) => v2 ? '<details class="card" data-sec="' + esc(t) + '"' + (ctx.open && ctx.open[t] ? " open" : "") + '><summary>' + esc(t) + '</summary><div style="white-space:pre-wrap;font-size:14px">' + esc(v2) + '</div></details>' : "";
    h += txt("Uitrusting", c.equipment) + (sh.extraText || []).map(x => txt(x[1].split(",")[0], c[x[0]])).join("") + txt("Persoonlijkheid", c.personality) + txt("Uiterlijk", c.appearance) + txt("Backstory", c.backstory) + (mine ? txt("Geheimen & DM-haken (alleen jij ziet dit)", [c.secrets && "Geheimen:\n" + c.secrets, c.dmHooks].filter(Boolean).join("\n\n")) : "");
    if (sh.note) h += '<p style="color:var(--mute);font-size:13px">' + esc(sh.note) + '</p>';
    h += '<div class="row" style="margin-bottom:8px"><button class="b alt sm" data-gedit="1">✎ Bewerk blad</button>' + (c.k && c.k !== "_preview" ? '<button class="b alt sm" data-gdead="1">' + (c.dead ? "↩ Weer actief maken" : "☠ Gesneuveld / gepensioneerd") + '</button>' : "") + '</div>';
    h += '<div id="gsroll" class="card rollpanel" style="display:none"></div>';
    return '<div class="psh">' + h + '</div>';
  }
  function rollPanel(R, c, ctx) {
    const r = ctx.rollKey && findRoll(R, c, ctx.rollKey), p = ctx.panel; if (!p) return;
    if (!r) { p.style.display = "none"; return; }
    p.style.display = ""; const o = ctx.rollState, K = roller(R);
    p.innerHTML = '<b>' + esc(r.label) + ' — ' + esc(r.disp) + '</b><div class="row" style="margin-top:6px">' + K.html(R, c, r, o) + '<button class="b alt sm" data-gdig="1" type="button">🎲 Dobbel</button><span id="rout" class="chip" style="font-size:14px;padding:5px 12px">—</span></div>' +
      '<div class="row" style="margin-top:6px"><button class="b sm" data-gcopy="1">Kopieer worp</button>' + (ctx.canUse ? '<button class="b alt sm" data-guse="1">Gebruik in actie</button>' : "") + '</div>';
    const upd = () => { K.read(R, p, o); const e = K.eval(R, c, r, o); p.querySelector("#rout").textContent = e ? e.text : "—"; ctx.last = e; };
    p.addEventListener("input", upd); p.addEventListener("change", upd); upd();
    p.querySelector("[data-gdig]").onclick = () => { K.read(R, p, o); K.digital(R, p, c, r, o); upd(); };
  }
  function editorHtml(R, c, isNew, ctx) {
    const sh = R.sheet, kind = kindOf(R), v = vars(R, c), inp = (id, l, val, t, w) => '<label><small>' + l + '</small><input type="' + (t || "text") + '" id="' + id + '" value="' + esc(val == null ? "" : val) + '"' + (w ? ' style="width:' + w + '"' : "") + '></label>';
    const ta = (id, l, val) => '<label><small>' + l + '</small><textarea id="' + id + '" style="min-height:80px">' + esc(val || "") + '</textarea></label>';
    const mm = meterMax(R, c);
    let h = '<div class="card"><h3>' + (isNew ? "Nieuw personage — " + esc(R.label) : "Blad bewerken — " + esc(R.label)) + '</h3>';
    h += inp("g_name", "Naam", c.name) + '<label><small>Speler</small><select id="g_player"><option value="">—</option>' + (ctx.players || []).map(p => '<option' + (c.player === p ? " selected" : "") + '>' + esc(p) + '</option>').join("") + '</select></label>';
    h += '<label><small>' + esc(sh.professionLabel || "Profession") + '</small><input type="text" id="g_prof" list="g_proflist" value="' + esc(c.profession || "") + '"><datalist id="g_proflist">' + (sh.professions || []).map(p => '<option value="' + esc(p) + '">').join("") + '</datalist></label>' + (sh.noAge ? "" : inp("g_age", "Leeftijd", c.age, "number", "90px"));
    h += '<h3 style="margin-top:10px">' + esc(kind === "pool" ? "Characteristics" : sh.statMult > 1 ? "Stats (3–18)" : "Kenmerken") + '</h3><p style="color:var(--mute);font-size:13px;margin:0 0 6px">' + esc(sh.statHint || "") + '</p><div class="sh-ed">' + sh.stats.map(k => inp("g_st_" + k, k + " <span style=\"color:var(--mute)\">" + esc(sh.statLabels[k] || "") + "</span>", stat(R, c, k), "number")).join("") + '</div>' + (sh.statDice ? '<div class="row"><button class="b alt sm" data-groll="1" type="button">🎲 Dobbel alle kenmerken</button></div>' : "");
    h += '<h3 style="margin-top:10px">Afgeleide waarden</h3><div class="sh-ed">' + sh.meters.map(m => inp("g_mm_" + m.k, esc(m.label) + " (max)", mm[m.k], "number")).join("") + '</div>' +
      '<div class="row"><button class="b alt sm" data-gcalc="1" type="button">Herbereken uit de kenmerken</button></div><p style="color:var(--mute);font-size:13px;margin:4px 0">' + derived(R, c).map(d => esc(d.label) + ": <b>" + esc(d.val) + "</b>").join(" · ") + '</p>';
    if (kind === "2d6") h += '<h3 style="margin-top:10px">' + esc(sh.skillsTitle || "Moves") + '</h3><p style="color:var(--mute);font-size:13px;margin:0 0 4px">De moves staan vast en rollen met hun gekoppelde stat. Eigen moves of technieken voeg je hieronder toe.</p>';
    else h += '<h3 style="margin-top:10px">Skills</h3>' + (sh.budget && kind === "d100" ? '<p id="g_budget" style="color:var(--gold);font-size:13px;margin:0 0 6px">' + esc(sh.budget(c, aboveBase(R, c), v)) + '</p>' : "") +
      '<div class="sh-ed">' + sh.skills.map((s, i) => '<label><small>' + esc(s.label) + (kind === "d100" ? ' <span style="color:var(--mute)">(basis ' + skillBase(R, c, s) + ')</span>' : ' <span style="color:var(--mute)">(' + esc(s.ch.slice(0, 2)) + ')</span>') + '</small><input type="number" id="g_sk_' + i + '" min="0" max="' + (kind === "pool" ? 5 : 99) + '" placeholder="' + skillBase(R, c, s) + '" value="' + (c.skills && c.skills[s.k] != null && c.skills[s.k] !== "" ? esc(c.skills[s.k]) : "") + '"></label>').join("") + '</div>';
    h += ta("g_extra", kind === "2d6" ? "Extra moves / technieken (één per regel: naam | stat)" : kind === "pool" ? "Extra skills (één per regel: naam | rank | characteristic)" : "Extra skills / specialisaties (één per regel: naam | waarde)", c.extra) + '<p style="color:var(--mute);font-size:13px;margin:0">' + esc(sh.skillSpecs || "") + '</p>';
    (sh.lists || []).forEach(l => { h += ta("g_ls_" + l.k, esc(l.label) + " — " + esc(l.hint || "naam | score"), ((c.lists && c.lists[l.k]) || []).map(x => x.name + " | " + x.score).join("\n")); });
    h += ta("g_eq", "Uitrusting", c.equipment) + (sh.extraText || []).map(x => ta("g_x_" + x[0], x[1], c[x[0]])).join("") + ta("g_pers", "Persoonlijkheid", c.personality) + ta("g_app", "Uiterlijk", c.appearance) + ta("g_back", "Backstory", c.backstory) + ta("g_sec", "Geheimen (voor de DM)", c.secrets) + ta("g_hooks", "Haken voor de DM", c.dmHooks);
    h += '<div class="row" style="margin-top:8px"><button class="b" data-gsave="1">Opslaan</button><button class="b alt" data-gcancel="1">Annuleer</button>' + (isNew ? "" : '<button class="b red" data-gdel="1">Wis personage</button>') + '</div></div>';
    return h;
  }
  function readEditor(R, el, old) {
    const q = id => el.querySelector("#" + id), sh = R.sheet, kind = kindOf(R), c = Object.assign({}, old || {}, { ruleset: R.id });
    c.name = q("g_name").value.trim(); c.player = q("g_player").value; c.profession = q("g_prof").value.trim(); c.age = q("g_age") ? q("g_age").value.trim() : (c.age || "");
    c.stats = {}; sh.stats.forEach(k => { c.stats[k] = Math.round(num(q("g_st_" + k).value, statDefault(R))); if (kind === "d100") c.stats[k] = Math.max(1, c.stats[k]); });
    c.meterMax = {}; sh.meters.forEach(m => { const x = q("g_mm_" + m.k); if (x && x.value !== "") c.meterMax[m.k] = num(x.value, 0); });
    c.skills = {}; if (kind !== "2d6") sh.skills.forEach((s, i) => { const x = q("g_sk_" + i); if (x && x.value !== "") c.skills[s.k] = Math.max(0, Math.min(kind === "pool" ? 5 : 99, Math.round(num(x.value, 0)))); });
    c.extra = q("g_extra").value; c.lists = {}; (sh.lists || []).forEach(l => { c.lists[l.k] = q("g_ls_" + l.k).value.split(/\n/).map(x => x.trim()).filter(Boolean).map(x => { const p = x.split("|"); return { name: p[0].trim(), score: num((p[1] || "").trim(), 0) }; }); });
    c.equipment = q("g_eq").value; (sh.extraText || []).forEach(x => { c[x[0]] = q("g_x_" + x[0]).value; });
    c.personality = q("g_pers").value; c.appearance = q("g_app").value; c.backstory = q("g_back").value; c.secrets = q("g_sec").value; c.dmHooks = q("g_hooks").value; c.t = Date.now();
    delete c.k; return c;
  }
  /* ctx: {c, R, me, players, live, avatar, edit:false|true|'new', open:{}, canUse, onSave(c,isNew), onDelete(), onDead(), onEdit(bool), onUse(sel), copy, alert}  */
  function render(el, ctx) {
    const R = ctx.R, c = ctx.c; ctx.rollState = ctx.rollState || {};
    if (ctx.edit) {
      el.innerHTML = editorHtml(R, c, ctx.edit === "new", ctx);
      const upd = () => { const t = readEditor(R, el, c); const b = el.querySelector("#g_budget"); if (b && R.sheet.budget) b.textContent = R.sheet.budget(t, aboveBase(R, t), vars(R, t)); };
      el.oninput = e => { if (/^g_(sk|extra)/.test(e.target.id || "")) upd(); };
      el.onclick = e => {
        const b = e.target.closest("button"); if (!b) return;
        if (b.dataset.groll) { const st = rollStats(R, readEditor(R, el, c)); R.sheet.stats.forEach(k => { el.querySelector("#g_st_" + k).value = st[k]; }); }
        else if (b.dataset.gcalc) { const t = readEditor(R, el, c); t.meterMax = {}; ctx.c = Object.assign({}, t); render(el, ctx); }
        else if (b.dataset.gcancel) ctx.onEdit(false);
        else if (b.dataset.gdel) ctx.onDelete();
        else if (b.dataset.gsave) { const t = readEditor(R, el, c); if (!t.name) { ctx.alert("Geef het personage een naam."); return; } ctx.onSave(t, ctx.edit === "new"); }
      };
      return;
    }
    el.innerHTML = viewHtml(R, c, ctx);
    ctx.panel = el.querySelector("#gsroll");
    if (ctx.rollKey) { rollPanel(R, c, ctx); }
    el.onclick = e => {
      const t = e.target, q = s => t.closest(s);
      if (q("[data-gr]")) { ctx.rollKey = q("[data-gr]").dataset.gr; ctx.rollState = {}; el.querySelectorAll(".rl").forEach(x => x.classList.toggle("on", x.dataset.gr === ctx.rollKey)); rollPanel(R, c, ctx); if (ctx.panel) ctx.panel.scrollIntoView({ block: "nearest" }); return; }
      if (q("[data-gedit]")) return ctx.onEdit(true);
      if (q("[data-gdead]")) return ctx.onDead();
      if (q("[data-gcopy]")) { if (ctx.last) ctx.copy("[worp: " + ctx.last.line + "]", q("[data-gcopy]")); else ctx.alert("Vul eerst je worp in."); return; }
      if (q("[data-guse]")) { if (!ctx.last) { ctx.alert("Vul eerst je worp in."); return; } ctx.onUse({ key: ctx.rollKey, state: Object.assign({}, ctx.rollState) }); return; }
      if (ctx.rollKey && !q("#gsroll")) { ctx.rollKey = ""; el.querySelectorAll(".rl.on").forEach(x => x.classList.remove("on")); if (ctx.panel) ctx.panel.style.display = "none"; }
    };
    el.addEventListener("toggle", e => { const d = e.target; if (d && d.dataset && d.dataset.sec && ctx.open) ctx.open[d.dataset.sec] = d.open; }, true);
  }
  /* ---------- worpregel in het spel (Actie-tab): HTML + bijwerken ---------- */
  function rowHtml(R, c, o) {
    const list = rollList(R, c), groups = [...new Set(list.map(r => r.group))], r0 = list.find(r => r.key === o.key) || list[0];
    const opts = groups.map(g => '<optgroup label="' + esc(g) + '">' + list.filter(r => r.group === g).map(r => '<option value="' + esc(r.key) + '"' + (r.key === o.key ? " selected" : "") + '>' + esc(r.label) + ' (' + esc(r.disp) + ')</option>').join("") + '</optgroup>').join("");
    return '<div class="row"><select id="rsel" style="flex:2;min-width:150px"><option value="">🎲 Geen worp meegeven</option>' + opts + '</select>' + roller(R).html(R, c, r0, o) + '<button class="b alt sm" id="rdig" type="button">🎲</button><span id="rout" class="chip" style="font-size:13px;padding:4px 10px"></span></div>';
  }
  /* o = {key, ...invoer}; leest de besturing in o en geeft de [worp:]-tekst (zonder haken) of '' */
  function rowUpdate(R, c, root, o) {
    const out = root.querySelector("#rout"); if (!out) return "";
    const K = roller(R); K.read(R, root, o);
    const r = o.key ? findRoll(R, c, o.key) : null, e = r ? K.eval(R, c, r, o) : null;
    if (e) { out.textContent = e.text; return e.line; }
    out.textContent = r ? K.hint(r) : "—"; return "";
  }
  function rowDigital(R, c, root, o) { const K = roller(R), r = o.key ? findRoll(R, c, o.key) : null; if (!r) return; K.read(R, root, o); K.digital(R, root, c, r, o); }
  return { vars, stat, skillBase, skillVal, extraSkills, meterMax, derived, aboveBase, blank, rollStats, rollList, findRoll, matchCheck, evaluate, sheetText, render, rowHtml, rowUpdate, rowDigital, kindOf, esc };
});
