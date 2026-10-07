#!/usr/bin/env node
/* ============================================================================
   SKILL-TREE BALANSSIMULATIE (ontwerpfase — raakt het live spel niet)
   ----------------------------------------------------------------------------
   Leest de echte data in: battle-data.js (klassen, AP-economie, plafonds),
   bossbattle.js (bmBossResolveTick: de echte baaslogica) en skilltree-data.js
   (de 8 bomen). Simuleert gevechten met een vereenvoudigde, maar op de engine
   (bmResolve/bmCalcAbilityEffect/bmDistributeQs in battle.js) gebaseerde
   rondelus. Geen Firebase, geen DOM.

   Gebruik:  node certamen/tools/skilltree-balance.js [aantalGevechten]

   Meting 1 — bijdrage per ronde (HP-waarde) van één klasse in een team van 8
   (één van elke klasse), voor elke boomopbouw, t.o.v. dezelfde klasse zoals
   hij nu op ★10 speelt. In Battle Mode (tegen een team van 8 "huidige ★10")
   en tegen Hydra/Cycloop/Minotaurus (Normal).
   Meting 2 — winkansen tegen de bazen: klas met huidige ★10-klassen vs klas
   met skill-trees (willekeurige opbouw per speler).

   Bewuste vereenvoudigingen (staan ook in de uitvoer):
   - Combo's worden niet gespeeld (dus Roedel/Roedelleider/Bloedbroeders
     worden niet gemeten).
   - Geen handlangers (AoE-voordeel van Pijlregen/Vuurtoren e.d. telt niet).
   - Spelers kiezen hun actie met een eenvoudige waarde-per-AP-strategie,
     met vooruitkijken voor ritme-knooppunten (Aanloop, Tegenstoot, Menos…).
   - Wal/val/schild houden baasklappen NIET tegen (zoals nu in de engine);
     wal telt wél mee voor het schild tegen Cycloop-maaltijd/Minotaurus-Enrage.
   ============================================================================ */
