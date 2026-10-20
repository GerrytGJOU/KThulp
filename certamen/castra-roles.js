/* ============================================================================
   CASTRA HEROUM — PROELIUM: VIJANDROLLEN, MISSIEREGELS (EDICTA) EN EXTRA KAARTEN
   ----------------------------------------------------------------------------
   Vier vijandrollen (naast de gewone soldaatvormen) die de speler dwingen zijn
   opstelling aan te passen; ze komen pas in latere missies:
     velox      snelle verkenner (veel sneller, weinig levenspunten)         vanaf m2
     gravis     zware krijger (langzaam, veel levenspunten, 20% pantser)     vanaf ro1
     scutarius  schilddrager (naburige vijanden krijgen 35% minder schade)   vanaf gm1
     medicus    genezer (herstelt naburige vijanden)                         vanaf g1
   Boogschutters mikken eerst op genezers en schilddragers (castra-proelium.js).
   Missieregels ("edicta", vanaf ro2): een of twee regels per missie die het gevecht
   veranderen (nacht, wind, regen, smalle linie, geen helden, ...). Zodra een rol of
   regel voor het eerst in beeld komt, pauzeert het spel met een korte uitleg tot de
   speler op "Intellexi" tikt (CASTRA.seenTD). Extra kaartlayouts c t/m h, ook met
   twee banen (vijanden verdelen zich om en om). De simulatie blijft deterministisch.
   Laadt NA castra-legio.js (of in elk geval na castra-battle.js).
   ============================================================================ */

/* ---------- rollen ---------- */
const CASTRA_P_ROLES = {
  velox:     { icon:"🏃", la:"Velox",     nl:"Snelle verkenner", hp:0.55, spd:1.6,  red:0,  leak:0, prio:0, frac:0.5,  maxk:4,
               ex:{ la:"Hostis celer est. Cito currit, sed infirmus est.", nl:"Een snelle vijand. Hij rent veel sneller dan de rest, maar heeft weinig levenspunten.",
                    tip:"Tip: boogschutters en soldaten met een vertragende arte pakken hem het best aan." } },
  gravis:    { icon:"💪", la:"Gravis",    nl:"Zware krijger",    hp:1.8,  spd:0.8,  red:20, leak:1, prio:0, frac:0.4,  maxk:3,
               ex:{ la:"Hostis gravis est. Tardus est, sed fortis.", nl:"Een zware krijger: langzaam, veel levenspunten en een pantser (jouw schade is 20% lager). Breekt hij door, dan kost dat 2 levens in plaats van 1.",
                    tip:"Tip: laat sterke soldaten dichtbij elkaar schieten; zwakke aanvallers richten weinig uit." } },
  scutarius: { icon:"🔰", la:"Scutarius", nl:"Schilddrager",     hp:1.3,  spd:0.95, red:0,  leak:0, prio:1, frac:0.25, maxk:2, radius:1700, prot:35,
               ex:{ la:"Scutarius socios tegit.", nl:"Een schilddrager: vijanden in zijn buurt krijgen 35% minder schade.",
                    tip:"Tip: boogschutters schieten eerst op schilddragers en genezers. Ruim hem snel op." } },
  medicus:   { icon:"⚕️", la:"Medicus",   nl:"Genezer",          hp:0.8,  spd:0.95, red:0,  leak:0, prio:2, frac:0.2,  maxk:2, radius:1800, heal:6, every:40,
               ex:{ la:"Medicus socios sanat.", nl:"Een genezer: elke 2 seconden herstelt hij 6% van de levenspunten van vijanden in zijn buurt.",
                    tip:"Tip: boogschutters mikken eerst op genezers. Breng de genezer snel uit het spel, anders duurt het gevecht eindeloos." } },
};

