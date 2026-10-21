/* ============================================================================
   CASTRA HERONUM — PROELIUM (tower defence met je eigen soldaten)
   ----------------------------------------------------------------------------
   Poort: porta praetoria -> campagnelijst -> gevecht. Vijanden lopen een pad af
   naar je kamp; jij plaatst je soldaten als verdedigers (alle soldaten zijn
   "torens" met bereik uit ambitus, schade uit impetus, tempo uit celeritas).
   Het Latijnse verkenningsbericht noemt per golf (ala) welke typen komen:
   wie leest, plaatst de juiste soldaten (infanterie > ruiterij > afstand >
   infanterie). Zonder soldaat verdedigt de dux zelf.

   DE SIMULATIE IS DETERMINISTISCH (voorbereiding op de coöperatieve
   lockstep-modus in de Legio, zie CASTRA_HERONUM.md): vaste tick (50 ms),
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
/* Synergieën en bevelen (alles in gehele getallen, deterministisch; uitleg en namen in castra-roles.js). */
const CASTRA_P_SYN = {
  muriR:3000, muriSlow:25, muriTicks:30,     // infanterie vertraagt vijanden als er een boogschutter binnen 3 tegels staat
  persN:3, persD:2,                          // cavalerie: ×3/2 schade tegen vijanden onder de helft van hun levenspunten
  aciesPct:115,                              // boogschutter bij een ondersteuner: 115% bereik
};
const CASTRA_P_CMD = {
  energyMax:3, energyStart:1, perKills:15, perWave:1,
  impeteTicks:160, impeteDmg:125, impeteCd:70,   // Impete!: 8 s lang 25% meer schade en 30% snellere aanvallen
  stateTicks:80, stateSpd:40,                    // State!: 4 s lang lopen alle vijanden op 40% snelheid
};

/* Het pad (waypoints in tegels) en hindernissen; twee lay-outs. */
const CASTRA_P_MAPS = {
  a: { path:[[0,1],[13,1],[13,5],[2,5],[2,9],[15,9]],
       trees:[[5,3],[6,3],[9,3],[10,3],[7,7],[8,7],[11,7],[14,3],[1,3],[4,10],[12,10],[14,7],[0,10]] },
  b: { path:[[0,9],[3,9],[3,2],[10,2],[10,7],[14,7],[14,1],[15,1]],
       trees:[[6,5],[7,5],[6,6],[12,4],[12,5],[1,5],[1,6],[5,10],[8,9],[9,9],[13,9],[7,0],[5,0]] },
};

/* Missies. waves: [ [ {line: vorm-id, n, gap, lvl} ] ] — gap = ticks tussen twee vijanden. De vijanden zijn vormen uit de
   troepenbomen (tier en level groeien mee met de regio); hpMult stemt de zwaarte af (gesimuleerd, zie CASTRA_HERONUM.md). */
