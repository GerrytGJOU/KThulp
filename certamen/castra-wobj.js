/* ============================================================================
   CASTRA HEROUM — WERELDOBJECTEN EN OPDRACHTTYPES (zoeken, inleveren, puzzelen)
   ----------------------------------------------------------------------------
   Naast het gras en de helden staan er nu dingen in de regio's:
     chest   kist met buit; per dag eenmaal te openen (komt de volgende dag terug)
     pickup  voorwerp dat op de grond ligt (✨): erop lopen = oppakken
     npc     persoon met een opdracht (dialoogvenster met portret):
               fetch    zoek een voorwerp en breng het terug
               build    lever grondstoffen in; het gebouw verschijnt op de kaart
               puzzle   Latijnse puzzel (zin in de goede volgorde / woord en betekenis)
     well    gebouwde put: eenmaal per dag worden al je gewonde soldaten beter
   Demo in Latium; andere regio's volgen door entiteiten toe te voegen aan CASTRA_WENT.
   Opslag: CASTRA.items {id:n}, CASTRA.wq {npcId:{step}}, CASTRA.wchest {id:dag},
           CASTRA.wbuilt {id:true}, CASTRA.wday {sleutel:dag}.
   Haakt in op castra-quests.js (NPC-functies) en castra-world.js; laadt NA beide en
   NA castra-tutorial.js.
   ============================================================================ */

const CASTRA_ITEMS = {
  amphora: { nm:"Amphora", icon:"🏺", nl:"amfoor" },
};
const CASTRA_WNPC_LOOK = {
  agricola: { huid:"getint", haar:"kort", haarkleur:"grijs", baard:"baard", armor:"vodden", cape:"geen", helm:"geen", schild:"geen", wapen:"hooivork" },
  faber:    { huid:"licht",  haar:"kort", haarkleur:"bruin", baard:"geen",  armor:"middel", cape:"geen", helm:"geen", schild:"geen", wapen:"geen" },
  magistra: { huid:"olijf",  haar:"knot", haarkleur:"zwart", baard:"geen",  armor:"robe",  cape:"geen", helm:"geen", schild:"geen", wapen:"geen" },
};
const CASTRA_WENT = [
  { id:"kist1", region:"latium", kind:"chest", x:4,  y:5 },
  { id:"kist2", region:"latium", kind:"chest", x:24, y:5 },
  { id:"kist3", region:"latium", kind:"chest", x:27, y:17 },
  { id:"kist4", region:"latium", kind:"chest", x:14, y:3 },
  { id:"amphora", region:"latium", kind:"pickup", item:"amphora", x:8, y:6, needs:{ npc:"agricola", step:1 } },
  { id:"agricola", region:"latium", kind:"npc", nm:"Agricola", x:20, y:21, dir:"left" },
  { id:"faber",    region:"latium", kind:"npc", nm:"Faber",    x:11, y:16, dir:"left" },
  { id:"magistra", region:"latium", kind:"npc", nm:"Magistra", x:12, y:20, dir:"right" },
  { id:"puteus",   region:"latium", kind:"well", x:9, y:16, needsBuilt:"puteus" },
];
const CASTRA_WBUILD = { puteus:{ nm:"Puteus", site:{ x:9, y:16 }, cost:{ lignum:30, aes:15 } } };
const CASTRA_WCHEST = { aes:[20,60], frumentum:[15,40], lignum:[20,50] };
const CASTRA_WREWARD = { agricola:{ aes:60, frumentum:30 }, puzzle:{ aes:25, frumentum:15, gloria:1 }, build:{ gloria:2 } };

/* ---------- toestand en hulpfuncties ---------- */
function castraWDay(){ return castraDay(); }
function castraWItems(){ return CASTRA.items || (CASTRA.items = {}); }
function castraWQ(id){ const q = CASTRA.wq || (CASTRA.wq = {}); return q[id] || (q[id] = { step:0 }); }
function castraWEnts(){ return CASTRA_WENT.filter(e=>e.region===CASTRA_W_REGION); }
function castraWEntVisible(e){
  if(e.kind==="pickup"){
    if(castraWItems()[e.item]) return false;                            // al opgepakt
    if(e.needs){ const q = castraWQ(e.needs.npc); if(q.step!==e.needs.step) return false; }
    return true;
  }
  if(e.needsBuilt) return !!(CASTRA.wbuilt && CASTRA.wbuilt[e.needsBuilt]);
  return true;
}
function castraWChestOpen(id){ return (CASTRA.wchest||{})[id]===castraWDay(); }
function castraWGive(res){
  const cap = castraWalletCap(), out = [];
  Object.keys(res).forEach(r=>{ CASTRA.res[r] = Math.min(r==="gloria"?1e9:cap, (CASTRA.res[r]||0)+res[r]); out.push(castraRes(r).icon+" +"+res[r]); });
  castraRenderRes && castraRenderRes(); return out.join("  ");
}
function castraWRoll(range, rng){ return range[0] + Math.floor(rng()*(range[1]-range[0]+1)); }

