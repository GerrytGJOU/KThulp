/* Test van de terrassen (castra-terras.js) en het landschap (castra-land.js): trappen, bochtige paden, meertjes, bossen en de autotile-keuze.
   node tools/castra-land-test.js   (vanuit certamen/; exitcode 1 bij fouten) */
const { load } = require("./castra-colo-node.js"), vm = require("vm");
const w = load({ H(){} }); if(w.errs.length){ console.error(w.errs); process.exit(1); }
const run = s => vm.runInContext(s, w.ctx), J = x => JSON.stringify(x), R = s => JSON.parse(J(run(s)));
let fails = 0, checks = 0; const ok = (c, m)=>{ checks++; if(!c){ fails++; console.log("  FOUT  " + m); } };
run("CASTRA = castraNewState(); CASTRA.dev = true; CASTRA.pxp = castraPxpFor(99);");
const LANDS = R("Object.keys(CASTRA_LAND)"), ROMAN = ["latium","roma","gallia"];

console.log("1. autotile: welk kwartje bij welke buren");
{ const q = (a,b,c,d,e,f,g,h)=>R(`castraPlateauQuarters(${a},${b},${c},${d},${e||false},${f||false},${g||false},${h||false})`);
  ok(J(q(false,false,false,false))===J([[1,3],[2,3],[1,4],[2,4]]), "binnenin: de middelste kwartjes");
  ok(J(q(true,false,true,false))===J([[0,2],[1,2],[0,3],[1,3]]), "linksboven: de hoek");
  ok(J(q(false,true,false,true))===J([[2,4],[3,4],[2,5],[3,5]]), "rechtsonder: de hoek");
  ok(J(q(false,false,false,true))===J([[1,4],[2,4],[1,5],[2,5]]), "onderrand");
  ok(J(q(true,true,true,true))===J([[0,2],[3,2],[0,5],[3,5]]), "een los blokje: alle vier de randen");
  ok(R("castraPlateauQuarters(false,false,false,false,true,false,false,false)")[0].join()==="2,0", "binnenhoek linksboven gebruikt kwartje (2,0)");
  ok(R("castraPlateauQuarters(false,false,false,false,false,true,false,false)")[1].join()==="3,0", "binnenhoek rechtsboven (3,0)");
  ok(R("castraPlateauQuarters(false,false,false,false,false,false,true,false)")[2].join()==="2,1" && R("castraPlateauQuarters(false,false,false,false,false,false,false,true)")[3].join()==="3,1", "binnenhoeken onder (2,1) en (3,1)");
  ok(R("castraPlateauQuarters(true,false,false,false,true,false,false,false)")[0].join()==="0,3", "een binnenhoek telt niet als er al een rand is"); }

console.log("2. terrassen en trappen (Laconia)");
{ const P = R("(function(){ const p = castraTerraPlan('laconia'); return { faceN:Object.keys(p.face).length, stairs:Object.keys(p.stairs), walk:Object.keys(p.walk).length, rim:Object.keys(p.rim).length, plateau:Object.keys(p.plateau).length }; })()");
  ok(P.stairs.length>=6 && P.walk>200 && P.rim>40 && P.faceN>40, "plan: "+P.stairs.length+" trappen, "+P.walk+" begaanbare, "+P.rim+" rand, "+P.faceN+" wand");
  P.stairs.forEach(k=>{ const [x,y] = k.split(",").map(Number); const above = run(`castraTerraSolid("laconia", ${x}, ${y-1})`), below = run(`castraTerraSolid("laconia", ${x}, ${y+1})`);
    ok(!above && !below, "trap "+k+" heeft vrij terrein erboven en eronder"); ok(R(`castraTerraPlan("laconia").face[${J(k)}]>0`), "trap "+k+" ligt in een wand"); });
  // niets begaanbaars buiten via de zijkant: een rand is solide
  const rim = R("Object.keys(castraTerraPlan('laconia').rim)"); ok(rim.every(k=>{ const [x,y] = k.split(",").map(Number); return run(`castraTerraSolid("laconia", ${x}, ${y})`); }), "alle randcellen zijn solide");
  // verhuisde objecten
  const moved = R("CASTRA_TERRA_MOVED.laconia"); ok(Array.isArray(moved), "de verhuisde objecten zijn genoteerd ("+moved.length+")");
  ok(R(`CASTRA_WENT.filter(e=>e.region==="laconia" && e.kind!=="hub").every(e=>!castraTerraSolid("laconia", e.x, e.y))`), "geen enkel object staat in een wand of rand");
  const lvl2 = R("(function(){ const p = castraTerraPlan('laconia'); let n = 0; for(const k in p.walk) if(p.walk[k]===2) n++; return n; })()"); ok(lvl2>20, "er is een tweede niveau ("+lvl2+" begaanbare cellen)"); }

