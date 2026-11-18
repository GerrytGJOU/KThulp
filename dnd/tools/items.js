#!/usr/bin/env node
/* Itemiconen bijhouden voor de Midden-aarde D&D-app (dnd/). Lokaal hulpmiddel; leest alleen (schrijft nooit naar Firebase).
   Opdrachten:
     todo [cid] [--all]                 alle voorwerpen uit de levende inventories, karakterbladen, quest-beloningen en canon-M9 die nog
                                        alleen een categorie-icoon (of "misc") hebben, gegroepeerd en gesorteerd op frequentie
                                        (--all toont ook de voorwerpen met een eigen groep). Zonder cid: het enige verhaal in de database.
     check                              controleert dat elk icoonbestand uit dnd/items.js bestaat, dat er geen dubbele id's of
                                        bestandsnamen zijn, dat geen enkel bestand te groot is en dat er geen verweesde bestanden in
                                        assets/items/ staan
     add <id> <categorie> <trefwoorden> <bestand>
                                        voegt een groep toe aan dnd/items.js (vóór de eerste algemene groep, dus met voorrang op de
                                        gewone groepen). <trefwoorden> = regex-bron zonder accenten, bv. "pijlkoker|arrow case";
                                        <bestand> = de naam in assets/items/ (bv. hand-crossbow.webp)
     sheet-prompt [n]                   schrijft een kant-en-klare ChatGPT-prompt (Engels) voor een blad van n (max 16) iconen uit de
                                        todo-lijst naar dnd/_prive/itemsheets/prompt-<datum>.txt en toont hem; ook de id's voor
                                        items-slice.py staan erbij
   Snijden na het downloaden van het blad:  python -I dnd/tools/items-slice.py <blad.png> <id1,...,id16>
   Daarna:  node dnd/tools/items.js add <id> <categorie> <trefwoorden> <id>.webp   en   node dnd/tools/items.js check
   Geen geheimen in dit bestand: alleen het (openbare) projectnummer. */
"use strict";
const { spawnSync } = require("child_process");
const fs = require("fs"), path = require("path");
const ROOT = path.join(__dirname, "..");
const ITEMS_JS = path.join(ROOT, "items.js");
const ICON_DIR = path.join(ROOT, "assets", "items");
const PRIVE = path.join(ROOT, "_prive", "itemsheets");
const PROJECT = "kthulp-certamen";
const Items = require("../items.js");

function fb(args) {
  const r = spawnSync("firebase " + args + " --project " + PROJECT, { shell: true, encoding: "utf8", maxBuffer: 1 << 28, env: { ...process.env, MSYS_NO_PATHCONV: "1" } });
  if (r.status !== 0) throw new Error("firebase " + args.split(" ")[0] + " faalde: " + (r.stderr || r.stdout || "").trim().slice(0, 300));
  return r.stdout;
}
function get(p, extra) {
  const out = fb("database:get \"" + p + "\"" + (extra ? " " + extra : "")).trim();
  if (!out || out === "null") return null;
  try { return JSON.parse(out); } catch (e) { return null; }
}
function resolveCid(arg) {
  if (arg && !arg.startsWith("--")) { if (get("/dnd/campaigns/" + arg + "/world", "--shallow") !== null || get("/dnd/campaigns/" + arg + "/state", "--shallow") !== null) return arg; }
  const keys = Object.keys(get("/dnd/campaigns", "--shallow") || {});
  if (keys.length === 1) return keys[0];
  throw new Error("Geef een geldig verhaal-id op. Beschikbaar: " + keys.join(", "));
}

