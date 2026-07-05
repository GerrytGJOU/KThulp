/* ============================================================================
   TRAINING MODE — solo thuis-oefenen voor Total War (TOTAL_WAR.md §3)
   ----------------------------------------------------------------------------
   De EERSTE volledig solo modus zonder host/klascode-invoer: een leerling met
   een bestaand profiel (BM_IDENT, zie battle.js) oefent thuis woordjes. Elk
   goed antwoord geeft persoonlijke XP (bestaand systeem, addXP()) én vult
   DIRECT de gekozen provincie se gekozen verdedigingswerk (militie/garnizoen,
   wachttoren/fort, of palissade/muur — TW_STRUCTURES in totalwar.js) — geen
   tussenmunt, geen losse koopstap. De puntensnelheid schaalt af met de echte
   klasgrootte (twGetClassSize()) zodat een klas van 5 ongeveer even snel
   bouwt als een klas van 30. Bij een aanval bevecht de aanvallende klas de
   werken één voor één (zie bmSiegeStageKeys()/bmStartBossGame() in battle.js).

   Hergebruikt bewust bestaande infrastructuur i.p.v. iets nieuws te bouwen:
   - buildPool()/makeQuestion() (core.js) — puur, lokaal, geen room nodig.
   - BM_IDENT/SCREENS.battleIdentity (battle.js) — zelfde gedeelde profiel.
   - _bmPixelLayers()/BattleMotion (battle.js/battle-motion.js) — dezelfde
     geanimeerde avatar als op het slagveld, nu solo.
   - .qcard/.choices/.choice-opmaak (battle.js se speler-vraagscherm).
   - TW_STRUCTURES/twStructureTier/twSpriteFor/twGarrisonVisualHTML
     (totalwar.js) — dezelfde tier-/sprite-logica als de docent-kaart.
   ============================================================================ */

/* ---- Lokale oefeninstellingen: BEWUST een eigen object, niet de gedeelde
   DRAFT (die wordt door docent-gehoste spellen gebruikt en zou anders door
   Training Mode overschreven kunnen worden op hetzelfde toestel). ---- */
let TR_DRAFT = { lang:"la", source:"freq", fromN:1, toN:100, cat:"all" };
let TR_TRACK = (function(){ try{ return localStorage.getItem("certamen_training_track")||"militia"; }catch(e){ return "militia"; } })();
let TR_CIV = null;            // civId van de beschaving van BM_IDENT.klascode
let TR_OWNED_PROVINCES = [];  // provincies van TR_CIV, met hun huidige puntentellers
let TR_PROVINCE_ID = null;    // welke provincie deze sessie versterkt wordt
let TR_CLASS_SIZE = 1;
let TR_POOL = [];
let TR_Q = null;
let TR_STATS = { correct:0, wrong:0, points:0, xp:0 };
let TR_HERO_EL = null;
let TR_CAP_TODAY = 0; // aantal volledige-XP-antwoorden dat vandaag al gegeven is (zie trAnswer())
// Dagelijkse afroming: na dit aantal per dag nog wel halve bouwpunten (het
// klasdoel groeit door) maar geen XP meer — remt solo-thuisgrind af zonder de
// Total War-samenwerking te straffen. Richtwaarde, makkelijk bij te stellen.
const TR_DAILY_CAP = 25;

const TR_TRACK_LABELS = {
  militia: { nm:"Militie/Garnizoen trainen", icon:"⚔️" },
  towers:  { nm:"Wachttoren bouwen",         icon:"🗼" },
  walls:   { nm:"Palissade bouwen",          icon:"🪵" },
};

/* ------------------------------------------------------------------
   SCHERM: instapscherm — login-gate, beschaving + provincies opzoeken,
   werk-/provinciekeuze, instellingen.
   ------------------------------------------------------------------ */
