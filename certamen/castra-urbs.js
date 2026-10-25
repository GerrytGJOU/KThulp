/* ============================================================================
   CASTRA HEROUM — ROMA ALS STAD: stadsmuur, gebouwen van steen, standbeelden
   ----------------------------------------------------------------------------
   Gerben: "Rome mag er als kaart meer als een stad uitzien; nu is het een bos met tentjes. In plaats van de muur van bomen een
   daadwerkelijke muur (waar het kerkhof dus buiten valt); in plaats van tentjes echte gebouwen in een lichte kleur, standbeelden, etc."
   - De heggen op de poortrijen (castra-field.js) worden in Roma een stadsmuur (zandsteen uit Outside_A4); de poort is de opening. De zuidmuur
     (y 38) is de buitenmuur: het kerkhof, de catacomben en de start liggen erbuiten.
   - De tenten worden gebouwen: een dak (Outside_A3, terracotta) boven een gevel (wit marmer of tan baksteen) met een deur op de plek waar de
     tent zijn deur had, dus alle binnenruimtes en de wereldtest blijven kloppen. De plaats en de deur staan in CASTRA_URBS.roma.
   - Standbeelden en zuilen (Outside_C) langs de straten en bij de poorten; veel minder losse bomen binnen de muren.
   Alles wordt bij het laden uit deze tabel gebouwd; de muur en de gebouwen worden in castraDrawMapLayers getekend (onder de spelers).
   Laadt NA castra-land.js (de laatste wrapper om castraWorldDef).
   ============================================================================ */
const CASTRA_URBS = {
  roma: {
    // x, y = linkerbovenhoek; w = breedte (de deur zit in het midden op rij y+3); roof/wall = kolom (groep) in Outside_A3 (dak: band 0, gevel: band 1)
    buildings:[ { x:7,  y:10, w:5, roof:0, wall:5 }, { x:27, y:10, w:5, roof:1, wall:2 }, { x:43, y:10, w:5, roof:0, wall:5 },
                { x:51, y:10, w:5, roof:1, wall:2 }, { x:12, y:29, w:9, roof:0, wall:5 } ],
    statues:[ ["angel_a",33,24],["angel_b",38,24],["angel_c",33,30],["angel_a",38,30],["pillar_fl",31,27],["pillar_fl",40,27],["pillar_rd",20,15],["pillar_rd",50,15],
              ["angel_b",34,15],["angel_c",37,15],["pillar_sq",34,39],["pillar_sq",37,39] ],
    keepTrees:0.3,
  },
};
CASTRA_WORLDS.roma.cityWall = true;          // castra-field.js zet dan een muur in plaats van een rij bomen; castra-land.js laat de natuurlijke afsluiting weg
const CASTRA_URBS_A3 = { roofBand:0, wallBand:1 };      // in Outside_A3: groepen van 96×96 px, 8 per rij; band 0 = daken, band 1 = gevels

function castraUrbsDoor(b){ return { x:b.x+(b.w>>1), y:b.y+3 }; }
function castraUrbsApply(def, rid){
  const U = CASTRA_URBS[rid]; if(!U) return def;
  const W = castraWorldCfg(), cols = def.cols, rows = def.rows, rng = castraMapRng(W.seed+77);
  const cells = {}, busy = {};
  CASTRA_WENT.filter(e=>e.region===rid).forEach(e=>busy[e.x+","+e.y] = 1);
  (W.doors||[]).forEach(d=>busy[d.x+","+d.y] = 1);
  U.buildings.forEach(b=>{ const dr = castraUrbsDoor(b); for(let y=b.y;y<b.y+4;y++) for(let x=b.x;x<b.x+b.w;x++) if(!(x===dr.x && y===dr.y)) cells[x+","+y] = 1; });
  // de tenten verdwijnen; wat in een gebouw of in de poortrij staat, ook; en de meeste losse bomen binnen de muren
  const walls = (def.cityWalls||[]).map(c=>c.y);
  def.pieces = def.pieces.filter(p=>{
    if(/^tent_/.test(p.o)) return false;
    const O = CASTRA_OBJ[p.o], w = O?O.w:1, h = O?O.h:1;
    for(let dy=0;dy<h;dy++) for(let dx=0;dx<w;dx++){ const k = (p.x+dx)+","+(p.y+dy); if(cells[k]) return false; if(!p.noSolid && walls.indexOf(p.y+dy)>=0) return false; }
    if(!p.noSolid && /^tree_[ab]$/.test(p.o) && p.x>=3 && p.x<cols-4 && p.y>=3 && p.y<rows-4 && rng()>U.keepTrees) return false;
    return true; });
  def.tall = def.tall || {}; Object.keys(def.tall).forEach(k=>{ if(cells[k]) delete def.tall[k]; });
  const have = {}; def.walls.forEach(w=>have[w[0]+","+w[1]] = 1);
  Object.keys(cells).forEach(k=>{ if(!have[k]){ const [x,y] = k.split(",").map(Number); def.walls.push([x,y]); } });
  // standbeelden en zuilen (alleen op vrije plekken: niet op een weg, deur of object)
  const road = (x,y)=>(W.roads||[]).some(r=>x>=r.x0&&x<=r.x1&&y>=r.y0&&y<=r.y1);
  const taken = {}; def.pieces.forEach(p=>{ const O = CASTRA_OBJ[p.o]; if(!O) return; for(let dy=0;dy<O.h;dy++) for(let dx=0;dx<O.w;dx++) taken[(p.x+dx)+","+(p.y+dy)] = 1; });
  const wallSet = {}; def.walls.forEach(w=>wallSet[w[0]+","+w[1]] = 1);
  (U.statues||[]).forEach(([o,x,y])=>{ const k = x+","+y; if(road(x,y)||road(x,y-1)||busy[k]||cells[k]||wallSet[k]||wallSet[x+","+(y-1)]||taken[k]||taken[x+","+(y-1)]) return;
    def.pieces.push({ o, x, y:y-1 }); def.walls.push([x,y]); });
  def.urbs = { buildings:U.buildings, walls:def.cityWalls||[] };
  return def;
}
const _castraWorldDefUrbs0 = castraWorldDef;
castraWorldDef = function(){ const d = _castraWorldDefUrbs0.apply(this, arguments), W = castraWorldCfg(); return (W.interior || !CASTRA_URBS[W.id]) ? d : castraUrbsApply(d, W.id); };

