/* Test van de bergen (castra-berg.js) en de veldeffecten en geluiden (castra-fx.js): kaartontwerp, ledges, rotsen duwen, oplosbaarheid, effecten per stap.
   node tools/castra-berg-test.js   (vanuit certamen/; exitcode 1 bij fouten) */
const { load } = require("./castra-colo-node.js"), vm = require("vm");
const w = load({ H(){} }); if(w.errs.length){ console.error(w.errs); process.exit(1); }
const run = s => vm.runInContext(s, w.ctx), J = x => JSON.stringify(x), R = s => JSON.parse(J(run(s)));
let fails = 0, checks = 0; const ok = (c, m)=>{ checks++; if(!c){ fails++; console.log("  FOUT  " + m); } };
const fresh = ()=>run(`CASTRA = castraNewState(); CASTRA.dev = true; CASTRA.pxp = castraPxpFor(99); CASTRA_W_REGION = "graecia"; CASTRA_WORLD_BUILT = {}; CASTRA_W_UI = { px:31, py:46, dir:"up", frame:1, moving:false, scale:1 }; var _toast = []; toast = function(a,b){ _toast.push(a+"|"+b); };
  CASTRA.proelium = { done:{} }; CASTRA_P_MISSIONS.forEach(m=>CASTRA.proelium.done[m.id] = true); CASTRA.wgate = {}; CASTRA_WENT.filter(e=>e.kind==="veld" && e.gate).forEach(e=>CASTRA.wgate[e.id] = 1);`);
fresh();
const snap = ()=>R(`(function(){ const W = castraWorldCfg(), blocked = []; for(let y=0;y<W.rows;y++) for(let x=0;x<W.cols;x++) if(castraWBlocked(x,y)) blocked.push(x+","+y); return { c:W.cols, r:W.rows, blocked, ledges:castraWorldBuilt().def.ledges || {} }; })()`);
const bfsFrom = (S, sx, sy)=>{ const blocked = new Set(S.blocked), seen = new Set([sx+","+sy]), q = [[sx,sy]], dirs = { up:[0,-1], down:[0,1], left:[-1,0], right:[1,0] };
  while(q.length){ const [x,y] = q.shift(); Object.keys(dirs).forEach(dn=>{ const [dx,dy] = dirs[dn], nx = x+dx, ny = y+dy, k = nx+","+ny; if(nx<0||ny<0||nx>=S.c||ny>=S.r) return;
    const L = S.ledges[k]; if(L){ if(L===dn){ const lx = nx+dx, ly = ny+dy, lk = lx+","+ly; if(!blocked.has(lk) && !seen.has(lk)){ seen.add(lk); q.push([lx,ly]); } } return; }
    if(!blocked.has(k) && !seen.has(k)){ seen.add(k); q.push([nx,ny]); } }); }
  return seen; };
const M = R("CASTRA_BERG.graecia"), cell = (x,y)=>{ const rx = x-M.x, ry = y-M.y; return (rx>=0 && ry>=0 && ry<M.h && rx<M.w) ? M.rows[ry][rx] : null; };

