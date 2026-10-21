/* Headless balansproef voor de tower defence (Castra Heronum).
   Gebruik in de browser met certamen/index.html geladen (dev-server):
     eval(await (await fetch("tools/castra-balance-td.js")).text());
     CBAL.report();            // levens over per missie met het referentieteam
     CBAL.tune("ro1", 5);      // zoek hpMult waarbij het referentieteam met ±5 levens wint
   Referentieteam: aantal torens 4 + 1 per 4 levels (max 12), tier naar level (<16: tier 2, 16–31: tier 3,
   vanaf 32: tier 4 van de Romeinse lijn), vaardigheden automatisch gevuld, plaatsing = greedy op pad-dekking.
   Alles deterministisch (zelfde missie + zelfde team = zelfde uitkomst). */
window.CBAL = (function(){
  const FORMS = {
    2: { inf:"rom_hastatus", rng:"rom_veles",    cav:"rom_eques",         sup:"rom_faber" },
    3: { inf:"rom_princeps", rng:"rom_funditor", cav:"rom_decurio",       sup:"rom_signifer" },
    4: { inf:"rom_triarius", rng:"rom_sagittarius", cav:"rom_praefectusalae", sup:"rom_aquilifer" },
  };
  const PATTERN = ["inf","rng","inf","rng","cav","sup","inf","rng","cav","inf","rng","sup"];
  function missionLevel(m){ let L = 0; m.waves.forEach(w=>w.forEach(g=>{ L = Math.max(L, g.lvl); })); return L; }
  function teamSoldiers(L, level){
    const lv = level || L, tier = lv < 16 ? 2 : lv < 32 ? 3 : 4, N = Math.min(12, 4 + Math.floor(lv/4));
    // castraRollSoldier gebruikt CASTRA.seed: voor een herhaalbare proef tijdelijk een vaste seed gebruiken
    const keep = CASTRA.seed; CASTRA.seed = 424242;
    try { return Array.from({length:N}, (_,i)=>{ const s = castraRollSoldier(FORMS[tier][PATTERN[i%PATTERN.length]]); s.lvl = lv; s.id = "ref"+i; return s; }); }
    finally { CASTRA.seed = keep; }
  }
  function freeCells(m){
    const cells = castraPPathCells(m.map), trees = {}; CASTRA_P_MAPS[m.map].trees.forEach(t=>{ trees[t[0]+","+t[1]] = 1; });
    const out = []; for(let y=0;y<CASTRA_P.rows;y++) for(let x=0;x<CASTRA_P.cols;x++) if(!cells[x+","+y] && !trees[x+","+y]) out.push([x,y]);
    return out;
  }
  function samples(m){
    const pts = [], paths = (typeof castraPPaths==="function") ? castraPPaths(m.map) : [castraPPath(m.map)];
    paths.forEach(p=>{ for(let d=0; d<p.len; d+=400) pts.push(castraPPos(p, d)); });
    return pts;
  }
  function place(m, towers){
    const cells = freeCells(m), pts = samples(m), used = {}, hit = pts.map(()=>0), out = [];
    towers.forEach(tw=>{
      const t = castraPMakeTower({ nextId:1 }, tw.s, 0, 0), r2 = t.range*t.range; let best = null, bs = -1;
      cells.forEach(([x,y])=>{ if(used[x+","+y]) return; const cx = x*1000+500, cy = y*1000+500; let sc = 0;
        pts.forEach((p,i)=>{ const dx = p[0]-cx, dy = p[1]-cy; if(dx*dx+dy*dy <= r2) sc += 1/(1+hit[i]*0.6); });
        if(sc > bs){ bs = sc; best = [x,y]; } });
      if(!best) return; used[best[0]+","+best[1]] = 1; const cx = best[0]*1000+500, cy = best[1]*1000+500;
      pts.forEach((p,i)=>{ const dx = p[0]-cx, dy = p[1]-cy; if(dx*dx+dy*dy <= r2) hit[i]++; });
      out.push({ s:tw.s, x:best[0], y:best[1] });
    });
    return out;
  }
  function run(m, level){
    const L = missionLevel(m), ed = (typeof castraEdictSimSetup==="function") ? castraEdictSimSetup(m) : { mods:{}, cap:99, banTypes:[], banHero:false };
    let sol = teamSoldiers(L, level); sol = sol.filter(s=>ed.banTypes.indexOf(castraLine(s.line).type)<0).slice(0, ed.cap);
    const placed = place(m, sol.map(s=>({ s })));
    const sim = castraPSim(m, placed); sim.mods = { dmg:1, cd:1, rng:1, spd:1, type:{} };
    if(ed.mods) Object.keys(ed.mods).forEach(k=>{ if(k==="type") Object.keys(ed.mods.type).forEach(t=>{ sim.mods.type[t] = (sim.mods.type[t]||0)+ed.mods.type[t]; }); else sim.mods[k] = Math.round(sim.mods[k]*ed.mods[k]*1000)/1000; });
    let guard = 0; while(!sim.over && sim.tick < 40000 && guard++ < 400000){ if(!sim.waveActive) castraPStartWave(sim); castraPStep(sim); }
    return { win: sim.over==="win", left: sim.over==="win" ? sim.baseHp : 0, leaked: sim.leaked, ticks: sim.tick, n: placed.length, L };
  }
  function missions(){ return CASTRA_P_MISSIONS; }
  function report(ids){
    return missions().filter(m=>!ids || ids.indexOf(m.id)>=0).map(m=>{ const r = run(m); return m.id+" hp"+m.hpMult+" L"+r.L+" n"+r.n+": "+(r.win?"win "+r.left+" levens":"LOSS")+" ("+r.leaked+" doorgelaten)"; }).join("\n");
  }
  // zoek hpMult waarbij het referentieteam van level `level` (standaard het missielevel) met `target` levens over wint (log-schaal)
  function tune(id, target, level){
    const m = CASTRA_P_MISSIONS.find(x=>x.id===id), keep = m.hpMult; let lo = 0.05, hi = 300;
    for(let i=0;i<24;i++){ const mid = Math.sqrt(lo*hi); m.hpMult = mid; const r = run(m, level); if(r.win && r.left >= target) lo = mid; else hi = mid; }
    // de uitkomst is licht grillig (kill-timing): ga 7% onder de grens en verlaag tot het team zeker wint
    let h = lo*0.93, r = null; for(let k=0;k<40;k++){ m.hpMult = Math.round(h*100)/100; r = run(m, level); if(r.win && r.left>=target) break; h *= 0.95; }
    const v = Math.round(h*100)/100; m.hpMult = keep; return { id, hpMult:v, left:r.left, win:r.win };
  }
  // kritiek teamlevel: laagste level waarop het referentieteam met minstens 5 levens wint
  function crit(id){ const m = CASTRA_P_MISSIONS.find(x=>x.id===id); for(let lv=1; lv<=70; lv++){ const r = run(m, lv); if(r.win && r.left>=5) return lv; } return null; }
  return { run, report, tune, crit, teamSoldiers, missionLevel, place };
})();
