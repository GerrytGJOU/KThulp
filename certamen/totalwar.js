/* ============================================================
   PERSISTENT TOTAL WAR — fundament gebouwd, nog niet voor leerlingen
   ------------------------------------------------------------
   Tweede spelmodus naast Battle Mode. Doel: een doorlopende
   veldtocht waarin elke klas een vaste beschaving is en samen
   strijdt om gebieden op één gedeelde kaart van Europa.

   STATUS: het docentendeel is echt en blijvend (Firebase-schema,
   klas↔beschaving-koppeling, live kaart, aanvalsflow via Boss
   Battle). Leerlingen kunnen deze modus nog NIET zelf binnengaan
   (Training Mode/§3 ontbreekt nog). Zie TOTAL_WAR.md (root) voor
   het volledige ontwerp en het datamodel.

   Dit bestand bevat:
   - TW_CIVS/TW_HOME_PROVINCES: 7 beschavingen + thuislanden (seed-data)
   - TW_DEMO_*                : demo-stand, uitsluitend voor de
                                publieke (niet-live) uitlegkaart
   - SCREENS.totalWar         : publieke "Binnenkort"-uitleg (demo-kaart)
   - SCREENS.totalWarPreview  : docenten-veldtocht (live Firebase-kaart)
   - twEnsureCampaignSeeded/twStartLive/twApplyLive : het Firebase-schema
     (§4) en de live-listener die de statische demo vervangt
   - twStartAttack/twResolveSiege : aanvalsflow ↔ Boss Battle (battle.js)
   ============================================================ */

/* ---- Beschavingen (klassen krijgen er via het docentenportaal één toegewezen,
   zie TOTAL_WAR.md §2/§7.1). 7 facties + neutraal, thuisland volledig binnen
   de bestaande 46-provinciekaart (TOTAL_WAR.md §9.1). ---- */
const TW_CIVS = {
  neutral:  { nm:"Neutraal",     color:"#dfd5c6", soft:"#b3a98e" },
  roma:     { nm:"Romeinen",     color:"#a8261a", soft:"#5a120c" },
  gallii:   { nm:"Galliërs",     color:"#3f7d3a", soft:"#244a22" },
  germani:  { nm:"Germanen",     color:"#4a2c11", soft:"#2a1809" },
  athenae:  { nm:"Grieken",      color:"#2e6fb0", soft:"#1c4570" },
  persae:   { nm:"Perzen",       color:"#8a4fb0", soft:"#542f6e" },
  carthago: { nm:"Carthagers",   color:"#550088", soft:"#33004f" },
  aegyptii: { nm:"Egyptenaren",  color:"#e67e22", soft:"#8a4a10" },
  britanni: { nm:"Britten",      color:"#1f8a8a", soft:"#0f4d4d" },
};

/* ---- Thuisprovincies per beschaving: uitsluitend seed-data voor een nieuwe
   veldtocht (zie twEnsureCampaignSeeded()) — TOTAL_WAR.md §2. Alle overige
   provincies starten neutraal (§2.1). ---- */
const TW_HOME_PROVINCES = {
  roma:     ["italia","sicilia","sardinia","corsica","dalmatia"],
  gallii:   ["gallia_lugdunensis","gallia_aquitania","gallia_belgica","gallia_narbonensis"],
  germani:  ["germania_superior","germania_inferior"],
  athenae:  ["achaea","macedonia","thracia"],
  persae:   ["cappadocia","galatia","syria","armenia","mesopotamia"],
  carthago: ["africa_proconsularis","mauretania_caesariensis","mauretania_tingitana"],
  aegyptii: ["aegyptus","arabia","creta_et_cyrene"],
  britanni: ["britannia"],
};

/* Elke beschaving se EIGEN startvlaggenschip (de thuisprovincie die toevallig
   ook vlaggenschip is, bv. roma → italia). Telt NIET mee voor de vlaggenschip-
   beloning/-eerbewijzen (§3.7) — anders zou elke beschaving die al vanaf
   campagnestart hebben zonder ooit iets veroverd te hebben. Alleen een écht
   VEROVERD vlaggenschip (van een tegenstander, of Dacia/Asia/Judea — die van
   niemand thuisprovincie zijn) telt. Vereist _twRegistry (twEnsureRegistry()). */
function twHomeFlagshipOf(civId){
  const homes = TW_HOME_PROVINCES[civId] || [];
  return homes.find(id => _twRegistry && _twRegistry[id] && _twRegistry[id].flagship) || null;
}

/* ---- Maximale verdediging: gebieden blijven altijd veroverbaar ---- */
const TW_DEFENSE_CAP = 100;

/* ------------------------------------------------------------------
   VLAGGENSCHIP-PROVINCIES (TOTAL_WAR.md §3.7) — 11 historisch cruciale
   provincies (8 hoofdsteden + Dacia/Asia/Judea, zie provinces.json "flagship").
   Bezit van ÉÉN OF MEER vlaggenschepen geeft een niet-stapelende, rijksbrede
   beloning — bewust GEEN extra bouw-/siegekracht (dat zou grote rijken alleen
   maar onverslaanbaar maken): een vaste extra-XP-bonus en een hogere dagcap
   in Training Mode (zie trCivHasFlagship() in training.js). Plus twee
   eenmalige eerbewijzen per vlaggenschip (verovering + "Legacy" bij lang
   genoeg vasthouden) — zie ACHIEVEMENTS_DEF (core.js) en
   trCheckFlagshipAchievements() (training.js). Alle drie constanten zijn
   richtwaarden, makkelijk bij te stellen. ------------------------------ */
const TW_FLAGSHIP_XP_BONUS = 1;      // extra XP bovenop de normale 2 per volledige-snelheid-antwoord
const TW_FLAGSHIP_DAILY_CAP = 35;    // i.p.v. TR_DAILY_CAP (25, training.js)
const TW_FLAGSHIP_LEGACY_WEEKS = 4;  // ononderbroken bezit nodig voor de Legacy-eerbewijzen

/* ------------------------------------------------------------------
   GARNIZOENSSPOREN — drie onafhankelijke verdedigingswerken die een
   provincie via Training Mode kan opbouwen (training.js). Elk spoor is een
   continue puntenteller (militiaPoints/wallPoints/towerPoints op
   /totalwar/provinces/{id}) die twee drempels doorloopt:
     tier 0 → 1 (basis) → 2 (upgrade)
   Torenspoor heeft als enige ook een zichtbare tier-0-visual (de boerderij
   — een onverdedigde provincie is nooit "leeg"). Zie TOTAL_WAR.md §5 en het
   sessieplan voor de volledige onderbouwing. Drempels zijn een richtwaarde,
   net als de rest van de garnizoensbalans — makkelijk later bij te stellen.
   ------------------------------------------------------------------ */
const TW_TIER1_POINTS = 300;
const TW_TIER2_POINTS = 900;

// Volgorde waarin een belegering de sporen aanvalt (TOTAL_WAR.md-sessieplan:
// militie/garnizoen staat vooraan, dan de muur, dan pas het fort). Militie
// wordt — anders dan walls/towers — NOOIT overgeslagen, ook niet op tier 0:
// dan bestaat het garnizoen nog uit gewone boeren, maar die staan er nog
// altijd als eerste (zie bmSiegeStageKeys() in battle.js).
const TW_STAGE_ORDER = ["militia","walls","towers"];

