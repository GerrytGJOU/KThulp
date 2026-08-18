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
function spLowerFirst(str){ return str ? str.charAt(0).toLowerCase()+str.slice(1) : str; }
// Voor generieke Kroniek-zinnen die een keuze-label achteraan plakken en er
// zelf een punt achter zetten: sommige labels zijn al een volledig
// aangehaald citaat dat op ."/!"/?" eindigt (bv. FIN_003 se dialoogkeuzes),
// en kregen dan een dubbel leesteken: `...worden.".`. Alleen een punt
// toevoegen als het label zelf nog geen eigen zinseinde heeft.
function spSentenceEnd(text){ return /[.!?]["”]?$/.test(text||"") ? "" : "."; }

/* Scène-tekst mag (en vanaf Hoofdstuk 1 vaak: móét) uit meerdere alinea's
   bestaan, gescheiden door een lege regel in de CNS-bron. HTML negeert
   dubbele newlines binnen één <p>, dus splitsen we hier zelf in aparte
   <p>-elementen — anders smelt alles visueel samen tot één lange alinea. */
function spParagraphsHTML(text, state){
  if(!text) return "";
  return text.split(/\n\s*\n/)
    .map(para => spGlossHTML(SpTextResolver.resolve(para.trim(), state)))
    .filter(t => t!=="")
    .map(t => `<p>${t}</p>`)
    .join("");
}
// Glosbeleid (Chronica-audit B22): `[[brontekst|vertaling]]` in TEXT/DIALOGUE
// (na SpTextResolver, dus resolvet tokens gewoon eerst) wordt een woord met
// stippellijn; een tik toont de vertaling inline via CSS (`.gloss.open::after`,
// index.html) — verborgen tot dan, geen woordenlijst in de kantlijn, in lijn
// met de bestaande stijl (niets opgedrongen). Bouwt voort op B23's passieve
// laag: dezelfde Latijnse/Griekse woorden krijgen nu desgewenst een vertaling.
const SP_GLOSS_RE = /\[\[([^\]|]+)\|([^\]]+)\]\]/g;
function spGlossHTML(text){
  if(!text) return "";
  let out = "", last = 0, m;
  SP_GLOSS_RE.lastIndex = 0;
  while((m = SP_GLOSS_RE.exec(text))){
    out += esc(text.slice(last, m.index));
    out += `<span class="gloss" tabindex="0" role="button" aria-label="Toon vertaling" onclick="this.classList.toggle('open')" data-tr="${esc(m[2].trim())}">${esc(m[1].trim())}</span>`;
    last = SP_GLOSS_RE.lastIndex;
  }
  out += esc(text.slice(last));
  return out;
}

const SpTextResolver = {
  resolve(text, state){
    if(!text) return "";
    return text.replace(/\{([a-zA-Z0-9_]+(?:\.[a-zA-Z0-9_]+)?)\}/g, (match, path) => {
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
      case "held":     return SP_HELD_NOUN[state.gender] || SP_HELD_NOUN.man;
      case "held_cap": return spCapitalize(SP_HELD_NOUN[state.gender] || SP_HELD_NOUN.man);
      case "tendency_address":     return spTendencyAddressPhrase(state);
      case "tendency_address_cap": return spCapitalize(spTendencyAddressPhrase(state));
      case "eigen_wapen":          return SP_CLASS_WEAPON_NOUN[state.classId] || "wapen";
      case "bondgenoten_aanwezig": return spBondgenotenAanwezig(state);
      case "priamus_afscheid":     return ((state.relations||{}).priamus||0) >= SP_ENDKAPITAAL_HELPER_THRESHOLD ? SP_ENDKAPITAAL_PRIAMUS_AFSCHEID : "";
      case "cassandra_payoff":     return ((state.relations||{}).cassandra||0) >= SP_ENDKAPITAAL_HELPER_THRESHOLD ? SP_ENDKAPITAAL_CASSANDRA_PAYOFF : "";
      case "andromache_payoff":    return ((state.relations||{}).andromache||0) >= SP_ENDKAPITAAL_HELPER_THRESHOLD ? SP_ENDKAPITAAL_ANDROMACHE_PAYOFF : "";
      case "prometheus_route_echo": return SP_CH1_C09_ROUTE_ECHO[state.flags?.ch1_c09_route] || "";
      case "sfinx_route_echo":      return SP_CH6_007_ROUTE_ECHO[state.flags?.ch6_007_route] || "";
      case "ch9_zijde_h17_echo":    return SP_CH17_CH9_ZIJDE_ECHO[state.flags?.ch9_zijde] || "";
      case "medea_h17_echo":  return ((state.relations||{}).medea||0)  >= 1 ? SP_CH17_MEDEA_ECHO  : "";
      case "helena_h17_echo": return ((state.relations||{}).helena||0) >= 1 ? SP_CH17_HELENA_ECHO : "";
      case "ch18_proscripties_h19_echo": return state.flags?.ch18_lat_proscripties_gezien ? SP_CH19_PROSCRIPTIES_ECHO : "";
      case "ch19_gre_zijde_h20_echo": return SP_CH20_GRE_ZIJDE_ECHO[state.flags?.ch19_gre_zijde] || "";
      case "ch19_lat_zijde_h20_echo": return SP_CH20_LAT_ZIJDE_ECHO[state.flags?.ch19_lat_zijde] || "";
      case "ch20_sabinus_cotta_reactie": return SP_CH20_SABINUS_COTTA_REACTIE[state.flags?.ch20_lat_sabinus_cotta] || "";
      case "ch21_gre_socrates_pad_echo": return SP_CH21_SOCRATES_PAD_ECHO[state.flags?.ch21_gre_socrates_stemming] || "";
      case "ch22_gre_zijde_h23_echo": return SP_CH23_GRE_ZIJDE_ECHO[state.flags?.ch22_gre_zijde] || "";
      case "ch22_lat_zijde_h23_echo": return SP_CH23_LAT_ZIJDE_ECHO[state.flags?.ch22_lat_zijde] || "";
      case "npc_afsluitingen": {
        const items = spNpcAfsluitingenBeschikbaar(state);
        return items.length ? items.map(a=>a.tekst).join(" ") : SP_NPC_AFSLUITINGEN_FALLBACK;
      }
      case "fin_helden_credit":    return spFinaleClusterCreditText("helden", state);
      case "fin_grieken_credit":   return spFinaleClusterCreditText("grieken", state);
      case "fin_romeinen_credit":  return spFinaleClusterCreditText("romeinen", state);
      case "fin_dode_flags_credit": return spFinaleDodeFlagsCredit(state);
      // FIN_HER_003A (Kroniek, SP_KRONIEK_FORKS): Mnemosyne vraagt zelf naar
      // een CATEGORIE herinnering ("mensen dus, niet de goden, niet de
      // gebeurtenissen"), geen specifiek personage — maar de Kroniek kan wél
      // teruggrijpen op de sterkste RELATION die de speler zelf opbouwde,
      // in plaats van "een mens" generiek te laten (Gerben, 2026-08-19).
      // Geeft altijd een grammaticaal complete clausule terug (voornaamwoord
      // al ingevuld, geen geneste {subject}-token nodig) zodat er geen naam
      // beschikbaar hoeft te zijn voor een correcte zin.
      case "fin_her_mens": return spKleioFinHerMens(state);
      case "fin_einde_variant_line": return SP_FINALE_EINDE_VARIANT_LINES[state.flags?.fin_einde_variant] || "";
      case "fin_epiloog_lethe":       return spFinaleEpiloogLethe(state);
      case "fin_epiloog_troje":       return SP_FIN_EPILOOG_TROJE[state.flags?.ch9_zijde] || SP_FIN_EPILOOG_FALLBACK;
      case "fin_epiloog_achilles":    return SP_FIN_EPILOOG_ACHILLES[state.flags?.ch8_zijde] || SP_FIN_EPILOOG_FALLBACK;
      case "fin_epiloog_taalspoor":   return SP_FIN_EPILOOG_TAALSPOOR[state.flags?.taalspoor] || SP_FIN_EPILOOG_FALLBACK;
      case "fin_epiloog_ch1_lijn":    return SP_FIN_EPILOOG_CH1_LIJN[state.flags?.ch1_lijn] || SP_FIN_EPILOOG_FALLBACK;
      case "fin_epiloog_griekse_politiek": return spFinaleEpiloogPolitiek(state, [
          [SP_FIN_EPILOOG_CH19_GRE, "ch19_gre_zijde"], [SP_FIN_EPILOOG_CH22_GRE, "ch22_gre_zijde"] ]);
      case "fin_epiloog_romeinse_politiek": return spFinaleEpiloogPolitiek(state, [
          [SP_FIN_EPILOOG_CH19_LAT, "ch19_lat_zijde"], [SP_FIN_EPILOOG_CH22_LAT, "ch22_lat_zijde"] ]);
      // Dynamische IMAGE-bestandsnamen (Chronica.md §7.103) — zelfde
      // lookup-principe als de tekst-tokens hierboven, nu voor plaatjes. De
      // vijf FIN_EINDE_*-scènes hebben GEEN token nodig (het zijn al vijf
      // losse scènes, dus gewoon vijf losse letterlijke IMAGE:-bestanden).
      case "fin_epiloog_lethe_image": return SP_FIN_EPILOOG_LETHE_IMAGE[state.flags?.fin_tendency] || SP_FIN_EPILOOG_IMAGE_FALLBACK;
      case "fin_epiloog_troje_image":    return SP_FIN_EPILOOG_TROJE_IMAGE[state.flags?.ch9_zijde] || SP_FIN_EPILOOG_IMAGE_FALLBACK;
      case "fin_epiloog_achilles_image": return SP_FIN_EPILOOG_ACHILLES_IMAGE[state.flags?.ch8_zijde] || SP_FIN_EPILOOG_IMAGE_FALLBACK;
      case "fin_epiloog_taalspoor_image": return SP_FIN_EPILOOG_TAALSPOOR_IMAGE[state.flags?.taalspoor] || SP_FIN_EPILOOG_IMAGE_FALLBACK;
      case "fin_epiloog_ch1_lijn_image":  return SP_FIN_EPILOOG_CH1_LIJN_IMAGE[state.flags?.ch1_lijn] || SP_FIN_EPILOOG_IMAGE_FALLBACK;
      case "fin_epiloog_griekse_politiek_image": {
        const key = (state.flags?.ch19_gre_zijde||"x")+"_"+(state.flags?.ch22_gre_zijde||"x");
        return SP_FIN_EPILOOG_GRIEKSE_POLITIEK_IMAGE[key] || SP_FIN_EPILOOG_IMAGE_FALLBACK;
      }
      case "fin_epiloog_romeinse_politiek_image": {
        const key = (state.flags?.ch19_lat_zijde||"x")+"_"+(state.flags?.ch22_lat_zijde||"x");
        return SP_FIN_EPILOOG_ROMEINSE_POLITIEK_IMAGE[key] || SP_FIN_EPILOOG_IMAGE_FALLBACK;
      }
    }
    if(SP_TENDENCY_STORY_VARIANTS[path]) return spTendencyStoryVariant(path, state);
    return undefined;
  },
};
// Nederlandse opsomming: "A", "A en B", "A, B en C" — gedeeld door beide takken van
// spBondgenotenAanwezig hieronder.
function spDutchJoin(names){
  return names.length>1 ? names.slice(0,-1).join(", ")+" en "+names[names.length-1] : names[0];
}
// Bondgenoten als eindkapitaal (Chronica-audit B18, CH9_BONDGENOTEN): SP_STATE.relations
// krijgt hier voor het eerst een ZICHTBAAR gevolg i.p.v. alleen een tekst-variant. Beide
// kanten volgen hetzelfde spiegelbeeld (zie de audit-toelichting bij SP_ENDKAPITAAL_ALLIES,
// singleplayer-data.js): een positieve band ontziet/steunt, een negatieve band valt AAN —
// aan Trojaanse kant een vijandige Griek in de open strijd, aan Griekse kant een
// verbitterde EIGEN bondgenoot die de chaos van de plundering gebruikt om je in de rug te
// steken. Die dreiging wordt altijd opgelost (een positieve band elders, anders een god)
// — dit blijft puur tekstueel, nooit een echte game-over. Zie ook B28 (nog niet gebouwd)
// voor een functioneel vervolg hierop.
function spBondgenotenAanwezig(state){
  const zijde = state.flags?.ch9_zijde;
  const pool = SP_ENDKAPITAAL_ALLIES[zijde] || [];
  const rel = state.relations || {};
  const T = SP_ENDKAPITAAL_THRESHOLD;
  if(zijde!=="troje" && zijde!=="grieks") return SP_ENDKAPITAAL_FALLBACK;
  const positive = pool.filter(a => (rel[a.id]||0) >= T);
  const hostile = pool.filter(a => (rel[a.id]||0) <= -T);
  const parts = positive.map(a=>a.line);
  if(zijde==="troje"){
    const helpers = SP_ENDKAPITAAL_TROJE_HELPERS.filter(h => (rel[h.id]||0) >= SP_ENDKAPITAAL_HELPER_THRESHOLD);
    if(!hostile.length){
      parts.push(...helpers.map(h=>h.quiet));
      return parts.length ? parts.join(" ") : SP_ENDKAPITAAL_FALLBACK;
    }
  }
  if(hostile.length){
    const names = spDutchJoin(hostile.map(a => SP_CODEX_PERSONS[a.id]?.nm || a.id));
    if(zijde==="troje"){
      parts.push(names + (hostile.length>1
        ? ", geen van hen vergeten hoe de verstandhouding ooit verzuurde, herkennen je tussen het puin — en aarzelen geen moment."
        : ", die niet vergeten is hoe de verstandhouding tussen jullie ooit verzuurde, herkent je tussen het puin — en aarzelt geen moment."));
      const helpers = SP_ENDKAPITAAL_TROJE_HELPERS.filter(h => (rel[h.id]||0) >= SP_ENDKAPITAAL_HELPER_THRESHOLD);
      if(helpers.length) parts.push(...helpers.map(h=>h.redt));
      else parts.push(SP_ENDKAPITAAL_AFRODITE_REDDING);
    } else {
      parts.push(names + (hostile.length>1
        ? ", geen van beiden de wrok ooit kwijtgeraakt, gebruiken de chaos van de plundering voor iets dat niets met de vijand te maken heeft — wapens al getrokken voor je het doorhebt."
        : ", die de wrok nooit is kwijtgeraakt, gebruikt de chaos van de plundering voor iets dat niets met de vijand te maken heeft — het wapen al getrokken voor je het doorhebt."));
      if(positive.length){
        const redder = SP_CODEX_PERSONS[positive[0].id]?.nm || positive[0].id;
        parts.push(`Maar ${redder} grijpt net op tijd in — slaat de aanval af, komt tussen jou en het staal te staan, zonder aarzelen.`);
      } else {
        parts.push(SP_ENDKAPITAAL_ATHENA_REDDING);
      }
    }
  }
  return parts.length ? parts.join(" ") : SP_ENDKAPITAAL_FALLBACK;
}
// B27 (Chronica-audit, fase 9 §6): geeft de afsluitmomenten terug waar de
// speler op dit punt recht op heeft, op basis van SP_NPC_AFSLUITINGEN
// (singleplayer-data.js) en de opgebouwde relatiescores. Aangeroepen via
// {npc_afsluitingen} (SpTextResolver) in CH17_GRE_000C, zie de toelichting
// bij SP_NPC_AFSLUITINGEN voor de geschiedenis van dit mechanisme.
function spNpcAfsluitingenBeschikbaar(state){
  const rel = state.relations || {};
  return Object.entries(SP_NPC_AFSLUITINGEN)
    .filter(([id, def]) => (rel[id]||0) >= def.drempel)
    .map(([id, def]) => ({ id, nm: SP_CODEX_PERSONS[id]?.nm || id, tekst: def.tekst }));
}
// B28 (Chronica-audit, fase 9 §4): bepaalt de uitkomst wanneer de speler een
// bondgenoot (gekozenNpcId) voor een taak aanwijst. `taak` heeft de vorm
// { idealeCandidates:[npc_id,...], relatieDrempel, succesTekst,
// zwakkeBandTekst, verkeerdeKeuzeTekst } — zie de toelichting bij
// SP_NPC_AFSLUITINGEN (singleplayer-data.js). Nog geen enkele `taak`
// geschreven en nergens aangeroepen: de audit noemt dit zelf "te vroeg voor
// dit spel, nog niet ervoor" zolang er geen brede, onderscheiden
// bondgenotencast bestaat (die pas na de Odyssee/Aeneis-hoofdstukken
// opgebouwd is). Puur het generieke mechanisme, klaar voor zodra dat wel zo is.
function spRolverdelingUitkomst(taak, gekozenNpcId, state){
  const juisteKeuze = taak.idealeCandidates.includes(gekozenNpcId);
  const band = (state.relations||{})[gekozenNpcId] || 0;
  if(!juisteKeuze) return { geslaagd:false, tekst:taak.verkeerdeKeuzeTekst };
  const geslaagd = band >= (taak.relatieDrempel||0);
  return { geslaagd, tekst: geslaagd ? taak.succesTekst : taak.zwakkeBandTekst };
}
// Zelfde principe als spTendencyAddressPhrase, maar voor een volledige
// verhaalzin i.p.v. een los bijvoeglijk naamwoord — zie
// SP_TENDENCY_STORY_VARIANTS (singleplayer-data.js) voor de vier momenten
// die dit gebruiken en de audit-toelichting (B13) daarboven.
function spTendencyStoryVariant(id, state){
  const table = SP_TENDENCY_STORY_VARIANTS[id];
  const tendency = spApproachTendency(state);
  return table[tendency] || table.neutraal;
}
// Voor de zelfherkenningsscène in Hoofdstuk 9 (CH9): welk wapen draagt de
// speler zelf, op basis van de klasse gekozen bij het Orakel in de proloog —
// zelfde koppeling als SP_AVATAR_STORY_UNLOCKS ("wapen:boog"->boogschutter_orakel
// etc., singleplayer-data.js), maar dan van classId naar een gewoon
// zelfstandig naamwoord voor in de verteltekst.
const SP_CLASS_WEAPON_NOUN = { boogschutter:"boog", hopliet:"speer", cavalerie:"zwaard" };
// Gender-passend zelfstandig naamwoord voor de Kroniek (Kleio's verteltoon,
// zie spKroniekLog): "held"/"heldin"/"held" — nonbinair krijgt bewust "held"
// terug (zelfde woord als man), want een verzonnen derde vorm zou net zo
// gemarkeerd aanvoelen als het probleem dat het moet oplossen.
const SP_HELD_NOUN = { man:"held", vrouw:"heldin", nonbinair:"held" };
// Korte, verhalende omschrijving per stat (SP_STAT_DEFS.domein hierboven is
// te lang/technisch voor een lopende Kroniek-zin) — gebruikt in
// spStatInvestKroniekText en spKleioStatClause hieronder.
const SP_STAT_VIRTUE = {
  vis:"rauwe spierkracht", agilitas:"behendigheid", robur:"doorzettingsvermogen",
  ingenium:"scherpzinnigheid", prudentia:"mensenkennis", gratia:"overredingskracht",
};
// Kroniek-tekst voor de klassekeuze bij het Orakel van Chronos (PRO_003/
// PRO_004A-C, singleplayer-data.js) — met de twee NIET gekozen wapens
// erbij, want dat is precies wat deze eenmalige, onomkeerbare keuze
// betekenisvol maakt (Gerben, 2026-08-18: "de andere twee verhalen
// achterliet"-principe, hier toegepast op wapens i.p.v. hoofdstuklijnen).
const SP_KRONIEK_KLASSE = {
  boogschutter:"Bij het Orakel van Chronos opende {subject} de oude kist en koos de jachtboog — het hout lag warm en vertrouwd in {possessive} greep, alsof {possessive} vingers de vorm al kenden voor {subject} hem ooit zag. Vanaf die dag droeg {subject} geduld en een feilloos oog met zich mee, en zou {subject} nooit meer weten hoe het koude brons van de speer of het gewicht van de ruitersporen had aangevoeld.",
  hopliet:"Bij het Orakel van Chronos opende {subject} de oude kist en greep naar de speer — het koude brons gaf {possessive_cap} een vreemde kalmte, alsof de grond onder {possessive} voeten steviger werd. Vanaf die dag droeg {subject} standvastigheid met zich mee, en zou {subject} nooit meer weten hoe de gespannen pees van de boog of het gewicht van de ruitersporen had aangevoeld.",
  cavalerie:"Bij het Orakel van Chronos opende {subject} de oude kist en tilde de ruitersporen op — lichter dan verwacht, alsof ze meteen prijsgaven waarvoor ze gemaakt waren. Vanaf die dag droeg {subject} snelheid en overzicht met zich mee, en koos {subject} ervoor voortaan als Cavalerist door het leven te gaan, terwijl de pees van de boog en het brons van de speer voorgoed onaangeroerd in de aarde bleven.",
};
// Kiest een willekeurige, gender-passende aanspreekvorm bij de opgebouwde
// Clementia/Severitas-houding (spApproachTendency) — zie SP_TENDENCY_PHRASES
// (singleplayer-data.js). Vanaf Hoofdstuk 3 gebruikt in NPC-DIALOGUE/TEXT via
// {tendency_address}/{tendency_address_cap}.
function spTendencyAddressPhrase(state){
  const tendency = spApproachTendency(state);
  const poss = (SP_PRONOUNS[state.gender] || SP_PRONOUNS.man).poss;
  return pick(SP_TENDENCY_PHRASES[tendency]).replace("%POSS%", poss);
}

/* ---- CNS PARSER — zet ruwe .cns-tekst om in een Map<sceneId, sceneObject> ---- */
const CNSParser = {
  KNOWN_SECTIONS:["TITLE","TEXT","DIALOGUE","CHOICES","IMAGE","MUSIC","SFX",
                  "CODEX","QUEST","COMBAT","REWARD","INVENTORY","PUZZLE","EERETITEL","FLAG",
                  "PERSON","VOCAB","FRAGMENT","SOUVENIR","STATPOINTS","RELATION","REACTION","CHECK","RACE"],
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
  // Optioneel: een keuzeregel mag ook eindigen op [REQUIRE:sleutel=waarde] of
  // [REQUIRE:sleutel!=waarde] — verbergt die keuze tenzij aan de voorwaarde is
  // voldaan (zie spChoiceVisible in singleplayer.js). "fragments" gebruikt een
  // getal (Hoofdstuk 2: pas naar het Orakel zodra alle 4 Herinneringsfragmenten
  // binnen zijn); "taalspoor" (Hoofdstuk 10, B24) gebruikt een woord
  // ("latijn"/"grieks"/"beide") — generiek genoeg voor latere vergelijkbare
  // gates. Numerieke waarden worden als getal doorgegeven, woorden als
  // kleine-letters-string.
  REQUIRE_TAG_RE: /\s*\[REQUIRE:(\w+)(!?=)(\w+)\]\s*$/i,
  // Optioneel: een keuzeregel mag ook eindigen op [DONE:vlagnaam] — markeert
  // een keuze als "hoort bij een lijn die je kunt afronden" (zie
  // spChoiceVisible/spChoosePath in singleplayer.js). Zodra SP_STATE.flags
  // die vlag al op true heeft staan, toont spPlay de knop met een ✓ en
  // navigeert een klik niet meer naar de lijn zelf (die zou anders opnieuw
  // beginnen — het gat dat vóór 2026-07 onbeperkt herhalen van bv. Latona's
  // lijn toeliet, met bijbehorende Clementia/Severitas-punten). Gebruikt
  // dezelfde vlaggen die elke lijn toch al zet bij afronding (bv.
  // "ch2_lijn_latona"), dus geen nieuwe databron nodig.
  DONE_TAG_RE: /\s*\[DONE:(\w+)\]\s*$/i,
  // Optioneel: een keuzeregel mag ook eindigen op [STAT:sleutel:getal] — de
  // "gated choice" uit Chronica.md §11.4/Deel 4.1a. In tegenstelling tot
  // [REQUIRE:...] wordt deze keuze NOOIT verborgen: spPlay toont hem altijd,
  // grijs en met de eis erbij ("Vis 14 — jij hebt 11") zodra
  // SP_STATE.stats[sleutel] eronder zit, en pas klikbaar/goud zodra de
  // speler eraan voldoet. Dat zichtbaar-maar-vergrendeld-zijn IS het
  // ontwerpprincipe (§4.2 van de spec: "de wereld is groter dan mijn
  // personage"), dus bewust een aparte tag i.p.v. REQUIRE_TAG_RE hergebruikt.
  STAT_TAG_RE: /\s*\[STAT:(\w+):(\d+)\]\s*$/i,
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
      let approach = null, require = null, done = null, statReq = null;
      const reqM = label.match(this.REQUIRE_TAG_RE);
      if(reqM){
        const rawVal = reqM[3];
        require = { key:reqM[1].toLowerCase(), op:reqM[2]==="!=" ? "!=" : "=", value: isNaN(+rawVal) ? rawVal.toLowerCase() : +rawVal };
        label = label.slice(0,reqM.index).trim();
      }
      const doneM = label.match(this.DONE_TAG_RE);
      if(doneM){ done = doneM[1]; label = label.slice(0,doneM.index).trim(); }
      const statM = label.match(this.STAT_TAG_RE);
      if(statM){ statReq = { key:statM[1].toLowerCase(), value:+statM[2] }; label = label.slice(0,statM.index).trim(); }
      const tagM = label.match(this.APPROACH_TAG_RE);
      if(tagM){ approach = tagM[1].toUpperCase(); label = label.slice(0,tagM.index).trim(); }
      choices.push({ label, target, approach, require, done, statReq });
    }
    return choices;
  },
};

const SP_SCENES = new Map([...CNSParser.parse(SP_PROLOOG_CNS), ...CNSParser.parse(SP_CH1_CNS), ...CNSParser.parse(SP_CH2_CNS), ...CNSParser.parse(SP_CH3_CNS), ...CNSParser.parse(SP_CH4_CNS), ...CNSParser.parse(SP_CH5_CNS), ...CNSParser.parse(SP_CH6_CNS), ...CNSParser.parse(SP_CH7_CNS), ...CNSParser.parse(SP_CH8_CNS), ...CNSParser.parse(SP_CH9_CNS), ...CNSParser.parse(SP_CH10_CNS), ...CNSParser.parse(SP_CH11_CNS), ...CNSParser.parse(SP_CH12_CNS), ...CNSParser.parse(SP_CH13_CNS), ...CNSParser.parse(SP_CH14_CNS), ...CNSParser.parse(SP_CH15_CNS), ...CNSParser.parse(SP_CH16_CNS), ...CNSParser.parse(SP_CH17_CNS), ...CNSParser.parse(SP_CH18_CNS), ...CNSParser.parse(SP_CH19_CNS), ...CNSParser.parse(SP_CH20_CNS), ...CNSParser.parse(SP_CH21_CNS), ...CNSParser.parse(SP_CH22_CNS), ...CNSParser.parse(SP_CH23_CNS), ...CNSParser.parse(SP_CH24_CNS), ...CNSParser.parse(SP_CH25_CNS), ...CNSParser.parse(SP_CH26_CNS), ...CNSParser.parse(SP_CH27_CNS), ...CNSParser.parse(SP_CH28_CNS), ...CNSParser.parse(SP_CH29_CNS), ...CNSParser.parse(SP_FINALE_CNS)]);
const SP_EMPTY_STATE = ()=>({ node:null, gender:null, classId:null, traits:[], codex:[], quests:{}, flags:{}, approach:{clementia:0,severitas:0}, persons:{}, vocab:[], seenImages:[], fragments:[], souvenirs:[],
  stats:null, skillpoints:0, statSpentSinceAward:{}, statLog:[],
  payoffsSeen:{}, relations:{}, kroniek:[],
  // mastery: Leitner-boxen per vraag (masteryKey → 0-5, zie combat-questions.js).
  // Dit is LEERdata en hoort dus wél in de save, in tegenstelling tot SP_COMBAT
  // zelf. inventory: eenmalige gevechtsitems die je in het verhaal vond
  // (INVENTORY:-sectie → spHookInventory).
  // patches: welke savemigratie-patches al op deze save zijn toegepast
  // (id → timestamp), zie SP_PATCHES/spApplyPatches.
  mastery:{}, inventory:[], patches:{} });

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
// Hoofdstuknummer van een slot, als grove maat voor "hoever ben je" —
// PRO_ telt als 0, CH<n>_ als n, een lege/onbegonnen slot als -1.
function spSlotProgressDepth(slot){
  if(!slot || !slot.node) return -1;
  if(slot.node.indexOf("PRO_")===0) return 0;
  // FIN_ (de Finale) is de VERSTE voortgang die er is; als 0 tellen zou een
  // uitgespeelde save laten verliezen van een net begonnen save op een ander
  // toestel (zie de botsingsregel in spLoadAllSlots hieronder).
  if(slot.node.indexOf("FIN_")===0) return 99;
  const m = slot.node.match(/^CH(\d+)_/);
  return m ? +m[1] : 0;
}
/* ---- SAVEMIGRATIE: verbeteringen doorduwen naar LOPENDE saves ---------------
   Het meeste van Chronica zit NIET in de save: scènetekst, titels, keuzes,
   glossen, beelden, combat-vragen, CHECK/PUZZLE-mechaniek en grammaticatabellen
   worden bij elke pagina-load opnieuw uit singleplayer-data.js geparsed. Die
   verbeteringen bereiken een lopende save dus vanzelf — mits de ?v=-cachebuster
   in index.html is opgehoogd, anders serveert de browser gewoon de oude JS.

   Wat NIET vanzelf meekomt is alles wat éénmalig in SP_STATE is vastgelegd op
   het moment dat de speler de scène passeerde: vocab, codex, flags, relations,
   persons, quests, souvenirs, fragments, inventory, stats. Voeg je zoiets
   achteraf toe aan een al gebouwd hoofdstuk, dan mist elke testspeler die daar
   al voorbij is het — stilletjes, zonder foutmelding, en bij een FLAG die pas
   twintig hoofdstukken later wordt uitgelezen valt de payoff geruisloos weg.

   Deze laag draait bij elk "verdergaan" (spResumeSlot) en repareert dat in drie
   stappen:
     1. spRepairNode    — hernoemde of verdwenen scène-id's opvangen.
     2. spBackfillVocab — automatisch en onderhoudsvrij: woorden uit eerdere
                          hoofdstukken alsnog toekennen.
     3. spApplyPatches  — handmatige lijst voor wat je niet kunt afleiden.
   Alles is idempotent: twee keer draaien verandert niets extra's. ---------- */

