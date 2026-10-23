/* ============================================================================
   CASTRA HEROUM — CONTUBERNIUM (je party van acht) EN WISSELEN IN HET GEVECHT (zoals in Pokémon)
   ----------------------------------------------------------------------------
   Een contubernium was in het Romeinse leger de kleinste eenheid: acht legionairs die één tent deelden. Zo heet nu ook je
   groep van maximaal acht soldaten (twee meer dan de zes van Pokémon). Alleen die acht kunnen op jacht mee; de rest van je
   soldaten blijft in de barakken (en krijgt ervaring van het Contubernium-effect, castra-xp.js).
   - Beheer: menu ☰ → Contubernium: soldaten erin of eruit zetten en bepalen wie vooraan staat. Nieuwe soldaten komen er vanzelf
     bij zolang er plaats is, tenzij je ze er zelf uit hebt gehaald (CASTRA.party, CASTRA.partyOut).
   - Wisselen: in een jachtgevecht heeft het menu een knop Wissel. Een soldaat wisselen kost je beurt (de vijand slaat toe), net
     als in Pokémon; valt je soldaat om en is er nog een gezonde reserve, dan moet je een nieuwe kiezen (dat kost geen beurt). Pas
     als er niemand meer over is, verlies je het gevecht. Elke soldaat die omvalt raakt gewond (zoals eerder).
   - Ervaring: wie meegevochten heeft en niet omviel, krijgt de helft van de ervaring van wie de laatste klap gaf.
   Laadt NA castra-moves.js, castra-vscene.js en castra-menu.js.
   ============================================================================ */
const CASTRA_PARTY_MAX = 8;
function castraPartySync(){
  const ids = new Set((CASTRA.soldiers||[]).map(s=>s.id)), out = CASTRA.partyOut || (CASTRA.partyOut = {});
  let p = (CASTRA.party || []).filter(id=>ids.has(id));
  (CASTRA.soldiers||[]).forEach(s=>{ if(p.length<CASTRA_PARTY_MAX && p.indexOf(s.id)<0 && !out[s.id]) p.push(s.id); });
  CASTRA.party = p.slice(0, CASTRA_PARTY_MAX); return CASTRA.party;
}
function castraPartyHas(id){ return castraPartySync().indexOf(id)>=0; }
function castraPartyList(){ const m = {}; (CASTRA.soldiers||[]).forEach(s=>m[s.id]=s); return castraPartySync().map(id=>m[id]).filter(Boolean); }
function castraPartyHealthy(){ return castraPartyList().filter(s=>!castraIsHurt(s) && !s.job); }
function castraPartyToggle(id){
  const p = castraPartySync(), i = p.indexOf(id), out = CASTRA.partyOut;
  if(i>=0){ p.splice(i,1); out[id] = 1; }
  else { if(p.length>=CASTRA_PARTY_MAX){ toast("🎖️", "Je contubernium zit vol (acht soldaten). Haal er eerst een uit."); return; } p.push(id); delete out[id]; }
  CASTRA.party = p; castraSave(); castraMenuRender();
}
function castraPartyLead(id){ const p = castraPartySync(), i = p.indexOf(id); if(i>0){ p.splice(i,1); p.unshift(id); CASTRA.party = p; castraSave(); castraMenuRender(); } }

