/* ============================================================================
   CASTRA HEROUM — MOVES EN VANGEN IN HET BEURTGEVECHT (venatio)
   ----------------------------------------------------------------------------
   Het jachtgevecht werkt als Pokémon: je kiest elke beurt een move, de vijand ook, en een
   vijand neem je alleen mee door hem te VANGEN (Capere). Verslaan = hij vlucht.

   Moves van een eenheid (soldaat of vijand, dezelfde regels):
     Oppugna    gewone aanval, altijd beschikbaar, onbeperkt
     <signatuur> eigen move per type, vanaf gradus 3 (zware slag, pijl, uitval, genezing, schrik)
     artes      elke gekozen arte (castra-skills.js, max 4) is ook een move; het effect van de arte
                bepaalt het soort (schade, doorboren, snel, dubbele treffer, vertragen, steun, genezen)
     Defende    verdedigen (halve schade deze beurt), onbeperkt, niet twee beurten achter elkaar
   Elke move heeft een kracht, nauwkeurigheid en PP (hoe vaak je hem per gevecht mag gebruiken).
   Een vijand heeft dezelfde artes die hij als soldaat zou hebben (castraSkillIds), zodat hij
   als gevangen soldaat precies zo vecht. Typevoordeel (inf > cav > rng > inf) blijft gelden.

   Vangen: Capere kost een beurt (max 3 pogingen). De kans stijgt als de levenspunten van de vijand
   dalen (zichtbaar als laag/redelijk/goed), daalt bij een hogere tier, een veel hoger level of een
   ✨ bijzondere vijand, en stijgt bij een vertraagde vijand en bij een goed gelezen Latijnse vraag
   (optioneel, nooit een straf). Bazen zijn niet te vangen. Beginners (minder dan 3 soldaten) hebben
   een hoge kans, zodat de eerste vangst altijd lukt.
   Laadt NA castra-venatio.js, castra-skills.js en castra-latin.js.
   ============================================================================ */

const CASTRA_MV_BAL = {
  critPct:6, critMult:1.5, maxRounds:16, catchTries:3,
  catchBase:0.15, catchHp:0.62, tierPenalty:0.09, lvlPenalty:0.02, shinyPenalty:0.15, slowBonus:0.10, latinBonus:0.20, beginnerFloor:0.9,
  buff:1.3, buffTurns:3, slowTurns:3, healPct:30, guardTakes:0.5, sigLvl:3,
  hpMult:2.2,        // levenspunten in dit gevecht (gevechten duren zo ±8 beurten en er is tijd om te vangen)
};
const CASTRA_MV_BASIC  = { id:"oppugna", la:"Oppugna", nl:"Gewone aanval", kind:"dmg", power:50, acc:100, pp:0 };
const CASTRA_MV_DEFEND = { id:"defende", la:"Defende", nl:"Verdedig: deze beurt de helft minder schade (niet twee keer achter elkaar)", kind:"guard", pp:0, prio:2 };
const CASTRA_MV_SIG = {
  inf:  { id:"sig_inf",  la:"Gravis ictus", nl:"Zware slag", kind:"dmg", power:72, acc:90,  pp:6 },
  rec:  { id:"sig_inf",  la:"Gravis ictus", nl:"Zware slag", kind:"dmg", power:72, acc:90,  pp:6 },
  rng:  { id:"sig_rng",  la:"Sagitta",      nl:"Pijl die een kwart van de verdediging negeert", kind:"dmg", power:60, acc:100, pp:8, pierce:25 },
  cav:  { id:"sig_cav",  la:"Incursus",     nl:"Snelle uitval (gaat eerst)", kind:"dmg", power:62, acc:95, pp:6, prio:1 },
  sup:  { id:"sig_sup",  la:"Cura",         nl:"Geneest 30% van je levenspunten", kind:"heal", pp:4 },
  myth: { id:"sig_myth", la:"Terror",       nl:"Zwakke aanval die de vijand vertraagt", kind:"dmg", power:40, acc:100, pp:8, slow:30 },
};
const CASTRA_MV_ICON = { rec:"⚔️", inf:"🛡️", rng:"🏹", cav:"🐎", sup:"✨", myth:"🐉" };

