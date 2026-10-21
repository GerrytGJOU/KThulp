/* Test van het Colosseum in de wereld (Roma): deur, binnenruimte, ontgrendeling op niveau 20, prestaties.
   node tools/castra-colo-world-test.js */
const { load } = require("./castra-colo-node.js"), vm = require("vm");
const w = load({ ACHIEVEMENTS_DEF:[], ACH_CATEGORIES:{} }); if(w.errs.length){ console.error(w.errs); process.exit(1); }
const run = s => vm.runInContext(s, w.ctx), J = x => JSON.stringify(x), R = s => JSON.parse(J(run(s)));
let fails = 0; const ok = (c, m) => { console.log((c ? "  ok   " : "  FOUT ") + m); if(!c) fails++; };
run("CASTRA = castraNewState();");

console.log("1. deur en binnenruimte");
{
  const d = R("CASTRA_WORLDS.roma.doors.find(d=>d.to==='colosseum_roma')");
  ok(d && d.x === 16 && d.y === 32 && d.label.indexOf("Colosseum") >= 0, "Roma heeft een deur naar het Colosseum op (16,32): " + J(d));
  ok(run("!!CASTRA_WORLDS.colosseum_roma && CASTRA_WORLDS.colosseum_roma.interior && CASTRA_WORLDS.colosseum_roma.parent==='roma'"), "binnenruimte is als wereld geregistreerd (kind interior, ouder Roma)");
  ok(!R("CASTRA_WENT.some(e=>e.id==='bord_colosseum')"), "het oude bordje 'nog in aanbouw' is weg");
  const ents = R("CASTRA_WENT.filter(e=>e.region==='colosseum_roma').map(e=>[e.id,e.kind,e.x,e.y])");
  ok(ents.length === 3, "Praeco en twee borden staan binnen: " + J(ents));
  // bereikbaarheid binnen: BFS van de startplek naar alle tegels naast Praeco/borden en naar de uitgangen
  const r = R(`(function(){
    const I = CASTRA_INTERIORS.colosseum_roma, def = castraInteriorDef(CASTRA_WORLDS.colosseum_roma), blocked = {};
    def.walls.forEach(([x,y])=>blocked[x+","+y]=1);
    (I.furniture||[]).forEach(([o,x,y])=>blocked[x+","+y]=1);
    CASTRA_WENT.filter(e=>e.region==='colosseum_roma').forEach(e=>blocked[e.x+","+e.y]=1);
    const seen = {}, q = [[I.start.x, I.start.y]]; seen[I.start.x+","+I.start.y] = 1;
    while(q.length){ const [x,y] = q.shift(); [[1,0],[-1,0],[0,1],[0,-1]].forEach(([dx,dy])=>{ const nx=x+dx, ny=y+dy, k=nx+","+ny; if(nx<0||ny<0||nx>=I.cols||ny>=I.rows||seen[k]) return; const door = I.doors.some(d=>d.x===nx&&d.y===ny); if(blocked[k] && !door) return; seen[k]=1; if(!door) q.push([nx,ny]); }); }
    const near = e=>[[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>seen[(e.x+dx)+","+(e.y+dy)]);
    return { ents:CASTRA_WENT.filter(e=>e.region==='colosseum_roma').map(e=>[e.id, near(e)]), doors:I.doors.map(d=>!!seen[d.x+","+d.y]), startFree:!blocked[I.start.x+","+I.start.y] };
  })()`);
  ok(r.startFree && r.ents.every(e => e[1]) && r.doors.every(Boolean), "alles binnen is bereikbaar: " + J(r.ents) + " uitgangen " + J(r.doors));
  // tegels bij de deur in Roma zijn vrij gehouden (net als bij de andere tenten)
  ok(R("castraWobjSpots('roma').some(([x,y])=>x===16&&y===32)"), "de deurtegel is vrijgehouden van objecten in Roma");
}

