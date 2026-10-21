/* ============================================================================
   CASTRA HEROUM — LEGIO (klassenevenement: coöperatieve tower defence)
   ----------------------------------------------------------------------------
   De docent start een evenement voor de klas (castraLegio/{klas}/event); de
   leerlingen melden zich in de principia ("Adsum!") en verdedigen samen één
   kaart. GEEN eigen server: alleen de AANGEZETTE ACTIES gaan via Firebase
   (castraLegio/{klas}/actions), de wereld wordt door elke browser zelf berekend.

   Hoe het synchroon blijft (deterministic lockstep, zie CASTRA_HEROUM.md):
   - Elke client draait dezelfde simulatie (castra-proelium.js: vaste tick van
     50 ms, gehele getallen, seeded RNG) uit event.mission + event.seed.
   - Klok: tick = (servertijd − event.startAt) / 50 ms (servertijd via
     .info/serverTimeOffset), dus iedereen zit op dezelfde tick.
   - Een actie ("plaats soldaat X op tegel x,y") krijgt tick = nu + 12 en wordt
     door iedereen op die tick toegepast, gesorteerd op (tick, Firebase-sleutel).
   - Komt een actie te laat binnen (tick al gepasseerd), dan rekent de client
     de hele simulatie opnieuw uit de volledige actielijst: de simulatie is een
     pure functie van (missie, seed, acties), dus alle clients komen op hetzelfde uit.
   - Golven starten automatisch (voorbereiding 60 s, daarna 10 s tussen golven).
   Deelnemers: max perPlayer soldaten per leerling. Beloning: lokaal, eenmalig.
   Laadt NA castra-battle.js, castra-proelium.js en castra-heroes.js.
   ============================================================================ */

const CASTRA_LEGIO = { prepTicks:1200, gapTicks:200, lead:12, perPlayer:2, joinTicks:0, hpExp:1.2 };   // hpExp: hoe sterk de vijanden meegroeien met het aantal deelnemers (1 = lineair vanaf 12)
const CASTRA_LEGIO_MISSIONS = {
  legio1: { nm:"Obsidio Troiae", nl:"Het beleg van Troje", map:"a", hpMult:7.6,
    waves:[ [ {line:_fid("gra","Epilectus"),n:4,gap:14,lvl:26} ],
            [ {line:_fid("gra","Prodromus"),n:3,gap:14,lvl:26}, {line:_fid("gra","Peltasta"),n:3,gap:14,lvl:26} ],
            [ {line:_fid("gra","Toxota"),n:4,gap:12,lvl:26}, {line:_fid("gra","Epilectus"),n:3,gap:14,lvl:26} ],
            [ {line:_fid("gra","Prodromus"),n:4,gap:12,lvl:28}, {line:_fid("myt","Silenus"),n:2,gap:16,lvl:28} ],
            [ {line:_fid("gra","Epilectus"),n:5,gap:12,lvl:28}, {line:_fid("gra","Peltasta"),n:3,gap:12,lvl:28} ],
            [ {line:_fid("myt","Gryps"),n:2,gap:20,lvl:28}, {line:_fid("gra","Prodromus"),n:5,gap:10,lvl:28}, {line:_fid("gra","Lochagus"),n:4,gap:12,lvl:28} ] ],
    reward:{ aes:200, frumentum:120, gloria:15 },
    vLa:"Victoria! Troiam defendistis!", vNl:"Overwinning! Jullie hebben Troje verdedigd!", cLa:"Troia capta est.", cNl:"Troje is ingenomen." },
  // Evenementen op basis van een bestaande missie (golven, vijandrollen, missieregels en kaart worden overgenomen)
  legio2: { nm:"Obsidio Alesiae", nl:"Het beleg van Alesia (nacht, snelle en zware vijanden)", from:"ga2", hpMult:9.83,
    reward:{ aes:260, frumentum:150, gloria:20 }, vLa:"Victoria! Alesiam defendistis!", vNl:"Overwinning! Jullie hebben Alesia verdedigd!", cLa:"Alesia capta est.", cNl:"Alesia is ingenomen." },
  legio3: { nm:"Ad Rhenum", nl:"Aan de Rijn (regen, schilddragers)", from:"gm2", hpMult:4.39,
    reward:{ aes:300, frumentum:170, gloria:22 }, vLa:"Victoria! Rhenum defendistis!", vNl:"Overwinning! Jullie hebben de Rijn verdedigd!", cLa:"Rhenus captus est.", cNl:"De Rijn is gevallen." },
  legio4: { nm:"Persepolis", nl:"Het beleg van Persepolis (genezers, kou en wind)", from:"pe2", hpMult:2.95,
    reward:{ aes:340, frumentum:190, gloria:25 }, vLa:"Victoria! Persepolim defendistis!", vNl:"Overwinning! Jullie hebben Persepolis verdedigd!", cLa:"Persepolis capta est.", cNl:"Persepolis is ingenomen." },
};

