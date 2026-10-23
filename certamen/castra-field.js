/* ============================================================================
   CASTRA HEROUM — VELDACTIES PER KLASSE EN VERSPERRINGEN (zoals de HM's in Pokémon)
   ----------------------------------------------------------------------------
   De regio's waren grote open vlakten. Nu zitten er twee heggen van bomen of struiken dwars over de kaart (poort 1 op
   ongeveer twee derde van de hoogte, poort 2 op ongeveer een derde), elk met één opening op de weg, en in die
   opening staat een versperring. Zo ontstaan drie stukken: het startgebied (kamp en bouwplaats), het midden (de
   kruising met de grotten en huizen) en het noorden (de uitgang naar een volgend land). Een versperring ruim je op met
   een eenheid van de juiste klasse in je leger (soldaat of held):
     saxum 🪨      hopliet of spartaan        (breekt de rots)
     arbor 🪵      genie                      (ruimt de boom op)
     ara 🗿        priester of myth           (reinigt het altaar)
     tentorium ⛺  centurio                   (voert de verlaten soldaten aan)
   Heb je die niet, dan kun je arbeiders huren voor grondstoffen, zodat niemand vast komt te zitten. Een opgeruimde
   versperring blijft weg (CASTRA.wgate). Verder staan er per regio vijf dagelijkse veldacties (CASTRA_FPOS): ook die
   vragen een klasse (spoor 👣: verkenner of cavalerie), geven grondstoffen en komen de volgende dag terug (CASTRA.wfield).
   Latium krijgt alleen poort 2 (het tutorial eindigt in het midden). Een versperring telt als een persoon op de kaart
   (blokkeert zijn tegel, aanspreken door ertegenaan te lopen of erop te tikken).
   Laadt NA castra-wobj.js, castra-heroevo-all.js en castra-interiors.js (die de regiogegevens leveren).
   ============================================================================ */
const CASTRA_FIELD_TYPES = {
  saxum:     { icon:"🪨", need:["hopliet","spartaan"], needNl:"hopliet of spartaan",    nm:"Saxum",     gate:true,
               la:"Saxum ingens viam claudit. Miles fortis saxum frangere potest.", nl:"Een enorme rots versperrt de weg. Een sterke soldaat (hopliet of spartaan) kan hem breken.",
               ok:{ la:"saxum frangit! Via aperta est.", nl:"breekt de rots! De weg is open." }, daily:{ aes:[40,90], frumentum:[10,30] } },
  arbor:     { icon:"🪵", need:["genie"], needNl:"genie (bouwer)", nm:"Arbor",
               la:"Arbor cecidit et viam claudit. Faber arborem removere potest.", nl:"Een boom is omgevallen en versperrt de weg. Een genie (bouwer) kan hem wegruimen.",
               ok:{ la:"arborem removet! Via aperta est.", nl:"ruimt de boom op! De weg is open." }, daily:{ lignum:[40,90], aes:[10,30] } },
  ara:       { icon:"🗿", need:["priester","myth"], needNl:"priester of mythisch wezen", nm:"Ara",
               la:"Ara maledicta viam claudit. Sacerdos aram purgare potest.", nl:"Een vervloekt altaar versperrt de weg. Een priester (of mythisch wezen) kan het reinigen.",
               ok:{ la:"aram purgat! Via aperta est.", nl:"reinigt het altaar! De weg is open." }, daily:{ gloria:[1,2], frumentum:[20,50] } },
  tentorium: { icon:"⛺", need:["centurio"], needNl:"centurio (commandant)", nm:"Castra deserta",
               la:"Castra deserta viam claudunt. Centurio milites ducere potest.", nl:"Een verlaten legerplaats versperrt de weg. Een centurio kan de soldaten weer aanvoeren.",
               ok:{ la:"milites ducit! Via aperta est.", nl:"voert de soldaten aan! De weg is open." }, daily:{ frumentum:[40,90], aes:[20,50] } },
  vestigia:  { icon:"👣", need:["verkenner","cavalerie"], needNl:"verkenner of ruiter", nm:"Vestigia",
               la:"Vestigia hic sunt. Explorator ea sequi potest.", nl:"Hier zijn sporen. Een verkenner of ruiter kan ze volgen.",
               ok:{ la:"vestigia sequitur! Thesaurus inventus est.", nl:"volgt de sporen en vindt een schat!" }, daily:{ aes:[30,70], gloria:[1,2] } },
};
const CASTRA_FIELD_GATE_ORDER = ["saxum","arbor","ara","tentorium"];
const CASTRA_FIELD_REGIONS = Object.keys(CASTRA_WORLDS).filter(r=>!CASTRA_WORLDS[r].interior);
const CASTRA_FGATES = {};          // rid -> [{ y, x, type, id }]
// CASTRA_FPOS (dagelijkse veldacties per regio) staat in castra-field-data.js

