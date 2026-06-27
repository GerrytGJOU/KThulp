/* ---- HOME ---- */
SCREENS.home = function(){
  document.body.classList.remove("greek");
  H(brand(true)+`
  <div class="eyebrow l">Kies wat je wilt doen</div>
  <button class="tile" onclick="startHost()">
    <span class="corner">${iconSVG("column",88,"currentColor")}</span>
    <span class="ic">${iconSVG("helmet",44,"currentColor")}</span>
    <h3>Wedstrijd starten</h3>
    <p>Voor docenten. Kies woorden en een spel, en projecteer de code op het bord.</p>
  </button>
  <button class="tile" onclick="go('join')">
    <span class="ic">${iconSVG("shield",44,"currentColor")}</span>
    <h3>Meedoen</h3>
    <p>Voor leerlingen. Voer de code in die op het bord staat.</p>
  </button>
  <button class="tile" onclick="go('collection')">
    <span class="ic">${iconSVG("amphora",44,"currentColor")}</span>
    <h3>Mijn verzameling</h3>
    <p>Eerbewijzen, munten en avatars die je hebt verdiend.</p>
  </button>
  <button class="tile" onclick="go('battleHome')">
    <span class="ic">${iconSVG("eagle",44,"currentColor")}</span>
    <h3>⚔️ Battle Mode <span style="font-size:11px;background:var(--ox);color:#fff;border-radius:4px;padding:2px 5px;vertical-align:middle;margin-left:4px">NIEUW</span></h3>
    <p>Twee teams strijden om woordkennis. Verdien Battle Energy met goede antwoorden.</p>
  </button>
  ${!hasFirebase?`<div class="panel"><div class="note warn">Firebase is nog niet ingesteld. Je kunt de spellen nu al uitproberen in de <b>oefenmodus</b> (met computer-spelers). Voor échte leerlingen op aparte iPads: vul je Firebase-gegevens in (zie de instructies bovenaan het bestand).</div></div>`:""}
  ${foot()}`);
};

/* ---- HOST: spel kiezen ---- */
function startHost(){ ROLE="host"; go("hostGamePick"); }
SCREENS.hostGamePick = function(){
  H(brand(true)+`<div class="scrhead"><button class="back" onclick="leaveAll();go('home')">${iconSVG("shield",20,"currentColor")}</button><h2>Kies een spel</h2></div>
  <button class="tile" onclick="pickGame('touwtrekken')">
    <span class="corner">${iconSVG("shield",88,"currentColor")}</span>
    <span class="ic">${iconSVG("shield",44,"currentColor")}</span>
    <h3>Touwtrekken</h3>
    <p>Twee teams. Een goed antwoord trekt het touw jouw kant op, een fout antwoord de andere kant. Eerste team over de streep wint.</p>
  </button>
  <button class="tile" onclick="pickGame('marathon')">
    <span class="corner">${iconSVG("column",88,"currentColor")}</span>
    <span class="ic">${iconSVG("horse",44,"currentColor")}</span>
    <h3>Marathon <span class="pill">Grieks thema</span></h3>
    <p>Iedereen rent tegelijk. Goed = vooruit, fout = terug of even stilstaan. Eerste over de finish wint.</p>
  </button>
  <button class="tile" onclick="pickGame('snelvuur')">
    <span class="corner">${iconSVG("torch",88,"currentColor")}</span>
    <span class="ic">${iconSVG("torch",44,"currentColor")}</span>
    <h3>Snelvuur</h3>
    <p>Iedereen speelt tegelijk. Geef in de beschikbare tijd zoveel mogelijk goede antwoorden. De hoogste score wint.</p>
  </button>
  ${foot()}`);
};
function pickGame(g){ DRAFT.game=g; DRAFT.target = g==="touwtrekken"?15:g==="snelvuur"?120:20; go("hostSource"); }

