/* Balansproef voor het beurtgevecht met moves en vangen (castra-moves.js).
   Gebruik in de browser met certamen/index.html geladen (na go("castraHome")):
     eval(await (await fetch("tools/castra-moves-test.js")).text());
     CMV.report();                 // winstkans en duur per niveau en per speelstijl
     CMV.catchReport();            // vangkansen per vijand-HP en tier
   Speelstijlen van de speler: "spam" = altijd Oppugna; "slim" = beste verwachte schade, geneest als het laag is,
   gebruikt Defende soms. De vijand speelt altijd met de eigen AI (castraMvAI). Alles met vaste seed. */
window.CMV = (function(){
  const FORMS = [ ["rom_hastatus","rom_hastatus"], ["rom_funditor","rom_funditor"], ["rom_eques","rom_eques"], ["rom_signifer","rom_signifer"], ["myt_lemur","myt_lemur"] ];
  function mk(formId, lvl, seed){
    const keep = CASTRA.seed; CASTRA.seed = seed;
    try{ const s = castraRollSoldier(formId); s.lvl = lvl; s.skManual = false; s.skills = []; return s; } finally { CASTRA.seed = keep; }
  }
  function setup(a, b, seed){
    const V = { mine:a, enemy:b, myStats:castraStats(a), stats:castraStats(b), myType:castraLine(a.line).type, enType:castraLine(b.line).type, terrain:{la:"x",nl:"x"} };
    V.s = { me:castraMvSide(a, V.myStats, V.myType, "A"), en:castraMvSide(b, V.stats, V.enType, "B") };
    V.rng = castraRng(seed); V.round = 0; V.over = null; V.dmgTaken = 0; V.log = []; castraMvSync(V); return V;
  }
  function pick(V, style){
    const me = V.s.me, en = V.s.en, av = castraMvAvail(me);
    if(style==="spam") return CASTRA_MV_BASIC;
    const heal = av.find(m=>m.kind==="heal");
    if(heal && me.hp/me.max < 0.4) return heal;
    const buff = av.find(m=>m.kind==="buff"); if(buff && me.buffImp<=0 && V.round<2) return buff;
    if(me.hp/me.max < 0.25 && !me.lastGuard) return CASTRA_MV_DEFEND;
    const dmg = av.filter(m=>m.kind==="dmg");
    return dmg.sort((a,b)=>castraMvExpected(me,en,b)-castraMvExpected(me,en,a))[0] || CASTRA_MV_BASIC;
  }
  function fight(a, b, style, seed){
    const V = setup(a, b, seed);
    while(!V.over) castraMvRound(V, pick(V, style));
    return V;
  }
  function report(levels){
    levels = levels || [5, 12, 25, 40]; const out = [];
    levels.forEach(L=>{
      ["spam","slim"].forEach(style=>{
        let w = 0, rounds = 0, n = 0, left = 0;
        FORMS.forEach(([fa])=>FORMS.forEach(([fb])=>{
          for(let k=0;k<12;k++){
            const V = fight(mk(fa, L, 1000+k*17), mk(fb, L, 2000+k*31), style, 777+k*13);
            n++; rounds += V.round; if(V.over==="win"){ w++; left += V.myHp/V.myMax; }
          }
        }));
        out.push(`niveau ${L} ${style}: winst ${Math.round(100*w/n)}% · ${ (rounds/n).toFixed(1)} beurten · levenspunten over bij winst ${w?Math.round(100*left/w):0}%`);
      });
    });
    return out;
  }
  function catchReport(){
    const out = [], V = setup(mk("rom_hastatus", 12, 5), mk("rom_hastatus", 12, 6), 1);
    const keep = CASTRA.soldiers; CASTRA.soldiers = [1,2,3];     // geen beginnersbonus
    [100, 70, 40, 20, 8].forEach(p=>{ V.s.en.hp = Math.round(V.s.en.max*p/100);
      const f = castraLine(V.enemy.line);
      out.push(`vijand ${p}% hp (tier ${f.tier}): zonder vraag ${Math.round(100*castraMvCatchChance(V,false))}%, met goed antwoord ${Math.round(100*castraMvCatchChance(V,true))}%`); });
    CASTRA.soldiers = keep; return out;
  }
  return { report, catchReport, fight, mk, setup };
})();
