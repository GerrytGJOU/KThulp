/* ============================================================================
   CASTRA HEROUM — LATIJNSE TEKSTEN + VERTAALHULP
   ----------------------------------------------------------------------------
   Alle speltekst is Latijn; vertaalhulp is altijd één tik weg en kost niets:
   - tik op een woord  -> betekenis (CASTRA_GLOSS)
   - tik op "ⓘ"        -> vertaling van de hele zin
   Elk gebruik wordt gelogd in CASTRA.help (per woord en per zin) voor het
   toekomstige docentoverzicht. Teksten en glossarium zijn pure data, door
   Gerben aan te passen zonder code (zie CASTRA_HEROUM.md, "Latijn in het spel").
   Latijnse teksten zijn voorlopig en ter controle door Gerben.
   Laadt NA castra-data.js, VÓÓR castra.js/castra-venatio.js.
   ============================================================================ */

/* ---- Vaste zinnen: id -> {la, nl} ---- */
const CASTRA_LA = {
  venatio_titel:   { la:"Venatio", nl:"De jacht" },
  venatio_intro:   { la:"Quo venaris, dux?", nl:"Waar ga je jagen, leider?" },
  venare:          { la:"Venare!", nl:"Ga jagen!" },
  clausum:         { la:"Clausum", nl:"Gesloten" },
  explorator:      { la:"Explorator nuntiat:", nl:"De verkenner meldt:" },
  quem_mittis:     { la:"Quem militem mittis?", nl:"Welke soldaat stuur je?" },
  nullus_miles:    { la:"Nullum militem habes. Ipse pugnas, dux!", nl:"Je hebt geen soldaat. Je vecht zelf, leider!" },
  oppugna:         { la:"Oppugna!", nl:"Val aan!" },
  defende:         { la:"Defende!", nl:"Verdedig!" },
  miles_oppugnat:  { la:"Miles tuus hostem vulnerat.", nl:"Je soldaat verwondt de vijand." },
  hostis_oppugnat: { la:"Hostis militem tuum vulnerat.", nl:"De vijand verwondt je soldaat." },
  miles_defendit:  { la:"Miles tuus se defendit.", nl:"Je soldaat verdedigt zich." },
  optime:          { la:"Optime!", nl:"Uitstekend!" },
  male:            { la:"Male!", nl:"Slecht!" },
  vicisti:         { la:"Vicisti!", nl:"Je hebt gewonnen!" },
  victus_es:       { la:"Victus es.", nl:"Je bent verslagen." },
  hostis_fugit:    { la:"Hostis fugit.", nl:"De vijand vlucht." },
  praeda:          { la:"Praedam capis.", nl:"Je neemt de buit." },
  vulneratus:      { la:"Miles tuus vulneratus est.", nl:"Je soldaat is gewond." },
  hostis_dicit:    { la:"Hostis victus dicit: Te sequar, dux.", nl:"De verslagen vijand zegt: Ik zal je volgen, leider." },
  visne_recipere:  { la:"Visne eum in castra recipere?", nl:"Wil je hem in het kamp opnemen?" },
  recipio:         { la:"Recipio.", nl:"Ik neem hem op." },
  dimitto:         { la:"Dimitto.", nl:"Ik laat hem gaan." },
  castra_plena:    { la:"Castra plena sunt.", nl:"Het kamp zit vol." },
  redi:            { la:"Redi in castra.", nl:"Keer terug naar het kamp." },
  iterum:          { la:"Iterum venare!", nl:"Ga opnieuw jagen!" },
  campus_titel:    { la:"Campus Martius", nl:"Het oefenveld" },
  exerce:          { la:"Exerce!", nl:"Train!" },
  exercetur:       { la:"Exercetur.", nl:"Hij traint." },
  collige:         { la:"Collige!", nl:"Haal op!" },
  evolve:          { la:"Promove!", nl:"Bevorder!" },
  missio_honesta:  { la:"Missio honesta", nl:"Eervol ontslag" },
  nullus_exercitus:{ la:"Nullos milites habes.", nl:"Je hebt geen soldaten." },
  elige_viam:      { la:"Quam viam eligis?", nl:"Welke weg kies je?" },
  meliora:         { la:"Meliora", nl:"Verbeter" },
  claude:          { la:"Claude", nl:"Sluit" },
  gradus:          { la:"Gradus", nl:"Niveau" },
  gradus_max:      { la:"Gradus maximus.", nl:"Hoogste niveau." },
  praetorium_prius:{ la:"Praetorium prius meliora.", nl:"Verbeter eerst het praetorium." },
  proventus:       { la:"Proventus", nl:"Opbrengst" },
  paratum:         { la:"Paratum", nl:"Klaar" },
  capacitas:       { la:"Capacitas", nl:"Opslagmaximum" },
  milites:         { la:"Milites", nl:"Soldaten" },
  conscribe:       { la:"Conscribe militem!", nl:"Werf een soldaat!" },
  legio_mox:       { la:"Legio mox aderit.", nl:"De Legio komt binnenkort." },
  porta_clausa:    { la:"Haec porta nondum aperta est.", nl:"Deze poort is nog niet open." },
  loca:            { la:"Loca", nl:"Plaatsen" },
  hodie:           { la:"Hodie", nl:"Vandaag" },
  loca_plena:      { la:"Loca exercitationis plena sunt.", nl:"Alle oefenplekken zijn bezet." },
  frumentum_deest: { la:"Frumentum deest.", nl:"Je hebt niet genoeg graan." },
  satis_exercitati:{ la:"Hodie satis exercitati sunt.", nl:"Vandaag is er genoeg getraind." },
  collectum:       { la:"Collectum!", nl:"Opgehaald!" },
  plenum:          { la:"Horreum plenum est.", nl:"Je opslag is vol." },
  melioratum:      { la:"Melioratum!", nl:"Verbeterd!" },
  exercitatio_finita:{ la:"Exercitatio finita est.", nl:"De training is klaar." },
  visne_dimittere: { la:"Visne hunc militem honeste dimittere?", nl:"Wil je deze soldaat eervol ontslaan?" },
  adiungit:        { la:"se tibi adiungit.", nl:"sluit zich bij je aan." },
  intellego:       { la:"Intellego.", nl:"Ik begrijp het." },
  intro:           { la:"Salve, dux! Haec sunt castra tua. Collige ligna et aes, meliora praetorium, et venare in Latio.", nl:"Gegroet, leider! Dit is jouw kamp. Verzamel hout en brons, verbeter het praetorium en ga jagen in Latium." },
  perge:           { la:"Perge!", nl:"Ga verder!" },
  vestigia:        { la:"Vestigia viri magni vides.", nl:"Je ziet sporen van een groot man." },
};

