/* ============================================================================
   CHRONICA CLASSICA — SINGLE PLAYER MODE (engine)
   ----------------------------------------------------------------------------
   Parseert en speelt de CNS-scènes uit singleplayer-data.js (SP_PROLOOG_CNS).
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

   BOUWSTATUS: proloog + Hoofdstuk 1 (drie parallelle lijnen, zie SP_CH1_CNS)
   zijn speelbaar. CODEX/QUEST worden al bijgehouden
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

/* ---- COMBAT AVATAR ----
   Hergebruikt Battle Mode se ECHTE avatar-rendering: de gelaagde pixel-sprite
   (PNG's uit assets/sprites/, samengesteld door _bmPixelLayers()/
   renderPixelHeroPreview()/renderPixelHeroIcon() in battle.js) — NIET de
   procedurele bmAvatarSVG()-paperdoll (die is elders in Battle Mode al
   vervangen, zie de toelichting bij renderPixelHeroIcon()). BM_AVATAR_PARTS
   (labels/iconen/sprite-keys) wordt hergebruikt, maar de ONTGRENDELLOGICA is
   volledig anders dan in Battle Mode: geen niveau/beheersing/munten, maar
   VERHAAL (zie SP_AVATAR_FREE_PARTS/SP_AVATAR_STORY_UNLOCKS in
   singleplayer-data.js). Eigen, los avatar-object — niet hetzelfde als
   BM_IDENT.avatar. Start als "de boer": vodden + hooivork. Offline-first,
   zelfde patroon als de saveslots: localStorage is de bron van waarheid,
   Firebase is best-effort spiegeling zodra ingelogd. Alleen zichtbaar tijdens
   Chronica-gevechten en op het profiel (niet op het slotscherm — dat is geen
   combat-context). ---- */
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

/* Verhaal-ontgrendeling: partId/optId altijd vrij (uiterlijk), altijd
   beschikbare startuitrusting (vodden/hooivork), of moet voorkomen in
   SP_AVATAR_STORY_UNLOCKS én al verdiend zijn (eretitel). Ontbreekt het daar,
   dan is het simpelweg nog niet door het verhaal vrijgegeven. */
function spAvatarIsUnlocked(partId, optId, earnedTitles){
  if(SP_AVATAR_FREE_PARTS.includes(partId)) return true;
  if((partId==="armor"&&optId==="vodden") || (partId==="wapen"&&optId==="hooivork")) return true;
  const req = SP_AVATAR_STORY_UNLOCKS[partId+":"+optId];
  if(!req) return false;
  if(req.title) return (earnedTitles||[]).includes(req.title);
  if(req.flag)  return !!(SP_STATE.flags||{})[req.flag];
  return false;
}
function spAvatarReqText(partId, optId){
  const req = SP_AVATAR_STORY_UNLOCKS[partId+":"+optId];
  if(req && req.title){
    const t = SP_TITLES.find(x=>x.id===req.title);
    return "Ontgrendel de eretitel \""+(t?t.nm:req.title)+"\" (verder spelen in Chronica Classica)";
  }
  return "Ontgrendelt later in het verhaal";
}

let SP_AV_EDIT = null;
let SP_AV_RETURN = "battleProfile";
let SP_AV_EARNED_TITLES = [];
SCREENS.spAvatarEdit = function(){
  document.body.classList.remove("greek");
  if(!SP_AV_EDIT){
    H(brand(true)+`<div class="scrhead"><span></span><h2>Chronica Classica Avatar</h2></div><div class="panel" style="text-align:center"><div class="note">Avatar laden…</div></div>${foot()}`);
    Promise.all([spAvatarLoad(), spLoadTitles()]).then(([av,titles])=>{ SP_AV_EDIT=av; SP_AV_EARNED_TITLES=titles; SCREENS.spAvatarEdit(); });
    return;
  }
  const av = SP_AV_EDIT;
  const earnedTitles = SP_AV_EARNED_TITLES||[];
  // Chronica speelt altijd als jezelf: geen overwinningsanimatie, geen
  // legendarische strijders, geen Battle Mode-legioensglans.
  const SP_AVATAR_HIDDEN_PARTS = ["victoryAnim","legendary","prestige"];
  function partSection(partId){
    const part = BM_AVATAR_PARTS[partId]; if(!part) return "";
    // Kleurenkiezers: haarkleur/capekleur als ronde swatches, net als in
    // SCREENS.battleAvatarEdit (battle.js) — zelfde look, eigen ontgrendellogica.
    const SW = partId==="capekleur"?BM_CAPEKLEUR_SWATCH
             : partId==="haarkleur"?BM_HAARKLEUR_SWATCH : null;
    if(SW){
      const sw=part.opts.map(o=>{
        const col=SW[o.id]||"#888";
        const locked=!spAvatarIsUnlocked(partId,o.id,earnedTitles);
        const sel=av[partId]===o.id;
        if(locked){
          const req=spAvatarReqText(partId,o.id);
          return `<button title="🔒 ${esc(req)}" onclick="toast('Nog op slot','${esc(req)}')"
            style="width:34px;height:34px;border-radius:50%;background:${col};border:3px solid transparent;
            opacity:.45;cursor:help;flex:0 0 auto;display:flex;align-items:center;justify-content:center;font-size:13px">🔒</button>`;
        }
        return `<button title="${esc(o.nm)}"
          onclick="SP_AV_EDIT['${partId}']='${o.id}';SCREENS.spAvatarEdit()"
          style="width:34px;height:34px;border-radius:50%;background:${col};
          border:3px solid ${sel?"var(--hi-bright)":"transparent"};cursor:pointer;flex:0 0 auto"></button>`;
      }).join("");
      return `<div class="eyebrow l">${esc(part.nm)}</div>
        <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:14px">${sw}</div>`;
    }
    const opts = part.opts.map(o=>{
      const locked = !spAvatarIsUnlocked(partId, o.id, earnedTitles);
      const sel = av[partId]===o.id;
      const preview = bmAvatarSVG({...av,[partId]:o.id}, 38);
      if(locked){
        const req = spAvatarReqText(partId, o.id);
        return `<button class="bm-opt locked" title="🔒 ${esc(req)}" onclick="toast('Nog op slot','${esc(req)}')">
          ${preview}<div class="onm">${esc(o.nm)}</div><div class="bm-lockreq">🔒</div>
        </button>`;
      }
      return `<button class="bm-opt${sel?" on":""}" onclick="SP_AV_EDIT['${partId}']='${o.id}';SCREENS.spAvatarEdit()">
        ${preview}<div class="onm">${esc(o.nm)}</div>
      </button>`;
    }).join("");
    return `<div class="eyebrow l">${esc(part.nm)}</div><div class="bm-opts">${opts}</div>`;
  }
  H(brand(true)+`
  <div class="scrhead"><button class="back" onclick="SP_AV_EDIT=null;go(SP_AV_RETURN||'battleProfile')">${iconSVG("shield",20,"currentColor")}</button><h2>Chronica Classica Avatar</h2></div>
  <div class="panel" style="text-align:center;padding:14px 16px;display:flex;justify-content:center">${renderPixelHeroPreview(av,true) || bmAvatarSVG(av,96)}</div>
  <div class="panel"><p class="note">Uiterlijk kies je vrij. Uitrusting (wapen, harnas, helm, schild, …) ontgrendel je door verder te spelen in het verhaal.</p></div>
  ${Object.keys(BM_AVATAR_PARTS).filter(k=>!SP_AVATAR_HIDDEN_PARTS.includes(k)).map(partSection).join("")}
  <button class="btn btn-gold btn-block lg" onclick="spSaveAvatarEdit()" style="margin-bottom:16px">Opslaan</button>
  ${foot()}`);
};
function spSaveAvatarEdit(){
  spAvatarSave(SP_AV_EDIT);
  SP_AV_EDIT=null;
  go(SP_AV_RETURN||"battleProfile");
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
          <div class="note" style="margin:2px 0">${esc(t.ds)}</div>
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

/* Scène-tekst mag (en vanaf Hoofdstuk 1 vaak: móét) uit meerdere alinea's
   bestaan, gescheiden door een lege regel in de CNS-bron. HTML negeert
   dubbele newlines binnen één <p>, dus splitsen we hier zelf in aparte
   <p>-elementen — anders smelt alles visueel samen tot één lange alinea. */
function spParagraphsHTML(text, state){
  if(!text) return "";
  return text.split(/\n\s*\n/)
    .map(para => `<p>${esc(SpTextResolver.resolve(para.trim(), state))}</p>`)
    .join("");
}

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
      case "tendency_address":     return spTendencyAddressPhrase(state);
      case "tendency_address_cap": return spCapitalize(spTendencyAddressPhrase(state));
    }
    return undefined;
  },
};
// Kiest een willekeurige, gender-passende aanspreekvorm bij de opgebouwde
// Clementia/Severitas-houding (spApproachTendency) — zie SP_TENDENCY_PHRASES
// (singleplayer-data.js). Vanaf Hoofdstuk 3 gebruikt in NPC-DIALOGUE/TEXT via
// {tendency_address}/{tendency_address_cap}.
function spTendencyAddressPhrase(state){
  const tendency = spApproachTendency(state);
  const noun = SP_TENDENCY_NOUN[state.gender] || SP_TENDENCY_NOUN.nonbinair;
  return pick(SP_TENDENCY_PHRASES[tendency]).replace("%NOUN%", noun);
}

