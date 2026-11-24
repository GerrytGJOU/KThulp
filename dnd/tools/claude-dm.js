#!/usr/bin/env node
/* Claude als DM voor de rollenspel-app in dnd/ (Midden-aarde en andere settings; D&D 2024 of een ander spelsysteem).
   Lokaal hulpmiddel voor een Claude Code-sessie; draait via de Firebase CLI (al ingelogd).
   Opdrachten:
     status                              welke verhalen wachten op een beurt
     context <cid> [--canon[=id,id]]     alles wat de DM moet weten (canon alleen als index, tenzij --canon)
     prompt <cid>                        de volledige DM-systeemprompt van dit verhaal (spelregels, Stand-schema, uitvoerformaat) voor de setting en het spelsysteem van het verhaal
     apply <cid> <bestand.json> [--force]  schrijf de beurt terug naar de database
     summary <cid> <totRonde> <bestand>  bewaar een samenvatting
     summary-todo [cid] [--force]        welke samenvattingen zijn nodig (eerdere samenvatting, nieuwe berichten, schrijfregels)
     canon-put <cid> <id> <titel> <bestand> [--opening] [--keywords=a,b]
     log <cid> [--van=N] [--tot=M]       toon logboekregels met sleutel (voor opschonen)
     log-edit <cid> <bestand.json>        verwijder/vervang oude logregels: {"delete":[sleutels],"replace":[{"keys":[..],"fact":"..","inGameDate":".."}]}
     state-patch <cid> <bestand.json>    deep-merge in de Stand (lijsten vervangen, null verwijdert)
     memory-add <cid> <tekst>            voeg een Herinnering toe
     level-up <cid> <speler|personage> <naarLevel> [notitie]  kondig een level-up aan: de speler doet hem zelf op het karakterblad (knop + stip)
     level-up-ack <cid> <speler|personage>  na verwerking in de Stand: haal de level-up-melding van het blad
     table-set <cid> <bestand.json>      open/werk de Tafel der Draden bij: {open,phase,title,intro,cands:{"Naam":{role,demands,wants,fears,slotInfo:{reis:"..."}}}} (partyTable, zie M11)
     table-reply <cid> <bestand.json>    antwoorden van kandidaten op gesprekken: {replies:[{player,npc,text,done,summary}],dossier:[{npc,line}],phase,final:{npc:{slot,note}}}
     table-show <cid>                    toon gesprekken, keuzes en onthulling van de Tafel der Draden
     new <titel> [--from=<verhaal>]      maak een nieuw verhaal (standaard het canon-sjabloon, of de canon van --from; wereldsjabloon, DM-notities) waarvan Claude de opening speelt
     new <titel> --setting=<id> --party=Speler=personagesleutel[,..] [--start="startsituatie"]   idem in een andere setting (en dus mogelijk een ander spelsysteem); canon en regelreferentie komen uit de setting
   Geen geheimen in dit bestand: alleen het (openbare) projectnummer. */
"use strict";
const { spawnSync } = require("child_process");
const fs = require("fs"), os = require("os"), path = require("path"), crypto = require("crypto");
const PROJECT = "kthulp-certamen";
const World = require("../world.js");
const MapData = require("../map-data.js"), MapLib = require("../map-lib.js");
let MAPL = null; /* kaartlaag van de setting van deze campagne (null = geen kaart) */
function buildMapLib(S) { const m = S.map; if (!m || m.enabled === false) return null; if (m.maps) return MapLib.make(m); return MapLib.make(MapLib.fromLegacy(MapData)); }
const PT = require("../partytable.js");

/* ---------- Firebase CLI ---------- */
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
const Settings = require("../settings-all.js"); const Rulesets = require("../settings-rulesets.js"), GenSheet = require("../gensheet.js"); /* regelsets en generiek blad (niet-D&D) */ /* setting per campagne (campaignIndex/{cid}/settingId); zonder id: Midden-aarde */
let SETTING = Settings.get(Settings.DEFAULT_ID);
/* Voorrang: de snapshot van het verhaal (campaigns/{cid}/setting, JSON-tekst), dan een eigen setting uit dnd/settings/{id}/json, dan de ingebouwde setting. */
function useSetting(cid) {
  let id = null, snap = null;
  try { const raw = get("/dnd/campaigns/" + cid + "/setting"); snap = raw ? JSON.parse(raw) : null; } catch (e) { snap = null; }
  if (snap && snap.id) { SETTING = Settings.resolve(snap); World.configure(SETTING.world); MAPL = buildMapLib(SETTING); return snap.id; }
  try { id = get("/dnd/campaignIndex/" + cid + "/settingId"); } catch (e) { id = null; } id = id || Settings.DEFAULT_ID;
  if (!Settings.SETTINGS[id]) { try { const raw = get("/dnd/settings/" + id + "/json"); if (raw) Settings.registerCustom(Object.assign(JSON.parse(raw), { id: id })); } catch (e) { /* onbekend: terugval op Midden-aarde */ } }
  SETTING = Settings.get(id); World.configure(SETTING.world); MAPL = buildMapLib(SETTING); return id;
}
/* Blok voor de context als de campagne NIET in Midden-aarde speelt: de DM-regels in CLAUDE_DM.md zijn op Midden-aarde geschreven. */
function settingBlock(id) {
  if (id === Settings.DEFAULT_ID) return null; const p = SETTING.prompt, regs = {}; Object.keys((SETTING.world && SETTING.world.travel) || {}).forEach(k => k.split("|").forEach(x => { regs[x] = true; }));
  return ["# SETTING: " + SETTING.name + " (NIET Midden-aarde)",
    "Deze campagne speelt in " + p.world + ". Waar CLAUDE_DM.md of de prompts naar Tolkien/Midden-aarde, TOL-figuren of Eriador verwijzen: lees dat als deze setting en gebruik de canon van de campagne (S1 e.d.).",
    "- Namen: " + p.naming, "- " + p.noOvershadow, "- Geografie: " + p.geoCheck, "- Loot: passend bij " + p.lootTone + "; " + p.lootNo + ".", "- " + p.bookFigures,
    "- Register-id's: " + p.idLegend + "; " + p.noCreateFig + "; " + p.canonName + " (als event met divergence:true en een cause).",
    "- Regio-id's: " + (Object.keys(regs).join(", ") || "(vrij, REG-LETTERS)") + ". Voorbeeldjaar in de kalender: " + p.exYear + ".",
    SETTING.map && SETTING.map.enabled === false ? "- Er is geen kaart: laat place op null." : ""].filter(Boolean).join("\n");
}
/* Blok voor de context als de campagne een ander spelsysteem dan D&D 2024 gebruikt (settings-rulesets-d100.js). */
function rulesetBlock() {
  const R = Rulesets.get(SETTING.ruleset); if (R.id === "dnd2024") return null;
  return ["# REGELSET: " + R.label + " (NIET D&D 5e)", "De D&D-regels in CLAUDE_DM.md (d20, Advantage, AC, Hit Dice, level, milestone, Death Saves, Proficiency) gelden hier NIET; speel " + R.label + " volgens R1 (canon). Rol van de spelleider: " + R.role + ".",
    "- Spelerworpen: " + R.playerRolls, "- Dobbelstenen en checks: " + R.dice, "- Stand per PC (pcs.<naam>, in plaats van hp/resources/conditions uit de D&D-regels): " + R.pcStats, "- Rolls-chips (rolls): " + R.rollEx, "- " + R.crit, R.guide].filter(Boolean).join("\n");
}
/* De setting van een verhaal zonder SETTING te wijzigen: snapshot, anders de ingebouwde of eigen setting, anders Midden-aarde. */
function settingOf(cid) {
  let snap = null, id = null;
  try { const raw = get("/dnd/campaigns/" + cid + "/setting"); snap = raw ? JSON.parse(raw) : null; } catch (e) { snap = null; }
  if (snap && snap.id) return Settings.resolve(snap);
  try { id = get("/dnd/campaignIndex/" + cid + "/settingId"); } catch (e) { id = null; } id = id || Settings.DEFAULT_ID;
  if (!Settings.SETTINGS[id]) { try { const raw = get("/dnd/settings/" + id + "/json"); if (raw) Settings.registerCustom(Object.assign(JSON.parse(raw), { id: id })); } catch (e) { /* onbekend */ } }
  return Settings.get(id);
}
const T = require("./tables.js")(get); /* NPC-/locatietabel per campagne: globaal of campaigns/{cid}/… (ownTables) */
function update(updates) {
  const tmp = path.join(os.tmpdir(), "dnd-update-" + Date.now() + ".json");
  fs.writeFileSync(tmp, JSON.stringify(updates));
  try { fb("database:update /dnd \"" + tmp + "\" --force"); } finally { fs.unlinkSync(tmp); }
}
const cp = (cid, p) => "campaigns/" + cid + "/" + p;

