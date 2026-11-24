/* Test van dnd/gensheet.js en de d100-regelsets: node dnd/tools/test-gensheet.js */
"use strict";
require("../settings-all.js");
const RS = require("../settings-rulesets.js"), G = require("../gensheet.js");
let ok = 0, bad = 0;
const eq = (n, a, b) => { if (a === b) ok++; else { bad++; console.log("FOUT:", n, "→", JSON.stringify(a), "≠", JSON.stringify(b)); } };

/* Delta Green */
const dg = RS.get("dg"), c = G.blank(dg, "Gerben");
c.name = "Eva Reed"; c.profession = "Federal Agent"; c.stats = { STR: 12, CON: 13, DEX: 13, INT: 13, POW: 12, CHA: 10 };
c.skills = { Firearms: 50, Alertness: 50, Search: 60 }; c.lists.bonds = [{ name: "Partner", score: 10 }];
const mm = G.meterMax(dg, c);
eq("dg hp", mm.hp, 13); eq("dg wp", mm.wp, 12); eq("dg san max", mm.san, 99);
const dv = G.derived(dg, c); eq("dg bp", dv.find(d => d.k === "bp").val, 48); eq("dg dmg", dv.find(d => d.k === "dmg").val, "+0");
eq("dg skill base", G.skillVal(dg, c, dg.sheet.skills.find(s => s.k === "Stealth")), 10);
const rl = G.rollList(dg, c);
eq("dg stat×5", rl.find(r => r.key === "stat:STR").target, 60);
eq("dg skill", rl.find(r => r.key === "skill:Firearms").target, 50);
const e1 = G.evaluate(dg, c, rl.find(r => r.key === "skill:Alertness"), { nat: 34, mod: 0 });
eq("dg worp", e1.line, "Alertness: 34 vs 50 = Success");
const e2 = G.evaluate(dg, c, rl.find(r => r.key === "skill:Alertness"), { nat: 34, mod: 20 });
eq("dg worp +20", e2.line, "Alertness: 34 vs 70 (+20) = Success");
eq("dg ongeldig", G.evaluate(dg, c, rl[0], { nat: 0 }), null);
eq("dg 22 crit", G.evaluate(dg, c, rl.find(r => r.key === "skill:Search"), { nat: 22 }).j.label, "Critical Success");
eq("dg check POW×5", G.matchCheck(dg, c, "POW×5, omdat hij gebeld wordt"), "stat:POW");
eq("dg check Alertness", G.matchCheck(dg, c, "Alertness, om de schaduw te zien"), "skill:Alertness");
eq("dg Firearms niet Fire", G.matchCheck(dg, c, "Firearms"), "skill:Firearms");
const tx = G.sheetText(dg, c); eq("dg tekst bonds", /Bonds: Partner 10/.test(tx), true); eq("dg tekst skill", /Firearms 50/.test(tx), true);

/* Call of Cthulhu */
const coc = RS.get("coc"), k = G.blank(coc, "Maurits");
k.name = "Clara"; k.stats = { STR: 45, CON: 55, SIZ: 50, DEX: 65, APP: 60, INT: 75, POW: 60, EDU: 70 }; k.skills = { "Spot Hidden": 55 };
const cm = G.meterMax(coc, k);
eq("coc hp", cm.hp, 10); eq("coc mp", cm.mp, 12); eq("coc san", cm.san, 99);
const cd = G.derived(coc, k); eq("coc build", cd.find(d => d.k === "build").val, "0"); eq("coc db", cd.find(d => d.k === "db").val, "0"); eq("coc mov", cd.find(d => d.k === "mov").val, 8);
eq("coc dodge basis DEX/2", G.skillVal(coc, k, coc.sheet.skills.find(s => s.k === "Dodge")), 32);
eq("coc taal basis EDU", G.skillVal(coc, k, coc.sheet.skills.find(s => s.k === "Language (Own)")), 70);
const cr = G.rollList(coc, k);
eq("coc stat 1:1", cr.find(r => r.key === "stat:POW").target, 60);
eq("coc worp", G.evaluate(coc, k, cr.find(r => r.key === "skill:Spot Hidden"), { nat: 34 }).line, "Spot Hidden: 34 vs 55 = Regular Success");
const eb = G.evaluate(coc, k, cr.find(r => r.key === "skill:Spot Hidden"), { nat: 34, mode: "bonus", ext: "1" });
eq("coc bonus 14", eb.roll, 14); eq("coc bonus niveau", eb.j.label, "Hard Success");
eq("coc bonus zonder tiental", G.evaluate(coc, k, cr[0], { nat: 34, mode: "bonus", ext: "" }), null);
k.extra = "Science (Pharmacy) | 40\nLanguage (Latin) | 30";
eq("coc extra", G.extraSkills(k).length, 2);
eq("coc extra roll", G.rollList(coc, k).find(r => r.key === "extra:1").target, 30);
eq("coc boven basis telt extra", G.aboveBase(coc, k) >= 70, true);
eq("coc luck rolbaar", cr.some(r => r.key === "luck"), true);

/* Dark Ages: geen moderne skills */
const cda = RS.get("cda");
eq("cda geen Firearms", cda.sheet.skills.some(s => /Firearms|Drive Auto|Electrical/.test(s.k)), false);
eq("cda Status", cda.sheet.skills.some(s => s.k === "Status"), true);
eq("cda eigen taal", cda.sheet.skills.filter(s => s.k === "Language (Own)").length, 1);

/* alle regelsets hebben de promptvelden die systemPrompt gebruikt */
["name", "terms", "role", "guide", "dice", "pcStats", "lootPower", "rollEx", "crit", "playerRolls", "passive", "preDice"].forEach(f => RS.list().forEach(r => { if (RS.get(r.id)[f] == null) { bad++; console.log("FOUT: ruleset", r.id, "mist", f); } }));
/* stats rollen binnen bereik */
for (let i = 0; i < 100; i++) { const s = G.rollStats(coc, G.blank(coc)); if (s.STR < 15 || s.STR > 90 || s.SIZ < 40 || s.SIZ > 90) { bad++; console.log("FOUT: coc stat buiten bereik", s); break; } const d = G.rollStats(dg, G.blank(dg)); if (d.STR < 3 || d.STR > 18) { bad++; console.log("FOUT: dg stat buiten bereik", d); break; } }

console.log(ok + " geslaagd, " + bad + " mislukt");
process.exitCode = bad ? 1 : 0;
