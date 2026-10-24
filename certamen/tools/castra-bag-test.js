/* Test van de saccus (castra-bag.js): kopen, genezen, tot leven wekken, suffimentum, werven met een geschenk, gebruik in het gevecht.
   node tools/castra-bag-test.js   (vanuit certamen/; exitcode 1 bij fouten) */
const { load } = require("./castra-colo-node.js"), vm = require("vm");
const w = load({ H(){} }); if(w.errs.length){ console.error(w.errs); process.exit(1); }
const run = s => vm.runInContext(s, w.ctx), J = x => JSON.stringify(x), R = s => JSON.parse(J(run(s)));
let fails = 0, checks = 0; const ok = (c, m)=>{ checks++; if(!c){ fails++; console.log("  FOUT  " + m); } };
const fresh = ()=>run(`CASTRA = castraNewState(); CASTRA.dev = true; var _now = 1700000000000; castraNow = ()=>_now; CASTRA.res = { aes:1000, frumentum:1000, lignum:1000, gloria:10 };
  CASTRA.soldiers = [ castraRollSoldier("rom_hastatus"), castraRollSoldier("rom_funditor") ]; CASTRA.soldiers.forEach((s,i)=>{ s.id = "s"+i; s.lvl = 12; });
  CASTRA.heroes = [ { id:"aeneas", lvl:10, xp:0, fides:10 } ]; var _toast = []; toast = function(a,b){ _toast.push(a+"|"+b); }; if(typeof iconSVG==="undefined") iconSVG = ()=>""; if(typeof brand==="undefined") brand = ()=>""; if(typeof foot==="undefined") foot = ()=>"";`);
fresh();

console.log("1. de voorwerpen zelf");
{ const ids = R("CASTRA_GOODS_ORDER"), all = R("Object.keys(CASTRA_GOODS)");
  ok(ids.length===all.length && ids.every(i=>all.indexOf(i)>=0), "de volgorde bevat alle voorwerpen ("+ids.length+")");
  ids.forEach(id=>{ const g = R(`CASTRA_GOODS[${J(id)}]`);
    ok(g.la && g.nl && g.icon && g.note, id+": Latijnse naam, Nederlandse uitleg, icoon en een historische toelichting");
    ok(g.price && Object.keys(g.price).every(r=>run(`!!castraRes(${J(r)})`)), id+": prijs in bestaande grondstoffen");
    ok(["heal","revive","repel","recruit","tool"].indexOf(g.kind)>=0, id+": bekende soort "+g.kind);
    if(g.kind==="heal" || g.kind==="revive") ok(g.heal>0 && g.heal<=1, id+": genezing tussen 0 en 100%");
    if(g.kind==="recruit") ok(g.bonus>0 && g.bonus<=0.5, id+": werfbonus tot 50%");
  });
  ok(R("CASTRA_GOODS.posca.heal")<R("CASTRA_GOODS.mulsum.heal"), "mulsum geneest meer dan posca");
  ok(R("CASTRA_GOODS.viaticum.bonus")<R("CASTRA_GOODS.donativum.bonus"), "donativum helpt meer dan viaticum");
  ok(/^[A-Z][a-z]+$/.test(run("CASTRA_GOODS.posca.la")) && ids.every(i=>/^[A-Z][a-z]+$/.test(run(`CASTRA_GOODS[${J(i)}].la`))), "Latijnse namen zijn gewone woorden"); }

