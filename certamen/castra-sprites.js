/* ============================================================================
   CASTRA HEROUM — SPRITES PER VORM (M6 van CASTRA_TROEPENBOMEN.md)
   ----------------------------------------------------------------------------
   Per vorm drie optionele afbeeldingen in assets/sprites-forms/:
     [vorm-id]_battle_front.png  96x96  (vijand in het beurtgevecht)
     [vorm-id]_battle_back.png   96x96  (jouw soldaat in het beurtgevecht)
     [vorm-id]_td.png            48x48  (tower defence, ook als miniatuur in de codex)
   Bestaat een bestand niet, dan valt het spel terug op de avatar-lagen
   (castraFormLook / castraAvatarHTML) — je kunt dus per vorm uploaden.
   Aanwezigheid wordt per bestand één keer gecontroleerd (Image-probe) en onthouden.
   Na het vervangen van een PNG: CASTRA_FSPR.ver ophogen. Overzicht van wat nog
   mist: node certamen/tools/castra-sprites-manifest.js (schrijft MANIFEST.md).
   Laadt NA castra-troops.js.
   ============================================================================ */
const CASTRA_FSPR = { dir:"assets/sprites-forms/", ver:"v=1", have:{}, pending:{} };
const CASTRA_FSPR_KINDS = { battle_front:96, battle_back:96, td:48, portrait:128, td_idle:48, td_attack:48, td_hurt:48, td_down:48, td_side:48, td_up:48 };

function castraFsprUrl(id, kind){ return CASTRA_FSPR.dir + id + "_" + kind + ".png?" + CASTRA_FSPR.ver; }
// true = bestaat, false = bestaat niet, undefined = nog niet gecontroleerd
function castraFsprHas(id, kind){ return CASTRA_FSPR.have[id+"|"+kind]; }
// list: [[vormId, kind], ...]; cb draait zodra alles gecontroleerd is (meteen als alles al bekend is).
function castraFsprProbe(list, cb){
  const F = CASTRA_FSPR; let open = 0, done = false;
  const fin = ()=>{ if(!done && open===0){ done = true; if(cb) cb(); } };
  list.forEach(([id,kind])=>{
    const k = id+"|"+kind;
    if(F.have[k]!==undefined) return;
    open++;
    const im = new Image();
    im.onload = ()=>{ F.have[k] = true; open--; fin(); };
    im.onerror = ()=>{ F.have[k] = false; open--; fin(); };
    im.src = castraFsprUrl(id, kind);
  });
  if(open===0){ done = true; if(cb) cb(); }
}
// HTML van de sprite, of fallbackHtml als hij (nog) niet bestaat. flip = spiegelen (kijkrichting links).
function castraFsprHTML(id, kind, size, fallbackHtml, flip){
  if(castraFsprHas(id, kind)!==true) return fallbackHtml;
  return `<img src="${castraFsprUrl(id, kind)}" width="${size}" height="${size}" alt="" draggable="false" style="image-rendering:pixelated;display:block${flip?";transform:scaleX(-1)":""}">`;
}

/* ---------- tower defence: zes frames per vorm (rust, aanval, geraakt, lopen omlaag/opzij/omhoog) ---------- */
// Eerst alleen td_idle controleren (één mogelijke 404 per vorm zonder sprites); bestaat die, dan de overige frames.
const CASTRA_TD_FRAMES = ["attack","hurt","down","side","up"];
function castraFsprProbeTD(ids, cb){
  castraFsprProbe(ids.map(i=>[i,"td"]).concat(ids.map(i=>[i,"td_idle"])), ()=>{
    const more = []; ids.forEach(i=>{ if(castraFsprHas(i,"td_idle")===true) CASTRA_TD_FRAMES.forEach(f=>more.push([i,"td_"+f])); });
    castraFsprProbe(more, cb);
  });
}
// Frame van een vorm, of de oude losse td-sprite, of fallbackHtml. Het zijaanzicht kijkt naar RECHTS (flip = naar links).
function castraTdFrameHTML(id, frame, size, fallbackHtml, flip){
  if(castraFsprHas(id, "td_"+frame)===true) return castraFsprHTML(id, "td_"+frame, size, fallbackHtml, flip);
  return castraFsprHTML(id, "td", size, fallbackHtml, flip);
}
function castraHasTdFrames(id){ return castraFsprHas(id, "td_down")===true; }

