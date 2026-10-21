/* Testen van de Colosseum-logica (naspelen, controleren, rangschikken, uitbetalen) zonder browser:
   node tools/castra-colo-test.js */
const { ctx, errs } = require("./castra-colo-node.js");
if(errs.length){ console.error(errs); process.exit(1); }
const vm = require("vm"), run = s => vm.runInContext(s, ctx);
run("CASTRA = castraNewState();");
let fails = 0; const ok = (c, m) => { console.log((c ? "  ok   " : "  FOUT ") + m); if(!c) fails++; };

// Een "live" run namaken: eenheden plaatsen via dezelfde code als het spel (castraColoPlace), laten lopen, acties opslaan.
run(`
var T = {
  free(div, seed){ const m = castraColoPvpMission(div, seed), cells = castraPPathCells(m.map), trees = {}; CASTRA_P_MAPS[m.map].trees.forEach(t=>{ trees[t[0]+","+t[1]] = 1; });
    const out = []; for(let y=CASTRA_P.rows-1;y>=0;y--) for(let x=CASTRA_P.cols-1;x>=0;x--) if(!cells[x+","+y] && !trees[x+","+y]) out.push([x,y]); return out.slice(0,12); },
  live(div, seed, opts){
    opts = opts || {};
    CASTRA.seed = 777; CASTRA.soldiers = []; CASTRA.heroes = [];
    const forms = ["rom_princeps","rom_funditor","rom_decurio","rom_signifer","rom_princeps","rom_funditor","rom_decurio","rom_princeps"];
    forms.forEach((f,i)=>{ const s = castraRollSoldier(f); s.lvl = div + 5; s.id = "t"+i; CASTRA.soldiers.push(s); });
    const m = castraColoPvpMission(div, seed);
    const B = { mission:m, sim:castraPSim(m, []), div, seed, actions:[], endless:true };
    B.sim.mods = { dmg:1, cd:1, rng:1, spd:1 };
    const cells = castraPPathCells(m.map), trees = {}; CASTRA_P_MAPS[m.map].trees.forEach(t=>{ trees[t[0]+","+t[1]] = 1; });
    const free = []; for(let y=0;y<CASTRA_P.rows;y++) for(let x=0;x<CASTRA_P.cols;x++) if(!cells[x+","+y] && !trees[x+","+y]) free.push([x,y]);
    const units = castraColoUnits(div).slice(0, opts.n||CASTRA_COLO.cap[div]);
    // plaats op vaste, verspreide vakken; één soldaat later terugnemen en opnieuw plaatsen
    units.forEach((u,i)=>{ const [x,y] = free[(i*7)%free.length]; if(B.sim.towers.some(t=>t.x===x&&t.y===y)) return; B.sim.towers.push(castraColoPlace(B, u, x, y)); });
    let moved = false;
    while(!B.sim.over && B.sim.tick < (opts.stop||CASTRA_COLO.maxTick)){
      castraPStep(B.sim);
      if(!moved && B.sim.tick===1500 && B.sim.towers.length){
        const tw = B.sim.towers[0]; B.sim.towers = B.sim.towers.filter(t=>t!==tw); B.actions.push({ t:B.sim.tick, k:"take", sid:tw.sid });
        const u = castraColoUnits(div).find(q=>String(q.id).slice(0,30)===tw.sid); const [x,y] = free[free.length-3];
        B.sim.towers.push(castraColoPlace(B, u, x, y)); moved = true;
      }
    }
    const s = B.sim;
    return { actions:JSON.stringify(B.actions), res:{ tick:s.tick, wave:s.wave+1, lives:s.baseHp, kills:s.kills, win:s.over==="win", quit:!s.over }, ts:1000 };
  }
};`);
const J = x => JSON.stringify(x), R = s => JSON.parse(J(run(s)));

console.log("1. naspelen == live (zelfde code, dus zelfde uitkomst)");
[[20,12345],[35,999],[50,4242]].forEach(([div, seed]) => {
  const r = R(`T.live(${div}, ${seed})`), match = { divisie:div, seed, mode:"duel" };
  const v = R(`castraColoReplay(${J(match)}, ${J(r)})`);
  ok(v.ok && v.res.tick === r.res.tick && v.res.wave === r.res.wave && v.res.kills === r.res.kills, `div ${div}: live golf ${r.res.wave} tick ${r.res.tick} kills ${r.res.kills} -> naspelen ${v.ok ? "golf "+v.res.wave+" tick "+v.res.tick : v.why}`);
});

