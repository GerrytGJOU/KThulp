/* ============================================================================
   CASTRA HEROUM — EIGEN PLEK KIEZEN, GROEIEND KAMP EN VRIJE PADEN
   ----------------------------------------------------------------------------
   - Gebouwen zet je zelf neer: knop 🔨 linksonder opent de bouwlijst; kies een gebouw en tik waar de INGANG (onderkant)
     moet komen. Een groen kader mag, een rood kader niet. "✥ Verplaats" tilt een gebouw op en zet het elders neer.
   - Paden blijven vrij: een plek wordt geweigerd als daardoor een poort, een gebouw of jijzelf niet meer bereikbaar is
     (zelfde regel voor het inrichten met bloemen, bomen enzovoort: castraPathsOk).
   - Het kamp groeit mee met het Praetorium (CASTRA_CAMP_SIZES); de nieuwe ruimte komt rechts en onderaan.
   - Een kamp dat met de nieuwe tutorial begint (CASTRA.camp2) heeft alleen het Principia; de rest bouw je zelf.
   Opslag: CASTRA.slots = { gebouw: {x,y} }, CASTRA.camp2 = true. Zie castraSlot (castra-map.js).
   Laadt NA castra-decor.js.
   ============================================================================ */

const CASTRA_CAMP_SIZES = [ { lvl:1, cols:16, rows:15 }, { lvl:4, cols:22, rows:18 }, { lvl:7, cols:28, rows:22 }, { lvl:10, cols:32, rows:26 } ];
// Vanaf welk Castra-niveau een nog niet geplaatst gebouw in de bouwlijst staat (wat niet genoemd is: meteen).
const CASTRA_BUILD_NEED = { horreum:2, campus:2, dilectus:2, heroum:3, stabula:5, navalia:6 };
// De gebouwen die de tutorial je laat neerzetten, in deze volgorde (na het Praetorium).
const CASTRA_TUT_BUILDINGS = ["lignatio","metallum","valetudinarium","contubernia"];
const CASTRA_PLAN = { on:false, id:null, x:null, y:null, move:false, pick:false, tut:false, list:false };

/* ---------- kaartgrootte ---------- */
function castraCampSizeFor(pl){ let r = CASTRA_CAMP_SIZES[0]; CASTRA_CAMP_SIZES.forEach(s=>{ if(pl>=s.lvl) r = s; }); return r; }
function castraApplyCampSize(){
  if(typeof CASTRA==="undefined" || !CASTRA || !CASTRA.b) return false;
  const pl = (CASTRA.b.praetorium && CASTRA.b.praetorium.lvl) || 1, s = castraCampSizeFor(pl), T = CASTRA_MAP;
  const changed = T.cols!==s.cols || T.rows!==s.rows;
  T.cols = s.cols; T.rows = s.rows;
  const g = T.gates.find(x=>x.id==="praetoria"); if(g) g.tiles = [ { x:s.cols-1, y:5 }, { x:s.cols-1, y:6 } ];
  if(changed) CASTRA_BUILT = null;
  return changed;
}
const _castraLoadPlan0 = castraLoad;
castraLoad = function(){ const r = _castraLoadPlan0.apply(this, arguments); castraApplyCampSize(); return r; };
// Na een voltooide bouw van het Praetorium kan het kamp groeien.
function castraCampGrowCheck(){
  if(!castraApplyCampSize()) return;
  if(document.getElementById("castraMap")){ castraRenderMap(); if(typeof castraFit==="function") castraFit(); castraRenderRes(); toast("🏕️ Je kamp is groter geworden!", "Er is nieuwe ruimte rechts en onderaan."); }
}
const _castraBuildDonePlan0 = castraBuildDone;
castraBuildDone = function(id){ const r = _castraBuildDonePlan0.apply(this, arguments); if(id==="praetorium") castraCampGrowCheck(); return r; };

