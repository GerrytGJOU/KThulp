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

/* ---- Thuisprovincie per beschaving: uitsluitend seed-data voor een nieuwe
   veldtocht (zie twEnsureCampaignSeeded()) — TOTAL_WAR.md §2. Elke beschaving
   start met precies ÉÉN basisprovincie (altijd haar vlaggenschip/hoofdstad,
   zie twHomeFlagshipOf()) — alle overige provincies starten neutraal (§2.1),
   ook de vroegere "extra" thuisprovincies uit een eerder ontwerp (bv. Sicilia/
   Sardinia/Corsica/Dalmatia voor de Romeinen). Bewuste balanswijziging
   (2026-09-07, op verzoek): een volk moet zijn rijk net als ieder ander
   helemaal zelf opbouwen vanaf de kaart, niet met een voorsprong beginnen. ---- */
const TW_HOME_PROVINCES = {
  roma:     ["italia"],
  gallii:   ["gallia_lugdunensis"],
  germani:  ["germania_inferior"],
  athenae:  ["achaea"],
  persae:   ["syria"],
  carthago: ["africa_proconsularis"],
  aegyptii: ["aegyptus"],
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

// Rondelimiet per belegeringspoging (op verzoek, 2026-09-09): zonder dit kon
// een klas een willekeurig zwaar versterkte provincie toch in één les
// stukbeuken, simpelweg door door te blijven spelen — iedereen antwoordt
// tegelijk, dus het aantal BENODIGDE rondes hangt (net als de HP zelf, zie
// TW_STAGE_HP hierboven) nauwelijks af van de klasgrootte, wél van hoeveel
// sporen er verdedigd zijn. Wordt deze limiet bereikt zonder dat de huidige
// stage gevallen is, dan trekt de klas zich terug (bmResolve() in battle.js,
// TW_STAGE_ORDER/zie TOTAL_WAR.md §5.4.1): geen overwinning, maar de tot dan
// toegebrachte schade blijft via de bestaande slijtageslag-reparatie
// (§5.4) gewoon staan — precies de spanningsboog die §5.4 al beschreef, nu
// ook echt afgedwongen i.p.v. iets dat je met genoeg tijd altijd kon omzeilen.
// Richtwaarde, makkelijk bij te stellen na live testen.
const TW_SIEGE_MAX_ROUNDS = 20;

// Volgorde waarin een belegering de sporen aanvalt (TOTAL_WAR.md-sessieplan:
// militie/garnizoen staat vooraan, dan de muur, dan pas het fort). Militie
// wordt — anders dan walls/towers — NOOIT overgeslagen, ook niet op tier 0:
// dan bestaat het garnizoen nog uit gewone boeren, maar die staan er nog
// altijd als eerste (zie bmSiegeStageKeys() in battle.js).
const TW_STAGE_ORDER = ["militia","walls","towers"];

// Baas-HP per stage, per bereikte tier — richtwaarde voor een REFERENTIEKLAS
// van TW_STAGE_HP_REF_N spelers (zie twStageMaxHP() hieronder, dat dit
// omrekent naar N × hp/speler — zelfde schaalprincipe als Boss Battle se
// generieke N×1500×Md-formule, BOSS_BATTLE.md §2: een klein aanvallend
// groepje mag niet kansloos staan, en een grote klas moet niet ineens
// triviaal winnen). Tier 0 (alleen relevant voor militia/"De Boeren") ligt
// nog altijd het laagst van de drie, maar is sinds 2026-09-09 (op verzoek)
// niet meer triviaal: het origineel (150/400/900) liet een onbewaakte
// provincie in de praktijk in nog geen twee minuten vallen. Verdubbeld —
// verhouding tussen de tiers (1 : 2,67 : 6) bewust ongewijzigd, de docent
// vroeg om alle moeilijkheidsgraden proportioneel op te schalen, niet om de
// tier0-tier1-tier2-curve zelf te herzien.
const TW_STAGE_HP = { 0: 300, 1: 800, 2: 1800 };
const TW_STAGE_HP_REF_N = 20; // klasgrootte waarvoor TW_STAGE_HP hierboven getuned is

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
   provincie, geschaald naar het aantal AANVALLENDE spelers N — zelfde
   schaalprincipe als de generieke Boss Battle-formule (BOSS_BATTLE.md §2:
   N × baseHpPerPlayer × Md), zodat een klas van 4 en een klas van 30 een even
   zware belegering ervaren i.p.v. dat een kleine klas relatief kansloos staat
   (klasMaxHP schaalt al met N, zie bmStartBossGame() — de garnizoens-HP deed
   dat vóór 2026-09-09 niet, ongevraagd nadeel voor kleine klassen).
   basis-tier-HP (TW_STAGE_HP, getuned voor TW_STAGE_HP_REF_N spelers) wordt
   herschaald naar N, en DAARNA vermenigvuldigd met de provinciebonus als die
   toevallig dit spoor bevoordeelt — dezelfde bonus als Training Mode
   (provinces.json: "bonus":{track,pct,label}), nu ook echt voelbaar tijdens
   het gevecht zelf, niet alleen bij het bouwen (TOTAL_WAR.md §3.6). De bonus
   blijft zo altijd een vast PERCENTAGE van de (nu variabele) basis-HP, niet
   een los absoluut getal. Gedeeld door bmStartBossGame()/bmResolve()
   (battle.js) — beide plekken waar een stage-HP wordt bepaald (aanvalsstart,
   en overgang naar de volgende stage) — die geven allebei de actuele N
   (aantal spelers in de kamer) mee. */
function twStageMaxHP(gp, stageKey, N){
  const tier = twStructureTier(gp[TW_STRUCTURES[stageKey].field]);
  const baseHp = TW_STAGE_HP[tier] || TW_STAGE_HP[1];
  let hp = Math.max(1, Math.round(baseHp * Math.max(1,N||1) / TW_STAGE_HP_REF_N));
  const reg = _twRegistry && _twRegistry[gp.id];
  const bonus = reg && reg.bonus;
  if(bonus && bonus.track===stageKey) hp = Math.round(hp*(1+bonus.pct/100));
  return hp;
}

/* Herschaalt een voor Team-vs-Team Battle Mode getunede ABSOLUTE koppental-
   drempel (BM_SYNERGY se minClasses, BM_CHAIN_BONUS se min — battle-data.js)
   naar de daadwerkelijke aanvallende teamgrootte N, op verzoek 2026-09-09.
   Zelfde N/TW_STAGE_HP_REF_N-schaalregel als twStageMaxHP() hierboven, dus
   bij de referentieklasgrootte (20) verandert er niets. Reden: die drempels
   zijn eerlijk in gewoon Battle Mode (beide teams komen uit dezelfde klas,
   profiteren dus evenveel), maar bij een Total War-belegering (klas vs
   NPC-garnizoen, geen tegenteam) kon een klas kleiner dan de drempel een
   synergie-/brede-deelname-bonus NOOIT bereiken, hoe goed ze ook speelden —
   een ongevraagd nadeel bovenop de al bestaande garnizoens-HP-schaling.
   Alleen aangeroepen voor een belegering (BM_META.garrisonProvince gezet,
   zie bmCalcSynergy()/de brede-deelname-bonus in battle.js); gewoon Boss
   Battle/Team-vs-Team blijft de vaste tabelwaarden gebruiken. */
function twSiegeScaledThreshold(origMin, N){
  return Math.max(1, Math.round(origMin * Math.max(1,N||1) / TW_STAGE_HP_REF_N));
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

/* ------------------------------------------------------------------
   MULTI-TENANT CAMPAGNES (sinds 2026-09-09, CLAUDE.md § Firebase-rules) —
   elke goedgekeurde docent kan zijn eigen, onafhankelijke Total War starten.
   Datamodel verhuisd van plat `/totalwar/{provinces,civs,...}` naar
   `/totalwar/campaigns/{ownerUid}/{provinces,civs,...}` — {ownerUid} ís de
   campagnesleutel (één actieve campagne per docent). `/totalwar/showcaseUid`
   wijst de docent-uid aan wiens campagne als publiek "uithangbord" dient
   voor niet-ingelogde bezoekers en leerlingen van docenten zonder eigen
   campagne (voorlopig altijd Gerbens eigen uid, zie migratie-notitie in
   CLAUDE.md — een latere stap kan dit ook afschermen).

   _twOwner is de campagne die het HUIDIGE scherm laat zien/beheert — door
   elk scherm bij binnenkomst opnieuw bepaald (nooit hergebruikt tussen
   schermen): teacherNet().getTeacherUid() op de docentenschermen,
   twResolveViewerCampaign()/twResolveHofOwner() op de publieke/leerling-
   schermen. Alle overige totalwar.js/training.js/games.js-functies lezen
   _twOwner op het moment dat ze draaien — geen aparte parameter nodig omdat
   deze functies toch al alleen binnen de context van "het net geladen
   scherm" worden aangeroepen (zelfde patroon als bestaande globals als
   BM_META/_twLiveProvinces). ------------------------------------------ */
let _twOwner = null;
function twPath(owner, sub){ return "totalwar/campaigns/"+owner+"/"+sub; }

/* Docent-eigenaar van een klascode — al bestaand, publiek leesbaar veld
   (klascodes/{code}/ownerUid, zie database.rules.json). Dit is de enige
   "join" die nodig is om een leerling-identiteit aan een campagne te
   koppelen: geen aparte klas→campagne-index nodig. */
async function twOwnerOfKlas(klas){
  klas = (klas||"").trim().toUpperCase();
  if(!klas || !initFirebase()) return null;
  try{ const snap = await fbDB.ref("klascodes/"+klas+"/ownerUid").once("value"); return snap.val()||null; }
  catch(e){ return null; }
}
async function twShowcaseUid(){
  if(!initFirebase()) return null;
  try{ const snap = await fbDB.ref("totalwar/showcaseUid").once("value"); return snap.val()||null; }
  catch(e){ return null; }
}
async function twCampaignExists(owner){
  if(!owner || !initFirebase()) return false;
  try{ const snap = await fbDB.ref(twPath(owner,"meta/seeded")).once("value"); return !!snap.val(); }
  catch(e){ return false; }
}
/* Voor de publieke/leerling-schermen (totalWar, totalWarMap): eigen docent
   se campagne zodra die bestaat, anders het uithangbord — nooit andersom
   (een leerling wiens eigen docent nog geen Total War gestart is, ziet dus
   een lege staat, niet stiekem een andere docent se kaart). */
async function twResolveViewerCampaign(){
  if(typeof BM_IDENT!=="undefined" && BM_IDENT && BM_IDENT.klascode){
    const owner = await twOwnerOfKlas(BM_IDENT.klascode);
    if(owner){
      const exists = await twCampaignExists(owner);
      if(exists) return { owner, ownCampaign:true };
      return { owner:null, ownCampaign:false, noCampaignYet:true };
    }
  }
  const show = await twShowcaseUid();
  return { owner: show, ownCampaign:false };
}
/* Voor de Hall of Fame: een ingelogde, goedgekeurde docent/admin ziet altijd
   zíjn EIGEN geschiedenis (met beheerknoppen); iedereen anders volgt
   dezelfde regel als twResolveViewerCampaign(). */
async function twResolveHofOwner(){
  const canManage = await twCanManage();
  if(canManage){
    const uid = teacherNet().getTeacherUid();
    if(uid) return { owner:uid, isOwner:true };
  }
  const v = await twResolveViewerCampaign();
  return { owner:v.owner, isOwner:false, noCampaignYet:v.noCampaignYet };
}

/* ------------------------------------------------------------
   SCHERM: publieke uitleg — Total War is Beta: Training Mode en de live
   veldtocht zijn allebei speelbaar. Zelf een belegering starten als leerling
   komt nog (dat bereidt de docent voor, zie SCREENS.totalWarPreview).
   ------------------------------------------------------------ */
SCREENS.totalWar = function(){
  document.body.classList.remove("greek");
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

  <div class="panel" id="twSeasonBox" style="text-align:center"><div class="note">Laden…</div></div>

  <div class="panel">
    <h3>Veldtochtkaart</h3>
    <p class="note" style="margin-bottom:10px">De echte, live stand van dit seizoen —
    elke kleur is een beschaving. Verandert zodra een klas verovert of verliest.</p>
    <div id="twMapHost" style="background:#9fc7f4;border:1px solid var(--stone4);border-radius:14px;overflow:hidden;min-height:120px">
      <div class="note" style="padding:22px;text-align:center">Kaart laden…</div>
    </div>
    <div id="twInfo" class="panel" style="margin:12px 0 0">
      <span class="note">Klik op een provincie voor details.</span>
    </div>
    <div id="twLegendBox" class="chips" style="margin-top:12px"></div>
  </div>

  <div class="panel" style="text-align:center">
    <p class="note" style="margin-bottom:12px">Ben je leerling? Oefen thuis en versterk zo de verdediging van je beschaving.</p>
    <button class="btn btn-gold" onclick="go('trainingMode')">⚔️ Begin met trainen</button>
  </div>

  <div class="panel" style="text-align:center">
    <p class="note" style="margin-bottom:12px">Wil je ook zien wie welke beschaving speelt en de seizoensrecords?</p>
    <button class="btn btn-gold" onclick="go('totalWarMap')">🗺️ Bekijk de veldtocht in detail</button>
  </div>

  <div class="panel" style="text-align:center">
    <p class="note" style="margin-bottom:12px">Benieuwd naar eerdere seizoenen? Bekijk de eindstand, de winnaar en de hoogtepunten van elk afgesloten seizoen.</p>
    <button class="btn btn-gold" onclick="go('totalWarHallOfFame')">🏛️ Hall of Fame</button>
  </div>

  <div class="panel" style="text-align:center">
    <p class="note" style="margin-bottom:12px">Ben je docent? Open de veldtochtkaart om klassen te koppelen en aanvallen te starten.</p>
    <button class="btn btn-gold" onclick="go('totalWarPreview')">${iconSVG("column",18,"currentColor")} Docentenweergave</button>
  </div>
  ${foot()}`);
  twResolveViewerCampaign().then(v=>{
    if(_screen!=="totalWar") return; // ondertussen weggenavigeerd
    _twOwner = v.owner;
    if(v.noCampaignYet){
      const host = el("twMapHost");
      if(host) host.innerHTML = `<div class="note" style="padding:22px;text-align:center">Je docent heeft nog geen eigen Total War gestart.</div>`;
      const box = el("twSeasonBox"); if(box) box.innerHTML = `<div class="note">Nog geen veldtocht.</div>`;
      return;
    }
    twLoadMap(true, true, false);
    twLoadSeasonAndStats();
  });
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

  <div class="panel" style="text-align:center">
    <button class="btn btn-ghost btn-block" onclick="go('totalWarHallOfFame')">🏛️ Hall of Fame — eerdere seizoenen</button>
  </div>
  ${foot()}`);
  twResolveViewerCampaign().then(v=>{
    if(_screen!=="totalWarMap") return; // ondertussen weggenavigeerd
    _twOwner = v.owner;
    if(v.noCampaignYet){
      const host = el("twMapHost");
      if(host) host.innerHTML = `<div class="note" style="padding:22px;text-align:center">Je docent heeft nog geen eigen Total War gestart.</div>`;
      const box = el("twSeasonBox"); if(box) box.innerHTML = `<div class="note">Nog geen veldtocht.</div>`;
      const legend = el("twKlasLegend"); if(legend) legend.innerHTML = `<div class="note">—</div>`;
      return;
    }
    twLoadMap(true, true, false);
    twLoadSeasonAndStats();
    twLoadKlasLegend();
  });
};

/* ------------------------------------------------------------
   SCHERM: docent-voorbeeld (achter docentenlogin)
   Echte provinciekaart van het Romeinse Rijk met voorbeeldstand.
   ------------------------------------------------------------ */
SCREENS.totalWarPreview = function(){
  // Alleen goedgekeurde docenten/admins. Dit scherm is (anders dan
  // teacherPortal) rechtstreeks bereikbaar vanaf de publieke SCREENS.totalWar-
  // uitleg, dus vlak na een page-load kan Firebase de "onthouden"-sessie nog
  // aan het herstellen zijn — currentUser is dan nog even null terwijl de
  // docent wél degelijk ingelogd blijft (zie FBNet.authReady). Een synchrone
  // isTeacherLoggedIn()-check zou zo'n docent onterecht terugsturen naar de
  // login. Daarom eerst authReady() afwachten, net als SCREENS.teacherLogin
  // al deed — en daarna ook de goedkeuringsstatus, want de onderliggende
  // /totalwar-writerule eist sinds het docent/admin-rollensysteem (CLAUDE.md
  // § Firebase-rules) ook approved/admin, niet alleen "ingelogd".
  document.body.classList.remove("greek");
  H(brand(true)+`
  <div class="scrhead">
    <button class="back" onclick="go('totalWar')">${iconSVG("shield",20,"currentColor")}</button>
    <h2>Total War — docentenweergave</h2>
  </div>
  <div class="panel" style="text-align:center"><div class="note">Inlogstatus controleren…</div></div>`);
  teacherNet().authReady().then(twCanManage).then(async ok=>{
    if(_screen!=="totalWarPreview") return; // ondertussen weggenavigeerd
    if(ok){
      _twOwner = teacherNet().getTeacherUid();
      const exists = await twCampaignExists(_twOwner);
      if(_screen!=="totalWarPreview") return;
      if(exists) twRenderTeacherPreview();
      else twRenderStartCampaign();
      return;
    }
    let loggedIn=false;
    try{ loggedIn = teacherNet().isTeacherLoggedIn(); }catch(e){ loggedIn=false; }
    if(loggedIn){
      toast("Nog niet goedgekeurd","Je docentaccount wacht nog op goedkeuring door de beheerder.");
      go("teacherPortal");
    }else{
      toast("Alleen voor docenten","Log eerst in via het docentenportaal.");
      go("teacherLogin");
    }
  });
};

/* Docent zonder eigen campagne — expliciete opt-in i.p.v. impliciet seeden
   bij het eerste bezoek (op verzoek, 2026-09-09): een campagne aanmaken is
   een bewuste stap, geen bijwerking van "toevallig dit scherm geopend". */
function twRenderStartCampaign(){
  document.body.classList.remove("greek");
  H(brand(true)+`
  <div class="scrhead">
    <button class="back" onclick="go('totalWar')">${iconSVG("shield",20,"currentColor")}</button>
    <h2>Total War — docentenweergave</h2>
  </div>
  <div class="panel" style="text-align:center">
    <div class="note">Je hebt nog geen eigen Total War. Start er één om je eigen
    klassen aan een beschaving te koppelen en een eigen veldtochtkaart en
    Hall of Fame te krijgen — helemaal los van andere docenten.</div>
    <button class="btn btn-gold btn-block lg" style="margin-top:14px" onclick="twStartOwnCampaign()">🗺️ Start eigen Total War</button>
  </div>
  ${foot()}`);
}

async function twStartOwnCampaign(){
  if(!_twOwner) return;
  await twEnsureRegistry();
  await twEnsureCampaignSeeded();
  if(_screen==="totalWarPreview") twRenderTeacherPreview();
}

function twRenderTeacherPreview(){
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
    <label class="fld">Total War — klas ↔ beschaving</label>
    <div class="note" style="margin:2px 0 8px">Koppel hier ook meteen nieuwe klassen aan een beschaving — precies dezelfde koppeling als in het docentenportaal (<code>/totalwar/klasCivs</code>).</div>
    <div id="twKlasCivList" style="margin-top:6px"><div class="note" style="padding:4px 0">Laden…</div></div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:10px">
      <select id="tpTwKlas" style="flex:1;min-width:140px;padding:8px 10px;border-radius:8px;border:1px solid var(--stone4);background:var(--stone3);color:var(--cream);font-size:14px;font-family:inherit">
        <option value="">— kies een klas —</option>
      </select>
      <select id="tpTwCiv" style="padding:8px 10px;border-radius:8px;border:1px solid var(--stone4);background:var(--stone3);color:var(--cream);font-size:14px;font-family:inherit">
        ${Object.entries(TW_CIVS).filter(([id])=>id!=="neutral").map(([id,c])=>`<option value="${id}">${esc(c.nm)}</option>`).join("")}
      </select>
      <button class="btn btn-gold" style="padding:8px 14px" onclick="tpAssignKlasCiv()">Koppel</button>
    </div>
  </div>

  <div class="panel">
    <h3>Seizoensbeheer</h3>
    <div class="note">Start een nieuw seizoen om de hele kaart te resetten (alle
    gebieden terug naar hun thuisland/neutraal). Het huidige seizoen wordt eerst
    bewaard in de <a href="#" onclick="event.preventDefault();go('totalWarHallOfFame')" style="color:var(--hi)">Hall of Fame</a>
    (eindstand, winnaar, hoogtepunten) — niets gaat verloren. Klas↔beschaving-
    koppelingen blijven staan. Doe dit bijvoorbeeld eens per schooljaar.</div>
    <button class="btn btn-ghost btn-block" style="margin-top:10px;color:#e07060;border-color:rgba(90,18,12,.4)" onclick="twStartNewSeason()">🔄 Nieuw seizoen starten</button>
  </div>
  ${foot()}`);
  twLoadMap(true, true);
  twLoadSeasonAndStats();
  tpLoadClasses();
  tpLoadKlasCivs();
}

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
  if(!initFirebase() || !_twOwner) return false;
  const seeded = await fbDB.ref(twPath(_twOwner,"meta/seeded")).once("value");
  if(seeded.val()){
    // Veldtocht bestond al vóór seizoenen bestonden (deze code) — backfill
    // alléén het ontbrekende seizoen, de rest van de kaart blijft ongemoeid.
    // Best-effort: dit is een cosmetische inhaalslag, geen kritiek pad — een
    // mislukte backfill mag de kaart zelf nooit blokkeren (vandaar try/catch
    // per stap i.p.v. de fout te laten doorborrelen naar twLoadMap()).
    try{
      const seasonSnap = await fbDB.ref(twPath(_twOwner,"season")).once("value");
      if(!seasonSnap.exists()){
        await fbDB.ref(twPath(_twOwner,"season")).set({ number:1, title:TW_SEASON_TITLES[0], startedAt:FBNet.serverTime() });
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
      const provSnap = await fbDB.ref(twPath(_twOwner,"provinces")).once("value");
      const writes = [];
      Object.entries(provSnap.val()||{}).forEach(([id,p])=>{
        if(p && !p.ownerSince) writes.push(
          fbDB.ref(twPath(_twOwner,"provinces/"+id)).update({ownerSince: FBNet.serverTime()}).catch(e=>{
            console.warn("twEnsureCampaignSeeded: ownerSince-backfill mislukt voor", id, e);
          })
        );
      });
      if(writes.length) await Promise.all(writes);
    }catch(e){ console.warn("twEnsureCampaignSeeded: ownerSince-backfill mislukt", e); }
    return true;
  }
  // Een volk zonder gekoppelde klas (nog) speelt dit seizoen niet mee — laat
  // zijn basisprovincie dan gewoon neutraal in plaats van 'm alvast te
  // bezetten. Kiest een docent dat volk later alsnog (tpAssignKlasCiv()),
  // dan bezit het 0 provincies en start die klas automatisch via de al
  // bestaande "rebellen"-opstandsmechanic (§5.7, twCivIsWiped()) op precies
  // die (dan nog altijd neutrale) basisprovincie — geen apart mechanisme nodig.
  const klasCivsSnap0 = await fbDB.ref(twPath(_twOwner,"klasCivs")).once("value");
  const activeCivs0 = new Set(Object.values(klasCivsSnap0.val()||{}));
  const ownerOf = {};
  Object.entries(TW_HOME_PROVINCES).forEach(([civId,ids])=>{
    if(!activeCivs0.has(civId)) return;
    ids.forEach(id=> ownerOf[id]=civId);
  });
  // Eerste keer seeden: nog steeds per-knooppunt geschreven (i.p.v. één
  // root-update) om dezelfde reden als de backfill hierboven.
  const writes = [];
  Object.keys(_twRegistry||{}).forEach(id=>{
    if(id==="_meta") return;
    const owner = ownerOf[id] || "neutral";
    writes.push(fbDB.ref(twPath(_twOwner,"provinces/"+id)).set({ owner, militiaPoints:0, wallPoints:0, towerPoints:0, ownerSince: FBNet.serverTime(),
      siege:{ lastStage:0, stageDamage:{militia:0,walls:0,towers:0} }, lastChanged: FBNet.serverTime() }));
  });
  Object.keys(TW_CIVS).forEach(civId=>{
    if(civId==="neutral") return;
    writes.push(fbDB.ref(twPath(_twOwner,"civs/"+civId)).set({ trainingPoints:0, bonusesUnlocked:[] }));
  });
  writes.push(fbDB.ref(twPath(_twOwner,"season")).set({ number:1, title:TW_SEASON_TITLES[0], startedAt:FBNet.serverTime() }));
  await Promise.all(writes);
  // meta/seeded pas ná alle andere writes zetten, zodat een gedeeltelijk
  // mislukte eerste seed niet als "voltooid" wordt gemarkeerd.
  await fbDB.ref(twPath(_twOwner,"meta/seeded")).set(true);
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
  const ref = fbDB.ref(twPath(_twOwner,"provinces"));
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
  const ref = fbDB.ref(twPath(_twOwner,"provinces"));
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
  const owner = BM_META && BM_META.campaignOwner;
  if(!gp || !owner || !fbDB) return;
  const ref = fbDB.ref(twPath(owner,"provinces/"+gp.id));
  const dealt = Math.max(0, stageMaxHP - Math.max(0, stageFinalHP));
  if(winner==="A"){
    await ref.update({
      owner: BM_META.attackerCivId,
      ownerSince: FBNet.serverTime(), // reset de Legacy-klok (§3.7) bij elke eigendomswissel
      siege: { lastStage:"", stageDamage:{militia:0,walls:0,towers:0} },
      lastChanged: FBNet.serverTime(),
    });
    fbDB.ref(twPath(owner,"stats/conquests/"+BM_META.attackerCivId))
      .set(firebase.database.ServerValue.increment(1)).catch(()=>{});
  } else {
    const prevDealt = (gp.siege && gp.siege.stageDamage && gp.siege.stageDamage[stageKey]) || 0;
    const upd = {};
    upd["siege/lastStage"] = stageKey;
    upd["siege/stageDamage/"+stageKey] = Math.max(prevDealt, dealt);
    // "Betwist"-visualisatie (§5.3, herdefinitie): wie de laatste (nog niet
    // succesvolle) aanval deed, voor de gestreepte kaartweergave in twApplyLive().
    upd["siege/attackerCivId"] = BM_META.attackerCivId;
    // Startpunt van deze belegeringsreeks — alleen zetten bij de EERSTE
    // mislukte aanval erin (niet overschrijven bij een volgende mislukking),
    // zodat "langste veldtocht" hieronder de tijd sinds het BEGIN van de
    // reeks meet, niet sinds de laatste losse poging.
    if(!(gp.siege && gp.siege.startedAt)) upd["siege/startedAt"] = FBNet.serverTime();
    upd["lastChanged"] = FBNet.serverTime();
    await ref.update(upd);
  }
  twRecordBattleHighlights(owner, gp, dealt, players, winner).catch(()=>{});
}

/* Seizoensrecords, puur motiverend (geen invloed op spelregels) — draait
   altijd op het docent-apparaat (host van de Boss Battle-siege, zie
   twStartAttack() — alleen bereikbaar via de docentenweergave), dus de
   standaard totalwar-schrijfregel (auth != null) volstaat:
   - bloodiest: zwaarste belegering (meeste schade in één stage)
   - topSolo: sterkste solo-speler (meeste persoonlijke schade in één gevecht)
   - biggestBattle: grootste veldslag (meeste échte deelnemers in één gevecht,
     ongeacht winst/verlies — het gaat om de opkomst, niet de uitkomst)
   - longestSiege: langste veldtocht (meeste eventtijd tussen de EERSTE
     mislukte aanval in een belegeringsreeks en de uiteindelijke val, zie
     siege/startedAt hierboven in twResolveSiege()) — alleen relevant bij een
     verovering ná minstens één eerdere mislukking. */
async function twRecordBattleHighlights(owner, gp, dealt, players, winner){
  if(!fbDB || !owner) return;
  const nm = (_twRegistry && _twRegistry[gp.id] && _twRegistry[gp.id].displayName) || gp.id;
  const realPlayers = Object.values(players||{}).filter(p=>p && p.identityKey && !String(p.identityKey).startsWith("bot:"));
  if(dealt>0){
    fbDB.ref(twPath(owner,"stats/bloodiest")).transaction(cur=>{
      if(cur && (cur.dealt||0)>=dealt) return cur;
      return { dealt, province:nm, attackerCivId:BM_META.attackerCivId,
        defenderCivId:gp.defenderCivId||"neutral", at:Date.now() };
    }).catch(()=>{});
  }
  const top = realPlayers.slice().sort((a,b)=>(b.damage||0)-(a.damage||0))[0];
  if(top && (top.damage||0)>0){
    fbDB.ref(twPath(owner,"stats/topSolo")).transaction(cur=>{
      if(cur && (cur.damage||0)>=top.damage) return cur;
      return { name:top.name||"?", klas:(top.identityKey||"").split(":")[0]||"",
        damage:top.damage, province:nm, at:Date.now() };
    }).catch(()=>{});
  }
  const count = realPlayers.length;
  if(count>0){
    fbDB.ref(twPath(owner,"stats/biggestBattle")).transaction(cur=>{
      if(cur && (cur.count||0)>=count) return cur;
      return { count, province:nm, attackerCivId:BM_META.attackerCivId,
        defenderCivId:gp.defenderCivId||"neutral", at:Date.now() };
    }).catch(()=>{});
  }
  if(winner==="A" && gp.siege && gp.siege.startedAt){
    const durationMs = Date.now() - gp.siege.startedAt;
    if(durationMs>0){
      fbDB.ref(twPath(owner,"stats/longestSiege")).transaction(cur=>{
        if(cur && (cur.durationMs||0)>=durationMs) return cur;
        return { durationMs, province:nm, attackerCivId:BM_META.attackerCivId,
          defenderCivId:gp.defenderCivId||"neutral", at:Date.now() };
      }).catch(()=>{});
    }
  }
}

/* Leesbare vaste tijdsduur ("3 dagen", "14 uur") — anders dan
   twFormatDuration() hierboven, dat een lopende "sinds nu"-tijd formatteert. */
function twFormatDurationMs(ms){
  if(!ms || ms<0) return "?";
  const hours = ms/3600000;
  if(hours<24) return Math.max(1,Math.round(hours))+" uur";
  const days = Math.round(hours/24);
  return days+" dag"+(days===1?"":"en");
}

/* ---- Seizoensbadge + hoogtepunten: gedeeld door SCREENS.totalWarMap
   (leerlingen/publiek) en SCREENS.totalWarPreview (docent, boven de
   "Nieuw seizoen"-knop). Beide screens hebben een eigen #twSeasonBox; alleen
   totalWarMap heeft #twHighlights. ---- */
let _twSeason = null;
let _twStats = null;

function twLoadSeasonAndStats(){
  if(!initFirebase() || !_twOwner){
    const box = el("twSeasonBox"); if(box) box.innerHTML = `<div class="note warn">Firebase niet beschikbaar.</div>`;
    return;
  }
  const seasonRef = fbDB.ref(twPath(_twOwner,"season"));
  seasonRef.on("value", snap=>{
    if(!el("twSeasonBox")){ seasonRef.off("value"); return; }
    _twSeason = snap.val();
    twRenderSeasonBox();
  });
  const statsRef = fbDB.ref(twPath(_twOwner,"stats"));
  statsRef.on("value", snap=>{
    if(!el("twHighlights")){ statsRef.off("value"); return; }
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
  const cont = el("twKlasLegend"); if(!cont || !initFirebase() || !_twOwner) return;
  fbDB.ref(twPath(_twOwner,"klasCivs")).once("value").then(snap=>{
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
    stats.biggestBattle ? `⚔️ <b>Grootste veldslag:</b> ${esc(stats.biggestBattle.province)} — ${stats.biggestBattle.count} deelnemers (${esc(civNm(stats.biggestBattle.attackerCivId))} vs. ${esc(civNm(stats.biggestBattle.defenderCivId))})` : null,
    stats.longestSiege ? `⏳ <b>Langste veldtocht:</b> ${esc(stats.longestSiege.province)} — ${twFormatDurationMs(stats.longestSiege.durationMs)} belegerd vóór de val (${esc(civNm(stats.longestSiege.attackerCivId))} vs. ${esc(civNm(stats.longestSiege.defenderCivId))})` : null,
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
  if(!initFirebase() || !_twOwner) return;
  const suggestedNum = ((_twSeason&&_twSeason.number)||1)+1;
  const typed = prompt(`Nieuw seizoen starten? Dit reset de hele kaart (alle gebieden terug naar hun thuisland/neutraal). Het huidige seizoen wordt eerst bewaard in de Hall of Fame. Klas↔beschaving-koppelingen blijven staan.\n\nTyp NIEUW SEIZOEN om te bevestigen:`);
  if((typed||"").trim().toUpperCase()!=="NIEUW SEIZOEN"){
    if(typed!==null) toast("Geannuleerd","Er is niets gereset.");
    return;
  }
  // Seizoensnummer is bewust aanpasbaar (niet blind +1): zo kan een docent een
  // per ongeluk verkeerd genummerd testseizoen corrigeren bij de eerstvolgende
  // echte reset (bv. "seizoen 1" was eigenlijk nog een test → hernummer de
  // nieuwe start alsnog naar 1 i.p.v. 2).
  const numInput = (prompt("Seizoensnummer voor de nieuwe veldtocht:", String(suggestedNum))||"").trim();
  const nextNum = /^\d+$/.test(numInput) ? parseInt(numInput,10) : suggestedNum;
  const title = (prompt("Titel voor Seizoen "+nextNum+" (leeg = automatisch):","")||"").trim()
    || TW_SEASON_TITLES[Math.max(0,nextNum-1)%TW_SEASON_TITLES.length];
  // Zelfde regel als in twEnsureCampaignSeeded(): een volk zonder gekoppelde
  // klas dit seizoen krijgt zijn basisprovincie niet — die blijft neutraal,
  // zodat het volk pas via de bestaande "rebellen"-opstand (§5.7) een eerste
  // gebied verovert zodra een docent er alsnog een klas aan koppelt.
  const [klasCivsSnap, endingSeasonSnap, provNowSnap, statsNowSnap] = await Promise.all([
    fbDB.ref(twPath(_twOwner,"klasCivs")).once("value"),
    fbDB.ref(twPath(_twOwner,"season")).once("value"),
    fbDB.ref(twPath(_twOwner,"provinces")).once("value"),
    fbDB.ref(twPath(_twOwner,"stats")).once("value"),
  ]);
  const activeCivs = new Set(Object.values(klasCivsSnap.val()||{}));
  const ownerOf = {};
  Object.entries(TW_HOME_PROVINCES).forEach(([civId,ids])=>{
    if(!activeCivs.has(civId)) return;
    ids.forEach(id=> ownerOf[id]=civId);
  });
  const upd = {};
  // Hall of Fame (op verzoek, 2026-09-07): vóór het resetten wordt het
  // AFLOPENDE seizoen gearchiveerd onder /totalwar/history/{seizoensnummer} —
  // eindstand per provincie, wie welke klas speelde, de winnaar (grootste
  // rijk) en de bestaande /totalwar/stats-hoogtepunten (bloedigste veldslag/
  // sterkste solo-speler/grootste bouwer). SCREENS.totalWarHallOfFame leest
  // deze tak. Geen archief bij de allereerste seed (dan bestaat
  // totalwar/season nog niet) — er is dan ook niets om te archiveren.
  const endingSeason = endingSeasonSnap.val();
  if(endingSeason){
    const provNow = provNowSnap.val()||{};
    const finalOwner = {};
    const counts = {};
    Object.entries(provNow).forEach(([id,p])=>{
      const o = (p&&p.owner) || "neutral";
      finalOwner[id] = o;
      if(o!=="neutral") counts[o]=(counts[o]||0)+1;
    });
    const winnerEntry = Object.entries(counts).sort((a,b)=>b[1]-a[1])[0];
    const winnerCivId = winnerEntry ? winnerEntry[0] : null;
    upd[twPath(_twOwner,"history/"+endingSeason.number)] = {
      number: endingSeason.number, title: endingSeason.title||"", startedAt: endingSeason.startedAt||null,
      endedAt: FBNet.serverTime(), finalOwner, klasCivs: klasCivsSnap.val()||{},
      winnerCivId, winnerProvinces: winnerCivId ? counts[winnerCivId] : 0,
      stats: statsNowSnap.val()||null,
    };
  }
  Object.keys(_twRegistry||{}).forEach(id=>{
    if(id==="_meta") return;
    upd[twPath(_twOwner,"provinces/"+id)] = { owner: ownerOf[id]||"neutral", militiaPoints:0, wallPoints:0, towerPoints:0, ownerSince: FBNet.serverTime(),
      siege:{ lastStage:"", stageDamage:{militia:0,walls:0,towers:0} }, lastChanged: FBNet.serverTime() };
  });
  upd[twPath(_twOwner,"stats")] = null;
  upd[twPath(_twOwner,"season")] = { number:nextNum, title, startedAt:FBNet.serverTime() };
  try{
    await fbDB.ref().update(upd);
    toast("Nieuw seizoen gestart","Seizoen "+nextNum+": "+title);
  }catch(e){ toast("Mislukt", (e&&e.message)||""); }
}

/* ---- Klas↔beschaving-koppeling grijpt sinds 2026-09-07 ook meteen in op de
   provincie-eigendom, zodat een volk zonder gekoppelde klas nooit stilzwijgend
   een provincie "blijft houden" en een net gekoppeld volk niet eerst de
   rebellen-opstand (§5.7) hoeft te winnen om te mogen meedoen — die opstand
   blijft gereserveerd voor een volk dat écht tijdens de veldtocht is
   uitgeroeid. Aangeroepen vanuit tpAssignKlasCiv()/tpUnassignKlasCiv()
   (games.js), ná de klasCivs-schrijfactie zelf. ---- */

/* Geeft een net (opnieuw) gekoppelde beschaving meteen haar basisprovincie/
   vlaggenschip — geen opstand nodig, want die provincie stond gewoon nog
   neutraal te wachten (zie de seed-/resetregel in
   twEnsureCampaignSeeded()/twStartNewSeason() hierboven).
   UITZONDERING: staat het vlaggenschip inmiddels bij een ANDER volk (een
   niet-gekoppeld volk se basisprovincie kon intussen als gewone neutrale
   provincie veroverd zijn door een actieve buur), dan grijpt dit NIET in —
   dat volk moet dan, net als elk ander volledig uitgeroeid volk, zijn
   basisprovincie via de bestaande opstand-flow heroveren (§5.7,
   twAttackButtonHTML() — die werkt toch al "ongeacht wie het nu bezet"). */
async function twGrantFreshFlagshipIfUnowned(campaignOwner, civId){
  if(!initFirebase() || !campaignOwner || !civId || civId==="neutral") return;
  await twEnsureRegistry();
  const flagship = twHomeFlagshipOf(civId);
  if(!flagship) return;
  const snap = await fbDB.ref(twPath(campaignOwner,"provinces/"+flagship)).once("value");
  const owner = (snap.val()||{}).owner;
  if(owner && owner!=="neutral") return; // eigen bezit, of veroverd door een ander: geen gratis start
  await fbDB.ref(twPath(campaignOwner,"provinces/"+flagship)).update({
    owner: civId, militiaPoints:0, wallPoints:0, towerPoints:0, ownerSince: FBNet.serverTime(),
    siege:{ lastStage:"", stageDamage:{militia:0,walls:0,towers:0} }, lastChanged: FBNet.serverTime(),
  });
}

/* Maakt een beschaving weer volledig neutraal (alle provincies die ze op dit
   moment bezit) zodra de LAATSTE klas die aan haar gekoppeld was, ontkoppeld
   wordt — een onbespeeld volk mag nooit stilzwijgend gebied blijven
   vasthouden. Doet niets zolang er nog een andere klascode aan dezelfde
   beschaving gekoppeld is. */
async function twReleaseCivIfUnassigned(campaignOwner, civId){
  if(!initFirebase() || !campaignOwner || !civId || civId==="neutral") return;
  const klasCivsSnap = await fbDB.ref(twPath(campaignOwner,"klasCivs")).once("value");
  const stillAssigned = Object.values(klasCivsSnap.val()||{}).includes(civId);
  if(stillAssigned) return;
  const provSnap = await fbDB.ref(twPath(campaignOwner,"provinces")).once("value");
  const provinces = provSnap.val()||{};
  const upd = {};
  Object.entries(provinces).forEach(([id,p])=>{
    if(!p || p.owner!==civId) return;
    upd[twPath(campaignOwner,"provinces/"+id)] = { owner:"neutral", militiaPoints:0, wallPoints:0, towerPoints:0, ownerSince: FBNet.serverTime(),
      siege:{ lastStage:"", stageDamage:{militia:0,walls:0,towers:0} }, lastChanged: FBNet.serverTime() };
  });
  if(Object.keys(upd).length) await fbDB.ref().update(upd);
}

/* ------------------------------------------------------------------
   HALL OF FAME (TOTAL_WAR.md, op verzoek 2026-09-07) — archief van
   afgesloten seizoenen. Elk seizoen dat de docent afsluit via
   twStartNewSeason() schrijft eenmalig een snapshot naar
   totalwar/campaigns/{ownerUid}/history/{seizoensnummer} (zie de archiefstap
   daar): eindstand per provincie, wie welke klas speelde, de winnaar
   (grootste rijk) en de bestaande stats-hoogtepunten van dat seizoen.
   Publiek leesbaar (zelfde regel als de rest van de campagne), geen aparte
   rules nodig. Sinds het multi-tenant-systeem (CLAUDE.md § Firebase-rules)
   toont dit scherm de EIGEN campagne van een ingelogde, goedgekeurde docent/
   admin (met beheerknoppen), en anders de campagne van de eigen klas of het
   publieke uithangbord (twResolveHofOwner()).
   ------------------------------------------------------------------ */
let _twHistory = null; // {seizoensnummer: record}, éénmalig geladen per bezoek
// Ondanks de naam geen "is admin"-check maar "mag beheren" — bepaalt of de
// beheerknoppen tonen. Sinds het docent/admin-rollensysteem (CLAUDE.md §
// Firebase-rules) is dat niet meer "is er een docent ingelogd" maar "is deze
// docent goedgekeurd (of admin)" — de onderliggende /totalwar-writerule eist
// nu hetzelfde, dus knoppen tonen voor een nog niet goedgekeurde docent zou
// alleen tot een PERMISSION_DENIED-toast leiden.
let _twHofIsAdmin = false;
// Gedeeld door de Hall of Fame-beheerknoppen én SCREENS.totalWarPreview
// hieronder: "mag dit docentaccount beheerhandelingen in Total War doen".
async function twCanManage(){
  try{
    if(!teacherNet().isTeacherLoggedIn()) return false;
    const [isAdmin, status] = await Promise.all([teacherNet().isAdmin(), teacherNet().getTeacherStatus()]);
    return isAdmin || (status && status.status==="approved");
  }catch(e){ return false; }
}

SCREENS.totalWarHallOfFame = function(){
  document.body.classList.remove("greek");
  H(brand(true)+`
  <div class="scrhead">
    <button class="back" onclick="go('totalWar')">${iconSVG("shield",20,"currentColor")}</button>
    <h2>🏛️ Hall of Fame</h2>
  </div>
  <div class="panel" style="border-color:var(--hi-dim);text-align:center">
    <div class="note">Elk afgesloten seizoen van Total War staat hier voorgoed
    vermeld: de eindstand van de kaart, wie won, en de hoogtepunten van dat
    seizoen.</div>
  </div>
  <div id="twHofList"><div class="note" style="text-align:center;padding:20px">Laden…</div></div>
  ${foot()}`);
  twLoadHallOfFame();
};

function twLoadHallOfFame(){
  const cont = el("twHofList"); if(!cont || !initFirebase()) return;
  _twHofIsAdmin = false; // synchroon nog onbekend; async hieronder bijgewerkt
  // Dit scherm is publiek (geen login-eis), dus we wachten niet blokkerend op
  // authReady() — eerst resolven we welke campagne getoond wordt (eigen
  // campagne voor een ingelogde docent/admin, anders de campagne van de
  // eigen klas of het uithangbord, zie twResolveHofOwner()), pas dan laden.
  teacherNet().authReady().then(twResolveHofOwner).then(({owner, isOwner, noCampaignYet})=>{
    if(!el("twHofList")) return; // ondertussen weggenavigeerd
    _twOwner = owner;
    _twHofIsAdmin = isOwner;
    if(noCampaignYet || !owner){
      cont.innerHTML = `<div class="panel"><div class="note" style="text-align:center">Je docent heeft nog geen eigen Total War gestart.</div></div>`;
      return;
    }
    fbDB.ref(twPath(owner,"history")).once("value").then(snap=>{
      if(_twOwner!==owner) return; // ondertussen een andere campagne geladen
      _twHistory = snap.val()||{};
      twRenderHallOfFame();
    }).catch(()=>{ cont.innerHTML = `<div class="note warn">Kon de Hall of Fame niet laden.</div>`; });
  });
}

function twRenderHallOfFame(){
  const cont = el("twHofList"); if(!cont) return;
  const all = Object.values(_twHistory||{}).sort((a,b)=>(b.number||0)-(a.number||0));
  // Verborgen seizoenen (zie twHofSetHidden()) blijven bestaan en zijn nog
  // gewoon zichtbaar voor de docent (met een label + "weer tonen"-knop), maar
  // verdwijnen uit de publieke/leerling-weergave.
  const seasons = _twHofIsAdmin ? all : all.filter(s=>!s.hidden);
  if(!seasons.length){
    cont.innerHTML = `<div class="panel"><div class="note" style="text-align:center">Nog geen afgeronde seizoenen — de eerste
      vermelding verschijnt zodra de docent het huidige seizoen afsluit.</div></div>`;
    return;
  }
  cont.innerHTML = seasons.map(s=>twHallOfFameCardHTML(s, _twHofIsAdmin)).join("");
}

/* Leesbare periode "3 sep 2026 – 7 sep 2026" voor één afgesloten seizoen. */
function twFormatSeasonSpan(startedAt, endedAt){
  const fmt = ts => ts ? new Date(ts).toLocaleDateString("nl-NL",{day:"numeric",month:"short",year:"numeric"}) : "?";
  return fmt(startedAt) + " – " + fmt(endedAt);
}

function twHallOfFameCardHTML(s, isAdmin){
  const winner = s.winnerCivId ? (TW_CIVS[s.winnerCivId]||TW_CIVS.neutral) : null;
  const winnerKlassen = Object.entries(s.klasCivs||{}).filter(([,civId])=>civId===s.winnerCivId).map(([klas])=>klas);
  const stats = s.stats||{};
  const civNm = id => (TW_CIVS[id]||TW_CIVS.neutral).nm;
  // topSolo/topBuilder noemen een individuele leerlingnaam — daar krijgt de
  // docent per regel een eigen "✕"-knop om precies díe naam te verwijderen
  // (bv. een verkeerd gespelde naam, of een leerling die liever niet met
  // naam op een openbaar scherm wil staan) zonder de rest van het seizoen
  // aan te tasten. Bloedigste veldslag noemt alleen volken, geen "speler".
  const statRow = (html, statKey) => `<div class="note" style="margin-top:4px;display:flex;align-items:center;gap:8px">
    <span style="flex:1">${html}</span>
    ${isAdmin ? `<button class="chip" style="color:#e07060;border-color:rgba(90,18,12,.4);flex:0 0 auto" onclick="twHofRemoveStat(${s.number},'${statKey}')" title="Verwijder deze naam uit de Hall of Fame">✕</button>` : ""}
  </div>`;
  const highlightRows = [
    stats.bloodiest ? `<div class="note" style="margin-top:4px">🩸 <b>Bloedigste veldslag:</b> ${esc(stats.bloodiest.province)} — ${Math.round(stats.bloodiest.dealt)} schade (${esc(civNm(stats.bloodiest.attackerCivId))} vs. ${esc(civNm(stats.bloodiest.defenderCivId))})</div>` : "",
    stats.biggestBattle ? `<div class="note" style="margin-top:4px">⚔️ <b>Grootste veldslag:</b> ${esc(stats.biggestBattle.province)} — ${stats.biggestBattle.count} deelnemers (${esc(civNm(stats.biggestBattle.attackerCivId))} vs. ${esc(civNm(stats.biggestBattle.defenderCivId))})</div>` : "",
    stats.longestSiege ? `<div class="note" style="margin-top:4px">⏳ <b>Langste veldtocht:</b> ${esc(stats.longestSiege.province)} — ${twFormatDurationMs(stats.longestSiege.durationMs)} belegerd vóór de val (${esc(civNm(stats.longestSiege.attackerCivId))} vs. ${esc(civNm(stats.longestSiege.defenderCivId))})</div>` : "",
    stats.topSolo ? statRow(`🌟 <b>Sterkste vechter:</b> ${esc(stats.topSolo.name)} (${esc(stats.topSolo.klas)}) — ${Math.round(stats.topSolo.damage)} schade in één gevecht`, "topSolo") : "",
    stats.topBuilder ? statRow(`🏗️ <b>Grootste bouwer:</b> ${esc(stats.topBuilder.name)} (${esc(stats.topBuilder.klas)}) — ${Math.round(stats.topBuilder.points)} bouwpunten`, "topBuilder") : "",
  ].filter(Boolean);
  // Beheerbalk (uitsluitend voor ingelogde docenten, zie twLoadHallOfFame()):
  // verbergen is omkeerbaar (blijft bewaard, alleen niet publiek zichtbaar),
  // verwijderen is permanent — vandaar de typ-bevestiging in twHofDeleteSeason().
  const adminBar = isAdmin ? `<div style="display:flex;gap:8px;margin-top:12px">
    <button class="btn btn-ghost" style="flex:1" onclick="twHofSetHidden(${s.number}, ${s.hidden?"false":"true"})">${s.hidden?"👁️ Weer tonen":"🙈 Verbergen"}</button>
    <button class="btn btn-ghost" style="flex:1;color:#e07060;border-color:rgba(90,18,12,.4)" onclick="twHofDeleteSeason(${s.number})">🗑️ Verwijderen</button>
  </div>` : "";
  return `<div class="panel"${s.hidden?' style="opacity:.65"':""}>
    <span class="pill" style="background:var(--stone4);color:var(--hi-bright)">Seizoen ${s.number}</span>
    ${s.hidden ? `<span class="pill" style="background:var(--ox);color:#fff;margin-left:6px">🙈 Verborgen — alleen zichtbaar voor docenten</span>` : ""}
    <h3 style="margin:8px 0 2px">${esc(s.title||"")}</h3>
    <div class="note">${twFormatSeasonSpan(s.startedAt, s.endedAt)}</div>
    ${winner ? `<div class="note" style="margin-top:10px">👑 <b>Winnaar:</b>
      <span style="display:inline-block;width:12px;height:12px;border-radius:3px;background:${winner.color};margin:0 4px;vertical-align:middle"></span>
      ${esc(winner.nm)}${winnerKlassen.length?` (${winnerKlassen.map(esc).join(", ")})`:""} — ${s.winnerProvinces||0} gebied${s.winnerProvinces!==1?"en":""}</div>`
      : `<div class="note" style="margin-top:10px">Geen winnaar — er was geen enkel volk actief dit seizoen.</div>`}
    ${twLegendFromOwnership(s.finalOwner)}
    ${highlightRows.length ? `<div style="margin-top:8px">${highlightRows.join("")}</div>` : ""}
    <button class="btn btn-ghost btn-block" style="margin-top:12px" onclick="twToggleHistoryMap(${s.number}, this)">🗺️ Bekijk eindkaart</button>
    <div id="twHofMap${s.number}" style="margin-top:10px"></div>
    ${adminBar}
  </div>`;
}

/* ---- Docent-beheer van de Hall of Fame (op verzoek, voor als een seizoen
   niet liep zoals gepland): verbergen/tonen en verwijderen per seizoen, en
   losstaand het verwijderen van één individuele leerlingnaam uit een
   seizoen se hoogtepunten. Firebase-rules staan dit toe voor elke
   goedgekeurde docent of admin: /totalwar's top-level .write eist sinds het
   docent/admin-rollensysteem (CLAUDE.md § Firebase-rules) ook
   teacherStatus/{uid}.status==="approved" (of admins/{uid}) — "history" heeft
   zelf geen eigen rule, dus valt terug op die eis. Een nog niet goedgekeurd
   docentaccount krijgt hier dus een PERMISSION_DENIED-toast. ---- */
function twHofSetHidden(seasonNumber, hidden){
  if(!initFirebase() || !_twOwner) return;
  return fbDB.ref(twPath(_twOwner,"history/"+seasonNumber+"/hidden")).set(hidden)
    .then(()=>{ toast(hidden?"Verborgen":"Weer zichtbaar","Seizoen "+seasonNumber); twLoadHallOfFame(); })
    .catch(e=>toast("Fout", typeof e==="string"?e:(e&&e.message)||""));
}

async function twHofDeleteSeason(seasonNumber){
  const typed = prompt(`Seizoen ${seasonNumber} PERMANENT uit de Hall of Fame verwijderen? Dit kan niet ongedaan gemaakt worden.\n\nTyp VERWIJDEREN om te bevestigen:`);
  if((typed||"").trim().toUpperCase()!=="VERWIJDEREN"){
    if(typed!==null) toast("Geannuleerd","Er is niets verwijderd.");
    return;
  }
  if(!initFirebase() || !_twOwner) return;
  try{
    await fbDB.ref(twPath(_twOwner,"history/"+seasonNumber)).remove();
    toast("Verwijderd","Seizoen "+seasonNumber+" is uit de Hall of Fame gehaald.");
    twLoadHallOfFame();
  }catch(e){ toast("Fout", typeof e==="string"?e:(e&&e.message)||""); }
}

function twHofRemoveStat(seasonNumber, statKey){
  if(!confirm("Deze naam permanent uit de Hall of Fame verwijderen voor dit seizoen?")) return;
  if(!initFirebase() || !_twOwner) return;
  return fbDB.ref(twPath(_twOwner,"history/"+seasonNumber+"/stats/"+statKey)).remove()
    .then(()=>{ toast("Verwijderd","Naam verwijderd uit Seizoen "+seasonNumber); twLoadHallOfFame(); })
    .catch(e=>toast("Fout", typeof e==="string"?e:(e&&e.message)||""));
}

/* Legenda-chips (gebiedentelling per volk) van een BEVROREN eigendomsstand
   (finalOwner: {provincieId: civId}) — losstaand van twLegend(), dat werkt op
   de live kaart en kent begrippen (verslagen/betwist) die op een afgesloten
   seizoen niet meer van toepassing zijn. */
function twLegendFromOwnership(finalOwner){
  const counts = {};
  Object.values(finalOwner||{}).forEach(civId=>{ if(civId && civId!=="neutral") counts[civId]=(counts[civId]||0)+1; });
  return `<div class="chips" style="margin-top:10px">` + Object.entries(TW_CIVS).map(([id,c])=>{
    if(id==="neutral") return "";
    const owned = counts[id]||0;
    return `<span class="chip"><span style="display:inline-block;width:12px;height:12px;border-radius:3px;
      background:${c.color};margin-right:6px;vertical-align:middle"></span>${esc(c.nm)} <small>${owned} gebied${owned!==1?"en":""}</small></span>`;
  }).join("") + `</div>`;
}

