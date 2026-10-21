/* ============================================================================
   CASTRA HEROUM — WERELDKAART OP BASIS VAN DE TOTAL WAR-KAART
   ----------------------------------------------------------------------------
   Dezelfde Romeinse provinciekaart als in Total War (map/provinces.svg + provinces.json),
   aangepast: de provincies waar Castra-regio's liggen kleuren mee met je voortgang
   (huidig / bezocht / open / gesloten), de rest van het Rijk staat er vervaagd bij
   ("onontdekt land": hier kunnen later extra provincies bijkomen). De regio's staan als
   markeringen op steden uit het provincieregister; lopen = doorgetrokken lijn, zee =
   blauw gestippeld. Opent schermvullend vanuit het menu (Tabula).

   Een nieuwe provincie toevoegen: werelddefinitie in castra-world.js, vermelding in
   CASTRA_GEO (links, hub) én hieronder in CASTRA_GEO_ANCHOR (provincie-id + coördinaten
   uit provinces.json).
   Laadt NA castra-geo.js.
   ============================================================================ */
const CASTRA_GEO_ANCHOR = {
  latium:     { prov:"italia",               x:107600, y:139300 },   // omgeving Capua/Napels
  roma:       { prov:"italia",               x:103259, y:135040 },   // Roma
  gallia:     { prov:"gallia_lugdunensis",   x:81583,  y:120224 },   // Lugdunum
  germania:   { prov:"germania_inferior",    x:94254,  y:103944 },   // Colonia Agrippina
  graecia:    { prov:"achaea",               x:130507, y:146523 },   // Athenae
  laconia:    { prov:"achaea",               x:135278, y:150693 },   // Sparta
  troia:      { prov:"asia",                 x:145032, y:136500 },   // Troas (ten noorden van Smyrna)
  themiscyra: { prov:"bithynia_et_pontus",   x:163500, y:127800 },   // Pontische kust
  persis:     { prov:"mesopotamia",          x:180970, y:136448 },   // Nisibis (oostrand van de kaart)
  aegyptus:   { prov:"aegyptus",             x:153330, y:166986 },   // Memphis
  africa:     { prov:"africa_proconsularis", x:102629, y:158292 },   // Carthago
};
const CASTRA_GEO_CAMP_ANCHOR = { x:111200, y:143000 };
let _castraGeoSvg = null;
const CASTRA_GEO_COL = { current:"#d4af37", visited:"#8fbf6a", open:"#ecdc9c", locked:"#b3a88c" };