// Baas-HP per stage, per bereikte tier — richtwaarde, zelfde schaalorde als
// de generieke N*15*8*Md-basisformule in bmStartBossGame() (battle.js), zodat
// een klein aanvallend groepje niet kansloos staat. Tier 0 (alleen relevant
// voor militia/"De Boeren") is bewust laag: nauwelijks weerstand, geen
// vertraging voor het veroveren van verse neutrale provincies.
const TW_STAGE_HP = { 0: 150, 1: 400, 2: 900 };

// Per spoor: welk Firebase-veld, en welke sprite hoort bij welke tier.
// img:null bij tier 0 van walls = niks getekend (alleen de
// torenspoor-basislaag eronder); towers/militia hebben altijd een img
// (boerderij, resp. boeren) — een onverdedigde provincie is nooit "leeg".
// Militiespoor-sprites zijn allemaal onder de garrison_-naamgeving verzameld
// (garrison_farmers/garrison_militia/garrison_{volk}) — zelfde reeks als de
// civ-specifieke garnizoensplaatjes hieronder.
const TW_STRUCTURES = {
  militia: { field:"militiaPoints", tier0:"assets/bosses/garrison_farmers.png", tier1:"assets/bosses/garrison_militia.png", tier2:"civ" },
  walls:   { field:"wallPoints",    tier0:null, tier1:"assets/bosses/Palissade.png", tier2:"assets/bosses/wall.png" },
  towers:  { field:"towerPoints",   tier0:"assets/bosses/farm.png", tier1:"assets/bosses/watchtower.png", tier2:"assets/bosses/fort.png" },
};

// Volksnaam per beschaving, voor het civ-specifieke garnizoensplaatje
// (assets/bosses/garrison_{volk}.png) — alle 7 beschavingen hebben er
// inmiddels een; ontbrekende/toekomstige bestanden vallen terug op
// garrison_militia.png (zie twSpriteFor()).
const TW_GARRISON_SPRITE_BY_CIV = {
  roma:"roman", athenae:"greek", gallii:"gaul", germani:"germania",
  persae:"persia", carthago:"carthage", aegyptii:"egypt", britanni:"britons",
};

/* Punten → tier (0/1/2) voor één spoor. */
function twStructureTier(points){
  points = points||0;
  if(points>=TW_TIER2_POINTS) return 2;
  if(points>=TW_TIER1_POINTS) return 1;
  return 0;
}

/* Effectieve boss-HP voor één belegeringsstage (militia/walls/towers) van een
   provincie: basis-tier-HP (TW_STAGE_HP) VERMENIGVULDIGD met de provinciebonus
   als die toevallig dit spoor bevoordeelt — dezelfde bonus als Training Mode
   (provinces.json: "bonus":{track,pct,label}), nu ook echt voelbaar tijdens
   het gevecht zelf, niet alleen bij het bouwen (TOTAL_WAR.md §3.6). Gedeeld
   door bmStartBossGame()/bmResolve() (battle.js) — beide plekken waar een
   stage-HP wordt bepaald (aanvalsstart, en overgang naar de volgende stage). */
function twStageMaxHP(gp, stageKey){
  const tier = twStructureTier(gp[TW_STRUCTURES[stageKey].field]);
  let hp = TW_STAGE_HP[tier] || TW_STAGE_HP[1];
  const reg = _twRegistry && _twRegistry[gp.id];
  const bonus = reg && reg.bonus;
  if(bonus && bonus.track===stageKey) hp = Math.round(hp*(1+bonus.pct/100));
  return hp;
}

/* Sprite-pad voor een spoor op een gegeven tier; "civ" (alleen militia-tier2)
   wordt vertaald naar het civ-specifieke garnizoensplaatje met terugval. */
function twSpriteFor(structureKey, tier, civId){
  const def=TW_STRUCTURES[structureKey]; if(!def) return null;
  const raw = tier>=2?def.tier2:tier>=1?def.tier1:def.tier0;
  if(raw!=="civ") return raw;
  const suffix = TW_GARRISON_SPRITE_BY_CIV[civId];
  return suffix ? "assets/bosses/garrison_"+suffix+".png" : "assets/bosses/garrison_militia.png";
}

/* ---- Demo-stand voor de publieke "Binnenkort"-uitlegkaart (SCREENS.totalWar).
   Puur illustratief, blijft ongewijzigd — de echte veldtocht (docent-voorbeeld,
   SCREENS.totalWarPreview) gebruikt live Firebase-data, zie twLoadLiveState(). */
const TW_DEMO_OWN = {
  italia:"roma", sicilia:"roma", sardinia:"roma", corsica:"roma",
  dalmatia:"roma", gallia_narbonensis:"gallii",
  gallia_belgica:"gallii", gallia_lugdunensis:"gallii", gallia_aquitania:"gallii",
  germania_superior:"germani", germania_inferior:"germani",
  macedonia:"athenae", achaea:"athenae", thracia:"athenae",
  cappadocia:"persae", galatia:"persae", syria:"persae",
  armenia:"persae", mesopotamia:"persae",
  africa_proconsularis:"carthago", mauretania_caesariensis:"carthago", mauretania_tingitana:"carthago",
  aegyptus:"aegyptii", arabia:"aegyptii", creta_et_cyrene:"aegyptii",
  britannia:"britanni",
};
/* Eén voorbeeld van een "betwiste" provincie (§5.3-herdefinitie) op de
   publieke uitlegkaart, puur illustratief — Raetia (neutraal, grenst aan
   Germani se thuisprovincies) is een keer aangevallen door de Germanen maar
   nog niet veroverd, zodat leerlingen meteen zien hoe de gestreepte
   kaartweergave eruitziet zonder dat er een echte veldtocht voor nodig is. */
const TW_DEMO_CONTESTED = { id:"raetia", attackerCivId:"germani" };
const TW_DEMO_DEF = {
  italia:95, sicilia:40, sardinia:30, corsica:25, dalmatia:55, gallia_narbonensis:60,
  gallia_belgica:70, gallia_lugdunensis:65, gallia_aquitania:45,
  germania_superior:80, germania_inferior:60,
  macedonia:60, achaea:50, thracia:45,
  cappadocia:50, galatia:35, syria:75, armenia:40, mesopotamia:30,
  africa_proconsularis:65, mauretania_caesariensis:40, mauretania_tingitana:35,
  aegyptus:70, arabia:30, creta_et_cyrene:45,
  britannia:50,
};

/* Cache: SVG-tekst en het provincieregister worden één keer opgehaald. */
let _twSvgCache = null;
let _twRegistry = null;

/* Live veldtochtstatus (Firebase, zie TOTAL_WAR.md §4) — alleen gevuld zodra
   SCREENS.totalWarPreview met live=true geladen is. */
let _twLiveMode = false;
let _twLiveProvinces = null;
let _twSelectedId = null;

/* ------------------------------------------------------------
   SCHERM: publieke uitleg — Total War is Beta: Training Mode en de live
   veldtocht zijn allebei speelbaar. Zelf een belegering starten als leerling
   komt nog (dat bereidt de docent voor, zie SCREENS.totalWarPreview).
   ------------------------------------------------------------ */
