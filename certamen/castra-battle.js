/* ============================================================================
   CASTRA HEROUM — PROELIUM: SCHERMEN (campagnelijst + gevecht)
   ----------------------------------------------------------------------------
   Simulatie: castra-proelium.js (deterministisch). Hier alleen weergave en
   bediening: soldaat kiezen -> tegel tikken om te plaatsen, tik op een eigen
   soldaat om hem terug te nemen, "Incipe!" start een golf. Latijnse teksten:
   castra-latin.js. Laadt NA castra-proelium.js.
   ============================================================================ */

let CASTRA_B = null;   // actief gevecht: { mission, sim, sel, timer, speed, units, fx, built, scale, cells }

function castraPMissionDone(id){ return !!(CASTRA.proelium && CASTRA.proelium.done && CASTRA.proelium.done[id]); }
function castraPMissionOpen(m){ return !m.needs || castraPMissionDone(m.needs); }

/* ---------- campagnelijst ---------- */
SCREENS.castraProelium = function(){
  document.body.classList.remove("greek");
  if(!CASTRA) castraLoad();
  let lastRegion = null;
  const cards = CASTRA_P_MISSIONS.map(m=>{
    const open = castraPMissionOpen(m), done = castraPMissionDone(m.id), sc = castraPScout(m);
    const head = m.region!==lastRegion ? (lastRegion = m.region, `<h3 style="margin:14px 2px 4px">${CASTRA_WORLDS[m.region].icon} ${esc(CASTRA_WORLDS[m.region].nm)}</h3>`) : "";
    return head + `<div class="panel" style="${open?"":"opacity:.5"}">
      <h3>${done?"✔ ":open?"⚔️ ":"🔒 "}${castraLaHTML(m.nm, m.nl, "m_"+m.id)}</h3>
      ${open?`<div style="font-size:15px;margin:4px 0 8px"><span style="opacity:.8">${castraLaText("explorator")}</span> ${castraLaHTML(sc.la, sc.nl, "scout_"+m.id)}</div>
        <button class="btn btn-gold" onclick="castraBStart('${m.id}')">${castraLaText("proelium_ini")}</button>`
        : `<div class="note">${castraLa("clausum")}</div>`}
    </div>`;
  }).join("");
  H(brand(true)+`
  <div class="scrhead"><button class="back" onclick="castraPLeave()">${iconSVG("shield",20,"currentColor")}</button><h2>⚔️ ${castraLa("proelium_titel")}</h2></div>
  ${cards}${foot()}`);
};
function castraPLeave(){ CASTRA.pos = { x:14, y:5 }; castraSave(); go("castraHome"); }

