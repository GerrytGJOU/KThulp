/* ============================================================================
   CERTAMEN — SYNERGIE DEEL 2 (zie CERTAMEN_CROSSMODE.md §8-§12)
   ----------------------------------------------------------------------------
   8.  Verder spelen   knop bovenaan het hoofdmenu: terug naar de laatst gespeelde modus
   9.  Metgezel        een Castra-soldaat of -held naast je avatar (profiel, Battle Mode, Castra-menu)
   10. Schola          oefenronde met je lastige woorden, in het Castra-menu
   11. Quaestio        optionele woordvraag tussen de golven van de wekelijkse uitdaging
   12. Klas-woordenoverzicht (docent) en Alleskunner-eerbewijzen
   Laadt NA crossmode.js (en dus na alle Castra-bestanden).
   ============================================================================ */

/* ---------- 8. Verder spelen ---------- */
const CX2_LAST_KEY = "cx_last_mode_v1";
const CX2_MODES = {
  castraHome:   { nm:"Castra Heronum",     icon:"🏕️", sub:"Terug naar je kamp." },
  singlePlayer: { nm:"Chronica Classica", icon:"📜", sub:"Ga verder met je reis." },
  battleHome:   { nm:"Battle Mode",       icon:"⚔️", sub:"Terug naar de arena." },
  totalWar:     { nm:"Total War",         icon:"🗺️", sub:"Terug naar de veldtocht." },
  freePractice: { nm:"Vrij oefenen",      icon:"🦉", sub:"Nog een rondje woorden." }
};
function cxLastMode(){ try{ const v = JSON.parse(localStorage.getItem(CX2_LAST_KEY)||"null"); return (v && CX2_MODES[v.s]) ? v : null; }catch(e){ return null; } }
function cxWhen(ts){
  const d = Math.floor((Date.now()-ts)/86400000);
  return d<1 ? "vandaag" : d===1 ? "gisteren" : d<14 ? d+" dagen geleden" : "";
}
Object.keys(CX2_MODES).forEach(k=>{
  if(typeof SCREENS==="undefined" || !SCREENS[k]) return; const f0 = SCREENS[k];
  SCREENS[k] = function(){ try{ localStorage.setItem(CX2_LAST_KEY, JSON.stringify({ s:k, t:Date.now() })); }catch(e){} return f0.apply(this, arguments); };
});
if(typeof SCREENS!=="undefined" && SCREENS.home){
  const _homeCX2 = SCREENS.home;
  SCREENS.home = function(){
    const r = _homeCX2.apply(this, arguments);
    try{
      const last = cxLastMode(), top = document.querySelector(".eyebrow.l");
      if(last && top){
        const m = CX2_MODES[last.s], when = cxWhen(last.t);
        top.insertAdjacentHTML("afterend", `<button class="tile tile-primary" onclick="go('${last.s}')">
          <span class="ic" style="font-size:40px;line-height:44px">▶</span>
          <h3>Verder spelen: ${m.icon} ${esc(m.nm)}</h3>
          <p>${esc(m.sub)}${when?" Laatst gespeeld "+when+".":""}</p></button>`);
      }
    }catch(e){}
    return r;
  };
}

