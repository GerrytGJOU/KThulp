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
eq("coc extra", G.extraSkills(coc, k).length, 2);
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

/* Avatar Legends (2d6 + stat) */
const av = RS.get("avatar"), a = G.blank(av, "Gerben");
a.name = "Mei"; a.stats = { Creativity: 1, Focus: 0, Harmony: 1, Passion: 2 };
const al = G.rollList(av, a), mv = k => al.find(r => r.key === "skill:" + k);
eq("av move bonus", mv("Assess a Situation").target, 1); eq("av move stat Passion", mv("Intimidate").target, 2);
eq("av strong hit", G.evaluate(av, a, mv("Assess a Situation"), { nat: 4, d2: 5, mod: 0 }).line, "Assess a Situation: 2d6(4,5)+1 = 10, strong hit");
eq("av weak hit", G.evaluate(av, a, mv("Trick"), { nat: 3, d2: 4, mod: 0 }).line, "Trick: 2d6(3,4)+1 = 8, weak hit");
eq("av miss met -2", G.evaluate(av, a, mv("Rely on Your Skills and Training"), { nat: 2, d2: 4, mod: -2 }).line, "Rely on Your Skills and Training: 2d6(2,4)-2 = 4, miss");
eq("av ongeldige dobbelsteen", G.evaluate(av, a, mv("Trick"), { nat: 7, d2: 2 }), null);
a.extra = "Rooted Stance | Focus"; eq("av extra move", G.rollList(av, a).find(r => r.key === "extra:0").target, 0);
eq("av extra move stat", G.extraSkills(av, a)[0].stat, "Focus");
eq("av meters", G.meterMax(av, a).fatigue, 5);
eq("av tekst", /Assess a Situation \+1/.test(G.sheetText(av, a)), true);
eq("av geen stat-dobbel", av.sheet.statDice, undefined);

/* Star Wars (dobbelpool) */
const sw = RS.get("sw"), s = G.blank(sw, "Maurits");
s.name = "Venn"; s.stats = { Brawn: 2, Agility: 3, Intellect: 2, Cunning: 3, Willpower: 2, Presence: 2 }; s.skills = { "Piloting (Space)": 2, Cool: 1 };
const sl = G.rollList(sw, s), ps = sl.find(r => r.key === "skill:Piloting (Space)");
eq("sw ch/rank", ps.ch + "/" + ps.rank, "3/2");
eq("sw worp succes", G.evaluate(sw, s, ps, { dif: 2, rsu: 2, rth: 1 }).line, "Piloting (Space): 2Y 1G 2P -> 2 Success, 1 Threat = Success");
eq("sw worp failure", G.evaluate(sw, s, ps, { dif: 2, rsu: 1, rfa: 3 }).line, "Piloting (Space): 2Y 1G 2P -> 2 Failure = Failure");
eq("sw triumph telt als success", G.evaluate(sw, s, ps, { dif: 1, rtr: 1 }).line, "Piloting (Space): 2Y 1G 1P -> 1 Success, 1 Triumph = Success");
eq("sw despair telt als failure", G.evaluate(sw, s, ps, { dif: 1, rsu: 1, rde: 1 }).j.label, "Failure");
eq("sw gelijk is mislukt", G.evaluate(sw, s, ps, { dif: 1, rsu: 1, rfa: 1 }).j.label, "Failure");
eq("sw lege invoer", G.evaluate(sw, s, ps, { dif: 2 }), null);
eq("sw challenge upgrade", G.evaluate(sw, s, ps, { dif: 3, chl: 1, rsu: 1 }).line, "Piloting (Space): 2Y 1G 2P 1R -> 1 Success = Success");
eq("sw boost en setback", G.evaluate(sw, s, ps, { dif: 2, bst: 1, sbk: 2, rsu: 1 }).line, "Piloting (Space): 2Y 1G 1B 2P 2K -> 1 Success = Success");
const st = sl.find(r => r.key === "stat:Cunning"); eq("sw characteristic-worp", G.evaluate(sw, s, st, { dif: 1, rsu: 1 }).line, "Cunning: 3G 1P -> 1 Success = Success");
eq("sw meters", G.meterMax(sw, s).wounds + "/" + G.meterMax(sw, s).strain, "12/12");
eq("sw skills", sw.sheet.skills.length, 35);
["G", "Y", "P", "R", "B", "K"].forEach((k, i) => eq("sw gezichten " + k, require("../dobbel.js").SW_FACES[k].length, [8, 12, 8, 12, 6, 6][i]));
eq("sw netto", JSON.stringify(require("../dobbel.js").swNet({ s: 1, f: 2, a: 3, t: 1, r: 1, d: 0 })), JSON.stringify({ success: false, ns: 0, na: 2, triumph: 1, despair: 0 }));
for (let i = 0; i < 200; i++) { const t = require("../dobbel.js").swRoll({ Y: 2, G: 1, P: 2, R: 1, B: 1, K: 1 }); if (t.s + t.r > 7 || t.f + t.d > 7) { bad++; console.log("FOUT: swRoll buiten bereik", t); break; } }
eq("sw tekst", /Piloting \(Space\) 2/.test(G.sheetText(sw, s)), true);