SCREENS.totalWar = function(){
  document.body.classList.remove("greek");
  _twLiveMode = false; // deze uitlegkaart toont altijd de statische demo-stand
  H(brand(true)+`
  <div class="scrhead">
    <button class="back" onclick="go('home')">${iconSVG("shield",20,"currentColor")}</button>
    <h2>🗺️ Total War</h2>
  </div>

  <div class="panel" style="border-color:var(--hi-dim);text-align:center">
    <span class="pill" style="background:var(--ox);color:#fff">Beta — nu live</span>
    <p class="note" style="margin-top:10px">
      Een tweede spelmodus naast Battle Mode: een doorlopende veldtocht.
      Oefen thuis via Training Mode, en volg de veldtocht op de gedeelde kaart.
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
    <p class="note" style="margin-bottom:12px">Ben je leerling? Oefen thuis en versterk zo de verdediging van je beschaving.</p>
    <button class="btn btn-gold" onclick="go('trainingMode')">⚔️ Begin met trainen</button>
  </div>

  <div class="panel" style="text-align:center">
    <p class="note" style="margin-bottom:12px">Benieuwd hoe de veldtocht er nu echt voor staat? Bekijk de live kaart, wie welke beschaving speelt, en de seizoensrecords.</p>
    <button class="btn btn-gold" onclick="go('totalWarMap')">🗺️ Bekijk de veldtocht</button>
  </div>

  <div class="panel" style="text-align:center">
    <p class="note" style="margin-bottom:12px">Ben je docent? Open de veldtochtkaart om klassen te koppelen en aanvallen te starten.</p>
    <button class="btn btn-gold" onclick="go('totalWarPreview')">${iconSVG("column",18,"currentColor")} Docentenweergave</button>
  </div>
  ${foot()}`);
  twLoadMap(false);
};

/* ------------------------------------------------------------
   SCHERM: leerling-/publieksversie van de live veldtochtkaart —
   alleen-lezen (geen "Val aan"-knop, geen inlog nodig), met een legenda van
   welke klas welke beschaving speelt en een paar seizoensrecords. Start NOOIT
   zelf de campagne (geen twEnsureCampaignSeeded-aanroep, zie
   twStartLiveReadOnly() hieronder) — alleen de docent kan de veldtocht
   starten of resetten.
   ------------------------------------------------------------ */
