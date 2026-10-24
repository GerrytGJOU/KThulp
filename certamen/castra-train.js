/* ============================================================================
   CASTRA HEROUM — TRAINERS OP DE WEG, INSIGNIA EN EEN BODE VOOR REMATCHES (naar Pokémon)
   ----------------------------------------------------------------------------
   - Trainers: in elk land staan twee of drie jagers langs de weg (één per stuk van de kaart, CASTRA_TRAIN_POS). Kom je dichtbij,
     dan dagen ze je uit: eerst een korte Latijnse vraag (goed antwoord = extra gloria), dan een gewoon jachtgevecht tegen
     een soldaat van dat land, iets sterker dan wild (+2 gradus). Zo'n trainer kun je niet vangen. Wie je verslaat, geeft
     grondstoffen en gloria en is pas de volgende dag weer te verslaan (rematch).
   - Insignia: de kampioen van elk land (de vechter in het huis, castra-regions.js) geeft bij de eerste overwinning een insigne
     van dat land (CASTRA.insignia). Alle elf: een grote beloning en een eretitel in de profielkaart. Menu ☰ → Insignia.
   - Bode: de Tabellarius meldt in de Hodie-lijst hoeveel jagers in je geopende landen op een rematch wachten.
   Gebruikt de bestaande gevechten (castraRegionFight) en de dagelijkse tellers (CASTRA.wday). Laadt NA castra-field.js.
   ============================================================================ */
const CASTRA_TRAIN_POS = {
  latium:[[29,33],[33,12]], graecia:[[33,40],[29,22],[33,5]], troia:[[29,40],[29,24],[33,8]], gallia:[[34,41],[29,25],[33,9]], aegyptus:[[33,39],[29,24],[29,8]],
  persis:[[33,40],[29,24],[29,8]], africa:[[33,32],[33,8]], roma:[[33,45],[33,28],[37,9]], laconia:[[28,40],[29,23],[29,8]], germania:[[29,41],[29,26],[29,8]],
  themiscyra:[[29,41],[29,26],[33,6]],
};
const CASTRA_TRAIN_KINDS = [
  { nm:"Venator",   la:"Salve, hospes! Venator sum. Pugnemus!",            nl:"Gegroet, gast! Ik ben een jager. Laten we vechten!", armor:"vodden",  wapen:"speer" },
  { nm:"Miles viae", la:"Hic viam custodio. Pugnasne mecum?",               nl:"Ik bewaak hier de weg. Vecht je met mij?",            armor:"middel",  wapen:"zwaard" },
  { nm:"Explorator", la:"Vires tuas experiri volo. Veni!",                  nl:"Ik wil je kracht op de proef stellen. Kom op!",        armor:"licht",   wapen:"boog" },
];
const CASTRA_TRAIN_TITLES = { latium:"Latinus", graecia:"Graecus", troia:"Troianus", gallia:"Gallus", aegyptus:"Aegyptius", persis:"Persa", africa:"Poenus", roma:"Romanus", laconia:"Spartiates", germania:"Germanus", themiscyra:"Amazon" };
const CASTRA_INSIGNIA_NAMES = { latium:"Latium", graecia:"Graecia", troia:"Troia", gallia:"Gallia", aegyptus:"Aegyptus", persis:"Persis", africa:"Africa", roma:"Roma", laconia:"Laconia", germania:"Germania", themiscyra:"Themiscyra" };

(function(){
  Object.keys(CASTRA_TRAIN_POS).forEach(rid=>{
    const W = CASTRA_WORLDS[rid]; if(!W) return;
    CASTRA_TRAIN_POS[rid].forEach((p,i)=>{
      const K = CASTRA_TRAIN_KINDS[i % CASTRA_TRAIN_KINDS.length];
      CASTRA_WENT.push({ id:"trainer_"+rid+i, region:rid, kind:"trainer", x:p[0], y:p[1], nm:K.nm+" "+(CASTRA_TRAIN_TITLES[rid]||""), tk:i % CASTRA_TRAIN_KINDS.length, dir:"left" });
    });
  });
})();

