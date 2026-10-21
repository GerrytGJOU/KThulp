/* ============================================================================
   CASTRA HERONUM — VENATIO (jagen)
   ----------------------------------------------------------------------------
   Poort: porta decumana. Regio Latium (andere regio's staan op slot).
   Loop: Venare -> Latijns verkenningsbericht -> kies welke soldaat je stuurt
   (het bericht noemt het type vijand in het Latijn: wie niet leest, kiest blind)
   -> kort beurtgevecht (Oppugna / Defende) -> buit -> vijand opnemen in het kamp.
   Zonder soldaat vecht de dux zelf. Ontwerp: CASTRA_HERONUM.md (Venatio).
   Data/teksten: castra-data.js, castra-latin.js. Laadt NA castra.js.
   ============================================================================ */

const CASTRA_V_BAL = {
  hurtMinutesLoss: 10,        // gewond na verlies
  hurtMinutesWin: 3,          // lichte blessure na winst met veel schade
  typeAdv: 1.5, typeDis: 0.75,
  defendTakes: 0.5, maxRounds: 12,
  xpWin: 10, xpPerEnemyLvl: 1.5,
  lootAes: [8,16], lootFrumentum: [6,12],
  dux: { vita:44, impetus:10, tutela:8, celeritas:6, ambitus:1 },
  wildMult: 1.0,              // wilde vijanden in Latium iets zwakker dan een geworven soldaat
};
let CASTRA_V = null;
let CASTRA_V_PENDING = false;   // ontmoeting uit de wereld: start direct bij het verkenningsbericht   // { region, terrain, enemy, enemyStats, mine, ... }

function castraWeightedPick(list, rng){
  const tot = list.reduce((a,x)=>a+x.w,0); let r = rng()*tot;
  for(const x of list){ r-=x.w; if(r<=0) return x; }
  return list[list.length-1];
}
function castraIsHurt(s){ return (s.hurtUntil||0) > castraNow(); }
function castraHurtMin(s){ return Math.ceil(((s.hurtUntil||0)-castraNow())/60000); }
function castraTypeMult(att, def){
  const A = CASTRA_TYPES[att], D = CASTRA_TYPES[def];
  if(A && A.beats===def) return CASTRA_V_BAL.typeAdv;
  if(D && D.beats===att) return CASTRA_V_BAL.typeDis;
  return 1;
}

// Maak een wilde vijand voor deze regio/terrein: tier 60/28/10/2% (begrensd door het praetorium-level),
// volk uit de regio, vorm gewogen op het terrein, level passend bij de tier (castraWildPick, castra-troops.js).
// Gedwongen ontmoeting met een vaste vijand (baas of kampioen); force = { form, lvl, boss }.
function castraForcedEncounter(regionId, terrainId, force){
  const V = castraMakeEncounter(regionId, terrainId);
  const e = castraRollSoldier(force.form); e.lvl = force.lvl;
  const st = castraStats(e); Object.keys(st).forEach(k=>{ st[k] = Math.max(1, Math.round(st[k]*CASTRA_V_BAL.wildMult)); });
  V.enemy = e; V.stats = st; V.stranger = false; V.boss = force.boss || null;
  return V;
}
function castraMakeEncounter(regionId, terrainId){
  const reg = CASTRA_VENATIO[regionId];
  const rng = castraRng((CASTRA.seed ^ 0x51ed270b)>>>0); CASTRA.seed = (CASTRA.seed + 7)>>>0;
  const terrain = (terrainId && reg.terrains.find(t=>t.id===terrainId)) || reg.terrains[Math.floor(rng()*reg.terrains.length)];
  const pick = castraWildPick(reg, terrain, rng);
  const e = castraRollSoldier(pick.form.id);
  if(typeof castraCodexSee==="function") castraCodexSee(pick.form.id);
  e.lvl = pick.lvl;
  const st = castraStats(e);
  Object.keys(st).forEach(k=>{ st[k] = Math.max(1, Math.round(st[k]*CASTRA_V_BAL.wildMult)); });
  return { region:regionId, terrain, enemy:e, stats:st, stranger: pick.form.volk!=="myt" && pick.form.volk!==castraMainFolk(reg, terrain) };
}