/* ---- Typen in het Latijn: meervoud (verkenningsbericht) en enkelvoud (je eigen soldaat) ---- */
const CASTRA_TYPE_LA = {
  inf:  { pl:"pedites",   sg:"pedes",       nl_pl:"voetsoldaten",  nl_sg:"voetsoldaat" },
  cav:  { pl:"equites",   sg:"eques",       nl_pl:"ruiters",       nl_sg:"ruiter" },
  rng:  { pl:"sagittarii",sg:"sagittarius", nl_pl:"boogschutters", nl_sg:"boogschutter" },
  sup:  { pl:"auxilia",   sg:"auxiliarius", nl_pl:"hulptroepen",   nl_sg:"hulptroep" },
  myth: { pl:"monstra",   sg:"monstrum",    nl_pl:"monsters",      nl_sg:"monster" },
};

/* ---- Karakters: Latijns bijvoeglijk naamwoord + vertaling ---- */
const CASTRA_INGENIUM_NL = {
  ferox:"fel", cautus:"voorzichtig", celer:"snel", robustus:"sterk gebouwd", acer:"scherp",
  longus:"lang", firmus:"standvastig", agilis:"wendbaar", fortis:"dapper", sagax:"scherpzinnig",
};

/* ---- Terreinen per regio (zeldzaamheid: sommige lijnen alleen op bepaald terrein) ---- */
const CASTRA_VENATIO = {
  latium: {
    nm:"Latium", min:1, max:3,
    terrains:[
      { id:"silva",  la:"In silva",  nl:"In het bos",
        lines:[ {id:"legioen",w:3},{id:"licht",w:3},{id:"rangen",w:1},{id:"saters",w:1} ] },
      { id:"campus", la:"In campo",  nl:"Op het veld",
        lines:[ {id:"legioen",w:3},{id:"ruiterij",w:3},{id:"rangen",w:2},{id:"licht",w:1} ] },
      { id:"via",    la:"In via",    nl:"Op de weg",
        lines:[ {id:"rangen",w:2},{id:"ruiterij",w:2},{id:"legioen",w:2},{id:"licht",w:2} ] },
      { id:"tiberis",la:"Ad Tiberim",nl:"Bij de Tiber",
        lines:[ {id:"vloot",w:3},{id:"legioen",w:2},{id:"licht",w:2},{id:"nimfen",w:1} ] },
    ],
    // Kans op een spoor naar een held na een gewonnen jacht (missieketen volgt in fase 3).
    traces:[ "aeneas","romulus","horatius","cloelia","mucius","camilla" ],
    traceChance:0.08,
  },
};

