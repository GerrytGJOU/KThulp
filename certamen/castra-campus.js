/* ============================================================================
   CASTRA HEROUM — CAMPUS (trainen en evolueren) + missio honesta
   ----------------------------------------------------------------------------
   Ontwerp: CASTRA_HEROUM.md (Campus). Bijtrainen is bewust zwakker dan vechten:
   de echte XP komt uit de venatio. Evolueren vraagt een soldaat-level én een
   campus-level (CASTRA_BAL.evo). Vertakkingen (Arena, Nimfen) kiest de speler.
   Laadt NA castra.js en castra-venatio.js.
   ============================================================================ */

function castraDay(){ return new Date().toISOString().slice(0,10); }
function castraTrainToday(){
  const t = CASTRA.train || (CASTRA.train = { day:castraDay(), n:0 });
  if(t.day !== castraDay()){ t.day = castraDay(); t.n = 0; }
  return t;
}
function castraTrainXp(){ const T = CASTRA_BAL.train; return T.xpBase + T.xpPerCampusLvl*castraLvl("campus"); }
function castraLevelUp(s){
  const maxL = CASTRA_V_BAL.soldierMaxLvlPerPraetorium*castraLvl("praetorium"); let up = false;
  while(s.lvl<maxL && s.xp >= CASTRA_V_BAL.xpPerLvl*s.lvl){ s.xp -= CASTRA_V_BAL.xpPerLvl*s.lvl; s.lvl++; up = true; }
  return up;
}
function castraTrainingNow(){ return CASTRA.soldiers.filter(s=>s.trainUntil); }

function castraTrainStart(sid){
  const s = CASTRA.soldiers.find(x=>x.id===sid); if(!s) return "?";
  if(s.trainUntil) return null;
  if(castraTrainingNow().length >= castraLvl("campus")) return "loca_plena";
  if(castraTrainToday().n >= CASTRA_BAL.train.perDay) return "satis_exercitati";
  if(!castraCanPay(CASTRA_BAL.train.cost)) return "frumentum_deest";
  castraPay(CASTRA_BAL.train.cost);
  s.trainUntil = castraNow() + CASTRA_BAL.train.minutes*60000;
  castraTrainToday().n++; castraSave(); return null;
}
function castraTrainCollect(sid){
  const s = CASTRA.soldiers.find(x=>x.id===sid);
  if(!s || !s.trainUntil || s.trainUntil > castraNow()) return false;
  s.trainUntil = 0; s.xp += castraTrainXp(); castraLevelUp(s); castraSave(); return true;
}

// Welk volgend stadium kan deze soldaat nu in? (max = al op het hoogste stadium)
function castraEvoInfo(s){
  const line = castraLine(s.line), next = s.stage+1;
  if(next >= line.stages.length) return { max:true };
  const req = CASTRA_BAL.evo[s.stage] || CASTRA_BAL.evo[CASTRA_BAL.evo.length-1];
  const ok = s.lvl >= req.lvl && castraLvl("campus") >= req.campus;
  return { max:false, req, ok, options: Array.isArray(line.stages[next]) ? line.stages[next] : null };
}
function castraEvolve(sid, branch){
  const s = CASTRA.soldiers.find(x=>x.id===sid); if(!s) return false;
  const info = castraEvoInfo(s); if(info.max || !info.ok) return false;
  s.stage++; s.branch = info.options ? (branch||0) : 0;
  castraSave(); return true;
}
function castraRelease(sid){
  const i = CASTRA.soldiers.findIndex(s=>s.id===sid); if(i<0) return false;
  const R = CASTRA_BAL.releaseRefund, cap = castraWalletCap();
  CASTRA.soldiers.splice(i,1);
  Object.keys(R).forEach(r=>{ CASTRA.res[r] = Math.min(cap, (CASTRA.res[r]||0)+R[r]); });
  castraSave(); return true;
}

