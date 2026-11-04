/* Castra Heroum — kamp-HUD in de stijl van andere base builders (Clash of Clans, Rise of Kingdoms, Forge of Empires):
   - een bouwersbalk boven de kaart: per bouwer wat hij bouwt en hoe lang nog (live), of "vrij";
   - een bel boven elk gebouw: oogst klaar (tik = meteen ophalen), "vol", in aanbouw (met aflopende tijd) of upgrade mogelijk.
   Eén teller per seconde werkt beide bij zolang de kaart in beeld is. Bellen staan als lege <div class="cBub"> in castraRenderMap (castra.js). */

const CASTRA_HUD = { timer:null, last:"" };
const CASTRA_HUD_MIN_COLLECT_MS = 15*60000;     // pas vanaf een kwartier opbrengst verschijnt de oogstbel

function castraHudCss(){
  if(document.getElementById("castraHudCss")) return;
  const st = document.createElement("style"); st.id = "castraHudCss";
  st.textContent = `
  #castraBuilders{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin:0 0 8px}
  .cBldr{position:relative;min-width:190px;flex:1 1 190px;max-width:320px;box-sizing:border-box;padding:4px 10px 8px;border:2px solid var(--hi-dim,#8a6d2f);border-radius:10px;background:rgba(27,21,14,.9);color:var(--cream,#f1e6c4);font-size:13px;cursor:pointer;overflow:hidden}
  .cBldr.free{opacity:.7;cursor:default}
  .cBldr .bar{position:absolute;left:0;right:0;bottom:0;height:5px;background:rgba(0,0,0,.45)}
  .cBldr .bar i{display:block;height:100%;background:linear-gradient(90deg,#c99a2e,#f0cf6a);transition:width 1s linear}
  .cBldr b{color:var(--hi,#d4af37)}
  #cgTop #castraBuilders{flex-wrap:nowrap;overflow-x:auto;justify-content:flex-start;gap:5px;scrollbar-width:none}
  #cgTop #castraBuilders::-webkit-scrollbar{display:none}
  #cgTop #castraBuilders:empty{display:none}
  #cgTop .cBldr{flex:0 0 auto;min-width:0;max-width:none;font-size:11px;padding:2px 8px 7px;white-space:nowrap;border-radius:8px}
  #cgQuests{position:absolute;z-index:58;right:6px;top:58px;width:176px;max-width:46%;box-sizing:border-box;border:2px solid var(--hi-dim,#8a6d2f);border-radius:10px;background:rgba(20,16,10,.84);color:#f0e2b8;font-size:12px;overflow:hidden}
  #cgQuests:empty{display:none}
  #cgQuests .qh{display:flex;justify-content:space-between;align-items:center;padding:3px 8px;font-weight:bold;cursor:pointer;background:rgba(212,175,55,.18)}
  #cgQuests .qr{padding:4px 8px;border-top:1px solid rgba(212,175,55,.25);cursor:pointer;line-height:1.25;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
  #cgQuests .qr.rdy{color:#bfe8a8}
  .cBub{position:absolute;left:50%;top:-30px;transform:translateX(-50%);z-index:4;display:none;align-items:center;gap:3px;white-space:nowrap;font-size:var(--lbl,11px);font-weight:700;line-height:1;padding:3px 8px;border-radius:14px;background:#f3e6bd;color:#2a2118;border:2px solid #8a6d2f;box-shadow:0 2px 4px rgba(0,0,0,.55)}
  .cBub:after{content:"";position:absolute;left:50%;bottom:-7px;margin-left:-5px;border:5px solid transparent;border-top-color:#8a6d2f;border-bottom:0}
  .cBub.collect{display:flex;animation:cBubBob 1.3s ease-in-out infinite;cursor:pointer}
  .cBub.full{display:flex;background:#ffe27a;border-color:#b3541a;animation:cBubBob .8s ease-in-out infinite;cursor:pointer}
  .cBub.busy{display:flex;background:#2a2118;color:#f1e6c4;border-color:#d4af37}
  .cBub.busy:after{border-top-color:#d4af37}
  .cBub.up{display:flex;background:#bfe8a8;border-color:#3f7d2c;padding:2px 7px;cursor:pointer}
  .cBub.up:after{border-top-color:#3f7d2c}
  @keyframes cBubBob{50%{transform:translateX(-50%) translateY(-4px)}}`;
  document.head.appendChild(st);
}