let CASTRA_L = null;   // { klas, ev, players, actions, sorted, dirty, sim, offset, refs }

/* ---------- missie en acties ---------- */
function castraLegioMissionFor(ev){
  const base = CASTRA_LEGIO_MISSIONS[ev.mission] || CASTRA_LEGIO_MISSIONS.legio1, pl = Math.max(2, ev.players||4), k = Math.max(1, Math.round(pl/3));
  const src = base.from ? CASTRA_P_MISSIONS.find(x=>x.id===base.from) : null;
  const waves = (src ? src.waves : base.waves).map(w=>w.map(g=>({ ...g, n:g.n*k })));
  return { id:"legio", region:src ? src.region : "troia", nm:base.nm, nl:base.nl, map:src ? src.map : base.map, seed:ev.seed|0, hpMult:base.hpMult*1.48*Math.pow(pl/12, CASTRA_LEGIO.hpExp),
    waves, edicta:src ? (src.edicta||[]).slice() : [], reward:base.reward };
}
function castraLegioSorted(L){
  if(!L.sorted){
    L.sorted = Object.keys(L.actions).map(k=>({ ...L.actions[k], key:k }))
      .sort((a,b)=>(a.t-b.t) || (a.key<b.key?-1:a.key>b.key?1:0));
  }
  return L.sorted;
}
const _clampInt = (v,lo,hi)=>Math.max(lo, Math.min(hi, parseInt(v,10)||lo));
function castraLegioParseStats(str){
  const p = String(str||"").split(",");
  return { vita:_clampInt(p[0],1,600), impetus:_clampInt(p[1],1,90), tutela:_clampInt(p[2],0,60), celeritas:_clampInt(p[3],1,40), ambitus:_clampInt(p[4],0,20) };
}
function castraLegioBuild(L){
  const m = castraLegioMissionFor(L.ev), sim = castraPSim(m, []);
  sim.mods = { dmg:1, cd:1, rng:1, spd:1, type:{} };
  if(typeof castraEdictApply==="function") castraEdictApply({ mission:m, sim });        // missieregels (nacht, regen, ...), overal gelijk
  sim.baseHp = CASTRA_P.baseHp + Math.floor((L.ev.players||4)/2);
  sim.nextWaveAt = CASTRA_LEGIO.prepTicks; sim.legioPtr = 0;
  sim.cells = castraPPathCells(m.map); sim.trees = {}; CASTRA_P_MAPS[m.map].trees.forEach(t=>{ sim.trees[t[0]+","+t[1]] = 1; });
  return sim;
}
// Past één actie toe op de simulatie; ongeldige acties worden (overal gelijk) genegeerd.
function castraLegioApply(sim, a){
  if(a.k!=="place") return;
  const x = a.x|0, y = a.y|0, key = x+","+y;
  if(x<0||y<0||x>=CASTRA_P.cols||y>=CASTRA_P.rows) return;
  if(sim.cells[key] || sim.trees[key] || sim.towers.some(t=>t.x===x&&t.y===y)) return;
  if(sim.towers.filter(t=>t.owner===a.lid).length >= CASTRA_LEGIO.perPlayer) return;
  const type = CASTRA_TYPES[a.type] ? a.type : "inf";
  const look = (a.hid && CASTRA_HERO_DATA[a.hid]) ? CASTRA_HERO_DATA[a.hid].look : castraPLook(a.line||"rom_hastatus");
  const t = castraPMakeTower(sim, { id:String(a.sid||a.key), line:a.line||"rom_hastatus", owner:a.lid, nm:a.nm, snap:{ st:castraLegioParseStats(a.st), type, look, sk:String(a.sk||"").split(",").filter(Boolean) } }, x, y);
  sim.towers.push(t);
}
// Rekent de simulatie tot en met `toTick` (herberekent van nul als er een te late actie binnenkwam).
function castraLegioStepTo(L, toTick){
  let sim = L.sim;
  if(!sim || L.dirty){ sim = L.sim = castraLegioBuild(L); L.dirty = false; }
  const acts = castraLegioSorted(L);
  while(sim.tick < toTick && !sim.over){
    const t = sim.tick+1;
    while(sim.legioPtr < acts.length && acts[sim.legioPtr].t <= t){ castraLegioApply(sim, acts[sim.legioPtr]); sim.legioPtr++; }
    if(!sim.waveActive && sim.wave+1 < sim.mission.waves.length && t >= sim.nextWaveAt) castraPStartWave(sim);
    const was = sim.waveActive; castraPStep(sim);
    if(was && !sim.waveActive) sim.nextWaveAt = sim.tick + CASTRA_LEGIO.gapTicks;
  }
  return sim;
}
// Pure functie voor tests: dezelfde uitkomst voor dezelfde (event, acties).
function castraLegioRunHeadless(ev, actions, maxTick){
  const L = { ev, actions:{}, sorted:null, dirty:true, sim:null };
  actions.forEach((a,i)=>{ L.actions["k"+String(i).padStart(4,"0")] = a; });
  return castraLegioStepTo(L, maxTick||30000);
}

