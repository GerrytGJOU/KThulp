/* VERBQUIZ — vraaggenerator + selectiescherm-UI voor werkwoordsvormen.
   Los van core.js's buildPool/makeQuestion (die zijn woord->betekenis-quizzen,
   dit is vorm-gericht): een vraag toont één Latijnse/Griekse vorm, en de
   afleiders bij meerkeuze komen altijd uit HETZELFDE werkwoord (andere
   persoon/tijd/wijs/genus) — nooit uit een ander lemma, dat zou woordkennis
   toetsen i.p.v. vormkennis. Wordt ná verbforms.js en core.js geladen. */
"use strict";

// vf-subdraft. Grieks (alleen indicativus): {verbs, tijden:[...], genera, mode}.
// Latijn: {verbs, tijdenIndicativus:[...], tijdenConiunctivus:[...], genera, mode}
// — tijd en wijs zijn BEWUST losgekoppeld van een simpel kruisproduct, want
// Minerva leert coniunctivus per tijd gefaseerd (bv. imperfectum+plusquam-
// perfectum coniunctivus samen met het plusquamperfectum indicativus, terwijl
// praesens/perfectum coniunctivus pas later komen) — zie git-geschiedenis.
function vfqDefaultDraft(lang){
  const verbs = (lang==="el" ? VF_EL_VERBS : VF_LA_VERBS).map(v=>v.lemma);
  if(lang==="el") return { verbs: verbs.slice(), tijden:["praesens"], genera:["activum"], mode:"mc" };
  return { verbs: verbs.slice(), tijdenIndicativus:["praesens"], tijdenConiunctivus:[], genera:["activum"], mode:"mc" };
}

function vfqToggleGuard(arr, id){
  const i = arr.indexOf(id);
  if(i>=0){ if(arr.length>1) arr.splice(i,1); }
  else arr.push(id);
}
// Vrij aan/uit te vinken, zonder minimum-1-restrictie — "geen coniunctivus"
// (de standaardstand) of zelfs "geen enkele indicativus-tijd" (puur
// coniunctivus oefenen) zijn allebei geldige, zinvolle keuzes.
function vfqToggleFree(arr, id){
  const i = arr.indexOf(id);
  if(i>=0) arr.splice(i,1); else arr.push(id);
}
function vfqToggleVerb(vf,id){ vfqToggleGuard(vf.verbs,id); }
function vfqToggleTijd(vf,id){ vfqToggleGuard(vf.tijden,id); }
function vfqToggleTijdInd(vf,id){ vfqToggleFree(vf.tijdenIndicativus,id); }
function vfqToggleTijdConi(vf,id){ vfqToggleFree(vf.tijdenConiunctivus,id); }
function vfqToggleGenus(vf,id){ vfqToggleGuard(vf.genera,id); }
function vfqSetMode(vf,mode){ vf.mode = mode; }

