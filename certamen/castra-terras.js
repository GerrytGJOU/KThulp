/* ============================================================================
   CASTRA HEROUM — TERRASSEN MET TRAPPEN, ZOALS RPG MAKER EEN BERG BOUWT (Laconia: Sparta, de bergstad)
   ----------------------------------------------------------------------------
   Zo werkt een berg in RPG Maker (afgekeken aan de voorbeeldkaart van Gerben en de tilesets Outside_A4, A1 en B):
     - Een berg is een stapel plateaus. Elk plateau is een autotile uit Outside_A4 (rij 10-12 van het blok, met een rand van rotsblokjes),
       en onder zijn zuidrand hangt de klifwand (rij 13-14 van hetzelfde blok). Links, rechts en boven heeft een plateau alleen de rand.
     - Je komt van het ene niveau op het andere via een trap die door de klifwand loopt (in de voorbeeldkaart zijn dat getekende trappen;
       onze tilesets hebben er geen, dus we tekenen ze op de wand).
     - Bovenop staan huizen, bomen en water. Water en watervallen komen uit Outside_A1.
   Hier hetzelfde met rechthoeken: een lijst plateaus met een niveau, en een lijst trappen. De bouwer rekent zelf uit:
     • wandcellen: de rij onder de zuidrand van een plateau (alleen waar de grond eronder lager ligt); een trap is een gat in die wand;
     • randcellen: de buitenste cellen links, rechts en boven (solide; ze zijn alleen de rand van het plateau); de zuidrand zelf is begaanbaar;
     • begaanbare cellen binnenin, met ontmoetingen van het terrein waar ze liggen.
   Niemand kan via de zijkant het plateau op: alleen via een trap. Zo blijven de heggen en poorten van het land hun werk doen als de
   plateaus tussen twee heggen blijven (zie `CASTRA_TERRAS.laconia`). Objecten, personen en helden die op een plek komen te liggen die
   dichtgaat, verhuizen bij het laden naar de dichtstbijzijnde vrije plek (castraTerraRelocate).
   Rendering: dezelfde tekenstap als de ASCII-bergen (castra-berg.js: castraDrawBergA4), plus trappen.
   Laadt NA castra-berg.js en voor castra-fx.js.
   ============================================================================ */
const CASTRA_TERRAS = {
  // Laconia: het dal van de Eurotas met links de Taygetos en rechts de Parnon. Per zone (tussen de heggen op y 14-15 en y 30-31) bergen,
  // het dal en de weg in het midden (x 29-34) blijven vrij zodat de poorten op (31,15) en (31,31) hun werk doen.
  laconia: { style:"sand", seed:2468, tall:0.42, cut:1,
    plateaus:[
      // noordelijke zone (y 2-13): twee massieven, elk uit verspringende blokken, met een tweede niveau erbovenop
      { x:6,  y:3, w:13, h:8, lv:1 }, { x:16, y:5, w:11, h:6, lv:1 }, { x:9, y:3, w:9, h:4, lv:2 }, { x:13, y:3, w:4, h:2, lv:2 },
      { x:37, y:5, w:11, h:6, lv:1 }, { x:44, y:3, w:14, h:8, lv:1 }, { x:48, y:3, w:8, h:4, lv:2 },
      // middelste zone (y 17-29): uitlopers aan weerszijden van de weg en de tenten
      { x:6,  y:18, w:9,  h:3, lv:1 }, { x:12, y:19, w:9, h:3, lv:1 }, { x:41, y:19, w:8, h:3, lv:1 }, { x:46, y:18, w:11, h:3, lv:1 },
      { x:7,  y:26, w:9,  h:2, lv:1 },
      // zuidelijke zone (y 32-46): een massief links en een rechts
      { x:6,  y:35, w:10, h:4, lv:1 }, { x:13, y:35, w:10, h:4, lv:1 }, { x:37, y:35, w:11, h:3, lv:1 },
    ],
  },
  // Themiscyra: de bosberg van de Amazones (grasplateaus) in het noordoosten (Mons), met een lage uitloper in het westen
  themiscyra: { style:"grass", seed:1357, tall:0.4, cut:1,
    plateaus:[ { x:38, y:3, w:13, h:8, lv:1 }, { x:48, y:4, w:9, h:6, lv:1 }, { x:41, y:3, w:8, h:4, lv:2 }, { x:6, y:26, w:9, h:3, lv:1 } ],
  },
  // Persis: rode zandsteenmesa's, per zone gescheiden door ravijnen (de vrije stroken ertussen); de weg in het midden (x 28-35) blijft vrij
  persis: { style:"sand2", seed:2201, tall:0.3, cut:1,
    plateaus:[ { x:4, y:3, w:15, h:8, lv:1 }, { x:8, y:3, w:8, h:4, lv:2 }, { x:39, y:3, w:15, h:8, lv:1 }, { x:43, y:3, w:8, h:4, lv:2 },
               { x:5, y:36, w:12, h:4, lv:1 }, { x:41, y:36, w:12, h:4, lv:1 } ],
  },
  // Aegyptus: tafelbergen langs de Nijlvallei (de rivier links blijft vrij)
  aegyptus: { style:"sand", seed:2202, tall:0.3, cut:1,
    plateaus:[ { x:12, y:3, w:13, h:7, lv:1 }, { x:15, y:3, w:7, h:3, lv:2 }, { x:39, y:3, w:15, h:8, lv:1 }, { x:43, y:3, w:7, h:4, lv:2 },
               { x:10, y:37, w:12, h:4, lv:1 }, { x:40, y:36, w:14, h:4, lv:1 } ],
  },
  // Africa: de Atlas in het noorden en rotsplateaus in het zuiden
  africa: { style:"sand2", seed:2203, tall:0.3, cut:1,
    plateaus:[ { x:5, y:3, w:15, h:8, lv:1 }, { x:9, y:3, w:7, h:4, lv:2 }, { x:40, y:3, w:14, h:8, lv:1 }, { x:44, y:3, w:7, h:4, lv:2 },
               { x:5, y:33, w:13, h:5, lv:1 }, { x:11, y:33, w:6, h:2, lv:2 }, { x:38, y:34, w:12, h:4, lv:1 } ],
  },
};

