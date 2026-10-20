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

/* ---- Tweede verzamelas: prestaties (titels en beloningen voor codex-voortgang) ----
   Per volk waarvan je alle vormen kent: een ster + beloning. Totaal-mijlpalen geven een titel.
   Opslag: CASTRA.coll = { <sleutel>: 1 } voor reeds uitgekeerde beloningen. */
const CASTRA_COLL_TOTAL = [
  { n:10,  title:"Tiro",     nl:"rekruut",             reward:{ aes:60,  frumentum:40 } },
  { n:25,  title:"Venator",  nl:"jager",               reward:{ aes:120, frumentum:80, gloria:2 } },
  { n:50,  title:"Peritus",  nl:"kenner",              reward:{ aes:200, frumentum:140, gloria:4 } },
  { n:80,  title:"Magister", nl:"meester",             reward:{ aes:320, frumentum:220, gloria:6 } },
  { n:120, title:"Doctus",   nl:"geleerde",            reward:{ aes:500, frumentum:350, gloria:10 } },
  { n:151, title:"Imperator",nl:"keizer van de codex", reward:{ aes:800, frumentum:500, gloria:20 } },
];
const CASTRA_COLL_FOLK = { aes:100, frumentum:60, gloria:3 };
function castraCollSeen(){ return Object.keys(CASTRA.codex||{}).length; }
function castraCollFolk(v){ const all = CASTRA_FORM_LIST.filter(f=>f.volk===v); return { seen:all.filter(f=>CASTRA.codex&&CASTRA.codex[f.id]).length, total:all.length }; }
function castraTitle(){ let t = null; CASTRA_COLL_TOTAL.forEach(m=>{ if(castraCollSeen()>=m.n) t = m; }); return t; }
function castraCollPay(res){
  const cap = castraWalletCap();
  Object.keys(res).forEach(r=>{ CASTRA.res[r] = Math.min(r==="gloria"?1e9:cap, (CASTRA.res[r]||0)+res[r]); });
  return Object.keys(res).map(r=>castraRes(r).icon+" +"+res[r]).join(" ");
}
/* Prestaties als achievements in het Certamen-profiel (categorie "Castra Heroum", zichtbaar in Mijn profiel). */
const CASTRA_ICONS_TOTAL = { 10:"helmet", 25:"torch", 50:"owl", 80:"column", 120:"crown", 151:"eagle" };
const CASTRA_ICONS_FOLK = { rom:"eagle", gra:"owl", spa:"shield", tro:"column", gla:"trident", gal:"torch", ger:"helmet", aeg:"amphora", per:"crown", car:"horse", ama:"laurel" };
if(typeof ACH_CATEGORIES!=="undefined" && !ACH_CATEGORIES.castra) ACH_CATEGORIES.castra = "Castra Heroum";
(function(){
  if(typeof ACHIEVEMENTS_DEF==="undefined" || ACHIEVEMENTS_DEF.some(a=>a.id==="castra_t10")) return;
  CASTRA_COLL_TOTAL.forEach(m=>ACHIEVEMENTS_DEF.push({ id:"castra_t"+m.n, nm:"Castra: "+m.title, ds:m.n+" soldaten ontmoet in de Castra Heroum-codex ("+m.nl+")", icon:CASTRA_ICONS_TOTAL[m.n]||"star", cat:"castra", mode:"battle" }));
  Object.keys(CASTRA_FOLKS).filter(v=>v!=="myt").forEach(v=>ACHIEVEMENTS_DEF.push({ id:"castra_v"+v, nm:"Castra: "+CASTRA_FOLKS[v].nm, ds:"Alle soldaten van de "+CASTRA_FOLKS[v].nm+" ontmoet", icon:CASTRA_ICONS_FOLK[v]||"star", cat:"castra", mode:"battle" }));
  ACHIEVEMENTS_DEF.push({ id:"castra_alle", nm:"Castra: Alle volken", ds:"Van elk volk alle soldaten ontmoet", icon:"crown", cat:"castra", mode:"battle" });
})();
// Zet een achievement in het profiel: ingelogd = identities/{klas}/{lid}/achievements (zoals Battle Mode), anders het lokale profiel.
function castraGrantAch(id){
  const def = (typeof ACHIEVEMENTS_DEF!=="undefined") && ACHIEVEMENTS_DEF.find(a=>a.id===id); if(!def) return;
  const i = (typeof BM_IDENT!=="undefined") ? BM_IDENT : null;
  const have = new Set([...(i&&i.achievements||[]), ...((typeof P!=="undefined"&&P.achievements)||[])]);
  if(have.has(id)) return;
  if(i && i.klascode && i.leerlingcode){
    i.achievements = [...(i.achievements||[]), id];
    try{ if(typeof bmIdentSave==="function") bmIdentSave({...bmIdentLoad(), ...i, achievements:i.achievements}); }catch(e){}
    try{ if(typeof fbDB!=="undefined" && fbDB) fbDB.ref("identities/"+i.klascode+"/"+i.leerlingcode+"/achievements").transaction(cur=>{ const l = cur||[]; return l.includes(id) ? undefined : [...l, id]; }); }catch(e){}
  } else if(typeof P!=="undefined"){ P.achievements = [...(P.achievements||[]), id]; if(typeof saveProfile==="function") saveProfile(); }
  if(typeof toastAch==="function") toastAch(def);
}
let _castraCollBusy = false;
function castraCollCheck(){
  if(_castraCollBusy || !CASTRA) return; _castraCollBusy = true;
  try{
    const c = CASTRA.coll || (CASTRA.coll = {}), msgs = [];
    CASTRA_COLL_TOTAL.forEach(m=>{ const k = "t"+m.n; if(!c[k] && castraCollSeen()>=m.n){ c[k] = 1; msgs.push(["🏅 "+m.title, m.nl+" · "+castraCollPay(m.reward)]); } });
    Object.keys(CASTRA_FOLKS).forEach(v=>{ if(v==="myt") return; const k = "v"+v, s = castraCollFolk(v);
      if(!c[k] && s.total>0 && s.seen>=s.total){ c[k] = 1; msgs.push(["⭐ "+CASTRA_FOLKS[v].nm, "alle vormen ontmoet · "+castraCollPay(CASTRA_COLL_FOLK)]); } });
    Object.keys(c).forEach(k=>{ if(c[k]) castraGrantAch(k[0]==="t" ? "castra_"+k : "castra_"+k); });
    const stars = Object.keys(CASTRA_FOLKS).filter(v=>v!=="myt");
    if(stars.every(v=>c["v"+v])) castraGrantAch("castra_alle");
    if(msgs.length){ castraSave(); if(typeof castraRenderRes==="function") castraRenderRes(); msgs.forEach((m,i)=>setTimeout(()=>toast(m[0], m[1]), i*1800)); }
  } finally { _castraCollBusy = false; }
}
function castraCodexSee(id){
  if(typeof CASTRA==="undefined" || !CASTRA || !CASTRA_FORMS[id]) return;
  CASTRA.codex = CASTRA.codex || {};
  // een vorm ontmoeten = ook zijn voorouders kennen
  const todo = [id];
  let nieuw = 0;
  while(todo.length){ const k = todo.pop(); if(CASTRA.codex[k]) continue; CASTRA.codex[k] = 1; nieuw++; CASTRA_FORMS[k].from.forEach(p=>todo.push(p)); }
  if(nieuw && typeof castraPxpAdd==="function") castraPxpAdd(4*nieuw);
  castraCollCheck();
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
    { const cls = f.type==="myth" ? "myth" : castraFormClassId(f), sl = cls ? castraSkillList(cls) : [];
      if(sl.length) body += `<div style="font-size:13px;opacity:.85">🎓 ${sl.map(k=>esc(k.la)+" <small>(Lv "+k.lvl+")</small>").join(" · ")}</div>`; }
    if(f.next.length) body += `<div style="font-size:13px;opacity:.85">→ ${f.next.map(id=>esc(CASTRA_FORMS[id].nm)).join(" / ")} <small>(${castraLaText("gradus")} ${castraEvoLevel(f)})</small></div>`;
    const lore = CASTRA_CODEX_LORE[f.id];
    if(lore) body += `<div style="margin-top:4px;font-size:15px">${castraLaHTML(lore.la, lore.nl, "codex_"+f.id)}</div>`;
  } else body += `<div style="font-size:13px;opacity:.6">Nog niet ontmoet.</div>`;
  return `<div style="padding:5px 8px;margin:3px 0;border:1px solid ${seen?"#8a6d2f":"#4a3d2c"};border-radius:8px;background:rgba(0,0,0,.18)">
    ${seen&&castraFsprHas(f.id,"td")===true?`<span style="float:right">${castraFsprHTML(f.id,"td",48,"")}</span>`:""}${seen?"":"❔ "}${nm} ${castraClassBadge(f)} <small>(${esc(t.sg)} · tier ${f.tier})</small>${need}${body}</div>`;
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
  const tabs = folks.concat(["helden","prest"]).map(k=>{
    const st = (k==="helden"||k==="prest") ? null : castraCollFolk(k), star = st && st.seen>=st.total && k!=="myt" ? " ⭐" : "";
    const nm = k==="helden" ? "Helden" : k==="prest" ? "🏅 Prestaties" : CASTRA_FOLKS[k].nm+star, on = CASTRA_CX.tab===k;
    return `<button class="btn ${on?"btn-gold":""}" style="margin:2px;min-height:44px" onclick="castraCodexOpen('${k}')">${esc(nm)}</button>`;
  }).join("");
  const total = CASTRA_FORM_LIST.length, seen = Object.keys(CASTRA.codex||{}).length;
  if(CASTRA_CX.tab!=="helden" && CASTRA_CX.tab!=="prest"){ const pend = CASTRA_FORM_LIST.filter(f=>f.volk===CASTRA_CX.tab && castraFsprHas(f.id,"td")===undefined).map(f=>[f.id,"td"]); if(pend.length) castraFsprProbe(pend, ()=>{ if(CASTRA_UI.panel==="codex") castraCodexOpen(); }); }
  const body = CASTRA_CX.tab==="helden" ? castraCodexHeroes() : CASTRA_CX.tab==="prest" ? castraCodexPrest() : castraCodexTree(CASTRA_CX.tab);
  castraOpenPanel(`<div class="panel"><h3>📖 Codex <small>· ${seen} / ${total} vormen ontmoet</small></h3>
    <div style="margin:6px 0">${tabs}</div>${body}
    <div style="margin-top:10px"><button class="btn" onclick="castraClosePanel()">${castraLaText("claude")}</button></div></div>`);
  castraSave();
}