/* ---------- Firebase ---------- */
function castraLegioDb(){
  try{ if(typeof initFirebase==="function") initFirebase(); }catch(e){}
  return (typeof fbDB!=="undefined" && fbDB) ? fbDB : null;
}
function castraLegioNow(){ return Date.now() + ((CASTRA_L && CASTRA_L.offset) || 0); }
function castraLegioTickNow(){ const ev = CASTRA_L && CASTRA_L.ev; return (ev && ev.startAt) ? Math.floor((castraLegioNow()-ev.startAt)/CASTRA_P.tickMs) : -1; }
function castraLegioAttach(){
  const id = (typeof BM_IDENT!=="undefined") ? BM_IDENT : null, db = castraLegioDb();
  if(!id || !id.klascode || !db) return false;
  if(CASTRA_L && CASTRA_L.klas===id.klascode) return true;
  castraLegioDetach();
  const L = CASTRA_L = { klas:id.klascode, ev:null, players:{}, actions:{}, sorted:null, dirty:true, sim:null, offset:0, refs:[], placed:{} };
  const base = db.ref("castraLegio/"+L.klas);
  const on = (ref, evt, fn)=>{ ref.on(evt, fn); L.refs.push([ref, evt, fn]); };
  on(db.ref(".info/serverTimeOffset"), "value", s=>{ L.offset = s.val()||0; });
  on(base.child("event"), "value", s=>{
    const ev = s.val(), oldId = L.ev && L.ev.id;
    L.ev = ev;
    if(!ev || (oldId && ev.id!==oldId)){ L.actions = {}; L.sorted = null; L.dirty = true; L.sim = null; }
    castraLegioRefreshPanel();
  });
  on(base.child("players"), "value", s=>{ L.players = s.val()||{}; castraLegioRefreshPanel(); });
  on(base.child("actions"), "child_added", s=>{
    const a = s.val(); if(!a) return;
    L.actions[s.key] = a; L.sorted = null;
    if(L.sim && a.t <= L.sim.tick+1) L.dirty = true;         // te laat: opnieuw rekenen
  });
  on(base.child("actions"), "child_removed", s=>{ delete L.actions[s.key]; L.sorted = null; L.dirty = true; });
  return true;
}
function castraLegioDetach(){
  if(!CASTRA_L) return;
  CASTRA_L.refs.forEach(([ref,evt,fn])=>{ try{ ref.off(evt, fn); }catch(e){} });
  CASTRA_L = null;
}
function castraLegioJoin(){
  const id = BM_IDENT, db = castraLegioDb(); if(!id || !db || !CASTRA_L) return;
  db.ref("castraLegio/"+id.klascode+"/players/"+id.leerlingcode).set({ nm:String(id.name||"?").slice(0,40), ts:Date.now() }).catch(()=>{});
}
function castraLegioPush(act){
  const id = BM_IDENT, db = castraLegioDb(); if(!id || !db || !CASTRA_L) return false;
  const ref = db.ref("castraLegio/"+id.klascode+"/actions").push();
  // Zelf alvast lokaal toepassen (child_added vuurt meteen voor eigen schrijfacties, dit is een vangnet).
  ref.set(act).catch(()=>{});
  return true;
}

