#!/usr/bin/env node
/* Test van de level-up-logica (dnd/levelup.js) met bladen zoals die van Wulfgrim (Barbarian) en Tharon (Ranger):
   verschillende keuzes per klasse, hit points (vast of gegooid, Tough, Constitution), ASI en feat, grenzen en weergave.
   Gebruik: node dnd/tools/test-levelup.js */
"use strict";
const LU = require("../levelup.js");
let pass = 0, fail = 0;
function t(n, f) { try { f(); pass++; } catch (e) { fail++; console.log("MISLUKT: " + n + "\n  " + e.message); } }
const eq = (a, b, m) => { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error((m || "") + " verwacht " + JSON.stringify(b) + " kreeg " + JSON.stringify(a)); };
const ok = (v, m) => { if (!v) throw new Error(m || "onwaar"); };
const wulf = () => ({ k: "wulfgrim", name: "Wulfgrim", player: "Gerben", class: "Barbarian", subclass: "Path of the Wild Heart", level: 3, hitDice: "3d12", ac: 15, hpMax: 41,
  abilities: { str: 17, dex: 14, con: 16, int: 8, wis: 10, cha: 8 }, features: "WEAPON MASTERY: Greataxe (Cleave), Handaxe (Vex). FEATS Tough: +2 max HP per level.", equipment: "Greataxe. Geen armor of shield.", spellInfo: "", spells: "" });
const tha = () => ({ k: "tharon", name: "Tharon", player: "Maurits", class: "Ranger", subclass: "Gloom Stalker (voorgesteld)", level: 3, hitDice: "3d10", ac: 15, hpMax: 28,
  abilities: { str: 10, dex: 17, con: 14, int: 10, wis: 15, cha: 10 }, features: "Weapon Mastery: Shortbow (Vex), Dagger (Nick).", equipment: "Studded Leather Armor", spellInfo: "Spellcasting-ability Wisdom: Spell Save DC 12, Spell Attack +4; 3 Spell Slots van level 1.", spells: "Ranger: Alarm, Detect Magic; Hunter's Mark" });

