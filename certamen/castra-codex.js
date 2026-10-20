/* ============================================================================
   CASTRA HEROUM — CODEX (M4 van CASTRA_TROEPENBOMEN.md)
   ----------------------------------------------------------------------------
   Naslagscherm met de bomen per volk (151 vormen) plus de 15 helden apart.
   Een vorm is "ontmoet" zodra je hem (of een nakomeling) in je leger hebt gehad
   of als wilde vijand bent tegengekomen; onontmoete vormen staan er wel (zodat
   de boom leesbaar blijft) maar zonder cijfers of verhaal.
   Opslag: CASTRA.codex = { [vormId]: 1 }.
   Laadt NA castra-troops.js, castra-heroes.js en castra-latin.js.
   ============================================================================ */

/* Korte Latijnse mythesamenvattingen (voorlopig, ter controle door Gerben). */
const CASTRA_CODEX_LORE = {
  myt_myrmido:   { la:"Aeacus formicas in homines mutavit. Myrmidones Achillem sequuntur.", nl:"Aeacus veranderde mieren in mensen. De Myrmidonen volgen Achilles." },
  myt_spartus:   { la:"Cadmus dentes draconis serit. Viri armati ex terra surgunt.", nl:"Cadmus zaait drakentanden. Gewapende mannen rijzen uit de grond." },
  myt_lupusmartius:{ la:"Lupa Romulum et Remum nutrit. Lupus Martis sacer est.", nl:"Een wolvin voedt Romulus en Remus. De wolf van Mars is heilig." },
};

function castraCodexSee(id){
  if(typeof CASTRA==="undefined" || !CASTRA || !CASTRA_FORMS[id]) return;
  CASTRA.codex = CASTRA.codex || {};
  // een vorm ontmoeten = ook zijn voorouders kennen
  const todo = [id];
  while(todo.length){ const k = todo.pop(); if(CASTRA.codex[k]) continue; CASTRA.codex[k] = 1; CASTRA_FORMS[k].from.forEach(p=>todo.push(p)); }
}
function castraCodexSync(){ (CASTRA.soldiers||[]).forEach(s=>castraCodexSee(s.line)); }

const CASTRA_CX = { tab:"rom" };

function castraCodexForm(f, seen){
  const t = CASTRA_TYPE_LA[f.type] || { sg:f.type };
  const nm = seen ? `<b>${esc(f.nm)}</b>` : `<b style="opacity:.55">${esc(f.nm)}</b>`;
  const need = f.needs ? ` <small>· ${esc(castraBuilding(f.needs).nm)} ${castraLaText("gradus")} ${castraNeedLvl(f)}</small>` : "";
  let body = "";
  if(seen){
    const base = CASTRA_BASE_STATS[f.type] || CASTRA_BASE_STATS.rec, mult = CASTRA_TIER_MULT[Math.max(0,Math.min(CASTRA_TIER_MULT.length-1,f.tier-1))];
    body += `<div style="font-size:13px;opacity:.85">` + CASTRA_STATS.map(st=>`${esc(st.nm)} ${Math.round((base[st.id]||0)*mult)}`).join(" · ") + `</div>`;
    if(f.next.length) body += `<div style="font-size:13px;opacity:.85">→ ${f.next.map(id=>esc(CASTRA_FORMS[id].nm)).join(" / ")} <small>(${castraLaText("gradus")} ${castraEvoLevel(f)})</small></div>`;
    const lore = CASTRA_CODEX_LORE[f.id];
    if(lore) body += `<div style="margin-top:4px;font-size:15px">${castraLaHTML(lore.la, lore.nl, "codex_"+f.id)}</div>`;
  } else body += `<div style="font-size:13px;opacity:.6">Nog niet ontmoet.</div>`;
  return `<div style="padding:5px 8px;margin:3px 0;border:1px solid ${seen?"#8a6d2f":"#4a3d2c"};border-radius:8px;background:rgba(0,0,0,.18)">
    ${seen?"":"❔ "}${nm} <small>(${esc(t.sg)} · tier ${f.tier})</small>${need}${body}</div>`;
}

