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
   - TW_CIVS / TW_MAP : voorlopig datamodel + voorbeeldstand
   - SCREENS.totalWar        : publieke "Binnenkort"-uitleg
   - SCREENS.totalWarPreview : docent-voorbeeld (achter login)
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

/* ---- Gebieden: bestaan uit steden, hebben buren en (mock) eigenaar ----
   x/y = positie op de schematische kaart (viewBox 0 0 820 560).
   defense = huidige (voorbeeld) verdedigingssterkte 0..TW_DEFENSE_CAP.
   Dit is bewust een SCHEMATISCHE knooppuntkaart, geen geografie:
   ze maakt de kern­regel ("gedeelde grens ⇒ aanvalbaar") meteen zichtbaar. */
const TW_MAP = [
  { id:"britannia", nm:"Britannia", x:70,  y:30,  owner:"neutral", defense:0,
    bonus:"Tin & zilver — extra muntopbrengst.",
    cities:["Londinium","Camulodunum","Eboracum"],
    neighbors:["gallia"] },
  { id:"germania", nm:"Germania", x:330, y:30,  owner:"neutral", defense:0,
    bonus:"Wouden — snellere verdedigingsopbouw.",
    cities:["Colonia","Mogontiacum","Treveri"],
    neighbors:["gallia","italia","macedonia"] },
  { id:"gallia", nm:"Gallia", x:150, y:160, owner:"gallii", defense:80,
    bonus:"Graanschuur — meer Battle Energy per ronde.",
    cities:["Lutetia","Massilia","Alesia"],
    neighbors:["britannia","germania","hispania","italia"] },
  { id:"hispania", nm:"Hispania", x:60,  y:320, owner:"gallii", defense:35,
    bonus:"Mijnen — bonus op zeldzame avatars.",
    cities:["Gades","Carthago Nova","Numantia"],
    neighbors:["gallia","africa"] },
  { id:"italia", nm:"Italia", x:360, y:210, owner:"roma", defense:90,
    bonus:"Hoofdstad — sterkste fortbonus van de kaart.",
    cities:["Roma","Capua","Tarentum"],
    neighbors:["gallia","germania","macedonia","graecia","africa"] },
  { id:"macedonia", nm:"Macedonia", x:480, y:130, owner:"neutral", defense:0,
    bonus:"Falanx — verdediging daalt trager bij verlies.",
    cities:["Pella","Thessalonica","Amphipolis"],
    neighbors:["germania","italia","graecia","asia"] },
  { id:"graecia", nm:"Graecia", x:480, y:290, owner:"athenae", defense:60,
    bonus:"Academie — extra XP voor de hele beschaving.",
    cities:["Athene","Sparta","Korinthe"],
    neighbors:["italia","macedonia","asia","aegyptus"] },
  { id:"asia", nm:"Asia", x:650, y:210, owner:"persae", defense:45,
    bonus:"Handelsroutes — korting in de winkel.",
    cities:["Troje","Efeze","Pergamon"],
    neighbors:["macedonia","graecia","aegyptus"] },
  { id:"africa", nm:"Africa", x:310, y:430, owner:"neutral", defense:0,
    bonus:"Olifanten — eenmalige aanvalsbonus bij invasie.",
    cities:["Carthago","Utica","Hippo"],
    neighbors:["hispania","italia","aegyptus"] },
  { id:"aegyptus", nm:"Aegyptus", x:560, y:430, owner:"neutral", defense:0,
    bonus:"Bibliotheek — verlaagt de kosten van forten.",
    cities:["Alexandria","Memphis","Thebe"],
    neighbors:["africa","graecia","asia"] },
];

function twTerr(id){ return TW_MAP.find(t=>t.id===id); }
function twCiv(id){ return TW_CIVS[id] || TW_CIVS.neutral; }

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

  <div class="panel" style="text-align:center">
    <p class="note" style="margin-bottom:12px">Ben je docent? Bekijk het voorbeeld van de veldtochtkaart.</p>
    <button class="btn btn-gold" onclick="go('totalWarPreview')">${iconSVG("column",18,"currentColor")} Docent-voorbeeld</button>
  </div>
  ${foot()}`);
};

/* ------------------------------------------------------------
   SCHERM: docent-voorbeeld (achter docentenlogin)
   Statische mock van de veldtochtkaart. Niets is hier speelbaar.
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
      <b>Concept-voorbeeld.</b> Schematische kaart met voorbeeldstand —
      nog geen echte veldtocht of opslag.
    </div>
  </div>

  <div class="panel">
    <h3>Veldtochtkaart</h3>
    ${twMapSVG()}
    <div class="chips" style="margin-top:12px">${twLegend()}</div>
  </div>

  <div class="panel">
    <h3>Gebieden, steden & bonussen</h3>
    ${twTerritoryList()}
  </div>
  ${foot()}`);
};

