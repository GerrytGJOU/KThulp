/* ============================================================================
   CASTRA HEROUM — ROMA UITGEBOUWD (stad met vijf binnenruimtes)
   ----------------------------------------------------------------------------
   Roma is 72×54 tegels. Langs de Via Sacra (de dwarsstraat) staan vier tenten met een
   deur, en ten oosten van het midden een trap naar de catacomben:
     Ludus gladiatorius   Lanista: dagelijks gevecht tegen een kampioen (beloning + kaarttrekking)
     Tabularium           vier boekenkasten met elk een eigen spreekwoord (eenmaal per dag)
     Curia                Consul: dagelijkse vertaalquiz met hele Latijnse zinnen (vanaf niveau 13)
     Thermae              Balneator: eenmaal per dag baden = soldaten genezen + ervaring
     Catacumbae I + II    donkere grotten (schimmen); Custos: haal zijn lucerna; baas Larva (dagelijks)
   Daarnaast een Venator Romanus (dagelijkse jachtopdracht, net als in Latium).
   Het Colosseum zelf (gesloten, bordje) staat in castra-colosseum.js.
   Laadt NA castra-gates.js (laatste wereldmodule).
   ============================================================================ */

/* ---------- woordenlijst voor de tikbare Latijnse zinnen ---------- */
Object.assign(CASTRA_GLOSS, {
  "catacumbis":"in de catacomben", "catacumbas":"catacomben (4e naamval)", "senatus":"de senaat", "vocat":"roept", "sententias":"zinnen (4e naamval)", "latinas":"Latijnse (4e naamval)",
  "interpretare":"vertaal!", "thermae":"thermen (badhuis)", "patent":"staan open", "lavisti":"je hebt gebaad", "lavare":"baden", "lavo":"ik baad",
  "gladiatorem":"gladiator (4e naamval)", "fortem":"sterke (4e naamval)", "tenebrae":"duisternis", "lucernam":"olielamp (4e naamval)", "lucerna":"olielamp",
  "excitare":"wakker maken", "fuge":"ren weg!", "catacumbae":"de catacomben",
});

/* ---------- terrein, voorwerpen ---------- */
CASTRA_VENATIO.roma.terrains.push({ id:"catacumbae", hidden:true, la:"In catacumbis", nl:"In de catacomben", folk:{ rom:50, gla:10, gal:3, ger:3, gra:3, aeg:3 }, prefs:{ inf:2, sup:3, rng:1 }, myth:{ p:0.40, taks:["Schimmen"] } });
CASTRA_ITEMS.lucerna = { nm:"Lucerna", icon:"🪔", nl:"olielamp" };

/* ---------- toegangen in Roma (tenten, trap) ---------- */
const CASTRA_ROMA_TENTS = [ ["tent_white",8,10], ["tent_beige",28,10], ["tent_beige",44,10], ["tent_white",52,10] ];
const CASTRA_ROMA_ROCKS = [ ["rock_grey",49,39],["rock_brown",50,39],["rock_grey",51,39],["rock_brown",49,40],["rock_grey",51,40] ];
CASTRA_WORLDS.roma.doors = [
  { x:9,  y:13, to:"ludus_roma",       label:"⚔️ Ludus gladiatorius", spawn:{ x:11, y:14, dir:"up" } },
  { x:29, y:13, to:"tabularium_roma",  label:"📚 Tabularium",         spawn:{ x:10, y:12, dir:"up" } },
  { x:45, y:13, to:"curia_roma",       label:"🏛️ Curia",              spawn:{ x:10, y:12, dir:"up" } },
  { x:53, y:13, to:"thermae_roma",     label:"♨️ Thermae",            spawn:{ x:9,  y:12, dir:"up" } },
  { x:50, y:40, to:"catacumbae_i",     label:"💀 Catacumbae",         icon:"🪦", spawn:{ x:14, y:18, dir:"up" } },
];
const _castraWobjPiecesRoma0 = castraWobjPieces;
castraWobjPieces = function(rid){
  const out = _castraWobjPiecesRoma0(rid);
  if(rid==="roma"){ CASTRA_ROMA_TENTS.concat(CASTRA_ROMA_ROCKS).forEach(([o,x,y])=>out.push({ o, x, y })); }
  return out;
};
const _castraWobjSpotsRoma0 = castraWobjSpots;
castraWobjSpots = function(rid){
  const out = _castraWobjSpotsRoma0(rid);
  if(rid==="roma"){
    CASTRA_ROMA_TENTS.forEach(([,tx,ty])=>{ for(let y=ty;y<=ty+4;y++) for(let x=tx-1;x<=tx+3;x++) out.push([x,y]); });
    for(let y=38;y<=42;y++) for(let x=48;x<=52;x++) out.push([x,y]);
  }
  return out;
};

