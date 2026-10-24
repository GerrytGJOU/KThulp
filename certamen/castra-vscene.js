/* ============================================================================
   CASTRA HEROUM — HET JACHTGEVECHT ALS PICTURALE SCÈNE (zoals Pokémon, in onze eigen stijl)
   ----------------------------------------------------------------------------
   Opbouw zoals in Pokémon: de vijand rechtsboven op een platform, jouw eenheid (van achteren) links onderin en groter,
   een naamkaart met levensbalk bij allebei, daaronder een tekstvak met het verloop en het keuzemenu.
   Beweging: de strijders komen aan het begin binnenschuiven, ademen rustig, springen naar de ander bij een aanval,
   flitsen en trillen bij een treffer (met zwevend schadegetal), de levensbalk loopt zacht leeg, ondersteunende moves
   geven een lichtkring, en wie verslagen is zakt weg. Een beurt wordt eerst afgespeeld; pas daarna komt het menu terug
   of het resultaat (castraMvPlay in castra-moves.js). De gebeurtenissen komen uit V.fx (castraMvFx).
   De achtergrond volgt het terrein (gras, bos, kust, steen, grot). Alles in CSS-animaties (geen afbeeldingen nodig).
   Laadt NA castra-moves.js.
   ============================================================================ */
const CASTRA_VSCENE_CSS = `
.cbt{position:relative;width:100%;height:clamp(270px,54vw,430px);border-radius:14px;overflow:hidden;border:3px solid var(--hi,#d4af37);box-shadow:0 4px 18px rgba(0,0,0,.5);background:var(--sky)}
.cbt .cbg{position:absolute;left:0;right:0;bottom:0;top:46%;background:linear-gradient(var(--g1),var(--g2))}
.cbt .cbh{position:absolute;left:-10%;right:-10%;top:30%;height:22%;background:radial-gradient(60% 100% at 25% 100%,var(--hill) 60%,transparent 61%),radial-gradient(50% 100% at 78% 100%,var(--hill2) 60%,transparent 61%)}
.cbt .cbc{position:absolute;width:90px;height:26px;border-radius:50px;background:rgba(255,255,255,.75);box-shadow:30px -10px 0 6px rgba(255,255,255,.7),60px 0 0 0 rgba(255,255,255,.65);animation:cbCloud 40s linear infinite}
.cbt .cbpf{position:absolute;border-radius:50%;background:radial-gradient(ellipse at 50% 35%,var(--p1),var(--p2));box-shadow:0 6px 0 rgba(0,0,0,.28);transform:translate(-50%,-50%)}
.cbt .cbsp{position:absolute;width:96px;height:96px;transform-origin:50% 100%}
.cbt .cbsp img{image-rendering:pixelated}
.cbt .cbi{width:96px;height:96px;animation:cbBob 2.6s ease-in-out infinite}
.cbt .cbsh{position:absolute;left:50%;bottom:2px;width:70%;height:12%;transform:translateX(-50%);background:rgba(0,0,0,.28);border-radius:50%;filter:blur(2px)}
.cbt .cbbox{position:absolute;min-width:150px;width:46%;max-width:310px;padding:7px 12px 8px;border-radius:12px;background:linear-gradient(#f3e6bd,#e4d2a1);color:#2b1d0e;border:3px solid #4a3416;box-shadow:0 0 0 2px #c9a24a,0 4px 10px rgba(0,0,0,.5);font-size:15px;z-index:6}
.cbt .cbbox b{font-size:17px}
.cbt .cbbox .cbhp{height:11px;margin-top:4px;background:#3b2d1a;border:2px solid #4a3416;border-radius:7px;overflow:hidden}
.cbt .cbbox .cbhp i{display:block;height:100%;border-radius:5px;transition:width 1s ease-out}
.cbt .cbnum{font-size:12px;text-align:right;margin-top:1px}
.cbt .cbdmg{position:absolute;z-index:8;font-size:26px;font-weight:bold;color:#fff;text-shadow:0 2px 0 #000,0 0 6px #000;pointer-events:none;opacity:0;transform:translate(-50%,0)}
.cbt .cbaura{position:absolute;z-index:4;width:130px;height:130px;margin:-65px 0 0 -65px;border-radius:50%;pointer-events:none;opacity:0}
.cbt .cbmsg{position:absolute;left:0;right:0;bottom:0;padding:8px 12px;z-index:5}
@keyframes cbBob{0%,100%{transform:translateY(0) scaleY(1)}50%{transform:translateY(-3px) scaleY(1.025)}}
@keyframes cbCloud{from{left:-30%}to{left:110%}}
@keyframes cbInR{from{transform:translateX(160%)}to{transform:none}}
@keyframes cbInL{from{transform:translateX(-160%)}to{transform:none}}
@keyframes cbFade{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:none}}
@keyframes cbLungeMe{0%{transform:none}35%{transform:translate(calc(var(--k)*20px),calc(var(--k)*-12px))}100%{transform:none}}
@keyframes cbLungeEn{0%{transform:none}35%{transform:translate(calc(var(--k)*-20px),calc(var(--k)*12px))}100%{transform:none}}
@keyframes cbHit{0%{transform:none;filter:none;opacity:1}15%{transform:translateX(-9px);filter:brightness(2.4)}30%{transform:translateX(9px);opacity:.25}45%{transform:translateX(-6px);opacity:1;filter:brightness(1.8)}60%{transform:translateX(5px);opacity:.35}80%{transform:translateX(-2px);opacity:1}100%{transform:none;filter:none}}
@keyframes cbFaint{0%{transform:none;opacity:1}100%{transform:translateY(calc(var(--k)*30px));opacity:0}}
@keyframes cbDmg{0%{opacity:0;transform:translate(-50%,10px) scale(.7)}15%{opacity:1;transform:translate(-50%,0) scale(1.25)}70%{opacity:1;transform:translate(-50%,-26px) scale(1)}100%{opacity:0;transform:translate(-50%,-44px)}}
@keyframes cbAura{0%{opacity:0;transform:scale(.4)}30%{opacity:.85}100%{opacity:0;transform:scale(1.35)}}
`;
const CASTRA_VSCENE_BG = {
  default:   { sky:"linear-gradient(#7fc1e8,#d3ecf7)", g1:"#78b852", g2:"#4f8a3b", hill:"#5f9e49", hill2:"#6aac52", p1:"#9bd070", p2:"#5f9e49", cloud:true },
  silva:     { sky:"linear-gradient(#5a8fb0,#a9cfd9)", g1:"#4f8a3b", g2:"#2f5f2a", hill:"#2f6a35", hill2:"#3a7a40", p1:"#79b25c", p2:"#3f7a38", cloud:true },
  litus:     { sky:"linear-gradient(#8fd0ee,#e8f4f4)", g1:"#e6d197", g2:"#c9ad6a", hill:"#4aa0c8", hill2:"#5db4d8", p1:"#f1e2b0", p2:"#cfb272", cloud:true },
  nilus:     { sky:"linear-gradient(#9bd0ec,#f1ecd0)", g1:"#e0c986", g2:"#bf9f58", hill:"#d3b66e", hill2:"#c9aa60", p1:"#efdca0", p2:"#c9aa60", cloud:true },
  steen:     { sky:"linear-gradient(#8aa3b5,#cdd6dc)", g1:"#a9a8a0", g2:"#7b7a73", hill:"#8c8b84", hill2:"#9a9a92", p1:"#c4c3ba", p2:"#8c8b84", cloud:true },
  grot:      { sky:"linear-gradient(#1b1722,#2c2530)", g1:"#4a4350", g2:"#2f2a36", hill:"#25202b", hill2:"#2e2835", p1:"#625a6c", p2:"#3e3746", cloud:false },
};
const CASTRA_VSCENE_KIND = { silva:"silva", litus:"litus", nilus:"nilus", scamander:"litus", olea:"default", via:"steen", muros:"steen", urbs:"steen", arena:"steen", vicus:"steen", campus:"default", tiberis:"litus",
  catacumbae:"grot", cuniculus:"grot", pyramis:"grot", taygetus:"grot", hercynia:"grot", martis:"grot", sepulcrum:"grot", hannibalis:"grot", labyrinthus:"grot", antrum:"grot", mons:"steen", castra:"steen" };

