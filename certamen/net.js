
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
  return fbDB.ref("identities/"+klascode+"/"+lid+"/admin").remove();
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
FBNet.getKlascodes = function(){
  if(!fbDB) initFirebase();
  return fbDB.ref("klascodes").once("value").then(snap=>{
    const approved=snap.exists()?Object.keys(snap.val()):[];
    return fbDB.ref("identities").once("value").then(iSnap=>{
      const used=iSnap.exists()?Object.keys(iSnap.val()):[];
      return {approved, used};
    });
  });
};
FBNet.createKlascode = function(code){
  if(!fbDB) initFirebase();
  return fbDB.ref("klascodes/"+code.toUpperCase()).set({created:Date.now()});
};
FBNet.deleteKlascode = function(code){
  if(!fbDB) initFirebase();
  return fbDB.ref("klascodes/"+code.toUpperCase()).remove();
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

function bmGoogleSignIn(intent){
  if(!initFirebase()) return Promise.reject("Firebase niet beschikbaar");
  const provider = new firebase.auth.GoogleAuthProvider();
  provider.setCustomParameters({prompt:"select_account"});
  return firebase.auth().signInWithPopup(provider)
    .then(cred=>({ok:true, uid:cred.user.uid, email:cred.user.email, displayName:cred.user.displayName}))
    .catch(err=>{
      const fallbackCodes=["auth/popup-blocked","auth/popup-closed-by-user","auth/cancelled-popup-request","auth/operation-not-supported-in-this-environment"];
      if(intent && fallbackCodes.includes(err.code)){
        try{ localStorage.setItem(BM_GOOGLE_REDIRECT_KEY, JSON.stringify(intent)); }catch(e){}
        return firebase.auth().signInWithRedirect(provider).then(()=>({ok:false, redirecting:true}));
      }
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
DemoNet.setAdminFlag    = function(){ return Promise.reject("Niet beschikbaar in demo-modus."); };
DemoNet.removeAdminFlag = function(){ return Promise.reject("Niet beschikbaar in demo-modus."); };
DemoNet.assignStudent   = function(){ return Promise.reject("Niet beschikbaar in demo-modus."); };
DemoNet.deleteRoom      = function(){ return Promise.resolve(); };
DemoNet.getIdentities   = function(){ return Promise.reject("Niet beschikbaar in demo-modus."); };
DemoNet.getKlascodes    = function(){ return Promise.resolve({approved:[],used:[]}); };
DemoNet.createKlascode  = function(){ return Promise.reject("Niet beschikbaar in demo-modus."); };
DemoNet.deleteKlascode  = function(){ return Promise.reject("Niet beschikbaar in demo-modus."); };
DemoNet.validateKlascode= function(){ return Promise.resolve(true); };

