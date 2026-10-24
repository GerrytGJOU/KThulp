/* ============================================================================
   CASTRA HEROUM — BERGPADEN: TERRASSEN, KLIFFEN, LEDGES EN SCHUIFBARE ROTSEN (naar de ledges van Pokémon)
   ----------------------------------------------------------------------------
   In een berggebied is de kaart geen vlak meer maar een pad langs terrassen:
     #  klifwand (solide; zelf getekend op het canvas, in afwachting van echte klif-tegels)
     .  terras (steen; hier liggen ontmoetingen van het bergterrein)           p  pad of helling (zand; geen ontmoetingen)
     v ^ > <  ledge: spring je er in die richting overheen, dan land je twee tegels verder (zoals MB_JUMP_SOUTH in pokeemerald).
              Van de andere kant is het gewoon een klif: je kunt er nooit tegenin omhoog.
     o  schuifbare rots op een terras (een hopliet of spartaan in je leger kan hem één tegel duwen; hij kan nooit op een pad of ledge)
     spatie = niet aanraken (de gewone kaart blijft)
   Ledges maken shortcuts naar beneden, een keuze tussen het lange pad en de sprong, en bovenop liggen dingen die je alleen via een
   omweg of een rots bereikt (optioneel: nooit op de weg naar iets wat je nodig hebt; de wereldtest bewaakt dat, met een gerichte
   graaf, zodat je nooit vast kunt komen te zitten). Rotsen staan weer op hun plek als je de kaart opnieuw betreedt.
   Klif en terrassen: de echte tegels uit Outside_A4 (zie castraDrawBergA4); zonder dat plaatje valt hij terug op de zelfgetekende klifwand.
   Teksten Latijn: "Saxum grave est." (de rots is te zwaar). Kaarten staan in CASTRA_BERG; Graecia is de proef.
   Laadt NA castra-enc.js (en voor castra-fx.js).
   ============================================================================ */
const CASTRA_BERG = {
  // Graecia: de berg in het noordwesten (x 2-25, y 2-17), drie terrassen die je via haarspeldbochten beklimt, met een ledge-shortcut naar beneden.
  graecia: { x:2, y:2, seed:4711, tall:0.5, style:"sand", rows:[
    "########################",   //  0
    "#.....#................#",   //  1   top (A): links een nis met een kist, afgesloten door een rots
    "#.....o................#",   //  2
    "#.....#................#",   //  3
    "##########vv#########pp#",   //  4   rand tussen A en B: ledge in het midden, helling aan de oostkant
    "#......................#",   //  5   midden (B)
    "#......................#",   //  6
    "#......................#",   //  7
    "#pp#######vv############",   //  8   rand tussen B en C: helling aan de westkant
    "#......................#",   //  9   laag (C)
    "#......................#",   // 10
    "#......................#",   // 11
    "##########vv#########pp#",   // 12   rand tussen C en de voet: helling aan de oostkant
    "#ppppppppppppppppppppppp",   // 13   voet (D): de ingang van de berg is de opening aan de oostkant
    "#ppppppppppppppppppppppp",   // 14
    "########################",   // 15   voet van de berg
  ] },
};
(function(){   // regels moeten even breed zijn
  Object.keys(CASTRA_BERG).forEach(rid=>{ const M = CASTRA_BERG[rid]; M.w = M.rows[0].length; M.h = M.rows.length;
    M.rows.forEach(r=>{ if(r.length!==M.w) throw new Error("CASTRA_BERG."+rid+": een rij is niet "+M.w+" breed: "+r); }); });
})();
const CASTRA_LEDGE_DIR = { v:"down", "^":"up", ">":"right", "<":"left" };

