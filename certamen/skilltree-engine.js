/* ============================================================================
   SKILL-TREES — effecten in de gevechtsengine (Battle Mode / Boss Battle / TW)
   ----------------------------------------------------------------------------
   Alles hier doet NIETS tenzij de kamer met skill-trees is aangemaakt
   (BM_META.skillTrees, gezet in bmCreateRoom zolang de beheerderschakelaar
   config/skillTrees aanstaat) én de docent-schakelaar masteryBonuses aanstaat.
   Ontwerp/semantiek per knooppunt: skilltree-data.js; referentie-
   implementatie + balans: tools/skilltree-balance.js.

   Gegevens per speler (players/{pid}):
     st    {nodes:[ids], prestige:id|null, path:"A"|"B"|"H"} — bij klassekeuze
     stS   dynamische staat, host-geschreven: {menos, idle, noSpend, lastShield,
           lastAttack, tegen, first, engine:{dmg,rounds,burn,ram}, next,
           healNext, wonder, shieldNext, rapport}
     Leerling-geschreven bij het antwoord: lastFast, stLinie (reeks voor
     Gesloten Linie, met Taai als Brons), stFastStreak, stHardOk.
   Per team (rooms/{code}/st/{A|B}): {wall, wallPeak, trap, curse, curseLeft,
     linger, lingerLeft, markLinger, blockedLast, accLast, shieldLast,
     overflowShield} — alleen host-geschreven.
   ============================================================================ */

/* ---- basis ---- */
const BM_ST_NODE={};   // cls → id → node (incl. prestige-varianten)
(function(){ if(typeof BM_SKILLTREES==="undefined") return;
  for(const c in BM_SKILLTREES){ const t=BM_SKILLTREES[c], m={};
    [...t.identity.flatMap(r=>[r.A,r.B]),...["A","B"].flatMap(p=>t.pathNodes[p].flatMap(r=>[r.a,r.b])),...t.prestige].forEach(n=>m[n.id]=n);
    BM_ST_NODE[c]=m; } })();
const BM_ST_SHIELD_TYPES=["team_shield","testudo"];
const BM_ST_WALL_CAP=12, BM_ST_WALL_CAP_CASTRA=16;

function bmStOn(){ return !!BM_META?.skillTrees && (typeof bmMasteryBonusesOn!=="function"||bmMasteryBonusesOn()); }
function bmStActive(p){ return bmStOn() && Array.isArray(p?.st?.nodes); }
function bmStHas(p,id){ return bmStActive(p) && p.st.nodes.indexOf(id)>=0; }
function bmStNodeFx(p,id){ return BM_ST_NODE[p?.class]?.[id]?.fx||null; }
function bmStTeamHas(players,team,id){ return Object.values(players||{}).some(q=>q.team===team&&bmStHas(q,id)); }
function bmStMods(p,ablId){
  if(!bmStActive(p)) return [];
  return p.st.nodes.map(id=>bmStNodeFx(p,id)).filter(f=>f&&f.type==="ability_mod"&&(f.ability===ablId||(f.abilities||[]).includes(ablId)));
}
function bmStSum(mods,k){ return mods.reduce((s,f)=>s+(typeof f[k]==="number"?f[k]:0),0); }
function bmStAcc(p){ const a=(p.correct||0)+(p.wrong||0); return a>=4?(p.correct||0)/a:0; }
function bmStAnsweredNow(p,round){ return p.lastAnswerRound===round; }
function bmStOkNow(p,round){ return p.lastAnswerRound===round&&p.lastAnswerOk===true; }
function bmStFastNow(p,round){ return bmStOkNow(p,round)&&p.lastFast===true; }

/* ---- spelerpayload bij klassekeuze (leerling-kant) ---- */
function bmStPayloadFor(cls,picks,stars){
  const t=BM_SKILLTREES[cls]; if(!t) return null;
  const eff=bmStEffectivePicks(cls,picks||{},stars||0), nodes=[];
  for(let s=1;s<=4;s++) if(eff[s]) nodes.push(t.identity[s-1][eff[s]].id);
  for(let s=6;s<=9;s++) if(eff[s]) nodes.push(eff[s]);
  const path=skilltreePathOf(eff);
  return {nodes, prestige:eff[10]||null, path:path||null};
}

/* ---- prestige-variant als vaardigheid ---- */
function bmStPrestigeAbility(cls,presId){
  const n=BM_ST_NODE[cls]?.[presId]; if(!n) return null;
  const f=n.fx||{};
  const type=f.type==="team_be_heal"?"testudo":f.type;
  return {...f, id:n.id, nm:n.nm, tier:"prestige", cost:n.cost, desc:n.desc, type, shld:f.shld||0, _st:true};
}
// Vervangt in de lijst de oude prestige-vaardigheid door de gekozen variant.
function bmStAbilityList(list,p){
  if(!bmStActive(p)||!p.st.prestige) return list;
  const pa=bmStPrestigeAbility(p.class,p.st.prestige); if(!pa) return list;
  return list.filter(a=>a.tier!=="prestige").concat([pa]);
}

/* ---- kosten ---- */
// ctx: {fast, behind}
function bmStCost(p,abl,c,ctx){
  if(!bmStActive(p)||!c) return c;
  ctx=ctx||{};
  for(const id of p.st.nodes){ const f=bmStNodeFx(p,id); if(!f) continue;
    if(f.type==="ability_mod"&&(f.ability===abl.id||(f.abilities||[]).includes(abl.id))&&f.cost) c+=f.cost;
    if(f.type==="shield_per_ally_counts_basic"&&f.ability===abl.id&&f.cost) c+=f.cost;
    if(f.type==="sabotage_layers"&&abl.id==="sabotage"&&f.sabotageCost) c+=f.sabotageCost;
    if(f.type==="accuracy_cost"&&f.ability===abl.id&&bmStAcc(p)>=f.minAcc) c+=f.cost;
    if(f.type==="fast_answer_cost"&&ctx.fast&&BM_DMG_TYPES.includes(abl.type)) c+=f.val;
    if(f.type==="behind_ability_cost"&&f.ability===abl.id&&ctx.behind>0) c=Math.max(f.min||1,c+f.cost);
  }
  return Math.max(1,c);
}

