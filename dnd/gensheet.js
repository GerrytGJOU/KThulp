/* Generiek personagenblad voor niet-D&D-regelsets (dnd/): tekent uit R.sheet (settings-rulesets-d100.js) een blad, een editor en een worppaneel.
   Eén bestand voor browser (window.DNDGenSheet) en Node (DM-tools: sheetText). De D&D-bladcode in index.html blijft ongemoeid.
   Karakterrecord: {ruleset, name, player, profession, age, stats:{STR:12}, skills:{"Firearms":50}, extra:"Science (Biology) | 40",
   meterMax:{hp:12}, lists:{bonds:[{name,score}]}, equipment, personality, appearance, backstory, motivation, ideology, secrets, dmHooks}. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory(require("./dobbel.js"));
  else root.DNDGenSheet = factory(root.DNDDice);
})(typeof self !== "undefined" ? self : this, function (Dice) {
  "use strict";
  const esc = s => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const num = (x, d) => { const n = Number(x); return isFinite(n) ? n : d; };

  /* ---------- rekenen ---------- */
  function stat(R, c, k) { const v = c && c.stats && c.stats[k]; return num(v, R.sys === "dg" ? 10 : 50); }
  function skillBase(R, c, sk) {
    const b = sk.base; if (typeof b === "number") return b;
    const m = String(b).match(/^([A-Z]+)(\/2)?$/); if (!m) return 0;
    const s = stat(R, c, m[1]); return m[2] ? Math.floor(s / 2) : s;
  }
  function skillVal(R, c, sk) { const v = c && c.skills && c.skills[sk.k]; return v == null || v === "" ? skillBase(R, c, sk) : num(v, skillBase(R, c, sk)); }
  function extraSkills(c) { /* "Naam | waarde" per regel */
    return String((c && c.extra) || "").split(/\n/).map(l => l.trim()).filter(Boolean).map(l => { const p = l.split("|"); return { k: p[0].trim(), label: p[0].trim(), val: num((p[1] || "").trim(), 0) }; }).filter(x => x.k);
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
  function derived(R, c) { const v = vars(R, c); return R.sheet.derived.map(d => ({ k: d.k, label: d.label, val: (c && c.derived && c.derived[d.k] != null && c.derived[d.k] !== "") ? c.derived[d.k] : d.fn(v) })); }
  function aboveBase(R, c) { let n = 0; R.sheet.skills.forEach(s => { const d = skillVal(R, c, s) - skillBase(R, c, s); if (d > 0) n += d; }); extraSkills(c).forEach(x => { n += x.val; }); return n; }
  function blank(R, player) {
    const c = { ruleset: R.id, name: "", player: player || "", stats: {}, skills: {}, lists: {} };
    R.sheet.stats.forEach(k => { c.stats[k] = R.sys === "dg" ? 10 : 50; });
    (R.sheet.lists || []).forEach(l => { c.lists[l.k] = []; });
    return c;
  }
  function rollStats(R, c) { /* dobbelt alle kenmerken volgens het systeem */
    const o = Object.assign({}, c.stats || {}), mult = R.sheet.statGenMult || 1;
    R.sheet.stats.forEach(k => { const r = Dice.roll(R.sheet.statDice[k] || "3d6"); o[k] = r.total * mult; });
    return o;
  }
  /* ---------- worplijst ---------- */
  function rollList(R, c) {
    const out = [], mult = R.sheet.statMult || 1;
    R.sheet.stats.forEach(k => out.push({ key: "stat:" + k, group: mult > 1 ? "Stat × " + mult : "Kenmerk", label: k + (mult > 1 ? "×" + mult : ""), target: stat(R, c, k) * mult }));
    (R.sheet.meters || []).filter(m => m.k === "luck").forEach(m => out.push({ key: "luck", group: "Kenmerk", label: "Luck", target: num(c && c.luckNow, num(c && c.meterMax && c.meterMax.luck, 50)) }));
    R.sheet.skills.forEach(s => out.push({ key: "skill:" + s.k, group: "Skill", label: s.label, target: skillVal(R, c, s) }));
    extraSkills(c).forEach((x, i) => out.push({ key: "extra:" + i, group: "Extra skill", label: x.label, target: x.val }));
    return out;
  }
  function findRoll(R, c, key) { return rollList(R, c).find(r => r.key === key) || null; }
  /* Leidt uit een DM-vraag ("Alertness", "POW×5", "Spot Hidden") de worpsleutel af. */
  function matchCheck(R, c, text) {
    const t = String(text || "").toLowerCase(), list = rollList(R, c);
    let best = null; list.forEach(r => { const l = r.label.toLowerCase().replace(/×\d+$/, ""); const re = new RegExp("(^|[^a-z])" + l.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "([^a-z]|$)"); if (re.test(t) && (!best || l.length > best.l)) best = { k: r.key, l: l.length }; });
    return best ? best.k : "";
  }
  /* o = {nat, mod, ext, mode}: geeft {j, line} of null als de invoer niet klopt. DG: mod = ±20/40 op het doel; CoC: mode "bonus"/"penalty" + ext = extra tientallen. */
  function evaluate(R, c, r, o) {
    const nat = Math.floor(num(o.nat, 0)); if (!(nat >= 1 && nat <= 100)) return null;
    let roll = nat, target = r.target, extra = null, mode = null, mod = 0;
    if (R.sys === "dg") { mod = num(o.mod, 0); target = Math.max(0, target + mod); }
    else if (o.mode === "bonus" || o.mode === "penalty") {
      extra = String(o.ext == null ? "" : o.ext).split(/[,\s]+/).filter(x => x !== "").map(Number).filter(x => isFinite(x) && x >= 0 && x <= 9);
      if (!extra.length) return null; mode = o.mode; roll = Dice.cocTens(nat, extra, mode);
    }
    const j = Dice.judge(R.sys, target, roll);
    return { j, line: Dice.rollLine(R.sys, r.label, j, { mod, extra, mode }), roll };
  }

  /* ---------- tekst voor de DM ---------- */
  function sheetText(R, c) {
    const sh = R.sheet, v = vars(R, c), mm = meterMax(R, c);
    const sk = sh.skills.filter(s => { const val = skillVal(R, c, s); return val !== skillBase(R, c, s); }).map(s => s.label + " " + skillVal(R, c, s));
    const ex = extraSkills(c).map(x => x.label + " " + x.val);
    const lists = (sh.lists || []).map(l => { const a = (c.lists && c.lists[l.k]) || []; return l.label + ": " + (a.length ? a.map(x => x.name + " " + x.score).join(", ") : "—"); });
    const txt = (t, x, n) => x ? t + ": " + String(x).replace(/\n+/g, " ").slice(0, n || 500) + "\n" : "";
    return "## " + c.name + " (speler: " + c.player + ") — " + R.label + (c.profession ? ", " + c.profession : "") + (c.age ? ", " + c.age + " jaar" : "") + "\n" +
      sh.stats.map(k => k + " " + v[k] + (sh.statMult > 1 ? " (×" + sh.statMult + " = " + v[k] * sh.statMult + ")" : "")).join(", ") + "\n" +
      "Max/start: " + sh.meters.map(m => m.label + " " + (m.start ? m.start(v) + " (max " + mm[m.k] + ")" : mm[m.k])).join(", ") + ". " + derived(R, c).map(d => d.label + " " + d.val).join(", ") + ".\n" +
      "Skills boven/anders dan basis: " + ((sk.concat(ex)).join(", ") || "—") + ". Alle andere skills staan op hun basiswaarde (zie regelset).\n" +
      (lists.length ? lists.join("; ") + "\n" : "") + txt("Uitrusting", c.equipment) + txt("Motivatie", c.motivation) + txt("Overtuigingen", c.ideology) + txt("Persoonlijkheid", c.personality, 400) + txt("Haken", c.dmHooks);
  }

  /* ---------- weergave ---------- */
  const mtr = (s, k) => { const v = s && s[k]; if (v == null) return null; if (typeof v === "object") { const cur = num(v.current != null ? v.current : v.cur, NaN), max = num(v.max, NaN); return isFinite(cur) ? { cur, max: isFinite(max) ? max : null } : null; } return isFinite(Number(v)) ? { cur: Number(v), max: null } : null; };
  function viewHtml(R, c, ctx) {
    const sh = R.sheet, mm = meterMax(R, c), dv = derived(R, c), mult = sh.statMult || 1, live = ctx.live || null, mine = ctx.me && c.player === ctx.me;
    const strip = sh.meters.map(m => { const l = live && mtr(live, m.k); const v = vars(R, c); const txt = l ? l.cur + (l.max != null ? " / " + l.max : "") : (m.start ? m.start(v) + " / " + mm[m.k] : String(mm[m.k])); return '<div' + (m.k === "luck" ? ' data-gr="luck" class="rl"' : "") + '><small>' + esc(m.label) + '</small><b>' + esc(txt) + '</b></div>'; }).join("") +
      dv.map(d => '<div><small>' + esc(d.label) + '</small><b>' + esc(d.val) + '</b></div>').join("");
    let h = '<div class="card sh"' + (c.dead ? ' style="opacity:.7"' : "") + '><div class="ppl">' + (ctx.avatar ? ctx.avatar(c.name) : "") + '<div><h3 style="margin:0">' + (c.dead ? "☠ " : "") + esc(c.name) + (c.dead ? ' <small style="color:var(--red)">(gesneuveld)</small>' : "") + '</h3><small style="color:var(--mute)">' + esc(R.label) + (c.profession ? " · " + esc(c.profession) : "") + (c.age ? " · " + esc(c.age) + " jaar" : "") + '</small><br><small style="color:var(--mute)">' + esc(c.player ? "Speler: " + c.player : "") + '</small></div></div></div>';
    h += '<div class="sh-strip">' + strip + '</div>';
    h += '<div class="sh-two"><div class="card"><h3>' + (mult > 1 ? "Stats (× " + mult + ")" : "Kenmerken") + '</h3>' + sh.stats.map(k => { const r = findRoll(R, c, "stat:" + k); return '<div class="rl' + (ctx.rollKey === r.key ? " on" : "") + '" data-gr="' + r.key + '"><span><b>' + k + '</b> ' + stat(R, c, k) + ' <small>' + esc(sh.statLabels[k] || "") + '</small></span><b>' + r.target + '%</b></div>'; }).join("") + '</div>' +
      '<div class="card"><h3>Skills</h3>' + sh.skills.map(s => { const val = skillVal(R, c, s), base = skillBase(R, c, s), key = "skill:" + s.k; return '<div class="rl' + (ctx.rollKey === key ? " on" : "") + '" data-gr="' + esc(key) + '"><span' + (val > base ? ' style="color:var(--gold)"' : ' style="color:var(--mute)"') + '>' + esc(s.label) + '</span><b>' + val + '%</b></div>'; }).join("") +
      extraSkills(c).map((x, i) => '<div class="rl' + (ctx.rollKey === "extra:" + i ? " on" : "") + '" data-gr="extra:' + i + '"><span style="color:var(--gold)">' + esc(x.label) + '</span><b>' + x.val + '%</b></div>').join("") + '</div></div>';
    (sh.lists || []).forEach(l => { const a = (c.lists && c.lists[l.k]) || []; if (a.length) h += '<div class="card"><h3>' + esc(l.label) + '</h3>' + a.map(x => '<div class="rl"><span>' + esc(x.name) + '</span><b>' + esc(x.score) + '</b></div>').join("") + '</div>'; });
    const txt = (t, v) => v ? '<details class="card" data-sec="' + esc(t) + '"' + (ctx.open && ctx.open[t] ? " open" : "") + '><summary>' + esc(t) + '</summary><div style="white-space:pre-wrap;font-size:14px">' + esc(v) + '</div></details>' : "";
    h += txt("Uitrusting", c.equipment) + (sh.extraText || []).map(x => txt(x[1].split(",")[0], c[x[0]])).join("") + txt("Persoonlijkheid", c.personality) + txt("Uiterlijk", c.appearance) + txt("Backstory", c.backstory) + (mine ? txt("Geheimen & DM-haken (alleen jij ziet dit)", [c.secrets && "Geheimen:\n" + c.secrets, c.dmHooks].filter(Boolean).join("\n\n")) : "");
    if (sh.note) h += '<p style="color:var(--mute);font-size:13px">' + esc(sh.note) + '</p>';
    h += '<div class="row" style="margin-bottom:8px"><button class="b alt sm" data-gedit="1">✎ Bewerk blad</button>' + (c.k && c.k !== "_preview" ? '<button class="b alt sm" data-gdead="1">' + (c.dead ? "↩ Weer actief maken" : "☠ Gesneuveld / gepensioneerd") + '</button>' : "") + '</div>';
    h += '<div id="gsroll" class="card rollpanel" style="display:none"></div>';
    return '<div class="psh">' + h + '</div>';
  }
  function modControls(R, o) { /* modifier-keuze + (CoC) extra tientallen; id's gebruikt door index.html en het worppaneel */
    if (R.sys === "dg") return '<select id="rmod" title="Modifier op je doel">' + [[40, "+40"], [20, "+20"], [0, "±0"], [-20, "−20"], [-40, "−40"]].map(x => '<option value="' + x[0] + '"' + (String(o.mod || 0) === String(x[0]) ? " selected" : "") + '>' + x[1] + '</option>').join("") + '</select>';
    return '<select id="rmod" title="Bonus- of penaltydobbelsteen">' + [["", "geen bonus/penalty"], ["bonus", "Bonus die"], ["penalty", "Penalty die"]].map(x => '<option value="' + x[0] + '"' + ((o.mode || "") === x[0] ? " selected" : "") + '>' + x[1] + '</option>').join("") + '</select>' +
      '<input type="text" id="rext" inputmode="numeric" placeholder="extra tiental(len), bv. 2 of 2,5" value="' + esc(o.ext || "") + '" style="width:150px;' + (o.mode ? "" : "display:none") + '">';
  }
  function readCtl(R, root, o) { /* leest de besturing uit het DOM naar o */
    const q = s => root.querySelector(s); const n = q("#rnat"), m = q("#rmod"), x = q("#rext");
    if (n) o.nat = n.value; if (m) { if (R.sys === "dg") o.mod = m.value; else o.mode = m.value; } if (x) o.ext = x.value; return o;
  }
  function rollPanel(R, c, ctx) {
    const r = ctx.rollKey && findRoll(R, c, ctx.rollKey), p = ctx.panel; if (!p) return;
    if (!r) { p.style.display = "none"; return; }
    p.style.display = ""; const o = ctx.rollState;
    p.innerHTML = '<b>' + esc(r.label) + ' — doel ' + r.target + '%</b><div class="row" style="margin-top:6px"><input type="number" id="rnat" inputmode="numeric" min="1" max="100" placeholder="d100" value="' + esc(o.nat || "") + '" style="width:110px">' + modControls(R, o) +
      '<button class="b alt sm" data-gdig="1" type="button">🎲 Dobbel</button><span id="rout" class="chip" style="font-size:14px;padding:5px 12px">—</span></div>' +
      '<div class="row" style="margin-top:6px"><button class="b sm" data-gcopy="1">Kopieer worp</button>' + (ctx.canUse ? '<button class="b alt sm" data-guse="1">Gebruik in actie</button>' : "") + '</div>';
    const upd = () => { readCtl(R, p, o); const e = evaluate(R, c, r, o), out = p.querySelector("#rout"); out.textContent = e ? "= " + e.roll + " · " + e.j.label : "—"; out.className = "chip"; ctx.last = e; const x = p.querySelector("#rext"); if (x) x.style.display = o.mode ? "" : "none"; };
    p.addEventListener("input", upd); p.addEventListener("change", upd); upd();
    p.querySelector("[data-gdig]").onclick = () => { const d = Dice.d100(); p.querySelector("#rnat").value = d; if (R.sys !== "dg" && o.mode) p.querySelector("#rext").value = String(Dice.rnd(10) - 1); upd(); };
  }
  function editorHtml(R, c, isNew, ctx) {
    const sh = R.sheet, v = vars(R, c), inp = (id, l, val, t, w) => '<label><small>' + l + '</small><input type="' + (t || "text") + '" id="' + id + '" value="' + esc(val == null ? "" : val) + '"' + (w ? ' style="width:' + w + '"' : "") + '></label>';
    const ta = (id, l, val) => '<label><small>' + l + '</small><textarea id="' + id + '" style="min-height:80px">' + esc(val || "") + '</textarea></label>';
    const mm = meterMax(R, c);
    let h = '<div class="card"><h3>' + (isNew ? "Nieuw personage — " + esc(R.label) : "Blad bewerken — " + esc(R.label)) + '</h3>';
    h += inp("g_name", "Naam", c.name) + '<label><small>Speler</small><select id="g_player"><option value="">—</option>' + (ctx.players || []).map(p => '<option' + (c.player === p ? " selected" : "") + '>' + esc(p) + '</option>').join("") + '</select></label>';
    h += '<label><small>' + esc(sh.professionLabel || "Profession") + '</small><input type="text" id="g_prof" list="g_proflist" value="' + esc(c.profession || "") + '"><datalist id="g_proflist">' + (sh.professions || []).map(p => '<option value="' + esc(p) + '">').join("") + '</datalist></label>' + inp("g_age", "Leeftijd", c.age, "number", "90px");
    h += '<h3 style="margin-top:10px">' + (sh.statMult > 1 ? "Stats (3–18)" : "Kenmerken") + '</h3><p style="color:var(--mute);font-size:13px;margin:0 0 6px">' + esc(sh.statHint || "") + '</p><div class="sh-ed">' + sh.stats.map(k => inp("g_st_" + k, k + " <span style=\"color:var(--mute)\">" + esc(sh.statLabels[k] || "") + "</span>", stat(R, c, k), "number")).join("") + '</div><div class="row"><button class="b alt sm" data-groll="1" type="button">🎲 Dobbel alle kenmerken</button></div>';
    h += '<h3 style="margin-top:10px">Afgeleide waarden</h3><div class="sh-ed">' + sh.meters.map(m => inp("g_mm_" + m.k, esc(m.label) + " (max)", mm[m.k], "number")).join("") + '</div>' +
      '<div class="row"><button class="b alt sm" data-gcalc="1" type="button">Herbereken uit de kenmerken</button></div><p style="color:var(--mute);font-size:13px;margin:4px 0">' + derived(R, c).map(d => esc(d.label) + ": <b>" + esc(d.val) + "</b>").join(" · ") + '</p>';
    h += '<h3 style="margin-top:10px">Skills</h3><p id="g_budget" style="color:var(--gold);font-size:13px;margin:0 0 6px">' + esc(sh.budget(c, aboveBase(R, c), v)) + '</p><div class="sh-ed">' + sh.skills.map((s, i) => '<label><small>' + esc(s.label) + ' <span style="color:var(--mute)">(basis ' + skillBase(R, c, s) + ')</span></small><input type="number" id="g_sk_' + i + '" min="0" max="99" placeholder="' + skillBase(R, c, s) + '" value="' + (c.skills && c.skills[s.k] != null && c.skills[s.k] !== "" ? esc(c.skills[s.k]) : "") + '"></label>').join("") + '</div>';
    h += ta("g_extra", "Extra skills / specialisaties (één per regel: naam | waarde)", c.extra) + '<p style="color:var(--mute);font-size:13px;margin:0">' + esc(sh.skillSpecs || "") + '</p>';
    (sh.lists || []).forEach(l => { h += ta("g_ls_" + l.k, esc(l.label) + " — " + esc(l.hint || "naam | score"), ((c.lists && c.lists[l.k]) || []).map(x => x.name + " | " + x.score).join("\n")); });
    h += ta("g_eq", "Uitrusting", c.equipment) + (sh.extraText || []).map(x => ta("g_x_" + x[0], x[1], c[x[0]])).join("") + ta("g_pers", "Persoonlijkheid", c.personality) + ta("g_app", "Uiterlijk", c.appearance) + ta("g_back", "Backstory", c.backstory) + ta("g_sec", "Geheimen (voor de DM)", c.secrets) + ta("g_hooks", "Haken voor de DM", c.dmHooks);
    h += '<div class="row" style="margin-top:8px"><button class="b" data-gsave="1">Opslaan</button><button class="b alt" data-gcancel="1">Annuleer</button>' + (isNew ? "" : '<button class="b red" data-gdel="1">Wis personage</button>') + '</div></div>';
    return h;
  }
  function readEditor(R, el, old) {
    const q = id => el.querySelector("#" + id), sh = R.sheet, c = Object.assign({}, old || {}, { ruleset: R.id });
    c.name = q("g_name").value.trim(); c.player = q("g_player").value; c.profession = q("g_prof").value.trim(); c.age = q("g_age").value.trim();
    c.stats = {}; sh.stats.forEach(k => { c.stats[k] = Math.max(1, Math.round(num(q("g_st_" + k).value, 10))); });
    c.meterMax = {}; sh.meters.forEach(m => { const x = q("g_mm_" + m.k); if (x && x.value !== "") c.meterMax[m.k] = num(x.value, 0); });
    c.skills = {}; sh.skills.forEach((s, i) => { const x = q("g_sk_" + i); if (x && x.value !== "") c.skills[s.k] = Math.max(0, Math.min(99, Math.round(num(x.value, 0)))); });
    c.extra = q("g_extra").value; c.lists = {}; (sh.lists || []).forEach(l => { c.lists[l.k] = q("g_ls_" + l.k).value.split(/\n/).map(x => x.trim()).filter(Boolean).map(x => { const p = x.split("|"); return { name: p[0].trim(), score: num((p[1] || "").trim(), 0) }; }); });
    c.equipment = q("g_eq").value; (sh.extraText || []).forEach(x => { c[x[0]] = q("g_x_" + x[0]).value; });
    c.personality = q("g_pers").value; c.appearance = q("g_app").value; c.backstory = q("g_back").value; c.secrets = q("g_sec").value; c.dmHooks = q("g_hooks").value; c.t = Date.now();
    delete c.k; return c;
  }
  /* ctx: {c, R, me, players, live, avatar, edit:false|true|'new', open:{}, canUse, onSave(c,isNew), onDelete(), onDead(), onEdit(bool), onUse(sel), slug}  */
  function render(el, ctx) {
    const R = ctx.R, c = ctx.c; ctx.rollState = ctx.rollState || { nat: "", mod: 0, mode: "", ext: "" };
    if (ctx.edit) {
      el.innerHTML = editorHtml(R, c, ctx.edit === "new", ctx);
      const upd = () => { const t = readEditor(R, el, c); const b = el.querySelector("#g_budget"); if (b) b.textContent = R.sheet.budget(t, aboveBase(R, t), vars(R, t)); };
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
      if (q("[data-gr]")) { ctx.rollKey = q("[data-gr]").dataset.gr; ctx.rollState = { nat: "", mod: 0, mode: "", ext: "" }; el.querySelectorAll(".rl").forEach(x => x.classList.toggle("on", x.dataset.gr === ctx.rollKey)); rollPanel(R, c, ctx); if (ctx.panel) ctx.panel.scrollIntoView({ block: "nearest" }); return; }
      if (q("[data-gedit]")) return ctx.onEdit(true);
      if (q("[data-gdead]")) return ctx.onDead();
      if (q("[data-gcopy]")) { if (ctx.last) ctx.copy("[worp: " + ctx.last.line + "]", q("[data-gcopy]")); else ctx.alert("Vul eerst je d100-worp in."); return; }
      if (q("[data-guse]")) { if (!ctx.last) { ctx.alert("Vul eerst je d100-worp in."); return; } ctx.onUse({ key: ctx.rollKey, state: Object.assign({}, ctx.rollState) }); return; }
      if (ctx.rollKey && !q("#gsroll")) { ctx.rollKey = ""; el.querySelectorAll(".rl.on").forEach(x => x.classList.remove("on")); if (ctx.panel) ctx.panel.style.display = "none"; }
    };
    el.addEventListener("toggle", e => { const d = e.target; if (d && d.dataset && d.dataset.sec && ctx.open) ctx.open[d.dataset.sec] = d.open; }, true);
  }
  /* ---------- worpregel in het spel (Actie-tab): HTML + bijwerken ---------- */
  function rowHtml(R, c, o) {
    const list = rollList(R, c), groups = [...new Set(list.map(r => r.group))];
    const opts = groups.map(g => '<optgroup label="' + esc(g) + '">' + list.filter(r => r.group === g).map(r => '<option value="' + esc(r.key) + '"' + (r.key === o.key ? " selected" : "") + '>' + esc(r.label) + ' (' + r.target + '%)</option>').join("") + '</optgroup>').join("");
    return '<div class="row"><select id="rsel" style="flex:2;min-width:150px"><option value="">🎲 Geen worp meegeven</option>' + opts + '</select>' +
      '<input type="number" id="rnat" inputmode="numeric" min="1" max="100" placeholder="d100" value="' + esc(o.nat || "") + '" style="width:90px">' + modControls(R, o) +
      '<button class="b alt sm" id="rdig" type="button">🎲</button><span id="rout" class="chip" style="font-size:13px;padding:4px 10px"></span></div>';
  }
  /* o = {key, nat, mod, mode, ext}; geeft de [worp:]-tekst (zonder haken) of '' */
  function rowUpdate(R, c, root, o) {
    const out = root.querySelector("#rout"); if (!out) return "";
    const r = o.key ? findRoll(R, c, o.key) : null, e = r ? evaluate(R, c, r, o) : null;
    const x = root.querySelector("#rext"); if (x) x.style.display = o.mode ? "" : "none";
    if (e) { out.textContent = "= " + e.roll + " · " + e.j.label; return e.line; }
    out.textContent = r ? "doel " + r.target + "% · vul je d100 in" : (String(o.nat || "").trim() ? "kies eerst welke worp →" : "—"); return "";
  }
  return { vars, stat, skillBase, skillVal, extraSkills, meterMax, derived, aboveBase, blank, rollStats, rollList, findRoll, matchCheck, evaluate, sheetText, render, rowHtml, rowUpdate, readCtl, modControls, esc };
});
