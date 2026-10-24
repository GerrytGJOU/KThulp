/* ============================================================================
   CASTRA HEROUM — ONTMOETINGEN ALS SYSTEEM (naar de encounter tables van Pokémon)
   ----------------------------------------------------------------------------
   - Vaste slottabel per terrein: 12 plekken met vaste kansen (20, 20, 10, 10, 10, 10, 5, 5, 4, 4, 1, 1 %), elk met een vaste vorm. De slots
     0-3 zijn tier 1 (60%), 4-7 tier 2 (30%), 8-10 tier 3 (9%) en slot 11 tier 4 (1%): vrijwel dezelfde verdeling als voorheen
     (60/28/10/2), maar nu zichtbaar, voorspelbaar en testbaar. Een terrein met mythische wezens geeft die vaste slots naar zijn kans
     (bijv. 15% = slots met samen ±15%). De tabel hangt alleen af van de regio en het terrein; het level wordt per ontmoeting getrokken.
     Het praetorium begrenst nog steeds de hoogste tier: slots erboven doen niet mee (castraWildMaxTier).
   - Geen toevalsgetallen meer van Math.random: de kans per stap en het vissen gebruiken de seed van je save (castraEncRand).
   - Een paar veilige stappen na het betreden van een kaart en na een gevecht.
   - Suffimentum (saccus): zolang het brandt komen zwakkere wilde vijanden (lager level dan je eerste soldaat) niet op je pad.
   - Vissen: met een hamus kun je aan het water vissen (tegen het water aan lopen of erop tikken); er kan iets bijten dat in dat
     water thuishoort (de watertreinen van het land: tiberis, litus, scamander, flumen, nilus, palus).
   Laadt NA castra-bag.js en castra-hidden.js (en voor castra-move.js).
   ============================================================================ */
