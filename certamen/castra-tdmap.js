/* ============================================================================
   CASTRA HEROUM — AANKLEDING VAN DE TOWER DEFENCE-KAARTEN
   ----------------------------------------------------------------------------
   De kaarten waren een effen grasveld met een weg van vierkante tegels. Dit tekent ze mooier, zonder iets aan de
   spelregels te veranderen (pad, boomcellen en plaatsbare cellen blijven exact gelijk, dus de balans ook):
   - de weg is één vloeiende lijn met afgeronde bochten, een donkere rand, een lichter pad in het midden en
     kiezels langs de kant (in Roma, Troje en de bergen van keien, elders van zand);
   - het gras krijgt zachte lichte en donkere vlekken en, per regio (castra-biomes.js), vlakken zand of kei;
   - bomen volgen het bioom van de regio (palmen, dode bomen, ...);
   - kleine, niet-blokkerende versieringen (bloemen, planten, varens, stenen) op een deel van de vrije cellen;
   - een zachte schaduw aan de rand van de kaart.
   Alles is deterministisch per missie (seed), dus elke keer dezelfde kaart. Laadt NA castra-map.js, castra-biomes.js
   en castra-battle.js (gebruikt door castraBRenderMap; ontbreekt dit bestand, dan tekent castraDrawMapLayers).
   ============================================================================ */

const CASTRA_TD_ROAD = { default:"sand", roma:"cobble", troia:"cobble", laconia:"stoneb", persis:"stoneb" };
const CASTRA_TD_DECOR = ["flower_w","flower_p","flower_b","flower_o","plant_a","plant_b","plant_c","fern","stones"];

function castraTdBiome(B){ const rid = B && B.mission && B.mission.region; return (rid && typeof CASTRA_BIOMES!=="undefined" && CASTRA_BIOMES[rid]) || {}; }
function castraTdTreeObj(B, i){ const b = castraTdBiome(B), l = b.trees; return l && l.length ? l[i % l.length] : "tree_a"; }

// Eén tegel uit een tileset als herhaalpatroon (uitgelijnd op het tegelraster).
function castraTdPattern(ctx, key){
  const k = CASTRA_GROUND[key] || CASTRA_GROUND.sand, im = CASTRA_TS_IMG[k.s]; if(!im) return null;
  const c = document.createElement("canvas"); c.width = c.height = 48;
  c.getContext("2d").drawImage(im, k.px!=null?k.px:k.c*48, k.py!=null?k.py:k.r*48, 48, 48, 0, 0, 48, 48);
  return ctx.createPattern(c, "repeat");
}
function castraTdNoise(seed, cols, rows, cell){          // zachte waardenruis (0..1) per tegel
  const rng = castraMapRng(seed), gw = Math.ceil(cols/cell)+2, gh = Math.ceil(rows/cell)+2, grid = [];
  for(let y=0;y<gh;y++){ grid.push([]); for(let x=0;x<gw;x++) grid[y].push(rng()); }
  const sm = t=>t*t*(3-2*t);
  return (x,y)=>{ const fx = x/cell, fy = y/cell, ix = Math.floor(fx), iy = Math.floor(fy), tx = sm(fx-ix), ty = sm(fy-iy);
    const a = grid[iy][ix], b = grid[iy][ix+1], c = grid[iy+1][ix], d = grid[iy+1][ix+1]; return (a+(b-a)*tx)*(1-ty) + (c+(d-c)*tx)*ty; };
}

