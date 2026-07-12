
/* ============================================================================
   NETWERKLAAG — Firebase (echt) of Demo (oefenmodus, één apparaat + bots)
   ============================================================================ */
const hasFirebase = (function(){
  try{ return !!(FIREBASE_CONFIG && FIREBASE_CONFIG.databaseURL && typeof firebase!=="undefined"); }catch(e){ return false; }
})();
let fbApp=null, fbDB=null;
function initFirebase(){
  if(fbDB) return true;
  if(!hasFirebase) return false;
  try{ fbApp = firebase.apps.length ? firebase.app() : firebase.initializeApp(FIREBASE_CONFIG); fbDB = firebase.database(); return true; }
  catch(e){ return false; }
}

/* ---- Firebase net ---- */
const FBNet = {
  mode:"firebase",
  roomRef(code){ return fbDB.ref("rooms/"+code); },
  createRoom(code, data){ return this.roomRef(code).set(data); },
  deleteRoom(code){ return this.roomRef(code).remove(); },
  exists(code){ return this.roomRef(code+"/meta").once("value").then(s=>s.exists()); },
  getMeta(code){ return this.roomRef(code+"/meta").once("value").then(s=>s.val()); },
  getPool(code){ return this.roomRef(code+"/pool").once("value").then(s=>s.val()||[]); },
  onState(code, cb){ const r=this.roomRef(code+"/state"); const f=r.on("value",s=>cb(s.val()||{})); return ()=>r.off("value",f); },
  onPlayers(code, cb){ const r=this.roomRef(code+"/players"); const f=r.on("value",s=>cb(s.val()||{})); return ()=>r.off("value",f); },
  setState(code, patch){ return this.roomRef(code+"/state").update(patch); },
  addPlayer(code, player){ const r=this.roomRef(code+"/players").push(); r.onDisconnect().update({online:false}); r.set(player); return r.key; },
  updatePlayer(code, pid, patch){ return this.roomRef(code+"/players/"+pid).update(patch); },
  ropePull(code, delta, lo, hi){ return this.roomRef(code+"/state/ropePos").transaction(v=>clamp((v||0)+delta, lo, hi)); },
  serverTime(){ return firebase.database.ServerValue.TIMESTAMP; },
};

/* ---- Demo net (in-memory, één tab; host speelt tegen bots) ---- */
const DemoNet = (function(){
  const rooms={};
  function emit(code){ const r=rooms[code]; if(!r)return; r.stateCbs.forEach(cb=>cb(Object.assign({},r.state))); r.playerCbs.forEach(cb=>cb(JSON.parse(JSON.stringify(r.players)))); }
  return {
    mode:"demo",
    createRoom(code,data){ rooms[code]={meta:data.meta, pool:data.pool, state:data.state||{}, players:data.players||{}, stateCbs:[], playerCbs:[]}; return Promise.resolve(); },
    exists(code){ return Promise.resolve(!!rooms[code]); },
    getMeta(code){ return Promise.resolve(rooms[code]?rooms[code].meta:null); },
    getPool(code){ return Promise.resolve(rooms[code]?rooms[code].pool:[]); },
    onState(code,cb){ const r=rooms[code]; if(!r)return ()=>{}; r.stateCbs.push(cb); cb(Object.assign({},r.state)); return ()=>{ r.stateCbs=r.stateCbs.filter(x=>x!==cb); }; },
    onPlayers(code,cb){ const r=rooms[code]; if(!r)return ()=>{}; r.playerCbs.push(cb); cb(JSON.parse(JSON.stringify(r.players))); return ()=>{ r.playerCbs=r.playerCbs.filter(x=>x!==cb); }; },
    setState(code,patch){ const r=rooms[code]; if(!r)return Promise.resolve(); Object.assign(r.state,patch); emit(code); return Promise.resolve(); },
    addPlayer(code,player){ const r=rooms[code]; if(!r)return null; const id=uid(); r.players[id]=player; emit(code); return id; },
    updatePlayer(code,pid,patch){ const r=rooms[code]; if(!r||!r.players[pid])return Promise.resolve(); Object.assign(r.players[pid],patch); emit(code); return Promise.resolve(); },
    ropePull(code,delta,lo,hi){ const r=rooms[code]; if(!r)return Promise.resolve(); r.state.ropePos=clamp((r.state.ropePos||0)+delta,lo,hi); emit(code); return Promise.resolve(); },
    serverTime(){ return nowMs(); },
  };
})();

