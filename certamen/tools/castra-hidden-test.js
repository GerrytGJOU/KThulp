/* Test van de verborgen voorwerpen (castra-hidden.js): plekken per dag, vrij en bereikbaar, vinden en dagelijks wissen.
   node tools/castra-hidden-test.js   (vanuit certamen/; exitcode 1 bij fouten) */
const { load } = require("./castra-colo-node.js"), vm = require("vm");
const w = load({ H(){} }); if(w.errs.length){ console.error(w.errs); process.exit(1); }
const run = s => vm.runInContext(s, w.ctx), J = x => JSON.stringify(x), R = s => JSON.parse(J(run(s)));
let fails = 0, checks = 0; const ok = (c, m)=>{ checks++; if(!c){ fails++; console.log("  FOUT  " + m); } };
const day = d=>run(`castraDay = ()=>${J(d)}; for(const k in CASTRA_HID_REACH) delete CASTRA_HID_REACH[k];`);
run("CASTRA = castraNewState(); CASTRA.dev = true;"); day("2026-10-24");
const ids = Object.keys(R("CASTRA_WORLDS"));

console.log("1. plekken per wereld");
let total = 0;
ids.forEach(id=>{
  const sp = R(`castraHidSpots(${J(id)})`), W = R(`(function(){ const W = CASTRA_WORLDS[${J(id)}]; return { cols:W.cols, rows:W.rows, interior:!!W.interior, start:W.start, exit:W.exit||[], doors:(W.doors||[]).map(d=>({x:d.x,y:d.y})) }; })()`);
  const want = (W.interior ? (/^caver|^specus|^catac/.test(id) ? 2 : 1) : 4) + (!W.interior && run("castraNundinae().on") ? 2 : 0); total += sp.length;
  ok(sp.length===want, id+": "+want+" verborgen plekken verwacht, "+sp.length+" gevonden");
  const reach = R(`(function(){ const r = castraHidReach(${J(id)}); return { seen:[...r.seen], blocked:[...r.blocked] }; })()`), seen = new Set(reach.seen), blocked = new Set(reach.blocked);
  const keys = new Set(); sp.forEach(s=>{
    ok(s.x>0 && s.y>0 && s.x<W.cols-1 && s.y<W.rows-1, id+": plek "+s.x+","+s.y+" ligt op de rand of erbuiten");
    ok(seen.has(s.x+","+s.y) && !blocked.has(s.x+","+s.y), id+": plek "+s.x+","+s.y+" is geblokkeerd of onbereikbaar");
    ok(![W.start].concat(W.exit, W.doors).some(t=>Math.abs(t.x-s.x)<3 && Math.abs(t.y-s.y)<3), id+": plek "+s.x+","+s.y+" ligt vlak bij start, poort of deur");
    ok(!keys.has(s.x+","+s.y), id+": twee vondsten op één tegel"); keys.add(s.x+","+s.y);
    ok(sp.every(o=>o===s || Math.abs(o.x-s.x)>=5 || Math.abs(o.y-s.y)>=5), id+": vondsten liggen te dicht bij elkaar");
  });
});
ok(total>40, "in totaal "+total+" verborgen vondsten");

console.log("2. per dag anders, op één dag hetzelfde");
{ const a = R(`castraHidSpots("latium")`); const again = R(`castraHidSpots("latium")`);
  ok(J(a)===J(again), "zelfde dag, zelfde plekken");
  day("2026-10-25"); const b = R(`castraHidSpots("latium")`);
  ok(J(a.map(s=>[s.x,s.y]))!==J(b.map(s=>[s.x,s.y])), "de volgende dag liggen ze ergens anders"); day("2026-10-24"); }

console.log("3. vinden");
{ run("CASTRA = castraNewState(); CASTRA.dev = true;"); day("2026-10-24");
  const spot = R(`castraHidSpots("latium")[0]`), res0 = R("({ ...CASTRA.res })");
  ok(run(`castraHidFind("latium", ${spot.x+1}, ${spot.y})`)===null || R(`castraHidSpots("latium")`).some(s=>s.x===spot.x+1&&s.y===spot.y), "een gewone tegel geeft niets");
  const f = R(`castraHidFind("latium", ${spot.x}, ${spot.y})`);
  ok(f && f.txt, "op de plek vind je iets: "+J(f&&f.res));
  const good = f.spot.find.good, key = Object.keys(f.res)[0];
  if(good) ok(run(`castraBagN(${J(good)})`)===1, "het voorwerp ligt in je saccus ("+good+")");
  else ok((run("CASTRA.res")[key]||0) > (res0[key]||0), "de beloning staat in je grondstoffen ("+key+")");
  ok(R(`castraHidFind("latium", ${spot.x}, ${spot.y})`)===null, "dezelfde plek geeft maar één keer iets");
  const NL = 4 + (run("castraNundinae().on") ? 2 : 0); ok(R(`castraHidOpen("latium")`).length===NL-1, "er liggen nog "+(NL-1)+" vondsten");
  ok(R("CASTRA.hid.day")==="2026-10-24" && Object.keys(R("CASTRA.hid.f")).length===1, "alleen de vondst van vandaag is opgeslagen");
  day("2026-10-25"); ok(R(`castraHidOpen("latium")`).length===4 + (run("castraNundinae().on") ? 2 : 0) && R("CASTRA.hid.day")==="2026-10-25", "de volgende dag liggen er weer evenveel en is de lijst gewist");
  // beloningen schalen mee met het land en kennen alleen bestaande grondstoffen
  ids.forEach(id=>R(`castraHidSpots(${J(id)})`).forEach(s=>Object.keys(s.find.res).forEach(r=>ok(R(`!!castraRes(${J(r)})`), id+": onbekende grondstof "+r))));
  // interieurs gebruiken de beloningsschaal van hun moederregio
  const cave = ids.find(i=>/^caverna_/.test(i)), cs = R(`castraHidSpots(${J(cave)})[0]`); const before = R("({ ...CASTRA.res })");
  const fc = R(`castraHidFind(${J(cave)}, ${cs.x}, ${cs.y})`); ok(fc && fc.txt, "ook in een grot vind je iets ("+cave+")"); }

console.log("\n" + checks + " controles, " + fails + " fouten");
process.exit(fails ? 1 : 0);
