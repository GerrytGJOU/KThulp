/* ============================================================================
   CASTRA HEROUM — COLOSSEUM, STAP C2: DUEL VIA FIREBASE
   ----------------------------------------------------------------------------
   Ontwerp: CASTRA_COLOSSEUM.md. Elke speler verdedigt zijn EIGEN baan (lokaal, geen netwerkvertraging); alleen
   het startmoment is gedeeld. Er is geen server: iedereen rekent de uitslag zelf na.
   - Lobby: castraColosseum/{klas}/{match} (mode, divisie, zaad, players). Bij inschrijven wordt de inzet (100 brons) lokaal
     afgeschreven; de laatste speler zet status "running" + startAt (servertijd + 10 s, zoals de Legio).
   - Run: een eenheid-momentopname per geplaatste soldaat (zie castra-colosseum.js); aan het eind (of bij opgeven) gaat
     runs/{lid} = {actions, res, ts} naar Firebase, eenmalig schrijfbaar. live/{lid} = {wave, lives} per golf.
   - Uitslag: elke client speelt alle runs na (castraColoStandings), de uitkomst van het naspelen telt. Zonder geldige run
     voor niemand: iedereen krijgt de inzet terug. Daarna betaalt elke client ZICHZELF uit (paid/{lid}, transactie tegen
     dubbel uitkeren). De som van de uitbetalingen is gelijk aan de som van de inzetten.
   - Wat er niet in zit: de aanvalsmodus (vijanden doorsturen) en de AI-tegenstander (C3).
   Laadt NA castra-colosseum.js en castra-legio.js (voor castraLegioDb).
   ============================================================================ */

let CASTRA_C = null;   // { klas, lid, nm, db, offset, lobby, matches, loaded, results, refs, timer }

/* ---------- toegang en administratie ---------- */
function castraCColo(){ return CASTRA.colo || (CASTRA.colo = { best:{}, runs:0 }); }
function castraCPend(){ const c = castraCColo(); return c.pending || (c.pending = {}); }
function castraCHist(){ const c = castraCColo(); return c.hist || (c.hist = []); }
function castraCNow(){ return Date.now() + ((CASTRA_C && CASTRA_C.offset) || 0); }
function castraCBase(mid){ return "castraColosseum/"+CASTRA_C.klas+(mid?"/"+mid:""); }
function castraCBusy(){ return Object.keys(castraCPend()).length>0; }

function castraCAttach(){
  if(!CASTRA) castraLoad();
  if(typeof castraAdoptIdentity==="function") castraAdoptIdentity();
  const id = (typeof BM_IDENT!=="undefined") ? BM_IDENT : null, db = (typeof castraLegioDb==="function") ? castraLegioDb() : null;
  if(!id || !id.klascode || !id.leerlingcode || !db) return false;
  if(CASTRA_C && CASTRA_C.klas===id.klascode && CASTRA_C.lid===id.leerlingcode) return true;
  castraCDetach();
  const C = CASTRA_C = { klas:id.klascode, lid:id.leerlingcode, nm:String(id.name||"?").slice(0,40), db, offset:0, lobby:{}, matches:{}, loaded:{}, results:{}, refs:[], timer:null };
  const on = (ref, evt, fn)=>{ ref.on(evt, fn); C.refs.push([ref, evt, fn]); };
  on(db.ref(".info/serverTimeOffset"), "value", s=>{ C.offset = s.val()||0; });
  on(db.ref(castraCBase()).orderByChild("status").equalTo("lobby"), "value", s=>{ C.lobby = s.val()||{}; castraCRefresh(); });
  Object.keys(castraCPend()).forEach(castraCWatch);
  C.timer = setInterval(castraCTick, 1000);
  return true;
}
function castraCDetach(){
  if(!CASTRA_C) return;
  clearInterval(CASTRA_C.timer);
  CASTRA_C.refs.forEach(([ref,evt,fn])=>{ try{ ref.off(evt, fn); }catch(e){} });
  CASTRA_C = null;
}
function castraCWatch(mid){
  const C = CASTRA_C; if(!C || C.matches.hasOwnProperty(mid)) return;
  C.matches[mid] = undefined;
  const ref = C.db.ref(castraCBase(mid)), fn = s=>{ C.matches[mid] = s.val(); C.loaded[mid] = true; castraCCheck(mid); castraCRefresh(); };
  ref.on("value", fn); C.refs.push([ref, "value", fn]);
}

