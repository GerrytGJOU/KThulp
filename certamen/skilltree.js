/* ============================================================================
   SKILL-TREES — scherm, opslag en beheerderschakelaar
   ----------------------------------------------------------------------------
   Data: skilltree-data.js (BM_SKILLTREES). Ontwerp + balans: zie het
   commentaarblok daar en certamen/tools/skilltree-balance.js.
   - Aan/uit: standaard AAN (live sinds 2026-10-06). config/skillTrees/enabled
     (alleen een beheerder mag schrijven, iedereen mag lezen — database.rules.json)
     is alleen nog een noodrem: alleen enabled:false zet ze uit. Staan ze uit,
     dan ziet alleen een ingelogde beheerder de skill-trees; leerlingen niet.
   - Keuzes per klasse: identities/{klas}/{lid}/skillTrees/{cls}/picks
     ({1:"A",…,4:"B", 6:"<node-id>",…,9:…, 10:"<prestige-id>"}), lokaal gespiegeld
     in BM_IDENT.skillTrees. Respec is gratis, maar niet tijdens een lopend gevecht.
   - Welke sterren open zijn, volgt uit de klassebeheersing (bmCalcMastery).
   - Bereikbaar via "Mijn profiel" (battleProfile) en via de klassekeuze in de
     lobby (battlePlayerLobby). Terug via BM_ST_RETURN.
   ============================================================================ */
// Zolang de effecten nog niet in de gevechtsengine zitten, kan de beheerder de
// skill-trees wel bekijken maar niet aanzetten voor leerlingen.
const BM_ST_ENGINE_READY=true;
let BM_ST_ENABLED=true;          // standaard AAN (live sinds 2026-10-06); config/skillTrees/enabled=false is de noodrem
let BM_ST_ADMIN=false;           // ingelogde beheerder: mag ook kijken als het uit staat
let BM_ST_CLASS="hopliet";
let BM_ST_RETURN="battleProfile";
let BM_ST_PICKS={};              // werkkopie voor de open klasse
let BM_ST_DIRTY=false;
let BM_ST_IMG_OK={};
let BM_ST_HOVER=null;

/* ---- aan/uit ---- */
async function bmSkillTreesLoadFlag(){
  try{
    if(!fbDB && !(typeof initFirebase==="function" && initFirebase())) return BM_ST_ENABLED;
    const v=(await fbDB.ref("config/skillTrees").once("value")).val();
    // alleen een expliciete enabled:false zet ze uit; ontbreekt de instelling, dan aan
    BM_ST_ENABLED=!(v&&v.enabled===false);
  }catch(e){ /* niet te lezen → laten zoals het is (aan) */ }
  try{
    if(typeof teacherNet==="function" && teacherNet().isTeacherLoggedIn()) BM_ST_ADMIN=!!(await teacherNet().isAdmin());
  }catch(e){}
  return BM_ST_ENABLED;
}
function bmSkillTreesOn(){ return BM_ST_ENABLED===true; }
function bmSkillTreesVisible(){ return BM_ST_ENABLED===true || BM_ST_ADMIN; }
async function bmSkillTreesSetEnabled(on){
  await fbDB.ref("config/skillTrees").set({enabled:!!on, at:Date.now()});
  BM_ST_ENABLED=!!on;
}

/* ---- opslag ---- */
function bmStStars(cls){ return (typeof bmCalcMastery==="function")?bmCalcMastery(BM_IDENT?.classHistory?.[cls]):0; }
function bmStLoadPicks(cls){ return {...((BM_IDENT?.skillTrees||{})[cls]?.picks||{})}; }
// Aantal keuzes dat met de huidige sterren open staat (lobby-knop, statusregel).
function bmStOpenCount(cls,picks,stars){
  const eff=bmStEffectivePicks(cls,picks||{},stars||0), path=skilltreePathOf(eff);
  return [1,2,3,4,6,7,8,9,10].filter(s=>s<=(stars||0)&&!eff[s]&&!(s>=6&&!path)).length;
}
// Keuzes die (nog) niet mogen gelden niet meetellen: te weinig sterren, of niet
// op het huidige pad. Gebruikt door het scherm én (later) door de engine.
function bmStEffectivePicks(cls,picks,stars){
  const t=BM_SKILLTREES[cls]; if(!t) return {};
  const out={};
  for(let s=1;s<=4;s++) if(s<=stars&&(picks[s]==="A"||picks[s]==="B")) out[s]=picks[s];
  const p=skilltreePathOf(out);
  if(p) for(let s=6;s<=9;s++) if(s<=stars&&skilltreeOptionsFor(t,p,s).some(n=>n.id===picks[s])) out[s]=picks[s];
  if(p&&stars>=10&&t.prestige.some(v=>v.id===picks[10])) out[10]=picks[10];
  return out;
}
function bmStInFight(){ return typeof bmRoomPlaying==="function" && bmRoomPlaying(); }
async function bmStSave(){
  if(!BM_IDENT||!BM_ST_DIRTY) return;
  const cls=BM_ST_CLASS, picks={...BM_ST_PICKS};
  Object.keys(picks).forEach(k=>{ if(picks[k]==null) delete picks[k]; });
  BM_IDENT={...BM_IDENT, skillTrees:{...(BM_IDENT.skillTrees||{}), [cls]:{picks, at:Date.now()}}};
  try{ bmIdentSave({...bmIdentLoad(),...BM_IDENT}); }catch(e){}
  BM_ST_DIRTY=false;
  try{
    if(fbDB){ const{klascode:klas,leerlingcode:lcode}=BM_IDENT;
      await fbDB.ref("identities/"+klas+"/"+lcode+"/skillTrees/"+cls).set({picks, at:Date.now()}); }
  }catch(e){ toast("Lokaal opgeslagen","Je keuzes staan op dit toestel, maar zijn niet gesynchroniseerd."); }
}
// Aangeroepen door de kamer-wachter (battle.js) vlak voordat hij de leerling
// het gevecht in trekt: open keuzes niet kwijtraken.
function bmSkillTreeAutoSave(){ if(_screen==="skillTree") bmStSave(); }
function bmOpenSkillTree(cls,ret){
  BM_ST_CLASS=cls||BM_ST_CLASS; BM_ST_RETURN=ret||_screen||"battleProfile";
  go("skillTree");
}

