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
  { id:"codex",  la:"Codex",    nl:"alle soldaten en helden" },
  { id:"milites",la:"Milites",  nl:"je team" },
  { id:"heroes", la:"Heroes",   nl:"je helden" },
  { id:"sacculus",la:"Sacculus",nl:"voorraad" },
  { id:"opus",   la:"Opus",     nl:"opdracht" },
  { id:"profiel",la:"",         nl:"jouw kaart" },          // la = naam van de speler
  { id:"servare",la:"Servare",  nl:"opslaan" },
  { id:"exeo",   la:"Exeo",     nl:"terug naar het portaal" },
];
let CASTRA_MENU = { open:false, view:null };

function castraMenuBtn(){
  if(document.getElementById("castraMenuBtn") || !document.getElementById("castraWrap")) return;
  const wrap = document.getElementById("castraWrap");
  const b = document.createElement("button");
  b.id = "castraMenuBtn"; b.setAttribute("aria-label","Menu");
  b.style.cssText = "position:absolute;top:6px;right:6px;z-index:60;min-width:44px;min-height:44px;font-size:22px;line-height:1;background:#fff;color:#000;border:3px solid #000;border-radius:8px;box-shadow:0 0 0 2px #fff;cursor:pointer;font-family:inherit";
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
  const box = "background:#fff;color:#000;border:4px solid #000;border-radius:10px;box-shadow:0 0 0 3px #fff;font-family:inherit";
  const items = CASTRA_MENU_ITEMS.map(it=>{
    const on = CASTRA_MENU.view===it.id, la = it.id==="profiel" ? name : it.la;
    return `<div role="button" tabindex="0" onclick="castraMenuPick('${it.id}')" style="padding:8px 10px 8px 22px;font-size:20px;cursor:pointer;position:relative;min-height:44px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:center;${on?"background:#e8e8e8":""}">
      <span style="position:absolute;left:6px;top:50%;transform:translateY(-50%);visibility:${on?"visible":"hidden"}" class="castra-cur">▶</span>
      <b>${esc(la)}</b><small style="opacity:.6;font-size:11px">${esc(it.nl)}</small></div>`;
  }).join("");
  const detail = CASTRA_MENU.view ? `<div id="castraMenuView" style="${box};flex:1;min-width:0;max-width:560px;max-height:calc(100vh - 16px);overflow:auto;padding:10px 12px;margin-right:8px">${castraMenuView(CASTRA_MENU.view)}</div>` : "";
  m.innerHTML = `<div style="display:flex;align-items:flex-start;width:100%;justify-content:flex-end">${detail}
    <div style="${box};flex:0 0 190px;width:190px;padding:4px 0">${items}</div></div>`;
  m.querySelectorAll("[role=button]").forEach((n,i)=>{
    n.onmouseenter = ()=>m.querySelectorAll(".castra-cur").forEach((c,j)=>c.style.visibility = (j===i || CASTRA_MENU_ITEMS[j].id===CASTRA_MENU.view) ? "visible" : "hidden");
  });
}
function castraMenuPick(id){
  if(id==="codex"){ castraMenuClose(); castraCodexOpen(); return; }
  if(id==="servare"){ castraSave(); castraToastLa("recte", "💾 Servatum"); castraMenuClose(); return; }
  if(id==="exeo"){ castraMenuClose(); castraLeave(); return; }
  CASTRA_MENU.view = id; castraMenuRender();
}

