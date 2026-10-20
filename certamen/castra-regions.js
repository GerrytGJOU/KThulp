/* ============================================================================
   CASTRA HEROUM — GROTE REGIO'S: GALLIA, GRAECIA, AEGYPTUS (64 × 48, Pokémon-formaat)
   ----------------------------------------------------------------------------
   Elke regio heeft dezelfde opzet als Roma, data-gedreven uit CASTRA_REGSPEC:
     huis A       quizmaster: dagelijkse vertaalquiz met hele Latijnse zinnen (vanaf niveau 13), boekenkast, 2 kisten
     huis B       rustplek (genezen + ervaring, eenmaal per dag) en een kampioen (dagelijks gevecht), 2 kisten
     grot         zoekopdracht (voorwerp ophalen voor de Grotwachter), baas (dagelijks), 3 kisten
     Venator      dagelijkse jachtopdracht bij de zuidingang
   De deuren staan langs de hoofdweg (tenten); de grot is een rotsingang in het veld.
   Laadt NA castra-roma.js.
   ============================================================================ */

const CASTRA_REGSPEC = {
  gallia: {
    tents:[ { o:"tent_beige", x:40, y:20 }, { o:"tent_white", x:22, y:20 } ], venator:[34,44], folk:"gal",
    houseA:{ nm:"Domus Druidis", nl:"Het huis van de druïde", icon:"🌿", label:"🌿 Domus Druidis", npc:{ nm:"Bardus", role:"gquiz", title:"Carmen bardi" } },
    houseB:{ nm:"Taberna", nl:"De herberg", icon:"🍺", label:"🍺 Taberna", rest:{ nm:"Caupo" }, champ:{ nm:"Pugnator Gallus", form:"gal_bellatorgallus", lvl:26, terrain:"campus" } },
    cave:{ x:10, y:38, nm:"Antrum", nl:"De Gallische grot", icon:"🕳️", label:"🕳️ Antrum", terrain:{ id:"antrum", la:"In antro", nl:"In de grot", taks:["Wolven van Mars","Schimmen"] },
      fetch:{ nm:"Druida", item:"viscum", itemNm:"Viscum", icon:"🌿", itemNl:"maretak",
        ask:{ la:"Salve, hospes {naam}! Viscum quaero.", nl:"Gegroet, gast {naam}! Ik zoek maretak." }, how:{ la:"Descende in antrum et refer viscum.", nl:"Ga diep het grot in en breng de maretak." },
        wait:{ la:"Ubi est viscum?", nl:"Waar is de maretak?" }, thanks:{ la:"Viscum! Gratias tibi ago, dux {naam}!", nl:"De maretak! Dank je wel, leider {naam}!" },
        hud:{ la:"Viscum refer!", nl:"Haal de maretak voor de druïde uit het diepste van de grot." } },
      boss:{ nm:"Centaurus", form:"myt_centaurussagitta", lvl:28, icon:"🏹" } },
    sentences:[ ["Galli in silvis habitant.","De Galliërs wonen in de bossen."],["Druides arbores colunt.","De druïden vereren bomen."],["Bardus carmina cantat.","De barde zingt liederen."],["Caesar Rhenum transit.","Caesar steekt de Rijn over."],["Galli fortiter pugnant.","De Galliërs vechten dapper."],["Oppidum muros altos habet.","De burcht heeft hoge muren."] ],
  },
  graecia: {
    tents:[ { o:"tent_beige", x:14, y:16 }, { o:"tent_white", x:44, y:16 } ], venator:[34,44], folk:"gra",
    houseA:{ nm:"Oraculum", nl:"Het orakel", icon:"🔮", label:"🔮 Oraculum", npc:{ nm:"Pythia", role:"gquiz", title:"Oraculum" } },
    houseB:{ nm:"Gymnasium", nl:"De sportschool", icon:"🏛️", label:"🏛️ Gymnasium", rest:{ nm:"Gymnasiarches" }, champ:{ nm:"Athleta", form:"gra_peltasta", lvl:38, terrain:"urbs" } },
    cave:{ x:56, y:34, nm:"Labyrinthus", nl:"Het labyrint", icon:"🌀", label:"🌀 Labyrinthus", terrain:{ id:"labyrinthus", la:"In labyrintho", nl:"In het labyrint", taks:["Schimmen","Draken"] },
      fetch:{ nm:"Daedalus", item:"filum", itemNm:"Filum Ariadnae", icon:"🧵", itemNl:"draad van Ariadne",
        ask:{ la:"Salve, hospes {naam}! Filum meum quaero.", nl:"Gegroet, gast {naam}! Ik zoek mijn draad." }, how:{ la:"Descende in labyrinthum et refer filum.", nl:"Ga diep het labyrint in en breng de draad van Ariadne." },
        wait:{ la:"Ubi est filum?", nl:"Waar is de draad?" }, thanks:{ la:"Filum meum! Gratias tibi ago, dux {naam}!", nl:"Mijn draad! Dank je wel, leider {naam}!" },
        hud:{ la:"Filum refer!", nl:"Haal de draad van Ariadne voor Daedalus uit het diepste van het labyrint." } },
      boss:{ nm:"Draco", form:"myt_draco", lvl:40, icon:"🐉" } },
    sentences:[ ["Graeci deos multos colunt.","De Grieken vereren veel goden."],["Athenae urbs pulchra est.","Athene is een mooie stad."],["Sparta milites fortes habet.","Sparta heeft sterke soldaten."],["Pythia futurum dicit.","De Pythia voorspelt de toekomst."],["Philosophi in horto disputant.","De filosofen discussiëren in de tuin."],["Naves in mari navigant.","De schepen varen over zee."] ],
  },
  aegyptus: {
    tents:[ { o:"tent_beige", x:40, y:20 }, { o:"tent_white", x:20, y:20 } ], venator:[34,44], folk:"aeg",
    houseA:{ nm:"Templum Isidis", nl:"De tempel van Isis", icon:"🏺", label:"🏺 Templum Isidis", npc:{ nm:"Sacerdos", role:"gquiz", title:"Hieroglyphi" } },
    houseB:{ nm:"Hortus Nili", nl:"De tuin aan de Nijl", icon:"🌴", label:"🌴 Hortus Nili", rest:{ nm:"Hortulanus" }, champ:{ nm:"Custos Pharaonis", form:"aeg_custospharaonis", lvl:50, terrain:"urbs" } },
    cave:{ x:50, y:38, nm:"Pyramis", nl:"De piramide", icon:"🔺", label:"🔺 Pyramis", terrain:{ id:"pyramis", la:"In pyramide", nl:"In de piramide", taks:["Schimmen"] },
      fetch:{ nm:"Sacerdos senex", item:"scarabaeus_sacer", itemNm:"Scarabaeus sacer", icon:"🪲", itemNl:"heilige scarabee",
        ask:{ la:"Salve, hospes {naam}! Scarabaeum sacrum quaero.", nl:"Gegroet, gast {naam}! Ik zoek de heilige scarabee." }, how:{ la:"Descende in pyramidem et refer scarabaeum.", nl:"Ga diep de piramide in en breng de scarabee." },
        wait:{ la:"Ubi est scarabaeus?", nl:"Waar is de scarabee?" }, thanks:{ la:"Scarabaeus! Gratias tibi ago, dux {naam}!", nl:"De scarabee! Dank je wel, leider {naam}!" },
        hud:{ la:"Scarabaeum refer!", nl:"Haal de heilige scarabee voor de priester uit het diepste van de piramide." } },
      boss:{ nm:"Mumia", form:"myt_larva", lvl:54, icon:"👻" } },
    sentences:[ ["Pharao in pyramide sepelitur.","De farao wordt in de piramide begraven."],["Nilus agros aqua rigat.","De Nijl bevloeit de akkers met water."],["Sacerdotes deos colunt.","De priesters vereren de goden."],["Scribae hieroglyphos scribunt.","De schrijvers schrijven hiërogliefen."],["Sol per caelum currit.","De zon loopt door de hemel."],["Cleopatra regina Aegypti est.","Cleopatra is de koningin van Egypte."] ],
  },
};

