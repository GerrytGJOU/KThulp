/* ============================================================================
   CASTRA HEROUM — VALETUDINARIUM (herstel) EN DILECTUS (werving)
   ----------------------------------------------------------------------------
   Valetudinarium: soldaten die in een gevecht gewond raken kunnen een tijd niet
   vechten. Een hoger level herstelt sneller (CASTRA_MED.healPerLvl % korter),
   en tegen betaling (aes) geneest een soldaat meteen: een sink voor grondstoffen.
   Wonden in het proelium: elke doorgebroken vijand verwondt één soldaat van de
   voorste linie (helden en de dux niet); bij verlies raken alle ingezette soldaten gewond.

   Dilectus: een wervingskantoor met een wisselend aanbod (elke CASTRA_MED.refreshHours
   uur). De trainer beoordeelt elke rekruut in een korte Latijnse zin over zijn
   aanleg (bv. "Hic eques impetu excellit, sed tardus est."): wie leest, kiest de
   beste. Hoger level = meer kandidaten en betere kans op goede aanleg.
   Vervangt de testwerving in de contubernia.
   Opslag: CASTRA.dilectus = { until, cands:[soldaat…] }, soldaat.hurtUntil.
   Laadt NA castra-campus.js (castraDay/castraLevelUp) en castra-venatio.js (castraIsHurt).
   ============================================================================ */

const CASTRA_MED = {
  healPerLvl:15,                 // % sneller herstel per valetudinarium-level (max 75%)
  cureCost:{ aes:10 },           // direct genezen
  hurtLoseMin:10, hurtLeakMin:4, // gewond na verlies / per doorbraak (basis, minuten)
  refreshHours:8, candsBase:2,   // aanbod: 2 + dilectus-level kandidaten
  hireCost:{ frumentum:40, aes:20 },
};

/* ---------- gewonden ---------- */
// Duur (ms) na valetudinarium-korting.
function castraHurtMs(baseMin){
  const pct = Math.min(75, CASTRA_MED.healPerLvl*castraLvl("valetudinarium"));
  return Math.max(30000, Math.round(baseMin*60000*(100-pct)/100));
}
function castraHurtSoldier(s, baseMin){ s.hurtUntil = castraNow() + castraHurtMs(baseMin); }
// Na een proelium: de voorste soldaten (dichtst bij het einde van het pad) raken gewond.
function castraBattleWounds(sim, lost){
  const end = sim.path.pts[sim.path.pts.length-1];
  const front = sim.towers.filter(t=>CASTRA.soldiers.some(s=>s.id===t.sid))
    .sort((a,b)=>((a.cx-end[0])**2+(a.cy-end[1])**2)-((b.cx-end[0])**2+(b.cy-end[1])**2));
  const n = lost ? front.length : Math.min(sim.leaked, front.length);
  const hurt = [];
  for(let i=0;i<n;i++){
    const s = CASTRA.soldiers.find(x=>x.id===front[i].sid); if(!s) continue;
    castraHurtSoldier(s, lost ? CASTRA_MED.hurtLoseMin : CASTRA_MED.hurtLeakMin); hurt.push(s);
  }
  if(hurt.length) castraSave();
  return hurt;
}
function castraCure(sid){
  const s = CASTRA.soldiers.find(x=>x.id===sid); if(!s || !castraIsHurt(s)) return "?";
  if(!castraCanPay(CASTRA_MED.cureCost)) return "aes_deest";
  castraPay(CASTRA_MED.cureCost); s.hurtUntil = 0; castraSave(); return null;
}
function castraValetudinariumOpen(){
  CASTRA_UI.panel = "valetudinarium";
  const b = castraBuilding("valetudinarium"), lvl = castraLvl("valetudinarium"), maxL = castraMaxLvl("valetudinarium"), cost = castraUpgradeCost("valetudinarium");
  const costTxt = Object.keys(cost).map(r=>`${castraRes(r).icon} ${cost[r]}`).join("  ");
  const hurt = CASTRA.soldiers.filter(castraIsHurt);
  const pct = Math.min(75, CASTRA_MED.healPerLvl*lvl);
  const rows = hurt.map(s=>`<div style="padding:6px 0;border-top:1px solid #4a3d2c">🩹 <b>${esc(castraSoldierName(s))}</b> · ${castraLaText("gradus")} ${s.lvl} · ${castraHurtMin(s)} min
      <button class="btn btn-gold" style="float:right" ${castraCanPay(CASTRA_MED.cureCost)?"":"disabled"} onclick="castraDoCure('${s.id}')">${castraLaText("cura")} ${castraRes("aes").icon} ${CASTRA_MED.cureCost.aes}</button></div>`).join("")
    || `<div class="note">${castraLa("nulli_vulnerati")}</div>`;
  const up = lvl>=maxL ? `<div class="note">${castraLa(lvl>=b.maxLvl?"gradus_max":"praetorium_prius")}</div>`
    : `<button class="btn" ${castraCanPay(cost)?"":"disabled"} onclick="castraDoUpgrade('valetudinarium')">${castraLaText("meliora")} → ${castraLaText("gradus")} ${lvl+1} — ${costTxt}</button>`;
  castraOpenPanel(`<div class="panel"><h3>${b.icon} ${esc(b.nm)} <small>${castraLaText("gradus")} ${lvl}</small></h3>
    <div style="font-style:italic;margin-bottom:6px">${castraLaHTML(b.lat||"", b.desc||"", "bld_valetudinarium")}</div>
    <div class="note">${castraLaText("celerius")}: −${pct}%</div>${rows}
    <div style="margin-top:8px">${up}</div>
    <div style="margin-top:8px"><button class="btn" onclick="castraClosePanel()">${castraLaText("claude")}</button></div></div>`);
}
function castraDoCure(sid){ const e = castraCure(sid); if(e) castraToastLa(e); castraRenderRes(); castraValetudinariumOpen(); }

