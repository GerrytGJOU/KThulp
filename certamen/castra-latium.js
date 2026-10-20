/* ============================================================================
   CASTRA HEROUM — LATIUM UITGEBOUWD: KLUIZENAAR, WOORDENQUIZ, DAGELIJKSE JACHTOPDRACHT
   ----------------------------------------------------------------------------
   Opdrachten die bij de grotere Latium-kaart en zijn binnenruimtes horen (kunnen
   later naar andere regio's worden uitgerold):
     Eremita    in de grot (Specus Lupae): haal heilig water uit de diepe grot (Specus
                altus, trap naar beneden). Beloning: brons, graan, een kaartentrekking en
                een SPOOR NAAR ROMULUS (zijn held verschijnt dan op de Via).
     Senator    op de zolder van de herberg (vanaf Castra-niveau 13): woordenquiz van
                5 Latijnse woorden met drie antwoorden; beloning eenmaal per dag.
     Venator    bij de zuidingang van Latium: dagelijkse jachtopdracht ("versla drie
                vijanden in <terrein>"); eenmaal per dag uit te voeren.
   Laadt NA castra-interiors.js.
   ============================================================================ */

CASTRA_ITEMS.aqua = { nm:"Aqua sacra", icon:"💧", nl:"heilig water" };
CASTRA_WENT.push({ id:"venator_latium", region:"latium", kind:"npc", role:"bounty", nm:"Venator", x:36, y:44, dir:"left",
  look:{ huid:"getint", haar:"kort", haarkleur:"bruin", baard:"baard", cape:"geen", helm:"bandana", schild:"geen", wapen:"boog", armor:"middel" } });
const _castraWFeatLat0 = castraWFeat;
castraWFeat = function(e){ if(e.role==="senator") return "puzzels"; return _castraWFeatLat0(e); };
function castraLatSay(who, look, lines, done){ castraDlgOpen({ nm:who, look }, lines, done); }

/* ---------- Eremita ---------- */
function castraEremitaTalk(){
  if(CASTRA_DLG) return;
  const e = CASTRA_WENT.find(x=>x.id==="eremita"), q = castraWQ("eremita");
  const say = (lines, done)=>castraLatSay("Eremita", e.look, lines, done);
  if(q.step===0){
    say([ { la:"Salve, hospes {naam}! Aquam sacram quaero.", nl:"Gegroet, gast {naam}! Ik zoek heilig water." },
          { la:"Descende in specum altum et refer aquam sacram.", nl:"Daal af in de diepe grot (trap bovenin) en breng het heilige water." } ],
        ()=>{ q.step = 1; castraSave(); castraWobjDraw(); castraWRefreshHud && castraWRefreshHud(); });
  } else if(q.step===1){
    if(castraWItems().aqua){
      say([ { la:"Aqua sacra! Gratias tibi ago, dux {naam}!", nl:"Het heilige water! Dank je wel, leider {naam}!" },
            { la:"Romulus in via est. Quaere eum!", nl:"Romulus is op de Via. Zoek hem op!" } ],
        ()=>{
          delete castraWItems().aqua; q.step = 2;
          const t = castraWGive(castraWScaled({ aes:120, frumentum:60 }, castraWScale("latium")));
          const trace = !castraHero("romulus"); if(trace){ (CASTRA.traces || (CASTRA.traces = {})).romulus = true; }
          castraSave(); toast("💧 "+castraLaText("recte"), t+(trace?" · spoor naar Romulus!":"")); castraWobjDraw();
          if(typeof castraPxpAdd==="function") castraPxpAdd(40, "Opdracht voltooid");
          if(typeof castraCardToken==="function") castraCardToken(1, "opdracht voltooid");
          if(typeof castraWRefreshHud==="function") castraWRefreshHud();
        });
    } else say([ { la:"Ubi est aqua sacra?", nl:"Waar is het heilige water?" } ], null);
  } else say([ { la:"Vale, dux {naam}! Bene vivas!", nl:"Tot ziens, leider {naam}! Het ga je goed!" } ], null);
}