/* ---------- scherm ---------- */
SCREENS.castraVenatio = function(){
  document.body.classList.remove("greek");
  if(!CASTRA) castraLoad();
  if(CASTRA_V_PENDING && CASTRA_V){ CASTRA_V_PENDING = false; castraVRender("scout"); return; }
  CASTRA_V = null;
  castraVRender("kies");
};

function castraVBack(){ const w = CASTRA_V && CASTRA_V.fromWorld; CASTRA_V=null; go(w ? "castraWorld" : "castraHome"); }

function castraVRender(stage){
  const reg = CASTRA_VENATIO.latium;
  const head = `<div class="scrhead"><button class="back" onclick="castraVBack()">${iconSVG("shield",20,"currentColor")}</button><h2>🏹 ${castraLa("venatio_titel")}</h2></div>`;
  let body = "";
  if(stage==="kies"){
    body = `<div class="panel"><div style="font-size:17px;margin-bottom:8px">${castraLa("venatio_intro")}</div>
      <button class="tile" onclick="castraVStart('latium')"><span class="ic">${iconSVG("eagle",44,"currentColor")}</span>
        <h3>${esc(reg.nm)}</h3><p>${castraLa("venare")}</p></button>
      ${CASTRA_REGIONS.filter(r=>r.id!=="latium").map(r=>`<div class="tile" style="opacity:.45;cursor:default"><span class="ic">🔒</span><h3>${esc(r.nm)}</h3><p>${castraLa("clausum")}</p></div>`).join("")}
    </div>${castraVSoldierStrip()}`;
  } else if(stage==="scout"){
    const V = CASTRA_V, tl = CASTRA_TYPE_LA[castraLine(V.enemy.line).type];
    const ing = V.enemy.ingenium;
    const la = `${V.terrain.la} ${tl.pl} adsunt. Hostis ${ing} est.${V.stranger?" "+CASTRA_LA.peregrinus.la:""}`;
    const nl = `${V.terrain.nl} zijn ${tl.nl_pl}. De vijand is ${CASTRA_INGENIUM_NL[ing]||ing}.${V.stranger?" "+CASTRA_LA.peregrinus.nl:""}`;
    const healthy = CASTRA.soldiers.filter(s=>!castraIsHurt(s));
    const cards = healthy.map(s=>{
      const st = castraStats(s), t = CASTRA_TYPE_LA[castraLine(s.line).type];
      return `<button class="tile" onclick="castraVFight('${s.id}')"><span class="ic">${castraLine(s.line).type==="cav"?"🐎":castraLine(s.line).type==="rng"?"🏹":"🛡️"}</span>
        <h3>${s.insignis?"✨ ":""}${esc(castraSoldierName(s))} <small>${castraLaText("gradus")} ${s.lvl}</small></h3>
        <p><b>${esc(t.sg)}</b> · ${CASTRA_STATS.slice(0,3).map(x=>x.nm.slice(0,3)+" "+st[x.id]).join(" · ")}</p></button>`;
    }).join("");
    const hurt = CASTRA.soldiers.filter(castraIsHurt).map(s=>`<div class="note">🩹 ${esc(castraSoldierName(s))} — ${castraLaText("vulneratus").replace("Miles tuus","").trim()} (${castraHurtMin(s)} min)</div>`).join("");
    body = `<div class="panel"><div style="font-size:15px;opacity:.9">${castraLa("explorator")}</div>
      <div style="font-size:19px;margin:6px 0 10px">${castraLaHTML(la, nl, "scout")}</div>
      <div style="font-size:17px;margin-bottom:6px">${castraLa("quem_mittis")}</div>
      ${cards || `<div class="note" style="font-size:15px">${castraLa("nullus_miles")}</div>`}
      <button class="btn btn-gold" style="margin-top:8px" onclick="castraVFight('dux')">${healthy.length?"Dux ipse":"Pugna!"}</button>
      ${hurt}</div>`;
  } else if(stage==="battle"){
    body = castraVBattleHTML();
  } else if(stage==="result"){
    body = castraVResultHTML();
  }
  H(brand(true)+head+`<div id="castraVBody">${body}</div>${foot()}`);
}