SCREENS.trainingMode = function(){
  document.body.classList.remove("greek");
  if(!BM_IDENT){
    H(brand(true)+`
    <div class="scrhead"><button class="back" onclick="go('totalWar')">${iconSVG("shield",20,"currentColor")}</button><h2>Training Mode</h2></div>
    <div class="panel" style="text-align:center">
      <p class="note">Log in met je klascode en leerlingcode om thuis te kunnen trainen — zelfde profiel als Battle Mode.</p>
      <button class="btn btn-gold btn-block lg" style="margin-top:10px" onclick="BM_IDENT_RETURN='trainingMode';go('battleIdentity')">Aanmelden</button>
    </div>
    ${foot()}`);
    return;
  }
  H(brand(true)+`
  <div class="scrhead"><button class="back" onclick="go('totalWar')">${iconSVG("shield",20,"currentColor")}</button><h2>Training Mode</h2></div>
  <div class="panel" style="text-align:center"><div class="note">Beschaving opzoeken…</div></div>
  <div id="trBody"></div>
  ${foot()}`);
  twLookupCivForKlas(BM_IDENT.klascode).then(civId=>{
    TR_CIV = civId;
    if(!civId){ trRenderModeBody(); return; }
    trLoadOwnedProvinces().then(trRenderModeBody);
  });
};

/* Leest éénmalig alle provincies van TR_CIV en kiest (als er nog geen geldige
   keuze is) de provincie met de laagste som van de drie tellers — die heeft
   versterking het hardst nodig. */
async function trLoadOwnedProvinces(){
  if(!initFirebase()) return;
  const snap = await fbDB.ref("totalwar/provinces").once("value");
  const all = snap.val()||{};
  TR_OWNED_PROVINCES = Object.entries(all)
    .filter(([id,p])=>p && p.owner===TR_CIV)
    .map(([id,p])=>({id,...p}));
  if(!TR_PROVINCE_ID || !TR_OWNED_PROVINCES.some(p=>p.id===TR_PROVINCE_ID)){
    const sorted=[...TR_OWNED_PROVINCES].sort((a,b)=>
      ((a.militiaPoints||0)+(a.wallPoints||0)+(a.towerPoints||0)) -
      ((b.militiaPoints||0)+(b.wallPoints||0)+(b.towerPoints||0)));
    TR_PROVINCE_ID = sorted[0]?.id || null;
  }
}

function trCurrentProvince(){
  return TR_OWNED_PROVINCES.find(p=>p.id===TR_PROVINCE_ID) || null;
}

