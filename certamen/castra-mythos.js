/* ============================================================================
   CASTRA HEROUM — MYTHISCHE WEZENS OP VERBORGEN PLEKKEN
   ----------------------------------------------------------------------------
   Gerben: mythische wezens mogen goed verstopt zijn in de wereld en niet te snel voorkomen; een Lemur komt uit een kerkhof. Het plan staat in
   CASTRA_MYTHISCHE_WEZENS.md. Zo werkt het:
   - De gewone zones (bos, veld, kust, stad, ...) hebben geen mythische wezens meer: daar ontmoet je alleen soldaten. Een mythische vorm komt alleen
     uit een grot of uit een verborgen plek (CASTRA_MYTH_SPOTS): een kleine rechthoek binnen een gewone zone die eruitziet als de rest van het hoge gras
     (geen rand, geen naamplaat) maar een eigen terrein met eigen wezens heeft (het decor blijft ongewijzigd: we overschrijven alleen per tegel het terrein).
   - Een plek noemt de takken (en eventueel de vormen) die er leven, de kans, en eventueel wanneer: `when` = de dagdelen waarop ze er zijn (Sirenen 's nachts
     en bij avondval, een adelaar overdag). Buiten die tijd ontmoet je daar gewone soldaten.
   - 's Nachts komen er geen extra wezens meer uit het niets: de nacht (castra-dayn.js) verhoogt alleen de kans binnen een terrein dat al wezens heeft.
   - De eerste keer dat je een verborgen plek betreedt, meldt het spel haar naam (een kleine beloning voor de ontdekker).
   Laadt NA castra-enc.js, castra-dayn.js, castra-zones.js, castra-roma.js en castra-urbs.js.
   ============================================================================ */