/* ---------- zichtbaar, tekenen ---------- */
const _castraWEntVisibleTr0 = castraWEntVisible;
castraWEntVisible = function(e){ if(e.kind==="trainer") return true; return _castraWEntVisibleTr0(e); };
function castraTrainerDone(e){ return (CASTRA.wday||{})["trainer_"+e.id]===castraWDay(); }
function castraTrainerLook(e){
  const rid = CASTRA_WORLDS[e.region].parent || e.region, folk = (typeof CASTRA_WREG!=="undefined" && CASTRA_WREG[rid] && CASTRA_WREG[rid].folk) || "rom", K = CASTRA_TRAIN_KINDS[e.tk];
  return castraRegLook(folk, { armor:K.armor, wapen:K.wapen, cape:"kort", capekleur:"rood", helm:e.tk===1?"open":"geen" });
}
const _castraWobjDrawTr0 = castraWobjDraw;
castraWobjDraw = function(){
  _castraWobjDrawTr0.apply(this, arguments);
  const box = el("cwWobj"); if(!box) return;
  let html = "";
  castraWEnts().filter(e=>e.kind==="trainer" && !e._walk).forEach(e=>{
    const done = castraTrainerDone(e);
    html += `<div style="position:absolute;left:${e.x*48}px;top:${e.y*48}px;width:48px;height:48px;pointer-events:none;z-index:4;${done?"opacity:.55;filter:grayscale(.5)":""}">${castraAvatarHTML(castraTrainerLook(e), castraTrainerDir(e), 1, 48)}
      <div style="position:absolute;left:50%;top:-12px;transform:translateX(-50%);font-size:15px;line-height:1;background:${done?"#5d5":"#d94"};color:#fff;border-radius:10px;padding:1px 5px;box-shadow:0 1px 4px rgba(0,0,0,.6)">${done?"✔":"⚔️"}</div></div>`;
  });
  if(html) box.insertAdjacentHTML("beforeend", html);
};

