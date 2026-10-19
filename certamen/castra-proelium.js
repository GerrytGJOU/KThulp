/* ============================================================================
   CASTRA HEROUM — PROELIUM (tower defence met je eigen soldaten)
   ----------------------------------------------------------------------------
   Poort: porta praetoria -> campagnelijst -> gevecht. Vijanden lopen een pad af
   naar je kamp; jij plaatst je soldaten als verdedigers (alle soldaten zijn
   "torens" met bereik uit ambitus, schade uit impetus, tempo uit celeritas).
   Het Latijnse verkenningsbericht noemt per golf (ala) welke typen komen:
   wie leest, plaatst de juiste soldaten (infanterie > ruiterij > afstand >
   infanterie). Zonder soldaat verdedigt de dux zelf.

   DE SIMULATIE IS DETERMINISTISCH (voorbereiding op de coöperatieve
   lockstep-modus in de Legio, zie CASTRA_HEROUM.md): vaste tick (50 ms),
   gehele getallen in duizendste tegels, geen Math.random — alleen de seeded
   RNG van de missie. castraPSim()/castraPStep() raken de DOM niet aan.
   Laadt NA castra-map.js, castra-venatio.js en castra-campus.js.
   ============================================================================ */

const CASTRA_P = {
  tickMs: 50, baseHp: 10, startDelay: 20,
  rangeBase: 700, rangePerAmb: 300,   // bereik = base + ambitus*perAmb (duizendste tegels)
  speedBase: 50, speedPerCel: 7,      // duizendste tegels per tick
  cdBase: 40, cdPerCel: 3, cdMin: 6,
  buffPct: 25, buffRadius: 1500,
  enemyHpMult: 1.0,           // schaalt de vita van vijanden (per missie overschreven)
  cols:16, rows:11,
};

/* Het pad (waypoints in tegels) en hindernissen; twee lay-outs. */
const CASTRA_P_MAPS = {
  a: { path:[[0,1],[13,1],[13,5],[2,5],[2,9],[15,9]],
       trees:[[5,3],[6,3],[9,3],[10,3],[7,7],[8,7],[11,7],[14,3],[1,3],[4,10],[12,10],[14,7],[0,10]] },
  b: { path:[[0,9],[3,9],[3,2],[10,2],[10,7],[14,7],[14,1],[15,1]],
       trees:[[6,5],[7,5],[6,6],[12,4],[12,5],[1,5],[1,6],[5,10],[8,9],[9,9],[13,9],[7,0],[5,0]] },
};