const fs=require("fs"), path=require("path"), vm=require("vm");
const ROOT=path.join(__dirname,"..");
const ctx={console,Math};
vm.createContext(ctx);
for(const f of ["battle-data.js","skilltree-data.js"]) vm.runInContext(fs.readFileSync(path.join(ROOT,f),"utf8"),ctx,{filename:f});
// Uit bossbattle.js alleen de pure stukken (constanten + bmBossResolveTick e.d.).
{
  const src=fs.readFileSync(path.join(ROOT,"bossbattle.js"),"utf8");
  const pick=(re)=>{const m=src.match(re);if(!m)throw new Error("niet gevonden: "+re);return m[0];};
  const parts=[
    pick(/const BOSS_DIFFICULTIES = \{[\s\S]*?\r?\n\};/),
    pick(/const BOSS_ROUNDS_PER_ATTACK = [^\r\n]*/),
    pick(/function bmBossShieldNeed\([\s\S]*?\r?\n\}/),
    pick(/const BOSS_ENRAGE_DMG_MULT = [^\r\n]*/),
    pick(/const HYDRA_HEAD_EVERY = [^\r\n]*/), pick(/const HYDRA_HEAD_FUSE = [^\r\n]*/), pick(/const HYDRA_HEAD_NEED_PCT = [^\r\n]*/),
    pick(/const HYDRA_HEAD_HEAL = [^\r\n]*/), pick(/const HYDRA_HEAD_ATK = [^\r\n]*/),
    pick(/const BOSS_ENRAGE_MAX_BLOCK = [^\r\n]*/),
    pick(/function bmBossResolveTick\([\s\S]*?return\{boss:b,classDamage,bossHeal,events\};\s*\}/),
    pick(/function bmBossPhaseFor\([^\r\n]*/),
  ];
  vm.runInContext(parts.join("\n")+"\nthis.__boss={BOSS_DIFFICULTIES,bmBossResolveTick,bmBossShieldNeed,bmBossPhaseFor};",ctx);
}
const {BM_CLASSES,BM_SKILLTREES,BM_SYNERGY,BM_BASIC_ACTIONS,BM_CHAIN_BONUS,BM_INSPIRE_BONUS_DMG}=vm.runInContext(
  "({BM_CLASSES,BM_SKILLTREES,BM_SYNERGY,BM_BASIC_ACTIONS,BM_CHAIN_BONUS,BM_INSPIRE_BONUS_DMG})",ctx);
const {BOSS_DIFFICULTIES,bmBossResolveTick,bmBossShieldNeed,bmBossPhaseFor}=ctx.__boss;
const AP_MAX=vm.runInContext("BM_BE_MAX",ctx), ROUND_CAP=vm.runInContext("BM_BE_ROUND_BONUS_CAP",ctx),
      TEAMBE_CAP=vm.runInContext("BM_TEAMBE_ROUND_CAP",ctx), WRONG=vm.runInContext("BM_WRONG_BE_PENALTY",ctx);
const CLS=Object.fromEntries(BM_CLASSES.map(c=>[c.id,c]));
const CLASS_IDS=BM_CLASSES.map(c=>c.id);

/* ---------- RNG (vast zaad = herhaalbaar) ---------- */
let _seed=12345;
function rnd(){ _seed=(_seed*1664525+1013904223)>>>0; return _seed/4294967296; }

/* ---------- Opbouwen (builds) ---------- */
// build = {cls, mode:"old"|"tree", nodes:Set(id), fx:Map(id→fx), prestige:fx|null, path}
// Menselijkheid (geijkt op het echte Cycloop-gevecht, zie calibrate()).
// Geijkt 2026-10-05 op het echte Cycloop-gevecht (7 lln, 79% goed, lage sterren):
// simulatie ±26 rondes / ±15% HP over (echt: 28 rondes / 31% HP) — iets strenger
// voor de klas dan de werkelijkheid, dus baas-winkansen eerder te laag dan te hoog.
const HUMAN={timeout:0.15, idle:0.03, random:0.35, noActWrong:0.05};
function oldBuild(cls,stars=10){ return {cls, mode:"old", stars, nodes:new Set(), fx:new Map(), prestige:null, label:"nu ★"+stars}; }
function treeBuild(cls, idPicks, pathPicks, presIdx){
  const t=BM_SKILLTREES[cls], nodes=new Set(), fx=new Map();
  const add=n=>{nodes.add(n.id);fx.set(n.id,n.fx);};
  idPicks.forEach((side,i)=>add(t.identity[i][side]));
  const nA=idPicks.filter(s=>s==="A").length, p=nA>=3?"A":nA<=1?"B":"H";
  for(let s=6;s<=9;s++){
    const k=pathPicks[s-6]; // "a"|"b" (hybride: "a"=A.a, "b"=B.a)
    if(p==="H"){ const row=t.pathNodes[k==="a"?"A":"B"].find(r=>r.star===s); add(row.a); }
    else add(t.pathNodes[p].find(r=>r.star===s)[k]);
  }
  const pres=t.prestige[presIdx];
  return {cls, mode:"tree", nodes, fx, prestige:pres, path:p,
    label:t.paths[p].nm+" "+idPicks.join("")+" "+pathPicks.join("")+" "+pres.nm};
}
function allBuilds(cls){
  const out=[];
  const pathCombos=[]; for(let m=0;m<16;m++) pathCombos.push([0,1,2,3].map(i=>(m>>i)&1?"b":"a"));
  const idSets={A:[["A","A","A","A"]],B:[["B","B","B","B"]],H:[["A","A","B","B"],["A","B","A","B"],["B","B","A","A"]]};
  for(const p of ["A","B","H"]) for(const ids of idSets[p]) for(const pc of pathCombos) for(const pr of [0,1]) out.push(treeBuild(cls,ids,pc,pr));
  return out;
}

/* ---------- Spelers ---------- */
function mkPlayer(id,team,build,acc){
  return {id,team,b:build,cls:build.cls,acc,fastP:0.35,
    ap:0,lastOk:true,okStreak:0,wrongStreak:0,fastStreak:0,answered:0,correct:0,
    menos:0,idleRounds:0,noSpendRounds:0,lastShield:-9,lastAttack:-9,tegenCharges:0,firstAttackDone:false,
    engine:null,once:{},inspired:false,nextAtkBonus:0,healNext:0,
    contrib:0,rounds:0, ok:false, fast:false, action:null};
}
const has=(p,id)=>p.b.nodes.has(id);
const masterOn=p=>p.b.mode==="tree"||(p.b.stars||0)>=5;
function passiveVal(p){ const pa=CLS[p.cls].passive; return masterOn(p)?(pa.masterVal??pa.val):pa.val; }

/* ---------- Acties ---------- */
function abilitiesOf(p,T){
  const c=CLS[p.cls];
  let list=c.abilities.filter(a=>a.tier!=="prestige");
  if(p.b.mode==="old"&&(p.b.stars||0)>=10) list=c.abilities.slice(); // ★10: prestige-vaardigheid erbij
  else if(p.b.prestige){ const pr=p.b.prestige; list=list.concat([{...pr, id:pr.id, tier:"prestige", type:pr.fx.type, ...pr.fx, cost:pr.cost, _treePres:true}]); }
  return list.concat(BM_BASIC_ACTIONS.filter(a=>!a.bossMealOnly||(T&&(T.mealNeed||T.enraged))));
}
function costOf(p,a,T){
  let c=a.cost||0; if(!c) return 0;
  const pa=CLS[p.cls].passive;
  if(pa.type==="cost_reduce"){ const tiers=masterOn(p)&&pa.masterTiers?pa.masterTiers:["basic"]; if(tiers.includes(a.tier)) c=Math.max(1,c-1); }
  for(const [id,f] of p.b.fx){
    if(f.type==="ability_mod"&&(f.ability===a.id||(f.abilities||[]).includes(a.id))&&f.cost) c+=f.cost;
    if(f.type==="accuracy_cost"&&f.ability===a.id&&accOf(p)>=f.minAcc) c+=f.cost;
    if(f.type==="shield_per_ally_counts_basic"&&f.ability===a.id) c+=f.cost;
    if(f.type==="sabotage_layers"&&a.id==="sabotage") c+=f.sabotageCost;
    if(f.type==="fast_answer_cost"&&p.fast&&isAttack(a)) c+=f.val;
    if(f.type==="behind_ability_cost"&&f.ability===a.id&&T.behind>0) c=Math.max(f.min,c+f.cost);
  }
  return Math.max(1,c);
}
const ATK=new Set(["attack","attack_bypass","attack_weakspot","attack_and_shld_remove","attack_and_defend","attack_siege","heal_and_attack"]);
const isAttack=a=>ATK.has(a.type)&&((a.dmg||0)>0);
const isShieldAct=a=>["team_shield","testudo"].includes(a.type);
function accOf(p){ return p.answered>=4?p.correct/p.answered:0; }

// Effect van een actie voor speler p in teamcontext T (T.enemyHpPct, T.ownHpPct, T.behind, T.boss, …)
function effect(p,a,T){
  const fx={dmg:0,bypass:0,shld:0,heal:0,teamBE:0,shldRemove:0,selfBE:0,curse:0,mark:null,wall:0,engine:null,trap:0,
            attack:isAttack(a),shieldAct:isShieldAct(a),healNext:0,hot:[],linger:0,fort:0};
  const pa=CLS[p.cls].passive, pv=passiveVal(p), t=a.type;
  const tree=p.b.mode==="tree";
  const F=(type)=>[...p.b.fx.values()].filter(f=>f.type===type);
  const mods=[...p.b.fx.values()].filter(f=>f.type==="ability_mod"&&(f.ability===a.id||(f.abilities||[]).includes(a.id)));
  const m=(k)=>mods.reduce((s,f)=>s+(typeof f[k]==="number"?f[k]:0),0);
  // --- schade ---
  if(ATK.has(t)&&(a.dmg||0)>0){
    let d=a.dmg+m("dmg");
    if(t==="attack_weakspot"){ let thr=0.30; if(has(p,"scherp_oog")) thr=0.40; if(T.enemyHpPct<=thr) d+=(a.bonusDmg||0)+m("bonusDmg"); }
    for(const f of mods){ if(f.lowHpDmg&&T.enemyHpPct<=(f.threshold||0.3)) d+=f.lowHpDmg; if(f.afterShieldDmg&&p.lastShield===T.round-1) d+=f.afterShieldDmg;
      if(f.cursedDmg&&T.enemyCursed) d+=f.cursedDmg; if(f.noShieldDmg&&T.enemyShieldExp<=0) d+=f.noShieldDmg; }
    if(a.lowHpDmg&&T.enemyHpPct<=(a.threshold||0.3)) d+=a.lowHpDmg;
    if(pa.type==="atk_bonus") d=Math.round(d*(1+pv));
    if(pa.type==="atk_flat") d+=pv;
    if(tree){
      if(has(p,"vaste_hand")&&!a.aoe) d+=1;
      for(const f of F("accuracy_dmg")){ const min=has(p,"kalm_onder_vuur")?0.70:f.minAcc; if(accOf(p)>=min) d+=f.val; }
      // Voorvechter: Menos (ná de vermenigvuldiging)
      if(has(p,"menos")){ let mn=p.menos; if(a.id==="leeuwensprong"&&has(p,"ontlading")) mn*=2; if(a._treePres&&a.perStreak) mn=p.menos*a.perStreak; d+=mn;
        const mx=has(p,"heldenmoed")?3:2; if(has(p,"ontketend")&&p.menos>=mx&&["berserk","leeuwensprong"].includes(a.id)) d+=2; }
      // Hopliet-ritme
      if(has(p,"tegenstoot")&&(p.lastShield===T.round-1||T.allyShieldExp||p.tegenCharges>0)) d+=has(p,"scherpe_rand")?4:3;
      if(has(p,"wraak_van_de_linie")&&T.blockedLast>=(has(p,"bloed_op_het_brons")?3:5)) d+=2;
      // Cavalerie
      if(has(p,"aanloop")&&p.idleRounds>0){ let ab=3*Math.min(p.idleRounds,has(p,"lange_aanloop")?2:1); if(has(p,"hamer_en_aambeeld")&&T.allyShieldExp) ab+=2; if(a._treePres&&a.idleMult) ab*=a.idleMult; d+=ab; if(has(p,"doorbraak")) fx._bypassAll=true; }
      if(has(p,"eerste_inslag")&&!p.firstAttackDone) d+=4;
      if(has(p,"op_de_flank")&&p.fast) d+=has(p,"windruiter")?3:2;
      else if(has(p,"op_de_flank")&&has(p,"wervelwind")&&p.ok) d+=1;
      if(has(p,"ritme")&&p.fastStreak>=2) d+=1;
      // Genie / Verkenner vs vestingen
      if(T.fortified){ for(const f of F("vs_fortification_dmg")) { d+=has(p,"muurbreker")?4:f.val; } for(const f of F("vs_persistent_dmg")) d+=has(p,"gaten_in_de_muur")?5:f.val; }
      else if(T.enemyWall>0){ if(has(p,"belegeringskunde")) d+=has(p,"muurbreker")?4:2; if(has(p,"brandstichter")) d+=has(p,"gaten_in_de_muur")?5:3; }
      if(p.engine&&has(p,"belegeringstoren")) d+=1;
      // Verkenner achterstand
      if(has(p,"hinderlaagtactiek")&&T.behind>0){ let b=Math.min(has(p,"uit_het_struikgewas")?6:4,Math.floor(T.behind/0.15)); if(a._treePres&&a.behindMult) b*=a.behindMult; d+=b; }
      if(has(p,"varus_ondergang")&&a.id==="hinderlaag"&&T.behind>0&&T.allyAttackers>=2) d+=4;
      if(p.nextAtkBonus) d+=p.nextAtkBonus;
      // Aanvoerder Triarii (geldt voor elke actie, hier als schade-bonus op aanvallen)
      if(has(p,"triarii")&&T.teamAccLast<0.5) d+=2;
    }
    if(p.inspired&&T.boss) d+=BM_INSPIRE_BONUS_DMG;
    const bypass=t==="attack_bypass"||fx._bypassAll||m("bypass")||mods.some(f=>f.bypass)||a.bypass||
                 (tree&&has(p,"onstuitbare_kracht")&&p.menos>=(has(p,"heldenmoed")?3:2))||
                 (tree&&has(p,"laatste_pijl")&&T.enemyHpPct<=0.15);
    if(bypass) fx.bypass=d; else fx.dmg=d;
    if(pa.type==="shld_pierce") fx.shldRemove+=pv;
  }
  // --- schild ---
  if(["team_shield","testudo","attack_and_defend","shield_and_heal"].includes(t)){
    let s=(a.shld||0)+m("shld");
    if(tree){
      if(has(p,"schildenrij")&&isShieldAct(a)){ const mx=has(p,"hoplon")?4:2; s+=Math.min(mx,T.allyShieldCount); }
      if(has(p,"gesloten_linie")&&isShieldAct(a)&&p.okStreak>=3) s+=has(p,"gouden_linie")?3:2;
      if(has(p,"opmars")&&isShieldAct(a)&&p.lastAttack===T.round-1) s+=2;
      if(has(p,"laatste_bolwerk")&&isShieldAct(a)&&T.ownHpPct<=0.30) s+=3;
      if((has(p,"moreel"))&&["bevel","testudo"].includes(a.id)) s+=ladder(p,T);
      if(has(p,"strijdkreet")&&a.id==="bevel") s+=0; // al via ability_mod
      if(a._treePres&&a.perAllyShield) s+=Math.min(a.perAllyMax,T.allyShieldCount);
      if(a._treePres&&a.accuracyBonusPer10) s+=Math.min(a.accuracyBonusMax,Math.max(0,Math.floor((T.teamAccLast-0.5)*10)));
    }
    fx.shld=s;
  }
  if(pa.type==="be_on_defend"&&isShieldAct(a)) fx.selfBE+=pv;
  // --- heling ---
  if(["heal","heal_and_attack","shield_and_heal","testudo"].includes(t)||m("heal")||a.heal){
    let h=(a.heal||0)+m("heal");
    if(h>0){
      if(pa.type==="heal_flat") h+=pv;
      if(tree){
        if(has(p,"noodhulp")){ const mx=has(p,"snelle_hulp")?4:3; let b=Math.min(mx,Math.floor((1-T.ownHpPct)/0.25)); if(a._treePres&&a.missingHpMult) b*=a.missingHpMult; h+=b; }
        if(has(p,"epidauros")) h+=1;
        if(has(p,"veldheersblik")&&a.id==="veldverzorging") h+=ladder(p,T);
        if(a._treePres&&a.accuracyBonusPer10) h+=Math.min(a.accuracyBonusMax,Math.max(0,Math.floor((T.teamAccLast-0.5)*10)));
        if(has(p,"wonderheling")&&a.id==="gebed"&&T.ownHpPct<0.20&&!p.once.wonder){ h*=2; fx._useWonder=true; }
        for(const f of mods) if(f.healNextRound) fx.healNext+=f.healNextRound;
        for(const f of mods) if(f.hot) fx.hot.push({a:f.hot.amt,l:f.hot.rounds});
        if(has(p,"gemeenschap")&&T.teamAccLast>=0.75) h+=3;
      }
      fx.heal=h;
      if(has(p,"lichtmantel")) fx.shld+=Math.min(4,Math.floor(h/4));
    }
  }
  if(tree&&fx.attack){ let lr=0; if(has(p,"levensroof")) lr=has(p,"dorst")?2:1; if(has(p,"met_je_schild")&&T.behind>0) lr+=1; fx.heal+=lr; }
  // --- team-AP ---
  if(["team_be","testudo"].includes(t)||a.teamBE) fx.teamBE=(a.teamBE||0)+m("teamBE");
  if(tree&&has(p,"tribunus")&&a.id==="strijdformatie"&&T.teamAccLast>=(has(p,"signum")?0.50:0.60)) fx.teamBE+=1;
  // --- schild weghalen ---
  if(["shield_remove","attack_and_shld_remove","attack_siege"].includes(t)) fx.shldRemove+=(a.shldRemove||0);
  fx.shldRemove+=m("shldRemove");
  if(a.selfBE) fx.selfBE+=a.selfBE;
  // --- boom-specials ---
  if(tree){
    for(const f of mods){ if(f.curse) fx.curse=Math.max(fx.curse,f.curse); if(f.engine) fx.engine={...f.engine}; if(f.wall) fx.wall+=f.wall.shld; if(f.trap) fx.trap+=f.trap;
      if(f.marks) fx.mark={perHit:1,max:f.markMax||(has(p,"grote_prooi")?3:2)}; if(f.fastShld&&p.fast) fx.shld+=f.fastShld; }
    if(a._treePres){ if(a.curse) fx.curse=Math.max(fx.curse,a.curse); if(a.marks) fx.mark={perHit:1,max:a.markMax||6}; if(a.wall) fx.wall+=a.wall.shld; if(a.burn) fx.engine={dmg:a.burn.dmg,rounds:a.burn.rounds,burn:true}; if(a.lowestExtra) fx._lowestExtra=a.lowestExtra; }
    if(has(p,"vloek_der_goden")&&a.id==="vloek"){ fx.curse=Math.max(fx.curse,2); }
    if(fx.curse>0){ if(has(p,"zware_vloek")) fx.curse+=1; if(has(p,"les_van_delphi")&&p.hardOk){ fx.curse+=1; (fx.bypass?fx.bypass+=0:0); fx.dmg+=(has(p,"sibyllijnse_boeken")?5:3); } }
    if(has(p,"spoor_zetten")&&fx.attack) fx.mark=fx.mark||{perHit:1,max:has(p,"grote_prooi")?3:2};
    if(has(p,"palissade")&&a.id==="veldreparatie") fx.wall+=has(p,"stenen_muur")?5:3;
    if(has(p,"stevige_fundering")&&a.id==="veldreparatie") fx.wall+=2;
    if(has(p,"valkuil")&&a.id==="valstrik") fx.trap+=has(p,"dubbele_gracht")?5:3;
    if(has(p,"katapult_bouwen")&&a.id==="katapult") fx.engine={dmg:has(p,"zware_stenen")?3:2,rounds:has(p,"lange_belegering")?3:2};
    if(has(p,"poliorketes")&&a.id==="vuurtoren") fx.engine={dmg:has(p,"zware_stenen")?3:2,rounds:has(p,"lange_belegering")?3:2};
    if(has(p,"ontwijken")&&fx.attack){ if(p.fast) fx.shld+=2; else if(p.ok&&has(p,"overal_tegelijk")) fx.shld+=1; }
    if(has(p,"ondermijnen")&&fx.shldRemove>0){ fx.linger=fx.shldRemove; fx.lingerRounds=has(p,"lange_lont")?2:1; }
    if(has(p,"ondermijnen")&&["verkenning","sabotage","ontwapenen"].includes(a.id)) fx.dmg+=3;
    if(a._treePres&&a.lingerRounds) fx.linger=Math.max(fx.linger,a.shldRemove);
    const ablRem=(["shield_remove","attack_and_shld_remove","attack_siege"].includes(t)?(a.shldRemove||0):0)+m("shldRemove");
    if(has(p,"omslaan")&&ablRem>0&&T.enemyShieldExp<=0) fx.dmg+=Math.floor(ablRem*(has(p,"brandpijlen")?0.75:0.5));
  }
  return fx;
}
function ladder(p,T){ const a=T.teamAccLast; let v=a>=0.95?4:a>=0.75?3:a>=0.5?2:0; if(v>0&&has(p,"optimus")) v+=1; if(v>0&&has(p,"imperium")) v+=1; return v; }

/* ---------- Waarde-inschatting voor de actiekeuze ---------- */
function valueOf(p,a,fx,T,cost){
  let v=0;
  v+=(fx.dmg*(T.boss?1:0.8)+fx.bypass)*(T.hydraWarn?1.8:1);
  v+=fx.heal*Math.min(1,(1-T.ownHpPct)*3);
  const shUse=T.boss?((T.mealNeed||T.enraged)?2.5:0.02):0.55;
  v+=fx.shld*shUse + fx.wall*(T.boss?0.9:1.2) + fx.trap*(T.boss?0:0.5);
  v+=fx.teamBE*Math.max(0,T.n-1)*0.5;
  // schild wegslaan heeft alleen waarde als er iets weg te slaan valt (schild, of
  // voor de Saboteur ook een muur/werktuig aan de overkant)
  if(!T.boss){ const target=T.enemyShieldExp+((p.b.mode==="tree"&&has(p,"ondermijnen"))?(T.enemyWall+(T.enemyEngines||0)*3):0);
    v+=Math.min(fx.shldRemove,target)*0.8 + Math.min(fx.linger,T.enemyShieldExp)*0.3; }
  v+=fx.curse*(T.boss?0.5:1.2);
  if(fx.mark) v+=Math.min(fx.mark.max,T.allyAttackersExp)*1.0;
  if(fx.engine) v+=fx.engine.dmg*fx.engine.rounds*p.acc*0.9;
  v+=fx.selfBE*1.4;
  // vooruitkijken voor ritme-knooppunten
  if(p.b.mode==="tree"){
    if(has(p,"aanloop")&&!fx.attack) v+=3*0.8;
    if(has(p,"tegenstoot")&&fx.shieldAct) v+=2*0.8;
    if(has(p,"menos")){ if(fx.attack) v+=0.8; else v-=p.menos*0.8; }
    if(has(p,"op_de_loer")&&cost===0) v+=1.2;
  }
  return v;
}
function chooseAction(p,T){
  if(!p.answeredNow) return null;
  if(!p.ok&&rnd()<HUMAN.noActWrong) return null;  // leerling doet niets na een fout (zoals in de klas)
  if(rnd()<HUMAN.idle) return null;
  const opts=abilitiesOf(p,T);
  if(rnd()<HUMAN.random){ const aff=opts.filter(a=>costOf(p,a,T)<=p.ap); const a=aff[Math.floor(rnd()*aff.length)]; return {a,c:costOf(p,a,T),fx:effect(p,a,T)}; }
  const income=p.acc*3.6;
  const lambda=(p.ap+income>AP_MAX)?0.6:1.5;
  let best=null,bestS=-1e9;
  for(const a of opts){
    const c=costOf(p,a,T); if(c>p.ap) continue;
    const fx=effect(p,a,T); const v=valueOf(p,a,fx,T,c);
    const s=v-lambda*c;
    if(s>bestS){bestS=s;best={a,c,fx};}
  }
  return best;
}

/* ---------- Gevecht ---------- */
function synergy(players){ const u=new Set(players.map(p=>p.cls)).size; let b=0; for(const s of BM_SYNERGY) if(u>=s.minClasses) b=s.beBonus; return b; }
function addSelf(p,v,capped=true){ if(capped){ const room=ROUND_CAP-p.capUsed; v=Math.max(0,Math.min(v,room)); p.capUsed+=v; } p.ap=Math.min(AP_MAX,p.ap+v); return v; }

function fight(teamA,teamB,opt){
  // teamB = null → baasgevecht (opt.boss)
  const boss=opt.boss||null, N=teamA.length;
  const all=teamB?teamA.concat(teamB):teamA;
  const S={A:{hp:0,max:0,wall:0,wallPeak:0,trap:0,curseOnEnemy:0,curseLinger:0,lingerRemove:0,markLinger:0,blockedLast:0,accLast:1,shieldCountLast:0,attackersLast:0},
           B:{hp:0,max:0,wall:0,wallPeak:0,trap:0,curseOnEnemy:0,curseLinger:0,lingerRemove:0,markLinger:0,blockedLast:0,accLast:1,shieldCountLast:0,attackersLast:0}};
  let B=null, diff=null;
  if(boss){ diff=BOSS_DIFFICULTIES[opt.diff||"normal"]; S.A.max=S.A.hp=N*100; S.B.max=S.B.hp=Math.round(N*15*8*diff.hp);
    const avgStars=teamA.reduce((a,p)=>a+(p.b.mode==="tree"?10:(p.b.stars||0)),0)/N;
    if(opt.hpPerStar){ S.B.max=S.B.hp=Math.round(S.B.max*(1+opt.hpPerStar*avgStars)); }
    diff={...diff, atk:diff.atk*(1+(opt.atkPerStar||0)*avgStars)};
    B={phase:1,rage:0,labyrinthShield:boss==="minotaur"?Math.round(0.30*S.B.max):0}; }
  else { const base=opt.armyHP||150; S.A.max=S.A.hp=base*teamB.length/4; S.B.max=S.B.hp=base*teamA.length/4; }
  if(opt.startHpA) S.A.hp=Math.round(S.A.max*opt.startHpA);
  const maxR=opt.maxRounds||60; let round=0;
  const synA=synergy(teamA), synB=teamB?synergy(teamB):0;
  while(round<maxR&&S.A.hp>0&&S.B.hp>0){
    round++;
    const sides=teamB?[["A",teamA,"B"],["B",teamB,"A"]]:[["A",teamA,"B"]];
    // 1. Rondebonus (achterstand vooraf bepalen, voor Hinderlaagtactiek)
    { const pa=S.A.hp/S.A.max, pb=S.B.hp/S.B.max; S.A.behindNow=Math.max(0,pb-pa); S.B.behindNow=Math.max(0,pa-pb); }
    for(const [k,team] of sides){
      const syn=k==="A"?synA:synB;
      for(const p of team){
        p.capUsed=0; p.rounds++;
        if(round>1&&!p.lastOk) continue;
        let bonus=syn; const pa=CLS[p.cls].passive;
        if(pa.type==="be_passive"&&!(p.b.mode==="tree"&&has(p,"muilezels_van_marius"))) bonus+=passiveVal(p);
        if(p.b.mode==="old"&&(p.b.stars||0)>=3) bonus+=1; // huidige ★3-bonus
        addSelf(p,bonus);
        if(p.b.mode==="tree"){
          if(has(p,"signifer")&&S[k].accLast>=(has(p,"signum")?0.50:0.60)) { const g=addSelf(p,2); p.contrib+=g*1.6*0.5; }
          if(has(p,"hinderlaagtactiek")&&S[k].behindNow>0) addSelf(p,1);
          if(has(p,"op_de_loer")&&p.noSpendRounds>0&&p.noSpendRounds<=(has(p,"opgespaarde_woede")?3:2)) addSelf(p,2);
        }
      }
      // Muilezels van Marius: passief naar de teamgenoot met de minste AP (+1)
      for(const p of team) if(p.b.mode==="tree"&&has(p,"muilezels_van_marius")&&(round===1||p.lastOk)){
        const low=team.filter(q=>q!==p).sort((x,y)=>x.ap-y.ap)[0]; if(low){ const g=Math.min(passiveVal(p)+1,AP_MAX-low.ap); low.ap+=g; p.contrib+=g*1.6; } }
      // Aquila
      const aq=team.find(p=>p.b.mode==="tree"&&has(p,"aquila"));
      if(aq&&S[k].accLast>=(has(aq,"gloria")?0.90:1)) for(const q of team){ if(q!==aq){ const g=Math.min(1,AP_MAX-q.ap); q.ap+=g; aq.contrib+=g*1.6; } }
    }
    // 2. Antwoorden
    for(const [k,team] of sides) for(const p of team){
      let acc=p.acc;
      p.answeredNow=rnd()>=HUMAN.timeout;
      if(!p.answeredNow){ p.ok=false; p.fast=false; p.lastOk=false; continue; }
      p.ok=rnd()<acc; p.answered++; if(p.ok)p.correct++;
      const fastP=p.fastP*((p.b.mode==="tree"&&has(p,"ruitervaardigheid"))?1.4:1);
      p.fast=p.ok&&rnd()<fastP;
      p.hardOk=p.ok&&rnd()<0.25; // aandeel goede antwoorden op een "moeilijk woord"
      let g=p.ok?3:-((p.b.mode==="tree"&&has(p,"taaie_veteraan"))?1:WRONG);
      if(p.fast){ const pa=CLS[p.cls].passive; g+=pa.type==="be_on_fast"?passiveVal(p):1; }
      p.ap=Math.max(0,Math.min(AP_MAX,p.ap+g));
      if(boss){ if(p.ok){ if(p.wrongStreak>=3)p.inspired=true; p.wrongStreak=0;} else p.wrongStreak++; }
      p.okStreak=p.ok?p.okStreak+1:((p.b.mode==="tree"&&has(p,"taai_als_brons")&&p.okStreak>0&&!p._forgave)?(p._forgave=true,p.okStreak):0);
      if(p.ok) p._forgave=false;
      p.fastStreak=p.fast?p.fastStreak+1:0;
      p.lastOk=p.ok;
    }
    // 3. Context + actiekeuze
    const choices={};
    for(const [k,team,ek] of sides){
      const own=S[k], en=S[ek];
      const ownPct=own.hp/own.max, enPct=en.hp/en.max;
      const T={round,boss:!!boss,n:team.length,ownHpPct:ownPct,enemyHpPct:enPct,behind:Math.max(0,enPct-ownPct),
        enemyShieldExp:boss?0:Math.max(0,(en.shieldCountLast*4)-own.lingerRemove),enemyWall:boss?0:en.wall,enemyEngines:boss?0:((ek==="A"?teamA:teamB)||[]).filter(q=>q.engine).length,
        fortified:boss==="minotaur"&&B&&B.labyrinthShield>0,
        enemyCursed:own.curseOnEnemy>0,blockedLast:own.blockedLast,teamAccLast:own.accLast,
        allyShieldCount:own.shieldCountLast,allyShieldExp:own.shieldCountLast>0,allyAttackers:own.attackersLast,allyAttackersExp:Math.max(0,own.attackersLast-1),
        mealNeed:boss&&B.charging?B.mealNeed:0,enraged:boss&&B.enraged,hydraWarn:boss&&(B.headWarn||(B.hh&&B.hh.warn))};
      choices[k]={T,list:team.map(p=>({p,ch:chooseAction(p,T)}))};
    }
    // 4. Resolutie per zijde
    const res={};
    for(const [k,team,ek] of sides){
      const {T,list}=choices[k]; const own=S[k];
      let dmg=0,byp=0,shld=(own.overflowShield||0),heal=0,shRem=own.lingerRemove,sabRem=0,linger=0,lingerRounds=0,curse=0,wallAdd=0,trapAdd=0;
      const per=[]; let attackers=0, shieldCount=0, bestMark=null, marker=null;
      for(const {p,ch} of list){
        const r={p,dmg:0,byp:0,shld:0,heal:0,shRem:0,teamBE:0,wall:0};
        if(ch){
          const {a,c,fx}=ch; p.ap-=c; p.ap=Math.min(AP_MAX,p.ap+fx.selfBE*0); // selfBE apart (plafond)
          if(fx.selfBE) addSelf(p,fx.selfBE,false);
          if(c>0) p.noSpendRounds=0; else p.noSpendRounds++;
          r.dmg=fx.dmg; r.byp=fx.bypass; r.shld=fx.shld; r.heal=fx.heal; r.shRem=fx.shldRemove; r.teamBE=fx.teamBE; r.wall=fx.wall; r.lowestExtra=fx._lowestExtra||0;
          dmg+=fx.dmg; byp+=fx.bypass; shld+=fx.shld; heal+=fx.heal; shRem+=fx.shldRemove; if(p.b.mode==="tree"&&has(p,"ondermijnen")) sabRem+=fx.shldRemove; linger=Math.max(linger,fx.linger); curse=Math.max(curse,fx.curse);
          wallAdd+=fx.wall; trapAdd+=fx.trap; if(fx.lingerRounds) lingerRounds=Math.max(lingerRounds,fx.lingerRounds);
          if(fx.attack){ attackers++; p.lastAttack=round; p.firstAttackDone=true; p.idleRounds=0; p.nextAtkBonus=0; if(p.inspired&&boss)p.inspired=false;
            if(p.tegenCharges>0)p.tegenCharges--; const st=has(p,"snelle_woede")?2:1, mx=has(p,"heldenmoed")?3:2;
            if(p.b.mode==="tree"&&has(p,"menos")){ if(a.id==="leeuwensprong"&&has(p,"ontlading")) p.menos=0; else p.menos=Math.min(mx,p.menos+st); } }
          else { p.idleRounds++; if(p.b.mode==="tree"&&has(p,"menos")) p.menos=has(p,"nagloeien")?Math.floor(p.menos/2):0; }
          if(fx.shieldAct){ shieldCount++; p.lastShield=round; if(p.b.mode==="tree"&&has(p,"onstuitbaar")) p.tegenCharges=2; }
          if(a.id==="basic_dekking"&&has(p,"gedrilde_rijen")) shieldCount++;
          if(fx.mark&&(!bestMark||fx.mark.max>bestMark.max)){bestMark=fx.mark;marker=p;}
          if(fx.engine) p.engine={...fx.engine};
          if(fx._useWonder) p.once.wonder=true;
          if(fx.healNext) p.healNext+=fx.healNext;
          p._hotNew=fx.hot&&fx.hot.length?fx.hot:null; r.abId=a.id;
          if(p.b.mode==="tree"&&has(p,"kleos")&&a.id==="leeuwensprong") addSelf(p,2);
          if(p.b.mode==="tree"&&has(p,"toeslaan_en_verdwijnen")&&a.id==="hinderlaag") p._shieldNext=2;
        } else { p.idleRounds++; p.noSpendRounds++; if(p.b.mode==="tree"&&has(p,"menos")) p.menos=has(p,"nagloeien")?Math.floor(p.menos/2):0; }
        // werktuigen vuren (alleen bij een goed antwoord van de eigenaar)
        if(p.engine&&p.engine.rounds>0&&!(ch&&ch.fx.engine)){ if(p.ok||p.engine.burn){ r.dmg+=p.engine.dmg; dmg+=p.engine.dmg; if(has(p,"stormram")){r.shRem+=2;shRem+=2;} } p.engine.rounds--; if(p.engine.rounds<=0)p.engine=null; }
        if(p.healNext){ r.heal+=p.healNext; heal+=p.healNext; p.healNext=0; }
        if(p.hot&&p.hot.length){ const hs=p.hot.reduce((x,h)=>x+h.a,0); r.heal+=hs; heal+=hs; p.hot=p.hot.map(h=>({a:h.a,l:h.l-1})).filter(h=>h.l>0); }
        if(p._hotNew){ p.hot=(p.hot||[]).concat(p._hotNew.map(h=>({a:h.a,l:h.l}))); p._hotNew=null; }
        if(p._shieldNext&&!(ch&&ch.a.id==="hinderlaag")){ r.shld+=p._shieldNext; shld+=p._shieldNext; p._shieldNext=0; }
        per.push(r);
      }
      // Merkteken (sterkste telt; Vers Spoor laat het een ronde doorwerken)
      let markBonus=0;
      if(bestMark){ markBonus=Math.min(bestMark.max,Math.max(0,attackers-1)); }
      else if(own.markLinger>0) markBonus=Math.min(own.markLinger,attackers);
      if(markBonus>0){ dmg+=markBonus; if(marker){ const r=per.find(x=>x.p===marker); r.dmg+=markBonus;
        if(has(marker,"opjagen")){shRem+=2;r.shRem+=2;}
        if(markBonus>=bestMark.max){ if(has(marker,"lokroep")) addSelf(marker,1); if(has(marker,"jachthoorn")){ const low=team.filter(q=>q!==marker).sort((x,y)=>x.ap-y.ap)[0]; if(low){low.ap=Math.min(AP_MAX,low.ap+1); r.teamBE+=0; marker.contrib+=1.6;} } }
        if(has(marker,"jachtpartij")&&attackers-1>=3) marker.nextAtkBonus=2; } }
      own.markLinger=(marker&&has(marker,"vers_spoor"))?2:0;
      // Team-AP (plafond per teamgenoot), Kwartiermeester-routering
      const teamBEgivers=per.filter(r=>r.teamBE>0);
      const recv=new Map(team.map(q=>[q,0]));
      for(const r of teamBEgivers){
        const g=r.p; let given=0;
        const lowest=team.filter(q=>q!==g).sort((x,y)=>x.ap-y.ap); const lowN=Math.max(1,Math.round(team.length*0.25));
        for(const q of team){ if(q===g)continue;
          let amt=r.teamBE;
          if(g.b.mode==="tree"){ if(has(g,"bevoorrading")&&lowest.indexOf(q)<lowN) amt+=has(g,"volle_schuren")?2:1;
            if(has(g,"opvangen")&&(!q.ok||(has(g,"vangnet")&&q.ap===0))) amt+=1;
            if(r.lowestExtra&&lowest.indexOf(q)<lowN) amt+=r.lowestExtra;
            if(has(g,"zegenstroom")&&r.abId==="zegen"&&lowest.indexOf(q)<lowN) amt+=1; }
          const room=Math.min(TEAMBE_CAP-recv.get(q),AP_MAX-q.ap); const real=Math.max(0,Math.min(amt,room));
          q.ap+=real; recv.set(q,recv.get(q)+real); given+=real; }
        if(g.b.mode==="tree"&&has(g,"zegenstroom")&&r.abId==="zegen"){ g.ap=Math.min(AP_MAX,g.ap+1); given+=1; }
        g.contrib+=given*1.6;
      }
      if(team.some(p=>p.b.mode==="tree"&&has(p,"niemand_valt"))&&team.every(q=>q.ap>=1)) for(const p of team) if(p.b.mode==="tree"&&has(p,"niemand_valt")) addSelf(p,4);
      // Boss: brede-deelnamebonus
      if(boss){ const dealers=per.filter(r=>r.dmg+r.byp>0).length; for(const cb of BM_CHAIN_BONUS) if(dealers>=cb.min){ dmg+=cb.bonus; break; } }
      res[k]={dmg,byp,shld,heal,shRem,sabRem,linger,lingerRounds,curse,wallAdd,trapAdd,per,attackers,shieldCount};
    }
    // 5. Toepassen
    const apply=(k,ek)=>{
      const r=res[k], own=S[k], en=S[ek];
      // vijandelijk schild deze ronde (incl. wal en val) na weghalen
      const er=res[ek];
      const normRem=r.shRem-(r.sabRem||0);
      const sh1=er?Math.max(0,er.shld-normRem):0;
      let enShield=Math.max(0,sh1-(r.sabRem||0));
      let sabLeft=Math.max(0,(r.sabRem||0)-sh1);
      let enWall=en.wall;
      const sabs=r.per.filter(x=>x.p.b.mode==="tree"&&has(x.p,"ondermijnen")&&x.shRem>0);
      const credit=v=>{ if(v>0&&sabs.length){ const tot=sabs.reduce((a,x)=>a+x.shRem,0)||1; for(const x of sabs) x.p.contrib+=v*x.shRem/tot; } };
      if(enWall>0&&sabLeft>0){ const resist=has_any(ek,"wachttoren")?0.5:1; const cut=Math.min(enWall,Math.round(sabLeft*resist)); enWall-=cut; sabLeft=Math.max(0,sabLeft-Math.ceil(cut/resist)); credit(cut); }
      if(sabLeft>0){ const enTeam=ek==="A"?teamA:teamB; const engs=enTeam.filter(q=>q.engine&&q.engine.rounds>0).sort((x,y)=>y.engine.rounds-x.engine.rounds);
        const destroy=has_any(k,"vuur_in_de_voorraad");
        for(const q of engs){ if(sabLeft<=0)break; if(destroy){ credit(q.engine.rounds*q.engine.dmg*0.75); q.engine=null; sabLeft-=3; } else { const cut=Math.min(q.engine.rounds,Math.floor(sabLeft/3)); if(cut<=0)break; credit(cut*q.engine.dmg*0.75); q.engine.rounds-=cut; sabLeft-=cut*3; if(q.engine.rounds<=0)q.engine=null; } } }
      let trap=en.trap; en.trap=0;
      const absorbS=Math.min(enShield,r.dmg), afterS=r.dmg-absorbS;
      const wMult=has_any(k,"verschroeide_aarde")?2:1;
      const absorbW=Math.min(enWall/wMult,afterS), afterW=afterS-absorbW;
      const absorbT=Math.min(trap,afterW), afterT=afterW-absorbT;
      let hit=afterT+r.byp;
      // vloek van de vijand op deze zijde
      const curse=Math.max(en.curseOnEnemy,0);
      let prevented=0; if(curse>0&&hit>0){ prevented=Math.min(curse,hit); hit-=prevented; }
      const thorns=(curse>0&&hit>0&&has_any(ek,"nemesis"))?4:0;
      en.wall=Math.max(0,enWall-absorbW*wMult);
      en.blockedLast=absorbS+absorbW+absorbT;
      own.blockedLastOut=hit;
      // toeschrijving
      const tot=r.dmg||1;
      for(const x of r.per){ const share=x.dmg/tot; x.p.contrib+=x.dmg>0?(x.dmg-share*(absorbS+absorbW+absorbT)):0; x.p.contrib+=x.byp; }
      if(er){ const removed=Math.min(er.shld,r.shRem); const wouldAbsorb=Math.min(er.shld,r.dmg)-absorbS; const val=Math.max(0,Math.min(removed,wouldAbsorb));
        if(val>0){ const remTot=r.per.reduce((a,x)=>a+x.shRem,0)||1; for(const x of r.per) if(x.shRem>0){ x.p.contrib+=val*x.shRem/remTot; }
          // dat deel van de schade is al aan de aanvallers toegeschreven: daar weer aftrekken
          for(const x of r.per) if(x.dmg>0) x.p.contrib-=val*x.dmg/tot; } }
      if(er){ const shTot=er.shld||1; for(const x of er.per) if(x.shld>0) x.p.contrib+=absorbS*x.shld/shTot; }
      if(er&&(absorbW>0)){ const wb=er.per.filter(x=>x.wall>0||has(x.p,"palissade")||has(x.p,"gegraven_greppel")); if(wb.length) for(const x of wb) x.p.contrib+=absorbW/wb.length; }
      if(prevented>0){ const cs=S[ek]._cursers||[]; for(const c of cs) c.contrib+=prevented/cs.length; }
      return {hit,thorns,prevented};
    };
    if(teamB){
      const hA=apply("A","B"), hB=apply("B","A");
      S.B.hp-=hA.hit+hB.thorns; S.A.hp-=hB.hit+hA.thorns;
      for(const [k,ek] of [["A","B"],["B","A"]]){
        const r=res[k], own=S[k];
        const missing=own.max-Math.max(0,own.hp); const healed=Math.min(missing,r.heal);
        own.hp+=healed; distHeal(r,healed);
        own.overflowShield=has_any(k,"overvloeiend_bloed")?Math.min(3,Math.max(0,r.heal-healed)):0;
        own.wall=Math.min(teamWallCap(k),own.wall+r.wallAdd); own.wallPeak=Math.max(own.wallPeak,own.wall);
        decayWall(k,own); own.trap=r.trapAdd;
        own.curseOnEnemy=r.curse>0?r.curse:(own.curseLinger>0?own.curseLinger:0); own.curseLinger=(r.curse>0&&has_any(k,"onheilsdag"))?Math.max(1,r.curse-1):0;
        own._cursers=res[k].per.filter(x=>x.p.b.mode==="tree"&&(has(x.p,"vloek_der_goden")||has(x.p,"gewijd_vuur"))).map(x=>x.p);
        if(r.linger>0){ own.lingerRemove=r.linger; own.lingerLeft=r.lingerRounds||1; } else if(own.lingerLeft>1){ own.lingerLeft--; } else { own.lingerRemove=0; own.lingerLeft=0; }
        own.accLast=sides.find(s=>s[0]===k)[1].filter(p=>p.ok).length/sides.find(s=>s[0]===k)[1].length;
        own.shieldCountLast=r.shieldCount; own.attackersLast=r.attackers;
      }
    } else {
      // Baasgevecht
      const r=res.A, own=S.A;
      let toBoss=r.dmg+r.byp;
      let labyBroken=false;
      if(B.labyrinthShield>0){ const ab=Math.min(B.labyrinthShield,toBoss); B.labyrinthShield-=ab; toBoss-=ab; if(B.labyrinthShield<=0){B.labyrinthShield=0;labyBroken=true;} }
      for(const x of r.per){ x.p.contrib+=x.dmg+x.byp; }
      let rawB=S.B.hp-toBoss;
      const provPct=Math.max(0,Math.min(S.B.max,rawB))/S.B.max;
      B.phase=bmBossPhaseFor(provPct);
      const noDmg=teamA.filter(p=>p.answeredNow&&!(choices.A.list.find(x=>x.p===p).ch)).length;
      const shieldThis=r.shld;
      const before={...B};
      const tick=bmBossResolveTick({...B},{classMaxHP:own.max,bossMaxHP:S.B.max,diffM:diff.atk,noDamageAnswerCount:noDmg,playerCount:N,
        bossId:boss,dmgDealtThisRound:toBoss,shieldThisRound:shieldThis,labyrinthBroken:labyBroken});
      let classDmg=tick.classDamage;
      // vloek tegen de baas: alleen de gewone aanval, gehalveerd (Cassandra: volledig)
      const atkEv=tick.events.find(e=>e.type==="boss_attack");
      if(atkEv&&own.curseOnEnemy>0&&!atkEv.enraged){ const pctPt=has_any("A","cassandra")?0.15:0.10; const cursable=atkEv.dmg-(atkEv.headExtra||0); const red=Math.min(cursable,Math.round(cursable*pctPt*own.curseOnEnemy));
        classDmg-=red; const cs=own._cursers||[]; for(const c of cs) c.contrib+=red/cs.length;
        if(has_any("A","nemesis")) { rawB-=4; } }
      // schild-waarde tegen de baas: maaltijd onderbroken / Enrage gepareerd
      if(tick.events.some(e=>e.type==="boss_meal_interrupted")){ const val=Math.round(own.max*0.06*diff.atk)+0.04*S.B.max; distShield(r,own,val); }
      if(atkEv&&atkEv.blocked) distShield(r,own,atkEv.blocked);
      if(boss==="hydra"&&opt.hydraHeads){
        const H=B.hh||(B.hh={cycle:0,warn:false,left:0,heads:0});
        // regeneratie weg (vervangen door de koppen)
        const regen=tick.events.filter(e=>e.type==="boss_regen").reduce((a,e)=>a+e.heal,0); tick.bossHeal-=regen;
        // klappen worden zwaarder per kop
        const atk=tick.events.find(e=>e.type==="boss_attack"); if(atk&&H.heads>0){ const extra=Math.round(atk.dmg*(opt.hydraHeadAtk??0.15)*H.heads); classDmg+=extra; }
        if(H.warn){
          if(toBoss>=opt.hydraHeads*S.B.max){ H.warn=false; H.cycle=0; }
          else { H.left--; if(H.left<=0){ H.warn=false; H.cycle=0; H.heads++; tick.bossHeal+=(opt.hydraHeadHeal??0.03)*S.B.max; } }
        } else { H.cycle++; if(H.cycle>=3){ H.warn=true; H.left=2; } }
        tick.boss.hh=H;
      }
      Object.assign(B,tick.boss);
      rawB+=tick.bossHeal||0;
      S.B.hp=Math.min(S.B.max,rawB);
      if(own.wall>0&&classDmg>0){ const ab=Math.min(own.wall,classDmg); own.wall-=ab; classDmg-=ab;
        const wb=teamA.filter(p=>p.b.mode==="tree"&&(has(p,"palissade")||has(p,"gegraven_greppel")||p.b.prestige&&p.b.prestige.id==="muren_van_syracuse")); for(const p of wb) p.contrib+=ab/wb.length; }
      S.A.hp-=classDmg;
      const missing=own.max-Math.max(0,S.A.hp); const healed=Math.min(missing,r.heal); S.A.hp+=healed; distHeal(r,healed);
      own.wall=Math.min(teamWallCap("A"),own.wall+r.wallAdd); decayWall("A",own);
      own.curseOnEnemy=r.curse>0?r.curse:(own.curseLinger||0); own.curseLinger=(r.curse>0&&has_any("A","onheilsdag"))?Math.max(1,r.curse-1):0;
      own._cursers=r.per.filter(x=>x.p.b.mode==="tree"&&(has(x.p,"vloek_der_goden")||has(x.p,"gewijd_vuur"))).map(x=>x.p);
      own.accLast=teamA.filter(p=>p.ok).length/N; own.shieldCountLast=r.shieldCount; own.attackersLast=r.attackers;
    }
    function has_any(k,id){ const team=k==="A"?teamA:teamB; return !!team&&team.some(p=>p.b.mode==="tree"&&has(p,id)); }
    function teamWallCap(k){ return has_any(k,"castra")?16:12; }
    function decayWall(k,own){ // muur brokkelt niet meer vanzelf af; Vesting herstelt 1 HP bij een goed antwoord
      if(own.wall<=0)return; const team=k==="A"?teamA:teamB;
      for(const p of team) if(p.b.mode==="tree"&&has(p,"vesting")&&p.ok) own.wall=Math.min(teamWallCap(k),own.wall+1); }
    function distHeal(r,healed){ const tot=r.heal||1; for(const x of r.per) if(x.heal>0) x.p.contrib+=healed*x.heal/tot; }
    function distShield(r,own,val){ const tot=r.shld||1; for(const x of r.per) if(x.shld>0) x.p.contrib+=val*x.shld/tot; }
  }
  const winA=S.B.hp<=0&&S.A.hp>0 ? true : (S.A.hp<=0&&S.B.hp>0 ? false : (S.A.hp/S.A.max>S.B.hp/S.B.max));
  return {winA,rounds:round,hpLeftA:Math.max(0,S.A.hp)/S.A.max,hpLeftB:Math.max(0,S.B.hp)/S.B.max};
}

/* ---------- Experimenten ---------- */
const ACCS=[0.6,0.7,0.8,0.9,0.65,0.75,0.85,0.7];
function team(builds,prefix,subjectAcc){
  return builds.map((b,i)=>mkPlayer(prefix+i,prefix,b,(subjectAcc&&i===0)?subjectAcc:ACCS[i%ACCS.length]));
}
// Team van 8: de te meten klasse op plek 0, daarna de andere 7 klassen op "nu ★10".
// Omgeving: teamgenoten en tegenstanders met een willekeurige boom (zoals straks in de klas),
// of met CONTEXT=oud allemaal "nu ★10".
const CONTEXT=process.env.CONTEXT||"boom";
let _TREES=null; const treesAll=()=>_TREES||(_TREES=Object.fromEntries(CLASS_IDS.map(c=>[c,allBuilds(c)])));
const envBuild=c=>CONTEXT==="oud"?oldBuild(c):treesAll()[c][Math.floor(rnd()*treesAll()[c].length)];
function subjectTeam(build){ const others=CLASS_IDS.filter(c=>c!==build.cls).map(envBuild); return [build].concat(others); }

function measure(build,scenario,K){
  let contrib=0,rounds=0,wins=0;
  for(let i=0;i<K;i++){
    const A=team(subjectTeam(build),"A",0.75);
    if(scenario==="bm"||scenario==="bmAchter"){ const Bt=team(CLASS_IDS.map(envBuild),"B"); const r=fight(A,Bt,scenario==="bmAchter"?{startHpA:0.6}:{}); if(r.winA)wins++; }
    else { const r=fight(A,null,{boss:scenario,diff:"normal"}); if(r.winA)wins++; }
    contrib+=A[0].contrib; rounds+=A[0].rounds;
  }
  return {perRound:contrib/rounds, win:wins/K};
}

module.exports={BM_SKILLTREES,fight,mkPlayer,oldBuild,treeBuild,allBuilds,CLASS_IDS,HUMAN,setSeed:s=>{_seed=s;},rnd};
if(require.main!==module) return;
const K=+(process.argv[2]||200);
const SCEN=["bm","bmAchter","hydra","cyclops","minotaur"];
const out={generated:new Date().toISOString(),K,context:CONTEXT,classes:{}};
const t0=Date.now();
const ONLY_CLASS=process.env.ONLY_CLASS||null; // bv. ONLY_CLASS=priester: alleen die klasse, naar skilltree-balance-result-<klasse>.json
for(const cls of CLASS_IDS.filter(c=>!ONLY_CLASS||c===ONLY_CLASS)){
  _seed=1000+CLASS_IDS.indexOf(cls);
  const base={}; for(const s of SCEN) base[s]=measure(oldBuild(cls),s,K*2);
  const builds=allBuilds(cls);
  const rows=builds.map(b=>{ const r={label:b.label,path:b.path,nodes:[...b.nodes],prestige:b.prestige.id}; for(const s of SCEN){ _seed=7+builds.indexOf(b)*13+SCEN.indexOf(s); r[s]=measure(b,s,K); } return r; });
  out.classes[cls]={base,rows};
  process.stderr.write(cls+" klaar ("+Math.round((Date.now()-t0)/1000)+"s)\n");
}
if(ONLY_CLASS){ fs.writeFileSync(path.join(__dirname,"skilltree-balance-result-"+ONLY_CLASS+".json"),JSON.stringify(out)); process.exit(0); }
// Meting 2: winkansen tegen bazen. Ijkpunt = beginnende klas (★1, huidige regels).
// Baas-HP groeit mee met de gemiddelde sterren: ×(1 + HP_PER_STAR × gem. ster).
const HP_PER_STAR=+(process.env.HP_PER_STAR||0.03);
const ATK_PER_STAR=+(process.env.ATK_PER_STAR||0.03);
const winTab={};
const TREES={}; for(const c of CLASS_IDS) TREES[c]=allBuilds(c);
const MODES={
  "★1 (nu)":      {mk:c=>oldBuild(c,1),  scale:false},
  "★10 (nu)":     {mk:c=>oldBuild(c,10), scale:false},
  "boom":         {mk:c=>TREES[c][Math.floor(rnd()*TREES[c].length)], scale:false},
  "boom+schaal":  {mk:c=>TREES[c][Math.floor(rnd()*TREES[c].length)], scale:true},
  "★1+schaal":    {mk:c=>oldBuild(c,1),  scale:true},
};
for(const boss of ["hydra","cyclops","minotaur"]) for(const diff of ["normal","hard","legendary"]) for(const acc of [0.7,0.85]){
  const key=boss+"|"+diff+"|"+acc; const r={}; _seed=99; const M=K*3;
  for(const m in MODES){ let w=0,rr=0; for(let i=0;i<M;i++){ const A=CLASS_IDS.map((c,j)=>mkPlayer("A"+j,"A",MODES[m].mk(c),acc)); const f=fight(A,null,{boss,diff,hpPerStar:MODES[m].scale?HP_PER_STAR:0,atkPerStar:MODES[m].scale?ATK_PER_STAR:0}); if(f.winA)w++; rr+=f.rounds; } r[m]={win:w/M,rounds:rr/M}; }
  winTab[key]=r;
}
out.hpPerStar=HP_PER_STAR; out.atkPerStar=ATK_PER_STAR;
// Meting 4: team van 8 × dezelfde klasse op één pad, vs gemengd team (één per klasse)
{
  const mono={}; const M=Math.max(40,Math.round(K*0.8));
  const cells=[["hydra","normal"],["cyclops","normal"],["minotaur","normal"],["hydra","hard"],["cyclops","hard"]];
  const runTeam=(mk)=>{ const r={}; for(const [boss,diff] of cells){ _seed=321; let w=0,rr=0; for(let i=0;i<M;i++){ const A=mk().map((b,j)=>mkPlayer("A"+j,"A",b,0.75)); const f=fight(A,null,{boss,diff,hpPerStar:HP_PER_STAR,atkPerStar:ATK_PER_STAR}); if(f.winA)w++; rr+=f.rounds; } r[boss+"|"+diff]={win:w/M,rounds:rr/M}; } return r; };
  mono["Gemengd (1 per klasse)"]=runTeam(()=>CLASS_IDS.map(c=>TREES[c][Math.floor(rnd()*TREES[c].length)]));
  for(const c of CLASS_IDS) for(const p of ["A","H","B"]){
    const bs=TREES[c].filter(b=>b.path===p); const nm=BM_SKILLTREES[c].nm+" — "+BM_SKILLTREES[c].paths[p].nm;
    mono[nm]=runTeam(()=>Array.from({length:8},()=>bs[Math.floor(rnd()*bs.length)]));
  }
  out.monoTeams=mono;
}
out.bossWin=winTab;
// Meting 3: Battle Mode, hele klas boom vs hele klas oud
{ let w=0; _seed=4242; const M=K*3; for(let i=0;i<M;i++){ const A=CLASS_IDS.map((c,j)=>mkPlayer("A"+j,"A",TREES[c][Math.floor(rnd()*TREES[c].length)],ACCS[j])); const Bt=team(CLASS_IDS.map(c=>oldBuild(c)),"B"); if(fight(A,Bt,{}).winA)w++; } out.bmTreeVsOld=w/M; }
fs.writeFileSync(path.join(__dirname,"skilltree-balance-result.json"),JSON.stringify(out));
process.stderr.write("klaar in "+Math.round((Date.now()-t0)/1000)+"s → tools/skilltree-balance-result.json\n");