/* ---------- binnenruimtes ---------- */
const CASTRA_ROMA_LOOKS = {
  consul:   { huid:"licht",  haar:"kort", haarkleur:"grijs", baard:"geen",  cape:"lang", capekleur:"paars", helm:"geen", schild:"geen", wapen:"geen", armor:"ceremonieel" },
  balneator:{ huid:"getint", haar:"kaal", haarkleur:"bruin", baard:"geen",  cape:"geen", helm:"geen", schild:"geen", wapen:"geen", armor:"robe" },
  lanista:  { huid:"olijf",  haar:"wild", haarkleur:"zwart", baard:"baard", cape:"geen", helm:"geen", schild:"geen", wapen:"zweep", armor:"middel" },
  custos:   { huid:"getint", haar:"kort", haarkleur:"grijs", baard:"baard", cape:"geen", helm:"geen", schild:"geen", wapen:"geen", armor:"vodden" },
  venator:  { huid:"licht",  haar:"kort", haarkleur:"bruin", baard:"baard", cape:"geen", helm:"bandana", schild:"geen", wapen:"boog", armor:"middel" },
  larva:    { huid:"zeerlicht", haar:"lang", haarkleur:"grijs", baard:"geen", cape:"geen", helm:"geen", schild:"geen", wapen:"geen", armor:"vodden" },
};
Object.assign(CASTRA_INTERIORS, {
  curia_roma: {
    parent:"roma", kind:"house", nm:"Curia", nl:"Het senaatsgebouw", icon:"🏛️", cols:22, rows:14, start:{ x:10, y:11 }, floor:"stone",
    doors:[ { x:10, y:13, to:"roma", spawn:{ x:45, y:14, dir:"down" } }, { x:11, y:13, to:"roma", spawn:{ x:45, y:14, dir:"down" } } ],
    furniture:[ ["crate_a",4,4],["crate_b",4,6],["crate_a",4,8],["crate_b",17,4],["crate_a",17,6],["crate_b",17,8],["pot",1,1],["pot",20,1],["pot",1,12],["pot",20,12] ],
    chests:[ [2,10,"kist_curia1"], [19,10,"kist_curia2"] ],
    npcs:[ { id:"consul", role:"consul", nm:"Consul", x:10, y:4, dir:"down", look:CASTRA_ROMA_LOOKS.consul } ],
    books:[ { id:"boek_curia", x:2, y:2, off:3 } ],
  },
  thermae_roma: {
    parent:"roma", kind:"house", nm:"Thermae", nl:"De Romeinse badhuizen", icon:"♨️", cols:20, rows:14, start:{ x:9, y:11 }, floor:"stone",
    doors:[ { x:9, y:13, to:"roma", spawn:{ x:53, y:14, dir:"down" } }, { x:10, y:13, to:"roma", spawn:{ x:53, y:14, dir:"down" } } ],
    pool:[6,3,8,5],
    furniture:[ ["flower_w",2,2],["flower_p",17,2],["barrel",1,12],["barrel",18,12],["plant_a",2,8],["plant_c",17,8],["bucket",16,10] ],
    chests:[ [17,10,"kist_thermae1"] ],
    npcs:[ { id:"balneator", role:"balneator", nm:"Balneator", x:4, y:10, dir:"right", look:CASTRA_ROMA_LOOKS.balneator } ],
  },
  tabularium_roma: {
    parent:"roma", kind:"house", nm:"Tabularium", nl:"Het archief", icon:"📚", cols:22, rows:14, start:{ x:10, y:11 }, floor:"stone",
    doors:[ { x:10, y:13, to:"roma", spawn:{ x:29, y:14, dir:"down" } }, { x:11, y:13, to:"roma", spawn:{ x:29, y:14, dir:"down" } } ],
    furniture:[ ["crate_a",2,2],["crate_b",4,2],["crate_c",7,2],["crate_d",9,2],["crate_a",12,2],["crate_b",14,2],["crate_c",17,2],["crate_d",19,2],["pot",1,12],["pot",20,12] ],
    chests:[ [19,10,"kist_tab1"] ],
    books:[ { id:"boek_tab1", x:3, y:2, off:4 }, { id:"boek_tab2", x:8, y:2, off:5 }, { id:"boek_tab3", x:13, y:2, off:6 }, { id:"boek_tab4", x:18, y:2, off:7 } ],
  },
  ludus_roma: {
    parent:"roma", kind:"house", nm:"Ludus gladiatorius", nl:"De gladiatorenschool", icon:"⚔️", cols:24, rows:16, start:{ x:11, y:13 }, floor:"stoneb",
    doors:[ { x:11, y:15, to:"roma", spawn:{ x:9, y:14, dir:"down" } }, { x:12, y:15, to:"roma", spawn:{ x:9, y:14, dir:"down" } } ],
    furniture:[ ["barrel",3,2],["barrel",4,2],["barrel",19,2],["barrel",20,2],["crate_a",8,8],["crate_b",15,8],["stump",6,6],["stump",17,6],["stump",6,10],["stump",17,10] ],
    chests:[ [2,13,"kist_ludus1"], [21,13,"kist_ludus2"] ],
    npcs:[ { id:"lanista", role:"lanista", nm:"Lanista", x:12, y:4, dir:"down", look:CASTRA_ROMA_LOOKS.lanista } ],
  },
  catacumbae_i: {
    parent:"roma", kind:"cave", nm:"Catacumbae I", nl:"De catacomben", icon:"💀", cols:30, rows:22, start:{ x:14, y:18 },
    carve:[ [13,16,4,5], [4,10,22,6], [4,3,6,7], [20,3,6,7], [12,2,6,8] ],
    zone:{ t:"catacumbae", x:5, y:11, w:20, h:4 },
    doors:[ { x:14, y:20, to:"roma", spawn:{ x:50, y:41, dir:"down" } }, { x:15, y:20, to:"roma", spawn:{ x:50, y:41, dir:"down" } },
            { x:14, y:2, to:"catacumbae_ii", icon:"🪜", spawn:{ x:14, y:4, dir:"down" } }, { x:15, y:2, to:"catacumbae_ii", icon:"🪜", spawn:{ x:15, y:4, dir:"down" } } ],
    chests:[ [5,5,"kist_cat1a"], [24,5,"kist_cat1b"] ],
    npcs:[ { id:"custos", role:"custos", nm:"Custos", x:16, y:17, dir:"left", look:CASTRA_ROMA_LOOKS.custos } ],
  },
  catacumbae_ii: {
    parent:"roma", kind:"cave", nm:"Catacumbae II", nl:"De diepe catacomben", icon:"💀", cols:30, rows:22, start:{ x:14, y:4 },
    carve:[ [12,2,6,8], [4,10,22,6], [4,3,6,7], [20,3,6,7], [4,16,6,4], [12,16,6,4], [20,16,6,4] ],
    zone:{ t:"catacumbae", x:5, y:11, w:20, h:4 },
    doors:[ { x:14, y:2, to:"catacumbae_i", icon:"🪜", spawn:{ x:14, y:4, dir:"up" } }, { x:15, y:2, to:"catacumbae_i", icon:"🪜", spawn:{ x:15, y:4, dir:"up" } } ],
    chests:[ [5,5,"kist_cat2a"], [24,5,"kist_cat2b"], [5,18,"kist_cat2c"] ],
    pickups:[ { id:"lucerna", item:"lucerna", x:23, y:18, needs:{ qid:"custos", step:1 } } ],
    bosses:[ { id:"boss_larva", nm:"Larva", form:"myt_larva", lvl:22, icon:"👻", x:14, y:18, terrain:"catacumbae", daily:true } ],
  },
});
Object.keys(CASTRA_INTERIORS).filter(id=>!CASTRA_WORLDS[id]).forEach(castraInteriorRegister);