/* ---------- inzet, terugbetaling, uitbetaling ---------- */
function castraCStake(mid, d){
  castraPay({ [CASTRA_COLO.res]: d.fee });
  castraCPend()[mid] = { klas:CASTRA_C.klas, fee:d.fee, mode:d.mode, div:d.divisie, t:Date.now(), run:null, sent:false, started:false };
  castraSave(); castraCWatch(mid);
}
function castraCLog(mid, o){
  const P = castraCPend()[mid]; const h = castraCHist(); h.unshift({ t:Date.now(), mid, mode:P&&P.mode, div:P&&P.div, fee:P&&P.fee, ...o }); h.length = Math.min(h.length, 20);
  delete castraCPend()[mid]; delete CASTRA_C.matches[mid]; castraSave();
}
function castraCRefund(mid, why){
  const P = castraCPend()[mid]; if(!P) return;
  CASTRA.res[CASTRA_COLO.res] = (CASTRA.res[CASTRA_COLO.res]||0) + P.fee;     // terugbetaling mag de opslagcapaciteit overschrijden (het is je eigen inzet)
  castraCLog(mid, { refund:true, pay:P.fee, why });
  toast("🪙 Inzet terug", why+" (+"+P.fee+" brons)");
  castraCRefresh();
}
function castraCSettle(mid){
  const C = CASTRA_C, P = castraCPend()[mid], d = C.matches[mid]; if(!P || P.busy || !d) return;
  P.busy = true; setTimeout(()=>{ if(castraCPend()[mid]) P.busy = false; }, 20000);   // vangnet als de transactie nooit terugkomt
  const st = castraColoStandings({ ...d, fee:d.fee }, d.runs||{}), me = st.rows.find(r=>r.lid===C.lid);
  C.results[mid] = { st, d, me };
  const done = (credited)=>{
    const rank = me ? me.rank : 0, pay = credited ? me.pay : 0;
    if(st.refund){ CASTRA.res[CASTRA_COLO.res] = (CASTRA.res[CASTRA_COLO.res]||0) + P.fee; castraCLog(mid, { refund:true, pay:P.fee, why:"niemand leverde een geldige run in" }); toast("🪙 Inzet terug", "Niemand leverde een geldige run in (+"+P.fee+" brons)."); }
    else {
      if(credited) CASTRA.res[CASTRA_COLO.res] = (CASTRA.res[CASTRA_COLO.res]||0) + pay;
      const colo = castraCColo(), day = (typeof castraDay==="function") ? castraDay() : "", bonus = (colo.bonusDay===day ? colo.bonusN||0 : 0) < CASTRA_COLO.bonusPerDay;   // dagquotum voor roem, kaart en XP
      if(colo.bonusDay!==day){ colo.bonusDay = day; colo.bonusN = 0; }
      if(bonus){ colo.bonusN++; if(rank===1){ CASTRA.res.gloria = (CASTRA.res.gloria||0) + 5; if(typeof castraCardToken==="function") castraCardToken(1, "Colosseum gewonnen", true); } }
      castraCLog(mid, { rank, pay, ok:me?me.ok:false });
      colo.played = (colo.played||0)+1; if(rank===1 && me && me.ok) colo.wins = (colo.wins||0)+1;       // prestaties in het Certamen-profiel
      if(typeof castraGrantAch==="function"){ castraGrantAch("castra_colo_play"); if(colo.wins>=1) castraGrantAch("castra_colo_win"); if(colo.wins>=5) castraGrantAch("castra_colo_champ"); }
      if(bonus && typeof castraPxpAdd==="function") castraPxpAdd(rank===1 ? 25 : 10);
      toast(rank===1 ? "🏆 Gewonnen!" : "🏛️ Colosseum afgelopen", rank===1 ? "Je wint "+pay+" brons"+(bonus?" en 5 roem":"")+"." : (pay ? "Plaats "+rank+": +"+pay+" brons." : "Plaats "+rank+"."));
    }
    castraSave(); castraCRefresh();
  };
  const amount = st.refund ? 0 : (me ? me.pay : 0);
  if(amount>0){
    C.db.ref(castraCBase(mid)+"/paid/"+C.lid).transaction(cur=> cur ? undefined : true, (err, committed)=>{
      if(err){ P.busy = false; return; }
      done(!!committed);       // al uitbetaald (bijv. op een ander apparaat): niet nog eens
    });
  } else done(false);
}

