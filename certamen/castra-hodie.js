/* ============================================================================
   CASTRA HEROUM — "HODIE": WAT KAN VANDAAG? (voor wie thuis speelt)
   ----------------------------------------------------------------------------
   Een klein overzicht boven de kampkaart met een paar suggesties die vandaag kunnen:
   de wekelijkse uitdaging, een soldaat die bijna evolueert, de volgende missie, een
   baas die weer wakker is, een jachtopdracht, de dagelijkse quiz, nieuwe codexvermeldingen.
   Geen verplichting, geen reeks (streak) en geen straf als je een paar dagen niet speelt:
   alles blijft gewoon staan. In te klappen (onthouden in CASTRA.opts.hodieOff).
   Laadt NA castra-weekly.js.
   ============================================================================ */

function castraHodieItems(){
  const out = [], day = castraWDay(), w = CASTRA.wday || {};
  const worldOn = (typeof castraUnlocked!=="function") || castraUnlocked("wereld");
  const openRegions = Object.keys(CASTRA_WORLDS).filter(id=>!CASTRA_WORLDS[id].interior && castraRegionOpen(id));
  // 1. wekelijkse uitdaging
  if(typeof castraWeeklyAvailable==="function" && castraWeeklyAvailable()){
    const W = castraWkState(), info = castraWkInfoAt(castraNow());
    out.push({ icon:"📅", t: W.id===info.id && W.win ? `Wekelijkse uitdaging "${info.type.nl}": gewonnen, record ${W.best}. Verbeter je record of probeer het bonusdoel.` : `Wekelijkse uitdaging: "${info.type.nl}" (${info.type.kind.toLowerCase()}).`, go:"proelium" });
  }
  // 2. evolutie
  const ev = [];
  (CASTRA.soldiers||[]).forEach(s=>{
    let info; try{ info = castraEvoInfo(s); }catch(e){ return; }
    if(!info || info.max) return;
    if(info.lvlOk) ev.push({ pr:0, t:`${castraSoldierName(s)} kan evolueren (in de campus).` });
    else if(s.lvl >= info.need-3 && s.lvl < info.need) ev.push({ pr:1, t:`${castraSoldierName(s)} staat op gradus ${s.lvl} en evolueert op gradus ${info.need}.` });
  });
  ev.sort((a,b)=>a.pr-b.pr).slice(0,1).forEach(e=>out.push({ icon:"📈", t:e.t }));
  // 3. volgende missie
  const next = CASTRA_P_MISSIONS.find(m=>castraPMissionOpen(m) && !castraPMissionDone(m.id));
  if(next) out.push({ icon:"⚔️", t:`Volgende missie: ${next.nm} (${next.nl}).`, go:"proelium" });
  // 4. baas die weer wakker is
  if(worldOn){
    const bosses = CASTRA_WENT.filter(e=>e.kind==="boss" && e.daily && openRegions.indexOf((CASTRA_WORLDS[e.region]||{}).parent)>=0 && w["boss_"+e.id]!==day);
    if(bosses.length) out.push({ icon:"👻", t:`Een baas is weer wakker in ${bosses.slice(0,2).map(b=>CASTRA_WORLDS[b.region].nm).join(" en ")}${bosses.length>2?" en elders":""}.` });
    // 5. jachtopdracht
    const bs = (CASTRA.bounties||{}), open = openRegions.filter(r=>CASTRA_WENT.some(e=>e.id==="venator_"+r) && !(bs[r] && bs[r].day===day && bs[r].done));
    if(open.length){ const r = open[0], b = bs[r]; out.push({ icon:"🏹", t: b && b.day===day && b.acc ? `Jachtopdracht in ${CASTRA_WORLDS[r].nm}: ${b.n}/${b.need} vijanden verslagen.` : `De Venator in ${CASTRA_WORLDS[r].nm} heeft een jachtopdracht.` }); }
  }
  // 6. quiz
  if(worldOn && (typeof castraUnlocked!=="function" || castraUnlocked("puzzels")) && w.quiz_senator!==day && castraRegionOpen("latium")) out.push({ icon:"📜", t:"De Senator in Latium heeft een woordenquiz (levert beloning op, één keer per dag)." });
  // 7. codex
  const total = CASTRA_FORM_LIST.length, seen = Object.keys(CASTRA.codex||{}).length;
  if(seen<total && (typeof castraUnlocked!=="function" || castraUnlocked("codex"))) out.push({ icon:"📖", t:`Codex: ${seen} van ${total} soldatensoorten ontdekt.` });
  return out.slice(0,5);
}
function castraHodieHTML(){
  const opts = CASTRA.opts || (CASTRA.opts = {});
  const items = castraHodieItems();
  if(!items.length) return "";
  if(opts.hodieOff) return `<div style="text-align:center;margin:4px 0"><button class="btn" style="min-height:36px;font-size:13px" onclick="castraHodieToggle()">🌅 Hodie tonen</button></div>`;
  return `<div id="castraHodie" class="panel" style="margin:4px 0 8px;padding:8px 12px">
    <div style="display:flex;justify-content:space-between;align-items:center;gap:8px"><b>🌅 ${castraLaHTML("Hodie haec facere potes.", "Vandaag kun je dit doen. Niets hoeft.", "hodie_h")}</b><button class="btn" style="min-height:32px;font-size:12px;padding:2px 10px" onclick="castraHodieToggle()">verberg</button></div>
    <ul style="margin:6px 0 0;padding-left:0;list-style:none">${items.map(i=>`<li style="margin:3px 0;font-size:14px">${i.icon} ${esc(i.t)}${i.go==="proelium"?` <a href="#" onclick="go('castraProelium');return false" style="color:var(--hi,#d4af37)">→ missies</a>`:""}</li>`).join("")}</ul></div>`;
}
function castraHodieToggle(){
  const o = CASTRA.opts || (CASTRA.opts = {}); o.hodieOff = !o.hodieOff; castraSave();
  const old = document.getElementById("castraHodie"), btn = old || (document.querySelector("#castraRes + div"));
  go("castraHome");
}
const _castraHomeHodie0 = SCREENS.castraHome;
SCREENS.castraHome = function(){
  _castraHomeHodie0();
  const r = el("castraRes"); if(r) r.insertAdjacentHTML("afterend", castraHodieHTML());
};
Object.assign(CASTRA_GLOSS, { "hodie":"vandaag", "haec":"dit", "facere":"doen", "potes":"je kunt" });

