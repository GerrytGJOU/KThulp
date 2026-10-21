/* ============================================================================
   CASTRA HEROUM — COMMERCIUM (soldaten ruilen binnen de klas)
   ----------------------------------------------------------------------------
   Tabblad in de principia. Een leerling zet een soldaat in de etalage (*Offero*);
   hij verdwijnt uit zijn barakken en staat als aanbod in castraTrades/{klas}/{tid}.
   Een klasgenoot kiest dat aanbod (*Commuta*) en geeft er een eigen soldaat voor
   terug. De ruil is ATOMAIR: een Firebase-transactie op het aanbod (alleen
   status "open" -> "done"); wie als eerste is, wint. De aanbieder krijgt de
   ruilsoldaat bij zijn volgende bezoek aan het commercium (of meteen als hij
   kijkt). Een open aanbod kan ingetrokken worden (*Revoca*).
   De soldaat wordt als JSON-string verstuurd en bij ontvangst gevalideerd
   (lijn, stadium, level en aanleg binnen grenzen), met een nieuw id.
   Alleen ingelogde leerlingen (BM_IDENT). Teksten: Latijn, zie castra-latin.js.
   Laadt NA castra-legio.js.
   ============================================================================ */

let CASTRA_T = null;   // { klas, offers, ref, fn, give }

function castraTradeDb(){ return (typeof castraLegioDb==="function") ? castraLegioDb() : null; }
function castraTradeAttach(){
  const id = (typeof BM_IDENT!=="undefined") ? BM_IDENT : null, db = castraTradeDb();
  if(!id || !id.klascode || !db) return false;
  if(CASTRA_T && CASTRA_T.klas===id.klascode) return true;
  castraTradeDetach();
  const T = CASTRA_T = { klas:id.klascode, offers:{}, give:null, taking:null, busy:{} };
  T.ref = db.ref("castraTrades/"+T.klas);
  T.fn = s=>{ T.offers = s.val()||{}; castraTradeCollect(); if(CASTRA_UI && CASTRA_UI.panel==="principia" && CASTRA_UI.pTab==="commercium" && el("castraPanel")) castraPrincipiaOpen(true); };
  T.ref.on("value", T.fn);
  return true;
}
function castraTradeDetach(){ if(CASTRA_T){ try{ CASTRA_T.ref.off("value", CASTRA_T.fn); }catch(e){} CASTRA_T = null; } }

function castraTradeSerialize(s){ const c = { ...s }; delete c.hurtUntil; delete c.trainUntil; return JSON.stringify(c).slice(0,1500); }
// Valideert een ontvangen soldaat; geeft een schoon object met nieuw id, of null. Oude soldaten (lijn+stadium)
// worden eerst naar de troepenbomen gemigreerd.
function castraTradeParse(str){
  try{
    let o = JSON.parse(str); o = castraMigrateSoldier(o);
    const f = CASTRA_FORMS[o.line]; if(!f) return null;
    const indoles = {}; CASTRA_STATS.forEach(st=>{ indoles[st.id] = Math.max(0, Math.min(CASTRA_INDOLES_MAX, parseInt((o.indoles||{})[st.id],10)||0)); });
    const ing = CASTRA_INGENIA.some(i=>i.id===o.ingenium) ? o.ingenium : CASTRA_INGENIA[0].id;
    return { id:"s"+castraNow().toString(36)+Math.floor(Math.random()*1e6).toString(36), line:f.id, lvl:Math.max(1, Math.min(50, parseInt(o.lvl,10)||1)),
             xp:Math.max(0, parseInt(o.xp,10)||0), indoles, ingenium:ing, insignis:!!o.insignis, hurtUntil:0 };
  }catch(e){ return null; }
}
function castraTradeMine(){ return BM_IDENT.leerlingcode; }
function castraTradeTradable(s){ return !castraIsHurt(s) && !s.trainUntil; }

function castraTradeOffer(sid){
  const T = CASTRA_T, s = CASTRA.soldiers.find(x=>x.id===sid); if(!T || !s || !castraTradeTradable(s)) return "?";
  const key = T.ref.push();
  CASTRA.soldiers = CASTRA.soldiers.filter(x=>x.id!==sid); castraSave();     // in de etalage: weg uit de barakken
  key.set({ from:castraTradeMine(), fn:String(BM_IDENT.name||"?").slice(0,40), give:castraTradeSerialize(s), status:"open", ts:Date.now() }).catch(()=>{
    CASTRA.soldiers.push(s); castraSave();                                      // mislukt: terug in de barakken
  });
  return null;
}
function castraTradeCancel(tid){
  const T = CASTRA_T; if(!T || T.busy[tid]) return; T.busy[tid] = 1;
  const offer = T.offers[tid];          // vooraf bewaren: de lijst wordt al bijgewerkt zodra de transactie slaagt
  T.ref.child(tid).transaction(cur=> (cur && cur.status==="open" && cur.from===castraTradeMine()) ? null : undefined).then(res=>{
    if(res.committed){ const s = offer && castraTradeParse(offer.give); if(s){ CASTRA.soldiers.push(s); castraSave(); } }
  }).catch(()=>{}).then(()=>{ delete T.busy[tid]; castraRenderRes(); });
}
// Ruil: eigen soldaat `mySid` tegen het aanbod `tid`.
function castraTradeTake(tid, mySid){
  const T = CASTRA_T, mine = CASTRA.soldiers.find(x=>x.id===mySid), off = T && T.offers[tid];
  if(!T || !mine || !off || off.status!=="open" || off.from===castraTradeMine() || !castraTradeTradable(mine) || T.busy[tid]) return;
  T.busy[tid] = 1; const gift = castraTradeSerialize(mine), who = castraTradeMine(), nm = String(BM_IDENT.name||"?").slice(0,40);
  T.ref.child(tid).transaction(cur=>{
    if(!cur || cur.status!=="open" || cur.from===who) return undefined;           // al weg of van mezelf: afbreken
    return { ...cur, status:"done", to:who, tn:nm, get:gift };
  }).then(res=>{
    if(res.committed){
      const got = castraTradeParse(res.snapshot.val().give);
      CASTRA.soldiers = CASTRA.soldiers.filter(x=>x.id!==mySid);
      if(got) CASTRA.soldiers.push(got);
      castraSave(); castraToastLa("commutatio_facta");
    } else castraToastLa("iam_captum");
  }).catch(()=>castraToastLa("iam_captum")).then(()=>{ delete T.busy[tid]; T.give = null; T.taking = null; castraRenderRes(); if(CASTRA_UI.panel==="principia") castraPrincipiaOpen(true); });
}
// Afgeronde eigen aanbiedingen ophalen (als er plek is in de barakken).
function castraTradeCollect(){
  const T = CASTRA_T; if(!T) return;
  Object.keys(T.offers).forEach(tid=>{
    const o = T.offers[tid];
    if(!o || o.from!==castraTradeMine() || o.status!=="done" || T.busy[tid]) return;
    if(CASTRA.soldiers.length >= castraBarracksCap()) return;
    T.busy[tid] = 1;
    const got = castraTradeParse(o.get);
    T.ref.child(tid).remove().then(()=>{ if(got){ CASTRA.soldiers.push(got); castraSave(); castraToastLa("commutatio_facta"); } }).catch(()=>{}).then(()=>{ delete T.busy[tid]; });
  });
}

