/* ============================================================================
   CASTRA HEROUM — GEVECHTSRAPPORT EN VERLIESVRAAG
   ----------------------------------------------------------------------------
   Na elk solo-gevecht (niet Legio, niet Colosseum) een compact rapport dat de
   deterministische simulatie uitlegbaar maakt, ook voor wie thuis speelt zonder
   docent: schade per soldaat, wat synergieën, pantser, schilden, genezers en
   bevelen deden, en de belangrijkste reden dat het kamp schade kreeg. De
   observaties zijn voorzichtig geformuleerd ("mogelijk"), geen vaste adviezen.
   Na een verlies een optionele eenmalige vraag "Quid difficile erat?" (anoniem
   geteld per missie, castra-metrics.js: m_<missie>/fb_<reden>).
   Laadt NA castra-metrics.js.
   ============================================================================ */

function castraRepName(t){
  const sid = String(t.sid||"");
  if(sid.indexOf("hero_")===0){ const h = CASTRA_HERO_DATA[sid.slice(5)]; return h ? h.nm : "Held"; }
  const s = (CASTRA.soldiers||[]).find(x=>x.id===t.sid);
  if(s) return castraSoldierName(s);
  return t.line==="rom_hastatus" && sid==="dux" ? "Dux" : (castraLine(t.line).nm || "Soldaat");
}
function castraBReportData(B){
  const s = B.sim, st = s.stat, towers = s.towers, total = towers.reduce((a,t)=>a+(st.dmg[t.id]||0),0) || 1;
  const rows = towers.map(t=>({ t, nm:castraRepName(t), d:st.dmg[t.id]||0 })).sort((a,b)=>b.d-a.d);
  const obs = [];
  const win = s.over==="win";
  // belangrijkste reden voor kampschade
  if(st.leaks.length){
    const cnt = {}; st.leaks.forEach(l=>{ const k = l.role || l.type; cnt[k] = (cnt[k]||0)+1; });
    const top = Object.keys(cnt).sort((a,b)=>cnt[b]-cnt[a])[0];
    if(CASTRA_P_ROLES[top]){ const R = CASTRA_P_ROLES[top]; obs.push(`De meeste doorbraken (${cnt[top]} van ${st.leaks.length}) kwamen van ${R.nl.toLowerCase()} ${R.icon}. ${R.ex.tip.replace(/^Tip: /,"")}`); }
    else { const w = st.leaks[0].wave+1; obs.push(`Er braken ${st.leaks.length} vijanden door (eerste in golf ${w}). Misschien bestrijkt je opstelling een deel van het pad niet of staan je soldaten te ver uit elkaar.`); }
  }
  if(rows.length>=4){ const low = rows[rows.length-1]; if(low.d/total < 0.05) obs.push(`${low.nm} deed bijna geen schade (${Math.round(100*low.d/total)}%). Mogelijk staat hij te ver van het pad.`); }
  if(st.heal > total*0.15) obs.push(`Genezers herstelden ${st.heal} levenspunten, een flink deel van je schade. Boogschutters mikken eerst op genezers: zorg dat die binnen bereik van de genezer staan.`);
  const L = castraSynLinks(towers), synNone = !L.muri.length && towers.some(t=>t.type==="inf") && towers.some(t=>t.type==="rng");
  if(synNone) obs.push("Je infanterie en boogschutters stonden niet binnen 3 tegels van elkaar, dus Murus et sagittae was niet actief.");
  if(B.sim.cmdOn && !B.cmdUsed && !win) obs.push(`Je gebruikte geen bevelen (${s.energy} ⚡ over). Impete! of State! kan een dreigende golf nog keren.`);
  return { rows, total, obs:obs.slice(0,3), st };
}
function castraBReportHTML(B){
  const D = castraBReportData(B), st = D.st, win = B.sim.over==="win";
  const bars = D.rows.map(r=>`<div style="display:flex;align-items:center;gap:8px;margin:2px 0;font-size:14px"><span style="width:38%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(r.nm)}</span><span style="flex:1;height:10px;border-radius:5px;background:rgba(255,255,255,.12)"><span style="display:block;height:100%;border-radius:5px;background:#d4af37;width:${Math.round(100*r.d/D.total)}%"></span></span><span style="width:48px;text-align:right">${Math.round(100*r.d/D.total)}%</span></div>`).join("");
  const facts = [];
  if(st.muri) facts.push(`🧱 Murus et sagittae vertraagde vijanden ${st.muri}×`);
  if(st.pers) facts.push(`🐎 Persecutio gaf ${st.pers} extra schade`);
  if(st.imp) facts.push(`⚔️ Impete! gaf ${st.imp} extra schade`);
  if(st.prev) facts.push(`🛡️ pantser en schilden voorkwamen ${st.prev} schade`);
  if(st.heal) facts.push(`⚕️ genezers herstelden ${st.heal} levenspunten`);
  const why = !win ? `<div id="cbWhy" style="margin-top:10px;padding-top:8px;border-top:1px solid rgba(138,109,47,.4)"><div style="font-size:15px">${castraLaHTML("Quid difficile erat?", "Wat was moeilijk? (optioneel)", "why_q")}</div>
      <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px">${[["hard","te moeilijk"],["unclear","onduidelijk"],["setup","verkeerde opstelling"],["long","te lang"],["other","anders"]].map(([k,t])=>`<button class="btn" style="min-height:40px" onclick="castraBFeedback('${k}')">${t}</button>`).join("")}</div></div>` : "";
  return `<div class="panel" style="margin-top:10px"><h3>📊 Gevechtsrapport</h3>
    <div class="note" style="margin-bottom:4px">Schade per soldaat (aandeel van het totaal)</div>${bars}
    ${facts.length?`<div style="margin-top:8px;font-size:14px">${facts.map(esc).join("<br>")}</div>`:""}
    ${D.obs.length?`<div style="margin-top:8px;font-size:14px;opacity:.95">${D.obs.map(o=>"💡 "+esc(o)).join("<br>")}</div>`:""}${why}</div>`;
}
function castraBFeedback(k){
  const B = CASTRA_B, box = el("cbWhy"); if(!B || !box || B.fbDone) return; B.fbDone = true;
  castraTDSync({ ["m_"+B.mission.id+"/fb_"+k]:1 });
  box.innerHTML = `<div style="font-size:15px">${castraLaHTML("Gratias tibi ago!", "Bedankt! Je antwoord helpt het spel beter te maken.", "why_thx")}</div>`;
}
const _castraBFinishRep0 = castraBFinish;
castraBFinish = function(){
  _castraBFinishRep0();
  const B = CASTRA_B; if(!B || B.legio || B.endless) return;
  const box = el("cbResult"); if(!box) return;
  try{ box.insertAdjacentHTML("beforeend", castraBReportHTML(B)); }catch(e){}
};
Object.assign(CASTRA_GLOSS, { "quid":"wat", "difficile":"moeilijk", "erat":"was", "gratias":"dank", "tibi":"aan jou", "ago":"ik doe" });
