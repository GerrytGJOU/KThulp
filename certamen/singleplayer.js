/* ============================================================================
   CHRONICA CLASSICA — SINGLE PLAYER MODE (engine)
   ----------------------------------------------------------------------------
   Parseert en speelt de CNS-scènes uit singleplayer-data.js (SP_CH1_CNS).
   Het CNS-tekstformaat en de parser/resolver hieronder zijn overgenomen uit
   het meegeleverde werkende prototype ("chronica-narrative-engine.html"),
   aangepast om te draaien BINNEN de bestaande certamen-app in plaats van als
   losse mini-app:
   - BM_IDENT/SCREENS.battleIdentity (battle.js) — zelfde gedeelde profiel als
     Battle Mode/Training Mode, want klassekeuze (REWARD) moet doorwerken in
     Battle Mode-stats (zie docx §RPG-Klasse & Stat-Integratie).
   - BM_CLASSES (battle-data.js) — REWARD-klassenamen mappen op de bestaande
     Battle Mode-klasse-ids (SP_CLASS_REWARD_MAP in singleplayer-data.js).
   - H()/brand()/foot()/iconSVG()/esc()/toast() (core.js) i.p.v. de aparte
     CSS/HTML-shell uit het prototype.

   Afwijking t.o.v. het prototype: de speler kiest wél een gender (voor
   voornaamwoorden) maar GEEN naam — de Game Bible wil een naamloze speler
   ("juist daardoor kan iedere leerling zichzelf in hem herkennen").

   BOUWSTATUS: Boek I (proloog) is speelbaar. CODEX/QUEST worden al bijgehouden
   in de save maar hebben nog geen eigen overzichtsscherm — dat volgt zodra
   er meer dan één scène/hoofdstuk is om te tonen. IMAGE is actief: een
   `IMAGE:`-sectie toont de bijbehorende illustratie (stripstijl, Gemini) uit
   assets/chronica/images/ boven de verteltekst; ontbreekt het bestand, dan
   verbergt de <img> zich stil (onerror), zodat auteurs alvast naar nog-te-
   maken illustraties kunnen verwijzen. COMBAT-hook bestaat nog niet, want er
   is in de proloog nog geen gevecht.

   SAVESLOTS: elke leerling krijgt SP_MAX_SLOTS (3) losse opslagplekken, zodat
   het verhaal met alle drie de klassen uitgespeeld kan worden voordat een save
   gewist moet worden. SCREENS.singlePlayer is de login-gate; SCREENS.spSlots
   is het "laadscherm" (kiezen/beginnen/verwijderen per slot). SP_ACTIVE_SLOT
   onthoudt welke slot deze sessie actief is; spSaveProgress schrijft alleen
   naar die slot.

   Opslag: identities/{klas}/{lcode}/singleplayer/slots/{1|2|3} =
     { node, gender, classId, traits:[], codex:[], quests:{}, updatedAt }.
   ============================================================================ */

/* ---- COMBAT AVATAR — hergebruikt Battle Mode se avatar-systeem 1-op-1
   (BM_AVATAR_PARTS/bmAvatarSVG/bmIsUnlocked/bmReqText/bmShowLockInfo uit
   battle.js/battle-data.js: zelfde onderdelen, zelfde ontgrendel-regels op
   basis van BM_IDENT-niveau/mastery), maar als EIGEN, los avatar-object —
   niet hetzelfde als BM_IDENT.avatar. Start als "de boer": vodden + hooivork
   (bmAvatarDefaults() geeft zelf al vodden+knuppel; hier wapen overschreven
   naar hooivork). Offline-first, zelfde patroon als de saveslots: localStorage
   is de bron van waarheid, Firebase is best-effort spiegeling zodra ingelogd.
   Coin-gated onderdelen zijn hier alleen te BEKIJKEN (niet te kopen) — kopen
   blijft in Battle Mode se eigen editor, ontgrendelt via BM_IDENT.unlocked
   sowieso ook hier. ---- */
