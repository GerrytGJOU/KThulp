/* ============================================================================
   CASTRA HEROUM — TOWER DEFENCE-SCHERM: de kaart vult het scherm (zoals kamp en wereld)
   ----------------------------------------------------------------------------
   Het gevecht stond als lange pagina: kaart, daaronder knoppen en een lijst kaarten met je eenheden. Nu (zelfde opzet
   als castra-stage.js):
   - de kaart vult het scherm en wordt zo groot mogelijk (tot ruim 2,5 keer; de sprites zijn dan scherper dan voorheen);
   - bovenin een balk met terug, titel, ? (uitleg) en Full-screen; in Full-screen verdwijnt de balk en komen er
     knoppen links (sluiten, uitleg, terug);
   - levens, golf, aantal eenheden, regels en bevelen (Impete!/State!) staan als smalle strook bovenaan de kaart;
   - onderin een dok met de knoppen (start, sneller, auto) en je eenheden als rij kaarten om te kiezen en neer te zetten;
   - het resultaat verschijnt als paneel over de kaart.
   De bestaande elementen (cbWrap, cbHud, cbSynChips, cbCmd, cbCtl, cbCards, cbResult) worden alleen verplaatst, dus alle
   code die ze via hun id vindt (castra-battle.js, castra-range.js, Legio) blijft werken.
   Laadt NA castra-stage.js en castra-range.js.
   ============================================================================ */
const CASTRA_BSTAGE_CSS = `
#castraStage #cgMain.cgcol{display:flex;flex-direction:column}
#castraStage #cbWrap{position:relative !important;flex:1 1 auto;min-height:0;width:auto !important;height:auto !important;margin:0 !important;border:0 !important;border-radius:0 !important}
#cgMain.cgcol #cgTop{position:static;left:auto;right:auto;top:auto;max-height:none;flex:0 0 auto;padding:4px 8px;gap:4px;background:rgba(20,16,10,.9);border-bottom:1px solid #6b5630;z-index:60;pointer-events:auto;overflow:visible}
#cgMain.cgcol #cgTop > *{margin:0 !important}
#cgMain.cgcol #cgTop #cbHud{display:flex;flex-wrap:wrap;gap:4px 14px;justify-content:center;font-size:13px;padding:0}
#cgMain.cgcol #cgTop #cbSynChips:empty,#cgMain.cgcol #cgTop #cbCmd:empty{display:none}
#cgMain.cgcol #cgTop #cbSynChips,#cgMain.cgcol #cgTop #cbCmd{padding:0;font-size:12px}
#cgMain.cgcol #cgTop #cbCmd > div:first-child{flex-wrap:nowrap !important;gap:6px !important}
#cgMain.cgcol #cgTop #cbCmd .btn{min-height:38px !important;min-width:0 !important;padding:2px 10px;font-size:13px;line-height:1.1}
#cgMain.cgcol #cgTop #cbCmd .btn small{font-size:11px}
#cgMain.cgcol #cgTop #cbCmd span[title]{font-size:16px}
#cgMain.cgcol #cgTop #cbCmd span[title] span{font-size:17px !important}
#cgDock{flex:0 0 auto;max-height:44%;overflow-y:auto;background:rgba(20,16,10,.94);border-top:2px solid var(--hi,#d4af37);padding:6px 8px;touch-action:pan-y;overscroll-behavior:contain}
#cgDock #cbCtl{margin:0 0 6px !important;display:flex;flex-wrap:wrap;gap:6px;align-items:center}
#cgDock #cbCtl .btn{min-height:40px !important;padding:4px 12px;font-size:14px}
#cgDock #cbCards{display:flex;gap:6px;overflow-x:auto;padding-bottom:2px}
#cgDock #cbCards > .note{display:none}
#cgDock #cbCards .tile{flex:0 0 auto;min-width:150px;max-width:210px;margin:0;padding:6px 10px;text-align:left}
#cgDock #cbCards .tile h3{font-size:14px;margin:0 0 2px}
#cgDock #cbCards .tile p{font-size:11px;margin:0}
#castraStage #cbResult{position:absolute;z-index:85;left:8px;right:8px;bottom:8px;max-width:620px;margin:0 auto;max-height:80%;overflow-y:auto;touch-action:pan-y}
#castraStage #cbResult:empty{display:none}
`;

