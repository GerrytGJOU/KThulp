/* ============================================================================
   CASTRA HEROUM — TEGELKAART-ENGINE (RPG Maker MV-tilesets, 48×48)
   ----------------------------------------------------------------------------
   Gedeeld door het kamp (castra.js) en de jachtwereld (castra-world.js).
   - Bronnen: assets/tilesets/Outside_A5 (vloertegels), Outside_B (objecten:
     tenten, bomen, kratten, ...). Coördinaten (kolom,rij) komen uit de sheets.
   - Een kaart is een ground-raster (sleutels uit CASTRA_GROUND) + pieces
     (objecten uit CASTRA_OBJ op een x,y). Pieces zijn solide (blokkeren), en
     hoge objecten (bomen) hebben een bovenrij die ÓVER de avatar valt (je loopt
     er achterlangs).
   - Logica (geblokkeerde cellen) is synchroon; tekenen wacht op de plaatjes.
   Licentie/herkomst van de tilesets: zie assets/tilesets/README.txt.
   Laadt vóór castra.js.
   ============================================================================ */

const CASTRA_TS_VER = "v=1";
const CASTRA_TS_FILES = {
  A5: "assets/tilesets/Outside_A5.png",
  B:  "assets/tilesets/Outside_B.png",
  A1: "assets/tilesets/Outside_A1.png",
};
const CASTRA_TS_IMG = {};
let _castraTsPromise = null;
function castraTsLoad(){
  if(_castraTsPromise) return _castraTsPromise;
  _castraTsPromise = Promise.all(Object.keys(CASTRA_TS_FILES).map(k=>new Promise(res=>{
    const im = new Image();
    im.onload = ()=>{ CASTRA_TS_IMG[k] = im; res(); };
    im.onerror = ()=>res();                      // ontbrekend plaatje = leeg, geen crash
    im.src = CASTRA_TS_FILES[k] + "?" + CASTRA_TS_VER;
  })));
  return _castraTsPromise;
}

/* ---- vloertegels (Outside_A5, 8 kolommen) ---- */
const CASTRA_GROUND = {
  grass:   { s:"A5", c:0, r:2 },
  grass2:  { s:"A5", c:4, r:2 },    // donker gras = hoog gras (ontmoetingszone)
  sand:    { s:"A5", c:1, r:2 },
  sand2:   { s:"A5", c:2, r:2 },
  stone:   { s:"A5", c:2, r:6 },
  stoneb:  { s:"A5", c:0, r:6 },
  cobble:  { s:"A5", c:2, r:4 },
  wall:    { s:"A5", c:0, r:9 },    // houten palissade
  plank:   { s:"A5", c:2, r:0 },    // brugdek
  water:   { s:"A1", px:24, py:72 }, // vulling van een waterautotile (pure water, geen oever)
};

