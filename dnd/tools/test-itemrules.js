#!/usr/bin/env node
/* Test van voorwerpen met regels (ITEMRULES + invHtml in dnd/index.html) met een nepdocument: tekst- en objectvoorwerpen,
   klikbare vakken, kaart met regels en gebruiksteller. Gebruik: node dnd/tools/test-itemrules.js */
"use strict";
const fs = require("fs"), path = require("path");
const src = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
const a = src.indexOf("const ITEMRULES=("), b = src.indexOf("/* Features & Traits als overzicht");
if (a < 0 || b < 0) { console.log("MISLUKT: code niet gevonden"); process.exit(1); }
const code = src.slice(a, b);
let pass = 0, fail = 0;
const t = (n, f) => { try { f(); pass++; } catch (e) { fail++; console.log("MISLUKT: " + n + "\n  " + e.message); } };
const ok = (v, m) => { if (!v) throw new Error(m || "onwaar"); };
const mk = (inv, itemUse) => {
  const env = { inv, itemUse };
  const fn = new Function("env", "const window={};const slug=s=>String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'').slice(0,60)||'x';" +
    "const esc=s=>String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\"/g,'&quot;');" +
    "const sheetOpen={};const getState=()=>({pcs:{Wulfgrim:{inventory:env.inv}}});" +
    "function itemText(x){if(x==null)return '';if(typeof x!=='object')return String(x);return x.name||''}" + code + "return {invHtml,ITEMRULES};");
  return fn(env);
};
const raaf = { name: "Raafveer van Haleth", origin: "geschenk van Haleth", rules: "Eén keer per dag 10 minuten Speak with Animals als ritueel: een raaf kijkt iets na.", magic: true, uses: { per: "dag", max: 1 }, recharge: "nieuwe dag" };
const slijp = { name: "Slijpsteen van Erebor", rules: "10 minuten onderhoud bij een korte rust: eerste wapentreffer +1 schade.", magic: true };
const inv = ["Greataxe", "Backpack", slijp, raaf, "Ring van Hoop [magisch: geeft licht]", "Tinderbox (om vuur te maken in de regen of wind)", "25 GP"];
const c = { name: "Wulfgrim", equipment: "" };

