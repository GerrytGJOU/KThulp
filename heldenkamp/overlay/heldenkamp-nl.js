/* Heldenkamp — Nederlandse tikbare woorden met Engelse hulp. Wordt bij het bouwen gegenereerd
   (build.js vult HK_GLOSS uit overlay/woordenboek*.json) en laadt NA alle castra-scripts.
   Vervangt de Latijnse woordhulp van castra-latin.js: tik op een woord = Engelse betekenis. */
(function(){
  const HK_GLOSS = /*HK_GLOSS*/{};
  // Nederlandse normalisatie: kleine letters, accenten en apostrof (regio's) blijven, rand-leestekens weg.
  window.castraNorm = function(w){ return String(w).toLowerCase().replace(/[’‘]/g,"'").replace(/^[^a-zà-ÿ]+|[^a-zà-ÿ]+$/g,""); };
  // Alle Latijnse glossen (ook die uit andere castra-bestanden) weg; alleen het Nederlandse woordenboek telt.
  Object.keys(CASTRA_GLOSS).forEach(k=>{ delete CASTRA_GLOSS[k]; });
  Object.assign(CASTRA_GLOSS, HK_GLOSS);
  window.castraNameGloss = function(w){ const n = castraPlayerName(); if(!n) return null; return n.split(/\s+/).some(p=>castraNorm(p)===w) ? "your name" : null; };
  window.castraFormGloss = function(w){
    if(typeof CASTRA_FORM_LIST==="undefined") return null;
    if(!window._hkFormWords){ window._hkFormWords = {}; CASTRA_FORM_LIST.forEach(f=>{ f.nm.split(" ").forEach(p=>{ const k = castraNorm(p); if(k && !window._hkFormWords[k]) window._hkFormWords[k] = f.nm; }); }); }
    const nm = window._hkFormWords[w]; return nm ? "soldier type or people: "+nm : null;
  };
  window.castraTapWord = function(ev, node){
    ev.stopPropagation();
    const w = node.getAttribute("data-w");
    const meaning = CASTRA_GLOSS[w] || castraNameGloss(w) || castraFormGloss(w) || "(no translation yet)";
    castraLogHelp("words", w, node.textContent);
    let box = document.getElementById("castraGloss");
    if(!box){
      box = document.createElement("div"); box.id = "castraGloss";
      box.style.cssText = "position:fixed;left:50%;bottom:18px;transform:translateX(-50%);z-index:9998;background:#1b150e;color:var(--cream,#f1e6c4);border:1px solid var(--hi,#d4af37);border-radius:10px;padding:8px 14px;font-size:15px;box-shadow:0 4px 14px rgba(0,0,0,.5);max-width:90vw";
      document.body.appendChild(box);
    }
    box.innerHTML = `<b>${esc(node.textContent)}</b> = ${esc(meaning)}`;
    box.style.display = "block";
    clearTimeout(box._t); box._t = setTimeout(()=>{ box.style.display="none"; }, 3500);
  };
  // Woordenquiz (Senator): Nederlandse woorden met Engelse betekenis i.p.v. de Latijnse lijst; geen Certamen-woordenbrug.
  const HK_WORDQUIZ = /*HK_WORDQUIZ*/[];
  if(typeof CASTRA_QUIZ_WORDS!=="undefined"){ CASTRA_QUIZ_WORDS.length = 0; HK_WORDQUIZ.forEach(p=>CASTRA_QUIZ_WORDS.push(p)); }
  window.cxQuizExtras = function(){ return []; };
  // Zinnenquiz: het leesteken van de zin staat anders voor het vraagteken ("...dapper.?").
  if(typeof castraQuizRender==="function"){
    const orig = castraQuizRender;
    window.castraQuizRender = function(){
      orig();
      const b = document.querySelector('#cwPanel div[style*="font-size:26px"] b');
      if(b) b.textContent = b.textContent.replace(/[.!?…]+$/, "");
    };
  }
  /* ---- Zelfstandig spel: geen Certamen-menu, geen Firebase, lokale speler met avatar ---- */
  window.initFirebase = function(){ return false; };          // nooit iets naar de gedeelde database sturen
  { const st = document.createElement("style"); st.textContent = ".portal-back{display:none!important}"; document.head.appendChild(st); }
  document.title = "Heldenkamp";
  window.brand = function(){ return '<div class="brand"><div><div class="t">HELDENKAMP</div><div class="s">Leer Nederlands · Learn Dutch</div></div></div>'; };
  window.foot = function(){ return '<div class="foot">Heldenkamp · © Gerben de Jong · 2026</div>'; };

  // Avatar-uitrusting: de eisen van Battle Mode (niveau, munten, beheersing, prestige, Chronica, eerbewijzen)
  // bestaan hier niet; alles wordt vrijgespeeld met het Castra-niveau (menu: je kaart).
  Object.values(BM_AVATAR_PARTS).forEach(p=>p.opts.forEach(o=>{
    const r = o.requires; if(!r) return;
    o.requires = { castra: r.level ? 2*r.level : r.coins ? Math.ceil(r.coins/40)+3 : r.mastery ? 14 : r.prestige ? 25 : r.spFinale ? 22 : r.achCategory ? 20 : 10 };
  }));
  window.bmIsUnlocked = function(opt){ if(!opt || !opt.requires) return true; return (typeof CASTRA!=="undefined" && CASTRA ? castraPLevel() : 1) >= (opt.requires.castra||0); };
  window.bmReqText = function(opt){ const r = opt && opt.requires; return r ? { short:"Niv. "+r.castra, full:"Bereik Castra-niveau "+r.castra } : null; };

  // Lokale speler (naam + avatar), bewaard op dit apparaat. Zonder klascode/leerlingcode synchroniseert Castra nooit.
  if(typeof BM_IDENT!=="undefined" && !BM_IDENT){ try{ const s = bmIdentLoad(); if(s && !s.klascode) BM_IDENT = s; }catch(e){} }
  const _go = window.go;
  window.go = function(name){
    if(name==="home" || name==="battleHome" || name==="battleProfile" || (name==="castraHome" && !BM_IDENT)) name = BM_IDENT ? "castraHome" : "hkStart";
    return _go.apply(this, [name].concat([].slice.call(arguments, 1)));
  };
  SCREENS.hkStart = function(){
    H(brand()+`<div class="panel" style="text-align:center;margin-top:24px">
      <h2 style="margin:0 0 8px">Welkom bij Heldenkamp!</h2>
      <p>Hoe heet je?<br><small style="opacity:.7">What is your name?</small></p>
      <input id="hkName" maxlength="20" autocomplete="off" placeholder="Naam / Name" style="font-size:20px;padding:10px;width:80%;max-width:320px;text-align:center;border-radius:8px;border:2px solid var(--hi-dim,#8a6d2f);background:#1b150e;color:var(--cream,#f1e6c4)">
      <div style="margin-top:14px"><button class="btn btn-gold lg" onclick="hkCreate()" style="min-height:48px">Start / Begin</button></div></div>`+foot());
  };
  window.hkCreate = function(){
    const n = (document.getElementById("hkName").value || "").trim().slice(0, 20);
    if(!n){ toast("Naam / Name", "Vul je naam in. / Please enter your name."); return; }
    BM_IDENT = { name:n, coins:0, xp:0, level:1, avatar:bmAvatarDefaults(), classHistory:{}, achievements:[], unlocked:[], lastActive:Date.now() };
    bmIdentSave(BM_IDENT);
    BM_AV_RETURN = "castraHome"; go("battleAvatarEdit");       // eerst je uiterlijk kiezen, daarna naar het kamp
  };
  // Colosseum (duel/vierkamp tegen klasgenoten) is online en hoort er niet in: deur in Roma en aankondiging weg.
  if(typeof CASTRA_WORLDS!=="undefined" && CASTRA_WORLDS.roma && CASTRA_WORLDS.roma.doors){
    const ds = CASTRA_WORLDS.roma.doors;
    for(let i = ds.length-1; i >= 0; i--) if(ds[i].to==="colosseum_roma") ds.splice(i, 1);
  }
  if(typeof CASTRA_UNLOCKS!=="undefined"){ const i = CASTRA_UNLOCKS.findIndex(u=>u.id==="colosseum"); if(i >= 0) CASTRA_UNLOCKS.splice(i, 1); }

  // Principia (klassenevenementen: Legio en Commercium) heeft een klas en een online database nodig: uit het kamp.
  // Gebouwen met phase!==1 worden niet getekend, niet aangeklikt en tellen niet mee voor de bereikbaarheid.
  { const b = castraBuilding("principia"); if(b) b.phase = 0; }

  // Menu: geen "Afsluiten" naar het portaal; wel "Uiterlijk" (avatar-editor).
  { const i = CASTRA_MENU_SYS.indexOf("exeo"); if(i >= 0) CASTRA_MENU_SYS.splice(i, 1); const j = CASTRA_MENU_ITEMS.findIndex(x=>x.id==="exeo"); if(j >= 0) CASTRA_MENU_ITEMS.splice(j, 1); }
  CASTRA_MENU_ITEMS.push({ id:"avatar", la:"Uiterlijk", nl:"change your look" });
  CASTRA_MENU_ICON.avatar = "🧑";
  { const pick = castraMenuPick; window.castraMenuPick = function(id){ if(id==="avatar"){ castraMenuClose(); BM_AV_RETURN = "castraHome"; go("battleAvatarEdit"); return; } return pick.apply(this, arguments); }; }

  /* ---- Oefening "De of het?" (A1): lidwoord kiezen bij een zelfstandig naamwoord ---- */
  const HK_DEHET = /*HK_DEHET*/[];
  window.hkDeHetStart = function(){
    const rng = castraRng((castraNow() ^ CASTRA.seed ^ 0x6e41)>>>0); CASTRA.seed = (CASTRA.seed+7)>>>0;
    const shuf = a => a.slice().sort(()=>rng()-0.5);
    const het = shuf(HK_DEHET.filter(w=>w[1]==="het")).slice(0,2), de = shuf(HK_DEHET.filter(w=>w[1]==="de")).slice(0,3);
    const qs = shuf(het.concat(de)).map(w=>({ la:w[0], opts:["de","het"], ans: w[1]==="de" ? 0 : 1 }));
    CASTRA_QUIZ_KIND = { key:"quiz_dehet", rid:"latium", words:[], title:"De of het?" };
    CASTRA_QUIZ = { qs, i:0, score:0, picked:null, done:false };
    castraQuizRender();
  };
  { const qs0 = castraQuizStart; window.castraQuizStart = function(){ if(CASTRA_QUIZ_KIND && CASTRA_QUIZ_KIND.key==="quiz_dehet") return hkDeHetStart(); return qs0.apply(this, arguments); }; }
  { // Vraagtekst en tip voor deze oefening (de gewone quizweergave vraagt "Wat betekent ...?")
    const rr0 = window.castraQuizRender;
    window.castraQuizRender = function(){
      rr0();
      if(!(CASTRA_QUIZ_KIND && CASTRA_QUIZ_KIND.key==="quiz_dehet") || !CASTRA_QUIZ) return;
      const panel = document.querySelector("#cwPanel .panel"); if(!panel) return;
      if(CASTRA_QUIZ.done){
        panel.insertAdjacentHTML("beforeend", '<div class="note" style="margin-top:8px">Tip: ongeveer driekwart van de Nederlandse woorden is een <b>de</b>-woord. Verkleinwoorden (-je: huisje, boompje) zijn altijd <b>het</b>.<br><small style="opacity:.75">About three quarters of Dutch nouns take "de". Diminutives (-je) always take "het".</small></div>');
        return;
      }
      const q = CASTRA_QUIZ.qs[CASTRA_QUIZ.i], d = panel.querySelector('div[style*="font-size:26px"]');
      if(d) d.innerHTML = 'De of het? &nbsp;<b>' + esc(q.la) + '</b>';
    };
  }
  // De Senator biedt nu twee oefeningen aan.
  window.castraQuizOpen = function(){
    if(CASTRA_DLG) return;
    const e = CASTRA_WENT.find(x=>x.id==="senator");
    castraLatSay("Senator", e.look, [ { la:"Gegroet, leider {naam}! Welke oefening kies je?", nl:"Greetings, leader {naam}! Which exercise do you choose?",
        opts:[ { la:"Woorden", nl:"words" }, { la:"De of het?", nl:"de or het?" }, { la:"Nu niet", nl:"not now" } ] } ],
      k=>{
        if(k===0){ CASTRA_QUIZ_KIND = { key:"quiz_senator", rid:"latium", words:null, title:"Woordenquiz" }; castraQuizStart(); }
        else if(k===1){ CASTRA_QUIZ_KIND = { key:"quiz_dehet", rid:"latium", words:[], title:"De of het?" }; castraQuizStart(); }
      });
  };

  // Geen Certamen-profiel: quizbeloningen sturen geen XP/munten naar het Battle Mode-profiel, en de Schola
  // (lastige Latijnse woorden uit Certamen) vervalt; de herhaallijst van eigen opgezochte woorden komt daarvoor in de plaats.
  window.castraMasterXp = function(){ return 0; };
  { const i = CASTRA_MENU_ITEMS.findIndex(x=>x.id==="schola"); if(i >= 0) CASTRA_MENU_ITEMS.splice(i, 1); }

  /* ---- Woordenboek (herhaallijst): de woorden die je opzocht + mini-quiz op je eigen moeilijke woorden ---- */
  // Opzoekingen staan in CASTRA.help.words {woord: aantal}; de vooruitgang per woord in CASTRA.hkRev {woord: {ok}}.
  // Een woord telt als geleerd na 3 goede antwoorden achter elkaar; een fout zet de teller terug op 0.
  let HK_REV = null;
  // Functiewoordjes en 1-2 letterwoorden zijn geen leerstof voor de herhaallijst.
  const HK_STOP = new Set('de het een en of in op is te er ik je jij hij ze we wij u mijn jouw zijn haar hun ons onze me mij jou hem om aan bij met van voor naar uit als dat die dit deze maar ook nog al wel niet geen dan nu zo dus ja nee s n'.split(' '));
  function hkRevWords(){
    const h = (CASTRA.help && CASTRA.help.words) || {}, rv = CASTRA.hkRev || (CASTRA.hkRev = {});
    return Object.keys(h).filter(w=>CASTRA_GLOSS[w] && w.length>2 && !HK_STOP.has(w)).map(w=>({ w, n:h[w], g:CASTRA_GLOSS[w], ok:(rv[w] && rv[w].ok) || 0 }))
      .sort((a,b)=>b.n-a.n || a.w.localeCompare(b.w));
  }
  window.hkRevStart = function(){
    const all = hkRevWords(), open = all.filter(x=>x.ok<3), pool = open.length ? open : all;
    const pick = pool.map(x=>({ x, k:x.n*(1+Math.random()) })).sort((a,b)=>b.k-a.k).slice(0,5).map(p=>p.x);
    const gl = Object.keys(CASTRA_GLOSS).map(k=>CASTRA_GLOSS[k]).filter(g=>g.length<46 && !/[(]/.test(g));
    const qs = pick.map(x=>{
      const wrong = []; let guard = 0;
      while(wrong.length<2 && guard++<200){ const g = gl[Math.floor(Math.random()*gl.length)]; if(g!==x.g && !wrong.includes(g)) wrong.push(g); }
      const opts = [x.g].concat(wrong).sort(()=>Math.random()-.5);
      return { w:x.w, opts, ans:opts.indexOf(x.g) };
    });
    HK_REV = { qs, i:0, score:0, picked:null, done:false, xp:0 };
    castraMenuRender();
  };
  window.hkRevPick = function(k){
    const R = HK_REV; if(!R || R.picked!==null) return;
    R.picked = k; const q = R.qs[R.i], rv = CASTRA.hkRev || (CASTRA.hkRev = {}), r = rv[q.w] || (rv[q.w] = { ok:0 });
    if(k===q.ans){ R.score++; r.ok++; } else r.ok = 0;
    castraSave(); castraMenuRender();
  };
  window.hkRevNext = function(){
    const R = HK_REV; if(!R) return;
    if(R.i >= R.qs.length-1){
      R.done = true;
      const w = CASTRA.wday || (CASTRA.wday = {});
      if(R.score>=3 && w.hkrev!==castraWDay()){ w.hkrev = castraWDay(); R.xp = 3*R.score; castraPxpAdd(R.xp, "Woorden herhaald"); }
    } else { R.i++; R.picked = null; }
    castraMenuRender();
  };
  window.hkRevClose = function(){ HK_REV = null; castraMenuRender(); };
  function hkRevHTML(){ return '<div data-hk-keep>' + hkRevHTML0() + '</div>'; }
  function hkRevHTML0(){
    const R = HK_REV, btn = "min-height:44px";
    if(R && !R.done){
      const q = R.qs[R.i];
      return '<h3 style="margin:0 0 6px">📖 Woorden herhalen <small>review your words</small></h3><div style="opacity:.8">Vraag '+(R.i+1)+' van '+R.qs.length+'</div>'
        + '<div style="font-size:26px;margin:8px 0">Wat betekent <b>'+esc(q.w)+'</b>?</div>'
        + q.opts.map((o,k)=>{ const picked = R.picked!==null, ok = k===q.ans, sel = R.picked===k;
            return '<button class="btn '+(picked&&ok?"btn-gold":"")+'" '+(picked?"disabled":"")+' style="display:block;width:100%;margin:5px 0;min-height:48px;font-size:17px;'+(picked&&sel&&!ok?"opacity:.55;text-decoration:line-through":"")+'" onclick="hkRevPick('+k+')">'+esc(o)+'</button>'; }).join("")
        + (R.picked!==null ? '<button class="btn btn-gold" style="'+btn+';margin-top:6px" onclick="hkRevNext()">'+(R.i>=R.qs.length-1?"Uitslag":"Volgende")+'</button>' : "");
    }
    if(R && R.done){
      return '<h3 style="margin:0 0 6px">📖 Woorden herhalen</h3><div style="font-size:20px">Score: <b>'+R.score+' / '+R.qs.length+'</b></div>'
        + (R.xp ? '<div class="note">🎖️ +'+R.xp+' XP (eenmaal per dag) <small>· XP once a day</small></div>' : (R.score>=3 ? '<div class="note">Vandaag al beloond. <small>Already rewarded today.</small></div>' : '<div class="note">Minstens 3 goed voor XP. <small>At least 3 correct for XP.</small></div>'))
        + '<div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap"><button class="btn btn-gold" style="'+btn+'" onclick="hkRevStart()">Nog een ronde</button><button class="btn" style="'+btn+'" onclick="hkRevClose()">Naar de lijst</button></div>';
    }
    const L = hkRevWords(), leerd = L.filter(x=>x.ok>=3).length;
    if(!L.length) return '<h3 style="margin:0 0 6px">📖 Woordenboek <small>your words</small></h3><div class="note">Tik in een gesprek op een woord om de betekenis te zien. Al je opgezochte woorden komen hier te staan.<br><small>Tap a word in a conversation to see its meaning. All the words you look up are collected here.</small></div>';
    return '<h3 style="margin:0 0 6px">📖 Woordenboek <small>your words</small></h3>'
      + '<div style="font-size:13px;opacity:.85;margin-bottom:6px">'+L.length+' woorden opgezocht, '+leerd+' geleerd (3 keer goed). <small>'+L.length+' words looked up, '+leerd+' learned (3 correct in a row).</small></div>'
      + '<button class="btn btn-gold" style="'+btn+';margin-bottom:8px" onclick="hkRevStart()">Oefen mijn woorden <small>practise my words</small></button>'
      + L.slice(0,80).map(x=>'<div style="'+CASTRA_MV_ROW+'"><b style="min-width:110px">'+(x.ok>=3?"✅ ":"")+esc(x.w)+'</b><span style="flex:1">'+esc(x.g)+'</span><small style="opacity:.6">'+x.n+'×</small></div>').join("");
  }
  CASTRA_MENU_ITEMS.push({ id:"woorden", la:"Woordenboek", nl:"your looked-up words" });
  CASTRA_MENU_ICON.woorden = "📖";
  { const mv0 = castraMenuView; window.castraMenuView = function(id){ return id==="woorden" ? hkRevHTML() : mv0.apply(this, arguments); }; }
  { const pick0 = window.castraMenuPick; window.castraMenuPick = function(id){ if(id==="woorden") HK_REV = null; return pick0.apply(this, arguments); }; }

  /* ---- Engelse hulp aan/uit: altijd / alleen bij tikken / uit ----
     De build verzamelt alle Engelse hulpteksten (HK_EN). Een MutationObserver zet elke losse Engelse tekst in het spel in een
     <span class="hk-en">; CSS verbergt die in de standen "tap" en "off". Gesprekken (woord tikken, ⓘ-vertaling), quizzen en het
     woordenboek zijn uitgesloten, want daar is het Engels de leerstof of de hulp op verzoek. In "off" werken ook tikken en ⓘ niet. */
  const HK_EN = new Set(/*HK_EN*/[]);
  ["words","de or het?","not now","your looked-up words","change your look","English help","review your words","your words","practise my words","Which exercise do you choose?"].forEach(s=>HK_EN.add(s));
  const hkEnMode = () => { try{ return localStorage.getItem("english") || "all"; }catch(e){ return "all"; } };
  function hkEnApply(){ const m = hkEnMode(); document.body.classList.toggle("hk-en-tap", m==="tap"); document.body.classList.toggle("hk-en-off", m==="off"); }
  { const st = document.createElement("style");
    st.textContent = "body.hk-en-tap .hk-en,body.hk-en-off .hk-en{display:none!important}body.hk-en-off .cl-i{display:none!important}body.hk-en-off .cl-w{border-bottom-color:transparent!important;cursor:default!important}";
    document.head.appendChild(st); }
  function hkEnTag(root){
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode:n=>{
      const t = n.nodeValue.trim(); if(t.length<2 || !HK_EN.has(t)) return NodeFilter.FILTER_REJECT;
      const p = n.parentElement; if(!p || p.closest(".hk-en,.cl-s,#cwPanel,[data-hk-keep],script,style,textarea,input,button.btn-gold")) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT; } });
    const hits = []; while(w.nextNode()) hits.push(w.currentNode);
    hits.forEach(n=>{ const sp = document.createElement("span"); sp.className = "hk-en"; n.parentNode.replaceChild(sp, n); sp.appendChild(n); });
  }
  { const mo = new MutationObserver(muts=>{
      mo.disconnect();
      muts.forEach(m=>m.addedNodes.forEach(n=>{ if(n.nodeType===1) hkEnTag(n); else if(n.nodeType===3 && n.parentElement) hkEnTag(n.parentElement); }));
      mo.observe(document.body, { childList:true, subtree:true });
    });
    hkEnApply(); hkEnTag(document.body); mo.observe(document.body, { childList:true, subtree:true }); }
  window.hkEnSet = function(m){ try{ localStorage.setItem("english", m); }catch(e){} hkEnApply(); castraMenuRender(); };
  { const t0 = window.castraTapWord; window.castraTapWord = function(ev, node){ if(hkEnMode()==="off"){ ev.stopPropagation(); return; } return t0.apply(this, arguments); }; }
  function hkEnHTML(){
    const m = hkEnMode(), b = (v, lab, sub)=>'<button class="btn '+(m===v?"btn-gold":"")+'" style="display:block;width:100%;margin:5px 0;min-height:52px;font-size:17px;text-align:left" data-v="'+v+'" onclick="hkEnSet(this.dataset.v)">'+(m===v?"● ":"○ ")+lab+'<br><small style="opacity:.8">'+sub+'</small></button>';
    return '<div data-hk-keep><h3 style="margin:0 0 6px">Engelse hulp <small>English help</small></h3>'
      + '<div style="font-size:14px;margin-bottom:8px">Hoeveel Engels wil je zien? <small>How much English do you want to see?</small></div>'
      + b("all","Altijd","Always: labels, translations, and tapping a word.")
      + b("tap","Alleen bij tikken","Only when you tap: a word shows its meaning, the ⓘ button shows the sentence.")
      + b("off","Uit","Off: only Dutch. (The quizzes and your word list stay English.)")
      + '</div>';
  }
  CASTRA_MENU_ITEMS.push({ id:"engels", la:"Engelse hulp", nl:"English help" });
  CASTRA_MENU_ICON.engels = "🇬🇧";
  { const i = CASTRA_MENU_SYS.indexOf("sonus"); CASTRA_MENU_SYS.splice(i<0 ? CASTRA_MENU_SYS.length : i+1, 0, "engels"); }
  { const mv1 = window.castraMenuView; window.castraMenuView = function(id){ return id==="engels" ? hkEnHTML() : mv1.apply(this, arguments); }; }

  // Heldenkamp heeft geen docentoverzicht en geen Firebase: opzoekingen blijven lokaal in CASTRA.help.
  window.castraHelpSync = function(){};
})();
