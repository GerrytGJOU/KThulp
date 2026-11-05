/* Heldenkamp — controle na het bouwen (draait in de GitHub Action, vóór het publiceren).
   1. Syntaxis van alle gebouwde scripts.
   2. Elke Castra-/Certamen-functie of -variabele waar het overlay naar verwijst moet nog in certamen/ bestaan; anders zou Heldenkamp
      bij het laden crashen. Dit is een FOUT (exitcode 1): liever niet publiceren dan een kapot spel publiceren.
   3. Functies die het overlay VOLLEDIG vervangt (niet omwikkelt) worden vergeleken met een momentopname. Is het origineel veranderd, dan krijgt
      Heldenkamp die verandering niet vanzelf: dat is een WAARSCHUWING (publiceren gaat door), met de naam van de functie.
   node check.js            controleren
   node check.js --snapshot momentopname opnieuw vastleggen (na het bewust overnemen van een wijziging in het overlay) */
const fs = require('fs'), path = require('path'), crypto = require('crypto'), cp = require('child_process');
const acorn = require('acorn');
const ROOT = path.join(__dirname, '..', 'certamen'), DIST = process.env.HK_DIST ? path.resolve(process.env.HK_DIST) : path.join(__dirname, 'dist', 'certamen');
const OVERLAY = path.join(__dirname, 'overlay', 'heldenkamp-nl.js'), SNAP = path.join(__dirname, 'overlay', 'origineel-snapshot.json');
// Functies die het overlay helemaal opnieuw schrijft (niet omwikkelt): wijzigt het origineel, dan moet iemand kijken.
const VERVANGEN = ['castraNorm','castraNameGloss','castraFormGloss','castraTapWord','castraQuizOpen','castraMasterXp','castraHelpSync','bmIsUnlocked','bmReqText','cxQuizExtras'];
let fouten = 0, waarschuwingen = 0;
const fout = m => { fouten++; console.log('::error::' + m); };
const waarschuw = m => { waarschuwingen++; console.log('::warning::' + m); };

// 1. syntaxis
for (const f of fs.readdirSync(DIST).filter(f => /\.js$/.test(f))) {
  const r = cp.spawnSync(process.execPath, ['--check', path.join(DIST, f)], { encoding: 'utf8' });
  if (r.status !== 0) fout('Syntaxfout in gebouwd bestand ' + f + ': ' + (r.stderr || '').split('\n').slice(0, 3).join(' '));
}

// bronnen van het origineel
const bronnen = fs.readdirSync(ROOT).filter(f => /\.js$/.test(f)).map(f => ({ f, src: fs.readFileSync(path.join(ROOT, f), 'utf8') }));
const alles = bronnen.map(b => b.src).join('\n');
const overlay = fs.readFileSync(OVERLAY, 'utf8');

// 2. bestaan van de globale namen die het overlay gebruikt (alleen namen uit het origineel; hk* is van het overlay zelf)
const eigen = new Set([...overlay.matchAll(/(?:window\.|function\s+|const\s+|let\s+)(hk\w+|HK_\w+)/g)].map(m => m[1]));
const namen = new Set([...overlay.matchAll(/\b((?:castra|cx|bm|BM_|CASTRA_)[A-Za-z0-9_]*)\b/g)].map(m => m[1]));
for (const n of namen) {
  if (eigen.has(n) || /^(castra|cx|bm)$/.test(n)) continue;
  if (new RegExp('[\'"]' + n + '[\'"]').test(alles)) continue;      // een element-id of tekst, geen functie
  const definieert = new RegExp('(function\\s+' + n + '\\s*\\(|\\b(const|let|var)\\s+' + n + '\\b|\\b' + n + '\\s*=[^=]|window\\.' + n + '\\b)');
  if (!definieert.test(alles)) fout('Het overlay gebruikt "' + n + '", maar die bestaat niet meer in certamen/ (hernoemd of verwijderd?). Pas heldenkamp/overlay/heldenkamp-nl.js aan.');
}

// 3. momentopname van de vervangen functies
function bronVan(naam) {
  for (const { f, src } of bronnen) {
    let ast; try { ast = acorn.parse(src, { ecmaVersion: 'latest', allowHashBang: true }); } catch (e) { continue; }
    for (const n of ast.body) if (n.type === 'FunctionDeclaration' && n.id.name === naam) return src.slice(n.start, n.end).replace(/\s+/g, ' ').trim();
  }
  return null;
}
const nu = {};
for (const n of VERVANGEN) { const s = bronVan(n); nu[n] = s ? crypto.createHash('sha1').update(s).digest('hex').slice(0, 12) : null; }
if (process.argv.includes('--snapshot')) { fs.writeFileSync(SNAP, JSON.stringify(nu, null, 1)); console.log('Momentopname vastgelegd voor ' + Object.keys(nu).length + ' functies.'); process.exit(0); }
const oud = fs.existsSync(SNAP) ? JSON.parse(fs.readFileSync(SNAP, 'utf8')) : null;
if (!oud) waarschuw('Geen momentopname gevonden (heldenkamp/overlay/origineel-snapshot.json); draai "node check.js --snapshot".');
else for (const n of VERVANGEN) {
  if (nu[n] === null) fout('De functie "' + n + '" die het overlay vervangt bestaat niet meer in certamen/.');
  else if (oud[n] !== nu[n]) waarschuw('Het origineel van "' + n + '" is veranderd sinds Heldenkamp een eigen versie maakte. Heldenkamp krijgt die wijziging NIET vanzelf: bekijk heldenkamp/overlay/heldenkamp-nl.js en draai daarna "node check.js --snapshot".');
}
console.log('Controle klaar: ' + fouten + ' fout(en), ' + waarschuwingen + ' waarschuwing(en).');
process.exit(fouten ? 1 : 0);