/* ---------- missieregels ---------- */
const CASTRA_EDICTA = {
  ventus: { icon:"💨", la:"Ventus",         nl:"Wind",          ex:{ la:"Ventus flat. Hostes celeriores sunt.", nl:"Het waait hard: alle vijanden lopen 15% sneller." }, mods:{ spd:1.15 } },
  nox:    { icon:"🌙", la:"Nox",            nl:"Nacht",         ex:{ la:"Nox est. Milites minus vident.", nl:"Het is nacht: je soldaten hebben 25% minder bereik." }, mods:{ rng:0.75 } },
  pluvia: { icon:"🌧️", la:"Pluvia",         nl:"Regen",         ex:{ la:"Pluvia cadit. Arcus madidi sunt.", nl:"Het regent: boogschutters doen 30% minder schade." }, type:{ rng:-30 } },
  aestus: { icon:"☀️", la:"Aestus",         nl:"Hitte",         ex:{ la:"Aestus magnus est. Equites fessi sunt.", nl:"Het is erg heet: cavalerie doet 30% minder schade." }, type:{ cav:-30 } },
  frigus: { icon:"❄️", la:"Frigus",         nl:"Kou",           ex:{ la:"Frigus est. Milites lentius pugnant.", nl:"Het is koud: al je soldaten schieten 20% langzamer." }, mods:{ cd:1.2 } },
  acies:  { icon:"⚔️", la:"Acies angusta",  nl:"Smalle linie",  ex:{ la:"Acies angusta est. Quinque milites sufficiunt.", nl:"De linie is smal: je mag maximaal 5 soldaten plaatsen." }, cap:5 },
  sine_h: { icon:"🚫", la:"Sine heroibus",  nl:"Geen helden",   ex:{ la:"Heroes hodie non pugnant.", nl:"Helden mogen deze missie niet meedoen." }, banHero:true },
  sine_s: { icon:"🏹", la:"Sine sagittariis", nl:"Geen boogschutters", ex:{ la:"Sagittarii hodie non pugnant.", nl:"Boogschutters mogen deze missie niet meedoen." }, banTypes:["rng"] },
  sine_d: { icon:"🎁", la:"Sine donis",     nl:"Geen gunsten",  ex:{ la:"Hodie dona non sunt.", nl:"Na een golf krijg je geen gunst om uit te kiezen." }, noDona:true },
};
// Samengevoegde invloed van de regels van een missie (ook voor de balansproef in tools/castra-balance-td.js).
function castraEdictSimSetup(m){
  const out = { mods:{}, cap:99, banTypes:[], banHero:false, noDona:false };
  (m.edicta||[]).forEach(id=>{
    const E = CASTRA_EDICTA[id]; if(!E) return;
    if(E.mods) Object.keys(E.mods).forEach(k=>{ out.mods[k] = (out.mods[k]||1)*E.mods[k]; });
    if(E.type){ out.mods.type = out.mods.type || {}; Object.keys(E.type).forEach(t=>{ out.mods.type[t] = (out.mods.type[t]||0)+E.type[t]; }); }
    if(E.cap) out.cap = Math.min(out.cap, E.cap);
    if(E.banTypes) out.banTypes = out.banTypes.concat(E.banTypes);
    if(E.banHero) out.banHero = true;
    if(E.noDona) out.noDona = true;
  });
  return out;
}
function castraEdictApply(B){
  const ed = castraEdictSimSetup(B.mission); B.ed = ed;
  const m = B.sim.mods; m.type = m.type || {};
  Object.keys(ed.mods).forEach(k=>{ if(k==="type") Object.keys(ed.mods.type).forEach(t=>{ m.type[t] = (m.type[t]||0)+ed.mods.type[t]; }); else m[k] = Math.round(m[k]*ed.mods[k]*1000)/1000; });
}
function castraBBanned(s){
  const B = CASTRA_B; if(!B || !B.ed) return false;
  const ty = s.hero ? CASTRA_HERO_DATA[s.h.id].type : s.dux ? "inf" : castraLine(s.line).type;
  if(s.hero && B.ed.banHero) return true;
  return B.ed.banTypes.indexOf(ty)>=0;
}
function castraEdictChips(m){
  const l = (m.edicta||[]).map(id=>CASTRA_EDICTA[id]).filter(Boolean);
  if(!l.length) return "";
  return `<div style="font-size:13px;margin:2px 0 6px">${l.map(E=>`<span title="${esc(E.ex.nl)}" style="display:inline-block;margin:2px 6px 2px 0;padding:1px 8px;border:1px solid #8a6d2f;border-radius:10px;background:rgba(212,175,55,.12)">${E.icon} ${esc(E.la)}</span>`).join("")}</div>`;
}

