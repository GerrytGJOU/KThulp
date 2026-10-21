/* Test van de Colosseum-regels in certamen/database.rules.json met een kleine, zelfgebouwde regel-interpreter
   (geen Firebase-emulator beschikbaar: die vraagt Java).   node tools/castra-colo-rules-test.js
   Beperkingen: dit is NIET Firebase zelf. Gemodelleerd: .write (cascade van boven naar beneden), .validate op de
   geschreven plek en alles eronder (en in "strikte" modus ook op de ouders), $-wildcards, now. Niet gemodelleerd:
   .read, .indexOn, auth (de Colosseum-regels gebruiken geen auth). Controleer na het publiceren dus ook in de
   Console -> Realtime Database -> Regels -> Simulator. */
const fs = require("fs"), path = require("path");
const RULES = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "database.rules.json"), "utf8")).rules;

class Snap {
  constructor(root, p){ this.root = root; this.p = p; }
  node(){ let o = this.root; for(const k of this.p){ if(o==null || typeof o!=="object") return null; o = o[k]; } return o===undefined ? null : o; }
  child(c){ return new Snap(this.root, this.p.concat(String(c).split("/").filter(Boolean))); }
  parent(){ return new Snap(this.root, this.p.slice(0, -1)); }
  val(){ const n = this.node(); return n; }
  exists(){ return this.node()!==null; }
  hasChild(c){ return this.child(c).exists(); }
  hasChildren(l){ const n = this.node(); if(n==null || typeof n!=="object") return false; return l ? l.every(k=>n[k]!==undefined) : Object.keys(n).length>0; }
  isNumber(){ return typeof this.node()==="number"; } isString(){ return typeof this.node()==="string"; } isBoolean(){ return typeof this.node()==="boolean"; }
}
const cache = new Map();
function compile(expr, vars){
  if(typeof expr==="boolean") return ()=>expr;
  const key = expr+"|"+vars.join(",");
  if(!cache.has(key)) cache.set(key, new Function("data","newData","root","now","auth", ...vars, "return ("+expr+");"));
  return cache.get(key);
}
// zoek de regelknoop voor een locatie; geeft {node, vars} of null als er onderweg geen knoop meer is
function ruleAt(segs){
  let node = RULES, vars = {};
  for(const k of segs){
    if(node[k] && typeof node[k]==="object" && !k.startsWith(".")) node = node[k];
    else { const w = Object.keys(node).find(x=>x.startsWith("$")); if(!w) return null; vars[w] = k; node = node[w]; }
  }
  return { node, vars };
}
function evalRule(kind, segs, oldRoot, newRoot, now){
  const r = ruleAt(segs); if(!r || r.node[kind]===undefined) return undefined;
  const names = Object.keys(r.vars), fn = compile(r.node[kind], names);
  try { return !!fn(new Snap(oldRoot, segs), new Snap(newRoot, segs), new Snap(newRoot, []), now, null, ...names.map(n=>r.vars[n])); }
  catch(e){ throw new Error("regel-fout ("+kind+" op /"+segs.join("/")+"): "+e.message); }
}
function setPath(root, segs, v){
  if(!segs.length) return v;
  const out = JSON.parse(JSON.stringify(root||{})); let o = out;
  for(let i = 0; i < segs.length-1; i++){ if(o[segs[i]]==null || typeof o[segs[i]]!=="object") o[segs[i]] = {}; o = o[segs[i]]; }
  if(v===null) delete o[segs[segs.length-1]]; else o[segs[segs.length-1]] = v;
  return out;
}
function* walk(node, segs){ if(node!=null){ yield segs; if(typeof node==="object") for(const k of Object.keys(node)) yield* walk(node[k], segs.concat(k)); } }
// writes: [{path:"a/b", value}] atomisch; geeft {ok, why}
function attempt(db, writes, now, strict){
  let nr = db; writes.forEach(w=>{ nr = setPath(nr, w.path.split("/").filter(Boolean), w.value===undefined ? null : w.value); });
  for(const w of writes){
    const segs = w.path.split("/").filter(Boolean); let granted = false;
    for(let i = 0; i <= segs.length && !granted; i++){ const v = evalRule(".write", segs.slice(0, i), db, nr, now); if(v) granted = true; }
    if(!granted) return { ok:false, why:"geen schrijfrecht op /"+w.path };
    const locs = Array.from(walk(new Snap(nr, segs).node(), segs));                      // de geschreven plek en alles eronder
    if(strict) for(let i = 0; i < segs.length; i++) locs.push(segs.slice(0, i));          // strikt: ook de ouders zelf (niet hun andere kinderen)
    for(const loc of locs){
      const v = evalRule(".validate", loc, db, nr, now);
      if(v===false) return { ok:false, why:"validate faalt op /"+loc.join("/") };
    }
  }
  return { ok:true };
}