// Een arte (castra-skills.js) wordt een move; het soort volgt uit het effect.
function castraMvFromSkill(k){
  if(k.mv) return { id:k.id, la:k.la, src:"arte", ...k.mv };
  const f = k.fx, m = { id:k.id, la:k.la, src:"arte", kind:"dmg", power:55, acc:95, pp:6, nl:"" };
  if(f.nth){ m.power = 40 + 30*f.nth.mult; m.acc = 85; m.pp = 4; m.nl = "Zware slag"; }
  else if(f.charge){ m.power = 60 + 25*f.charge.mult; m.acc = 90; m.pp = 3; m.nl = "Openingsaanval"; }
  else if(f.double){ m.hits = 2; m.power = 38; m.acc = 90; m.pp = 6; m.nl = "Dubbele treffer"; }
  else if(f.splash){ m.power = 55 + Math.round(f.splash.pct/2); m.acc = 95; m.pp = 6; m.nl = "Brede slag"; }
  else if(f.slow){ m.power = 35; m.acc = 100; m.pp = 8; m.slow = f.slow.pct; m.nl = "Aanval die de vijand vertraagt"; }
  else if(f.pierce){ m.power = 55; m.pierce = f.pierce; m.acc = 95; m.pp = 8; m.nl = "Negeert "+f.pierce+"% van de verdediging"; }
  else if(f.cd){ m.power = 35 + f.cd; m.prio = 1; m.acc = 100; m.pp = 10; m.nl = "Snelle aanval (gaat eerst)"; }
  else if(f.rng){ m.power = 50 + Math.round(f.rng/2); m.acc = 100; m.pp = 8; m.nl = "Raakt altijd"; }
  else if(f.dmg){ m.power = 50 + 2*f.dmg; m.acc = 95; m.pp = 8; m.nl = "Krachtige aanval"; }
  else if(f.regen){ m.kind = "heal"; m.pp = 3; m.nl = "Geneest 30% van je levenspunten"; }
  else if(f.aura || f.global){ m.kind = "buff"; m.pp = 4; m.nl = "Je aanval wordt 3 beurten 30% sterker"; }
  else if(f.reward){ m.kind = "shield"; m.pp = 4; m.nl = "Je verdediging wordt 3 beurten 30% sterker"; }
  if(m.kind==="dmg" && !m.nl) m.nl = "Aanval";
  if(m.kind==="dmg") m.nl += " (kracht "+m.power+", "+m.acc+"% raak)";
  return m;
}
// Alle moves van een eenheid: Oppugna, signatuur (vanaf gradus 3), gekozen artes. Defende staat apart.
function castraMvSet(unit, type){
  const out = [ { ...CASTRA_MV_BASIC } ];
  if(unit.dux) return out;
  if((unit.lvl||1) >= CASTRA_MV_BAL.sigLvl && CASTRA_MV_SIG[type]) out.push({ ...CASTRA_MV_SIG[type], src:"sig" });
  let ids = []; try{ ids = castraSkillIds(unit); }catch(e){}
  ids.forEach(id=>{ const k = castraSkillById(id); if(k) out.push(castraMvFromSkill(k)); });
  return out;
}

/* ---------- toestand ---------- */
function castraMvSide(unit, stats, type, name){
  const moves = castraMvSet(unit, type), pp = {}; moves.forEach(m=>{ if(m.pp) pp[m.id] = m.pp; });
  const hpm = Math.round(stats.vita*CASTRA_MV_BAL.hpMult);
  return { unit, stats, type, name, moves, pp, hp:hpm, max:hpm, buffImp:0, buffTut:0, slow:0, slowPct:0, guard:false, lastGuard:false };
}
function castraMvSync(V){   // oude velden (castraVFinish en anderen lezen die)
  V.myHp = V.s.me.hp; V.myMax = V.s.me.max; V.enHp = V.s.en.hp; V.enMax = V.s.en.max;
}
const _castraVFightMv0 = castraVFight;
function castraMvName(u){ return u.dux ? "Dux" : u.hero ? CASTRA_HERO_DATA[u.h.id].nm : castraSoldierName(u); }
function castraMvInit(V){
  const myName = castraMvName(V.mine), enName = castraSoldierName(V.enemy);
  V.s = { me:castraMvSide(V.mine, V.myStats, V.myType, myName), en:castraMvSide(V.enemy, V.stats, V.enType, enName) };
  V.rng = castraRng((CASTRA.seed ^ 0x6d2b79f5)>>>0); CASTRA.seed = (CASTRA.seed+5)>>>0;
  V.catchLeft = CASTRA_MV_BAL.catchTries; V.ask = null; V.caught = false; V.lastMe = null;
  castraMvSync(V);
  V.round = 0; V.over = null; V.dmgTaken = 0;
  V.log = [ castraLaHTML(`${enName} adest!`, `${enName} verschijnt!`, "mv_adest") ];
  const probe = [[V.enemy.line,"portrait"],[V.enemy.line,"battle_front"]];
  if(V.mine.line) probe.push([V.mine.line,"portrait"],[V.mine.line,"battle_back"]);
  else if(V.mine.hero && typeof castraHeroFormId==="function"){ const hf = castraHeroFormId(V.mine.h); probe.push([hf,"portrait"],[hf,"battle_back"]); }
  castraFsprProbe(probe, ()=>{ if(CASTRA_V===V && !V.over) castraVRender("battle"); });
}
castraVFight = function(sid){
  const V = CASTRA_V; if(!V) return;
  if(String(sid).indexOf("hero_")===0){            // een held vecht mee (alleen heldenartes en -stats, geen blessure)
    const h = castraHero(String(sid).slice(5)); if(!h) return;
    V.mine = castraHeroAsUnit(h); V.myStats = castraHeroStats(h); V.myType = CASTRA_HERO_DATA[h.id].type;
    V.stats = V.stats || castraStats(V.enemy); V.enType = castraLine(V.enemy.line).type;
    castraMvInit(V); return;
  }
  _castraVFightMv0.apply(this, arguments);        // zet V.mine, V.myStats, V.myType, V.stats, V.enType voor soldaat of dux
  if(!V.mine) return;
  castraMvInit(V);
};
// Held als vechter: ervaring en level voor de held (soldaten en dux regelt castraVFinish zelf), plus het contubernium.
const _castraVFinishMv0 = castraVFinish;
castraVFinish = function(){
  const V = CASTRA_V; _castraVFinishMv0.apply(this, arguments);
  if(!V || V.over!=="win" || !V.mine) return;
  if(V.mine.hero){
    const hh = V.mine.h, xp = castraCardXp(castraXpWild(V, { lvl:hh.lvl }));
    hh.xp += xp; V.leveled = castraHeroLevelUp(hh); V.heroXp = xp;
  }
  if(typeof castraContubernium==="function") V.cont = castraContubernium({ V, ids:[V.mine.id] });
  castraSave();
};
// Scoutscherm: ook je helden kunnen op jacht.
const _castraVRenderMv0 = castraVRender;
castraVRender = function(stage){
  _castraVRenderMv0.apply(this, arguments);
  if(stage==="scout") try{ castraMvScoutHeroes(); }catch(e){}
};
function castraMvScoutHeroes(){
  const heroes = CASTRA.heroes || []; if(!heroes.length) return;
  const btn = [...document.querySelectorAll("#castraVBody button")].find(b=>/castraVFight\('dux'\)/.test(b.getAttribute("onclick")||"")); if(!btn) return;
  const html = heroes.map(h=>{ const d = CASTRA_HERO_DATA[h.id], st = castraHeroStats(h), t = CASTRA_TYPE_LA[d.type];
    return `<button class="tile" onclick="castraVFight('hero_${h.id}')"><span class="ic">⭐</span><h3>${esc(d.nm)} <small>${castraLaText("gradus")} ${h.lvl}</small></h3>
      <p><b>${esc(t.sg)}</b> · ${CASTRA_STATS.slice(0,3).map(x=>x.nm.slice(0,3)+" "+st[x.id]).join(" · ")}</p></button>`; }).join("");
  btn.insertAdjacentHTML("beforebegin", html);
}