/* ---------- 12a. Eerbewijzen over alle modi (Alleskunner) ---------- */
(function(){
  if(typeof ACHIEVEMENTS_DEF==="undefined") return;
  [
    { id:"weer_gewoon",   nm:"Weer gewoon",       ds:"10 lastige woorden weer gewoon gemaakt (in welke modus dan ook)", icon:"owl",    cat:"algemeen" },
    { id:"geheugenmeester",nm:"Geheugenmeester",  ds:"50 lastige woorden weer gewoon gemaakt",                         icon:"crown",  cat:"algemeen" },
    { id:"schola_vlijt",  nm:"Vlijtige leerling", ds:"10 rondes in de Schola van Castra Heronum afgerond",              icon:"column", cat:"algemeen" },
    { id:"quaestor",      nm:"Quaestor",          ds:"10 Quaestio-vragen goed in de wekelijkse uitdaging",             icon:"torch",  cat:"algemeen" },
    { id:"trouwe_metgezel",nm:"Trouwe metgezel",  ds:"Een metgezel gekozen uit je soldaten of helden",                 icon:"horse",  cat:"algemeen" },
    { id:"alleskunner",   nm:"Alleskunner",       ds:"Grote Reis, 10 lastige woorden verslagen en een foutloze Schola-ronde", icon:"laurel", cat:"algemeen" }
  ].forEach(a=>{ if(!ACHIEVEMENTS_DEF.some(x=>x.id===a.id)) ACHIEVEMENTS_DEF.push(a); });
})();
function cxStat(k){ try{ return P.stats[k]||0; }catch(e){ return 0; } }
function cxStatAdd(k, n){ try{ P.stats[k] = (P.stats[k]||0)+(n||1); saveProfile(); }catch(e){} }
function cxAward(id){
  try{
    if(typeof P==="undefined" || P.achievements.includes(id)) return;
    P.achievements.push(id); saveProfile();
    const def = ACHIEVEMENTS_DEF.find(a=>a.id===id); if(def && typeof toastAch==="function") toastAch(def);
  }catch(e){}
}
function cxCheckHonors(){
  try{
    if(cxStat("hwCleared")>=10) cxAward("weer_gewoon");
    if(cxStat("hwCleared")>=50) cxAward("geheugenmeester");
    if(cxStat("scholaRounds")>=10) cxAward("schola_vlijt");
    if(cxStat("quaestioGood")>=10) cxAward("quaestor");
    if(cxCompanionGet()) cxAward("trouwe_metgezel");
    if(P.achievements.includes("grote_reis") && cxStat("hwCleared")>=10 && cxStat("scholaPerfect")>=1) cxAward("alleskunner");
  }catch(e){}
}
// Een woord dat van "lastig" naar "gewoon" gaat (score 0), in welke modus dan ook, telt mee.
if(typeof hwNote==="function"){
  const _hwNoteCX2 = hwNote;
  hwNote = function(q, ok){
    let prev = 0; try{ prev = (hwMap()[(q && q.key) || recentKeyOf(q)])||0; }catch(e){}
    const n = _hwNoteCX2(q, ok);
    if(ok && prev>0 && n===0){ cxStatAdd("hwCleared"); cxCheckHonors(); }
    return n;
  };
}
if(typeof cxCheckAllModes==="function"){
  const _allModesCX2 = cxCheckAllModes;
  cxCheckAllModes = function(){ _allModesCX2(); cxCheckHonors(); };
}

/* ---------- 9. Metgezel ---------- */
const CX2_COMP_KEY = "cx_companion_v1";
function cxCompanionGet(){ try{ return JSON.parse(localStorage.getItem(CX2_COMP_KEY)||"null"); }catch(e){ return null; } }
function cxCompanionHTML(size){
  const c = cxCompanionGet(); if(!c) return "";
  try{
    if(c.t==="h"){ const d = CASTRA_HERO_DATA[c.id]; return d ? castraAvatarHTML(d.look, "down", 1, size) : ""; }
    return castraFsprHas(c.line,"td")===true ? castraFsprHTML(c.line,"td",size,"") : castraAvatarHTML(castraFormLook(castraLine(c.line)), "down", 1, size);
  }catch(e){ return ""; }
}
function cxCompBtn(t, id){
  const c = cxCompanionGet(), on = c && c.t===t && c.id===id;
  return `<button onclick="event.stopPropagation();cxSetCompanion('${t}','${id}')" style="margin-top:6px;min-height:40px;padding:4px 12px;font-size:14px;font-family:inherit;cursor:pointer;background:${on?"#e8c96a":"var(--parch2,#e9d9ac)"};color:var(--parch-ink,#2b1d0e);border:2px solid var(--parch-edge,#4a3416);border-radius:8px">🐾 ${on?"Je metgezel (tik om te wissen)":"Maak metgezel"}</button>`;
}
function cxSetCompanion(t, id){
  const cur = cxCompanionGet();
  if(cur && cur.t===t && cur.id===id){
    try{ localStorage.removeItem(CX2_COMP_KEY); }catch(e){} CASTRA.companion = null; castraSave();
    toast("🐾 Metgezel gewist", ""); if(typeof castraMenuRender==="function" && CASTRA_MENU.open) castraMenuRender(); return;
  }
  let c = null;
  if(t==="h"){ const d = CASTRA_HERO_DATA[id]; if(d) c = { t, id, nm:d.nm }; }
  else { const s = (CASTRA.soldiers||[]).find(x=>x.id===id); if(s) c = { t, id, nm:castraSoldierName(s), line:s.line }; }
  if(!c) return;
  try{ localStorage.setItem(CX2_COMP_KEY, JSON.stringify(c)); }catch(e){}
  CASTRA.companion = c; castraSave();
  toast("🐾 Nieuwe metgezel", c.nm+" loopt voortaan met je mee in je profiel en in Battle Mode");
  cxCheckHonors();
  if(typeof castraMenuRender==="function" && CASTRA_MENU.open) castraMenuRender();
}
// Kampsave -> apparaat: een metgezel gekozen op een ander apparaat komt hier ook binnen.
function cxCompanionSync(){
  try{
    if(typeof CASTRA==="undefined" || !CASTRA) return;
    const c = CASTRA.companion;
    if(c){
      const ok = c.t==="h" ? !!castraHero(c.id) : (CASTRA.soldiers||[]).some(s=>s.id===c.id);
      if(ok) localStorage.setItem(CX2_COMP_KEY, JSON.stringify(c));
      else { localStorage.removeItem(CX2_COMP_KEY); CASTRA.companion = null; }
    }
  }catch(e){}
}
// Battle Mode: metgezel naast je avatar op de tegel "Mijn profiel".
if(typeof SCREENS!=="undefined" && SCREENS.battleHome){
  const _bhCX2 = SCREENS.battleHome;
  SCREENS.battleHome = function(){
    const r = _bhCX2.apply(this, arguments);
    try{
      const h = cxCompanionHTML(34), t = document.querySelector("button[onclick=\"go('battleProfile')\"] .ic");
      if(h && t){ t.style.position = "relative"; t.insertAdjacentHTML("beforeend", `<span title="Je metgezel" style="position:absolute;right:-26px;bottom:-4px;width:34px;height:34px">${h}</span>`); }
    }catch(e){}
    return r;
  };
}

