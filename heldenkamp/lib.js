/* Heldenkamp — gedeelde hulpfuncties voor extractie en bouw.
   Zoekt alle tekstfragmenten (string-literals en sjabloon-stukken) in een Castra-bronbestand. */
const acorn = require('acorn');
const walk = require('acorn-walk');

const SKIP_FILES = /^(castra-colo.*|castra-colosseum|castra-legio)\.js$/; // online-onderdelen, niet in Heldenkamp

// Is dit een stukje tekst voor de speler (en geen code, CSS of opmaak)?
function isText(raw) {
  const s = raw.trim();
  if (s.length < 2) return false;
  if (/(style|class|onclick|onpointerdown|onmouseenter|aria-label|id|src|href)=/.test(s) && !/>[^<]*[A-Za-zÀ-ž]{3,}/.test(s)) return false;
  if (/=>|function\s*\(|\bconst\b|\blet\b|\breturn\b/.test(s)) return false;
  if (/[a-z-]+\s*:\s*[^;]+;/.test(s) && !/\s[a-zà-ž]{3,}\s/i.test(s.replace(/[a-z-]+\s*:\s*[^;]+;/g, ''))) return false; // CSS
  const tekst = s.replace(/<[^>]*>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ').trim();
  if (!/[A-Za-zÀ-ž]{2}/.test(tekst)) return false;
  if (/^[a-z0-9_.#:\-\/]+$/.test(tekst)) return false;          // id, klasse, pad
  if (/^(rgba?\(|#[0-9a-f]{3,8}$|var\(|\d)/i.test(tekst)) return false;
  return /\s/.test(tekst) || /^[A-ZÀ-Ž]/.test(tekst);
}

// Eigenschappen waarvan de waarde (ook als losse kleine letter) een weergavenaam of uitleg is.
const LABEL_KEYS = new Set(['nl','la','en','name','naam','desc','title','label','text','txt','msg','tip','hint','sub','uitleg','info']);

// Geeft [{start,end,kind,cooked}] met plaats in de bron van elk tekstfragment.
function collect(src) {
  const ast = acorn.parse(src, { ecmaVersion: 'latest', allowHashBang: true });
  const out = [];
  walk.fullAncestor(ast, (n, _s, anc) => {
    const par = anc[anc.length - 2];
    const prop = par && par.type === 'Property' && par.value === n && par.key ? (par.key.name || par.key.value) : null;
    if (n.type === 'Literal' && typeof n.value === 'string') {
      if (isText(n.value) || (LABEL_KEYS.has(prop) && /^[A-Za-zÀ-ž][A-Za-zÀ-ž' -]{2,}$/.test(n.value)))
        out.push({ start: n.start, end: n.end, kind: 'lit', cooked: n.value });
    } else if (n.type === 'TemplateElement') {
      const c = n.value.cooked == null ? '' : n.value.cooked;
      if (isText(c)) out.push({ start: n.start, end: n.end, kind: 'tpl', cooked: c });
    }
  });
  return out;
}

// Zoek de vertaling: eerst "bestand::tekst", dan "tekst".
function zoek(catalogus, bestand, tekst) {
  const t = tekst.trim();
  const k = bestand + '::' + t;
  return k in catalogus ? catalogus[k] : (t in catalogus ? catalogus[t] : undefined);
}

// Schrijf een vertaling terug in dezelfde vorm als het origineel.
function render(node, vertaling, origineel) {
  const lead = origineel.match(/^\s*/)[0], trail = origineel.match(/\s*$/)[0];
  const tekst = lead + vertaling + (origineel.trim() ? trail : '');
  if (node.kind === 'tpl') return tekst.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
  return JSON.stringify(tekst).split(String.fromCharCode(0x2028)).join('\\u2028').split(String.fromCharCode(0x2029)).join('\\u2029');
}

module.exports = { collect, zoek, render, isText, SKIP_FILES };