// Venator in Roma (dagelijkse jachtopdracht)
CASTRA_WENT.push({ id:"venator_roma", region:"roma", kind:"npc", role:"bounty", nm:"Venator", x:33, y:50, dir:"right", look:CASTRA_ROMA_LOOKS.venator });

/* ---------- gedwongen gevechten (baas, kampioen) ---------- */
const _castraWFeatRoma0 = castraWFeat;
castraWFeat = function(e){ if(e.role==="consul") return "puzzels"; return _castraWFeatRoma0(e); };
const _castraWEntVisibleRoma0 = castraWEntVisible;
castraWEntVisible = function(e){
  if(e.kind==="boss" && e.daily && ((CASTRA.wday||{})["boss_"+e.id]===castraWDay())) return false;
  return _castraWEntVisibleRoma0(e);
};
function castraRomaFight(terrain, form, lvl, boss){
  castraWorldSavePos(CASTRA_W_UI.px, CASTRA_W_UI.py); castraSave(); castraWorldDetach();
  CASTRA_V = castraForcedEncounter("roma", terrain, { form, lvl, boss });
  if(typeof castraCodexSee==="function") castraCodexSee(form);
  CASTRA_V.log = []; CASTRA_V.round = 0; CASTRA_V.fromWorld = true;
  CASTRA_V_PENDING = true;
  go("castraVenatio");
}
// Beloning bij winst (aangeroepen vanuit castraVFinish): eenmaal per dag per baas.
function castraBossWon(V){
  const b = V.boss; if(!b) return;
  const w = CASTRA.wday || (CASTRA.wday = {});
  if(w[b.key]===castraWDay()) return;
  w[b.key] = castraWDay();
  const t = castraWGive(Object.assign(castraWScaled(b.reward, castraWScale(V.region||"roma")), { gloria:b.gloria||2 }));
  if(typeof castraPxpAdd==="function") castraPxpAdd(b.pxp||25, b.why||"Baas verslagen");
  if(b.token && typeof castraCardToken==="function") castraCardToken(1, b.why||"baas verslagen");
  castraSave();
  setTimeout(()=>toast("🏆 "+castraLaText("recte"), t+(b.token?" · 🎟️ +1 kaarttrekking":"")), 600);
}

