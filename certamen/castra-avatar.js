/* ============================================================================
   CASTRA HEROUM — AVATAR ALS TOP-DOWN LOOPSPRITE
   ----------------------------------------------------------------------------
   Dezelfde avatar als in Battle Mode (BM_IDENT.avatar, gebouwd in de Certamen-
   profieleditor), maar met de top-down sprites uit assets/sprites-topdown/.
   Geen eigen avatarsysteem: PIXEL_ASSETS, bmAvatarMerge(), bmZichtbaarHaar() en
   alle kleurfilters (BM_HAARKLEUR_FILTER, BM_CAPEKLEUR_FILTER, ...) komen uit
   battle.js / battle-data.js, dus elke nieuwe avatar-optie werkt hier vanzelf
   mee zodra het bijbehorende bestand in sprites-topdown/ staat (zelfde naam).
   Laadt NA battle.js. Formaat en bestandslijst: assets/sprites-topdown/README.txt
   Zie CASTRA_HEROUM.md.
   ============================================================================ */

const CASTRA_SPRITE_DIR = "assets/sprites-topdown/";
const CASTRA_SPRITE_VER = "v=7";   // ophogen na het vervangen van een PNG
const CASTRA_FRAME = 48;           // MV-loopsheet: frame 48×48, 3 kolommen × 4 rijen
const CASTRA_DIR_ROW = { down:0, left:1, right:2, up:3 };

// battler-pad -> top-down-pad (zelfde bestandsnaam, andere map)
function castraTdPath(battlerPath){
  return battlerPath ? battlerPath.replace("assets/sprites/", CASTRA_SPRITE_DIR) : "";
}

// Welke top-down base-sprites bestaan al? Gecachet per huidtint; onbekend = null.
const CASTRA_TD_READY = {};
function castraProbeBase(huid){
  const key = (typeof _bmBaseKey==="function") ? _bmBaseKey({huid}) : (huid||"licht");
  if(key in CASTRA_TD_READY) return Promise.resolve(CASTRA_TD_READY[key]);
  return new Promise(res=>{
    const img = new Image();
    img.onload  = ()=>{ CASTRA_TD_READY[key]=true;  res(true); };
    img.onerror = ()=>{ CASTRA_TD_READY[key]=false; res(false); };
    img.src = castraTdPath(PIXEL_ASSETS.bases[key]) + "?" + CASTRA_SPRITE_VER;
  });
}
function castraTdAvailable(av){
  const cosm = bmAvatarMerge(av);
  const key = _bmBaseKey(cosm);
  return CASTRA_TD_READY[key] === true;
}

// Top-down avatar als HTML. dir: down|left|right|up, frame: 0|1|2 (1 = staand),
// sizePx: weergavegrootte (vierkant). Valt terug op de battler-avatar zolang de
// top-down base-sprite er (nog) niet is.
function castraAvatarHTML(av, dir="down", frame=1, sizePx=48){
  if(typeof BM_PIXEL_ART==="undefined" || !BM_PIXEL_ART) return "";
  if(!castraTdAvailable(av)) return renderPixelHeroIcon(av, sizePx);
  const cosm = bmAvatarMerge(av), A = PIXEL_ASSETS;
  const row = CASTRA_DIR_ROW[dir]!=null ? CASTRA_DIR_ROW[dir] : 0;
  const pos = `-${frame*CASTRA_FRAME}px -${row*CASTRA_FRAME}px`;
  function L(src, filter){
    if(!src) return "";
    const url = castraTdPath(src) + "?" + CASTRA_SPRITE_VER;
    return `<div style="position:absolute;inset:0;background:url('${url}') ${pos}/${3*CASTRA_FRAME}px ${4*CASTRA_FRAME}px no-repeat;image-rendering:pixelated${filter&&filter!=="none"?";filter:"+filter:""}"></div>`;
  }
  const haarF = BM_HAARKLEUR_FILTER[cosm.haarkleur||"blond"] || "none";
  const capeF = BM_CAPE_NO_TINT.has(cosm.cape) ? "none" : (BM_CAPEKLEUR_FILTER[cosm.capekleur||"goud"] || "none");
  const prestigeOn = !!(cosm.prestige && cosm.prestige!=="geen");
  const wrapF = prestigeOn ? `filter:${BM_PRESTIGE_FILTER};` : "";
  const scale = (sizePx/CASTRA_FRAME).toFixed(4);
  const legId = cosm.legendary && cosm.legendary!=="geen" ? cosm.legendary : null;
  // Wapens bestaan niet als top-down sprite (bewust: in Castra Heroum draagt de dux
  // geen zichtbaar wapen). Capes en vleugels bestaan alleen als achterkant (rij
  // "omhoog"; zie README): van voren hangen ze achter het lichaam, maar wie van je
  // wegloopt (dir "up") draagt ze óver lichaam en harnas heen.
  const capeL = L(A.cape[cosm.cape||"geen"], capeF);
  const capeBehind = dir==="up" ? "" : capeL, capeOver = dir==="up" ? capeL : "";
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
      L(A.armor[cosm.armor||"licht"], BM_ARMOR_TINT_FILTER[cosm.armor]||"none") +
      capeOver +
      L(A.haar[bmZichtbaarHaar(cosm)], haarF) +
      baardL +
      L(A.extra[cosm.extra||"geen"]) +
      L(A.schild[cosm.schild||"rond"]) +
      L(A.helm[cosm.helm||"standard"]);
  }
  return `<span style="position:relative;display:inline-block;width:${sizePx}px;height:${sizePx}px;overflow:hidden;vertical-align:middle;flex-shrink:0"><span style="position:absolute;top:0;left:0;width:${CASTRA_FRAME}px;height:${CASTRA_FRAME}px;transform-origin:top left;transform:scale(${scale});${wrapF}">${layers}</span></span>`;
}
