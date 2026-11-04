/* ============================================================================
   CASTRA HEROUM — KAMP INRICHTEN
   ----------------------------------------------------------------------------
   Naar het voorbeeld van Clash of Clans / Forge of Empires: je maakt het kamp van jou met bloemen, bomen, tonnen,
   hekken en een put. Knop 🎨 linksonder op de kampkaart opent de bouwlijst; kies een voorwerp en tik op een vrij grasvak.
   Tik op iets wat je zelf plaatste om het weg te halen (de helft van de kosten krijg je terug).
   - Opslag: CASTRA.decor = [[voorwerp, x, y], ...] (klein; de save blijft ver onder de 40000 tekens).
   - Aantal: 8 + 4 per Praetorium-niveau. Alleen op gras, nooit op paden, bij poorten of onder de avatar.
   - Tekenen: castraCampDef (castra-map.js) krijgt de stukken erbij; ze zijn net als andere kaartstukken solide of niet.
   Laadt NA castra-map.js en castra-hud.js.
   ============================================================================ */

const CASTRA_DECOR = [
  { id:"flower_w", ic:"🌼", la:"Flos albus",   nl:"witte bloemen", cost:{ aes:5 } },
  { id:"flower_p", ic:"🌸", la:"Flos roseus",  nl:"roze bloemen",  cost:{ aes:5 } },
  { id:"flower_b", ic:"💠", la:"Flos caeruleus", nl:"blauwe bloemen", cost:{ aes:5 } },
  { id:"flower_o", ic:"🏵️", la:"Flos aureus",  nl:"oranje bloemen", cost:{ aes:5 } },
  { id:"fern",     ic:"🌿", la:"Filix",        nl:"varen",         cost:{ aes:5 } },
  { id:"stones",   ic:"🪨", la:"Lapides",      nl:"kiezels",       cost:{ aes:5 } },
  { id:"barrel",   ic:"🛢️", la:"Dolium",       nl:"ton",           cost:{ lignum:10 } },
  { id:"crate_a",  ic:"📦", la:"Arca",         nl:"kist",          cost:{ lignum:10 } },
  { id:"pot",      ic:"🏺", la:"Olla",         nl:"kruik",         cost:{ aes:10 } },
  { id:"hay",      ic:"🌾", la:"Fenum",        nl:"hooibaal",      cost:{ lignum:10 } },
  { id:"fence",    ic:"🚧", la:"Saepes",       nl:"hek",           cost:{ lignum:10 } },
  { id:"sign",     ic:"🪧", la:"Titulus",      nl:"bord",          cost:{ lignum:10 } },
  { id:"well",     ic:"⛲", la:"Puteus",       nl:"put",           cost:{ aes:40 } },
  { id:"tree_a",   ic:"🌲", la:"Pinus",        nl:"den",           cost:{ lignum:20 } },
  { id:"tree_b",   ic:"🌳", la:"Arbor",        nl:"boom",          cost:{ lignum:20 } },
];
const CASTRA_DECOR_UI = { on:false, pick:"flower_w" };

function castraDecorList(){ return (CASTRA.decor || (CASTRA.decor = [])); }
function castraDecorCap(){ return 8 + 4*((CASTRA.b.praetorium && CASTRA.b.praetorium.lvl) || 1); }
function castraDecorDef(id){ return CASTRA_DECOR.find(d=>d.id===id); }
function castraDecorHeight(id){ return (CASTRA_OBJ[id] && CASTRA_OBJ[id].h) || 1; }

// stukken die bij de kampdefinitie komen
const _castraCampDefDecor0 = castraCampDef;
castraCampDef = function(){
  const d = _castraCampDefDecor0.apply(this, arguments);
  if(typeof CASTRA!=="undefined" && CASTRA && CASTRA.decor) CASTRA.decor.forEach(t=>{ if(CASTRA_OBJ[t[0]]) d.pieces.push({ o:t[0], x:t[1], y:t[2] }); });
  return d;
};

