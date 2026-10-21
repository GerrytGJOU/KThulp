/* ============================================================================
   CASTRA HEROUM — COLOSSEUM, STAP C1: EINDELOZE MODUS (SOLO)
   ----------------------------------------------------------------------------
   Ontwerp: CASTRA_COLOSSEUM.md. Eigen baan, golven die vanzelf komen en steeds
   sterker worden (tijdschema vast, dus deterministisch en later naspeelbaar), tot
   je kamp valt. Uitslag = bereikte golf, daarna meeste kills.
   Eerlijkheid: je speelt in een DIVISIE met levelplafond (20 / 35 / 50: alle
   soldaten en helden tellen mee op maximaal dat level), vast aantal torens,
   geen kaartbonussen, geen gunsten; artes mogen wel.

   STATUS: het Colosseum is nog GESLOTEN voor spelers (in Roma staat een bordje
   "nog in aanbouw"). Testtoegang: open de app met ?dev in de URL (of zet
   localStorage castra_dev = 1); dan staat bovenaan de campagnelijst (Proelium)
   een testkaart.
   Laadt NA castra-battle.js en castra-interiors.js.
   ============================================================================ */

const CASTRA_COLO = {
  cap:{ 20:8, 35:10, 50:12 },              // aantal torens per divisie
  first:200, interval:600,                  // eerste golf na 10 s, daarna elke 30 s (ticks van 50 ms)
  nWaves:150, growth:1.08,                  // vijanden-hp groeit 8% per golf
  hpA:{ 20:2.755, 35:3.241, 50:2.442 },    // basis-hp per divisie (gekalibreerd met tools/castra-colo-calibrate.js)
  // PvP (duel/vierkamp): alle spelers spelen dezelfde golven (zaad + divisie), elk op een eigen baan; uitslag door naspelen.
  pvpWaves:60,                              // een run duurt hoogstens 60 golven (35.600 ticks); daarna "gewonnen"
  maxTick:40000,                            // bovengrens voor een ingestuurde run (ticks)
  fee:100, res:"aes",                       // inzet per speler (brons)
  need:{ duel:2, quad:4 },
  pay:{ duel:[200,0], quad:[250,100,50,0] }, // uitbetaling per eindplaats (som = aantal spelers x inzet)
  countdownMs:10000, lateMs:60000,          // aftelling vanaf de start; zolang mag je nog instappen
  windowMs:2200000,                         // uiterste inleverdatum: startAt + dit (maxTick x 50 ms + instaptijd + speling)
  bonusPerDay:5,                            // roem, kaarttrekking en XP voor Colosseum-wedstrijden: hoogstens 5 wedstrijden per dag (tegen farmen)
  lobbyTtl:600000,                          // een lobby die na 10 min niet vol is, wordt geannuleerd (inzetten terug)
};
if(typeof location!=="undefined" && /[?&]dev(=|&|$)/.test(location.search)){ try{ localStorage.setItem("castra_dev","1"); }catch(e){} }
function castraColoAllowed(){ try{ return !!(localStorage.getItem("castra_dev")==="1" || (CASTRA && CASTRA.dev)); }catch(e){ return false; } }