/* Missies in Latium. waves: [ [ {line, n, gap, lvl} ] ] — gap = ticks tussen twee vijanden. */
const CASTRA_P_MISSIONS = [
  { id:"m1", nm:"Defensio castrorum", nl:"De verdediging van het kamp", map:"a", seed:1101, hpMult:2.0,
    waves:[ [ {line:"legioen",n:4,gap:26,lvl:1} ],
            [ {line:"ruiterij",n:3,gap:22,lvl:1} ],
            [ {line:"licht",n:4,gap:24,lvl:1}, {line:"legioen",n:2,gap:26,lvl:1} ] ],
    reward:{ aes:40, frumentum:30, gloria:3 } },
  { id:"m2", nm:"Via Latina", nl:"De Latijnse weg", map:"b", seed:1202, hpMult:2.4, needs:"m1",
    waves:[ [ {line:"ruiterij",n:4,gap:20,lvl:2} ],
            [ {line:"legioen",n:5,gap:24,lvl:2}, {line:"rangen",n:1,gap:24,lvl:2} ],
            [ {line:"licht",n:5,gap:20,lvl:2} ],
            [ {line:"ruiterij",n:3,gap:18,lvl:2}, {line:"licht",n:3,gap:20,lvl:2}, {line:"legioen",n:3,gap:22,lvl:2} ] ],
    reward:{ aes:70, frumentum:50, gloria:5 } },
  { id:"m3", nm:"Oppugnatio Ardeae", nl:"De aanval op Ardea", map:"a", seed:1303, hpMult:3.0, needs:"m2",
    waves:[ [ {line:"legioen",n:6,gap:22,lvl:3} ],
            [ {line:"saters",n:4,gap:20,lvl:3}, {line:"licht",n:3,gap:20,lvl:3} ],
            [ {line:"ruiterij",n:5,gap:16,lvl:3} ],
            [ {line:"rangen",n:2,gap:24,lvl:3}, {line:"legioen",n:6,gap:20,lvl:3}, {line:"licht",n:4,gap:18,lvl:3} ] ],
    reward:{ aes:110, frumentum:80, gloria:8 } },
  /* Graecia (opent na m2) */
  { id:"g1", region:"graecia", nm:"Labor primus", nl:"De eerste labor", map:"b", seed:2101, hpMult:4.4, needs:"m2",
    waves:[ [ {line:"phalanx",n:5,gap:22,lvl:5} ],
            [ {line:"kreta",n:5,gap:20,lvl:5} ],
            [ {line:"macedonie",n:4,gap:18,lvl:5}, {line:"psili",n:4,gap:20,lvl:5} ],
            [ {line:"phalanx",n:4,gap:20,lvl:5}, {line:"saters",n:3,gap:20,lvl:5} ] ],
    reward:{ aes:150, frumentum:100, gloria:10 } },
  { id:"g2", region:"graecia", nm:"Labyrinthus", nl:"Het labyrint", map:"a", seed:2202, hpMult:5.6, needs:"g1",
    waves:[ [ {line:"psili",n:6,gap:18,lvl:6} ],
            [ {line:"phalanx",n:6,gap:20,lvl:6}, {line:"kreta",n:3,gap:20,lvl:6} ],
            [ {line:"macedonie",n:6,gap:16,lvl:6} ],
            [ {line:"gryps",n:3,gap:24,lvl:6}, {line:"phalanx",n:6,gap:18,lvl:6}, {line:"psili",n:4,gap:18,lvl:6} ] ],
    reward:{ aes:190, frumentum:130, gloria:12 } },
  /* Troia (opent na g1) */
  { id:"t1", region:"troia", nm:"Muri Troiae", nl:"De muren van Troje", map:"b", seed:3101, hpMult:5.0, needs:"g1",
    waves:[ [ {line:"phalanx",n:6,gap:20,lvl:8} ],
            [ {line:"macedonie",n:5,gap:18,lvl:8}, {line:"psili",n:4,gap:18,lvl:8} ],
            [ {line:"kreta",n:6,gap:16,lvl:8} ],
            [ {line:"phalanx",n:6,gap:16,lvl:8}, {line:"macedonie",n:4,gap:16,lvl:8}, {line:"rangen",n:2,gap:20,lvl:8} ] ],
    reward:{ aes:240, frumentum:160, gloria:14 } },
  { id:"t2", region:"troia", nm:"Equus ligneus", nl:"Het houten paard", map:"a", seed:3202, hpMult:6.5, needs:"t1",
    waves:[ [ {line:"macedonie",n:7,gap:16,lvl:9} ],
            [ {line:"phalanx",n:7,gap:18,lvl:9}, {line:"kreta",n:4,gap:18,lvl:9} ],
            [ {line:"harpijen",n:4,gap:20,lvl:9}, {line:"psili",n:6,gap:16,lvl:9} ],
            [ {line:"gryps",n:3,gap:22,lvl:9}, {line:"macedonie",n:6,gap:14,lvl:9}, {line:"phalanx",n:6,gap:16,lvl:9} ] ],
    reward:{ aes:300, frumentum:200, gloria:18 } },
];
for(const m of CASTRA_P_MISSIONS){ if(!m.region) m.region = "latium"; }

/* Uiterlijk per soldatenlijn (alleen lagen waarvoor top-down sprites bestaan). */
const CASTRA_P_LOOK = {
  legioen:{ armor:"middel", helm:"open" }, rangen:{ armor:"middel", helm:"standard", cape:"kort", capekleur:"rood" },
  licht:{ armor:"vodden", helm:"bandana" }, ruiterij:{ armor:"robe", cape:"lang", capekleur:"blauw" },
  vaandel:{ armor:"ceremonieel", cape:"kort", capekleur:"rood" }, zorg:{ armor:"robe", capekleur:"groen" },
  beleg:{ armor:"vodden", helm:"standard" }, verkenning:{ armor:"vodden", helm:"bandana" }, vloot:{ armor:"middel", helm:"bandana" },
  arena:{ armor:"ceremonieel", helm:"open" }, phalanx:{ armor:"middel", helm:"open" }, psili:{ armor:"vodden", helm:"bandana" },
  kreta:{ armor:"vodden", helm:"bandana" }, macedonie:{ armor:"ceremonieel", helm:"standard" },
  saters:{ armor:"vodden", cape:"duivelsvleugels" }, nimfen:{ armor:"robe", cape:"vlindervleugels" },
  harpijen:{ armor:"vodden", cape:"engelenvleugels" }, gryps:{ armor:"vodden", cape:"engelenvleugels" },
};
function castraPLook(lineId){ return { schild:"geen", wapen:"zwaard", helm:"geen", ...(CASTRA_P_LOOK[lineId]||{}) }; }