// Mag er op (x,y) iets staan? (y = de onderste tegel van het voorwerp)
function castraDecorFree(x, y, id){
  const B = castraBuiltMap(), T = CASTRA_MAP, h = castraDecorHeight(id);
  for(let k=0;k<h;k++){
    const cx = x, cy = y-k;
    if(cx<1 || cy<1 || cx>=T.cols-1 || cy>=T.rows-1) return false;
    if(B.def.ground[cy][cx]!=="grass") return false;
    if(B.blocked[cx+","+cy]) return false;
    if(castraDecorList().some(t=>{ const th = castraDecorHeight(t[0]); return t[1]===cx && cy>=t[2] && cy<t[2]+th; })) return false;
    if(CASTRA_UI && CASTRA_UI.px===cx && CASTRA_UI.py===cy) return false;
    if(T.gates.some(g=>g.tiles.some(t=>Math.abs(t.x-cx)<=1 && Math.abs(t.y-cy)<=1))) return false;
  }
  // gebouwlabels en -bellen staan onder/boven de gebouwen: laat de rij vlak boven een gebouw vrij
  return true;
}
function castraDecorAt(x, y){
  return castraDecorList().findIndex(t=>{ const h = castraDecorHeight(t[0]); return t[1]===x && y>=t[2] && y<t[2]+h; });
}

function castraDecorRedraw(){ CASTRA_BUILT = null; castraRenderMap(); castraRenderRes(); castraDecorPanel(); }
function castraDecorTap(e){
  const map = el("castraMap"); if(!map) return false;
  const r = map.getBoundingClientRect(), s = CASTRA_UI.scale||1, t = CASTRA_MAP.tile;
  const tx = Math.floor((e.clientX-r.left)/s/t), ty = Math.floor((e.clientY-r.top)/s/t);
  const i = castraDecorAt(tx, ty);
  if(i>=0){                                                          // wegnemen
    const [id] = castraDecorList().splice(i,1)[0], d = castraDecorDef(id);
    if(d) Object.keys(d.cost).forEach(k=>{ CASTRA.res[k] = (CASTRA.res[k]||0) + Math.floor(d.cost[k]/2); });
    castraSave(); castraDecorRedraw(); return true;
  }
  const d = castraDecorDef(CASTRA_DECOR_UI.pick); if(!d) return true;
  if(castraDecorList().length >= castraDecorCap()){ toast("🎨 Kamp inrichten", "Het kamp is vol. Verbeter het Praetorium voor meer plekken."); return true; }
  if(!castraDecorFree(tx, ty, d.id)){ toast("🎨 Kamp inrichten", "Hier kan niets staan: kies een vrij grasvak, niet op een pad of bij een poort."); return true; }
  if(!castraCanPay(d.cost)){ toast("🎨 Kamp inrichten", "Je hebt niet genoeg grondstoffen."); return true; }
  castraPay(d.cost);
  castraDecorList().push([d.id, tx, ty - castraDecorHeight(d.id) + 1]);
  castraSave(); castraDecorRedraw(); return true;
}
const _castraMapTapDecor0 = castraMapTap;
castraMapTap = function(e){ if(CASTRA_DECOR_UI.on && document.getElementById("cgDecor") && castraDecorTap(e)) return; return _castraMapTapDecor0.apply(this, arguments); };

