/* ============================================================================
   TRAINING MODE — solo thuis-oefenen voor Total War (TOTAL_WAR.md §3)
   ----------------------------------------------------------------------------
   De EERSTE volledig solo modus zonder host/klascode-invoer: een leerling met
   een bestaand profiel (BM_IDENT, zie battle.js) oefent thuis woordjes.
   Elk goed antwoord geeft persoonlijke XP (bestaand systeem, addXP()) én vult
   het collectieve Trainingspunten-budget van de eigen beschaving
   (/totalwar/civs/{civId}/trainingPoints). Apart daarvan kan de leerling dat
   budget besteden aan garnizoensupgrades (§5.2) op een provincie van de eigen
   beschaving — twee bewust gescheiden stappen (verdienen vs. besteden), zie
   TOTAL_WAR.md §3/§5.2 en het sessieplan.

   Hergebruikt bewust bestaande infrastructuur i.p.v. iets nieuws te bouwen:
   - buildPool()/makeQuestion() (core.js) — puur, lokaal, geen room nodig.
   - BM_IDENT/SCREENS.battleIdentity (battle.js) — zelfde gedeelde profiel.
   - _bmPixelLayers()/BattleMotion (battle.js/battle-motion.js) — dezelfde
     geanimeerde avatar als op het slagveld, nu solo.
   - .qcard/.choices/.choice-opmaak (battle.js se speler-vraagscherm).
   ============================================================================ */

/* ---- Lokale oefeninstellingen: BEWUST een eigen object, niet de gedeelde
   DRAFT (die wordt door docent-gehoste spellen gebruikt en zou anders door
   Training Mode overschreven kunnen worden op hetzelfde toestel). ---- */
let TR_DRAFT = { lang:"la", source:"freq", fromN:1, toN:100, cat:"all" };
let TR_VARIANT = (function(){ try{ return localStorage.getItem("certamen_training_variant")||"dummy"; }catch(e){ return "dummy"; } })();
let TR_CIV = null;      // civId van de beschaving van BM_IDENT.klascode
let TR_POOL = [];
let TR_Q = null;
let TR_STATS = { correct:0, wrong:0, tp:0, xp:0 };
let TR_HERO_EL = null;

/* ---- Upgrade-tabel (TOTAL_WAR.md §5.2 — expliciet "richtwaarde", tunable) ---- */
const TR_UPGRADE_COST = { walls:100, towers:250, militia:60 };
const TR_UPGRADE_MAX  = { walls:5, towers:3, militia:null }; // null = geen plafond
const TR_UPGRADE_LABEL = { walls:"Muur +1", towers:"Toren bouwen", militia:"Militie aanwerven" };

