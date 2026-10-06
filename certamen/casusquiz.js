/* CASUSQUIZ — vraaggenerator + selectiescherm-UI voor naamvallen (Latijn én
   Grieks), met dezelfde paradigma's als de Casus Trainers (casusdata.js).
   Naast verbquiz.js (werkwoordsvormen) de tweede vorm-gerichte bron: een
   vraag gaat over de vorm van één woord, nooit over woordkennis. Twee
   vraagvormen:
   - "det" (Vormen determineren): één vorm, de leerling geeft twee snelle
     antwoorden achter elkaar — eerst de naamval (Nom/Gen/Dat/Acc/Abl/Voc),
     dan enkelvoud/meervoud. Is een vorm meerdere naamval+getal-combinaties
     tegelijk (rosae = gen. ev., dat. ev., nom. mv.), dan telt elk daarvan goed.
   - "vorm" (Juiste vorm kiezen): "Geef de genitivus enkelvoud van rex" met
     4–6 vormen als meerkeuze.
   Wordt ná verbquiz.js en core.js geladen. */
"use strict";

const CQ_CASES = [
  {id:"nom", ab:"Nom", la:"nominativus", el:"nominatief"},
  {id:"gen", ab:"Gen", la:"genitivus",   el:"genitief"},
  {id:"dat", ab:"Dat", la:"dativus",     el:"datief"},
  {id:"acc", ab:"Acc", la:"accusativus", el:"accusatief"},
  {id:"abl", ab:"Abl", la:"ablativus",   el:null},
  {id:"voc", ab:"Voc", la:"vocativus",   el:"vocatief"},
];
const CQ_NUMS = [{id:"ev", nm:"Enkelvoud"}, {id:"mv", nm:"Meervoud"}];
const CQ_GROUP_NAMES = {
  la:{ "1":"1e declinatie (a-stammen)", "2":"2e declinatie (o-stammen)", "3":"3e declinatie", "4":"4e declinatie (u-stammen)", "5":"5e declinatie (e-stammen)" },
  el:{ A1:"1e declinatie -ᾱ", A2:"1e declinatie -η", A3:"1e declinatie -ης/-ας (m)", B1:"2e declinatie -ος", B2:"2e declinatie -ον",
       C1:"3e declinatie", C2:"3e declinatie -ις/-εως", C3:"3e declinatie -εύς" },
};
const CQ_GROUP_ORDER = { la:["1","2","3","4","5"], el:["A1","A2","A3","B1","B2","C1","C2","C3"] };
const CQ_GENUS_NL = {m:"mannelijk", f:"vrouwelijk", n:"onzijdig"};

function cqCaseNm(taal, id){ const c = CQ_CASES.find(x=>x.id===id); return c ? (taal==="el" ? c.el : c.la) : id; }
function cqCasesFor(lang){ return CQ_CASES.filter(c=> lang==="el" ? c.id!=="abl" : true); }

// Eénmalig opgebouwd: uniforme woordrecords voor beide talen.
let _CQ_WORDS = null;
function cqWords(lang){
  if(!_CQ_WORDS){
    _CQ_WORDS = { la:[], el:[] };
    for(const w of CQ_LA_WORDS){
      const f = cqLaBuildForms(w);
      // Zoals in de Latijnse Casus Trainer: vocativus alleen bij 2e-declinatie -us
      // (de enige plek waar hij van de nominativus afwijkt).
      if(!(w.dec===2 && w.hasVoc===true)){ delete f.sg.voc; delete f.pl.voc; }
      _CQ_WORDS.la.push({ id:w.id, taal:"la", grp:String(w.dec), lemma:w.nom+", "+w.gen, kort:w.nom,
        betekenis:w.vert, info:w.geslacht, forms:f });
    }
    for(const w of CQ_EL_WORDS){
      const sg = {}, pl = {};
      for(const c of ["nom","gen","dat","acc","voc"]){
        const a = w.forms[c+"_sg"], b = w.forms[c+"_pl"];
        if(a && a!=="—") sg[c] = a;
        if(b && b!=="—") pl[c] = b;
      }
      if(!pl.voc && pl.nom) pl.voc = pl.nom; // vocativus meervoud = nominativus
      _CQ_WORDS.el.push({ id:w.id, taal:"el", grp:w.type, lemma:w.gr, kort:w.gr,
        betekenis:w.nl.split(",")[0].trim(), info:w.tr+" · "+(CQ_GENUS_NL[w.genus]||w.genus), forms:{sg,pl} });
    }
  }
  return _CQ_WORDS[lang==="el"?"el":"la"];
}
function cqWordById(lang, id){ return cqWords(lang).find(w=>w.id===id); }