/* ---------- gevecht ---------- */
function castraBHealthy(){
  const list = (CASTRA.heroes||[]).map(castraHeroAsUnit).concat(CASTRA.soldiers.filter(s=>!castraIsHurt(s)));
  return list.length ? list : [ { id:"dux", dux:true, line:"rom_hastatus", lvl:1, name:"Dux" } ];
}
function castraBCap(){ return 4 + 2*castraLvl("praetorium"); }
function castraBStart(missionId){
  const m = CASTRA_P_MISSIONS.find(x=>x.id===missionId); if(!m || !castraPMissionOpen(m)) return;
  if(CASTRA_B){ clearInterval(CASTRA_B.timer); window.removeEventListener("resize", CASTRA_B.resizeFn); }
  const opts = (CASTRA.opts || (CASTRA.opts = {}));
  CASTRA_B = { mission:m, sim:castraPSim(m, []), sel:null, timer:null, speed:opts.speed||1, auto:!!opts.auto, units:{}, fx:[], placed:{}, lastDir:{}, finished:false,
               boons:[], pick:null, offeredFor:-2, rewardMult:1, autoT:0, ctlSig:"" };
  CASTRA_B.sim.mods = { dmg:1, cd:1, rng:1, spd:1 };
  if(typeof castraCardApply==="function") castraCardApply(CASTRA_B);   // kaartbonussen (alleen solo)
  // vormsprites (indien aanwezig) vooraf controleren: alle vijanden van de missie en je eigen soldaten
  const ids = {}; m.waves.forEach(w=>w.forEach(g=>ids[g.line]=1)); (CASTRA.soldiers||[]).forEach(s=>ids[s.line]=1);
  castraFsprProbe(Object.keys(ids).map(i=>[i,"td"]), null);
  go("castraBattle");
}
SCREENS.castraBattle = function(){
  if(!CASTRA_B){ go("castraProelium"); return; }
  const B = CASTRA_B, m = B.mission;
  CASTRA_B.units = {}; CASTRA_B.fx = [];
  H(brand(true)+`
  <div class="scrhead"><button class="back" onclick="castraBExit()">${iconSVG("shield",20,"currentColor")}</button><h2>⚔️ ${castraLaHTML(m.nm, m.nl, "m_"+m.id)}</h2></div>
  <div id="cbHud" class="note" style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px"></div>
  <div id="cbWrap" style="position:relative;width:100%;overflow:hidden;border:2px solid var(--hi,#d4af37);border-radius:10px;background:#2c3a1f;touch-action:manipulation">
    <div id="cbMap" style="position:absolute;top:0;left:0;width:${CASTRA_P.cols*48}px;height:${CASTRA_P.rows*48}px;transform-origin:top left"></div>
  </div>
  <div id="cbCtl" style="display:flex;gap:8px;margin:10px 0;flex-wrap:wrap"></div>
  <div id="cbCards"></div>
  <div id="cbResult"></div>
  ${foot()}`);
  castraBBuildMap();
  castraBFit();
  castraBRenderHud(); castraBRenderCtl(); castraBRenderCards();
  B.resizeFn = castraBFit; window.addEventListener("resize", B.resizeFn);
  B.timer = setInterval(B.legio ? castraLegioTick : castraBTick, CASTRA_P.tickMs);
};
function castraBExit(){
  if(CASTRA_B){ clearInterval(CASTRA_B.timer); window.removeEventListener("resize", CASTRA_B.resizeFn); }
  const legio = CASTRA_B && CASTRA_B.legio; CASTRA_B = null; go(legio ? "castraHome" : "castraProelium");
}
function castraBBuildMap(){
  const B = CASTRA_B, mp = CASTRA_P_MAPS[B.mission.map], cols = CASTRA_P.cols, rows = CASTRA_P.rows;
  const g = castraGroundGrid(cols, rows, "grass"), cells = castraPPathCells(B.mission.map);
  Object.keys(cells).forEach(k=>{ const [x,y] = k.split(",").map(Number); g[y][x] = "sand"; });
  const pieces = mp.trees.map((t,i)=>({ o:(i%2?"tree_a":"tree_b"), x:t[0], y:t[1]-1 }));
  // bomen staan op de aangegeven cel (stam); de boomtop valt een tegel erboven
  B.cells = cells; B.blockedTrees = {}; mp.trees.forEach(t=>{ B.blockedTrees[t[0]+","+t[1]] = 1; });
  B.built = castraMapLogic({ cols, rows, ground:g, pieces, walls:[] });
  const map = el("cbMap");
  map.innerHTML = `<canvas id="cbBelow" style="position:absolute;left:0;top:0;image-rendering:pixelated"></canvas>
    <div id="cbPlace" style="position:absolute;left:0;top:0;width:100%;height:100%;z-index:2"></div>
    <div id="cbUnits" style="position:absolute;left:0;top:0;z-index:3;pointer-events:none"></div>
    <canvas id="cbFx" width="${cols*48}" height="${rows*48}" style="position:absolute;left:0;top:0;pointer-events:none;z-index:4"></canvas>
    <canvas id="cbAbove" style="position:absolute;left:0;top:0;pointer-events:none;image-rendering:pixelated;z-index:5"></canvas>`;
  map.onclick = castraBMapTap;
  castraTsLoad().then(()=>{ const b=el("cbBelow"), a=el("cbAbove"); if(b&&a) castraDrawMapLayers(B.built, b, a); });
  // pad: begin- en eindpunt aanduiden
  const P = mp.path, first = P[0], last = P[P.length-1];
  el("cbPlace").innerHTML = `<div style="position:absolute;left:${first[0]*48}px;top:${first[1]*48}px;width:48px;height:48px;background:rgba(200,57,42,.35)"></div>
    <div style="position:absolute;left:${last[0]*48}px;top:${last[1]*48}px;width:48px;height:48px;background:rgba(63,157,82,.35)"></div>`;
  // torens die al staan (bij hergebruik na een golf)
  B.sim.towers.forEach(castraBDrawTower);
}
function castraBFit(){
  const w = el("cbWrap"); if(!w || !CASTRA_B) return;
  const s = Math.min(1.25, w.clientWidth/(CASTRA_P.cols*48)); CASTRA_B.scale = s;
  w.style.height = (CASTRA_P.rows*48*s)+"px"; el("cbMap").style.transform = "scale("+s+")";
}