/* ---------- pad ---------- */
function castraPPath(mapId){
  const pts = CASTRA_P_MAPS[mapId].path.map(p=>[p[0]*1000+500, p[1]*1000+500]);
  const seg = []; let len = 0;
  for(let i=0;i<pts.length-1;i++){
    const d = Math.abs(pts[i+1][0]-pts[i][0]) + Math.abs(pts[i+1][1]-pts[i][1]);
    seg.push({ a:pts[i], b:pts[i+1], d, start:len }); len += d;
  }
  return { pts, seg, len };
}
function castraPPos(path, prog){
  const p = Math.min(prog, path.len-1);
  const s = path.seg.find(x=>p < x.start + x.d) || path.seg[path.seg.length-1];
  const t = s.d ? (p - s.start) / s.d : 0;
  return [ Math.floor(s.a[0] + (s.b[0]-s.a[0])*t), Math.floor(s.a[1] + (s.b[1]-s.a[1])*t) ];
}
function castraPPathCells(mapId){
  const cells = {}, P = CASTRA_P_MAPS[mapId].path;
  for(let i=0;i<P.length-1;i++){
    const [x0,y0] = P[i], [x1,y1] = P[i+1];
    for(let x=Math.min(x0,x1); x<=Math.max(x0,x1); x++) for(let y=Math.min(y0,y1); y<=Math.max(y0,y1); y++) cells[x+","+y] = 1;
  }
  return cells;
}

/* ---------- Latijns verkenningsbericht (leesopdracht) ---------- */
const CASTRA_P_ORD = [ ["Prima","Eerste"], ["Secunda","Tweede"], ["Tertia","Derde"], ["Quarta","Vierde"] ];
function castraPScout(m){
  const la = [], nl = [];
  m.waves.forEach((w,i)=>{
    const types = []; w.forEach(g=>{ const t = castraLine(g.line).type; if(!types.includes(t)) types.push(t); });
    const L = types.map(t=>CASTRA_TYPE_LA[t].pl), N = types.map(t=>CASTRA_TYPE_LA[t].nl_pl);
    const o = CASTRA_P_ORD[i] || CASTRA_P_ORD[3];
    la.push(`${o[0]} ala: ${L.join(" et ")} veniunt.`);
    nl.push(`${o[1]} golf: ${N.join(" en ")} komen.`);
  });
  return { la: la.join(" "), nl: nl.join(" ") };
}

