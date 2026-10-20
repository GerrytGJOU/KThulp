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
