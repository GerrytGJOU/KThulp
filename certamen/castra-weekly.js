/* ============================================================================
   CASTRA HEROUM — WEKELIJKSE UITDAGING (Hebdomada)
   ----------------------------------------------------------------------------
   Elke ISO-week (in UTC, dus overal dezelfde week) een nieuwe tactische puzzel, volledig
   lokaal gegenereerd zonder server of handwerk, en dezelfde voor iedereen met dezelfde
   voortgang. Optioneel: niets blokkeert de rest van het spel en een lege week kost niets.
   Opbouw:
     - vier sjablonen (Verdediging, Prioriteit, Efficiëntie, Beheersing) die in een vaste
       volgorde wisselen, elk met eigen vijandrollen, missieregels, bevelenlimiet, bonusdoel
       en een kleine Latijnse vraag;
     - kaart en regelvariant volgen uit een hash van de week-ID (CH-JJJJ-Www), nooit gelijk
       aan de kaart van de week ervoor;
     - de vijanden komen uit de hoogste missie die de speler al gewonnen heeft (zo is de
       uitdaging nooit zwaarder dan wat hij kent) en de zwaarte (hpMult) wordt met
       dezelfde headless proef als de campagne afgesteld: zelfde verhouding tot de
       maximaal winbare zwaarte als de basismissie, met een terugvalstap als het
       referentieteam toch niet wint;
     - persoonlijk record per week, beloning bij de eerste winst en voor het bonusdoel;
     - de Latijnse vraag is optioneel en blokkeert niets (fout = uitleg + opnieuw proberen).
   Opslag: CASTRA.weekly = { id, tries, best, win, bonus, paid, bonusPaid, latin, hist:[...], cal:{} }.
   Laadt NA castra-report.js.
   ============================================================================ */

const CASTRA_WK_MAPS = ["a","b","c","d","e","g","h"];
const CASTRA_WK_TYPES = [
  { id:"def", kind:"Verdediging", icon:"🏃", la:"Via celeris", nl:"De snelle weg", roles:["velox","velox","gravis"],
    edicta:[ ["ventus"], ["ventus"] ], bonus:{ k:"hp", v:8 }, bonusNl:"Houd minstens 8 van de 10 levens van het kamp over.",
    task:"Houd het kamp intact tegen snelle vijanden.", words:[["celer","snel"],["hostis","vijand"],["castra","kamp"]] },
  { id:"pri", kind:"Prioriteit", icon:"⚕️", la:"Medicus primus", nl:"Eerst de genezer", roles:["medicus","scutarius","medicus"],
    edicta:[ ["nox"], ["nox"] ], bonus:{ k:"cmd", v:2 }, bonusNl:"Win met maximaal 2 bevelen.",
    task:"Schakel de genezers en schilddragers uit voor ze hun werk doen.", words:[["medicus","genezer"],["sagitta","pijl"],["petit","valt aan"]] },
  { id:"eff", kind:"Efficiëntie", icon:"⚔️", la:"Acies angusta", nl:"Een kleine verdediging", roles:["gravis","velox","gravis"],
    edicta:[ ["acies","sine_h"], ["acies"] ], bonus:{ k:"hp", v:8 }, bonusNl:"Win met minstens 8 levens over.",
    task:"Kies je vijf beste soldaten en win met weinig verlies.", words:[["miles","soldaat"],["via","weg"],["defendit","verdedigt"]] },
  { id:"beh", kind:"Beheersing", icon:"⚡", la:"Imperium parcum", nl:"Zuinig met bevelen", roles:["medicus","gravis","velox","scutarius"],
    edicta:[ ["frigus","pluvia"], ["frigus"] ], cmdMax:1, bonus:{ k:"leaks", v:0 }, bonusNl:"Win zonder dat één vijand het kamp bereikt.",
    task:"Je mag maar één bevel geven: kies het moment goed.", words:[["impete","val aan"],["state","houd stand"],["imperator","bevelhebber"]] },
];