/* ---------- uitleg bij eerste verschijning (pauzeert het gevecht) ---------- */
function castraTDSeen(){ return CASTRA.seenTD || (CASTRA.seenTD = {}); }
function castraBIntroStart(){
  const B = CASTRA_B; if(!B || B.legio || B.endless) return;
  B.introQ = B.introQ || [];
  (B.mission.edicta||[]).forEach(id=>{ if(!castraTDSeen()["e:"+id]) B.introQ.push({ k:"edict", id }); });
  if(B.introQ.length){ B.paused = true; castraBIntroNext(); }
}
function castraBIntroRole(role){
  const B = CASTRA_B; if(!B || B.legio || B.endless || castraTDSeen()["r:"+role]) return false;
  if(B.introQ && B.introQ.some(x=>x.k==="role" && x.id===role)) { B.paused = true; return true; }
  (B.introQ = B.introQ || []).push({ k:"role", id:role }); B.paused = true;
  if(!document.getElementById("cbIntro")) castraBIntroNext();
  return true;
}
function castraBIntroNext(){
  const B = CASTRA_B; if(!B) return;
  const q = (B.introQ||[]).shift();
  if(!q){ B.paused = false; const o = document.getElementById("cbIntro"); if(o) o.remove(); return; }
  castraBIntroShow([q], true, q);
}
function castraBIntroShow(items, mark, cur){
  let o = document.getElementById("cbIntro"); if(o) o.remove();
  o = document.createElement("div"); o.id = "cbIntro";
  o.style.cssText = "position:fixed;left:0;top:0;right:0;bottom:0;z-index:100000;background:rgba(0,0,0,.62);display:flex;align-items:center;justify-content:center;padding:16px";
  const card = it=>{
    const D = it.k==="role" ? CASTRA_P_ROLES[it.id] : CASTRA_EDICTA[it.id];
    return `<div style="margin:8px 0;padding-bottom:6px;${items.length>1?"border-bottom:1px solid rgba(138,109,47,.4)":""}">
      <div style="font-size:20px;font-weight:bold;margin-bottom:4px">${D.icon} ${esc(D.la)} <small style="font-weight:normal;opacity:.75">— ${esc(D.nl)}</small></div>
      <div style="font-size:18px">${castraLaHTML(D.ex.la, D.ex.nl, "intro_"+it.k+"_"+it.id)}</div>
      ${D.ex.tip?`<div style="font-size:14px;margin-top:6px;opacity:.9">${esc(D.ex.tip)}</div>`:""}</div>`;
  };
  const title = mark ? (cur.k==="role" ? "Nieuwe vijand!" : "Nieuwe regel voor deze missie!") : "Vijanden en regels in deze missie";
  o.innerHTML = `<div style="max-width:520px;width:100%;max-height:90vh;overflow:auto;background:#f1e6c4;color:#2b1d0e;border:3px solid #8a6d2f;border-radius:14px;padding:16px 18px;box-shadow:0 8px 30px rgba(0,0,0,.6)">
    <div style="font-size:13px;letter-spacing:.06em;text-transform:uppercase;opacity:.7">${title}</div>${items.map(card).join("")}
    <button class="btn btn-gold" style="min-height:48px;margin-top:8px;width:100%;font-size:18px" onclick="castraBIntroClose(${mark?"true":"false"})">Intellexi <small>(begrepen)</small></button></div>`;
  document.body.appendChild(o);
  o._cur = cur || null;
}
function castraBIntroClose(mark){
  const o = document.getElementById("cbIntro"), cur = o && o._cur;
  if(o) o.remove();
  if(mark && cur){ castraTDSeen()[(cur.k==="role"?"r:":"e:")+cur.id] = 1; castraSave(); }
  if(mark) castraBIntroNext();
}
// Overzicht van alle rollen en regels in de lopende missie (knop ⓘ).
function castraBInfo(){
  const B = CASTRA_B; if(!B) return;
  const roles = {}; B.mission.waves.forEach(w=>w.forEach(g=>{ if(g.role) roles[g.role] = 1; }));
  const items = Object.keys(roles).map(id=>({ k:"role", id })).concat((B.mission.edicta||[]).map(id=>({ k:"edict", id })));
  if(!items.length){ toast("ⓘ", "In deze missie zijn geen bijzondere vijanden of regels."); return; }
  castraBIntroShow(items, false, null);
}