const SP_AVATAR_KEY = "certamen_chronica_avatar";
function spAvatarDefaults(){ return {...bmAvatarDefaults(), wapen:"hooivork"}; }
function spAvatarMerge(saved){
  if(!saved || typeof saved==="string") return spAvatarDefaults();
  return {...spAvatarDefaults(), ...saved};
}
function spAvatarLoadLocal(){ try{ const r=localStorage.getItem(SP_AVATAR_KEY); return r?JSON.parse(r):null; }catch(e){ return null; } }
function spAvatarSaveLocal(av){ try{ localStorage.setItem(SP_AVATAR_KEY, JSON.stringify(av)); }catch(e){} }
function spAvatarPath(){ return "identities/"+BM_IDENT.klascode+"/"+BM_IDENT.leerlingcode+"/singleplayer/avatar"; }
async function spAvatarLoad(){
  const local = spAvatarLoadLocal();
  let remote = null;
  if(BM_IDENT && initFirebase() && fbDB){
    try{ const snap = await fbDB.ref(spAvatarPath()).once("value"); remote = snap.exists() ? snap.val() : null; }
    catch(e){ console.error("spAvatarLoad (Firebase) fout:",e); }
  }
  const winner = !local ? remote : !remote ? local : ((remote.updatedAt||0)>(local.updatedAt||0) ? remote : local);
  if(winner) spAvatarSaveLocal(winner);
  return spAvatarMerge(winner);
}
async function spAvatarSave(av){
  const toSave = {...av, updatedAt:Date.now()};
  spAvatarSaveLocal(toSave);
  if(BM_IDENT && initFirebase() && fbDB){
    fbDB.ref(spAvatarPath()).set(toSave).catch(e=>console.error("spAvatarSave (Firebase-spiegel) fout:",e));
  }
}

let SP_AV_EDIT = null;
let SP_AV_RETURN = "spSlots";
SCREENS.spAvatarEdit = function(){
  document.body.classList.remove("greek");
  if(!SP_AV_EDIT){
    H(brand(true)+`<div class="scrhead"><span></span><h2>Combat Avatar</h2></div><div class="panel" style="text-align:center"><div class="note">Avatar laden…</div></div>${foot()}`);
    spAvatarLoad().then(av=>{ SP_AV_EDIT=av; SCREENS.spAvatarEdit(); });
    return;
  }
  const av = SP_AV_EDIT;
  function partSection(partId){
    const part = BM_AVATAR_PARTS[partId]; if(!part) return "";
    const opts = part.opts.map(o=>{
      const key = partId+":"+o.id;
      const locked = !bmIsUnlocked(o, BM_IDENT, key);
      const sel = av[partId]===o.id;
      const preview = bmAvatarSVG({...av,[partId]:o.id}, 38);
      if(locked){
        const req = bmReqText(o);
        return `<button class="bm-opt locked" title="🔒 ${esc(req?req.full:o.nm)}" onclick="bmShowLockInfo('${esc(o.nm)}','${esc(req?req.full:"")}')">
          ${preview}<div class="onm">${esc(o.nm)}</div><div class="bm-lockreq">🔒 ${esc(req?req.short:"")}</div>
        </button>`;
      }
      return `<button class="bm-opt${sel?" on":""}" onclick="SP_AV_EDIT['${partId}']='${o.id}';SCREENS.spAvatarEdit()">
        ${preview}<div class="onm">${esc(o.nm)}</div>
      </button>`;
    }).join("");
    return `<div class="eyebrow l">${esc(part.nm)}</div><div class="bm-opts">${opts}</div>`;
  }
  H(brand(true)+`
  <div class="scrhead"><button class="back" onclick="SP_AV_EDIT=null;go(SP_AV_RETURN||'spSlots')">${iconSVG("shield",20,"currentColor")}</button><h2>Combat Avatar</h2></div>
  <div class="panel" style="text-align:center;padding:14px 16px;display:flex;justify-content:center">${bmAvatarSVG(av,96)}</div>
  ${!BM_IDENT?`<div class="panel"><p class="note">Sommige onderdelen ontgrendel je via Battle Mode (niveau/beheersing) — log in om te zien wat je daar al hebt verdiend.</p></div>`:""}
  ${Object.keys(BM_AVATAR_PARTS).map(partSection).join("")}
  <button class="btn btn-gold btn-block lg" onclick="spSaveAvatarEdit()" style="margin-bottom:16px">Opslaan</button>
  ${foot()}`);
};
function spSaveAvatarEdit(){
  spAvatarSave(SP_AV_EDIT);
  SP_AV_EDIT=null;
  go(SP_AV_RETURN||"spSlots");
}

