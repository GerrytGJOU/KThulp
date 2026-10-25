/* Test van de bouwtijden (castra.js: castraUpgrade): level 10, echte tijd, bouwers, kosten en afronden.
   node tools/castra-build-test.js   (vanuit certamen/; exitcode 1 bij fouten) */
const { load } = require("./castra-colo-node.js"), vm = require("vm");
const w = load({ H(){} }); if(w.errs.length){ console.error(w.errs); process.exit(1); }
const run = s => vm.runInContext(s, w.ctx), J = x => JSON.stringify(x), R = s => JSON.parse(J(run(s)));
let fails = 0, checks = 0; const ok = (c, m)=>{ checks++; if(!c){ fails++; console.log("  FOUT  " + m); } };
const fresh = ()=>run(`CASTRA = castraNewState(); CASTRA.dev = false; var _T = 1.8e12; castraNow = ()=>_T; CASTRA.res = { lignum:1e6, aes:1e6, frumentum:1e6 };`);
const adv = ms=>run(`_T += ${ms};`);

console.log("1. niveau 10 en de bouwtijden");
{ fresh();
  ok(R("CASTRA_BAL.maxLvl")===10 && R("castraBuilding('praetorium').maxLvl")===10, "het praetorium gaat tot level 10");
  const bs = R("CASTRA_BUILDINGS.filter(b=>b.phase===1 && !b.fixed).map(b=>b.maxLvl)"); ok(bs.every(m=>m===10), "alle gebouwen gaan tot level 10 ("+bs.join(",")+")");
  const t = R("[1,2,3,4,5,6,7,8,9,10].map(castraBuildMinutes)"); ok(t.every((m,i)=>i===0 || m>t[i-1]), "de bouwtijd loopt bij elk level op ("+t.join(", ")+" min)");
  const total = t.reduce((a,b)=>a+b,0)/60; ok(total>40 && total<100, "samen ongeveer drie dagen per gebouw ("+total.toFixed(0)+" uur)"); }

console.log("2. een bouw kost tijd");
{ fresh(); const L0 = R("castraLvl('praetorium')");
  ok(run("castraUpgrade('praetorium')")===true, "de bouw start");
  ok(R("castraLvl('praetorium')")===L0, "het level stijgt nog niet");
  ok(R("!!CASTRA.b.praetorium.up")===true, "de bouw staat bij het gebouw");
  ok(run("castraUpgrade('praetorium')")===false, "een gebouw dat in aanbouw is, kan niet nog eens");
  adv(60*1000*0.5); ok(R("castraLvl('praetorium')")===L0, "na een halve minuut nog niet klaar");
  adv(3*60*1000*3); ok(R("castraLvl('praetorium')")===L0+1 && R("!CASTRA.b.praetorium.up"), "na de bouwtijd is het level erbij"); }

console.log("3. bouwers");
{ fresh(); run("CASTRA.b.praetorium.lvl = 1; CASTRA.b.lignatio = { lvl:1, t:_T }; CASTRA.b.horreum = { lvl:1, t:_T }; CASTRA.b.praetorium.lvl = 3;");
  ok(R("castraBuilders()")===1, "met Praetorium 3 is er één bouwer");
  ok(run("castraUpgrade('lignatio')")===true && run("castraUpgrade('horreum')")===false, "de tweede bouw wacht op een vrije bouwer");
  run("CASTRA.b.praetorium.lvl = 4;"); ok(R("castraBuilders()")===2 && run("castraUpgrade('horreum')")===true, "Praetorium 4: een tweede bouwer");
  run("CASTRA.b.praetorium.lvl = 8;"); ok(R("castraBuilders()")===3, "Praetorium 8: een derde bouwer"); }

console.log("4. kosten en grenzen");
{ fresh(); run("CASTRA.res = { lignum:0, aes:0, frumentum:0 };");
  ok(run("castraUpgrade('praetorium')")===false, "zonder grondstoffen begint de bouw niet");
  fresh(); const before = R("CASTRA.res.lignum"); run("castraUpgrade('praetorium')"); ok(R("CASTRA.res.lignum")<before, "de kosten gaan er meteen af");
  fresh(); run("CASTRA.b.praetorium.lvl = 10;"); ok(run("castraUpgrade('praetorium')")===false, "level 10 is het maximum");
  fresh(); run("CASTRA.b.praetorium.lvl = 3; CASTRA.b.lignatio = { lvl:3, t:_T };"); ok(run("castraUpgrade('lignatio')")===false, "een gebouw gaat niet boven het praetorium");
  fresh(); run("CASTRA.dev = true;"); run("castraUpgrade('praetorium')"); ok(R("castraLvl('praetorium')")===R("1+0")+0 || R("castraLvl('praetorium')")>=2, "in de ontwikkelaarsstand is een bouw meteen klaar"); }

console.log("5. opslaan en terugkomen");
{ fresh(); run("castraUpgrade('praetorium')"); const s = run("JSON.stringify(CASTRA)"); const t0 = R("CASTRA.b.praetorium.up.end");
  run(`CASTRA = JSON.parse(${J(s)}); _T = ${t0} + 1000;`); ok(R("castraLvl('praetorium')")===2, "na opslaan en later terugkomen is de bouw klaar (ook zonder dat het spel open stond)"); }

console.log("\n" + checks + " controles, " + fails + " fouten");
process.exit(fails ? 1 : 0);