/* ---- objecten (Outside_B); w×h in tegels; solid: all | bottom | none ---- */
const CASTRA_OBJ = {
  tent_beige: { s:"B", c:8,  r:10, w:3, h:3, solid:"all" },
  tent_white: { s:"B", c:8,  r:13, w:3, h:3, solid:"all" },
  tree_a:     { s:"B", c:5,  r:11, w:1, h:2, solid:"bottom" },
  tree_b:     { s:"B", c:6,  r:11, w:1, h:2, solid:"bottom" },
  tree_big:   { s:"B", c:0,  r:14, w:2, h:2, solid:"bottom" },
  tree_big2:  { s:"B", c:2,  r:14, w:2, h:2, solid:"bottom" },
  palm:       { s:"B", c:12, r:5,  w:1, h:2, solid:"bottom" },
  barrel:     { s:"B", c:5,  r:9,  w:1, h:1, solid:"all" },
  well:       { s:"B", c:3,  r:9,  w:1, h:1, solid:"all" },
  sign:       { s:"B", c:1,  r:9,  w:1, h:1, solid:"all" },
  fence:      { s:"B", c:2,  r:9,  w:1, h:1, solid:"all" },
  bucket:     { s:"B", c:1,  r:10, w:1, h:1, solid:"all" },
  pot:        { s:"B", c:0,  r:10, w:1, h:1, solid:"all" },
  stump:      { s:"B", c:4,  r:11, w:1, h:1, solid:"all" },
  logs:       { s:"B", c:2,  r:13, w:1, h:1, solid:"all" },
  crate_a:    { s:"B", c:4,  r:14, w:1, h:1, solid:"all" },
  crate_b:    { s:"B", c:5,  r:14, w:1, h:1, solid:"all" },
  crate_c:    { s:"B", c:4,  r:15, w:1, h:1, solid:"all" },
  crate_d:    { s:"B", c:5,  r:15, w:1, h:1, solid:"all" },
  rock_grey:  { s:"B", c:7,  r:11, w:1, h:1, solid:"all" },
  rock_brown: { s:"B", c:7,  r:12, w:1, h:1, solid:"all" },
  stones:     { s:"B", c:3,  r:13, w:1, h:1, solid:"none" },
  plant_a:    { s:"B", c:0,  r:11, w:1, h:1, solid:"none" },
  plant_b:    { s:"B", c:1,  r:11, w:1, h:1, solid:"none" },
  plant_c:    { s:"B", c:2,  r:11, w:1, h:1, solid:"none" },
  fern:       { s:"B", c:3,  r:11, w:1, h:1, solid:"none" },
  flower_w:   { s:"B", c:0,  r:12, w:1, h:1, solid:"none" },
  flower_p:   { s:"B", c:1,  r:12, w:1, h:1, solid:"none" },
  flower_b:   { s:"B", c:2,  r:12, w:1, h:1, solid:"none" },
  flower_o:   { s:"B", c:3,  r:12, w:1, h:1, solid:"none" },
  // biomen: woestijn en bos (Outside_B)
  palm2:      { s:"B", c:13, r:5,  w:1, h:2, solid:"bottom" },
  dead_a:     { s:"B", c:8,  r:5,  w:1, h:2, solid:"bottom" },
  dead_b:     { s:"B", c:9,  r:5,  w:1, h:2, solid:"bottom" },
  cactus:     { s:"B", c:14, r:5,  w:1, h:1, solid:"all" },
  bush_pink:  { s:"B", c:13, r:6,  w:1, h:1, solid:"all" },
  stump_g:    { s:"B", c:11, r:6,  w:1, h:1, solid:"all" },
  hay:        { s:"B", c:8,  r:7,  w:1, h:1, solid:"all" },
  mush_b:     { s:"B", c:10, r:5,  w:1, h:1, solid:"none" },
  mush_r:     { s:"B", c:11, r:5,  w:1, h:1, solid:"none" },
  fern_big:   { s:"B", c:14, r:6,  w:1, h:1, solid:"none" },
  dry_grass:  { s:"B", c:11, r:7,  w:1, h:1, solid:"none" },
  dry_plant:  { s:"B", c:15, r:5,  w:1, h:1, solid:"none" },
  dry_fern:   { s:"B", c:15, r:6,  w:1, h:1, solid:"none" },
  leaves:     { s:"B", c:12, r:7,  w:1, h:1, solid:"none" },
};

