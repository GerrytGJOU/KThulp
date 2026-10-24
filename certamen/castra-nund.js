/* ============================================================================
   CASTRA HEROUM — NUNDINAE: DE ROMEINSE MARKTDAG (elke achtste dag)
   ----------------------------------------------------------------------------
   De Romeinen hielden om de acht dagen een marktdag, de nundinae: boeren kwamen naar de stad om te verkopen en te kopen. Bij ons is het
   elke achtste dag (telling vanaf de datum, dus voor iedereen dezelfde dag) marktdag. Dan:
     - staat er in elk land een marktkraam bij de reisplek (een mercator), waar je je saccus kunt vullen (menu van de saccus opent vanzelf);
     - is alles bij de mercator 20% goedkoper (grondstoffen, afgerond omhoog) en is er libum te koop (offerkoek);
     - liggen er twee extra verborgen vondsten per land (er is veel volk op de been);
     - toont de balk bovenin een chip "🏺 Nundinae" en meldt het spel het als je een land betreedt.
   Teksten: Latijn met vertaling. Gebruikt de flags en events van castra-flags.js (flag "nundinae", when:"nundinae").
   Laadt NA castra-flags.js, castra-bag.js, castra-hidden.js en castra-dayn.js.
   ============================================================================ */
const CASTRA_NUND = { every:8, discount:0.2, extraHidden:2 };
function castraNundDayNr(){ return Math.floor(Date.parse(castraDay()+"T00:00:00Z")/86400000); }
// { on: het is vandaag marktdag, next: dagen tot de volgende (0 = vandaag), phase: 0..7 }
function castraNundinae(){ const n = castraNundDayNr(), ph = ((n % CASTRA_NUND.every) + CASTRA_NUND.every) % CASTRA_NUND.every; return { on:ph===0, phase:ph, next:(CASTRA_NUND.every-ph)%CASTRA_NUND.every }; }

// Marktkramen: per land een vaste plek bij de reisplek (gekozen met een controle op bereikbaarheid in tools/castra-world-test.js).
const CASTRA_MARKET_POS = {
  latium:[30,40], graecia:[30,42], troia:[30,42], gallia:[30,42], aegyptus:[30,42], persis:[30,42], africa:[30,42], roma:[34,47], laconia:[30,42], germania:[33,42], themiscyra:[33,42],
};
(function(){
  Object.keys(CASTRA_MARKET_POS).forEach(rid=>{
    const W = CASTRA_WORLDS[rid]; if(!W) return; const p = CASTRA_MARKET_POS[rid], folk = (typeof CASTRA_WREG!=="undefined" && CASTRA_WREG[rid] && CASTRA_WREG[rid].folk) || "rom";
    CASTRA_WENT.push({ id:"mercatus_"+rid, region:rid, kind:"npc", role:"mercator", nm:"Mercator nundinarum", x:p[0], y:p[1], dir:"down", when:"nundinae",
      look:castraRegLook(folk, { armor:"middel", baard:"snor", cape:"kort", capekleur:"oranje", helm:"geen", schild:"geen", wapen:"geen" }) });
    CASTRA_EVENTS.push({ id:"nund_enter_"+rid, map:rid, on:"enter", if:"nundinae", once:"day", do:[ { toast:["🏺 Nundinae", "Hodie nundinae sunt! Bij de reisplek staat een marktkraam."] } ] });
  });
})();
function castraMarketOpen(){ CASTRA_BAGUI.market = true; CASTRA_BAGUI.pick = null; castraMenuOpen(); castraMenuPick("sacculus"); }
const _castraNpcTalkNu0 = castraNpcTalk;
castraNpcTalk = function(id){
  id = String(id);
  const e = id.indexOf("w:")===0 ? CASTRA_WENT.find(x=>"w:"+x.id===id) : null;
  if(e && e.role==="mercator"){
    if(CASTRA_DLG) return;
    castraLatSay(e.nm, castraWLook(e), [ { la:"Hodie nundinae sunt! Eme, hospes!", nl:"Het is marktdag! Koop iets, gast!" } ], ()=>castraMarketOpen());
    return;
  }
  return _castraNpcTalkNu0.apply(this, arguments);
};

/* ---------- chip in de balk ---------- */
const _castraDaynApplyNu0 = castraDaynApply;
castraDaynApply = function(){
  _castraDaynApplyNu0.apply(this, arguments);
  const ph = document.getElementById("cgPhase"); if(!ph) return;
  let c = document.getElementById("cgNund"); const n = castraNundinae();
  if(!n.on){ if(c) c.remove(); return; }
  if(!c){ c = document.createElement("span"); c.id = "cgNund"; c.style.cssText = "flex:0 0 auto;font-size:13px;padding:2px 8px;border-radius:12px;background:rgba(232,201,106,.25);color:var(--hi-bright,#e8c96a);white-space:nowrap"; ph.insertAdjacentElement("afterend", c); }
  c.textContent = "🏺 Nundinae"; c.title = "Marktdag: alles 20% goedkoper, een kraam bij de reisplek, extra verborgen vondsten";
};
Object.assign(CASTRA_GLOSS, { "nundinae":"marktdag", "hodie":"vandaag", "sunt":"zijn", "eme":"koop!", "hospes":"gast", "terras":"landen", "aperi":"open!" });
