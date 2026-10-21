/* Test van de Colosseum-netwerklaag (lobby, start, inleveren, uitbetalen) met een nagemaakte Firebase en twee spelers
   in twee losse werelden:   node tools/castra-colo-net-test.js
   Let op: dit test GEEN Firebase-rules (daarvoor: tools/castra-colo-rules-test.js met de emulator). */
const { load } = require("./castra-colo-node.js"), vm = require("vm");

/* ---- nagemaakte Realtime Database (gedeeld archief, per speler een eigen client met eigen klokverschil) ---- */
class FakeStore {
  constructor(){ this.data = {}; this.ls = []; this.n = 0; }
  get(path){ let o = this.data; for(const k of path.split("/").filter(Boolean)){ if(o==null || typeof o!=="object") return null; o = o[k]; } return o===undefined ? null : JSON.parse(JSON.stringify(o)); }
  put(path, v){
    const ks = path.split("/").filter(Boolean); if(!ks.length){ this.data = v==null ? {} : v; return; }
    let o = this.data; for(let i = 0; i < ks.length-1; i++){ if(o[ks[i]]==null || typeof o[ks[i]]!=="object") o[ks[i]] = {}; o = o[ks[i]]; }
    if(v==null) delete o[ks[ks.length-1]]; else o[ks[ks.length-1]] = JSON.parse(JSON.stringify(v));
    // lege tussentakken opruimen
    for(let n = ks.length-1; n > 0; n--){ let p = this.data; for(let i = 0; i < n-1; i++) p = p[ks[i]]; const k = ks[n-1]; if(p[k] && typeof p[k]==="object" && !Object.keys(p[k]).length) delete p[k]; else break; }
    this.log.push(path);
  }
  notify(){ setImmediate(()=>this.ls.slice().forEach(l=>l.fire())); }
}
FakeStore.prototype.log = [];
function client(store, offset){
  const snap = (v, key)=>({ val:()=>v, key });
  function ref(path){
    const r = {
      key: path.split("/").pop(),
      child:p=>ref(path+"/"+p),
      on(evt, fn){ if(path===".info/serverTimeOffset"){ setImmediate(()=>fn(snap(offset))); return; } const l = { path, fn, fire:()=>fn(snap(store.get(path), r.key)) }; l.owner = fn; store.ls.push(l); setImmediate(()=>l.fire()); },
      off(evt, fn){ store.ls = store.ls.filter(l=>!(l.owner===fn)); },
      once(evt){ return Promise.resolve(snap(path===".info/serverTimeOffset" ? offset : store.get(path))); },
      set(v){ store.put(path, v); store.notify(); return Promise.resolve(); },
      update(o){ Object.keys(o).forEach(k=>store.put(path+"/"+k, o[k])); store.notify(); return Promise.resolve(); },
      remove(){ store.put(path, null); store.notify(); return Promise.resolve(); },
      push(){ return ref(path+"/-K"+String(++store.n).padStart(6,"0")); },
      transaction(fn, cb){ const cur = store.get(path), nv = fn(cur); if(nv===undefined){ setImmediate(()=>cb(null, false, snap(cur))); return; } store.put(path, nv); store.notify(); setImmediate(()=>cb(null, true, snap(nv))); },
      orderByChild(c){ return { equalTo(v){ const q = { on(evt, fn){ const l = { path, fn, fire:()=>{ const all = store.get(path)||{}, out = {}; Object.keys(all).forEach(k=>{ if(all[k] && all[k][c]===v) out[k] = all[k]; }); fn(snap(Object.keys(out).length?out:null)); } }; l.owner = fn; store.ls.push(l); setImmediate(()=>l.fire()); }, off(evt, fn){ store.ls = store.ls.filter(l=>l.owner!==fn); } }; return q; } }; },
    };
    return r;
  }
  return { ref };
}

const sleep = ms => new Promise(r => setTimeout(r, ms));
let fails = 0; const ok = (c, m) => { console.log((c ? "  ok   " : "  FOUT ") + m); if(!c) fails++; };