/* ---------- docent ---------- */
function castraLegioMissionIds(){ return Object.keys(CASTRA_LEGIO_MISSIONS); }
function castraLegioTeacherCreate(klas, missionId){
  const db = castraLegioDb(); if(!db) return Promise.reject("geen firebase");
  const m = CASTRA_LEGIO_MISSIONS[missionId||"legio1"];
  const ev = { id:Date.now(), mission:missionId||"legio1", seed:(Math.random()*2147483647)|0, status:"lobby", createdAt:Date.now(), name:m.nm };
  return db.ref("castraLegio/"+klas).set({ event:ev });
}
function castraLegioTeacherLaunch(klas){
  const db = castraLegioDb(); if(!db) return Promise.reject("geen firebase");
  return Promise.all([ db.ref(".info/serverTimeOffset").once("value"), db.ref("castraLegio/"+klas+"/players").once("value") ]).then(([o,p])=>{
    const off = o.val()||0, n = Object.keys(p.val()||{}).length;
    return db.ref("castraLegio/"+klas+"/event").update({ status:"running", startAt:Date.now()+off+10000, players:Math.max(2,n) });
  });
}
function castraLegioTeacherEnd(klas){
  const db = castraLegioDb(); if(!db) return Promise.reject("geen firebase");
  return db.ref("castraLegio/"+klas).remove();
}

/* ---------- principia-paneel (leerling) ---------- */
function castraLegioRefreshPanel(){ if(CASTRA_UI && CASTRA_UI.panel==="principia" && el("castraPanel") && !el("cbMap")) castraPrincipiaOpen(true); }
function castraPrincipiaOpen(keep){
  CASTRA_UI.panel = "principia";
  if(!keep && typeof castraTradeAttach==="function") castraTradeAttach();
  const tab = CASTRA_UI.pTab || "legio";
  const b = castraBuilding("principia");
  const tabs = `<div style="display:flex;gap:8px;margin:6px 0 10px"><button class="btn ${tab==="legio"?"btn-gold":""}" onclick="CASTRA_UI.pTab='legio';castraPrincipiaOpen(true)">${castraLaText("legio_titel")}</button>
    <button class="btn ${tab==="commercium"?"btn-gold":""}" onclick="CASTRA_UI.pTab='commercium';castraPrincipiaOpen(true)">${castraLaText("commercium")}</button></div>`;
  const id = (typeof BM_IDENT!=="undefined") ? BM_IDENT : null;
  let body;
  if(!id || !id.klascode || !castraLegioDb()){
    body = `<div class="note">${castraLa("legio_inloggen")} <span style="opacity:.8">(Meld je aan via Battle Mode of Meedoen om mee te doen met je klas.)</span></div>`;
  } else if(tab==="commercium" && typeof castraCommerciumHTML==="function"){
    body = castraCommerciumHTML();
  } else {
    castraLegioAttach();
    body = castraLegioHTML();
  }
  castraOpenPanel(`<div class="panel"><h3>${b.icon} ${esc(b.nm)}</h3>
    <div style="font-style:italic;margin-bottom:6px">${castraLaHTML(b.lat||"", b.desc||"", "bld_principia")}</div>${tabs}${body}
    <div style="margin-top:10px"><button class="btn" onclick="castraClosePanel()">${castraLaText("claude")}</button></div></div>`);
}
function castraLegioHTML(){
  const L = CASTRA_L, ev = L && L.ev;
  if(!ev) return `<div class="note">${castraLa("nulla_legio")}</div>`;
  const players = Object.keys(L.players||{}), id = BM_IDENT, joined = players.includes(id.leerlingcode);
  const names = players.map(k=>esc(L.players[k].nm||k)).join(", ");
  const sc = castraPScout(castraLegioMissionFor(ev));
  const head = `<div style="font-size:17px;margin-bottom:4px">⚔️ <b>${castraLaHTML(ev.name||"Legio", "Het klassenevenement", "legio_ev")}</b></div>
    <div style="font-size:15px;margin-bottom:6px"><span style="opacity:.8">${castraLaText("explorator")}</span> ${castraLaHTML(sc.la, sc.nl, "legio_scout")}</div>
    <div class="note">${castraLaText("legionarii")}: ${players.length}${names?" — "+names:""}</div>`;
  if(ev.status==="lobby"){
    return head + `<div style="margin:6px 0">${castraLa("legio_convenit")}</div>` +
      (joined ? `<div class="note">✔ ${castraLaText("adsum")}</div>` : `<button class="btn btn-gold" onclick="castraLegioJoin()">${castraLaText("adsum")}</button>`);
  }
  const tick = castraLegioTickNow();
  const claimed = CASTRA.legio && CASTRA.legio.claimed && CASTRA.legio.claimed[ev.id];
  if(claimed) return head + `<div class="note">${castraLa("legio_finita")}</div>`;
  const wait = tick<0 ? Math.ceil(-tick*CASTRA_P.tickMs/1000) : 0;
  return head + `<div style="margin:6px 0">${wait?castraLaText("legio_incipit")+" "+wait+" s":castraLa("legio_pugnat")}</div>
    <button class="btn btn-gold" onclick="castraLegioEnter()">${castraLaText("pugna")}</button>`;
}