console.log("1. het kaartontwerp");
{ ok(M.rows.every(r=>r.length===M.w), "alle rijen zijn "+M.w+" breed");
  ok(M.rows.join("").split("").every(c=>"#.pvo^><".indexOf(c)>=0), "alleen bekende tekens");
  const L = []; M.rows.forEach((r,ry)=>r.split("").forEach((c,rx)=>{ if("v^><".indexOf(c)>=0) L.push({ x:M.x+rx, y:M.y+ry, c }); }));
  ok(L.length===6, "zes ledge-tegels (drie randen van twee): "+L.length);
  L.forEach(l=>{ const d = { v:[0,1], "^":[0,-1], ">":[1,0], "<":[-1,0] }[l.c], from = cell(l.x-d[0], l.y-d[1]), to = cell(l.x+d[0], l.y+d[1]);
    ok(".po".indexOf(from)>=0, "ledge "+l.x+","+l.y+": je springt vanaf begaanbaar terrein ("+from+")");
    ok(".p".indexOf(to)>=0, "ledge "+l.x+","+l.y+": je landt op begaanbaar terrein ("+to+")"); });
  ok(M.rows.join("").split("o").length-1===1, "één rots in de nis");
  const B = R(`(function(){ const b = castraWorldBuilt(); return { ledges:b.def.ledges, boulders:b.def.boulders, cliffs:b.def.cliffs.length, paths:Object.keys(b.def.bergPaths).length }; })()`);
  ok(Object.keys(B.ledges).length===6 && Object.values(B.ledges).every(d=>d==="down"), "de wereld kent de zes ledges, allemaal naar beneden");
  ok(J(B.boulders)===J([[M.x+6, M.y+2]]), "de rots staat in de opening van de nis ("+J(B.boulders)+")");
  ok(B.cliffs>100 && B.paths>20, "veel klifwand ("+B.cliffs+") en een pad ("+B.paths+")");
  // ontmoetingen alleen op terrassen
  const tall = R(`Object.keys(castraWorldBuilt().tall)`).map(k=>k.split(",").map(Number)).filter(([x,y])=>cell(x,y)!==null);
  ok(tall.length>20 && tall.every(([x,y])=>cell(x,y)==="."), "de ontmoetingen liggen alleen op terrassen ("+tall.length+")");
  ok(R(`Object.keys(castraWorldBuilt().tall).filter(k=>{ const [x,y] = k.split(",").map(Number); return ${M.x}<=x && x<${M.x+M.w} && ${M.y}<=y && y<${M.y+M.h}; }).every(k=>castraWorldBuilt().tall[k]==="mons")`), "het bergterrein is 'mons'");
}

console.log("2. ledges");
{ ok(run(`castraLedgeAt(${M.x+10}, ${M.y+4})`)==="down" && run(`castraLedgeAt(${M.x+5}, ${M.y+4})`)===null, "castraLedgeAt kent de ledge (naar beneden) en niet de klif ernaast");
  ok(J(R(`castraLedgeLanding(${M.x+10}, ${M.y+4}, "down")`))===J({ x:M.x+10, y:M.y+6 }), "vanaf de ledge land je twee tegels verder (één voorbij de landingstegel: tegel erachter)");
  const S = bfsFrom(snap(), 40, 19);        // buiten de berg, ten oosten van de ingang
  const at = (x,y)=>S.has(x+","+y);
  ok(at(M.x+23, M.y+13), "de ingang aan de oostkant leidt naar de voet van de berg");
  ok(at(M.x+22, M.y+10) && at(M.x+2, M.y+6) && at(M.x+20, M.y+2), "je bereikt het lage, het middelste en het hoogste terras (via de hellingen)");
  ok(at(M.x+10, M.y+14), "ook de ledge-landing aan de voet is bereikbaar");
  ok(!at(M.x+3, M.y+2) && !at(M.x+2, M.y+1), "de nis achter de rots is nog niet bereikbaar");
  // een ledge werkt maar één kant op: van de voet naar boven kan niet
  const up = R(`castraLedgeAt(${M.x+10}, ${M.y+12})`); ok(up==="down", "de ledge tussen terras C en de voet springt naar beneden");
}