/* ---------- plaatsregels ---------- */
// Is vanaf de ingang bovenin alles nog bereikbaar? blocked = geblokkeerde cellen ("x,y"), foot = cellen van het gebouw dat erbij komt.
function castraPathsOk(blocked, extra){
  const T = CASTRA_MAP, cols = T.cols, rows = T.rows, key = (x,y)=>x+","+y;
  const isB = (x,y)=> x<0||y<0||x>=cols||y>=rows || blocked[key(x,y)] || (extra && extra[key(x,y)]);
  const g0 = T.gates[0].tiles[0], start = [g0.x, g0.y+1];
  if(isB(start[0], start[1])) return false;
  const seen = {}, q = [start]; seen[key(start[0], start[1])] = 1;
  while(q.length){ const [x,y] = q.shift(); [[1,0],[-1,0],[0,1],[0,-1]].forEach(([dx,dy])=>{ const nx = x+dx, ny = y+dy, k = key(nx,ny); if(!seen[k] && !isB(nx,ny)){ seen[k] = 1; q.push([nx,ny]); } }); }
  const g1 = T.gates[1].tiles[0]; if(!seen[key(g1.x-1, g1.y)]) return false;                     // de oostpoort
  if(typeof CASTRA_UI!=="undefined" && CASTRA_UI && !seen[key(CASTRA_UI.px, CASTRA_UI.py)]) return false;   // jijzelf
  // elk gebouw moet vanaf minstens één kant bereikbaar zijn
  const ok = CASTRA_BUILDINGS.every(b=>{
    const S = castraSlot(b); if(!(b.phase===1 && S)) return true; const f = castraBuildingFoot(b); let reach = false;
    for(let dx=-1; dx<=f.fw && !reach; dx++) for(let dy=-1; dy<=f.fh && !reach; dy++){
      const inside = dx>=0 && dx<f.fw && dy>=0 && dy<f.fh, corner = (dx<0||dx>=f.fw) && (dy<0||dy>=f.fh);
      if(inside || corner) continue;
      if(seen[key(S.x+dx, S.y+dy)]) reach = true;
    }
    return reach;
  });
  return ok;
}
// Het gebouw dat geplaatst wordt, met de nieuwe plek erbij gerekend, moet zelf ook bereikbaar zijn.
function castraPlanCheck(id, x, y){
  const b = castraBuilding(id), f = castraBuildingFoot(b), T = CASTRA_MAP, B = castraBuiltMap();
  const blocked = Object.assign({}, B.blocked), extra = {};
  if(CASTRA_PLAN.move) Object.keys(blocked).forEach(k=>{ if(blocked[k]===id) delete blocked[k]; });
  for(let dy=0; dy<f.fh; dy++) for(let dx=0; dx<f.fw; dx++){
    const cx = x+dx, cy = y+dy, k = cx+","+cy;
    if(cx<1 || cy<1 || cx>=T.cols-1 || cy>=T.rows-1) return { ok:false, why:"Dit valt buiten de kampmuur." };
    if(B.def.ground[cy][cx]!=="grass") return { ok:false, why:"Hier loopt een pad of staat een plein: kies gras." };
    if(blocked[k]) return { ok:false, why:"Hier staat al iets." };
    if(typeof castraDecorList==="function" && castraDecorList().some(d=>d[1]===cx && cy>=d[2] && cy<d[2]+castraDecorHeight(d[0]))) return { ok:false, why:"Hier staat een voorwerp van jou: haal dat eerst weg." };
    if(CASTRA_UI && CASTRA_UI.px===cx && CASTRA_UI.py===cy) return { ok:false, why:"Hier sta jij." };
    if(T.gates.some(g=>g.tiles.some(t=>Math.abs(t.x-cx)<=1 && Math.abs(t.y-cy)<=1))) return { ok:false, why:"Houd de poorten vrij." };
    extra[k] = 1;
  }
  // de nieuwe plek tijdelijk invullen en kijken of alles bereikbaar blijft (eigen oude plek telt niet mee bij verplaatsen)
  const save = CASTRA.slots; CASTRA.slots = Object.assign({}, CASTRA.slots || {}, { [id]:{ x, y } });
  let paths; try{ paths = castraPathsOk(blocked, extra); } finally { CASTRA.slots = save; }
  if(!paths) return { ok:false, why:"Zo zou je een pad of een gebouw afsluiten. Laat ruimte vrij." };
  return { ok:true, why:"" };
}

/* ---------- bouwlijst en plaatsingsmodus ---------- */
function castraPlanUnplaced(){ return CASTRA_BUILDINGS.filter(b=>b.phase===1 && !b.fixed && !castraSlot(b)); }
function castraPlanNeedLvl(id){ return CASTRA_BUILD_NEED[id] || 1; }
function castraPlanLevelOk(id){ return typeof castraPLevel!=="function" || (CASTRA.tut && CASTRA.tut.step<0) || castraPLevel() >= castraPlanNeedLvl(id); }
function castraPlanCostTxt(id){ const c = castraUpgradeCost(id); return Object.keys(c).map(r=>castraRes(r).icon+" "+c[r]).join(" ") + " · ⏱ " + castraFmtLeft(castraBuildMs(1)); }

