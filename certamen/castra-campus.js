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
function castraTrainXp(){ const T = CASTRA_BAL.train; return Math.floor((T.xpBase + T.xpPerCampusLvl*castraLvl("campus")) * (100+((typeof castraHeroBonus==="function")?castraHeroBonus("campus"):0))/100); }
function castraLevelUp(s){
  const maxL = castraSoldierCap(); let up = false;
  while(s.lvl<maxL && s.xp >= castraXpToNext(s.lvl)){ s.xp -= castraXpToNext(s.lvl); s.lvl++; up = true; }
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

// Evolutie (troepenbomen): level- en campus-eis, kosten, en per optie een eventueel ontbrekend gebouw.
function castraEvoInfo(s){
  const f = castraLine(s.line);
  if(!f.next.length) return { max:true };
  const need = castraEvoLevel(f), campusReq = CASTRA_EVO.campus[f.tier-1] || 5, cost = CASTRA_EVO.cost[f.tier-1] || CASTRA_EVO.cost[CASTRA_EVO.cost.length-1];
  const options = f.next.map(id=>{ const n = castraLine(id); return { id, f:n, missing: (n.needs && castraLvl(n.needs)<1) ? n.needs : null }; });
  return { max:false, need, campusReq, cost, lvlOk: s.lvl>=need && castraLvl("campus")>=campusReq, canPay:castraCanPay(cost), options };
}
function castraEvolve(sid, formId){
  const s = CASTRA.soldiers.find(x=>x.id===sid); if(!s) return false;
  const info = castraEvoInfo(s); if(info.max || !info.lvlOk || !info.canPay) return false;
  const opt = info.options.find(o=>o.id===formId); if(!opt || opt.missing) return false;
  castraPay(info.cost); s.line = formId; castraSave(); return true;       // de keuze is definitief
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
      const names = evo.options.map(o=>o.f.nm).join(" / ");
      if(!evo.lvlOk){
        ev = `<small style="opacity:.75">→ ${esc(names)}: miles ${castraLaText("gradus")} ${evo.need} + campus ${castraLaText("gradus")} ${evo.campusReq}</small>`;
      } else {
        const adv = castraAdvice(s), costTxt2 = Object.keys(evo.cost).map(r=>castraRes(r).icon+" "+evo.cost[r]).join(" ");
        ev = `<div style="font-size:15px;margin-bottom:4px">${adv?castraLaHTML(adv.la, adv.nl, "adv_"+s.line):""}</div>
          <div><small>${castraLaText("elige_viam")} · ${costTxt2}</small></div>` +
          evo.options.map(o=>{
            const st = castraStats({ ...s, line:o.id }), dis = !evo.canPay || o.missing;
            return `<div style="margin:3px 0"><button class="btn ${adv&&adv.pick===o.id?"btn-gold":""}" ${dis?"disabled":""} onclick="castraDoEvolve('${s.id}','${o.id}')">${castraLaText("evolve")} → ${esc(o.f.nm)}</button>
              <small>${esc(o.f.tak)} · ${esc((CASTRA_TYPE_LA[o.f.type]||{}).sg||"")} · ${CASTRA_STATS.map(x=>x.nm.slice(0,3)+" "+st[x.id]).join(" ")}</small>
              ${o.missing?`<small> · ${esc(castraBuilding(o.missing)?castraBuilding(o.missing).nm:o.missing)} ${castraLaText("deest")}</small>`:""}</div>`;
          }).join("");
      }
    }
    return `<div style="padding:6px 0;border-top:1px solid #4a3d2c"><b>${s.insignis?"✨ ":""}${esc(castraSoldierName(s))}</b> <small>(${esc(castraLine(s.line).tak)} · tier ${castraLine(s.line).tier})</small> · ${castraLaText("gradus")} ${s.lvl} <small>(XP ${s.xp}/${castraXpToNext(s.lvl)})</small>
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
function castraDoEvolve(sid, formId){ const s = CASTRA.soldiers.find(x=>x.id===sid); if(castraEvolve(sid,formId)) castraToastLa("promotus", castraSoldierName(s)); castraRenderRes(); castraCampusOpen(); }
function castraDoRelease(sid){
  const s = CASTRA.soldiers.find(x=>x.id===sid); if(!s) return;
  if(!confirm(CASTRA_LA.visne_dimittere.la+"\n("+CASTRA_LA.visne_dimittere.nl+")")) return;
  castraRelease(sid); castraRenderRes(); castraOpen("contubernia");
}
