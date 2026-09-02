/* VERBFORMS — werkwoordsvormen-dataset voor Certamen (Latijn + Grieks).
   Latijn wordt algoritmisch gegenereerd uit hoofdvormen (regelmatig systeem,
   nieuwe werkwoorden toevoegen = één regel data). Grieks wordt met de hand
   ingevoerd (accentverschuiving is niet betrouwbaar automatisch af te leiden —
   zelfde reden als combat-questions.js's CQ_GR_VERBA).
   Wordt vóór verbquiz.js geladen en is wereldwijd beschikbaar. */

/* ===================== Latijn ===================== */

const VF_PRONOMEN = ["ik","jij","hij","wij","jullie","zij"];
const VF_PERSOONLABEL = ["1e persoon enkelvoud","2e persoon enkelvoud","3e persoon enkelvoud","1e persoon meervoud","2e persoon meervoud","3e persoon meervoud"];
const VF_TIJDEN_LA = ["praesens","imperfectum","perfectum","plusquamperfectum","futurum","futurumexactum"];
const VF_TIJD_NM = {praesens:"praesens", imperfectum:"imperfectum", perfectum:"perfectum", plusquamperfectum:"plusquamperfectum", futurum:"futurum simplex", futurumexactum:"futurum exactum"};
const VF_WIJZEN = ["indicativus","coniunctivus"];
const VF_GENERA = ["activum","passivum"];

// stam = praesensstam (incl. thematische klinker, bv. "ama", "audi"), perf = perfectumstam
// (bv. "amav"), ppp = stam van het volt. deelw. (bv. "amat" -> amatus), conj = 1|2|3|"3io"|4.
// nl = {inf, pres:[6], past:[6], part} voor de Nederlandse glossen (zie vfLatijnGlos).
const VF_LA_VERBS = [
  { lemma:"amo",   stam:"ama",  perf:"amav",  ppp:"amat",  conj:1,     groep:1, betekenis:"liefhebben, houden van",
    nl:{ inf:"liefhebben", pres:["heb lief","hebt lief","heeft lief","hebben lief","hebben lief","hebben lief"],
         past:["had lief","had lief","had lief","hadden lief","hadden lief","hadden lief"], part:"liefgehad" } },
  { lemma:"voco",  stam:"voca", perf:"vocav", ppp:"vocat", conj:1,     groep:1, betekenis:"roepen",
    nl:{ inf:"roepen", pres:["roep","roept","roept","roepen","roepen","roepen"],
         past:["riep","riep","riep","riepen","riepen","riepen"], part:"geroepen" } },
  { lemma:"teneo", stam:"tene", perf:"tenu",  ppp:"tent",  conj:2,     groep:2, betekenis:"vasthouden",
    nl:{ inf:"vasthouden", pres:["houd vast","houdt vast","houdt vast","houden vast","houden vast","houden vast"],
         past:["hield vast","hield vast","hield vast","hielden vast","hielden vast","hielden vast"], part:"vastgehouden" } },
  { lemma:"mitto", stam:"mitt", perf:"mis",   ppp:"miss",  conj:3,     groep:3, betekenis:"sturen, zenden",
    nl:{ inf:"sturen", pres:["stuur","stuurt","stuurt","sturen","sturen","sturen"],
         past:["stuurde","stuurde","stuurde","stuurden","stuurden","stuurden"], part:"gestuurd" } },
  { lemma:"capio", stam:"capi", perf:"cep",   ppp:"capt",  conj:"3io", groep:3, betekenis:"pakken, nemen, veroveren",
    nl:{ inf:"pakken", pres:["pak","pakt","pakt","pakken","pakken","pakken"],
         past:["pakte","pakte","pakte","pakten","pakten","pakten"], part:"gepakt" } },
  { lemma:"audio", stam:"audi", perf:"audiv", ppp:"audit", conj:4,     groep:4, betekenis:"horen",
    nl:{ inf:"horen", pres:["hoor","hoort","hoort","horen","horen","horen"],
         past:["hoorde","hoorde","hoorde","hoorden","hoorden","hoorden"], part:"gehoord" } },
];