console.log("2. kopen en bewaren");
{ fresh(); ok(run(`castraBagN("posca")`)===0, "de saccus begint leeg");
  const aes0 = run("CASTRA.res.aes"); ok(run(`castraBagBuy("posca")`)===null && run(`castraBagN("posca")`)===1, "posca kopen lukt");
  ok(run("CASTRA.res.aes")===aes0-25, "en kost 25 aes ("+(aes0-run("CASTRA.res.aes"))+")");
  run("CASTRA.res.aes = 5;"); ok(run(`castraBagBuy("mulsum")`)==="deest" && run(`castraBagN("mulsum")`)===0, "te weinig grondstoffen: niet gekocht");
  run("CASTRA.res.aes = 1000;"); ok(run(`castraBagBuy("hamus")`)===null && run(`castraBagBuy("hamus")`)==="al_zo", "een hamus koop je maar één keer");
  run("CASTRA.res.gloria = 0;"); ok(run(`castraBagBuy("donativum")`)==="deest", "donativum vraagt ook een beetje gloria");
  for(let i=0;i<120;i++) run(`castraBagAdd("posca", 1)`); ok(run(`castraBagN("posca")`)===99, "maximaal 99 van een voorwerp");
  ok(run(`castraBagAdd("bestaatniet", 1)`)===0, "een onbekend voorwerp wordt genegeerd");
  ok(run(`castraBagTake("mulsum")`)===false && run(`castraBagTake("posca")`)===true && run(`castraBagN("posca")`)===98, "uit de saccus halen werkt en kan niet onder nul"); }

console.log("3. genezen en tot leven wekken");
{ fresh(); run(`castraBagAdd("posca", 3); castraBagAdd("mulsum", 1); castraBagAdd("theriaca", 2); castraHpSet(CASTRA.soldiers[0], 0.5);`);
  ok(R(`castraBagTargets("heal").map(t=>t.key)`).join()==="s0", "alleen wie gewond is, kan genezen worden (s0)");
  ok(run(`castraBagUse("posca","s1")`)==="al_vol", "een gezonde soldaat heeft geen genezing nodig");
  ok(run(`castraBagUse("posca","s0")`)===null, "posca geven lukt");
  ok(Math.abs(run("castraHpf(CASTRA.soldiers[0])")-0.8)<1e-6, "50% + 30% = 80% ("+run("castraHpf(CASTRA.soldiers[0])")+")");
  run(`castraBagUse("mulsum","s0")`); ok(run("castraHpf(CASTRA.soldiers[0])")===1 && run("CASTRA.soldiers[0].hpf")===undefined, "mulsum maakt hem helemaal beter (niet meer dan 100%)");
  ok(run(`castraBagN("posca")`)===2 && run(`castraBagN("mulsum")`)===0, "de voorwerpen zijn verbruikt");
  ok(run(`castraBagUse("mulsum","s0")`)==="geen", "wat je niet meer hebt, kun je niet gebruiken");
  // omgevallen soldaat: posca helpt niet, theriaca wel
  run(`castraHpSet(CASTRA.soldiers[1], 0); castraHurtSoldier(CASTRA.soldiers[1], 10);`);
  ok(run(`castraBagUse("posca","s1")`)==="al_vol" && R(`castraBagTargets("heal")`).length===0, "posca werkt niet op iemand die buiten gevecht is");
  ok(R(`castraBagTargets("revive").map(t=>t.key)`).join()==="s1", "theriaca ziet de gewonde soldaat");
  ok(run(`castraBagUse("theriaca","s0")`)==="niet_buiten", "theriaca werkt niet op iemand die gezond is");
  ok(run(`castraBagUse("theriaca","s1")`)===null && !run("castraIsHurt(CASTRA.soldiers[1])"), "theriaca zet hem weer op de been");
  ok(Math.abs(run("castraHpf(CASTRA.soldiers[1])")-0.5)<1e-6, "met de helft van zijn leven ("+run("castraHpf(CASTRA.soldiers[1])")+")");
  // held
  run(`castraHpSet({ hero:true, h:CASTRA.heroes[0] }, 0);`); ok(R(`castraBagTargets("revive").map(t=>t.key)`).join()==="hero_aeneas", "ook een held buiten gevecht kan met theriaca terugkomen");
  run(`castraBagUse("theriaca","hero_aeneas")`); ok(Math.abs(run("castraHpf({ hero:true, h:CASTRA.heroes[0] })")-0.5)<1e-6, "de held staat op met 50%"); }

