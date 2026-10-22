/* ============================================================================
   CASTRA HEROUM — ERVARING EN LEVELCURVE (naar Pokémon)
   ----------------------------------------------------------------------------
   Pokémon-regels, geschaald naar dit spel:
   - Levelcurve "Medium Fast": van level n naar n+1 kost 3n² + 3n + 1 (het verschil van n³), maal een
     schaalfactor S zodat het tempo van het spel gelijk blijft. Vroege levels gaan snel, late levels duren
     veel langer (level 5: ±11 XP, 20: 151, 40: 590, 49: 882; tot level 50 samen ±15.000).
   - Winst per gewonnen jachtgevecht (Gen 5+): ((b × Lv vijand) / 5) × ((2·Lv vijand + 10) / (Lv vijand + Lv eigen + 10))^2,5
     + 1, met b per tier van de vijand (1: 60, 2: 100, 3: 150, 4: 210), mythische wezens ×1,15, een ✨ bijzondere
     vijand ×1,2, kampioenen en bazen ×1,5 ("trainer"). Een vijand van veel lager level levert dus bijna niets
     op (trainen op zwakke vijanden werkt niet), een sterkere vijand veel (tot ×2,2 per levelverschil).
   - Vangen levert 60% van de winst op (Pokémon geeft er niets voor, maar hier is vangen de hoofdroute).
   - Tower defence-missies en de wekelijkse uitdaging: de winst van één "trainergevecht" tegen een vijand van het
     hoogste missielevel (tier 3), maal 0,25 + 0,05 per golf; ook hier telt het verschil tussen je level en dat van de vijand.
   - Training in de campus: een deel van het XP dat je nu nodig hebt (campusniveau bepaalt hoeveel).
   - Helden gebruiken dezelfde levelcurve als soldaten.
   Alles loopt via castraXpToNext (castra-troops.js), die hier wordt vervangen. Opgeslagen XP blijft geldig:
   hooguit gaat een soldaat bij de eerstvolgende winst een level omhoog. Laadt NA castra-troops.js en castra-heroes.js.
   ============================================================================ */

const CASTRA_XP = { S:0.12, min:6, b:{1:60, 2:100, 3:150, 4:210}, mythMult:1.15, shinyMult:1.2, trainerMult:1.5, catchShare:0.6, maxRatio:2.2,
                    tdBase:0.25, tdPerWave:0.05, trainBase:0.08, trainPerCampus:0.02 };

castraXpToNext = function(lvl){ return Math.max(CASTRA_XP.min, Math.round(CASTRA_XP.S*(3*lvl*lvl + 3*lvl + 1))); };
function castraXpTotalTo(lvl){ let t = 0; for(let l=1; l<lvl; l++) t += castraXpToNext(l); return t; }

// Basiswinst volgens de Pokémon-formule (nog niet geschaald): b = basiswaarde, Le = level van de vijand, Lp = eigen level.
function castraXpRaw(b, Le, Lp){
  const ratio = Math.min(CASTRA_XP.maxRatio, (2*Le + 10) / (Le + Lp + 10));
  return Math.floor(b*Le/5 * Math.pow(ratio, 2.5)) + 1;
}
function castraXpB(form){ const f = (typeof form==="string") ? castraLine(form) : form; return (CASTRA_XP.b[f.tier] || CASTRA_XP.b[1]) * (f.type==="myth" ? CASTRA_XP.mythMult : 1); }
// Winst voor een soldaat na een jachtgevecht (V = het gevecht, soldier = degene die vocht).
function castraXpWild(V, soldier){
  const f = castraLine(V.enemy.line);
  let raw = castraXpRaw(castraXpB(f), V.enemy.lvl, soldier.lvl || 1);
  if(V.enemy.insignis) raw *= CASTRA_XP.shinyMult;
  if(V.boss) raw *= CASTRA_XP.trainerMult;
  if(V.caught) raw *= CASTRA_XP.catchShare;
  return Math.max(1, Math.round(raw * CASTRA_XP.S));
}
// Winst voor een eenheid na een tower defence-missie (m = missie met golven).
function castraXpMissionLvl(m){ let L = 1; (m.waves||[]).forEach(w=>w.forEach(g=>{ L = Math.max(L, g.lvl||1); })); return L; }
function castraXpTd(m, lvl){
  const Le = castraXpMissionLvl(m), waves = (m.waves||[]).length;
  const raw = castraXpRaw(CASTRA_XP.b[3], Le, lvl || 1) * CASTRA_XP.trainerMult * (CASTRA_XP.tdBase + CASTRA_XP.tdPerWave*waves);
  return Math.max(1, Math.round(raw * CASTRA_XP.S));
}
// Training in de campus: een deel van het XP voor het volgende level.
function castraXpTrain(lvl, campusLvl){ return Math.max(2, Math.round(castraXpToNext(lvl||1) * (CASTRA_XP.trainBase + CASTRA_XP.trainPerCampus*(campusLvl||1)))); }
function castraHeroXpNeed(l){ return castraXpToNext(l); }