// Kostencontext voor de leerling (snel geantwoord deze ronde? achterstand?)
function bmStCostCtx(p){
  const r=(typeof BM_STATE!=="undefined"&&BM_STATE&&BM_STATE.round&&BM_STATE.round.n)||0;
  const e=p.team==="A"?"B":"A", TA=BM_TEAMS&&BM_TEAMS[p.team], TE=BM_TEAMS&&BM_TEAMS[e];
  const behind=(TA&&TE&&TA.maxHealth&&TE.maxHealth)?Math.max(0,TE.health/TE.maxHealth-TA.health/TA.maxHealth):0;
  return {fast:bmStFastNow(p,r), behind};
}

/* ---- context per ronde (host) ---- */
function bmStRoundCtx(players,round,stRoom){
  const ctx={round, team:{}};
  for(const t of ["A","B"]){
    const mates=Object.values(players).filter(q=>q.team===t);
    const acts=mates.map(q=>{ const a=q.lockedAction; if(!a||a.type==="combo") return null;
      const cls=BM_CLASSES.find(c=>c.id===q.class);
      const abl=bmStAbilityList(bmClassAbilities(cls,q.prestigeClass?BM_MASTERY_PRESTIGE:0),q).find(x=>x.id===a.abilityId)||BM_BASIC_ACTIONS.find(x=>x.id===a.abilityId);
      return abl?{q,abl}:null; }).filter(Boolean);
    const T=BM_TEAMS?.[t]||{health:1,maxHealth:1};
    ctx.team[t]={
      hpPct:T.maxHealth?T.health/T.maxHealth:1,
      shieldActs:acts.filter(x=>BM_ST_SHIELD_TYPES.includes(x.abl.type)).length,
      basicShieldActs:acts.filter(x=>x.abl.id==="basic_dekking"||x.abl.id==="basic_schildheffen").length,
      attackers:acts.filter(x=>BM_DMG_TYPES.includes(x.abl.type)&&(x.abl.dmg||0)>0).length,
      enemyShieldsNow:false,
      st:stRoom?.[t]||{},
    };
  }
  for(const t of ["A","B"]){ const e=t==="A"?"B":"A";
    ctx.team[t].enemyHpPct=ctx.team[e].hpPct;
    ctx.team[t].behind=Math.max(0,ctx.team[e].hpPct-ctx.team[t].hpPct);
    ctx.team[t].enemyShieldsNow=ctx.team[e].shieldActs>0;
  }
  return ctx;
}
function bmStLadder(p,acc){
  let v=acc>=0.95?4:acc>=0.75?3:acc>=0.5?2:0;
  if(v>0&&bmStHas(p,"optimus")) v+=1;
  if(v>0&&bmStHas(p,"imperium")) v+=1;
  return v;
}

/* ---- effect van één vaardigheid (host, na de basisberekening) ----
   Past fx aan en geeft extra's terug voor de teamverwerking na pas 1. */
