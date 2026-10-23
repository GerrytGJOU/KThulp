/* ============================================================================
   CASTRA HEROUM — SPEELSCHERM: de kaart vult het scherm, info komt eroverheen
   ----------------------------------------------------------------------------
   Het kamp (castraHome) en de wereld (castraWorld) stonden als een lange pagina: kaart in het midden, daaronder
   grondstoffen, opdrachten, gebouwinfo, uitleg en voetregel. Op een telefoon of iPad moest je scrollen om de info
   te zien, en de pijltjestoetsen scrolden soms de pagina. Nu (zoals in Pokémon, Stardew Valley en andere
   spelletjes met een kaart):
   - de kaart vult het hele scherm (vaste laag, de pagina scrolt niet meer);
   - bovenin een smalle balk met terugknop, titel, uitleg (?) en volledig scherm (⛶);
   - grondstoffen, opdrachten en het tutorial staan als smalle overlay bovenaan de kaart;
   - gebouw- en personeelsinfo (cwPanel / castraPanel) schuift als paneel onderin over de kaart, scrolt binnen zichzelf;
   - de uitleg, de "Hodie"-lijst en de voetregel staan achter de knop ?;
   - dialogen en het menu (☰) blijven zoals ze waren (vaste lagen eroverheen).
   De bestaande elementen (cwWrap, cwHud, cwPanel, castraWrap, castraRes, castraPanel, castraTutBar) worden
   alleen verplaatst, dus alle code die ze via hun id vindt blijft werken.
   Laadt NA alle bestanden die SCREENS.castraHome / castraWorld of H() aanpassen.
   ============================================================================ */

const CASTRA_STAGE_CSS = `
body.castra-stage-on{overflow:hidden !important;overscroll-behavior:none}
body.castra-stage-on #app{display:none !important}
#castraStage{position:fixed;inset:0;z-index:40;display:flex;flex-direction:column;background:#14100a}
#cgBar{flex:0 0 auto;height:46px;display:flex;align-items:center;gap:8px;padding:0 8px 0 56px;background:#1b140c;border-bottom:2px solid var(--hi,#d4af37);box-sizing:border-box}
#cgBar .back{margin:0;flex:0 0 auto}
#cgTitle{font-size:18px;font-weight:bold;color:var(--hi-bright,#e8c96a);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}
#cgBar button.cgb{flex:0 0 auto;min-width:40px;min-height:40px;font-size:18px;line-height:1;cursor:pointer;font-family:inherit;border:2px solid var(--hi,#d4af37);border-radius:8px;background:#2a2014;color:var(--hi-bright,#e8c96a)}
#cgMain{position:relative;flex:1 1 auto;min-height:0;overflow:hidden}
#castraStage #cwWrap,#castraStage #castraWrap{position:absolute !important;inset:0;width:auto !important;height:auto !important;margin:0 !important;border:0 !important;border-radius:0 !important}
#cgTop{position:absolute;z-index:60;top:6px;left:58px;right:58px;display:flex;flex-direction:column;gap:4px;pointer-events:none;max-height:34%;overflow:hidden}
#cgTop > *{pointer-events:auto;margin:0 !important}
#cgTop:empty{display:none}
#cgTop #castraRes{display:flex !important;flex-wrap:nowrap !important;overflow-x:auto;justify-content:flex-start !important;gap:5px !important;padding:0;scrollbar-width:none}
#cgTop #castraRes::-webkit-scrollbar{display:none}
#cgTop #castraRes .pill,#cgTop #castraRes button{flex:0 0 auto;font-size:11px !important;letter-spacing:0 !important;padding:2px 7px !important;min-height:0 !important;line-height:1.4;background:rgba(20,16,10,.78)}
#cgTop #cwHud,#cgTop #castraTutBar{font-size:12px;background:rgba(20,16,10,.8);border-radius:8px;padding:0}
#cgTop #cwHud:empty,#cgTop #castraTutBar:empty{display:none}
#cgTop .note,#cgTop .panel{margin:0 !important;padding:4px 8px !important;font-size:12px !important}
#cgBottom{position:absolute;z-index:70;left:8px;right:8px;bottom:8px;max-width:720px;margin:0 auto;display:flex;flex-direction:column;pointer-events:none}
#cgBottom > *{pointer-events:auto;max-height:56vh;background:linear-gradient(170deg,#30251a,#221a12) !important;border:2px solid var(--stone4,#6b5630);color:#f0e2b8;font-size:16px;overflow-y:auto;overscroll-behavior:contain;touch-action:pan-y;-webkit-overflow-scrolling:touch;box-shadow:0 4px 18px rgba(0,0,0,.55);border-radius:10px}
#cgBottom > *:empty{display:none}
#cgBottom .panel{background:transparent !important;border:0;box-shadow:none;margin:0 !important}
#cgBottom .btn{font-size:15px;color:#f0e2b8;background:rgba(255,255,255,.07);border:2px solid #6b5630;border-radius:8px}
#cgBottom .btn.btn-gold{background:linear-gradient(#e8c96a,#d4af37);color:#2b1d0e;border-color:#9c7c1f}
#cgBottom h3{font-size:17px}
#cgBottom small,#cgBottom .note{font-size:14px}
#cgInfo{position:absolute;z-index:80;top:6px;right:58px;left:58px;max-width:520px;margin-left:auto;max-height:calc(100% - 12px);overflow-y:auto;touch-action:pan-y;background:var(--parch,#efe1b9);color:var(--parch-ink,#2b1d0e);border:3px solid var(--parch-edge,#4a3416);border-radius:10px;padding:10px 14px;font-size:14px;box-shadow:0 4px 18px rgba(0,0,0,.6)}
#cgInfo[hidden]{display:none}
#cgBar button.cgfs{padding:0 10px;font-size:14px;white-space:nowrap}
#cgFloat{position:absolute;z-index:75;left:6px;top:56px;display:none;flex-direction:column;gap:6px}
#cgFloat button{min-width:40px;min-height:40px;font-size:18px;line-height:1;cursor:pointer;font-family:inherit;border:2px solid var(--hi,#d4af37);border-radius:8px;background:rgba(27,20,12,.82);color:var(--hi-bright,#e8c96a)}
body.castra-immersive #cgBar{display:none}
body.castra-immersive #cgFloat{display:flex}
body.castra-immersive .portal-back{display:none !important}
#cgInfo .panel{background:#241b12 !important;color:#f0e2b8;margin-top:8px !important}
#cgInfo .foot{margin-top:10px;font-size:12px;opacity:.7;text-align:center}
`;