/* ---------- aanspreken: Latijnse vraag, dan het duel ---------- */
const _castraNpcTalkTr0 = castraNpcTalk;
castraNpcTalk = function(id){
  if(String(id).indexOf("w:trainer_")===0){ const e = CASTRA_WENT.find(x=>"w:"+x.id===id); if(e){ castraTrainerTalk(e); return; } }
  return _castraNpcTalkTr0.apply(this, arguments);
};
function castraTrainerQuestion(rid, seed){
  const rng = castraRng(seed>>>0), heroes = Object.keys(CASTRA_HERO_DATA).filter(h=>CASTRA_HERO_DATA[h].talks);
  const own = heroes.filter(h=>CASTRA_HERO_DATA[h].region===rid), pool = own.length ? own : heroes;
  const d = CASTRA_HERO_DATA[pool[Math.floor(rng()*pool.length)]], t = d.talks[Math.floor(rng()*d.talks.length)];
  const opts = t.q.opts.map(o=>({ la:o.la, nl:o.nl, ok:!!o.ok })); for(let i=opts.length-1;i>0;i--){ const j = Math.floor(rng()*(i+1)); [opts[i],opts[j]] = [opts[j],opts[i]]; }
  return { q:{ la:t.q.la, nl:t.q.nl }, opts, ctx:{ la:t.la, nl:t.nl } };
}
function castraTrainerTalk(e){
  if(CASTRA_DLG) return;
  const K = CASTRA_TRAIN_KINDS[e.tk], look = castraTrainerLook(e), rid = CASTRA_WORLDS[e.region].parent || e.region;
  if(castraTrainerDone(e)){ castraLatSay(e.nm, look, [ { la:"Hodie me vicisti. Cras redi!", nl:"Vandaag heb je mij verslagen. Kom morgen terug voor een rematch!" } ], null); return; }
  const Q = castraTrainerQuestion(rid, (CASTRA.seed ^ (e.x*131+e.y*977))>>>0); CASTRA.seed = (CASTRA.seed+17)>>>0;
  castraLatSay(e.nm, look, [ { la:K.la, nl:K.nl }, { la:Q.ctx.la, nl:Q.ctx.nl }, { la:Q.q.la, nl:Q.q.nl, opts:Q.opts.map(o=>({ la:o.la, nl:o.nl })) } ], k=>{
    const right = !!(Q.opts[k] && Q.opts[k].ok);
    castraLatSay(e.nm, look, [ right ? { la:"Recte! Nunc pugnemus.", nl:"Goed zo! Nu gaan we vechten (extra gloria bij winst)." } : { la:"Non recte. Sed pugnemus.", nl:"Niet goed. Maar laten we toch vechten." },
      { la:"Visne pugnare?", nl:"Durf je?", opts:[ { la:"Pugno", nl:"vechten" }, { la:"Nunc non", nl:"nu niet" } ] } ], j=>{ if(j===0) castraTrainerFight(e, right); });
  });
}
// Een trainer heeft meerdere soldaten (twee in Latium, daarna drie): ze komen een voor een, zoals de Pokémon van een trainer.
function castraTrainerCount(rid){ return rid==="latium" ? 2 : 3; }
function castraTrainerFight(e, right){
  const rid = CASTRA_WORLDS[e.region].parent || e.region, reg = CASTRA_VENATIO[rid];
  const W = castraWorldCfg(), z = (typeof castraZoneAt==="function") ? castraZoneAt(W, e.x, e.y) : null;
  const terrain = (z && reg.terrains.find(t=>t.id===z.t)) || reg.terrains[0];
  const rng = castraRng((CASTRA.seed ^ (e.x*7919+e.y*104729))>>>0); CASTRA.seed = (CASTRA.seed+11)>>>0;
  const n = castraTrainerCount(rid), party = [];
  for(let i=0;i<n;i++){ const pick = castraWildPick(reg, terrain, rng); party.push({ form:pick.form.id, lvl:pick.lvl+1+i }); }   // de laatste is de sterkste
  castraRegionFight(rid, terrain.id, party[0].form, party[0].lvl, { key:"trainer_"+e.id, reward:{ aes:20+15*n, frumentum:12+8*n }, gloria:right?2:1, pxp:12, why:"trainer verslagen",
    trainer:{ nm:e.nm, tk:e.tk, look:castraTrainerLook(e), party, idx:0 } });
}
/* ---------- de trainer in beeld: eerst zijn soldaten tellen, dan pas de eerste (zoals de ballen in Pokémon) ---------- */
function castraTrainerOf(V){ if(!V) return null; if(!V.trainer && V.boss && V.boss.trainer) V.trainer = { ...V.boss.trainer }; return V.trainer || null; }
function castraTrainerBalls(tr, size){
  let h = ""; for(let i=0;i<tr.party.length;i++){ const gone = i<tr.idx, cur = i===tr.idx;
    h += `<span title="${gone?"verslagen":cur?"in het veld":"nog in reserve"}" style="display:inline-flex;align-items:center;justify-content:center;width:${size}px;height:${size}px;margin:0 4px;border-radius:50%;border:2px solid ${gone?"#6b5630":"#d4af37"};background:${gone?"rgba(0,0,0,.35)":cur?"linear-gradient(#e8c96a,#d4af37)":"rgba(212,175,55,.18)"};font-size:${Math.round(size*0.55)}px;opacity:${gone?.55:1}">${gone?"✖":"🛡️"}</span>`; }
  return h;
}
function castraTrainerNumLa(n){ return n===1 ? { la:"unum militem", nl:"één soldaat" } : n===2 ? { la:"duos milites", nl:"twee soldaten" } : n===3 ? { la:"tres milites", nl:"drie soldaten" } : { la:n+" milites", nl:n+" soldaten" }; }
function castraTrainerScreen(kind){
  const V = CASTRA_V, tr = castraTrainerOf(V), K = CASTRA_TRAIN_KINDS[tr.tk] || CASTRA_TRAIN_KINDS[0];
  const head = `<div class="scrhead"><button class="back" onclick="castraVLeave()">${iconSVG("shield",20,"currentColor")}</button><h2>🏹 ${castraLa("venatio_titel")}</h2></div>`;
  const avatar = `<div style="flex:0 0 112px;width:112px;height:112px">${castraAvatarHTML(tr.look, "down", 1, 112)}</div>`;
  let body;
  if(kind==="intro"){
    const left = tr.party.length, c = castraTrainerNumLa(left);
    body = `<div class="panel"><div style="display:flex;gap:14px;align-items:center">${avatar}
      <div style="min-width:0"><div style="font-size:21px"><b>${esc(tr.nm)}</b></div>
        <div style="font-size:17px;margin:6px 0">${castraLaHTML(K.la, K.nl, "trn_q"+tr.tk)}</div></div></div>
      <div style="font-size:18px;margin:14px 0 6px">${castraLaHTML(esc(tr.nm)+" "+c.la+" habet.", esc(tr.nm)+" heeft "+c.nl+".", "trn_habet")}</div>
      <div style="margin:8px 0 14px">${castraTrainerBalls(tr, 34)}</div>
      <button class="btn btn-gold" style="min-height:48px" onclick="castraTrainerGo()">${castraLaText("perge")}</button></div>`;
  } else {
    const left = tr.party.length-1-tr.idx, c = castraTrainerNumLa(left);
    let res = castraVResultHTML().replace(/castraVBack\(\)/g, "castraTrainerNext()");
    body = `<div class="panel" style="margin-bottom:8px"><div style="display:flex;gap:14px;align-items:center">${avatar}
      <div><div style="font-size:19px"><b>${esc(tr.nm)}</b></div>
        <div style="font-size:16px;margin:4px 0">${castraLaHTML(left===1 ? "Adhuc unum militem habet." : "Adhuc "+c.la+" habet.", left===1 ? "Hij heeft nog één soldaat." : "Hij heeft nog "+c.nl+".", "trn_adhuc")}</div>
        <div>${castraTrainerBalls({ ...tr, idx:tr.idx+1 }, 28)}</div></div></div></div>${res}`;
  }
  H(brand(true)+head+`<div id="castraVBody">${body}</div>${foot()}`);
}
function castraTrainerGo(){ const V = CASTRA_V; if(!V) return; V.trainerIntroSeen = true; castraVRender("scout"); }
// De volgende soldaat van de trainer komt het veld in: kies opnieuw wie je stuurt (je mag wisselen).
function castraTrainerNext(){
  const old = CASTRA_V, tr = castraTrainerOf(old); if(!old || !tr) return;
  const i = tr.idx+1, u = tr.party[i];
  const V2 = castraForcedEncounter(old.region, old.terrain.id, { form:u.form, lvl:u.lvl, boss:old.boss });
  V2.fromWorld = true; V2.log = []; V2.round = 0; V2.trainer = { ...tr, idx:i }; V2.trainerIntroSeen = true;
  CASTRA_V = V2; if(typeof castraCodexSee==="function") castraCodexSee(u.form);
  castraVRender("scout");
}
const _castraVRenderTr0 = castraVRender;
castraVRender = function(stage){
  const V = CASTRA_V, tr = castraTrainerOf(V);
  if(tr){
    if(stage==="scout" && !V.trainerIntroSeen){ castraTrainerScreen("intro"); return; }
    if(stage==="result" && V.over==="win" && tr.idx < tr.party.length-1){ castraTrainerScreen("next"); return; }
  }
  return _castraVRenderTr0.apply(this, arguments);
};
// Een tussentijdse winst telt niet als het verslaan van de trainer: geen trainerbeloning, wel ervaring en gewone buit.
const _castraVFinishTr0 = castraVFinish;
castraVFinish = function(){
  const V = CASTRA_V, tr = castraTrainerOf(V);
  if(tr && V.over==="win" && tr.idx < tr.party.length-1){ const b = V.boss; V.boss = null; try{ return _castraVFinishTr0.apply(this, arguments); } finally { V.boss = b; } }
  return _castraVFinishTr0.apply(this, arguments);
};
// Het aantal soldaten dat de trainer nog heeft, naast zijn naam in het gevecht.
const _castraMvInitTr0 = castraMvInit;
castraMvInit = function(V){
  _castraMvInitTr0.apply(this, arguments);
  const tr = castraTrainerOf(V); if(tr && V.s && V.s.en) V.s.en.dots = "●".repeat(tr.party.length-tr.idx)+"○".repeat(tr.idx);
};
const _castraMvStatusTr0 = castraMvStatus;
castraMvStatus = function(S){ return _castraMvStatusTr0.apply(this, arguments) + (S && S.dots ? `<span style="font-size:11px;margin-left:5px;letter-spacing:1px;color:#e8c96a" title="soldaten van de trainer: nog in het veld of reserve ●, verslagen ○">${S.dots}</span>` : ""); };

