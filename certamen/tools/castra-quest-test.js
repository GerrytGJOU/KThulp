/* Test van de opdrachttoestanden (castra-diarium.js: castraQuestState) en de markeringen op de kaart.
   node tools/castra-quest-test.js   (vanuit certamen/; exitcode 1 bij fouten) */
const { load } = require("./castra-colo-node.js"), vm = require("vm");
const w = load({ H(){} }); if(w.errs.length){ console.error(w.errs); process.exit(1); }
const run = s => vm.runInContext(s, w.ctx), J = x => JSON.stringify(x);
let fails = 0, checks = 0; const ok = (c, m)=>{ checks++; if(!c){ fails++; console.log("  FOUT  " + m); } };
const fresh = ()=>run("CASTRA = castraNewState(); CASTRA.dev = true;");

console.log("1. de vijf toestanden");
fresh();
const defs = JSON.parse(run("JSON.stringify(CASTRA_QDEFS.map(q=>({ id:q.id, giver:q.giver, region:q.region, after:q.after||null, steps:q.steps.length })))"));
ok(defs.length>50, "er zijn opdrachten ("+defs.length+")");
{ // een opdracht zonder voorwaarden: AVAILABLE → ACTIVE → READY → COMPLETED
  const free = defs.find(d=>!d.after && run(`castraDqRegionOpen(${J(d.region)})`));
  ok(!!free, "er is een opdracht die meteen beschikbaar is");
  const id = free.id, S = ()=>run(`castraQuestState(${J(id)})`);
  ok(S()==="AVAILABLE", id+": AVAILABLE aan het begin (was "+S()+")");
  run(`CASTRA.dq = { ${J(id)}:{ a:1, s:0, n:0 } }`); ok(S()==="ACTIVE", id+": ACTIVE na aannemen");
  run(`CASTRA.dq[${J(id)}].s = ${free.steps}`); ok(S()==="READY", id+": READY als alle stappen klaar zijn");
  run(`CASTRA.dq[${J(id)}].d = 1`); ok(S()==="COMPLETED", id+": COMPLETED na inleveren");
  ok(run(`castraDqAvailable(castraDqDef(${J(id)}))`)===false, id+": een afgeronde opdracht wordt niet opnieuw aangeboden");
}
ok(run('castraQuestState("bestaat_niet")')===null, "onbekende opdracht geeft null");

console.log("2. vergrendeld");
{ fresh(); const dicht = defs.find(d=>d.region && !run(`castraDqRegionOpen(${J(d.region)})`) && !d.after);
  if(dicht){ ok(run(`castraQuestState(${J(dicht.id)})`)==="LOCKED", dicht.id+": LOCKED zolang "+dicht.region+" dicht is");
    ok(/is nog dicht/.test(run(`castraQuestLockReason(${J(dicht.id)})`)), "reden noemt het gesloten land: "+run(`castraQuestLockReason(${J(dicht.id)})`)); }
  const na = defs.find(d=>d.after);
  if(na){ run("CASTRA.dq = {}"); const open = run(`castraDqRegionOpen(${J(na.region||"latium")})`);
    ok(!open || run(`castraQuestState(${J(na.id)})`)==="LOCKED", na.id+": LOCKED zolang "+na.after+" niet klaar is");
    if(open){ ok(/Rond eerst af/.test(run(`castraQuestLockReason(${J(na.id)})`)), "reden noemt de vorige opdracht");
      run(`CASTRA.dq = { ${J(na.after)}:{ a:1, s:1, d:1 } }`); ok(run(`castraQuestState(${J(na.id)})`)==="AVAILABLE", na.id+": AVAILABLE zodra "+na.after+" klaar is"); } }
  ok(run('castraQuestLockReason(CASTRA_QDEFS.find(q=>castraQuestState(q)!=="LOCKED").id)')==="", "een niet-vergrendelde opdracht heeft geen reden");
}

console.log("3. markeringen op de kaart volgen de toestand");
{ fresh(); const q = JSON.parse(run(`JSON.stringify((function(){ const q = CASTRA_QDEFS.find(q=>!q.after && castraDqRegionOpen(q.region) && CASTRA_WENT.some(e=>e.id===q.giver)); return { id:q.id, giver:q.giver, steps:q.steps.length }; })())`));
  const M = ()=>run(`castraDqMark(${J(q.giver)})`);
  ok(M()==="offer", q.id+": gever toont ❗ (offer) bij AVAILABLE (was '"+M()+"')");
  run(`CASTRA.dq = { ${J(q.id)}:{ a:1, s:0 } }`); ok(M()!=="offer", "gever toont geen ❗ meer na aannemen");
  run(`CASTRA.dq[${J(q.id)}].s = ${q.steps}`); ok(M()==="ready", "gever toont ❓ (ready) als de opdracht klaar is");
  run(`CASTRA.dq[${J(q.id)}].d = 1`); ok(M()!=="ready", "geen ❓ meer na inleveren");
}

console.log("4. gegevens van de opdrachten kloppen");
{ const ids = new Set(defs.map(d=>d.id)); ok(ids.size===defs.length, "alle id's zijn uniek");
  defs.filter(d=>d.after).forEach(d=>ok(ids.has(d.after), d.id+": 'after' verwijst naar een bestaande opdracht ("+d.after+")"));
  defs.forEach(d=>ok(d.steps>0, d.id+": heeft minstens één stap"));
  // geen kringverwijzing in 'after'
  const after = {}; defs.forEach(d=>after[d.id] = d.after);
  defs.forEach(d=>{ let n = 0, x = d.id; while(after[x] && n++ < 50) x = after[x]; ok(n<50, d.id+": kringverwijzing in 'after'"); });
  // elke toestand heeft een Latijnse en Nederlandse naam
  ok(["LOCKED","AVAILABLE","ACTIVE","READY","COMPLETED"].every(s=>run(`CASTRA_QSTATE.${s}.la && CASTRA_QSTATE.${s}.nl`)), "elke toestand heeft een Latijnse en Nederlandse naam");
}

console.log("\n" + checks + " controles, " + fails + " fouten");
process.exit(fails ? 1 : 0);
