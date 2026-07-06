/* ============================================================================
   VRIJ OEFENEN — laagdrempelige solo-oefenmodus, los van Total War
   ----------------------------------------------------------------------------
   Geen klascode/leerlingcode nodig: werkt voor iedereen, ook zonder Battle
   Mode-identiteit — puur XP/munten op het gewone lokale profiel (P), dat
   vanzelf mee-synct als de speler wél een gekoppelde identiteit heeft (zie
   core.js: addXP()/syncXpDelta()). Geen provincie, geen klasgrootte-schaling,
   geen dagelijkse cap — dat hoort bij Training Mode (training.js), dat wél
   aan Total War gekoppeld is. Hergebruikt bewust bestaande bouwstenen:
   buildPool()/makeQuestion() (core.js) en de .qcard/.choices-opmaak
   (dezelfde als het Battle Mode-speler-vraagscherm).
   ============================================================================ */

let FP_DRAFT = { lang:"la", source:"freq", fromN:1, toN:100, cat:"all", customText:"" };
let FP_POOL = [];
let FP_Q = null;
let FP_STATS = { correct:0, wrong:0, xp:0, coins:0 };

SCREENS.freePractice = function(){
  document.body.classList.remove("greek");
  const list = baseList(FP_DRAFT.lang).filter(usable);
  const maxN = list.reduce((m,w)=>Math.max(m,w.f||0),0);
  H(brand(true)+`
  <div class="scrhead"><button class="back" onclick="go('home')">${iconSVG("shield",20,"currentColor")}</button><h2>Vrij oefenen</h2></div>
  <div class="panel"><div class="note">Oefen los van een klas of veldtocht — meteen beginnen, geen code nodig. Goede antwoorden geven gewoon XP en munten voor je profiel.</div></div>
  <div class="panel">
    <label class="fld">Taal</label>
    <div class="chips">
      <button class="chip ${FP_DRAFT.lang==='la'?'on':''}" onclick="FP_DRAFT.lang='la';SCREENS.freePractice()">Latijn</button>
      <button class="chip ${FP_DRAFT.lang==='el'?'on':''}" onclick="FP_DRAFT.lang='el';SCREENS.freePractice()">Grieks</button>
    </div>
  </div>
  <div class="panel">
    <label class="fld">Frequentiebereik — woord nr.</label>
    <div class="row">
      <div><input type="number" id="fpFromN" min="1" max="${maxN}" value="${FP_DRAFT.fromN}" oninput="FP_DRAFT.fromN=+this.value||1"></div>
      <div style="flex:0 0 auto;align-self:center;color:var(--muted)">t/m</div>
      <div><input type="number" id="fpToN" min="1" max="${maxN}" value="${Math.min(FP_DRAFT.toN,maxN)}" oninput="FP_DRAFT.toN=+this.value||1"></div>
    </div>
    <div class="chips" style="margin-top:12px">
      ${[[1,50],[1,100],[100,300],[300,600],[1,maxN]].map(([a,b])=>`<button class="chip" onclick="FP_DRAFT.fromN=${a};FP_DRAFT.toN=${b};SCREENS.freePractice()">${a}–${b}</button>`).join("")}
    </div>
  </div>
  <div class="panel">
    <label class="fld">Woordsoort</label>
    <div class="chips">
      ${CATS.map(c=>`<button class="chip ${FP_DRAFT.cat===c.id?'on':''}" onclick="FP_DRAFT.cat='${c.id}';SCREENS.freePractice()">${c.nm} <small>${catCount(list,c.id)}</small></button>`).join("")}
    </div>
  </div>
  <button class="btn btn-gold btn-block lg" onclick="fpStart()">Beginnen</button>
  ${foot()}`);
};

function fpStart(){
  FP_POOL = buildPool(FP_DRAFT);
  if(FP_POOL.length<4){ toast("Te weinig woorden","Kies een groter bereik of een andere woordsoort."); return; }
  FP_STATS = { correct:0, wrong:0, xp:0, coins:0 };
  go("freePracticePlay");
}

SCREENS.freePracticePlay = function(){
  document.body.classList.remove("greek");
  H(brand(true)+`
  <div class="scrhead"><button class="back" onclick="go('freePractice')">${iconSVG("shield",20,"currentColor")}</button><h2>Vrij oefenen</h2></div>
  <div class="panel" id="fpStatsBar" style="display:flex;justify-content:space-around;align-items:center"></div>
  <div class="panel" style="text-align:center">${avatarHTML(P.avatar,P.color,64)}</div>
  <div id="fpQuestionHost"></div>
  ${foot()}`);
  fpUpdateStatsBar();
  fpNextQuestion();
};

function fpUpdateStatsBar(){
  const bar = el("fpStatsBar"); if(!bar) return;
  bar.innerHTML = `<span class="note">✅ ${FP_STATS.correct} goed</span>
    <span style="color:var(--hi-bright)">+${FP_STATS.xp} XP</span>
    <span style="color:var(--hi-bright)">+${FP_STATS.coins} <small>munten</small></span>`;
}

function fpNextQuestion(){
  FP_Q = makeQuestion(FP_POOL);
  const host = el("fpQuestionHost"); if(!host) return;
  const lang = FP_DRAFT.lang==="el"?"Griekse":"Latijnse";
  host.innerHTML = `
  <div class="qcard">
    <div class="kick">Vertaal het ${lang} woord</div>
    <div class="word">${esc(FP_Q.la)}</div>
    ${FP_Q.pos?`<div class="pos">${esc(FP_Q.pos)}</div>`:""}
  </div>
  <div class="choices">
    ${FP_Q.options.map((opt,i)=>`<button class="choice" id="fpC${i}" onclick="fpAnswer(${i})"><span class="n">${i+1}</span>${esc(opt)}</button>`).join("")}
  </div>`;
}

function fpAnswer(idx){
  if(!FP_Q) return;
  const q = FP_Q; FP_Q = null; // dubbelklikken tijdens de korte pauze voorkomen
  const ok = idx===q.correctIdx;
  [0,1,2,3].forEach(i=>{
    const c=el("fpC"+i); if(!c) return;
    if(i===q.correctIdx) c.classList.add("correct");
    else if(i===idx && !ok) c.classList.add("wrong");
    else c.classList.add("dim");
    c.disabled=true;
  });
  if(ok){
    FP_STATS.correct++; FP_STATS.xp+=2; FP_STATS.coins+=2;
    P.stats.totalCorrect++; P.stats.currentStreak++;
    if(P.stats.currentStreak>P.stats.bestStreak) P.stats.bestStreak=P.stats.currentStreak;
    addXP(2); addCoins(2);
    saveProfile(); checkAch({mode:"freepractice"});
    beep("good");
  } else {
    FP_STATS.wrong++;
    P.stats.totalWrong++; P.stats.currentStreak=0; saveProfile();
    beep("bad");
  }
  fpUpdateStatsBar();
  setTimeout(fpNextQuestion, ok?900:1400);
}
