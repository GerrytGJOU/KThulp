/* ============================================================================
   CASTRA HEROUM — VERBORGEN VOORWERPEN (zoals de hidden items van Pokémon)
   ----------------------------------------------------------------------------
   Op elke kaart ligt per dag een paar kleine vondsten verstopt op gewone, vrije tegels: een muntje in het gras, aren graan, droog hout,
   zelden een oude fibula (gloria). Je ziet ze niet; wie dichtbij loopt (twee tegels) ziet een zwak glimmertje. Loop er overheen en je
   vindt het (Latijns bericht met vertaling, kleine beloning, een beetje Castra-ervaring). Elke dag liggen ze ergens anders: de plekken
   en de inhoud volgen uit de regio en de datum (castraDay) en worden niet opgeslagen; alleen wat je vandaag al gevonden hebt staat in
   CASTRA.hid = { day, f:{ "regio|nummer": 1 } } en wordt de volgende dag gewist.
   Plekken zijn vrij van obstakels en objecten, niet op de start, bij een deur of poort, en bereikbaar (alle versperringen open gerekend,
   dus een vondst kan achter een poort liggen die je later pas opent). Binnenruimtes hebben er één of twee, regio's vier.
   Laadt NA castra-train.js (haakt in castraWorldSavePos en castraWorldRender).
   ============================================================================ */