/* ---- Schematische SVG-knooppuntkaart ---- */
function twMapSVG(){
  const W=152, H=64;
  // verbindingslijnen tussen buren (één keer per paar)
  let lines="";
  TW_MAP.forEach(t=>{
    (t.neighbors||[]).forEach(nid=>{
      if(t.id<nid){
        const n=twTerr(nid); if(!n) return;
        lines+=`<line x1="${t.x+W/2}" y1="${t.y+H/2}" x2="${n.x+W/2}" y2="${n.y+H/2}"
          stroke="rgba(212,175,55,.28)" stroke-width="2" stroke-dasharray="4 5"/>`;
      }
    });
  });
  // knooppunten
  const nodes=TW_MAP.map(t=>{
    const civ=twCiv(t.owner);
    const owned=t.owner!=="neutral";
    const dw=Math.round((t.defense/TW_DEFENSE_CAP)*(W-20));
    const shield=owned?`<g transform="translate(${t.x+W-26},${t.y+8})">${iconSVG("shield",18,"rgba(255,255,255,.85)")}</g>`:"";
    return `<g>
      <rect x="${t.x}" y="${t.y}" width="${W}" height="${H}" rx="11"
        fill="${civ.soft}" stroke="${owned?civ.color:'#4a4238'}" stroke-width="${owned?3:1.5}"/>
      <text x="${t.x+12}" y="${t.y+24}" fill="#f3e9d2" font-size="16" font-weight="700"
        font-family="Optima,Palatino,serif">${esc(t.nm)}</text>
      <text x="${t.x+12}" y="${t.y+41}" fill="rgba(243,233,210,.7)" font-size="11"
        font-family="Palatino,serif">${owned?esc(civ.nm):'neutraal'} · ${t.cities.length} steden</text>
      <rect x="${t.x+12}" y="${t.y+48}" width="${W-24}" height="7" rx="3.5" fill="rgba(0,0,0,.45)"/>
      <rect x="${t.x+12}" y="${t.y+48}" width="${owned?dw:0}" height="7" rx="3.5" fill="${civ.color}"/>
      ${shield}
    </g>`;
  }).join("");
  return `<div style="overflow-x:auto"><svg viewBox="0 0 820 560" width="100%"
    style="min-width:560px;background:radial-gradient(ellipse at 50% 40%,rgba(212,175,55,.06),transparent 70%);
    border:1px solid var(--stone4);border-radius:14px" xmlns="http://www.w3.org/2000/svg">
    ${lines}${nodes}
  </svg></div>`;
}

/* ---- Legenda van beschavingen ---- */
function twLegend(){
  return Object.entries(TW_CIVS).map(([id,c])=>{
    const owned=TW_MAP.filter(t=>t.owner===id).length;
    return `<span class="chip"><span style="display:inline-block;width:12px;height:12px;border-radius:3px;
      background:${c.color};margin-right:6px;vertical-align:middle"></span>${esc(c.nm)}${
      id!=="neutral"?` <small>${owned} gebied${owned!==1?'en':''}</small>`:""}</span>`;
  }).join("");
}

/* ---- Gebiedslijst met steden en bonussen ---- */
function twTerritoryList(){
  return TW_MAP.map(t=>{
    const civ=twCiv(t.owner);
    const owned=t.owner!=="neutral";
    return `<div class="panel" style="margin-bottom:8px;border-left:4px solid ${owned?civ.color:'#4a4238'}">
      <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
        <b style="font-size:15px">${esc(t.nm)}</b>
        <span class="pill" style="background:${civ.soft};color:#f3e9d2;border:none">${owned?esc(civ.nm):'neutraal'}</span>
        ${owned?`<span class="note" style="margin-left:auto">verdediging ${t.defense}/${TW_DEFENSE_CAP}</span>`:`<span class="note" style="margin-left:auto">veroverbaar</span>`}
      </div>
      <div class="note" style="margin-top:6px">Steden: ${t.cities.map(esc).join(" · ")}</div>
      <div class="note" style="margin-top:2px">Bonus: ${esc(t.bonus)}</div>
    </div>`;
  }).join("");
}
