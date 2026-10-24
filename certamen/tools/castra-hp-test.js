/* Test van de levenspunten die na een gevecht blijven (castra-hp.js).
   node tools/castra-hp-test.js   (vanuit certamen/; exitcode 1 bij fouten) */
const { load } = require("./castra-colo-node.js"), vm = require("vm");
const w = load({ H(){} }); if(w.errs.length){ console.error(w.errs); process.exit(1); }
const run = s => vm.runInContext(s, w.ctx), J = x => JSON.stringify(x), R = s => JSON.parse(J(run(s)));
let fails = 0, checks = 0; const ok = (c, m)=>{ checks++; if(!c){ fails++; console.log("  FOUT  " + m); } };
const fresh = ()=>{ run(`CASTRA = castraNewState(); CASTRA.dev = true; var _now = 1700000000000; castraNow = ()=>_now; CASTRA.soldiers = [ castraRollSoldier("rom_hastatus"), castraRollSoldier("rom_funditor") ]; CASTRA.soldiers.forEach((s,i)=>{ s.id = "s"+i; s.lvl = 12; });`); };
fresh();
const mkV = ()=>run(`(function(){ const a = CASTRA.soldiers[0], b = castraRollSoldier("rom_eques"); b.lvl = 12;
  const V = { mine:a, enemy:b, myStats:castraStats(a), stats:castraStats(b), myType:castraLine(a.line).type, enType:castraLine(b.line).type, terrain:{la:"x",nl:"x"} };
  V.s = { me:castraMvSide(a, V.myStats, V.myType, "A"), en:castraMvSide(b, V.stats, V.enType, "B") }; V.rng = castraRng(7); V.round = 0; V.over = null; V.dmgTaken = 0; V.log = []; castraMvSync(V); globalThis.V = V; return 1; })()`);

console.log("1. standaard vol, daarna wat je verloren hebt");
ok(run("castraHpf(CASTRA.soldiers[0])")===1, "een verse soldaat heeft vol leven");
ok(run("castraHpf({ dux:true })")===1, "de dux heeft altijd vol leven");
ok(run("castraHpf({ line:'rom_tiro' })")===1, "een onbekende eenheid (vijand) heeft vol leven");
run("castraHpSet(CASTRA.soldiers[0], 0.4)"); ok(Math.abs(run("castraHpf(CASTRA.soldiers[0])")-0.4)<1e-9, "na een gevecht staat het leven op 40%");
ok(run("CASTRA.soldiers[0].hpf")===0.4 && run("CASTRA.soldiers[0].hpt")>0, "opgeslagen als fractie met tijdstip");
run("castraHpSet(CASTRA.soldiers[0], 1)"); ok(run("CASTRA.soldiers[0].hpf")===undefined, "vol leven wordt niet opgeslagen (kleine save)");
run("castraHpSet({ id:'vreemd', line:'rom_tiro' }, 0.3)"); ok(true, "een eenheid die niet van jou is, wordt genegeerd (geen fout)");
ok(run("castraHpOwned({ id:'vreemd' })")===false && run("castraHpOwned(CASTRA.soldiers[0])")===true, "eigendom: soldaat in het kamp wel, vijand niet");

console.log("2. vanzelf herstellen in echte tijd");
run("castraHpSet(CASTRA.soldiers[0], 0.4)");
run("_now += 10*60000"); ok(Math.abs(run("castraHpf(CASTRA.soldiers[0])")-0.45)<1e-6, "na 10 minuten +5% ("+run("castraHpf(CASTRA.soldiers[0])")+")");
run("_now += 1000*60000"); ok(run("castraHpf(CASTRA.soldiers[0])")===1, "nooit meer dan vol");

console.log("3. omvallen");
fresh(); run("castraHpSet(CASTRA.soldiers[0], 0); castraHurtSoldier(CASTRA.soldiers[0], 10);");
ok(run("castraHpf(CASTRA.soldiers[0])")===0, "omgevallen soldaat: 0 zolang hij gewond is");
const until = run("CASTRA.soldiers[0].hurtUntil"); run(`_now = ${until} + 1`);
ok(Math.abs(run("castraHpf(CASTRA.soldiers[0])")-0.25)<0.01, "na het gewond zijn komt hij terug met 25% ("+run("castraHpf(CASTRA.soldiers[0])")+")");

console.log("4. helden");
run("CASTRA.heroes = [ { id:'aeneas', lvl:10, xp:0, fides:10 } ];"); const hu = "({ hero:true, h:CASTRA.heroes[0] })";
ok(run(`castraHpf(${hu})`)===1, "held begint vol");
run(`castraHpSet(${hu}, 0.5)`); ok(Math.abs(run(`castraHpf(${hu})`)-0.5)<1e-9, "held houdt zijn verlies");
run(`castraHpSet(${hu}, 0)`); ok(run(`castraHpf(${hu})`)===0, "omgevallen held is even buiten gevecht");
run("_now += 6*60000"); ok(run(`castraHpf(${hu})`)>=0.25, "na enkele minuten staat hij weer op (≥25%)");