/* ---------- helpers (gelijk aan de app) ---------- */
const slug = s => String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "").slice(0, 60) || "x";
function deepMerge(t, p) {
  if (p === null || typeof p !== "object" || Array.isArray(p)) return p;
  const out = (t && typeof t === "object" && !Array.isArray(t)) ? { ...t } : {};
  for (const k of Object.keys(p)) { if (p[k] === null) delete out[k]; else out[k] = deepMerge(out[k], p[k]); }
  return out;
}
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
const ABIL = [["str", "Strength", "STR"], ["dex", "Dexterity", "DEX"], ["con", "Constitution", "CON"], ["int", "Intelligence", "INT"], ["wis", "Wisdom", "WIS"], ["cha", "Charisma", "CHA"]];
const SKILLS = [["acrobatics", "Acrobatics", "dex"], ["animal handling", "Animal Handling", "wis"], ["arcana", "Arcana", "int"], ["athletics", "Athletics", "str"], ["deception", "Deception", "cha"], ["history", "History", "int"], ["insight", "Insight", "wis"], ["intimidation", "Intimidation", "cha"], ["investigation", "Investigation", "int"], ["medicine", "Medicine", "wis"], ["nature", "Nature", "int"], ["perception", "Perception", "wis"], ["performance", "Performance", "cha"], ["persuasion", "Persuasion", "cha"], ["religion", "Religion", "int"], ["sleight of hand", "Sleight of Hand", "dex"], ["stealth", "Stealth", "dex"], ["survival", "Survival", "wis"]];
const sgn = n => (n >= 0 ? "+" : "-") + Math.abs(n);
const amod = (c, k) => Math.floor((((c.abilities || {})[k]) || 10) / 2 - 5);
const pbOf = c => Math.floor(((Number(c.level) || 1) - 1) / 4) + 2;
function sheetText(c) {
  const pb = pbOf(c);
  const sk = SKILLS.filter(s => (c.skills || {})[s[0]]).map(s => s[1] + " " + sgn(amod(c, s[2]) + pb * c.skills[s[0]])).join(", ");
  const sv = ABIL.filter(a => (c.saves || []).includes(a[0])).map(a => a[2] + " " + sgn(amod(c, a[0]) + pb)).join(", ");
  return "## " + c.name + " (speler: " + c.player + ") - Level " + c.level + " " + [c.species, c.class + (c.subclass ? " (" + c.subclass + ")" : ""), c.background].filter(Boolean).join(", ") + "\n" +
    "AC " + c.ac + ", max HP " + c.hpMax + ", Speed " + c.speed + " ft, Proficiency +" + pb + ". " + ABIL.map(a => a[2] + " " + ((c.abilities || {})[a[0]] || 10) + " (" + sgn(amod(c, a[0])) + ")").join(", ") + "\n" +
    "Saves: " + (sv || "-") + ". Skills: " + (sk || "-") + ".\n" +
    ((c.attacks || []).length ? "Aanvallen: " + c.attacks.map(a => a.name + " " + sgn(amod(c, a.ability || "str") + (a.prof === false ? 0 : pb) + (Number(a.extra) || 0)) + (a.damage ? " (" + a.damage + ")" : "")).join("; ") + "\n" : "") +
    (c.spellInfo || c.spells ? "Spellcasting: " + [c.spellInfo, c.spells].filter(Boolean).join(" ").replace(/\n+/g, " ") + "\n" : "") +
    (c.appearance ? "Uiterlijk: " + String(c.appearance).replace(/\n+/g, " ").slice(0, 400) + "\n" : "") + (c.features ? "Features: " + c.features.replace(/\n+/g, " ") + "\n" : "") + (c.equipment ? "Uitrusting: " + c.equipment.replace(/\n+/g, " ") + "\n" : "");
}
const rollDice = () => { const r = (s, n) => Array.from({ length: n }, () => 1 + crypto.randomInt(s)), o = {}; Rulesets.get(SETTING.ruleset).preDice.forEach(([k, s, n]) => { o[k] = r(s, n); }); return o; };
const isGen = c => !!(c && c.ruleset && c.ruleset !== "dnd2024" && Rulesets.has(c.ruleset) && Rulesets.get(c.ruleset).sheet);
const vals = o => o ? Object.values(o) : [];
const sortedVals = o => o ? Object.keys(o).sort().map(k => o[k]) : [];

