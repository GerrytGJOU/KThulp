/* Heldenkamp — bouw. Gebruik:  node build.js
   Kopieert certamen/ en assets/ naar heldenkamp/dist/ en vervangt in elk castra*.js
   de fragmenten die in nl.json staan door hun Nederlandse vertaling. Fragmenten zonder
   vertaling blijven ongewijzigd (zo blijft het spel altijd werken). */
const fs = require('fs'), path = require('path');
const { collect, vertaal, render, laadCatalogus, SKIP_FILES } = require('./lib');

const REPO = path.join(__dirname, '..');
const DIST = process.env.HK_DIST ? path.resolve(process.env.HK_DIST) : path.join(__dirname, 'dist');
const catalogus = laadCatalogus();

function kopieer(van, naar) {
  fs.mkdirSync(naar, { recursive: true });
  for (const e of fs.readdirSync(van, { withFileTypes: true })) {
    if (e.name === 'tools' || e.name === 'node_modules' || e.name.startsWith('.')) continue;
    const a = path.join(van, e.name), b = path.join(naar, e.name);
    if (e.isDirectory()) kopieer(a, b); else fs.copyFileSync(a, b);
  }
}
fs.rmSync(DIST, { recursive: true, force: true });
kopieer(path.join(REPO, 'certamen'), path.join(DIST, 'certamen'));
kopieer(path.join(REPO, 'assets'), path.join(DIST, 'assets'));

let totaal = 0;
for (const f of fs.readdirSync(path.join(DIST, 'certamen')).filter(f => /^castra.*\.js$/.test(f) && !SKIP_FILES.test(f))) {
  const p = path.join(DIST, 'certamen', f);
  let src = fs.readFileSync(p, 'utf8');
  const nodes = collect(src).filter(n => vertaal(catalogus, f, n) !== undefined).sort((a, b) => b.start - a.start);
  if (!nodes.length) continue;
  for (const n of nodes) {
    const vert = vertaal(catalogus, f, n);
    if (vert === '' || vert == null) continue;
    src = src.slice(0, n.start) + render(n, vert, n.cooked) + src.slice(n.end);
    totaal++;
  }
  fs.writeFileSync(p, src);
}
console.log(`Gebouwd in heldenkamp/dist/ — ${totaal} fragmenten vervangen.`);