t("Barbarian level 4: ASI en een derde Weapon Mastery; Ranger level 4: ASI en een vijfde spell, geen mastery", () => {
  const pw = LU.plan(wulf()), pt = LU.plan(tha());
  eq(pw.asi, true); eq(pt.asi, true); eq(pw.choices.map(c => c.id), ["mastery"]); eq(pt.choices.map(c => c.id), ["spell"]);
  ok(!pw.choices[0].options.includes("Greataxe (Cleave)") && pw.choices[0].options.includes("Spear (Sap)"), "reeds gekozen wapens horen er niet in");
});
t("level 5: Barbarian krijgt Extra Attack en Fast Movement, Ranger krijgt Extra Attack en nieuwe slots", () => {
  const w = wulf(); w.level = 4; const p = LU.plan(w); eq(p.feats.map(f => f[0]), ["Extra Attack", "Fast Movement"]); eq(p.asi, false);
  const r = tha(); r.level = 4; const pr = LU.plan(r); eq(pr.feats.map(f => f[0]), ["Extra Attack"]); ok(pr.notes.some(n => /2× level 2/.test(n)), "nieuwe slots genoemd");
});
t("Wulfgrim level 4: vaste HP (7 + CON 3 + Tough 2), Hit Dice, AC blijft, ASI +1 STR +1 CON", () => {
  const r = LU.apply(wulf(), { hpMode: "avg", asiMode: "asi", asi1: "str", asi2: "con", mastery: "Spear (Sap)" }); ok(!r.error, r.error);
  eq(r.c.level, 4); eq(r.c.hitDice, "4d12"); eq(r.c.abilities.str, 18); eq(r.c.abilities.con, 17);
  eq(r.gain, 7 + 3 + 2, "CON 17 heeft dezelfde modifier als 16"); eq(r.c.hpMax, 41 + 12); eq(r.c.ac, 15);
  ok(/Spear \(Sap\)/.test(r.c.features) && /LEVEL 4/.test(r.c.features));
});
t("Wulfgrim: +2 Constitution (16 naar 18) geeft +1 modifier, +1 HP per eerder level en +1 AC (Unarmored Defense)", () => {
  const r = LU.apply(wulf(), { hpMode: "avg", asiMode: "asi", asi1: "con", asi2: "con", mastery: "Spear (Sap)" }); ok(!r.error, r.error);
  eq(r.c.abilities.con, 18); eq(r.gain, 7 + 4 + 2 + 1 * 3); eq(r.c.ac, 16);
});
t("Tharon level 4: vaste HP (6 + CON 2), een vijfde spell, DC en aanvalsbonus kloppen", () => {
  const r = LU.apply(tha(), { hpMode: "avg", asiMode: "asi", asi1: "wis", asi2: "wis", spell: "Cure Wounds" }); ok(!r.error, r.error);
  eq(r.c.level, 4); eq(r.c.hitDice, "4d10"); eq(r.c.abilities.wis, 17); eq(r.gain, 6 + 2); eq(r.c.hpMax, 36);
  ok(/Level 4 \(Ranger\): Cure Wounds/.test(r.c.spells)); ok(/Spell Save DC 13/.test(r.c.spellInfo), r.c.spellInfo); ok(/Spell Attack \+5/.test(r.c.spellInfo));
});
t("Tharon: +2 DEX verandert AC niet automatisch (gedragen armor), maar de speler krijgt een controle-opmerking", () => {
  const r = LU.apply(tha(), { hpMode: "avg", asiMode: "asi", asi1: "dex", asi2: "dex", spell: "Fog Cloud" }); ok(!r.error, r.error);
  eq(r.c.abilities.dex, 19); eq(r.c.ac, 15); ok(/Controleer je Armor Class/.test(r.c.features));
});
t("zelf gooien: waarde buiten de dobbelsteen wordt geweigerd, een geldige worp telt", () => {
  ok(LU.apply(wulf(), { hpMode: "roll", hpRoll: 13, asiMode: "asi", asi1: "str", asi2: "str" }).error);
  const r = LU.apply(wulf(), { hpMode: "roll", hpRoll: 12, asiMode: "asi", asi1: "str", asi2: "str", mastery: "Spear (Sap)" }); ok(!r.error, r.error); eq(r.gain, 12 + 3 + 2);
});
t("feat in plaats van ASI, met +1 op een ability; zonder feat een fout; ability boven 20 wordt geweigerd", () => {
  ok(LU.apply(wulf(), { hpMode: "avg", asiMode: "feat" }).error);
  const r = LU.apply(wulf(), { hpMode: "avg", asiMode: "feat", feat: "Sentinel", featAb: "str", mastery: "Spear (Sap)" }); ok(!r.error, r.error); eq(r.c.abilities.str, 18); ok(/Feat \(level 4\): Sentinel \(\+1 Strength\)/.test(r.c.features));
  const l = LU.apply(wulf(), { hpMode: "avg", asiMode: "feat", feat: "Lucky", featAb: "str", mastery: "Spear (Sap)" }); ok(!l.error, l.error); eq(l.c.abilities.str, 17, "Origin feat geeft geen +1");
  const w = wulf(); w.abilities.str = 20; ok(LU.apply(w, { hpMode: "avg", asiMode: "asi", asi1: "str", asi2: "dex", mastery: "Spear (Sap)" }).error);
});
t("level zonder ASI (5): geen ASI-keuze nodig; level 8 weer wel; Fighter krijgt extra ASI op 6", () => {
  const w = wulf(); w.level = 4; const r = LU.apply(w, { hpMode: "avg" }); ok(!r.error, r.error); eq(r.c.level, 5); eq(LU.isAsi("Fighter", 6), true); eq(LU.isAsi("Barbarian", 6), false); eq(LU.isAsi("Barbarian", 8), true);
});
t("Rage-uses en -schade en mastery-aantal volgens level", () => { eq([3, 6, 12, 17].map(LU.rageUses), [3, 4, 5, 6]); eq([8, 9, 16].map(LU.rageDmg), [2, 3, 4]); eq([3, 4, 10].map(LU.masteryCount), [2, 3, 4]); });
t("subclass-feature op het juiste level (Wild Heart 6, Gloom Stalker 7)", () => {
  const w = wulf(); w.level = 5; ok(LU.plan(w).feats.some(f => f[0] === "Aspect of the Wilds"));
  const r = tha(); r.level = 6; ok(LU.plan(r).feats.some(f => f[0] === "Iron Mind"));
});
t("onbekende klasse krijgt een nette waarschuwing; level 12 is de grens", () => {
  const m = { name: "X", class: "Monk", level: 3, hitDice: "3d8", abilities: { con: 12 }, features: "" }; ok(LU.plan(m).notes.some(n => /Player's Handbook/.test(n)));
  const w = wulf(); w.level = 12; eq(LU.plan(w).ok, false);
});
t("pending: alleen aangekondigd en alleen voor de eigen speler", () => { const c = wulf(); c.levelUp = { status: "announced", to: 4 }; eq(LU.pending(c, "Gerben"), true); eq(LU.pending(c, "Maurits"), false); c.levelUp.status = "done"; eq(LU.pending(c, "Gerben"), false); eq(LU.pending(wulf(), "Gerben"), false); });
t("weergave: verschillende keuzes voor Barbarian en Ranger (nepdocument)", () => {
  const mk = () => ({ innerHTML: "", querySelectorAll: () => [] }), esc = s => String(s);
  const w = wulf(); w.levelUp = { status: "announced", to: 4, note: "Het beraad is gesloten." }; const tr = tha(); tr.levelUp = { status: "announced", to: 4 };
  const a = mk(), b = mk(); LU.render(a, { c: w, esc: esc, feats: ["Lucky", "Alert"], featText: {}, onDone: () => {}, onClose: () => {} }); LU.render(b, { c: tr, esc: esc, feats: ["Lucky"], featText: {}, onDone: () => {}, onClose: () => {} });
  ["Level-up: Wulfgrim", "Weapon Mastery", "Vaste waarde (7", "Tough", "Het beraad is gesloten."].forEach(x => ok(a.innerHTML.includes(x), "Wulfgrim mist: " + x));
  ["Level-up: Tharon", "voorbereide spell", "Vaste waarde (6"].forEach(x => ok(b.innerHTML.includes(x), "Tharon mist: " + x)); ok(!b.innerHTML.includes("Weapon Mastery: kies"));
});
t("PHB 2024: alle feats aanwezig, eisen en +1-keuzes kloppen", () => {
  const n = cat => LU.FEAT_DATA.filter(f => f.cat === cat).length; eq([n("O"), n("G"), n("S")], [12, 42, 10]);
  eq(new Set(LU.FEAT_DATA.map(f => f.name)).size, LU.FEAT_DATA.length);
  const w = wulf(), why = x => LU.featBlock(w, LU.featInfo(x), 4);
  ok(!why("Great Weapon Master") && !why("Sentinel") && !why("Shield Master") && !why("Heavily Armored"));
  ok(why("War Caster") && why("Actor") && why("Heavy Armor Master") && why("Archery"));
  ok(!LU.featBlock(tha(), LU.featInfo("War Caster"), 4) && !LU.featBlock(tha(), LU.featInfo("Defense"), 4));
  const go = (c, feat, featAb) => LU.apply(c, { hpMode: "avg", asiMode: "feat", feat: feat, featAb: featAb, mastery: "Spear (Sap)" });
  ok(go(wulf(), "Great Weapon Master", "dex").error && go(wulf(), "Great Weapon Master", "").error && go(wulf(), "War Caster", "wis").error);
  const sp = go(wulf(), "Speedy", "con"); eq(sp.c.speed, 40);
  const rs = go(Object.assign(wulf(), { saves: ["str", "con"] }), "Resilient", "wis"); eq(rs.c.saves, ["str", "con", "wis"]); ok(go(Object.assign(wulf(), { saves: ["str", "con"] }), "Resilient", "str").error);
});
t("weergave feats: gegroepeerd, eis zichtbaar, geen Fighting Styles voor een Barbarian; Healer's Kit telt niet als Healer", () => {
  const box = { innerHTML: "", querySelectorAll: () => [] }, w = wulf(); w.k = "x1"; w.levelUp = { status: "announced", to: 4 }; w.features += " Healer's Kit.";
  const els = []; const b2 = { innerHTML: "", querySelectorAll: () => els };
  const radio = { dataset: { lu: "asim" }, tagName: "INPUT", type: "radio", value: "feat" }; els.push(radio);
  LU.render(b2, { c: w, esc: s => String(s), onDone: () => {}, onClose: () => {} }); radio.onchange();
  ["General Feats", "Origin Feats", "Great Weapon Master", "Actor — vereist Charisma 13+", '<option value="Healer">'].forEach(x => ok(b2.innerHTML.includes(x), "mist: " + x));
  ok(!b2.innerHTML.includes("Fighting Style Feats") && !b2.innerHTML.includes('<option value="Tough">'));
});
t("een hogere modifier schuift de schade op het blad mee", () => {
  const w = Object.assign(wulf(), { abilities: { str: 17, dex: 14, con: 16, int: 8, wis: 10, cha: 8 }, attacks: [
    { name: "Greataxe", ability: "str", damage: "1d12+3 slashing (Rage: 1d12+5)" }, { name: "Spear", ability: "str", damage: "1d6+3 piercing (two-handed 1d8+3)" },
    { name: "Shortbow", ability: "dex", damage: "1d6+2 piercing" }, { name: "Unarmed Strike", ability: "str", damage: "4 bludgeoning" }] });
  const r = LU.apply(w, { hpMode: "avg", asiMode: "feat", feat: "Great Weapon Master", featAb: "str", mastery: "Spear (Sap)" });
  eq(r.c.attacks.map(a => a.damage), ["1d12+4 slashing (Rage: 1d12+6)", "1d6+4 piercing (two-handed 1d8+4)", "1d6+2 piercing", "5 bludgeoning"]);
  eq(w.attacks[0].damage, "1d12+3 slashing (Rage: 1d12+5)");
});
console.log(pass + " geslaagd, " + fail + " mislukt"); process.exit(fail ? 1 : 0);