/* ---------- controle per tik en bij elke wijziging ---------- */
function castraCDeadline(d){ return (d.startAt||0) + CASTRA_COLO.windowMs; }
function castraCCheck(mid){
  const C = CASTRA_C, P = castraCPend()[mid]; if(!C || !P || P.busy || !C.loaded[mid]) return;
  const d = C.matches[mid], now = castraCNow();
  if(!d){ castraCRefund(mid, "De match bestaat niet meer"); return; }
  const n = Object.keys(d.slots||{}).length, req = d.mode==="quad" ? d.need-(d.ghosts||0) : d.need;   // bezette plekken; bij een vierkamp vult een AI de ontbrekende plekken
  if(d.status==="lobby"){
    if(Date.now()-P.t > 8000 && !(d.players && d.players[C.lid])){ castraCRefund(mid, "Je plek in de lobby is verdwenen"); return; }
    if(n >= req){ if(!P.tryAt || Date.now()-P.tryAt>3000){ P.tryAt = Date.now(); C.db.ref(castraCBase(mid)).update({ status:"running", startAt:castraCNow()+CASTRA_COLO.countdownMs }).catch(()=>{}); } return; }
    if(now - d.createdAt > CASTRA_COLO.lobbyTtl){
      P.busy = true;
      castraCLeaveWrite(mid).then(()=>{ P.busy = false; castraCRefund(mid, "Lobby niet vol geworden"); }).catch(()=>{ P.busy = false; });
    }
    return;
  }
  if(d.status!=="running") return;
  if(P.run && !P.sent && now <= castraCDeadline(d)) castraCSendRun(mid);
  const players = Object.keys(d.players||{}), allIn = players.every(l=>d.runs && d.runs[l]);
  if(!P.run && P.started && CASTRA_B && CASTRA_B.pvp && CASTRA_B.pvp.mid===mid && !CASTRA_B.finished && now <= castraCDeadline(d)) return;   // je speelt nog
  if(allIn || now > castraCDeadline(d)) castraCSettle(mid);
}
function castraCTick(){
  const C = CASTRA_C; if(!C) return;
  Object.keys(castraCPend()).forEach(mid=>{
    castraCCheck(mid);
    const P = castraCPend()[mid], d = C.matches[mid]; if(!P || !d || d.status!=="running" || !d.startAt) return;
    const now = castraCNow();
    if(!P.started && !P.run && now >= d.startAt && now <= d.startAt + CASTRA_COLO.lateMs){
      if(_screen==="castraColoLobby") castraCStartRun(mid);
      else if(!P.toasted){ P.toasted = true; toast("⚔️ Het Colosseum begint!", "Ga naar de lobby om mee te doen."); }
    }
  });
  castraCRefresh(); const cd = el("ccCd"); if(cd) cd.textContent = castraCCountdownText();
}
function castraCRefresh(){ if(_screen==="castraColoLobby" && el("ccBody")) castraCRenderBody(); }

/* ---------- lobby: aanmaken, meedoen, verlaten ---------- */
function castraCCreate(mode, div){
  if(!castraCAttach() || castraCBusy()) return;
  if(!castraCanPay({ [CASTRA_COLO.res]:CASTRA_COLO.fee })){ toast("🪙", "Je hebt niet genoeg brons (inzet "+CASTRA_COLO.fee+")."); return; }
  const C = CASTRA_C, ref = C.db.ref(castraCBase()).push(), mid = ref.key;
  const d = { mode, fee:CASTRA_COLO.fee, divisie:div, seed:(Math.random()*4294967295)>>>0, need:CASTRA_COLO.need[mode], status:"lobby", createdBy:C.lid, createdAt:castraCNow(),
              slots:{ s0:C.lid }, players:{ [C.lid]:{ nm:C.nm, ts:castraCNow() } } };
  castraCStake(mid, d);
  ref.set(d).catch(()=>{ castraCRefund(mid, "Aanmaken mislukt"); });
  castraCRefresh();
}
function castraCJoin(mid){
  if(!castraCAttach() || castraCBusy()) return;
  const C = CASTRA_C, d = C.lobby[mid]; if(!d) return;
  if(!castraCanPay({ [CASTRA_COLO.res]:d.fee })){ toast("🪙", "Je hebt niet genoeg brons (inzet "+d.fee+")."); return; }
  castraCStake(mid, d);
  // een vrij plek (s0, s1, ...) en je naam in één onderdeel: zo kan een match nooit meer spelers krijgen dan er plekken zijn
  let slot = -1; for(let i=0;i<d.need-(d.ghosts||0);i++) if(!(d.slots||{})["s"+i]){ slot = i; break; }
  if(slot<0){ castraCRefund(mid, "De match zit al vol"); return; }
  C.db.ref(castraCBase(mid)).update({ ["players/"+C.lid]:{ nm:C.nm, ts:castraCNow() }, ["slots/s"+slot]:C.lid }).catch(()=>{ castraCRefund(mid, "Meedoen mislukt (misschien is de plek net bezet)"); });
  castraCRefresh();
}
// Haalt jezelf (speler + plek) in één keer uit de lobby.
function castraCLeaveWrite(mid){
  const C = CASTRA_C, d = C.matches[mid] || {}, up = { ["players/"+C.lid]:null };
  Object.keys(d.slots||{}).forEach(k=>{ if(d.slots[k]===C.lid) up["slots/"+k] = null; });
  return C.db.ref(castraCBase(mid)).update(up);
}
// Vierkamp met 3 spelers: een AI vult de vierde plek aan (ghosts staat na het aanmaken niet meer open voor wijziging).
function castraCAddAI(mid){
  const C = CASTRA_C, d = C && C.matches[mid]; if(!d || d.status!=="lobby" || d.mode!=="quad" || d.ghosts || Object.keys(d.slots||{}).length!==d.need-1) return;
  C.db.ref(castraCBase(mid)).update({ ghosts:1 }).catch(()=>{ toast("⚠️", "De AI kon niet worden toegevoegd (er is misschien net iemand bij gekomen)."); });
}
function castraCLeave(mid){
  const C = CASTRA_C, P = castraCPend()[mid], d = C && C.matches[mid]; if(!P || !d || d.status!=="lobby" || P.busy) return;
  P.busy = true;
  castraCLeaveWrite(mid).then(()=>{ P.busy = false; castraCRefund(mid, "Je hebt de lobby verlaten"); }).catch(()=>{ P.busy = false; toast("⚠️", "Verlaten mislukt, probeer het opnieuw."); });
}

