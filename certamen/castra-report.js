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
// Zelfde stijl als het resultaatscherm van Battle Mode (bm-gain, bm-xpbar): getallen die oplopen en balkjes die vollopen.
function castraBReportHTML(B){
  const D = castraBReportData(B), st = D.st, s = B.sim, win = s.over==="win", anim = [];
  const row = (ic, id, val, lbl)=>{ anim.push({ id, val }); return `<div class="bm-gain-row" style="margin-top:8px"><span class="bm-gain-ic">${ic}</span><span class="bm-gain-plus" id="${id}">+0</span><span class="bm-gain-lbl" style="text-transform:none;letter-spacing:0;font-size:15px;color:var(--text,#f1e6c4)">${lbl}</span></div>`; };
  const bar = (id, pct, grad)=>{ anim.push({ bar:id, pct }); return `<div class="bm-xpbar" style="margin:4px auto 2px"><div class="bm-xpbar-fill" id="${id}" style="${grad?`background:${grad}`:""}"></div></div>`; };
  const hp = `<div class="bm-gain-row"><span class="bm-gain-ic">❤️</span><span class="bm-gain-new" id="crHp" style="color:${s.baseHp>=6?"var(--green-bright)":s.baseHp>=3?"var(--hi-bright)":"#e07060"}">0</span><span class="bm-gain-lbl">/ ${CASTRA_P.baseHp} levens van het kamp</span></div>`
    + bar("crHpBar", Math.round(100*s.baseHp/CASTRA_P.baseHp), "linear-gradient(90deg,#2f7d3a,var(--green-bright))");
  anim.push({ id:"crHp", val:s.baseHp, plain:true });
  const soldiers = D.rows.map((r,i)=>{ const pct = Math.round(100*r.d/D.total);
    return `<div style="margin-top:10px"><div class="bm-gain-row" style="justify-content:space-between;max-width:320px;margin:0 auto"><span style="font-size:15px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:55%">${esc(r.nm)}</span><span><b class="bm-gain-plus" id="crD${i}" style="font-size:18px">+0</b> <span class="bm-gain-lbl">schade · ${pct}%</span></span></div>${bar("crB"+i, pct)}</div>`.replace('<b class="bm-gain-plus"','<b class="bm-gain-plus"'); }).join("");
  D.rows.forEach((r,i)=>anim.push({ id:"crD"+i, val:r.d }));
  const eff = [];
  if(st.muri) eff.push(row("🧱","crE0",st.muri,"keer vertraagde Murus et sagittae een vijand"));
  if(st.pers) eff.push(row("🐎","crE1",st.pers,"extra schade door Persecutio"));
  if(st.imp)  eff.push(row("⚔️","crE2",st.imp,"extra schade door Impete!"));
  if(st.prev) eff.push(row("🛡️","crE3",st.prev,"schade voorkomen door pantser en schilden"));
  if(st.heal) eff.push(row("⚕️","crE4",st.heal,"levenspunten hersteld door genezers"));
  const why = !win ? `<div id="cbWhy" style="margin-top:12px;padding-top:8px;border-top:1px solid rgba(138,109,47,.4)"><div style="font-size:15px">${castraLaHTML("Quid difficile erat?", "Wat was moeilijk? (optioneel)", "why_q")}</div>
      <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px">${[["hard","te moeilijk"],["unclear","onduidelijk"],["setup","verkeerde opstelling"],["long","te lang"],["other","anders"]].map(([k,t])=>`<button class="btn" style="min-height:40px" onclick="castraBFeedback('${k}')">${t}</button>`).join("")}</div></div>` : "";
  B._rep = anim;
  return `<div class="panel" style="margin-top:10px"><h3>📊 Gevechtsrapport</h3><div class="bm-gain" style="max-width:340px;margin:0 auto;align-items:stretch">${hp}
    <div class="note" style="margin:12px 0 0;text-align:center">Schade per soldaat</div>${soldiers}
    ${eff.length?`<div class="note" style="margin:14px 0 0;text-align:center">Wat gebeurde er nog meer</div>${eff.join("")}`:""}</div>
    ${D.obs.length?`<div style="margin-top:12px;font-size:14px;opacity:.95">${D.obs.map(o=>"💡 "+esc(o)).join("<br>")}</div>`:""}${why}</div>`;
}
// Balken laten vollopen en getallen laten oplopen (zoals bmRenderXpGain in battle.js); bij uitgeschakelde animaties direct.
function castraBReportAnimate(B){
  const list = B._rep || []; if(!list.length) return;
  const dur = (typeof BM_META!=="undefined" && BM_META && BM_META.animations===false) ? 0 : 1000;
  list.forEach((a,i)=>{
    const go = ()=>{
      if(a.bar){ const e = document.getElementById(a.bar); if(e) e.style.width = a.pct+"%"; }
      else if(typeof bmCountTo==="function") bmCountTo(a.id, 0, a.val, dur, a.plain ? "" : "+");
      else { const e = document.getElementById(a.id); if(e) e.textContent = (a.plain?"":"+")+a.val; }
    };
    if(!dur) go(); else setTimeout(()=>requestAnimationFrame(go), 120 + Math.floor(i/2)*110);
  });
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
  try{ box.insertAdjacentHTML("beforeend", castraBReportHTML(B)); castraBReportAnimate(B); }catch(e){}
};
Object.assign(CASTRA_GLOSS, { "quid":"wat", "difficile":"moeilijk", "erat":"was", "gratias":"dank", "tibi":"aan jou", "ago":"ik doe" });
