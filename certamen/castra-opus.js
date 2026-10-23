/* ============================================================================
   CASTRA HEROUM — SOLDATEN AAN HET WERK (Labor)
   ----------------------------------------------------------------------------
   Een soldaat kan een productiegebouw bemannen: Praetorium (frumentum), Lignatio (hout) of Metallum (brons).
   Een gebouw heeft zoveel werkplekken als zijn level (1 tot 5). Elke werker geeft het gebouw een bonus op de
   productie; die groeit met het level en de tier van de soldaat en is 1,5 keer zo groot in een geschikt gebouw.
   Een held als voorman blijft zijn eigen bonus geven (castraHeroBonus), de werkers komen erbij.
   De afweging: een werkende soldaat doet niet mee aan gevechten en jacht, kan niet trainen of verhandeld worden
   tot je hem terugroept (één tik). Zo blijven soldaten relevant naast de (schaarse) helden.
   Opslag: s.job = id van het gebouw (ontbreekt als de soldaat niet werkt). Menu: Labor (vanaf Castra-niveau 5).
   De bonus loopt via castraBldBonus() in castra.js; vóór elke wijziging wordt de productie afgerekend, zodat
   de nieuwe bonus niet terugwerkt op wat er al lag. Laadt NA castra-menu.js, castra-campus.js en castra-commercium.js.
   ============================================================================ */

const CASTRA_OPUS = {
  buildings:["praetorium","lignatio","metallum"],
  base:2, perLvl:0.25, perTier:1.5, affMult:1.5,        // % per werker: (2 + 0,25 × level + 1,5 × (tier-1)) × 1,5 als geschikt
  fit:{ praetorium:["rec","cav"], lignatio:["inf"], metallum:["sup","rng"] },
  unlockLvl:5,
};
function castraAway(s){ return !!(s && s.job); }
function castraOpusFits(s, bid){ return (CASTRA_OPUS.fit[bid]||[]).indexOf(castraLine(s.line).type) >= 0; }
// Bonus in % die één soldaat in dat gebouw oplevert (0 als hij gewond is).
function castraOpusValue(s, bid){
  if(!s || castraIsHurt(s)) return 0;
  const f = castraLine(s.line), O = CASTRA_OPUS;
  const v = O.base + O.perLvl*(s.lvl||1) + O.perTier*((f.tier||1)-1);
  return Math.round(10*v*(castraOpusFits(s, bid) ? O.affMult : 1))/10;
}
function castraOpusWorkers(bid){ return (CASTRA.soldiers||[]).filter(s=>s.job===bid); }
function castraOpusSlots(bid){ return castraLvl(bid); }
function castraOpusBonus(bid){ return Math.round(castraOpusWorkers(bid).reduce((a,s)=>a+castraOpusValue(s, bid), 0)); }
// Zet een soldaat aan het werk (bid) of roep hem terug (bid = null). Geeft null bij succes, anders een foutcode (CASTRA_LA).
function castraOpusSet(sid, bid){
  const s = (CASTRA.soldiers||[]).find(x=>x.id===sid); if(!s) return "?";
  const old = s.job || null;
  if(!bid){ if(old) castraCollect(old); delete s.job; castraSave(); return null; }
  if(CASTRA_OPUS.buildings.indexOf(bid) < 0 || castraLvl(bid) < 1) return "?";
  if(old===bid) return null;
  if(castraIsHurt(s)) return "vulneratus_laborat";
  if(s.trainUntil) return "exercetur_laborat";
  if(castraOpusWorkers(bid).length >= castraOpusSlots(bid)) return "loca_plena";
  if(old) castraCollect(old);
  castraCollect(bid);
  s.job = bid; castraSave(); return null;
}
function castraOpusUnlocked(){ return typeof castraUnlocked==="function" ? castraUnlocked("labor") : true; }

/* ---------- soldaten die werken doen niet mee ---------- */
const _castraTrainStartOp0 = castraTrainStart;
castraTrainStart = function(sid){
  const s = CASTRA.soldiers.find(x=>x.id===sid); if(s && s.job) return "miles_laborat";
  return _castraTrainStartOp0.apply(this, arguments);
};
const _castraTradeTradableOp0 = castraTradeTradable;
castraTradeTradable = function(s){ return _castraTradeTradableOp0(s) && !s.job; };

/* ---------- ontgrendeling, menu ---------- */
if(typeof CASTRA_UNLOCKS!=="undefined" && !CASTRA_UNLOCKS.some(u=>u.id==="labor")){
  CASTRA_UNLOCKS.push({ id:"labor", lvl:CASTRA_OPUS.unlockLvl, la:"Labor", nl:"soldaten aan het werk zetten in het kamp (menu: Labor)" });
  CASTRA_UNLOCKS.sort((a,b)=>a.lvl-b.lvl);
}
(function(){
  const i = CASTRA_MENU_ITEMS.findIndex(x=>x.id==="milites");
  CASTRA_MENU_ITEMS.splice(i+1, 0, { id:"labor", la:"Labor", nl:"soldaten aan het werk", unl:"labor" });
})();
const _castraMenuViewOp0 = castraMenuView;
castraMenuView = function(id){ return id==="labor" ? castraMenuLabor() : _castraMenuViewOp0(id); };