/* ---------- golfgenerator (deterministisch uit zaad) ---------- */
function castraColoWaves(seed, div){
  const rng = castraRng((seed ^ 0x9e3779b1)>>>0), waves = [], hpA = CASTRA_COLO.hpA[div] || 0.5;
  const folks = ["rom","gra","gla","gal","ger","aeg","per","car","spa","tro","ama"];
  const bossPool = ["Draco","Cyclops faber","Centaurus sagittarius","Gryps","Equus alatus","Lupus Martius","Spartus","Aquila Iovis","Lemur","Larva","Silenus","Naias"];
  const baseL = Math.round(div*0.45);
  for(let n=0;n<CASTRA_COLO.nWaves;n++){
    const lvl = Math.min(50, Math.round(baseL + 0.9*n)), tierCap = n<5 ? 2 : n<14 ? 3 : 4;
    const hp = hpA*Math.pow(CASTRA_COLO.growth, n), total = Math.min(26, 4 + Math.floor(n/2.5)), groups = 1 + (n>=4?1:0) + (n>=12?1:0);
    const gap = Math.max(8, 22 - Math.floor(n/3)), w = []; let left = total;
    for(let gi=0; gi<groups; gi++){
      const cnt = gi===groups-1 ? left : Math.max(1, Math.floor(total/groups)); left -= cnt;
      const folk = folks[Math.floor(rng()*folks.length)];
      let pool = CASTRA_FORM_LIST.filter(f=>f.volk===folk && f.type!=="rec" && f.tier<=tierCap);
      if(!pool.length) pool = CASTRA_FORM_LIST.filter(f=>f.volk===folk && f.tier<=tierCap);
      const top = Math.max(...pool.map(f=>f.tier)), tierPick = rng()<0.6 ? top : 1+Math.floor(rng()*top);
      let cand = pool.filter(f=>f.tier===tierPick); if(!cand.length) cand = pool.filter(f=>f.tier===top);
      const f = cand[Math.floor(rng()*cand.length)];
      w.push({ line:f.id, n:cnt, gap, lvl, hp });
    }
    if((n+1)%5===0){ const bf = castraFormByName("myt", bossPool[Math.floor(rng()*bossPool.length)]); if(bf) w.push({ line:bf.id, n:1, gap:gap*2, lvl:Math.min(50,lvl+4), hp:hp*7 }); }
    waves.push(w);
  }
  return waves;
}
function castraColoMission(div, seed){
  return { id:"colo_"+div, region:"roma", nm:"Colosseum", nl:"Eindeloze modus (divisie "+div+")", map:(seed&1)?"a":"b", seed, hpMult:1,
    waves:castraColoWaves(seed, div), autoWaves:{ first:CASTRA_COLO.first, interval:CASTRA_COLO.interval }, endless:true };
}
// PvP: dezelfde golven voor iedereen, afgekapt op pvpWaves (wie ze allemaal overleeft, wint de run).
function castraColoPvpMission(div, seed){
  const m = castraColoMission(div, seed); m.waves = m.waves.slice(0, CASTRA_COLO.pvpWaves); m.id = "colo_pvp"; m.nl = "Colosseum (divisie "+div+")"; m.pvp = true;
  return m;
}
// Eigen eenheden met levelplafond (de originelen blijven onaangeroerd; gewonde soldaten tellen hier gewoon mee).
function castraColoUnits(div){
  const list = [];
  (CASTRA.heroes||[]).forEach(h=>list.push(castraHeroAsUnit({ ...h, lvl:Math.min(h.lvl, div) })));
  (CASTRA.soldiers||[]).forEach(s=>list.push({ ...s, lvl:Math.min(s.lvl, div), hurtUntil:0 }));
  return list.length ? list : [ { id:"dux", dux:true, line:"rom_hastatus", lvl:1, name:"Dux" } ];
}
// Voor kalibratie en later naspelen: laat een run lopen met een vaste plaatsing.
function castraColoSimulate(mission, towers, maxTicks){
  const sim = castraPSim(mission, towers); sim.mods = { dmg:1, cd:1, rng:1, spd:1 };
  while(!sim.over && sim.tick < (maxTicks||90000)) castraPStep(sim);
  return { wave:sim.wave+1, kills:sim.kills, tick:sim.tick, over:sim.over };
}

/* ---------- eenheid-momentopname: wat er in een ingestuurde run staat en hoe de toren daaruit gebouwd wordt ----------
   Een geplaatste soldaat of held wordt vastgelegd als {l:vorm, v:level, i:[aanleg x5], g:karakter, s:[artes]} (held: {h,v,s}; dux: {d:1}).
   De stats worden bij het plaatsen (live) en bij het naspelen uit DEZELFDE formules berekend, met de limieten van de
   divisie: een valsspeler kan dus geen hogere waarden insturen dan de formule bij dat level toestaat. */