/* ---- EERETITELS — ACCOUNT-breed (niet per saveslot), offline-first net als
   de Combat Avatar. Toegekend via de EERETITEL-hook (spRunMetaHooks); één
   titel is "equipped" en verschijnt als pill in de Battle Mode/Boss Battle-
   lobby (zie bmDoJoin/bmRenderHostLobby in battle.js). ---- */
const SP_TITLES_KEY = "certamen_chronica_titles";
const SP_EQUIPPED_TITLE_KEY = "certamen_chronica_equipped_title";
function spTitlesPath(){ return "identities/"+BM_IDENT.klascode+"/"+BM_IDENT.leerlingcode+"/singleplayer"; }
function spTitlesLoadLocal(){ try{ return JSON.parse(localStorage.getItem(SP_TITLES_KEY)||"[]"); }catch(e){ return []; } }
function spTitlesSaveLocal(arr){ try{ localStorage.setItem(SP_TITLES_KEY, JSON.stringify(arr)); }catch(e){} }
function spEquippedTitleLoadLocal(){ try{ return localStorage.getItem(SP_EQUIPPED_TITLE_KEY)||null; }catch(e){ return null; } }
function spEquippedTitleSaveLocal(id){ try{ if(id) localStorage.setItem(SP_EQUIPPED_TITLE_KEY,id); else localStorage.removeItem(SP_EQUIPPED_TITLE_KEY); }catch(e){} }

async function spAwardTitle(id){
  const local = spTitlesLoadLocal();
  if(local.includes(id)) return; // al eerder behaald — geen dubbele toast/schrijfactie
  const updated = [...local, id];
  spTitlesSaveLocal(updated);
  const def = SP_TITLES.find(t=>t.id===id);
  toast("Eretitel behaald!", def?def.nm:id);
  if(BM_IDENT && initFirebase() && fbDB){
    fbDB.ref(spTitlesPath()+"/titles").set(updated).catch(e=>console.error("spAwardTitle (Firebase-spiegel) fout:",e));
  }
}
async function spLoadTitles(){
  const local = spTitlesLoadLocal();
  let remote = [];
  if(BM_IDENT && initFirebase() && fbDB){
    try{ const snap = await fbDB.ref(spTitlesPath()+"/titles").once("value"); remote = snap.exists()?snap.val():[]; }
    catch(e){ console.error("spLoadTitles (Firebase) fout:",e); }
  }
  const merged = [...new Set([...(local||[]), ...(remote||[])])]; // unie: titels gaan nooit verloren
  spTitlesSaveLocal(merged);
  return merged;
}
async function spSetEquippedTitle(id){
  const cur = spEquippedTitleLoadLocal();
  const next = cur===id ? null : id; // nogmaals tikken = uitzetten
  spEquippedTitleSaveLocal(next);
  if(BM_IDENT && initFirebase() && fbDB){
    fbDB.ref(spTitlesPath()+"/equippedTitle").set(next).catch(e=>console.error("spSetEquippedTitle (Firebase-spiegel) fout:",e));
  }
  return next;
}
// Synchrone weergavenaam voor de huidige equipped title — gebruikt bij het
// meedoen aan Battle Mode/Boss Battle (bmDoJoin), waar geen tijd is voor een
// Firebase-rondje; de lokale cache is hiervoor precies genoeg.
function spEquippedTitleDisplayName(){
  const id = spEquippedTitleLoadLocal();
  if(!id) return null;
  return SP_TITLES.find(t=>t.id===id)?.nm || null;
}
function spTitlesSectionHTML(earnedIds, equippedId){
  if(!earnedIds.length) return `<div class="panel"><div class="eyebrow l">Eretitels</div><p class="note">Nog geen eretitels behaald — speel Chronica Classica om er te verdienen.</p></div>`;
  const rows = SP_TITLES.filter(t=>earnedIds.includes(t.id)).map(t=>{
    const on = equippedId===t.id;
    return `<button class="tile" style="margin-bottom:8px;padding:12px 14px${on?";border:2px solid var(--hi-bright)":""}" onclick="spToggleEquipTitle('${t.id}')">
      <div style="display:flex;align-items:flex-start;gap:10px">
        <span style="font-size:20px">${on?"✅":"⭐"}</span>
        <div style="flex:1">
          <div style="font-weight:700">${esc(t.nm)}</div>
          <div class="note" style="margin:2px 0">${esc(t.desc)}</div>
          ${t.bonus?`<div class="note" style="color:var(--hi)">⚡ ${esc(t.bonus.desc)}</div>`:""}
        </div>
      </div>
    </button>`;
  }).join("");
  return `<div class="panel"><div class="eyebrow l">Eretitels (${earnedIds.length}) — tik om te tonen in de lobby</div>${rows}</div>`;
}
async function spToggleEquipTitle(id){
  await spSetEquippedTitle(id);
  if(_screen==="spSlots") SCREENS.spSlots();
  else if(_screen==="battleProfile") SCREENS.battleProfile();
}

