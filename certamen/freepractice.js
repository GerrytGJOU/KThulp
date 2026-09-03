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

let FP_DRAFT = { lang:"la", source:"freq", fromN:1, toN:100, cat:"all", customText:"", vf:vfqDefaultDraft("la") };
let FP_POOL = [];
let FP_Q = null;
let FP_STATS = { correct:0, wrong:0, xp:0, coins:0 };
let FP_WRONG_COUNTS = {}; // gespreide herhaling: fout beantwoorde woorden komen vaker terug (zie core.js: pickWeighted)

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
      <button class="chip ${FP_DRAFT.lang==='la'?'on':''}" onclick="fpSetLang('la')">Latijn</button>
      <button class="chip ${FP_DRAFT.lang==='el'?'on':''}" onclick="fpSetLang('el')">Grieks</button>
    </div>
  </div>
  <div class="panel">
    <label class="fld">Bron</label>
    <div class="chips">
      <button class="chip ${FP_DRAFT.source==='freq'?'on':''}" onclick="FP_DRAFT.source='freq';SCREENS.freePractice()">Frequentielijst</button>
      <button class="chip ${FP_DRAFT.source==='verbforms'?'on':''}" onclick="FP_DRAFT.source='verbforms';SCREENS.freePractice()">Werkwoordsvormen</button>
    </div>
  </div>
  <div id="fpSrcBody"></div>
  <button class="btn btn-gold btn-block lg" onclick="fpStart()">Beginnen</button>
  ${foot()}`);
  fpRenderSrcBody();
};

function fpSetLang(lang){ FP_DRAFT.lang=lang; FP_DRAFT.vf=vfqDefaultDraft(lang); SCREENS.freePractice(); }

function fpRenderSrcBody(){
  const body = el("fpSrcBody"); if(!body) return;
  if(FP_DRAFT.source==="verbforms"){
    body.innerHTML = vfqFilterHTML(FP_DRAFT.vf, FP_DRAFT.lang, "FP_DRAFT.vf", "fpRenderSrcBody()");
    return;
  }
  const list = baseList(FP_DRAFT.lang).filter(usable);
  const maxN = list.reduce((m,w)=>Math.max(m,w.f||0),0);
  body.innerHTML = `<div class="panel">
    <label class="fld">Frequentiebereik — woord nr.</label>
    <div class="row">
      <div><input type="number" id="fpFromN" min="1" max="${maxN}" value="${FP_DRAFT.fromN}" oninput="FP_DRAFT.fromN=+this.value||1"></div>
      <div style="flex:0 0 auto;align-self:center;color:var(--muted)">t/m</div>
      <div><input type="number" id="fpToN" min="1" max="${maxN}" value="${Math.min(FP_DRAFT.toN,maxN)}" oninput="FP_DRAFT.toN=+this.value||1"></div>
    </div>
    <div class="chips" style="margin-top:12px">
      ${[[1,50],[1,100],[100,300],[300,600],[1,maxN]].map(([a,b])=>`<button class="chip" onclick="FP_DRAFT.fromN=${a};FP_DRAFT.toN=${b};fpRenderSrcBody()">${a}–${b}</button>`).join("")}
    </div>
  </div>
  <div class="panel">
    <label class="fld">Woordsoort</label>
    <div class="chips">
      ${CATS.map(c=>`<button class="chip ${FP_DRAFT.cat===c.id?'on':''}" onclick="FP_DRAFT.cat='${c.id}';fpRenderSrcBody()">${c.nm} <small>${catCount(list,c.id)}</small></button>`).join("")}
    </div>
  </div>`;
}

function fpStart(){
  if(FP_DRAFT.source==="verbforms"){
    FP_POOL = vfqBuildPool(FP_DRAFT.vf, FP_DRAFT.lang);
    if(FP_POOL.length<4){ toast("Te weinig vormen","Kies meer werkwoorden of tijden."); return; }
  } else {
    FP_POOL = buildPool(FP_DRAFT);
    if(FP_POOL.length<4){ toast("Te weinig woorden","Kies een groter bereik of een andere woordsoort."); return; }
  }
  FP_STATS = { correct:0, wrong:0, xp:0, coins:0 };
  FP_WRONG_COUNTS = {};
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
  const host = el("fpQuestionHost"); if(!host) return;
  if(FP_DRAFT.source==="verbforms" && FP_DRAFT.vf.mode==="ontleed"){
    vfqOntleedReset();
    FP_Q = vfqMakeOntleedQuestion(FP_POOL);
    fpRenderOntleed();
    return;
  }
  if(FP_DRAFT.source==="verbforms" && FP_DRAFT.vf.mode==="typed"){
    FP_Q = vfqMakeTypedQuestion(FP_POOL);
    host.innerHTML = `
    <div class="qcard"><div class="kick">${FP_Q.taal==="el"?"Grieks":"Latijn"} — getypte vorm</div>
      <div class="word" style="font-size:20px">${FP_Q.vraag}</div></div>
    <div class="panel"><input type="text" id="fpTyped" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="typ de vorm..." style="width:100%;font-size:18px" onkeydown="if(event.key==='Enter')fpAnswerTyped()">
      <button class="btn btn-gold btn-block" style="margin-top:10px" onclick="fpAnswerTyped()">Controleer</button></div>`;
    el("fpTyped").focus();
    return;
  }
  FP_Q = FP_DRAFT.source==="verbforms" ? vfqMakeQuestion(FP_POOL) : makeQuestion(FP_POOL, w=>2*(FP_WRONG_COUNTS[w.la]||0));
  const kick = FP_DRAFT.source==="verbforms" ? "Welke vertaling hoort bij deze vorm?" : `Vertaal het ${FP_DRAFT.lang==="el"?"Griekse":"Latijnse"} woord`;
  const woord = FP_DRAFT.source==="verbforms" ? FP_Q.vorm : FP_Q.la;
  host.innerHTML = `
  <div class="qcard">
    <div class="kick">${kick}</div>
    <div class="word">${esc(woord)}</div>
    ${FP_Q.pos?`<div class="pos">${esc(FP_Q.pos)}</div>`:""}
  </div>
  <div class="choices">
    ${FP_Q.options.map((opt,i)=>`<button class="choice" id="fpC${i}" onclick="fpAnswer(${i})"><span class="n">${i+1}</span>${esc(opt)}</button>`).join("")}
  </div>`;
}

function fpRenderOntleed(){
  const host = el("fpQuestionHost"); if(!host || !FP_Q) return;
  host.innerHTML = vfqOntleedPickerHTML(FP_Q, "fpRenderOntleed()")
    + `<button class="btn btn-gold btn-block" style="margin-top:10px"${vfqOntleedComplete(FP_Q)?"":" disabled"} onclick="fpCheckOntleed()">Controleer</button>`;
}
function fpCheckOntleed(){
  if(!FP_Q) return;
  const q = FP_Q; FP_Q = null;
  const grade = vfqOntleedGrade(q);
  const host = el("fpQuestionHost"); if(!host) return;
  host.innerHTML = vfqOntleedResultHTML(q, grade)
    + `<div class="panel" style="text-align:center;color:${grade.ok?'var(--good,#4a4)':'var(--bad,#a44)'}">${grade.ok?"Goed!":"Niet helemaal — bekijk de rode/groene assen hierboven"}</div>`;
  fpScoreAnswer(grade.ok, null);
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
  fpScoreAnswer(ok, q.la);
}

function fpAnswerTyped(){
  if(!FP_Q) return;
  const q = FP_Q; FP_Q = null;
  const box = el("fpTyped");
  const typed = box ? box.value : "";
  const ok = vfqControleer(q, typed);
  const host = el("fpQuestionHost");
  if(host) host.insertAdjacentHTML("beforeend", `<div class="panel" style="text-align:center;color:${ok?'var(--good,#4a4)':'var(--bad,#a44)'}">${ok?"Goed!":"Fout — juiste antwoord: "+esc(q.antwoord)}</div>`);
  if(box) box.disabled = true;
  fpScoreAnswer(ok, null);
}

function fpScoreAnswer(ok, wrongKey){
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
    if(wrongKey) FP_WRONG_COUNTS[wrongKey]=(FP_WRONG_COUNTS[wrongKey]||0)+1;
    beep("bad");
  }
  fpUpdateStatsBar();
  setTimeout(fpNextQuestion, ok?900:1400);
}
