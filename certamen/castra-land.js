/* ============================================================================
   CASTRA HEROUM — KRONKELENDE PADEN, MEERTJES EN BOSSEN (in plaats van een recht kruis van wegen)
   ----------------------------------------------------------------------------
   Gerben: "alle landen zijn doorkruist met een rechte weg van noord naar zuid en oost naar west. Voor de Romeinse provincies is dat prima
   (zij hadden rechte wegen), maar voor de rest wil ik meer variatie." Dus: Latium, Roma en Gallia houden hun rechte wegen (CASTRA_LAND_ROMAN);
   de andere landen krijgen
     - een weg die door de kaart kronkelt (een gladde bocht door ankerpunten) in plaats van de rechte kruising. Overal waar iets aan de weg
       hangt (de poorten in de heggen, de trainers, de tenten met deuren, de reisplek, de brug over de rivier) loopt hij er gewoon langs:
       die plekken zijn de ankers; tussen de ankers beweegt de weg;
     - meertjes (met de oever van RPG Maker: de vijver-autotile uit Outside_A1, met binnenhoeken) en, in de woestijn, oases;
     - bossen: bomen op een rooster met vrije gangen ertussen, zodat ze nooit een pad dichtzetten.
   Alles wordt bij het laden berekend uit de kaartgegevens en een seed (dus voor iedereen dezelfde kaart) en weigert plekken waar iets staat:
   personen, kisten, deuren, uitgangen, de reisplek, de start, plateaus en bestaand water. Past het niet, dan probeert hij een andere seed;
   lukt het nooit, dan blijft de oude rechte weg staan. De wereldtest bewaakt dat alles bereikbaar blijft.
   Laadt NA castra-terras.js en voor castra-fx.js.
   ============================================================================ */
const CASTRA_LAND_ROMAN = { latium:1, roma:1, gallia:1 };
const CASTRA_LAND = {
  graecia:    { seed:101, lakes:3, woods:2, amp:5 },
  laconia:    { seed:102, lakes:2, woods:2, amp:4 },
  troia:      { seed:103, lakes:3, woods:2, amp:5 },
  themiscyra: { seed:104, lakes:3, woods:4, amp:5 },
  persis:     { seed:105, lakes:1, woods:1, amp:5 },
  aegyptus:   { seed:106, lakes:2, woods:2, amp:4 },
  africa:     { seed:107, lakes:2, woods:2, amp:4 },
  germania:   { seed:108, lakes:4, woods:5, amp:5 },
};
const CASTRA_LAND_PLAN = {};
const castraLandCR = (p0,p1,p2,p3,t)=>0.5*((2*p1)+(-p0+p2)*t+(2*p0-5*p1+4*p2-p3)*t*t+(-p0+3*p1-3*p2+p3)*t*t*t);

/* ---------- natuurlijke afsluitingen in plaats van een rechte rij bomen ----------
   De poorten in de heggen (castra-field.js) stonden in een kaarsrechte rij bomen over de hele breedte. Nu loopt de afsluiting als een
   kronkelend lint door het land: een bosrand van wisselende dikte, of een smalle doorgang tussen twee meertjes (aan weerszijden van de opening
   een meer, daarbuiten bos). De opening blijft precies waar de versperring staat: één tegel breed, met een korte rechte gang. De lijn is
   overal aaneengesloten (kolom na kolom hooguit één rij verschil), dus niemand loopt eromheen. Lukt het niet, dan blijft de oude rechte heg. */
