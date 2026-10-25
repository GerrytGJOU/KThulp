/* ============================================================================
   CASTRA HEROUM — SPELFRAMEWORK (fase 1: de begaanbare castra)
   ----------------------------------------------------------------------------
   Ontwerp: CASTRA_HEROUM.md. Data: castra-data.js. Avatar: castra-avatar.js.
   Dit bestand bevat: staat + opslag (lokaal, met best-effort Firebase-sync),
   grondstoffen via tijdstempels, gebouwen upgraden, soldaten werven (seeded RNG,
   aanleg/karakter/insignis) en het scherm SCREENS.castraHome (top-down kamp).
   Venatio staat in castra-venatio.js; Proelium/Legio zijn nog stubs (poort, principia).
   Laadt NA castra-data.js en castra-avatar.js.
   ============================================================================ */

const CASTRA_SAVE_VER = 1;
let CASTRA = null;          // actieve spelstaat (zie castraNewState)
let CASTRA_KEY = null;      // localStorage-sleutel van de actieve speler
let CASTRA_UI = { px:0, py:0, dir:"up", frame:1, moving:false, panel:null, keyFn:null, resizeFn:null };

/* ---------- hulpjes ---------- */
function castraBuilding(id){ return CASTRA_BUILDINGS.find(b=>b.id===id); }
function castraRes(id){ return CASTRA_RES.find(r=>r.id===id); }
function castraNow(){ return Date.now(); }

// Deterministische RNG (mulberry32): zelfde seed = zelfde uitkomst. Nu voor het
// werven; later ook de basis voor de lockstep-simulatie van de tower defence.
function castraRng(seed){
  let a = seed>>>0;
  return function(){
    a = (a + 0x6D2B79F5)>>>0;
    let t = a;
    t = Math.imul(t ^ (t>>>15), t | 1);
    t ^= t + Math.imul(t ^ (t>>>7), t | 61);
    return ((t ^ (t>>>14))>>>0) / 4294967296;
  };
}

/* ---------- staat + opslag ---------- */
function castraNewState(){
  const b = {};
  CASTRA_BUILDINGS.filter(x=>x.phase===1).forEach(x=>{ b[x.id] = { lvl:(x.start!==undefined?x.start:1), t:castraNow() }; });
  return {
    v:CASTRA_SAVE_VER, savedAt:castraNow(),
    seed: (Math.random()*4294967296)>>>0,
    res: { ...CASTRA_START_RES },
    b, soldiers:[], heroes:[],
    pos: { x:CASTRA_MAP.start.x, y:CASTRA_MAP.start.y },
  };
}
function castraSaveKey(){
  const i = (typeof BM_IDENT!=="undefined") ? BM_IDENT : null;
  return "castra_save_v1_" + (i && i.klascode ? i.klascode+"_"+i.leerlingcode : "gast");
}
// Na een verse paginalading is BM_IDENT leeg tot een Battle Mode-scherm de opgeslagen identiteit laadt.
// Castra pakt die zelf op (zelfde bron als Battle Mode: localStorage), zodat je je eigen avatar en je
// eigen klas/leerlingcode meekrijgt; de cloudversie (nieuwere avatar) wordt daarna op de achtergrond gehaald.
function castraAdoptIdentity(){
  try{
    if(typeof BM_IDENT==="undefined" || BM_IDENT || typeof bmIdentLoad!=="function") return;
    const saved = bmIdentLoad();
    if(!saved || !saved.klascode || !saved.leerlingcode) return;
    BM_IDENT = saved;
    if(typeof bmIdentGet==="function") bmIdentGet(saved.klascode, saved.leerlingcode).then(d=>{
      if(d && BM_IDENT && BM_IDENT.leerlingcode===saved.leerlingcode){
        BM_IDENT = { ...saved, ...d }; if(typeof bmIdentSave==="function") bmIdentSave(BM_IDENT);
        if(typeof castraDrawAvatar==="function" && document.getElementById("castraAv")) castraDrawAvatar();
      }
    }).catch(()=>{});
  }catch(e){}
}
/* ---------- migraties ----------
   Elke wijziging van het opslagformaat is een stap in CASTRA_MIGRATIONS ({ id, run(state) }). Een stap draait precies
   één keer per save (s.migr[id] = 1) en nooit twee keer; de formaatversie `v` blijft 1 zodat een save nooit wordt weggegooid.
   Voeg nieuwe stappen ALTIJD onderaan toe en wijzig nooit een bestaande id. Oude vlaggen (heroV, troopsV) tellen mee. */