/* Old-School Essentials */
const os = RS.get("ose"), b = G.blank(os, "Gerben");
b.name = "Borin"; b.profession = "Fighter"; b.stats = { STR: 13, INT: 10, WIS: 10, DEX: 12, CON: 13, CHA: 10 }; b.nums = { ab: 0, ac: 4, aac: 15 };
const ol = G.rollList(os, b), ok2 = k => ol.find(r => r.key === k);
eq("ose melee bonus (STR 13 = +1)", ok2("atk:melee").target, 1); eq("ose missile bonus (DEX 12 = 0)", ok2("atk:missile").target, 0);
eq("ose attack-regel", G.evaluate(os, b, ok2("atk:melee"), { nat: 14, mod: 0 }).line, "Attack (melee): 14 +1 = 15");
eq("ose attack met situatiebonus", G.evaluate(os, b, ok2("atk:melee"), { nat: 14, mod: 2 }).line, "Attack (melee): 14 +3 = 17");
eq("ose save slaagt", G.evaluate(os, b, ok2("save:spells"), { nat: 16, mod: 0 }).line, "Save vs Spells/Rods/Staves: 16 vs 16 = Success");
eq("ose save mislukt", G.evaluate(os, b, ok2("save:death"), { nat: 11, mod: 0 }).j.label, "Failure");
eq("ose x-in-6", G.evaluate(os, b, ok2("skill:Open Doors"), { nat: 2 }).line, "Open Doors: 2 on 1d6 vs 2-in-6 = Success");
eq("ose x-in-6 mislukt", G.evaluate(os, b, ok2("skill:Open Doors"), { nat: 3 }).j.label, "Failure");
eq("ose d6 buiten bereik", G.evaluate(os, b, ok2("skill:Open Doors"), { nat: 7 }), null);
eq("ose ability check", G.evaluate(os, b, ok2("stat:STR"), { nat: 13 }).line, "STR check: 13 vs 13 = Success");
eq("ose ability check mislukt", G.evaluate(os, b, ok2("stat:STR"), { nat: 14 }).j.label, "Failure");
b.skills = { "Climb Sheer Surfaces": 87 }; eq("ose thief-skill", G.evaluate(os, b, G.rollList(os, b).find(r => r.key === "skill:Climb Sheer Surfaces"), { nat: 34 }).line, "Climb Sheer Surfaces: 34 vs 87 = Success");
eq("ose HP-max", G.meterMax(os, b).hp, 5);
eq("ose modifier-tabel", [3, 5, 8, 12, 15, 17, 18].map(os.sheet.mod).join(), "-3,-2,-1,0,1,2,3");
eq("ose tekst", /AC \(descending\) 4/.test(G.sheetText(os, b)) && /Climb Sheer Surfaces 87/.test(G.sheetText(os, b)), true);
eq("ose getal-default", G.rollList(os, G.blank(os)).find(r => r.key === "save:wands").target, 13);

console.log(ok + " geslaagd, " + bad + " mislukt");
process.exitCode = bad ? 1 : 0;