/* ---- scherm ---- */
SCREENS.skillTree = function(){
  if(!BM_IDENT){ const c=(typeof bmIdentLoad==="function")?bmIdentLoad():null; if(c) BM_IDENT=c; }
  if(!BM_IDENT){ go("battleIdentity"); return; }
  if(!BM_SKILLTREES[BM_ST_CLASS]) BM_ST_CLASS=Object.keys(BM_SKILLTREES)[0];
  BM_ST_PICKS=bmStLoadPicks(BM_ST_CLASS); BM_ST_DIRTY=false; BM_ST_HOVER=null;
  bmStInjectStyle();
  const t=BM_SKILLTREES[BM_ST_CLASS], cls=BM_CLASSES.find(c=>c.id===BM_ST_CLASS);
  const stars=bmStStars(BM_ST_CLASS), locked=bmStInFight();
  const back=`bmStSave();go('${BM_ST_RETURN}')`;
  H(brand(false)+`
  <div class="scrhead"><button class="back" onclick="${back}">${iconSVG("shield",20,"currentColor")}</button><h2>Skill-tree</h2></div>
  ${!bmSkillTreesOn()?`<div class="panel note" style="border-color:var(--hi-dim)">👁 Alleen zichtbaar voor de beheerder: de skill-trees staan nog <b>uit</b> voor leerlingen.</div>`:""}
  <div class="bmst-classes">${BM_CLASSES.map(c=>`<button class="chip" style="${c.id===BM_ST_CLASS?"border:2px solid "+c.color+";color:#f3e9d2;background:"+c.color+"33;font-weight:700":""}"
      onclick="bmStSave();BM_ST_CLASS='${c.id}';SCREENS.skillTree()">${iconSVG(c.icon,14,"currentColor")} ${esc(bmClsName?bmClsName(c.id):c.nm)} <span style="opacity:.75">${bmStars(bmStStars(c.id))}</span></button>`).join("")}</div>
  <div class="panel" style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
    <div style="flex:1;min-width:200px">
      <div style="font-weight:700;color:${cls?.color||"var(--hi)"}">${esc(t.nm)} · ${bmStars(stars)}</div>
      <div class="note" id="bmStStatus"></div>
    </div>
    ${locked?`<div class="pill">🔒 Tijdens een gevecht kun je niets wijzigen</div>`
      :`<button class="btn btn-ghost" onclick="bmStRespec()">↺ Opnieuw kiezen (gratis)</button>`}
  </div>
  <div class="bmst-box" id="bmStBox"><svg class="bmst-tree" id="bmStTree" viewBox="0 0 1000 1300" role="img" aria-label="Skill-tree ${esc(t.nm)}"></svg><div class="bmst-tip" id="bmStTip" role="tooltip"></div></div>
  <div class="note" style="text-align:center;margin:8px 0 16px">Sterren verdien je door met deze klasse te spelen. Elke ster opent een nieuwe keuze; bij ★10 kies je je prestige-vaardigheid.</div>
  <div class="panel bmst-actbox" id="bmStActions"></div>
  ${foot()}`);
  bmStProbeIcons();
  bmStRender();
};
function bmStRespec(){
  if(bmStInFight()){ toast("Even wachten","Opnieuw kiezen kan alleen tussen gevechten."); return; }
  if(!confirm("Alle keuzes in deze boom wissen? Je kunt daarna gratis opnieuw kiezen.")) return;
  BM_ST_PICKS={}; BM_ST_DIRTY=true; bmStSave(); bmStRender();
}