// Welke stamgroepen momenteel uitgeklapt staan (los UI-gemak, geen onderdeel
// van vf — net als VFQ_ONTLEED_SEL hieronder is dit bewust gedeelde state).
let VFQ_EXPANDED = new Set();
function vfqToggleExpand(groepId){
  const key = String(groepId);
  if(VFQ_EXPANDED.has(key)) VFQ_EXPANDED.delete(key); else VFQ_EXPANDED.add(key);
}
// Eén klik op een stamgroep-chip zet alle werkwoorden uit die groep in
// één keer aan (of weer uit als ze al allemaal aanstonden) — vergroot
// (uitklappen) om individuele werkwoorden binnen de groep uit te vinken.
function vfqToggleGroep(vf, groepId){
  const lemmas = VF_LA_VERBS.filter(v=>String(v.groep)===String(groepId)).map(v=>v.lemma);
  const allOn = lemmas.every(l=>vf.verbs.includes(l));
  if(allOn) vf.verbs = vf.verbs.filter(l=>!lemmas.includes(l));
  else lemmas.forEach(l=>{ if(!vf.verbs.includes(l)) vf.verbs.push(l); });
}
function vfqVerbGroupsHTML(vf, draftExpr, rerenderExpr){
  return VF_GROEP_VOLGORDE.map(g=>{
    const lemmas = VF_LA_VERBS.filter(v=>String(v.groep)===String(g));
    const onCount = lemmas.filter(v=>vf.verbs.includes(v.lemma)).length;
    const allOn = onCount===lemmas.length, someOn = onCount>0 && !allOn;
    const expanded = VFQ_EXPANDED.has(String(g));
    const groepBtn = `<button class="chip ${allOn?'on':someOn?'partial':''}" onclick="vfqToggleGroep(${draftExpr},'${g}');${rerenderExpr}">${esc(VF_GROEP_NAMEN[g])} <small>${onCount}/${lemmas.length}</small></button>`;
    const expandBtn = `<button class="chip vfq-expand" onclick="vfqToggleExpand('${g}');${rerenderExpr}" aria-label="Werkwoorden in ${esc(VF_GROEP_NAMEN[g])} ${expanded?'verbergen':'tonen'}">${expanded?'▾':'▸'}</button>`;
    const detail = expanded ? `<div class="chips vfq-groep-detail">${lemmas.map(v=>`<button class="chip small ${vf.verbs.includes(v.lemma)?'on':''}" onclick="vfqToggleVerb(${draftExpr},'${v.lemma}');${rerenderExpr}">${esc(v.lemma)} <small>${esc(v.betekenis.split(',')[0])}</small></button>`).join("")}</div>` : "";
    return `<div class="vfq-groep-row">${groepBtn}${expandBtn}</div>${detail}`;
  }).join("");
}

// Bouwt het filterscherm (chips), in Pallas/Minerva-volgorde: werkwoord (per
// vervoegingsgroep) -> tijd -> wijs -> genus -> vraagvorm. draftExpr/rerenderExpr
// zijn letterlijke JS-uitdrukkingen (strings) die in de onclick-attributen
// komen, zodat elke spelmodus zijn eigen *_DRAFT-variabele en her-renderfunctie
// kan meegeven (zelfde patroon als de bestaande chip-UI in games.js).
function vfqFilterHTML(vf, lang, draftExpr, rerenderExpr){
  const verbs = lang==="el" ? VF_EL_VERBS : VF_LA_VERBS;
  // Latijn: gegroepeerd per stamgroep (klik = hele groep aan/uit, vergroot
  // om individuele werkwoorden te verfijnen). Grieks heeft geen stamgroepen
  // in dit datamodel — platte lijst, ongewijzigd.
  const verbChips = lang==="el"
    ? verbs.map(v=>`<button class="chip ${vf.verbs.includes(v.lemma)?'on':''}" onclick="vfqToggleVerb(${draftExpr},'${v.lemma}');${rerenderExpr}">${esc(v.lemma)} <small>${esc(v.betekenis.split(',')[0])}</small></button>`).join("")
    : vfqVerbGroupsHTML(vf, draftExpr, rerenderExpr);
  const verbWrapClass = lang==="el" ? "chips" : "vfq-groepen";
  let out = `<div class="panel"><label class="fld">Werkwoord(en)</label><div class="${verbWrapClass}">${verbChips}</div></div>`;
  if(lang==="el"){
    const tijdChips = VF_TIJDEN_EL.map(t=>`<button class="chip ${vf.tijden.includes(t)?'on':''}" onclick="vfqToggleTijd(${draftExpr},'${t}');${rerenderExpr}">${esc(VF_TIJD_NM[t]||t)}</button>`).join("");
    out += `<div class="panel"><label class="fld">Tijd</label><div class="chips">${tijdChips}</div></div>`;
    const genusChipsEl = VF_GENERA_EL.map(g=>`<button class="chip ${vf.genera.includes(g)?'on':''}" onclick="vfqToggleGenus(${draftExpr},'${g}');${rerenderExpr}">${g}</button>`).join("");
    out += `<div class="panel"><label class="fld">Genus</label><div class="chips">${genusChipsEl}</div></div>`;
  } else {
    // Tijd per wijs los aan/uit te vinken (niet als kruisproduct) — zo kan
    // bv. alleen imperfectum+plusquamperfectum coniunctivus aan staan terwijl
    // praesens/perfectum coniunctivus nog uit staan, net als in Minerva.
    const tijdIndChips = VF_TIJDEN_LA.map(t=>`<button class="chip ${vf.tijdenIndicativus.includes(t)?'on':''}" onclick="vfqToggleTijdInd(${draftExpr},'${t}');${rerenderExpr}">${esc(VF_TIJD_NM[t]||t)}</button>`).join("");
    const coniTijden = VF_TIJDEN_LA.filter(t=>t!=="futurum" && t!=="futurumexactum"); // coniunctivus futurum bestaat niet
    const tijdConiChips = coniTijden.map(t=>`<button class="chip ${vf.tijdenConiunctivus.includes(t)?'on':''}" onclick="vfqToggleTijdConi(${draftExpr},'${t}');${rerenderExpr}">${esc(VF_TIJD_NM[t]||t)}</button>`).join("");
    out += `<div class="panel"><label class="fld">Tijd — indicativus</label><div class="chips">${tijdIndChips}</div></div>
      <div class="panel"><label class="fld">Tijd — coniunctivus</label><div class="chips">${tijdConiChips}</div></div>`;
    const genusChips = VF_GENERA.map(g=>`<button class="chip ${vf.genera.includes(g)?'on':''}" onclick="vfqToggleGenus(${draftExpr},'${g}');${rerenderExpr}">${g}</button>`).join("");
    out += `<div class="panel"><label class="fld">Genus</label><div class="chips">${genusChips}</div></div>`;
  }
  const modeChips = [["mc","Meerkeuze"],["typed","Getypt"],["ontleed","Ontleden"]].map(([id,nm])=>`<button class="chip ${vf.mode===id?'on':''}" onclick="vfqSetMode(${draftExpr},'${id}');${rerenderExpr}">${nm}</button>`).join("");
  out += `<div class="panel"><label class="fld">Vraagvorm</label><div class="chips">${modeChips}</div></div>`;
  return out;
}

