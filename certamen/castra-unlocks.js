/* ============================================================================
   CASTRA HEROUM — CASTRA-NIVEAU EN GELEIDELIJKE ONTGRENDELINGEN
   ----------------------------------------------------------------------------
   Om het tutorial overzichtelijk te houden komen de systemen één voor één in
   het spel. Je spelersniveau ("Castra-niveau") stijgt door te spelen (jagen,
   vangen, missies winnen, opdrachten doen, de codex vullen) en elke paar
   niveaus ontgrendelt er iets nieuws; Aeneas legt dat telkens kort uit.

   Castra-niveau L vraagt in totaal 50·(L−1) + 14·(L−1)·(L−2) XP (afgestemd met een tempo-model):
   2 → 50, 3 → 128, 5 → 368, 8 → 938, 10 → 1458, 13 → 2448, 16 → 3690, 20 → 5738.
   Opslag: CASTRA.pxp (XP), CASTRA.unl { id: true } (al aangekondigd).
   Oude saves (met voortgang) krijgen een inschatting van hun XP en alles wat dan al
   open is wordt stil als aangekondigd gemarkeerd.
   Laadt NA castra-tutorial.js en castra-cards.js.
   ============================================================================ */

const CASTRA_UNLOCKS = [
  { id:"codex",     lvl:2,  la:"Codex",        nl:"de codex (alle soldaten en helden)",
    lines:[ { la:"Bene, dux {naam}! Codex tuus aperitur.", nl:"Goed, leider {naam}! Je codex gaat open." },
            { la:"Hic omnes milites et heroes vides.", nl:"Hier zie je alle soldaten en helden." } ] },
  { id:"wereld",    lvl:3,  la:"Arcae",        nl:"kisten, voorwerpen en zoekopdrachten in de wereld",
    lines:[ { la:"Arcae et negotia in regionibus sunt.", nl:"In de regio's staan kisten en opdrachten." },
            { la:"Quaere ea, dux {naam}!", nl:"Zoek ze op, leider {naam}!" } ] },
  { id:"tabulae",   lvl:5,  la:"Tabulae",      nl:"kaarten met blijvende bonussen (menu: Tabulae)",
    lines:[ { la:"Tabulae tibi dantur! Bonos dant.", nl:"Je krijgt kaarten! Ze geven bonussen." },
            { la:"Hodie unam tabulam gratis trahis.", nl:"Vandaag trek je er gratis één. Ook quests geven trekkingen." } ] },
  { id:"dona",      lvl:6,  la:"Dona",         nl:"een gunst kiezen tussen de golven (tower defence)",
    lines:[ { la:"Post alam donum eligere potes.", nl:"Na elke golf kun je een gunst kiezen." },
            { la:"Elige bene!", nl:"Kies verstandig!" } ] },
  { id:"contubernium", lvl:7, la:"Contubernium", nl:"rustende soldaten krijgen een deel van de ervaring (Exp. Share)",
    lines:[ { la:"Milites in tabernaculo quiescunt, sed discunt.", nl:"Soldaten die in de tent rusten, leren toch mee." },
            { la:"Contubernium tibi datur!", nl:"Je krijgt het Contubernium! Soldaten die niet meevechten, krijgen een deel van de ervaring (menu: Milites)." } ] },
  { id:"artes",     lvl:8,  la:"Artes",        nl:"artes kiezen (maximaal 4 per soldaat of held)",
    lines:[ { la:"Iam artes eligere potes!", nl:"Je kunt nu artes kiezen!" },
            { la:"Quattuor tantum habes. Elige bene!", nl:"Je hebt er maar vier. Kies verstandig! (menu: Milites of Heroes)" } ] },
  { id:"bouwen",    lvl:10, la:"Aedificia",    nl:"samen met de Faber gebouwen neerzetten in de wereld",
    lines:[ { la:"Faber ligna et aes quaerit.", nl:"De bouwer zoekt hout en brons." },
            { la:"Aedifica cum eo!", nl:"Bouw samen met hem! Gebouwen geven dagelijks iets." } ] },
  { id:"puzzels",   lvl:13, la:"Ludi",         nl:"Latijnse puzzels bij de Magistra",
    lines:[ { la:"Magistra tecum ludere vult.", nl:"De lerares wil met je spelen." },
            { la:"Ludi tibi praemia dant.", nl:"De puzzels geven beloningen." } ] },
  { id:"vergelijk", lvl:16, la:"Compara",      nl:"soldaten en helden en hun artes vergelijken (menu: Compara)",
    lines:[ { la:"Milites inter se comparare potes.", nl:"Je kunt soldaten met elkaar vergelijken." },
            { la:"Sic optimum eligis.", nl:"Zo kies je de beste." } ] },
];
// XP voor een missie die je voor het eerst wint: oplopend met de volgorde van de missies.
function castraMissionXp(index, waves){ return 20 + 5*waves + 2*index; }
function castraUnlockDef(id){ return CASTRA_UNLOCKS.find(u=>u.id===id); }
function castraPxpFor(L){ return 50*(L-1) + 14*(L-1)*(L-2); }
function castraPLevel(){ const x = CASTRA.pxp||0; let L = 1; while(x >= castraPxpFor(L+1)) L++; return L; }
function castraUnlocked(id){ const u = castraUnlockDef(id); return !u || castraPLevel() >= u.lvl; }
function castraUnlockNext(){ const L = castraPLevel(); return CASTRA_UNLOCKS.find(u=>u.lvl>L) || null; }
function castraPLevelInfo(){
  const L = castraPLevel(), x = CASTRA.pxp||0, a = castraPxpFor(L), b = castraPxpFor(L+1);
  return { L, x, a, b, pct: Math.round(100*(x-a)/Math.max(1,b-a)), next: castraUnlockNext() };
}
// XP voor het Castra-niveau (spelersniveau). Meldt een niveaustijging en kondigt ontgrendelingen aan.
function castraPxpAdd(n, why){
  if(!CASTRA || !n) return;
  const L0 = castraPLevel(); CASTRA.pxp = (CASTRA.pxp||0) + n;
  const L1 = castraPLevel();
  if(L1 > L0){
    if(typeof toast==="function") toast("🎖️ Niveau "+L1+"!", why ? why : "Je Castra-niveau stijgt.");
    castraUnlockCheck();
  }
  castraSave();
}
// Vergelijk met wat al aangekondigd is; nieuw geopend = in de wachtrij voor Aeneas.
function castraUnlockCheck(){
  if(!CASTRA) return;
  if(!CASTRA.unl){
    CASTRA.unl = {};
    const old = CASTRA.tut && CASTRA.tut.step===99 && !CASTRA.pxp;             // bestaande save zonder niveau: inschatten
    if(old){
      let x = 0; CASTRA_P_MISSIONS.forEach((m,i)=>{ if(castraPMissionDone(m.id)) x += castraMissionXp(i, m.waves.length); });
      x += (CASTRA.heroes||[]).length*60 + Object.keys(CASTRA.codex||{}).length*4 + (CASTRA.soldiers||[]).length*10;
      CASTRA.pxp = x;
      CASTRA_UNLOCKS.forEach(u=>{ if(castraPLevel()>=u.lvl) CASTRA.unl[u.id] = true; });
      castraSave(); return;
    }
  }
  const q = CASTRA.unlQ || (CASTRA.unlQ = []);
  CASTRA_UNLOCKS.forEach(u=>{
    if(castraPLevel()>=u.lvl && !CASTRA.unl[u.id]){
      CASTRA.unl[u.id] = true; q.push(u.id);
      if(u.id==="tabulae" && typeof castraCardToken==="function") castraCardToken(1, "cadeau bij Tabulae", true);
      if(typeof CASTRA_WORLD_BUILT!=="undefined" && (u.id==="wereld" || u.id==="bouwen" || u.id==="puzzels")) CASTRA_WORLD_BUILT = {};
    }
  });
  castraSave();
}
// Toon de wachtrij met Aeneas (alleen als er geen ander dialoogvenster open is).
function castraUnlockShow(){
  if(CASTRA_DLG || !CASTRA || !CASTRA.unlQ || !CASTRA.unlQ.length) return;
  if(!CASTRA.tut || CASTRA.tut.step<99) return;          // tijdens het tutorial niets aankondigen
  const id = CASTRA.unlQ.shift(), u = castraUnlockDef(id); castraSave(); if(!u) return castraUnlockShow();
  const head = { la:`Gradus ${u.lvl}! ${u.la} aperitur.`, nl:`Niveau ${u.lvl}! Nieuw: ${u.nl}.` };
  castraDlgOpen("aeneas", [head].concat(u.lines), ()=>{ if(typeof castraRenderRes==="function") castraRenderRes(); castraUnlockShow(); });
}
function castraLockedToast(id){ const u = castraUnlockDef(id); if(u && typeof toast==="function") toast("🔒 Niveau "+u.lvl, "Dit ontgrendel je op Castra-niveau "+u.lvl+" ("+u.nl+")."); }