console.log("2. valsspelen wordt geweigerd");
{
  const div = 35, seed = 999, match = { divisie:div, seed, mode:"duel" }, r = R(`T.live(${div}, ${seed})`);
  const bad = (mut, name) => { const x = JSON.parse(J(r)); mut(x); const v = R(`castraColoReplay(${J(match)}, ${J(x)})`); ok(!v.ok, `${name} -> ${v.ok ? "TOEGESTAAN" : v.why}`); };
  bad(x => { x.res.wave += 3; }, "hogere golf beweren");
  bad(x => { x.res.kills += 50; }, "meer kills beweren");
  bad(x => { x.res.tick += 700; }, "latere tick beweren");
  bad(x => { x.res.win = true; }, "winst beweren");
  bad(x => { const a = JSON.parse(x.actions); const p = a.find(q => q.k === "place"); p.u.v = 80; x.actions = J(a); }, "level boven het plafond");
  bad(x => { const a = JSON.parse(x.actions); const p = a.find(q => q.k === "place" && q.u.l); p.u.i = [16,15,15,15,15]; x.actions = J(a); }, "aanleg boven het maximum (16 > 15)");
  bad(x => { const a = JSON.parse(x.actions); const p = a.find(q => q.k === "place" && q.u.l); p.u.s = ["umbra","umbra"]; x.actions = J(a); }, "arte dubbel / niet geleerd");
  bad(x => { const a = JSON.parse(x.actions); const p = a.find(q => q.k === "place" && q.u.l); p.u.l = "bestaat_niet"; x.actions = J(a); }, "onbekende vorm");
  bad(x => { const a = JSON.parse(x.actions); const p = a.find(q => q.k === "place"); p.x = 99; x.actions = J(a); }, "tegel buiten de kaart");
  bad(x => { const a = JSON.parse(x.actions); const p = a.filter(q => q.k === "place"); p[1].x = p[0].x; p[1].y = p[0].y; x.actions = J(a); }, "twee torens op één tegel");
  bad(x => { const a = JSON.parse(x.actions); const fr = R(`T.free(${div}, ${seed})`); for(let i = 0; i < 6; i++) a.push({ t:a[a.length-1].t, k:"place", sid:"extra"+i, x:fr[i][0], y:fr[i][1], u:{ d:1 } }); x.actions = J(a); }, "meer torens dan toegestaan");
  bad(x => { x.actions = "{kapot"; }, "onleesbare acties");
  bad(x => { const a = JSON.parse(x.actions); a.reverse(); x.actions = J(a); }, "acties in verkeerde volgorde");
}

console.log("3. rangschikking en uitbetaling");
{
  const match = { divisie:35, seed:999, mode:"duel", fee:100, players:{ aaa:{ nm:"Anna" }, bbb:{ nm:"Bram" } } };
  const strong = R("T.live(35, 999)"), weak = R("T.live(35, 999, { n:3 })"); weak.ts = 500; strong.ts = 900;
  let st = R(`castraColoStandings(${J(match)}, { aaa:${J(weak)}, bbb:${J(strong)} })`);
  ok(st.rows[0].lid === "bbb" && st.rows[0].pay === 200 && st.rows[1].pay === 0, `sterkere run wint: ${st.rows.map(r => r.nm+" golf "+(r.res&&r.res.wave)+" -> "+r.pay).join(" | ")}`);
  ok(st.rows.reduce((a, r) => a + r.pay, 0) === 200, "som uitbetalingen = 2 x inzet");
  st = R(`castraColoStandings(${J(match)}, { aaa:${J(weak)} })`);
  ok(st.rows[0].lid === "aaa" && st.rows[0].pay === 200 && st.rows[1].pay === 0 && !st.refund, "alleen één run ingeleverd: die speler wint de pot");
  st = R(`castraColoStandings(${J(match)}, {})`);
  ok(st.refund && st.rows.every(r => r.pay === 100), "niemand levert in: iedereen krijgt zijn inzet terug");
  const cheat = JSON.parse(J(strong)); cheat.res.wave += 5;
  st = R(`castraColoStandings(${J(match)}, { aaa:${J(weak)}, bbb:${J(cheat)} })`);
  ok(st.rows[0].lid === "aaa" && st.rows[1].why === "uitkomst klopt niet", "vervalste run verliest van een eerlijke run");
  // gelijkspel: dezelfde run -> eerder ingeleverd wint
  const a = JSON.parse(J(weak)), b = JSON.parse(J(weak)); a.ts = 2000; b.ts = 1000;
  st = R(`castraColoStandings(${J(match)}, { aaa:${J(a)}, bbb:${J(b)} })`);
  ok(st.rows[0].lid === "bbb", "gelijke uitslag: eerder ingeleverd wint");
}