/* ---------------------------------- de tests ---------------------------------- */
let fails = 0;
const NOW = 1_800_000_000_000, M = "castraColosseum/k1/m1";
const check = (name, res, want) => { const good = res.ok===want; console.log((good ? "  ok   " : "  FOUT ") + name + (res.ok ? "" : "  [" + res.why + "]")); if(!good) fails++; };
const match = () => ({ mode:"duel", fee:100, divisie:35, seed:123456, need:2, status:"lobby", createdBy:"anna", createdAt:NOW, slots:{ s0:"anna" }, players:{ anna:{ nm:"Anna", ts:NOW } } });
const dbOf = m => ({ castraColosseum:{ k1:{ m1:m } } });
const running = () => { const m = match(); m.players.bram = { nm:"Bram", ts:NOW }; m.slots.s1 = "bram"; m.status = "running"; m.startAt = NOW + 10000; return m; };
const run = () => ({ actions:"[]", res:{ tick:100, wave:1, lives:0, kills:3, win:0, quit:0 }, ts:NOW + 20000 });

for(const strict of [false, true]){
  console.log("\n=== " + (strict ? "STRIKT (validate ook op de ouders)" : "NORMAAL (validate op geschreven plek en eronder)") + " ===");
  const A = (db, w, now) => attempt(db, w, now===undefined ? NOW : now, strict), AR = (db, w, now) => A(db, w, now===undefined ? NOW + 30000 : now);
  const empty = {};

  console.log("aanmaken");
  check("geldig duel aanmaken", A(empty, [{ path:M, value:match() }]), true);
  let m = match(); m.fee = 1;           check("inzet 1 i.p.v. 100", A(empty, [{ path:M, value:m }]), false);
  m = match(); m.divisie = 99;          check("divisie 99", A(empty, [{ path:M, value:m }]), false);
  m = match(); m.status = "running";    check("direct als 'running' aanmaken", A(empty, [{ path:M, value:m }]), false);
  m = match(); m.runs = { anna:run() }; check("runs meesturen bij het aanmaken", A(empty, [{ path:M, value:m }]), false);
  m = match(); m.paid = { anna:true };  check("paid meesturen bij het aanmaken", A(empty, [{ path:M, value:m }]), false);
  m = match(); m.extra = 1;             check("onbekend veld", A(empty, [{ path:M, value:m }]), false);
  m = match(); m.need = 4;              check("need past niet bij mode (duel, 4)", A(empty, [{ path:M, value:m }]), false);
  m = match(); m.mode = "quad"; m.need = 4; check("vierkamp met need 4", A(empty, [{ path:M, value:m }]), true);
  m = match(); m.slots.s2 = "carl"; m.players.carl = { nm:"C", ts:1 }; check("slot 3 in een duel bij het aanmaken", A(empty, [{ path:M, value:m }]), false);
  m = match(); m.players.mallory = { nm:"M", ts:1 }; check("speler zonder slot bij het aanmaken", A(empty, [{ path:M, value:m }]), false);
  m = match(); m.createdAt = NOW - 3600000; check("createdAt een uur geleden", A(empty, [{ path:M, value:m }]), false);
  m = match(); m.seed = -5;             check("negatief zaad", A(empty, [{ path:M, value:m }]), false);
  check("bestaande match overschrijven", A(dbOf(match()), [{ path:M, value:match() }]), false);

  console.log("lobby: meedoen en verlaten");
  const join = (lid, slot) => [{ path:M+"/players/"+lid, value:{ nm:lid, ts:NOW } }, { path:M+"/slots/"+slot, value:lid }];
  check("tweede speler doet mee (speler + slot)", A(dbOf(match()), join("bram", "s1")), true);
  m = match(); m.players.bram = { nm:"B", ts:1 }; m.slots.s1 = "bram";
  check("derde speler in een duel (slot s2)", A(dbOf(m), join("carl", "s2")), false);
  check("derde speler pakt een bezet slot (s1)", A(dbOf(m), join("carl", "s1")), false);
  check("speler zonder slot", A(dbOf(match()), [{ path:M+"/players/bram", value:{ nm:"Bram", ts:NOW } }]), false);
  check("slot met andere naam dan de speler", A(dbOf(match()), [{ path:M+"/players/bram", value:{ nm:"Bram", ts:NOW } }, { path:M+"/slots/s1", value:"carl" }]), false);
  check("speler zonder naam", A(dbOf(match()), [{ path:M+"/players/bram", value:{ ts:NOW } }, { path:M+"/slots/s1", value:"bram" }]), false);
  check("speler verlaat de lobby (speler + slot weg)", A(dbOf(m), [{ path:M+"/players/bram", value:null }, { path:M+"/slots/s1", value:null }]), true);
  check("enige speler verlaat de lobby (match blijft leeg achter)", A(dbOf(match()), [{ path:M+"/players/anna", value:null }, { path:M+"/slots/s0", value:null }]), true);
  check("speler verlaat een lopende match", A(dbOf(running()), [{ path:M+"/players/bram", value:null }, { path:M+"/slots/s1", value:null }]), false);
  check("meedoen terwijl de match al loopt", A(dbOf(running()), join("carl", "s2")), false);
  const quad = match(); quad.mode = "quad"; quad.need = 4;
  check("vierkamp: vierde speler in slot s3", A(dbOf(Object.assign({}, quad, { slots:{ s0:"anna", s1:"b", s2:"c" }, players:{ anna:{ nm:"a", ts:1 }, b:{ nm:"b", ts:1 }, c:{ nm:"c", ts:1 } } })), join("dora", "s3")), true);

  console.log("starten");
  const full = match(); full.players.bram = { nm:"Bram", ts:NOW }; full.slots.s1 = "bram";
  check("starten met twee spelers", A(dbOf(full), [{ path:M+"/status", value:"running" }, { path:M+"/startAt", value:NOW + 10000 }]), true);
  check("starten met één speler", A(dbOf(match()), [{ path:M+"/status", value:"running" }, { path:M+"/startAt", value:NOW + 10000 }]), false);
  check("starten met startAt in het verleden (10 min)", A(dbOf(full), [{ path:M+"/status", value:"running" }, { path:M+"/startAt", value:NOW - 600000 }]), false);
  check("starten met startAt over een uur", A(dbOf(full), [{ path:M+"/status", value:"running" }, { path:M+"/startAt", value:NOW + 3600000 }]), false);
  check("status 'running' zonder startAt", A(dbOf(full), [{ path:M+"/status", value:"running" }]), false);
  check("startAt zetten zonder status running", A(dbOf(full), [{ path:M+"/startAt", value:NOW + 10000 }]), false);
  check("tweede keer starten (startAt bestaat al)", A(dbOf(running()), [{ path:M+"/startAt", value:NOW + 20000 }]), false);
  check("status terugzetten naar lobby", A(dbOf(running()), [{ path:M+"/status", value:"lobby" }]), false);
  const q3 = match(); q3.mode = "quad"; q3.need = 4; q3.slots = { s0:"a", s1:"b", s2:"c" }; q3.players = { a:{ nm:"a", ts:1 }, b:{ nm:"b", ts:1 }, c:{ nm:"c", ts:1 } };
  check("vierkamp met 3 spelers zonder AI starten", A(dbOf(q3), [{ path:M+"/status", value:"running" }, { path:M+"/startAt", value:NOW + 10000 }]), false);
  q3.ghosts = 1;
  check("vierkamp met 3 spelers + 1 AI starten (ghosts bij het aanmaken)", A(dbOf(q3), [{ path:M+"/status", value:"running" }, { path:M+"/startAt", value:NOW + 10000 }]), true);
  check("startAt als update op de match zelf", A(dbOf(full), [{ path:M+"/status", value:"running" }, { path:M+"/startAt", value:NOW + 9000 }]), true);

  console.log("AI-tegenstander (ghosts)");
  const lob3 = () => { const q = match(); q.mode = "quad"; q.need = 4; q.slots = { s0:"a", s1:"b", s2:"c" }; q.players = { a:{ nm:"a", ts:1 }, b:{ nm:"b", ts:1 }, c:{ nm:"c", ts:1 } }; return q; };
  check("AI toevoegen aan een vierkamp met 3 spelers", A(dbOf(lob3()), [{ path:M+"/ghosts", value:1 }]), true);
  check("twee AI's bij 3 spelers (plek s2 is bezet)", A(dbOf(lob3()), [{ path:M+"/ghosts", value:2 }]), false);
  const lob2 = lob3(); delete lob2.slots.s2; delete lob2.players.c;
  check("twee AI's bij 2 spelers", A(dbOf(lob2), [{ path:M+"/ghosts", value:2 }]), true);
  check("AI toevoegen aan een duel", A(dbOf(match()), [{ path:M+"/ghosts", value:1 }]), false);
  check("AI-aantal 3", A(dbOf(lob2), [{ path:M+"/ghosts", value:3 }]), false);
  check("AI toevoegen terwijl de vierde speler net binnenkwam", A(Object.assign(dbOf(Object.assign(lob3(), { slots:{ s0:"a", s1:"b", s2:"c", s3:"d" }, players:{ a:{ nm:"a", ts:1 }, b:{ nm:"b", ts:1 }, c:{ nm:"c", ts:1 }, d:{ nm:"d", ts:1 } } }))), [{ path:M+"/ghosts", value:1 }]), false);
  const g1 = lob3(); g1.ghosts = 1;
  check("AI twee keer toevoegen / aanpassen", A(dbOf(g1), [{ path:M+"/ghosts", value:2 }]), false);
  check("AI wissen", A(dbOf(g1), [{ path:M+"/ghosts", value:null }]), false);
  check("vierde speler claimt s3 terwijl er een AI is", A(dbOf(g1), [{ path:M+"/players/d", value:{ nm:"d", ts:NOW } }, { path:M+"/slots/s3", value:"d" }]), false);
  const g2 = JSON.parse(JSON.stringify(lob2)); g2.ghosts = 2;
  check("derde speler claimt s2 terwijl er 2 AI's zijn", A(dbOf(g2), [{ path:M+"/players/c", value:{ nm:"c", ts:NOW } }, { path:M+"/slots/s2", value:"c" }]), false);
  check("AI toevoegen in een lopende match", A(dbOf(Object.assign(running(), { mode:"quad", need:4, slots:{ s0:"anna", s1:"bram", s2:"c" } })), [{ path:M+"/ghosts", value:1 }]), false);
  check("starten met 3 spelers + AI (ghosts al gezet)", A(dbOf(g1), [{ path:M+"/status", value:"running" }, { path:M+"/startAt", value:NOW + 10000 }]), true);

  console.log("onveranderlijke velden");
  check("inzet achteraf aanpassen", A(dbOf(match()), [{ path:M+"/fee", value:1 }]), false);
  check("divisie achteraf aanpassen", A(dbOf(match()), [{ path:M+"/divisie", value:20 }]), false);
  check("zaad achteraf aanpassen", A(dbOf(running()), [{ path:M+"/seed", value:1 }]), false);

  console.log("live-voortgang");
  const live = { wave:5, lives:7, ts:NOW };
  check("deelnemer schrijft live tijdens het gevecht", AR(dbOf(running()), [{ path:M+"/live/anna", value:live }]), true);
  check("niet-deelnemer schrijft live", AR(dbOf(running()), [{ path:M+"/live/carl", value:live }]), false);
  check("live in de lobby", AR(dbOf(match()), [{ path:M+"/live/anna", value:live }]), false);
  check("negatieve levens", AR(dbOf(running()), [{ path:M+"/live/anna", value:{ wave:5, lives:-1, ts:NOW } }]), false);

  console.log("runs inleveren");
  check("deelnemer levert run in", AR(dbOf(running()), [{ path:M+"/runs/anna", value:run() }]), true);
  const done = running(); done.runs = { anna:run() };
  check("dezelfde speler overschrijft zijn run", AR(dbOf(done), [{ path:M+"/runs/anna", value:run() }]), false);
  check("tweede speler levert zijn eigen run in", AR(dbOf(done), [{ path:M+"/runs/bram", value:run() }]), true);
  check("niet-deelnemer levert run in", AR(dbOf(running()), [{ path:M+"/runs/carl", value:run() }]), false);
  check("run inleveren in de lobby", AR(dbOf(match()), [{ path:M+"/runs/anna", value:run() }]), false);
  check("run te laat (na de uiterste datum)", AR(dbOf(running()), [{ path:M+"/runs/anna", value:Object.assign(run(), { ts:NOW + 2300000 }) }], NOW + 2300000), false);
  check("run vlak voor de uiterste datum", AR(dbOf(running()), [{ path:M+"/runs/anna", value:Object.assign(run(), { ts:NOW + 2100000 }) }], NOW + 2100000), true);
  let r = run(); r.actions = "x".repeat(30001);       check("acties te lang", AR(dbOf(running()), [{ path:M+"/runs/anna", value:r }]), false);
  r = run(); r.ts = NOW - 5000;                        check("tijdstempel van vóór de start", AR(dbOf(running()), [{ path:M+"/runs/anna", value:r }]), false);
  r = run(); r.ts = NOW + 600000;                      check("tijdstempel uit de toekomst", AR(dbOf(running()), [{ path:M+"/runs/anna", value:r }]), false);
  r = run(); r.res.kills = 99999;                      check("onmogelijk aantal kills", AR(dbOf(running()), [{ path:M+"/runs/anna", value:r }]), false);
  r = run(); r.res.tick = 50000;                       check("tick boven het maximum", AR(dbOf(running()), [{ path:M+"/runs/anna", value:r }]), false);
  r = run(); r.res.hack = 1;                           check("extra veld in res", AR(dbOf(running()), [{ path:M+"/runs/anna", value:r }]), false);
  r = run(); r.res.win = 2;                            check("win = 2", AR(dbOf(running()), [{ path:M+"/runs/anna", value:r }]), false);
  r = run(); delete r.res; check("run zonder res", AR(dbOf(running()), [{ path:M+"/runs/anna", value:r }]), false);
  check("run van een ander verwijderen", AR(dbOf(done), [{ path:M+"/runs/anna", value:null }]), false);

  console.log("uitbetalen");
  check("deelnemer zet zijn paid-vlag", AR(dbOf(done), [{ path:M+"/paid/anna", value:true }]), true);
  const paid = running(); paid.paid = { anna:true };
  check("paid-vlag een tweede keer zetten", AR(dbOf(paid), [{ path:M+"/paid/anna", value:true }]), false);
  check("paid-vlag van een niet-deelnemer", AR(dbOf(done), [{ path:M+"/paid/carl", value:true }]), false);
  check("paid met waarde false", AR(dbOf(done), [{ path:M+"/paid/anna", value:false }]), false);
  check("paid-vlag wissen", AR(dbOf(paid), [{ path:M+"/paid/anna", value:null }]), false);

  console.log("andere takken blijven werken (niet geraakt)");
  check("castraLegio-actie (bestaande regels) onaangetast", attempt({}, [{ path:"castraLegio/k1/players/x", value:{ nm:"X", ts:1 } }], NOW, strict), true);
}
console.log(fails ? "\n" + fails + " FOUT(EN)" : "\nalles goed");
process.exit(fails ? 1 : 0);