/* ---------- 10 + 11. Woordvragen: gedeelde helpers ---------- */
function cxPadPairs(){ return (typeof CASTRA_QUIZ_WORDS!=="undefined" ? CASTRA_QUIZ_WORDS : []).map(w=>({ la:w[0], nl:w[1] })); }
function cxQKey(la){ const e = cxLemmaIndex()[castraNorm(la)]; return e ? { la:e.la } : null; }
function cxShuffle(a){ return a.slice().sort(()=>Math.random()-0.5); }
function cxQItem(w, pad){
  const wrong = cxShuffle(pad.filter(x=>x.nl!==w.nl && x.la!==w.la)).slice(0,2).map(x=>x.nl);
  const opts = cxShuffle([w.nl].concat(wrong));
  return { la:w.la, nl:w.nl, opts, ans:opts.indexOf(w.nl), q:w.q || cxQKey(w.la), hard:!!w.hard, picked:null };
}
function cxHardItems(max){ return cxHardPairs(60).slice(0,max*3).sort(()=>Math.random()-0.5).slice(0,max).map(p=>({ la:p.la, nl:p.nl, q:{ key:p.key }, hard:true })); }
function cxQNote(it, ok){ try{ if(it.q) hwNote(it.q, ok); }catch(e){} }
function cxQOptsHTML(it, fn, style){
  return it.opts.map((o,k)=>{
    const done = it.picked!==null, good = k===it.ans, sel = it.picked===k;
    return `<button ${done?"disabled":""} onclick="${fn}(${k})" style="${style};${done&&good?"background:#e8c96a;":""}${done&&sel&&!good?"opacity:.55;text-decoration:line-through;":""}">${done&&good?"✔ ":""}${esc(o)}</button>`;
  }).join("");
}