const CASTRA_BARRIER_PLAN = {};
function castraBarrierHas(rid){ return !!castraBarrierPlan(rid); }
function castraBarrierSolid(rid, chestMargin){
  const W = CASTRA_WORLDS[rid], cols = W.cols, rows = W.rows, g = Array.from({ length:rows }, ()=>new Uint8Array(cols));
  const mark = (x,y,r)=>{ for(let dy=-r;dy<=r;dy++) for(let dx=-r;dx<=r;dx++){ const xx = x+dx, yy = y+dy; if(xx>=0&&yy>=0&&xx<cols&&yy<rows) g[yy][xx] = 1; } };
  const ents = CASTRA_WENT.filter(e=>e.region===rid && e.kind!=="block" && !(e.kind==="veld" && e.gate));
  ents.forEach(e=>mark(e.x,e.y,chestMargin && e.kind==="chest" ? 1 : 0));          // een kist krijgt (eerst) een tegel marge: hij zit dan nooit tussen de lijn en iets anders opgesloten
  ents.filter(e=>e.kind==="trainer").forEach(e=>{ const dx = e.x < cols/2 ? 1 : -1; for(let i=0;i<=4;i++) mark(e.x+dx*i, e.y, 0); });          // de zichtlijn van een trainer
  Object.keys(CASTRA_NPCS).filter(h=>CASTRA_NPCS[h].region===rid).forEach(h=>mark(CASTRA_NPCS[h].world.x, CASTRA_NPCS[h].world.y, 0));
  (W.doors||[]).forEach(d=>mark(d.x,d.y,1)); (W.exit||[]).forEach(e=>mark(e.x,e.y,1)); mark(W.start.x, W.start.y, 1);
  const R0 = CASTRA_GEO[rid] && CASTRA_GEO[rid].row; if(R0!==undefined) for(let y=R0-1;y<=R0+2;y++) for(let x=0;x<cols;x++) if(g[y]) g[y][x] = 1;          // de oost-westweg blijft vrij
  const P = typeof castraTerraPlan==="function" ? castraTerraPlan(rid) : null;
  if(P) [P.plateau, P.face].forEach(set=>Object.keys(set).forEach(k=>{ const [x,y] = k.split(",").map(Number); mark(x,y,2); }));          // ruime marge: tussen de lijn en een plateau blijft nooit een dichtgeknepen zakje over
  const BG = typeof CASTRA_BERG!=="undefined" && CASTRA_BERG[rid];
  if(BG){ for(let y=BG.y-1;y<=BG.y+BG.h;y++) for(let x=BG.x-1;x<=BG.x+BG.w;x++) if(g[y] && g[y][x]!==undefined && !g[y][x]) g[y][x] = 2; }          // aan de voet van de ASCII-berg mag de bosrand doorlopen (zoals de oude heg), een meer niet
  (W.water||[]).forEach(wt=>{ for(let y=0;y<rows;y++) for(let x=Math.max(0,wt.x0-2);x<=Math.min(cols-1,wt.x1+2);x++) if(!g[y][x]) g[y][x] = 2; });          // 2 = water: een bosrand mag erdoorheen (het is er toch dicht), een meer niet
  return g;
}
function castraBarrierPlan(rid){
  if(CASTRA_BARRIER_PLAN[rid]!==undefined) return CASTRA_BARRIER_PLAN[rid];
  const W = CASTRA_WORLDS[rid], gates = (typeof CASTRA_FGATES!=="undefined" && CASTRA_FGATES[rid]) || [];
  if(!W || W.interior || !gates.length) return CASTRA_BARRIER_PLAN[rid] = null;
  const cols = W.cols, rows = W.rows, strict = castraBarrierSolid(rid, true), loose = castraBarrierSolid(rid, false), out = { gates:[] };
  let seedBase = 0; for(const ch of rid) seedBase = (seedBase*31+ch.charCodeAt(0))>>>0;
  for(let gi=0; gi<gates.length; gi++){
    const g = gates[gi]; let got = null;
    for(let t=0;t<200 && !got;t++){
      const solid = t<100 ? strict : loose;          // lukt het met kistenmarge niet, dan zonder
      const rng = castraMapRng(seedBase*13+gi*977+t*131), off = {}, variant = (gi+Math.floor((t%100)/50))%2===0 ? "meren" : "bos", amp = Math.max(2, (variant==="meren" ? 3 : 4)-Math.floor((t%50)/17));
      const per = 17+Math.floor(rng()*14), ph = rng()*Math.PI*2, a2 = rng()*0.6;          // een deining met een tweede, kortere golf eroverheen
      off[g.x] = 0;
      const lw = 4+Math.floor(rng()*3), rw = 4+Math.floor(rng()*3);
      const free = (x,o,ext)=>{ const y = g.y+o; if(!(y>=3 && y<rows-3 && solid[y][x]!==1 && (o===0 || solid[g.y][x]!==2))) return false; if(ext && strict[y][x]===1) return false;
        if(variant==="meren" && x!==g.x && x>=g.x-lw && x<=g.x+rw) for(let dy=-1;dy<=1;dy++) if(strict[y+dy][x]) return false;          // waar het meer komt, moet er ruimte voor zijn (ook de marge rond kisten)
        return true; };          // in een berg of water blijft de lijn recht (zoals de oude heg)
      let dead = false;
      const walk = (x0, step, stop)=>{ for(let x=x0; x!==stop; x+=step){ const prev = off[x-step], d = Math.abs(x-g.x), ramp = Math.max(0, Math.min(1, (d-3)/5));
          const target = Math.round(ramp*amp*(Math.sin(d/per*Math.PI*2+ph)*(1-a2) + Math.sin(d/(per*0.37)+ph*2)*a2)), want = target>prev ? 1 : target<prev ? -1 : 0;
          const order = [prev+want, prev, prev-1, prev+1].filter(o=>Math.abs(o)<=amp && (d>3 || o===0));
          const pick = order.find(o=>free(x,o)); if(pick===undefined){ dead = true; return; } off[x] = pick; } };
      walk(g.x+1, 1, cols-1); walk(g.x-1, -1, 0); if(dead) continue;
      const cells = [], lake = {};
      let th = 0; for(let x=1;x<=cols-2;x++){ if(x===g.x) continue; const y = g.y+off[x]; cells.push([x,y]); const r = rng(); th = Math.max(0, Math.min(2, th+(r<0.25 ? -1 : r<0.5 ? 1 : 0))); if(variant==="bos" && Math.abs(x-g.x)>1) for(let k=1;k<=th;k++) if(free(x, off[x]+k, true)) cells.push([x,y+k]); else break; }
      if(variant==="meren") for(let x=g.x-lw; x<=g.x+rw; x++){ if(x===g.x || x<2 || x>cols-3) continue; for(let dy=-1;dy<=1;dy++) lake[x+","+(g.y+off[x]+dy)] = 1; }
      const all = cells.concat(Object.keys(lake).map(k=>k.split(",").map(Number)));
      if(cells.every(([x,y])=>y>=3 && y<rows-3 && solid[y][x]!==1) && Object.keys(lake).every(k=>{ const [x,y] = k.split(",").map(Number); return y>=3 && y<rows-3 && !strict[y][x]; })) got = { g, cells, lake, variant };
    }
    if(!got) return CASTRA_BARRIER_PLAN[rid] = null;        // lukt het niet, dan blijft de oude rechte heg staan
    out.gates.push(got);
  }
  return CASTRA_BARRIER_PLAN[rid] = out;
}
function castraBarrierApply(def, rid){
  const plan = castraBarrierPlan(rid); if(!plan) return def;
  const W = castraWorldCfg(), tt = (W.trees||["tree_a"]).filter(t=>CASTRA_OBJ[t]), all = {}, lake = {};
  plan.gates.forEach(b=>{ b.cells.forEach(([x,y])=>all[x+","+y] = 1); Object.keys(b.lake).forEach(k=>{ lake[k] = 1; all[k] = 1; }); });
  def.pieces = def.pieces.filter(p=>{ if(p.noSolid) return true; const O = CASTRA_OBJ[p.o], w = O?O.w:1, h = O?O.h:1; for(let dy=0;dy<h;dy++) for(let dx=0;dx<w;dx++) if(all[(p.x+dx)+","+(p.y+dy)]) return false; return true; });
  def.tall = def.tall || {}; Object.keys(def.tall).forEach(k=>{ if(all[k]) delete def.tall[k]; });
  const have = {}; def.walls.forEach(w=>have[w[0]+","+w[1]] = 1);
  Object.keys(all).forEach(k=>{ if(!have[k]){ const [x,y] = k.split(",").map(Number); def.walls.push([x,y]); } });
  plan.gates.forEach((b,gi)=>b.cells.forEach(([x,y])=>{ if(lake[x+","+y]) return; const r = castraMapRng(x*7919+y*104729+gi)(); def.pieces.push({ o:tt[Math.floor(r*tt.length)%tt.length], x, y:y-1, noSolid:true }); }));
  def.lakeCells = Object.assign(def.lakeCells||{}, lake); def.lakeSand = !(W.base==="grass");
  return def;
}