const CASTRA_MIGRATIONS = [
  { id:"heroes_scale", legacy:s=>s.heroV===1, run:s=>{ (s.heroes||[]).forEach(h=>{ h.lvl = Math.min(50, Math.max(1, Math.round((h.lvl||1)*3.2))); h.xp = 0; }); s.heroV = 1; } },   // helden naar de soldatenschaal (level ×3,2, max 50)
  { id:"troops_trees", legacy:s=>s.troopsV===1, run:s=>{   // oude soldaten (lijn + stadium + tak) naar de troepenbomen
    s.soldiers = (s.soldiers||[]).map(castraMigrateSoldier);
    if(s.dilectus && s.dilectus.cands) s.dilectus.cands = s.dilectus.cands.map(castraMigrateSoldier);
    s.troopsV = 1; } },
];
function castraMigrateState(s){
  const done = s.migr || (s.migr = {});
  CASTRA_MIGRATIONS.forEach(m=>{
    if(done[m.id]) return;
    if(!(m.legacy && m.legacy(s))) m.run(s);
    done[m.id] = 1;
  });
  return s;
}
// Grootte van de save: de cloudkopie mag 40000 tekens zijn (database.rules.json); waarschuw bij 80%.
function castraSaveSize(){ try{ return JSON.stringify(CASTRA).length; }catch(e){ return 0; } }
const CASTRA_SAVE_LIMIT = 40000;
function castraSaveWarn(){ const n = castraSaveSize(); return n > CASTRA_SAVE_LIMIT*0.8 ? n : 0; }
function castraLoad(){
  castraAdoptIdentity();
  CASTRA_KEY = castraSaveKey();
  let s = null;
  try{ s = JSON.parse(localStorage.getItem(CASTRA_KEY)||"null"); }catch(e){}
  if(!s || s.v!==CASTRA_SAVE_VER) s = castraNewState();
  // Gebouwen die er sinds deze save bij gekomen zijn (phase 1) aanvullen.
  CASTRA_BUILDINGS.filter(x=>x.phase===1).forEach(x=>{ if(!s.b[x.id]) s.b[x.id]={lvl:(x.start!==undefined?x.start:1),t:castraNow()}; });
  s = castraMigrateState(s);
  if(!s.help) s.help = { words:{}, sentences:{} };
  if(!s.traces) s.traces = {};
  CASTRA = s;
  return s;
}
let _castraSyncT = null;
function castraSave(){
  if(!CASTRA) return;
  CASTRA.savedAt = castraNow();
  try{ localStorage.setItem(CASTRA_KEY, JSON.stringify(CASTRA)); }catch(e){}
  if(castraSaveWarn() && !castraSave._warned){ castraSave._warned = 1; console.warn("Castra-save is bijna vol voor de cloud: "+castraSaveSize()+" van "+CASTRA_SAVE_LIMIT+" tekens"); }
  // Best-effort sync naar het Certamen-profiel (identities/{klas}/{lid}/castra);
  // alleen voor ingelogde leerlingen, gedebounced zodat lopen niets kost.
  clearTimeout(_castraSyncT);
  _castraSyncT = setTimeout(castraSync, 4000);
}
function castraSync(){
  const i = (typeof BM_IDENT!=="undefined") ? BM_IDENT : null;
  if(!CASTRA || !i || !i.klascode || !i.leerlingcode || typeof fbDB==="undefined" || !fbDB) return;
  try{ fbDB.ref("identities/"+i.klascode+"/"+i.leerlingcode+"/castra").set(JSON.stringify(CASTRA)); }catch(e){}
}
// Haal bij het openen de cloudversie op en neem 'm over als die nieuwer is.
function castraPullRemote(done){
  const i = (typeof BM_IDENT!=="undefined") ? BM_IDENT : null;
  if(!i || !i.klascode || !i.leerlingcode || typeof fbDB==="undefined" || !fbDB){ done(false); return; }
  try{
    fbDB.ref("identities/"+i.klascode+"/"+i.leerlingcode+"/castra").once("value").then(snap=>{
      let r=null; try{ r=JSON.parse(snap.val()||"null"); }catch(e){}
      if(r && r.v===CASTRA_SAVE_VER && (r.savedAt||0) > (CASTRA.savedAt||0)){
        CASTRA = castraMigrateState(r); try{ localStorage.setItem(CASTRA_KEY, JSON.stringify(CASTRA)); }catch(e){}
        done(true);
      } else done(false);
    }).catch(()=>done(false));
  }catch(e){ done(false); }
}