/* ---------- schade en effecten ---------- */
function castraMvCalc(A, D, move){
  const m = castraTypeMult(A.type, D.type);
  const imp = A.stats.impetus * (A.buffImp>0 ? CASTRA_MV_BAL.buff : 1);
  const tut = D.stats.tutela * (D.buffTut>0 ? CASTRA_MV_BAL.buff : 1) * (1 - (move.pierce||0)/100);
  let d = Math.max(1, Math.round(imp*(move.power/50)*m - tut*0.4));
  if(D.guard) d = Math.max(1, Math.round(d*CASTRA_MV_BAL.guardTakes));
  return { d, m };
}
function castraMvEff(m){ return m>1 ? " "+castraLaHTML(castraLaText("optime"), CASTRA_LA.optime.nl, "optime") : m<1 ? " "+castraLaHTML(castraLaText("male"), CASTRA_LA.male.nl, "male") : ""; }
// Voert één move uit; geeft de logregels terug en past de toestand aan.
function castraMvExec(V, who, move){
  const A = V.s[who], D = V.s[who==="me" ? "en" : "me"], rng = V.rng, lines = [];
  const nm = `<b>${esc(A.name)}</b>`, head = `${nm}: <i>${esc(move.la)}</i>!`;
  if(move.pp) A.pp[move.id] = Math.max(0, (A.pp[move.id]||0)-1);
  if(move.kind==="guard"){
    if(A.lastGuard){ lines.push(head+" "+castraLaHTML("Sed non iterum.", "Maar niet twee keer achter elkaar.", "mv_iter")); A.lastGuard = false; return lines; }
    A.guard = true; lines.push(head+" "+castraLaHTML("Se defendit.", "Verdedigt zich.", "mv_defendit")); return lines;
  }
  if(move.kind==="heal"){
    const amt = Math.round(A.max*CASTRA_MV_BAL.healPct/100), got = Math.min(amt, A.max-A.hp); A.hp += got;
    lines.push(head+" "+(got ? `+${got} ❤️` : castraLaHTML("Nihil iuvat.", "Het helpt niet (al vol).", "mv_nihil"))); return lines;
  }
  if(move.kind==="buff"){ A.buffImp = CASTRA_MV_BAL.buffTurns; lines.push(head+" ⬆ "+castraLaHTML("Vires crescunt.", "De aanvalskracht stijgt.", "mv_vires")); return lines; }
  if(move.kind==="shield"){ A.buffTut = CASTRA_MV_BAL.buffTurns; lines.push(head+" 🛡 "+castraLaHTML("Tutela crescit.", "De verdediging stijgt.", "mv_tutela")); return lines; }
  // schade
  if(rng()*100 >= (move.acc||100)){ lines.push(head+" "+castraLaHTML("Ictus fallit.", "De aanval mist.", "mv_fallit")); return lines; }
  const hits = move.hits || 1; let total = 0, last = null, crit = false;
  for(let i=0;i<hits && D.hp>0;i++){
    const r = castraMvCalc(A, D, move); let d = r.d;
    if(rng()*100 < CASTRA_MV_BAL.critPct){ d = Math.round(d*CASTRA_MV_BAL.critMult); crit = true; }
    D.hp -= d; total += d; last = r;
  }
  if(who==="en") V.dmgTaken += total;
  lines.push(head+` −${total}`+(hits>1?` (${hits}×)`:"")+castraMvEff(last.m)+(crit?" 💥 "+castraLaHTML("Ictus gravis!", "Voltreffer!", "mv_crit"):""));
  if(move.slow && D.hp>0){ D.slow = CASTRA_MV_BAL.slowTurns; D.slowPct = move.slow; lines.push("🐌 "+castraLaHTML(esc(D.name)+" tardior est.", D.name+" is vertraagd.", "mv_tardior")); }
  return lines;
}
function castraMvSpeed(S){ return S.stats.celeritas * (S.slow>0 ? (1 - S.slowPct/100) : 1); }