/* ---------- 10. Schola (Castra-menu) ---------- */
let CX_SCH = { items:null, i:0, score:0, done:false, hardN:0 };
const CX_SCH_N = 8;
if(typeof CASTRA_MENU_ITEMS!=="undefined" && !CASTRA_MENU_ITEMS.some(x=>x.id==="schola")){
  const at = CASTRA_MENU_ITEMS.findIndex(x=>x.id==="sacculus");
  CASTRA_MENU_ITEMS.splice(at<0 ? CASTRA_MENU_ITEMS.length : at, 0, { id:"schola", la:"Schola", nl:"lastige woorden oefenen" });
}
if(typeof castraMenuView==="function"){
  const _mvCX2 = castraMenuView;
  castraMenuView = function(id){ return id==="schola" ? cxScholaHTML() : _mvCX2(id); };
}
function cxScholaStart(){
  const pad = cxPadPairs(); if(pad.length<4) return;
  const hard = cxHardItems(6), used = new Set(hard.map(h=>h.la));
  const fill = cxShuffle(pad).filter(w=>!used.has(w.la)).slice(0, CX_SCH_N-hard.length);
  const items = cxShuffle(hard.concat(fill)).map(w=>cxQItem(w, pad));
  CX_SCH = { items, i:0, score:0, done:false, hardN:hard.length };
  castraMenuRender();
}
function cxScholaPick(k){
  const Z = CX_SCH, it = Z.items && Z.items[Z.i]; if(!it || it.picked!==null) return;
  it.picked = k; const ok = k===it.ans; if(ok) Z.score++;
  cxQNote(it, ok);
  castraMenuRender();
}
function cxScholaNext(){
  const Z = CX_SCH;
  if(Z.i >= Z.items.length-1){
    Z.done = true;
    cxStatAdd("scholaRounds"); if(Z.score===Z.items.length) cxStatAdd("scholaPerfect");
    Z.reward = castraMasterXp(Z.score>=5 ? Z.score : 0, Z.score>=7 ? 2 : Z.score>=5 ? 1 : 0, "Schola");
    if(typeof castraPxpAdd==="function" && Z.score>=5) castraPxpAdd(Z.score);
    cxCheckHonors();
  } else Z.i++;
  castraMenuRender();
}
function cxScholaHTML(){
  const Z = CX_SCH, btn = "display:block;width:100%;margin:5px 0;min-height:46px;font-size:17px;font-family:inherit;cursor:pointer;background:var(--parch2,#e9d9ac);color:var(--parch-ink,#2b1d0e);border:2px solid var(--parch-edge,#4a3416);border-radius:8px";
  const head = `<h3 style="margin:0 0 6px">Schola <small>lastige woorden oefenen</small></h3>`;
  let nHard = 0; try{ nHard = Object.keys(hwMap()).length; }catch(e){}
  if(!Z.items){
    return head + `<div style="font-size:14px;margin-bottom:8px">${nHard ? "Je hebt <b>"+nHard+"</b> lastig"+(nHard===1?" woord":"e woorden")+". In de Schola oefen je er een paar, aangevuld met nieuwe woorden." : "Je hebt nog geen lastige woorden. Je kunt wel gewoon oefenen: fout beantwoorde woorden komen hier daarna vanzelf terug."}<br>Goed beantwoorden maakt een lastig woord weer gewoon, in alle modi. Profiel-XP volgt het dagplafond.</div>
      <button onclick="cxScholaStart()" style="${btn};background:#e8c96a">Begin (${CX_SCH_N} vragen)</button>`;
  }
  if(Z.done){
    return head + `<div style="font-size:22px;margin:6px 0">Score: <b>${Z.score} / ${Z.items.length}</b></div>
      <div style="font-size:14px;margin-bottom:8px">${Z.score>=5 ? (Z.reward ? "🎓 Profiel: +"+Z.reward+" XP." : "Het dagplafond voor profiel-XP is vandaag bereikt, oefenen mag altijd.") : "Vanaf 5 goed levert een ronde XP op. Probeer het nog eens!"}${Z.score===Z.items.length?" Foutloos! 🏛️":""}</div>
      <button onclick="cxScholaStart()" style="${btn};background:#e8c96a">Nog een ronde</button>
      <button onclick="CX_SCH={items:null};castraMenuRender()" style="${btn}">Klaar</button>`;
  }
  const it = Z.items[Z.i];
  return head + `<div style="font-size:13px;opacity:.7">Vraag ${Z.i+1} van ${Z.items.length}${it.hard?" · een lastig woord van jou":""}</div>
    <div style="font-size:26px;margin:8px 0">Wat betekent <b>${esc(it.la)}</b>?</div>
    ${cxQOptsHTML(it, "cxScholaPick", btn)}
    ${it.picked!==null?`<button onclick="cxScholaNext()" style="${btn};background:#e8c96a">${Z.i>=Z.items.length-1?"Uitslag":"Volgende"}</button>`:""}`;
}