// Boom per tak: wortels (geen ouder) met kinderen eronder; een vorm met twee ouders staat onder de eerste.
function castraCodexTree(volk){
  const forms = CASTRA_FORM_LIST.filter(f=>f.volk===volk);
  const shown = {};
  const node = (f, depth)=>{
    if(shown[f.id]) return "";
    shown[f.id] = 1;
    const seen = !!(CASTRA.codex && CASTRA.codex[f.id]);
    const kids = f.next.map(id=>CASTRA_FORMS[id]).filter(k=>k.volk===volk && k.from[0]===f.id).map(k=>node(k, depth+1)).join("");
    return `<div style="${depth?"margin-left:14px;padding-left:8px;border-left:2px solid #6b5630":""}">${castraCodexForm(f, seen)}${kids}</div>`;
  };
  const taken = [];
  forms.forEach(f=>{ if(taken.indexOf(f.tak)<0) taken.push(f.tak); });
  return taken.map(tak=>{
    const roots = forms.filter(f=>f.tak===tak && !f.from.length);
    // vormen met ouder in een andere tak (kruiskoppeling) tonen we onder hun eigen tak
    const orphans = forms.filter(f=>f.tak===tak && f.from.length && !shown[f.id] && CASTRA_FORMS[f.from[0]].tak!==tak);
    const html = roots.concat(orphans).map(f=>node(f,0)).join("");
    return html ? `<h4 style="margin:12px 0 2px;color:#d4af37">${esc(tak)}</h4>${html}` : "";
  }).join("") || "";
}

function castraCodexHeroes(){
  const owned = {}; (CASTRA.heroes||[]).forEach(h=>owned[h.id]=1);
  return Object.keys(CASTRA_HERO_DATA).map(id=>{
    const d = CASTRA_HERO_DATA[id], t = CASTRA_TYPE_LA[d.type] || { sg:d.type };
    const have = !!owned[id];
    return `<div style="display:flex;gap:10px;padding:6px 0;border-top:1px solid #4a3d2c;${have?"":"opacity:.6"}">
      <div style="flex-shrink:0">${have?castraAvatarHTML(d.look,"down",1,48):"<div style='width:48px;height:48px;text-align:center;font-size:28px'>❔</div>"}</div>
      <div><b>${esc(have?d.nm:"???")}</b> <small>(${esc(t.sg)} · ${esc((CASTRA_VENATIO[d.region]||{nm:d.region}).nm)})</small>
        <div style="font-size:13px;opacity:.85">${have?`Leidt graag: ${esc(castraBuilding(d.affinity)?castraBuilding(d.affinity).nm:d.affinity)}`:"Nog niet in je heroum."}</div></div></div>`;
  }).join("");
}

function castraCodexOpen(tab){
  if(tab) CASTRA_CX.tab = tab;
  CASTRA_UI.panel = "codex";
  castraCodexSync();
  const folks = Object.keys(CASTRA_FOLKS);
  const tabs = folks.concat(["helden"]).map(k=>{
    const nm = k==="helden" ? "Helden" : CASTRA_FOLKS[k].nm, on = CASTRA_CX.tab===k;
    return `<button class="btn ${on?"btn-gold":""}" style="margin:2px;min-height:44px" onclick="castraCodexOpen('${k}')">${esc(nm)}</button>`;
  }).join("");
  const total = CASTRA_FORM_LIST.length, seen = Object.keys(CASTRA.codex||{}).length;
  const body = CASTRA_CX.tab==="helden" ? castraCodexHeroes() : castraCodexTree(CASTRA_CX.tab);
  castraOpenPanel(`<div class="panel"><h3>📖 Codex <small>· ${seen} / ${total} vormen ontmoet</small></h3>
    <div style="margin:6px 0">${tabs}</div>${body}
    <div style="margin-top:10px"><button class="btn" onclick="castraClosePanel()">${castraLaText("claude")}</button></div></div>`);
  castraSave();
}