let CASTRA_STAGE = { ro:null };

function castraStageRemove(){
  if(CASTRA_STAGE.ro){ try{ CASTRA_STAGE.ro.disconnect(); }catch(_){} CASTRA_STAGE.ro = null; }
  const s = document.getElementById("castraStage"); if(s) s.remove();
  document.body.classList.remove("castra-stage-on", "castra-immersive");   // de keuze zelf blijft bewaard (localStorage)
}
// Elke schermwissel (H) ruimt de oude speellaag op, ook als een scherm niet via go() wordt geopend.
const _castraStageH0 = H;
H = function(html){ castraStageRemove(); return _castraStageH0.apply(this, arguments); };

function castraStageFs(){
  const d = document, e = d.documentElement, on = d.fullscreenElement || d.webkitFullscreenElement;
  try{
    if(!on) (e.requestFullscreen || e.webkitRequestFullscreen).call(e);
    else (d.exitFullscreen || d.webkitExitFullscreen).call(d);
  }catch(_){}
}
/* Full-screen (immersief): balk en terugknop van de pagina verdwijnen, de kaart vult alles. De info blijft bereikbaar via
   de knoppen links (? uitleg, ‹ terug) en het menu (☰); grondstoffen en opdrachten blijven als strook bovenaan. Waar de
   browser het ondersteunt (laptop, Android, iPad) gaat ook echt volledig scherm aan; op een iPhone is het de verborgen balk. */