function player(store, lid, name, skew, aes){
  const real = Date, offset = -skew;               // de klok van deze speler loopt `skew` ms mis; de serveroffset corrigeert dat
  const SkewDate = class extends real { static now(){ return real.now() + skew; } };
  const w = load({ fbDB:client(store, offset), initFirebase(){}, setInterval, clearInterval, setTimeout, clearTimeout, Date:SkewDate });
  if(w.errs.length) throw new Error(w.errs.join("; "));
  const run = s => vm.runInContext(s, w.ctx);
  run(`var BM_IDENT = ${JSON.stringify({ klascode:"k1", leerlingcode:lid, name })}; CASTRA = castraNewState(); CASTRA.res.aes = ${aes}; CASTRA.res.gloria = 0;
       CASTRA_COLO.countdownMs = 1500; CASTRA_COLO.lateMs = 60000; _screen = "castraColoLobby";`);
  return { lid, run, aes:()=>run("CASTRA.res.aes"), pend:()=>Object.keys(run("CASTRA.colo&&CASTRA.colo.pending||{}")), hist:()=>run("JSON.parse(JSON.stringify(CASTRA.colo&&CASTRA.colo.hist||[]))") };
}
// laat een speler daadwerkelijk spelen: n soldaten plaatsen via de echte plaatscode, de simulatie laten lopen, de run insturen
function playOut(p, n){
  p.run(`(function(){
    const B = CASTRA_B; if(!B || !B.pvp) throw new Error("geen pvp-run gestart");
    CASTRA.seed = 99; CASTRA.soldiers = []; CASTRA.heroes = [];
    ["rom_princeps","rom_funditor","rom_decurio","rom_signifer","rom_princeps","rom_funditor","rom_decurio","rom_princeps"].forEach((f,i)=>{ const s = castraRollSoldier(f); s.lvl = B.div; s.id = "q"+i; CASTRA.soldiers.push(s); });
    const cells = castraPPathCells(B.mission.map), trees = {}; CASTRA_P_MAPS[B.mission.map].trees.forEach(t=>{ trees[t[0]+","+t[1]] = 1; });
    const free = []; for(let y=0;y<CASTRA_P.rows;y++) for(let x=0;x<CASTRA_P.cols;x++) if(!cells[x+","+y] && !trees[x+","+y]) free.push([x,y]);
    castraColoUnits(B.div).slice(0, ${n}).forEach((u,i)=>{ const [x,y] = free[(i*7)%free.length]; B.sim.towers.push(castraColoPlace(B, u, x, y)); });
    while(!B.sim.over) castraPStep(B.sim);
    castraColoPvpEnd(false);
  })()`);
}

async function until(cond, ms, what){ const t0 = Date.now(); while(!cond()){ if(Date.now()-t0 > ms) throw new Error("time-out: "+what); await sleep(50); } }