/* ---- HOST: woordbron ---- */
SCREENS.hostSource = function(){
  const baseLA = VOCAB_LA.filter(usable).length, baseEL = VOCAB_EL.filter(usable).length;
  H(brand(true)+`<div class="scrhead"><button class="back" onclick="go('hostGamePick')">${iconSVG("shield",20,"currentColor")}</button><h2>Welke woorden?</h2></div>
  <div class="panel">
    <label class="fld">Bron</label>
    <div class="chips" id="srcChips">
      <button class="chip ${DRAFT.source==='freq'&&DRAFT.lang==='la'?'on':''}" onclick="setSrc('freq','la')">Latijn — frequentielijst <small>${baseLA}</small></button>
      <button class="chip ${DRAFT.source==='freq'&&DRAFT.lang==='el'?'on':''}" onclick="setSrc('freq','el')">Grieks — frequentielijst <small>${baseEL}</small></button>
      <button class="chip ${DRAFT.source==='custom'?'on':''}" onclick="setSrc('custom','')">Eigen lijst</button>
    </div>
  </div>
  <div id="srcBody"></div>
  <button class="btn btn-gold btn-block lg" onclick="confirmSource()">Verder</button>
  ${foot()}`);
  renderSrcBody();
};
function setSrc(src,lang){ DRAFT.source=src; if(lang)DRAFT.lang=lang; SCREENS.hostSource(); }
function renderSrcBody(){
  const body = el("srcBody"); if(!body) return;
  if(DRAFT.source==="custom"){
    body.innerHTML = `<div class="panel">
      <label class="fld">Plak je woorden — één per regel: <b>woord = betekenis</b></label>
      <textarea id="customBox" placeholder="servus = slaaf\namo = liefhebben, houden van\nμάχη = strijd, gevecht">${esc(DRAFT.customText)}</textarea>
      <div class="note" style="margin:10px 0">Of upload een bestand (.csv, .txt of Excel .xlsx) met het woord in kolom 1 en de betekenis in kolom 2.</div>
      <label class="filepick">${iconSVG("amphora",18,"currentColor")}<span>Bestand kiezen</span>
        <input type="file" id="fileIn" accept=".csv,.txt,.tsv,.xlsx,.xls" onchange="handleFile(this)"></label>
      <div id="customMsg" class="note" style="margin-top:8px"></div>
    </div>`;
  } else {
    const list = baseList(DRAFT.lang).filter(usable);
    const maxN = list.reduce((m,w)=>Math.max(m,w.f||0),0);
    body.innerHTML = `<div class="panel">
      <label class="fld">Frequentiebereik — woord nr.</label>
      <div class="row">
        <div><input type="number" id="fromN" min="1" max="${maxN}" value="${DRAFT.fromN}" oninput="DRAFT.fromN=+this.value||1"></div>
        <div style="flex:0 0 auto;align-self:center;color:var(--muted)">t/m</div>
        <div><input type="number" id="toN" min="1" max="${maxN}" value="${Math.min(DRAFT.toN,maxN)}" oninput="DRAFT.toN=+this.value||1"></div>
      </div>
      <div class="chips" style="margin-top:12px">
        ${[[1,50],[1,100],[100,300],[300,600],[1,maxN]].map(([a,b])=>`<button class="chip" onclick="setRange(${a},${b})">${a}–${b}</button>`).join("")}
      </div>
    </div>
    <div class="panel">
      <label class="fld">Woordsoort</label>
      <div class="chips">
        ${CATS.map(c=>`<button class="chip ${DRAFT.cat===c.id?'on':''}" onclick="setCat('${c.id}')">${c.nm} <small>${catCount(list,c.id)}</small></button>`).join("")}
      </div>
    </div>`;
  }
}
function setRange(a,b){ DRAFT.fromN=a; DRAFT.toN=b; SCREENS.hostSource(); }
function setCat(id){ DRAFT.cat=id; SCREENS.hostSource(); }
function handleFile(input){
  const file=input.files&&input.files[0]; if(!file)return;
  const msg=el("customMsg"); if(msg)msg.textContent="Bestand lezen…";
  const name=(file.name||"").toLowerCase();
  const reader=new FileReader();
  reader.onerror=()=>{ if(msg)msg.textContent="Kon het bestand niet lezen."; };
  if(name.endsWith(".xlsx")||name.endsWith(".xls")){
    // SheetJS alleen laden als het nodig is
    loadSheetJS().then(XLSX=>{
      reader.onload=e=>{ try{
        const wb=XLSX.read(new Uint8Array(e.target.result),{type:"array"});
        const rows=XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]],{header:1,defval:""});
        ingestRows(rows);
      }catch(err){ if(msg)msg.textContent="Kon het Excel-bestand niet lezen."; } };
      reader.readAsArrayBuffer(file);
    }).catch(()=>{ if(msg)msg.textContent="Excel vereist internet. Plak de woorden anders als tekst."; });
  } else {
    reader.onload=e=>{ try{
      const text=e.target.result, sep=text.indexOf("\t")>=0?"\t":(text.indexOf(";")>=0?";":",");
      ingestRows(text.split(/\r?\n/).map(l=>l.split(sep)));
    }catch(err){ if(msg)msg.textContent="Kon het bestand niet lezen."; } };
    reader.readAsText(file);
  }
}
function loadSheetJS(){
  return new Promise((res,rej)=>{
    if(window.XLSX) return res(window.XLSX);
    const s=document.createElement("script");
    s.src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
    s.onload=()=>res(window.XLSX); s.onerror=rej; document.head.appendChild(s);
  });
}
function ingestRows(rows){
  const msg=el("customMsg");
  if(!rows||!rows.length){ if(msg)msg.textContent="Leeg bestand."; return; }
  let la=0,nl=1,start=0;
  const head=rows[0].map(c=>String(c||"").toLowerCase());
  const fi=head.findIndex(h=>/lat|grie|woord/.test(h)), ni=head.findIndex(h=>/vert|betek|meaning/.test(h));
  if(fi>=0&&ni>=0){ la=fi;nl=ni;start=1; } else if(head.some(h=>/[a-zα-ω]/.test(h))){ start=1; }
  const lines=[];
  for(let r=start;r<rows.length;r++){ const row=rows[r]; if(!row)continue;
    const a=String(row[la]==null?"":row[la]).trim(), b=String(row[nl]==null?"":row[nl]).trim();
    if(a&&b)lines.push(a+" = "+b);
  }
  DRAFT.customText=lines.join("\n"); DRAFT.source="custom";
  const box=el("customBox"); if(box)box.value=DRAFT.customText;
  if(msg)msg.textContent="Ingelezen: "+lines.length+" woorden.";
}
function confirmSource(){
  if(DRAFT.source==="custom"){ const box=el("customBox"); if(box)DRAFT.customText=box.value; }
  const pool=buildPool(DRAFT);
  if(pool.length<4){ toast("Te weinig woorden","Kies een groter bereik of voeg meer woorden toe."); return; }
  if(DRAFT.game==="battle"){ go("battleHostSettings"); return; }
  go("hostSettings");
}

