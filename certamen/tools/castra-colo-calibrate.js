/* Kalibratie van het Colosseum (eindeloze modus): node tools/castra-colo-calibrate.js [report|tune]
   Referentieteam: cap(div) soldaten van level = divisie, tier naar level (<16: 2, 16-31: 3, vanaf 32: 4, Romeinse lijn),
   plaatsing = greedy op pad-dekking (zoals castra-balance-td.js). Uitslag per zaad; mediaan over N zaden. */
const { ctx, errs } = require("./castra-colo-node.js");
if(errs.length) { console.error(errs); process.exit(1); }
const run = s => require("vm").runInContext(s, ctx);
run("CASTRA = castraNewState();");
run(`
var CALO = (function(){
  const FORMS = { 2:{inf:"rom_hastatus",rng:"rom_veles",cav:"rom_eques",sup:"rom_faber"}, 3:{inf:"rom_princeps",rng:"rom_funditor",cav:"rom_decurio",sup:"rom_signifer"}, 4:{inf:"rom_triarius",rng:"rom_sagittarius",cav:"rom_praefectusalae",sup:"rom_aquilifer"} };
  const PATTERN = ["inf","rng","inf","rng","cav","sup","inf","rng","cav","inf","rng","sup"];
  function team(div, n){
    const tier = div<16?2:div<32?3:4, keep = CASTRA.seed; CASTRA.seed = 424242;
    try{ return Array.from({length:n},(_,i)=>{ const s = castraRollSoldier(FORMS[tier][PATTERN[i%PATTERN.length]]); s.lvl = div; s.id = "ref"+i; return s; }); } finally{ CASTRA.seed = keep; }
  }
  function place(m, towers){
    const cells = castraPPathCells(m.map), trees = {}; CASTRA_P_MAPS[m.map].trees.forEach(t=>{ trees[t[0]+","+t[1]] = 1; });
    const free = []; for(let y=0;y<CASTRA_P.rows;y++) for(let x=0;x<CASTRA_P.cols;x++) if(!cells[x+","+y] && !trees[x+","+y]) free.push([x,y]);
    const pts = []; castraPPaths(m.map).forEach(p=>{ for(let d=0; d<p.len; d+=400) pts.push(castraPPos(p,d)); });
    const used = {}, hit = pts.map(()=>0), out = [];
    towers.forEach(s=>{
      const t = castraPMakeTower({nextId:1}, s, 0, 0), r2 = t.range*t.range; let best = null, bs = -1;
      free.forEach(([x,y])=>{ if(used[x+","+y]) return; const cx=x*1000+500, cy=y*1000+500; let sc = 0;
        pts.forEach((p,i)=>{ const dx=p[0]-cx, dy=p[1]-cy; if(dx*dx+dy*dy<=r2) sc += 1/(1+hit[i]*0.6); });
        if(sc>bs){ bs=sc; best=[x,y]; } });
      if(!best) return; used[best[0]+","+best[1]] = 1; const cx=best[0]*1000+500, cy=best[1]*1000+500;
      pts.forEach((p,i)=>{ const dx=p[0]-cx, dy=p[1]-cy; if(dx*dx+dy*dy<=r2) hit[i]++; });
      out.push({ s, x:best[0], y:best[1] });
    });
    return out;
  }
  function runOne(div, seed, hpA, growth){
    const keepA = CASTRA_COLO.hpA[div], keepG = CASTRA_COLO.growth; if(hpA!=null) CASTRA_COLO.hpA[div] = hpA; if(growth!=null) CASTRA_COLO.growth = growth;
    try{ const m = castraColoMission(div, seed); const towers = place(m, team(div, CASTRA_COLO.cap[div])); return castraColoSimulate(m, towers, 200000); }
    finally{ CASTRA_COLO.hpA[div] = keepA; CASTRA_COLO.growth = keepG; }
  }
  const SEEDS = [11,22,33,44,55,66,77,88];
  function waves(div, hpA, growth){ return SEEDS.map(s=>runOne(div, s*7919, hpA, growth).wave).sort((a,b)=>a-b); }
  function med(a){ return a[Math.floor(a.length/2)]; }
  function tune(div, target, growth){   // log-zoek hpA waarvoor de mediaan = target
    let lo = 0.01, hi = 50;
    for(let i=0;i<22;i++){ const mid = Math.sqrt(lo*hi), w = med(waves(div, mid, growth)); if(w >= target) lo = mid; else hi = mid; }
    return Math.round(Math.sqrt(lo*hi)*1000)/1000;
  }
  return { waves, tune, runOne, med, team, place };
})();`);
const mode = process.argv[2] || "report", T = { 20:18, 35:25, 50:30 };
const g = process.argv[3] ? parseFloat(process.argv[3]) : null;
if(mode==="tune"){
  const out = {}; [20,35,50].forEach(d=>{ out[d] = run(`CALO.tune(${d}, ${T[d]}, ${g})`); console.log("div", d, "-> hpA", out[d]); });
}
[20,35,50].forEach(d=>{ const w = run(`CALO.waves(${d}, null, ${g})`); console.log("div", d, "doel", T[d], "golven per zaad:", w.join(","), "mediaan", w[Math.floor(w.length/2)]); });
if(mode==="sens"){
  [20,35,50].forEach(d=>{
    const cap = run(`CASTRA_COLO.cap[${d}]`), out = [];
    [[Math.ceil(cap/2), d],[cap, d-10],[cap, d]].forEach(([n,lv])=>{
      const w = run(`(function(){ const r=[]; [11,22,33,44].forEach(s=>{ const m=castraColoMission(${d}, s*7919); const t=CALO.team(${lv}, ${n}); const p=CALO.place(m,t); r.push(castraColoSimulate(m,p,200000).wave); }); return r.sort((a,b)=>a-b); })()`);
      out.push(n+" torens lvl "+lv+": "+w.join(","));
    });
    console.log("div", d, "|", out.join(" | "));
  });
}