console.log("2. ontgrendeling op Castra-niveau 20");
{
  vm.runInContext("localStorage.removeItem('castra_dev'); CASTRA.dev = false;", w.ctx);
  const def = R("castraUnlockDef('colosseum')");
  ok(def && def.lvl === 20 && def.lines.length === 2, "ontgrendeling 'colosseum' op niveau 20 met Aeneas-uitleg");
  run("CASTRA.pxp = 0;"); ok(run("castraPLevel()") === 1 && run("castraColoAllowed()") === false, "niveau 1: gesloten");
  run("CASTRA.pxp = castraPxpFor(19);"); ok(run("castraPLevel()") === 19 && run("castraColoAllowed()") === false, "niveau 19: gesloten");
  run("CASTRA.pxp = castraPxpFor(20);"); ok(run("castraPLevel()") === 20 && run("castraColoAllowed()") === true, "niveau 20: open");
  run("CASTRA.pxp = 0; localStorage.setItem('castra_dev','1');"); ok(run("castraColoAllowed()") === true && run("castraColoDev()") === true, "testvlag ?dev: open (ook onder niveau 20)");
  run("localStorage.removeItem('castra_dev');");
  ok(run("castraColoCard()") === "", "de testkaart in de Proelium-lijst verschijnt alleen met ?dev");
  // de deur: onder niveau 20 blijft de speler buiten (wel een melding), vanaf 20 gaat hij open
  run(`var _toasts = []; toast = function(a,b){ _toasts.push(a+"|"+b); }; CASTRA_W_REGION = "roma"; CASTRA_W_UI = { px:16, py:33 }; castraWorldSavePos = function(){}; castraWorldDetach = function(){}; var _went = []; go = function(n){ _went.push(n); _screen = n; };`);
  run("CASTRA.pxp = 0;"); const a = run("castraGeoDoor(16, 32)");
  ok(a === true && run("CASTRA_W_REGION") === "roma" && run("_toasts.length") === 1 && /niveau 20/.test(run("_toasts[0]")), "niveau 1: deur blijft dicht met melding: " + run("_toasts[0]"));
  run("CASTRA.pxp = castraPxpFor(20);"); run("castraGeoDoor(16, 32)");
  ok(run("CASTRA_W_REGION") === "colosseum_roma" && run("_went[_went.length-1]") === "castraWorld" && J(run("CASTRA_GEO_SPAWN")) === J({ x:12, y:13, dir:"up" }), "niveau 20: je komt in het Colosseum aan op de startplek");
  run("castraColoGoLobby('rang');"); ok(run("_screen") === "castraColoLobby" && run("CASTRA_C_FROM") === "world" && run("CASTRA_C_TAB") === "rang", "bord/Praeco -> lobbyscherm op het juiste tabblad");
  run("castraColoBack();"); ok(run("CASTRA_W_REGION") === "colosseum_roma" && run("_screen") === "castraWorld" && run("CASTRA_C_FROM") === "", "terug uit de lobby -> weer in het Colosseum (niet in de Proelium-lijst)");
  run("CASTRA_C_FROM = ''; castraColoBack();"); ok(run("_screen") === "castraProelium", "zonder wereld-herkomst (dev-kaart) terug naar de Proelium-lijst");
}

console.log("3. prestaties in het Certamen-profiel");
{
  const ids = R("ACHIEVEMENTS_DEF.filter(a=>a.id.indexOf('castra_colo')===0).map(a=>[a.id,a.nm,a.cat])");
  ok(ids.length === 3 && ids.every(a => a[2] === "castra"), "drie prestaties in categorie Castra Heroum: " + ids.map(a => a[1]).join(", "));
  ok(R("ACHIEVEMENTS_DEF.filter(a=>a.id.indexOf('castra_colo')===0).every(a=>a.icon && a.ds && a.mode)").valueOf() === true, "elk met icoon, beschrijving en modus");
}

console.log(fails ? "\n" + fails + " FOUT(EN)" : "\nalles goed");
process.exit(fails ? 1 : 0);
