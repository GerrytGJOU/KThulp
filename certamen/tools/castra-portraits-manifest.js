/* Schrijft assets/portraits/MANIFEST.md: elke persoon die in een gesprek een portret kan krijgen, met de bestandsnaam en of die er al is.
   node tools/castra-portraits-manifest.js   (vanuit certamen/) */
const { load } = require("./castra-colo-node.js"), vm = require("vm"), fs = require("fs"), path = require("path");
const w = load({ H(){} }); const run = s => vm.runInContext(s, w.ctx);
const dir = path.join(__dirname, "..", "assets", "portraits");
const slug = s=>String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"");
const sheets = JSON.parse(run("JSON.stringify(CASTRA_PORTRAIT_SHEETS)"));
const rows = {};
const add = (name, kind, where)=>{ const s = slug(name); if(!s) return; (rows[s] = rows[s] || { name, kinds:new Set(), where:new Set() }); rows[s].kinds.add(kind); rows[s].where.add(where); };
JSON.parse(run(`JSON.stringify(CASTRA_WENT.filter(e=>e.kind==="npc"||e.kind==="trainer").map(e=>[e.nm||e.id, e.kind==="trainer"?"trainer":(e.role||"persoon"), e.region]))`)).forEach(([n,k,r])=>add(n,k,r));
JSON.parse(run(`JSON.stringify(Object.keys(CASTRA_HERO_DATA).map(id=>[id, "held", "-"]))`)).forEach(([n,k,r])=>add(n,k,r));
const have = s=>fs.existsSync(path.join(dir, s+".png")) || !!sheets[s];
const list = Object.keys(rows).sort(), missing = list.filter(s=>!have(s));
let md = "# Portretten (gegenereerd, niet met de hand bewerken)\n\n" + list.length + " personen, " + (list.length-missing.length) + " met portret, " + missing.length + " zonder.\n\nBestand = `assets/portraits/<naam>.png` (144 x 144); zie README.txt (ook voor RPG Maker-gezichtenbladen).\n\n| Bestand | Naam | Soort | Waar | Aanwezig |\n|---|---|---|---|---|\n";
list.forEach(s=>{ const r = rows[s]; md += "| " + s + ".png | " + r.name + " | " + [...r.kinds].join(", ") + " | " + [...r.where].slice(0,4).join(", ") + ([...r.where].length>4?" …":"") + " | " + (have(s)?"ja":"nee") + " |\n"; });
fs.writeFileSync(path.join(dir, "MANIFEST.md"), md);
console.log(list.length + " personen, " + missing.length + " zonder portret -> assets/portraits/MANIFEST.md");