function bmStApplyEffect(p,cls,abl,fx,ctx){
  const ex={curse:0,mark:null,wall:0,engine:null,trap:0,healNext:0,linger:0,lingerRounds:0,sab:false,useWonder:false,shieldNextRound:0};
  if(!bmStActive(p)||!ctx) return ex;
  const R=ctx.round, T=ctx.team[p.team], S=p.stS||{}, t=abl.type;
  const has=id=>p.st.nodes.indexOf(id)>=0;
  const mods=bmStMods(p,abl.id), m=k=>bmStSum(mods,k);
  const isAtk=BM_DMG_TYPES.includes(t)&&(fx.dmg>0||(abl.dmg||0)>0)||m("dmg")>0;
  const isShield=BM_ST_SHIELD_TYPES.includes(t);
  const fast=bmStFastNow(p,R), ok=bmStOkNow(p,R);
  const boss=BM_META?.mode==="boss";
  const fortified=boss&&((BM_META?.bossId==="minotaur"&&BM_BOSS?.labyrinthShield>0)||BM_META?.bossId==="garrison");
  const enemySt=ctx.team[p.team==="A"?"B":"A"].st||{};
  // --- generieke ability_mod-velden ---
  let d=m("dmg");
  if(t==="attack_weakspot"){
    const thr=has("scherp_oog")?0.40:0.30;
    if(T.enemyHpPct<=thr){ if(T.enemyHpPct>0.30) d+=(abl.bonusDmg||0); d+=m("bonusDmg"); }
  }
  for(const f of mods){
    if(f.lowHpDmg&&T.enemyHpPct<=(f.threshold||0.3)) d+=f.lowHpDmg;
    if(f.afterShieldDmg&&S.lastShield===R-1) d+=f.afterShieldDmg;
    if(f.cursedDmg&&(enemySt.curse||0)>0) d+=f.cursedDmg;
    if(f.noShieldDmg&&!T.enemyShieldsNow) d+=f.noShieldDmg;
    if(f.fastShld&&fast) fx.shld+=f.fastShld;
    if(f.healNextRound) ex.healNext+=f.healNextRound;
    if(f.curse) ex.curse=Math.max(ex.curse,f.curse);
    if(f.engine) ex.engine={dmg:has("zware_stenen")?3:f.engine.dmg,rounds:has("lange_belegering")?3:f.engine.rounds};
    // muur/val via ability_mod (Palissade, Gegraven Greppel, Valkuil) — Stenen Muur/Dubbele Gracht vervangen de waarde
    if(f.wall) ex.wall+=(abl.id==="veldreparatie"&&has("stenen_muur"))?5:f.wall.shld;
    if(f.trap) ex.trap+=has("dubbele_gracht")?5:f.trap;
    if(f.marks) ex.mark={max:f.markMax||(has("grote_prooi")?3:2)};
    if(f.bypass) fx.bypass=true;
  }
  if(abl._st){ // gekozen prestige-variant
    if(abl.lowHpDmg&&T.enemyHpPct<=(abl.threshold||0.3)) d+=abl.lowHpDmg;
    if(abl.bypass) fx.bypass=true;
    if(abl.curse) ex.curse=Math.max(ex.curse,abl.curse);
    if(abl.marks) ex.mark={max:abl.markMax||6};
    if(abl.wall) ex.wall+=abl.wall.shld;
    if(abl.burn) ex.engine={dmg:abl.burn.dmg,rounds:abl.burn.rounds,burn:true};
    if(abl.fastRefund&&fast) fx.selfBE+=abl.fastRefund;
    if(abl.perStreak) d+=(S.menos||0)*abl.perStreak - (S.menos||0); // Aristeia: menos telt hier ×2 (één keer zit al hieronder)
  }
  // --- aanvallen ---
  if(isAtk){
    if(has("vaste_hand")&&!abl.aoe) d+=1;
    if(has("koelbloedig")&&bmStAcc(p)>=(has("kalm_onder_vuur")?0.70:0.80)) d+=1;
    if(has("menos")){ let mn=S.menos||0; if(abl.id==="leeuwensprong"&&has("ontlading")) mn*=2; d+=mn;
      const mx=has("heldenmoed")?3:2; if(has("ontketend")&&(S.menos||0)>=mx&&["berserk","leeuwensprong"].includes(abl.id)) d+=2;
      if(has("onstuitbare_kracht")&&(S.menos||0)>=mx) fx.bypass=true; }
    if(has("tegenstoot")&&(S.lastShield===R-1||T.st.shieldLast>0||(S.tegen||0)>0)) d+=has("scherpe_rand")?4:3;
    if(has("wraak_van_de_linie")&&(T.st.blockedLast||0)>=(has("bloed_op_het_brons")?3:5)) d+=2;
    if(has("aanloop")&&(S.idle||0)>0){ let b=3*Math.min(S.idle,has("lange_aanloop")?2:1);
      if(has("hamer_en_aambeeld")&&T.shieldActs>0) b+=2; if(abl._st&&abl.idleMult) b*=abl.idleMult; d+=b; if(has("doorbraak")) fx.bypass=true; }
    if(has("eerste_inslag")&&!S.first) d+=4;
    if(has("op_de_flank")){ if(fast) d+=has("windruiter")?3:2; else if(ok&&has("wervelwind")) d+=1; }
    if(has("ritme")&&(p.stFastStreak||0)>=2) d+=1;
    if(fortified||(!boss&&(enemySt.wall||0)>0)){
      if(has("belegeringskunde")) d+=has("muurbreker")?4:2;
      if(has("brandstichter")) d+=has("gaten_in_de_muur")?5:3; }
    if(!boss&&has("valstrikken_ontmantelen")&&(enemySt.trap||0)>0) d+=2;
    if(S.engine&&S.engine.rounds>0&&has("belegeringstoren")) d+=1;
    if(has("hinderlaagtactiek")&&T.behind>0){ let b=Math.min(has("uit_het_struikgewas")?6:4,Math.floor(T.behind/0.15)); if(abl._st&&abl.behindMult) b*=abl.behindMult; d+=b; }
    if(has("varus_ondergang")&&abl.id==="hinderlaag"&&T.behind>0&&T.attackers-1>=2) d+=4;
    if(S.next) d+=S.next;
    if(has("laatste_pijl")&&T.enemyHpPct<=0.15) fx.bypass=true;
    // levensroof
    let lr=0; if(has("levensroof")) lr=has("dorst")?2:1; if(has("met_je_schild")&&T.behind>0) lr+=1; fx.heal+=lr;
    if(has("ontwijken")){ if(fast) fx.shld+=2; else if(ok&&has("overal_tegelijk")) fx.shld+=1; }
    if(has("spoor_zetten")) ex.mark=ex.mark||{max:has("grote_prooi")?3:2};
  }
  // Saboteur: ook Sabotage (geen aanval) doet +3 schade
  if(has("ondermijnen")&&["verkenning","sabotage","ontwapenen"].includes(abl.id)) d+=3;
  // Priester-vloek en Les van Delphi
  if(has("vloek_der_goden")&&abl.id==="vloek") ex.curse=Math.max(ex.curse,2);
  if(ex.curse>0){ if(has("zware_vloek")) ex.curse+=1;
    if(has("les_van_delphi")&&p.stHardOk&&bmStOkNow(p,R)&&abl.id==="vloek"){ ex.curse+=1; d+=has("sibyllijnse_boeken")?5:3; } }
  // Triarii: slecht rondje van het team → +2 op je actie
  if(has("triarii")&&(T.st.accLast??1)<0.5){ if(isAtk||d>0) d+=2; else if(fx.shld>0||isShield) fx.shld+=2; else if(fx.heal>0) fx.heal+=2; }
  // schade toepassen (na de passief-vermenigvuldiging in de basisberekening: vlak)
  fx.dmg+=d;
  // --- schild ---
  let s=m("shld");
  if(isShield||s>0||fx.shld>0){
    if(has("schildenrij")&&isShield){ const mx=has("hoplon")?4:2; const n=T.shieldActs-1+(has("gedrilde_rijen")?T.basicShieldActs:0); s+=Math.max(0,Math.min(mx,n)); }
    if(has("gesloten_linie")&&isShield&&(p.stLinie||0)>=3) s+=has("gouden_linie")?4:3;
    if(has("opmars")&&isShield&&S.lastAttack===R-1) s+=2;
    if(has("laatste_bolwerk")&&isShield&&T.hpPct<=0.30) s+=3;
    if(has("moreel")&&["bevel","testudo"].includes(abl.id)) s+=bmStLadder(p,T.st.accLast??0);
    if(abl._st&&abl.perAllyShield) s+=Math.min(abl.perAllyMax||4,Math.max(0,T.shieldActs-1));
    if(abl._st&&abl.accuracyBonusPer10) s+=Math.min(abl.accuracyBonusMax,Math.max(0,Math.floor(((T.st.accLast??0)-0.5)*10)));
  }
  fx.shld+=s;
  // --- heling ---
  let h=m("heal");
  if(fx.heal>0||h>0){
    if(has("noodhulp")){ let b=Math.min(has("snelle_hulp")?4:3,Math.floor((1-T.hpPct)/0.25)); if(abl._st&&abl.missingHpMult) b*=abl.missingHpMult; h+=b; }
    if(has("epidauros")) h+=1;
    if(has("veldheersblik")&&abl.id==="veldverzorging") h+=bmStLadder(p,T.st.accLast??0);
    if(abl._st&&abl.accuracyBonusPer10) h+=Math.min(abl.accuracyBonusMax,Math.max(0,Math.floor(((T.st.accLast??0)-0.5)*10)));
  }
  fx.heal+=h;
  if(has("wonderheling")&&abl.id==="gebed"&&T.hpPct<0.20&&!S.wonder){ fx.heal*=2; ex.useWonder=true; }
  // --- team-AP ---
  fx.teamBE+=m("teamBE");
  if(has("tribunus")&&abl.id==="strijdformatie"&&(T.st.accLast??0)>=(has("signum")?0.50:0.60)) fx.teamBE+=1;
  // --- schild weghalen ---
  fx.shldRemove+=m("shldRemove");
  const ablRem=(["shield_remove","attack_and_shld_remove","attack_siege"].includes(t)?(abl.shldRemove||0):0)+m("shldRemove");
  if(has("omslaan")&&ablRem>0&&(boss||!T.enemyShieldsNow)) fx.dmg+=Math.floor(ablRem*(has("brandpijlen")?0.75:0.5));
  if(has("ondermijnen")&&fx.shldRemove>0){ ex.sab=true; ex.linger=fx.shldRemove; ex.lingerRounds=has("lange_lont")?2:1; }
  if(abl._st&&abl.lingerRounds){ ex.sab=true; ex.linger=Math.max(ex.linger,abl.shldRemove||0); ex.lingerRounds=Math.max(ex.lingerRounds,1); }
  // --- muur/val/werktuig ---
  if(has("stevige_fundering")&&abl.id==="veldreparatie") ex.wall+=2;
  if(has("katapult_bouwen")&&abl.id==="katapult") ex.engine={dmg:has("zware_stenen")?3:2,rounds:has("lange_belegering")?3:2};
  if(ex.engine&&has("stormram")) ex.engine.ram=true;
  if(has("toeslaan_en_verdwijnen")&&abl.id==="hinderlaag") ex.shieldNextRound=2;
  return ex;
}

