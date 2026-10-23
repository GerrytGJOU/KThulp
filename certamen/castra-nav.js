/* ============================================================================
   CASTRA HEROUM — NAVIGATIE: de terugknop (‹) gaat altijd naar het Certamen-hoofdmenu
   ----------------------------------------------------------------------------
   De terugknop bracht je soms van het vangen naar het kamp en daarna weer het veld in: een lus. Nu:
   - de ‹-knop in de kop van elk Castra-scherm (wereld, kamp, jacht, tower defence, campagnekaart, regio's)
     sluit netjes af en gaat naar het Certamen-hoofdmenu;
   - de knoppen in een resultaat (Perge, Iterum, Redi) blijven je "verder" brengen zoals voorheen;
   - naar het kamp ga je met een snelle reis: menu ☰ → Castra (of de poorten in de wereld).
   Het Colosseum (lobby met eigen terugpad naar de arena) en de handleiding (terug naar waar je vandaan kwam) houden
   hun eigen terugweg. Laadt NA castra-geo.js, castra-menu.js en castra-battle.js.
   ============================================================================ */
function castraHomeLeave(){ try{ castraSave(); }catch(_){} go("home"); }

castraWorldLeave = function(){
  try{ if(typeof CASTRA_W_UI!=="undefined" && CASTRA_W_UI.px!==undefined) castraWorldSavePos(CASTRA_W_UI.px, CASTRA_W_UI.py); castraWorldDetach(); }catch(_){}
  castraHomeLeave();
};
castraRegionsLeave = function(){ castraHomeLeave(); };
castraPLeave = function(){ castraHomeLeave(); };
function castraVLeave(){ CASTRA_V = null; castraHomeLeave(); }         // jacht en vangen: stil verlaten
function castraBLeave(){                                               // tower defence: timers opruimen en weg
  const o = document.getElementById("cbIntro"); if(o) o.remove();
  if(CASTRA_B){ clearInterval(CASTRA_B.timer); window.removeEventListener("resize", CASTRA_B.resizeFn); }
  CASTRA_B = null; castraHomeLeave();
}

/* ---------- snelle reis naar het kamp (menu ☰) ---------- */
function castraFastCamp(){
  try{ castraMenuClose(); }catch(_){}
  if(el("cwMap")){ castraGeoToCamp(); return; }
  if(el("castraMap")){ toast("🏕️", "Je bent al in het kamp."); return; }
  go("castraHome");
}
(function(){
  const i = CASTRA_MENU_ITEMS.findIndex(x=>x.id==="mundus");
  CASTRA_MENU_ITEMS.splice(i<0 ? 3 : i, 0, { id:"kamp", la:"Castra", nl:"snelle reis naar het kamp" });
})();
const _castraMenuViewNav0 = castraMenuView;
castraMenuView = function(id){
  if(id==="kamp") return `<h3 style="margin:0 0 6px">Castra <small>snelle reis</small></h3>
    <div style="font-size:14px;margin-bottom:8px">${el("cwMap") ? "Ga meteen terug naar je kamp. Je plek in de wereld wordt bewaard." : "Je bent al in het kamp."}</div>
    ${el("cwMap") ? `<button class="btn btn-gold" style="min-height:44px" onclick="castraFastCamp()">🏕️ Naar het kamp</button>` : ""}`;
  return _castraMenuViewNav0(id);
};
