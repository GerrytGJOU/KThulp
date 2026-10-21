/* ============================================================================
   CASTRA HERONUM — AVATAR ALS TOP-DOWN LOOPSPRITE
   ----------------------------------------------------------------------------
   Dezelfde avatar als in Battle Mode (BM_IDENT.avatar, gebouwd in de Certamen-
   profieleditor), maar met de top-down sprites uit assets/sprites-topdown/.
   Geen eigen avatarsysteem: PIXEL_ASSETS, bmAvatarMerge(), bmZichtbaarHaar() en
   alle kleurfilters (BM_HAARKLEUR_FILTER, BM_CAPEKLEUR_FILTER, ...) komen uit
   battle.js / battle-data.js, dus elke nieuwe avatar-optie werkt hier vanzelf
   mee zodra het bijbehorende bestand in sprites-topdown/ staat (zelfde naam).
   Laadt NA battle.js. Formaat en bestandslijst: assets/sprites-topdown/README.txt
   Zie CASTRA_HERONUM.md.
   ============================================================================ */

const CASTRA_SPRITE_DIR = "assets/sprites-topdown/";
const CASTRA_SPRITE_VER = "v=9";   // ophogen na het vervangen van een PNG
const CASTRA_FRAME = 48;           // MV-loopsheet: frame 48×48, 3 kolommen × 4 rijen
const CASTRA_DIR_ROW = { down:0, left:1, right:2, up:3 };

// battler-pad -> top-down-pad (zelfde bestandsnaam, andere map)
function castraTdPath(battlerPath){
  return battlerPath ? battlerPath.replace("assets/sprites/", CASTRA_SPRITE_DIR) : "";
}

// Welke top-down base-sprites bestaan al? Gecachet per huidtint; onbekend = null.
const CASTRA_TD_READY = {};
// Welke top-down bestanden bestaan er? Eénmalig per sessie gescand (alle PIXEL_ASSETS-paden, behalve wapens);
// ontbrekende lagen worden daarna niet meer opgevraagd (geen 404-spam) en krijgen een terugval, zodat een
// avatar nooit onzichtbaar of kaal wordt zolang er nog sprites ontbreken (zie assets/sprites-topdown/README.txt).
let CASTRA_TD_EXISTS = null, _castraTdScanP = null;
function castraTdScan(){
  if(_castraTdScanP) return _castraTdScanP;
  const paths = new Set();
  Object.keys(PIXEL_ASSETS).forEach(cat=>{ if(cat==="wapen") return; Object.values(PIXEL_ASSETS[cat]).forEach(p=>{ if(p) paths.add(p); }); });
  const map = {};
  _castraTdScanP = Promise.all([...paths].map(p=>new Promise(res=>{
    const im = new Image(); im.onload = ()=>{ map[p]=true; res(); }; im.onerror = ()=>{ map[p]=false; res(); };
    im.src = castraTdPath(p) + "?" + CASTRA_SPRITE_VER;
  }))).then(()=>{ CASTRA_TD_EXISTS = map; });
  return _castraTdScanP;
}
function castraTdHas(src){ return !CASTRA_TD_EXISTS || CASTRA_TD_EXISTS[src]!==false; }

function castraProbeBase(huid){
  const key = (typeof _bmBaseKey==="function") ? _bmBaseKey({huid}) : (huid||"licht");
  const scan = castraTdScan();
  if(key in CASTRA_TD_READY) return scan.then(()=>CASTRA_TD_READY[key]);
  return scan.then(()=>new Promise(res=>{
    const img = new Image();
    img.onload  = ()=>{ CASTRA_TD_READY[key]=true;  res(true); };
    img.onerror = ()=>{ CASTRA_TD_READY[key]=false; res(false); };
    img.src = castraTdPath(PIXEL_ASSETS.bases[key]) + "?" + CASTRA_SPRITE_VER;
  }));
}
function castraTdAvailable(av){
  const cosm = bmAvatarMerge(av);
  const key = _bmBaseKey(cosm);
  return CASTRA_TD_READY[key] === true;
}

// Zijn alle gekozen onderdelen van deze avatar als top-down sprite aanwezig? (Wapens tellen niet mee: die
// zijn bewust niet getekend. "geen"-opties hebben geen laag nodig.) Zo nee: de Battle Mode-avatar.
function castraTdComplete(cosm){
  if(!CASTRA_TD_EXISTS) return false;                       // scan nog niet klaar: veilig de battler tonen
  const A = PIXEL_ASSETS, need = [];
  const add = (cat, key, skip)=>{ if(!key || (skip && skip.includes(key))) return; const p = A[cat] && A[cat][key]; if(p) need.push(p); };
  const legId = cosm.legendary && cosm.legendary!=="geen" ? cosm.legendary : null;
  add("bases", _bmBaseKey(cosm));
  if(legId && A.legendary[legId]){ need.push(A.legendary[legId]); }
  else {
    add("ogen", cosm.oogkleur||"blauw"); add("haar", bmZichtbaarHaar(cosm)); add("armor", cosm.armor||"licht");
    add("helm", cosm.helm||"standard", ["geen"]); add("cape", cosm.cape||"geen", ["geen"]);
    const baardId = cosm.baard||"geen";
    if(baardId==="baardsnor"){ add("baard","baard"); add("baard","snor"); } else add("baard", baardId, ["geen"]);
    add("extra", cosm.extra||"geen", ["geen"]); add("borstband", cosm.borstband||"geen", ["geen"]);
  }
  add("schild", cosm.schild||"rond", ["geen"]);
  return need.every(p=>CASTRA_TD_EXISTS[p]!==false);
}
// Battle Mode-avatar (zijaanzicht) als terugval; bij "links" gespiegeld.
function castraBattlerFallback(av, dir, sizePx){
  const h = renderPixelHeroIcon(av, sizePx);
  return dir==="left" ? `<span style="display:inline-block;transform:scaleX(-1)">${h}</span>` : h;
}

