/* ============================================================================
   CASTRA HEROUM — LATIJNSE AANWIJZINGEN BIJ NIEUWE VIJANDEN
   ----------------------------------------------------------------------------
   Bij de eerste ontmoeting van een vijandrol (uitlegvenster, het spel pauzeert) staat
   eerst alleen de Latijnse zin met tikbare woorden. De leerling beantwoordt een korte
   vraag over wat de zin betekent; daarna volgen de Nederlandse uitleg en de tip.
   "Toon uitleg" slaat de vraag over zonder gevolgen. Een goed antwoord geeft 1 extra
   energie voor bevelen (alleen waar bevelen aan staan); fout of overslaan kost niets,
   taal blokkeert dus nooit het spel.
   Meetpunten (anoniem per klas): classAnalyticsCastraTD clue_<rol>/{ok,bad,help,skip}.
   De uitleg in de knop ⓘ van het gevecht (castraBInfo) blijft altijd volledig Nederlands.
   Laadt NA castra-roles.js en castra-metrics.js.
   ============================================================================ */

const CASTRA_CLUES = {
  velox:     { opts:["Een snelle maar zwakke vijand", "Een trage, sterke vijand", "Een vijand die anderen geneest"], ans:0 },
  gravis:    { opts:["Een trage maar sterke vijand", "Een snelle, zwakke vijand", "Een vijand die anderen beschermt"], ans:0 },
  scutarius: { opts:["Hij beschermt zijn kameraden", "Hij valt zijn kameraden aan", "Hij loopt weg van het pad"], ans:0 },
  medicus:   { opts:["Hij geneest zijn kameraden", "Hij beschermt zijn kameraden", "Hij is heel snel"], ans:0 },
};
function castraClueState(id){
  const B = CASTRA_B, all = B.clue || (B.clue = {});
  if(!all[id]){ const idx = CASTRA_CLUES[id].opts.map((_,i)=>i).sort(()=>Math.random()-0.5); all[id] = { order:idx, picked:null, shown:false }; }
  return all[id];
}
function castraClueBlock(id){
  const C = CASTRA_CLUES[id], D = CASTRA_P_ROLES[id], S = castraClueState(id);
  const expl = `<div style="font-size:15px;margin-top:6px">${esc(D.ex.nl)}</div>${D.ex.tip?`<div style="font-size:14px;margin-top:6px;opacity:.9">${esc(D.ex.tip)}</div>`:""}`;
  if(S.picked!==null){
    const ok = S.picked===C.ans;
    return `<div style="font-size:15px;margin-top:6px;font-weight:bold">${ok?"Recte! Je las het goed."+(S.bonus?" ⚡ +1 energie voor bevelen.":""):"Bijna. Zo zit het:"}</div>${expl}`;
  }
  if(S.shown) return expl;
  const btn = "display:block;width:100%;margin:4px 0;min-height:44px;font-size:15px;text-align:left;font-family:inherit;cursor:pointer;background:var(--parch2,#e9d9ac);color:var(--parch-ink,#2b1d0e);border:2px solid var(--parch-edge,#4a3416);border-radius:8px;padding:6px 10px";
  return `<div style="font-size:14px;margin-top:6px">Wat betekent deze zin? <small style="opacity:.7">(tik op een woord of ⓘ voor hulp)</small></div>
    ${S.order.map(i=>`<button style="${btn}" onclick="castraCluePick('${id}',${i})">${esc(C.opts[i])}</button>`).join("")}
    <button style="${btn};min-height:36px;font-size:13px;opacity:.8" onclick="castraClueShow('${id}')">Ik weet het niet, toon de uitleg</button>`;
}
function castraClueCard(it, D, single){
  if(!CASTRA_CLUES[it.id]) return null;
  return `<div style="margin:8px 0;padding-bottom:6px;${single?"":"border-bottom:1px solid rgba(138,109,47,.4)"}">
    <div style="font-size:20px;font-weight:bold;margin-bottom:4px">${D.icon} ${esc(D.la)}</div>
    <div style="font-size:18px">${castraLaHTML(D.ex.la, D.ex.nl, "intro_role_"+it.id)}</div>
    <div id="cq_${it.id}">${castraClueBlock(it.id)}</div></div>`;
}
function castraClueRefresh(id){ const n = document.getElementById("cq_"+id); if(n) n.innerHTML = castraClueBlock(id); }
function castraCluePick(id, i){
  const S = castraClueState(id), C = CASTRA_CLUES[id]; if(S.picked!==null) return;
  S.picked = i; const ok = i===C.ans;
  if(ok && CASTRA_B.sim.cmdOn && typeof CASTRA_P_CMD!=="undefined"){ CASTRA_B.sim.energy = Math.min(CASTRA_P_CMD.energyMax, CASTRA_B.sim.energy+1); S.bonus = true; }
  castraTDSync({ ["clue_"+id+"/"+(ok?"ok":"bad")]:1 });
  castraClueRefresh(id);
}
function castraClueShow(id){ const S = castraClueState(id); if(S.picked!==null || S.shown) return; S.shown = true; castraTDSync({ ["clue_"+id+"/help"]:1 }); castraClueRefresh(id); }
// Overgeslagen: het uitlegvenster is dichtgetikt zonder antwoord of uitleg.
if(typeof castraBIntroClose==="function"){
  const _closeClue0 = castraBIntroClose;
  castraBIntroClose = function(mark){
    try{
      const o = document.getElementById("cbIntro"), cur = o && o._cur;
      if(mark && cur && CASTRA_B) (Array.isArray(cur)?cur:[cur]).forEach(it=>{ if(it.k==="role" && CASTRA_CLUES[it.id]){ const S = castraClueState(it.id); if(S.picked===null && !S.shown){ S.shown = true; castraTDSync({ ["clue_"+it.id+"/skip"]:1 }); } } });
    }catch(e){}
    return _closeClue0(mark);
  };
}