/* ---- VOORNAAMWOORDEN-RESOLVER ---- */
function spCapitalize(str){ return str ? str.charAt(0).toUpperCase()+str.slice(1) : str; }

const SpTextResolver = {
  resolve(text, state){
    if(!text) return "";
    return text.replace(/\{([a-zA-Z_]+(?:\.[a-zA-Z_]+)?)\}/g, (match, path) => {
      const v = this.lookup(path, state);
      return v===undefined ? match : v;
    });
  },
  lookup(path, state){
    const p = SP_PRONOUNS[state.gender] || SP_PRONOUNS.man;
    switch(path){
      case "subject":        return p.subj;
      case "object":         return p.obj;
      case "possessive":     return p.poss;
      case "subject_cap":    return spCapitalize(p.subj);
      case "object_cap":     return spCapitalize(p.obj);
      case "possessive_cap": return spCapitalize(p.poss);
    }
    return undefined;
  },
};

/* ---- CNS PARSER — zet ruwe .cns-tekst om in een Map<sceneId, sceneObject> ---- */
const CNSParser = {
  KNOWN_SECTIONS:["TITLE","TEXT","DIALOGUE","CHOICES","IMAGE","MUSIC","SFX",
                  "CODEX","QUEST","COMBAT","REWARD","INVENTORY","PUZZLE","EERETITEL"],
  parse(rawText){
    const scenes = new Map();
    if(!rawText || !rawText.trim()) return scenes;
    const headerRe = /===\s*SCENE:\s*(\S+)\s*===/g;
    const matches = [...rawText.matchAll(headerRe)];
    for(let i=0;i<matches.length;i++){
      const id = matches[i][1];
      const blockStart = matches[i].index + matches[i][0].length;
      const blockEnd = (i+1<matches.length) ? matches[i+1].index : rawText.length;
      scenes.set(id, this.parseSceneBlock(id, rawText.slice(blockStart, blockEnd)));
    }
    return scenes;
  },
  parseSceneBlock(id, block){
    const scene = { id, title:"", text:"", dialogue:null, choices:[], meta:{} };
    const endIndex = block.search(/^\s*END\s*$/m);
    const content = endIndex>=0 ? block.slice(0,endIndex) : block;
    const lines = content.split(/\r?\n/);
    let currentSection=null, buffer=[];
    const flush=()=>{
      if(!currentSection){ buffer=[]; return; }
      const text = buffer.join("\n").trim();
      if(currentSection==="TITLE") scene.title=text;
      else if(currentSection==="TEXT") scene.text=text;
      else if(currentSection==="DIALOGUE") scene.dialogue=this.parseDialogue(text);
      else if(currentSection==="CHOICES") scene.choices=this.parseChoices(text);
      else scene.meta[currentSection]=text;
      buffer=[];
    };
    const sectionHeaderRe = new RegExp("^("+this.KNOWN_SECTIONS.join("|")+"):\\s*$");
    for(const line of lines){
      const m = line.match(sectionHeaderRe);
      if(m){ flush(); currentSection=m[1]; } else buffer.push(line);
    }
    flush();
    return scene;
  },
  parseDialogue(text){
    const lines = text.split(/\r?\n/).filter(l=>l.trim()!=="");
    if(lines.length===0) return null;
    return { speaker:lines[0].trim(), text:lines.slice(1).join("\n").trim() };
  },
  parseChoices(text){
    const choices=[];
    for(const raw of text.split(/\r?\n/)){
      const line=raw.trim();
      if(!line.startsWith("*")) continue;
      const withoutBullet = line.replace(/^\*\s*/,"");
      const arrowIndex = withoutBullet.lastIndexOf("->");
      if(arrowIndex===-1) continue;
      choices.push({ label:withoutBullet.slice(0,arrowIndex).trim(), target:withoutBullet.slice(arrowIndex+2).trim() });
    }
    return choices;
  },
};

