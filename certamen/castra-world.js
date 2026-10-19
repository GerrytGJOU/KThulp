/* ============================================================================
   CASTRA HEROUM — DE WERELD VAN LATIUM (jagen zoals in Pokémon)
   ----------------------------------------------------------------------------
   Poort: porta decumana. Je loopt met je avatar door Latium; in hoog gras
   (donkergroen) kan elke stap een ontmoeting starten — dan volgt het bestaande
   Latijnse verkenningsbericht + gevecht uit castra-venatio.js. Het terrein van
   de ontmoeting hangt af van de zone waarin het gras ligt (silva, campus, via,
   Tiber-oever): zo komen sommige soldaten alleen in bepaald terrein voor.
   Kaart: vast gegenereerd (seed), tegels uit castra-map.js. Ontwerp: CASTRA_HEROUM.md.
   Laadt NA castra-map.js, castra.js en castra-venatio.js.
   ============================================================================ */

const CASTRA_WORLD = {
  cols:32, rows:24, seed:20261020, view:{ cols:16, rows:11 },
  start:{ x:15, y:22 },
  exit:[ {x:15,y:23}, {x:16,y:23} ],
  encounterChance:0.14,
  // Zones: het terrein (CASTRA_VENATIO.latium.terrains[].id) van het hoge gras erin.
  zones:[
    { t:"silva",   x:2,  y:3,  w:11, h:10 },
    { t:"via",     x:14, y:1,  w:4,  h:9  },
    { t:"campus",  x:18, y:11, w:12, h:9  },
    { t:"tiberis", x:24, y:2,  w:6,  h:8  },
  ],
};
let CASTRA_WORLD_BUILT = null;
let CASTRA_W_UI = { px:0, py:0, dir:"up", frame:1, moving:false, scale:1, keyFn:null, resizeFn:null };

