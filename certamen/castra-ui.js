/* ============================================================================
   CASTRA HEROUM — UI-AANVULLINGEN (laadt als laatste, na alle wereldmodules)
   ----------------------------------------------------------------------------
   ✕-knop rechtsboven op alle wereldpanelen (#cwPanel): NPC-gesprekken, kisten, puzzels, borden.
   (De helpers castraXBtnHTML/castraXBtnAttach staan in castra-menu.js; kamppanelen krijgen hun ✕
   via castraOpenPanel.)
   ============================================================================ */
const _castraWorldRenderX0 = castraWorldRender;
castraWorldRender = function(){
  _castraWorldRenderX0();
  const p = el("cwPanel"); if(!p || p._xObs) return;
  p._xObs = new MutationObserver(()=>{ castraXBtnAttach(p, "castraNpcClose"); });
  p._xObs.observe(p, { childList:true });
};

/* ---------- thema: Griekse regio's krijgen het Griekse (blauwe) kleurthema ----------
   Castra is één codebase voor Latijn én Grieks; de wereldschermen volgen de regio (Graecia, Laconia, Troia en
   Themiscyra zijn Grieks, de rest Romeins). Perkamentkleuren staan als variabelen (--parch*, index.html). */
const CASTRA_GREEK_REGIONS = ["graecia","laconia","troia","themiscyra"];
function castraThemeForRegion(rid){
  const W = CASTRA_WORLDS[rid], base = (W && W.parent) || rid;
  document.body.classList.toggle("greek", CASTRA_GREEK_REGIONS.indexOf(base)>=0);
}
const _castraWorldScreenUI0 = SCREENS.castraWorld;
SCREENS.castraWorld = function(){
  _castraWorldScreenUI0.apply(this, arguments);
  castraThemeForRegion(CASTRA_W_REGION);
};