/* ---- Draft / selectie ---- */
// Standaard: alle woorden, nom/gen/dat/acc (+abl bij Latijn), zonder vocativus.
function cqDefaultDraft(lang){
  const cases = cqCasesFor(lang).map(c=>c.id).filter(id=>id!=="voc");
  return { lang, words: cqWords(lang).map(w=>w.id), cases, mode:"det" };
}
function cqFixDraft(cq, lang){ return (cq && cq.lang===lang) ? cq : cqDefaultDraft(lang); }
function cqToggleCase(cq, id){
  const i = cq.cases.indexOf(id);
  if(i>=0){ if(cq.cases.length>1) cq.cases.splice(i,1); } else cq.cases.push(id);
}
function cqToggleWord(cq, id){
  const i = cq.words.indexOf(id);
  if(i>=0){ if(cq.words.length>1) cq.words.splice(i,1); } else cq.words.push(id);
}
function cqSetMode(cq, mode){ cq.mode = mode; }
let CQ_EXPANDED = new Set();
function cqToggleExpand(g){ const k=String(g); if(CQ_EXPANDED.has(k)) CQ_EXPANDED.delete(k); else CQ_EXPANDED.add(k); }
function cqToggleGroup(cq, g){
  const ids = cqWords(cq.lang).filter(w=>w.grp===String(g)).map(w=>w.id);
  const allOn = ids.every(i=>cq.words.includes(i));
  if(allOn){ const rest = cq.words.filter(i=>!ids.includes(i)); if(rest.length) cq.words = rest; }
  else ids.forEach(i=>{ if(!cq.words.includes(i)) cq.words.push(i); });
}

// draftExpr/rerenderExpr: letterlijke JS-uitdrukkingen in de onclick-attributen,
// zelfde patroon als vfqFilterHTML() in verbquiz.js.
function cqFilterHTML(cq, lang, draftExpr, rerenderExpr){
  const caseChips = cqCasesFor(lang).map(c=>`<button class="chip ${cq.cases.includes(c.id)?'on':''}" onclick="cqToggleCase(${draftExpr},'${c.id}');${rerenderExpr}">${c.ab} <small>${cqCaseNm(lang,c.id)}</small></button>`).join("");
  const words = cqWords(lang);
  const groups = CQ_GROUP_ORDER[lang].map(g=>{
    const ws = words.filter(w=>w.grp===g);
    const onCount = ws.filter(w=>cq.words.includes(w.id)).length;
    const allOn = onCount===ws.length, someOn = onCount>0 && !allOn;
    const expanded = CQ_EXPANDED.has(g);
    const nm = CQ_GROUP_NAMES[lang][g];
    const gBtn = `<button class="chip ${allOn?'on':someOn?'partial':''}" onclick="cqToggleGroup(${draftExpr},'${g}');${rerenderExpr}">${esc(nm)} <small>${onCount}/${ws.length}</small></button>`;
    const xBtn = `<button class="chip vfq-expand" onclick="cqToggleExpand('${g}');${rerenderExpr}" aria-label="Woorden in ${esc(nm)} ${expanded?'verbergen':'tonen'}">${expanded?'▾':'▸'}</button>`;
    const detail = expanded ? `<div class="chips vfq-groep-detail">${ws.map(w=>`<button class="chip small ${cq.words.includes(w.id)?'on':''}" onclick="cqToggleWord(${draftExpr},'${w.id}');${rerenderExpr}">${esc(w.kort)} <small>${esc(w.betekenis.split(/[,;]/)[0])}</small></button>`).join("")}</div>` : "";
    return `<div class="vfq-groep-row">${gBtn}${xBtn}</div>${detail}`;
  }).join("");
  const modeChips = [["det","Vormen determineren"],["vorm","Juiste vorm kiezen"],["mix","Gemengd"]]
    .map(([id,nm])=>`<button class="chip ${cq.mode===id?'on':''}" onclick="cqSetMode(${draftExpr},'${id}');${rerenderExpr}">${nm}</button>`).join("");
  return `<div class="panel"><label class="fld">Naamvallen</label><div class="chips">${caseChips}</div></div>
    <div class="panel"><label class="fld">Declinaties en woorden</label><div class="vfq-groepen">${groups}</div></div>
    <div class="panel"><label class="fld">Vraagvorm</label><div class="chips">${modeChips}</div>
      <div class="note" style="margin-top:6px">${cq.mode==="det"?"Vorm tonen → naamval kiezen, daarna enkelvoud of meervoud."
        :cq.mode==="vorm"?"“Geef de genitivus enkelvoud van …” → kies de juiste vorm uit 4–6 opties."
        :"Willekeurig wisselen tussen beide vraagvormen."}</div></div>`;
}