/* ---------- het plan (puur: alleen getallen) ---------- */
const CASTRA_TERRA_PLAN = {};
function castraTerraPlan(rid){
  if(CASTRA_TERRA_PLAN[rid]) return CASTRA_TERRA_PLAN[rid];
  const T = CASTRA_TERRAS[rid], W = CASTRA_WORLDS[rid]; if(!T || !W) return null;
  const cols = W.cols, rows = W.rows, L = Array.from({ length:rows }, ()=>Array(cols).fill(0));
  T.plateaus.forEach(p=>{ for(let y=p.y;y<p.y+p.h;y++) for(let x=p.x;x<p.x+p.w;x++){
    if(T.cut){ const cx = (x===p.x||x===p.x+p.w-1), cy = (y===p.y||y===p.y+p.h-1); if(cx && cy) continue; }       // afgeronde hoeken
    if(L[y] && L[y][x]!==undefined) L[y][x] = Math.max(L[y][x], p.lv); } });
  const face = {}, rim = {}, walk = {}, plateau = {};
  for(let y=0;y<rows;y++) for(let x=0;x<cols;x++){ const l = L[y][x]; if(!l) continue;
    const south = y+1<rows ? L[y+1][x] : 0; if(south < l){ face[x+","+(y+1)] = l; } }
  for(let y=0;y<rows;y++) for(let x=0;x<cols;x++){ const l = L[y][x], k = x+","+y; if(!l || face[k]) continue;
    plateau[k] = l;
    const west = x>0 ? L[y][x-1] : 0, east = x+1<cols ? L[y][x+1] : 0, north = y>0 ? L[y-1][x] : 0;
    if(west<l || east<l || north<l) rim[k] = 1; else walk[k] = l; }
  const stairs = {}; (T.stairs||[]).forEach(([x,y])=>{ const k = x+","+y; if(face[k]){ stairs[k] = 1; } });
  // automatische trappen: één in het midden van elke doorlopende wand (twee bij een lange wand), op een plek met begaanbaar terrein erboven en eronder
  const okAbove = (x,y)=>!!walk[x+","+(y-1)] || (!!plateau[x+","+(y-1)] && !rim[x+","+(y-1)]), okBelow = (x,y)=>{ const k = x+","+(y+1); return y+1<rows && !face[k] && !rim[k] && (walk[k] || !plateau[k]); };
  if(T.auto!==false){
    for(let y=0;y<rows;y++){ let x = 0;
      while(x<cols){ if(!face[x+","+y]){ x++; continue; } let x1 = x; while(x1+1<cols && face[(x1+1)+","+y]) x1++; const len = x1-x+1;
        if(len>=3){ const picks = len>=14 ? [x+Math.floor(len/4), x+Math.floor(len*3/4)] : [x+Math.floor(len/2)];
          picks.forEach(px=>{ for(const d of [0,1,-1,2,-2,3,-3]){ const cx = px+d; if(cx>=x && cx<=x1 && okAbove(cx,y) && okBelow(cx,y)){ stairs[cx+","+y] = 1; break; } } }); }
        x = x1+1; } } }
  return CASTRA_TERRA_PLAN[rid] = { cols, rows, L, face, rim, walk, plateau, stairs };
}
// Een cel waar je niet kunt staan (wand zonder trap, rand van een plateau).
function castraTerraSolid(rid, x, y){ const P = castraTerraPlan(rid); if(!P) return false; const k = x+","+y; return (!!P.face[k] && !P.stairs[k]) || !!P.rim[k]; }

