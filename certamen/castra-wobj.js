/* ============================================================================
   CASTRA HEROUM — WERELDOBJECTEN EN OPDRACHTTYPES (zoeken, inleveren, puzzelen)
   ----------------------------------------------------------------------------
   In elke regio staan nu dingen om te doen, naast het gras en de helden:
     chest   kist met buit; per dag eenmaal te openen (komt de volgende dag terug)
     pickup  voorwerp op de grond (✨): erop lopen = oppakken (alleen tijdens de zoekopdracht)
     npc     persoon met een opdracht (dialoogvenster met portret):
               quest    zoekopdracht: vind het voorwerp en breng het terug
               builder  inleveropdracht: lever grondstoffen in, het gebouw verschijnt op de kaart
               puzzle   Latijnse puzzel (zin in de goede volgorde / woord en betekenis)
     bld     gebouwd gebouw met een dagelijks effect:
               heal  = put (al je gewonde soldaten genezen), of dagelijks grondstoffen
               (graanschuur, houtzagerij, mijn)
   Per regio zijn de plekken vast (CASTRA_WPOS, gekozen met een controle op bereikbaarheid);
   de teksten volgen uit CASTRA_WREG. Beloningen schalen mee met de volgorde van de regio.
   Opslag: CASTRA.items {id:n}, CASTRA.wq {qid:{step}}, CASTRA.wchest {id:dag},
           CASTRA.wbuilt {bid:true}, CASTRA.wday {sleutel:dag}.
   Haakt in op castra-quests.js (NPC-functies) en castra-world.js; laadt NA beide en
   NA castra-tutorial.js.
   ============================================================================ */