function castraColoSnapUnit(unit){
  if(unit.dux) return { d:1 };
  const clamp = (v,lo,hi)=>Math.max(lo, Math.min(hi, v|0));
  if(unit.hero) return { h:unit.h.id, v:Math.max(1, unit.h.lvl|0), s:castraSkillIds(unit).slice() };
  return { l:unit.line, v:Math.max(1, unit.lvl|0), i:CASTRA_STATS.map(st=>clamp((unit.indoles||{})[st.id], 0, CASTRA_INDOLES_MAX)), g:unit.ingenium||"", s:castraSkillIds(unit).slice() };
}
function castraColoSkillsOk(holder, ids){
  if(!Array.isArray(ids) || ids.length>CASTRA_SKILL_MAX) return false;
  const known = castraSkillKnown(holder).map(k=>k.id);
  return ids.every((id,k)=>typeof id==="string" && known.includes(id) && ids.indexOf(id)===k);
}
// Bouwt de toren uit een momentopname; null als de waarden niet kloppen (level boven het plafond, onbekende vorm, niet-geleerde arte, ...).
function castraColoMakeTower(sim, sid, u, x, y, div){
  if(!u || typeof u!=="object") return null;
  let st, type, look = null, sk = [], line = null;
  if(u.d){ line = "rom_hastatus"; st = { ...CASTRA_V_BAL.dux }; type = castraLine(line).type; }
  else if(u.h){
    const hd = (typeof u.h==="string") ? CASTRA_HERO_DATA[u.h] : null;
    if(!hd || !Number.isInteger(u.v) || u.v<1 || u.v>Math.min(div, CASTRA_H.maxLvl)) return null;
    const hh = { id:u.h, lvl:u.v };
    if(!castraColoSkillsOk({ hero:true, h:hh }, u.s||[])) return null;
    st = castraHeroStats(hh); type = hd.type; look = hd.look; sk = u.s||[];
  } else {
    if(typeof u.l!=="string" || !CASTRA_FORMS[u.l] || !Number.isInteger(u.v) || u.v<1 || u.v>div) return null;
    if(!Array.isArray(u.i) || u.i.length!==CASTRA_STATS.length || !u.i.every(v=>Number.isInteger(v) && v>=0 && v<=CASTRA_INDOLES_MAX)) return null;
    if(typeof u.g!=="string" || (u.g && !CASTRA_INGENIA.some(g=>g.id===u.g))) return null;
    if(!castraColoSkillsOk({ line:u.l, lvl:u.v }, u.s||[])) return null;
    const indoles = {}; CASTRA_STATS.forEach((s,k)=>{ indoles[s.id] = u.i[k]; });
    st = castraStats({ line:u.l, lvl:u.v, indoles, ingenium:u.g }); type = castraLine(u.l).type; sk = u.s||[]; line = u.l;
  }
  return castraPMakeTower(sim, { id:sid, line, snap:{ st, type, look, sk } }, x, y);
}
// Plaatst een eigen eenheid in een live run en legt de actie vast (zelfde code als bij het naspelen).
function castraColoPlace(B, unit, x, y){
  const sid = String(unit.id).slice(0,30), u = castraColoSnapUnit(unit);
  const tw = castraColoMakeTower(B.sim, sid, u, x, y, B.div) || castraPMakeTower(B.sim, unit, x, y);
  if(B.actions) B.actions.push({ t:B.sim.tick, k:"place", sid, x, y, u });
  return tw;
}

