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

/* Missies. waves: [ [ {line: vorm-id, n, gap, lvl} ] ] — gap = ticks tussen twee vijanden. De vijanden zijn vormen uit de
   troepenbomen (tier en level groeien mee met de regio); hpMult stemt de zwaarte af (gesimuleerd, zie CASTRA_HEROUM.md). */
const _fid = (v,n)=>castraFormByName(v,n).id;
const CASTRA_P_MISSIONS = [
  { id:"m1", nm:"Defensio castrorum", nl:"De verdediging van het kamp", map:"a", seed:1101, hpMult:0.6,
    waves:[ [ {line:_fid("rom","Hastatus"),n:4,gap:26,lvl:3} ],
            [ {line:_fid("rom","Eques"),n:3,gap:22,lvl:3} ],
            [ {line:_fid("rom","Veles"),n:4,gap:24,lvl:3}, {line:_fid("rom","Hastatus"),n:2,gap:26,lvl:3} ] ],
    reward:{ aes:40, frumentum:30, gloria:3 } },
  { id:"m2", nm:"Via Latina", nl:"De Latijnse weg", map:"b", seed:1202, hpMult:3.9, needs:"m1",
    waves:[ [ {line:_fid("rom","Eques"),n:4,gap:20,lvl:10} ],
            [ {line:_fid("rom","Hastatus"),n:5,gap:24,lvl:10}, {line:_fid("rom","Veles"),n:1,gap:24,lvl:10} ],
            [ {line:_fid("rom","Veles"),n:5,gap:20,lvl:10} ],
            [ {line:_fid("rom","Eques"),n:3,gap:18,lvl:10}, {line:_fid("rom","Veles"),n:3,gap:20,lvl:10}, {line:_fid("rom","Hastatus"),n:3,gap:22,lvl:10} ] ],
    reward:{ aes:70, frumentum:50, gloria:5 } },
  { id:"m3", nm:"Oppugnatio Ardeae", nl:"De aanval op Ardea", map:"a", seed:1303, hpMult:3.4, needs:"m2",
    waves:[ [ {line:_fid("rom","Princeps"),n:6,gap:22,lvl:20} ],
            [ {line:_fid("myt","Satyrus"),n:4,gap:20,lvl:20}, {line:_fid("rom","Funditor"),n:3,gap:20,lvl:20} ],
            [ {line:_fid("rom","Decurio"),n:5,gap:16,lvl:20} ],
            [ {line:_fid("rom","Optio"),n:2,gap:24,lvl:20}, {line:_fid("rom","Princeps"),n:6,gap:20,lvl:20}, {line:_fid("rom","Funditor"),n:4,gap:18,lvl:20} ] ],
    reward:{ aes:110, frumentum:80, gloria:8 } },
  /* Graecia (opent na m2) */
  { id:"g1", region:"graecia", nm:"Labor primus", nl:"De eerste labor", map:"b", seed:2101, hpMult:3.4, needs:"m2",
    waves:[ [ {line:_fid("gra","Epilectus"),n:5,gap:22,lvl:24} ],
            [ {line:_fid("gra","Toxota"),n:5,gap:20,lvl:24} ],
            [ {line:_fid("gra","Prodromus"),n:4,gap:18,lvl:24}, {line:_fid("gra","Peltasta"),n:4,gap:20,lvl:24} ],
            [ {line:_fid("gra","Epilectus"),n:4,gap:20,lvl:24}, {line:_fid("myt","Silenus"),n:3,gap:20,lvl:24} ] ],
    reward:{ aes:150, frumentum:100, gloria:10 } },
  { id:"g2", region:"graecia", nm:"Labyrinthus", nl:"Het labyrint", map:"a", seed:2202, hpMult:5.8, needs:"g1",
    waves:[ [ {line:_fid("gra","Peltasta"),n:6,gap:18,lvl:28} ],
            [ {line:_fid("gra","Epilectus"),n:6,gap:20,lvl:28}, {line:_fid("gra","Toxota"),n:3,gap:20,lvl:28} ],
            [ {line:_fid("gra","Prodromus"),n:6,gap:16,lvl:28} ],
            [ {line:_fid("myt","Gryps"),n:3,gap:24,lvl:28}, {line:_fid("gra","Lochagus"),n:6,gap:18,lvl:28}, {line:_fid("gra","Peltasta"),n:4,gap:18,lvl:28} ] ],
    reward:{ aes:190, frumentum:130, gloria:12 } },
  /* Troia (opent na g1) */
  { id:"t1", region:"troia", nm:"Muri Troiae", nl:"De muren van Troje", map:"b", seed:3101, hpMult:4.7, needs:"g1",
    waves:[ [ {line:_fid("tro","Propugnator"),n:6,gap:20,lvl:32} ],
            [ {line:_fid("tro","Bellator curru"),n:5,gap:18,lvl:32}, {line:_fid("tro","Sagittarius Lycius"),n:4,gap:18,lvl:32} ],
            [ {line:_fid("tro","Sagittarius Lycius"),n:6,gap:16,lvl:32} ],
            [ {line:_fid("tro","Custos Pergami"),n:6,gap:16,lvl:32}, {line:_fid("tro","Bellator curru"),n:4,gap:16,lvl:32}, {line:_fid("gra","Lochagus"),n:2,gap:20,lvl:32} ] ],
    reward:{ aes:240, frumentum:160, gloria:14 } },
  { id:"t2", region:"troia", nm:"Equus ligneus", nl:"Het houten paard", map:"a", seed:3202, hpMult:5.6, needs:"t1",
    waves:[ [ {line:_fid("tro","Bellator curru"),n:7,gap:16,lvl:38} ],
            [ {line:_fid("tro","Custos Pergami"),n:7,gap:18,lvl:38}, {line:_fid("tro","Sagittarius Lycius"),n:4,gap:18,lvl:38} ],
            [ {line:_fid("myt","Harpyia"),n:4,gap:20,lvl:38}, {line:_fid("tro","Propugnator"),n:6,gap:16,lvl:38} ],
            [ {line:_fid("myt","Gryps"),n:3,gap:22,lvl:38}, {line:_fid("tro","Bellator curru"),n:6,gap:14,lvl:38}, {line:_fid("tro","Custos Pergami"),n:6,gap:16,lvl:38} ] ],
    reward:{ aes:300, frumentum:200, gloria:18 } },
  /* Gallia (opent na t2) */
  { id:"ga1", region:"gallia", nm:"Silva Gallica", nl:"Het Gallische woud", map:"b", seed:4101, hpMult:11.5, needs:"t2",
    waves:[ [ {line:_fid("gal","Gaesatus"),n:6,gap:20,lvl:40} ],
            [ {line:_fid("gal","Eques Gallus"),n:5,gap:18,lvl:40} ],
            [ {line:_fid("gal","Bardus"),n:5,gap:18,lvl:40}, {line:_fid("gal","Bellator Gallus"),n:4,gap:20,lvl:40} ],
            [ {line:_fid("ger","Frameatus"),n:6,gap:16,lvl:40}, {line:_fid("ger","Eques Germanus"),n:4,gap:16,lvl:40} ] ],
    reward:{ aes:340, frumentum:230, gloria:20 } },
  { id:"ga2", region:"gallia", nm:"Alesia", nl:"Het beleg van Alesia", map:"a", seed:4202, hpMult:7.4, needs:"ga1",
    waves:[ [ {line:_fid("gal","Bellator Gallus"),n:7,gap:16,lvl:46} ],
            [ {line:_fid("gal","Eques nobilis"),n:6,gap:16,lvl:46}, {line:_fid("gal","Druida"),n:3,gap:20,lvl:46} ],
            [ {line:_fid("ger","Centenus"),n:7,gap:14,lvl:46} ],
            [ {line:_fid("gal","Soldurius"),n:3,gap:20,lvl:48}, {line:_fid("ger","Batavus"),n:5,gap:14,lvl:46}, {line:_fid("gal","Bellator Gallus"),n:6,gap:14,lvl:46} ] ],
    reward:{ aes:420, frumentum:290, gloria:24 } },
  /* Aegyptus (opent na ga2) */
  { id:"ae1", region:"aegyptus", nm:"Ad Nilum", nl:"Aan de Nijl", map:"a", seed:5101, hpMult:13.3, needs:"ga2",
    waves:[ [ {line:_fid("aeg","Machimus"),n:6,gap:18,lvl:46} ],
            [ {line:_fid("aeg","Sagittarius Aegyptius"),n:6,gap:16,lvl:46} ],
            [ {line:_fid("aeg","Auriga Aegyptius"),n:5,gap:16,lvl:46}, {line:_fid("aeg","Scriba"),n:3,gap:20,lvl:46} ],
            [ {line:_fid("aeg","Satelles"),n:5,gap:16,lvl:46}, {line:_fid("aeg","Sagittarius Nubius"),n:4,gap:16,lvl:46} ] ],
    reward:{ aes:480, frumentum:330, gloria:26 } },
  { id:"ae2", region:"aegyptus", nm:"Pyramides", nl:"De piramiden", map:"b", seed:5202, hpMult:5.9, needs:"ae1",
    waves:[ [ {line:_fid("aeg","Satelles"),n:7,gap:14,lvl:50} ],
            [ {line:_fid("aeg","Bellator curru Aegyptius"),n:6,gap:14,lvl:50}, {line:_fid("aeg","Sacerdos Isidis"),n:3,gap:20,lvl:50} ],
            [ {line:_fid("aeg","Sagittarius Nubius"),n:7,gap:12,lvl:50} ],
            [ {line:_fid("aeg","Custos Pharaonis"),n:3,gap:20,lvl:50}, {line:_fid("aeg","Bellator curru Aegyptius"),n:6,gap:12,lvl:50}, {line:_fid("aeg","Satelles"),n:6,gap:12,lvl:50} ] ],
    reward:{ aes:560, frumentum:390, gloria:30 } },
  /* Persis (opent na ae2) */
  { id:"pe1", region:"persis", nm:"Via regia", nl:"De koningsweg", map:"b", seed:6101, hpMult:7, needs:"ae2",
    waves:[ [ {line:_fid("per","Sparabara"),n:7,gap:16,lvl:50} ],
            [ {line:_fid("per","Eques Persa"),n:6,gap:14,lvl:50}, {line:_fid("per","Magus"),n:3,gap:20,lvl:50} ],
            [ {line:_fid("per","Sagittarius Scytha"),n:7,gap:14,lvl:50} ],
            [ {line:_fid("per","Immortalis"),n:6,gap:14,lvl:50}, {line:_fid("per","Cataphractus"),n:4,gap:16,lvl:50} ] ],
    reward:{ aes:640, frumentum:440, gloria:34 } },
  { id:"pe2", region:"persis", nm:"Persepolis", nl:"Persepolis", map:"a", seed:6202, hpMult:5.3, needs:"pe1",
    waves:[ [ {line:_fid("per","Immortalis"),n:8,gap:12,lvl:50} ],
            [ {line:_fid("per","Cataphractus"),n:6,gap:12,lvl:50}, {line:_fid("per","Archimagus"),n:3,gap:18,lvl:50} ],
            [ {line:_fid("per","Sagittarius Scytha"),n:8,gap:10,lvl:50} ],
            [ {line:_fid("per","Melophorus"),n:4,gap:16,lvl:50}, {line:_fid("per","Clibanarius"),n:5,gap:14,lvl:50}, {line:_fid("per","Immortalis"),n:6,gap:12,lvl:50} ] ],
    reward:{ aes:740, frumentum:510, gloria:38 } },
  /* Africa (opent na pe2) */
  { id:"af1", region:"africa", nm:"Carthago", nl:"Het beleg van Carthago", map:"a", seed:7101, hpMult:11.1, needs:"pe2",
    waves:[ [ {line:_fid("car","Libyus"),n:7,gap:16,lvl:50} ],
            [ {line:_fid("car","Funditor Balearicus"),n:7,gap:14,lvl:50} ],
            [ {line:_fid("car","Eques Numida"),n:6,gap:14,lvl:50}, {line:_fid("car","Veteranus Libyus"),n:4,gap:18,lvl:50} ],
            [ {line:_fid("car","Elephantus bellicus"),n:3,gap:24,lvl:50}, {line:_fid("car","Veteranus Libyus"),n:6,gap:14,lvl:50} ] ],
    reward:{ aes:820, frumentum:570, gloria:42 } },
  { id:"af2", region:"africa", nm:"Ad Zamam", nl:"Bij Zama", map:"b", seed:7202, hpMult:4.4, needs:"af1",
    waves:[ [ {line:_fid("car","Veteranus Libyus"),n:8,gap:12,lvl:50} ],
            [ {line:_fid("car","Numida nobilis"),n:7,gap:12,lvl:50}, {line:_fid("car","Funditor Balearicus"),n:5,gap:14,lvl:50} ],
            [ {line:_fid("car","Elephantus bellicus"),n:5,gap:18,lvl:50} ],
            [ {line:_fid("car","Elephantus turritus"),n:3,gap:24,lvl:50}, {line:_fid("car","Miles sacer"),n:6,gap:12,lvl:50}, {line:_fid("car","Numida nobilis"),n:5,gap:12,lvl:50} ] ],
    reward:{ aes:920, frumentum:640, gloria:46 } },
  /* Roma (opent na af2) en Laconia (opent na ro2) */
  { id:"ro1", region:"roma", nm:"Forum Romanum", nl:"Het Forum", map:"a", seed:8101, hpMult:4.3, needs:"af2",
    waves:[ [ {line:_fid("rom","Triarius"),n:6,gap:16,lvl:50} ],
            [ {line:_fid("rom","Sagittarius"),n:6,gap:14,lvl:50}, {line:_fid("rom","Medicus"),n:2,gap:20,lvl:50} ],
            [ {line:_fid("rom","Praefectus alae"),n:5,gap:14,lvl:50} ],
            [ {line:_fid("rom","Centurio"),n:3,gap:20,lvl:50}, {line:_fid("rom","Triarius"),n:6,gap:12,lvl:50}, {line:_fid("rom","Speculator"),n:3,gap:16,lvl:50} ] ],
    reward:{ aes:1000, frumentum:700, gloria:50 } },
  { id:"ro2", region:"roma", nm:"Arena", nl:"De arena", map:"b", seed:8202, hpMult:8.4, needs:"ro1",
    waves:[ [ {line:_fid("gla","Murmillo"),n:6,gap:14,lvl:50}, {line:_fid("gla","Retiarius"),n:4,gap:16,lvl:50} ],
            [ {line:_fid("gla","Thraex"),n:6,gap:12,lvl:50}, {line:_fid("gla","Secutor"),n:4,gap:14,lvl:50} ],
            [ {line:_fid("gla","Dimachaerus"),n:5,gap:12,lvl:50}, {line:_fid("gla","Essedarius"),n:4,gap:14,lvl:50} ],
            [ {line:_fid("gla","Primus palus"),n:4,gap:18,lvl:50}, {line:_fid("gla","Hoplomachus"),n:6,gap:12,lvl:50}, {line:_fid("gla","Rudiarius"),n:3,gap:16,lvl:50} ] ],
    reward:{ aes:1100, frumentum:770, gloria:54 } },
  { id:"la1", region:"laconia", nm:"Thermopylae", nl:"Thermopylae", map:"b", seed:9101, hpMult:6.2, needs:"ro2",
    waves:[ [ {line:_fid("spa","Spartiates"),n:7,gap:14,lvl:50} ],
            [ {line:_fid("spa","Sciritas"),n:6,gap:14,lvl:50}, {line:_fid("spa","Perioecus"),n:4,gap:14,lvl:50} ],
            [ {line:_fid("spa","Trecentus"),n:6,gap:12,lvl:50} ],
            [ {line:_fid("spa","Polemarchus"),n:3,gap:18,lvl:50}, {line:_fid("spa","Trecentus"),n:6,gap:12,lvl:50}, {line:_fid("spa","Sciritas"),n:4,gap:12,lvl:50} ] ],
    reward:{ aes:1200, frumentum:840, gloria:58 } },
  { id:"la2", region:"laconia", nm:"Sparta", nl:"De strijd om Sparta", map:"a", seed:9202, hpMult:5.3, needs:"la1",
    waves:[ [ {line:_fid("spa","Trecentus"),n:8,gap:12,lvl:50} ],
            [ {line:_fid("spa","Sciritas"),n:8,gap:10,lvl:50}, {line:_fid("spa","Polemarchus"),n:2,gap:20,lvl:50} ],
            [ {line:_fid("spa","Trecentus"),n:7,gap:10,lvl:50}, {line:_fid("myt","Lupus Martius"),n:3,gap:20,lvl:50} ],
            [ {line:_fid("spa","Polemarchus"),n:5,gap:14,lvl:50}, {line:_fid("spa","Trecentus"),n:8,gap:10,lvl:50}, {line:_fid("spa","Sciritas"),n:6,gap:10,lvl:50} ] ],
    reward:{ aes:1300, frumentum:910, gloria:62 } },
  /* Germania (opent na la2) */
  { id:"gm1", region:"germania", nm:"Saltus Teutoburgiensis", nl:"Het Teutoburgerwoud", map:"b", seed:10101, hpMult:6.2, needs:"la2",
    waves:[ [ {line:_fid("ger","Centenus"),n:7,gap:14,lvl:50} ],
            [ {line:_fid("ger","Batavus"),n:6,gap:14,lvl:50}, {line:_fid("ger","Saga"),n:3,gap:20,lvl:50} ],
            [ {line:_fid("ger","Centenus"),n:7,gap:12,lvl:50}, {line:_fid("myt","Lupus Martius"),n:3,gap:20,lvl:50} ],
            [ {line:_fid("ger","Comes"),n:3,gap:20,lvl:50}, {line:_fid("ger","Batavus"),n:6,gap:12,lvl:50}, {line:_fid("ger","Vates Germana"),n:3,gap:18,lvl:50} ] ],
    reward:{ aes:1400, frumentum:980, gloria:66 } },
  { id:"gm2", region:"germania", nm:"Ad Rhenum", nl:"Aan de Rijn", map:"a", seed:10202, hpMult:4, needs:"gm1",
    waves:[ [ {line:_fid("ger","Comes"),n:6,gap:12,lvl:50} ],
            [ {line:_fid("ger","Batavus"),n:8,gap:10,lvl:50}, {line:_fid("ger","Vates Germana"),n:3,gap:18,lvl:50} ],
            [ {line:_fid("ger","Centenus"),n:9,gap:10,lvl:50} ],
            [ {line:_fid("ger","Comes"),n:5,gap:14,lvl:50}, {line:_fid("ger","Batavus"),n:8,gap:10,lvl:50}, {line:_fid("myt","Draco"),n:2,gap:26,lvl:50} ] ],
    reward:{ aes:1500, frumentum:1050, gloria:70 } },
];
for(const m of CASTRA_P_MISSIONS){ if(!m.region) m.region = "latium"; }

/* Uiterlijk per vorm: avatar-lagen per volk, rol en tier (castraFormLook, castra-troops.js). */
function castraPLook(lineId){ return castraFormLook(castraLine(lineId)); }

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
  const s = { line:lineId, lvl, indoles, ingenium:ing };
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
  if(s.snap){ st = s.snap.st; type = s.snap.type; look = s.snap.look || null; }
  else if(s.hero){ st = castraHeroStats(s.h); type = CASTRA_HERO_DATA[s.h.id].type; look = CASTRA_HERO_DATA[s.h.id].look; }
  else { st = s.dux ? { ...CASTRA_V_BAL.dux } : castraStats(s); type = castraLine(s.line).type; }
  return { id:sim.nextId++, sid:s.id, line:s.line, look, type, owner:s.owner||null, x, y, cx:x*1000+500, cy:y*1000+500, st, cd:0,
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
