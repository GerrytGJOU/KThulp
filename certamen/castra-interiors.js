/* ============================================================================
   CASTRA HEROUM — BINNENRUIMTES (GROTTEN EN GEBOUWEN) ALS EXTRA LAAG
   ----------------------------------------------------------------------------
   Een regio kan deuren hebben (CASTRA_WORLDS[regio].doors): loop je op een deurtegel
   dan kom je in een binnenruimte — een kleine eigen kaart met eigen objecten en,
   in een grot, eigen ontmoetingen. Binnenruimtes zijn gewone "werelden" met
   interior:true en parent:"regio"; de uitgang is weer een deur naar de moederregio.
   Op de wereldkaart, bij snelreizen en in de regioroute tellen ze als hun moederregio.

   Eerste proef (Latium, de eerste regio, nu 64 × 48):
     Specus Lupae   grot in het bos: donkere gangen, 3 kisten, ontmoetingen "In specu"
                    met wolven van Mars en schimmen.
     Hospitium      herberg bij de weg: de waardin laat je soldaten uitrusten
                    (genezen, eenmaal per dag), een boekenkast met een Latijns
                    spreekwoord van de dag (+3 XP) en een kist.
   Deuren zijn actief vanaf Castra-niveau 3 (ontgrendeling "wereld").
   Laadt NA castra-geo.js.
   ============================================================================ */

const CASTRA_INTERIORS = {
  specus_latium: {
    parent:"latium", kind:"cave", nm:"Specus Lupae", nl:"De grot van de wolvin", icon:"🕳️", cols:26, rows:20,
    start:{ x:12, y:17 },
    // uitgesneden ruimtes [x, y, breedte, hoogte]; alles daarbuiten is rots
    carve:[ [11,15,4,5], [4,8,18,7], [3,3,6,5], [17,3,6,5], [11,2,4,6] ],
    zone:{ t:"specus", x:6, y:9, w:14, h:5 },                       // ontmoetingsgebied (lichtere vloer)
    doors:[ { x:12, y:19, to:"latium", spawn:{ x:9, y:23, dir:"down" } }, { x:13, y:19, to:"latium", spawn:{ x:9, y:23, dir:"down" } },
            { x:12, y:2, to:"specus_altus", icon:"🪜", spawn:{ x:12, y:4, dir:"down" } }, { x:13, y:2, to:"specus_altus", icon:"🪜", spawn:{ x:13, y:4, dir:"down" } } ],   // trap naar beneden
    chests:[ [4,4,"kist_specus1"], [21,4,"kist_specus2"], [12,3,"kist_specus3"] ],
    npcs:[ { id:"eremita", role:"eremita", nm:"Eremita", x:14, y:5, dir:"left", look:{ huid:"getint", haar:"lang", haarkleur:"grijs", baard:"baard", cape:"geen", helm:"geen", schild:"geen", wapen:"geen", armor:"vodden" } } ],
  },
  specus_altus: {
    parent:"latium", kind:"cave", nm:"Specus altus", nl:"De diepe grot", icon:"🕳️", cols:26, rows:20, start:{ x:12, y:4 },
    carve:[ [11,2,4,6], [3,8,20,7], [3,3,6,5], [17,3,6,5], [3,15,6,4], [10,15,6,4], [17,15,6,4] ],
    zone:{ t:"specus", x:5, y:9, w:16, h:5 },
    doors:[ { x:12, y:2, to:"specus_latium", icon:"🪜", spawn:{ x:12, y:4, dir:"up" } }, { x:13, y:2, to:"specus_latium", icon:"🪜", spawn:{ x:13, y:4, dir:"up" } } ],
    chests:[ [4,4,"kist_altus1"], [21,4,"kist_altus2"], [4,17,"kist_altus3"], [21,17,"kist_altus4"] ],
    pickups:[ { id:"aqua", item:"aqua", x:12, y:17, needs:{ qid:"eremita", step:1 } } ],
  },
  villa_latium: {
    parent:"latium", kind:"house", nm:"Hospitium", nl:"De herberg", icon:"🏠", cols:20, rows:14,
    start:{ x:10, y:11 },
    doors:[ { x:10, y:13, to:"latium", spawn:{ x:38, y:36, dir:"down" } },
            { x:19, y:6, to:"solarium_latium", icon:"🪜", feat:"puzzels", spawn:{ x:1, y:6, dir:"right" } } ],      // trap naar de zolder (vanaf niveau 13)
    furniture:[ ["barrel",2,1],["pot",3,1],["crate_a",16,1],["crate_b",17,1],["bucket",2,2],["plant_a",1,11],["plant_b",18,11],["flower_o",17,11],["stump",14,8],["barrel",5,8],["crate_c",4,10] ],
    chests:[ [16,3,"kist_villa1"] ],
    host:{ x:10, y:4, id:"matrona_villa" },
    book:{ x:3, y:3, id:"boek_villa" },
  },
  solarium_latium: {
    parent:"latium", kind:"house", nm:"Solarium", nl:"De zolder van de herberg", icon:"🏠", cols:16, rows:12, start:{ x:2, y:6 },
    doors:[ { x:0, y:6, to:"villa_latium", icon:"🪜", spawn:{ x:18, y:6, dir:"left" } } ],
    furniture:[ ["barrel",1,1],["pot",14,1],["crate_d",1,10],["flower_w",14,10],["plant_a",7,10],["plant_c",8,10] ],
    chests:[ [13,8,"kist_solarium1"] ],
    npcs:[ { id:"senator", role:"senator", nm:"Senator", x:8, y:4, dir:"down", look:{ huid:"licht", haar:"kort", haarkleur:"grijs", baard:"geen", cape:"lang", capekleur:"paars", helm:"geen", schild:"geen", wapen:"geen", armor:"ceremonieel" } } ],
    books:[ { id:"boek_solarium1", x:3, y:2, off:1 }, { id:"boek_solarium2", x:12, y:2, off:2 } ],
  },
};
const CASTRA_MATRONA_LOOK = { huid:"licht", haar:"knot", haarkleur:"bruin", baard:"geen", cape:"geen", helm:"geen", schild:"geen", wapen:"geen", armor:"robe" };
const CASTRA_PROVERBIA = [
  { la:"Festina lente.", nl:"Haast je langzaam." },
  { la:"Carpe diem.", nl:"Pluk de dag." },
  { la:"Veni, vidi, vici.", nl:"Ik kwam, ik zag, ik overwon." },
  { la:"Alea iacta est.", nl:"De teerling is geworpen." },
  { la:"Per aspera ad astra.", nl:"Door moeilijkheden naar de sterren." },
  { la:"Docendo discimus.", nl:"Al doende leren we." },
  { la:"Fortes fortuna adiuvat.", nl:"Het geluk helpt de dapperen." },
  { la:"Ubi bene, ibi patria.", nl:"Waar het goed is, is mijn vaderland." },
];