/* ---- tekenen (overgenomen uit tools/skilltree-preview.html) ---- */
const BMST_NS="http://www.w3.org/2000/svg", BMST_DIM="#4a3d2c";
const BMST_Y_ID={1:1110,2:1020,3:930,4:840}, BMST_XA=380, BMST_XB=620;
const BMST_ROOT={x:500,y:1220}, BMST_MASTER={x:500,y:740};
const BMST_BRX={A:180,H:500,B:820}, BMST_BRDX=62, BMST_YP={6:580,7:490,8:400,9:310};
const BMST_YFORK=660, BMST_YPRES=148, BMST_XPRES={A:330,B:670};
function bmStEl(tag,attrs,parent){ const e=document.createElementNS(BMST_NS,tag); for(const k in attrs) e.setAttribute(k,attrs[k]); if(parent) parent.appendChild(e); return e; }
function bmStHex(cx,cy,r){ const p=[]; for(let i=0;i<6;i++){ const a=Math.PI/180*(60*i-90); p.push((cx+r*Math.cos(a)).toFixed(1)+","+(cy+r*Math.sin(a)).toFixed(1)); } return p.join(" "); }
function bmStPath(){ return skilltreePathOf(BM_ST_PICKS); }
function bmStProbeIcons(){
  const t=BM_SKILLTREES[BM_ST_CLASS];
  const nodes=[t.root,t.master,...t.identity.flatMap(r=>[r.A,r.B]),...["A","B"].flatMap(p=>t.pathNodes[p].flatMap(r=>[r.a,r.b])),...t.prestige];
  nodes.forEach(n=>{ if(!n.icon||n.icon in BM_ST_IMG_OK) return; BM_ST_IMG_OK[n.icon]=false;
    const im=new Image(); im.onload=()=>{ BM_ST_IMG_OK[n.icon]=true; if(_screen==="skillTree") bmStRender(); }; im.src="assets/skills/"+n.icon; });
}
// Een perfect rechte lijn/curve (x1===x2 of y1===y2) heeft een bounding box met
// breedte of hoogte 0: het gewone gloed-filter (objectBoundingBox-eenheden)
// heeft dan een leeg gebied en de lijn verdwijnt juist als hij oplicht. Zulke
// lijnen — o.a. de verticale curve naar het middelste (hybride) pad — krijgen
// daarom een filter met vaste coördinaten (bmStGlowU).
function bmStGlowFor(x1,y1,x2,y2){ return (x1===x2||y1===y2)?"url(#bmStGlowU)":"url(#bmStGlow)"; }
function bmStLine(g,x1,y1,x2,y2,color,lit,dash){
  bmStEl("line",{x1,y1,x2,y2,stroke:lit?color:BMST_DIM,"stroke-width":lit?3.5:2,"stroke-dasharray":dash||"","stroke-linecap":"round",opacity:lit?1:.7,filter:lit?bmStGlowFor(x1,y1,x2,y2):""},g);
}
function bmStCurve(g,x1,y1,x2,y2,color,lit){
  const my=(y1+y2)/2;
  bmStEl("path",{d:`M${x1},${y1} C${x1},${my} ${x2},${my} ${x2},${y2}`,fill:"none",stroke:lit?color:BMST_DIM,"stroke-width":lit?5:2.5,opacity:lit?1:.6,filter:lit?bmStGlowFor(x1,y1,x2,y2):""},g);
}
let BM_ST_CLIP_N=0;
function bmStNode(g,x,y,n,color,state,onPick,meta){
  const t=BM_SKILLTREES[BM_ST_CLASS];
  const r=state==="fixed"&&n===t.root?40:34, nkey=(n.id||n.nm)+"@"+x;
  const grp=bmStEl("g",{class:"bmst-node",tabindex:0,role:"button","aria-label":n.nm,"data-key":nkey},g);
  const lit=state==="chosen"||state==="fixed", col=lit||state==="open"?color:BMST_DIM;
  bmStEl("polygon",{points:bmStHex(x,y,r+5),fill:"none",stroke:col,"stroke-width":lit?2:1,opacity:lit?.9:state==="open"?.6:.4},grp);
  bmStEl("polygon",{points:bmStHex(x,y,r),fill:lit?"url(#bmStFillLit)":"#1c150f",stroke:col,"stroke-width":lit?3:2,filter:lit?"url(#bmStGlow)":"",opacity:state==="locked"?.45:1},grp);
  if(lit) bmStEl("polygon",{points:bmStHex(x,y,r),fill:color,opacity:.18},grp);
  if(n.icon&&BM_ST_IMG_OK[n.icon]){
    // Iconen zijn gekleurde tegels (Gemini-vellen): binnen de zeshoek knippen,
    // zodat de tegel de hele zeshoek vult en de rand zichtbaar blijft.
    const cid="bmStClip"+(++BM_ST_CLIP_N), svgDefs=g.ownerSVGElement?.querySelector("defs");
    if(svgDefs){ const cp=bmStEl("clipPath",{id:cid},svgDefs); bmStEl("polygon",{points:bmStHex(x,y,r-1.5)},cp); }
    const sz=r*2;
    bmStEl("image",{href:"assets/skills/"+n.icon,x:x-sz/2,y:y-sz/2,width:sz,height:sz,"clip-path":svgDefs?`url(#${cid})`:"",preserveAspectRatio:"xMidYMid slice",opacity:state==="locked"?.3:state==="closed"?.45:1},grp);
  } else {
    const tx=bmStEl("text",{x,y:y+1,"text-anchor":"middle","dominant-baseline":"central","font-size":r*.85,fill:lit?"#fff6dc":state==="open"?color:"#6b5b45",opacity:state==="locked"?.5:1},grp);
    tx.textContent=(n.glyph||"?")+"︎";
  }
  if(state==="locked"){ const tx=bmStEl("text",{x:x+r*.62,y:y-r*.6,"font-size":15,fill:"#8a7a5c","text-anchor":"middle"},grp); tx.textContent="🔒"; }
  const lbl=bmStEl("text",{x,y:y+r+18,"text-anchor":"middle","font-size":14,fill:lit?"#f3e9d2":state==="open"?"#d9c9a3":"#7d6d52","font-weight":lit?700:400},grp);
  lbl.textContent=n.nm;
  const show=()=>{ BM_ST_HOVER=nkey; bmStShowTip(grp,n,meta,state,color); };
  grp._tip=()=>bmStShowTip(grp,n,meta,state,color);
  grp.addEventListener("mouseenter",show); grp.addEventListener("focus",show);
  grp.addEventListener("mouseleave",bmStHideTip); grp.addEventListener("blur",bmStHideTip);
  grp.addEventListener("click",()=>{ show(); if(onPick&&(state==="open"||state==="chosen")){
    if(bmStInFight()){ toast("Even wachten","Tijdens een gevecht kun je je skill-tree niet wijzigen."); return; }
    onPick(); BM_ST_DIRTY=true; bmStSave(); bmStRender(); } });
  grp.addEventListener("keydown",e=>{ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); grp.dispatchEvent(new Event("click")); } });
}
function bmStGrad(defs,tag,id,attrs,stops){ const g=bmStEl(tag,Object.assign({id},attrs),defs); stops.forEach(([o,c,a])=>bmStEl("stop",{offset:o,"stop-color":c,"stop-opacity":a},g)); }
function bmStDrawTemple(svg,defs){
  const STONE="#2a2117", STONE2="#33281c", LINE="#4e3c28", GOLD="#d4af37";
  bmStGrad(defs,"radialGradient","bmStTGlow",{cx:"50%",cy:"10%",r:"70%"},[["0%",GOLD,.15],["45%",GOLD,.04],["100%",GOLD,0]]);
  bmStGrad(defs,"linearGradient","bmStTRay",{x1:0,y1:0,x2:0,y2:1},[["0%",GOLD,.2],["65%",GOLD,.07],["100%",GOLD,0]]);
  bmStGrad(defs,"linearGradient","bmStTRaySide",{x1:0,y1:0,x2:0,y2:1},[["0%",GOLD,.26],["55%",GOLD,.11],["100%",GOLD,.01]]);
  bmStGrad(defs,"linearGradient","bmStTCol",{x1:0,y1:0,x2:1,y2:0},[["0%","#18120c",1],["40%","#3a2d20",1],["60%","#3a2d20",1],["100%","#150f0a",1]]);
  bmStGrad(defs,"radialGradient","bmStTVign",{cx:"50%",cy:"55%",r:"75%"},[["55%","#000",0],["100%","#000",.45]]);
  const bg=bmStEl("g",{"aria-hidden":"true"},svg);
  bmStEl("rect",{x:0,y:0,width:1000,height:1300,fill:"url(#bmStTGlow)"},bg);
  const column=(cx,w,op)=>{ const g=bmStEl("g",{opacity:op},bg), top=282, bot=1226, tw=w*.84;
    bmStEl("rect",{x:cx-w/2-9,y:252,width:w+18,height:10,fill:STONE2,stroke:LINE,"stroke-width":1},g);
    bmStEl("polygon",{points:`${cx-w/2-6},262 ${cx+w/2+6},262 ${cx+tw/2},${top} ${cx-tw/2},${top}`,fill:STONE2,stroke:LINE,"stroke-width":1},g);
    bmStEl("polygon",{points:`${cx-tw/2},${top} ${cx+tw/2},${top} ${cx+w/2},${bot} ${cx-w/2},${bot}`,fill:"url(#bmStTCol)",stroke:LINE,"stroke-width":1},g);
    for(let i=1;i<6;i++){ const ft=cx-tw/2+tw*i/6, fb=cx-w/2+w*i/6; bmStEl("line",{x1:ft,y1:top+4,x2:fb,y2:bot-4,stroke:"#0c0906","stroke-width":1.4,opacity:.7},g); }
    bmStEl("rect",{x:cx-w/2-5,y:bot,width:w+10,height:12,rx:3,fill:STONE2,stroke:LINE,"stroke-width":1},g); };
  column(50,48,1); column(950,48,1); column(340,40,.55); column(660,40,.55);
  bmStEl("rect",{x:22,y:200,width:956,height:10,fill:STONE2,stroke:LINE,"stroke-width":1},bg);
  bmStEl("rect",{x:30,y:210,width:940,height:26,fill:STONE,stroke:LINE,"stroke-width":1},bg);
  for(let x=44;x<960;x+=58){ const g=bmStEl("g",{},bg); bmStEl("rect",{x,y:212,width:22,height:22,fill:STONE2,stroke:LINE,"stroke-width":.8},g);
    [x+7,x+15].forEach(gx=>bmStEl("line",{x1:gx,y1:213,x2:gx,y2:233,stroke:"#0c0906","stroke-width":2},g)); }
  bmStEl("rect",{x:30,y:236,width:940,height:16,fill:STONE2,stroke:LINE,"stroke-width":1},bg);
  let d=""; for(let x=40;x<956;x+=16){ d+=`M${x},248 v-9 h12 v6 h-6 v-3 `; }
  bmStEl("path",{d,fill:"none",stroke:GOLD,"stroke-width":1.2,opacity:.24},bg);
  bmStEl("polygon",{points:"14,200 500,38 986,200",fill:STONE2,stroke:LINE,"stroke-width":1.5},bg);
  bmStEl("polygon",{points:"78,192 500,56 922,192",fill:STONE,stroke:GOLD,"stroke-width":1,"stroke-opacity":.22},bg);
  [[500,38],[14,200],[986,200]].forEach(([x,y])=>{ const g=bmStEl("g",{opacity:.5},bg);
    bmStEl("path",{d:`M${x},${y-4} q-10,-10 -6,-24 q6,8 6,4 q0,4 6,-4 q4,14 -6,24 z`,fill:STONE2,stroke:GOLD,"stroke-width":.8,"stroke-opacity":.35},g); });
  [[24,1238,952,16],[12,1254,976,20],[0,1274,1000,26]].forEach(([x,y,w,h])=>{
    bmStEl("rect",{x,y,width:w,height:h,fill:STONE2,stroke:LINE,"stroke-width":1},bg);
    bmStEl("line",{x1:x+2,y1:y+.5,x2:x+w-2,y2:y+.5,stroke:GOLD,"stroke-width":1,opacity:.16},bg); });
  const rays=bmStEl("g",{class:"bmst-rays"},bg);
  [["A",452,482],["H",485,515],["B",518,548]].forEach(([k,a,b])=>{ const cx=BMST_BRX[k], hw=k==="H"?100:112;
    bmStEl("polygon",{points:`${a},200 ${b},200 ${cx+hw},${BMST_YFORK+40} ${cx-hw},${BMST_YFORK+40}`,fill:k==="H"?"url(#bmStTRay)":"url(#bmStTRaySide)",opacity:k==="H"?.8:1},rays); });
  const motes=bmStEl("g",{class:"bmst-motes"},bg);
  let seed=7; const rnd=()=>(seed=(seed*9301+49297)%233280)/233280;
  for(let i=0;i<22;i++) bmStEl("circle",{cx:300+rnd()*400,cy:300+rnd()*900,r:.8+rnd()*1.6,fill:GOLD,opacity:.25+rnd()*.3,style:`animation-duration:${14+rnd()*16}s;animation-delay:-${rnd()*20}s`},motes);
  bmStEl("rect",{x:0,y:0,width:1000,height:1300,fill:"url(#bmStTVign)"},bg);
}
function bmStRender(){
  const svg=document.getElementById("bmStTree"); if(!svg) return;
  const t=BM_SKILLTREES[BM_ST_CLASS], P=BM_ST_PICKS, STARS=bmStStars(BM_ST_CLASS);
  if(!svg._init){
    svg.innerHTML="";
    const defs=bmStEl("defs",{},svg);
    const f=bmStEl("filter",{id:"bmStGlow",x:"-50%",y:"-50%",width:"200%",height:"200%"},defs);
    bmStEl("feGaussianBlur",{stdDeviation:"4",result:"b"},f);
    const m=bmStEl("feMerge",{},f); bmStEl("feMergeNode",{in:"b"},m); bmStEl("feMergeNode",{in:"SourceGraphic"},m);
    const fu=bmStEl("filter",{id:"bmStGlowU",filterUnits:"userSpaceOnUse",x:"-100",y:"-100",width:"1200",height:"1500"},defs);
    bmStEl("feGaussianBlur",{stdDeviation:"4",result:"b"},fu);
    const mu=bmStEl("feMerge",{},fu); bmStEl("feMergeNode",{in:"b"},mu); bmStEl("feMergeNode",{in:"SourceGraphic"},mu);
    const lg=bmStEl("radialGradient",{id:"bmStFillLit"},defs);
    bmStEl("stop",{offset:"0%","stop-color":"#3a2c1c"},lg); bmStEl("stop",{offset:"100%","stop-color":"#140e09"},lg);
    bmStDrawTemple(svg,defs); bmStEl("g",{id:"bmStDyn"},svg); svg._init=true;
  }
  const dyn=document.getElementById("bmStDyn"); dyn.innerHTML="";
  const gL=bmStEl("g",{},dyn), gN=bmStEl("g",{},dyn);
  const p=bmStPath(), gold=t.paths.H.accent, colOf=k=>t.paths[k].accent;
  const starLbl=(y,s)=>{ const tx=bmStEl("text",{x:24,y:y+5,"font-size":15,fill:s<=STARS?"#d4af37":"#5b4c37"},gL); tx.textContent="★"+s; };
  [1,2,3,4].forEach(s=>starLbl(BMST_Y_ID[s],s)); starLbl(BMST_MASTER.y,5); [6,7,8,9].forEach(s=>starLbl(BMST_YP[s],s)); starLbl(BMST_YPRES,10);
  const idState=(s,side)=>s>STARS?"locked":P[s]===side?"chosen":"open";
  bmStLine(gL,BMST_ROOT.x,BMST_ROOT.y,BMST_XA,BMST_Y_ID[1],colOf("A"),P[1]==="A");
  bmStLine(gL,BMST_ROOT.x,BMST_ROOT.y,BMST_XB,BMST_Y_ID[1],colOf("B"),P[1]==="B");
  [1,2,3,4].forEach(s=>{
    bmStLine(gL,BMST_XA+40,BMST_Y_ID[s],BMST_XB-40,BMST_Y_ID[s],gold,false,"4 6");
    const tx=bmStEl("text",{x:500,y:BMST_Y_ID[s]-8,"text-anchor":"middle","font-size":12,fill:"#6b5b45"},gL); tx.textContent="of";
    if(s<4) [["A",BMST_XA],["B",BMST_XB]].forEach(([side,x])=>[["A",BMST_XA],["B",BMST_XB]].forEach(([ns,nx])=>
      bmStLine(gL,x,BMST_Y_ID[s],nx,BMST_Y_ID[s+1],side===ns?colOf(side):gold,P[s]===side&&P[s+1]===ns)));
  });
  bmStLine(gL,BMST_XA,BMST_Y_ID[4],BMST_MASTER.x,BMST_MASTER.y,colOf("A"),P[4]==="A"&&STARS>=5);
  bmStLine(gL,BMST_XB,BMST_Y_ID[4],BMST_MASTER.x,BMST_MASTER.y,colOf("B"),P[4]==="B"&&STARS>=5);
  ["A","H","B"].forEach(k=>{
    bmStCurve(gL,BMST_MASTER.x,BMST_MASTER.y,BMST_BRX[k],BMST_YFORK,colOf(k),p===k&&STARS>=6);
    const lbl=bmStEl("text",{x:BMST_BRX[k],y:BMST_YFORK+30,"text-anchor":"middle","font-size":17,"letter-spacing":"3",fill:p===k?colOf(k):"#6b5b45","font-weight":700},gL);
    lbl.textContent=t.paths[k].nm.toUpperCase();
    bmStLine(gL,BMST_BRX[k],BMST_YFORK,BMST_BRX[k],BMST_YP[9],colOf(k),p===k&&STARS>=6);
  });
  ["A","H","B"].forEach(k=>{
    [6,7,8,9].forEach(s=>{
      skilltreeOptionsFor(t,k,s).forEach((n,i)=>{
        // De "a"-optie (die ook in het hybride pad staat) staat steeds aan de
        // binnenkant, naast de middelste kolom: links dus rechts, rechts links.
        const inner=i===0, dx=(k==="A"?(inner?1:-1):(inner?-1:1))*BMST_BRDX;
        const x=BMST_BRX[k]+dx, y=BMST_YP[s], chosen=p===k&&P[s]===n.id;
        bmStLine(gL,BMST_BRX[k],y,x,y,colOf(k),chosen);
        let state="closed"; if(s>STARS) state="locked"; else if(p===k) state=chosen?"chosen":"open";
        const c=k==="H"?(i===0?colOf("A"):colOf("B")):colOf(k);
        bmStNode(gN,x,y,n,c,state,()=>{ P[s]=P[s]===n.id?undefined:n.id; },
          {star:s,where:t.paths[k].nm+(k==="H"?" (uit "+(i===0?t.paths.A.nm:t.paths.B.nm)+")":"")});
      });
    });
    ["A","B"].forEach(v=>{ const pv=t.prestige.find(x=>x.path===v);
      bmStLine(gL,BMST_BRX[k],BMST_YP[9],BMST_XPRES[v],BMST_YPRES,colOf(v),p===k&&P[10]===pv.id&&STARS>=10,p===k?"":"3 7"); });
  });
  t.prestige.forEach(v=>{
    const state=STARS<10?"locked":!p?"closed":P[10]===v.id?"chosen":"open";
    bmStNode(gN,BMST_XPRES[v.path],BMST_YPRES,v,colOf(v.path),state,()=>{ P[10]=P[10]===v.id?undefined:v.id; },{star:10,where:"Prestige-vaardigheid ("+v.cost+" AP)"});
  });
  const pt=bmStEl("text",{x:500,y:BMST_YPRES-52,"text-anchor":"middle","font-size":15,"letter-spacing":"3",fill:STARS>=10?"#d4af37":"#5b4c37"},gL); pt.textContent="PRESTIGE";
  t.identity.forEach(r=>[["A",BMST_XA],["B",BMST_XB]].forEach(([side,x])=>
    bmStNode(gN,x,BMST_Y_ID[r.star],r[side],colOf(side),idState(r.star,side),()=>{ P[r.star]=P[r.star]===side?undefined:side; bmStCleanAfterPathChange(); },
      {star:r.star,where:"Keuze → "+t.paths[side].nm})));
  bmStNode(gN,BMST_MASTER.x,BMST_MASTER.y,t.master,gold,STARS>=5?"fixed":"locked",null,{star:5,where:"Vast (geen keuze)"});
  bmStNode(gN,BMST_ROOT.x,BMST_ROOT.y,t.root,t.color||"#2e6fb0","fixed",null,{star:0,where:"Klasse"});
  bmStRenderStatus(STARS);
  bmStActionsRender();
  if(BM_ST_HOVER){ const g=svg.querySelector('g.bmst-node[data-key="'+CSS.escape(BM_ST_HOVER)+'"]'); if(g&&g._tip) g._tip(); else bmStHideTip(); }
}
/* ---- Acties in het gevecht (onder de boom) ----
   Per vaardigheid de waarden mét de nu geldende keuzes doorgerekend (vaste
   bonussen in het getal, voorwaardelijke als regel eronder). Spiegelt
   bmCalcAbilityEffect/bmGetAbilityCost (battle.js) + bmStApplyEffect/bmStCost
   (skilltree-engine.js); situaties die van de ronde afhangen (snel antwoord,
   achterstand, merkteken, …) staan als tekst, niet in het getal. */