/* ---------- opdrachten ---------- */
function cmdStatus() {
  const idx = get("/dnd/campaignIndex") || {}, cfg = get("/dnd/config") || {};
  console.log("DM-modus in de app:", cfg.dmMode || "gemini");
  for (const [cid, v] of Object.entries(idx)) {
    const t = get("/dnd/" + cp(cid, "turn"));
    console.log("-", cid, "|", v.title, "| ronde", v.round || 0, "| status:", t ? t.status : "(nog niet gestart)", t && t.status === "claude" ? "<== WACHT OP CLAUDE" : "");
  }
}
/* Tafel der Draden (canon M11): openstaande gesprekken en keuzes voor de DM */
function tableBlock(pt, players) {
  const L = ["# TAFEL DER DRADEN (partyvorming, canon M11; fase: " + (pt.phase || "gesprekken") + ")"], pend = PT.pendingTalks(pt, players);
  L.push("Beantwoord elk openstaand gesprek in karakter met 'table-reply' (kort, 2-4 zinnen, eerlijk over voorwaarden, geen geheimen; geef na het tweede bericht de bevestiging done:true en een neutrale summary voor de ander). Het is GEEN verhaalbeurt: de beurtvertelling blijft los hiervan.");
  L.push(pend.length ? pend.map(p => "- " + p.player + " tegen " + ((pt.cands || {})[p.npc] || {}).name + ": " + p.msgs.map(m => (m.from === "speler" ? "[speler] " : "[kandidaat] ") + m.text).join(" | ")).join("\n") : "(geen openstaande gesprekken)");
  const rd = pt.ready || {}; L.push("Klaar met leggen: " + players.map(p => p + "=" + (rd[PT.keyOf(p)] === true ? "ja" : "nee")).join(", ") + (PT.allReady(pt, players) ? " (onthuld)" : ""));
  if (PT.allReady(pt, players)) L.push(PT.compare(pt, players).map(r => "- " + r.name + ": " + Object.entries(r.by).map(([p, s]) => p + "=" + s).join(", ") + (r.agree ? " (gelijk)" : " (VERSCHIL)")).join("\n"));
  const vs = pt.voorspraak || {}; if (Object.keys(vs).length) L.push("Voorspraak: " + Object.entries(vs).map(([p, k]) => p + " voor " + ((pt.cands || {})[k] || {}).name).join(", "));
  const br = pt.beraad || {}; Object.keys(br).forEach(p => Object.entries(br[p] || {}).forEach(([k, t]) => L.push("Beraad " + p + " over " + ((pt.cands || {})[k] || {}).name + ": " + t)));
  return L.join("\n");
}
/* level-up: de DM kondigt aan in het verhaal, de speler kiest op het karakterblad (dnd/levelup.js), de DM verwerkt het in de Stand */
function resolveChar(cid, who) {
  const allC = get("/dnd/characters") || {}, party = (get("/dnd/campaignIndex/" + cid) || {}).party || {};
  const k = party[who] || (allC[who] ? who : Object.keys(allC).find(x => slug(allC[x].name) === slug(who) || slug(allC[x].player || "") === slug(who)));
  if (!k || !allC[k]) throw new Error("personage niet gevonden: " + who); return { key: k, c: allC[k] };
}
function cmdLevelUp(cid, who, to, note) {
  const { key, c } = resolveChar(cid, who), L = Number(to); if (!(L >= 2 && L <= 12)) throw new Error("naarLevel moet 2 t/m 12 zijn");
  if (Number(c.level) !== L - 1) throw new Error(c.name + " is level " + c.level + "; een level-up gaat één level per keer (naar " + (Number(c.level) + 1) + ")");
  update({ ["characters/" + key + "/levelUp"]: { status: "announced", to: L, note: String(note || "").slice(0, 600), t: Date.now(), by: "Claude" } });
  console.log("Level-up aangekondigd voor " + c.name + " (naar level " + L + "): de knop en de stip verschijnen op het karakterblad van " + c.player + ".");
}
function cmdLevelUpAck(cid, who) {
  const { key, c } = resolveChar(cid, who); update({ ["characters/" + key + "/levelUp"]: null }); console.log("Level-up-melding van " + c.name + " verwijderd.");
}
function levelBlock(allC) {
  const L = Object.values(allC).filter(c => c && c.levelUp); if (!L.length) return null;
  return "# LEVEL-UP (de speler doet hem zelf op het karakterblad; jij kondigt aan met 'level-up' en verwerkt daarna de Stand)\n" + L.map(c => "- " + c.name + " (" + c.player + "): " + (c.levelUp.status === "announced"
    ? "aangekondigd naar level " + c.levelUp.to + ", wacht op de speler" : "GEDAAN: " + (c.levelUp.summary || "") + ". Werk de Stand bij (pcs." + c.name + ".hp.max en .current, resources Hit Dice, features, spell slots) met state-patch, vertel het kort in de volgende beurt en bevestig daarna met 'level-up-ack'.")).join("\n");
}
function cmdTableSet(cid, file) {
  const d = JSON.parse(fs.readFileSync(file, "utf8")), up = {}, base = cp(cid, "partyTable/");
  ["open", "phase", "title", "intro"].forEach(k => { if (d[k] !== undefined) up[base + k] = d[k]; });
  if (d.phase && !PT.PHASES.includes(d.phase)) throw new Error("fase moet een van " + PT.PHASES.join(", ") + " zijn");
  Object.entries(d.cands || {}).forEach(([name, c]) => { const k = PT.keyOf(name); up[base + "cands/" + k + "/name"] = name;
    ["role", "demands", "wants", "fears"].forEach(f => { if (c[f] !== undefined) up[base + "cands/" + k + "/" + f] = c[f]; });
    Object.entries(c.slotInfo || {}).forEach(([s, t]) => { if (!PT.SLOT_IDS.includes(s)) throw new Error("onbekende plek " + s); up[base + "cands/" + k + "/slotInfo/" + s] = t; }); });
  update(up); console.log("Tafel bijgewerkt (" + Object.keys(up).length + " velden).");
}
function cmdTableReply(cid, file) {
  const d = JSON.parse(fs.readFileSync(file, "utf8")), up = {}, base = cp(cid, "partyTable/"), now = Date.now();
  (d.replies || []).forEach((r, i) => { const pk = PT.keyOf(r.player), ck = PT.keyOf(r.npc); if (!r.text) throw new Error("antwoord zonder tekst"); const k = pushId();
    up[base + "talks/" + pk + "/" + ck + "/msgs/" + k] = { from: "npc", text: String(r.text).slice(0, 1200), t: now + i }; up[base + "talks/" + pk + "/" + ck + "/state"] = r.done ? "done" : "answered";
    if (r.summary) up[base + "talks/" + pk + "/" + ck + "/summary"] = String(r.summary).slice(0, 300); });
  (d.dossier || []).forEach((x, i) => { up[base + "cands/" + PT.keyOf(x.npc) + "/dossier/" + pushId()] = { text: String(x.line).slice(0, 300), t: now + i }; });
  Object.entries(d.final || {}).forEach(([npc, f]) => { if (!PT.SLOT_IDS.includes(f.slot)) throw new Error("onbekende plek " + f.slot); up[base + "final/" + PT.keyOf(npc)] = { slot: f.slot, note: String(f.note || "").slice(0, 400) }; });
  if (d.phase) { if (!PT.PHASES.includes(d.phase)) throw new Error("onbekende fase"); up[base + "phase"] = d.phase; }
  update(up); console.log("Tafel: " + (d.replies || []).length + " antwoord(en), " + (d.dossier || []).length + " dossierregel(s)" + (d.final ? ", uitkomst vastgelegd" : "") + ".");
}
function cmdTableShow(cid) {
  const pt = get("/dnd/" + cp(cid, "partyTable")); if (!pt) return console.log("Geen Tafel der Draden voor dit verhaal.");
  const pl = ((get("/dnd/campaignIndex/" + cid) || {}).party && Object.keys(get("/dnd/campaignIndex/" + cid).party)) || ["Gerben", "Maurits"];
  console.log(tableBlock(pt, pl));
}
/* Toont de DM-systeemprompt zoals de app hem voor dit verhaal gebruikt (dezelfde functie als in index.html). */
function cmdPrompt(cid) {
  if (!cid) throw new Error("gebruik: prompt <cid>");
  useSetting(cid);
  const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8"), a = html.indexOf("function systemPrompt("), b = html.indexOf("`; }", a) + 4;
  if (a < 0 || b < a) throw new Error("systemPrompt niet gevonden in index.html");
  const f = new Function("DNDRulesets", html.slice(a, b) + "; return systemPrompt;")(Rulesets);
  console.log("# DM-SYSTEEMPROMPT (setting: " + SETTING.name + "; spelsysteem: " + Rulesets.get(SETTING.ruleset).label + ")\n" + f(SETTING.prompt, Rulesets.get(SETTING.ruleset)));
}
function cmdContext(cid, flags) {
  const sid = useSetting(cid);
  const turn = get("/dnd/" + cp(cid, "turn"));
  if (!turn) return console.log("Dit verhaal is nog niet gestart (geen turn).");
  const canon = get("/dnd/" + cp(cid, "canon")) || {};
  const state = JSON.parse(get("/dnd/" + cp(cid, "state")) || "{}");
  const notes = get("/dnd/" + cp(cid, "dmnotes")) || {};
  const pend = Object.values(get("/dnd/" + cp(cid, "pending")) || {}).filter(p => p.round === turn.round).sort((a, b) => a.t - b.t);
  const mem = get("/dnd/" + cp(cid, "memories")), sums = get("/dnd/" + cp(cid, "summaries"));
  const logs = get("/dnd/" + cp(cid, "log"), "--order-by-key --limit-to-last 40");
  const msgs = get("/dnd/" + cp(cid, "messages"), "--order-by-key --limit-to-last 24");
  const allChars = get("/dnd/characters") || {}, npcs = get("/dnd/" + T(cid, "npcs")) || {};
  const party = (get("/dnd/campaignIndex/" + cid) || {}).party || null, chars = partyFilter(allChars, party);
  const wacht = party ? Object.entries(party).filter(([n, k]) => !k || !allChars[k]).map(([n]) => n) : [];
  const first = !Object.keys(state).length;
  const out = [];
  { const sb = settingBlock(sid); if (sb) out.push(sb); const rb = rulesetBlock(); if (rb) out.push(rb); }
  if (turn.handoff && turn.handoff.to === "claude") out.push("# OVERDRACHT (jij speelt deze beurt omdat het een groot moment is)\n" + turn.handoff.reason + ". Neem de tijd voor een thematisch sterke, rijke scène (mag langer dan 180 woorden), gebruik alle canon en de wereldstatus, en zet daarna met nextTurn.handoff:null de volgende beurt terug naar Gemini, tenzij het grote moment meerdere beurten duurt.");
  out.push("# TURN\nronde " + turn.round + ", status " + turn.status + (turn.prompt ? ", laatste vraag: " + turn.prompt : "") + (turn.checks ? ", gevraagde checks: " + JSON.stringify(turn.checks) : "") + (first ? "\n(LET OP: Stand is leeg: dit is de openingsbeurt; neem de beginsituatie uit D1/Stand #1 over)" : ""));
  out.push("# SPELERS (nextTurn.awaiting bevat altijd de SPELERNAAM, nooit de naam van het personage; de vraag in nextTurn.prompt richt je aan dezelfde speler)\n" + (party ? Object.entries(party).map(([n, k]) => n + (k && allChars[k] ? " (speelt " + allChars[k].name + ")" : " (heeft nog geen personage)")) : [...new Set([...vals(get("/dnd/" + cp(cid, "players"))), ...vals(chars).map(c => c.player).filter(Boolean)])].map(n => { const c = vals(chars).find(x => x.player === n); return n + (c ? " (speelt " + c.name + ")" : ""); })).join(", ") + (wacht.length ? "\n(LET OP: " + wacht.join(", ") + " heeft nog geen personage; speel de opening pas als alle spelers een personage hebben, en zeg dat tegen Gerben)" : ""));
  const want = typeof flags.canon === "string" && flags.canon !== "true" ? flags.canon.split(",") : null;
  out.push("# CANON" + (flags.canon ? "" : " (alleen index; gebruik --canon of --canon=id,id om de tekst te lezen)"));
  const cparts = [];
  for (const [id, d] of Object.entries(canon)) {
    const meta = "[" + id + (d.off ? ", UIT" : "") + (d.opening ? ", alleen opening" : "") + (d.keywords ? ", trefwoorden" : "") + "]";
    if (flags.canon && (!want || want.includes(id))) cparts.push("### " + d.title + " " + meta + "\n" + d.text);
    else cparts.push("- " + d.title + " " + meta + ", " + d.text.length + " tekens");
  }
  out.push(cparts.join(flags.canon ? "\n\n" : "\n"));
  out.push("# KARAKTERBLADEN\n" + vals(chars).filter(c => c.player).map(c => isGen(c) ? GenSheet.sheetText(Rulesets.get(c.ruleset), c) : sheetText(c)).join("\n") || "(geen)");
  out.push("# SAMENVATTINGEN\n" + (sortedVals(sums).map(s => "(ronde " + s.fromRound + "-" + s.toRound + ") " + s.text).join("\n") || "(geen)"));
  out.push("# HERINNERINGEN VAN DE SPELERS (bindend)\n" + (sortedVals(mem).map(m => "- " + m.text).join("\n") || "(geen)"));
  out.push("# BEKENDE NPC'S (exacte namen voor speakers)\n" + (vals(npcs).filter(n => !n.forPlayer).map(n => n.name).join(", ") || "(geen)"));
  const hayV = (JSON.stringify(state) + " " + sortedVals(msgs).slice(-10).map(m => m.text).join(" ") + " " + pend.map(p => p.text).join(" ") + " " + Object.values(notes).join(" ")).toLowerCase();
  const visN = vals(npcs).filter(n => !n.forPlayer && n.visual && n.name && hayV.includes(String(n.name).toLowerCase()));
  out.push("# UITERLIJK VAN NPC'S IN BEELD (veld visual; beschrijf uiterlijk altijd hiernaar, verzin geen kleur, leeftijd of kleding die ermee botst; bij twijfel niets noemen)\n" + (visN.map(n => "- " + n.name + ": " + String(n.visual).replace(/\n+/g, " ").slice(0, 320)).join("\n") || "(geen)"));
  out.push("# LOGBOEK (laatste 40)\n" + (sortedVals(logs).map(l => "- [" + (l.inGameDate || "") + "] " + l.fact).join("\n") || "(leeg)"));
  out.push("# ACTUELE STAND\n" + JSON.stringify(state));
  out.push("# OPEN OPDRACHTEN (een echt nieuwe scène sluit hierop aan; gewone beurten en dialoog hoeven dat niet)\n" + (((state.quests || {}).open || []).map(x => "- " + (typeof x === "string" ? x : (x.title || "") + (x.detail ? ": " + x.detail : ""))).join("\n") || "(geen)"));
  const world = get("/dnd/" + cp(cid, "world"));
  out.push("# WERELDSTATUS (stabiele IDs; wijzig alleen via worldDelta)\n" + (world ? World.worldContext(world, { hay: (sortedVals(msgs).slice(-6).map(m => m.text).join(" ") + " " + pend.map(p => p.text).join(" ")).toLowerCase(), region: world.sceneRegion, maxChars: 6000 }) : "(niet actief)"));
  if (MAPL) out.push("# KAARTPLAATSEN (kies hieruit het id voor \"place\")\n" + MAPL.ids.join(", "));
  out.push("# DM-NOTITIES (privé)\n" + (Object.entries(notes).map(([k, v]) => "- " + k + ": " + v).join("\n") || "(nog geen)"));
  out.push("# RECENTE GESCHIEDENIS\n" + (sortedVals(msgs).filter(m => m.type !== "system").slice(-10).map(m => (m.type === "narration" ? "DM" : m.author) + ": " + m.text).join("\n\n") || "(begin van het verhaal)"));
  { const lb = levelBlock(allChars); if (lb) out.push(lb); }
  { const pt = get("/dnd/" + cp(cid, "partyTable")); if (pt && pt.open) out.push(tableBlock(pt, party ? Object.keys(party) : ["Gerben", "Maurits"])); }
  out.push("# VOORGEGOOIDE DOBBELSTENEN VOOR NPC/VIJAND (in volgorde gebruiken)\n" + JSON.stringify(rollDice()));
  out.push("# ACTIES DEZE RONDE\n" + (pend.length ? pend.map(p => p.name + ": " + p.text).join("\n") : "(geen: open het verhaal)"));
  console.log(out.join("\n\n"));
}
function parseDM(o, names, chars) {
  if (typeof o.narration !== "string" || !o.narration) throw new Error("narration ontbreekt");
  o.statePatch = o.statePatch && typeof o.statePatch === "object" ? o.statePatch : {};
  o.logEntries = Array.isArray(o.logEntries) ? o.logEntries : [];
  o.place = (typeof o.place === "string" && MAPL && MAPL.byId[o.place]) ? o.place : null;
  o.worldDelta = (o.worldDelta && typeof o.worldDelta === "object" && !Array.isArray(o.worldDelta)) ? o.worldDelta : null;
  o.speakers = Array.isArray(o.speakers) ? o.speakers.filter(s => typeof s === "string").slice(0, 4) : [];
  o.newNpcs = Array.isArray(o.newNpcs) ? o.newNpcs.filter(n => n && typeof n.name === "string" && n.name.trim()) : [];
  o.rolls = Array.isArray(o.rolls) ? o.rolls.filter(r => r && typeof r.who === "string" && typeof r.what === "string" && r.total != null && isFinite(Number(r.total))).slice(0, 12).map(r => ({ who: r.who.slice(0, 40), what: r.what.slice(0, 40), natural: (r.natural != null && isFinite(Number(r.natural))) ? Number(r.natural) : null, mod: isFinite(Number(r.mod)) ? Number(r.mod) : 0, total: Number(r.total), dice: r.dice ? String(r.dice).slice(0, 20) : "", result: r.result ? String(r.result).slice(0, 30) : "", target: (r.target != null && isFinite(Number(r.target))) ? Number(r.target) : null })) : [];
  o.extraLocations = (Array.isArray(o.extraLocations) ? o.extraLocations : []).filter(x => x && typeof x.name === "string" && x.name.trim()).slice(0, 3).map(x => ({ name: x.name.trim().slice(0, 80), description: String(x.description || "").slice(0, 400), visual: String(x.visual || "").slice(0, 1500) }));
  const lc = o.location; o.location = (lc && typeof lc.name === "string" && lc.name.trim()) ? { name: lc.name.trim().slice(0, 80), description: String(lc.description || "").slice(0, 400), visual: String(lc.visual || "").slice(0, 1500) } : null;
  const res = {}; const dn = o.dmNotes;
  if (dn && typeof dn === "object" && !Array.isArray(dn)) for (const [k, v] of Object.entries(dn).slice(0, 30)) { const kk = String(k).toLowerCase().replace(/[^a-z0-9_]+/g, "_").slice(0, 40); if (!kk) continue; if (v === null || v === "") res[kk] = null; else if (typeof v === "string" || typeof v === "number") res[kk] = String(v).slice(0, 500); }
  o.dmNotes = res;
  const nt = o.nextTurn || {};
  const pcs = {}; Object.values(chars || {}).forEach(c => { if (c && c.player && c.name) pcs[c.name] = c.player; });
  const fa = World.fixAwaiting(nt, names, pcs);
  let aw = fa.awaiting;
  if (!aw.length) aw = names.slice();
  if (fa.note) console.log("let op: " + fa.note);
  o.nextTurn = { awaiting: aw, blind: !!nt.blind, prompt: String(nt.prompt || "Wat doen jullie?"), checks: nt.checks && typeof nt.checks === "object" ? nt.checks : null, handoff: (nt.handoff && nt.handoff.to === "claude") ? { to: "claude", reason: String(nt.handoff.reason || "groot moment").slice(0, 200) } : null };
  return o;
}
/* alleen de personages van deze campagne (campaignIndex/{id}/party = {speler: sleutel}); zonder party (oud verhaal): alles */
function partyFilter(chars, party) { if (!party) return chars; const keys = Object.values(party); return Object.fromEntries(Object.entries(chars).filter(([k]) => keys.includes(k))); }
function cmdApply(cid, file, flags) {
  useSetting(cid);
  const turn = get("/dnd/" + cp(cid, "turn"));
  if (!turn) throw new Error("Verhaal niet gestart.");
  if (turn.status !== "claude" && !flags.force) throw new Error("Status is '" + turn.status + "', niet 'claude'. Gebruik --force om toch te schrijven.");
  const round = turn.round, now = Date.now();
  const party = (get("/dnd/campaignIndex/" + cid) || {}).party || null;
  const chars = partyFilter(get("/dnd/characters") || {}, party);
  const names = party ? Object.keys(party) : [...new Set([...vals(get("/dnd/" + cp(cid, "players"))), ...vals(chars).map(c => c.player).filter(Boolean)])];
  const out = parseDM(JSON.parse(fs.readFileSync(file, "utf8")), names, chars);
  const pendE = Object.entries(get("/dnd/" + cp(cid, "pending")) || {}).filter(([k, p]) => p.round === round);
  const pend = pendE.map(e => e[1]).sort((a, b) => a.t - b.t);
  { const ec = World.echoCheck(out.narration, pend.map(p => p.text)); if (ec && !flags.force) throw new Error("De vertelling herhaalt letterlijk wat een speler zei of deed (\"" + ec + "\"). Laat de wereld reageren met nieuwe informatie; niets is opgeslagen."); }
  const stateStr = get("/dnd/" + cp(cid, "state")) || "{}";
  const state = JSON.parse(typeof stateStr === "string" ? stateStr : JSON.stringify(stateStr));
  const notes = get("/dnd/" + cp(cid, "dmnotes")) || {};
  const npcs = get("/dnd/" + T(cid, "npcs"), "--shallow") || {}, locs = get("/dnd/" + T(cid, "locations"), "--shallow") || {};
  const lastS = get("/dnd/" + cp(cid, "stands"), "--order-by-key --limit-to-last 1");
  const lastKey = lastS ? Object.keys(lastS)[0] : null;
  const up = {}, msgKeys = [], logKeys = [];
  if (lastKey) up[cp(cid, "stands/" + lastKey + "/undo")] = null;
  pend.forEach((p, i) => { const k = pushId(); msgKeys.push(k); up[cp(cid, "messages/" + k)] = { type: p.pass ? "pass" : "action", author: p.name, text: p.text, round, t: now + i }; });
  const nm = { type: "narration", author: "dm", dm: "claude", text: out.narration, round: round + 1, t: now + pend.length + 1 };
  if (out.speakers.length) nm.speakers = out.speakers;
  if (out.rolls.length) nm.rolls = out.rolls;
  const nk = pushId(); msgKeys.push(nk);
  out.logEntries.forEach(l => { if (l && l.fact) { const k = pushId(); logKeys.push(k); up[cp(cid, "log/" + k)] = { fact: String(l.fact), inGameDate: String(l.inGameDate || ""), round: round + 1, t: now }; } });
  out.newNpcs.forEach(n => { const k = slug(n.name); if (!npcs[k]) up[T(cid, "npcs") + "/" + k] = { name: n.name.trim(), visual: String(n.visual || "").slice(0, 1500), t: now, from: cid }; });
  out.extraLocations.forEach(x => { const xk = slug(x.name); if (xk && !locs[xk] && !up[T(cid, "locations") + "/" + xk]) up[T(cid, "locations") + "/" + xk] = { name: x.name, desc: x.description, visual: x.visual, t: now, from: cid }; });
  if (out.location) { const lk = slug(out.location.name); if (!locs[lk]) { up[T(cid, "locations") + "/" + lk] = { name: out.location.name, desc: out.location.description, visual: out.location.visual, t: now, from: cid }; nm.newLoc = lk; } else nm.loc = lk; up[cp(cid, "scene")] = lk; }
  up[cp(cid, "messages/" + nk)] = nm;
  const world = get("/dnd/" + cp(cid, "world"));
  let wplan = null;
  if (world) { const sp = World.checkSpeakers(world, out.speakers, out.worldDelta && out.worldDelta.region); if (sp.errors.length) throw new Error("sprekers ongeldig:\n- " + sp.errors.join("\n- ") + "\nCorrigeer het JSON-bestand en probeer opnieuw (niets is opgeslagen)."); }
  if (world && out.worldDelta) {
    const v = World.validateDelta(world, out.worldDelta, { round: round + 1, hasPortrait: n => { try { return !!get("/dnd/" + T(cid, "npcs") + "/" + slug(n.name) + "/img"); } catch (e) { return false; } } });
    if (!v.ok) throw new Error("worldDelta ongeldig:\n- " + v.errors.join("\n- ") + "\nCorrigeer het JSON-bestand en probeer opnieuw (niets is opgeslagen).");
    wplan = v.plan; v.warnings.forEach(w => console.log("let op:", w));
  }
  const newState = deepMerge(state, out.statePatch);
  const newNotes = { ...notes }; for (const [k, v] of Object.entries(out.dmNotes)) { if (v === null) delete newNotes[k]; else newNotes[k] = v; }
  up[cp(cid, "dmnotes")] = Object.keys(newNotes).length ? newNotes : null;
  const worldPrev = []; let mapPrev = [];
  if (MAPL) try {
    const mapNow = get("/dnd/" + cp(cid, "map")), nc = (wplan && wplan.calendar) || (world && world.calendar) || null;
    const sc = (out.statePatch && out.statePatch.inGame && out.statePatch.inGame.location) || (state.inGame && state.inGame.location) || "";
    const pl = MAPL.determinePlace({ id: out.place, locName: out.location && out.location.name, sceneText: sc, region: (out.worldDelta && out.worldDelta.region) || (world && world.sceneRegion) || null });
    const vis = MAPL.planVisit(mapNow, pl, nc && nc.y ? { y: nc.y, m: nc.m, d: nc.d } : null, out.location ? slug(out.location.name) : null, now);
    Object.keys(vis.set).forEach(p => { up[cp(cid, p)] = vis.set[p]; }); mapPrev = vis.prev;
  } catch (e) { console.log("let op: kaart niet bijgewerkt (" + e.message + ")"); }
  if (world && (wplan || (out.worldDelta && out.worldDelta.region))) {
    const cm = World.commitPaths(world, wplan || { npcs: {}, quests: {}, clocks: {}, calendar: null, divergences: [], events: [] }, { now: now, region: out.worldDelta && out.worldDelta.region, newKey: pushId });
    Object.keys(cm.set).forEach(pth => { up[cp(cid, pth)] = cm.set[pth]; });
    cm.prev.forEach(x => worldPrev.push(x));
  }
  const sj = JSON.stringify(newState), rk = String(round + 1).padStart(5, "0");
  up[cp(cid, "state")] = sj;
  up[cp(cid, "stands/" + rk)] = { json: sj, round: round + 1, t: now, undo: { mapPrev: mapPrev, worldPrev: worldPrev, prevNotes: Object.keys(notes).length ? notes : null, prevState: typeof stateStr === "string" ? stateStr : "{}", turn, pend: pendE.map(([k, p]) => ({ uid: k, ...p })), msgs: msgKeys, logs: logKeys } };
  up[cp(cid, "usage/" + rk)] = { prompt: 0, cached: 0, out: 0, model: "claude-code" };
  up[cp(cid, "pending")] = null;
  up["campaignIndex/" + cid + "/lastPlayed"] = now; up["campaignIndex/" + cid + "/round"] = round + 1;
  const aw = {}; out.nextTurn.awaiting.forEach(n => { aw[n] = true; });
  const major = (wplan && wplan.major) || [];
  const hand = out.nextTurn.handoff || (major.length ? { to: "claude", reason: "Na een groot moment: " + major.slice(0, 3).join("; "), auto: true } : null);
  up[cp(cid, "turn")] = { handoff: hand, round: round + 1, status: "waiting", awaiting: aw, prompt: out.nextTurn.prompt, blind: out.nextTurn.blind, checks: out.nextTurn.checks || null, mode: out.nextTurn.awaiting.length > 1 ? "all" : "single" };
  update(up);
  console.log("Beurt geschreven: ronde " + (round + 1) + ", aan zet: " + out.nextTurn.awaiting.join(", ") + " (" + out.nextTurn.prompt + ")");
  if ((round + 1) % 10 === 0) console.log("Tip: maak nu een samenvatting (summary-opdracht); er zijn 10 tot 15 rondes sinds de vorige.");
}
function cmdSummary(cid, upTo, file) {
  const ss = get("/dnd/" + cp(cid, "summaries")) || {}; let covered = 0; vals(ss).forEach(s => { if ((s.toRound || 0) < Number(upTo)) covered = Math.max(covered, s.toRound || 0); }); /* een samenvatting t/m dezelfde ronde overschrijven mag, zonder dat fromRound verschuift */
  update({ [cp(cid, "summaries/" + String(upTo).padStart(5, "0"))]: { fromRound: covered + 1, toRound: Number(upTo), text: fs.readFileSync(file, "utf8").trim(), t: Date.now() } });
  console.log("Samenvatting opgeslagen t/m ronde " + upTo);
}
/* Welke samenvattingen moeten nog gemaakt worden? Toont per verhaal de eerdere samenvatting en de nieuwe berichten, plus de schrijfregels uit de app. */
function cmdSummaryTodo(cid, flags) {
  const idx = get("/dnd/campaignIndex") || {};
  const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
  const i0 = html.indexOf("const SUMSYS='"), i1 = i0 < 0 ? -1 : html.indexOf("';", i0);
  const rules = i1 > i0 ? html.slice(i0 + 14, i1).split("\\'").join("'") : "Vat de nieuwe berichten samen in helder Nederlands, maximaal 180 woorden.";
  const rulesFor = (id, txt) => { const S0 = settingOf(id), R0 = Rulesets.get(S0.ruleset); return txt.replace("D&D-campagne", R0.id === "dnd2024" ? "D&D-campagne" : R0.name + "-campagne").replace("Midden-aarde", S0.prompt.world); };
  const min = flags.force ? 4 : 10, max = 15; /* per 10 tot 15 rondes; nooit losse kleine stukjes */ let n = 0;
  for (const [id, v] of Object.entries(idx)) {
    if (cid && cid !== id) continue;
    const ss = get("/dnd/" + cp(id, "summaries")) || {}; let covered = 0; vals(ss).forEach(s => { covered = Math.max(covered, s.toRound || 0); });
    let msgs = sortedVals(get("/dnd/" + cp(id, "messages"), "--order-by-key --limit-to-last 500")).filter(x => x.type !== "system" && x.round > covered);
    const latest = msgs.reduce((a, x) => Math.max(a, x.round || 0), 0);
    if (!flags.force && latest - covered >= min) msgs = msgs.filter(x => x.round <= covered + max);
    const upTo = msgs.reduce((a, x) => Math.max(a, x.round || 0), 0);
    if (upTo - covered < min || msgs.length < 4) { console.log("- " + id + " | " + v.title + ": nog niets te doen (gedekt t/m ronde " + covered + ", laatste ronde " + upTo + ")"); continue; }
    n++;
    console.log(["", "===== " + id + " | " + v.title + " | samenvatting nodig voor ronde " + (covered + 1) + " t/m " + upTo + " =====", "# SCHRIJFREGELS", rulesFor(id, rules), "", "# EERDERE SAMENVATTING", sortedVals(ss).map(s => s.text).join("\n\n") || "(geen)", "", "# NIEUWE BERICHTEN", msgs.map(x => (x.type === "narration" ? "DM" : x.author) + ": " + x.text).join("\n\n"), "", "# OPSLAAN", "Schrijf de samenvatting (zonder kopjes) naar een tijdelijk bestand en draai: node dnd/tools/claude-dm.js summary " + id + " " + upTo + " <bestand>"].join("\n"));
  }
  if (!n) console.log("Geen samenvattingen nodig (gebruik --force om vanaf 4 berichten toch samen te vatten).");
}
function cmdCanonPut(cid, id, title, file, flags) {
  const old = get("/dnd/" + cp(cid, "canon/" + id)) || {};
  const rec = { ...old, title, text: fs.readFileSync(file, "utf8"), t: Date.now() };
  if (flags.opening) rec.opening = true;
  if (typeof flags.keywords === "string") rec.keywords = flags.keywords;
  update({ [cp(cid, "canon/" + id)]: rec });
  console.log("Canon-document '" + id + "' opgeslagen (" + rec.text.length + " tekens)");
}
function cmdNew(title, flags) {
  if (!title) throw new Error("Geef een titel: new \"Titel\" [--from=c1] [--setting=<id> --party=Speler=personagesleutel,...]");
  if (typeof flags.setting === "string" && flags.setting !== Settings.DEFAULT_ID) return cmdNewOther(title, flags);
  const tpl = get("/dnd/worldTemplate"), src = typeof flags.from === "string" ? flags.from : "sjabloon", canon = src === "sjabloon" ? (tpl && tpl.canon) : get("/dnd/" + cp(src, "canon"));
  if (!canon) throw new Error("Geen canon gevonden (" + src + "); draai build-world-template.js of gebruik --from=<verhaal>");
  if (!tpl || !tpl.world) throw new Error("Wereldsjabloon ontbreekt (draai build-world-template.js)");
  const id = pushId(), now = Date.now(), up = {};
  up["campaignIndex/" + id] = { title: title, created: now, lastPlayed: now, round: 0, openingBy: "claude" };
  up[cp(id, "canon")] = canon; up[cp(id, "world")] = tpl.world; if (tpl.dmnotes) up[cp(id, "dmnotes")] = tpl.dmnotes;
  up[cp(id, "turn")] = { round: 0, status: "claude", awaiting: null, handoff: { to: "claude", reason: "Openingsbeurt van het verhaal" } };
  update(up);
  console.log("Verhaal aangemaakt: " + id + " (" + title + "). Speel de opening: node dnd/tools/claude-dm.js context " + id + " --canon");
}
/* Nieuw verhaal in een andere setting dan Midden-aarde (zelfde opbouw als "Nieuw verhaal" in de app): canon uit de setting (A1, R1 van het spelsysteem, C1, S1-S3), leeg wereldregister, snapshot van de setting. */
function cmdNewOther(title, flags) {
  const sid = flags.setting;
  if (!Settings.SETTINGS[sid]) { try { const raw = get("/dnd/settings/" + sid + "/json"); if (raw) Settings.registerCustom(Object.assign(JSON.parse(raw), { id: sid })); } catch (e) { /* onbekend */ } }
  if (!Settings.SETTINGS[sid]) throw new Error("Onbekende setting: " + sid + " (bekend: " + Settings.list().map(x => x.id).join(", ") + ")");
  const S = Settings.get(sid), cd = Settings.canonDocs(sid); if (!cd) throw new Error("Deze setting heeft geen canon.");
  const R = Rulesets.get(S.ruleset);
  if (R.id === "dnd2024") { const r1 = get("/dnd/worldTemplateBijbel/canon/r1_regels_2024"); if (r1) cd.r1_regels_2024 = r1; }
  const party = {}; String(flags.party || "").split(",").map(x => x.trim()).filter(Boolean).forEach(x => { const i = x.indexOf("="); party[i < 0 ? x : x.slice(0, i)] = i < 0 ? "" : x.slice(i + 1); });
  if (!Object.keys(party).length) throw new Error("Geef de spelers: --party=Gerben=<personagesleutel>[,Maurits=<sleutel>] (een lege sleutel = nog een personage te maken)");
  const id = pushId(), now = Date.now(), up = {};
  if (typeof flags.start === "string" && flags.start.trim()) cd.p1_startsituatie = { title: "P1 Startsituatie (opgegeven door de spelers)", text: "# P1 Startsituatie\n" + flags.start.trim(), t: now };
  up["campaignIndex/" + id] = { title: title, created: now, lastPlayed: now, round: 0, party: party, ownTables: true, settingId: sid, snap: true, openingBy: "claude" };
  up[cp(id, "canon")] = cd; up[cp(id, "world")] = { lastRound: 0 }; up[cp(id, "setting")] = JSON.stringify(S);
  up[cp(id, "turn")] = { round: 0, status: "claude", awaiting: null, handoff: { to: "claude", reason: "Openingsbeurt van het verhaal" } };
  update(up);
  console.log("Verhaal aangemaakt: " + id + " (" + title + "; setting " + S.name + ", spelsysteem " + R.label + "). Speel de opening: node dnd/tools/claude-dm.js context " + id + " --canon");
}
/* Losse statePatch (bijv. dagboek aanvullen) zonder beurt: deep merge in de Stand en in de laatste Stand-versie; ronde, status en aan-zet blijven onaangeroerd. */
function cmdStatePatch(cid, file) {
  const patch = JSON.parse(fs.readFileSync(file, "utf8"));
  if (!patch || typeof patch !== "object" || Array.isArray(patch)) throw new Error("Patch moet een JSON-object zijn.");
  const stateStr = get("/dnd/" + cp(cid, "state")) || "{}";
  const merged = JSON.stringify(deepMerge(JSON.parse(typeof stateStr === "string" ? stateStr : JSON.stringify(stateStr)), patch));
  const up = { [cp(cid, "state")]: merged };
  const lastS = get("/dnd/" + cp(cid, "stands"), "--order-by-key --limit-to-last 1");
  const lastKey = lastS ? Object.keys(lastS)[0] : null;
  if (lastKey) up[cp(cid, "stands/" + lastKey + "/json")] = merged;
  update(up);
  console.log("Stand bijgewerkt (ronde, status en aan-zet ongewijzigd).");
}
function cmdMemory(cid, text) { update({ [cp(cid, "memories/" + pushId())]: { text, by: "Claude", t: Date.now() } }); console.log("Herinnering toegevoegd."); }

/* Logboek bekijken en opschonen (Dagboek, tabblad Logboek). Alleen voor oudere rondes; verwijder of vervang nooit regels van de lopende ronde (Terug verwijdert die op sleutel). */
function cmdLog(cid, flags) {
  const L = get("/dnd/" + cp(cid, "log")) || {};
  const van = flags.van ? Number(flags.van) : 0, tot = flags.tot ? Number(flags.tot) : 1e9;
  Object.keys(L).sort().filter(k => (L[k].round || 0) >= van && (L[k].round || 0) <= tot).forEach(k => console.log(k + " | r" + (L[k].round || "?") + " | " + (L[k].inGameDate || "") + " | " + (L[k].fact || "")));
}
function cmdLogEdit(cid, file) {
  const ed = JSON.parse(fs.readFileSync(file, "utf8"));
  const L = get("/dnd/" + cp(cid, "log")) || {};
  const bak = path.join(os.tmpdir(), "dnd-log-backup-" + Date.now() + ".json"); fs.writeFileSync(bak, JSON.stringify(L));
  const up = {}; let del = 0, rep = 0;
  (ed.delete || []).forEach(k => { if (!L[k]) throw new Error("onbekende sleutel " + k); up[cp(cid, "log/" + k)] = null; del++; });
  (ed.replace || []).forEach(r => {
    const ks = r.keys || []; if (!ks.length || !r.fact) throw new Error("replace heeft keys en fact nodig");
    ks.forEach(k => { if (!L[k]) throw new Error("onbekende sleutel " + k); });
    up[cp(cid, "log/" + ks[0] + "/fact")] = String(r.fact);
    if (r.inGameDate) up[cp(cid, "log/" + ks[0] + "/inGameDate")] = String(r.inGameDate);
    ks.slice(1).forEach(k => { up[cp(cid, "log/" + k)] = null; del++; }); rep++;
  });
  if (!Object.keys(up).length) { console.log("Niets te doen."); return; }
  update(up);
  console.log("Logboek bijgewerkt: " + rep + " samengevoegd/vervangen, " + del + " verwijderd. Back-up van de oude log: " + bak);
}

/* ---------- main ---------- */
const argv = process.argv.slice(2), flags = {}, pos = [];
for (const a of argv) { if (a.startsWith("--")) { const i = a.indexOf("="), k = i < 0 ? a.slice(2) : a.slice(2, i); flags[k] = i < 0 ? true : a.slice(i + 1); } else pos.push(a); } /* waarde = alles na het eerste = (ook --party=Gerben=sleutel) */
try {
  const cmd = pos[0];
  if (cmd === "status") cmdStatus();
  else if (cmd === "context") cmdContext(pos[1], flags);
  else if (cmd === "prompt") cmdPrompt(pos[1]);
  else if (cmd === "apply") cmdApply(pos[1], pos[2], flags);
  else if (cmd === "summary") cmdSummary(pos[1], pos[2], pos[3]);
  else if (cmd === "summary-todo") cmdSummaryTodo(pos[1], flags);
  else if (cmd === "canon-put") cmdCanonPut(pos[1], pos[2], pos[3], pos[4], flags);
  else if (cmd === "state-patch") cmdStatePatch(pos[1], pos[2]);
  else if (cmd === "log") cmdLog(pos[1], flags);
  else if (cmd === "log-edit") cmdLogEdit(pos[1], pos[2]);
  else if (cmd === "memory-add") cmdMemory(pos[1], pos[2]);
  else if (cmd === "level-up") cmdLevelUp(pos[1], pos[2], pos[3], pos.slice(4).join(" "));
  else if (cmd === "level-up-ack") cmdLevelUpAck(pos[1], pos[2]);
  else if (cmd === "table-set") cmdTableSet(pos[1], pos[2]);
  else if (cmd === "table-reply") cmdTableReply(pos[1], pos[2]);
  else if (cmd === "table-show") cmdTableShow(pos[1]);
  else if (cmd === "new") cmdNew(pos[1], flags);
  else console.log("Gebruik: status | context <cid> [--canon] | apply <cid> <json> [--force] | summary <cid> <totRonde> <bestand> | canon-put <cid> <id> <titel> <bestand> | memory-add <cid> <tekst>");
} catch (e) { console.error("FOUT:", e.message); process.exit(1); }