const CASTRA_ENC = {
  slotW:[20,20,10,10,10,10,5,5,4,4,1,1], slotTier:[1,1,1,1,2,2,2,2,3,3,3,4],
  safeSteps:3, fishBite:0.7, fishMs:1300,
  waterTerrains:["tiberis","litus","scamander","flumen","nilus","palus"],
};
function castraEncHash(str){ let h = 2166136261; for(let i=0;i<str.length;i++){ h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h>>>0; }
function castraEncRand(){ const r = castraRng((CASTRA.seed ^ 0x1b873593)>>>0)(); CASTRA.seed = (CASTRA.seed+3)>>>0; return r; }
function castraEncRegionId(region){ return Object.keys(CASTRA_VENATIO).find(k=>CASTRA_VENATIO[k]===region) || null; }

/* ---------- slottabellen ---------- */
const CASTRA_ENC_TABLES = {};
function castraEncTable(rid, terrain){
  const key = rid+"|"+terrain.id; if(CASTRA_ENC_TABLES[key]) return CASTRA_ENC_TABLES[key];
  const region = CASTRA_VENATIO[rid], E = CASTRA_ENC, rng = castraRng(castraEncHash(key)), n = E.slotW.length;
  // welke slots zijn mythisch: samen ongeveer terrain.myth.p van het totaal
  const myth = new Set();
  if(terrain.myth){
    const target = Math.round(terrain.myth.p*100); let cum = 0;
    const order = [...Array(n).keys()].sort((a,b)=>rng()-0.5);
    order.forEach(i=>{ if(cum + E.slotW[i] <= target + 1){ myth.add(i); cum += E.slotW[i]; } });
  }
  const slots = [], used = new Set(), maxT = region.tierMax || 4;
  for(let i=0;i<n;i++){
    const tier = Math.min(E.slotTier[i], maxT); let form = null;
    for(let tries=0; tries<8; tries++){ form = castraWildForm(region, terrain, tier, rng, myth.has(i)); if(!used.has(form.id)) break; }   // liefst elke slot een andere vorm
    used.add(form.id); slots.push({ i, w:E.slotW[i], tier:E.slotTier[i], formTier:form.tier, form:form.id, myth:myth.has(i) });
  }
  return CASTRA_ENC_TABLES[key] = slots;
}
// De tabel zoals de leerling hem ziet (voor de handleiding of een docent): per slot kans, vorm en soort.
function castraEncTableView(rid, terrainId){
  const reg = CASTRA_VENATIO[rid], t = reg && reg.terrains.find(x=>x.id===terrainId); if(!t) return [];
  return castraEncTable(rid, t).map(s=>({ ...s, nm:CASTRA_FORMS[s.form].nm }));
}
const _castraWildPickEnc0 = castraWildPick;
castraWildPick = function(region, terrain, rng){
  const rid = castraEncRegionId(region); if(!rid || !terrain || !terrain.id) return _castraWildPickEnc0.apply(this, arguments);
  const T = castraEncTable(rid, terrain), cap = Math.min(castraWildMaxTier(), region.tierMax||4), ok = T.filter(s=>s.tier<=cap);
  let r = rng()*ok.reduce((a,s)=>a+s.w,0), slot = ok[ok.length-1];
  for(const s of ok){ r -= s.w; if(r<=0){ slot = s; break; } }
  const form = CASTRA_FORMS[slot.form];
  return { form, lvl:castraWildLevel(region, form, rng), slot:slot.i };
};

/* ---------- elke stap in het hoge gras ---------- */
function castraEncLeadLvl(){ const l = (typeof castraPartyList==="function") ? castraPartyList() : (CASTRA.soldiers||[]); return l.length ? (l[0].lvl||1) : 1; }
// Tegel met hoog gras betreden: soms een ontmoetingen, tenzij veilig of weggehouden met het suffimentum.
function castraEncStep(terrainId){
  const W = castraWorldCfg(), U = CASTRA_W_UI, rid = W.parent || CASTRA_W_REGION;
  const repelling = (CASTRA.repel||0)>0;
  if(repelling){ CASTRA.repel--; if(CASTRA.repel===0 && typeof toast==="function") toast("🌿 Suffimentum", "De rook is uitgewaaid."); }
  if((U.encSafe||0)>0){ U.encSafe--; return; }
  if(castraEncRand() >= W.encounterChance) return;
  const before = { ...(CASTRA.codex||{}) }, V = castraMakeEncounter(rid, terrainId);
  if(repelling && V.enemy.lvl < castraEncLeadLvl()){ CASTRA.codex = before; return; }       // zwakkere vijanden blijven weg
  castraWorldEncounter(terrainId, V);
}
const _castraWorldRenderEnc0 = castraWorldRender;
castraWorldRender = function(){ CASTRA_W_UI.encSafe = CASTRA_ENC.safeSteps; return _castraWorldRenderEnc0.apply(this, arguments); };

/* ---------- vissen ---------- */
function castraIsWater(rid, x, y){
  const W = CASTRA_WORLDS[rid]; if(!W || !W.water) return false;
  return W.water.some(wt=>x>=wt.x0 && x<=wt.x1 && y>=1 && y<W.rows-1 && !(wt.bridgeY && wt.bridgeY.includes(y)));
}
function castraWaterTerrain(rid){
  const reg = CASTRA_VENATIO[CASTRA_WORLDS[rid] ? (CASTRA_WORLDS[rid].parent || rid) : rid]; if(!reg) return null;
  return reg.terrains.find(t=>CASTRA_ENC.waterTerrains.indexOf(t.id)>=0 && !t.hidden) || null;
}
function castraFish(x, y){
  const U = CASTRA_W_UI; if(U.fishing || CASTRA_DLG || !el("cwMap")) return;
  if(castraBagN("hamus")<1){ toast("🎣 Hamus", "Met een hamus (vishaak) kun je hier vissen. Koop er een bij de mercator in het kamp (☰ → Sacculus)."); return; }
  const t = castraWaterTerrain(CASTRA_W_REGION);
  if(!t){ toast("🎣", "Hier valt niets te vangen."); return; }
  U.fishing = true; toast("🎣 Piscari…", "Je gooit je lijn uit.");
  setTimeout(()=>{
    U.fishing = false; if(!el("cwMap")) return;
    if(castraEncRand() < CASTRA_ENC.fishBite){ toast("🎣 Mordet!", "Er bijt iets!"); const rid = CASTRA_WORLDS[CASTRA_W_REGION].parent || CASTRA_W_REGION; castraWorldEncounter(t.id, castraMakeEncounter(rid, t.id)); }
    else toast("🎣", "Niets beet. Probeer het nog eens.");
  }, CASTRA_ENC.fishMs);
}
const _castraWStepEnc0 = castraWStep;
castraWStep = function(dir){
  const U = CASTRA_W_UI;
  if(!U.moving && el("cwMap") && typeof CASTRA_DELTA!=="undefined" && CASTRA_DELTA[dir]){
    const nx = U.px+CASTRA_DELTA[dir][0], ny = U.py+CASTRA_DELTA[dir][1];
    if(castraIsWater(CASTRA_W_REGION, nx, ny)){ U.dir = dir; castraWorldAvatar(); if(castraBagN("hamus")>0){ castraFish(nx, ny); return false; } }
  }
  return _castraWStepEnc0.apply(this, arguments);
};
const _castraWorldTapEnc0 = castraWorldTap;
castraWorldTap = function(e){
  const map = el("cwMap"), U = CASTRA_W_UI;
  if(map && castraBagN("hamus")>0){
    const r = map.getBoundingClientRect(), s = U.scale||1, tx = Math.floor((e.clientX-r.left)/s/48), ty = Math.floor((e.clientY-r.top)/s/48);
    if(castraIsWater(CASTRA_W_REGION, tx, ty) && Math.abs(U.px-tx)+Math.abs(U.py-ty)===1){ castraFish(tx, ty); return; }
  }
  return _castraWorldTapEnc0.apply(this, arguments);
};
Object.assign(CASTRA_GLOSS, { "piscari":"vissen", "mordet":"bijt", "hamus":"vishaak", "saccus":"zak", "vacuus":"leeg", "posca":"azijndrank", "suffimentum":"rookwerk", "viaticum":"reisgeld", "donativum":"geldgeschenk", "theriaca":"wondermiddel", "mulsum":"honingwijn", "buccellatum":"soldatenbeschuit" });