/* ---------- keuze van de vijand ---------- */
function castraMvAvail(S){ return S.moves.filter(m=>!m.pp || (S.pp[m.id]||0)>0); }
function castraMvExpected(A, D, m){ if(m.kind!=="dmg") return 0; const r = castraMvCalc(A, D, m); return r.d*(m.hits||1)*(m.acc/100); }
function castraMvAI(V){
  const A = V.s.en, D = V.s.me, rng = V.rng, av = castraMvAvail(A), hp = A.hp/A.max;
  const heal = av.find(m=>m.kind==="heal"), buff = av.find(m=>m.kind==="buff"), shield = av.find(m=>m.kind==="shield");
  if(heal && hp<0.4 && rng()<0.7) return heal;
  if(buff && A.buffImp<=0 && V.round<=2 && rng()<0.45) return buff;
  if(shield && A.buffTut<=0 && hp<0.7 && rng()<0.25) return shield;
  if(hp<0.3 && !A.lastGuard && rng()<0.18) return CASTRA_MV_DEFEND;
  const dmg = av.filter(m=>m.kind==="dmg"); if(!dmg.length) return CASTRA_MV_BASIC;
  if(rng()<0.25) return dmg[Math.floor(rng()*dmg.length)];
  return dmg.slice().sort((a,b)=>castraMvExpected(A,D,b)-castraMvExpected(A,D,a))[0];
}

/* ---------- beurt ---------- */
function castraMvPrio(m){ return m.prio||0; }
function castraVTurn(action){
  const V = CASTRA_V; if(!V || V.over || !V.s) return;
  let mine = action==="defende" ? CASTRA_MV_DEFEND : V.s.me.moves.find(m=>m.id===action);
  if(!mine || (mine.pp && (V.s.me.pp[mine.id]||0)<=0)) return;
  castraMvPlay(V, mine);
}
// Eén beurt: ik kies `mine` (of niets bij een vangpoging: mine = null), de vijand kiest zelf.
function castraMvPlay(V, mine){
  castraMvRound(V, mine);
  if(V.over){ castraVFinish(); castraVRender("result"); } else castraVRender("battle");
}
// Alleen de toestand (ook voor de balansproef in tools/castra-moves-test.js).
function castraMvRound(V, mine){
  V.round++; V.ask = null; V.log = [];
  const me = V.s.me, en = V.s.en; me.guard = false; en.guard = false;
  const theirs = castraMvAI(V), order = [];
  if(mine) order.push(["me", mine]);
  order.push(["en", theirs]);
  order.sort((a,b)=>{
    const pa = castraMvPrio(a[1]), pb = castraMvPrio(b[1]); if(pa!==pb) return pb-pa;
    const sa = castraMvSpeed(V.s[a[0]]), sb = castraMvSpeed(V.s[b[0]]); if(sa!==sb) return sb-sa;
    return a[0]==="me" ? -1 : 1;
  });
  order.forEach(([who,mv])=>{
    if(V.s.me.hp<=0 || V.s.en.hp<=0) return;
    castraMvExec(V, who, mv).forEach(l=>V.log.push(l));
    if(mv.kind==="guard") V.s[who].lastGuard = V.s[who].guard;
  });
  ["me","en"].forEach(k=>{ const S = V.s[k]; if(!S.guard) S.lastGuard = false; if(S.buffImp>0) S.buffImp--; if(S.buffTut>0) S.buffTut--; if(S.slow>0) S.slow--; });
  V.lastMe = mine ? mine.id : "capere";
  castraMvSync(V);
  if(V.enHp<=0) V.over = "win";
  else if(V.myHp<=0) V.over = "lose";
  else if(V.round>=CASTRA_MV_BAL.maxRounds) V.over = "flee";
}

