/* Tekent een volledige regiokaart met raster, zones, objecten en uitgangen (om aantekeningen bij te maken).
   Gebruik in de browser met certamen/index.html geladen:
     eval(await (await fetch("tools/castra-map-render.js")).text());
     const c = await CASTRA_MAPS.render("graecia");          // een canvas; c.toDataURL("image/png") geeft het plaatje
     await CASTRA_MAPS.post(["graecia","laconia"], "http://localhost:8771/save/");   // naar een kleine ontvanger die PNG's bewaart
   Toestand: alle missies gewonnen en alle poorten open (zoals de wereldtest), geen marktdag. */
window.CASTRA_MAPS = (function(){
  const KIND = { chest:["#e8c040","K"], npc:["#4a9bd9","N"], trainer:["#d9534a","T"], boss:["#8e44ad","B"], hub:["#2ecc71","H"], block:["#7f8c8d","X"], veld:["#e67e22","v"], bld:["#16a085","G"], book:["#b5651d","L"], sign:["#bbb","S"], pickup:["#ff69b4","*"] };
  async function setup(){
    go("castraHome"); await new Promise(r=>setTimeout(r,500)); CASTRA.dev = true; CASTRA.pxp = castraPxpFor(99);
    CASTRA.proelium = CASTRA.proelium || { done:{} }; CASTRA_P_MISSIONS.forEach(m=>CASTRA.proelium.done[m.id] = true);
    CASTRA.wgate = {}; CASTRA_WENT.filter(e=>e.kind==="veld" && e.gate).forEach(e=>CASTRA.wgate[e.id] = 1);
    castraNundinae = ()=>({ on:false, phase:3, next:5 }); await castraTsLoad();
  }
  async function render(rid){
    if(!window.__mapsReady){ await setup(); window.__mapsReady = true; }
    const keep = CASTRA_W_REGION; CASTRA_W_REGION = rid; CASTRA_WORLD_BUILT = {};
    const B = castraWorldBuilt(), W = CASTRA_WORLDS[rid], S = 24, top = 64;
    const big = document.createElement("canvas"), cb = document.createElement("canvas"), ca = document.createElement("canvas");
    castraDrawMapLayers(B, cb, ca); big.width = cb.width; big.height = cb.height; const bg = big.getContext("2d"); bg.drawImage(cb,0,0); bg.drawImage(ca,0,0);
    const c = document.createElement("canvas"); c.width = W.cols*S+30; c.height = W.rows*S+top+16; const g = c.getContext("2d");
    g.fillStyle = "#1b150e"; g.fillRect(0,0,c.width,c.height); g.imageSmoothingEnabled = true; g.drawImage(big, 0, 0, big.width, big.height, 30, top, W.cols*S, W.rows*S);
    const X = x=>30+x*S, Y = y=>top+y*S;
    g.lineWidth = 2; g.setLineDash([6,4]); (W.zones||[]).forEach(z=>{ g.strokeStyle = "rgba(255,255,255,.8)"; g.strokeRect(X(z.x), Y(z.y), z.w*S, z.h*S); });
    g.setLineDash([]); g.font = "bold 13px sans-serif"; (W.zones||[]).forEach(z=>{ const lab = (typeof castraZoneInfo==="function" ? castraZoneInfo(z.t)[1] : z.t)+" ("+z.t+")", w = g.measureText(lab).width+8; g.fillStyle = "rgba(0,0,0,.55)"; g.fillRect(X(z.x)+3, Y(z.y)+3, w, 18); g.fillStyle = "#fff"; g.fillText(lab, X(z.x)+7, Y(z.y)+16); });
    g.font = "10px sans-serif";
    for(let x=0;x<=W.cols;x+=4){ g.strokeStyle = x%8===0 ? "rgba(255,255,255,.28)" : "rgba(255,255,255,.12)"; g.lineWidth = 1; g.beginPath(); g.moveTo(X(x), Y(0)); g.lineTo(X(x), Y(W.rows)); g.stroke(); g.fillStyle = "#e8c96a"; g.fillText(String(x), X(x)-6, top-4); }
    for(let y=0;y<=W.rows;y+=4){ g.strokeStyle = y%8===0 ? "rgba(255,255,255,.28)" : "rgba(255,255,255,.12)"; g.beginPath(); g.moveTo(X(0), Y(y)); g.lineTo(X(W.cols), Y(y)); g.stroke(); g.fillStyle = "#e8c96a"; g.fillText(String(y), 2, Y(y)+4); }
    if(B.def.ledges) Object.keys(B.def.ledges).forEach(k=>{ const [x,y] = k.split(",").map(Number); g.fillStyle = "#fff"; g.font = "bold 12px sans-serif"; g.fillText("▼", X(x)+6, Y(y)+17); });
    (B.def.boulders||[]).forEach(b=>{ g.font = "16px sans-serif"; g.fillText("🪨", X(b[0])+2, Y(b[1])+18); });
    const mark = (x,y,col,txt,hollow)=>{ g.beginPath(); g.arc(X(x)+S/2, Y(y)+S/2, 9, 0, Math.PI*2); if(hollow){ g.lineWidth = 2; g.strokeStyle = col; g.stroke(); } else { g.fillStyle = col; g.fill(); g.lineWidth = 1.5; g.strokeStyle = "#000"; g.stroke(); } g.fillStyle = hollow ? col : "#000"; g.font = "bold 11px sans-serif"; g.textAlign = "center"; g.fillText(txt, X(x)+S/2, Y(y)+S/2+4); g.textAlign = "left"; };
    CASTRA_WENT.filter(e=>e.region===rid).forEach(e=>{ const k = KIND[e.kind] || ["#fff","?"]; if(e.kind==="block"){ mark(e.x, e.y, k[0], k[1], true); return; } if(!castraWEntVisible(e) && e.kind!=="pickup" && !e.when) return; mark(e.x, e.y, k[0], e.role==="mercator" ? "$" : k[1]); });
    Object.keys(CASTRA_NPCS).filter(h=>CASTRA_NPCS[h].region===rid).forEach(h=>{ const n = CASTRA_NPCS[h]; mark(n.world.x, n.world.y, "#f1c40f", "★"); g.fillStyle = "#fff"; g.font = "10px sans-serif"; g.fillText(CASTRA_HERO_DATA[h].nm, X(n.world.x)+S-4, Y(n.world.y)+5); });
    (W.doors||[]).forEach(d=>{ g.fillStyle = "#fff"; g.fillRect(X(d.x)+4, Y(d.y)+4, S-8, S-8); g.fillStyle = "#000"; g.font = "bold 11px sans-serif"; g.textAlign = "center"; g.fillText("D", X(d.x)+S/2, Y(d.y)+S/2+4); g.textAlign = "left"; g.fillStyle = "#fff"; g.font = "10px sans-serif"; g.fillText((CASTRA_WORLDS[d.to]||{nm:d.to}).nm || d.to, X(d.x)+S-2, Y(d.y)+S+8); });
    (W.exit||[]).forEach(t=>{ g.fillStyle = "rgba(46,204,113,.8)"; g.fillRect(X(t.x)+2, Y(t.y)+2, S-4, S-4); });
    g.fillStyle = "#fff"; g.font = "bold 12px sans-serif"; g.textAlign = "center"; g.fillText("start", X(W.start.x)+S/2, Y(W.start.y)+S/2+4); g.textAlign = "left"; g.strokeStyle = "#fff"; g.lineWidth = 2; g.strokeRect(X(W.start.x), Y(W.start.y), S, S);
    g.fillStyle = "#e8c96a"; g.font = "bold 22px sans-serif"; g.fillText(W.icon+" "+W.nm+" ("+rid+", "+W.cols+"×"+W.rows+")", 30, 26);
    g.font = "12px sans-serif"; g.fillStyle = "#ddd"; g.fillText("K kist  N persoon  ★ held  T trainer  B baas  H reisplek  G gebouw  v veldactie  L boekenkast  S bord  * voorwerp  X poort (open getekend)  D deur  ▼ ledge  groen vlak = uitgang  wit kader = start  gestippeld = zone  raster = elke 4 tegels", 30, 48);
    CASTRA_W_REGION = keep; return c;
  }
  async function post(ids, base){ const out = []; for(const rid of ids){ const c = await render(rid); const r = await fetch(base+rid, { method:"POST", body:c.toDataURL("image/png") }); out.push(rid+": "+(await r.text())); } return out; }
  return { render, post };
})();