/* ---------- registratie als werelden en wereldobjecten ---------- */
// Registreert een binnenruimte uit CASTRA_INTERIORS als wereld en maakt zijn objecten aan (ook te gebruiken door latere bestanden).
function castraInteriorRegister(id){
  {
    const I = CASTRA_INTERIORS[id];
    CASTRA_WORLDS[id] = { ...CASTRA_WORLD_BASE, id, nm:I.nm, icon:I.icon, interior:true, parent:I.parent, cols:I.cols, rows:I.rows, view:{ cols:16, rows:11 },
      start:I.start, exit:[], roads:[], water:[], zones:[], seed:7000+id.length, base: I.floor || (I.kind==="cave"?"stoneb":"plank"), doors:I.doors, encounterChance:0.2, trees:["tree_a","tree_b"], big:"tree_big", sparse:0, dense:0, denseZone:"" };
    (I.chests||[]).forEach(c=>CASTRA_WENT.push({ id:c[2], region:id, kind:"chest", x:c[0], y:c[1] }));
    if(I.host) CASTRA_WENT.push({ id:I.host.id, region:id, kind:"npc", role:"host", nm:"Matrona", x:I.host.x, y:I.host.y, dir:"down", look:CASTRA_MATRONA_LOOK });
    if(I.book) CASTRA_WENT.push({ id:I.book.id, region:id, kind:"book", x:I.book.x, y:I.book.y, off:0 });
    (I.books||[]).forEach(b=>CASTRA_WENT.push({ id:b.id, region:id, kind:"book", x:b.x, y:b.y, off:b.off||0 }));
    (I.npcs||[]).forEach(n=>CASTRA_WENT.push({ id:n.id, region:id, kind:"npc", role:n.role, nm:n.nm, x:n.x, y:n.y, dir:n.dir||"down", look:n.look }));
    (I.pickups||[]).forEach(p=>CASTRA_WENT.push({ id:p.id, region:id, kind:"pickup", item:p.item, x:p.x, y:p.y, needs:p.needs }));
    (I.bosses||[]).forEach(b=>CASTRA_WENT.push(Object.assign({ icon:"👹" }, b, { region:id, kind:"boss" })));
  }
}
Object.keys(CASTRA_INTERIORS).forEach(castraInteriorRegister);