/* ---------- naspelen en controleren ---------- */
// Past één actie toe op een naspeel-simulatie; geeft null bij succes, anders de reden waarom de run ongeldig is.
function castraColoApply(sim, a, div, cells, trees){
  if(!a || typeof a!=="object") return "actie";
  if(a.k==="take"){
    const tw = sim.towers.find(t=>t.sid===a.sid); if(!tw) return "terugnemen";
    sim.towers = sim.towers.filter(t=>t!==tw); return null;
  }
  if(a.k!=="place") return "soort";
  const x = a.x, y = a.y, key = x+","+y;
  if(!Number.isInteger(x) || !Number.isInteger(y) || x<0 || y<0 || x>=CASTRA_P.cols || y>=CASTRA_P.rows) return "tegel";
  if(cells[key] || trees[key] || sim.towers.some(t=>t.x===x && t.y===y)) return "bezet";
  if(sim.towers.length >= CASTRA_COLO.cap[div]) return "teveel torens";
  if(typeof a.sid!=="string" || !a.sid || a.sid.length>30 || sim.towers.some(t=>t.sid===a.sid)) return "sid";
  const tw = castraColoMakeTower(sim, a.sid, a.u, x, y, div); if(!tw) return "eenheid boven het plafond";
  sim.towers.push(tw); return null;
}
// Kern van het naspelen: laat de acties lopen tot tick `end` (of het einde van de run). onTick(sim) wordt na elke tick aangeroepen (tijdlijn van een AI).
function castraColoPlay(div, seed, acts, end, onTick){
  const m = castraColoPvpMission(div, seed), sim = castraPSim(m, []); sim.mods = { dmg:1, cd:1, rng:1, spd:1 };
  const cells = castraPPathCells(m.map), trees = {}; CASTRA_P_MAPS[m.map].trees.forEach(t=>{ trees[t[0]+","+t[1]] = 1; });
  let ai = 0;
  while(sim.tick < end && !sim.over){
    while(ai < acts.length && acts[ai].t <= sim.tick){ const why = castraColoApply(sim, acts[ai], div, cells, trees); if(why) return { why }; ai++; }
    castraPStep(sim); if(onTick) onTick(sim);
  }
  return { res:{ tick:sim.tick, wave:sim.wave+1, lives:sim.baseHp, kills:sim.kills, win:sim.over==="win", quit:!sim.over }, sim };
}
// Speelt een ingestuurde run opnieuw af. match = {divisie, seed}; run = {actions:<json>, res:{tick,wave,lives,kills,win,quit}}.
// Geeft {ok:true, res} met de UITKOMST VAN HET NASPELEN (die telt, niet de bewering van de speler), of {ok:false, why}.
function castraColoReplay(match, run){
  const div = match && match.divisie|0; if(!CASTRA_COLO.cap[div]) return { ok:false, why:"divisie" };
  if(!run || typeof run.actions!=="string" || run.actions.length>30000 || !run.res) return { ok:false, why:"geen run" };
  let acts; try{ acts = JSON.parse(run.actions); }catch(e){ return { ok:false, why:"onleesbaar" }; }
  if(!Array.isArray(acts) || acts.length>500) return { ok:false, why:"acties" };
  let last = 0; for(const a of acts){ if(!a || !Number.isInteger(a.t) || a.t<last) return { ok:false, why:"volgorde" }; last = a.t; }
  const claim = run.res, end = claim.tick;
  if(!Number.isInteger(end) || end<0 || end>CASTRA_COLO.maxTick) return { ok:false, why:"tick" };
  const pl = castraColoPlay(div, match.seed, acts, end, null); if(pl.why) return { ok:false, why:pl.why };
  const res = pl.res;
  if(res.tick!==end || res.quit!==!!claim.quit || res.win!==!!claim.win || res.wave!==claim.wave || res.lives!==claim.lives || res.kills!==claim.kills) return { ok:false, why:"uitkomst klopt niet", res };
  return { ok:true, res };
}
// Volgorde: gewonnen > anders de overleefde tick > meeste kills > eerder ingeleverd. Ongeldige of ontbrekende runs staan onderaan.
function castraColoCmp(a, b){
  if(a.ok!==b.ok) return a.ok ? -1 : 1;
  if(a.ok){
    if(a.res.win!==b.res.win) return a.res.win ? -1 : 1;
    if(a.res.win && a.res.lives!==b.res.lives) return b.res.lives-a.res.lives;
    if(!a.res.win && a.res.tick!==b.res.tick) return b.res.tick-a.res.tick;
    if(a.res.kills!==b.res.kills) return b.res.kills-a.res.kills;
    if((a.ts||0)!==(b.ts||0)) return (a.ts||0)-(b.ts||0);
  }
  return a.lid<b.lid ? -1 : a.lid>b.lid ? 1 : 0;
}
/* ---------- AI-tegenstander (ghost) ----------
   Een vierkamp met 3 spelers mag een AI als vierde meedoen (match.ghosts = 1; 2 AI's bij 2 spelers kan in de regels, niet in het scherm).
   De AI speelt NIET live: haar run wordt uit (divisie, zaad, nummer) gegenereerd en elke client rekent hem identiek uit: het
   referentieteam van de kalibratie (tier naar divisie, aanleg uit het zaad, eerste vier artes, greedy plaatsing), AI 1 met
   cap-1 torens, AI 2 met cap-3. De AI krijgt geen inzet en geen uitbetaling, maar neemt een plek in de rangorde in. */
