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
  /* ---- Niveaus A1 / A2 / B1: oefenmateriaal per niveau, het huidige niveau telt dubbel, het niveau daaronder één keer (herhaling) ---- */
  const HK_LV = ["A1","A2","B1"];
  const hkLevel = () => { let l = null; try{ l = localStorage.getItem("nlLevel"); }catch(e){} return HK_LV.includes(l) ? l : "A1"; };
  const hkSetLevel = l => { try{ localStorage.setItem("nlLevel", l); }catch(e){} };
  const hkMix = map => { const L = hkLevel(), i = HK_LV.indexOf(L); return (map[L]||[]).concat(map[L]||[], i>0 ? (map[HK_LV[i-1]]||[]) : []); };
  const hkPoolUniq = a => { const seen = new Set(); return a.filter(x=>{ if(seen.has(x[0])) return false; seen.add(x[0]); return true; }); };
  const HK_WORDQUIZ = /*HK_WORDQUIZ*/{};
  window.hkWordPool = function(){
    if(typeof CASTRA_QUIZ_WORDS==="undefined") return;
    CASTRA_QUIZ_WORDS.length = 0; hkPoolUniq(hkMix(HK_WORDQUIZ)).forEach(p=>CASTRA_QUIZ_WORDS.push(p));
  };
  hkWordPool();
  window.cxQuizExtras = function(){ return []; };
  // Vangen (Capere): de woordvraag gebruikt hier de Nederlandse woorden met Engelse betekenis (zelfde lijst als de woordenquiz), niet de Latijnse frequentielijst.
  window.castraVCatchWord = function(rng){
    const pool = (typeof CASTRA_QUIZ_WORDS!=="undefined" ? CASTRA_QUIZ_WORDS : []).filter(w=>w && w[0] && w[1]);
    const w = pool[Math.floor(rng()*pool.length)], wrong = pool.filter(x=>x[1]!==w[1]).sort(()=>rng()-0.5).slice(0,2).map(x=>x[1]);
    const opts = [w[1]].concat(wrong).sort(()=>rng()-0.5);
    return { word:{ la:w[0], nl:w[1] }, opts, ans:opts.indexOf(w[1]) };
  };
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
    HK_PT_FROM = "start"; go("hkPlace");       // eerst de (optionele) niveautest, daarna je uiterlijk kiezen
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
  const HK_DEHET = /*HK_DEHET*/{};
  window.hkDeHetStart = function(){
    const rng = castraRng((castraNow() ^ CASTRA.seed ^ 0x6e41)>>>0); CASTRA.seed = (CASTRA.seed+7)>>>0;
    const shuf = a => a.slice().sort(()=>rng()-0.5);
    const pool = hkPoolUniq(shuf(hkMix(HK_DEHET))), het = pool.filter(w=>w[1]==="het").slice(0,2), de = pool.filter(w=>w[1]==="de").slice(0,3);
    const qs = shuf(het.concat(de)).map(w=>({ la:w[0], opts:["de","het"], ans: w[1]==="de" ? 0 : 1 }));
    CASTRA_QUIZ_KIND = { key:"quiz_dehet", rid:"latium", words:[], title:"De of het? "+hkLevel() };
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
  /* ---- Oefening "Voorzetsels" (A1): het juiste voorzetsel in een zin kiezen ---- */
  const HK_VZ = /*HK_VZ*/{};
  window.hkVzStart = function(){
    const rng = castraRng((castraNow() ^ CASTRA.seed ^ 0x7a15)>>>0); CASTRA.seed = (CASTRA.seed+7)>>>0;
    const shuf = a => a.slice().sort(()=>rng()-0.5);
    const qs = hkPoolUniq(shuf(hkMix(HK_VZ))).slice(0,5).map(w=>{ const opts = shuf([w[1]].concat(w[2])); return { la:w[0], opts, ans:opts.indexOf(w[1]), full:w[0].replace("___", w[1]), en:w[3] }; });
    CASTRA_QUIZ_KIND = { key:"quiz_vz", rid:"latium", words:[], title:"Voorzetsels "+hkLevel() };
    CASTRA_QUIZ = { qs, i:0, score:0, picked:null, done:false };
    castraQuizRender();
  };
  { const qs1 = castraQuizStart; window.castraQuizStart = function(){ if(CASTRA_QUIZ_KIND && CASTRA_QUIZ_KIND.key==="quiz_vz") return hkVzStart(); return qs1.apply(this, arguments); }; }
  { const rr1 = window.castraQuizRender;
    window.castraQuizRender = function(){
      rr1();
      if(!(CASTRA_QUIZ_KIND && CASTRA_QUIZ_KIND.key==="quiz_vz") || !CASTRA_QUIZ) return;
      const panel = document.querySelector("#cwPanel .panel"); if(!panel) return;
      if(CASTRA_QUIZ.done){
        panel.insertAdjacentHTML("beforeend", '<div class="note" style="margin-top:8px">Tip: leer het voorzetsel samen met het werkwoord: <b>wachten op</b>, <b>houden van</b>, <b>denken aan</b>, <b>bang zijn voor</b>, <b>kijken naar</b>.<br><small style="opacity:.75">Learn the preposition together with the verb: they are fixed expressions.</small></div>');
        return;
      }
      const q = CASTRA_QUIZ.qs[CASTRA_QUIZ.i], d = panel.querySelector('div[style*="font-size:26px"]');
      if(d) d.innerHTML = '<small style="font-size:14px;opacity:.8">Welk woord past? <span style="opacity:.8">Which word fits?</span></small><br>' + esc(q.la).replace("___", '<b style="border-bottom:3px solid var(--hi,#d4af37);padding:0 14px">&nbsp;&nbsp;&nbsp;</b>');
      if(CASTRA_QUIZ.picked!==null) panel.insertAdjacentHTML("beforeend", '<div class="note" style="margin-top:8px">'+(CASTRA_QUIZ.picked===q.ans?"✔ ":"✘ ")+'<b>'+esc(q.full)+'</b><br><small style="opacity:.8">'+esc(q.en)+'</small></div>');
    };
  }
  /* ---- Oefening "Werkwoorden": de juiste werkwoordsvorm kiezen (A1 tegenwoordig, A2 verleden/voltooid/scheidbaar, B1 bijzin/passief/voorwaardelijk) ---- */
  const HK_WW = /*HK_WW*/{};
  window.hkWwStart = function(){
    const rng = castraRng((castraNow() ^ CASTRA.seed ^ 0x3c77)>>>0); CASTRA.seed = (CASTRA.seed+7)>>>0;
    const shuf = a => a.slice().sort(()=>rng()-0.5);
    const qs = hkPoolUniq(shuf(hkMix(HK_WW))).slice(0,5).map(w=>{ const opts = shuf([w[1]].concat(w[2])); return { la:w[0], opts, ans:opts.indexOf(w[1]), full:w[0].replace("___", w[1]), en:w[3], ruleNl:w[4], ruleEn:w[5] }; });
    CASTRA_QUIZ_KIND = { key:"quiz_ww", rid:"latium", words:[], title:"Werkwoorden "+hkLevel() };
    CASTRA_QUIZ = { qs, i:0, score:0, picked:null, done:false };
    castraQuizRender();
  };
  { const qs2 = castraQuizStart; window.castraQuizStart = function(){ if(CASTRA_QUIZ_KIND && CASTRA_QUIZ_KIND.key==="quiz_ww") return hkWwStart(); return qs2.apply(this, arguments); }; }
  { const rr2 = window.castraQuizRender;
    window.castraQuizRender = function(){
      rr2();
      if(!(CASTRA_QUIZ_KIND && CASTRA_QUIZ_KIND.key==="quiz_ww") || !CASTRA_QUIZ) return;
      const panel = document.querySelector("#cwPanel .panel"); if(!panel) return;
      if(CASTRA_QUIZ.done){
        panel.insertAdjacentHTML("beforeend", '<div class="note" style="margin-top:8px">Tip: leer bij elk werkwoord de drie vormen: <b>lopen — liep — gelopen</b>. Bij een bijzin (omdat, dat, of) staat het werkwoord achteraan.<br><small style="opacity:.75">Learn the three forms of every verb: lopen — liep — gelopen. In a subordinate clause (omdat, dat, of) the verb goes last.</small></div>');
        return;
      }
      const q = CASTRA_QUIZ.qs[CASTRA_QUIZ.i], d = panel.querySelector('div[style*="font-size:26px"]');
      if(d) d.innerHTML = '<small style="font-size:14px;opacity:.8">Welke vorm past? <span style="opacity:.8">Which form fits?</span></small><br>' + esc(q.la).replace("___", '<b style="border-bottom:3px solid var(--hi,#d4af37);padding:0 14px">&nbsp;&nbsp;&nbsp;</b>');
      if(CASTRA_QUIZ.picked!==null) panel.insertAdjacentHTML("beforeend", '<div class="note" style="margin-top:8px">'+(CASTRA_QUIZ.picked===q.ans?"✔ ":"✘ ")+'<b>'+esc(q.full)+'</b><br><small style="opacity:.8">'+esc(q.en)+'</small><br><span style="font-size:13px">📘 '+esc(q.ruleNl)+'</span><br><small style="opacity:.75">'+esc(q.ruleEn)+'</small></div>');
    };
  }
  // De Senator biedt nu drie oefeningen aan.
  window.castraQuizOpen = function(){
    if(CASTRA_DLG) return;
    const e = CASTRA_WENT.find(x=>x.id==="senator");
    castraLatSay("Senator", e.look, [ { la:"Gegroet, leider {naam}! Welke oefening kies je?", nl:"Greetings, leader {naam}! Which exercise do you choose?",
        opts:[ { la:"Woorden", nl:"words" }, { la:"De of het?", nl:"de or het?" }, { la:"Voorzetsels", nl:"prepositions" }, { la:"Werkwoorden", nl:"verbs" }, { la:"Nu niet", nl:"not now" } ] } ],
      k=>{
        if(k===0){ hkWordPool(); CASTRA_QUIZ_KIND = { key:"quiz_senator", rid:"latium", words:null, title:"Woordenquiz "+hkLevel() }; castraQuizStart(); }
        else if(k===1){ CASTRA_QUIZ_KIND = { key:"quiz_dehet", rid:"latium", words:[], title:"De of het?" }; castraQuizStart(); }
        else if(k===2){ CASTRA_QUIZ_KIND = { key:"quiz_vz", rid:"latium", words:[], title:"Voorzetsels" }; castraQuizStart(); }
        else if(k===3){ CASTRA_QUIZ_KIND = { key:"quiz_ww", rid:"latium", words:[], title:"Werkwoorden" }; castraQuizStart(); }
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
  ["words","de or het?","prepositions","verbs","your Dutch level","not now","your looked-up words","change your look","English help","review your words","your words","practise my words","Which exercise do you choose?"].forEach(s=>HK_EN.add(s));
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

  /* ---- Niveau bijhouden, niveautest en niveauscherm ---- */
  const HK_QKEYS = ["quiz_senator","quiz_dehet","quiz_vz","quiz_ww"];
  function hkStats(){ try{ return JSON.parse(localStorage.getItem("nlStats") || "{}"); }catch(e){ return {}; } }
  function hkRecord(score, n){
    const st = hkStats(), L = hkLevel(), a = st[L] || (st[L] = []);
    a.push(Math.round(100*score/n)); while(a.length > 8) a.shift();
    const i = HK_LV.indexOf(L);
    if(i < HK_LV.length-1 && a.length >= 5 && a.slice(-5).reduce((x,y)=>x+y,0)/5 >= 85){
      st[L] = []; hkSetLevel(HK_LV[i+1]);
      toast("🎉 Nieuw niveau: "+HK_LV[i+1]+"!", "Je laatste 5 rondes gingen goed: de oefeningen worden moeilijker. / Your last 5 rounds went well: the exercises get harder.");
    }
    try{ localStorage.setItem("nlStats", JSON.stringify(st)); }catch(e){}
  }
  { const r0 = window.castraQuizReward;
    window.castraQuizReward = function(){
      const Z = CASTRA_QUIZ;
      if(Z && Z.done && !Z.hkRec && CASTRA_QUIZ_KIND && HK_QKEYS.includes(CASTRA_QUIZ_KIND.key)){ Z.hkRec = true; hkRecord(Z.score, Z.qs.length); }
      return r0.apply(this, arguments);
    };
  }

  // Niveautest: 12 vragen (4 per niveau). Startniveau = het eerste niveau waarop je minder dan 3 van de 4 goed hebt (maximaal B1).
  const HK_TEST = /*HK_TEST*/[];
  let HK_PT = null, HK_PT_FROM = "start";
  const hkShuf = a => a.slice().sort(()=>Math.random()-0.5);
  window.hkPtBegin = function(){ HK_PT = { i:0, ans:[], picked:null, order:HK_TEST.map(q=>hkShuf(q.o.map((_,k)=>k))) }; SCREENS.hkPlace(); };
  window.hkPtPick = function(k){ if(!HK_PT || HK_PT.picked!==null) return; HK_PT.picked = k; HK_PT.ans[HK_PT.i] = (k===HK_TEST[HK_PT.i].a) ? 1 : 0; SCREENS.hkPlace(); };
  window.hkPtNext = function(){ if(!HK_PT) return; if(HK_PT.i >= HK_TEST.length-1) HK_PT.done = true; else { HK_PT.i++; HK_PT.picked = null; } SCREENS.hkPlace(); };
  window.hkPtResult = function(){
    const c = { A1:0, A2:0, B1:0 }; HK_TEST.forEach((q,i)=>{ c[q.t] += (HK_PT.ans[i]||0); });
    return { c, level: c.A1<3 ? "A1" : c.A2<3 ? "A2" : "B1" };
  };
  window.hkPtFinish = function(skip){
    if(skip) hkSetLevel("A1"); else if(HK_PT && HK_PT.done) hkSetLevel(hkPtResult().level);
    HK_PT = null;
    if(HK_PT_FROM==="start"){ BM_AV_RETURN = "castraHome"; go("battleAvatarEdit"); } else go("castraHome");
  };
  window.hkPlaceOpen = function(){ HK_PT_FROM = "menu"; HK_PT = null; castraMenuClose(); go("hkPlace"); };
  SCREENS.hkPlace = function(){
    const btn = "display:block;width:100%;margin:6px 0;min-height:52px;font-size:18px", box = 'style="text-align:center;margin-top:18px"';
    let body;
    if(!HK_PT){
      body = '<div class="panel" '+box+'><h2 style="margin:0 0 8px">Niveautest</h2><p>12 korte vragen, ongeveer 3 minuten. Zo begin je op het juiste niveau.<br><small style="opacity:.75">12 short questions, about 3 minutes. This way you start at the right level.</small></p>'
        + '<button class="btn btn-gold" style="'+btn+'" onclick="hkPtBegin()">Start de test <small>start the test</small></button>'
        + '<button class="btn" style="'+btn+'" onclick="hkPtFinish(true)">'+(HK_PT_FROM==="start" ? "Overslaan: begin bij A1 <small>skip: start at A1</small>" : "Terug <small>back</small>")+'</button></div>';
    } else if(HK_PT.done){
      const r = hkPtResult();
      const txt = { A1:"Je begint bij A1: korte zinnen en woorden voor elke dag.", A2:"Je begint bij A2: je beheerst de basis. Nu komen verleden tijd, omdat/want en meer woorden.", B1:"Je begint bij B1: lange zinnen, bijzinnen en woorden over werk, wonen en de overheid." }[r.level];
      body = '<div class="panel" '+box+'><h2 style="margin:0 0 8px">Jouw startniveau: <b>'+r.level+'</b></h2><p>'+txt+'</p>'
        + '<div style="opacity:.8;margin-bottom:8px">A1: '+r.c.A1+'/4 · A2: '+r.c.A2+'/4 · B1: '+r.c.B1+'/4</div>'
        + '<p style="font-size:13px;opacity:.8">Je kunt je niveau altijd veranderen in het menu (☰ → Instellingen → Niveau).<br>You can change your level any time in the menu.</p>'
        + '<button class="btn btn-gold" style="'+btn+'" onclick="hkPtFinish(false)">Verder <small>continue</small></button></div>';
    } else {
      const q = HK_TEST[HK_PT.i], order = HK_PT.order[HK_PT.i], picked = HK_PT.picked!==null;
      const sentence = esc(q.q).replace("___", '<b style="border-bottom:3px solid var(--hi,#d4af37);padding:0 14px">&nbsp;&nbsp;&nbsp;</b>');
      body = '<div class="panel" '+box+'><div style="opacity:.75">Vraag '+(HK_PT.i+1)+' van '+HK_TEST.length+'</div>'
        + '<div style="font-size:24px;margin:12px 0">'+sentence+'</div>'
        + (q.en ? '<div style="font-size:13px;opacity:.7;margin-bottom:6px">'+esc(q.en)+'</div>' : '')
        + order.map(k=>{ const ok = k===q.a, sel = HK_PT.picked===k;
            return '<button class="btn '+(picked&&ok?"btn-gold":"")+'" '+(picked?"disabled":"")+' style="'+btn+';'+(picked&&sel&&!ok?"opacity:.55;text-decoration:line-through":"")+'" onclick="hkPtPick('+k+')">'+esc(q.o[k])+'</button>'; }).join("")
        + (picked ? '<button class="btn btn-gold" style="'+btn+';margin-top:10px" onclick="hkPtNext()">'+(HK_PT.i>=HK_TEST.length-1?"Uitslag":"Volgende")+'</button>' : '') + '</div>';
    }
    H(brand()+'<div data-hk-keep>'+body+'</div>'+foot());
  };

  // Menu ☰ → Instellingen → Niveau
  window.hkSetLevelUI = function(l){ hkSetLevel(l); castraMenuRender(); };
  function hkLevelHTML(){
    const L = hkLevel(), st = hkStats(), last = (st[L]||[]).slice(-5);
    const info = {
      A1:["A1 — beginner","Korte zinnen en woorden voor elke dag.","Short sentences and everyday words."],
      A2:["A2 — basis","Verleden tijd, omdat/want, meer woorden. Dit is meestal het niveau van het inburgeringsexamen voor een verblijfsvergunning of naturalisatie; vraag bij de IND na wat voor jou geldt.","Past tense, omdat/want, more words. This is usually the level of the civic integration exam; ask the IND what applies to you."],
      B1:["B1 — zelfstandig","Bijzinnen en woorden over werk, wonen en de overheid. Jouw einddoel.","Subordinate clauses and words about work, housing and government. Your goal."]
    };
    const b = l => '<button class="btn '+(L===l?"btn-gold":"")+'" style="display:block;width:100%;margin:5px 0;min-height:56px;text-align:left" data-l="'+l+'" onclick="hkSetLevelUI(this.dataset.l)">'+(L===l?"● ":"○ ")+info[l][0]+'<br><small style="opacity:.85">'+info[l][1]+'<br><span style="opacity:.8">'+info[l][2]+'</span></small></button>';
    return '<div data-hk-keep><h3 style="margin:0 0 6px">Niveau <small>your Dutch level</small></h3>'
      + '<div style="font-size:14px;margin-bottom:6px">Je oefent nu op niveau <b>'+L+'</b>. Haal je 5 rondes achter elkaar gemiddeld 85% of meer, dan ga je vanzelf een niveau omhoog.<br><small style="opacity:.8">Your exercises use this level. Score 85% or more over 5 rounds in a row and you move up automatically.</small></div>'
      + (last.length ? '<div style="font-size:13px;margin-bottom:6px">Laatste rondes: <b>'+last.map(x=>x+"%").join(" · ")+'</b></div>' : '')
      + HK_LV.map(b).join("")
      + '<button class="btn" style="display:block;width:100%;margin:8px 0;min-height:48px" onclick="hkPlaceOpen()">Doe de niveautest <small>take the level test</small></button></div>';
  }
  CASTRA_MENU_ITEMS.push({ id:"niveau", la:"Niveau", nl:"your Dutch level" });
  CASTRA_MENU_ICON.niveau = "📶";
  { const i = CASTRA_MENU_SYS.indexOf("engels"); CASTRA_MENU_SYS.splice(i<0 ? CASTRA_MENU_SYS.length : i+1, 0, "niveau"); }
  { const mv2 = window.castraMenuView; window.castraMenuView = function(id){ return id==="niveau" ? hkLevelHTML() : mv2.apply(this, arguments); }; }

  /* ---- Leeshoek: korte teksten per niveau, elk woord tikbaar, elke zin met vertaling (ⓘ), drie begripsvragen ---- */
  const HK_LEZEN = /*HK_LEZEN*/{};
  let HK_RD = { mode:"list" };
  const hkRdDone = () => { try{ return JSON.parse(localStorage.getItem("readDone") || "{}"); }catch(e){ return {}; } };
  window.hkRdList = function(){ HK_RD = { mode:"list" }; castraMenuRender(); };
  window.hkRdOpen = function(i){ const t = (HK_LEZEN[hkLevel()]||[])[i]; if(!t) return; HK_RD = { mode:"text", t }; castraMenuRender(); };
  window.hkRdQuiz = function(){
    const t = HK_RD.t; if(!t) return;
    HK_RD = { mode:"quiz", t, qi:0, picked:null, score:0, showText:false, order:t.q.map(q=>q.o.map((_,k)=>k).sort(()=>Math.random()-0.5)) };
    castraMenuRender();
  };
  window.hkRdToggle = function(){ HK_RD.showText = !HK_RD.showText; castraMenuRender(); };
  window.hkRdPick = function(k){
    const R = HK_RD; if(R.mode!=="quiz" || R.picked!==null) return;
    R.picked = k; if(k===R.t.q[R.qi].a) R.score++; castraMenuRender();
  };
  window.hkRdNext = function(){
    const R = HK_RD;
    if(R.qi >= R.t.q.length-1){
      R.mode = "done"; R.xp = 0;
      const L = hkLevel(), w = CASTRA.wday || (CASTRA.wday = {}), key = "lezen_"+R.t.id;
      if(R.score >= 2 && w[key]!==castraWDay()){ w[key] = castraWDay(); R.xp = ({A1:3,A2:4,B1:5}[L]||3) * R.score; castraPxpAdd(R.xp, "Gelezen"); }
      hkRecord(R.score, R.t.q.length);
      const d = hkRdDone(); d[R.t.id] = Math.max(d[R.t.id]||0, R.score); try{ localStorage.setItem("readDone", JSON.stringify(d)); }catch(e){}
    } else { R.qi++; R.picked = null; }
    castraMenuRender();
  };
  function hkRdText(t){ return '<div style="font-size:16px;line-height:1.9;margin:6px 0">' + t.s.map((s,i)=>castraLaHTML(s[0], s[1], "lezen_"+t.id+"_"+i)).join(" ") + '</div>'; }
  function hkLezenHTML(){
    const R = HK_RD, btn = "min-height:46px", L = hkLevel(), list = HK_LEZEN[L] || [];
    let body;
    if(R.mode==="text"){
      body = '<h3 style="margin:0 0 4px">'+esc(R.t.t)+' <small>'+L+'</small></h3>'
        + '<div style="font-size:13px;opacity:.8">Tik op een woord voor de betekenis, op ⓘ voor de vertaling van de zin.<br><small>Tap a word for its meaning, ⓘ for the translation of the sentence.</small></div>'
        + hkRdText(R.t)
        + '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px"><button class="btn btn-gold" style="'+btn+'" onclick="hkRdQuiz()">Naar de vragen <small>to the questions</small></button><button class="btn" style="'+btn+'" onclick="hkRdList()">Terug</button></div>';
    } else if(R.mode==="quiz"){
      const q = R.t.q[R.qi], order = R.order[R.qi], picked = R.picked!==null;
      body = '<h3 style="margin:0 0 4px">'+esc(R.t.t)+'</h3><div style="opacity:.8">Vraag '+(R.qi+1)+' van '+R.t.q.length+'</div>'
        + '<div style="font-size:20px;margin:8px 0 2px">'+esc(q.q)+'</div>' + (q.qen ? '<div class="hk-en" style="font-size:12px;opacity:.75;margin-bottom:6px">'+esc(q.qen)+'</div>' : '')
        + order.map(k=>{ const ok = k===q.a, sel = R.picked===k;
            return '<button class="btn '+(picked&&ok?"btn-gold":"")+'" '+(picked?"disabled":"")+' style="display:block;width:100%;margin:5px 0;min-height:48px;font-size:16px;'+(picked&&sel&&!ok?"opacity:.55;text-decoration:line-through":"")+'" onclick="hkRdPick('+k+')">'+esc(q.o[k])+'</button>'; }).join("")
        + '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:6px">'
        + (picked ? '<button class="btn btn-gold" style="'+btn+'" onclick="hkRdNext()">'+(R.qi>=R.t.q.length-1?"Uitslag":"Volgende")+'</button>' : '')
        + '<button class="btn" style="'+btn+'" onclick="hkRdToggle()">'+(R.showText?"Verberg de tekst":"📄 Lees de tekst opnieuw")+'</button></div>'
        + (R.showText ? hkRdText(R.t) : '');
    } else if(R.mode==="done"){
      body = '<h3 style="margin:0 0 6px">'+esc(R.t.t)+'</h3><div style="font-size:20px">Score: <b>'+R.score+' / '+R.t.q.length+'</b></div>'
        + (R.xp ? '<div class="note">🎖️ +'+R.xp+' XP (eenmaal per dag per tekst) <small>· XP once a day per text</small></div>' : '<div class="note">'+(R.score>=2 ? "Deze tekst gaf vandaag al XP." : "Minstens 2 goed voor XP.")+'<br><small>'+(R.score>=2 ? "This text already gave XP today." : "At least 2 correct for XP.")+'</small></div>')
        + '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px"><button class="btn btn-gold" style="'+btn+'" onclick="hkRdOpen('+list.findIndex(x=>x.id===R.t.id)+')">Lees opnieuw</button><button class="btn" style="'+btn+'" onclick="hkRdList()">Andere tekst</button></div>';
    } else {
      const d = hkRdDone();
      body = '<h3 style="margin:0 0 6px">Leeshoek <small>reading corner</small></h3>'
        + '<div style="font-size:14px;margin-bottom:6px">Lees een korte tekst en beantwoord drie vragen. Teksten op niveau <b>'+L+'</b> (verander je niveau onder Instellingen → Niveau).<br><small style="opacity:.8">Read a short text and answer three questions. Texts at level '+L+'.</small></div>'
        + list.map((t,i)=>'<button class="btn" style="display:block;width:100%;margin:5px 0;min-height:52px;text-align:left" onclick="hkRdOpen('+i+')">'+(d[t.id]!==undefined ? (d[t.id]>=3?"✅ ":"☑️ ") : "📰 ")+esc(t.t)+' <small style="opacity:.7">'+t.s.length+' zinnen'+(d[t.id]!==undefined?" · beste: "+d[t.id]+"/3":"")+'</small></button>').join("");
    }
    return '<div data-hk-keep>'+body+'</div>';
  }
  CASTRA_MENU_ITEMS.push({ id:"lezen", la:"Leeshoek", nl:"read short texts" });
  CASTRA_MENU_ICON.lezen = "📰";
  { const mv3 = window.castraMenuView; window.castraMenuView = function(id){ return id==="lezen" ? hkLezenHTML() : mv3.apply(this, arguments); }; }
  { const pick3 = window.castraMenuPick; window.castraMenuPick = function(id){ if(id==="lezen") HK_RD = { mode:"list" }; return pick3.apply(this, arguments); }; }

  /* ---- Luisterhoek: korte teksten die het apparaat voorleest (Web Speech API, Nederlandse stem), daarna begripsvragen ----
     Heeft het apparaat geen Nederlandse stem, dan kun je de tekst lezen ("toon tekst"): het wordt dan een leesoefening zonder XP. */
  const HK_LUISTER = /*HK_LUISTER*/{};
  let HK_LI = { mode:"list" };
  const hkSynth = () => (typeof speechSynthesis!=="undefined" && typeof SpeechSynthesisUtterance!=="undefined") ? speechSynthesis : null;
  const hkNlVoice = () => { const s = hkSynth(); if(!s) return null; const v = s.getVoices() || []; return v.find(x=>/^nl[-_]nl/i.test(x.lang)) || v.find(x=>/^nl/i.test(x.lang)) || null; };
  if(hkSynth() && hkSynth().addEventListener) hkSynth().addEventListener("voiceschanged", ()=>{ if(CASTRA_MENU && CASTRA_MENU.open && CASTRA_MENU.view==="luisteren") castraMenuRender(); });
  window.hkLiStop = function(){ const s = hkSynth(); if(s) s.cancel(); };
  window.hkLiPlay = function(slow){
    const s = hkSynth(), v = hkNlVoice(), t = HK_LI.t; if(!s || !v || !t) return;
    s.cancel();
    const base = ({A1:0.82, A2:0.92, B1:1.0}[hkLevel()] || 0.9) * (slow ? 0.75 : 1);
    t.s.forEach(sen=>{ const u = new SpeechSynthesisUtterance(sen[0]); u.voice = v; u.lang = v.lang || "nl-NL"; u.rate = base; s.speak(u); });
    HK_LI.plays = (HK_LI.plays||0) + 1; castraMenuRender();
  };
  window.hkLiList = function(){ hkLiStop(); HK_LI = { mode:"list" }; castraMenuRender(); };
  window.hkLiOpen = function(i){ const t = (HK_LUISTER[hkLevel()]||[])[i]; if(!t) return; hkLiStop(); HK_LI = { mode:"play", t, plays:0, peek:false }; castraMenuRender(); };
  window.hkLiPeek = function(){ HK_LI.peek = !HK_LI.peek; castraMenuRender(); };
  window.hkLiQuiz = function(){
    const t = HK_LI.t; if(!t) return; hkLiStop();
    HK_LI = { mode:"quiz", t, plays:HK_LI.plays||0, peek:HK_LI.peek, qi:0, picked:null, score:0, order:t.q.map(q=>q.o.map((_,k)=>k).sort(()=>Math.random()-0.5)) };
    castraMenuRender();
  };
  window.hkLiPick = function(k){ const R = HK_LI; if(R.mode!=="quiz" || R.picked!==null) return; R.picked = k; if(k===R.t.q[R.qi].a) R.score++; castraMenuRender(); };
  window.hkLiNext = function(){
    const R = HK_LI;
    if(R.qi >= R.t.q.length-1){
      R.mode = "done"; R.xp = 0;
      if(!R.peek){
        const L = hkLevel(), w = CASTRA.wday || (CASTRA.wday = {}), key = "luister_"+R.t.id;
        if(R.score >= 2 && w[key]!==castraWDay()){ w[key] = castraWDay(); R.xp = ({A1:3,A2:4,B1:5}[L]||3) * R.score; castraPxpAdd(R.xp, "Geluisterd"); }
        hkRecord(R.score, R.t.q.length);
        const d = hkLiDone(); d[R.t.id] = Math.max(d[R.t.id]||0, R.score); try{ localStorage.setItem("listenDone", JSON.stringify(d)); }catch(e){}
      }
    } else { R.qi++; R.picked = null; }
    castraMenuRender();
  };
  const hkLiDone = () => { try{ return JSON.parse(localStorage.getItem("listenDone") || "{}"); }catch(e){ return {}; } };
  function hkLiControls(){
    const ok = !!hkNlVoice(), btn = "min-height:50px;font-size:17px;margin:3px";
    if(!hkSynth() || !ok) return '<div class="note">Dit apparaat heeft geen Nederlandse stem. Kies "Toon de tekst" om de tekst te lezen (dan telt het niet voor XP).<br><small>This device has no Dutch voice. Choose "Show the text" to read it instead (no XP then).</small></div>';
    return '<div style="margin:8px 0"><button class="btn btn-gold" style="'+btn+'" onclick="hkLiPlay(false)">▶ Luister</button><button class="btn" style="'+btn+'" onclick="hkLiPlay(true)">🐢 Langzaam</button><button class="btn" style="'+btn+'" onclick="hkLiStop()">⏹ Stop</button> <small style="opacity:.7">'+(HK_LI.plays||0)+'×</small></div>';
  }
  function hkLiText(t){ return '<div style="font-size:16px;line-height:1.9;margin:6px 0">' + t.s.map((s,i)=>castraLaHTML(s[0], s[1], "luister_"+t.id+"_"+i)).join(" ") + '</div>'; }
  function hkLuisterHTML(){
    const R = HK_LI, btn = "min-height:46px", L = hkLevel(), list = HK_LUISTER[L] || [];
    let body;
    if(R.mode==="play"){
      body = '<h3 style="margin:0 0 4px">🎧 '+esc(R.t.t)+' <small>'+L+'</small></h3>'
        + '<div style="font-size:13px;opacity:.8">Luister één of twee keer en beantwoord dan de vragen.<br><small>Listen once or twice, then answer the questions.</small></div>'
        + hkLiControls()
        + '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:6px"><button class="btn btn-gold" style="'+btn+'" onclick="hkLiQuiz()">Naar de vragen <small>to the questions</small></button><button class="btn" style="'+btn+'" onclick="hkLiPeek()">'+(R.peek?"Verberg de tekst":"📄 Toon de tekst")+'</button><button class="btn" style="'+btn+'" onclick="hkLiList()">Terug</button></div>'
        + (R.peek ? '<div style="margin-top:6px">'+hkLiText(R.t)+'</div>' : '');
    } else if(R.mode==="quiz"){
      const q = R.t.q[R.qi], order = R.order[R.qi], picked = R.picked!==null;
      body = '<h3 style="margin:0 0 4px">🎧 '+esc(R.t.t)+'</h3><div style="opacity:.8">Vraag '+(R.qi+1)+' van '+R.t.q.length+'</div>'
        + '<div style="font-size:20px;margin:8px 0 2px">'+esc(q.q)+'</div>' + (q.qen ? '<div class="hk-en" style="font-size:12px;opacity:.75;margin-bottom:6px">'+esc(q.qen)+'</div>' : '')
        + order.map(k=>{ const ok = k===q.a, sel = R.picked===k;
            return '<button class="btn '+(picked&&ok?"btn-gold":"")+'" '+(picked?"disabled":"")+' style="display:block;width:100%;margin:5px 0;min-height:48px;font-size:16px;'+(picked&&sel&&!ok?"opacity:.55;text-decoration:line-through":"")+'" onclick="hkLiPick('+k+')">'+esc(q.o[k])+'</button>'; }).join("")
        + hkLiControls()
        + (picked ? '<button class="btn btn-gold" style="'+btn+'" onclick="hkLiNext()">'+(R.qi>=R.t.q.length-1?"Uitslag":"Volgende")+'</button>' : '')
        + (R.peek ? hkLiText(R.t) : '');
    } else if(R.mode==="done"){
      body = '<h3 style="margin:0 0 6px">🎧 '+esc(R.t.t)+'</h3><div style="font-size:20px">Score: <b>'+R.score+' / '+R.t.q.length+'</b></div>'
        + (R.peek ? '<div class="note">Je las de tekst, dus geen XP. <small>You read the text, so no XP.</small></div>'
          : (R.xp ? '<div class="note">🎖️ +'+R.xp+' XP (eenmaal per dag per tekst) <small>· XP once a day per text</small></div>' : '<div class="note">'+(R.score>=2 ? "Deze tekst gaf vandaag al XP." : "Minstens 2 goed voor XP.")+'</div>'))
        + '<div style="font-size:13px;opacity:.8;margin-top:6px">De tekst, om na te lezen (tik op woorden):<br><small>The text, to read afterwards (tap words):</small></div>' + hkLiText(R.t)
        + '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px"><button class="btn btn-gold" style="'+btn+'" onclick="hkLiOpen('+list.findIndex(x=>x.id===R.t.id)+')">Nog eens luisteren</button><button class="btn" style="'+btn+'" onclick="hkLiList()">Andere tekst</button></div>';
    } else {
      const d = hkLiDone();
      body = '<h3 style="margin:0 0 6px">🎧 Luisterhoek <small>listening corner</small></h3>'
        + '<div style="font-size:14px;margin-bottom:6px">Luister naar een korte tekst en beantwoord drie vragen. Niveau <b>'+L+'</b>.<br><small style="opacity:.8">Listen to a short text and answer three questions. Level '+L+'. The voice comes from your device.</small></div>'
        + (hkNlVoice() ? '' : '<div class="note">Dit apparaat heeft (nog) geen Nederlandse stem; je kunt de teksten wel lezen. <small>No Dutch voice found on this device.</small></div>')
        + list.map((t,i)=>'<button class="btn" style="display:block;width:100%;margin:5px 0;min-height:52px;text-align:left" onclick="hkLiOpen('+i+')">'+(d[t.id]!==undefined ? (d[t.id]>=3?"✅ ":"☑️ ") : "🎧 ")+esc(t.t)+' <small style="opacity:.7">'+(d[t.id]!==undefined?"beste: "+d[t.id]+"/3":"")+'</small></button>').join("");
    }
    return '<div data-hk-keep>'+body+'</div>';
  }
  CASTRA_MENU_ITEMS.push({ id:"luisteren", la:"Luisterhoek", nl:"listen to short texts" });
  CASTRA_MENU_ICON.luisteren = "🎧";
  { const mv4 = window.castraMenuView; window.castraMenuView = function(id){ return id==="luisteren" ? hkLuisterHTML() : mv4.apply(this, arguments); }; }
  { const pick4 = window.castraMenuPick; window.castraMenuPick = function(id){ hkLiStop(); if(id==="luisteren") HK_LI = { mode:"list" }; return pick4.apply(this, arguments); }; }

  /* ---- Schrijfhoek: schrijfopdrachten per niveau met automatische controle op kenmerken + voorbeeldtekst + zelfcontrole ----
     De app kan geen grammatica beoordelen: ze controleert aanhef, afsluiting, lengte, verplichte onderdelen en leestekens. */
  const HK_SCHRIJF = /*HK_SCHRIJF*/{};
  let HK_WR = { mode:"list" };
  const hkWrDone = () => { try{ return JSON.parse(localStorage.getItem("writeDone") || "{}"); }catch(e){ return {}; } };
  const hkWrCount = s => (String(s).trim().match(/[\p{L}\p{N}'’-]+/gu) || []).length;
  window.hkWrInput = function(ta){
    const t = HK_WR.t; if(!t) return;
    const n = hkWrCount(ta.value), c = document.getElementById("hkWrCount");
    if(c) c.textContent = n + " / " + t.min + " woorden";
    HK_WR.text = ta.value; try{ localStorage.setItem("writeDraft_"+t.id, ta.value); }catch(e){}
  };
  window.hkWrList = function(){ HK_WR = { mode:"list" }; castraMenuRender(); };
  window.hkWrOpen = function(i){
    const t = (HK_SCHRIJF[hkLevel()]||[])[i]; if(!t) return;
    let draft = ""; try{ draft = localStorage.getItem("writeDraft_"+t.id) || ""; }catch(e){}
    HK_WR = { mode:"task", t, text:draft }; castraMenuRender();
  };
  window.hkWrBack = function(){ HK_WR.mode = "task"; castraMenuRender(); };
  window.hkWrCheck = function(){
    const ta = document.getElementById("hkWrText"), t = HK_WR.t; if(!ta || !t) return;
    const text = ta.value; HK_WR.text = text; try{ localStorage.setItem("writeDraft_"+t.id, text); }catch(e){}
    const res = [], n = hkWrCount(text);
    res.push({ ok:n >= t.min, l:"Je tekst is lang genoeg: minstens "+t.min+" woorden (nu "+n+")", e:"Long enough: at least "+t.min+" words" });
    const sens = text.split(/(?<=[.!?])\s+|\n+/).map(s=>s.trim()).filter(Boolean).filter(s=>hkWrCount(s) > 3 && !(hkWrCount(s) <= 6 && /,$/.test(s)));   // aanhef ("Geachte heer De Vries,") en korte regels tellen niet mee
    const netjes = sens.length > 0 && sens.every((s,k)=>/^[A-ZÀ-Ý"'(]/.test(s) && (/[.!?)"']$/.test(s) || (k===sens.length-1 && hkWrCount(s) <= 8)));   // de afsluiting ("Met vriendelijke groet, Tom") hoeft geen punt
    res.push({ ok:netjes, l:"Elke zin begint met een hoofdletter en eindigt met een leesteken", e:"Each sentence starts with a capital and ends with punctuation" });
    t.checks.forEach(c=>{ let ok = false; try{ ok = new RegExp(c.re, "i").test(text); }catch(e){} res.push({ ok, l:c.l, e:c.e }); });
    const passed = res.filter(r=>r.ok).length;
    HK_WR.mode = "result"; HK_WR.res = res; HK_WR.passed = passed; HK_WR.xp = 0;
    if(n >= Math.min(8, t.min)){
      const L = hkLevel(), w = CASTRA.wday || (CASTRA.wday = {}), key = "schrijf_"+t.id;
      if(passed === res.length && w[key]!==castraWDay()){ w[key] = castraWDay(); HK_WR.xp = ({A1:6,A2:8,B1:10}[L]||6); castraPxpAdd(HK_WR.xp, "Geschreven"); }
      hkRecord(passed, res.length);
      const d = hkWrDone(); d[t.id] = Math.max(d[t.id]||0, Math.round(100*passed/res.length)); try{ localStorage.setItem("writeDone", JSON.stringify(d)); }catch(e){}
    }
    castraMenuRender();
  };
  function hkWrModel(t){ return '<div style="font-size:16px;line-height:1.9;margin:6px 0;padding:8px;border:1px dashed rgba(120,80,20,.5);border-radius:8px">' + t.model.map((s,i)=>castraLaHTML(s[0], s[1], "schrijf_"+t.id+"_"+i)).join(" ") + '</div>'; }
  function hkSchrijfHTML(){
    const R = HK_WR, btn = "min-height:46px", L = hkLevel(), list = HK_SCHRIJF[L] || [];
    let body;
    if(R.mode==="task"){
      const t = R.t;
      body = '<h3 style="margin:0 0 4px">✍️ '+esc(t.t)+' <small>'+L+'</small></h3>'
        + '<div style="font-size:15px;margin:6px 0">'+esc(t.opdracht)+'</div><div class="hk-en" style="font-size:12px;opacity:.75;margin-bottom:6px">'+esc(t.en)+'</div>'
        + '<textarea id="hkWrText" rows="9" oninput="hkWrInput(this)" onkeydown="event.stopPropagation()" onkeyup="event.stopPropagation()" autocapitalize="sentences" spellcheck="true" lang="nl" placeholder="Schrijf hier je tekst… / Write your text here…" style="width:100%;box-sizing:border-box;font-size:17px;padding:8px;border:2px solid var(--parch-edge,#4a3416);border-radius:8px;background:#fffdf5;color:#2b1d0e;font-family:inherit">'+esc(R.text||"")+'</textarea>'
        + '<div style="font-size:13px;opacity:.8;margin:4px 0"><span id="hkWrCount">'+hkWrCount(R.text||"")+' / '+t.min+' woorden</span></div>'
        + '<div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn btn-gold" style="'+btn+'" onclick="hkWrCheck()">Controleer <small>check</small></button><button class="btn" style="'+btn+'" onclick="hkWrList()">Terug</button></div>';
    } else if(R.mode==="result"){
      const t = R.t;
      body = '<h3 style="margin:0 0 4px">✍️ '+esc(t.t)+'</h3><div style="font-size:18px">Controle: <b>'+R.passed+' van '+R.res.length+'</b></div>'
        + (R.xp ? '<div class="note">🎖️ +'+R.xp+' XP (alles goed, eenmaal per dag) <small>· all checks passed, once a day</small></div>' : '')
        + R.res.map(r=>'<div style="'+CASTRA_MV_ROW+'"><span style="width:24px">'+(r.ok?"✅":"❌")+'</span><span style="flex:1">'+esc(r.l)+'<br><small class="hk-en" style="opacity:.7">'+esc(r.e)+'</small></span></div>').join("")
        + '<div style="margin-top:10px"><b>Kijk zelf ook na</b> <small>check yourself too</small></div>'
        + '<ul style="margin:4px 0 8px 18px;padding:0;font-size:14px">'+t.eigen.map(x=>'<li>'+esc(x)+'</li>').join("")+'</ul>'
        + '<div><b>Voorbeeld</b> <small>(tik op woorden en ⓘ) · example</small></div>' + hkWrModel(t)
        + '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:6px"><button class="btn btn-gold" style="'+btn+'" onclick="hkWrBack()">Verbeter mijn tekst</button><button class="btn" style="'+btn+'" onclick="hkWrList()">Andere opdracht</button></div>'
        + '<div style="font-size:12px;opacity:.7;margin-top:8px">De controle kijkt alleen naar kenmerken (aanhef, afsluiting, onderdelen, lengte). Spelling en grammatica moet je zelf of met een docent nakijken.<br><small>The check only looks at features, not grammar or spelling.</small></div>';
    } else {
      const d = hkWrDone();
      body = '<h3 style="margin:0 0 6px">✍️ Schrijfhoek <small>writing corner</small></h3>'
        + '<div style="font-size:14px;margin-bottom:6px">Schrijf een korte tekst. Je krijgt een controle op kenmerken en een voorbeeld. Niveau <b>'+L+'</b>.<br><small style="opacity:.8">Write a short text. You get a feature check and a model answer. Level '+L+'.</small></div>'
        + list.map((t,i)=>'<button class="btn" style="display:block;width:100%;margin:5px 0;min-height:52px;text-align:left" onclick="hkWrOpen('+i+')">'+(d[t.id]!==undefined ? (d[t.id]>=100?"✅ ":"☑️ ") : "✍️ ")+esc(t.t)+' <small style="opacity:.7">'+(d[t.id]!==undefined?"beste: "+d[t.id]+"%":"")+'</small></button>').join("");
    }
    return '<div data-hk-keep>'+body+'</div>';
  }
  CASTRA_MENU_ITEMS.push({ id:"schrijven", la:"Schrijfhoek", nl:"write short texts" });
  CASTRA_MENU_ICON.schrijven = "✍️";
  { const mv5 = window.castraMenuView; window.castraMenuView = function(id){ return id==="schrijven" ? hkSchrijfHTML() : mv5.apply(this, arguments); }; }
  { const pick5 = window.castraMenuPick; window.castraMenuPick = function(id){ if(id==="schrijven") HK_WR = { mode:"list" }; return pick5.apply(this, arguments); }; }

  /* ---- Oefenhoek: Nederland (KNM), woordvolgorde en "Wat zeg je?" — meerkeuzeoefeningen per niveau met uitleg ---- */
  const HK_OEF = { knm:/*HK_KNM*/{}, volgorde:/*HK_VOLGORDE*/{}, gesprek:/*HK_GESPREK*/{} };
  const HK_OEF_MODES = [
    { id:"knm", icon:"🇳🇱", t:"Nederland (KNM)", en:"Knowing the Netherlands", d:"Vragen over wonen, werken, zorg en de overheid. Regels kunnen veranderen: controleer belangrijke zaken op rijksoverheid.nl.", de:"Questions about living, working, healthcare and government. Rules can change: check important matters on rijksoverheid.nl." },
    { id:"volgorde", icon:"🔀", t:"Woordvolgorde", en:"Word order", d:"Kies de zin met de juiste woordvolgorde.", de:"Choose the sentence with the correct word order." },
    { id:"gesprek", icon:"💬", t:"Wat zeg je?", en:"What do you say?", d:"Kies wat je in deze situatie het beste kunt zeggen.", de:"Choose what to say in this situation." }
  ];
  let HK_OF = { mode:"hub" };
  const hkOfTotal = () => { try{ return JSON.parse(localStorage.getItem("oefenDone") || "{}"); }catch(e){ return {}; } };
  window.hkOfHub = function(){ HK_OF = { mode:"hub" }; castraMenuRender(); };
  window.hkOfStart = function(kind){
    const L = hkLevel(), i = HK_LV.indexOf(L), map = HK_OEF[kind] || {};
    const pool = (map[L]||[]).concat(map[L]||[], i>0 ? (map[HK_LV[i-1]]||[]) : []).sort(()=>Math.random()-0.5);
    const seen = new Set(), items = pool.filter(x=>{ if(seen.has(x.q+x.o[0])) return false; seen.add(x.q+x.o[0]); return true; }).slice(0,5);
    if(!items.length){ HK_OF = { mode:"hub" }; castraMenuRender(); return; }
    HK_OF = { mode:"quiz", kind, items, qi:0, picked:null, score:0, order:items.map(q=>q.o.map((_,k)=>k).sort(()=>Math.random()-0.5)) };
    castraMenuRender();
  };
  window.hkOfPick = function(k){ const R = HK_OF; if(R.mode!=="quiz" || R.picked!==null) return; R.picked = k; if(k===R.items[R.qi].a) R.score++; castraMenuRender(); };
  window.hkOfNext = function(){
    const R = HK_OF;
    if(R.qi >= R.items.length-1){
      R.mode = "done"; R.xp = 0;
      const L = hkLevel(), w = CASTRA.wday || (CASTRA.wday = {}), key = "oefen_"+R.kind;
      if(R.score >= 3 && w[key]!==castraWDay()){ w[key] = castraWDay(); R.xp = ({A1:3,A2:4,B1:5}[L]||3) * R.score; castraPxpAdd(R.xp, "Geoefend"); }
      hkRecord(R.score, R.items.length);
      const d = hkOfTotal(); d[R.kind] = (d[R.kind]||0) + 1; try{ localStorage.setItem("oefenDone", JSON.stringify(d)); }catch(e){}
    } else { R.qi++; R.picked = null; }
    castraMenuRender();
  };
  function hkOefenHTML(){
    const R = HK_OF, btn = "min-height:46px", L = hkLevel();
    let body;
    if(R.mode==="quiz"){
      const m = HK_OEF_MODES.find(x=>x.id===R.kind), q = R.items[R.qi], order = R.order[R.qi], picked = R.picked!==null;
      body = '<h3 style="margin:0 0 4px">'+m.icon+' '+esc(m.t)+' <small>'+L+'</small></h3><div style="opacity:.8">Vraag '+(R.qi+1)+' van '+R.items.length+'</div>'
        + '<div style="font-size:19px;margin:8px 0 2px">'+esc(q.q)+'</div>' + (q.qen ? '<div class="hk-en" style="font-size:12px;opacity:.75;margin-bottom:6px">'+esc(q.qen)+'</div>' : '')
        + order.map(k=>{ const ok = k===q.a, sel = R.picked===k;
            return '<button class="btn '+(picked&&ok?"btn-gold":"")+'" '+(picked?"disabled":"")+' style="display:block;width:100%;margin:5px 0;min-height:48px;font-size:16px;text-align:left;'+(picked&&sel&&!ok?"opacity:.55;text-decoration:line-through":"")+'" onclick="hkOfPick('+k+')">'+esc(q.o[k])+'</button>'; }).join("")
        + (picked ? '<div class="note" style="margin-top:6px">'+(R.picked===q.a?"✔ ":"✘ ")+esc(q.u)+'<br><small style="opacity:.8">'+esc(q.e)+'</small></div><button class="btn btn-gold" style="'+btn+';margin-top:6px" onclick="hkOfNext()">'+(R.qi>=R.items.length-1?"Uitslag":"Volgende")+'</button>' : '');
    } else if(R.mode==="done"){
      const m = HK_OEF_MODES.find(x=>x.id===R.kind);
      body = '<h3 style="margin:0 0 6px">'+m.icon+' '+esc(m.t)+'</h3><div style="font-size:20px">Score: <b>'+R.score+' / '+R.items.length+'</b></div>'
        + (R.xp ? '<div class="note">🎖️ +'+R.xp+' XP (eenmaal per dag) <small>· XP once a day</small></div>' : '<div class="note">'+(R.score>=3 ? "Vandaag al XP gekregen voor dit onderdeel." : "Minstens 3 goed voor XP.")+'</div>')
        + '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px"><button class="btn btn-gold" style="'+btn+'" onclick="hkOfStart(\''+R.kind+'\')">Nog een ronde</button><button class="btn" style="'+btn+'" onclick="hkOfHub()">Andere oefening</button></div>';
    } else {
      const d = hkOfTotal();
      body = '<h3 style="margin:0 0 6px">🧩 Oefenhoek <small>practice corner</small></h3>'
        + '<div style="font-size:14px;margin-bottom:6px">Kies een oefening. Niveau <b>'+L+'</b>.<br><small style="opacity:.8">Choose an exercise. Level '+L+'.</small></div>'
        + HK_OEF_MODES.map(m=>'<button class="btn" style="display:block;width:100%;margin:6px 0;min-height:64px;text-align:left" data-k="'+m.id+'" onclick="hkOfStart(this.dataset.k)">'+m.icon+' <b>'+esc(m.t)+'</b> <small>'+esc(m.en)+'</small><br><small style="opacity:.8">'+esc(m.d)+'</small><br><small style="opacity:.65">'+esc(m.de)+'</small>'+(d[m.id] ? '<br><small style="opacity:.6">'+d[m.id]+' rondes gedaan</small>' : '')+'</button>').join("");
    }
    return '<div data-hk-keep>'+body+'</div>';
  }
  CASTRA_MENU_ITEMS.push({ id:"oefenen", la:"Oefenhoek", nl:"more exercises" });
  CASTRA_MENU_ICON.oefenen = "🧩";
  { const mv6 = window.castraMenuView; window.castraMenuView = function(id){ return id==="oefenen" ? hkOefenHTML() : mv6.apply(this, arguments); }; }
  { const pick6 = window.castraMenuPick; window.castraMenuPick = function(id){ if(id==="oefenen") HK_OF = { mode:"hub" }; return pick6.apply(this, arguments); }; }

  // Heldenkamp heeft geen docentoverzicht en geen Firebase: opzoekingen blijven lokaal in CASTRA.help.
  window.castraHelpSync = function(){};
})();
