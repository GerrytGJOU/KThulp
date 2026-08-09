/* Chronica Classica — datavalidatiescript.
   Loopt de hele scènegraaf door en meldt structurele datafouten:
   kapotte scèneverwijzingen, dubbele scène-ids, onbereikbare scènes,
   dode flags, wees-payoffs, en verwijzingen naar niet-bestaande
   puzzels/vijanden/souvenirs/codex-entries/vocabulaire/fragmenten/
   titels/personen.

   Puur leesonly — wijzigt niets, wijzigt nooit spelgedrag.
   Gebruik: node certamen/tools/validate_chronica.js
   Exit code 0 = geen fouten, 1 = fouten gevonden (bruikbaar in CI). */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const dataPath = path.join(ROOT, 'singleplayer-data.js');
const dataSrc = fs.readFileSync(dataPath, 'utf8');

const names = [...dataSrc.matchAll(/^const (SP_[A-Z0-9_]+)/gm)].map(m => m[1]);
const sandbox = { out: null };
vm.createContext(sandbox);
vm.runInContext(dataSrc + '\nout={' + names.map(n => n + ':' + n).join(',') + '};', sandbox);
const D = sandbox.out;

/* Zelfde parser als CNSParser in singleplayer.js — bewust hier gedupliceerd
   (geen browser-globals/module-systeem beschikbaar in een los Node-script)
   in plaats van geïmporteerd. Bij een wijziging aan CNSParser in
   singleplayer.js: dezelfde wijziging hier doorvoeren. */
const CNSParser = {
  KNOWN_SECTIONS: ["TITLE","TEXT","DIALOGUE","CHOICES","IMAGE","MUSIC","SFX",
    "CODEX","QUEST","COMBAT","REWARD","INVENTORY","PUZZLE","EERETITEL","FLAG",
    "PERSON","VOCAB","FRAGMENT","SOUVENIR","STATPOINTS","RELATION","REACTION","CHECK","RACE"],
  parse(rawText) {
    const scenes = new Map();
    if (!rawText || !rawText.trim()) return scenes;
    const headerRe = /===\s*SCENE:\s*(\S+)\s*===/g;
    const matches = [...rawText.matchAll(headerRe)];
    for (let i = 0; i < matches.length; i++) {
      const id = matches[i][1];
      const blockStart = matches[i].index + matches[i][0].length;
      const blockEnd = (i + 1 < matches.length) ? matches[i + 1].index : rawText.length;
      scenes.set(id, this.parseSceneBlock(id, rawText.slice(blockStart, blockEnd)));
    }
    return scenes;
  },
  parseSceneBlock(id, block) {
    const scene = { id, title: "", text: "", dialogue: null, choices: [], meta: {} };
    const endIndex = block.search(/^\s*END\s*$/m);
    const content = endIndex >= 0 ? block.slice(0, endIndex) : block;
    const lines = content.split(/\r?\n/);
    let currentSection = null, buffer = [];
    const flush = () => {
      if (!currentSection) { buffer = []; return; }
      const text = buffer.join("\n").trim();
      if (currentSection === "TITLE") scene.title = text;
      else if (currentSection === "TEXT") scene.text = text;
      else if (currentSection === "CHOICES") scene.choices = this.parseChoices(text);
      else if (currentSection !== "DIALOGUE") scene.meta[currentSection] = text;
      buffer = [];
    };
    const sectionHeaderRe = new RegExp("^(" + this.KNOWN_SECTIONS.join("|") + "):\\s*$");
    for (const line of lines) {
      const m = line.match(sectionHeaderRe);
      if (m) { flush(); currentSection = m[1]; } else buffer.push(line);
    }
    flush();
    return scene;
  },
  parseChoices(text) {
    const choices = [];
    for (const raw of text.split(/\r?\n/)) {
      const line = raw.trim();
      if (!line.startsWith("*")) continue;
      const withoutBullet = line.replace(/^\*\s*/, "");
      const arrowIndex = withoutBullet.lastIndexOf("->");
      if (arrowIndex === -1) continue;
      const target = withoutBullet.slice(arrowIndex + 2).trim();
      choices.push({ target });
    }
    return choices;
  },
};