/* ---------- de run zelf ---------- */
function castraCStartRun(mid){
  const C = CASTRA_C, P = castraCPend()[mid], d = C.matches[mid]; if(!P || !d || P.started) return;
  P.started = true; castraSave();
  castraColoBegin(d.divisie, d.seed, castraColoPvpMission(d.divisie, d.seed), { mid });
}
function castraCLive(mid, wave, lives){
  const C = CASTRA_C; if(!C) return;
  C.db.ref(castraCBase(mid)+"/live/"+C.lid).set({ wave, lives, ts:castraCNow() }).catch(()=>{});
}
// Einde van de run (dood, 60 golven overleefd of opgegeven): run klaarzetten en insturen.
function castraColoPvpEnd(quit){
  const B = CASTRA_B, s = B.sim, mid = B.pvp.mid, P = castraCPend()[mid]; clearInterval(B.timer); B.finished = true;
  const res = { tick:s.tick, wave:s.wave+1, lives:s.baseHp, kills:s.kills, win:s.over==="win"?1:0, quit:s.over?0:1 };
  if(P){ P.run = { actions:JSON.stringify(B.actions), res, ts:castraCNow() }; P.sent = false; castraSave(); castraCSendRun(mid); }
  if(quit){ CASTRA_B = null; window.removeEventListener("resize", B.resizeFn); go("castraColoLobby"); return; }
  const box = el("cbResult"); if(el("cbCtl")) el("cbCtl").innerHTML = "";
  if(box){
    box.innerHTML = `<div class="panel"><div style="font-size:22px">🏛️ ${s.over==="win"?"Je hebt alle "+CASTRA_COLO.pvpWaves+" golven overleefd!":"Je kamp is gevallen."}</div>
      <div style="font-size:18px;margin:6px 0">Golf <b>${res.wave}</b> · ☠️ ${res.kills} vijanden verslagen</div>
      <div class="note">Je run is ingestuurd. In de lobby zie je zodra de uitslag bekend is (iedereen rekent hem na).</div>
      <button class="btn btn-gold" style="min-height:44px;margin-top:10px" onclick="castraBExit()">Naar de lobby</button></div>`;
    box.scrollIntoView({ behavior:"smooth", block:"nearest" });
  }
}
function castraCSendRun(mid){
  const C = CASTRA_C, P = castraCPend()[mid]; if(!C || !P || !P.run || P.sent || P.sending) return;
  P.sending = true;
  C.db.ref(castraCBase(mid)+"/runs/"+C.lid).set(P.run).then(()=>{ P.sending = false; P.sent = true; castraSave(); castraCRefresh(); })
    .catch(()=>{ P.sending = false; setTimeout(()=>{ if(CASTRA_C) castraCCheck(mid); }, 5000); });
}

