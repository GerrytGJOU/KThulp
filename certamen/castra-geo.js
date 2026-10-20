/* ============================================================================
   CASTRA HEROUM — ÉÉN AANEENGESLOTEN WERELD, WERELDKAART EN SNELREIZEN
   ----------------------------------------------------------------------------
   De regio's zijn niet langer losse keuzes in een menu, maar liggen aan elkaar zoals
   in een Pokémon-wereld: loop je over de rand van een regio (een opening in de
   bomenrand, aan het eind van een weg), dan kom je in de buurregio. Het kamp ligt aan
   het zuiden van Latium (porta decumana). Een regio die nog niet open is, blijft
   afgesloten ("win eerst missie …").

   Geografie (grenzen = lopen; ⚓ = schip, 🐪 = caravan voor snelreizen):
        Germania ─ Gallia ═ Latium ─ Roma           Themiscyra
                              │ (kamp)                  │
                              ⚓ ⇢ Graecia ───────── Troia ─── Persis
                                     │                   │
                                  Laconia             Aegyptus ═ Africa
   Elke regio heeft een reisplek (⚓ of 🐪): vanaf daar kun je naar elke open, al bezochte
   regio reizen (kost 15 aes per etappe, het kamp is gratis). De wereldkaart (menu →
   Tabula) toont alles; reizen kan vanaf het kamp of bij een reisplek.
   Poorten: N = (15..16, 0), S = (15..16, 23), W = (0, rij..rij+1), E = (31, rij..rij+1).
   Opslag: CASTRA.visited { regio: true }.
   Laadt NA castra-world.js en castra-wobj.js.
   ============================================================================ */

// links: richting -> buurregio of "camp"; row = rij van de horizontale weg (W/E-poorten); pos = plek op de kaart (%);
// hub = tegel van de reisplek; hubType = port (schip) of caravan.
const CASTRA_GEO = {
  latium:     { links:{ S:"camp", N:"roma", W:"gallia" },        row:24, pos:[42,44], hub:[28,42], hubType:"port" },
  roma:       { links:{ S:"latium" },                            row:12, pos:[46,22], hub:[31,48], hubType:"caravan" },
  gallia:     { links:{ E:"latium", N:"germania" },              row:16, pos:[16,34], hub:[13,19], hubType:"caravan" },
  germania:   { links:{ S:"gallia" },                            row:13, pos:[28,10], hub:[13,19], hubType:"caravan" },
  graecia:    { links:{ S:"laconia", E:"troia" },                row:8,  pos:[64,50], hub:[13,19], hubType:"port" },
  laconia:    { links:{ N:"graecia" },                           row:14, pos:[60,74], hub:[13,19], hubType:"port" },
  troia:      { links:{ W:"graecia", N:"themiscyra", E:"persis", S:"aegyptus" }, row:14, pos:[80,40], hub:[13,19], hubType:"port" },
  themiscyra: { links:{ S:"troia" },                             row:11, pos:[88,16], hub:[13,19], hubType:"port" },
  persis:     { links:{ W:"troia" },                             row:12, pos:[92,56], hub:[13,19], hubType:"caravan" },
  aegyptus:   { links:{ N:"troia", W:"africa" },                 row:14, pos:[78,72], hub:[13,19], hubType:"caravan" },
  africa:     { links:{ E:"aegyptus" },                          row:10, pos:[38,80], hub:[13,19], hubType:"port" },
};
const CASTRA_GEO_CAMP = { pos:[42,60], nm:"Castra", icon:"🏕️" };
const CASTRA_GEO_OPP = { N:"S", S:"N", W:"E", E:"W" };
const CASTRA_GEO_NM = { N:"noorden", S:"zuiden", W:"westen", E:"oosten" };
const CASTRA_GEO_COST = 15;
let CASTRA_GEO_SPAWN = null;

