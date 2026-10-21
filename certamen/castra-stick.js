/* ============================================================================
   CASTRA HERONUM — DRIJVENDE JOYSTICK (duimbesturing, zoals in Kingshot)
   ----------------------------------------------------------------------------
   Raak je het kaartscherm aan en sleep je, dan verschijnt de joystick op de
   plek waar je duim neerkomt; de knop volgt je duim en het personage loopt
   door zolang je vasthoudt. Een korte tik (zonder slepen) blijft "tik om daar
   naartoe te lopen" / een gebouw openen. Werkt met aanraking, pen en muis.
   castraStickAttach(wrapEl, { step(dir)->bool, tap(event) })
   Laadt vóór castra.js en castra-world.js.
   ============================================================================ */

const CASTRA_STICK = { dead:14, radius:54, tapMs:380, repeatMs:60, startDrag:10 };

function castraStickAttach(wrap, opts){
  if(!wrap || wrap._castraStick) return;
  wrap._castraStick = true;
  wrap.style.touchAction = "none";          // geen paginascroll/zoom tijdens het sturen
  wrap.style.userSelect = "none"; wrap.style.webkitUserSelect = "none";
  let st = null, base = null, knob = null, timer = null;

  function ui(x, y){
    base = document.createElement("div");
    base.style.cssText = `position:fixed;z-index:9997;width:${CASTRA_STICK.radius*2+24}px;height:${CASTRA_STICK.radius*2+24}px;border-radius:50%;
      left:${x-CASTRA_STICK.radius-12}px;top:${y-CASTRA_STICK.radius-12}px;pointer-events:none;
      background:radial-gradient(circle,rgba(212,175,55,.10) 0,rgba(212,175,55,.18) 70%,rgba(212,175,55,.30) 100%);border:2px solid rgba(212,175,55,.55);box-shadow:0 0 12px rgba(0,0,0,.45)`;
    knob = document.createElement("div");
    knob.style.cssText = `position:fixed;z-index:9998;width:52px;height:52px;border-radius:50%;left:${x-26}px;top:${y-26}px;pointer-events:none;
      background:radial-gradient(circle at 35% 30%,#f6dd8e,var(--hi,#d4af37) 60%,#9c7c1f);border:2px solid #7a5410;box-shadow:0 2px 8px rgba(0,0,0,.5)`;
    document.body.appendChild(base); document.body.appendChild(knob);
  }
  function cleanup(){
    clearInterval(timer); timer = null;
    if(base){ base.remove(); base = null; } if(knob){ knob.remove(); knob = null; }
  }
  function dirOf(dx, dy){
    if(Math.hypot(dx,dy) < CASTRA_STICK.dead) return null;
    return Math.abs(dx) > Math.abs(dy) ? (dx>0?"right":"left") : (dy>0?"down":"up");
  }
  function tick(){
    if(!st || !st.dir) return;
    if(st.blockedDir === st.dir) return;                 // tegen een muur/gebouw: niet blijven rammelen
    const ok = opts.step(st.dir);
    if(ok === false) st.blockedDir = st.dir;
  }

  wrap.addEventListener("pointerdown", e=>{
    if(e.button!==undefined && e.button>0) return;
    if(e.target.closest && e.target.closest("button")) return;
    st = { id:e.pointerId, x:e.clientX, y:e.clientY, t:Date.now(), drag:false, dir:null, blockedDir:null, ev:e };
    try{ wrap.setPointerCapture(e.pointerId); }catch(_){}
    e.preventDefault();
  });
  wrap.addEventListener("pointermove", e=>{
    if(!st || e.pointerId!==st.id) return;
    const dx = e.clientX-st.x, dy = e.clientY-st.y;
    if(!st.drag){
      if(Math.hypot(dx,dy) < CASTRA_STICK.startDrag) return;
      st.drag = true; ui(st.x, st.y);
      timer = setInterval(tick, CASTRA_STICK.repeatMs);
    }
    const d = Math.hypot(dx,dy), k = d>CASTRA_STICK.radius ? CASTRA_STICK.radius/d : 1;
    if(knob){ knob.style.left = (st.x+dx*k-26)+"px"; knob.style.top = (st.y+dy*k-26)+"px"; }
    const nd = dirOf(dx,dy);
    if(nd !== st.dir){ st.dir = nd; st.blockedDir = null; if(nd) tick(); }
    e.preventDefault();
  });
  const end = e=>{
    if(!st || e.pointerId!==st.id) return;
    const wasDrag = st.drag, quick = Date.now()-st.t < CASTRA_STICK.tapMs, s = st;
    st = null; cleanup();
    try{ wrap.releasePointerCapture(e.pointerId); }catch(_){}
    if(!wasDrag && quick && e.type==="pointerup" && opts.tap) opts.tap(e);
  };
  wrap.addEventListener("pointerup", end);
  wrap.addEventListener("pointercancel", end);
  wrap.addEventListener("contextmenu", e=>e.preventDefault());
}

// Op een aanraakscherm is de pijltjesknoppen-balk overbodig: verberg die.
function castraStickHidePad(){
  const coarse = window.matchMedia && window.matchMedia("(pointer:coarse)").matches;
  const pad = document.getElementById("castraPad");
  if(pad && coarse) pad.style.display = "none";
}