/* ---------- 11. Quaestio (wekelijkse uitdaging, tussen de golven) ---------- */
function cxQuaestioMake(){
  const pad = cxPadPairs(); if(pad.length<4) return null;
  const hard = cxHardItems(1)[0];
  return cxQItem(hard || cxShuffle(pad)[0], pad);
}
if(typeof castraBOfer==="function"){
  const _oferCX2 = castraBOfer;
  castraBOfer = function(){
    _oferCX2.apply(this, arguments);
    try{
      const B = CASTRA_B, s = B && B.sim;
      if(!B || !B.mission || !B.mission.weekly || B.legio || B.endless || s.over || s.waveActive || s.wave<0 || s.wave>=B.mission.waves.length-1 || B.qstFor===s.wave) return;
      B.qstFor = s.wave; B.qst = cxQuaestioMake(); B.ctlSig = null; castraBRenderCtl();
    }catch(e){}
  };
}
if(typeof castraBRenderCtl==="function"){
  const _rcCX2 = castraBRenderCtl;
  castraBRenderCtl = function(){
    _rcCX2.apply(this, arguments);
    try{
      const B = CASTRA_B, c = el("cbCtl");
      if(!B || !c || !B.qst || B.sim.waveActive || B.sim.over || B.legio || c.querySelector("#cxQst")) return;
      c.insertAdjacentHTML("afterbegin", cxQuaestioHTML(B.qst));
    }catch(e){}
  };
}
function cxQuaestioHTML(it){
  const done = it.picked!==null, ok = done && it.picked===it.ans;
  const btn = "margin:3px 6px 3px 0;min-height:44px;font-size:16px";
  return `<div id="cxQst" style="margin:8px 0;padding:8px;border:2px solid #8fb4d8;border-radius:10px;background:rgba(100,150,210,.12)">
    <div style="font-size:16px;margin-bottom:6px">🎓 <b>Quaestio</b> <small>(optioneel: goed = +1 leven voor het kamp)</small></div>
    <div style="font-size:20px;margin-bottom:4px">Wat betekent <b>${esc(it.la)}</b>?</div>
    ${it.opts.map((o,k)=>`<button class="btn ${done&&k===it.ans?"btn-gold":""}" ${done?"disabled":""} style="${btn}${done&&it.picked===k&&k!==it.ans?";opacity:.55;text-decoration:line-through":""}" onclick="cxQuaestioPick(${k})">${done&&k===it.ans?"✔ ":""}${esc(o)}</button>`).join("")}
    ${done?`<div class="note" style="margin-top:4px">${ok?"Recte! 🛡️ +1 leven voor het kamp.":"Niet erg, dit woord komt later terug. Het kamp verliest niets."}</div>`:`<button class="btn" style="min-height:36px;font-size:13px;margin-left:4px" onclick="cxQuaestioSkip()">Overslaan</button>`}
  </div>`;
}
function cxQuaestioRefresh(){ const B = CASTRA_B; if(!B) return; const n = el("cxQst"); if(n) n.remove(); B.ctlSig = null; castraBRenderCtl(); }
function cxQuaestioPick(k){
  const B = CASTRA_B, it = B && B.qst; if(!it || it.picked!==null) return;
  it.picked = k; const ok = k===it.ans;
  cxQNote(it, ok);
  if(ok){
    B.sim.baseHp += 1; castraBRenderHud();
    cxStatAdd("quaestioGood"); castraMasterXp(1, 0, "Quaestio"); cxCheckHonors();
  }
  cxQuaestioRefresh();
}
function cxQuaestioSkip(){ const B = CASTRA_B; if(!B) return; B.qst = null; cxQuaestioRefresh(); }