/* ---------- plaatsen ---------- */
function castraBTileFree(x,y){
  const B = CASTRA_B;
  if(x<0||y<0||x>=CASTRA_P.cols||y>=CASTRA_P.rows) return false;
  if(B.cells[x+","+y] || B.blockedTrees[x+","+y]) return false;
  return !B.sim.towers.some(t=>t.x===x && t.y===y);
}
function castraBMapTap(e){
  const B = CASTRA_B; if(!B || B.sim.over) return;
  const r = el("cbMap").getBoundingClientRect(), s = B.scale||1;
  const x = Math.floor((e.clientX-r.left)/s/48), y = Math.floor((e.clientY-r.top)/s/48);
  if(B.legio){ castraLegioTap(x, y); return; }
  const tw = B.sim.towers.find(t=>t.x===x && t.y===y);
  if(tw){ if(!B.sim.waveActive){ castraBRemoveTower(tw); } return; }   // eigen soldaat terugnemen (alleen tussen golven)
  if(!B.sel || !castraBTileFree(x,y)) return;
  if(B.sim.towers.length >= castraBCap()){ castraToastLa("acies_plena"); return; }
  const s0 = castraBHealthy().find(q=>q.id===B.sel); if(!s0) return;
  const tower = castraPMakeTower(B.sim, s0, x, y);
  B.sim.towers.push(tower); B.placed[s0.id] = true; B.sel = null;
  castraBDrawTower(tower); castraBRenderCards(); castraBRenderHud();
}
function castraBRemoveTower(tw){
  const B = CASTRA_B; B.sim.towers = B.sim.towers.filter(t=>t!==tw);
  delete B.placed[tw.sid]; const d = document.getElementById("cbT"+tw.id); if(d) d.remove();
  castraBRenderCards(); castraBRenderHud();
}
function castraBDrawTower(t){
  const box = el("cbUnits"); if(!box) return;
  const d = document.createElement("div"); d.id = "cbT"+t.id;
  d.style.cssText = `position:absolute;left:${t.x*48}px;top:${t.y*48}px;width:48px;height:48px`;
  d.innerHTML = (t.look ? castraAvatarHTML(t.look, "down", 1, 48) : castraFsprHTML(t.line, "td", 48, castraAvatarHTML(castraPLook(t.line), "down", 1, 48))) + (t.type==="sup"?`<div style="position:absolute;top:-4px;right:0;font-size:12px">✨</div>`:"");
  box.appendChild(d);
}