const _fid = (v,n)=>castraFormByName(v,n).id;
const CASTRA_P_MISSIONS = [
  { id:"m1", nm:"Defensio castrorum", nl:"De verdediging van het kamp", map:"a", seed:1101, hpMult:0.45,
    waves:[ [ {line:_fid("rom","Hastatus"),n:4,gap:26,lvl:3} ],
            [ {line:_fid("rom","Eques"),n:3,gap:22,lvl:3} ],
            [ {line:_fid("rom","Veles"),n:4,gap:24,lvl:3}, {line:_fid("rom","Hastatus"),n:2,gap:26,lvl:3} ] ],
    reward:{ aes:40, frumentum:30, gloria:3 } },
  { id:"m2", nm:"Via Latina", nl:"De Latijnse weg", map:"b", seed:1202, hpMult:1.64, needs:"m1",
    waves:[ [ {line:_fid("rom","Eques"),n:4,gap:20,lvl:10} ],
            [ {line:_fid("rom","Hastatus"),n:5,gap:24,lvl:10}, {line:_fid("rom","Veles"),n:1,gap:24,lvl:10} ],
            [ {line:_fid("rom","Veles"),n:5,gap:20,lvl:10} ],
            [ {line:_fid("rom","Eques"),n:3,gap:18,lvl:10}, {line:_fid("rom","Veles"),n:3,gap:20,lvl:10}, {line:_fid("rom","Hastatus"),n:3,gap:22,lvl:10} ] ],
    reward:{ aes:70, frumentum:50, gloria:5 } },
  { id:"m3", nm:"Oppugnatio Ardeae", nl:"De aanval op Ardea", map:"a", seed:1303, hpMult:1.09, needs:"m2",
    waves:[ [ {line:_fid("rom","Princeps"),n:6,gap:22,lvl:14} ],
            [ {line:_fid("myt","Satyrus"),n:4,gap:20,lvl:14}, {line:_fid("rom","Funditor"),n:3,gap:20,lvl:14} ],
            [ {line:_fid("rom","Decurio"),n:5,gap:16,lvl:14} ],
            [ {line:_fid("rom","Optio"),n:2,gap:24,lvl:14}, {line:_fid("rom","Princeps"),n:6,gap:20,lvl:14}, {line:_fid("rom","Funditor"),n:4,gap:18,lvl:14} ] ],
    reward:{ aes:110, frumentum:80, gloria:8 } },
  /* Roma (opent na m3) */
  { id:"ro1", region:"roma", nm:"Forum Romanum", nl:"Het Forum", map:"a", seed:8101, hpMult:3.23, needs:"m3",
    waves:[ [ {line:_fid("rom","Hastatus"),n:6,gap:16,lvl:17} ],
            [ {line:_fid("rom","Veles"),n:6,gap:14,lvl:17}, {line:_fid("rom","Capsarius"),n:2,gap:20,lvl:17} ],
            [ {line:_fid("rom","Princeps"),n:5,gap:14,lvl:17} ],
            [ {line:_fid("rom","Optio"),n:3,gap:20,lvl:17}, {line:_fid("rom","Hastatus"),n:6,gap:12,lvl:17}, {line:_fid("rom","Funditor"),n:3,gap:16,lvl:17} ] ],
    reward:{ aes:1000, frumentum:700, gloria:50 } },
  { id:"ro2", region:"roma", nm:"Arena", nl:"De arena", map:"b", seed:8202, hpMult:5.06, needs:"ro1",
    waves:[ [ {line:_fid("gla","Murmillo"),n:6,gap:14,lvl:20}, {line:_fid("gla","Retiarius"),n:4,gap:16,lvl:20} ],
            [ {line:_fid("gla","Thraex"),n:6,gap:12,lvl:20}, {line:_fid("gla","Secutor"),n:4,gap:14,lvl:20} ],
            [ {line:_fid("gla","Dimachaerus"),n:5,gap:12,lvl:20}, {line:_fid("gla","Essedarius"),n:4,gap:14,lvl:20} ],
            [ {line:_fid("gla","Primus palus"),n:4,gap:18,lvl:20}, {line:_fid("gla","Hoplomachus"),n:6,gap:12,lvl:20}, {line:_fid("gla","Rudiarius"),n:3,gap:16,lvl:20} ] ],
    reward:{ aes:1100, frumentum:770, gloria:54 } },
  /* Gallia (opent na ro2) */
  { id:"ga1", region:"gallia", nm:"Silva Gallica", nl:"Het Gallische woud", map:"b", seed:4101, hpMult:5.81, needs:"ro2",
    waves:[ [ {line:_fid("gal","Gaesatus"),n:6,gap:20,lvl:23} ],
            [ {line:_fid("gal","Eques Gallus"),n:5,gap:18,lvl:23} ],
            [ {line:_fid("gal","Bardus"),n:5,gap:18,lvl:23}, {line:_fid("gal","Bellator Gallus"),n:4,gap:20,lvl:23} ],
            [ {line:_fid("ger","Frameatus"),n:6,gap:16,lvl:23}, {line:_fid("ger","Eques Germanus"),n:4,gap:16,lvl:23} ] ],
    reward:{ aes:340, frumentum:230, gloria:20 } },
  { id:"ga2", region:"gallia", nm:"Alesia", nl:"Het beleg van Alesia", map:"a", seed:4202, hpMult:3.73, needs:"ga1",
    waves:[ [ {line:_fid("gal","Bellator Gallus"),n:7,gap:16,lvl:26} ],
            [ {line:_fid("gal","Eques nobilis"),n:6,gap:16,lvl:26}, {line:_fid("gal","Druida"),n:3,gap:20,lvl:26} ],
            [ {line:_fid("ger","Centenus"),n:7,gap:14,lvl:26} ],
            [ {line:_fid("gal","Soldurius"),n:3,gap:20,lvl:26}, {line:_fid("ger","Batavus"),n:5,gap:14,lvl:26}, {line:_fid("gal","Bellator Gallus"),n:6,gap:14,lvl:26} ] ],
    reward:{ aes:420, frumentum:290, gloria:24 } },
  /* Germania (opent na ga2) */
  { id:"gm1", region:"germania", nm:"Saltus Teutoburgiensis", nl:"Het Teutoburgerwoud", map:"b", seed:10101, hpMult:2.55, needs:"ga2",
    waves:[ [ {line:_fid("ger","Centenus"),n:7,gap:14,lvl:29} ],
            [ {line:_fid("ger","Batavus"),n:6,gap:14,lvl:29}, {line:_fid("ger","Saga"),n:3,gap:20,lvl:29} ],
            [ {line:_fid("ger","Centenus"),n:7,gap:12,lvl:29}, {line:_fid("myt","Lupus Martius"),n:3,gap:20,lvl:29} ],
            [ {line:_fid("ger","Comes"),n:3,gap:20,lvl:29}, {line:_fid("ger","Batavus"),n:6,gap:12,lvl:29}, {line:_fid("ger","Vates Germana"),n:3,gap:18,lvl:29} ] ],
    reward:{ aes:1400, frumentum:980, gloria:66 } },
  { id:"gm2", region:"germania", nm:"Ad Rhenum", nl:"Aan de Rijn", map:"a", seed:10202, hpMult:5.69, needs:"gm1",
    waves:[ [ {line:_fid("ger","Comes"),n:6,gap:12,lvl:32} ],
            [ {line:_fid("ger","Batavus"),n:8,gap:10,lvl:32}, {line:_fid("ger","Vates Germana"),n:3,gap:18,lvl:32} ],
            [ {line:_fid("ger","Centenus"),n:9,gap:10,lvl:32} ],
            [ {line:_fid("ger","Comes"),n:5,gap:14,lvl:32}, {line:_fid("ger","Batavus"),n:8,gap:10,lvl:32}, {line:_fid("myt","Draco"),n:2,gap:26,lvl:32} ] ],
    reward:{ aes:1500, frumentum:1050, gloria:70 } },
  /* Graecia (opent na gm2, per schip vanuit Latium) */
  { id:"g1", region:"graecia", nm:"Labor primus", nl:"De eerste labor", map:"b", seed:2101, hpMult:25.43, needs:"gm2",
    waves:[ [ {line:_fid("gra","Epilectus"),n:5,gap:22,lvl:35} ],
            [ {line:_fid("gra","Toxota"),n:5,gap:20,lvl:35} ],
            [ {line:_fid("gra","Prodromus"),n:4,gap:18,lvl:35}, {line:_fid("gra","Peltasta"),n:4,gap:20,lvl:35} ],
            [ {line:_fid("gra","Epilectus"),n:4,gap:20,lvl:35}, {line:_fid("myt","Silenus"),n:3,gap:20,lvl:35} ] ],
    reward:{ aes:150, frumentum:100, gloria:10 } },
  { id:"g2", region:"graecia", nm:"Labyrinthus", nl:"Het labyrint", map:"a", seed:2202, hpMult:5.18, needs:"g1",
    waves:[ [ {line:_fid("gra","Peltasta"),n:6,gap:18,lvl:37} ],
            [ {line:_fid("gra","Epilectus"),n:6,gap:20,lvl:37}, {line:_fid("gra","Toxota"),n:3,gap:20,lvl:37} ],
            [ {line:_fid("gra","Prodromus"),n:6,gap:16,lvl:37} ],
            [ {line:_fid("myt","Gryps"),n:3,gap:24,lvl:37}, {line:_fid("gra","Lochagus"),n:6,gap:18,lvl:37}, {line:_fid("gra","Peltasta"),n:4,gap:18,lvl:37} ] ],
    reward:{ aes:190, frumentum:130, gloria:12 } },
  /* Laconia (opent na g2) */
  { id:"la1", region:"laconia", nm:"Thermopylae", nl:"Thermopylae", map:"b", seed:9101, hpMult:17.17, needs:"g2",
    waves:[ [ {line:_fid("spa","Spartiates"),n:7,gap:14,lvl:39} ],
            [ {line:_fid("spa","Sciritas"),n:6,gap:14,lvl:39}, {line:_fid("spa","Perioecus"),n:4,gap:14,lvl:39} ],
            [ {line:_fid("spa","Trecentus"),n:6,gap:12,lvl:39} ],
            [ {line:_fid("spa","Polemarchus"),n:3,gap:18,lvl:39}, {line:_fid("spa","Trecentus"),n:6,gap:12,lvl:39}, {line:_fid("spa","Sciritas"),n:4,gap:12,lvl:39} ] ],
    reward:{ aes:1200, frumentum:840, gloria:58 } },
  { id:"la2", region:"laconia", nm:"Sparta", nl:"De strijd om Sparta", map:"a", seed:9202, hpMult:12.72, needs:"la1",
    waves:[ [ {line:_fid("spa","Trecentus"),n:8,gap:12,lvl:41} ],
            [ {line:_fid("spa","Sciritas"),n:8,gap:10,lvl:41}, {line:_fid("spa","Polemarchus"),n:2,gap:20,lvl:41} ],
            [ {line:_fid("spa","Trecentus"),n:7,gap:10,lvl:41}, {line:_fid("myt","Lupus Martius"),n:3,gap:20,lvl:41} ],
            [ {line:_fid("spa","Polemarchus"),n:5,gap:14,lvl:41}, {line:_fid("spa","Trecentus"),n:8,gap:10,lvl:41}, {line:_fid("spa","Sciritas"),n:6,gap:10,lvl:41} ] ],
    reward:{ aes:1300, frumentum:910, gloria:62 } },
  /* Troia (opent na la2) */
  { id:"t1", region:"troia", nm:"Muri Troiae", nl:"De muren van Troje", map:"b", seed:3101, hpMult:8.23, needs:"la2",
    waves:[ [ {line:_fid("tro","Propugnator"),n:6,gap:20,lvl:43} ],
            [ {line:_fid("tro","Bellator curru"),n:5,gap:18,lvl:43}, {line:_fid("tro","Sagittarius Lycius"),n:4,gap:18,lvl:43} ],
            [ {line:_fid("tro","Sagittarius Lycius"),n:6,gap:16,lvl:43} ],
            [ {line:_fid("tro","Custos Pergami"),n:6,gap:16,lvl:43}, {line:_fid("tro","Bellator curru"),n:4,gap:16,lvl:43}, {line:_fid("gra","Lochagus"),n:2,gap:20,lvl:43} ] ],
    reward:{ aes:240, frumentum:160, gloria:14 } },
  { id:"t2", region:"troia", nm:"Equus ligneus", nl:"Het houten paard", map:"a", seed:3202, hpMult:3.49, needs:"t1",
    waves:[ [ {line:_fid("tro","Bellator curru"),n:7,gap:16,lvl:44} ],
            [ {line:_fid("tro","Custos Pergami"),n:7,gap:18,lvl:44}, {line:_fid("tro","Sagittarius Lycius"),n:4,gap:18,lvl:44} ],
            [ {line:_fid("myt","Harpyia"),n:4,gap:20,lvl:44}, {line:_fid("tro","Propugnator"),n:6,gap:16,lvl:44} ],
            [ {line:_fid("myt","Gryps"),n:3,gap:22,lvl:44}, {line:_fid("tro","Bellator curru"),n:6,gap:14,lvl:44}, {line:_fid("tro","Custos Pergami"),n:6,gap:16,lvl:44} ] ],
    reward:{ aes:300, frumentum:200, gloria:18 } },
  /* Themiscyra (opent na t2) */
  { id:"th1", region:"themiscyra", nm:"Themiscyra", nl:"Het rijk van de Amazones", map:"a", seed:11101, hpMult:12.29, needs:"t2",
    waves:[ [ {line:_fid("ama","Sagittaria"),n:8,gap:14,lvl:45} ],
            [ {line:_fid("ama","Peltasta Amazon"),n:7,gap:14,lvl:45} ],
            [ {line:_fid("ama","Sagittaria equestris"),n:6,gap:14,lvl:45}, {line:_fid("ama","Sagittaria"),n:4,gap:14,lvl:45} ],
            [ {line:_fid("ama","Securifera"),n:6,gap:14,lvl:45}, {line:_fid("ama","Sagittaria equestris"),n:5,gap:12,lvl:45} ] ],
    reward:{ aes:1600, frumentum:1120, gloria:74 } },
  { id:"th2", region:"themiscyra", nm:"Hippolyte", nl:"De strijd om Hippolyte", map:"b", seed:11202, hpMult:3.33, needs:"th1",
    waves:[ [ {line:_fid("ama","Securifera"),n:8,gap:12,lvl:46} ],
            [ {line:_fid("ama","Sagittaria equestris"),n:8,gap:10,lvl:46}, {line:_fid("ama","Peltasta Amazon"),n:4,gap:14,lvl:46} ],
            [ {line:_fid("ama","Sagittaria"),n:9,gap:10,lvl:46}, {line:_fid("myt","Gryps"),n:3,gap:20,lvl:46} ],
            [ {line:_fid("ama","Securifera"),n:7,gap:10,lvl:46}, {line:_fid("ama","Sagittaria equestris"),n:7,gap:10,lvl:46}, {line:_fid("myt","Equus alatus"),n:3,gap:20,lvl:46} ] ],
    reward:{ aes:1800, frumentum:1260, gloria:80 } },
  /* Persis (opent na th2) */
  { id:"pe1", region:"persis", nm:"Via regia", nl:"De koningsweg", map:"b", seed:6101, hpMult:12.35, needs:"th2",
    waves:[ [ {line:_fid("per","Sparabara"),n:7,gap:16,lvl:47} ],
            [ {line:_fid("per","Eques Persa"),n:6,gap:14,lvl:47}, {line:_fid("per","Magus"),n:3,gap:20,lvl:47} ],
            [ {line:_fid("per","Sagittarius Scytha"),n:7,gap:14,lvl:47} ],
            [ {line:_fid("per","Immortalis"),n:6,gap:14,lvl:47}, {line:_fid("per","Cataphractus"),n:4,gap:16,lvl:47} ] ],
    reward:{ aes:640, frumentum:440, gloria:34 } },
  { id:"pe2", region:"persis", nm:"Persepolis", nl:"Persepolis", map:"a", seed:6202, hpMult:5.06, needs:"pe1",
    waves:[ [ {line:_fid("per","Immortalis"),n:8,gap:12,lvl:48} ],
            [ {line:_fid("per","Cataphractus"),n:6,gap:12,lvl:48}, {line:_fid("per","Archimagus"),n:3,gap:18,lvl:48} ],
            [ {line:_fid("per","Sagittarius Scytha"),n:8,gap:10,lvl:48} ],
            [ {line:_fid("per","Melophorus"),n:4,gap:16,lvl:48}, {line:_fid("per","Clibanarius"),n:5,gap:14,lvl:48}, {line:_fid("per","Immortalis"),n:6,gap:12,lvl:48} ] ],
    reward:{ aes:740, frumentum:510, gloria:38 } },
  /* Aegyptus (opent na pe2) */
  { id:"ae1", region:"aegyptus", nm:"Ad Nilum", nl:"Aan de Nijl", map:"a", seed:5101, hpMult:36.26, needs:"pe2",
    waves:[ [ {line:_fid("aeg","Machimus"),n:6,gap:18,lvl:49} ],
            [ {line:_fid("aeg","Sagittarius Aegyptius"),n:6,gap:16,lvl:49} ],
            [ {line:_fid("aeg","Auriga Aegyptius"),n:5,gap:16,lvl:49}, {line:_fid("aeg","Scriba"),n:3,gap:20,lvl:49} ],
            [ {line:_fid("aeg","Satelles"),n:5,gap:16,lvl:49}, {line:_fid("aeg","Sagittarius Nubius"),n:4,gap:16,lvl:49} ] ],
    reward:{ aes:480, frumentum:330, gloria:26 } },
  { id:"ae2", region:"aegyptus", nm:"Pyramides", nl:"De piramiden", map:"b", seed:5202, hpMult:4.25, needs:"ae1",
    waves:[ [ {line:_fid("aeg","Satelles"),n:7,gap:14,lvl:50} ],
            [ {line:_fid("aeg","Bellator curru Aegyptius"),n:6,gap:14,lvl:50}, {line:_fid("aeg","Sacerdos Isidis"),n:3,gap:20,lvl:50} ],
            [ {line:_fid("aeg","Sagittarius Nubius"),n:7,gap:12,lvl:50} ],
            [ {line:_fid("aeg","Custos Pharaonis"),n:3,gap:20,lvl:50}, {line:_fid("aeg","Bellator curru Aegyptius"),n:6,gap:12,lvl:50}, {line:_fid("aeg","Satelles"),n:6,gap:12,lvl:50} ] ],
    reward:{ aes:560, frumentum:390, gloria:30 } },
  /* Africa (opent na ae2) */
  { id:"af1", region:"africa", nm:"Carthago", nl:"Het beleg van Carthago", map:"a", seed:7101, hpMult:8.83, needs:"ae2",
    waves:[ [ {line:_fid("car","Libyus"),n:7,gap:16,lvl:50} ],
            [ {line:_fid("car","Funditor Balearicus"),n:7,gap:14,lvl:50} ],
            [ {line:_fid("car","Eques Numida"),n:6,gap:14,lvl:50}, {line:_fid("car","Veteranus Libyus"),n:4,gap:18,lvl:50} ],
            [ {line:_fid("car","Elephantus bellicus"),n:3,gap:24,lvl:50}, {line:_fid("car","Veteranus Libyus"),n:6,gap:14,lvl:50} ] ],
    reward:{ aes:820, frumentum:570, gloria:42 } },
  { id:"af2", region:"africa", nm:"Ad Zamam", nl:"Bij Zama", map:"b", seed:7202, hpMult:6.86, needs:"af1",
    waves:[ [ {line:_fid("car","Veteranus Libyus"),n:8,gap:12,lvl:50} ],
            [ {line:_fid("car","Numida nobilis"),n:7,gap:12,lvl:50}, {line:_fid("car","Funditor Balearicus"),n:5,gap:14,lvl:50} ],
            [ {line:_fid("car","Elephantus bellicus"),n:5,gap:18,lvl:50} ],
            [ {line:_fid("car","Elephantus turritus"),n:3,gap:24,lvl:50}, {line:_fid("car","Miles sacer"),n:6,gap:12,lvl:50}, {line:_fid("car","Numida nobilis"),n:5,gap:12,lvl:50} ] ],
    reward:{ aes:920, frumentum:640, gloria:46 } },
];
for(const m of CASTRA_P_MISSIONS){ if(!m.region) m.region = "latium"; }