/* ---------- vangen ---------- */
function castraMvCatchable(V){ return !(V.boss && String(V.boss.key||"").indexOf("boss_")===0); }
function castraMvCatchChance(V, latinOk){
  const B = CASTRA_MV_BAL, en = V.s.en, f = castraLine(V.enemy.line), hpFactor = 1 - Math.max(0, en.hp)/en.max;
  let p = B.catchBase + B.catchHp*hpFactor;
  p *= 1 - B.tierPenalty*Math.max(0, f.tier-1);
  p *= 1 - Math.min(0.5, B.lvlPenalty*Math.max(0, V.enemy.lvl - (V.mine.lvl||1)));
  if(V.enemy.insignis) p -= B.shinyPenalty;
  if(en.slow>0) p += B.slowBonus;
  if(latinOk) p += B.latinBonus;
  if(CASTRA.soldiers.length < 3) p = Math.max(p, B.beginnerFloor);
  return Math.max(0.05, Math.min(0.95, p));
}
function castraMvChanceLabel(p){ return p>=0.65 ? ["goed","#3f9d52"] : p>=0.35 ? ["redelijk","#d4a017"] : ["laag","#c8392a"]; }
function castraVCatch(){
  const V = CASTRA_V; if(!V || V.over || !V.s) return;
  if(!castraMvCatchable(V)){ V.log = [castraLaHTML("Hunc hostem capere non potes.", "Deze vijand kun je niet vangen (een baas).", "mv_baas")]; castraVRender("battle"); return; }
  if(V.catchLeft<=0){ V.log = [castraLaHTML("Nulli funes manent.", "Je hebt geen vangpogingen meer.", "mv_nofunes")]; castraVRender("battle"); return; }
  if(CASTRA.soldiers.length >= castraBarracksCap()){ V.log = [castraLa("castra_plena")]; castraVRender("battle"); return; }
  // optionele Latijnse vraag: welk soort vijand is dit? (het bericht van de verkenner)
  const types = ["inf","rng","cav","sup","myth"].filter(t=>t!==V.enType).sort(()=>V.rng()-0.5).slice(0,2).concat([V.enType]).sort(()=>V.rng()-0.5);
  V.ask = { opts:types, ans:types.indexOf(V.enType) };
  castraVRender("battle");
}
function castraVCatchTry(k){        // k = gekozen antwoord, of -1 = overslaan
  const V = CASTRA_V; if(!V || V.over || !V.ask) return;
  const ok = k>=0 && V.ask.opts[k]===V.enType;
  const p = castraMvCatchChance(V, ok); V.catchLeft--; (CASTRA.seenTD || (CASTRA.seenTD = {})).vcatch = 1;
  const roll = V.rng();
  if(roll < p){
    V.log = [ (ok ? castraLaHTML("Recte! ", "Goed gelezen! ", "mv_recte") : "") + castraLaHTML("Funis tenet!", "Het touw houdt!", "mv_tenet") ];
    V.over = "win"; V.caught = true; V.round++;
    castraVFinish();
    if(CASTRA.soldiers.length < castraBarracksCap()){ CASTRA.soldiers.push(V.enemy); V.recruited = true; if(typeof castraPxpAdd==="function") castraPxpAdd(10); castraSave(); }
    castraVRender("result"); return;
  }
  const pre = (ok ? castraLaHTML("Recte! ", "Goed gelezen! ", "mv_recte") : "") + castraLaHTML("Funis ruptus est!", "Het touw breekt!", "mv_ruptus");
  castraMvPlay(V, null);
  V.log.unshift(pre); if(!V.over) castraVRender("battle");
}
function castraVFlee(){
  const V = CASTRA_V; if(!V || V.over) return;
  V.over = "flee"; castraVFinish(); castraVRender("result");
}