/* ---------- bediening ---------- */
function castraBRenderHud(){
  const B = CASTRA_B, h = el("cbHud"); if(!h) return; const s = B.sim, m = B.mission;
  h.innerHTML = `<span>❤️ ${castraLaText("vita_castrorum")}: <b>${s.baseHp}</b> / ${CASTRA_P.baseHp}</span>
    <span>${castraLaText("ala")}: <b>${Math.max(0,s.wave+(s.waveActive?1:0))}</b> / ${m.waves.length}</span>
    <span>${castraLaText("milites")}: <b>${s.towers.length}</b> / ${castraBCap()}</span>`;
}
/* Dona (gunsten): na elke golf (behalve de laatste) kies je 1 van 2; ze gelden voor de rest van de missie (alleen solo). */
const CASTRA_DONA = [
  { id:"vires",     la:"Vires",     nl:"alle torens +15% schade",           mods:{ dmg:1.15 } },
  { id:"celeritas", la:"Celeritas", nl:"alle torens schieten 15% sneller",  mods:{ cd:0.85 } },
  { id:"acies",     la:"Acies",     nl:"alle torens +10% bereik",           mods:{ rng:1.10 } },
  { id:"gelu",      la:"Gelu",      nl:"vijanden lopen 10% langzamer",      mods:{ spd:0.90 } },
  { id:"murus",     la:"Murus",     nl:"+2 levens voor het kamp",           hp:2 },
  { id:"praeda",    la:"Praeda",    nl:"+25% beloning na de missie",        reward:1.25 },
];
function castraBOfer(){
  const B = CASTRA_B, s = B.sim;
  if(B.legio || s.over || s.waveActive || s.wave<0 || s.wave>=B.mission.waves.length-1 || B.offeredFor===s.wave) return;
  B.offeredFor = s.wave;
  const pool = CASTRA_DONA.slice(); const a = pool.splice(Math.floor(Math.random()*pool.length),1)[0], b = pool.splice(Math.floor(Math.random()*pool.length),1)[0];
  B.pick = [a,b]; B.autoT = 0; castraBRenderCtl();
}
function castraBPick(k){
  const B = CASTRA_B; if(!B || !B.pick) return; const d = B.pick[k]; if(!d) return;
  const m = B.sim.mods; if(d.mods) Object.keys(d.mods).forEach(x=>{ m[x] = Math.round(m[x]*d.mods[x]*1000)/1000; });
  if(d.hp) B.sim.baseHp += d.hp; if(d.reward) B.rewardMult *= d.reward;
  B.boons.push(d.id); B.pick = null; B.autoT = 0; castraBRenderCtl(); castraBRenderHud();
}
function castraBAutoToggle(){ const B = CASTRA_B; B.auto = !B.auto; (CASTRA.opts || (CASTRA.opts = {})).auto = B.auto; castraSave(); B.autoT = 0; castraBRenderCtl(); }
function castraBRenderCtl(){
  const B = CASTRA_B, c = el("cbCtl"); if(!c) return; const s = B.sim;
  if(B.legio){ c.innerHTML = ""; return; }
  // alleen opnieuw tekenen als er iets veranderd is (anders verdwijnen knoppen midden in een tik)
  const sig = [s.waveActive, s.wave, s.over, B.speed, B.auto, B.pick?B.pick[0].id+B.pick[1].id:"", B.boons.length].join("|");
  if(sig===B.ctlSig) return; B.ctlSig = sig;
  const nextWave = s.waveActive ? s.wave : s.wave+1;
  const pickHtml = B.pick ? `<div style="margin:8px 0;padding:8px;border:2px solid #d4af37;border-radius:10px;background:rgba(212,175,55,.12)">
      <div style="font-size:16px;margin-bottom:6px">${castraLaHTML("Elige donum!", "Kies een gunst voor de rest van de missie!", "donum_elige")}</div>
      ${B.pick.map((d,k)=>`<button class="btn btn-gold" style="margin:3px 6px 3px 0;min-height:44px" onclick="castraBPick(${k})"><b>${esc(d.la)}</b> <small>${esc(d.nl)}</small></button>`).join("")}</div>` : "";
  const cardTxt = (B.cardInfo && typeof castraCardSummary==="function") ? castraCardSummary(B.cardInfo) : "";
  const have = (B.boons.length || cardTxt) ? `<div style="font-size:12px;opacity:.8;margin-top:4px">${B.boons.map(id=>{ const d = CASTRA_DONA.find(x=>x.id===id); return esc(d.la); }).join(" · ")}${cardTxt?`<div>🃏 ${esc(cardTxt)}</div>`:""}</div>` : "";
  c.innerHTML = pickHtml + `<button class="btn btn-gold" ${s.waveActive||s.over||B.pick?"disabled":""} onclick="castraBStartWave()">${castraLaText("incipe")} ${!s.waveActive&&nextWave<B.mission.waves.length?"("+(nextWave+1)+"/"+B.mission.waves.length+")":""}</button>
    <button class="btn" style="min-height:44px" onclick="castraBSpeed()">${B.speed===1?"▶":"⏩"} ${B.speed}× ${castraLaText("celerius")}</button>
    <button class="btn ${B.auto?"btn-gold":""}" style="min-height:44px" onclick="castraBAutoToggle()" title="Start de volgende golf automatisch">⟳ Auto ${B.auto?"aan":"uit"}</button>` + have;
}
function castraBStartWave(){
  const B = CASTRA_B; if(!B || B.sim.over) return;
  if(castraPStartWave(B.sim)){ B.sel = null; castraBRenderCtl(); castraBRenderCards(); castraBRenderHud(); }
}
function castraBSpeed(){ const B = CASTRA_B; B.speed = B.speed>=3 ? 1 : B.speed+1; (CASTRA.opts || (CASTRA.opts = {})).speed = B.speed; castraSave(); castraBRenderCtl(); }
function castraBRenderCards(){
  const B = CASTRA_B, box = el("cbCards"); if(!box) return;
  const list = castraBHealthy();
  box.innerHTML = `<div class="note" style="margin-bottom:6px">${castraLa("elige_loca")}</div>` + list.map(s=>{
    const placed = !!B.placed[s.id], st = s.hero ? castraHeroStats(s.h) : s.dux ? CASTRA_V_BAL.dux : castraStats(s);
    const ty = s.hero ? CASTRA_HERO_DATA[s.h.id].type : castraLine(s.line).type;
    const sel = B.sel===s.id, nm = s.hero ? CASTRA_HERO_DATA[s.h.id].nm : s.dux ? "Dux" : castraSoldierName(s), t = CASTRA_TYPE_LA[ty];
    return `<button class="tile ${sel?"tile-primary":""}" ${placed?"disabled":""} style="${placed?"opacity:.45;":""}" onclick="castraBSelect('${s.id}')">
      <h3>${s.hero?"⭐ ":s.insignis?"✨ ":""}${esc(nm)} <small>${castraLaText("gradus")} ${s.lvl||1} · ${esc(t.sg)}</small></h3>
      <p>${CASTRA_STATS.map(x=>x.nm.slice(0,3)+" "+st[x.id]).join(" · ")}</p></button>`;
  }).join("");
}
function castraBSelect(id){ const B = CASTRA_B; B.sel = (B.sel===id ? null : id); castraBRenderCards(); }