/* ---------- personen aanspreken ---------- */
const _castraNpcTalkRoma0 = castraNpcTalk;
castraNpcTalk = function(id){
  id = String(id);
  if(id==="w:consul"){ castraConsulTalk(); return; }
  if(id==="w:balneator"){ castraBadTalk(); return; }
  if(id==="w:lanista"){ castraLanistaTalk(); return; }
  if(id==="w:custos"){ castraCustosTalk(); return; }
  if(id==="w:boss_larva"){ castraLarvaTalk(); return; }
  if(id==="w:venator_roma"){ castraBountyTalk("venator_roma"); return; }
  return _castraNpcTalkRoma0(id);
};
const romaSay = (who, look, lines, done)=>castraLatSay(who, look, lines, done);

/* Consul: vertaalquiz met hele zinnen */
const CASTRA_QUIZ_SENT = [
  ["Senatus Romanus consulem creat.","De Romeinse senaat kiest een consul."],["Miles fortiter pugnat.","De soldaat vecht dapper."],
  ["Consul in foro orationem habet.","De consul houdt een toespraak op het Forum."],["Hostes urbem oppugnant.","De vijanden vallen de stad aan."],
  ["Pueri in schola discunt.","De jongens leren op school."],["Dux milites ad castra ducit.","De leider voert de soldaten naar het kamp."],
  ["Romani deos colunt.","De Romeinen vereren de goden."],["Gladiator in arena pugnat.","De gladiator vecht in de arena."],
  ["Cives pacem amant.","De burgers houden van vrede."],["Rex populum regit.","De koning bestuurt het volk."],
  ["Navis ad portum venit.","Het schip komt bij de haven aan."],["Equites hostes fugant.","De ruiters jagen de vijanden op de vlucht."],
  ["Mater filios vocat.","De moeder roept haar zonen."],["Aqua in flumine fluit.","Het water stroomt in de rivier."],
  ["Legati pacem petunt.","De gezanten vragen om vrede."],["Servus dominum timet.","De slaaf vreest zijn meester."],
  ["Vir sapiens libros legit.","De wijze man leest boeken."],["Caesar Galliam vincit.","Caesar overwint Gallië."],
];
function castraConsulTalk(){
  if(CASTRA_DLG) return;
  romaSay("Consul", CASTRA_ROMA_LOOKS.consul, [ { la:"Salve, dux {naam}! Senatus te vocat.", nl:"Gegroet, leider {naam}! De senaat roept je." },
    { la:"Sententias Latinas interpretare!", nl:"Vertaal Latijnse zinnen! Vijf vragen.", opts:[ { la:"Incipe", nl:"beginnen" }, { la:"Nunc non", nl:"nu niet" } ] } ],
    k=>{ if(k===0){ CASTRA_QUIZ_KIND = { key:"quiz_consul", rid:"roma", words:CASTRA_QUIZ_SENT, title:"Senatus consultum" }; castraQuizStart(); } });
}

