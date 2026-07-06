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

/* ---- Maximale verdediging: gebieden blijven altijd veroverbaar ---- */
const TW_DEFENSE_CAP = 100;

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
   SCHERM: publieke "Binnenkort"-uitleg
   Leerlingen zien wel het concept, maar kunnen niets starten.
   ------------------------------------------------------------ */
SCREENS.totalWar = function(){
  document.body.classList.remove("greek");
  _twLiveMode = false; // publieke uitlegkaart toont altijd de statische demo-stand
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
    <p class="note" style="margin-bottom:12px">Ben je leerling? Oefen thuis en versterk zo de verdediging van je beschaving.</p>
    <button class="btn btn-gold" onclick="go('trainingMode')">⚔️ Begin met trainen</button>
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
    <div class="note" style="text-align:center">
      Echte, blijvende veldtochtkaart. Wijzigingen (verovering, belegering)
      worden gedeeld tussen alle apparaten — <b>klik op een provincie</b>.
    </div>
  </div>

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
  ${foot()}`);
  twLoadMap(true, true);
};

/* ---- Kaart laden (fetch + inline SVG) en eigendomsstatus toepassen ----
   interactive=false → alleen-lezen (geen klikselectie); default true.
   live=true → echte, blijvende Firebase-status (docent-veldtocht) i.p.v. de
   statische demo-stand (publieke "Binnenkort"-uitlegkaart). */
async function twLoadMap(interactive, live){
  interactive = interactive !== false;
  live = live === true;
  const host = el("twMapHost"); if(!host) return;
  try{
    if(!_twSvgCache){
      const V = "?v=20260703a";
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
    if(live) await twStartLive(); else twApplyDemo();
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
  if(seeded.val()) return true;
  const ownerOf = {};
  Object.entries(TW_HOME_PROVINCES).forEach(([civId,ids])=> ids.forEach(id=> ownerOf[id]=civId));
  const upd = {};
  Object.keys(_twRegistry||{}).forEach(id=>{
    if(id==="_meta") return;
    const owner = ownerOf[id] || "neutral";
    upd["totalwar/provinces/"+id] = { owner, militiaPoints:0, wallPoints:0, towerPoints:0,
      siege:{ lastStage:0, stageDamage:{militia:0,walls:0,towers:0} }, lastChanged: FBNet.serverTime() };
  });
  Object.keys(TW_CIVS).forEach(civId=>{
    if(civId==="neutral") return;
    upd["totalwar/civs/"+civId] = { trainingPoints:0, bonusesUnlocked:[] };
  });
  upd["totalwar/meta/seeded"] = true;
  await fbDB.ref().update(upd);
  return true;
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
    const lg = el("twLegendBox"); if(lg) lg.innerHTML = twLegend();
    if(_twSelectedId) twSelectProvince(_twSelectedId);
  });
}

function twApplyLive(provinces){
  if(typeof MapAPI==="undefined") return;
  Object.entries(provinces||{}).forEach(([id,p])=>{
    const civId = p && p.owner;
    const c = civId && civId!=="neutral" ? TW_CIVS[civId] : null;
    MapAPI.setProvinceOwner(id, c ? c.color : null);
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
async function twResolveSiege(winner, stageKey, stageMaxHP, stageFinalHP){
  const gp = BM_META && BM_META.garrisonProvince;
  if(!gp || !fbDB) return;
  const ref = fbDB.ref("totalwar/provinces/"+gp.id);
  if(winner==="A"){
    await ref.update({
      owner: BM_META.attackerCivId,
      siege: { lastStage:"", stageDamage:{militia:0,walls:0,towers:0} },
      lastChanged: FBNet.serverTime(),
    });
  } else {
    const dealt = Math.max(0, stageMaxHP - Math.max(0, stageFinalHP));
    const prevDealt = (gp.siege && gp.siege.stageDamage && gp.siege.stageDamage[stageKey]) || 0;
    const upd = {};
    upd["siege/lastStage"] = stageKey;
    upd["siege/stageDamage/"+stageKey] = Math.max(prevDealt, dealt);
    upd["lastChanged"] = FBNet.serverTime();
    await ref.update(upd);
  }
}

/* ---- Aanvalsflow: knop verschijnt alleen als de gekozen aanvaller de
   provincie nog niet bezit én er via land/zee grenst aan een provincie die
   de aanvaller wél bezit (TOTAL_WAR.md §5.5/§5.6). ---- */
function twAttackButtonHTML(targetId, targetCivId){
  const attackerCiv = el("twAttackerCiv")?.value;
  if(!attackerCiv || attackerCiv===targetCivId) return "";
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

function twProvinceInfo(id){
  const reg  = _twRegistry && _twRegistry[id];
  const nm   = (reg && reg.displayName) || id;
  const cities = (reg && reg.cities) || [];
  let civId, p={};
  if(_twLiveMode){
    p = (_twLiveProvinces && _twLiveProvinces[id]) || {};
    civId = p.owner || "neutral";
  } else {
    civId = TW_DEMO_OWN[id] || "neutral";
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
  const siegeNote = (siege && siege.lastStage)
    ? `<div class="note warn" style="margin-top:4px">⚔ Belegering onderbroken bij "${esc(siege.lastStage)}" — een volgende aanval hervat daar (herstelt niet vanzelf).</div>`
    : "";
  return `
    <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
      ${_twLiveMode ? twGarrisonVisualHTML(p, civId) : ""}
      <div>
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
          <b style="font-size:16px">${esc(nm)}</b>
          <span class="pill" style="background:${civ.soft};color:#f3e9d2;border:none">
            ${owned ? esc(civ.nm) : "neutraal — veroverbaar"}</span>
        </div>
        ${tracksNote}
        ${siegeNote}
      </div>
    </div>
    <div class="note" style="margin-top:4px">Steden: ${cities.length ? cities.map(esc).join(" · ") : "—"}</div>
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
    twSpriteFor("towers", twStructureTier(p.towerPoints), civId),
    twSpriteFor("walls", twStructureTier(p.wallPoints), civId),
    twSpriteFor("militia", twStructureTier(p.militiaPoints), civId),
  ].filter(Boolean);
  return `<div style="position:relative;width:128px;height:128px;flex:0 0 auto;background:#fff;border-radius:10px;box-sizing:border-box">
    ${layers.map(src=>`<img src="${src}?${SPRITE_VER}" style="position:absolute;inset:8px;width:calc(100% - 16px);height:calc(100% - 16px);object-fit:contain" alt="" onerror="this.style.display='none'">`).join("")}
  </div>`;
}

/* ---- Legenda van beschavingen met aantal gebieden ---- */
function twLegend(){
  const counts = {};
  if(_twLiveMode){
    Object.values(_twLiveProvinces||{}).forEach(p=>{ if(p&&p.owner) counts[p.owner]=(counts[p.owner]||0)+1; });
  } else {
    Object.values(TW_DEMO_OWN).forEach(c=> counts[c]=(counts[c]||0)+1);
  }
  return Object.entries(TW_CIVS).map(([id,c])=>{
    const owned = counts[id] || 0;
    return `<span class="chip"><span style="display:inline-block;width:12px;height:12px;border-radius:3px;
      background:${c.color};margin-right:6px;vertical-align:middle"></span>${esc(c.nm)}${
      id!=="neutral" ? ` <small>${owned} gebied${owned!==1?'en':''}</small>` : ""}</span>`;
  }).join("");
}