/* ---------- 9b. De metgezel vraagt af en toe naar een lastig woord (geen melding, geen straf) ---------- */
const CX2_ASK_KEY = "cx_comp_ask_v1", CX2_ASK_GAP = 20*60000, CX2_ASK_DAY = 3;
let CX_ASK = null;
function cxAskMeta(){ try{ return JSON.parse(localStorage.getItem(CX2_ASK_KEY)||"{}")||{}; }catch(e){ return {}; } }
function cxAskClose(){ const n = document.getElementById("cxAsk"); if(n) n.remove(); CX_ASK = null; }
function cxCompanionAsk(){
  try{
    if(!el("castraMap") || document.getElementById("cxAsk") || (typeof CASTRA_B!=="undefined" && CASTRA_B && el("cbMap"))) return;
    const c = cxCompanionGet(); if(!c) return;
    const hard = cxHardItems(1)[0], pad = cxPadPairs(); if(!hard || pad.length<4) return;
    const m = cxAskMeta(), day = new Date().toISOString().slice(0,10), n = m.day===day ? (m.n||0) : 0;
    if(n>=CX2_ASK_DAY || Date.now()-(m.t||0) < CX2_ASK_GAP) return;
    try{ localStorage.setItem(CX2_ASK_KEY, JSON.stringify({ t:Date.now(), day, n:n+1 })); }catch(e){}
    CX_ASK = cxQItem(hard, pad); CX_ASK.nm = c.nm;
    const box = document.createElement("div"); box.id = "cxAsk";
    box.style.cssText = "position:fixed;left:12px;bottom:12px;z-index:9985;max-width:min(360px,calc(100vw - 24px));background:linear-gradient(var(--parch,#efe1b9),var(--parch2,#e4d2a1));color:var(--parch-ink,#2b1d0e);border:3px solid var(--parch-edge,#4a3416);border-radius:12px;box-shadow:0 0 0 2px var(--parch-gold,#c9a24a),0 6px 20px rgba(0,0,0,.5);padding:10px 12px;font-family:inherit";
    document.body.appendChild(box); cxAskRender();
  }catch(e){}
}
function cxAskRender(){
  const box = document.getElementById("cxAsk"), it = CX_ASK; if(!box || !it) return;
  const btn = "display:block;width:100%;margin:4px 0;min-height:42px;font-size:15px;text-align:left;font-family:inherit;cursor:pointer;background:var(--parch2,#e9d9ac);color:var(--parch-ink,#2b1d0e);border:2px solid var(--parch-edge,#4a3416);border-radius:8px;padding:4px 10px";
  const done = it.picked!==null, ok = done && it.picked===it.ans;
  box.innerHTML = `<div style="display:flex;gap:10px;align-items:flex-start"><div style="flex:0 0 44px;width:44px;height:44px;position:relative">${cxCompanionHTML(44)}</div>
    <div style="flex:1;min-width:0"><div style="font-size:14px"><b>${esc(it.nm)}</b> vraagt: wat betekent <b>${esc(it.la)}</b>?</div>
    ${done ? `<div style="font-size:14px;margin-top:6px">${ok ? "Recte! 🐾" : "Dat woord betekent <b>"+esc(it.nl)+"</b>. We oefenen het straks nog eens."}</div>`
           : `${it.opts.map((o,k)=>`<button style="${btn}" onclick="cxAskPick(${k})">${esc(o)}</button>`).join("")}<button style="${btn};min-height:34px;font-size:13px;opacity:.75" onclick="cxAskClose()">Later</button>`}</div>
    <button onclick="cxAskClose()" aria-label="Sluiten" style="flex:0 0 auto;min-width:34px;min-height:34px;font-size:16px;font-family:inherit;cursor:pointer;background:var(--parch2,#e9d9ac);color:var(--parch-ink,#2b1d0e);border:2px solid var(--parch-edge,#4a3416);border-radius:8px">✕</button></div>`;
}
function cxAskPick(k){
  const it = CX_ASK; if(!it || it.picked!==null) return;
  it.picked = k; const ok = k===it.ans;
  cxQNote(it, ok);
  if(ok) castraMasterXp(1, 0, "Woord van je metgezel");
  cxAskRender(); setTimeout(cxAskClose, ok ? 2200 : 4200);
}

