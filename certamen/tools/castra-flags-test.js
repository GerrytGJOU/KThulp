/* Test van de flags-voorgevel, de eventtabel, de wereldtoestanden en de nundinae (castra-flags.js, castra-wstate.js, castra-nund.js).
   node tools/castra-flags-test.js   (vanuit certamen/; exitcode 1 bij fouten) */
const { load } = require("./castra-colo-node.js"), vm = require("vm");
const w = load({ H(){} }); if(w.errs.length){ console.error(w.errs); process.exit(1); }
const run = s => vm.runInContext(s, w.ctx), J = x => JSON.stringify(x), R = s => JSON.parse(J(run(s)));
let fails = 0, checks = 0; const ok = (c, m)=>{ checks++; if(!c){ fails++; console.log("  FOUT  " + m); } };
const fresh = ()=>run(`CASTRA = castraNewState(); CASTRA.dev = true; CASTRA.pxp = castraPxpFor(99); CASTRA.res = { aes:1000, frumentum:1000, lignum:1000, gloria:10 }; var _toast = []; toast = function(a,b){ _toast.push(a+"|"+b); };
  CASTRA_DLG = null; castraDay = ()=>"2026-10-24"; castraWDay = ()=>castraDay();`);
fresh();
const day = d=>run(`castraDay = ()=>${J(d)};`);

console.log("1. flags");
{ ok(run("castraFlag(true)")===true && run("castraFlag(undefined)")===true && run("castraFlag(false)")===false, "true/undefined = waar, false = onwaar");
  ok(run(`castraFlag("mission:m3")`)===false, "missie nog niet gewonnen");
  run(`CASTRA.proelium = { done:{ m3:true } };`); ok(run(`castraFlag("mission:m3")`)===true, "mission:m3 volgt de gewonnen missie");
  ok(run(`castraFlag("region:roma")`)===true && run(`castraFlag("region:gallia")`)===false, "region: volgt of het land open is (roma na m3, gallia nog niet)");
  ok(run(`castraFlag("gate:latium|N")`)===true, "gate: volgt de versperring");
  ok(run(`castraFlag("insignia:graecia")`)===false, "insignia:graecia nog niet"); run(`CASTRA.insignia = { graecia:"x" };`); ok(run(`castraFlag("insignia:graecia")`)===true, "insignia:graecia na het winnen");
  ok(run(`castraFlag("item:amphora")`)===false, "item:amphora nog niet"); run(`CASTRA.items = { amphora:1 };`); ok(run(`castraFlag("item:amphora")`)===true, "item:amphora na het oppakken");
  ok(run(`castraFlag("good:posca")`)===false, "good:posca niet in de saccus"); run(`castraBagAdd("posca",1)`); ok(run(`castraFlag("good:posca")`)===true, "good:posca na het vinden");
  ok(run(`castraFlag("hero:aeneas")`)===false, "hero:aeneas nog niet in het heroum"); run(`CASTRA.heroes = [ { id:"aeneas", lvl:1, xp:0, fides:10 } ];`); ok(run(`castraFlag("hero:aeneas")`)===true, "hero:aeneas in het heroum");
  ok(run(`castraFlag("visited:troia")`)===false, "visited:troia nog niet"); run(`castraGeoMark("troia")`); ok(run(`castraFlag("visited:troia")`)===true, "visited:troia na het bezoeken");
  run(`CASTRA_PHASE_FORCE = "nox"`); ok(run(`castraFlag("phase:nox")`)===true && run(`castraFlag("phase:dies")`)===false, "phase: volgt het dagdeel"); run(`CASTRA_PHASE_FORCE = null`);
  run(`CASTRA.pxp = 0`); ok(run(`castraFlag("lvl:5")`)===false, "lvl:5 bij niveau 1 niet"); run(`CASTRA.pxp = castraPxpFor(5)`); ok(run(`castraFlag("lvl:5")`)===true && run(`castraFlag("lvl:6")`)===false, "lvl:5 bij niveau 5 wel, lvl:6 niet");
  ok(run(`castraFlag("mijn_vlag")`)===false && run(`castraFlag("flag:mijn_vlag")`)===false, "een eigen vlag staat standaard uit");
  run(`castraSetFlag("mijn_vlag")`); ok(run(`castraFlag("mijn_vlag")`)===true && run(`castraFlag("flag:mijn_vlag")`)===true, "castraSetFlag zet hem aan (met en zonder naamruimte)");
  ok(R("castraFlagsAll()").mijn_vlag===1, "castraFlagsAll toont wat aan staat"); run(`castraSetFlag("mijn_vlag", false)`); ok(run(`castraFlag("mijn_vlag")`)===false && !("mijn_vlag" in R("castraFlagsAll()")), "uitzetten verwijdert hem uit de save");
  ok(run(`castraFlag({ not:"mission:m3" })`)===false && run(`castraFlag({ all:["mission:m3","region:roma"] })`)===true && run(`castraFlag({ any:["mission:ga2","mission:m3"] })`)===true && run(`castraFlag({ all:["mission:m3","mission:ga2"] })`)===false, "not, all en any combineren");
  ok(run(`castraFlag("bestaatniet:x")`)===false && run(`!!CASTRA_FLAG_UNKNOWN.bestaatniet`)===true, "een onbekende naamruimte is onwaar en wordt genoteerd"); }