/* ---- HOST: instellingen ---- */
SCREENS.hostSettings = function(){
  const g=DRAFT.game;
  const poolN = buildPool(DRAFT).length;
  const gameNm=g==="touwtrekken"?"Touwtrekken":g==="snelvuur"?"Snelvuur":"Marathon";
  H(brand(true)+`<div class="scrhead"><button class="back" onclick="go('hostSource')">${iconSVG("shield",20,"currentColor")}</button><h2>Instellingen</h2></div>
  <div class="panel"><div class="note">Spel: <b>${gameNm}</b> · ${poolN} woorden geselecteerd.</div></div>
  ${g==="snelvuur"?`
  <div class="panel">
    <label class="fld">Tijdsduur</label>
    <div class="chips">${[60,90,120,180,300].map(n=>`<button class="chip ${DRAFT.target===n?'on':''}" onclick="DRAFT.target=${n};SCREENS.hostSettings()">${n<120?n+"s":n/60+"min"}</button>`).join("")}</div>
  </div>`:g==="touwtrekken"?`
  <div class="panel">
    <label class="fld">Lengte van het touw (punten voorsprong om te winnen)</label>
    <div class="chips">${[10,15,20,30].map(n=>`<button class="chip ${DRAFT.target===n?'on':''}" onclick="DRAFT.target=${n};SCREENS.hostSettings()">${n}</button>`).join("")}</div>
  </div>`:`
  <div class="panel">
    <label class="fld">Afstand tot de finish</label>
    <div class="chips">${[15,20,25,30].map(n=>`<button class="chip ${DRAFT.target===n?'on':''}" onclick="DRAFT.target=${n};SCREENS.hostSettings()">${n}</button>`).join("")}</div>
  </div>
  <div class="panel">
    <label class="fld">Bij een fout antwoord</label>
    <div class="chips">
      <button class="chip ${DRAFT.penalty==='back'?'on':''}" onclick="DRAFT.penalty='back';SCREENS.hostSettings()">Stap terug</button>
      <button class="chip ${DRAFT.penalty==='freeze'?'on':''}" onclick="DRAFT.penalty='freeze';SCREENS.hostSettings()">Even stilstaan</button>
    </div>
    ${DRAFT.penalty==='freeze'?`<div style="margin-top:12px"><label class="fld">Aantal seconden stilstaan</label>
      <div class="chips">${[3,4,5,6].map(n=>`<button class="chip ${DRAFT.freezeSec===n?'on':''}" onclick="DRAFT.freezeSec=${n};SCREENS.hostSettings()">${n}s</button>`).join("")}</div></div>`:""}
  </div>`}
  <button class="btn btn-gold btn-block lg" onclick="createRoom()">Wedstrijd aanmaken</button>
  ${foot()}`);
};

/* ---- HOST: kamer aanmaken ---- */
function chooseNet(){
  if(hasFirebase && initFirebase()){ Net=FBNet; } else { Net=DemoNet; }
}
async function createRoom(){
  chooseNet();
  const pool = buildPool(DRAFT);
  POOL = pool;
  const meta = { game:DRAFT.game, lang:DRAFT.lang, target:DRAFT.target, penalty:DRAFT.penalty, freezeSec:DRAFT.freezeSec, createdAt:Net.serverTime() };
  META = meta;
  // unieke code
  let c = code4();
  if(Net===FBNet){ for(let i=0;i<5;i++){ const ex=await Net.exists(c); if(!ex)break; c=code4(); } }
  CODE=c;
  const state = { status:"lobby", ropePos:0, winner:null };
  await Net.createRoom(c, { meta, pool, state, players:{} });
  go("hostLobby");
}

/* ---- HOST: lobby ---- */
SCREENS.hostLobby = function(){
  const url = location.origin+location.pathname+"?room="+CODE;
  H(brand(false)+`<div class="scrhead"><button class="back" onclick="leaveAll();go('home')">${iconSVG("shield",20,"currentColor")}</button><h2>${META.game==="touwtrekken"?"Touwtrekken":META.game==="snelvuur"?"Snelvuur":"Marathon"}</h2></div>
  <div class="codecard">
    <div class="lbl">Speelcode</div>
    <div class="code">${CODE}</div>
    <div class="url">${Net===DemoNet?"Oefenmodus — voeg computer-spelers toe en start":esc(url)}</div>
  </div>
  <div class="panel">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
      <h3 style="margin:0">Spelers <span id="pcount">(0)</span></h3>
      <button class="btn btn-ghost" style="padding:9px 14px" onclick="addBot()">+ Computer-speler</button>
    </div>
    <div class="plist" id="lobbyList"><div class="note">Wachten op spelers…</div></div>
  </div>
  ${META.game==="touwtrekken"?`<button class="btn btn-ghost btn-block" onclick="shuffleTeams()" style="margin-bottom:12px">Teams door elkaar husselen</button>`:""}
  <button class="btn btn-gold btn-block lg" id="startBtn" onclick="startGame()" disabled>Start de wedstrijd</button>
  ${foot()}`);
  unsubPlayers = Net.onPlayers(CODE, ps=>{ PLAYERS=ps||{}; renderLobby(); });
};
function renderLobby(){
  const ids=Object.keys(PLAYERS);
  const cnt=el("pcount"); if(cnt)cnt.textContent="("+ids.length+")";
  const list=el("lobbyList");
  if(list){
    list.innerHTML = ids.length ? ids.map(id=>{ const p=PLAYERS[id];
      const team = META.game==="touwtrekken" ? `<span style="width:10px;height:10px;border-radius:50%;background:${p.team==='A'?'var(--teamA)':'var(--teamB)'};display:inline-block;margin-left:4px"></span>`:"";
      return `<span class="ptag ${p.isBot?'bot':''}"><span class="av">${avatarHTML(p.avatar,p.color,30)}</span>${esc(p.name)}${team}</span>`;
    }).join("") : `<div class="note">Wachten op spelers…</div>`;
  }
  const btn=el("startBtn"); if(btn)btn.disabled = ids.length<1;
}
function addBot(){
  const names=["Brutus","Livia","Cato","Iulia","Marcus","Flavia","Drusus","Cornelia","Nero","Aelia","Galba","Tullia"];
  const used=Object.values(PLAYERS).map(p=>p.name);
  let nm=pick(names); let tries=0; while(used.includes(nm)&&tries<20){ nm=pick(names)+" "+(rand(9)+1); tries++; }
  const team = teamBalance();
  const p={ name:nm, color:pick(COLORS), avatar:pick(AVATARS).id, isBot:true, online:true,
    team, pos:0, correct:0, wrong:0, frozenUntil:0, skill:0.55+Math.random()*0.35 };
  Net.addPlayer(CODE, p);
}
function teamBalance(){
  if(META.game!=="touwtrekken") return "A";
  let a=0,b=0; Object.values(PLAYERS).forEach(p=>{ if(p.team==="A")a++; else if(p.team==="B")b++; });
  return a<=b ? "A" : "B";
}
function shuffleTeams(){
  const ids=shuffle(Object.keys(PLAYERS));
  ids.forEach((id,i)=>Net.updatePlayer(CODE,id,{team: i%2===0?"A":"B"}));
}