function trRenderModeBody(){
  const body = el("trBody"); if(!body) return;
  if(!TR_CIV){
    body.innerHTML = `<div class="panel"><div class="note warn">Je klas (${esc(BM_IDENT.klascode)}) is nog niet gekoppeld aan een
      beschaving. Vraag je docent om dit te doen in het docentenportaal (Total War —
      klas ↔ beschaving).</div></div>`;
    return;
  }
  if(!TR_OWNED_PROVINCES.length){
    body.innerHTML = `<div class="panel"><div class="note warn">Jouw beschaving bezit nog geen provincies om te versterken.</div></div>`;
    return;
  }
  const civ = TW_CIVS[TR_CIV]||TW_CIVS.neutral;
  const list = baseList(TR_DRAFT.lang).filter(usable);
  const maxN = list.reduce((m,w)=>Math.max(m,w.f||0),0);
  body.innerHTML = `
  <div class="panel" style="text-align:center">
    <span class="pill" style="background:${civ.soft};color:#f3e9d2;border:none">${esc(civ.nm)}</span>
  </div>
  ${TR_OWNED_PROVINCES.length>1?`
  <div class="panel">
    <label class="fld">Welke provincie versterk je?</label>
    <select id="trProvinceSel" style="width:100%;padding:8px 10px;background:var(--stone3);color:var(--cream);border:1px solid var(--stone4);border-radius:8px;font-size:14px;font-family:inherit" onchange="TR_PROVINCE_ID=this.value;trRenderModeBody()">
      ${TR_OWNED_PROVINCES.map(p=>`<option value="${p.id}"${p.id===TR_PROVINCE_ID?" selected":""}>${esc((_twRegistry&&_twRegistry[p.id]&&_twRegistry[p.id].displayName)||p.id)}</option>`).join("")}
    </select>
  </div>`:""}
  <div class="panel">
    <label class="fld">Wat train je?</label>
    <div class="chips">
      ${Object.entries(TR_TRACK_LABELS).map(([key,t])=>`<button class="chip ${TR_TRACK===key?'on':''}" onclick="trSetTrack('${key}')">${t.icon} ${esc(t.nm)}</button>`).join("")}
    </div>
    ${trTrackProgressHTML()}
  </div>
  <div class="panel">
    <label class="fld">Taal</label>
    <div class="chips">
      <button class="chip ${TR_DRAFT.lang==='la'?'on':''}" onclick="TR_DRAFT.lang='la';trRenderModeBody()">Latijn</button>
      <button class="chip ${TR_DRAFT.lang==='el'?'on':''}" onclick="TR_DRAFT.lang='el';trRenderModeBody()">Grieks</button>
    </div>
  </div>
  <div class="panel">
    <label class="fld">Frequentiebereik — woord nr.</label>
    <div class="row">
      <div><input type="number" id="trFromN" min="1" max="${maxN}" value="${TR_DRAFT.fromN}" oninput="TR_DRAFT.fromN=+this.value||1"></div>
      <div style="flex:0 0 auto;align-self:center;color:var(--muted)">t/m</div>
      <div><input type="number" id="trToN" min="1" max="${maxN}" value="${Math.min(TR_DRAFT.toN,maxN)}" oninput="TR_DRAFT.toN=+this.value||1"></div>
    </div>
    <div class="chips" style="margin-top:12px">
      ${[[1,50],[1,100],[100,300],[300,600],[1,maxN]].map(([a,b])=>`<button class="chip" onclick="TR_DRAFT.fromN=${a};TR_DRAFT.toN=${b};trRenderModeBody()">${a}–${b}</button>`).join("")}
    </div>
  </div>
  <div class="panel">
    <label class="fld">Woordsoort</label>
    <div class="chips">
      ${CATS.map(c=>`<button class="chip ${TR_DRAFT.cat===c.id?'on':''}" onclick="TR_DRAFT.cat='${c.id}';trRenderModeBody()">${c.nm} <small>${catCount(list,c.id)}</small></button>`).join("")}
    </div>
  </div>
  <button class="btn btn-gold btn-block lg" onclick="trStart()">Beginnen</button>
  <button class="btn btn-ghost btn-block" style="margin-top:8px" onclick="go('trainingGarrison')">🏰 Bekijk je gebied</button>`;
}

function trSetTrack(key){
  TR_TRACK=key;
  try{ localStorage.setItem("certamen_training_track", key); }catch(e){}
  trRenderModeBody();
}

/* Voortgangsbalk van het gekozen werk op de gekozen provincie (instapscherm).
   Toont aan het eind van de balk een mini-sprite van wat je aan het bouwen
   bent — de eerstvolgende tier, of de voltooide sprite zelf bij tier 2. */
function trTrackProgressHTML(){
  const p = trCurrentProvince(); if(!p) return "";
  const pts = p[TW_STRUCTURES[TR_TRACK].field]||0;
  const tier = twStructureTier(pts);
  const next = tier>=2 ? null : (tier===0?TW_TIER1_POINTS:TW_TIER2_POINTS);
  const pct = next ? Math.min(100, Math.round(pts/next*100)) : 100;
  const targetSrc = twSpriteFor(TR_TRACK, tier>=2?2:tier+1, TR_CIV);
  return `<div class="note" style="margin-top:8px">Voortgang: ${Math.round(pts)}${next?"/"+next:""} punten${tier>=2?" — volledig!":""}</div>
    <div style="display:flex;align-items:center;gap:8px;margin-top:4px">
      <div style="flex:1;height:8px;border-radius:4px;background:rgba(0,0,0,.4);overflow:hidden">
        <div style="height:100%;width:${pct}%;background:var(--hi);transition:width .3s"></div>
      </div>
      ${targetSrc?`<div style="width:56px;height:56px;flex:0 0 auto;background:#fff;border-radius:8px;box-sizing:border-box">
        <img src="${targetSrc}?${SPRITE_VER}" style="width:100%;height:100%;object-fit:contain;padding:6px;box-sizing:border-box" alt="" onerror="this.parentElement.style.display='none'">
      </div>`:""}
    </div>`;
}