/* ------------------------------------------------------------------
   SCHERM: instapscherm — login-gate, beschaving opzoeken, instellingen
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
    trRenderModeBody();
  });
};

function trRenderModeBody(){
  const body = el("trBody"); if(!body) return;
  if(!TR_CIV){
    body.innerHTML = `<div class="panel"><div class="note warn">Je klas (${esc(BM_IDENT.klascode)}) is nog niet gekoppeld aan een
      beschaving. Vraag je docent om dit te doen in het docentenportaal (Total War —
      klas ↔ beschaving).</div></div>`;
    return;
  }
  const civ = TW_CIVS[TR_CIV]||TW_CIVS.neutral;
  const list = baseList(TR_DRAFT.lang).filter(usable);
  const maxN = list.reduce((m,w)=>Math.max(m,w.f||0),0);
  body.innerHTML = `
  <div class="panel" style="text-align:center">
    <span class="pill" style="background:${civ.soft};color:#f3e9d2;border:none">${esc(civ.nm)}</span>
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
  <div class="panel">
    <label class="fld">Hoe wil je oefenen?</label>
    <div class="chips">
      <button class="chip ${TR_VARIANT==='dummy'?'on':''}" onclick="trSetVariant('dummy')">⚔️ Gevechtstraining</button>
      <button class="chip ${TR_VARIANT==='build'?'on':''}" onclick="trSetVariant('build')">🔨 Bouwanimatie</button>
    </div>
    <div class="note" style="margin-top:6px">${TR_VARIANT==='dummy'?"Je avatar valt een trainingspop aan.":"Je avatar bouwt aan de verdedigingswerken."}</div>
  </div>
  <button class="btn btn-gold btn-block lg" onclick="trStart()">Beginnen</button>
  <button class="btn btn-ghost btn-block" style="margin-top:8px" onclick="go('trainingGarrison')">🏰 Versterk je gebied</button>`;
}

function trSetVariant(v){
  TR_VARIANT=v;
  try{ localStorage.setItem("certamen_training_variant", v); }catch(e){}
  trRenderModeBody();
}

function trStart(){
  TR_POOL = buildPool(TR_DRAFT);
  if(TR_POOL.length<4){ toast("Te weinig woorden","Kies een groter bereik of een andere woordsoort."); return; }
  TR_STATS = { correct:0, wrong:0, tp:0, xp:0 };
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
  <div class="scrhead"><button class="back" onclick="go('trainingMode')">${iconSVG("shield",20,"currentColor")}</button><h2>Training Mode</h2></div>
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
    <span style="color:var(--hi-bright)">+${TR_STATS.tp} TP</span>
    <span style="color:var(--hi-bright)">+${TR_STATS.xp} XP</span>`;
}

function trRenderTarget(){
  const host = el("trTargetHost"); if(!host) return;
  if(TR_VARIANT==="dummy"){
    host.innerHTML = `<img src="assets/sprites/training_dummy.png?${SPRITE_VER}" style="width:100%" alt="Trainingspop">`;
  } else {
    // Puur sfeerbeeld tijdens het oefenen zelf (niet gekoppeld aan een echte
    // provincie) — de daadwerkelijke walls-verhoging gebeurt bewust apart,
    // via "Versterk je gebied" (SCREENS.trainingGarrison), niet automatisch
    // per goed antwoord.
    host.innerHTML = twGarrisonVisualHTML(TR_STATS.tp>0?3:1);
  }
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
    // Zelfde vlakke +2 XP-per-goed-antwoord-conventie als andere solo-spellen
    // (zie de _xp=_c*2+... berekening in games.js) — geen streak-bonus, geen
    // eindeloze opbouw, conform TOTAL_WAR.md §9.2's les uit Battle Mode.
    TR_STATS.correct++; TR_STATS.tp+=5; TR_STATS.xp+=2;
    if(TR_CIV) twAwardTrainingPoint(TR_CIV,5);
    addXP(2);
    if(TR_HERO_EL) BattleMotion.play(TR_HERO_EL,"swing");
    trRenderTarget();
  } else {
    TR_STATS.wrong++;
  }
  trUpdateStatsBar();
  setTimeout(trNextQuestion, ok?900:1400);
}

/* ------------------------------------------------------------------
   SCHERM: "Versterk je gebied" — TP besteden aan garnizoensupgrades
   ------------------------------------------------------------------ */
SCREENS.trainingGarrison = function(){
  document.body.classList.remove("greek");
  if(!BM_IDENT){ go("trainingMode"); return; }
  H(brand(true)+`
  <div class="scrhead"><button class="back" onclick="go('trainingMode')">${iconSVG("shield",20,"currentColor")}</button><h2>Versterk je gebied</h2></div>
  <div class="panel" style="text-align:center"><div class="note">Laden…</div></div>
  <div id="trGarrisonBody"></div>
  ${foot()}`);
  if(!TR_CIV){
    twLookupCivForKlas(BM_IDENT.klascode).then(civId=>{ TR_CIV=civId; trLoadGarrison(); });
  } else {
    trLoadGarrison();
  }
};

async function trLoadGarrison(){
  const body = el("trGarrisonBody"); if(!body) return;
  if(!TR_CIV){
    body.innerHTML = `<div class="panel"><div class="note warn">Je klas is nog niet gekoppeld aan een beschaving. Vraag je docent.</div></div>`;
    return;
  }
  if(!initFirebase()){
    body.innerHTML = `<div class="panel"><div class="note warn">Firebase niet beschikbaar.</div></div>`;
    return;
  }
  const [tpSnap, provSnap] = await Promise.all([
    fbDB.ref("totalwar/civs/"+TR_CIV+"/trainingPoints").once("value"),
    fbDB.ref("totalwar/provinces").once("value"),
  ]);
  const tp = tpSnap.val()||0;
  const provinces = provSnap.val()||{};
  const owned = Object.entries(provinces).filter(([id,p])=>p&&p.owner===TR_CIV);
  const civ = TW_CIVS[TR_CIV]||TW_CIVS.neutral;
  body.innerHTML = `
  <div class="panel" style="text-align:center">
    <span class="pill" style="background:${civ.soft};color:#f3e9d2;border:none">${esc(civ.nm)}</span>
    <div class="note" style="margin-top:8px">Beschikbare Trainingspunten: <b>${tp}</b></div>
  </div>
  ${owned.length?owned.map(([id,p])=>trProvinceUpgradeHTML(id,p,tp)).join(""):
    `<div class="panel"><div class="note">Jouw beschaving bezit nog geen provincies om te versterken.</div></div>`}`;
}