const CASTRA_COLO_GHOST = {
  forms:{ 2:{ inf:"rom_hastatus", rng:"rom_veles", cav:"rom_eques", sup:"rom_faber" }, 3:{ inf:"rom_princeps", rng:"rom_funditor", cav:"rom_decurio", sup:"rom_signifer" }, 4:{ inf:"rom_triarius", rng:"rom_sagittarius", cav:"rom_praefectusalae", sup:"rom_aquilifer" } },
  pattern:["inf","rng","inf","rng","cav","sup","inf","rng","cav","inf","rng","sup"],
  names:["Legatus Brutus (AI)", "Centurio Cassius (AI)"], less:[1, 3],
};
const _castraColoGhostCache = {};
function castraColoGhost(match, k){
  const key = match.seed+"|"+match.divisie+"|"+k; if(_castraColoGhostCache[key]) return _castraColoGhostCache[key];
  const div = match.divisie|0, G = CASTRA_COLO_GHOST, m = castraColoPvpMission(div, match.seed);
  const rng = castraRng(((match.seed>>>0) ^ (0xA11CE + k*7919))>>>0), F = G.forms[div<16?2:div<32?3:4], n = CASTRA_COLO.cap[div] - G.less[k];
  const cells = castraPPathCells(m.map), trees = {}; CASTRA_P_MAPS[m.map].trees.forEach(t=>{ trees[t[0]+","+t[1]] = 1; });
  const free = []; for(let y=0;y<CASTRA_P.rows;y++) for(let x=0;x<CASTRA_P.cols;x++) if(!cells[x+","+y] && !trees[x+","+y]) free.push([x,y]);
  const pts = []; castraPPaths(m.map).forEach(p=>{ for(let d=0; d<p.len; d+=400) pts.push(castraPPos(p,d)); });
  const used = {}, hit = pts.map(()=>0), acts = [], dummy = castraPSim(m, []);
  for(let i=0;i<n;i++){
    const line = F[G.pattern[i%G.pattern.length]], ind = CASTRA_STATS.map(()=>Math.floor(rng()*(CASTRA_INDOLES_MAX+1))), g = CASTRA_INGENIA[Math.floor(rng()*CASTRA_INGENIA.length)].id;
    const u = { l:line, v:div, i:ind, g, s:castraSkillKnown({ line, lvl:div }).slice(0, CASTRA_SKILL_MAX).map(q=>q.id) };
    const t0 = castraColoMakeTower(dummy, "ai"+k+"_"+i, u, 0, 0, div), r2 = t0.range*t0.range; let best = null, bs = -1;
    free.forEach(([x,y])=>{ if(used[x+","+y]) return; const cx = x*1000+500, cy = y*1000+500; let sc = 0;
      pts.forEach((p,j)=>{ const dx = p[0]-cx, dy = p[1]-cy; if(dx*dx+dy*dy<=r2) sc += 1/(1+hit[j]*0.6); });
      if(sc>bs){ bs = sc; best = [x,y]; } });
    used[best[0]+","+best[1]] = 1; const cx = best[0]*1000+500, cy = best[1]*1000+500;
    pts.forEach((p,j)=>{ const dx = p[0]-cx, dy = p[1]-cy; if(dx*dx+dy*dy<=r2) hit[j]++; });
    acts.push({ t:0, k:"place", sid:"ai"+k+"_"+i, x:best[0], y:best[1], u });
  }
  const timeline = []; let lw = -2, ll = -1;
  const pl = castraColoPlay(div, match.seed, acts, CASTRA_COLO.maxTick, sim=>{ if(sim.wave!==lw || sim.baseHp!==ll){ lw = sim.wave; ll = sim.baseHp; timeline.push([sim.tick, sim.wave+1, sim.baseHp]); } });
  return _castraColoGhostCache[key] = { lid:"ai"+(k+1), nm:G.names[k], ghost:true, ok:true, why:"", res:pl.res, ts:9e15, timeline, acts };
}
// Wat een AI op dit moment van de wedstrijd laat zien (tick = tijd sinds de start): {wave, lives, done}.
function castraColoGhostAt(match, k, tick){
  const g = castraColoGhost(match, k); let cur = [0, 0, CASTRA_P.baseHp];
  for(const e of g.timeline){ if(e[0]<=tick) cur = e; else break; }
  return { wave:cur[1], lives:cur[2], done:tick>=g.res.tick, final:g.res };
}
/* Economie met een AI: er wordt NOOIT meer uitbetaald dan de echte spelers inzetten. De standaardtabel (pay) is voor een volle
   wedstrijd; met AI's wordt ze geschaald met (echte spelers / plekken) en op 5 afgerond: vierkamp 3 + AI = 300 i.p.v. 400 in de pot,
   dus 185 / 75 / 35 / 0. De plek van de AI betaalt niets uit. Zo kan niemand brons verdienen door tegen een AI te spelen. */