/* ---- Glossarium: woord (kleine letters, zonder leestekens) -> betekenis ---- */
const CASTRA_GLOSS = {
  "venatio":"jacht", "quo":"waarheen / waar", "venaris":"jaagt (je)", "venare":"jaag! / ga jagen!",
  "dux":"leider", "latium":"Latium (streek rond Rome)", "clausum":"gesloten",
  "explorator":"verkenner", "nuntiat":"meldt", "in":"in / op / naar", "silva":"bos", "campo":"veld",
  "via":"weg", "ad":"bij / naar", "tiberim":"de Tiber (4e naamval)",
  "pedites":"voetsoldaten", "pedes":"voetsoldaat", "equites":"ruiters", "eques":"ruiter",
  "sagittarii":"boogschutters", "sagittarius":"boogschutter", "auxilia":"hulptroepen",
  "auxiliarius":"hulptroep", "monstra":"monsters", "monstrum":"monster",
  "adsunt":"zijn er / zijn aanwezig", "hostis":"vijand", "est":"is", "sunt":"zijn", "es":"je bent",
  "ferox":"fel", "cautus":"voorzichtig", "celer":"snel", "robustus":"sterk gebouwd", "acer":"scherp",
  "longus":"lang", "firmus":"standvastig", "agilis":"wendbaar", "fortis":"dapper", "sagax":"scherpzinnig",
  "quem":"wie / welke (4e naamval)", "militem":"soldaat (4e naamval)", "mittis":"je stuurt",
  "nullum":"geen", "habes":"je hebt", "ipse":"zelf", "pugnas":"je vecht",
  "oppugna":"val aan!", "defende":"verdedig!", "oppugnat":"valt aan",
  "miles":"soldaat", "tuus":"jouw", "tuum":"jouw (4e naamval)", "hostem":"vijand (4e naamval)",
  "vulnerat":"verwondt", "vulneratus":"gewond", "se":"zich", "defendit":"verdedigt",
  "optime":"uitstekend", "male":"slecht", "vicisti":"je hebt gewonnen", "victus":"verslagen",
  "fugit":"vlucht", "praedam":"buit (4e naamval)", "capis":"je neemt / pakt",
  "dicit":"zegt", "te":"jou", "sequar":"ik zal volgen", "visne":"wil je?", "eum":"hem",
  "castra":"kamp", "recipere":"opnemen", "recipio":"ik neem op", "dimitto":"ik laat gaan",
  "plena":"vol", "redi":"keer terug!", "iterum":"opnieuw", "vestigia":"sporen",
  "viri":"van een man", "meliora":"verbeter!", "claude":"sluit!", "gradus":"niveau", "maximus":"hoogste", "prius":"eerst",
  "proventus":"opbrengst", "hora":"uur", "paratum":"klaar", "capacitas":"opslagmaximum", "conscribe":"werf!", "mox":"binnenkort", "aderit":"zal er zijn",
  "porta":"poort", "haec":"deze / dit", "nondum":"nog niet", "aperta":"open", "loca":"plaatsen", "exercitationis":"van de training", "plena":"vol",
  "hodie":"vandaag", "deest":"ontbreekt", "satis":"genoeg", "collectum":"opgehaald", "horreum":"opslagplaats voor graan", "plenum":"vol",
  "melioratum":"verbeterd", "finita":"afgelopen", "exercitatio":"training", "visne":"wil je?", "hunc":"deze (4e naamval)", "honeste":"eervol",
  "dimittere":"ontslaan", "adiungit":"voegt zich bij", "intellego":"ik begrijp het", "salve":"gegroet!", "tua":"jouw", "et":"en", "latio":"Latium (in Latium)",
  "ibi":"daar", "habitat":"woont", "dormiunt":"slapen", "caeduntur":"worden gehakt", "exercentur":"worden getraind", "effoditur":"wordt gedolven",
  "servatur":"wordt bewaard", "legio":"legioen", "convenit":"komt samen", "ligna":"hout (meervoud)", "aes":"brons", "praetorium":"hoofdkwartier van de leider", "perge":"ga verder!", "herba":"gras", "alta":"hoog", "martius":"van Mars", "exerce":"train!", "exercetur":"wordt getraind", "collige":"haal op!", "promove":"bevorder!", "missio":"ontslag", "honesta":"eervol", "quam":"welke", "viam":"weg (4e naamval)", "eligis":"je kiest", "nullos":"geen (4e naamval)", "milites":"soldaten", "magni":"groot", "vides":"je ziet",
};