function castraWorldDef(){
  const W = CASTRA_WORLD, cols = W.cols, rows = W.rows, rng = castraMapRng(W.seed);
  const g = castraGroundGrid(cols, rows, "grass"), tall = {}, used = {}, pieces = [], walls = [];
  const road = (x,y)=> ((x===15||x===16) && y>=1) || ((y===12||y===13) && x>=2 && x<=29);
  for(let y=0;y<rows;y++) for(let x=0;x<cols;x++) if(road(x,y)) g[y][x]="sand";
  const zoneAt = (x,y)=>W.zones.find(z=>x>=z.x&&x<z.x+z.w&&y>=z.y&&y<z.y+z.h);
  const exitCell = (x,y)=>W.exit.some(e=>e.x===x&&e.y===y);
  // rand: bomen langs de rand (solide muur van bomen), met de uitgang open
  const ring = (x,y)=>x===0||y===0||x===cols-1||y===rows-1;
  for(let y=0;y<rows;y++) for(let x=0;x<cols;x++){
    if(!ring(x,y) || exitCell(x,y)) continue;
    walls.push([x,y]); used[x+","+y]=1;
    if(y-1>=0 || true) pieces.push({ o:((x+y)%2?"tree_a":"tree_b"), x, y:y-1, noSolid:true });
  }
  // hoog gras per zone (niet op wegen), met vaste willekeur
  W.zones.forEach(z=>{
    for(let y=z.y;y<z.y+z.h;y++) for(let x=z.x;x<z.x+z.w;x++){
      if(road(x,y) || used[x+","+y]) continue;
      if(rng() < 0.55){ g[y][x]="grass2"; tall[x+","+y]=z.t; }
    }
  });
  // hoog gras zichtbaar maken: een bladpol op elke ontmoetingstegel
  Object.keys(tall).forEach((k,i)=>{ const [x,y]=k.split(",").map(Number); pieces.push({ o:(i%3===0?"fern":"plant_c"), x, y }); });
  // verspreide bomen en decor; vrij van wegen, hoog gras en de startplek
  const free = (x,y)=>!used[x+","+y] && !road(x,y) && !tall[x+","+y] && !(Math.abs(x-W.start.x)<4 && Math.abs(y-W.start.y)<4);
  for(let y=2;y<rows-3;y++) for(let x=1;x<cols-1;x++){
    if(!free(x,y)) continue;
    const z = zoneAt(x,y), p = z && z.t==="silva" ? 0.22 : 0.07, r = rng();
    if(r < p && free(x,y+1)){
      const big = rng()<0.25 && free(x+1,y) && free(x+1,y+1);
      if(big){ pieces.push({ o:"tree_big", x, y }); [[x,y],[x+1,y],[x,y+1],[x+1,y+1]].forEach(c=>used[c[0]+","+c[1]]=1); }
      else { pieces.push({ o:rng()<0.5?"tree_a":"tree_b", x, y }); used[x+","+y]=1; used[x+","+(y+1)]=1; }
    } else if(r < p+0.06){
      pieces.push({ o:["flower_w","flower_p","flower_b","flower_o","plant_a","plant_b","fern"][Math.floor(rng()*7)], x, y }); used[x+","+y]=1;
    }
  }
  // bord naar het kamp bij de uitgang
  pieces.push({ o:"sign", x:14, y:rows-3 }); used["14,"+(rows-3)]=1;
  return { cols, rows, ground:g, pieces, walls, tall };
}
function castraWorldBuilt(){
  if(!CASTRA_WORLD_BUILT){
    const def = castraWorldDef();
    // ring-bomen: alleen tekenen, de muur zelf staat in def.walls
    const logic = castraMapLogic({ ...def, pieces: def.pieces.map(p=>p.noSolid ? { ...p, o:p.o } : p) });
    def.pieces.filter(p=>p.noSolid).forEach(p=>{
      const O = CASTRA_OBJ[p.o]; const bx = p.x, by = p.y+O.h-1;
      if(by>=0 && !def.walls.some(w=>w[0]===bx&&w[1]===by)) delete logic.blocked[bx+","+by];
    });
    logic.tall = def.tall; CASTRA_WORLD_BUILT = logic;
  }
  return CASTRA_WORLD_BUILT;
}

