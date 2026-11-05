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
  { const i = CASTRA_MENU_SYS.indexOf("exeo"); if(i >= 0) CASTRA_MENU_SYS.splice(i, 1); }
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

  // Heldenkamp heeft geen docentoverzicht en geen Firebase: opzoekingen blijven lokaal in CASTRA.help.
  window.castraHelpSync = function(){};
})();
