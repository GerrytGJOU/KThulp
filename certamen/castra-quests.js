/* ============================================================================
   CASTRA HEROUM — MISSIEKETENS EN PERSONEN IN DE WERELD
   ----------------------------------------------------------------------------
   Elke held heeft een keten (CASTRA_HERO_DATA[id].chain, zie castra-heroes.js):
     kill     = versla n vijanden in een bepaald terrein (venatio),
     win      = win een proelium-missie,
     persuade = overtuig hem in het Latijn (keuzevraag; fout = opnieuw proberen).
   Wie de Latijnse tekst leest weet WAT, HOEVEEL en WAAR. Na de laatste stap
   komt de held in het heroum. Helden zijn avatars in de wereld (dezelfde
   top-down lagen als de speler). Hun NPC verschijnt pas na een spoor (venatio),
   behalve Aeneas. Opslag: CASTRA.quests[heroId] = { step, acc, n, fails }.
   Laadt NA castra-heroes.js, VÓÓR castra-world.js.
   ============================================================================ */

// NPC's zijn de helden met een plek in de wereld.
const CASTRA_NPCS = {};
Object.keys(CASTRA_HERO_DATA).forEach(id=>{
  const d = CASTRA_HERO_DATA[id];
  if(d.world) CASTRA_NPCS[id] = { nm:d.nm, world:d.world, region:d.region||"latium", avatar:d.look, always:!!d.always };
});

function castraQState(id){
  const q = CASTRA.quests || (CASTRA.quests = {});
  return q[id] || (q[id] = { step:0, acc:false, n:0, fails:0 });
}
// Zichtbaar in de wereld: nog niet in je heroum, en het spoor is gevonden (of altijd bij Aeneas).
function castraNpcVisible(id){
  const n = CASTRA_NPCS[id]; if(!n || castraHero(id)) return false;
  return n.always || !!(CASTRA.traces && CASTRA.traces[id]);
}
function castraVisibleNpcs(){ const rg = (typeof CASTRA_W_REGION!=="undefined") ? CASTRA_W_REGION : "latium"; return Object.keys(CASTRA_NPCS).filter(id=>CASTRA_NPCS[id].region===rg && castraNpcVisible(id)); }
function castraNpcAt(x,y){ return castraVisibleNpcs().find(id=>CASTRA_NPCS[id].world.x===x && CASTRA_NPCS[id].world.y===y) || null; }

function castraStepOf(id){ const q = castraQState(id); return CASTRA_HERO_DATA[id].chain[q.step] || null; }
function castraStepSatisfied(id){
  const s = castraStepOf(id), q = castraQState(id); if(!s) return false;
  if(s.kind==="kill") return q.n >= s.need;
  if(s.kind==="win") return castraPMissionDone(s.mission);
  return false;
}

// Na een gewonnen jacht: voortgang voor alle actieve kill-stappen in dit terrein.
function castraQuestOnWin(V){
  const msgs = [];
  Object.keys(CASTRA_HERO_DATA).forEach(id=>{
    if(castraHero(id)) return;
    const s = castraStepOf(id), q = castraQState(id);
    if(s && s.kind==="kill" && q.acc && (s.region||"latium")===V.region && s.terrain===V.terrain.id && q.n < s.need){ q.n++; msgs.push({ id, nm:CASTRA_HERO_DATA[id].nm, n:q.n, need:s.need }); }
  });
  if(msgs.length) castraSave();
  return msgs;
}
function castraQuestHud(){
  return Object.keys(CASTRA_HERO_DATA).map(id=>{
    if(castraHero(id)) return "";
    const s = castraStepOf(id), q = castraQState(id);
    if(!s || !q.acc || (s.kind!=="kill" && s.kind!=="win")) return "";
    const prog = s.kind==="kill" ? `${q.n} / ${s.need} — ` : "";
    return `<div class="note" style="text-align:center">📜 ${esc(CASTRA_HERO_DATA[id].nm)}: ${prog}${castraLaHTML(s.hud.la, s.hud.nl, "hud_"+id+q.step)}</div>`;
  }).join("");
}