/* ---------- voorwerpen ---------- */
const CASTRA_ITEMS = {
  amphora:    { nm:"Amphora",    icon:"🏺", nl:"amfoor" },
  lyra:       { nm:"Lyra",       icon:"🎶", nl:"lier" },
  clipeus:    { nm:"Clipeus",    icon:"🛡️", nl:"schild" },
  torques:    { nm:"Torques",    icon:"📿", nl:"halsband" },
  scarabaeus: { nm:"Scarabaeus", icon:"🪲", nl:"scarabee" },
  corona:     { nm:"Corona",     icon:"👑", nl:"kroon" },
  ebur:       { nm:"Ebur",       icon:"🦷", nl:"ivoor" },
  gladius:    { nm:"Gladius",    icon:"🗡️", nl:"zwaard" },
  galea:      { nm:"Galea",      icon:"⛑️", nl:"helm" },
  cornu:      { nm:"Cornu",      icon:"📯", nl:"hoorn" },
  arcus:      { nm:"Arcus",      icon:"🏹", nl:"boog" },
};
/* ---------- per regio: opdrachtgever, voorwerp, gebouw ---------- */
// Latijn: acc = 4e naamval, nom = 1e naamval, pn/pa = mijn (1e/4e naamval), where = waar het ligt.
const CASTRA_WREG = {
  latium:     { npc:"Agricola", folk:"rom", item:"amphora",    nom:"Amphora",    acc:"amphoram", pn:"mea",   pa:"meam", where:"in silva",     whereNl:"in het bos",       bld:"puteus" },
  graecia:    { npc:"Poeta",    folk:"gra", item:"lyra",       nom:"Lyra",       acc:"lyram",    pn:"mea",   pa:"meam", where:"in monte",     whereNl:"op de berg",       bld:"horreum" },
  troia:      { npc:"Custos",   folk:"tro", item:"clipeus",    nom:"Clipeus",    acc:"clipeum",  pn:"meus",  pa:"meum", where:"ante muros",   whereNl:"voor de muren",    bld:"lignatio" },
  gallia:     { npc:"Mercator", folk:"gal", item:"torques",    nom:"Torques",    acc:"torquem",  pn:"meus",  pa:"meum", where:"in silva",     whereNl:"in het woud",      bld:"metallum" },
  aegyptus:   { npc:"Scriba",   folk:"aeg", item:"scarabaeus", nom:"Scarabaeus", acc:"scarabaeum",pn:"meus", pa:"meum", where:"in deserto",   whereNl:"in de woestijn",   bld:"puteus" },
  persis:     { npc:"Magus",    folk:"per", item:"corona",     nom:"Corona",     acc:"coronam",  pn:"mea",   pa:"meam", where:"in montibus",  whereNl:"in de bergen",     bld:"horreum" },
  africa:     { npc:"Nauta",    folk:"car", item:"ebur",       nom:"Ebur",       acc:"ebur",     pn:"meum",  pa:"meum", where:"ad litus",     whereNl:"aan de kust",      bld:"lignatio" },
  roma:       { npc:"Gladiator",folk:"gla", item:"gladius",    nom:"Gladius",    acc:"gladium",  pn:"meus",  pa:"meum", where:"in foro",      whereNl:"op het Forum",     bld:"metallum" },
  laconia:    { npc:"Spartiates",folk:"spa",item:"galea",      nom:"Galea",      acc:"galeam",   pn:"mea",   pa:"meam", where:"ad Eurotam",   whereNl:"bij de Eurotas",   bld:"puteus" },
  germania:   { npc:"Venator",  folk:"ger", item:"cornu",      nom:"Cornu",      acc:"cornu",    pn:"meum",  pa:"meum", where:"in paludibus", whereNl:"in de moerassen",  bld:"horreum" },
  themiscyra: { npc:"Amazon",   folk:"ama", item:"arcus",      nom:"Arcus",      acc:"arcum",    pn:"meus",  pa:"meum", where:"in silva",     whereNl:"in het woud",      bld:"lignatio" },
};
// Gebouwtypes: Latijnse naam, Nederlandse naam, effect (heal of dagelijkse grondstof) en kaartstukken.
const CASTRA_WBT = {
  puteus:   { la:"Puteus",   acc:"puteum",   done:"paratus", nl:"put",        eff:"heal",              say:{ la:"Aqua milites sanat.",        nl:"Het water geneest je soldaten." },        built:[["well",0],["barrel",1]] },
  horreum:  { la:"Horreum",  acc:"horreum",  done:"paratum", nl:"graanschuur", eff:{ frumentum:40 },   say:{ la:"Horreum cibum dat.",         nl:"De graanschuur geeft elke dag graan." },  built:[["crate_a",0],["crate_b",1]] },
  lignatio: { la:"Lignatio", acc:"lignationem", done:"parata", nl:"houtzagerij", eff:{ lignum:40 },   say:{ la:"Silva ligna dat.",           nl:"De houtzagerij geeft elke dag hout." },   built:[["stump",0],["fence",1]] },
  metallum: { la:"Metallum", acc:"metallum", done:"paratum", nl:"mijn",        eff:{ aes:40 },         say:{ la:"Metallum aes dat.",          nl:"De mijn geeft elke dag brons." },         built:[["rock_grey",0],["rock_brown",1]] },
};
// Vaste plekken per regio (x,y); site = linkerhelft van de bouwplaats (de rechterhelft staat op x+1).
const CASTRA_WPOS = {
  latium:     { chests:[[4,5],[24,5],[27,17],[14,3]], pickup:[8,6],  quest:[20,21], faber:[11,16], magistra:[12,20], site:[9,16] },
  graecia:    { chests:[[6,4],[19,16],[25,2]],  pickup:[11,5], quest:[9,17],  faber:[3,3],   magistra:[21,13], site:[9,12] },
  troia:      { chests:[[24,5],[24,10],[24,19]],pickup:[18,10],quest:[23,2],  faber:[5,2],   magistra:[6,5],   site:[5,17] },
  gallia:     { chests:[[23,13],[25,9],[2,7]],  pickup:[8,7],  quest:[24,3],  faber:[19,2],  magistra:[2,3],   site:[19,7] },
  aegyptus:   { chests:[[8,6],[21,19],[21,8]],  pickup:[13,12],quest:[12,3],  faber:[7,17],  magistra:[18,5],  site:[8,9] },
  persis:     { chests:[[21,5],[9,9],[24,19]],  pickup:[3,2],  quest:[25,9],  faber:[22,16], magistra:[6,10],  site:[6,5] },
  africa:     { chests:[[23,8],[21,18],[8,18]], pickup:[8,6],  quest:[3,8],   faber:[3,13],  magistra:[19,3],  site:[19,15] },
  roma:       { chests:[[7,6],[5,17],[24,3]],   pickup:[11,5], quest:[21,19], faber:[2,3],   magistra:[25,15], site:[18,15] },
  laconia:    { chests:[[18,7],[22,18],[9,3]],  pickup:[12,10],quest:[25,5],  faber:[7,18],  magistra:[22,6],  site:[7,10] },
  germania:   { chests:[[25,3],[11,8],[7,17]],  pickup:[3,17], quest:[25,19], faber:[7,2],   magistra:[18,6],  site:[2,6] },
  themiscyra: { chests:[[8,17],[22,8],[4,4]],   pickup:[12,3], quest:[21,4],  faber:[5,16],  magistra:[19,9],  site:[22,15] },
};
const CASTRA_WNPC_ARMOR = { quest:"vodden", builder:"middel", puzzle:"robe" };
const CASTRA_WCHEST = { aes:[20,60], frumentum:[15,40], lignum:[20,50] };
// Beloningen (basis; × schaal per regio)
const CASTRA_WREWARD = { quest:{ aes:60, frumentum:30 }, puzzle:{ aes:25, frumentum:15, gloria:1 }, build:{ gloria:2 } };
// Latium behoudt zijn oorspronkelijke sleutels (bestaande saves): agricola, puteus, kist1-4, amphora.
const CASTRA_WLEG = { latium:{ qid:"agricola", bid:"puteus", chest:["kist1","kist2","kist3","kist4"] } };