function castraColoPayTable(mode, ghosts){
  const t = CASTRA_COLO.pay[mode] || CASTRA_COLO.pay.duel, need = CASTRA_COLO.need[mode]||2, g = mode==="quad" ? Math.max(0, Math.min(2, ghosts|0)) : 0;
  if(!g) return t.slice();
  return t.map(v=>Math.floor(v*(need-g)/need/5)*5);
}
// Rangschikt alle deelnemers van een match uit hun runs (plus de AI's). Geeft rijen {lid, nm, ok, why, res, ts, rank, pay, ghost}.
// pay = uitbetaling aan echte spelers; zonder één geldige run van een echte speler is er geen winnaar en krijgt iedereen zijn inzet terug (refund:true).
function castraColoStandings(match, runs){
  const fee = match.fee||CASTRA_COLO.fee, need = CASTRA_COLO.need[match.mode]||2;
  const rows = Object.keys(match.players||{}).map(lid=>{
    const run = runs && runs[lid], v = run ? castraColoReplay(match, run) : { ok:false, why:"niet ingeleverd" };
    return { lid, nm:(match.players[lid]||{}).nm||lid, ok:!!v.ok, why:v.ok?"":v.why, res:v.res||null, ts:run?run.ts:0 };
  });
  const nGhost = match.mode==="quad" ? Math.max(0, Math.min(2, match.ghosts|0)) : 0;
  for(let k=0;k<nGhost;k++) rows.push({ ...castraColoGhost(match, k), timeline:null, acts:null });
  rows.sort(castraColoCmp);
  const anyOk = rows.some(r=>r.ok && !r.ghost), table = castraColoPayTable(match.mode, nGhost);
  rows.forEach((r,k)=>{ r.rank = k+1; r.pay = r.ghost ? 0 : !anyOk ? fee : (r.ok ? (table[k]||0) : 0); });
  return { rows, refund:!anyOk, fee, need, ghosts:nGhost };
}

/* ---------- start, hud, bediening ---------- */
function castraColoStart(div){
  if(!castraColoAllowed()) return;
  const seed = (Math.random()*4294967295)>>>0;
  castraColoBegin(div, seed, castraColoMission(div, seed), null);
}
// Start een eindeloze run (solo) of een PvP-run (pvp = { mid }): zelfde bediening, alleen de golven en het einde verschillen.
function castraColoBegin(div, seed, m, pvp){
  if(CASTRA_B){ clearInterval(CASTRA_B.timer); window.removeEventListener("resize", CASTRA_B.resizeFn); }
  const opts = (CASTRA.opts || (CASTRA.opts = {}));
  CASTRA_B = { mission:m, sim:castraPSim(m, []), sel:null, timer:null, speed:opts.speed||1, auto:false, units:{}, fx:[], placed:{}, lastDir:{}, finished:false,
               boons:[], pick:null, offeredFor:-2, rewardMult:1, autoT:0, ctlSig:"", endless:true, div, seed, actions:[], pvp };
  CASTRA_B.sim.mods = { dmg:1, cd:1, rng:1, spd:1 };
  const ids = {}; m.waves.slice(0,40).forEach(w=>w.forEach(g=>ids[g.line]=1)); (CASTRA.soldiers||[]).forEach(s=>ids[s.line]=1);
  castraFsprProbe(Object.keys(ids).map(i=>[i,"td"]), null);
  go("castraBattle");
}
const _castraBRenderHudColo0 = castraBRenderHud;
castraBRenderHud = function(){
  const B = CASTRA_B; if(!B || !B.endless) return _castraBRenderHudColo0();
  const h = el("cbHud"); if(!h) return; const s = B.sim, aw = B.mission.autoWaves;
  const nextIn = Math.max(0, Math.ceil((aw.first + (s.wave+1)*aw.interval - s.tick)*CASTRA_P.tickMs/1000));
  const best = ((CASTRA.colo||{}).best||{})[B.div];
  h.innerHTML = `<span>❤️ ${castraLaText("vita_castrorum")}: <b>${s.baseHp}</b> / ${CASTRA_P.baseHp}</span>
    <span>🌊 ${castraLaText("ala")}: <b>${Math.max(0,s.wave+1)}</b> <small>(volgende over ${nextIn} s)</small></span>
    <span>☠️ <b>${s.kills}</b></span>
    <span>${castraLaText("milites")}: <b>${s.towers.length}</b> / ${castraBCap()}</span>
    <span>🏆 divisie ${B.div}${best&&!B.pvp?" · record golf "+best.wave:""}</span>${B.pvp&&typeof castraColoPvpHud==="function"?castraColoPvpHud():""}`;
};
const _castraBRenderCtlColo0 = castraBRenderCtl;
castraBRenderCtl = function(){
  const B = CASTRA_B; if(!B || !B.endless) return _castraBRenderCtlColo0();
  const c = el("cbCtl"); if(!c) return; const sig = "E"+B.speed+(B.sim.over?"x":""); if(sig===B.ctlSig) return; B.ctlSig = sig;
  c.innerHTML = `<button class="btn" style="min-height:44px" onclick="castraBSpeed()">⏩ ${B.speed}× ${castraLaText("celerius")}</button>
    <div class="note" style="flex:1;min-width:200px">🏛️ Colosseum (divisie ${B.div}): de golven komen vanzelf en worden steeds sterker. Verplaats je soldaten gerust tijdens het gevecht. Houd je kamp zo lang mogelijk overeind.${B.pvp?" Dit is een duel: wie het langst overleeft, wint de pot. Met de schildknop linksboven geef je op.":""}</div>`;
};