// Trainers zijn niet te vangen.
const _castraMvCatchableTr0 = castraMvCatchable;
castraMvCatchable = function(V){ if(V && V.boss && String(V.boss.key||"").indexOf("trainer_")===0) return false; return _castraMvCatchableTr0(V); };

/* ---------- uitdagen: de trainer ziet je (zichtlijn), roept "!" en loopt naar je toe ----------
   Een trainer kijkt naar het midden van de kaart (de weg) en ziet je alleen als je recht voor hem staat: in zijn rij, aan de kant
   waar hij heen kijkt, maximaal CASTRA_TRAIN_SIGHT tegels ver en zonder obstakel ertussen. Naast, schuin of achter hem niet. Dan verschijnt een "!", hij loopt naar je toe en het gesprek begint
   (zoals bij het aanspreken). Is hij vandaag al verslagen, dan zegt hij niets. */
const CASTRA_TRAIN_SIGHT = 3;
function castraTrainerDir(e){ const W = castraWorldCfg(); return e.x < W.cols/2 ? "right" : "left"; }
// Alleen recht voor hem: in zijn rij, aan de kant waar hij heen kijkt, tot CASTRA_TRAIN_SIGHT tegels ver en zonder obstakel ertussen.
// Naast, schuin of achter hem ziet hij je niet.
function castraTrainerSees(e, px, py){
  if(py!==e.y) return false;
  const dx = castraTrainerDir(e)==="right" ? 1 : -1, dist = (px-e.x)*dx;
  if(dist<1 || dist>CASTRA_TRAIN_SIGHT) return false;
  for(let i=1;i<dist;i++) if(castraWBlocked(e.x+dx*i, e.y)) return false;            // een boom, rots of persoon ertussen
  return true;
}
function castraTrainerWalkClear(){
  castraWEnts().forEach(e=>{ if(e._walk) delete e._walk; });
  const b = el("cwTrW"); if(b) b.innerHTML = "";
  if(typeof castraWobjDraw==="function") castraWobjDraw();
}
const _castraWStepTr0 = castraWStep;
castraWStep = function(dir){
  if(CASTRA_W_UI.moving) return _castraWStepTr0.apply(this, arguments);
  if(castraWEnts().some(e=>e._walk)) castraTrainerWalkClear();                        // de trainer gaat terug naar zijn plek zodra je verder loopt
  const r = _castraWStepTr0.apply(this, arguments);
  if(r===true) setTimeout(castraTrainerCheck, 260);
  return r;
};
function castraTrainerCheck(){
  if(CASTRA_DLG || !el("cwMap") || CASTRA_W_UI.moving) return;
  const px = CASTRA_W_UI.px, py = CASTRA_W_UI.py; let hit = null;
  castraWEnts().filter(e=>e.kind==="trainer").forEach(e=>{
    const d = Math.max(Math.abs(e.x-px), Math.abs(e.y-py));
    if(d>=5) e._seen = false;
    else if(!hit && !e._seen && !castraTrainerDone(e) && castraTrainerSees(e, px, py)) hit = e;
  });
  if(hit) castraTrainerApproach(hit, px, py);
}
function castraTrainerApproach(e, px, py){
  e._seen = true; CASTRA_W_UI.moving = true;
  const dir = castraTrainerDir(e), dx = dir==="right" ? 1 : -1, box = (()=>{ let b = el("cwTrW"); if(!b){ b = document.createElement("div"); b.id = "cwTrW"; el("cwMap").insertBefore(b, el("cwAbove")); } return b; })();
  const adjacent = Math.max(Math.abs(e.x-px), Math.abs(e.y-py))<=1, row = py===e.y, steps = adjacent || !row ? 0 : Math.max(0, Math.abs(px-e.x)-1);
  const look = castraTrainerLook(e), avatar = d=>castraAvatarHTML(look, d, 1, 48);
  e._walk = { x:e.x };
  if(typeof castraWobjDraw==="function") castraWobjDraw();
  box.innerHTML = `<div id="cwTrWm" style="position:absolute;left:${e.x*48}px;top:${e.y*48}px;width:48px;height:48px;z-index:4;transition:left .2s linear;pointer-events:none">${avatar(dir)}
    <div style="position:absolute;left:50%;top:-16px;transform:translateX(-50%);font-size:20px;font-weight:bold;line-height:1;background:#e8c96a;color:#7a1c14;border:2px solid #7a1c14;border-radius:50%;width:24px;height:24px;text-align:center">!</div></div>`;
  const stop = ()=>{ CASTRA_W_UI.moving = false; };
  const face = ()=>{ CASTRA_W_UI.dir = row && px!==e.x ? (px>e.x ? "left" : "right") : CASTRA_W_UI.dir; if(el("cwAv")) castraWorldAvatar(); };
  const talk = ()=>{ stop(); face(); const bub = el("cwTrWm") && el("cwTrWm").querySelector(":scope > div:last-child"); if(bub && bub.textContent.trim()==="!") bub.remove(); castraTrainerTalk(e); };
  let i = 0;
  const walk = ()=>{
    if(!el("cwTrWm")){ stop(); return; }
    if(i>=steps){ setTimeout(talk, 220); return; }
    i++; el("cwTrWm").style.left = ((e.x+dx*i)*48)+"px"; setTimeout(walk, 210);
  };
  setTimeout(walk, 620);       // eerst het uitroepteken even laten zien
}
const _castraWorldRenderTr0 = castraWorldRender;
castraWorldRender = function(){ castraWEnts().forEach(e=>{ delete e._walk; }); return _castraWorldRenderTr0.apply(this, arguments); };