/* ---------- menu: Contubernium ---------- */
(function(){
  const i = CASTRA_MENU_ITEMS.findIndex(x=>x.id==="milites");
  CASTRA_MENU_ITEMS.splice(i<0 ? 1 : i+1, 0, { id:"party", la:"Contubernium", nl:"je groep van acht" });
})();
const _castraMenuViewPt0 = castraMenuView;
castraMenuView = function(id){
  if(id!=="party") return _castraMenuViewPt0(id);
  const p = castraPartySync(), btn = "min-height:36px;padding:2px 10px;margin-left:6px;font-size:13px;font-family:inherit;cursor:pointer;border:2px solid var(--parch-edge,#4a3416);border-radius:8px;background:#e8c96a;color:var(--parch-ink,#2b1d0e)";
  const row = s=>{ const f = castraLine(s.line), inP = p.indexOf(s.id)>=0, hurt = castraIsHurt(s);
    return `<div style="${CASTRA_MV_ROW};flex-wrap:wrap">${castraMenuSprite(s.line, castraFormLook(f))}<div style="flex:1;min-width:130px"><b>${s.insignis?"✨ ":""}${esc(castraSoldierName(s))}</b> <small>Lv ${s.lvl} · tier ${f.tier} · ${esc((CASTRA_TYPE_LA[f.type]||{sg:f.type}).sg)}${hurt?" · 🩹":""}${s.job?" · ⚒️":""}</small></div>
      <div>${inP && p.indexOf(s.id)>0 ? `<button style="${btn}" onclick="castraPartyLead('${s.id}')" title="Zet vooraan">↑ vooraan</button>` : ""}<button style="${btn};${inP?"background:#cfd8c0":""}" onclick="castraPartyToggle('${s.id}')">${inP?"✔ in contubernium":"+ toevoegen"}</button></div></div>`; };
  const inList = p.map(id=>(CASTRA.soldiers||[]).find(s=>s.id===id)).filter(Boolean), rest = (CASTRA.soldiers||[]).filter(s=>p.indexOf(s.id)<0);
  return `<h3 style="margin:0 0 6px">Contubernium <small>${p.length} / ${CASTRA_PARTY_MAX}</small></h3>
    <div style="font-size:14px;margin-bottom:6px">Een contubernium waren acht legionairs die één tent deelden. Alleen deze acht kunnen op jacht mee; wissel in het gevecht met de knop Wissel. De eerste staat vooraan.</div>
    ${inList.map(row).join("") || `<div class="note">Nog niemand in je contubernium.</div>`}
    ${rest.length ? `<h4 style="margin:12px 0 2px">In de barakken</h4>${rest.map(row).join("")}` : ""}`;
};
/* ---------- reserve en wisselen in het gevecht ---------- */
function castraMvReserve(V){
  if(!V || !V.mine || V.mine.dux) return [];
  const fainted = (V.fainted||[]).map(u=>u.id);
  return castraPartyHealthy().filter(s=>s.id!==V.mine.id && fainted.indexOf(s.id)<0);
}
function castraVSwitchPick(sid, forced){
  const V = CASTRA_V; if(!V || !V.s || V.over || V.busy) return;
  const s = castraMvReserve(V).find(x=>x.id===sid); if(!s) return;
  V.used = V.used || [V.mine.id]; if(V.used.indexOf(s.id)<0) V.used.push(s.id);
  V.mine = s; V.myStats = castraStats(s); V.myType = castraLine(s.line).type; V.dmgTaken = 0;
  V.s.me = castraMvSide(s, V.myStats, V.myType, castraMvName(s)); V.s.me.guard = false; castraMvSync(V);
  V.switching = false; V.forced = false; V.switchIn = true; V.lastMe = "wissel";
  castraFsprProbe([[s.line,"portrait"],[s.line,"battle_back"]], ()=>{ if(CASTRA_V===V && !V.over) castraVRender("battle"); });
  V.log = [ castraLaHTML(esc(V.s.me.name)+" adest!", esc(V.s.me.name)+" komt in het gevecht!", "mv_wissel") ];
  if(forced){ castraVRender("battle"); return; }
  castraMvPlay(V, null);                           // wisselen kost je beurt: de vijand slaat toe
}
function castraVSwitchOpen(){ const V = CASTRA_V; if(!V || V.over || V.busy) return; V.switching = !V.switching; castraVRender("battle"); }
function castraVSwitchMenuHTML(V){
  const list = castraMvReserve(V);
  const cards = list.map(s=>{ const f = castraLine(s.line), st = castraStats(s);
    return `<button class="tile" style="min-height:0;padding:8px 12px;text-align:left" onclick="castraVSwitchPick('${s.id}',${V.forced?"true":"false"})"><h3 style="margin:0 0 2px">${s.insignis?"✨ ":""}${esc(castraSoldierName(s))} <small>${castraLaText("gradus")} ${s.lvl} · ${esc((CASTRA_TYPE_LA[f.type]||{sg:f.type}).sg)}</small></h3>
      <p style="margin:0">${CASTRA_STATS.slice(0,3).map(x=>x.nm.slice(0,3)+" "+st[x.id]).join(" · ")}</p></button>`; }).join("");
  return `<div style="margin-top:6px"><div style="font-size:16px;margin-bottom:6px"><b>🔄 ${V.forced ? "Je soldaat is gevallen. Kies een nieuwe." : "Wissel van soldaat (kost je beurt)"}</b></div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:6px">${cards || `<div class="note">Geen reserve beschikbaar.</div>`}</div>
    ${V.forced ? "" : `<button class="btn" style="margin-top:8px;min-height:44px" onclick="castraVSwitchOpen()">Terug</button>`}</div>`;
}
// het menu van het gevecht: wisselkeuze, of een extra knop Wissel
const _castraVBattleHTMLPt0 = castraVBattleHTML;
castraVBattleHTML = function(){
  const V = CASTRA_V; let html = _castraVBattleHTMLPt0.apply(this, arguments);
  if(!V || !V.s) return html;
  const reserve = castraMvReserve(V).length;
  if(V.forced || V.switching){
    const menu = castraVSwitchMenuHTML(V);
    return html.replace(/(<div id="castraVMenu"[^>]*>)[^]*?(<\/div><\/div>\s*$)/, (m,a,b)=>a+menu+b);
  }
  if(reserve && !V.ask) html = html.replace(/(<button class="btn" style="flex:1;min-height:46px" onclick="castraVFlee\(\)">)/, `<button class="btn" style="flex:1;min-height:46px" onclick="castraVSwitchOpen()" title="Wissel van soldaat (kost je beurt)">🔄 Wissel (${reserve})</button>$1`);
  return html;
};