// Duel: de simulatie volgt de klok. Een achtergrondtab (of een trage iPad) haalt achterstand per aanroep in (hoogstens 10 s),
// zodat niemand tijd wint of verliest door de timer; uitleg-pauzes tellen niet mee.
const _castraBTickColo0 = castraBTick;
castraBTick = function(){
  const B = CASTRA_B; if(!B || !B.pvp || B.finished) return _castraBTickColo0();
  const now = Date.now(), last = B.wall || now; B.wall = now;
  if(B.paused) return _castraBTickColo0();
  const sp = B.speed, n = Math.max(1, Math.min(200, Math.round((now-last)/CASTRA_P.tickMs)));
  B.speed = n*sp; try{ _castraBTickColo0(); } finally{ B.speed = sp; }
};

/* ---------- einde van een run ---------- */
function castraColoFinish(){
  if(CASTRA_B.pvp){ castraColoPvpEnd(false); return; }
  const B = CASTRA_B, s = B.sim, box = el("cbResult"); clearInterval(B.timer);
  const colo = CASTRA.colo || (CASTRA.colo = { best:{}, runs:0 }), div = B.div, wave = s.wave+1, kills = s.kills;
  const prev = colo.best[div] || { wave:0, kills:0 }, rec = wave>prev.wave || (wave===prev.wave && kills>prev.kills);
  colo.runs++;
  let gloria = 0;
  if(rec){ gloria = Math.max(1, Math.floor((wave-prev.wave)/2)); colo.best[div] = { wave, kills, ticks:s.tick, seed:B.seed }; CASTRA.res.gloria = (CASTRA.res.gloria||0)+gloria; }
  // ervaring voor de soldaten en helden die meededen
  const lines = [], xp = Math.min(60, 2*wave);
  s.towers.forEach(t=>{
    if(String(t.sid).indexOf("hero_")===0){ const hh = castraHero(String(t.sid).slice(5)); if(hh){ hh.xp += xp; if(castraHeroLevelUp(hh)) lines.push(CASTRA_HERO_DATA[hh.id].nm); } return; }
    const sol = CASTRA.soldiers.find(x=>x.id===t.sid); if(!sol) return; sol.xp += xp; if(castraLevelUp(sol)) lines.push(castraSoldierName(sol));
  });
  castraSave(); if(typeof castraPxpAdd==="function") castraPxpAdd(Math.min(30, wave));
  box.innerHTML = `<div class="panel"><div style="font-size:22px;margin-bottom:6px">🏛️ Colosseum — divisie ${div}</div>
    <div style="font-size:18px">Bereikt: golf <b>${wave}</b> · ☠️ ${kills} vijanden verslagen</div>
    <div class="note" style="margin-top:6px">${rec?`🏆 Nieuw record! ${gloria?"+"+gloria+" roem":""}`:`Je record: golf ${prev.wave} (${prev.kills} verslagen)`}</div>
    ${lines.length?`<div class="note">⭐ ${esc(lines.join(", "))} → ${castraLaText("gradus")}</div>`:""}
    <div style="display:flex;gap:10px;margin-top:14px;flex-wrap:wrap"><button class="btn btn-gold" style="min-height:44px" onclick="castraColoStart(${div})">Nog een run</button>
      <button class="btn" style="min-height:44px" onclick="castraBExit()">${castraLaText("perge")}</button></div></div>`;
  box.scrollIntoView({ behavior:"smooth", block:"nearest" });
  el("cbCtl").innerHTML = "";
}