/* ---- gebouwen: tegelkunst per gebouw (relatief aan slot; fw×fh = voetafdruk) ---- */
const CASTRA_BUILDING_ART = {
  praetorium:  { fw:3, fh:3, pieces:[ {o:"tent_beige",dx:0,dy:0} ] },
  contubernia: { fw:3, fh:3, pieces:[ {o:"tent_white",dx:0,dy:0} ] },
  lignatio:    { fw:2, fh:2, pieces:[ {o:"tree_b",dx:0,dy:0}, {o:"stump",dx:1,dy:0}, {o:"logs",dx:0,dy:1}, {o:"logs",dx:1,dy:1} ] },
  metallum:    { fw:2, fh:2, pieces:[ {o:"rock_grey",dx:0,dy:0}, {o:"rock_brown",dx:1,dy:0}, {o:"rock_brown",dx:0,dy:1}, {o:"rock_grey",dx:1,dy:1} ] },
  horreum:     { fw:2, fh:2, pieces:[ {o:"crate_a",dx:0,dy:0}, {o:"crate_b",dx:1,dy:0}, {o:"crate_c",dx:0,dy:1}, {o:"crate_d",dx:1,dy:1} ] },
  campus:      { fw:2, fh:2, pieces:[ {o:"fence",dx:0,dy:0}, {o:"fence",dx:1,dy:0}, {o:"barrel",dx:0,dy:1}, {o:"bucket",dx:1,dy:1} ] },
  heroum:      { fw:3, fh:3, pieces:[ {o:"tent_beige",dx:0,dy:0} ] },
  valetudinarium:{ fw:2, fh:2, pieces:[ {o:"pot",dx:0,dy:0}, {o:"bucket",dx:1,dy:0}, {o:"flower_w",dx:0,dy:1}, {o:"barrel",dx:1,dy:1} ] },
  dilectus:    { fw:2, fh:2, pieces:[ {o:"sign",dx:0,dy:0}, {o:"crate_a",dx:1,dy:0}, {o:"barrel",dx:0,dy:1}, {o:"stump",dx:1,dy:1} ] },
  stabula:     { fw:2, fh:2, pieces:[ {o:"fence",dx:0,dy:0}, {o:"fence",dx:1,dy:0}, {o:"crate_c",dx:0,dy:1}, {o:"barrel",dx:1,dy:1} ] },
  navalia:     { fw:2, fh:2, pieces:[ {o:"logs",dx:0,dy:0}, {o:"logs",dx:1,dy:0}, {o:"barrel",dx:0,dy:1}, {o:"bucket",dx:1,dy:1} ] },
  principia:   { fw:2, fh:2, pieces:[ {o:"sign",dx:0,dy:0}, {o:"pot",dx:1,dy:0}, {o:"well",dx:0,dy:1}, {o:"barrel",dx:1,dy:1} ] },
};

/* ---- kaartlogica (synchroon): blocked["x,y"] = 1 of gebouw-id ---- */
function castraMapLogic(def){
  const blocked = {}, below = [], above = [];
  const put = (o, x, y, owner)=>{
    const O = CASTRA_OBJ[o]; if(!O) return;
    for(let dy=0; dy<O.h; dy++) for(let dx=0; dx<O.w; dx++){
      const cx = x+dx, cy = y+dy;
      const isBottom = dy===O.h-1;
      const solid = O.solid==="all" || (O.solid==="bottom" && isBottom);
      if(solid) blocked[cx+","+cy] = owner || 1;
      const tile = { s:O.s, c:O.c+dx, r:O.r+dy, x:cx, y:cy };
      // Bovenrijen van hoge, niet-gesloten objecten vallen over de avatar heen.
      (O.solid==="bottom" && !isBottom ? above : below).push(tile);
    }
  };
  (def.pieces||[]).forEach(p=>put(p.o, p.x, p.y, p.owner));
  (def.walls||[]).forEach(w=>{ blocked[w[0]+","+w[1]] = 1; });
  return { cols:def.cols, rows:def.rows, ground:def.ground, blocked, below, above, def };
}

/* ---- tekenen ---- */
function castraDrawMapLayers(built, cvBelow, cvAbove){
  const T = 48;
  cvBelow.width = cvAbove.width = built.cols*T; cvBelow.height = cvAbove.height = built.rows*T;
  const g = cvBelow.getContext("2d"), a = cvAbove.getContext("2d");
  g.imageSmoothingEnabled = a.imageSmoothingEnabled = false;
  const draw = (ctx, t)=>{ const im = CASTRA_TS_IMG[t.s]; if(im) ctx.drawImage(im, t.sx!=null?t.sx:t.c*T, t.sy!=null?t.sy:t.r*T, T, T, t.x*T, t.y*T, T, T); };
  for(let y=0; y<built.rows; y++) for(let x=0; x<built.cols; x++){
    const k = CASTRA_GROUND[built.ground[y][x]]; if(k) draw(g, { s:k.s, c:k.c, r:k.r, sx:k.px, sy:k.py, x, y });
  }
  built.below.forEach(t=>draw(g,t));
  built.above.forEach(t=>draw(a,t));
}