function castraGeoGateTiles(rid, dir){
  const G = CASTRA_GEO[rid], W = CASTRA_WORLDS[rid], r = G.row, cx = (W.cols>>1)-1;   // poorten volgen de afmetingen van de regio
  if(dir==="N") return [ {x:cx,y:0}, {x:cx+1,y:0} ];
  if(dir==="S") return [ {x:cx,y:W.rows-1}, {x:cx+1,y:W.rows-1} ];
  if(dir==="W") return [ {x:0,y:r}, {x:0,y:r+1} ];
  return [ {x:W.cols-1,y:r}, {x:W.cols-1,y:r+1} ];
}
// Startplek van een regio (zuidpoort binnen) en aankomst via een poort.
function castraGeoStart(rid){ const W = CASTRA_WORLDS[rid]; return { x:(W.cols>>1)-1, y:W.rows-2, dir:"up" }; }
// Brug waar een gate over water moet (de zee/rivier aan de oostkant): Graecia, Troia, Africa.
(function(){
  CASTRA_WORLDS.graecia.water.forEach(w=>{ if(w.x0===28) w.bridgeY = [8,9]; });
  CASTRA_WORLDS.troia.water.forEach(w=>{ if(w.x0===28) w.bridgeY = [14,15]; });
  CASTRA_WORLDS.africa.water.forEach(w=>{ if(w.x0===28) w.bridgeY = [10,11]; });
  Object.keys(CASTRA_GEO).forEach(rid=>{
    const W = CASTRA_WORLDS[rid], G = CASTRA_GEO[rid]; let ex = [];
    Object.keys(G.links).forEach(d=>{ ex = ex.concat(castraGeoGateTiles(rid, d)); });
    W.exit = ex;
    // hub als gewone wereldentiteit (zodat kaart en botsing het al kennen)
    CASTRA_WENT.push({ id:"hub_"+rid, region:rid, kind:"hub", x:G.hub[0], y:G.hub[1] });
  });
})();

function castraGeoName(rid){ return rid==="camp" ? CASTRA_GEO_CAMP.nm : (CASTRA_WORLDS[rid]||{nm:rid}).nm; }
function castraGeoIcon(rid){ return rid==="camp" ? CASTRA_GEO_CAMP.icon : (CASTRA_WORLDS[rid]||{icon:"📍"}).icon; }
function castraGeoVisited(rid){ return rid==="camp" || !!(CASTRA.visited && CASTRA.visited[rid]); }
// Oude saves kennen 'visited' nog niet: een regio met bewaarde plek of een gewonnen missie telt als bezocht.
function castraGeoBackfill(){
  Object.keys(CASTRA_GEO).forEach(rid=>{ if((CASTRA.worlds && CASTRA.worlds[rid]) || CASTRA_P_MISSIONS.some(m=>m.region===rid && castraPMissionDone(m.id))) castraGeoMark(rid); });
}
function castraGeoMark(rid){ (CASTRA.visited || (CASTRA.visited = {}))[rid] = true; }
// Aantal etappes tussen twee plekken (kortste route over de grenzen, "camp" hangt aan Latium).
function castraGeoHops(a, b){
  if(a===b) return 0;
  const nb = id=>{ if(id==="camp") return ["latium"]; const l = Object.values(CASTRA_GEO[id].links); return l.map(x=>x==="camp"?"camp":x); };
  const dist = { [a]:0 }, q = [a];
  while(q.length){ const x = q.shift(); if(x===b) return dist[x]; nb(x).forEach(y=>{ if(dist[y]===undefined){ dist[y] = dist[x]+1; q.push(y); } }); }
  return 9;
}
function castraGeoSpawnFor(rid, moved){
  const G = CASTRA_GEO[rid], W = CASTRA_WORLDS[rid], cx = (W.cols>>1)-1;
  if(moved==="N") return { x:cx, y:W.rows-2, dir:"up" };
  if(moved==="S") return { x:cx, y:1,  dir:"down" };
  if(moved==="W") return { x:W.cols-2, y:G.row, dir:"left" };
  return { x:1, y:G.row, dir:"right" };
}
// Mis-stap bij een gesloten poort: één tegel terug.
function castraGeoInner(rid, dir){
  const W = CASTRA_WORLDS[rid]; const t = castraGeoGateTiles(rid, dir)[0];
  if(dir==="N") return { x:t.x, y:1 }; if(dir==="S") return { x:t.x, y:W.rows-2 };
  if(dir==="W") return { x:1, y:t.y }; return { x:W.cols-2, y:t.y };
}

