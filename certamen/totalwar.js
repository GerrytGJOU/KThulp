/* ============================================================
   PERSISTENT TOTAL WAR — ontwerp-/voorbeeldfase (NIET speelbaar)
   ------------------------------------------------------------
   Tweede spelmodus naast Battle Mode. Doel: een doorlopende
   veldtocht waarin elke klas een vaste beschaving is en samen
   strijdt om gebieden op één gedeelde kaart van Europa.

   STATUS: alleen concept + docent-voorbeeld. Leerlingen kunnen
   deze modus nog NIET binnengaan. Zie TOTAL_WAR.md (root) voor
   het volledige ontwerp en het beoogde datamodel.

   Dit bestand bevat:
   - TW_CIVS                  : beschavingen (kleuren)
   - TW_DEMO_*                : voorbeeldstand op de echte kaart
   - SCREENS.totalWar         : publieke "Binnenkort"-uitleg
   - SCREENS.totalWarPreview  : docent-voorbeeld met de echte
                                provinciekaart (certamen/map/)
   ============================================================ */

/* ---- Beschavingen (klassen krijgen er later vast één toegewezen) ---- */
const TW_CIVS = {
  neutral: { nm:"Neutraal",   color:"#5b5145", soft:"#3a342b" },
  gallii:  { nm:"Galliërs",   color:"#3f7d3a", soft:"#244a22" },
  athenae: { nm:"Atheners",   color:"#2e6fb0", soft:"#1c4570" },
  persae:  { nm:"Perzen",     color:"#8a4fb0", soft:"#542f6e" },
  roma:    { nm:"Romeinen",   color:"#a8261a", soft:"#5a120c" },
};

/* ---- Maximale verdediging: gebieden blijven altijd veroverbaar ---- */
const TW_DEFENSE_CAP = 100;

/* ---- Voorbeeldstand: welke beschaving bezit welke echte provincie ----
   Sleutels = provincie-id's uit certamen/map/provinces.svg (== provinces.json).
   Puur ter illustratie van het concept; nog geen echte veldtocht. */
const TW_DEMO_OWN = {
  italia:"roma", sicilia:"roma", sardinia:"roma", corsica:"roma",
  dalmatia:"roma", gallia_narbonensis:"roma",
  gallia_belgica:"gallii", gallia_lugdunensis:"gallii",
  gallia_aquitania:"gallii", germania_superior:"gallii", germania_inferior:"gallii",
  macedonia:"athenae", achaea:"athenae", thracia:"athenae", asia:"athenae",
  cappadocia:"persae", galatia:"persae", syria:"persae",
  armenia:"persae", mesopotamia:"persae",
};
const TW_DEMO_DEF = {
  italia:95, sicilia:40, sardinia:30, corsica:25, dalmatia:55, gallia_narbonensis:60,
  gallia_belgica:70, gallia_lugdunensis:65, gallia_aquitania:45,
  germania_superior:80, germania_inferior:60,
  macedonia:60, achaea:50, thracia:45, asia:70,
  cappadocia:50, galatia:35, syria:75, armenia:40, mesopotamia:30,
};

/* Cache: SVG-tekst en het provincieregister worden één keer opgehaald. */
let _twSvgCache = null;
let _twRegistry = null;

/* ------------------------------------------------------------
   SCHERM: publieke "Binnenkort"-uitleg
   Leerlingen zien wel het concept, maar kunnen niets starten.
   ------------------------------------------------------------ */