const SP_SCENES = CNSParser.parse(SP_CH1_CNS);
const SP_EMPTY_STATE = ()=>({ node:null, gender:null, classId:null, traits:[], codex:[], quests:{} });

/* ---- SPELERSTATE ---- */
let SP_STATE = SP_EMPTY_STATE();
let SP_ACTIVE_SLOT = null; // 1..SP_MAX_SLOTS — welke slot deze sessie actief is

/* ---- OPSLAG: offline-first. localStorage is de bron van waarheid (werkt
   zonder inloggen/internet); Firebase is alleen een best-effort spiegeling
   zodra BM_IDENT bestaat (voor cross-device spelen én omdat de klassekeuze
   moet doorwerken in het Battle Mode-profiel, dat sowieso via BM_IDENT
   loopt). Bij het laden wint per slot de nieuwste updatedAt. ---- */
const SP_SLOTS_KEY = "certamen_chronica_slots";
function spSlotsPath(){ return "identities/"+BM_IDENT.klascode+"/"+BM_IDENT.leerlingcode+"/singleplayer/slots"; }
function spSlotsLoadLocal(){
  try{ return JSON.parse(localStorage.getItem(SP_SLOTS_KEY)||"{}"); }catch(e){ return {}; }
}
function spSlotsSaveLocal(slots){
  try{ localStorage.setItem(SP_SLOTS_KEY, JSON.stringify(slots)); }catch(e){}
}

async function spSaveProgress(patch){
  Object.assign(SP_STATE, patch||{});
  if(!SP_ACTIVE_SLOT) return;
  const toSave = {...SP_STATE, updatedAt:Date.now()};
  const local = spSlotsLoadLocal();
  local[SP_ACTIVE_SLOT] = toSave;
  spSlotsSaveLocal(local);
  if(BM_IDENT && initFirebase() && fbDB){
    // Fire-and-forget: nooit de (offline-first) gameplay laten wachten op het netwerk.
    fbDB.ref(spSlotsPath()+"/"+SP_ACTIVE_SLOT).set(toSave).catch(e=>console.error("spSaveProgress (Firebase-spiegel) fout:",e));
  }
}
async function spLoadAllSlots(){
  const local = spSlotsLoadLocal();
  let remote = {};
  if(BM_IDENT && initFirebase() && fbDB){
    try{
      const snap = await fbDB.ref(spSlotsPath()).once("value");
      remote = snap.exists() ? snap.val() : {};
    }catch(e){ console.error("spLoadAllSlots (Firebase) fout:",e); }
  }
  const merged = {};
  for(let n=1;n<=SP_MAX_SLOTS;n++){
    const l=local[n], r=remote[n];
    merged[n] = !l ? (r||null) : !r ? l : ((r.updatedAt||0)>(l.updatedAt||0) ? r : l);
  }
  spSlotsSaveLocal(merged); // lokale cache bijwerken met eventuele nieuwere Firebase-data
  return merged;
}

/* ---- INSTAPSCHERM: geen login-gate — Chronica Classica moet offline speelbaar
   zijn. Doorstuur naar het slotoverzicht; inloggen is daar een aanbod, geen eis. ---- */
SCREENS.singlePlayer = function(){ go("spSlots"); };

