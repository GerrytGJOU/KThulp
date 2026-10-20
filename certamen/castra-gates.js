/* ============================================================================
   CASTRA HEROUM — VERSPERDE DOORGANGEN (POORTWACHTERS, OMGEVALLEN BOMEN, ...)
   ----------------------------------------------------------------------------
   Is de weg naar een volgende regio nog dicht, dan staat er iets in de weg dat in het
   verhaal uitlegt waarom (poortwachters, een omgevallen boom, een steenlawine, een
   zandstorm). Spreek het aan: je krijgt een kort Latijns gesprek (met vertaling) en
   hoort welke missie je eerst moet winnen. Zodra die gewonnen is, is de weg vrij en
   verdwijnt het obstakel; bij je eerstvolgende bezoek aan die regio zie je een korte
   slotscène over hoe het opgelost werd.
   Eén obstakel = twee tegels (de binnenkant van de poort), solide, dus fysiek dicht.
   Opslag: CASTRA.gateSeen { "regio|richting": true } voor al verteld.
   Laadt NA castra-colosseum.js (laatste wereldmodule).
   ============================================================================ */

// Per verbinding (regio waar het obstakel staat | richting): soort, wie het zegt, Latijn + vertaling.
// kind: guard (wachters) | tree | rocks | sand. Doelnaam en vereiste missie komen uit CASTRA_GEO en CASTRA_REGION_NEEDS.
const CASTRA_GATEKEEP = {
  "latium|N":  { kind:"guard", nm:"Custodes urbis", pre:{ la:"Roma clausa est! Hostes Ardeam obsident.", nl:"Rome is gesloten! Vijanden belegeren Ardea. De stadswachten laten niemand binnen zolang het leger bij Ardea in nood is." },
                 done:{ la:"Ardea defensa est! Roma tibi patet.", nl:"Ardea is verdedigd! De wachters stappen opzij: Rome staat voor je open." } },
  "latium|W":  { kind:"tree",  nm:"Viator", pre:{ la:"Arbor magna viam claudit.", nl:"Een enorme eik is tijdens de storm op de weg naar Gallië gevallen. Alleen sterke mannen, zoals de gladiatoren uit de arena van Rome, kunnen hem wegslepen." },
                 done:{ la:"Gladiatores arborem removerunt. Via aperta est!", nl:"De gladiatoren hebben de boom weggesleept. De weg naar Gallië is vrij!" } },
  "gallia|N":  { kind:"guard", nm:"Custodes limitis", pre:{ la:"Limes clausus est. Germani feroces sunt.", nl:"De grens met Germanië is gesloten. De Germanen zijn woest; de wachters houden de grens dicht tot Gallië veilig is." },
                 done:{ la:"Alesia victa est. Limes apertus est!", nl:"Alesia is gevallen en Gallië is veilig. De wachters openen de grens naar Germanië." } },
  "graecia|S": { kind:"rocks", nm:"Viator", pre:{ la:"Saxa viam ad Laconiam claudunt.", nl:"Na een aardbeving ligt de weg naar Laconië vol rotsblokken. Pas als het monster van het labyrint verslagen is, durven de steenhouwers eraan te beginnen." },
                 done:{ la:"Saxa remota sunt. Via aperta est!", nl:"De steenhouwers hebben de rotsblokken weggehaald. De weg naar Laconië is vrij!" } },
  "graecia|E": { kind:"guard", nm:"Custodes pontis", pre:{ la:"Pons clausus est. Spartam prius adiuva!", nl:"De brug naar Troje is dicht. De wachters zeggen: hulp eerst bij Sparta, daarna mag je door." },
                 done:{ la:"Sparta servata est. Pons apertus est!", nl:"Sparta is gered. De wachters laten de brug zakken: de weg naar Troje is open." } },
  "troia|N":   { kind:"guard", nm:"Amazones", pre:{ la:"Themiscyra clausa est. Equus ligneus Troiam cepit.", nl:"De Amazones bewaken de bosweg naar Themiscyra. Zolang Troje door het houten paard bedreigd wordt, laten ze niemand door." },
                 done:{ la:"Troia servata est. Themiscyra patet!", nl:"Troje is gered. De Amazones laten hun speren zakken: Themiscyra staat voor je open." } },
  "troia|E":   { kind:"guard", nm:"Custodes Persae", pre:{ la:"Persis clausa est. Hippolytam prius adiuva!", nl:"De Perzische wachters sluiten de oostelijke weg. Eerst moet de koningin van de Amazones geholpen zijn." },
                 done:{ la:"Hippolyta adiuta est. Persis patet!", nl:"De koningin van de Amazones is geholpen. De Perzische wachters laten je door." } },
  "troia|S":   { kind:"sand",  nm:"Viator", pre:{ la:"Tempestas harenae viam ad Aegyptum claudit.", nl:"Een zandstorm blokkeert de kustweg naar Egypte. Ze gaat pas liggen als het Perzische hart verslagen is." },
                 done:{ la:"Tempestas quievit. Via aperta est!", nl:"De zandstorm is gaan liggen. De weg naar Egypte is vrij!" } },
  "aegyptus|W":{ kind:"guard", nm:"Custodes Aegyptii", pre:{ la:"Africa clausa est. Pyramides prius vince!", nl:"De Egyptische wachters houden de kustweg naar Afrika dicht tot de piramiden veilig zijn." },
                 done:{ la:"Pyramides tutae sunt. Africa patet!", nl:"De piramiden zijn veilig. De wachters openen de kustweg naar Afrika." } },
};
const CASTRA_GATEKEEP_PIECES = { tree:["logs","stump"], rocks:["rock_grey","rock_brown"], sand:["rock_brown","stones"] };

