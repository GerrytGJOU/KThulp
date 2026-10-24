/* Wereldtest voor Castra Heroum: bereikbaarheid, softlocks en dode verwijzingen in alle werelden (regio's en binnenruimtes).
   Draait in Node zonder browser (laadt het spel met de DOM-stub van castra-colo-node.js):
     node tools/castra-world-test.js            // vanuit certamen/; exitcode 1 bij fouten
     node tools/castra-world-test.js --verbose  // ook de waarschuwingen en de aantallen
   Wat er wordt gecontroleerd (FOUT = stopt de test, WAARSCHUWING = bekend of bewust):
     1  elke wereld bouwt, de startplek ligt binnen de kaart en is vrij
     2  entiteiten: binnen de kaart, uniek id, niet op een vaste obstakel-tegel, niet twee op één tegel, bekende soort
     3  bereikbaarheid (BFS vanaf de start): elke entiteit en elke deur is bereikbaar, ook met alle versperringen open
     4  deuren: bestemming bestaat, de terugweg bestaat, de aankomsttegel is vrij en leidt weer naar de uitgang
     5  poorten tussen regio's: symmetrisch, de poorttegels zijn bereikbaar, de aankomsttegel in de buurregio is vrij
     6  versperringen: elke versperring heeft een oplossing (een klasse in het leger of arbeiders huren) en blokkeert geen enkel ander pad voorgoed
     7  opdrachten (zijquests, heldenketens): gevers, regio's, terreinen, missies, voorwerpen en bazen bestaan
     8  hoofdroute: elke regio is bereikbaar vanuit het kamp en de vereiste missies bestaan                                           */
const { load } = require("./castra-colo-node.js"), vm = require("vm");
const w = load({ H(){} }); if(w.errs.length){ console.error(w.errs); process.exit(1); }
const run = s => vm.runInContext(s, w.ctx), J = x => JSON.stringify(x);
const VERBOSE = process.argv.includes("--verbose");
let fails = 0, warns = 0, checks = 0;
const ok = (c, m)=>{ checks++; if(!c){ fails++; console.log("  FOUT  " + m); } };
const warn = (c, m)=>{ if(!c){ warns++; if(VERBOSE) console.log("  waarschuwing  " + m); } };
run("CASTRA = castraNewState();");