/* ---- HOST: spel starten ---- */
function startGame(){
  const stPatch={ status:"playing", startedAt:Net.serverTime(), ropePos:0, winner:null };
  if(META.game==="snelvuur") stPatch.deadline = Date.now() + (META.target||120)*1000;
  Net.setState(CODE, stPatch);
  Object.keys(PLAYERS).forEach(id=>Net.updatePlayer(CODE,id,{pos:0,correct:0,wrong:0,finished:false,frozenUntil:0}));
  go("hostGame");
}

/* ---- HOST: spelweergave (projectie) ---- */
SCREENS.hostGame = function(){
  const greek = META.game==="marathon";
  const gameNm=META.game==="touwtrekken"?"Touwtrekken":META.game==="snelvuur"?"Snelvuur":"Marathon";
  H(brand(false)+`<div class="scrhead"><button class="back" onclick="endGameManual()">${iconSVG("shield",20,"currentColor")}</button>
    <h2>${gameNm}</h2><span class="pill">code ${CODE}</span></div>
    <div id="gameRoot"></div>${foot()}`);
  if(META.game==="touwtrekken") buildRope();
  else if(META.game==="snelvuur") buildScoreboard();
  else buildTrack();
  unsubState = Net.onState(CODE, s=>{ STATE=s||{}; if(STATE.status==="finished"){ showResultHost(); } else { updateGameView(); } });
  unsubPlayers = Net.onPlayers(CODE, ps=>{ PLAYERS=ps||{}; updateGameView(); hostCheckEnd(); });
  startBots();
  // Snelvuur: countdown-display bijwerken elke seconde
  if(META.game==="snelvuur"){
    if(freezeTimer)clearInterval(freezeTimer);
    freezeTimer=setInterval(()=>{
      const ct=el("snelvuurCountdown"); if(!ct)return;
      const left=Math.max(0,Math.ceil(((STATE.deadline||Date.now())-Date.now())/1000));
      ct.textContent=left+"s";
      if(left===0){clearInterval(freezeTimer);freezeTimer=null;}
    },500);
  }
};
function endGameManual(){ Net.setState(CODE,{status:"finished",winner:"_stopped"}); }

function startBots(){
  if(botTimer)clearInterval(botTimer);
  botTimer=setInterval(()=>{
    if(STATE.status!=="playing")return;
    if(META.game==="snelvuur"){hostCheckEnd();}
    Object.keys(PLAYERS).forEach(id=>{
      const p=PLAYERS[id]; if(!p.isBot)return;
      if(META.game!=="snelvuur"&&p.finished)return;
      if(p.frozenUntil&&nowMs()<p.frozenUntil)return;
      if(Math.random()<0.45){ // niet elke tick
        const ok = Math.random() < (p.skill||0.6);
        applyAnswer(id, p, ok);
      }
    });
  }, 900);
}

/* gedeelde antwoord-afhandeling (gebruikt door bots op host én door spelers lokaal) */
function applyAnswer(pid, p, ok){
  if(META.game==="snelvuur"){
    Net.updatePlayer(CODE, pid, ok?{correct:(p.correct||0)+1}:{wrong:(p.wrong||0)+1});
    return;
  }
  if(META.game==="touwtrekken"){
    const dir = p.team==="A" ? -1 : 1;       // A trekt naar links (negatief), B naar rechts
    const delta = ok ? dir : -dir;
    Net.ropePull(CODE, delta, -META.target, META.target);
    Net.updatePlayer(CODE, pid, ok?{correct:(p.correct||0)+1}:{wrong:(p.wrong||0)+1});
  } else {
    if(ok){
      const np=Math.min(META.target,(p.pos||0)+1);
      const patch={ pos:np, correct:(p.correct||0)+1 };
      if(np>=META.target){ patch.finished=true; patch.finishedAt=Net.serverTime(); }
      Net.updatePlayer(CODE, pid, patch);
    } else {
      if(META.penalty==="freeze"){ Net.updatePlayer(CODE,pid,{ frozenUntil: nowMs()+META.freezeSec*1000, wrong:(p.wrong||0)+1 }); }
      else { Net.updatePlayer(CODE,pid,{ pos:Math.max(0,(p.pos||0)-1), wrong:(p.wrong||0)+1 }); }
    }
  }
}

/* host bepaalt het einde */
let _ending=false;
function hostCheckEnd(){
  if(ROLE!=="host"||STATE.status!=="playing"||_ending)return;
  if(META.game==="touwtrekken"){
    const rp=STATE.ropePos||0;
    if(rp<=-META.target){ _ending=true; Net.setState(CODE,{status:"finished",winner:"A"}); }
    else if(rp>=META.target){ _ending=true; Net.setState(CODE,{status:"finished",winner:"B"}); }
  } else if(META.game==="snelvuur"){
    if(STATE.deadline && Date.now() >= STATE.deadline){
      const sorted=Object.entries(PLAYERS).sort((a,b)=>(b[1].correct||0)-(a[1].correct||0));
      _ending=true;
      Net.setState(CODE,{status:"finished",winner:sorted.length?sorted[0][0]:"_stopped"});
    }
  } else {
    const fin=Object.entries(PLAYERS).filter(([id,p])=>p.finished).sort((a,b)=>(a[1].finishedAt||0)-(b[1].finishedAt||0));
    if(fin.length){ _ending=true; Net.setState(CODE,{status:"finished",winner:fin[0][0]}); }
  }
}

