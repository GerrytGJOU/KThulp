#!/usr/bin/env node
/* Job-runner voor de Midden-aarde D&D-app (dnd/): portret-, profiel- en statblock-jobs uit de wachtrij van een verhaal.
   Lokaal hulpmiddel voor een Claude Code-sessie; draait via de Firebase CLI (al ingelogd). Eén runner tegelijk.
   Opdrachten (cid = verhaal-id, bv. c1):
     status <cid>                                 telt jobs per type/status
     list <cid> [--all]                           wachtrij (zonder --all: alleen wat nog openstaat)
     next <cid> [types|all] --by=<naam> [--lease=45]   claimt de eerstvolgende job (lease in minuten) en toont de opdracht
     brief <cid> <jobId>                          toont de opdracht van een geclaimde job opnieuw
     set-visual <cid> <jobId> <bestand.txt>       bewaar een VOORGESTELDE uiterlijkbeschrijving (Engels) als npcs/{sleutel}/visual
     import-portrait <cid> <jobId> <afbeelding>   verklein (max 360 px), sla op als npcs/{sleutel}/img en rond de job af
     submit-statblock <cid> <jobId> <bestand.json>  valideer en bewaar een companion-statblock (voorstel) en rond af
     submit-profile <cid> <jobId> <bestand.md>    bewaar een voorgesteld NPC-dossier (world/profiles) en rond af
     fail <cid> <jobId> <reden>                   markeer als mislukt (daarna retry mogelijk tot 3 pogingen)
     block <cid> <jobId> <reden>                  zet op blocked (wacht op een mens, bv. goedkeuring)
     release <cid> <jobId>                        geef een geclaimde job terug aan de wachtrij
     retry <cid> <jobId>                          mislukte of geblokkeerde job opnieuw in de wachtrij
     cancel <cid> <jobId> <reden>
     enqueue <cid> <portrait|profile|statblock> <npcId> [--reason=...]   handmatig een job aanmaken (idempotent; bij een afgeronde job: nieuwe versie)
   Een job wijzigt nooit spelstatus; alleen npcs/{sleutel} (portret), world/companions (statblock, als voorstel), world/profiles en de job zelf.
   Geen geheimen in dit bestand. */
"use strict";
const { spawnSync } = require("child_process");
const fs = require("fs"), os = require("os"), path = require("path");
const World = require("../world.js");
const PROJECT = "kthulp-certamen";

function fb(args) {
  const r = spawnSync("firebase " + args + " --project " + PROJECT, { shell: true, encoding: "utf8", maxBuffer: 1 << 28, env: { ...process.env, MSYS_NO_PATHCONV: "1" } });
  if (r.status !== 0) throw new Error("firebase " + args.split(" ")[0] + " faalde: " + (r.stderr || r.stdout || "").trim().slice(0, 400));
  return r.stdout;
}
function get(p, extra) {
  const out = fb("database:get \"" + p + "\"" + (extra ? " " + extra : "")).trim();
  if (!out || out === "null") return null;
  try { return JSON.parse(out); } catch (e) { throw new Error("Geen JSON van " + p + ": " + out.slice(0, 200)); }
}
function update(updates) {
  const tmp = path.join(os.tmpdir(), "dnd-job-update-" + Date.now() + ".json");
  fs.writeFileSync(tmp, JSON.stringify(updates));
  try { fb("database:update /dnd \"" + tmp + "\" --force"); } finally { fs.unlinkSync(tmp); }
}
const slug = s => String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "").slice(0, 60) || "x";
const PUSH = "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz";
let lastPush = 0, lastRand = [];
function pushId() {
  let now = Date.now(); const dup = now === lastPush; lastPush = now;
  const ts = new Array(8); for (let i = 7; i >= 0; i--) { ts[i] = PUSH.charAt(now % 64); now = Math.floor(now / 64); }
  let id = ts.join("");
  if (!dup) { lastRand = []; for (let i = 0; i < 12; i++) lastRand[i] = Math.floor(Math.random() * 64); }
  else { let i; for (i = 11; i >= 0 && lastRand[i] === 63; i--) lastRand[i] = 0; lastRand[i]++; }
  for (let i = 0; i < 12; i++) id += PUSH.charAt(lastRand[i]);
  return id;
}
const wp = (cid, p) => "campaigns/" + cid + "/world/" + p;