SCREENS.castraWorld = function(){
  document.body.classList.remove("greek");
  if(!CASTRA) castraLoad();
  const W = CASTRA_WORLD, st = CASTRA.world || W.start;
  CASTRA_W_UI.px = st.x; CASTRA_W_UI.py = st.y; CASTRA_W_UI.dir = "up"; CASTRA_W_UI.frame = 1; CASTRA_W_UI.moving = false;
  H(brand(true)+`
  <div class="scrhead"><button class="back" onclick="castraWorldLeave()">${iconSVG("shield",20,"currentColor")}</button><h2>🌿 Latium</h2></div>
  <div id="cwWrap" style="position:relative;width:100%;margin:0 auto;overflow:hidden;border:2px solid var(--hi,#d4af37);border-radius:10px;background:#2c3a1f">
    <div id="cwMap" style="position:absolute;top:0;left:0;width:${W.cols*48}px;height:${W.rows*48}px;transform-origin:top left;transition:transform .16s linear"></div>
  </div>
  <div id="castraPad" style="display:grid;grid-template-columns:repeat(3,64px);grid-template-rows:repeat(2,52px);gap:6px;justify-content:center;margin:10px 0">
    <span></span><button class="btn" onclick="castraWStep('up')">▲</button><span></span>
    <button class="btn" onclick="castraWStep('left')">◀</button><button class="btn" onclick="castraWStep('down')">▼</button><button class="btn" onclick="castraWStep('right')">▶</button>
  </div>
  <div class="note" style="text-align:center">Sleep met je duim over de kaart om te lopen, of tik ergens om daarheen te gaan. Loop door het <b>hoge, donkere gras</b>: daar kun je vijanden ontmoeten. ${castraLaHTML("Venare in herba alta!","Jaag in het hoge gras!","herba_alta")}</div>
  ${foot()}`);
  castraWorldRender();
  castraWorldFit();
  castraStickAttach(el("cwWrap"), { step:castraWStep, tap:castraWorldTap });
  castraStickHidePad();
  castraProbeBase(bmAvatarMerge((typeof BM_IDENT!=="undefined"&&BM_IDENT&&BM_IDENT.avatar)||bmAvatarDefaults()).huid).then(()=>castraWorldAvatar());
  CASTRA_W_UI.keyFn = e=>{
    if(!el("cwMap")){ document.removeEventListener("keydown",CASTRA_W_UI.keyFn); window.removeEventListener("resize",CASTRA_W_UI.resizeFn); return; }
    const d = {ArrowUp:"up",w:"up",ArrowDown:"down",s:"down",ArrowLeft:"left",a:"left",ArrowRight:"right",d:"right"}[e.key];
    if(d){ e.preventDefault(); castraWStep(d); }
  };
  CASTRA_W_UI.resizeFn = castraWorldFit;
  document.addEventListener("keydown", CASTRA_W_UI.keyFn);
  window.addEventListener("resize", CASTRA_W_UI.resizeFn);
};
function castraWorldDetach(){
  if(CASTRA_W_UI.keyFn) document.removeEventListener("keydown", CASTRA_W_UI.keyFn);
  if(CASTRA_W_UI.resizeFn) window.removeEventListener("resize", CASTRA_W_UI.resizeFn);
}
function castraWorldLeave(){
  CASTRA.world = { x:CASTRA_W_UI.px, y:CASTRA_W_UI.py }; castraSave(); castraWorldDetach();
  CASTRA.pos = { x:7, y:1 }; castraSave(); go("castraHome");
}
function castraWorldRender(){
  const map = el("cwMap"); if(!map) return; const W = CASTRA_WORLD;
  map.innerHTML = `<canvas id="cwBelow" style="position:absolute;left:0;top:0;image-rendering:pixelated"></canvas>
    <div id="cwAv" style="position:absolute;width:48px;height:48px;transition:left .16s linear,top .16s linear;pointer-events:none;z-index:5"></div>
    <canvas id="cwAbove" style="position:absolute;left:0;top:0;pointer-events:none;image-rendering:pixelated;z-index:6"></canvas>`;
  castraWorldAvatar();
  castraTsLoad().then(()=>{ const b=el("cwBelow"), a=el("cwAbove"); if(b&&a) castraDrawMapLayers(castraWorldBuilt(), b, a); });
}
function castraWorldAvatar(){
  const av = el("cwAv"); if(!av) return;
  av.style.left = CASTRA_W_UI.px*48+"px"; av.style.top = CASTRA_W_UI.py*48+"px";
  const avatar = (typeof BM_IDENT!=="undefined" && BM_IDENT && BM_IDENT.avatar) ? BM_IDENT.avatar : bmAvatarDefaults();
  av.innerHTML = castraAvatarHTML(avatar, CASTRA_W_UI.dir, CASTRA_W_UI.frame, 48);
  castraWorldCamera();
}
// Camera: avatar in het midden, vastgeklemd aan de kaartranden.
function castraWorldCamera(){
  const W = CASTRA_WORLD, V = W.view, s = CASTRA_W_UI.scale, m = el("cwMap"); if(!m) return;
  const camX = Math.max(0, Math.min(W.cols*48 - V.cols*48, CASTRA_W_UI.px*48 + 24 - V.cols*24));
  const camY = Math.max(0, Math.min(W.rows*48 - V.rows*48, CASTRA_W_UI.py*48 + 24 - V.rows*24));
  m.style.transform = `translate(${-camX*s}px,${-camY*s}px) scale(${s})`;
  CASTRA_W_UI.camX = camX; CASTRA_W_UI.camY = camY;
}
function castraWorldFit(){
  const w = el("cwWrap"); if(!w) return; const V = CASTRA_WORLD.view;
  CASTRA_W_UI.scale = Math.min(1.25, w.clientWidth/(V.cols*48));
  w.style.height = (V.rows*48*CASTRA_W_UI.scale)+"px";
  castraWorldCamera();
}