/* ---------- 12b. Docent: klas-woordenoverzicht (anoniem, uit de bestaande leerlingprofielen) ---------- */
function cxClassHardAgg(){
  const byKey = {};
  (typeof VOCAB_LA!=="undefined" ? VOCAB_LA : []).forEach(w=>{ byKey[recentKeyOf({ la:w.la })] = { la:String(w.la).split(/[,(]/)[0].trim(), nl:String(w.nl||"").split(/[;,]/)[0].trim().slice(0,32), lang:"la" }; });
  const agg = {}; let students = 0, withHw = 0;
  Object.values(_tpRoster||{}).forEach(s=>{
    if(!s || typeof s!=="object") return; students++;
    const hw = s.hardWords || {}, ks = Object.keys(hw); if(ks.length) withHw++;
    ks.forEach(k=>{ const a = agg[k] || (agg[k] = { key:k, n:0, sum:0 }); a.n++; a.sum += hw[k]||0; });
  });
  const rows = Object.values(agg).map(a=>{ const w = byKey[a.key]; return { key:a.key, n:a.n, avg:a.sum/a.n, la:w?w.la:a.key.replace(/^w:/,""), nl:w?w.nl:"", known:!!w }; })
    .sort((a,b)=>b.n-a.n || b.avg-a.avg);
  return { rows, students, withHw };
}
function cxRenderClassHard(){
  const cont = el("tpHardWords"); if(!cont) return;
  const A = cxClassHardAgg();
  if(!A.withHw){ cont.innerHTML = `<div class="panel"><h3>Lastige woorden van de klas</h3><div class="note">Nog geen gegevens: lastige woorden verschijnen zodra ingelogde leerlingen woorden fout beantwoorden (in Battle Mode, Training, Vrij oefenen of Castra Heronum).</div></div>`; return; }
  const top = A.rows.slice(0,15);
  cont.innerHTML = `<div class="panel"><h3>Lastige woorden van de klas</h3>
    <div class="note">${A.withHw} van ${A.students} leerlingen hebben lastige woorden. Alleen aantallen per woord, geen namen. Bron: alle modi samen.</div>
    <table class="bm-tbl"><thead><tr><th>Woord</th><th>Betekenis</th><th>Leerlingen</th><th>Gem. moeilijkheid</th></tr></thead><tbody>
    ${top.map(r=>`<tr><td>${esc(r.la)}</td><td>${esc(r.nl)}</td><td>${r.n}</td><td>${r.avg.toFixed(1)} / ${HW_MAX_SCORE}</td></tr>`).join("")}</tbody></table>
    <button class="btn btn-gold" style="margin-top:10px" onclick="cxMakeClassList()">Maak een woordenlijst van de lastigste woorden</button>
    <div class="note" style="margin-top:4px">De lijst (max. 20 Latijnse woorden) wordt gedeeld met je klassen: leerlingen zien hem in Castra Heronum (woordenquiz) en in Ludus.</div></div>`;
}
function cxMakeClassList(){
  const words = cxClassHardAgg().rows.filter(r=>r.known && r.nl).slice(0,20).map(r=>({ la:r.la, nl:r.nl }));
  if(words.length<4){ toast("Te weinig woorden", "Er zijn nog te weinig lastige woorden om een lijst te maken."); return; }
  if(!confirm("Een gedeelde woordenlijst maken met de "+words.length+" lastigste woorden van deze klas?")) return;
  const name = "Lastige woorden "+new Date().toLocaleDateString("nl-NL");
  teacherNet().saveWordlist(null, { name, lang:"la", words, shared:true })
    .then(()=>toast("Lijst gemaakt", name+" staat nu bij je woordenlijsten en is gedeeld."))
    .catch(e=>toast("Mislukt", typeof e==="string" ? e : (e&&e.message)||""));
}
if(typeof SCREENS!=="undefined" && SCREENS.teacherClass){
  const _tcCX2 = SCREENS.teacherClass;
  SCREENS.teacherClass = function(){
    const r = _tcCX2.apply(this, arguments);
    try{ const l = el("tpStudentList"); if(l && !el("tpHardWords")) l.insertAdjacentHTML("beforebegin", `<div id="tpHardWords"></div>`); }catch(e){}
    return r;
  };
}
if(typeof tpLoadRoster==="function"){
  const _tlrCX2 = tpLoadRoster;
  tpLoadRoster = function(){
    const p = _tlrCX2.apply(this, arguments);
    return (p && p.then) ? p.then(v=>{ try{ cxRenderClassHard(); }catch(e){} return v; }) : p;
  };
}

/* ---------- opstarten ---------- */
if(typeof SCREENS!=="undefined" && SCREENS.castraHome){
  const _chCX2 = SCREENS.castraHome;
  SCREENS.castraHome = function(){ const r = _chCX2.apply(this, arguments); cxCompanionSync(); setTimeout(cxCompanionAsk, 2500); return r; };
}
setTimeout(()=>{ try{ cxCheckHonors(); }catch(e){} }, 1500);