/* Vergelijkbaar met itemText() in de app: een inventory-regel kan tekst of een object zijn. */
function itemText(x) {
  if (x == null) return "";
  if (typeof x === "string") return x;
  if (typeof x === "object") return x.name ? String(x.name) + (x.note ? " (" + x.note + ")" : "") : JSON.stringify(x);
  return String(x);
}
const isMoney = s => /^\d+\s*(gp|sp|cp|pp|ep)\b/i.test(s) || /\b\d+\s*gp\b/i.test(s);
/* Pakket-regels als "Explorer's Pack (a, b, c)" uitsplitsen, net als de app. */
function expand(s) {
  const m = s.match(/^(.*?)\s*\(([^)]*)\)\s*$/);
  if (m && /,/.test(m[2]) && /\b(pack|kit|set)\b/i.test(m[1])) return m[2].split(",").map(x => x.trim()).filter(Boolean);
  return [s];
}
const EXPLORER = ["Backpack", "Bedroll", "2 Oil Flasks", "10 dagen Rations", "50 ft Rope", "Tinderbox", "10 Torches", "Waterskin"];

function collect(cid) {
  const names = new Map(); // naam → {n, bron:Set}
  const add = (raw, bron) => {
    const s = String(raw || "").replace(/\s+/g, " ").trim();
    if (!s || isMoney(s) || /^unarmed strike$/i.test(s) || (/\)/.test(s) && !/\(/.test(s))) return;
    const key = s.toLowerCase();
    if (/^explorer'?s pack$/i.test(s)) EXPLORER.forEach(e => add(e, bron));
    expand(s).forEach(p => {
      const k = p.toLowerCase(), e = names.get(k) || { name: p, n: 0, bron: new Set() };
      e.n++; e.bron.add(bron); names.set(k, e);
    });
  };
  // 1. levende inventories in de Stand
  try {
    let st = get("/dnd/campaigns/" + cid + "/state");
    if (typeof st === "string") st = JSON.parse(st);
    Object.entries((st && st.pcs) || {}).forEach(([n, pc]) => (pc.inventory || []).forEach(x => add(itemText(x), "inventory " + n)));
  } catch (e) { console.error("Stand overgeslagen: " + e.message); }
  // 2. karakterbladen: uitrusting en aanvallen
  try {
    Object.values(get("/dnd/characters") || {}).forEach(c => {
      String(c.equipment || "").split(/;|\n+(?![^(]*\))/).forEach(x => add(x.replace(/\.\s.*$/, ""), "blad " + (c.name || "?")));
      (c.attacks || []).forEach(a => add(a.name, "aanval " + (c.name || "?")));
    });
  } catch (e) { console.error("Karakterbladen overgeslagen: " + e.message); }
  // 3. quest-beloningen in het wereldregister (alleen voorwerpen met een herkenbare naam, tussen "de/het/een ... van" en "(zie")
  try {
    Object.entries(get("/dnd/campaigns/" + cid + "/world/quests") || {}).forEach(([id, q]) => {
      const r = String(q.reward || "");
      (r.match(/\b(?:de|het|een)\s+[A-Z][\wÀ-ɏ'’ -]{2,60}?(?=\s+(?:voor|van|uit|\(|,|;|\.|$))/g) || []).forEach(x => add(x.replace(/^(de|het|een)\s+/i, ""), "quest " + id));
    });
  } catch (e) { console.error("Quests overgeslagen: " + e.message); }
  // 4. canon M9 (lokaal bestand): de voorbeeldlijst "- Naam (zeldzaamheid, ...)"
  try {
    let txt = fs.readFileSync(path.join(__dirname, "canon-m9-loot.txt"), "utf8");
    const i0 = txt.indexOf("KORT OVERZICHT"), i1 = txt.indexOf("BEWUSTE KOPPELINGEN");
    if (i0 >= 0) txt = txt.slice(i0, i1 > i0 ? i1 : undefined);
    (txt.match(/^- [^(:\n]{3,60}(?= \()/gm) || []).forEach(l => add(l.replace(/^- /, "").trim(), "canon M9"));
  } catch (e) { /* geen canonbestand */ }
  return [...names.values()];
}

function cmdTodo(args) {
  const cid = resolveCid(args.find(a => !a.startsWith("--")));
  const all = args.includes("--all");
  const list = collect(cid).map(e => ({ ...e, m: Items.match(e.name) }));
  const todo = list.filter(e => e.m.kind === "category" || e.m.kind === "misc");
  const show = all ? list : todo;
  show.sort((a, b) => b.n - a.n || a.name.localeCompare(b.name));
  console.log("Verhaal " + cid + ": " + list.length + " verschillende voorwerpen, " + todo.length + " alleen met categorie-icoon.");
  show.forEach(e => console.log(String(e.n).padStart(3) + "x  " + e.name.padEnd(46) + " → " + e.m.id + " (" + e.m.kind + ")  [" + [...e.bron].slice(0, 3).join(", ") + "]"));
  if (!show.length) console.log("Niets te doen: elk bekend voorwerp heeft een eigen icoon.");
}

function cmdCheck() {
  let fouten = 0; const err = m => { console.log("FOUT  " + m); fouten++; };
  const ids = new Set(), files = new Set();
  Items.GROUPS.forEach(g => {
    if (ids.has(g.id)) err("dubbele id: " + g.id); ids.add(g.id);
    if (files.has(g.file)) err("dubbel bestand: " + g.file); files.add(g.file);
    try { new RegExp(g.re); } catch (e) { err("ongeldige regex in " + g.id + ": " + e.message); }
    if (!Items.CATS[g.cat]) err("onbekende categorie in " + g.id + ": " + g.cat);
  });
  Object.keys(Items.CATS).forEach(k => files.add(Items.CATS[k].file));
  const onDisk = fs.existsSync(ICON_DIR) ? fs.readdirSync(ICON_DIR) : [];
  Items.allFiles().forEach(f => { if (!onDisk.includes(f)) err("icoonbestand ontbreekt: assets/items/" + f); });
  onDisk.forEach(f => {
    if (!files.has(f)) err("verweesd bestand (in geen enkele groep): assets/items/" + f);
    const sz = fs.statSync(path.join(ICON_DIR, f)).size;
    if (sz > 20000) err(f + " is " + sz + " bytes (te groot; houd het onder ~15 KB)");
  });
  const total = onDisk.reduce((s, f) => s + fs.statSync(path.join(ICON_DIR, f)).size, 0);
  console.log(Items.GROUPS.length + " groepen + " + Object.keys(Items.CATS).length + " categorie-vangnetten, " + onDisk.length + " bestanden, " + (total / 1024).toFixed(0) + " KB totaal.");
  console.log(fouten ? fouten + " fout(en)." : "Alles in orde.");
  process.exitCode = fouten ? 1 : 0;
}

function cmdAdd(args) {
  const [id, cat, re, file] = args;
  if (!id || !cat || !re || !file) throw new Error("Gebruik: add <id> <categorie> <trefwoorden> <bestand>");
  if (!Items.CATS[cat]) throw new Error("Onbekende categorie '" + cat + "'. Kies uit: " + Object.keys(Items.CATS).join(", "));
  if (Items.GROUPS.some(g => g.id === id)) throw new Error("Id bestaat al: " + id);
  try { new RegExp(re); } catch (e) { throw new Error("Ongeldige regex: " + e.message); }
  if (!fs.existsSync(path.join(ICON_DIR, file))) throw new Error("Bestand ontbreekt: assets/items/" + file + " (snijd eerst het icoon met items-slice.py)");
  let src = fs.readFileSync(ITEMS_JS, "utf8");
  const marker = "    /* --- wapens --- */";
  if (!src.includes(marker)) throw new Error("Invoegplek niet gevonden in items.js; voeg de groep handmatig toe.");
  const line = "    { id: " + JSON.stringify(id) + ", cat: " + JSON.stringify(cat) + ", re: " + JSON.stringify(re) + ", file: " + JSON.stringify(file) + (/^(unique)$/.test(args[4] || "") ? ", unique: true" : "") + " },\n";
  src = src.replace(marker, line + marker);
  fs.writeFileSync(ITEMS_JS, src);
  console.log("Groep toegevoegd: " + id + ". Controleer met: node dnd/tools/items.js check  (en test de match met todo).");
}

const STYLE = "Create ONE image: an icon sheet with a strict 4 x 4 grid (16 cells, equal size, generous white space between cells, no grid lines, no frames), illustrating items for a Tolkien-themed tabletop role-playing game inventory, drawn like a museum catalogue of historical artefacts. Style: fine dark-brown ink line art with a light watercolour wash, in the style of a Tolkien / Lord of the Rings manuscript illustration, with muted natural colours, matching the existing inventory icons (leather, iron, linen, wood in natural tones). Each cell contains exactly ONE single object, centred, seen straight from the front or in a clear three-quarter view, no hands, no people, no shadows on the ground, pure flat white background (#FFFFFF), no text, no letters, no frames, no parchment texture. Avoid: gaming-icon glow, cartoon or anime style, photorealism, neon, any text, blood.";
const slugId = s => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "item";
function cmdSheetPrompt(args) {
  const n = Math.min(16, Math.max(1, parseInt(args.find(a => /^\d+$/.test(a)) || "16", 10)));
  const cidArg = args.find(a => !/^\d+$/.test(a) && !a.startsWith("--"));
  const cid = resolveCid(cidArg);
  const todo = collect(cid).map(e => ({ ...e, m: Items.match(e.name) })).filter(e => e.m.kind === "category" || e.m.kind === "misc");
  todo.sort((a, b) => b.n - a.n || a.name.localeCompare(b.name));
  const pick = todo.slice(0, n);
  if (!pick.length) { console.log("Niets te doen: elk bekend voorwerp heeft een eigen icoon."); return; }
  const ids = pick.map(e => slugId(e.name));
  const cells = pick.map((e, i) => "(" + (i + 1) + ") the item \"" + e.name.replace(/"/g, "'") + "\" as a single clearly recognisable object in this fantasy setting");
  const rows = []; for (let r = 0; r * 4 < cells.length; r++) rows.push("Row " + (r + 1) + ": " + cells.slice(r * 4, r * 4 + 4).join(", ") + ".");
  const prompt = STYLE + " Contents, row by row, left to right. " + rows.join(" ") + (pick.length < 16 ? " Leave the remaining cells completely empty (white)." : "");
  const file = path.join(PRIVE, "prompt-" + new Date().toISOString().slice(0, 10) + ".txt");
  fs.mkdirSync(PRIVE, { recursive: true });
  const slice = "python -I dnd/tools/items-slice.py <blad.png> " + ids.concat(new Array(16 - ids.length).fill("-")).join(",");
  fs.writeFileSync(file, prompt + "\n\n--- na het downloaden ---\n" + slice + "\n(daarna per nieuwe groep: node dnd/tools/items.js add <id> <categorie> <trefwoorden> <id>.webp; dan check)\n");
  console.log(prompt + "\n\nBewaard in " + path.relative(path.join(ROOT, ".."), file) + "\n" + slice);
  console.log("\nVoorwerpen in dit blad:");
  pick.forEach((e, i) => console.log("  " + (i + 1) + ". " + e.name + " → id " + ids[i] + "  (nu: " + e.m.id + ")"));
}

const [cmd, ...rest] = process.argv.slice(2);
try {
  if (cmd === "todo") cmdTodo(rest);
  else if (cmd === "check") cmdCheck();
  else if (cmd === "add") cmdAdd(rest);
  else if (cmd === "sheet-prompt") cmdSheetPrompt(rest);
  else console.log(fs.readFileSync(__filename, "utf8").split("*/")[0].replace("#!/usr/bin/env node\n", ""));
} catch (e) { console.error("FOUT: " + e.message); process.exit(1); }