let Net = null; // wordt gezet bij start


/* ============================================================================
   DOCENTENPORTAAL — Persistente klassen via Firebase Auth + Realtime DB
   ============================================================================ */

/* ---- FBNet: authenticatie + klasbeheer ---- */
FBNet.loginTeacher = function(email, password){
  if(!initFirebase()) return Promise.reject("Firebase niet beschikbaar");
  return firebase.auth().signInWithEmailAndPassword(email, password)
    .then(cred => cred.user.uid);
};
FBNet.logoutTeacher = function(){
  if(!hasFirebase) return Promise.resolve();
  return firebase.auth().signOut();
};
FBNet.getTeacherUid = function(){
  if(!hasFirebase) return null;
  const user = firebase.auth().currentUser;
  return user ? user.uid : null;
};
FBNet.isTeacherLoggedIn = function(){
  return this.getTeacherUid() !== null;
};
FBNet.teacherRef = function(){
  const uid = this.getTeacherUid();
  if(!uid) throw new Error("Geen docent ingelogd");
  if(!fbDB) initFirebase();
  return fbDB.ref("teachers/" + uid);
};
FBNet.getClasses = function(){
  try{ return this.teacherRef().child("classes").once("value").then(s => s.val() || {}); }
  catch(e){ return Promise.reject(e.message); }
};
FBNet.saveClass = function(classId, className){
  try{ return this.teacherRef().child("classes/" + classId + "/className").set(className); }
  catch(e){ return Promise.reject(e.message); }
};
// Koppelt een docent-klas expliciet aan een vaste inlogcode. Zo blijft de code
// stabiel ook als de docent de klasnaam later hernoemt (i.p.v. 'm elke keer uit
// de naam af te leiden, wat de koppeling met identities/{code} zou breken).
FBNet.setClassCode = function(classId, code){
  try{ return this.teacherRef().child("classes/" + classId + "/code").set(code.toUpperCase()); }
  catch(e){ return Promise.reject(e.message); }
};
FBNet.deleteClass = function(classId){
  try{ return this.teacherRef().child("classes/" + classId).remove(); }
  catch(e){ return Promise.reject(e.message); }
};
FBNet.deleteStudent = function(classId, studentId){
  try{ return this.teacherRef().child("classes/" + classId + "/students/" + studentId).remove(); }
  catch(e){ return Promise.reject(e.message); }
};
FBNet.moveStudent = function(fromClassId, toClassId, studentId, studentData){
  try{
    const updates = {};
    updates["classes/" + fromClassId + "/students/" + studentId] = null;
    updates["classes/" + toClassId  + "/students/" + studentId] = studentData;
    return this.teacherRef().update(updates);
  }catch(e){ return Promise.reject(e.message); }
};
FBNet.assignStudent = function(classId, studentId, studentData){
  try{ return this.teacherRef().child("classes/"+classId+"/students/"+studentId).set(studentData); }
  catch(e){ return Promise.reject(e.message); }
};
FBNet.removeAdminFlag = function(klascode, lid){
  if(!fbDB) initFirebase();
  return fbDB.ref("identities/"+klascode.toUpperCase()+"/"+lid+"/admin").remove();
};
// Maakt één specifieke leerling (op leerlingcode) admin — nauwkeuriger dan
// setAdminFlag(), dat op naam matcht en bij dubbele namen te veel zou raken.
FBNet.grantAdmin = function(klascode, lid){
  if(!fbDB) initFirebase();
  return fbDB.ref("identities/"+klascode.toUpperCase()+"/"+lid+"/admin").set(true);
};
FBNet.getIdentities = function(klascode){
  if(!fbDB) initFirebase();
  return fbDB.ref("identities/"+klascode.toUpperCase()).once("value").then(snap=>{
    if(!snap.exists()) return Promise.reject("Klas '"+klascode+"' niet gevonden in Battle Mode.");
    const out={};
    snap.forEach(child=>{ out[child.key]=child.val(); });
    return out;
  });
};
// Lichte index (usedKlascodes/{klas}: aantal leerlingen) i.p.v. de volledige
// identities-boom lezen bij elke docentenportaal-load (CLAUDE.md-restpunt).
// Eenmalige, idempotente self-healing migratie: zolang usedKlascodes/_seeded
// nog niet bestaat, doet dit precies ÉÉN keer ooit de oude volledige
// identities-read om de index te vullen — daarna bouwt bmIdentCreate()
// (battle.js) 'm vanzelf verder op bij elke nieuwe leerling, nooit meer een
// volledige read nodig. Zelfde idempotente-seed-patroon als
// twEnsureCampaignSeeded() (totalwar.js).
FBNet._ensureUsedKlascodesIndex = function(){
  if(!fbDB) initFirebase();
  return fbDB.ref("usedKlascodes/_seeded").once("value").then(seeded=>{
    if(seeded.val()) return;
    return fbDB.ref("identities").once("value").then(iSnap=>{
      const upd={};
      if(iSnap.exists()) iSnap.forEach(klasNode=>{ upd["usedKlascodes/"+klasNode.key]=klasNode.numChildren(); });
      upd["usedKlascodes/_seeded"]=true;
      return fbDB.ref().update(upd);
    });
  });
};
FBNet.getKlascodes = function(){
  if(!fbDB) initFirebase();
  return fbDB.ref("klascodes").once("value").then(snap=>{
    const approved=snap.exists()?Object.keys(snap.val()):[];
    return FBNet._ensureUsedKlascodesIndex().then(()=>
      fbDB.ref("usedKlascodes").once("value").then(iSnap=>{
        const used=iSnap.exists()?Object.keys(iSnap.val()).filter(k=>k!=="_seeded"):[];
        return {approved, used};
      })
    );
  });
};
// Ledenaantal per klascode ({CODE: aantal}) — leest nu de lichte usedKlascodes-
// index i.p.v. de volledige identities-tak. Gebruikt door het docentenportaal
// om live tellingen te tonen (groep = klascode).
FBNet.getKlascodeCounts = function(){
  if(!fbDB) initFirebase();
  return FBNet._ensureUsedKlascodesIndex().then(()=>
    fbDB.ref("usedKlascodes").once("value").then(snap=>{
      const counts=snap.val()||{};
      delete counts._seeded;
      return counts;
    })
  );
};
// Docent past de getoonde naam van een leerling aan (inlogcode blijft gelijk).
FBNet.renameIdentity = function(klas, lid, name){
  if(!fbDB) initFirebase();
  return fbDB.ref("identities/"+klas.toUpperCase()+"/"+lid+"/name").set(name);
};
// Docent verwijdert een leerlingprofiel volledig.
FBNet.deleteIdentity = function(klas, lid){
  if(!fbDB) initFirebase();
  return fbDB.ref("identities/"+klas.toUpperCase()+"/"+lid).remove();
};
// Verhuist een leerlingprofiel naar een andere klascode (bv. bij een typefout in
// de code). admin en googleUid vallen bewust weg: admin is klas-specifiek, en de
// docent kan googleLinks/{uid} niet herschrijven (rules: alleen de eigenaar), dus
// een gekoppeld Google-account moet opnieuw gekoppeld worden. Geeft {hadGoogle}
// terug zodat het portaal daarvoor kan waarschuwen.
FBNet.moveIdentity = function(fromKlas, toKlas, lid){
  if(!fbDB) initFirebase();
  fromKlas=fromKlas.toUpperCase(); toKlas=toKlas.toUpperCase();
  const fromRef=fbDB.ref("identities/"+fromKlas+"/"+lid);
  return fromRef.once("value").then(snap=>{
    if(!snap.exists()) return Promise.reject("Leerling niet gevonden.");
    const data=snap.val()||{};
    const hadGoogle=!!data.googleUid;
    delete data.admin; delete data.googleUid;
    const updates={};
    updates["identities/"+toKlas+"/"+lid]=data;
    updates["identities/"+fromKlas+"/"+lid]=null;
    return fbDB.ref().update(updates).then(()=>({hadGoogle}));
  });
};
// Vertaalt een rauwe Firebase-foutmelding naar een begrijpelijke tekst voor
// klascode-acties. Gebruikt voor elke klascodes/-schrijfactie: sinds het
// ownerUid-model (per-docent scheiding) kan "permission denied" ook gewoon
// betekenen dat een andere docent deze code al beheert.
FBNet._friendlyKlascodeError = function(e, fallback){
  const msg=(e && e.message) || String(e||"");
  if((e && e.code==="PERMISSION_DENIED") || /permission_denied/i.test(msg))
    return "Geen toegang tot deze klascode — waarschijnlijk beheert een andere docent 'm.";
  return msg || fallback || "Onbekende fout.";
};
// Maakt een klascode aan óf claimt 'm — via een transactie i.p.v. een blinde
// .set(), zodat drie situaties correct worden afgehandeld:
//  - code bestaat nog niet: aanmaken, ownerUid = ingelogde docent;
//  - code bestaat al maar heeft nog geen ownerUid ("legacy", van vóór de
//    per-docent-scheiding): claimen, zodat 'm geleidelijk migreert naar het
//    nieuwe model zonder bestaande klassen te breken (zie CLAUDE.md);
//  - code is al eigendom van deze docent: no-op (idempotent, elke aanroep
//    hierboven — bv. tpReconcileClassKlascodes — mag 'm gerust herhalen);
//  - code is al eigendom van een ANDERE docent: transactie committeert niet,
//    duidelijke foutmelding i.p.v. de eigenaar-code stilletjes over te nemen.
FBNet.createKlascode = function(code){
  code=(code||"").trim().toUpperCase();
  if(!fbDB) initFirebase();
  const uid=this.getTeacherUid();
  if(!uid) return Promise.reject("Geen docent ingelogd.");
  return fbDB.ref("klascodes/"+code).transaction(cur=>{
    if(cur===null) return {created:Date.now(), ownerUid:uid};
    if(!cur.ownerUid) return {...cur, ownerUid:uid};
    if(cur.ownerUid===uid) return cur;
    return; // undefined => transactie afbreken; code blijft van de ander
  }).then(({committed, snapshot})=>{
    if(committed) return;
    const owner=snapshot && snapshot.exists() ? snapshot.val().ownerUid : null;
    if(owner && owner!==uid) return Promise.reject("Deze klascode is al in gebruik door een andere docent.");
    return Promise.reject("Klascode aanmaken mislukt.");
  }, e=>Promise.reject(FBNet._friendlyKlascodeError(e,"Klascode aanmaken mislukt.")));
};
FBNet.deleteKlascode = function(code){
  if(!fbDB) initFirebase();
  return fbDB.ref("klascodes/"+code.toUpperCase()).remove()
    .catch(e=>Promise.reject(FBNet._friendlyKlascodeError(e,"Verwijderen mislukt.")));
};
FBNet.validateKlascode = function(code){
  if(!fbDB) return Promise.resolve(true); // offline: altijd toestaan
  return fbDB.ref("klascodes/"+code.toUpperCase()).once("value").then(s=>s.exists());
};
FBNet.setAdminFlag = function(klascode, name){
  if(!fbDB) initFirebase();
  return fbDB.ref("identities/"+klascode).once("value").then(snap=>{
    if(!snap.exists()) return Promise.reject("Klas '"+klascode+"' niet gevonden.");
    const updates={};
    snap.forEach(child=>{
      if((child.val().name||"").toLowerCase()===name.toLowerCase())
        updates["identities/"+klascode+"/"+child.key+"/admin"]=true;
    });
    if(!Object.keys(updates).length) return Promise.reject("Naam '"+name+"' niet gevonden in klas "+klascode+".");
    return fbDB.ref().update(updates).then(()=>Object.keys(updates).length);
  });
};