/* ---------- simulatie (deterministisch, geen DOM) ---------- */
function castraPEnemyStats(lineId, lvl, rng, hpMult){
  const indoles = {}; CASTRA_STATS.forEach(st=>{ indoles[st.id] = Math.floor(rng()*8); });
  const ing = CASTRA_INGENIA[Math.floor(rng()*CASTRA_INGENIA.length)].id;
  const s = { line:lineId, stage:0, lvl, indoles, ingenium:ing };
  const st = castraStats(s);
  st.vita = Math.max(1, Math.round(st.vita * hpMult));
  return st;
}
function castraPSim(mission, towerSoldiers){
  const path = castraPPath(mission.map);
  const sim = {
    mission, path, tick:0, rng: castraRng(mission.seed), baseHp: CASTRA_P.baseHp, wave:-1, waveActive:false,
    queue:[], enemies:[], towers:[], nextId:1, kills:0, leaked:0, over:null, events:[],
  };
  towerSoldiers.forEach(t=>sim.towers.push(castraPMakeTower(sim, t.s, t.x, t.y)));
  return sim;
}
function castraPMakeTower(sim, s, x, y){
  let st, type, look = null;
  if(s.hero){ st = castraHeroStats(s.h); type = CASTRA_HERO_DATA[s.h.id].type; look = CASTRA_HERO_DATA[s.h.id].look; }
  else { st = s.dux ? { ...CASTRA_V_BAL.dux } : castraStats(s); type = castraLine(s.line).type; }
  return { id:sim.nextId++, sid:s.id, line:s.line, look, type, x, y, cx:x*1000+500, cy:y*1000+500, st, cd:0,
           range: CASTRA_P.rangeBase + st.ambitus*CASTRA_P.rangePerAmb, cooldown: Math.max(CASTRA_P.cdMin, CASTRA_P.cdBase - st.celeritas*CASTRA_P.cdPerCel), buffed:false };
}
// Start de volgende golf (maakt de spawnrij).
function castraPStartWave(sim){
  if(sim.over || sim.waveActive) return false;
  sim.wave++;
  if(sim.wave >= sim.mission.waves.length){ sim.wave = sim.mission.waves.length-1; return false; }
  sim.waveActive = true;
  let t = sim.tick + CASTRA_P.startDelay;
  sim.mission.waves[sim.wave].forEach(g=>{
    for(let i=0;i<g.n;i++){ sim.queue.push({ at:t, line:g.line, lvl:g.lvl }); t += g.gap; }
  });
  sim.queue.sort((a,b)=>a.at-b.at);
  return true;
}
function castraPTypeMul(att, def){
  const A = CASTRA_TYPES[att], D = CASTRA_TYPES[def];
  if(A && A.beats===def) return [3,2];
  if(D && D.beats===att) return [3,4];
  return [1,1];
}
function castraPStep(sim){
  if(sim.over) return;
  sim.tick++; sim.events.length = 0;
  // spawns
  while(sim.queue.length && sim.queue[0].at <= sim.tick){
    const q = sim.queue.shift(), st = castraPEnemyStats(q.line, q.lvl, sim.rng, sim.mission.hpMult*CASTRA_P.enemyHpMult);
    sim.enemies.push({ id:sim.nextId++, line:q.line, type:castraLine(q.line).type, lvl:q.lvl, st, hp:st.vita, maxHp:st.vita,
      prog:0, speed: CASTRA_P.speedBase + st.celeritas*CASTRA_P.speedPerCel, x:0, y:0 });
  }
  // bewegen
  sim.enemies.forEach(e=>{ e.prog += e.speed; const p = castraPPos(sim.path, e.prog); e.x = p[0]; e.y = p[1]; });
  // support-buff (sup-type verhoogt de schade van torens in de buurt)
  sim.towers.forEach(t=>{ t.buffed = false; });
  sim.towers.filter(t=>t.type==="sup").forEach(b=>{
    sim.towers.forEach(t=>{ if(t!==b){ const dx=t.cx-b.cx, dy=t.cy-b.cy; if(dx*dx+dy*dy <= CASTRA_P.buffRadius*CASTRA_P.buffRadius) t.buffed = true; } });
  });
  // aanvallen: kies de vijand die het verst op het pad is binnen bereik
  sim.towers.forEach(t=>{
    if(t.cd>0){ t.cd--; return; }
    let best = null;
    sim.enemies.forEach(e=>{
      const dx=e.x-t.cx, dy=e.y-t.cy;
      if(dx*dx+dy*dy <= t.range*t.range && (!best || e.prog > best.prog)) best = e;
    });
    if(!best) return;
    const m = castraPTypeMul(t.type, best.type);
    let dmg = Math.floor(t.st.impetus*m[0]/m[1]) - Math.floor(best.st.tutela*2/5);
    dmg = Math.max(1, dmg);
    if(t.buffed) dmg = Math.max(1, Math.floor(dmg*(100+CASTRA_P.buffPct)/100));
    best.hp -= dmg; t.cd = t.cooldown;
    sim.events.push({ k:"hit", t:t.id, e:best.id, dmg });
  });
  // doden en doorbraken
  const alive = [];
  sim.enemies.forEach(e=>{
    if(e.hp<=0){ sim.kills++; sim.events.push({ k:"kill", e:e.id }); }
    else if(e.prog >= sim.path.len-1){ sim.baseHp -= (e.type==="myth"?2:1); sim.leaked++; sim.events.push({ k:"leak", e:e.id }); }
    else alive.push(e);
  });
  sim.enemies = alive;
  if(sim.baseHp<=0){ sim.baseHp = 0; sim.over = "lose"; return; }
  if(sim.waveActive && !sim.queue.length && !sim.enemies.length){
    sim.waveActive = false;
    if(sim.wave >= sim.mission.waves.length-1) sim.over = "win";
  }
}
// Voor tests: laat de hele missie lopen met vaste torenplaatsing.
function castraPRunHeadless(mission, towers, maxTicks=20000){
  const sim = castraPSim(mission, towers);
  while(!sim.over && sim.tick<maxTicks){ if(!sim.waveActive) castraPStartWave(sim); castraPStep(sim); }
  return sim;
}
