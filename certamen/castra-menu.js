/* ============================================================================
   CASTRA HEROUM — HOOFDMENU IN POKÉMON-STIJL
   ----------------------------------------------------------------------------
   Knop ☰ rechtsboven op de kampkaart opent een wit menuvak met zwarte rand en
   ▶-cursor (zoals het startmenu van de Pokémon-spellen). Onderdelen:
     Codex      de boomkaart van alle vormen (castra-codex.js)
     Milites    je team: sprite, naam, level, XP-balk, gezondheid, klasse, stats
     Heroes     je helden met level en fides
     Sacculus   grondstoffen, opslag en bouwoverzicht
     Opus       je lopende opdracht (tutorial / heldenopdracht)
     <naam>     spelerskaart: naam, roem, regio's, missies, codex-voortgang
     Servare    handmatig opslaan
     Exeo       terug naar het portaal
   Namen in het Latijn met Nederlandse uitleg. Laadt NA castra-codex.js en castra-tutorial.js.
   ============================================================================ */

const CASTRA_MENU_ITEMS = [
  { id:"codex",  la:"Codex",    nl:"alle soldaten en helden", unl:"codex" },
  { id:"milites",la:"Milites",  nl:"je team" },
  { id:"heroes", la:"Heroes",   nl:"je helden" },
  { id:"vergelijk",la:"Compara", nl:"vergelijken", unl:"vergelijk" },
  { id:"sacculus",la:"Sacculus",nl:"voorraad" },
  { id:"tabulae",la:"Tabulae",  nl:"kaarten met bonussen", unl:"tabulae" },
  { id:"opus",   la:"Opus",     nl:"opdracht" },
  { id:"profiel",la:"",         nl:"jouw kaart" },          // la = naam van de speler
  { id:"servare",la:"Servare",  nl:"opslaan" },
  { id:"restart",la:"Restart",  nl:"opnieuw beginnen" },          // bewust Nederlands/Engels, geen Latijn
  { id:"exeo",   la:"Exeo",     nl:"terug naar het portaal" },
];
let CASTRA_MENU = { open:false, view:null };