// Alles uit het spel halen, in twee toestanden: OPEN (alle missies gewonnen, alle veldpoorten opgeruimd, alles ontgrendeld) en DICHT (verse save).
// Fouten gaan over de open toestand (er is dan niets dat een doorgang blokkeert); de dichte toestand levert de waarschuwingen.
function snapshot(open){
  run("CASTRA = castraNewState(); CASTRA.dev = true; CASTRA_WORLD_BUILT = {};" + (open ? `
    CASTRA.proelium = CASTRA.proelium || { done:{} }; CASTRA.proelium.done = CASTRA.proelium.done || {}; CASTRA_P_MISSIONS.forEach(m=>CASTRA.proelium.done[m.id] = true);
    CASTRA.wgate = {}; CASTRA_WENT.filter(e=>e.kind==="veld" && e.gate).forEach(e=>CASTRA.wgate[e.id] = 1);` : ""));
  return JSON.parse(run(`JSON.stringify((function(){
    const worlds = {};
    Object.keys(CASTRA_WORLDS).forEach(id=>{
      const W = CASTRA_WORLDS[id]; let built = null, err = null;
      try{ CASTRA_W_REGION = id; built = castraWorldBuilt(); }catch(e){ err = String(e.message||e); }
      worlds[id] = { id, cols:W.cols, rows:W.rows, start:W.start, interior:!!W.interior, parent:W.parent||null, doors:(W.doors||[]).map(d=>({ x:d.x, y:d.y, to:d.to, spawn:d.spawn||null })),
        exit:W.exit||[], err, blocked: built ? Object.keys(built.blocked) : [], tall: built ? Object.keys(built.tall||{}) : [], zones:(W.zones||[]).map(z=>z.t) };
    });
    const heroTiles = {};
    Object.keys(CASTRA_NPCS).forEach(h=>{ const n = CASTRA_NPCS[h]; (heroTiles[n.region] = heroTiles[n.region] || []).push({ id:h, x:n.world.x, y:n.world.y }); });
    const went = CASTRA_WENT.map(e=>({ ...e, visible:!!castraWEntVisible(e) }));
    return { worlds, heroTiles, went };
  })())`));
}
const OPEN = snapshot(true), CLOSED = snapshot(false);
const data = { ...OPEN, ...JSON.parse(run(`JSON.stringify({
  geo: CASTRA_GEO, needs: CASTRA_REGION_NEEDS,
  missions: CASTRA_P_MISSIONS.map(m=>({ id:m.id, region:m.region })), items: Object.keys(CASTRA_ITEMS),
  qdefs: CASTRA_QDEFS.map(q=>({ id:q.id, giver:q.giver, region:q.region, steps:q.steps, reward:q.reward })),
  amb: CASTRA_AMB_TYPES.map(t=>t.id), heroes: Object.keys(CASTRA_HERO_DATA).map(h=>({ id:h, region:CASTRA_HERO_DATA[h].region||"latium", chain:CASTRA_HERO_DATA[h].chain||[] })),
  gatekeep: Object.keys(CASTRA_GATEKEEP||{}), fieldNeeds: typeof CASTRA_FIELD!=="undefined" ? Object.keys(CASTRA_FIELD) : [],
})`)) };
const spawnFor = (rid, moved)=>JSON.parse(run(`JSON.stringify(castraGeoSpawnFor(${J(rid)}, ${J(moved)}))`));
const gateTiles = (rid, dir)=>JSON.parse(run(`JSON.stringify(castraGeoGateTiles(${J(rid)}, ${J(dir)}))`));
const OPP = { N:"S", S:"N", W:"E", E:"W" };
const ids = Object.keys(data.worlds), K = (x,y)=>x+","+y;
const BLOCKING_KINDS = e=>e.kind!=="pickup";            // zoals castraNpcAt: alles behalve voorwerpen op de grond blokkeert
const GATE_KINDS = e=>e.kind==="block" || (e.kind==="veld" && e.gate);   // versperringen die je kunt opruimen
const ents = {}; OPEN.went.forEach(e=>{ if(e.visible || e.kind==="pickup") (ents[e.region] = ents[e.region] || []).push(e); });
const entsAll = {}; data.went.forEach(e=>{ (entsAll[e.region] = entsAll[e.region] || []).push(e); });
const entsClosed = {}; CLOSED.went.forEach(e=>{ if(e.visible || e.kind==="pickup") (entsClosed[e.region] = entsClosed[e.region] || []).push(e); });
const KNOWN = new Set(["chest","pickup","npc","bld","hub","book","block","boss","sign","veld","trainer"]);