/* ---------- lopen over de rand ---------- */
function castraGeoExit(x, y){
  const rid = CASTRA_W_REGION, G = CASTRA_GEO[rid]; if(!G) return castraWorldLeave();
  let dir = null; Object.keys(G.links).forEach(d=>{ if(castraGeoGateTiles(rid,d).some(t=>t.x===x&&t.y===y)) dir = d; });
  if(!dir) return;
  const to = G.links[dir];
  if(to==="camp"){ castraGeoToCamp(); return; }
  if(!castraRegionOpen(to)){
    const need = CASTRA_P_MISSIONS.find(m=>m.id===CASTRA_REGION_NEEDS[to]);
    if(typeof toast==="function") toast("🔒 "+castraGeoName(to), "Gesloten (richting "+CASTRA_GEO_NM[dir]+"). Win eerst: "+(need?need.nm+" — "+need.nl:"een missie")+".");
    const p = castraGeoInner(rid, dir); CASTRA_W_UI.px = p.x; CASTRA_W_UI.py = p.y; castraWorldAvatar(); castraWorldSavePos(p.x, p.y);
    return;
  }
  castraGeoGo(to, castraGeoSpawnFor(to, dir));
}
function castraGeoGo(to, spawn){
  const p = (CASTRA_W_UI.px!==undefined) ? { x:CASTRA_W_UI.px, y:CASTRA_W_UI.py } : null;
  if(p) castraWorldSavePos(p.x, p.y);
  castraWorldDetach(); CASTRA_W_REGION = to; CASTRA_GEO_SPAWN = spawn;
  go("castraWorld");
}
function castraGeoToCamp(){
  castraWorldSavePos(CASTRA_W_UI.px, CASTRA_W_UI.py);
  castraWorldDetach(); CASTRA.pos = { x:7, y:1 }; castraSave(); go("castraHome");
}
// Vanuit het kamp de wereld in (porta decumana): Latium, zuidpoort.
function castraGeoEnterWorld(){ CASTRA_W_REGION = "latium"; CASTRA_GEO_SPAWN = castraGeoStart("latium"); go("castraWorld"); }

/* ---------- reisplekken (schip / caravan) ---------- */
const _castraNpcTalkGeo0 = castraNpcTalk;
castraNpcTalk = function(id){
  if(String(id).indexOf("w:hub_")===0){ castraGeoHubOpen(String(id).slice(6)); return; }
  return _castraNpcTalkGeo0(id);
};
const _castraWobjDrawGeo0 = castraWobjDraw;
castraWobjDraw = function(){
  _castraWobjDrawGeo0();
  const box = el("cwWobj"); if(!box) return;
  const rid = CASTRA_W_REGION, G = CASTRA_GEO[rid]; if(!G) return;
  const gl = Object.keys(G.links).map(d=>{ const to = G.links[d], t = castraGeoGateTiles(rid,d)[0];
    const open = to==="camp" || castraRegionOpen(to);
    const lab = `${open?"":"🔒 "}${esc(castraGeoName(to))}`;
    const WW = CASTRA_WORLDS[rid], ix = Math.min(WW.cols-3, Math.max(2, t.x)), iy = Math.min(WW.rows-3, Math.max(2, t.y));
    return `<div style="position:absolute;left:${ix*48-60}px;top:${iy*48-6}px;width:168px;text-align:center;pointer-events:none;z-index:7;font-size:13px;font-weight:bold;color:#fff;text-shadow:0 1px 3px #000,0 0 6px #000;opacity:.95">${CASTRA_GEO_ARROW[d]} ${lab}</div>`; }).join("");
  const hubEmoji = G.hubType==="port" ? "⚓" : "🐪";
  box.insertAdjacentHTML("beforeend", gl + `<div style="position:absolute;left:${G.hub[0]*48}px;top:${G.hub[1]*48}px;width:48px;height:48px;z-index:3;display:flex;align-items:center;justify-content:center;font-size:34px;pointer-events:none">${hubEmoji}</div>`);
};
const CASTRA_GEO_ARROW = { N:"↑", S:"↓", W:"←", E:"→" };

