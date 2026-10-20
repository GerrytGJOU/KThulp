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

const CASTRA_WORLD_BASE = { cols:32, rows:24, view:{ cols:16, rows:11 }, start:{ x:15, y:22 }, exit:[ {x:15,y:23}, {x:16,y:23} ], encounterChance:0.14 };
// Elke regio: ondergrond, wegen (rechthoeken), water (met optionele brug), zones (= terrein van het hoge gras),
// bomenset. De NPC's (helden) staan in CASTRA_HERO_DATA[id].world / .region.
const CASTRA_WORLDS = {
  latium: { ...CASTRA_WORLD_BASE, id:"latium", nm:"Latium", icon:"🌿", seed:20261020, base:"grass", road:"sand", bank:"sand2",
    cols:64, rows:48, start:{ x:31, y:46 },                       // grote regio (64×48); de andere regio's zijn nog 32×24
    roads:[ {x0:31,y0:1,x1:32,y1:47}, {x0:2,y0:24,x1:61,y1:25} ],
    water:[ { x0:54, x1:56, bridgeY:[24,25] } ],                   // de Tiber; alleen de brug is begaanbaar
    zones:[ { t:"silva", x:4, y:6, w:22, h:20 }, { t:"via", x:28, y:2, w:8, h:18 }, { t:"campus", x:36, y:22, w:18, h:22 }, { t:"tiberis", x:42, y:4, w:12, h:16 } ],
    trees:["tree_a","tree_b"], big:"tree_big", sparse:0.07, dense:0.22, denseZone:"silva",
    doors:[ { x:9,  y:22, to:"specus_latium", spawn:{ x:12, y:17, dir:"up" } },       // grot in het bos
            { x:38, y:35, to:"villa_latium",  spawn:{ x:10, y:11, dir:"up" } } ] },  // herberg bij de weg
  graecia: { ...CASTRA_WORLD_BASE, id:"graecia", nm:"Graecia", icon:"🏛️", seed:20261101, base:"sand2", road:"stone", bank:"sand",
    roads:[ {x0:15,y0:1,x1:16,y1:23}, {x0:2,y0:8,x1:26,y1:9} ],
    water:[ { x0:28, x1:29, bridgeY:null } ],                    // de Egeïsche Zee
    zones:[ { t:"mons", x:2, y:2, w:10, h:6 }, { t:"olea", x:2, y:11, w:12, h:10 }, { t:"urbs", x:17, y:10, w:6, h:11 }, { t:"litus", x:23, y:2, w:5, h:19 } ],
    trees:["tree_a","palm"], big:"tree_big2", sparse:0.06, dense:0.18, denseZone:"olea" },
  troia: { ...CASTRA_WORLD_BASE, id:"troia", nm:"Troia", icon:"🏰", seed:20261201, base:"sand2", road:"sand", bank:"sand",
    roads:[ {x0:15,y0:1,x1:16,y1:23}, {x0:2,y0:14,x1:27,y1:15} ],
    water:[ { x0:10, x1:11, bridgeY:[14,15] }, { x0:28, x1:29, bridgeY:null } ],   // Scamander (met brug) en de zee
    zones:[ { t:"scamander", x:3, y:2, w:6, h:20 }, { t:"muros", x:17, y:2, w:9, h:9 }, { t:"campus", x:17, y:16, w:9, h:6 }, { t:"litus", x:26, y:2, w:2, h:20 } ],
    trees:["palm","tree_b"], big:"tree_big", sparse:0.05, dense:0.10, denseZone:"scamander" },
  gallia: { ...CASTRA_WORLD_BASE, id:"gallia", nm:"Gallia", icon:"🌲", seed:20261301, base:"grass", road:"sand", bank:"sand2",
    roads:[ {x0:15,y0:1,x1:16,y1:23}, {x0:2,y0:16,x1:27,y1:17} ],
    water:[ { x0:28, x1:29, bridgeY:[16,17] } ],                 // de Rijn; alleen de brug is begaanbaar
    zones:[ { t:"silva", x:2, y:2, w:12, h:12 }, { t:"oppidum", x:18, y:2, w:8, h:8 }, { t:"campus", x:18, y:11, w:9, h:4 }, { t:"flumen", x:26, y:2, w:2, h:20 } ],
    trees:["tree_a","tree_b"], big:"tree_big", sparse:0.09, dense:0.28, denseZone:"silva" },
  aegyptus: { ...CASTRA_WORLD_BASE, id:"aegyptus", nm:"Aegyptus", icon:"🏜️", seed:20261401, base:"sand2", road:"sand", bank:"sand",
    roads:[ {x0:15,y0:1,x1:16,y1:23}, {x0:2,y0:14,x1:27,y1:15} ],
    water:[ { x0:3, x1:4, bridgeY:[14,15] } ],                   // de Nijl, met een brug op de weg
    zones:[ { t:"nilus", x:5, y:2, w:6, h:20 }, { t:"templum", x:11, y:2, w:4, h:11 }, { t:"urbs", x:17, y:2, w:9, h:10 }, { t:"desertum", x:17, y:16, w:10, h:6 } ],
    trees:["palm","palm"], big:"tree_big2", sparse:0.04, dense:0.12, denseZone:"nilus" },
  persis: { ...CASTRA_WORLD_BASE, id:"persis", nm:"Persis", icon:"🦁", seed:20261501, base:"sand2", road:"stone", bank:"sand",
    roads:[ {x0:15,y0:1,x1:16,y1:23}, {x0:2,y0:12,x1:27,y1:13} ],
    water:[ { x0:28, x1:29, bridgeY:null } ],                    // de Perzische Golf
    zones:[ { t:"mons", x:2, y:2, w:10, h:9 }, { t:"via", x:13, y:1, w:5, h:9 }, { t:"urbs", x:19, y:2, w:7, h:9 }, { t:"campus", x:18, y:15, w:9, h:6 } ],
    trees:["palm","tree_a"], big:"tree_big2", sparse:0.05, dense:0.10, denseZone:"mons" },
  africa: { ...CASTRA_WORLD_BASE, id:"africa", nm:"Africa", icon:"🐘", seed:20261601, base:"sand2", road:"sand", bank:"sand",
    roads:[ {x0:15,y0:1,x1:16,y1:23}, {x0:2,y0:10,x1:27,y1:11} ],
    water:[ { x0:28, x1:29, bridgeY:null } ],                    // de Middellandse Zee
    zones:[ { t:"deserto", x:2, y:2, w:11, h:20 }, { t:"urbs", x:17, y:2, w:7, h:7 }, { t:"campus", x:17, y:13, w:7, h:8 }, { t:"litus", x:25, y:2, w:3, h:20 } ],
    trees:["palm","palm"], big:"tree_big2", sparse:0.04, dense:0.08, denseZone:"litus" },
  roma: { ...CASTRA_WORLD_BASE, id:"roma", nm:"Roma", icon:"🏟️", seed:20261701, base:"grass", road:"stone", bank:"sand2",
    roads:[ {x0:15,y0:1,x1:16,y1:23}, {x0:2,y0:12,x1:26,y1:13} ],
    water:[ { x0:28, x1:29, bridgeY:null } ],                    // de Tiber
    zones:[ { t:"arena", x:2, y:2, w:10, h:9 }, { t:"forum", x:17, y:2, w:8, h:8 }, { t:"castra", x:2, y:15, w:10, h:6 }, { t:"via", x:17, y:15, w:9, h:6 } ],
    trees:["tree_a","tree_b"], big:"tree_big", sparse:0.06, dense:0.10, denseZone:"castra" },
  laconia: { ...CASTRA_WORLD_BASE, id:"laconia", nm:"Laconia", icon:"🛡️", seed:20261801, base:"sand2", road:"stone", bank:"sand",
    roads:[ {x0:15,y0:1,x1:16,y1:23}, {x0:5,y0:14,x1:27,y1:15} ],
    water:[ { x0:3, x1:4, bridgeY:[14,15] } ],                   // de Eurotas, met een brug op de weg
    zones:[ { t:"mons", x:5, y:2, w:8, h:10 }, { t:"urbs", x:18, y:2, w:8, h:9 }, { t:"flumen", x:5, y:16, w:8, h:5 }, { t:"campus", x:18, y:16, w:9, h:5 } ],
    trees:["tree_a","palm"], big:"tree_big2", sparse:0.05, dense:0.14, denseZone:"mons" },
  germania: { ...CASTRA_WORLD_BASE, id:"germania", nm:"Germania", icon:"🐺", seed:20261901, base:"grass", road:"sand", bank:"sand2",
    roads:[ {x0:15,y0:1,x1:16,y1:23}, {x0:2,y0:13,x1:27,y1:14} ],
    water:[ { x0:28, x1:29, bridgeY:[13,14] } ],                 // de Rijn, met een brug op de weg
    zones:[ { t:"silva", x:2, y:2, w:12, h:10 }, { t:"palus", x:2, y:16, w:12, h:5 }, { t:"vicus", x:18, y:2, w:8, h:9 }, { t:"flumen", x:25, y:15, w:3, h:6 } ],
    trees:["tree_a","tree_b"], big:"tree_big", sparse:0.10, dense:0.30, denseZone:"silva" },
  themiscyra: { ...CASTRA_WORLD_BASE, id:"themiscyra", nm:"Themiscyra", icon:"🏹", seed:20262001, base:"grass", road:"sand", bank:"sand2",
    roads:[ {x0:15,y0:1,x1:16,y1:23}, {x0:2,y0:11,x1:27,y1:12} ],
    water:[ { x0:28, x1:29, bridgeY:null } ],                    // de Zwarte Zee
    zones:[ { t:"silva", x:2, y:2, w:11, h:8 }, { t:"mons", x:18, y:2, w:8, h:8 }, { t:"campus", x:2, y:14, w:11, h:7 }, { t:"litus", x:18, y:14, w:10, h:7 } ],
    trees:["tree_a","palm"], big:"tree_big", sparse:0.07, dense:0.20, denseZone:"silva" },
};
let CASTRA_W_REGION = "latium";
function castraWorldCfg(){ return CASTRA_WORLDS[CASTRA_W_REGION]; }
// Regio's ontgrendelen via proelium-missies (zie CASTRA_P_MISSIONS)
const CASTRA_REGION_NEEDS = { latium:null, roma:"m3", gallia:"ro2", germania:"ga2", graecia:"gm2", laconia:"g2", troia:"la2", themiscyra:"t2", persis:"th2", aegyptus:"pe2", africa:"ae2" };
function castraRegionOpen(id){ const n = CASTRA_REGION_NEEDS[id]; return !n || castraPMissionDone(n); }
let CASTRA_WORLD_BUILT = {};   // per regio gecachet
let CASTRA_W_UI = { px:0, py:0, dir:"up", frame:1, moving:false, scale:1, keyFn:null, resizeFn:null };

