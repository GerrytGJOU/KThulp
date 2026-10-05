/* ============================================================================
   SKILL-TREES — scherm, opslag en beheerderschakelaar
   ----------------------------------------------------------------------------
   Data: skilltree-data.js (BM_SKILLTREES). Ontwerp + balans: zie het
   commentaarblok daar en certamen/tools/skilltree-balance.js.
   - Aan/uit: config/skillTrees/enabled (alleen een beheerder mag schrijven,
     iedereen mag lezen — database.rules.json). Staat het uit, dan ziet alleen
     een ingelogde beheerder de skill-trees (om te testen); leerlingen niet.
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
let BM_ST_ENABLED=null;          // null = nog niet geladen
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
    if(!fbDB && !(typeof initFirebase==="function" && initFirebase())){ BM_ST_ENABLED=false; return false; }
    const v=(await fbDB.ref("config/skillTrees").once("value")).val();
    BM_ST_ENABLED=!!(v&&v.enabled);
  }catch(e){ BM_ST_ENABLED=false; }
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
function bmStLine(g,x1,y1,x2,y2,color,lit,dash){
  bmStEl("line",{x1,y1,x2,y2,stroke:lit?color:BMST_DIM,"stroke-width":lit?3.5:2,"stroke-dasharray":dash||"","stroke-linecap":"round",opacity:lit?1:.7,filter:lit?"url(#bmStGlow)":""},g);
}
function bmStCurve(g,x1,y1,x2,y2,color,lit){
  const my=(y1+y2)/2;
  bmStEl("path",{d:`M${x1},${y1} C${x1},${my} ${x2},${my} ${x2},${y2}`,fill:"none",stroke:lit?color:BMST_DIM,"stroke-width":lit?5:2.5,opacity:lit?1:.6,filter:lit?"url(#bmStGlow)":""},g);
}
function bmStNode(g,x,y,n,color,state,onPick,meta){
  const t=BM_SKILLTREES[BM_ST_CLASS];
  const r=state==="fixed"&&n===t.root?40:34, nkey=(n.id||n.nm)+"@"+x;
  const grp=bmStEl("g",{class:"bmst-node",tabindex:0,role:"button","aria-label":n.nm,"data-key":nkey},g);
  const lit=state==="chosen"||state==="fixed", col=lit||state==="open"?color:BMST_DIM;
  bmStEl("polygon",{points:bmStHex(x,y,r+5),fill:"none",stroke:col,"stroke-width":lit?2:1,opacity:lit?.9:state==="open"?.6:.4},grp);
  bmStEl("polygon",{points:bmStHex(x,y,r),fill:lit?"url(#bmStFillLit)":"#1c150f",stroke:col,"stroke-width":lit?3:2,filter:lit?"url(#bmStGlow)":"",opacity:state==="locked"?.45:1},grp);
  if(lit) bmStEl("polygon",{points:bmStHex(x,y,r),fill:color,opacity:.18},grp);
  if(n.icon&&BM_ST_IMG_OK[n.icon]){
    bmStEl("image",{href:"assets/skills/"+n.icon,x:x-r*.72,y:y-r*.72,width:r*1.44,height:r*1.44,opacity:state==="locked"?.3:state==="closed"?.45:1,style:"image-rendering:pixelated"},grp);
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
        const x=BMST_BRX[k]+(i===0?-BMST_BRDX:BMST_BRDX), y=BMST_YP[s], chosen=p===k&&P[s]===n.id;
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
  if(BM_ST_HOVER){ const g=svg.querySelector('g.bmst-node[data-key="'+CSS.escape(BM_ST_HOVER)+'"]'); if(g&&g._tip) g._tip(); else bmStHideTip(); }
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
.bmst-tip .lk{display:block;color:var(--muted);font-size:12px;margin-top:4px;font-style:italic}`;
  document.head.appendChild(s);
}