const BLOCKS = [
  ['PRO', D.SP_PROLOOG_CNS], ['CH1', D.SP_CH1_CNS], ['CH2', D.SP_CH2_CNS],
  ['CH3', D.SP_CH3_CNS], ['CH4', D.SP_CH4_CNS], ['CH5', D.SP_CH5_CNS],
  ['CH6', D.SP_CH6_CNS], ['CH7', D.SP_CH7_CNS], ['CH8', D.SP_CH8_CNS], ['CH9', D.SP_CH9_CNS],
  ['CH10', D.SP_CH10_CNS], ['CH11', D.SP_CH11_CNS], ['CH12', D.SP_CH12_CNS],
  ['CH13', D.SP_CH13_CNS], ['CH14', D.SP_CH14_CNS], ['CH15', D.SP_CH15_CNS],
  ['CH16', D.SP_CH16_CNS],
];

const errors = [];
const warnings = [];
const scenesById = new Map();
const dupes = [];

/* Bewaking tegen een echte bug uit 2026-08-02 (Chronica.md §7.48): deze
   BLOCKS-lijst hierboven is BEWUST gescheiden van SP_SCENES in
   singleplayer.js zelf (geen browser-globals hier) — maar dat betekent dat
   een hoofdstuk hier toevoegen zonder het OOK aan singleplayer.js's eigen
   SP_SCENES-constructie toe te voegen, onopgemerkt bleef: de validator zei
   "0 fouten" terwijl Hoofdstuk 11/12/13 in het draaiende spel onbereikbaar
   waren. Check hier of elke SP_CHxx_CNS die in BLOCKS staat, ook
   daadwerkelijk in singleplayer.js's SP_SCENES-regel voorkomt. */
{
  const spPath = path.join(ROOT, 'singleplayer.js');
  const spSrc = fs.readFileSync(spPath, 'utf8');
  const scenesLineM = /const SP_SCENES\s*=[^\n]*/.exec(spSrc);
  const scenesLine = scenesLineM ? scenesLineM[0] : '';
  for (const [chap, raw] of BLOCKS) {
    if (!raw) continue; // lege/ontbrekende const in singleplayer-data.js zelf; apart probleem
    const expectedName = chap === 'PRO' ? 'SP_PROLOOG_CNS' : `SP_${chap}_CNS`;
    if (!scenesLine.includes(expectedName)) {
      errors.push(`KRITIEK: ${expectedName} staat in validate_chronica.js's BLOCKS, maar NIET in singleplayer.js's SP_SCENES-constructie — dit hoofdstuk is onbereikbaar in het echte spel, ook al meldt deze validator verder "0 fouten". Voeg "...CNSParser.parse(${expectedName})" toe aan de SP_SCENES-regel in singleplayer.js.`);
    }
  }
}

for (const [chap, raw] of BLOCKS) {
  for (const [id, sc] of CNSParser.parse(raw)) {
    if (scenesById.has(id)) dupes.push(id);
    sc.hoofdstuk = chap;
    scenesById.set(id, sc);
  }
}
for (const id of dupes) errors.push(`Dubbele scène-id: ${id}`);

// Kapotte keuze-verwijzingen
for (const sc of scenesById.values()) {
  for (const ch of sc.choices) {
    if (!scenesById.has(ch.target)) {
      errors.push(`${sc.id}: keuze verwijst naar niet-bestaande scène "${ch.target}"`);
    }
  }
}