function castraDecorCost(d){ return Object.keys(d.cost).map(k=>castraRes(k).icon+" "+d.cost[k]).join(" "); }
function castraDecorPanel(){
  const box = document.getElementById("cgDecor"); if(!box) return;
  if(!CASTRA_DECOR_UI.on){ box.style.display = "none"; box.innerHTML = ""; return; }
  box.style.display = "block";
  box.innerHTML = `<div class="dh"><b>🎨 Kamp inrichten</b> <span>${castraDecorList().length} / ${castraDecorCap()}</span><button class="btn btn-gold" onclick="castraDecorToggle(false)">Klaar</button></div>
    <div class="dl">${CASTRA_DECOR.map(d=>`<button class="di${d.id===CASTRA_DECOR_UI.pick?" on":""}" onclick="CASTRA_DECOR_UI.pick='${d.id}';castraDecorPanel()" title="${esc(d.la)} (${esc(d.nl)})"><span class="ic">${d.ic}</span><span class="nm">${esc(d.nl)}</span><span class="pr${castraCanPay(d.cost)?"":" no"}">${castraDecorCost(d)}</span></button>`).join("")}</div>
    <div class="dn">Tik op een grasvak om te plaatsen. Tik op iets wat je plaatste om het weg te halen (je krijgt de helft terug).</div>`;
}
function castraDecorToggle(on){
  CASTRA_DECOR_UI.on = on===undefined ? !CASTRA_DECOR_UI.on : !!on;
  const b = document.getElementById("cgDecorBtn"); if(b) b.style.display = CASTRA_DECOR_UI.on ? "none" : "block";
  castraDecorPanel();
}
function castraDecorBuild(main){
  if(!main || document.getElementById("cgDecor")) return;
  if(!document.getElementById("castraDecorCss")){
    const st = document.createElement("style"); st.id = "castraDecorCss";
    st.textContent = `#cgDecorBtn{position:absolute;z-index:57;left:8px;bottom:8px;min-width:46px;min-height:46px;font-size:22px;line-height:1;cursor:pointer;border:2px solid var(--hi,#d4af37);border-radius:12px;background:rgba(27,20,12,.88);color:var(--hi-bright,#e8c96a)}
    #cgDecor{position:absolute;z-index:73;left:6px;right:6px;bottom:6px;max-width:760px;margin:0 auto;box-sizing:border-box;padding:6px 8px;background:rgba(27,20,12,.95);border:2px solid var(--hi,#d4af37);border-radius:12px;color:#f0e2b8}
    #cgDecor .dh{display:flex;align-items:center;gap:10px;margin-bottom:4px}#cgDecor .dh .btn{margin-left:auto;min-height:36px;padding:2px 14px}
    #cgDecor .dl{display:flex;gap:6px;overflow-x:auto;padding-bottom:2px;scrollbar-width:none}#cgDecor .dl::-webkit-scrollbar{display:none}
    #cgDecor .di{flex:0 0 auto;min-width:66px;display:flex;flex-direction:column;align-items:center;gap:0;padding:2px 5px;font-family:inherit;cursor:pointer;border:2px solid var(--hi-dim,#8a6d2f);border-radius:8px;background:#2a2014;color:#f0e2b8}
    #cgDecor .di.on{border-color:#f0cf6a;background:#4a3a1c}#cgDecor .di .ic{font-size:22px}#cgDecor .di .nm{font-size:11px;font-weight:bold}#cgDecor .di .pr{font-size:11px}#cgDecor .di .pr.no{color:#e08a7a}
    #cgDecor .dn{font-size:11px;opacity:.75;margin-top:2px}@media (max-height:760px){#cgDecor .dn{display:none}}`;
    document.head.appendChild(st);
  }
  const b = document.createElement("button"); b.id = "cgDecorBtn"; b.textContent = "🎨"; b.setAttribute("aria-label","Kamp inrichten"); b.title = "Kamp inrichten";
  b.onclick = ev=>{ ev.stopPropagation(); castraDecorToggle(true); }; b.onpointerdown = ev=>ev.stopPropagation();
  if(CASTRA.tut && CASTRA.tut.step<99) b.style.display = "none";
  const p = document.createElement("div"); p.id = "cgDecor"; p.style.display = "none"; p.onpointerdown = ev=>ev.stopPropagation();
  main.appendChild(b); main.appendChild(p);
  CASTRA_DECOR_UI.on = false;
}