function castraCampusOpen(){
  CASTRA_UI.panel = "campus";
  const lvl = castraLvl("campus"), maxL = castraMaxLvl("campus"), cost = castraUpgradeCost("campus");
  const costTxt = Object.keys(cost).map(r=>`${castraRes(r).icon} ${cost[r]}`).join("  ");
  const T = CASTRA_BAL.train, today = castraTrainToday(), training = castraTrainingNow().length;
  const rows = CASTRA.soldiers.map(s=>{
    const evo = castraEvoInfo(s), left = s.trainUntil ? Math.ceil((s.trainUntil-castraNow())/60000) : 0;
    let act;
    if(s.trainUntil) act = left>0 ? `<small>${castraLaText("exercetur")} (${left} min)</small>`
      : `<button class="btn btn-gold" onclick="castraDoCollectTrain('${s.id}')">${castraLaText("collige")}</button>`;
    else act = `<button class="btn" onclick="castraDoTrain('${s.id}')">${castraLaText("exerce")} <small>${castraRes("frumentum").icon} ${T.cost.frumentum}</small></button>`;
    let ev = "";
    if(!evo.max){
      const nxt = castraLine(s.line).stages[s.stage+1];
      const nm = Array.isArray(nxt) ? nxt.join(" / ") : nxt;
      ev = evo.ok
        ? (evo.options ? `<div><small>${castraLaText("elige_viam")}</small> ${evo.options.map((o,i)=>`<button class="btn btn-gold" onclick="castraDoEvolve('${s.id}',${i})">${esc(o)}</button>`).join(" ")}</div>`
                       : `<button class="btn btn-gold" onclick="castraDoEvolve('${s.id}',0)">${castraLaText("evolve")} → ${esc(nm)}</button>`)
        : `<small style="opacity:.75">→ ${esc(nm)}: miles ${castraLaText("gradus")} ${evo.req.lvl} + campus ${castraLaText("gradus")} ${evo.req.campus}</small>`;
    }
    return `<div style="padding:6px 0;border-top:1px solid #4a3d2c"><b>${s.insignis?"✨ ":""}${esc(castraSoldierName(s))}</b> · ${castraLaText("gradus")} ${s.lvl} <small>(XP ${s.xp}/${CASTRA_V_BAL.xpPerLvl*s.lvl})</small>
      <div style="margin-top:4px">${act}</div>${ev?`<div style="margin-top:4px">${ev}</div>`:""}</div>`;
  }).join("") || `<div class="note">${castraLa("nullus_exercitus")}</div>`;
  const up = lvl>=maxL ? `<div class="note">${castraLa(lvl>=castraBuilding("campus").maxLvl?"gradus_max":"praetorium_prius")}</div>`
    : `<button class="btn" ${castraCanPay(cost)?"":"disabled"} onclick="castraDoUpgrade('campus')">${castraLaText("meliora")} → ${castraLaText("gradus")} ${lvl+1} — ${costTxt}</button>`;
  castraOpenPanel(`<div class="panel"><h3>🏟️ ${castraLa("campus_titel")} <small>${castraLaText("gradus")} ${lvl}</small></h3>
    <div class="note">${castraLaText("loca")}: ${training} / ${lvl} · ${castraLaText("hodie")}: ${today.n} / ${T.perDay} · +${castraTrainXp()} XP</div>
    ${rows}<div style="margin-top:8px">${up}</div>
    <div style="margin-top:8px"><button class="btn" onclick="castraClosePanel()">${castraLaText("claude")}</button></div></div>`);
}
function castraDoTrain(sid){ const e = castraTrainStart(sid); if(e) castraToastLa(e); castraRenderRes(); castraCampusOpen(); }
function castraDoCollectTrain(sid){ if(castraTrainCollect(sid)) castraToastLa("exercitatio_finita", "+"+castraTrainXp()+" XP"); castraCampusOpen(); }
function castraDoEvolve(sid, b){ const s = CASTRA.soldiers.find(x=>x.id===sid); if(castraEvolve(sid,b)) castraToastLa("promotus", castraSoldierName(s)); castraCampusOpen(); }
function castraDoRelease(sid){
  const s = CASTRA.soldiers.find(x=>x.id===sid); if(!s) return;
  if(!confirm(CASTRA_LA.visne_dimittere.la+"\n("+CASTRA_LA.visne_dimittere.nl+")")) return;
  castraRelease(sid); castraRenderRes(); castraOpen("contubernia");
}