const CASTRA_WBUILD = {};   // bid -> { rid, type, site:{x,y}, cost }
const CASTRA_WENT = [];     // alle entiteiten
(function(){
  const rids = Object.keys(CASTRA_WORLDS);
  rids.forEach((rid, ri)=>{
    const g = CASTRA_WREG[rid], p = CASTRA_WPOS[rid]; if(!g || !p) return;
    const leg = CASTRA_WLEG[rid] || {}, qid = leg.qid || "q_"+rid, bid = leg.bid || "b_"+rid, scale = 1 + 0.4*ri;
    (leg.chest || p.chests.map((_,i)=>"kist_"+rid+i)).forEach((id,i)=>{ if(p.chests[i]) CASTRA_WENT.push({ id, region:rid, kind:"chest", x:p.chests[i][0], y:p.chests[i][1] }); });
    CASTRA_WENT.push({ id:g.item, region:rid, kind:"pickup", item:g.item, x:p.pickup[0], y:p.pickup[1], needs:{ qid, step:1 } });
    CASTRA_WENT.push({ id:qid, region:rid, kind:"npc", role:"quest", nm:g.npc, qid, x:p.quest[0], y:p.quest[1], dir:"left" });
    CASTRA_WENT.push({ id:leg.bid ? "faber" : "f_"+rid, region:rid, kind:"npc", role:"builder", nm:"Faber", bid, x:p.faber[0], y:p.faber[1], dir:"left" });
    CASTRA_WENT.push({ id:leg.bid ? "magistra" : "m_"+rid, region:rid, kind:"npc", role:"puzzle", nm:"Magistra", x:p.magistra[0], y:p.magistra[1], dir:"right" });
    CASTRA_WENT.push({ id:bid+"_bld", region:rid, kind:"bld", bid, x:p.site[0], y:p.site[1], needsBuilt:bid });
    CASTRA_WBUILD[bid] = { rid, type:g.bld, site:{ x:p.site[0], y:p.site[1] }, cost:{ lignum:Math.round(30*scale), aes:Math.round(15*scale) }, scale, qid };
  });
})();
function castraWScale(rid){ return 1 + 0.4*Math.max(0, Object.keys(CASTRA_WORLDS).indexOf(rid)); }

/* ---------- toestand en hulpfuncties ---------- */
function castraWDay(){ return castraDay(); }
function castraWItems(){ return CASTRA.items || (CASTRA.items = {}); }
function castraWQ(id){ const q = CASTRA.wq || (CASTRA.wq = {}); return q[id] || (q[id] = { step:0 }); }
function castraWEnts(){ return CASTRA_WENT.filter(e=>e.region===CASTRA_W_REGION); }
function castraWBuilt(bid){ return !!(CASTRA.wbuilt && CASTRA.wbuilt[bid]); }
// Welke ontgrendeling een object nodig heeft (castra-unlocks.js).
function castraWFeat(e){ if(e.role==="builder" || e.kind==="bld") return "bouwen"; if(e.role==="puzzle") return "puzzels"; return "wereld"; }
function castraWEntVisible(e){
  if(typeof castraUnlocked==="function" && !castraUnlocked(castraWFeat(e))) return false;
  if(e.kind==="pickup"){
    if(castraWItems()[e.item]) return false;                            // al opgepakt
    if(e.needs && castraWQ(e.needs.qid).step!==e.needs.step) return false;
    return true;
  }
  if(e.needsBuilt) return castraWBuilt(e.needsBuilt);
  return true;
}
function castraWChestOpen(id){ return (CASTRA.wchest||{})[id]===castraWDay(); }
function castraWGive(res){
  const cap = castraWalletCap(), out = [];
  Object.keys(res).forEach(r=>{ CASTRA.res[r] = Math.min(r==="gloria"?1e9:cap, (CASTRA.res[r]||0)+res[r]); out.push(castraRes(r).icon+" +"+res[r]); });
  if(typeof castraRenderRes==="function") castraRenderRes(); return out.join("  ");
}
function castraWScaled(res, scale){ const o = {}; Object.keys(res).forEach(r=>{ o[r] = r==="gloria" ? res[r] : Math.round(res[r]*scale); }); return o; }
function castraWRoll(range, rng){ return range[0] + Math.floor(rng()*(range[1]-range[0]+1)); }
function castraWLook(e){
  const fo = CASTRA_FOLKS[(CASTRA_WREG[e.region]||{}).folk || "rom"] || CASTRA_FOLKS.rom, lk = fo.look || {};
  const base = { huid:lk.huid||"licht", haar:lk.haar||"kort", haarkleur:lk.haarkleur||"bruin", baard:"geen", cape:"geen", helm:"geen", schild:"geen", wapen:"geen" };
  if(e.id==="agricola") return { ...base, huid:"getint", haarkleur:"grijs", baard:"baard", armor:"vodden", wapen:"hooivork" };
  if(e.role==="puzzle") return { ...base, haar:"knot", armor:"robe" };
  return { ...base, armor: CASTRA_WNPC_ARMOR[e.role] || "middel" };
}