/* Balneator: eenmaal per dag baden */
function castraBadTalk(){
  if(CASTRA_DLG) return;
  const w = CASTRA.wday || (CASTRA.wday = {}), done = w.thermae===castraWDay();
  romaSay("Balneator", CASTRA_ROMA_LOOKS.balneator, [ { la:"Salve, hospes {naam}! Thermae tibi patent.", nl:"Gegroet, gast {naam}! De thermen staan voor je open." },
    done ? { la:"Hodie iam lavisti. Cras redi!", nl:"Je hebt vandaag al gebaad. Kom morgen terug!" }
         : { la:"Visne lavare?", nl:"Wil je een bad nemen?", opts:[ { la:"Lavo", nl:"baden" }, { la:"Vale", nl:"tot ziens" } ] } ],
    k=>{
      if(done || k!==0) return;
      const hurt = (CASTRA.soldiers||[]).filter(castraIsHurt); hurt.forEach(s=>{ s.hurtUntil = 0; });
      w.thermae = castraWDay(); castraSave(); if(typeof castraPxpAdd==="function") castraPxpAdd(12, "Gebaad");
      toast("♨️ Thermae", (hurt.length ? hurt.length+" soldaat/soldaten zijn weer gezond. " : "Je soldaten waren al gezond. ")+"+12 ervaring.");
    });
}

/* Lanista: dagelijkse kampioen */
function castraLanistaTalk(){
  if(CASTRA_DLG) return;
  const done = (CASTRA.wday||{}).kampioen===castraWDay();
  romaSay("Lanista", CASTRA_ROMA_LOOKS.lanista, [ { la:"Salve, dux {naam}! Gladiatorem fortem habeo.", nl:"Gegroet, leider {naam}! Ik heb een sterke gladiator." },
    done ? { la:"Hodie eum vicisti. Cras redi!", nl:"Vandaag heb je hem verslagen. Kom morgen terug!" }
         : { la:"Visne cum eo pugnare?", nl:"Durf je tegen hem te vechten? Wie wint, krijgt een beloning.", opts:[ { la:"Pugno", nl:"vechten" }, { la:"Nunc non", nl:"nu niet" } ] } ],
    k=>{ if(!done && k===0) castraRomaFight("arena", "gla_primuspalus", 20, { key:"kampioen", reward:{ aes:90, frumentum:40 }, gloria:2, pxp:25, token:true, why:"kampioen verslagen" }); });
}