console.log("3. bochtige paden, meertjes en bossen");
{ ROMAN.forEach(r=>{ const W = R(`(function(){ const w = CASTRA_WORLDS.${r}; return { roads:w.roads.length, old:!!w.roadsOld }; })()`); ok(!W.old && W.roads<=3, r+": rechte wegen blijven ("+W.roads+" stukken)"); });
  LANDS.forEach(r=>{
    const pl = R(`(function(){ const p = castraLandPlan(${J(r)}); return { ok:p.pathOk, n:Object.keys(p.path).length, lakes:p.lakes.length, trees:p.woods.reduce((a,b)=>a+b.trees.length,0), roads:CASTRA_WORLDS.${r}.roads.length }; })()`);
    ok(pl.ok.ns && pl.ok.ew, r+": beide wegen zijn bochtig gelukt"); ok(pl.n>=150, r+": "+pl.n+" padcellen"); ok(pl.roads>20, r+": de wegen zijn een reeks korte stukken ("+pl.roads+")");
    const bl = R(`(castraBarrierPlan(${J(r)})||{gates:[]}).gates.reduce((a,b)=>a+Object.keys(b.lake).length,0)`); ok(pl.lakes>=1 || bl>0, r+": "+pl.lakes+" meertje(s) en "+bl+" watertegels in de afsluiting"); ok(pl.trees>=15, r+": "+pl.trees+" bomen in bossen");
    // het pad loopt langs alles waar iets aan hangt
    const chk = R(`(function(){ const rid = ${J(r)}, P = castraLandPlan(rid).path, W = CASTRA_WORLDS[rid], bad = [];
      (CASTRA_FGATES[rid]||[]).forEach(g=>{ if(!P[g.x+","+g.y]) bad.push("poort "+g.id); });
      CASTRA_WENT.filter(e=>e.region===rid && e.kind==="trainer").forEach(e=>{ const dx = e.x < W.cols/2 ? 1 : -1; let hit = false; for(let i=1;i<=3;i++) if(P[(e.x+dx*i)+","+e.y]) hit = true; if(!hit) bad.push("trainer "+e.id); });
      (W.doors||[]).forEach(d=>{ if(Math.abs(d.y-CASTRA_GEO[rid].row)<=1 && !P[d.x+","+d.y] && !P[d.x+","+(d.y+1)]) bad.push("deur "+d.to); });
      const R0 = CASTRA_GEO[rid].row; if(!P["2,"+R0] && !P["3,"+R0] && !P["2,"+(R0+1)]) bad.push("west"); if(!P[(W.cols-3)+","+R0] && !P[(W.cols-4)+","+R0]) bad.push("oost"); if(!P[((W.cols>>1)-1)+",1"]) bad.push("noord"); if(!P[((W.cols>>1)-1)+","+(W.rows-2)]) bad.push("zuid");
      return bad; })()`);
    ok(chk.length===0, r+": het pad loopt langs poorten, trainers, deuren en de uitgangen"+(chk.length ? " (mist: "+chk.join(", ")+")" : ""));
    // het pad hangt aaneen: vanaf de start bereik je beide uiteinden langs padcellen (8-buren)
    const con = R(`(function(){ const rid = ${J(r)}, P = castraLandPlan(rid).path, W = CASTRA_WORLDS[rid], cx = (W.cols>>1)-1, R0 = CASTRA_GEO[rid].row; const seen = {}, q = [[cx, W.rows-3]]; let start = null; for(const k in P){ const [x,y] = k.split(",").map(Number); if(Math.abs(x-cx)<=1 && y>=W.rows-4){ start = [x,y]; break; } } if(!start) return "geen start"; q[0] = start; seen[start.join(",")] = 1;
      while(q.length){ const [x,y] = q.shift(); for(let dy=-1;dy<=1;dy++) for(let dx=-1;dx<=1;dx++){ const k = (x+dx)+","+(y+dy); if(P[k] && !seen[k]){ seen[k] = 1; q.push([x+dx,y+dy]); } } }
      return { noord:!!seen[cx+",2"] || !!seen[(cx+1)+",2"], west:Object.keys(seen).some(k=>+k.split(",")[0]<=3), oost:Object.keys(seen).some(k=>+k.split(",")[0]>=W.cols-4), cells:Object.keys(seen).length, all:Object.keys(P).length }; })()`);
    ok(con.noord && con.west && con.oost && con.cells===con.all, r+": één samenhangend pad naar noord, west en oost ("+J(con)+")");
    // meren en bossen liggen niet op het pad of op objecten
    const clash = R(`(function(){ const rid = ${J(r)}, p = castraLandPlan(rid), W = CASTRA_WORLDS[rid], bad = []; const ents = {}; CASTRA_WENT.filter(e=>e.region===rid).forEach(e=>ents[e.x+","+e.y] = e.id);
      p.lakes.forEach((l,i)=>Object.keys(l.cells).forEach(k=>{ if(p.path[k]) bad.push("meer op pad "+k); if(ents[k]) bad.push("meer op "+ents[k]); }));
      p.woods.forEach(wd=>wd.trees.forEach(t=>{ const k = t.x+","+t.y, k2 = t.x+","+(t.y+1); if(p.path[k]||p.path[k2]) bad.push("boom op pad "+k); if(ents[k]||ents[k2]) bad.push("boom op "+(ents[k]||ents[k2])); }));
      return bad.slice(0,5); })()`);
    ok(clash.length===0, r+": meren en bossen liggen vrij van pad en objecten"+(clash.length ? " ("+clash.join(", ")+")" : ""));
  });
  // vast per seed: opnieuw plannen geeft hetzelfde
  const a = R(`Object.keys(castraLandPlan("germania").path).length+"/"+castraLandPlan("germania").lakes.length`);
  ok(R(`(function(){ const old = Object.keys(castraLandPlan("germania").path).join("|"); delete CASTRA_LAND_PLAN.germania; return old===Object.keys(castraLandPlan("germania").path).join("|"); })()`), "het plan is vast (zelfde seed, zelfde kaart)");
  // meertjes tellen als water (vissen, rimpels)
  const lake = R(`(function(){ const l = castraLandPlan("germania").lakes[0], k = Object.keys(l.cells)[0].split(",").map(Number); return { w:castraIsWater("germania", k[0], k[1]), notW:castraIsWater("germania", 33, 40) }; })()`);
  ok(lake.w===true && lake.notW===false, "een meertje is water voor het vissen, een gewone tegel niet");
  // het spel blijft laden zonder dat het pad de heg doorbreekt
  ok(R(`(function(){ CASTRA_W_REGION = "germania"; CASTRA_WORLD_BUILT = {}; const B = castraWorldBuilt(); const g = CASTRA_FGATES.germania; return g.every(x=>!B.blocked[x.x+","+x.y] || CASTRA_WENT.some(e=>e.id===x.id)); })()`), "de opening in elke heg is vrij of bezet door zijn eigen versperring"); }

console.log("\n" + checks + " controles, " + fails + " fouten");
process.exit(fails ? 1 : 0);