console.log("5. het gevecht start met het bewaarde leven en bewaart het weer");
fresh(); run("castraHpSet(CASTRA.soldiers[0], 0.5)"); mkV();
ok(Math.abs(run("V.s.me.hp/V.s.me.max")-0.5)<0.02, "je soldaat begint met ±50% ("+run("Math.round(100*V.s.me.hp/V.s.me.max)")+"%)");
ok(run("V.s.en.hp")===run("V.s.en.max"), "de vijand begint vol");
run("V.s.me.hp = Math.round(V.s.me.max*0.3); castraHpStore(V);");
ok(Math.abs(run("CASTRA.soldiers[0].hpf")-0.3)<0.01, "castraHpStore bewaart het leven van je soldaat ("+run("CASTRA.soldiers[0].hpf")+")");
run("V.s.me.hp = 0; castraHpStore(V);"); ok(run("CASTRA.soldiers[0].hpf")===0.25, "omgevallen: 25% bij terugkeer");
// door de rondes heen
fresh(); mkV(); run("V.s.en.hp = V.s.en.max = 1e9; castraMvReserve = ()=>[]; for(let i=0;i<3;i++) castraMvRound(V, CASTRA_MV_BASIC);");
ok(run("CASTRA.soldiers[0].hpf")!==undefined && run("CASTRA.soldiers[0].hpf")<1, "na een paar beurten is het verlies bewaard ("+run("CASTRA.soldiers[0].hpf")+")");
ok(Math.abs(run("CASTRA.soldiers[0].hpf")-run("V.s.me.hp/V.s.me.max"))<0.002, "bewaard leven = leven in het gevecht");
// volgend gevecht
mkV(); ok(Math.abs(run("V.s.me.hp/V.s.me.max")-run("CASTRA.soldiers[0].hpf"))<0.02, "het volgende gevecht begint met dat leven");
// dux en kopie van de colosseum
ok(run("castraMvSide({ dux:true, lvl:1 }, { vita:40, impetus:5, tutela:5, celeritas:5, ambitus:1 }, 'inf', 'Dux').hp")===run("castraMvSide({ dux:true, lvl:1 }, { vita:40, impetus:5, tutela:5, celeritas:5, ambitus:1 }, 'inf', 'Dux').max"), "de dux begint altijd vol");

console.log("6. genezen");
fresh(); run("castraHpSet(CASTRA.soldiers[0], 0.2); castraHpSet(CASTRA.soldiers[1], 0); castraHurtSoldier(CASTRA.soldiers[1], 10); CASTRA.heroes = [ { id:'aeneas', lvl:10, xp:0, fides:10 } ]; castraHpSet({ hero:true, h:CASTRA.heroes[0] }, 0.6);");
ok(run("castraNeedHeal().length")===3, "drie eenheden hebben genezing nodig");
const healed = run("castraHealAll().length"); ok(healed===3, "castraHealAll geneest ze allemaal ("+healed+")");
ok(run("castraNeedHeal().length")===0 && run("castraHpf(CASTRA.soldiers[0])")===1 && run("castraHpf(CASTRA.soldiers[1])")===1 && run("castraHpf({ hero:true, h:CASTRA.heroes[0] })")===1, "daarna is iedereen vol en niet meer gewond");
run("castraHpSet(CASTRA.soldiers[0], 0.5); castraHurtSoldier(CASTRA.soldiers[0], 10);"); run("castraHealOne(CASTRA.soldiers[0])");
ok(run("castraHpf(CASTRA.soldiers[0])")===1 && !run("castraIsHurt(CASTRA.soldiers[0])"), "castraHealOne (genezer) herstelt een soldaat helemaal");

console.log("7. vangen en de HP-bar");
{ const e = R("(function(){ const x = castraRollSoldier('rom_hastatus'); castraHpCarry(x, 0.3); return { hpf:x.hpf, hpt:x.hpt>0 }; })()"); ok(e.hpf===0.3 && e.hpt, "een gevangen vijand neemt zijn leven mee");
  ok(run("(function(){ const x = castraRollSoldier('rom_hastatus'); castraHpCarry(x, 0.01); return x.hpf; })()")===0.05, "minstens 5% bij een vangst");
  ok(/%/.test(run("castraHpHTML(CASTRA.soldiers[0], 60)")), "de HP-balk geeft een percentage"); }
ok(!/hurtMinutesWin\)/.test(require("fs").readFileSync(__dirname+"/../castra-venatio.js","utf8").split("\n").filter(l=>/castraHurtSoldier/.test(l)).join("\n")), "winst met veel schade zet geen gewond-timer meer");

console.log("\n" + checks + " controles, " + fails + " fouten");
process.exit(fails ? 1 : 0);