function castraVSceneBg(V){
  const id = V.terrain && V.terrain.id, B = CASTRA_VSCENE_BG[CASTRA_VSCENE_KIND[id] || "default"];
  return `--sky:${B.sky};--g1:${B.g1};--g2:${B.g2};--hill:${B.hill};--hill2:${B.hill2};--p1:${B.p1};--p2:${B.p2}`;
}
function castraVSceneDuration(V){ const n = (V.fx||[]).length; return n ? 300 + n*1000 + 600 : 400; }

function castraVSceneHTML(V, me, en, mySpr, enSpr, log, menu){
  if(!document.getElementById("castraVSceneCss")){ const st = document.createElement("style"); st.id = "castraVSceneCss"; st.textContent = CASTRA_VSCENE_CSS; document.head.appendChild(st); }
  const play = V.fxRound !== V.round && V.fx && V.fx.length > 0, intro = !V.sceneIntro, swIn = !!V.switchIn; V.fxRound = V.round; V.sceneIntro = true; V.switchIn = false;
  const B = CASTRA_VSCENE_BG[CASTRA_VSCENE_KIND[V.terrain && V.terrain.id] || "default"];
  const fx = play ? V.fx : [], T = i=>(0.3 + i).toFixed(2);
  const hits = { me:null, en:null }, acts = { me:null, en:null }, extra = [];
  fx.forEach((e,i)=>{
    const t = 0.3 + i, tgt = e.w==="me" ? "en" : "me";
    if(e.k==="hit"){ acts[e.w] = t; hits[tgt] = { t:t+0.3, n:e.n, crit:e.crit, mult:e.mult }; }
    else if(e.k==="miss"){ acts[e.w] = t; extra.push({ side:tgt, t:t+0.3, txt:"Fallit", col:"#cfd6dd", size:20 }); }
    else if(e.k==="heal"){ extra.push({ side:e.w, t:t+0.1, txt:"+"+e.n, col:"#7fe08a", size:26 }); extra.push({ side:e.w, t:t, aura:"rgba(110,240,140,.7)" }); }
    else if(e.k==="buff"){ extra.push({ side:e.w, t:t, aura:"rgba(255,215,90,.75)" }); }
    else if(e.k==="guard"){ extra.push({ side:e.w, t:t, aura:"rgba(120,190,255,.75)" }); }
    else if(e.k==="status"){ const st = CASTRA_STATUS[e.s]; extra.push({ side:e.w, t:t, aura:"rgba(190,120,230,.7)" }); extra.push({ side:e.w, t:t+0.1, txt:st.icon+" "+st.la, col:"#e8c8ff", size:20 }); }
    else if(e.k==="stage"){ extra.push({ side:e.w, t:t, aura:e.d>0 ? "rgba(255,215,90,.75)" : "rgba(210,90,90,.7)" }); extra.push({ side:e.w, t:t+0.1, txt:(e.d>0?"⬆ ":"⬇ ")+CASTRA_STAGE_NL[e.stat], col:e.d>0?"#ffe08a":"#ffb0a0", size:18 }); }
    else if(e.k==="dot"){ extra.push({ side:e.w, t:t, aura:"rgba(220,110,60,.6)" }); extra.push({ side:e.w, t:t+0.1, txt:"−"+e.n, col:"#ffb27a", size:22 }); }
  });
  const faint = { me: me.hp<=0, en: en.hp<=0 };
  const pct = (hp,max)=>Math.max(0, Math.min(100, Math.round(100*hp/Math.max(1,max))));
  const col = p=>p>50 ? "#3fae55" : p>20 ? "#e0b030" : "#d04030";
  const box = (S, e, who, style)=>{
    const prev = play && V.prev ? V.prev[who] : S.hp, p0 = pct(prev,S.max), p1 = pct(S.hp,S.max), h = hits[who], d = h ? h.t : 0;
    return `<div class="cbbox" style="${style};${intro?"animation:cbFade .5s ease-out both":""}"><div style="display:flex;justify-content:space-between;gap:6px;align-items:baseline"><span><b>${S.unit.insignis?"✨ ":""}${esc(S.name)}</b>${castraMvStatus(S)}</span>
      <small>${castraLaText("gradus")} ${e.lvl||1} ${CASTRA_MV_ICON[S.type]||""}</small></div>
      <div class="cbhp"><i data-to="${p1}" data-c="${col(p1)}" style="width:${p0}%;background:${col(p0)};transition-delay:${d}s"></i></div><div class="cbnum">${Math.max(0,S.hp)} / ${S.max}</div></div>`;
  };
  const sprite = (who, html, left, top, kInner, inAnim)=>{
    const a = acts[who], h = hits[who], k = `var(--k${who==="me"?"p":"e"})`;
    const lunge = a!=null ? `animation:${who==="me"?"cbLungeMe":"cbLungeEn"} .55s ease-in-out ${a}s both;` : "";
    const hit = h ? `animation:cbHit .6s ease-in-out ${h.t}s both${faint[who] ? `,cbFaint .9s ease-in ${h.t+0.7}s forwards` : ""};` : (faint[who] && !play ? "opacity:0;" : "");
    return `<div class="cbsp" style="left:${left}%;top:${top}%;--k:${k};transform:translate(-50%,-100%) scale(${k})">
      <div style="${(intro || (who==="me" && swIn))?`animation:${inAnim} .7s ease-out both;`:""}"><div style="${hit}"><div style="${lunge}"><div class="cbi" style="animation-delay:${who==="me"?0:-1.3}s"><div class="cbsh"></div>${html}</div></div></div></div></div>`;
  };
  const pos = { en:{ x:73, y:44 }, me:{ x:27, y:90 } };
  const floats = (hits.en ? [{ side:"en", t:hits.en.t, txt:"−"+hits.en.n, col:hits.en.crit?"#ffd23a":"#fff", size:hits.en.crit?34:26, mult:hits.en.mult }] : []).concat(hits.me ? [{ side:"me", t:hits.me.t, txt:"−"+hits.me.n, col:hits.me.crit?"#ffd23a":"#fff", size:hits.me.crit?34:26, mult:hits.me.mult }] : []).concat(extra.filter(x=>x.txt)).map(f=>{
    const p = pos[f.side];
    return `<div class="cbdmg" style="left:${p.x}%;top:${p.y-(f.side==="en"?24:30)}%;font-size:${f.size}px;color:${f.col};animation:cbDmg 1s ease-out ${f.t}s both">${f.txt}${f.mult>1?'<span style="font-size:13px;display:block;color:#7fe08a">optime!</span>':f.mult<1?'<span style="font-size:13px;display:block;color:#e8a090">male</span>':""}</div>`; }).join("");
  const auras = extra.filter(x=>x.aura).map(x=>{ const p = pos[x.side]; return `<div class="cbaura" style="left:${p.x}%;top:${p.y-10}%;background:radial-gradient(circle,${x.aura},transparent 70%);animation:cbAura .9s ease-out ${x.t}s both"></div>`; }).join("");
  const lines = V.log.slice(-3).map((l,i)=>`<div style="padding:2px 0;${play?`animation:cbFade .4s ease-out ${(0.3+i*0.5).toFixed(2)}s both`:""}">${l}</div>`).join("");
  return `<div class="panel" style="padding:10px">
    <div id="castraVScene" class="cbt" style="${castraVSceneBg(V)}">
      <div class="cbh"></div>${B.cloud?`<div class="cbc" style="top:8%;left:10%"></div><div class="cbc" style="top:20%;left:60%;animation-duration:55s;transform:scale(.7)"></div>`:""}<div class="cbg"></div>
      <div class="cbpf" style="left:${pos.en.x}%;top:${pos.en.y}%;width:calc(var(--ke)*120px);height:calc(var(--ke)*26px)"></div>
      <div class="cbpf" style="left:${pos.me.x}%;top:${pos.me.y-3}%;width:calc(var(--kp)*130px);height:calc(var(--kp)*30px)"></div>
      ${sprite("en", enSpr, pos.en.x, pos.en.y, 0, "cbInR")}${sprite("me", mySpr, pos.me.x, pos.me.y-4, 0, "cbInL")}
      ${box(en, V.enemy, "en", "left:3%;top:5%")}${box(me, V.mine, "me", "right:3%;bottom:20%")}
      ${auras}${floats}
      <div class="cbmsg"><div style="background:rgba(25,18,10,.88);border:2px solid #c9a24a;border-radius:10px;padding:8px 12px;color:#f3e6bd;font-size:15px;min-height:50px">${lines}</div></div>
    </div>
    <div id="castraVMenu" style="margin-top:8px;${play?`opacity:.35;pointer-events:none;transition:opacity .3s`:""}">${menu}</div></div>`;
}