/* ---------- gebouwen, grondstoffen ---------- */
function castraLvl(id){
  const st = CASTRA.b[id]; if(!st) return 0;
  if(st.up && castraNow() >= st.up.end) castraBuildDone(id);          // een afgeronde bouw telt meteen mee
  return st.lvl || 0;
}
/* Bouwen kost tijd (CASTRA_BAL.buildMin): de kosten gaan er meteen af, het level komt erbij als de tijd om is. */
function castraBuildMinutes(toLvl){ const t = CASTRA_BAL.buildMin; return t[Math.max(0, Math.min(t.length-1, toLvl-1))]; }
// De bouwtijd in ms met de kaart Fabri (castra-cards.js) erin; wat al bouwt, behoudt zijn eindtijd.
function castraBuildMs(toLvl){ const x = (typeof castraCardBonus==="function") ? Math.min(60, castraCardBonus().build||0) : 0; return Math.round(castraBuildMinutes(toLvl)*60000*(100-x)/100); }
function castraBuilders(){ const p = (CASTRA.b.praetorium && CASTRA.b.praetorium.lvl) || 0; return CASTRA_BAL.builderStep.filter(n=>p>=n).length || 1; }
function castraBuildActive(){ return Object.keys(CASTRA.b).filter(id=>CASTRA.b[id] && CASTRA.b[id].up); }
function castraBuildLeftMs(id){ const st = CASTRA.b[id]; return st && st.up ? Math.max(0, st.up.end - castraNow()) : 0; }
function castraBuildDone(id){
  const st = CASTRA.b[id]; if(!st || !st.up) return;
  const to = st.up.to; st.lvl = to; if(castraBuilding(id).prod) st.t = st.up.end; delete st.up;
  castraSave();
  if(typeof toast==="function" && typeof castraToastLa==="function" && CASTRA_LA && CASTRA_LA.melioratum) castraToastLa("melioratum", castraBuilding(id).nm+" → "+castraLaText("gradus")+" "+to);
}
function castraFmtLeft(ms){ const m = Math.ceil(ms/60000); return m>=1440 ? Math.floor(m/1440)+" d "+Math.floor(m%1440/60)+" u" : m>=60 ? Math.floor(m/60)+" u "+(m%60)+" m" : m+" m"; }
// De knop of de voortgang van een bouw (gedeeld door alle gebouwpanelen)
function castraUpgradeUI(id, cost, costTxt, lvl){
  const st = CASTRA.b[id] || {};
  if(st.up) return `<div class="note">🔨 ${castraLaText("aedifica")}: <b>${castraLaText("gradus")} ${st.up.to}</b> — nog ${castraFmtLeft(castraBuildLeftMs(id))}</div>`;
  const busy = castraBuildActive().length >= castraBuilders(), mins = castraBuildMinutes(lvl+1), time = castraFmtLeft(castraBuildMs(lvl+1));
  return `<button class="btn" ${castraCanPay(cost) && !busy ? "" : "disabled"} onclick="castraDoUpgrade('${id}')">${lvl===0?castraLaText("aedifica"):castraLaText("meliora")+" → "+castraLaText("gradus")+" "+(lvl+1)} — ${costTxt} · ⏱ ${time}</button>`
    + (busy ? `<div class="note">Alle bouwers zijn bezig (${castraBuildActive().length}/${castraBuilders()}). Een tweede bouwer krijg je met Praetorium 4, een derde met 8.</div>` : "");
}
function castraWalletCap(){ return CASTRA_BAL.walletBase + CASTRA_BAL.walletPerHorreum*castraLvl("horreum"); }
function castraBarracksCap(){ return CASTRA_BAL.barracksBase + CASTRA_BAL.barracksPerLvl*castraLvl("contubernia"); }
function castraMaxLvl(id){
  const b = castraBuilding(id);
  return id==="praetorium" ? b.maxLvl : Math.min(b.maxLvl, castraLvl("praetorium"));
}
function castraUpgradeCost(id){
  const b = castraBuilding(id), L = Math.max(1, castraLvl(id)), c = {};
  Object.keys(b.cost||{}).forEach(r=>{ c[r] = Math.round(b.cost[r]*Math.pow(L, CASTRA_BAL.costExp)); });
  return c;
}
function castraCanPay(cost){ return Object.keys(cost).every(r=>(CASTRA.res[r]||0)>=cost[r]); }
function castraPay(cost){ Object.keys(cost).forEach(r=>{ CASTRA.res[r]-=cost[r]; }); }

// Wat staat er klaar bij een producent? Puur uit tijdstempel + level (geen timer),
// begrensd op producerStoreHours uur opbrengst — geen straf voor later terugkomen.
// Productiebonus in %: held als voorman (castra-heroes.js) plus soldaten die er werken (castra-opus.js).
function castraBldBonus(id){ return ((typeof castraHeroBonus==="function") ? castraHeroBonus(id) : 0) + ((typeof castraOpusBonus==="function") ? castraOpusBonus(id) : 0); }
function castraPending(id){
  const b = castraBuilding(id), st = CASTRA.b[id];
  if(!b || !b.prod || !st) return 0;
  const hours = Math.min(CASTRA_BAL.producerStoreHours, Math.max(0,(castraNow()-st.t)/3600000));
  const bonus = castraBldBonus(id) + ((typeof castraCardBonus==="function") ? castraCardBonus().prod : 0);
  return Math.floor(hours * b.prod.perHour * st.lvl * CASTRA_BAL.prodPerLevelMult * (100+bonus)/100);
}
function castraCollect(id){
  const b = castraBuilding(id), amt = castraPending(id);
  if(!b || !b.prod) return 0;
  const room = Math.max(0, castraWalletCap() - (CASTRA.res[b.prod.res]||0));
  const take = Math.min(amt, room);
  if(take<=0) return 0;
  CASTRA.res[b.prod.res] += take;
  // Alleen het afgehaalde deel van de tijd "verbruiken"; past het niet in de
  // opslag, dan blijft de rest staan.
  const perMs = b.prod.perHour*CASTRA.b[id].lvl*CASTRA_BAL.prodPerLevelMult*(100+castraBldBonus(id))/100/3600000;
  CASTRA.b[id].t = (take>=amt) ? castraNow() : CASTRA.b[id].t + take/perMs;
  castraSave();
  return take;
}
function castraUpgrade(id){
  const L = castraLvl(id);
  if(L>=castraMaxLvl(id)) return false;
  if(CASTRA.b[id] && CASTRA.b[id].up) return false;                       // deze is al in aanbouw
  const dev = !!CASTRA.dev;                                                // ontwikkelaarsstand: meteen klaar (tests)
  if(!dev && castraBuildActive().length >= castraBuilders()) return false;   // geen vrije bouwer
  const cost = castraUpgradeCost(id);
  if(!castraCanPay(cost)) return false;
  if(castraBuilding(id).prod) castraCollect(id);   // niets verliezen bij een upgrade
  castraPay(cost);
  if(!CASTRA.b[id]) CASTRA.b[id] = { lvl:0, t:castraNow() };
  if(dev){ CASTRA.b[id].lvl = L+1; if(castraBuilding(id).prod) CASTRA.b[id].t = castraNow(); }
  else CASTRA.b[id].up = { to:L+1, end:castraNow() + castraBuildMs(L+1) };
  castraSave();
  return true;
}

