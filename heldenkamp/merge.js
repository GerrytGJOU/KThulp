/* Voegt een rijtje vertalingen toe aan nl.json.
   node merge.js <sleutels.json> <vertalingen.json> [voorvoegsel]
   sleutels.json = array van oorspronkelijke fragmenten (volgorde = _batch.json), vertalingen.json = array van gelijke lengte.
   voorvoegsel bv. "en::" voor Engelse hulpteksten bij Nederlandse hoofdtekst. */
const fs = require('fs');
const [,, sk, vt, pre = ''] = process.argv;
const s = JSON.parse(fs.readFileSync(sk, 'utf8')), v = JSON.parse(fs.readFileSync(vt, 'utf8'));
if (s.length !== v.length) { console.error(`Lengte klopt niet: ${s.length} sleutels, ${v.length} vertalingen`); process.exit(1); }
const cat = JSON.parse(fs.readFileSync('nl.json', 'utf8'));
s.forEach((k, i) => { cat[pre + k] = v[i]; });
fs.writeFileSync('nl.json', JSON.stringify(cat, null, 1));
console.log(`${s.length} toegevoegd; catalogus nu ${Object.keys(cat).length} regels.`);