// Opgeven en verlaten: in een duel telt je run tot nu toe (de inzet is al betaald); daarna terug naar de lobby.
const _castraBExitColo0 = castraBExit;
castraBExit = function(){
  const B = CASTRA_B;
  if(B && B.pvp){
    if(!B.finished){ if(!confirm("Opgeven? Je inzet is al betaald; je run telt tot nu toe.")) return; castraColoPvpEnd(true); return; }
    clearInterval(B.timer); window.removeEventListener("resize", B.resizeFn); CASTRA_B = null; go("castraColoLobby"); return;
  }
  return _castraBExitColo0();
};

/* ---------- ingang (alleen testtoegang) ---------- */
function castraColoCard(){
  if(!castraColoAllowed()) return "";
  if(typeof castraCReconcile==="function") castraCReconcile();
  const best = (CASTRA.colo||{}).best||{};
  return `<div class="panel" style="border:2px dashed #8a6d2f"><h3>🏛️ Colosseum <small>(testversie, nog gesloten voor spelers)</small></h3>
    <div class="note">Eindeloze modus: kies een divisie (levelplafond). Je records: ${[20,35,50].map(d=>"div "+d+": "+(best[d]?"golf "+best[d].wave:"—")).join(" · ")}</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:6px">${[20,35,50].map(d=>`<button class="btn btn-gold" style="min-height:44px" onclick="castraColoStart(${d})">Divisie ${d} (max ${CASTRA_COLO.cap[d]} torens)</button>`).join("")}</div>
    <div style="margin-top:10px"><button class="btn" style="min-height:44px" onclick="go('castraColoLobby')">⚔️ Duel of vierkamp tegen klasgenoten (inzet ${CASTRA_COLO.fee} 🪙)</button></div></div>`;
}

/* ---------- Roma: gesloten deur met bordje ---------- */
const CASTRA_COLO_DOOR = { fx:[["tent_white",12,29],["tent_white",15,29],["tent_white",18,29]], sign:{ x:16, y:32 } };
CASTRA_WENT.push({ id:"bord_colosseum", region:"roma", kind:"sign", x:CASTRA_COLO_DOOR.sign.x, y:CASTRA_COLO_DOOR.sign.y });
const _castraWobjPiecesColo0 = castraWobjPieces;
castraWobjPieces = function(rid){ const out = _castraWobjPiecesColo0(rid); if(rid==="roma") CASTRA_COLO_DOOR.fx.forEach(([o,x,y])=>out.push({ o, x, y })); return out; };
const _castraWobjSpotsColo0 = castraWobjSpots;
castraWobjSpots = function(rid){ const out = _castraWobjSpotsColo0(rid); if(rid==="roma"){ for(let y=29;y<=33;y++) for(let x=11;x<=21;x++) out.push([x,y]); } return out; };
const _castraNpcTalkColo0 = castraNpcTalk;
castraNpcTalk = function(id){
  if(String(id)==="w:bord_colosseum"){
    const panel = el("cwPanel"); if(!panel) return;
    panel.innerHTML = `<div class="panel"><h3 style="margin:0 0 6px">🚧 Colosseum</h3>
      <div style="font-size:20px;margin:6px 0">${castraLaHTML("Colosseum nondum aedificatum est.", "Het Colosseum is nog niet gebouwd.", "bord_colosseum")}</div>
      <div class="note">Hier wordt nog aan gebouwd: later kun je hier tegen andere spelers strijden om de inzet. Kom later terug!</div>
      <button class="btn" style="margin-top:6px;min-height:44px" onclick="castraNpcClose()">Sluiten</button></div>`;
    panel.scrollIntoView({ behavior:"smooth", block:"nearest" }); return;
  }
  return _castraNpcTalkColo0(id);
};
const _castraWobjDrawColo0 = castraWobjDraw;
castraWobjDraw = function(){
  _castraWobjDrawColo0();
  const box = el("cwWobj"); if(!box) return;
  castraWEnts().filter(e=>e.kind==="sign").forEach(e=>{
    box.insertAdjacentHTML("beforeend", `<div style="position:absolute;left:${e.x*48}px;top:${e.y*48}px;width:48px;height:48px;z-index:3;display:flex;align-items:center;justify-content:center;font-size:32px;pointer-events:none">🚧</div>`);
  });
  if(CASTRA_W_REGION==="roma") box.insertAdjacentHTML("beforeend", `<div style="position:absolute;left:${12*48-30}px;top:${29*48-22}px;width:${9*48+60}px;text-align:center;z-index:7;font-size:13px;font-weight:bold;color:#fff;text-shadow:0 1px 3px #000,0 0 6px #000;pointer-events:none">🏛️ Colosseum (nog in aanbouw)</div>`);
};