/* ---------- haken in het bestaande NPC-systeem ---------- */
// Plekken vrijhouden bij het genereren van de kaart (geen boom of hoog gras op een object).
function castraWobjSpots(rid){ return CASTRA_WENT.filter(e=>e.region===rid).map(e=>[e.x,e.y]); }
// Kaartstukken van gebouwen (put) of de bouwplaats.
function castraWobjPieces(rid){
  const out = [];
  Object.keys(CASTRA_WBUILD).forEach(k=>{
    const b = CASTRA_WBUILD[k]; if(rid!=="latium") return;
    if(CASTRA.wbuilt && CASTRA.wbuilt[k]){ out.push({ o:"well", x:b.site.x, y:b.site.y }, { o:"barrel", x:b.site.x+1, y:b.site.y }); }
    else out.push({ o:"logs", x:b.site.x, y:b.site.y }, { o:"crate_c", x:b.site.x+1, y:b.site.y });
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
  else if(e.kind==="well") castraWWell(e);
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
  ["getint","licht","olijf"].forEach(h=>castraProbeBase(h).then(castraWobjDraw));
};
const _castraWorldSavePos0 = castraWorldSavePos;
castraWorldSavePos = function(x,y){ _castraWorldSavePos0(x,y); castraWPickupCheck(x,y); };

function castraWobjDraw(){
  const box = el("cwWobj"); if(!box) return;
  box.innerHTML = castraWEnts().filter(castraWEntVisible).map(e=>{
    const pos = `position:absolute;left:${e.x*48}px;top:${e.y*48}px;width:48px;height:48px;pointer-events:none;`;
    if(e.kind==="npc") return `<div style="${pos}z-index:4">${castraAvatarHTML(CASTRA_WNPC_LOOK[e.id], e.dir||"down", 1, 48)}<div style="position:absolute;left:50%;top:-10px;transform:translateX(-50%);font-size:13px;background:#d4af37;color:#2b1d0e;border-radius:8px;padding:0 4px;font-weight:bold">!</div></div>`;
    if(e.kind==="chest"){ const open = castraWChestOpen(e.id); return `<div style="${pos}z-index:3;display:flex;align-items:center;justify-content:center;font-size:34px;${open?"opacity:.45;filter:grayscale(.6)":""}">${open?"📦":"🧰"}</div>`; }
    if(e.kind==="pickup") return `<div style="${pos}z-index:3;display:flex;align-items:center;justify-content:center;font-size:30px;animation:castraBlink 1.2s infinite">✨</div>`;
    return "";
  }).join("");
}
function castraWPickupCheck(x,y){
  const e = castraWEnts().find(e=>e.kind==="pickup" && e.x===x && e.y===y && castraWEntVisible(e)); if(!e) return;
  const it = CASTRA_ITEMS[e.item]; castraWItems()[e.item] = 1; castraSave(); castraWobjDraw();
  toast(it.icon+" "+it.nm, "Je hebt een "+it.nl+" gevonden!");
  const hud = el("cwHud"); if(hud) hud.innerHTML = castraQuestHud();
}

/* ---------- kisten ---------- */
function castraWChest(e){
  if(castraWChestOpen(e.id)){ toast("📦", "Deze kist is leeg. Morgen ligt er weer iets in."); return; }
  const rng = castraRng((CASTRA.seed ^ (e.x*7919+e.y*104729))>>>0); CASTRA.seed = (CASTRA.seed+11)>>>0;
  const keys = Object.keys(CASTRA_WCHEST), a = keys[Math.floor(rng()*keys.length)], b = keys[Math.floor(rng()*keys.length)];
  const res = {}; res[a] = castraWRoll(CASTRA_WCHEST[a], rng); if(b!==a && rng()<0.5) res[b] = castraWRoll(CASTRA_WCHEST[b], rng); if(rng()<0.15) res.gloria = 1;
  (CASTRA.wchest || (CASTRA.wchest = {}))[e.id] = castraWDay();
  const txt = castraWGive(res); castraSave(); castraWobjDraw();
  toast("🧰 "+castraLaText("recte"), txt);
}

/* ---------- put ---------- */
function castraWWell(e){
  const d = castraWDay(), w = CASTRA.wday || (CASTRA.wday = {});
  const hurt = (CASTRA.soldiers||[]).filter(castraIsHurt);
  if(w.puteus===d){ toast("⛲ Puteus", "Het water is vandaag al gebruikt. Kom morgen terug."); return; }
  if(!hurt.length){ toast("⛲ Puteus", "Je soldaten zijn allemaal gezond."); return; }
  hurt.forEach(s=>{ s.hurtUntil = 0; }); w.puteus = d; castraSave();
  toast("⛲ "+castraLaText("recte"), hurt.length+" soldaat/soldaten genezen.");
}

/* ---------- personen met een opdracht ---------- */
const CASTRA_WTEXT = {
  agricola:{
    ask:[ { la:"Salve, dux {naam}! Amphoram meam amisi.", nl:"Gegroet, leider {naam}! Ik ben mijn amfoor kwijt." },
          { la:"Quaere amphoram in silva, et aes tibi dabo.", nl:"Zoek de amfoor in het bos, dan geef ik je brons." } ],
    wait:[ { la:"Ubi est amphora mea?", nl:"Waar is mijn amfoor?" } ],
    done:[ { la:"Amphora mea! Gratias tibi ago, dux {naam}!", nl:"Mijn amfoor! Dank je wel, leider {naam}!" } ],
    after:[ { la:"Vale, dux {naam}! Bene vivas!", nl:"Tot ziens, leider {naam}! Het ga je goed!" } ],
    hud:{ la:"Amphoram quaere in silva!", nl:"Zoek de amfoor van de Agricola in het bos (✨)." },
  },
  faber:{
    ask:[ { la:"Salve! Faber sum. Puteum aedifico.", nl:"Gegroet! Ik ben de bouwer. Ik bouw een put." },
          { la:"Mihi opus est triginta lignis et quindecim aeribus.", nl:"Ik heb dertig hout en vijftien brons nodig." } ],
    give:{ la:"Da mihi ligna et aes!", nl:"Geef mij hout en brons!" },
    notyet:{ la:"Nondum satis habes.", nl:"Je hebt nog niet genoeg." },
    built:[ { la:"Puteus paratus est! Aqua milites sanat.", nl:"De put is klaar! Het water geneest soldaten." } ],
    hud:{ la:"Ligna et aes da fabro!", nl:"Lever 30 hout en 15 brons in bij de Faber, dan bouwt hij een put." },
  },
  magistra:{
    hi:[ { la:"Salve, dux {naam}! Ludamus!", nl:"Gegroet, leider {naam}! Laten we spelen!" },
         { la:"Quem ludum eligis?", nl:"Welk spel kies je?", opts:[ { la:"Ordo verborum", nl:"woorden op volgorde" }, { la:"Verba iungere", nl:"woorden koppelen" }, { la:"Nunc non", nl:"nu niet" } ] } ],
  },
};

function castraWSay(e, lines, done){
  castraDlgOpen({ nm:e.nm, look:CASTRA_WNPC_LOOK[e.id] }, lines, done);
}
function castraWNpcTalk(e){
  if(CASTRA_DLG) return;
  if(e.id==="agricola"){
    const q = castraWQ("agricola"), T = CASTRA_WTEXT.agricola;
    if(q.step===0){ castraWSay(e, T.ask, ()=>{ q.step = 1; castraSave(); castraWobjDraw(); const h = el("cwHud"); if(h) h.innerHTML = castraQuestHud(); }); }
    else if(q.step===1){
      if(castraWItems().amphora){
        castraWSay(e, T.done, ()=>{ delete castraWItems().amphora; q.step = 2; const t = castraWGive(CASTRA_WREWARD.agricola); castraSave(); toast("🏺 "+castraLaText("recte"), t); castraWobjDraw(); const h = el("cwHud"); if(h) h.innerHTML = castraQuestHud(); });
      } else castraWSay(e, T.wait, null);
    } else castraWSay(e, T.after, null);
  } else if(e.id==="faber"){
    const T = CASTRA_WTEXT.faber, b = CASTRA_WBUILD.puteus;
    if(CASTRA.wbuilt && CASTRA.wbuilt.puteus){ castraWSay(e, T.built, null); return; }
    castraWQ("faber").step = 1; castraSave(); { const h = el("cwHud"); if(h) h.innerHTML = castraQuestHud(); }
    const can = castraCanPay(b.cost);
    const lines = T.ask.concat([ { la: can ? "Visne mihi ligna et aes dare?" : T.notyet.la, nl: can ? "Wil je mij hout en brons geven?" : T.notyet.nl,
      opts: can ? [ { la:"Do", nl:"geven" }, { la:"Nondum", nl:"nog niet" } ] : null } ].map(l=>l.opts?l:{ la:l.la, nl:l.nl }));
    castraWSay(e, lines, k=>{
      if(k===0 && castraCanPay(b.cost)){
        castraPay(b.cost); (CASTRA.wbuilt || (CASTRA.wbuilt = {})).puteus = true;
        const t = castraWGive(CASTRA_WREWARD.build); castraSave();
        CASTRA_WORLD_BUILT.latium = null;                       // kaart opnieuw opbouwen met de put
        castraWorldRender(); toast("⛲ Puteus", "De put is gebouwd! "+t);
        const h = el("cwHud"); if(h) h.innerHTML = castraQuestHud();
      }
    });
  } else if(e.id==="magistra"){
    castraWSay(e, CASTRA_WTEXT.magistra.hi, k=>{ if(k===0) castraPuzzleOpen("order"); else if(k===1) castraPuzzleOpen("match"); });
  }
}
function castraWHud(){
  const out = [];
  const a = castraWQ("agricola"); if(CASTRA_W_REGION==="latium" && a.step===1) out.push(CASTRA_WTEXT.agricola.hud);
  const bl = CASTRA.wbuilt && CASTRA.wbuilt.puteus; if(CASTRA_W_REGION==="latium" && !bl && castraWQ("faber").step===1) out.push(CASTRA_WTEXT.faber.hud);
  return out.map((t,i)=>`<div class="note" style="text-align:center">📜 ${castraLaHTML(t.la, t.nl, "whud"+i)}</div>`).join("");
}
// Opdrachten voor het menu (Opus)
function castraWobjOpus(){
  const out = [], a = castraWQ("agricola");
  if(a.step===1) out.push(CASTRA_WTEXT.agricola.hud);
  if(castraWQ("faber").step===1 && !(CASTRA.wbuilt && CASTRA.wbuilt.puteus)) out.push(CASTRA_WTEXT.faber.hud);
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
    CASTRA_PUZ = { kind, p, words, pool:idx, got:[], fails:0, done:false };
  } else {
    const pairs = CASTRA_PUZ_MATCH.slice().sort(()=>rng()-0.5).slice(0,4);
    const right = pairs.map((_,i)=>i).sort(()=>rng()-0.5);
    CASTRA_PUZ = { kind, pairs, right, solved:{}, selL:null, fails:0, done:false };
  }
  castraPuzzleRender();
}
function castraPuzzleClose(){ CASTRA_PUZ = null; const p = el("cwPanel"); if(p) p.innerHTML = ""; }
function castraPuzzleReward(){
  const Z = CASTRA_PUZ; Z.done = true;
  const w = CASTRA.wday || (CASTRA.wday = {});
  let txt = "";
  if(w.puzzle!==castraWDay()){ w.puzzle = castraWDay(); txt = castraWGive(CASTRA_WREWARD.puzzle); castraSave(); toast("🧩 "+castraLaText("recte"), txt); }
  return txt;
}
function castraPuzzleRender(){
  const Z = CASTRA_PUZ, panel = el("cwPanel"); if(!Z || !panel) return;
  const first = (CASTRA.wday||{}).puzzle!==castraWDay();
  const head = `<h3 style="margin:0 0 6px">🧩 ${esc(castraLaText("recte")==="Recte!"?"Magistra":"Magistra")} <small>${first?"eerste keer vandaag: beloning!":"geen beloning meer vandaag, oefenen mag"}</small></h3>`;
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