function castraGeoHubOpen(rid){
  if(CASTRA_DLG) return;
  castraGeoBackfill();
  const G = CASTRA_GEO[rid], here = rid;
  const dests = ["camp"].concat(Object.keys(CASTRA_GEO)).filter(d=>d!==here && castraGeoVisited(d) && (d==="camp" || castraRegionOpen(d)));
  const rows = dests.map(d=>{
    const hops = castraGeoHops(here, d), cost = d==="camp" ? 0 : CASTRA_GEO_COST*Math.max(1,hops), can = (CASTRA.res.aes||0)>=cost;
    const hubD = d==="camp" ? null : CASTRA_GEO[d].hubType;
    const how = d==="camp" ? "terug naar het kamp" : (G.hubType==="port" && hubD==="port") ? "per schip" : "met een caravan";
    return `<button class="btn ${can?"btn-gold":""}" ${can?"":"disabled"} style="display:block;width:100%;margin:4px 0;min-height:48px;text-align:left" onclick="castraGeoTravel('${d}')">${castraGeoIcon(d)} <b>${esc(castraGeoName(d))}</b> <small>${how} · ${cost?"🪙 "+cost:"gratis"}</small></button>`;
  }).join("");
  const panel = el("cwPanel"); if(!panel) return;
  panel.innerHTML = `<div class="panel"><h3 style="margin:0 0 6px">${G.hubType==="port"?"⚓ Portus":"🐪 Statio caravanarum"} <small>${esc(castraGeoName(here))}</small></h3>
    <div style="font-size:15px;margin-bottom:6px">${castraLaHTML(G.hubType==="port"?"Quo navigas, dux {naam}?":"Quo vehis, dux {naam}?", G.hubType==="port"?"Waarheen vaar je, leider {naam}?":"Waarheen reis je, leider {naam}?", "hub_"+G.hubType)}</div>
    ${rows||"<div class='note'>Je kent nog geen andere plekken. Ontdek eerst een buurregio te voet.</div>"}
    <div class="note" style="margin-top:6px">Alleen bezochte, open regio's. 🪙 ${CASTRA_GEO_COST} per etappe; het kamp is gratis. Zie ook de wereldkaart (menu → Tabula).</div>
    <button class="btn" style="margin-top:6px;min-height:44px" onclick="castraNpcClose()">Sluiten</button></div>`;
  panel.scrollIntoView({ behavior:"smooth", block:"nearest" });
}
function castraGeoCanTravel(){
  if(document.getElementById("castraMap")) return true;                         // in het kamp
  if(document.getElementById("cwMap")){
    const G = CASTRA_GEO[CASTRA_W_REGION]; if(!G) return false;
    return Math.abs(CASTRA_W_UI.px-G.hub[0]) + Math.abs(CASTRA_W_UI.py-G.hub[1]) <= 2;   // bij de reisplek
  }
  return false;
}
function castraGeoHere(){ return document.getElementById("castraMap") ? "camp" : (document.getElementById("cwMap") ? ((CASTRA_WORLDS[CASTRA_W_REGION]||{}).parent || CASTRA_W_REGION) : null); }
function castraGeoTravel(to){
  const here = castraGeoHere(); if(!here || here===to) return;
  const cost = to==="camp" ? 0 : CASTRA_GEO_COST*Math.max(1, castraGeoHops(here, to));
  if((CASTRA.res.aes||0) < cost){ toast("Te weinig brons", "Reizen kost 🪙 "+cost+"."); return; }
  if(to!=="camp" && !castraRegionOpen(to)){ toast("🔒 Gesloten", "Die regio is nog niet open."); return; }
  CASTRA.res.aes -= cost; castraSave();
  if(typeof castraMenuClose==="function") castraMenuClose();
  if(to==="camp"){
    if(here==="camp") return;
    castraWorldSavePos(CASTRA_W_UI.px, CASTRA_W_UI.py); castraWorldDetach(); CASTRA.pos = { x:7, y:1 }; castraSave(); go("castraHome"); return;
  }
  if(here==="camp"){ CASTRA.pos = { x:7, y:1 }; castraSave(); CASTRA_W_REGION = to; CASTRA_GEO_SPAWN = castraGeoStart(to); go("castraWorld"); return; }
  castraWorldSavePos(CASTRA_W_UI.px, CASTRA_W_UI.py); castraWorldDetach(); CASTRA_W_REGION = to; CASTRA_GEO_SPAWN = castraGeoStart(to);
  toast(CASTRA_GEO[here].hubType==="port" && CASTRA_GEO[to].hubType==="port" ? "⚓ Je vaart naar "+castraGeoName(to) : "🐪 Je reist naar "+castraGeoName(to), "");
  go("castraWorld");
}