/* ---- Weergave ---- */
function castraNorm(w){ return w.toLowerCase().replace(/[^a-zāēīōū]/g,"").replace(/[āēīōū]/g,c=>({ā:"a",ē:"e",ī:"i",ō:"o",ū:"u"}[c])); }

// HTML van een Latijnse zin: elk woord tikbaar, plus ⓘ voor de hele vertaling.
// la/nl mogen vrij samengesteld zijn (dynamische zinnen); sid = log-sleutel.
function castraLaHTML(la, nl, sid){
  const words = la.split(/(\s+)/).map(p=>{
    if(!p.trim()) return p;
    return `<span class="cl-w" data-w="${esc(castraNorm(p))}" onclick="castraTapWord(event,this)" style="cursor:pointer;border-bottom:1px dotted #b8975a">${esc(p)}</span>`;
  }).join("");
  const id = "cl"+Math.random().toString(36).slice(2,8);
  return `<span class="cl-s">${words} <button class="cl-i" data-la="${esc(la)}" onclick="castraTapSentence('${id}','${esc(sid||la).replace(/'/g,"")}',this)" title="Vertaling" style="background:none;border:1px solid #8a6d2f;color:#d4af37;border-radius:50%;width:20px;height:20px;font-size:12px;line-height:1;padding:0;cursor:pointer">ⓘ</button><span id="${id}" class="cl-nl" style="display:none;font-size:13px;opacity:.85;font-style:italic"><br>${esc(nl)}</span></span>`;
}
function castraLa(id){ const t = CASTRA_LA[id]; return t ? castraLaHTML(t.la, t.nl, id) : esc(id); }
function castraLaText(id){ return CASTRA_LA[id] ? CASTRA_LA[id].la : id; }

function castraLogHelp(kind, key, text){
  if(typeof CASTRA==="undefined" || !CASTRA) return;
  const h = CASTRA.help || (CASTRA.help = { words:{}, sentences:{} });
  const m = h[kind] || (h[kind] = {});
  m[key] = (m[key]||0)+1;
  if(typeof castraSave==="function") castraSave();
  castraHelpSync(kind, key, text);
}
// Geaggregeerd per klas/maand, nooit per leerling: classAnalyticsCastra/{klas}/{YYYY-MM}/{w_woord|s_zin}
// = { p: tekst, k: "w"|"s", c: aantal }. Zelfde patroon als classAnalyticsChronica; alleen voor
// ingelogde leerlingen (BM_IDENT). Docentweergave: tpRenderCastraAnalytics() in games.js.
function castraHelpSync(kind, key, text){
  try{
    if(typeof fbDB==="undefined" || !fbDB || typeof BM_IDENT==="undefined" || !BM_IDENT || !BM_IDENT.klascode) return;
    const month = new Date().toISOString().slice(0,7);
    const k = (kind==="words" ? "w_" : "s_") + String(key).toLowerCase().replace(/[^a-z0-9]+/g,"_").slice(0,60);
    const path = "classAnalyticsCastra/"+BM_IDENT.klascode+"/"+month+"/"+k+"/";
    const upd = {};
    upd[path+"p"] = String(text||key).slice(0,80);
    upd[path+"k"] = kind==="words" ? "w" : "s";
    upd[path+"c"] = firebase.database.ServerValue.increment(1);
    fbDB.ref().update(upd).catch(()=>{});
  }catch(e){}
}
function castraTapWord(ev, node){
  ev.stopPropagation();
  const w = node.getAttribute("data-w");
  const meaning = CASTRA_GLOSS[w] || "(geen vertaling beschikbaar)";
  castraLogHelp("words", w, node.textContent);
  let box = document.getElementById("castraGloss");
  if(!box){
    box = document.createElement("div"); box.id = "castraGloss";
    box.style.cssText = "position:fixed;left:50%;bottom:18px;transform:translateX(-50%);z-index:9998;background:#1b150e;color:#f1e6c4;border:1px solid #d4af37;border-radius:10px;padding:8px 14px;font-size:15px;box-shadow:0 4px 14px rgba(0,0,0,.5);max-width:90vw";
    document.body.appendChild(box);
  }
  box.innerHTML = `<b>${esc(node.textContent)}</b> = ${esc(meaning)}`;
  box.style.display = "block";
  clearTimeout(box._t); box._t = setTimeout(()=>{ box.style.display="none"; }, 3500);
}
function castraTapSentence(id, sid, btn){
  const n = document.getElementById(id); if(!n) return;
  const show = n.style.display==="none";
  n.style.display = show ? "inline" : "none";
  if(show) castraLogHelp("sentences", sid, btn && btn.getAttribute("data-la"));
}