/* ---------- soldaten ---------- */
// Stats van een soldaat: type-basis × tier-vermenigvuldiger (castra-troops.js) + aanleg, karakter ±10%,
// en +2,5% per level boven 1. Helden hebben vaste waarden (castra-heroes.js).
function castraStats(s){
  const f = castraLine(s.line), base = CASTRA_BASE_STATS[f.type] || CASTRA_BASE_STATS.rec;
  const mult = CASTRA_TIER_MULT[Math.max(0, Math.min(CASTRA_TIER_MULT.length-1, f.tier-1))];
  const ing = CASTRA_INGENIA.find(i=>i.id===s.ingenium);
  const out = {};
  CASTRA_STATS.forEach(st=>{
    let v = base[st.id]*mult + (s.indoles[st.id]||0)*0.5;
    if(ing && ing.up===st.id) v*=1.1;
    if(ing && ing.down===st.id) v*=0.9;
    v *= 1 + CASTRA_LVL_GROWTH*((s.lvl||1)-1);
    out[st.id] = Math.round(v);
  });
  return out;
}
function castraRollSoldier(lineId){
  const rng = castraRng(CASTRA.seed); CASTRA.seed = (CASTRA.seed + 1)>>>0;
  const indoles = {}; CASTRA_STATS.forEach(st=>{ indoles[st.id] = Math.floor(rng()*(CASTRA_INDOLES_MAX+1)); });
  const insignis = rng() < CASTRA_INSIGNIS_CHANCE;
  if(insignis) CASTRA_STATS.forEach(st=>{ indoles[st.id] = Math.min(CASTRA_INDOLES_MAX, indoles[st.id]+3); });
  return {
    id: "s"+castraNow().toString(36)+Math.floor(rng()*1e6).toString(36),
    line:lineId, lvl:1, xp:0, indoles,
    ingenium: CASTRA_INGENIA[Math.floor(rng()*CASTRA_INGENIA.length)].id,
    insignis, hurtUntil:0,
  };
}
function castraSoldierName(s){ return castraLine(s.line).nm; }
function castraRecruitTest(){
  if(CASTRA.soldiers.length >= castraBarracksCap()) return "castra_plena";
  if(!castraCanPay(CASTRA_BAL.recruitCost)) return "frumentum_deest";
  castraPay(CASTRA_BAL.recruitCost);
  const s = castraRollSoldier("rom_tiro");
  CASTRA.soldiers.push(s); castraSave();
  return null;
}

/* ---------- scherm: de castra ---------- */
let CASTRA_BUILT = null;
function castraBuiltMap(){
  if(!CASTRA_BUILT){
    CASTRA_BUILT = castraMapLogic(castraCampDef());
    // De tenten (3x3) zijn getekend als driehoek: de hoeken van de bovenste rij zijn gras en dus begaanbaar.
    CASTRA_BUILDINGS.forEach(b=>{ if(!(b.phase===1 && b.slot)) return; const f = castraBuildingFoot(b);
      if(f.fw===3 && f.fh===3){ delete CASTRA_BUILT.blocked[b.slot.x+","+b.slot.y]; delete CASTRA_BUILT.blocked[(b.slot.x+2)+","+b.slot.y]; } });
  }
  return CASTRA_BUILT;
}
function castraBlockedMap(){ return castraBuiltMap().blocked; }
function castraGateAt(x,y){ return CASTRA_MAP.gates.find(g=>g.tiles.some(t=>t.x===x&&t.y===y)); }
function castraBuildingAt(x,y){
  return CASTRA_BUILDINGS.find(b=>{ if(!(b.phase===1&&b.slot)) return false; const f = castraBuildingFoot(b);
    return x>=b.slot.x&&x<b.slot.x+f.fw&&y>=b.slot.y&&y<b.slot.y+f.fh; });
}

