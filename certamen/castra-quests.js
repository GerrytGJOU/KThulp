/* ============================================================================
   CASTRA HEROUM — OPDRACHTEN EN PERSONEN IN DE WERELD
   ----------------------------------------------------------------------------
   Een persoon (NPC) in Latium geeft een opdracht in het Latijn. Wie de tekst
   leest weet WAT (hostes vincere), HOEVEEL (tres) en WAAR (in silva) — dat
   laatste bepaalt in welk gras je moet jagen. Voltooien levert gloria en een
   held op (opgeslagen in CASTRA.heroes; het heroum zelf volgt in fase 3).
   NPC's zijn avatars: ze worden getekend met dezelfde top-down lagen als de
   speler (castraAvatarHTML), met een vaste uitrusting.
   Opslag: CASTRA.quests[id] = { s: 0 nog niet | 1 actief | 2 klaar, n: voortgang }.
   Laadt NA castra-latin.js, VÓÓR castra-world.js.
   ============================================================================ */

const CASTRA_QUESTS = {
  aeneas1: { npc:"aeneas", terrain:"silva", need:3, reward:{ gloria:5 }, hero:"aeneas" },
};

/* NPC's: plek in de wereld + uiterlijk (alleen lagen waarvoor top-down sprites bestaan). */
const CASTRA_NPCS = {
  aeneas: { nm:"Aeneas", world:{ x:13, y:11, dir:"right" }, quest:"aeneas1",
    avatar:{ huid:"getint", haar:"kort", haarkleur:"bruin", baard:"baard", armor:"ceremonieel", cape:"lang", capekleur:"rood", helm:"geen", schild:"geen", wapen:"zwaard" } },
};

function castraQuestState(id){
  const q = CASTRA.quests || (CASTRA.quests = {});
  return q[id] || (q[id] = { s:0, n:0 });
}
// Na een gewonnen gevecht: loopt er een opdracht voor dit terrein, dan telt het mee.
function castraQuestOnWin(V){
  const msgs = [];
  Object.keys(CASTRA_QUESTS).forEach(id=>{
    const def = CASTRA_QUESTS[id], q = castraQuestState(id);
    if(q.s===1 && def.terrain===V.terrain.id && q.n < def.need){
      q.n++; msgs.push({ id, n:q.n, need:def.need });
    }
  });
  if(msgs.length) castraSave();
  return msgs;
}
function castraQuestHud(){
  const lines = Object.keys(CASTRA_QUESTS).map(id=>{
    const def = CASTRA_QUESTS[id], q = castraQuestState(id), npc = CASTRA_NPCS[def.npc];
    if(q.s!==1) return "";
    const ter = CASTRA_VENATIO.latium.terrains.find(t=>t.id===def.terrain);
    return `<div class="note" style="text-align:center">📜 ${esc(npc.nm)}: ${q.n} / ${def.need} — ${castraLaHTML("Hostes "+ter.la.toLowerCase()+" vince!", "Versla vijanden "+ter.nl.toLowerCase()+"!", "quest_hud")}</div>`;
  }).join("");
  return lines;
}

/* ---------- gesprek ---------- */
function castraNpcTalk(npcId){
  const npc = CASTRA_NPCS[npcId]; if(!npc) return;
  const def = CASTRA_QUESTS[npc.quest], q = castraQuestState(npc.quest);
  const panel = el("cwPanel"); if(!panel) return;
  const portrait = castraAvatarHTML(npc.avatar, "down", 1, 64);
  let text, buttons;
  if(q.s===0){
    text = castraLa("aen_hi");
    buttons = `<button class="btn btn-gold" onclick="castraNpcAccept('${npcId}')">${castraLaText("accipio")}</button>
      <button class="btn" onclick="castraNpcClose()">${castraLaText("non_nunc")}</button>`;
  } else if(q.s===1 && q.n < def.need){
    text = castraLaHTML(`Quot hostes vicisti? ${q.n}. Tres hostes in silva vince!`, `Hoeveel vijanden heb je verslagen? ${q.n}. Versla drie vijanden in het bos!`, "aen_wait");
    buttons = `<button class="btn" onclick="castraNpcClose()">${castraLaText("claude")}</button>`;
  } else if(q.s===1){
    text = castraLa("aen_done");
    buttons = `<button class="btn btn-gold" onclick="castraNpcFinish('${npcId}')">${castraLaText("gratias")}</button>`;
  } else {
    text = castraLa("aen_bye");
    buttons = `<button class="btn" onclick="castraNpcClose()">${castraLaText("vale")}</button>`;
  }
  panel.innerHTML = `<div class="panel"><div style="display:flex;gap:12px;align-items:flex-start">
    <div style="flex-shrink:0;text-align:center">${portrait}<div style="font-weight:700">${esc(npc.nm)}</div></div>
    <div style="flex:1;font-size:17px">${text}<div style="margin-top:10px;display:flex;gap:10px;flex-wrap:wrap">${buttons}</div></div></div></div>`;
  panel.scrollIntoView({ behavior:"smooth", block:"nearest" });
}
function castraNpcClose(){ const p = el("cwPanel"); if(p) p.innerHTML = ""; const h = el("cwHud"); if(h) h.innerHTML = castraQuestHud(); }
function castraNpcAccept(npcId){
  const npc = CASTRA_NPCS[npcId]; castraQuestState(npc.quest).s = 1; castraSave();
  const p = el("cwPanel");
  p.innerHTML = `<div class="panel"><div style="font-size:17px">${castraLa("aen_accepted")}</div>
    <div style="margin-top:10px"><button class="btn" onclick="castraNpcClose()">${castraLaText("claude")}</button></div></div>`;
  const h = el("cwHud"); if(h) h.innerHTML = castraQuestHud();
}
function castraNpcFinish(npcId){
  const npc = CASTRA_NPCS[npcId], def = CASTRA_QUESTS[npc.quest], q = castraQuestState(npc.quest);
  if(q.s!==1 || q.n < def.need) return;
  q.s = 2;
  Object.keys(def.reward||{}).forEach(r=>{ CASTRA.res[r] = (CASTRA.res[r]||0) + def.reward[r]; });
  const heroes = CASTRA.heroes || (CASTRA.heroes = []);
  if(def.hero && !heroes.some(h=>h.id===def.hero)) heroes.push({ id:def.hero, lvl:1, xp:0 });
  castraSave();
  const hero = CASTRA_HEROES.find(h=>h.id===def.hero);
  toast("Heros novus!", (hero?hero.nm:"")+" · "+CASTRA_LA.aen_joined.nl);
  castraNpcTalk(npcId);
  const h = el("cwHud"); if(h) h.innerHTML = castraQuestHud();
}