function castraPlanPanel(){
  const box = document.getElementById("cgPlan"); if(!box) return;
  const P = CASTRA_PLAN, btns = ["cgBuildBtn","cgDecorBtn"].map(i=>document.getElementById(i));
  if(!P.on && !P.list){ box.style.display = "none"; box.innerHTML = ""; btns.forEach(b=>{ if(b) b.style.display = (CASTRA.tut && CASTRA.tut.step<0 && b.id==="cgDecorBtn") ? "none" : "block"; }); return; }
  btns.forEach(b=>{ if(b) b.style.display = "none"; });
  box.style.display = "block";
  if(P.on){
    const b = P.id ? castraBuilding(P.id) : null, chk = (P.id && P.x!=null) ? castraPlanCheck(P.id, P.x, P.y) : null;
    const head = P.pick ? `✥ Kies een gebouw op de kaart om te verplaatsen` : `${b.icon||""} ${esc(b.nm)} <small>${P.move?"verplaatsen":esc(b.nl||"")}</small>`;
    const cost = (!P.move && !P.tut && b) ? `<span>${castraPlanCostTxt(P.id)}</span>` : "";
    box.innerHTML = `<div class="dh"><b>${head}</b> ${cost}<button class="btn" onclick="castraPlanCancel()">${P.tut?"":"Annuleren"}</button></div>
      <div class="dn" style="display:block">${P.pick ? "Tik op het gebouw dat je wilt verplaatsen." : chk ? (chk.ok ? "✔ Hier kan het. Tik ergens anders om te veranderen, of bevestig." : "✖ "+esc(chk.why)) : "Tik op het vak waar de <b>ingang</b> (de onderkant) van het gebouw moet komen."}</div>
      ${P.pick ? "" : `<div class="dh" style="margin-top:6px"><button class="btn btn-gold" ${chk&&chk.ok?"":"disabled"} onclick="castraPlanConfirm()">${P.move?"Zet hier neer":"Bouw hier"}</button></div>`}`;
    if(P.tut) box.querySelectorAll(".dh .btn").forEach((e,i)=>{ if(i===0) e.style.display = "none"; });
    return;
  }
  // de lijst
  const rows = castraPlanUnplaced().map(b=>{
    const lvlOk = castraPlanLevelOk(b.id), pay = castraCanPay(castraUpgradeCost(b.id)) || (CASTRA.tut && CASTRA.tut.step<0);
    const lock = !lvlOk ? `🔒 vanaf niveau ${castraPlanNeedLvl(b.id)}` : (CASTRA.tut && CASTRA.tut.step<0 ? "gratis" : castraPlanCostTxt(b.id));
    const tutHide = CASTRA.tut && CASTRA.tut.step<0 && CASTRA_TUT_BUILDINGS.indexOf(b.id)<0;
    if(tutHide) return "";
    return `<button class="di" ${lvlOk?"":"disabled"} onclick="castraPlanStart('${b.id}')" style="min-width:104px"><span class="ic">${b.icon||"🏠"}</span><span class="nm">${esc(b.nm)}</span><span class="pr${pay?"":" no"}" style="white-space:normal;text-align:center">${esc(b.nl||"")}<br>${lock}</span></button>`;
  }).join("");
  box.innerHTML = `<div class="dh"><b>🔨 Bouwen</b><button class="btn" onclick="castraPlanClose()">Sluiten</button></div>
    <div class="dl">${rows || '<div class="dn" style="display:block">Alles staat al in je kamp. Tik op een gebouw om het te verbeteren.</div>'}</div>
    ${CASTRA.tut && CASTRA.tut.step<0 ? "" : `<div class="dh" style="margin-top:6px"><button class="btn" onclick="castraPlanMovePick()">✥ Verplaats een gebouw</button></div>`}`;
}
function castraPlanOpenList(){ CASTRA_PLAN.list = true; CASTRA_PLAN.on = false; if(typeof castraDecorToggle==="function") castraDecorToggle(false); castraPlanPanel(); }
function castraPlanClose(){ CASTRA_PLAN.list = false; castraPlanPanel(); }
function castraPlanStart(id, opts){
  opts = opts || {};
  Object.assign(CASTRA_PLAN, { on:true, list:false, id, x:null, y:null, move:!!opts.move, pick:false, tut:!!opts.tut || !!(CASTRA.tut && CASTRA.tut.step<0) });
  castraPlanGhost(); castraPlanPanel();
}
function castraPlanMovePick(){ Object.assign(CASTRA_PLAN, { on:true, list:false, id:null, x:null, y:null, move:true, pick:true, tut:false }); castraPlanGhost(); castraPlanPanel(); }
function castraPlanCancel(){ Object.assign(CASTRA_PLAN, { on:false, list:false, id:null, x:null, y:null, move:false, pick:false }); castraPlanGhost(); castraPlanPanel(); }