function castraWorldDef(){
  if(castraWorldCfg().interior && typeof castraInteriorDef==="function") return castraInteriorDef(castraWorldCfg());
  const W = castraWorldCfg(), cols = W.cols, rows = W.rows, rng = castraMapRng(W.seed);
  const g = castraGroundGrid(cols, rows, W.base), tall = {}, used = {}, pieces = [], walls = [];
  const road = (x,y)=>W.roads.some(r=>x>=r.x0&&x<=r.x1&&y>=r.y0&&y<=r.y1);
  for(let y=0;y<rows;y++) for(let x=0;x<cols;x++) if(road(x,y)) g[y][x]=W.road;
  const zoneAt = (x,y)=>W.zones.find(z=>x>=z.x&&x<z.x+z.w&&y>=z.y&&y<z.y+z.h);
  const exitCell = (x,y)=>W.exit.some(e=>e.x===x&&e.y===y);
  // rand: bomen langs de rand (solide muur van bomen), met de uitgang open
  const ring = (x,y)=>x===0||y===0||x===cols-1||y===rows-1;
  for(let y=0;y<rows;y++) for(let x=0;x<cols;x++){
    if(!ring(x,y) || exitCell(x,y)) continue;
    walls.push([x,y]); used[x+","+y]=1;
    pieces.push({ o:W.trees[(x+y)%2], x, y:y-1, noSolid:true });
  }
  // water (geblokkeerd), met een brug waar de weg doorheen loopt
  W.water.forEach(wt=>{
    for(let y=1;y<rows-1;y++) for(let x=wt.x0;x<=wt.x1;x++){
      used[x+","+y]=1;
      if(wt.bridgeY && wt.bridgeY.includes(y)) g[y][x]="plank";
      else { g[y][x]="water"; walls.push([x,y]); }
    }
    for(let y=1;y<rows-1;y++) [wt.x0-1, wt.x1+1].forEach(bx=>{ if(g[y][bx]===W.base) g[y][bx] = W.bank; });
  });
  // plekken van personen vrijhouden (ze worden dynamisch geblokkeerd, zie castraWBlocked)
  Object.keys(CASTRA_NPCS).forEach(id=>{ const n = CASTRA_NPCS[id]; if(n.region===W.id) used[n.world.x+","+n.world.y]=1; });
  if(typeof castraWobjSpots==="function") castraWobjSpots(W.id).forEach(c=>used[c[0]+","+c[1]]=1);
  if(typeof castraWobjPieces==="function") castraWobjPieces(W.id).forEach(p=>{ pieces.push(p); used[p.x+","+p.y]=1; });
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
    const z = zoneAt(x,y), p = z && z.t===W.denseZone ? W.dense : W.sparse, r = rng();
    if(r < p && free(x,y+1)){
      const big = rng()<0.25 && free(x+1,y) && free(x+1,y+1);
      if(big){ pieces.push({ o:W.big, x, y }); [[x,y],[x+1,y],[x,y+1],[x+1,y+1]].forEach(c=>used[c[0]+","+c[1]]=1); }
      else { pieces.push({ o:W.trees[rng()<0.5?0:1], x, y }); used[x+","+y]=1; used[x+","+(y+1)]=1; }
    } else if(r < p+0.06){
      pieces.push({ o:["flower_w","flower_p","flower_b","flower_o","plant_a","plant_b","fern","rock_brown","stones"][Math.floor(rng()*9)], x, y }); used[x+","+y]=1;
    }
  }
  // bord naar het kamp bij de uitgang
  pieces.push({ o:"sign", x:14, y:rows-3 }); used["14,"+(rows-3)]=1;
  return { cols, rows, ground:g, pieces, walls, tall };
}
// Geblokkeerd = vaste kaart OF een zichtbare persoon op die cel.
function castraWBlocked(x,y){ return !!castraWorldBuilt().blocked[x+","+y] || !!castraNpcAt(x,y); }
function castraWorldBuilt(){
  const rid = CASTRA_W_REGION;
  if(!CASTRA_WORLD_BUILT[rid]){
    const def = castraWorldDef();
    const logic = castraMapLogic(def);
    def.pieces.filter(p=>p.noSolid).forEach(p=>{
      const O = CASTRA_OBJ[p.o]; const bx = p.x, by = p.y+O.h-1;
      if(by>=0 && !def.walls.some(w=>w[0]===bx&&w[1]===by)) delete logic.blocked[bx+","+by];
    });
    logic.tall = def.tall; CASTRA_WORLD_BUILT[rid] = logic;
  }
  return CASTRA_WORLD_BUILT[rid];
}

