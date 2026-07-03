/* ---- HOME ---- */
SCREENS.home = function(){
  document.body.classList.remove("greek");
  H(brand(true)+`
  <div class="eyebrow l">Kies wat je wilt doen</div>
  <button class="tile tile-primary" onclick="go('join')">
    <span class="ic">${iconSVG("shield",44,"currentColor")}</span>
    <h3>Meedoen</h3>
    <p>Voor leerlingen. Voer de code in die op het bord staat, of doe mee aan Battle Mode.</p>
  </button>
  <button class="tile" onclick="go('battleHome')">
    <span class="ic">${iconSVG("eagle",44,"currentColor")}</span>
    <h3>⚔️ Battle Mode <span style="font-size:11px;background:var(--ox);color:#fff;border-radius:4px;padding:2px 5px;vertical-align:middle;margin-left:4px">BETA</span></h3>
    <p>Twee teams strijden om woordkennis. Verdien Battle Energy met goede antwoorden.</p>
  </button>
  <button class="tile" onclick="bmStartBossHost()">
    <span class="corner">${iconSVG("torch",88,"currentColor")}</span>
    <span class="ic">${iconSVG("torch",44,"currentColor")}</span>
    <h3>🐉 Boss Battle <span style="font-size:11px;background:var(--ox);color:#fff;border-radius:4px;padding:2px 5px;vertical-align:middle;margin-left:4px">BETA</span></h3>
    <p>De hele klas vecht samen tegen één mythologische baas. Ook ideaal om in je eentje te trainen.</p>
  </button>
  <button class="tile" onclick="go('totalWar')">
    <span class="corner">${iconSVG("crown",88,"currentColor")}</span>
    <span class="ic">${iconSVG("crown",44,"currentColor")}</span>
    <h3>🗺️ Total War <span style="font-size:11px;background:var(--stone4);color:var(--hi-bright);border:1px solid var(--hi-dim);border-radius:4px;padding:2px 6px;vertical-align:middle;margin-left:4px">BINNENKORT</span></h3>
    <p>Doorlopende veldtocht: elke klas is een beschaving en verovert samen de kaart van Europa. Nog in ontwerp — docenten kunnen het voorbeeld bekijken.</p>
  </button>
  <button class="tile" onclick="startHost()">
    <span class="corner">${iconSVG("column",88,"currentColor")}</span>
    <span class="ic">${iconSVG("helmet",44,"currentColor")}</span>
    <h3>Andere spellen</h3>
    <p>Voor docenten. Touwtrekken, Marathon of Snelvuur starten en projecteer de code op het bord.</p>
  </button>
  <button class="tile" onclick="go('collection')">
    <span class="ic">${iconSVG("amphora",44,"currentColor")}</span>
    <h3>Mijn profiel</h3>
    <p>Rang, XP, eerbewijzen, munten en avatars die je hebt verdiend.</p>
  </button>
  <button class="tile tile-compact" onclick="go('teacherLogin')">
    <span class="ic">${iconSVG("column",44,"currentColor")}</span>
    <h3>Docentenportaal</h3>
    <p>Klassen beheren, leerlingen verplaatsen en resultaten bekijken.</p>
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
  <button class="btn btn-gold btn-block lg" onclick="doJoin()">Doe mee aan klassiek spel</button>
  <div style="display:flex;align-items:center;gap:10px;margin:14px 0 4px">
    <hr style="flex:1;border:none;border-top:1px solid var(--stone3)">
    <span class="note">of</span>
    <hr style="flex:1;border:none;border-top:1px solid var(--stone3)">
  </div>
  <button class="btn btn-block" style="border:1px solid var(--ox);color:var(--ox)" onclick="go('battleJoin')">⚔️ Doe mee aan Battle Mode</button>
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
  if(ok){ myStreak++; P.stats.totalCorrect++; P.stats.currentStreak++;
    if(P.stats.currentStreak>P.stats.bestStreak)P.stats.bestStreak=P.stats.currentStreak;
    addCoins(2); beep("good"); }
  else { myStreak=0; P.stats.currentStreak=0; P.stats.totalWrong++; beep("bad"); }
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
    const _g=META.game, _c=me.correct||0, _w=me.wrong||0;
    if(_g==="touwtrekken"){ P.stats.tournamentsPlayed++; if(won)P.stats.tournamentsWon++; }
    else if(_g==="marathon"){ P.stats.marathonsPlayed++; if(won)P.stats.marathonsWon++; }
    else if(_g==="snelvuur"){ P.stats.snelvuurPlayed++; if(won)P.stats.snelvuurWon++; }
    const _xp=_c*2+5+(won?10:0);
    addXP(_xp); addCoins(_c+(won?15:0));
    saveProfile();
    const _tot=_c+_w, _allWon=P.stats.tournamentsWon+P.stats.marathonsWon+P.stats.snelvuurWon+P.stats.battlesWon;
    checkAch({mode:_g, won, isFirst:won&&_g==="snelvuur", accurate:_tot>0?_c/_tot:0});
  }
  const medal = won?medalSVG("laurel",120):iconSVG("shield",110,"var(--muted)");
  beep(won?"win":"good");
  const _lv=calcLevel(P.xp), _xpFill=Math.round(_lv.progress*100);
  H(brand(true)+`<div class="screen" style="text-align:center;padding-top:20px">
    <div style="width:120px;margin:0 auto 10px">${medal}</div>
    <h2 style="color:var(--hi-bright);font-size:26px">${line}</h2>
    <div class="note" style="margin:6px 0 18px">Je had <b>${me.correct||0}</b> goed${won?" en je wint 15 munten!":""}.</div>
    <div class="panel" style="text-align:left">
      <div style="display:flex;justify-content:space-between"><span>Munten</span><b>${P.coins}</b></div>
      <div style="display:flex;justify-content:space-between;margin-top:6px"><span>Rang</span><b>${P.rank} (niv.${P.level})</b></div>
      <div style="margin-top:8px;height:8px;background:var(--stone3);border-radius:4px;overflow:hidden">
        <div style="height:100%;width:${_xpFill}%;background:var(--hi);border-radius:4px;transition:width .6s"></div></div>
      <div style="display:flex;justify-content:space-between;margin-top:4px"><span>Totaal goed</span><b>${P.stats.totalCorrect}</b></div>
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
   MIJN PROFIEL (rang, XP, statistieken, Battle Mode, avatars, eerbewijzen)
   ============================================================================ */
SCREENS.collection = function(){
  document.body.classList.remove("greek");
  const s=P.stats, lv=calcLevel(P.xp), fill=Math.round(lv.progress*100);
  const allP=s.tournamentsPlayed+s.marathonsPlayed+s.snelvuurPlayed+s.battlesPlayed;
  const allW=s.tournamentsWon+s.marathonsWon+s.snelvuurWon+s.battlesWon;
  const xpNext=lv.next?lv.next.xp:lv.xp;
  function statsRow(l,v){ return `<div style="display:flex;justify-content:space-between;margin-top:4px"><span class="note">${l}</span><b>${v}</b></div>`; }

  // ---- Battle Mode sectie (uit lokale cache) ----
  const bmIdent = typeof bmIdentLoad==="function" ? bmIdentLoad() : null;
  let bmSection = "";
  if(bmIdent){
    const bmXp=bmIdent.xp||0, bmLv=bmCalcLevel(bmXp), bmFill=Math.round(bmLv.progress*100);
    const bmAv=bmAvatarMerge(bmIdent.avatar);
    const bmAchs=bmIdent.achievements||[];
    const masteryGrid=BM_CLASSES.map(c=>{
      const ms=bmCalcMastery(bmIdent.classHistory?.[c.id]);
      return `<div style="background:${c.color}18;border:1px solid ${c.color}44;border-radius:10px;padding:8px 4px;text-align:center">
        ${iconSVG(c.icon,20,c.color)}
        <div style="font-size:9px;color:var(--muted);margin:2px 0">${esc(c.nm)}</div>
        <div style="line-height:1;font-size:13px">${bmStars(ms)}</div>
      </div>`;
    }).join("");
    const bmAchRows=ACHIEVEMENTS_DEF.filter(a=>a.mode==="battle"||["eerste_gevecht","overwinnaar","scholar","onbreekbaar","strateeg","commandant","combokunstenaar","legendarisch"].includes(a.id)).map(a=>{
      const got=bmAchs.includes(a.id)||P.achievements.includes(a.id);
      if(a.secret&&!got) return `<div class="ach locked"><span class="m" style="filter:grayscale(1) opacity(.3)">${medalSVG("star",40)}</span><div><div class="nm">???</div><div class="ds">Geheim eerbewijs</div></div></div>`;
      return `<div class="ach ${got?"":"locked"}"><span class="m">${medalSVG(a.icon,40)}</span><div><div class="nm">${a.nm}</div><div class="ds">${a.ds}</div></div></div>`;
    }).join("");
    bmSection=`
    <div class="eyebrow l" style="margin-top:20px">⚔️ Battle Mode</div>
    <div class="panel">
      <div style="display:flex;gap:14px;align-items:center;margin-bottom:12px">
        <div style="flex:0 0 auto">${bmAvatarSVG(bmAv,64)}</div>
        <div style="flex:1;min-width:0">
          <div style="font-size:18px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(bmIdent.name||"")}</div>
          <div class="note">${esc(bmIdent.klascode||"")} · ${esc(bmIdent.leerlingcode||"")}</div>
          <div class="pill" style="margin:4px 0 0">${esc(bmLv.title||bmLv.rank)} · niveau ${bmLv.level}</div>
        </div>
      </div>
      <div style="height:8px;background:var(--stone3);border-radius:4px;overflow:hidden">
        <div style="height:100%;width:${bmFill}%;background:var(--ox);border-radius:4px;transition:width .6s"></div></div>
      <div style="display:flex;justify-content:space-between;margin-top:3px">
        <span class="note">${bmXp} XP</span>
        <span class="note">${bmLv.next?"→ "+bmLv.next.xp+" XP voor "+(bmLv.next.title||bmLv.next.rank):"Max niveau bereikt"}</span></div>
      ${statsRow("Gevechten gespeeld",bmIdent.battles||0)}
      <button class="btn btn-ghost btn-block" style="margin-top:10px;font-size:13px" onclick="BM_AV_RETURN='collection';go('battleAvatarEdit')">Avatar aanpassen</button>
    </div>
    <div class="eyebrow l">Klasbeheersing</div>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:4px">${masteryGrid}</div>
    <div class="eyebrow l" style="margin-top:16px">Battle eerbewijzen</div>
    <div class="achgrid">${bmAchRows}</div>`;
  } else {
    bmSection=`<div class="eyebrow l" style="margin-top:20px">⚔️ Battle Mode</div>
    <div class="panel"><div class="note">Je hebt nog geen Battle Mode-profiel. Doe mee via het hoofdmenu om je avatar en klasse-mastery op te bouwen.</div>
    <button class="btn btn-ghost btn-block" style="margin-top:8px;font-size:13px" onclick="go('battleJoin')">Doe mee aan Battle Mode</button></div>`;
  }

  // ---- Algemene eerbewijzen (niet battle-specifiek) ----
  const generalAchHTML=ACHIEVEMENTS_DEF.filter(a=>a.mode!=="battle"&&!["eerste_gevecht","overwinnaar","scholar","onbreekbaar","strateeg","commandant","combokunstenaar","legendarisch"].some(id=>id===a.id)).map(a=>{
    const got=P.achievements.includes(a.id);
    if(a.secret&&!got) return `<div class="ach locked"><span class="m" style="filter:grayscale(1) opacity(.3)">${medalSVG("star",46)}</span><div><div class="nm">???</div><div class="ds">Geheim eerbewijs</div></div></div>`;
    return `<div class="ach ${got?"":"locked"}"><span class="m">${medalSVG(a.icon,46)}</span><div><div class="nm">${a.nm}</div><div class="ds">${a.ds}</div></div></div>`;
  }).join("");

  H(brand(true)+`<div class="scrhead"><button class="back" onclick="go('home')">${iconSVG("shield",20,"currentColor")}</button><h2>Mijn profiel</h2></div>
  <div class="panel">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
      <div><div class="note">Rang</div><div style="font-size:22px;color:var(--hi-bright);font-weight:800">${P.rank}</div>
        <div class="note">Niveau ${lv.level}</div></div>
      <div style="text-align:right"><div class="note">Munten</div>
        <div style="font-size:22px;color:var(--hi-bright);font-weight:800">${P.coins}</div></div>
    </div>
    <div style="height:10px;background:var(--stone3);border-radius:5px;overflow:hidden">
      <div style="height:100%;width:${fill}%;background:var(--hi);border-radius:5px;transition:width .6s"></div></div>
    <div style="display:flex;justify-content:space-between;margin-top:3px">
      <span class="note">${P.xp} XP</span>
      <span class="note">${lv.next?"→ "+xpNext+" XP voor "+lv.next.rank:"Max niveau bereikt"}</span></div>
  </div>
  ${syncStatusHTML(bmIdent)}
  <details style="margin:0 0 4px"><summary class="eyebrow l" style="cursor:pointer">Statistieken per modus</summary>
  <div class="panel" style="margin-top:0">
    <div class="note" style="font-weight:700;margin-bottom:4px">Totaal</div>
    ${statsRow("Goed beantwoord",s.totalCorrect)}
    ${statsRow("Langste serie",s.bestStreak)}
    ${statsRow("Spellen gespeeld",allP)}
    ${statsRow("Gewonnen",allW)}
    <div class="note" style="font-weight:700;margin:10px 0 4px">Touwtrekken</div>
    ${statsRow("Gespeeld",s.tournamentsPlayed)} ${statsRow("Gewonnen",s.tournamentsWon)}
    <div class="note" style="font-weight:700;margin:10px 0 4px">Marathon</div>
    ${statsRow("Gespeeld",s.marathonsPlayed)} ${statsRow("Gewonnen",s.marathonsWon)}
    <div class="note" style="font-weight:700;margin:10px 0 4px">Snelvuur</div>
    ${statsRow("Gespeeld",s.snelvuurPlayed)} ${statsRow("1e plek",s.snelvuurWon)}
    <div class="note" style="font-weight:700;margin:10px 0 4px">Battle Mode</div>
    ${statsRow("Gespeeld",s.battlesPlayed)} ${statsRow("Gewonnen",s.battlesWon)}
    ${statsRow("Schade gegeven",s.totalDamage)} ${statsRow("Genezen",s.totalHealing)}
  </div></details>
  ${bmSection}
  <div class="eyebrow l" style="margin-top:20px">Avatars (klassieke spellen)</div>
  <div class="collgrid">${AVATARS.map(a=>{
    const owned=P.owned.includes(a.id), on=P.avatar===a.id;
    return `<button class="coll ${owned?'':'locked'} ${on?'on':''}" onclick="buyOrEquip('${a.id}')">
      <div class="av">${avatarHTML(a.id,P.color,54)}</div><div class="nm">${a.nm}</div>
      ${owned?(on?`<div class="pr">in gebruik</div>`:`<div class="pr">kies</div>`):`<div class="pr">${a.cost} munten</div>`}
    </button>`;
  }).join("")}</div>
  <div class="eyebrow l" style="margin-top:20px">Eerbewijzen</div>
  <div class="achgrid">${generalAchHTML}</div>
  ${foot()}`);
  // Ververs Battle Mode-gegevens uit Firebase en herrender als er nieuwere data is
  if(typeof bmRefreshIdentCache==="function" && bmIdent){
    bmRefreshIdentCache().then(()=>{
      const fresh = typeof bmIdentLoad==="function" ? bmIdentLoad() : null;
      if(fresh && JSON.stringify(fresh)!==JSON.stringify(bmIdent)) SCREENS.collection();
    });
  }
  // Ververs de algemene XP (P.xp) vanuit dezelfde gedeelde identiteit, zodat
  // dit toestel altijd bijwerkt als er elders (ander toestel) is gespeeld.
  if(typeof syncProfileFromCloud==="function") syncProfileFromCloud("collection");
};

/* ---- "Koppel dit toestel": algemeen profiel (buiten Battle Mode) delen via
   dezelfde klascode+leerlingcode-identiteit, zodat XP overal gelijk blijft.
   Geen verplichting: zonder koppeling werkt alles gewoon lokaal, zoals voorheen. ---- */
let _gpLinkOpen=false;
function syncStatusHTML(bmIdent){
  if(bmIdent){
    return `<div class="note" style="text-align:center;margin:6px 0 2px">
      🔗 Gekoppeld aan <b>${esc(bmIdent.klascode)}</b> · <b>${esc(bmIdent.leerlingcode)}</b> — je XP loopt gelijk op al je toestellen.</div>`;
  }
  if(!_gpLinkOpen){
    return `<div class="panel" style="text-align:center;padding:12px 16px">
      <div class="note" style="margin-bottom:8px">Je voortgang staat nu alleen lokaal op dit toestel. Koppel een klascode + leerlingcode om je XP op al je toestellen gelijk te houden.</div>
      <button class="btn btn-ghost" style="font-size:13px" onclick="_gpLinkOpen=true;SCREENS.collection()">Koppel dit toestel</button>
    </div>`;
  }
  return `<div class="panel">
    <label class="fld">Klascode (van de docent)</label>
    <input id="gpKlas" type="text" placeholder="bv. LATIJN3B" style="text-transform:uppercase" oninput="this.value=this.value.toUpperCase()">
    <label class="fld" style="margin-top:12px">Leerlingcode (zelf gekozen)</label>
    <input id="gpLcode" type="text" placeholder="bv. marcus42">
    <label class="fld" style="margin-top:12px">Weergavenaam</label>
    <input id="gpNaam" type="text" placeholder="bv. Marcus">
    <div id="gpLinkErr" class="note warn" style="display:none;margin-top:8px"></div>
    <div class="btnrow" style="margin-top:12px">
      <button class="btn btn-gold" onclick="gpLinkProfile()">Koppelen</button>
      <button class="btn btn-ghost" onclick="_gpLinkOpen=false;SCREENS.collection()">Annuleer</button>
    </div>
  </div>`;
}
async function gpLinkProfile(){
  if(typeof bmIdentDoLogin!=="function")return;
  const klas=el("gpKlas")?.value, lcode=el("gpLcode")?.value, name=el("gpNaam")?.value;
  const err=el("gpLinkErr");
  if(err)err.style.display="none";
  const r=await bmIdentDoLogin(klas,lcode,name);
  if(!r.ok){ if(err){err.textContent=r.error;err.style.display="";} return; }
  _gpLinkOpen=false;
  toast("Gekoppeld!","Je XP loopt nu gelijk op al je toestellen.");
  SCREENS.collection();
}

function buyOrEquip(id){
  const a=AVATARS.find(x=>x.id===id); if(!a)return;
  if(P.owned.includes(id)){ P.avatar=id; saveProfile(); SCREENS.collection(); return; }
  if(P.coins< a.cost){ toast("Niet genoeg munten","Win wedstrijden om munten te verdienen."); return; }
  P.coins-=a.cost; P.owned.push(id); P.avatar=id; saveProfile(); checkAch(); beep("ach");
  toast("Gekocht!", a.nm); SCREENS.collection();
}


/* ============================================================
   DOCENTENPORTAAL — login · klasoverzicht · leerlingbeheer
   ============================================================ */

let _tpClasses = {};        // geladen klassendata
let _tpCurrentClass = null; // actief geselecteerde klas-ID
let _tpKlasCivs = {};        // Total War: klascode → civId (/totalwar/klasCivs)

// Kies de juiste netwerkimplementatie (Firebase of in-memory demo)
function teacherNet(){ return hasFirebase ? FBNet : DemoNet; }

/* ---- SCHERM: inloggen ---- */
SCREENS.teacherLogin = function(){
  const demo = !hasFirebase;
  H(brand(true)+`
  <div class="scrhead">
    <button class="back" onclick="go('home')">${iconSVG("shield",20,"currentColor")}</button>
    <h2>Docentenportaal</h2>
  </div>
  <div class="panel">
    ${demo?`<div class="note warn" style="margin-bottom:14px">Firebase niet ingesteld — <b>demo-modus</b>. Elk wachtwoord werkt.</div>`:""}
    <label class="fld">E-mailadres</label>
    <input type="email" id="tpEmail" placeholder="jouw@email.nl" autocomplete="email" style="width:100%;box-sizing:border-box">
    <label class="fld" style="margin-top:12px">Wachtwoord</label>
    <input type="password" id="tpPw" autocomplete="current-password" style="width:100%;box-sizing:border-box"
      onkeydown="if(event.key==='Enter')teacherDoLogin()">
    <button class="btn btn-gold btn-block lg" style="margin-top:16px" onclick="teacherDoLogin()">Inloggen</button>
  </div>
  ${foot()}`);
  setTimeout(()=>{ const e=el("tpEmail"); if(e)e.focus(); }, 120);
};

function teacherDoLogin(){
  const email=(el("tpEmail")?.value||"").trim();
  const pw=el("tpPw")?.value||"";
  if(!email){ toast("E-mailadres vereist","Vul een e-mailadres in."); return; }
  if(!pw){ toast("Wachtwoord vereist","Vul een wachtwoord in."); return; }
  teacherNet().loginTeacher(email,pw)
    .then(()=>go("teacherPortal"))
    .catch(e=>toast("Inloggen mislukt",typeof e==="string"?e:(e?.message||"Controleer je gegevens.")));
}

/* ---- SCHERM: klasoverzicht ---- */
SCREENS.teacherPortal = function(){
  if(!teacherNet().isTeacherLoggedIn()){ go("teacherLogin"); return; }
  H(brand(true)+`
  <div class="scrhead">
    <button class="back" onclick="go('home')">${iconSVG("shield",20,"currentColor")}</button>
    <h2>Docentenportaal</h2>
    <button class="chip" style="margin-left:auto" onclick="teacherLogout()">Uitloggen</button>
  </div>
  <div id="tpClassList"><div class="note" style="text-align:center;padding:20px">Klassen laden…</div></div>
  <button class="btn btn-gold btn-block" style="margin-top:10px" onclick="teacherAddClass()">+ Nieuwe klas</button>
  <button class="btn btn-ghost btn-block" style="margin-top:8px" onclick="go('totalWarPreview')">🗺️ Total War — veldtochtkaart</button>
  <div class="panel" style="margin-top:16px">
    <label class="fld">Battle Mode — klascodes</label>
    <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
      <input id="tpNewKlas" placeholder="Nieuwe code (bijv. LATIJN3B)" style="flex:1;min-width:140px;padding:8px 10px;background:var(--stone3);color:var(--cream);border:1px solid var(--stone4);border-radius:8px;font-size:14px;font-family:inherit;text-transform:uppercase"
        oninput="this.value=this.value.toUpperCase()" onkeydown="if(event.key==='Enter')tpCreateKlascode()">
      <button class="btn btn-gold" style="padding:8px 14px" onclick="tpCreateKlascode()">+ Aanmaken</button>
    </div>
    <div id="tpKlascodeList" style="margin-top:10px"><div class="note" style="padding:4px 0">Laden…</div></div>
  </div>
  <div class="panel" style="margin-top:16px">
    <label class="fld">Total War — klas ↔ beschaving</label>
    <div id="twKlasCivList" style="margin-top:6px"><div class="note" style="padding:4px 0">Laden…</div></div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:10px">
      <select id="tpTwKlas" style="flex:1;min-width:140px;padding:8px 10px;border-radius:8px;border:1px solid var(--stone4);background:var(--stone3);color:var(--cream);font-size:14px;font-family:inherit">
        <option value="">— kies een klas —</option>
      </select>
      <select id="tpTwCiv" style="padding:8px 10px;border-radius:8px;border:1px solid var(--stone4);background:var(--stone3);color:var(--cream);font-size:14px;font-family:inherit">
        ${Object.entries(TW_CIVS).filter(([id])=>id!=="neutral").map(([id,c])=>`<option value="${id}">${esc(c.nm)}</option>`).join("")}
      </select>
      <button class="btn btn-gold" style="padding:8px 14px" onclick="tpAssignKlasCiv()">Koppel</button>
    </div>
  </div>
  <div class="panel" style="margin-top:16px">
    <label class="fld">Battle Mode — accounts per klascode</label>
    <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
      <input id="tpBmKlas" placeholder="Klascode (bijv. TEST)" style="flex:1;min-width:120px;padding:8px 10px;background:var(--stone3);color:var(--cream);border:1px solid var(--stone4);border-radius:8px;font-size:14px;font-family:inherit"
        onkeydown="if(event.key==='Enter')tpLoadBmAccounts()">
      <button class="btn btn-gold" style="padding:8px 14px" onclick="tpLoadBmAccounts()">Zoek</button>
    </div>
    <div id="tpBmAccounts" style="margin-top:10px"></div>
    <div id="tpBmUnassigned" style="margin-top:6px"></div>
  </div>
  ${foot()}`);
  tpLoadClasses();
  tpLoadKlascodes();
  tpLoadKlasCivs();
};

/* ---- Total War: klas ↔ beschaving-koppeling (/totalwar/klasCivs, zie
   TOTAL_WAR.md §4/§7.1 — many-to-one t.o.v. de letterlijke docschema, want
   meerdere klascodes horen vaak bij dezelfde beschaving). ---- */
function tpLoadKlasCivs(){
  const cont=el("twKlasCivList"); if(!cont) return;
  if(!initFirebase()){ cont.innerHTML=`<div class="note">Vereist Firebase.</div>`; return; }
  fbDB.ref("totalwar/klasCivs").once("value")
    .then(snap=>{ _tpKlasCivs=snap.val()||{}; tpRenderKlasCivs(); })
    .catch(()=>{ cont.innerHTML=`<div class="note warn">Kon koppelingen niet laden.</div>`; });
}

function tpRenderKlasCivs(){
  const cont=el("twKlasCivList"); if(!cont) return;
  const entries=Object.entries(_tpKlasCivs||{});
  if(!entries.length){
    cont.innerHTML=`<div class="note" style="padding:4px 0">Nog geen klas aan een beschaving gekoppeld.</div>`;
    return;
  }
  const q=s=>"'"+String(s).replace(/\\/g,"\\\\").replace(/'/g,"\\'")+"'";
  cont.innerHTML=entries.map(([klas,civId])=>{
    const civ=TW_CIVS[civId]||TW_CIVS.neutral;
    return `<div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:0.5px solid var(--stone4)">
      <span style="flex:1"><b>${esc(klas)}</b> → ${esc(civ.nm)}</span>
      <button class="chip" style="color:#e07060;border-color:rgba(90,18,12,.4)" onclick="tpUnassignKlasCiv(${q(klas)})">Ontkoppel</button>
    </div>`;
  }).join("");
}

async function tpAssignKlasCiv(){
  const klas=(el("tpTwKlas")?.value||"").trim().toUpperCase();
  const civId=el("tpTwCiv")?.value;
  if(!klas){ toast("Klascode vereist","Vul een klascode in."); return; }
  if(!initFirebase()){ toast("Firebase vereist",""); return; }
  try{
    const exists=await FBNet.validateKlascode(klas);
    if(!exists){ toast("Onbekende klascode",klas+" bestaat niet in Battle Mode."); return; }
    await fbDB.ref("totalwar/klasCivs/"+klas).set(civId);
    if(el("tpTwKlas")) el("tpTwKlas").value="";
    toast("Gekoppeld",klas+" → "+(TW_CIVS[civId]?.nm||civId));
    tpLoadKlasCivs();
  }catch(e){ toast("Fout",typeof e==="string"?e:(e?.message||"")); }
}

function tpUnassignKlasCiv(klas){
  fbDB.ref("totalwar/klasCivs/"+klas).remove()
    .then(()=>{ toast("Ontkoppeld",klas); tpLoadKlasCivs(); })
    .catch(e=>toast("Fout",typeof e==="string"?e:(e?.message||"")));
}

function tpLoadClasses(){
  return teacherNet().getClasses()
    .then(cls=>{ _tpClasses=cls||{}; tpRenderClasses(); })
    .catch(e=>toast("Fout",typeof e==="string"?e:(e?.message||"Kon klassen niet laden")));
}

function tpRenderClasses(){
  const cont=el("tpClassList"); if(!cont) return;
  const entries=Object.entries(_tpClasses);
  if(!entries.length){
    cont.innerHTML=`<div class="note" style="text-align:center;padding:20px">Nog geen klassen. Voeg een klas toe hieronder.</div>`;
    return;
  }
  const q=s=>"'"+String(s).replace(/\\/g,"\\\\").replace(/'/g,"\\'")+"'";
  cont.innerHTML=entries.map(([cid,cls])=>{
    const count=Object.keys(cls.students||{}).length;
    return `<div class="panel" style="margin-bottom:8px;display:flex;align-items:center;gap:8px;flex-wrap:wrap">
      <div style="flex:1;min-width:140px">
        <div style="font-weight:700;font-size:16px">${esc(cls.className||cid)}</div>
        <div class="note">${count} leerling${count!==1?"en":""}</div>
      </div>
      <button class="chip" onclick="tpOpenClass(${q(cid)})">${iconSVG("helmet",13,"currentColor")} Leerlingen</button>
      <button class="chip" onclick="tpRenameClass(${q(cid)})">${iconSVG("column",13,"currentColor")} Hernoem</button>
      <button class="chip" style="color:#e07060;border-color:rgba(90,18,12,.4)" onclick="tpDeleteClass(${q(cid)})">✕</button>
    </div>`;
  }).join("");
}

function teacherAddClass(){
  const nm=(prompt("Naam van de nieuwe klas:")||"").trim();
  if(!nm) return;
  const id="class_"+Date.now();
  teacherNet().saveClass(id,nm)
    .then(()=>{ toast("Klas aangemaakt",nm); return tpLoadClasses(); })
    .catch(e=>toast("Fout",typeof e==="string"?e:e?.message));
}

function tpRenameClass(classId){
  const huidig=_tpClasses[classId]?.className||classId;
  const nm=(prompt("Nieuwe naam voor '"+huidig+"':",huidig)||"").trim();
  if(!nm||nm===huidig) return;
  teacherNet().saveClass(classId,nm)
    .then(()=>{ toast("Naam gewijzigd",nm); return tpLoadClasses(); })
    .catch(e=>toast("Fout",typeof e==="string"?e:e?.message));
}

function tpDeleteClass(classId){
  const nm=_tpClasses[classId]?.className||classId;
  if(!confirm("Klas '"+nm+"' inclusief alle leerlingen verwijderen?")) return;
  teacherNet().deleteClass(classId)
    .then(()=>{ toast("Klas verwijderd",nm); return tpLoadClasses(); })
    .catch(e=>toast("Fout",typeof e==="string"?e:e?.message));
}

function teacherLogout(){
  teacherNet().logoutTeacher().then(()=>go("teacherLogin"));
}

function tpLoadBmAccounts(){
  const klas=(el("tpBmKlas")?.value||"").trim().toUpperCase();
  const cont=el("tpBmAccounts");
  const unCont=el("tpBmUnassigned");
  if(!cont) return;
  if(!klas){ toast("Vul een klascode in",""); return; }
  cont.innerHTML=`<div class="note" style="padding:8px 0">Laden…</div>`;
  if(unCont) unCont.innerHTML="";

  teacherNet().getIdentities(klas).then(idents=>{
    const entries=Object.entries(idents);
    if(!entries.length){
      cont.innerHTML=`<div class="note">Geen accounts gevonden in klas ${esc(klas)}.</div>`;
      return;
    }

    // Verzamel alle bmKlas+bmLid combinaties die al in een portaalgroep zitten
    const assigned=new Set();
    Object.values(_tpClasses||{}).forEach(cls=>{
      Object.values(cls.students||{}).forEach(s=>{
        if(s.bmKlas&&s.bmLid) assigned.add(s.bmKlas+"/"+s.bmLid);
      });
    });

    // Klasopties voor toewijzing
    const classOpts=Object.entries(_tpClasses||{})
      .map(([cid,c])=>`<option value="${cid}">${esc(c.className||cid)}</option>`).join("");

    // Enkelvoudig-geciteerde JS-string, HTML-veilig voor gebruik in onclick="..."
    const q=s=>"'"+String(s).replace(/\\/g,"\\\\").replace(/'/g,"\\'")+"'";

    const rows=entries.map(([lid,id])=>{
      const isAssigned=assigned.has(klas+"/"+lid);
      const nm=id.name||lid;
      const lv=id.level||1;
      return `<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:7px 0;border-bottom:0.5px solid var(--stone4)${isAssigned?"":";background:rgba(180,120,0,.07)"}">
        <div style="flex:1;min-width:120px">
          <span style="font-weight:600">${esc(nm)}</span>
          <span class="note" style="margin-left:8px">Niv. ${lv}</span>
          ${id.admin?`<span class="pill" style="margin-left:6px;background:var(--hi);color:#000;border:none;font-size:11px">admin</span>`:""}
          ${isAssigned?`<span class="pill" style="margin-left:6px;font-size:11px">toegewezen</span>`:`<span class="pill" style="margin-left:6px;font-size:11px;background:var(--ox);border:none;color:var(--cream)">niet toegewezen</span>`}
        </div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center">
          ${classOpts?`<select id="cls_${lid}" style="padding:5px 8px;border-radius:7px;border:1px solid var(--stone4);background:var(--stone2);color:var(--fg);font-size:13px">
            <option value="">Wijs toe aan…</option>${classOpts}</select>
          <button class="chip" onclick="tpAssignStudent(${q(klas)},${q(lid)},${q(nm)},${lv})">Toewijzen</button>`:""}
          ${id.admin
            ?`<button class="chip" style="color:#e07060;border-color:rgba(90,18,12,.4)" onclick="tpRemoveAdmin(${q(klas)},${q(lid)},${q(nm)})">Admin intrekken</button>`
            :`<button class="chip" onclick="tpGrantAdmin(${q(klas)},${q(lid)},${q(nm)})">Maak admin</button>`}
        </div>
      </div>`;
    });

    const unassignedCount=entries.filter(([lid])=>!assigned.has(klas+"/"+lid)).length;
    cont.innerHTML=`<div class="note" style="margin-bottom:6px">${entries.length} account${entries.length!==1?"s":""} gevonden · <b>${unassignedCount} niet toegewezen</b></div>`+rows.join("");
  })
  .catch(e=>{ cont.innerHTML=`<div class="note warn">${esc(typeof e==="string"?e:(e?.message||"Fout"))}</div>`; });
}

function tpAssignStudent(klas,lid,nm,level){
  const sel=el("cls_"+lid);
  const classId=sel?.value;
  if(!classId){ toast("Kies een klas","Selecteer een doelklas in het uitklapmenu."); return; }
  const studentData={ displayName:nm, bmKlas:klas, bmLid:lid, level:level };
  teacherNet().assignStudent(classId, klas+"_"+lid, studentData)
    .then(()=>{ toast("Toegewezen",nm+" → "+(_tpClasses[classId]?.className||classId)); return tpLoadClasses(); })
    .then(()=>tpLoadBmAccounts())
    .catch(e=>toast("Mislukt",typeof e==="string"?e:(e?.message||"")));
}

function tpGrantAdmin(klas,lid,nm){
  teacherNet().setAdminFlag(klas,nm)
    .then(()=>{ toast("Admin ingesteld",nm); tpLoadBmAccounts(); })
    .catch(e=>toast("Mislukt",typeof e==="string"?e:(e?.message||"")));
}

function tpRemoveAdmin(klas,lid,nm){
  if(!confirm("Admin-status intrekken van '"+nm+"'?")) return;
  teacherNet().removeAdminFlag(klas,lid)
    .then(()=>{ toast("Admin ingetrokken",nm); tpLoadBmAccounts(); })
    .catch(e=>toast("Mislukt",typeof e==="string"?e:(e?.message||"")));
}

function tpLoadKlascodes(){
  const cont=el("tpKlascodeList"); if(!cont) return;
  teacherNet().getKlascodes().then(({approved,used})=>{
    tpRenderKlasSelect(approved);
    if(!approved.length&&!used.length){
      cont.innerHTML=`<div class="note">Nog geen klascodes. Maak er een aan hierboven.</div>`;
      return;
    }
    const allCodes=[...new Set([...approved,...used])].sort();
    cont.innerHTML=allCodes.map(code=>{
      const isApproved=approved.includes(code);
      const inUse=used.includes(code);
      return `<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:7px 0;border-bottom:0.5px solid var(--stone4)">
        <div style="flex:1;font-weight:600">${esc(code)}
          ${isApproved?`<span class="pill" style="font-size:11px;margin-left:6px">goedgekeurd</span>`:`<span class="pill" style="font-size:11px;margin-left:6px;background:var(--ox);border:none;color:var(--cream)">niet goedgekeurd</span>`}
          ${inUse?`<span class="pill" style="font-size:11px;margin-left:4px;background:var(--stone4);border:none">in gebruik</span>`:""}
        </div>
        <div style="display:flex;gap:6px">
          <button class="chip" onclick="el('tpBmKlas').value='${esc(code)}';tpLoadBmAccounts()">Accounts</button>
          ${isApproved
            ?`<button class="chip" style="color:#e07060;border-color:rgba(90,18,12,.4)" onclick="tpDeleteKlascode('${esc(code)}')">Verwijder</button>`
            :`<button class="chip" onclick="tpApproveKlascode('${esc(code)}')">Goedkeuren</button>`}
        </div>
      </div>`;
    }).join("");
  }).catch(e=>{ cont.innerHTML=`<div class="note warn">${esc(typeof e==="string"?e:(e?.message||"Fout"))}</div>`; });
}

// Vult de klas-dropdown van het Total War-koppelpaneel met de goedgekeurde
// klascodes hierboven — leerlingen kunnen alleen met een goedgekeurde code
// aanmelden, dus alleen die zijn zinvol om aan een beschaving te koppelen.
function tpRenderKlasSelect(approved){
  const sel=el("tpTwKlas"); if(!sel) return;
  const cur=sel.value;
  const codes=[...approved].sort();
  sel.innerHTML=`<option value="">— kies een klas —</option>`+
    codes.map(code=>`<option value="${esc(code)}">${esc(code)}</option>`).join("");
  if(cur && codes.includes(cur)) sel.value=cur;
}

function tpCreateKlascode(){
  const code=(el("tpNewKlas")?.value||"").trim().toUpperCase();
  if(!code){ toast("Vul een code in",""); return; }
  if(!/^[A-Z0-9]{2,12}$/.test(code)){ toast("Ongeldige code","Gebruik 2–12 letters of cijfers, geen spaties."); return; }
  teacherNet().createKlascode(code)
    .then(()=>{ toast("Klascode aangemaakt",code); if(el("tpNewKlas"))el("tpNewKlas").value=""; tpLoadKlascodes(); })
    .catch(e=>toast("Mislukt",typeof e==="string"?e:(e?.message||"")));
}

function tpApproveKlascode(code){
  teacherNet().createKlascode(code)
    .then(()=>{ toast("Goedgekeurd",code); tpLoadKlascodes(); })
    .catch(e=>toast("Mislukt",typeof e==="string"?e:(e?.message||"")));
}

function tpDeleteKlascode(code){
  if(!confirm("Klascode '"+code+"' verwijderen? Leerlingen met deze code kunnen dan niet meer aanmelden.")) return;
  teacherNet().deleteKlascode(code)
    .then(()=>{ toast("Verwijderd",code); tpLoadKlascodes(); })
    .catch(e=>toast("Mislukt",typeof e==="string"?e:(e?.message||"")));
}

/* ---- SCHERM: leerlingen in één klas ---- */
SCREENS.teacherClass = function(){
  if(!teacherNet().isTeacherLoggedIn()){ go("teacherLogin"); return; }
  if(!_tpCurrentClass){ go("teacherPortal"); return; }
  const cls=_tpClasses[_tpCurrentClass]||{};
  H(brand(true)+`
  <div class="scrhead">
    <button class="back" onclick="go('teacherPortal')">${iconSVG("shield",20,"currentColor")}</button>
    <h2>${esc(cls.className||_tpCurrentClass)}</h2>
  </div>
  <div id="tpStudentList"><div class="note" style="text-align:center;padding:16px">Laden…</div></div>
  ${foot()}`);
  tpRenderStudents();
};

function tpOpenClass(classId){
  _tpCurrentClass=classId;
  go("teacherClass");
}

function tpRenderStudents(){
  const cont=el("tpStudentList"); if(!cont) return;
  const cls=_tpClasses[_tpCurrentClass]||{};
  const students=Object.entries(cls.students||{});
  if(!students.length){
    cont.innerHTML=`<div class="note" style="text-align:center;padding:16px">Geen leerlingen in deze klas.</div>`;
    return;
  }
  const otherOptions=Object.entries(_tpClasses)
    .filter(([cid])=>cid!==_tpCurrentClass)
    .map(([cid,c])=>`<option value="${cid}">${esc(c.className||cid)}</option>`)
    .join("");
  const q=s=>"'"+String(s).replace(/\\/g,"\\\\").replace(/'/g,"\\'")+"'";
  cont.innerHTML=students.map(([sid,s])=>`
    <div class="panel" style="margin-bottom:6px;display:flex;align-items:center;gap:8px;flex-wrap:wrap">
      <div style="flex:1;min-width:130px">
        <div style="font-weight:600">${esc(s.displayName||sid)}</div>
        ${s.level||s.coins?`<div class="note">Level ${s.level||"—"}${s.coins?" · "+s.coins+" munten":""}</div>`:""}
      </div>
      ${otherOptions?`
      <select id="mv_${sid}" style="padding:5px 8px;border-radius:7px;border:1px solid var(--stone4);background:var(--stone2);color:var(--fg);font-size:13px">
        <option value="">Verplaats naar…</option>
        ${otherOptions}
      </select>
      <button class="chip" onclick="tpMoveStudent(${q(sid)})">Verplaats</button>`:""}
      <button class="chip" style="color:#e07060;border-color:rgba(90,18,12,.4)" onclick="tpDeleteStudent(${q(sid)},${q(s.displayName||sid)})">✕ Verwijder</button>
    </div>`).join("");
}

function tpDeleteStudent(sid,nm){
  if(!confirm("Leerling '"+nm+"' verwijderen?")) return;
  teacherNet().deleteStudent(_tpCurrentClass,sid)
    .then(()=>{ toast("Verwijderd",nm); return tpLoadClasses(); })
    .then(()=>tpRenderStudents())
    .catch(e=>toast("Fout",typeof e==="string"?e:e?.message));
}

function tpMoveStudent(sid){
  const sel=el("mv_"+sid); if(!sel||!sel.value){ toast("Kies een klas","Selecteer een doelklas in het uitklapmenu."); return; }
  const toClassId=sel.value;
  const studentData=(_tpClasses[_tpCurrentClass]?.students||{})[sid];
  if(!studentData){ toast("Fout","Leerling niet gevonden."); return; }
  teacherNet().moveStudent(_tpCurrentClass,toClassId,sid,studentData)
    .then(()=>{ toast("Verplaatst",_tpClasses[toClassId]?.className||toClassId); return tpLoadClasses(); })
    .then(()=>tpRenderStudents())
    .catch(e=>toast("Fout",typeof e==="string"?e:e?.message));
}