// [regio, ouderzone, id, x, y, b, h, icon, Latijn, Nederlands, taken, vormen (of null), kans, dagdelen (of null)]
const CASTRA_MYTH_SPOTS = [
  ["graecia",   "olea",      "bacchus",       6,30, 7,6, "🍇", "Locus Bacchi",        "Een lichting van Bacchus",           ["Saters"], null, 0.30, null],
  ["themiscyra","silva",     "quercus",      10, 9, 6,5, "🌳", "Quercus sacra",       "De heilige eik",                     ["Nimfen"], ["myt_nympha","myt_dryas"], 0.30, null],
  ["troia",     "scamander", "fons",          6,32, 8,6, "💧", "Fons",                "Een verborgen bron",                 ["Nimfen"], ["myt_nympha","myt_naias"], 0.30, null],
  ["themiscyra","mons",      "oreades",      40,10, 7,5, "⛰️", "Oreades",             "Waar de bergnimfen dansen",          ["Nimfen"], ["myt_nympha","myt_oreas"], 0.30, null],
  ["troia",     "litus",     "nereides",     58,12, 3,7, "🐚", "Nereides",            "Waar de zeenimfen spelen",           ["Nimfen"], ["myt_nympha","myt_nereis"], 0.30, null],
  ["themiscyra","campus",    "pratum",        6,31, 8,6, "🌾", "Pratum centaurorum",  "De weide van de centauren",          ["Centauren"], null, 0.30, null],
  ["graecia",   "litus",     "phineus",      58,33, 3,6, "🪶", "Litus Phinei",        "De kust van Phineus",                ["Harpijen"], null, 0.30, null],
  ["themiscyra","mons",      "scopuli",      50, 3, 6,5, "🪨", "Scopuli",             "De kliffen van de Amazones",         ["Harpijen"], null, 0.30, null],
  ["persis",    "mons",      "griffones",     6,12, 8,3, "🦅", "Nidus gryphorum",     "Het nest van de grijpvogels",        ["Grijpvogels"], null, 0.30, null],
  ["graecia",   "litus",     "anthemoessa",  58,26, 3,5, "🎶", "Anthemoessa",         "Het eiland van de Sirenen",          ["Sirenen"], null, 0.28, ["vesper","nox"]],
  ["africa",    "litus",     "scopulus",     57,20, 4,8, "🎶", "Scopulus Sirenum",    "De klip van de Sirenen",             ["Sirenen"], null, 0.28, ["vesper","nox"]],
  ["troia",     "muros",     "cyclopes",     40, 6, 7,5, "👁️", "Murus Cyclopum",      "De muur van de Cyclopen",            ["Cyclopen"], null, 0.30, null],
  ["graecia",   "litus",     "neptuni",      56, 3, 4,5, "🌊", "Sinus Neptuni",       "De baai van Poseidon",               ["Zeepaarden"], null, 0.30, null],
  ["troia",     "scamander", "ostium",        6,10, 8,5, "🌊", "Ostium Scamandri",    "De monding van de Scamander",        ["Zeepaarden"], null, 0.25, null],
  ["graecia",   "urbs",      "formicae",     46,36, 6,5, "🐜", "Formicarum collis",   "De mierenheuvel van Aegina",         ["Myrmidonen"], null, 0.30, null],
  ["graecia",   "urbs",      "arvum",        38,28, 6,5, "🦷", "Arvum draconis",      "De akker met de drakentanden",       ["Gezaaide mannen"], null, 0.25, null],
  ["laconia",   "urbs",      "spartoi",      48,12, 6,3, "🦷", "Campus Spartorum",    "Het veld van de gezaaide mannen",    ["Gezaaide mannen"], null, 0.25, null],
  ["persis",    "urbs",      "fissura",      44,12, 6,3, "🐍", "Fissura",             "Een spleet in de zandsteen",         ["Draken"], ["myt_anguis","myt_serpens"], 0.30, null],
  ["graecia",   "olea",      "hippocrene",   16,38, 6,5, "🐴", "Hippocrene",          "De bron van Pegasus",                ["Gevleugelde paarden"], null, 0.25, null],
  ["themiscyra","campus",    "pratum_alatum",14,38, 7,5, "🐴", "Pratum alatum",       "De weide van de gevleugelde paarden",["Gevleugelde paarden"], null, 0.25, null],
  ["aegyptus",  "urbs",      "heliopolis",   44,12, 6,3, "🔥", "Heliopolis",          "De zonnetempel van Heliopolis",      ["Feniks"], null, 0.22, ["aurora","dies"]],
  ["roma",      "castra",    "campus_martius",8,44, 8,5, "🐺", "Campus Martius",      "Het Marsveld",                       ["Wolven van Mars"], null, 0.30, null],
  ["roma",      "forum",     "capitolium",   46,19, 7,4, "🦅", "Capitolium",          "Het Capitool van Iuppiter",          ["Adelaars van Jupiter"], null, 0.30, ["aurora","dies"]],
  ["roma",      "via",       "via_aquilae",  58,40, 8,6, "🦅", "Via Appia, hoog boven de weg","Boven de Via Appia",          ["Adelaars van Jupiter"], null, 0.25, ["aurora","dies"]],
];
const CASTRA_MYTH_CAVES = ["specus","labyrinthus","cuniculus","antrum","pyramis","sepulcrum","hannibalis","taygetus","hercynia","martis","catacumbae","sepulcretum"];
const CASTRA_MYTH_SPOT_BY_ID = {}, CASTRA_MYTH_RECTS = {};

(function build(){
  // 1. alleen grotten en de verborgen plekken houden hun wezens; de Pelion van Graecia (een berg) houdt alleen de centauren
  Object.keys(CASTRA_VENATIO).forEach(rid=>{
    CASTRA_VENATIO[rid].terrains.forEach(t=>{
      if(CASTRA_MYTH_CAVES.indexOf(t.id)>=0) return;
      if(rid==="graecia" && t.id==="mons"){ t.myth = { p:0.2, taks:["Centauren"] }; return; }
      delete t.myth;
    });
  });
  // 2. de plekken: een eigen terrein (zelfde soldaten als de ouderzone) plus een geheime zone op de kaart
  CASTRA_MYTH_SPOTS.forEach(([rid, parent, id, x, y, w, h, icon, la, nl, taks, forms, p, when])=>{
    const reg = CASTRA_VENATIO[rid], W = CASTRA_WORLDS[rid], P = reg && reg.terrains.find(t=>t.id===parent);
    if(!reg || !W || !P) throw new Error("mythische plek zonder ouderzone: "+rid+"/"+id);
    const T = Object.assign({}, P, { id, la, nl, hidden:true, myth:{ p, taks, forms:forms||null }, when:when||null, parent });
    reg.terrains.push(T);
    (CASTRA_MYTH_RECTS[rid] = CASTRA_MYTH_RECTS[rid] || []).push({ id, x, y, w, h });          // geen echte zone (dat zou de vaste willekeur van het decor verschuiven): we overschrijven achteraf het terrein van de hoog-grastegels
    CASTRA_ZONE_INFO[id] = [icon, la, nl];
    CASTRA_MYTH_SPOT_BY_ID[rid+"|"+id] = { rid, id, x, y, w, h, icon, la, nl };
  });
})();