/* ---------- kaartopbouw van een binnenruimte ---------- */
function castraInteriorDef(W){
  const I = CASTRA_INTERIORS[W.id], cols = I.cols, rows = I.rows;
  const g = castraGroundGrid(cols, rows, W.base), pieces = [], walls = [], tall = {};
  if(I.kind==="cave"){
    const open = {};
    I.carve.forEach(([x,y,w,h])=>{ for(let yy=y; yy<y+h; yy++) for(let xx=x; xx<x+w; xx++) open[xx+","+yy] = 1; });
    for(let y=0;y<rows;y++) for(let x=0;x<cols;x++){ if(!open[x+","+y]) pieces.push({ o:((x*3+y*5)%4<2)?"rock_grey":"rock_brown", x, y }); }
    const z = I.zone; for(let y=z.y;y<z.y+z.h;y++) for(let x=z.x;x<z.x+z.w;x++){ if(open[x+","+y]){ g[y][x] = z.floor || "stone"; tall[x+","+y] = z.t; } }
  } else {
    for(let y=0;y<rows;y++) for(let x=0;x<cols;x++){
      const edge = x===0||y===0||x===cols-1||y===rows-1; if(!edge) continue;
      if(I.doors.some(d=>d.x===x&&d.y===y)) continue;
      g[y][x] = "wall"; walls.push([x,y]);
    }
    (I.furniture||[]).forEach(([o,x,y])=>pieces.push({ o, x, y }));
    if(I.pool){ const [px,py,pw,ph] = I.pool; for(let y=py;y<py+ph;y++) for(let x=px;x<px+pw;x++){ g[y][x] = "water"; walls.push([x,y]); } }   // zwembad: niet begaanbaar
  }
  // vrijhouden van objecten in de wereldlogica
  return { cols, rows, ground:g, pieces, walls, tall };
}

/* ---------- deuren ---------- */
function castraGeoDoor(x, y){
  const W = castraWorldCfg(); const d = (W.doors||[]).find(d=>d.x===x && d.y===y); if(!d) return false;
  if(typeof castraUnlocked==="function" && !castraUnlocked(d.feat || "wereld")) return false;      // vóór het vereiste niveau doet de deur niets
  castraWorldSavePos(CASTRA_W_UI.px, CASTRA_W_UI.py); castraWorldDetach();
  const to = CASTRA_WORLDS[d.to];
  CASTRA_W_REGION = d.to; CASTRA_GEO_SPAWN = d.spawn;
  if(to && to.interior && typeof toast==="function") toast(to.icon+" "+to.nm, to.nl||"");
  go("castraWorld"); return true;
}
// Gevels en toegangen in Latium (kaartstukken) en vrij te houden tegels.
const CASTRA_LATIUM_FACADES = [ ["tent_beige",37,32], ["rock_grey",8,21],["rock_grey",9,21],["rock_grey",10,21],["rock_brown",8,22],["rock_brown",10,22] ];
const _castraWobjPiecesInt0 = castraWobjPieces;
castraWobjPieces = function(rid){
  const out = _castraWobjPiecesInt0(rid);
  if(rid==="latium") CASTRA_LATIUM_FACADES.forEach(([o,x,y])=>out.push({ o, x, y }));
  return out;
};
const _castraWobjSpotsInt0 = castraWobjSpots;
castraWobjSpots = function(rid){
  const out = _castraWobjSpotsInt0(rid), W = CASTRA_WORLDS[rid];
  (W && W.doors || []).forEach(d=>{ out.push([d.x,d.y]); });
  if(rid==="latium"){ [[9,23],[38,36],[37,35],[39,35],[36,36],[40,36]].forEach(c=>out.push(c)); }
  return out;
};
// Schaal van beloningen volgt de moederregio.
castraWScale = function(rid){ const W = CASTRA_WORLDS[rid]; const base = (W && W.parent) || rid; return 1 + 0.4*Math.max(0, Object.keys(CASTRA_WORLDS).filter(k=>!CASTRA_WORLDS[k].interior).indexOf(base)); };
// Eigen uiterlijk van een persoon (Matrona).
const _castraWLookInt0 = castraWLook;
castraWLook = function(e){ return e.look ? e.look : _castraWLookInt0(e); };