/* ---------- de kaart bouwen ---------- */
function castraBergApply(def, rid){
  const M = CASTRA_BERG[rid]; if(!M) return def;
  const inRect = (x,y)=>x>=M.x && x<M.x+M.w && y>=M.y && y<M.y+M.h;
  def.pieces = def.pieces.filter(p=>{ const O = CASTRA_OBJ[p.o], w = O?O.w:1, h = O?O.h:1;
    for(let dy=0;dy<h;dy++) for(let dx=0;dx<w;dx++) if(inRect(p.x+dx,p.y+dy)) return false; return true; });
  def.tall = def.tall || {};
  Object.keys(def.tall).forEach(k=>{ const [x,y] = k.split(",").map(Number); if(inRect(x,y)) delete def.tall[k]; });
  const rng = castraMapRng(M.seed), cliffs = [], ledges = {}, boulders = [], paths = {};
  M.rows.forEach((row, ry)=>{ for(let rx=0; rx<M.w; rx++){
    const c = row[rx], x = M.x+rx, y = M.y+ry, k = x+","+y; if(c===" ") continue;
    if(c==="#"){ def.ground[y][x] = "stoneb"; def.walls.push([x,y]); cliffs.push({ x, y, k:"wall" }); }
    else if(CASTRA_LEDGE_DIR[c]){ def.ground[y][x] = "stoneb"; def.walls.push([x,y]); ledges[k] = CASTRA_LEDGE_DIR[c]; cliffs.push({ x, y, k:"ledge", dir:CASTRA_LEDGE_DIR[c] }); }
    else if(c==="p"){ def.ground[y][x] = "sand2"; paths[k] = 1; }
    else { // terras (en de plek van een rots)
      def.ground[y][x] = "stone";
      if(c==="o") boulders.push([x,y]);
      if(rng() < M.tall && c!=="o"){ def.tall[k] = M.terrain || "mons"; def.pieces.push({ o:"dry_grass", x, y }); }
    } } });
  const plateau = {}, ramp = {};
  M.rows.forEach((row, ry)=>{ for(let rx=0; rx<M.w; rx++){ const c = row[rx], k = (M.x+rx)+","+(M.y+ry);
    if(c==="." || c==="o") plateau[k] = 1;
    else if(c==="p"){ const up = (M.rows[ry-1]||"")[rx], dn = (M.rows[ry+1]||"")[rx]; if(".o".indexOf(up||" ")>=0 || ".o".indexOf(dn||" ")>=0) ramp[k] = 1; } } });
  def.cliffs = cliffs; def.ledges = ledges; def.boulders = boulders; def.bergPaths = paths; def.bergPlateau = plateau; def.bergRamp = ramp; def.bergStyle = M.style || "sand"; def.bergRect = { x:M.x, y:M.y, w:M.w, h:M.h };
  return def;
}
const _castraWorldDefBerg0 = castraWorldDef;
castraWorldDef = function(){ const d = _castraWorldDefBerg0.apply(this, arguments), W = castraWorldCfg(); return (W.interior || !CASTRA_BERG[W.id]) ? d : castraBergApply(d, W.id); };
// De ontmoetingen op een terras horen bij het bergterrein van het land (nu: "mons").
Object.keys(CASTRA_BERG).forEach(rid=>{ const M = CASTRA_BERG[rid]; const reg = CASTRA_VENATIO[rid]; if(reg && !M.terrain){ const t = reg.terrains.find(x=>x.id==="mons"); M.terrain = t ? t.id : reg.terrains[0].id; } });