// Payoff-deuren tellen ook als graafkant
const adj = new Map();
for (const sc of scenesById.values()) adj.set(sc.id, sc.choices.map(c => c.target).filter(t => scenesById.has(t)));
for (const p of (D.SP_PAYOFFS || [])) {
  if (p.type === 'deur' && p.content && p.content.choice && p.trigger && p.trigger.scene) {
    (adj.get(p.trigger.scene) || []).push(p.content.choice.target);
  }
}
// CHECK-scènes hebben bewust geen CHOICES (de worp bepaalt de vervolgscène) —
// hun vier takken tellen dus ook als graafkant, anders zijn ze straks
// vals-positief "onbereikbaar" zodra SP_CHECKS echte entries krijgt.
for (const sc of scenesById.values()) {
  if (!sc.meta.CHECK) continue;
  const check = D.SP_CHECKS && D.SP_CHECKS[sc.meta.CHECK.trim()];
  if (!check) continue;
  const targets = ['volledig', 'deels', 'gefaald', 'kritiek']
    .map(tak => check[tak] && check[tak].target).filter(t => t && scenesById.has(t));
  adj.set(sc.id, (adj.get(sc.id) || []).concat(targets));
}
// RACE-scènes (Hoofdstuk 16+, RACE-bridge — zie Chronica.md 2026-08-09):
// zelfde bewuste geen-CHOICES-patroon als CHECK, hun vier uitkomsten
// (SP_RACES[id].targets, kortere sleutelnamen dan CHECK: vol/deels/
// gefaald/kritiek i.p.v. volledig/deels/gefaald/kritiek) tellen ook mee
// als graafkant.
for (const sc of scenesById.values()) {
  if (!sc.meta.RACE) continue;
  const race = D.SP_RACES && D.SP_RACES[sc.meta.RACE.trim()];
  if (!race || !race.targets) continue;
  const targets = ['vol', 'deels', 'gefaald', 'kritiek']
    .map(tak => race.targets[tak]).filter(t => t && scenesById.has(t));
  adj.set(sc.id, (adj.get(sc.id) || []).concat(targets));
}

// Onbereikbare scènes: vanaf elk hoofdstuk-startpunt
const chapterStarts = {};
for (const sc of scenesById.values()) if (!chapterStarts[sc.hoofdstuk]) chapterStarts[sc.hoofdstuk] = sc.id;
const reachable = new Set();
for (const start of Object.values(chapterStarts)) {
  const seen = new Set([start]); const stack = [start];
  while (stack.length) {
    const id = stack.pop();
    for (const t of (adj.get(id) || [])) if (!seen.has(t)) { seen.add(t); stack.push(t); }
  }
  for (const id of seen) reachable.add(id);
}
const payoffOnlyTargets = new Set(
  (D.SP_PAYOFFS || []).filter(p => p.type === 'deur' && p.content && p.content.choice)
    .map(p => p.content.choice.target)
);
for (const sc of scenesById.values()) {
  if (!reachable.has(sc.id)) {
    if (payoffOnlyTargets.has(sc.id)) {
      warnings.push(`${sc.id}: alleen bereikbaar via een payoff-deur (verwacht als dat bewust is — nu: ${sc.id === 'CH3_H01_HARNAS' ? 'bekend, bewust' : 'controleer'})`);
    } else {
      errors.push(`${sc.id}: onbereikbaar vanaf elk hoofdstukbegin`);
    }
  }
}

// Terminale scènes (geen enkele keuze) — waarschuwing, geen fout (kan de bedoelde eindscène zijn).
// CHECK-scènes horen bewust geen CHOICES te hebben (de worp bepaalt de vervolgscène), dus die
// worden hier niet als "terminaal" gerapporteerd — zie de aparte CHECK-check verderop.
for (const sc of scenesById.values()) {
  if (sc.choices.length === 0 && !sc.meta.CHECK && !sc.meta.RACE) warnings.push(`${sc.id}: geen enkele keuze (terminale scène — controleer of dat bedoeld is)`);
}