// Mini-RNG voor vaste, herhaalbare kaartgeneratie (zelfde kaart bij elk bezoek).
function castraMapRng(seed){
  let a = seed>>>0;
  return ()=>{ a=(a+0x6D2B79F5)>>>0; let t=a; t=Math.imul(t^(t>>>15),t|1); t^=t+Math.imul(t^(t>>>7),t|61); return ((t^(t>>>14))>>>0)/4294967296; };
}
function castraGroundGrid(cols, rows, key){ return Array.from({length:rows},()=>Array(cols).fill(key)); }

/* ---- het kamp ---- */
function castraCampDef(){
  const T = CASTRA_MAP, cols = T.cols, rows = T.rows, g = castraGroundGrid(cols, rows, "grass");
  const rect = (x0,y0,x1,y1,k)=>{ for(let y=y0;y<=y1;y++) for(let x=x0;x<=x1;x++) if(g[y]&&g[y][x]) g[y][x]=k; };
  rect(7,0,8,rows-2,"sand"); rect(9,5,15,6,"sand"); rect(2,4,13,4,"sand"); rect(6,4,9,7,"stone");
  const walls = [];
  for(let x=0;x<cols;x++){ walls.push([x,0],[x,rows-1]); g[0][x]=g[rows-1][x]="wall"; }
  for(let y=0;y<rows;y++){ walls.push([0,y],[cols-1,y]); g[y][0]=g[y][cols-1]="wall"; }
  T.gates.forEach(gt=>gt.tiles.forEach(t=>{ g[t.y][t.x]="sand"; const i = walls.findIndex(w=>w[0]===t.x&&w[1]===t.y); if(i>=0) walls.splice(i,1); }));
  const pieces = [];
  CASTRA_BUILDINGS.filter(b=>b.phase===1&&b.slot).forEach(b=>{
    const art = CASTRA_BUILDING_ART[b.id]; if(!art) return;
    const site = b.start===0 && typeof CASTRA!=="undefined" && CASTRA && castraLvl(b.id)===0 && art.fw===2 && art.fh===2;
    (site ? CASTRA_BUILDING_SITE : art.pieces).forEach(p=>pieces.push({ o:p.o, x:b.slot.x+p.dx, y:b.slot.y+p.dy, owner:b.id }));
  });
  [ ["tree_a",1,2],["tree_b",2,1],["tree_a",14,9],["tree_b",1,9],["tree_a",14,5],["tree_a",1,12],["tree_b",6,11],["tree_b",14,12],["tree_a",10,12] ].forEach(t=>pieces.push({ o:t[0], x:t[1], y:t[2] }));
  [ ["flower_w",9,2],["flower_p",6,3],["flower_b",11,6],["flower_o",3,10],["plant_c",6,9],["fern",11,10],["flower_p",1,6],["stones",9,4],["flower_w",5,12],["flower_b",10,11],["plant_a",1,10],["fern",6,13],["flower_o",9,13] ].forEach(t=>pieces.push({ o:t[0], x:t[1], y:t[2] }));
  return { cols, rows, ground:g, pieces, walls };
}
// Bouwplaats: gebouwen op niveau 0 (nog te bouwen) tonen dit i.p.v. hun eigen kunst (zelfde voetafdruk, altijd solide).
const CASTRA_BUILDING_SITE = [ {o:"logs",dx:0,dy:0}, {o:"stump",dx:1,dy:0}, {o:"crate_a",dx:0,dy:1}, {o:"crate_b",dx:1,dy:1} ];
// Gebouwvoetafdruk voor tikken/interactie (fw×fh uit de tegelkunst).
function castraBuildingFoot(b){ const a = CASTRA_BUILDING_ART[b.id]; return a ? { fw:a.fw, fh:a.fh } : { fw:2, fh:2 }; }