// Kader op de kaart: groen = mag, rood = mag niet
function castraPlanGhost(){
  const map = document.getElementById("castraMap"); if(!map) return;
  let g = document.getElementById("cgGhost"), P = CASTRA_PLAN;
  if(!P.on || P.pick || !P.id || P.x==null){ if(g) g.remove(); return; }
  const f = castraPlanFoot(P.id), T = CASTRA_MAP.tile, chk = castraPlanCheck(P.id, P.x, P.y);
  if(!g){ g = document.createElement("div"); g.id = "cgGhost"; map.appendChild(g); }
  g.style.cssText = `position:absolute;z-index:9;pointer-events:none;box-sizing:border-box;left:${P.x*T}px;top:${P.y*T}px;width:${f.fw*T}px;height:${f.fh*T}px;border:3px dashed ${chk.ok?"#5ee06a":"#ff6a5a"};background:${chk.ok?"rgba(94,224,106,.28)":"rgba(255,106,90,.3)"};border-radius:6px`;
}
function castraPlanFoot(id){ return castraBuildingFoot(castraBuilding(id)); }
function castraPlanTap(e){
  const map = document.getElementById("castraMap"); if(!map) return false;
  const r = map.getBoundingClientRect(), s = CASTRA_UI.scale||1, t = CASTRA_MAP.tile;
  const tx = Math.floor((e.clientX-r.left)/s/t), ty = Math.floor((e.clientY-r.top)/s/t), P = CASTRA_PLAN;
  if(P.pick){
    const b = castraBuildingAt(tx, ty);
    if(!b || b.fixed){ toast("✥ Verplaatsen", b ? "Dit gebouw staat vast." : "Tik op een gebouw."); return true; }
    P.pick = false; P.id = b.id; P.x = null; castraPlanGhost(); castraPlanPanel(); return true;
  }
  const f = castraPlanFoot(P.id);
  P.x = tx - Math.floor(f.fw/2); P.y = ty - f.fh + 1;
  castraPlanGhost(); castraPlanPanel(); return true;
}
const _castraMapTapPlan0 = castraMapTap;
castraMapTap = function(e){ if(CASTRA_PLAN.on && document.getElementById("cgPlan") && castraPlanTap(e)) return; return _castraMapTapPlan0.apply(this, arguments); };

function castraPlanConfirm(){
  const P = CASTRA_PLAN; if(!P.on || !P.id || P.x==null) return;
  const chk = castraPlanCheck(P.id, P.x, P.y); if(!chk.ok){ toast("🔨 Bouwen", chk.why); return; }
  const id = P.id, tut = P.tut, was = castraSlot(castraBuilding(id));
  if(!CASTRA.slots) CASTRA.slots = {};
  CASTRA.slots[id] = { x:P.x, y:P.y };
  if(!P.move){
    if(id==="praetorium" && castraLvl(id)===0 && tut){ CASTRA.b[id].lvl = 1; CASTRA.b[id].t = castraNow(); }     // het eerste gebouw staat meteen
    else if(!castraUpgrade(id)){ if(was) CASTRA.slots[id] = was; else delete CASTRA.slots[id];
      toast("🔨 Bouwen", castraBuildActive().length >= castraBuilders() ? "Alle bouwers zijn bezig." : "Je hebt niet genoeg grondstoffen."); castraPlanPanel(); return; }
  }
  castraSave(); castraPlanCancel(); CASTRA_BUILT = null; castraRenderMap(); castraRenderRes();
  if(typeof castraTutPlaced==="function") castraTutPlaced(id);
  else if(!tut) castraToastLa("melioratum", castraBuilding(id).nm);
}