/* ---------- de klifwand tekenen (geen klif-tegels in onze tilesets: zelf op het canvas) ---------- */
function castraDrawCliffCell(ctx, c, up, down, T){
  const x0 = c.x*T, y0 = c.y*T, r = castraMapRng(c.x*7919+c.y*104729);
  const ledge = c.k==="ledge";
  const g = ctx.createLinearGradient(0, y0, 0, y0+T);
  if(ledge){ g.addColorStop(0, "#b3a07c"); g.addColorStop(1, "#8a7857"); } else { g.addColorStop(0, "#8d7d64"); g.addColorStop(0.6, "#6f6350"); g.addColorStop(1, "#51473a"); }
  ctx.fillStyle = g; ctx.fillRect(x0, y0, T, T);
  // lagen in de rots
  ctx.strokeStyle = "rgba(40,30,20,.35)"; ctx.lineWidth = 2;
  for(let i=0;i<2;i++){ const y = y0+10+Math.floor(r()*(T-20)); ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x0+T, y+(r()<.5?-2:2)); ctx.stroke(); }
  ctx.strokeStyle = "rgba(255,240,210,.18)";
  for(let i=0;i<2;i++){ const x = x0+6+Math.floor(r()*(T-12)), y = y0+4+Math.floor(r()*(T-22)); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x+(r()<.5?-3:3), y+12+Math.floor(r()*8)); ctx.stroke(); }
  // lichte rand aan de bovenkant (grasrand van het terras erboven) en schaduw onderaan
  if(!up){ ctx.fillStyle = "#c9b98f"; ctx.fillRect(x0, y0, T, 6); ctx.fillStyle = "rgba(255,255,255,.18)"; ctx.fillRect(x0, y0+6, T, 2); }
  if(!down){ const s = ctx.createLinearGradient(0, y0+T-12, 0, y0+T); s.addColorStop(0, "rgba(0,0,0,0)"); s.addColorStop(1, "rgba(0,0,0,.45)"); ctx.fillStyle = s; ctx.fillRect(x0, y0+T-12, T, 12); }
  if(ledge){        // een ledge: lagere rand met kleine steentjes en pijltjes in de springrichting
    ctx.fillStyle = "rgba(60,45,25,.55)";
    const dir = c.dir, cx = x0+T/2, cy = y0+T/2, a = dir==="down" ? [0,1] : dir==="up" ? [0,-1] : dir==="right" ? [1,0] : [-1,0];
    for(let i=-1;i<=1;i+=2){ const px = cx + (a[0] ? 0 : i*11) - a[0]*4, py = cy + (a[1] ? 0 : i*11) - a[1]*4;
      ctx.beginPath(); ctx.moveTo(px+a[0]*7, py+a[1]*7); ctx.lineTo(px-a[1]*6-a[0]*3, py+a[0]*6-a[1]*3); ctx.lineTo(px+a[1]*6-a[0]*3, py-a[0]*6-a[1]*3); ctx.closePath(); ctx.fill(); }
    ctx.fillStyle = "rgba(255,245,220,.5)"; for(let i=0;i<3;i++) ctx.fillRect(x0+4+Math.floor(r()*(T-10)), y0+T-14+Math.floor(r()*8), 3, 2);
  }
}
/* ---- met de echte tegels (Outside_A4): plateau met rotsrand en klifwand ----
   Een plateau-autotile van RPG Maker is een blok van 96 × 144 px (4 × 6 kwartjes van 24 px). Voor een rechthoekig terras kiest elk
   hoekje van een tegel zijn kwartje uit de buren: links en rechts, boven en onder (zie castraPlateauQuarters). De klif zelf is de
   onderste twee rijen van het blok; een band van één tegel krijgt de bovenste helft van de bovenste en de onderste helft van de onderste rij. */
