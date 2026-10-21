/* ============================================================================
   CASTRA HEROUM — MEETPUNTEN VOOR DE TOWER DEFENCE (klastest)
   ----------------------------------------------------------------------------
   Anoniem en geaggregeerd per klas en maand, nooit per leerling (zelfde patroon als
   de vertaalhulp: classAnalyticsCastra). Alleen voor ingelogde leerlingen (BM_IDENT).
   Pad: classAnalyticsCastraTD/{klas}/{YYYY-MM}/{sleutel}/{veld} = teller
     m_<missie>  s gestart (eerste golf begonnen), w gewonnen, l verloren, a afgebroken,
                 t ticks van afgeronde gevechten (50 ms), c gebruikte bevelen,
                 v team anders dan de vorige poging, r zelfde team als de vorige poging
     e_<regel>   s, w   (gevechten met deze missieregel, waarvan gewonnen)
     r_<rol>     s, w   (gevechten met deze vijandrol)
     ty_<type>   n      (soldaten per type in de opstelling bij de eerste golf)
     y_<syn>     n      (gevechten waarin deze synergie actief was)
     cmd_<id>    n      (gegeven bevelen)
     d_<DD>      n      (spelers die die dag speelden; één keer per speler per dag)
     ret_<k>     n      (new = eerste speeldag, d1, d2_6, d7 = terugkeer na zoveel dagen)
   Lokaal houdt CASTRA.tdMeta alleen de vorige opstelling per missie en de speeldagen bij
   (nodig om "team veranderd" en terugkeer te bepalen). Laadt NA castra-roles.js.
   ============================================================================ */