// Genereert de volledige vormenpool (elke vorm apart, met bijbehorende NL-glans)
// voor de gekozen taal/werkwoorden/tijden/wijs/genus.
function vfqBuildPool(vf, lang){
  const pool = [];
  if(lang==="el"){
    const verbs = VF_EL_VERBS.filter(v=>vf.verbs.includes(v.lemma));
    for(const v of verbs){
      for(const tijd of vf.tijden){
        for(const genus of vf.genera){
          // Praesens/imperfectum: medium en passivum delen dezelfde Griekse
          // vorm (v.medium), alleen de NL-glans verschilt. Aoristus heeft een
          // eigen -θη-passiefvorm (v.passief.aoristus), los van de mediale
          // aoristus. Deponentia (βούλομαι e.d.) hebben geen aparte
          // medium/passief-tak — hun vormen staan al in v[tijd] (activum).
          let vormen, glossen;
          if(genus==="activum"){ vormen = v[tijd]; glossen = v.nl && v.nl[tijd]; }
          else if(genus==="medium"){ vormen = v.medium && v.medium[tijd]; glossen = v.nlMedium && v.nlMedium[tijd]; }
          else { vormen = (tijd==="aoristus" ? (v.passief && v.passief.aoristus) : (v.medium && v.medium[tijd])); glossen = v.nlPassief && v.nlPassief[tijd]; }
          if(!vormen) continue;
          vormen.forEach((vorm,p)=>{
            pool.push({ taal:"el", lemma:v.lemma, betekenis:v.betekenis, tijd, modus:"indicativus", genus,
                        persoonIdx:p, vorm, glos: glossen ? glossen[p] : v.betekenis });
          });
        }
      }
    }
    return pool;
  }
  const verbs = VF_LA_VERBS.filter(v=>vf.verbs.includes(v.lemma));
  const combos = [
    ...(vf.tijdenIndicativus||[]).map(tijd=>({tijd, modus:"indicativus"})),
    ...(vf.tijdenConiunctivus||[]).map(tijd=>({tijd, modus:"coniunctivus"})),
  ];
  for(const v of verbs){
    for(const {tijd,modus} of combos){
      for(const genus of vf.genera){
        for(let p=0;p<6;p++){
          const vorm = vfLatijnVorm(v, tijd, modus, genus, p);
          if(!vorm) continue;
          const glos = vfLatijnGlos(v, tijd, modus, genus, p);
          pool.push({ taal:"la", lemma:v.lemma, betekenis:v.betekenis, tijd, modus, genus, persoonIdx:p, vorm, glos });
        }
      }
    }
  }
  return pool;
}