// Schaal de strijders naar de grootte van de scène en laat de levensbalken zacht leeglopen.
function castraVSceneFit(){
  const s = document.getElementById("castraVScene"); if(!s) return;
  const w = s.clientWidth, h = s.clientHeight, ke = Math.max(1, Math.min(2.2, h*0.40/96, w*0.30/96)), kp = Math.min(ke*1.35, h*0.62/96, w*0.38/96);   // de vijand (rechtsboven) past boven zijn platform, jouw eenheid is groter
  s.style.setProperty("--ke", ke.toFixed(2)); s.style.setProperty("--kp", kp.toFixed(2));
}
function castraVSceneAfter(){
  castraVSceneFit();
  document.querySelectorAll("#castraVScene .cbhp i").forEach(i=>{ requestAnimationFrame(()=>requestAnimationFrame(()=>{ i.style.width = i.dataset.to+"%"; i.style.background = i.dataset.c; })); });
  const V = CASTRA_V, m = document.getElementById("castraVMenu");
  if(V && m && m.style.pointerEvents==="none") setTimeout(()=>{ const mm = document.getElementById("castraVMenu"); if(mm){ mm.style.opacity = ""; mm.style.pointerEvents = ""; } }, castraVSceneDuration(V));
}
const _castraVRenderScn0 = castraVRender;
castraVRender = function(stage){
  const r = _castraVRenderScn0.apply(this, arguments);
  if(stage==="battle"){ try{ castraVSceneAfter(); }catch(e){ console.error(e); } }
  return r;
};
window.addEventListener("resize", ()=>{ try{ castraVSceneFit(); }catch(_){} });