function castraTDSync(u){
  try{
    if(typeof fbDB==="undefined" || !fbDB || typeof BM_IDENT==="undefined" || !BM_IDENT || !BM_IDENT.klascode) return;
    const base = "classAnalyticsCastraTD/"+BM_IDENT.klascode+"/"+new Date().toISOString().slice(0,7)+"/", upd = {};
    Object.keys(u).forEach(k=>{ if(u[k]) upd[base+k.replace(/[^a-z0-9_/]/g,"_")] = firebase.database.ServerValue.increment(u[k]); });
    if(Object.keys(upd).length) fbDB.ref().update(upd).catch(()=>{});
  }catch(e){}
}
function castraTDMeta(){ return CASTRA.tdMeta || (CASTRA.tdMeta = { last:{}, days:{} }); }
// Eén keer per dag per speler: spelers per dag en terugkeer (nieuw, na 1 dag, 2–6 dagen, 7+ dagen).
function castraTDDay(){
  const M = castraTDMeta(), day = new Date().toISOString().slice(0,10);
  if(M.days[day]) return;
  const prev = Object.keys(M.days).sort(), first = M.first || (M.first = day);
  M.days[day] = 1; if(prev.length>40) delete M.days[prev[0]];
  const gap = Math.round((Date.parse(day)-Date.parse(prev.length ? prev[prev.length-1] : day))/86400000);
  const u = {}; u["d_"+day.slice(8)+"/n"] = 1;
  u["ret_"+(!prev.length ? "new" : gap<=1 ? "d1" : gap<7 ? "d2_6" : "d7")+"/n"] = 1;
  castraTDSync(u); castraSave();
}
// Grove context zonder persoonsgegevens: schooltijd (ma–vr 8:00–17:00 lokale tijd) of daarbuiten (vermoedelijk thuis).
function castraTDCtx(){ const d = new Date(), h = d.getHours(), wd = d.getDay(); return (wd>=1 && wd<=5 && h>=8 && h<17) ? "school" : "home"; }
// Sessie: duur en activiteiten (aantal gevechten en jachten), verzonden als de pagina verborgen wordt of sluit.
const CASTRA_TD_SESS = { t0:0, battles:0, hunts:0 };
function castraTDSessTouch(){ if(!CASTRA_TD_SESS.t0) CASTRA_TD_SESS.t0 = Date.now(); }
function castraTDSessFlush(){
  const S = CASTRA_TD_SESS; if(!S.t0) return; const min = (Date.now()-S.t0)/60000; S.t0 = 0;
  if(min < 0.5 || (!S.battles && !S.hunts)){ S.battles = 0; S.hunts = 0; return; }
  const b = min<5 ? "m0_5" : min<15 ? "m5_15" : min<30 ? "m15_30" : "m30p", ctx = castraTDCtx(), u = {};
  u["sess_"+ctx+"_"+b+"/n"] = 1; if(S.battles) u["act_battle/n"] = S.battles; if(S.hunts) u["act_hunt/n"] = S.hunts;
  S.battles = 0; S.hunts = 0; castraTDSync(u);
}
document.addEventListener("visibilitychange", ()=>{ if(document.visibilityState==="hidden") castraTDSessFlush(); });
window.addEventListener("pagehide", castraTDSessFlush);
function castraTDBegin(B){
  const td = B.td, m = B.mission, M = castraTDMeta(), u = {};
  td.started = true;
  const sig = B.sim.towers.map(t=>t.sid||t.line).sort().join(",");
  const prev = M.last[m.id]; M.last[m.id] = sig;
  u["m_"+m.id+"/s"] = 1; u["ctx_"+castraTDCtx()+"/n"] = 1; castraTDSessTouch(); CASTRA_TD_SESS.battles++;
  if(prev!==undefined) u["m_"+m.id+(prev===sig ? "/r" : "/v")] = 1;
  B.sim.towers.forEach(t=>{ const k = "ty_"+(t.type||"inf")+"/n"; u[k] = (u[k]||0)+1; });
  (m.edicta||[]).forEach(id=>{ u["e_"+id+"/s"] = 1; });
  const roles = {}; m.waves.forEach(w=>w.forEach(g=>{ if(g.role) roles[g.role] = 1; })); Object.keys(roles).forEach(r=>{ u["r_"+r+"/s"] = 1; });
  td.roles = Object.keys(roles);
  (B.synOn||[]).forEach(k=>{ u["y_"+k+"/n"] = 1; });
  castraTDSync(u); castraSave();
}
// Bevelen: wanneer gegeven (levens van het kamp, afstand van de voorste vijand tot het kamp, golfnummer)
function castraTDCmdMeta(B, u){
  (B.cmdMeta||[]).forEach(c=>{
    const hb = c.hp<=3 ? "h1_3" : c.hp<=6 ? "h4_6" : "h7_10", db = c.dist<=3 ? "d0_3" : c.dist<=6 ? "d3_6" : "d6p";
    [ "cmdhp_"+c.id+"_"+hb, "cmdd_"+c.id+"_"+db, "cmdw_"+c.id+"_"+Math.min(c.wave,6) ].forEach(k=>{ u[k+"/n"] = (u[k+"/n"]||0)+1; });
  });
}
function castraTDEnd(B){
  const td = B.td; if(!td || !td.started || td.done) return; td.done = true;
  const m = B.mission, win = B.sim.over==="win", u = {};
  u["m_"+m.id+(win ? "/w" : "/l")] = 1; u["m_"+m.id+"/t"] = B.sim.tick; if(B.cmdUsed) u["m_"+m.id+"/c"] = B.cmdUsed;
  if(win){ (m.edicta||[]).forEach(id=>{ u["e_"+id+"/w"] = 1; }); td.roles.forEach(r=>{ u["r_"+r+"/w"] = 1; }); }
  Object.keys(B.cmdIds||{}).forEach(id=>{ u["cmd_"+id+"/n"] = B.cmdIds[id]; });
  castraTDCmdMeta(B, u);
  castraTDSync(u);
}
function castraTDAbort(B){
  const td = B.td; if(!td || !td.started || td.done) return; td.done = true;
  const u = { ["m_"+B.mission.id+"/a"]:1 }; castraTDCmdMeta(B, u); castraTDSync(u);
}
const _castraBStartTD0 = castraBStart;
castraBStart = function(id){
  _castraBStartTD0(id);
  if(CASTRA_B && !CASTRA_B.legio && !CASTRA_B.endless){ CASTRA_B.td = { started:false, done:false, roles:[] }; castraTDDay(); }
};
const _castraBStartWaveTD0 = castraBStartWave;
castraBStartWave = function(){
  const B = CASTRA_B; _castraBStartWaveTD0();
  if(B && B.td && !B.td.started && B.sim.waveActive) castraTDBegin(B);
};
const _castraBFinishTD0 = castraBFinish;
castraBFinish = function(){ const B = CASTRA_B; if(B && B.td) castraTDEnd(B); return _castraBFinishTD0(); };
const _castraBExitTD0 = castraBExit;
castraBExit = function(){ const B = CASTRA_B; if(B && B.td && !B.finished) castraTDAbort(B); return _castraBExitTD0(); };

// Jachten in de wereld tellen mee voor de sessie-activiteit.
if(typeof castraWorldEncounter==="function"){
  const _castraWorldEncounterTD0 = castraWorldEncounter;
  castraWorldEncounter = function(t){ castraTDSessTouch(); CASTRA_TD_SESS.hunts++; return _castraWorldEncounterTD0(t); };
}