async function trStart(){
  TR_POOL = buildPool(TR_DRAFT);
  if(TR_POOL.length<4){ toast("Te weinig woorden","Kies een groter bereik of een andere woordsoort."); return; }
  TR_STATS = { correct:0, wrong:0, points:0, xp:0 };
  TR_CLASS_SIZE = await twGetClassSize(BM_IDENT.klascode);
  TR_CAP_TODAY = await trLoadDailyCap();
  go("trainingPlay");
}

/* ------------------------------------------------------------------
   SCHERM: de quizloop zelf — geanimeerde avatar + doelwit + vraagkaart
   ------------------------------------------------------------------ */
SCREENS.trainingPlay = function(){
  document.body.classList.remove("greek");
  const av = bmAvatarMerge(BM_IDENT.avatar);
  const heroHTML = _bmPixelLayers(av,"dir-right") || bmAvatarSVG(av,96);
  H(brand(true)+`
  <div class="scrhead"><button class="back" onclick="go('trainingMode')">${iconSVG("shield",20,"currentColor")}</button><h2>${esc(TR_TRACK_LABELS[TR_TRACK].nm)}</h2></div>
  <div class="panel" id="trStatsBar" style="display:flex;justify-content:space-around;align-items:center"></div>
  <div class="panel" style="display:flex;justify-content:center;gap:28px;align-items:flex-end">
    <div id="trAvatarHost" style="width:120px">${heroHTML}</div>
    <div id="trTargetHost" style="width:96px"></div>
  </div>
  <div id="trQuestionHost"></div>
  ${foot()}`);
  TR_HERO_EL = document.querySelector("#trAvatarHost .pixel-hero");
  if(TR_HERO_EL) BattleMotion.ensureIdle(TR_HERO_EL);
  trUpdateStatsBar();
  trRenderTarget();
  trNextQuestion();
};

function trUpdateStatsBar(){
  const bar = el("trStatsBar"); if(!bar) return;
  bar.innerHTML = `<span class="note">✅ ${TR_STATS.correct} goed</span>
    <span style="color:var(--hi-bright)">+${Math.round(TR_STATS.points)} punten</span>
    <span style="color:var(--hi-bright)">+${TR_STATS.xp} XP</span>`;
}

/* Doelvisual: de seed-waarde van de provincie plus wat deze sessie al
   verdiend is (live gevoel, ook al is de Firebase-schrijfactie async). */
function trRenderTarget(){
  const host = el("trTargetHost"); if(!host) return;
  const p = trCurrentProvince()||{};
  const pts = (p[TW_STRUCTURES[TR_TRACK].field]||0) + TR_STATS.points;
  const tier = twStructureTier(pts);
  const src = twSpriteFor(TR_TRACK, tier, TR_CIV);
  host.innerHTML = src ? `<img src="${src}?${SPRITE_VER}" style="width:100%" alt="" onerror="this.style.display='none'">` : "";
}

function trNextQuestion(){
  TR_Q = makeQuestion(TR_POOL);
  const host = el("trQuestionHost"); if(!host) return;
  const lang = TR_DRAFT.lang==="el"?"Griekse":"Latijnse";
  host.innerHTML = `
  <div class="qcard">
    <div class="kick">Vertaal het ${lang} woord</div>
    <div class="word">${esc(TR_Q.la)}</div>
    ${TR_Q.pos?`<div class="pos">${esc(TR_Q.pos)}</div>`:""}
  </div>
  <div class="choices">
    ${TR_Q.options.map((opt,i)=>`<button class="choice" id="trC${i}" onclick="trAnswer(${i})"><span class="n">${i+1}</span>${esc(opt)}</button>`).join("")}
  </div>`;
}