/* Rendert (lazy, pas bij klikken) de echte kaart-SVG met de bevroren
   eindstand van dat seizoen in een eigen, niet-interactieve host — hergebruikt
   de al gecachete SVG/registry (_twSvgCache/_twRegistry, zie twLoadMap())
   zodat dit geen aparte fetch nodig heeft zolang de gebruiker al ergens een
   live kaart bekeken heeft; anders wordt die cache hier voor het eerst gevuld. */
async function twToggleHistoryMap(seasonNumber, btn){
  const host = el("twHofMap"+seasonNumber); if(!host) return;
  if(host.innerHTML){ host.innerHTML=""; if(btn) btn.textContent="🗺️ Bekijk eindkaart"; return; }
  const record = (_twHistory||{})[seasonNumber]; if(!record) return;
  if(btn) btn.textContent="Kaart laden…";
  try{
    if(!_twSvgCache){
      const [svg] = await Promise.all([
        fetch("map/provinces.svg?v=20260703a").then(r=>{ if(!r.ok) throw new Error("SVG "+r.status); return r.text(); }),
        twEnsureRegistry(),
      ]);
      _twSvgCache = svg;
    } else {
      await twEnsureRegistry();
    }
    host.style.cssText = "background:#9fc7f4;border:1px solid var(--stone4);border-radius:14px;overflow:hidden";
    host.innerHTML = _twSvgCache;
    const svgEl = host.querySelector("svg");
    if(svgEl){
      svgEl.removeAttribute("width"); svgEl.removeAttribute("height");
      svgEl.setAttribute("style","width:100%;height:auto;display:block");
    }
    Object.entries(record.finalOwner||{}).forEach(([id,civId])=>{
      const c = civId && civId!=="neutral" ? TW_CIVS[civId] : null;
      MapAPI.setProvinceOwner(id, c ? c.color : null, svgEl);
    });
    if(typeof MapAPI!=="undefined" && _twRegistry){
      MapAPI.drawSeaRoutes(_twRegistry, host);
      MapAPI.drawCityMarkers(_twRegistry, host);
    }
    if(btn) btn.textContent="🔼 Verberg eindkaart";
  }catch(e){
    host.innerHTML = `<div class="note warn" style="padding:12px">Kaart kon niet geladen worden (${esc(e.message)}).</div>`;
    if(btn) btn.textContent="🗺️ Bekijk eindkaart";
  }
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
  if(!fbDB || !provinces || !_twOwner) return;
  Object.keys(TW_CIVS).forEach(civId=>{
    if(civId==="neutral") return;
    const wiped=!Object.values(provinces).some(p=>p&&p.owner===civId);
    if(!wiped) return;
    fbDB.ref(twPath(_twOwner,"civs/"+civId+"/wasWiped")).once("value").then(snap=>{
      if(!snap.val()) fbDB.ref(twPath(_twOwner,"civs/"+civId+"/wasWiped")).set(true);
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
   — hergebruikt lobby/gevecht volledig ongewijzigd, zie BOSS_BATTLE.md §7.
   bmStartBossGame() in battle.js leest garrisonProvince uit om de
   garnizoensbonus/slijtageslag toe te passen.

   Gaat via SCREENS.hostSource (net als bmStartHost()/bmStartBossHost() in
   battle.js), NIET rechtstreeks naar battleHostSettings — een eerdere versie
   sloeg die stap over, waardoor de docent nooit de kans kreeg om de
   woordenlijst (taal/frequentiebereik) te kiezen: DRAFT.lang/.source bleven
   gewoon staan op wat er toevallig van een vorig, ongerelateerd spel over
   was (vaak Latijn), zelfs voor een Griekse klas. confirmSource()
   (games.js) stuurt bij DRAFT.game==="battle" vanzelf door naar
   battleHostSettings zodra de docent de woordenlijst bevestigd heeft. */
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
  BM_META.campaignOwner = _twOwner; // welke campagne twResolveSiege() straks moet bijwerken
  const nm = (_twRegistry?.[targetId]?.displayName) || targetId;
  toast("Aanval voorbereid", nm+" — kies eerst de woordenlijst.");
  ROLE = "host"; DRAFT.game = "battle";
  go("hostSource");
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

/* Percentage-weergave per garnizoensspoor (op verzoek 2026-09-09): puur
   informatief, zodat andere klassen/leerlingen en de docent in één oogopslag
   zien welke provincies fanatiek verdedigd (en aangevallen) worden, i.p.v.
   alleen de kale tierlabel ("—"/"basis"/"volledig") zonder voortgang.
   Twee losse percentages, allebei optioneel:
   - bouwvoortgang naar de eerstvolgende tier (TW_TIER1_POINTS/TW_TIER2_POINTS),
     zolang dit spoor nog niet op tier 2 (volledig) staat;
   - resterend-HP% als dit precies het spoor is waar de laatste belegering op
     strandde (siege.lastStage === trackKey) — berekend tegen de HP die dat
     spoor bij de REFERENTIEklasgrootte (TW_STAGE_HP_REF_N) zou hebben, zodat
     dit getal niet van de toevallige klasgrootte van de LAATSTE aanvaller
     afhangt (dat weet dit informatieve paneel, buiten een lopend gevecht om,
     ook niet). */
function twTrackProgressLabel(trackKey, points, siege){
  points = points||0;
  const tier = twStructureTier(points);
  let label = tier===0?"—":tier===1?"basis":"volledig";
  if(tier<2){
    const lo = tier===0?0:TW_TIER1_POINTS;
    const hi = tier===0?TW_TIER1_POINTS:TW_TIER2_POINTS;
    const pct = Math.max(0,Math.min(100,Math.round((points-lo)/(hi-lo)*100)));
    label += ` (${pct}% naar ${tier===0?"basis":"volledig"})`;
  }
  const dmg = siege && siege.lastStage===trackKey ? (siege.stageDamage && siege.stageDamage[trackKey]||0) : 0;
  if(dmg>0){
    const refHp = TW_STAGE_HP[tier] || TW_STAGE_HP[1];
    const remainPct = Math.max(0,Math.min(100,Math.round((1-dmg/refHp)*100)));
    label += ` · ⚔ ${remainPct}% HP`;
  }
  return label;
}

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
  const tracksNote = _twLiveMode
    ? `<div class="note" style="margin-top:6px">Fort: ${twTrackProgressLabel("towers",p.towerPoints,p.siege)} ·
        Muur: ${twTrackProgressLabel("walls",p.wallPoints,p.siege)} ·
        Garnizoen: ${twTrackProgressLabel("militia",p.militiaPoints,p.siege)}</div>`
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
  // Diepte-effect: de gebouw-/muurlagen blijven exact zoals origineel
  // (gecentreerd in het vak), maar de militie/boeren-laag wordt via
  // object-position naar de ONDERKANT van het vak geankerd. Eerdere pogingen
  // verschoven het vak zelf (top-inset/height), maar object-fit:contain
  // centreert de afbeelding BINNEN het vak — het vak verschuiven deed dus
  // vrijwel niets zolang de afbeelding kleiner was dan het vak.
  // object-position verplaatst de afbeelding-in-het-vak wél echt: boeren
  // zakken naar beneden, gebouw blijft gecentreerd → figuren staan er iets
  // onder/vóór i.p.v. er precies overheen geplakt.
  const posFor = type => type==="militia" ? ";object-position:center bottom" : "";
  return `<div style="position:relative;width:128px;height:128px;flex:0 0 auto;background:#fff;border-radius:10px;box-sizing:border-box;overflow:hidden">
    ${layers.map(l=>`<img src="${l.src}?${SPRITE_VER}" style="position:absolute;inset:8px;width:calc(100% - 16px);height:calc(100% - 16px);object-fit:contain${posFor(l.type)}" alt="" onerror="this.style.display='none'">`).join("")}
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
