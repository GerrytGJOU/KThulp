/* ============================================================================
   WORDLISTS — "Eigen Lijst": een persistente, door de docent beheerde
   woordenlijst-bibliotheek, als derde bron naast frequentielijst/werkwoords-
   vormen. Wordt gedeeld door games.js (Touwtrekken/Marathon/Snelvuur/Battle
   Mode), training.js en freepractice.js — elk geeft zijn eigen *_DRAFT-
   variabele en herrenderfunctie mee als letterlijke JS-uitdrukkingen
   (draftExpr/rerenderExpr), zelfde patroon als vfqFilterHTML() in verbquiz.js.

   Opslag: teachers/{uid}/wordlists/{listId} (alleen de docent zelf, via de
   bestaande teachers/$uid-rule). Bij shared:true spiegelt FBNet.saveWordlist
   de lijst naar klascodes/{code}/wordlists/{listId} voor elke klas van de
   docent — dat pad is voor iedereen leesbaar (zelfde gedeeld-geheim-patroon
   als identities/{klas}), zodat leerlingen 'm zonder docent-login kunnen
   opzoeken via hun klascode in Training/Vrij oefenen. Voor de groepsspellen
   (Touwtrekken t/m Battle Mode/Boss Battle/Total War) is die spiegeling niet
   eens nodig: de docent bouwt de pool bij het hosten en die gaat als geheel
   de room in (rooms/{code}/pool), leerlingen lezen daar gewoon uit.

   Een geselecteerde lijst wordt op de host-draft gezet als:
     draft.customWords     = [{la,nl,pos}, ...]  (buildPool() leest dit, core.js)
     draft.customListId    = listId (of null voor "niet opgeslagen")
     draft.customListName  = naam (voor weergave)
     draft.lang             = taal van de lijst
   ============================================================================ */
"use strict";

let WL_MINE = null;          // cache: {listId:{name,lang,words,shared,...}} van de ingelogde docent
let WL_MINE_LOADING = false;
let WL_SHARED = null;        // {code, lists:{listId:{...}}} — leerlingkant
let WL_UI = { mode:"browse", editId:null, draft:null }; // mode: browse | form

function wlRerender(rerenderExpr){ try{ new Function(rerenderExpr)(); }catch(e){} }

/* ---- hoofdingang: bepaalt docent- of leerlingweergave ---- */
function wlManagerHTML(draft, draftExpr, rerenderExpr){
  // Net wordt in games.js normaal pas vlak vóór een Firebase-actie gekozen
  // (chooseNet(), bv. bij createRoom); Training/Vrij oefenen deden tot nu toe
  // nooit iets met Net. Hier is 'm meteen nodig zodra het paneel opent.
  if(!Net && typeof chooseNet==="function") chooseNet();
  return Net.isTeacherLoggedIn()
    ? wlTeacherHTML(draft, draftExpr, rerenderExpr)
    : wlStudentHTML(draft, draftExpr, rerenderExpr);
}

/* ---------------------------------------------------------------------------
   DOCENT: bladeren door eigen lijsten, nieuwe aanmaken, bewerken, verwijderen
   ------------------------------------------------------------------------- */
function wlTeacherHTML(draft, draftExpr, rerenderExpr){
  if(WL_MINE===null){
    if(!WL_MINE_LOADING){
      WL_MINE_LOADING=true;
      Net.getWordlists().then(lists=>{ WL_MINE=lists||{}; WL_MINE_LOADING=false; wlRerender(rerenderExpr); })
        .catch(()=>{ WL_MINE={}; WL_MINE_LOADING=false; wlRerender(rerenderExpr); });
    }
    return `<div class="panel"><div class="note">Je lijsten worden geladen…</div></div>`;
  }
  if(WL_UI.mode==="form") return wlFormHTML(draft, draftExpr, rerenderExpr);
  const ids = Object.keys(WL_MINE);
  const rows = ids.length ? ids.map(id=>wlListRowHTML(id, WL_MINE[id], draft, draftExpr, rerenderExpr, false)).join("")
    : `<div class="note">Je hebt nog geen eigen lijsten. Maak er hieronder één aan.</div>`;
  return `<div class="panel">
    <label class="fld">Mijn lijsten</label>
    ${rows}
    <button class="btn btn-ghost btn-block" style="margin-top:10px" onclick="wlOpenNew('${draftExpr}','${rerenderExpr}')">➕ Nieuwe lijst</button>
  </div>`;
}