SCREENS.castraHome = function(){
  document.body.classList.remove("greek");
  castraLoad();
  CASTRA_UI.panel = null; CASTRA_UI.moving = false;
  CASTRA_UI.px = CASTRA.pos.x; CASTRA_UI.py = CASTRA.pos.y; CASTRA_UI.dir = "up"; CASTRA_UI.frame = 1;
  const T = CASTRA_MAP;
  H(brand(true)+`
  <div class="scrhead"><button class="back" onclick="castraLeave()">${iconSVG("shield",20,"currentColor")}</button><h2>🏕️ Castra Heroum</h2></div>
  <div id="castraRes" style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin:4px 0 8px"></div>
  <div id="castraTutBar"></div>
  <div id="castraWrap" style="position:relative;width:100%;margin:0 auto;overflow:hidden;border:2px solid var(--hi,var(--hi,#d4af37));border-radius:10px;background:#2a2118">
    <div id="castraMap" style="position:absolute;top:0;left:0;width:${T.cols*T.tile}px;height:${T.rows*T.tile}px;transform-origin:top left;background:
      repeating-conic-gradient(#3b2f20 0% 25%,#35291b 0% 50%) 0 0/${T.tile*2}px ${T.tile*2}px;image-rendering:pixelated"></div>
  </div>
  <div id="castraPad" style="display:grid;grid-template-columns:repeat(3,64px);grid-template-rows:repeat(2,52px);gap:6px;justify-content:center;margin:10px 0">
    <span></span><button class="btn" onclick="castraStep('up')">▲</button><span></span>
    <button class="btn" onclick="castraStep('left')">◀</button><button class="btn" onclick="castraStep('down')">▼</button><button class="btn" onclick="castraStep('right')">▶</button>
  </div>
  <div id="castraPanel"></div>
  ${BM_IDENT?"":`<div class="panel"><div class="note">Je speelt als gast: voortgang blijft alleen op dit apparaat. Meld je aan via Battle Mode of Meedoen om je eigen avatar en cloud-opslag te gebruiken.</div></div>`}
  ${foot()}`);
  castraRenderMap();
  castraRenderRes();
  castraFit();
  if(typeof castraMenuBtn==="function") castraMenuBtn();
  if(typeof castraTutOnHome==="function") castraTutOnHome();
  if(!CASTRA.introSeen && !(CASTRA.tut && CASTRA.tut.step<99)){   // het tutorial vervangt de oude introtekst
    castraOpenPanel(`<div class="panel"><div style="font-size:18px;margin-bottom:8px">${castraLa("intro")}</div>
      <button class="btn btn-gold" onclick="CASTRA.introSeen=true;castraSave();castraClosePanel()">${castraLaText("intellego")}</button></div>`);
  }
  castraStickAttach(el("castraWrap"), { step:castraStep, tap:castraMapTap });
  castraStickHidePad();
  // Kaart pas na de probe met de top-down avatar hertekenen (valt anders terug op battler).
  if(BM_IDENT && typeof castraProbeBase==="function"){
    castraProbeBase(bmAvatarMerge(BM_IDENT.avatar).huid).then(()=>castraDrawAvatar());
  }
  castraPullRemote(changed=>{ if(changed && el("castraMap")){ CASTRA_UI.px=CASTRA.pos.x; CASTRA_UI.py=CASTRA.pos.y; castraRenderMap(); castraRenderRes(); } });
  CASTRA_UI.keyFn = e=>{
    if(!el("castraMap")){ document.removeEventListener("keydown",CASTRA_UI.keyFn); window.removeEventListener("resize",CASTRA_UI.resizeFn); return; }
    const d = {ArrowUp:"up",w:"up",ArrowDown:"down",s:"down",ArrowLeft:"left",a:"left",ArrowRight:"right",d:"right"}[e.key];
    if(d){ e.preventDefault(); castraStep(d); return; }
    if((e.key==="Enter" || e.key===" " || e.key==="e") && !CASTRA_DLG && !(typeof CASTRA_MENU!=="undefined" && CASTRA_MENU.open)){
      const dd = CASTRA_DELTA[CASTRA_UI.dir] || [0,0], hit = castraBlockedMap()[(CASTRA_UI.px+dd[0])+","+(CASTRA_UI.py+dd[1])];
      if(typeof hit==="string"){ e.preventDefault(); castraOpen(hit); }
    }
  };
  CASTRA_UI.resizeFn = castraFit;
  document.addEventListener("keydown", CASTRA_UI.keyFn);
  window.addEventListener("resize", CASTRA_UI.resizeFn);
};
function castraLeave(){
  castraSave(); castraSync();
  if(CASTRA_UI.keyFn) document.removeEventListener("keydown", CASTRA_UI.keyFn);
  if(CASTRA_UI.resizeFn) window.removeEventListener("resize", CASTRA_UI.resizeFn);
  go("home");
}
// Kaart (768×576) schalen naar de beschikbare breedte; tikken rekent met die schaal.
function castraFit(){
  const w = el("castraWrap"); if(!w) return;
  const T = CASTRA_MAP, s = Math.min(1.25, w.clientWidth/(T.cols*T.tile));
  CASTRA_UI.scale = s;
  w.style.height = (T.rows*T.tile*s)+"px";
  el("castraMap").style.transform = "scale("+s+")";
  // op een telefoon is de kaart verkleind: labels meeschalen zodat ze leesbaar blijven
  el("castraMap").style.setProperty("--lbl", Math.max(11, Math.round(11/s*0.95))+"px");
}
function castraRenderRes(){
  const box = el("castraRes"); if(!box) return;
  const cap = castraWalletCap();
  box.innerHTML = CASTRA_RES.map(r=>`<span class="pill" title="${esc(r.nl)}" style="font-size:14px">${r.icon} ${esc(r.nm)} <b>${CASTRA.res[r.id]||0}</b>${r.id!=="gloria"?`<small>/${cap}</small>`:""}</span>`).join("") + `${typeof castraPLevel==="function"?`<span class="pill" title="Castra-niveau" style="font-size:14px">🎖️ Niveau <b>${castraPLevel()}</b></span>`:""}${(typeof castraUnlocked!=="function"||castraUnlocked("codex"))?'<button class="btn" style="padding:2px 10px;min-height:32px" onclick="castraCodexOpen()">📖 Codex</button>':""}`;
}
function castraRenderMap(){
  const map = el("castraMap"); if(!map) return;
  const T = CASTRA_MAP, t = T.tile;
  CASTRA_BUILT = null; castraBuiltMap();
  // gebouwlabels en -badges (klikbaar) bovenop de tegelkunst
  let h = `<canvas id="cmBelow" style="position:absolute;left:0;top:0;image-rendering:pixelated"></canvas>`;
  CASTRA_BUILDINGS.filter(b=>b.phase===1&&b.slot).forEach(b=>{
    const f = castraBuildingFoot(b), lvl = castraLvl(b.id), pend = b.prod ? castraPending(b.id) : 0;
    h += `<div onclick="castraOpen('${b.id}')" style="position:absolute;left:${b.slot.x*t}px;top:${b.slot.y*t}px;width:${f.fw*t}px;height:${f.fh*t}px;cursor:pointer;z-index:3">
      <div style="position:absolute;left:50%;bottom:-6px;transform:translateX(-50%);font-size:var(--lbl,11px);font-weight:700;color:var(--cream,#f1e6c4);background:rgba(27,21,14,.85);border:1px solid var(--hi-dim,#8a6d2f);border-radius:6px;padding:0 6px;white-space:nowrap">${b.icon} ${esc(b.nm)}${b.fixed?"":` · ${lvl||"🔨"}`}</div>
      ${pend>0?`<div style="position:absolute;top:-6px;right:-6px;font-size:11px;background:var(--hi,#d4af37);color:#2a2118;border-radius:10px;padding:1px 6px;font-weight:700;animation:pulse 1.4s infinite">+${pend}</div>`:""}
    </div>`;
  });
  // poortborden: een houten bord met letters op de kampmuur naast de poort (valt zo in de scène).
  // Poorten in de bovenmuur krijgen een liggend bord, poorten in de zijmuur een staand bord (tekst verticaal) zodat het niets bedekt.
  CASTRA_MAP.gates.forEach(g=>{
    const f=g.tiles[0], e=g.tiles[1], horiz = f.y===e.y, vert = !horiz;
    const w = vert ? 0.88*t : 2.9*t, hgt = vert ? 3.3*t : 0.98*t;
    const sub = ({ venatio:"→ de jacht", proelium:"→ campagne" })[g.to] || "";
    const lx = horiz ? (e.x+1)*t + 0.12*t : CASTRA_MAP.cols*t - t + 0.06*t;       // zijmuur: precies op de muurtegel
    const ly = horiz ? 0.04*t : Math.max(0.1*t, f.y*t - hgt - 0.12*t);
    const nail = pos=>`<span style="position:absolute;${pos};width:4px;height:4px;border-radius:50%;background:#2c1a0a;box-shadow:inset 0 0 1px #c9a46a"></span>`;
    const txt = vert ? "writing-mode:vertical-rl;" : "";
    h += `<div style="position:absolute;left:${lx}px;top:${ly}px;width:${w}px;height:${hgt}px;z-index:3;pointer-events:none;box-sizing:border-box;border:2px solid #3a2410;border-radius:4px;
      background:repeating-linear-gradient(${vert?"90deg":"180deg"},rgba(0,0,0,.18) 0 1px,transparent 1px 11px),linear-gradient(${vert?"90deg":"#b07a40"}${vert?",#b07a40,#8a5a2a 60%,#7a4e24":",#8a5a2a 60%,#7a4e24"});box-shadow:0 2px 3px rgba(0,0,0,.6),inset 0 1px 0 rgba(255,220,160,.35);
      display:flex;flex-direction:${vert?"row":"column"};align-items:center;justify-content:center;gap:${vert?4:0}px;line-height:1.05;text-align:center">
      ${nail("left:3px;top:3px")}${nail("right:3px;top:3px")}${nail("left:3px;bottom:3px")}${nail("right:3px;bottom:3px")}
      <b style="${txt}font-size:${vert?14:15}px;letter-spacing:.05em;color:#f6e6bd;text-shadow:0 1px 0 #3a2410,0 0 2px #3a2410;font-variant:small-caps;white-space:nowrap">${esc(g.nm)}</b>
      <span style="${txt}font-size:${vert?10:11}px;color:#ead2a0;text-shadow:0 1px 0 #3a2410;white-space:nowrap">${sub}</span></div>`;
  });
  h += `<div id="castraAv" style="position:absolute;width:${t}px;height:${t}px;transition:left .16s linear,top .16s linear;pointer-events:none;z-index:5"></div>`;
  h += `<canvas id="cmAbove" style="position:absolute;left:0;top:0;pointer-events:none;image-rendering:pixelated;z-index:6"></canvas>`;
  map.innerHTML = h;
  map.style.background = "#3a4a2a";
  castraDrawAvatar();
  castraTsLoad().then(()=>{ const b=el("cmBelow"), a=el("cmAbove"); if(b&&a) castraDrawMapLayers(castraBuiltMap(), b, a); });
}
function castraDrawAvatar(){
  const av = el("castraAv"); if(!av) return;
  const t = CASTRA_MAP.tile;
  av.style.left = CASTRA_UI.px*t+"px"; av.style.top = CASTRA_UI.py*t+"px";
  const avatar = (typeof BM_IDENT!=="undefined" && BM_IDENT && BM_IDENT.avatar) ? BM_IDENT.avatar : (typeof bmAvatarDefaults==="function" ? bmAvatarDefaults() : null);
  av.innerHTML = avatar ? castraAvatarHTML(avatar, CASTRA_UI.dir, CASTRA_UI.frame, t) : "";
}

