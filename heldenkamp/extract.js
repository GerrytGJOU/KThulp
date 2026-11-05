/* Heldenkamp — extractie. Gebruik:  node extract.js [bestand-deel]
   Leest certamen/castra*.js, vergelijkt met nl.json en schrijft todo.json met alle fragmenten
   die nog GEEN vertaling hebben (per bestand). Exitcode 0; rapport op stdout.
   Met --strict faalt het script als er nog iets openstaat (voor de Action). */
const fs = require('fs'), path = require('path');
const { collect, zoek, SKIP_FILES } = require('./lib');

const ROOT = path.join(__dirname, '..', 'certamen');
const catPath = path.join(__dirname, 'nl.json');
const catalogus = fs.existsSync(catPath) ? JSON.parse(fs.readFileSync(catPath, 'utf8')) : {};
const filter = process.argv.slice(2).find(a => !a.startsWith('--'));
const strict = process.argv.includes('--strict');

const todo = {}; let open = 0, klaar = 0;
for (const f of fs.readdirSync(ROOT).filter(f => /^castra.*\.js$/.test(f) && !SKIP_FILES.test(f))) {
  if (filter && !f.includes(filter)) continue;
  const src = fs.readFileSync(path.join(ROOT, f), 'utf8');
  let nodes; try { nodes = collect(src); } catch (e) { console.error('PARSE FOUT', f, e.message); continue; }
  const uniek = [...new Set(nodes.map(n => n.cooked.trim()))];
  const mist = uniek.filter(s => zoek(catalogus, f, s) === undefined);
  klaar += uniek.length - mist.length; open += mist.length;
  if (mist.length) todo[f] = mist;
}
fs.writeFileSync(path.join(__dirname, 'todo.json'), JSON.stringify(todo, null, 1));
console.log(`vertaald: ${klaar}   nog open: ${open}   (zie heldenkamp/todo.json)`);
for (const [f, l] of Object.entries(todo)) console.log(String(l.length).padStart(5), f);
if (strict && open) process.exit(1);