/* ---------- gevecht: live-balken van alle deelnemers ---------- */
function castraColoPvpBar(nm, wave, lives, scale, state, mine){
  const col = state==="dead" ? "#6b5a4a" : mine ? "#d4af37" : "#c8392a", w = Math.max(2, Math.min(100, Math.round(100*wave/scale)));
  const tail = state==="dead" ? "✝ golf "+wave : state==="done" ? "klaar · golf "+wave : "golf <b>"+wave+"</b> · ❤️ "+lives;
  return `<div style="display:flex;align-items:center;gap:6px;font-size:13px;margin:2px 0"><span style="width:104px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;${mine?"color:#d4af37;font-weight:bold":""}">${esc(nm)}</span>
    <div style="flex:1;height:9px;background:#2a1a10;border-radius:5px;overflow:hidden"><div style="width:${w}%;height:100%;background:${col}"></div></div><span style="min-width:104px;text-align:right">${tail}</span></div>`;
}
function castraColoPvpHud(){
  const B = CASTRA_B, C = CASTRA_C, d = C && C.matches[B.pvp.mid]; if(!d) return "";
  const s = B.sim, k = s.wave+"|"+s.baseHp;
  if(B.liveK!==k){ B.liveK = k; castraCLive(B.pvp.mid, s.wave+1, s.baseHp); }
  const tick = s.tick, rows = [];   // de AI wordt getoond op jouw speltijd (de rangorde gaat om overleefde ticks, niet om de muurklok)
  rows.push({ nm:C.nm, wave:Math.max(0,s.wave+1), lives:s.baseHp, state:s.over?(s.over==="win"?"done":"dead"):"", mine:true });
  Object.keys(d.players||{}).filter(l=>l!==C.lid).forEach(l=>{
    const lv = (d.live||{})[l], run = (d.runs||{})[l], nm = (d.players[l]||{}).nm||l;
    rows.push({ nm, wave:lv?lv.wave:0, lives:lv?lv.lives:CASTRA_P.baseHp, state:run ? (run.res&&run.res.win ? "done" : "dead") : (lv && lv.lives<=0 ? "dead" : "") });
  });
  for(let g=0; g<(d.mode==="quad" ? (d.ghosts|0) : 0); g++){ const a = castraColoGhostAt(d, g, tick); rows.push({ nm:CASTRA_COLO_GHOST.names[g], wave:a.done?a.final.wave:a.wave, lives:a.done?a.final.lives:a.lives, state:a.done ? (a.final.win?"done":"dead") : "" }); }
  const scale = Math.max(20, ...rows.map(r=>r.wave+4));
  return `<div style="flex-basis:100%;margin-top:4px">${rows.map(r=>castraColoPvpBar(r.nm, r.wave, r.lives, scale, r.state, r.mine)).join("")}</div>`;
}