/* ---- CNS PARSER — zet ruwe .cns-tekst om in een Map<sceneId, sceneObject> ---- */
const CNSParser = {
  KNOWN_SECTIONS:["TITLE","TEXT","DIALOGUE","CHOICES","IMAGE","MUSIC","SFX",
                  "CODEX","QUEST","COMBAT","REWARD","INVENTORY","PUZZLE","EERETITEL","FLAG",
                  "PERSON","VOCAB","FRAGMENT"],
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
  // Optioneel: een keuzeregel mag eindigen op [CLEMENTIA], [SEVERITAS] of
  // [NEUTRAL] vóór de "->" — een onzichtbare marker voor het Clementia/
  // Severitas-systeem (zie spChoosePath/spHookApproach). [NEUTRAL] markeert
  // een derde, twijfelende optie die WEL bij dezelfde keuzeset hoort (en dus
  // meeschudt in de weergavevolgorde, zie spPlay) maar geen punt op de
  // Clementia/Severitas-schaal oplevert. De marker wordt uit het zichtbare
  // label gesloopt; de speler ziet nooit dat een keuze getagd is.
  APPROACH_TAG_RE: /\s*\[(CLEMENTIA|SEVERITAS|NEUTRAL)\]\s*$/i,
  // Optioneel: een keuzeregel mag ook eindigen op [REQUIRE:sleutel=getal] —
  // verbergt die keuze tenzij aan de voorwaarde is voldaan (zie
  // spChoiceVisible in singleplayer.js). Nu alleen "fragments" gebruikt
  // (Hoofdstuk 2: pas naar het Orakel zodra alle 4 Herinneringsfragmenten
  // binnen zijn), maar generiek genoeg voor latere vergelijkbare gates.
  REQUIRE_TAG_RE: /\s*\[REQUIRE:(\w+)=(\d+)\]\s*$/i,
  parseChoices(text){
    const choices=[];
    for(const raw of text.split(/\r?\n/)){
      const line=raw.trim();
      if(!line.startsWith("*")) continue;
      const withoutBullet = line.replace(/^\*\s*/,"");
      const arrowIndex = withoutBullet.lastIndexOf("->");
      if(arrowIndex===-1) continue;
      let label = withoutBullet.slice(0,arrowIndex).trim();
      const target = withoutBullet.slice(arrowIndex+2).trim();
      let approach = null, require = null;
      const reqM = label.match(this.REQUIRE_TAG_RE);
      if(reqM){ require = { key:reqM[1].toLowerCase(), value:+reqM[2] }; label = label.slice(0,reqM.index).trim(); }
      const tagM = label.match(this.APPROACH_TAG_RE);
      if(tagM){ approach = tagM[1].toUpperCase(); label = label.slice(0,tagM.index).trim(); }
      choices.push({ label, target, approach, require });
    }
    return choices;
  },
};

const SP_SCENES = new Map([...CNSParser.parse(SP_PROLOOG_CNS), ...CNSParser.parse(SP_CH1_CNS), ...CNSParser.parse(SP_CH2_CNS), ...CNSParser.parse(SP_CH3_CNS)]);
const SP_EMPTY_STATE = ()=>({ node:null, gender:null, classId:null, traits:[], codex:[], quests:{}, flags:{}, approach:{clementia:0,severitas:0}, persons:{}, vocab:[], seenImages:[], fragments:[] });

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
SCREENS.singlePlayer = function(){ go("spIntro"); };

/* ---- INTRO/TITELSCHERM: eenvoudige "startpagina" met de Main Theme, als
   licht substituut voor een echte openingscinematic (zie Chronica.md §8 voor
   de video-aanbeveling aan de auteur). Verschijnt elke keer bij het openen
   van Chronica Classica vanuit het portaal — geen eenmalige eerste-keer-only
   flag, want het is bedoeld als sfeervol titelscherm, niet als tutorial. ---- */
SCREENS.spIntro = function(){
  document.body.classList.remove("greek");
  spPlayMusic("main_theme.mp3");
  H(brand(true)+`
  <div class="scrhead"><button class="back" onclick="spStopMusic();go('home')">${iconSVG("shield",20,"currentColor")}</button><h2>Chronica Classica</h2>${spAudioToggleHTML()}</div>
  <div class="panel" style="text-align:center">
    <span class="ic">${iconSVG("star",56,"currentColor")}</span>
    <h3 style="margin-top:10px">Chronica Classica</h3>
    <p class="note" style="margin-top:8px">Ooit kende iedereen hun namen. Nu vervagen de goden en helden van de klassieke oudheid uit de herinnering — en jij bent de enige die dat nog kan tegenhouden.</p>
    <button class="btn btn-gold btn-block lg" style="margin-top:16px" onclick="go('spSlots')">Beginnen</button>
  </div>
  ${foot()}`);
};