/* Uiterlijk per vorm: avatar-lagen per volk, rol en tier (castraFormLook, castra-troops.js). */
function castraPLook(lineId){ return castraFormLook(castraLine(lineId)); }

/* ---------- pad ---------- */
function castraPPathFrom(poly){
  const pts = poly.map(p=>[p[0]*1000+500, p[1]*1000+500]);
  const seg = []; let len = 0;
  for(let i=0;i<pts.length-1;i++){
    const d = Math.abs(pts[i+1][0]-pts[i][0]) + Math.abs(pts[i+1][1]-pts[i][1]);
    seg.push({ a:pts[i], b:pts[i+1], d, start:len }); len += d;
  }
  return { pts, seg, len };
}
function castraPPath(mapId){ return castraPPathFrom(CASTRA_P_MAPS[mapId].path); }
// Een kaart kan meerdere banen hebben (lanes): vijanden verdelen zich om en om over de banen (deterministisch).
function castraPPaths(mapId){ const M = CASTRA_P_MAPS[mapId]; return (M.lanes || [M.path]).map(castraPPathFrom); }
function castraPPos(path, prog){
  const p = Math.min(prog, path.len-1);
  const s = path.seg.find(x=>p < x.start + x.d) || path.seg[path.seg.length-1];
  const t = s.d ? (p - s.start) / s.d : 0;
  return [ Math.floor(s.a[0] + (s.b[0]-s.a[0])*t), Math.floor(s.a[1] + (s.b[1]-s.a[1])*t) ];
}
function castraPPathCells(mapId){
  const cells = {}, M = CASTRA_P_MAPS[mapId];
  (M.lanes || [M.path]).forEach(P=>{
    for(let i=0;i<P.length-1;i++){
      const [x0,y0] = P[i], [x1,y1] = P[i+1];
      for(let x=Math.min(x0,x1); x<=Math.max(x0,x1); x++) for(let y=Math.min(y0,y1); y<=Math.max(y0,y1); y++) cells[x+","+y] = 1;
    }
  });
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
  const paths = castraPPaths(mission.map), path = paths[0];
  const sim = {
    mission, path, paths, spawnN:0, tick:0, rng: castraRng(mission.seed), baseHp: CASTRA_P.baseHp, wave:-1, waveActive:false,
    queue:[], enemies:[], towers:[], nextId:1, kills:0, leaked:0, over:null, events:[],
    stat:{ dmg:{}, prev:0, heal:0, pers:0, imp:0, muri:0, leaks:[] },      // gevechtsstatistiek voor het rapport (geen invloed op de uitkomst)
    cmdOn:false, energy:0, cmd:{ impete:0, state:0 }, cmdQ:[], cmdLog:[],      // bevelen (alleen aan in solo-gevechten, zie castraBStart)
  };
  towerSoldiers.forEach(t=>sim.towers.push(castraPMakeTower(sim, t.s, t.x, t.y)));
  return sim;
}
function castraPMakeTower(sim, s, x, y){
  let st, type, look = null, skIds = [];
  if(s.snap){ st = s.snap.st; type = s.snap.type; look = s.snap.look || null; skIds = s.snap.sk || []; }
  else if(s.hero){ st = castraHeroStats(s.h); type = CASTRA_HERO_DATA[s.h.id].type; look = CASTRA_HERO_DATA[s.h.id].look; skIds = castraHeroSkillIds(s.h); }
  else { st = s.dux ? { ...CASTRA_V_BAL.dux } : castraStats(s); type = castraLine(s.line).type; if(!s.dux) skIds = castraSkillIds(s); }
  const sk = castraSkillAgg(skIds);
  const range = Math.round((CASTRA_P.rangeBase + st.ambitus*CASTRA_P.rangePerAmb)*(100+sk.rng)/100);
  const cooldown = Math.max(CASTRA_P.cdMin, Math.round((CASTRA_P.cdBase - st.celeritas*CASTRA_P.cdPerCel)*(100-sk.cd)/100));
  return { id:sim.nextId++, sid:s.id, line:s.line, look, type, owner:s.owner||null, x, y, cx:x*1000+500, cy:y*1000+500, st, cd:0,
           range, cooldown, buffed:false, sk, skIds, hits:0, charge: sk.charge ? sk.charge.hits : 0, aura:0 };
}
// Automatische golf (eindeloze Colosseum-modus): golf k start op een vaste tick, ook als de vorige nog loopt.
function castraPAutoWave(sim){
  sim.wave++; sim.waveActive = true;
  sim.towers.forEach(t=>{ if(t.sk && t.sk.charge) t.charge = t.sk.charge.hits; });
  let t = sim.tick + CASTRA_P.startDelay;
  sim.mission.waves[sim.wave].forEach(g=>{
    for(let i=0;i<g.n;i++){ sim.queue.push({ at:t, line:g.line, lvl:g.lvl, hp:g.hp, role:g.role }); t += g.gap; }
  });
  sim.queue.sort((a,b)=>a.at-b.at);
}
// Start de volgende golf (maakt de spawnrij).
function castraPStartWave(sim){
  if(sim.over || sim.waveActive) return false;
  sim.wave++;
  if(sim.wave >= sim.mission.waves.length){ sim.wave = sim.mission.waves.length-1; return false; }
  sim.waveActive = true;
  sim.towers.forEach(t=>{ if(t.sk && t.sk.charge) t.charge = t.sk.charge.hits; });
  let t = sim.tick + CASTRA_P.startDelay;
  sim.mission.waves[sim.wave].forEach(g=>{
    for(let i=0;i<g.n;i++){ sim.queue.push({ at:t, line:g.line, lvl:g.lvl, hp:g.hp, role:g.role }); t += g.gap; }
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
/* ---------- vijandrollen (data: castra-roles.js) ---------- */
// Schade na verdediging van de vijand (zware krijger: eigen pantser; schilddrager: aura voor naburige vijanden).
function castraPDmgTaken(e, dmg){
  const d0 = dmg;
  if(e.red) dmg = Math.max(1, Math.floor(dmg*(100-e.red)/100));
  if(e.prot) dmg = Math.max(1, Math.floor(dmg*(100-e.prot)/100));
  return dmg;
}
// Schade toebrengen aan een vijand (met pantser/schild) en bijhouden voor het rapport.
function castraPApply(sim, t, e, d){
  const f = (e.red||e.prot) ? castraPDmgTaken(e, d) : d;
  if(f<d) sim.stat.prev += d-f;
  sim.stat.dmg[t.id] = (sim.stat.dmg[t.id]||0) + Math.max(0, Math.min(f, e.hp));
  e.hp -= f; return f;
}
// Per tik: schilddragers beschermen naburige vijanden, genezers herstellen ze (deterministisch, vaste volgorde).
function castraPRoles(sim){
  const en = sim.enemies, A = CASTRA_P_ROLES;
  en.forEach(e=>{ e.prot = 0; });
  en.forEach(s=>{
    if(s.role!=="scutarius") return; const R = A.scutarius, r2 = R.radius*R.radius;
    en.forEach(o=>{ if(o!==s){ const dx=o.x-s.x, dy=o.y-s.y; if(dx*dx+dy*dy <= r2 && R.prot > o.prot) o.prot = R.prot; } });
  });
  en.forEach(m=>{
    if(m.role!=="medicus" || m.hp<=0) return; const R = A.medicus;
    if(m.hc>0){ m.hc--; return; }
    const r2 = R.radius*R.radius; let did = false;
    en.forEach(o=>{ if(o!==m && o.hp>0 && o.hp<o.maxHp){ const dx=o.x-m.x, dy=o.y-m.y;
      if(dx*dx+dy*dy <= r2){
        const room = Math.floor(o.maxHp*R.cap/100) - (o.healed||0);       // één vijand kan in totaal maar een deel van zijn levenspunten terugkrijgen
        const amt = Math.min(room, Math.max(1, Math.floor(o.maxHp*R.heal/100)), o.maxHp-o.hp);
        if(amt>0){ o.hp += amt; o.healed = (o.healed||0)+amt; sim.stat.heal += amt; sim.events.push({ k:"heal", m:m.id, e:o.id }); did = true; } } } });
    if(did) m.hc = R.every;
  });
}
function castraPStep(sim){
  if(sim.over) return;
  sim.tick++; sim.events.length = 0;
  while(sim.cmdQ.length && sim.cmdQ[0].at <= sim.tick){
    const c = sim.cmdQ.shift();
    if(sim.cmdOn && sim.energy>=1 && (c.id==="impete" || c.id==="state")){
      sim.energy--; sim.cmd[c.id] = sim.tick + (c.id==="impete" ? CASTRA_P_CMD.impeteTicks : CASTRA_P_CMD.stateTicks);
      sim.cmdLog.push({ at:sim.tick, id:c.id }); sim.events.push({ k:"cmd", id:c.id });
    }
  }
  { const aw = sim.mission.autoWaves; if(aw && sim.wave+1 < sim.mission.waves.length && sim.tick >= aw.first + (sim.wave+1)*aw.interval) castraPAutoWave(sim); }
  // spawns
  while(sim.queue.length && sim.queue[0].at <= sim.tick){
    const q = sim.queue.shift(), R = q.role ? CASTRA_P_ROLES[q.role] : null;
    const st = castraPEnemyStats(q.line, q.lvl, sim.rng, sim.mission.hpMult*CASTRA_P.enemyHpMult*(q.hp||1)*(R?R.hp:1));
    const lane = sim.paths.length>1 ? sim.spawnN % sim.paths.length : 0; sim.spawnN++;
    sim.enemies.push({ id:sim.nextId++, line:q.line, type:castraLine(q.line).type, lvl:q.lvl, st, hp:st.vita, maxHp:st.vita,
      prog:0, speed: Math.round((CASTRA_P.speedBase + st.celeritas*CASTRA_P.speedPerCel) * ((sim.mods&&sim.mods.spd)||1) * (R?R.spd:1)), x:0, y:0,
      lane, role:q.role||null, red:R?R.red:0, prot:0, hc:0 });
    if(R){ sim.hasRoles = true; sim.events.push({ k:"newrole", role:q.role }); }
  }
  // bewegen
  sim.enemies.forEach(e=>{ let sp = (e.slowUntil>sim.tick ? Math.round(e.speed*(100-e.slowPct)/100) : e.speed); if(sim.cmd.state>sim.tick) sp = Math.round(sp*CASTRA_P_CMD.stateSpd/100); e.prog += sp; const p = castraPPos(sim.paths[e.lane||0], e.prog); e.x = p[0]; e.y = p[1]; });
  if(sim.hasRoles) castraPRoles(sim);
  // support-buff (sup-type verhoogt de schade van torens in de buurt)
  sim.towers.forEach(t=>{ t.buffed = false; });
  sim.towers.filter(t=>t.type==="sup").forEach(b=>{
    sim.towers.forEach(t=>{ if(t!==b){ const dx=t.cx-b.cx, dy=t.cy-b.cy; if(dx*dx+dy*dy <= CASTRA_P.buffRadius*CASTRA_P.buffRadius) t.buffed = true; } });
  });
  // auras (vaardigheden): torens in de buurt van een aura-toren krijgen extra schade; "global" geldt voor iedereen
  let gsum = 0;
  sim.towers.forEach(t=>{ t.aura = 0; if(t.sk) gsum += t.sk.global; });
  sim.towers.forEach(b=>{
    if(!b.sk || !b.sk.auraDmg) return; const r2 = b.sk.auraRadius*b.sk.auraRadius;
    sim.towers.forEach(t=>{ if(t!==b){ const dx=t.cx-b.cx, dy=t.cy-b.cy; if(dx*dx+dy*dy <= r2) t.aura += b.sk.auraDmg; } });
  });
  // synergieën (vaste regels op basis van type en plek)
  sim.towers.forEach(t=>{ t.synMuri = false; t.synAcies = false; });
  sim.towers.forEach(a=>{
    if(a.type==="inf") sim.towers.some(b=>{ if(b.type==="rng"){ const dx=a.cx-b.cx, dy=a.cy-b.cy; if(dx*dx+dy*dy <= CASTRA_P_SYN.muriR*CASTRA_P_SYN.muriR){ a.synMuri = true; return true; } } return false; });
    else if(a.type==="rng") sim.towers.some(b=>{ if(b.type==="sup"){ const dx=a.cx-b.cx, dy=a.cy-b.cy; if(dx*dx+dy*dy <= CASTRA_P.buffRadius*CASTRA_P.buffRadius){ a.synAcies = true; return true; } } return false; });
  });
  // aanvallen: kies de vijand die het verst op het pad is binnen bereik
  const mods = sim.mods || null, rr = mods && mods.rng ? Math.round(1000*mods.rng)/1000 : 1;
  const hitOne = (t, e, mult)=>{
    const m = castraPTypeMul(t.type, e.type), sk = t.sk;
    let dmg = Math.floor(t.st.impetus*m[0]/m[1]) - Math.floor(e.st.tutela*2/5*(100-sk.pierce)/100);
    dmg = Math.max(1, dmg);
    if(t.buffed) dmg = Math.max(1, Math.floor(dmg*(100+CASTRA_P.buffPct)/100));
    const pct = sk.dmg + t.aura + gsum + (mods && mods.type ? (mods.type[t.type]||0) : 0); if(pct) dmg = Math.max(1, Math.floor(dmg*(100+pct)/100));
    if(mods && mods.dmg) dmg = Math.max(1, Math.floor(dmg*mods.dmg));
    if(t.type==="cav" && e.hp*CASTRA_P_SYN.persD < e.maxHp){ const b0 = dmg; dmg = Math.max(1, Math.floor(dmg*CASTRA_P_SYN.persN/CASTRA_P_SYN.persD)); sim.stat.pers += dmg-b0; }   // Persecutio
    if(sim.cmd.impete>sim.tick){ const b1 = dmg; dmg = Math.max(1, Math.floor(dmg*CASTRA_P_CMD.impeteDmg/100)); sim.stat.imp += dmg-b1; }                                          // Impete!
    return Math.max(1, Math.floor(dmg*(mult||1)));
  };
  sim.towers.forEach(t=>{
    if(t.cd>0){ t.cd--; return; }
    let best = null, second = null;
    const trr = t.synAcies ? t.range*rr*CASTRA_P_SYN.aciesPct/100 : t.range*rr, rng2 = trr*trr;
    let bestR = 0, secondR = 0;
    sim.enemies.forEach(e=>{
      const dx=e.x-t.cx, dy=e.y-t.cy;
      if(dx*dx+dy*dy <= rng2){
        const rk = e.prog + (t.type==="rng" && e.role ? (CASTRA_P_ROLES[e.role].prio||0)*1000000 : 0);   // boogschutters mikken eerst op genezers en schilddragers
        if(!best || rk > bestR){ second = best; secondR = bestR; best = e; bestR = rk; } else if(!second || rk > secondR){ second = e; secondR = rk; }
      }
    });
    if(!best) return;
    const sk = t.sk; t.hits++;
    let mult = 1;
    if(sk.nth && t.hits % sk.nth.n === 0) mult *= sk.nth.mult;
    if(t.charge > 0){ mult *= sk.charge.mult; t.charge--; }
    const dmg = hitOne(t, best, mult);
    castraPApply(sim, t, best, dmg); t.cd = mods && mods.cd ? Math.max(CASTRA_P.cdMin, Math.round(t.cooldown*mods.cd)) : t.cooldown;
    if(sim.cmd.impete>sim.tick) t.cd = Math.max(CASTRA_P.cdMin, Math.round(t.cd*CASTRA_P_CMD.impeteCd/100));
    if(t.synMuri){ sim.stat.muri++; best.slowPct = Math.max(best.slowPct||0, CASTRA_P_SYN.muriSlow); best.slowUntil = Math.max(best.slowUntil||0, sim.tick + CASTRA_P_SYN.muriTicks); }   // Murus et sagittae
    sim.events.push({ k:"hit", t:t.id, e:best.id, dmg });
    if(sk.slow && t.hits % sk.slow.every === 0){ best.slowPct = Math.max(best.slowPct||0, sk.slow.pct); best.slowUntil = sim.tick + sk.slow.ticks; }
    if(sk.doubleEvery && second && t.hits % sk.doubleEvery === 0){ const d2 = hitOne(t, second, mult); castraPApply(sim, t, second, d2); sim.events.push({ k:"hit", t:t.id, e:second.id, dmg:d2 }); }
    if(sk.splash){
      const r2 = sk.splash.radius*sk.splash.radius;
      sim.enemies.forEach(o=>{ if(o!==best && o.hp>0){ const dx=o.x-best.x, dy=o.y-best.y; if(dx*dx+dy*dy <= r2){ const sd = Math.max(1, Math.floor(dmg*sk.splash.pct/100)); castraPApply(sim, t, o, sd); } } });
    }
  });
  // doden en doorbraken
  const alive = [];
  sim.enemies.forEach(e=>{
    if(e.hp<=0){ sim.kills++; sim.events.push({ k:"kill", e:e.id }); if(sim.cmdOn && sim.kills % CASTRA_P_CMD.perKills === 0) sim.energy = Math.min(CASTRA_P_CMD.energyMax, sim.energy+1); }
    else if(e.prog >= sim.paths[e.lane||0].len-1){ sim.baseHp -= (e.type==="myth"?2:1) + (e.role ? CASTRA_P_ROLES[e.role].leak : 0); sim.leaked++; sim.stat.leaks.push({ role:e.role||null, type:e.type, wave:sim.wave }); sim.events.push({ k:"leak", e:e.id }); }
    else alive.push(e);
  });
  sim.enemies = alive;
  if(sim.baseHp<=0){ sim.baseHp = 0; sim.over = "lose"; return; }
  if(sim.waveActive && !sim.queue.length && !sim.enemies.length){
    sim.waveActive = false;
    if(sim.cmdOn) sim.energy = Math.min(CASTRA_P_CMD.energyMax, sim.energy + CASTRA_P_CMD.perWave);
    let rg = 0; sim.towers.forEach(t=>{ if(t.sk) rg += t.sk.regen; });
    if(rg && sim.baseHp < CASTRA_P.baseHp) sim.baseHp = Math.min(CASTRA_P.baseHp, sim.baseHp + rg);
    if(sim.wave >= sim.mission.waves.length-1) sim.over = "win";
  }
}
// Voor tests: laat de hele missie lopen met vaste torenplaatsing.
function castraPRunHeadless(mission, towers, maxTicks=20000){
  const sim = castraPSim(mission, towers);
  while(!sim.over && sim.tick<maxTicks){ if(!sim.waveActive) castraPStartWave(sim); castraPStep(sim); }
  return sim;
}