const CASTRA_A4 = { top:{ grass:0, sand:2, sand2:4, snow:6 }, rowTop:10, rowFace:13 };
function castraPlateauQuarters(L, R, U, D, dTL, dTR, dBL, dBR){   // L,R,U,D = er is GEEN plateau links, rechts, boven, onder; d.. = de diagonale buur ontbreekt (binnenhoek)
  const lx = L ? 0 : (R ? 2 : 1), rx = R ? 3 : (L ? 1 : 2), ty = U ? 2 : (D ? 4 : 3), by = D ? 5 : (U ? 3 : 4);
  const q = [[lx,ty],[rx,ty],[lx,by],[rx,by]];
  if(!L && !U && dTL) q[0] = [2,0];      // binnenhoeken staan in de bovenste rij van het blok (tweede tegel)
  if(!R && !U && dTR) q[1] = [3,0];
  if(!L && !D && dBL) q[2] = [2,1];
  if(!R && !D && dBR) q[3] = [3,1];
  return q;
}
function castraDrawBergA4(g, built, A4, T){
  const def = built.def, st = def.bergStyle, colTop = CASTRA_A4.top[st] != null ? CASTRA_A4.top[st] : 2, bx = colTop*T, by = CASTRA_A4.rowTop*T;
  const pl = k=>!!(def.bergPlateau[k] || def.bergRamp[k]), cl = {}; def.cliffs.forEach(c=>{ cl[c.x+","+c.y] = c; });
  // 1. terrassen: een cel krijgt een rand waar zijn buur LAGER ligt of geen plateau is (een buur op gelijk of hoger niveau telt als plateau);
  //    ramp-tegels (hellingen in de ASCII-bergen) blijven gewoon zandpad
  const lvl = k=>(def.bergLevel && def.bergLevel[k]!=null) ? def.bergLevel[k] : ((def.bergPlateau[k] || def.bergRamp[k]) ? 1 : 0);
  Object.keys(def.bergPlateau).forEach(k=>{ const [x,y] = k.split(",").map(Number), c = lvl(k);
    const mem = (nx,ny,north)=>{ const nk = nx+","+ny; return (lvl(nk)>=c && lvl(nk)>0) || (north && def.bergFace && !!def.bergFace[nk]); };   // onder een klifwand sluit het plateau zonder rand aan
    const q = castraPlateauQuarters(!mem(x-1,y), !mem(x+1,y), !mem(x,y-1,true), !mem(x,y+1), !mem(x-1,y-1,true), !mem(x+1,y-1,true), !mem(x-1,y+1), !mem(x+1,y+1));
    [[0,0],[24,0],[0,24],[24,24]].forEach(([ox,oy],i)=>g.drawImage(A4, bx+q[i][0]*24, by+q[i][1]*24, 24, 24, x*T+ox, y*T+oy, 24, 24)); });
  // 2. klifwand en ledges: de rotsklif (twee rijen onder het plateau-blok); steeds het middenstuk van het blok, zodat de wand naadloos doorloopt
  const fy13 = CASTRA_A4.rowFace*T, fy14 = (CASTRA_A4.rowFace+1)*T;
  def.cliffs.forEach(c=>{ const fx = colTop*T + 24, hasUp = !!cl[c.x+","+(c.y-1)], hasDown = !!cl[c.x+","+(c.y+1)];
    if(hasDown){ g.drawImage(A4, fx, fy13, T, T, c.x*T, c.y*T, T, T); }                               // midden van een dikke wand
    else if(hasUp){ g.drawImage(A4, fx, fy14, T, T, c.x*T, c.y*T, T, T); }                            // onderste rij van een dikke wand
    else { g.drawImage(A4, fx, fy13, T, 24, c.x*T, c.y*T, T, 24); g.drawImage(A4, fx, fy14+24, T, 24, c.x*T, c.y*T+24, T, 24); }   // band van één tegel
    if(c.k==="ledge") castraDrawLedgeMark(g, c, T);
    if(c.k==="stairs") castraDrawStairs(g, c, T); });
  // 3. de objecten op de terrassen (hoog gras, vondsten) staan weer bovenop
  const R = def.bergRect, inR = t=>t.x>=R.x && t.x<R.x+R.w && t.y>=R.y && t.y<R.y+R.h;
  (built.below||[]).filter(inR).forEach(t=>{ const im = CASTRA_TS_IMG[t.s]; if(im) g.drawImage(im, t.sx!=null?t.sx:t.c*T, t.sy!=null?t.sy:t.r*T, T, T, t.x*T, t.y*T, T, T); });
}
// Een trap door de klifwand (RPG Maker heeft er in onze tilesets geen): vier treden met een lichte rand bovenaan en schaduw eronder, tussen twee zijmuurtjes.
function castraDrawStairs(ctx, c, T){
  const x0 = c.x*T, y0 = c.y*T;
  ctx.fillStyle = "rgba(40,28,14,.55)"; ctx.fillRect(x0+3, y0, 4, T); ctx.fillRect(x0+T-7, y0, 4, T);
  for(let i=0;i<4;i++){ const y = y0 + i*12, g = ctx.createLinearGradient(0, y, 0, y+12); g.addColorStop(0, "#e6d6ac"); g.addColorStop(0.35, "#c8b27e"); g.addColorStop(1, "#8a7550");
    ctx.fillStyle = g; ctx.fillRect(x0+7, y, T-14, 12); ctx.fillStyle = "rgba(255,250,230,.55)"; ctx.fillRect(x0+7, y, T-14, 2); ctx.fillStyle = "rgba(30,20,8,.45)"; ctx.fillRect(x0+7, y+10, T-14, 2); }
}
// De pijltjes van een ledge staan als lichte markering over de rotswand (ook zonder de echte tegels).
function castraDrawLedgeMark(ctx, c, T){
  const x0 = c.x*T, y0 = c.y*T, dir = c.dir, cx = x0+T/2, cy = y0+T/2, a = dir==="down" ? [0,1] : dir==="up" ? [0,-1] : dir==="right" ? [1,0] : [-1,0];
  ctx.fillStyle = "rgba(255,248,225,.62)"; ctx.strokeStyle = "rgba(60,40,20,.55)"; ctx.lineWidth = 1.5;
  for(let i=-1;i<=1;i+=2){ const px = cx + (a[0] ? 0 : i*11) - a[0]*4, py = cy + (a[1] ? 0 : i*11) - a[1]*4;
    ctx.beginPath(); ctx.moveTo(px+a[0]*7, py+a[1]*7); ctx.lineTo(px-a[1]*6-a[0]*3, py+a[0]*6-a[1]*3); ctx.lineTo(px+a[1]*6-a[0]*3, py-a[0]*6-a[1]*3); ctx.closePath(); ctx.fill(); ctx.stroke(); }
}
const _castraDrawMapLayersBerg0 = castraDrawMapLayers;
castraDrawMapLayers = function(built, cvBelow, cvAbove){
  _castraDrawMapLayersBerg0.apply(this, arguments);
  const def = built && built.def; if(!def) return;
  const T = 48, g = cvBelow.getContext("2d"), A4 = (typeof CASTRA_TS_IMG!=="undefined") && CASTRA_TS_IMG.A4;
  if(def.cliffs && def.cliffs.length){
    if(A4 && def.bergPlateau) castraDrawBergA4(g, built, A4, T);
    else {                                                   // zonder het plaatje: de zelfgetekende klifwand
      const has = {}; def.cliffs.forEach(c=>{ has[c.x+","+c.y] = 1; });
      def.cliffs.forEach(c=>castraDrawCliffCell(g, c, !!has[c.x+","+(c.y-1)], !!has[c.x+","+(c.y+1)], T));
    }
  }
  // zachte schaduw onder bomen en palmen (geeft diepte; hoort niet bij de bergen maar tekent op dezelfde laag)
  (def.pieces||[]).forEach(p=>{ const O = CASTRA_OBJ[p.o]; if(!O || O.solid!=="bottom" || p.noSolid) return;
    g.fillStyle = "rgba(20,25,10,.16)"; g.beginPath(); g.ellipse(p.x*T+T/2, (p.y+O.h)*T-7, O.w*T*0.38, 8, 0, 0, Math.PI*2); g.fill(); });
};