/* ---------- Senator: woordenquiz ---------- */
const CASTRA_QUIZ_WORDS = [
  ["miles","soldaat"],["castra","kamp"],["hostis","vijand"],["dux","leider"],["porta","poort"],["urbs","stad"],["equus","paard"],["aqua","water"],["silva","bos"],["navis","schip"],
  ["pax","vrede"],["bellum","oorlog"],["rex","koning"],["lex","wet"],["terra","aarde"],["mare","zee"],["ignis","vuur"],["ventus","wind"],["nox","nacht"],["dies","dag"],
  ["amicus","vriend"],["puer","jongen"],["puella","meisje"],["liber","boek"],["templum","tempel"],["via","weg"],["flumen","rivier"],["mons","berg"],["hortus","tuin"],["lupus","wolf"],
  ["canis","hond"],["avis","vogel"],["pater","vader"],["mater","moeder"],["frater","broer"],["soror","zus"],["magnus","groot"],["parvus","klein"],["bonus","goed"],["malus","slecht"],
];
let CASTRA_QUIZ = null;
function castraQuizOpen(){
  if(CASTRA_DLG) return;
  const e = CASTRA_WENT.find(x=>x.id==="senator");
  castraLatSay("Senator", e.look, [ { la:"Salve, dux {naam}! Verba Latina scisne?", nl:"Gegroet, leider {naam}! Ken jij Latijnse woorden?" },
    { la:"Quinque quaestiones tibi do.", nl:"Ik geef je vijf vragen.", opts:[ { la:"Incipe", nl:"beginnen" }, { la:"Nunc non", nl:"nu niet" } ] } ],
    k=>{ if(k===0) castraQuizStart(); });
}
function castraQuizStart(){
  const rng = castraRng((castraNow() ^ CASTRA.seed ^ 0x51a3)>>>0); CASTRA.seed = (CASTRA.seed+7)>>>0;
  const pool = CASTRA_QUIZ_WORDS.slice().sort(()=>rng()-0.5), qs = [];
  for(let i=0;i<5;i++){
    const w = pool[i], wrong = pool.slice(5).filter(x=>x[1]!==w[1]).sort(()=>rng()-0.5).slice(0,2).map(x=>x[1]);
    const opts = [w[1]].concat(wrong).sort(()=>rng()-0.5);
    qs.push({ la:w[0], opts, ans:opts.indexOf(w[1]) });
  }
  CASTRA_QUIZ = { qs, i:0, score:0, picked:null, done:false };
  castraQuizRender();
}
function castraQuizRender(){
  const Z = CASTRA_QUIZ, panel = el("cwPanel"); if(!Z || !panel) return;
  const w = CASTRA.wday || (CASTRA.wday = {}), first = w.quiz_senator!==castraWDay();
  const head = `<h3 style="margin:0 0 6px">📜 Woordenquiz <small>${first?"eerste keer vandaag: beloning!":"geen beloning meer vandaag, oefenen mag"}</small></h3>`;
  if(Z.done){
    const reward = castraQuizReward();
    panel.innerHTML = `<div class="panel">${head}<div style="font-size:20px">Score: <b>${Z.score} / 5</b></div>${reward?`<div class="note">${reward}</div>`:""}
      <div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap"><button class="btn btn-gold" style="min-height:44px" onclick="castraQuizStart()">Nog een ronde</button><button class="btn" style="min-height:44px" onclick="castraQuizClose()">Sluiten</button></div></div>`;
    return;
  }
  const q = Z.qs[Z.i];
  panel.innerHTML = `<div class="panel">${head}<div style="opacity:.8">Vraag ${Z.i+1} van 5</div>
    <div style="font-size:26px;margin:8px 0">Wat betekent <b>${esc(q.la)}</b>?</div>
    ${q.opts.map((o,k)=>{ const picked = Z.picked!==null, ok = k===q.ans, sel = Z.picked===k;
      return `<button class="btn ${picked&&ok?"btn-gold":""}" ${picked?"disabled":""} style="display:block;width:100%;margin:5px 0;min-height:48px;font-size:18px;${picked&&sel&&!ok?"opacity:.55;text-decoration:line-through":""}" onclick="castraQuizPick(${k})">${picked&&ok?"✔ ":""}${esc(o)}</button>`; }).join("")}
    ${Z.picked!==null?`<button class="btn btn-gold" style="min-height:44px;margin-top:6px" onclick="castraQuizNext()">${Z.i>=4?"Uitslag":"Volgende"}</button>`:""}</div>`;
  panel.scrollIntoView({ behavior:"smooth", block:"nearest" });
}
function castraQuizPick(k){ const Z = CASTRA_QUIZ; if(!Z || Z.picked!==null) return; Z.picked = k; if(k===Z.qs[Z.i].ans) Z.score++; castraQuizRender(); }
function castraQuizNext(){ const Z = CASTRA_QUIZ; if(!Z) return; if(Z.i>=4){ Z.done = true; } else { Z.i++; Z.picked = null; } castraQuizRender(); }
function castraQuizClose(){ CASTRA_QUIZ = null; const p = el("cwPanel"); if(p) p.innerHTML = ""; }
function castraQuizReward(){
  const Z = CASTRA_QUIZ, w = CASTRA.wday || (CASTRA.wday = {});
  if(Z.paid) return Z.paid;
  if(w.quiz_senator===castraWDay()) return "";
  w.quiz_senator = castraWDay();
  let t = "";
  if(Z.score>=3){
    t = castraWGive(castraWScaled({ aes:15*Z.score, frumentum:8*Z.score }, castraWScale("latium")));
    if(Z.score===5 && typeof castraCardToken==="function") castraCardToken(1, "perfecte quiz", true), t += "  🎟️ +1 kaarttrekking";
    if(typeof castraPxpAdd==="function") castraPxpAdd(2*Z.score);
  } else t = "Nog niet genoeg goed (minimaal 3) voor een beloning. Probeer morgen opnieuw!";
  castraSave(); Z.paid = t; return t;
}

