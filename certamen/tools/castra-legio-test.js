/* Headless proef voor Legio (Castra Heronum): balans per evenement en determinisme van de lockstep.
   Gebruik in de browser met certamen/index.html geladen (dev-server), na het laden van tools/castra-balance-td.js:
     eval(await (await fetch("tools/castra-balance-td.js")).text());
     eval(await (await fetch("tools/castra-legio-test.js")).text());
     CLEG.report();                 // 12 leerlingen, niveau 12/18/24 per evenement
     CLEG.tune("legio2", 12, 18);   // zoek hpMult waarbij 12 leerlingen met niveau 18 met ±5 levens winnen
     CLEG.determinism("legio2");    // alle acties vooraf bekend vs. een te late actie middenin: zelfde uitkomst?
   Elk leerling-team = 2 soldaten (CASTRA_LEGIO.perPlayer) met het referentieteam van tools/castra-balance-td.js. */
window.CLEG = (function(){
  function actions(evId, players, level, tickBase){
    const ev = { id:1, mission:evId, seed:777, players }, m = castraLegioMissionFor(ev);
    const sol = CBAL.teamSoldiers(level, level); while(sol.length < players*CASTRA_LEGIO.perPlayer) sol.push(...CBAL.teamSoldiers(level, level).map((s,i)=>({ ...s, id:"x"+sol.length+i })));
    const team = sol.slice(0, players*CASTRA_LEGIO.perPlayer).map((s,i)=>({ s:{ ...s, id:"ref"+i } }));
    const placed = CBAL.place(m, team), acts = [];
    placed.forEach((p,i)=>{
      const st = castraStats(p.s), type = castraLine(p.s.line).type;
      acts.push({ t:(tickBase||5)+i, k:"place", x:p.x, y:p.y, lid:"p"+Math.floor(i/CASTRA_LEGIO.perPlayer), sid:p.s.id, line:p.s.line, hid:"", type,
        st:[st.vita,st.impetus,st.tutela,st.celeritas,st.ambitus].join(","), nm:"Leerling "+Math.floor(i/CASTRA_LEGIO.perPlayer), sk:castraSkillIds(p.s).join(",") });
    });
    return { ev, acts };
  }
  function run(evId, players, level){
    const { ev, acts } = actions(evId, players, level);
    const sim = castraLegioRunHeadless(ev, acts, 40000);
    return { win:sim.over==="win", left:sim.over==="win" ? sim.baseHp : 0, kills:sim.kills, leaked:sim.leaked, tick:sim.tick, towers:sim.towers.length };
  }
  function report(){
    const out = []; Object.keys(CASTRA_LEGIO_MISSIONS).forEach(id=>[12,18,24].forEach(lv=>{ const r = run(id, 12, lv); out.push(id+" 12 lln, niveau "+lv+": "+(r.win?"win "+r.left+" levens":"LOSS")+" ("+r.leaked+" doorgelaten, "+r.towers+" torens)"); }));
    return out;
  }
  function tune(id, players, level, target){
    const base = CASTRA_LEGIO_MISSIONS[id], keep = base.hpMult; let lo = 0.1, hi = 300; target = target || 5;
    for(let i=0;i<22;i++){ const mid = Math.sqrt(lo*hi); base.hpMult = mid; const r = run(id, players, level); if(r.win && r.left>=target) lo = mid; else hi = mid; }
    let h = lo*0.93, r = null; for(let k=0;k<40;k++){ base.hpMult = Math.round(h*100)/100; r = run(id, players, level); if(r.win && r.left>=target) break; h *= 0.95; }
    const v = Math.round(h*100)/100; base.hpMult = keep; return { id, hpMult:v, left:r.left, win:r.win };
  }
  function determinism(id){
    const { ev, acts } = actions(id, 8, 18);
    const a = castraLegioRunHeadless(ev, acts, 3000);
    // zelfde acties, maar de laatste vijf worden pas "later" doorgegeven: eerst tot tick 600 rekenen, dan alles bijvoegen en opnieuw rekenen
    const L = { ev, actions:{}, sorted:null, dirty:true, sim:null };
    acts.slice(0,-5).forEach((x,i)=>{ L.actions["k"+String(i).padStart(4,"0")] = x; });
    castraLegioStepTo(L, 600);
    acts.slice(-5).forEach((x,i)=>{ L.actions["k"+String(acts.length-5+i).padStart(4,"0")] = x; }); L.sorted = null; L.dirty = true;
    const b = castraLegioStepTo(L, 3000);
    const sig = s=>[s.tick, s.baseHp, s.kills, s.leaked, s.towers.length, s.enemies.length].join("/");
    return { gelijk: sig(a)===sig(b), a:sig(a), b:sig(b) };
  }
  return { run, report, tune, determinism };
})();