/* ---------- rijen van de heggen kiezen: nooit op een bestaande persoon, deur, uitgang of horizontale weg ---------- */
function castraFieldRows(rid){
  const W = CASTRA_WORLDS[rid], used = new Set();
  CASTRA_WENT.filter(e=>e.region===rid).forEach(e=>used.add(e.y));
  (W.doors||[]).forEach(d=>used.add(d.y)); (W.exit||[]).forEach(e=>used.add(e.y)); used.add(W.start.y);
  Object.keys(CASTRA_HERO_DATA).forEach(id=>{ const d = CASTRA_HERO_DATA[id]; if(d.region===rid && d.world) used.add(d.world.y); });
  (W.roads||[]).forEach(r=>{ if(r.y1-r.y0 < r.x1-r.x0) for(let y=r.y0;y<=r.y1;y++) used.add(y); });
  const pick = (base)=>{ for(const dy of [0,1,-1,2,-2,3,-3,4,-4,5,-5,6,-6]){ const y = base+dy; if(y>2 && y<W.rows-3 && !used.has(y) && !used.has(y-1)) return y; } return null; };
  return { y1: pick(Math.round(W.rows*0.68)), y2: pick(Math.round(W.rows*0.34)) };
}
(function(){
  CASTRA_FIELD_REGIONS.forEach((rid, ri)=>{
    const W = CASTRA_WORLDS[rid], v = (W.roads||[]).find(r=>r.y1-r.y0 > r.x1-r.x0), gx = v ? v.x0 : Math.floor(W.cols/2), R = castraFieldRows(rid), list = [];
    if(R.y1 && rid!=="latium") list.push({ y:R.y1, x:gx, type:CASTRA_FIELD_GATE_ORDER[ri%4], n:1 });
    if(R.y2) list.push({ y:R.y2, x:gx, type:CASTRA_FIELD_GATE_ORDER[(ri+(rid==="latium"?0:2))%4], n:2 });
    list.forEach(g=>{ g.id = "poort_"+rid+g.n; });
    CASTRA_FGATES[rid] = list;
    list.forEach(g=>CASTRA_WENT.push({ id:g.id, region:rid, kind:"veld", field:g.type, gate:true, x:g.x, y:g.y, nm:CASTRA_FIELD_TYPES[g.type].nm }));
    (CASTRA_FPOS[rid]||[]).forEach((p,i)=>CASTRA_WENT.push({ id:"veld_"+rid+i, region:rid, kind:"veld", field:p[2], x:p[0], y:p[1], nm:CASTRA_FIELD_TYPES[p[2]].nm }));
  });
})();

/* ---------- de heggen in de kaart (afsluiting met één opening: de versperring) ---------- */
const _castraWorldDefFl0 = castraWorldDef;
castraWorldDef = function(){
  const def = _castraWorldDefFl0.apply(this, arguments), rid = CASTRA_W_REGION, gates = CASTRA_FGATES[rid];
  if(!gates || !gates.length) return def;
  const W = castraWorldCfg(), ring = (W.trees||[]).find(t=>!/^tree_[ab]$/.test(t)) || "tree_a";
  gates.forEach(g=>{
    for(let x=1;x<def.cols-1;x++){
      if(x===g.x) continue;                                            // de opening: hier staat de versperring
      if(!def.walls.some(w=>w[0]===x && w[1]===g.y)) def.walls.push([x,g.y]);
      def.pieces.push({ o:ring, x, y:g.y-1, noSolid:true });
    }
  });
  return def;
};