function castraMenuBtn(){
  if(document.getElementById("castraMenuBtn") || !document.getElementById("castraWrap")) return;
  const wrap = document.getElementById("castraWrap");
  const b = document.createElement("button");
  b.id = "castraMenuBtn"; b.setAttribute("aria-label","Menu");
  b.style.cssText = "position:absolute;top:6px;right:6px;z-index:60;min-width:44px;min-height:44px;font-size:22px;line-height:1;background:linear-gradient(#efe1b9,#e4d2a1);color:#2b1d0e;border:3px solid #4a3416;border-radius:8px;box-shadow:0 0 0 2px #c9a24a;cursor:pointer;font-family:inherit";
  b.textContent = "☰";
  b.onclick = ev=>{ ev.stopPropagation(); castraMenuToggle(); };
  b.onpointerdown = ev=>ev.stopPropagation();
  wrap.appendChild(b);
}
function castraMenuToggle(){ if(CASTRA_MENU.open) castraMenuClose(); else castraMenuOpen(); }
function castraMenuClose(){
  CASTRA_MENU.open = false; CASTRA_MENU.view = null;
  const m = document.getElementById("castraMenu"); if(m) m.remove();
}
function castraMenuOpen(){
  castraMenuClose(); CASTRA_MENU.open = true;
  const m = document.createElement("div"); m.id = "castraMenu";
  m.style.cssText = "position:fixed;inset:0;z-index:9980;background:rgba(0,0,0,.45);display:flex;justify-content:flex-end;align-items:flex-start;padding:8px;box-sizing:border-box";
  m.onclick = ev=>{ if(ev.target===m) castraMenuClose(); };
  document.body.appendChild(m);
  castraMenuRender();
}
// Menuvak (rechts) en, als er een onderdeel open is, het detailvak ernaast.
function castraMenuRender(){
  const m = document.getElementById("castraMenu"); if(!m) return;
  const name = castraPlayerName() || "Dux";
  const box = "background:linear-gradient(#efe1b9,#e4d2a1);color:#2b1d0e;border:4px solid #4a3416;border-radius:10px;box-shadow:0 0 0 2px #c9a24a,0 6px 20px rgba(0,0,0,.5);font-family:inherit";
  const items = CASTRA_MENU_ITEMS.map(it=>{
    const on = CASTRA_MENU.view===it.id, la = it.id==="profiel" ? name : it.la, lock = it.unl && typeof castraUnlocked==="function" && !castraUnlocked(it.unl), lu = lock ? castraUnlockDef(it.unl) : null;
    return `<div role="button" tabindex="0" onclick="castraMenuPick('${it.id}')" style="padding:8px 10px 8px 22px;font-size:20px;cursor:pointer;position:relative;min-height:44px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:center;${on?"background:rgba(120,80,20,.18)":""}">
      <span style="position:absolute;left:6px;top:50%;transform:translateY(-50%);visibility:${on?"visible":"hidden"}" class="castra-cur">▶</span>
      <b>${lock?"🔒 ":""}${esc(la)}</b><small style="opacity:.6;font-size:11px">${lock?"vanaf niveau "+lu.lvl:esc(it.nl)}</small></div>`;
  }).join("");
  const detail = CASTRA_MENU.view ? `<div id="castraMenuView" style="${box};flex:1;min-width:0;max-width:560px;max-height:calc(100vh - 16px);overflow:auto;padding:10px 12px;margin-right:8px">${castraMenuView(CASTRA_MENU.view)}</div>` : "";
  m.innerHTML = `<div style="display:flex;align-items:flex-start;width:100%;justify-content:flex-end">${detail}
    <div style="${box};flex:0 0 190px;width:190px;padding:4px 0">${items}</div></div>`;
  m.querySelectorAll("[role=button]").forEach((n,i)=>{
    n.onmouseenter = ()=>m.querySelectorAll(".castra-cur").forEach((c,j)=>c.style.visibility = (j===i || CASTRA_MENU_ITEMS[j].id===CASTRA_MENU.view) ? "visible" : "hidden");
  });
}
function castraMenuPick(id){
  { const it = CASTRA_MENU_ITEMS.find(x=>x.id===id); if(it && it.unl && typeof castraUnlocked==="function" && !castraUnlocked(it.unl)){ castraLockedToast(it.unl); return; } }
  if(id==="codex"){ castraMenuClose(); castraCodexOpen(); return; }
  if(id==="servare"){ castraSave(); castraToastLa("recte", "💾 Servatum"); castraMenuClose(); return; }
  if(id==="exeo"){ castraMenuClose(); castraLeave(); return; }
  CASTRA_MENU.view = id; CASTRA_MENU.rs = 0; castraMenuRender();
}