/* ---------- lus ---------- */
function castraBTick(){
  const B = CASTRA_B; if(!B || !el("cbMap")){ if(B) clearInterval(B.timer); return; }
  if(B.finished) return;
  for(let i=0;i<B.speed && !B.sim.over;i++){
    castraPStep(B.sim);
    B.sim.events.forEach(ev=>{
      if(ev.k==="hit"){ const t = B.sim.towers.find(x=>x.id===ev.t), e = B.sim.enemies.find(x=>x.id===ev.e); if(t&&e) B.fx.push({ x1:t.cx, y1:t.cy, x2:e.x, y2:e.y, ttl:3, type:t.type }); }
    });
  }
  castraBDrawUnits(); castraBDrawFx(); castraBRenderHud();
  if(B.sim.over && !B.finished){ B.finished = true; castraBFinish(); }
  else if(!B.sim.waveActive){
    castraBOfer(); castraBRenderCtl();
    // automatisch de volgende golf starten (3 s na de vorige; niet zolang je nog een gunst moet kiezen; eerste golf altijd handmatig)
    if(B.auto && !B.pick && B.sim.wave>=0 && B.sim.wave < B.mission.waves.length-1 && ++B.autoT >= 60) castraBStartWave();
  }
}
function castraBDrawUnits(){
  const B = CASTRA_B, box = el("cbUnits"); if(!box) return; const tick = B.sim.tick;
  const live = {};
  B.sim.enemies.forEach(e=>{
    live[e.id] = 1;
    let u = B.units[e.id];
    const px = e.x*48/1000, py = e.y*48/1000;
    if(!u){
      const d = document.createElement("div");
      d.style.cssText = "position:absolute;width:48px;height:48px;left:0;top:0;filter:drop-shadow(0 0 3px rgba(200,40,40,.9)) saturate(1.2)";
      d.innerHTML = `<div class="av"></div><div style="position:absolute;left:6px;top:-2px;width:36px;height:5px;background:#2a1010;border-radius:3px"><div class="hp" style="height:100%;background:#c8392a;border-radius:3px"></div></div>`;
      box.appendChild(d); u = B.units[e.id] = { d, px, py, dir:"down", frame:-1 };
    }
    const dx = px-u.px, dy = py-u.py;
    const dir = Math.abs(dx) > Math.abs(dy) ? (dx>0?"right":"left") : (dy>0?"down":(dy<0?"up":u.dir));
    const frame = [0,1,2,1][(tick>>2)&3];
    if(dir!==u.dir || frame!==u.frame){
      u.dir = dir; u.frame = frame;
      if(castraFsprHas(e.line,"td")===true){
        // één stilstaand plaatje: spiegelen bij links, lichte huppel in de looptakt
        u.d.firstChild.innerHTML = `<div style="transform:translateY(${frame===1?0:-2}px)">${castraFsprHTML(e.line,"td",48,"",dir==="left")}</div>`;
      } else u.d.firstChild.innerHTML = castraAvatarHTML(castraPLook(e.line), dir, frame, 48);
    }
    u.px = px; u.py = py;
    u.d.style.transform = `translate(${px-24}px,${py-24}px)`;
    u.d.querySelector(".hp").style.width = Math.max(0, Math.round(100*e.hp/e.maxHp))+"%";
  });
  Object.keys(B.units).forEach(id=>{ if(!live[id]){ B.units[id].d.remove(); delete B.units[id]; } });
}
function castraBDrawFx(){
  const B = CASTRA_B, cv = el("cbFx"); if(!cv) return; const g = cv.getContext("2d");
  g.clearRect(0,0,cv.width,cv.height);
  B.fx = B.fx.filter(f=>f.ttl>0);
  B.fx.forEach(f=>{
    g.strokeStyle = f.type==="rng" ? "#f6dd8e" : f.type==="cav" ? "#9ad" : f.type==="myth" ? "#d8f" : "#fff";
    g.globalAlpha = f.ttl/3; g.lineWidth = 3; g.beginPath();
    g.moveTo(f.x1*48/1000, f.y1*48/1000); g.lineTo(f.x2*48/1000, f.y2*48/1000); g.stroke(); f.ttl--;
  });
  g.globalAlpha = 1;
}