/* ---- TOUWTREKKEN view ---- */
function buildRope(){
  const root=el("gameRoot"); if(!root)return;
  root.innerHTML=`<div class="arena">
    <div class="teamscores">
      <div class="ts r"><div class="nm" style="color:var(--teamA)">Rubri (Rood)</div><div class="sc" id="scA">0 goed</div></div>
      <div class="ts b"><div class="nm" style="color:var(--teamB)">Caerulei (Blauw)</div><div class="sc" id="scB">0 goed</div></div>
    </div>
    <div class="ropelane">
      <div class="goal l"></div><div class="center"></div><div class="goal r"></div>
      <div class="rope"></div><div class="knot" id="knot" style="left:50%"></div>
    </div>
    <div class="pullers"><div class="pullcol r" id="pullA"></div><div class="pullcol b" id="pullB"></div></div>
  </div>`;
}
function buildTrack(){
  const root=el("gameRoot"); if(!root)return;
  root.innerHTML=`<div class="track" id="trackBox"></div>`;
  updateGameView();
}
function buildScoreboard(){
  const root=el("gameRoot"); if(!root)return;
  root.innerHTML=`<div style="margin-bottom:10px;display:flex;align-items:center;justify-content:space-between">
    <div style="font-size:28px;font-weight:700">Tijd: <span id="snelvuurCountdown" style="color:var(--hi)">—</span></div>
    <div style="font-size:13px;color:var(--muted)">${Object.keys(PLAYERS).length} speler(s)</div>
  </div>
  <div id="scoreList" style="display:flex;flex-direction:column;gap:6px"></div>`;
  updateGameView();
}
function updateGameView(){
  if(!el("gameRoot"))return;
  if(META.game==="snelvuur"){
    const sl=el("scoreList"); if(!sl)return;
    const sorted=Object.values(PLAYERS).sort((a,b)=>(b.correct||0)-(a.correct||0));
    sl.innerHTML=sorted.map((p,i)=>`<div style="display:flex;align-items:center;gap:10px;padding:7px 10px;background:var(--stone3);border-radius:8px">
      <span style="font-size:18px;font-weight:700;color:var(--muted);min-width:22px">${i+1}</span>
      ${avatarHTML(p.avatar,p.color,30)}
      <span style="flex:1;font-size:14px">${esc(p.name)}</span>
      <span style="font-size:20px;font-weight:700;color:var(--hi)">${p.correct||0}</span>
      <span style="font-size:11px;color:var(--muted)">goed</span>
    </div>`).join("") || `<div class="note">Nog geen antwoorden…</div>`;
    return;
  }
  if(META.game==="touwtrekken"){
    const rp=clamp(STATE.ropePos||0,-META.target,META.target);
    const pct = 50 + (rp/META.target)*44; // 6%..94% effectief
    const knot=el("knot"); if(knot)knot.style.left=pct+"%";
    const A=Object.values(PLAYERS).filter(p=>p.team==="A");
    const B=Object.values(PLAYERS).filter(p=>p.team==="B");
    const sa=el("scA"), sb=el("scB");
    if(sa)sa.textContent=A.reduce((s,p)=>s+(p.correct||0),0)+" goed";
    if(sb)sb.textContent=B.reduce((s,p)=>s+(p.correct||0),0)+" goed";
    const top=(arr)=>arr.slice().sort((a,b)=>(b.correct||0)-(a.correct||0)).slice(0,5)
      .map(p=>`<div class="pullrow"><span class="av">${avatarHTML(p.avatar,p.color,24)}</span>${esc(p.name)} · ${p.correct||0}</div>`).join("")||`<div class="note">—</div>`;
    const pa=el("pullA"), pb=el("pullB"); if(pa)pa.innerHTML=top(A); if(pb)pb.innerHTML=top(B);
  } else {
    const box=el("trackBox"); if(!box)return;
    const ids=Object.keys(PLAYERS).sort((a,b)=>(PLAYERS[b].pos||0)-(PLAYERS[a].pos||0));
    box.innerHTML = ids.length ? ids.map(id=>{ const p=PLAYERS[id];
      const pct = clamp((p.pos||0)/META.target,0,1);
      const left = 6 + pct*84;
      return `<div class="lane ${p.finished?'done':''}"><div class="finish"></div>
        <div class="runner" style="left:${left}%"><span class="av">${avatarHTML(p.avatar,p.color,30)}</span><span class="nm">${esc(p.name)}</span></div></div>`;
    }).join("") : `<div class="note">Nog geen spelers…</div>`;
  }
}

