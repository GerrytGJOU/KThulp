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
      transaction(fn, cb){ const cur = store.get(path), nv = fn(cur); if(nv===undefined){ if(cb) setImmediate(()=>cb(null, false, snap(cur))); return; } store.put(path, nv); store.notify(); if(cb) setImmediate(()=>cb(null, true, snap(nv))); },
      orderByChild(c){ return { limitToLast(n){ return { once(){ const all = store.get(path)||{}, ks = Object.keys(all).sort((a,b)=>(all[a][c]||0)-(all[b][c]||0)).slice(-n), out = {}; ks.forEach(k=>out[k]=all[k]); return Promise.resolve(snap(ks.length?out:null)); } }; }, equalTo(v){ const q = { on(evt, fn){ const l = { path, fn, fire:()=>{ const all = store.get(path)||{}, out = {}; Object.keys(all).forEach(k=>{ if(all[k] && all[k][c]===v) out[k] = all[k]; }); fn(snap(Object.keys(out).length?out:null)); } }; l.owner = fn; store.ls.push(l); setImmediate(()=>l.fire()); }, off(evt, fn){ store.ls = store.ls.filter(l=>l.owner!==fn); } }; return q; } }; },
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
  const w = load({ ACHIEVEMENTS_DEF:[], ACH_CATEGORIES:{}, fbDB:client(store, offset), initFirebase(){}, setInterval, clearInterval, setTimeout, clearTimeout, Date:SkewDate });
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
    const ach = p => JSON.parse(JSON.stringify(p.run("(BM_IDENT.achievements||[])")));
    ok(ach(a).includes("castra_colo_play") && ach(a).includes("castra_colo_win") && !ach(a).includes("castra_colo_champ"), "winnaar: prestaties deelnemer + winnaar (nog geen kampioen): " + ach(a).join(", "));
    ok(ach(b).join() === "castra_colo_play", "verliezer: alleen deelnemer: " + ach(b).join(", "));
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


  console.log("G. vierkamp met vier spelers: 250 / 100 / 50 / 0");
  {
    const store = new FakeStore(), ps = ["pa","pb","pc","pd"].map((l, i) => player(store, l, l.toUpperCase(), i*700, 300)), towers = [8, 5, 3, 2];
    ps[0].run(`castraCAttach(); castraCCreate("quad", 20);`); ps.slice(1).forEach(p => p.run("castraCAttach();")); await sleep(150);
    const mid = ps[0].pend()[0];
    for(const p of ps.slice(1)){ p.run(`castraCJoin("${mid}")`); await sleep(120); }
    ok(Object.keys(store.get("castraColosseum/k1/"+mid+"/slots")||{}).length === 4 && ps.every(p => p.aes() === 200), "vier spelers op vier plekken, ieder betaalde 100");
    await until(()=>ps.every(p => p.run("!!CASTRA_B")), 8000, "alle vier gestart");
    ps.forEach((p, i) => playOut(p, towers[i]));
    await until(()=>ps.every(p => p.hist().length === 1), 12000, "uitbetaling alle vier");
    const h = ps.map(p => p.hist()[0]);
    console.log("     " + ps.map((p, i) => p.lid + ": plaats " + h[i].rank + " +" + h[i].pay + " saldo " + p.aes()).join(" | "));
    ok(h.map(x => x.rank).join() === "1,2,3,4" && h.map(x => x.pay).join() === "250,100,50,0", "meer torens = hogere plaats; uitbetaling 250/100/50/0");
    ok(ps.reduce((a, p) => a + p.aes(), 0) === 1200, "de pot is in evenwicht (totaal 4 x 300)");
    // ranglijst van de klas: berekend uit de wedstrijden in de (nagemaakte) database
    ps[2].run("CASTRA_C.rank = null; castraCRankLoad(true);");
    await until(()=>ps[2].run("CASTRA_C.rank && CASTRA_C.rank.state") === "ready", 8000, "ranglijst klaar");
    const rk = JSON.parse(JSON.stringify(ps[2].run("CASTRA_C.rank.rows")));
    console.log("     " + rk.map(r => r.nm + " " + r.wins + "/" + r.played + " netto " + r.net + " beste " + JSON.stringify(r.best)).join(" | "));
    ok(rk.length === 4 && rk[0].lid === "pa" && rk[0].wins === 1 && rk[0].net === 150 && rk[3].lid === "pd" && rk[3].net === -100, "ranglijst: PA eerst (1 winst, netto +150), PD laatst (netto -100)");
    ok(rk.every(r => r.played === 1 && r.best[20] > 0), "iedereen 1 gespeeld, beste golf in divisie 20 bekend");
    ok(ps[2].run("Object.keys(localStorage.getItem('castra_colo_std_v1_"+mid+"')?{x:1}:{}).length") === 1, "de nagerekende uitslag is lokaal onthouden (tweede keer sneller)");
  }

  console.log("H. vierkamp met 3 spelers + AI op de vierde plek");
  {
    const store = new FakeStore(), ps = ["pa","pb","pc"].map((l, i) => player(store, l, l.toUpperCase(), 0, 300)), towers = [8, 4, 2];
    ps[0].run(`castraCAttach(); castraCCreate("quad", 20);`); ps.slice(1).forEach(p => p.run("castraCAttach();")); await sleep(150);
    const mid = ps[0].pend()[0];
    for(const p of ps.slice(1)){ p.run(`castraCJoin("${mid}")`); await sleep(120); }
    await sleep(500);
    ok(store.get("castraColosseum/k1/"+mid+"/status") === "lobby", "met 3 van 4 spelers start de match niet vanzelf");
    ps[1].run(`castraCAddAI("${mid}")`);
    await until(()=>store.get("castraColosseum/k1/"+mid+"/status") === "running", 4000, "start na het toevoegen van de AI");
    ok(store.get("castraColosseum/k1/"+mid+"/ghosts") === 1, "ghosts = 1 staat in de match");
    await until(()=>ps.every(p => p.run("!!CASTRA_B")), 8000, "alle drie gestart");
    ok(ps[0].run("castraColoPvpHud().indexOf('Legatus Brutus')>=0"), "de HUD toont de AI als balk");
    ps.forEach((p, i) => playOut(p, towers[i]));
    await until(()=>ps.every(p => p.hist().length === 1), 12000, "uitbetaling alle drie");
    const h = ps.map(p => p.hist()[0]), total = ps.reduce((a, p) => a + p.aes(), 0);
    console.log("     " + ps.map((p, i) => p.lid + ": plaats " + h[i].rank + " +" + h[i].pay + " saldo " + p.aes()).join(" | "));
    ok(h.every(x => [185,75,35,0].includes(x.pay)) && h.every(x => x.rank >= 1 && x.rank <= 4), "uitbetaling volgens eindplaats (1-4) met de geschaalde tabel 185/75/35/0");
    ok(h.reduce((a, x) => a + x.pay, 0) <= 300 && total <= 900, `totaal uitbetaald (${h.reduce((a, x) => a + x.pay, 0)}) is hooguit de echte inzet (300): saldo's samen ${total} <= 900`);
    ok(ps[0].run("CASTRA_C.results['"+mid+"'].st.ghosts") === 1, "de uitslag bevat de AI-rij");
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