/* ---------- verhuizen wat in de weg ligt ---------- */
function castraTerraRelocate(rid){
  const P = castraTerraPlan(rid), W = CASTRA_WORLDS[rid]; if(!P) return [];
  const moved = [], taken = {};
  const near = (x,y,list,d)=>list.some(t=>Math.abs(t[0]-x)<d && Math.abs(t[1]-y)<d);
  const fixed = []; (W.doors||[]).forEach(d=>fixed.push([d.x,d.y])); (W.exit||[]).forEach(e=>fixed.push([e.x,e.y])); fixed.push([W.start.x,W.start.y]);
  const inWater = (x,y)=>(W.water||[]).some(wt=>x>=wt.x0-1 && x<=wt.x1+1);
  const road = (x,y)=>(W.roads||[]).some(r=>x>=r.x0&&x<=r.x1&&y>=r.y0&&y<=r.y1);
  const things = [];
  CASTRA_WENT.filter(e=>e.region===rid && e.kind!=="block" && !(e.kind==="veld" && e.gate) && e.kind!=="hub").forEach(e=>things.push({ o:e, get x(){ return e.x; }, get y(){ return e.y; }, set(x,y){ e.x = x; e.y = y; } }));
  Object.keys(CASTRA_NPCS).filter(h=>CASTRA_NPCS[h].region===rid).forEach(h=>{ const wd = CASTRA_NPCS[h].world; things.push({ o:wd, get x(){ return wd.x; }, get y(){ return wd.y; }, set(x,y){ wd.x = x; wd.y = y; } }); });
  CASTRA_WENT.filter(e=>e.region===rid).forEach(e=>{ taken[e.x+","+e.y] = 1; });
  Object.keys(CASTRA_NPCS).filter(h=>CASTRA_NPCS[h].region===rid).forEach(h=>{ const wd = CASTRA_NPCS[h].world; taken[wd.x+","+wd.y] = 1; });
  const solid = (x,y)=>castraTerraSolid(rid, x, y) || P.stairs[x+","+y] || inWater(x,y);
  const nearStair = (x,y)=>Object.keys(P.stairs).some(s=>{ const [sx,sy] = s.split(",").map(Number); return Math.abs(sx-x)<=1 && Math.abs(sy-y)<=1; });
  things.forEach(t=>{
    if(!solid(t.x, t.y) && !nearStair(t.x, t.y)) return;
    let best = null;
    for(let r=1;r<=12 && !best;r++) for(let dy=-r;dy<=r && !best;dy++) for(let dx=-r;dx<=r;dx++){
      if(Math.max(Math.abs(dx),Math.abs(dy))!==r) continue; const x = t.x+dx, y = t.y+dy, k = x+","+y;
      if(x<2||y<2||x>=P.cols-2||y>=P.rows-2||solid(x,y)||taken[k]||road(x,y)||near(x,y,fixed,2)) continue;
      // niet in de kolom of rij van een trap, zodat hij de trap niet dichtzet
      if(nearStair(x, y)) continue;
      // niet op een plek die door de heggen van het land van de kaart is afgesneden: dezelfde zone als eerst (tussen de heggen)
      const hedgeZone = yy=>yy<14 ? 0 : yy<31 ? 1 : 2; if(hedgeZone(y)!==hedgeZone(t.y)) continue;
      best = [x,y]; break; }
    if(best){ delete taken[t.x+","+t.y]; taken[best[0]+","+best[1]] = 1; moved.push([t.o.id||"held", t.x, t.y, best[0], best[1]]); t.set(best[0], best[1]); }
  });
  return moved;
}
const CASTRA_TERRA_MOVED = {};
Object.keys(CASTRA_TERRAS).forEach(rid=>{ if(CASTRA_WORLDS[rid]) CASTRA_TERRA_MOVED[rid] = castraTerraRelocate(rid); });