/* ---------- weergave ---------- */
function castraMvPortrait(formId, size, fallbackLook){
  if(castraFsprHas(formId, "portrait")===true) return `<img src="${castraFsprUrl(formId,"portrait")}" width="${size}" height="${size}" alt="" draggable="false" style="image-rendering:pixelated;display:block">`;
  return castraFsprHTML(formId, "battle_front", size, castraAvatarHTML(fallbackLook, "down", 1, size), false);
}
function castraMvStatus(S){
  const c = [];
  if(S.buffImp>0) c.push(`<span title="aanval +30%">⬆${S.buffImp}</span>`);
  if(S.buffTut>0) c.push(`<span title="verdediging +30%">🛡${S.buffTut}</span>`);
  if(S.slow>0) c.push(`<span title="vertraagd">🐌${S.slow}</span>`);
  return c.length ? `<span style="font-size:12px;margin-left:4px">${c.join(" ")}</span>` : "";
}
function castraMvBtn(V, m){
  const S = V.s.me, left = m.pp ? (S.pp[m.id]||0) : null, dis = m.pp && left<=0;
  let adv = "";
  if(m.kind==="dmg"){ const mult = castraTypeMult(S.type, V.s.en.type); adv = mult>1 ? `<span style="color:#7fe08a" title="typevoordeel">▲</span>` : mult<1 ? `<span style="color:#e87a6a" title="typenadeel">▼</span>` : ""; }
  const tag = m.kind==="dmg" ? `${CASTRA_MV_ICON[S.type]||"⚔️"} ${m.power}${m.hits>1?"×"+m.hits:""}` : m.kind==="heal" ? "❤️" : m.kind==="buff" ? "⬆" : m.kind==="shield" ? "🛡" : "";
  return `<button class="btn ${m.id==="oppugna"?"btn-gold":""}" ${dis?"disabled":""} title="${esc(m.nl)}" style="min-height:52px;text-align:left;padding:6px 10px;${dis?"opacity:.45":""}" onclick="castraVTurn('${m.id}')">
    <div style="display:flex;justify-content:space-between;gap:6px"><b>${esc(m.la)}</b><span style="font-size:12px;opacity:.85">${tag} ${adv}</span></div>
    <div style="font-size:11px;opacity:.75;line-height:1.2">${esc(m.nl.replace(/ \(kracht.*$/,""))}${left!==null?` · <b>${left}/${m.pp}</b>`:""}</div></button>`;
}
function castraVBattleHTML(){
  const V = CASTRA_V; if(!V.s) return "";
  const me = V.s.me, en = V.s.en, line = castraLine(V.enemy.line);
  const mySpr = V.mine.hero ? castraHeroSprHTML(V.mine.h, "battle_back", 96, castraAvatarHTML(CASTRA_HERO_DATA[V.mine.h.id].look, "up", 1, 96)) : castraFsprHTML(V.mine.line, "battle_back", 96, castraAvatarHTML(castraPLook(V.mine.line), "up", 1, 96), false);
  const enSpr = castraFsprHTML(V.enemy.line, "battle_front", 96, castraAvatarHTML(castraPLook(V.enemy.line), "down", 1, 96), false);
  const log = V.log.slice(-5).map(l=>`<div style="padding:2px 0">${l}</div>`).join("");
  const unit = (S, e, right)=>`<div style="flex:1;min-width:0;${right?"text-align:right":""}"><b>${S.unit.insignis?"✨ ":""}${esc(S.name)}</b> <small>${castraLaText("gradus")} ${e.lvl||1} ${CASTRA_MV_ICON[S.type]||""}</small>${castraMvStatus(S)}${castraVBar(S.hp,S.max,right?"#c8392a":"#3f9d52")}</div>`;
  let menu;
  if(V.ask){
    const sc = V.scoutLa ? "" : "";
    const la = `${V.terrain.la} ${CASTRA_TYPE_LA[V.enType].pl} adsunt.`, nl = `${V.terrain.nl} zijn ${CASTRA_TYPE_LA[V.enType].nl_pl}.`;
    menu = `<div style="margin-top:6px;padding:8px;border:2px solid var(--hi,#d4af37);border-radius:10px;background:rgba(212,175,55,.1)">
      <div style="font-size:16px"><b>🪢 ${castraLaText("capere")}</b> <small>(optioneel: goed lezen verhoogt de kans)</small></div>
      <div style="font-size:17px;margin:6px 0">${castraLaHTML(la, nl, "mv_ask")}</div>
      <div style="font-size:15px;margin-bottom:4px">Wat voor soort vijand is dit?</div>
      ${V.ask.opts.map((t,k)=>`<button class="btn" style="margin:3px 6px 3px 0;min-height:44px" onclick="castraVCatchTry(${k})">${esc(CASTRA_TYPE_LA[t].nl_sg)}</button>`).join("")}
      <button class="btn" style="margin:3px 0;min-height:44px;opacity:.85" onclick="castraVCatchTry(-1)">Ik weet het niet, probeer toch</button>
      <div class="note" style="margin-top:4px">Kans nu: <b style="color:${castraMvChanceLabel(castraMvCatchChance(V,false))[1]}">${castraMvChanceLabel(castraMvCatchChance(V,false))[0]}</b>, met goed antwoord: <b style="color:${castraMvChanceLabel(castraMvCatchChance(V,true))[1]}">${castraMvChanceLabel(castraMvCatchChance(V,true))[0]}</b></div></div>`;
  } else {
    const moves = me.moves.map(m=>castraMvBtn(V, m)).join("");
    const catchOk = castraMvCatchable(V), cl = castraMvChanceLabel(castraMvCatchChance(V,false));
    const tip = !(CASTRA.seenTD||{}).vcatch && catchOk ? `<div class="note" style="margin-top:6px">💡 Wil je de vijand in je kamp? Verzwak hem eerst en gebruik <b>Capere</b>. Verslaan betekent dat hij vlucht.</div>` : "";
    menu = `<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:6px">${moves}</div>
      <div style="display:flex;gap:8px;margin-top:8px">
        <button class="btn" style="flex:1;min-height:46px" onclick="castraVTurn('defende')" title="${esc(CASTRA_MV_DEFEND.nl)}">🛡 ${castraLaText("defende")}</button>
        <button class="btn" style="flex:1.4;min-height:46px;${catchOk?"":"opacity:.45"}" ${catchOk?"":"disabled"} onclick="castraVCatch()" title="Vang de vijand: hoe minder levenspunten, hoe groter de kans">🪢 ${castraLaText("capere")} (${V.catchLeft}) ${catchOk?`<small style="color:${cl[1]}">${cl[0]}</small>`:"<small>baas</small>"}</button>
        <button class="btn" style="flex:1;min-height:46px" onclick="castraVFlee()">🏃 ${castraLaText("fuga")}</button></div>${tip}`;
  }
  return `<div class="panel">
    <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:6px">
      <div style="position:relative;width:96px;height:96px">${mySpr}</div>
      <div style="position:relative;width:96px;height:96px">${enSpr}</div>
    </div>
    <div style="display:flex;gap:12px">${unit(me, V.mine, false)}${unit(en, V.enemy, true)}</div>
    <div id="castraVLog" style="min-height:70px;margin:8px 0;font-size:15px">${log}</div>
    ${menu}</div>`;
}

