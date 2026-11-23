#!/usr/bin/env node
/* Test van de logica van de Tafel der Draden (dnd/partytable.js): sleutels, gesprekslimiet, vergelijken van keuzes, onthulling,
   openstaande gesprekken voor de DM en het menu-stipje. Zonder browser of Firebase. Gebruik: node dnd/tools/test-partytable.js */
"use strict";
const PT = require("../partytable.js");
let pass = 0, fail = 0;
function t(n, f) { try { f(); pass++; } catch (e) { fail++; console.log("MISLUKT: " + n + "\n  " + e.message); } }
const eq = (a, b, m) => { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error((m || "") + " verwacht " + JSON.stringify(b) + " kreeg " + JSON.stringify(a)); };
const players = ["Gerben", "Maurits"];
const base = () => ({ open: true, phase: "gesprekken", cands: { runa: { name: "Rúna" }, haleth: { name: "Haleth" }, lirien: { name: "Lírien" } } });

t("sleutels: diakrieten en spaties", () => { eq(PT.keyOf("Rúna"), "runa"); eq(PT.keyOf("Peregrin Took"), "peregrin_took"); eq(PT.keyOf("Gerben"), "gerben"); });
t("gesprek: nieuw, wachtend, beantwoord, afgerond en limiet", () => {
  const d = base(); eq(PT.talkInfo(d, "Gerben", "runa").canWrite, true);
  d.talks = { gerben: { runa: { state: "pending", msgs: { a: { from: "speler", text: "x", t: 1 } } } } };
  const w = PT.talkInfo(d, "Gerben", "runa"); eq(w.canWrite, false, "wachtend"); eq(w.lines, 1);
  d.talks.gerben.runa.state = "answered"; d.talks.gerben.runa.msgs.b = { from: "npc", text: "y", t: 2 }; eq(PT.talkInfo(d, "Gerben", "runa").canWrite, true, "na antwoord");
  d.talks.gerben.runa.msgs.c = { from: "speler", text: "z", t: 3 }; d.talks.gerben.runa.state = "answered"; eq(PT.talkInfo(d, "Gerben", "runa").canWrite, false, "limiet " + PT.MAX_LINES);
  eq(PT.talkInfo(d, "Maurits", "runa").lines, 0, "de ander is onaangeroerd");
});
t("openstaande gesprekken voor de DM", () => {
  const d = base(); d.talks = { maurits: { haleth: { state: "pending", msgs: { a: { from: "speler", text: "Kom mee", t: 1 } } } }, gerben: { runa: { state: "answered", msgs: {} } } };
  const p = PT.pendingTalks(d, players); eq(p.length, 1); eq(p[0].player, "Maurits"); eq(p[0].npc, "haleth"); eq(p[0].msgs[0].text, "Kom mee");
});
t("vergelijken: gelijk, verschil en ontbrekende keuze (telt als wacht)", () => {
  const d = base(); d.picks = { gerben: { runa: "reis", haleth: "contact", lirien: "reis" }, maurits: { runa: "reis", haleth: "voorhoede" } };
  const c = Object.fromEntries(PT.compare(d, players).map(r => [r.key, r]));
  eq(c.runa.agree, true); eq(c.runa.slot, "reis"); eq(c.haleth.agree, false); eq(c.lirien.agree, false); eq(c.lirien.by.Maurits, "wacht");
});
t("onbekende plek wordt als wacht gelezen", () => { const d = base(); d.picks = { gerben: { runa: "teleport" }, maurits: { runa: "wacht" } }; eq(PT.compare(d, players).find(r => r.key === "runa").agree, true); });
t("allReady: alleen als iedereen klaar is", () => { const d = base(); eq(PT.allReady(d, players), false); d.ready = { gerben: true }; eq(PT.allReady(d, players), false); d.ready.maurits = true; eq(PT.allReady(d, players), true); eq(PT.allReady(d, []), false); });
t("menu-stipje: gesprekken open, daarna leggen, daarna uit", () => {
  const d = base(); eq(PT.needsMe(d, "Gerben", players), true);
  Object.keys(d.cands).forEach(k => { d.talks = d.talks || { gerben: {} }; d.talks.gerben[k] = { state: "answered", msgs: { a: { from: "speler", text: "x", t: 1 } } }; }); eq(PT.needsMe(d, "Gerben", players), false);
  d.phase = "leggen"; eq(PT.needsMe(d, "Gerben", players), true); d.ready = { gerben: true }; eq(PT.needsMe(d, "Gerben", players), false);
  eq(PT.needsMe({ open: false }, "Gerben", players), false); eq(PT.needsMe(null, "Gerben", players), false);
});
t("tekst opschonen en kappen", () => { eq(PT.clean("  a \n  b  "), "a b"); eq(PT.clean("x".repeat(2000)).length, 700); });
t("vijf plekken met unieke ids", () => { eq(PT.SLOTS.length, 5); eq(new Set(PT.SLOT_IDS).size, 5); });
t("render zonder open tafel geeft een nette melding (zonder DOM-fouten)", () => { const box = { innerHTML: "", querySelectorAll: () => [] }; PT.render(box, { data: null, esc: s => s }); if (!/nog niet geopend/.test(box.innerHTML)) throw new Error(box.innerHTML); });
t("render met kandidaten bevat knoppen, gesprek en uitleg (nepdocument)", () => {
  const box = { innerHTML: "", querySelectorAll: () => [] }, d = base(); d.phase = "leggen"; d.title = "De Tweede Raad"; d.picks = { gerben: { runa: "reis" } };
  d.cands.runa.demands = "Ik ga niet als wegwerpscout."; d.cands.runa.slotInfo = { reis: "Rúna reist mee." };
  PT.render(box, { data: d, me: { name: "Gerben" }, players: players, npcs: {}, esc: s => String(s).replace(/</g, "&lt;"), db: null, base: "x" });
  ["Tafel der Draden", "De Tweede Raad", "Rúna", "wegwerpscout", 'data-pt="pick"', "Rúna reist mee.", "Klaar met leggen", "Stap 2"].forEach(x => { if (!box.innerHTML.includes(x)) throw new Error("mist: " + x); });
});
t("onthulling: verschil krijgt beraadveld en Voorspraak; afgerond toont de uitkomst", () => {
  const d = base(); d.phase = "leggen"; d.ready = { gerben: true, maurits: true }; d.picks = { gerben: { runa: "reis" }, maurits: { runa: "contact" } };
  d.talks = { gerben: { runa: { state: "answered", msgs: { a: { from: "speler", text: "x", t: 1 } } } } };
  const box = { innerHTML: "", querySelectorAll: () => [] }, ctx = { data: d, me: { name: "Gerben" }, players: players, npcs: {}, esc: s => String(s), db: null, base: "x" };
  PT.render(box, ctx); ["De onthulling", "(verschil)", "Eén zin om de ander te overtuigen", "Voorspraak", "Stap 3"].forEach(x => { if (!box.innerHTML.includes(x)) throw new Error("mist: " + x); });
  d.final = { runa: { slot: "reis", note: "Ze komt mee." } }; PT.render(box, ctx); ["Beraad afgerond", "Ze komt mee."].forEach(x => { if (!box.innerHTML.includes(x)) throw new Error("mist: " + x); });
});
console.log(pass + " geslaagd, " + fail + " mislukt"); process.exit(fail ? 1 : 0);