function wlListRowHTML(id, list, draft, draftExpr, rerenderExpr, readOnly){
  const active = draft.customListId===id;
  const langNm = list.lang==="el" ? "Grieks" : "Latijn";
  const n = list.words ? Object.keys(list.words).length : 0;
  const editBtns = readOnly ? "" : `
      <button class="btn-icon" title="Bewerken" onclick="event.stopPropagation();wlOpenEdit('${draftExpr}','${rerenderExpr}','${id}')">✎</button>
      <button class="btn-icon" title="Verwijderen" onclick="event.stopPropagation();wlDeleteList('${draftExpr}','${rerenderExpr}','${id}')">🗑</button>`;
  return `<div class="wl-row ${active?'active':''}" onclick="wlSelectList('${draftExpr}','${rerenderExpr}','${id}',${readOnly})">
    <div class="wl-row-main">
      <div class="wl-row-name">${esc(list.name||"(naamloos)")}</div>
      <div class="wl-row-sub">${langNm} · ${n} woorden${list.shared?" · gedeeld met leerlingen":""}</div>
    </div>
    <div class="wl-row-actions">${active?'<span class="wl-active-badge">gekozen</span>':''}${editBtns}</div>
  </div>`;
}

function wlOpenNew(draftExpr, rerenderExpr){
  WL_UI = { mode:"form", editId:null, draft:{ name:"", lang:"la", shared:false, rawText:"", msg:"" } };
  wlRerender(rerenderExpr);
}
function wlOpenEdit(draftExpr, rerenderExpr, listId){
  const list = WL_MINE[listId]; if(!list) return;
  const words = Array.isArray(list.words) ? list.words : Object.values(list.words||{});
  const rawText = words.map(w=>w.la+" = "+w.nl).join("\n");
  WL_UI = { mode:"form", editId:listId, draft:{ name:list.name||"", lang:list.lang||"la", shared:!!list.shared, rawText, msg:"" } };
  wlRerender(rerenderExpr);
}
function wlCancelForm(rerenderExpr){ WL_UI={mode:"browse", editId:null, draft:null}; wlRerender(rerenderExpr); }
function wlFormSetLang(lang, rerenderExpr){ WL_UI.draft.lang=lang; wlRerender(rerenderExpr); }

function wlFormHTML(draft, draftExpr, rerenderExpr){
  const d = WL_UI.draft;
  return `<div class="panel">
    <label class="fld">${WL_UI.editId?"Lijst bewerken":"Nieuwe lijst"}</label>
    <input type="text" placeholder="Naam van de lijst, bv. Hoofdstuk 5 — woorden" value="${esc(d.name)}" oninput="WL_UI.draft.name=this.value">
    <div class="chips" style="margin-top:10px">
      <button class="chip ${d.lang==='la'?'on':''}" onclick="wlFormSetLang('la','${rerenderExpr}')">Latijn</button>
      <button class="chip ${d.lang==='el'?'on':''}" onclick="wlFormSetLang('el','${rerenderExpr}')">Grieks</button>
    </div>
    <label class="fld" style="margin-top:14px">Woorden — één per regel: <b>woord = betekenis</b></label>
    <textarea id="wlBox" placeholder="servus = slaaf&#10;amo = liefhebben, houden van&#10;μάχη = strijd, gevecht" oninput="WL_UI.draft.rawText=this.value">${esc(d.rawText)}</textarea>
    <div class="note" style="margin:10px 0">Of upload een bestand (.csv, .txt of Excel .xlsx) met het woord in kolom 1 en de betekenis in kolom 2.</div>
    <label class="filepick"><span>📄 Bestand kiezen</span>
      <input type="file" accept=".csv,.txt,.tsv,.xlsx,.xls" onchange="wlFormHandleFile(this,'${rerenderExpr}')"></label>
    <div class="note" style="margin-top:8px">${esc(d.msg||"")}</div>
    <label class="wl-share-row" style="display:flex;align-items:center;gap:8px;margin-top:14px">
      <input type="checkbox" ${d.shared?"checked":""} onchange="WL_UI.draft.shared=this.checked">
      <span>Delen met mijn leerlingen (zichtbaar in Training/Vrij oefenen via hun klascode)</span>
    </label>
    <div class="row" style="margin-top:14px;gap:10px">
      <button class="btn btn-ghost" onclick="wlCancelForm('${rerenderExpr}')">Annuleren</button>
      <button class="btn btn-gold" onclick="wlFormSave('${draftExpr}','${rerenderExpr}')">Opslaan en gebruiken</button>
    </div>
  </div>`;
}