// Een mythisch slot mag alleen een vorm uit de opgegeven lijst trekken (castra-troops.js: castraWildForm leest myth.forms).
// Buiten de tijd van een plek (when) ontmoet je er gewone soldaten van de ouderzone.
const _castraWildPickMy0 = castraWildPick;
castraWildPick = function(region, terrain, rng){
  const pick = _castraWildPickMy0.apply(this, arguments);
  if(!terrain || !terrain.when || !pick || !pick.form || pick.form.volk!=="myt") return pick;
  const ph = typeof castraDayPhase==="function" ? castraDayPhase().id : "dies";
  if(terrain.when.indexOf(ph)>=0) return pick;
  const parent = region.terrains.find(t=>t.id===terrain.parent);
  return parent ? _castraWildPickMy0.call(this, region, parent, rng) : pick;
};

/* ---------- ontdekken: de eerste keer dat je een verborgen plek betreedt ---------- */
function castraMythSpotAt(rid, x, y){
  const L = CASTRA_MYTH_RECTS[rid]; if(!L) return null;
  for(let i=L.length-1;i>=0;i--){ const z = L[i]; if(x>=z.x && x<z.x+z.w && y>=z.y && y<z.y+z.h) return CASTRA_MYTH_SPOT_BY_ID[rid+"|"+z.id] || null; }
  return null;
}
// Het hoge gras binnen een plek hoort bij de plek (castraWorldBuilt().tall geeft per tegel het terrein).
const _castraWorldDefMy0 = castraWorldDef;
castraWorldDef = function(){
  const d = _castraWorldDefMy0.apply(this, arguments), W = castraWorldCfg(), L = CASTRA_MYTH_RECTS[W.id];
  if(!L || !d.tall) return d;
  L.forEach(r=>{ for(let y=r.y;y<r.y+r.h;y++) for(let x=r.x;x<r.x+r.w;x++){ const k = x+","+y; if(d.tall[k]) d.tall[k] = r.id; } });
  return d;
};
const _castraZoneChipUpdateMy0 = castraZoneChipUpdate;
castraZoneChipUpdate = function(){
  _castraZoneChipUpdateMy0.apply(this, arguments);
  try{
    const rid = CASTRA_W_REGION, s = castraMythSpotAt(rid, CASTRA_W_UI.px, CASTRA_W_UI.py); if(!s) return;
    const d = CASTRA.mythSpots || (CASTRA.mythSpots = {}); if(d[rid+"|"+s.id]) return;
    d[rid+"|"+s.id] = 1; castraSave();
    if(typeof toast==="function") toast("✨ "+s.icon+" "+s.la, "Een verborgen plek: "+s.nl+". Hier voel je dat er iets leeft dat je niet overal ziet.");
    if(typeof castraPxpAdd==="function") castraPxpAdd(4, "Een verborgen plek ontdekt");
  }catch(e){ console.error(e); }
};