/* ---------- hulp: een raster met verboden cellen ---------- */
function castraLandForbid(rid){
  const W = CASTRA_WORLDS[rid], cols = W.cols, rows = W.rows, g = Array.from({ length:rows }, ()=>new Uint8Array(cols));
  const mark = (x,y,r,v)=>{ for(let dy=-r;dy<=r;dy++) for(let dx=-r;dx<=r;dx++){ const xx = x+dx, yy = y+dy; if(xx>=0&&yy>=0&&xx<cols&&yy<rows) g[yy][xx] = Math.max(g[yy][xx], v); } };
  const ents = CASTRA_WENT.filter(e=>e.region===rid && e.kind!=="block" && !(e.kind==="veld" && e.gate));
  ents.forEach(e=>mark(e.x,e.y,0,3));                                                       // 3 = hier staat iets: nooit overheen
  Object.keys(CASTRA_NPCS).filter(h=>CASTRA_NPCS[h].region===rid).forEach(h=>mark(CASTRA_NPCS[h].world.x, CASTRA_NPCS[h].world.y, 0, 3));
  (W.doors||[]).forEach(d=>mark(d.x,d.y,0,3)); (W.exit||[]).forEach(e=>mark(e.x,e.y,0,3)); mark(W.start.x, W.start.y, 0, 3);
  const P = typeof castraTerraPlan==="function" ? castraTerraPlan(rid) : null;
  if(P){ [P.plateau, P.face].forEach(set=>Object.keys(set).forEach(k=>{ const [x,y] = k.split(",").map(Number); g[y][x] = 3; })); }
  const BG = typeof CASTRA_BERG!=="undefined" && CASTRA_BERG[rid];
  if(BG){ for(let y=BG.y-1;y<=BG.y+BG.h;y++) for(let x=BG.x-1;x<=BG.x+BG.w;x++) if(g[y] && g[y][x]!==undefined) g[y][x] = 3; }       // de ASCII-berg (castra-berg.js) blijft zoals hij is
  (W.water||[]).forEach(wt=>{ for(let y=0;y<rows;y++) for(let x=Math.max(0,wt.x0-1);x<=Math.min(cols-1,wt.x1+1);x++) g[y][x] = 3; });
  for(let y=0;y<rows;y++) for(let x=0;x<cols;x++) if(x<2||y<2||x>=cols-2||y>=rows-2) g[y][x] = 3;
  // de zichtlijn van een trainer (vier tegels richting het midden) blijft vrij van meren en bossen; het pad mag er wel doorheen
  ents.filter(e=>e.kind==="trainer").forEach(e=>{ const dx = e.x < cols/2 ? 1 : -1; for(let i=1;i<=4;i++){ const x = e.x+dx*i; if(x>=0 && x<cols && g[e.y][x]<2) g[e.y][x] = 2; } });
  const gates = (typeof CASTRA_FGATES!=="undefined" && CASTRA_FGATES[rid]) || [];
  const bp = castraBarrierPlan(rid);
  if(bp){ bp.gates.forEach(b=>{          // de afsluiting: de boomcellen met hun kruin (één rij erboven), de meren met een rand eromheen; de opening zelf blijft vrij
      b.cells.forEach(([x,y])=>{ if(x!==b.g.x) for(let dy=-1;dy<=0;dy++) if(g[y+dy]) g[y+dy][x] = 3; });
      Object.keys(b.lake).forEach(k=>{ const [x,y] = k.split(",").map(Number); for(let dy=-1;dy<=1;dy++) for(let dx=-1;dx<=1;dx++) if(g[y+dy] && g[y+dy][x+dx]!==undefined && x+dx!==b.g.x) g[y+dy][x+dx] = 3; }); }); }
  else gates.forEach(gt=>{ for(let x=0;x<cols;x++){ for(let dy=-1;dy<=0;dy++) if(g[gt.y+dy] && x!==gt.x) g[gt.y+dy][x] = 3; } });          // de heg (twee rijen) laat alleen de opening vrij
  return { g, ents, mark, gates, cols, rows };
}
// een gebied vrijhouden rond dingen: plekken waar je een meer of bos niet wilt (marge r)
function castraLandClear(F, cells, r){ return cells.every(([x,y])=>{ for(let dy=-r;dy<=r;dy++) for(let dx=-r;dx<=r;dx++){ const xx = x+dx, yy = y+dy; if(xx<0||yy<0||xx>=F.cols||yy>=F.rows) return false; if(F.g[yy][xx]) return false; } return true; }); }