function showResultHost(){
  cleanup();
  const winner=STATE.winner;
  let title, medal, podium="";
  if(META.game==="snelvuur"){
    const w=PLAYERS[winner];
    title = w?`${esc(w.name)} wint met ${w.correct||0} goede antwoorden!`:"Wedstrijd gestopt";
    medal = medalSVG("crown",120);
    const order=Object.values(PLAYERS).sort((a,b)=>(b.correct||0)-(a.correct||0));
    podium=`<div class="podium">${order.slice(0,6).map((p,i)=>`<div class="podline"><span class="rk">${i+1}</span><span class="av">${avatarHTML(p.avatar,p.color,32)}</span><span class="nm">${esc(p.name)}</span><span class="sc">${p.correct||0} goed</span></div>`).join("")}</div>`;
  } else if(META.game==="touwtrekken"){
    const team = winner==="A"?"Rubri (Rood)":winner==="B"?"Caerulei (Blauw)":null;
    title = team?`${team} wint!`:"Wedstrijd gestopt";
    medal = medalSVG("laurel",120);
    const top=Object.values(PLAYERS).sort((a,b)=>(b.correct||0)-(a.correct||0)).slice(0,6);
    podium = `<div class="podium">${top.map((p,i)=>`<div class="podline"><span class="rk">${i+1}</span><span class="av">${avatarHTML(p.avatar,p.color,32)}</span><span class="nm">${esc(p.name)} <small style="color:var(--muted)">${p.team==='A'?'Rood':'Blauw'}</small></span><span class="sc">${p.correct||0} goed</span></div>`).join("")}</div>`;
  } else {
    const w=PLAYERS[winner];
    title = w?`${esc(w.name)} wint de marathon!`:"Wedstrijd gestopt";
    medal = medalSVG("crown",120);
    const order=Object.values(PLAYERS).sort((a,b)=> (b.finished?1:0)-(a.finished?1:0) || (b.pos||0)-(a.pos||0));
    podium = `<div class="podium">${order.slice(0,6).map((p,i)=>`<div class="podline"><span class="rk">${i+1}</span><span class="av">${avatarHTML(p.avatar,p.color,32)}</span><span class="nm">${esc(p.name)}</span><span class="sc">${p.finished?"finish":(p.pos||0)+"/"+META.target}</span></div>`).join("")}</div>`;
  }
  beep("win");
  const ov=el("overlay");
  ov.innerHTML=`<div class="modal"><div class="big">${medal}</div><h2>${title}</h2>${podium}
    <div class="btnrow" style="flex-direction:column;margin-top:8px">
      <button class="btn btn-gold btn-block" onclick="closeOverlay();rematch()">Opnieuw met dezelfde spelers</button>
      <button class="btn btn-ghost btn-block" onclick="closeOverlay();leaveAll();go('home')">Naar startscherm</button>
    </div></div>`;
  ov.classList.add("show");
}
function rematch(){ _ending=false; Net.setState(CODE,{status:"lobby",ropePos:0,winner:null}); go("hostLobby"); }

/* ============================================================================
   LEERLING-KANT
   ============================================================================ */
SCREENS.join = function(){
  document.body.classList.remove("greek");
  const pre = new URLSearchParams(location.search).get("room")||"";
  H(brand(true)+`<div class="scrhead"><button class="back" onclick="go('home')">${iconSVG("shield",20,"currentColor")}</button><h2>Meedoen</h2></div>
  <div class="panel">
    <label class="fld">Speelcode (van het bord)</label>
    <input type="text" id="joinCode" maxlength="4" placeholder="ABCD" value="${esc(pre)}" style="text-transform:uppercase;letter-spacing:.25em;font-size:24px;text-align:center" oninput="this.value=this.value.toUpperCase()">
    <label class="fld" style="margin-top:14px">Jouw naam</label>
    <input type="text" id="joinName" maxlength="16" placeholder="bv. ${esc(P.name||"Sofia")}" value="${esc(P.name)}">
  </div>
  <div class="panel">
    <label class="fld">Kleur</label>
    <div class="chips" id="colorPick">${COLORS.map(c=>`<button class="chip" style="padding:6px" onclick="setColor('${c}')"><span style="width:26px;height:26px;border-radius:50%;display:inline-block;background:${c};${P.color===c?'box-shadow:0 0 0 2px var(--hi-bright)':''}"></span></button>`).join("")}</div>
    <label class="fld" style="margin-top:14px">Avatar <small style="text-transform:none">(meer in je verzameling)</small></label>
    <div class="chips" id="avPick">${P.owned.map(id=>{const a=AVATARS.find(x=>x.id===id);return a?`<button class="chip ${P.avatar===id?'on':''}" onclick="setAvatar('${id}')">${avatarHTML(id,P.color,26)}</button>`:""}).join("")}</div>
  </div>
  <button class="btn btn-gold btn-block lg" onclick="doJoin()">Doe mee</button>
  ${foot()}`);
};
function setColor(c){ P.color=c; saveProfile(); SCREENS.join(); }
function setAvatar(id){ P.avatar=id; saveProfile(); SCREENS.join(); }

async function doJoin(){
  const c=(el("joinCode").value||"").trim().toUpperCase();
  const nm=(el("joinName").value||"").trim();
  if(c.length!==4){ toast("Code klopt niet","Voer de 4-letter code van het bord in."); return; }
  if(!nm){ toast("Naam ontbreekt","Vul je naam in."); return; }
  P.name=nm; saveProfile();
  chooseNet();
  if(Net===DemoNet){ toast("Geen verbinding","Deze code werkt alleen met Firebase. Vraag je docent of dit is ingesteld."); return; }
  const ex=await Net.exists(c);
  if(!ex){ toast("Niet gevonden","Geen wedstrijd met code "+c+". Controleer de code."); return; }
  CODE=c; ROLE="player";
  META = await Net.getMeta(CODE);
  POOL = await Net.getPool(CODE);
  const team = await assignTeam();
  PID = Net.addPlayer(CODE, { name:nm, color:P.color, avatar:P.avatar, isBot:false, online:true,
    team, pos:0, correct:0, wrong:0, finished:false, frozenUntil:0 });
  go("playerLobby");
}
async function assignTeam(){
  if(META.game!=="touwtrekken") return "A";
  return new Promise(res=>{
    const off=Net.onPlayers(CODE, ps=>{ off();
      let a=0,b=0; Object.values(ps||{}).forEach(p=>{ if(p.team==="A")a++; else if(p.team==="B")b++; });
      res(a<=b?"A":"B");
    });
  });
}