// Infinitivus activi (nodig voor imperfectum coniunctivus = infinitief + persoonsuitgang).
function vfLatijnInfinitief(v){
  if(v.conj===3) return v.stam+"ere";
  if(v.conj==="3io") return v.stam.slice(0,-1)+"ere";
  return v.stam+"re"; // 1, 2, 4
}

// Genereert één Latijnse werkwoordsvorm. persoonIdx 0-5 = ik/jij/hij/wij/jullie/zij.
// Retourneert null voor combinaties die niet bestaan (futurum(exactum) coniunctivus).
function vfLatijnVorm(v, tijd, modus, genus, persoonIdx){
  const s = v.stam, i = persoonIdx;
  if(modus==="coniunctivus" && (tijd==="futurum" || tijd==="futurumexactum")) return null;

  if(modus==="coniunctivus"){
    if(tijd==="perfectum"){
      const u = genus==="activum" ? ["erim","eris","erit","erimus","eritis","erint"]
                                   : [" sim"," sis"," sit"];
      if(genus==="activum") return v.perf+u[i];
      const ppU=[" sim"," sis"," sit"," simus"," sitis"," sint"];
      return v.ppp+(i<3?"us":"i")+ppU[i];
    }
    if(tijd==="plusquamperfectum"){
      if(genus==="activum") return v.perf+["issem","isses","isset","issemus","issetis","issent"][i];
      const ppU=[" essem"," esses"," esset"," essemus"," essetis"," essent"];
      return v.ppp+(i<3?"us":"i")+ppU[i];
    }
    // praesens / imperfectum coniunctivus
    const isConj1 = v.conj===1;
    if(tijd==="praesens"){
      const kern = isConj1 ? s.slice(0,-1)+"e" : s+"a";
      if(genus==="activum") return kern+["m","s","t","mus","tis","nt"][i];
      return kern+["r","ris","tur","mur","mini","ntur"][i];
    }
    if(tijd==="imperfectum"){
      const inf = vfLatijnInfinitief(v);
      if(genus==="activum") return inf+["m","s","t","mus","tis","nt"][i];
      return inf+["r","ris","tur","mur","mini","ntur"][i];
    }
    return null;
  }

  // indicativus
  if(tijd==="perfectum"){
    if(genus==="activum") return v.perf+["i","isti","it","imus","istis","erunt"][i];
    const u=[" sum"," es"," est"," sumus"," estis"," sunt"];
    return v.ppp+(i<3?"us":"i")+u[i];
  }
  if(tijd==="plusquamperfectum"){
    if(genus==="activum") return v.perf+["eram","eras","erat","eramus","eratis","erant"][i];
    const u=[" eram"," eras"," erat"," eramus"," eratis"," erant"];
    return v.ppp+(i<3?"us":"i")+u[i];
  }
  if(tijd==="futurumexactum"){
    if(genus==="activum") return v.perf+["ero","eris","erit","erimus","eritis","erint"][i];
    const u=[" ero"," eris"," erit"," erimus"," eritis"," erunt"];
    return v.ppp+(i<3?"us":"i")+u[i];
  }
  if(tijd==="imperfectum"){
    const infix = (v.conj===1||v.conj===2) ? "ba" : "eba";
    if(genus==="activum") return s+infix+["m","s","t","mus","tis","nt"][i];
    return s+infix+["r","ris","tur","mur","mini","ntur"][i];
  }
  if(tijd==="futurum"){
    if(v.conj===1||v.conj===2){
      if(genus==="activum") return s+["bo","bis","bit","bimus","bitis","bunt"][i];
      return s+"b"+["or","eris","itur","imur","imini","untur"][i];
    }
    if(genus==="activum") return s+["am","es","et","emus","etis","ent"][i];
    return s+["ar","eris","etur","emur","emini","entur"][i];
  }
  // praesens
  switch(v.conj){
    case 1:
      if(genus==="activum") return [s.slice(0,-1)+"o", s+"s", s+"t", s+"mus", s+"tis", s+"nt"][i];
      return [s.slice(0,-1)+"or", s+"ris", s+"tur", s+"mur", s+"mini", s+"ntur"][i];
    case 2:
      if(genus==="activum") return [s+"o", s+"s", s+"t", s+"mus", s+"tis", s+"nt"][i];
      return [s+"or", s+"ris", s+"tur", s+"mur", s+"mini", s+"ntur"][i];
    case 3:
      if(genus==="activum") return [s+"o", s+"is", s+"it", s+"imus", s+"itis", s+"unt"][i];
      return [s+"or", s+"eris", s+"itur", s+"imur", s+"imini", s+"untur"][i];
    case "3io": {
      const bare = s.slice(0,-1);
      if(genus==="activum") return [s+"o", bare+"is", bare+"it", bare+"imus", bare+"itis", s+"unt"][i];
      return [s+"or", bare+"eris", s+"tur", s+"mur", s+"mini", s+"untur"][i];
    }
    case 4:
      if(genus==="activum") return [s+"o", s+"s", s+"t", s+"mus", s+"tis", s+"unt"][i];
      return [s+"or", s+"ris", s+"tur", s+"mur", s+"mini", s+"untur"][i];
  }
  return null;
}

