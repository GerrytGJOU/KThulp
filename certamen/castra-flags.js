/* ============================================================================
   CASTRA HEROUM — FLAGS EN EVENTS (zoals de flags en map scripts van Pokémon, dun gehouden)
   ----------------------------------------------------------------------------
   Het spel bewaart zijn toestand op veel plekken (missies, poorten, opdrachten, gebouwen, voorwerpen, insignia, ...). Deze voorgevel geeft
   daar één ingang voor, zodat nieuwe inhoud er voorwaarden aan kan hangen zonder te weten waar het ergens staat, en zonder bestaande
   code te herschrijven.

   castraFlag(spec) → waar of niet. spec is een tekst "naamruimte:sleutel" of een voorwaarde:
     mission:m3        een tower defence-missie is gewonnen          region:roma      het land is open
     gate:latium|N     de versperring is open                         quest:l_senator  opdracht afgerond (questready:/questactive: ook)
     insignia:graecia  insigne van dat land                          item:amphora     opdrachtvoorwerp bezit
     good:posca        voorwerp in de saccus                          built:puteus     gebouw door de speler gebouwd
     hero:aeneas       held in je heroum                              visited:troia    land bezocht
     phase:nox         dagdeel (aurora, dies, vesper, nox)            lvl:10           Castra-niveau minstens zo hoog
     nundinae          het is marktdag (elke achtste dag)             flag:naam        eigen vlag (castraSetFlag)
     { not:c } { all:[…] } { any:[…] }  combineren
   Een tekst zonder naamruimte is een eigen vlag. Eigen vlaggen staan in CASTRA.flags (alleen wat aan staat).

   CASTRA_EVENTS is de tabel met gebeurtenissen: { id, map ("*" = overal of een wereld-id), on: "enter" | "step" | "interact", at:[x,y] (step),
   target:"entiteit-id" (interact), if: voorwaarde, once: true | "day", block: true (interact: sla het gewone gesprek over), do:[commando's] }.
   Commando's: { say:[{la,nl}], who:{nm,look} }, { toast:["titel","tekst"] }, { give:{aes:10} }, { good:"posca", n:1 }, { flag:"naam", set:true }, { xp:5 }.
   Uitgevoerd wordt er in volgorde; een say wacht tot het gesprek klaar is. Wat al gebeurd is staat in CASTRA.ev = { id: 1 | datum }.
   Entiteiten (CASTRA_WENT) kunnen een voorwaarde `when` hebben: ze bestaan alleen als die waar is (wereldtoestanden, marktkramen).
   Entiteiten met role "say" praten met hun `say`-regels. Laadt NA castra-enc.js en als laatste van de wereldmodules.
   ============================================================================ */
const CASTRA_FLAG_NS = {
  mission:  k=>typeof castraPMissionDone==="function" && castraPMissionDone(k),
  region:   k=>typeof castraRegionOpen==="function" && castraRegionOpen(k),
  gate:     k=>typeof castraGateOpen==="function" && castraGateOpen(k),
  quest:    k=>typeof castraQuestState==="function" && castraQuestState(k)==="COMPLETED",
  questready:  k=>typeof castraQuestState==="function" && castraQuestState(k)==="READY",
  questactive: k=>typeof castraQuestState==="function" && ["ACTIVE","READY"].indexOf(castraQuestState(k))>=0,
  insignia: k=>!!(CASTRA.insignia||{})[k],
  item:     k=>!!(CASTRA.items||{})[k],
  good:     k=>typeof castraBagN==="function" && castraBagN(k)>0,
  built:    k=>typeof castraWBuilt==="function" && castraWBuilt(k),
  hero:     k=>typeof castraHero==="function" && !!castraHero(k),
  visited:  k=>typeof castraGeoVisited==="function" && castraGeoVisited(k),
  phase:    k=>typeof castraDayPhase==="function" && castraDayPhase().id===k,
  lvl:      k=>typeof castraPLevel==="function" && castraPLevel()>=(parseInt(k,10)||0),
  flag:     k=>!!(CASTRA.flags||{})[k],
  nundinae: ()=>typeof castraNundinae==="function" && castraNundinae().on,
};
const CASTRA_FLAG_UNKNOWN = {};
function castraFlag(spec){
  if(spec===undefined || spec===null || spec===true) return true;
  if(spec===false) return false;
  if(typeof spec==="object"){
    if(spec.not!==undefined) return !castraFlag(spec.not);
    if(spec.all) return spec.all.every(castraFlag);
    if(spec.any) return spec.any.some(castraFlag);
    return false;
  }
  const s = String(spec), i = s.indexOf(":"), ns = i<0 ? s : s.slice(0,i), key = i<0 ? "" : s.slice(i+1);
  if(i<0 && !CASTRA_FLAG_NS[ns]) return CASTRA_FLAG_NS.flag(s);                 // een eigen vlag zonder naamruimte
  const f = CASTRA_FLAG_NS[ns];
  if(!f){ CASTRA_FLAG_UNKNOWN[ns] = 1; return false; }
  try{ return !!f(key); }catch(e){ return false; }
}
function castraSetFlag(name, on){ const f = CASTRA.flags || (CASTRA.flags = {}); if(on===false) delete f[name]; else f[name] = 1; castraSave(); }
function castraFlagsAll(){ return { ...(CASTRA.flags||{}) }; }