function castraHudBuilders(){
  const box = document.getElementById("castraBuilders"); if(!box) return;
  const n = castraBuilders(), act = castraBuildActive().sort((a,b)=>CASTRA.b[a].up.end - CASTRA.b[b].up.end), now = castraNow();
  let h = "";
  for(let i=0;i<n;i++){
    const id = act[i];
    if(id){
      const up = CASTRA.b[id].up, left = Math.max(0, up.end-now), tot = Math.max(1, castraBuildMs(up.to)), pc = Math.max(0, Math.min(100, Math.round(100*(1-left/tot))));
      h += `<div class="cBldr" onclick="castraOpen('${id}')">🔨 <b>${esc(castraBuilding(id).nm)}</b> → ${castraLaText("gradus")} ${up.to} · <span class="cHud" data-id="${id}" data-end="${up.end}">${castraFmtLeftLive(left)}</span><div class="bar"><i style="width:${pc}%"></i></div></div>`;
    } else h += `<div class="cBldr free">💤 Bouwer ${i+1}: vrij</div>`;
  }
  box.innerHTML = h;
}

// Wat de bel van een gebouw toont: [klasse, inhoud]
function castraHudBubble(b){
  const st = CASTRA.b[b.id], now = castraNow();
  if(st && st.up) return ["busy", `🔨 <span class="cHud" data-id="${b.id}" data-end="${st.up.end}">${castraFmtLeftLive(Math.max(0,st.up.end-now))}</span>`];
  if(b.prod && st && st.lvl>0){
    const el_ = now - st.t, pend = castraPending(b.id);
    if(pend>0 && el_ >= CASTRA_BAL.producerStoreHours*3600000) return ["full", `${castraRes(b.prod.res).icon} vol!`];
    if(pend>0 && el_ >= CASTRA_HUD_MIN_COLLECT_MS) return ["collect", `${castraRes(b.prod.res).icon} +${pend}`];
  }
  const L = (st && st.lvl) || 0;
  if(!b.fixed && L < castraMaxLvl(b.id) && castraBuildActive().length < castraBuilders() && castraCanPay(castraUpgradeCost(b.id))) return ["up", "▲"];
  return ["", ""];
}