function castraStageImmersive(on){
  const b = document.body, fsOk = !!(document.fullscreenEnabled || document.webkitFullscreenEnabled), d = document;
  if(on == null) on = !b.classList.contains("castra-immersive");
  b.classList.toggle("castra-immersive", !!on);
  try{ localStorage.setItem("castra_immersive", on ? "1" : "0"); }catch(_){}
  try{
    const fsEl = d.fullscreenElement || d.webkitFullscreenElement, e = d.documentElement;
    if(on && fsOk && !fsEl){ CASTRA_STAGE.fsEntered = true; (e.requestFullscreen || e.webkitRequestFullscreen).call(e); }
    else if(!on && fsEl){ CASTRA_STAGE.fsEntered = false; (d.exitFullscreen || d.webkitExitFullscreen).call(d); }
  }catch(_){}
  const f = document.getElementById("cgFit"); if(f) f.click();
  window.dispatchEvent(new Event("resize"));
}
document.addEventListener("fullscreenchange", ()=>{ if(!document.fullscreenElement && CASTRA_STAGE.fsEntered){ CASTRA_STAGE.fsEntered = false; document.body.classList.remove("castra-immersive"); try{ localStorage.setItem("castra_immersive","0"); }catch(_){} window.dispatchEvent(new Event("resize")); } });
function castraStageInfoToggle(){ const i = document.getElementById("cgInfo"); if(i) i.hidden = !i.hidden; }

function castraStageBuild(kind){
  castraStageRemove();
  const wrap = el(kind==="world" ? "cwWrap" : "castraWrap"); if(!wrap) return;
  if(!document.getElementById("castraStageCss")){ const st = document.createElement("style"); st.id = "castraStageCss"; st.textContent = CASTRA_STAGE_CSS; document.head.appendChild(st); }
  const back = app.querySelector(".scrhead .back"), h2 = app.querySelector(".scrhead h2");
  const hodie = el("castraRes") && el("castraRes").nextElementSibling;
  const help = kind==="world"
    ? `Sleep met je duim of gebruik de pijltjestoetsen om te lopen, of tik ergens om daarheen te gaan. Loop door het <b>hoge, donkere gras</b>: daar kun je vijanden ontmoeten. Het menu (☰) staat rechtsboven.`
    : `Sleep met je duim of gebruik de pijltjestoetsen om te lopen. Tik op een gebouw om het te openen (met toetsenbord: sta ervoor en druk op Enter of spatie). Het menu (☰) staat rechtsboven.`;
  const st = document.createElement("div"); st.id = "castraStage";
  st.innerHTML = `<div id="cgBar"><span id="cgBackSlot" style="display:flex"></span><div id="cgTitle"></div><span style="flex:1"></span>
      <button class="cgb" id="cgHelp" aria-label="Uitleg" onclick="castraStageInfoToggle()">?</button><button class="cgb cgfs" id="cgFs" aria-label="Full-screen" onclick="castraStageImmersive(true)">⛶ Full-screen</button></div>
    <div id="cgMain"><div id="cgTop"></div><div id="cgBottom"></div><div id="cgInfo" hidden><div>${help}</div></div>
      <div id="cgFloat"><button aria-label="Sluit full-screen" onclick="castraStageImmersive(false)">⤡</button><button aria-label="Uitleg" onclick="castraStageInfoToggle()">?</button>${back ? `<button aria-label="Terug" onclick="${esc(back.getAttribute("onclick")||"")}">‹</button>` : ""}</div></div>`;
  document.body.appendChild(st);
  document.body.classList.add("castra-stage-on");
  const main = st.querySelector("#cgMain"), top = st.querySelector("#cgTop"), bottom = st.querySelector("#cgBottom"), info = st.querySelector("#cgInfo");
  main.insertBefore(wrap, main.firstChild);
  if(back) st.querySelector("#cgBackSlot").appendChild(back);
  st.querySelector("#cgTitle").textContent = h2 ? h2.textContent : "Castra Heroum";
  ["castraRes","castraTutBar","cwHud"].forEach(id=>{ const n = el(id); if(n) top.appendChild(n); });
  ["cwPanel","castraPanel"].forEach(id=>{ const n = el(id); if(n) bottom.appendChild(n); });
  if(hodie && (hodie.id==="castraHodie" || /castraHodieToggle/.test(hodie.innerHTML))) info.appendChild(hodie);
  info.insertAdjacentHTML("beforeend", foot());
  let pref = false; try{ pref = localStorage.getItem("castra_immersive")==="1"; }catch(_){}
  if(pref) document.body.classList.add("castra-immersive");    // eerder gekozen: zonder fullscreen-verzoek (dat vraagt een tik)
  const fit = kind==="world" ? castraWorldFit : castraFit;
  fit();
  if(window.ResizeObserver){ CASTRA_STAGE.ro = new ResizeObserver(()=>fit()); CASTRA_STAGE.ro.observe(wrap); }
}