/* ---------- events ---------- */
const CASTRA_EVENTS = [];
function castraEvOnce(e){ if(!e.once) return true; const s = (CASTRA.ev||{})[e.id]; return e.once==="day" ? s!==castraWDay() : !s; }
function castraEvMark(e){ if(!e.once) return; (CASTRA.ev || (CASTRA.ev = {}))[e.id] = e.once==="day" ? castraWDay() : 1; }
function castraEvRun(cmds, i){
  i = i||0; if(!cmds || i>=cmds.length) return;
  const c = cmds[i], next = ()=>castraEvRun(cmds, i+1);
  if(c.say){ if(typeof castraLatSay==="function" && !CASTRA_DLG){ const who = c.who || { nm:"", look:null }; castraLatSay(who.nm, who.look, c.say, next); return; } }
  else if(c.toast){ if(typeof toast==="function") toast(c.toast[0], c.toast[1]); }
  else if(c.give){ const t = castraWGive(c.give); if(typeof toast==="function") toast("🎁", t); }
  else if(c.good){ castraBagAdd(c.good, c.n||1); const g = CASTRA_GOODS[c.good]; if(g && typeof toast==="function") toast(g.icon+" "+g.la, "Je saccus is gevuld."); }
  else if(c.flag){ castraSetFlag(c.flag, c.set!==false); }
  else if(c.xp){ if(typeof castraPxpAdd==="function") castraPxpAdd(c.xp); }
  next();
}
// Voert de passende gebeurtenissen uit; geeft true als er een met block is uitgevoerd.
function castraEvFire(map, on, x, y, target){
  let blocked = false, fired = false;
  CASTRA_EVENTS.forEach(e=>{
    if(e.on!==on || !(e.map==="*" || e.map===map)) return;
    if(e.at && (e.at[0]!==x || e.at[1]!==y)) return;
    if(e.target && e.target!==target) return;
    if(e.if!==undefined && !castraFlag(e.if)) return;
    if(!castraEvOnce(e)) return;
    fired = true; castraEvMark(e); castraEvRun(e.do); if(e.block) blocked = true;
  });
  if(fired) castraSave();
  return blocked;
}

/* ---------- haken in de wereld ---------- */
const _castraWorldRenderFlg0 = castraWorldRender;
castraWorldRender = function(){
  const r = _castraWorldRenderFlg0.apply(this, arguments), rid = CASTRA_W_REGION;
  setTimeout(()=>{ if(el("cwMap") && CASTRA_W_REGION===rid) try{ castraEvFire(rid, "enter"); }catch(e){ console.error(e); } }, 700);
  return r;
};
const _castraWorldSavePosFlg0 = castraWorldSavePos;
castraWorldSavePos = function(x, y){ _castraWorldSavePosFlg0.apply(this, arguments); try{ castraEvFire(CASTRA_W_REGION, "step", x, y); }catch(e){ console.error(e); } };
const _castraWEntVisibleFlg0 = castraWEntVisible;
castraWEntVisible = function(e){ if(e.when!==undefined && !castraFlag(e.when)) return false; return _castraWEntVisibleFlg0(e); };
const _castraNpcTalkFlg0 = castraNpcTalk;
castraNpcTalk = function(id){
  id = String(id);
  if(id.indexOf("w:")===0){
    const e = CASTRA_WENT.find(x=>"w:"+x.id===id);
    if(e){
      try{ if(castraEvFire(e.region, "interact", null, null, e.id)) return; }catch(err){ console.error(err); }
      if(e.role==="say" && e.say){ if(!CASTRA_DLG) castraLatSay(e.nm, castraWLook(e), e.say); return; }
    }
  }
  return _castraNpcTalkFlg0.apply(this, arguments);
};
