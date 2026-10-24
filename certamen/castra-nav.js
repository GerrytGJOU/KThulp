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
/* ---------- terug naar Certamen: eerst vragen of je wilt opslaan ----------
   Alle terugknoppen (de ‹ in de kop én de vaste pijl linksboven, castraPortalBack) vragen eerst: opslaan en terug, terug zonder
   opslaan (je voortgang wordt op dit apparaat altijd al bewaard, opslaan zet hem ook in je profiel in de cloud), of blijf spelen.
   De opruimactie (wereld loskoppelen, timers stoppen) gebeurt pas ná de keuze. */
function castraHomeLeave(clean, save){
  try{ castraSave(); if(save) castraSync(); }catch(_){}
  try{ if(clean) clean(); }catch(_){}
  go("home");
}
let CASTRA_LEAVE_ASK = null;
function castraAskLeave(clean){
  if(document.getElementById("castraLeaveAsk")) return;
  CASTRA_LEAVE_ASK = clean || null;
  const o = document.createElement("div"); o.id = "castraLeaveAsk";
  o.style.cssText = "position:fixed;inset:0;z-index:100000;background:rgba(10,7,3,.72);display:flex;align-items:center;justify-content:center;padding:16px";
  const bs = "min-height:46px;font-size:16px;padding:8px 14px;font-family:inherit;cursor:pointer;border-radius:10px;border:2px solid #9c7c1f;";
  o.innerHTML = `<div role="dialog" aria-modal="true" style="max-width:420px;width:100%;background:#241b12;color:#f0e2b8;border:2px solid #d4af37;border-radius:14px;padding:18px;box-shadow:0 8px 30px rgba(0,0,0,.6)">
    <div style="font-size:19px;margin-bottom:6px"><b>Terug naar Certamen</b></div>
    <div style="font-size:15px;line-height:1.4;margin-bottom:12px">Wil je je voortgang opslaan? Hij wordt op dit apparaat al bewaard; opslaan zet hem ook in je profiel, zodat je op een ander apparaat verder kunt.</div>
    <div style="display:flex;flex-direction:column;gap:8px">
      <button style="${bs}background:linear-gradient(#e8c96a,#d4af37);color:#2b1d0e" onclick="castraLeaveChoice('save')">💾 Opslaan en terug</button>
      <button style="${bs}background:rgba(255,255,255,.08);color:#f0e2b8" onclick="castraLeaveChoice('nosave')">Terug zonder opslaan</button>
      <button style="${bs}background:transparent;color:#f0e2b8" onclick="castraLeaveChoice('stay')">Blijf spelen</button></div></div>`;
  document.body.appendChild(o);
}
function castraLeaveChoice(c){
  const o = document.getElementById("castraLeaveAsk"); if(o) o.remove();
  const clean = CASTRA_LEAVE_ASK; CASTRA_LEAVE_ASK = null;
  if(c==="stay") return;
  castraHomeLeave(clean, c==="save");
}
// De vaste pijl linksboven (index.html) ging via goBack() één scherm terug: van de wereld naar het kamp of de regiokeuze. Voor de
// Castra-schermen gaat hij nu net als de ‹-knop naar het hoofdmenu van Certamen (met de opslaan-vraag). Geeft true als hij het afhandelt.
function castraPortalBack(screen){
  const f = { castraHome:()=>castraLeave(), castraWorld:()=>castraWorldLeave(), castraVenatio:()=>castraVLeave(), castraProelium:()=>castraPLeave(),
    castraBattle:()=>castraBLeave(), castraRegions:()=>castraRegionsLeave() }[screen];
  if(!f) return false;
  f(); return true;
}

castraWorldLeave = function(){
  castraAskLeave(()=>{ if(typeof CASTRA_W_UI!=="undefined" && CASTRA_W_UI.px!==undefined) castraWorldSavePos(CASTRA_W_UI.px, CASTRA_W_UI.py); castraWorldDetach(); });
};
castraRegionsLeave = function(){ castraAskLeave(); };
castraPLeave = function(){ castraAskLeave(); };
function castraVLeave(){ castraAskLeave(()=>{ CASTRA_V = null; }); }  // jacht en vangen: stil verlaten
function castraBLeave(){                                              // tower defence: timers opruimen en weg
  castraAskLeave(()=>{
    const o = document.getElementById("cbIntro"); if(o) o.remove();
    if(CASTRA_B){ clearInterval(CASTRA_B.timer); window.removeEventListener("resize", CASTRA_B.resizeFn); }
    CASTRA_B = null;
  });
}
// Het kamp zelf: dezelfde vraag; daarna het oude opruimen (toetsen en schaling loskoppelen).
castraLeave = function(){
  castraAskLeave(()=>{ if(CASTRA_UI.keyFn) document.removeEventListener("keydown", CASTRA_UI.keyFn); if(CASTRA_UI.resizeFn) window.removeEventListener("resize", CASTRA_UI.resizeFn); });
};

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