const CASTRA_HID = {
  perRegion:4, perInterior:1, perCave:2, glimpse:2, keepAway:3,
  finds:[
    { w:5, la:"Nummus in herba latet!",   nl:"Een muntje in het gras!",                  res:{ aes:[12,30] } },
    { w:4, la:"Spicae frumenti!",         nl:"Aren graan, verloren van een kar.",        res:{ frumentum:[10,25] } },
    { w:4, la:"Lignum siccum!",           nl:"Droog brandhout onder de bladeren.",       res:{ lignum:[12,30] } },
    { w:1, la:"Fibula antiqua!",          nl:"Een oude mantelspeld, mooi bewaard.",       res:{ gloria:[1,1] } },
    { w:2, la:"Posca in testa!",          nl:"Een scherf met een restje posca.",           res:{}, good:"posca" },
    { w:1, la:"Suffimentum!",             nl:"Een bundeltje rookkruid, nog geurig.",       res:{}, good:"suffimentum" },
    { w:1, la:"Viaticum!",                nl:"Een verloren beurs met reisgeld.",           res:{}, good:"viaticum" },
  ],
};
function castraHidHash(str){ let h = 2166136261; for(let i=0;i<str.length;i++){ h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h>>>0; }
function castraHidState(){
  const d = castraWDay(), h = CASTRA.hid;
  if(!h || h.day!==d) CASTRA.hid = { day:d, f:{} };
  return CASTRA.hid;
}
// Tegels die vanaf de start te bereiken zijn, alle versperringen open gerekend (zoals tools/castra-world-test.js).
const CASTRA_HID_REACH = {};
function castraHidReach(rid){
  if(CASTRA_HID_REACH[rid]) return CASTRA_HID_REACH[rid];
  const keep = CASTRA_W_REGION; CASTRA_W_REGION = rid;
  try{
    const W = CASTRA_WORLDS[rid], B = castraWorldBuilt(), blocked = new Set(Object.keys(B.blocked));
    CASTRA_WENT.filter(e=>e.region===rid && e.kind!=="pickup" && e.kind!=="block" && !(e.kind==="veld" && e.gate)).forEach(e=>blocked.add(e.x+","+e.y));
    Object.keys(CASTRA_NPCS).forEach(id=>{ const n = CASTRA_NPCS[id]; if(n.region===rid) blocked.add(n.world.x+","+n.world.y); });
    const seen = new Set(), q = [[W.start.x, W.start.y]]; seen.add(W.start.x+","+W.start.y);
    while(q.length){ const [x,y] = q.shift(); [[1,0],[-1,0],[0,1],[0,-1]].forEach(([dx,dy])=>{ const nx = x+dx, ny = y+dy, k = nx+","+ny; if(nx<1||ny<1||nx>=W.cols-1||ny>=W.rows-1||seen.has(k)||blocked.has(k)) return; seen.add(k); q.push([nx,ny]); }); }
    return CASTRA_HID_REACH[rid] = { seen, blocked };
  } finally { CASTRA_W_REGION = keep; }
}
// De verstopte vondsten van vandaag in een wereld: [{ i, x, y, find }].
function castraHidSpots(rid){
  const W = CASTRA_WORLDS[rid]; if(!W) return [];
  const day = castraWDay(), n = W.interior ? (/^caver|^specus|^catac/.test(rid) ? CASTRA_HID.perCave : CASTRA_HID.perInterior) : CASTRA_HID.perRegion;
  const R = castraHidReach(rid), rng = castraRng(castraHidHash(rid+"|"+day));
  const near = (x,y,t)=>Math.abs(t.x-x)<CASTRA_HID.keepAway && Math.abs(t.y-y)<CASTRA_HID.keepAway;
  const avoid = [ W.start ].concat((W.exit||[]), (W.doors||[]).map(d=>({ x:d.x, y:d.y })), (W.doors||[]).map(d=>d.spawn).filter(Boolean), CASTRA_WENT.filter(e=>e.region===rid && e.kind==="hub").map(e=>({ x:e.x, y:e.y })));
  const cand = []; R.seen.forEach(k=>{ const [x,y] = k.split(",").map(Number); if(!avoid.some(t=>near(x,y,t))) cand.push([x,y]); });
  cand.sort((a,b)=>a[1]-b[1] || a[0]-b[0]);                  // vaste volgorde, zodat dezelfde dag dezelfde plekken geeft
  const out = [], tw = CASTRA_HID.finds.reduce((a,f)=>a+f.w, 0);
  for(let i=0; i<n && cand.length; i++){
    const [x,y] = cand.splice(Math.floor(rng()*cand.length), 1)[0];
    let r = rng()*tw, find = CASTRA_HID.finds[0]; for(const f of CASTRA_HID.finds){ r -= f.w; if(r<=0){ find = f; break; } }
    out.push({ i, x, y, find });
    for(let j=cand.length-1; j>=0; j--) if(Math.abs(cand[j][0]-x)<5 && Math.abs(cand[j][1]-y)<5) cand.splice(j,1);   // vondsten liggen uit elkaar
  }
  return out;
}
function castraHidOpen(rid){ const st = castraHidState(); return castraHidSpots(rid).filter(s=>!st.f[rid+"|"+s.i]); }
function castraHidFind(rid, x, y){
  const s = castraHidOpen(rid).find(s=>s.x===x && s.y===y); if(!s) return null;
  const rng = castraRng(castraHidHash(rid+"|"+castraWDay()+"|"+s.i)), base = (CASTRA_WORLDS[rid].parent) || rid, sc = castraWScale(base), res = {};
  Object.keys(s.find.res).forEach(r=>{ const v = castraWRoll(s.find.res[r], rng); res[r] = r==="gloria" ? v : Math.round(v*sc); });
  castraHidState().f[rid+"|"+s.i] = 1;
  let txt = castraWGive(res);
  if(s.find.good && typeof castraBagAdd==="function"){ castraBagAdd(s.find.good, 1); txt = CASTRA_GOODS[s.find.good].icon+" "+CASTRA_GOODS[s.find.good].la; }
  castraSave();
  if(typeof castraPxpAdd==="function") castraPxpAdd(2);
  return { spot:s, res, txt };
}
function castraHidCheck(x, y){
  const r = castraHidFind(CASTRA_W_REGION, x, y); if(!r) return;
  if(typeof toast==="function") toast("✨ "+r.spot.find.la, r.spot.find.nl+" "+r.txt);
  castraHidDraw();
}
function castraHidDraw(){
  const map = el("cwMap"); if(!map) return;
  let box = el("cwHid"); if(!box){ box = document.createElement("div"); box.id = "cwHid"; map.insertBefore(box, el("cwAbove")); }
  const px = CASTRA_W_UI.px, py = CASTRA_W_UI.py;
  box.innerHTML = castraHidOpen(CASTRA_W_REGION).filter(s=>Math.abs(s.x-px)<=CASTRA_HID.glimpse && Math.abs(s.y-py)<=CASTRA_HID.glimpse).map(s=>
    `<div style="position:absolute;left:${s.x*48}px;top:${s.y*48}px;width:48px;height:48px;pointer-events:none;z-index:3;display:flex;align-items:center;justify-content:center;font-size:18px;opacity:.55;animation:castraBlink 1.6s infinite" title="Iets glimt hier">✦</div>`).join("");
}
const _castraWorldSavePosHid0 = castraWorldSavePos;
castraWorldSavePos = function(x, y){ _castraWorldSavePosHid0.apply(this, arguments); try{ castraHidCheck(x, y); castraHidDraw(); }catch(e){ console.error(e); } };
const _castraWorldRenderHid0 = castraWorldRender;
castraWorldRender = function(){ _castraWorldRenderHid0.apply(this, arguments); try{ castraHidDraw(); }catch(e){ console.error(e); } };