/* ---------- gevecht (hergebruikt het proelium-scherm) ---------- */
function castraLegioEnter(){
  const L = CASTRA_L; if(!L || !L.ev) return;
  if(!(L.players||{})[BM_IDENT.leerlingcode]) castraLegioJoin();   // laatkomers doen automatisch mee
  const m = castraLegioMissionFor(L.ev);
  if(typeof CASTRA_B!=="undefined" && CASTRA_B){ clearInterval(CASTRA_B.timer); try{ window.removeEventListener("resize", CASTRA_B.resizeFn); }catch(e){} }
  CASTRA_B = { mission:m, sim:castraPSim(m, []), sel:null, timer:null, speed:1, units:{}, fx:[], placed:{}, lastDir:{}, finished:false, legio:true, ed:(typeof castraEdictSimSetup==="function" ? castraEdictSimSetup(m) : null) };
  go("castraBattle");
}
function castraLegioMine(){ const id = BM_IDENT.leerlingcode; return castraLegioSorted(CASTRA_L).filter(a=>a.lid===id && a.k==="place"); }
function castraLegioTap(x, y){
  const L = CASTRA_L, B = CASTRA_B; if(!L || !B || !L.ev || B.finished) return;
  const tick = castraLegioTickNow(); if(tick<0) return;
  const sim = B.sim;
  if(!B.sel){ return; }
  const unit = castraBHealthy().find(q=>q.id===B.sel); if(!unit) return;
  const mine = sim.towers.filter(t=>t.owner===BM_IDENT.leerlingcode).length;
  if(mine >= CASTRA_LEGIO.perPlayer){ castraToastLa("acies_plena"); return; }
  const key = x+","+y;
  if(sim.cells[key] || sim.trees[key] || sim.towers.some(t=>t.x===x&&t.y===y) || x<0||y<0||x>=CASTRA_P.cols||y>=CASTRA_P.rows) return;
  const st = unit.hero ? castraHeroStats(unit.h) : (unit.dux ? CASTRA_V_BAL.dux : castraStats(unit));
  const type = unit.hero ? CASTRA_HERO_DATA[unit.h.id].type : castraLine(unit.line).type;
  const act = { t: tick+CASTRA_LEGIO.lead, k:"place", x, y, lid:BM_IDENT.leerlingcode, sid:String(unit.id).slice(0,30), line:unit.line||"rom_hastatus", hid: unit.hero?unit.h.id:"", type,
    st:[st.vita,st.impetus,st.tutela,st.celeritas,st.ambitus].join(","), nm:String(unit.hero?CASTRA_HERO_DATA[unit.h.id].nm:(unit.dux?"Dux":castraSoldierName(unit))).slice(0,30),
    sk:(unit.dux?[]:castraSkillIds(unit.hero?{hero:true,h:unit.h}:unit)).join(",").slice(0,60) };
  B.placed[unit.id] = true; B.sel = null;
  castraLegioPush(act);
  castraBRenderCards();
}
function castraLegioTick(){
  const B = CASTRA_B, L = CASTRA_L;
  if(!B || !B.legio || !el("cbMap")){ if(B) clearInterval(B.timer); return; }
  if(!L || !L.ev){ el("cbHud").innerHTML = castraLa("nulla_legio"); return; }
  const tick = castraLegioTickNow();
  if(tick < 0){ el("cbHud").innerHTML = `${castraLaText("legio_incipit")} <b>${Math.ceil(-tick*CASTRA_P.tickMs/1000)}</b> s`; return; }
  const sim = castraLegioStepTo(L, tick);
  B.sim = sim;
  sim.events.forEach(ev=>{
    if(ev.k==="hit"){ const t = sim.towers.find(x=>x.id===ev.t), e = sim.enemies.find(x=>x.id===ev.e); if(t&&e) B.fx.push({ x1:t.cx, y1:t.cy, x2:e.x, y2:e.y, ttl:3, type:t.type }); }
  });
  castraLegioSyncTowers(); castraBDrawUnits(); castraBDrawFx(); castraLegioHud();
  if(sim.over && !B.finished){ B.finished = true; clearInterval(B.timer); castraLegioFinish(); }
}
function castraLegioSyncTowers(){
  const B = CASTRA_B, box = el("cbUnits"); if(!box) return;
  const want = {}; B.sim.towers.forEach(t=>{ want[t.id] = t; });
  [...box.children].forEach(c=>{ if(c.id && c.id.indexOf("cbT")===0 && !want[c.id.slice(3)]) c.remove(); });
  B.sim.towers.forEach(t=>{
    if(document.getElementById("cbT"+t.id)) return;
    const d = document.createElement("div"); d.id = "cbT"+t.id;
    const mine = t.owner===BM_IDENT.leerlingcode;
    d.style.cssText = `position:absolute;left:${t.x*48}px;top:${t.y*48}px;width:48px;height:48px;${mine?"filter:drop-shadow(0 0 3px rgba(212,175,55,.95))":""}`;
    d.innerHTML = castraAvatarHTML(t.look || castraPLook(t.line), "down", 1, 48) + `<div style="position:absolute;left:0;right:0;bottom:-2px;text-align:center;font-size:9px;color:var(--cream,#f1e6c4);text-shadow:0 1px 2px #000">${esc((CASTRA_L.players[t.owner]||{}).nm||"")}</div>`;
    box.appendChild(d);
  });
  const mineN = B.sim.towers.filter(t=>t.owner===BM_IDENT.leerlingcode).length;
  if(B.lastMine!==mineN){ B.lastMine = mineN; B.placed = {}; B.sim.towers.forEach(t=>{ if(t.owner===BM_IDENT.leerlingcode) B.placed[t.sid] = true; }); castraBRenderCards(); }
}
function castraLegioHud(){
  const B = CASTRA_B, s = B.sim, m = B.mission, mine = s.towers.filter(t=>t.owner===BM_IDENT.leerlingcode).length;
  const next = (!s.waveActive && !s.over && s.wave+1 < m.waves.length) ? Math.max(0, Math.ceil((s.nextWaveAt - s.tick)*CASTRA_P.tickMs/1000)) : 0;
  el("cbHud").innerHTML = `<span>❤️ ${castraLaText("vita_castrorum")}: <b>${s.baseHp}</b></span>
    <span>${castraLaText("ala")}: <b>${Math.max(0,s.wave+(s.waveActive?1:0))}</b> / ${m.waves.length}${next?` · ⏱ ${next}s`:""}</span>
    <span>${castraLaText("milites")}: <b>${mine}</b> / ${CASTRA_LEGIO.perPlayer} · ${castraLaText("legionarii")}: ${Object.keys(CASTRA_L.players||{}).length}</span>
    ${(typeof castraEdictChips==="function") ? "<span style='flex-basis:100%'>"+castraEdictChips(m)+"</span>" : ""}`;
}
function castraLegioBoard(s){
  const by = {}; let tot = 0;
  s.towers.forEach(t=>{ const d = (s.stat.dmg[t.id]||0); if(!d) return; by[t.owner] = (by[t.owner]||0)+d; tot += d; });
  return Object.keys(by).map(k=>({ lid:k, nm:(CASTRA_L.players[k]||{}).nm||k, d:by[k], pct:tot ? Math.round(100*by[k]/tot) : 0 })).sort((a,b)=>b.d-a.d);
}
function castraLegioFinish(){
  const B = CASTRA_B, s = B.sim, m = B.mission, L = CASTRA_L, box = el("cbResult"); if(!box) return;
  const base = CASTRA_LEGIO_MISSIONS[L.ev.mission] || CASTRA_LEGIO_MISSIONS.legio1;
  const claimed = CASTRA.legio && CASTRA.legio.claimed && CASTRA.legio.claimed[L.ev.id];
  let h = `<div class="panel">`;
  if(s.over==="win"){
    h += `<div style="font-size:22px;margin-bottom:6px">${castraLaHTML(base.vLa||"Victoria!", base.vNl||"Overwinning!", "legio_v_"+L.ev.mission)}</div>`;
    if(!claimed){
      const cap = castraWalletCap();
      Object.keys(m.reward).forEach(r=>{ CASTRA.res[r] = r==="gloria" ? (CASTRA.res[r]||0)+m.reward[r] : Math.min(cap, (CASTRA.res[r]||0)+m.reward[r]); });
      s.towers.filter(t=>t.owner===BM_IDENT.leerlingcode).forEach(t=>{
        const sol = CASTRA.soldiers.find(x=>x.id===t.sid); if(sol){ sol.xp += castraXpTd(m, sol.lvl); castraLevelUp(sol); }
        if(String(t.sid).indexOf("hero_")===0){ const hh = castraHero(String(t.sid).slice(5)); if(hh){ hh.xp += castraXpTd(m, hh.lvl); castraHeroLevelUp(hh); } }
      });
      if(typeof castraPxpAdd==="function") castraPxpAdd(40, "Legio gewonnen");
      (CASTRA.legio || (CASTRA.legio = { claimed:{} })).claimed = CASTRA.legio.claimed || {};
      CASTRA.legio.claimed[L.ev.id] = true; castraSave();
      h += `<div>${castraLaText("praemium")}: ${Object.keys(m.reward).map(r=>castraRes(r).icon+" +"+m.reward[r]).join(" · ")}</div>`;
    }
  } else h += `<div style="font-size:22px;margin-bottom:6px">${castraLaHTML(base.cLa||"Clades.", base.cNl||"Verslagen.", "legio_c_"+L.ev.mission)}</div>`;
  const board = castraLegioBoard(s);
  if(board.length) h += `<div style="margin-top:10px"><b>🏛️ ${castraLaHTML("Quis optime pugnavit?", "Wie vocht het best? (aandeel in de geleverde schade)", "legio_board")}</b>
    ${board.slice(0,5).map((b,i)=>`<div style="display:flex;align-items:center;gap:8px;margin:3px 0;${b.lid===BM_IDENT.leerlingcode?"font-weight:bold":""}"><span style="width:20px">${i+1}.</span><span style="flex:0 0 110px;overflow:hidden;text-overflow:ellipsis">${esc(b.nm)}</span><div style="flex:1;height:8px;background:#2a1a10;border-radius:4px;overflow:hidden"><div style="height:100%;width:${b.pct}%;background:linear-gradient(90deg,var(--hi-dim,#8a6d2f),var(--hi,#d4af37))"></div></div><span style="width:40px;text-align:right">${b.pct}%</span></div>`).join("")}
    <div class="note">Samen gewonnen of verloren: het gaat om de legio, niet om de ranglijst.</div></div>`;
  h += `<div style="margin-top:12px"><button class="btn btn-gold" onclick="castraBExit()">${castraLaText("perge")}</button></div></div>`;
  box.innerHTML = h; box.scrollIntoView({ behavior:"smooth", block:"nearest" });
}
