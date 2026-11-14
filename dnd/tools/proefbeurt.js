#!/usr/bin/env node
/* Proefbeurten met de echte DM (Anthropic API) op een wegwerpverhaal, om te zien of het model de worldDelta-regels volgt.
   Leest de API-sleutel uit /dnd/config in het geheugen (wordt nooit getoond of opgeslagen), bouwt de context met claude-dm.js,
   roept de API aan met dezelfde systeemprompt als de app en past het antwoord toe met claude-dm.js apply (dus met dezelfde validatie).
   Gebruik: node dnd/tools/proefbeurt.js [--rounds=3] [--keep] [--model=claude-haiku-5-5]
   Het wegwerpverhaal (zz_proef) wordt na afloop verwijderd, tenzij --keep. Kost API-tegoed. Geen geheimen in dit bestand. */
"use strict";
const { spawnSync } = require("child_process");
const fs = require("fs"), os = require("os"), path = require("path");
const PROJECT = "kthulp-certamen", CID = "zz_proef";
const flags = {}; process.argv.slice(2).forEach(a => { if (a.startsWith("--")) { const i = a.indexOf("="); flags[a.slice(2, i < 0 ? undefined : i)] = i < 0 ? true : a.slice(i + 1); } });
const fb = (args) => { const r = spawnSync("firebase " + args + " --project " + PROJECT, { shell: true, encoding: "utf8", maxBuffer: 1 << 28, env: { ...process.env, MSYS_NO_PATHCONV: "1" } }); if (r.status !== 0) throw new Error("firebase faalde: " + (r.stderr || r.stdout).slice(0, 300)); return r.stdout; };
const get = p => { const o = fb("database:get \"" + p + "\"").trim(); return !o || o === "null" ? null : JSON.parse(o); };
const update = u => { const f = path.join(os.tmpdir(), "proef-" + Date.now() + ".json"); fs.writeFileSync(f, JSON.stringify(u)); try { fb("database:update /dnd \"" + f + "\" --force"); } finally { fs.unlinkSync(f); } };
const dm = (args) => { const r = spawnSync("node", [path.join(__dirname, "claude-dm.js")].concat(args), { encoding: "utf8", maxBuffer: 1 << 28 }); return { code: r.status, out: (r.stdout || "") + (r.stderr || "") }; };