/* ---------- schuifbare rotsen ---------- */
function castraBoulders(){ const U = CASTRA_W_UI; if(!U.bou){ const B = castraWorldBuilt(); U.bou = (B.def && B.def.boulders || []).map(b=>b[0]+","+b[1]); U.bouRid = CASTRA_W_REGION; } return U.bou; }
function castraBoulderAt(x, y){ if(typeof CASTRA==="undefined" || !CASTRA || typeof CASTRA_W_REGION==="undefined") return false; const B = castraWorldBuilt(); if(!(B.def && B.def.boulders && B.def.boulders.length)) return false; if(CASTRA_W_UI.bouRid!==CASTRA_W_REGION) CASTRA_W_UI.bou = null; return castraBoulders().indexOf(x+","+y)>=0; }
const _castraWBlockedBerg0 = castraWBlocked;
castraWBlocked = function(x, y){ return _castraWBlockedBerg0.apply(this, arguments) || castraBoulderAt(x, y); };
function castraBoulderDraw(){
  const map = el("cwMap"); if(!map) return;
  let box = el("cwBou"); if(!box){ box = document.createElement("div"); box.id = "cwBou"; map.insertBefore(box, el("cwAbove")); }
  box.innerHTML = castraBoulders().map(k=>{ const [x,y] = k.split(",").map(Number);
    return `<div style="position:absolute;left:${x*48}px;top:${y*48}px;width:48px;height:48px;pointer-events:none;z-index:3;display:flex;align-items:center;justify-content:center;font-size:38px;transition:left .18s linear,top .18s linear;filter:drop-shadow(0 4px 2px rgba(0,0,0,.45))" title="Saxum">🪨</div>`; }).join("");
}
function castraBoulderCanMove(x, y){
  const W = castraWorldCfg(), B = castraWorldBuilt(), k = x+","+y;
  if(x<1 || y<1 || x>=W.cols-1 || y>=W.rows-1) return false;
  if(castraWBlocked(x, y)) return false;
  if(B.def && B.def.bergPaths && B.def.bergPaths[k]) return false;                      // nooit op een pad of helling: die blijven vrij
  if(B.def && B.def.ledges && B.def.ledges[k]) return false;
  return true;
}
function castraBoulderPush(dir, bx, by){
  const d = CASTRA_DELTA[dir], tx = bx+d[0], ty = by+d[1];
  if(typeof castraFieldPick==="function" && !castraFieldPick("saxum")){ toast("🪨 "+castraLaHTML("Saxum grave est.", "De rots is te zwaar.", "berg_saxum"), "Een hopliet of spartaan in je leger kan hem duwen."); return false; }
  if(!castraBoulderCanMove(tx, ty)){ toast("🪨", "De rots zit vast."); return false; }
  const bou = castraBoulders(), i = bou.indexOf(bx+","+by); bou[i] = tx+","+ty; castraBoulderDraw();
  if(typeof castraFxDust==="function") castraFxDust(tx, ty, dir);
  if(typeof castraSfx==="function") castraSfx("boulder");
  return true;
}