/* ---------- de weg: een gladde bocht door ankerpunten ---------- */
function castraLandPathCells(points, seed, amp, axis){            // axis "y": loopt van onder naar boven (x kronkelt); axis "x": van links naar rechts (y kronkelt)
  const rng = castraMapRng(seed), pts = [];
  for(let i=0;i<points.length;i++){
    pts.push(points[i]);
    if(i+1<points.length){ const a = points[i], b = points[i+1], gap = axis==="y" ? Math.abs(a[1]-b[1]) : Math.abs(a[0]-b[0]);
      const n = gap>=14 ? 2 : gap>=6 ? 1 : 0;
      for(let j=1;j<=n;j++){ const t = j/(n+1), off = Math.round((rng()*0.6+0.4)*amp)*((rng()<0.5)?-1:1);
        pts.push(axis==="y" ? [Math.round(a[0]+(b[0]-a[0])*t)+off, Math.round(a[1]+(b[1]-a[1])*t)] : [Math.round(a[0]+(b[0]-a[0])*t), Math.round(a[1]+(b[1]-a[1])*t)+off]); } } }
  const P = [pts[0]].concat(pts, [pts[pts.length-1]]), cells = new Set(), add = (x,y)=>{ x = Math.round(x); y = Math.round(y); [[0,0],[1,0],[0,1],[1,1]].forEach(([dx,dy])=>cells.add((x+dx)+","+(y+dy))); };
  let last = null; const line = [];
  for(let i=1;i<P.length-2;i++) for(let s=0;s<=12;s++){ const t = s/12, x = castraLandCR(P[i-1][0],P[i][0],P[i+1][0],P[i+2][0],t), y = castraLandCR(P[i-1][1],P[i][1],P[i+1][1],P[i+2][1],t); line.push([x,y]);
    if(last){ const n = Math.max(Math.abs(x-last[0]), Math.abs(y-last[1]))*2|0; for(let k=0;k<=n;k++) add(last[0]+(x-last[0])*k/Math.max(1,n), last[1]+(y-last[1])*k/Math.max(1,n)); } else add(x,y); last = [x,y]; }
  return { cells, line };
}
function castraLandAnchors(rid){
  const W = CASTRA_WORLDS[rid], cx = (W.cols>>1)-1, G = CASTRA_GEO[rid], R = G.row, gates = (typeof CASTRA_FGATES!=="undefined" && CASTRA_FGATES[rid]) || [];
  // noord-zuid: de start, de reisplek, de rijen van de trainers, de poorten in de heggen (met twee rijen recht ervoor en erna) en de noordpoort
  const ns = [[cx, W.rows-2], [cx, W.start.y-2]];
  CASTRA_WENT.filter(e=>e.region===rid && e.kind==="trainer").forEach(e=>ns.push([cx, e.y]));
  CASTRA_WENT.filter(e=>e.region===rid && (e.id==="venator_"+rid || e.role==="mercator" || e.kind==="hub")).forEach(e=>ns.push([cx, e.y]));
  gates.forEach(gt=>{ ns.push([cx, gt.y-2], [cx, gt.y], [cx, gt.y+2]); });
  ns.push([cx, 1]);
  const nsU = [], seen = {}; ns.sort((a,b)=>b[1]-a[1]).forEach(p=>{ if(!seen[p[1]]){ seen[p[1]] = 1; nsU.push(p); } });
  // oost-west: de brug links (rijen R en R+1), de deuren (hun rij), de kruising en het einde rechts
  const ew = [[2,R],[6,R],[cx,R],[W.cols-3,R]];
  (W.doors||[]).forEach(d=>{ if(Math.abs(d.y-R)<=2) ew.push([d.x, R]); });
  const ewU = [], seenX = {}; ew.sort((a,b)=>a[0]-b[0]).forEach(p=>{ if(!seenX[p[0]]){ seenX[p[0]] = 1; ewU.push(p); } });
  return { ns:nsU, ew:ewU, R, cx };
}
function castraLandMakePath(rid, F, cfg){
  const A = castraLandAnchors(rid), W = CASTRA_WORLDS[rid], out = {};
  const valid = (cells, anchors)=>{ let bad = 0; cells.forEach(k=>{ const [x,y] = k.split(",").map(Number); if(x<1||y<0||x>=W.cols-1||y>=W.rows || (F.g[y] && F.g[y][x]===3 && !anchors.has(k))) bad++; }); return bad===0; };
  const keepAround = pts=>{ const s = new Set(); pts.forEach(([x,y])=>{ for(let dy=-1;dy<=2;dy++) for(let dx=-1;dx<=2;dx++) s.add((x+dx)+","+(y+dy)); }); return s; };
  for(const [name, pts, axis] of [["ns", A.ns, "y"], ["ew", A.ew, "x"]]){
    const anch = keepAround(pts); let got = null;
    for(let t=0;t<100 && !got;t++){ const r = castraLandPathCells(pts, cfg.seed*31+t*7+(name==="ew"?5:0), Math.max(1, cfg.amp-Math.floor(t/14)), axis); if(valid(r.cells, anch)) got = r; }
    out[name] = got;
  }
  return out;
}