// Meerkeuzevraag: toont één vorm, de 4 opties zijn Nederlandse glossen — de
// afleiders komen altijd uit hetzelfde werkwoord (nooit een ander lemma).
function vfqMakeQuestion(pool){
  if(pool.length<2) return null;
  const it = pick(pool);
  const sub = pool.filter(x=>x.lemma===it.lemma && x.taal===it.taal);
  const seen = new Set([norm(it.glos)]);
  const opts = [it.glos];
  for(const x of shuffle(sub)){
    if(seen.has(norm(x.glos))) continue;
    seen.add(norm(x.glos)); opts.push(x.glos);
    if(opts.length>=4) break;
  }
  while(opts.length<2) opts.push("…");
  const shuffled = shuffle(opts);
  return { mode:"mc", taal:it.taal, vorm:it.vorm, lemma:it.lemma, betekenis:it.betekenis,
            options:shuffled, correctIdx: shuffled.findIndex(o=>norm(o)===norm(it.glos)) };
}

const VF_WIJS_KORT = { indicativus:"", coniunctivus:" (coniunctivus)" };

// Getypte productievraag: "Geef de <persoon> <tijd> van <werkwoord>".
function vfqMakeTypedQuestion(pool){
  if(!pool.length) return null;
  const typbaar = pool.filter(x=>!/[()]/.test(x.vorm));
  const base = pick(typbaar.length ? typbaar : pool);
  const persoon = VF_PERSOONLABEL[base.persoonIdx];
  const opdracht = base.taal==="la"
    ? `Geef de <strong>${persoon} ${VF_TIJD_NM[base.tijd]}${VF_WIJS_KORT[base.modus]} ${base.genus}</strong> van <em>${esc(base.lemma)}</em>`
    : `Geef de <strong>${persoon} ${base.tijd}${base.genus!=="activum"?" "+base.genus:""}</strong> van <em>${esc(base.lemma)}</em>`;
  return { mode:"typed", taal:base.taal, lemma:base.lemma, betekenis:base.betekenis,
            vraag: opdracht+` <span class="note">(${esc(base.betekenis)})</span>`, antwoord:base.vorm, glos:base.glos };
}

function vfqNormLatin(s){ return String(s||"").trim().toLowerCase().replace(/\s+/g," "); }

// Controleert een getypt antwoord. Grieks hergebruikt spNormalizeGreek() uit
// singleplayer.js (accenten genegeerd, spiritus/iota subscriptum niet) als die
// geladen is; Latijn heeft geen macrons in de data, dus alleen trim/lowercase.
function vfqControleer(q, antwoord){
  if(!q) return false;
  const geg = antwoord==null ? "" : String(antwoord);
  if(q.taal==="el"){
    if(typeof spNormalizeGreek==="function") return spNormalizeGreek(geg)===spNormalizeGreek(q.antwoord);
    return geg.trim()===q.antwoord.trim();
  }
  return vfqNormLatin(geg)===vfqNormLatin(q.antwoord);
}

/* ---- Ontleden — à la Vice Verba/Hoi Polloi Logoi: alle grammaticale
   kenmerken van de getoonde vorm in één keer aanklikken (geen vertaling),
   met een CHECK die alle assen tegelijk beoordeelt. Grieks krijgt alleen
   persoon/getal/tijd (net als grieks/werkwoorden se "Determineren") — onze
   Griekse data kent geen coniunctivus/passivum, dus geen wijs/genus-as. ---- */
