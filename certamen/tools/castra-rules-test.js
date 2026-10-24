/* Regeltests voor het jachtgevecht (castra-elem.js en castra-moves.js): schade, spreiding, elementen, STAB, statussen,
   stat-stages, nauwkeurigheid, gelijkspel, event-log en de save-migraties. Alles met vaste seed, geen DOM nodig.
   Gebruik in de browser met certamen/index.html geladen (na go("castraHome")):
     eval(await (await fetch("tools/castra-moves-test.js")).text());     // levert CMV (setup/mk)
     eval(await (await fetch("tools/castra-rules-test.js")).text());     // draait alle tests en geeft { ok, fail, log }
*/
(function(){
  const res = { ok:0, fail:0, log:[] };
  const T = (name, cond, extra)=>{ if(cond) res.ok++; else { res.fail++; res.log.push("MISLUKT: "+name+(extra!==undefined ? " ("+extra+")" : "")); } };
  const keepRes = castraMvReserve; castraMvReserve = ()=>[];
  const mkV = (fa, fb, L, seed)=>CMV.setup(CMV.mk(fa, L||12, 11), CMV.mk(fb, L||12, 22), seed||5);
  const mv = (o)=>({ id:"t", la:"Test", kind:"dmg", power:50, acc:100, pp:0, ...o });
  try{
    /* ---- stages ---- */
    T("stage 0 = ×1", castraStageMult("imp",0)===1);
    T("stage +1 = ×1,5", castraStageMult("imp",1)===1.5);
    T("stage +6 = ×4", castraStageMult("tut",6)===4);
    T("stage -1 = ×2/3", Math.abs(castraStageMult("cel",-1)-2/3)<1e-9);
    T("stage -6 = ×0,25", castraStageMult("imp",-6)===0.25);
    T("stage wordt begrensd op ±6", castraStageMult("imp",9)===4 && castraStageMult("imp",-9)===0.25);
    T("nauwkeurigheid +3 = ×2", castraStageMult("acc",3)===2);
    { const S = {}; T("stage +1 geeft +1", castraStageChange(S,"imp",1)===1);
      castraStageChange(S,"imp",5); T("stage stopt op +6", S.stages.imp===6 && castraStageChange(S,"imp",1)===0); }

    /* ---- elementen ---- */
    T("aqua > ignis ×1,5", castraElemMult("aqua","ignis")===1.5);
    T("ignis < aqua ×0,75", castraElemMult("ignis","aqua")===0.75);
    T("lux/umbra tegenpolen", castraElemMult("lux","umbra")===1.5 && castraElemMult("umbra","lux")===1.5);
    T("onbekend element = ×1", castraElemMult("x","ignis")===1 && castraElemMult("aqua","aqua")===1);
    T("dubbel type vermenigvuldigt", Math.abs(castraElemVs("aqua",["ignis","aer"])-1.5*0.75)<1e-9 && castraElemVs("aqua",[])===1);
    T("elke mythische vorm krijgt een element", CASTRA_FORM_LIST.filter(f=>f.volk==="myt").every(f=>castraUnitElems({ line:f.id }).length>0));
    T("elke held krijgt een element", Object.keys(CASTRA_HERO_DATA).every(id=>castraUnitElems({ hero:true, h:{ id } }).length>0));
    T("gewone soldaat: geen element", castraUnitElems({ line:"rom_hastatus" }).length===0 && castraUnitElems({ dux:true }).length===0);
    T("elementen verwijzen naar bestaande elementen", Object.values(CASTRA_ELEMS).every(e=>CASTRA_ELEMS[e.beats]));

    /* ---- schade ---- */
    { const V = mkV("rom_hastatus","rom_funditor"), A = V.s.me, D = V.s.en;
      const lo = castraMvCalc(A,D,mv(),{ spread:0.85 }).d, hi = castraMvCalc(A,D,mv(),{ spread:1 }).d;
      T("spreiding: 0,85 geeft minder dan 1,0", lo<hi, lo+" < "+hi);
      T("schade altijd minstens 1", castraMvCalc(A,D,mv({ power:1 }),{ spread:0.85 }).d>=1);
      T("meer kracht = meer schade", castraMvCalc(A,D,mv({ power:80 })).d > castraMvCalc(A,D,mv({ power:40 })).d);
      const d0 = castraMvCalc(A,D,mv()).d; D.guard = true; const dg = castraMvCalc(A,D,mv()).d; D.guard = false;
      T("verdedigen halveert ongeveer", dg<=Math.ceil(d0/2)+1 && dg>=Math.floor(d0/2)-1, d0+" → "+dg);
      castraStageChange(A,"imp",2); T("aanvalsstage +2 verhoogt de schade", castraMvCalc(A,D,mv()).d > d0); A.stages = {};
      castraStageChange(D,"tut",2); T("verdedigingsstage +2 verlaagt de schade", castraMvCalc(A,D,mv()).d < d0); D.stages = {};
      A.status = "ustio"; T("brandwond verlaagt de schade", castraMvCalc(A,D,mv()).d < d0); A.status = null;
      T("doorboren verhoogt de schade", castraMvCalc(A,D,mv({ pierce:50 })).d >= d0);
      // verhouding is begrensd: een enorme verdediging maakt geen muur
      D.stats = { ...D.stats, tutela:D.stats.tutela*100 }; T("extreme verdediging blijft schade geven", castraMvCalc(A,D,mv()).d>=1);
    }
    { // STAB en element
      const V = mkV("myt_draco","rom_hastatus"), A = V.s.me, D = V.s.en; D.elems = ["terra"];
      T("draco is ignis/umbra", A.elems.join()==="ignis,umbra");
      const plain = castraMvCalc(A,D,mv(),{ spread:1 }), ign = castraMvCalc(A,D,mv({ el:"ignis" }),{ spread:1 }), aq = castraMvCalc(A,D,mv({ el:"aqua" }),{ spread:1 });
      T("STAB ×1,25 voor eigen element", ign.stab===1.25 && aq.stab===1);
      T("ignis tegen terra ×1,5", ign.me===1.5 && Math.abs(ign.d/plain.d - 1.5*1.25)<0.1, ign.d+"/"+plain.d);
      T("aqua tegen terra ×1 (geen STAB)", aq.me===1 && aq.d===plain.d);
    }
    { // wapendriehoek blijft werken
      const V = mkV("rom_hastatus","rom_eques"); T("wapendriehoek: infanterie wint van ruiterij", castraTypeMult("inf","cav")===1.5 && castraTypeMult("cav","inf")===0.75);
      T("castraMvMult combineert type en element", castraMvMult(V.s.me,V.s.en,mv())===castraTypeMult(V.s.me.type,V.s.en.type)); }

    /* ---- voltreffer negeert stages ---- */
    { const V = mkV("rom_hastatus","rom_funditor"), A = V.s.me, D = V.s.en; const base = castraMvCalc(A,D,mv(),{ spread:1 }).d;
      castraStageChange(A,"imp",-3); const low = castraMvCalc(A,D,mv(),{ spread:1 }).d, lowCrit = castraMvCalc(A,D,mv(),{ spread:1, crit:true }).d;
      T("lage aanvalsstage verlaagt schade", low<base); T("voltreffer negeert lage aanvalsstage", lowCrit===base, lowCrit+" vs "+base); A.stages = {};
      castraStageChange(D,"tut",3); const hiD = castraMvCalc(A,D,mv(),{ spread:1 }).d, hiDc = castraMvCalc(A,D,mv(),{ spread:1, crit:true }).d;
      T("hoge verdedigingsstage verlaagt schade", hiD<base); T("voltreffer negeert hoge verdedigingsstage", hiDc===base); }

    /* ---- statussen ---- */
    { const V = mkV("rom_hastatus","rom_funditor"), S = V.s.en, rng = V.rng;
      T("status zetten lukt", castraStatusApply(S,"vulnus",rng)===true && S.status==="vulnus");
      T("maar één status tegelijk", castraStatusApply(S,"pavor",rng)===false && S.status==="vulnus");
      T("onbekende status wordt geweigerd", castraStatusApply(V.s.me,"bestaatniet",rng)===false);
      castraStatusApply(V.s.me,"somnus",rng); T("slaap duurt 1-3 beurten", V.s.me.sleep>=1 && V.s.me.sleep<=3, V.s.me.sleep);
    }
    { // wond en brandwond: 1/16 per beurt, aan het eind
      const V = mkV("rom_hastatus","rom_funditor"); V.s.en.status = "vulnus"; V.s.me.status = "ustio"; V.log = [];
      const mHp = V.s.me.hp, eHp = V.s.en.hp; castraMvEndOfTurn(V);
      T("wond kost 1/16", V.s.en.hp===eHp-Math.floor(V.s.en.max/16), (eHp-V.s.en.hp)+" van "+V.s.en.max);
      T("brandwond kost 1/16", V.s.me.hp===mHp-Math.floor(V.s.me.max/16));
      T("beurtschade staat in de event-log", V.ev.filter(e=>e.t==="dot").length===2);
    }
    { // slaap: beurt gaat verloren en daarna word je wakker
      const V = mkV("rom_hastatus","rom_funditor"); V.s.me.status = "somnus"; V.s.me.sleep = 2; V.ev = []; const hp0 = V.s.en.hp;
      castraMvExec(V,"me",CASTRA_MV_BASIC); castraMvExec(V,"me",CASTRA_MV_BASIC);
      T("slapende eenheid doet niets", V.s.en.hp===hp0 && V.ev.filter(e=>e.t==="skip").length===2);
      castraMvExec(V,"me",CASTRA_MV_BASIC);
      T("daarna wordt hij wakker en slaat toe", !V.s.me.status && V.ev.some(e=>e.t==="wake") && V.s.en.hp<hp0);
    }
    { // schrik: soms geen actie, en trager
      const V = mkV("rom_hastatus","rom_funditor"); const sp0 = castraMvSpeed(V.s.me); V.s.me.status = "pavor";
      T("schrik halveert de snelheid", Math.abs(castraMvSpeed(V.s.me)-sp0/2)<1e-9);
      let skips = 0; for(let i=0;i<400;i++){ V.ev = []; V.s.en.hp = V.s.en.max; castraMvExec(V,"me",CASTRA_MV_BASIC); if(V.ev.some(e=>e.t==="skip")) skips++; }
      T("schrik slaat ±25% van de beurten over", skips>=70 && skips<=130, skips+" van 400");
    }
    { // brandwond halveert aanval, zichtbaar in de stat
      const V = mkV("rom_hastatus","rom_funditor"), a0 = castraMvStat(V.s.me,"imp"); V.s.me.status = "ustio";
      T("brandwond halveert impetus", Math.abs(castraMvStat(V.s.me,"imp")-a0/2)<1e-9); }

    /* ---- bijwerkingen (eff) ---- */
    { const V = mkV("rom_hastatus","rom_funditor"); V.s.en.hp = V.s.en.max = 10000;
      const m = mv({ eff:[{ st:"vulnus", p:100 }, { stage:["cel",-1], p:100 }, { stage:["imp",1], p:100, self:true }] });
      castraMvExec(V,"me",m);
      T("effect: status op de vijand", V.s.en.status==="vulnus");
      T("effect: stage op de vijand", V.s.en.stages.cel===-1);
      T("effect: stage op jezelf", V.s.me.stages.imp===1);
      T("effecten staan in de event-log", V.ev.some(e=>e.t==="status"&&e.to==="en") && V.ev.some(e=>e.t==="stage"&&e.to==="en") && V.ev.some(e=>e.t==="stage"&&e.to==="me"));
      const V2 = mkV("rom_hastatus","rom_funditor"); V2.s.en.hp = V2.s.en.max = 10000; castraMvExec(V2,"me",mv({ eff:[{ st:"vulnus", p:0 }] }));
      T("kans 0% geeft nooit een effect", !V2.s.en.status);
    }

    /* ---- nauwkeurigheid ---- */
    { const mk = ()=>{ const V = mkV("rom_hastatus","rom_funditor"); V.s.en.hp = V.s.en.max = 1e9; return V; };
      const miss = (st)=>{ const V = mk(); if(st) castraStageChange(V.s.me,"acc",st); let m = 0; for(let i=0;i<500;i++){ V.ev = []; castraMvExec(V,"me",mv({ acc:60 })); if(V.ev.some(e=>e.t==="miss")) m++; } return m; };
      const m0 = miss(0), mDn = miss(-3), mUp = miss(3);
      T("lagere nauwkeurigheid = vaker missen", mDn>m0 && m0>mUp, mDn+" > "+m0+" > "+mUp);
      const V = mk(); let miss2 = 0; for(let i=0;i<300;i++){ V.ev = []; castraMvExec(V,"me",mv({ acc:10, sure:true })); if(V.ev.some(e=>e.t==="miss")) miss2++; }
      T("'raakt altijd' mist nooit", miss2===0); }

    /* ---- beurtvolgorde ---- */
    { // gelijke snelheid: ongeveer 50/50
      let first = 0; const N = 300;
      for(let i=0;i<N;i++){ const V = mkV("rom_hastatus","rom_hastatus", 12, 1000+i); V.s.en.stats = { ...V.s.me.stats }; V.s.en.hp = V.s.en.max = V.s.me.hp = V.s.me.max = 1e9;
        V.mine = null; castraMvRound(V, CASTRA_MV_BASIC); const uses = V.ev.filter(e=>e.t==="use"); if(uses[0] && uses[0].w==="me") first++; }
      T("bij gelijke snelheid gaat ± de helft van de keren de speler eerst", first>110 && first<190, first+" van "+N); }
    { const V = mkV("rom_hastatus","rom_funditor"); V.s.me.stats = { ...V.s.me.stats, celeritas:1 }; V.s.en.stats = { ...V.s.en.stats, celeritas:99 }; V.s.me.hp = V.s.me.max = V.s.en.hp = V.s.en.max = 1e9;
      castraMvRound(V, mv({ prio:1 })); const uses = V.ev.filter(e=>e.t==="use"); T("prioriteit gaat boven snelheid", uses[0].w==="me" || V.s.en.moves.some(m=>m.prio>0)); }

    /* ---- event-log en gevecht als geheel ---- */
    { const V = mkV("rom_hastatus","rom_funditor"); castraMvRound(V, CASTRA_MV_BASIC);
      T("elke beurt vult V.ev", Array.isArray(V.ev) && V.ev.length>0 && V.ev.every(e=>e.w==="me"||e.w==="en"));
      T("event-log en logregels horen bij elkaar", V.log.length>0); }
    { const a = CMV.fight(CMV.mk("rom_hastatus",12,1),CMV.mk("rom_funditor",12,2),"slim",9), b = CMV.fight(CMV.mk("rom_hastatus",12,1),CMV.mk("rom_funditor",12,2),"slim",9);
      T("zelfde seed = zelfde gevecht", a.round===b.round && a.over===b.over && a.s.me.hp===b.s.me.hp && a.s.en.hp===b.s.en.hp);
      const c = CMV.fight(CMV.mk("rom_hastatus",12,1),CMV.mk("rom_funditor",12,2),"slim",10);
      T("ander seed = andere uitkomst mogelijk", c.s.me.hp!==a.s.me.hp || c.s.en.hp!==a.s.en.hp || c.round!==a.round); }
    { // vangkans: status helpt
      const V = mkV("rom_hastatus","rom_hastatus"); const keep = CASTRA.soldiers; CASTRA.soldiers = [1,2,3]; V.enemy = V.enemy || V.s.en.unit; V.s.en.hp = Math.round(V.s.en.max*0.5);
      const p0 = castraMvCatchChance(V,false); V.s.en.status = "somnus"; const p1 = castraMvCatchChance(V,false); V.s.en.status = null; CASTRA.soldiers = keep;
      T("een slapende vijand is makkelijker te vangen", p1>p0, p0.toFixed(2)+" → "+p1.toFixed(2)); }

    /* ---- vangkans per vorm ---- */
    T("alle vangfactoren verwijzen naar bestaande vormen", Object.keys(CASTRA_FORM_CATCH).every(id=>CASTRA_FORMS[id]));
    T("vangfactoren liggen tussen 0,1 en 1,2", Object.values(CASTRA_FORM_CATCH).every(v=>v>=0.1&&v<=1.2));
    T("onbekende vorm: factor 1", castraFormCatch("rom_hastatus")===1 && castraFormCatch("bestaatniet")===1);
    { const keep = CASTRA.soldiers; CASTRA.soldiers = [1,2,3];
      const mk2 = (id)=>{ const V = mkV("rom_hastatus","rom_hastatus"); V.enemy = { ...V.enemy, line:id, lvl:12 }; V.mine = { ...V.mine, lvl:12 }; V.s.en.hp = Math.round(V.s.en.max*0.4); return V; };
      const a = castraMvCatchChance(mk2("myt_satyrus"),false), b = castraMvCatchChance(mk2("myt_draco"),false);
      T("een draak is moeilijker te vangen dan een sater", b<a, a.toFixed(2)+" vs "+b.toFixed(2)); CASTRA.soldiers = keep; }

    /* ---- moves van wezens met elementen ---- */
    { const mv1 = castraMvSet({ line:"myt_draco", lvl:10 }, "myth").filter(m=>m.kind==="dmg" && m.id!=="oppugna");
      T("een draak krijgt moves met een element", mv1.length>0 && mv1.every(m=>m.el==="ignis"||m.el==="umbra"));
      T("zo'n move heeft de bijwerking van zijn element", mv1.every(m=>(m.eff||[]).length>=1));
      const plain = castraMvSet({ line:"rom_hastatus", lvl:10 }, "inf"); T("gewone soldaat: geen elementen", plain.every(m=>!m.el));
      T("Oppugna blijft zonder element", castraMvSet({ line:"myt_draco", lvl:10 }, "myth")[0].el===undefined); }

    /* ---- opslag en migraties ---- */
    { const s = { heroes:[{ lvl:5, xp:9 }], soldiers:[], v:1 }, once = castraMigrateState(JSON.parse(JSON.stringify(s)));
      T("migratie zet de stappen als gedaan", once.migr && once.migr.heroes_scale===1 && once.migr.troops_trees===1);
      const lvl = once.heroes[0].lvl, twice = castraMigrateState(once);
      T("migratie draait nooit twee keer", twice.heroes[0].lvl===lvl); }
    { const legacy = { heroes:[{ lvl:20, xp:3 }], soldiers:[], heroV:1, troopsV:1, v:1 }, out = castraMigrateState(legacy);
      T("oude saves met heroV/troopsV worden niet opnieuw omgerekend", out.heroes[0].lvl===20 && out.migr.heroes_scale===1); }
    T("saveSize is een getal onder de limiet", castraSaveSize()>0 && castraSaveSize()<CASTRA_SAVE_LIMIT);
    T("alle migratie-id's zijn uniek", new Set(CASTRA_MIGRATIONS.map(m=>m.id)).size===CASTRA_MIGRATIONS.length);
  } catch(e){ res.fail++; res.log.push("UITZONDERING: "+e+" "+(e.stack||"").split("\n").slice(0,3).join(" | ")); }
  finally { castraMvReserve = keepRes; }
  return res;
})();