function castraDrawTdLayers(built, cvBelow, cvAbove, B){
  const T = 48, cols = built.cols, rows = built.rows, mp = B.mpDef || null;
  cvBelow.width = cvAbove.width = cols*T; cvBelow.height = cvAbove.height = rows*T;
  const g = cvBelow.getContext("2d"), a = cvAbove.getContext("2d");
  g.imageSmoothingEnabled = a.imageSmoothingEnabled = false;
  const draw = (ctx, t)=>{ const im = CASTRA_TS_IMG[t.s]; if(im) ctx.drawImage(im, t.sx!=null?t.sx:t.c*T, t.sy!=null?t.sy:t.r*T, T, T, t.x*T, t.y*T, T, T); };
  const seed = (B.mission && B.mission.seed) || 7, rng = castraMapRng(seed ^ 0x5bd1e995), bio = castraTdBiome(B), rid = (B.mission && B.mission.region) || "default";
  const pathCells = B.cells || {}, blocked = built.blocked || {};

  // 1. gras (en bioomvlakken)
  const patch = bio.patch ? castraTdNoise(seed+11, cols, rows, bio.patch.cell || 6) : null;
  for(let y=0;y<rows;y++) for(let x=0;x<cols;x++){
    const key = (patch && patch(x+.5,y+.5) > bio.patch.thr) ? bio.patch.g : "grass", k = CASTRA_GROUND[key] || CASTRA_GROUND.grass;
    draw(g, { s:k.s, c:k.c, r:k.r, sx:k.px, sy:k.py, x, y });
  }
  // 2. zachte vlekken licht en donker (geen harde tegelranden meer)
  const nA = castraTdNoise(seed+21, cols, rows, 3), nB = castraTdNoise(seed+37, cols, rows, 5);
  for(let y=0;y<rows;y++) for(let x=0;x<cols;x++){
    const v = nA(x+.5,y+.5)*0.6 + nB(x+.5,y+.5)*0.4, cx = x*T+T/2, cy = y*T+T/2;
    if(v > 0.62){ const gr = g.createRadialGradient(cx,cy,2,cx,cy,T*1.1); gr.addColorStop(0,"rgba(255,248,170,.16)"); gr.addColorStop(1,"rgba(255,248,170,0)"); g.fillStyle = gr; g.fillRect(cx-T*1.1,cy-T*1.1,T*2.2,T*2.2); }
    else if(v < 0.38){ const gr = g.createRadialGradient(cx,cy,2,cx,cy,T*1.1); gr.addColorStop(0,"rgba(10,50,20,.20)"); gr.addColorStop(1,"rgba(10,50,20,0)"); g.fillStyle = gr; g.fillRect(cx-T*1.1,cy-T*1.1,T*2.2,T*2.2); }
  }
  // 3. de weg: een vloeiende lijn door de waypoints (alle banen), met rand, pad in het midden en kiezels
  const lanes = (mp && mp.lanes) || (mp && [mp.path]) || [];
  const pat = castraTdPattern(g, CASTRA_TD_ROAD[rid] || CASTRA_TD_ROAD.default), pat2 = castraTdPattern(g, "sand2");
  // Begin en eind lopen door tot buiten de kaart, maar alleen langs de richting van het eerste/laatste stuk (geen schuine hoek).
  const ext = L=>{ const P = L.map(p=>[p[0]+.5, p[1]+.5]), n = P.length-1;
    const out = (i, j)=>{ const f = L[i], q = L[j];
      if(f[1]===q[1]){ if(f[0]===0 && q[0]>f[0]) P[i][0] = -0.5; else if(f[0]===cols-1 && q[0]<f[0]) P[i][0] = cols+0.5; }
      else if(f[0]===q[0]){ if(f[1]===0 && q[1]>f[1]) P[i][1] = -0.5; else if(f[1]===rows-1 && q[1]<f[1]) P[i][1] = rows+0.5; } };
    if(n>=1){ out(0,1); out(n,n-1); } return P; };
  const stroke = (w, style, alpha)=>{ g.save(); g.globalAlpha = alpha==null?1:alpha; g.lineJoin = "round"; g.lineCap = "butt"; g.lineWidth = w; g.strokeStyle = style;
    lanes.forEach(L=>{ const P = ext(L); g.beginPath(); P.forEach((p,i)=>{ if(i) g.lineTo(p[0]*T,p[1]*T); else g.moveTo(p[0]*T,p[1]*T); }); g.stroke(); }); g.restore(); };
  if(lanes.length){
    stroke(T+14, "rgba(30,50,15,.30)");                       // zachte rand in het gras
    stroke(T+6,  "rgba(70,48,18,.65)");                       // donkere boord
    if(pat) stroke(T, pat); else stroke(T, "#c9a96a");
    if(pat2) stroke(T*0.5, pat2, 0.35);                       // lichter, platgelopen midden
    // kiezels langs de kant
    for(let i=0;i<lanes.length;i++){ const P = ext(lanes[i]);
      for(let s=0; s<P.length-1; s++){ const [x0,y0] = P[s], [x1,y1] = P[s+1], len = Math.hypot(x1-x0,y1-y0), n = Math.round(len*2.4);
        for(let j=0;j<n;j++){ const t = rng(), side = rng()<.5 ? -1 : 1, off = (T/2-3)*side + (rng()-.5)*6, px = (x0+(x1-x0)*t)*T, py = (y0+(y1-y0)*t)*T;
          const vx = x1===x0 ? off : 0, vy = y1===y0 ? off : 0; g.fillStyle = rng()<.5 ? "rgba(90,70,40,.55)" : "rgba(205,190,150,.6)"; g.beginPath(); g.ellipse(px+vx, py+vy, 1.5+rng()*2, 1+rng()*1.6, rng()*3, 0, 7); g.fill(); } } }
  }
  // 4. kleine versieringen op vrije cellen (niet-blokkerend)
  const decor = (bio.decor || CASTRA_TD_DECOR).filter(o=>CASTRA_OBJ[o] && CASTRA_OBJ[o].solid==="none"), p = bio.decorP || 0.10;
  const near = (x,y)=>{ for(let dy=-1;dy<=1;dy++) for(let dx=-1;dx<=1;dx++) if(pathCells[(x+dx)+","+(y+dy)]) return true; return false; };
  if(decor.length) for(let y=0;y<rows;y++) for(let x=0;x<cols;x++){
    const k = x+","+y; if(pathCells[k] || blocked[k] || (B.blockedTrees && B.blockedTrees[k])) continue;
    if(rng() > p * (near(x,y) ? 0.5 : 1.3)) continue;
    const o = decor[Math.floor(rng()*decor.length)], O = CASTRA_OBJ[o]; draw(g, { s:O.s, c:O.c, r:O.r, x, y });
  }
  // 5. objecten (bomen enz.) en hun bovenrijen
  built.below.forEach(t=>draw(g,t));
  built.above.forEach(t=>draw(a,t));
  // 6. zachte schaduw langs de rand van de kaart
  const W = cols*T, H = rows*T, vg = a.createRadialGradient(W/2,H/2,Math.min(W,H)*0.45,W/2,H/2,Math.max(W,H)*0.78);
  vg.addColorStop(0,"rgba(0,0,0,0)"); vg.addColorStop(1,"rgba(10,20,5,.22)"); a.fillStyle = vg; a.fillRect(0,0,W,H);
}