/* ---------- Contubernium (Exp. Share): rustende soldaten leren mee ---------- */
// Een contubernium was de tentgroep van acht legionairs; wie in de tent rust, deelt mee in wat de anderen leren.
// Vanaf Castra-niveau 7. Na een gewonnen of gevangen jachtgevecht, een gewonnen missie en de wekelijkse uitdaging
// krijgen soldaten die NIET meededen een deel van de winst, berekend met hun EIGEN level (wie al ver is krijgt dus
// bijna niets, wie achterloopt veel). Het deel (25% + 5% per campusniveau, max. 50%) en het aantal ontvangers
// (2 + campusniveau, de laagste levels eerst) groeien met de campus. Soldaten in training of op hun levelplafond
// krijgen niets; gewond zijn blokkeert niet, want rusten telt juist mee.
const CASTRA_CONT = { unlockLvl:7, slotsBase:2, slotsPerCampus:1, shareBase:25, sharePerCampus:5, shareMax:50 };
function castraContActive(){ return typeof castraUnlocked==="function" ? castraUnlocked("contubernium") : true; }
function castraContShare(){ return Math.min(CASTRA_CONT.shareMax, CASTRA_CONT.shareBase + CASTRA_CONT.sharePerCampus*Math.max(0, castraLvl("campus"))); }
function castraContSlots(){ return CASTRA_CONT.slotsBase + CASTRA_CONT.slotsPerCampus*Math.max(0, castraLvl("campus")); }
// ctx = { V (jachtgevecht) } of { m (missie) }, ids = soldaten die meededen.
function castraContubernium(ctx){
  const out = { lines:[], share:castraContShare() };
  if(!castraContActive()) return out;
  const cap = castraSoldierCap(), fought = new Set(ctx.ids || []);
  const rest = (CASTRA.soldiers||[]).filter(s=>!fought.has(s.id) && !s.trainUntil && (s.lvl||1) < cap).sort((a,b)=>(a.lvl||1)-(b.lvl||1)).slice(0, castraContSlots());
  rest.forEach(s=>{
    const full = ctx.V ? castraXpWild(ctx.V, s) : castraXpTd(ctx.m, s.lvl);
    const g = Math.max(1, Math.round(castraCardXp(full) * out.share / 100)), l0 = s.lvl;
    s.xp += g; const up = castraLevelUp(s);
    out.lines.push({ nm:castraSoldierName(s), gain:g, up, lvl:s.lvl, from:l0 });
  });
  if(out.lines.length) castraSave();
  return out;
}
function castraContHTML(c){
  if(!c || !c.lines.length) return "";
  return `<div class="note" style="margin-top:8px">🏕️ ${castraLaHTML("Contubernium quiescit, sed discit.", "Contubernium: rustende soldaten leren mee ("+c.share+"% van de ervaring).", "cont_h")}<br>${c.lines.map(l=>esc(l.nm)+" +"+l.gain+" XP"+(l.up?" ⭐ gradus "+l.lvl:"")).join(" · ")}</div>`;
}
if(typeof CASTRA_LA!=="undefined") Object.assign(CASTRA_GLOSS, { "contubernium":"tentgroep (rustende soldaten leren mee)", "tabernaculo":"tent", "quiescunt":"rusten", "quiescit":"rust", "discunt":"leren", "discit":"leert", "dedit":"gaf", "datur":"wordt gegeven" });