/* ---------- tekenen: gevels en daken (autotile-vierkantjes van 24 px, een rechthoek met randen), de muur en de deuren ---------- */
function castraUrbsRect(g, img, gx0, gy0, x0, y0, w, h, T){
  for(let cy=0;cy<h;cy++) for(let cx=0;cx<w;cx++){
    const L = cx===0, R = cx===w-1, Up = cy===0, D = cy===h-1;
    const q = [[L?0:1, Up?0:1], [R?3:2, Up?0:1], [L?0:1, D?3:2], [R?3:2, D?3:2]];
    [[0,0],[24,0],[0,24],[24,24]].forEach(([ox,oy],i)=>g.drawImage(img, gx0+q[i][0]*24, gy0+q[i][1]*24, 24, 24, (x0+cx)*T+ox, (y0+cy)*T+oy, 24, 24)); }
}
const _castraDrawMapLayersUrbs0 = castraDrawMapLayers;
castraDrawMapLayers = function(built, cvBelow, cvAbove){
  _castraDrawMapLayersUrbs0.apply(this, arguments);
  const def = built && built.def; if(!def || !def.urbs) return;
  const A3 = typeof CASTRA_TS_IMG!=="undefined" && CASTRA_TS_IMG.A3, A4 = CASTRA_TS_IMG.A4, T = 48, g = cvBelow.getContext("2d");
  if(A4){          // de stadsmuur: de zandsteengroep (kolom 6-7 van Outside_A4): een lichte rand bovenop en de gevel eronder
    def.urbs.walls.forEach(c=>{ for(let x=1;x<def.cols-3;x++){ if(x===c.gx) continue;
      const cap = c.y-1;                                                                                  // bovenste rij: dak van de muur met kantelen
      g.drawImage(A4, 3*96+24, 48, 48, 48, x*T, cap*T, T, T);
      g.fillStyle = "#e6d7ac"; g.fillRect(x*T, cap*T, T, 8); g.fillStyle = "#b39b64"; g.fillRect(x*T, cap*T+8, T, 3);
      if(x%2===0){ g.fillStyle = "#e6d7ac"; g.fillRect(x*T+4, cap*T-6, 16, 8); g.fillStyle = "#b39b64"; g.fillRect(x*T+4, cap*T+2, 16, 2); }
      g.drawImage(A4, 3*96+24, 144, 48, 48, x*T, c.y*T, T, T);                                              // onderste rij: de gevel
      g.fillStyle = "rgba(40,25,10,.28)"; g.fillRect(x*T, c.y*T+T-5, T, 5); } }); }
  if(A3){
    def.urbs.buildings.forEach(b=>{ const dr = castraUrbsDoor(b);
      castraUrbsRect(g, A3, b.roof*96, CASTRA_URBS_A3.roofBand*96, b.x, b.y, b.w, 2, T);
      castraUrbsRect(g, A3, b.wall*96, CASTRA_URBS_A3.wallBand*96, b.x, b.y+2, b.w, 2, T);
      const dx = dr.x*T, dy = dr.y*T;          // de deur: een boog van donker hout met een lichte omlijsting
      g.fillStyle = "#c9b27a"; g.beginPath(); g.moveTo(dx+5, dy+T); g.lineTo(dx+5, dy+16); g.quadraticCurveTo(dx+T/2, dy-6, dx+T-5, dy+16); g.lineTo(dx+T-5, dy+T); g.fill();
      g.fillStyle = "#3a2412"; g.beginPath(); g.moveTo(dx+9, dy+T); g.lineTo(dx+9, dy+18); g.quadraticCurveTo(dx+T/2, dy+2, dx+T-9, dy+18); g.lineTo(dx+T-9, dy+T); g.fill();
      g.fillStyle = "#d4af37"; g.fillRect(dx+T-16, dy+30, 3, 3); });
  }
};