/* ---------- insignia ---------- */
const _castraBossWonIn0 = castraBossWon;
castraBossWon = function(V){
  const b = V && V.boss, first = b && String(b.key||"").indexOf("champ_")===0 && !(CASTRA.insignia && CASTRA.insignia[V.region]);
  const r = _castraBossWonIn0.apply(this, arguments);
  if(first && V.region){
    (CASTRA.insignia || (CASTRA.insignia = {}))[V.region] = castraWDay();
    const n = Object.keys(CASTRA.insignia).length, tot = Object.keys(CASTRA_INSIGNIA_NAMES).length;
    let extra = "";
    if(n>=tot){ castraWGive({ aes:500, frumentum:250, gloria:25 }); CASTRA.imperator = 1; extra = " Alle insignia verzameld: Imperator! (+500 aes, +250 frumentum, +25 gloria)"; if(typeof castraPxpAdd==="function") castraPxpAdd(150, "Alle insignia"); }
    castraSave();
    setTimeout(()=>toast("🏅 Insigne van "+(CASTRA_INSIGNIA_NAMES[V.region]||V.region), n+" / "+tot+" insignia."+extra), 1300);
  }
  return r;
};
function castraInsigniaCount(){ return Object.keys(CASTRA.insignia||{}).length; }

/* ---------- menu: insignia ---------- */
(function(){
  const i = CASTRA_MENU_ITEMS.findIndex(x=>x.id==="tabulae");
  CASTRA_MENU_ITEMS.splice(i<0 ? CASTRA_MENU_ITEMS.length : i+1, 0, { id:"insignia", la:"Insignia", nl:"je insignes" });
})();
const _castraMenuViewTr0 = castraMenuView;
castraMenuView = function(id){
  if(id!=="insignia") return _castraMenuViewTr0(id);
  const have = CASTRA.insignia||{}, ids = Object.keys(CASTRA_INSIGNIA_NAMES);
  const cells = ids.map(r=>{ const ok = !!have[r]; return `<div style="flex:0 0 31%;min-width:90px;text-align:center;padding:8px 4px;border:2px solid ${ok?"#c9a24a":"#8a7a55"};border-radius:10px;${ok?"background:rgba(212,175,55,.2)":"opacity:.55"}">
    <div style="font-size:30px;filter:${ok?"none":"grayscale(1)"}">🏅</div><div style="font-size:13px;font-weight:bold">${esc(CASTRA_INSIGNIA_NAMES[r])}</div><div style="font-size:11px">${ok?"verzameld":"versla de kampioen"}</div></div>`; }).join("");
  return `<h3 style="margin:0 0 6px">Insignia <small>${castraInsigniaCount()} / ${ids.length}</small></h3>
    <div style="font-size:14px;margin-bottom:8px">Elk land heeft een kampioen in een huis. Win het gevecht voor het eerst en je krijgt de insigne van dat land. ${CASTRA.imperator?"<b>Imperator!</b> Alle insignia verzameld.":"Alle elf geven je de titel Imperator en een grote beloning."}</div>
    <div style="display:flex;flex-wrap:wrap;gap:8px">${cells}</div>`;
};