/* ---------- onderdelen ---------- */
const CASTRA_MV_ROW = "display:flex;gap:10px;align-items:center;padding:6px 0;border-top:1px solid #c2a96f";
function castraMenuBar(cur, max, col){
  const p = Math.max(0, Math.min(100, Math.round(100*cur/Math.max(1,max))));
  return `<div style="height:8px;background:#d3bf8c;border:1px solid #4a3416;border-radius:5px;overflow:hidden"><div style="width:${p}%;height:100%;background:${col}"></div></div>`;
}
function castraMenuSprite(formId, look){
  return `<div style="flex:0 0 52px;width:52px;height:52px;position:relative">${castraFsprHas(formId,"td")===true ? castraFsprHTML(formId,"td",52,"") : castraAvatarHTML(look,"down",1,52)}</div>`;
}
function castraMenuView(id){
  if(id==="milites") return castraMenuTeam();
  if(id==="heroes") return castraMenuHeroes();
  if(id==="sacculus") return castraMenuBag();
  if(id==="tabulae") return castraCardsView();
  if(id==="vergelijk") return castraMenuCompare();
  if(id==="opus") return castraMenuQuest();
  if(id==="profiel") return castraMenuProfile();
  if(id==="restart") return castraMenuRestart();
  return "";
}
function castraMenuTeam(){
  const list = CASTRA.soldiers || [];
  const cap = castraSoldierCap();
  const rows = list.map(s=>{
    const f = castraLine(s.line), st = castraStats(s), hurt = castraIsHurt(s), need = castraXpToNext(s.lvl);
    const ing = CASTRA_INGENIA.find(i=>i.id===s.ingenium), sel = CASTRA_MENU.sel===s.id;
    const det = sel ? `<div style="font-size:13px;margin-top:4px">${CASTRA_STATS.map(x=>`${esc(x.nm)} <b>${st[x.id]}</b>`).join(" · ")}<br>Aanleg: ${CASTRA_STATS.map(x=>`${esc(x.nm.slice(0,3))} ${s.indoles[x.id]||0}`).join(" ")}${ing?` · Karakter: ${esc(ing.nm)}`:""}</div>` : "";
    return `<div style="${CASTRA_MV_ROW};cursor:pointer;flex-wrap:nowrap" onclick="CASTRA_MENU.sel=${JSON.stringify(sel?null:s.id)};castraMenuRender()">
      ${castraMenuSprite(s.line, castraFormLook(f))}
      <div style="flex:1;min-width:0"><div style="display:flex;justify-content:space-between;gap:6px"><b>${s.insignis?"✨ ":""}${esc(castraSoldierName(s))}</b><span>Lv ${s.lvl}${s.lvl>=cap?" (max)":""}</span></div>
        <div style="font-size:12px;opacity:.7">${castraClassBadge(f,true)} ${esc(castraFolkNm(s.line))} · tier ${f.tier}${hurt?` · 🩹 ${castraHurtMin(s)} min`:""}${s.trainUntil?" · 🏋️":""}</div>
        <div style="display:flex;align-items:center;gap:6px;margin-top:3px"><small style="width:24px">${esc(CASTRA_STATS[0].nm.slice(0,3))}</small><div style="flex:1">${castraMenuBar(hurt?0:st.vita, st.vita, hurt?"#c33":"#3a3")}</div><b style="font-size:12px;width:64px;text-align:right">${hurt?0:st.vita}/${st.vita}</b></div>
        <div style="display:flex;align-items:center;gap:6px"><small style="width:24px">XP</small><div style="flex:1">${castraMenuBar(s.xp, need, "#38c")}</div><b style="font-size:12px;width:64px;text-align:right">${s.xp}/${need}</b></div>
        ${det}${sel?castraSkillsHTML(s,"s",s.id):""}</div></div>`;
  }).join("") || `<div class="note">Nullus miles. <small>Nog geen soldaten.</small></div>`;
  return `<h3 style="margin:0 0 6px">Milites <small>${list.length} / ${castraBarracksCap()}</small></h3>${rows}`;
}
function castraMenuHeroes(){
  const have = CASTRA.heroes || [];
  const rows = have.map(h=>{
    const d = CASTRA_HERO_DATA[h.id], st = castraHeroStats(h), cap = castraHeroCap(h), need = CASTRA_H.xpPerLvl*h.lvl;
    const hsel = CASTRA_MENU.hsel===h.id;
    return `<div style="${CASTRA_MV_ROW};cursor:pointer" onclick="CASTRA_MENU.hsel=${hsel?'null':JSON.stringify(h.id)};castraMenuRender()">
      <div style="flex:0 0 52px;width:52px;height:52px;position:relative">${castraAvatarHTML(d.look,"down",1,52)}</div>
      <div style="flex:1;min-width:0"><div style="display:flex;justify-content:space-between"><b>${esc(d.nm)}</b><span>Lv ${h.lvl} / ${cap}</span></div>
        <div style="font-size:12px;opacity:.7">${esc(CASTRA_TYPE_LA[d.type].sg)} · ${esc((CASTRA_VENATIO[d.region]||{nm:d.region}).nm)}${h.assigned?` · leidt ${esc(castraBuilding(h.assigned).nm)}`:""}</div>
        <div style="display:flex;align-items:center;gap:6px;margin-top:3px"><small style="width:30px">Fides</small><div style="flex:1">${castraMenuBar(h.fides||0,100,"#d4a017")}</div><b style="font-size:12px;width:40px;text-align:right">${h.fides||0}</b></div>
        <div style="display:flex;align-items:center;gap:6px"><small style="width:30px">XP</small><div style="flex:1">${castraMenuBar(h.xp,need,"#38c")}</div><b style="font-size:12px;width:40px;text-align:right">${h.xp}</b></div>
        <div style="font-size:12px;margin-top:2px">${CASTRA_STATS.map(x=>`${esc(x.nm.slice(0,3))} ${st[x.id]}`).join(" · ")}</div>${hsel?castraSkillsHTML({ hero:true, h },"h",h.id):"<div style=\"font-size:12px;opacity:.6;margin-top:2px\">🎓 "+castraSkillIds({ hero:true, h }).length+" / 4 artes — tik voor details</div>"}</div></div>`;
  }).join("") || `<div class="note">Nullus heros. <small>Nog geen helden: zoek sporen tijdens de jacht en praat met hen.</small></div>`;
  return `<h3 style="margin:0 0 6px">Heroes <small>${have.length} / ${Object.keys(CASTRA_HERO_DATA).length}</small></h3>${rows}`;
}
function castraMenuBag(){
  const cap = castraWalletCap();
  const res = CASTRA_RES.map(r=>`<div style="${CASTRA_MV_ROW}"><span style="font-size:24px;width:32px;text-align:center">${r.icon}</span><div style="flex:1"><b>${esc(r.nm)}</b> <small style="opacity:.6">${esc(r.nl)}</small></div><b>${CASTRA.res[r.id]||0}</b>${r.id!=="gloria"?`<small style="opacity:.6"> / ${cap}</small>`:""}</div>`).join("");
  const bld = CASTRA_BUILDINGS.filter(b=>b.phase===1 && !b.fixed).map(b=>`<span style="display:inline-block;margin:2px 6px 2px 0;font-size:13px">${b.icon||"🏠"} ${esc(b.nm)} <b>${castraLvl(b.id)||"🔨"}</b></span>`).join("");
  const its = Object.keys(CASTRA.items||{}).filter(k=>CASTRA.items[k] && CASTRA_ITEMS[k]).map(k=>`<span style="display:inline-block;margin:2px 8px 2px 0;font-size:15px">${CASTRA_ITEMS[k].icon} ${esc(CASTRA_ITEMS[k].nm)} <small style="opacity:.6">${esc(CASTRA_ITEMS[k].nl)}</small></span>`).join("");
  return `<h3 style="margin:0 0 6px">Sacculus <small>voorraad</small></h3>${res}<h4 style="margin:10px 0 2px">Res <small>voorwerpen</small></h4><div>${its||"<small style='opacity:.6'>Nog geen voorwerpen. Zoek ze in de regio's (✨).</small>"}</div><h4 style="margin:10px 0 2px">Aedificia</h4><div>${bld}</div>`;
}
function castraMenuQuest(){
  const T = CASTRA.tut, out = [];
  if(T && T.step===1) out.push(CASTRA_TUT_TEXT.bar1);
  if(T && T.step===2) out.push(CASTRA_TUT_TEXT.bar2);
  (typeof castraWobjOpus==="function" ? castraWobjOpus() : []).forEach(t=>out.push(t));
  Object.keys(CASTRA.quests||{}).forEach(id=>{
    if(typeof castraHero==="function" && castraHero(id)) return;            // al in je heroum
    const d = CASTRA_HERO_DATA[id]; if(!d || !CASTRA.quests[id].acc) return;
    const s = typeof castraStepOf==="function" ? castraStepOf(id) : null; if(s && s.hud) out.push({ la:s.hud.la, nl:d.nm+": "+s.hud.nl });
  });
  const html = out.map((t,i)=>`<div style="${CASTRA_MV_ROW};display:block"><div style="font-size:17px">${castraLaHTML(t.la, t.nl, "menu_opus"+i)}</div><div style="font-size:13px;opacity:.75">${esc(t.nl)}</div></div>`).join("");
  return `<h3 style="margin:0 0 6px">Opus <small>opdracht</small></h3>${html || `<div class="note">Nullum opus. <small>Geen lopende opdracht: praat met een held in de regio's.</small></div>`}`;
}
function castraMenuProfile(){
  const name = castraPlayerName() || "Dux";
  const seen = Object.keys(CASTRA.codex||{}).length, tot = CASTRA_FORM_LIST.length;
  const open = Object.keys(CASTRA_WORLDS).filter(id=>castraRegionOpen(id)).length;
  const done = CASTRA_P_MISSIONS.filter(m=>castraPMissionDone(m.id)).length;
  const rows = [
    ["Roem", `🏆 ${CASTRA.res.gloria||0}`],
    ["Soldaten", `${(CASTRA.soldiers||[]).length} / ${castraBarracksCap()}`],
    ["Helden", `${(CASTRA.heroes||[]).length} / ${Object.keys(CASTRA_HERO_DATA).length}`],
    ["Regio's open", `${open} / ${Object.keys(CASTRA_WORLDS).length}`],
    ["Missies gewonnen", `${done} / ${CASTRA_P_MISSIONS.length}`],
    ["Codex", `${seen} / ${tot} vormen`],
  ];
  const av = (typeof BM_IDENT!=="undefined" && BM_IDENT && BM_IDENT.avatar) ? `<div style="flex:0 0 96px;width:96px;height:96px;position:relative">${castraAvatarHTML(BM_IDENT.avatar,"down",1,96)}</div>` : "";
  const ti = typeof castraTitle==="function" ? castraTitle() : null, stars = Object.keys(CASTRA.coll||{}).filter(k=>k[0]==="v").length;
  const lv = typeof castraPLevelInfo==="function" ? castraPLevelInfo() : null;
  const lvHtml = lv ? `<div style="margin:2px 0 8px"><div style="display:flex;justify-content:space-between;font-size:14px"><b>Castra-niveau ${lv.L}</b><span style="opacity:.7">${lv.x - lv.a} / ${lv.b - lv.a} XP</span></div>${castraMenuBar(lv.x-lv.a, lv.b-lv.a, "#d4a017")}<div style="font-size:12px;opacity:.8;margin-top:2px">${lv.next?`Volgende ontgrendeling op niveau ${lv.next.lvl}: <b>${esc(lv.next.la)}</b> (${esc(lv.next.nl)})`:"Alles is ontgrendeld."}</div></div>` : "";
  return `<h3 style="margin:0 0 2px">${esc(name)}</h3><div style="font-size:14px;margin-bottom:6px;color:#7a2a14"><b>${ti?esc(ti.title):"—"}</b> <small>${ti?"("+esc(ti.nl)+")":""}</small>${stars?` · ⭐ ${stars}`:""}</div>${lvHtml}<div style="display:flex;gap:12px;align-items:center">${av}<div style="flex:1">${rows.map(r=>`<div style="display:flex;justify-content:space-between;padding:3px 0;border-top:1px solid #c2a96f"><span>${r[0]}</span><b>${r[1]}</b></div>`).join("")}</div></div>`;
}

