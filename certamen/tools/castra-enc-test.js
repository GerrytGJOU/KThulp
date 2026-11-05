/* Test van de ontmoetingen (castra-enc.js): slottabellen, praetoriumgrens, veilige stappen, suffimentum en vissen.
   node tools/castra-enc-test.js   (vanuit certamen/; exitcode 1 bij fouten) */
const { load } = require("./castra-colo-node.js"), vm = require("vm");
const w = load({ H(){} }); if(w.errs.length){ console.error(w.errs); process.exit(1); }
const run = s => vm.runInContext(s, w.ctx), J = x => JSON.stringify(x), R = s => JSON.parse(J(run(s)));
let fails = 0, checks = 0; const ok = (c, m)=>{ checks++; if(!c){ fails++; console.log("  FOUT  " + m); } };
const fresh = ()=>run(`CASTRA = castraNewState(); CASTRA.dev = true; CASTRA_W_UI = { px:5, py:5, dir:"up", frame:1, moving:false, scale:1 }; CASTRA.b.praetorium = { lvl:6, t:0 }; CASTRA_PHASE_FORCE = "dies";`);        // overdag: 's nachts verandert castra-dayn.js de ontmoetingen (meer mythische wezens)
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

console.log("5. schimmen alleen op het kerkhof en in de catacomben van Roma");
{ const bad = R(`(function(){ const out = []; Object.keys(CASTRA_VENATIO).forEach(r=>CASTRA_VENATIO[r].terrains.forEach(t=>{ if(t.myth && t.myth.taks.includes("Schimmen") && !(r==="roma" && (t.id==="sepulcretum"||t.id==="catacumbae"))) out.push(r+"/"+t.id); })); return out; })()`);
  ok(bad.length===0, "Schimmen (Umbra, Lemur, Larva) leven alleen in roma/sepulcretum en roma/catacumbae"+(bad.length?" (ook in: "+bad.join(", ")+")":""));
  ok(R(`["sepulcretum","catacumbae"].every(id=>castraEncTableView("roma", id).some(s=>s.myth && CASTRA_FORMS[s.form].tak==="Schimmen"))`), "beide Roma-terreinen hebben schimmen in hun tabel");
  ok(R(`CASTRA_WORLDS.roma.zones.some(z=>z.t==="sepulcretum")`), "het kerkhof is een zone op de kaart van Roma"); }

console.log("6. mythische wezens alleen op verborgen plekken en in grotten");
{ const TAKS = R(`[...new Set(CASTRA_FORM_LIST.filter(f=>f.volk==="myt" && f.tak!=="Bazen").map(f=>f.tak))]`);
  // elke tak heeft minstens één plek
  const where = R(`(function(){ const o = {}; Object.keys(CASTRA_VENATIO).forEach(r=>CASTRA_VENATIO[r].terrains.forEach(t=>{ if(t.myth) t.myth.taks.forEach(k=>{ (o[k] = o[k]||[]).push(r+"/"+t.id); }); })); return o; })()`);
  TAKS.forEach(k=>ok((where[k]||[]).length>=1, "de tak "+k+" heeft minstens één plek ("+(where[k]||[]).join(", ")+")"));
  // de gewone zones hebben geen wezens meer
  const generic = R(`(function(){ const bad = []; Object.keys(CASTRA_VENATIO).forEach(r=>CASTRA_VENATIO[r].terrains.forEach(t=>{ if(t.myth && !(t.hidden || CASTRA_MYTH_CAVES.includes(t.id) || (r==="graecia" && t.id==="mons"))) bad.push(r+"/"+t.id); })); return bad; })()`);
  ok(generic.length===0, "alleen grotten, verborgen plekken en de Pelion hebben wezens"+(generic.length ? " (ook: "+generic.join(", ")+")" : ""));
  // een mythisch slot trekt alleen een vorm van de plek zelf
  const stray = R(`(function(){ const bad = []; Object.keys(CASTRA_VENATIO).forEach(r=>CASTRA_VENATIO[r].terrains.forEach(t=>{ castraEncTableView(r, t.id).forEach(s=>{ const f = CASTRA_FORMS[s.form]; if(s.myth && !(t.myth.taks.includes(f.tak) && (!t.myth.forms || t.myth.forms.includes(f.id)))) bad.push(r+"/"+t.id+": "+f.id); if(!s.myth && f.volk==="myt") bad.push(r+"/"+t.id+": gewoon slot met "+f.id); }); })); return bad.slice(0,5); })()`);
  ok(stray.length===0, "elk mythisch slot hoort bij de tak en vormen van zijn plek"+(stray.length ? " ("+stray.join("; ")+")" : ""));
  // 's nachts komen er buiten die plekken geen wezens bij
  run(`CASTRA_PHASE_FORCE = "nox";`);
  const leak = R(`(function(){ let n = 0; Object.keys(CASTRA_VENATIO).forEach(r=>{ const reg = CASTRA_VENATIO[r]; reg.terrains.filter(t=>!t.myth).forEach(t=>{ const rng = castraRng(777); for(let i=0;i<400;i++){ const p = castraWildPick(reg, t, rng); if(p.form.volk==="myt") n++; } }); }); return n; })()`);
  ok(leak===0, "'s nachts lekken geen wezens uit gewone zones ("+leak+")");
  // de tijd van een plek: een Sirenen-plek is overdag leeg van wezens
  run(`CASTRA_PHASE_FORCE = "dies";`);
  const day = R(`(function(){ const reg = CASTRA_VENATIO.graecia, t = reg.terrains.find(x=>x.id==="anthemoessa"), rng = castraRng(5); let n = 0; for(let i=0;i<600;i++){ if(castraWildPick(reg, t, rng).form.volk==="myt") n++; } return n; })()`);
  run(`CASTRA_PHASE_FORCE = "nox";`);
  const night = R(`(function(){ const reg = CASTRA_VENATIO.graecia, t = reg.terrains.find(x=>x.id==="anthemoessa"), rng = castraRng(5); let n = 0; for(let i=0;i<600;i++){ if(castraWildPick(reg, t, rng).form.volk==="myt") n++; } return n; })()`);
  ok(day===0 && night>60, "de Sirenen van Anthemoessa zijn er 's nachts ("+night+" van 600), overdag niet ("+day+")");
  run(`CASTRA_PHASE_FORCE = "dies";`);
  // elke regio heeft een raadgever met hints in het Latijn (met vertaling)
  const regs = R("Object.keys(CASTRA_WORLDS).filter(r=>!CASTRA_WORLDS[r].interior)");
  const hint = R(`(function(){ const out = {}; Object.keys(CASTRA_WORLDS).filter(r=>!CASTRA_WORLDS[r].interior).forEach(r=>{ const e = CASTRA_WENT.find(x=>x.id==="raad_"+r); out[r] = e ? (e.say||[]).filter(l=>l.la && l.nl).length : 0; }); return out; })()`);
  regs.forEach(r=>ok(hint[r]>=2, r+": een raadgever met "+hint[r]+" hints in het Latijn"));
  // de plekken hebben hoog gras met hun eigen terrein
  const tallOk = R(`(function(){ const bad = []; Object.keys(CASTRA_MYTH_RECTS).forEach(r=>{ CASTRA_W_REGION = r; CASTRA_WORLD_BUILT = {}; const B = castraWorldBuilt(); CASTRA_MYTH_RECTS[r].forEach(z=>{ let n = 0; Object.keys(B.tall).forEach(k=>{ if(B.tall[k]===z.id) n++; }); if(n<3) bad.push(r+"/"+z.id+" ("+n+")"); }); }); return bad; })()`);
  ok(tallOk.length===0, "elke verborgen plek heeft hoog gras met zijn eigen terrein"+(tallOk.length ? " (te weinig: "+tallOk.join(", ")+")" : "")); }