/* ---------- haken in het bestaande NPC-systeem ---------- */
// Plekken vrijhouden bij het genereren van de kaart (geen boom of hoog gras op een object).
function castraWobjSpots(rid){ return CASTRA_WENT.filter(e=>e.region===rid).map(e=>[e.x,e.y]).concat(Object.keys(CASTRA_WBUILD).filter(b=>CASTRA_WBUILD[b].rid===rid).map(b=>[CASTRA_WBUILD[b].site.x+1, CASTRA_WBUILD[b].site.y])); }
// Kaartstukken van gebouwen of de bouwplaats (solide).
function castraWobjPieces(rid){
  const out = [];
  if(typeof castraUnlocked==="function" && !castraUnlocked("bouwen")) return out;
  Object.keys(CASTRA_WBUILD).filter(b=>CASTRA_WBUILD[b].rid===rid).forEach(b=>{
    const B = CASTRA_WBUILD[b], T = CASTRA_WBT[B.type];
    if(castraWBuilt(b)) T.built.forEach(([o,dx])=>out.push({ o, x:B.site.x+dx, y:B.site.y }));
    else out.push({ o:"logs", x:B.site.x, y:B.site.y }, { o:"crate_c", x:B.site.x+1, y:B.site.y });
  });
  return out;
}
const _castraNpcAt0 = castraNpcAt;
castraNpcAt = function(x,y){
  const h = _castraNpcAt0(x,y); if(h) return h;
  if(typeof CASTRA==="undefined" || !CASTRA || typeof CASTRA_W_REGION==="undefined") return null;
  const e = castraWEnts().find(e=>e.x===x && e.y===y && e.kind!=="pickup" && castraWEntVisible(e));
  return e ? "w:"+e.id : null;
};
const _castraNpcTalk0 = castraNpcTalk;
castraNpcTalk = function(id){
  if(String(id).indexOf("w:")!==0) return _castraNpcTalk0(id);
  const e = CASTRA_WENT.find(x=>"w:"+x.id===id); if(!e) return;
  if(e.kind==="chest") castraWChest(e);
  else if(e.kind==="bld") castraWBldUse(e);
  else if(e.kind==="npc") castraWNpcTalk(e);
};
const _castraQuestHud0 = castraQuestHud;
castraQuestHud = function(){ return _castraQuestHud0() + castraWHud(); };
const _castraWorldRender0 = castraWorldRender;
castraWorldRender = function(){
  _castraWorldRender0();
  const map = el("cwMap"); if(!map) return;
  if(!el("cwWobj")){ const d = document.createElement("div"); d.id = "cwWobj"; map.insertBefore(d, el("cwAbove")); }
  castraWobjDraw();
  ["getint","licht","olijf","bruin","zeerlicht","brons","donker","zwart"].forEach(h=>castraProbeBase(h).then(castraWobjDraw));
};
const _castraWorldSavePos0 = castraWorldSavePos;
castraWorldSavePos = function(x,y){ _castraWorldSavePos0(x,y); castraWPickupCheck(x,y); };