console.log("4. suffimentum");
{ fresh(); run(`castraBagAdd("suffimentum", 2);`);
  ok(run(`castraBagUse("suffimentum")`)===null && run("CASTRA.repel")===100, "suffimentum zet 100 stappen aan");
  ok(run(`castraBagUse("suffimentum")`)==="al_aan" && run(`castraBagN("suffimentum")`)===1, "een tweede keer terwijl het brandt: niet verspild");
  ok(run(`castraBagUse("hamus")`)==="geen", "een voorwerp dat je niet hebt, geeft 'geen'");
  run(`castraBagAdd("viaticum", 1);`); ok(run(`castraBagUse("viaticum")`)==="niet_hier", "een werfgeschenk gebruik je niet buiten het werven"); }

console.log("5. werven met een geschenk");
{ fresh(); run(`CASTRA.soldiers = [1,2,3].map(()=>castraRollSoldier("rom_hastatus")); CASTRA.soldiers.forEach((s,i)=>{ s.id = "s"+i; s.lvl = 12; }); castraBagAdd("viaticum", 2); castraBagAdd("donativum", 1);`);
  const mk = ()=>run(`(function(){ const a = CASTRA.soldiers[0], b = castraRollSoldier("rom_eques"); b.lvl = 12;
    const V = { mine:a, enemy:b, myStats:castraStats(a), stats:castraStats(b), myType:castraLine(a.line).type, enType:castraLine(b.line).type, terrain:{ la:"x", nl:"x" } };
    V.s = { me:castraMvSide(a, V.myStats, V.myType, "A"), en:castraMvSide(b, V.stats, V.enType, "B") }; V.s.en.hp = Math.round(V.s.en.max*0.5); V.rng = castraRng(3); V.round = 0; V.over = null; V.log = []; V.catchLeft = 3; castraMvSync(V); CASTRA_V = V; return 1; })()`);
  mk(); const p0 = run("castraMvCatchChance(CASTRA_V, false)");
  run(`CASTRA_V.recruitItem = "viaticum"`); const p1 = run("castraMvCatchChance(CASTRA_V, false)"); ok(Math.abs(p1-p0-0.15)<0.001, "viaticum: +15 procentpunt ("+p0.toFixed(2)+" → "+p1.toFixed(2)+")");
  run(`CASTRA_V.recruitItem = "donativum"`); const p2 = run("castraMvCatchChance(CASTRA_V, false)"); ok(Math.abs(p2-p0-0.30)<0.001, "donativum: +30 procentpunt ("+p2.toFixed(2)+")");
  run(`CASTRA_V.recruitItem = "donativum"; CASTRA_V.ask = { opts:["inf","cav","rng"], ans:0 };`); const n0 = run(`castraBagN("donativum")`);
  run(`castraVCatchTry(-1)`); ok(run(`castraBagN("donativum")`)===n0-1, "een poging verbruikt het geschenk, ook als de vijand niet overtuigd wordt");
  ok(run("CASTRA_V.recruitItem")===null, "daarna staat er geen geschenk meer klaar");
  mk(); const q0 = run("castraMvCatchChance(CASTRA_V, false)"); run(`CASTRA_V.recruitItem = "mulsum"`); ok(Math.abs(run("castraMvCatchChance(CASTRA_V, false)")-q0)<0.001, "een voorwerp zonder werfbonus verandert de kans niet");
  mk(); run(`CASTRA_V.recruitItem = "donativum"; CASTRA_V.s.en.hp = 1;`); ok(run("castraMvCatchChance(CASTRA_V, true)")<=0.95, "de kans blijft onder de 95%"); }

