#!/usr/bin/env node
/* Test van de gevechtskaart-logica (dnd/battlemap.js). Gebruik: node dnd/tools/test-battlemap.js */
"use strict";
const B = require("../battlemap.js");
let pass = 0, fail = 0;
const t = (n, f) => { try { f(); pass++; } catch (e) { fail++; console.log("MISLUKT: " + n + "\n  " + e.message); } };
const ok = (v, m) => { if (!v) throw new Error(m || "onwaar"); };
const eq = (a, b) => ok(JSON.stringify(a) === JSON.stringify(b), JSON.stringify(a) + " != " + JSON.stringify(b));
const merge = (a, p) => { if (p === null || typeof p !== "object" || Array.isArray(p)) return p; const o = a && typeof a === "object" && !Array.isArray(a) ? { ...a } : {}; for (const k of Object.keys(p)) { if (p[k] === null) delete o[k]; else o[k] = merge(o[k], p[k]); } return o; };
const stand = () => ({
  pcs: { Wulfgrim: { hp: { current: 50, max: 53 } }, Tharon: { hp: { current: 36, max: 36 } } },
  companions: { Mereth: {} },
  initiative: { round: 1, order: [{ name: "Wulfgrim", init: 18 }, { name: "Orc 1", init: 15, enemy: true, health: 100 }, { name: "Tharon", init: 14 }, { name: "Mereth", init: 11 }, { name: "Warg", init: 8, enemy: true, health: 100 }] },
  battle: { title: "Open plek", grid: [
    "..........", "..T.......", "..#.......", "....w.....", "..........", ".........."],
    pos: { Wulfgrim: "B2", "Orc 1": "F2", Tharon: "A5", Mereth: "B5", Warg: "H4" }, size: { Warg: 2 } }
});
const at = (m, n) => m.tokens.find(x => x.name === n);
t("vakjes heen en terug, ook voorbij Z", () => { eq(B.parse("a1"), [0, 0]); eq(B.parse("AD24"), [29, 23]); eq(B.sq(29, 23), "AD24"); ok(!B.parse("11") && !B.parse("")); });
t("model: kanten, grootte, uitgeschakeld", () => {
  const s = stand(); s.initiative.order[1].health = 0; const m = B.model(s, { Wulfgrim: 30, Tharon: 35 });
  eq([at(m, "Wulfgrim").side, at(m, "Orc 1").side, at(m, "Mereth").side, at(m, "Warg").size, at(m, "Orc 1").out, at(m, "Tharon").speed], ["pc", "foe", "ally", 2, true, 35]);
  ok(B.active(s) && !B.active({ ...s, initiative: null }));
});
t("routes: moeilijk terrein dubbel, muur en vijand blokkeren, niet schuin langs een hoek", () => {
  const m = B.model(stand()), w = at(m, "Wulfgrim"), r = B.routes(m, w, 60);
  ok(!r["2,1"] && !r["2,2"] && !r["5,1"], "boom, muur, vijand"); eq(r["2,0"].c, 10, "om de boom heen");
  eq(r["4,3"].c - Math.min(r["3,3"].c, r["3,4"].c, r["4,4"].c, r["5,3"].c, r["3,2"].c, r["4,2"].c, r["5,4"].c), 10);
  ok(!B.canStop(m, w, 1, 4), "niet op een bondgenoot eindigen"); ok(B.canStop(m, w, 0, 0));
});
t("afstand tot een groot wezen, Opportunity Attack en dekking", () => {
  const s = stand(); s.battle.pos.Wulfgrim = "E2"; const m = B.model(s), w = at(m, "Wulfgrim");
  eq(B.dist(w, at(m, "Warg")), 3); eq(B.opportunity(m, w, [[4, 1], [3, 1]]), ["Orc 1"]); eq(B.opportunity(m, w, [[4, 1], [4, 0]]), []);
  eq(B.cover(m, { x: 0, y: 1, size: 1 }, { x: 5, y: 1, size: 1 }), "boom"); eq(B.cover(m, w, at(m, "Orc 1")), null);
});
t("zet als tekst en weer terug", () => {
  const mv = { name: "Wulfgrim", from: "B2", to: "E2", ft: 15, dash: true, oa: ["Orc 1", "Warg"] };
  const p = B.parseMoves("Ik hak. [kaart: " + B.moveTag(mv) + "]  [worp: Greataxe → Orc 1: 12]")[0];
  eq([p.name, p.from, p.to, p.ft, p.dash, p.disengage, p.oa], ["Wulfgrim", "B2", "E2", 15, true, false, ["Orc 1", "Warg"]]);
  eq(B.parseMoves("[kaart: Orc 1 A1>B2, 5 ft, Disengage]")[0].name, "Orc 1");
});
t("advance: zet van speler verwerkt, DM verzet vijand, spoor bijgehouden", () => {
  const r = B.advance(stand(), [{ text: "x [kaart: Wulfgrim B2>E2, 15 ft]" }], { battle: { pos: { "Orc 1": "F3" } } }, merge);
  eq(r.errors, []); eq([r.state.battle.pos.Wulfgrim, r.state.battle.pos["Orc 1"], r.state.battle.pos.Tharon], ["E2", "F3", "A5"]);
  eq(r.state.battle.from, { Wulfgrim: "B2", "Orc 1": "F2" });
});
t("advance: DM gaat voor, en het einde van het gevecht haalt de kaart weg", () => {
  const r = B.advance(stand(), [{ text: "[kaart: Wulfgrim B2>E2, 15 ft]" }], { battle: { pos: { Wulfgrim: "C1" } } }, merge); eq(r.state.battle.pos.Wulfgrim, "C1");
  ok(!B.advance(stand(), [], { initiative: null }, merge).state.battle);
});
t("controle: muur, dubbel vakje, onbekend teken, te ver, ontbrekende deelnemer", () => {
  const bad = B.advance(stand(), [], { battle: { pos: { "Orc 1": "C3", Mereth: "A5" } } }, merge);
  ok(bad.errors.some(e => /muur/.test(e)) && bad.errors.some(e => /hetzelfde vakje/.test(e)), bad.errors.join("; "));
  ok(B.check({ ...stand(), battle: { grid: ["..?", ".."], pos: {} } }).errors.length >= 2);
  const far = B.advance(stand(), [], { battle: { pos: { "Orc 1": "J6" } } }, merge); eq(far.errors, []); ok(B.advance(stand(), [], { battle: { pos: { Tharon: "J1" } } }, merge).warnings.some(w => /Tharon/.test(w)));
  const s = stand(); delete s.battle.pos.Tharon; ok(B.check(s).warnings.some(w => /Tharon staat in initiative/.test(w)));
});
t("tekstkaart voor de DM", () => { const a = B.ascii(stand(), { Wulfgrim: 30 }); ok(/ABCDEFGHIJ/.test(a) && /1 = Wulfgrim \[pc\] B2/.test(a) && /Orc 1 20 ft/.test(a), a); });
console.log(pass + " geslaagd, " + fail + " mislukt"); process.exit(fail ? 1 : 0);