/* ---- Pool ---- */
// Elke pool-entry heeft vorm/taal (zodat recentKeyOf, bmPersonalPool e.d. gewoon
// werken), soort:"nv" en t: "d" (determineer-item: één unieke vorm met álle
// geldige naamval+getal-combinaties onder de gekozen naamvallen) of "k"
// (kies-item: één cel uit het paradigma).
function cqBuildPool(cq, lang){
  const pool = [];
  const csel = cqCasesFor(lang).map(c=>c.id).filter(id=>cq.cases.includes(id));
  const csStr = csel.join(",");
  const wantD = cq.mode!=="vorm", wantK = cq.mode!=="det";
  for(const w of cqWords(lang)){
    if(!cq.words.includes(w.id)) continue;
    const byForm = new Map();
    for(const c of csel){
      for(const n of CQ_NUMS){
        const vorm = w.forms[n.id==="ev"?"sg":"pl"][c];
        if(!vorm) continue;
        if(wantK) pool.push({ soort:"nv", t:"k", taal:lang, lemmaId:w.id,
                              vorm, cas:c, num:n.id, cs:csStr });
        if(!byForm.has(vorm)) byForm.set(vorm, []);
        byForm.get(vorm).push(c+":"+n.id);
      }
    }
    if(wantD) for(const [vorm, valid] of byForm){
      pool.push({ soort:"nv", t:"d", taal:lang, lemmaId:w.id,
                  vorm, valid, cs:csStr });
    }
  }
  return pool;
}

/* ---- Vragen ---- */
function cqValidText(taal, valid){
  const short = {ev:"ev.", mv:"mv."};
  return valid.map(v=>{ const [c,n]=v.split(":"); return CQ_CASES.find(x=>x.id===c).ab.toLowerCase()+". "+short[n]; }).join(" / ");
}
function cqMakeQuestion(pool, chan){
  if(!pool.length) return null;
  const it = pickFresh(pool, chan);
  return it.t==="k" ? cqMakeKiesQuestion(it) : cqMakeDetQuestion(it);
}
function cqMakeDetQuestion(it){
  const cases = it.cs.split(","), w = cqWordById(it.taal, it.lemmaId) || {};
  return { mode:"naamval", key:recentKeyOf(it), taal:it.taal, vorm:it.vorm, lemma:w.lemma, betekenis:w.betekenis, info:w.info,
           cases, valid:it.valid, antwoord:cqValidText(it.taal, it.valid) };
}
// Kies de juiste vorm: afleiders = andere vormen van hetzelfde woord (eerst uit
// de gekozen naamvallen), daarna andere cellen, daarna woorden uit dezelfde
// declinatie. Nooit dezelfde tekst als het juiste antwoord.
function cqMakeKiesQuestion(it){
  const w = cqWordById(it.taal, it.lemmaId);
  const csel = it.cs.split(",");
  const seen = new Set([it.vorm]);
  const opts = [it.vorm];
  const add = v=>{ if(v && !seen.has(v) && opts.length<6){ seen.add(v); opts.push(v); } };
  if(w){
    const cells = [];
    for(const n of ["sg","pl"]) for(const c of Object.keys(w.forms[n])) cells.push({v:w.forms[n][c], pref:csel.includes(c)});
    shuffle(cells.filter(x=>x.pref)).forEach(x=>add(x.v));
    shuffle(cells.filter(x=>!x.pref)).forEach(x=>add(x.v));
    if(opts.length<4){
      for(const o of shuffle(cqWords(it.taal).filter(x=>x.grp===w.grp && x.id!==w.id))){
        for(const n of ["sg","pl"]) for(const v of Object.values(o.forms[n])) { if(opts.length<4) add(v); }
        if(opts.length>=4) break;
      }
    }
  }
  const options = shuffle(opts);
  const casNm = cqCaseNm(it.taal, it.cas), numNm = it.num==="ev" ? "enkelvoud" : "meervoud";
  const lemma = w ? w.lemma : "", betekenis = w ? w.betekenis : "";
  const vraag = `Geef de <strong>${casNm} ${numNm}</strong> van <em>${esc(lemma)}</em> <span class="note">(${esc(betekenis)})</span>`;
  return { mode:"nvkies", key:recentKeyOf(it), taal:it.taal, vorm:it.vorm, lemma, betekenis,
           vraag, options, correctIdx:options.indexOf(it.vorm), antwoord:it.vorm };
}

