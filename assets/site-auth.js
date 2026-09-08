/* ============================================================================
   SITE-AUTH — gedeelde leerling-/docent-inlog en score-sync voor de hele site
   © Gerben de Jong · 2026

   Eén klein script, door élke app (en het hoofdmenu) met een simpele
   <script src="…/assets/site-auth.js"> in te sluiten. Geen build-stap, geen
   module-syntax — consistent met de rest van de site.

   Hergebruikt bewust dezelfde leerling-identiteit als Certamen/Battle Mode:
   localStorage-sleutel "certamen_battle_identity" en Firebase-node
   identities/{klas}/{lid} (zie certamen/battle.js, certamen/net.js). Wie al
   een Battle Mode-profiel heeft is dus meteen "ingelogd" op de hele site, en
   wie hier voor het eerst inlogt krijgt automatisch ook een Battle Mode-
   profiel. Docent-inlog hergebruikt dezelfde teachers/{uid}-tak via Firebase
   Auth (e-mail/wachtwoord) — zelfde patroon als certamen/net.js, hier
   zelfstandig herhaald omdat net.js te veel aan de rest van Certamen hangt
   om los in te sluiten.

   FIREBASE_CONFIG hieronder moet gelijk blijven aan de kopie in
   certamen/index.html — zie CLAUDE.md, sectie "Firebase-rules".
   ============================================================================ */