console.log("2. events");
run("var _ev0 = CASTRA_EVENTS.splice(0);");
{ fresh(); run("CASTRA_EVENTS.length = 0;"); run(`var _say = null; castraLatSay = function(nm, look, lines, done){ _say = { nm, lines, done }; };`);
  run(`CASTRA_EVENTS.push({ id:"t1", map:"latium", on:"enter", once:true, do:[ { toast:["A","een"] }, { flag:"gezien" }, { give:{ aes:10 } } ] });`);
  run("CASTRA.res.aes = 100;"); const a0 = run("CASTRA.res.aes");
  ok(run(`castraEvFire("latium","enter")`)===false && run(`_toast.length`)>=1 && run(`castraFlag("gezien")`)===true && run("CASTRA.res.aes")===a0+10, "enter: toast, vlag en beloning uitgevoerd");
  const n = run("_toast.length"); run(`castraEvFire("latium","enter")`); ok(run("_toast.length")===n && run("CASTRA.res.aes")===a0+10, "once:true gebeurt maar één keer");
  ok(run(`CASTRA.ev.t1`)===1, "en staat in CASTRA.ev");
  run(`castraEvFire("graecia","enter")`); ok(run("_toast.length")===n, "een andere wereld doet niets");
  fresh(); run("CASTRA_EVENTS.length = 0;"); run(`CASTRA_EVENTS.push({ id:"t2", map:"*", on:"enter", once:"day", do:[ { toast:["D","dag"] } ] });`);
  run(`castraEvFire("troia","enter")`); run(`castraEvFire("troia","enter")`); ok(run("_toast.length")===1, "once:'day' gebeurt één keer per dag");
  day("2026-10-25"); run(`castraEvFire("troia","enter")`); ok(run("_toast.length")===2, "en de volgende dag opnieuw"); day("2026-10-24");
  fresh(); run("CASTRA_EVENTS.length = 0;"); run(`CASTRA_EVENTS.push({ id:"t3", map:"latium", on:"step", at:[10,12], do:[ { xp:3 } ] });`);
  const p0 = run("CASTRA.pxp||0"); run(`castraEvFire("latium","step",10,11)`); ok((run("CASTRA.pxp||0"))===p0, "step: een andere tegel doet niets"); run(`castraEvFire("latium","step",10,12)`); ok(run("CASTRA.pxp||0")>p0, "step: de juiste tegel geeft ervaring");
  fresh(); run("CASTRA_EVENTS.length = 0;"); run(`CASTRA_EVENTS.push({ id:"t4", map:"latium", on:"interact", target:"kist1", block:true, if:"mission:m3", do:[ { toast:["B","blok"] } ] });`);
  ok(run(`castraEvFire("latium","interact",null,null,"kist1")`)===false && run("_toast.length")===0, "voorwaarde onwaar: niets en niet geblokkeerd");
  run(`CASTRA.proelium = { done:{ m3:true } };`); ok(run(`castraEvFire("latium","interact",null,null,"kist1")`)===true && run("_toast.length")===1, "voorwaarde waar: uitgevoerd en het gewone gesprek geblokkeerd");
  ok(run(`castraEvFire("latium","interact",null,null,"kist2")`)===false, "een ander doel doet niets");
  fresh(); run("CASTRA_EVENTS.length = 0;"); run(`CASTRA_EVENTS.push({ id:"t5", map:"latium", on:"enter", do:[ { say:[{ la:"Salve", nl:"Hallo" }], who:{ nm:"Test", look:null } }, { toast:["na","gesprek"] }, { good:"posca", n:2 } ] }); var _say = null; castraLatSay = function(nm, look, lines, done){ _say = { nm, done }; };`);
  run(`castraEvFire("latium","enter")`); ok(run("_say && _say.nm")==="Test" && run("_toast.length")===0 && run(`castraBagN("posca")`)===0, "say wacht: er gebeurt pas iets nadat het gesprek klaar is");
  run("_say.done()"); ok(run("_toast.length")>=1 && run(`castraBagN("posca")`)===2, "daarna volgen de rest van de commando's (toast, 2 posca)"); }