SCREENS.totalWarMap = function(){
  document.body.classList.remove("greek");
  H(brand(true)+`
  <div class="scrhead">
    <button class="back" onclick="go('totalWar')">${iconSVG("shield",20,"currentColor")}</button>
    <h2>🗺️ De veldtocht</h2>
  </div>

  <div class="panel" id="twSeasonBox" style="text-align:center"><div class="note">Laden…</div></div>

  <div class="panel">
    <h3>Wie speelt wie?</h3>
    <div id="twKlasLegend" class="chips"><div class="note">Laden…</div></div>
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

  <div class="panel">
    <h3>Hoogtepunten van dit seizoen</h3>
    <div id="twHighlights"><div class="note">Laden…</div></div>
  </div>
  ${foot()}`);
  twLoadMap(true, true, false);
  twLoadSeasonAndStats();
  twLoadKlasLegend();
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
    <h2>Total War — docentenweergave</h2>
  </div>

  <div class="panel" style="border-color:var(--hi-dim)">
    <div class="note" style="text-align:center">
      Echte, blijvende veldtochtkaart. Wijzigingen (verovering, belegering)
      worden gedeeld tussen alle apparaten — <b>klik op een provincie</b>.
    </div>
  </div>

  <div class="panel" id="twSeasonBox" style="text-align:center"><div class="note">Laden…</div></div>

  <div class="panel">
    <label class="fld">Val aan als beschaving</label>
    <select id="twAttackerCiv" style="width:100%;padding:8px 10px;background:var(--stone3);color:var(--cream);border:1px solid var(--stone4);border-radius:8px;font-size:14px;font-family:inherit" onchange="twOnAttackerChange()">
      <option value="">— kies een beschaving —</option>
      ${Object.entries(TW_CIVS).filter(([id])=>id!=="neutral").map(([id,c])=>`<option value="${id}">${esc(c.nm)}</option>`).join("")}
    </select>
    <div class="note" style="margin-top:6px">Selecteer daarna een aanvalbare buurprovincie op de kaart voor de "Val aan"-knop.</div>
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

  <div class="panel">
    <h3>Seizoensbeheer</h3>
    <div class="note">Start een nieuw seizoen om de hele kaart te resetten (alle
    gebieden terug naar hun thuisland/neutraal, alle records gewist). Klas↔beschaving-
    koppelingen blijven staan. Doe dit bijvoorbeeld eens per schooljaar.</div>
    <button class="btn btn-ghost btn-block" style="margin-top:10px;color:#e07060;border-color:rgba(90,18,12,.4)" onclick="twStartNewSeason()">🔄 Nieuw seizoen starten</button>
  </div>
  ${foot()}`);
  twLoadMap(true, true);
  twLoadSeasonAndStats();
};

/* ---- Kaart laden (fetch + inline SVG) en eigendomsstatus toepassen ----
   interactive=false → alleen-lezen (geen klikselectie); default true.
   live=true → echte, blijvende Firebase-status i.p.v. de statische demo-stand.
   seed=false → live kaart zonder twEnsureCampaignSeeded() aan te roepen (voor
   de leerling-/publieksweergave, SCREENS.totalWarMap: alleen de docent mag de
   campagne starten); default true (docentenweergave). */
/* Haalt eenmalig het provincieregister op (namen/steden/bonus/buren/zeeroutes)
   en cachet het in _twRegistry — gedeeld door alle kaartschermen (twLoadMap)
   én door Training Mode (training.js, voor de provinciebonus), dat zelf geen
   kaart laadt. */
async function twEnsureRegistry(){
  if(_twRegistry) return _twRegistry;
  try{
    const reg = await fetch("map/provinces.json?v=20260712c").then(r=> r.ok ? r.json() : {});
    _twRegistry = reg;
  }catch(e){ _twRegistry = {}; }
  return _twRegistry;
}

async function twLoadMap(interactive, live, seed){
  interactive = interactive !== false;
  live = live === true;
  seed = seed !== false;
  const host = el("twMapHost"); if(!host) return;
  try{
    if(!_twSvgCache){
      const V = "?v=20260703a";
      const [svg] = await Promise.all([
        fetch("map/provinces.svg"+V).then(r=>{ if(!r.ok) throw new Error("SVG "+r.status); return r.text(); }),
        twEnsureRegistry(),
      ]);
      _twSvgCache = svg;
    }
    host.innerHTML = _twSvgCache;
    const svgEl = host.querySelector("svg");
    if(svgEl){
      svgEl.removeAttribute("width");
      svgEl.removeAttribute("height");
      svgEl.setAttribute("style","width:100%;height:auto;display:block");
    }
    if(typeof MapAPI!=="undefined" && _twRegistry){
      MapAPI.drawSeaRoutes(_twRegistry, host);
      MapAPI.drawCityMarkers(_twRegistry, host);
    }
    if(live) await (seed ? twStartLive() : twStartLiveReadOnly()); else twApplyDemo();
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
  // Betwist-voorbeeld (zie TW_DEMO_CONTESTED hierboven), nadat de gewone
  // eigenaarskleuren al gezet zijn — setProvinceContested() overschrijft de
  // fill van deze ene provincie met de gestreepte weergave.
  const dc = TW_DEMO_CONTESTED;
  const ownerC = TW_DEMO_OWN[dc.id] ? TW_CIVS[TW_DEMO_OWN[dc.id]] : TW_CIVS.neutral;
  const atkC = TW_CIVS[dc.attackerCivId] || TW_CIVS.neutral;
  MapAPI.setProvinceContested(dc.id, ownerC.color, atkC.color);
}

/* ------------------------------------------------------------------
   LIVE VELDTOCHT (Firebase) — vervangt de demo-stand op de docentenkaart.
   Schema: /totalwar/provinces/{id} = {owner, militiaPoints, wallPoints,
   towerPoints, siege:{lastStage,stageDamage}, lastChanged} — zie
   TW_STRUCTURES/twStructureTier() hierboven voor de tier-logica.
   /totalwar/civs/{civId} = {trainingPoints (legacy, ongebruikt),
   bonusesUnlocked}. Geseed door twEnsureCampaignSeeded().
   ------------------------------------------------------------------ */

/* Eenmalige seed: schrijft alleen als /totalwar/meta/seeded nog ontbreekt,
   zodat een al lopende veldtocht nooit overschreven wordt. */
async function twEnsureCampaignSeeded(){
  if(!initFirebase()) return false;
  const seeded = await fbDB.ref("totalwar/meta/seeded").once("value");
  if(seeded.val()){
    // Veldtocht bestond al vóór seizoenen bestonden (deze code) — backfill
    // alléén het ontbrekende seizoen, de rest van de kaart blijft ongemoeid.
    // Best-effort: dit is een cosmetische inhaalslag, geen kritiek pad — een
    // mislukte backfill mag de kaart zelf nooit blokkeren (vandaar try/catch
    // per stap i.p.v. de fout te laten doorborrelen naar twLoadMap()).
    try{
      const seasonSnap = await fbDB.ref("totalwar/season").once("value");
      if(!seasonSnap.exists()){
        await fbDB.ref("totalwar/season").set({ number:1, title:TW_SEASON_TITLES[0], startedAt:FBNet.serverTime() });
      }
    }catch(e){ console.warn("twEnsureCampaignSeeded: seizoen-backfill mislukt", e); }
    try{
      // Idem voor ownerSince (nodig voor de vlaggenschip-Legacy-eerbewijzen,
      // §3.7): provincies die al vóór deze code bestonden hebben dat veld nog
      // niet — backfill met "nu", zodat de Legacy-klok vanaf vandaag loopt
      // i.p.v. met een onbekend (mogelijk al lang verstreken) verleden te doen
      // alsof. Elke provincie krijgt haar EIGEN .update()-aanroep i.p.v. één
      // gecombineerde root-update("/"): een root-brede multi-path-update wordt
      // door Firebase atomisch geweigerd zodra ook maar één geraakt pad niet
      // aan de validatieregels voldoet, met een nietszeggende "update at /"-
      // foutmelding tot gevolg (zie CLAUDE.md-gesprek n.a.v. deze bugfix) —
      // los-per-provincie schrijven voorkomt zowel die onduidelijkheid als het
      // "één rotte appel verpest de hele batch"-risico.
      const provSnap = await fbDB.ref("totalwar/provinces").once("value");
      const writes = [];
      Object.entries(provSnap.val()||{}).forEach(([id,p])=>{
        if(p && !p.ownerSince) writes.push(
          fbDB.ref("totalwar/provinces/"+id).update({ownerSince: FBNet.serverTime()}).catch(e=>{
            console.warn("twEnsureCampaignSeeded: ownerSince-backfill mislukt voor", id, e);
          })
        );
      });
      if(writes.length) await Promise.all(writes);
    }catch(e){ console.warn("twEnsureCampaignSeeded: ownerSince-backfill mislukt", e); }
    return true;
  }
  const ownerOf = {};
  Object.entries(TW_HOME_PROVINCES).forEach(([civId,ids])=> ids.forEach(id=> ownerOf[id]=civId));
  // Eerste keer seeden: nog steeds per-knooppunt geschreven (i.p.v. één
  // root-update) om dezelfde reden als de backfill hierboven.
  const writes = [];
  Object.keys(_twRegistry||{}).forEach(id=>{
    if(id==="_meta") return;
    const owner = ownerOf[id] || "neutral";
    writes.push(fbDB.ref("totalwar/provinces/"+id).set({ owner, militiaPoints:0, wallPoints:0, towerPoints:0, ownerSince: FBNet.serverTime(),
      siege:{ lastStage:0, stageDamage:{militia:0,walls:0,towers:0} }, lastChanged: FBNet.serverTime() }));
  });
  Object.keys(TW_CIVS).forEach(civId=>{
    if(civId==="neutral") return;
    writes.push(fbDB.ref("totalwar/civs/"+civId).set({ trainingPoints:0, bonusesUnlocked:[] }));
  });
  writes.push(fbDB.ref("totalwar/season").set({ number:1, title:TW_SEASON_TITLES[0], startedAt:FBNet.serverTime() }));
  await Promise.all(writes);
  // meta/seeded pas ná alle andere writes zetten, zodat een gedeeltelijk
  // mislukte eerste seed niet als "voltooid" wordt gemarkeerd.
  await fbDB.ref("totalwar/meta/seeded").set(true);
  return true;
}

/* ---- Seizoenen: elke veldtocht loopt als een genummerd, betiteld "seizoen"
   (net als bij bekende MOBA's) — puur cosmetisch/motiverend, geen invloed op
   spelregels. De docent kan via twStartNewSeason() (SCREENS.totalWarPreview)
   de hele kaart resetten en een nieuw seizoen starten zodra een schooljaar
   voorbij is; klas↔beschaving-koppelingen blijven daarbij ongewijzigd. ---- */
const TW_SEASON_TITLES = [
  "Opkomst der Beschavingen", "IJzeren Grenzen", "Storm over de Middellandse Zee",
  "De Lange Vrede", "Bloed en Marmer", "Schaduw van de Adelaar", "Goden en Garnizoenen",
];

/* Leesbare "hoelang loopt dit al"-tekst voor de seizoensbadge. */
function twFormatDuration(startedAt){
  if(!startedAt) return "";
  const days = Math.max(0, Math.floor((Date.now()-startedAt)/86400000));
  if(days<1) return "vandaag gestart";
  if(days===1) return "1 dag bezig";
  if(days<14) return days+" dagen bezig";
  if(days<60) return Math.floor(days/7)+" weken bezig";
  const months = Math.floor(days/30);
  return months+" maand"+(months===1?"":"en")+" bezig";
}

/* Start (of hervat) de live listener op /totalwar/provinces. Meldt zichzelf
   automatisch af zodra #twMapHost niet meer bestaat (scherm verlaten) — geen
   aparte teardown-hook nodig, zelfde pragmatische aanpak als elders in de app. */
async function twStartLive(){
  if(!initFirebase()){
    const host = el("twMapHost");
    if(host) host.insertAdjacentHTML("afterend", `<div class="note warn" style="padding:12px 0">Firebase niet beschikbaar — de veldtocht kan niet geladen worden.</div>`);
    return;
  }
  await twEnsureCampaignSeeded();
  _twLiveMode = true;
  const ref = fbDB.ref("totalwar/provinces");
  ref.on("value", snap=>{
    const host = el("twMapHost");
    if(!host){ ref.off("value"); return; }
    _twLiveProvinces = snap.val() || {};
    twApplyLive(_twLiveProvinces);
    twDetectWipedCivs(_twLiveProvinces);
    const lg = el("twLegendBox"); if(lg) lg.innerHTML = twLegend();
    if(_twSelectedId) twSelectProvince(_twSelectedId);
  });
}

/* Alleen-lezen variant voor de leerling-/publiekskaart (SCREENS.totalWarMap):
   luistert mee op /totalwar/provinces, maar roept NOOIT twEnsureCampaignSeeded()
   aan — alleen de docent mag de campagne (laten) starten. Is de campagne nog
   niet gestart, dan toont dit een nette melding i.p.v. een lege kaart. */
async function twStartLiveReadOnly(){
  if(!initFirebase()){
    const host = el("twMapHost");
    if(host) host.insertAdjacentHTML("afterend", `<div class="note warn" style="padding:12px 0">Firebase niet beschikbaar — de veldtocht kan niet geladen worden.</div>`);
    return;
  }
  _twLiveMode = true;
  const ref = fbDB.ref("totalwar/provinces");
  ref.on("value", snap=>{
    const host = el("twMapHost");
    if(!host){ ref.off("value"); return; }
    _twLiveProvinces = snap.val() || {};
    if(!Object.keys(_twLiveProvinces).length){
      host.innerHTML = `<div class="note" style="padding:22px;text-align:center">De veldtocht is nog niet gestart door je docent.</div>`;
      return;
    }
    twApplyLive(_twLiveProvinces);
    twDetectWipedCivs(_twLiveProvinces);
    const lg = el("twLegendBox"); if(lg) lg.innerHTML = twLegend();
    twRenderHighlights();
    if(_twSelectedId) twSelectProvince(_twSelectedId);
  });
}

function twApplyLive(provinces){
  if(typeof MapAPI==="undefined") return;
  Object.entries(provinces||{}).forEach(([id,p])=>{
    const civId = p && p.owner;
    const c = civId && civId!=="neutral" ? TW_CIVS[civId] : null;
    // "Betwist" (§5.3, herdefinitie): een onderbroken belegering met nog
    // resterende schade — geen aparte stad-eigendom nodig, hergebruikt de
    // al bestaande siege/stageDamage-data (zie de slijtageslag-reparatie).
    // Volledig gerepareerd (stageDamage terug op 0) → niet meer betwist.
    const siege = p && p.siege;
    const dmg = siege && siege.lastStage ? (siege.stageDamage && siege.stageDamage[siege.lastStage] || 0) : 0;
    const contested = dmg>0 && siege.attackerCivId && siege.attackerCivId!==civId;
    if(contested){
      const atkC = TW_CIVS[siege.attackerCivId] || TW_CIVS.neutral;
      MapAPI.setProvinceContested(id, c ? c.color : TW_CIVS.neutral.color, atkC.color);
    } else {
      MapAPI.setProvinceOwner(id, c ? c.color : null);
    }
    MapAPI.setProvinceDefense(id, twOverallDefensePct(p));
  });
}

/* Samenvattend verdedigingsgetal (0-100) voor de kale kaartweergave/
   data-attribuut — som van de drie spoor-tiers (max 2+2+2=6) herschaald.
   Puur weergave; de echte belegeringssterkte zit in de losse tiers/punten. */
function twOverallDefensePct(p){
  if(!p) return 0;
  const tiers = twStructureTier(p.militiaPoints) + twStructureTier(p.wallPoints) + twStructureTier(p.towerPoints);
  return Math.round(tiers/6*TW_DEFENSE_CAP);
}

/* Schrijft het resultaat van een Boss Battle-belegering terug naar de
   aangevallen provincie. Aangeroepen door bmResolve() in battle.js zodra het
   HELE gevecht eindigt (laatste stage gewonnen = provincie valt, of
   klas-HP op 0 tijdens om het even welke stage = nederlaag) — niet bij een
   tussenstage-overgang, die regelt bmResolve() zelf lokaal in de room-state.
   stageKey = welk werk (militia/walls/towers) op het moment van eindigen
   werd bevochten. Alleen relevant bij gevechten die via twStartAttack()
   gestart zijn, niet bij losse Boss Battles. */
async function twResolveSiege(winner, stageKey, stageMaxHP, stageFinalHP, players){
  const gp = BM_META && BM_META.garrisonProvince;
  if(!gp || !fbDB) return;
  const ref = fbDB.ref("totalwar/provinces/"+gp.id);
  const dealt = Math.max(0, stageMaxHP - Math.max(0, stageFinalHP));
  if(winner==="A"){
    await ref.update({
      owner: BM_META.attackerCivId,
      ownerSince: FBNet.serverTime(), // reset de Legacy-klok (§3.7) bij elke eigendomswissel
      siege: { lastStage:"", stageDamage:{militia:0,walls:0,towers:0} },
      lastChanged: FBNet.serverTime(),
    });
    fbDB.ref("totalwar/stats/conquests/"+BM_META.attackerCivId)
      .set(firebase.database.ServerValue.increment(1)).catch(()=>{});
  } else {
    const prevDealt = (gp.siege && gp.siege.stageDamage && gp.siege.stageDamage[stageKey]) || 0;
    const upd = {};
    upd["siege/lastStage"] = stageKey;
    upd["siege/stageDamage/"+stageKey] = Math.max(prevDealt, dealt);
    // "Betwist"-visualisatie (§5.3, herdefinitie): wie de laatste (nog niet
    // succesvolle) aanval deed, voor de gestreepte kaartweergave in twApplyLive().
    upd["siege/attackerCivId"] = BM_META.attackerCivId;
    upd["lastChanged"] = FBNet.serverTime();
    await ref.update(upd);
  }
  twRecordBattleHighlights(gp, dealt, players).catch(()=>{});
}

/* Twee losse seizoensrecords, puur motiverend (geen invloed op spelregels):
   de zwaarste belegering (meeste schade in één stage) en de sterkste
   solo-speler (meeste persoonlijke schade in één Total War-gevecht). Draait
   altijd op het docent-apparaat (host van de Boss Battle-siege, zie
   twStartAttack() — alleen bereikbaar via de docentenweergave), dus de
   standaard totalwar-schrijfregel (auth != null) volstaat. */
async function twRecordBattleHighlights(gp, dealt, players){
  if(!fbDB) return;
  const nm = (_twRegistry && _twRegistry[gp.id] && _twRegistry[gp.id].displayName) || gp.id;
  if(dealt>0){
    fbDB.ref("totalwar/stats/bloodiest").transaction(cur=>{
      if(cur && (cur.dealt||0)>=dealt) return cur;
      return { dealt, province:nm, attackerCivId:BM_META.attackerCivId,
        defenderCivId:gp.defenderCivId||"neutral", at:Date.now() };
    }).catch(()=>{});
  }
  const top = Object.values(players||{})
    .filter(p=>p && p.identityKey && !String(p.identityKey).startsWith("bot:"))
    .sort((a,b)=>(b.damage||0)-(a.damage||0))[0];
  if(top && (top.damage||0)>0){
    fbDB.ref("totalwar/stats/topSolo").transaction(cur=>{
      if(cur && (cur.damage||0)>=top.damage) return cur;
      return { name:top.name||"?", klas:(top.identityKey||"").split(":")[0]||"",
        damage:top.damage, province:nm, at:Date.now() };
    }).catch(()=>{});
  }
}

/* ---- Seizoensbadge + hoogtepunten: gedeeld door SCREENS.totalWarMap
   (leerlingen/publiek) en SCREENS.totalWarPreview (docent, boven de
   "Nieuw seizoen"-knop). Beide screens hebben een eigen #twSeasonBox; alleen
   totalWarMap heeft #twHighlights. ---- */
let _twSeason = null;
let _twStats = null;

function twLoadSeasonAndStats(){
  if(!initFirebase()){
    const box = el("twSeasonBox"); if(box) box.innerHTML = `<div class="note warn">Firebase niet beschikbaar.</div>`;
    return;
  }
  fbDB.ref("totalwar/season").on("value", snap=>{
    if(!el("twSeasonBox")){ fbDB.ref("totalwar/season").off("value"); return; }
    _twSeason = snap.val();
    twRenderSeasonBox();
  });
  fbDB.ref("totalwar/stats").on("value", snap=>{
    if(!el("twHighlights")){ fbDB.ref("totalwar/stats").off("value"); return; }
    _twStats = snap.val() || {};
    twRenderHighlights();
  });
}

function twRenderSeasonBox(){
  const box = el("twSeasonBox"); if(!box) return;
  const s = _twSeason;
  if(!s){ box.innerHTML = `<div class="note">Nog geen seizoen gestart — de docent moet de veldtocht eerst openen.</div>`; return; }
  box.innerHTML = `
    <span class="pill" style="background:var(--stone4);color:var(--hi-bright)">Seizoen ${s.number||1}</span>
    <h3 style="margin:8px 0 2px">${esc(s.title||"")}</h3>
    <div class="note">${esc(twFormatDuration(s.startedAt))}</div>`;
}

/* Klas↔beschaving-legenda: leest /totalwar/klasCivs (publiek leesbaar), toont
   per klas de gekoppelde beschaving met kleur-swatch. */
function twLoadKlasLegend(){
  const cont = el("twKlasLegend"); if(!cont || !initFirebase()) return;
  fbDB.ref("totalwar/klasCivs").once("value").then(snap=>{
    const map = snap.val()||{};
    const entries = Object.entries(map).sort((a,b)=>a[0].localeCompare(b[0]));
    if(!entries.length){ cont.innerHTML = `<div class="note">Nog geen klas gekoppeld aan een beschaving.</div>`; return; }
    cont.innerHTML = entries.map(([klas,civId])=>{
      const c = TW_CIVS[civId]||TW_CIVS.neutral;
      return `<span class="chip"><span style="display:inline-block;width:12px;height:12px;border-radius:3px;
        background:${c.color};margin-right:6px;vertical-align:middle"></span>${esc(klas)} — ${esc(c.nm)}</span>`;
    }).join("");
  }).catch(()=>{ cont.innerHTML = `<div class="note warn">Kon koppelingen niet laden.</div>`; });
}

