/* Test van het trainerzicht (castra-train.js): richting, zichtlijn, afstand, obstakels en of elke trainer ooit iemand kan zien.
   node tools/castra-train-test.js   (vanuit certamen/; exitcode 1 bij fouten) */
const { load } = require("./castra-colo-node.js"), vm = require("vm");
const w = load({ H(){} }); if(w.errs.length){ console.error(w.errs); process.exit(1); }
const run = s => vm.runInContext(s, w.ctx), J = x => JSON.stringify(x), R = s => JSON.parse(J(run(s)));
let fails = 0, checks = 0; const ok = (c, m)=>{ checks++; if(!c){ fails++; console.log("  FOUT  " + m); } };
run("CASTRA = castraNewState(); CASTRA.dev = true;");
const trainers = R(`CASTRA_WENT.filter(e=>e.kind==="trainer").map(e=>({ id:e.id, region:e.region, x:e.x, y:e.y }))`);
ok(trainers.length===31, "31 trainers ("+trainers.length+")");

console.log("1. richting en zichtlijn");
{ const t = trainers.find(t=>t.region==="latium"); run(`CASTRA_W_REGION = "latium"; CASTRA_WORLD_BUILT = {};`);
  const e = `CASTRA_WENT.find(x=>x.id===${J(t.id)})`, dir = run(`castraTrainerDir(${e})`), dx = dir==="right"?1:-1;
  ok(dir===(t.x<32?"right":"left"), t.id+": kijkt naar het midden van de kaart ("+dir+")");
  const blocked = (x,y)=>run(`castraWBlocked(${x},${y})`);
  // zoek een vrije rij voor hem
  let clear = 0; for(let i=1;i<=4;i++) if(!blocked(t.x+dx*i, t.y)) clear++; else break;
  const sees = (x,y)=>run(`castraTrainerSees(${e}, ${x}, ${y})`);
  if(clear>=2){
    ok(sees(t.x+dx*2, t.y)===true, "ziet je twee tegels voor zich");
    ok(sees(t.x+dx*1, t.y)===true, "ziet je vlak voor zich");
    ok(sees(t.x-dx*3, t.y)===false, "ziet je niet achter zich");
    ok(sees(t.x+dx*2, t.y+1)===false, "ziet je niet in een andere rij");
  }
  ok(sees(t.x+dx*5, t.y)===false, "ziet je niet verder dan "+run("CASTRA_TRAIN_SIGHT")+" tegels");
  ok(sees(t.x, t.y+1)===true && sees(t.x-1, t.y-1)===true, "ziet je als je vlak naast hem staat, ook schuin of achter hem");
  ok(sees(t.x+dx*2, t.y)===sees(t.x+dx*2, t.y), "ziet is deterministisch");
}

console.log("2. een obstakel ertussen blokkeert het zicht");
{ // zoek een trainer met een vrij stuk voor zich en zet er een boom (via een tijdelijke blokkade) tussen
  const t = trainers.find(t=>t.region==="graecia"); run(`CASTRA_W_REGION = "graecia"; CASTRA_WORLD_BUILT = {};`);
  const e = `CASTRA_WENT.find(x=>x.id===${J(t.id)})`, dx = run(`castraTrainerDir(${e})`)==="right"?1:-1;
  const tx = t.x+dx*2, ty = t.y;
  if(!run(`castraWBlocked(${t.x+dx}, ${t.y}) || castraWBlocked(${tx}, ${ty})`)){
    ok(run(`castraTrainerSees(${e}, ${tx}, ${ty})`)===true, "zicht aan tot de tegel erachter");
    run(`castraWorldBuilt().blocked[${J((t.x+dx)+","+t.y)}] = 1;`);
    ok(run(`castraTrainerSees(${e}, ${tx}, ${ty})`)===false, "een obstakel op de tussenliggende tegel blokkeert het zicht");
    run(`delete castraWorldBuilt().blocked[${J((t.x+dx)+","+t.y)}];`);
  }
}

console.log("3. elke trainer kan ooit iemand zien");
trainers.forEach(t=>{
  run(`CASTRA_W_REGION = ${J(t.region)}; CASTRA_WORLD_BUILT = {};`);
  const e = `CASTRA_WENT.find(x=>x.id===${J(t.id)})`, dx = run(`castraTrainerDir(${e})`)==="right"?1:-1;
  // minstens één begaanbare tegel vlak voor hem binnen bereik, zodat de speler daar kan staan
  const spots = []; for(let i=1;i<=run("CASTRA_TRAIN_SIGHT");i++){ if(run(`castraWBlocked(${t.x+dx*i}, ${t.y})`)) break; spots.push(i); }
  ok(spots.length>=2, t.id+" op "+t.x+","+t.y+" kijkt "+(dx>0?"rechts":"links")+" maar heeft maar "+spots.length+" vrije tegel(s) voor zich");
  ok(spots.every(i=>run(`castraTrainerSees(${e}, ${t.x+dx*i}, ${t.y})`)), t.id+": ziet niet alle vrije tegels voor zich");
  // de weg ligt binnen zijn zicht: dan kun je hem niet missen als je over de weg loopt
  const onRoad = R(`(function(){ const W = castraWorldCfg(); for(let i=1;i<=CASTRA_TRAIN_SIGHT;i++){ const x = ${t.x}+${dx}*i; if(W.roads.some(r=>x>=r.x0&&x<=r.x1&&${t.y}>=r.y0&&${t.y}<=r.y1)) return true; } return false; })()`);
  ok(onRoad, t.id+": geen weg binnen zijn zicht ("+t.region+", rij "+t.y+")");
});

console.log("4. verslagen trainer en lopen");
{ run(`CASTRA_W_REGION = "latium"; CASTRA_WORLD_BUILT = {};`);
  const e = `CASTRA_WENT.find(x=>x.id==="trainer_latium0")`;
  ok(run(`castraTrainerDone(${e})`)===false, "vers: niet verslagen");
  run(`CASTRA.wday = { trainer_trainer_latium0:castraWDay() }`); ok(run(`castraTrainerDone(${e})`)===true, "na verslaan: vandaag klaar");
  ok(typeof run("castraTrainerApproach")==="function" && typeof run("castraTrainerWalkClear")==="function", "loop- en opruimfuncties bestaan");
}

console.log("\n" + checks + " controles, " + fails + " fouten");
process.exit(fails ? 1 : 0);