const SP_LAST_CHAPTER = 29; // hoogste CH<n>_000 in singleplayer-data.js

// Hernoem je een scène-id, zet dan hier oud → nieuw, zodat een save die precies
// op die scène stond niet strandt. Deze tabel nooit opruimen: elke oude save
// mag erop blijven leunen.
const SP_SAVE_ALIASES = {
  // "CH1_OUDE_NAAM": "CH1_NIEUWE_NAAM",
};

// Per hoofdstuk de "spil-scène": de scène met de VOCAB:-sectie die IEDEREEN
// passeert, ongeacht taalspoor of route. Standaard is dat CH<n>_000 (de
// hoofdstukopening); deze tabel bevat alleen de uitzonderingen — hoofdstukken
// die hun woordenlijst elders op de verplichte route hebben staan.
// Route-specifieke VOCAB:-secties (de losse woorden diep in een Griekse of
// Latijnse lijn) staan hier bewust NIET in: die horen bij een route die deze
// speler misschien niet genomen heeft.
const SP_VOCAB_SPIL = {
  1:"CH1_ROBE", 2:"CH2_ORAKEL", 3:"CH3_ORAKEL", 4:"CH4_ORAKEL",
  9:"CH9_005", 11:"CH11_001",
};
function spVocabSpilScene(n){ return SP_VOCAB_SPIL[n] || ("CH"+n+"_000"); }

/* Vangnet voor scène-id's die niet meer bestaan. Zet de speler terug bij het
   BEGIN VAN HET HOOFDSTUK waar hij was — niet bij de allereerste scène van het
   spel, zoals hier tot 2026-08-18 gebeurde: voor een tester in Hoofdstuk 20 is
   dat een reis van twintig hoofdstukken kwijt. */
function spRepairNode(state){
  if(!state.node) return null;
  const alias = SP_SAVE_ALIASES[state.node];
  if(alias && SP_SCENES.has(alias)){ state.node = alias; return null; }
  if(SP_SCENES.has(state.node)) return null;
  const d = spSlotProgressDepth(state);
  let target;
  if(d>=1 && d<=SP_LAST_CHAPTER && SP_SCENES.has("CH"+d+"_000")) target = "CH"+d+"_000";
  else if(d>SP_LAST_CHAPTER && SP_SCENES.has("FIN_000")) target = "FIN_000";
  else target = [...SP_SCENES.keys()][0];
  state.node = target;
  return "Deze scène bestaat niet meer in de huidige versie van het verhaal — je bent teruggezet naar het begin van dit hoofdstuk.";
}

/* Woorden uit eerdere hoofdstukken alsnog toekennen. Dit heeft GEEN
   onderhoudslijst nodig: het leest de VOCAB:-secties gewoon opnieuw uit de
   spildata. Voeg je later signaalwoorden toe aan een vroeg hoofdstuk (zoals de
   270 uit VOCAB_UITBREIDING.md), dan krijgt elke lopende save ze bij de
   volgende keer verdergaan — en wordt de Combat-woordpoel dus meteen minder
   repetitief, precies waarvoor die uitbreiding bedoeld was.
   Alleen hoofdstukken STRIKT VÓÓR het huidige: het hoofdstuk waar de speler nu
   in zit doet zijn eigen VOCAB:-hook nog gewoon zelf, en anders zou hij woorden
   krijgen uit een scène die hij nog moet lezen. */
function spBackfillVocab(state, depth){
  const have = new Set(state.vocab||[]);
  const fresh = [];
  const tot = Math.min(depth, SP_LAST_CHAPTER+1);
  for(let n=1;n<tot;n++){
    const scene = SP_SCENES.get(spVocabSpilScene(n));
    if(!scene || !scene.meta.VOCAB) continue;
    for(const id of scene.meta.VOCAB.split(/[\n,;]/).map(s=>s.trim()).filter(Boolean)){
      // Alleen woorden die echt in SP_VOCAB_ENTRIES staan — een typefout in de
      // data mag geen spookwoord in iemands Codex en Combat-poel duwen.
      if(have.has(id) || !SP_VOCAB_ENTRIES[id]) continue;
      have.add(id); fresh.push(id);
    }
  }
  if(!fresh.length) return 0;
  state.vocab = [...(state.vocab||[]), ...fresh];
  return fresh.length;
}

/* ---- PATCHLIJST voor wat je NIET kunt afleiden -----------------------------
   Bedoeld voor route-afhankelijke dingen: een FLAG die je achteraf in een al
   gebouwd hoofdstuk hebt gezet, een codexpagina die nu eerder wordt uitgedeeld,
   een quest die van naam veranderde. De automatische laag hierboven kan dat
   niet raden — jij beslist wat de save had moeten hebben.

   Elke patch:
     id            unieke, nooit hergebruikte sleutel; onthouden in state.patches
     vanaf         hoofdstuknummer; is de speler daar nog niet voorbij, dan
                   gebeurt er niets en zet de gewone scène-hook het straks zelf
     omschrijving  voor jou, niet voor de speler
     melding       optioneel; wordt de speler getoond op het landingsscherm
     apply(state)  past state aan; MOET idempotent zijn (schrijf "zet als hij
                   ontbreekt", nooit "tel er eentje bij op"); return false om te
                   melden dat er niets te doen viel

   ONDERHOUDSAFSPRAAK (Chronica.md §7.81): voeg je achteraf een FLAG, CODEX,
   QUEST of RELATION toe aan een hoofdstuk dat al gebouwd én gekoppeld is,
   schrijf dan in dezelfde commit een patch-entry. Anders loopt deze lijst net zo
   achter als het probleem dat hij oplost.

   Voorbeeld (zoals je het zou schrijven voor een nieuwe vlag in Hoofdstuk 5):

     { id:"h5-orakel-vlag", vanaf:6,
       omschrijving:"FLAG:orakel_gehoord achteraf toegevoegd aan CH5_012; H22 leest hem uit.",
       melding:null,
       apply(state){
         if(state.flags.orakel_gehoord) return false;
         state.flags = {...state.flags, orakel_gehoord:true};
       } },

   Bewust NIET gepatcht (2026-08-18): de RELATION-symmetrie die commit 395c4a5
   toevoegde aan CH5_020_NEGEER, CH6_020_*, CH8_ACH/AGA_* en CH10_ODY_*. Die
   deltas hangen af van WELKE kant de speler koos, en dat staat nergens in de
   save; een gok zou de Finale — die de RELATION-standen uitleest — met verzonnen
   data voeden. Oude saves houden daar dus een iets vlakker relatiebeeld dan
   nieuwe. De grammatica-codex uit commit 8196449 heeft geen patch nodig: die
   pagina's werden alleen vroeger in het hoofdstuk uitgedeeld, de bestaande hook
   verderop kende ze al toe. */
const SP_PATCHES = [
];

function spApplyPatches(state, depth){
  const done = {...(state.patches||{})};
  const notes = [];
  let touched = false;
  for(const p of SP_PATCHES){
    if(done[p.id]) continue;
    if(depth < p.vanaf) continue; // nog niet gepasseerd — de scène-hook doet het straks zelf
    let result;
    try{ result = p.apply(state); }
    catch(e){ console.error("spApplyPatches: patch '"+p.id+"' faalde:", e); continue; }
    done[p.id] = Date.now();
    touched = true;
    if(result !== false && p.melding) notes.push(p.melding);
  }
  if(touched) state.patches = done;
  return { notes, touched };
}

// Een NIEUWE save begint met alle nu bekende patches al afgevinkt: die save
// speelt de betreffende hoofdstukken straks met de nieuwe inhoud erin, dus er
// valt niets in te halen. Alleen patches die je LATER schrijft gelden voor hem.
function spPatchesAllDone(){
  const done = {};
  const nu = Date.now();
  for(const p of SP_PATCHES) done[p.id] = nu;
  return done;
}

// Meldingen voor het eerstvolgende landingsscherm; daar eenmalig getoond en
// meteen geleegd (spRenderLanding).
let SP_MIGRATION_NOTES = [];