/* Custos van de catacomben: lucerna-opdracht */
function castraCustosTalk(){
  if(CASTRA_DLG) return;
  const q = castraWQ("custos");
  if(q.step===0){
    romaSay("Custos", CASTRA_ROMA_LOOKS.custos, [ { la:"Salve, hospes {naam}! Tenebrae hic sunt. Lucernam meam quaero.", nl:"Gegroet, gast {naam}! Het is hier donker. Ik zoek mijn olielamp." },
      { la:"Descende in catacumbas et refer lucernam.", nl:"Daal af in de diepe catacomben (trap bovenin) en breng mijn lamp terug." } ],
      ()=>{ q.step = 1; castraSave(); castraWobjDraw(); castraWRefreshHud && castraWRefreshHud(); });
  } else if(q.step===1){
    if(castraWItems().lucerna){
      romaSay("Custos", CASTRA_ROMA_LOOKS.custos, [ { la:"Lucerna mea! Gratias tibi ago, dux {naam}!", nl:"Mijn lamp! Dank je wel, leider {naam}!" } ],
        ()=>{
          delete castraWItems().lucerna; q.step = 2;
          const t = castraWGive(Object.assign(castraWScaled({ aes:150, frumentum:75 }, castraWScale("roma")), { gloria:2 }));
          castraSave(); toast("🪔 "+castraLaText("recte"), t); castraWobjDraw();
          if(typeof castraPxpAdd==="function") castraPxpAdd(45, "Opdracht voltooid");
          if(typeof castraCardToken==="function") castraCardToken(1, "opdracht voltooid");
          if(typeof castraWRefreshHud==="function") castraWRefreshHud();
        });
    } else romaSay("Custos", CASTRA_ROMA_LOOKS.custos, [ { la:"Ubi est lucerna mea?", nl:"Waar is mijn lamp?" } ], null);
  } else romaSay("Custos", CASTRA_ROMA_LOOKS.custos, [ { la:"Vale, dux {naam}! Bene vivas!", nl:"Tot ziens, leider {naam}! Het ga je goed!" } ], null);
}

/* Larva: de baas van de diepe catacomben */
function castraLarvaTalk(){
  if(CASTRA_DLG) return;
  romaSay("Larva", CASTRA_ROMA_LOOKS.larva, [ { la:"Larva sum. Hic dormio!", nl:"Ik ben een Larva, een spook. Hier slaap ik!" },
    { la:"Visne me excitare?", nl:"Durf je mij wakker te maken?", opts:[ { la:"Pugno", nl:"vechten" }, { la:"Fuge", nl:"wegrennen" } ] } ],
    k=>{ if(k===0) castraRomaFight("catacumbae", "myt_larva", 22, { key:"boss_boss_larva", reward:{ aes:120, frumentum:60 }, gloria:2, pxp:30, token:true, why:"Larva verslagen" }); });
}

/* ---------- opdrachten in beeld ---------- */
const _castraQuestHudRoma0 = castraQuestHud;
castraQuestHud = function(){
  let extra = "";
  if((CASTRA_W_REGION==="catacumbae_i" || CASTRA_W_REGION==="catacumbae_ii") && castraWQ("custos").step===1)
    extra += `<div class="note" style="text-align:center">📜 ${castraLaHTML("Lucernam refer!", "Haal de lamp van de Custos uit de diepe catacomben (trap bovenin de eerste grot).", "custos_hud")}</div>`;
  return _castraQuestHudRoma0() + extra;
};
const _castraWobjOpusRoma0 = castraWobjOpus;
castraWobjOpus = function(){
  const out = _castraWobjOpusRoma0();
  if(castraWQ("custos").step===1) out.push({ la:"Lucernam refer!", nl:"Roma: haal de lamp van de Custos uit de diepe catacomben (trap bovenin de eerste grot)." });
  return out;
};