/* ---------- klassen van je leger ---------- */
function castraFieldBaseClass(u){
  try{
    if(u.hero){
      const h = u.h, d = CASTRA_HERO_DATA[h.id], cls = d.cls, E = CASTRA_HERO_EVO[h.id], sp = E && E.specs.find(s=>s.cls===cls);
      return sp ? (sp.skillBase || "boogschutter") : (CASTRA_HERO_CLASS[(d._b||d).type] || null);
    }
    return castraSkillClassOf(u);
  }catch(_){ return null; }
}
function castraFieldUnits(){
  const out = [];
  (CASTRA.heroes||[]).forEach(h=>out.push({ hero:true, h, lvl:h.lvl||1, nm:CASTRA_HERO_DATA[h.id].nm }));
  (CASTRA.soldiers||[]).forEach(s=>{ if(!castraIsHurt(s) && !s.job) out.push({ ...s, lvl:s.lvl||1, nm:castraSoldierName(s), _s:s }); });
  return out;
}
function castraFieldPick(type){
  const need = CASTRA_FIELD_TYPES[type].need;
  return castraFieldUnits().filter(u=>need.indexOf(castraFieldBaseClass(u))>=0).sort((a,b)=>b.lvl-a.lvl)[0] || null;
}

/* ---------- zichtbaar of weg ---------- */
function castraFieldCleared(e){
  if(e.gate) return !!(CASTRA.wgate && CASTRA.wgate[e.id]);
  return (CASTRA.wfield||{})[e.id]===castraWDay();
}
const _castraWEntVisibleFl0 = castraWEntVisible;
castraWEntVisible = function(e){ if(e.kind==="veld") return !castraFieldCleared(e); return _castraWEntVisibleFl0(e); };

/* ---------- aanspreken ---------- */
const _castraNpcTalkFl0 = castraNpcTalk;
castraNpcTalk = function(id){
  if(String(id).indexOf("w:")===0){ const e = CASTRA_WENT.find(x=>"w:"+x.id===id); if(e && e.kind==="veld"){ castraFieldUse(e); return; } }
  return _castraNpcTalkFl0.apply(this, arguments);
};
function castraFieldHireCost(e){ const sc = castraWScale(e.region); return { aes:Math.round(40*sc), lignum:Math.round(20*sc) }; }
function castraFieldReward(e, unit){
  const T = CASTRA_FIELD_TYPES[e.field], rng = castraRng((CASTRA.seed ^ (e.x*7919+e.y*104729))>>>0); CASTRA.seed = (CASTRA.seed+13)>>>0;
  const sc = castraWScale(e.region), res = {};
  Object.keys(T.daily).forEach(r=>{ const a = T.daily[r]; res[r] = r==="gloria" ? castraWRoll(a, rng) : Math.round(castraWRoll(a, rng)*sc*(e.gate?1.5:1)); });
  const txt = castraWGive(res);
  if(e.field==="ara" && typeof castraIsHurt==="function") (CASTRA.soldiers||[]).forEach(s=>{ s.hurtUntil = 0; });   // de reiniging geneest ook je gewonde soldaten
  return txt;
}
function castraFieldClear(e, unit, hired){
  if(e.gate) (CASTRA.wgate || (CASTRA.wgate = {}))[e.id] = 1; else (CASTRA.wfield || (CASTRA.wfield = {}))[e.id] = castraWDay();
  const txt = castraFieldReward(e, unit);
  if(typeof castraPxpAdd==="function") castraPxpAdd(e.gate ? 12 : 6, "Veldactie");
  castraSave(); castraWobjDraw();
  toast(CASTRA_FIELD_TYPES[e.field].icon+" "+(hired?"Arbeiders":unit.nm), (hired?"de weg is open. ":CASTRA_FIELD_TYPES[e.field].ok.nl+" ")+txt);
}
function castraFieldUse(e){
  if(CASTRA_DLG) return;
  const T = CASTRA_FIELD_TYPES[e.field], unit = castraFieldPick(e.field), cost = castraFieldHireCost(e);
  const look = { huid:"licht", haar:"kort", haarkleur:"bruin", baard:"geen", armor:"vodden", cape:"geen", capekleur:"rood", helm:"geen", schild:"geen", wapen:"zwaard" };
  const lines = [ { la:T.la, nl:T.nl } ];
  const canHire = e.gate && castraCanPay(cost);
  if(unit){
    lines.push({ la:unit.nm+" adest. Opus incipit?", nl:unit.nm+" is aanwezig ("+T.needNl+"). Beginnen?", opts:[ CASTRA_DQ_YES, CASTRA_DQ_NO ] });
    castraLatSay(T.nm+" "+T.icon, look, lines, k=>{ if(k===0) castraFieldClear(e, unit, false); });
  } else {
    const costTxt = Object.keys(cost).map(r=>cost[r]+" "+r).join(" + ");
    const opts = canHire ? [ { la:"Operarios conduco", nl:"Huur arbeiders ("+costTxt+")" }, CASTRA_DQ_NO ] : null;
    lines.push({ la:"Nemo adest.", nl:"Je hebt nu geen "+T.needNl+" in je leger"+(e.gate ? (canHire ? ", maar je kunt arbeiders inhuren." : ". Werf er een, of verzamel "+costTxt+" om arbeiders in te huren.") : "."), opts });
    castraLatSay(T.nm+" "+T.icon, look, lines, k=>{ if(opts && k===0){ castraPay(cost); castraFieldClear(e, { nm:"Arbeiders" }, true); } });
  }
}

