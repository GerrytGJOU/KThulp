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

const CASTRA_TS_VER = "v=4";
// Alle tilesets zijn lossless WebP (even scherp als de PNG's, een derde tot de helft kleiner); de PNG-bronnen staan in de git-geschiedenis.
const CASTRA_TS_FILES = {
  A5: "assets/tilesets/Outside_A5.png",
  B:  "assets/tilesets/Outside_B.webp",
  A1: "assets/tilesets/Outside_A1.webp",
  A3: "assets/tilesets/Outside_A3.webp",       // daken en muren: gebouwen krijgen vanaf niveau 4 en 7 een ander uiterlijk (castraBuildingArtFor)
  A4: "assets/tilesets/Outside_A4.webp",       // muren en kliffen (Gerben, 2026-10-24): klifwanden en plateaus van de bergen (castra-berg.js)
  X:  "assets/tilesets/Castra_extra.png",     // eigen tekeningen (tools/gen_castra_flags.py): vlaggen voor het Praetorium
};
// Alleen nodig in Roma (castra-urbs.js): daken en gevels, het Colosseum, de triomfboog, de tempel, grafstenen en beelden. Pas geladen als je in Roma bent.
const CASTRA_TS_ROMA = {
  C:  "assets/tilesets/Outside_C.webp",
  RA: "assets/tilesets/Roma_A.webp",
  RB: "assets/tilesets/Roma_B.webp",
};
const CASTRA_TS_IMG = {};
let _castraTsPromise = null, _castraTsRomaPromise = null;
function castraTsLoadSet(files){
  return Promise.all(Object.keys(files).map(k=>new Promise(res=>{
    const im = new Image();
    im.onload = ()=>{ CASTRA_TS_IMG[k] = im; res(); };
    im.onerror = ()=>res();                      // ontbrekend plaatje = leeg, geen crash
    im.src = files[k] + "?" + CASTRA_TS_VER;
  })));
}
function castraTsLoad(){
  if(!_castraTsPromise) _castraTsPromise = castraTsLoadSet(CASTRA_TS_FILES);
  const W = (typeof CASTRA_W_REGION!=="undefined" && typeof CASTRA_WORLDS!=="undefined") ? CASTRA_WORLDS[CASTRA_W_REGION] : null;
  if(W && (W.id==="roma" || W.parent==="roma")){          // Roma zelf en zijn binnenruimtes (de tempel gebruikt zuilen en beelden)
    if(!_castraTsRomaPromise) _castraTsRomaPromise = castraTsLoadSet(CASTRA_TS_ROMA);
    return Promise.all([_castraTsPromise, _castraTsRomaPromise]);
  }
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
  pave:    { s:"A5", c:0, r:4 },    // lichte plavuizen (Roma binnen de muren)
  pave2:   { s:"A5", c:3, r:4 },    // lichte tegels, af en toe tussen de plavuizen
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
  // kerkhof (Outside_C): grafstenen, zuilen, botten en beelden; een zuil of steen is alleen onderaan solide
  grave_a:    { s:"C", c:0, r:6,  w:1, h:2, solid:"bottom" },  grave_b:    { s:"C", c:1, r:6,  w:1, h:2, solid:"bottom" },
  pillar_sq:  { s:"C", c:0, r:0,  w:1, h:2, solid:"bottom" },  pillar_rd:  { s:"C", c:1, r:0,  w:1, h:2, solid:"bottom" },
  pillar_fl:  { s:"C", c:2, r:0,  w:1, h:2, solid:"bottom" },  rubble_a:   { s:"C", c:0, r:2,  w:1, h:1, solid:"all" },
  rubble_b:   { s:"C", c:1, r:2,  w:1, h:1, solid:"all" },     bones_a:    { s:"C", c:0, r:3,  w:1, h:1, solid:"none" },
  bones_b:    { s:"C", c:1, r:3,  w:1, h:1, solid:"none" },    angel_a:    { s:"C", c:0, r:10, w:1, h:2, solid:"bottom" },
  angel_b:    { s:"C", c:1, r:10, w:1, h:2, solid:"bottom" },   angel_c:    { s:"C", c:2, r:10, w:1, h:2, solid:"bottom" },
  // vlaggen (Castra_extra.png): staan in de hoeken van het Praetorium, naast de ingang; l/r = kant waarheen het doek wappert
  flag_red_l: { s:"X", c:0, r:0, w:1, h:2, solid:"none" },  flag_red_r:  { s:"X", c:1, r:0, w:1, h:2, solid:"none" },
  flag_gold_l:{ s:"X", c:2, r:0, w:1, h:2, solid:"none" },  flag_gold_r: { s:"X", c:3, r:0, w:1, h:2, solid:"none" },
};

