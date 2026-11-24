/* Test van dnd/dobbel.js: node dnd/tools/test-dobbel.js */
"use strict";
const D = require("../dobbel.js");
let ok = 0, bad = 0;
const t = (n, c) => { if (c) ok++; else { bad++; console.log("FOUT:", n); } };
const eq = (n, a, b) => t(n + " (" + a + " ≠ " + b + ")", a === b);

/* expressies */
const seq = a => { let i = 0; return () => a[i++ % a.length]; };
eq("3d6+2", D.roll("3d6+2", seq([1, 2, 3])).total, 8);
eq("d%", D.roll("d%", seq([57])).total, 57);
eq("4", D.roll("4").total, 4);
eq("ongeldig", D.roll("kaas"), null);
eq("te veel", D.roll("500d6"), null);
for (let i = 0; i < 200; i++) { const r = D.roll("1d100"); if (r.total < 1 || r.total > 100) { t("bereik d100", false); break; } }
eq("d100 00+0", D.d100(seq([1, 1])), 100);
eq("d100 34", D.d100(seq([4, 5])), 34);

/* CoC niveaus (skill 55: hard 27, extreme 11) */
const c = (tg, r) => D.judgeCoc(tg, r).label;
eq("coc 01", c(55, 1), "Critical Success");
eq("coc 11 extreme", c(55, 11), "Extreme Success");
eq("coc 12 hard", c(55, 12), "Hard Success");
eq("coc 27 hard", c(55, 27), "Hard Success");
eq("coc 28 regular", c(55, 28), "Regular Success");
eq("coc 55 regular", c(55, 55), "Regular Success");
eq("coc 56 fail", c(55, 56), "Failure");
eq("coc 96 skill 55 fail", c(55, 96), "Failure");
eq("coc 96 skill 40 fumble", c(40, 96), "Fumble");
eq("coc 100 fumble", c(95, 100), "Fumble");
eq("coc 05 skill 25 extreme", c(25, 5), "Extreme Success");
eq("coc 01 skill 0 crit", c(0, 1), "Critical Success");

/* bonus/penalty: basis 34, extra tiental 2 → bonus 24, penalty 34; extra 5 → penalty 54 */
eq("bonus", D.cocTens(34, [2], "bonus"), 24);
eq("bonus houdt basis", D.cocTens(34, [8], "bonus"), 34);
eq("penalty", D.cocTens(34, [5], "penalty"), 54);
eq("penalty twee", D.cocTens(34, [5, 9], "penalty"), 94);
eq("bonus op 100 geeft 30", D.cocTens(100, [3], "bonus"), 30);
eq("bonus 00-tiental met 5", D.cocTens(5, [0], "bonus"), 5);
eq("bonus 10 met extra 0 blijft 10", D.cocTens(10, [0], "bonus"), 10);

/* Delta Green (skill 50) */
const d = (tg, r) => D.judgeDg(tg, r).label;
eq("dg 34", d(50, 34), "Success");
eq("dg 71", d(50, 71), "Failure");
eq("dg 01", d(50, 1), "Critical Success");
eq("dg 22 succes = crit", d(50, 22), "Critical Success");
eq("dg 55 mislukte double = fumble", d(50, 55), "Fumble");
eq("dg 100", d(99, 100), "Fumble");
eq("dg 01 bij skill 0", d(0, 1), "Critical Success");
eq("dg 99 skill 99 geslaagde double", d(99, 99), "Critical Success");
eq("dg tegenstelling crit wint", D.dgOpposed(D.judgeDg(50, 22), D.judgeDg(70, 60)), 1);
eq("dg tegenstelling hoogste", D.dgOpposed(D.judgeDg(50, 30), D.judgeDg(70, 60)), -1);
eq("dg tegenstelling beide mis", D.dgOpposed(D.judgeDg(50, 80), D.judgeDg(50, 90)), 0);

/* tekst */
eq("regel coc", D.rollLine("coc", "Spot Hidden", D.judgeCoc(55, 34)), "Spot Hidden: 34 vs 55 = Regular Success");
eq("regel dg", D.rollLine("dg", "Alertness", D.judgeDg(70, 34), { mod: 20 }), "Alertness: 34 vs 70 (+20) = Success");
eq("regel dg zonder mod", D.rollLine("dg", "Search", D.judgeDg(60, 71)), "Search: 71 vs 60 = Failure");
t("regel bonus", /bonus-tientallen 2/.test(D.rollLine("coc", "Stealth", D.judgeCoc(50, 24), { extra: [2], mode: "bonus" })));

/* formules */
eq("hp dg", D.calc("ceil((STR+CON)/2)", { STR: 12, CON: 13 }), 13);
eq("hp coc", D.calc("floor((CON+SIZ)/10)", { CON: 55, SIZ: 50 }), 10);
eq("onveilig", D.calc("process.exit()", { A: 1 }), null);
eq("leeg", D.calc("A×5", { A: 12 }), 60);

console.log(ok + " geslaagd, " + bad + " mislukt");
process.exitCode = bad ? 1 : 0;