/* ---------- bewegen ---------- */
const CASTRA_DELTA = { up:[0,-1], down:[0,1], left:[-1,0], right:[1,0] };
function castraStep(dir){
  if(CASTRA_UI.moving) return null;            // bezig met een stap (niet: geblokkeerd)
  if(!el("castraMap")) return false;
  const d = CASTRA_DELTA[dir]; if(!d) return false;
  CASTRA_UI.dir = dir;
  const nx = CASTRA_UI.px+d[0], ny = CASTRA_UI.py+d[1];
  const blocked = castraBlockedMap(), hit = blocked[nx+","+ny];
  if(hit){
    castraDrawAvatar();
    return false;                                    // tegen een gebouw lopen opent niets meer (tikken, of Enter/spatie voor het gebouw)
  }
  CASTRA_UI.moving = true;
  CASTRA_UI.px = nx; CASTRA_UI.py = ny;
  CASTRA_UI.frame = CASTRA_UI.frame===1 ? (Math.random()<.5?0:2) : 1;   // loopanimatie
  castraDrawAvatar();
  setTimeout(()=>{
    CASTRA_UI.moving = false; CASTRA_UI.frame = 1;
    CASTRA.pos = { x:CASTRA_UI.px, y:CASTRA_UI.py }; castraSave();
    castraDrawAvatar();
    const g = castraGateAt(nx,ny);
    if(g) castraGate(g);
  }, 170);
  return true;
}
// Tik op de kaart: BFS naar die tegel en stap voor stap lopen.
function castraMapTap(e){
  const map = el("castraMap"); if(!map) return;
  const r = map.getBoundingClientRect(), s = CASTRA_UI.scale||1, t = CASTRA_MAP.tile;
  const tx = Math.floor((e.clientX-r.left)/s/t), ty = Math.floor((e.clientY-r.top)/s/t);
  const b = castraBuildingAt(tx,ty);
  if(b){ castraOpen(b.id); return; }
  const path = castraPath(CASTRA_UI.px, CASTRA_UI.py, tx, ty);
  if(path && path.length) castraWalk(path);
}
function castraPath(sx,sy,tx,ty){
  const blocked = castraBlockedMap(), T = CASTRA_MAP;
  if(tx<0||ty<0||tx>=T.cols||ty>=T.rows||blocked[tx+","+ty]) return null;
  const prev = {}, q=[[sx,sy]]; prev[sx+","+sy] = null;
  while(q.length){
    const [x,y] = q.shift();
    if(x===tx && y===ty) break;
    for(const dir in CASTRA_DELTA){
      const nx=x+CASTRA_DELTA[dir][0], ny=y+CASTRA_DELTA[dir][1], k=nx+","+ny;
      if(nx<0||ny<0||nx>=T.cols||ny>=T.rows||(k in prev)||blocked[k]) continue;
      prev[k] = {x,y,dir}; q.push([nx,ny]);
    }
  }
  const end = tx+","+ty; if(!(end in prev)) return null;
  const out=[]; let k=end;
  while(prev[k]){ out.unshift(prev[k].dir); k = prev[k].x+","+prev[k].y; }
  return out;
}
function castraWalk(path){
  const next = ()=>{ if(!path.length||!el("castraMap")) return; if(castraStep(path.shift())) setTimeout(next, 190); else setTimeout(next,60); };
  next();
}
function castraGate(g){
  if(g.to==="venatio"){
    // Terug uit de jacht sta je net binnen de poort, zodat de poort niet meteen opnieuw afgaat.
    CASTRA.pos = { x:g.tiles[0].x, y:1 }; castraSave();
    if(CASTRA_UI.keyFn) document.removeEventListener("keydown", CASTRA_UI.keyFn);
    if(CASTRA_UI.resizeFn) window.removeEventListener("resize", CASTRA_UI.resizeFn);
    if(typeof castraGeoEnterWorld==="function") castraGeoEnterWorld(); else go("castraRegions");
    return;
  }
  if(g.to==="proelium"){
    CASTRA.pos = { x:14, y:5 }; castraSave();
    if(CASTRA_UI.keyFn) document.removeEventListener("keydown", CASTRA_UI.keyFn);
    if(CASTRA_UI.resizeFn) window.removeEventListener("resize", CASTRA_UI.resizeFn);
    go("castraProelium"); return;
  }
  castraOpenPanel(`<div class="panel"><h3>${esc(g.nm)}</h3>
    <div class="note">${castraLa("porta_clausa")}</div>
    <button class="btn" onclick="castraClosePanel()">${castraLaText("redi")}</button></div>`);
}

