#!/usr/bin/env node
/* Bouwt het voorstel voor de Realtime Database-regels van dnd/ (met structuurcontrole van world/*).
   Leest certamen/database.rules.json (de actuele, live regels), vervangt alleen het blok rules.dnd en schrijft
   certamen/database.rules.proposed.json (het VOLLEDIGE regelsbestand). Het bestaande bestand wordt niet aangeraakt;
   publiceren is een bewuste, losse actie (zie onderaan). Geen geheimen in dit bestand.
   Gebruik: node dnd/tools/build-dnd-rules.js
   Publiceren na akkoord: kopieer database.rules.proposed.json over database.rules.json en draai
   firebase deploy --only database --project kthulp-certamen (of plak in de Console), en draai daarna node dnd/tools/test-rules.js. */
"use strict";
const fs = require("fs"), path = require("path");
const dir = path.join(__dirname, "..", "..", "certamen");
const cur = JSON.parse(fs.readFileSync(path.join(dir, "database.rules.json"), "utf8"));
const A = cur.rules.dnd[".read"]; /* de bestaande allowlist-voorwaarde (Google-login + dndAccess), ongewijzigd hergebruikt */
const and = (...x) => x.filter(Boolean).map(s => "(" + s + ")").join(" && ");
const oneOf = (expr, list) => list.map(v => expr + " === '" + v + "'").join(" || ");
const num = (p, lo, hi) => "newData.child('" + p + "').isNumber() && newData.child('" + p + "').val() >= " + lo + " && newData.child('" + p + "').val() <= " + hi;
const date = "newData.hasChildren(['y','m','d']) && " + num("y", 3000, 3100) + " && " + num("m", 1, 12) + " && " + num("d", 1, 31);
const idOk = "newData.child('id').isString() && newData.child('id').val() === $id";
const W = {};

/* hoofdregels van world: één keer aanmaken (nieuw verhaal), daarna alleen via de onderdelen hieronder. Onbekende sleutels zijn verboden. */
W[".write"] = and(A, "!data.exists()");
W["$other"] = { ".validate": false };
W.calendar = { ".write": A, ".validate": date + " && newData.hasChildren(['y','m','d'])" };
W.sceneSince = { ".write": A, ".validate": date };
W.sceneRegion = { ".write": A, ".validate": "newData.isString() && newData.val().beginsWith('REG-') && newData.val().length <= 20" };
W.lastRound = { ".write": A, ".validate": "newData.isNumber() && newData.val() >= 0 && newData.val() <= 100000" };

/* registers: de browser mag records schrijven en (voor Terug) verwijderen; structuur en waardebereiken worden afgedwongen */
W.npcs = { "$id": { ".write": A, ".validate": and("newData.hasChildren(['id','name','status'])", idOk, "newData.child('name').isString() && newData.child('name').val().length <= 80",
  oneOf("newData.child('status').val()", ["ambient", "named", "recurring", "companion_candidate", "recruited", "inactive", "departed", "deceased"])) } };
W.quests = { "$id": { ".write": A, ".validate": and("newData.hasChildren(['id','title','status'])", idOk, "newData.child('title').isString()",
  oneOf("newData.child('status').val()", ["dormant", "available", "active", "completed", "failed", "expired", "changed"]),
  "!newData.child('stage').exists() || (" + num("stage", 0, 20) + ")") } };
W.clocks = { "$id": { ".write": A, ".validate": and("newData.hasChildren(['id','value'])", idOk, num("value", 0, 12),
  "!newData.child('max').exists() || (" + num("max", 1, 12) + ")", "newData.child('value').val() <= (newData.child('max').exists() ? newData.child('max').val() : 6)") } };
W.companions = { "$id": { ".write": A, ".validate": and("newData.hasChildren(['id','stage','hp'])", idOk,
  oneOf("newData.child('stage').val()", ["candidate", "active", "departed", "deceased"]),
  "newData.child('hp').hasChildren(['cur','max'])", num("hp/max", 1, 300), num("hp/cur", 0, 300), "newData.child('hp/cur').val() <= newData.child('hp/max').val()") } };
W.agendas = { "$id": { ".write": A, ".validate": and("newData.hasChildren(['id','owner','status','steps'])", idOk,
  oneOf("newData.child('status').val()", ["active", "paused", "completed", "thwarted", "cancelled"]), "!newData.child('stepIdx').exists() || (" + num("stepIdx", 0, 6) + ")") } };
W.backstories = { "$id": { ".write": A, ".validate": and("newData.hasChildren(['id','npc','layers'])", idOk) } };
W.events = { "$k": { ".write": A, ".validate": "newData.hasChildren(['type','summary']) && newData.child('type').isString() && newData.child('summary').isString() && newData.child('summary').val().length <= 1000" } };
W.divergences = { "$k": { ".write": A, ".validate": "newData.hasChildren(['summary'])" } };
/* jobs: de browser mag alleen nieuwe, wachtende jobs aanmaken; de runner (Firebase CLI) beheert de rest */
W.jobs = { "$id": { ".write": and(A, "!data.exists()"), ".validate": and("newData.hasChildren(['id','type','subject','status'])", idOk,
  oneOf("newData.child('type').val()", ["portrait", "profile", "statblock"]), "newData.child('status').val() === 'queued'", "!newData.child('attempts').exists() || (" + num("attempts", 0, 3) + ")") } };
/* alleen-lezen voor de browser (beheerd via de Firebase CLI): factions, locations, profiles */
W.factions = { "$id": { ".validate": "newData.hasChildren(['id','name'])" } };
W.locations = { "$id": { ".validate": "newData.hasChildren(['id','name','region'])" } };
W.profiles = { "$id": { ".validate": "newData.hasChildren(['text','status'])" } };

const camp = { ".write": and(A, "!newData.exists()") }; /* een heel verhaal verwijderen */
["canon", "state", "stands", "messages", "ooc", "log", "summaries", "memories", "dmnotes", "pending", "turn", "players", "scene", "usage"].forEach(k => { camp[k] = { ".write": A }; });
camp.world = W;

const dnd = { ".read": A };
["config", "npcs", "locations", "characters", "campaignIndex"].forEach(k => { dnd[k] = { ".write": A }; });
dnd.worldTemplate = {}; /* alleen via de Firebase CLI te wijzigen */
dnd.campaigns = { "$cid": camp };

const out = JSON.parse(JSON.stringify(cur)); out.rules.dnd = dnd;
fs.writeFileSync(path.join(dir, "database.rules.proposed.json"), JSON.stringify(out, null, 2) + "\n");
console.log("Geschreven: certamen/database.rules.proposed.json (" + JSON.stringify(out).length + " tekens); alleen rules.dnd is vervangen.");