function trAnswer(idx){
  if(!TR_Q) return;
  const q = TR_Q; TR_Q = null; // dubbelklikken tijdens de korte pauze voorkomen
  const ok = idx===q.correctIdx;
  [0,1,2,3].forEach(i=>{
    const c=el("trC"+i); if(!c) return;
    if(i===q.correctIdx) c.classList.add("correct");
    else if(i===idx && !ok) c.classList.add("wrong");
    else c.classList.add("dim");
    c.disabled=true;
  });
  if(ok){
    // Klasgrootte-schaling (TOTAL_WAR.md §7.4): elke leerling draagt minder
    // per antwoord bij naarmate de klas groter is (1/√N), zodat een klas van
    // 5 ongeveer even snel bouwt als een klas van 30.
    // Dagelijkse afroming (TR_DAILY_CAP): boven de grens nog wel halve
    // bouwpunten (het klasdoel blijft groeien) maar geen XP meer.
    const fullRate = TR_CAP_TODAY < TR_DAILY_CAP;
    const basePts = 5/Math.sqrt(TR_CLASS_SIZE||1);
    const pts = fullRate ? basePts : basePts/2;
    const xpGain = fullRate ? 2 : 0;
    TR_STATS.correct++; TR_STATS.points+=pts; TR_STATS.xp+=xpGain;
    if(fullRate){ TR_CAP_TODAY++; trSaveDailyCap(TR_CAP_TODAY); }
    if(TR_PROVINCE_ID) twAwardStructurePoints(TR_PROVINCE_ID, TR_TRACK, pts);
    if(xpGain) addXP(xpGain);
    trTrackContribution(TR_TRACK, pts);
    // Meetellen voor de algemene eerbewijzen (woordenkenner/taalmeester/snelle
    // geest) — Training Mode deed dat tot nu toe nergens.
    P.stats.totalCorrect++; P.stats.currentStreak++;
    if(P.stats.currentStreak>P.stats.bestStreak) P.stats.bestStreak=P.stats.currentStreak;
    saveProfile(); checkAch({mode:"training"});
    if(TR_HERO_EL) BattleMotion.play(TR_HERO_EL,"swing");
    trRenderTarget();
  } else {
    TR_STATS.wrong++;
    P.stats.totalWrong++; P.stats.currentStreak=0; saveProfile();
  }
  trUpdateStatsBar();
  setTimeout(trNextQuestion, ok?900:1400);
}

/* ------------------------------------------------------------------
   SCHERM: "Bekijk je gebied" — read-only overzicht van alle eigen
   provincies en hun drie verdedigingswerken (geen koopstap meer: punten
   komen nu direct uit het trainen zelf, zie trAnswer() hierboven).
   ------------------------------------------------------------------ */
SCREENS.trainingGarrison = function(){
  document.body.classList.remove("greek");
  if(!BM_IDENT){ go("trainingMode"); return; }
  H(brand(true)+`
  <div class="scrhead"><button class="back" onclick="go('trainingMode')">${iconSVG("shield",20,"currentColor")}</button><h2>Bekijk je gebied</h2></div>
  <div class="panel" style="text-align:center"><div class="note">Laden…</div></div>
  <div id="trGarrisonBody"></div>
  ${foot()}`);
  if(!TR_CIV){
    twLookupCivForKlas(BM_IDENT.klascode).then(civId=>{ TR_CIV=civId; trLoadGarrisonView(); });
  } else {
    trLoadGarrisonView();
  }
};

async function trLoadGarrisonView(){
  const body = el("trGarrisonBody"); if(!body) return;
  if(!TR_CIV){
    body.innerHTML = `<div class="panel"><div class="note warn">Je klas is nog niet gekoppeld aan een beschaving. Vraag je docent.</div></div>`;
    return;
  }
  if(!initFirebase()){
    body.innerHTML = `<div class="panel"><div class="note warn">Firebase niet beschikbaar.</div></div>`;
    return;
  }
  await trLoadOwnedProvinces();
  const civ = TW_CIVS[TR_CIV]||TW_CIVS.neutral;
  body.innerHTML = `
  <div class="panel" style="text-align:center">
    <span class="pill" style="background:${civ.soft};color:#f3e9d2;border:none">${esc(civ.nm)}</span>
  </div>
  ${TR_OWNED_PROVINCES.length ? TR_OWNED_PROVINCES.map(trProvinceOverviewHTML).join("") :
    `<div class="panel"><div class="note">Jouw beschaving bezit nog geen provincies.</div></div>`}`;
}

