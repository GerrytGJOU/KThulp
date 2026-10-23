/* ============================================================================
   CASTRA HEROUM — DAG EN NACHT (naar de echte klok, zoals in Pokémon Gold en Silver)
   ----------------------------------------------------------------------------
   Vier momenten op de dag, naar de lokale tijd: Aurora (06-08, dageraad), Dies (08-18, dag), Vesper (18-21, avond) en
   Nox (21-06, nacht). Effect:
   - sfeer: een zachte kleurlaag over kamp en wereld (warm bij Aurora en Vesper, donkerblauw bij Nox) en een chipje in de
     balk met Latijnse naam en icoon; ook de achtergrond van het jachtgevecht wordt 's nachts donkerder;
   - vijanden: 's nachts verschijnen vaker mythische wezens en zijn wilde vijanden iets sterker (+2 gradus); bij Vesper
     is dat een klein beetje; overdag verandert er niets;
   - Latijn: dies, nox, vesper en aurora komen zo vanzelf voorbij.
   Testen: zet CASTRA_PHASE_FORCE op "aurora", "dies", "vesper" of "nox". Laadt NA castra-stage.js en castra-vscene.js.
   ============================================================================ */
let CASTRA_PHASE_FORCE = null;
const CASTRA_PHASES = {
  aurora: { id:"aurora", la:"Aurora", nl:"dageraad", icon:"🌅", tint:"rgba(255,205,160,.30)", myth:0.05, lvl:0 },
  dies:   { id:"dies",   la:"Dies",   nl:"dag",      icon:"☀️", tint:null,                    myth:0,    lvl:0 },
  vesper: { id:"vesper", la:"Vesper", nl:"avond",    icon:"🌇", tint:"rgba(255,160,90,.42)",  myth:0.12, lvl:1 },
  nox:    { id:"nox",    la:"Nox",    nl:"nacht",    icon:"🌙", tint:"rgba(55,75,150,.62)",   myth:0.38, lvl:2 },
};
function castraDayPhase(){
  if(CASTRA_PHASE_FORCE && CASTRA_PHASES[CASTRA_PHASE_FORCE]) return CASTRA_PHASES[CASTRA_PHASE_FORCE];
  const h = new Date().getHours();
  return h>=6 && h<8 ? CASTRA_PHASES.aurora : h>=8 && h<18 ? CASTRA_PHASES.dies : h>=18 && h<21 ? CASTRA_PHASES.vesper : CASTRA_PHASES.nox;
}

/* ---------- sfeer in kamp en wereld ---------- */
function castraDaynApply(){
  const stage = document.getElementById("castraStage"); if(!stage) return;
  const P = castraDayPhase(), wrap = el("cwWrap") || el("castraWrap");
  if(wrap){
    let ov = document.getElementById("cgTint");
    if(!ov){ ov = document.createElement("div"); ov.id = "cgTint"; ov.style.cssText = "position:absolute;inset:0;z-index:20;pointer-events:none;mix-blend-mode:multiply;transition:background 1.5s"; wrap.appendChild(ov); }
    ov.style.background = P.tint || "transparent";
    if(P.id==="nox") ov.style.boxShadow = "inset 0 0 120px 30px rgba(5,10,40,.55)"; else ov.style.boxShadow = "none";
  }
  const title = document.getElementById("cgTitle");
  if(title){
    let c = document.getElementById("cgPhase");
    if(!c){ c = document.createElement("span"); c.id = "cgPhase"; c.style.cssText = "flex:0 0 auto;font-size:13px;padding:2px 8px;border-radius:12px;background:rgba(255,255,255,.1);color:var(--hi-bright,#e8c96a);white-space:nowrap"; title.insertAdjacentElement("afterend", c); }
    const t = P.icon+" "+P.la; if(c.textContent!==t){ c.textContent = t; c.title = P.nl; }
  }
}
const _castraStageBuildDn0 = castraStageBuild;
castraStageBuild = function(kind){
  _castraStageBuildDn0.apply(this, arguments);
  try{ castraDaynApply(); }catch(e){ console.error(e); }
  const t = setInterval(()=>{ if(!document.getElementById("castraStage")){ clearInterval(t); return; } try{ castraDaynApply(); }catch(_){} }, 30000);
};

/* ---------- vijanden: 's nachts meer mythische wezens ---------- */
const _castraWildPickDn0 = castraWildPick;
castraWildPick = function(reg, terrain, rng){
  const pick = _castraWildPickDn0.apply(this, arguments), P = castraDayPhase();
  if(!P.myth || !pick || !pick.form) return pick;
  if(rng() >= P.myth) return { ...pick, lvl:pick.lvl + P.lvl, night:P.id };                // gewone vijand, nacht maakt hem iets sterker
  const t = pick.form.tier || 1, pool = CASTRA_FORM_LIST.filter(f=>f.volk==="myt" && Math.abs((f.tier||1)-t)<=1);
  if(!pool.length) return pick;
  return { form: pool[Math.floor(rng()*pool.length)], lvl:pick.lvl + P.lvl, night:P.id };
};
const _castraMakeEncounterDn0 = castraMakeEncounter;
castraMakeEncounter = function(){ const E = _castraMakeEncounterDn0.apply(this, arguments); try{ E.phase = castraDayPhase().id; }catch(_){} return E; };

/* ---------- het gevecht 's nachts donkerder ---------- */
const _castraVSceneHTMLDn0 = castraVSceneHTML;
castraVSceneHTML = function(){
  const html = _castraVSceneHTMLDn0.apply(this, arguments), P = castraDayPhase();
  if(!P.tint) return html;
  return html.replace('<div class="cbg"></div>', '<div class="cbg"></div><div style="position:absolute;inset:0;background:'+P.tint+';mix-blend-mode:multiply;pointer-events:none"></div>');
};

Object.assign(CASTRA_GLOSS, { "aurora":"dageraad", "dies":"dag", "vesper":"avond", "nox":"nacht" });