function castraBStageBuild(){
  const B = CASTRA_B; const wrap = el("cbWrap"); if(!wrap || !B) return;
  castraStageRemove();
  if(!document.getElementById("castraStageCss") && typeof CASTRA_STAGE_CSS!=="undefined"){ const s0 = document.createElement("style"); s0.id = "castraStageCss"; s0.textContent = CASTRA_STAGE_CSS; document.head.appendChild(s0); }
  if(!document.getElementById("castraBStageCss")){ const s1 = document.createElement("style"); s1.id = "castraBStageCss"; s1.textContent = CASTRA_BSTAGE_CSS; document.head.appendChild(s1); }
  const back = app.querySelector(".scrhead .back"), h2 = app.querySelector(".scrhead h2");
  const fsOk = !!(document.fullscreenEnabled || document.webkitFullscreenEnabled);
  const help = `Kies onderin een eenheid en tik op een lege plek naast de weg om hem neer te zetten; een cirkel toont zijn bereik. Tik op een eenheid om hem te verplaatsen of terug te nemen zolang er geen golf loopt. Start dan de golf: elke vijand die je kamp bereikt kost een leven.`;
  const st = document.createElement("div"); st.id = "castraStage";
  st.innerHTML = `<div id="cgBar"><span id="cgBackSlot" style="display:flex"></span><div id="cgTitle"></div><span style="flex:1"></span>
      <button class="cgb" aria-label="Uitleg" onclick="castraStageInfoToggle()">?</button><button class="cgb cgfs" id="cgFs" aria-label="Full-screen" onclick="castraStageImmersive(true)">⛶ Full-screen</button></div>
    <div id="cgMain" class="cgcol"><div id="cgTop"></div><div id="cgDock"></div>
      <div id="cgInfo" hidden><div>${help}</div>${typeof castraBInfo==="function" ? `<button class="btn" onclick="castraBInfo()">ⓘ Vijanden en regels van deze missie</button>` : ""}${typeof castraFaqOpen==="function" ? `<button class="btn btn-gold" style="margin-left:6px" onclick="castraFaqOpen('game')">📖 Volledige handleiding</button>` : ""}</div>
      <div id="cgFloat"><button aria-label="Sluit full-screen" onclick="castraStageImmersive(false)">⤡</button><button aria-label="Uitleg" onclick="castraStageInfoToggle()">?</button>${back ? `<button aria-label="Terug" onclick="${esc(back.getAttribute("onclick")||"")}">‹</button>` : ""}</div></div>`;
  document.body.appendChild(st);
  document.body.classList.add("castra-stage-on");
  const main = st.querySelector("#cgMain"), top = st.querySelector("#cgTop"), dock = st.querySelector("#cgDock");
  main.insertBefore(wrap, main.firstChild);
  if(back) st.querySelector("#cgBackSlot").appendChild(back);
  st.querySelector("#cgTitle").textContent = h2 ? h2.textContent.replace(/\s*ⓘ\s*/g," · ").replace(/[ ·]+$/,"") : "Castra Heroum";
  ["cbHud","cbSynChips","cbCmd"].forEach(id=>{ const n = el(id); if(n) top.appendChild(n); });
  ["cbCtl","cbCards"].forEach(id=>{ const n = el(id); if(n) dock.appendChild(n); });
  const res = el("cbResult"); if(res) main.appendChild(res);
  let pref = false; try{ pref = localStorage.getItem("castra_immersive")==="1"; }catch(_){}
  if(pref) document.body.classList.add("castra-immersive");
  castraBFit();
  if(window.ResizeObserver){ CASTRA_STAGE.ro = new ResizeObserver(()=>castraBFit()); CASTRA_STAGE.ro.observe(wrap); CASTRA_STAGE.ro.observe(dock); }
}

// De kaart zo groot mogelijk in het vak boven het dok, in het midden.
const _castraBFitSg0 = castraBFit;
castraBFit = function(){
  const w = el("cbWrap"); if(!w || !w.closest("#castraStage")) return _castraBFitSg0.apply(this, arguments);
  const pw = w.clientWidth, ph = w.clientHeight, m = el("cbMap"); if(!pw || !ph || !m) return;
  const s = Math.max(0.35, Math.min(2.6, pw/(CASTRA_P.cols*48), ph/(CASTRA_P.rows*48)));
  CASTRA_B.scale = s;
  m.style.transformOrigin = "top left"; m.style.transform = "scale("+s+")";
  m.style.left = Math.max(0, (pw - CASTRA_P.cols*48*s)/2)+"px"; m.style.top = Math.max(0, (ph - CASTRA_P.rows*48*s)/2)+"px";
};

const _castraBattleScrSg0 = SCREENS.castraBattle;
SCREENS.castraBattle = function(){ _castraBattleScrSg0.apply(this, arguments); try{ castraBStageBuild(); }catch(e){ console.error(e); } };
