/* ============================================================================
   CASTRA HEROUM — RONDLOPENDE BEWONERS (sfeer-NPC's met een stukje Latijn)
   ----------------------------------------------------------------------------
   In elke buitenregio lopen een paar bewoners rond (boer, moeder, kind, oude man, koopman, herder). Ze
   zijn gebouwd uit dezelfde top-down avatar-lagen als de speler (RPG Maker MV), maar gekleed in vodden,
   gewaden of een lichte mantel in plaats van een harnas, met het uiterlijk van het volk van de regio.
   Ze lopen op rustige stappen binnen een klein gebied rond hun thuisplek, mijden hoog gras, deuren en
   de uitgang, en blijven staan als je ze aanspreekt. Een gesprek is één tot twee korte Latijnse zinnen
   (tikbare woorden, vertaling via ⓘ): algemene zinnen per type bewoner, en een regionale zin per regio.
   Het aantal en de plek volgen uit de regio en de dag (zelfde plekken per dag), nooit opgeslagen.
   Zonder gevolgen voor opdrachten of voortgang: puur sfeer en extra leesoefening.
   Laadt NA castra-diarium.js (haakt in castraWobjDraw, castraNpcAt en castraNpcTalk).
   ============================================================================ */

// sheets: complete personages uit de RPG Maker MV-sheets in assets/npcs/ ([bestand, personage 0-7]); zonder die bestanden
// (of als ze niet laden) wordt de bewoner uit de avatar-lagen gebouwd (look).
const CASTRA_AMB_TYPES = [
  { id:"agricola", nm:"Agricola",  w:3, sheets:[["People3.png",4],["People4.png",2]], look:{ armor:"vodden", baard:"baard", haarkleur:"bruin", cape:"geen" } },
  { id:"mater",    nm:"Mater",     w:3, sheets:[["People1.png",5],["People4.png",3],["People4.png",5]], look:{ armor:"robe",   baard:"geen",  haar:"vlecht", cape:"geen" } },
  { id:"puer",     nm:"Puer",      w:2, sheets:[["People1.png",0]], look:{ armor:"vodden", baard:"geen",  haar:"kort",   cape:"geen" } },
  { id:"puella",   nm:"Puella",    w:2, sheets:[["People4.png",1]], look:{ armor:"robe",   baard:"geen",  haar:"vlecht", cape:"geen" } },
  { id:"senex",    nm:"Senex",     w:2, sheets:[["People1.png",6],["People4.png",4]], look:{ armor:"robe",   baard:"baard", haarkleur:"grijs", cape:"kort", capekleur:"blauw" } },
  { id:"anus",     nm:"Anus",      w:1, sheets:[["People1.png",7]], look:{ armor:"robe",   baard:"geen",  haar:"knot", haarkleur:"grijs", cape:"geen" } },
  { id:"mercator", nm:"Mercator",  w:2, sheets:[["People1.png",4],["People4.png",6]], look:{ armor:"middel", baard:"snor",  cape:"kort",   capekleur:"oranje" } },
  { id:"pastor",   nm:"Pastor",    w:2, sheets:[["People4.png",0]], look:{ armor:"vodden", baard:"geen",  cape:"kort",   capekleur:"groen" } },
  { id:"sacerdos", nm:"Sacerdos",  w:1, sheets:[["People2.png",2],["People4.png",7]], look:{ armor:"robe",   baard:"geen",  haar:"kort", cape:"lang", capekleur:"paars" } },
];
const CASTRA_AMB_LINES = {
  agricola:[ [ "Frumentum bonum est hoc anno.", "Het graan is dit jaar goed." ], [ "Terra bona est, sed labor magnus est.", "De grond is goed, maar het werk is zwaar." ], [ "Pluvia agros iuvat.", "De regen helpt de akkers." ] ],
  mater:[ [ "Filii mei in agro ludunt.", "Mijn kinderen spelen op het veld." ], [ "Panem coquo. Vis panem, hospes?", "Ik bak brood. Wil je brood, gast?" ], [ "Pax bona est. Gaudeo.", "Er is vrede. Ik ben blij." ] ],
  puer:[ [ "Salve! Tu miles es?", "Hallo! Ben jij een soldaat?" ], [ "Ego quoque miles esse volo!", "Ik wil ook soldaat worden!" ], [ "Ludo cum amicis meis.", "Ik speel met mijn vrienden." ] ],
  senex:[ [ "Olim miles eram, sed nunc senex sum.", "Vroeger was ik soldaat, maar nu ben ik oud." ], [ "Multa vidi in vita mea.", "Ik heb veel gezien in mijn leven." ], [ "Audi, hospes: sapientia melior est quam aurum.", "Luister, gast: wijsheid is beter dan goud." ] ],
  mercator:[ [ "Mercator sum. Multas res habeo.", "Ik ben koopman. Ik heb veel spullen." ], [ "Vinum et panem ad urbem porto.", "Ik breng wijn en brood naar de stad." ], [ "Via longa est, sed pecunia bona est.", "De weg is lang, maar het geld is goed." ] ],
  puella:[ [ "Mater mea panem coquit.", "Mijn moeder bakt brood." ], [ "Flores pulchri sunt!", "De bloemen zijn mooi!" ], [ "Cum matre in agro laboro.", "Ik werk met mijn moeder op het veld." ] ],
  anus:[ [ "Nepotes meos amo.", "Ik hou van mijn kleinkinderen." ], [ "Vita longa est, sed bona.", "Het leven is lang, maar goed." ], [ "Cave, hospes: via longa est.", "Pas op, gast: de weg is lang." ] ],
  sacerdos:[ [ "Deos colo et pacem peto.", "Ik vereer de goden en vraag om vrede." ], [ "Dei te iuvant, hospes.", "De goden helpen je, gast." ], [ "In templo orare debes.", "Je moet in de tempel bidden." ] ],
  pastor:[ [ "Oves meas curo.", "Ik zorg voor mijn schapen." ], [ "Lupus in silva est! Cave, hospes!", "Er is een wolf in het bos! Pas op, gast!" ], [ "Sol calet. Aquam quaero.", "De zon is heet. Ik zoek water." ] ],
};
const CASTRA_AMB_REGION = {
  latium:[ "Roma urbs magna est.", "Rome is een grote stad." ], graecia:[ "Mare pulchrum est in Graecia.", "De zee is mooi in Griekenland." ],
  troia:[ "Muri Troiae alti sunt.", "De muren van Troje zijn hoog." ], gallia:[ "Silvae Galliae magnae sunt.", "De bossen van Gallië zijn groot." ],
  aegyptus:[ "Nilus agros nostros alit.", "De Nijl voedt onze akkers." ], persis:[ "Rex noster magnus est.", "Onze koning is groot." ],
  africa:[ "Sol in Africa calidus est.", "De zon is heet in Afrika." ], roma:[ "Forum plenum hominum est.", "Het Forum zit vol mensen." ],
  laconia:[ "Spartiatae fortes sunt.", "De Spartanen zijn dapper." ], germania:[ "Silva densa est. Cave!", "Het bos is dicht. Pas op!" ],
  themiscyra:[ "Amazones equitant per campos.", "De Amazones rijden over de velden." ],
};
const CASTRA_AMB = { list:[], region:null, timer:null, id:0, sheetOk:false };
const CASTRA_AMB_HAIR = ["kort","lang","middel","knot","vlecht","wild"], CASTRA_AMB_COL = ["zwart","bruin","blond","rood","grijs"];