/* Seizoenshoogtepunten: "grootste rijk" wordt live afgeleid uit de huidige
   eigendomsstand (geen aparte opslag nodig); de rest komt uit /totalwar/stats,
   bijgehouden door twRecordBattleHighlights()/trMaybeUpdateTopBuilder() (training.js). */
function twRenderHighlights(){
  const box = el("twHighlights"); if(!box) return;
  const stats = _twStats||{};
  const counts = {};
  Object.values(_twLiveProvinces||{}).forEach(p=>{ if(p&&p.owner&&p.owner!=="neutral") counts[p.owner]=(counts[p.owner]||0)+1; });
  const biggest = Object.entries(counts).sort((a,b)=>b[1]-a[1])[0];
  const conquests = stats.conquests||{};
  const topConqueror = Object.entries(conquests).sort((a,b)=>b[1]-a[1])[0];
  const civNm = id=> (TW_CIVS[id]||TW_CIVS.neutral).nm;
  const rows = [
    biggest ? `👑 <b>Grootste rijk:</b> ${esc(civNm(biggest[0]))} (${biggest[1]} gebied${biggest[1]!==1?"en":""})` : null,
    topConqueror ? `⚔️ <b>Meeste veroveringen:</b> ${esc(civNm(topConqueror[0]))} (${topConqueror[1]}×)` : null,
    stats.bloodiest ? `🩸 <b>Bloedigste veldslag:</b> ${esc(stats.bloodiest.province)} — ${Math.round(stats.bloodiest.dealt)} schade (${esc(civNm(stats.bloodiest.attackerCivId))} vs. ${esc(civNm(stats.bloodiest.defenderCivId))})` : null,
    stats.topSolo ? `🌟 <b>Sterkste solo-speler:</b> ${esc(stats.topSolo.name)} (${esc(stats.topSolo.klas)}) — ${Math.round(stats.topSolo.damage)} schade in één gevecht` : null,
    stats.topBuilder ? `🏗️ <b>Grootste bouwer:</b> ${esc(stats.topBuilder.name)} (${esc(stats.topBuilder.klas)}) — ${Math.round(stats.topBuilder.points)} bouwpunten` : null,
  ].filter(Boolean);
  box.innerHTML = rows.length
    ? rows.map(r=>`<div class="note" style="margin-top:6px">${r}</div>`).join("")
    : `<div class="note">Nog geen hoogtepunten — begin de veldtocht!</div>`;
}

