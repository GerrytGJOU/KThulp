/* ============================================================================
   CASTRA HEROUM — ZONES (bos, weg, veld, ...) DUIDELIJK MAKEN
   ----------------------------------------------------------------------------
   Opdrachten vragen vijanden te verslaan "in silva", "in via" of "in campo", maar op de kaart was niet te zien waar die
   zones liggen. Nu:
   - elke zone heeft een gestippelde rand en een naamplaat op de kaart (icoon, Latijnse naam, Nederlandse uitleg);
   - bovenaan staat een chip met de zone waar je nu in staat; hoort die bij een lopende opdracht, dan krijgt hij een ✔
     en een melding, en anders staat er in welke zone je wel moet zijn (de pijl wijst de richting);
   - vijanden uit een opdracht tellen alleen als je ze in dat soort hoog gras verslaat (zie castra-diarium.js).
   Laadt NA castra-stage.js (de chip hoort bij het speelscherm) en castra-interiors.js.
   ============================================================================ */
const CASTRA_ZONE_INFO = {
  silva:["🌲","Silva","het bos"], via:["🛤️","Via","de weg"], campus:["🌾","Campus","het veld"], tiberis:["🌊","Tiberis","de Tiber"],
  olea:["🫒","Olea","de olijfgaard"], litus:["🏖️","Litus","de kust"], muros:["🏰","Muri","bij de muren"], scamander:["🌊","Scamander","de rivier"],
  nilus:["🌴","Nilus","de Nijl"], arena:["🏟️","Arena","de arena"], urbs:["🏛️","Urbs","de stad"], vicus:["🏘️","Vicus","het dorp"],
  cuniculus:["🕳️","Cuniculus","de tunnel"], catacumbae:["💀","Catacumbae","de catacomben"], sepulcretum:["⚰️","Sepulcretum","het kerkhof"], mons:["⛰️","Mons","de bergen"], castra:["⛺","Castra","bij het kamp"],
};
function castraZoneInfo(t){ return CASTRA_ZONE_INFO[t] || ["📍", String(t||"").charAt(0).toUpperCase()+String(t||"").slice(1), ""]; }
function castraZoneAt(W, x, y){ return (W.zones||[]).find(z=>x>=z.x && x<z.x+z.w && y>=z.y && y<z.y+z.h) || null; }
// Zones waarin een lopende opdracht vijanden wil zien (in de huidige regio).
function castraZoneNeeded(){
  const W = castraWorldCfg(), rid = W.parent || W.id, out = {};
  try{ (castraDqActive()||[]).forEach(q=>{ const st = castraDqState(q.id), s = q.steps[st.s]; if(s && s.kind==="kill" && (s.region||rid)===rid && s.terrain) out[s.terrain] = q.nm.nl; }); }catch(_){}
  try{ Object.keys(CASTRA_HERO_DATA).forEach(id=>{ if(castraHero(id)) return; const q = castraQState(id), s = castraStepOf(id);
    if(q && q.acc && s && s.kind==="kill" && s.region===rid && s.terrain) out[s.terrain] = CASTRA_HERO_DATA[id].nm; }); }catch(_){}
  return out;
}

/* ---------- gestippelde rand en naamplaat op de kaart ---------- */
const _castraWobjDrawZn0 = castraWobjDraw;
castraWobjDraw = function(){
  _castraWobjDrawZn0.apply(this, arguments);
  try{
    const box = el("cwWobj"), W = castraWorldCfg(); if(!box || !W.zones || !W.zones.length || W.interior) return;
    const need = castraZoneNeeded(); let html = "";
    W.zones.forEach(z=>{ const [ic, la, nl] = castraZoneInfo(z.t), want = !!need[z.t];
      html += `<div style="position:absolute;left:${z.x*48}px;top:${z.y*48}px;width:${z.w*48}px;height:${z.h*48}px;box-sizing:border-box;border:3px dashed ${want?"rgba(255,225,90,.9)":"rgba(255,255,255,.4)"};border-radius:18px;pointer-events:none;z-index:1"></div>
        <div style="position:absolute;left:${z.x*48+10}px;top:${z.y*48+8}px;z-index:2;pointer-events:none;padding:3px 10px;border-radius:14px;background:rgba(20,16,10,.6);color:${want?"#ffe15a":"#f3e6bd"};font-weight:bold;font-size:15px;white-space:nowrap">${ic} ${la}${nl?` <span style="font-weight:normal;opacity:.85;font-size:13px">· ${nl}</span>`:""}</div>`; });
    box.insertAdjacentHTML("beforeend", html);
  }catch(e){ console.error(e); }
};

/* ---------- chip met de zone waar je nu staat ---------- */
function castraZoneChipUpdate(){
  const stage = document.getElementById("castraStage"), top = el("cgTop"); if(!stage || !top || !el("cwMap")) return;
  const W = castraWorldCfg(); if(W.interior || !W.zones || !W.zones.length){ const c0 = el("cgZone"); if(c0) c0.remove(); return; }
  let c = el("cgZone"); if(!c){ c = document.createElement("div"); c.id = "cgZone"; c.style.cssText = "align-self:center;padding:3px 12px;border-radius:14px;background:rgba(20,16,10,.82);color:#f3e6bd;font-size:13px;font-weight:bold;pointer-events:auto"; top.insertBefore(c, top.firstChild); }
  const z = castraZoneAt(W, CASTRA_W_UI.px, CASTRA_W_UI.py), need = castraZoneNeeded(), keys = Object.keys(need);
  let txt, ok = false;
  if(z){ const [ic, la, nl] = castraZoneInfo(z.t); ok = !!need[z.t]; txt = `📍 ${ic} ${la}${nl?" ("+nl+")":""}${ok?" ✔ hier tellen je vijanden voor “"+need[z.t]+"”":""}`; }
  else txt = "📍 Open veld";
  if(!ok && keys.length){ const t = keys[0], [ic, la, nl] = castraZoneInfo(t), tz = W.zones.find(q=>q.t===t);
    let arrow = ""; if(tz){ const dx = tz.x+tz.w/2-CASTRA_W_UI.px, dy = tz.y+tz.h/2-CASTRA_W_UI.py; arrow = Math.abs(dx)>Math.abs(dy) ? (dx>0?"→":"←") : (dy>0?"↓":"↑"); }
    txt += ` · opdracht: ${ic} ${la}${nl?" ("+nl+")":""} ${arrow}`; }
  if(c.textContent!==txt){ c.textContent = txt; c.style.color = ok ? "#ffe15a" : "#f3e6bd"; }
  if(ok && c.dataset.t!==z.t){ c.dataset.t = z.t; if(typeof toast==="function") toast("✔ "+castraZoneInfo(z.t)[1], "Vijanden voor je opdracht tel je hier."); }
  if(!ok) c.dataset.t = "";
}
const _castraStageBuildZn0 = castraStageBuild;
castraStageBuild = function(kind){
  _castraStageBuildZn0.apply(this, arguments);
  if(kind==="world"){
    const t = setInterval(()=>{ if(!document.getElementById("castraStage")){ clearInterval(t); return; } try{ castraZoneChipUpdate(); }catch(_){} }, 400);
    try{ castraZoneChipUpdate(); }catch(_){}
  }
};