SCREENS.playerLobby = function(){
  const greek=META.game==="marathon";
  document.body.classList.toggle("greek",greek);
  H(brand(false)+`<div class="scrhead"><button class="back" onclick="leaveAll();go('home')">${iconSVG("shield",20,"currentColor")}</button><h2>${META.game==="snelvuur"?"Snelvuur":greek?"Marathon":"Touwtrekken"}</h2></div>
  <div class="codecard"><div class="lbl">Je doet mee als</div><div style="display:flex;align-items:center;justify-content:center;gap:10px;margin-top:8px">${avatarHTML(P.avatar,P.color,44)}<span style="font-size:24px">${esc(P.name)}</span></div>
  ${META.game==="touwtrekken"?`<div style="margin-top:10px" class="pill" id="teamPill">Team —</div>`:""}</div>
  <div class="panel"><div class="note" style="text-align:center">Wachten tot de docent start… <span id="lobbyN"></span></div></div>
  ${foot()}`);
  unsubPlayers = Net.onPlayers(CODE, ps=>{ PLAYERS=ps||{};
    const n=el("lobbyN"); if(n)n.textContent="("+Object.keys(PLAYERS).length+" spelers)";
    const me=PLAYERS[PID]; const tp=el("teamPill");
    if(tp&&me)tp.textContent="Team "+(me.team==="A"?"Rood":"Blauw");
  });
  unsubState = Net.onState(CODE, s=>{ STATE=s||{}; if(STATE.status==="playing"){ go("playerGame"); } else if(STATE.status==="finished"){ go("result"); } });
};

/* ---- LEERLING: spelen ---- */
let curQ=null, answered=false;
SCREENS.playerGame = function(){
  myStreak=0; answered=false;
  unsubState = Net.onState(CODE, s=>{ STATE=s||{}; if(STATE.status==="finished")go("result"); else updatePlayerMini(); });
  unsubPlayers = Net.onPlayers(CODE, ps=>{ PLAYERS=ps||{}; updatePlayerMini(); });
  drawQuestion();
  if(META.game==="snelvuur"){
    if(freezeTimer)clearInterval(freezeTimer);
    freezeTimer=setInterval(()=>{ updatePlayerMini(); },1000);
  }
};
function myPlayer(){ return PLAYERS[PID]||{pos:0,team:"A"}; }
function miniHTML(){
  if(META.game==="snelvuur"){
    const me=myPlayer();
    const left=STATE.deadline?Math.max(0,Math.ceil((STATE.deadline-Date.now())/1000)):0;
    const pct=META.target?Math.round(left/META.target*100):100;
    return `<div class="ministat">
      <span style="font-weight:700">Score: ${me.correct||0}</span>
      <div class="seg"><i style="left:0;width:${pct}%;background:linear-gradient(90deg,var(--hi-dim),var(--hi))"></i></div>
      <span style="font-weight:700;color:${left<=10?"#e05555":"var(--hi)"}">${left}s</span></div>
      <div class="note" style="text-align:center;margin-top:-6px;margin-bottom:10px">Zo snel mogelijk goede antwoorden geven!</div>`;
  }
  if(META.game==="touwtrekken"){
    const rp=clamp(STATE.ropePos||0,-META.target,META.target);
    const me=myPlayer(); const mine = me.team==="A"?-1:1;
    const lead = mine*rp; // positief = jouw team voor
    const pct = 50 + (rp/META.target)*50;
    return `<div class="ministat"><span style="color:var(--teamA);font-weight:700">Rood</span>
      <div class="seg"><i style="left:0;width:${pct}%;background:linear-gradient(90deg,var(--teamA),var(--teamA))"></i></div>
      <span style="color:var(--teamB);font-weight:700">Blauw</span></div>
      <div class="note" style="text-align:center;margin-top:-6px;margin-bottom:10px">${lead>0?"Jouw team ligt voor (+"+lead+")":lead<0?"Jouw team ligt achter ("+lead+")":"Gelijkspel"}</div>`;
  } else {
    const me=myPlayer(); const pct=clamp((me.pos||0)/META.target,0,1)*100;
    return `<div class="ministat"><span style="font-weight:700">Start</span>
      <div class="seg"><i style="left:0;width:${pct}%;background:linear-gradient(90deg,var(--hi-dim),var(--hi))"></i></div>
      <span style="font-weight:700">${iconSVG("column",18,"var(--hi)")}</span></div>
      <div class="note" style="text-align:center;margin-top:-6px;margin-bottom:10px">Afstand: ${me.pos||0} / ${META.target}</div>`;
  }
}
function updatePlayerMini(){ const m=el("mini"); if(m)m.innerHTML=miniHTML(); }
function drawQuestion(){
  const me=myPlayer();
  if(me.frozenUntil && nowMs()<me.frozenUntil){ return drawFrozen(me.frozenUntil); }
  answered=false;
  curQ = makeQuestion(POOL);
  H(brand(false)+`<div id="mini">${miniHTML()}</div>
    <div class="qcard"><div class="kick">${META.lang==="el"?"Grieks":"Latijn"} → Nederlands</div>
      <div class="word">${esc(curQ.la)}</div>${curQ.pos?`<div class="pos">${esc(curQ.pos)}</div>`:""}</div>
    <div class="choices" id="choices">${curQ.options.map((o,i)=>`<button class="choice" onclick="answer(${i})"><span class="n">${i+1}</span><span>${esc(o)}</span></button>`).join("")}</div>`);
}
function drawFrozen(until){
  H(brand(false)+`<div id="mini">${miniHTML()}</div>
    <div class="frozen"><div style="font-size:40px;margin-bottom:6px">${iconSVG("torch",40,"var(--teamB)")}</div>
    Even stilstaan…<div style="font-size:34px;font-weight:800;margin-top:6px" id="freezeN">${Math.ceil((until-nowMs())/1000)}</div></div>`);
  if(freezeTimer)clearInterval(freezeTimer);
  freezeTimer=setInterval(()=>{
    const left=Math.ceil((until-nowMs())/1000);
    const n=el("freezeN"); if(n)n.textContent=Math.max(0,left);
    if(left<=0){ clearInterval(freezeTimer); freezeTimer=null; if(STATE.status==="playing")drawQuestion(); }
  },250);
}
function answer(i){
  if(answered)return; answered=true;
  const ok = i===curQ.correctIdx;
  const me=myPlayer();
  // visuele feedback
  document.querySelectorAll("#choices .choice").forEach((b,k)=>{
    if(k===curQ.correctIdx)b.classList.add("correct");
    else if(k===i)b.classList.add("wrong"); else b.classList.add("dim");
    b.onclick=null;
  });
  // stats + munten
  P.played = P.played; // no-op
  if(ok){ myStreak++; P.correct++; if(myStreak>P.bestStreak)P.bestStreak=myStreak; addCoins(2); beep("good"); }
  else { myStreak=0; beep("bad"); }
  saveProfile();
  applyAnswer(PID, me, ok);
  const delay=META.game==="snelvuur"?600:(ok?520:900);
  setTimeout(()=>{ if(STATE.status==="playing")drawQuestion(); }, delay);
}