/* ---- Nieuw seizoen starten (docent-only, SCREENS.totalWarPreview): reset de
   hele kaart naar de thuislanden/neutraal en wist de seizoensrecords. Klas↔
   beschaving-koppelingen (klasCivs) blijven bewust ongewijzigd — dat is een
   losstaande, permanente toewijzing (zie twEnsureCampaignSeeded()/§7.1).
   Dubbele bevestiging (typen) omdat dit onomkeerbaar is. ---- */
async function twStartNewSeason(){
  if(!initFirebase()) return;
  const nextNum = ((_twSeason&&_twSeason.number)||1)+1;
  const typed = prompt(`Nieuw seizoen starten? Dit reset de hele kaart (alle gebieden terug naar hun thuisland/neutraal) en alle records. Klas↔beschaving-koppelingen blijven staan.\n\nTyp NIEUW SEIZOEN om te bevestigen:`);
  if((typed||"").trim().toUpperCase()!=="NIEUW SEIZOEN"){
    if(typed!==null) toast("Geannuleerd","Er is niets gereset.");
    return;
  }
  const title = (prompt("Titel voor Seizoen "+nextNum+" (leeg = automatisch):","")||"").trim()
    || TW_SEASON_TITLES[(nextNum-1)%TW_SEASON_TITLES.length];
  const ownerOf = {};
  Object.entries(TW_HOME_PROVINCES).forEach(([civId,ids])=> ids.forEach(id=> ownerOf[id]=civId));
  const upd = {};
  Object.keys(_twRegistry||{}).forEach(id=>{
    if(id==="_meta") return;
    upd["totalwar/provinces/"+id] = { owner: ownerOf[id]||"neutral", militiaPoints:0, wallPoints:0, towerPoints:0, ownerSince: FBNet.serverTime(),
      siege:{ lastStage:"", stageDamage:{militia:0,walls:0,towers:0} }, lastChanged: FBNet.serverTime() };
  });
  upd["totalwar/stats"] = null;
  upd["totalwar/season"] = { number:nextNum, title, startedAt:FBNet.serverTime() };
  try{
    await fbDB.ref().update(upd);
    toast("Nieuw seizoen gestart","Seizoen "+nextNum+": "+title);
  }catch(e){ toast("Mislukt", (e&&e.message)||""); }
}

/* ---- Aanvalsflow: knop verschijnt alleen als de gekozen aanvaller de
   provincie nog niet bezit én er via land/zee grenst aan een provincie die
   de aanvaller wél bezit (TOTAL_WAR.md §5.5/§5.6). ---- */
/* Bezit een beschaving nul provincies (alle veroverd door anderen) — de
   "rebellen"-toestand (TOTAL_WAR.md §5.7). Puur afgeleid uit de live
   eigendomsstand, geen apart Firebase-veld nodig: zodra ze ergens weer een
   provincie bezitten (bv. hun eigen vlaggenschip terugveroverd via de
   opstand hieronder) is dit vanzelf weer false. */
