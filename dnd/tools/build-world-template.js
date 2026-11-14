/* Bouwt het wereldsjabloon voor "Nieuw verhaal" uit een bestaand, nog onaangeroerd verhaal.
   Gebruik: node dnd/tools/build-world-template.js <dnd-dump.json> <cid> <uitvoer.json>
   (dump = `firebase database:get /dnd`). Schrijft padsleutels onder worldTemplate/, nooit een geneste container.
   Weigert als het register fouten heeft of al gespeeld lijkt (events/divergences). Past nooit iets aan in de bron. */
const fs = require("fs"), World = require("../world.js");
const [dump, cid, out] = process.argv.slice(2);
if (!dump || !cid || !out) { console.error("Gebruik: build-world-template.js <dump.json> <cid> <uit.json>"); process.exit(2); }
const c = JSON.parse(fs.readFileSync(dump, "utf8")).campaigns[cid];
if (!c || !c.world) { console.error("Verhaal of wereldregister niet gevonden"); process.exit(1); }
const w = JSON.parse(JSON.stringify(c.world));
Object.keys(w.events || {}).forEach(k => { if (/^job_/.test(w.events[k].type)) delete w.events[k]; }); delete w.jobs; delete w.profiles;
if (w.events && Object.keys(w.events).length || w.divergences && Object.keys(w.divergences).length) { console.error("Bron is al gespeeld (events/divergences); kies een onaangeroerd verhaal"); process.exit(1); }
delete w.events; delete w.divergences;
w.sceneRegion = "REG-RIVENDELL"; w.sceneSince = JSON.parse(JSON.stringify(w.calendar)); delete w.lastRound;
const a = World.auditWorld(w);
const errs = a.map(x => typeof x === "string" ? x : JSON.stringify(x));
if (errs.length) { console.error("Audit faalt:\n" + errs.join("\n")); process.exit(1); }
const open = Object.values(w.quests || {}).filter(q => ["active", "completed", "failed", "expired", "changed"].indexOf(q.status) >= 0 && q.id !== "MAIN-A1");
const up = { "worldTemplate/world": w, "worldTemplate/dmnotes": c.dmnotes || {}, "worldTemplate/meta": { version: 1, built: Date.now(), from: cid, label: "Proloog in Rivendell, 24 oktober 3018" } };
fs.writeFileSync(out, JSON.stringify(up));
console.log("sjabloon:", Object.keys(w.npcs || {}).length, "NPC's,", Object.keys(w.quests || {}).length, "quests,", Object.keys(w.clocks || {}).length, "klokken; dmnotes", Object.keys(c.dmnotes || {}).length, "; afwijkende quests:", open.length);