/* ---------- einde ---------- */
function castraBFinish(){
  const B = CASTRA_B, m = B.mission, s = B.sim, box = el("cbResult");
  clearInterval(B.timer);
  let h = `<div class="panel">`;
  if(s.over==="win"){
    const cap = castraWalletCap();
    let skR = 0; s.towers.forEach(t=>{ if(t.sk) skR += t.sk.reward; });
    B.rewardMult = (B.rewardMult||1) * (1 + skR/100);
    const rw = {}; Object.keys(m.reward).forEach(r=>{ rw[r] = Math.round(m.reward[r]*(B.rewardMult||1)); });
    Object.keys(rw).forEach(r=>{ CASTRA.res[r] = r==="gloria" ? (CASTRA.res[r]||0)+rw[r] : Math.min(cap, (CASTRA.res[r]||0)+rw[r]); });
    const lines = [];
    s.towers.forEach(t=>{
      if(String(t.sid).indexOf("hero_")===0){
        const hh = castraHero(String(t.sid).slice(5)); if(hh){ hh.xp += castraCardXp(12 + 6*m.waves.length); if(castraHeroLevelUp(hh)) lines.push(CASTRA_HERO_DATA[hh.id].nm); }
        return;
      }
      const sol = CASTRA.soldiers.find(x=>x.id===t.sid); if(!sol) return;
      sol.xp += castraCardXp(12 + 6*m.waves.length); if(castraLevelUp(sol)) lines.push(castraSoldierName(sol));
    });
    (CASTRA.proelium || (CASTRA.proelium = { done:{} })).done = CASTRA.proelium.done || {};
    CASTRA.proelium.done[m.id] = true; castraSave();
    h += `<div style="font-size:22px;margin-bottom:6px">${castraLa("castra_defensa")}</div>
      <div>${castraLaText("praemium")}: ${Object.keys(rw).map(r=>castraRes(r).icon+" +"+rw[r]).join(" · ")}${B.rewardMult>1?" ("+castraLaText("praemium")+" ×"+B.rewardMult.toFixed(2)+")":""}</div>
      ${lines.length?`<div class="note">⭐ ${esc(lines.join(", "))} → ${castraLaText("gradus")}</div>`:""}`;
  } else {
    h += `<div style="font-size:22px;margin-bottom:6px">${castraLa("castra_capta")}</div>`;
  }
  const hurt = castraBattleWounds(s, s.over==="lose");
  if(hurt.length) h += `<div class="note" style="margin-top:8px">🩹 ${castraLaHTML(hurt.length+" milites vulnerati sunt.", hurt.length+" soldaten zijn gewond geraakt.", "wounded_n")}</div>`;
  h += `<div style="display:flex;gap:10px;margin-top:14px"><button class="btn btn-gold" onclick="castraBExit()">${castraLaText("perge")}</button>
    <button class="btn" onclick="castraBStart('${m.id}')">${castraLaText("iterum_pugna")}</button></div></div>`;
  box.innerHTML = h; box.scrollIntoView({ behavior:"smooth", block:"nearest" });
  el("cbCtl").innerHTML = "";
}