/* ---------- gesprek ---------- */
function castraNpcRefreshHud(){ const h = el("cwHud"); if(h) h.innerHTML = castraQuestHud(); }
function castraNpcTalk(id){
  const d = CASTRA_HERO_DATA[id], panel = el("cwPanel"); if(!d || !panel) return;
  const q = castraQState(id), s = castraStepOf(id); if(!s){ castraNpcClose(); return; }
  const portrait = castraAvatarHTML(d.look, "down", 1, 64);
  let text, buttons = "";
  if(s.kind==="persuade"){
    text = castraLaHTML(s.ask.la, s.ask.nl, "ask_"+id+q.step);
    buttons = castraOptOrder(s.opts.length, id+q.step).map(k=>`<button class="btn" onclick="castraNpcPersuade('${id}',${k})">${esc(s.opts[k].la)}</button>`).join("");
  } else if(!q.acc){
    text = castraLaHTML(s.ask.la, s.ask.nl, "ask_"+id+q.step);
    buttons = `<button class="btn btn-gold" onclick="castraNpcAccept('${id}')">${castraLaText("accipio")}</button>
      <button class="btn" onclick="castraNpcClose()">${castraLaText("non_nunc")}</button>`;
  } else if(castraStepSatisfied(id)){
    text = castraLaHTML(s.done.la, s.done.nl, "done_"+id+q.step);
    buttons = `<button class="btn btn-gold" onclick="castraNpcNext('${id}')">${castraLaText("gratias")}</button>`;
  } else {
    text = s.kind==="kill"
      ? castraLaHTML(`Quot hostes vicisti? ${q.n}. ${s.hud.la}`, `Hoeveel vijanden heb je verslagen? ${q.n}. ${s.hud.nl}`, "wait_"+id+q.step)
      : castraLaHTML(s.hud.la, s.hud.nl, "wait_"+id+q.step);
    buttons = `<button class="btn" onclick="castraNpcClose()">${castraLaText("claude")}</button>`;
  }
  panel.innerHTML = `<div class="panel"><div style="display:flex;gap:12px;align-items:flex-start">
    <div style="flex-shrink:0;text-align:center">${portrait}<div style="font-weight:700">${esc(d.nm)}</div></div>
    <div style="flex:1;font-size:17px">${text}<div style="margin-top:10px;display:flex;gap:10px;flex-wrap:wrap">${buttons}</div></div></div></div>`;
  panel.scrollIntoView({ behavior:"smooth", block:"nearest" });
}
function castraNpcClose(){ const p = el("cwPanel"); if(p) p.innerHTML = ""; castraNpcRefreshHud(); }
function castraNpcAccept(id){
  const q = castraQState(id), s = castraStepOf(id); q.acc = true; q.n = 0; castraSave();
  el("cwPanel").innerHTML = `<div class="panel"><div style="font-size:17px">${castraLaHTML(s.hud.la, s.hud.nl, "acc_"+id+q.step)}</div>
    <div style="margin-top:10px"><button class="btn" onclick="castraNpcClose()">${castraLaText("claude")}</button></div></div>`;
  castraNpcRefreshHud();
}
function castraNpcNext(id){
  const q = castraQState(id); if(!castraStepSatisfied(id)) return;
  q.step++; q.acc = false; q.n = 0; castraSave();
  castraNpcTalk(id); castraNpcRefreshHud();
}
function castraNpcPersuade(id, k){
  const d = CASTRA_HERO_DATA[id], q = castraQState(id), s = castraStepOf(id);
  if(!s || s.kind!=="persuade") return;
  if(!s.opts[k].ok){ q.fails = (q.fails||0)+1; castraSave(); castraToastLa("non_convenit"); return; }
  castraHeroRecruit(id); q.step++;
  const reward = 5; CASTRA.res.gloria = (CASTRA.res.gloria||0) + reward; castraSave();
  toast("Heros novus!", d.nm+" · "+CASTRA_LA.aen_joined.nl);
  el("cwPanel").innerHTML = `<div class="panel"><div style="display:flex;gap:12px"><div>${castraAvatarHTML(d.look,"down",1,64)}</div>
    <div style="flex:1;font-size:17px">${castraLaHTML(s.join.la, s.join.nl, "join_"+id)}<div class="note" style="margin-top:6px">🏆 +${reward} · ${castraLa("heroum_novum")}</div>
    <button class="btn" onclick="castraNpcClose();castraWorldNpcs()">${castraLaText("claude")}</button></div></div></div>`;
  castraNpcRefreshHud(); castraWorldNpcs();
}
