#!/usr/bin/env node
/* Houdt de D&D-wachtrij in de gaten en geeft op deze computer een melding (piep + Windows-melding) zodra een beurt
   wacht op Claude Code (turn.status === "claude"). Er wordt niets naar buiten gestuurd en niets geschreven: alleen lezen
   via de Firebase CLI. Geen geheimen in dit bestand.
   Gebruik: node dnd/tools/wacht-op-claude.js [--elke=30] [--eenmalig]
     --elke=N     poll-interval in seconden (standaard 30, minimaal 10)
     --eenmalig   controleer één keer en stop (exitcode 0 = niets wacht, 10 = er wacht een beurt) */
"use strict";
const { spawnSync } = require("child_process");
const PROJECT = "kthulp-certamen";
const arg = n => { const a = process.argv.find(x => x.startsWith("--" + n + "=")); return a ? a.split("=")[1] : null; };
const once = process.argv.includes("--eenmalig");
const every = Math.max(10, Number(arg("elke")) || 30) * 1000;

function get(p) {
  const r = spawnSync("firebase database:get \"" + p + "\" --project " + PROJECT, { shell: true, encoding: "utf8", maxBuffer: 1 << 26, env: { ...process.env, MSYS_NO_PATHCONV: "1" } });
  if (r.status !== 0) throw new Error((r.stderr || r.stdout || "").trim().slice(0, 200));
  const o = r.stdout.trim(); return !o || o === "null" ? null : JSON.parse(o);
}
function melding(titel, tekst) {
  process.stdout.write("\x07");
  if (process.platform !== "win32") return;
  const ps = "Add-Type -AssemblyName System.Windows.Forms; $n=New-Object System.Windows.Forms.NotifyIcon; $n.Icon=[System.Drawing.SystemIcons]::Information; $n.Visible=$true; " +
    "$n.ShowBalloonTip(10000,$env:WT,$env:WX,'Info'); [console]::beep(880,250); [console]::beep(1175,350); Start-Sleep -Seconds 11; $n.Dispose()";
  spawnSync("powershell", ["-NoProfile", "-Command", ps], { env: { ...process.env, WT: titel, WX: tekst }, stdio: "ignore", detached: false });
}
const nu = () => new Date().toLocaleTimeString("nl-NL");
const gemeld = {}; /* cid -> ronde waarvoor al gemeld is */

function check() {
  const idx = get("/dnd/campaignIndex") || {};
  const wachten = [];
  for (const [cid, v] of Object.entries(idx)) {
    const t = get("/dnd/campaigns/" + cid + "/turn");
    if (t && t.status === "claude") wachten.push({ cid, title: v.title || cid, round: t.round || 0, reden: t.handoff && t.handoff.reason });
  }
  return wachten;
}

(async function main() {
  console.log("[" + nu() + "] Wacht op Claude Code-beurten (elke " + every / 1000 + " s). Stop met Ctrl+C.");
  for (;;) {
    let w = [];
    try { w = check(); } catch (e) { console.log("[" + nu() + "] Controle mislukt (" + e.message + "), volgende poging volgt."); }
    for (const x of w) {
      if (gemeld[x.cid] === x.round) continue;
      gemeld[x.cid] = x.round;
      console.log("[" + nu() + "] ==> BEURT WACHT OP CLAUDE: " + x.title + " (ronde " + x.round + ")" + (x.reden ? " - " + x.reden : "") + "\n    Zeg in Claude Code: speel de beurt");
      melding("D&D: beurt wacht op Claude", x.title + ", ronde " + x.round + (x.reden ? " (" + x.reden + ")" : ""));
    }
    if (once) process.exit(w.length ? 10 : 0);
    await new Promise(r => setTimeout(r, every));
  }
})();