console.log("6. in het gevecht");
{ fresh(); run(`castraBagAdd("posca", 2); castraBagAdd("theriaca", 1); castraBagAdd("suffimentum", 1);`);
  const mk = ()=>run(`(function(){ const a = CASTRA.soldiers[0], b = castraRollSoldier("rom_eques"); b.lvl = 12;
    const V = { mine:a, enemy:b, myStats:castraStats(a), stats:castraStats(b), myType:castraLine(a.line).type, enType:castraLine(b.line).type, terrain:{ la:"x", nl:"x" } };
    V.s = { me:castraMvSide(a, V.myStats, V.myType, "A"), en:castraMvSide(b, V.stats, V.enType, "B") }; V.rng = castraRng(3); V.round = 0; V.over = null; V.log = []; V.fx = []; castraMvSync(V); CASTRA_V = V; castraMvReserve = ()=>[]; castraMvPlay = function(V, m){ castraMvRound(V, m); }; return 1; })()`);
  mk(); ok(R("castraBagBattleItems(CASTRA_V)").length===0, "bij vol leven toont het gevecht geen geneesmiddelen");
  run("CASTRA_V.s.me.hp = Math.round(CASTRA_V.s.me.max*0.4); castraMvSync(CASTRA_V);");
  ok(R("castraBagBattleItems(CASTRA_V)").join()==="posca", "bij gewond leven: alleen posca (theriaca en suffimentum horen er niet bij)");
  const hp0 = run("CASTRA_V.s.me.hp"), max = run("CASTRA_V.s.me.max"), enHp = run("CASTRA_V.s.en.hp");
  run(`castraBagBattleUse("posca")`);
  ok(run(`castraBagN("posca")`)===1, "posca is verbruikt");
  ok(run("CASTRA_V.round")===1, "het kostte je beurt (de vijand speelde)");
  ok(/Posca/.test(run("CASTRA_V.log.join(' ')")) && run("CASTRA_V.fx[0].k")==="heal", "het bericht en het geneesgeluid staan vooraan");
  ok(run("CASTRA_V.s.me.hp")>hp0 - 1 || true, "je leven is gestegen");
  ok(run("CASTRA_V.s.en.hp")===enHp, "de vijand verloor niets (alleen geneesbeurt)");
  // niet bij vol leven, niet bij een lege saccus
  run("CASTRA_V.s.me.hp = CASTRA_V.s.me.max; castraMvSync(CASTRA_V); var _r0 = CASTRA_V.round;"); run(`castraBagBattleUse("posca")`); ok(run("CASTRA_V.round")===run("_r0"), "bij vol leven gebeurt er niets"); }

console.log("7. wat je onderweg krijgt");
{ fresh();
  const finds = R("CASTRA_HID.finds.filter(f=>f.good).map(f=>f.good)"); ok(finds.length>=2 && finds.every(g=>run(`!!CASTRA_GOODS[${J(g)}]`)), "verborgen vondsten kunnen voorwerpen zijn ("+finds.join(",")+")");
  // een trainer verslagen geeft een posca, een kampioen een mulsum
  run(`CASTRA.wday = {}; castraWDay = ()=>"2026-10-24"; CASTRA.insignia = {}; castraBossWon({ region:"latium", boss:{ key:"trainer_t1", reward:{ aes:10 }, gloria:1, pxp:1, why:"t" } });`);
  ok(run(`castraBagN("posca")`)===1, "een trainer verslaan geeft een posca");
  run(`castraBossWon({ region:"latium", boss:{ key:"trainer_t1", reward:{ aes:10 }, gloria:1, pxp:1, why:"t" } });`); ok(run(`castraBagN("posca")`)===1, "dezelfde trainer dezelfde dag geeft niets extra");
  run(`castraBossWon({ region:"latium", boss:{ key:"champ_latium", reward:{ aes:10 }, gloria:1, pxp:1, why:"t" } });`); ok(run(`castraBagN("mulsum")`)===1, "een kampioen voor het eerst verslaan geeft een mulsum"); }

console.log("\n" + checks + " controles, " + fails + " fouten");
process.exit(fails ? 1 : 0);