/* ---------- resultaat: vangen of vluchten ---------- */
function castraVResultHTML(){
  const V = CASTRA_V;
  let h = `<div class="panel">`;
  if(V.over==="win"){
    const f = castraLine(V.enemy.line);
    h += `<div style="font-size:22px;margin-bottom:6px">${castraLa(V.caught ? "captus_est" : "vicisti")}</div>`;
    if(V.caught){
      h += `<div style="display:flex;gap:12px;align-items:center;margin:8px 0"><div style="width:96px;height:96px;flex:0 0 96px">${castraMvPortrait(V.enemy.line, 96, castraPLook(V.enemy.line))}</div>
        <div><div style="font-size:19px"><b>${V.enemy.insignis?"✨ ":""}${esc(castraSoldierName(V.enemy))}</b> <small>${castraLaText("gradus")} ${V.enemy.lvl}</small></div>
        <div style="font-size:15px">${V.recruited ? "✔ "+castraLa("hostis_adiungit") : castraLa("castra_plena")}</div></div></div>`;
    } else h += `<div style="font-size:15px">${castraLa("hostis_fugit_victus")}</div>`;
    if(V.loot) h += `<div style="margin-top:6px">${castraLa("praeda")} 🪙 +${V.loot.aes} · 🌾 +${V.loot.fru} · 🏆 +1</div>`;
    (V.quests||[]).forEach(m=>{ h += `<div class="note">📜 ${esc(m.nm)}: ${m.n} / ${m.need}</div>`; });
    if(V.heroXp) h += `<div class="note">⭐ ${esc(castraMvName(V.mine))} +${V.heroXp} XP</div>`;
    if(V.leveled) h += `<div class="note">⭐ ${esc(castraMvName(V.mine))} → ${castraLaText("gradus")} ${V.mine.hero ? V.mine.h.lvl : castraSoldierLvl(V.mine)}</div>`;
    if(V.cont) h += castraContHTML(V.cont);
    if(V.trace){ const hero = CASTRA_HEROES.find(x=>x.id===V.trace); h += `<div class="note" style="font-size:15px">${castraLa("vestigia")} <b>${esc(hero?hero.nm:"")}</b></div>`; }
  } else {
    h += `<div style="font-size:22px;margin-bottom:6px">${castraLa(V.over==="lose"?"victus_es":"hostis_fugit")}</div>`;
    if(V.over==="lose" && !V.mine.dux && !V.mine.hero) h += `<div class="note">${castraLa("vulneratus")}</div>`;
    if(V.over==="flee") h += `<div class="note">${castraLaHTML("Fuga inutilis fuit.", "De vijand is ontsnapt. Probeer hem de volgende keer te vangen voor hij vlucht.", "mv_flee")}</div>`;
  }
  h += V.fromWorld
    ? `<div style="display:flex;gap:10px;margin-top:14px"><button class="btn btn-gold" onclick="castraVBack()">${castraLaText("perge")}</button></div></div>`
    : `<div style="display:flex;gap:10px;margin-top:14px"><button class="btn" onclick="castraVStart('${V.region}')">${castraLaText("iterum")}</button>
    <button class="btn" onclick="castraVBack()">${castraLaText("redi")}</button></div></div>`;
  return h;
}