/* ---------- tekenen: deuren en boekenkast ---------- */
const _castraWobjDrawInt0 = castraWobjDraw;
castraWobjDraw = function(){
  _castraWobjDrawInt0();
  const box = el("cwWobj"); if(!box) return;
  const W = castraWorldCfg(), unl = (typeof castraUnlocked!=="function") || castraUnlocked("wereld");
  let html = "";
  (W.doors||[]).forEach(d=>{
    const to = CASTRA_WORLDS[d.to], enter = to && to.interior, ok = unl && (!d.feat || castraUnlocked(d.feat));
    html += `<div style="position:absolute;left:${d.x*48}px;top:${d.y*48}px;width:48px;height:48px;z-index:3;display:flex;align-items:center;justify-content:center;font-size:30px;pointer-events:none;${ok||!enter?"":"opacity:.35;filter:grayscale(1)"}">${d.icon || (enter ? to.icon : "🚪")}</div>`;
    if(d.label) html += `<div style="position:absolute;left:${d.x*48-60}px;top:${d.y*48-24}px;width:168px;text-align:center;z-index:7;font-size:12px;font-weight:bold;color:#fff;text-shadow:0 1px 3px #000,0 0 6px #000;pointer-events:none">${esc(d.label)}</div>`;
  });
  castraWEnts().filter(e=>e.kind==="boss" && castraWEntVisible(e)).forEach(e=>{
    html += `<div style="position:absolute;left:${e.x*48}px;top:${e.y*48}px;width:48px;height:48px;z-index:4;display:flex;align-items:center;justify-content:center;font-size:36px;pointer-events:none;animation:castraBlink 1.4s infinite">${e.icon}</div>`;
  });
  castraWEnts().filter(e=>e.kind==="book").forEach(e=>{
    html += `<div style="position:absolute;left:${e.x*48}px;top:${e.y*48}px;width:48px;height:48px;z-index:3;display:flex;align-items:center;justify-content:center;font-size:32px;pointer-events:none">📚</div>`;
  });
  if(html) box.insertAdjacentHTML("beforeend", html);
};

/* ---------- Matrona (herberg) en de boekenkast ---------- */
const _castraNpcTalkInt0 = castraNpcTalk;
castraNpcTalk = function(id){
  id = String(id);
  if(id==="w:matrona_villa"){ castraMatronaTalk(); return; }
  if(id.indexOf("w:boek_")===0){ castraBoekLees(id); return; }
  if(id==="w:eremita"){ castraEremitaTalk(); return; }
  if(id==="w:senator"){ castraQuizOpen(); return; }
  if(id==="w:venator_latium"){ castraBountyTalk("venator_latium"); return; }
  return _castraNpcTalkInt0(id);
};
function castraMatronaTalk(){
  if(CASTRA_DLG) return;
  const e = CASTRA_WENT.find(x=>x.id==="matrona_villa"), w = CASTRA.wday || (CASTRA.wday = {});
  const done = w.hospitium===castraWDay();
  const lines = [ { la:"Salve, hospes {naam}! Hic quiescere potes.", nl:"Gegroet, gast {naam}! Hier kun je uitrusten." },
    done ? { la:"Hodie iam quievisti. Cras redi!", nl:"Je hebt vandaag al gerust. Kom morgen terug!" }
         : { la:"Visne quiescere?", nl:"Wil je uitrusten?", opts:[ { la:"Quiesco", nl:"uitrusten" }, { la:"Vale", nl:"tot ziens" } ] } ];
  castraDlgOpen({ nm:"Matrona", look:CASTRA_MATRONA_LOOK }, lines, k=>{
    if(k===0){
      const hurt = (CASTRA.soldiers||[]).filter(castraIsHurt);
      hurt.forEach(s=>{ s.hurtUntil = 0; }); w.hospitium = castraWDay(); castraSave();
      toast("🏠 Hospitium", hurt.length ? hurt.length+" soldaat/soldaten zijn weer gezond." : "Je soldaten waren al gezond.");
    }
  });
}
function castraBoekLees(id){
  const e = CASTRA_WENT.find(x=>"w:"+x.id===String(id)) || {}, off = e.off || 0, key = "boek_"+(e.id||"villa");
  const w = CASTRA.wday || (CASTRA.wday = {}), d = castraWDay(), idx = (Math.floor(castraNow()/86400000) + off) % CASTRA_PROVERBIA.length, p = CASTRA_PROVERBIA[idx], first = w[key]!==d;
  if(first){ w[key] = d; castraSave(); if(typeof castraPxpAdd==="function") castraPxpAdd(3); }
  const panel = el("cwPanel"); if(!panel) return;
  panel.innerHTML = `<div class="panel"><h3 style="margin:0 0 6px">📚 Proverbium diei <small>spreekwoord van de dag</small></h3>
    <div style="font-size:22px;margin:6px 0">${castraLaHTML(p.la, p.nl, "prov_"+idx)}</div>
    <div class="note">${first?"✔ Gelezen: +3 XP. Morgen staat er een nieuw spreekwoord.":"Je hebt het spreekwoord van vandaag al gelezen."}</div>
    <button class="btn" style="margin-top:6px;min-height:44px" onclick="castraNpcClose()">Sluiten</button></div>`;
  panel.scrollIntoView({ behavior:"smooth", block:"nearest" });
}