SCREENS.totalWar = function(){
  document.body.classList.remove("greek");
  H(brand(true)+`
  <div class="scrhead">
    <button class="back" onclick="go('home')">${iconSVG("shield",20,"currentColor")}</button>
    <h2>🗺️ Total War</h2>
  </div>

  <div class="panel" style="border-color:var(--hi-dim);text-align:center">
    <span class="pill" style="background:var(--stone4);color:var(--hi-bright)">Binnenkort · in ontwerp</span>
    <p class="note" style="margin-top:10px">
      Een tweede spelmodus naast Battle Mode. <b>Nog niet speelbaar</b> —
      docenten kunnen alvast een voorbeeld bekijken.
    </p>
  </div>

  <div class="panel">
    <h3>Het idee</h3>
    <p class="note">
      Elke klas hoort blijvend bij één <b>beschaving</b> (bijv. G3A → Atheners,
      V4 Latijn → Galliërs) en strijdt op één gedeelde <b>kaart van Europa</b>.
      De veldtocht loopt door over weken en maanden in plaats van te eindigen
      na één les.
    </p>
  </div>

  <div class="two">
    <div class="panel"><h3>Veroveren</h3>
      <p class="note">Neutrale gebieden verover je via een AI-bazengevecht.
      Win je, dan kleurt het gebied in jouw beschaving.</p></div>
    <div class="panel"><h3>Verdedigen</h3>
      <p class="note">Elke keer dat je <b>oefent</b>, bouw je mee aan de muren
      van je beschaving. Oefenen beschermt zo de hele klas.</p></div>
    <div class="panel"><h3>Buren = vijanden</h3>
      <p class="note">Grenzen twee beschavingen aan elkaar, dan kunnen ze elkaar
      aanvallen — asynchroon, ook als de tegenstander offline is.</p></div>
    <div class="panel"><h3>Eerlijk per klasgrootte</h3>
      <p class="note">Kleine klassen tellen per leerling zwaarder, zodat een
      actieve kleine klas net zo sterk kan zijn als een grote.</p></div>
  </div>

  <div class="panel">
    <h3>Veldtochtkaart (voorbeeld)</h3>
    <p class="note" style="margin-bottom:10px">Zo kan de kaart er tijdens een
    veldtocht uitzien — elke kleur is een beschaving. (Alleen-lezen voorbeeld.)</p>
    <div id="twMapHost" style="background:#9fc7f4;border:1px solid var(--stone4);border-radius:14px;overflow:hidden;min-height:120px">
      <div class="note" style="padding:22px;text-align:center">Kaart laden…</div>
    </div>
    <div id="twLegendBox" class="chips" style="margin-top:12px"></div>
  </div>

  <div class="panel" style="text-align:center">
    <p class="note" style="margin-bottom:12px">Ben je docent? Bekijk het interactieve voorbeeld van de veldtochtkaart.</p>
    <button class="btn btn-gold" onclick="go('totalWarPreview')">${iconSVG("column",18,"currentColor")} Docent-voorbeeld</button>
  </div>
  ${foot()}`);
  twLoadMap(false);
};

/* ------------------------------------------------------------
   SCHERM: docent-voorbeeld (achter docentenlogin)
   Echte provinciekaart van het Romeinse Rijk met voorbeeldstand.
   ------------------------------------------------------------ */
SCREENS.totalWarPreview = function(){
  // Alleen docenten: bij twijfel (of een auth-fout) terug naar de login.
  let loggedIn=false;
  try{ loggedIn = teacherNet().isTeacherLoggedIn(); }catch(e){ loggedIn=false; }
  if(!loggedIn){
    toast("Alleen voor docenten","Log eerst in via het docentenportaal.");
    go("teacherLogin"); return;
  }
  document.body.classList.remove("greek");
  H(brand(true)+`
  <div class="scrhead">
    <button class="back" onclick="go('totalWar')">${iconSVG("shield",20,"currentColor")}</button>
    <h2>Total War — voorbeeld</h2>
  </div>

  <div class="panel" style="border-color:var(--hi-dim)">
    <div class="note warn" style="text-align:center">
      <b>Concept-voorbeeld.</b> Echte kaart van het Romeinse Rijk (Trajanus) met
      een voorbeeldstand — <b>klik op een provincie</b>. Nog geen echte veldtocht
      of opslag.
    </div>
  </div>

  <div class="panel">
    <h3>Veldtochtkaart</h3>
    <div id="twMapHost" style="background:#9fc7f4;border:1px solid var(--stone4);border-radius:14px;overflow:hidden;min-height:120px">
      <div class="note" style="padding:22px;text-align:center">Kaart laden…</div>
    </div>
    <div id="twInfo" class="panel" style="margin:12px 0 0">
      <span class="note">Klik op een provincie voor details.</span>
    </div>
    <div id="twLegendBox" class="chips" style="margin-top:12px"></div>
  </div>
  ${foot()}`);
  twLoadMap();
};

/* ---- Kaart laden (fetch + inline SVG) en voorbeeldstand toepassen ----
   interactive=false → alleen-lezen (geen klikselectie); default true. */
