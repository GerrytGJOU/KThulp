/* Test van tools/statblock.js: node dnd/tools/test-statblock.js */
"use strict";
const SB = require("./statblock.js"), RS = SB.Rulesets;
let ok = 0, bad = 0;
const eq = (n, a, b) => { if (a === b) ok++; else { bad++; console.log("FOUT:", n, "→", JSON.stringify(a), "≠", JSON.stringify(b)); } };
const TXT = "x".repeat(220), has = (V, frag) => V.er.join("|").indexOf(frag) >= 0;

/* D&D 2024: ongewijzigd */
const dnd = RS.get("dnd2024");
let V = SB.validate({ hp: 33, ac: 16, resources: { "Second Wind": { max: 1, rest: "short" } }, text: TXT }, dnd);
eq("dnd geldig", V.er.length, 0); eq("dnd resource", JSON.stringify(V.resources), JSON.stringify({ "Second Wind": { cur: 1, max: 1, rest: "short" } }));
eq("dnd record", JSON.stringify(SB.record("CMP-1", V, "j1")), JSON.stringify({ id: "CMP-1", stage: "candidate", hp: { cur: 33, max: 33 }, resources: V.resources, conditions: [], evidence: [], sheetStatus: "proposed", source: "job j1", ac: 16 }));
eq("dnd hp te laag", has(SB.validate({ hp: 3, ac: 16, text: TXT }, dnd), "hp moet"), true);
eq("dnd ac te hoog", has(SB.validate({ hp: 30, ac: 30, text: TXT }, dnd), "ac moet"), true);
eq("dnd wizard", has(SB.validate({ hp: 30, ac: 12, text: TXT + " Wizard" }, dnd), "low-magic"), true);
eq("dnd hulpbron rest", has(SB.validate({ hp: 30, ac: 12, resources: { x: { max: 1, rest: "none" } }, text: TXT }, dnd), "hulpbron"), true);
eq("dnd geen instructies-override", SB.instructions("c1", dnd), null);

/* Delta Green */
const dg = RS.get("dg");
V = SB.validate({ hp: 12, resources: { wp: { max: 12 }, san: { max: 60 } }, text: TXT }, dg);
eq("dg geldig", V.er.length, 0); eq("dg san herstelt niet", V.resources.san.rest, "none"); eq("dg wp rust long", V.resources.wp.rest, "long");
eq("dg ac niet toegestaan", has(SB.validate({ hp: 12, ac: 12, resources: { wp: { max: 12 }, san: { max: 60 } }, text: TXT }, dg), "geen AC"), true);
eq("dg verplichte san", has(SB.validate({ hp: 12, resources: { wp: { max: 12 } }, text: TXT }, dg), "verplichte meter ontbreekt: san"), true);
eq("dg onbekende meter", has(SB.validate({ hp: 12, resources: { wp: { max: 12 }, san: { max: 60 }, mana: { max: 5 } }, text: TXT }, dg), "onbekende meter mana"), true);

/* Call of Cthulhu / Dark Ages */
V = SB.validate({ hp: 10, resources: { san: { max: 55 }, mp: { max: 11 }, luck: { max: 50 } }, text: TXT }, RS.get("coc")); eq("coc geldig", V.er.length, 0);
eq("cda instructies noemen middeleeuws", /vuurwapens/.test(SB.instructions("c1", RS.get("cda"))), true);

/* Old-School Essentials */
V = SB.validate({ hp: 7, ac: 4, text: TXT }, RS.get("ose")); eq("ose geldig", V.er.length, 0); eq("ose ac descending", V.ac, 4);
eq("ose ascending-AC mag ook", SB.validate({ hp: 7, ac: 15, text: TXT }, RS.get("ose")).er.length, 0);

/* Avatar Legends: geen HP, geen AC */
const av = RS.get("avatar");
V = SB.validate({ resources: { fatigue: { max: 4 } }, text: TXT }, av); eq("avatar geldig", V.er.length, 0); eq("avatar noHp", V.noHp, true);
eq("avatar fatigue is teller", V.resources.fatigue.cur === 0 && V.resources.fatigue.zero === true, true);
eq("avatar hp geweigerd", has(SB.validate({ hp: 10, text: TXT }, av), "geen HP"), true);
const rec = SB.record("CMP-9", V, "j2"); eq("avatar record noHp", rec.noHp === true && rec.hp.max === 0 && rec.ac === undefined, true);
eq("avatar samenvatting", SB.summary(V), "fatigue 4");

/* Star Wars */
const sw = RS.get("sw");
V = SB.validate({ resources: { wounds: { max: 12 }, strain: { max: 11 } }, text: TXT }, sw); eq("sw geldig", V.er.length, 0); eq("sw wounds rest none", V.resources.wounds.rest, "none"); eq("sw strain rest short", V.resources.strain.rest, "short");
eq("sw wounds verplicht", has(SB.validate({ resources: { strain: { max: 11 } }, text: TXT }, sw), "verplichte meter ontbreekt: wounds"), true);
eq("sw wounds buiten bereik", has(SB.validate({ resources: { wounds: { max: 99 } }, text: TXT }, sw), "meter wounds"), true);
eq("sw tekst te kort", has(SB.validate({ resources: { wounds: { max: 12 } }, text: "kort" }, sw), "te kort"), true);
eq("sw instructies zonder hp", /laat hp weg/.test(SB.instructions("c1", sw)), true);
eq("sw instructies met cid", /context c1 /.test(SB.instructions("c1", sw)), true);

/* elke niet-D&D-regelset heeft een statblock-definitie */
["dg", "coc", "cda", "ose", "avatar", "sw", "ww"].forEach(id => eq("companion-definitie " + id, !!RS.get(id).companion, true));
console.log(ok + " geslaagd, " + bad + " mislukt");
process.exitCode = bad ? 1 : 0;