function castraVSoldierStrip(){
  const n = CASTRA.soldiers.length;
  return `<div class="note" style="margin-top:8px">${castraLaText("milites")}: ${n} / ${castraBarracksCap()}</div>`;
}

function castraVStart(regionId){
  CASTRA_V = castraMakeEncounter(regionId);
  CASTRA_V.log = []; CASTRA_V.round = 0;
  castraVRender("scout");
}

/* ---------- gevecht ---------- */
function castraVFight(sid){
  const V = CASTRA_V; if(!V) return;
  let mine;
  if(sid==="dux"){
    mine = { id:"dux", dux:true, line:"rom_hastatus", lvl:1, xp:0, indoles:{}, ingenium:"fortis", name:"Dux", hurtUntil:0 };
    V.myStats = { ...CASTRA_V_BAL.dux };
    V.myType = "inf";
  } else {
    mine = CASTRA.soldiers.find(s=>s.id===sid); if(!mine) return;
    V.myStats = castraStats(mine);
    V.myType = castraLine(mine.line).type;
  }
  V.mine = mine;
  V.myHp = V.myMax = V.myStats.vita;
  V.enHp = V.enMax = V.stats.vita;
  V.enType = castraLine(V.enemy.line).type;
  V.log = []; V.round = 0; V.over = null; V.dmgTaken = 0;
  castraFsprProbe([[mine.line,"battle_back"],[V.enemy.line,"battle_front"]], ()=>{ if(CASTRA_V===V) castraVRender("battle"); });
}
function castraVBar(cur,max,col){
  const p = Math.max(0, Math.round(100*cur/max));
  return `<div style="height:12px;background:#1b150e;border:1px solid #4a3d2c;border-radius:6px;overflow:hidden"><div style="width:${p}%;height:100%;background:${col}"></div></div><small>${Math.max(0,cur)} / ${max}</small>`;
}
function castraVBattleHTML(){
  const V = CASTRA_V, line = castraLine(V.enemy.line);
  const myName = V.mine.dux ? "Dux" : castraSoldierName(V.mine);
  const log = V.log.slice(-6).map(l=>`<div style="padding:2px 0">${l}</div>`).join("");
  const mySpr = castraFsprHTML(V.mine.line, "battle_back", 96, castraAvatarHTML(castraPLook(V.mine.line), "up", 1, 96), false);
  const enSpr = castraFsprHTML(V.enemy.line, "battle_front", 96, castraAvatarHTML(castraPLook(V.enemy.line), "down", 1, 96), false);
  return `<div class="panel">
    <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:6px">
      <div style="position:relative;width:96px;height:96px">${mySpr}</div>
      <div style="position:relative;width:96px;height:96px">${enSpr}</div>
    </div>
    <div style="display:flex;gap:12px">
      <div style="flex:1"><b>${esc(myName)}</b> <small>(${esc(CASTRA_TYPE_LA[V.myType].sg)})</small>${castraVBar(V.myHp,V.myMax,"#3f9d52")}</div>
      <div style="flex:1;text-align:right"><b>${esc(castraSoldierName(V.enemy))}</b> <small>${castraLaText("gradus")} ${V.enemy.lvl} (${esc(CASTRA_TYPE_LA[line.type].sg)})</small>${castraVBar(V.enHp,V.enMax,"#c8392a")}</div>
    </div>
    <div id="castraVLog" style="min-height:96px;margin:10px 0;font-size:15px">${log}</div>
    <div style="display:flex;gap:10px"><button class="btn btn-gold" style="flex:1" onclick="castraVTurn('attack')">${castraLaText("oppugna")}</button>
      <button class="btn" style="flex:1" onclick="castraVTurn('defend')">${castraLaText("defende")}</button></div>
    <div class="note" style="margin-top:6px">${castraLa("oppugna")} · ${castraLa("defende")}</div>
  </div>`;
}
function castraVHit(att, def, atkType, defType, defending){
  let m = castraTypeMult(atkType, defType);
  let d = Math.max(1, Math.round(att.impetus*m - def.tutela*0.4));
  if(defending) d = Math.max(1, Math.round(d*CASTRA_V_BAL.defendTakes));
  return { d, m };
}
function castraVTurn(action){
  const V = CASTRA_V; if(!V || V.over) return;
  V.round++;
  const defending = action==="defend";
  const myFirst = V.myStats.celeritas >= V.stats.celeritas;
  const eff = m=> m>1 ? " "+castraLaHTML(castraLaText("optime"), CASTRA_LA.optime.nl,"optime") : m<1 ? " "+castraLaHTML(castraLaText("male"), CASTRA_LA.male.nl,"male") : "";
  const mineAct = ()=>{
    if(defending){ V.log.push(castraLa("miles_defendit")); return; }
    const h = castraVHit(V.myStats, V.stats, V.myType, V.enType, false);
    V.enHp -= h.d; V.log.push(castraLa("miles_oppugnat")+eff(h.m));
  };
  const enemyAct = ()=>{
    const h = castraVHit(V.stats, V.myStats, V.enType, V.myType, defending);
    V.myHp -= h.d; V.dmgTaken += h.d; V.log.push(castraLa("hostis_oppugnat")+eff(h.m));
  };
  if(myFirst){ mineAct(); if(V.enHp>0) enemyAct(); } else { enemyAct(); if(V.myHp>0) mineAct(); }
  if(V.enHp<=0) V.over = "win";
  else if(V.myHp<=0) V.over = "lose";
  else if(V.round>=CASTRA_V_BAL.maxRounds) V.over = "flee";
  if(V.over){ castraVFinish(); castraVRender("result"); }
  else castraVRender("battle");
}

