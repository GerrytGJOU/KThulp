/* ============================================================================
   CASTRA HEROUM — SPRITES VAN DE HELDEN (en hun evolutievormen)
   ----------------------------------------------------------------------------
   Elke heldvorm heeft dezelfde sprite-set als een soldaatvorm (castra-sprites.js), in assets/sprites-forms/:
     hero_<naam>                 basis            hero_<naam>_<spec>        specialisatie        hero_<naam>_<spec>_pr   prestige
   met per vorm td (+ td_idle/attack/hurt/down/side/up), portrait, battle_front en battle_back. Ontbreekt een
   bestand (bijvoorbeeld Circe, die nog gemaakt wordt) of een hele vorm, dan valt het spel terug op de
   avatar-lagen met het uiterlijk van die vorm (castra-heroevo.js).
   De bestandsnaam volgt h.evo en h.spec: castraHeroFormId(h). Controle (Image-probe) gebeurt voor de helden in je
   heroum bij het laden, na werven en na evolueren; daarna tekenen menu, codex, tower defence en jachtgevecht
   de sprite. Laadt NA castra-heroevo.js en castra-sprites.js.
   ============================================================================ */
function castraHeroFormId(h){
  const id = "hero_"+h.id, sp = (h.evo||0) >= 1 && h.spec ? "_"+h.spec : "";
  return id + sp + (sp && (h.evo||0) >= 2 ? "_pr" : "");
}
function castraHeroSprHTML(h, kind, size, fallbackHtml, flip){
  return h ? castraFsprHTML(castraHeroFormId(h), kind, size, fallbackHtml, flip) : fallbackHtml;
}
function castraHeroSprPreload(cb){
  if(typeof CASTRA==="undefined" || !CASTRA) return;
  const ids = (CASTRA.heroes||[]).map(castraHeroFormId);
  if(!ids.length){ if(cb) cb(); return; }
  castraFsprProbeTD(ids, ()=>castraFsprProbe(ids.map(i=>[i,"portrait"]).concat(ids.map(i=>[i,"battle_back"])), ()=>{
    try{ if(typeof CASTRA_MENU!=="undefined" && CASTRA_MENU.open && typeof castraMenuRender==="function") castraMenuRender(); }catch(_){}
    if(cb) cb();
  }));
}
const _castraLoadHs0 = castraLoad;
castraLoad = function(){ const r = _castraLoadHs0.apply(this, arguments); setTimeout(()=>{ try{ castraHeroSprPreload(); }catch(_){} }, 0); return r; };
const _castraHeroRecruitHs0 = castraHeroRecruit;
castraHeroRecruit = function(){ const r = _castraHeroRecruitHs0.apply(this, arguments); try{ castraHeroSprPreload(); }catch(_){} return r; };
const _castraHeroEvolveHs0 = castraHeroEvolve;
castraHeroEvolve = function(){ const r = _castraHeroEvolveHs0.apply(this, arguments); setTimeout(()=>{ try{ castraHeroSprPreload(); }catch(_){} }, 400); return r; };
