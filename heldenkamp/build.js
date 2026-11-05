/* Heldenkamp — bouw. Gebruik:  node build.js
   Kopieert certamen/ en assets/ naar heldenkamp/dist/ en vervangt in elk castra*.js
   de fragmenten die in nl.json staan door hun Nederlandse vertaling. Fragmenten zonder
   vertaling blijven ongewijzigd (zo blijft het spel altijd werken). */
const fs = require('fs'), path = require('path');
const { collect, vertaal, render, laadCatalogus, paar, SKIP_FILES } = require('./lib');

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
const EN_STOP = new Set('the a an of to and is are you your for with in on at it this that from will can not be as or by my we they he she'.split(' '));
const enSet = new Set();   // Engelse hulpteksten, voor de aan/uit-schakelaar in het spel (heldenkamp-nl.js)
for (const f of fs.readdirSync(path.join(DIST, 'certamen')).filter(f => /^castra.*\.js$/.test(f) && !SKIP_FILES.test(f))) {
  const p = path.join(DIST, 'certamen', f);
  let src = fs.readFileSync(p, 'utf8');
  const nodes = collect(src).filter(n => vertaal(catalogus, f, n) !== undefined).sort((a, b) => b.start - a.start);
  if (!nodes.length) continue;
  for (const n of nodes) {
    const vert = vertaal(catalogus, f, n);
    { const pr = paar(n, f); if (pr && pr.rol === 'nl' && typeof vert === 'string' && vert.trim().length > 1) enSet.add(vert.trim()); }
    if (vert === '' || vert == null) continue;
    src = src.slice(0, n.start) + render(n, vert, n.cooked) + src.slice(n.end);
    totaal++;
  }
  fs.writeFileSync(p, src);
}
// Nederlandse woordhulp (overlay): woordenboek in een script na alle castra-scripts laden
{
  const dirO = path.join(__dirname, 'overlay');
  // Oefeninhoud per niveau: overlay/<naam>-a1|a2|b1.json -> { A1:[...], A2:[...], B1:[...] }
  const perNiveau = pre => { const o = { A1: [], A2: [], B1: [] }; for (const f of fs.readdirSync(dirO)) { const m = f.match(new RegExp('^' + pre + '-(a1|a2|b1)\.json$')); if (m) o[m[1].toUpperCase()] = JSON.parse(fs.readFileSync(path.join(dirO, f), 'utf8')); } return o; };
  const gloss = {};
  for (const f of fs.readdirSync(dirO).filter(f => /^woordenboek.*\.json$/.test(f)).sort()) Object.assign(gloss, JSON.parse(fs.readFileSync(path.join(dirO, f), 'utf8')));
  let js = fs.readFileSync(path.join(dirO, 'heldenkamp-nl.js'), 'utf8').replace('/*HK_GLOSS*/{}', () => JSON.stringify(gloss))
    ;
  js = js.replace('/*HK_VZ*/{}', () => JSON.stringify(perNiveau('voorzetsel')));
  js = js.replace('/*HK_WORDQUIZ*/{}', () => JSON.stringify(perNiveau('woordquiz')));
  js = js.replace('/*HK_TEST*/[]', () => fs.readFileSync(path.join(dirO, 'niveautest.json'), 'utf8').trim());
  js = js.replace('/*HK_WW*/{}', () => JSON.stringify(perNiveau('werkwoord')));
  js = js.replace('/*HK_LEZEN*/{}', () => JSON.stringify(perNiveau('lezen')));
  js = js.replace('/*HK_LUISTER*/{}', () => JSON.stringify(perNiveau('luisteren')));
  js = js.replace('/*HK_SCHRIJF*/{}', () => JSON.stringify(perNiveau('schrijven')));
  js = js.replace('/*HK_DEHET*/{}', () => JSON.stringify(perNiveau('dehet')));
  // Engelse hulpteksten uit de catalogus zelf: sleutels met "en::", en Nederlandse sleutels (woorden uit het woordenboek) met een Engelse waarde.
  {
    const glossKeys = new Set(Object.keys(gloss));
    for (const [k0, v] of Object.entries(catalogus)) {
      if (typeof v !== 'string' || v.trim().length < 2) continue;
      const k = k0.replace(/^[^:]*.js::/, '');
      if (k.startsWith('en::')) { enSet.add(v.trim()); continue; }
      const ws = k.toLowerCase().match(/[a-zà-ÿ']+/g) || [];
      const enWords = (v.toLowerCase().match(/[a-z']+/g) || []);
      const engelsAchtig = enWords.length && enWords.some(w => EN_STOP.has(w)) && !ws.some(w => EN_STOP.has(w));
      if (!/[<>]/.test(v) && ws.length && (ws.filter(w => glossKeys.has(w)).length / ws.length >= 0.5 || engelsAchtig)) enSet.add(v.trim());
    }
  }
  const NL_VERDACHT = new Set('het een je ik mijn jouw wie wat niet ook naar bij aan onze deze maar hebt voor met zijn wordt jij hij ze we wij zoek kamp bos veld weg'.split(' '));
  const isNl = s => (s.toLowerCase().match(/[a-zà-ÿ']+/g) || []).some(w => NL_VERDACHT.has(w));
  js = js.replace('/*HK_EN*/[]', () => JSON.stringify([...enSet].filter(s => s.length < 200 && !isNl(s))));
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