// Top-down avatar als HTML. dir: down|left|right|up, frame: 0|1|2 (1 = staand),
// sizePx: weergavegrootte (vierkant). Valt terug op de battler-avatar zolang de
// top-down base-sprite er (nog) niet is.
function castraAvatarHTML(av, dir="down", frame=1, sizePx=48){
  if(typeof BM_PIXEL_ART==="undefined" || !BM_PIXEL_ART) return "";
  if(!castraTdAvailable(av)) return castraBattlerFallback(av, dir, sizePx);
  const cosm = bmAvatarMerge(av), A = PIXEL_ASSETS;
  if(!castraTdComplete(cosm)) return castraBattlerFallback(av, dir, sizePx);
  const row = CASTRA_DIR_ROW[dir]!=null ? CASTRA_DIR_ROW[dir] : 0;
  const pos = `-${frame*CASTRA_FRAME}px -${row*CASTRA_FRAME}px`;
  function L(src, filter){
    if(!src || !castraTdHas(src)) return "";
    const url = castraTdPath(src) + "?" + CASTRA_SPRITE_VER;
    return `<div style="position:absolute;inset:0;background:url('${url}') ${pos}/${3*CASTRA_FRAME}px ${4*CASTRA_FRAME}px no-repeat;image-rendering:pixelated${filter&&filter!=="none"?";filter:"+filter:""}"></div>`;
  }
  const haarF = BM_HAARKLEUR_FILTER[cosm.haarkleur||"blond"] || "none";
  const capeF = BM_CAPE_NO_TINT.has(cosm.cape) ? "none" : (BM_CAPEKLEUR_FILTER[cosm.capekleur||"goud"] || "none");
  const prestigeOn = !!(cosm.prestige && cosm.prestige!=="geen");
  const wrapF = prestigeOn ? `filter:${BM_PRESTIGE_FILTER};` : "";
  const scale = (sizePx/CASTRA_FRAME).toFixed(4);
  const legId = cosm.legendary && cosm.legendary!=="geen" ? cosm.legendary : null;
  // Wapens bestaan niet als top-down sprite (bewust: in Castra Heronum draagt de dux
  // geen zichtbaar wapen). Capes en vleugels bestaan alleen als achterkant (rij
  // "omhoog"; zie README): van voren hangen ze achter het lichaam, maar wie van je
  // wegloopt (dir "up") draagt ze óver lichaam en harnas heen.
  const capeL = L(A.cape[cosm.cape||"geen"], capeF);
  const capeBehind = dir==="up" ? "" : capeL, capeOver = dir==="up" ? capeL : "";
  const armorSrc = A.armor[cosm.armor||"licht"];
  let layers;
  if(legId && A.legendary[legId]){
    // Legendarische held vervangt de paper doll (net als in battle.js); het schild blijft de keuze van de speler.
    layers = L(A.legendary[legId]) + L(A.schild[cosm.schild||"rond"]);
  } else {
    const baardId = cosm.baard||"geen";
    const baardL = baardId==="baardsnor" ? L(A.baard.baard,haarF)+L(A.baard.snor,haarF) : L(A.baard[baardId],haarF);
    layers =
      capeBehind +
      L(A.bases[_bmBaseKey(cosm)]) +
      L(A.ogen[cosm.oogkleur||"blauw"]) +
      L(A.borstband[cosm.borstband||"geen"]) +
      L(armorSrc, BM_ARMOR_TINT_FILTER[cosm.armor]||"none") +
      capeOver +
      L(A.haar[bmZichtbaarHaar(cosm)], haarF) +
      baardL +
      L(A.extra[cosm.extra||"geen"]) +
      L(A.schild[cosm.schild||"rond"]) +
      L(A.helm[cosm.helm||"standard"]);
  }
  return `<span style="position:relative;display:inline-block;width:${sizePx}px;height:${sizePx}px;overflow:hidden;vertical-align:middle;flex-shrink:0"><span style="position:absolute;top:0;left:0;width:${CASTRA_FRAME}px;height:${CASTRA_FRAME}px;transform-origin:top left;transform:scale(${scale});${wrapF}">${layers}</span></span>`;
}