/* ---------- registratie van de obstakels als wereldentiteiten ---------- */
function castraGateTiles(rid, dir){
  const W = CASTRA_WORLDS[rid];
  return castraGeoGateTiles(rid, dir).map(t=> dir==="N" ? { x:t.x, y:1 } : dir==="S" ? { x:t.x, y:W.rows-2 } : dir==="W" ? { x:1, y:t.y } : { x:W.cols-2, y:t.y });
}
(function(){
  Object.keys(CASTRA_GATEKEEP).forEach(key=>{
    const [rid, dir] = key.split("|"), to = CASTRA_GEO[rid].links[dir];
    castraGateTiles(rid, dir).forEach((t,i)=>CASTRA_WENT.push({ id:"blk_"+rid+"_"+dir+"_"+i, region:rid, kind:"block", key, to, x:t.x, y:t.y, dir: ({N:"down",S:"up",W:"right",E:"left"})[dir] }));
  });
})();
function castraGateOpen(key){ const k = CASTRA_GATEKEEP[key]; if(!k) return true; const [rid,dir] = key.split("|"); return castraRegionOpen(CASTRA_GEO[rid].links[dir]); }
function castraGateFolkLook(to){
  const fo = (CASTRA_FOLKS[(CASTRA_WREG[to]||{}).folk||"rom"]||CASTRA_FOLKS.rom).look||{};
  return { huid:fo.huid||"licht", haar:fo.haar||"kort", haarkleur:fo.haarkleur||"bruin", baard:"geen", cape:"geen", helm:"standaard", schild:"rond", wapen:"speer", armor:"middel" };
}
const _castraWEntVisibleGate0 = castraWEntVisible;
castraWEntVisible = function(e){ if(e.kind==="block") return !castraGateOpen(e.key); return _castraWEntVisibleGate0(e); };
const _castraWobjPiecesGate0 = castraWobjPieces;
castraWobjPieces = function(rid){
  const out = _castraWobjPiecesGate0(rid);
  Object.keys(CASTRA_GATEKEEP).filter(k=>k.split("|")[0]===rid).forEach(key=>{
    const G = CASTRA_GATEKEEP[key]; if(G.kind==="guard" || castraGateOpen(key)) return;
    const [r,dir] = key.split("|"), pc = CASTRA_GATEKEEP_PIECES[G.kind];
    castraGateTiles(r, dir).forEach((t,i)=>out.push({ o:pc[i%2], x:t.x, y:t.y }));
  });
  return out;
};
const _castraWobjSpotsGate0 = castraWobjSpots;
castraWobjSpots = function(rid){
  const out = _castraWobjSpotsGate0(rid);
  Object.keys(CASTRA_GATEKEEP).filter(k=>k.split("|")[0]===rid).forEach(key=>{ const [r,dir] = key.split("|"); castraGateTiles(r, dir).forEach(t=>out.push([t.x,t.y])); });
  return out;
};
const _castraWobjDrawGate0 = castraWobjDraw;
castraWobjDraw = function(){
  _castraWobjDrawGate0();
  const box = el("cwWobj"); if(!box) return;
  const html = castraWEnts().filter(e=>e.kind==="block" && castraWEntVisible(e)).map(e=>{
    const G = CASTRA_GATEKEEP[e.key], pos = `position:absolute;left:${e.x*48}px;top:${e.y*48}px;width:48px;height:48px;pointer-events:none;z-index:4;`;
    return G.kind==="guard" ? `<div style="${pos}">${castraAvatarHTML(castraGateFolkLook(e.to), e.dir, 1, 48)}</div>` : `<div style="${pos}"></div>`;
  }).join("");
  if(html) box.insertAdjacentHTML("beforeend", html);
};