/* ---------- wereldkaart (menu → Tabula) ---------- */
function castraGeoMapView(){
  castraGeoBackfill();
  const here = castraGeoHere(), sel = CASTRA_MENU.geoSel || here || "latium";
  const ids = ["camp"].concat(Object.keys(CASTRA_GEO)), P = id=> id==="camp" ? CASTRA_GEO_CAMP.pos : CASTRA_GEO[id].pos;
  const seen = {}, lines = [];
  ids.forEach(a=>{ const links = a==="camp" ? { S:"latium" } : CASTRA_GEO[a].links; Object.keys(links).forEach(d=>{ const b = links[d]==="camp" ? "camp" : links[d]; const k = [a,b].sort().join("|"); if(seen[k]) return; seen[k] = 1;
    const open = (a==="camp"||castraRegionOpen(a)) && (b==="camp"||castraRegionOpen(b));
    lines.push(`<line x1="${P(a)[0]}" y1="${P(a)[1]}" x2="${P(b)[0]}" y2="${P(b)[1]}" stroke="${open?"#7a5a1e":"#a99870"}" stroke-width="1.2" ${open?"":"stroke-dasharray=\"2 2\""}/>`); }); });
  // zeeroute Latium – Graecia (schip)
  lines.push(`<line x1="${P("latium")[0]}" y1="${P("latium")[1]}" x2="${P("graecia")[0]}" y2="${P("graecia")[1]}" stroke="#3a6a8a" stroke-width="1" stroke-dasharray="1.5 2.5"/>`);
  lines.push(`<line x1="${P("latium")[0]}" y1="${P("latium")[1]}" x2="${P("africa")[0]}" y2="${P("africa")[1]}" stroke="#3a6a8a" stroke-width="1" stroke-dasharray="1.5 2.5"/>`);
  const nodes = ids.map(id=>{
    const [x,y] = P(id), open = id==="camp" || castraRegionOpen(id), vis = castraGeoVisited(id), cur = here===id, isSel = sel===id;
    const label = (!open) ? "🔒" : vis ? castraGeoIcon(id) : "❔";
    return `<div role="button" onclick="CASTRA_MENU.geoSel='${id}';castraMenuRender()" style="position:absolute;left:${x}%;top:${y}%;transform:translate(-50%,-50%);text-align:center;cursor:pointer;min-width:44px">
      <div style="font-size:24px;line-height:1;width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto;background:${cur?"#d4af37":isSel?"#f3e2a8":open?"#efe1b9":"#cbbd96"};border:3px solid ${isSel?"#7a2a14":"#4a3416"};${vis||id==="camp"?"":"opacity:.75"}">${label}</div>
      <div style="font-size:11px;font-weight:bold;white-space:nowrap;text-shadow:0 0 3px #efe1b9">${cur?"🧭 ":""}${vis||id==="camp"||open?esc(castraGeoName(id)):"???"}</div></div>`;
  }).join("");
  // informatie en reis-knop voor de gekozen plek
  let info = "";
  if(sel==="camp") info = `<b>Castra</b> — je kamp. Hier bouw je, verzamel je soldaten en start je missies.`;
  else {
    const W = CASTRA_WORLDS[sel], V = CASTRA_VENATIO[sel], open = castraRegionOpen(sel), vis = castraGeoVisited(sel);
    const heroes = Object.keys(CASTRA_HERO_DATA).filter(h=>CASTRA_HERO_DATA[h].region===sel), got = heroes.filter(h=>castraHero(h)).length;
    const ms = CASTRA_P_MISSIONS.filter(m=>m.region===sel), done = ms.filter(m=>castraPMissionDone(m.id)).length;
    const need = CASTRA_P_MISSIONS.find(m=>m.id===CASTRA_REGION_NEEDS[sel]);
    info = `<b>${W.icon} ${esc(W.nm)}</b> ${!open?`<span style="color:#8a1c10">· gesloten${need?": win eerst "+esc(need.nm):""}</span>`:vis?"":"· nog niet bezocht"}<br>
      <small>${V?`Vijanden level ${V.min}–${V.max} · `:""}${heroes.length?`⭐ ${got}/${heroes.length} helden · `:""}${ms.length?`⚔️ ${done}/${ms.length} missies · `:""}${CASTRA_GEO[sel].hubType==="port"?"⚓ haven":"🐪 caravanstation"}</small>`;
  }
  const canTravel = castraGeoCanTravel(), ok = sel!==here && (sel==="camp" || (castraRegionOpen(sel) && castraGeoVisited(sel)));
  const cost = sel==="camp" ? 0 : (here ? CASTRA_GEO_COST*Math.max(1,castraGeoHops(here, sel)) : 0);
  const btn = !here ? "" : (sel===here) ? `<div class="note">Je bent hier.</div>`
    : !ok ? `<div class="note">${sel!=="camp" && !castraRegionOpen(sel)?"Deze regio is nog gesloten.":"Bezoek deze regio eerst te voet."}</div>`
    : canTravel ? `<button class="btn btn-gold" style="min-height:44px;margin-top:4px" onclick="castraGeoTravel('${sel}')">${sel==="camp"?"🏕️ Terug naar het kamp (gratis)":"🧭 Reis naar "+esc(castraGeoName(sel))+" (🪙 "+cost+")"}</button>`
    : `<div class="note">Reizen kan vanuit het kamp of bij een reisplek (⚓ / 🐪) in een regio. Loop erheen en tik erop.</div>`;
  return `<h3 style="margin:0 0 4px">Tabula <small>wereldkaart</small></h3>
    <div style="position:relative;width:100%;aspect-ratio:5/4;border:3px solid #4a3416;border-radius:10px;background:radial-gradient(circle at 50% 40%,#f1e6bf,#d9c690);overflow:hidden">
      <div style="position:absolute;left:0;top:0;right:0;bottom:0;background:linear-gradient(120deg,rgba(80,130,170,.18),rgba(80,130,170,0) 40%,rgba(80,130,170,.12))"></div>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style="position:absolute;inset:0;width:100%;height:100%">${lines.join("")}</svg>${nodes}</div>
    <div style="font-size:12px;opacity:.75;margin:4px 0">Doorgetrokken lijn = te voet (grens) · blauw gestippeld = zeeroute · 🧭 = hier · 🔒 = gesloten · ❔ = nog niet bezocht</div>
    <div style="padding:6px 8px;border:2px solid #8a6d2f;border-radius:8px;background:rgba(255,248,225,.5);font-size:14px">${info}${btn}</div>`;
}
