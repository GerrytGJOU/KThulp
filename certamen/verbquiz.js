/* VERBQUIZ — vraaggenerator + selectiescherm-UI voor werkwoordsvormen.
   Los van core.js's buildPool/makeQuestion (die zijn woord->betekenis-quizzen,
   dit is vorm-gericht): een vraag toont één Latijnse/Griekse vorm, en de
   afleiders bij meerkeuze komen altijd uit HETZELFDE werkwoord (andere
   persoon/tijd/wijs/genus) — nooit uit een ander lemma, dat zou woordkennis
   toetsen i.p.v. vormkennis. Wordt ná verbforms.js en core.js geladen. */
"use strict";

// vf-subdraft: {verbs:[lemma,...], tijden:[...], wijzen:[...], genera:[...], mode:"mc"|"typed"}
function vfqDefaultDraft(lang){
  const verbs = (lang==="el" ? VF_EL_VERBS : VF_LA_VERBS).map(v=>v.lemma);
  return { verbs: verbs.slice(), tijden:["praesens"], wijzen:["indicativus"], genera:["activum"], mode:"mc" };
}

function vfqToggleGuard(arr, id){
  const i = arr.indexOf(id);
  if(i>=0){ if(arr.length>1) arr.splice(i,1); }
  else arr.push(id);
}
function vfqToggleVerb(vf,id){ vfqToggleGuard(vf.verbs,id); }
function vfqToggleTijd(vf,id){ vfqToggleGuard(vf.tijden,id); }
function vfqToggleWijs(vf,id){ vfqToggleGuard(vf.wijzen,id); }
function vfqToggleGenus(vf,id){ vfqToggleGuard(vf.genera,id); }
function vfqSetMode(vf,mode){ vf.mode = mode; }

// Bouwt het filterscherm (chips), in Pallas/Minerva-volgorde: werkwoord (per
// vervoegingsgroep) -> tijd -> wijs -> genus -> vraagvorm. draftExpr/rerenderExpr
// zijn letterlijke JS-uitdrukkingen (strings) die in de onclick-attributen
// komen, zodat elke spelmodus zijn eigen *_DRAFT-variabele en her-renderfunctie
// kan meegeven (zelfde patroon als de bestaande chip-UI in games.js).
function vfqFilterHTML(vf, lang, draftExpr, rerenderExpr){
  const verbs = lang==="el" ? VF_EL_VERBS : VF_LA_VERBS;
  const tijden = lang==="el" ? VF_TIJDEN_EL : VF_TIJDEN_LA;
  const verbChips = verbs.map(v=>`<button class="chip ${vf.verbs.includes(v.lemma)?'on':''}" onclick="vfqToggleVerb(${draftExpr},'${v.lemma}');${rerenderExpr}">${esc(v.lemma)} <small>${esc(v.betekenis.split(',')[0])}</small></button>`).join("");
  const tijdChips = tijden.map(t=>`<button class="chip ${vf.tijden.includes(t)?'on':''}" onclick="vfqToggleTijd(${draftExpr},'${t}');${rerenderExpr}">${esc(VF_TIJD_NM[t]||t)}</button>`).join("");
  let out = `<div class="panel"><label class="fld">Werkwoord(en)</label><div class="chips">${verbChips}</div></div>
    <div class="panel"><label class="fld">Tijd</label><div class="chips">${tijdChips}</div></div>`;
  if(lang!=="el"){
    const wijsChips = VF_WIJZEN.map(w=>`<button class="chip ${vf.wijzen.includes(w)?'on':''}" onclick="vfqToggleWijs(${draftExpr},'${w}');${rerenderExpr}">${w}</button>`).join("");
    const genusChips = VF_GENERA.map(g=>`<button class="chip ${vf.genera.includes(g)?'on':''}" onclick="vfqToggleGenus(${draftExpr},'${g}');${rerenderExpr}">${g}</button>`).join("");
    out += `<div class="panel"><label class="fld">Wijs</label><div class="chips">${wijsChips}</div></div>
      <div class="panel"><label class="fld">Genus</label><div class="chips">${genusChips}</div></div>`;
  }
  const modeChips = [["mc","Meerkeuze"],["typed","Getypt"]].map(([id,nm])=>`<button class="chip ${vf.mode===id?'on':''}" onclick="vfqSetMode(${draftExpr},'${id}');${rerenderExpr}">${nm}</button>`).join("");
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
        const vormen = v[tijd]; if(!vormen) continue;
        const glossen = v.nl && v.nl[tijd];
        vormen.forEach((vorm,p)=>{
          pool.push({ taal:"el", lemma:v.lemma, betekenis:v.betekenis, tijd, modus:"indicativus", genus:"activum",
                      persoonIdx:p, vorm, glos: glossen ? glossen[p] : v.betekenis });
        });
      }
    }
    return pool;
  }
  const verbs = VF_LA_VERBS.filter(v=>vf.verbs.includes(v.lemma));
  for(const v of verbs){
    for(const tijd of vf.tijden){
      for(const modus of vf.wijzen){
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
    : `Geef de <strong>${persoon} ${base.tijd}</strong> van <em>${esc(base.lemma)}</em>`;
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
