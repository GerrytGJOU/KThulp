/* Tempoproef voor ervaring en levelcurve (castra-xp.js).
   Gebruik in de browser met certamen/index.html geladen (na go("castraHome")):
     eval(await (await fetch("tools/castra-xp-test.js")).text());
     CXP.curve();                   // XP per level en totalen
     CXP.gains();                   // winst per gevecht voor een aantal combinaties
     CXP.tempo("latium", 10, 1);    // gevechten (alleen gewonnen) tot level 10, vanaf level 1, tegen wilde vijanden uit Latium
   Alles met de echte wilde-vijand-tabel (castraMakeEncounter) en de echte formules. */
window.CXP = (function(){
  function curve(){
    return { perLevel:[1,2,3,5,10,15,20,30,40,49].map(n=>n+":"+castraXpToNext(n)).join(" "),
             totaal:[10,20,30,40,50].map(n=>"tot level "+n+": "+castraXpTotalTo(n)).join(" | ") };
  }
  function gains(){
    const mk = (f,l,ins)=>({ enemy:{ line:f, lvl:l, insignis:ins }, caught:false }), out = [];
    [[5,5,"rom_tiro"],[10,10,"rom_hastatus"],[20,20,"rom_princeps"],[40,40,"rom_triarius"],[40,6,"rom_tiro"],[10,15,"rom_hastatus"],[30,20,"rom_princeps"]].forEach(([me,en,f])=>{
      out.push("eigen "+me+" vs "+f+" lvl "+en+": +"+castraXpWild(mk(f,en,false),{lvl:me})+" XP (nodig "+castraXpToNext(me)+")"); });
    return out;
  }
  function tempo(regionId, cap, startLvl, maxFights){
    const keep = CASTRA.seed, s = castraRollSoldier("rom_tiro"); s.lvl = startLvl||1; s.xp = 0; let fights = 0; const at = {};
    while(s.lvl<cap && fights<(maxFights||5000)){
      const V = castraMakeEncounter(regionId); V.mine = s; V.caught = false;
      s.xp += castraXpWild(V, s); fights++;
      while(s.lvl<cap && s.xp>=castraXpToNext(s.lvl)){ s.xp -= castraXpToNext(s.lvl); s.lvl++; if(!at[s.lvl]) at[s.lvl] = fights; }
    }
    CASTRA.seed = keep; return { fights, lvl:s.lvl, at };
  }
  return { curve, gains, tempo };
})();