// Nederlandse glans bij een vorm — zelfde patroon als in de Vocare-Excel
// (coniunctivus hergebruikt de indicativus-tekst + achtervoegsel).
function vfLatijnGlos(v, tijd, modus, genus, persoonIdx){
  const i = persoonIdx, nl = v.nl, pron = VF_PRONOMEN[i];
  const zullen = ["zal","zal","zal","zullen","zullen","zullen"][i];
  const hebbenPres = ["heb","hebt","heeft","hebben","hebben","hebben"][i];
  const hebbenPast = ["had","had","had","hadden","hadden","hadden"][i];
  const wordenPres = ["word","wordt","wordt","worden","worden","worden"][i];
  const wordenPast = ["werd","werd","werd","werden","werden","werden"][i];
  const zijnPres = ["ben","bent","is","zijn","zijn","zijn"][i];
  const zijnPast = ["was","was","was","waren","waren","waren"][i];
  let basis;
  if(genus==="activum"){
    basis = tijd==="praesens" ? `${pron} ${nl.pres[i]}`
      : tijd==="imperfectum" ? `${pron} ${nl.past[i]}`
      : tijd==="futurum" ? `${pron} ${zullen} ${nl.inf}`
      : tijd==="perfectum" ? `${pron} ${hebbenPres} ${nl.part}`
      : tijd==="plusquamperfectum" ? `${pron} ${hebbenPast} ${nl.part}`
      : `${pron} ${zullen} hebben ${nl.part}`; // futurumexactum
  } else {
    basis = tijd==="praesens" ? `${pron} ${wordenPres} ${nl.part}`
      : tijd==="imperfectum" ? `${pron} ${wordenPast} ${nl.part}`
      : tijd==="futurum" ? `${pron} ${zullen} worden ${nl.part}`
      : tijd==="perfectum" ? `${pron} ${zijnPres} ${nl.part}`
      : tijd==="plusquamperfectum" ? `${pron} ${zijnPast} ${nl.part}`
      : `${pron} ${zullen} zijn ${nl.part}`; // futurumexactum
  }
  return modus==="coniunctivus" ? basis+" (coniunctivus)" : basis;
}