function castraCodexPrest(){
  const seen = castraCollSeen(), c = CASTRA.coll || {}, t = castraTitle();
  const bar = (a,b)=>`<div style="height:8px;background:#3a2f20;border:1px solid #6b5630;border-radius:5px;overflow:hidden;margin-top:3px"><div style="width:${Math.min(100,Math.round(100*a/b))}%;height:100%;background:#d4af37"></div></div>`;
  const tot = CASTRA_COLL_TOTAL.map(m=>{ const ok = !!c["t"+m.n];
    return `<div style="padding:6px 0;border-top:1px solid #4a3d2c;${ok?"":"opacity:.75"}"><div style="display:flex;justify-content:space-between;gap:8px"><b>${ok?"🏅":"🔒"} ${esc(m.title)}</b><span>${Math.min(seen,m.n)} / ${m.n}</span></div>
      <small>${esc(m.nl)} · ${Object.keys(m.reward).map(r=>castraRes(r).icon+" "+m.reward[r]).join(" ")}</small>${bar(seen,m.n)}</div>`; }).join("");
  const fol = Object.keys(CASTRA_FOLKS).filter(v=>v!=="myt").map(v=>{ const s = castraCollFolk(v), ok = !!c["v"+v];
    return `<div style="padding:6px 0;border-top:1px solid #4a3d2c;${ok?"":"opacity:.75"}"><div style="display:flex;justify-content:space-between;gap:8px"><b>${ok?"⭐":"☆"} ${esc(CASTRA_FOLKS[v].nm)}</b><span>${s.seen} / ${s.total}</span></div>${bar(s.seen,s.total)}</div>`; }).join("");
  return `<h4 style="margin:6px 0 2px;color:#d4af37">Titel: ${t?esc(t.title)+" <small>("+esc(t.nl)+")</small>":"nog geen"}</h4>
    <div style="font-size:13px;opacity:.8;margin-bottom:6px">Ontmoet nieuwe soldaten (vang ze, evolueer of zie ze als vijand) om titels en beloningen te verdienen. Een ster krijg je als je alle vormen van een volk kent (${Object.keys(CASTRA_COLL_FOLK).map(r=>castraRes(r).icon+" "+CASTRA_COLL_FOLK[r]).join(" ")}).</div>
    <h4 style="margin:8px 0 2px;color:#d4af37">Totaal (${seen} / ${CASTRA_FORM_LIST.length} vormen)</h4>${tot}
    <h4 style="margin:12px 0 2px;color:#d4af37">Volken</h4>${fol}`;
}