function wlFormHandleFile(input, rerenderExpr){
  const file=input.files&&input.files[0]; if(!file) return;
  WL_UI.draft.msg="Bestand lezen…"; wlRerender(rerenderExpr);
  const name=(file.name||"").toLowerCase();
  const reader=new FileReader();
  const done=lines=>{ WL_UI.draft.rawText=lines.join("\n"); WL_UI.draft.msg="Ingelezen: "+lines.length+" woorden."; wlRerender(rerenderExpr); };
  reader.onerror=()=>{ WL_UI.draft.msg="Kon het bestand niet lezen."; wlRerender(rerenderExpr); };
  if(name.endsWith(".xlsx")||name.endsWith(".xls")){
    loadSheetJS().then(XLSX=>{
      reader.onload=e=>{ try{
        const wb=XLSX.read(new Uint8Array(e.target.result),{type:"array"});
        const rows=XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]],{header:1,defval:""});
        done(wlIngestRows(rows));
      }catch(err){ WL_UI.draft.msg="Kon het Excel-bestand niet lezen."; wlRerender(rerenderExpr); } };
      reader.readAsArrayBuffer(file);
    }).catch(()=>{ WL_UI.draft.msg="Excel vereist internet. Plak de woorden anders als tekst."; wlRerender(rerenderExpr); });
  } else {
    reader.onload=e=>{ try{
      const text=e.target.result, sep=text.indexOf("\t")>=0?"\t":(text.indexOf(";")>=0?";":",");
      done(wlIngestRows(text.split(/\r?\n/).map(l=>l.split(sep))));
    }catch(err){ WL_UI.draft.msg="Kon het bestand niet lezen."; wlRerender(rerenderExpr); } };
    reader.readAsText(file);
  }
}
// Zelfde kolom-sniffing-conventie als games.js' ingestRows (header met
// "lat/grie/woord" en "vert/betek/meaning", anders kolom 1/2) — hier
// teruggegeven als lijst regels i.p.v. direct in een DRAFT-veld gezet.
function wlIngestRows(rows){
  if(!rows||!rows.length) return [];
  let la=0,nl=1,start=0;
  const head=rows[0].map(c=>String(c||"").toLowerCase());
  const fi=head.findIndex(h=>/lat|grie|woord/.test(h)), ni=head.findIndex(h=>/vert|betek|meaning/.test(h));
  if(fi>=0&&ni>=0){ la=fi;nl=ni;start=1; } else if(head.some(h=>/[a-zα-ω]/.test(h))){ start=1; }
  const lines=[];
  for(let r=start;r<rows.length;r++){ const row=rows[r]; if(!row) continue;
    const a=String(row[la]==null?"":row[la]).trim(), b=String(row[nl]==null?"":row[nl]).trim();
    if(a&&b) lines.push(a+" = "+b);
  }
  return lines;
}

function wlFormSave(draftExpr, rerenderExpr){
  const d = WL_UI.draft;
  const name = (d.name||"").trim();
  if(!name){ toast("Geef een naam","Elke lijst heeft een naam nodig."); return; }
  const words = parseCustom(d.rawText);
  if(words.length<1){ toast("Geen woorden","Plak of upload eerst woorden voordat je opslaat."); return; }
  toast("Bezig", "Lijst wordt opgeslagen…");
  Net.saveWordlist(WL_UI.editId, { name, lang:d.lang, words, shared:!!d.shared }).then(id=>{
    WL_MINE = WL_MINE || {};
    WL_MINE[id] = { name, lang:d.lang, words, shared:!!d.shared, updatedAt:Date.now() };
    const draft = new Function("return "+draftExpr)();
    draft.customWords = words; draft.customListId = id; draft.customListName = name; draft.lang = d.lang;
    WL_UI = { mode:"browse", editId:null, draft:null };
    toast("Opgeslagen", "\""+name+"\" is opgeslagen"+(d.shared?" en gedeeld met je leerlingen.":"."));
    wlRerender(rerenderExpr);
  }).catch(err=>{ toast("Opslaan mislukt", String(err&&err.message||err)); });
}