// Flags: schrijvers/lezers
const flagWrites = {};
const parseFlagSection = t => {
  const out = [];
  (t || '').split(/[\n;]/).forEach(part => {
    part = part.trim(); if (!part) return;
    const eq = part.indexOf('=');
    out.push(eq === -1 ? part : part.slice(0, eq).trim());
  });
  return out;
};
for (const sc of scenesById.values()) {
  if (!sc.meta.FLAG) continue;
  for (const f of parseFlagSection(sc.meta.FLAG)) (flagWrites[f] = flagWrites[f] || []).push(sc.id);
}
const flagReads = new Set();
for (const sc of scenesById.values()) {
  for (const ch of (sc.meta.CHOICES ? [] : [])) {} // no-op, keeps structure symmetric
}
// DONE-tags en REQUIRE-tags lezen flags; scan de ruwe CHOICES-tekst opnieuw voor tags
for (const [, raw] of BLOCKS) {
  for (const m of raw.matchAll(/\[DONE:(\w+)\]/g)) flagReads.add(m[1]);
  for (const m of raw.matchAll(/\[REQUIRE:(\w+)=/g)) flagReads.add(m[1].toLowerCase());
}
for (const p of (D.SP_PAYOFFS || [])) {
  const c = p.condition || {};
  for (const k of Object.keys(c.flags || {})) flagReads.add(k);
  for (const k of (c.flagsSet || [])) flagReads.add(k);
  for (const k of (c.flagsNotSet || [])) flagReads.add(k);
}
for (const [k, v] of Object.entries(D.SP_AVATAR_STORY_UNLOCKS || {})) if (v.flag) flagReads.add(v.flag);
// Ook code-lezingen (singleplayer.js/games.js/battle.js/core.js) meetellen, zelfde als audit/00
for (const f of ['singleplayer.js', 'games.js', 'battle.js', 'core.js']) {
  const src = fs.readFileSync(path.join(ROOT, f), 'utf8');
  // Vangt zowel `flags.NAAM`/`flags["NAAM"]` als `(SP_STATE.flags||{}).NAAM`-vormen —
  // die laatste komt in singleplayer.js meermaals voor (bv. museum_mnemosyne_ontgrendeld).
  for (const m of src.matchAll(/flags\s*(?:\|\|\s*\{\}\s*\))?\s*(?:\?\.|\.)\s*([A-Za-z_][A-Za-z0-9_]*)/g)) flagReads.add(m[1]);
  for (const m of src.matchAll(/flags\s*(?:\|\|\s*\{\}\s*\))?\s*\[\s*["'`]([^"'`]+)["'`]\s*\]/g)) flagReads.add(m[1]);
}
for (const flag of Object.keys(flagWrites)) {
  if (!flagReads.has(flag)) warnings.push(`Dode flag: "${flag}" (geschreven in ${flagWrites[flag].join(', ')}, nergens gelezen)`);
}

// Wees-payoffs: conditie verwijst naar een flag die nergens geschreven wordt
for (const p of (D.SP_PAYOFFS || [])) {
  const c = p.condition || {};
  for (const k of Object.keys(c.flags || {})) if (!flagWrites[k]) errors.push(`Payoff "${p.id}": flag "${k}" wordt nergens geschreven`);
  for (const k of (c.flagsSet || [])) if (!flagWrites[k]) errors.push(`Payoff "${p.id}": flag "${k}" wordt nergens geschreven`);
}

// Cross-referenties: PUZZLE/COMBAT/SOUVENIR/CODEX/VOCAB/FRAGMENT/EERETITEL/PERSON
const splitList = t => (t || '').split(/[\n,;]/).map(s => s.trim()).filter(Boolean);
for (const sc of scenesById.values()) {
  const m = sc.meta;
  if (m.PUZZLE && !D.SP_PUZZLES[m.PUZZLE.trim()]) errors.push(`${sc.id}: PUZZLE "${m.PUZZLE.trim()}" niet gedefinieerd in SP_PUZZLES`);
  if (m.COMBAT && !D.SP_COMBAT_ENEMIES[m.COMBAT.trim()]) errors.push(`${sc.id}: COMBAT "${m.COMBAT.trim()}" niet gedefinieerd in SP_COMBAT_ENEMIES`);
  if (m.SOUVENIR) for (const s of splitList(m.SOUVENIR)) if (!D.SP_SOUVENIRS[s]) errors.push(`${sc.id}: SOUVENIR "${s}" niet gedefinieerd in SP_SOUVENIRS`);
  if (m.CODEX) for (const c of splitList(m.CODEX)) if (!D.SP_CODEX_ENTRIES[c]) errors.push(`${sc.id}: CODEX "${c}" niet gedefinieerd in SP_CODEX_ENTRIES`);
  if (m.VOCAB) for (const v of splitList(m.VOCAB)) if (!D.SP_VOCAB_ENTRIES[v]) errors.push(`${sc.id}: VOCAB "${v}" niet gedefinieerd in SP_VOCAB_ENTRIES`);
  if (m.FRAGMENT && !D.SP_FRAGMENTS[m.FRAGMENT.trim()]) errors.push(`${sc.id}: FRAGMENT "${m.FRAGMENT.trim()}" niet gedefinieerd in SP_FRAGMENTS`);
  if (m.EERETITEL && !D.SP_TITLES.find(t => t.id === m.EERETITEL.trim())) errors.push(`${sc.id}: EERETITEL "${m.EERETITEL.trim()}" niet gedefinieerd in SP_TITLES`);
  if (m.PERSON) for (const p of splitList(m.PERSON)) {
    const id = p.split(':')[0].trim();
    if (!D.SP_CODEX_PERSONS[id]) errors.push(`${sc.id}: PERSON "${id}" niet gedefinieerd in SP_CODEX_PERSONS`);
  }
  if (m.REACTION) {
    const lines = m.REACTION.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const id = lines[0];
    if (id && !D.SP_CODEX_PERSONS[id]) errors.push(`${sc.id}: REACTION "${id}" niet gedefinieerd in SP_CODEX_PERSONS`);
    if (lines.length < 2) errors.push(`${sc.id}: REACTION heeft geen CLEMENTIA/SEVERITAS-regel`);
    for (const line of lines.slice(1)) {
      if (!/^(CLEMENTIA|SEVERITAS|NEUTRAL):\s*\S/i.test(line)) errors.push(`${sc.id}: REACTION-regel "${line}" mist een geldige CLEMENTIA/SEVERITAS/NEUTRAL-prefix`);
    }
  }
  if (m.CHECK) {
    const checkId = m.CHECK.trim();
    const check = D.SP_CHECKS && D.SP_CHECKS[checkId];
    if (!check) errors.push(`${sc.id}: CHECK "${checkId}" niet gedefinieerd in SP_CHECKS`);
    else {
      for (const tak of ['volledig', 'deels', 'gefaald', 'kritiek']) {
        const target = check[tak] && check[tak].target;
        if (!target) errors.push(`${sc.id}: CHECK "${checkId}" mist een "${tak}"-tak met een target`);
        else if (!scenesById.has(target)) errors.push(`${sc.id}: CHECK "${checkId}" tak "${tak}" verwijst naar niet-bestaande scène "${target}"`);
      }
    }
    if (sc.choices && sc.choices.length) warnings.push(`${sc.id}: heeft zowel CHECK als CHOICES — CHOICES wordt genegeerd (de worp bepaalt de vervolgscène)`);
  }
  if (m.RACE) {
    const raceId = m.RACE.trim();
    const race = D.SP_RACES && D.SP_RACES[raceId];
    if (!race) errors.push(`${sc.id}: RACE "${raceId}" niet gedefinieerd in SP_RACES`);
    else if (!race.targets) errors.push(`${sc.id}: RACE "${raceId}" mist een "targets"-object`);
    else {
      for (const tak of ['vol', 'deels', 'gefaald', 'kritiek']) {
        const target = race.targets[tak];
        if (!target) errors.push(`${sc.id}: RACE "${raceId}" mist een "${tak}"-tak met een target`);
        else if (!scenesById.has(target)) errors.push(`${sc.id}: RACE "${raceId}" tak "${tak}" verwijst naar niet-bestaande scène "${target}"`);
      }
    }
    if (sc.choices && sc.choices.length) warnings.push(`${sc.id}: heeft zowel RACE als CHOICES — CHOICES wordt genegeerd (de minigame bepaalt de vervolgscène)`);
  }
}

// Rapport
console.log(`Chronica Classica — validatie (${scenesById.size} scènes, ${(D.SP_PAYOFFS || []).length} payoffs)\n`);
if (errors.length) {
  console.log(`FOUTEN (${errors.length}):`);
  errors.forEach(e => console.log('  ✗ ' + e));
  console.log('');
}
if (warnings.length) {
  console.log(`WAARSCHUWINGEN (${warnings.length}) — geen harde fout, wel het bekijken waard:`);
  warnings.forEach(w => console.log('  ! ' + w));
  console.log('');
}
if (!errors.length && !warnings.length) console.log('Geen fouten of waarschuwingen gevonden.');
console.log(`\n${errors.length} fout(en), ${warnings.length} waarschuwing(en).`);
process.exit(errors.length ? 1 : 0);
