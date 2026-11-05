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

const ZIN = /[.!?…]["»”']?\s*$/;       // Latijnse tekst die op leesteken eindigt is een zin, geen naam
const NL_WOORDEN = new Set('het een je ik niet mijn jouw jij wat wie voor met ook nu hebt heb wordt naar van bij aan over onze ons dit dat zijn ben bent we wij hoe waar maar want dan toch nog ze zij hij haar hem hun deze die'.split(' '));
function nlAchtig(s) { return (s.toLowerCase().match(/[a-zà-ž']+/g) || []).some(w => NL_WOORDEN.has(w)); }
const isStr = e => e && e.type === 'Literal' && typeof e.value === 'string';

/* Paren {la:"Latijn", nl:"Nederlands"} en _K(..., ["Latijn","Nederlands"], ...).
   In Heldenkamp wordt de Nederlandse vertaling de hoofdtekst (rol "la") en komt er een
   Engelse hulptekst voor in de plaats van het Nederlands (rol "nl", catalogussleutel "en::<nl>"). */
function paarVan(n, anc) {
  const par = anc[anc.length - 2];
  if (!par) return null;
  if (par.type === 'Property' && par.value === n && par.key) {
    const obj = anc[anc.length - 3];
    const rol = par.key.name || par.key.value;
    if (!obj || obj.type !== 'ObjectExpression' || (rol !== 'la' && rol !== 'nl')) return null;
    const vind = k => obj.properties.find(p => p.type === 'Property' && p.key && (p.key.name || p.key.value) === k && isStr(p.value));
    const la = vind('la'), nl = vind('nl');
    if (!la || !nl || !ZIN.test(la.value.value.trim())) return null;
    return { rol, partner: (rol === 'la' ? nl : la).value.value };
  }
  if (par.type === 'ArrayExpression' && par.elements.length === 2 && par.elements.every(isStr)) {
    // ["Latijnse zin.", "Nederlandse vertaling."] — herkend aan taal: eerste zonder, tweede met Nederlandse functiewoorden
    const [a, b] = par.elements.map(e => e.value.trim());
    const call = anc[anc.length - 3];
    const hulp = call && call.type === 'CallExpression' && /^_[A-Z]+$/.test(call.callee.name || '');   // _K/_W/_T(...) zijn paar-bouwers
    if (!ZIN.test(a) || !ZIN.test(b) || (!hulp && (nlAchtig(a) || !nlAchtig(b)))) return null;
    const eerste = par.elements[0] === n;
    return { rol: eerste ? 'la' : 'nl', partner: par.elements[eerste ? 1 : 0].value };
  }
  return null;
}

// Geeft [{start,end,kind,cooked,pair}] met plaats in de bron van elk tekstfragment.
function collect(src) {
  const ast = acorn.parse(src, { ecmaVersion: 'latest', allowHashBang: true });
  const out = [];
  walk.fullAncestor(ast, (n, _s, anc) => {
    const par = anc[anc.length - 2];
    const prop = par && par.type === 'Property' && par.value === n && par.key ? (par.key.name || par.key.value) : null;
    if (n.type === 'Literal' && typeof n.value === 'string') {
      const pair = paarVan(n, anc);
      if (pair || isText(n.value) || (LABEL_KEYS.has(prop) && /^[A-Za-zÀ-ž][A-Za-zÀ-ž' -]{2,}$/.test(n.value)))
        out.push({ start: n.start, end: n.end, kind: 'lit', cooked: n.value, pair });
    } else if (n.type === 'TemplateElement') {
      const c = n.value.cooked == null ? '' : n.value.cooked;
      if (isText(c)) out.push({ start: n.start, end: n.end, kind: 'tpl', cooked: c, pair: null });
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

// De vertaling voor een fragment, rekening houdend met de paarregel. undefined = nog niet vertaald.
function vertaal(catalogus, bestand, n) {
  const eigen = zoek(catalogus, bestand, n.cooked);
  if (!n.pair) return eigen;
  if (n.pair.rol === 'la') return eigen !== undefined ? eigen : n.pair.partner;   // Latijn -> bestaande Nederlandse tekst
  const en = zoek(catalogus, bestand, 'en::' + n.cooked);                          // Nederlands -> Engelse hulptekst
  return en !== undefined ? en : eigen;
}

// Wat er in de todo-lijst moet staan voor dit fragment (null = niets te doen).
function sleutelNodig(n) {
  if (!n.pair) return n.cooked.trim();
  return n.pair.rol === 'nl' ? 'en::' + n.cooked.trim() : null;
}

// Schrijf een vertaling terug in dezelfde vorm als het origineel.
function render(node, vertaling, origineel) {
  const lead = origineel.match(/^\s*/)[0], trail = origineel.match(/\s*$/)[0];
  const tekst = lead + vertaling + (origineel.trim() ? trail : '');
  if (node.kind === 'tpl') return tekst.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
  return JSON.stringify(tekst).split(String.fromCharCode(0x2028)).join('\\u2028').split(String.fromCharCode(0x2029)).join('\\u2029');
}

module.exports = { collect, zoek, vertaal, sleutelNodig, render, isText, SKIP_FILES };
