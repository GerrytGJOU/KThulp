#!/usr/bin/env node
/* Spelers beheren voor de D&D-app (dnd/): wie mag inloggen en wie op de spelerslijst staat. Alleen voor de beheerder (Firebase CLI, project kthulp-certamen).
   De browser kan nooit zelf toegang geven: een speler vraagt in de app "Speler toevoegen" aan (dnd/playerRequests/{e-mailsleutel}) en de beheerder keurt hier goed.
   Gebruik:
     node dnd/tools/speler.js list                      toont wie toegang heeft, de spelerslijst en openstaande aanvragen
     node dnd/tools/speler.js apply [e-mail]            keurt alle (of één) aanvragen goed: toegang + spelerslijst, daarna verdwijnt de aanvraag
     node dnd/tools/speler.js add <e-mail> <naam>       geeft direct toegang en zet de naam op de spelerslijst
     node dnd/tools/speler.js remove <e-mail>           trekt de toegang in (de naam blijft op de lijst staan tot je hem uit de app haalt)
   Schrijft alleen losse bladen (dndAccessEmail/{sleutel}, dnd/config/players, dnd/playerRequests/{sleutel}); nooit een geneste container. Geen geheimen in dit bestand. */
"use strict";
const { spawnSync } = require("child_process");
const fs = require("fs"), os = require("os"), path = require("path");
const PROJECT = "kthulp-certamen";

function fb(args) {
  const r = spawnSync("firebase " + args + " --project " + PROJECT, { shell: true, encoding: "utf8", maxBuffer: 1 << 26, env: { ...process.env, MSYS_NO_PATHCONV: "1" } });
  if (r.status !== 0) throw new Error("firebase " + args.split(" ")[0] + " faalde: " + (r.stderr || r.stdout || "").trim().slice(0, 300));
  return r.stdout;
}
const get = p => { const o = fb("database:get \"" + p + "\"").trim(); return !o || o === "null" ? null : JSON.parse(o); };
function setLeaf(p, value) {
  const tmp = path.join(os.tmpdir(), "dnd-speler-" + Date.now() + ".json");
  fs.writeFileSync(tmp, JSON.stringify(value));
  try { fb("database:set \"" + p + "\" \"" + tmp + "\" --force"); } finally { fs.unlinkSync(tmp); }
}
const remove = p => fb("database:remove \"" + p + "\" --force");
/* zelfde sleutel als de app: kleine letters, punten worden komma's */
const keyOf = e => String(e).trim().toLowerCase().replace(/\./g, ",");
const okMail = e => /^[^\s@#$\[\]\/]+@[^\s@#$\[\]\/]+\.[^\s@#$\[\]\/]+$/.test(e);
const okName = n => typeof n === "string" && n.trim().length >= 1 && n.trim().length <= 40 && !/[\/<>]/.test(n);

function addPlayer(email, name) {
  email = String(email).trim().toLowerCase(); name = String(name).trim();
  if (!okMail(email)) throw new Error("Ongeldig e-mailadres: " + email);
  if (!okName(name)) throw new Error("Ongeldige naam (1 tot 40 tekens, geen / < >): " + name);
  const players = get("/dnd/config/players");
  const list = Array.isArray(players) ? players.slice() : [];
  const existing = get("/dndAccessEmail/" + keyOf(email));
  setLeaf("/dndAccessEmail/" + keyOf(email), name);
  if (!list.some(x => String(x).toLowerCase() === name.toLowerCase())) { list.push(name); setLeaf("/dnd/config/players", list); }
  console.log((existing ? "Toegang bijgewerkt: " : "Toegang gegeven: ") + name + " (" + email + ")" + (existing && existing !== name ? " (was: " + existing + ")" : ""));
}

const [cmd, a1, a2] = process.argv.slice(2);
try {
  if (cmd === "list") {
    const acc = get("/dndAccessEmail") || {}, req = get("/dnd/playerRequests") || {}, pl = get("/dnd/config/players");
    console.log("Toegang via e-mail (" + Object.keys(acc).length + "):");
    Object.entries(acc).forEach(([k, n]) => console.log("  " + n + "  <" + k.replace(/,/g, ".") + ">"));
    console.log("Spelerslijst:", Array.isArray(pl) ? pl.join(", ") : "(leeg)");
    const rq = Object.entries(req);
    console.log("Openstaande aanvragen (" + rq.length + "):");
    rq.forEach(([k, v]) => console.log("  " + (v && v.name) + "  <" + (v && v.email) + ">  aangevraagd door " + ((v && v.by) || "?")));
    if (!rq.length) console.log("  (geen)");
  } else if (cmd === "apply") {
    const req = get("/dnd/playerRequests") || {}; let n = 0;
    for (const [k, v] of Object.entries(req)) {
      if (a1 && keyOf(a1) !== k) continue;
      if (!v || !okMail(String(v.email || "")) || keyOf(v.email) !== k || !okName(v.name)) { console.log("Overgeslagen (ongeldige aanvraag): " + k); continue; }
      addPlayer(v.email, v.name); remove("/dnd/playerRequests/" + k); n++;
    }
    console.log(n + " aanvraag/aanvragen goedgekeurd.");
  } else if (cmd === "add") {
    if (!a1 || !a2) throw new Error("Gebruik: speler.js add <e-mail> <naam>");
    addPlayer(a1, process.argv.slice(4).join(" "));
  } else if (cmd === "remove") {
    if (!a1 || !okMail(String(a1).toLowerCase())) throw new Error("Gebruik: speler.js remove <e-mail>");
    if (get("/dndAccessEmail/" + keyOf(a1)) == null) { console.log("Dat e-mailadres had geen toegang."); }
    else { remove("/dndAccessEmail/" + keyOf(a1)); console.log("Toegang ingetrokken voor " + a1 + "."); }
  } else {
    console.log(fs.readFileSync(__filename, "utf8").split("*/")[0].replace(/^#!.*\n/, ""));
  }
} catch (e) { console.error("Fout: " + e.message); process.exit(1); }
