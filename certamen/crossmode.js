/* ============================================================================
   CERTAMEN — SYNERGIE TUSSEN DE MODI (cross-mode)
   ----------------------------------------------------------------------------
   Eén plek voor alles wat modi met elkaar verbindt, zodat het niet over
   battle.js, singleplayer.js en de Castra-bestanden verspreid raakt:

   1. Chronica Classica → Battle/Boss/Total War: één bonus-eretitel per voltooid
      Boek (CX_BOOKS, Chronica.md §6.1). De bonussen werken nu echt (spBonusVal,
      aangeroepen vanuit battle.js): bescheiden, scope battle/boss/totalwar.
      Titels worden vanzelf (ook met terugwerkende kracht) toegekend op basis van de
      voortgang in de opgeslagen Chronica-slots (cxSyncBookTitles).
   2. Chronica → Castra Heroum: elk voltooid Boek (en de Finale) geeft eenmalig een
      kaarttrekking in Castra (cxCastraBookTokens).
   3. Castra → gedeeld profiel: Latijn-acties (woordenquiz, wekelijkse woordvraag,
      opgezochte woorden) geven profiel-XP en munten met een dagplafond
      (castraMasterXp). Gevechten niet: XP blijft aan het leerdoel gekoppeld.
   4. Castra → Battle Mode (cosmetisch): "Castra Goud"-avatar (battle-data.js) en,
      zonder gekozen Chronica-titel, een Castra-titel als label in de lobby.
   5. Battle Mode → Castra: klasse-affiniteit. Per mastery-ster in een klasse +2% XP
      voor Castra-soldaten van die klasse (max. +10%).
   6. Woordenbrug: opgezochte woorden in Castra voeden de lijst met moeilijke woorden
      (core.js hwNote); die woorden en de docentlijsten van de klas komen terug in
      de Castra-quiz. Scherm "Mijn lastige woorden" met een oefenknop.
   7. Profiel: Castra-sectie in "Mijn profiel" en het eerbewijs "Grote Reis".
   Laadt NA alle Castra-bestanden, battle.js en singleplayer.js.
   ============================================================================ */