/* ---- SLOTOVERZICHT: kiezen/beginnen/verwijderen per opslagplek ---- */
SCREENS.spSlots = function(){
  document.body.classList.remove("greek");
  H(brand(true)+`
  <div class="scrhead"><button class="back" onclick="go('home')">${iconSVG("shield",20,"currentColor")}</button><h2>Chronica Classica</h2></div>
  <div class="panel" style="text-align:center"><div class="note">Savegames laden…</div></div>
  ${foot()}`);
  Promise.all([spLoadAllSlots(), spLoadTitles()]).then(([slots, titles])=>{
    let tiles="";
    for(let n=1;n<=SP_MAX_SLOTS;n++) tiles += spSlotTileHTML(n, slots[n]);
    const loginNote = BM_IDENT ? "" : `
    <div class="panel" style="text-align:center">
      <p class="note">Je speelt nu offline — je voortgang wordt op dit toestel bewaard. Log in met je klascode om ook op andere toestellen verder te spelen en om je klassekeuze te laten meetellen in Battle Mode.</p>
      <button class="btn btn-ghost" style="margin-top:6px" onclick="BM_IDENT_RETURN='spSlots';go('battleIdentity')">Aanmelden</button>
    </div>`;
    const av = spAvatarMerge(spAvatarLoadLocal());
    H(brand(true)+`
    <div class="scrhead"><button class="back" onclick="go('home')">${iconSVG("shield",20,"currentColor")}</button><h2>Chronica Classica</h2></div>
    <div class="panel" style="text-align:center">
      <div>${bmAvatarSVG(av,72)}</div>
      <button class="btn btn-ghost" style="margin-top:8px" onclick="SP_AV_RETURN='spSlots';go('spAvatarEdit')">Combat Avatar aanpassen</button>
    </div>
    <div class="panel"><p class="note">Kies een opslagplek. Je hebt ${SP_MAX_SLOTS} plekken — genoeg om alle drie de klassen te spelen voor je er eentje hoeft te wissen.</p></div>
    ${tiles}
    ${loginNote}
    ${spTitlesSectionHTML(titles, spEquippedTitleLoadLocal())}
    ${foot()}`);
  });
};
function spSlotTileHTML(n, slot){
  if(!slot || !slot.node){
    return `<button class="tile" onclick="spStartNewSlot(${n})">
      <span class="ic">${iconSVG("star",44,"currentColor")}</span>
      <h3>Opslagplek ${n} — leeg</h3>
      <p>Begin een nieuw verhaal.</p>
    </button>`;
  }
  const cls = BM_CLASSES.find(c=>c.id===slot.classId);
  const sceneTitle = SP_SCENES.get(slot.node)?.title || "";
  return `<div class="tile" style="cursor:default">
    <span class="ic">${iconSVG(cls?cls.icon:"star",44,"currentColor")}</span>
    <h3>Opslagplek ${n} — ${cls?esc(cls.nm):"nog geen klasse"}</h3>
    <p>${esc(sceneTitle)}</p>
    <div class="btnrow" style="margin-top:8px">
      <button class="btn btn-gold" onclick="event.stopPropagation();spResumeSlot(${n})">Verdergaan</button>
      <button class="btn btn-ghost" onclick="event.stopPropagation();spDeleteSlotConfirm(${n})">Verwijderen</button>
    </div>
  </div>`;
}
function spStartNewSlot(n){
  SP_ACTIVE_SLOT = n;
  SP_STATE = SP_EMPTY_STATE();
  spRenderGenderPick();
}
async function spResumeSlot(n){
  SP_ACTIVE_SLOT = n;
  const slots = await spLoadAllSlots();
  SP_STATE = Object.assign(SP_EMPTY_STATE(), slots[n]||{});
  if(!SP_STATE.gender){ spRenderGenderPick(); return; }
  spRenderLanding();
}
async function spDeleteSlotConfirm(n){
  if(!confirm("Opslagplek "+n+" definitief wissen? Deze voortgang kan niet worden hersteld.")) return;
  const local = spSlotsLoadLocal();
  delete local[n];
  spSlotsSaveLocal(local);
  if(BM_IDENT){
    try{
      if(initFirebase() && fbDB) await fbDB.ref(spSlotsPath()+"/"+n).remove();
    }catch(e){ console.error("spDeleteSlotConfirm (Firebase) fout:",e); }
  }
  go("spSlots");
}

function spRenderGenderPick(){
  const opts = SP_GENDER_OPTIONS.map(o=>
    `<button class="tile" onclick="spPickGender('${o.id}')"><h3>${esc(o.label)}</h3></button>`
  ).join("");
  H(brand(true)+`
  <div class="scrhead"><button class="back" onclick="go('spSlots')">${iconSVG("shield",20,"currentColor")}</button><h2>Chronica Classica</h2></div>
  <div class="panel">
    <p>Nog één ding voordat je begint. In het verhaal spreken we jóú aan — jij bent de hoofdpersoon. Maar hoe moeten anderen over je práten wanneer ze het later over jou hebben?</p>
  </div>
  ${opts}
  ${foot()}`);
}
async function spPickGender(id){
  await spSaveProgress({ gender:id });
  spRenderLanding();
}

