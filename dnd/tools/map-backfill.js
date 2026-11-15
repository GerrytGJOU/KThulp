#!/usr/bin/env node
/* Vult de Kaart (campaigns/<cid>/map) voor een bestaand verhaal op uit wat al gespeeld is: de huidige locatie (Stand), de laatste
   scene en alle locatiekaarten uit de berichten. Veilig om opnieuw te draaien (bezoeken tellen alleen bij een wisseling van plaats).
   Gebruik: node dnd/tools/map-backfill.js <cid>   Geen geheimen in dit bestand. */
"use strict";
const { spawnSync } = require("child_process");
const fs = require("fs"), os = require("os"), path = require("path");
const M = require("../map-data.js");
const cid = process.argv[2]; if (!cid) { console.error("Geef een verhaal-id"); process.exit(2); }
const fb = a => { const r = spawnSync("firebase " + a + " --project kthulp-certamen", { shell: true, encoding: "utf8", maxBuffer: 1 << 28, env: { ...process.env, MSYS_NO_PATHCONV: "1" } }); if (r.status !== 0) throw new Error((r.stderr || r.stdout).slice(0, 300)); return r.stdout; };
const get = p => { const o = fb("database:get \"" + p + "\"").trim(); return !o || o === "null" ? null : JSON.parse(o); };
const slug = s => String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "").slice(0, 60) || "x";
const base = "/dnd/campaigns/" + cid + "/";
const world = get(base + "world"), stateStr = get(base + "state"), msgs = get(base + "messages") || {}, scene = get(base + "scene");
const state = JSON.parse(typeof stateStr === "string" ? stateStr : "{}"), cal = world && world.calendar ? { y: world.calendar.y, m: world.calendar.m, d: world.calendar.d } : null;
const seq = [];
Object.values(msgs).sort((a, b) => (a.t || 0) - (b.t || 0)).forEach(m => { if (m.newLoc) seq.push({ slug: m.newLoc, name: null }); });
const locs = get("/dnd/locations") || {};
seq.forEach(s => { s.name = locs[s.slug] && locs[s.slug].name; });
seq.push({ slug: scene || null, name: (state.inGame && state.inGame.location) || (scene && locs[scene] && locs[scene].name) || null, last: true });
let map = get(base + "map"), n = 0; const up = {};
seq.forEach((s, i) => {
  const pl = M.determinePlace({ locName: s.name, sceneText: s.last ? (state.inGame && state.inGame.location) : null, region: world && world.sceneRegion });
  if (!pl) return;
  const v = M.planVisit(map, pl, cal, s.slug, Date.now() + i); if (!Object.keys(v.set).length) return;
  Object.keys(v.set).forEach(p => { up[base.replace("/dnd/", "") + p] = v.set[p]; });
  const m2 = JSON.parse(JSON.stringify(map || {})); Object.keys(v.set).forEach(p => { const k = p.replace(/^map\//, "").split("/"); let c = m2; k.slice(0, -1).forEach(x => { c[x] = c[x] || {}; c = c[x]; }); c[k[k.length - 1]] = v.set[p]; }); map = m2; n++;
});
if (!n) { console.log("Niets om op te vullen."); process.exit(0); }
const f = path.join(os.tmpdir(), "map-backfill.json"); fs.writeFileSync(f, JSON.stringify(up));
fb("database:update /dnd \"" + f + "\" --force"); fs.unlinkSync(f);
console.log("Kaart opgevuld: " + Object.keys(map.visited || {}).join(", ") + " (huidige plaats: " + (map.current && map.current.id) + ")");