console.log("3. rotsen duwen");
{ fresh(); const bx = M.x+6, by = M.y+2;
  ok(run(`castraBoulderAt(${bx}, ${by})`)===true && run(`castraWBlocked(${bx}, ${by})`)===true, "de rots blokkeert zijn tegel");
  ok(run(`castraBoulderAt(${bx+1}, ${by})`)===false, "ernaast niet");
  // zonder hopliet of spartaan: te zwaar
  run("CASTRA.soldiers = []; CASTRA.heroes = [];");
  ok(run(`castraBoulderPush("left", ${bx}, ${by})`)===false && /Saxum grave/.test(run("_toast[_toast.length-1]")) && run(`castraBoulderAt(${bx}, ${by})`)===true, "zonder sterke eenheid: te zwaar, de rots blijft staan (Saxum grave est)");
  // met een hopliet: één tegel
  const form = run(`(function(){ const f = CASTRA_FORM_LIST.find(f=>castraFieldBaseClass({ line:f.id })==="hopliet" || castraFieldBaseClass({ line:f.id })==="spartaan"); return f && f.id; })()`);
  ok(!!form, "er bestaat een vorm met klasse hopliet of spartaan ("+form+")");
  run(`var _s = castraRollSoldier(${J(form)}); _s.id = "sx"; _s.lvl = 10; CASTRA.soldiers = [ _s ];`);
  ok(run(`!!castraFieldPick("saxum")`)===true, "met een hopliet in je leger kan het");
  ok(run(`castraBoulderPush("left", ${bx}, ${by})`)===true && run(`castraBoulderAt(${bx-1}, ${by})`)===true && run(`castraBoulderAt(${bx}, ${by})`)===false, "de rots schuift één tegel naar links");
  ok(run(`castraWBlocked(${bx}, ${by})`)===false, "de oude tegel is vrij (je kunt erdoor)");
  // niet in een muur, niet op een pad, niet op een ledge
  ok(run(`castraBoulderCanMove(${M.x}, ${by})`)===false, "een rots kan niet in de klifwand");
  ok(run(`castraBoulderCanMove(${M.x+21}, ${M.y+4})`)===false, "een rots kan niet op een helling (pad)");
  ok(run(`castraBoulderCanMove(${M.x+10}, ${M.y+4})`)===false, "een rots kan niet op een ledge");
  ok(run(`castraBoulderCanMove(0, 5)`)===false && run(`castraBoulderCanMove(-1, 5)`)===false, "en niet buiten de kaart");
  ok(run(`castraBoulderCanMove(${M.x+15}, ${M.y+2})`)===true, "op een vrij terras wel");
  // de rots staat de volgende keer weer op zijn plek
  run("CASTRA_W_UI.bou = null;"); ok(run(`castraBoulderAt(${bx}, ${by})`)===true, "een nieuwe keer op de kaart staat de rots weer op zijn plek");
  // oplosbaar: twee duwen openen de nis
  fresh(); run(`CASTRA.soldiers = [ _s ]; castraBoulderPush("left", ${bx}, ${by}); castraBoulderPush("left", ${bx-1}, ${by});`);
  const SS = bfsFrom(snap(), bx+1, by), reachChest = [[M.x+1,M.y+1],[M.x+2,M.y+1],[M.x+2,M.y+2],[M.x+1,M.y+3]].some(([cx,cy])=>SS.has(cx+","+cy));
  ok(reachChest, "na twee duwen kom je bij de kist in de nis");
  // vast zetten: een rots tegen de muur kan niet verder
  fresh(); run(`CASTRA.soldiers = [ _s ]; for(let i=0;i<8;i++){ const b = castraBoulders()[0].split(",").map(Number); if(!castraBoulderPush("left", b[0], b[1])) break; }`);
  ok(run("castraBoulders()[0]")===(M.x+1)+","+(M.y+2), "de rots stopt tegen de muur van de nis ("+run("castraBoulders()[0]")+")");
}

console.log("4. verborgen vondsten en rotsen");
{ fresh(); run("castraDay = ()=>'2026-10-24'; for(const k in CASTRA_HID_REACH) delete CASTRA_HID_REACH[k];");
  const sp = R(`castraHidSpots("graecia").map(s=>[s.x,s.y])`);
  ok(sp.every(([x,y])=>!(x===M.x+6 && y===M.y+2)), "geen verborgen vondst onder de rots");
  ok(sp.every(([x,y])=>cell(x,y)!=="#" && "v^><".indexOf(cell(x,y))<0), "geen verborgen vondst in de klifwand of op een ledge"); }