/* ---------- onderdelen ---------- */
const CASTRA_MV_ROW = "display:flex;gap:10px;align-items:center;padding:6px 0;border-top:1px solid #ccc";
function castraMenuBar(cur, max, col){
  const p = Math.max(0, Math.min(100, Math.round(100*cur/Math.max(1,max))));
  return `<div style="height:8px;background:#ddd;border:1px solid #000;border-radius:5px;overflow:hidden"><div style="width:${p}%;height:100%;background:${col}"></div></div>`;
}
function castraMenuSprite(formId, look){
  return `<div style="flex:0 0 52px;width:52px;height:52px;position:relative">${castraFsprHas(formId,"td")===true ? castraFsprHTML(formId,"td",52,"") : castraAvatarHTML(look,"down",1,52)}</div>`;
}
function castraMenuView(id){
  if(id==="milites") return castraMenuTeam();
  if(id==="heroes") return castraMenuHeroes();
  if(id==="sacculus") return castraMenuBag();
  if(id==="opus") return castraMenuQuest();
  if(id==="profiel") return castraMenuProfile();
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
        ${det}</div></div>`;
  }).join("") || `<div class="note">Nullus miles. <small>Nog geen soldaten.</small></div>`;
  return `<h3 style="margin:0 0 6px">Milites <small>${list.length} / ${castraBarracksCap()}</small></h3>${rows}`;
}
function castraMenuHeroes(){
  const have = CASTRA.heroes || [];
  const rows = have.map(h=>{
    const d = CASTRA_HERO_DATA[h.id], st = castraHeroStats(h), cap = castraHeroCap(h), need = CASTRA_H.xpPerLvl*h.lvl;
    return `<div style="${CASTRA_MV_ROW}">
      <div style="flex:0 0 52px;width:52px;height:52px;position:relative">${castraAvatarHTML(d.look,"down",1,52)}</div>
      <div style="flex:1;min-width:0"><div style="display:flex;justify-content:space-between"><b>${esc(d.nm)}</b><span>Lv ${h.lvl} / ${cap}</span></div>
        <div style="font-size:12px;opacity:.7">${esc(CASTRA_TYPE_LA[d.type].sg)} · ${esc((CASTRA_VENATIO[d.region]||{nm:d.region}).nm)}${h.assigned?` · leidt ${esc(castraBuilding(h.assigned).nm)}`:""}</div>
        <div style="display:flex;align-items:center;gap:6px;margin-top:3px"><small style="width:30px">Fides</small><div style="flex:1">${castraMenuBar(h.fides||0,100,"#d4a017")}</div><b style="font-size:12px;width:40px;text-align:right">${h.fides||0}</b></div>
        <div style="display:flex;align-items:center;gap:6px"><small style="width:30px">XP</small><div style="flex:1">${castraMenuBar(h.xp,need,"#38c")}</div><b style="font-size:12px;width:40px;text-align:right">${h.xp}</b></div>
        <div style="font-size:12px;margin-top:2px">${CASTRA_STATS.map(x=>`${esc(x.nm.slice(0,3))} ${st[x.id]}`).join(" · ")}</div></div></div>`;
  }).join("") || `<div class="note">Nullus heros. <small>Nog geen helden: zoek sporen tijdens de jacht en praat met hen.</small></div>`;
  return `<h3 style="margin:0 0 6px">Heroes <small>${have.length} / ${Object.keys(CASTRA_HERO_DATA).length}</small></h3>${rows}`;
}
function castraMenuBag(){
  const cap = castraWalletCap();
  const res = CASTRA_RES.map(r=>`<div style="${CASTRA_MV_ROW}"><span style="font-size:24px;width:32px;text-align:center">${r.icon}</span><div style="flex:1"><b>${esc(r.nm)}</b> <small style="opacity:.6">${esc(r.nl)}</small></div><b>${CASTRA.res[r.id]||0}</b>${r.id!=="gloria"?`<small style="opacity:.6"> / ${cap}</small>`:""}</div>`).join("");
  const bld = CASTRA_BUILDINGS.filter(b=>b.phase===1 && !b.fixed).map(b=>`<span style="display:inline-block;margin:2px 6px 2px 0;font-size:13px">${b.icon||"🏠"} ${esc(b.nm)} <b>${castraLvl(b.id)||"🔨"}</b></span>`).join("");
  return `<h3 style="margin:0 0 6px">Sacculus <small>voorraad</small></h3>${res}<h4 style="margin:10px 0 2px">Aedificia</h4><div>${bld}</div>`;
}
function castraMenuQuest(){
  const T = CASTRA.tut, out = [];
  if(T && T.step===1) out.push(CASTRA_TUT_TEXT.bar1);
  if(T && T.step===2) out.push(CASTRA_TUT_TEXT.bar2);
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
  return `<h3 style="margin:0 0 6px">${esc(name)}</h3><div style="display:flex;gap:12px;align-items:center">${av}<div style="flex:1">${rows.map(r=>`<div style="display:flex;justify-content:space-between;padding:3px 0;border-top:1px solid #ccc"><span>${r[0]}</span><b>${r[1]}</b></div>`).join("")}</div></div>`;
}