function trProvinceUpgradeHTML(id,p,tp){
  const nm = (typeof _twRegistry!=="undefined" && _twRegistry?.[id]?.displayName) || id;
  const walls=p.walls||0, towers=p.towers||0, militia=p.militia||0;
  const btn=(kind,cur)=>{
    const max=TR_UPGRADE_MAX[kind], cost=TR_UPGRADE_COST[kind];
    const maxed = max!=null && cur>=max;
    const disabled = maxed || tp<cost;
    return `<button class="btn ${disabled?'btn-ghost':'btn-gold'}" style="margin-top:6px;width:100%" ${disabled?'disabled':''}
      onclick="trBuyUpgrade('${id}','${kind}')">${TR_UPGRADE_LABEL[kind]} (${cost} TP)${maxed?' — max. bereikt':''}</button>`;
  };
  return `<div class="panel">
    <div style="display:flex;align-items:center;gap:12px">
      ${twGarrisonVisualHTML(walls)}
      <div>
        <b>${esc(nm)}</b>
        <div class="note">Muur ${walls}/5 · Toren ${towers}/3 · Militie ${militia}</div>
      </div>
    </div>
    ${btn("walls",walls)}
    ${btn("towers",towers)}
    ${btn("militia",militia)}
  </div>`;
}

async function trBuyUpgrade(provinceId,kind){
  const r = await twSpendGarrisonUpgrade(TR_CIV,provinceId,kind);
  if(!r.ok){ toast("Niet gelukt", r.reason||"Onbekende fout."); return; }
  toast("Versterkt!","");
  trLoadGarrison();
}

/* ------------------------------------------------------------------
   FIREBASE-HELPERS — schrijven/lezen op het bestaande /totalwar-schema
   (zie certamen/totalwar.js: twEnsureCampaignSeeded()). Vereist de
   uitgebreide rules die leerling-schrijfacties (geen Firebase Auth) op
   totalwar/provinces/{id} en totalwar/civs/{civId} toestaan.
   ------------------------------------------------------------------ */
async function twLookupCivForKlas(klascode){
  if(!klascode || !initFirebase()) return null;
  try{
    const snap = await fbDB.ref("totalwar/klasCivs/"+klascode).once("value");
    return snap.val() || null;
  }catch(e){ return null; }
}

async function twAwardTrainingPoint(civId, n){
  if(!civId || !initFirebase()) return;
  try{ await fbDB.ref("totalwar/civs/"+civId+"/trainingPoints").transaction(cur=>(cur||0)+n); }catch(e){}
}

// Guarded, tweestaps: eerst het TP-saldo veilig verlagen (transactie met
// abort bij onvoldoende saldo — zelfde conventie als bmAwardBattle() voor
// xp/coins), pas als dát lukt de provincie-upgrade toepassen. Geen echte
// atomaire multi-pad-operatie mogelijk (twee verschillende topniveau-paden
// in Firebase RTDB) — zelfde pragmatische aanpak als twResolveSiege().
async function twSpendGarrisonUpgrade(civId, provinceId, kind){
  const cost = TR_UPGRADE_COST[kind];
  if(!civId || !provinceId || !cost || !initFirebase()) return {ok:false};
  try{
    const spend = await fbDB.ref("totalwar/civs/"+civId+"/trainingPoints").transaction(cur=>{
      const bal = cur||0;
      if(bal<cost) return; // undefined = transactie afbreken (onvoldoende saldo)
      return bal-cost;
    });
    if(!spend.committed) return {ok:false, reason:"Onvoldoende Trainingspunten."};
    const max = TR_UPGRADE_MAX[kind];
    await fbDB.ref("totalwar/provinces/"+provinceId+"/"+kind).transaction(cur=>{
      const next=(cur||0)+1;
      return max!=null ? Math.min(max,next) : next;
    });
    return {ok:true};
  }catch(e){ return {ok:false, reason:e?.message||"Onbekende fout."}; }
}