/* ---------- weergave ---------- */
function castraTradeCard(s, extra){
  const st = castraStats(s), ing = CASTRA_INGENIA.find(i=>i.id===s.ingenium), ap = castraAppraisal(s), t = CASTRA_TYPE_LA[castraLine(s.line).type];
  return `<div style="padding:6px 0;border-top:1px solid #4a3d2c"><b>${s.insignis?"✨ ":""}${esc(castraSoldierName(s))}</b> <small>(${esc(t.sg)} · ${castraLaText("gradus")} ${s.lvl} · ${esc(ing?ing.nm:"")})</small><br>
    <small>${CASTRA_STATS.map(x=>x.nm.slice(0,3)+" "+st[x.id]).join(" · ")}</small>
    <div style="font-size:14px">${castraLaHTML(ap.la, ap.nl, "apr_"+ap.strong+"_"+ap.weak)}</div>${extra||""}</div>`;
}
function castraCommerciumHTML(){
  castraTradeAttach(); const T = CASTRA_T, me = castraTradeMine();
  if(!T) return `<div class="note">${castraLa("legio_inloggen")}</div>`;
  const offers = Object.keys(T.offers).map(k=>({ tid:k, ...T.offers[k] })).sort((a,b)=>b.ts-a.ts);
  const parsed = o=>castraTradeParse(o.give);
  const mineOpen = offers.filter(o=>o.from===me && o.status==="open");
  const mineDone = offers.filter(o=>o.from===me && o.status==="done");
  const others = offers.filter(o=>o.from!==me && o.status==="open");
  const tradable = CASTRA.soldiers.filter(castraTradeTradable);
  let h = `<div class="note">${castraLaText("milites")}: ${CASTRA.soldiers.length} / ${castraBarracksCap()}</div>`;
  if(mineDone.length) h += `<div class="note">✔ ${castraLa("commutatio_facta")} ${CASTRA.soldiers.length>=castraBarracksCap()?castraLa("castra_plena"):""}</div>`;
  // 1. eigen aanbod
  h += `<h4 style="margin:10px 0 4px">${castraLaText("oblata_mea")}</h4>` + (mineOpen.length ? mineOpen.map(o=>{ const s = parsed(o); return s ? castraTradeCard(s, `<button class="btn" onclick="castraTradeCancel('${o.tid}')">${castraLaText("revoca")}</button>`) : ""; }).join("") : `<div class="note">${castraLa("nihil_offerre")}</div>`);
  // 2. soldaat aanbieden
  h += `<h4 style="margin:10px 0 4px">${castraLaText("offer_militem")}</h4>` + (tradable.length ? tradable.map(s=>`<button class="btn" style="margin:2px 4px 2px 0" onclick="castraTradeOffer('${s.id}');castraPrincipiaOpen(true)">${esc(castraSoldierName(s))} ${castraLaText("gradus")} ${s.lvl}</button>`).join("") : `<div class="note">${castraLa("nullus_miles_idoneus")}</div>`);
  // 3. aanbod van anderen
  h += `<h4 style="margin:10px 0 4px">${castraLaText("oblata_aliorum")}</h4>` + (others.length ? others.map(o=>{
    const s = parsed(o); if(!s) return "";
    const choose = T.taking===o.tid
      ? `<div style="margin-top:4px"><small>${castraLaText("quem_das")}</small><br>${tradable.map(m=>`<button class="btn btn-gold" style="margin:2px 4px 2px 0" onclick="castraTradeTake('${o.tid}','${m.id}')">${esc(castraSoldierName(m))} ${castraLaText("gradus")} ${m.lvl}</button>`).join("") || castraLa("nullus_miles_idoneus")}</div>`
      : `<button class="btn btn-gold" ${tradable.length?"":"disabled"} onclick="CASTRA_T.taking='${o.tid}';castraPrincipiaOpen(true)">${castraLaText("commuta")}</button>`;
    return castraTradeCard(s, `<small>${esc(o.fn||"?")}</small> ${choose}`);
  }).join("") : `<div class="note">${castraLa("nulla_oblata")}</div>`);
  return h;
}