/* ---------- tekenen ---------- */
const _castraWobjDrawFl0 = castraWobjDraw;
castraWobjDraw = function(){
  _castraWobjDrawFl0.apply(this, arguments);
  const box = el("cwWobj"); if(!box) return;
  let html = "";
  castraWEnts().filter(e=>e.kind==="veld" && !castraFieldCleared(e)).forEach(e=>{
    const T = CASTRA_FIELD_TYPES[e.field], chip = T.need.map(c=>(CASTRA_FIELD_CLASS_ICON[c]||"")).join("");
    html += `<div style="position:absolute;left:${e.x*48}px;top:${e.y*48}px;width:48px;height:48px;z-index:3;display:flex;align-items:center;justify-content:center;font-size:${e.gate?40:32}px;pointer-events:none">${T.icon}</div>
      <div style="position:absolute;left:${e.x*48-24}px;top:${e.y*48-10}px;width:96px;text-align:center;z-index:6;font-size:11px;font-weight:bold;color:#fff;text-shadow:0 1px 3px #000,0 0 5px #000;pointer-events:none">${chip} ${e.gate?"":"👁"}</div>`;
  });
  if(html) box.insertAdjacentHTML("beforeend", html);
};
const CASTRA_FIELD_CLASS_ICON = { hopliet:"🛡️", spartaan:"⚔️", genie:"🛠️", priester:"✨", myth:"🐉", centurio:"🚩", verkenner:"🔭", cavalerie:"🐎", boogschutter:"🏹" };

Object.assign(CASTRA_GLOSS, { "saxum":"rots", "ingens":"enorm", "viam":"weg (4e naamval)", "claudit":"sluit af", "claudunt":"sluiten af", "miles":"soldaat", "fortis":"sterk", "frangere":"breken", "potest":"kan", "frangit":"breekt",
  "aperta":"open", "arbor":"boom", "arborem":"boom (4e naamval)", "cecidit":"is gevallen", "faber":"bouwer", "removere":"wegruimen", "removet":"ruimt weg", "ara":"altaar", "aram":"altaar (4e naamval)", "maledicta":"vervloekt",
  "sacerdos":"priester", "purgare":"reinigen", "purgat":"reinigt", "deserta":"verlaten", "centurio":"commandant", "milites":"soldaten", "ducere":"aanvoeren", "ducit":"voert aan", "vestigia":"sporen", "hic":"hier", "sunt":"zijn",
  "explorator":"verkenner", "ea":"die", "sequi":"volgen", "sequitur":"volgt", "thesaurus":"schat", "inventus":"gevonden", "adest":"is aanwezig", "opus":"werk", "incipit":"begint", "nemo":"niemand", "operarios":"arbeiders (4e naamval)", "conduco":"ik huur" });