SCREENS.castraWorld = function(){
  document.body.classList.remove("greek");
  if(!CASTRA) castraLoad();
  const W = castraWorldCfg(), st0 = (W.id==="latium" && CASTRA.latV!==2) ? W.start : ((CASTRA.worlds && CASTRA.worlds[W.id]) || (W.id==="latium" && CASTRA.world) || W.start);
  // aankomst via een poort of reisplek (castra-geo.js) gaat voor op de bewaarde plek
  const sp = (typeof CASTRA_GEO_SPAWN!=="undefined") ? CASTRA_GEO_SPAWN : null; if(typeof CASTRA_GEO_SPAWN!=="undefined") CASTRA_GEO_SPAWN = null;
  const st = sp || st0;
  if(typeof castraGeoMark==="function") castraGeoMark(W.id);
  CASTRA_W_UI.px = st.x; CASTRA_W_UI.py = st.y; CASTRA_W_UI.dir = (sp && sp.dir) || "up"; CASTRA_W_UI.frame = 1; CASTRA_W_UI.moving = false;
  H(brand(true)+`
  <div class="scrhead"><button class="back" onclick="castraWorldLeave()">${iconSVG("shield",20,"currentColor")}</button><h2>${W.icon} ${W.nm}</h2></div>
  <div id="cwWrap" style="position:relative;width:100%;margin:0 auto;overflow:hidden;border:2px solid var(--hi,#d4af37);border-radius:10px;background:#2c3a1f">
    <div id="cwMap" style="position:absolute;top:0;left:0;width:${W.cols*48}px;height:${W.rows*48}px;transform-origin:top left;transition:transform .16s linear"></div>
  </div>
  <div id="cwHud"></div>
  <div id="cwPanel"></div>
  <div id="castraPad" style="display:grid;grid-template-columns:repeat(3,64px);grid-template-rows:repeat(2,52px);gap:6px;justify-content:center;margin:10px 0">
    <span></span><button class="btn" onclick="castraWStep('up')">▲</button><span></span>
    <button class="btn" onclick="castraWStep('left')">◀</button><button class="btn" onclick="castraWStep('down')">▼</button><button class="btn" onclick="castraWStep('right')">▶</button>
  </div>
  <div class="note" style="text-align:center">Sleep met je duim over de kaart om te lopen, of tik ergens om daarheen te gaan. Loop door het <b>hoge, donkere gras</b>: daar kun je vijanden ontmoeten. ${castraLaHTML("Venare in herba alta!","Jaag in het hoge gras!","herba_alta")}</div>
  ${foot()}`);
  castraWorldRender();
  castraWorldFit();
  el("cwHud").innerHTML = castraQuestHud();
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
function castraWorldSavePos(x, y){
  const w = CASTRA.worlds || (CASTRA.worlds = {}); w[CASTRA_W_REGION] = { x, y }; if(CASTRA_W_REGION==="latium") CASTRA.latV = 2; castraSave();
}
function castraWorldLeave(){
  castraWorldSavePos(CASTRA_W_UI.px, CASTRA_W_UI.py); castraWorldDetach();
  if(typeof castraGeoToCamp==="function") castraGeoToCamp(); else go("castraRegions");
}
function castraWorldRender(){
  const map = el("cwMap"); if(!map) return; const W = castraWorldCfg();
  map.innerHTML = `<canvas id="cwBelow" style="position:absolute;left:0;top:0;image-rendering:pixelated"></canvas>
    <div id="cwAv" style="position:absolute;width:48px;height:48px;transition:left .16s linear,top .16s linear;pointer-events:none;z-index:5"></div>
    <div id="cwNpcs"></div>
    <canvas id="cwAbove" style="position:absolute;left:0;top:0;pointer-events:none;image-rendering:pixelated;z-index:6"></canvas>`;
  castraWorldNpcs();
  castraWorldAvatar();
  castraTsLoad().then(()=>{ const b=el("cwBelow"), a=el("cwAbove"); if(b&&a) castraDrawMapLayers(castraWorldBuilt(), b, a); });
}
function castraWorldNpcs(){
  const box = el("cwNpcs"); if(!box) return;
  const draw = ()=>{ const b2 = el("cwNpcs"); if(!b2) return;
    b2.innerHTML = castraVisibleNpcs().map(id=>{ const n = CASTRA_NPCS[id];
      return `<div style="position:absolute;left:${n.world.x*48}px;top:${n.world.y*48}px;width:48px;height:48px;z-index:4;pointer-events:none">${castraAvatarHTML(n.avatar, n.world.dir||"down", 1, 48)}</div>`; }).join(""); };
  draw();
  ["getint","licht","olijf"].forEach(h=>castraProbeBase(h).then(draw));
}
function castraWorldAvatar(){
  const av = el("cwAv"); if(!av) return;
  av.style.left = CASTRA_W_UI.px*48+"px"; av.style.top = CASTRA_W_UI.py*48+"px";
  const avatar = (typeof BM_IDENT!=="undefined" && BM_IDENT && BM_IDENT.avatar) ? BM_IDENT.avatar : bmAvatarDefaults();
  av.innerHTML = castraAvatarHTML(avatar, CASTRA_W_UI.dir, CASTRA_W_UI.frame, 48);
  castraWorldCamera();
}
// Camera: avatar in het midden, vastgeklemd aan de kaartranden.
// Op een smal scherm (telefoon) tonen we een kleiner, staand uitsnede zodat tegels en avatar groot genoeg blijven.
function castraWView(){ const w = el("cwWrap"); return (w && w.clientWidth < 520) ? { cols:10, rows:13 } : castraWorldCfg().view; }
function castraWorldCamera(){
  const W = castraWorldCfg(), V = castraWView(), s = CASTRA_W_UI.scale, m = el("cwMap"); if(!m) return;
  const camX = Math.max(0, Math.min(W.cols*48 - V.cols*48, CASTRA_W_UI.px*48 + 24 - V.cols*24));
  const camY = Math.max(0, Math.min(W.rows*48 - V.rows*48, CASTRA_W_UI.py*48 + 24 - V.rows*24));
  m.style.transform = `translate(${-camX*s}px,${-camY*s}px) scale(${s})`;
  CASTRA_W_UI.camX = camX; CASTRA_W_UI.camY = camY;
}
function castraWorldFit(){
  const w = el("cwWrap"); if(!w) return; const V = castraWView();
  CASTRA_W_UI.scale = Math.min(1.25, w.clientWidth/(V.cols*48));
  w.style.height = (V.rows*48*CASTRA_W_UI.scale)+"px";
  castraWorldCamera();
}

function castraWStep(dir){
  if(CASTRA_W_UI.moving) return null;          // bezig met een stap (niet: geblokkeerd)
  if(!el("cwMap")) return false;
  const d = CASTRA_DELTA[dir]; if(!d) return false;
  CASTRA_W_UI.dir = dir;
  const nx = CASTRA_W_UI.px+d[0], ny = CASTRA_W_UI.py+d[1], W = castraWorldCfg();
  if(nx<0||ny<0||nx>=W.cols||ny>=W.rows){ castraWorldAvatar(); return false; }
  if(castraWBlocked(nx,ny)){
    castraWorldAvatar();
    const npc = castraNpcAt(nx,ny);
    if(npc) castraNpcTalk(npc);
    return false;
  }
  CASTRA_W_UI.moving = true; CASTRA_W_UI.px = nx; CASTRA_W_UI.py = ny;
  CASTRA_W_UI.frame = CASTRA_W_UI.frame===1 ? (Math.random()<.5?0:2) : 1;
  castraWorldAvatar();
  setTimeout(()=>{
    CASTRA_W_UI.moving = false; CASTRA_W_UI.frame = 1; castraWorldAvatar();
    castraWorldSavePos(nx, ny);
    if(typeof castraGeoDoor==="function" && castraGeoDoor(nx,ny)) return;
    if(W.exit.some(e=>e.x===nx&&e.y===ny)){ if(typeof castraGeoExit==="function") castraGeoExit(nx,ny); else castraWorldLeave(); return; }
    const terrain = castraWorldBuilt().tall[nx+","+ny];
    if(terrain && Math.random() < W.encounterChance) castraWorldEncounter(terrain);
  }, 170);
  return true;
}
function castraWorldEncounter(terrainId){
  castraWorldSavePos(CASTRA_W_UI.px, CASTRA_W_UI.py); castraSave(); castraWorldDetach();
  CASTRA_V = castraMakeEncounter(castraWorldCfg().parent || CASTRA_W_REGION, terrainId);
  CASTRA_V.log = []; CASTRA_V.round = 0; CASTRA_V.fromWorld = true;
  CASTRA_V_PENDING = true;
  go("castraVenatio");
}
function castraWorldTap(e){
  const map = el("cwMap"); if(!map) return;
  const r = map.getBoundingClientRect(), s = CASTRA_W_UI.scale||1;
  const tx = Math.floor((e.clientX-r.left)/s/48), ty = Math.floor((e.clientY-r.top)/s/48);
  const npc = castraNpcAt(tx,ty);
  if(npc){
    const d = Math.abs(CASTRA_W_UI.px-tx)+Math.abs(CASTRA_W_UI.py-ty);
    if(d===1){ castraNpcTalk(npc); return; }
    let best = null;
    for(const dir in CASTRA_DELTA){ const p = castraWorldPath(CASTRA_W_UI.px, CASTRA_W_UI.py, tx+CASTRA_DELTA[dir][0], ty+CASTRA_DELTA[dir][1]); if(p && (!best || p.length<best.length)) best = p; }
    if(best) castraWorldWalk(best, ()=>castraNpcTalk(npc));
    return;
  }
  const path = castraWorldPath(CASTRA_W_UI.px, CASTRA_W_UI.py, tx, ty);
  if(path && path.length) castraWorldWalk(path);
}
function castraWorldPath(sx,sy,tx,ty){
  const W = castraWorldCfg();
  if(tx<0||ty<0||tx>=W.cols||ty>=W.rows||castraWBlocked(tx,ty)) return null;
  const prev = {}, q=[[sx,sy]]; prev[sx+","+sy] = null;
  while(q.length){
    const [x,y] = q.shift(); if(x===tx && y===ty) break;
    for(const dir in CASTRA_DELTA){
      const nx=x+CASTRA_DELTA[dir][0], ny=y+CASTRA_DELTA[dir][1], k=nx+","+ny;
      if(nx<0||ny<0||nx>=W.cols||ny>=W.rows||(k in prev)||castraWBlocked(nx,ny)) continue;
      prev[k] = {x,y,dir}; q.push([nx,ny]);
    }
  }
  const end = tx+","+ty; if(!(end in prev)) return null;
  const out=[]; let k=end; while(prev[k]){ out.unshift(prev[k].dir); k = prev[k].x+","+prev[k].y; }
  return out;
}
function castraWorldWalk(path, done){
  const next = ()=>{ if(!path.length){ if(done) setTimeout(done, 220); return; } if(!el("cwMap")) return; if(castraWStep(path.shift())) setTimeout(next,190); else setTimeout(next,60); };
  next();
}

/* ---------- regiokeuze (kaart van de wereld) ---------- */
SCREENS.castraRegions = function(){
  document.body.classList.remove("greek");
  if(!CASTRA) castraLoad();
  const cards = Object.keys(CASTRA_WORLDS).map(id=>{
    const r = CASTRA_WORLDS[id], open = castraRegionOpen(id);
    const heroes = Object.keys(CASTRA_HERO_DATA).filter(h=>CASTRA_HERO_DATA[h].region===id);
    const got = heroes.filter(h=>castraHero(h)).length;
    const need = CASTRA_REGION_NEEDS[id], nm = need ? CASTRA_P_MISSIONS.find(m=>m.id===need) : null;
    return `<button class="tile" ${open?"":"disabled style=\"opacity:.5\""} onclick="castraGoRegion('${id}')">
      <span class="ic" style="font-size:36px">${open?r.icon:"🔒"}</span>
      <h3>${esc(r.nm)}${heroes.length?` <small>⭐ ${got} / ${heroes.length}</small>`:""}</h3>
      <p>${open ? castraLaText("venare_in")+" "+esc(r.nm)+"." : castraLaText("clausum")+": "+esc(nm?nm.nm:"")}</p></button>`;
  }).join("");
  H(brand(true)+`
  <div class="scrhead"><button class="back" onclick="castraRegionsLeave()">${iconSVG("shield",20,"currentColor")}</button><h2>🗺️ ${castraLaHTML("Quo venaris, dux?","Waar ga je jagen, leider?","regio_kies")}</h2></div>
  ${cards}${foot()}`);
};
function castraGoRegion(id){ if(!castraRegionOpen(id)) return; CASTRA_W_REGION = id; go("castraWorld"); }
function castraRegionsLeave(){ CASTRA.pos = { x:7, y:1 }; castraSave(); go("castraHome"); }