/* ---- Google-koppeling voor leerlingidentiteit (optioneel, naast klascode+leerlingcode) ----
   Leerlingen loggen NOOIT verplicht in via Firebase Auth; dit is puur een extra manier om
   een bestaand identities/{klas}/{lid}-profiel te herkennen op een nieuw toestel, via
   Google Sign-In. Geen restrictie tot een schooldomein: elk Google-account mag koppelen. */
const BM_GOOGLE_REDIRECT_KEY = "certamen_google_redirect_intent";

// Gebruikt altijd signInWithRedirect (volledige pagina-doorverwijzing), nooit een popup:
// signInWithPopup blijkt in de praktijk (o.a. gewone desktop Chrome) stil geblokkeerd te
// worden zodra de SDK eerst asynchroon config moet ophalen — daarna telt de browser het
// niet meer als directe reactie op de klik en verschijnt er zonder foutmelding geen venster.
// Een redirect kan niet stil mislukken, en werkt daardoor ook betrouwbaar op iPad/Chromebook.
function bmGoogleSignIn(intent){
  if(!initFirebase()) return Promise.reject("Firebase niet beschikbaar");
  const provider = new firebase.auth.GoogleAuthProvider();
  provider.setCustomParameters({prompt:"select_account"});
  try{ localStorage.setItem(BM_GOOGLE_REDIRECT_KEY, JSON.stringify(intent)); }catch(e){}
  return firebase.auth().signInWithRedirect(provider)
    .then(()=>({ok:false, redirecting:true}))
    .catch(err=>{
      try{ localStorage.removeItem(BM_GOOGLE_REDIRECT_KEY); }catch(e){}
      return {ok:false, error:"Google-inloggen mislukt: "+(err?.message||err||"onbekende fout")};
    });
}

