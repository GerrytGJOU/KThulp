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
// Alleen de inhoud wissen, niet de map zelf: een draaiende preview-server houdt de map vast (Windows: EPERM).
fs.mkdirSync(DIST, { recursive: true });
for (const e of fs.readdirSync(DIST)) {
  try { fs.rmSync(path.join(DIST, e), { recursive: true, force: true }); }
  catch (err) { if (err.code !== 'EPERM' && err.code !== 'EBUSY') throw err; }   // in gebruik door een server: map blijft staan, inhoud wordt overschreven
}
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
// Nederlandse woordhulp (overlay): woordenboek in een script na alle castra-scripts laden
{
  const dirO = path.join(__dirname, 'overlay');
  const gloss = {};
  for (const f of fs.readdirSync(dirO).filter(f => /^woordenboek.*\.json$/.test(f)).sort()) Object.assign(gloss, JSON.parse(fs.readFileSync(path.join(dirO, f), 'utf8')));
  let js = fs.readFileSync(path.join(dirO, 'heldenkamp-nl.js'), 'utf8').replace('/*HK_GLOSS*/{}', () => JSON.stringify(gloss))
    .replace('/*HK_WORDQUIZ*/[]', () => JSON.stringify([].concat(...fs.readdirSync(dirO).filter(f => /^woordquiz.*\.json$/.test(f)).sort().map(f => JSON.parse(fs.readFileSync(path.join(dirO, f), 'utf8'))))));
  js = js.replace('/*HK_DEHET*/[]', () => JSON.stringify([].concat(...fs.readdirSync(dirO).filter(f => /^dehet.*.json$/.test(f)).sort().map(f => JSON.parse(fs.readFileSync(path.join(dirO, f), 'utf8'))))));
  fs.writeFileSync(path.join(DIST, 'certamen', 'heldenkamp-nl.js'), js);
  const ip = path.join(DIST, 'certamen', 'index.html');
  let html = fs.readFileSync(ip, 'utf8');
  // Eigen opslag: Heldenkamp en de Latijn/Grieks-site delen een domein (github.io), dus localStorage-sleutels krijgen een voorvoegsel.
  const shim = '<script>(function(){var P="hk_",S=Storage.prototype,g=S.getItem,s=S.setItem,r=S.removeItem;S.getItem=function(k){return g.call(this,this===localStorage?P+k:k)};S.setItem=function(k,v){return s.call(this,this===localStorage?P+k:k,v)};S.removeItem=function(k){return r.call(this,this===localStorage?P+k:k)};})();</script>';
  html = html.replace('<meta charset="UTF-8">', m => m + shim).replace(/<title>[^<]*<\/title>/, '<title>Heldenkamp</title>').replace('content="Certamen"', 'content="Heldenkamp"');
  const re = /<script src="castra[^"]*"><\/script>/g; let last = null, m;
  while ((m = re.exec(html))) last = m;
  if (last) { html = html.slice(0, last.index + last[0].length) + '\n<script src="heldenkamp-nl.js"></script>' + html.slice(last.index + last[0].length); fs.writeFileSync(ip, html); }
  else console.warn('WAARSCHUWING: geen castra-script gevonden in index.html; heldenkamp-nl.js niet ingevoegd');
}
console.log(`Gebouwd in heldenkamp/dist/ — ${totaal} fragmenten vervangen.`);