/* ---------- Venator: dagelijkse jachtopdracht ---------- */
function castraBountyToday(){
  const day = castraWDay(), b = CASTRA.bounty;
  if(b && b.day===day) return b;
  const terrs = CASTRA_VENATIO.latium.terrains, idx = Math.floor(castraNow()/86400000) % terrs.length;
  return (CASTRA.bounty = { day, region:"latium", terrain:terrs[idx].id, need:3, n:0, acc:false, done:false });
}
function castraBountyTerr(b){ return CASTRA_VENATIO[b.region].terrains.find(t=>t.id===b.terrain); }
function castraBountyTalk(){
  if(CASTRA_DLG) return;
  const e = CASTRA_WENT.find(x=>x.id==="venator_latium"), b = castraBountyToday(), tr = castraBountyTerr(b);
  const low = s=>s.charAt(0).toLowerCase()+s.slice(1);
  const say = (lines, done)=>castraLatSay("Venator", e.look, lines, done);
  if(b.done) return say([ { la:"Hodie satis fecisti. Cras redi, dux {naam}!", nl:"Vandaag heb je genoeg gedaan. Kom morgen terug, leider {naam}!" } ], null);
  if(!b.acc){
    return say([ { la:`Salve, dux {naam}! Hodie hostes ${low(tr.la)} vince.`, nl:`Gegroet, leider {naam}! Vandaag: versla vijanden ${low(tr.nl)}.` },
                 { la:"Tres hostes vince, et praemium accipies.", nl:"Versla er drie en je krijgt een beloning.", opts:[ { la:"Accipio", nl:"aannemen" }, { la:"Nunc non", nl:"nu niet" } ] } ],
      k=>{ if(k===0){ b.acc = true; castraSave(); if(typeof castraWRefreshHud==="function") castraWRefreshHud(); } });
  }
  if(b.n < b.need) return say([ { la:`Quot hostes vicisti? ${b.n} / ${b.need}.`, nl:`Hoeveel vijanden heb je verslagen? ${b.n} van ${b.need} (${low(tr.nl)}).` } ], null);
  say([ { la:"Optime, dux {naam}! Praemium tibi do.", nl:"Uitstekend, leider {naam}! Hier is je beloning." } ], ()=>{
    b.done = true; const t = castraWGive(Object.assign(castraWScaled({ aes:50, frumentum:25 }, castraWScale("latium")), { gloria:1 })); castraSave();
    toast("🏹 "+castraLaText("recte"), t); if(typeof castraPxpAdd==="function") castraPxpAdd(15, "Dagelijkse opdracht");
    if(typeof castraWRefreshHud==="function") castraWRefreshHud();
  });
}
const _castraQuestOnWinLat0 = castraQuestOnWin;
castraQuestOnWin = function(V){
  const msgs = _castraQuestOnWinLat0(V), b = CASTRA.bounty;
  if(b && b.acc && !b.done && b.day===castraWDay() && V.region===b.region && V.terrain && V.terrain.id===b.terrain && b.n<b.need){
    b.n++; castraSave(); if(typeof toast==="function") setTimeout(()=>toast("🏹 Dagelijkse opdracht", b.n+" / "+b.need+" verslagen"), 500);
  }
  return msgs;
};
function castraBountyHud(){
  const b = CASTRA.bounty; if(!b || !b.acc || b.done || b.day!==castraWDay()) return null;
  const tr = castraBountyTerr(b), low = s=>s.charAt(0).toLowerCase()+s.slice(1);
  return { la:`Hodie hostes ${low(tr.la)} vince! (${b.n}/${b.need})`, nl:`Dagelijkse opdracht: versla ${b.need} vijanden ${low(tr.nl)} (${b.n}/${b.need}).` };
}
const _castraQuestHudLat0 = castraQuestHud;
castraQuestHud = function(){
  const t = castraBountyHud(); let extra = t ? `<div class="note" style="text-align:center">🏹 ${castraLaHTML(t.la, t.nl, "bounty_hud")}</div>` : "";
  if(CASTRA_W_REGION==="specus_latium" || CASTRA_W_REGION==="specus_altus"){ if(castraWQ("eremita").step===1) extra += `<div class="note" style="text-align:center">📜 ${castraLaHTML("Aquam sacram refer!", "Haal heilig water uit de diepe grot voor de Eremita (trap naar beneden bovenin de grot).", "eremita_hud")}</div>`; }
  return _castraQuestHudLat0() + extra;
};
const _castraWobjOpusLat0 = castraWobjOpus;
castraWobjOpus = function(){ const out = _castraWobjOpusLat0(); const t = castraBountyHud(); if(t) out.push({ la:t.la, nl:t.nl }); const q = castraWQ("eremita"); if(q.step===1) out.push({ la:"Aquam sacram refer!", nl:"Latium: haal heilig water uit de diepe grot (trap bovenin de Specus Lupae) voor de Eremita." }); return out; };
