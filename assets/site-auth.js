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

  // Site-root, afgeleid van het <script>-tag waarmee dit bestand zelf is
  // ingesloten — zo werken cross-app links (profiel-pagina, widget) correct
  // ongeacht of de pagina op het hoofdniveau staat, een niveau dieper (bv.
  // profiel/), of twee niveaus dieper (bv. latijn/ludus/), en ongeacht of de
  // site op "/" of onder "/KThulp/" (GitHub Pages) draait.
  const SITE_ROOT = (function(){
    const scripts = document.getElementsByTagName("script");
    for(let i=0;i<scripts.length;i++){
      const src = scripts[i].getAttribute("src")||"";
      if(/(^|\/)assets\/site-auth\.js(\?.*)?$/.test(src)){
        return new URL(src, document.baseURI).href.replace(/assets\/site-auth\.js(\?.*)?$/, "");
      }
    }
    return "./";
  })();

  // Weergavenamen + link per app, gedeeld door de widget en de profielpagina.
  // Zelfde appId's als KTScores.save() elders op de site gebruikt.
  const APP_META = {
    "ludus-la":        {label:"Ludus (Latijn)",        url:SITE_ROOT+"latijn/ludus/"},
    "agora-gr":        {label:"Agora (Grieks)",         url:SITE_ROOT+"grieks/agora/"},
    "diagnosticum-la": {label:"Diagnosticum (Latijn)",  url:SITE_ROOT+"latijn/diagnosticum/"},
    "casus-la":        {label:"Casus (Latijn)",         url:SITE_ROOT+"latijn/casus/"},
    "casus-gr":        {label:"Casus (Grieks)",         url:SITE_ROOT+"grieks/casus/"},
    "clausula-la":     {label:"Clausula (Latijn)",      url:SITE_ROOT+"latijn/clausula/"},
    "clausula-gr":     {label:"Clausula (Grieks)",      url:SITE_ROOT+"grieks/clausula/"},
    "stamtijden-la":   {label:"Stamtijden (Latijn)",    url:SITE_ROOT+"latijn/stamtijden/"},
    "stamtijden-gr":   {label:"Stamtijden (Grieks)",    url:SITE_ROOT+"grieks/stamtijden/"},
    "structura-la":    {label:"Structura (Latijn)",     url:SITE_ROOT+"latijn/structura/"},
    "structura-gr":    {label:"Structura (Grieks)",     url:SITE_ROOT+"grieks/structura/"},
    "werkwoorden-la":  {label:"Werkwoorden (Latijn)",   url:SITE_ROOT+"latijn/werkwoorden/"},
    "werkwoorden-gr":  {label:"Werkwoorden (Grieks)",   url:SITE_ROOT+"grieks/werkwoorden/"},
    "verba-la":        {label:"Verba (Latijn)",         url:SITE_ROOT+"latijn/verba/"},
    "verba-gr":        {label:"Verba (Grieks)",         url:SITE_ROOT+"grieks/verba/"},
    "alfabet-gr":      {label:"Alfabet (Grieks)",       url:SITE_ROOT+"grieks/alfabet/"},
    "certamen":        {label:"Certamen",               url:SITE_ROOT+"certamen/"}
  };

  // Weergavenamen voor stats-onderdelen (payload.stats van KTScores.save),
  // gedeeld zodat elke app dezelfde sleutelnamen kan hergebruiken.
  const STAT_LABELS = {
    xp:"XP", denarii:"Denarii", streak:"Reeks",
    woordenschat:"Woordenschat", werkwoorden:"Werkwoorden & vormen",
    zinnen:"Zinnen", opzoeken:"Vormen opgezocht"
  };

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

  /* ---- Leerlingwachtwoorden — eigen kopie van de helpers in certamen/net.js
     (zie het commentaarblok "Leerlingwachtwoorden" daar voor opslag en
     beveiligingsniveau: pwHash op de identiteit, leesbare kopie in
     studentSecrets/{klas}/{lid} voor docent-eigenaar of Google-gekoppelde
     leerling). Houd beide kopieën gelijk. ---- */
  const PW_MIN = 4;
  async function sha256Hex(str){
    if(!(window.crypto && crypto.subtle)) throw new Error("Wachtwoorden vereisen een beveiligde verbinding (https).");
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
    return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,"0")).join("");
  }
  async function pwMake(klas, lid, pw){
    const salt = Array.from(crypto.getRandomValues(new Uint8Array(8))).map(b=>b.toString(16).padStart(2,"0")).join("");
    return "v1$"+salt+"$"+await sha256Hex(salt+"|"+klas+"|"+lid+"|"+pw);
  }
  async function pwCheck(stored, klas, lid, pw){
    const m = /^v1\$([0-9a-f]+)\$([0-9a-f]{64})$/.exec(stored||"");
    if(!m) return false;
    return (await sha256Hex(m[1]+"|"+klas+"|"+lid+"|"+pw)) === m[2];
  }
  async function pwStore(db, klas, lid, pw){
    const hash = await pwMake(klas, lid, pw);
    await db.ref("identities/"+klas+"/"+lid+"/pwHash").set(hash);
    await db.ref("studentSecrets/"+klas+"/"+lid).set(pw);
    return hash;
  }

  async function loginStudent(klas, code, naam, password){
    klas = (klas||"").trim().toUpperCase();
    code = (code||"").trim();
    password = password||"";
    if(!klas || !code) throw new Error("Vul klascode en leerlingcode in.");
    const { db } = await ensureFirebase();
    const ok = await db.ref("klascodes/"+klas).once("value").then(s=>s.exists());
    if(!ok) throw new Error("Klascode '"+klas+"' niet gevonden.");
    // Certamen slaat leerlingcodes in kleine letters op, deze widget deed dat
    // vroeger in hoofdletters — zoek daarom eerst de kleine-letter-variant en
    // val terug op een bestaand hoofdletterprofiel; een nieuw profiel wordt
    // altijd in kleine letters aangemaakt (dus gelijk aan Certamen).
    let lid = code.toLowerCase();
    let snap = await db.ref("identities/"+klas+"/"+lid).once("value");
    if(!snap.exists() && code.toUpperCase()!==lid){
      const alt = await db.ref("identities/"+klas+"/"+code.toUpperCase()).once("value");
      if(alt.exists()){ snap = alt; lid = code.toUpperCase(); }
    }
    let data;
    if(snap.exists()){
      data = snap.val();
      if(data.pwHash){
        if(!(await pwCheck(data.pwHash, klas, lid, password)))
          throw new Error("Onjuist wachtwoord. Vraag je docent om je wachtwoord, of log in met Google als je dat hebt gekoppeld.");
      }else{
        if(password.length<PW_MIN) throw new Error("Dit profiel heeft nog geen wachtwoord. Vul nu een wachtwoord in (minstens "+PW_MIN+" tekens) — dat wordt je wachtwoord.");
        data = { ...data, pwHash: await pwStore(db, klas, lid, password) };
      }
      db.ref("identities/"+klas+"/"+lid+"/lastActive").set(Date.now()).catch(()=>{});
    }else{
      if(!naam || !naam.trim()) throw new Error("Nieuw profiel: vul ook je naam in.");
      if(password.length<PW_MIN) throw new Error("Kies een wachtwoord van minstens "+PW_MIN+" tekens.");
      data = { name: naam.trim(), coins:0, xp:0, battles:0, level:1, classHistory:{}, achievements:[],
               lastActive:Date.now(), pwHash: await pwMake(klas, lid, password) };
      await db.ref("identities/"+klas+"/"+lid).set(data);
      db.ref("studentSecrets/"+klas+"/"+lid).set(password).catch(()=>{});
      db.ref("usedKlascodes/"+klas).transaction(cur=>(cur||0)+1).catch(()=>{});
    }
    const ident = { klascode:klas, leerlingcode:lid, ...data };
    identSave(ident);
    notifyChange();
    return ident;
  }
  // Leerling: wachtwoord wijzigen. Oud wachtwoord vereist, tenzij het profiel er
  // nog geen heeft (dan mag oldPw leeg blijven).
  async function changeStudentPassword(oldPw, newPw){
    const ident = identLoad();
    if(!ident) throw new Error("Log eerst in als leerling.");
    if((newPw||"").length<PW_MIN) throw new Error("Kies een wachtwoord van minstens "+PW_MIN+" tekens.");
    const { db } = await ensureFirebase();
    const snap = await db.ref("identities/"+ident.klascode+"/"+ident.leerlingcode+"/pwHash").once("value");
    if(snap.exists() && !(await pwCheck(snap.val(), ident.klascode, ident.leerlingcode, oldPw||"")))
      throw new Error("Het huidige wachtwoord klopt niet.");
    const hash = await pwStore(db, ident.klascode, ident.leerlingcode, newPw);
    identSave({ ...ident, pwHash:hash });
  }
  // Leerling mét Google-koppeling: eigen wachtwoord terugzien. Vereist een
  // sessie van het gekoppelde Google-account (rules: studentSecrets via
  // googleLinks) — zo nodig sturen we eerst door naar Google (redirect) en
  // toont de profielpagina het wachtwoord automatisch na terugkomst.
  const REVEAL_FLAG = "kt_reveal_pw";
  async function revealStudentPassword(){
    const ident = identLoad();
    if(!ident) throw new Error("Log eerst in als leerling.");
    const { auth, db } = await ensureFirebase();
    const u = auth.currentUser;
    if(u && (u.providerData||[]).some(p=>p.providerId==="google.com")){
      try{
        const s = await db.ref("studentSecrets/"+ident.klascode+"/"+ident.leerlingcode).once("value");
        sessionStorage.removeItem(REVEAL_FLAG);
        if(s.exists()) return { ok:true, pw:s.val() };
        return { ok:false, error:"Er is nog geen wachtwoord ingesteld voor dit profiel." };
      }catch(e){
        // Verkeerd Google-account (rules weigeren): niet blijven doorsturen.
        if(sessionStorage.getItem(REVEAL_FLAG)==="back"){
          sessionStorage.removeItem(REVEAL_FLAG);
          return { ok:false, error:"Dit is niet het Google-account dat aan dit profiel is gekoppeld." };
        }
      }
    }
    try{ sessionStorage.setItem(REVEAL_FLAG, "back"); localStorage.setItem(GOOGLE_REDIRECT_KEY, JSON.stringify({action:"reveal", klas:ident.klascode, lid:ident.leerlingcode})); }catch(e){}
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({prompt:"select_account"});
    await auth.signInWithRedirect(provider);
    return { ok:false, redirecting:true };
  }
  function logoutStudent(){ identClear(); notifyChange(); }

  /* ---- Docent-identiteit (Firebase Auth) ----
     Goedkeuringssysteem (admins/{uid}, teacherStatus/{uid}) hergebruikt hier
     dezelfde paden als certamen/net.js (FBNet) — één rollensysteem voor de
     hele site, zie CLAUDE.md § Firebase-rules. Nieuwe docenten registreren
     via signupTeacher() en komen op "pending" te staan; alleen een admin kan
     dat via het Beheerdersoverzicht in Certamen op "approved"/"revoked"
     zetten. Rules dwingen de eigenlijke beperking af (klascodes/teachers
     writes), dit is puur de UI-laag die dezelfde status ook buiten Certamen
     zichtbaar maakt. */
  async function loginTeacher(email, wachtwoord){
    const { auth } = await ensureFirebase();
    await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    const cred = await auth.signInWithEmailAndPassword(email, wachtwoord);
    notifyChange();
    return cred.user;
  }
  async function signupTeacher(email, wachtwoord){
    const { auth, db } = await ensureFirebase();
    const cred = await auth.createUserWithEmailAndPassword(email, wachtwoord);
    const uid = cred.user.uid;
    await db.ref("teacherStatus/"+uid).set({ status:"pending", email, requestedAt: Date.now() });
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
  // .catch(()=>...): zolang een lezing op admins/teacherStatus onverwacht
  // geweigerd wordt (netwerkstoring e.d.) valt dit terug op "geen admin"/
  // "onbekende status" i.p.v. de aanroeper te laten hangen op een reject.
  async function isAdmin(){
    const { db, auth } = await ensureFirebase();
    const uid = auth.currentUser && auth.currentUser.uid;
    if(!uid) return false;
    return db.ref("admins/"+uid).once("value").then(s=>s.val()===true).catch(()=>false);
  }
  async function getTeacherStatus(){
    const { db, auth } = await ensureFirebase();
    const uid = auth.currentUser && auth.currentUser.uid;
    if(!uid) return null;
    return db.ref("teacherStatus/"+uid).once("value").then(s=>s.val()).catch(()=>null);
  }
  async function resetTeacherPassword(email){
    const { auth } = await ensureFirebase();
    return auth.sendPasswordResetEmail(email);
  }
  /* Docent-Google-koppeling: standaard Firebase-provider-linking (geen eigen
     opzoektabel nodig, anders dan de leerling-Google-koppeling hieronder) —
     zie certamen/net.js FBNet.linkTeacherGoogle()/loginTeacherWithGoogle()
     voor de volledige toelichting. Altijd redirect, nooit een popup. */
  async function linkTeacherGoogle(){
    const { auth } = await ensureFirebase();
    const user = auth.currentUser;
    if(!user) throw new Error("Log eerst in als docent.");
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({prompt:"select_account"});
    return user.linkWithRedirect(provider);
  }
  async function loginTeacherWithGoogle(){
    const { auth } = await ensureFirebase();
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({prompt:"select_account"});
    return auth.signInWithRedirect(provider);
  }
  async function handleTeacherGoogleRedirect(){
    const { auth } = await ensureFirebase();
    try{
      const result = await auth.getRedirectResult();
      notifyChange();
      return { ok:true, handled: !!(result && result.user) };
    }catch(err){
      const code = err && err.code;
      if(!code) return { ok:true, handled:false };
      const msg = code==="auth/credential-already-in-use"
        ? "Dit Google-account hoort al bij een ander account (bv. een leerlingprofiel of ander docentaccount). Gebruik een ander Google-account."
        : code==="auth/email-already-in-use"
          ? "Er bestaat al een docentaccount met dit e-mailadres — log eerst in met e-mail/wachtwoord en koppel Google daarna."
          : ("Google-koppeling mislukt: "+(err.message||code));
      return { ok:false, handled:true, error:msg };
    }
  }

  /* ---- Leerling: profiel verversen vanaf Firebase (coins/xp/apps/Google-link) ----
     notifyChange() alleen bij een ECHTE wijziging: refreshIdentity() wordt op de
     profielpagina zelf aangeroepen vanuit een render() die ook als onChange-
     listener geregistreerd staat — zonder deze dirty-check triggert elke
     ververs-aanroep zichzelf opnieuw (render → refreshIdentity → notifyChange →
     render → …), een oneindige lus die de pagina/Firebase blijft belasten en
     klikken laat "niets doen" doordat de DOM continu wordt vervangen. */
  async function refreshIdentity(){
    const ident = identLoad();
    if(!ident) return null;
    const { db } = await ensureFirebase();
    const snap = await db.ref("identities/"+ident.klascode+"/"+ident.leerlingcode).once("value");
    if(!snap.exists()) return ident;
    const merged = { ...ident, ...snap.val() };
    const changed = JSON.stringify(merged) !== JSON.stringify(ident);
    identSave(merged);
    if(changed) notifyChange();
    return merged;
  }

  /* ---- Leerling: Google-account koppelen (optioneel, naast klascode+leerlingcode) ----
     Zelfde onderliggende data als certamen/battle.js's eigen Google-koppeling
     (identities/{klas}/{lid}/googleUid + googleLinks/{uid}), hier zelfstandig
     herhaald zodat ook pagina's buiten Certamen dit kunnen aanbieden. Gebruikt
     een eigen redirect-sleutel (niet die van battle.js) zodat de twee losse
     flows elkaar nooit kunnen kruisen. */
  const GOOGLE_REDIRECT_KEY = "kt_profile_google_redirect_intent";
  async function linkGoogle(){
    const ident = identLoad();
    if(!ident) throw new Error("Log eerst in als leerling.");
    const { auth } = await ensureFirebase();
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({prompt:"select_account"});
    try{ localStorage.setItem(GOOGLE_REDIRECT_KEY, JSON.stringify({klas:ident.klascode, lid:ident.leerlingcode})); }catch(e){}
    await auth.signInWithRedirect(provider);
  }
  async function handleGoogleRedirect(){
    let intent=null;
    try{ const r=localStorage.getItem(GOOGLE_REDIRECT_KEY); if(r){ intent=JSON.parse(r); localStorage.removeItem(GOOGLE_REDIRECT_KEY); } }catch(e){}
    if(!intent) return false;
    const { auth, db } = await ensureFirebase();
    let result=null;
    try{ result = await auth.getRedirectResult(); }catch(e){ return false; }
    let user = result && result.user;
    if(!user){
      // Zelfde race als certamen/battle.js (bmGoogleHandleRedirectResult): geef
      // Firebase nog een korte kans om de auth-state te laten settelen.
      user = await new Promise(resolve=>{
        if(auth.currentUser){ resolve(auth.currentUser); return; }
        const unsub = auth.onAuthStateChanged(u=>{ unsub(); resolve(u); });
        setTimeout(()=>{ unsub(); resolve(auth.currentUser); }, 3000);
      });
    }
    if(!user) return false;
    // Alleen "wachtwoord terugzien" (revealStudentPassword): de Google-sessie is
    // genoeg — niets koppelen of wegschrijven.
    if(intent.action==="reveal"){ notifyChange(); return true; }
    const uid=user.uid, email=user.email||"";
    const identSnap = await db.ref("identities/"+intent.klas+"/"+intent.lid+"/googleUid").once("value");
    if(identSnap.exists() && identSnap.val()!==uid) throw new Error("Dit profiel is al gekoppeld aan een ander Google-account. Ontkoppel eerst.");
    const linkSnap = await db.ref("googleLinks/"+uid).once("value");
    if(linkSnap.exists() && (linkSnap.val().klas!==intent.klas || linkSnap.val().lid!==intent.lid)) throw new Error("Dit Google-account is al gekoppeld aan een ander profiel.");
    const updates={};
    updates["identities/"+intent.klas+"/"+intent.lid+"/googleUid"]=uid;
    updates["identities/"+intent.klas+"/"+intent.lid+"/googleEmail"]=email;
    updates["googleLinks/"+uid]={klas:intent.klas, lid:intent.lid, email, linkedAt:firebase.database.ServerValue.TIMESTAMP};
    await db.ref().update(updates);
    const ident = identLoad();
    if(ident) identSave({...ident, googleUid:uid, googleEmail:email});
    notifyChange();
    return true;
  }
  async function unlinkGoogle(){
    const ident = identLoad();
    if(!ident || !ident.googleUid) return;
    const { db } = await ensureFirebase();
    const updates={};
    updates["identities/"+ident.klascode+"/"+ident.leerlingcode+"/googleUid"]=null;
    updates["identities/"+ident.klascode+"/"+ident.leerlingcode+"/googleEmail"]=null;
    updates["googleLinks/"+ident.googleUid]=null;
    await db.ref().update(updates);
    const cleaned={...ident}; delete cleaned.googleUid; delete cleaned.googleEmail;
    identSave(cleaned);
    notifyChange();
  }

  /* ---- Docent: eigen klassen + roster opvragen (voor de profielpagina) ---- */
  async function getTeacherClasses(){
    const { db, auth } = await ensureFirebase();
    const uid = auth.currentUser && auth.currentUser.uid;
    if(!uid) return {};
    const snap = await db.ref("teachers/"+uid+"/classes").once("value");
    return snap.val()||{};
  }
  async function getClassRoster(code){
    const { db } = await ensureFirebase();
    const snap = await db.ref("identities/"+(code||"").trim().toUpperCase()).once("value");
    if(!snap.exists()) return {};
    const out={};
    snap.forEach(child=>{ out[child.key]=child.val(); });
    return out;
  }

  /* ---- Score-sync: identities/{klas}/{lid}/apps/{appId} ----
     payload.stats (optioneel): platte {onderdeel:getal}-object voor apps met
     meerdere onderdelen (bv. Ludus/Agora: woordenschat/werkwoorden/zinnen)
     — de profielpagina toont dit als een uitgebreid "scorebord" i.p.v. alleen
     de ene score+detail-regel. Geen aparte rules-wijziging nodig: identities/
     $klas/$lid/apps/$appId heeft geen closed schema, dus extra kinderen zoals
     "stats" erven gewoon de bestaande write-rechten van $lid. */
  async function saveScore(appId, payload){
    const ident = identLoad();
    if(!ident || !ident.klascode || !ident.leerlingcode) return false; // stil niets doen: niemand ingelogd
    if(!payload || typeof payload.score !== "number") return false;
    try{
      const { db } = await ensureFirebase();
      const data = {
        score: payload.score,
        detail: String(payload.detail||"").slice(0,200),
        updatedAt: firebase.database.ServerValue.TIMESTAMP
      };
      if(payload.stats && typeof payload.stats === "object") data.stats = payload.stats;
      await db.ref("identities/"+ident.klascode+"/"+ident.leerlingcode+"/apps/"+appId).update(data);
      db.ref("identities/"+ident.klascode+"/"+ident.leerlingcode+"/lastActive").set(Date.now()).catch(()=>{});
      return true;
    }catch(e){ return false; } // sync mag nooit de app zelf breken
  }

  /* ---- Widget: alleen gebruikt door het hoofdmenu (index.html) ---- */
  function esc(s){ return String(s==null?"":s).replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }

  function mountWidget(el){
    if(!el) return;
    let tab = "leerling", busy=false, err="", msg="";
    // Cache van teacherStatus/isAdmin per uid — voorkomt een oneindige fetch-
    // render-fetch-lus (render() triggert de fetch, de fetch triggert opnieuw
    // render(), maar dan met de cache al gevuld voor deze uid dus geen nieuwe
    // fetch meer).
    let statusCache = { uid:null, status:null, isAdmin:false };
    let googleLinkMsg = ""; // resultaat van handleTeacherGoogleRedirect(), zie onderaan

    function render(){
      const ident = identLoad();
      const teacher = (typeof firebase !== "undefined" && firebase.apps && firebase.apps.length) ? firebase.auth().currentUser : null;
      if(ident){
        el.innerHTML =
          '<div class="ktaBar"><span class="ktaWho">🎓 '+esc(ident.name)+' &middot; klas '+esc(ident.klascode)+'</span>'+
          '<a class="ktaBtn" href="'+esc(SITE_ROOT+"profiel/")+'">Mijn profiel</a>'+
          '<button type="button" class="ktaBtn" data-kta="logout-student">Uitloggen</button></div>';
      }else if(teacher){
        if(statusCache.uid !== teacher.uid){
          el.innerHTML = '<div class="ktaBar"><span class="ktaWho">👩‍🏫 '+esc(teacher.email)+'</span></div>';
          Promise.all([getTeacherStatus(), isAdmin(), Promise.resolve(teacher.reload&&teacher.reload()).catch(()=>{})]).then(([status, admin])=>{
            statusCache = { uid: teacher.uid, status, isAdmin: admin };
            render();
          });
          return;
        }
        const approved = statusCache.isAdmin || (statusCache.status && statusCache.status.status==="approved");
        const statusNote = approved ? "" : (statusCache.status && statusCache.status.status==="revoked"
          ? ' &middot; <span style="color:#e08a7a">toegang ingetrokken</span>'
          : ' &middot; <span style="color:#e0b86a">wacht op goedkeuring</span>');
        const googleProvider = (teacher.providerData||[]).some(p=>p.providerId==="google.com");
        el.innerHTML =
          '<div class="ktaBar"><span class="ktaWho">👩‍🏫 '+esc(teacher.email)+statusNote+'</span>'+
          '<a class="ktaBtn" href="'+esc(SITE_ROOT+"profiel/")+'">Mijn profiel</a>'+
          '<a class="ktaBtn" href="'+esc(SITE_ROOT+"certamen/?screen=teacherPortal")+'">Docentenportaal</a>'+
          (googleProvider ? '<span style="color:#8fbf7a">✓ Google gekoppeld</span>' : '<button type="button" class="ktaBtn" data-kta="link-teacher-google">Koppel Google-account</button>')+
          '<button type="button" class="ktaBtn" data-kta="logout-teacher">Uitloggen</button></div>'+
          (googleLinkMsg ? '<div class="ktaNote" style="margin-top:6px">'+esc(googleLinkMsg)+'</div>' : '');
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
                '<input class="ktaInput" id="ktaCode" placeholder="Leerlingcode" autocapitalize="none">'+
                '<input class="ktaInput" id="ktaPwS" type="password" placeholder="Wachtwoord" autocomplete="current-password">'+
                '<div class="ktaNote" style="font-size:12px;opacity:.75;margin-top:-4px">Nieuw profiel, of nog geen wachtwoord? Kies er nu een (minstens '+PW_MIN+' tekens).</div>'+
                '<input class="ktaInput" id="ktaNaam" placeholder="Naam (alleen nodig bij eerste keer)">'+
                '<button type="button" class="ktaBtn ktaBtn-main" data-kta="do-student">Inloggen</button>'
              : '<input class="ktaInput" id="ktaEmail" type="email" placeholder="E-mailadres">'+
                '<input class="ktaInput" id="ktaPw" type="password" placeholder="Wachtwoord">'+
                '<button type="button" class="ktaBtn ktaBtn-main" data-kta="do-teacher">Inloggen</button>'+
                '<button type="button" class="ktaBtn" style="margin-top:8px" data-kta="do-teacher-google">Inloggen met Google</button>'+
                '<div class="ktaNote" style="font-size:12px;opacity:.75;margin-top:2px">Alleen als je Google eerder aan dit docentaccount hebt gekoppeld.</div>'+
                '<button type="button" class="ktaBtn" style="margin-top:8px" data-kta="do-teacher-signup">Account aanmaken</button>'+
                '<div class="ktaNote" style="font-size:12px;opacity:.75;margin-top:6px">Na registreren moet de beheerder je account nog goedkeuren.</div>'+
                '<button type="button" class="ktaLink" style="margin-top:8px" data-kta="do-teacher-forgot">Wachtwoord vergeten?</button>')+
            (err ? '<div class="ktaErr">'+esc(err)+'</div>' : '')+
            (msg ? '<div class="ktaOk">'+esc(msg)+'</div>' : '')+
          '</div>'+
          '<button type="button" class="ktaClose" data-kta="close" aria-label="Sluiten">&times;</button>'+
        '</div>';
      document.body.appendChild(wrap);
      wrap.querySelectorAll("[data-ktatab]").forEach(b=>b.addEventListener("click", e=>{
        tab = e.target.getAttribute("data-ktatab"); err=""; msg=""; wrap.remove(); openModal();
      }));
      wrap.querySelectorAll("[data-kta]").forEach(b=>b.addEventListener("click", e=>onAction(e, wrap)));
      wrap.addEventListener("click", e=>{ if(e.target===wrap) wrap.remove(); });
    }

    async function onAction(e, wrap){
      const action = e.currentTarget.getAttribute("data-kta");
      if(action==="open"){ err=""; msg=""; openModal(); return; }
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
            wrap.querySelector("#ktaNaam").value,
            wrap.querySelector("#ktaPwS").value
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
      if(action==="do-teacher-signup"){
        busy=true;
        const email = wrap.querySelector("#ktaEmail").value;
        const pw = wrap.querySelector("#ktaPw").value;
        try{
          if(!pw || pw.length<6) throw new Error("Kies een wachtwoord van minstens 6 tekens.");
          await signupTeacher(email, pw);
          err=""; msg="Account aangemaakt — wacht op goedkeuring door de beheerder.";
          wrap.remove(); openModal();
        }catch(ex){ msg=""; err = ex.message||String(ex); wrap.remove(); openModal(); }
        busy=false;
      }
      if(action==="do-teacher-forgot"){
        const email = wrap.querySelector("#ktaEmail").value;
        if(!email){ err="Vul eerst je e-mailadres in."; msg=""; wrap.remove(); openModal(); return; }
        busy=true;
        try{
          await resetTeacherPassword(email);
          err=""; msg="E-mail met resetlink verstuurd naar "+email+".";
        }catch(ex){ msg=""; err = ex.message||String(ex); }
        wrap.remove(); openModal();
        busy=false;
      }
      if(action==="do-teacher-google"){
        busy=true;
        try{ await loginTeacherWithGoogle(); } // navigeert weg (redirect); geen wrap.remove() nodig
        catch(ex){ err = ex.message||String(ex); wrap.remove(); openModal(); busy=false; }
      }
      if(action==="link-teacher-google"){
        googleLinkMsg = "Doorsturen naar Google…"; render();
        try{ await linkTeacherGoogle(); } // navigeert weg (redirect)
        catch(ex){
          const c = ex && ex.code;
          googleLinkMsg = c==="auth/provider-already-linked" ? "Er is al een Google-account aan dit docentaccount gekoppeld."
            : c==="auth/credential-already-in-use" ? "Dit Google-account hoort al bij een ander account (bv. een leerlingprofiel). Gebruik een ander Google-account."
            : (ex.message||String(ex));
          render();
        }
      }
    }

    listeners.push(render);
    render();
    // Teacher-sessie herstelt async; her-render zodra Firebase dat weet.
    // Vangt ook een lopende linkTeacherGoogle()/loginTeacherWithGoogle()-
    // redirect af (zie handleTeacherGoogleRedirect hierboven) — dit is de
    // enige plek waar de widget zelf opstart, dus hier hoort die check thuis.
    ensureFirebase().then(()=>{
      firebase.auth().onAuthStateChanged(render);
      return handleTeacherGoogleRedirect();
    }).then(res=>{
      if(res && res.error){ googleLinkMsg = res.error; render(); }
    }).catch(()=>{});
  }

  global.KTAuth = {
    getIdentity: identLoad,
    loginStudent, logoutStudent, changeStudentPassword, revealStudentPassword,
    loginTeacher, logoutTeacher, authReady,
    signupTeacher, getTeacherStatus, isAdmin,
    resetTeacherPassword, linkTeacherGoogle, loginTeacherWithGoogle, handleTeacherGoogleRedirect,
    onChange(cb){ listeners.push(cb); },
    mountWidget,
    ensureFirebase,
    refreshIdentity,
    linkGoogle, unlinkGoogle, handleGoogleRedirect,
    getTeacherClasses, getClassRoster,
    APPS: APP_META,
    STAT_LABELS,
    SITE_ROOT
  };
  global.KTScores = { save: saveScore };

})(window);
