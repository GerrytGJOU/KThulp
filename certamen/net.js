
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
DemoNet.setAdminFlag = function(){ return Promise.reject("Niet beschikbaar in demo-modus."); };
DemoNet.removeAdminFlag = function(){ return Promise.reject("Niet beschikbaar in demo-modus."); };
DemoNet.deleteRoom = function(){ return Promise.resolve(); };
DemoNet.getIdentities = function(){ return Promise.reject("Niet beschikbaar in demo-modus."); };