function systemPrompt() {
  const t = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8"), i = t.indexOf("const SYSTEM=`");
  if (i < 0) throw new Error("SYSTEM niet gevonden in index.html");
  const j = t.indexOf("`;", i); return new Function("return `" + t.slice(i + "const SYSTEM=`".length, j) + "`")();
}
async function ask(sys, user, cfg, model) {
  const res = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "content-type": "application/json", "x-api-key": cfg.anthropicKey, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({ model: model, max_tokens: 2500, thinking: { type: "disabled" }, system: sys, messages: [{ role: "user", content: user }] }) });
  const j = await res.json();
  if (!res.ok) throw new Error("Claude " + res.status + ": " + ((j.error && j.error.message) || "fout"));
  return { txt: (j.content || []).filter(b => b.type === "text").map(b => b.text).join(""), usage: j.usage || {}, stop: j.stop_reason, blocks: (j.content || []).map(b => b.type + ":" + (b.text || b.thinking || "").length).join(",") };
}
const ROUNDS = [
  null, /* opening */
  [["Gerben", "Wulfgrim loopt rustig door de tuinen van Rivendell, groet de mensen die hij tegenkomt en vraagt een gast of er nieuws is van de wegen in Eriador."], ["Maurits", "Tharon zoekt de bibliotheek op om zijn verslag over de Orc-patrouille bij Dol Guldur te laten lezen, en vraagt aan een Elf of iemand de Zwarte Spraak kent."]],
  [["Gerben", "Wulfgrim slaat een praatje met de bode die zojuist is aangekomen en vraagt hem wat hij precies in zijn bericht heeft gehoord."], ["Maurits", "Tharon helpt een kleine groep reizigers bij de stallen en wil weten waar ze naartoe gaan."]]
];

async function main() {
  const cfg = get("/dnd/config") || {};
  if (!cfg.anthropicKey) throw new Error("Geen Anthropic-sleutel in de app-instellingen gevonden");
  const model = typeof flags.model === "string" ? flags.model : (cfg.anthropicModel || "claude-haiku-5-5"), rounds = Math.min(3, Number(flags.rounds) || 3);
  const sys = systemPrompt(); console.log("Model:", model, "| systeemprompt", sys.length, "tekens");
  /* wegwerpverhaal: canon, wereldsjabloon en DM-notities zoals bij Nieuw verhaal */
  const tpl = get("/dnd/worldTemplate"), canon = get("/dnd/campaigns/c1/canon");
  if (!tpl || !tpl.world) throw new Error("wereldsjabloon ontbreekt");
  const now = Date.now(), base = "campaigns/" + CID + "/";
  update({ ["campaignIndex/" + CID]: { title: "Proefbeurten (wordt verwijderd)", created: now, lastPlayed: now, round: 0 }, [base + "canon"]: canon, [base + "world"]: tpl.world, [base + "dmnotes"]: tpl.dmnotes || {}, [base + "turn"]: { round: 0, status: "claude", awaiting: [], t: now } });
  let tokIn = 0, tokOut = 0, bad = 0;
  try {
    for (let r = 0; r < rounds; r++) {
      if (ROUNDS[r]) { const up = {}; ROUNDS[r].forEach((a, i) => { up[base + "pending/p" + r + i] = { name: a[0], text: a[1], round: r, t: now + r * 10 + i }; }); up[base + "turn"] = { round: r, status: "claude", awaiting: [], t: now + r * 10 }; update(up); }
      const ctx = dm(["context", CID]); if (ctx.code !== 0) throw new Error("context faalde: " + ctx.out.slice(0, 300));
      const t0 = Date.now(), ans = await ask(sys, ctx.out, cfg, model), secs = ((Date.now() - t0) / 1000).toFixed(1);
      tokIn += (ans.usage.input_tokens || 0) + (ans.usage.cache_read_input_tokens || 0) + (ans.usage.cache_creation_input_tokens || 0); tokOut += ans.usage.output_tokens || 0;
      let s = ans.txt.replace(/^```(?:json)?\s*/, "").replace(/```\s*$/, "").trim(); const a = s.indexOf("{"), b = s.lastIndexOf("}"); if (a >= 0 && b > a) s = s.slice(a, b + 1);
      let o; try { o = JSON.parse(s); } catch (e) { console.log("\n--- ronde " + (r + 1) + ": ONGELDIGE JSON van het model (" + e.message + ") ---"); bad++; console.log("stop_reason " + ans.stop + " | blokken " + ans.blocks + " | einde: " + JSON.stringify(ans.txt.slice(-160))); continue; }
      const f = path.join(os.tmpdir(), "proef-antwoord-" + r + ".json"); fs.writeFileSync(f, JSON.stringify(o));
      const wd = o.worldDelta || {};
      console.log("\n=== ronde " + (r + 1) + " (" + secs + " s, " + (ans.usage.input_tokens || 0) + "+" + (ans.usage.cache_read_input_tokens || 0) + " in, " + (ans.usage.output_tokens || 0) + " uit) ===");
      console.log("vertelling (" + String(o.narration || "").split(/\s+/).length + " woorden): " + String(o.narration || "").slice(0, 700));
      console.log("spraken: " + (o.speakers || []).join(", ") + " | rolls " + (o.rolls || []).length + " | dmNotes " + Object.keys(o.dmNotes || {}).join(",") + " | nieuwe NPC's " + (o.newNpcs || []).length);
      console.log("worldDelta: " + JSON.stringify({ region: wd.region, time: wd.time && wd.time.to, npcs: (wd.npcs || []).map(n => n.id + ":" + n.op + (n.set && n.set.status ? "→" + n.set.status : "") + (n.set && n.set.introduced ? " introduced" : "")), quests: (wd.quests || []).map(q => q.id + "→" + JSON.stringify(q.set)), clocks: (wd.clocks || []).map(c => c.id + c.delta), reveals: (wd.reveals || []).map(x => x.npc + "#" + x.layer), companions: (wd.companions || []).map(c => c.id + ":" + c.op), agendas: (wd.agendas || []).map(x => x.id + ":" + x.op), events: (wd.events || []).length }));
      let ap = dm(["apply", CID, f, "--force"]); let okAp = ap.code === 0;
      if (!okAp && /worldDelta ongeldig/.test(ap.out)) { /* zoals de app: één herkansing met de fouten erbij */
        console.log("1e poging geweigerd: " + ap.out.trim().split("\n").slice(0, 3).join(" / ").slice(0, 300));
        const ans2 = await ask(sys, ctx.out + "\n\nLET OP: je vorige antwoord werd geweigerd door de wereldcontrole: " + ap.out.trim().slice(0, 600) + "\nGeef een nieuw, geldig JSON-antwoord.", cfg, model);
        tokIn += (ans2.usage.input_tokens || 0) + (ans2.usage.cache_read_input_tokens || 0); tokOut += ans2.usage.output_tokens || 0;
        let s2 = ans2.txt.replace(/^```(?:json)?\s*/, "").replace(/```\s*$/, "").trim(); const a2 = s2.indexOf("{"), b2 = s2.lastIndexOf("}"); if (a2 >= 0 && b2 > a2) s2 = s2.slice(a2, b2 + 1);
        try { fs.writeFileSync(f, JSON.stringify(JSON.parse(s2))); ap = dm(["apply", CID, f, "--force"]); okAp = ap.code === 0; } catch (e) { console.log("herkansing: ongeldige JSON"); }
      }
      if (!okAp) bad++;
      console.log("toepassen: " + (okAp ? "gelukt" : "GEWEIGERD") + (ap.out.trim() ? " | " + ap.out.trim().split("\n").slice(0, 6).join(" / ").slice(0, 600) : ""));
      const w = get("/dnd/" + base + "world"); const aud = spawnSync("node", [path.join(__dirname, "validate-world.js"), CID], { encoding: "utf8" });
      console.log("audit na ronde: " + (aud.stdout || "").trim().split("\n").slice(-1)[0] + " | wereld: kalender " + JSON.stringify(w && w.calendar) + ", regio " + (w && w.sceneRegion) + ", lastRound " + (w && w.lastRound));
    }
  } finally {
    const w = get("/dnd/" + base + "world"); if (w) console.log("\nNa de proef: events " + Object.keys(w.events || {}).length + ", onthulde lagen " + Object.values(w.backstories || {}).reduce((n, x) => n + Object.keys(x.revealed || {}).length, 0) + ", NPC's geïntroduceerd " + Object.values(w.npcs || {}).filter(n => n.introduced).length);
    if (!flags.keep) { fb("database:remove /dnd/campaigns/" + CID + " --force"); fb("database:remove /dnd/campaignIndex/" + CID + " --force"); console.log("Wegwerpverhaal verwijderd."); }
  }
  console.log("Tokens: " + tokIn + " in, " + tokOut + " uit | beurten met problemen: " + bad);
}
main().catch(e => { console.error("Fout: " + String(e.message).replace(/sk-[A-Za-z0-9_-]+/g, "[sleutel]")); process.exit(1); });