/* ---------- ledges: springen ---------- */
function castraLedgeAt(x, y){ const B = castraWorldBuilt(); return (B.def && B.def.ledges && B.def.ledges[x+","+y]) || null; }
function castraLedgeLanding(x, y, dir){ const d = CASTRA_DELTA[dir]; return { x:x+2*d[0], y:y+2*d[1] }; }   // (x,y) = de tegel waar je vandaan springt
function castraLedgeJump(dir, ledgeX, ledgeY){
  const U = CASTRA_W_UI, W = castraWorldCfg(), d = CASTRA_DELTA[dir], lx = ledgeX+d[0], ly = ledgeY+d[1];
  if(lx<0 || ly<0 || lx>=W.cols || ly>=W.rows || castraWBlocked(lx, ly)) return false;
  U.moving = true; U.dir = dir; U.px = lx; U.py = ly;
  const ms = (U.speedMs || 170)*2, av = el("cwAv");
  castraBergCss(); if(av){ av.style.transition = "left "+ms+"ms linear,top "+ms+"ms linear"; av.classList.add("cwHop"); av.style.setProperty("--hop", ms+"ms"); }
  castraWorldAvatar();
  if(typeof castraSfx==="function") castraSfx("jump");
  setTimeout(()=>{
    U.moving = false; U.frame = 1; const a2 = el("cwAv"); if(a2){ a2.style.transition = ""; a2.classList.remove("cwHop"); }
    if(!el("cwMap")) return;
    castraWorldAvatar(); U.fxSkip = 1; castraWorldSavePos(lx, ly); U.fxSkip = 0;      // de landing heeft een eigen stof en geluid
    if(typeof castraFxDust==="function") castraFxDust(lx, ly, dir);
    if(typeof castraSfx==="function") castraSfx("land");
    const terr = castraWorldBuilt().tall[lx+","+ly]; if(terr && typeof castraEncStep==="function") castraEncStep(terr);
  }, ms+20);
  return true;
}
function castraBergCss(){
  if(document.getElementById("castraBergCss")) return;
  const st = document.createElement("style"); st.id = "castraBergCss";
  st.textContent = ".cwHop{animation:cwHopK var(--hop,340ms) ease-out}@keyframes cwHopK{0%{transform:translateY(0)}45%{transform:translateY(-26px)}100%{transform:translateY(0)}}";
  document.head.appendChild(st);
}
const _castraWStepBerg0 = castraWStep;
castraWStep = function(dir){
  const U = CASTRA_W_UI;
  if(!U.moving && el("cwMap") && CASTRA_DELTA[dir]){
    const d = CASTRA_DELTA[dir], nx = U.px+d[0], ny = U.py+d[1], L = castraLedgeAt(nx, ny);
    if(L && L===dir){ const r = castraLedgeJump(dir, nx, ny); if(r) return true; }                    // de juiste kant: springen
    else if(!L && castraBoulderAt(nx, ny)){ if(!castraBoulderPush(dir, nx, ny)) { U.dir = dir; castraWorldAvatar(); return false; } }   // duwen; daarna loopt de gewone stap erachteraan
  }
  return _castraWStepBerg0.apply(this, arguments);
};
const _castraWorldRenderBerg0 = castraWorldRender;
castraWorldRender = function(){ CASTRA_W_UI.bou = null; const r = _castraWorldRenderBerg0.apply(this, arguments); try{ castraBoulderDraw(); }catch(e){ console.error(e); } return r; };
// Een rots mag niet op een verborgen vondst of een kist beginnen: dat regelt het kaartontwerp; de vondsten mijden rotsen:
if(typeof castraHidReach==="function"){
  const _castraHidReachBerg0 = castraHidReach;
  castraHidReach = function(rid){
    const had = !!CASTRA_HID_REACH[rid], r = _castraHidReachBerg0.apply(this, arguments);
    if(!had){ const keep = CASTRA_W_REGION; CASTRA_W_REGION = rid; try{ const B = castraWorldBuilt(); (B.def && B.def.boulders || []).forEach(b=>r.blocked.add(b[0]+","+b[1])); } finally { CASTRA_W_REGION = keep; } }
    return r;
  };
}
Object.assign(CASTRA_GLOSS, { "saxum":"rots", "grave":"zwaar" });

// Inhoud van de berg: een kist in de nis (achter de rots; optioneel) en een kist op het hoogste terras.
(function(){
  const M = CASTRA_BERG.graecia; if(!M || !CASTRA_WORLDS.graecia) return;
  const old = CASTRA_WENT.find(e=>e.id==="kist_graecia0"); if(old){ old.x = M.x+2; old.y = M.y+13; }     // de oude plek ligt nu in de nis achter de rots: deze kist staat aan de voet van de berg
  CASTRA_WENT.push({ id:"kist_graecia_berg0", region:"graecia", kind:"chest", x:M.x+1, y:M.y+1, optional:true },
                   { id:"kist_graecia_berg1", region:"graecia", kind:"chest", x:M.x+21, y:M.y+1 });
})();