function twCivIsWiped(civId){
  if(!_twLiveProvinces || !civId || civId==="neutral") return false;
  return !Object.values(_twLiveProvinces).some(p => p && p.owner===civId);
}

/* Comeback-eerbewijs (TOTAL_WAR.md §5.7): schrijft totalwar/civs/{civId}/wasWiped
   zodra een beschaving 0 provincies bezit — puur als bijwerking van de live-
   listeners hieronder (twStartLive/twStartLiveReadOnly), op wélk toestel dan
   ook (docent- of leerlingkaart). trCheckComebackAchievement() (training.js)
   leest dit veld lazy en kent het eerbewijs toe zodra dezelfde beschaving
   weer ≥1 provincie bezit. Geen rules-wijziging nodig: totalwar/civs/{id}
   heeft al .write:true. Schrijft alleen bij een ECHTE overgang (nog niet
   true) om onnodige writes bij elke snapshot te vermijden. */
function twDetectWipedCivs(provinces){
  if(!fbDB || !provinces) return;
  Object.keys(TW_CIVS).forEach(civId=>{
    if(civId==="neutral") return;
    const wiped=!Object.values(provinces).some(p=>p&&p.owner===civId);
    if(!wiped) return;
    fbDB.ref("totalwar/civs/"+civId+"/wasWiped").once("value").then(snap=>{
      if(!snap.val()) fbDB.ref("totalwar/civs/"+civId+"/wasWiped").set(true);
    }).catch(()=>{});
  });
}

function twAttackButtonHTML(targetId, targetCivId){
  const attackerCiv = el("twAttackerCiv")?.value;
  if(!attackerCiv || attackerCiv===targetCivId) return "";
  // Uitgeroeide beschaving (0 provincies): geen grens-eis, maar dan kan
  // ALLEEN het eigen vlaggenschip worden aangevallen — "opstand" i.p.v. een
  // gewone aanval, ongeacht wie het nu bezet (TOTAL_WAR.md §5.7).
  if(twCivIsWiped(attackerCiv)){
    const isOwnFlagship = typeof twHomeFlagshipOf==="function" && twHomeFlagshipOf(attackerCiv)===targetId;
    if(!isOwnFlagship) return "";
    return `<button class="btn btn-gold btn-block" style="margin-top:10px" onclick="twStartAttack('${targetId}','${attackerCiv}')">
      ⚡ Opstand: heroverover het vlaggenschip van ${esc(TW_CIVS[attackerCiv].nm)}</button>
      <div class="note warn" style="margin-top:6px">${esc(TW_CIVS[attackerCiv].nm)} is volledig verslagen en heeft alleen deze ene kans om terug te komen.</div>`;
  }
  const reg = _twRegistry && _twRegistry[targetId];
  const borders = [...(reg?.neighbors||[]), ...(reg?.seaRoutes||[])];
  const canReach = borders.some(nid => (_twLiveProvinces?.[nid]||{}).owner===attackerCiv);
  if(!canReach) return "";
  return `<button class="btn btn-gold btn-block" style="margin-top:10px" onclick="twStartAttack('${targetId}','${attackerCiv}')">
    ⚔ Val aan als ${esc(TW_CIVS[attackerCiv].nm)}</button>`;
}

function twOnAttackerChange(){
  if(_twSelectedId) twSelectProvince(_twSelectedId);
}

/* Bereidt BM_META voor en stapt over naar het bestaande Boss Battle-hostflow
   (battleHostSettings) — hergebruikt lobby/gevecht volledig ongewijzigd, zie
   BOSS_BATTLE.md §7. bmStartBossGame() in battle.js leest garrisonProvince
   uit om de garnizoensbonus/slijtageslag toe te passen. */
function twStartAttack(targetId, attackerCiv){
  const p = (_twLiveProvinces && _twLiveProvinces[targetId]) || {};
  if(!BM_META) BM_META = {};
  BM_META.mode = "boss";
  // Altijd het verborgen garnizoen (BOSS_PRESETS.garrison in bossbattle.js),
  // nooit een mythologische baas — een belegering is geen kwestie van kiezen.
  BM_META.bossId = "garrison";
  const tiers = twStructureTier(p.militiaPoints)+twStructureTier(p.wallPoints)+twStructureTier(p.towerPoints);
  BM_META.bossDifficulty = tiers>=4 ? "hard" : "normal";
  BM_META.garrisonProvince = {
    id:targetId, defenderCivId:p.owner||"neutral",
    militiaPoints:p.militiaPoints||0, wallPoints:p.wallPoints||0, towerPoints:p.towerPoints||0,
    siege: p.siege || {lastStage:"", stageDamage:{militia:0,walls:0,towers:0}},
  };
  BM_META.attackerCivId = attackerCiv;
  const nm = (_twRegistry?.[targetId]?.displayName) || targetId;
  toast("Aanval voorbereid", nm+" — kies de moeilijkheidsgraad en start het gevecht.");
  go("battleHostSettings");
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
  _twSelectedId = id;
  host.querySelectorAll(".province.selected").forEach(e=>e.classList.remove("selected"));
  // Selecteer alle fragmenten van dezelfde provincie (bv. Cyprus = 2 paden).
  host.querySelectorAll(`[id="${id}"], [data-province="${id}"]`).forEach(e=>e.classList.add("selected"));
  const info = el("twInfo"); if(info) info.innerHTML = twProvinceInfo(id);
}

/* Dutch weergavenamen voor een spoor — gedeeld door twProvinceInfo() (bonustekst)
   en de trainingsschermen (training.js: TR_TRACK_LABELS heeft een eigen, iets
   uitgebreidere variant met icoon; hier alleen de korte naam). */
const TW_TRACK_NM = { militia:"garnizoen", walls:"muur", towers:"toren" };