run("CASTRA_EVENTS.length = 0; CASTRA_EVENTS.push(..._ev0);");

console.log("3. entiteiten met een voorwaarde");
{ fresh(); run(`CASTRA_WENT.push({ id:"test_when", region:"latium", kind:"npc", role:"say", nm:"T", x:1, y:1, when:"mission:m3", say:[{ la:"a", nl:"b" }] });`);
  ok(run(`castraWEntVisible(CASTRA_WENT.find(e=>e.id==="test_when"))`)===false, "when onwaar: onzichtbaar");
  run(`CASTRA.proelium = { done:{ m3:true } };`); ok(run(`castraWEntVisible(CASTRA_WENT.find(e=>e.id==="test_when"))`)===true, "when waar: zichtbaar");
  run(`CASTRA_W_REGION = "latium"; var _sayE = null; castraLatSay = function(nm, look, lines){ _sayE = { nm, lines }; };`);
  run(`castraNpcTalk("w:test_when")`); ok(run("_sayE && _sayE.nm")==="T" && run("_sayE.lines.length")===1, "een role say-entiteit praat met zijn say-regels");
  run(`CASTRA_WENT.splice(CASTRA_WENT.findIndex(e=>e.id==="test_when"),1)`); }

console.log("4. wereldtoestanden");
{ const S = R("CASTRA_WSTATES");
  ok(S.length>=4, S.length+" wereldtoestanden");
  S.forEach(s=>{
    const vo = run(`CASTRA_WENT.find(e=>e.id==="ws_${s.id}_voor")`), na = run(`CASTRA_WENT.find(e=>e.id==="ws_${s.id}_na")`);
    ok(vo && na && vo.x===na.x && vo.y===na.y && vo.region===s.region, s.id+": twee personen op dezelfde plek in "+s.region);
    run("fresh_state_marker = 1;"); run(`CASTRA = castraNewState(); CASTRA.dev = true; CASTRA.pxp = castraPxpFor(99); CASTRA.proelium = { done:{} };`);
    ok(run(`castraWEntVisible(CASTRA_WENT.find(e=>e.id==="ws_${s.id}_voor"))`)===true && run(`castraWEntVisible(CASTRA_WENT.find(e=>e.id==="ws_${s.id}_na"))`)===false, s.id+": vóór de gebeurtenis zie je de bezorgde bewoner");
    const mis = s.cond.split(":")[1]; run(`CASTRA.proelium.done[${J(mis)}] = true;`);
    ok(run(`castraWEntVisible(CASTRA_WENT.find(e=>e.id==="ws_${s.id}_voor"))`)===false && run(`castraWEntVisible(CASTRA_WENT.find(e=>e.id==="ws_${s.id}_na"))`)===true, s.id+": na missie "+mis+" zie je de opgeluchte bewoner");
    ok(vo.say.length>=1 && na.say.length>=1 && [].concat(vo.say, na.say).every(l=>l.la && l.nl), s.id+": Latijn met vertaling");
    ok(R(`CASTRA_EVENTS.some(e=>e.id==="ws_${s.id}_banner" && e.map===${J(s.region)} && e.once===true)`)===true, s.id+": bericht bij het opnieuw binnenkomen");
    ok(run(`CASTRA_P_MISSIONS.some(m=>m.id===${J(mis)} && m.region===${J(s.region)})`), s.id+": de missie "+mis+" hoort bij het land "+s.region);
  });
  // het bericht verschijnt één keer, en alleen na de overwinning
  fresh(); run(`CASTRA.proelium = { done:{} }; CASTRA_EVENTS.push(...CASTRA_WSTATES.map(s=>({ id:"ws_"+s.id+"_banner", map:s.region, on:"enter", if:s.cond, once:true, do:[ { toast:s.banner } ] })));`);
  run(`castraEvFire("latium","enter")`); ok(run("_toast.length")===0, "vóór de missie geen bericht");
  run(`CASTRA.proelium.done.m3 = true; castraEvFire("latium","enter"); castraEvFire("latium","enter");`); ok(run("_toast.length")===1 && /Ardea/.test(run("_toast[0]")), "na de missie één bericht over Ardea"); }