/* ---------- teksten ---------- */
Object.assign(CASTRA_LA, {
  capere:           { la:"Capere", nl:"Vangen" },
  fuga:             { la:"Fuga", nl:"Vluchten" },
  captus_est:       { la:"Hostis captus est!", nl:"De vijand is gevangen!" },
  hostis_adiungit:  { la:"Hostis se tibi adiungit.", nl:"De vijand sluit zich bij je aan." },
  hostis_fugit_victus:{ la:"Hostis victus fugit.", nl:"De verslagen vijand vlucht. Wil je een vijand in je kamp? Vang hem voor hij verslagen is." },
});
Object.assign(CASTRA_GLOSS, {
  "capere":"vangen", "cape":"vang!", "debilita":"verzwak!", "hostem":"vijand (4e naamval)", "conscribe":"werf!", "captus":"gevangen", "capio":"ik vang", "funis":"touw", "ruptus":"gebroken", "tenet":"houdt", "fuga":"vlucht", "fugit":"vlucht",
  "fallit":"mist", "ictus":"slag", "adest":"is aanwezig", "iuvat":"helpt", "nihil":"niets", "crescunt":"nemen toe", "crescit":"neemt toe", "vires":"krachten",
  "tardior":"trager", "iterum":"opnieuw", "sed":"maar", "recte":"goed", "inutilis":"nutteloos", "fuit":"was", "manent":"blijven", "nulli":"geen", "potes":"je kunt",
  "hunc":"deze", "hostem":"vijand (4e naamval)", "non":"niet", "defendit":"verdedigt zich", "se":"zich", "gravis":"zwaar", "cura":"zorg, genezing",
  "incursus":"uitval", "sagitta":"pijl", "terror":"schrik", "impetus":"aanval", "oppugna":"val aan",
});

/* ---------- menu: moves in het gevecht en in de tower defence ---------- */
function castraMvMenuHTML(unit){
  try{
    const isHero = !!unit.hero, type = isHero ? CASTRA_HERO_DATA[unit.h.id].type : castraLine(unit.line).type;
    const lvl = isHero ? unit.h.lvl : (unit.lvl||1);
    const moves = castraMvSet({ ...unit, lvl }, type);
    const row = m=>`<div style="padding:3px 0;border-top:1px dotted var(--parch-line,#c2a96f)"><b>${esc(m.la)}</b> <span style="opacity:.8">${m.kind==="dmg"?`${CASTRA_MV_ICON[type]||""} kracht ${m.power}${m.hits>1?"×"+m.hits:""} · ${m.acc}%`:""}${m.pp?` · ${m.pp}×`:" · onbeperkt"}</span><br><small style="opacity:.75">${esc(m.nl.replace(/ \(kracht.*$/,""))}</small></div>`;
    const sigNote = lvl < CASTRA_MV_BAL.sigLvl ? `<div style="padding:3px 0;opacity:.55">🔒 Gradus ${CASTRA_MV_BAL.sigLvl}: eigen move van je soort</div>` : "";
    const ids = castraSkillIds(isHero ? { hero:true, h:unit.h } : unit);
    const eq = ids.map(id=>castraSkillById(id)).filter(Boolean);
    const td = eq.length ? eq.map(k=>`<div style="padding:2px 0"><b>${esc(k.la)}</b> <small style="opacity:.75">${esc(k.nl)}</small></div>`).join("") : `<div style="opacity:.6;padding:2px 0">Nog geen artes (de eerste vanaf gradus 8). Als toren schiet hij met zijn basiswaarden.</div>`;
    const fights = isHero ? "Een held kan ook op jacht (je kiest hem bij het verkenningsbericht) en vecht dan met deze moves." : "";
    return `<div style="margin-top:8px;font-size:13px"><div style="font-weight:bold">⚔ Moves in het gevecht (jacht)</div>${moves.map(row).join("")}${sigNote}
      <div style="padding:3px 0;border-top:1px dotted var(--parch-line,#c2a96f)"><b>Defende</b> <small style="opacity:.75">halve schade deze beurt (niet twee beurten achter elkaar)</small></div>
      <div style="font-size:11px;opacity:.7;margin-top:2px">${fights}</div>
      <div style="font-weight:bold;margin-top:8px">🏰 In de tower defence</div>${td}</div>`;
  }catch(e){ return ""; }
}
function castraMvXpLine(u, cap){
  const need = castraXpToNext(u.lvl||1), left = Math.max(0, need - (u.xp||0));
  return (u.lvl||1) >= cap ? "maximaal level (bouw het praetorium uit)" : `nog <b>${left}</b> XP tot ${castraLaText("gradus")} ${(u.lvl||1)+1}`;
}
function castraContMenuHTML(){
  const lv = (typeof castraUnlockDef==="function") ? castraUnlockDef("contubernium") : null;
  if(!castraContActive()) return `<div class="note" style="font-size:12px;margin:0 0 6px">🔒 Contubernium vanaf Castra-niveau ${lv?lv.lvl:7}: rustende soldaten leren mee.</div>`;
  return `<div class="note" style="font-size:12px;margin:0 0 6px">🏕️ <b>Contubernium</b>: soldaten die niet meevechten krijgen ${castraContShare()}% van de ervaring (maximaal ${castraContSlots()} soldaten, de laagste levels eerst). Campus uitbouwen geeft meer.</div>`;
}