/* ============================================================================
   TEAMVERWERKING (host, in bmResolve)
   ============================================================================ */
function bmStWallCap(players,t){ return bmStTeamHas(players,t,"castra")?BM_ST_WALL_CAP_CASTRA:BM_ST_WALL_CAP; }
function bmStUpd(players,pUpd,pid){ const p=players[pid]; return pUpd[pid]||(pUpd[pid]={be:p.be||0,damage:p.damage||0,healing:p.healing||0,shielding:p.shielding||0,lockedAction:null}); }

// Na pas 1 (individuele vaardigheden), vóór de combo's. Muteert from/for_/pUpd/stRoom.
// res = [{pid,p,abl,fx,ex,cost}] van deze ronde (alleen spelers met een actie).
function bmStAfterPass1(players,roundN,res,from,for_,pUpd,events,stRoom,ctx){
  const boss=BM_META?.mode==="boss";
  const upd=pid=>bmStUpd(players,pUpd,pid);
  for(const t of ["A","B"]){
    const st=stRoom[t]||(stRoom[t]={});
    const mine=res.filter(r=>r.p.team===t);
    // doorwerkende sabotage van vorige ronde
    if((st.linger||0)>0){ from[t].shldRemove+=st.linger; st.lingerLeft=(st.lingerLeft||1)-1; if(st.lingerLeft<=0){ st.linger=0; st.lingerLeft=0; } }
    // Raadselspreuk: een vervloekte vijand verliest ook 2 schild
    if((st.curse||0)>0&&bmStTeamHas(players,t,"raadselspreuk")) from[t].shldRemove+=2;
    // schild/heling die een ronde doorloopt
    for(const p of Object.values(players)){ if(p.team!==t||!bmStActive(p)) continue; const S=p.stS||{};
      if(S.shieldNext) for_[t].shld+=S.shieldNext;
      if(S.healNext) for_[t].heal+=S.healNext; }
    if(st.overflowShield){ for_[t].shld+=st.overflowShield; st.overflowShield=0; }
    // werktuigen vuren (eigenaar moet deze ronde goed antwoorden; vuur brandt altijd door)
    for(const [pid,p] of Object.entries(players)){ if(p.team!==t||!bmStActive(p)) continue; const S=p.stS||{};
      if(S.engine&&S.engine.rounds>0&&!res.some(r=>r.pid===pid&&r.ex&&r.ex.engine)){
        if(bmStOkNow(p,roundN)||S.engine.burn){ from[t].dmg+=S.engine.dmg; if(S.engine.ram) from[t].shldRemove+=2;
          const u=upd(pid); u.damage=(u.damage||0)+S.engine.dmg;
          events.push({pid,team:t,type:"st_engine",dmg:S.engine.dmg,cls:p.class||null}); } } }
    // merkteken (sterkste telt) + Vers Spoor
    let best=null; for(const r of mine) if(r.ex&&r.ex.mark&&(!best||r.ex.mark.max>best.ex.mark.max)) best=r;
    const hitters=mine.filter(r=>r.fx.dmg>0).length;
    let mark=0;
    if(best) mark=Math.min(best.ex.mark.max,Math.max(0,hitters-1));
    else if((st.markLinger||0)>0) mark=Math.min(st.markLinger,hitters);
    st.markLinger=(best&&bmStHas(best.p,"vers_spoor"))?2:0;
    if(mark>0){ from[t].dmg+=mark; events.push({type:"st_mark",team:t,bonus:mark,pid:best?best.pid:null});
      if(best){ const u=upd(best.pid); u.damage=(u.damage||0)+mark;
        if(bmStHas(best.p,"opjagen")) from[t].shldRemove+=2;
        if(mark>=best.ex.mark.max){
          if(bmStHas(best.p,"lokroep")) u.be=bmClampBE((u.be??best.p.be??0)+1);
          if(bmStHas(best.p,"jachthoorn")){ const low=Object.entries(players).filter(([q,pp])=>pp.team===t&&q!==best.pid).sort((a,b)=>(a[1].be||0)-(b[1].be||0))[0];
            if(low){ const ul=upd(low[0]); ul.be=bmClampBE((ul.be??low[1].be??0)+1); } } }
        if(bmStHas(best.p,"jachtpartij")&&hitters-1>=3) best._next=2; } }
    // vloek (sterkste) voor de volgende ronde, met Onheilsdag
    const newCurse=Math.max(0,...mine.map(r=>r.ex?r.ex.curse:0));
    st._curseThis=st.curse||0; // geldt in DEZE ronde (gezet vorige ronde)
    if(newCurse>0){ st.curseNext=newCurse; st.curseNextLeft=bmStTeamHas(players,t,"onheilsdag")?2:1; }
    else if((st.curseLeft||0)>1){ st.curseNext=Math.max(1,(st.curse||1)-1); st.curseNextLeft=st.curseLeft-1; }
    else { st.curseNext=0; st.curseNextLeft=0; }
    // muur en val
    const wallAdd=mine.reduce((a,r)=>a+(r.ex?r.ex.wall:0),0);
    if(wallAdd>0){ st.wall=Math.min(bmStWallCap(players,t),(st.wall||0)+wallAdd); st.wallPeak=Math.max(st.wallPeak||0,st.wall); }
    st.trapNext=mine.reduce((a,r)=>a+(r.ex?r.ex.trap:0),0);
    // doorwerkende sabotage voor volgende ronde
    const lg=Math.max(0,...mine.map(r=>r.ex?r.ex.linger:0));
    if(lg>0){ st.linger=lg; st.lingerLeft=Math.max(1,...mine.map(r=>r.ex?r.ex.lingerRounds:1)); }
  }
  // Saboteur: sabotage in lagen (schild → muur → werktuigen), alleen team-tegen-team
  if(!boss) for(const t of ["A","B"]){
    const e=t==="A"?"B":"A", est=stRoom[e]||(stRoom[e]={});
    if(res.some(r=>r.p.team===t&&r.abl._st&&r.abl.destroyPersistent)){ est.wall=0; est.trap=0;
      for(const [pid,q] of Object.entries(players)) if(q.team===e&&q.stS&&q.stS.engine){ const u=upd(pid); u.stS={...(q.stS||{}),...(u.stS||{}),engine:null}; } }
    const sabRem=res.filter(r=>r.p.team===t&&r.ex&&r.ex.sab).reduce((a,r)=>a+(r.fx.shldRemove||0),0);
    if(sabRem<=0) continue;
    const normRem=from[t].shldRemove-sabRem;
    const sh1=Math.max(0,for_[e].shld-normRem);
    let left=Math.max(0,sabRem-sh1);
    if((est.wall||0)>0&&left>0){ const resist=bmStTeamHas(players,e,"wachttoren")?0.5:1, mult=bmStTeamHas(players,t,"verschroeide_aarde")?2:1;
      const cut=Math.min(est.wall,Math.round(left*resist*mult)); est.wall-=cut; left=Math.max(0,left-Math.ceil(cut/(resist*mult)));
      if(cut>0) events.push({type:"st_wall_sabotage",team:e,cut}); }
    if(left>0){ const destroy=bmStTeamHas(players,t,"vuur_in_de_voorraad");
      const engs=Object.entries(players).filter(([,q])=>q.team===e&&q.stS&&q.stS.engine&&q.stS.engine.rounds>0).sort((a,b)=>b[1].stS.engine.rounds-a[1].stS.engine.rounds);
      for(const [pid,q] of engs){ if(left<=0) break; const u=upd(pid), eng={...q.stS.engine};
        if(destroy){ u.stS={...(q.stS||{}),...(u.stS||{}),engine:null}; left-=3; }
        else { const cut=Math.min(eng.rounds,Math.floor(left/3)); if(cut<=0) break; eng.rounds-=cut; left-=cut*3; u.stS={...(q.stS||{}),...(u.stS||{}),engine:eng.rounds>0?eng:null}; }
        events.push({type:"st_engine_sabotage",team:e,pid}); } }
    if((est.trap||0)>0&&bmStTeamHas(players,t,"valstrikken_ontmantelen")) est.trap=0;
  }
  // staat per speler bijwerken
  for(const [pid,p] of Object.entries(players)){
    if(!bmStActive(p)) continue;
    const r=res.find(x=>x.pid===pid), S={...(p.stS||{}),...((pUpd[pid]&&pUpd[pid].stS)||{})};
    const has=id=>p.st.nodes.indexOf(id)>=0;
    S.shieldNext=0; S.healNext=0;
    if(r){
      const atk=r.fx.dmg>0&&BM_DMG_TYPES.includes(r.abl.type), shieldAct=BM_ST_SHIELD_TYPES.includes(r.abl.type);
      const spent=(r.cost||0)>0, keepIdle=has("woudkennis")&&r.abl.id==="hinderlaag";
      if(atk){ S.lastAttack=roundN; S.first=true; S.idle=0; S.next=0; if((S.tegen||0)>0) S.tegen--;
        if(has("menos")){ if(r.abl.id==="leeuwensprong"&&has("ontlading")) S.menos=0; else S.menos=Math.min(has("heldenmoed")?3:2,(S.menos||0)+(has("snelle_woede")?2:1)); } }
      else { S.idle=(S.idle||0)+1; if(has("menos")) S.menos=has("nagloeien")?Math.floor((S.menos||0)/2):0; }
      if(shieldAct){ S.lastShield=roundN; if(has("onstuitbaar")) S.tegen=2; }
      S.noSpend=(spent&&!keepIdle)?0:(S.noSpend||0)+1;
      if(r.ex&&r.ex.useWonder) S.wonder=true;
      if(r.ex&&r.ex.healNext) S.healNext=r.ex.healNext;
      if(r.ex&&r.ex.shieldNextRound) S.shieldNext=r.ex.shieldNextRound;
      if(r._next) S.next=r._next;
      if(has("kleos")&&r.abl.id==="leeuwensprong"){ const u=upd(pid); u.be=bmClampBE((u.be??p.be??0)+2); }
      if(has("dubbelspel")&&r.abl.id==="sabotage"&&ctx.team[p.team].enemyShieldsNow){ const u=upd(pid); u.be=bmClampBE((u.be??p.be??0)+2); }
    } else {
      S.idle=(S.idle||0)+1; S.noSpend=(S.noSpend||0)+1; if(has("menos")) S.menos=has("nagloeien")?Math.floor((S.menos||0)/2):0;
    }
    // werktuig: nieuw neergezet, of één ronde ouder
    if(r&&r.ex&&r.ex.engine) S.engine={...r.ex.engine};
    else if(S.engine){ S.engine={...S.engine,rounds:(S.engine.rounds||0)-1}; if(S.engine.rounds<=0) S.engine=null; }
    if(has("vesting")&&bmStOkNow(p,roundN)){ const st=stRoom[p.team]; if((st.wall||0)>0) st.wall=Math.min(bmStWallCap(players,p.team),st.wall+1); }
    if(has("verkenningsrapport")) S.rapport=true;
    upd(pid).stS=bmGeenUndefined(S);
  }
  // Niemand Valt: kon iedereen in het team een actie betalen?
  for(const t of ["A","B"]){ const mates=Object.entries(players).filter(([,q])=>q.team===t);
    if(mates.length&&mates.every(([,q])=>(q.be||0)>=1)) for(const [pid,q] of mates) if(bmStHas(q,"niemand_valt")){ const u=upd(pid); u.be=bmClampBE((u.be??q.be??0)+4); } }
}