/* zelfde stijl als makePrompt() in de app (index.html) */
const STYLE = "Classic hand-drawn / painterly Tolkien-style tabletop RPG fantasy illustration: traditional details, visible ink outlines, atmospheric lighting, believable anatomy, historical materials.";
function portraitPrompt(name, visual) {
  return STYLE + "\nSquare head-and-shoulders character portrait of " + name + ", facing the viewer in a slight three-quarter view, plain dark muted background with subtle texture.\n" +
    "Character: " + (visual || "(no description yet)") + "\n" +
    "If this is a character from Tolkien's books, follow the written descriptions in the books, not the likeness of any film actor.\n" +
    "Avoid: photorealism, cartoon or anime look, 3D game render, modern clothing or objects, text, captions, watermarks, logos, borders, extra people, extra fingers, deformed hands.";
}

function load(cid) {
  const world = get("/dnd/" + wp(cid, "")) || null;
  if (!world) throw new Error("Verhaal " + cid + " heeft geen wereldregister");
  return world;
}
function jobOf(world, id) {
  const j = (world.jobs || {})[id];
  if (!j) throw new Error("Job " + id + " bestaat niet");
  return j;
}
function eventOf(world, type, summary, refs) {
  return { t: Date.now(), type: type, summary: summary, refs: refs || {}, canon: "V", ingame: world.calendar || null, auto: true };
}
/* Overgang toepassen en wegschrijven (samen met extra paden en een event). */
function transition(cid, world, job, to, patch, extra) {
  const r = World.jobTransition(job, to, patch, Date.now());
  if (!r.ok) throw new Error("Job " + job.id + ": " + r.error);
  const up = Object.assign({}, extra || {});
  up[wp(cid, "jobs/" + job.id)] = r.job;
  if (to === "done" || to === "failed" || to === "blocked" || to === "cancelled") {
    up[wp(cid, "events/" + pushId())] = eventOf(world, "job_" + to, "Job " + job.id + " " + to + (patch && (patch.reason || (patch.result && patch.result.notes)) ? ": " + (patch.reason || patch.result.notes) : ""), { npcs: [job.subject] });
  }
  update(up);
  return r.job;
}

function brief(cid, world, job) {
  const npc = (world.npcs || {})[job.subject] || {}, key = slug(npc.name || job.subject);
  const g = get("/dnd/npcs/" + key) || {};
  const out = { job: job.id, type: job.type, status: job.status, npcId: job.subject, npcName: npc.name, npcStatus: npc.status, canonTag: npc.canon, npcKey: key, required: !!job.required, trigger: job.trigger };
  if (job.type === "portrait") {
    out.hasImageAlready = !!g.img;
    out.npcRole = { goal: npc.goal || null, note: npc.note || null, location: npc.location || null, role: npc.role || null };
    out.visual = g.visual || null; out.visualStatus = g.visualStatus || (g.visual ? "approved-or-legacy" : "missing");
    out.chatgptPrompt = g.visual ? portraitPrompt(npc.name, g.visual) : null;
    out.instructions = g.visual
      ? "1) Plak ALLEEN chatgptPrompt in ChatGPT. 2) Download het resultaat. 3) node dnd/tools/jobs.js import-portrait " + cid + " " + job.id + " <bestand>. Controleer eerst of het beeld klopt met 'visual' (haarkleur, kleding, littekens, leeftijd)."
      : "Er is nog geen uiterlijkbeschrijving. Stel er één op (Engels, 1-3 zinnen, concreet: leeftijd, haar, ogen, gezicht, kleding, wapens/attributen) uit speler-zichtbare bronnen (canon B1, E3, wat in de verhaalberichten staat; voor Tolkien-figuren de boeken). Is er geen bron? Dan FAAL je de job niet: verzin zelf een passend, neutraal uiterlijk als voorstel, gebaseerd op naam, regio, rol en doel uit npcRole hieronder (een gewone, geloofwaardige Midden-aardse persoon, geen opvallende kenmerken die het verhaal vastleggen). Gebruik NOOIT DM-geheime canon (C1, C2, M-documenten, CMP-statblocks, dmnotes) voor een portretprompt. Bewaar met set-visual (status 'proposed') en maak dan het portret; meld in je eindrapport dat de beschrijving een voorstel is die Gerben kan bijsturen.";
  }
  if (job.type === "statblock") {
    out.instructions = "Maak een vereenvoudigd NPC-statblock (2024-regels, low-magic: geen Wizard/Paladin/spellcasting Bard/Cleric; geen spells zonder goedkeuring; zie canon r1_regels_2024 en m6_companions_overzicht via node dnd/tools/claude-dm.js context " + cid + " --canon=r1_regels_2024,m6_companions_overzicht,cmp_r03). Vorm: JSON {hp, ac, resources:{naam:{max,rest:'short'|'long'}}, text:'markdown-statblock', notes}. Lees het NPC-record hieronder en eerdere verhaalfeiten; verzin geen geheimen over bestaande canonieke NPC's. Bewaar met submit-statblock; het blijft een voorstel (sheetStatus proposed).";
    out.npc = npc;
  }
  if (job.type === "profile") {
    out.instructions = "Schrijf een kort NPC-dossier (Nederlands, max ~250 woorden): uiterlijk, doel, kennis, relaties, houding tegenover de PC's, wat de NPC niet weet. Alleen feiten uit het spel en nieuwe voorstellen; markeer voorstellen met [V]. Geen Tolkien-canon tegenspreken. Bewaar met submit-profile.";
    out.npc = npc;
    out.recentEvents = Object.values(world.events || {}).filter(e => e.refs && (e.refs.npcs || []).indexOf(job.subject) >= 0).slice(-8).map(e => e.summary);
  }
  return out;
}