/* ---------- Restart (alles wissen en opnieuw beginnen, met tutorial) ---------- */
function castraMenuRestart(){
  const step = CASTRA_MENU.rs || 0;
  const list = "soldaten, helden, gebouwen, grondstoffen, behaalde missies, codex en je tutorial-voortgang";
  if(step===0) return `<h3 style="margin:0 0 6px">Restart</h3>
    <p style="font-size:15px">Wil je Castra Heroum <b>helemaal opnieuw beginnen</b>? Dan begin je weer met het tutorial en een leeg kamp.</p>
    <p style="font-size:14px;opacity:.8">Je verliest: ${list}.</p>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px">
      <button class="btn btn-gold" style="min-height:44px" onclick="castraMenuPick('profiel')">Nee, terug</button>
      <button class="btn" style="min-height:44px" onclick="CASTRA_MENU.rs=1;castraMenuRender()">Ja, opnieuw beginnen…</button></div>`;
  return `<h3 style="margin:0 0 6px;color:#8a1c10">Weet je het zeker?</h3>
    <p style="font-size:15px"><b>Dit kan niet ongedaan worden gemaakt.</b> Alles wat je met ${esc(castraPlayerName()||"je profiel")} in Castra Heroum hebt opgebouwd wordt gewist, ook in de cloud-opslag van je profiel.</p>
    <p style="font-size:13px;opacity:.8">Je Battle Mode-profiel, avatar en munten blijven gewoon bestaan.</p>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px">
      <button class="btn btn-gold" style="min-height:44px" onclick="castraMenuPick('profiel')">Annuleren</button>
      <button class="btn" style="min-height:44px;border-color:#8a1c10;color:#8a1c10" onclick="castraRestartNow()">Ja, alles wissen</button></div>`;
}
function castraRestartNow(){
  castraDlgClose(true); CASTRA_WORLD_BUILT = {};
  CASTRA = castraNewState();
  CASTRA.help = { words:{}, sentences:{} }; CASTRA.traces = {};
  castraSave(); castraSync();                  // meteen ook naar de cloud, anders haalt een herlaad de oude save terug
  castraMenuClose();
  go("castraHome");
}

