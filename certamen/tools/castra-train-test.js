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
  ok(sees(t.x+dx*(run("CASTRA_TRAIN_SIGHT")+1), t.y)===false, "ziet je niet verder dan "+run("CASTRA_TRAIN_SIGHT")+" tegels");
  ok(sees(t.x, t.y+1)===false && sees(t.x, t.y-1)===false, "ziet je niet als je boven of onder hem staat");
  ok(sees(t.x+dx, t.y+1)===false && sees(t.x+dx, t.y-1)===false, "ziet je niet schuin voor zich");
  ok(sees(t.x-dx, t.y)===false, "ziet je niet vlak achter zich");
  ok(sees(t.x+dx, t.y)===true, "ziet je vlak voor zich");
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

console.log("5. een trainer met meerdere soldaten");
{ run(`CASTRA = castraNewState(); CASTRA.dev = true; var _html = ""; H = function(h){ _html = h; }; if(typeof iconSVG==="undefined") iconSVG = ()=>"<svg></svg>"; if(typeof brand==="undefined") brand = ()=>""; if(typeof foot==="undefined") foot = ()=>""; CASTRA.soldiers = [ castraRollSoldier("rom_hastatus") ]; CASTRA.soldiers[0].id = "s0"; CASTRA.soldiers[0].lvl = 10;`);
  ok(run('castraTrainerCount("latium")')===2 && run('castraTrainerCount("graecia")')===3, "twee soldaten in Latium, daarna drie");
  const mk = ()=>run(`(function(){ const party = [ { form:"rom_tiro", lvl:5 }, { form:"rom_tiro", lvl:6 }, { form:"rom_tiro", lvl:7 } ];
    const V = castraForcedEncounter("latium", "silva", { form:party[0].form, lvl:party[0].lvl, boss:{ key:"trainer_testtr", reward:{ aes:50, frumentum:30 }, gloria:2, pxp:12, why:"t", trainer:{ nm:"Venator Test", tk:0, look:castraTrainerLook(CASTRA_WENT.find(e=>e.kind==="trainer")), party, idx:0 } } });
    V.fromWorld = true; V.log = []; V.round = 0; CASTRA_V = V; return 1; })()`);
  mk(); ok(run("castraTrainerOf(CASTRA_V).party.length")===3 && run("CASTRA_V.trainer.idx")===0, "de trainer heeft drie soldaten en begint bij de eerste");
  run('castraVRender("scout")'); const intro = run("_html");
  ok(/Venator Test/.test(intro) && /tres milites habet/.test(intro) && (intro.match(/🛡️/g)||[]).length>=3, "eerst de intro: naam en drie soldaten, nog geen vijand");
  ok(!/castraVFight\(/.test(intro), "de intro toont nog geen keuze van je soldaat");
  run("castraTrainerGo()"); ok(/castraVFight\(/.test(run("_html")), "na Perge kies je welke soldaat je stuurt");
  // tussentijds winnen: geen trainerbeloning, wel gewone ervaring
  const day0 = run("JSON.stringify(CASTRA.wday||{})");
  run(`CASTRA_V.mine = CASTRA.soldiers[0]; CASTRA_V.myStats = castraStats(CASTRA.soldiers[0]); CASTRA_V.myType = "inf"; CASTRA_V.myMax = 100; CASTRA_V.myHp = 80; CASTRA_V.dmgTaken = 10; CASTRA_V.over = "win"; castraVFinish();`);
  ok(run("JSON.stringify(CASTRA.wday||{})")===day0 && run("!!CASTRA_V.boss")===true, "een tussentijdse winst telt niet als de trainer verslaan (geen dagmarkering, boss blijft bewaard)");
  run('castraVRender("result")'); const next = run("_html");
  ok(/Venator Test/.test(next) && /Adhuc duos milites habet/.test(next) && /castraTrainerNext\(\)/.test(next) && !/castraVBack\(\)/.test(next), "daarna: de trainer heeft nog twee soldaten en de knop gaat naar de volgende");
  ok((next.match(/✖/g)||[]).length===1, "één soldaat is verslagen (✖)");
  run("castraTrainerNext()"); ok(run("CASTRA_V.trainer.idx")===1 && run("CASTRA_V.enemy.lvl")===6, "de tweede soldaat komt in het veld (gradus 6)");
  ok(/castraVFight\(/.test(run("_html")), "je kiest opnieuw wie je stuurt");
  run("Object.assign(CASTRA_V,{ mine:CASTRA.soldiers[0], myStats:castraStats(CASTRA.soldiers[0]), myType:'inf', stats:castraStats(CASTRA_V.enemy), enType:castraLine(CASTRA_V.enemy.line).type }); castraMvInit(CASTRA_V);");
  ok(run("CASTRA_V.s.en.dots")==="●●○", "naast de naam van de vijand staan de soldaten ●●○ ("+run("CASTRA_V.s.en.dots")+")");
  ok(/●●○/.test(run("castraMvStatus(CASTRA_V.s.en)")), "castraMvStatus toont ze");
  run("CASTRA_V.trainer.idx = 2; CASTRA_V.over = null; castraVRender('scout')"); ok(/castraVFight\(/.test(run("_html")), "bij de laatste soldaat geen intro meer");
  run(`CASTRA_V.mine = CASTRA.soldiers[0]; CASTRA_V.over = "win"; CASTRA_V.myMax = 100; CASTRA_V.myHp = 90; CASTRA_V.dmgTaken = 0; castraVFinish(); castraVRender("result");`);
  ok(!/castraTrainerNext/.test(run("_html")) && /castraVBack\(\)/.test(run("_html")), "na de laatste soldaat is het gewone resultaat te zien (Perge naar de wereld)");
  ok(run("(CASTRA.wday||{}).trainer_testtr")!==undefined, "en dan is de trainer voor vandaag verslagen"); }

console.log("\n" + checks + " controles, " + fails + " fouten");
process.exit(fails ? 1 : 0);
