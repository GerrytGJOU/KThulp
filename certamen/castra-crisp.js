/* ============================================================================
   CASTRA HEROUM — SCHERPE SPRITES BIJ ELKE GROOTTE
   ----------------------------------------------------------------------------
   Sprites worden getekend met image-rendering:pixelated (harde pixels). Dat is mooi als een bestand OPGESCHAALD wordt, maar
   geeft gekartelde, flikkerende randen als een groot bestand VERKLEIND wordt (bijvoorbeeld een td-sprite van 96 px op een
   telefoon waar hij 38 px breed is). Daarom kiest dit per afbeelding: wordt hij verkleind (meer bestandspixels dan
   schermpixels), dan zacht tekenen; anders harde pixels. De keuze volgt de echte weergavegrootte (inclusief schaal en
   scherpte van het scherm). Geldt voor alle sprites in assets/sprites-forms/. Laadt vroeg; werkt via een load-luisteraar.
   ============================================================================ */
function castraCrispFix(im){
  try{
    if(!im || im.tagName!=="IMG" || String(im.src).indexOf("/sprites-forms/")<0 || !im.naturalWidth) return;
    const r = im.getBoundingClientRect(); if(!r.width) return;
    const dpr = window.devicePixelRatio || 1, down = im.naturalWidth > r.width*dpr*1.08;
    im.style.imageRendering = down ? "auto" : "pixelated";
  }catch(_){}
}
document.addEventListener("load", e=>{ castraCrispFix(e.target); }, true);
// Na een schaalverandering (venster, volledig scherm) de zichtbare sprites opnieuw beoordelen.
let _castraCrispT = null;
window.addEventListener("resize", ()=>{ clearTimeout(_castraCrispT); _castraCrispT = setTimeout(()=>{ document.querySelectorAll('img[src*="/sprites-forms/"]').forEach(castraCrispFix); }, 200); });