// Team-AP verdelen (vervangt pas 3 als de skill-trees meedoen): basis zoals nu
// (gelijk voor iedereen, max. BM_TEAMBE_ROUND_CAP), plus de Kwartiermeester-
// routering naar wie het minst heeft / fout antwoordde / op 0 staat.
function bmStTeamBE(players,roundN,res,for_,pUpd){
  for(const t of ["A","B"]){
    const mates=Object.entries(players).filter(([,q])=>q.team===t); if(!mates.length) continue;
    const base=Math.min(for_[t].teamBE||0,BM_TEAMBE_ROUND_CAP);
    const recv=Object.fromEntries(mates.map(([pid])=>[pid,base]));
    const givers=res.filter(r=>r.p.team===t&&bmStActive(r.p)&&(r.fx.teamBE>0||r.abl.lowestExtra));
    const lowN=Math.max(1,Math.round(mates.length*0.25));
    const lowSet=mates.slice().sort((a,b)=>(a[1].be||0)-(b[1].be||0)).slice(0,lowN).map(([pid])=>pid);
    for(const g of givers){ const has=id=>bmStHas(g.p,id);
      for(const [pid,q] of mates){ if(pid===g.pid) continue; let extra=0; const low=lowSet.includes(pid);
        if(has("bevoorrading")&&low) extra+=has("volle_schuren")?2:1;
        if(has("opvangen")&&(!bmStOkNow(q,roundN)||(has("vangnet")&&(q.be||0)===0))) extra+=1;
        if(g.abl.lowestExtra&&low) extra+=g.abl.lowestExtra;
        recv[pid]=Math.min(BM_TEAMBE_ROUND_CAP,recv[pid]+extra); } }
    for(const [pid,q] of mates){ if(!recv[pid]) continue; const u=bmStUpd(players,pUpd,pid); u.be=bmClampBE((u.be??q.be??0)+recv[pid]); }
  }
}