function trProvinceOverviewHTML(p){
  const nm = (_twRegistry && _twRegistry[p.id] && _twRegistry[p.id].displayName) || p.id;
  const track=(key,label)=>{
    const pts=p[TW_STRUCTURES[key].field]||0;
    const tier=twStructureTier(pts);
    const next=tier>=2?null:(tier===0?TW_TIER1_POINTS:TW_TIER2_POINTS);
    const pct=next?Math.min(100,Math.round(pts/next*100)):100;
    const targetSrc=twSpriteFor(key, tier>=2?2:tier+1, p.owner);
    return `<div style="margin-top:6px">
      <div class="note">${label}: ${tier===0?"—":tier===1?"basis":"volledig"} (${Math.round(pts)}${next?"/"+next:""})</div>
      <div style="display:flex;align-items:center;gap:6px;margin-top:2px">
        <div style="flex:1;height:6px;border-radius:3px;background:rgba(0,0,0,.4);overflow:hidden">
          <div style="height:100%;width:${pct}%;background:var(--hi)"></div>
        </div>
        ${targetSrc?`<div style="width:44px;height:44px;flex:0 0 auto;background:#fff;border-radius:6px;box-sizing:border-box">
          <img src="${targetSrc}?${SPRITE_VER}" style="width:100%;height:100%;object-fit:contain;padding:4px;box-sizing:border-box" alt="" onerror="this.parentElement.style.display='none'">
        </div>`:""}
      </div>
    </div>`;
  };
  return `<div class="panel">
    <div style="display:flex;align-items:center;gap:12px">
      ${twGarrisonVisualHTML(p, p.owner)}
      <div style="flex:1"><b>${esc(nm)}</b></div>
    </div>
    ${track("towers","Fort")}
    ${track("walls","Muur")}
    ${track("militia","Garnizoen")}
  </div>`;
}

/* ------------------------------------------------------------------
   FIREBASE-HELPERS — schrijven/lezen op het bestaande /totalwar-schema
   (zie certamen/totalwar.js: twEnsureCampaignSeeded()). Vereist de
   uitgebreide rules die leerling-schrijfacties (geen Firebase Auth) op
   totalwar/provinces/{id} en totalwar/klasSize/{klas} toestaan.
   ------------------------------------------------------------------ */
async function twLookupCivForKlas(klascode){
  if(!klascode || !initFirebase()) return null;
  try{
    const snap = await fbDB.ref("totalwar/klasCivs/"+klascode).once("value");
    return snap.val() || null;
  }catch(e){ return null; }
}

/* Echte klasgrootte: telt de leerlingcodes die ooit onder deze klascode
   getraind hebben (/totalwar/klasSize/{klascode}/students), en markeert de
   huidige leerling erbij als dat nog niet zo was. Puur een aanwezigheidsvlag
   (geen naam/score) — dus geen privacygevoelige data hoeft opengesteld te
   worden zoals de volledige /identities-node dat wel zou zijn. */
async function twGetClassSize(klascode){
  if(!klascode || !initFirebase()) return 1;
  try{
    if(BM_IDENT && BM_IDENT.leerlingcode){
      await fbDB.ref("totalwar/klasSize/"+klascode+"/students/"+BM_IDENT.leerlingcode).set(true);
    }
    const snap = await fbDB.ref("totalwar/klasSize/"+klascode+"/students").once("value");
    const n = snap.exists() ? Object.keys(snap.val()).length : 1;
    return Math.max(1, n);
  }catch(e){ return 1; }
}

/* Schrijft direct naar het gekozen werk van de gekozen provincie —
   .transaction() zodat gelijktijdige leerlingen elkaars bijdrage niet
   overschrijven (zelfde patroon als ropePull() in net.js). */