function spRenderLanding(){
  const resuming = !!(SP_STATE.node && SP_STATE.node!==SP_SCENES.keys().next().value);
  const chapter = SP_CAMPAIGN[0]; // proloog — enige hoofdstuk dat al speelbaar is
  H(brand(true)+`
  <div class="scrhead"><button class="back" onclick="go('spSlots')">${iconSVG("shield",20,"currentColor")}</button><h2>Chronica Classica</h2></div>
  <div class="panel" style="text-align:center">
    <span class="ic">${iconSVG("star",44,"currentColor")}</span>
    <div class="eyebrow l">Proloog</div>
    <h3 style="margin-top:4px">${esc(chapter.nm)}</h3>
    <p class="note">${esc(chapter.verhaal)}</p>
    <button class="btn btn-gold btn-block lg" style="margin-top:14px" onclick="spGoCns('${SP_STATE.node||[...SP_SCENES.keys()][0]}')">${resuming?"Verdergaan":"Beginnen"}</button>
  </div>
  ${foot()}`);
}

/* ---- NAVIGATIE ---- */
function spGoCns(nodeId){
  spSaveProgress({ node:nodeId });
  go("spPlay");
}

/* ---- SCÈNE-RENDERER ---- */
SCREENS.spPlay = function(){
  document.body.classList.remove("greek");
  if(!SP_ACTIVE_SLOT || !SP_STATE.node){ go("singlePlayer"); return; }
  const scene = SP_SCENES.get(SP_STATE.node);
  if(!scene){ go("singlePlayer"); return; }

  spRunMetaHooks(scene.meta);

  if(scene.meta.PUZZLE) return spRenderPuzzle(scene);

  const titleHTML = scene.title ? `<h3>${esc(SpTextResolver.resolve(scene.title, SP_STATE))}</h3>` : "";
  const textHTML = scene.text ? `<p>${esc(SpTextResolver.resolve(scene.text, SP_STATE))}</p>` : "";
  const dialogueHTML = scene.dialogue ? `
    <div class="panel">
      <div class="eyebrow l">${esc(SpTextResolver.resolve(scene.dialogue.speaker, SP_STATE))}</div>
      <p>“${esc(SpTextResolver.resolve(scene.dialogue.text, SP_STATE))}”</p>
    </div>` : "";
  const choicesHTML = scene.choices.length
    ? scene.choices.map(c=>`<button class="btn btn-gold btn-block lg" style="margin-top:8px" onclick="spGoCns('${c.target}')">${esc(SpTextResolver.resolve(c.label, SP_STATE))}</button>`).join("")
    : `<button class="btn btn-ghost btn-block lg" onclick="go('spSlots')">Terug naar de opslagplekken</button>`;

  H(brand(true)+`
  <div class="scrhead"><span></span><h2>Chronica Classica</h2></div>
  <div class="panel">${spSceneImageHTML(scene)}${titleHTML}${textHTML}</div>
  ${dialogueHTML}
  ${choicesHTML}
  ${foot()}`);
};

/* ---- META-HOOKS: REWARD/CODEX/QUEST vuren stil bij binnenkomst; IMAGE is nog
   een no-op (illustraties volgen later); PUZZLE wordt apart afgehandeld in
   spRenderPuzzle() omdat die de voortgang moet blokkeren i.p.v. alleen te loggen. ---- */
function spRunMetaHooks(meta){
  if(meta.REWARD)    spHookReward(meta.REWARD);
  if(meta.CODEX)     spHookCodex(meta.CODEX);
  if(meta.QUEST)     spHookQuest(meta.QUEST);
  if(meta.EERETITEL) spAwardTitle(meta.EERETITEL.trim());
  // IMAGE is pure weergave (geen side effect) — gerenderd in de view via
  // spSceneImageHTML(), niet hier.
}

/* Illustratie bij een scène: de IMAGE-sectie is een bestandsnaam relatief aan
   assets/chronica/images/. Ontbreekt het bestand, dan verbergt de <img> zich
   stil (onerror) — zo kunnen auteurs alvast naar nog-te-maken illustraties
   verwijzen zonder een gebroken-plaatje-icoon. */