(async()=>{
  console.log("A. volledig duel: aanmaken, meedoen, tegelijk starten, spelen, nareken, uitbetalen");
  {
    const store = new FakeStore(), a = player(store, "anna", "Anna", 0, 300), b = player(store, "bram", "Bram", 2500, 300);
    a.run(`castraCAttach(); castraCCreate("duel", 20);`);
    ok(a.aes() === 200 && a.pend().length === 1, "Anna betaalt 100 bij het aanmaken (300 -> 200)");
    b.run(`castraCAttach();`); await sleep(100);
    const mid = a.pend()[0];
    ok(!!b.run(`CASTRA_C.lobby["${mid}"]`), "Bram ziet het open duel in de lobby");
    b.run(`castraCJoin("${mid}")`);
    ok(b.aes() === 200, "Bram betaalt 100 bij het meedoen");
    await until(()=>store.get("castraColosseum/k1/"+mid+"/status") === "running", 3000, "status running");
    const startAt = store.get("castraColosseum/k1/"+mid+"/startAt");
    ok(store.get("castraColosseum/k1/"+mid+"/players/bram") && startAt > Date.now(), "tweede speler vol -> status running met startAt in de toekomst (servertijd)");
    await until(()=>a.run("!!CASTRA_B") && b.run("!!CASTRA_B"), 6000, "beide runs gestart");
    const t = Date.now();
    ok(t >= startAt - 100 && t - startAt < 1500, `beide clients starten rond hetzelfde moment (${t - startAt} ms na startAt; Bram heeft 2,5 s klokverschil)`);
    ok(a.run("CASTRA_B.seed") === b.run("CASTRA_B.seed") && a.run("CASTRA_B.div") === 20, "zelfde zaad en divisie bij beide spelers");
    playOut(a, 8); playOut(b, 3);
    await until(()=>a.hist().length === 1 && b.hist().length === 1, 8000, "uitbetaling bij beide spelers");
    const ha = a.hist()[0], hb = b.hist()[0];
    ok(ha.rank === 1 && ha.pay === 200 && hb.rank === 2 && hb.pay === 0, `Anna (8 torens) wint: ${JSON.stringify([ha.rank, ha.pay])}; Bram (3 torens): ${JSON.stringify([hb.rank, hb.pay])}`);
    ok(a.aes() === 400 && b.aes() === 200, `saldo: Anna ${a.aes()} (verwacht 400), Bram ${b.aes()} (verwacht 200)`);
    ok(a.aes() + b.aes() === 600, "de pot is in evenwicht (totaal brons ongewijzigd)");
    ok(store.get("castraColosseum/k1/"+mid+"/paid/anna") === true, "paid-vlag van de winnaar staat");
    ok(a.run("CASTRA.res.gloria") === 5, "winnaar krijgt 5 roem");
  }

  console.log("B. dubbele uitbetaling wordt tegengehouden (paid-vlag)");
  {
    const store = new FakeStore(), a = player(store, "anna", "Anna", 0, 300), b = player(store, "bram", "Bram", 0, 300);
    a.run(`castraCAttach(); castraCCreate("duel", 20);`); b.run(`castraCAttach();`); await sleep(100);
    const mid = a.pend()[0]; b.run(`castraCJoin("${mid}")`);
    await until(()=>a.run("!!CASTRA_B") && b.run("!!CASTRA_B"), 6000, "start");
    playOut(a, 8); playOut(b, 3);
    await until(()=>a.hist().length === 1 && b.hist().length === 1, 8000, "uitbetaling");
    const before = a.aes();
    // zelfde winnaar op een tweede apparaat met dezelfde pending-inzet
    const a2 = player(store, "anna", "Anna", 0, 200);
    a2.run(`castraCColo().pending = { "${mid}": { klas:"k1", fee:100, mode:"duel", div:20, t:Date.now(), run:null, sent:false, started:true } }; castraCAttach();`);
    await until(()=>a2.hist().length === 1, 5000, "tweede apparaat rondt af");
    ok(before === 400 && a2.aes() === 200, `tweede apparaat betaalt NIET nog eens uit (saldo ${a2.aes()}, verwacht 200)`);
  }

  console.log("C. niemand levert in: iedereen krijgt zijn inzet terug (na de uiterste datum)");
  {
    const store = new FakeStore(), a = player(store, "anna", "Anna", 0, 300), b = player(store, "bram", "Bram", 0, 300);
    a.run(`CASTRA_COLO.windowMs = 3500; castraCAttach(); castraCCreate("duel", 35);`); b.run(`CASTRA_COLO.windowMs = 3500; castraCAttach();`); await sleep(100);
    const mid = a.pend()[0]; b.run(`castraCJoin("${mid}")`);
    await until(()=>a.run("!!CASTRA_B") && b.run("!!CASTRA_B"), 6000, "start");
    a.run(`clearInterval(CASTRA_B.timer); CASTRA_B = null; _screen = "x";`); b.run(`clearInterval(CASTRA_B.timer); CASTRA_B = null; _screen = "x";`);   // beiden haken af zonder iets in te leveren
    await until(()=>a.hist().length === 1 && b.hist().length === 1, 9000, "terugbetaling");
    ok(a.aes() === 300 && b.aes() === 300 && a.hist()[0].refund && b.hist()[0].refund, "beide spelers krijgen hun 100 terug (saldo 300/300)");
  }

  console.log("D. één speler levert in, de ander niet: de inleverder wint de hele pot");
  {
    const store = new FakeStore(), a = player(store, "anna", "Anna", 0, 300), b = player(store, "bram", "Bram", 0, 300);
    a.run(`CASTRA_COLO.windowMs = 4500; castraCAttach(); castraCCreate("duel", 20);`); b.run(`CASTRA_COLO.windowMs = 4500; castraCAttach();`); await sleep(100);
    const mid = a.pend()[0]; b.run(`castraCJoin("${mid}")`);
    await until(()=>a.run("!!CASTRA_B") && b.run("!!CASTRA_B"), 6000, "start");
    b.run(`clearInterval(CASTRA_B.timer); CASTRA_B = null; _screen = "x";`);
    playOut(a, 4);
    await until(()=>a.hist().length === 1 && b.hist().length === 1, 10000, "uitbetaling");
    ok(a.aes() === 400 && b.aes() === 200, `Anna ${a.aes()} (verwacht 400), Bram ${b.aes()} (verwacht 200)`);
  }

  console.log("E. lobby verlaten en lobby die niet vol komt");
  {
    const store = new FakeStore(), a = player(store, "anna", "Anna", 0, 300), b = player(store, "bram", "Bram", 0, 300);
    a.run(`castraCAttach(); castraCCreate("duel", 20);`); await sleep(150);
    const mid = a.pend()[0];
    a.run(`castraCLeave("${mid}")`); await sleep(200);
    ok(a.aes() === 300 && a.pend().length === 0 && !store.get("castraColosseum/k1/"+mid+"/players/anna"), "verlaten: inzet terug en uit de spelerslijst");
    b.run(`CASTRA_COLO.lobbyTtl = 800; castraCAttach(); castraCCreate("duel", 20);`);
    await until(()=>b.hist().length === 1, 5000, "lobby-time-out");
    ok(b.aes() === 300 && b.hist()[0].refund, "lobby die niet vol komt: na de time-out krijgt Bram zijn inzet terug");
  }

  console.log("F. niet genoeg brons / al in een match");
  {
    const store = new FakeStore(), a = player(store, "anna", "Anna", 0, 50);
    a.run(`castraCAttach(); castraCCreate("duel", 20);`); await sleep(100);
    ok(a.pend().length === 0 && a.aes() === 50 && !store.get("castraColosseum/k1"), "met 50 brons kun je geen duel starten");
  }

  console.log(fails ? "\n" + fails + " FOUT(EN)" : "\nalles goed");
  process.exit(fails ? 1 : 0);
})().catch(e=>{ console.error("FOUT:", e.message); process.exit(1); });