/* ---------- de kaart bouwen ---------- */
function castraTerraApply(def, rid){
  const P = castraTerraPlan(rid), T = CASTRA_TERRAS[rid]; if(!P) return def;
  const rng = castraMapRng(T.seed), W = castraWorldCfg();
  // alles wat in een plateau of wand ligt, weg (bomen, decor, hoog gras), maar niet buiten de plateaus
  const keepClear = {};      // rond elke trap: niets (bomen, decor) dat hem dichtzet
  Object.keys(P.stairs).forEach(k=>{ const [x,y] = k.split(",").map(Number); for(let dy=-2;dy<=2;dy++) for(let dx=-1;dx<=1;dx++) keepClear[(x+dx)+","+(y+dy)] = 1; });
  const cells = k=>P.plateau[k] || P.face[k] || keepClear[k];
  def.pieces = def.pieces.filter(p=>{ const O = CASTRA_OBJ[p.o], w = O?O.w:1, h = O?O.h:1;
    for(let dy=0;dy<h;dy++) for(let dx=0;dx<w;dx++) if(cells((p.x+dx)+","+(p.y+dy))) return false; return true; });
  def.tall = def.tall || {}; Object.keys(def.tall).forEach(k=>{ if(cells(k)) delete def.tall[k]; });
  const cliffs = [], plateau = {}, ramp = {};
  Object.keys(P.plateau).forEach(k=>{ const [x,y] = k.split(",").map(Number); def.ground[y][x] = "stone"; plateau[k] = 1; });
  Object.keys(P.face).forEach(k=>{ const [x,y] = k.split(",").map(Number); def.ground[y][x] = "stoneb";
    cliffs.push({ x, y, k: P.stairs[k] ? "stairs" : "wall" }); if(!P.stairs[k]) def.walls.push([x,y]); });
  Object.keys(P.rim).forEach(k=>{ const [x,y] = k.split(",").map(Number); def.walls.push([x,y]); });
  // ontmoetingen op het begaanbare deel, van het terrein van de zone eronder
  const zoneT = (x,y)=>{ const z = (W.zones||[]).find(z=>x>=z.x&&x<z.x+z.w&&y>=z.y&&y<z.y+z.h); return z ? z.t : "mons"; };
  Object.keys(P.walk).forEach(k=>{ const [x,y] = k.split(",").map(Number); if(rng() < T.tall && !P.stairs[k] && !P.face[k]){ def.tall[k] = zoneT(x,y); def.pieces.push({ o:"dry_grass", x, y }); } });
  // de plateaucellen onder een trap: begaanbaar en niet voor ontmoetingen
  def.cliffs = (def.cliffs||[]).concat(cliffs); def.bergPlateau = Object.assign(def.bergPlateau||{}, plateau); def.bergRamp = Object.assign(def.bergRamp||{}, ramp);
  def.ledges = def.ledges || {}; def.boulders = def.boulders || []; def.bergPaths = def.bergPaths || {}; def.bergStyle = def.bergStyle || T.style || "sand";
  let x0 = 1e9, y0 = 1e9, x1 = -1, y1 = -1; Object.keys(cells ? Object.assign({}, P.plateau, P.face) : {}).forEach(k=>{ const [x,y] = k.split(",").map(Number); x0 = Math.min(x0,x); y0 = Math.min(y0,y); x1 = Math.max(x1,x); y1 = Math.max(y1,y); });
  def.bergRect = def.bergRect ? { x:Math.min(def.bergRect.x,x0), y:Math.min(def.bergRect.y,y0), w:Math.max(def.bergRect.x+def.bergRect.w,x1+1)-Math.min(def.bergRect.x,x0), h:Math.max(def.bergRect.y+def.bergRect.h,y1+1)-Math.min(def.bergRect.y,y0) } : { x:x0, y:y0, w:x1-x0+1, h:y1-y0+1 };
  def.bergLevel = Object.assign(def.bergLevel||{}, P.plateau); def.bergFace = Object.assign(def.bergFace||{}, P.face);
  def.terra = { stairs:P.stairs };
  return def;
}
const _castraWorldDefTerra0 = castraWorldDef;
castraWorldDef = function(){ const d = _castraWorldDefTerra0.apply(this, arguments), W = castraWorldCfg(); return (W.interior || !CASTRA_TERRAS[W.id]) ? d : castraTerraApply(d, W.id); };