// Rondt een Google-inlog af die via signInWithRedirect is gestart (bv. omdat de popup
// geblokkeerd werd). Moet bij elke app-start aangeroepen worden, vóór de normale
// go("home")/go("join")-routering, en geeft true terug als er iets is afgehandeld.
function bmGoogleHandleRedirectResult(){
  if(!hasFirebase || !initFirebase()) return Promise.resolve(false);
  let intent=null;
  try{ const r=localStorage.getItem(BM_GOOGLE_REDIRECT_KEY); if(r){ intent=JSON.parse(r); localStorage.removeItem(BM_GOOGLE_REDIRECT_KEY); } }catch(e){}
  if(!intent) return Promise.resolve(false);
  return firebase.auth().getRedirectResult().then(async result=>{
    if(!result || !result.user) return false;
    const uid=result.user.uid;
    if(intent.action==="link" && intent.klas && intent.lid){
      const w=await bmGoogleWriteLink(uid, intent.klas, intent.lid);
      if(!w.ok && typeof toast==="function") toast("Koppelen mislukt", w.error);
      else if(w.ok && typeof toast==="function") toast("Gekoppeld!","Je kunt nu ook met dit Google-account inloggen op een nieuw toestel.");
    }else if(intent.action==="login" && typeof bmGoogleFinishLogin==="function"){
      const fin=await bmGoogleFinishLogin(uid);
      if(fin.ok && typeof BM_IDENT_RETURN!=="undefined") intent.returnScreen=BM_IDENT_RETURN||"battleJoin";
      else if(!fin.ok && typeof toast==="function") toast("Inloggen mislukt", fin.error);
    }
    if(intent.returnScreen && typeof go==="function") go(intent.returnScreen);
    return true;
  }).catch(()=>false);
}