/* ---------- het plan voor een land ---------- */
function castraLandPlan(rid){
  if(CASTRA_LAND_PLAN[rid]!==undefined) return CASTRA_LAND_PLAN[rid];
  const cfg = CASTRA_LAND[rid], W = CASTRA_WORLDS[rid]; if(!cfg || !W) return CASTRA_LAND_PLAN[rid] = null;
  const rng = castraMapRng(cfg.seed), F = castraLandForbid(rid), plan = { path:{}, lines:[], lakes:[], woods:[], pathOk:{ ns:false, ew:false } };
  const P = castraLandMakePath(rid, F, cfg);
  ["ns","ew"].forEach(n=>{ if(P[n]){ plan.pathOk[n] = true; P[n].cells.forEach(k=>plan.path[k] = 1); plan.lines.push(P[n].line); } });
  // het pad zelf houdt een rand vrij voor meren en bossen
  Object.keys(plan.path).forEach(k=>{ const [x,y] = k.split(",").map(Number); F.mark(x, y, 1, 2); });
  const baseSand = !(W.base==="grass");
  // meertjes
  for(let n=0;n<cfg.lakes;n++){ let got = null;
    for(let t=0;t<250 && !got;t++){
      const rx = 3+Math.floor(rng()*3), ry = 2+Math.floor(rng()*2), cx = 4+Math.floor(rng()*(W.cols-8)), cy = 4+Math.floor(rng()*(W.rows-8)), cells = [];
      for(let y=cy-ry-1;y<=cy+ry+1;y++) for(let x=cx-rx-1;x<=cx+rx+1;x++){ const dx = (x-cx)/(rx+0.4), dy = (y-cy)/(ry+0.4), wob = 0.78+rng()*0.34; if(dx*dx+dy*dy <= wob) cells.push([x,y]); }
      if(cells.length>=12 && castraLandClear(F, cells, 1)) got = cells; }
    if(got){ const set = {}; got.forEach(([x,y])=>{ set[x+","+y] = 1; F.mark(x,y,3,3); }); plan.lakes.push({ cells:set, sand:baseSand }); } }
  // bossen: bomen op een rooster met vrije gangen (een boom is alleen onderaan solide)
  const treeTypes = (W.trees||["tree_a"]).filter(t=>CASTRA_OBJ[t]);
  for(let n=0;n<cfg.woods;n++){ let best = null;
    for(let t=0;t<120;t++){
      const rx = 5+Math.floor(rng()*5), ry = 4+Math.floor(rng()*3), cx = 5+Math.floor(rng()*(W.cols-10)), cy = 5+Math.floor(rng()*(W.rows-10)), cells = [], ox = Math.floor(rng()*2), oy = Math.floor(rng()*2);
      for(let y=cy-ry;y<=cy+ry;y++) for(let x=cx-rx;x<=cx+rx;x++){ const dx = (x-cx)/(rx+0.5), dy = (y-cy)/(ry+0.5); if(dx*dx+dy*dy <= 1) cells.push([x,y]); }
      const free = cells.filter(([x,y])=>x>=0&&y>=0&&x<W.cols&&y+1<W.rows&&!F.g[y][x]);       // een bos mag om dingen heen groeien: de bezette cellen blijven gewoon leeg
      if(free.length>=24 && (!best || free.length>best.free.length)) best = { cells, free, ox, oy }; }
    if(best){ const trees = []; best.free.forEach(([x,y])=>{ if((x+best.ox)%2===0 && (y+best.oy)%2===0 && rng()<0.9 && !F.g[y+1][x]) trees.push({ o:treeTypes[Math.floor(rng()*treeTypes.length)], x, y }); });
      best.free.forEach(([x,y])=>F.mark(x,y,0,3)); plan.woods.push({ cells:best.free, trees }); } }
  return CASTRA_LAND_PLAN[rid] = plan;
}

