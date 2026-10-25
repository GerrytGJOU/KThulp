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
                { x:51, y:10, w:5, roof:1, wall:2 } ],
    // grote gebouwen als één plaatje (Roma_A/B.png, Gerben 2026-10-25): bron (sx,sy,sw,sh) in px, plek (x,y) en grootte (w,h) in tegels;
    // shape "ovaal" = alleen de cellen binnen de ellips zijn solide; door = deurcel (blijft open)
    landmarks:[
      { id:"colosseum", img:"RA", sx:336, sy:144, sw:432, sh:624, x:12, y:20, w:9, h:13, shape:"ovaal", door:{ x:16, y:32 } },
      { id:"templum",   img:"RB", sx:336, sy:144, sw:432, sh:624, x:57, y:1,  w:9, h:13 },
    ],
    // de stadspoorten: de triomfboog (Roma_A.png), verkleind, met de doorgang precies op de poortopening
    arch:{ img:"RA", sx:0, sy:384, sw:240, sh:384, scale:0.6, passX:117 },
    statues:[ ["angel_a",33,24],["angel_b",38,24],["angel_c",33,30],["angel_a",38,30],["pillar_fl",31,27],["pillar_fl",40,27],["pillar_rd",20,15],["pillar_rd",50,15],
              ["angel_b",34,15],["angel_c",37,15],["pillar_sq",33,39],["pillar_sq",38,39] ],
    keepTrees:0.3,
  },
};
CASTRA_WORLDS.roma.cityWall = true;
// de dwarsstraat (y 26-27) begint nu bij het Colosseum
CASTRA_WORLDS.roma.roads = CASTRA_WORLDS.roma.roads.map(r=>(r.y0===26 && r.x0===2) ? Object.assign({}, r, { x0:21 }) : r);
function castraUrbsLmCells(L){          // de solide cellen van een groot gebouw
  const out = {};
  for(let y=L.y;y<L.y+L.h;y++) for(let x=L.x;x<L.x+L.w;x++){
    if(L.door && x===L.door.x && y===L.door.y) continue;
    if(L.shape==="ovaal"){ const dx = (x+0.5-(L.x+L.w/2))/(L.w/2), dy = (y+0.5-(L.y+L.h/2))/(L.h/2); if(dx*dx+dy*dy>1.08) continue; }
    out[x+","+y] = 1; }
  return out;
}
// wat in een groot gebouw zou staan (een kist, een voorwerp) verhuist bij het laden naar de dichtstbijzijnde vrije plek
(function(){
  Object.keys(CASTRA_URBS).forEach(rid=>{ const U = CASTRA_URBS[rid], all = {};
    (U.landmarks||[]).forEach(L=>Object.assign(all, castraUrbsLmCells(L)));
    const used = {}; CASTRA_WENT.filter(e=>e.region===rid).forEach(e=>used[e.x+","+e.y] = 1);
    CASTRA_WENT.filter(e=>e.region===rid && all[e.x+","+e.y]).forEach(e=>{
      for(let r=1;r<12;r++){ let done = false;
        for(let dy=-r;dy<=r && !done;dy++) for(let dx=-r;dx<=r && !done;dx++){ const x = e.x+dx, y = e.y+dy, k = x+","+y;
          if(Math.max(Math.abs(dx),Math.abs(dy))!==r || all[k] || used[k] || y===26 || y===27) continue;
          delete used[e.x+","+e.y]; e.x = x; e.y = y; used[k] = 1; done = true; }
        if(done) break; } });
  });
})();          // castra-field.js zet dan een muur in plaats van een rij bomen; castra-land.js laat de natuurlijke afsluiting weg
const CASTRA_URBS_A3 = { roofBand:0, wallBand:1 };      // in Outside_A3: groepen van 96×96 px, 8 per rij; band 0 = daken, band 1 = gevels