console.log("5. veldeffecten en geluid");
{ run(`var _sfx = []; var _real = castraSfx; castraSfx = function(n){ _sfx.push(n); };`);
  const tile = (k, pred)=>{ const B = R(`(function(){ const b = castraWorldBuilt(), out = []; for(let y=1;y<b.rows-1;y++) for(let x=1;x<b.cols-1;x++){ const g = b.ground[y][x], t = b.tall[x+","+y]; out.push([x,y,g,!!t]); } return out; })()`); return B.find(pred); };
  const step = (x,y)=>{ run("_sfx.length = 0;"); run(`CASTRA_W_UI.fxSkip = 0; castraFxStep(${x}, ${y});`); return R("_sfx.slice()"); };
  const tall = tile("t", t=>t[3]), sand = tile("s", t=>!t[3] && (t[2]==="sand"||t[2]==="sand2") && !R(`castraIsWater("graecia",${t[0]+1},${t[1]})||castraIsWater("graecia",${t[0]-1},${t[1]})||castraIsWater("graecia",${t[0]},${t[1]+1})||castraIsWater("graecia",${t[0]},${t[1]-1})`)),
    stone = tile("st", t=>!t[3] && t[2]==="stone"), plank = tile("p", t=>t[2]==="plank"), water = tile("w", t=>R(`castraIsWater("graecia",${t[0]+1},${t[1]})`) && !t[3]);
  ok(step(tall[0], tall[1])[0]==="grass", "hoog gras ritselt");
  ok(sand && step(sand[0], sand[1])[0]==="sand", "zand klinkt als zand (en laat voetstappen)");
  ok(stone && step(stone[0], stone[1])[0]==="stone", "steen klinkt als steen");
  if(plank) ok(step(plank[0], plank[1])[0]==="wood", "een brug klinkt als hout");
  if(water) ok(step(water[0], water[1]).indexOf("ripple")>=0, "naast water rimpelt het");
  run("_sfx.length = 0; CASTRA_W_UI.fxSkip = 1; castraFxStep("+tall[0]+", "+tall[1]+"); CASTRA_W_UI.fxSkip = 0;"); ok(run("_sfx.length")===0, "na een sprong (fxSkip) geen dubbel stapgeluid");
  run("castraSfx = _real;");
  // alle geluiden werken op een nepgeluidsysteem
  run(`var _calls = 0; var _node = function(){ return new Proxy(function(){}, { get:(t,k)=> k==="gain"||k==="frequency"||k==="Q" ? { value:0, setValueAtTime(){ _calls++; }, exponentialRampToValueAtTime(){ _calls++; } } : k==="getChannelData" ? ()=>new Float32Array(2048) : _node, apply:()=>_node(), set:()=>true }); };
    window.AudioContext = function(){ return { currentTime:0, sampleRate:8000, state:"running", destination:{}, createBuffer:(c,n)=>({ getChannelData:()=>new Float32Array(n) }), createBufferSource:()=>({ connect(){}, start(){ _calls++; }, buffer:null }), createBiquadFilter:()=>({ connect(){}, frequency:{ value:0 }, Q:{ value:0 }, type:"" }), createGain:()=>({ connect(){}, gain:{ value:0, setValueAtTime(){ _calls++; }, exponentialRampToValueAtTime(){} } }), createOscillator:()=>({ connect(){}, start(){ _calls++; }, stop(){}, type:"", frequency:{ setValueAtTime(){}, exponentialRampToValueAtTime(){} } }) }; }; _castraAc = null;`);
  const names = R("Object.keys(CASTRA_SFX)"); ok(names.length>=14, names.length+" geluiden");
  names.forEach(n=>{ let err = null; try{ run(`_calls = 0; castraSfx(${J(n)});`); }catch(e){ err = e.message; } ok(!err && run("_calls")>0, "geluid '"+n+"' speelt zonder fout"+(err?": "+err:"")); });
  run(`castraSndSet(false)`); ok(run("castraSndOn()")===false, "geluid uit"); run("_calls = 0; castraSfx('jump');"); ok(run("_calls")===0, "met geluid uit klinkt er niets");
  run(`castraSndSet(true)`); ok(run("castraSndOn()")===true, "geluid weer aan");
  ok(R("CASTRA_MENU_ITEMS.some(m=>m.id==='sonus')") && /Sonus/.test(run(`castraMenuView("sonus")`)), "het menu heeft een Sonus-scherm");
  ok(R("typeof castraFxGrass+typeof castraFxRipple+typeof castraFxPrint+typeof castraFxDust")==="functionfunctionfunctionfunction", "de effectfuncties bestaan"); }

console.log("\n" + checks + " controles, " + fails + " fouten");
process.exit(fails ? 1 : 0);