function castraWobjDraw(){
  const box = el("cwWobj"); if(!box) return;
  box.innerHTML = castraWEnts().filter(castraWEntVisible).map(e=>{
    const pos = `position:absolute;left:${e.x*48}px;top:${e.y*48}px;width:48px;height:48px;pointer-events:none;`;
    if(e.kind==="npc") return `<div style="${pos}z-index:4">${castraAvatarHTML(castraWLook(e), e.dir||"down", 1, 48)}<div style="position:absolute;left:50%;top:-10px;transform:translateX(-50%);font-size:13px;background:#d4af37;color:#2b1d0e;border-radius:8px;padding:0 4px;font-weight:bold">!</div></div>`;
    if(e.kind==="chest"){ const open = castraWChestOpen(e.id); return `<div style="${pos}z-index:3;display:flex;align-items:center;justify-content:center;font-size:34px;${open?"opacity:.45;filter:grayscale(.6)":""}">${open?"📦":"🧰"}</div>`; }
    if(e.kind==="pickup") return `<div style="${pos}z-index:3;display:flex;align-items:center;justify-content:center;font-size:30px;animation:castraBlink 1.2s infinite">✨</div>`;
    return "";
  }).join("");
}
function castraWRefreshHud(){ const h = el("cwHud"); if(h) h.innerHTML = castraQuestHud(); }
function castraWPickupCheck(x,y){
  const e = castraWEnts().find(e=>e.kind==="pickup" && e.x===x && e.y===y && castraWEntVisible(e)); if(!e) return;
  const it = CASTRA_ITEMS[e.item]; castraWItems()[e.item] = 1; castraSave(); castraWobjDraw();
  toast(it.icon+" "+it.nm, "Je hebt een "+it.nl+" gevonden!"); castraWRefreshHud(); if(typeof castraPxpAdd==="function") castraPxpAdd(3);
}

/* ---------- kisten ---------- */
function castraWChest(e){
  if(castraWChestOpen(e.id)){ toast("📦", "Deze kist is leeg. Morgen ligt er weer iets in."); return; }
  const rng = castraRng((CASTRA.seed ^ (e.x*7919+e.y*104729))>>>0); CASTRA.seed = (CASTRA.seed+11)>>>0; const sc = castraWScale(e.region);
  const keys = Object.keys(CASTRA_WCHEST), a = keys[Math.floor(rng()*keys.length)], b = keys[Math.floor(rng()*keys.length)];
  const res = {}; res[a] = Math.round(castraWRoll(CASTRA_WCHEST[a], rng)*sc); if(b!==a && rng()<0.5) res[b] = Math.round(castraWRoll(CASTRA_WCHEST[b], rng)*sc); if(rng()<0.15) res.gloria = 1;
  (CASTRA.wchest || (CASTRA.wchest = {}))[e.id] = castraWDay();
  const txt = castraWGive(res); castraSave(); castraWobjDraw();
  toast("🧰 "+castraLaText("recte"), txt); if(typeof castraPxpAdd==="function") castraPxpAdd(4);
}

/* ---------- gebouwen met dagelijks effect ---------- */
function castraWBldUse(e){
  const B = CASTRA_WBUILD[e.bid], T = CASTRA_WBT[B.type], d = castraWDay(), w = CASTRA.wday || (CASTRA.wday = {});
  if(w[e.bid]===d){ toast(T.la, "Vandaag al gebruikt. Kom morgen terug."); return; }
  if(T.eff==="heal"){
    const hurt = (CASTRA.soldiers||[]).filter(castraIsHurt);
    if(!hurt.length){ toast("⛲ "+T.la, "Je soldaten zijn allemaal gezond."); return; }
    hurt.forEach(s=>{ s.hurtUntil = 0; }); w[e.bid] = d; castraSave();
    toast("⛲ "+castraLaText("recte"), hurt.length+" soldaat/soldaten genezen.");
  } else {
    const t = castraWGive(castraWScaled(T.eff, B.scale)); w[e.bid] = d; castraSave(); toast("🎁 "+T.la, t);
  }
}