function castraAmbRng(rid){ let h = 2166136261; const day = (typeof castraWDay==="function") ? castraWDay() : "x"; (rid+"|"+day).split("").forEach(c=>{ h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); }); return castraRng(h>>>0); }
function castraAmbLook(type, folk, rng){
  const fo = CASTRA_FOLKS[folk] || CASTRA_FOLKS.rom, lk = fo.look || {};
  const base = { huid:lk.huid||"licht", haar:CASTRA_AMB_HAIR[Math.floor(rng()*CASTRA_AMB_HAIR.length)], haarkleur:lk.haarkleur||CASTRA_AMB_COL[Math.floor(rng()*CASTRA_AMB_COL.length)], baard:"geen", cape:"geen", helm:"geen", schild:"geen", wapen:"geen" };
  const look = { ...base, ...type.look };
  if(!type.look.haarkleur && rng()<0.5) look.haarkleur = CASTRA_AMB_COL[Math.floor(rng()*CASTRA_AMB_COL.length)];
  if(type.id==="puer" && rng()<0.4) look.haar = "wild";
  return look;
}
function castraAmbWalkable(x, y, W){
  if(x<1 || y<1 || x>=W.cols-1 || y>=W.rows-1) return false;
  if(castraWBlocked(x,y)) return false;
  if(castraWorldBuilt().tall[x+","+y]) return false;
  if((W.doors||[]).some(d=>d.x===x&&d.y===y) || (W.exit||[]).some(d=>d.x===x&&d.y===y)) return false;
  if(CASTRA_W_UI && CASTRA_W_UI.px===x && CASTRA_W_UI.py===y) return false;
  return true;
}
function castraAmbSpawn(){
  const rid = CASTRA_W_REGION, W = castraWorldCfg(); CASTRA_AMB.list = []; CASTRA_AMB.region = rid;
  if(!W || W.interior) return;
  const rng = castraAmbRng(rid), folk = (typeof CASTRA_WREG!=="undefined" && CASTRA_WREG[rid] && CASTRA_WREG[rid].folk) || "rom";
  const n = Math.max(3, Math.min(7, Math.round(W.cols*W.rows/480)));
  const tot = CASTRA_AMB_TYPES.reduce((a,t)=>a+t.w,0);
  const start = W.start || { x:Math.floor(W.cols/2), y:Math.floor(W.rows/2) };
  for(let i=0, tries=0; i<n && tries<400; tries++){
    const x = 2+Math.floor(rng()*(W.cols-4)), y = 2+Math.floor(rng()*(W.rows-4));
    if(!castraAmbWalkable(x,y,W) || Math.abs(x-start.x)+Math.abs(y-start.y) < 5 || CASTRA_AMB.list.some(a=>Math.abs(a.x-x)+Math.abs(a.y-y)<6)) continue;
    let r = rng()*tot, type = CASTRA_AMB_TYPES[0]; for(const t of CASTRA_AMB_TYPES){ r -= t.w; if(r<=0){ type = t; break; } }
    // liefst een personage dat er in deze regio nog niet loopt
    const free = type.sheets ? type.sheets.filter(t=>!CASTRA_AMB.list.some(o=>o.sheet && o.sheet.f===t[0] && o.sheet.i===t[1])) : [];
    if(CASTRA_AMB.sheetOk && type.sheets && !free.length && CASTRA_AMB.list.some(o=>o.type===type)) continue;
    const sh = (CASTRA_AMB.sheetOk && type.sheets) ? (free.length ? free : type.sheets)[Math.floor(rng()*(free.length || type.sheets.length))] : null;
    CASTRA_AMB.list.push({ id:"a"+(CASTRA_AMB.id++), type, sheet:sh ? { f:sh[0], i:sh[1] } : null, x, y, hx:x, hy:y, dir:["down","left","right","up"][Math.floor(rng()*4)], frame:1, look:castraAmbLook(type, folk, rng), talking:false, seed:Math.floor(rng()*1e6) });
    i++;
  }
}
// Een frame uit een RPG Maker MV-sheet: 8 personages per sheet (4 x 2 blokken van 3 x 4 frames van 48 px).
function castraSheetHTML(sh, dir, frame, size){
  const k = size/48, x0 = (sh.i%4)*144, y0 = Math.floor(sh.i/4)*192, row = ({ down:0, left:1, right:2, up:3 })[dir] || 0;
  return `<div style="width:${size}px;height:${size}px;background-image:url(assets/npcs/${sh.f}?v=1);background-repeat:no-repeat;background-size:${576*k}px ${384*k}px;background-position:${-(x0+frame*48)*k}px ${-(y0+row*48)*k}px;image-rendering:pixelated"></div>`;
}
function castraAmbHTML(a){ return a.sheet ? castraSheetHTML(a.sheet, a.dir, a.frame, 48) : castraAvatarHTML(a.look, a.dir, a.frame, 48); }
// Bestaan de sheets? Zo niet, dan blijft alles uit de avatar-lagen gebouwd.
(function(){ const im = new Image(); im.onload = ()=>{ CASTRA_AMB.sheetOk = true; CASTRA_AMB.region = null; CASTRA_AMB.list = []; }; im.onerror = ()=>{ CASTRA_AMB.sheetOk = false; }; im.src = "assets/npcs/People1.png?v=1"; })();
function castraAmbLayer(){
  const map = el("cwMap"); if(!map) return null;
  let L = el("cwAmb");
  if(!L){ map.insertAdjacentHTML("beforeend", `<div id="cwAmb" style="position:absolute;left:0;top:0;width:0;height:0;z-index:4"></div>`); L = el("cwAmb"); L.dataset.n = ""; }
  return L;
}
function castraAmbDraw(){
  const L = castraAmbLayer(); if(!L) return;
  CASTRA_AMB.list.forEach(a=>{
    let d = document.getElementById("cwAmb_"+a.id);
    if(!d){ d = document.createElement("div"); d.id = "cwAmb_"+a.id; d.style.cssText = "position:absolute;width:48px;height:48px;pointer-events:none;transition:left .6s linear,top .6s linear"; L.appendChild(d); d.dataset.s = ""; }
    d.style.left = a.x*48+"px"; d.style.top = a.y*48+"px";
    const key = a.dir+a.frame; if(d.dataset.s!==key){ d.dataset.s = key; d.innerHTML = castraAmbHTML(a); }
  });
}
function castraAmbTick(){
  if(!el("cwMap")){ clearInterval(CASTRA_AMB.timer); CASTRA_AMB.timer = null; CASTRA_AMB.region = null; CASTRA_AMB.list = []; return; }
  if(CASTRA_AMB.region!==CASTRA_W_REGION) castraAmbSpawn();
  const W = castraWorldCfg(), DIRS = { up:[0,-1], down:[0,1], left:[-1,0], right:[1,0] };
  CASTRA_AMB.list.forEach(a=>{
    if(a.talking){ a.frame = 1; return; }
    a.seed = (Math.imul(a.seed, 1103515245) + 12345) >>> 0; const r = (a.seed>>>8) % 100;
    if(r < 38){
      const names = Object.keys(DIRS), dir = names[(a.seed>>>3) % 4], dx = DIRS[dir][0], dy = DIRS[dir][1], nx = a.x+dx, ny = a.y+dy;
      a.dir = dir;
      if(Math.abs(nx-a.hx)+Math.abs(ny-a.hy) <= 4 && castraAmbWalkable(nx, ny, W) && !CASTRA_AMB.list.some(o=>o!==a && o.x===nx && o.y===ny)){ a.x = nx; a.y = ny; a.frame = a.frame===1 ? 0 : (a.frame===0 ? 2 : 0); }
      else a.frame = 1;
    } else a.frame = 1;
  });
  if(!el("cwAmb")) document.querySelectorAll("[id^=cwAmb_]").forEach(n=>n.remove());
  castraAmbDraw();
}
function castraAmbStart(){
  if(!el("cwMap")) return;
  if(CASTRA_AMB.region!==CASTRA_W_REGION) castraAmbSpawn();
  ["getint","licht","olijf","brons","zeerlicht","donker"].forEach(h=>{ try{ castraProbeBase(h).then(castraAmbDraw); }catch(e){} });
  castraAmbDraw();
  if(!CASTRA_AMB.timer) CASTRA_AMB.timer = setInterval(castraAmbTick, 750);
}
const _castraWobjDrawAmb0 = castraWobjDraw;
castraWobjDraw = function(){ _castraWobjDrawAmb0(); try{ castraAmbStart(); }catch(e){ console.error(e); } };