/* ---------- 1. Chronica-boeken: bonus-eretitels ---------- */
const CX_BOOKS = [
  { n:1, next:10, id:"kroniekschrijver_boek_1", nm:"Kroniekschrijver van Boek I", ds:"Voltooide Boek I, De Ontwaakte Herinnering (hoofdstuk 1 t/m 9).",
    bonus:{ type:"streak_shield", val:1, desc:"Eén fout antwoord per wedstrijd breekt je reeks niet" } },
  { n:2, next:15, id:"kroniekschrijver_boek_2", nm:"Kroniekschrijver van Boek II", ds:"Voltooide Boek II, Helden en Koningen (hoofdstuk 10 t/m 14).",
    bonus:{ type:"be_head_start", val:5, desc:"Elke wedstrijd begint met +5 AP" } },
  { n:3, next:18, id:"kroniekschrijver_boek_3", nm:"Kroniekschrijver van Boek III", ds:"Voltooide Boek III, De Wereld van Mensen (hoofdstuk 15 t/m 17).",
    bonus:{ type:"coin_bonus_pct", val:5, desc:"+5% munten na een wedstrijd" } },
  { n:4, next:24, id:"kroniekschrijver_boek_4", nm:"Kroniekschrijver van Boek IV", ds:"Voltooide Boek IV, Rome Verrijst (hoofdstuk 18 t/m 23).",
    bonus:{ type:"first_answer_free", val:1, desc:"Je eerste antwoord van elke wedstrijd telt voor AP altijd als goed" } },
  { n:5, next:28, id:"kroniekschrijver_boek_5", nm:"Kroniekschrijver van Boek V", ds:"Voltooide Boek V, Erfenis van een Rijk (hoofdstuk 24 t/m 27).",
    bonus:{ type:"coin_bonus_pct", val:5, desc:"+5% munten na een wedstrijd (samen met Boek III maximaal +10%)" } },
];
(function(){
  if(typeof SP_TITLES==="undefined") return;
  CX_BOOKS.forEach(b=>{ if(!SP_TITLES.some(t=>t.id===b.id)) SP_TITLES.push({ id:b.id, nm:b.nm, icon:"star", cat:"chronica", secret:true, ds:b.ds,
    bonus:{ scope:["battle","boss","totalwar"], type:b.bonus.type, val:b.bonus.val, desc:b.bonus.desc } }); });
})();
function cxChronicaDepth(){
  let d = -1; try{ Object.values(spSlotsLoadLocal()).forEach(s=>{ d = Math.max(d, spSlotProgressDepth(s)); }); }catch(e){}
  return d;
}
// Boeken (1–5, en 6 = Finale gehaald) die de speler in zijn Chronica-saves heeft afgerond.
function cxBooksDone(){
  const d = cxChronicaDepth(), out = []; CX_BOOKS.forEach(b=>{ if(d>=b.next) out.push(b.n); });
  if(typeof bmChronicaFinaleVoltooid==="function" && bmChronicaFinaleVoltooid()) out.push(6);
  return out;
}
function cxSyncBookTitles(){
  try{
    const done = cxBooksDone();
    CX_BOOKS.forEach(b=>{ if(done.includes(b.n)) spAwardTitle(b.id); });
    if(done.includes(6)) spAwardTitle("meester_der_herinnering");
  }catch(e){}
}
// Som van een bonussoort over alle behaalde eretitels (plafond per soort), voor een modus (scope).
function spBonusVal(type, scope){
  let sum = 0;
  try{
    const have = spTitlesLoadLocal();
    SP_TITLES.forEach(t=>{ if(t.bonus && have.includes(t.id) && t.bonus.type===type && (!scope || (t.bonus.scope||[]).includes(scope))) sum += t.bonus.val||0; });
  }catch(e){}
  return type==="coin_bonus_pct" ? Math.min(sum,10) : sum;
}
function bmBonusScope(){ return (typeof BM_META!=="undefined" && BM_META) ? (BM_META.garrisonProvince ? "totalwar" : BM_META.mode==="boss" ? "boss" : "battle") : "battle"; }
// Chronica-titels worden ook tijdens het spelen van Chronica toegekend (na elke save) en bij het openen van de hoofdmenu's.
if(typeof spSaveProgress==="function"){
  const _spSaveProgressCX0 = spSaveProgress;
  spSaveProgress = async function(patch){ const r = await _spSaveProgressCX0(patch); cxSyncBookTitles(); return r; };
}
["home","battleHome","collection","singlePlayer"].forEach(k=>{
  if(!SCREENS[k]) return; const f0 = SCREENS[k];
  SCREENS[k] = function(){ cxSyncBookTitles(); cxCheckAllModes(); return f0.apply(this, arguments); };
});

/* ---------- 2. Chronica → Castra: kaarttrekkingen ---------- */
function cxCastraBookTokens(){
  if(typeof CASTRA==="undefined" || !CASTRA) return;
  const done = cxBooksDone(), paid = CASTRA.cxPaid || (CASTRA.cxPaid = {}); let n = 0;
  done.forEach(b=>{ const k = "b"+b; if(!paid[k]){ paid[k] = 1; n++; } });
  if(typeof bmChronicaFinaleVoltooid==="function" && bmChronicaFinaleVoltooid() && !paid.fin){ paid.fin = 1; n++; }
  if(n && typeof castraCardToken==="function"){
    castraCardToken(n, "Chronica Classica", true); castraSave();
    setTimeout(()=>toast("📜 Chronica → Castra", "+"+n+" kaarttrekking"+(n>1?"en":"")+" voor je voortgang in Chronica Classica"), 700);
  }
}