console.log("7. balans van het wild (castra-troops.js: CASTRA_WILD_CAP)");
{ fresh(); run(`CASTRA_PHASE_FORCE = "dies"; CASTRA.b.praetorium = { lvl:6, t:0 };`);
  const mk = (line,lvl)=>`Object.assign(castraRollSoldier(${J(line)}), { lvl:${lvl} })`;
  const sample = (party, rid)=>{ run(`CASTRA.soldiers = [${party.map(p=>mk(p[0],p[1])).join(",")}]; CASTRA.party = CASTRA.soldiers.map(s=>s.id);`);
    return R(`(function(){ const reg = CASTRA_VENATIO[${J(rid)}], rng = castraRng(31); const best = castraPartyBest(); let maxTier = 0, maxRatio = 0, maxLvl = 0;
      for(let i=0;i<2000;i++){ const t = reg.terrains[i%reg.terrains.length], p = castraWildPick(reg, t, rng); maxTier = Math.max(maxTier, p.form.tier); maxLvl = Math.max(maxLvl, p.lvl);
        if(p.lvl>1) maxRatio = Math.max(maxRatio, castraPowerOf(p.form.id, p.lvl)/best.power); }
      return { maxTier, maxRatio, maxLvl }; })()`); };
  const r1 = sample([["rom_tiro",11]], "latium");
  ok(r1.maxTier===1, "alleen rekruten in je team: alleen tier 1 in het wild (hoogste tier "+r1.maxTier+")");
  ok(r1.maxRatio<=1.3+1e-9, "een wilde vijand is nooit meer dan 30% sterker dan je sterkste soldaat (max "+r1.maxRatio.toFixed(2)+"x)");
  const r2 = sample([["rom_tiro",11],["rom_hastatus",20]], "latium");
  ok(r2.maxTier===2, "met een tier 2-soldaat in je team komt tier 2 in het wild (hoogste tier "+r2.maxTier+")");
  ok(r2.maxLvl<=run("CASTRA_VENATIO.latium.max")+2, "Latium: ook tier 2 blijft binnen het level van het land + 2 (hoogste "+r2.maxLvl+")");
  const r3 = sample([["rom_tiro",5]], "graecia");
  ok(r3.maxRatio<=1.3+1e-9, "ook in een zwaar land word je niet meteen afgestraft met een zwakke soldaat (max "+r3.maxRatio.toFixed(2)+"x)"); }

console.log("\n" + checks + " controles, " + fails + " fouten");
process.exit(fails ? 1 : 0);