/* ---------- extra kaartlayouts (16 × 11) ---------- */
// Bomen worden vast (met een eigen seed) over de vrije tegels verdeeld; banen van één kaart eindigen op hetzelfde punt.
function castraPGenTrees(lanes, seed, n){
  const cells = {}; lanes.forEach(P=>{ for(let i=0;i<P.length-1;i++){ const [x0,y0]=P[i],[x1,y1]=P[i+1];
    for(let x=Math.min(x0,x1);x<=Math.max(x0,x1);x++) for(let y=Math.min(y0,y1);y<=Math.max(y0,y1);y++) cells[x+","+y]=1; } });
  const rng = castraRng(seed), out = [], used = {};
  let guard = 0;
  while(out.length<n && guard++<2000){
    const x = Math.floor(rng()*CASTRA_P.cols), y = 1+Math.floor(rng()*(CASTRA_P.rows-1)), k = x+","+y;
    if(cells[k] || used[k]) continue;
    // niet te dicht bij het pad: laat bouwplekken over
    let near = 0; for(let dx=-1;dx<=1;dx++) for(let dy=-1;dy<=1;dy++) if(cells[(x+dx)+","+(y+dy)]) near++;
    if(near>=4 && rng()<0.7) continue;
    used[k] = 1; out.push([x,y]);
  }
  return out;
}
(function(){
  const defs = {
    c: { lanes:[ [[0,5],[3,5],[3,1],[7,1],[7,9],[11,9],[11,3],[15,3]] ], seed:3301 },                                 // zigzag
    d: { lanes:[ [[0,0],[14,0],[14,10],[1,10],[1,2],[11,2],[11,8],[8,8]] ], seed:3302 },                              // spiraal (lang)
    e: { lanes:[ [[0,0],[13,0],[13,2],[7,2],[7,5],[15,5]], [[0,10],[13,10],[13,8],[7,8],[7,5],[15,5]] ], seed:3303 }, // twee banen
    g: { lanes:[ [[0,2],[12,2],[12,8],[3,8],[3,5],[9,5]] ], seed:3304 },                                             // S-bocht
    h: { lanes:[ [[0,3],[6,3],[6,7],[15,7]], [[0,10],[10,10],[10,7],[15,7]] ], seed:3305 },                          // twee banen, samenkomend
  };
  Object.keys(defs).forEach(id=>{
    const d = defs[id], lanes = d.lanes.length>1 ? d.lanes : null;
    CASTRA_P_MAPS[id] = { path:d.lanes[0], trees:castraPGenTrees(d.lanes, d.seed, 13) };
    if(lanes) CASTRA_P_MAPS[id].lanes = lanes;
  });
})();