function castraWStep(dir){
  if(CASTRA_W_UI.moving) return null;          // bezig met een stap (niet: geblokkeerd)
  if(!el("cwMap")) return false;
  const d = CASTRA_DELTA[dir]; if(!d) return false;
  CASTRA_W_UI.dir = dir;
  const nx = CASTRA_W_UI.px+d[0], ny = CASTRA_W_UI.py+d[1], W = CASTRA_WORLD;
  if(nx<0||ny<0||nx>=W.cols||ny>=W.rows || castraWorldBuilt().blocked[nx+","+ny]){ castraWorldAvatar(); return false; }
  CASTRA_W_UI.moving = true; CASTRA_W_UI.px = nx; CASTRA_W_UI.py = ny;
  CASTRA_W_UI.frame = CASTRA_W_UI.frame===1 ? (Math.random()<.5?0:2) : 1;
  castraWorldAvatar();
  setTimeout(()=>{
    CASTRA_W_UI.moving = false; CASTRA_W_UI.frame = 1; castraWorldAvatar();
    CASTRA.world = { x:nx, y:ny }; castraSave();
    if(W.exit.some(e=>e.x===nx&&e.y===ny)){ castraWorldLeave(); return; }
    const terrain = castraWorldBuilt().tall[nx+","+ny];
    if(terrain && Math.random() < W.encounterChance) castraWorldEncounter(terrain);
  }, 170);
  return true;
}
function castraWorldEncounter(terrainId){
  CASTRA.world = { x:CASTRA_W_UI.px, y:CASTRA_W_UI.py }; castraSave(); castraWorldDetach();
  CASTRA_V = castraMakeEncounter("latium", terrainId);
  CASTRA_V.log = []; CASTRA_V.round = 0; CASTRA_V.fromWorld = true;
  CASTRA_V_PENDING = true;
  go("castraVenatio");
}
function castraWorldTap(e){
  const map = el("cwMap"); if(!map) return;
  const r = map.getBoundingClientRect(), s = CASTRA_W_UI.scale||1;
  const tx = Math.floor((e.clientX-r.left)/s/48), ty = Math.floor((e.clientY-r.top)/s/48);
  const path = castraWorldPath(CASTRA_W_UI.px, CASTRA_W_UI.py, tx, ty);
  if(path && path.length) castraWorldWalk(path);
}
function castraWorldPath(sx,sy,tx,ty){
  const W = CASTRA_WORLD, blocked = castraWorldBuilt().blocked;
  if(tx<0||ty<0||tx>=W.cols||ty>=W.rows||blocked[tx+","+ty]) return null;
  const prev = {}, q=[[sx,sy]]; prev[sx+","+sy] = null;
  while(q.length){
    const [x,y] = q.shift(); if(x===tx && y===ty) break;
    for(const dir in CASTRA_DELTA){
      const nx=x+CASTRA_DELTA[dir][0], ny=y+CASTRA_DELTA[dir][1], k=nx+","+ny;
      if(nx<0||ny<0||nx>=W.cols||ny>=W.rows||(k in prev)||blocked[k]) continue;
      prev[k] = {x,y,dir}; q.push([nx,ny]);
    }
  }
  const end = tx+","+ty; if(!(end in prev)) return null;
  const out=[]; let k=end; while(prev[k]){ out.unshift(prev[k].dir); k = prev[k].x+","+prev[k].y; }
  return out;
}
function castraWorldWalk(path){
  const next = ()=>{ if(!path.length||!el("cwMap")) return; if(castraWStep(path.shift())) setTimeout(next,190); else setTimeout(next,60); };
  next();
}
