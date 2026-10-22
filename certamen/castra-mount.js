/* ============================================================================
   CASTRA HEROUM — HET PAARD (rijden in de wereld)
   ----------------------------------------------------------------------------
   Het paard verdien je met de opdracht "Equus perditus" (castra-sidequests.js, vanaf Castra-niveau 10 en na
   missie 3): zoek het verdwaalde paard van de koopman, praat met de bouwer en verslaag vijanden op de weg.
   Daarna staat linksboven in de wereld een knop 🐎: aan = je zit te paard (je loopt twee keer zo snel en het
   paard staat onder je avatar), uit = te voet. Binnen (huizen, grotten) loop je altijd te voet.
   Opslag: CASTRA.mount = { owned:1, on:0|1 }. Snelheid: CASTRA_W_UI.speedMs (170 ms per stap te voet, 85 te paard).
   Laadt NA castra-wanderers.js (gebruikt castraSheetHTML) en castra-world.js.
   ============================================================================ */
const CASTRA_MOUNT = { footMs:170, horseMs:85, sheet:{ f:"Nature.png", i:3 } };
function castraMountOwned(){ return !!(CASTRA && CASTRA.mount && CASTRA.mount.owned); }
function castraMountOn(){ return castraMountOwned() && !!CASTRA.mount.on && !castraWorldCfg().interior; }
function castraMountSync(){
  const on = castraMountOn(), ms = on ? CASTRA_MOUNT.horseMs : CASTRA_MOUNT.footMs, t = (ms*0.94/1000).toFixed(3)+"s";
  CASTRA_W_UI.speedMs = ms;
  const av = el("cwAv"), map = el("cwMap"); if(av) av.style.transition = `left ${t} linear,top ${t} linear`; if(map) map.style.transition = `transform ${t} linear`;
  const wrap = el("cwWrap"); if(!wrap) return;
  let b = el("cwMount");
  if(!b){
    b = document.createElement("button"); b.id = "cwMount"; b.setAttribute("aria-label", "Paard");
    b.style.cssText = "position:absolute;top:6px;left:6px;z-index:60;min-width:44px;min-height:44px;font-size:22px;line-height:1;cursor:pointer;font-family:inherit;border:3px solid var(--parch-edge,#4a3416);border-radius:8px;box-shadow:0 0 0 2px var(--parch-gold,#c9a24a);color:var(--parch-ink,#2b1d0e)";
    b.onclick = ev=>{ ev.stopPropagation(); castraMountToggle(); }; b.onpointerdown = ev=>ev.stopPropagation();
    wrap.appendChild(b);
  }
  const show = castraMountOwned() && !castraWorldCfg().interior;
  b.style.display = show ? "block" : "none"; b.textContent = on ? "🐎" : "🚶";
  b.title = on ? "Je rijdt (tik om af te stappen)" : "Te voet (tik om te paard te gaan)";
  b.style.background = on ? "linear-gradient(#e8c96a,#d4af37)" : "linear-gradient(var(--parch,#efe1b9),var(--parch2,#e4d2a1))";
}
function castraMountToggle(){
  if(!castraMountOwned()) return;
  if(castraWorldCfg().interior){ toast("🐎", "Binnen loop je altijd te voet."); return; }
  CASTRA.mount.on = CASTRA.mount.on ? 0 : 1; castraSave(); castraWorldAvatar();
  toast(CASTRA.mount.on ? "🐎 Equus" : "🚶 Pedes", CASTRA.mount.on ? "Je rijdt: je gaat twee keer zo snel." : "Je loopt weer te voet.");
}
// De avatar te paard: het paard eronder (zelfde richting en looptakt), de ruiter iets kleiner en hoger.
const _castraWorldAvatarMt0 = castraWorldAvatar;
castraWorldAvatar = function(){
  _castraWorldAvatarMt0();
  try{
    const av = el("cwAv"); if(!av) return;
    if(castraMountOn() && typeof castraSheetHTML==="function"){
      const rider = av.innerHTML;
      av.innerHTML = `<div style="position:absolute;left:0;top:6px">${castraSheetHTML(CASTRA_MOUNT.sheet, CASTRA_W_UI.dir, CASTRA_W_UI.frame, 48)}</div>
        <div style="position:absolute;left:0;top:-14px;width:48px;height:48px;transform:scale(.82);transform-origin:50% 100%">${rider}</div>`;
    }
    castraMountSync();
  }catch(e){ console.error(e); }
};
Object.assign(CASTRA_GLOSS, { "fugit":"loopt weg", "quaere":"zoek", "equum":"paard (4e naamval)", "fabrum":"bouwer (4e naamval)", "dabo":"ik zal geven", "redit":"keert terug", "frenum":"tuig, teugel", "novum":"nieuwe", "paravi":"ik heb gemaakt",
  "do":"ik geef", "mercatorem":"koopman (4e naamval)", "celeriter":"snel", "equitare":"rijden", "potes":"je kunt", "roga":"vraag" });