/* ---------- aanspreken ---------- */
const _castraNpcAtAmb0 = castraNpcAt;
castraNpcAt = function(x, y){
  const r = _castraNpcAtAmb0(x, y); if(r) return r;
  const a = CASTRA_AMB.list.find(n=>n.x===x && n.y===y); return a ? "amb:"+a.id : null;
};
function castraAmbTalk(aid){
  const a = CASTRA_AMB.list.find(n=>n.id===aid); if(!a || CASTRA_DLG) return;
  const pool = CASTRA_AMB_LINES[a.type.id].slice(); if(CASTRA_AMB_REGION[CASTRA_W_REGION]) pool.push(CASTRA_AMB_REGION[CASTRA_W_REGION]);
  const pick = pool[Math.floor(Math.random()*pool.length)];
  const px = CASTRA_W_UI.px, py = CASTRA_W_UI.py;      // kijk naar de speler
  a.dir = Math.abs(px-a.x) > Math.abs(py-a.y) ? (px>a.x?"right":"left") : (py>a.y?"down":"up"); a.frame = 1; a.talking = true; castraAmbDraw();
  const lines = [ { la:pick[0], nl:pick[1] } ];
  if(Math.random() < 0.5) lines.unshift({ la:"Salve, hospes!", nl:"Gegroet, gast!" });
  castraDlgOpen({ nm:a.type.nm, look:a.look, sheet:a.sheet }, lines, ()=>{ a.talking = false; });
}
const _castraNpcTalkAmb0 = castraNpcTalk;
castraNpcTalk = function(id){
  if(String(id).indexOf("amb:")===0){ castraAmbTalk(String(id).slice(4)); return; }
  return _castraNpcTalkAmb0.apply(this, arguments);
};
(function(add){ Object.keys(add).forEach(k=>{ if(!CASTRA_GLOSS[k]) CASTRA_GLOSS[k] = add[k]; }); })({
  "agricola":"boer", "mater":"moeder", "puer":"jongen", "senex":"oude man", "mercator":"koopman", "pastor":"herder",
  "anno":"jaar (6e naamval)", "bona":"goed", "bonum":"goed", "agros":"akkers", "agro":"akker (6e naamval)", "filii":"zonen, kinderen", "mei":"mijn", "meis":"mijn", "meas":"mijn", "ludunt":"spelen", "ludo":"ik speel",
  "panem":"brood (4e naamval)", "coquo":"ik bak", "vis":"wil je", "pax":"vrede", "gaudeo":"ik ben blij", "esse":"zijn", "olim":"vroeger", "multa":"veel", "multas":"veel", "audi":"luister", "sapientia":"wijsheid",
  "melior":"beter", "res":"spullen, dingen", "vinum":"wijn", "longa":"lang", "oves":"schapen", "curo":"ik zorg voor", "cave":"pas op", "sol":"zon", "calet":"is heet", "mare":"zee", "pulchrum":"mooi",
  "alti":"hoog", "silvae":"bossen", "galliae":"van Gallië", "magnae":"groot", "nilus":"de Nijl", "alit":"voedt", "noster":"onze", "calidus":"heet", "hominum":"van mensen", "spartiatae":"Spartanen", "densa":"dicht",
  "equitant":"rijden", "campos":"velden (4e naamval)",
  "meos":"mijn (4e naamval)", "pacem":"vrede (4e naamval)", "puella":"meisje", "anus":"oude vrouw", "sacerdos":"priester(es)", "coquit":"bakt", "flores":"bloemen", "pulchri":"mooi", "laboro":"ik werk", "cum":"met", "matre":"moeder (6e naamval)", "nepotes":"kleinkinderen",
  "amo":"ik hou van", "vita":"leven", "sed":"maar", "via":"weg", "deos":"goden (4e naamval)", "colo":"ik vereer", "peto":"ik vraag", "dei":"goden", "iuvant":"helpen", "templo":"tempel (6e naamval)", "orare":"bidden", "debes":"je moet" });