// Schade op team t na het rondeschild: eerst de val, dan de muur, dan de vloek
// die team t vorige ronde op de aanvaller legde. Geeft {army, absorbedWall, prevented, thorns}.
function bmStAbsorb(players,t,dmgAfterShield,stRoom,events){
  const st=stRoom[t]||(stRoom[t]={});
  let d=dmgAfterShield, trap=0, wall=0, prevented=0, thorns=0;
  if((st.trap||0)>0&&d>0){ trap=Math.min(st.trap,d); d-=trap; }
  st.trap=0;
  if((st.wall||0)>0&&d>0){ wall=Math.min(st.wall,d); d-=wall; st.wall-=wall;
    if(st.wall>0&&d===0&&bmStTeamHas(players,t,"muur_van_hadrianus")) st.wall=Math.min(bmStWallCap(players,t),st.wall+2);
    events.push({type:"st_wall_hit",team:t,absorbed:wall,left:st.wall}); }
  const curse=st._curseThis||0;
  if(curse>0&&d>0){ prevented=Math.min(curse,d); d-=prevented; if(d>0&&bmStTeamHas(players,t,"nemesis")) thorns=4; }
  return {army:d,absorbedTrap:trap,absorbedWall:wall,prevented,thorns};
}

// Baas: vloek (percentage van de gewone baasklap, nooit maaltijd/Enrage/koppen-extra)
// en muur (vangt de baasklap op vóór het leger). Geeft de nieuwe klasschade.
function bmStBossHit(players,tick,stRoom,events){
  const st=stRoom.A||(stRoom.A={});
  let dmg=tick.classDamage||0;
  const atk=(tick.events||[]).find(e=>e.type==="boss_attack");
  const curse=st._curseThis||0;
  if(atk&&curse>0&&!atk.enraged){
    const pct=bmStTeamHas(players,"A","cassandra")?0.15:0.10;
    const cursable=atk.dmg-(atk.headExtra||0);
    const red=Math.min(cursable,Math.round(cursable*pct*curse));
    dmg-=red; if(red>0) events.push({type:"st_curse_boss",prevented:red});
    if(bmStTeamHas(players,"A","nemesis")&&atk.dmg-red>0) tick._thorns=4;
  }
  if((st.wall||0)>0&&dmg>0){ const ab=Math.min(st.wall,dmg); st.wall-=ab; dmg-=ab; events.push({type:"st_wall_hit",team:"A",absorbed:ab,left:st.wall}); }
  return Math.max(0,dmg);
}