/* ---- resultaat (leerling) ---- */
SCREENS.result = function(){
  cleanup();
  const me=PLAYERS[PID]||{};
  let won=false, line="";
  if(META.game==="touwtrekken"){
    won = STATE.winner===me.team;
    line = STATE.winner==="A"?"Rood wint!":STATE.winner==="B"?"Blauw wint!":"Wedstrijd gestopt";
  } else if(META.game==="snelvuur"){
    won = STATE.winner===PID;
    const w=PLAYERS[STATE.winner];
    line = w?(won?`Jij wint met ${me.correct||0} goede antwoorden!`:`${esc(w.name)} wint (${w.correct||0} goed)`):"Wedstrijd gestopt";
  } else {
    won = STATE.winner===PID;
    const w=PLAYERS[STATE.winner];
    line = w?(won?"Jij wint!":esc(w.name)+" wint"):"Wedstrijd gestopt";
  }
  // tel resultaat 1x
  if(!STATE._counted_for_me){ STATE._counted_for_me=true;
    P.played++; P.gamesPlayed[META.game]=true; if(won){P.wins++; addCoins(15);} addCoins((me.correct||0)*1); saveProfile(); checkAch();
  }
  const medal = won?medalSVG("laurel",120):iconSVG("shield",110,"var(--muted)");
  beep(won?"win":"good");
  H(brand(true)+`<div class="screen" style="text-align:center;padding-top:20px">
    <div style="width:120px;margin:0 auto 10px">${medal}</div>
    <h2 style="color:var(--hi-bright);font-size:26px">${line}</h2>
    <div class="note" style="margin:6px 0 18px">Je had <b>${me.correct||0}</b> goed${won?" en je wint 15 munten!":""}.</div>
    <div class="panel" style="text-align:left">
      <div style="display:flex;justify-content:space-between"><span>Munten</span><b>${P.coins}</b></div>
      <div style="display:flex;justify-content:space-between;margin-top:6px"><span>Gewonnen totaal</span><b>${P.wins}</b></div>
      <div style="display:flex;justify-content:space-between;margin-top:6px"><span>Goed totaal</span><b>${P.correct}</b></div>
    </div>
    <button class="btn btn-gold btn-block lg" onclick="backToLobbyPlayer()">Wachten op volgende ronde</button>
    <button class="btn btn-ghost btn-block" style="margin-top:10px" onclick="leaveAll();go('collection')">Mijn verzameling</button>
  </div>${foot()}`);
};
function backToLobbyPlayer(){
  // terug naar lobby en wachten op rematch
  unsubState = Net.onState(CODE, s=>{ STATE=s||{}; if(STATE.status==="playing")go("playerGame"); else if(STATE.status==="lobby")go("playerLobby"); });
}

/* ============================================================================
   VERZAMELING (avatars, eerbewijzen)
   ============================================================================ */
SCREENS.collection = function(){
  document.body.classList.remove("greek");
  H(brand(true)+`<div class="scrhead"><button class="back" onclick="go('home')">${iconSVG("shield",20,"currentColor")}</button><h2>Mijn verzameling</h2></div>
  <div class="panel">
    <div style="display:flex;justify-content:space-between;align-items:center">
      <div><div class="note">Munten</div><div style="font-size:28px;color:var(--hi-bright);font-weight:800">${P.coins}</div></div>
      <div style="text-align:right"><div class="note">Gewonnen · Goed</div><div style="font-size:20px">${P.wins} · ${P.correct}</div></div>
    </div>
  </div>
  <div class="eyebrow l">Avatars</div>
  <div class="collgrid">${AVATARS.map(a=>{
    const owned=P.owned.includes(a.id), on=P.avatar===a.id;
    return `<button class="coll ${owned?'':'locked'} ${on?'on':''}" onclick="buyOrEquip('${a.id}')">
      <div class="av">${avatarHTML(a.id,P.color,54)}</div><div class="nm">${a.nm}</div>
      ${owned?(on?`<div class="pr">in gebruik</div>`:`<div class="pr">kies</div>`):`<div class="pr">${a.cost} munten</div>`}
    </button>`;
  }).join("")}</div>
  <div class="eyebrow l" style="margin-top:20px">Eerbewijzen</div>
  ${ACHS.map(a=>{ const got=P.achievements.includes(a.id);
    return `<div class="ach ${got?'':'locked'}"><span class="m">${medalSVG(a.icon,46)}</span>
      <div><div class="nm">${a.nm}</div><div class="ds">${a.ds}</div></div></div>`;
  }).join("")}
  ${foot()}`);
};
function buyOrEquip(id){
  const a=AVATARS.find(x=>x.id===id); if(!a)return;
  if(P.owned.includes(id)){ P.avatar=id; saveProfile(); SCREENS.collection(); return; }
  if(P.coins< a.cost){ toast("Niet genoeg munten","Win wedstrijden om munten te verdienen."); return; }
  P.coins-=a.cost; P.owned.push(id); P.avatar=id; saveProfile(); checkAch(); beep("ach");
  toast("Gekocht!", a.nm); SCREENS.collection();
}