function wlSelectList(draftExpr, rerenderExpr, listId, fromShared){
  const src = fromShared ? (WL_SHARED&&WL_SHARED.lists) : WL_MINE;
  const list = src && src[listId]; if(!list) return;
  const words = Array.isArray(list.words) ? list.words : Object.values(list.words||{});
  const draft = new Function("return "+draftExpr)();
  draft.customWords = words; draft.customListId = listId; draft.customListName = list.name; draft.lang = list.lang;
  wlRerender(rerenderExpr);
}

function wlDeleteList(draftExpr, rerenderExpr, listId){
  const list = WL_MINE[listId]; if(!list) return;
  if(!confirm("Lijst \""+(list.name||"")+"\" verwijderen? Dit kan niet ongedaan worden gemaakt.")) return;
  Net.deleteWordlist(listId).then(()=>{
    delete WL_MINE[listId];
    const draft = new Function("return "+draftExpr)();
    if(draft.customListId===listId){ draft.customWords=null; draft.customListId=null; draft.customListName=null; }
    wlRerender(rerenderExpr);
  }).catch(err=>{ toast("Verwijderen mislukt", String(err&&err.message||err)); });
}

/* ---------------------------------------------------------------------------
   LEERLING: klascode invoeren, gedeelde lijsten van de docent kiezen
   ------------------------------------------------------------------------- */
const WL_CODE_KEY = "certamen_wl_klascode";
let WL_SHARED_LOADING = false;

function wlStudentHTML(draft, draftExpr, rerenderExpr){
  const remembered = WL_SHARED ? WL_SHARED.code : (localStorage.getItem(WL_CODE_KEY)||"");
  if(WL_SHARED===null && remembered && !WL_SHARED_LOADING){
    WL_SHARED_LOADING=true;
    wlStudentSearch(remembered, draftExpr, rerenderExpr, true);
  }
  if(!WL_SHARED){
    return `<div class="panel">
      <label class="fld">Klascode van je docent</label>
      <div class="note" style="margin-bottom:10px">Vul de klascode in om de lijsten te zien die je docent met jullie heeft gedeeld.</div>
      <div class="row" style="gap:10px">
        <input type="text" id="wlCodeIn" placeholder="bv. G2A123" value="${esc(remembered)}" style="text-transform:uppercase">
        <button class="btn btn-gold" onclick="wlStudentSearch(el('wlCodeIn').value,'${draftExpr}','${rerenderExpr}')">Zoeken</button>
      </div>
    </div>`;
  }
  const ids = Object.keys(WL_SHARED.lists||{});
  const rows = ids.length ? ids.map(id=>wlListRowHTML(id, WL_SHARED.lists[id], draft, draftExpr, rerenderExpr, true)).join("")
    : `<div class="note">Deze docent heeft nog geen lijsten gedeeld.</div>`;
  return `<div class="panel">
    <label class="fld">Lijsten van je docent (${esc(WL_SHARED.code)})</label>
    ${rows}
    <button class="btn btn-ghost btn-block" style="margin-top:10px" onclick="wlResetStudentCode('${rerenderExpr}')">Andere klascode</button>
  </div>`;
}

function wlStudentSearch(code, draftExpr, rerenderExpr, silent){
  code=(code||"").trim().toUpperCase();
  if(!code){ WL_SHARED_LOADING=false; if(!silent) toast("Vul een klascode in",""); return; }
  Net.getSharedWordlists(code).then(lists=>{
    WL_SHARED = { code, lists: lists||{} };
    WL_SHARED_LOADING=false;
    localStorage.setItem(WL_CODE_KEY, code);
    wlRerender(rerenderExpr);
  }).catch(()=>{
    WL_SHARED_LOADING=false;
    if(!silent) toast("Niet gevonden","Kon geen klas met deze code vinden.");
  });
}
function wlResetStudentCode(rerenderExpr){
  WL_SHARED=null; WL_SHARED_LOADING=false; localStorage.removeItem(WL_CODE_KEY); wlRerender(rerenderExpr);
}