const BMST_SHIELD_T=["team_shield","testudo","attack_and_defend","shield_and_heal"];
const BMST_HEAL_T=["heal","heal_and_attack","shield_and_heal","testudo"];
const BMST_REM_T=["shield_remove","attack_and_shld_remove","attack_siege"];
function bmStAbilityStats(cls,abl,stars,pay){
  const pas=cls.passive||{}, master=stars>=5, pv=master&&pas.masterVal!=null?pas.masterVal:(pas.val||0);
  const t=abl.type, isDmg=BM_DMG_TYPES.includes(t);
  const b={dmg:0,heal:0,shld:0,teamBE:0,shldRemove:0,selfBE:0,cost:abl.cost||0};
  if(isDmg){ b.dmg=abl.dmg||0; if(pas.type==="atk_flat") b.dmg+=pv; if(pas.type==="atk_bonus") b.dmg=Math.round(b.dmg*(1+pv)); if(pas.type==="shld_pierce") b.shldRemove+=pv; }
  if(BMST_SHIELD_T.includes(t)) b.shld=abl.shld||0;
  if(BMST_HEAL_T.includes(t)){ b.heal=abl.heal||0; if(pas.type==="heal_flat") b.heal+=pv; }
  if(["team_be","testudo"].includes(t)) b.teamBE=abl.teamBE||0;
  if(BMST_REM_T.includes(t)) b.shldRemove+=abl.shldRemove||0;
  if(abl.selfBE) b.selfBE+=abl.selfBE;
  if(["team_shield","testudo"].includes(t)&&pas.type==="be_on_defend") b.selfBE+=pv;
  if(pas.type==="cost_reduce"&&(master&&pas.masterTiers||["basic"]).includes(abl.tier)) b.cost=Math.max(1,b.cost-pv);
  const n={...b}, nodes=pay?pay.nodes:[], has=id=>nodes.includes(id), N=id=>BM_ST_NODE[cls.id]?.[id];
  const mods=nodes.map(N).filter(x=>x&&x.fx&&x.fx.type==="ability_mod"&&(x.fx.ability===abl.id||(x.fx.abilities||[]).includes(abl.id)));
  const sum=k=>mods.reduce((s,x)=>s+(typeof x.fx[k]==="number"?x.fx[k]:0),0);
  n.dmg+=sum("dmg"); n.heal+=sum("heal"); n.shld+=sum("shld"); n.teamBE+=sum("teamBE"); n.shldRemove+=sum("shldRemove"); n.cost+=sum("cost");
  if(isDmg&&!abl.aoe&&n.dmg>0&&has("vaste_hand")) n.dmg+=1;
  if(has("ondermijnen")&&["verkenning","sabotage","ontwapenen"].includes(abl.id)) n.dmg+=3;
  if(isDmg&&n.dmg>0&&has("levensroof")) n.heal+=has("dorst")?2:1;
  if(n.heal>0&&has("epidauros")) n.heal+=1;
  if(n.heal>0&&has("lichtmantel")) n.shld+=Math.min(4,Math.floor(n.heal/4));
  for(const id of nodes){ const f=N(id)?.fx; if(!f) continue;
    if(f.type==="shield_per_ally_counts_basic"&&f.ability===abl.id&&f.cost) n.cost+=f.cost;
    if(f.type==="sabotage_layers"&&abl.id==="sabotage"&&f.sabotageCost) n.cost+=f.sabotageCost; }
  if(b.cost>0) n.cost=Math.max(1,n.cost);
  const bypass=t==="attack_bypass"||!!abl.bypass||mods.some(x=>x.fx.bypass);
  // knooppunten die deze actie in de ronde zelf nog extra kunnen geven
  const extra=mods.slice();
  const cond={vaste_hand:isDmg&&!abl.aoe,levensroof:isDmg,dorst:isDmg,epidauros:n.heal>0,ondermijnen:["verkenning","sabotage","ontwapenen"].includes(abl.id)};
  for(const id of Object.keys(cond)) if(cond[id]&&has(id)&&!extra.includes(N(id))) extra.push(N(id));
  // overige knooppunten die over precies deze vaardigheid gaan (Meesterschutter, Moreel, Woudgeest, …)
  for(const id of nodes){ const x=N(id), f=x?.fx; if(!f||extra.includes(x)) continue;
    if(f.ability===abl.id||(f.abilities||[]).includes(abl.id)
      ||(f.type==="weakspot_threshold"&&t==="attack_weakspot")
      ||(/^hard_word_curse_bonus/.test(f.type)&&abl.id==="vloek")) extra.push(x); }
  const hots=mods.filter(x=>x.fx.hot).map(x=>x.fx.hot); // heling over tijd (Ambrosia)
  return {b,n,bypass,aoe:!!abl.aoe,mods:extra,hot:hots.length?{amt:hots.reduce((a,h)=>a+h.amt,0),rounds:Math.max(...hots.map(h=>h.rounds))}:null};
}
function bmStActionsRender(){
  const box=document.getElementById("bmStActions"); if(!box) return;
  const t=BM_SKILLTREES[BM_ST_CLASS], cls=BM_CLASSES.find(c=>c.id===BM_ST_CLASS); if(!t||!cls){ box.innerHTML=""; return; }
  const stars=bmStStars(BM_ST_CLASS), eff=bmStEffectivePicks(BM_ST_CLASS,BM_ST_PICKS,stars);
  const pay=(typeof bmStPayloadFor==="function"&&bmStPayloadFor(BM_ST_CLASS,BM_ST_PICKS,stars))||{nodes:[],prestige:null};
  const ico=n=>n&&n.icon&&BM_ST_IMG_OK[n.icon]?`<img class="bmst-ai" src="assets/skills/${n.icon}" alt="">`:`<span class="bmst-ai g">${esc(n?.glyph||"◆")}</span>`;
  const chips=s=>{ const out=[], d=(k)=>s.n[k]-s.b[k], up=k=>d(k)>0?` <i>+${d(k)}</i>`:d(k)<0?` <i class="dn">${d(k)}</i>`:"";
    if(s.n.dmg) out.push(`<span class="bmst-c dmg" title="Schade">⚔ ${s.n.dmg}${s.aoe?" <small>elk</small>":""}${up("dmg")}</span>`);
    if(s.n.heal) out.push(`<span class="bmst-c heal" title="Heling van je leger">✚ ${s.n.heal}${up("heal")}</span>`);
    if(s.hot) out.push(`<span class="bmst-c heal" title="Extra heling in elk van de volgende rondes">✚ +${s.hot.amt} × ${s.hot.rounds} rondes erna</span>`);
    if(s.n.shld) out.push(`<span class="bmst-c shld" title="Schild voor je team">🛡 ${s.n.shld}${up("shld")}</span>`);
    if(s.n.teamBE) out.push(`<span class="bmst-c be" title="AP voor elke teamgenoot">+${s.n.teamBE} AP team${up("teamBE")}</span>`);
    if(s.n.selfBE) out.push(`<span class="bmst-c be" title="AP voor jezelf">+${s.n.selfBE} AP zelf${up("selfBE")}</span>`);
    if(s.n.shldRemove) out.push(`<span class="bmst-c rem" title="Haalt vijandelijk schild weg">schild −${s.n.shldRemove}${up("shldRemove")}</span>`);
    if(s.bypass) out.push(`<span class="bmst-c rem" title="Gaat door het vijandelijk schild heen">omzeilt schild</span>`);
    if(s.aoe) out.push(`<span class="bmst-c" title="Raakt alle doelen">alle doelen</span>`);
    return out.join(""); };
  const tierNm={basic:"Basis",medium:"Gevorderd",legendary:"Legendarisch",prestige:"Prestige"};
  const card=(abl,extraCls)=>{ const s=bmStAbilityStats(cls,abl,stars,pay), dc=s.n.cost-s.b.cost;
    return `<div class="bmst-act ${abl.tier||""} ${extraCls||""}">
      <div class="bmst-ah"><b>${esc(abl.nm)}</b><span class="bmst-tier">${tierNm[abl.tier]||""}</span>
        <span class="bmst-cost" title="Kosten in AP">${dc?`<s>${s.b.cost}</s> `:""}${s.n.cost} AP</span></div>
      <div class="bmst-ad">${esc(abl.desc||"")}</div>
      <div class="bmst-cs">${chips(s)||'<span class="note">—</span>'}</div>
      ${s.mods.length?`<div class="bmst-mods">${s.mods.map(n=>`<div>${ico(n)}<span><b>${esc(n.nm)}</b> · ${esc(n.desc)}</span></div>`).join("")}</div>`:""}
    </div>`; };
  const list=cls.abilities.filter(a=>a.tier!=="prestige");
  const pres=pay.prestige?bmStPrestigeAbility(BM_ST_CLASS,pay.prestige):null;
  const presCard=pres?card(pres,"pres")
    :`<div class="bmst-act prestige locked"><div class="bmst-ah"><b>Prestige-vaardigheid</b><span class="bmst-tier">★10</span></div>
       <div class="bmst-ad">${stars>=10?"Kies je prestige bovenin de boom":"Vrij bij ★10"}: ${t.prestige.map(v=>`<b>${esc(v.nm)}</b> (${v.cost} AP)`).join(" of ")}.</div></div>`;
  // overige gekozen knooppunten: werken bij elke (passende) actie of in de ronde zelf
  const used=new Set(); list.concat(pres?[pres]:[]).forEach(a=>bmStAbilityStats(cls,a,stars,pay).mods.forEach(n=>used.add(n.id)));
  const other=pay.nodes.map(id=>BM_ST_NODE[BM_ST_CLASS]?.[id]).filter(n=>n&&!used.has(n.id));
  const pas=cls.passive||{}, master=stars>=5;
  box.innerHTML=`<h3 class="bmst-h">⚔ Acties in het gevecht</h3>
    <div class="note" style="margin:-4px 0 10px">Met je huidige keuzes doorgerekend (${bmStars(stars)}). Een groen getal is je bonus uit de boom; wat van de ronde afhangt staat eronder.</div>
    <div class="bmst-pas">${ico(t.root)}<span><b>Passief${master?" (meester)":""}</b> · ${esc(master&&pas.masterDesc?pas.masterDesc:pas.desc||"")}${!master&&pas.masterDesc?` <span class="note">— bij ★5: ${esc(pas.masterDesc)}</span>`:""}</span></div>
    <div class="bmst-acts">${list.map(a=>card(a)).join("")}${presCard}</div>
    ${other.length?`<h4 class="bmst-h4">Altijd actief uit je boom</h4><div class="bmst-mods wide">${other.map(n=>`<div>${ico(n)}<span><b>${esc(n.nm)}</b> · ${esc(n.desc)}</span></div>`).join("")}</div>`
      :`<div class="note" style="margin-top:8px">${Object.keys(eff).length?"":"Nog geen keuzes gemaakt — kies in de boom en zie hier direct wat het doet."}</div>`}
    <div class="note" style="margin-top:10px">Altijd beschikbaar (0 AP): ${BM_BASIC_ACTIONS.filter(a=>!a.bossMealOnly).map(a=>`<b>${esc(a.nm)}</b> (${esc(a.desc)})`).join(" · ")}.</div>`;
}
function bmStCleanAfterPathChange(){
  const p=bmStPath(), t=BM_SKILLTREES[BM_ST_CLASS];
  [6,7,8,9].forEach(s=>{ if(!BM_ST_PICKS[s]) return; if(!(p&&skilltreeOptionsFor(t,p,s).some(n=>n.id===BM_ST_PICKS[s]))) delete BM_ST_PICKS[s]; });
  if(!p) delete BM_ST_PICKS[10];
}
function bmStRenderStatus(stars){
  const t=BM_SKILLTREES[BM_ST_CLASS], p=bmStPath(), P=BM_ST_PICKS, box=document.getElementById("bmStStatus"); if(!box) return;
  const nA=[1,2,3,4].filter(s=>P[s]==="A").length, nB=[1,2,3,4].filter(s=>P[s]==="B").length;
  const open=[1,2,3,4,6,7,8,9,10].filter(s=>s<=stars&&!P[s]&&!(s>=6&&!p)).length;
  box.innerHTML=(p?`Pad: <b>${esc(t.paths[p].nm)}</b> — ${esc(t.paths[p].desc)}`
    :stars>=1?`Kies bij ★1–4 telkens één kant (${nA}× ${esc(t.paths.A.nm)}, ${nB}× ${esc(t.paths.B.nm)}). 3–4× dezelfde kant = dat pad, 2/2 = ${esc(t.paths.H.nm)}.`
    :`Speel een gevecht met deze klasse om je eerste ster (en keuze) te verdienen.`)
    +(open>0?` <span class="pill" style="margin-left:4px">${open} keuze${open===1?"":"s"} open</span>`:"");
}
function bmStTipStatus(state,meta){
  if(state==="chosen") return "✓ Gekozen — tik nogmaals om te wissen";
  if(state==="fixed") return meta.star===5?"Krijg je automatisch bij ★5":"Je klasse";
  if(state==="locked") return "🔒 Vrij vanaf ★"+meta.star;
  if(state==="open") return "Tik om te kiezen";
  return meta.star>=6&&meta.star<=9?"Niet op jouw huidige pad":"Kies eerst bij ★1–4 je pad";
}
function bmStShowTip(grp,n,meta,state,color){
  const tip=document.getElementById("bmStTip"), box=document.getElementById("bmStBox"); if(!tip||!box) return;
  tip.style.setProperty("--tipc",color);
  tip.innerHTML=`<b>${esc(n.nm)}</b><span class="st">${meta.star?"★"+meta.star+" · ":""}${esc(meta.where)}</span>${esc(n.desc)}<span class="lk">${esc(bmStTipStatus(state,meta))}</span>`;
  const r=(grp.querySelector("polygon")||grp).getBoundingClientRect(), b=box.getBoundingClientRect();
  tip.classList.add("on");
  const tw=tip.offsetWidth, th=tip.offsetHeight;
  let left=r.left-b.left+r.width/2-tw/2; left=Math.max(6,Math.min(b.width-tw-6,left));
  let top=r.top-b.top-th-8; if(r.top-th-8<4) top=r.bottom-b.top+8;
  tip.style.left=left+"px"; tip.style.top=top+"px";
}
function bmStHideTip(){ BM_ST_HOVER=null; const t=document.getElementById("bmStTip"); if(t) t.classList.remove("on"); }
function bmStInjectStyle(){
  if(document.getElementById("bmStStyle")) return;
  const s=document.createElement("style"); s.id="bmStStyle";
  s.textContent=`.bmst-classes{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 10px}
.bmst-box{position:relative;background:rgba(0,0,0,.35);border:1px solid var(--stone4);border-radius:12px;box-shadow:inset 0 0 60px rgba(0,0,0,.6)}
.bmst-tree{display:block;width:100%;height:auto}
.bmst-tree text{paint-order:stroke;stroke:#0d0906;stroke-width:4px;stroke-linejoin:round}
.bmst-node{cursor:pointer}.bmst-node text{pointer-events:none}
.bmst-rays{animation:bmStRays 9s ease-in-out infinite alternate}
@keyframes bmStRays{from{opacity:.55}to{opacity:1}}
.bmst-motes circle{transform-box:fill-box;animation-name:bmStMote;animation-timing-function:linear;animation-iteration-count:infinite}
@keyframes bmStMote{0%{transform:translate(0,0);opacity:0}15%{opacity:.9}85%{opacity:.9}100%{transform:translate(18px,-160px);opacity:0}}
@media (prefers-reduced-motion:reduce){.bmst-rays,.bmst-motes circle{animation:none}}
.bmst-tip{position:absolute;z-index:5;max-width:260px;pointer-events:none;background:rgba(18,13,9,.97);border:1px solid var(--tipc,#d4af37);border-radius:10px;padding:8px 11px;box-shadow:0 6px 20px rgba(0,0,0,.6);font-size:14px;line-height:1.35;opacity:0;transition:opacity .12s}
.bmst-tip.on{opacity:1}.bmst-tip b{color:var(--tipc,#d4af37);font-size:15px}
.bmst-tip .st{display:block;color:var(--muted2);font-size:12px;margin:1px 0 4px}
.bmst-tip .lk{display:block;color:var(--muted);font-size:12px;margin-top:4px;font-style:italic}
.bmst-actbox{margin-bottom:16px}
.bmst-h{margin:0 0 6px;color:var(--hi)}.bmst-h4{margin:14px 0 6px;color:var(--hi);font-size:15px}
.bmst-pas{display:flex;gap:8px;align-items:center;margin:0 0 10px;font-size:14px}
.bmst-acts{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:10px}
.bmst-act{background:rgba(0,0,0,.3);border:1px solid var(--stone4);border-radius:10px;padding:9px 11px;font-size:14px;line-height:1.35}
.bmst-act.legendary{border-color:#8a6a2a}.bmst-act.prestige{border-color:#d4af37;box-shadow:0 0 12px rgba(212,175,55,.18)}
.bmst-act.locked{opacity:.6}
.bmst-ah{display:flex;align-items:baseline;gap:6px;flex-wrap:wrap}.bmst-ah b{color:#f3e9d2;font-size:15px}
.bmst-tier{font-size:11px;color:var(--muted2);text-transform:uppercase;letter-spacing:.06em}
.bmst-cost{margin-left:auto;font-weight:700;color:#d4af37;white-space:nowrap}.bmst-cost s{color:var(--muted2);font-weight:400}
.bmst-ad{color:var(--muted);font-size:13px;margin:3px 0 6px}
.bmst-cs{display:flex;flex-wrap:wrap;gap:5px}
.bmst-c{padding:2px 8px;border-radius:999px;background:rgba(255,255,255,.06);border:1px solid var(--stone4);font-size:13px;white-space:nowrap}
.bmst-c i{font-style:normal;color:#7fd28a;font-weight:700}.bmst-c i.dn{color:#e08a7a}.bmst-c small{opacity:.7}
.bmst-c.dmg{border-color:#8a4a3a}.bmst-c.heal{border-color:#3f7d52}.bmst-c.shld{border-color:#3f6a8d}.bmst-c.be{border-color:#8a7a3a}.bmst-c.rem{border-color:#6a4a8a}
.bmst-mods{margin-top:7px;display:flex;flex-direction:column;gap:5px;font-size:12.5px;color:var(--muted)}
.bmst-mods>div{display:flex;gap:7px;align-items:flex-start}.bmst-mods b{color:#e8dcc0}
.bmst-mods.wide{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:6px 12px;font-size:13px}
.bmst-ai{width:24px;height:24px;flex:none;border-radius:5px;image-rendering:pixelated}
.bmst-ai.g{display:inline-flex;align-items:center;justify-content:center;background:rgba(255,255,255,.07);font-size:13px}`;
  document.head.appendChild(s);
}