console.log("5. nundinae");
{ fresh();
  const dates = []; for(let i=0;i<24;i++){ const d = new Date(Date.UTC(2026,9,1+i)).toISOString().slice(0,10); dates.push(d); }
  const st = dates.map(d=>{ day(d); return R("castraNundinae()"); });
  const onIdx = st.map((s,i)=>s.on?i:-1).filter(i=>i>=0);
  ok(onIdx.length===3 && onIdx[1]-onIdx[0]===8 && onIdx[2]-onIdx[1]===8, "marktdag elke achtste dag: dagen "+onIdx.join(", ")+" van 24");
  ok(st.every((s,i)=>s.on || s.next===((8-s.phase)%8)) && st.every(s=>s.next>=0 && s.next<8), "next telt af tot de volgende marktdag (0 = vandaag)");
  const first = onIdx[0]; ok(st[first].next===0 && st[first-1===-1?0:first-1].next>=0, "op de marktdag zelf is next 0");
  const dOn = dates[onIdx[0]], dOff = dates[(onIdx[0]+3)%24 === onIdx[0] ? 1 : onIdx[0]+3];
  day(dOn); ok(run("castraNundinae().on")===true && run(`castraFlag("nundinae")`)===true, "flag 'nundinae' is waar op marktdag");
  const base = R("CASTRA_GOODS.posca.price.aes"); ok(run("castraGoodPrice('posca').aes")===Math.ceil(base*0.8) && run("castraGoodPrice('donativum').gloria")===1, "prijzen 20% lager (omhoog afgerond), gloria niet");
  ok(run("castraGoodPrice('posca').aes")<base, "korting ("+base+" → "+run("castraGoodPrice('posca').aes")+")");
  ok(run("castraBagBuy('libum')")===null && run("castraBagN('libum')")===1, "libum kopen lukt op marktdag");
  const stall = R("CASTRA_WENT.filter(e=>e.kind==='npc' && e.role==='mercator').map(e=>e.region)"); ok(stall.length===11, "11 marktkramen ("+stall.length+")");
  run(`CASTRA.dev = true;`); ok(run(`CASTRA_WENT.filter(e=>e.role==="mercator").every(e=>castraWEntVisible(e))`)===true, "alle kramen staan er op marktdag");
  ok(run(`CASTRA_EVENTS.filter(e=>/^nund_enter_/.test(e.id)).length`)===11, "bij het betreden van elk land een bericht (een keer per dag)");
  day(dOff); ok(run("castraNundinae().on")===false, "een gewone dag is geen marktdag");
  ok(run("castraGoodPrice('posca').aes")===base, "geen korting op een gewone dag");
  ok(run("castraBagBuy('libum')")==="geen_markt", "libum is alleen op marktdag te koop");
  ok(run(`CASTRA_WENT.filter(e=>e.role==="mercator").every(e=>!castraWEntVisible(e))`)===true, "de kramen staan er niet op een gewone dag");
  ok(run(`castraFlag("nundinae")`)===false, "flag 'nundinae' is onwaar op een gewone dag");
  // verborgen vondsten
  run("for(const k in CASTRA_HID_REACH) delete CASTRA_HID_REACH[k];"); const off = R(`castraHidSpots("latium").length`);
  day(dOn); run("for(const k in CASTRA_HID_REACH) delete CASTRA_HID_REACH[k];"); const on = R(`castraHidSpots("latium").length`);
  ok(on===off+2, "op marktdag twee extra verborgen vondsten ("+off+" → "+on+")");
  ok(R(`castraHidSpots("specus_latium").length`)===2, "een grot krijgt er geen extra");
  // saccus: winkel open met een marktkraam
  fresh(); day(dOn); run("CASTRA_BAGUI.market = false;"); ok(run("castraBagShopOpen()")===false, "buiten het kamp zonder kraam is de winkel dicht");
  run("CASTRA_BAGUI.market = true;"); ok(run("castraBagShopOpen()")===true, "bij een marktkraam op marktdag is hij open");
  day(dOff); ok(run("castraBagShopOpen()")===false, "en niet meer op een gewone dag"); }

console.log("\n" + checks + " controles, " + fails + " fouten");
process.exit(fails ? 1 : 0);