// Na het verrekenen: vloek/val doorschuiven, teamstatistieken voor de volgende ronde.
// info[t] = {shieldActs, blocked, overflow}
function bmStFinishRound(players,roundN,stRoom,info){
  for(const t of ["A","B"]){ const st=stRoom[t]||(stRoom[t]={});
    st.curse=st.curseNext||0; st.curseLeft=st.curseNextLeft||0; delete st.curseNext; delete st.curseNextLeft; delete st._curseThis;
    st.trap=st.trapNext||0; delete st.trapNext;
    const mates=Object.values(players).filter(q=>q.team===t);
    st.accLast=mates.length?mates.filter(q=>bmStOkNow(q,roundN)).length/mates.length:1;
    st.shieldLast=(info&&info[t]&&info[t].shieldActs)||0;
    st.blockedLast=(info&&info[t]&&info[t].blocked)||0;
    if(info&&info[t]&&info[t].overflow>0&&bmStTeamHas(players,t,"overvloeiend_bloed")) st.overflowShield=Math.min(3,info[t].overflow);
    if(!(st.wall>0)) st.wall=0;
  }
  return stRoom;
}

/* ============================================================================
   RONDEBEGIN (host, bmDistributeQs) en ANTWOORD (leerling, bmFinishAnswer)
   ============================================================================ */
// Extra eigen AP aan het begin van de ronde (telt mee binnen BM_BE_ROUND_BONUS_CAP).
function bmStRoundSelfBonus(p,roundN,stRoom){
  if(!bmStActive(p)) return 0;
  const has=id=>p.st.nodes.indexOf(id)>=0, S=p.stS||{}, st=(stRoom&&stRoom[p.team])||{};
  let b=0;
  if(has("signifer")&&(st.accLast??0)>=(has("signum")?0.50:0.60)) b+=2;
  if(has("op_de_loer")&&(S.noSpend||0)>0&&(S.noSpend||0)<=(has("opgespaarde_woede")?3:2)) b+=2;
  if(has("hinderlaagtactiek")){ const e=p.team==="A"?"B":"A", TA=BM_TEAMS&&BM_TEAMS[p.team], TE=BM_TEAMS&&BM_TEAMS[e];
    if(TA&&TE&&TA.maxHealth&&TE.maxHealth&&TE.health/TE.maxHealth>TA.health/TA.maxHealth) b+=1; }
  if(has("verkenningsrapport")&&!S.rapport) b+=1; // hulpmiddel (hint in de vraag) staat nog niet aan → eenmalig +1 AP
  return b;
}
// Teamcadeaus aan het begin van de ronde: Muilezels van Marius, Aquila. pid → AP.
function bmStRoundTeamGifts(players,roundN,stRoom){
  const out={};
  for(const t of ["A","B"]){
    const mates=Object.entries(players).filter(([,q])=>q.team===t); if(!mates.length) continue;
    const st=(stRoom&&stRoom[t])||{};
    for(const [pid,q] of mates){
      if(bmStHas(q,"muilezels_van_marius")&&(roundN===1||q.lastAnswerOk)){
        const low=mates.filter(([x])=>x!==pid).sort((a,b)=>(a[1].be||0)-(b[1].be||0))[0];
        if(low) out[low[0]]=(out[low[0]]||0)+bmPassiveVal(BM_CLASSES.find(c=>c.id===q.class),q.masterPassive)+1; }
      if(bmStHas(q,"aquila")&&roundN>1&&(st.accLast??0)>=(bmStHas(q,"gloria")?0.90:1)){
        for(const [x] of mates) if(x!==pid) out[x]=(out[x]||0)+1; }
    }
  }
  return out;
}
// Leerling-kant: drempel voor "snel" en de foutboete.
function bmStFastFraction(p,base){ return bmStHas(p,"ruitervaardigheid")?0.35:base; }
function bmStWrongPenalty(p,base){ return bmStHas(p,"taaie_veteraan")?1:base; }

/* ============================================================================
   IN BEELD: muur-balk, vloek-melding, palissades en werktuigen op het slagveld
   ============================================================================ */