function bmGoogleLookupLink(uid){
  if(!fbDB) initFirebase();
  if(!fbDB) return Promise.resolve(null);
  return fbDB.ref("googleLinks/"+uid).once("value").then(s=>s.exists()?s.val():null);
}

async function bmGoogleWriteLink(uid, klas, lid){
  if(!fbDB) initFirebase();
  if(!fbDB) return {ok:false, error:"Firebase niet beschikbaar"};
  try{
    const [identSnap, linkSnap]=await Promise.all([
      fbDB.ref("identities/"+klas+"/"+lid+"/googleUid").once("value"),
      fbDB.ref("googleLinks/"+uid).once("value")
    ]);
    if(identSnap.exists() && identSnap.val()!==uid){
      return {ok:false, error:"Dit profiel is al gekoppeld aan een ander Google-account. Ontkoppel eerst."};
    }
    if(linkSnap.exists() && (linkSnap.val().klas!==klas || linkSnap.val().lid!==lid)){
      return {ok:false, error:"Dit Google-account is al gekoppeld aan een ander profiel. Ontkoppel dat eerst als je wilt wisselen."};
    }
    const updates={};
    updates["identities/"+klas+"/"+lid+"/googleUid"]=uid;
    updates["googleLinks/"+uid]={klas, lid, linkedAt: firebase.database.ServerValue.TIMESTAMP};
    await fbDB.ref().update(updates);
    return {ok:true};
  }catch(e){ return {ok:false, error:"Koppelen mislukt: "+(e?.message||e||"onbekende fout")}; }
}