// Arte aan/uit zetten vanuit het menu (soldaat of held).
function castraMenuSkill(kind, id, skillId){
  const unit = kind==="h" ? { hero:true, h:(CASTRA.heroes||[]).find(x=>x.id===id) } : (CASTRA.soldiers||[]).find(x=>x.id===id);
  if(!unit || (kind==="h" && !unit.h)) return;
  const err = castraSkillToggle(unit, skillId);
  if(err==="vol") toast("Maximaal 4 artes", "Zet eerst een andere arte uit om deze te kiezen.");
  else if(err==="gevecht") toast("Niet tijdens een gevecht", "Kies je artes in het kamp.");
  else if(err==="vergrendeld") castraLockedToast("artes");
  castraMenuRender();
}


/* ---------- Compara: soldaten en helden en hun artes vergelijken ---------- */
function castraUnitById(id){
  if(String(id).indexOf("h:")===0){ const h = (CASTRA.heroes||[]).find(x=>x.id===String(id).slice(2)); return h ? { hero:true, h } : null; }
  return (CASTRA.soldiers||[]).find(x=>x.id===id) || null;
}
function castraUnitName(u){ return u.hero ? CASTRA_HERO_DATA[u.h.id].nm : castraSoldierName(u); }
// Richtwaarden (aanname: vijand met tutela 8); voor vergelijken, niet als exacte schade.
function castraUnitPower(u){
  const st = u.hero ? castraHeroStats(u.h) : castraStats(u), a = castraSkillAgg(castraSkillIds(u));
  const range = (CASTRA_P.rangeBase + st.ambitus*CASTRA_P.rangePerAmb)*(100+a.rng)/100/1000;
  const cd = Math.max(CASTRA_P.cdMin, Math.round((CASTRA_P.cdBase - st.celeritas*CASTRA_P.cdPerCel)*(100-a.cd)/100)), hps = 20/cd;
  const base = Math.max(1, st.impetus - Math.floor(8*2/5*(100-a.pierce)/100));
  let mult = (100+a.dmg)/100;
  if(a.nth) mult *= 1 + (a.nth.mult-1)/a.nth.n;
  if(a.doubleEvery) mult *= 1 + 1/a.doubleEvery;
  if(a.splash) mult *= 1 + 0.5*a.splash.pct/100;
  const dps = base*mult*hps;
  const team = [];
  if(a.auraDmg) team.push(`+${a.auraDmg}% schade voor torens binnen ${(a.auraRadius/1000).toFixed(1)} tegels`);
  if(a.global) team.push(`+${a.global}% schade voor alle torens`);
  if(a.regen) team.push(`+${a.regen} leven na elke golf`);
  if(a.reward) team.push(`+${a.reward}% beloning`);
  if(a.slow) team.push(`vertraagt ${a.slow.pct}% (elke ${a.slow.every}e treffer)`);
  return { st, a, range, hps, dps, team, skills: castraSkillsOf(u).filter(k=>k.equipped) };
}
function castraMenuCompare(){
  const all = (CASTRA.soldiers||[]).map(s=>({ id:s.id, u:s })).concat((CASTRA.heroes||[]).map(h=>({ id:"h:"+h.id, u:{ hero:true, h } })));
  const sel = CASTRA_MENU.cmp || (CASTRA_MENU.cmp = []);
  const chips = all.map(x=>{ const on = sel.includes(x.id), lv = x.u.hero ? x.u.h.lvl : x.u.lvl;
    return `<button class="btn ${on?"btn-gold":""}" style="margin:2px;min-height:40px;font-size:13px" onclick="castraMenuCmpPick('${x.id}')">${x.u.hero?"⭐ ":""}${esc(castraUnitName(x.u))} <small>Lv ${lv}</small></button>`; }).join("");
  let table = "";
  if(sel.length===2){
    const U = sel.map(castraUnitById);
    if(U[0] && U[1]){
      const P = U.map(castraUnitPower), best = (f,hi)=>{ const v = P.map(f); return v[0]===v[1] ? -1 : (hi ? (v[0]>v[1]?0:1) : (v[0]<v[1]?0:1)); };
      const cell = (i,txt,w)=>`<td style="padding:4px 6px;${w===i?"background:rgba(212,175,55,.35);font-weight:bold":""}">${txt}</td>`;
      const row = (lbl,f,fmt,hi)=>{ const w = best(f,hi); return `<tr><td style="padding:4px 6px;opacity:.75">${lbl}</td>${cell(0,fmt(P[0]),w)}${cell(1,fmt(P[1]),w)}</tr>`; };
      const cls = U.map(u=>{ const c = castraSkillClassOf(u); const b = typeof BM_CLASSES!=="undefined" ? BM_CLASSES.find(x=>x.id===c) : null; return b ? b.nm : (c==="myth"?"Monster":"—"); });
      table = `<table style="width:100%;border-collapse:collapse;margin-top:6px;font-size:14px">
        <tr><th></th><th style="text-align:left;padding:4px 6px">${esc(castraUnitName(U[0]))}</th><th style="text-align:left;padding:4px 6px">${esc(castraUnitName(U[1]))}</th></tr>
        <tr><td style="padding:4px 6px;opacity:.75">Klasse</td><td style="padding:4px 6px">${esc(cls[0])}</td><td style="padding:4px 6px">${esc(cls[1])}</td></tr>
        ${CASTRA_STATS.map(s=>row(esc(s.nm), p=>p.st[s.id], p=>p.st[s.id], true)).join("")}
        ${row("Bereik", p=>p.range, p=>p.range.toFixed(1)+" tegels", true)}
        ${row("Schoten per s", p=>p.hps, p=>p.hps.toFixed(2), true)}
        ${row("<b>Schade per s</b>", p=>p.dps, p=>"<b>≈ "+p.dps.toFixed(1)+"</b>", true)}
        <tr><td style="padding:4px 6px;opacity:.75;vertical-align:top">Artes in gebruik</td>${P.map(p=>`<td style="padding:4px 6px;vertical-align:top">${p.skills.length?p.skills.map(k=>`<div>🎓 <b>${esc(k.la)}</b><br><small>${esc(k.nl)}</small></div>`).join(""):"<small style='opacity:.6'>geen</small>"}</td>`).join("")}</tr>
        <tr><td style="padding:4px 6px;opacity:.75;vertical-align:top">Bonus voor het team</td>${P.map(p=>`<td style="padding:4px 6px;vertical-align:top;font-size:13px">${p.team.length?p.team.map(t=>"• "+esc(t)).join("<br>"):"<small style='opacity:.6'>geen</small>"}</td>`).join("")}</tr></table>
        <div style="font-size:12px;opacity:.7;margin-top:4px">Gemarkeerd = beste waarde. "Schade per s" is een richtwaarde (tegen een vijand met tutela 8) om opstellingen te vergelijken; teambonussen zitten er niet in.</div>`;
    }
  }
  return `<h3 style="margin:0 0 4px">Compara <small>vergelijken</small></h3>
    <div style="font-size:13px;opacity:.85;margin-bottom:4px">Kies twee soldaten of helden (${sel.length} / 2) en vergelijk hun stats en artes. Wijzig je artes onder Milites of Heroes en kom terug om het effect te zien.</div>
    <div>${chips||"<small>Nog geen soldaten.</small>"}</div>${table}`;
}
function castraMenuCmpPick(id){
  const sel = CASTRA_MENU.cmp || (CASTRA_MENU.cmp = []);
  const i = sel.indexOf(id); if(i>=0) sel.splice(i,1); else { if(sel.length>=2) sel.shift(); sel.push(id); }
  castraMenuRender();
}
