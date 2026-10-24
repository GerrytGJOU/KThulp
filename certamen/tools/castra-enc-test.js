/* Test van de ontmoetingen (castra-enc.js): slottabellen, praetoriumgrens, veilige stappen, suffimentum en vissen.
   node tools/castra-enc-test.js   (vanuit certamen/; exitcode 1 bij fouten) */
const { load } = require("./castra-colo-node.js"), vm = require("vm");
const w = load({ H(){} }); if(w.errs.length){ console.error(w.errs); process.exit(1); }
const run = s => vm.runInContext(s, w.ctx), J = x => JSON.stringify(x), R = s => JSON.parse(J(run(s)));
let fails = 0, checks = 0; const ok = (c, m)=>{ checks++; if(!c){ fails++; console.log("  FOUT  " + m); } };
const fresh = ()=>run(`CASTRA = castraNewState(); CASTRA.dev = true; CASTRA_W_UI = { px:5, py:5, dir:"up", frame:1, moving:false, scale:1 }; CASTRA.b.praetorium = { lvl:6, t:0 };`);
fresh();
const regs = R("Object.keys(CASTRA_VENATIO)");

console.log("1. slottabellen");
let tables = 0;
regs.forEach(rid=>{
  const terr = R(`CASTRA_VENATIO[${J(rid)}].terrains.map(t=>({ id:t.id, p:t.myth?t.myth.p:0 }))`), tierMax = run(`CASTRA_VENATIO[${J(rid)}].tierMax||4`);
  terr.forEach(t=>{
    const T = R(`castraEncTableView(${J(rid)}, ${J(t.id)})`); tables++;
    const name = rid+"/"+t.id;
    ok(T.length===12, name+": 12 slots ("+T.length+")");
    ok(T.reduce((a,s)=>a+s.w,0)===100, name+": de kansen tellen op tot 100");
    ok(T.every(s=>s.nm && run(`!!CASTRA_FORMS[${J(s.form)}]`)), name+": elke slot heeft een bestaande vorm");
    ok(T.every(s=>s.formTier<=tierMax), name+": geen vorm boven de maximale tier van het land ("+tierMax+")");
    const mythW = T.filter(s=>s.myth).reduce((a,s)=>a+s.w,0); ok(Math.abs(mythW - t.p*100) <= 6, name+": mythisch gewicht "+mythW+" past bij "+Math.round(t.p*100)+"%");
    ok(T.filter(s=>s.myth).every(s=>run(`CASTRA_FORMS[${J(s.form)}].volk==="myt"`)) && T.filter(s=>!s.myth).every(s=>run(`CASTRA_FORMS[${J(s.form)}].volk!=="myt"`)), name+": mythische slots zijn mythisch, de rest niet");
    ok(new Set(T.map(s=>s.form)).size>=3, name+": minstens 3 verschillende vormen ("+new Set(T.map(s=>s.form)).size+")");
    ok(J(T)===J(R(`castraEncTableView(${J(rid)}, ${J(t.id)})`)), name+": de tabel is vast (zelfde elke keer)");
  });
});
ok(tables>=50, "alle terreinen hebben een tabel ("+tables+")");
{ const share = t=>R(`castraEncTableView("latium","silva")`).filter(s=>s.tier===t).reduce((a,s)=>a+s.w,0);
  ok(share(1)===60 && share(2)===30 && share(3)===9 && share(4)===1, "tierverdeling 60/30/9/1 (was 60/28/10/2)"); }

console.log("2. kiezen uit de tabel");
{ const draw = (rid, tid, n, seed)=>R(`(function(){ const reg = CASTRA_VENATIO[${J(rid)}], t = reg.terrains.find(x=>x.id===${J(tid)}), rng = castraRng(${seed}), c = {}; let lv = [1e9,0];
    for(let i=0;i<${n};i++){ const p = castraWildPick(reg, t, rng); c[p.form.id] = (c[p.form.id]||0)+1; lv[0] = Math.min(lv[0], p.lvl); lv[1] = Math.max(lv[1], p.lvl); }
    return { c, lv }; })()`);
  const N = 20000, d = draw("latium","campus",N,12345), T = R(`castraEncTableView("latium","campus")`);
  const want = {}; T.forEach(s=>want[s.form] = (want[s.form]||0)+s.w); const tot = Object.values(want).reduce((a,b)=>a+b,0);
  const maxDiff = Math.max(...Object.keys(want).map(f=>Math.abs((d.c[f]||0)/N - want[f]/tot)));
  ok(maxDiff<0.015, "waargenomen verdeling volgt de tabel (max verschil "+(maxDiff*100).toFixed(2)+" procentpunt)");
  ok(Object.keys(d.c).every(f=>want[f]), "er komen alleen vormen uit de tabel voor");
  ok(R(`castraWildPick(CASTRA_VENATIO.latium, CASTRA_VENATIO.latium.terrains[0], castraRng(5)).slot`)!==undefined, "de uitkomst noemt de slot");
  ok(d.lv[0]>=run("CASTRA_VENATIO.latium.min") && d.lv[1]<=50, "levels beginnen bij het niveau van het gebied ("+d.lv[0]+"-"+d.lv[1]+")");
  const a = draw("troia","muros",500,7), b = draw("troia","muros",500,7); ok(J(a)===J(b), "zelfde seed, zelfde ontmoetingen");
  run("CASTRA.b.praetorium = { lvl:1, t:0 };"); const lo = R(`(function(){ const reg = CASTRA_VENATIO.troia, t = reg.terrains[0], rng = castraRng(9); let max = 0; for(let i=0;i<2000;i++){ max = Math.max(max, castraWildPick(reg,t,rng).form.tier); } return max; })()`);
  ok(lo===1, "praetorium 1: alleen tier 1 in het wild (hoogste "+lo+")");
  run(`CASTRA.b.praetorium = { lvl:6, t:0 };`); }

