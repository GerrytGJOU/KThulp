/* ============================================================================
   CASTRA HEROUM — BEREIK TONEN EN UNITS VERSCHUIVEN IN DE TOWER DEFENCE
   ----------------------------------------------------------------------------
   Units hebben een verschillend bereik; dat moet je zien voor je ze neerzet. Daarom:
   - Heb je een unit gekozen en beweeg je de muis over de kaart (laptop), dan staat er een cirkel met zijn bereik
     op die plek (groen = vrij, rood = niet beschikbaar). Op een aanraakscherm verschijnt de cirkel zodra je hem neerzet.
   - Tik op een eigen unit om hem te selecteren: de cirkel toont zijn bereik (ook tijdens een golf).
   - Is een unit geselecteerd en loopt er geen golf, dan verplaatst een tik op een lege plek hem daarheen.
     Tik je nogmaals op de geselecteerde unit, dan neem je hem terug. De golf starten maakt alles definitief.
   Alleen de gewone campagne (Colosseum en Legio hebben hun eigen regels). Laadt NA castra-battle.js.
   ============================================================================ */
function castraBRangeEl(){
  let r = document.getElementById("cbRange"); if(r) return r;
  const map = el("cbMap"), units = el("cbUnits"); if(!map) return null;
  r = document.createElement("div"); r.id = "cbRange";
  r.style.cssText = "position:absolute;display:none;pointer-events:none;z-index:2;border-radius:50%;box-sizing:border-box;transition:left .08s,top .08s";
  map.insertBefore(r, units || null);
  return r;
}
function castraBRangeShow(cx, cy, range, ok){      // cx, cy in tegels (midden), range in 1/1000 tegel
  const r = castraBRangeEl(); if(!r) return;
  const px = range/1000*48, col = ok===false ? "255,90,70" : ok===true ? "120,230,120" : "255,235,120";
  r.style.width = r.style.height = (px*2)+"px"; r.style.left = (cx*48-px)+"px"; r.style.top = (cy*48-px)+"px";
  r.style.background = `rgba(${col},.16)`; r.style.border = `2px solid rgba(${col},.85)`; r.style.display = "block";
}
function castraBRangeHide(){ const r = document.getElementById("cbRange"); if(r) r.style.display = "none"; }
function castraBRangeOfUnit(B, s0){
  B._rng = B._rng || {};
  if(B._rng[s0.id]===undefined){ try{ B._rng[s0.id] = castraPMakeTower({ nextId:0 }, s0, 0, 0).range; }catch(_){ B._rng[s0.id] = 3000; } }
  return B._rng[s0.id];
}
function castraBRangeFocusTower(B){ return B.focus ? B.sim.towers.find(t=>t.id===B.focus) : null; }
function castraBRangeRefreshFocus(){
  const B = CASTRA_B; if(!B) return; const t = castraBRangeFocusTower(B);
  if(t) castraBRangeShow(t.x+.5, t.y+.5, t.range); else if(!B.sel) castraBRangeHide();
}
function castraBRangeActive(B){ return B && !B.legio && !B.endless && !B.sim.over; }

const _castraBBuildMapRg0 = castraBBuildMap;
castraBBuildMap = function(){
  _castraBBuildMapRg0.apply(this, arguments);
  try{
    const B = CASTRA_B, map = el("cbMap"); if(!castraBRangeActive(B) || !map) return;
    B.focus = null; castraBRangeEl();
    map.addEventListener("pointermove", e=>{
      if(e.pointerType!=="mouse" || !castraBRangeActive(CASTRA_B)) return;
      const B2 = CASTRA_B, r = map.getBoundingClientRect(), s = B2.scale||1, x = Math.floor((e.clientX-r.left)/s/48), y = Math.floor((e.clientY-r.top)/s/48);
      const s0 = B2.sel ? castraBHealthy().find(q=>q.id===B2.sel) : null;
      if(s0 && !B2.sim.waveActive && x>=0 && y>=0) castraBRangeShow(x+.5, y+.5, castraBRangeOfUnit(B2, s0), castraBTileFree(x,y) && B2.sim.towers.length < castraBCap());
      else castraBRangeRefreshFocus();
    });
    map.addEventListener("pointerleave", ()=>castraBRangeRefreshFocus());
  }catch(e){ console.error(e); }
};

const _castraBMapTapRg0 = castraBMapTap;
castraBMapTap = function(e){
  const B = CASTRA_B; if(!castraBRangeActive(B)) return _castraBMapTapRg0(e);
  const r = el("cbMap").getBoundingClientRect(), s = B.scale||1;
  const x = Math.floor((e.clientX-r.left)/s/48), y = Math.floor((e.clientY-r.top)/s/48);
  const tw = B.sim.towers.find(t=>t.x===x && t.y===y);
  if(tw){
    if(B.focus===tw.id && !B.sim.waveActive){ B.focus = null; castraBRemoveTower(tw); castraBRangeHide(); return; }   // nogmaals tikken = terugnemen
    B.sel = null; castraBRenderCards(); B.focus = tw.id; castraBRangeShow(tw.x+.5, tw.y+.5, tw.range);
    if(!B.sim.waveActive) toast("🎯", "Bereik getoond. Tik op een lege plek om hem te verplaatsen, of nogmaals op hem om hem terug te nemen.");
    return;
  }
  const f = castraBRangeFocusTower(B);
  if(f && !B.sel){
    if(B.sim.waveActive){ B.focus = null; castraBRangeHide(); return; }
    if(!castraBTileFree(x,y)) return;
    f.x = x; f.y = y; f.cx = x*1000+500; f.cy = y*1000+500;
    const d = document.getElementById("cbT"+f.id); if(d){ d.style.left = (x*48)+"px"; d.style.top = (y*48)+"px"; }
    castraBRangeShow(x+.5, y+.5, f.range);
    if(typeof castraBRenderSyn==="function") castraBRenderSyn(true);
    return;
  }
  const before = B.sim.towers.length;
  _castraBMapTapRg0(e);
  if(B.sim.towers.length > before){ const t = B.sim.towers[B.sim.towers.length-1]; B.focus = t.id; castraBRangeShow(t.x+.5, t.y+.5, t.range); }
  else if(!B.sel){ B.focus = null; castraBRangeHide(); }
};

const _castraBSelectRg0 = castraBSelect;
castraBSelect = function(id){
  const B = CASTRA_B; if(castraBRangeActive(B)){ B.focus = null; castraBRangeHide(); }
  const r = _castraBSelectRg0.apply(this, arguments);
  if(castraBRangeActive(B) && B.sel){ const s0 = castraBHealthy().find(q=>q.id===B.sel); if(s0) toast("🎯", "Bereik: "+(castraBRangeOfUnit(B, s0)/1000).toFixed(1).replace(".",",")+" tegels. Beweeg of tik op de kaart om te plaatsen."); }
  return r;
};
const _castraBStartWaveRg0 = castraBStartWave;
castraBStartWave = function(){ const B = CASTRA_B; if(B){ B.focus = null; } const r = _castraBStartWaveRg0.apply(this, arguments); castraBRangeHide(); return r; };