async function twAwardStructurePoints(provinceId, trackKey, points){
  if(!provinceId || !initFirebase()) return;
  const field = TW_STRUCTURES[trackKey] && TW_STRUCTURES[trackKey].field;
  if(!field) return;
  try{ await fbDB.ref("totalwar/provinces/"+provinceId+"/"+field).transaction(cur=>(cur||0)+points); }catch(e){}
}

/* ---- Dagelijkse cap (TR_DAILY_CAP): lokaal gecachet bij sessiestart, per
   antwoord opgehoogd en fire-and-forget gesynct — zelfde pragmatische aanpak
   als twGetClassSize() hierboven (optimistisch lokaal, geen transaction per
   antwoord nodig). Staat op de gedeelde identiteit (niet lokaal), zodat
   wisselen van toestel de cap niet omzeilt. ---- */
function trToday(){ return new Date().toISOString().slice(0,10); }
async function trLoadDailyCap(){
  if(!BM_IDENT || !initFirebase()) return 0;
  try{
    const snap = await fbDB.ref("identities/"+BM_IDENT.klascode+"/"+BM_IDENT.leerlingcode+"/trainCap").once("value");
    const d = snap.val();
    return (d && d.date===trToday()) ? (d.count||0) : 0;
  }catch(e){ return 0; }
}
function trSaveDailyCap(n){
  if(!BM_IDENT || !fbDB) return;
  try{ fbDB.ref("identities/"+BM_IDENT.klascode+"/"+BM_IDENT.leerlingcode+"/trainCap").set({date:trToday(), count:n}); }catch(e){}
}

/* ---- Individuele Total War-bijdrage — los van de gedeelde provinciepunten
   in twAwardStructurePoints() hierboven — telt op in
   identities/{klas}/{lcode}/twContrib, voor de "steenhouwer"/"bouwmeester"/
   "drie sporen"-eerbewijzen (core.js: ACHIEVEMENTS_DEF). ---- */
async function trTrackContribution(track, pts){
  if(!BM_IDENT || !fbDB) return;
  const{klascode:klas,leerlingcode:lcode}=BM_IDENT;
  if(!klas||!lcode) return;
  try{
    const res = await fbDB.ref("identities/"+klas+"/"+lcode+"/twContrib").transaction(cur=>{
      const d = cur || {total:0, militia:0, walls:0, towers:0};
      d.total=(d.total||0)+pts; d[track]=(d[track]||0)+pts;
      return d;
    });
    const contrib = res.committed ? (res.snapshot.val()||{}) : null;
    if(!contrib) return;
    BM_IDENT = {...BM_IDENT, twContrib: contrib};
    bmIdentSave({...bmIdentLoad(), twContrib: contrib});
    trCheckTWAchievements(contrib);
  }catch(e){}
}
async function trCheckTWAchievements(contrib){
  if(!BM_IDENT || !fbDB) return;
  const{klascode:klas,leerlingcode:lcode}=BM_IDENT;
  if(!klas||!lcode) return;
  const current=BM_IDENT.achievements||[], newOnes=[];
  const check=(id,cond)=>{ if(cond && !current.includes(id)) newOnes.push(id); };
  check("eerste_training", (contrib.total||0)>0);
  check("drie_sporen", (contrib.militia||0)>0 && (contrib.walls||0)>0 && (contrib.towers||0)>0);
  check("steenhouwer", (contrib.total||0)>=100);
  check("bouwmeester", (contrib.total||0)>=1000);
  if(!newOnes.length) return;
  const updated=[...new Set([...current,...newOnes])];
  try{ await fbDB.ref("identities/"+klas+"/"+lcode+"/achievements").set(updated); }catch(e){ return; }
  BM_IDENT={...BM_IDENT, achievements:updated};
  bmIdentSave({...bmIdentLoad(), achievements:updated});
  newOnes.forEach((id,i)=>setTimeout(()=>{ const a=ACHIEVEMENTS_DEF.find(x=>x.id===id); if(a) toastAch(a); }, i*900));
}