/* ---- Determineren: twee snelle stappen (naamval, dan getal) ----
   Eén gedeelde "huidige vraag"-state, zoals VFQ_ONTLEED_SEL. cqStart() registreert
   de vraag en de callbacks van de aanroeper (opnieuw tekenen / klaar met ok). */
let CQ_Q = null, CQ_SEL = {}, CQ_RERENDER = null, CQ_DONE = null;
function cqStart(q, rerender, done){ CQ_Q = q; CQ_SEL = {}; CQ_RERENDER = rerender; CQ_DONE = done; }
function cqPickCase(id){
  if(!CQ_Q || CQ_SEL.done) return;
  CQ_SEL.cas = id;
  if(!CQ_Q.valid.some(v=>v.startsWith(id+":"))){ CQ_SEL.done = true; CQ_SEL.ok = false; if(CQ_DONE) CQ_DONE(false); return; }
  if(CQ_RERENDER) CQ_RERENDER();
}
function cqPickNum(n){
  if(!CQ_Q || CQ_SEL.done || !CQ_SEL.cas) return;
  CQ_SEL.num = n; CQ_SEL.done = true;
  CQ_SEL.ok = CQ_Q.valid.includes(CQ_SEL.cas+":"+n);
  if(CQ_DONE) CQ_DONE(CQ_SEL.ok);
}
function cqCardHTML(q, kick){
  return `<div class="qcard"><div class="kick">${kick}</div><div class="word">${esc(q.vorm)}</div>
    <div class="note" style="margin-top:4px">${esc(q.lemma)}${q.taal==="la"?" "+esc(q.info):""} — ${esc(q.betekenis)}${q.taal==="el"?` <span style="opacity:.7">(${esc(q.info)})</span>`:""}</div></div>`;
}
// Nog te beantwoorden: stap 1 (naamval) of, na een goede naamval, stap 2 (getal).
function cqQuestionHTML(q){
  if(!CQ_SEL.cas){
    return cqCardHTML(q, "Welke naamval is dit?") + `<div class="panel"><div class="chips">
      ${q.cases.map(id=>`<button class="chip" style="min-width:56px;font-size:17px;padding:12px 14px" onclick="cqPickCase('${id}')">${CQ_CASES.find(c=>c.id===id).ab}</button>`).join("")}
    </div></div>`;
  }
  return cqCardHTML(q, `${CQ_CASES.find(c=>c.id===CQ_SEL.cas).ab} — enkelvoud of meervoud?`) + `<div class="panel"><div class="chips">
    ${CQ_NUMS.map(n=>`<button class="chip" style="min-width:110px;font-size:17px;padding:12px 14px" onclick="cqPickNum('${n.id}')">${n.nm}</button>`).join("")}
  </div></div>`;
}
// Na het antwoord: groen/rood per stap + alle goede combinaties.
function cqResultHTML(q){
  const validCases = new Set(q.valid.map(v=>v.split(":")[0]));
  const caseChips = q.cases.map(id=>{
    let cls = "chip";
    if(validCases.has(id)) cls+=" correct"; else if(id===CQ_SEL.cas) cls+=" wrong"; else cls+=" dim";
    return `<button class="${cls}" disabled>${CQ_CASES.find(c=>c.id===id).ab}</button>`;
  }).join("");
  let numRow = "";
  if(CQ_SEL.cas && validCases.has(CQ_SEL.cas)){
    const validNums = new Set(q.valid.filter(v=>v.startsWith(CQ_SEL.cas+":")).map(v=>v.split(":")[1]));
    numRow = `<div class="panel"><div class="chips">${CQ_NUMS.map(n=>{
      let cls = "chip";
      if(validNums.has(n.id)) cls+=" correct"; else if(n.id===CQ_SEL.num) cls+=" wrong"; else cls+=" dim";
      return `<button class="${cls}" disabled>${n.nm}</button>`;
    }).join("")}</div></div>`;
  }
  return cqCardHTML(q, "Welke naamval is dit?") + `<div class="panel"><div class="chips">${caseChips}</div></div>${numRow}
    <div class="note" style="text-align:center">Juist: ${esc(q.antwoord)}</div>`;
}

/* ---- Gedeelde bronkeuze (host-spel, Battle Mode, Training, Vrij oefenen) ---- */
// Pool voor een draft met .source, .lang en — bij vorm-bronnen — .vf / .cq.
function srcPoolFor(d){
  if(d.source==="verbforms") return vfqBuildPool(d.vf, d.lang);
  if(d.source==="naamvallen") return cqBuildPool(d.cq, d.lang);
  return buildPool(d);
}
// Vorm-bronnen (geen woord->betekenis-vragen): bepalen o.a. de vraagkaart.
function srcIsForm(src){ return src==="verbforms" || src==="naamvallen"; }
