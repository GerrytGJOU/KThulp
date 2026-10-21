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
      if(rank===1){ CASTRA.res.gloria = (CASTRA.res.gloria||0) + 5; if(typeof castraCardToken==="function") castraCardToken(1, "Colosseum gewonnen", true); }
      castraCLog(mid, { rank, pay, ok:me?me.ok:false });
      if(typeof castraPxpAdd==="function") castraPxpAdd(rank===1 ? 25 : 10);
      toast(rank===1 ? "🏆 Gewonnen!" : "🏛️ Colosseum afgelopen", rank===1 ? "Je wint "+pay+" brons en 5 roem." : (pay ? "Plaats "+rank+": +"+pay+" brons." : "Plaats "+rank+"."));
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
  const d = { mode, fee:CASTRA_COLO.fee, divisie:div, seed:(Math.random()*4294967295)>>>0, need:CASTRA_COLO.need[mode], ghosts:0, status:"lobby", createdBy:C.lid, createdAt:castraCNow(),
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
  let slot = -1; for(let i=0;i<d.need;i++) if(!(d.slots||{})["s"+i]){ slot = i; break; }
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

/* ---------- gevecht: HUD-regel met de tegenstander ---------- */
function castraColoPvpHud(){
  const B = CASTRA_B, C = CASTRA_C, d = C && C.matches[B.pvp.mid]; if(!d) return "";
  const s = B.sim, k = s.wave+"|"+s.baseHp;
  if(B.liveK!==k){ B.liveK = k; castraCLive(B.pvp.mid, s.wave+1, s.baseHp); }
  const others = Object.keys(d.players||{}).filter(l=>l!==C.lid).map(l=>{
    const lv = (d.live||{})[l], run = (d.runs||{})[l], nm = esc((d.players[l]||{}).nm||l);
    return `<span>⚔️ ${nm}: ${run ? "klaar" : lv ? "golf <b>"+lv.wave+"</b> · ❤️ "+lv.lives : "…"}</span>`;
  });
  return others.join("");
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
  return `<div class="panel"><h3>🏛️ Uitslag — divisie ${d.divisie}</h3>
    ${st.refund?`<div class="note">Niemand leverde een geldige run in: iedereen krijgt de inzet terug.</div>`:""}
    <table style="width:100%;border-collapse:collapse;font-size:15px">${st.rows.map(x=>`<tr style="${x.lid===CASTRA_C.lid?"font-weight:bold;color:#d4af37":""}">
      <td style="padding:3px 6px">${x.rank}.</td><td style="padding:3px 6px">${esc(x.nm)}</td><td style="padding:3px 6px">${fmt(x)}</td><td style="padding:3px 6px;text-align:right">${x.pay?"+"+x.pay+" 🪙":""}</td></tr>`).join("")}</table>
    <div class="note" style="margin-top:6px">De uitslag is nagerekend uit de ingestuurde runs (naspelen), niet uit wat spelers beweren.</div></div>`;
}
function castraCRenderBody(){
  const C = CASTRA_C, box = el("ccBody"); if(!box) return;
  const aes = (CASTRA.res[CASTRA_COLO.res]||0), pend = castraCPend(), mids = Object.keys(pend);
  let h = `<div class="note">🪙 Je hebt ${aes} brons · inzet per duel: ${CASTRA_COLO.fee} · de winnaar krijgt ${CASTRA_COLO.pay.duel[0]}.</div>`;
  mids.forEach(mid=>{
    const P = pend[mid], d = C.matches[mid];
    if(!d){ h += `<div class="panel"><h3>⚔️ Duel</h3><div class="note">Match laden…</div></div>`; return; }
    const names = Object.keys(d.players||{}).map(l=>esc((d.players[l]||{}).nm||l)).join(", "), n = Object.keys(d.players||{}).length;
    h += `<div class="panel" style="border:2px solid #d4af37"><h3>⚔️ Jouw duel — divisie ${d.divisie}</h3><div class="note">Deelnemers (${n}/${d.need}): ${names}</div>`;
    if(d.status==="lobby") h += `<div style="margin:8px 0">Wachten op een tegenstander…</div><button class="btn" style="min-height:44px" onclick="castraCLeave('${mid}')">Lobby verlaten (inzet terug)</button>`;
    else {
      const started = castraCNow() >= d.startAt;
      if(!started) h += `<div style="font-size:22px;margin:8px 0"><b id="ccCd"></b></div><div class="note">Het gevecht start vanzelf. Blijf op dit scherm.</div>`;
      else if(P.started && !P.run) h += `<div class="note">Je run loopt of is onderbroken.</div>`;
      else if(P.run) h += `<div style="margin:8px 0">Je run is ${P.sent?"ingeleverd":"klaar, wordt ingestuurd…"}. Wachten op de anderen (${Object.keys(d.runs||{}).length}/${d.need}).</div><div class="note"><span id="ccCd"></span></div>`;
      else h += `<div class="note">Je bent te laat voor de start; je inzet vervalt als je niet meedoet.</div><div class="note"><span id="ccCd"></span></div>`;
    }
    h += `</div>`;
  });
  Object.keys(C.results).forEach(mid=>{ if(!pend[mid]) h += castraCStandingsHTML(C.results[mid]); });
  if(!mids.length){
    const open = Object.keys(C.lobby).filter(k=>{ const d = C.lobby[k]; return d && d.mode==="duel" && castraCNow()-d.createdAt < CASTRA_COLO.lobbyTtl && Object.keys(d.players||{}).length < d.need; });
    h += `<div class="panel"><h3>Open duels in jouw klas</h3>${open.length ? open.map(k=>{ const d = C.lobby[k], nm = Object.keys(d.players||{}).map(l=>esc((d.players[l]||{}).nm||l)).join(", ");
        return `<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin:6px 0;flex-wrap:wrap"><span>${nm} · divisie ${d.divisie}</span><button class="btn btn-gold" style="min-height:44px" onclick="castraCJoin('${k}')">Meedoen (${d.fee} 🪙)</button></div>`; }).join("")
      : `<div class="note">Er zijn nu geen open duels.</div>`}</div>
      <div class="panel"><h3>Nieuw duel starten</h3><div class="note">Kies een divisie: alle soldaten en helden spelen op maximaal dat level, met een vast aantal torens.</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:6px">${[20,35,50].map(dv=>`<button class="btn btn-gold" style="min-height:44px" ${aes<CASTRA_COLO.fee?"disabled":""} onclick="castraCCreate('duel',${dv})">Divisie ${dv} (${CASTRA_COLO.cap[dv]} torens)</button>`).join("")}</div></div>`;
  }
  const hist = castraCHist();
  if(hist.length) h += `<div class="panel"><h3>Eerdere duels</h3>${hist.slice(0,6).map(x=>`<div class="note">${new Date(x.t).toLocaleString("nl-NL")} · divisie ${x.div||"?"} · ${x.refund?"inzet terug ("+esc(x.why||"")+")":"plaats "+x.rank+" · "+(x.pay?"+"+x.pay+" 🪙":"geen prijs")}</div>`).join("")}</div>`;
  const sig = h; if(box.dataset.sig!==sig){ box.dataset.sig = sig; box.innerHTML = h; }
  const cd = el("ccCd"); if(cd) cd.textContent = castraCCountdownText();
}
SCREENS.castraColoLobby = function(){
  document.body.classList.remove("greek");
  if(!CASTRA) castraLoad();
  H(brand(true)+`
  <div class="scrhead"><button class="back" onclick="go('castraProelium')">${iconSVG("shield",20,"currentColor")}</button><h2>🏛️ Colosseum — duel</h2></div>
  ${castraColoAllowed()?"":`<div class="note">Het Colosseum is nog gesloten.</div>`}
  <div id="ccBody"></div>${foot()}`);
  if(!castraColoAllowed()) return;
  if(!castraCAttach()){ el("ccBody").innerHTML = `<div class="note">Meld je eerst aan met je klascode en leerlingcode (via Battle Mode of Meedoen) om te kunnen duelleren.</div>`; return; }
  castraCRenderBody();
};
// Bij het openen van de app of lijst: lopende inzetten afhandelen (uitbetalen of terugbetalen).
function castraCReconcile(){ if(castraColoAllowed() && CASTRA && CASTRA.colo && CASTRA.colo.pending && Object.keys(CASTRA.colo.pending).length) castraCAttach(); }