/* ---------- de kaart past zich aan het hele scherm aan ---------- */
const _castraWorldFitSt0 = castraWorldFit;
castraWorldFit = function(){
  const w = el("cwWrap"); if(!w || !w.closest("#castraStage")) return _castraWorldFitSt0();
  const pw = w.clientWidth, ph = w.clientHeight; if(!pw || !ph) return;
  const s = Math.max(0.6, Math.min(1.5, Math.min(pw, ph)/480));      // telefoon ±10 tegels breed, laptop ±18 tegels
  CASTRA_W_UI.scale = s; CASTRA_W_UI.stageView = { cols:pw/(48*s), rows:ph/(48*s) };
  castraWorldCamera();
};
const _castraWViewSt0 = castraWView;
castraWView = function(){
  const w = el("cwWrap");
  return (w && w.closest("#castraStage") && CASTRA_W_UI.stageView) || _castraWViewSt0();
};
// Kleine kaarten (huizen) in het midden zetten in plaats van linksboven.
castraWorldCamera = function(){
  const W = castraWorldCfg(), V = castraWView(), s = CASTRA_W_UI.scale, m = el("cwMap"); if(!m) return;
  const ax = (cols, vc, p)=>cols*48 <= vc*48 ? -(vc*48 - cols*48)/2 : Math.max(0, Math.min(cols*48 - vc*48, p*48 + 24 - vc*24));
  const camX = ax(W.cols, V.cols, CASTRA_W_UI.px), camY = ax(W.rows, V.rows, CASTRA_W_UI.py);
  m.style.transform = `translate(${-camX*s}px,${-camY*s}px) scale(${s})`;
  CASTRA_W_UI.camX = camX; CASTRA_W_UI.camY = camY;
};
// Kampkaart in het midden zetten of (staand scherm) laten meebewegen met de avatar.
function castraCampCamera(){
  const w = el("castraWrap"), m = el("castraMap"); if(!w || !m || !w.closest("#castraStage")) return;
  const T = CASTRA_MAP, s = CASTRA_UI.scale||1, pw = w.clientWidth, ph = w.clientHeight, mw = T.cols*T.tile*s, mh = T.rows*T.tile*s;
  const cx = (CASTRA_UI.px*T.tile + T.tile/2)*s, cy = (CASTRA_UI.py*T.tile + T.tile/2)*s;
  const ax = (pv, mv, c)=> mv <= pv ? (pv-mv)/2 : -Math.max(0, Math.min(mv-pv, c-pv/2));
  m.style.left = ax(pw, mw, cx)+"px"; m.style.top = ax(ph, mh, cy)+"px";
}
const _castraDrawAvatarSt0 = castraDrawAvatar;
castraDrawAvatar = function(){ _castraDrawAvatarSt0.apply(this, arguments); try{ castraCampCamera(); }catch(_){} };
const _castraFitSt0 = castraFit;
castraFit = function(){
  const w = el("castraWrap"); if(!w || !w.closest("#castraStage")) return _castraFitSt0();
  const T = CASTRA_MAP, pw = w.clientWidth, ph = w.clientHeight, m = el("castraMap"); if(!pw || !ph || !m) return;
  const sFill = ph/(T.rows*T.tile), sContain = Math.min(pw/(T.cols*T.tile), sFill);
  const pan = sContain < 0.65*sFill && pw < T.cols*T.tile*Math.min(1.3, sFill);   // staand scherm: kaart groter en de camera volgt je
  const s = Math.max(0.3, Math.min(pan ? 1.3 : 2, pan ? sFill : sContain));
  CASTRA_UI.scale = s; CASTRA_UI.pan = pan;
  m.style.transition = pan ? "left .17s linear, top .17s linear" : "none";
  m.style.transform = "scale("+s+")";
  castraCampCamera();
  m.style.setProperty("--lbl", Math.max(11, Math.round(11/s*0.95))+"px");
};

/* ---------- de schermen zelf ---------- */
const _castraHomeSt0 = SCREENS.castraHome;
SCREENS.castraHome = function(){ _castraHomeSt0.apply(this, arguments); try{ castraStageBuild("camp"); }catch(e){ console.error(e); } };
const _castraWorldSt0 = SCREENS.castraWorld;
SCREENS.castraWorld = function(){ _castraWorldSt0.apply(this, arguments); try{ castraStageBuild("world"); }catch(e){ console.error(e); } };
