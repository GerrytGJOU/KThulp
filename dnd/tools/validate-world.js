#!/usr/bin/env node
/* Controleert het wereldregister van een verhaal op tegenstrijdigheden en dode verwijzingen.
   Gebruik: node dnd/tools/validate-world.js <cid>   (leest via de Firebase CLI; schrijft niets) */
"use strict";
const { spawnSync } = require("child_process");
const World = require("../world.js");
const cid = process.argv[2];
if (!cid) { console.log("Gebruik: validate-world.js <cid>"); process.exit(2); }
const r = spawnSync("firebase database:get /dnd/campaigns/" + cid + "/world --project kthulp-certamen", { shell: true, encoding: "utf8", maxBuffer: 1 << 28, env: Object.assign({}, process.env, { MSYS_NO_PATHCONV: "1" }) });
if (r.status !== 0) { console.error("Lezen mislukt:", (r.stderr || r.stdout).slice(0, 300)); process.exit(2); }
const world = JSON.parse(r.stdout);
const issues = World.auditWorld(world);
const n = k => Object.keys(world[k] || {}).length;
console.log("Wereld " + cid + ": " + n("npcs") + " NPC's, " + n("quests") + " quests, " + n("clocks") + " klokken, " + n("factions") + " facties, " + n("events") + " events");
issues.forEach(i => console.log("[" + i.level + "] " + i.kind + " " + i.id + ": " + i.msg));
const errs = issues.filter(i => i.level === "fout").length;
console.log(errs + " fout(en), " + (issues.length - errs) + " opmerking(en)");
process.exit(errs ? 1 : 0);