/* ---------- opbouw per regio ---------- */
function castraRegLook(folk, extra){
  const lk = (CASTRA_FOLKS[folk]||CASTRA_FOLKS.rom).look||{};
  return Object.assign({ huid:lk.huid||"licht", haar:lk.haar||"kort", haarkleur:lk.haarkleur||"bruin", baard:"geen", cape:"geen", helm:"geen", schild:"geen", wapen:"geen", armor:"robe" }, extra||{});
}
const CASTRA_REG_FACADES = {};   // rid -> { pieces:[[o,x,y]], clear:[[x,y]] }
Object.keys(CASTRA_REGSPEC).forEach(rid=>{
  const S = CASTRA_REGSPEC[rid], row = CASTRA_GEO[rid].row, hs = [S.houseA, S.houseB], doors = [], pieces = [], clear = [];
  const idA = "domus_"+rid, idB = "taberna_"+rid, idC = "caverna_"+rid, ids = [idA, idB];
  S.tents.forEach((t,i)=>{
    pieces.push([t.o, t.x, t.y]); const dx = t.x+1, dy = t.y+3;
    doors.push({ x:dx, y:dy, to:ids[i], label:hs[i].label, spawn:{ x:10, y:12, dir:"up" } });
    t.door = { x:dx, y:dy };
    for(let y=t.y;y<=t.y+4;y++) for(let x=t.x-1;x<=t.x+3;x++) clear.push([x,y]);
  });
  const C = S.cave, cx = C.x, cy = C.y;
  [[-1,-1],[0,-1],[1,-1],[-1,0],[1,0]].forEach(([ox,oy],i)=>pieces.push([i%2?"rock_brown":"rock_grey", cx+ox, cy+oy]));
  doors.push({ x:cx, y:cy, to:idC, label:C.label, icon:"🪦", spawn:{ x:14, y:18, dir:"up" } });
  for(let y=cy-2;y<=cy+2;y++) for(let x=cx-2;x<=cx+2;x++) clear.push([x,y]);
  CASTRA_WORLDS[rid].doors = doors; CASTRA_REG_FACADES[rid] = { pieces, clear };
  // terrein van de grot
  CASTRA_VENATIO[rid].terrains.push({ id:C.terrain.id, hidden:true, la:C.terrain.la, nl:C.terrain.nl, prefs:{ inf:2, rng:2, sup:2 }, myth:{ p:0.40, taks:C.terrain.taks } });
  const back = (door, below)=>[ { x:10, y:13, to:rid, spawn:{ x:door.x, y:door.y+1, dir:"down" } }, { x:11, y:13, to:rid, spawn:{ x:door.x, y:door.y+1, dir:"down" } } ];
  const famNpc = (id, nm, role, x, y, extra)=>Object.assign({ id, role, nm, x, y, dir:"down", look:castraRegLook(S.folk, extra&&extra.look) }, extra||{});
  const furn = [ ["crate_a",4,4],["crate_b",4,6],["crate_a",17,4],["crate_b",17,6],["pot",1,1],["pot",20,1],["pot",1,12],["pot",20,12] ];
  CASTRA_INTERIORS[idA] = {
    parent:rid, kind:"house", nm:S.houseA.nm, nl:S.houseA.nl, icon:S.houseA.icon, cols:22, rows:14, start:{ x:10, y:11 }, floor:"stone",
    doors:back(S.tents[0].door), furniture:furn, chests:[ [2,10,"kist_"+idA+"1"], [19,10,"kist_"+idA+"2"] ],
    npcs:[ famNpc("quiz_"+rid, S.houseA.npc.nm, "gquiz", 10, 4, { title:S.houseA.npc.title, sents:S.sentences }) ],
    books:[ { id:"boek_"+idA, x:2, y:2, off:{ gallia:8, graecia:9, aegyptus:10 }[rid] } ],
  };
  CASTRA_INTERIORS[idB] = {
    parent:rid, kind:"house", nm:S.houseB.nm, nl:S.houseB.nl, icon:S.houseB.icon, cols:22, rows:14, start:{ x:10, y:11 }, floor:"plank",
    doors:back(S.tents[1].door), furniture:[ ["barrel",3,2],["barrel",18,2],["crate_c",8,7],["crate_d",13,7],["flower_w",2,12],["flower_p",19,12] ],
    chests:[ [3,10,"kist_"+idB+"1"], [18,10,"kist_"+idB+"2"] ],
    npcs:[ famNpc("rest_"+rid, S.houseB.rest.nm, "grest", 5, 4), famNpc("champ_"+rid, S.houseB.champ.nm, "gchamp", 16, 4, { look:{ armor:"middel", wapen:"zwaard" }, fight:{ terrain:S.houseB.champ.terrain, form:S.houseB.champ.form, lvl:S.houseB.champ.lvl } }) ],
  };
  CASTRA_ITEMS[C.fetch.item] = { nm:C.fetch.itemNm, icon:C.fetch.icon, nl:C.fetch.itemNl };
  CASTRA_INTERIORS[idC] = {
    parent:rid, kind:"cave", nm:C.nm, nl:C.nl, icon:C.icon, cols:30, rows:22, start:{ x:14, y:18 },
    carve:[ [13,17,4,4], [4,10,22,7], [4,3,6,7], [20,3,6,7], [12,2,6,8], [4,17,6,4], [20,17,6,4] ],
    zone:{ t:C.terrain.id, x:5, y:11, w:20, h:4 },
    doors:[ { x:14, y:20, to:rid, spawn:{ x:cx, y:cy+1, dir:"down" } }, { x:15, y:20, to:rid, spawn:{ x:cx, y:cy+1, dir:"down" } } ],
    chests:[ [5,5,"kist_"+idC+"1"], [24,5,"kist_"+idC+"2"], [5,19,"kist_"+idC+"3"] ],
    npcs:[ famNpc("fetch_"+rid, C.fetch.nm, "gfetch", 16, 18, { dir:"left", look:{ armor:"vodden", baard:"baard", haarkleur:"grijs" } }) ],
    pickups:[ { id:C.fetch.item, item:C.fetch.item, x:23, y:19, needs:{ qid:"fetch_"+rid, step:1 } } ],
    bosses:[ { id:"boss_"+rid, nm:C.boss.nm, form:C.boss.form, lvl:C.boss.lvl, icon:C.boss.icon, x:15, y:4, terrain:C.terrain.id, daily:true } ],
  };
  [idA, idB, idC].forEach(castraInteriorRegister);
  // Venator bij de zuidingang
  CASTRA_WENT.push({ id:"venator_"+rid, region:rid, kind:"npc", role:"bounty", nm:"Venator", x:S.venator[0], y:S.venator[1], dir:"left", look:CASTRA_ROMA_LOOKS.venator });
});
const _castraWobjPiecesReg0 = castraWobjPieces;
castraWobjPieces = function(rid){
  const out = _castraWobjPiecesReg0(rid), F = CASTRA_REG_FACADES[rid];
  if(F) F.pieces.forEach(([o,x,y])=>out.push({ o, x, y }));
  return out;
};
const _castraWobjSpotsReg0 = castraWobjSpots;
castraWobjSpots = function(rid){
  const out = _castraWobjSpotsReg0(rid), F = CASTRA_REG_FACADES[rid];
  if(F) F.clear.forEach(c=>out.push(c));
  return out;
};