/* ---------- teksten ---------- */
function castraWQuestText(rid){
  const g = CASTRA_WREG[rid];
  return {
    ask:[ { la:`Salve, dux {naam}! ${g.nom} ${g.pn} amisi.`, nl:`Gegroet, leider {naam}! Ik ben mijn ${CASTRA_ITEMS[g.item].nl} kwijt.` },
          { la:`Quaere ${g.acc} ${g.where}, et aes tibi dabo.`, nl:`Zoek de ${CASTRA_ITEMS[g.item].nl} ${g.whereNl}, dan geef ik je brons.` } ],
    wait:[ { la:`Ubi est ${g.nom.toLowerCase()} ${g.pn}?`, nl:`Waar is mijn ${CASTRA_ITEMS[g.item].nl}?` } ],
    done:[ { la:`${g.nom} ${g.pn}! Gratias tibi ago, dux {naam}!`, nl:`Mijn ${CASTRA_ITEMS[g.item].nl}! Dank je wel, leider {naam}!` } ],
    after:[ { la:"Vale, dux {naam}! Bene vivas!", nl:"Tot ziens, leider {naam}! Het ga je goed!" } ],
    hud:{ la:`${g.nom} quaere ${g.where}!`, nl:`Zoek de ${CASTRA_ITEMS[g.item].nl} van de ${g.npc} ${g.whereNl} (✨).` },
  };
}
function castraWBuildText(bid){
  const B = CASTRA_WBUILD[bid], T = CASTRA_WBT[B.type];
  return {
    ask:[ { la:`Salve! Faber sum. ${T.acc.charAt(0).toUpperCase()+T.acc.slice(1)} aedifico.`, nl:`Gegroet! Ik ben de bouwer. Ik bouw een ${T.nl}.` },
          { la:`Mihi opus est ${B.cost.lignum} lignis et ${B.cost.aes} aeribus.`, nl:`Ik heb ${B.cost.lignum} hout en ${B.cost.aes} brons nodig.` } ],
    built:[ { la:`${T.la} ${T.done} est! ${T.say.la}`, nl:`De ${T.nl} is klaar! ${T.say.nl}` } ],
    hud:{ la:"Ligna et aes da fabro!", nl:`Lever ${B.cost.lignum} hout en ${B.cost.aes} brons in bij de Faber, dan bouwt hij een ${T.nl}.` },
  };
}
const CASTRA_WPUZ_HI = [
  { la:"Salve, dux {naam}! Ludamus!", nl:"Gegroet, leider {naam}! Laten we spelen!" },
  { la:"Quem ludum eligis?", nl:"Welk spel kies je?", opts:[ { la:"Ordo verborum", nl:"woorden op volgorde" }, { la:"Verba iungere", nl:"woorden koppelen" }, { la:"Nunc non", nl:"nu niet" } ] },
];

function castraWSay(e, lines, done){ castraDlgOpen({ nm:e.nm, look:castraWLook(e) }, lines, done); }
function castraWNpcTalk(e){
  if(CASTRA_DLG) return;
  const rid = e.region;
  if(e.role==="quest"){
    const q = castraWQ(e.qid), T = castraWQuestText(rid), g = CASTRA_WREG[rid];
    if(q.step===0){ castraWSay(e, T.ask, ()=>{ q.step = 1; castraSave(); castraWobjDraw(); castraWRefreshHud(); }); }
    else if(q.step===1){
      if(castraWItems()[g.item]){
        castraWSay(e, T.done, ()=>{ delete castraWItems()[g.item]; q.step = 2; const t = castraWGive(castraWScaled(CASTRA_WREWARD.quest, castraWScale(rid))); castraSave(); toast(CASTRA_ITEMS[g.item].icon+" "+castraLaText("recte"), t); castraWobjDraw(); castraWRefreshHud(); if(typeof castraPxpAdd==="function") castraPxpAdd(30, "Opdracht voltooid"); if(typeof castraCardToken==="function") castraCardToken(1, "opdracht voltooid"); });
      } else castraWSay(e, T.wait, null);
    } else castraWSay(e, T.after, null);
  } else if(e.role==="builder"){
    const bid = e.bid, B = CASTRA_WBUILD[bid], T = castraWBuildText(bid), q = castraWQ("b:"+bid);
    if(castraWBuilt(bid)){ castraWSay(e, T.built, null); return; }
    q.step = 1; castraSave(); castraWRefreshHud();
    const can = castraCanPay(B.cost);
    const lines = T.ask.concat([ can ? { la:"Visne mihi ligna et aes dare?", nl:"Wil je mij hout en brons geven?", opts:[ { la:"Do", nl:"geven" }, { la:"Nondum", nl:"nog niet" } ] }
                                     : { la:"Nondum satis habes.", nl:"Je hebt nog niet genoeg." } ]);
    castraWSay(e, lines, k=>{
      if(k===0 && castraCanPay(B.cost)){
        castraPay(B.cost); (CASTRA.wbuilt || (CASTRA.wbuilt = {}))[bid] = true;
        const t = castraWGive(CASTRA_WREWARD.build); castraSave();
        CASTRA_WORLD_BUILT[B.rid] = null;                       // kaart opnieuw opbouwen met het gebouw
        castraWorldRender(); toast("🏗️ "+CASTRA_WBT[B.type].la, "Gebouwd! "+t); castraWRefreshHud(); if(typeof castraPxpAdd==="function") castraPxpAdd(40, "Gebouwd"); if(typeof castraCardToken==="function") castraCardToken(1, "gebouwd");
      }
    });
  } else if(e.role==="puzzle"){
    castraWSay(e, CASTRA_WPUZ_HI, k=>{ if(k===0) castraPuzzleOpen("order"); else if(k===1) castraPuzzleOpen("match"); });
  }
}
function castraWHudList(rid){
  const out = [], g = CASTRA_WREG[rid]; if(!g) return out;
  const qid = (CASTRA_WLEG[rid]||{}).qid || "q_"+rid, bid = (CASTRA_WLEG[rid]||{}).bid || "b_"+rid;
  if(castraWQ(qid).step===1) out.push({ ...castraWQuestText(rid).hud, rid });
  if(castraWQ("b:"+bid).step===1 && !castraWBuilt(bid)) out.push({ ...castraWBuildText(bid).hud, rid });
  return out;
}
function castraWHud(){
  return castraWHudList(CASTRA_W_REGION).map((t,i)=>`<div class="note" style="text-align:center">📜 ${castraLaHTML(t.la, t.nl, "whud"+i)}</div>`).join("");
}
// Opdrachten voor het menu (Opus): alle regio's
function castraWobjOpus(){
  const out = [];
  Object.keys(CASTRA_WREG).forEach(rid=>castraWHudList(rid).forEach(t=>out.push({ la:t.la, nl:(CASTRA_WORLDS[rid]?CASTRA_WORLDS[rid].nm+": ":"")+t.nl })));
  return out;
}