/* ---------- de rechte wegen vervangen door de bochtige ---------- */
(function(){
  Object.keys(CASTRA_LAND).forEach(rid=>{
    const W = CASTRA_WORLDS[rid]; if(!W || CASTRA_LAND_ROMAN[rid]) return;
    const plan = castraLandPlan(rid); if(!plan) return;
    // de oorspronkelijke rechte stukken blijven alleen staan als het bochtige pad niet lukte
    const keep = (W.roads||[]).filter(r=>{ const vertical = r.y1-r.y0 > r.x1-r.x0; return vertical ? !plan.pathOk.ns : !plan.pathOk.ew; });
    const rows = {}; Object.keys(plan.path).forEach(k=>{ const [x,y] = k.split(",").map(Number); (rows[y] = rows[y] || []).push(x); });
    const rects = []; Object.keys(rows).forEach(y=>{ const xs = rows[y].sort((a,b)=>a-b); let s = xs[0], p = xs[0]; for(let i=1;i<=xs.length;i++){ if(i<xs.length && xs[i]===p+1){ p = xs[i]; continue; } rects.push({ x0:s, y0:+y, x1:p, y1:+y }); s = xs[i]; p = xs[i]; } });
    W.roadsOld = W.roads; W.roads = keep.concat(rects);
    // de wagen op de hoofdweg: het langste rechte stuk van de oost-westweg
    const run = {}; rects.forEach(r=>{ const len = r.x1-r.x0+1; if(len>=22 && (!run.r || len>run.len)){ run.r = r; run.len = len; } }); if(run.r) W.cartRoad = { x0:run.r.x0, x1:run.r.x1, y0:run.r.y0, y1:run.r.y0 };
  });
})();