/* ---------- gedwongen gevecht in een willekeurige regio ---------- */
function castraRegionFight(rid, terrain, form, lvl, boss){
  castraWorldSavePos(CASTRA_W_UI.px, CASTRA_W_UI.py); castraSave(); castraWorldDetach();
  CASTRA_V = castraForcedEncounter(rid, terrain, { form, lvl, boss });
  if(typeof castraCodexSee==="function") castraCodexSee(form);
  CASTRA_V.log = []; CASTRA_V.round = 0; CASTRA_V.fromWorld = true;
  CASTRA_V_PENDING = true;
  go("castraVenatio");
}
const CASTRA_REG_REWARD = { champ:{ aes:90, frumentum:40 }, boss:{ aes:120, frumentum:60 } };

/* ---------- personen aanspreken (algemene rollen) ---------- */
const CASTRA_QUIZ_SENT_BASE = CASTRA_QUIZ_SENT.slice();
const _castraWFeatReg0 = castraWFeat;
castraWFeat = function(e){ if(e.role==="gquiz") return "puzzels"; return _castraWFeatReg0(e); };
const _castraNpcTalkReg0 = castraNpcTalk;
castraNpcTalk = function(id){
  id = String(id);
  const e = CASTRA_WENT.find(x=>"w:"+x.id===id);
  if(e){
    if(e.role==="gquiz") return castraRegQuiz(e);
    if(e.role==="grest") return castraRegRest(e);
    if(e.role==="gchamp") return castraRegChamp(e);
    if(e.role==="gfetch") return castraRegFetch(e);
    if(e.kind==="boss" && CASTRA_REGSPEC[CASTRA_WORLDS[e.region].parent]) return castraRegBoss(e);
    if(e.role==="bounty" && e.id!=="venator_latium" && e.id!=="venator_roma") return castraBountyTalk(e.id);
  }
  return _castraNpcTalkReg0(id);
};
function castraRegQuiz(e){
  if(CASTRA_DLG) return;
  castraLatSay(e.nm, e.look, [ { la:"Salve, dux {naam}! Sententias Latinas interpretare!", nl:"Gegroet, leider {naam}! Vertaal Latijnse zinnen! Vijf vragen.", opts:[ { la:"Incipe", nl:"beginnen" }, { la:"Nunc non", nl:"nu niet" } ] } ],
    k=>{ if(k===0){ CASTRA_QUIZ_KIND = { key:"quiz_"+e.id, rid:CASTRA_WORLDS[e.region].parent, words:CASTRA_QUIZ_SENT_BASE.concat(e.sents||[]), title:e.title }; castraQuizStart(); } });
}
function castraRegRest(e){
  if(CASTRA_DLG) return;
  const w = CASTRA.wday || (CASTRA.wday = {}), key = "rest_"+e.id, done = w[key]===castraWDay();
  castraLatSay(e.nm, e.look, [ { la:"Salve, hospes {naam}! Hic quiescere potes.", nl:"Gegroet, gast {naam}! Hier kun je uitrusten." },
    done ? { la:"Hodie iam quievisti. Cras redi!", nl:"Je hebt vandaag al gerust. Kom morgen terug!" }
         : { la:"Visne quiescere?", nl:"Wil je uitrusten?", opts:[ { la:"Quiesco", nl:"uitrusten" }, { la:"Vale", nl:"tot ziens" } ] } ],
    k=>{
      if(done || k!==0) return;
      const hurt = (CASTRA.soldiers||[]).filter(castraIsHurt); hurt.forEach(s=>{ s.hurtUntil = 0; });
      w[key] = castraWDay(); castraSave(); if(typeof castraPxpAdd==="function") castraPxpAdd(12, "Uitgerust");
      toast("🛏️ "+e.nm, (hurt.length ? hurt.length+" soldaat/soldaten zijn weer gezond. " : "Je soldaten waren al gezond. ")+"+12 ervaring.");
    });
}
function castraRegChamp(e){
  if(CASTRA_DLG) return;
  const key = "champ_"+e.id, done = (CASTRA.wday||{})[key]===castraWDay(), rid = CASTRA_WORLDS[e.region].parent;
  castraLatSay(e.nm, e.look, [ { la:"Salve, dux {naam}! Pugnatorem fortem habeo.", nl:"Gegroet, leider {naam}! Ik heb een sterke vechter." },
    done ? { la:"Hodie eum vicisti. Cras redi!", nl:"Vandaag heb je hem verslagen. Kom morgen terug!" }
         : { la:"Visne cum eo pugnare?", nl:"Durf je tegen hem te vechten? Wie wint, krijgt een beloning.", opts:[ { la:"Pugno", nl:"vechten" }, { la:"Nunc non", nl:"nu niet" } ] } ],
    k=>{ if(!done && k===0) castraRegionFight(rid, e.fight.terrain, e.fight.form, e.fight.lvl, { key, reward:CASTRA_REG_REWARD.champ, gloria:2, pxp:25, token:true, why:"kampioen verslagen" }); });
}
function castraRegFetch(e){
  if(CASTRA_DLG) return;
  const rid = CASTRA_WORLDS[e.region].parent, F = CASTRA_REGSPEC[rid].cave.fetch, q = castraWQ(e.id);
  const say = (lines, done)=>castraLatSay(e.nm, e.look, lines, done);
  if(q.step===0){
    say([ F.ask, F.how ], ()=>{ q.step = 1; castraSave(); castraWobjDraw(); castraWRefreshHud && castraWRefreshHud(); });
  } else if(q.step===1){
    if(castraWItems()[F.item]){
      say([ F.thanks ], ()=>{
        delete castraWItems()[F.item]; q.step = 2;
        const t = castraWGive(Object.assign(castraWScaled({ aes:150, frumentum:75 }, castraWScale(rid)), { gloria:2 }));
        castraSave(); toast(F.icon+" "+castraLaText("recte"), t); castraWobjDraw();
        if(typeof castraPxpAdd==="function") castraPxpAdd(45, "Opdracht voltooid");
        if(typeof castraCardToken==="function") castraCardToken(1, "opdracht voltooid");
        if(typeof castraWRefreshHud==="function") castraWRefreshHud();
      });
    } else say([ F.wait ], null);
  } else say([ { la:"Vale, dux {naam}! Bene vivas!", nl:"Tot ziens, leider {naam}! Het ga je goed!" } ], null);
}
function castraRegBoss(e){
  if(CASTRA_DLG) return;
  const rid = CASTRA_WORLDS[e.region].parent;
  castraLatSay(e.nm, castraRegLook("rom", { armor:"vodden", haarkleur:"grijs", huid:"zeerlicht" }), [ { la:"Custos huius loci sum. Hic maneo!", nl:"Ik ben de bewaker van deze plek. Hier blijf ik!" },
    { la:"Visne mecum pugnare?", nl:"Durf je met mij te vechten?", opts:[ { la:"Pugno", nl:"vechten" }, { la:"Fuge", nl:"wegrennen" } ] } ],
    k=>{ if(k===0) castraRegionFight(rid, e.terrain, e.form, e.lvl, { key:"boss_"+e.id, reward:CASTRA_REG_REWARD.boss, gloria:2, pxp:30, token:true, why:e.nm+" verslagen" }); });
}