/* ---- gebouwen: tegelkunst per gebouw (relatief aan slot; fw×fh = voetafdruk) ---- */
const CASTRA_BUILDING_ART = {
  praetorium:  { fw:3, fh:3, pieces:[ {o:"tent_beige",dx:0,dy:0} ] },
  contubernia: { fw:3, fh:3, pieces:[ {o:"tent_white",dx:0,dy:0} ] },
  lignatio:    { fw:2, fh:2, pieces:[ {o:"tree_a",dx:0,dy:0}, {o:"stump",dx:1,dy:0}, {o:"logs",dx:0,dy:1}, {o:"logs",dx:1,dy:1} ] },
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

/* ---- gebouwen groeien mee: vanaf niveau 4 en 7 een ander uiterlijk (zelfde voetafdruk en plek) ----
   Tier 0 = de tegelkunst hierboven (tent of voorwerpen), tier 1 (niveau 4-6) = een houten of bakstenen huis met een warm dak,
   tier 2 (niveau 7-10) = een stenen huis met een gekleurd dak. Dak- en muurtegels komen uit Outside_A3 (kolom, rij van het
   linkerbovenvak van de autotile), deur en raam uit Outside_B. */
const CASTRA_TIER_FROM = [1, 4, 7];
const CASTRA_ROOF = { orange:0, orange2:2, blue:4, green:6, teal:8, pink:10, moss:12 };
const CASTRA_WALLS = { plaster:[0,2], brick:[2,2], tan:[4,2], stone:[6,2], cobble:[12,2], white:[10,2], planks:[0,4], planks2:[2,4], logs:[4,6], dark:[0,6] };
// per gebouw: [dak, muur] voor tier 1 en tier 2
const CASTRA_TIER_LOOK = {
  praetorium:   [["orange","brick"],   ["blue","stone"]],
  contubernia:  [["orange2","tan"],    ["moss","stone"]],
  heroum:       [["pink","plaster"],   ["teal","white"]],
  lignatio:     [["moss","logs"],      ["orange","logs"]],
  metallum:     [["moss","cobble"],    ["blue","stone"]],
  horreum:      [["orange2","planks"], ["orange","brick"]],
  campus:       [["green","planks2"],  ["green","plaster"]],
  valetudinarium:[["pink","plaster"],  ["teal","white"]],
  dilectus:     [["blue","planks"],    ["blue","tan"]],
  stabula:      [["orange2","dark"],   ["moss","logs"]],
  navalia:      [["blue","logs"],      ["teal","stone"]],
};
function castraBuildingTier(b){
  const L = (typeof CASTRA!=="undefined" && CASTRA && CASTRA.b && CASTRA.b[b.id]) ? (CASTRA.b[b.id].lvl||0) : 0;
  let t = 0; CASTRA_TIER_FROM.forEach((f,i)=>{ if(L>=f && i>0) t = i; });
  return CASTRA_TIER_LOOK[b.id] ? t : 0;
}
function castraHouseArt(fw, fh, roof, wall, tier){
  const rc = CASTRA_ROOF[roof], [wc, wr] = CASTRA_WALLS[wall], pieces = [], A = (c,r,dx,dy)=>pieces.push({ t:{ s:"A3", c, r, w:1, h:1, solid:"all" }, dx, dy });
  const Bt = (c,r,dx,dy)=>pieces.push({ t:{ s:"B", c, r, w:1, h:1, solid:"all" }, dx, dy });
  for(let dy=0; dy<fh-1; dy++) for(let dx=0; dx<fw; dx++) A(dx===fw-1 ? rc+1 : rc, dy===0 ? 0 : 1, dx, dy);   // dak: bovenrand, daarna de dakvlakte
  for(let dx=0; dx<fw; dx++) A(wc + (dx===fw-1 ? 1 : 0), wr+1, dx, fh-1);                                        // muur onderin
  const door = Math.floor(fw/2); Bt(2, 6, door, fh-1);                                                          // deur
  if(fw===3){ Bt(0,4,0,fh-1); Bt(0,4,2,fh-1); } else if(tier>=2) Bt(0,4,door===0?1:0,fh-1);                     // ramen
  return { fw, fh, pieces };
}
function castraBuildingArtFor(b){
  const base = CASTRA_BUILDING_ART[b.id]; if(!base) return null;
  const t = castraBuildingTier(b); if(!t) return base;
  const look = CASTRA_TIER_LOOK[b.id][t-1];
  return castraHouseArt(base.fw, base.fh, look[0], look[1], t);
}

/* ---- kaartlogica (synchroon): blocked["x,y"] = 1 of gebouw-id ---- */
function castraMapLogic(def){
  const blocked = {}, below = [], above = [];
  const put = (o, x, y, owner)=>{
    const O = typeof o==='string' ? CASTRA_OBJ[o] : o; if(!O) return;
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
  (def.pieces||[]).forEach(p=>put(p.t || p.o, p.x, p.y, p.owner));
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

/* ---- vaste planten en bomen van het kamp: kunnen weggehaald worden (castra-decor.js; CASTRA.cleared = sleutels "voorwerp:x:y") ---- */
const CASTRA_SCENERY = [ ["tree_a",1,2],["tree_a",2,1],["tree_a",14,9],["tree_a",1,9],["tree_a",14,7],["tree_a",1,12],["tree_a",6,11],["tree_a",14,12],["tree_a",10,12],
  ["flower_w",9,2],["flower_p",6,3],["flower_b",11,6],["flower_o",3,10],["plant_c",6,9],["fern",11,10],["flower_p",1,6],["stones",9,4],["flower_w",5,12],["flower_b",10,11],["plant_a",1,10],["fern",6,13],["flower_o",9,13] ];
function castraSceneryKey(t){ return t[0]+":"+t[1]+":"+t[2]; }
function castraSceneryLeft(){
  const cl = (typeof CASTRA!=="undefined" && CASTRA && CASTRA.cleared) || [];
  return CASTRA_SCENERY.filter(t=>cl.indexOf(castraSceneryKey(t))<0);
}

/* Plek van een gebouw: de eigen keuze van de speler (CASTRA.slots) of, bij oudere saves die nog niets verplaatsten, de plek uit castra-data.js.
   Een kamp dat met de nieuwe tutorial begon (CASTRA.camp2) kent alleen geplaatste gebouwen: wie geen plek heeft, staat er nog niet. */
function castraSlot(b){
  if(b.fixed) return b.slot;
  const C = (typeof CASTRA!=="undefined") ? CASTRA : null;
  return (C && C.slots && C.slots[b.id]) || ((C && C.camp2) ? null : b.slot);
}

/* ---- het kamp ---- */
function castraCampDef(){
  const T = CASTRA_MAP, cols = T.cols, rows = T.rows, g = castraGroundGrid(cols, rows, "grass");
  const rect = (x0,y0,x1,y1,k)=>{ for(let y=y0;y<=y1;y++) for(let x=x0;x<=x1;x++) if(g[y]&&g[y][x]) g[y][x]=k; };
  rect(7,0,8,rows-2,"sand"); rect(9,5,cols-1,6,"sand"); rect(2,4,13,4,"sand"); rect(6,4,9,7,"stone");
  const walls = [];
  for(let x=0;x<cols;x++){ walls.push([x,0],[x,rows-1]); g[0][x]=g[rows-1][x]="wall"; }
  for(let y=0;y<rows;y++){ walls.push([0,y],[cols-1,y]); g[y][0]=g[y][cols-1]="wall"; }
  T.gates.forEach(gt=>gt.tiles.forEach(t=>{ g[t.y][t.x]="sand"; const i = walls.findIndex(w=>w[0]===t.x&&w[1]===t.y); if(i>=0) walls.splice(i,1); }));
  const pieces = [];
  const foot = {};     // cellen onder gebouwen: vaste planten die er vanaf nu onder zouden staan verdwijnen
  CASTRA_BUILDINGS.filter(b=>b.phase===1&&castraSlot(b)).forEach(b=>{
    const art = castraBuildingArtFor(b); if(!art) return;
    const S = castraSlot(b);
    for(let dy=0; dy<art.fh; dy++) for(let dx=0; dx<art.fw; dx++) foot[(S.x+dx)+","+(S.y+dy)] = 1;
    const site = typeof CASTRA!=="undefined" && CASTRA && castraLvl(b.id)===0;
    const oy = site ? art.fh-2 : 0, ox = site ? Math.floor((art.fw-2)/2) : 0;      // een bouwplaats (2×2) staat onderin het vak
    (site ? CASTRA_BUILDING_SITE : art.pieces).forEach(p=>pieces.push({ o:p.o, t:p.t, x:S.x+p.dx+ox, y:S.y+p.dy+oy, owner:b.id }));
  });
  // Het Praetorium is het hoofdkwartier: twee vlaggen naast de ingang (rood; goud vanaf level 3).
  { const pr = CASTRA_BUILDINGS.find(b=>b.id==="praetorium"), gold = typeof CASTRA!=="undefined" && CASTRA && castraLvl("praetorium")>=3, c = gold ? "gold" : "red";
    const PS = pr ? castraSlot(pr) : null;
    if(PS && castraBuildingTier(pr)===0 && castraLvl("praetorium")>0){ pieces.push({ o:"flag_"+c+"_l", x:PS.x, y:PS.y+1 }, { o:"flag_"+c+"_r", x:PS.x+2, y:PS.y+1 }); } }
  castraSceneryLeft().forEach(t=>{ if(!foot[t[1]+","+t[2]]) pieces.push({ o:t[0], x:t[1], y:t[2] }); });
  return { cols, rows, ground:g, pieces, walls };
}
// Bouwplaats: gebouwen op niveau 0 (nog te bouwen) tonen dit i.p.v. hun eigen kunst (zelfde voetafdruk, altijd solide).
const CASTRA_BUILDING_SITE = [ {o:"logs",dx:0,dy:0}, {o:"stump",dx:1,dy:0}, {o:"crate_a",dx:0,dy:1}, {o:"crate_b",dx:1,dy:1} ];
// Gebouwvoetafdruk voor tikken/interactie (fw×fh uit de tegelkunst).
function castraBuildingFoot(b){ const a = CASTRA_BUILDING_ART[b.id]; return a ? { fw:a.fw, fh:a.fh } : { fw:2, fh:2 }; }