function twProvinceInfo(id){
  const reg  = _twRegistry && _twRegistry[id];
  const nm   = (reg && reg.displayName) || id;
  const cities = (reg && reg.cities) || [];
  const bonus = reg && reg.bonus;
  const flagship = reg && reg.flagship;
  let civId, p={};
  if(_twLiveMode){
    p = (_twLiveProvinces && _twLiveProvinces[id]) || {};
    civId = p.owner || "neutral";
  } else {
    civId = TW_DEMO_OWN[id] || "neutral";
    // Betwist-voorbeeld (zie TW_DEMO_CONTESTED/twApplyDemo()): synthetische
    // siege-data zodat het infopaneel dezelfde uitleg toont als de gestreepte
    // kaartweergave, puur voor de publieke uitlegkaart.
    if(id===TW_DEMO_CONTESTED.id) p={siege:{lastStage:"walls",stageDamage:{walls:180},attackerCivId:TW_DEMO_CONTESTED.attackerCivId}};
  }
  const civ  = TW_CIVS[civId] || TW_CIVS.neutral;
  const owned= civId !== "neutral";
  const tierLabel = t=> t===0?"—":t===1?"basis":"volledig";
  const tracksNote = _twLiveMode
    ? `<div class="note" style="margin-top:6px">Fort: ${tierLabel(twStructureTier(p.towerPoints))} ·
        Muur: ${tierLabel(twStructureTier(p.wallPoints))} ·
        Garnizoen: ${tierLabel(twStructureTier(p.militiaPoints))}</div>`
    : (owned ? `<div class="note" style="margin-top:6px">Verdediging: ${TW_DEMO_DEF[id]||0}/${TW_DEFENSE_CAP}</div>` : "");
  // Onderbroken belegering (TOTAL_WAR.md §5.4-equivalent): een eerder
  // verloren aanval laat sporen na op de stage waar de klas strandde — zonder
  // deze melding ziet een provincie die al eens is aangevallen er identiek
  // uit als een verse, wat een docent op het verkeerde been zet.
  const siege = p.siege;
  const siegeDmg = siege && siege.lastStage ? (siege.stageDamage && siege.stageDamage[siege.lastStage] || 0) : 0;
  const attackerNm = siege && siege.attackerCivId ? (TW_CIVS[siege.attackerCivId]||TW_CIVS.neutral).nm : "";
  const siegeNote = (siege && siege.lastStage && siegeDmg>0)
    ? `<div class="note warn" style="margin-top:4px">⚔ Betwist — ${esc(attackerNm)} brak bij "${esc(siege.lastStage)}" door (${Math.round(siegeDmg)} schade), maar veroverde de provincie niet. Training Mode op dit spoor repareert de schade; een volgende aanval hervat waar deze strandde.</div>`
    : (siege && siege.lastStage
      ? `<div class="note" style="margin-top:4px">⚔ Belegering bij "${esc(siege.lastStage)}" volledig gerepareerd.</div>`
      : "");
  return `
    <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
      ${_twLiveMode ? twGarrisonVisualHTML(p, civId) : ""}
      <div>
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
          <b style="font-size:16px">${esc(nm)}</b>
          ${flagship ? `<span class="pill" style="background:var(--stone4);color:var(--hi-bright);border:1px solid var(--hi-dim)" title="Vlaggenschipprovincie">👑 Vlaggenschip</span>` : ""}
          <span class="pill" style="background:${civ.soft};color:#f3e9d2;border:none">
            ${owned ? esc(civ.nm) : "neutraal — veroverbaar"}</span>
        </div>
        ${tracksNote}
        ${siegeNote}
      </div>
    </div>
    <div class="note" style="margin-top:4px">Steden: ${cities.length ? cities.map(c=>esc(c.name)+(c.tag?` <small>(${esc(c.tag)})</small>`:"")).join(" · ") : "—"}</div>
    ${bonus ? `<div class="note" style="margin-top:4px">🎁 Bonus: ${esc(bonus.label)} — <b>+${bonus.pct}% ${TW_TRACK_NM[bonus.track]||bonus.track}punten</b> voor de eigenaar, én <b>+${bonus.pct}% verdedigings-HP</b> op dat spoor bij een belegering</div>` : ""}
    ${flagship ? `<div class="note" style="margin-top:4px">📜 <i>${esc(flagship.history)}</i></div>
    <div class="note" style="margin-top:4px">👑 Vlaggenschip: geeft de bezittende beschaving <b>+${TW_FLAGSHIP_XP_BONUS} XP</b> per goed antwoord en een <b>hogere dagcap</b> (${TW_FLAGSHIP_DAILY_CAP} i.p.v. ${TR_DAILY_CAP}) in Training Mode, plus het eerbewijs "${esc(flagship.title)}" bij verovering en nogmaals bij ${TW_FLAGSHIP_LEGACY_WEEKS} weken onafgebroken bezit.
    ${(typeof twHomeFlagshipOf==="function" && owned && twHomeFlagshipOf(civId)===id) ? `<br><small>Let op: dit is de eigen startprovincie van ${esc(civ.nm)} — die telt niet mee. Alleen een écht veroverd vlaggenschip (van een ander, of Dacia/Asia/Judea) activeert deze beloning.</small>` : ""}</div>` : ""}
    ${_twLiveMode ? twAttackButtonHTML(id, civId) : ""}`;
}

/* ---- Garnizoensvisual (Training Mode-opbouw): stapelt de torenspoor-
   basislaag (boerderij/wachttoren/fort, altijd aanwezig) met de optionele
   muur- (palissade/muur) en militie-laag (militia/civ-garnizoen) erboven —
   analoog aan bmBossSpriteHTML()'s koppen-stapeling in bossbattle.js.
   Gedeeld door twProvinceInfo() hierboven en SCREENS.trainingGarrison
   (training.js). Ontbrekende afbeeldingen verdwijnen gracieus (onerror). ---- */
function twGarrisonVisualHTML(p, civId){
  p = p||{};
  const layers = [
    {type:"towers",  src:twSpriteFor("towers", twStructureTier(p.towerPoints), civId)},
    {type:"walls",   src:twSpriteFor("walls", twStructureTier(p.wallPoints), civId)},
    {type:"militia", src:twSpriteFor("militia", twStructureTier(p.militiaPoints), civId)},
  ].filter(l=>l.src);
  // De militie/boeren-laag (voorgrond, altijd bovenop) krijgt een extra
  // top-inset t.o.v. de gebouwlaag eronder, zodat de figuren er iets vóór
  // en ietsje lager lijken te staan i.p.v. precies over elkaar geplakt —
  // een subtiel 3D/diepte-effect zonder nieuwe sprites nodig te hebben.
  const insetFor = type => type==="militia" ? "top:22px;right:8px;bottom:4px;left:8px" : "inset:8px";
  return `<div style="position:relative;width:128px;height:128px;flex:0 0 auto;background:#fff;border-radius:10px;box-sizing:border-box;overflow:hidden">
    ${layers.map(l=>`<img src="${l.src}?${SPRITE_VER}" style="position:absolute;${insetFor(l.type)};width:calc(100% - 16px);height:auto;max-height:calc(100% - 8px);object-fit:contain" alt="" onerror="this.style.display='none'">`).join("")}
  </div>`;
}

/* ---- Legenda van beschavingen met aantal gebieden ---- */
function twLegend(){
  const counts = {};
  let contestedCount = 0;
  if(_twLiveMode){
    Object.values(_twLiveProvinces||{}).forEach(p=>{
      if(p&&p.owner) counts[p.owner]=(counts[p.owner]||0)+1;
      const s=p&&p.siege;
      const dmg=s&&s.lastStage?(s.stageDamage&&s.stageDamage[s.lastStage]||0):0;
      if(dmg>0 && s.attackerCivId && s.attackerCivId!==p.owner) contestedCount++;
    });
  } else {
    Object.values(TW_DEMO_OWN).forEach(c=> counts[c]=(counts[c]||0)+1);
  }
  const civChips = Object.entries(TW_CIVS).map(([id,c])=>{
    const owned = counts[id] || 0;
    // Uitgeroeid (0 provincies, alleen relevant in live mode — de demo-kaart
    // kent geen "rebellen"-toestand): duidelijk zichtbaar in de legenda,
    // zodat de docent weet welke beschaving een opstand nodig heeft (§5.7).
    const wiped = _twLiveMode && id!=="neutral" && owned===0;
    return `<span class="chip"><span style="display:inline-block;width:12px;height:12px;border-radius:3px;
      background:${c.color};margin-right:6px;vertical-align:middle"></span>${esc(c.nm)}${
      id!=="neutral" ? ` <small>${owned} gebied${owned!==1?'en':''}</small>` : ""}${
      wiped ? ` <small style="color:#e07060">💀 verslagen</small>` : ""}</span>`;
  }).join("");
  const contestedChip = contestedCount
    ? `<span class="chip"><small style="color:#e8b923">⚔ ${contestedCount} betwist gebied${contestedCount!==1?'en':''}</small></span>`
    : "";
  return civChips + contestedChip;
}
