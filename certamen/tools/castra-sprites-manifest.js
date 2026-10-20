// Overzicht van ontbrekende vormsprites: node certamen/tools/castra-sprites-manifest.js
// Schrijft certamen/assets/sprites-forms/MANIFEST.md (per volk en tak: ✅ aanwezig, ⬜ ontbreekt).
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..");
const src = fs.readFileSync(path.join(root, "castra-troops.js"), "utf8").replace(/\bconst /g, "var ").replace(/\blet /g, "var ");
new Function("CASTRA_BASE_STATS", "CASTRA_STATS", "CASTRA_INGENIA", src + ";global.F=CASTRA_FORM_LIST;global.FOLKS=CASTRA_FOLKS;")({}, [], []);
const dir = path.join(root, "assets", "sprites-forms");
const kinds = ["battle_front", "battle_back", "td"];
const has = (id, k) => fs.existsSync(path.join(dir, id + "_" + k + ".png"));
let out = "# Vormsprites — stand van zaken\n\nGegenereerd door `certamen/tools/castra-sprites-manifest.js`. Per vorm: voor / achter / tower defence.\n\n";
let tot = 0, got = 0;
Object.keys(FOLKS).forEach(v => {
  const forms = F.filter(f => f.volk === v); if (!forms.length) return;
  out += "## " + FOLKS[v].nm + "\n\n| Vorm | bestandsnaam | voor | achter | td |\n|---|---|---|---|---|\n";
  forms.forEach(f => {
    const r = kinds.map(k => { tot++; const h = has(f.id, k); if (h) got++; return h ? "✅" : "⬜"; });
    out += `| ${f.nm} (tier ${f.tier}) | \`${f.id}\` | ${r.join(" | ")} |\n`;
  });
  out += "\n";
});
out = out.replace("\n\n", `\n\n**${got} / ${tot}** bestanden aanwezig.\n\n`);
fs.writeFileSync(path.join(dir, "MANIFEST.md"), out);
console.log(got + " / " + tot + " bestanden aanwezig → assets/sprites-forms/MANIFEST.md");