/* ---------- de bode (Hodie) ---------- */
if(typeof castraHodieItems==="function"){
  const _castraHodieItemsTr0 = castraHodieItems;
  castraHodieItems = function(){
    const out = _castraHodieItemsTr0.apply(this, arguments);
    try{
      const day = castraWDay(), open = Object.keys(CASTRA_TRAIN_POS).filter(r=>castraRegionOpen(r)), w = CASTRA.wday || {};
      const waiting = CASTRA_WENT.filter(e=>e.kind==="trainer" && open.indexOf(e.region)>=0 && w["trainer_"+e.id]!==day);
      if(waiting.length){ const names = [...new Set(waiting.map(e=>CASTRA_INSIGNIA_NAMES[e.region]||e.region))].slice(0,4).join(", ");
        out.push({ icon:"📨", t:`Tabellarius nuntiat: ${waiting.length} jager${waiting.length>1?"s":""} wacht${waiting.length>1?"en":""} op een gevecht (${names}).` }); }
    }catch(_){}
    return out;
  };
}

Object.assign(CASTRA_GLOSS, { "venator":"jager", "habet":"heeft", "adhuc":"nog", "unum":"één (4e naamval)", "duos":"twee (4e naamval)", "tres":"drie", "militem":"soldaat (4e naamval)", "milites":"soldaten", "pugnemus":"laten we vechten", "pugnasne":"vecht je", "mecum":"met mij", "custodio":"ik bewaak", "vires":"krachten", "tuas":"jouw", "experiri":"op de proef stellen",
  "volo":"ik wil", "veni":"kom", "vicisti":"je hebt gewonnen", "cras":"morgen", "redi":"kom terug", "recte":"goed", "visne":"wil je", "pugnare":"vechten", "pugno":"ik vecht", "tabellarius":"bode", "nuntiat":"meldt",
  "insignia":"insignes", "pugnatorem":"vechter (4e naamval)" });