/* ---------- afloop ---------- */
function castraVFinish(){
  const V = CASTRA_V, soldier = V.mine.dux ? null : CASTRA.soldiers.find(s=>s.id===V.mine.id);
  V.loot = null; V.leveled = false; V.trace = null;
  if(soldier){
    if(V.over==="lose") castraHurtSoldier(soldier, CASTRA_V_BAL.hurtMinutesLoss);
    else if(V.dmgTaken > V.myMax*0.5) castraHurtSoldier(soldier, CASTRA_V_BAL.hurtMinutesWin);
  }
  if(V.over==="win"){
    const rng = castraRng((CASTRA.seed ^ 0x2545f491)>>>0); CASTRA.seed = (CASTRA.seed+3)>>>0;
    const r = (rng2)=>rng2[0]+Math.floor(rng()*(rng2[1]-rng2[0]+1));
    const aes = r(CASTRA_V_BAL.lootAes), fru = r(CASTRA_V_BAL.lootFrumentum), cap = castraWalletCap();
    CASTRA.res.aes = Math.min(cap, CASTRA.res.aes+aes);
    CASTRA.res.frumentum = Math.min(cap, CASTRA.res.frumentum+fru);
    CASTRA.res.gloria += 1; if(typeof castraPxpAdd==="function") castraPxpAdd(6);
    V.loot = { aes, fru };
    if(V.boss && typeof castraBossWon==="function") castraBossWon(V);
    if(soldier){
      soldier.xp += Math.round(castraCardXp(CASTRA_V_BAL.xpWin + Math.floor(CASTRA_V_BAL.xpPerEnemyLvl*V.enemy.lvl)) * (100 + (typeof castraAffinityPct==="function" ? castraAffinityPct(soldier) : 0)) / 100);   // klasse-affiniteit (crossmode.js)
      const before = soldier.lvl; castraLevelUp(soldier); V.leveled = soldier.lvl > before;
    }
    V.quests = (typeof castraQuestOnWin==="function") ? castraQuestOnWin(V) : [];
    const reg = CASTRA_VENATIO[V.region];
    // Spoor naar een held: kans per winst, met een garantie na 5 winsten zonder spoor ("pity").
    const left = reg.traces.filter(h=>!(CASTRA.traces&&CASTRA.traces[h]));
    const pity = CASTRA.tracePity||0;
    if(left.length && (rng() < reg.traceChance || pity >= 5)){
      const h = left[Math.floor(rng()*left.length)]; (CASTRA.traces||(CASTRA.traces={}))[h]=1; V.trace = h; CASTRA.tracePity = 0;
    } else if(left.length) CASTRA.tracePity = pity+1;
  }
  castraSave();
}
function castraVResultHTML(){
  const V = CASTRA_V;
  let h = `<div class="panel">`;
  if(V.over==="win"){
    h += `<div style="font-size:22px;margin-bottom:6px">${castraLa("vicisti")}</div>
      <div style="font-size:15px">${castraLa("hostis_fugit")}</div>`;
    if(V.loot) h += `<div style="margin-top:6px">${castraLa("praeda")} 🪙 +${V.loot.aes} · 🌾 +${V.loot.fru} · 🏆 +1</div>`;
    (V.quests||[]).forEach(m=>{ h += `<div class="note">📜 ${esc(m.nm)}: ${m.n} / ${m.need}</div>`; });
    if(V.leveled) h += `<div class="note">⭐ ${esc(castraSoldierName(V.mine))} → ${castraLaText("gradus")} ${castraSoldierLvl(V.mine)}</div>`;
    if(V.trace){ const hero = CASTRA_HEROES.find(x=>x.id===V.trace); h += `<div class="note" style="font-size:15px">${castraLa("vestigia")} <b>${esc(hero?hero.nm:"")}</b></div>`; }
    if(V.mine.dux || true){
      const full = CASTRA.soldiers.length >= castraBarracksCap();
      h += `<div style="margin-top:12px;font-size:15px">${castraLa("hostis_dicit")}</div>
        <div style="font-size:17px;margin:6px 0">${castraLa("visne_recipere")}</div>`;
      if(full) h += `<div class="note">${castraLa("castra_plena")}</div>`;
      h += `<div style="display:flex;gap:10px"><button class="btn btn-gold" ${full||V.recruited?"disabled":""} onclick="castraVRecruit()">${castraLaText("recipio")}</button>
        <button class="btn" onclick="castraVAfter()">${castraLaText("dimitto")}</button></div>`;
      if(V.recruited) h += `<div class="note" style="margin-top:8px">✔ ${esc(castraSoldierName(V.enemy))} ${castraLa("adiungit")}</div>`;
    }
  } else {
    h += `<div style="font-size:22px;margin-bottom:6px">${castraLa(V.over==="lose"?"victus_es":"hostis_fugit")}</div>`;
    if(V.over==="lose" && !V.mine.dux) h += `<div class="note">${castraLa("vulneratus")}</div>`;
  }
  h += V.fromWorld
    ? `<div style="display:flex;gap:10px;margin-top:14px"><button class="btn btn-gold" onclick="castraVBack()">${castraLaText("perge")}</button></div></div>`
    : `<div style="display:flex;gap:10px;margin-top:14px"><button class="btn" onclick="castraVStart('${V.region}')">${castraLaText("iterum")}</button>
    <button class="btn" onclick="castraVBack()">${castraLaText("redi")}</button></div></div>`;
  return h;
}
function castraSoldierLvl(s){ const r = CASTRA.soldiers.find(x=>x.id===s.id); return r ? r.lvl : s.lvl; }
function castraVAfter(){ castraVRender("result"); }
function castraVRecruit(){
  const V = CASTRA_V; if(!V || V.recruited) return;
  if(CASTRA.soldiers.length >= castraBarracksCap()) return;
  CASTRA.soldiers.push(V.enemy);   // de wilde soldaat behoudt zijn eigen aanleg/karakter/insignis
  V.recruited = true; castraSave(); if(typeof castraPxpAdd==="function") castraPxpAdd(10);
  castraVRender("result");
}