const argv = process.argv.slice(2), flags = {}, pos = [];
for (const a of argv) { if (a.startsWith("--")) { const i = a.indexOf("="); const k = a.slice(2, i < 0 ? undefined : i); flags[k] = i < 0 ? true : a.slice(i + 1); } else pos.push(a); }

function main() {
  const cmd = pos[0], cid = pos[1];
  if (!cmd || cmd === "help") { console.log(fs.readFileSync(__filename, "utf8").split("*/")[0].replace(/^\/\*|^#!.*\n/gm, "").trim()); return; }
  if (!cid) throw new Error("Geef een verhaal-id (bv. c1)");
  const world = load(cid), jobs = world.jobs || {};
  if (cmd === "status") {
    const c = {}; Object.values(jobs).forEach(j => { const k = j.type + " " + j.status; c[k] = (c[k] || 0) + 1; });
    console.log(Object.keys(c).sort().map(k => k + ": " + c[k]).join("\n") || "Geen jobs.");
    console.log("Te claimen nu: " + World.pendingJobs(world, { nowMs: Date.now() }).length);
    return;
  }
  if (cmd === "list") {
    Object.values(jobs).filter(j => flags.all || ["queued", "claimed", "failed", "blocked"].indexOf(j.status) >= 0).sort((a, b) => a.id < b.id ? -1 : 1)
      .forEach(j => console.log(j.id + "  [" + j.status + "]" + (j.required ? " VERPLICHT" : "") + "  pogingen " + (j.attempts || 0) + (j.error ? "  — " + j.error : "")));
    return;
  }
  if (cmd === "next") {
    if (!flags.by || flags.by === true) throw new Error("Geef --by=<naam van de runner>");
    const types = !pos[2] || pos[2] === "all" ? World.JOB_TYPES : pos[2].split(",");
    const lease = (Number(flags.lease) || 45) * 60000;
    for (const j of World.pendingJobs(world, { types: types, nowMs: Date.now() })) {
      const npc = (world.npcs || {})[j.subject];
      /* verlopen lease: eerst terug naar queued */
      let cur = j;
      if (cur.status === "claimed") { const rel = World.jobTransition(cur, "queued", {}, Date.now()); cur = rel.job; }
      if (!npc) { transition(cid, world, cur, "cancelled", { reason: "NPC bestaat niet meer (wees-job)" }); continue; }
      if (cur.type === "portrait") {
        const g = get("/dnd/npcs/" + slug(npc.name) + "/img");
        if (g) { const c2 = World.jobTransition(cur, "claimed", { by: flags.by, leaseUntil: Date.now() + lease }, Date.now()).job; transition(cid, world, c2, "done", { result: { notes: "Portret bestond al; niets gedaan" } }); console.log("(" + cur.id + " overgeslagen: portret bestaat al)"); continue; }
      }
      const claimed = World.jobTransition(cur, "claimed", { by: flags.by, leaseUntil: Date.now() + lease }, Date.now());
      if (!claimed.ok) { console.log("(" + cur.id + " overgeslagen: " + claimed.error + ")"); continue; }
      update({ [wp(cid, "jobs/" + cur.id)]: claimed.job });
      console.log(JSON.stringify(brief(cid, world, claimed.job), null, 2));
      return;
    }
    console.log("Geen jobs in de wachtrij."); return;
  }
  if (cmd === "enqueue") {
    const type = pos[2], npcId = pos[3];
    if (World.JOB_TYPES.indexOf(type) < 0) throw new Error("type moet " + World.JOB_TYPES.join("|") + " zijn");
    if (!(world.npcs || {})[npcId]) throw new Error("NPC " + npcId + " bestaat niet");
    let v = 1; while (jobs[World.jobId(type, npcId, v)] && ["done", "cancelled"].indexOf(jobs[World.jobId(type, npcId, v)].status) >= 0) v++;
    const id = World.jobId(type, npcId, v);
    if (jobs[id]) { console.log("Job " + id + " staat al in de wachtrij (" + jobs[id].status + ")."); return; }
    const rec = { id: id, type: type, subject: npcId, status: "queued", required: type === "statblock", attempts: 0, trigger: "handmatig" + (typeof flags.reason === "string" ? ": " + flags.reason : ""), createdAt: world.calendar || null, createdRound: null };
    update({ [wp(cid, "jobs/" + id)]: rec, [wp(cid, "events/" + pushId())]: eventOf(world, "job_queued", "Job " + id + " handmatig in de wachtrij", { npcs: [npcId] }) });
    console.log("Job " + id + " aangemaakt."); return;
  }
  const jid = pos[2]; if (!jid) throw new Error("Geef een job-id");
  const job = jobOf(world, jid);
  if (cmd === "brief") { console.log(JSON.stringify(brief(cid, world, job), null, 2)); return; }
  if (cmd === "fail") { transition(cid, world, job, "failed", { reason: pos.slice(3).join(" ") }); console.log("Job " + jid + " staat nu op failed."); return; }
  if (cmd === "block") { transition(cid, world, job, "blocked", { reason: pos.slice(3).join(" ") }); console.log("Job " + jid + " staat nu op blocked."); return; }
  if (cmd === "cancel") { transition(cid, world, job, "cancelled", { reason: pos.slice(3).join(" ") }); console.log("Job " + jid + " geannuleerd."); return; }
  if (cmd === "release" || cmd === "retry") { transition(cid, world, job, "queued", {}); console.log("Job " + jid + " staat weer in de wachtrij."); return; }
  if (job.status !== "claimed") throw new Error("Job " + jid + " is niet geclaimd (status " + job.status + "); gebruik eerst 'next'");
  const npc = (world.npcs || {})[job.subject]; if (!npc) throw new Error("NPC " + job.subject + " bestaat niet meer");
  const key = slug(npc.name), file = pos[3];
  if (!file || !fs.existsSync(file)) throw new Error("Bestand niet gevonden: " + file);
  if (cmd === "set-visual") {
    if (job.type !== "portrait") throw new Error("set-visual hoort bij een portret-job");
    const v = fs.readFileSync(file, "utf8").trim(); if (v.length < 30 || v.length > 1500) throw new Error("Beschrijving moet 30-1500 tekens zijn");
    update({ ["npcs/" + key + "/name"]: npc.name, ["npcs/" + key + "/visual"]: v, ["npcs/" + key + "/visualStatus"]: "proposed", ["npcs/" + key + "/t"]: Date.now() });
    console.log("Voorgestelde beschrijving opgeslagen voor " + npc.name + " (visualStatus proposed). Maak nu het portret."); return;
  }
  if (cmd === "import-portrait") {
    if (job.type !== "portrait") throw new Error("import-portrait hoort bij een portret-job");
    const tmp = path.join(os.tmpdir(), "dnd-portrait-" + Date.now() + ".txt");
    let ok = false, msg = "";
    for (const py of ["python3", "python", "py"]) {
      const r = spawnSync(py, ["-I", path.join(__dirname, "portrait-resize.py"), file, tmp], { encoding: "utf8" });
      if (r.status === 0) { ok = true; msg = r.stdout.trim(); break; } else msg = (r.stderr || r.stdout || String(r.error || "")).trim().slice(0, 300);
    }
    if (!ok) throw new Error("Verkleinen mislukt: " + msg);
    const data = fs.readFileSync(tmp, "utf8"); fs.unlinkSync(tmp);
    const g = get("/dnd/npcs/" + key) || {};
    const extra = { ["npcs/" + key + "/img"]: data, ["npcs/" + key + "/name"]: g.name || npc.name, ["npcs/" + key + "/t"]: Date.now(), ["npcs/" + key + "/from"]: "job " + jid };
    transition(cid, world, job, "done", { result: { notes: "Portret opgeslagen als npcs/" + key + " (" + msg + ")", ref: "npcs/" + key } }, extra);
    console.log("Portret van " + npc.name + " opgeslagen (" + msg + "); job afgerond."); return;
  }
  if (cmd === "submit-statblock") {
    if (job.type !== "statblock") throw new Error("submit-statblock hoort bij een statblock-job");
    const sb = JSON.parse(fs.readFileSync(file, "utf8")), er = [];
    if (!(Number.isInteger(sb.hp) && sb.hp >= 5 && sb.hp <= 200)) er.push("hp moet een geheel getal 5-200 zijn");
    if (!(Number.isInteger(sb.ac) && sb.ac >= 8 && sb.ac <= 22)) er.push("ac moet een geheel getal 8-22 zijn");
    const res = {};
    Object.keys(sb.resources || {}).forEach(k => { const r = sb.resources[k]; if (!(r && Number.isInteger(r.max) && r.max >= 1 && r.max <= 10 && (r.rest === "short" || r.rest === "long"))) er.push("hulpbron " + k + ": {max 1-10, rest short|long}"); else res[k] = { cur: r.max, max: r.max, rest: r.rest }; });
    if (typeof sb.text !== "string" || sb.text.trim().length < 200) er.push("text (markdown-statblock) ontbreekt of is te kort");
    if (/spellcasting\s*:\s*(yes|ja)|\b(wizard|paladin)\b/i.test(sb.text || "")) er.push("low-magic: geen Wizard/Paladin/spellcasting zonder goedkeuring");
    if (er.length) throw new Error("Statblock ongeldig:\n- " + er.join("\n- "));
    const rec = { id: job.subject, stage: "candidate", ac: sb.ac, hp: { cur: sb.hp, max: sb.hp }, resources: res, conditions: [], evidence: [], sheetStatus: "proposed", source: "job " + jid };
    const extra = { [wp(cid, "companions/" + job.subject)]: rec, ["campaigns/" + cid + "/canon/" + slug(job.subject)]: { title: job.subject + " " + npc.name + ": NPC-statblock (DM-geheim, voorstel)", text: sb.text, keywords: (npc.name + "," + job.subject).toLowerCase(), secret: true, t: Date.now() } };
    transition(cid, world, job, "done", { result: { notes: "Statblock opgeslagen als voorstel (HP " + sb.hp + ", AC " + sb.ac + "); wacht op goedkeuring" + (sb.notes ? ": " + String(sb.notes).slice(0, 200) : ""), ref: "world/companions/" + job.subject } }, extra);
    console.log("Statblock van " + npc.name + " opgeslagen (voorstel); job afgerond. De NPC kan nu worden gerecruteerd zodra hij companion_candidate en voorgesteld is."); return;
  }
  if (cmd === "submit-profile") {
    if (job.type !== "profile") throw new Error("submit-profile hoort bij een profiel-job");
    const text = fs.readFileSync(file, "utf8").trim(); if (text.length < 80 || text.length > 4000) throw new Error("Dossier moet 80-4000 tekens zijn");
    transition(cid, world, job, "done", { result: { notes: "Dossier opgeslagen als voorstel (" + text.length + " tekens)", ref: "world/profiles/" + job.subject } }, { [wp(cid, "profiles/" + job.subject)]: { text: text, status: "proposed", canon: "V", t: Date.now(), job: jid } });
    console.log("Dossier van " + npc.name + " opgeslagen (voorstel); job afgerond."); return;
  }
  throw new Error("Onbekende opdracht: " + cmd + " (zie: node dnd/tools/jobs.js help)");
}
try { main(); } catch (e) { console.error("Fout: " + e.message); process.exit(1); }
