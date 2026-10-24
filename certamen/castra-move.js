/* ============================================================================
   CASTRA HEROUM — SOEPELE BESTURING MET HET TOETSENBORD (wereld en kamp)
   ----------------------------------------------------------------------------
   Het personage stopte eerst en kon pas daarna een andere kant op: een toetsdruk tijdens een lopende stap werd weggegooid
   (en een nieuwe toets herhaalt pas na een halve seconde). Nu:
   - een richting die je indrukt tijdens een stap wordt onthouden en gaat meteen in zodra de stap klaar is: scherpe bochten
     (van links naar boven) lopen door zonder te stoppen;
   - houd je een toets vast, dan loopt het personage door zonder te wachten op het herhalen van de toets, in de richting
     van de laatst ingedrukte toets;
   - laat je los, dan stopt het na de lopende stap.
   Aanraken (joystick) en tikken om te lopen blijven werken zoals eerst. Laadt NA castra-train.js en castra-stage.js.
   ============================================================================ */
const CASTRA_KEYDIR = { ArrowUp:"up", w:"up", W:"up", ArrowDown:"down", s:"down", S:"down", ArrowLeft:"left", a:"left", A:"left", ArrowRight:"right", d:"right", D:"right" };
let CASTRA_HELD = [], CASTRA_KB_T = 0;
function castraHeldDir(){ return CASTRA_HELD.length ? CASTRA_HELD[CASTRA_HELD.length-1] : null; }
document.addEventListener("keydown", e=>{
  const d = CASTRA_KEYDIR[e.key]; if(!d) return;
  const t = e.target && e.target.tagName; if(t==="INPUT" || t==="TEXTAREA" || t==="SELECT") return;
  CASTRA_KB_T = Date.now();
  if(!e.repeat){ CASTRA_HELD = CASTRA_HELD.filter(x=>x!==d); CASTRA_HELD.push(d); }
}, true);
document.addEventListener("keyup", e=>{ const d = CASTRA_KEYDIR[e.key]; if(d) CASTRA_HELD = CASTRA_HELD.filter(x=>x!==d); }, true);
window.addEventListener("blur", ()=>{ CASTRA_HELD = []; });

// gedeelde logica voor een stapfunctie (wereld of kamp)
function castraMoveWrap(getUI, stepFn, alive, speed){
  const next = ()=>{
    if(!alive()) return; const U = getUI();
    if(U.moving){ setTimeout(next, 12); return; }
    const d = U.queued || castraHeldDir(); U.queued = null;
    if(d) stepFn(d);
  };
  return function(dir){
    const U = getUI();
    if(U.moving){ if(Date.now()-CASTRA_KB_T < 80) U.queued = dir; return null; }     // onthouden (alleen toetsenbord)
    const r = this.__orig.apply(this, arguments);
    if(r===true){ U.queued = null; setTimeout(next, speed()+6); }
    return r;
  };
}
const _castraWStepMv0 = castraWStep;
castraWStep = (function(){
  const w = castraMoveWrap(()=>CASTRA_W_UI, d=>castraWStep(d), ()=>!!el("cwMap"), ()=>CASTRA_W_UI.speedMs || 170);
  return function(dir){ return w.apply({ __orig:_castraWStepMv0 }, arguments); };
})();
if(typeof castraStep==="function"){
  const _castraStepMv0 = castraStep;
  castraStep = (function(){
    const w = castraMoveWrap(()=>CASTRA_UI, d=>castraStep(d), ()=>!!el("castraMap"), ()=>170);
    return function(dir){ return w.apply({ __orig:_castraStepMv0 }, arguments); };
  })();
}