/* ---------- aanspreken: het verhaal erachter ---------- */
const _castraNpcTalkGate0 = castraNpcTalk;
castraNpcTalk = function(id){
  id = String(id);
  if(id.indexOf("w:blk_")===0){ const e = CASTRA_WENT.find(x=>"w:"+x.id===id); if(e) castraGateTalk(e); return; }
  return _castraNpcTalkGate0(id);
};
function castraGateTalk(e){
  if(CASTRA_DLG) return;
  const G = CASTRA_GATEKEEP[e.key], need = CASTRA_P_MISSIONS.find(m=>m.id===CASTRA_REGION_NEEDS[e.to]), nm = castraGeoName(e.to);
  const speaker = { nm:G.nm, look: G.kind==="guard" ? castraGateFolkLook(e.to) : { huid:"licht", haar:"kort", haarkleur:"bruin", baard:"baard", cape:"geen", helm:"geen", schild:"geen", wapen:"geen", armor:"vodden" } };
  const lines = [ G.pre,
    { la:`Prius ${need?need.nm:"…"} vince, dux {naam}!`, nl:`Win eerst de missie "${need?need.nm+" — "+need.nl:"…"}" om ${nm} te openen, leider {naam}.` } ];
  castraDlgOpen(speaker, lines, null);
}
// Slotscène: de eerste keer dat je een regio bezoekt waarvan een doorgang net vrij is gekomen.
const _castraWorldRenderGate0 = castraWorldRender;
castraWorldRender = function(){
  _castraWorldRenderGate0();
  setTimeout(castraGateStory, 700);
};
function castraGateStory(){
  if(CASTRA_DLG || !document.getElementById("cwMap")) return;
  const rid = CASTRA_W_REGION, seen = CASTRA.gateSeen || (CASTRA.gateSeen = {});
  for(const key of Object.keys(CASTRA_GATEKEEP).filter(k=>k.split("|")[0]===rid)){
    if(seen[key] || !castraGateOpen(key)) continue;
    seen[key] = true; castraSave();
    const to = CASTRA_GEO[rid].links[key.split("|")[1]];
    if(castraGeoVisited(to)) continue;                 // al eerder doorgelopen: geen slotscène meer
    const G = CASTRA_GATEKEEP[key];
    castraDlgOpen({ nm:G.nm, look: G.kind==="guard" ? castraGateFolkLook(to) : { huid:"licht", haar:"kort", haarkleur:"bruin", baard:"baard", cape:"geen", helm:"geen", schild:"geen", wapen:"geen", armor:"vodden" } },
      [ G.done, { la:"Gratias tibi ago, dux {naam}!", nl:"Dank je wel, leider {naam}!" } ], null);
    return;
  }
}