console.log("3. veilige stappen, kans en suffimentum");
{ fresh(); run(`CASTRA_W_REGION = "latium"; var _enc = 0, _last = null; castraWorldEncounter = function(t, V){ _enc++; _last = V; };`);
  run("CASTRA_WORLDS.latium.encounterChance = 1;");
  run("CASTRA_W_UI.encSafe = 3;"); for(let i=0;i<3;i++) run(`castraEncStep("silva")`);
  ok(run("_enc")===0, "de eerste drie stappen zijn veilig");
  run(`castraEncStep("silva")`); ok(run("_enc")===1 && run("!!_last && !!_last.enemy"), "daarna volgt een ontmoeting (kans 100%)");
  const s0 = run("CASTRA.seed"); run("castraEncRand()"); ok(run("CASTRA.seed")!==s0, "castraEncRand schuift de seed op");
  run("CASTRA.seed = 777; var _a = castraEncRand(); CASTRA.seed = 777; var _b = castraEncRand();"); ok(run("_a===_b"), "zelfde seed, zelfde getal");
  run("CASTRA_WORLDS.latium.encounterChance = 0; _enc = 0; CASTRA_W_UI.encSafe = 0;"); for(let i=0;i<50;i++) run(`castraEncStep("silva")`); ok(run("_enc")===0, "kans 0: nooit een ontmoeting");
  run(`CASTRA_WORLDS.latium.encounterChance = 1; CASTRA.soldiers = [ Object.assign(castraRollSoldier("rom_hastatus"), { lvl:50 }) ]; CASTRA.party = [CASTRA.soldiers[0].id]; CASTRA.repel = 10; _enc = 0;`);
  for(let i=0;i<10;i++) run(`castraEncStep("silva")`); ok(run("_enc")===0, "suffimentum: tegen een soldaat van level 50 komen zwakke vijanden niet");
  ok(run("CASTRA.repel")===0, "het suffimentum is na 10 stappen op");
  run(`castraEncStep("silva")`); ok(run("_enc")===1, "daarna komen ze weer");
  run("CASTRA.soldiers[0].lvl = 1; CASTRA.repel = 5; _enc = 0;"); for(let i=0;i<5;i++) run(`castraEncStep("silva")`); ok(run("_enc")===5, "met een level 1-soldaat houdt het suffimentum niets tegen (de vijand is niet zwakker)");
  run("CASTRA.codex = {}; CASTRA.soldiers[0].lvl = 50; CASTRA.repel = 3; _enc = 0;"); for(let i=0;i<3;i++) run(`castraEncStep("silva")`); ok(Object.keys(R("CASTRA.codex")).length===0, "een weggehouden vijand komt niet in de codex"); }

console.log("4. vissen");
{ fresh();
  ok(run(`castraIsWater("latium", 54, 10)`)===true && run(`castraIsWater("latium", 50, 10)`)===false, "Latium: x 54-56 is de Tiber, x 50 niet");
  ok(run(`castraIsWater("latium", 54, 0)`)===false, "de rand is geen water");
  ok(run(`castraIsWater("troia", 4, 24)`)===false && run(`castraIsWater("troia", 4, 23)`)===true, "een brugtegel is geen water");
  const want = { latium:"tiberis", graecia:"litus", troia:"litus", gallia:"flumen", aegyptus:"nilus", africa:"litus", laconia:"flumen", germania:"palus", themiscyra:"litus", persis:null, roma:null };
  Object.keys(want).forEach(r=>ok((run(`(castraWaterTerrain(${J(r)})||{}).id||null`))===want[r], r+": watertreinen "+want[r]));
  ok(R(`castraEncTableView("latium","tiberis")`).length===12, "het watertreinen heeft een eigen tabel"); }

console.log("\n" + checks + " controles, " + fails + " fouten");
process.exit(fails ? 1 : 0);