function castraGeoStatus(id){
  if(id==="camp") return castraGeoHere()==="camp" ? "current" : "visited";
  if(castraGeoHere()===id) return "current";
  if(!castraRegionOpen(id)) return "locked";
  return castraGeoVisited(id) ? "visited" : "open";
}
function castraGeoMapClose(){ const m = document.getElementById("castraGeoMap"); if(m) m.remove(); }
async function castraGeoMapOpen(){
  castraGeoMapClose();
  castraGeoBackfill();
  CASTRA_MENU.geoSel = castraGeoHere() || "latium";
  const o = document.createElement("div"); o.id = "castraGeoMap";
  o.style.cssText = "position:fixed;inset:0;z-index:9985;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;padding:8px;box-sizing:border-box";
  o.onclick = ev=>{ if(ev.target===o) castraGeoMapClose(); };
  o.innerHTML = `<div style="background:linear-gradient(var(--parch,#efe1b9),var(--parch2,#e4d2a1));color:var(--parch-ink,#2b1d0e);border:4px solid var(--parch-edge,#4a3416);border-radius:12px;box-shadow:0 0 0 2px var(--parch-gold,#c9a24a),0 8px 28px rgba(0,0,0,.6);width:min(100%,1100px);max-height:100%;overflow:auto;padding:10px 12px;box-sizing:border-box">
    <div style="display:flex;justify-content:space-between;align-items:center;gap:8px"><h3 style="margin:0">🗺️ Tabula <small>wereldkaart</small></h3><button class="btn" style="min-height:44px;min-width:44px" onclick="castraGeoMapClose()">✕</button></div>
    <div id="castraGeoHost" style="margin-top:6px;border:3px solid var(--parch-edge,#4a3416);border-radius:10px;overflow:hidden;background:#a9c4cf;min-height:200px"><div style="padding:30px;text-align:center">Kaart laden…</div></div>
    <div id="castraGeoInfo" style="margin-top:6px"></div></div>`;
  document.body.appendChild(o);
  const host = document.getElementById("castraGeoHost");
  try{
    if(!_castraGeoSvg){ const r = await fetch("map/provinces.svg?v=20260703a"); if(!r.ok) throw new Error("kaart "+r.status); _castraGeoSvg = await r.text(); }
    host.innerHTML = _castraGeoSvg;
    const svg = host.querySelector("svg"); svg.removeAttribute("width"); svg.removeAttribute("height"); svg.setAttribute("style","width:100%;height:auto;display:block;background:#a9c4cf");
    castraGeoMapPaint();
  }catch(e){
    host.innerHTML = `<div style="padding:12px;background:var(--parch,#efe1b9)">De kaartafbeelding kon niet geladen worden (${esc(e.message)}). Schematische kaart:</div><div style="padding:8px;background:var(--parch,#efe1b9)">${castraGeoMapView()}</div>`;
  }
  castraGeoInfoRender();
}
// Kleur de provincies, voeg lijnen en regiomarkeringen toe en zoom in op het speelgebied.
function castraGeoMapPaint(){
  const host = document.getElementById("castraGeoHost"); if(!host) return; const svg = host.querySelector("svg"); if(!svg) return;
  const provs = {}; const rank = { current:4, visited:3, open:2, locked:1 };
  Object.keys(CASTRA_GEO_ANCHOR).forEach(id=>{ const a = CASTRA_GEO_ANCHOR[id], s = castraGeoStatus(id); if(!provs[a.prov] || rank[s]>rank[provs[a.prov]]) provs[a.prov] = s; });
  svg.querySelectorAll(".province").forEach(el=>{
    const id = el.id, s = provs[id];
    if(s){ el.style.setProperty("--province-fill", CASTRA_GEO_COL[s]); el.style.opacity = "1"; }
    else { el.style.setProperty("--province-fill", "#cfc7b0"); el.style.opacity = "0.55"; el.style.cursor = "default"; }
    el.onclick = s ? (()=>{ const first = Object.keys(CASTRA_GEO_ANCHOR).find(r=>CASTRA_GEO_ANCHOR[r].prov===id); if(first){ CASTRA_MENU.geoSel = first; castraGeoMapPaint(); castraGeoInfoRender(); } }) : null;
  });
  const old = svg.querySelector("#castraGeoLayer"); if(old) old.remove();
  const first = svg.querySelector(".province"), parent = first ? first.parentNode : svg, ns = "http://www.w3.org/2000/svg";
  let M = { a:1,b:0,c:0,d:1,e:0,f:0 };
  try{ if(parent!==svg){ const m = svg.getScreenCTM().inverse().multiply(parent.getScreenCTM()); M = { a:m.a, b:m.b, c:m.c, d:m.d, e:m.e, f:m.f }; } }catch(e){}
  const T = (x,y)=>({ x:M.a*x+M.c*y+M.e, y:M.b*x+M.d*y+M.f });
  const ids = Object.keys(CASTRA_GEO_ANCHOR), P = {};
  ids.forEach(id=>{ P[id] = T(CASTRA_GEO_ANCHOR[id].x, CASTRA_GEO_ANCHOR[id].y); }); P.camp = T(CASTRA_GEO_CAMP_ANCHOR.x, CASTRA_GEO_CAMP_ANCHOR.y);
  const xs = Object.values(P).map(p=>p.x), ys = Object.values(P).map(p=>p.y);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const w0 = x1-x0, h0 = y1-y0, pad = Math.max(w0,h0)*0.12;
  let vx = x0-pad, vy = y0-pad, vw = w0+2*pad, vh = h0+2*pad;
  const asp = 1.55; if(vw/vh < asp){ const nw = vh*asp; vx -= (nw-vw)/2; vw = nw; } else { const nh = vw/asp; vy -= (nh-vh)/2; vh = nh; }
  svg.setAttribute("viewBox", [vx,vy,vw,vh].join(" "));
  const g = document.createElementNS(ns, "g"); g.setAttribute("id","castraGeoLayer");
  const R = vw*0.0185, sw = vw*0.0015;
  const el = (tag, at, txt)=>{ const n = document.createElementNS(ns, tag); Object.keys(at).forEach(k=>n.setAttribute(k, at[k])); if(txt!==undefined) n.textContent = txt; g.appendChild(n); return n; };
  // lijnen: lopen (doorgetrokken) en zee (gestippeld)
  const seen = {};
  ["camp"].concat(ids).forEach(a=>{ const links = a==="camp" ? { S:"latium" } : CASTRA_GEO[a].links; Object.keys(links).forEach(d=>{ const b = links[d]; const k = [a,b].sort().join("|"); if(seen[k]) return; seen[k] = 1;
    const open = (a==="camp"||castraRegionOpen(a)) && (b==="camp"||castraRegionOpen(b));
    el("line",{ x1:P[a].x, y1:P[a].y, x2:P[b].x, y2:P[b].y, stroke: open?"#5a3a10":"#7d725a", "stroke-width":sw*2.2, "stroke-linecap":"round", "stroke-dasharray": open?"":(sw*5)+" "+(sw*5), "pointer-events":"none" }); }); });
  [["latium","graecia"],["latium","africa"]].forEach(([a,b])=>el("line",{ x1:P[a].x, y1:P[a].y, x2:P[b].x, y2:P[b].y, stroke:"#1d5d8c", "stroke-width":sw*2, "stroke-dasharray":(sw*3)+" "+(sw*6), "stroke-linecap":"round", "pointer-events":"none" }));
  // markeringen
  ["camp"].concat(ids).forEach(id=>{
    const p = P[id], s = castraGeoStatus(id), sel = CASTRA_MENU.geoSel===id, vis = castraGeoVisited(id);
    const grp = document.createElementNS(ns, "g"); grp.setAttribute("style","cursor:pointer"); grp.onclick = ev=>{ ev.stopPropagation(); CASTRA_MENU.geoSel = id; castraGeoMapPaint(); castraGeoInfoRender(); };
    const mk = (tag, at, txt)=>{ const n = document.createElementNS(ns, tag); Object.keys(at).forEach(k=>n.setAttribute(k, at[k])); if(txt!==undefined) n.textContent = txt; grp.appendChild(n); return n; };
    mk("circle",{ cx:p.x, cy:p.y, r:R*(id==="camp"?0.8:1), fill: s==="current"?"#d4af37":s==="locked"?"#cbbd96":"#fff6d6", stroke: sel?"#c0291b":"#3a2a10", "stroke-width": sel?sw*5:sw*3 });
    mk("text",{ x:p.x, y:p.y+R*0.36, "text-anchor":"middle", "font-size":R*1.15, "pointer-events":"none" }, s==="locked"?"🔒":(vis||id==="camp"?castraGeoIcon(id):"❔"));
    mk("text",{ x:p.x, y:p.y+R*1.85, "text-anchor":"middle", "font-size":R*0.85, "font-weight":"bold", fill:"#2b1d0e", stroke:"#f4e9c4", "stroke-width":sw*2.2, "paint-order":"stroke", "pointer-events":"none" }, (s==="current"?"🧭 ":"")+(s==="locked"&&!vis?"???":castraGeoName(id)));
    g.appendChild(grp);
  });
  svg.appendChild(g);
}
function castraGeoInfoRender(){
  const box = document.getElementById("castraGeoInfo"); if(!box) return;
  const here = castraGeoHere(), sel = CASTRA_MENU.geoSel || "latium";
  let info;
  if(sel==="camp") info = `<b>🏕️ Castra</b> — je kamp. Hier bouw je, verzamel je soldaten en start je missies. Bereikbaar via de zuidpoort van Latium.`;
  else {
    const W = CASTRA_WORLDS[sel], V = CASTRA_VENATIO[sel], open = castraRegionOpen(sel), vis = castraGeoVisited(sel);
    const heroes = Object.keys(CASTRA_HERO_DATA).filter(h=>CASTRA_HERO_DATA[h].region===sel), got = heroes.filter(h=>castraHero(h)).length;
    const ms = CASTRA_P_MISSIONS.filter(m=>m.region===sel), done = ms.filter(m=>castraPMissionDone(m.id)).length;
    const need = CASTRA_P_MISSIONS.find(m=>m.id===CASTRA_REGION_NEEDS[sel]);
    const route = CASTRA_P_MISSIONS.map(m=>m.region).filter((r,i,a)=>a.indexOf(r)===i), order = route.indexOf(sel)+1;
    info = `<b>${W.icon} ${esc(W.nm)}</b> <small>(etappe ${order} van ${route.length})</small> ${!open?`<span style="color:#8a1c10">· gesloten${need?": win eerst "+esc(need.nm)+" ("+esc(need.nl)+")":""}</span>`:vis?"":"· nog niet bezocht"}<br>
      <small>${V?`Aanbevolen: soldaten rond level ${V.min}–${V.max} · `:""}${heroes.length?`⭐ ${got}/${heroes.length} helden · `:""}${ms.length?`⚔️ ${done}/${ms.length} missies · `:""}${CASTRA_GEO[sel].hubType==="port"?"⚓ haven":"🐪 caravanstation"} · buren: ${Object.values(CASTRA_GEO[sel].links).map(castraGeoName).join(", ")}</small>`;
  }
  const canTravel = castraGeoCanTravel(), ok = sel!==here && (sel==="camp" || (castraRegionOpen(sel) && castraGeoVisited(sel)));
  const cost = sel==="camp" ? 0 : (here ? CASTRA_GEO_COST*Math.max(1,castraGeoHops(here, sel)) : 0);
  const btn = !here ? "" : (sel===here) ? `<div class="note">Je bent hier.</div>`
    : !ok ? `<div class="note">${sel!=="camp" && !castraRegionOpen(sel)?"Deze regio is nog gesloten.":"Bezoek deze regio eerst te voet."}</div>`
    : canTravel ? `<button class="btn btn-gold" style="min-height:44px;margin-top:4px" onclick="castraGeoTravel('${sel}')">${sel==="camp"?"🏕️ Terug naar het kamp (gratis)":"🧭 Reis naar "+esc(castraGeoName(sel))+" (🪙 "+cost+")"}</button>`
    : `<div class="note">Reizen kan vanuit het kamp of bij een reisplek (⚓ / 🐪) in een regio. Loop erheen en tik erop.</div>`;
  box.innerHTML = `<div style="padding:6px 8px;border:2px solid var(--hi-dim,#8a6d2f);border-radius:8px;background:rgba(255,248,225,.5);font-size:14px">${info}${btn}</div>
    <div style="font-size:12px;opacity:.75;margin-top:4px">Doorgetrokken lijn = te voet · blauw gestippeld = zeeroute · 🧭 hier · 🔒 gesloten · ❔ nog niet bezocht. Het vervaagde land is nog onontdekt: hier kunnen later extra provincies bijkomen.</div>`;
}
// Reizen sluit de kaart (de oorspronkelijke castraGeoTravel sluit het menu al).
const _castraGeoTravel0 = castraGeoTravel;
castraGeoTravel = function(to){ castraGeoMapClose(); return _castraGeoTravel0(to); };