/* ---------- opdrachten in beeld ---------- */
const _castraQuestHudReg0 = castraQuestHud;
castraQuestHud = function(){
  let extra = "";
  const W = CASTRA_WORLDS[CASTRA_W_REGION], rid = W && W.parent;
  if(rid && CASTRA_REGSPEC[rid] && W.id==="caverna_"+rid && castraWQ("fetch_"+rid).step===1){
    const h = CASTRA_REGSPEC[rid].cave.fetch.hud;
    extra += `<div class="note" style="text-align:center">📜 ${castraLaHTML(h.la, h.nl, "fetch_hud_"+rid)}</div>`;
  }
  return _castraQuestHudReg0() + extra;
};
const _castraWobjOpusReg0 = castraWobjOpus;
castraWobjOpus = function(){
  const out = _castraWobjOpusReg0();
  Object.keys(CASTRA_REGSPEC).forEach(rid=>{ if(castraWQ("fetch_"+rid).step===1){ const h = CASTRA_REGSPEC[rid].cave.fetch.hud; out.push({ la:h.la, nl:CASTRA_WORLDS[rid].nm+": "+h.nl }); } });
  return out;
};

/* ---------- woordenlijst ---------- */
Object.assign(CASTRA_GLOSS, {
  "pugnatorem":"vechter (4e naamval)", "custos":"bewaker", "huius":"van deze", "loci":"plaats (van deze plaats)", "maneo":"ik blijf", "mecum":"met mij", "pugnare":"vechten",
  "viscum":"maretak", "antro":"in de grot", "pyramide":"in de piramide", "labyrintho":"in het labyrint", "antrum":"grot", "filum":"draad", "labyrinthum":"labyrint (4e naamval)", "scarabaeum":"scarabee (4e naamval)", "scarabaeus":"scarabee", "pyramidem":"piramide (4e naamval)",
  "sacrum":"heilig (4e naamval)", "meum":"mijn (4e naamval)", "quiescere":"uitrusten", "quievisti":"je hebt gerust", "quiesco":"ik rust uit",
});