/* ---------- een raadgever per regio: een persoon die in het Latijn naar de goede plekken wijst ---------- */
// Elke regio heeft er één, niet ver van de reisplek (op de weg naar het gewone veld); geen opdracht, alleen een hint. De richtingen: oriens (oost), occidens (west),
// septentrio (noord), meridies (zuid).
const CASTRA_MYTH_HINTS = {
  latium: { nm:"Pastor Latinus", lines:[
    { la:"Salve, hospes! Lupa olim Romulum et Remum aluit.", nl:"Gegroet, gast! De wolvin voedde eens Romulus en Remus." },
    { la:"In specu ad occidentem lupae et Fauni adhuc habitant. Noli sine armis intrare!", nl:"In de grot in het westen wonen nog wolven en faunen. Ga niet zonder wapens naar binnen!" } ] },
  roma: { nm:"Augur", lines:[
    { la:"Aves specto. Aquilae Iovis supra Capitolium volant, sed interdiu tantum.", nl:"Ik kijk naar de vogels. De adelaars van Iuppiter vliegen boven het Capitool, maar alleen overdag." },
    { la:"Lupi Martis in campo Martio habitant, ad meridiem et occidentem.", nl:"De wolven van Mars wonen op het Marsveld, in het zuiden en westen." },
    { la:"Et prope sepulcra, ad meridiem muri, lemures noctu errant.", nl:"En bij de graven, ten zuiden van de muur, dwalen 's nachts de lemuren rond." } ] },
  gallia: { nm:"Bardus senex", lines:[
    { la:"Carmina antiqua cano. Lupi Martis in antro ad meridiem latent.", nl:"Ik zing oude liederen. De wolven van Mars liggen verscholen in de grot in het zuiden." },
    { la:"Noli sine armis intrare!", nl:"Ga niet zonder wapens naar binnen!" } ] },
  germania: { nm:"Venator Hercynius", lines:[
    { la:"Silva Hercynia vetus est et densa.", nl:"Het Hercynische woud is oud en dicht." },
    { la:"In specu ad orientem draco dormit. Noli eum excitare!", nl:"In de grot in het oosten slaapt een draak. Maak hem niet wakker!" } ] },
  graecia: { nm:"Rhapsodos", lines:[
    { la:"Ad litus orientale Sirenae noctu cantant, et Harpyiae Phineum cruciant.", nl:"Aan de oostkust zingen 's nachts de Sirenen, en de Harpijen kwellen Phineus." },
    { la:"In oleis, ad occidentem, Bacchus satyros ducit; ibi fons Pegasi latet.", nl:"In de olijfgaarden in het westen leidt Bacchus de satyrs; daar ligt de bron van Pegasus verborgen." },
    { la:"In urbe, ad orientem, formicae in homines mutatae sunt et dentes draconis in agro iacent.", nl:"In de stad in het oosten zijn mieren in mensen veranderd, en liggen drakentanden in een akker." } ] },
  laconia: { nm:"Hilotes", lines:[
    { la:"Sparta montes amat. In monte Taygeto grypes nidificant.", nl:"Sparta houdt van bergen. Op de berg Taygetos nestelen grijpvogels." },
    { la:"In urbe, ad orientem, Spartoi ex dentibus nati vagantur.", nl:"In de stad in het oosten zwerven de Spartoi, geboren uit tanden." } ] },
  troia: { nm:"Pastor Idaeus", lines:[
    { la:"Prope Scamandrum, ad occidentem, fons nympharum latet.", nl:"Bij de Scamander, in het westen, ligt een bron van nimfen verborgen." },
    { la:"Ad orientem Cyclopes muros veteres servant.", nl:"In het oosten bewaken de Cyclopen de oude muren." },
    { la:"In litore Nereides ludunt, et ad ostium Scamandri equi marini natant.", nl:"Op het strand spelen de Nereïden, en bij de monding van de Scamander zwemmen zeepaarden." } ] },
  themiscyra: { nm:"Venatrix Amazon", lines:[
    { la:"Dryades in quercu sacra habitant, ad septentrionem; centauri in prato, ad meridiem.", nl:"De Dryaden wonen in de heilige eik, in het noorden; de centauren in de weide, in het zuiden." },
    { la:"Equi alati in alio prato pascuntur, et Oreades in monte saltant.", nl:"Gevleugelde paarden grazen in een andere weide, en de Oreaden dansen op de berg." },
    { la:"Harpyiae in scopulis orientalibus nidificant. Cave!", nl:"Harpijen nestelen op de oostelijke kliffen. Pas op!" } ] },
  persis: { nm:"Senex Persa", lines:[
    { la:"In montibus, ad occidentem, grypes nidificant.", nl:"In de bergen in het westen nestelen grijpvogels." },
    { la:"In saxo rubro, ad septentrionem, fissura est ubi serpentes latent.", nl:"In de rode rots in het noorden is een spleet waar slangen schuilen." } ] },
  aegyptus: { nm:"Augur Solis", lines:[
    { la:"Sole oriente Phoenix Heliopolim visitat.", nl:"Bij zonsopgang bezoekt de Feniks Heliopolis." },
    { la:"Interdiu tantum eum vides, ad septentrionem et orientem.", nl:"Je ziet hem alleen overdag, in het noorden en oosten." } ] },
  africa: { nm:"Nauta Poenus", lines:[
    { la:"In litore orientali noctu Sirenae cantant.", nl:"Aan de oostkust zingen 's nachts de Sirenen." },
    { la:"Cave! Nautae cantu earum decipiuntur.", nl:"Pas op! Zeelieden worden misleid door hun zang." } ] },
};
Object.assign(CASTRA_GLOSS, {
  "pastor":"herder", "lupa":"wolvin", "olim":"eens", "aluit":"voedde", "specu":"grot", "occidentem":"westen", "lupae":"wolven", "fauni":"faunen", "adhuc":"nog", "habitant":"wonen",
  "noli":"doe niet", "sine":"zonder", "armis":"wapens", "intrare":"binnengaan", "aves":"vogels", "specto":"ik kijk", "aquilae":"adelaars", "volant":"vliegen", "interdiu":"overdag",
  "tantum":"alleen", "campo":"veld", "martio":"van Mars", "meridiem":"zuiden", "sepulcra":"graven", "lemures":"lemuren", "noctu":"'s nachts", "errant":"dwalen", "carmina":"liederen",
  "antiqua":"oude", "cano":"ik zing", "antro":"grot", "latent":"liggen verscholen", "silva":"woud", "vetus":"oud", "densa":"dicht", "orientem":"oosten", "draco":"draak", "dormit":"slaapt",
  "excitare":"wakker maken", "litus":"kust", "orientale":"oostelijke", "sirenae":"sirenen", "cantant":"zingen", "harpyiae":"harpijen", "cruciant":"kwellen", "oleis":"olijfgaarden",
  "satyros":"satyrs", "ducit":"leidt", "fons":"bron", "latet":"ligt verscholen", "urbe":"stad", "formicae":"mieren", "homines":"mensen", "mutatae":"veranderd", "dentes":"tanden",
  "agro":"akker", "iacent":"liggen", "montes":"bergen", "amat":"houdt van", "grypes":"grijpvogels", "nidificant":"nestelen", "dentibus":"tanden", "nati":"geboren", "vagantur":"zwerven",
  "scamandrum":"de Scamander", "nympharum":"van nimfen", "cyclopes":"Cyclopen", "muros":"muren", "veteres":"oude", "servant":"bewaken", "litore":"strand", "nereides":"Nereïden",
  "ludunt":"spelen", "ostium":"monding", "equi":"paarden", "marini":"van de zee", "natant":"zwemmen", "dryades":"Dryaden", "quercu":"eik", "sacra":"heilige", "septentrionem":"noorden",
  "centauri":"centauren", "prato":"weide", "alati":"gevleugelde", "pascuntur":"grazen", "saltant":"dansen", "scopulis":"kliffen", "orientalibus":"oostelijke", "montibus":"bergen",
  "saxo":"rots", "rubro":"rode", "fissura":"spleet", "serpentes":"slangen", "sole":"zon", "oriente":"opgaand", "visitat":"bezoekt", "eum":"hem", "vides":"je ziet", "nautae":"zeelieden",
  "cantu":"zang", "earum":"hun", "decipiuntur":"worden misleid", "cave":"pas op", "poenus":"Carthaag", "bacchus":"Bacchus", "pegasi":"van Pegasus",
});
(function placeHints(){
  Object.keys(CASTRA_MYTH_HINTS).forEach(rid=>{
    const W = CASTRA_WORLDS[rid]; if(!W) return;
    const H = CASTRA_MYTH_HINTS[rid], taken = {};
    CASTRA_WENT.filter(e=>e.region===rid).forEach(e=>{ for(let dy=-1;dy<=1;dy++) for(let dx=-1;dx<=1;dx++) taken[(e.x+dx)+","+(e.y+dy)] = 1; });
    (W.doors||[]).forEach(d=>{ for(let dy=-1;dy<=2;dy++) for(let dx=-1;dx<=1;dx++) taken[(d.x+dx)+","+(d.y+dy)] = 1; });
    Object.keys(CASTRA_NPCS).filter(h=>CASTRA_NPCS[h].region===rid).forEach(h=>{ const n = CASTRA_NPCS[h].world; taken[n.x+","+n.y] = 1; });
    const road = (x,y)=>(W.roads||[]).some(r=>x>=r.x0-1&&x<=r.x1+1&&y>=r.y0-1&&y<=r.y1+1);
    const cx = W.start.x-4, cy = W.start.y-5; let pos = null;
    for(let r=0;r<9 && !pos;r++) for(let dy=-r;dy<=r && !pos;dy++) for(let dx=-r;dx<=r && !pos;dx++){
      if(Math.max(Math.abs(dx),Math.abs(dy))!==r) continue;
      const x = cx+dx, y = cy+dy; if(x<3 || y<3 || x>=W.cols-3 || y>=W.rows-3 || taken[x+","+y] || road(x,y)) continue;
      pos = [x,y]; }
    if(!pos) return;
    CASTRA_WENT.push({ id:"raad_"+rid, region:rid, kind:"npc", role:"say", nm:H.nm, x:pos[0], y:pos[1], dir:"down", say:H.lines });
  });
})();