async function bmGoogleRemoveLink(uid, klas, lid){
  if(!fbDB) initFirebase();
  if(!fbDB) return {ok:false, error:"Firebase niet beschikbaar"};
  try{
    const updates={};
    updates["identities/"+klas+"/"+lid+"/googleUid"]=null;
    updates["googleLinks/"+uid]=null;
    await fbDB.ref().update(updates);
    return {ok:true};
  }catch(e){ return {ok:false, error:"Ontkoppelen mislukt: "+(e?.message||e||"onbekende fout")}; }
}

/* ---- DemoNet: in-memory spiegel voor oefenmodus ---- */
let _demoTeacherLoggedIn = false;
let _demoClasses = {
  "class_g2a":{
    className:"G2A (Demo)",
    students:{
      "st_1":{ displayName:"Thomas (Demo)", coins:150, level:3 },
      "st_2":{ displayName:"Sophie (Demo)", coins:340, level:6 }
    }
  }
};
DemoNet.loginTeacher = function(){ _demoTeacherLoggedIn = true; return Promise.resolve("demo_teacher_uid"); };
DemoNet.logoutTeacher = function(){ _demoTeacherLoggedIn = false; return Promise.resolve(); };
DemoNet.getTeacherUid = function(){ return _demoTeacherLoggedIn ? "demo_teacher_uid" : null; };
DemoNet.isTeacherLoggedIn = function(){ return _demoTeacherLoggedIn; };
DemoNet.getClasses = function(){ return Promise.resolve(JSON.parse(JSON.stringify(_demoClasses))); };
DemoNet.saveClass = function(classId, className){
  if(!_demoClasses[classId]) _demoClasses[classId] = { className:className, students:{} };
  else _demoClasses[classId].className = className;
  return Promise.resolve();
};
DemoNet.deleteClass = function(classId){ delete _demoClasses[classId]; return Promise.resolve(); };
DemoNet.deleteStudent = function(classId, studentId){
  if(_demoClasses[classId]?.students) delete _demoClasses[classId].students[studentId];
  return Promise.resolve();
};
DemoNet.moveStudent = function(fromClassId, toClassId, studentId, studentData){
  if(_demoClasses[fromClassId]?.students) delete _demoClasses[fromClassId].students[studentId];
  if(_demoClasses[toClassId]){
    if(!_demoClasses[toClassId].students) _demoClasses[toClassId].students = {};
    _demoClasses[toClassId].students[studentId] = studentData;
  }
  return Promise.resolve();
};
DemoNet.setClassCode    = function(classId, code){ if(_demoClasses[classId]) _demoClasses[classId].code=code.toUpperCase(); return Promise.resolve(); };
DemoNet.setAdminFlag    = function(){ return Promise.reject("Niet beschikbaar in demo-modus."); };
DemoNet.removeAdminFlag = function(){ return Promise.reject("Niet beschikbaar in demo-modus."); };
DemoNet.grantAdmin      = function(){ return Promise.reject("Niet beschikbaar in demo-modus."); };
DemoNet.assignStudent   = function(){ return Promise.reject("Niet beschikbaar in demo-modus."); };
DemoNet.deleteRoom      = function(){ return Promise.resolve(); };
DemoNet.createKlascode  = function(){ return Promise.reject("Niet beschikbaar in demo-modus."); };
DemoNet.deleteKlascode  = function(){ return Promise.reject("Niet beschikbaar in demo-modus."); };
DemoNet.validateKlascode= function(){ return Promise.resolve(true); };