/* ---- SLOTOVERZICHT: kiezen/beginnen/verwijderen per opslagplek ---- */
SCREENS.spSlots = function(){
  document.body.classList.remove("greek");
  H(brand(true)+`
  <div class="scrhead"><button class="back" onclick="spStopMusic();go('home')">${iconSVG("shield",20,"currentColor")}</button><h2>Chronica Classica</h2></div>
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
    H(brand(true)+`
    <div class="scrhead"><button class="back" onclick="go('home')">${iconSVG("shield",20,"currentColor")}</button><h2>Chronica Classica</h2></div>
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
  // Vangnet: verwijst een oude save naar een scène-id die niet meer bestaat
  // (bv. na het hernoemen van CH1_ → PRO_), begin dan netjes bij het begin
  // i.p.v. door te sturen naar een dode node.
  if(SP_STATE.node && !SP_SCENES.has(SP_STATE.node)) SP_STATE.node = [...SP_SCENES.keys()][0];
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

// Welk campagnehoofdstuk hoort bij een node-id (PRO_ = proloog, CH<n>_ =
// hoofdstuk n) — gebruikt door de landingspagina zodat "Verdergaan" het juiste
// hoofdstuk toont, ook als de speler al voorbij de proloog is.
function spCurrentCampaignChapter(node){
  if(node && node.indexOf("PRO_")!==0){
    const m = node.match(/^CH(\d+)_/);
    if(m){ const ch = SP_CAMPAIGN.find(c=>c.nr===+m[1]); if(ch) return ch; }
  }
  return SP_CAMPAIGN[0];
}
function spRenderLanding(){
  const resuming = !!(SP_STATE.node && SP_STATE.node!==SP_SCENES.keys().next().value);
  const chapter = spCurrentCampaignChapter(SP_STATE.node);
  const eyebrowLbl = chapter.type==="proloog" ? "Proloog" : "Hoofdstuk "+chapter.nr;
  H(brand(true)+`
  <div class="scrhead"><button class="back" onclick="go('spSlots')">${iconSVG("shield",20,"currentColor")}</button><h2>Chronica Classica</h2></div>
  <div class="panel" style="text-align:center">
    <span class="ic">${iconSVG("star",44,"currentColor")}</span>
    <div class="eyebrow l">${esc(eyebrowLbl)}</div>
    <h3 style="margin-top:4px">${esc(chapter.nm)}</h3>
    <p class="note">${esc(chapter.verhaal)}</p>
    <button class="btn btn-gold btn-block lg" style="margin-top:14px" onclick="spGoCns('${SP_STATE.node||[...SP_SCENES.keys()][0]}')">${resuming?"Verdergaan":"Beginnen"}</button>
  </div>
  ${resuming?`<button class="btn btn-ghost btn-block" style="margin-bottom:8px" onclick="go('spWorldMap')">🗺️ Wereldkaart</button>`:""}
  ${resuming?`<button class="btn btn-ghost btn-block" style="margin-bottom:14px" onclick="go('spCodex')">📖 Codex Memoriae</button>`:""}
  ${foot()}`);
}

/* ---- CODEX MEMORIAE: een oud perkamenten boek met zes tabbladen. Codex is
   PER SAVESLOT, net als de wereldkaart — elke slot toont dus alleen wat DIE
   doorspeling al heeft ontdekt. Niets wordt vooruit getoond (geen
   "??"-placeholder voor wat nog moet komen — dat zou spoilen).
   - Mythologie/Geschiedenis/Grammatica: SP_CODEX_ENTRIES, ontgrendeld via de
     bestaande CODEX:-sectie (spHookCodex). Grammatica-entries mogen een
     `table` hebben (rijtjes/naamvallen), gerenderd als een echte <table>.
   - Personen: SP_CODEX_PERSONS, tweetraps (intro/full) via PERSON:.
   - Vocabulaire: SP_VOCAB_ENTRIES, via VOCAB:.
   - Afbeeldingen: SP_STATE.seenImages, automatisch bijgehouden door
     spHookSeenImage() zodra een scène met een IMAGE: wordt bezocht. ---- */
let SP_CODEX_TAB = "mythologie";
const SP_CODEX_TABS = [
  { id:"mythologie",   nm:"Mythologie",   icon:"⚡" },
  { id:"geschiedenis", nm:"Geschiedenis", icon:"🏺" },
  { id:"personen",     nm:"Personen",     icon:"👤" },
  { id:"grammatica",   nm:"Grammatica",   icon:"📜" },
  { id:"vocabulaire",  nm:"Vocabulaire",  icon:"🔤" },
  { id:"afbeeldingen", nm:"Afbeeldingen", icon:"🖼️" },
];
function spSwitchCodexTab(tab){ SP_CODEX_TAB = tab; go("spCodex"); }
SCREENS.spCodex = function(){
  document.body.classList.remove("greek");
  if(!SP_ACTIVE_SLOT){ go("spSlots"); return; }
  const tabsHTML = SP_CODEX_TABS.map(t=>
    `<button class="codex-tab${t.id===SP_CODEX_TAB?" on":""}" onclick="spSwitchCodexTab('${t.id}')">${t.icon} ${esc(t.nm)}</button>`
  ).join("");
  const bodies = {
    mythologie: ()=>spCodexEntriesHTML("mythologie", "Nog niets vastgelegd — mythen verschijnen hier zodra je ze beleeft."),
    geschiedenis: ()=>spCodexEntriesHTML("geschiedenis", "Nog niets vastgelegd — Hoofdstuk 1 is nog puur mythologie; historische bladzijden volgen bij latere hoofdstukken."),
    grammatica: ()=>spCodexEntriesHTML("grammatica", "Nog niets vastgelegd — grammatica verschijnt hier zodra een hoofdstuk erom vraagt."),
    personen: spCodexPersonsHTML,
    vocabulaire: spCodexVocabHTML,
    afbeeldingen: spCodexImagesHTML,
  };
  const body = (bodies[SP_CODEX_TAB]||bodies.mythologie)();
  H(brand(true)+`
  <div class="scrhead"><button class="back" onclick="go('spSlots')">${iconSVG("shield",20,"currentColor")}</button><h2>Codex Memoriae</h2></div>
  <div class="codex-book">
    <div class="codex-tabs">${tabsHTML}</div>
    <div class="codex-page">${body}</div>
  </div>
  ${foot()}`);
};
function spCodexEntriesHTML(cat, emptyMsg){
  const codex = SP_STATE.codex||[];
  const entries = codex.map(id=>SP_CODEX_ENTRIES[id]).filter(e=>e && e.cat===cat);
  if(!entries.length) return `<p class="codex-empty">${esc(emptyMsg)}</p>`;
  return entries.map(e=>`
    <div class="codex-entry">
      <h4>${esc(e.titel)}</h4>
      <p>${esc(e.tekst)}</p>
      ${e.table?spCodexTableHTML(e.table):""}
    </div>`).join("");
}
function spCodexTableHTML(table){
  const head = table.headers.map(h=>`<th>${esc(h)}</th>`).join("");
  const rows = table.rows.map(r=>`<tr>${r.map(c=>`<td>${esc(c)}</td>`).join("")}</tr>`).join("");
  return `<table class="codex-table"><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table>`;
}
function spCodexPersonsHTML(){
  const persons = SP_STATE.persons||{};
  const ids = Object.keys(persons);
  if(!ids.length) return `<p class="codex-empty">Nog niemand vastgelegd — ontmoet personages in het verhaal om ze hier terug te vinden.</p>`;
  return ids.map(id=>{
    const def = SP_CODEX_PERSONS[id]; if(!def) return "";
    const level = persons[id];
    const nm = level==="intro" && def.introNm ? def.introNm : def.nm;
    const epithet = level==="intro" && def.introEpithet ? def.introEpithet : def.epithet;
    return `<div class="codex-entry">
      <h4>${esc(nm)}</h4>
      ${epithet?`<div class="codex-epithet">${esc(epithet)}</div>`:""}
      <p>${esc(def.intro)}</p>
      ${level==="full" && def.full ? `<div class="codex-fold"></div><p>${esc(def.full)}</p>` : ""}
    </div>`;
  }).join("");
}
function spCodexVocabHTML(){
  const vocab = SP_STATE.vocab||[];
  if(!vocab.length) return `<p class="codex-empty">Nog geen woorden geleerd — ze verschijnen hier zodra je een hoofdstuk voltooit.</p>`;
  const grieks = vocab.filter(id=>SP_VOCAB_ENTRIES[id]?.taal==="grieks");
  const latijn = vocab.filter(id=>SP_VOCAB_ENTRIES[id]?.taal==="latijn");
  const row = id=>{ const w=SP_VOCAB_ENTRIES[id]; if(!w) return "";
    return `<div class="codex-vocab-row"><span class="codex-vocab-word">${esc(w.woord)}${w.transcript?` <em>(${esc(w.transcript)})</em>`:""}</span><span class="codex-vocab-def">${esc(w.betekenis)}</span></div>`; };
  return `
    <h4>Grieks</h4>
    ${grieks.length?grieks.map(row).join(""):'<p class="codex-empty">Nog geen Griekse woorden.</p>'}
    <h4 style="margin-top:14px">Latijn</h4>
    ${latijn.length?latijn.map(row).join(""):'<p class="codex-empty">Nog geen Latijnse woorden.</p>'}
  `;
}
function spCodexImagesHTML(){
  const imgs = SP_STATE.seenImages||[];
  if(!imgs.length) return `<p class="codex-empty">Nog geen scènes met een illustratie bezocht.</p>`;
  return `<div class="codex-gallery">${imgs.map(i=>`
    <div class="codex-gallery-item">
      <img src="assets/chronica/images/${esc(i.img)}" alt="" onerror="this.parentElement.style.display='none'">
      <div class="codex-gallery-caption">${esc(i.titel)}</div>
    </div>`).join("")}</div>`;
}

/* ---- WERELDKAART: geïllustreerd paneel + onthullende locatie-pins.
   Codex is PER SAVESLOT (net als de rest van SP_STATE), dus de kaart toont
   de ontdekkingen van de actieve slot — logisch, want elke slot is een eigen
   doorspeling met een eigen route door het verhaal. ---- */
let SP_MAP_CURRENT_PANEL = "aegean";
SCREENS.spWorldMap = function(){
  document.body.classList.remove("greek");
  if(!SP_ACTIVE_SLOT){ go("spSlots"); return; }
  if(!SP_MAP_PANELS[SP_MAP_CURRENT_PANEL]) SP_MAP_CURRENT_PANEL = Object.keys(SP_MAP_PANELS)[0];
  const panelId = SP_MAP_CURRENT_PANEL;
  const panel = SP_MAP_PANELS[panelId];
  const codex = SP_STATE.codex||[];
  const pins = SP_MAP_LOCATIONS
    .filter(loc=>loc.panel===panelId && spLocationUnlocked(loc, codex))
    .map(loc=>`<button class="sp-map-pin" style="left:${loc.x}%;top:${loc.y}%" title="${esc(loc.nm)}" onclick="spShowLocationInfo('${loc.id}')">
      <span class="sp-map-pin-dot"></span><span class="sp-map-pin-label">${esc(loc.nm)}</span>
    </button>`).join("");
  const tabs = Object.keys(SP_MAP_PANELS).map(pid=>
    `<button class="btn ${pid===panelId?"btn-primary":"btn-ghost"}" style="flex:1" onclick="spSwitchMapPanel('${pid}')">${esc(SP_MAP_PANELS[pid].nm.split(" — ")[0])}</button>`
  ).join("");
  H(brand(true)+`
  <div class="scrhead"><button class="back" onclick="go('spSlots')">${iconSVG("shield",20,"currentColor")}</button><h2>Wereldkaart</h2></div>
  <div class="panel" style="display:flex;gap:8px">${tabs}</div>
  <div class="panel"><p class="note">${esc(panel.nm)} — nieuwe plekken verschijnen zodra je ze in het verhaal hebt bezocht.</p></div>
  <div class="panel" style="padding:0;overflow:hidden;position:relative">
    <img src="assets/chronica/maps/${esc(panel.img)}" alt="" style="width:100%;display:block" onerror="this.parentElement.querySelector('.sp-map-missing').style.display='block'">
    <div class="sp-map-missing note" style="display:none;padding:40px 16px;text-align:center">Kaart nog niet beschikbaar.</div>
    <div style="position:absolute;inset:0">${pins}</div>
  </div>
  ${foot()}`);
};
function spSwitchMapPanel(pid){
  SP_MAP_CURRENT_PANEL = pid;
  go("spWorldMap");
}
function spShowLocationInfo(id){
  const loc = SP_MAP_LOCATIONS.find(l=>l.id===id);
  if(loc) toast(loc.nm, loc.desc);
}

/* ---- NAVIGATIE ---- */
function spGoCns(nodeId){
  spSaveProgress({ node:nodeId });
  go("spPlay");
}
/* Klik op een keuzeknop: registreert eerst stil de Clementia/Severitas-tag (indien
   aanwezig — zie CNSParser.APPROACH_TAG_RE) en navigeert dan pas door. Zo
   blijft spGoCns bruikbaar voor alle andere navigatie (puzzels, kaart-pins,
   "Verdergaan"-knop) die geen approach-tag kennen. */
function spChoosePath(target, approach){
  if(approach) spHookApproach(approach);
  spGoCns(target);
}
// Bepaalt of een keuze met een [REQUIRE:sleutel=getal]-tag getoond mag
// worden (CNSParser.REQUIRE_TAG_RE). Nu alleen "fragments" (Hoofdstuk 2: de
// weg naar het Orakel opent pas met alle 4 Herinneringsfragmenten binnen).
function spChoiceVisible(c){
  if(!c.require) return true;
  if(c.require.key==="fragments") return (SP_STATE.fragments||[]).length >= c.require.value;
  return true;
}

/* ---- SCÈNE-RENDERER ---- */
SCREENS.spPlay = function(){
  document.body.classList.remove("greek");
  if(!SP_ACTIVE_SLOT || !SP_STATE.node){ go("singlePlayer"); return; }
  const scene = SP_SCENES.get(SP_STATE.node);
  if(!scene){ go("singlePlayer"); return; }

  spRunMetaHooks(scene.meta);
  spHookSeenImage(scene);

  if(scene.meta.PUZZLE) return spRenderPuzzle(scene);
  if(scene.meta.COMBAT) return spStartCombatFromScene(scene);

  const titleHTML = scene.title ? `<h3>${esc(SpTextResolver.resolve(scene.title, SP_STATE))}</h3>` : "";
  const textHTML = spParagraphsHTML(scene.text, SP_STATE);
  const dialogueHTML = scene.dialogue ? `
    <div class="panel">
      <div class="eyebrow l">${esc(SpTextResolver.resolve(scene.dialogue.speaker, SP_STATE))}</div>
      <p>“${esc(SpTextResolver.resolve(scene.dialogue.text, SP_STATE))}”</p>
    </div>` : "";
  // Bij een Clementia/Severitas/Neutraal-keuzeset wordt de volgorde bij elk
  // bezoek opnieuw geschud (shuffle, core.js) — anders zou de vaste volgorde
  // in de CNS-brontekst zelf al verklappen welke knop welke kant op telt.
  let visibleChoices = scene.choices.filter(spChoiceVisible);
  if(visibleChoices.some(c=>c.approach)) visibleChoices = shuffle(visibleChoices);
  const choicesHTML = visibleChoices.length
    ? visibleChoices.map(c=>`<button class="btn btn-gold btn-block lg" style="margin-top:8px" onclick="spChoosePath('${c.target}','${c.approach||""}')">${esc(SpTextResolver.resolve(c.label, SP_STATE))}</button>`).join("")
    : `<button class="btn btn-ghost btn-block lg" onclick="go('spSlots')">Terug naar de opslagplekken</button>`;

  H(brand(true)+`
  <div class="scrhead"><span></span><h2>Chronica Classica</h2>${spAudioToggleHTML()}</div>
  <div class="panel">${spSceneImageHTML(scene)}${spChapterEyebrowHTML()}${titleHTML}${textHTML}</div>
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
  if(meta.FLAG)      spHookFlag(meta.FLAG);
  if(meta.MUSIC)     spPlayMusic(meta.MUSIC.trim());
  if(meta.PERSON)    spHookPerson(meta.PERSON);
  if(meta.VOCAB)     spHookVocab(meta.VOCAB);
  if(meta.FRAGMENT)  spHookFragment(meta.FRAGMENT);
  // IMAGE wordt door spHookSeenImage(scene) verwerkt (aparte aanroep in
  // SCREENS.spPlay, want die heeft het hele scene-object nodig, niet alleen
  // de meta) — hier verder pure weergave via spSceneImageHTML(). SFX bestaat
  // nog niet (geen scène gebruikt het momenteel).
}

/* ---- AUDIO: MUSIC:-sectie speelt nu écht af (mp3 uit assets/chronica/music/),
   via één gedeeld <audio>-element dat blijft doorlopen (loop) zolang er geen
   nieuw nummer wordt aangevraagd — zo hoeft een reeks scènes met hetzelfde
   MUSIC:-nummer (bv. de hele Orakel-epiloog) niet steeds opnieuw te starten.
   spPlayMusic() wordt aangeroepen vanuit spRunMetaHooks(), die op zijn beurt
   alleen binnen SCREENS.spPlay() draait — d.w.z. altijd als resultaat van een
   klik (spChoosePath/spGoCns), dus binnen dezelfde gebruikersactie als de
   iPad-eis vereist. Een blokkade door het autoplay-beleid (bv. bij het
   automatisch hervatten van een save) wordt stil genegeerd; de mute-knop
   (spAudioToggleHTML) laat de speler het geluid dan alsnog zelf aanzetten. */
const SP_AUDIO_MUTED_KEY = "certamen_chronica_muted";
let SP_MUSIC_EL = null;
let SP_MUSIC_CURRENT = null;
function spAudioMuted(){ try{ return localStorage.getItem(SP_AUDIO_MUTED_KEY)==="1"; }catch(e){ return false; } }
function spSetAudioMuted(muted){
  try{ localStorage.setItem(SP_AUDIO_MUTED_KEY, muted?"1":"0"); }catch(e){}
  if(SP_MUSIC_EL) SP_MUSIC_EL.muted = muted;
}
function spToggleAudioMuted(){
  const nowMuted = !spAudioMuted();
  spSetAudioMuted(nowMuted);
  if(!nowMuted && SP_MUSIC_EL) SP_MUSIC_EL.play().catch(()=>{});
  if(_screen && SCREENS[_screen]) SCREENS[_screen]();
}
function spAudioToggleHTML(){
  const muted = spAudioMuted();
  return `<button title="${muted?"Geluid aanzetten":"Geluid uitzetten"}" aria-label="${muted?"Geluid aanzetten":"Geluid uitzetten"}"
    style="flex:0 0 auto;padding:6px 10px;font-size:20px;line-height:1;background:none;border:none;cursor:pointer;color:var(--hi-bright)"
    onclick="spToggleAudioMuted()">${muted?"🔇":"🔊"}</button>`;
}
function spPlayMusic(filename){
  if(!filename) return;
  if(!SP_MUSIC_EL){ SP_MUSIC_EL = new Audio(); SP_MUSIC_EL.loop = true; }
  if(SP_MUSIC_CURRENT === filename) return; // al aan het spelen — niet herstarten
  SP_MUSIC_CURRENT = filename;
  SP_MUSIC_EL.src = "assets/chronica/music/"+filename;
  SP_MUSIC_EL.volume = 0.5;
  SP_MUSIC_EL.muted = spAudioMuted();
  SP_MUSIC_EL.play().catch(()=>{});
}
function spStopMusic(){
  SP_MUSIC_CURRENT = null;
  if(SP_MUSIC_EL){ SP_MUSIC_EL.pause(); SP_MUSIC_EL.src = ""; }
}
/* FLAG: zet één of meer vlaggen bij het binnenkomen van een scène. Zo dragen
   keuzes (en wélke plotlijn je koos) door naar latere hoofdstukken: elke
   branch-specifieke scène zet zijn eigen vlag. Regels/`;`-gescheiden;
   "naam" → true, "naam=waarde" → die waarde. NPC's die er conditioneel op
   reageren vragen nog een CONDITION-mechanisme (volgende bouwstap). */
function spHookFlag(text){
  const flags = {...(SP_STATE.flags||{})};
  text.split(/[\n;]/).forEach(part=>{
    part = part.trim(); if(!part) return;
    const eq = part.indexOf("=");
    if(eq===-1) flags[part] = true;
    else flags[part.slice(0,eq).trim()] = part.slice(eq+1).trim();
  });
  spSaveProgress({ flags });
}

/* ---- PERSONEN-TAB: PERSON:-sectie zet één of meer "id:niveau"-paren
   (`,`/`;`/regel-gescheiden), niveau is "intro" of "full". Alleen een
   upgrade telt (intro → full); een tweede "intro" of een lager niveau na
   "full" doet niets. SP_CODEX_PERSONS (singleplayer-data.js) levert de
   werkelijke tekst per niveau. ---- */
function spHookPerson(text){
  const RANK = { intro:1, full:2 };
  const persons = {...(SP_STATE.persons||{})};
  let changed = false;
  text.split(/[\n,;]/).forEach(part=>{
    part = part.trim(); if(!part) return;
    const [id, level] = part.split(":").map(s=>s&&s.trim());
    if(!id || !RANK[level]) return;
    if(!persons[id] || RANK[level] > RANK[persons[id]]){
      const wasKnown = !!persons[id];
      persons[id] = level;
      changed = true;
      const def = SP_CODEX_PERSONS[id];
      const shownNm = def && level==="intro" && def.introNm ? def.introNm : (def?def.nm:id);
      if(def) toast(wasKnown?"Codex bijgewerkt!":"Nieuwe persoon in de Codex!", shownNm);
    }
  });
  if(changed) spSaveProgress({ persons });
}
/* ---- VOCABULAIRE-TAB: VOCAB:-sectie voegt één of meer woord-id's toe aan
   SP_STATE.vocab (dedup) — SP_VOCAB_ENTRIES (singleplayer-data.js) levert de
   werkelijke woorden. Eén toast per batch (niet per woord) om spam te
   voorkomen wanneer een hoofdstuk in één keer een hele lijst toevoegt. ---- */
function spHookVocab(text){
  const ids = text.split(/[\n,;]/).map(s=>s.trim()).filter(Boolean);
  const existing = SP_STATE.vocab||[];
  const fresh = ids.filter(id=>!existing.includes(id));
  if(!fresh.length) return;
  spSaveProgress({ vocab:[...existing, ...fresh] });
  toast("Nieuwe woorden!", fresh.length+" woord"+(fresh.length===1?"":"en")+" toegevoegd aan de Codex.");
}
/* ---- HERINNERINGSFRAGMENTEN (Fragmentum Memoriae) — Hoofdstuk 2's
   hoofdstuk-brede voltooiingsgate: i.p.v. "één lijn = hoofdstuk klaar"
   (Hoofdstuk 1) moet de speler hier ALLE lijnen afronden. Elke lijn geeft bij
   zijn afsluiting een eigen fragment (FRAGMENT:-sectie, bare id, net als
   CODEX:); SP_FRAGMENTS (singleplayer-data.js) levert naam/icoon. Zodra
   SP_STATE.fragments alle vier bevat, wordt een [REQUIRE:fragments=4]-keuze
   op de hub zichtbaar (spChoiceVisible) die naar de Athena/Orakel-afsluiting
   leidt. Geen apart scherm — het fragment-aantal is puur een stille teller,
   zichtbaar gemaakt via de toast bij het verdienen ervan. ---- */
function spHookFragment(text){
  const id = text.trim();
  const existing = SP_STATE.fragments||[];
  if(existing.includes(id)) return;
  spSaveProgress({ fragments:[...existing, id] });
  const def = SP_FRAGMENTS[id];
  toast("Herinneringsfragment!", def ? `${def.icon} ${def.nm}` : id);
}
/* ---- AFBEELDINGEN-TAB: elke scène met een IMAGE:-sectie wordt automatisch
   bijgehouden (geen aparte auteurs-actie nodig) zodra de speler haar voor het
   eerst ziet — dedup op scène-id, zodat herhaald bezoek niets dubbel opslaat. ---- */
function spHookSeenImage(scene){
  if(!scene.meta || !scene.meta.IMAGE) return;
  const existing = SP_STATE.seenImages||[];
  if(existing.some(e=>e.id===scene.id)) return;
  const entry = { id:scene.id, img:scene.meta.IMAGE.trim(), titel:scene.title||"" };
  spSaveProgress({ seenImages:[...existing, entry] });
}

/* ---- CLEMENTIA/SEVERITAS — het stille "Paragon/Renegade"-systeem.
   Een keuzeregel in CHOICES mag eindigen op [CLEMENTIA] of [SEVERITAS] (zie
   CNSParser.APPROACH_TAG_RE); die tag wordt NOOIT getoond aan de speler en
   heeft ook geen eigen scherm/HUD — het is puur een stilzwijgende teller die
   meetelt hoe de speler zich door het verhaal gedraagt (mild/invoelend versus
   nuchter/daadkrachtig), ook wanneer beide keuzes naar dezelfde volgende
   scène leiden. Toekomstige hoofdstukken kunnen met spApproachTendency() een
   NPC laten reageren op de OPGEBOUWDE houding (via een CONDITION-mechanisme,
   zie Chronica.md §8) — dat is bewust losgekoppeld van deze telfunctie zelf. */
function spHookApproach(tag){
  const key = tag==="CLEMENTIA" ? "clementia" : tag==="SEVERITAS" ? "severitas" : null;
  if(!key) return;
  const approach = {...(SP_STATE.approach||{clementia:0,severitas:0})};
  approach[key] = (approach[key]||0) + 1;
  spSaveProgress({ approach });
}
// Overwicht van de opgebouwde houding — "clementia"/"severitas" bij een duidelijk
// overwicht, anders "neutraal" (gelijke stand of nog geen enkele keuze
// gemaakt). state is optioneel (default SP_STATE) zodat spTendencyAddressPhrase
// hem kan aanroepen met de state die SpTextResolver toevallig meekreeg.
function spApproachTendency(state){
  const a = (state||SP_STATE).approach||{clementia:0,severitas:0};
  if(a.clementia===a.severitas) return "neutraal";
  return a.clementia>a.severitas ? "clementia" : "severitas";
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

/* Oriëntatie-label voor de scène-koptekst, afgeleid van het node-prefix:
   PRO_ = Proloog, CH<n>_ = het bijbehorende hoofdstuk uit SP_CAMPAIGN. */
function spChapterLabel(node){
  if(!node) return "";
  if(node.indexOf("PRO_")===0) return "Proloog — "+(SP_CAMPAIGN[0]?.nm||"");
  const m = node.match(/^CH(\d+)_/);
  if(m){
    const ch = SP_CAMPAIGN.find(c=>c.nr===+m[1]);
    return ch ? ("Hoofdstuk "+m[1]+" — "+ch.nm) : ("Hoofdstuk "+m[1]);
  }
  return "";
}
function spChapterEyebrowHTML(){
  const lbl = spChapterLabel(SP_STATE.node);
  return lbl ? `<div class="eyebrow l">${esc(lbl)}</div>` : "";
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
// Eén of meerdere codex-id's (`,`/`;`/regel-gescheiden) in één CODEX:-sectie —
// bv. CH1_000 ontgrendelt in één keer de twee grammatica-entries van
// Hoofdstuk 1, zodat ze al vóór de eerste puzzel beschikbaar zijn.
function spHookCodex(text){
  const ids = text.split(/[\n,;]/).map(s=>s.trim()).filter(Boolean);
  const existing = SP_STATE.codex||[];
  const fresh = ids.filter(id=>!existing.includes(id));
  if(!fresh.length) return;
  spSaveProgress({ codex:[...existing, ...fresh] });
  toast("Codex-item ontgrendeld!","Er is een nieuwe bladzijde toegevoegd aan de Codex Memoriae.");
}
function spHookQuest(text){
  const idx=text.indexOf(":");
  const questId = idx===-1?text.trim():text.slice(0,idx).trim();
  const status = idx===-1?"gestart":text.slice(idx+1).trim();
  spSaveProgress({ quests:{...(SP_STATE.quests||{}), [questId]:status} });
}

/* ---- PUZZELS (§ Educatieve Poortwachters) ------------------------------------
   Een PUZZLE-scène blokkeert tot de puzzel is opgelost; daarna gaat de engine
   naar het doel van de (enige) keuze in die scène. spRenderPuzzle dispatcht op
   puzzle.type, zodat elk hoofdstuk zijn eigen puzzelsoort kan hebben. VASTE
   MOEILIJKHEIDSOPBOUW (vastgelegd 2026-07): puzzels mogen per hoofdstuk
   geleidelijk zwaarder worden — van meerkeuze naar zelf typen — dus nieuwe
   hoofdstukken hoeven niet bij "multiple-choice" te blijven hangen.
   - "greek-transliteration" : Grieks woord → Latijnse transcriptie, meerkeuze
                               (proloog).
   - "multiple-choice"       : grammaticavraag met keuzeknoppen (bv. naamval
                               herkennen — welk woord is nominativus/accusativus/
                               vocativus; welk lidwoord hoort erbij).
   - "typed-latin"           : de speler typt zelf het Latijnse antwoord, met
                               het normale (Latijnse) toetsenbord van het
                               toestel — geen speciale behandeling nodig.
   - "typed-greek"           : de speler typt zelf Grieks, via een eigen
                               schermtoetsenbord (spGreekKeyboardHTML) i.p.v.
                               het systeemtoetsenbord — zie §7.7 in
                               Chronica.md voor de motivatie en de
                               normalisatieregels bij het nakijken
                               (spNormalizeGreek). ------------ */
function spRenderPuzzle(scene){
  const puzzleId = scene.meta.PUZZLE.trim();
  const puzzle = SP_PUZZLES[puzzleId];
  const target = scene.choices[0]?.target;
  if(!puzzle){ console.error("Onbekende puzzel:", puzzleId); return spGoCns(target); }
  const type = puzzle.type||"greek-transliteration";
  if(type==="multiple-choice") return spRenderMCPuzzle(scene, puzzleId, puzzle, target);
  if(type==="typed-latin")     return spRenderTypedLatinPuzzle(scene, puzzleId, puzzle, target);
  if(type==="typed-greek")     return spRenderTypedGreekPuzzle(scene, puzzleId, puzzle, target);
  return spRenderGreekPuzzle(scene, puzzleId, puzzle, target);
}

// Gedeelde bovenkant van een puzzelscherm (illustratie + hoofdstuklabel + tekst).
function spPuzzleHeaderHTML(scene){
  return `<div class="panel">
    ${spSceneImageHTML(scene)}${spChapterEyebrowHTML()}
    <h3>${esc(SpTextResolver.resolve(scene.title, SP_STATE))}</h3>
    ${spParagraphsHTML(scene.text, SP_STATE)}
  </div>`;
}

function spRenderGreekPuzzle(scene, puzzleId, puzzle, target){
  const rows = SP_GREEK_ALPHABET.map(l=>
    `<div style="display:flex;justify-content:space-between;padding:2px 0;border-bottom:1px solid rgba(255,255,255,.08)">
      <span>${esc(l.letter)}</span><span class="note">${esc(l.nm)} = ${esc(l.translit)}</span>
    </div>`
  ).join("");
  H(brand(true)+`
  <div class="scrhead"><span></span><h2>Chronica Classica</h2>${spAudioToggleHTML()}</div>
  ${spPuzzleHeaderHTML(scene)}
  <div class="panel" style="text-align:center"><div style="font-size:32px;letter-spacing:4px;margin:4px 0">${esc(puzzle.woord.grieks)}</div></div>
  <div class="panel">
    <details><summary class="note" style="cursor:pointer">Griekse alfabet (transcriptietabel)</summary>${rows}</details>
  </div>
  <div class="panel">
    <label class="fld">Jouw transcriptie</label>
    <input id="spPuzzleInput" type="text" placeholder="typ hier…" onkeydown="if(event.key==='Enter')spCheckGreekPuzzle('${puzzleId}','${target}')">
    <div id="spPuzzleErr" class="note warn" style="display:none;margin-top:8px"></div>
  </div>
  <button class="btn btn-gold btn-block lg" onclick="spCheckGreekPuzzle('${puzzleId}','${target}')">Controleren</button>
  ${foot()}`);
}
function spCheckGreekPuzzle(puzzleId, target){
  const puzzle = SP_PUZZLES[puzzleId];
  const input = (el("spPuzzleInput")?.value||"").trim().toLowerCase();
  const err = el("spPuzzleErr");
  if(input === puzzle.woord.antwoord.toLowerCase()) spGoCns(target);
  else if(err){ err.textContent = "Nog niet helemaal juist — kijk in de transcriptietabel en probeer opnieuw."; err.style.display = ""; }
}

/* Meerkeuze-grammaticapuzzel. puzzle = { type:"multiple-choice", vraag, opties:[],
   antwoord:"<juiste optietekst>", hint? }. Fout antwoord = hint + blijf staan;
   goed = door naar target. Knoppen zijn ≥44px hoog (iPad-veilig). */
function spRenderMCPuzzle(scene, puzzleId, puzzle, target){
  const optsHTML = puzzle.opties.map((o,i)=>
    `<button class="btn btn-block lg" style="margin-top:8px;text-align:left" onclick="spCheckMCPuzzle('${puzzleId}','${target}',${i})">${esc(o)}</button>`
  ).join("");
  H(brand(true)+`
  <div class="scrhead"><span></span><h2>Chronica Classica</h2>${spAudioToggleHTML()}</div>
  ${spPuzzleHeaderHTML(scene)}
  <div class="panel">
    <p style="font-weight:700;margin-bottom:4px">${esc(puzzle.vraag)}</p>
    ${optsHTML}
    <div id="spPuzzleErr" class="note warn" style="display:none;margin-top:10px"></div>
  </div>
  ${foot()}`);
}
function spCheckMCPuzzle(puzzleId, target, idx){
  const puzzle = SP_PUZZLES[puzzleId];
  const err = el("spPuzzleErr");
  if(puzzle.opties[idx] === puzzle.antwoord) spGoCns(target);
  else if(err){ err.textContent = puzzle.hint || "Nog niet juist — lees de zin nog eens en probeer opnieuw."; err.style.display = ""; }
}

/* Getypte Latijnse puzzel. puzzle = { type:"typed-latin", vraag, antwoord,
   hint? }. Gewoon systeemtoetsenbord — Latijn gebruikt hier geen tekens die
   niet al op een normaal (Nederlands/Engels) toetsenbord staan. Hoofdletter-
   en spatiëring-ongevoelig vergeleken. */
function spRenderTypedLatinPuzzle(scene, puzzleId, puzzle, target){
  H(brand(true)+`
  <div class="scrhead"><span></span><h2>Chronica Classica</h2>${spAudioToggleHTML()}</div>
  ${spPuzzleHeaderHTML(scene)}
  <div class="panel">
    <p style="font-weight:700;margin-bottom:4px">${esc(puzzle.vraag)}</p>
    <label class="fld">Jouw antwoord</label>
    <input id="spPuzzleInput" type="text" placeholder="typ hier…" onkeydown="if(event.key==='Enter')spCheckTypedLatinPuzzle('${puzzleId}','${target}')">
    <div id="spPuzzleErr" class="note warn" style="display:none;margin-top:8px"></div>
  </div>
  <button class="btn btn-gold btn-block lg" onclick="spCheckTypedLatinPuzzle('${puzzleId}','${target}')">Controleren</button>
  ${foot()}`);
}
function spCheckTypedLatinPuzzle(puzzleId, target){
  const puzzle = SP_PUZZLES[puzzleId];
  const input = (el("spPuzzleInput")?.value||"").trim().toLowerCase();
  const err = el("spPuzzleErr");
  if(input === puzzle.antwoord.trim().toLowerCase()) spGoCns(target);
  else if(err){ err.textContent = puzzle.hint || "Nog niet juist — probeer opnieuw."; err.style.display = ""; }
}

/* ---- GRIEKS SCHERMTOETSENBORD — puzzle.type "typed-greek".
   Het antwoordveld staat op readonly + inputmode="none": dat onderdrukt op
   iPad/iOS het systeemtoetsenbord (net als in andere apps met een eigen
   invoermechanisme), zodat alleen dit schermtoetsenbord tekens toevoegt.
   Spiritus asper/lenis en iota subscriptum zijn hier eigen toetsen (geen
   losse accenttekens) omdat ze grammaticaal als letters tellen, niet als
   versiering — vandaar dat spNormalizeGreek() ze bewust NIET wegfiltert bij
   het nakijken, in tegenstelling tot de echte accenten (acuut/gravis/
   circumflex), die voor het antwoord niet relevant zijn. ---- */
const SP_GREEK_KB_ROWS = [
  ["α","β","γ","δ","ε","ζ","η","θ","ι","κ","λ","μ"],
  ["ν","ξ","ο","π","ρ","σ","ς","τ","υ","φ","χ","ψ","ω"],
];
// Voor het toepassen van een modifier-toets op de laatst getypte letter.
const SP_GREEK_SMOOTH   = {"α":"ἀ","ε":"ἐ","η":"ἠ","ι":"ἰ","ο":"ὀ","υ":"ὐ","ω":"ὠ"};
const SP_GREEK_ROUGH    = {"α":"ἁ","ε":"ἑ","η":"ἡ","ι":"ἱ","ο":"ὁ","υ":"ὑ","ω":"ὡ","ρ":"ῥ"};
const SP_GREEK_IOTA_SUB = {"α":"ᾳ","η":"ῃ","ω":"ῳ"};
function spGreekKeyboardHTML(){
  const letterRows = SP_GREEK_KB_ROWS.map(row=>
    `<div style="display:flex;flex-wrap:wrap;gap:4px;justify-content:center;margin-bottom:4px">
      ${row.map(ch=>`<button class="btn" style="min-width:34px;padding:8px 0;font-size:18px" onclick="spGreekKeyPress('${ch}')">${ch}</button>`).join("")}
    </div>`
  ).join("");
  return `<div class="panel">
    ${letterRows}
    <div style="display:flex;flex-wrap:wrap;gap:4px;justify-content:center;margin-top:6px">
      <button class="btn btn-ghost" title="Spiritus lenis (op de laatste klinker)" onclick="spGreekApplyModifier('smooth')">᾿</button>
      <button class="btn btn-ghost" title="Spiritus asper (op de laatste klinker)" onclick="spGreekApplyModifier('rough')">῾</button>
      <button class="btn btn-ghost" title="Iota subscriptum (op α/η/ω)" onclick="spGreekApplyModifier('iota')">ι&#x0345;</button>
      <button class="btn btn-ghost" onclick="spGreekKeyPress(' ')">␣ spatie</button>
      <button class="btn btn-ghost" onclick="spGreekBackspace()">⌫</button>
    </div>
  </div>`;
}
function spGreekKeyPress(ch){
  const inp = el("spPuzzleInput");
  if(inp) inp.value += ch;
}
function spGreekBackspace(){
  const inp = el("spPuzzleInput");
  if(inp) inp.value = inp.value.slice(0,-1);
}
function spGreekApplyModifier(type){
  const inp = el("spPuzzleInput"); if(!inp || !inp.value) return;
  const map = type==="smooth" ? SP_GREEK_SMOOTH : type==="rough" ? SP_GREEK_ROUGH : SP_GREEK_IOTA_SUB;
  const last = inp.value.slice(-1);
  if(map[last]) inp.value = inp.value.slice(0,-1) + map[last];
}
// Genormaliseerde vergelijking voor getypt Grieks: NFD-decompose en
// verwijder ALLEEN de echte accenttekens (acuut/gravis/circumflex/macron/
// brevis — U+0301/0300/0342/0304/0306), niet spiritus (U+0313/0314) of iota
// subscriptum (U+0345), die als letters blijven meetellen. Eind-sigma (ς)
// en gewone sigma (σ) tellen als hetzelfde teken. Hoofdletter- en
// spatiëring-ongevoelig.
const SP_GREEK_ACCENT_MARKS_RE = /[́̀͂̄̆]/g;
function spNormalizeGreek(str){
  return (str||"").normalize("NFD")
    .replace(SP_GREEK_ACCENT_MARKS_RE, "")
    .normalize("NFC")
    .toLowerCase()
    .replace(/ς/g, "σ")
    .replace(/\s+/g, "");
}
function spRenderTypedGreekPuzzle(scene, puzzleId, puzzle, target){
  H(brand(true)+`
  <div class="scrhead"><span></span><h2>Chronica Classica</h2>${spAudioToggleHTML()}</div>
  ${spPuzzleHeaderHTML(scene)}
  <div class="panel">
    <p style="font-weight:700;margin-bottom:4px">${esc(puzzle.vraag)}</p>
    <input id="spPuzzleInput" type="text" inputmode="none" readonly value=""
      style="font-size:22px;text-align:center;letter-spacing:2px;cursor:default"
      placeholder="gebruik het Griekse toetsenbord hieronder…">
    <div id="spPuzzleErr" class="note warn" style="display:none;margin-top:8px"></div>
  </div>
  ${spGreekKeyboardHTML()}
  <button class="btn btn-gold btn-block lg" onclick="spCheckTypedGreekPuzzle('${puzzleId}','${target}')">Controleren</button>
  ${foot()}`);
}
function spCheckTypedGreekPuzzle(puzzleId, target){
  const puzzle = SP_PUZZLES[puzzleId];
  const raw = el("spPuzzleInput")?.value||"";
  const err = el("spPuzzleErr");
  if(spNormalizeGreek(raw) === spNormalizeGreek(puzzle.antwoord)) spGoCns(target);
  else if(err){ err.textContent = puzzle.hint || "Nog niet juist — let op de spiritus (᾿/῾) en probeer opnieuw."; err.style.display = ""; }
}

/* ---- COMBAT-BRIDGE — zie de toelichting bij SP_COMBAT_ENEMIES
   (singleplayer-data.js) voor de "waarom eigen implementatie". SP_COMBAT is
   bewust NIET onderdeel van SP_STATE/localStorage: een gevecht is kort en
   ademt niet over sessies heen — verlaat je de app halverwege, dan begin je
   het gevecht opnieuw bij terugkeer (net als bij de meeste boss-fights). ---- */
const SP_COMBAT_EP_PER_CORRECT = 10;
const SP_COMBAT_ACTION_COST = 20;
const SP_COMBAT_DAMAGE_PER_ATTACK = 15;
let SP_COMBAT = null;
function spStartCombatFromScene(scene){
  const enemyId = scene.meta.COMBAT.trim();
  const target = scene.choices[0]?.target;
  const enemy = SP_COMBAT_ENEMIES[enemyId];
  if(!enemy){ console.error("Onbekende vijand:", enemyId); return spGoCns(target); }
  SP_COMBAT = { enemyId, hp:enemy.hp, maxHp:enemy.hp, ep:0, target, question:null, sceneTitle:scene.title };
  spCombatNextQuestion();
  SCREENS.spCombat();
}
// Genereert een meerkeuzevraag uit de al geleerde vocabulaire (SP_STATE.vocab)
// — is die nog leeg (zou niet moeten gebeuren na Hoofdstuk 1, maar toch een
// vangnet), val terug op de volledige SP_VOCAB_ENTRIES-lijst.
function spCombatNextQuestion(){
  const ids = (SP_STATE.vocab&&SP_STATE.vocab.length) ? SP_STATE.vocab : Object.keys(SP_VOCAB_ENTRIES);
  const entries = ids.map(id=>SP_VOCAB_ENTRIES[id]).filter(Boolean);
  const w = pick(entries);
  const correct = w.betekenis;
  const distractors = shuffle(entries.filter(x=>x!==w).map(x=>x.betekenis))
    .filter((v,i,a)=>v!==correct && a.indexOf(v)===i).slice(0,3);
  SP_COMBAT.question = { woord:w.woord, correct, options:shuffle([correct, ...distractors]) };
}
// Zelfde formule als bmBossAliveHeads() (bossbattle.js): koppen gelijk
// verdeeld over de HP-balk, ceil() zodat een kop pas verdwijnt zodra zijn
// 1/7e-aandeel HELEMAAL weg is (niet al bij het eerste beetje schade).
function spCombatAliveHeads(headCount, hpPct){
  return Math.max(0, Math.min(headCount, Math.ceil((hpPct||0)*headCount)));
}
// Vijand-sprite: romp (met kale nekstompjes al ingetekend bij de Hydra) +
// eventuele losse kop-lagen erbovenop, exact dezelfde absolute-stapel-truc
// als Boss Battle se bmBossSpriteHTML() (bossbattle.js) — geen offsets
// nodig, elke laag is hetzelfde canvasformaat. Ontbreekt enemy.img, dan
// valt het terug op het icon-emoji.
function spCombatSpriteHTML(enemy){
  if(!enemy.img) return `<span style="font-size:40px">${enemy.icon}</span>`;
  let headsHTML = "";
  if(enemy.heads?.length){
    const hpPct = SP_COMBAT.maxHp ? SP_COMBAT.hp/SP_COMBAT.maxHp : 1;
    const alive = spCombatAliveHeads(enemy.heads.length, hpPct);
    headsHTML = enemy.heads.slice(0, alive).map(h=>
      `<img src="${esc(h)}" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain">`
    ).join("");
  }
  return `<div style="position:relative;width:140px;height:140px;margin:0 auto">
    <img src="${esc(enemy.img)}" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain"
      onerror="this.parentElement.innerHTML='<span style=&quot;font-size:40px&quot;>${esc(enemy.icon)}</span>'">
    ${headsHTML}
  </div>`;
}
SCREENS.spCombat = function(){
  if(!SP_COMBAT){ go("spSlots"); return; }
  const enemy = SP_COMBAT_ENEMIES[SP_COMBAT.enemyId];
  const q = SP_COMBAT.question;
  const hpPct = Math.max(0, Math.round(SP_COMBAT.hp/SP_COMBAT.maxHp*100));
  const canAttack = SP_COMBAT.ep >= SP_COMBAT_ACTION_COST;
  const optsHTML = q.options.map((o,i)=>
    `<button class="btn btn-block lg" style="margin-top:8px;text-align:left" onclick="spCombatAnswer(${i})">${esc(o)}</button>`
  ).join("");
  H(brand(true)+`
  <div class="scrhead"><span></span><h2>Gevecht</h2>${spAudioToggleHTML()}</div>
  <div class="panel" style="text-align:center">
    ${spCombatSpriteHTML(enemy)}
    <div class="eyebrow l" style="margin-top:6px">${esc(enemy.nm)}</div>
    <div style="height:10px;background:rgba(255,255,255,.12);border-radius:6px;overflow:hidden;margin:6px 0">
      <div style="height:100%;width:${hpPct}%;background:var(--hi-bright,#e8c77e)"></div>
    </div>
    <p class="note">${SP_COMBAT.hp} / ${SP_COMBAT.maxHp} levenspunten van de vijand — jouw EP: ${SP_COMBAT.ep}</p>
  </div>
  <div class="panel">
    <p style="font-weight:700;margin-bottom:4px">Wat betekent <em>${esc(q.woord)}</em>?</p>
    ${optsHTML}
    <div id="spCombatErr" class="note warn" style="display:none;margin-top:10px"></div>
  </div>
  ${canAttack?`<button class="btn btn-gold btn-block lg" onclick="spCombatAttack()">⚔️ Aanval (kost ${SP_COMBAT_ACTION_COST} EP)</button>`:""}
  ${foot()}`);
};
function spCombatAnswer(idx){
  const q = SP_COMBAT.question;
  const correct = q.options[idx]===q.correct;
  const err = el("spCombatErr");
  if(correct){
    SP_COMBAT.ep += SP_COMBAT_EP_PER_CORRECT;
    toast("Juist!", "+"+SP_COMBAT_EP_PER_CORRECT+" EP");
  } else if(err){
    err.textContent = "Niet juist — het juiste antwoord was \""+q.correct+"\". Geen EP deze beurt.";
    err.style.display = "";
  }
  spCombatNextQuestion();
  SCREENS.spCombat();
}
function spCombatAttack(){
  if(!SP_COMBAT || SP_COMBAT.ep < SP_COMBAT_ACTION_COST) return;
  SP_COMBAT.ep -= SP_COMBAT_ACTION_COST;
  SP_COMBAT.hp -= SP_COMBAT_DAMAGE_PER_ATTACK;
  if(SP_COMBAT.hp <= 0){
    const target = SP_COMBAT.target;
    SP_COMBAT = null;
    spGoCns(target);
    return;
  }
  SCREENS.spCombat();
}