/* ---------- op de kaart zetten ---------- */
function castraLandApply(def, rid){
  const plan = castraLandPlan(rid); if(!plan) return def;
  const W = castraWorldCfg(), lakeCells = {}; plan.lakes.forEach(l=>Object.keys(l.cells).forEach(k=>lakeCells[k] = l));
  const treeCells = {}; plan.woods.forEach(wd=>wd.trees.forEach(t=>{ const O = CASTRA_OBJ[t.o]; for(let dy=0;dy<O.h;dy++) for(let dx=0;dx<O.w;dx++) treeCells[(t.x+dx)+","+(t.y+dy)] = 1; }));
  // de zichtlijn van een trainer blijft vrij van toevallige bomen en decor (de verdeling van het decor verschuift als de weg verandert)
  const sight = {}; CASTRA_WENT.filter(e=>e.region===rid && e.kind==="trainer").forEach(e=>{ const dx = e.x < W.cols/2 ? 1 : -1; for(let i=1;i<=4;i++) sight[(e.x+dx*i)+","+e.y] = 1; });
  const wiped = k=>lakeCells[k] || treeCells[k] || sight[k];
  def.pieces = def.pieces.filter(p=>{ const O = CASTRA_OBJ[p.o], w = O?O.w:1, h = O?O.h:1; if(p.noSolid) return true;
    for(let dy=0;dy<h;dy++) for(let dx=0;dx<w;dx++) if(wiped((p.x+dx)+","+(p.y+dy))) return false; return true; });
  def.tall = def.tall || {}; Object.keys(def.tall).forEach(k=>{ if(wiped(k)) delete def.tall[k]; });
  Object.keys(lakeCells).forEach(k=>{ const [x,y] = k.split(",").map(Number); if(def.ground[y] && def.ground[y][x]!==undefined){ def.walls.push([x,y]); } });
  plan.woods.forEach(wd=>wd.trees.forEach(t=>def.pieces.push({ o:t.o, x:t.x, y:t.y })));
  // het pad: de basisgrond eronder (geen kasseien), het spoor zelf tekenen we in castraDrawMapLayers als een zachte aarden baan
  Object.keys(plan.path).forEach(k=>{ const [x,y] = k.split(",").map(Number); if(def.ground[y] && def.ground[y][x]===W.road && W.road!=="plank") def.ground[y][x] = W.base; });
  def.landPath = plan.path; def.landLines = plan.lines;
  def.lakeCells = Object.assign(def.lakeCells||{}, lakeCells); def.lakeSand = plan.lakes.length ? plan.lakes[0].sand : (def.lakeSand||false);
  return def;
}
const _castraWorldDefLand0 = castraWorldDef;
castraWorldDef = function(){ let d = _castraWorldDefLand0.apply(this, arguments); const W = castraWorldCfg(); if(W.interior) return d; d = castraBarrierApply(d, W.id); return (!CASTRA_LAND[W.id] || CASTRA_LAND_ROMAN[W.id]) ? d : castraLandApply(d, W.id); };