console.log("4. AI-tegenstander (ghost) en vierkamp");
{
  [[20,5150],[35,777],[50,31337]].forEach(([div, seed]) => {
    const m = { divisie:div, seed, mode:"quad", ghosts:2 };
    const g = R(`(function(){ const a = castraColoGhost(${J(m)}, 0), b = castraColoGhost(${J(m)}, 1); return [a.res, b.res, a.acts.length, b.acts.length]; })()`);
    ok(g[0].wave >= 8 && g[0].wave <= 40 && g[1].wave <= g[0].wave + 6, `div ${div}: AI 1 golf ${g[0].wave} (${g[2]} torens), AI 2 golf ${g[1].wave} (${g[3]} torens)`);
  });
  // deterministisch: een tweede, losse wereld rekent hetzelfde uit
  const { load } = require("./castra-colo-node.js"), w2 = load(); vm.runInContext("CASTRA = castraNewState();", w2.ctx);
  const m = { divisie:35, seed:777, mode:"quad", ghosts:1 };
  const a = R(`castraColoGhost(${J(m)}, 0).res`), b = JSON.parse(J(vm.runInContext(`castraColoGhost(${J(m)}, 0).res`, w2.ctx)));
  ok(J(a) === J(b), "dezelfde AI-run in twee losse werelden: " + J(a));
  // AI-run voldoet aan dezelfde controle als een spelersrun
  const gr = R(`(function(){ const g = castraColoGhost(${J(m)}, 0); return { actions:JSON.stringify(g.acts), res:{ tick:g.res.tick, wave:g.res.wave, lives:g.res.lives, kills:g.res.kills, win:g.res.win?1:0, quit:g.res.quit?1:0 } }; })()`);
  ok(R(`castraColoReplay(${J(m)}, ${J(gr)})`).ok, "de AI-run komt door het naspelen (zelfde regels als spelers)");

  // vierkamp: 3 spelers + AI, verschillende sterkte
  const quad = { divisie:35, seed:999, mode:"quad", fee:100, ghosts:1, players:{ p1:{ nm:"P1" }, p2:{ nm:"P2" }, p3:{ nm:"P3" } } };
  const run = n => R(`T.live(35, 999, { n:${n} })`);
  const r10 = run(10), r6 = run(6), r2 = run(2); r10.ts = 300; r6.ts = 200; r2.ts = 100;
  const st = R(`castraColoStandings(${J(quad)}, { p1:${J(r2)}, p2:${J(r10)}, p3:${J(r6)} })`);
  const real = st.rows.filter(r => !r.ghost);
  console.log("     " + st.rows.map(r => r.rank + ". " + r.nm + " (golf " + r.res.wave + ") " + r.pay).join(" | "));
  ok(st.rows.length === 4 && st.rows.filter(r => r.ghost).length === 1 && st.rows.every((r, i) => r.rank === i + 1), "4 rijen, de AI telt mee voor de plaatsen");
  ok(st.rows.filter(r => r.ghost).every(r => r.pay === 0), "de AI krijgt nooit uitbetaling");
  ok(R("castraColoPayTable('quad', 1)").join() === "185,75,35,0" && R("castraColoPayTable('quad', 0)").join() === "250,100,50,0" && R("castraColoPayTable('quad', 2)").join() === "125,50,25,0", "prijzentabel: 250/100/50/0 zonder AI, 185/75/35/0 met 1 AI, 125/50/25/0 met 2");
  ok(real.every(r => r.pay === ({ 1:185, 2:75, 3:35, 4:0 })[r.rank]), "echte spelers krijgen 185 / 75 / 35 / 0 naar eindplaats (de AI neemt haar plek in en betaalt niet mee)");
  ok(real.reduce((x, r) => x + r.pay, 0) <= 300, "totaal uitbetaald <= echte inzet (300): geen brons erbij door tegen een AI te spelen");
  // geen enkele combinatie van echte spelers + AI betaalt meer uit dan er is ingezet
  [[1,3],[2,2]].forEach(([g, nReal]) => { const t = R(`castraColoPayTable('quad', ${g})`); ok(t.reduce((a, v) => a + v, 0) <= nReal*100, `${nReal} spelers + ${g} AI: tabel ${t.join("/")} (som ${t.reduce((a, v) => a + v, 0)} <= ${nReal*100})`); });
  ok(R(`castraColoCmp({ ok:true, ghost:true, res:{ win:false, tick:100, kills:5 }, ts:9e15, lid:"ai1" }, { ok:true, res:{ win:false, tick:100, kills:5 }, ts:5000, lid:"zzz" })`) > 0, "bij gelijke uitslag verliest de AI van een echte speler");
  const none = R(`castraColoStandings(${J(quad)}, {})`);
  ok(none.refund && none.rows.filter(r => !r.ghost).every(r => r.pay === 100) && none.rows.filter(r => r.ghost).every(r => r.pay === 0), "niemand levert in -> inzet terug (de AI profiteert niet)");
  const q4 = { divisie:35, seed:999, mode:"quad", fee:100, players:{ a:{ nm:"A" }, b:{ nm:"B" }, c:{ nm:"C" }, d:{ nm:"D" } } };
  const s4 = R(`castraColoStandings(${J(q4)}, { a:${J(r10)}, b:${J(r6)} })`);
  ok(s4.rows[0].pay === 250 && s4.rows[1].pay === 100 && s4.rows[2].pay === 0 && s4.rows[3].pay === 0, "vierkamp: twee ingeleverd -> 250 en 100, wie niet inlevert krijgt niets");
}

console.log(fails ? "\n" + fails + " FOUT(EN)" : "\nalles goed");
process.exit(fails ? 1 : 0);
