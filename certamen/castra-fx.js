/* ============================================================================
   CASTRA HEROUM — VELDEFFECTEN EN KLEINE GELUIDJES: DE WERELD REAGEERT OP JE STAP (naar de field effects van Pokémon)
   ----------------------------------------------------------------------------
   Pokémon laat de omgeving op elke stap reageren (field_effects.h: gras ritselt, water rimpelt, zandvoetstappen, stof, glinsteringen).
   Hier hetzelfde, met lichte overlays (geen nieuwe afbeeldingen):
     - hoog gras ritselt (bladeren), water rimpelt als je ernaast loopt en glinstert, zand krijgt voetstappen die vervagen,
       een stofwolkje bij een sprong van een ledge en bij het duwen van een rots; schaduwen onder bomen staan in castra-berg.js;
     - sfeer: overdag vlinders (in groene landen), 's nachts vuurvliegjes, af en toe een vogel die overvliegt;
     - kleine geluidjes (WebAudio, geen bestanden): stappen op gras, zand, steen en een brug, sprong en landing, rots, rimpel, vondst, kist,
       aankoop, genezing en de waarschuwing van een trainer. In het menu ☰ → Sonus zet je ze aan of uit (standaard aan, zacht).
   Respecteert "minder beweging" van het apparaat (dan geen effecten, wel geluid). Muziek is hier niet: dat vraagt echte bestanden.
   Laadt NA castra-berg.js en castra-hidden.js.
   ============================================================================ */
const CASTRA_FX = { butterflyRegions:["latium","gallia","germania","themiscyra","graecia","laconia","roma"], ambientMs:28000 };
function castraFxEnabled(){ try{ return !(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches); }catch(e){ return true; } }
function castraFxCss(){
  if(document.getElementById("castraFxCss")) return;
  const st = document.createElement("style"); st.id = "castraFxCss";
  st.textContent = `
  .cwFxI{position:absolute;pointer-events:none;z-index:5}
  .cwLeaf{width:7px;height:4px;border-radius:50% 0;background:#6fb04a;animation:cwLeafK .55s ease-out forwards}
  @keyframes cwLeafK{0%{opacity:.95;transform:translate(0,0) rotate(0)}100%{opacity:0;transform:translate(var(--dx),var(--dy)) rotate(var(--rot))}}
  .cwRing{width:14px;height:8px;border:2px solid rgba(255,255,255,.75);border-radius:50%;animation:cwRingK .8s ease-out forwards}
  @keyframes cwRingK{0%{opacity:.9;transform:scale(.3)}100%{opacity:0;transform:scale(2.6)}}
  .cwPrint{width:5px;height:8px;border-radius:50%;background:rgba(90,65,30,.38);animation:cwPrintK 4.5s ease-in forwards}
  @keyframes cwPrintK{0%{opacity:.55}100%{opacity:0}}
  .cwDust{width:14px;height:14px;border-radius:50%;background:rgba(225,210,175,.7);animation:cwDustK .5s ease-out forwards}
  @keyframes cwDustK{0%{opacity:.8;transform:translate(0,0) scale(.4)}100%{opacity:0;transform:translate(var(--dx),var(--dy)) scale(1.8)}}
  .cwGlint{width:4px;height:4px;background:rgba(255,255,255,.9);border-radius:50%;animation:cwGlintK 2.4s ease-in-out infinite}
  @keyframes cwGlintK{0%,100%{opacity:0;transform:scale(.3)}50%{opacity:.85;transform:scale(1.2)}}
  .cwFly{font-size:16px;animation:cwFlyK var(--t,14s) linear forwards;opacity:0}
  @keyframes cwFlyK{0%{opacity:0;transform:translate(0,0)}10%{opacity:1}40%{transform:translate(calc(var(--dx)*.4),calc(var(--dy)*-.5))}70%{transform:translate(calc(var(--dx)*.75),calc(var(--dy)*.3))}90%{opacity:1}100%{opacity:0;transform:translate(var(--dx),var(--dy))}}
  .cwFire{width:5px;height:5px;border-radius:50%;background:#f4e27a;box-shadow:0 0 8px 3px rgba(244,226,122,.7);animation:cwFireK var(--t,9s) ease-in-out forwards;opacity:0}
  @keyframes cwFireK{0%{opacity:0;transform:translate(0,0)}20%{opacity:.95}50%{opacity:.35;transform:translate(calc(var(--dx)*.5),calc(var(--dy)*.5))}80%{opacity:.95}100%{opacity:0;transform:translate(var(--dx),var(--dy))}}`;
  document.head.appendChild(st);
}
function castraFxLayer(){
  const map = el("cwMap"); if(!map) return null;
  let box = el("cwFx"); if(!box){ box = document.createElement("div"); box.id = "cwFx"; box.style.cssText = "position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none;z-index:5"; map.insertBefore(box, el("cwAbove")); }
  return box;
}
function castraFxPut(html, ms){
  if(!castraFxEnabled()) return; castraFxCss(); const box = castraFxLayer(); if(!box) return;
  box.insertAdjacentHTML("beforeend", html); const n = box.lastElementChild; setTimeout(()=>{ if(n && n.parentNode) n.remove(); }, ms);
}
const castraFxR = (a,b)=>a+Math.random()*(b-a);                // alleen voor sfeer; de spelregels gebruiken dit niet
function castraFxGrass(x, y){ let h = ""; for(let i=0;i<5;i++){ const a = castraFxR(0, Math.PI*2), d = castraFxR(10,22);
  h += `<div class="cwFxI cwLeaf" style="left:${x*48+22}px;top:${y*48+26}px;--dx:${Math.round(Math.cos(a)*d)}px;--dy:${Math.round(Math.sin(a)*d-8)}px;--rot:${Math.round(castraFxR(-200,200))}deg"></div>`; } castraFxPut(h, 650); }