// In demo-modus bestaat er geen echte identities-tak. We spiegelen "groep = code"
// op de in-memory _demoClasses: de code is de afgeleide klascode van de klasnaam
// (zelfde regex als tpDeriveKlascode in games.js).
function _demoCodeOf(cls){ return (cls.className||"").toUpperCase().replace(/[^A-Z0-9]/g,""); }
function _demoCidByCode(code){
  code=(code||"").toUpperCase();
  for(const cid in _demoClasses){ if(_demoCodeOf(_demoClasses[cid])===code) return cid; }
  return null;
}
DemoNet.getKlascodes = function(){
  const codes=Object.values(_demoClasses).map(_demoCodeOf).filter(Boolean);
  return Promise.resolve({approved:codes, used:codes});
};
DemoNet.getKlascodeCounts = function(){
  const counts={};
  for(const cid in _demoClasses){ const c=_demoCodeOf(_demoClasses[cid]); if(c) counts[c]=Object.keys(_demoClasses[cid].students||{}).length; }
  return Promise.resolve(counts);
};
DemoNet.getIdentities = function(code){
  const cid=_demoCidByCode(code);
  if(!cid) return Promise.reject("Klas '"+code+"' niet gevonden.");
  const out={};
  Object.entries(_demoClasses[cid].students||{}).forEach(([sid,s])=>{
    out[sid]={name:s.displayName||sid, level:s.level, coins:s.coins};
  });
  return Promise.resolve(out);
};
DemoNet.renameIdentity = function(code, lid, name){
  const cid=_demoCidByCode(code);
  if(cid && _demoClasses[cid].students?.[lid]) _demoClasses[cid].students[lid].displayName=name;
  return Promise.resolve();
};
DemoNet.deleteIdentity = function(code, lid){
  const cid=_demoCidByCode(code);
  if(cid && _demoClasses[cid].students) delete _demoClasses[cid].students[lid];
  return Promise.resolve();
};
DemoNet.moveIdentity = function(fromCode, toCode, lid){
  const fc=_demoCidByCode(fromCode), tc=_demoCidByCode(toCode);
  if(fc && tc && _demoClasses[fc].students?.[lid]){
    const d=_demoClasses[fc].students[lid];
    delete _demoClasses[fc].students[lid];
    if(!_demoClasses[tc].students) _demoClasses[tc].students={};
    _demoClasses[tc].students[lid]=d;
  }
  return Promise.resolve({hadGoogle:false});
};