/* ---------- 3. Castra → profiel: XP en munten voor Latijn-acties (dagplafond) ---------- */
const CX_MXP_CAP = { xp:30, co:12, words:5 };
function cxMxp(){ const day = castraWDay(); return (CASTRA.mxp && CASTRA.mxp.d===day) ? CASTRA.mxp : (CASTRA.mxp = { d:day, xp:0, co:0, words:[], hw:[] }); }
function castraMasterXp(xp, coins, why){
  if(typeof CASTRA==="undefined" || !CASTRA || typeof addXP!=="function") return 0;
  const m = cxMxp(), x = Math.max(0, Math.min(xp||0, CX_MXP_CAP.xp - m.xp)), c = Math.max(0, Math.min(coins||0, CX_MXP_CAP.co - m.co));
  if(x<=0 && c<=0) return 0;
  m.xp += x; m.co += c; castraSave();
  if(x>0) addXP(x); if(c>0 && typeof addCoins==="function") addCoins(c);
  toast("🎓 Profiel: +"+x+" XP"+(c ? " · +"+c+" "+(typeof bmCoinName==="function" ? bmCoinName() : "munten") : ""), why || "Latijn geoefend");
  return x;
}
if(typeof castraQuizReward==="function"){
  const _castraQuizRewardCX0 = castraQuizReward;
  castraQuizReward = function(){
    const Z = CASTRA_QUIZ, had = Z && Z.paid, t = _castraQuizRewardCX0();
    if(Z && !had && t && Z.score>=3) castraMasterXp(Z.score*2, Z.score, "Woordenquiz");
    return t;
  };
}