/* ---------- opdrachtenlijstje aan de zijkant (alleen op de kampkaart) ---------- */
// Lopende opdrachten van de Diarium-motor, opdrachten uit de wereld en een paar suggesties van "Hodie" (jacht, baas, weekuitdaging).
function castraTrackItems(){
  const out = [];
  try{
    if(typeof castraDqActive==="function") castraDqActive().forEach(q=>{
      const st = castraDqState(q.id), ready = st.s >= q.steps.length, s = q.steps[st.s], info = s ? castraDqStepInfo(q, st) : null;
      out.push(ready ? { c:"rdy", t:"❓ "+q.nm.nl+": meld je bij "+castraDqWhere(q) } : { c:"", t:"📜 "+q.nm.nl+": "+s.hud.nl+(info&&info.txt?" ("+info.txt+")":"") });
    });
    if(typeof castraDqAvailable==="function" && typeof CASTRA_QDEFS!=="undefined"){ const q = CASTRA_QDEFS.find(castraDqAvailable); if(q) out.push({ c:"", t:"❗ Nieuw: "+q.nm.nl+" (praat met "+castraDqWhere(q)+")" }); }
    (typeof castraWobjOpus==="function" ? castraWobjOpus() : []).forEach(t=>out.push({ c:"", t:"📜 "+t.nl }));
    Object.keys(CASTRA.quests||{}).forEach(id=>{
      if(typeof castraHero==="function" && castraHero(id)) return;
      const d = CASTRA_HERO_DATA[id]; if(!d || !CASTRA.quests[id].acc) return;
      const s = typeof castraStepOf==="function" ? castraStepOf(id) : null; if(s && s.hud) out.push({ c:"", t:"⭐ "+d.nm+": "+s.hud.nl });
    });
    if(typeof castraHodieItems==="function") castraHodieItems().filter(i=>/Jachtopdracht|Venator|baas|Wekelijkse/.test(i.t)).slice(0,2).forEach(i=>out.push({ c:"", t:i.icon+" "+i.t }));
  }catch(e){ console.error(e); }
  return out.slice(0,5);
}
function castraTrackToggle(){ const o = CASTRA.opts || (CASTRA.opts = {}); o.trackOff = !castraTrackOff(); castraSave(); castraTrackUpdate(true); }
function castraTrackOff(){ const o = CASTRA.opts || {}; return o.trackOff!==undefined ? !!o.trackOff : window.innerWidth<520; }
function castraTrackUpdate(force){
  const box = document.getElementById("cgQuests"); if(!box) return;
  const items = castraTrackItems(), off = castraTrackOff();
  const h = items.length ? `<div class="qh" onclick="castraTrackToggle()"><span>📜 Opdrachten${off?" ("+items.length+")":""}</span><span>${off?"▸":"▾"}</span></div>` + (off ? "" : items.map(i=>`<div class="qr ${i.c}" onclick="castraNavPick('opus')">${esc(i.t)}</div>`).join("")) : "";
  if(force || box.dataset.h!==h){ box.dataset.h = h; box.innerHTML = h; }
}
function castraTrackBuild(main){
  if(!main || document.getElementById("cgQuests")) return;
  const d = document.createElement("div"); d.id = "cgQuests"; d.onpointerdown = ev=>ev.stopPropagation(); main.appendChild(d);
  castraHudCss(); castraTrackUpdate(true);
}

function castraHudUpdate(){
  if(!document.getElementById("castraMap")) return;
  castraHudBuilders();
  castraTrackUpdate();
  if(typeof castraNavRefresh==='function') castraNavRefresh();
  document.querySelectorAll(".cBub").forEach(el_=>{
    const b = castraBuilding(el_.dataset.b); if(!b) return;
    const [cls, html] = castraHudBubble(b);
    el_.className = "cBub" + (cls ? " "+cls : ""); el_.dataset.k = cls;
    if(el_.innerHTML !== html) el_.innerHTML = html;
  });
}

// Tik op een bel: oogst ophalen, anders het gebouwpaneel openen.
function castraBubbleTap(ev, id){
  ev.stopPropagation();
  const k = ev.currentTarget.dataset.k;
  if(k==="collect" || k==="full"){
    const b = castraBuilding(id), n = castraCollect(id);
    if(!n) castraToastLa("plenum"); else castraToastLa("collectum", "+"+n+" "+castraRes(b.prod.res).nm);
    castraRenderRes(); castraHudUpdate();
  } else castraOpen(id);
}

function castraHudTick(){
  if(!document.getElementById("castraMap")){ clearInterval(CASTRA_HUD.timer); CASTRA_HUD.timer = null; return; }
  // is een bouw net klaar? castraLvl rondt hem af; daarna de kaart (cijfers in de labels) opnieuw opbouwen
  const done = castraBuildActive().filter(id=>CASTRA.b[id].up.end <= castraNow());
  if(done.length){ done.forEach(id=>castraLvl(id)); castraRenderMap(); castraRenderRes(); if(CASTRA_UI.panel) castraOpen(CASTRA_UI.panel); }
  castraHudUpdate();
}
function castraHudStart(){
  castraHudCss(); castraHudUpdate();
  if(!CASTRA_HUD.timer) CASTRA_HUD.timer = setInterval(castraHudTick, 1000);
}