function castraFxRipple(x, y){ castraFxPut(`<div class="cwFxI cwRing" style="left:${x*48+17}px;top:${y*48+20}px"></div>`, 900); }
function castraFxPrint(x, y, dir){ const side = (x+y)%2 ? -6 : 6, h = dir==="left"||dir==="right"; castraFxPut(`<div class="cwFxI cwPrint" style="left:${x*48+(h?20:21+side)}px;top:${y*48+(h?21+side:20)}px;${h?"width:8px;height:5px":""}"></div>`, 4600); }
function castraFxDust(x, y, dir){ let h = ""; for(let i=0;i<4;i++){ const a = castraFxR(0, Math.PI*2);
  h += `<div class="cwFxI cwDust" style="left:${x*48+17+Math.round(castraFxR(-8,8))}px;top:${y*48+26}px;--dx:${Math.round(Math.cos(a)*18)}px;--dy:${Math.round(Math.sin(a)*10-12)}px"></div>`; } castraFxPut(h, 600); }

/* ---------- een stap ---------- */
function castraFxGround(x, y){ const B = castraWorldBuilt(); return (B.ground && B.ground[y] && B.ground[y][x]) || "grass"; }
function castraFxStep(x, y){
  const U = CASTRA_W_UI; if(U.fxSkip) return;
  const B = castraWorldBuilt(), g = castraFxGround(x, y), tall = B.tall && B.tall[x+","+y], rid = CASTRA_W_REGION;
  if(tall){ castraFxGrass(x, y); castraSfx("grass"); }
  else if(g==="sand" || g==="sand2"){ castraFxPrint(x, y, U.dir); castraSfx("sand"); }
  else if(g==="plank"){ castraSfx("wood"); }
  else if(g==="stone" || g==="stoneb" || g==="cobble"){ castraSfx("stone"); }
  else castraSfx("soft");
  // water ernaast: een rimpel op de watertegel
  [[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>{ if(typeof castraIsWater==="function" && castraIsWater(rid, x+dx, y+dy)){ castraFxRipple(x+dx, y+dy); castraSfx("ripple"); return true; } return false; });
}
const _castraWorldSavePosFx0 = castraWorldSavePos;
castraWorldSavePos = function(x, y){ const r = _castraWorldSavePosFx0.apply(this, arguments); try{ castraFxStep(x, y); }catch(e){ console.error(e); } return r; };

/* ---------- sfeer: water glinstert, vlinders, vuurvliegjes, vogels ---------- */
function castraFxWater(){
  if(!castraFxEnabled()) return; const W = castraWorldCfg(), box = castraFxLayer(); if(!box || !W.water || !W.water.length) return; castraFxCss();
  const old = el("cwWater"); if(old) old.remove();
  let h = ""; W.water.forEach(wt=>{ for(let y=1;y<W.rows-1;y++) for(let x=wt.x0;x<=wt.x1;x++){ if(wt.bridgeY && wt.bridgeY.includes(y)) continue; if(((x*7+y*13)%5)!==0) continue;
    h += `<div class="cwFxI cwGlint" style="left:${x*48+10+(x*y%24)}px;top:${y*48+8+((x+y)*5%28)}px;animation-delay:${((x*3+y*7)%24)/10}s"></div>`; } });
  const d = document.createElement("div"); d.id = "cwWater"; d.style.cssText = "position:absolute;inset:0;pointer-events:none;z-index:2"; d.innerHTML = h; el("cwMap").insertBefore(d, el("cwAbove"));
}
function castraFxAmbient(){
  if(!castraFxEnabled() || !el("cwMap")) return; castraFxCss();
  const U = CASTRA_W_UI, W = castraWorldCfg(), V = castraWView(), rid = W.parent || CASTRA_W_REGION, phase = typeof castraDayPhase==="function" ? castraDayPhase().id : "dies";
  const cx = U.camX||0, cy = U.camY||0, wpx = V.cols*48, hpx = V.rows*48;
  if(W.interior) return;
  const night = phase==="nox" || phase==="vesper";
  let h = "", n = 0;
  if(night){ n = 6; for(let i=0;i<n;i++){ const t = castraFxR(7,12); h += `<div class="cwFxI cwFire" style="left:${Math.round(cx+castraFxR(20,wpx-20))}px;top:${Math.round(cy+castraFxR(40,hpx-30))}px;--dx:${Math.round(castraFxR(-60,60))}px;--dy:${Math.round(castraFxR(-40,40))}px;--t:${t.toFixed(1)}s;animation-delay:${castraFxR(0,3).toFixed(1)}s"></div>`; } }
  else if(CASTRA_FX.butterflyRegions.indexOf(rid)>=0){ n = 4; for(let i=0;i<n;i++){ const t = castraFxR(11,18), dir = Math.random()<.5 ? 1 : -1; h += `<div class="cwFxI cwFly" style="left:${Math.round(cx+(dir>0?castraFxR(0,wpx*.3):castraFxR(wpx*.7,wpx)))}px;top:${Math.round(cy+castraFxR(hpx*.2,hpx*.8))}px;--dx:${Math.round(dir*castraFxR(wpx*.5,wpx*.9))}px;--dy:${Math.round(castraFxR(-60,60))}px;--t:${t.toFixed(1)}s;animation-delay:${castraFxR(0,5).toFixed(1)}s">🦋</div>`; } }
  if(Math.random()<.4){ const dir = Math.random()<.5 ? 1 : -1; h += `<div class="cwFxI cwFly" style="left:${Math.round(cx+(dir>0?0:wpx))}px;top:${Math.round(cy+castraFxR(10,hpx*.35))}px;--dx:${dir*wpx}px;--dy:${Math.round(castraFxR(-30,30))}px;--t:9s;font-size:18px">🐦</div>`; }
  if(h){ const box = castraFxLayer(); if(box) box.insertAdjacentHTML("beforeend", h); }
}
let _castraFxAmbT = null;
const _castraWorldRenderFx0 = castraWorldRender;
castraWorldRender = function(){
  const r = _castraWorldRenderFx0.apply(this, arguments);
  try{ castraFxCss(); castraFxWater(); castraFxAmbient(); }catch(e){ console.error(e); }
  if(_castraFxAmbT) clearInterval(_castraFxAmbT);
  _castraFxAmbT = setInterval(()=>{ if(!el("cwMap")){ clearInterval(_castraFxAmbT); _castraFxAmbT = null; return; } const box = el("cwFx"); if(box) box.querySelectorAll(".cwFly,.cwFire").forEach(n=>n.remove()); try{ castraFxAmbient(); }catch(e){} }, CASTRA_FX.ambientMs);
  return r;
};

/* ---------- geluid (WebAudio, geen bestanden) ---------- */
const CASTRA_SND = { vol:0.22 };
function castraSndOn(){ try{ return localStorage.getItem("castra_sound")!=="0"; }catch(e){ return true; } }
function castraSndSet(on){ try{ localStorage.setItem("castra_sound", on ? "1" : "0"); }catch(e){} if(on) castraSfx("find"); }
let _castraAc = null;
function castraAc(){ if(!_castraAc){ const C = window.AudioContext || window.webkitAudioContext; if(!C) return null; try{ _castraAc = new C(); }catch(e){ return null; } } if(_castraAc.state==="suspended"){ try{ _castraAc.resume(); }catch(e){} } return _castraAc; }
function castraSndNoise(ac, t, dur, type, freq, gain, q){
  const n = Math.max(1, Math.floor(ac.sampleRate*dur)), buf = ac.createBuffer(1, n, ac.sampleRate), d = buf.getChannelData(0); for(let i=0;i<n;i++) d[i] = (Math.random()*2-1)*(1-i/n);
  const s = ac.createBufferSource(); s.buffer = buf; const f = ac.createBiquadFilter(); f.type = type; f.frequency.value = freq; if(q) f.Q.value = q; const g = ac.createGain(); g.gain.value = gain*CASTRA_SND.vol;
  s.connect(f); f.connect(g); g.connect(ac.destination); s.start(t);
}
function castraSndTone(ac, t, dur, f0, f1, gain, wave){
  const o = ac.createOscillator(), g = ac.createGain(); o.type = wave || "sine"; o.frequency.setValueAtTime(f0, t); if(f1) o.frequency.exponentialRampToValueAtTime(f1, t+dur);
  g.gain.setValueAtTime(gain*CASTRA_SND.vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t+dur); o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t+dur+0.02);
}
// Alle geluiden zijn korte, zachte synths. De namen: soft, grass, sand, stone, wood, jump, land, boulder, ripple, find, chest, buy, heal, alert.
const CASTRA_SFX = {
  soft:   (ac,t)=>castraSndNoise(ac, t, 0.05, "lowpass", 600, 0.35),
  grass:  (ac,t)=>castraSndNoise(ac, t, 0.09, "bandpass", 2600, 0.55, 1.2),
  sand:   (ac,t)=>castraSndNoise(ac, t, 0.08, "lowpass", 1100, 0.5),
  stone:  (ac,t)=>{ castraSndTone(ac, t, 0.05, 260, 180, 0.35, "triangle"); castraSndNoise(ac, t, 0.03, "highpass", 3000, 0.12); },
  wood:   (ac,t)=>castraSndTone(ac, t, 0.07, 330, 220, 0.4, "square"),
  jump:   (ac,t)=>{ castraSndTone(ac, t, 0.18, 280, 620, 0.35, "sine"); castraSndNoise(ac, t, 0.12, "bandpass", 1500, 0.15, 0.8); },
  land:   (ac,t)=>{ castraSndTone(ac, t, 0.14, 120, 60, 0.6, "sine"); castraSndNoise(ac, t, 0.1, "lowpass", 500, 0.5); },
  boulder:(ac,t)=>{ castraSndNoise(ac, t, 0.3, "lowpass", 260, 0.9); castraSndTone(ac, t, 0.25, 70, 45, 0.5, "sawtooth"); },
  ripple: (ac,t)=>castraSndTone(ac, t, 0.12, 700, 420, 0.18, "sine"),
  find:   (ac,t)=>{ castraSndTone(ac, t, 0.12, 784, 0, 0.35, "triangle"); castraSndTone(ac, t+0.1, 0.18, 1175, 0, 0.35, "triangle"); },
  chest:  (ac,t)=>{ castraSndTone(ac, t, 0.1, 523, 0, 0.3, "triangle"); castraSndTone(ac, t+0.09, 0.1, 659, 0, 0.3, "triangle"); castraSndTone(ac, t+0.18, 0.2, 784, 0, 0.3, "triangle"); },
  buy:    (ac,t)=>{ castraSndTone(ac, t, 0.07, 988, 0, 0.3, "square"); castraSndTone(ac, t+0.07, 0.15, 1319, 0, 0.3, "square"); },
  heal:   (ac,t)=>{ [523,659,784,1047].forEach((f,i)=>castraSndTone(ac, t+i*0.07, 0.14, f, 0, 0.25, "sine")); },
  alert:  (ac,t)=>{ castraSndTone(ac, t, 0.09, 880, 0, 0.45, "square"); castraSndTone(ac, t+0.13, 0.12, 1175, 0, 0.45, "square"); },
};
function castraSfx(name){
  try{ if(!castraSndOn()) return; const f = CASTRA_SFX[name]; if(!f) return; const ac = castraAc(); if(!ac) return; f(ac, ac.currentTime+0.005); }catch(e){}
}
// koppelingen: vondsten, kisten, kopen, genezen en de trainerwaarschuwing
if(typeof castraHidCheck==="function"){ const _0 = castraHidCheck; castraHidCheck = function(x, y){ const n0 = castraHidOpen(CASTRA_W_REGION).length; const r = _0.apply(this, arguments); if(castraHidOpen(CASTRA_W_REGION).length<n0) castraSfx("find"); return r; }; }
if(typeof castraWChest==="function"){ const _0 = castraWChest; castraWChest = function(e){ const open = castraWChestOpen(e.id); const r = _0.apply(this, arguments); if(!open) castraSfx("chest"); return r; }; }
if(typeof castraBagBuyClick==="function"){ const _0 = castraBagBuyClick; castraBagBuyClick = function(id){ const n = castraBagN(id); const r = _0.apply(this, arguments); if(castraBagN(id)>n) castraSfx("buy"); return r; }; }
if(typeof castraBagGive==="function"){ const _0 = castraBagGive; castraBagGive = function(id, key){ const n = castraBagN(id); const r = _0.apply(this, arguments); if(castraBagN(id)<n) castraSfx("heal"); return r; }; }
if(typeof castraTrainerApproach==="function"){ const _0 = castraTrainerApproach; castraTrainerApproach = function(){ castraSfx("alert"); return _0.apply(this, arguments); }; }
// menu ☰ → Sonus
(function(){
  const i = CASTRA_MENU_ITEMS.findIndex(x=>x.id==="sacculus");
  CASTRA_MENU_ITEMS.splice(i<0 ? CASTRA_MENU_ITEMS.length : i+1, 0, { id:"sonus", la:"Sonus", nl:"geluid aan of uit" });
})();
const _castraMenuViewFx0 = castraMenuView;
castraMenuView = function(id){
  if(id!=="sonus") return _castraMenuViewFx0(id);
  const on = castraSndOn(), btn = "min-height:44px;padding:4px 16px;font-size:16px;font-family:inherit;cursor:pointer;border:2px solid var(--parch-edge,#4a3416);border-radius:8px;background:#e8c96a;color:var(--parch-ink,#2b1d0e)";
  return `<h3 style="margin:0 0 6px">Sonus <small>geluid</small></h3>
    <div style="font-size:14px;margin-bottom:8px">Zachte geluidjes: stappen, een sprong, een rots die schuift, een vondst, een aankoop. Ze worden op het apparaat gemaakt en kosten geen data. Muziek is er (nog) niet.</div>
    <button style="${btn}" onclick="castraSndSet(${on?"false":"true"});castraMenuRender()">${on ? "🔊 Geluid staat aan: zet uit" : "🔇 Geluid staat uit: zet aan"}</button>
    <div style="margin-top:8px"><button style="${btn};background:rgba(0,0,0,.08)" onclick="castraSfx('jump')">Test: sprong</button> <button style="${btn};background:rgba(0,0,0,.08)" onclick="castraSfx('chest')">Test: kist</button></div>`;
};
Object.assign(CASTRA_GLOSS, { "sonus":"geluid" });
