/* Level-up via het karakterblad voor de Midden-aarde D&D-app (dnd/).
   Eén bestand dat in de browser (window.LevelUp) en in Node (require, voor de tests) werkt.
   De DM kondigt een level-up aan in het verhaal en zet characters/{sleutel}/levelUp = {status:'announced', to, note};
   de speler kiest daarna zelf op het karakterblad (hit points, ability score improvement of feat, class-keuzes).
   plan() zegt wat er te kiezen valt, apply() rekent het uit (zuivere functie, getest). Regeldata volgens D&D 2024;
   alles wat niet zeker is, staat als "controleer" in de tekst en gaat langs de DM. Geen geheimen in dit bestand. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.LevelUp = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  const AB = ["str", "dex", "con", "int", "wis", "cha"];
  const AB_NL = { str: "Strength", dex: "Dexterity", con: "Constitution", int: "Intelligence", wis: "Wisdom", cha: "Charisma" };
  const HD = { Barbarian: 12, Bard: 8, Cleric: 8, Druid: 8, Fighter: 10, Monk: 8, Paladin: 10, Ranger: 10, Rogue: 8, Sorcerer: 6, Warlock: 8, Wizard: 6 };
  const CAST_AB = { Bard: "cha", Cleric: "wis", Druid: "wis", Paladin: "cha", Ranger: "wis", Sorcerer: "cha", Warlock: "cha", Wizard: "int" };
  const ASI_EXTRA = { Fighter: [6, 14], Rogue: [10] };
  const MAX_LEVEL = 12;

  /* wapens met Weapon Mastery die een Barbarian (en andere melee-klassen) mag kiezen: naam (mastery) */
  const MASTERY_WEAPONS = ["Club (Slow)", "Dagger (Nick)", "Greatclub (Push)", "Handaxe (Vex)", "Javelin (Slow)", "Light Hammer (Nick)", "Mace (Sap)", "Quarterstaff (Topple)", "Sickle (Nick)", "Spear (Sap)",
    "Battleaxe (Topple)", "Flail (Sap)", "Glaive (Graze)", "Greataxe (Cleave)", "Greatsword (Graze)", "Halberd (Cleave)", "Lance (Topple)", "Longsword (Sap)", "Maul (Topple)", "Morningstar (Sap)", "Pike (Push)", "Rapier (Vex)", "Scimitar (Nick)", "Shortsword (Vex)", "Trident (Topple)", "Warhammer (Push)", "War Pick (Sap)", "Whip (Slow)"];
  const RANGER_SPELLS_1 = ["Alarm", "Animal Friendship", "Cure Wounds", "Detect Magic", "Detect Poison and Disease", "Ensnaring Strike", "Entangle", "Fog Cloud", "Goodberry", "Hail of Thorns", "Hunter's Mark", "Jump", "Longstrider", "Speak with Animals"];
  const RANGER_SPELLS_2 = ["Aid", "Animal Messenger", "Barkskin", "Beast Sense", "Cordon of Arrows", "Darkvision", "Enhance Ability", "Find Traps", "Gust of Wind", "Lesser Restoration", "Locate Animals or Plants", "Locate Object", "Magic Weapon", "Pass without Trace", "Protection from Poison", "Silence", "Spike Growth", "Summon Beast"];
  const RANGER_PREP = { 1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 6, 7: 7, 8: 7, 9: 9, 10: 9, 11: 10, 12: 10 };
  const HALF_SLOTS = { 1: [2], 2: [2], 3: [3], 4: [3], 5: [4, 2], 6: [4, 2], 7: [4, 3], 8: [4, 3], 9: [4, 3, 2], 10: [4, 3, 2], 11: [4, 3, 3], 12: [4, 3, 3] };
  const ORD = ["level 1", "level 2", "level 3", "level 4", "level 5"];

  /* per klasse en subclass: wat er per level bijkomt ([naam, uitleg]) */
  const FEATS = {
    Barbarian: {
      5: [["Extra Attack", "Twee aanvallen per Attack-actie."], ["Fast Movement", "+10 ft Speed zolang je geen zware armor draagt."]],
      7: [["Feral Instinct", "Advantage op Initiative-worpen; als je verrast bent en Rage start, kun je normaal handelen."], ["Instinctive Pounce", "Als je Rage activeert, beweeg je tot half je Speed."]],
      9: [["Brutal Strike", "Laat bij Reckless Attack de Advantage vallen voor +1d10 schade en een extra effect (Forceful Blow of Hamstring Blow). Rage Damage +3."]],
      11: [["Relentless Rage", "Val je op 0 HP tijdens Rage, dan kun je een DC 10 CON-save doen om op 2x je level HP te blijven (DC +5 per gebruik)."]]
    },
    Ranger: {
      5: [["Extra Attack", "Twee aanvallen per Attack-actie."]],
      6: [["Roving", "+10 ft Speed zonder zware armor; je krijgt een Climb Speed en Swim Speed gelijk aan je Speed."]],
      9: [["Expertise", "Expertise in twee skills waar je al proficiency in hebt."]],
      10: [["Tireless", "Een paar keer per Long Rest tijdelijke HP (1d8 + Wisdom modifier) en 1 level Exhaustion minder bij een Short Rest."]]
    }
  };
  const SUBFEATS = {
    "Path of the Wild Heart": { 6: [["Aspect of the Wilds", "Kies Owl (Darkvision 60 ft), Panther (Climb Speed) of Salmon (Swim Speed); de keuze mag je na een Long Rest wijzigen."]], 10: [["Nature Speaker", "Je kunt Commune with Nature als ritueel casten (Wisdom)."]] },
    "Gloom Stalker": { 7: [["Iron Mind", "Proficiency in Wisdom saves (heb je die al, dan in Intelligence of Charisma saves)."]], 11: [["Stalker's Flurry", "Eén keer per beurt: mist een aanval met je wapen, dan doe je meteen een extra wapenaanval."]] }
  };

  const clampLevel = n => Math.max(1, Math.min(MAX_LEVEL, Number(n) || 1));
  const mod = score => Math.floor((Number(score) || 10) / 2 - 5);
  const cls = c => String(c.class || "").replace(/\s*\(.*\)\s*$/, "").trim();
  const sub = c => String(c.subclass || "").replace(/\s*\(.*\)\s*$/, "").trim();
  const hdOf = c => HD[cls(c)] || ((/d(\d+)/.exec(String(c.hitDice || "")) || [])[1] | 0) || 8;
  const hdAvg = d => d / 2 + 1;
  const isAsi = (cl, lv) => [4, 8, 12, 16, 19].concat(ASI_EXTRA[cl] || []).includes(lv);
  const rageUses = lv => lv >= 17 ? 6 : lv >= 12 ? 5 : lv >= 6 ? 4 : lv >= 3 ? 3 : 2;
  const rageDmg = lv => lv >= 16 ? 4 : lv >= 9 ? 3 : 2;
  const masteryCount = lv => lv >= 10 ? 4 : lv >= 4 ? 3 : 2;

  /* wat valt er bij deze level-up te kiezen? */
  function plan(c, to) {
    const from = clampLevel(c.level), L = to || from + 1, cl = cls(c), sb = sub(c), d = hdOf(c);
    const p = { from: from, to: L, cls: cl, sub: sb, hd: d, avg: Math.ceil(hdAvg(d)), tough: /\bTough\b/.test(String(c.features || "")), asi: isAsi(cl, L), feats: [], choices: [], notes: [], ok: L === from + 1 && L <= MAX_LEVEL };
    if (!p.ok) { p.notes.push(L > MAX_LEVEL ? "Deze app regelt level-ups tot level " + MAX_LEVEL + "." : "Een level-up gaat één level per keer."); return p; }
    ((FEATS[cl] || {})[L] || []).concat(((SUBFEATS[sb] || {})[L]) || []).forEach(f => p.feats.push(f));
    if (cl === "Barbarian") {
      if (masteryCount(L) > masteryCount(L - 1)) p.choices.push({ id: "mastery", type: "select", label: "Weapon Mastery: kies een extra wapen", options: MASTERY_WEAPONS.filter(w => !String(c.features || "").includes(w.split(" (")[0] + " (" + w.split(" (")[1]) ) });
      if (rageUses(L) !== rageUses(L - 1)) p.notes.push("Rage: nu " + rageUses(L) + " keer per Long Rest.");
      if (rageDmg(L) !== rageDmg(L - 1)) p.notes.push("Rage Damage wordt +" + rageDmg(L) + ": pas je aanvallen (Rage-schade) aan op het blad.");
    }
    if (cl === "Ranger") {
      const pn = RANGER_PREP[L] || 0, po = RANGER_PREP[L - 1] || 0;
      if (pn > po) p.choices.push({ id: "spell", type: "text", label: "Nieuwe voorbereide spell (" + (HALF_SLOTS[L].length > 1 ? "level 1 of 2" : "level 1") + "; de DM keurt magie goed)", list: RANGER_SPELLS_1.concat(HALF_SLOTS[L].length > 1 ? RANGER_SPELLS_2 : []) });
      if (JSON.stringify(HALF_SLOTS[L]) !== JSON.stringify(HALF_SLOTS[L - 1])) p.notes.push("Spell slots: " + slotText(HALF_SLOTS[L]) + ".");
    }
    if (!FEATS[cl]) p.notes.push("Class-specifieke features van level " + L + " (" + cl + "): lees ze na in het Player's Handbook en meld ze aan de DM; deze app kent ze nog niet.");
    return p;
  }
  function slotText(a) { return a.map((n, i) => n + "× " + ORD[i]).join(", "); }

  /* uitvoeren: geeft {c: nieuw blad, summary} of {error} */
  function apply(c, picks) {
    const p = plan(c, picks && picks.to); if (!p.ok) return { error: p.notes.join(" ") };
    const L = p.to, ab = Object.assign({}, c.abilities || {}); AB.forEach(k => { ab[k] = Number(ab[k]) || 10; });
    const conOld = mod(ab.con), lines = [], sum = [];
    if (p.asi) {
      if (picks.asiMode === "feat") {
        if (!picks.feat) return { error: "Kies een feat." };
        if (picks.featAb && AB.includes(picks.featAb)) { if (ab[picks.featAb] >= 20) return { error: AB_NL[picks.featAb] + " is al 20." }; ab[picks.featAb] += 1; }
        lines.push("Feat (level " + L + "): " + picks.feat + (picks.featAb ? " (+1 " + AB_NL[picks.featAb] + ")" : ""));
        sum.push("feat " + picks.feat + (picks.featAb ? " (+1 " + picks.featAb.toUpperCase() + ")" : ""));
      } else {
        const a1 = picks.asi1, a2 = picks.asi2; if (!AB.includes(a1) || !AB.includes(a2)) return { error: "Kies twee abilities (of dezelfde twee keer voor +2)." };
        ab[a1] += 1; ab[a2] += 1; if (ab[a1] > 20 || ab[a2] > 20) return { error: "Een ability kan niet boven de 20." };
        lines.push("Ability Score Improvement (level " + L + "): " + (a1 === a2 ? "+2 " + AB_NL[a1] : "+1 " + AB_NL[a1] + ", +1 " + AB_NL[a2]));
        sum.push("ASI " + (a1 === a2 ? "+2 " + a1.toUpperCase() : "+1 " + a1.toUpperCase() + " +1 " + a2.toUpperCase()));
      }
    }
    const conNew = mod(ab.con), base = picks.hpMode === "roll" ? Math.max(1, Math.min(p.hd, Number(picks.hpRoll) || 0)) : p.avg;
    if (picks.hpMode === "roll" && !(Number(picks.hpRoll) >= 1 && Number(picks.hpRoll) <= p.hd)) return { error: "Vul je worp in (1 t/m " + p.hd + ")." };
    const gain = base + conNew + (p.tough ? 2 : 0) + (conNew - conOld) * (L - 1);
    const out = Object.assign({}, c); out.level = L; out.abilities = ab; out.hpMax = (Number(c.hpMax) || 0) + gain;
    out.hitDice = String(c.hitDice || "").replace(/^(\d+)(d\d+)/, (m, n, d) => (Number(n) + 1) + d) || (L + "d" + p.hd);
    p.feats.forEach(f => lines.push(f[0] + " (level " + L + "): " + f[1]));
    p.choices.forEach(ch => { const v = String(picks[ch.id] || "").trim(); if (!v) return;
      if (ch.id === "mastery") { lines.push("Weapon Mastery (level " + L + "): " + v); sum.push("mastery " + v); }
      if (ch.id === "spell") { out.spells = String(c.spells || "") + (c.spells ? "\n" : "") + "Level " + L + " (Ranger): " + v; sum.push("spell " + v); } });
    p.choices.forEach(ch => { if (ch.type === "select" && !String(picks[ch.id] || "").trim()) lines.push("(nog te kiezen: " + ch.label + ")"); });
    p.notes.forEach(n => lines.push(n));
    const dexOld = mod((c.abilities || {}).dex || 10);
    if (p.cls === "Barbarian" && Number(c.ac) === 10 + dexOld + conOld) out.ac = 10 + mod(ab.dex) + conNew; /* Unarmored Defense */
    else if (mod(ab.dex) !== dexOld) lines.push("Controleer je Armor Class na deze verandering.");
    const cab = CAST_AB[p.cls];
    if (cab && c.spellInfo) { const pb = Math.floor((L - 1) / 4) + 2, m = mod(ab[cab]); let si = String(c.spellInfo);
      si = si.replace(/Spell Save DC \d+/, "Spell Save DC " + (8 + pb + m)).replace(/Spell Attack \+\d+/, "Spell Attack +" + (pb + m));
      if (p.cls === "Ranger") si = si.replace(/\d+ Spell Slots van level 1\.?/, slotText(HALF_SLOTS[L]).replace(/× level/g, " slots van level").replace(/, /g, ", ") + "."); out.spellInfo = si; }
    out.features = String(c.features || "") + "\n\nLEVEL " + L + " (" + p.cls + (p.sub ? ", " + p.sub : "") + "): " + lines.join("; ");
    out.levelUp = { status: "done", from: p.from, to: L, hpGain: gain, summary: p.cls + " " + p.from + " → " + L + ": HP +" + gain + " (nu " + out.hpMax + "); " + (sum.join("; ") || "geen keuzes") + "; Hit Dice " + out.hitDice + (out.ac !== c.ac ? "; AC " + out.ac : ""), t: Date.now() };
    if (c.levelUp && c.levelUp.note) out.levelUp.note = c.levelUp.note;
    return { c: out, summary: out.levelUp.summary, gain: gain, lines: lines };
  }

  /* heeft deze speler iets te doen op het blad? */
  function pending(c, player) { return !!(c && c.levelUp && c.levelUp.status === "announced" && (!player || c.player === player)); }

  /* ---------- weergave ---------- */
  let picks = {}, pickKey = "";
  function render(box, ctx) {
    const c = ctx.c, esc = ctx.esc, p = plan(c, c.levelUp && c.levelUp.to);
    if (pickKey !== c.k) { picks = { hpMode: "avg", asiMode: "asi" }; pickKey = c.k; }
    picks.to = p.to;
    let h = '<div class="card"><h3>⬆ Level-up: ' + esc(c.name) + ' naar level ' + p.to + '</h3>';
    if (c.levelUp && c.levelUp.note) h += '<div style="white-space:pre-wrap;margin-bottom:6px">' + esc(c.levelUp.note) + '</div>';
    if (!p.ok) { h += '<div class="err">' + esc(p.notes.join(" ")) + '</div><button class="b alt sm" data-lu="cancel">Terug</button></div>'; box.innerHTML = h; wire(box, ctx); return; }
    h += '<h2>Hit points</h2><label><input type="radio" name="hpm" data-lu="hpm" value="avg"' + (picks.hpMode !== "roll" ? " checked" : "") + '> Vaste waarde (' + p.avg + ' + Constitution' + (p.tough ? ' + 2 voor Tough' : '') + ')</label><br>' +
      '<label><input type="radio" name="hpm" data-lu="hpm" value="roll"' + (picks.hpMode === "roll" ? " checked" : "") + '> Zelf gooien (d' + p.hd + ')</label> ' + (picks.hpMode === "roll" ? '<input type="number" data-lu="hproll" min="1" max="' + p.hd + '" value="' + esc(picks.hpRoll || "") + '" style="width:80px" placeholder="d' + p.hd + '">' : '');
    if (p.asi) {
      const abOpts = sel => AB.map(k => '<option value="' + k + '"' + (sel === k ? " selected" : "") + '>' + AB_NL[k] + ' (' + ((c.abilities || {})[k] || 10) + ')</option>').join("");
      h += '<h2>Ability Score Improvement of feat</h2><label><input type="radio" name="asim" data-lu="asim" value="asi"' + (picks.asiMode !== "feat" ? " checked" : "") + '> +2 verdelen over abilities</label><br><label><input type="radio" name="asim" data-lu="asim" value="feat"' + (picks.asiMode === "feat" ? " checked" : "") + '> Een feat</label>';
      if (picks.asiMode === "feat") {
        const taken = String(c.features || ""), fl = (ctx.feats || []).filter(f => !taken.includes(f));
        h += '<div class="row" style="margin-top:6px"><select data-lu="feat"><option value="">Kies een feat</option>' + fl.map(f => '<option' + (picks.feat === f ? " selected" : "") + '>' + esc(f) + '</option>').join("") + '</select><select data-lu="featab"><option value="">(geen +1)</option>' + AB.map(k => '<option value="' + k + '"' + (picks.featAb === k ? " selected" : "") + '>+1 ' + AB_NL[k] + '</option>').join("") + '</select></div><small>Veel feats geven +1 op een ability (zie de beschrijving); kies die hier. De DM keurt je feat goed.</small>' + (picks.feat && ctx.featText && ctx.featText[picks.feat] ? '<div><small>' + esc(ctx.featText[picks.feat]) + '</small></div>' : '');
      } else h += '<div class="row" style="margin-top:6px"><select data-lu="asi1"><option value="">+1 op…</option>' + abOpts(picks.asi1) + '</select><select data-lu="asi2"><option value="">+1 op…</option>' + abOpts(picks.asi2) + '</select></div><small>Kies twee keer dezelfde ability voor +2 (maximum 20).</small>';
    }
    if (p.feats.length) h += '<h2>Nieuwe features</h2>' + p.feats.map(f => '<div class="q"><b>' + esc(f[0]) + '</b><br>' + esc(f[1]) + '</div>').join("");
    p.choices.forEach(ch => {
      h += '<h2>' + esc(ch.label) + '</h2>';
      if (ch.type === "select") h += '<select data-lu="ch" data-id="' + ch.id + '"><option value="">Kies…</option>' + ch.options.map(o => '<option' + (picks[ch.id] === o ? " selected" : "") + '>' + esc(o) + '</option>').join("") + '</select>';
      else h += '<input type="text" data-lu="ch" data-id="' + ch.id + '" list="lu_' + ch.id + '" value="' + esc(picks[ch.id] || "") + '"><datalist id="lu_' + ch.id + '">' + (ch.list || []).map(o => '<option value="' + esc(o) + '">').join("") + '</datalist>';
    });
    if (p.notes.length) h += '<h2>Let op</h2>' + p.notes.map(n => '<div><small>• ' + esc(n) + '</small></div>').join("");
    const r = apply(c, picks);
    h += '<h2>Resultaat</h2><div data-lu-res="1">' + (r.error ? '<small>' + esc(r.error) + '</small>' : '<div class="q done">' + esc(r.summary) + '</div>') + '</div>';
    h += '<div class="row" style="margin-top:10px"><button class="b" data-lu="ok"' + (r.error ? " disabled" : "") + '>Level-up bevestigen</button><button class="b alt" data-lu="cancel">Later</button></div></div>';
    box.innerHTML = h; wire(box, ctx);
  }
  function wire(box, ctx) {
    box.querySelectorAll("[data-lu]").forEach(el => {
      const a = el.dataset.lu;
      if (a === "ok" || a === "cancel") { el.onclick = () => { if (a === "cancel") { ctx.onClose(); return; } const r = apply(ctx.c, picks); if (r.error) { alert(r.error); return; } ctx.onDone(r.c, r.summary); }; return; }
      const text = el.tagName === "TEXTAREA" || (el.tagName === "INPUT" && (el.type === "text" || el.type === "number"));
      const setPicks = () => {
        if (a === "hpm") picks.hpMode = el.value; else if (a === "hproll") picks.hpRoll = el.value; else if (a === "asim") picks.asiMode = el.value;
        else if (a === "asi1") picks.asi1 = el.value; else if (a === "asi2") picks.asi2 = el.value; else if (a === "feat") picks.feat = el.value; else if (a === "featab") picks.featAb = el.value;
        else if (a === "ch") picks[el.dataset.id] = el.value;
      };
      /* in een tekstveld alleen het resultaat en de knop bijwerken, zodat een klik op de knop niet verloren gaat */
      const lite = () => { const r = apply(ctx.c, picks), okb = box.querySelector('[data-lu="ok"]'), res = box.querySelector("[data-lu-res]"); if (okb) okb.disabled = !!r.error;
        if (res) res.innerHTML = r.error ? "<small>" + ctx.esc(r.error) + "</small>" : '<div class="q done">' + ctx.esc(r.summary) + "</div>"; };
      if (text) el.oninput = el.onchange = () => { setPicks(); lite(); };
      else el.onchange = () => { setPicks(); render(box, ctx); };
    });
  }

  return { HD: HD, FEATS: FEATS, SUBFEATS: SUBFEATS, MASTERY_WEAPONS: MASTERY_WEAPONS, RANGER_PREP: RANGER_PREP, HALF_SLOTS: HALF_SLOTS, MAX_LEVEL: MAX_LEVEL, plan: plan, apply: apply, pending: pending, render: render, mod: mod, isAsi: isAsi, rageUses: rageUses, rageDmg: rageDmg, masteryCount: masteryCount };
});