/* ---------- Dilectus ---------- */
const CASTRA_STAT_ABL = { vita:"vita", impetus:"impetu", tutela:"tutela", celeritas:"celeritate", ambitus:"ambitu" };
const CASTRA_STAT_WEAK = { vita:["infirmus","zwak"], impetus:["debilis","krachteloos"], tutela:["nudus","onbeschermd"], celeritas:["tardus","traag"], ambitus:["brevis","kort van bereik"] };
const CASTRA_STAT_ABL_NL = { vita:"levenskracht", impetus:"kracht", tutela:"bescherming", celeritas:"snelheid", ambitus:"bereik" };
// Latijnse beoordeling uit de aanleg: beste en zwakste waarde.
function castraAppraisal(s){
  const t = CASTRA_TYPE_LA[castraLine(s.line).type];
  let best = null, worst = null;
  CASTRA_STATS.forEach(st=>{ const v = s.indoles[st.id]||0; if(!best || v>best.v) best = { id:st.id, v }; if(!worst || v<worst.v) worst = { id:st.id, v }; });
  const strong = best.id, weak = worst.id;
  const la = `Hic ${t.sg} ${CASTRA_STAT_ABL[strong]} excellit, sed ${CASTRA_STAT_WEAK[weak][0]} est.`;
  const nl = `Deze ${t.nl_sg} blinkt uit in ${CASTRA_STAT_ABL_NL[strong]}, maar is ${CASTRA_STAT_WEAK[weak][1]}.`;
  return { la, nl, strong, weak };
}
function castraDilectusPool(){
  const lines = CASTRA_LINES.filter(l=>["legioen","rangen","licht","ruiterij","vaandel","zorg","vloot"].includes(l.id));
  if(castraRegionOpen("graecia")) lines.push(...CASTRA_LINES.filter(l=>["phalanx","psili","kreta","macedonie"].includes(l.id)));
  if(castraRegionOpen("troia")) lines.push(...CASTRA_LINES.filter(l=>["saters","nimfen"].includes(l.id)));
  return lines;
}
function castraDilectusRefresh(force){
  const D = CASTRA.dilectus;
  if(!force && D && D.until > castraNow()) return D;
  const lvl = castraLvl("dilectus"), n = CASTRA_MED.candsBase + lvl, pool = castraDilectusPool();
  const rng = castraRng((CASTRA.seed ^ (Math.floor(castraNow()/3600000)*2654435761))>>>0); CASTRA.seed = (CASTRA.seed+5)>>>0;
  const cands = [];
  for(let i=0;i<n;i++){
    const line = pool[Math.floor(rng()*pool.length)];
    let best = null;
    // hoger level = meer pogingen, de beste aanleg blijft staan
    for(let k=0;k<1+Math.floor((lvl-1)/2);k++){
      const s = castraRollSoldier(line.id, 0); const sum = Object.values(s.indoles).reduce((a,b)=>a+b,0);
      if(!best || sum > best.sum) best = { s, sum };
    }
    cands.push(best.s);
  }
  CASTRA.dilectus = { until: castraNow() + CASTRA_MED.refreshHours*3600000, cands };
  castraSave();
  return CASTRA.dilectus;
}
function castraHire(sid){
  const D = CASTRA.dilectus; if(!D) return "?";
  const i = D.cands.findIndex(c=>c.id===sid); if(i<0) return "?";
  if(CASTRA.soldiers.length >= castraBarracksCap()) return "castra_plena";
  if(!castraCanPay(CASTRA_MED.hireCost)) return "frumentum_deest";
  castraPay(CASTRA_MED.hireCost);
  CASTRA.soldiers.push(D.cands.splice(i,1)[0]); castraSave(); return null;
}
function castraDilectusOpen(){
  CASTRA_UI.panel = "dilectus";
  const b = castraBuilding("dilectus"), lvl = castraLvl("dilectus"), maxL = castraMaxLvl("dilectus"), cost = castraUpgradeCost("dilectus");
  const costTxt = Object.keys(cost).map(r=>`${castraRes(r).icon} ${cost[r]}`).join("  ");
  const D = castraDilectusRefresh(false), left = Math.max(0, Math.ceil((D.until-castraNow())/60000));
  const hireTxt = Object.keys(CASTRA_MED.hireCost).map(r=>castraRes(r).icon+" "+CASTRA_MED.hireCost[r]).join(" ");
  const cards = D.cands.map(s=>{
    const ap = castraAppraisal(s), ing = CASTRA_INGENIA.find(i=>i.id===s.ingenium), t = CASTRA_TYPE_LA[castraLine(s.line).type];
    return `<div style="padding:8px 0;border-top:1px solid #4a3d2c">
      <div style="font-size:17px">${s.insignis?"✨ ":""}<b>${esc(castraSoldierName(s))}</b> <small>(${esc(t.sg)})</small> · <i>${esc(ing?ing.nm:"")}</i></div>
      <div style="font-size:16px;margin:4px 0">${castraLaHTML(ap.la, ap.nl, "apr_"+ap.strong+"_"+ap.weak)}</div>
      <button class="btn btn-gold" onclick="castraDoHire('${s.id}')">${castraLaText("conscribe_hunc")} (${hireTxt})</button></div>`;
  }).join("") || `<div class="note">${castraLa("nulli_candidati")}</div>`;
  const up = lvl>=maxL ? `<div class="note">${castraLa(lvl>=b.maxLvl?"gradus_max":"praetorium_prius")}</div>`
    : `<button class="btn" ${castraCanPay(cost)?"":"disabled"} onclick="castraDoUpgrade('dilectus')">${castraLaText("meliora")} → ${castraLaText("gradus")} ${lvl+1} — ${costTxt}</button>`;
  castraOpenPanel(`<div class="panel"><h3>${b.icon} ${esc(b.nm)} <small>${castraLaText("gradus")} ${lvl}</small></h3>
    <div style="font-style:italic;margin-bottom:6px">${castraLaHTML(b.lat||"", b.desc||"", "bld_dilectus")}</div>
    <div class="note">${castraLaText("milites")}: ${CASTRA.soldiers.length} / ${castraBarracksCap()} · ↻ ${Math.floor(left/60)}h ${left%60}m</div>${cards}
    <div style="margin-top:8px">${up}</div>
    <div style="margin-top:8px"><button class="btn" onclick="castraClosePanel()">${castraLaText("claude")}</button></div></div>`);
}
function castraDoHire(sid){
  const e = castraHire(sid); if(e) castraToastLa(e); else toast("Miles novus!", castraLaText("adiungit"));
  castraRenderRes(); castraDilectusOpen();
}