/* ---------- 6. Woordenbrug ---------- */
let _cxLemmaIdx = null;
function cxLemmaIndex(){
  if(_cxLemmaIdx) return _cxLemmaIdx; _cxLemmaIdx = {};
  if(typeof VOCAB_LA==="undefined") return _cxLemmaIdx;
  VOCAB_LA.forEach(w=>{ const head = String(w.la||"").split(/[,(]/)[0].trim(); const k = castraNorm(head); if(k && !_cxLemmaIdx[k]) _cxLemmaIdx[k] = w; });
  return _cxLemmaIdx;
}
// Opzoeken van een woord in Castra: één keer per woord per dag telt als "lastig" (hwNote) en levert (tot 5 per dag) 1 XP op.
function cxLookup(wNorm){
  try{
    if(typeof CASTRA==="undefined" || !CASTRA || !wNorm) return;
    const m = cxMxp();
    if(CASTRA_GLOSS[wNorm] && !m.words.includes(wNorm) && m.words.length < CX_MXP_CAP.words){ m.words.push(wNorm); castraMasterXp(1, 0, "Woord opgezocht"); }
    const e = cxLemmaIndex()[wNorm];
    if(e && !m.hw.includes(wNorm) && typeof hwNote==="function"){ m.hw.push(wNorm); hwNote({ la:e.la }, false); castraSave(); }
  }catch(err){}
}
if(typeof castraTapWord==="function"){
  const _castraTapWordCX0 = castraTapWord;
  castraTapWord = function(ev, node){ _castraTapWordCX0(ev, node); try{ cxLookup(node.getAttribute("data-w")); }catch(e){} };
}
// Moeilijke woorden van de speler als [la, nl]-paren (voor de Castra-quiz en het scherm "Mijn lastige woorden").
function cxHardPairs(max){
  const out = []; let map = {}; try{ map = hwMap(); }catch(e){}
  const byKey = {}; if(typeof VOCAB_LA!=="undefined") VOCAB_LA.forEach(w=>{ byKey[recentKeyOf({ la:w.la })] = w; });
  Object.keys(map).sort((a,b)=>map[b]-map[a]).forEach(k=>{
    const w = byKey[k]; if(!w) return;
    out.push({ la:String(w.la).split(/[,(]/)[0].trim(), nl:String(w.nl||"").split(/[;,]/)[0].trim().slice(0,32), score:map[k], key:k });
  });
  return max ? out.slice(0,max) : out;
}
// Docentlijsten van de eigen klas (klascodes/{KLAS}/wordlists, Latijn), lokaal gecachet; eenmalig vers ophalen per sessie.
const CX_TL_KEY = "castra_tlists_v1";
let CX_TLISTS = [], _cxTlFetched = false;
(function(){ try{ const c = JSON.parse(localStorage.getItem(CX_TL_KEY)||"null"), id = (typeof bmIdentLoad==="function") ? bmIdentLoad() : null; if(c && id && id.klascode && c.klas===String(id.klascode).toUpperCase()) CX_TLISTS = c.lists||[]; }catch(e){} })();
async function cxLoadTeacherLists(){
  if(_cxTlFetched) return; const id = (typeof bmIdentLoad==="function") ? bmIdentLoad() : null;
  if(!id || !id.klascode || typeof initFirebase!=="function" || !initFirebase() || typeof fbDB==="undefined" || !fbDB) return;
  _cxTlFetched = true;
  try{
    const klas = String(id.klascode).toUpperCase(), v = (await fbDB.ref("klascodes/"+klas+"/wordlists").once("value")).val() || {};
    const lists = Object.keys(v).map(k=>v[k]).filter(l=>l && l.lang==="la").map(l=>({ name:String(l.name||"Lijst"), words:(Array.isArray(l.words)?l.words:Object.values(l.words||{})).filter(w=>w&&w.la&&w.nl).map(w=>({ la:String(w.la).split(/[,(]/)[0].trim(), nl:String(w.nl).split(/[;,]/)[0].trim().slice(0,32) })) })).filter(l=>l.words.length);
    CX_TLISTS = lists; try{ localStorage.setItem(CX_TL_KEY, JSON.stringify({ klas, lists })); }catch(e){}
  }catch(e){ _cxTlFetched = false; }
}
// Extra woorden voor de Castra-quiz: tot 2 moeilijke woorden van de speler en tot 2 woorden van de docentlijsten.
function cxQuizExtras(){
  const out = [], seen = new Set();
  cxHardPairs(2).forEach(p=>{ if(!seen.has(p.la)){ seen.add(p.la); out.push([p.la, p.nl]); } });
  const all = CX_TLISTS.reduce((a,l)=>a.concat(l.words), []);
  for(let i=0, n=0; i<12 && n<2 && all.length; i++){ const w = all[Math.floor(Math.random()*all.length)]; if(!seen.has(w.la)){ seen.add(w.la); out.push([w.la, w.nl]); n++; } }
  return out;
}

/* ---------- 5. Klasse-affiniteit: Battle Mode-mastery → Castra-soldaten ---------- */
function cxMasteryStars(cid){
  try{ const id = (typeof bmIdentLoad==="function" && bmIdentLoad()) || BM_IDENT; const h = id && id.classHistory && id.classHistory[cid]; return h ? Math.min(5, bmCalcMastery(h)) : 0; }catch(e){ return 0; }
}
function castraAffinityPct(unit){
  try{ if(!unit || unit.hero) return 0; const cid = castraFormClassId(castraLine(unit.line)); return cid ? cxMasteryStars(cid)*2 : 0; }catch(e){ return 0; }
}

/* ---------- 4. Castra → Battle Mode: titel in de lobby ---------- */
function cxCastraTitleLabel(){
  try{ if(typeof castraLoad==="function" && !CASTRA) castraLoad(); const t = (typeof castraTitle==="function") ? castraTitle() : null; return t ? "Castra: "+t.title : ""; }catch(e){ return ""; }
}

/* ---------- 7. Profiel: Castra-sectie, Mijn lastige woorden, Grote Reis ---------- */
function cxCastraSectionHTML(){
  try{
    if(typeof CASTRA==="undefined" || !CASTRA) castraLoad();
    const lv = castraPLevelInfo(), seen = Object.keys(CASTRA.codex||{}).length, total = CASTRA_FORM_LIST.length;
    const done = CASTRA_P_MISSIONS.filter(m=>castraPMissionDone(m.id)).length, heroes = (CASTRA.heroes||[]).length, t = (typeof castraTitle==="function") ? castraTitle() : null;
    const aff = [["hopliet","Hopliet"],["spartaan","Voorvechter"],["boogschutter","Boogschutter"],["cavalerie","Cavalerie"],["priester","Priester"],["centurio","Bevelvoerder"],["genie","Genie"],["verkenner","Verkenner"]]
      .map(([id,nm])=>[nm,cxMasteryStars(id)]).filter(x=>x[1]>0).map(([nm,s])=>`${nm} ${"★".repeat(s)} (+${s*2}% XP)`);
    const W = (typeof castraWkState==="function") ? castraWkState() : null;
    const stat = (k,v)=>`<div style="display:flex;justify-content:space-between;font-size:14px;margin-top:3px"><span class="note" style="margin:0">${k}</span><b>${v}</b></div>`;
    const av = (typeof BM_IDENT!=="undefined" && BM_IDENT && BM_IDENT.avatar && typeof renderPixelHeroIcon==="function") ? renderPixelHeroIcon(BM_IDENT.avatar,64) : "";
    return `<div class="eyebrow l" style="margin-top:20px">🏕️ Castra Heroum</div>
    <div class="panel">
      <div style="display:flex;gap:14px;align-items:center;margin-bottom:10px">
        ${av?`<div style="flex:0 0 auto">${av}</div>`:""}
        <div style="flex:1;min-width:0"><div style="font-size:18px;font-weight:700">Castra-niveau ${lv.L}</div>
          ${t?`<div class="pill" style="margin:4px 0 0">${esc(t.title)}</div>`:`<div class="note">Ontmoet soldaten in de codex om een titel te verdienen.</div>`}</div></div>
      <div style="height:8px;background:var(--stone3);border-radius:4px;overflow:hidden"><div style="height:100%;width:${lv.pct}%;background:linear-gradient(90deg,var(--hi-dim),var(--hi-bright));border-radius:4px"></div></div>
      <div class="note" style="margin:3px 0 8px">${lv.x-lv.a} / ${lv.b-lv.a} XP tot niveau ${lv.L+1}${lv.next?` · volgende ontgrendeling: niveau ${lv.next.lvl}`:""}</div>
      ${stat("Soldaten", (CASTRA.soldiers||[]).length)}${stat("Helden", heroes+" / "+Object.keys(CASTRA_HERO_DATA||{}).length)}
      ${stat("Codex", seen+" / "+total)}${stat("Missies gewonnen", done+" / "+CASTRA_P_MISSIONS.length)}
      ${W&&W.id?stat("Wekelijkse uitdaging", W.win?"record "+W.best:"nog niet gewonnen"):""}
      ${aff.length?`<div class="note" style="font-weight:700;margin:10px 0 2px">Klasse-affiniteit uit Battle Mode</div><div class="note">${aff.map(esc).join(" · ")}</div>`:`<div class="note" style="margin-top:8px">Klasse-affiniteit: verdien sterren in Battle Mode en je soldaten van die klasse krijgen tot +10% extra XP.</div>`}
      <button class="btn btn-ghost btn-block" style="margin-top:10px;font-size:13px" onclick="go('castraHome')">Open Castra Heroum</button>
    </div>`;
  }catch(e){ return ""; }
}
function cxHardWordsCardHTML(){
  let n = 0; try{ n = Object.keys(hwMap()).length; }catch(e){}
  return `<div class="eyebrow l" style="margin-top:20px">🧠 Mijn lastige woorden</div>
    <div class="panel"><div class="note" style="margin:0 0 8px">${n ? "Je hebt "+n+" woorden die je vaker moet oefenen. Ze komen in alle modi vaker terug, ook in Castra." : "Nog geen lastige woorden. Fout beantwoorde of opgezochte woorden verschijnen hier vanzelf."}</div>
      <button class="btn btn-ghost btn-block" style="font-size:13px" onclick="go('myHardWords')">Bekijk en oefen</button></div>`;
}
SCREENS.myHardWords = function(){
  document.body.classList.remove("greek");
  const list = cxHardPairs();
  const rows = list.length ? list.map(p=>`<div style="display:flex;align-items:center;gap:10px;margin:6px 0">
      <div style="flex:1;min-width:0"><b style="font-size:17px">${esc(p.la)}</b> <span class="note" style="margin:0">${esc(p.nl)}</span></div>
      <div style="width:86px;height:8px;background:var(--stone3);border-radius:4px;overflow:hidden" title="hoe lastig: ${p.score} van ${HW_MAX_SCORE}"><div style="height:100%;width:${Math.round(100*p.score/HW_MAX_SCORE)}%;background:var(--ox)"></div></div></div>`).join("")
    : `<div class="note">Nog geen lastige woorden die in de woordenlijst staan. Speel een paar rondes of zoek woorden op in Castra Heroum.</div>`;
  H(brand(true)+`
  <div class="scrhead"><button class="back" onclick="go('collection')">${iconSVG("shield",20,"currentColor")}</button><h2>🧠 Mijn lastige woorden</h2></div>
  <div class="panel"><div class="note" style="margin:0 0 8px">De woorden die je het vaakst fout had of opzocht. Hoe voller de balk, hoe lastiger. Goed beantwoorden maakt een woord weer gewoon.</div>${rows}
    ${list.length?`<button class="btn btn-gold btn-block" style="margin-top:12px" onclick="cxPracticeHard()">Oefen deze woorden</button>`:""}</div>
  ${foot()}`);
};
// Oefenen: de lastige woorden aangevuld met veelvoorkomende woorden tot minimaal 25 (de pool van Vrij oefenen).
function cxPracticeHard(){
  const hard = cxHardPairs().map(p=>({ la:p.la, nl:p.nl, pos:"" }));
  const seen = new Set(hard.map(w=>w.la)), pad = [];
  (typeof VOCAB_LA!=="undefined" ? VOCAB_LA : []).filter(w=>(w.f||0)>0 && (w.f||0)<=300 && w.nl).forEach(w=>{ const la = String(w.la).split(/[,(]/)[0].trim(); if(!seen.has(la) && pad.length < 40){ seen.add(la); pad.push({ la, nl:w.nl, pos:w.pos||"" }); } });
  FP_DRAFT.lang = "la"; FP_POOL = hard.concat(pad).slice(0, Math.max(25, hard.length));
  if(FP_POOL.length<25) FP_POOL = hard.concat(pad).slice(0,25);
  FP_STATS = { correct:0, wrong:0, xp:0, coins:0 }; FP_WRONG_COUNTS = {};
  go("freePracticePlay");
}
// Grote Reis: Battle Mode, Chronica, Castra en Training geprobeerd.
(function(){
  if(typeof ACHIEVEMENTS_DEF==="undefined" || ACHIEVEMENTS_DEF.some(a=>a.id==="grote_reis")) return;
  ACHIEVEMENTS_DEF.push({ id:"grote_reis", nm:"Grote Reis", ds:"Battle Mode, Chronica Classica, Castra Heroum en Training Mode allemaal geprobeerd", icon:"eagle", cat:"algemeen" });
})();
function cxModesTried(){
  const out = {};
  try{ out.battle = (P.stats.battlesPlayed||0)>0 || ((typeof bmIdentLoad==="function" && bmIdentLoad()||{}).battles||0)>0; }catch(e){}
  try{ out.training = (P.stats.trainingPlayDates||[]).length>0; }catch(e){}
  try{ out.chronica = Object.keys(spSlotsLoadLocal()).length>0; }catch(e){}
  try{ out.castra = Object.keys(localStorage).some(k=>k.indexOf("castra_save_v1_")===0); }catch(e){}
  return out;
}
function cxCheckAllModes(){
  try{
    if(typeof P==="undefined" || P.achievements.includes("grote_reis")) return;
    const m = cxModesTried(); if(!(m.battle && m.training && m.chronica && m.castra)) return;
    P.achievements.push("grote_reis"); saveProfile();
    const def = ACHIEVEMENTS_DEF.find(a=>a.id==="grote_reis"); if(def && typeof toastAch==="function") toastAch(def);
  }catch(e){}
}

/* ---------- Castra-schermen: boeken bijschrijven, docentlijsten laden ---------- */
if(typeof SCREENS!=="undefined" && SCREENS.castraHome){
  const _castraHomeCX0 = SCREENS.castraHome;
  SCREENS.castraHome = function(){
    _castraHomeCX0.apply(this, arguments);
    cxSyncBookTitles(); cxCastraBookTokens(); cxLoadTeacherLists(); cxCheckAllModes();
  };
}