/* ===================== Grieks ===================== */
// Met de hand ingevoerd (indicativus activum, alleen de tijden waarvoor
// betrouwbare vormen beschikbaar zijn — zie hoofdbestand-commentaar).
// λύω/λαμβάνω/λέγω zijn gecontroleerd tegen combat-questions.js's CQ_GR_VERBA;
// εἰμί/ἔχω/λαμβάνω/λέγω komen uit de door Gerben aangeleverde Excel;
// ἀγγέλλω/ποιέω zijn vers uitgeschreven standaardparadigma's (liquide stam,
// resp. contractwerkwoord op -εω) — verdienen een proefleesronde.
// nl.praesens/imperfectum/aoristus/futurum bevat de Nederlandse glans per vorm,
// zelfde lengte-array als de vorm zelf (bij syncretisme — 1sg/3pl vallen samen
// in imperfectum/aoristus — dus 5 vormen i.p.v. 6, is nl ook 5 lang). Aoristus
// hergebruikt vaak dezelfde Nederlandse tekst als imperfectum met "(aor)"
// erachter, zoals in de brontabel (ἔχω, λέγω, λαμβάνω) — Nederlands maakt geen
// onderscheid tussen beide verleden tijden, alleen het Grieks wel.
const VF_TIJDEN_EL = ["praesens","imperfectum","aoristus","futurum"];
const VF_EL_VERBS = [
  { lemma:"λύω", betekenis:"losmaken, verbreken",
    praesens:   ["λύω","λύεις","λύει","λύομεν","λύετε","λύουσι(ν)"],
    imperfectum:["ἔλυον","ἔλυες","ἔλυε(ν)","ἐλύομεν","ἐλύετε","ἔλυον"],
    aoristus:   ["ἔλυσα","ἔλυσας","ἔλυσε(ν)","ἐλύσαμεν","ἐλύσατε","ἔλυσαν"],
    futurum:    ["λύσω","λύσεις","λύσει","λύσομεν","λύσετε","λύσουσι(ν)"],
    nl:{ praesens:   ["ik maak los","jij maakt los","hij maakt los","wij maken los","jullie maken los","zij maken los"],
         imperfectum:["ik maakte los / zij maakten los","jij maakte los","hij maakte los","wij maakten los","jullie maakten los","ik maakte los / zij maakten los"],
         aoristus:   ["ik maakte los / zij maakten los (aor)","jij maakte los (aor)","hij maakte los (aor)","wij maakten los (aor)","jullie maakten los (aor)","ik maakte los / zij maakten los (aor)"],
         futurum:    ["ik zal losmaken","jij zal losmaken","hij zal losmaken","wij zullen losmaken","jullie zullen losmaken","zij zullen losmaken"] } },
  { lemma:"ἀγγέλλω", betekenis:"aankondigen, berichten",
    praesens:   ["ἀγγέλλω","ἀγγέλλεις","ἀγγέλλει","ἀγγέλλομεν","ἀγγέλλετε","ἀγγέλλουσι(ν)"],
    imperfectum:["ἤγγελλον","ἤγγελλες","ἤγγελλε(ν)","ἠγγέλλομεν","ἠγγέλλετε","ἤγγελλον"],
    aoristus:   ["ἤγγειλα","ἤγγειλας","ἤγγειλε(ν)","ἠγγείλαμεν","ἠγγείλατε","ἤγγειλαν"],
    futurum:    ["ἀγγελῶ","ἀγγελεῖς","ἀγγελεῖ","ἀγγελοῦμεν","ἀγγελεῖτε","ἀγγελοῦσι(ν)"],
    nl:{ praesens:   ["ik kondig aan","jij kondigt aan","hij kondigt aan","wij kondigen aan","jullie kondigen aan","zij kondigen aan"],
         imperfectum:["ik kondigde aan / zij kondigden aan","jij kondigde aan","hij kondigde aan","wij kondigden aan","jullie kondigden aan","ik kondigde aan / zij kondigden aan"],
         aoristus:   ["ik kondigde aan / zij kondigden aan (aor)","jij kondigde aan (aor)","hij kondigde aan (aor)","wij kondigden aan (aor)","jullie kondigden aan (aor)","ik kondigde aan / zij kondigden aan (aor)"],
         futurum:    ["ik zal aankondigen","jij zal aankondigen","hij zal aankondigen","wij zullen aankondigen","jullie zullen aankondigen","zij zullen aankondigen"] } },
  { lemma:"ποιέω", betekenis:"maken, doen",
    praesens:   ["ποιῶ","ποιεῖς","ποιεῖ","ποιοῦμεν","ποιεῖτε","ποιοῦσι(ν)"],
    imperfectum:["ἐποίουν","ἐποίεις","ἐποίει","ἐποιοῦμεν","ἐποιεῖτε","ἐποίουν"],
    aoristus:   ["ἐποίησα","ἐποίησας","ἐποίησε(ν)","ἐποιήσαμεν","ἐποιήσατε","ἐποίησαν"],
    futurum:    ["ποιήσω","ποιήσεις","ποιήσει","ποιήσομεν","ποιήσετε","ποιήσουσι(ν)"],
    nl:{ praesens:   ["ik maak / doe","jij maakt / doet","hij maakt / doet","wij maken / doen","jullie maken / doen","zij maken / doen"],
         imperfectum:["ik maakte / deed, zij maakten / deden","jij maakte / deed","hij maakte / deed","wij maakten / deden","jullie maakten / deden","ik maakte / deed, zij maakten / deden"],
         aoristus:   ["ik maakte / deed (aor)","jij maakte / deed (aor)","hij maakte / deed (aor)","wij maakten / deden (aor)","jullie maakten / deden (aor)","zij maakten / deden (aor)"],
         futurum:    ["ik zal maken / doen","jij zal maken / doen","hij zal maken / doen","wij zullen maken / doen","jullie zullen maken / doen","zij zullen maken / doen"] } },
  { lemma:"εἰμί", betekenis:"zijn",
    praesens:   ["εἰμῐ́","εἶ","ἐστῐ́(ν)","ἐσμέν","ἐστέ","εἰσῐ́(ν)"],
    imperfectum:["ἦ / ἦν","ἦσθᾰ","ἦν","ἦμεν","ἦτε","ἦσᾰν"],
    nl:{ praesens:   ["ik ben","jij bent","hij is","wij zijn","jullie zijn","zij zijn"],
         imperfectum:["ik was","jij was","hij was","wij waren","jullie waren","zij waren"] } },
  { lemma:"ἔχω", betekenis:"hebben",
    praesens:   ["ἔχω","ἔχεις","ἔχει","ἔχομεν","ἔχετε","ἔχουσῐ(ν)"],
    imperfectum:["εἶχον","εἶχες","εἶχε(ν)","εἴχομεν","εἴχετε","εἶχον"],
    aoristus:   ["ἔσχον","ἔσχες","ἔσχε(ν)","ἔσχομεν","ἔσχετε","ἔσχον"],
    nl:{ praesens:   ["ik heb","jij hebt","hij heeft","wij hebben","jullie hebben","zij hebben"],
         imperfectum:["ik had / zij hadden","jij had","hij had","wij hadden","jullie hadden","ik had / zij hadden"],
         aoristus:   ["ik had / zij hadden (aor)","jij had (aor)","hij had (aor)","wij hadden (aor)","jullie hadden (aor)","ik had / zij hadden (aor)"] } },
  { lemma:"λαμβάνω", betekenis:"nemen, pakken",
    praesens:   ["λᾰμβᾰ́νω","λᾰμβᾰ́νεις","λᾰμβᾰ́νει","λᾰμβᾰ́νομεν","λᾰμβᾰ́νετε","λᾰμβᾰ́νουσῐ(ν)"],
    imperfectum:["ἐλᾰ́μβᾰνον","ἐλᾰ́μβᾰνες","ἐλᾰ́μβᾰνε(ν)","ἐλᾰμβᾰ́νομεν","ἐλᾰμβᾰ́νετε","ἐλᾰ́μβᾰνον"],
    aoristus:   ["ἔλᾰβον","ἔλᾰβες","ἔλᾰβε(ν)","ἐλᾰ́βομεν","ἐλᾰ́βετε","ἔλᾰβον"],
    nl:{ praesens:   ["ik neem","jij neemt","hij/zij/het neemt","wij nemen","jullie nemen","zij nemen"],
         imperfectum:["ik nam / zij namen","jij nam","hij nam","wij namen","jullie namen","ik nam / zij namen"],
         aoristus:   ["ik nam / zij namen (aor)","jij nam (aor)","hij nam (aor)","wij namen (aor)","jullie namen (aor)","ik nam / zij namen (aor)"] } },
  { lemma:"λέγω", betekenis:"zeggen",
    praesens:   ["λέγω","λέγεις","λέγει","λέγομεν","λέγετε","λέγουσῐ(ν)"],
    imperfectum:["ἔλεγον","ἔλεγες","ἔλεγε(ν)","ἐλέγομεν","ἐλέγετε","ἔλεγον"],
    aoristus:   ["εἶπον","εἶπες","εἶπε(ν)","εἴπομεν","εἴπετε","εἶπον"],
    nl:{ praesens:   ["ik zeg","jij zegt","hij/zij/het zegt","wij zeggen","jullie zeggen","zij zeggen"],
         imperfectum:["ik zei / zij zeiden","jij zei","hij zei","wij zeiden","jullie zeiden","ik zei / zij zeiden"],
         aoristus:   ["ik zei / zij zeiden (aor)","jij zei (aor)","hij zei (aor)","wij zeiden (aor)","jullie zeiden (aor)","ik zei / zij zeiden (aor)"] } },
];