/* ---------- het spoor: een vereniging van ronde vlekken, dus met zachte randen en bochten ---------- */
function castraDrawTrack(g, lines, T){
  const t = document.createElement("canvas"); t.width = g.canvas.width; t.height = g.canvas.height; const c = t.getContext("2d");
  c.lineCap = "round"; c.lineJoin = "round";
  const stroke = (w, col)=>{ c.strokeStyle = col; c.lineWidth = w; lines.forEach(L=>{ c.beginPath(); L.forEach(([x,y],i)=>{ const px = (x+1)*T, py = (y+1)*T; if(i) c.lineTo(px, py); else c.moveTo(px, py); }); c.stroke(); }); };
  stroke(T*2.0, "#7a5a30");      // rand
  stroke(T*1.82, "#cdaa6a");     // baan
  stroke(T*1.1, "#d6b676");      // lichtere middenstrook
  g.save(); g.globalAlpha = 0.84; g.drawImage(t, 0, 0); g.restore();                    // één keer samen: geen naden en geen opgetelde randen
}
/* ---------- de meertjes tekenen (de vijver-autotile uit Outside_A1: gras op rij 0-2, zand op rij 6-8) ---------- */
const _castraDrawMapLayersLand0 = castraDrawMapLayers;
castraDrawMapLayers = function(built, cvBelow, cvAbove){
  _castraDrawMapLayersLand0.apply(this, arguments);
  const def = built && built.def; if(def && def.landLines) castraDrawTrack(cvBelow.getContext("2d"), def.landLines, 48);
  const A1 = typeof CASTRA_TS_IMG!=="undefined" && CASTRA_TS_IMG.A1; if(!def || !def.lakeCells || !A1) return;
  const T = 48, g = cvBelow.getContext("2d"), by = (def.lakeSand ? 6 : 0)*T, LK = def.lakeCells, mem = (x,y)=>!!LK[x+","+y];
  Object.keys(LK).forEach(k=>{ const [x,y] = k.split(",").map(Number);
    const q = castraPlateauQuarters(!mem(x-1,y), !mem(x+1,y), !mem(x,y-1), !mem(x,y+1), !mem(x-1,y-1), !mem(x+1,y-1), !mem(x-1,y+1), !mem(x+1,y+1));
    [[0,0],[24,0],[0,24],[24,24]].forEach(([ox,oy],i)=>g.drawImage(A1, q[i][0]*24, by+q[i][1]*24, 24, 24, x*T+ox, y*T+oy, 24, 24)); });
};
// meertjes tellen mee als water (vissen, rimpels)
const _castraIsWaterLand0 = castraIsWater;
castraIsWater = function(rid, x, y){
  if(_castraIsWaterLand0(rid, x, y)) return true;
  const bp = CASTRA_BARRIER_PLAN[rid]; if(bp && bp.gates.some(b=>!!b.lake[x+","+y])) return true;
  const plan = CASTRA_LAND_PLAN[rid]; if(!plan) return false; return plan.lakes.some(l=>!!l.cells[x+","+y]);
};