/* ---------- scherm ---------- */
function castraCCountdownText(){
  const C = CASTRA_C; if(!C) return "";
  const mid = Object.keys(castraCPend())[0], d = mid && C.matches[mid]; if(!d || d.status!=="running" || !d.startAt) return "";
  const left = Math.ceil((d.startAt - castraCNow())/1000);
  if(left>0) return "Start over "+left+" s";
  const dl = Math.ceil((castraCDeadline(d) - castraCNow())/1000);
  return dl>0 ? "Uiterlijk over "+Math.floor(dl/60)+":"+String(dl%60).padStart(2,"0")+" is de uitslag bekend" : "";
}
function castraCStandingsHTML(r){
  const st = r.st, d = r.d, fmt = x=>x.res ? (x.res.win ? "alle "+CASTRA_COLO.pvpWaves+" golven overleefd (❤️ "+x.res.lives+")" : "golf "+x.res.wave+" · ☠️ "+x.res.kills+(x.res.quit?" · opgegeven":"")) : esc(x.why||"—");
  return `<div class="panel"><h3>🏛️ Uitslag — ${d.mode==="quad"?"vierkamp":"duel"}, divisie ${d.divisie}</h3>
    ${st.refund?`<div class="note">Niemand leverde een geldige run in: iedereen krijgt de inzet terug.</div>`:""}${st.ghosts?`<div class="note">🤖 De AI deed mee zonder inzet en zonder uitbetaling; ze telt wel mee voor de plaatsen.</div>`:""}
    <table style="width:100%;border-collapse:collapse;font-size:15px">${st.rows.map(x=>`<tr style="${x.lid===CASTRA_C.lid?"font-weight:bold;color:#d4af37":""}">
      <td style="padding:3px 6px">${x.rank}.</td><td style="padding:3px 6px">${x.ghost?"🤖 ":""}${esc(x.nm)}</td><td style="padding:3px 6px">${fmt(x)}</td><td style="padding:3px 6px;text-align:right">${x.pay?"+"+x.pay+" 🪙":""}</td></tr>`).join("")}</table>
    <div class="note" style="margin-top:6px">De uitslag is nagerekend uit de ingestuurde runs (naspelen), niet uit wat spelers beweren.</div></div>`;
}
const CASTRA_C_MODE = { duel:"Duel", quad:"Vierkamp" };
function castraCWedHTML(){
  const C = CASTRA_C;
  const aes = (CASTRA.res[CASTRA_COLO.res]||0), pend = castraCPend(), mids = Object.keys(pend), fee = CASTRA_COLO.fee, pay = CASTRA_COLO.pay;
  let h = `<div class="note">🪙 Je hebt ${aes} brons · inzet ${fee} · duel: winnaar ${pay.duel[0]} · vierkamp: ${pay.quad.join(" / ")} (met een AI: ${castraColoPayTable("quad",1).join(" / ")}).</div>`;
  mids.forEach(mid=>{
    const P = pend[mid], d = C.matches[mid];
    if(!d){ h += `<div class="panel"><h3>⚔️ Wedstrijd</h3><div class="note">Match laden…</div></div>`; return; }
    const names = Object.keys(d.players||{}).map(l=>esc((d.players[l]||{}).nm||l)).join(", "), n = Object.keys(d.slots||{}).length, gh = d.mode==="quad" ? (d.ghosts|0) : 0, tot = d.need-gh;
    h += `<div class="panel" style="border:2px solid #d4af37"><h3>⚔️ Jouw ${CASTRA_C_MODE[d.mode].toLowerCase()} — divisie ${d.divisie}</h3><div class="note">Deelnemers (${n}/${tot}${gh?" + "+gh+" AI":""}): ${names}</div>`;
    if(d.status==="lobby"){
      h += `<div style="margin:8px 0">Wachten op ${tot-n} ${tot-n===1?"tegenstander":"tegenstanders"}…</div>`;
      if(d.mode==="quad" && !gh && n===d.need-1) h += `<button class="btn btn-gold" style="min-height:44px;margin:0 6px 6px 0" onclick="castraCAddAI('${mid}')">🤖 Vul aan met een AI-tegenstander</button><div class="note" style="margin:0 0 8px">De AI betaalt niet mee: de prijzen worden dan ${castraColoPayTable("quad",1).slice(0,3).join(" / ")} (alleen de echte inzetten worden uitbetaald).</div>`;
      h += `<button class="btn" style="min-height:44px" onclick="castraCLeave('${mid}')">Lobby verlaten (inzet terug)</button>`;
    } else {
      const started = castraCNow() >= d.startAt, np = Object.keys(d.players||{}).length;
      if(!started) h += `<div style="font-size:22px;margin:8px 0"><b id="ccCd"></b></div><div class="note">Het gevecht start vanzelf. Blijf op dit scherm.</div>`;
      else if(P.started && !P.run) h += `<div class="note">Je run loopt of is onderbroken.</div>`;
      else if(P.run) h += `<div style="margin:8px 0">Je run is ${P.sent?"ingeleverd":"klaar, wordt ingestuurd…"}. Wachten op de anderen (${Object.keys(d.runs||{}).length}/${np}).</div><div class="note"><span id="ccCd"></span></div>`;
      else h += `<div class="note">Je bent te laat voor de start; je inzet vervalt als je niet meedoet.</div><div class="note"><span id="ccCd"></span></div>`;
    }
    h += `</div>`;
  });
  Object.keys(C.results).forEach(mid=>{ if(!pend[mid]) h += castraCStandingsHTML(C.results[mid]); });
  if(!mids.length){
    const open = Object.keys(C.lobby).filter(k=>{ const d = C.lobby[k]; return d && castraCNow()-d.createdAt < CASTRA_COLO.lobbyTtl && Object.keys(d.slots||{}).length > 0 && Object.keys(d.slots||{}).length < d.need-(d.ghosts||0); });
    h += `<div class="panel"><h3>Open wedstrijden in jouw klas</h3>${open.length ? open.map(k=>{ const d = C.lobby[k], nm = Object.keys(d.players||{}).map(l=>esc((d.players[l]||{}).nm||l)).join(", ");
        return `<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin:6px 0;flex-wrap:wrap"><span>${CASTRA_C_MODE[d.mode]||d.mode} · divisie ${d.divisie} · ${Object.keys(d.slots||{}).length}/${d.need-(d.ghosts||0)} · ${nm}</span><button class="btn btn-gold" style="min-height:44px" onclick="castraCJoin('${k}')">Meedoen (${d.fee} 🪙)</button></div>`; }).join("")
      : `<div class="note">Er zijn nu geen open wedstrijden.</div>`}</div>
      <div class="panel"><h3>Nieuwe wedstrijd starten</h3><div class="note">Kies een divisie: alle soldaten en helden spelen op maximaal dat level, met een vast aantal torens. Een vierkamp heeft 4 spelers; zijn er 3, dan mag een AI de vierde plek innemen.</div>
      ${["duel","quad"].map(mo=>`<div style="margin-top:8px"><b>${CASTRA_C_MODE[mo]}</b><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:4px">${[20,35,50].map(dv=>`<button class="btn btn-gold" style="min-height:44px" ${aes<fee?"disabled":""} onclick="castraCCreate('${mo}',${dv})">Divisie ${dv} (${CASTRA_COLO.cap[dv]} torens)</button>`).join("")}</div></div>`).join("")}</div>`;
  }
  const hist = castraCHist();
  if(hist.length) h += `<div class="panel"><h3>Eerdere wedstrijden</h3>${hist.slice(0,6).map(x=>`<div class="note">${new Date(x.t).toLocaleString("nl-NL")} · ${CASTRA_C_MODE[x.mode]||"duel"} · divisie ${x.div||"?"} · ${x.refund?"inzet terug ("+esc(x.why||"")+")":"plaats "+x.rank+" · "+(x.pay?"+"+x.pay+" 🪙":"geen prijs")}</div>`).join("")}</div>`;
  return h;
}
function castraCRenderBody(){
  const C = CASTRA_C, box = el("ccBody"); if(!box) return;
  const tab = CASTRA_C_TAB || "wed";
  let h = `<div style="display:flex;gap:8px;flex-wrap:wrap;margin:0 0 10px">${CASTRA_C_TABS.map(t=>`<button class="btn ${t[0]===tab?"btn-gold":""}" style="min-height:44px" onclick="castraCTab('${t[0]}')">${t[1]}</button>`).join("")}</div>`;
  h += tab==="oef" ? castraCPracticeHTML() : !C ? `<div class="note">Meld je eerst aan met je klascode en leerlingcode (via Battle Mode of Meedoen) om te kunnen meedoen aan wedstrijden en de ranglijst te zien. Oefenen kan ook zonder.</div>` : tab==="rang" ? castraCRankHTML() : castraCWedHTML();
  const sig = h; if(box.dataset.sig!==sig){ box.dataset.sig = sig; box.innerHTML = h; }
  const cd = el("ccCd"); if(cd) cd.textContent = castraCCountdownText();
}
/* ---------- ranglijst van je klas ----------
   Geen aparte opslag (die zou te vervalsen zijn): de lijst wordt berekend uit de laatste 25 wedstrijden van de klas
   (castraColosseum/{klas}, op createdAt). Elke afgeronde wedstrijd wordt NAGESPEELD (castraColoStandings), zodat de lijst niet
   afhangt van wat spelers beweren; de uitslag per wedstrijd wordt lokaal onthouden, dus alleen de eerste keer duurt het even.
   Teruggestorte wedstrijden (niemand leverde in) tellen niet mee; de AI telt niet als speler. */
function castraCRankSummary(mid, d){
  const key = "castra_colo_std_v1_"+mid;
  try{ const c = localStorage.getItem(key); if(c) return JSON.parse(c); }catch(e){}
  const st = castraColoStandings(d, d.runs||{});
  const sum = { div:d.divisie, mode:d.mode, refund:st.refund, rows:st.rows.filter(r=>!r.ghost).map(r=>({ lid:r.lid, nm:r.nm, rank:r.rank, pay:r.pay, ok:r.ok, wave:r.res?r.res.wave:0 })) };
  try{ localStorage.setItem(key, JSON.stringify(sum)); }catch(e){}
  return sum;
}
function castraCRankLoad(force){
  const C = CASTRA_C; if(!C) return;
  const R = C.rank || (C.rank = { state:"idle", rows:null, done:0, total:0, at:0 });
  if(R.state==="busy" || (R.state==="ready" && !force && Date.now()-R.at<60000)) return;
  R.state = "busy"; R.done = 0; R.total = 0; castraCRefresh();
  C.db.ref(castraCBase()).orderByChild("createdAt").limitToLast(25).once("value").then(snap=>{
    const all = snap.val()||{}, ids = Object.keys(all).sort((a,b)=>all[a].createdAt-all[b].createdAt), tally = {}, now = castraCNow();
    R.total = ids.length; let i = 0, counted = 0;
    const step = ()=>{
      if(CASTRA_C!==C) return;
      if(i>=ids.length){
        const rows = Object.keys(tally).map(k=>tally[k]).sort((a,b)=>(b.wins-a.wins) || (b.net-a.net) || (a.played-b.played) || (a.nm<b.nm?-1:1));
        R.rows = rows; R.counted = counted; R.state = "ready"; R.at = Date.now(); castraCRefresh(); return;
      }
      const mid = ids[i++], d = all[mid]; R.done = i;
      try{
        const players = Object.keys(d.players||{}), finished = d.status==="running" && d.startAt && (players.every(l=>d.runs&&d.runs[l]) || now > castraCDeadline(d));
        if(finished){
          const sum = castraCRankSummary(mid, d);
          if(!sum.refund){
            counted++;
            sum.rows.forEach(r=>{
              const t = tally[r.lid] || (tally[r.lid] = { lid:r.lid, nm:r.nm, played:0, wins:0, net:0, best:{} });
              t.nm = r.nm; t.played++; if(r.rank===1 && r.ok) t.wins++; t.net += r.pay - (d.fee||CASTRA_COLO.fee);
              if(r.ok) t.best[sum.div] = Math.max(t.best[sum.div]||0, r.wave);
            });
          }
        }
      }catch(e){}
      castraCRefresh(); setTimeout(step, 0);
    };
    step();
  }).catch(()=>{ R.state = "error"; castraCRefresh(); });
}
function castraCRankHTML(){
  const C = CASTRA_C, R = C.rank;
  if(!R || R.state==="idle"){ castraCRankLoad(); return `<div class="panel"><div class="note">Ranglijst laden…</div></div>`; }
  if(R.state==="busy") return `<div class="panel"><div class="note">⏳ Wedstrijden van je klas worden nagerekend… ${R.done}/${R.total||"?"}</div></div>`;
  if(R.state==="error") return `<div class="panel"><div class="note">De ranglijst kon niet geladen worden. <button class="btn" onclick="castraCRankLoad(true)">Opnieuw</button></div></div>`;
  const me = C.lid, rows = R.rows||[], mine = rows.findIndex(r=>r.lid===me);
  const best = r=>[20,35,50].map(d=>r.best[d]||"—").join(" / ");
  return `<div class="panel"><h3>🏆 Ranglijst — klas ${esc(C.klas)}</h3>
    <div class="note">${R.counted ? "Op basis van de laatste "+R.total+" wedstrijden van je klas ("+R.counted+" afgerond, allemaal nagerekend)." : "Er zijn nog geen afgeronde wedstrijden in je klas."}${mine>=0?` Jij staat op plaats <b>${mine+1}</b> van ${rows.length}.`:""}</div>
    ${rows.length?`<table style="width:100%;border-collapse:collapse;font-size:15px;margin-top:6px"><tr style="opacity:.7;font-size:12px"><td></td><td>Speler</td><td style="text-align:right">Gespeeld</td><td style="text-align:right">Gewonnen</td><td style="text-align:right">Netto 🪙</td><td style="text-align:right">Beste golf (20/35/50)</td></tr>
    ${rows.map((r,k)=>`<tr style="${r.lid===me?"font-weight:bold;color:#d4af37":""}"><td style="padding:3px 6px">${k+1}.</td><td style="padding:3px 6px">${esc(r.nm)}</td><td style="padding:3px 6px;text-align:right">${r.played}</td><td style="padding:3px 6px;text-align:right">${r.wins}</td><td style="padding:3px 6px;text-align:right">${r.net>0?"+":""}${r.net}</td><td style="padding:3px 6px;text-align:right">${best(r)}</td></tr>`).join("")}</table>`:""}
    <button class="btn" style="min-height:44px;margin-top:8px" onclick="castraCRankLoad(true)">↻ Vernieuwen</button></div>`;
}
/* ---------- oefenen (eindeloze modus, alleen jij) ---------- */
function castraCPracticeHTML(){
  const best = (CASTRA.colo||{}).best||{};
  return `<div class="panel"><h3>🛡️ Oefenen — eindeloze modus</h3>
    <div class="note">Dezelfde regels als in een wedstrijd (divisie met levelplafond, vast aantal torens, geen kaarten of gunsten), maar alleen jij, zonder inzet. De golven worden steeds sterker; je hebt <b>roem en ervaring</b> te winnen met een nieuw record.</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px">${[20,35,50].map(d=>`<button class="btn btn-gold" style="min-height:44px" onclick="castraColoStart(${d})">Divisie ${d} (${CASTRA_COLO.cap[d]} torens)${best[d]?" · record golf "+best[d].wave:""}</button>`).join("")}</div></div>`;
}
const CASTRA_C_TABS = [["wed","⚔️ Wedstrijden"],["rang","🏆 Ranglijst"],["oef","🛡️ Oefenen"]];
function castraCTab(t){ CASTRA_C_TAB = t; const b = el("ccBody"); if(b) b.dataset.sig = ""; castraCRenderBody(); }
SCREENS.castraColoLobby = function(){
  document.body.classList.remove("greek");
  if(!CASTRA) castraLoad();
  H(brand(true)+`
  <div class="scrhead"><button class="back" onclick="castraColoBack()">${iconSVG("shield",20,"currentColor")}</button><h2>🏛️ Colosseum</h2></div>
  ${castraColoAllowed()?"":`<div class="note">Het Colosseum is nog gesloten.</div>`}
  <div id="ccBody"></div>${foot()}`);
  if(!castraColoAllowed()) return;
  castraCAttach();      // zonder aanmelding blijft alleen "Oefenen" over
  castraCRenderBody();
};
// Bij het openen van de app of lijst: lopende inzetten afhandelen (uitbetalen of terugbetalen).
function castraCReconcile(){ if(castraColoAllowed() && CASTRA && CASTRA.colo && CASTRA.colo.pending && Object.keys(CASTRA.colo.pending).length) castraCAttach(); }