/* ---------- toewijzing aan de missies ---------- */
// roles: welke rollen in deze missie voorkomen (de eerste golf blijft gewoon); edicta: missieregels; map: kaartlayout.
const CASTRA_P_PLAN = {
  m2:  { roles:["velox"] },
  m3:  { roles:["velox"] },
  ro1: { roles:["gravis"],                          map:"c" },
  ro2: { roles:["gravis","velox"], edicta:["ventus"], map:"d" },
  ga1: { roles:["velox","gravis"],                  map:"e" },
  ga2: { roles:["gravis","velox"], edicta:["nox"],  map:"g" },
  gm1: { roles:["scutarius","velox"],               map:"h" },
  gm2: { roles:["scutarius","gravis"], edicta:["pluvia"] },
  g1:  { roles:["medicus","scutarius"],             map:"c" },
  g2:  { roles:["medicus","gravis","velox"], edicta:["acies"], map:"e" },
  la1: { roles:["scutarius","velox","gravis"], edicta:["sine_h"], map:"g" },
  la2: { roles:["medicus","gravis"], edicta:["aestus"], map:"d" },
  t1:  { roles:["medicus","scutarius","velox"], edicta:["frigus"], map:"h" },
  t2:  { roles:["medicus","gravis","scutarius"], edicta:["ventus","acies"] },
  th1: { roles:["scutarius","medicus","velox"], edicta:["nox"], map:"g" },
  th2: { roles:["medicus","gravis"], edicta:["sine_s"], map:"c" },
  pe1: { roles:["medicus","scutarius","gravis","velox"], edicta:["pluvia"], map:"e" },
  pe2: { roles:["medicus","scutarius","gravis","velox"], edicta:["frigus","ventus"], map:"h" },
  ae1: { roles:["medicus","gravis","velox"], edicta:["aestus"], map:"d" },
  ae2: { roles:["medicus","scutarius","gravis","velox"], edicta:["acies"], map:"g" },
  af1: { roles:["medicus","scutarius","gravis","velox"], edicta:["nox","sine_d"], map:"h" },
  af2: { roles:["medicus","scutarius","gravis","velox"], edicta:["frigus","pluvia"], map:"e" },
};
(function(){
  CASTRA_P_MISSIONS.forEach(m=>{
    const P = CASTRA_P_PLAN[m.id]; if(!P) return;
    if(P.map) m.map = P.map;
    if(P.edicta) m.edicta = P.edicta.slice();
    // rollen: vanaf golf 2 krijgt telkens het grootste groepje een deel van zijn soldaten de rol (golf 1 blijft rustig)
    (P.roles||[]).forEach((role,i)=>{
      const w = 1 + (i % Math.max(1, m.waves.length-1)); if(w >= m.waves.length) return;
      const wave = m.waves[w]; let gi = 0; wave.forEach((g,j)=>{ if(!g.role && g.n > wave[gi].n) gi = j; });
      const g = wave[gi]; if(g.role) return;
      const R = CASTRA_P_ROLES[role], k = Math.max(1, Math.min(R.maxk, Math.round(g.n*R.frac)));
      const rg = { ...g, n:k, role }, rest = { ...g, n:g.n-k };
      wave.splice(gi, 1, ...(rest.n>0 ? (R.prio>0 ? [rg, rest] : [rest, rg]) : [rg]));
    });
  });
})();

/* ---------- woordenlijst (tikbare Latijnse uitleg) ---------- */
Object.assign(CASTRA_GLOSS, {
  "celer":"snel", "velox":"snel", "sine":"zonder", "heroibus":"helden (zonder helden)", "sagittariis":"boogschutters (zonder)", "donis":"gunsten (zonder)", "celeriores":"sneller", "cito":"snel", "currit":"rent", "sed":"maar", "infirmus":"zwak", "gravis":"zwaar", "tardus":"langzaam", "fortis":"sterk", "scutarius":"schilddrager", "socios":"kameraden (4e naamval)", "tegit":"beschermt",
  "medicus":"genezer, arts", "sanat":"geneest", "ventus":"wind", "flat":"blaast", "nox":"nacht", "minus":"minder", "vident":"zien", "pluvia":"regen", "cadit":"valt", "arcus":"bogen", "madidi":"nat",
  "aestus":"hitte", "magnus":"groot", "equites":"ruiters", "fessi":"moe", "frigus":"kou", "lentius":"langzamer", "pugnant":"vechten", "acies":"slagorde", "angusta":"smal", "quinque":"vijf", "sufficiunt":"zijn genoeg",
  "heroes":"helden", "hodie":"vandaag", "sagittarii":"boogschutters", "dona":"gunsten", "sunt":"zijn", "est":"is", "non":"niet", "hostes":"vijanden", "hostis":"vijand",
});