let BM_ST_ROOM={};
// Luistert naar rooms/{code}/st (alleen als de kamer skill-trees heeft). Wordt
// aangeroepen door battleHostGame en battlePlayerGame; opgeruimd via BM_UNSUBS.
function bmStSubscribe(onChange){
  if(!bmStOn()||!fbDB||!BM_CODE) return;
  const r=fbDB.ref("rooms/"+BM_CODE+"/st");
  const f=r.on("value",s=>{ BM_ST_ROOM=s.val()||{}; try{ onChange&&onChange(); }catch(e){} bmStRenderField(); });
  BM_UNSUBS.push(()=>r.off("value",f));
}
// Onder de legerbalk: muur (eigen HP-balk, steenkleur — geen blauw schild) en vloek.
function bmStTeamExtrasHTML(team,compact){
  if(!bmStOn()) return "";
  const st=BM_ST_ROOM[team]||{}, e=team==="A"?"B":"A", est=BM_ST_ROOM[e]||{};
  const out=[];
  if((st.wall||0)>0){
    const cap=bmStWallCap(BM_PLAYERS,team), frac=Math.max(0,Math.min(1,st.wall/cap));
    out.push(`<div class="bmst-wall${compact?" c":""}" title="Muur: vangt klappen op vóór het leger (telt niet als schild)">
      <span>🧱 Muur</span><div class="bmst-wall-t"><div class="bmst-wall-f" style="transform:scaleX(${frac})"></div></div><b>${st.wall}/${cap}</b></div>`);
  }
  if((st.trap||0)>0) out.push(`<span class="bmst-tag" title="Vangt de eerste schade van de volgende aanval op">⊔ Val ${st.trap}</span>`);
  if((est.curse||0)>0) out.push(`<span class="bmst-tag curse" title="Dit team is vervloekt en doet de volgende ronde minder schade">☋ Vervloekt${BM_META?.mode==="boss"?"":" −"+est.curse}</span>`);
  return out.length?`<div class="bmst-extras${team==="B"?" side-b":""}">${out.join("")}</div>`:"";
}
// Palissade-stadium uit de muur t.o.v. de hoogste stand (heel / beschadigd / bijna verwoest).
function bmStWallStage(st){ const w=st.wall||0, pk=Math.max(st.wallPeak||0,w); if(w<=0||!pk) return 0; const f=w/pk; return f>2/3?1:f>=1/3?2:3; }
function bmStRenderField(){
  const field=document.getElementById("bmField"); if(!field) return;
  let lay=document.getElementById("bmStField");
  if(!bmStOn()){ if(lay) lay.remove(); return; }
  if(!lay){ lay=document.createElement("div"); lay.id="bmStField"; field.appendChild(lay); }
  const solo=typeof BM_FIELD_SOLO!=="undefined"&&BM_FIELD_SOLO;
  const parts=[];
  for(const t of ["A","B"]){
    if(solo&&BM_PLAYERS?.[BM_PID]?.team!==t&&BM_META?.mode!=="boss") continue;
    const st=BM_ST_ROOM[t]||{}, stage=bmStWallStage(st);
    if(stage&&!(BM_META?.mode==="boss"&&t==="B"))
      parts.push(`<img class="bmst-pal ${t}" src="assets/bosses/palissade_midden_${stage}.png?${typeof SPRITE_VER!=="undefined"?SPRITE_VER:""}" alt="" onerror="this.style.display='none'">`);
    // werktuigen achter het eigen leger (één per soort)
    const kinds=new Set();
    for(const q of Object.values(BM_PLAYERS||{})){ if(q.team!==t||!q.stS||!q.stS.engine||!(q.stS.engine.rounds>0)||q.stS.engine.burn) continue;
      kinds.add(bmStHas(q,"belegeringstoren")?"siegetower":q.stS.engine.ram?"ram":"catapult"); }
    [...kinds].forEach((k,i)=>parts.push(`<img class="bmst-eng ${t} ${k}" style="--i:${i}" src="assets/bosses/${k}.png?${typeof SPRITE_VER!=="undefined"?SPRITE_VER:""}" alt="" onerror="this.style.display='none'">`));
  }
  const html=parts.join("");
  if(lay.dataset.h!==html){ lay.dataset.h=html; lay.innerHTML=html; }
}
(function(){
  if(typeof document==="undefined"||document.getElementById("bmStEngineStyle")) return;
  const s=document.createElement("style"); s.id="bmStEngineStyle";
  s.textContent=`.bmst-extras{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-top:4px;font-size:12px}
.bmst-extras.side-b{justify-content:flex-end}
.bmst-wall{display:flex;align-items:center;gap:6px;color:#cdbfa4;min-width:160px;flex:1}
.bmst-wall.c{min-width:110px;font-size:11px}
.bmst-wall-t{flex:1;height:7px;border-radius:4px;background:rgba(0,0,0,.45);overflow:hidden;border:1px solid #5a4a36}
.bmst-wall-f{height:100%;width:100%;background:linear-gradient(90deg,#8a7a64,#b5a280);transform-origin:left center;transition:transform .4s}
.bmst-tag{padding:1px 7px;border-radius:999px;border:1px solid #6b5b45;color:#cdbfa4;background:rgba(0,0,0,.35)}
.bmst-tag.curse{border-color:#7a5ab0;color:#c9b4f0}
#bmStField{position:absolute;inset:0;pointer-events:none;z-index:2}
.bmst-pal{position:absolute;bottom:2.5%;height:36%;filter:drop-shadow(0 6px 8px rgba(0,0,0,.45))}
.bmst-pal.A{left:44%;transform:translateX(-50%)}
.bmst-pal.B{left:56%;transform:translateX(-50%) scaleX(-1)}
.bm-boss .bmst-pal.A{left:60%}
.bmst-eng{position:absolute;bottom:34%;width:13%;filter:drop-shadow(0 6px 8px rgba(0,0,0,.5));z-index:0}
.bmst-eng.A{left:calc(26% + var(--i)*6%)}
.bmst-eng.B{right:calc(26% + var(--i)*6%)}
.bmst-eng.A.catapult,.bmst-eng.B.ram,.bmst-eng.B.siegetower{transform:scaleX(-1)}
.bm-field-solo .bmst-pal.A{left:62%}`;
  document.head.appendChild(s);
})();
