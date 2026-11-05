/* Heldenkamp — frequentielijst van de tikbare Nederlandse woorden (hoofdtekst van de la/nl-paren, na vertaling).
   node woorden.js [aantal]   schrijft woorden-open.json: woorden zonder Engelse glos, op frequentie. */
const fs = require('fs'), path = require('path');
const { collect, vertaal, laadCatalogus, SKIP_FILES } = require('./lib');
const cat = laadCatalogus();
const ROOT = path.join(__dirname, '..', 'certamen');
const norm = w => w.toLowerCase().replace(/^[^a-zà-ÿ]+|[^a-zà-ÿ]+$/g, '');
const freq = new Map();
for (const f of fs.readdirSync(ROOT).filter(f => /^castra.*\.js$/.test(f) && !SKIP_FILES.test(f))) {
  for (const n of collect(fs.readFileSync(path.join(ROOT, f), 'utf8'))) {
    if (!n.pair || n.pair.rol !== 'la') continue;
    const t = vertaal(cat, f, n); if (typeof t !== 'string') continue;
    for (const w of t.replace(/\{naam\}/g, ' ').split(/\s+/)) { const k = norm(w); if (k.length > 0) freq.set(k, (freq.get(k) || 0) + 1); }
  }
}
// Leesteksten (overlay/lezen-*.json): alle zinnen zijn tikbaar
for (const f of fs.existsSync(path.join(__dirname, 'overlay')) ? fs.readdirSync(path.join(__dirname, 'overlay')).filter(f => /^(lezen|luisteren|schrijven|praten)-.*.json$/.test(f)) : []) {
  for (const t of JSON.parse(fs.readFileSync(path.join(__dirname, 'overlay', f), 'utf8'))) for (const s of (t.s || t.model || [])) for (const x of s[0].split(/\s+/)) { const k = norm(x); if (k.length > 0) freq.set(k, (freq.get(k) || 0) + 1); }
}
const gloss = {};
const dir = path.join(__dirname, 'overlay');
if (fs.existsSync(dir)) for (const f of fs.readdirSync(dir).filter(f => /^woordenboek.*\.json$/.test(f))) Object.assign(gloss, JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')));
const alle = [...freq.entries()].sort((a, b) => b[1] - a[1]);
const open = alle.filter(([w]) => !(w in gloss));
const maxN = +process.argv[2] || open.length;
fs.writeFileSync(path.join(__dirname, 'woorden-open.json'), JSON.stringify(open.slice(0, maxN).map(x => x[0])));
const dekking = alle.reduce((s, [w, c]) => s + (w in gloss ? c : 0), 0), tot = alle.reduce((s, [, c]) => s + c, 0);
console.log(`unieke woorden: ${alle.length}, open: ${open.length}, dekking van alle voorkomens: ${(100 * dekking / tot).toFixed(1)}%`);