async function twLoadMap(interactive){
  interactive = interactive !== false;
  const host = el("twMapHost"); if(!host) return;
  try{
    if(!_twSvgCache){
      const V = "?v=20260702m3";
      const [svg, reg] = await Promise.all([
        fetch("map/provinces.svg"+V).then(r=>{ if(!r.ok) throw new Error("SVG "+r.status); return r.text(); }),
        fetch("map/provinces.json"+V).then(r=> r.ok ? r.json() : {}).catch(()=>({})),
      ]);
      _twSvgCache = svg; _twRegistry = reg;
    }
    host.innerHTML = _twSvgCache;
    const svgEl = host.querySelector("svg");
    if(svgEl){
      svgEl.removeAttribute("width");
      svgEl.removeAttribute("height");
      svgEl.setAttribute("style","width:100%;height:auto;display:block");
    }
    twApplyDemo();
    if(interactive) twBindMapClicks(host);
    const lg = el("twLegendBox"); if(lg) lg.innerHTML = twLegend();
  }catch(e){
    host.innerHTML = `<div class="note warn" style="padding:18px">De kaart kon niet
      geladen worden (${esc(e.message)}). Open de app via de webserver
      (GitHub Pages), niet als los <code>file://</code>-bestand.</div>`;
  }
}

/* ---- Voorbeeldstand kleuren via de MapAPI-helper (map/provinces.js) ---- */
function twApplyDemo(){
  if(typeof MapAPI==="undefined") return;
  Object.entries(TW_DEMO_OWN).forEach(([id,civId])=>{
    const c=TW_CIVS[civId];
    if(c && civId!=="neutral") MapAPI.setProvinceOwner(id, c.color);
  });
  Object.entries(TW_DEMO_DEF).forEach(([id,v])=> MapAPI.setProvinceDefense(id, v));
}

/* ---- Klik op een provincie → selecteren + detailpaneel bijwerken ---- */
function twBindMapClicks(host){
  host.addEventListener("click", ev=>{
    const p = ev.target.closest && ev.target.closest(".province");
    if(!p) return;
    twSelectProvince(p.getAttribute("data-province") || p.id);
  });
}

function twSelectProvince(id){
  const host = el("twMapHost"); if(!host || !id) return;
  host.querySelectorAll(".province.selected").forEach(e=>e.classList.remove("selected"));
  // Selecteer alle fragmenten van dezelfde provincie (bv. Cyprus = 2 paden).
  host.querySelectorAll(`[id="${id}"], [data-province="${id}"]`).forEach(e=>e.classList.add("selected"));
  const info = el("twInfo"); if(info) info.innerHTML = twProvinceInfo(id);
}

function twProvinceInfo(id){
  const reg  = _twRegistry && _twRegistry[id];
  const nm   = (reg && reg.displayName) || id;
  const civId= TW_DEMO_OWN[id] || "neutral";
  const civ  = TW_CIVS[civId] || TW_CIVS.neutral;
  const owned= civId !== "neutral";
  const def  = TW_DEMO_DEF[id] || 0;
  const cities = (reg && reg.cities) || [];
  return `
    <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
      <b style="font-size:16px">${esc(nm)}</b>
      <span class="pill" style="background:${civ.soft};color:#f3e9d2;border:none">
        ${owned ? esc(civ.nm) : "neutraal — veroverbaar"}</span>
    </div>
    ${owned ? `<div class="note" style="margin-top:6px">Verdediging: ${def}/${TW_DEFENSE_CAP}</div>` : ""}
    <div class="note" style="margin-top:4px">Steden: ${cities.length ? cities.map(esc).join(" · ") : "—"}</div>`;
}

/* ---- Legenda van beschavingen met aantal gebieden in de voorbeeldstand ---- */
function twLegend(){
  const counts = {};
  Object.values(TW_DEMO_OWN).forEach(c=> counts[c]=(counts[c]||0)+1);
  return Object.entries(TW_CIVS).map(([id,c])=>{
    const owned = counts[id] || 0;
    return `<span class="chip"><span style="display:inline-block;width:12px;height:12px;border-radius:3px;
      background:${c.color};margin-right:6px;vertical-align:middle"></span>${esc(c.nm)}${
      id!=="neutral" ? ` <small>${owned} gebied${owned!==1?'en':''}</small>` : ""}</span>`;
  }).join("");
}