/* ---------- panelen ---------- */
function castraOpenPanel(html){ const p = el("castraPanel"); if(p){ p.innerHTML = html; p.scrollIntoView({behavior:"smooth",block:"nearest"}); } }
function castraClosePanel(){ CASTRA_UI.panel=null; const p=el("castraPanel"); if(p) p.innerHTML=""; }
function castraOpen(id){
  CASTRA_UI.panel = id;
  if(id==="campus"){ castraCampusOpen(); return; }
  if(id==="heroum"){ castraHeroumOpen(); return; }
  if(id==="principia"){ castraPrincipiaOpen(); return; }
  if(id==="valetudinarium"){ castraValetudinariumOpen(); return; }
  if(id==="dilectus"){ castraDilectusOpen(); return; }
  const b = castraBuilding(id), lvl = castraLvl(id);
  const maxL = castraMaxLvl(id), cost = castraUpgradeCost(id);
  const costTxt = Object.keys(cost).map(r=>`${castraRes(r).icon} ${cost[r]}`).join("  ");
  let extra = "";
  if(b.prod){
    const pend = castraPending(id), r = castraRes(b.prod.res);
    extra += `<div class="note">${castraLaText("proventus")}: ${b.prod.perHour*lvl} ${r.icon} / hora · ${castraLaText("paratum")}: <b>${pend}</b> ${r.icon}</div>
      <button class="btn btn-gold" ${pend>0?"":"disabled"} onclick="castraDoCollect('${id}')">${castraLaText("collige")}</button> `;
  }
  if(id==="stabula" || id==="navalia"){
    const info = castraNeedsInfo(id);
    extra += `<div class="note">${lvl===0?castraLa("non_aedificatum")+" ":""}${castraLaText("aperit")}:` + Object.keys(info).sort().map(l=>`<div style="margin-top:3px"><b>${castraLaText("gradus")} ${l}</b>: <small>${esc(info[l].join(", "))}</small></div>`).join("") + `</div>`;
  }
  if(id==="horreum") extra += `<div class="note">${castraLaText("capacitas")}: ${castraWalletCap()}</div>`;
  if(id==="contubernia"){
    const list = CASTRA.soldiers.map(s=>{
      const st = castraStats(s), ing = CASTRA_INGENIA.find(i=>i.id===s.ingenium);
      return `<div style="padding:4px 0;border-top:1px solid #4a3d2c">${s.insignis?"✨ ":""}<b>${esc(castraSoldierName(s))}</b> · ${castraLaText("gradus")} ${s.lvl} · <i>${esc(ing?ing.nm:"")}</i><br>
        <small>${CASTRA_STATS.map(x=>x.nm.slice(0,3)+" "+st[x.id]).join(" · ")}</small>
        <button class="btn" style="float:right;margin-top:-26px" onclick="castraDoRelease('${s.id}')">${castraLaText("missio_honesta")}</button></div>`;
    }).join("") || `<div class="note">${castraLa("nullus_exercitus")}</div>`;
    const hs = (CASTRA.heroes||[]).map(h=>{ const d = CASTRA_HEROES.find(x=>x.id===h.id); return d?d.nm:h.id; });
    extra += (hs.length?`<div class="note">⭐ Heroes: <b>${esc(hs.join(", "))}</b></div>`:"") + `<div class="note">${castraLaText("milites")}: ${CASTRA.soldiers.length} / ${castraBarracksCap()}</div>${list}
      <div class="note">${castraLa("dilectus_hint")}</div> `;
  }
  if(b.fixed) extra += `<div class="note">${castraLa("legio_mox")}</div>`;
  const up = b.fixed ? "" : (lvl>=maxL
    ? `<div class="note">${castraLa(lvl>=b.maxLvl?"gradus_max":"praetorium_prius")}</div>`
    : castraUpgradeUI(id, cost, costTxt, lvl));
  castraOpenPanel(`<div class="panel"><h3>${b.icon} ${esc(b.nm)} ${b.fixed?"":`<small>${castraLaText("gradus")} ${lvl}</small>`}</h3>
    <div style="font-style:italic;margin-bottom:6px">${castraLaHTML(b.lat||"", b.desc||b.nl||"", "bld_"+id)}</div>${extra}${up}
    <div style="margin-top:8px"><button class="btn" onclick="castraClosePanel()">${castraLaText("claude")}</button></div></div>`);
}
function castraRefresh(id){ castraRenderMap(); castraRenderRes(); castraOpen(id); }
function castraToastLa(id, extra){ const t = CASTRA_LA[id]; toast(t.la, (extra?extra+" · ":"")+t.nl); }
function castraDoCollect(id){
  const b = castraBuilding(id), n = castraCollect(id);
  if(!n) castraToastLa("plenum"); else castraToastLa("collectum", "+"+n+" "+castraRes(b.prod.res).nm);
  castraRefresh(id);
}
function castraDoUpgrade(id){
  if(castraUpgrade(id)){ const st = CASTRA.b[id]; if(st && st.up) toast("🔨 "+castraBuilding(id).nm, "Wordt gebouwd: klaar over "+castraFmtLeft(castraBuildLeftMs(id))+"."); else castraToastLa("melioratum", castraBuilding(id).nm+" → "+castraLaText("gradus")+" "+castraLvl(id)); }
  castraRefresh(id);
}
function castraDoRecruit(){ const err = castraRecruitTest(); if(err) castraToastLa(err); castraRefresh("contubernia"); }