const _OP_ICON = { praetorium:"🏛️", lignatio:"🪓", metallum:"⛏️" }, _OP_RES = { praetorium:"frumentum", lignatio:"hout", metallum:"brons" };
function castraOpusAct(sid, bid){
  const err = castraOpusSet(sid, bid || null);
  if(err){ if(typeof castraToastLa==="function") castraToastLa(err); }
  else if(bid) toast("⚒️ Labor", "De soldaat gaat aan het werk.");
  castraMenuRender();
}
function castraMenuLabor(){
  const O = CASTRA_OPUS, btn = "min-height:36px;padding:2px 8px;margin:2px 4px 2px 0;font-size:13px;font-family:inherit;cursor:pointer;background:#e8c96a;color:var(--parch-ink,#2b1d0e);border:2px solid var(--parch-edge,#4a3416);border-radius:8px";
  const blds = O.buildings.map(bid=>{
    const b = castraBuilding(bid), lv = castraLvl(bid), ws = castraOpusWorkers(bid), hb = typeof castraHeroBonus==="function" ? castraHeroBonus(bid) : 0;
    const rows = ws.map(s=>`<div style="${CASTRA_MV_ROW}"><div style="flex:1;min-width:0"><b>${esc(castraSoldierName(s))}</b> <small>Lv ${s.lvl} · tier ${castraLine(s.line).tier}${castraOpusFits(s,bid)?" · ⭐ geschikt":""}</small></div>
      <b>+${castraOpusValue(s,bid)}%</b><button style="${btn}" onclick="castraOpusAct('${s.id}',null)">Terug</button></div>`).join("") || `<div class="note" style="margin:2px 0">Nemo laborat.</div>`;
    return `<div style="margin-top:10px"><b>${_OP_ICON[bid]} ${esc(b.nm)}</b> <small>${esc(_OP_RES[bid])} · werkplekken ${ws.length} / ${lv}</small>
      <div style="font-size:12px;opacity:.8">Bonus op de productie: werkers +${castraOpusBonus(bid)}%${hb?` · held +${hb}%`:""}</div>${rows}</div>`;
  }).join("");
  const idle = (CASTRA.soldiers||[]).filter(s=>!s.job).map(s=>{
    const hurt = castraIsHurt(s), tr = !!s.trainUntil;
    const acts = hurt ? `<small>🩹 gewond</small>` : tr ? `<small>🏋️ traint</small>` : O.buildings.map(bid=>{
      const full = castraOpusWorkers(bid).length >= castraOpusSlots(bid);
      return `<button style="${btn}${full?";opacity:.4":""}" ${full?"disabled":""} onclick="castraOpusAct('${s.id}','${bid}')">${_OP_ICON[bid]} +${castraOpusValue(s,bid)}%${castraOpusFits(s,bid)?" ⭐":""}</button>`; }).join("");
    return `<div style="${CASTRA_MV_ROW};flex-wrap:wrap"><div style="flex:1;min-width:140px"><b>${esc(castraSoldierName(s))}</b> <small>Lv ${s.lvl} · tier ${castraLine(s.line).tier}</small></div><div>${acts}</div></div>`;
  }).join("") || `<div class="note">Alle soldaten werken al, of je hebt er nog geen.</div>`;
  return `<h3 style="margin:0 0 6px">Labor <small>soldaten aan het werk</small></h3>
    <div class="note" style="margin-bottom:6px">${castraLaHTML("Hic milites laborant.", "Hier werken soldaten. Een werkende soldaat levert grondstoffen op, maar doet niet mee aan gevechten en jacht tot je hem terugroept.", "opus_intro")}
      <br><small>⭐ = geschikt voor dat gebouw (anderhalf keer zoveel). Meer werkplekken met een hoger gebouwlevel.</small></div>
    ${blds}<h4 style="margin:14px 0 2px">Beschikbare soldaten</h4>${idle}`;
}

Object.assign(CASTRA_LA, {
  miles_laborat:       { la:"Miles laborat.", nl:"Deze soldaat werkt in het kamp. Roep hem eerst terug (menu: Labor)." },
  vulneratus_laborat:  { la:"Miles vulneratus est.", nl:"Een gewonde soldaat kan niet werken." },
  exercitatur_laborat: { la:"Miles exercetur.", nl:"Een soldaat die traint kan niet werken." },
});
CASTRA_LA.exercetur_laborat = CASTRA_LA.exercitatur_laborat;
Object.assign(CASTRA_GLOSS, { "hic":"hier", "milites":"soldaten", "laborant":"werken", "laborat":"werkt", "nemo":"niemand", "miles":"soldaat", "vulneratus":"gewond", "exercetur":"wordt getraind" });