(function(global){
  "use strict";

  const FIREBASE_CONFIG = {
    apiKey: "AIzaSyC1P5vws3RKt2Dl9Nnfz8OCPV2KRS55w_U",
    authDomain: "kthulp-certamen.firebaseapp.com",
    databaseURL: "https://kthulp-certamen-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "kthulp-certamen",
    storageBucket: "kthulp-certamen.firebasestorage.app",
    messagingSenderId: "16556837470",
    appId: "1:16556837470:web:ea3f4ba28bd00630c582cf"
  };
  const FIREBASE_SDK_VERSION = "10.12.5"; // zelfde versie als certamen/index.html

  const IDENT_KEY = "certamen_battle_identity"; // zelfde sleutel als certamen/battle.js

  /* ---- Lazy Firebase-loader: alleen laden zodra echt nodig ---- */
  let fbReadyPromise = null;
  function loadScript(src){
    return new Promise((resolve, reject)=>{
      const s = document.createElement("script");
      s.src = src; s.async = false;
      s.onload = ()=>resolve();
      s.onerror = ()=>reject(new Error("Kon "+src+" niet laden"));
      document.head.appendChild(s);
    });
  }
  function ensureFirebase(){
    if(fbReadyPromise) return fbReadyPromise;
    fbReadyPromise = (async ()=>{
      if(typeof firebase === "undefined"){
        const base = "https://www.gstatic.com/firebasejs/"+FIREBASE_SDK_VERSION+"/";
        await loadScript(base+"firebase-app-compat.js");
        await Promise.all([
          loadScript(base+"firebase-auth-compat.js"),
          loadScript(base+"firebase-database-compat.js")
        ]);
      }
      if(!firebase.apps.length) firebase.initializeApp(FIREBASE_CONFIG);
      return { db: firebase.database(), auth: firebase.auth() };
    })();
    return fbReadyPromise;
  }

  /* ---- Leerling-identiteit ---- */
  function identLoad(){
    try{ const r = localStorage.getItem(IDENT_KEY); return r ? JSON.parse(r) : null; }
    catch(e){ return null; }
  }
  function identSave(o){
    try{ localStorage.setItem(IDENT_KEY, JSON.stringify(o)); }catch(e){}
  }
  function identClear(){
    try{ localStorage.removeItem(IDENT_KEY); }catch(e){}
  }

  const listeners = [];
  function notifyChange(){ listeners.forEach(cb=>{ try{ cb(); }catch(e){} }); }

  async function loginStudent(klas, code, naam){
    klas = (klas||"").trim().toUpperCase();
    code = (code||"").trim().toUpperCase();
    if(!klas || !code) throw new Error("Vul klascode en leerlingcode in.");
    const { db } = await ensureFirebase();
    const ok = await db.ref("klascodes/"+klas).once("value").then(s=>s.exists());
    if(!ok) throw new Error("Klascode '"+klas+"' niet gevonden.");
    const snap = await db.ref("identities/"+klas+"/"+code).once("value");
    let data;
    if(snap.exists()){
      data = snap.val();
    }else{
      if(!naam || !naam.trim()) throw new Error("Nieuw profiel: vul ook je naam in.");
      data = { name: naam.trim(), coins:0, xp:0, battles:0, level:1, classHistory:{}, achievements:[] };
      await db.ref("identities/"+klas+"/"+code).set(data);
      db.ref("usedKlascodes/"+klas).transaction(cur=>(cur||0)+1).catch(()=>{});
    }
    const ident = { klascode:klas, leerlingcode:code, ...data };
    identSave(ident);
    notifyChange();
    return ident;
  }
  function logoutStudent(){ identClear(); notifyChange(); }

  /* ---- Docent-identiteit (Firebase Auth) ---- */
  async function loginTeacher(email, wachtwoord){
    const { auth } = await ensureFirebase();
    await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    const cred = await auth.signInWithEmailAndPassword(email, wachtwoord);
    notifyChange();
    return cred.user;
  }
  async function logoutTeacher(){
    const { auth } = await ensureFirebase();
    await auth.signOut();
    notifyChange();
  }
  async function authReady(){
    const { auth } = await ensureFirebase();
    return new Promise(resolve=>{
      const unsub = auth.onAuthStateChanged(user=>{ unsub(); resolve(user); });
    });
  }

  /* ---- Score-sync: identities/{klas}/{lid}/apps/{appId} ---- */
  async function saveScore(appId, payload){
    const ident = identLoad();
    if(!ident || !ident.klascode || !ident.leerlingcode) return false; // stil niets doen: niemand ingelogd
    if(!payload || typeof payload.score !== "number") return false;
    try{
      const { db } = await ensureFirebase();
      await db.ref("identities/"+ident.klascode+"/"+ident.leerlingcode+"/apps/"+appId).update({
        score: payload.score,
        detail: String(payload.detail||"").slice(0,200),
        updatedAt: firebase.database.ServerValue.TIMESTAMP
      });
      return true;
    }catch(e){ return false; } // sync mag nooit de app zelf breken
  }

  /* ---- Widget: alleen gebruikt door het hoofdmenu (index.html) ---- */
  function esc(s){ return String(s==null?"":s).replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }

  function mountWidget(el){
    if(!el) return;
    let tab = "leerling", busy=false, err="";

    function render(){
      const ident = identLoad();
      const teacher = (typeof firebase !== "undefined" && firebase.apps && firebase.apps.length) ? firebase.auth().currentUser : null;
      if(ident){
        el.innerHTML =
          '<div class="ktaBar"><span class="ktaWho">🎓 '+esc(ident.name)+' &middot; klas '+esc(ident.klascode)+'</span>'+
          '<button type="button" class="ktaBtn" data-kta="logout-student">Uitloggen</button></div>';
      }else if(teacher){
        el.innerHTML =
          '<div class="ktaBar"><span class="ktaWho">👩‍🏫 '+esc(teacher.email)+'</span>'+
          '<a class="ktaBtn" href="certamen/">Docentenportaal</a>'+
          '<button type="button" class="ktaBtn" data-kta="logout-teacher">Uitloggen</button></div>';
      }else{
        el.innerHTML = '<button type="button" class="ktaBtn ktaBtn-main" data-kta="open">Inloggen (leerling / docent)</button>';
      }
      el.querySelectorAll("[data-kta]").forEach(b=>b.addEventListener("click", onAction));
    }

    function openModal(){
      const wrap = document.createElement("div");
      wrap.className = "ktaModalWrap";
      wrap.innerHTML =
        '<div class="ktaModal">'+
          '<div class="ktaTabs">'+
            '<button type="button" class="ktaTab'+(tab==="leerling"?" ktaTabActive":"")+'" data-ktatab="leerling">Leerling</button>'+
            '<button type="button" class="ktaTab'+(tab==="docent"?" ktaTabActive":"")+'" data-ktatab="docent">Docent</button>'+
          '</div>'+
          '<div class="ktaBody">'+
            (tab==="leerling"
              ? '<input class="ktaInput" id="ktaKlas" placeholder="Klascode" autocapitalize="characters">'+
                '<input class="ktaInput" id="ktaCode" placeholder="Leerlingcode" autocapitalize="characters">'+
                '<input class="ktaInput" id="ktaNaam" placeholder="Naam (alleen nodig bij eerste keer)">'+
                '<button type="button" class="ktaBtn ktaBtn-main" data-kta="do-student">Inloggen</button>'
              : '<input class="ktaInput" id="ktaEmail" type="email" placeholder="E-mailadres">'+
                '<input class="ktaInput" id="ktaPw" type="password" placeholder="Wachtwoord">'+
                '<button type="button" class="ktaBtn ktaBtn-main" data-kta="do-teacher">Inloggen</button>')+
            (err ? '<div class="ktaErr">'+esc(err)+'</div>' : '')+
          '</div>'+
          '<button type="button" class="ktaClose" data-kta="close" aria-label="Sluiten">&times;</button>'+
        '</div>';
      document.body.appendChild(wrap);
      wrap.querySelectorAll("[data-ktatab]").forEach(b=>b.addEventListener("click", e=>{
        tab = e.target.getAttribute("data-ktatab"); err=""; wrap.remove(); openModal();
      }));
      wrap.querySelectorAll("[data-kta]").forEach(b=>b.addEventListener("click", e=>onAction(e, wrap)));
      wrap.addEventListener("click", e=>{ if(e.target===wrap) wrap.remove(); });
    }

    async function onAction(e, wrap){
      const action = e.currentTarget.getAttribute("data-kta");
      if(action==="open"){ err=""; openModal(); return; }
      if(action==="close"){ wrap.remove(); return; }
      if(busy) return;
      if(action==="logout-student"){ logoutStudent(); return; }
      if(action==="logout-teacher"){ await logoutTeacher(); return; }
      if(action==="do-student"){
        busy=true;
        try{
          await loginStudent(
            wrap.querySelector("#ktaKlas").value,
            wrap.querySelector("#ktaCode").value,
            wrap.querySelector("#ktaNaam").value
          );
          wrap.remove();
        }catch(ex){ err = ex.message||String(ex); wrap.remove(); openModal(); }
        busy=false;
      }
      if(action==="do-teacher"){
        busy=true;
        try{
          await loginTeacher(wrap.querySelector("#ktaEmail").value, wrap.querySelector("#ktaPw").value);
          wrap.remove();
        }catch(ex){ err = ex.message||String(ex); wrap.remove(); openModal(); }
        busy=false;
      }
    }

    listeners.push(render);
    render();
    // Teacher-sessie herstelt async; her-render zodra Firebase dat weet.
    ensureFirebase().then(()=>{ firebase.auth().onAuthStateChanged(render); }).catch(()=>{});
  }

  global.KTAuth = {
    getIdentity: identLoad,
    loginStudent, logoutStudent,
    loginTeacher, logoutTeacher, authReady,
    onChange(cb){ listeners.push(cb); },
    mountWidget
  };
  global.KTScores = { save: saveScore };

})(window);