// BFS: welke tegels bereik je vanaf (sx,sy)? gatesOpen = versperringen weg.
function reach(rid, sx, sy, gatesOpen){
  const W = (gatesOpen ? OPEN : CLOSED).worlds[rid], blocked = new Set(W.blocked), list = (gatesOpen ? ents : entsClosed)[rid] || [];
  list.filter(BLOCKING_KINDS);
  list.filter(BLOCKING_KINDS).forEach(e=>blocked.add(K(e.x,e.y))); (data.heroTiles[rid]||[]).forEach(h=>blocked.add(K(h.x,h.y)));
  const seen = new Set(), q = [[sx,sy]]; if(blocked.has(K(sx,sy))) return seen; seen.add(K(sx,sy));
  while(q.length){ const [x,y] = q.shift(); [[1,0],[-1,0],[0,1],[0,-1]].forEach(([dx,dy])=>{ const nx = x+dx, ny = y+dy, k = K(nx,ny); if(nx<0||ny<0||nx>=W.cols||ny>=W.rows||seen.has(k)||blocked.has(k)) return; seen.add(k); q.push([nx,ny]); }); }
  return seen;
}
const adj = (seen, x, y)=>[[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>seen.has(K(x+dx,y+dy)));

console.log("1. werelden bouwen en de start is vrij");
ids.forEach(id=>{
  const W = data.worlds[id];
  ok(!W.err, id+": bouwen mislukt ("+W.err+")"); if(W.err) return;
  ok(W.start.x>=0 && W.start.y>=0 && W.start.x<W.cols && W.start.y<W.rows, id+": start buiten de kaart");
  ok(!W.blocked.includes(K(W.start.x,W.start.y)), id+": start staat op een geblokkeerde tegel");
  ok(!(ents[id]||[]).some(e=>BLOCKING_KINDS(e) && e.x===W.start.x && e.y===W.start.y), id+": een entiteit staat op de start");
});

console.log("2. entiteiten");
{ const seenId = new Set();
  data.went.forEach(e=>{
    ok(!seenId.has(e.id), "dubbel id: "+e.id); seenId.add(e.id);
    ok(data.worlds[e.region], e.id+": onbekende wereld "+e.region); const W = data.worlds[e.region]; if(!W) return;
    ok(Number.isInteger(e.x) && Number.isInteger(e.y) && e.x>=0 && e.y>=0 && e.x<W.cols && e.y<W.rows, e.id+": buiten de kaart ("+e.x+","+e.y+")");
    ok(KNOWN.has(e.kind), e.id+": onbekende soort "+e.kind);
    if(e.kind!=="pickup" && !GATE_KINDS(e)) warn(!W.blocked.includes(K(e.x,e.y)) || e.kind==="hub" || e.kind==="bld", e.id+" ("+e.kind+") staat op een vaste obstakel-tegel");
  });
  ids.forEach(id=>{ const seen = {}; (ents[id]||[]).forEach(e=>{ const k = K(e.x,e.y); ok(!seen[k] || e.kind==="pickup" && seen[k].kind!=="pickup" || seen[k].kind==="pickup", id+": "+e.id+" en "+seen[k]?.id+" staan op één tegel "+k); seen[k] = e; });
    (data.heroTiles[id]||[]).forEach(h=>{ ok(!(ents[id]||[]).some(e=>e.x===h.x&&e.y===h.y&&BLOCKING_KINDS(e)), id+": held "+h.id+" staat op een entiteit"); ok(!data.worlds[id].blocked.includes(K(h.x,h.y)), id+": held "+h.id+" staat op een obstakel"); }); });
}

console.log("3. bereikbaarheid binnen elke wereld");
const reachOpen = {};
ids.forEach(id=>{
  const W = data.worlds[id]; if(W.err) return;
  const spawns = [ W.start ].concat(W.doors.map(d=>d.spawn).filter(Boolean));
  const open = reach(id, W.start.x, W.start.y, true), strict = reach(id, W.start.x, W.start.y, false); reachOpen[id] = open;
  ok(open.size>20, id+": vanaf de start is bijna niets bereikbaar ("+open.size+" tegels)");
  (ents[id]||[]).forEach(e=>{
    if(e.kind==="hub" || GATE_KINDS(e)) { if(!adj(open,e.x,e.y) && !open.has(K(e.x,e.y))) ok(false, id+": "+e.id+" ("+e.kind+") is onbereikbaar"); return; }
    const reachable = e.kind==="pickup" ? open.has(K(e.x,e.y)) : adj(open, e.x, e.y);
    ok(reachable, id+": "+e.id+" ("+e.kind+") op "+e.x+","+e.y+" is onbereikbaar, ook met alle versperringen open");
    if(reachable) warn(e.kind==="pickup" ? strict.has(K(e.x,e.y)) : adj(strict,e.x,e.y), id+": "+e.id+" ligt achter een versperring");
  });
  (data.heroTiles[id]||[]).forEach(h=>ok(adj(open,h.x,h.y), id+": held "+h.id+" is onbereikbaar"));
  W.doors.forEach(d=>ok(open.has(K(d.x,d.y)) || adj(open,d.x,d.y), id+": deur naar "+d.to+" op "+d.x+","+d.y+" is onbereikbaar"));
  W.exit.forEach(t=>ok(open.has(K(t.x,t.y)) || adj(open,t.x,t.y), id+": uitgang "+t.x+","+t.y+" is onbereikbaar"));
});

console.log("4. deuren en binnenruimtes");
ids.forEach(id=>{
  const W = data.worlds[id]; if(W.err) return;
  W.doors.forEach(d=>{
    const T = data.worlds[d.to]; ok(T, id+": deur naar onbekende wereld "+d.to); if(!T) return;
    ok(T.doors.some(b=>b.to===id) || (T.interior && T.exit.length===0 && T.doors.length>0), id+" → "+d.to+": geen terugweg");
    const sp = d.spawn; if(sp){
      ok(sp.x>=0 && sp.y>=0 && sp.x<T.cols && sp.y<T.rows, id+" → "+d.to+": aankomsttegel buiten de kaart");
      ok(!T.blocked.includes(K(sp.x,sp.y)) && !(ents[d.to]||[]).some(e=>BLOCKING_KINDS(e)&&e.x===sp.x&&e.y===sp.y), id+" → "+d.to+": aankomsttegel "+sp.x+","+sp.y+" is geblokkeerd");
      const r = reach(d.to, sp.x, sp.y, true);
      ok(T.doors.some(b=>b.to===id && (r.has(K(b.x,b.y)) || adj(r,b.x,b.y))) || T.exit.some(t=>r.has(K(t.x,t.y))) || T.doors.some(b=>r.has(K(b.x,b.y)) || adj(r,b.x,b.y)), id+" → "+d.to+": vanaf de aankomsttegel kom je niet meer weg (softlock)");
    }
  });
});

console.log("5. poorten tussen regio's");
Object.keys(data.geo).forEach(rid=>{
  const G = data.geo[rid], W = data.worlds[rid]; ok(W, "geo: onbekende regio "+rid); if(!W) return;
  Object.keys(G.links).forEach(dir=>{
    const to = G.links[dir];
    if(to!=="camp"){
      ok(data.geo[to], rid+": poort "+dir+" naar onbekende regio "+to);
      ok(data.geo[to] && data.geo[to].links[OPP[dir]]===rid, rid+" ("+dir+") → "+to+": buurregio verwijst niet terug via "+OPP[dir]);
      const sp = spawnFor(to, dir), T = data.worlds[to];
      if(T){ ok(!T.blocked.includes(K(sp.x,sp.y)) && !(ents[to]||[]).some(e=>BLOCKING_KINDS(e)&&e.x===sp.x&&e.y===sp.y), rid+" → "+to+": aankomsttegel "+sp.x+","+sp.y+" is geblokkeerd");
        ok(reach(to, sp.x, sp.y, true).size>20, rid+" → "+to+": vanaf de aankomsttegel is bijna niets bereikbaar"); }
    }
    const open = reachOpen[rid]; if(open) gateTiles(rid, dir).forEach(t=>ok(open.has(K(t.x,t.y)) || adj(open,t.x,t.y), rid+": poort "+dir+" ("+t.x+","+t.y+") is onbereikbaar"));
    ok(gateTiles(rid, dir).every(t=>W.exit.some(e=>e.x===t.x&&e.y===t.y)), rid+": poort "+dir+" staat niet in de uitgangen");
  });
});

console.log("6. versperringen");
{ const blocks = data.went.filter(GATE_KINDS);
  blocks.forEach(b=>{
    const W = data.worlds[b.region]; if(!W) return;
    if(b.kind==="block"){ ok(data.gatekeep.indexOf(b.key)>=0, b.id+": geen verhaaltekst voor "+b.key); ok(data.geo[b.region] && data.geo[b.region].links[b.key.split("|")[1]]===b.to, b.id+": versperring wijst naar de verkeerde regio"); }
    else ok(["saxum","arbor","ara","tentorium"].indexOf(b.field)>=0 || data.fieldNeeds.indexOf(b.field)>=0, b.id+": onbekende veldactie "+b.field);
  });
  // is een regio nog bereikbaar zonder dat een enkele veldpoort wordt opgeruimd? Dan hoort die poort optioneel te zijn; anders moet er een oplossing zijn.
  ids.filter(id=>!data.worlds[id].interior).forEach(id=>{
    const W = data.worlds[id], strict = reach(id, W.start.x, W.start.y, false), gates = (entsAll[id]||[]).filter(e=>e.kind==="veld"&&e.gate);
    const unreachableClosed = W.exit.filter(t=>!strict.has(K(t.x,t.y)) && !adj(strict,t.x,t.y)).length;
    if(unreachableClosed) ok(gates.length>0 || (entsAll[id]||[]).some(e=>e.kind==="block"), id+": uitgangen zijn dicht zonder dat er een opruimbare versperring staat");
  });
}

console.log("7. opdrachten");
{ const entIds = new Set(data.went.map(e=>e.id)), missionIds = new Set(data.missions.map(m=>m.id)), itemIds = new Set(data.items);
  const hasTerrain = (rid, t)=>{ const own = data.worlds[rid] && data.worlds[rid].zones.indexOf(t)>=0; return own || ids.some(i=>data.worlds[i].parent===rid && data.worlds[i].zones.indexOf(t)>=0) || data.went.some(e=>e.terrain===t && (e.region===rid || (data.worlds[e.region]||{}).parent===rid)); };
  data.qdefs.forEach(q=>{
    const heroQ = /^hero_/.test(q.giver);
    if(heroQ){ ok(data.heroes.some(h=>"hero_"+h.id===q.giver), q.id+": held "+q.giver+" bestaat niet"); }
    else if(q.giver.indexOf("amb:")===0){ const [t, r] = q.giver.slice(4).split("@"); ok(data.amb.indexOf(t)>=0, q.id+": onbekend bewonerstype "+t); ok(data.worlds[r] && !data.worlds[r].interior, q.id+": onbekende regio voor gever "+r); }
    else ok(entIds.has(q.giver), q.id+": gever "+q.giver+" bestaat niet");
    ok(heroQ ? !q.region || data.worlds[q.region] : data.worlds[q.region], q.id+": onbekende regio "+q.region);
    (q.steps||[]).forEach((s, i)=>{ const at = q.id+" stap "+(i+1)+" ("+s.kind+")";
      if(s.region) ok(data.worlds[s.region], at+": onbekende regio "+s.region);
      if(s.kind==="kill" && s.terrain && s.region) warn(hasTerrain(s.region, s.terrain), at+": terrein "+s.terrain+" niet gevonden in "+s.region);
      if(s.kind==="win") ok(missionIds.has(s.mission), at+": onbekende missie "+s.mission);
      if(s.kind==="boss") ok(entIds.has(s.key), at+": baas "+s.key+" bestaat niet");
      if(s.kind==="talk") ok(entIds.has(s.npc) || data.heroes.some(h=>h.id===s.npc), at+": npc "+s.npc+" bestaat niet");
      if(s.kind==="have" && s.item) ok(itemIds.has(s.item), at+": onbekend voorwerp "+s.item);
    });
    if(q.reward && q.reward.item) ok(itemIds.has(q.reward.item), q.id+": beloning met onbekend voorwerp "+q.reward.item);
  });
  data.went.filter(e=>e.item).forEach(e=>ok(itemIds.has(e.item), e.id+": onbekend voorwerp "+e.item));
  data.heroes.forEach(h=>{ ok(data.worlds[h.region], "held "+h.id+": onbekende regio "+h.region);
    h.chain.forEach((s,i)=>{ if(s.kind==="win") ok(missionIds.has(s.mission||s.id), "held "+h.id+" stap "+(i+1)+": onbekende missie "+(s.mission||s.id)); if(s.kind==="kill" && s.terrain) warn(hasTerrain(h.region, s.terrain) || ids.some(i2=>hasTerrain(i2, s.terrain)), "held "+h.id+" stap "+(i+1)+": terrein "+s.terrain+" niet gevonden"); }); });
}

console.log("8. hoofdroute");
{ // Over zee of woestijn reis je met de haven of caravan (hub): elke regio heeft een reisplek en minstens één poort.
  Object.keys(data.geo).forEach(r=>{ ok(data.went.some(e=>e.kind==="hub" && e.region===r), "regio "+r+" heeft geen reisplek"); ok(Object.keys(data.geo[r].links).length>0, "regio "+r+" heeft geen enkele poort"); });
  const missionIds = new Set(data.missions.map(m=>m.id));
  Object.keys(data.needs).forEach(r=>{ const n = data.needs[r]; ok(!n || missionIds.has(n), "regio "+r+" vraagt een onbekende missie "+n); ok(data.geo[r], "CASTRA_REGION_NEEDS: onbekende regio "+r); });
  // elke vereiste missie is zelf te bereiken: ze hoort bij een regio die vóór de volgende open is
  const open = new Set(["latium"]); let grew = true;
  while(grew){ grew = false; Object.keys(data.geo).forEach(r=>{ if(open.has(r)) return; const need = data.needs[r]; const m = need && data.missions.find(x=>x.id===need); if(!need || (m && open.has(m.region))){ open.add(r); grew = true; } }); }
  Object.keys(data.geo).forEach(r=>ok(open.has(r), "regio "+r+" kan nooit opengaan: de vereiste missie ligt in een regio die zelf dicht blijft"));
}

console.log("\n" + checks + " controles, " + fails + " fouten" + (warns ? ", " + warns + " waarschuwingen" + (VERBOSE ? "" : " (--verbose toont ze)") : ""));
process.exit(fails ? 1 : 0);