t("isRich herkent objecten met regels, geen gewone strings", () => {
  const { ITEMRULES: I } = mk(inv);
  ok(I.isRich(raaf) && I.isRich(slijp) && !I.isRich("Greataxe") && !I.isRich({ name: "Zwaard" }));
});
t("object en tekst: gold uit objecten blijft werken, geen crash", () => {
  const { invHtml } = mk(inv); const h = invHtml(c);
  ok(/Raafveer van Haleth/.test(h) && /Slijpsteen van Erebor/.test(h) && /25 GP/.test(h), "namen en geld zichtbaar");
});
t("alle voorwerpen zijn klikbaar, ook oude en gewone", () => {
  const h = mk(inv).invHtml(c);
  ok(/data-item="raafveer_van_haleth"/.test(h) && /data-item="slijpsteen_van_erebor"/.test(h) && /data-item="ring_van_hoop"/.test(h), "klikbaar");
  ok(/data-item="greataxe"/.test(h) && /data-item="backpack"/.test(h), "gewone voorwerpen ook");
  ok(/data-item="tinderbox"/.test(h), "lange toelichting krijgt ook een kaart");
});
t("open kaart toont herkomst, regels en teller; tekstitem toont zijn toelichting", () => {
  const m = mk(inv); m.ITEMRULES.open = "raafveer_van_haleth"; let h = m.invHtml(c);
  ok(/class="itemcard mg"/.test(h) && /geschenk van Haleth/.test(h) && /Speak with Animals/.test(h) && /1 \/ 1 over/.test(h) && /nieuwe dag/.test(h));
  m.ITEMRULES.open = "ring_van_hoop"; h = m.invHtml(c); ok(/geeft licht/.test(h) && !/class="iuse"/.test(h));
});
t("gebruiksteller: itemUse telt mee en wordt begrensd", () => {
  const m = mk(inv); m.ITEMRULES.open = "raafveer_van_haleth";
  let h = m.invHtml({ ...c, itemUse: { raafveer_van_haleth: 1 } }); ok(/0 \/ 1 over/.test(h) && /data-itemreset/.test(h) && /pip x/.test(h));
  h = m.invHtml({ ...c, itemUse: { raafveer_van_haleth: 9 } }); ok(/0 \/ 1 over/.test(h), "begrensd op max");
  ok(m.ITEMRULES.usedOf({ itemUse: { x: -3 } }, { name: "x", uses: { max: 2 } }) === 0);
});
t("hostile tekst wordt ge-escaped", () => {
  const m = mk([{ name: "Boom<img>", rules: "<script>x</script>", magic: true }]); m.ITEMRULES.open = "boom_img"; const h = m.invHtml(c);
  ok(!/<script>/.test(h) && /&lt;script&gt;/.test(h));
});
t("lange toelichting staat niet in het vak, wel in de pop-up; ook een korte niet", () => {
  const m = mk(["Aldrics ring (erfstuk, geen magie; anker tegen de woede)", "Longsword (oud)"]); let h = m.invHtml(c);
  ok(/data-item="aldrics_ring"/.test(h) && !/anker tegen de woede/.test(h) && !h.includes("<em>(oud)</em>"));
  m.ITEMRULES.open = "aldrics_ring"; ok(/anker tegen de woede/.test(m.invHtml(c)));
});
t("standaardregels: wapen, pakonderdeel, Healer's Kit met teller, onbekend voorwerp", () => {
  const m = mk(["4 Handaxes", "Explorer's Pack (Backpack, 10 Torches)", "Healer's Kit", "Vreemd ding"]);
  const open = k => { m.ITEMRULES.open = k; return m.invHtml({ ...c, itemUse: { healer_s_kit: 3 } }); };
  ok(/1d6 slashing/.test(open("4_handaxes")) && /Vex:/.test(open("4_handaxes")));
  ok(/Brandt 1 uur/.test(open("10_torches")) && /Explorer/.test(open("10_torches")));
  ok(open("healer_s_kit").includes("7 / 10 over"));
  ok(/Geen bijzondere regels/.test(open("vreemd_ding")));
});
t("uitgerust: alleen die wapens in de vakken, en een bijzonder wapen vervangt zijn basisaanval", () => {
  const hew = { name: "Blackhewer", rules: "Greataxe +1", magic: true, weapon: { base: "Greataxe", bonus: 1 } };
  const lijst = ["4 Handaxes", "Spear", "Shortbow", hew, "Dwarf-werpbijl"];
  const env = { inv: lijst, itemUse: null };
  const fn = new Function("env", "const window={};const slug=s=>String(s).toLowerCase().replace(/[^a-z0-9]+/g,'_');const esc=s=>String(s==null?'':s);const sheetOpen={};" +
    "const getState=()=>({pcs:{Wulfgrim:{inventory:env.inv,equipped:env.eq}}});function itemText(x){return x==null?'':typeof x!=='object'?String(x):x.name||''}" + code + "return {invHtml,attacksOf};");
  const m = fn(env), k = { ...c, attacks: [{ name: "Greataxe", ability: "str", damage: "1d12+3 slashing (Rage: 1d12+5)" }, { name: "Spear", damage: "1d6+3 piercing" }] };
  ok(m.attacksOf(k)[0].name === "Greataxe", "zonder lijst verandert er niets");
  env.eq = ["Blackhewer", "Dwarf-werpbijl", "Shortbow"];
  const h = m.invHtml(k), vak = h.split('class="invbag"')[0], tas = h.split('class="invbag"')[1];
  ok(vak.indexOf("Blackhewer") < vak.indexOf("Dwarf-werpbijl") && vak.includes("Blackhewer") && vak.includes("Shortbow"), "uitgerust in de vakken, hoofdwapen eerst");
  ok(!vak.includes("Spear") && tas.includes("Spear") && tas.includes("Handaxes"), "de rest in de tas");
  const a = m.attacksOf(k)[0];
  ok(a.name === "Blackhewer" && a.extra === 1 && a.damage === "1d12+4 slashing (Rage: 1d12+6)", JSON.stringify(a));
  ok(m.attacksOf(k).length === 2 && k.attacks[0].name === "Greataxe", "blad zelf ongewijzigd");
});
t("Great Weapon Master en Sharpshooter tellen mee in de schade", () => {
  const cut = (x, y) => src.slice(src.indexOf(x), src.indexOf(y, src.indexOf(x)));
  const m = new Function("const pbOf=c=>2,amod=(c,k)=>4,attacksOf=c=>c.attacks;" + cut("const CC_W=[", "/* naam, regex op de itemregel") +
    cut("function weaponOf(a)", "function dmgRowHtml") + "return {dmgInfo,dmgText,weaponOf};")();
  const w = { features: "Feat (level 4): Great Weapon Master (+1 Strength)", rageSkills: [], attacks: [
    { name: "Blackhewer", base: "Greataxe", ability: "str", damage: "1d12+5 slashing (Rage: 1d12+7)", notes: "Heavy; mastery Cleave" }, { name: "Handaxe", damage: "1d6+4 slashing" }, { name: "Unarmed Strike", damage: "5 bludgeoning" }] };
  const g = (k, cl, hw) => m.dmgInfo(w, "atk:" + k, true, cl, hw);
  ok(g(0).mod === 9 && g(0).gwm === 2 && g(0).canHew, "Heavy: +PB bovenop Rage");
  ok(g(0, true).mod === 5, "Cleave: geen ability modifier, wel Rage en GWM");
  ok(g(0, false, true).mod === 7 && !g(0, false, true).gwm, "Hew: zonder Heavy-bonus");
  ok(!g(1).gwm && g(1).canHew && !g(2).canHew, "Handaxe niet Heavy; Unarmed geen wapen");
  ok(/incl\. Great Weapon Master \+2/.test(m.dmgText(g(0), "7", "").text));
  const th = { features: "Feat (level 4): Sharpshooter (+1 Dexterity)", attacks: [{ name: "Shortbow", ability: "dex", damage: "1d6+4 piercing" }, { name: "Elven Shortsword", damage: "1d6+4 piercing" }] };
  ok(m.dmgInfo(th, "atk:0").sharp && !m.dmgInfo(th, "atk:1").sharp && !m.dmgInfo(th, "atk:0").gwm);
});
console.log(pass + " geslaagd, " + fail + " mislukt"); process.exit(fail ? 1 : 0);