function spSceneImageHTML(scene){
  if(!scene.meta || !scene.meta.IMAGE) return "";
  const src = "assets/chronica/images/"+scene.meta.IMAGE.trim();
  return `<img src="${esc(src)}" alt="" style="width:100%;border-radius:10px;display:block;margin-bottom:12px" onerror="this.style.display='none'">`;
}
function spHookReward(text){
  const fields={};
  text.split(";").forEach(part=>{
    const [k,v]=part.split("=").map(s=>s&&s.trim());
    if(k) fields[k]=v;
  });
  const isNew = !SP_STATE.classId && fields.class;
  const classId = SP_CLASS_REWARD_MAP[fields.class] || SP_STATE.classId;
  const traits = fields.traits ? fields.traits.split(",").map(s=>s.trim()) : SP_STATE.traits;
  spSaveProgress({ classId, traits });
  if(isNew) toast("Wapen gekozen!", BM_IDENT
    ? "Je pad is bepaald — dit werkt ook door in Battle Mode."
    : "Je pad is bepaald. Log in met je klascode om dit ook in Battle Mode te laten meetellen.");
}
function spHookCodex(text){
  const id=text.trim();
  if((SP_STATE.codex||[]).includes(id)) return;
  spSaveProgress({ codex:[...(SP_STATE.codex||[]),id] });
  toast("Codex-item ontgrendeld!","Er is een nieuwe bladzijde toegevoegd aan de Codex Memoriae.");
}
function spHookQuest(text){
  const idx=text.indexOf(":");
  const questId = idx===-1?text.trim():text.slice(0,idx).trim();
  const status = idx===-1?"gestart":text.slice(idx+1).trim();
  spSaveProgress({ quests:{...(SP_STATE.quests||{}), [questId]:status} });
}

/* ---- PUZZEL: Grieks alfabet/tekens transcriberen (§ Educatieve Poortwachters) ----
   Blokkeert de scène tot de puzzel is opgelost; slaagt de speler, dan gaat de
   engine naar het doel van de (enige) keuze in deze scène. ---- */
function spRenderPuzzle(scene){
  const puzzleId = scene.meta.PUZZLE.trim();
  const puzzle = SP_PUZZLES[puzzleId];
  const target = scene.choices[0]?.target;
  const rows = SP_GREEK_ALPHABET.map(l=>
    `<div style="display:flex;justify-content:space-between;padding:2px 0;border-bottom:1px solid rgba(255,255,255,.08)">
      <span>${esc(l.letter)}</span><span class="note">${esc(l.nm)} = ${esc(l.translit)}</span>
    </div>`
  ).join("");
  H(brand(true)+`
  <div class="scrhead"><span></span><h2>Chronica Classica</h2></div>
  <div class="panel">
    ${spSceneImageHTML(scene)}
    <h3>${esc(SpTextResolver.resolve(scene.title, SP_STATE))}</h3>
    <p>${esc(SpTextResolver.resolve(scene.text, SP_STATE))}</p>
    <div style="font-size:32px;letter-spacing:4px;text-align:center;margin:14px 0">${esc(puzzle.woord.grieks)}</div>
  </div>
  <div class="panel">
    <details><summary class="note" style="cursor:pointer">Griekse alfabet (transcriptietabel)</summary>${rows}</details>
  </div>
  <div class="panel">
    <label class="fld">Jouw transcriptie</label>
    <input id="spPuzzleInput" type="text" placeholder="typ hier…" onkeydown="if(event.key==='Enter')spCheckPuzzle('${puzzleId}','${target}')">
    <div id="spPuzzleErr" class="note warn" style="display:none;margin-top:8px"></div>
  </div>
  <button class="btn btn-gold btn-block lg" onclick="spCheckPuzzle('${puzzleId}','${target}')">Controleren</button>
  ${foot()}`);
}
function spCheckPuzzle(puzzleId, target){
  const puzzle = SP_PUZZLES[puzzleId];
  const input = (el("spPuzzleInput")?.value||"").trim().toLowerCase();
  const err = el("spPuzzleErr");
  if(input === puzzle.woord.antwoord.toLowerCase()){
    spGoCns(target);
  }else if(err){
    err.textContent = "Nog niet helemaal juist — kijk in de transcriptietabel en probeer opnieuw.";
    err.style.display = "";
  }
}