function spMigrateSave(state){
  const notes = [];
  let changed = false;
  const nodeNote = spRepairNode(state);
  if(nodeNote){ notes.push(nodeNote); changed = true; }
  const depth = spSlotProgressDepth(state);
  const words = spBackfillVocab(state, depth);
  if(words){
    changed = true;
    notes.push(words===1
      ? "Er is 1 nieuw woord toegevoegd aan je Codex: het zat nog niet in het spel toen jij daar langskwam."
      : "Er zijn "+words+" nieuwe woorden toegevoegd aan je Codex: die zaten nog niet in het spel toen jij daar langskwam.");
  }
  const patched = spApplyPatches(state, depth);
  if(patched.touched) changed = true;
  notes.push(...patched.notes);
  return { changed, notes };
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
  // Leerlingfeedback (2026-08-18): puur op updatedAt samenvoegen is
  // gevaarlijk zodra twee toestellen nooit hebben kunnen synchroniseren
  // voor ze allebei zijn gaan spelen — een net-begonnen save op toestel B
  // heeft altijd de nieuwste timestamp, en zou dan een veel verder
  // gevorderde save op toestel A stilletjes overschrijven (en, via de
  // lokale-cache-update hieronder, zelfs wissen). Bij een botsing wint
  // daarom eerst de VERSTE voortgang (hoofdstuknummer); pas bij gelijke
  // voortgang beslist de recentste updatedAt.
  const merged = {};
  const healRemote = {}; // slots waar local won over een minder ver/oudere remote — Firebase bijwerken
  for(let n=1;n<=SP_MAX_SLOTS;n++){
    const l=local[n], r=remote[n];
    let winner;
    if(!l) winner = r||null;
    else if(!r) winner = l;
    else{
      const dl = spSlotProgressDepth(l), dr = spSlotProgressDepth(r);
      winner = dl!==dr ? (dl>dr ? l : r) : ((r.updatedAt||0)>(l.updatedAt||0) ? r : l);
    }
    merged[n] = winner;
    if(winner===l && r && l!==r) healRemote[n] = l;
  }
  spSlotsSaveLocal(merged); // lokale cache bijwerken met eventuele nieuwere/verdere data
  if(BM_IDENT && fbDB && Object.keys(healRemote).length){
    // Best-effort: Firebase bijwerken zodat een volgend toestel niet opnieuw
    // tegen dezelfde verouderde/ondiepere remote-versie aanloopt.
    Object.entries(healRemote).forEach(([n,slot])=>
      fbDB.ref(spSlotsPath()+"/"+n).set(slot).catch(()=>{}));
  }
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
  SP_STATE.patches = spPatchesAllDone();
  spRenderGenderPick();
}
async function spResumeSlot(n){
  SP_ACTIVE_SLOT = n;
  const slots = await spLoadAllSlots();
  SP_STATE = Object.assign(SP_EMPTY_STATE(), slots[n]||{});
  // Savemigratie: duwt verbeteringen die sinds het laatste spelen zijn
  // toegevoegd alsnog in deze save (dode nodes, vocab-backfill, patchlijst).
  // Zie spMigrateSave hierboven; vervangt het oude, botte vangnet dat een
  // dode node terugzette naar de allereerste scène van het spel.
  const migratie = spMigrateSave(SP_STATE);
  SP_MIGRATION_NOTES = migratie.notes;
  if(migratie.changed) await spSaveProgress({});
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
  // Savemigratie-meldingen (spMigrateSave): eenmalig tonen en meteen legen, ook
  // als de speler later terugkeert naar dit scherm binnen dezelfde sessie.
  const migratieHTML = SP_MIGRATION_NOTES.length ? `
  <div class="panel">
    <div class="eyebrow l">Je verhaal is bijgewerkt</div>
    ${SP_MIGRATION_NOTES.map(n=>`<p class="note" style="margin-top:6px">${esc(n)}</p>`).join("")}
  </div>` : "";
  SP_MIGRATION_NOTES = [];
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
  ${migratieHTML}
  ${resuming?`<button class="btn btn-ghost btn-block" style="margin-bottom:8px" onclick="go('spWorldMap')">🗺️ Wereldkaart</button>`:""}
  ${resuming?`<button class="btn btn-ghost btn-block" style="margin-bottom:8px" onclick="go('spCityMaps')">🏛️ Stadsplattegronden</button>`:""}
  ${resuming?`<button class="btn btn-ghost btn-block" style="margin-bottom:8px" onclick="go('spCodex')">📖 Codex Memoriae</button>`:""}
  ${resuming&&SP_STATE.stats?`<button class="btn btn-ghost btn-block" style="margin-bottom:14px" onclick="go('spStats')">📊 Karakter Informatie${SP_STATE.skillpoints?` (${SP_STATE.skillpoints})`:""}</button>`:""}
  ${foot()}`);
}

/* ---- CODEX MEMORIAE: een oud perkamenten boek met zeven tabbladen. Codex is
   PER SAVESLOT, net als de wereldkaart — elke slot toont dus alleen wat DIE
   doorspeling al heeft ontdekt. Niets wordt vooruit getoond (geen
   "??"-placeholder voor wat nog moet komen — dat zou spoilen).
   - Herinneringen/Museum (eerste/standaard-tabblad, hernoemt zichzelf naar
     "Museum" zodra museum_mnemosyne_ontgrendeld gezet is): SP_SOUVENIRS, via
     SOUVENIR: — één tastbaar voorwerp per afgeronde verhaallijn, zie
     spHookSouvenir en Chronica.md §7.2.1. Bewuste UITZONDERING op de
     geen-vooruit-tonen-regel hierboven, en alleen ná die reveal (Gerben,
     2026-08-18): ontbrekende souvenirs krijgen dan een generieke lege/
     gebroken-stolp-placeholder (spSouvenirEmptyTileHTML) i.p.v. helemaal niet
     te verschijnen — dat toont het gemis zonder te verklappen wélk voorwerp
     of welke verhaallijn erbij hoort.
   - Mythologie/Geschiedenis/Grammatica: SP_CODEX_ENTRIES, ontgrendeld via de
     bestaande CODEX:-sectie (spHookCodex). Grammatica-entries mogen een
     `table` hebben (rijtjes/naamvallen), gerenderd als een echte <table>.
   - Personen: SP_CODEX_PERSONS, tweetraps (intro/full) via PERSON:.
   - Vocabulaire: SP_VOCAB_ENTRIES, via VOCAB:.
   - Afbeeldingen: SP_STATE.seenImages, automatisch bijgehouden door
     spHookSeenImage() zodra een scène met een IMAGE: wordt bezocht. ---- */
let SP_CODEX_TAB = "kroniek";
// Twee lagen (Gerbens indeling, 2026-07-25): laag 1 = de "verhaal"-tabbladen
// (Kroniek eerst), laag 2 = de taal-tabbladen (Grammatica/Vocabulaire) —
// bewust twee vaste rijen i.p.v. laten wrappen op breedte, zodat de
// groepering altijd hetzelfde oogt ongeacht schermgrootte.
const SP_CODEX_TABS = [
  { id:"kroniek",       nm:"Kroniek",       icon:"📖", row:1 },
  { id:"herinneringen", nm:"Herinneringen", icon:"🏛️", row:1 },
  { id:"mythologie",    nm:"Mythologie",    icon:"⚡", row:1 },
  { id:"geschiedenis",  nm:"Geschiedenis",  icon:"🏺", row:1 },
  { id:"personen",      nm:"Personen",      icon:"👤", row:1 },
  { id:"afbeeldingen",  nm:"Afbeeldingen",  icon:"🖼️", row:1 },
  { id:"grammatica",    nm:"Grammatica",    icon:"📜", row:2 },
  { id:"vocabulaire",   nm:"Vocabulaire",   icon:"🔤", row:2 },
];
function spSwitchCodexTab(tab){ SP_CODEX_TAB = tab; go("spCodex"); }
// Herinneringen -> Museum: de tabnaam zelf is een reveal (Chronica.md §7.2.1a).
// Zodra museum_mnemosyne_ontgrendeld gezet is (einde Hoofdstuk 6, CH6_MUSEUM_00)
// wisselt alleen het label, id/inhoud blijven "herinneringen"/spCodexSouvenirsHTML.
function spCodexTabLabel(t){
  if(t.id==="herinneringen" && (SP_STATE.flags||{}).museum_mnemosyne_ontgrendeld) return "Museum";
  return t.nm;
}
SCREENS.spCodex = function(){
  document.body.classList.remove("greek");
  if(!SP_ACTIVE_SLOT){ go("spSlots"); return; }
  const tabRowHTML = row => SP_CODEX_TABS.filter(t=>t.row===row).map(t=>
    `<button class="codex-tab${t.id===SP_CODEX_TAB?" on":""}" onclick="spSwitchCodexTab('${t.id}')">${t.icon} ${esc(spCodexTabLabel(t))}</button>`
  ).join("");
  const bodies = {
    kroniek: spCodexKroniekHTML,
    herinneringen: spCodexSouvenirsHTML,
    mythologie: ()=>spCodexEntriesHTML("mythologie", "Nog niets vastgelegd — mythen verschijnen hier zodra je ze beleeft."),
    geschiedenis: ()=>spCodexEntriesHTML("geschiedenis", "Nog niets vastgelegd — Hoofdstuk 1 is nog puur mythologie; historische bladzijden volgen bij latere hoofdstukken."),
    grammatica: spCodexGrammaticaHTML,
    personen: spCodexPersonsHTML,
    vocabulaire: spCodexVocabHTML,
    afbeeldingen: spCodexImagesHTML,
  };
  const body = (bodies[SP_CODEX_TAB]||bodies.mythologie)();
  H(brand(true)+`
  <div class="scrhead"><button class="back" onclick="go('spSlots')">${iconSVG("shield",20,"currentColor")}</button><h2>Codex Memoriae</h2></div>
  <div class="codex-book">
    <div class="codex-tabs">${tabRowHTML(1)}</div>
    <div class="codex-tabs codex-tabs-2">${tabRowHTML(2)}</div>
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
/* ---- GRAMMATICA-TAB: eigen renderer i.p.v. de generieke spCodexEntriesHTML,
   want dit tabblad groeit het snelst (nu al 17 entries over Hoofdstuk 1-4)
   en moet daarom een eigen inhoudsopgave krijgen (Gerben, 2026-07-25) —
   groepeert op hoofdstuk via de bestaande id-conventie
   `codex_grammatica_ch<N>_...`, geen nieuw datamodel nodig. "Alles" blijft
   de standaardweergave; de pillen tonen alleen hoofdstukken die de speler
   al heeft ontgrendeld (geen spoilers van nog niet bereikte hoofdstukken).
   Taalfilter (2026-08-08, Gerbens verzoek): een TWEEDE, onafhankelijke
   pillenrij naast de hoofdstuk-pillen, op het `taal`-veld dat nu op elke
   SP_CODEX_ENTRIES-grammatica-entry staat ("grieks"/"latijn"/"beide" voor
   hoofdstuk-overzichten die allebei de talen samenvatten). Beide filters
   combineren (EN): kies bv. Hoofdstuk 11 + Latijn om alléén de ablativus
   absolutus te zien naast (in plaats van) de genitivus absolutus — of laat
   het hoofdstukfilter op "Alles" en kies "Latijn" om in één keer alle
   Latijnse grammatica van de hele campagne te overzien. "beide"-entries
   (hoofdstuk-overzichten) blijven zichtbaar bij elk taalfilter, want ze
   vatten typisch precies de vergelijking tussen de twee talen samen. */
let SP_CODEX_GRAMMAR_SUB = "all";
let SP_CODEX_GRAMMAR_LANG = "alle";
function spSwitchCodexGrammarSub(sub){ SP_CODEX_GRAMMAR_SUB = sub; go("spCodex"); }
function spSwitchCodexGrammarLang(lang){ SP_CODEX_GRAMMAR_LANG = lang; go("spCodex"); }
function spCodexGrammaticaHTML(){
  const ids = (SP_STATE.codex||[]).filter(id => SP_CODEX_ENTRIES[id]?.cat==="grammatica");
  if(!ids.length) return `<p class="codex-empty">Nog niets vastgelegd — grammatica verschijnt hier zodra een hoofdstuk erom vraagt.</p>`;
  const chapters = [...new Set(ids.map(id => (id.match(/^codex_grammatica_ch(\d+)_/)||[])[1]).filter(Boolean))]
    .sort((a,b)=>+a-+b);
  const sub = (SP_CODEX_GRAMMAR_SUB==="all" || chapters.includes(SP_CODEX_GRAMMAR_SUB)) ? SP_CODEX_GRAMMAR_SUB : "all";
  const lang = SP_CODEX_GRAMMAR_LANG;
  const tocHTML = chapters.length>1 ? `<div class="codex-grammar-toc">
    <button class="${sub==="all"?"on":""}" onclick="spSwitchCodexGrammarSub('all')">Alles</button>
    ${chapters.map(c=>`<button class="${sub===c?"on":""}" onclick="spSwitchCodexGrammarSub('${c}')">Hoofdstuk ${c}</button>`).join("")}
  </div>` : "";
  const langTocHTML = `<div class="codex-grammar-toc">
    <button class="${lang==="alle"?"on":""}" onclick="spSwitchCodexGrammarLang('alle')">Alle talen</button>
    <button class="${lang==="grieks"?"on":""}" onclick="spSwitchCodexGrammarLang('grieks')">🔷 Grieks</button>
    <button class="${lang==="latijn"?"on":""}" onclick="spSwitchCodexGrammarLang('latijn')">🔶 Latijn</button>
  </div>`;
  let shownIds = sub==="all" ? ids : ids.filter(id=>id.startsWith(`codex_grammatica_ch${sub}_`));
  if(lang!=="alle") shownIds = shownIds.filter(id=>{ const t=SP_CODEX_ENTRIES[id].taal; return t===lang || t==="beide"; });
  // Inhoudsopgave (2026-08-08, Gerbens verzoek): springt met scrollIntoView
  // naar de bijbehorende entry i.p.v. een href="#"-anker — .codex-page zelf
  // heeft overflow:hidden, de echte scroll zit op een voorouder-element, en
  // scrollIntoView vindt die vanzelf zonder aannames over welke dat is. Volgt
  // exact het huidige filter (hoofdstuk + taal), groeit dus vanzelf mee
  // zodra een nieuw hoofdstuk grammatica ontgrendelt.
  const anchorId = id => `gram-${id}`;
  const indexHTML = shownIds.length>1 ? `<nav class="codex-index">
    ${shownIds.map(id=>{
      const e = SP_CODEX_ENTRIES[id];
      const ch = (id.match(/^codex_grammatica_ch(\d+)_/)||[])[1];
      const badge = e.taal==="beide" ? "" : (e.taal==="grieks"?" 🔷":" 🔶");
      return `<a onclick="document.getElementById('${anchorId(id)}')?.scrollIntoView({behavior:'smooth',block:'start'})">${ch?`H${ch} · `:""}${esc(e.titel.replace(/^Grammatica:\s*/,""))}${badge}</a>`;
    }).join("")}
  </nav>` : "";
  const entriesHTML = shownIds.length ? shownIds.map(id=>{
    const e = SP_CODEX_ENTRIES[id];
    const badge = e.taal==="beide" ? "" : ` <span class="codex-lang-badge">${e.taal==="grieks"?"🔷 GR":"🔶 LA"}</span>`;
    return `<div class="codex-entry" id="${anchorId(id)}">
      <h4>${esc(e.titel)}${badge}</h4>
      <p>${esc(e.tekst)}</p>
      ${e.table?spCodexTableHTML(e.table):""}
    </div>`;
  }).join("") : `<p class="codex-empty">Geen ${esc(lang)} grammatica in dit filter.</p>`;
  return tocHTML + langTocHTML + indexHTML + entriesHTML;
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
/* ---- VOCABULAIRE-TAB: taalfilter + alfabetische sortering (2026-08-08,
   Gerbens verzoek) — sinds de vocab-uitbreiding (§7.56, 421 woorden) is een
   ongesorteerde, altijd-alles-tonende lijst niet meer te overzien. Sortering
   op `woord` (localeCompare, verdraagt Griekse/diakritische tekens correct);
   sub-tabs "Alle talen"/"Grieks"/"Latijn" hergebruiken exact hetzelfde
   `.codex-grammar-toc`-patroon als de grammatica-tab hierboven. ---- */
let SP_CODEX_VOCAB_LANG = "alle";
function spSwitchCodexVocabLang(lang){ SP_CODEX_VOCAB_LANG = lang; go("spCodex"); }
function spCodexVocabHTML(){
  const vocab = SP_STATE.vocab||[];
  if(!vocab.length) return `<p class="codex-empty">Nog geen woorden geleerd — ze verschijnen hier zodra je een hoofdstuk voltooit.</p>`;
  const lang = SP_CODEX_VOCAB_LANG;
  const sortWords = ids => ids.map(id=>SP_VOCAB_ENTRIES[id]).filter(Boolean)
    .sort((a,b)=>a.woord.localeCompare(b.woord, "nl"));
  const grieks = sortWords(vocab.filter(id=>SP_VOCAB_ENTRIES[id]?.taal==="grieks"));
  const latijn = sortWords(vocab.filter(id=>SP_VOCAB_ENTRIES[id]?.taal==="latijn"));
  // Alfabet-sprongbalk (2026-08-08): één anker per EERSTE woord van een
  // nieuwe letter binnen een taalblok (niet elke rij — dat zou honderden
  // overbodige id's geven). scrollIntoView i.p.v. href="#", zelfde reden
  // als de grammatica-inhoudsopgave hierboven.
  // Diakritische tekens (accenten, ademhalingstekens) genormaliseerd weg —
  // anders levert het Grieks tientallen bijna-identieke letterknoppen op
  // (Ἄ/Ἀ/Α/Ἅ horen allemaal onder "Α").
  const firstLetter = w => (w.woord.normalize("NFD").replace(/[\u0300-\u036f]/g,"")[0]||"").toLocaleUpperCase("nl");
  const alphaAnchor = (prefix, letter) => `alpha-${prefix}-${letter}`;
  const row = (w, prefix, isFirstOfLetter) => `<div class="codex-vocab-row"${isFirstOfLetter?` id="${alphaAnchor(prefix, firstLetter(w))}"`:""}><span class="codex-vocab-word">${esc(w.woord)}${w.transcript?` <em>(${esc(w.transcript)})</em>`:""}</span><span class="codex-vocab-def">${esc(w.betekenis)}</span></div>`;
  const rowsHTML = (words, prefix) => {
    let lastLetter = null;
    return words.map(w=>{
      const l = firstLetter(w);
      const isFirst = l!==lastLetter;
      lastLetter = l;
      return row(w, prefix, isFirst);
    }).join("");
  };
  const alphaNav = (words, prefix) => {
    const letters = [...new Set(words.map(firstLetter))];
    if(letters.length<4) return "";
    return `<div class="codex-alpha-nav">${letters.map(l=>
      `<button onclick="document.getElementById('${alphaAnchor(prefix,l)}')?.scrollIntoView({behavior:'smooth',block:'start'})">${l}</button>`
    ).join("")}</div>`;
  };
  const langTocHTML = `<div class="codex-grammar-toc">
    <button class="${lang==="alle"?"on":""}" onclick="spSwitchCodexVocabLang('alle')">Alle talen</button>
    <button class="${lang==="grieks"?"on":""}" onclick="spSwitchCodexVocabLang('grieks')">🔷 Grieks (${grieks.length})</button>
    <button class="${lang==="latijn"?"on":""}" onclick="spSwitchCodexVocabLang('latijn')">🔶 Latijn (${latijn.length})</button>
  </div>`;
  const griekseBlok = lang!=="latijn" ? `
    <h4>Grieks</h4>
    ${grieks.length?alphaNav(grieks,"gr")+rowsHTML(grieks,"gr"):'<p class="codex-empty">Nog geen Griekse woorden.</p>'}` : "";
  const latijnseBlok = lang!=="grieks" ? `
    <h4 style="margin-top:14px">Latijn</h4>
    ${latijn.length?alphaNav(latijn,"la")+rowsHTML(latijn,"la"):'<p class="codex-empty">Nog geen Latijnse woorden.</p>'}` : "";
  return langTocHTML + griekseBlok + latijnseBlok;
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
/* ---- KRONIEK-TAB (Chronica.md §12, Deel 1.5 van de spec: "een doorlopend,
   in-fictie logboek van beslissingen... geschreven als annalen, niet als
   menu"). Bewust géén datatabel — SP_STATE.kroniek is een platte, in
   volgorde opgebouwde lijst van {hoofdstuk, tekst, t}-regels (gevuld door
   spKroniekLog, aangeroepen vanuit de klassekeuze, gated-choice-routes,
   skillpoint-investeringen en de payoff-laag), hier alleen gegroepeerd per
   hoofdstuk en als lopende tekst weergegeven — zelfde `.codex-entry`/`<h4>`
   opmaak als de andere tabbladen, geen nieuwe CSS nodig. Eerste tabblad,
   vóór Herinneringen: dit IS het overzicht waar de speler z'n eigen verhaal
   in herkent. ---- */
function spCodexKroniekHTML(){
  const entries = SP_STATE.kroniek||[];
  if(!entries.length) return `<p class="codex-empty">Nog niets vastgelegd — je Kroniek vult zich naarmate je keuzes maakt.</p>`;
  const groups = [];
  entries.forEach(e=>{
    const last = groups[groups.length-1];
    if(!last || last.hoofdstuk!==e.hoofdstuk) groups.push({ hoofdstuk:e.hoofdstuk, items:[e] });
    else last.items.push(e);
  });
  return groups.map(g=>`
    <div class="codex-entry">
      <h4>${esc(g.hoofdstuk||"—")}</h4>
      ${g.items.map(e=>`<p>${esc(e.tekst)}</p>`).join("")}
    </div>`).join("");
}
/* ---- HERINNERINGEN/MUSEUM-TAB (museum van Mnemosyne — wie/wat het precies
   is blijft ambigu tot Hoofdstuk 21, zie Chronica.md §7.2.1a): één klein
   voorwerp per afgeronde lijn/verhaal, verzameld via de SOUVENIR:-sectie
   (spHookSouvenir). Zelfde onerror-terugval-truc als spCombatSpriteHTML
   (battle-loze bazen): ontbreekt het beeld, dan vervangt de <img> zichzelf
   door het icon-emoji i.p.v. de hele tegel te verbergen (zoals
   spCodexImagesHTML doet) — een voorwerp zonder eigen tekening moet toch
   zichtbaar én herkenbaar blijven. Het tabblad zelf heet "Herinneringen" tot
   museum_mnemosyne_ontgrendeld gezet wordt (CH6_MUSEUM_00), daarna "Museum"
   — zie spCodexTabLabel hierboven. ---- */
// Lege/gebroken sokkels (2026-08-18, Gerbens verzoek): zodra het museum
// ontgrendeld is, toont de tab NIET alleen wat de speler al heeft, maar ook
// een placeholder-stolp per NOG NIET gevonden souvenir — zichtbaar verval dat
// geleidelijk "gerepareerd" wordt naarmate SP_STATE.souvenirs groeit. Geen
// caption die verklapt wélk voorwerp er zou moeten staan (dat zou spoilen,
// want souvenirs horen bij verhaallijnen die de speler misschien nooit
// bezoekt) — alleen het generieke gevoel van een gemist tentoonstellingsstuk.
// Vier varianten (2026-08-18, Gerbens verzoek — visuele variatie in het
// rooster) wisselen deterministisch per id (simpele stringhash) zodat het
// rooster niet bij elke render van variant verspringt.
const SP_SOUVENIR_PLACEHOLDER_VARIANTS = [
  { id:"leeg",       icon:"🫙", caption:"Een lege sokkel — nog niets gevonden." },
  { id:"gebroken",   icon:"💔", caption:"Een gebroken stolp — verloren, of nog niet ontdekt." },
  { id:"omgevallen", icon:"🪦", caption:"Een omgevallen sokkel — hier stond ooit iets." },
  { id:"verweerd",   icon:"🕸️", caption:"Een verweerde, overwoekerde sokkel — allang niet meer bezocht." },
];
function spSouvenirPlaceholderVariant(id){
  let h=0; for(let i=0;i<id.length;i++) h=(h*31+id.charCodeAt(i))|0;
  const n = SP_SOUVENIR_PLACEHOLDER_VARIANTS.length;
  return SP_SOUVENIR_PLACEHOLDER_VARIANTS[((h%n)+n)%n];
}
function spCodexSouvenirsHTML(){
  const ids = SP_STATE.souvenirs||[];
  const inMuseum = !!(SP_STATE.flags||{}).museum_mnemosyne_ontgrendeld;
  const intro = inMuseum
    ? `<p class="codex-empty" style="margin-bottom:14px">Je hebt het Museum van Mnemosyne nu zelf betreden: een hal vol sokkels en glazen stolpen, waarvan de meeste nog leeg staan of al zijn aangetast door de tijd. Wat hieronder staat, is enkel wat jij al hebt gevuld — de rest wacht nog op een voorwerp.</p>`
    : "";
  if(!inMuseum){
    if(!ids.length) return `<p class="codex-empty">Nog niets verzameld — onderweg laat het Orakel je soms een voorwerp uit het verhaal meenemen.</p>`;
    const tiles = ids.map(id=>{
      const def = SP_SOUVENIRS[id]; if(!def) return "";
      return spSouvenirTileHTML(def);
    }).join("");
    return `<div class="codex-gallery">${tiles}</div>`;
  }
  const filledTiles = Object.keys(SP_SOUVENIRS).map(id=>{
    const def = SP_SOUVENIRS[id];
    return ids.includes(id) ? spSouvenirTileHTML(def) : spSouvenirEmptyTileHTML(id);
  }).join("");
  return intro + `<div class="codex-gallery">${filledTiles}</div>`;
}
function spSouvenirTileHTML(def){
  return `<div class="codex-gallery-item">
      <div style="width:100%;aspect-ratio:1/1;display:flex;align-items:center;justify-content:center;background:rgba(90,58,26,.12);border-radius:6px;overflow:hidden">
        <img src="assets/chronica/souvenirs/${esc(def.img||'')}" alt="" style="width:100%;height:100%;object-fit:contain"
          onerror="this.parentElement.innerHTML='<span style=&quot;font-size:40px&quot;>${esc(def.icon)}</span>'">
      </div>
      <div class="codex-gallery-caption">${esc(def.caption)}</div>
    </div>`;
}
function spSouvenirEmptyTileHTML(id){
  const variant = spSouvenirPlaceholderVariant(id);
  return `<div class="codex-gallery-item" style="opacity:.55">
      <div style="width:100%;aspect-ratio:1/1;display:flex;align-items:center;justify-content:center;background:rgba(90,58,26,.12);border-radius:6px;overflow:hidden">
        <img src="assets/chronica/souvenirs/museum_${variant.id}.png" alt="" style="width:100%;height:100%;object-fit:contain"
          onerror="this.parentElement.innerHTML='<span style=&quot;font-size:40px&quot;>${variant.icon}</span>'">
      </div>
      <div class="codex-gallery-caption">${esc(variant.caption)}</div>
    </div>`;
}

/* ---- WERELDKAART: geïllustreerd paneel + onthullende locatie-pins.
   Codex is PER SAVESLOT (net als de rest van SP_STATE), dus de kaart toont
   de ontdekkingen van de actieve slot — logisch, want elke slot is een eigen
   doorspeling met een eigen route door het verhaal.
   Zoom (Gerbens verzoek, 2026-08-04 — Griekenland zit te vol op 100%): het
   plaatje wordt op 150/200/275% breder gerenderd binnen een scrollbare
   viewport; de pins zelf krijgen NOOIT een CSS-%, altijd PIXELS, herberekend
   via spPositionMapPins() vanuit de werkelijke gerenderde beeldgrootte
   (img.clientWidth/Height). Zelfde reden als de pin-editor-tool
   (certamen/assets/chronica/maps/pin-editor.html): % op een absoluut
   gepositioneerd kind lost op t.o.v. de eigen (mogelijk kleinere, door
   overflow ingeklemde) containing block, niet t.o.v. het echte, groter
   gerenderde plaatje — dat gaf daar exact dezelfde "pins driften weg"-bug.
   De pins-wrapper krijgt om diezelfde reden ook een expliciete px-breedte/
   hoogte (i.p.v. inset:0), zodat hij het paneel écht laat scrollen tot aan
   de rand van het gezoomde plaatje. ---- */
let SP_MAP_CURRENT_PANEL = "aegean";
let SP_MAP_ZOOM = 1;
const SP_MAP_ZOOM_LEVELS = [1, 1.5, 2, 2.75];
SCREENS.spWorldMap = function(){
  document.body.classList.remove("greek");
  if(!SP_ACTIVE_SLOT){ go("spSlots"); return; }
  if(!SP_MAP_PANELS[SP_MAP_CURRENT_PANEL]) SP_MAP_CURRENT_PANEL = Object.keys(SP_MAP_PANELS)[0];
  const panelId = SP_MAP_CURRENT_PANEL;
  const panel = SP_MAP_PANELS[panelId];
  const codex = SP_STATE.codex||[];
  const pins = SP_MAP_LOCATIONS
    .filter(loc=>loc.panel===panelId && spLocationUnlocked(loc, codex))
    .map(loc=>`<button class="sp-map-pin" data-x="${loc.x}" data-y="${loc.y}" title="${esc(loc.nm)}" onclick="spShowLocationInfo('${loc.id}')">
      <span class="sp-map-pin-dot"></span><span class="sp-map-pin-label">${esc(loc.nm)}</span>
    </button>`).join("");
  const tabs = Object.keys(SP_MAP_PANELS).map(pid=>
    `<button class="btn ${pid===panelId?"btn-primary":"btn-ghost"}" style="flex:1" onclick="spSwitchMapPanel('${pid}')">${esc(SP_MAP_PANELS[pid].nm.split(" — ")[0])}</button>`
  ).join("");
  const zoomBtns = SP_MAP_ZOOM_LEVELS.map(z=>
    `<button class="btn ${Math.abs(z-SP_MAP_ZOOM)<0.01?"btn-primary":"btn-ghost"}" style="flex:1" onclick="spSetMapZoom(${z})">${Math.round(z*100)}%</button>`
  ).join("");
  H(brand(true)+`
  <div class="scrhead"><button class="back" onclick="go('spSlots')">${iconSVG("shield",20,"currentColor")}</button><h2>Wereldkaart</h2></div>
  <div class="panel" style="display:flex;gap:8px;flex-wrap:wrap">${tabs}</div>
  <div class="panel" style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
    <span class="note" style="margin:0;white-space:nowrap">🔍 Zoom:</span>${zoomBtns}
  </div>
  <div class="panel"><p class="note">${esc(panel.nm)} — nieuwe plekken verschijnen zodra je ze in het verhaal hebt bezocht. Plekken te dicht op elkaar? Zoom in.</p></div>
  <div class="panel" style="padding:0;overflow:auto;position:relative;max-height:65vh">
    <img id="spMapImg" src="assets/chronica/maps/${esc(panel.img)}" alt="" style="width:${Math.round(SP_MAP_ZOOM*100)}%;display:block" onload="spPositionMapPins()" onerror="this.parentElement.querySelector('.sp-map-missing').style.display='block'">
    <div class="sp-map-missing note" style="display:none;padding:40px 16px;text-align:center">Kaart nog niet beschikbaar.</div>
    <div id="spMapPins" style="position:absolute;left:0;top:0">${pins}</div>
  </div>
  ${foot()}`);
  spPositionMapPins();
};
function spSetMapZoom(z){
  SP_MAP_ZOOM = z;
  go("spWorldMap");
}
function spPositionMapPins(){
  const img = document.getElementById('spMapImg');
  const wrap = document.getElementById('spMapPins');
  if(!img || !wrap) return;
  const w = img.clientWidth, h = img.clientHeight;
  if(!w || !h) return; // nog niet (klaar met) laden
  wrap.style.width = w + 'px';
  wrap.style.height = h + 'px';
  wrap.querySelectorAll('.sp-map-pin').forEach(pin=>{
    const x = parseFloat(pin.dataset.x), y = parseFloat(pin.dataset.y);
    pin.style.left = (x/100*w) + 'px';
    pin.style.top = (y/100*h) + 'px';
  });
}
window.addEventListener('resize', ()=>{ spPositionMapPins(); });
function spSwitchMapPanel(pid){
  SP_MAP_CURRENT_PANEL = pid;
  SP_MAP_ZOOM = 1;
  go("spWorldMap");
}
function spShowLocationInfo(id){
  const loc = SP_MAP_LOCATIONS.find(l=>l.id===id);
  if(loc) toast(loc.nm, loc.desc);
}

/* ---- STADSPLATTEGRONDEN (Athene/Rome) — zelfde patroon als SCREENS.spWorldMap
   hierboven, eigen state/const-paar (SP_CITY_MAP_PANELS/SP_CITY_MAP_LOCATIONS,
   singleplayer-data.js), zie de bouwstatus-notitie daar. ---- */
let SP_CITY_MAP_CURRENT_PANEL = "athene";
let SP_CITY_MAP_ZOOM = 1;
SCREENS.spCityMaps = function(){
  document.body.classList.remove("greek");
  if(!SP_ACTIVE_SLOT){ go("spSlots"); return; }
  if(!SP_CITY_MAP_PANELS[SP_CITY_MAP_CURRENT_PANEL]) SP_CITY_MAP_CURRENT_PANEL = Object.keys(SP_CITY_MAP_PANELS)[0];
  const panelId = SP_CITY_MAP_CURRENT_PANEL;
  const panel = SP_CITY_MAP_PANELS[panelId];
  const codex = SP_STATE.codex||[];
  const pins = SP_CITY_MAP_LOCATIONS
    .filter(loc=>loc.panel===panelId && spLocationUnlocked(loc, codex))
    .map(loc=>`<button class="sp-map-pin" data-x="${loc.x}" data-y="${loc.y}" title="${esc(loc.nm)}" onclick="spShowCityLocationInfo('${loc.id}')">
      <span class="sp-map-pin-dot"></span><span class="sp-map-pin-label">${esc(loc.nm)}</span>
    </button>`).join("");
  const tabs = Object.keys(SP_CITY_MAP_PANELS).map(pid=>
    `<button class="btn ${pid===panelId?"btn-primary":"btn-ghost"}" style="flex:1" onclick="spSwitchCityMapPanel('${pid}')">${esc(SP_CITY_MAP_PANELS[pid].nm.split(" — ")[0])}</button>`
  ).join("");
  const zoomBtns = SP_MAP_ZOOM_LEVELS.map(z=>
    `<button class="btn ${Math.abs(z-SP_CITY_MAP_ZOOM)<0.01?"btn-primary":"btn-ghost"}" style="flex:1" onclick="spSetCityMapZoom(${z})">${Math.round(z*100)}%</button>`
  ).join("");
  H(brand(true)+`
  <div class="scrhead"><button class="back" onclick="go('spSlots')">${iconSVG("shield",20,"currentColor")}</button><h2>Stadsplattegronden</h2></div>
  <div class="panel" style="display:flex;gap:8px;flex-wrap:wrap">${tabs}</div>
  <div class="panel" style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
    <span class="note" style="margin:0;white-space:nowrap">🔍 Zoom:</span>${zoomBtns}
  </div>
  <div class="panel"><p class="note">${esc(panel.nm)} — nieuwe plekken verschijnen zodra je ze in het verhaal hebt bezocht. Plekken te dicht op elkaar? Zoom in.</p></div>
  <div class="panel" style="padding:0;overflow:auto;position:relative;max-height:65vh">
    <img id="spCityMapImg" src="assets/chronica/maps/${esc(panel.img)}" alt="" style="width:${Math.round(SP_CITY_MAP_ZOOM*100)}%;display:block" onload="spPositionCityMapPins()" onerror="this.parentElement.querySelector('.sp-map-missing').style.display='block'">
    <div class="sp-map-missing note" style="display:none;padding:40px 16px;text-align:center">Kaart nog niet beschikbaar.</div>
    <div id="spCityMapPins" style="position:absolute;left:0;top:0">${pins}</div>
  </div>
  ${foot()}`);
  spPositionCityMapPins();
};
function spSetCityMapZoom(z){
  SP_CITY_MAP_ZOOM = z;
  go("spCityMaps");
}
function spPositionCityMapPins(){
  const img = document.getElementById('spCityMapImg');
  const wrap = document.getElementById('spCityMapPins');
  if(!img || !wrap) return;
  const w = img.clientWidth, h = img.clientHeight;
  if(!w || !h) return; // nog niet (klaar met) laden
  wrap.style.width = w + 'px';
  wrap.style.height = h + 'px';
  wrap.querySelectorAll('.sp-map-pin').forEach(pin=>{
    const x = parseFloat(pin.dataset.x), y = parseFloat(pin.dataset.y);
    pin.style.left = (x/100*w) + 'px';
    pin.style.top = (y/100*h) + 'px';
  });
}
window.addEventListener('resize', ()=>{ spPositionCityMapPins(); });
function spSwitchCityMapPanel(pid){
  SP_CITY_MAP_CURRENT_PANEL = pid;
  SP_CITY_MAP_ZOOM = 1;
  go("spCityMaps");
}
function spShowCityLocationInfo(id){
  const loc = SP_CITY_MAP_LOCATIONS.find(l=>l.id===id);
  if(loc) toast(loc.nm, loc.desc);
}

/* ---- STATISTIEKEN: investeringsscherm voor skillpoints (Chronica.md §11.3).
   Per saveslot, net als kaart/codex — elke doorspeling heeft een eigen
   klasse en eigen groei. Drie caps tegelijk gehandhaafd: harde grens 20,
   zachte grens die meeschaalt met het bereikte hoofdstuk (16 t/m Hoofdstuk 3,
   18 t/m Hoofdstuk 6), en max. 2 verhogingen per stat per hoofdstuk
   (statSpentSinceAward, gereset door spHookStatpoints bij elke nieuwe
   toekenning). Bereikbaar vanuit het Chronica-menu (spRenderLanding) en
   vanuit het Certamen-profiel (battle.js, via spResumeSlotToStats). ---- */
function spStatSoftCap(chapterNr){
  return chapterNr<=3 ? 16 : chapterNr<=6 ? 18 : 20;
}
SCREENS.spStats = function(){
  document.body.classList.remove("greek");
  if(!SP_ACTIVE_SLOT){ go("spSlots"); return; }
  if(!SP_STATE.stats){
    H(brand(true)+`
    <div class="scrhead"><button class="back" onclick="go('spSlots')">${iconSVG("shield",20,"currentColor")}</button><h2>Karakter Informatie</h2></div>
    <div class="panel" style="text-align:center"><p class="note">Je hebt nog geen klasse gekozen — dat gebeurt vroeg in de proloog.</p></div>
    ${foot()}`);
    return;
  }
  const cls = BM_CLASSES.find(c=>c.id===SP_STATE.classId);
  const av = spAvatarMerge(spAvatarLoadLocal());
  // showWeapon:true, net als de avatar-editor zelf (singleplayer.js:165) en
  // Battle Mode's eigen profielscherm (battle.js:3797) — leerlingfeedback
  // (2026-08-18): het wapen was hier onzichtbaar (renderPixelHeroPreview
  // verbergt het sprite-wapen standaard via CSS tenzij showWeapon meegegeven
  // wordt), terwijl de tekstlijst eronder ("Huidige uitrusting") het wél al
  // correct toonde — verwarrend, want het wapen was dus niet echt kwijt.
  const avatarHTML = renderPixelHeroPreview(av,true) || bmAvatarSVG(av,72);
  const equipHTML = ["wapen","armor","helm","schild","cape"].map(partId=>{
    const part = BM_AVATAR_PARTS[partId];
    const opt = part?.opts.find(o=>o.id===av[partId]);
    return `<div style="display:flex;justify-content:space-between;font-size:13px;padding:4px 0;border-bottom:1px solid rgba(255,255,255,.06)">
      <span class="note">${esc(part?part.nm:partId)}</span><span>${esc(opt?opt.nm:(av[partId]||"—"))}</span>
    </div>`;
  }).join("");
  const chapter = spCurrentCampaignChapter(SP_STATE.node);
  const chapterNr = chapter.type==="proloog" ? 0 : (chapter.nr||0);
  const softCap = spStatSoftCap(chapterNr);
  const points = SP_STATE.skillpoints||0;
  const spent = SP_STATE.statSpentSinceAward||{};
  const rows = SP_STAT_KEYS.map(key=>{
    const def = SP_STAT_DEFS[key];
    const val = SP_STATE.stats[key]||0;
    const cost = spStatpointCost(val);
    let reason = null;
    if(val>=20) reason = "maximum bereikt";
    else if(val>=softCap) reason = `nog niet hoger dan ${softCap} in dit deel van het verhaal`;
    else if((spent[key]||0)>=2) reason = "al 2× verhoogd dit hoofdstuk";
    else if(points<cost) reason = `kost ${cost} punt${cost===1?"":"en"} — te weinig`;
    const blocked = !!reason;
    return `<div class="panel" style="padding:12px 14px;margin-bottom:8px">
      <div style="display:flex;justify-content:space-between;align-items:baseline">
        <div><strong>${esc(def.nm)}</strong> <span class="note" style="font-size:11px">(${esc(def.dnd)})</span></div>
        <div style="font-variant-numeric:tabular-nums;font-size:18px;font-weight:700">${val}</div>
      </div>
      <div class="note" style="font-size:12px;margin:4px 0 8px">${esc(def.domein)}</div>
      <div style="display:flex;justify-content:space-between;align-items:center;gap:8px">
        <span class="note" style="font-size:11px">${blocked?esc(reason):`kost ${cost} punt${cost===1?"":"en"}`}</span>
        <button class="btn ${blocked?"btn-ghost":"btn-gold"}" style="padding:6px 14px" ${blocked?"disabled":""} onclick="spInvestStat('${key}')">+1</button>
      </div>
    </div>`;
  }).join("");
  H(brand(true)+`
  <div class="scrhead"><button class="back" onclick="go('spSlots')">${iconSVG("shield",20,"currentColor")}</button><h2>Karakter Informatie</h2></div>
  <div class="panel" style="text-align:center">
    <div style="display:flex;justify-content:center;margin-bottom:6px">${avatarHTML}</div>
    <div class="eyebrow l">${cls?esc(cls.nm):""}</div>
    <div style="font-size:22px;font-weight:700;margin-top:4px">${points} statpunt${points===1?"":"en"} beschikbaar</div>
    <p class="note" style="margin-top:6px">Verdiend aan het eind van elk hoofdstuk. Max. 2 verhogingen per stat per hoofdstuk.</p>
  </div>
  <div class="panel">
    <div class="eyebrow l">Huidige uitrusting</div>
    ${equipHTML}
    <button class="btn btn-ghost" style="font-size:13px;margin-top:10px" onclick="SP_AV_RETURN='spStats';go('spAvatarEdit')">Chronica Classica Avatar aanpassen</button>
  </div>
  ${rows}
  ${foot()}`);
};
function spInvestStat(key){
  if(!SP_STATE.stats) return;
  const val = SP_STATE.stats[key]||0;
  const cost = spStatpointCost(val);
  const points = SP_STATE.skillpoints||0;
  const chapter = spCurrentCampaignChapter(SP_STATE.node);
  const chapterNr = chapter.type==="proloog" ? 0 : (chapter.nr||0);
  const softCap = spStatSoftCap(chapterNr);
  const spent = SP_STATE.statSpentSinceAward||{};
  if(points<cost || val>=20 || val>=softCap || (spent[key]||0)>=2) return;
  const stats = {...SP_STATE.stats, [key]:val+1};
  const statSpentSinceAward = {...spent, [key]:(spent[key]||0)+1};
  const statLog = [...(SP_STATE.statLog||[]), { key, van:val, naar:val+1, hoofdstuk:chapterNr, t:Date.now() }];
  spSaveProgress({ stats, skillpoints:points-cost, statSpentSinceAward, statLog });
  spKroniekLog(SpTextResolver.resolve(
    `Na dit hoofdstuk nam {subject} de tijd om te oefenen — {possessive} ${SP_STAT_VIRTUE[key]||SP_STAT_DEFS[key]?.nm||key} groeide er zichtbaar door.`,
    SP_STATE));
  go("spStats");
}
// Welke saveslot toont het Certamen-profiel (battle.js) als statistieken-
// samenvatting? De meest recent bijgewerkte slot die al een klasse heeft —
// alleen lokaal geraadpleegd (geen Firebase-rondje) zodat het profielscherm
// niet op netwerk hoeft te wachten; Firebase is toch alleen een spiegel.
function spBestStatsSlot(){
  const slots = spSlotsLoadLocal();
  let best=null, bestN=null;
  for(let n=1;n<=SP_MAX_SLOTS;n++){
    const s = slots[n];
    if(s && s.classId && s.stats && (!best || (s.updatedAt||0)>(best.updatedAt||0))){ best=s; bestN=n; }
  }
  return best ? {n:bestN, slot:best} : null;
}
// Vanuit het Certamen-profiel (battle.js) een slot laden puur om de
// statistieken te bekijken/investeren, zonder de speler mee te trekken naar
// het verhaal zelf (spResumeSlot zou naar spRenderLanding gaan).
async function spResumeSlotToStats(n){
  SP_ACTIVE_SLOT = n;
  const slots = await spLoadAllSlots();
  SP_STATE = Object.assign(SP_EMPTY_STATE(), slots[n]||{});
  // Dezelfde savemigratie als in spResumeSlot: ook wie via het Certamen-profiel
  // binnenkomt hoort de inhaalslag meteen te krijgen. Bewust ZONDER
  // SP_MIGRATION_NOTES te vullen: dit scherm toont ze niet, en zou de speler bij
  // "Verdergaan" alsnog langs spResumeSlot komen, dan overschrijft die de lijst
  // met een lege (er valt dan immers niets meer in te halen) — de melding zou
  // dus toch verloren gaan. De data is het punt, de melding is bijvangst.
  const migratie = spMigrateSave(SP_STATE);
  if(migratie.changed) await spSaveProgress({});
  go("spStats");
}

/* ---- TAALSTATISTIEKEN PER KLAS (didactiek-audit #6/#9, 2026-07-30) ----
   Fire-and-forget, alleen als de speler is ingelogd via klascode (BM_IDENT) —
   zelfde patroon als bmSyncClassMissedWords() (battle.js), maar een eigen
   boom (classAnalyticsChronica, niet classAnalytics zelf) omdat puzzel-ids en
   leesval-uitkomsten een ander soort sleutel zijn dan Battle Mode-woordvragen.
   Nooit leerlingnamen, alleen geaggregeerde tellingen per klas/maand — zie
   tpRenderChronicaAnalytics() in games.js voor de docentweergave. */
function spClassAnalyticsBase(){
  if(!fbDB || !BM_IDENT || !BM_IDENT.klascode) return null;
  const month = new Date().toISOString().slice(0,7);
  return "classAnalyticsChronica/"+BM_IDENT.klascode+"/"+month+"/";
}
function spSyncPuzzleMistake(puzzleId, given){
  const base = spClassAnalyticsBase(); if(!base) return;
  const path = base+"puzzle_"+puzzleId+"/";
  const upd = {};
  upd[path+"p"] = puzzleId;
  upd[path+"a"] = String(given||"").slice(0,80);
  upd[path+"c"] = firebase.database.ServerValue.increment(1);
  fbDB.ref().update(upd).catch(()=>{});
}
// Leerlingfeedback (2026-08-13): een fout antwoord kreeg altijd een hint,
// een goed antwoord niets — puur stilzwijgend door naar de volgende scène.
// Elk van de zes puzzeltypes toont nu bij een juist antwoord kort een
// goedkeurende toast, vlak vóór de overgang naar de doelscène.
const SP_PUZZLE_CORRECT_TOASTS = [
  "Athena knikt goedkeurend.",
  "Ergens, onzichtbaar, knikt Athena tevreden.",
  "Athena's blik toont, heel even, iets van trots.",
  "De godin van de wijsheid keurt je antwoord goed.",
];
function spPuzzleCorrectToast(){
  beep("good");
  toast("Juist!", pick(SP_PUZZLE_CORRECT_TOASTS));
}
// Leerlingfeedback (2026-08-18): bij een correct ingevuld woord ging het
// spel meteen door naar de volgende scène, zonder de complete zin te tonen
// — leerlingen zagen dus nooit wat de zin nu eigenlijk werd. Haalt het
// eerste “...”-gecciteerde zinsdeel met een ___-gat uit puzzle.vraag en
// vult het aan met het juiste antwoord; null als er geen gat te vinden is
// (bv. een vocabulaire-vraag zonder brontaalzin).
function spBlankFillSentence(vraag, antwoord){
  const m = /[“"]([^”"]*___[^”"]*)[”"]/.exec(vraag||"");
  if(!m) return null;
  return m[1].replace("___", antwoord);
}
let SP_PUZZLE_SOLVED = null;
// Vervangt een directe spGoCns(target) na een juist antwoord: als er een
// ingevulde zin is, toont eerst SCREENS.spPuzzleSolved die zin met een
// "Ga verder"-knop; anders (geen ___-gat gevonden) meteen doornavigeren,
// zoals voorheen.
function spPuzzleAdvance(target, filledSentence){
  spPuzzleCorrectToast();
  if(filledSentence){
    SP_PUZZLE_SOLVED = { text: filledSentence, target };
    SCREENS.spPuzzleSolved();
  } else {
    spGoCns(target);
  }
}
SCREENS.spPuzzleSolved = function(){
  const s = SP_PUZZLE_SOLVED;
  if(!s){ go("spSlots"); return; }
  H(brand(true)+`
  <div class="scrhead">${spBackToMenuButtonHTML()}<h2>Chronica Classica</h2>${spAudioToggleHTML()}</div>
  <div class="panel" style="text-align:center">
    <div class="eyebrow l">Juist!</div>
    <p style="font-size:19px;margin-top:10px">“${esc(s.text)}”</p>
  </div>
  <button class="btn btn-gold btn-block lg" onclick="spPuzzleSolvedContinue()">Ga verder</button>
  ${foot()}`);
};
function spPuzzleSolvedContinue(){
  const target = SP_PUZZLE_SOLVED?.target;
  SP_PUZZLE_SOLVED = null;
  spGoCns(target);
}
function spSyncLeesvalOutcome(leesvalId, goed){
  const base = spClassAnalyticsBase(); if(!base) return;
  const path = base+"leesval_"+leesvalId+"/";
  const upd = {};
  upd[path+"p"] = leesvalId;
  upd[path+(goed?"goed":"fout")] = firebase.database.ServerValue.increment(1);
  fbDB.ref().update(upd).catch(()=>{});
}

/* ---- NAVIGATIE ---- */
function spGoCns(nodeId){
  // Elke leesval-uitkomstscène eindigt op _GOED/_FOUT (B21/B29, zie
  // Chronica.md §7.17/§7.23) — generieke hook i.p.v. 13 losse call-sites.
  const leesvalMatch = /^(.+)_(GOED|FOUT)$/.exec(nodeId);
  if(leesvalMatch) spSyncLeesvalOutcome(leesvalMatch[1], leesvalMatch[2]==="GOED");
  // Finale-router (Chronica.md §7.101): de vijf eindes hangen af van de
  // Clementia/Severitas-stand die tot en met Hoofdstuk 19 is opgebouwd
  // (zie chronica-finale-brainstorm-2026-08-17 in memory) — precies ÉÉN
  // keer berekend bij binnenkomst, zodat REQUIRE op `fin_tendency` daarna
  // een gewone statische FLAG-vergelijking blijft, net als overal elders.
  if(nodeId === "FIN_KEUZE_000"){
    const flags = {...(SP_STATE.flags||{}), fin_tendency: spComputeTendencyTier(SP_STATE)};
    spSaveProgress({ flags });
  }
  // fin_herinnering_score (Chronica.md §7.101): hoeveel van de resterende
  // dode-flag-credits en RELATION-clusters de speler echt heeft opgebouwd —
  // net als fin_tendency hierboven, één keer berekend bij binnenkomst.
  if(nodeId === "FIN_HER_EINDE"){
    const flags = {...(SP_STATE.flags||{}), fin_herinnering_score: String(spFinaleHerinneringScore(SP_STATE))};
    spSaveProgress({ flags });
  }
  spSaveProgress({ node:nodeId });
  go("spPlay");
}
/* Klik op een keuzeknop: registreert eerst stil de Clementia/Severitas-tag (indien
   aanwezig — zie CNSParser.APPROACH_TAG_RE) en navigeert dan pas door. Zo
   blijft spGoCns bruikbaar voor alle andere navigatie (puzzels, kaart-pins,
   "Verdergaan"-knop) die geen approach-tag kennen. */
function spChoosePath(target, approach){
  if(approach){
    spHookApproach(approach);
    const reaction = spSceneReaction(SP_SCENES.get(SP_STATE.node), approach);
    if(reaction) toast(reaction.nm, reaction.text);
  }
  spGoCns(target);
}
// Directe NPC-reactie op een CLEMENTIA/SEVERITAS-keuze (Chronica.md B17):
// bewust LOSSTAAND van spHookApproach (die blijft de stille teller — zie
// hierboven bij spHookApproach). Optionele REACTION:-sectie in de bronscène,
// eerste regel de PERSON-id (voor de weergavenaam via SP_CODEX_PERSONS), dan
// per gekozen tag één regel "CLEMENTIA: ..."/"SEVERITAS: ..."/"NEUTRAL: ...".
// Geen REACTION-sectie of geen regel voor deze tag → gewoon stil, zoals nu.
function spSceneReaction(scene, approach){
  const raw = scene?.meta?.REACTION;
  if(!raw) return null;
  const lines = raw.split(/\r?\n/).map(l=>l.trim()).filter(Boolean);
  if(lines.length<2) return null;
  const npcId = lines[0];
  const tagRe = new RegExp("^"+approach+":\\s*(.+)$","i");
  for(const line of lines.slice(1)){
    const m = line.match(tagRe);
    if(m) return { nm: SP_CODEX_PERSONS[npcId]?.nm || npcId, text: m[1].trim().replace(/^["“](.*)["”]$/,"$1") };
  }
  return null;
}
// ---- KLEIO-STEM (Gerben, 2026-08-18): de Kroniek wordt vanaf nu geschreven
// alsof Kleio, muze van de geschiedschrijving, meekijkt — een derde-persoon
// annalenstijl met {subject}/{possessive}-tokens (SpTextResolver) i.p.v. de
// mechanische "Bij X: Y"-regel van voorheen. spKleioClause hieronder zet een
// keuze-label (meestal gebiedende wijs, "Praat de poortwacht om...") om in
// een derde-persoon-verleden-tijd bijzin ("praatte de poortwacht om...") via
// een kleine werkwoordenlijst met de vaakst voorkomende openingswerkwoorden
// in de CNS-data; een onbekend werkwoord levert null op, en de aanroeper
// valt dan terug op het label zelf (nooit een foutieve vervoeging verzinnen).
const SP_KLEIO_VERB_MAP = {
  zie:"zag", ga:"ging", kijk:"keek", volg:"volgde", keer:"keerde", steek:"stak",
  blijf:"bleef", luister:"luisterde", vind:"vond", hoor:"hoorde", wacht:"wachtte",
  laat:"liet", erken:"erkende", bekijk:"bekeek", onthoud:"onthield", vaar:"voer",
  voel:"voelde", vraag:"vroeg", loop:"liep", neem:"nam", help:"hielp", stap:"stapte",
  weet:"wist", kies:"koos", spreek:"sprak", bedank:"bedankte", grijp:"greep",
  overweeg:"overwoog", zoek:"zocht", twijfel:"twijfelde", reis:"reisde", maak:"maakte",
  trek:"trok", lees:"las", houd:"hield", merk:"merkte", praat:"praatte",
  overtuig:"overtuigde", vecht:"vocht", red:"redde", vertel:"vertelde", zwijg:"zweeg",
  verberg:"verborg", toon:"toonde", sla:"sloeg", ren:"rende", antwoord:"antwoordde",
  weiger:"weigerde", aanvaard:"aanvaardde", bied:"bood", geef:"gaf", deel:"deelde",
  roep:"riep", draai:"draaide", duw:"duwde", open:"opende", sluit:"sloot",
  verlaat:"verliet", stuur:"stuurde", volhard:"volhardde", buig:"boog", omarm:"omarmde",
  weersta:"weerstond", vermijd:"vermeed", verdedig:"verdedigde", eer:"eerde",
  beloof:"beloofde", zweer:"zwoer", knik:"knikte", glimlach:"glimlachte", sta:"stond",
  klim:"klom", spring:"sprong", zwem:"zwom", roei:"roeide", proef:"proefde",
};
function spKleioClause(label){
  const words = label.trim().split(/\s+/);
  const key = (words[0]||"").toLowerCase().replace(/^["“]+|["”,.!?]+$/g,"");
  const conj = SP_KLEIO_VERB_MAP[key];
  if(!conj || words.length<2) return null;
  const rest = words.slice(1).join(" ");
  // Alleen het EERSTE werkwoord van het label wordt vervoegd — bij een
  // samengestelde imperatief ("Blijf op afstand en volg haar spoor...",
  // CH2_K05_OPEN) laat dat een tweede, nog-onvervoegde gebiedende wijs
  // staan, of een resterende 2e-persoonsverwijzing ("...raak je haar
  // kwijt"). Dat levert een grammaticaal gemixte zin op — veiliger om dan
  // helemaal niet te vervoegen en op de citaat-fallback terug te vallen
  // (spChooseTrackedPath/spChooseAndLog) dan een half-foute zin te loggen.
  if(/\b(je|jij|jou|jouw)\b/i.test(rest)) return null;
  return conj+" "+rest;
}
// Laatste redmiddel wanneer spKleioClause geen werkwoord herkent: geen kale
// "Bij X koos zij: 'label'" meer (Gerben, 2026-08-19: "klinkt niet als een
// verteller die een kroniek schrijft over een held") — een label dat al een
// aangehaald citaat is ("Ik begrijp het — ...") wordt nu als gesproken tekst
// ingeleid ("sprak zij: ..."), een gewone beschrijvende labeltekst als een
// bewuste keuze ("koos zij ervoor: ..."). GEEN "Bij 'scènetitel}'"-opener
// meer (Gerben, 2026-08-19, tweede correctie: "Een schrijver zegt niet 'In
// hoofdstuk 3 deed de hoofdrolspeler dit...'"). Heeft de scène een DIALOGUE-
// sectie, dan gebruikt de zin — zoals Gerben zelf voorstelde ("In gesprek
// met Kronos ... antwoordde zij: ...") — de gesprekspartner als verankering
// i.p.v. de titel; zonder DIALOGUE valt dit terug op de kale variant.
function spKleioLabelFallback(scene, label){
  const speaker = scene.dialogue ? SpTextResolver.resolve(scene.dialogue.speaker, SP_STATE) : null;
  const isQuote = /^["“]/.test(label.trim());
  if(isQuote){
    return speaker
      ? `In gesprek met ${speaker} sprak {subject}: ${label}`
      : `{subject_cap} sprak: ${label}`;
  }
  return speaker
    ? `In gesprek met ${speaker} koos {subject} ervoor: ${spLowerFirst(label)}${spSentenceEnd(label)}`
    : `{subject_cap} koos ervoor: ${spLowerFirst(label)}${spSentenceEnd(label)}`;
}
// Zodra de speler een van de vijf Finale-eindes bereikt (Chronica.md §7.101,
// FIN_KEUZE_000 routeert er via de opgebouwde fin_tendency naartoe) mag de
// Kroniek eindelijk vertellen hoe Lethe reageerde — dat kon eerder niet
// (spoiler voor de andere vier eindes), maar wie hier is aangekomen heeft
// het zelf al gezien (Gerben, 2026-08-19: "dan is het sowieso geen spoiler
// meer"). Elk eind is zelf een lineaire (1-keuze) scène, dus zou anders
// NOOIT gelogd worden (spChooseAndLog logt alleen echte vertakkingen) —
// vandaar deze aparte hook, net als spHookReward voor de klassekeuze. Eén
// keer per save (fin_einde_gelogd-flag), voor het geval de speler ooit
// terugbladert.
const SP_FINALE_EINDE_KRONIEK = {
  FIN_EINDE_NEUTRAAL: "Geen verzoening, geen overwinning — Lethe en {subject} leerden naast elkaar te bestaan, geen van beiden de ander de baas.",
  FIN_EINDE_CLEM_MED: "Lethe knikte, iets minder onbewogen dan ze ooit was geweest — het vergeten verdween niet, maar kreeg er, dankzij {object}, voortaan iets vriendelijkers bij.",
  FIN_EINDE_CLEM_HOOG: "{subject_cap} strekte {possessive} hand uit, niet om te vechten maar om vast te houden — en Lethe liet zich, voor het eerst in wie weet hoe lang, aanraken zonder te verdwijnen.",
  FIN_EINDE_SEV_MED: "Lethe week terug, niet verslagen maar wél teruggedrongen — genoeg voor nu, niet voorgoed.",
  FIN_EINDE_SEV_HOOG: "{subject_cap} bleef onbewogen tot Lethe zich terugtrok, zwijgend, tijdelijk overwonnen door iemand die weigerde ook maar iets van dit verhaal op te geven.",
};
function spKroniekFinaleEindeLog(node){
  const tekst = SP_FINALE_EINDE_KRONIEK[node];
  if(!tekst || (SP_STATE.flags||{}).fin_einde_gelogd) return;
  spKroniekLog(SpTextResolver.resolve(tekst, SP_STATE));
  spSaveProgress({ flags: {...(SP_STATE.flags||{}), fin_einde_gelogd:true} });
}
// Kroniek (Chronica.md §12, Deel 1.5 van de spec): "een doorlopend,
// in-fictie logboek van beslissingen... geschreven als annalen, niet als
// menu". Eén regel tekst per noemenswaardige gebeurtenis, gegroepeerd per
// hoofdstuk in de weergave (SCREENS.spCodex). Bewust GEEN los datamodel
// per brontype — alles is gewoon een {hoofdstuk, tekst, t}-regel.
function spKroniekLog(tekst){
  const kroniek = [...(SP_STATE.kroniek||[]), { hoofdstuk: spChapterLabel(SP_STATE.node), tekst, t: Date.now() }];
  spSaveProgress({ kroniek });
}
// Voor keuzes die de Kroniek moet vastleggen: gated (STAT:) routes en
// [DONE]-hub-keuzes (welke lijn je koos) — "wat en hoe de held bepaalde
// scènes doorgespeeld heeft". Zoekt de aangeklikte keuze terug op in de
// BRONSCENE (nog SP_STATE.node, vóór spChoosePath navigeert) via het
// target — veiliger dan het label zelf door de onclick-HTML te sturen
// (labels bevatten regelmatig een apostrof).
function spChooseTrackedPath(target, approach){
  const scene = SP_SCENES.get(SP_STATE.node);
  const choice = scene?.choices.find(c=>c.target===target && (c.statReq||c.done));
  if(choice && SpTextResolver.resolve(choice.label, SP_STATE).trim()){
    const label = SpTextResolver.resolve(choice.label, SP_STATE);
    const clause = spKleioClause(label);
    let sentence;
    if(choice.statReq){
      const virtue = SP_STAT_VIRTUE[choice.statReq.key] || SP_STAT_DEFS[choice.statReq.key]?.nm || choice.statReq.key;
      sentence = clause
        ? `{subject_cap} ${clause} — {possessive} ${virtue} deed de rest.`
        : `{subject_cap} zette {possessive} ${virtue} in: ${spLowerFirst(label)}${spSentenceEnd(label)}`;
    } else {
      sentence = clause
        ? `{subject_cap} liet zich leiden naar een nieuw verhaal en ${clause} — de andere lijnen van dit hoofdstuk wachtten intussen nog op {possessive} terugkeer.`
        : `{subject_cap} liet zich leiden naar een nieuw verhaal: ${spLowerFirst(label)}${spSentenceEnd(label)} De andere lijnen van dit hoofdstuk wachtten intussen nog op {possessive} terugkeer.`;
    }
    spKroniekLog(SpTextResolver.resolve(sentence, SP_STATE));
  }
  spChoosePath(target, approach);
}
// Logt een handgeschreven vertakking uit SP_KRONIEK_FORKS (singleplayer-
// data.js): de volle Kleio-zin van de gekozen tak, gevolgd door een korte
// "de andere wegen vervaagden"-zin opgebouwd uit de `kort`-samenvattingen
// van de NIET gekozen takken in diezelfde scène. Geeft false terug als deze
// scène (nog) geen handgeschreven entry heeft — spChooseAndLog valt dan
// terug op de generieke Kleio-zin.
function spKroniekForkLog(sceneId, target){
  const fork = SP_KRONIEK_FORKS[sceneId];
  if(!fork || !fork[target]) return false;
  const chosen = fork[target];
  // skipTail/excludeFromTail (Chronica.md's taalspoor-hub CH10_000 is de reden
  // hiervoor): "Beide" is geen afgewezen pad naast Grieks/Latijn — er is dan
  // niets om te laten vervagen, dus geen auto-staart bij zo'n keuze, én zo'n
  // keuze telt zelf ook niet mee als "achtergelaten" optie bij de ANDERE twee.
  let tail = "";
  if(!chosen.skipTail){
    const others = Object.entries(fork).filter(([t,o])=>t!==target && !o.excludeFromTail).map(([,o])=>o.kort);
    if(others.length===1) tail = ` De weg naar ${others[0]} vervaagde intussen verder.`;
    else if(others.length>1) tail = ` De wegen naar ${others.slice(0,-1).join(", ")} en ${others[others.length-1]} vervaagden intussen verder.`;
  }
  spKroniekLog(SpTextResolver.resolve(chosen.tekst+tail, SP_STATE));
  return true;
}
// Gender-neutrale omschrijving van de gekozen Clementia/Severitas/Neutraal-
// houding zelf (los van SP_TENDENCY_PHRASES, dat is de opgebouwde TREND over
// meerdere keuzes heen — dit is de eenmalige klik van nu, voor de Kroniek).
const SP_APPROACH_DESC = {
  CLEMENTIA: "liet {possessive} mededogen spreken",
  SEVERITAS: "koos de harde, eerlijke weg",
  NEUTRAL:   "hield het hoofd koel",
};
// Clementia/Severitas-keuzes (Chronica.md §8/§17) hebben al een handgeschreven
// REACTION: per scène (spSceneReaction, hierboven) — de NPC-reactie die ook al
// als toast verschijnt. Die tekst is precies het materiaal dat Gerben bedoelt
// met "iets dat diegene lang zou onthouden" (2026-08-18), dus hier hergebruikt
// i.p.v. apart voor de Kroniek herschreven: geen nieuw handwerk per scène nodig,
// dit dekt automatisch ALLE approach-keuzes in de hele campagne.
// Zie SpTextResolver.lookup "fin_her_mens" hierboven: geeft "NAAM, die {p}
// onderweg had geholpen" terug voor de NPC met de hoogste opgebouwde
// RELATION-score, of een naamloze variant als er nooit een RELATION werd
// opgebouwd (bv. een heel korte speeltest) — SP_CODEX_PERSONS kan in
// theorie ook een NPC zonder eigen entry bevatten (zou niet moeten
// voorkomen, maar dan liever alsnog de naamloze variant dan "undefined").
function spKleioFinHerMens(state){
  const p = SP_PRONOUNS[state.gender] || SP_PRONOUNS.man;
  const rel = state.relations || {};
  // Niet elke RELATION-getagde NPC (vooral kleinere, latere personages) heeft
  // een eigen SP_CODEX_PERSONS-entry — dus niet stoppen bij de hoogste score
  // als die geen naam oplevert, maar de score-gesorteerde lijst aflopen tot
  // een NPC MET naam gevonden wordt (of de lijst op is).
  const sorted = Object.entries(rel)
    .map(([id,v])=>[id, v?.score||0])
    .filter(([,score])=>score>0)
    .sort((a,b)=>b[1]-a[1]);
  let nm = null;
  for(const [id] of sorted){ nm = SP_CODEX_PERSONS[id]?.nm; if(nm) break; }
  return nm ? `de mens ${nm}, die ${p.subj} onderweg had geholpen` : `een mens die ${p.subj} onderweg had geholpen`;
}
function spKroniekApproachLog(scene, choice){
  const reaction = spSceneReaction(scene, choice.approach);
  const desc = SP_APPROACH_DESC[choice.approach] || "maakte een keuze";
  const sentence = reaction
    ? `{subject_cap} ${desc} tegenover ${reaction.nm}. ${reaction.text} — een moment dat ${reaction.nm} niet snel zou vergeten.`
    : `{subject_cap} ${desc}.`;
  spKroniekLog(SpTextResolver.resolve(sentence, SP_STATE));
}
// Scènes waar spHookReward (of een vergelijkbare hook) al een volledige,
// handgeschreven Kroniek-regel logt zodra de VOLGENDE scène laadt (bv. PRO_003,
// de klassekeuze — zie SP_KRONIEK_KLASSE) — de klik op PRO_003 zelf mag dus
// geen tweede, generieke regel toevoegen. Uitbreidbaar met 1 regel per geval.
const SP_KRONIEK_SKIP = new Set(["PRO_003"]);
// Voor gewone (ongetagde) vertakkingen: elke scène met 2+ zichtbare keuzes
// is een echte beslissing en verdient een Kroniek-regel, ook zonder DONE/
// STAT-tag (spChooseTrackedPath hierboven blijft voorbehouden aan díe twee
// gevallen). Approach-keuzes (Clementia/Severitas/Neutraal) gaan via
// spKroniekApproachLog; een handgeschreven entry in SP_KRONIEK_FORKS krijgt
// anders voorrang; zonder zo'n entry valt dit terug op een korte, generieke
// Kleio-zin (spKleioClause) — bewust geen "wat je achterliet"-zin in de
// generieke variant, want zonder samenvattingen van de zusterkeuzes zou dat
// alleen de rauwe knoptekst van de andere opties herhalen.
function spChooseAndLog(target, approach){
  const scene = SP_SCENES.get(SP_STATE.node);
  // Approach-keuzes (Clementia/Severitas/Neutraal) delen vaak hetzelfde
  // target (alle drie -> dezelfde vervolgscène) — puur op target zoeken zou
  // dan altijd de EERSTE van de drie treffen, ongeacht welke knop de speler
  // echt indrukte. Eerst op target+approach matchen, met (c.approach||"")
  // omdat untagged keuzes c.approach=null hebben tegenover approach="".
  const choice = scene?.choices.find(c=>c.target===target && (c.approach||"")===(approach||""))
    || scene?.choices.find(c=>c.target===target);
  if(scene && choice && !SP_KRONIEK_SKIP.has(SP_STATE.node) && scene.choices.filter(spChoiceVisible).length>1){
    if(choice.approach){
      spKroniekApproachLog(scene, choice);
    } else if(!spKroniekForkLog(SP_STATE.node, target)){
      const label = SpTextResolver.resolve(choice.label, SP_STATE);
      // Sommige REQUIRE-gated keuzes (bv. CH29_GRE_001, de Sicilië-echo) zijn
      // pure vlag-routing zonder eigen knoptekst — geen bewuste beslissing
      // van de speler, dus niets om te loggen (i.p.v. de kale "koos zij: ."
      // die hier anders van zou overblijven).
      if(!label.trim()) return spChoosePath(target, approach);
      const clause = spKleioClause(label);
      const sentence = clause
        ? `{subject_cap} ${clause}.`
        : spKleioLabelFallback(scene, label);
      spKroniekLog(SpTextResolver.resolve(sentence, SP_STATE));
    }
  }
  spChoosePath(target, approach);
}
// Klik op een reeds voltooide [DONE]-keuze (zie spPlay/CNSParser): navigeert
// bewust NIET — enkel een korte, Orakel-achtige herinnering hoeveel lijnen
// in dit hoofdstuk nog open staan.
function spChoiceAlreadyDone(openCount){
  toast("Deze herinnering ken je al",
    openCount>0
      ? `Er ${openCount===1?"wacht":"wachten"} nog ${openCount} ${openCount===1?"verhaal":"verhalen"} op je hulp.`
      : "Alle verhalen van dit hoofdstuk zijn al voltooid.");
}
// Bepaalt of een keuze met een [REQUIRE:sleutel=waarde]-tag getoond mag
// worden (CNSParser.REQUIRE_TAG_RE). "fragments" (Hoofdstuk 2: de weg naar
// het Orakel opent pas met alle 4 Herinneringsfragmenten binnen) en
// "taalspoor" (Hoofdstuk 10, B24: FLAG taalspoor=latijn/grieks/beide,
// gezet op CH10_000B/C — de Odysseus/Aeneas-hubkeuzes verbergen zichzelf
// zodra de speler één spoor koos; standaard "beide" houdt beide zichtbaar).
function spChoiceVisible(c){
  if(!c.require) return true;
  if(c.require.key==="fragments") return (SP_STATE.fragments||[]).length >= c.require.value;
  if(c.require.key==="taalspoor"){
    const spoor = SP_STATE.flags?.taalspoor || "beide";
    return c.require.op==="!=" ? spoor !== c.require.value : spoor === c.require.value;
  }
  // Generieke FLAG-check (bv. REQUIRE:ch1_lijn=B, Hoofdstuk 13) — elke
  // andere sleutel dan de hierboven apart afgehandelde "fragments"/
  // "taalspoor" wordt gelezen uit SP_STATE.flags zelf. CNSParser.
  // parseChoices() verlaagt woord-waarden altijd naar kleine letters (zie
  // REQUIRE_TAG_RE-verwerking), maar FLAG-waarden die elders in dit
  // bestand worden gezet zijn niet per se lowercase (bv. ch1_lijn=A/B/C)
  // — vandaar hier ook lowercase vergelijken, anders matcht [REQUIRE:
  // ch1_lijn=B] nooit met een daadwerkelijk gezette hoofdletter-waarde.
  const actual = SP_STATE.flags?.[c.require.key];
  const actualNorm = typeof actual === "string" ? actual.toLowerCase() : actual;
  return c.require.op==="!=" ? actualNorm !== c.require.value : actualNorm === c.require.value;
}
// Gated choice (Chronica.md §11.4, CNSParser.STAT_TAG_RE): WEL altijd
// zichtbaar (dus geen rol voor spChoiceVisible hierboven), alleen klikbaar
// zodra de stat hoog genoeg is. spChoiceVisible blijft dus puur voor
// REQUIRE (verbergen); statReq-gating gebeurt in de renderer zelf.
function spStatReqMet(statReq){
  if(!statReq) return true;
  const val = (SP_STATE.stats && SP_STATE.stats[statReq.key]) || 0;
  return val >= statReq.value;
}

/* ---- PAYOFF-LAAG (Chronica.md §12, "delayed consequences") — het losse
   `FLAG:`-geheugen van het spel (~100+ write-only vlaggen tot nu toe) krijgt
   hiermee een generieke manier om zichzelf hoofdstukken later terug te laten
   komen, zonder dat de scène die het toont ook maar iets van de geschiedenis
   hoeft te weten. SP_PAYOFFS (singleplayer-data.js) is een platte lijst van
   regels; deze functies evalueren en passen ze toe.

   Drie types (zie spec): "echo" (extra tekstalinea, sfeer), "deur" (extra
   keuzeknop die alleen verschijnt als de conditie klopt) en "kantelpunt"
   (stille wereldstaat-wijziging via content.setFlags, met optioneel ook
   eigen tekst). Elke payoff-regel vuurt hooguit ÉÉN keer per saveslot,
   bijgehouden in SP_STATE.payoffsSeen — ook als de triggerscène later
   opnieuw wordt bezocht (bv. via een hub-terugkeer).

   Condities zijn bewust declaratief (geen losse JS-functies in de data),
   zodat een toekomstige auteurscontrole (Deel 1.6 van de spec: "flags die
   nergens uitgelezen worden, payoffs met een onbereikbare conditie") de
   lijst statisch kan doorlopen: { flags:{sleutel:waarde}, flagsSet:[...],
   flagsNotSet:[...] } — alle drie optioneel, alle drie moeten kloppen. */
function spPayoffConditionMet(cond){
  if(!cond) return true;
  const flags = SP_STATE.flags||{};
  if(cond.flags) for(const k in cond.flags) if(flags[k]!==cond.flags[k]) return false;
  if(cond.flagsSet) for(const k of cond.flagsSet) if(!flags[k]) return false;
  if(cond.flagsNotSet) for(const k of cond.flagsNotSet) if(flags[k]) return false;
  const relations = SP_STATE.relations||{};
  if(cond.relationMin) for(const npc in cond.relationMin) if((relations[npc]?.score||0) < cond.relationMin[npc]) return false;
  if(cond.relationMax) for(const npc in cond.relationMax) if((relations[npc]?.score||0) > cond.relationMax[npc]) return false;
  return true;
}
// Wordt exact één keer per scènebezoek aangeroepen, ná spRunMetaHooks (dus
// een payoff mag reageren op een FLAG: die dezelfde scène net zelf zette).
// Markeert alle geactiveerde payoffs meteen als gezien en past kantelpunt-
// wereldstaatwijzigingen toe — dat gebeurt dus ook als de speler de
// echo-tekst/deur-knop nooit echt bekijkt, consistent met "elke payoff vuurt
// hooguit één keer".
function spResolvePayoffs(sceneId){
  const seen = SP_STATE.payoffsSeen||{};
  const active = SP_PAYOFFS
    .filter(p => p.trigger.scene===sceneId && !seen[p.id] && spPayoffConditionMet(p.condition))
    .sort((a,b) => (b.priority||0)-(a.priority||0));
  if(!active.length) return { echoHTML:"", doorChoices:[] };
  const newSeen = {...seen};
  let flags = SP_STATE.flags;
  let flagsChanged = false;
  const echoParts = [];
  const doorChoices = [];
  const kroniek = [...(SP_STATE.kroniek||[])];
  const hoofdstuk = spChapterLabel(sceneId);
  active.forEach(p=>{
    newSeen[p.id] = true;
    if(p.content.setFlags){ flags = {...flags, ...p.content.setFlags}; flagsChanged = true; }
    if(p.content.text){
      const resolved = SpTextResolver.resolve(p.content.text, SP_STATE);
      echoParts.push(`<p style="font-style:italic">${esc(resolved)}</p>`);
      // De in-verhaal echo (content.text) blijft in de 2e persoon, zelfde stem
      // als de omringende scène — de Kroniek krijgt een apart, hand-geschreven
      // kroniekTekst in Kleio's 3e-persoon-stem (Gerben, 2026-08-19). Zonder
      // kroniekTekst (zou niet meer moeten voorkomen, alle 38 zijn geschreven)
      // valt dit terug op de rauwe echo i.p.v. een payoff stil te laten.
      const kroniekResolved = p.content.kroniekTekst ? SpTextResolver.resolve(p.content.kroniekTekst, SP_STATE) : resolved;
      kroniek.push({ hoofdstuk, tekst:kroniekResolved, t:Date.now() });
    }
    if(p.type==="deur" && p.content.choice){
      doorChoices.push(p.content.choice);
      const deurTekst = p.content.kroniekTekst
        ? SpTextResolver.resolve(p.content.kroniekTekst, SP_STATE)
        : `Een eerdere keuze opende een nieuwe weg: ${SpTextResolver.resolve(p.content.choice.label, SP_STATE)}.`;
      kroniek.push({ hoofdstuk, tekst:deurTekst, t:Date.now() });
    }
  });
  const patch = { payoffsSeen: newSeen, kroniek };
  if(flagsChanged) patch.flags = flags;
  spSaveProgress(patch);
  return { echoHTML: echoParts.join(""), doorChoices };
}

/* ---- SCÈNE-RENDERER ---- */
SCREENS.spPlay = function(){
  document.body.classList.remove("greek");
  if(!SP_ACTIVE_SLOT || !SP_STATE.node){ go("singlePlayer"); return; }
  const scene = SP_SCENES.get(SP_STATE.node);
  if(!scene){ go("singlePlayer"); return; }

  spRunMetaHooks(scene.meta);
  spHookSeenImage(scene);
  spKroniekFinaleEindeLog(SP_STATE.node);

  if(scene.meta.PUZZLE) return spRenderPuzzle(scene);
  if(scene.meta.COMBAT) return spStartCombatFromScene(scene);
  if(scene.meta.CHECK) return spStartCheckFromScene(scene);
  if(scene.meta.RACE) return spStartRaceFromScene(scene);

  const payoffs = spResolvePayoffs(SP_STATE.node);
  // Deze scènetekst stond al op het worp-resultaatscherm (spStartCheckFromScene)
  // — niet meteen nogmaals tonen, één keer overslaan en de vlag resetten.
  const skipText = SP_CHECK_JUST_NARRATED === SP_STATE.node;
  SP_CHECK_JUST_NARRATED = null;
  const titleHTML = scene.title ? `<h3>${esc(SpTextResolver.resolve(scene.title, SP_STATE))}</h3>` : "";
  const textHTML = (skipText ? "" : spParagraphsHTML(scene.text, SP_STATE)) + payoffs.echoHTML;
  const dialogueHTML = scene.dialogue ? `
    <div class="panel">
      <div class="eyebrow l">${esc(SpTextResolver.resolve(scene.dialogue.speaker, SP_STATE))}</div>
      <p>“${spGlossHTML(SpTextResolver.resolve(scene.dialogue.text, SP_STATE))}”</p>
    </div>` : "";
  // Bij een Clementia/Severitas/Neutraal-keuzeset wordt de volgorde bij elk
  // bezoek opnieuw geschud (shuffle, core.js) — anders zou de vaste volgorde
  // in de CNS-brontekst zelf al verklappen welke knop welke kant op telt.
  let visibleChoices = scene.choices.filter(spChoiceVisible);
  if(visibleChoices.some(c=>c.approach)) visibleChoices = shuffle(visibleChoices);
  // [DONE:vlag]-keuzes (zie CNSParser) tonen een ✓ zodra die lijn al is
  // afgerond, en een klik erop navigeert niet meer naar de lijn zelf — dat
  // zou hem gewoon opnieuw starten, met alle Clementia/Severitas-punten van
  // dien. In plaats daarvan alleen een korte herinnering hoeveel lijnen nog
  // open staan (spChoiceAlreadyDone), berekend uit dezelfde [DONE]-keuzes op
  // dit scherm — geen aparte telling ergens anders bijhouden.
  const doneChoices = visibleChoices.filter(c=>c.done);
  const openCount = doneChoices.filter(c=>!SP_STATE.flags[c.done]).length;
  const choicesHTML = visibleChoices.length
    ? visibleChoices.map(c=>{
        const isDone = c.done && SP_STATE.flags[c.done];
        let label = esc(SpTextResolver.resolve(c.label, SP_STATE)) + (isDone?" ✓":"");
        if(c.statReq){
          const def = SP_STAT_DEFS[c.statReq.key];
          const have = (SP_STATE.stats && SP_STATE.stats[c.statReq.key]) || 0;
          label += ` <span style="opacity:.75;font-size:12px">(${esc(def?def.nm:c.statReq.key)} ${c.statReq.value} — jij hebt ${have})</span>`;
        }
        // Gated choice die (nog) niet gehaald wordt: WEL tonen (zie
        // spStatReqMet hierboven), grijs en onklikbaar — nooit verbergen,
        // dat is precies het punt van deze mechaniek (§11.4).
        if(c.statReq && !spStatReqMet(c.statReq)){
          return `<button class="btn btn-ghost btn-block lg" style="margin-top:8px;opacity:.5;cursor:not-allowed" disabled title="Je skills zijn hiervoor nog te laag">${label}</button>`;
        }
        const onclick = isDone ? `spChoiceAlreadyDone(${openCount})`
          : (c.statReq||c.done) ? `spChooseTrackedPath('${c.target}','${c.approach||""}')`
          : visibleChoices.length>1 ? `spChooseAndLog('${c.target}','${c.approach||""}')`
          : `spChoosePath('${c.target}','${c.approach||""}')`;
        return `<button class="btn ${isDone?"":"btn-gold "}btn-block lg" style="margin-top:8px${isDone?";opacity:.6":""}" onclick="${onclick}">${label}</button>`;
      }).join("")
    : `<button class="btn btn-ghost btn-block lg" onclick="go('spSlots')">Terug naar de opslagplekken</button>`;
  // "Deur"-payoffs (Chronica.md §12): een extra keuze die alleen verschijnt
  // omdat een eerdere, hoofdstukken geleden gemaakte keuze dat nu toelaat —
  // los van scene.choices zelf, dus geen CNS-wijziging nodig om dit te tonen.
  const doorChoicesHTML = payoffs.doorChoices.map(c=>
    `<button class="btn btn-gold btn-block lg" style="margin-top:8px" onclick="spGoCns('${c.target}')">${esc(SpTextResolver.resolve(c.label, SP_STATE))} ✦</button>`
  ).join("");

  H(brand(true)+`
  <div class="scrhead">${spBackToMenuButtonHTML()}<h2>Chronica Classica</h2>${spAudioToggleHTML()}</div>
  <div class="panel">${spSceneImageHTML(scene)}${spChapterEyebrowHTML()}${titleHTML}${textHTML}</div>
  ${dialogueHTML}
  ${choicesHTML}
  ${doorChoicesHTML}
  ${foot()}`);
};

/* ---- META-HOOKS: REWARD/CODEX/QUEST vuren stil bij binnenkomst; IMAGE is nog
   een no-op (illustraties volgen later); PUZZLE wordt apart afgehandeld in
   spRenderPuzzle() omdat die de voortgang moet blokkeren i.p.v. alleen te loggen. ---- */
function spRunMetaHooks(meta){
  if(meta.REWARD)    spHookReward(meta.REWARD);
  if(meta.STATPOINTS) spHookStatpoints(meta.STATPOINTS);
  if(meta.CODEX)     spHookCodex(meta.CODEX);
  if(meta.QUEST)     spHookQuest(meta.QUEST);
  if(meta.EERETITEL) spAwardTitle(meta.EERETITEL.trim());
  if(meta.FLAG)      spHookFlag(meta.FLAG);
  if(meta.RELATION)  spHookRelation(meta.RELATION);
  if(meta.MUSIC)     spPlayMusic(meta.MUSIC.trim());
  if(meta.PERSON)    spHookPerson(meta.PERSON);
  if(meta.VOCAB)     spHookVocab(meta.VOCAB);
  if(meta.FRAGMENT)  spHookFragment(meta.FRAGMENT);
  if(meta.SOUVENIR)  spHookSouvenir(meta.SOUVENIR);
  if(meta.INVENTORY) spHookInventory(meta.INVENTORY);
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
let SP_MUSIC_WAS_PLAYING = false;
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
/* ---- "TERUG NAAR MENU" — vastgelegd 2026-07: vóór deze knop kon een speler
   een verhaal alleen verlaten door het hoofdstuk af te ronden of Chronica
   Classica helemaal af te sluiten. Staat nu op ELK scherm tijdens het
   verhaal (gewone scènes, alle zes de puzzeltypes, het gevecht) en
   navigeert naar spRenderLanding() — het per-slot tussenscherm met
   Verdergaan/Wereldkaart/Codex Memoriae, van waaruit de opslagplekken-lijst
   (spSlots) ook meteen weer één klik terug is. Voortgang zelf gaat nooit
   verloren: spSaveProgress() heeft SP_STATE.node al bijgewerkt zodra de
   speler de huidige scène binnenkwam, dus "Verdergaan" hervat precies waar
   je was. Een lopend gevecht (SP_COMBAT) is bewust NIET session-persistent
   (zie de toelichting bij SP_COMBAT_ENEMIES) — verlaat je een gevecht via
   deze knop, dan begin je het bij terugkeer gewoon opnieuw, net als wanneer
   je de app halverwege zou sluiten. ---- */
function spBackToMenuButtonHTML(){
  return `<button class="back" title="Terug naar menu" aria-label="Terug naar menu" onclick="spRenderLanding()">${iconSVG("shield",20,"currentColor")}</button>`;
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
// Leerlingopmerking (2026-08-13): muziek bleef gewoon doorspelen als het
// scherm op standby ging — pauzeer daarom bij het onzichtbaar worden van het
// tabblad/scherm (Page Visibility API), en hervat alleen als er ook echt iets
// speelde (niet als de speler zelf al gepauzeerd/gemute had) zodra het scherm
// weer aan staat.
document.addEventListener("visibilitychange", function(){
  if(!SP_MUSIC_EL) return;
  if(document.hidden){
    SP_MUSIC_WAS_PLAYING = !SP_MUSIC_EL.paused;
    SP_MUSIC_EL.pause();
  } else if(SP_MUSIC_WAS_PLAYING && !spAudioMuted()){
    SP_MUSIC_EL.play().catch(()=>{});
  }
});
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
// Relaties (Chronica.md §12, Deel 1.2c van de spec): een `RELATION:`-sectie
// verschuift de score van een NPC met een DELTA (nooit een directe
// toekenning — "een enkele keuze verschuift meestal 1 of 2 punten"),
// geklemd op -5..+5. Formaat: `npc=+1` of meerdere gescheiden door `;`/regel,
// zelfde stijl als FLAG:. Wat een NPC "weet" (Deel 1.2c's tweede helft) is
// bewust GEEN apart mechanisme — dat zijn gewoon gewone `FLAG:`s met een
// naamgevingsafspraak (bv. `dido_zag_vertrek`), de bestaande payoff-conditie
// (`flags`/`flagsSet`) kan die al lezen.
function spHookRelation(text){
  const relations = {...(SP_STATE.relations||{})};
  text.split(/[\n;]/).forEach(part=>{
    part = part.trim(); if(!part) return;
    const eq = part.indexOf("=");
    if(eq===-1) return;
    const npc = part.slice(0,eq).trim();
    const delta = parseInt(part.slice(eq+1).trim(), 10);
    if(!npc || !delta) return;
    const current = relations[npc]?.score || 0;
    relations[npc] = { ...(relations[npc]||{}), score: Math.max(-5, Math.min(5, current+delta)) };
  });
  spSaveProgress({ relations });
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
/* ---- HERINNERINGEN/SOUVENIRS — los van de Herinneringsfragmenten hierboven
   (die zijn onzichtbare hoofdstuk-gates): dit zijn de TASTBARE voorwerpen die
   de speler uit elk afgerond verhaal meeneemt, zichtbaar in de nieuwe
   "Herinneringen"-tab van de Codex (spCodexSouvenirsHTML). Zelfde
   comma/puntkomma/regel-gescheiden parsing als spHookCodex, al draagt in de
   praktijk elke scène er maar één op. ---- */
/* ---- INVENTORY: — eenmalige gevechtsitems die je in het verhaal vindt
   (COMBAT_OVERHAUL.md voorstel G). De sectie werd sinds de bouw van de
   CNS-parser al herkend en opgeslagen, maar deed niets; dit is de hook die
   hem eindelijk uitleest. Onbekende id's worden stil overgeslagen, zodat een
   toekomstige INVENTORY: zonder bijbehorende SP_COMBAT_ITEMS-entry nooit een
   scène kan breken. ---- */
function spHookInventory(text){
  const ids = text.split(/[\n,;]/).map(s=>s.trim()).filter(Boolean).filter(id=>SP_COMBAT_ITEMS[id]);
  const existing = SP_STATE.inventory||[];
  const fresh = ids.filter(id=>!existing.includes(id));
  if(!fresh.length) return;
  spSaveProgress({ inventory:[...existing, ...fresh] });
  fresh.forEach(id=>{
    const def = SP_COMBAT_ITEMS[id];
    toast("In je bagage", `${def.icon} ${def.nm} — ${def.ds}`);
  });
}
function spHookSouvenir(text){
  const ids = text.split(/[\n,;]/).map(s=>s.trim()).filter(Boolean);
  const existing = SP_STATE.souvenirs||[];
  const fresh = ids.filter(id=>!existing.includes(id));
  if(!fresh.length) return;
  spSaveProgress({ souvenirs:[...existing, ...fresh] });
  fresh.forEach(id=>{
    const def = SP_SOUVENIRS[id];
    toast("Herinnering verzameld!", def ? `${def.icon||"🏛️"} ${def.nm}` : id);
  });
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
// Finale-only (Chronica.md §7.101): de RUWE clementia/severitas-tendens
// (spApproachTendency) kent geen sterkte, alleen een richting — de Finale
// heeft vijf eindes nodig (neutraal/medium/hoog × clementia/severitas), dus
// hier één keer, uitsluitend bij binnenkomst in FIN_KEUZE_000 (zie spGoCns),
// de verhouding wegen: hoe groter het aandeel van de overheersende kant in
// het totaal aantal getagde keuzes, hoe "hoger" de tier.
function spComputeTendencyTier(state){
  const a = (state||SP_STATE).approach||{clementia:0,severitas:0};
  const total = a.clementia + a.severitas;
  if(!total || a.clementia===a.severitas) return "neutraal";
  const winning = a.clementia>a.severitas ? "clementia" : "severitas";
  const ratio = Math.abs(a.clementia - a.severitas) / total;
  return winning + "_" + (ratio >= 0.6 ? "hoog" : "medium");
}
// RELATION-woordvoerder per cluster (Chronica.md §7.101): niet de ruwe
// hoogste relatiescore (die bevoordeelt structureel NPC's met veel
// touchpoints, zoals Cicero met 8 momenten, boven eenmalige zwaargewichten
// als Cleopatra) — in plaats daarvan het GEMIDDELDE per gelegenheid
// (score/touchpoints), met een ondergrens van 2 touchpoints om mee te
// tellen, en bij gelijke stand de ruwe hoogste score als tiebreak. Alleen
// NPC's die de gewone SP_ENDKAPITAAL_THRESHOLD halen komen in aanmerking.
function spFinaleSpokesperson(clusterKey, state){
  const cluster = SP_FINALE_CLUSTERS[clusterKey];
  if(!cluster) return null;
  const rel = (state||SP_STATE).relations || {};
  const T = SP_ENDKAPITAAL_THRESHOLD;
  const eligible = cluster.npcs.filter(n => n.t>=2 && (rel[n.id]||0) >= T);
  if(!eligible.length) return null;
  let best=null, bestAvg=-Infinity;
  for(const n of eligible){
    const score = rel[n.id]||0;
    const avg = score/n.t;
    const bestScore = best ? (rel[best.id]||0) : -Infinity;
    if(avg>bestAvg || (avg===bestAvg && score>bestScore)){ best=n; bestAvg=avg; }
  }
  return best.id;
}
// Resterende open "dode flags" (DODE_FLAGS_FINALE.md, Categorie 8-10 —
// alles wat H28/29 niet al hebben afbetaald): elke speler heeft alleen de
// flags van zijn eigen taalspoor gezet, dus dit bouwt de zin dynamisch op
// uit alleen de aanwezige flags — zelfde patroon als
// spNpcAfsluitingenBeschikbaar hierboven, geen voorwaardelijke formulering
// in de brontekst zelf.
function spFinaleDodeFlagsCredit(state){
  const flags = state.flags || {};
  const items = SP_FINALE_DODE_FLAGS_CREDITS.filter(d => flags[d.flag] === d.value);
  if(!items.length) return SP_FINALE_DODE_FLAGS_FALLBACK;
  return spDutchJoin(items.map(d=>d.tekst)) + ".";
}
// Losse epiloog (Chronica.md §7.102, op Gerbens verzoek): een puur
// doorklik-gedeelte ná de overwinning op Lethe dat de grootste keuzes uit de
// hele campagne terugleest, met de Lethe-uitkomst zelf als startpunt.
// spFinaleEpiloogLethe leest fin_tendency (hoofdtoon) + fin_einde_variant
// (nuance) — SP_FIN_EPILOOG_LETHE (singleplayer-data.js) is een geneste
// lookup, geen los geval per combinatie.
function spFinaleEpiloogLethe(state){
  const tier = state.flags?.fin_tendency;
  const variant = state.flags?.fin_einde_variant;
  const table = SP_FIN_EPILOOG_LETHE[tier];
  if(!table) return SP_FIN_EPILOOG_FALLBACK;
  return table[variant] || Object.values(table)[0] || SP_FIN_EPILOOG_FALLBACK;
}
// Combineert twee of meer los-uitgelezen politieke-zijde-keuzes tot één
// alinea — slaat een flag stilzwijgend over als de speler die kant nooit
// speelde (bv. een Latijn-only speler heeft geen ch19_gre_zijde), zodat
// dezelfde scène voor elk taalspoor werkt zonder REQUIRE-vertakking nodig
// te hebben binnen de alinea zelf.
function spFinaleEpiloogPolitiek(state, tables){
  const parts = [];
  for(const [table, flagKey] of tables){
    const val = state.flags?.[flagKey];
    if(val && table[val]) parts.push(table[val]);
  }
  return parts.length ? parts.join(" ") : SP_FIN_EPILOOG_FALLBACK;
}
function spFinaleClusterCreditText(clusterKey, state){
  const cluster = SP_FINALE_CLUSTERS[clusterKey];
  if(!cluster) return "";
  const id = spFinaleSpokesperson(clusterKey, state);
  if(!id) return cluster.fallback;
  return cluster.lines[id] || cluster.fallback;
}
// Voedt spFinaleLetheHp (0-100): 60% weegt hoeveel resterende "dode
// flags"-credits de speler daadwerkelijk heeft opgebouwd (max 8 — zie
// SP_FINALE_DODE_FLAGS_CREDITS, bestuursidee/route tellen elk maar 1x mee
// ondanks hun 3/2 varianten), 40% hoeveel van de drie RELATION-clusters een
// geldige woordvoerder heeft.
function spFinaleHerinneringScore(state){
  const flags = state.flags || {};
  const doneCredits = SP_FINALE_DODE_FLAGS_CREDITS.filter(d => flags[d.flag]===d.value).length;
  const clusterCoverage = Object.keys(SP_FINALE_CLUSTERS).filter(k => spFinaleSpokesperson(k, state)).length;
  return Math.round(Math.min(1, doneCredits/8)*60 + (clusterCoverage/3)*40);
}

/* Illustratie bij een scène: de IMAGE-sectie is een bestandsnaam relatief aan
   assets/chronica/images/. Ontbreekt het bestand, dan verbergt de <img> zich
   stil (onerror) — zo kunnen auteurs alvast naar nog-te-maken illustraties
   verwijzen zonder een gebroken-plaatje-icoon. */
// Sinds de Finale-epiloog (Chronica.md §7.103): IMAGE ondersteunt nu
// dezelfde {token}-syntax als TEXT (via SpTextResolver), zodat één scène
// een ander plaatje kan tonen afhankelijk van de opgebouwde staat (bv.
// welk van de vijf eindes, of welke zijde-keuze) — zonder de scène zelf te
// hoeven splitsen. Een gewone, letterlijke bestandsnaam werkt nog altijd
// ongewijzigd (geen `{...}` erin, dus niets om te resolven).
function spSceneImageHTML(scene){
  if(!scene.meta || !scene.meta.IMAGE) return "";
  const filename = SpTextResolver.resolve(scene.meta.IMAGE.trim(), SP_STATE);
  if(!filename) return "";
  const src = "assets/chronica/images/"+filename;
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
  // FIN_-nodes (de Finale) misten dit tot 2026-08-18 — elke Kroniek-regel
  // die daar gelogd werd groepeerde stilletjes onder een lege "—"-kop
  // (spCodexKroniekHTML) i.p.v. onder een herkenbare Finale-titel.
  if(node.indexOf("FIN_")===0) return SP_CAMPAIGN.find(c=>c.type==="finale")?.nm || "Finale";
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
  // Stats (Chronica.md §11.2) horen bij dezelfde klassekeuze als traits/classId
  // hierboven, maar worden alleen bij de EERSTE keuze gezet — een latere
  // REWARD (zou nu niet voorkomen) mag een al gegroeid statblok niet overschrijven.
  const stats = (isNew && SP_CLASS_STATS[classId]) ? {...SP_CLASS_STATS[classId]} : SP_STATE.stats;
  // B14 (Chronica-audit): classId zelf staat al in SP_STATE, maar dat kan
  // spPayoffConditionMet() niet toetsen (die leest uitsluitend flags/relations,
  // zie singleplayer.js). Eén simpele flag maakt de wapenkeuze ook bruikbaar
  // als payoff-conditie, zonder classId zelf ergens dubbel te hoeven opslaan.
  const flags = isNew ? {...(SP_STATE.flags||{}), wapen_gekozen:classId} : SP_STATE.flags;
  spSaveProgress({ classId, traits, stats, flags });
  if(isNew){
    toast("Wapen gekozen!", BM_IDENT
      ? "Je pad is bepaald. Dit wapen zal je overal vergezellen waar je nog terechtkomt."
      : "Je pad is bepaald. Log in met je klascode om dit wapen ook buiten dit verhaal te laten meetellen.");
    spKroniekLog(SpTextResolver.resolve(SP_KRONIEK_KLASSE[classId] || `Bij het Orakel van Chronos koos {subject} {possessive} pad: ${fields.class}.`, SP_STATE));
  }
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
  toast("Nieuwe bladzijde","Er is een nieuwe bladzijde toegevoegd aan de Codex Memoriae.");
}
// Skillpoints (Chronica.md §11.3): een STATPOINTS:-sectie op de EINDE-scène
// van een hoofdstuk kent basispunten toe (nu een vaste 3 — de bonuspunten
// uit gedrag volgen pas zodra Stap 5 echte gated choices oplevert om te
// tellen). Reset ook de per-hoofdstuk +2-cap (statSpentSinceAward), want een
// nieuw hoofdstuk is een nieuw investeringsmoment.
function spHookStatpoints(text){
  const n = parseInt(text.trim(),10);
  if(!n) return;
  const total = (SP_STATE.skillpoints||0) + n;
  spSaveProgress({ skillpoints: total, statSpentSinceAward:{} });
  toast("Je bent gegroeid", `Je voelt ${n===1?"een nieuwe kracht":""+n+" nieuwe krachten"} in jezelf ontwaken — verdeel ${n===1?"hem":"ze"} bij je Karakter Informatie.`);
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
                               (spNormalizeGreek).
   - "tile-swap"             : SCHUIFPUZZEL, sinds Hoofdstuk 5 (zie Chronica.md
                               §7.10). GEEN klassieke 15-puzzel met blanco
                               vakje en slepen — dat is op een iPad onbetrouwbaar
                               (drag-detectie, per ongeluk scrollen) en de
                               bestaande regel "zichtbare labels, nooit
                               display:none+click()" vraagt om iets even
                               betrouwbaars als de andere knop-gebaseerde
                               puzzels. In plaats daarvan: tik een tegel om 'm
                               te selecteren, tik een tweede tegel om ze te
                               verwisselen — net zo'n simpel, groot (≥44px)
                               knop-gebaar als de rest van de puzzels. puzzle =
                               { type:"tile-swap", vraag, tiles:[...juiste
                               volgorde...], hint? }. De tegels worden geschud
                               bij de eerste render van deze puzzel-poging (zie
                               SP_TILESWAP) en blijven daarna in dezelfde volgorde
                               staan tot de speler de puzzel oplost of naar een
                               ANDERE puzzel navigeert — verlaat de speler de
                               scène halverwege, dan staat de puzzel bij
                               terugkeer nog precies zo als hij hem achterliet
                               (geen frustrerende her-schudding, in
                               tegenstelling tot een gevecht dat wél altijd
                               opnieuw begint — zie de toelichting bij
                               SP_COMBAT_ENEMIES).
   - "matching"              : KOPPELPUZZEL, sinds Hoofdstuk 6 (zie Chronica.md
                               §7.11). Twee kolommen knoppen; tik een knop
                               links, tik daarna een knop rechts. Juist paar
                               vergrendelt beide knoppen (uitgegrijsd,
                               disabled); fout paar toont een hint en reset de
                               selectie. puzzle = { type:"matching", vraag,
                               pairs:[{left,right},...], hint? }. Zodra alle
                               paren gevonden zijn, navigeert de puzzel meteen
                               door — geen aparte "Controleren"-knop nodig,
                               het laatste paar IS de bevestiging. SP_MATCH
                               matcht puzzle.pairs op INDEX, niet op tekst:
                               links en rechts worden onafhankelijk geschud
                               voor de weergave, maar "linkerknop met
                               pair-index i hoort bij rechterknop met
                               pair-index i" ligt al vast in de puzzeldata,
                               dus nakijken is simpelweg "zijn de twee getikte
                               indices gelijk?". ------------ */
function spRenderPuzzle(scene){
  const puzzleId = scene.meta.PUZZLE.trim();
  const puzzle = SP_PUZZLES[puzzleId];
  const target = scene.choices[0]?.target;
  if(!puzzle){ console.error("Onbekende puzzel:", puzzleId); return spGoCns(target); }
  const type = puzzle.type||"greek-transliteration";
  if(type==="multiple-choice") return spRenderMCPuzzle(scene, puzzleId, puzzle, target);
  if(type==="typed-latin")     return spRenderTypedLatinPuzzle(scene, puzzleId, puzzle, target);
  if(type==="typed-greek")     return spRenderTypedGreekPuzzle(scene, puzzleId, puzzle, target);
  if(type==="tile-swap")       return spRenderTileSwapPuzzle(scene, puzzleId, puzzle, target);
  if(type==="matching")        return spRenderMatchingPuzzle(scene, puzzleId, puzzle, target);
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
  <div class="scrhead">${spBackToMenuButtonHTML()}<h2>Chronica Classica</h2>${spAudioToggleHTML()}</div>
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
  if(input === puzzle.woord.antwoord.toLowerCase()){ spPuzzleCorrectToast(); spGoCns(target); }
  else if(err){ err.textContent = "Nog niet helemaal juist — kijk in de transcriptietabel en probeer opnieuw."; err.style.display = ""; }
}

/* Meerkeuze-grammaticapuzzel. puzzle = { type:"multiple-choice", vraag, opties:[],
   antwoord:"<juiste optietekst>", hint? }. Fout antwoord = hint + blijf staan;
   goed = door naar target. Knoppen zijn ≥44px hoog (iPad-veilig). */
function spRenderMCPuzzle(scene, puzzleId, puzzle, target){
  // Leerlingfeedback (2026-08-18): het juiste antwoord stond in de brondata
  // vaak toevallig als eerste optie — geschud op weergave-volgorde, niet op
  // de brondata zelf (spCheckMCPuzzle vergelijkt op tekst, niet op positie,
  // dus de originele index blijft geldig ongeacht de volgorde hier).
  const order = shuffle(puzzle.opties.map((_,i)=>i));
  const optsHTML = order.map(i=>{
    const o = puzzle.opties[i];
    return `<button class="btn btn-ghost btn-block lg" style="margin-top:8px;text-align:left" onclick="spCheckMCPuzzle('${puzzleId}','${target}',${i})">${esc(o)}</button>`;
  }).join("");
  H(brand(true)+`
  <div class="scrhead">${spBackToMenuButtonHTML()}<h2>Chronica Classica</h2>${spAudioToggleHTML()}</div>
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
  if(puzzle.opties[idx] === puzzle.antwoord){ spPuzzleAdvance(target, spBlankFillSentence(puzzle.vraag, puzzle.antwoord)); }
  else{
    spSyncPuzzleMistake(puzzleId, puzzle.opties[idx]);
    if(err){ err.textContent = puzzle.hint || "Nog niet juist — lees de zin nog eens en probeer opnieuw."; err.style.display = ""; }
  }
}

/* Getypte Latijnse puzzel. puzzle = { type:"typed-latin", vraag, antwoord,
   hint? }. Gewoon systeemtoetsenbord — Latijn gebruikt hier geen tekens die
   niet al op een normaal (Nederlands/Engels) toetsenbord staan. Hoofdletter-
   en spatiëring-ongevoelig vergeleken. */
function spRenderTypedLatinPuzzle(scene, puzzleId, puzzle, target){
  H(brand(true)+`
  <div class="scrhead">${spBackToMenuButtonHTML()}<h2>Chronica Classica</h2>${spAudioToggleHTML()}</div>
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
  if(input === puzzle.antwoord.trim().toLowerCase()){ spPuzzleAdvance(target, spBlankFillSentence(puzzle.vraag, puzzle.antwoord)); }
  else{
    spSyncPuzzleMistake(puzzleId, input);
    if(err){ err.textContent = puzzle.hint || "Nog niet juist — probeer opnieuw."; err.style.display = ""; }
  }
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
  <div class="scrhead">${spBackToMenuButtonHTML()}<h2>Chronica Classica</h2>${spAudioToggleHTML()}</div>
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
  if(spNormalizeGreek(raw) === spNormalizeGreek(puzzle.antwoord)){ spPuzzleAdvance(target, spBlankFillSentence(puzzle.vraag, puzzle.antwoord)); }
  else{
    spSyncPuzzleMistake(puzzleId, raw);
    // Leerlingfeedback (2026-08-18): deze generieke hint noemde altijd
    // spiritus, ook bij puzzels waar dat niet relevant is (bv. een verkeerde
    // naamvalsuitgang) — verwarrend, en het "/"-teken tussen de twee
    // spiritus-tekens oogde bovendien als een gewone schuine streep.
    // spNormalizeGreek() negeert accenten (acuut/gravis/circumflex) al bij
    // het nakijken; die mogen dus nooit de reden zijn dat dit fout is.
    if(err){ err.textContent = puzzle.hint || "Nog niet juist — probeer opnieuw. (Spiritus en iota subscriptum tellen mee, accenten zoals acuut of gravis niet.)"; err.style.display = ""; }
  }
}

/* ---- SCHUIFPUZZEL — puzzle.type "tile-swap" (zie de toelichting bij
   spRenderPuzzle hierboven). SP_TILESWAP is bewust GEEN onderdeel van
   SP_STATE/localStorage, net als SP_COMBAT: puur voortgang binnen één
   puzzel-poging, niet iets dat over sessies heen hoeft te overleven. */
let SP_TILESWAP = null;
function spRenderTileSwapPuzzle(scene, puzzleId, puzzle, target){
  if(!SP_TILESWAP || SP_TILESWAP.puzzleId!==puzzleId){
    SP_TILESWAP = { puzzleId, target, order: shuffle(puzzle.tiles.map((_,i)=>i)), selected:null };
  }
  const tilesHTML = SP_TILESWAP.order.map((tileIdx,pos)=>{
    const sel = SP_TILESWAP.selected===pos;
    return `<button class="btn${sel?" btn-gold":""}" style="min-width:44px;min-height:44px;padding:8px 12px;margin:3px;font-size:20px" onclick="spTileSwapTap(${pos})">${esc(puzzle.tiles[tileIdx])}</button>`;
  }).join("");
  H(brand(true)+`
  <div class="scrhead">${spBackToMenuButtonHTML()}<h2>Chronica Classica</h2>${spAudioToggleHTML()}</div>
  ${spPuzzleHeaderHTML(scene)}
  <div class="panel">
    <p style="font-weight:700;margin-bottom:4px">${esc(puzzle.vraag)}</p>
    <p class="note">Tik een tegel, tik een tweede tegel om ze te verwisselen — tot het antwoord klopt.</p>
    <div style="display:flex;flex-wrap:wrap;justify-content:center;margin-top:8px">${tilesHTML}</div>
    <div id="spPuzzleErr" class="note warn" style="display:none;margin-top:10px"></div>
  </div>
  <button class="btn btn-gold btn-block lg" onclick="spCheckTileSwapPuzzle('${puzzleId}','${target}')">Controleren</button>
  ${foot()}`);
}
function spTileSwapTap(pos){
  if(!SP_TILESWAP) return;
  if(SP_TILESWAP.selected===null) SP_TILESWAP.selected = pos;
  else if(SP_TILESWAP.selected===pos) SP_TILESWAP.selected = null;
  else{
    const o = SP_TILESWAP.order;
    [o[SP_TILESWAP.selected], o[pos]] = [o[pos], o[SP_TILESWAP.selected]];
    SP_TILESWAP.selected = null;
  }
  const scene = SP_SCENES.get(SP_STATE.node);
  const puzzle = SP_PUZZLES[SP_TILESWAP.puzzleId];
  spRenderTileSwapPuzzle(scene, SP_TILESWAP.puzzleId, puzzle, SP_TILESWAP.target);
}
function spCheckTileSwapPuzzle(puzzleId, target){
  const puzzle = SP_PUZZLES[puzzleId];
  const err = el("spPuzzleErr");
  const current = SP_TILESWAP.order.map(i=>puzzle.tiles[i]).join("");
  if(current === puzzle.tiles.join("")){ SP_TILESWAP = null; spPuzzleCorrectToast(); spGoCns(target); }
  else{
    spSyncPuzzleMistake(puzzleId, current);
    if(err){ err.textContent = puzzle.hint || "Nog niet in de juiste volgorde — probeer opnieuw."; err.style.display = ""; }
  }
}

/* ---- KOPPELPUZZEL — puzzle.type "matching" (zie de toelichting bij
   spRenderPuzzle hierboven). SP_MATCH is, net als SP_TILESWAP/SP_COMBAT,
   bewust GEEN onderdeel van SP_STATE/localStorage. */
let SP_MATCH = null;
function spRenderMatchingPuzzle(scene, puzzleId, puzzle, target){
  if(!SP_MATCH || SP_MATCH.puzzleId!==puzzleId){
    const idxs = puzzle.pairs.map((_,i)=>i);
    SP_MATCH = { puzzleId, target, leftOrder: shuffle([...idxs]), rightOrder: shuffle([...idxs]), matched:new Set(), selected:null, error:null };
  }
  const colHTML = (order, side) => order.map(i=>{
    const done = SP_MATCH.matched.has(i);
    const sel = side==="left" && SP_MATCH.selected===i;
    const label = side==="left" ? puzzle.pairs[i].left : puzzle.pairs[i].right;
    return `<button class="btn${sel?" btn-gold":""}" style="display:block;width:100%;margin-bottom:6px;text-align:left${done?";opacity:.4":""}" ${done?"disabled":""} onclick="spMatchTap${side==="left"?"Left":"Right"}(${i})">${esc(label)}</button>`;
  }).join("");
  // Foutmelding is single-shot: spMatchTapRight zet 'm op SP_MATCH.error vlak
  // vóór deze render (want een volledige her-render, zoals hier, zou een
  // rechtstreeks op het DOM-element gezette tekst — het patroon van de
  // andere vier puzzeltypes — meteen weer overschrijven). Ná het tonen wist
  // deze render 'm meteen weer, zodat hij niet blijft hangen na de volgende
  // (foutloze) tik.
  const errHTML = SP_MATCH.error
    ? `<div class="note warn" style="margin-top:10px">${esc(SP_MATCH.error)}</div>`
    : `<div id="spPuzzleErr" class="note warn" style="display:none;margin-top:10px"></div>`;
  SP_MATCH.error = null;
  H(brand(true)+`
  <div class="scrhead">${spBackToMenuButtonHTML()}<h2>Chronica Classica</h2>${spAudioToggleHTML()}</div>
  ${spPuzzleHeaderHTML(scene)}
  <div class="panel">
    <p style="font-weight:700;margin-bottom:8px">${esc(puzzle.vraag)}</p>
    <div style="display:flex;gap:12px">
      <div style="flex:1">${colHTML(SP_MATCH.leftOrder,"left")}</div>
      <div style="flex:1">${colHTML(SP_MATCH.rightOrder,"right")}</div>
    </div>
    ${errHTML}
  </div>
  ${foot()}`);
}
function spMatchTapLeft(i){
  if(!SP_MATCH || SP_MATCH.matched.has(i)) return;
  SP_MATCH.selected = i;
  spRerenderMatch();
}
function spMatchTapRight(i){
  if(!SP_MATCH || SP_MATCH.matched.has(i) || SP_MATCH.selected===null) return;
  const puzzle = SP_PUZZLES[SP_MATCH.puzzleId];
  if(SP_MATCH.selected===i){
    SP_MATCH.matched.add(i);
    SP_MATCH.selected = null;
    if(SP_MATCH.matched.size===puzzle.pairs.length){ const target=SP_MATCH.target; SP_MATCH=null; spPuzzleCorrectToast(); spGoCns(target); return; }
  } else {
    spSyncPuzzleMistake(SP_MATCH.puzzleId, puzzle.pairs[SP_MATCH.selected].left+" ≠ "+puzzle.pairs[i].right);
    SP_MATCH.selected = null;
    SP_MATCH.error = puzzle.hint || "Dat is niet het juiste paar — probeer opnieuw.";
  }
  spRerenderMatch();
}
function spRerenderMatch(){
  const scene = SP_SCENES.get(SP_STATE.node);
  const puzzle = SP_PUZZLES[SP_MATCH.puzzleId];
  spRenderMatchingPuzzle(scene, SP_MATCH.puzzleId, puzzle, SP_MATCH.target);
}

/* ============================================================================
   COMBAT-BRIDGE v2 — zie COMBAT_OVERHAUL.md en Chronica.md §8 punt 1.
   ----------------------------------------------------------------------------
   Vervangt (2026-08-18) de eerste Combat-bridge, die één werkwoord kende:
   antwoord → 10 EP → bij 20 EP een vaste 15 schade. De vijand deed niets
   terug, er viel niets te kiezen en de gevechtslengte lag bij de start al
   vast (Hector = 90 HP = 6 aanvallen = 12 goede antwoorden, altijd).

   NIEUWE BEURT — twee klikken, niet meer:
     1. de speler kiest een ACTIE (= tegelijk de moeilijkheidskeuze)
     2. hij beantwoordt de bijbehorende vraag → schade valt meteen
     3. de vijand voert zijn getelegrafeerde INTENTIE uit (of laadt verder op)

   WAAROM DIRECTE SCHADE i.p.v. de oude EP-drempel: de tussenstap "spaar 20 EP,
   klik dan Aanval" was een extra klik zonder beslissing — je klikte altijd
   Aanval. Vastberadenheid (VB) blijft bestaan, maar heeft nu één duidelijke
   taak: het laadt je klassevaardigheid op.

   GEEN GAME OVER. Vigor loopt terug (Chronica.md §11.1), maar op 0 volgt een
   narratieve opvangscène, nooit een verliesscherm — precies zoals §11.1 het
   al beschreef. Een gevecht kan slecht aflopen; het kan niet verloren worden.

   SP_COMBAT is bewust NIET onderdeel van SP_STATE/localStorage: een gevecht
   is kort en ademt niet over sessies heen — verlaat je de app halverwege, dan
   begin je het gevecht opnieuw bij terugkeer (net als bij de meeste
   boss-fights). SP_STATE.mastery (Leitner) is dat WEL: dat is leerdata.
   ============================================================================ */

// Oude vijand-HP was afgestemd op 7,5 schade per goed antwoord (15 schade per
// 2 correcte antwoorden). De nieuwe aanvalsvormen doen 12/18/26 per antwoord;
// zonder schaling zou elk gevecht half zo kort worden. Deze factor houdt een
// gemiddeld gevecht op ~8-11 beurten bij de veilige aanvalsvorm, en ~5-6 als
// je consequent het zwaarste vraagtype durft te kiezen.
const SP_COMBAT_HP_SCHAAL = 2.2;

/* ---- De drie aanvalsvormen = de moeilijkheidskeuze (COMBAT_OVERHAUL.md B).
   Zwaarder vraagtype = meer schade. Zo kiest de speler zelf zijn niveau
   zonder dat er ooit een "makkelijke modus"-etiket op hem geplakt wordt, en
   is de gevechtslengte niet langer voorspelbaar. ---- */
const SP_COMBAT_VORMEN = {
  snel:    { nm:"Snelle uitval", icon:"⚔️", zwaarte:1, schade:12, vb:6,
             ds:"Wat betekent dit woord? — veilig, maar de lichtste klap." },
  gericht: { nm:"Gerichte slag", icon:"🗡️", zwaarte:2, schade:16, vb:10,
             ds:"Een vorm- of zinsvraag — meer schade." },
  genade:  { nm:"Genadeslag",    icon:"💥", zwaarte:3, schade:22, vb:16,
             ds:"Typ de vorm zelf — de zwaarste klap, en fout kost je niets extra." },
};
// Verdedigen stelt óók een vraag (zwaarte 1): een actie die je een beurt lang
// van vragen vrijstelt zou de leerlus omzeilen. Het levert geen schade op,
// maar halveert de eerstvolgende vijandelijke intentie en laadt je VB sneller.
const SP_COMBAT_VERDEDIG_VB = 14;

/* ---- Uitrusting doet eindelijk iets (Chronica.md §8 punt 1, "equip-bonussen
   — ontwerp vastgelegd, nog te bouwen"). Twee assen, meer niet: helm, schild
   en cape blijven bewust puur cosmetisch, zodat de balans leesbaar blijft.
   - WAPEN → schadefactor. De verhouding volgt het al vastgelegde ontwerp
     (tier 1 = 15, tier 2 = 18, tier 3 = 22 → ×1 / ×1,2 / ×1,45).
   - HARNAS → demping van Vigor-verlies. In het oude ontwerp beschermde het
     harnas tegen een EP-boete; nu er echte inkomende schade bestaat, heeft
     het een natuurlijker taak gekregen: "bescherm je adem", niet "voorkom
     een game over". Nooit 100%: volledige onkwetsbaarheid haalt de spanning
     die dit hele systeem juist moet toevoegen er weer uit. ---- */
const SP_COMBAT_WAPEN_FACTOR = {
  hooivork:1, knuppel:1,            // startwapens — nulmeting
  zwaard:1.2, speer:1.2, boog:1.2,  // proloog-klassekeuze
  staf:1.45,                        // Hoofdstuk 17, laatst ontgrendeld
};
const SP_COMBAT_HARNAS_DEMPING = {
  vodden:0, robe:0, licht:0.15, middel:0.25, hopliet:0.35, zwaar:0.45, ceremonieel:0.5,
};

/* ---- Klassevaardigheid: 1× per gevecht, kost VB. Namen en werking zijn
   overgenomen uit BM_CLASSES (battle-data.js) zodat Chronica en Battle Mode
   één wereld blijven — een Hopliet doet in beide een Schildmuur. ---- */
const SP_COMBAT_VAARDIGHEID_KOST = 30;
const SP_COMBAT_MAX_VB = 40;
const SP_COMBAT_KLASSE = {
  hopliet:      { nm:"Schildmuur",  icon:"🛡️", ds:"De volgende twee intenties van je tegenstander glijden van je af.",
                  effect:"schildmuur", motion:"guard" },
  boogschutter: { nm:"Zwak Punt",   icon:"🎯", ds:"Je volgende treffer doet dubbele schade.",
                  effect:"zwakpunt", motion:"missile" },
  cavalerie:    { nm:"Stormloop",   icon:"🐎", ds:"Een directe aanval zonder vraag — 20 schade, nu meteen.",
                  effect:"stormloop", motion:"thrust" },
};

/* ---- Combo (COMBAT_OVERHAUL.md K): drie goede antwoorden op rij geven een
   schadebonus, één fout antwoord zet de teller terug. Blooket/Gimkit-gevoel,
   en het beloont doorzetten zonder ooit iemand af te straffen. ---- */
const SP_COMBAT_COMBO_DREMPEL = 3;
const SP_COMBAT_COMBO_FACTOR = 1.25;

/* ---- Vigor (Chronica.md §11.1): basis + Robur + ervaring. De eretitels
   tellen mee als "ervaring" — dat is meteen de plek waar de al lang
   openstaande wens "eretitels moeten iets doen in het gevecht" (§8 punt 1)
   landt, zonder dat er ook maar één eretitel-definitie aangepast hoeft te
   worden: wie meer van het verhaal zag, houdt het langer vol. ---- */
const SP_COMBAT_BASIS_VIGOR = 24;

/* ---- Vigor-BUDGET i.p.v. handgezette schadegetallen -----------------------
   Eerste balansmeting (2026-08-18, 40 gesimuleerde gevechten per opstelling)
   liet zien dat vaste Vigor-waarden per intentie structureel onrechtvaardig
   uitpakken: hoe meer HP een vijand heeft, hoe langer het gevecht duurt, hoe
   vaker hij aan de beurt komt — dus hoe harder hij toevallig is. Foutloos
   spelen kostte tegen de Nemeïsche Leeuw 6 van 29 Vigor (niets aan de hand),
   maar tegen Hector 31 van 29, met in 70% van de gevechten een opvangscène
   ondanks dat er geen enkele fout gemaakt werd.

   Daarom rekent het gevecht zelf uit hoe hard elke treffer mag aankomen: een
   heel gevecht mag bij foutloos spel ongeveer VIGOR_BUDGET van je Vigor
   kosten, en de `vigor`-waarden in SP_COMBAT_INTENTIES zijn vanaf nu RELATIEVE
   gewichten binnen die vijand (een zware uitval doet meer dan een korte stoot)
   in plaats van absolute punten. Nieuwe vijanden zijn zo automatisch in balans,
   ook als hun HP later verandert. ---- */
const SP_COMBAT_VIGOR_BUDGET = 0.5;
function spCombatVigorSchaal(hp){
  const pool = spCombatIntentiePool();
  const schadeIntenties = pool.filter(i=>!i.type);
  if(!schadeIntenties.length) return 1;
  const gemVigor = schadeIntenties.reduce((a,i)=>a+(i.vigor||5),0) / schadeIntenties.length;
  // Alleen de laadtijd van de SCHADE-intenties telt: die bepaalt hoe vaak je
  // geraakt wordt. Middelen over de hele pool ging mis bij de Hydra, waar de
  // enige aanval laden:1 heeft en de twee bijzondere intenties laden:2 — het
  // model rekende met 1,67 beurt tussen twee treffers terwijl het er in de
  // praktijk 1 was, en het gevecht sloeg twee keer zo hard aan als bedoeld.
  const gemLaden = schadeIntenties.reduce((a,i)=>a+(i.laden||1),0) / schadeIntenties.length;
  const totaalGewicht = pool.reduce((a,i)=>a+spCombatIntentGewicht(i),0);
  const schadeAandeel = schadeIntenties.reduce((a,i)=>a+spCombatIntentGewicht(i),0) / totaalGewicht;
  // Verwachte gevechtslengte bij de VEILIGE aanvalsvorm — dat is de langste
  // route en dus de bovengrens voor het aantal keer dat je geraakt kunt worden.
  // ×1,2 voor de combobonus: wie doorspeelt zonder fouten zit al snel op
  // combo ≥3 en doet dan 25% meer schade, dus duurt een gevecht in de praktijk
  // korter dan de kale schade-per-beurt doet vermoeden.
  const schadePerBeurt = 1.2 * (Math.max(1, Math.round(SP_COMBAT_VORMEN.snel.schade*spCombatWapenFactor()) + spCombatVisBonus()));
  const verwachteBeurten = Math.max(3, hp/schadePerBeurt);
  const verwachteTreffers = Math.max(1, (verwachteBeurten/gemLaden) * schadeAandeel);
  const doelPerTreffer = (SP_COMBAT_VIGOR_BUDGET * spCombatMaxVigor()) / verwachteTreffers;
  return doelPerTreffer / gemVigor;
}

let SP_COMBAT = null;

/* ---- Afgeleide waarden uit stats/uitrusting ----------------------------- */
function spCombatAvatar(){ return spAvatarMerge(spAvatarLoadLocal()); }
function spCombatStat(key){
  const v = SP_STATE.stats && SP_STATE.stats[key];
  return typeof v==="number" ? v : 10; // vóór de klassekeuze bestaan er nog geen stats
}
function spCombatMaxVigor(){
  const robur = spCombatStat("robur");
  const titels = (typeof spTitlesLoadLocal==="function") ? spTitlesLoadLocal().length : 0;
  const ervaring = Math.min(8, Math.floor(titels/4));
  return SP_COMBAT_BASIS_VIGOR + Math.max(0, robur-10) + ervaring;
}
// Vis maakt je klap zwaarder: +1 schade per 2 punten boven de 10. Bewust
// bescheiden — stats mogen een gevecht kleuren, niet beslissen.
function spCombatVisBonus(){ return Math.max(0, Math.floor((spCombatStat("vis")-10)/2)); }
function spCombatWapenFactor(){ return SP_COMBAT_WAPEN_FACTOR[spCombatAvatar().wapen] || 1; }
function spCombatHarnasDemping(){ return SP_COMBAT_HARNAS_DEMPING[spCombatAvatar().armor] || 0; }

// Finale-only HP-schaling (Chronica.md §7.101, Gerbens frame "Lethe's
// kracht neemt toe naarmate we meer vergeten"): ZACHTE schaling, dus een
// bescheiden ±20%-marge rond de basiswaarde — nooit een harde muur voor een
// speler die minder grondig speelde, alleen een iets langer/korter gevecht.
// fin_kennis_score en fin_herinnering_score worden gezet in resp.
// FIN_GRE/LAT_EINDE en FIN_HER_EINDE, elk als percentage 0-100.
function spFinaleLetheHp(baseHp, state){
  const kennis = Number(state.flags?.fin_kennis_score);
  const herinnering = Number(state.flags?.fin_herinnering_score);
  const kennisPct = isNaN(kennis) ? 50 : kennis;
  const herinneringPct = isNaN(herinnering) ? 50 : herinnering;
  const herinnerd = (kennisPct + herinneringPct) / 200; // 0..1, hoger = meer onthouden
  const modifier = 1 + (0.5 - herinnerd) * 0.4; // 0.8..1.2
  return Math.round(baseHp * modifier);
}

/* ---- Start -------------------------------------------------------------- */
function spStartCombatFromScene(scene){
  const enemyId = scene.meta.COMBAT.trim();
  const target = scene.choices[0]?.target;
  const enemy = SP_COMBAT_ENEMIES[enemyId];
  if(!enemy){ console.error("Onbekende vijand:", enemyId); return spGoCns(target); }
  const basis = enemyId==="fin_lethe" ? spFinaleLetheHp(enemy.hp, SP_STATE) : enemy.hp;
  const hp = Math.round(basis * SP_COMBAT_HP_SCHAAL);
  const maxVigor = spCombatMaxVigor();
  SP_COMBAT = {
    enemyId, hp, maxHp:hp, target, sceneTitle:scene.title,
    vigor:maxVigor, maxVigor, vb:0, combo:0, beurt:1,
    fase:"intro", vorm:null, question:null,
    intent:null, intentLaden:0,
    schild:false, schildmuur:0, zwakpunt:false,
    goed:0, fout:0, vigorVerloren:0, vaardigheidGebruikt:false,
    itemsGebruikt:[], vermijd:[], gezien:{}, opvangGehad:false,
    bericht:null, uitleg:null, laatsteFx:null, vigorSchaal:1,
  };
  // Moet ná het zetten van SP_COMBAT: spCombatVigorSchaal() leest de
  // intentiepool van deze vijand op via SP_COMBAT.enemyId.
  SP_COMBAT.vigorSchaal = spCombatVigorSchaal(hp);
  spCombatKiesIntentie();
  SCREENS.spCombat();
}

/* ---- Vijand-intenties (COMBAT_OVERHAUL.md A) ----------------------------
   De vijand kondigt aan wat hij gaat doen en voert dat één of twee beurten
   later uit. Dat is de goedkoopste spanning die er bestaat: je weet wat er
   komt en kunt er iets tegen doen (Verdedigen, Schildmuur), of je besluit
   het risico te nemen omdat je hem net dit gevecht uit wilt hebben.
   Een vijand zonder eigen `intenties` valt terug op de generieke set. ---- */
const SP_COMBAT_STANDAARD_INTENTIES = [
  { id:"uitval",   nm:"Uitval",     laden:2, vigor:6,
    aankondiging:"maakt zich klaar voor een uitval.", uitvoer:"De uitval komt aan — je hapt naar adem." },
  { id:"stoot",    nm:"Stoot",      laden:1, vigor:4,
    aankondiging:"zoekt een opening.", uitvoer:"Een korte, harde stoot raakt je zij." },
  { id:"adempauze",nm:"Hergroepering", laden:2, type:"heal", waarde:0.08,
    aankondiging:"trekt zich even terug om op adem te komen.", uitvoer:"Hij herstelt een deel van zijn kracht." },
];
function spCombatIntentiePool(){
  const eigen = SP_COMBAT_INTENTIES[SP_COMBAT.enemyId];
  return (eigen && eigen.length) ? eigen : SP_COMBAT_STANDAARD_INTENTIES;
}
// Gewogen keuze. Bij een ONgewogen trekking (eerste meting 2026-08-18) kwamen
// de bijzondere intenties even vaak langs als de gewone aanvallen, en zakte de
// Vigor in een gevecht van zeven beurten maar twee keer met 5 punten — de hele
// spanning die dit systeem moet toevoegen viel dan weg. Een gewone aanval weegt
// daarom drie keer zo zwaar als een heal of vastberadenheid-roof; die laatste
// blijven zo wat ze horen te zijn: een verrassing, niet het patroon.
function spCombatIntentGewicht(intent){
  if(typeof intent.gewicht==="number") return intent.gewicht;
  return intent.type ? 1 : 3;
}
function spCombatKiesIntentie(){
  const pool = spCombatIntentiePool();
  // Geen twee BIJZONDERE intenties (heal / vastberadenheid-roof) op rij: die
  // moeten een verrassing blijven. Een gewone aanval mag wél herhalen — dat is
  // in elke turn-based RPG normaal, en de eerste versie van deze regel sloot
  // ook gewone aanvallen uit, waardoor een vijand met één aanval en twee
  // specials nooit twee keer achter elkaar kón aanvallen. Precies daardoor
  // kwam er in de praktijk maar half zoveel Vigor-schade binnen als bedoeld.
  const vorige = SP_COMBAT.intent;
  const keuze = (vorige && vorige.type) ? pool.filter(i=>i.id!==vorige.id) : pool;
  const kandidaten = keuze.length ? keuze : pool;
  const gewichten = kandidaten.map(spCombatIntentGewicht);
  const totaal = gewichten.reduce((a,b)=>a+b, 0);
  let r = Math.random()*totaal, intent = kandidaten[kandidaten.length-1];
  for(let i=0;i<kandidaten.length;i++){ r -= gewichten[i]; if(r<=0){ intent = kandidaten[i]; break; } }
  SP_COMBAT.intent = intent;
  SP_COMBAT.intentLaden = intent.laden || 1;
}

/* ---- Vraag stellen ------------------------------------------------------ */
// Hoogste bereikte hoofdstuknummer — filtert de zinnenbank, zodat een
// leerling nooit een zin krijgt uit stof die het verhaal nog niet gaf.
function spCombatHoofdstukNr(){
  const m = (SP_STATE.node||"").match(/^CH(\d+)_/);
  if(m) return +m[1];
  return (SP_STATE.node||"").indexOf("FIN_")===0 ? 99 : 0;
}
function spCombatVolgendeVraag(zwaarte){
  const enemy = SP_COMBAT_ENEMIES[SP_COMBAT.enemyId];
  const q = CombatQuestions.next({
    zwaarte,
    vocabIds: (SP_STATE.vocab && SP_STATE.vocab.length) ? SP_STATE.vocab : null,
    taalspoor: SP_STATE.flags?.taalspoor,
    mastery: (SP_STATE.mastery = SP_STATE.mastery || {}),
    vermijd: SP_COMBAT.vermijd,
    hoofdstuk: spCombatHoofdstukNr(),
    types: enemy.vraagtypes || null,
  });
  SP_COMBAT.question = q;
  if(q){
    // Max. 2× dezelfde vraag per gevecht (leerlingfeedback 2026-08-13: bij een
    // lang gevecht kwam hetzelfde woord tot 5× op rij langs). `vermijd` is een
    // UITSLUITINGSlijst voor CombatQuestions.next(), dus een sleutel komt daar
    // pas op zodra hij twee keer geweest is — niet meteen bij de eerste keer.
    // Raakt alles uitgesloten, dan valt gewogenTrek() zelf terug op de volle
    // pool, dus vastlopen kan niet.
    SP_COMBAT.gezien[q.masteryKey] = (SP_COMBAT.gezien[q.masteryKey]||0) + 1;
    if(SP_COMBAT.gezien[q.masteryKey] >= 2 && !SP_COMBAT.vermijd.includes(q.masteryKey)){
      SP_COMBAT.vermijd.push(q.masteryKey);
    }
  }
  return q;
}

/* ---- Actiekeuze --------------------------------------------------------- */
function spCombatKiesVorm(vormId){
  if(!SP_COMBAT || SP_COMBAT.fase!=="keuze") return;
  const vorm = vormId==="verdedig"
    ? { nm:"Verdedigen", icon:"🛡️", zwaarte:1, schade:0, vb:SP_COMBAT_VERDEDIG_VB, verdedig:true }
    : SP_COMBAT_VORMEN[vormId];
  if(!vorm) return;
  const q = spCombatVolgendeVraag(vorm.zwaarte);
  if(!q){
    // Vangnet: geen enkele vraag te genereren (lege vocab-pool). Nooit
    // vastlopen — de speler krijgt de treffer gewoon cadeau.
    toast("Geen vraag beschikbaar", "Je haalt uit zonder aarzeling.");
    spCombatVerwerkAntwoord(true, vorm, vormId);
    return;
  }
  SP_COMBAT.vorm = { ...vorm, id:vormId };
  SP_COMBAT.fase = "vraag";
  SCREENS.spCombat();
}

/* ---- Antwoord ----------------------------------------------------------- */
function spCombatAntwoordMC(idx){
  if(!SP_COMBAT || SP_COMBAT.fase!=="vraag") return;
  const q = SP_COMBAT.question;
  spCombatVerwerkAntwoord(CombatQuestions.controleer(q, q.opties[idx]), SP_COMBAT.vorm, SP_COMBAT.vorm.id);
}
function spCombatAntwoordGetypt(){
  if(!SP_COMBAT || SP_COMBAT.fase!=="vraag") return;
  const raw = el("spCombatInput")?.value || "";
  spCombatVerwerkAntwoord(CombatQuestions.controleer(SP_COMBAT.question, raw), SP_COMBAT.vorm, SP_COMBAT.vorm.id);
}
// Schermtoetsenbord-hulpjes voor getypt Grieks — hergebruiken de bestaande
// puzzel-toetsen, maar op het combat-invoerveld.
function spCombatGreekKey(ch){ const i=el("spCombatInput"); if(i) i.value += ch; }
function spCombatGreekBackspace(){ const i=el("spCombatInput"); if(i) i.value = i.value.slice(0,-1); }
function spCombatGreekModifier(type){
  const i = el("spCombatInput"); if(!i || !i.value) return;
  const map = type==="smooth" ? SP_GREEK_SMOOTH : type==="rough" ? SP_GREEK_ROUGH : SP_GREEK_IOTA_SUB;
  const last = i.value.slice(-1);
  if(map[last]) i.value = i.value.slice(0,-1) + map[last];
}

function spCombatVerwerkAntwoord(goed, vorm, vormId){
  const q = SP_COMBAT.question;
  // Leitner: fout → box 0 (opnieuw verdienen), goed → één box omhoog.
  if(q) CombatQuestions.noteerAntwoord(SP_STATE.mastery, q.masteryKey, goed);

  if(goed){
    SP_COMBAT.goed++;
    SP_COMBAT.combo++;
    SP_COMBAT.vb = Math.min(SP_COMBAT_MAX_VB, SP_COMBAT.vb + vorm.vb);
    SP_COMBAT.uitleg = null;
    if(vorm.verdedig){
      SP_COMBAT.schild = true;
      SP_COMBAT.bericht = "🛡️ Je zet je schrap. De volgende aanval doet nog maar de helft.";
      SP_COMBAT.laatsteFx = { speler:"guard" };
    } else {
      const schade = spCombatSchade(vorm);
      SP_COMBAT.hp = Math.max(0, SP_COMBAT.hp - schade);
      const comboActief = SP_COMBAT.combo >= SP_COMBAT_COMBO_DREMPEL;
      SP_COMBAT.bericht = vorm.icon+" Raak! "+schade+" schade"+(comboActief?" — combo ×"+SP_COMBAT.combo:"")+".";
      SP_COMBAT.laatsteFx = { speler:spCombatMotionVoor(vormId), vijand:"hit", schade, combo:comboActief };
      SP_COMBAT.zwakpunt = false;
    }
  } else {
    SP_COMBAT.fout++;
    SP_COMBAT.combo = 0;
    SP_COMBAT.bericht = "Niet juist — je slag mist.";
    // MICRO-ONDERWIJS (COMBAT_OVERHAUL.md D): een fout antwoord is nu een
    // leermoment in plaats van alleen een straf. De uitleg blijft op het
    // keuzescherm staan terwijl de speler zijn volgende zet kiest.
    SP_COMBAT.uitleg = q ? q.uitleg : null;
    SP_COMBAT.laatsteFx = { speler:"evade" };
  }

  if(SP_COMBAT.hp<=0){ spCombatEinde(); return; }
  spCombatVijandBeurt();
}

// Schade = basis × wapen × combo × zwakpunt, plus de Vis-bonus.
function spCombatSchade(vorm){
  let s = vorm.schade * spCombatWapenFactor();
  if(SP_COMBAT.combo >= SP_COMBAT_COMBO_DREMPEL) s *= SP_COMBAT_COMBO_FACTOR;
  if(SP_COMBAT.zwakpunt) s *= 2;
  return Math.max(1, Math.round(s) + spCombatVisBonus());
}
function spCombatMotionVoor(vormId){
  const wapen = spCombatAvatar().wapen;
  if(wapen==="boog") return "missile";
  if(wapen==="speer") return "thrust";
  if(vormId==="genade") return "skill";
  return "swing";
}

/* ---- Vijandbeurt -------------------------------------------------------- */
function spCombatVijandBeurt(){
  SP_COMBAT.beurt++;
  SP_COMBAT.intentLaden--;
  if(SP_COMBAT.intentLaden > 0){
    // Nog aan het opladen — de dreiging blijft staan, dat is het punt.
    SP_COMBAT.fase = "keuze";
    SCREENS.spCombat();
    return;
  }
  const intent = SP_COMBAT.intent;
  const enemy = SP_COMBAT_ENEMIES[SP_COMBAT.enemyId];
  let regel = "";
  if(SP_COMBAT.schildmuur > 0){
    SP_COMBAT.schildmuur--;
    regel = "🛡️ Je schildmuur houdt: "+esc(enemy.nm)+" bereikt je niet.";
  } else if(intent.type==="heal"){
    const genezen = Math.round(SP_COMBAT.maxHp * (intent.waarde||0.08));
    SP_COMBAT.hp = Math.min(SP_COMBAT.maxHp, SP_COMBAT.hp + genezen);
    regel = "💚 "+intent.uitvoer+" (+"+genezen+" HP)";
    SP_COMBAT.laatsteFx = { ...(SP_COMBAT.laatsteFx||{}), vijandHeal:genezen };
  } else if(intent.type==="vb_roof"){
    const weg = Math.min(SP_COMBAT.vb, intent.waarde||10);
    SP_COMBAT.vb -= weg;
    // Stond je toch al op nul, dan valt er niets te roven — dan zou
    // "(−0 vastberadenheid)" een rare mededeling zijn.
    regel = "💢 "+intent.uitvoer+(weg>0 ? " (−"+weg+" vastberadenheid)" : " (je had niets meer te verliezen)");
  } else {
    let verlies = (intent.vigor || 5) * SP_COMBAT.vigorSchaal;
    if(SP_COMBAT.schild){ verlies = verlies/2; SP_COMBAT.schild = false; }
    verlies = Math.max(2, Math.round(verlies * (1 - spCombatHarnasDemping())));
    SP_COMBAT.vigor = Math.max(0, SP_COMBAT.vigor - verlies);
    SP_COMBAT.vigorVerloren += verlies;
    regel = "💥 "+intent.uitvoer+" (−"+verlies+" Vigor)";
    SP_COMBAT.laatsteFx = { ...(SP_COMBAT.laatsteFx||{}), spelerGeraakt:verlies };
  }
  SP_COMBAT.bericht = (SP_COMBAT.bericht ? SP_COMBAT.bericht+"<br>" : "") + regel;
  spCombatKiesIntentie();

  if(SP_COMBAT.vigor<=0){ spCombatOpvang(); return; }
  SP_COMBAT.fase = "keuze";
  SCREENS.spCombat();
}

/* ---- Vigor op nul: NOOIT game over -------------------------------------
   Chronica.md §11.1 legt dit al vast: "op nul volgt geen game over maar een
   afgedwongen scène". Drie varianten, met echte narratieve gevolgen (een
   relatie die iets kost, een vijand die op adem komt, een flag voor de
   payoff-laag) — maar het gevecht gaat altijd door. ---- */
function spCombatOpvang(){
  const enemy = SP_COMBAT_ENEMIES[SP_COMBAT.enemyId];
  const relaties = Object.entries(SP_STATE.relations||{}).filter(([,v])=>Number(v)>0);
  let tekst, gevolg = "";
  if(relaties.length && !SP_COMBAT.opvangGehad){
    // Een metgezel vangt de klap op — dat kost iets in de relatie, want je
    // hebt hem laten opdraaien voor jouw uitputting.
    const [naam] = pick(relaties);
    const nette = naam.charAt(0).toUpperCase()+naam.slice(1);
    SP_STATE.relations[naam] = Number(SP_STATE.relations[naam]) - 1;
    tekst = nette+" ziet je wankelen en stapt tussen jou en "+enemy.nm+" in. De klap die voor jou bedoeld was, komt bij "+nette+" aan.";
    gevolg = "Je haalt adem. "+nette+" zegt er niets over — maar iets tussen jullie is verschoven.";
  } else if(SP_COMBAT.hp > SP_COMBAT.maxHp*0.4){
    const terug = Math.round(SP_COMBAT.maxHp*0.12);
    SP_COMBAT.hp = Math.min(SP_COMBAT.maxHp, SP_COMBAT.hp + terug);
    tekst = "Je knieën begeven het. Je wijkt terug, verder dan je wilde, en "+enemy.nm+" gebruikt die ruimte om zich te herpakken.";
    gevolg = "Je wint tijd om op adem te komen — en verliest het terrein dat je al gewonnen had.";
  } else {
    SP_STATE.flags = { ...(SP_STATE.flags||{}), gered_in_gevecht:true };
    tekst = "Je ziet de slag komen en weet dat je hem niet meer kunt keren. Dan trekt iemand je aan je schouder opzij — je weet niet wie, je ziet alleen een arm en een mouw die je niet herkent.";
    gevolg = "Als je omkijkt, is er niemand. Maar je staat nog.";
  }
  SP_COMBAT.opvangGehad = true;
  SP_COMBAT.vigor = Math.max(1, Math.round(SP_COMBAT.maxVigor*0.4));
  SP_COMBAT.fase = "opvang";
  SP_COMBAT.opvangTekst = tekst;
  SP_COMBAT.opvangGevolg = gevolg;
  spSaveProgress({ relations:SP_STATE.relations, flags:SP_STATE.flags });
  SCREENS.spCombat();
}
function spCombatOpvangVerder(){
  if(!SP_COMBAT) return;
  SP_COMBAT.fase = "keuze";
  SP_COMBAT.bericht = null;
  SCREENS.spCombat();
}

/* ---- Klassevaardigheid en items ----------------------------------------- */
function spCombatVaardigheid(){
  if(!SP_COMBAT || SP_COMBAT.fase!=="keuze") return;
  const def = SP_COMBAT_KLASSE[SP_STATE.classId];
  if(!def || SP_COMBAT.vaardigheidGebruikt || SP_COMBAT.vb < SP_COMBAT_VAARDIGHEID_KOST) return;
  SP_COMBAT.vb -= SP_COMBAT_VAARDIGHEID_KOST;
  SP_COMBAT.vaardigheidGebruikt = true;
  SP_COMBAT.uitleg = null;
  if(def.effect==="schildmuur"){
    SP_COMBAT.schildmuur = 2;
    SP_COMBAT.bericht = def.icon+" <strong>"+def.nm+"</strong> — de volgende twee aanvallen glijden van je af.";
    SP_COMBAT.laatsteFx = { speler:"guard" };
  } else if(def.effect==="zwakpunt"){
    SP_COMBAT.zwakpunt = true;
    SP_COMBAT.bericht = def.icon+" <strong>"+def.nm+"</strong> — je hebt de opening gezien. Je volgende treffer telt dubbel.";
    SP_COMBAT.laatsteFx = { speler:"missile" };
  } else {
    const schade = Math.max(1, Math.round(20*spCombatWapenFactor()) + spCombatVisBonus());
    SP_COMBAT.hp = Math.max(0, SP_COMBAT.hp - schade);
    SP_COMBAT.bericht = def.icon+" <strong>"+def.nm+"</strong> — je gaat er dwars doorheen: "+schade+" schade.";
    SP_COMBAT.laatsteFx = { speler:"thrust", vijand:"hit", schade };
  }
  if(SP_COMBAT.hp<=0){ spCombatEinde(); return; }
  spCombatVijandBeurt();
}
function spCombatItem(itemId){
  if(!SP_COMBAT || SP_COMBAT.fase!=="keuze") return;
  const item = SP_COMBAT_ITEMS[itemId];
  if(!item || SP_COMBAT.itemsGebruikt.includes(itemId)) return;
  if(!(SP_STATE.inventory||[]).includes(itemId)) return;
  SP_COMBAT.itemsGebruikt.push(itemId);
  // Een item verdwijnt uit de inventaris: het is eenmalig, en dat maakt de
  // keuze om hem NU te gebruiken een echte keuze.
  const inventory = (SP_STATE.inventory||[]).filter(i=>i!==itemId);
  spSaveProgress({ inventory });
  SP_COMBAT.uitleg = null;
  if(item.effect==="vigor"){
    const terug = Math.min(SP_COMBAT.maxVigor-SP_COMBAT.vigor, item.waarde||10);
    SP_COMBAT.vigor += terug;
    SP_COMBAT.bericht = item.icon+" <strong>"+item.nm+"</strong> — "+item.tekst+" (+"+terug+" Vigor)";
  } else if(item.effect==="schade"){
    const schade = item.waarde||25;
    SP_COMBAT.hp = Math.max(0, SP_COMBAT.hp - schade);
    SP_COMBAT.bericht = item.icon+" <strong>"+item.nm+"</strong> — "+item.tekst+" ("+schade+" schade)";
    SP_COMBAT.laatsteFx = { vijand:"hit", schade };
  } else if(item.effect==="verdoof"){
    SP_COMBAT.intentLaden += item.waarde||2;
    SP_COMBAT.bericht = item.icon+" <strong>"+item.nm+"</strong> — "+item.tekst;
  }
  if(SP_COMBAT.hp<=0){ spCombatEinde(); return; }
  SP_COMBAT.fase = "keuze";
  SCREENS.spCombat();
}

/* ---- Einde: een rang, geen kaal "gewonnen" -----------------------------
   Drie sterren op basis van accuratesse en hoeveel Vigor het je kostte. Er
   bestaat geen faalrang: de laagste uitkomst is nog steeds een Victoria. ---- */
function spCombatRang(){
  const totaal = SP_COMBAT.goed + SP_COMBAT.fout;
  const pct = totaal ? SP_COMBAT.goed/totaal : 1;
  const ongedeerd = SP_COMBAT.vigorVerloren <= SP_COMBAT.maxVigor*0.25;
  if(pct>=0.9 && ongedeerd) return { sterren:3, nm:"Victoria splendida", ds:"Schitterend gevochten — nauwelijks een misser, nauwelijks een schram." };
  if(pct>=0.7)               return { sterren:2, nm:"Victoria clara",     ds:"Een duidelijke overwinning." };
  return                            { sterren:1, nm:"Victoria",           ds:"Gewonnen is gewonnen." };
}
function spCombatEinde(){
  const enemy = SP_COMBAT_ENEMIES[SP_COMBAT.enemyId];
  const rang = spCombatRang();
  SP_COMBAT.fase = "einde";
  SP_COMBAT.rang = rang;
  SP_COMBAT.laatsteFx = { speler:"victory", vijand:"hit" };
  spKroniekLog(enemy.nm+" verslagen — "+rang.nm+" ("+SP_COMBAT.goed+" van "+
    (SP_COMBAT.goed+SP_COMBAT.fout)+" antwoorden juist, "+SP_COMBAT.beurt+" beurten).");
  spSaveProgress({ mastery:SP_STATE.mastery });
  SCREENS.spCombat();
}
function spCombatVerder(){
  const target = SP_COMBAT?.target;
  SP_COMBAT = null;
  spGoCns(target);
}

/* ============================================================================
   SCHERM + FX-LAAG
   ----------------------------------------------------------------------------
   Hergebruikt de complete animatielaag die voor Battle Mode gebouwd is en die
   Chronica tot nu toe niet aanraakte: BattleMotion (battle-motion.js), de
   gelaagde pixel-held (_bmPixelLayers, battle.js) en de keyframes in
   index.html (.bm-float, .bm-proj, .bm-glow, bmPixelHit, bmBad). De speler
   stond in zijn eigen gevecht niet in beeld — nu wel.
   ============================================================================ */
/* Animaties uit-schakelaar, los van de geluidsknop — zelfde gedachte als
   BM_META.animations in Battle Mode (docent kan het uitzetten voor tempo,
   iPad-prestaties of prikkelgevoelige leerlingen). Account-breed, niet per
   saveslot: het is een weergavevoorkeur, geen verhaalvoortgang. */
const SP_FX_KEY = "certamen_chronica_fx_uit";
function spCombatAnimAan(){
  try{ return localStorage.getItem(SP_FX_KEY)!=="1"; }catch(e){ return true; }
}
function spCombatToggleAnim(){
  try{ localStorage.setItem(SP_FX_KEY, spCombatAnimAan()?"1":"0"); }catch(e){}
  SCREENS.spCombat();
}
function spCombatAnimToggleHTML(){
  const aan = spCombatAnimAan();
  return `<button title="${aan?"Animaties uitzetten":"Animaties aanzetten"}" aria-label="${aan?"Animaties uitzetten":"Animaties aanzetten"}"
    style="flex:0 0 auto;padding:6px 10px;font-size:20px;line-height:1;background:none;border:none;cursor:pointer;color:var(--hi-bright)"
    onclick="spCombatToggleAnim()">${aan?"✨":"🚫"}</button>`;
}
// Zwevend getal (schade/heling) — zelfde CSS-klasse als Battle Mode's bmFloat.
function spCombatFloat(tekst, kleur, kant){
  const cont = el("spCombatFx"); if(!cont) return;
  const d = document.createElement("div");
  d.className = "bm-float";
  d.style.cssText = "color:"+kleur+";bottom:38%;left:"+(kant==="links"?"28%":"72%");
  d.textContent = tekst;
  cont.appendChild(d);
  setTimeout(()=>d.remove(), 1500);
}
function spCombatGlow(kant, kleur){
  const cont = el("spCombatFx"); if(!cont) return;
  const d = document.createElement("div");
  d.className = "bm-glow";
  d.style.cssText = "width:70px;height:70px;background:radial-gradient(circle,"+(kleur||"rgba(212,175,55,.65)")+",transparent 70%);"+
    (kant==="links"?"left:12%;top:20%":"right:12%;top:20%");
  cont.appendChild(d);
  setTimeout(()=>d.remove(), 950);
}
function spCombatProjectiel(emoji){
  const cont = el("spCombatFx"); if(!cont) return;
  const d = document.createElement("div");
  d.className = "bm-proj r";
  d.style.setProperty("--row", 0);
  d.textContent = emoji;
  cont.appendChild(d);
  setTimeout(()=>d.remove(), 900);
}
// Speelt alles af wat er sinds de vorige render gebeurd is. Wordt na élke
// render aangeroepen en daarna gewist, zodat een her-render (bv. door de
// geluidsknop) niet dezelfde animatie nog eens afvuurt.
function spCombatSpeelFx(){
  const fx = SP_COMBAT?.laatsteFx;
  if(!fx) return;
  SP_COMBAT.laatsteFx = null;
  if(!spCombatAnimAan()) return; // het tekstbericht in het paneel vertelt alles al
  const held = el("spCombatHeld")?.querySelector(".pixel-hero");
  if(held && typeof BattleMotion!=="undefined"){
    if(fx.speler) BattleMotion.play(held, fx.speler);
    else BattleMotion.ensureIdle(held);
  }
  if(fx.speler==="missile") setTimeout(()=>spCombatProjectiel("🏹"), 120);
  if(fx.vijand==="hit"){
    const v = el("spCombatVijand");
    if(v){ v.style.animation = "none"; void v.offsetWidth; v.style.animation = "bmPixelHit .5s"; }
    setTimeout(()=>spCombatFloat("-"+fx.schade, "#e05555", "rechts"), 260);
  }
  if(fx.combo) setTimeout(()=>spCombatGlow("links"), 160);
  if(fx.vijandHeal) setTimeout(()=>spCombatFloat("+"+fx.vijandHeal, "var(--green-bright,#3f9d52)", "rechts"), 200);
  if(fx.spelerGeraakt){
    const h = el("spCombatHeld");
    if(h){ h.style.animation = "none"; void h.offsetWidth; h.style.animation = "bmBad .5s"; }
    setTimeout(()=>spCombatFloat("-"+fx.spelerGeraakt+" Vigor", "#e0a355", "links"), 200);
  }
}

// Vijand-sprite: romp (met kale nekstompjes al ingetekend bij de Hydra) +
// eventuele losse kop-lagen erbovenop, exact dezelfde absolute-stapel-truc
// als Boss Battle se bmBossSpriteHTML() (bossbattle.js) — geen offsets
// nodig, elke laag is hetzelfde canvasformaat. Ontbreekt enemy.img, dan
// valt het terug op het icon-emoji.
function spCombatAliveHeads(headCount, hpPct){
  return Math.max(0, Math.min(headCount, Math.ceil((hpPct||0)*headCount)));
}
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
  return `<div style="position:relative;width:min(190px,42vw);aspect-ratio:1/1">
    <img src="${esc(enemy.img)}" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain"
      onerror="this.parentElement.innerHTML='<span style=&quot;font-size:40px&quot;>${esc(enemy.icon)}</span>'">
    ${headsHTML}
  </div>`;
}
// De speler zelf, in zijn eigen gevecht — met de echte gelaagde pixel-held
// uit Battle Mode (inclusief het wapen dat hij in de proloog koos).
function spCombatHeldHTML(){
  const av = spCombatAvatar();
  const lagen = (typeof _bmPixelLayers==="function") ? _bmPixelLayers(av, "dir-right") : "";
  if(lagen) return lagen;
  return (typeof bmAvatarSVG==="function") ? bmAvatarSVG(av, 96) : `<span style="font-size:40px">🗡️</span>`;
}

function spCombatBalkHTML(label, waarde, max, kleur, kritiek){
  const pct = max ? Math.max(0, Math.min(100, Math.round(waarde/max*100))) : 0;
  return `<div style="margin:4px 0">
    <div style="height:9px;background:rgba(255,255,255,.12);border-radius:5px;overflow:hidden">
      <div class="bm-hp-fill${kritiek&&pct<25?" bm-crit":""}" style="height:100%;width:${pct}%;background:${kleur};transition:width .45s"></div>
    </div>
    <div class="note" style="margin-top:2px">${esc(label)}: ${waarde} / ${max}</div>
  </div>`;
}

function spCombatIntentHTML(){
  const intent = SP_COMBAT.intent;
  if(!intent) return "";
  const enemy = SP_COMBAT_ENEMIES[SP_COMBAT.enemyId];
  const klaar = SP_COMBAT.intentLaden<=1;
  // De aangekondigde Vigor-kosten moeten de GESCHAALDE waarde tonen (zie
  // spCombatVigorSchaal), inclusief harnas-demping — anders belooft de badge
  // iets anders dan er even later gebeurt.
  const ruw = (intent.vigor||5) * SP_COMBAT.vigorSchaal;
  const kost = intent.type==="heal" ? "herstelt kracht"
    : intent.type==="vb_roof" ? "−vastberadenheid"
    : "−"+Math.max(2, Math.round(ruw*(1-spCombatHarnasDemping())))+" Vigor";
  return `<div style="margin-top:6px;padding:7px 10px;border-radius:8px;text-align:left;
      border:1px solid ${klaar?"rgba(224,85,85,.75)":"rgba(255,255,255,.18)"};
      background:${klaar?"rgba(224,85,85,.12)":"rgba(255,255,255,.05)"}">
    <div class="note" style="margin:0"><strong>${klaar?"⚠️ Nu:":"⏳ Straks:"}</strong>
      ${esc(enemy.nm)} ${esc(intent.aankondiging)}
      <span style="opacity:.75">(${esc(kost)}${klaar?"":", nog "+(SP_COMBAT.intentLaden-1)+" beurt"})</span></div>
  </div>`;
}

function spCombatKeuzeHTML(){
  const kanVaardigheid = SP_COMBAT_KLASSE[SP_STATE.classId] && !SP_COMBAT.vaardigheidGebruikt
    && SP_COMBAT.vb >= SP_COMBAT_VAARDIGHEID_KOST;
  const vaardigheid = SP_COMBAT_KLASSE[SP_STATE.classId];
  const knop = (id,v) => `<button class="btn btn-ghost btn-block lg" style="margin-top:8px;text-align:left"
      onclick="spCombatKiesVorm('${id}')">
      <strong>${v.icon} ${esc(v.nm)}</strong><br><span class="note">${esc(v.ds)}</span></button>`;
  const items = (SP_STATE.inventory||[]).filter(i=>SP_COMBAT_ITEMS[i]).map(i=>{
    const it = SP_COMBAT_ITEMS[i];
    return `<button class="btn btn-ghost btn-block" style="margin-top:8px;text-align:left"
      onclick="spCombatItem('${i}')"><strong>${it.icon} ${esc(it.nm)}</strong><br><span class="note">${esc(it.ds)}</span></button>`;
  }).join("");
  return `<div class="panel">
    <div class="eyebrow l">Wat doe je?</div>
    ${Object.entries(SP_COMBAT_VORMEN).map(([id,v])=>knop(id,v)).join("")}
    ${knop("verdedig",{icon:"🛡️",nm:"Verdedigen",ds:"Een lichte vraag; bij een goed antwoord halveer je de volgende aanval en laad je snel op."})}
    ${vaardigheid ? `<button class="btn ${kanVaardigheid?"btn-gold":"btn-ghost"} btn-block" style="margin-top:8px;text-align:left"
        ${kanVaardigheid?"":"disabled"} onclick="spCombatVaardigheid()">
        <strong>${vaardigheid.icon} ${esc(vaardigheid.nm)}</strong><br>
        <span class="note">${esc(vaardigheid.ds)}${SP_COMBAT.vaardigheidGebruikt?" — al gebruikt dit gevecht"
          :" — kost "+SP_COMBAT_VAARDIGHEID_KOST+" vastberadenheid"}</span></button>` : ""}
    ${items}
  </div>`;
}

function spCombatVraagHTML(){
  const q = SP_COMBAT.question;
  if(q.invoer==="mc"){
    const opts = q.opties.map((o,i)=>
      `<button class="btn btn-ghost btn-block lg" style="margin-top:8px;text-align:left" onclick="spCombatAntwoordMC(${i})">${esc(o)}</button>`
    ).join("");
    return `<div class="panel">
      <div class="eyebrow l">${esc(SP_COMBAT.vorm.icon+" "+SP_COMBAT.vorm.nm)}</div>
      <p style="font-weight:700;margin:4px 0">${q.vraag}</p>
      ${opts}
    </div>`;
  }
  const grieks = q.invoer==="typed-greek";
  return `<div class="panel">
      <div class="eyebrow l">${esc(SP_COMBAT.vorm.icon+" "+SP_COMBAT.vorm.nm)}</div>
      <p style="font-weight:700;margin:4px 0">${q.vraag}</p>
      <input id="spCombatInput" type="text" ${grieks?'inputmode="none" readonly':'autocomplete="off" autocapitalize="off" spellcheck="false"'}
        value="" style="font-size:22px;text-align:center;letter-spacing:2px${grieks?";cursor:default":""}"
        placeholder="${grieks?"gebruik het Griekse toetsenbord hieronder…":"typ de vorm…"}">
    </div>
    ${grieks?spCombatGreekKeyboardHTML():""}
    <button class="btn btn-gold btn-block lg" onclick="spCombatAntwoordGetypt()">Controleren</button>`;
}
// Zelfde toetsen als spGreekKeyboardHTML() (de puzzels), maar gekoppeld aan
// het combat-invoerveld. Bewust een eigen functie i.p.v. de puzzelversie
// parametriseren: die wordt door zes puzzeltypes gedeeld en moet stabiel
// blijven.
function spCombatGreekKeyboardHTML(){
  const letterRows = SP_GREEK_KB_ROWS.map(row=>
    `<div style="display:flex;flex-wrap:wrap;gap:4px;justify-content:center;margin-bottom:4px">
      ${row.map(ch=>`<button class="btn" style="min-width:34px;padding:8px 0;font-size:18px" onclick="spCombatGreekKey('${ch}')">${ch}</button>`).join("")}
    </div>`).join("");
  return `<div class="panel">
    ${letterRows}
    <div style="display:flex;flex-wrap:wrap;gap:4px;justify-content:center;margin-top:6px">
      <button class="btn btn-ghost" title="Spiritus lenis (op de laatste klinker)" onclick="spCombatGreekModifier('smooth')">᾿</button>
      <button class="btn btn-ghost" title="Spiritus asper (op de laatste klinker)" onclick="spCombatGreekModifier('rough')">῾</button>
      <button class="btn btn-ghost" title="Iota subscriptum (op α/η/ω)" onclick="spCombatGreekModifier('iota')">ι&#x0345;</button>
      <button class="btn btn-ghost" onclick="spCombatGreekBackspace()">⌫</button>
    </div>
  </div>`;
}

SCREENS.spCombat = function(){
  if(!SP_COMBAT){ go("spSlots"); return; }
  const enemy = SP_COMBAT_ENEMIES[SP_COMBAT.enemyId];

  // ---- Intro-kaart: de intro-tekst stond al jaren in de data maar werd
  // nergens getoond. Nu opent elk gevecht ermee.
  if(SP_COMBAT.fase==="intro"){
    H(brand(true)+`
    <div class="scrhead">${spBackToMenuButtonHTML()}<h2>${esc(SP_COMBAT.sceneTitle||enemy.nm)}</h2>${spCombatAnimToggleHTML()}${spAudioToggleHTML()}</div>
    <div class="panel" style="text-align:center">
      ${spCombatSpriteHTML(enemy)}
      <h3 style="margin:8px 0 4px">${esc(enemy.nm)}</h3>
      <p class="note" style="text-align:left">${esc(enemy.intro||"")}</p>
    </div>
    <button class="btn btn-gold btn-block lg" onclick="spCombatBegin()">Stel je op</button>
    ${foot()}`);
    return;
  }

  // ---- Opvangscène bij Vigor 0 ----
  if(SP_COMBAT.fase==="opvang"){
    H(brand(true)+`
    <div class="scrhead">${spBackToMenuButtonHTML()}<h2>${esc(SP_COMBAT.sceneTitle||enemy.nm)}</h2>${spCombatAnimToggleHTML()}${spAudioToggleHTML()}</div>
    <div class="panel">
      <div class="eyebrow l">Je bent op</div>
      <p>${esc(SP_COMBAT.opvangTekst)}</p>
      <p class="note">${esc(SP_COMBAT.opvangGevolg)}</p>
    </div>
    <button class="btn btn-gold btn-block lg" onclick="spCombatOpvangVerder()">Overeind komen</button>
    ${foot()}`);
    return;
  }

  // ---- Einde ----
  if(SP_COMBAT.fase==="einde"){
    const r = SP_COMBAT.rang;
    const totaal = SP_COMBAT.goed + SP_COMBAT.fout;
    H(brand(true)+`
    <div class="scrhead"><h2>${esc(enemy.nm)} verslagen</h2>${spAudioToggleHTML()}</div>
    <div class="panel" style="text-align:center">
      <div style="font-size:30px;letter-spacing:4px">${"⭐".repeat(r.sterren)}${"☆".repeat(3-r.sterren)}</div>
      <h3 style="margin:6px 0 2px;color:var(--hi-bright)">${esc(r.nm)}</h3>
      <p class="note">${esc(r.ds)}</p>
      <p class="note" style="margin-top:10px">
        ${SP_COMBAT.goed} van ${totaal} antwoorden juist · ${SP_COMBAT.beurt} beurten ·
        ${SP_COMBAT.vigorVerloren} Vigor verloren</p>
    </div>
    <button class="btn btn-gold btn-block lg" onclick="spCombatVerder()">Verder</button>
    ${foot()}`);
    setTimeout(spCombatSpeelFx, 30);
    return;
  }

  // ---- Slagveld (fase "keuze" en "vraag") ----
  const hpPct = Math.max(0, Math.round(SP_COMBAT.hp/SP_COMBAT.maxHp*100));
  const comboActief = SP_COMBAT.combo >= SP_COMBAT_COMBO_DREMPEL;
  H(brand(true)+`
  <div class="scrhead">${spBackToMenuButtonHTML()}<h2>${esc(SP_COMBAT.sceneTitle||enemy.nm)}</h2>${spCombatAnimToggleHTML()}${spAudioToggleHTML()}</div>
  <div class="panel" style="position:relative;overflow:hidden">
    <div id="spCombatFx" style="position:absolute;inset:0;pointer-events:none;overflow:hidden;z-index:10"></div>
    <div style="display:flex;align-items:flex-end;justify-content:space-between;gap:8px;min-height:120px">
      <div id="spCombatHeld" style="flex:0 0 auto">${spCombatHeldHTML()}</div>
      <div id="spCombatVijand" style="flex:0 0 auto">${spCombatSpriteHTML(enemy)}</div>
    </div>
    <div style="display:flex;gap:12px;margin-top:8px">
      <div style="flex:1">
        <div class="eyebrow l" style="margin:0">Jij${comboActief?` · <span style="color:var(--hi-bright)">combo ×${SP_COMBAT.combo}</span>`:""}</div>
        ${spCombatBalkHTML("Vigor", SP_COMBAT.vigor, SP_COMBAT.maxVigor, "var(--green-bright,#3f9d52)", true)}
        ${spCombatBalkHTML("Vastberadenheid", SP_COMBAT.vb, SP_COMBAT_MAX_VB, "var(--hi,#c8a24a)")}
      </div>
      <div style="flex:1">
        <div class="eyebrow l" style="margin:0">${esc(enemy.nm)}</div>
        ${spCombatBalkHTML("Levenspunten", SP_COMBAT.hp, SP_COMBAT.maxHp, "var(--hi-bright,#e8c77e)", true)}
        ${hpPct<=30?`<div class="note" style="color:var(--hi-bright)">Hij wankelt.</div>`:""}
      </div>
    </div>
    ${spCombatIntentHTML()}
    ${SP_COMBAT.schildmuur?`<div class="note" style="color:var(--hi-bright);margin-top:4px">🛡️ Schildmuur actief (${SP_COMBAT.schildmuur} aanval${SP_COMBAT.schildmuur===1?"":"len"})</div>`:""}
    ${SP_COMBAT.zwakpunt?`<div class="note" style="color:var(--hi-bright);margin-top:4px">🎯 Zwak punt gezien — je volgende treffer telt dubbel</div>`:""}
  </div>
  ${SP_COMBAT.bericht?`<div class="panel"><p class="note" style="margin:0">${SP_COMBAT.bericht}</p></div>`:""}
  ${SP_COMBAT.uitleg?`<div class="panel" style="border-left:3px solid var(--hi)"><div class="eyebrow l">Even meekijken</div><p class="note" style="margin:0">${SP_COMBAT.uitleg}</p></div>`:""}
  ${SP_COMBAT.fase==="vraag" ? spCombatVraagHTML() : spCombatKeuzeHTML()}
  ${foot()}`);
  setTimeout(spCombatSpeelFx, 30);
};
function spCombatBegin(){
  if(!SP_COMBAT) return;
  SP_COMBAT.fase = "keuze";
  SCREENS.spCombat();
}

/* ---- RACE-BRIDGE — Atalanta's wedloop (Hoofdstuk 16, Gerbens verzoek
   2026-08-09), rechtstreeks een reskin van Combat-bridge hierboven: zelfde
   vraag-uit-SP_STATE.vocab-motor (spRaceNextQuestion is een kopie van
   spCombatNextQuestion, inclusief dezelfde taalspoor-filter), maar met
   "voortgang richting finish" i.p.v. HP, en een periodiek "gooi een gouden
   appel"-keuzemoment i.p.v. een aanval-knop — dat spiegelt de mythe zelf:
   op pure snelheid wint Hippomenes nooit (de tegenstander legt sowieso
   meer afstand af per beurt), alleen door Aphrodites drie appels slim in
   te zetten kán het. SP_RACE is, net als SP_COMBAT/SP_CHECK_RESULTAAT,
   bewust GEEN onderdeel van SP_STATE/localStorage. Generiek opgezet
   (SP_RACES, niet hardcoded op Atalanta) zodat een volgend hoofdstuk
   dezelfde bridge kan hergebruiken voor een andere wedloop. ---- */
let SP_RACE = null;
function spStartRaceFromScene(scene){
  const raceId = scene.meta.RACE.trim();
  const race = SP_RACES[raceId];
  const target = scene.choices[0]?.target;
  if(!race){ console.error("Onbekende race:", raceId); return spGoCns(target); }
  SP_RACE = { raceId, player:0, opponent:0, applesLeft:race.appleCount, questionsAnswered:0, question:null, offerApple:false, sceneTitle:scene.title };
  spRaceNextQuestion();
  SCREENS.spRace();
}
// Identieke bron/taalspoor-filter als spCombatNextQuestion — zie de
// toelichting daar.
function spRaceNextQuestion(){
  const ids = (SP_STATE.vocab&&SP_STATE.vocab.length) ? SP_STATE.vocab : Object.keys(SP_VOCAB_ENTRIES);
  let entries = ids.map(id=>SP_VOCAB_ENTRIES[id]).filter(Boolean);
  const spoor = SP_STATE.flags?.taalspoor;
  if(spoor==="latijn" || spoor==="grieks"){
    const eigenTaal = spoor==="latijn" ? "latijn" : "grieks";
    const gefilterd = entries.filter(e => e.taal===eigenTaal);
    if(gefilterd.length) entries = gefilterd;
  }
  const w = pick(entries);
  const correct = w.betekenis;
  // Zelfde vorm-gebaseerde afleiderselectie als spCombatNextQuestion hierboven
  // (leerlingfeedback 2026-08-13) — voorkomt dat het goede antwoord al puur op
  // vorm (bv. woordaantal) opvalt tussen de afleiders.
  const woordAantal = s => (s||"").trim().split(/\s+/).length;
  const correctWC = woordAantal(correct);
  const kandidaten = entries.filter(x=>x!==w).map(x=>x.betekenis)
    .filter((v,i,a)=>v!==correct && a.indexOf(v)===i);
  let vormPool = kandidaten.filter(v=>woordAantal(v)===correctWC);
  if(vormPool.length<3) vormPool = kandidaten.filter(v=>Math.abs(woordAantal(v)-correctWC)<=1);
  if(vormPool.length<3) vormPool = kandidaten;
  const distractors = shuffle(vormPool).slice(0,3);
  SP_RACE.question = { woord:w.woord, correct, options:shuffle([correct, ...distractors]) };
}
// Checkt na elke beurt of de finish al bereikt is. Uitkomst hangt af van
// hoeveel appels er nog OVER zijn bij winst — hoe minder appels nodig
// waren, hoe knapper de overwinning (net als de vier CHECK-uitkomsten
// elders: geen aparte "faal"-schermen, gewoon een ander vervolg).
function spRaceFinishCheck(){
  const race = SP_RACES[SP_RACE.raceId];
  if(SP_RACE.opponent < race.finish && SP_RACE.player < race.finish) return false;
  let outcome;
  // Gelijkspel (of tegenstander eerder/tegelijk) telt als verlies — de
  // tegenstander loopt bij gelijke pas altijd exact gelijk op (zelfde
  // stepCorrect/opponentStep), dus alleen de appels kunnen die balans
  // echt doorbreken, nooit vocab-snelheid alleen.
  if(SP_RACE.opponent >= race.finish){
    outcome = "gefaald";
  } else if(SP_RACE.applesLeft >= 2){
    outcome = "kritiek";
  } else if(SP_RACE.applesLeft === 1){
    outcome = "vol";
  } else {
    outcome = "deels";
  }
  const target = race.targets[outcome];
  SP_RACE = null;
  spGoCns(target);
  return true;
}
function spRaceAnswer(idx){
  const race = SP_RACES[SP_RACE.raceId];
  const q = SP_RACE.question;
  const correct = q.options[idx]===q.correct;
  SP_RACE.opponent += race.opponentStep;
  if(correct){
    SP_RACE.player += race.stepCorrect;
    toast("Juist!", esc(race.playerNm)+" zet een stap voorwaarts.");
  } else {
    toast("Niet juist", "Het juiste antwoord was \""+q.correct+"\" — "+esc(race.nm)+" loopt verder uit.");
  }
  SP_RACE.questionsAnswered += 1;
  if(spRaceFinishCheck()) return;
  if(SP_RACE.questionsAnswered % 2 === 0 && SP_RACE.applesLeft > 0) SP_RACE.offerApple = true;
  spRaceNextQuestion();
  SCREENS.spRace();
}
function spRaceThrowApple(){
  const race = SP_RACES[SP_RACE.raceId];
  if(!SP_RACE || !SP_RACE.applesLeft) return;
  SP_RACE.applesLeft -= 1;
  SP_RACE.opponent = Math.max(0, SP_RACE.opponent - race.appleSetback);
  SP_RACE.offerApple = false;
  toast("Een gouden appel!", esc(race.nm)+" buigt af om hem op te rapen — kostbare tijd verloren.");
  if(spRaceFinishCheck()) return;
  SCREENS.spRace();
}
function spRaceSkipApple(){
  if(!SP_RACE) return;
  SP_RACE.offerApple = false;
  SCREENS.spRace();
}
// Zelfde vrijstaande-sprite-truc als spCombatSpriteHTML, zonder de
// koppen-stapeling (die is Hydra/Boss Battle-specifiek).
function spRaceSpriteHTML(race){
  if(!race.img) return `<span style="font-size:40px">${race.icon}</span>`;
  return `<div style="position:relative;width:min(220px,60vw);aspect-ratio:1/1;margin:0 auto">
    <img src="${esc(race.img)}" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain"
      onerror="this.parentElement.innerHTML='<span style=&quot;font-size:40px&quot;>${esc(race.icon)}</span>'">
  </div>`;
}
SCREENS.spRace = function(){
  if(!SP_RACE){ go("spSlots"); return; }
  const race = SP_RACES[SP_RACE.raceId];
  const playerPct = Math.max(0, Math.min(100, Math.round(SP_RACE.player/race.finish*100)));
  const opponentPct = Math.max(0, Math.min(100, Math.round(SP_RACE.opponent/race.finish*100)));
  if(SP_RACE.offerApple){
    H(brand(true)+`
    <div class="scrhead">${spBackToMenuButtonHTML()}<h2>${esc(SP_RACE.sceneTitle||race.nm)}</h2>${spAudioToggleHTML()}</div>
    <div class="panel" style="text-align:center">
      ${spRaceSpriteHTML(race)}
      <p class="note">Je hebt nog ${SP_RACE.applesLeft} gouden ${SP_RACE.applesLeft===1?"appel":"appels"} van Aphrodite.</p>
      <p style="font-weight:700">Gooi je er een opzij om ${esc(race.nm)} af te leiden?</p>
    </div>
    <button class="btn btn-gold btn-block lg" onclick="spRaceThrowApple()">🍎 Gooi de appel</button>
    <button class="btn btn-ghost btn-block" style="margin-top:8px" onclick="spRaceSkipApple()">Bewaar hem, ren door</button>
    ${foot()}`);
    return;
  }
  const q = SP_RACE.question;
  const optsHTML = q.options.map((o,i)=>
    `<button class="btn btn-ghost btn-block lg" style="margin-top:8px;text-align:left" onclick="spRaceAnswer(${i})">${esc(o)}</button>`
  ).join("");
  H(brand(true)+`
  <div class="scrhead">${spBackToMenuButtonHTML()}<h2>${esc(SP_RACE.sceneTitle||race.nm)}</h2>${spAudioToggleHTML()}</div>
  <div class="panel" style="text-align:center">
    ${spRaceSpriteHTML(race)}
    <div class="eyebrow l" style="margin-top:6px">${esc(race.nm)} vs. ${esc(race.playerNm)}</div>
    <div style="height:10px;background:rgba(255,255,255,.12);border-radius:6px;overflow:hidden;margin:6px 0">
      <div style="height:100%;width:${opponentPct}%;background:#c65b4e"></div>
    </div>
    <p class="note" style="margin:0">${esc(race.nm)}</p>
    <div style="height:10px;background:rgba(255,255,255,.12);border-radius:6px;overflow:hidden;margin:6px 0">
      <div style="height:100%;width:${playerPct}%;background:var(--hi-bright,#e8c77e)"></div>
    </div>
    <p class="note" style="margin:0">${esc(race.playerNm)} — nog ${SP_RACE.applesLeft} appel(s) over</p>
  </div>
  <div class="panel">
    <p style="font-weight:700;margin-bottom:4px">Wat betekent <em>${esc(q.woord)}</em>?</p>
    ${optsHTML}
  </div>
  ${foot()}`);
};

/* ---- B29a: DE VIER-UITKOMSTEN-LADDER ("CHECK:", Chronica.md §11.4) — een
   spaarzaam, dramatisch dobbelmechanisme, los van de bestaande gated choice
   (drempel, geen dobbelsteen, altijd zichtbaar — zie §11.4). Gebouwd op
   verzoek (2026-07-30), NOG NERGENS INGEZET: SP_CHECKS (singleplayer-data.js)
   is bewust leeg, klaar voor de eerste echte check zodra bepaald is WAAR.
   Net als PUZZLE/COMBAT een early-return in SCREENS.spPlay — een
   CHECK-scène heeft daarom BEWUST geen CHOICES: de worp zelf bepaalt de
   vervolgscène via de vier takken in SP_CHECKS[checkId], niet de speler.
   SP_CHECK_RESULTAAT is, net als SP_COMBAT, bewust GEEN onderdeel van
   SP_STATE/localStorage: een worp is een kort moment, geen opgeslagen
   voortgang. ---- */
let SP_CHECK_RESULTAAT = null;
// Node-id waarvan de tekst zojuist al op het worp-resultaatscherm stond (zie
// spStartCheckFromScene) — SCREENS.spPlay slaat die tekst dan één keer over
// zodat de speler 'm niet meteen daarna nogmaals leest.
let SP_CHECK_JUST_NARRATED = null;
// 1d20 + stat tegen een DC. "kritiek" bij een natuurlijke 1, ALTIJD — ook bij
// een hoge stat blijft een fumble een fumble, precies het soort verrassing
// die audit-bevinding "is falen interessant?" nodig heeft. "volledig" bij
// een natuurlijke 20 of een totaal van dc+5 of meer. Daartussenin: "deels"
// zodra de dc gehaald wordt, "gefaald" tot 5 punten eronder.
function spRollCheck(statKey, dc){
  const roll = 1 + Math.floor(Math.random()*20);
  const stat = SP_STATE.stats?.[statKey] || 0;
  // D&D-stijl modifier, niet de ruwe ability score zelf (die loopt van 8
  // t/m 20 en zou elke DC 13-17 vrijwel altijd triviaal halen): (stat-10)/2,
  // naar beneden afgerond — 8→-1, 10→0, 15→+2, 20→+5.
  const mod = Math.floor((stat-10)/2);
  const total = roll + mod;
  let uitkomst;
  if(roll===1) uitkomst = "kritiek";
  else if(roll===20 || total>=dc+5) uitkomst = "volledig";
  else if(total>=dc) uitkomst = "deels";
  else if(total>=dc-5) uitkomst = "gefaald";
  else uitkomst = "kritiek";
  return { roll, stat, mod, total, dc, uitkomst };
}
// Leerlingfeedback (2026-08-13): de worp zelf toonde geen verhalende tekst,
// puur het mechanische resultaat — "komt een beetje raar over in het
// verhaal". Geen enkele SP_CHECKS-tak had ooit een eigen `tekst` (allemaal
// alleen `target`), dus val terug op de tekst van de doelscène zelf: die
// bestaat voor elke uitkomst al (CH..._VOL/DEELS/GEFAALD/KRITIEK), en zo
// krijgt de speler meteen op hetzelfde scherm een korte alinea bij de worp,
// vóór hij op "Ga verder" klikt — precies zoals besproken.
function spStartCheckFromScene(scene){
  const checkId = scene.meta.CHECK.trim();
  const check = SP_CHECKS[checkId];
  if(!check){ console.error("Onbekende check:", checkId); return spGoCns(scene.choices[0]?.target); }
  const resultaat = spRollCheck(check.stat, check.dc);
  const tak = check[resultaat.uitkomst];
  const tekst = tak?.tekst || SP_SCENES.get(tak?.target)?.text;
  SP_CHECK_RESULTAAT = { ...resultaat, checkId, sceneTitle:scene.title, tekst, target:tak?.target };
  SCREENS.spCheck();
}
SCREENS.spCheck = function(){
  const r = SP_CHECK_RESULTAAT;
  if(!r){ go("spSlots"); return; }
  const uitkomstLabel = { volledig:"Volledig geslaagd", deels:"Deels geslaagd", gefaald:"Gefaald", kritiek:"Kritiek gefaald" }[r.uitkomst];
  H(brand(true)+`
  <div class="scrhead">${spBackToMenuButtonHTML()}<h2>${esc(SpTextResolver.resolve(r.sceneTitle||"Beproeving", SP_STATE))}</h2>${spAudioToggleHTML()}</div>
  <div class="panel" style="text-align:center">
    <div class="eyebrow l">Worp</div>
    <p class="note">1d20 (${r.roll}) ${r.mod>=0?"+":"-"} ${Math.abs(r.mod)} = ${r.total} tegen DC ${r.dc}</p>
    <p style="font-weight:700;margin-top:8px">${esc(uitkomstLabel)}</p>
  </div>
  ${r.tekst?`<div class="panel">${spParagraphsHTML(r.tekst, SP_STATE)}</div>`:""}
  <button class="btn btn-gold btn-block lg" onclick="spCheckContinue()">Ga verder</button>
  ${foot()}`);
};
function spCheckContinue(){
  const target = SP_CHECK_RESULTAAT?.target;
  SP_CHECK_RESULTAAT = null;
  SP_CHECK_JUST_NARRATED = target;
  spGoCns(target);
}