function castraUrbsDoor(b){ return { x:b.x+(b.w>>1), y:b.y+3 }; }
function castraUrbsApply(def, rid){
  const U = CASTRA_URBS[rid]; if(!U) return def;
  const W = castraWorldCfg(), cols = def.cols, rows = def.rows, rng = castraMapRng(W.seed+77);
  const cells = {}, busy = {};
  CASTRA_WENT.filter(e=>e.region===rid).forEach(e=>busy[e.x+","+e.y] = 1);
  (W.doors||[]).forEach(d=>busy[d.x+","+d.y] = 1);
  U.buildings.forEach(b=>{ const dr = castraUrbsDoor(b); for(let y=b.y;y<b.y+4;y++) for(let x=b.x;x<b.x+b.w;x++) if(!(x===dr.x && y===dr.y)) cells[x+","+y] = 1; });
  (U.landmarks||[]).forEach(L=>{ Object.assign(cells, castraUrbsLmCells(L)); for(let y=L.y;y<L.y+L.h;y++) for(let x=L.x;x<L.x+L.w;x++) cells["lm"+x+","+y] = 1; });
  // de tenten verdwijnen; wat in een gebouw of in de poortrij staat, ook; en de meeste losse bomen binnen de muren
  const walls = (def.cityWalls||[]).map(c=>c.y);
  def.pieces = def.pieces.filter(p=>{
    if(/^tent_/.test(p.o)) return false;
    const O = CASTRA_OBJ[p.o], w = O?O.w:1, h = O?O.h:1;
    for(let dy=0;dy<h;dy++) for(let dx=0;dx<w;dx++){ const k = (p.x+dx)+","+(p.y+dy); if(cells[k] || cells["lm"+k]) return false; if(!p.noSolid && walls.indexOf(p.y+dy)>=0) return false; }
    if(!p.noSolid && /^tree_[ab]$/.test(p.o) && p.x>=3 && p.x<cols-4 && p.y>=3 && p.y<rows-4 && rng()>U.keepTrees) return false;
    return true; });
  def.tall = def.tall || {}; Object.keys(def.tall).forEach(k=>{ if(cells[k]) delete def.tall[k]; });
  // bestrating: binnen de buitenmuur is het gras plavuizen (de ontmoetingszones blijven donker gras: dat zijn de plantsoenen); losse planten en bloemen verdwijnen daar
  const outer = Math.max.apply(null, walls.concat([0])), paved = {};
  for(let y=1;y<outer;y++) for(let x=1;x<cols-1;x++) if(def.ground[y] && def.ground[y][x]==="grass"){ def.ground[y][x] = rng()<0.04 ? "pave2" : "pave"; paved[x+","+y] = 1; }
  def.pieces = def.pieces.filter(p=>{ const O = CASTRA_OBJ[p.o]; return !(O && O.solid==="none" && !p.noSolid && paved[p.x+","+p.y]); });
  def.tall = def.tall || {}; Object.keys(def.tall).forEach(k=>{ if(paved[k]) delete def.tall[k]; });
  const have = {}; def.walls.forEach(w=>have[w[0]+","+w[1]] = 1);
  Object.keys(cells).forEach(k=>{ if(k.indexOf("lm")===0) return; if(!have[k]){ const [x,y] = k.split(",").map(Number); def.walls.push([x,y]); } });
  // standbeelden en zuilen (alleen op vrije plekken: niet op een weg, deur of object)
  const road = (x,y)=>(W.roads||[]).some(r=>x>=r.x0&&x<=r.x1&&y>=r.y0&&y<=r.y1);
  const taken = {}; def.pieces.forEach(p=>{ const O = CASTRA_OBJ[p.o]; if(!O) return; for(let dy=0;dy<O.h;dy++) for(let dx=0;dx<O.w;dx++) taken[(p.x+dx)+","+(p.y+dy)] = 1; });
  const wallSet = {}; def.walls.forEach(w=>wallSet[w[0]+","+w[1]] = 1);
  (U.statues||[]).forEach(([o,x,y])=>{ const k = x+","+y; if(road(x,y)||road(x,y-1)||busy[k]||cells[k]||wallSet[k]||wallSet[x+","+(y-1)]||taken[k]||taken[x+","+(y-1)]) return;
    def.pieces.push({ o, x, y:y-1 }); def.walls.push([x,y]); });
  def.urbs = { buildings:U.buildings, walls:def.cityWalls||[], landmarks:U.landmarks||[], arch:U.arch||null };
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
  def.urbs.landmarks.forEach(L=>{ const im = CASTRA_TS_IMG[L.img]; if(im) g.drawImage(im, L.sx, L.sy, L.sw, L.sh, L.x*T, L.y*T, L.w*T, L.h*T); });
  const AR = def.urbs.arch, aim = AR && CASTRA_TS_IMG[AR.img];
  if(aim && cvAbove){ const ga = cvAbove.getContext("2d"), dw = AR.sw*AR.scale, dh = AR.sh*AR.scale; ga.save(); ga.imageSmoothingEnabled = true;
    def.urbs.walls.forEach(c=>{ const left = c.gx*T + T/2 - AR.passX*AR.scale, bottom = (c.y+1)*T; ga.drawImage(aim, AR.sx, AR.sy, AR.sw, AR.sh, left, bottom-dh, dw, dh); });
    ga.restore(); }
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