/* ---------- nieuw kamp: leeg beginnen (tutorial) ---------- */
function castraStartEmptyCamp(){
  CASTRA.camp2 = true; CASTRA.slots = {};
  CASTRA_BUILDINGS.filter(b=>b.phase===1 && !b.fixed).forEach(b=>{ CASTRA.b[b.id] = { lvl:0, t:castraNow() }; });
  CASTRA_BUILT = null; castraApplyCampSize();
}

/* ---------- knoppen ---------- */
function castraPlanBuild(main){
  if(!main || document.getElementById("cgPlan")) return;
  const b = document.createElement("button"); b.id = "cgBuildBtn"; b.textContent = "🔨"; b.setAttribute("aria-label","Bouwen"); b.title = "Bouwen";
  b.style.cssText = "position:absolute;z-index:57;left:8px;bottom:62px;min-width:46px;min-height:46px;font-size:22px;line-height:1;cursor:pointer;border:2px solid var(--hi,#d4af37);border-radius:12px;background:rgba(27,20,12,.88);color:var(--hi-bright,#e8c96a)";
  b.onclick = ev=>{ ev.stopPropagation(); castraPlanOpenList(); }; b.onpointerdown = ev=>ev.stopPropagation();
  const p = document.createElement("div"); p.id = "cgPlan"; p.style.display = "none";
  p.style.cssText += ";position:absolute;z-index:73;left:6px;right:6px;bottom:6px;max-width:760px;margin:0 auto;box-sizing:border-box;padding:6px 8px;background:rgba(27,20,12,.95);border:2px solid var(--hi,#d4af37);border-radius:12px;color:#f0e2b8;display:none";
  p.onpointerdown = ev=>ev.stopPropagation();
  p.className = "cgDecorLike"; main.appendChild(b); main.appendChild(p);
  Object.assign(CASTRA_PLAN, { on:false, list:false, id:null, x:null, y:null, move:false, pick:false });
  if(typeof castraDecorBuild==="function") castraPlanPanel();
}

/* ---------- live meebewegende omtrek (muis) ----------
   Is een gebouw gekozen om te plaatsen of te verplaatsen, dan volgt het groene/rode kader de muis (alleen bij een muis, niet bij aanraking).
   Een klik op de kaart zet het kader vast (zodat het niet wegschuift terwijl je naar "Bouw hier" beweegt); nog een klik verplaatst het, zoals
   altijd. Opnieuw kiezen, annuleren of bevestigen maakt de omtrek weer "los". */
let CASTRA_PLAN_LOCK = false;
function castraPlanHover(e){
  const P = CASTRA_PLAN;
  if(!P.on || P.pick || !P.id || CASTRA_PLAN_LOCK) return;
  if(e.pointerType && e.pointerType!=="mouse") return;
  const map = document.getElementById("castraMap");
  if(!map || !document.getElementById("cgPlan") || !map.contains(e.target)) return;
  const r = map.getBoundingClientRect(), sc = (typeof CASTRA_UI!=="undefined" && CASTRA_UI && CASTRA_UI.scale) || 1, t = CASTRA_MAP.tile;
  const tx = Math.floor((e.clientX-r.left)/sc/t), ty = Math.floor((e.clientY-r.top)/sc/t);
  if(tx<0 || ty<0 || tx>=CASTRA_MAP.cols || ty>=CASTRA_MAP.rows) return;
  const f = castraPlanFoot(P.id), nx = tx - Math.floor(f.fw/2), ny = ty - f.fh + 1;
  if(nx===P.x && ny===P.y) return;
  P.x = nx; P.y = ny; castraPlanGhost(); castraPlanPanel();
}
document.addEventListener("pointermove", castraPlanHover, { passive:true });
{
  const unlock = name=>{ const f0 = window[name]; if(typeof f0!=="function") return; window[name] = function(){ CASTRA_PLAN_LOCK = false; return f0.apply(this, arguments); }; };
  unlock("castraPlanStart"); unlock("castraPlanMovePick"); unlock("castraPlanCancel"); unlock("castraPlanConfirm");
  const tap0 = castraPlanTap;
  castraPlanTap = function(e){ const had = CASTRA_PLAN.pick; const r = tap0.apply(this, arguments); if(!had && CASTRA_PLAN.id && CASTRA_PLAN.x!=null) CASTRA_PLAN_LOCK = true; else if(had) CASTRA_PLAN_LOCK = false; return r; };
}