/* ---------- Latijnse puzzels ---------- */
const CASTRA_PUZ_ORDER = [
  { la:"Aeneas Troiam relinquit.", nl:"Aeneas verlaat Troje." },
  { la:"Romulus urbem condit.", nl:"Romulus sticht de stad." },
  { la:"Milites in castris dormiunt.", nl:"De soldaten slapen in het kamp." },
  { la:"Dux hostes vincit.", nl:"De leider verslaat de vijanden." },
  { la:"Equites ad portam veniunt.", nl:"De ruiters komen naar de poort." },
  { la:"Sagittarii hostes vident.", nl:"De boogschutters zien de vijanden." },
];
const CASTRA_PUZ_MATCH = [
  ["miles","soldaat"], ["castra","kamp"], ["hostis","vijand"], ["dux","leider"], ["porta","poort"],
  ["urbs","stad"], ["equus","paard"], ["aqua","water"], ["silva","bos"], ["navis","schip"],
];
let CASTRA_PUZ = null;
function castraPuzzleOpen(kind){
  const rng = castraRng((castraNow() ^ CASTRA.seed)>>>0); CASTRA.seed = (CASTRA.seed+3)>>>0;
  if(kind==="order"){
    const p = CASTRA_PUZ_ORDER[Math.floor(rng()*CASTRA_PUZ_ORDER.length)], words = p.la.split(" ");
    const idx = words.map((_,i)=>i); for(let i=idx.length-1;i>0;i--){ const j = Math.floor(rng()*(i+1)); [idx[i],idx[j]] = [idx[j],idx[i]]; }
    if(idx.every((v,i)=>v===i)) idx.reverse();
    CASTRA_PUZ = { kind, rid:CASTRA_W_REGION, p, words, pool:idx, got:[], fails:0, done:false };
  } else {
    const pairs = CASTRA_PUZ_MATCH.slice().sort(()=>rng()-0.5).slice(0,4);
    const right = pairs.map((_,i)=>i).sort(()=>rng()-0.5);
    CASTRA_PUZ = { kind, rid:CASTRA_W_REGION, pairs, right, solved:{}, selL:null, fails:0, done:false };
  }
  castraPuzzleRender();
}
function castraPuzzleClose(){ CASTRA_PUZ = null; const p = el("cwPanel"); if(p) p.innerHTML = ""; }
function castraPuzzleKey(){ return "puzzle_"+(CASTRA_PUZ?CASTRA_PUZ.rid:CASTRA_W_REGION); }
function castraPuzzleReward(){
  const Z = CASTRA_PUZ; Z.done = true;
  const w = CASTRA.wday || (CASTRA.wday = {}), k = castraPuzzleKey();
  if(w[k]!==castraWDay()){ w[k] = castraWDay(); const t = castraWGive(castraWScaled(CASTRA_WREWARD.puzzle, castraWScale(Z.rid))); castraSave(); toast("🧩 "+castraLaText("recte"), t); if(typeof castraPxpAdd==="function") castraPxpAdd(12); }
}
function castraPuzzleRender(){
  const Z = CASTRA_PUZ, panel = el("cwPanel"); if(!Z || !panel) return;
  const first = (CASTRA.wday||{})[castraPuzzleKey()]!==castraWDay();
  const head = `<h3 style="margin:0 0 6px">🧩 Magistra <small>${first?"eerste keer vandaag in deze regio: beloning!":"geen beloning meer vandaag in deze regio, oefenen mag"}</small></h3>`;
  const foot = `<div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap">
      <button class="btn" style="min-height:44px" onclick="castraPuzzleClose()">Sluiten</button>
      ${Z.done?`<button class="btn btn-gold" style="min-height:44px" onclick="castraPuzzleOpen('${Z.kind}')">Nog een keer</button>`:""}</div>`;
  if(Z.kind==="order"){
    const built = Z.got.map(i=>Z.words[i]).join(" ");
    const chips = Z.pool.filter(i=>!Z.got.includes(i)).map(i=>`<button class="btn" style="margin:3px;min-height:44px;font-size:17px" onclick="castraPuzzleTap(${i})">${esc(Z.words[i])}</button>`).join("");
    panel.innerHTML = `<div class="panel">${head}
      <div style="font-size:15px;margin-bottom:6px">Zet de woorden in de goede volgorde. Betekenis: <i>${esc(Z.p.nl)}</i></div>
      <div style="min-height:44px;padding:8px;border:2px dashed #8a6d2f;border-radius:8px;font-size:19px">${built?esc(built):"<span style='opacity:.5'>tik op de woorden hieronder…</span>"}</div>
      <div style="margin-top:6px">${chips}</div>
      ${Z.got.length?`<button class="btn" style="margin-top:4px" onclick="CASTRA_PUZ.got.pop();castraPuzzleRender()">↶ Terug</button>`:""}
      ${Z.done?`<div class="note" style="margin-top:8px;font-size:17px">✔ ${castraLaHTML(Z.p.la, Z.p.nl, "puz_"+Z.p.la)}</div>`:""}
      ${Z.fails?`<div class="note">Nog niet goed — probeer opnieuw (${Z.fails}×).</div>`:""}${foot}</div>`;
  } else {
    const L = Z.pairs.map((p,i)=>{ const ok = Z.solved[i], sel = Z.selL===i;
      return `<button class="btn ${sel?"btn-gold":""}" ${ok?"disabled":""} style="display:block;margin:4px 0;min-height:44px;width:100%;font-size:17px" onclick="castraPuzzleLeft(${i})">${ok?"✔ ":""}${esc(p[0])}</button>`; }).join("");
    const R = Z.right.map(i=>{ const ok = Z.solved[i];
      return `<button class="btn" ${ok?"disabled":""} style="display:block;margin:4px 0;min-height:44px;width:100%;font-size:17px" onclick="castraPuzzleRight(${i})">${ok?"✔ ":""}${esc(Z.pairs[i][1])}</button>`; }).join("");
    panel.innerHTML = `<div class="panel">${head}<div style="font-size:15px;margin-bottom:6px">Koppel elk Latijns woord aan zijn betekenis: tik links een woord, dan rechts de vertaling.</div>
      <div style="display:flex;gap:10px"><div style="flex:1">${L}</div><div style="flex:1">${R}</div></div>
      ${Z.done?`<div class="note" style="margin-top:8px;font-size:17px">✔ ${castraLa("recte")}</div>`:""}
      ${Z.fails?`<div class="note">${Z.fails}× fout — probeer opnieuw.</div>`:""}${foot}</div>`;
  }
  panel.scrollIntoView({ behavior:"smooth", block:"nearest" });
}
function castraPuzzleTap(i){
  const Z = CASTRA_PUZ; if(!Z || Z.done) return;
  Z.got.push(i);
  if(Z.got.length===Z.words.length){
    if(Z.got.map(k=>Z.words[k]).join(" ")===Z.p.la) castraPuzzleReward();
    else { Z.fails++; Z.got = []; toast(castraLaText("non_recte"), "Probeer het nog eens."); }
  }
  castraPuzzleRender();
}
function castraPuzzleLeft(i){ const Z = CASTRA_PUZ; if(!Z || Z.done || Z.solved[i]) return; Z.selL = i; castraPuzzleRender(); }
function castraPuzzleRight(i){
  const Z = CASTRA_PUZ; if(!Z || Z.done || Z.solved[i] || Z.selL===null) return;
  if(Z.selL===i){ Z.solved[i] = true; Z.selL = null; if(Object.keys(Z.solved).length===Z.pairs.length) castraPuzzleReward(); }
  else { Z.fails++; Z.selL = null; toast(castraLaText("non_recte"), "Dat hoort niet bij elkaar."); }
  castraPuzzleRender();
}