function vfqOntleedAxes(taal){
  const axes = [
    {key:"persoon", label:"Persoon", opts:[["1","Eerste"],["2","Tweede"],["3","Derde"]]},
    {key:"getal",   label:"Getal",   opts:[["ev","Enkelvoud"],["mv","Meervoud"]]},
    {key:"tijd",    label:"Tijd",    opts:(taal==="el"?VF_TIJDEN_EL:VF_TIJDEN_LA).map(t=>[t, taal==="el"?t:(VF_TIJD_NM[t]||t)])},
  ];
  if(taal!=="el"){
    axes.push({key:"modus", label:"Wijs",  opts:VF_WIJZEN.map(w=>[w,w])});
    axes.push({key:"genus", label:"Genus", opts:VF_GENERA.map(g=>[g,g])});
  }
  return axes;
}

function vfqMakeOntleedQuestion(pool){
  if(!pool.length) return null;
  const it = pick(pool);
  const correct = { persoon:String((it.persoonIdx%3)+1), getal: it.persoonIdx<3?"ev":"mv",
                     tijd:it.tijd, modus:it.modus, genus:it.genus };
  const antwoord = vfqOntleedAxes(it.taal).map(ax=>correct[ax.key]).filter(Boolean).join(" / ");
  return { mode:"ontleed", taal:it.taal, lemma:it.lemma, betekenis:it.betekenis, vorm:it.vorm, correct, antwoord };
}

// Eén gedeeld selectie-object per actieve ontleedvraag — zelfde soort
// module-level "huidige vraag"-state als curQ/TR_Q/FP_Q elders.
let VFQ_ONTLEED_SEL = {};
function vfqOntleedReset(){ VFQ_ONTLEED_SEL = {}; }
function vfqOntleedPick(axisKey, val){ VFQ_ONTLEED_SEL[axisKey] = val; }
function vfqOntleedComplete(q){
  return vfqOntleedAxes(q.taal).every(ax => VFQ_ONTLEED_SEL[ax.key]);
}

function vfqOntleedCardHTML(q){
  return `<div class="qcard"><div class="kick">Ontleed deze vorm</div><div class="word">${esc(q.vorm)}</div>
    <div class="note" style="margin-top:4px">${esc(q.lemma)} — ${esc(q.betekenis)}</div></div>`;
}

// Nog te beantwoorden: klikbare chips, huidige keuze gemarkeerd met .on.
function vfqOntleedPickerHTML(q, rerenderExpr){
  const rows = vfqOntleedAxes(q.taal).map(ax=>`<div class="panel"><label class="fld">${esc(ax.label)}</label><div class="chips">
    ${ax.opts.map(([val,label])=>`<button class="chip ${VFQ_ONTLEED_SEL[ax.key]===val?'on':''}" onclick="vfqOntleedPick('${ax.key}','${val}');${rerenderExpr}">${esc(label)}</button>`).join("")}
  </div></div>`).join("");
  return vfqOntleedCardHTML(q)+rows;
}

// Na CHECK: alle assen tegelijk beoordeeld (alles-of-niets, zoals de
// referentie-apps), met per-as groen/rood/grijs terugkoppeling.
function vfqOntleedGrade(q){
  const rows = vfqOntleedAxes(q.taal).map(ax=>({ key:ax.key, label:ax.label,
    picked:VFQ_ONTLEED_SEL[ax.key]||null, correct:q.correct[ax.key],
    ok: VFQ_ONTLEED_SEL[ax.key]===q.correct[ax.key] }));
  return { ok: rows.every(r=>r.ok), rows };
}
function vfqOntleedResultHTML(q, grade){
  const rows = vfqOntleedAxes(q.taal).map(ax=>{
    const r = grade.rows.find(x=>x.key===ax.key);
    const chips = ax.opts.map(([val,label])=>{
      let cls = "chip";
      if(val===r.correct) cls+=" correct";
      else if(val===r.picked) cls+=" wrong";
      else cls+=" dim";
      return `<button class="${cls}" disabled>${esc(label)}</button>`;
    }).join("");
    return `<div class="panel"><label class="fld">${esc(ax.label)}</label><div class="chips">${chips}</div></div>`;
  }).join("");
  return vfqOntleedCardHTML(q)+rows;
}