/* ---------- week-ID en seed ---------- */
function castraWkIso(ms){
  const d = new Date(ms), t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())), day = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate()+4-day); const y = t.getUTCFullYear(), w = Math.ceil(((t - Date.UTC(y,0,1))/86400000 + 1)/7);
  return { y, w, id:"CH-"+y+"-W"+String(w).padStart(2,"0") };
}
function castraWkHash(str){ let h = 2166136261; for(let i=0;i<str.length;i++){ h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h>>>0; }
function castraWkMapOf(id, prevId){
  let k = castraWkHash(id+"|map") % CASTRA_WK_MAPS.length;
  if(prevId && CASTRA_WK_MAPS[castraWkHash(prevId+"|map") % CASTRA_WK_MAPS.length] === CASTRA_WK_MAPS[k]) k = (k+1) % CASTRA_WK_MAPS.length;
  return CASTRA_WK_MAPS[k];
}
function castraWkInfoAt(ms){
  const iso = castraWkIso(ms), prev = castraWkIso(ms - 7*86400000), type = CASTRA_WK_TYPES[(iso.y*53 + iso.w) % CASTRA_WK_TYPES.length];
  return { iso, id:iso.id, type, map:castraWkMapOf(iso.id, prev.id), seed:(castraWkHash(iso.id)%2147483000)+1 };
}
function castraWeeklyAvailable(){ return castraPMissionDone("m3") && (typeof castraUnlocked!=="function" || castraUnlocked("dona")); }
function castraWkBase(){
  let best = null; CASTRA_P_MISSIONS.forEach((m,i)=>{ if(castraPMissionDone(m.id)) best = i; });
  return CASTRA_P_MISSIONS[Math.max(best==null?0:best, CASTRA_P_MISSIONS.findIndex(m=>m.id==="m3"))];
}

/* ---------- referentieproef (zelfde idee als tools/castra-balance-td.js) ---------- */
const CASTRA_WK_FORMS = { 2:{ inf:"rom_hastatus", rng:"rom_veles", cav:"rom_eques", sup:"rom_faber" }, 3:{ inf:"rom_princeps", rng:"rom_funditor", cav:"rom_decurio", sup:"rom_signifer" }, 4:{ inf:"rom_triarius", rng:"rom_sagittarius", cav:"rom_praefectusalae", sup:"rom_aquilifer" } };
const CASTRA_WK_PAT = ["inf","rng","inf","rng","cav","sup","inf","rng","cav","inf","rng","sup"];
function castraWkTeam(lv){
  const tier = lv<16 ? 2 : lv<32 ? 3 : 4, N = Math.min(12, 4+Math.floor(lv/4)), keep = CASTRA.seed; CASTRA.seed = 424242;
  try{ return Array.from({length:N}, (_,i)=>{ const s = castraRollSoldier(CASTRA_WK_FORMS[tier][CASTRA_WK_PAT[i%CASTRA_WK_PAT.length]]); s.lvl = lv; s.id = "wk"+i; return s; }); }
  finally{ CASTRA.seed = keep; }
}
function castraWkPlace(m, towers){
  const cells = castraPPathCells(m.map), trees = {}; CASTRA_P_MAPS[m.map].trees.forEach(t=>{ trees[t[0]+","+t[1]] = 1; });
  const free = []; for(let y=0;y<CASTRA_P.rows;y++) for(let x=0;x<CASTRA_P.cols;x++) if(!cells[x+","+y] && !trees[x+","+y]) free.push([x,y]);
  const pts = []; castraPPaths(m.map).forEach(p=>{ for(let d=0; d<p.len; d+=400) pts.push(castraPPos(p, d)); });
  const used = {}, hit = pts.map(()=>0), out = [];
  towers.forEach(tw=>{
    const t = castraPMakeTower({ nextId:1 }, tw, 0, 0), r2 = t.range*t.range; let best = null, bs = -1;
    free.forEach(([x,y])=>{ if(used[x+","+y]) return; const cx = x*1000+500, cy = y*1000+500; let sc = 0;
      pts.forEach((p,i)=>{ const dx = p[0]-cx, dy = p[1]-cy; if(dx*dx+dy*dy <= r2) sc += 1/(1+hit[i]*0.6); }); if(sc > bs){ bs = sc; best = [x,y]; } });
    if(!best) return; used[best[0]+","+best[1]] = 1; const cx = best[0]*1000+500, cy = best[1]*1000+500;
    pts.forEach((p,i)=>{ const dx = p[0]-cx, dy = p[1]-cy; if(dx*dx+dy*dy <= r2) hit[i]++; });
    out.push({ s:tw, x:best[0], y:best[1] });
  });
  return out;
}
function castraWkRun(m, lv){
  const ed = castraEdictSimSetup(m); let sol = castraWkTeam(lv).filter(s=>ed.banTypes.indexOf(castraLine(s.line).type)<0).slice(0, ed.cap);
  const sim = castraPSim(m, castraWkPlace(m, sol)); sim.mods = { dmg:1, cd:1, rng:1, spd:1, type:{} };
  Object.keys(ed.mods).forEach(k=>{ if(k==="type") Object.keys(ed.mods.type).forEach(t=>{ sim.mods.type[t] = (sim.mods.type[t]||0)+ed.mods.type[t]; }); else sim.mods[k] = Math.round(sim.mods[k]*ed.mods[k]*1000)/1000; });
  let g = 0; while(!sim.over && sim.tick<40000 && g++<400000){ if(!sim.waveActive) castraPStartWave(sim); castraPStep(sim); }
  return { win:sim.over==="win", left:sim.over==="win" ? sim.baseHp : 0 };
}
function castraWkMissionLevel(m){ let L = 0; m.waves.forEach(w=>w.forEach(g=>{ L = Math.max(L, g.lvl); })); return L; }
function castraWkHmax(m, L){
  const keep = m.hpMult, out = [0.6,0.7,0.8].map(f=>{ let lo = 0.05, hi = 400; const lv = Math.max(1, Math.round(f*L));
    for(let i=0;i<18;i++){ const mid = Math.sqrt(lo*hi); m.hpMult = mid; const r = castraWkRun(m, lv); if(r.win && r.left>=5) lo = mid; else hi = mid; } return lo; });
  m.hpMult = keep; return out;
}

/* ---------- scenario bouwen ---------- */
function castraWkApplyRoles(waves, roles){
  roles.forEach((role,i)=>{
    const w = 1 + (i % Math.max(1, waves.length-1)); if(w >= waves.length) return;
    const wave = waves[w]; let gi = 0; wave.forEach((g,j)=>{ if(!g.role && g.n > wave[gi].n) gi = j; });
    const g = wave[gi]; if(g.role || g.n<2) return;
    const R = CASTRA_P_ROLES[role], k = Math.max(1, Math.min(R.maxk, Math.round(g.n*R.frac)));
    const rg = { ...g, n:k, role }, rest = { ...g, n:g.n-k };
    wave.splice(gi, 1, ...(rest.n>0 ? (R.prio>0 ? [rg, rest] : [rest, rg]) : [rg]));
  });
}
function castraWkState(){ return CASTRA.weekly || (CASTRA.weekly = { id:"", tries:0, best:0, win:false, bonus:false, paid:false, bonusPaid:false, latin:null, hist:[], cal:{} }); }
let _castraWkCache = null;
function castraWeeklyMission(){
  if(!castraWeeklyAvailable()) return null;
  const info = castraWkInfoAt(castraNow()), base = castraWkBase(), key = info.id+"|"+base.id;
  if(_castraWkCache && _castraWkCache.key===key) return _castraWkCache.m;
  const T = info.type, W = castraWkState();
  const waves = JSON.parse(JSON.stringify(base.waves)); waves.forEach(w=>w.forEach(g=>{ delete g.role; }));
  castraWkApplyRoles(waves, T.roles);
  const m = { id:"weekly", weekly:true, weekId:info.id, tid:T.id, region:base.region, nm:T.la, nl:T.nl, map:info.map, seed:info.seed, hpMult:base.hpMult, waves,
              edicta:(T.edicta[castraWkHash(info.id+"|ed") % T.edicta.length]).slice(), cmdMax:T.cmdMax, bonus:T.bonus,
              reward:{ aes:Math.round(base.reward.aes*0.6), frumentum:Math.round(base.reward.frumentum*0.6), gloria:Math.max(2, Math.round(base.reward.gloria*0.6)) }, baseId:base.id };
  // zwaarte: dezelfde verhouding tot de maximaal winbare zwaarte als de campagnemissie (gecachet per week en basismissie)
  if(W.cal[key]) m.hpMult = W.cal[key];
  else {
    try{
      const L = castraWkMissionLevel(base), ho = castraWkHmax(base, L), hn = castraWkHmax(m, L);
      const ratio = Math.exp([0,1,2].reduce((a,k)=>a+Math.log(hn[k]/ho[k]),0)/3);
      let hp = Math.max(base.hpMult*0.3, Math.min(base.hpMult*3, base.hpMult*ratio));
      // terugval: het referentieteam moet de uitdaging op 80% van het missielevel kunnen winnen
      const lv = Math.max(1, Math.round(0.8*L)); for(let i=0;i<14;i++){ m.hpMult = Math.round(hp*100)/100; const r = castraWkRun(m, lv); if(r.win && r.left>=3) break; hp *= 0.92; }
      m.hpMult = Math.round(hp*100)/100;
    }catch(e){ m.hpMult = Math.round(base.hpMult*0.6*100)/100; }
    // wekelijks wisselend (deterministisch) en bewaard zodat alle opnieuw-pogingen dezelfde zwaarte hebben
    W.cal[key] = m.hpMult; const keys = Object.keys(W.cal); if(keys.length>12) delete W.cal[keys[0]]; castraSave();
  }
  _castraWkCache = { key, m };
  return m;
}

/* ---------- kaart in de missielijst ---------- */
function castraWkStatusText(){
  const W = castraWkState(), info = castraWkInfoAt(castraNow());
  if(W.id!==info.id) return "Nog niet gespeeld deze week.";
  return `Pogingen: ${W.tries} · record: ${W.best} punten${W.win?" · ✔ gewonnen":""}${W.bonus?" · ★ bonusdoel":""}`;
}
function castraWeeklyCardHTML(){
  const info = castraWkInfoAt(castraNow()), T = info.type;
  if(!castraWeeklyAvailable()) return `<div class="panel" style="opacity:.6"><h3>📅 Hebdomada <small>wekelijkse uitdaging</small></h3><div class="note">Win eerst de eerste drie missies om de wekelijkse uitdaging te ontgrendelen.</div></div>`;
  const ed = T.edicta[castraWkHash(info.id+"|ed") % T.edicta.length].map(id=>CASTRA_EDICTA[id]).filter(Boolean);
  return `<div class="panel" style="border:2px solid #d4af37"><h3>📅 Hebdomada: ${T.icon} ${castraLaHTML(T.la, T.nl, "wk_"+T.id)} <small>week ${info.iso.w} · ${esc(T.kind)}</small></h3>
    <div style="font-size:15px;margin:4px 0">${esc(T.task)}</div>
    <div style="font-size:13px;margin:2px 0">${ed.map(E=>`<span title="${esc(E.ex.nl)}" style="display:inline-block;margin:2px 6px 2px 0;padding:1px 8px;border:1px solid #8a6d2f;border-radius:10px;background:rgba(212,175,55,.12)">${E.icon} ${esc(E.la)}</span>`).join("")}${T.cmdMax!=null?`<span style="display:inline-block;margin:2px 6px 2px 0;padding:1px 8px;border:1px solid #8a6d2f;border-radius:10px;background:rgba(212,175,55,.12)">⚡ max. ${T.cmdMax} bevel</span>`:""}</div>
    <div style="font-size:13px;opacity:.9">★ Bonusdoel: ${esc(T.bonusNl)}</div>
    <div class="note" style="margin:6px 0">${esc(castraWkStatusText())}</div>
    <button class="btn btn-gold" onclick="castraWeeklyStart()">${castraLaText("proelium_ini")}</button>
    <div class="note" style="margin-top:6px;font-size:12px">Een extra uitdaging, nooit verplicht. Elke week een nieuwe; je record blijft staan.</div></div>`;
}
function castraWeeklyStart(){
  const t0 = Date.now(); const m = castraWeeklyMission(); if(!m) return;
  const W = castraWkState(); if(W.id!==m.weekId){ if(W.id) { W.hist.push({ id:W.id, best:W.best, win:W.win, bonus:W.bonus }); if(W.hist.length>8) W.hist.shift(); } Object.assign(W, { id:m.weekId, tries:0, best:0, win:false, bonus:false, paid:false, bonusPaid:false, latin:null, latinTried:false }); }
  W.tries++; castraSave(); castraBStart("weekly");
}
const _castraProeliumWk0 = SCREENS.castraProelium;
SCREENS.castraProelium = function(){
  _castraProeliumWk0();
  const h = document.querySelector(".scrhead"); if(h) h.insertAdjacentHTML("afterend", castraWeeklyCardHTML());
};

/* ---------- resultaat ---------- */
function castraWkBonusOk(B){
  const b = B.mission.bonus, s = B.sim; if(!b || s.over!=="win") return false;
  return b.k==="hp" ? s.baseHp>=b.v : b.k==="cmd" ? (B.cmdUsed||0)<=b.v : b.k==="leaks" ? s.leaked<=b.v : false;
}
function castraWeeklyResult(B){
  const m = B.mission, s = B.sim, W = castraWkState(), win = s.over==="win", bonus = castraWkBonusOk(B);
  let h = "", extra = [];
  if(win){
    const score = s.baseHp*10 + (bonus?50:0) + Math.max(0, 20-(B.cmdUsed||0)*2);
    if(score > W.best) W.best = score;
    W.win = true; if(bonus) W.bonus = true;
    const cap = castraWalletCap();
    if(!W.paid){
      W.paid = true; Object.keys(m.reward).forEach(r=>{ CASTRA.res[r] = r==="gloria" ? (CASTRA.res[r]||0)+m.reward[r] : Math.min(cap, (CASTRA.res[r]||0)+m.reward[r]); });
      if(typeof castraCardToken==="function") castraCardToken(1, "wekelijkse uitdaging");
      if(typeof castraPxpAdd==="function") castraPxpAdd(30, "Wekelijkse uitdaging");
      extra.push(`Beloning: ${Object.keys(m.reward).map(r=>castraRes(r).icon+" +"+m.reward[r]).join(" · ")} · 🎟️ +1 kaarttrekking`);
    } else if(typeof castraPxpAdd==="function") castraPxpAdd(6);
    if(bonus && !W.bonusPaid){ W.bonusPaid = true; CASTRA.res.gloria = (CASTRA.res.gloria||0)+3; if(typeof castraCardToken==="function") castraCardToken(1, "bonusdoel"); extra.push("★ Bonusdoel gehaald: 🏛️ +3 gloria · 🎟️ +1 kaarttrekking"); }
    s.towers.forEach(t=>{ const sol = (CASTRA.soldiers||[]).find(x=>x.id===t.sid); if(sol){ sol.xp += castraCardXp(12 + 6*m.waves.length); castraLevelUp(sol); } });
    castraSave();
    h += `<div style="font-size:22px;margin-bottom:6px">${castraLa("castra_defensa")}</div><div>Punten: <b>${score}</b> · record deze week: <b>${W.best}</b>${bonus?" · ★ bonusdoel":""}</div>${extra.map(e=>`<div class="note">${esc(e)}</div>`).join("")}`;
    if(!bonus) h += `<div class="note">★ Bonusdoel: ${esc(m.bonus ? CASTRA_WK_TYPES.find(t=>t.id===m.tid).bonusNl : "")}</div>`;
  } else {
    h += `<div style="font-size:22px;margin-bottom:6px">${castraLa("castra_capta")}</div><div class="note">Probeer het opnieuw met een andere opstelling. Record deze week: <b>${W.best}</b> punten.</div>`;
  }
  h += castraWkLatinHTML(m);
  return h;
}

/* ---------- optionele Latijnse vraag ---------- */
function castraWkLatinHTML(m){
  const W = castraWkState(), T = CASTRA_WK_TYPES.find(t=>t.id===m.tid); if(W.latin==="ok") return `<div class="note" style="margin-top:8px">📜 Woordvraag van deze week: ✔ gehaald.</div>`;
  const q = T.words[castraWkHash(m.weekId+"|q") % T.words.length];
  const wrong = CASTRA_WK_TYPES.reduce((a,t)=>a.concat(t.words), []).filter(w=>w[1]!==q[1]).sort((a,b)=>castraWkHash(m.weekId+a[0])-castraWkHash(m.weekId+b[0])).slice(0,2).map(w=>w[1]);
  const opts = [q[1]].concat(wrong).sort((a,b)=>castraWkHash(m.weekId+a)-castraWkHash(m.weekId+b));
  return `<div id="wkLatin" style="margin-top:10px;padding-top:8px;border-top:1px solid rgba(138,109,47,.4)"><div style="font-size:15px">📜 Optionele woordvraag: wat betekent <b>${esc(q[0])}</b>?</div>
    <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px">${opts.map(o=>`<button class="btn" style="min-height:40px" onclick="castraWkAnswer(this, ${JSON.stringify(o===q[1])}, ${JSON.stringify(q[0]+" = "+q[1])})">${esc(o)}</button>`).join("")}</div>
    <div class="note" style="margin-top:4px;font-size:12px">Niet verplicht en zonder gevolgen voor je voortgang.</div></div>`;
}
function castraWkAnswer(btn, ok, expl){
  const W = castraWkState(), box = document.getElementById("wkLatin"); if(!box) return;
  if(ok){
    const first = !btn.dataset.tried && !(W.latinTried); W.latin = "ok"; castraSave();
    if(typeof castraPxpAdd==="function") castraPxpAdd(first ? 10 : 5, "Woordvraag");
    castraTDSync({ [first ? "wk_latin_ok1/n" : "wk_latin_ok2/n"]:1 });
    box.innerHTML = `<div style="font-size:15px">✔ Goed! ${esc(expl)} <small>(${first?"+10":"+5"} ervaring)</small></div>`;
  } else {
    W.latinTried = true; btn.disabled = true; btn.style.opacity = ".45"; castraTDSync({ "wk_latin_no/n":1 });
    toast("📜", "Nog niet helemaal. Probeer nog een keer!");
  }
}
Object.assign(CASTRA_GLOSS, { "hebdomada":"week", "hebdomadis":"van de week", "celeris":"snelle", "imperium":"bevel, gezag", "parcum":"zuinig" });
