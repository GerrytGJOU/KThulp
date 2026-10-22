/* ============================================================================
   CASTRA HEROUM — QUESTMOTOR EN DIARIUM (opdrachtendagboek)
   ----------------------------------------------------------------------------
   Eén motor voor zijquests (en later de persoonlijke heldenquests van CASTRA_HERO_EVO). Een quest heeft
   een gever (een NPC in de wereld), voorwaarden, een of meer stappen en een beloning:
     kill {n, region, terrain?}   versla n vijanden (jacht) in een regio en eventueel terrein
     catch {n}                    vang n vijanden
     boss {key}                   versla een bepaalde baas
     win {mission}                win een tower defence-missie
     stat {stat, min}             heb een soldaat of held met minstens zoveel van een stat
     have {item, n?}              bezit een voorwerp (het wordt niet ingeleverd)
     talk {npc, lines}            praat met een andere NPC
   De speler neemt de quest aan bij de gever (Latijns gesprek met keuze), werkt de stappen af en meldt zich
   weer bij de gever voor de beloning. Voortgang: CASTRA.dq[id] = { s:stap, n:teller, a:1, d:1 (klaar) }.
   Het Diarium (menu, vervangt Opus) toont lopende en beschikbare opdrachten, de plek van de gever,
   de stappen met voortgang, de beloning en wat is afgerond, plus de oude opdrachten uit de wereld.
   Laadt als laatste (na castra-moves.js en castra-xp.js).
   ============================================================================ */

const CASTRA_DQ_YES = { la:"Accipio", nl:"aannemen" }, CASTRA_DQ_NO = { la:"Nunc non", nl:"nu niet" };
const CASTRA_QDEFS = [
  { id:"l_senator", giver:"senator", region:"latium", nm:{ la:"Miles fortis", nl:"Een sterke soldaat" },
    ask:[ { la:"Salve, dux {naam}! Fortes milites quaero.", nl:"Gegroet, leider {naam}! Ik zoek sterke soldaten." },
          { la:"Ostende mihi militem fortem et duos hostes cape.", nl:"Laat mij een sterke soldaat zien (minstens 22 impetus) en vang twee vijanden.", opts:[CASTRA_DQ_YES, CASTRA_DQ_NO] } ],
    steps:[ { kind:"stat", stat:"impetus", min:22, hud:{ la:"Habe militem fortem!", nl:"Heb een soldaat met minstens 22 impetus." } },
            { kind:"catch", n:2, hud:{ la:"Cape duos hostes!", nl:"Vang twee vijanden." } } ],
    done:[ { la:"Optime, dux {naam}! Praemium tibi do.", nl:"Uitstekend, leider {naam}! Hier is je beloning." } ],
    reward:{ aes:120, frumentum:60, gloria:2, pxp:30 } },
  { id:"l_matrona", giver:"matrona_villa", region:"latium", nm:{ la:"Anulus perditus", nl:"De verloren ring" },
    ask:[ { la:"Heu, hospes {naam}! Anulus meus perditus est.", nl:"Ach, gast {naam}! Mijn ring is verdwenen." },
          { la:"Quaere anulum in agris, quaeso.", nl:"Zoek mijn ring op de velden, alsjeblieft (hij ligt ergens buiten in Latium).", opts:[CASTRA_DQ_YES, CASTRA_DQ_NO] } ],
    steps:[ { kind:"find", region:"latium", icon:"💍", nm:"verloren ring", hud:{ la:"Quaere anulum!", nl:"Zoek de ring buiten in Latium." } } ],
    done:[ { la:"Anulus meus! Gratias tibi ago, dux {naam}!", nl:"Mijn ring! Dank je wel, leider {naam}!" } ],
    reward:{ aes:90, frumentum:50, gloria:2, pxp:30, token:1 } },
  { id:"l_faber", giver:"faber", region:"latium", nm:{ la:"Murus novus", nl:"Een nieuwe muur" },
    ask:[ { la:"Salve, dux {naam}! Murum novum aedifico.", nl:"Gegroet, leider {naam}! Ik bouw een nieuwe muur." },
          { la:"Vince in Via Latina et quattuor hostes in via vince.", nl:"Win op de Via Latina (missie 2) en versla vier vijanden op de weg.", opts:[CASTRA_DQ_YES, CASTRA_DQ_NO] } ],
    steps:[ { kind:"win", mission:"m2", hud:{ la:"Vince in Via Latina!", nl:"Win de missie Via Latina." } },
            { kind:"kill", n:4, region:"latium", terrain:"via", hud:{ la:"Vince hostes in via!", nl:"Versla vijanden op de weg." } } ],
    done:[ { la:"Murus novus paratus est! Gratias tibi ago.", nl:"De nieuwe muur is klaar! Dank je wel." } ],
    reward:{ aes:110, frumentum:70, gloria:2, pxp:30 } },
  { id:"g_gymnasiarches", giver:"rest_graecia", region:"graecia", nm:{ la:"Celer miles", nl:"Een snelle soldaat" },
    ask:[ { la:"Salve, dux {naam}! Celeres milites amo.", nl:"Gegroet, leider {naam}! Ik hou van snelle soldaten." },
          { la:"Habe militem celerem et vince quinque hostes ad litus.", nl:"Heb een snelle soldaat (minstens 10 celeritas) en versla vijf vijanden aan de kust.", opts:[CASTRA_DQ_YES, CASTRA_DQ_NO] } ],
    steps:[ { kind:"stat", stat:"celeritas", min:10, hud:{ la:"Habe militem celerem!", nl:"Heb een soldaat met minstens 10 celeritas." } },
            { kind:"kill", n:5, region:"graecia", terrain:"litus", hud:{ la:"Vince hostes ad litus!", nl:"Versla vijanden aan de kust." } } ],
    done:[ { la:"Optime! Celer es, dux {naam}.", nl:"Uitstekend! Je bent snel, leider {naam}." } ],
    reward:{ aes:150, frumentum:80, gloria:2, pxp:35 } },
  { id:"g_pythia", giver:"quiz_graecia", region:"graecia", nm:{ la:"Oraculum", nl:"Het orakel" },
    ask:[ { la:"Salve, hospes {naam}! Oraculum loquitur.", nl:"Gegroet, gast {naam}! Het orakel spreekt." },
          { la:"Quaere poetam et vince in Graecia.", nl:"Zoek de dichter op en win de eerste missie in Graecia.", opts:[CASTRA_DQ_YES, CASTRA_DQ_NO] } ],
    steps:[ { kind:"talk", npc:"q_graecia", hud:{ la:"Quaere poetam!", nl:"Praat met de dichter (Graecia)." },
              lines:[ { la:"Pythia te misit? Bene! Carmen tibi cano.", nl:"Heeft de Pythia je gestuurd? Goed! Ik zing een lied voor je." } ] },
            { kind:"win", mission:"g1", hud:{ la:"Vince in Graecia!", nl:"Win de eerste missie in Graecia." } } ],
    done:[ { la:"Oraculum verum est. Gratias tibi ago!", nl:"Het orakel is waar. Dank je wel!" } ],
    reward:{ aes:140, frumentum:70, gloria:3, pxp:35, token:1 } },
  { id:"t_vates", giver:"quiz_troia", region:"troia", nm:{ la:"Visio Cassandrae", nl:"De visioen van Cassandra" },
    ask:[ { la:"Salve, dux {naam}! Cassandra periculum videt.", nl:"Gegroet, leider {naam}! Cassandra ziet gevaar." },
          { la:"Dic Cassandrae et vince sex hostes ante muros.", nl:"Praat met Cassandra en versla zes vijanden voor de muren.", opts:[CASTRA_DQ_YES, CASTRA_DQ_NO] } ],
    steps:[ { kind:"talk", npc:"fetch_troia", hud:{ la:"Dic Cassandrae!", nl:"Praat met Cassandra (de grot in Troia)." },
              lines:[ { la:"Periculum video! Hostes veniunt.", nl:"Ik zie gevaar! Er komen vijanden." } ] },
            { kind:"kill", n:6, region:"troia", terrain:"muros", hud:{ la:"Vince hostes ante muros!", nl:"Versla vijanden voor de muren." } } ],
    done:[ { la:"Optime, dux {naam}! Troia tuta est.", nl:"Uitstekend, leider {naam}! Troje is veilig." } ],
    reward:{ aes:170, frumentum:90, gloria:3, pxp:40 } },
  { id:"t_servus", giver:"rest_troia", region:"troia", nm:{ la:"Vinum perditum", nl:"De verloren wijn" },
    ask:[ { la:"Salve, hospes {naam}! Amphora vini perdita est.", nl:"Gegroet, gast {naam}! Een amfoor wijn is zoekgeraakt." },
          { la:"Quaere amphoram in Troia, quaeso.", nl:"Zoek de amfoor ergens buiten in Troje, alsjeblieft.", opts:[CASTRA_DQ_YES, CASTRA_DQ_NO] } ],
    steps:[ { kind:"find", region:"troia", icon:"🍷", nm:"amfoor wijn", hud:{ la:"Quaere amphoram vini!", nl:"Zoek de amfoor wijn buiten in Troje." } } ],
    done:[ { la:"Amphora vini! Gratias tibi ago.", nl:"De amfoor wijn! Dank je wel." } ],
    reward:{ aes:120, frumentum:70, gloria:2, pxp:30, token:1 } },
];

/* ---------- toestand ---------- */
function castraDqState(id){ const d = CASTRA.dq || (CASTRA.dq = {}); return d[id] || (d[id] = { s:0, n:0 }); }
function castraDqDef(id){ return CASTRA_QDEFS.find(q=>q.id===id) || null; }
function castraDqRegionOpen(rid){ return typeof castraRegionOpen==="function" ? castraRegionOpen(rid) : true; }
function castraDqAvailable(q){
  const st = (CASTRA.dq||{})[q.id]; if(st && (st.a || st.d)) return false;
  if(q.after && !((CASTRA.dq||{})[q.after]||{}).d) return false;
  if(q.region && !castraDqRegionOpen(q.region)) return false;
  if(q.can && !q.can()) return false;
  return true;
}
function castraDqActive(){ return CASTRA_QDEFS.filter(q=>{ const st = (CASTRA.dq||{})[q.id]; return st && st.a && !st.d; }); }
function castraDqDone(){ return CASTRA_QDEFS.filter(q=>((CASTRA.dq||{})[q.id]||{}).d); }
function castraDqBest(stat){
  let best = 0;
  (CASTRA.soldiers||[]).forEach(s=>{ try{ best = Math.max(best, castraStats(s)[stat]||0); }catch(e){} });
  (CASTRA.heroes||[]).forEach(h=>{ try{ best = Math.max(best, castraHeroStats(h)[stat]||0); }catch(e){} });
  return best;
}
// Is de huidige stap van deze quest voldaan (en geeft de voortgang)?
function castraDqStepInfo(q, st){
  const s = q.steps[st.s]; if(!s) return { done:true, txt:"" };
  if(s.kind==="kill" || s.kind==="catch") return { done:(st.n||0) >= s.n, txt:(st.n||0)+" / "+s.n };
  if(s.kind==="win") return { done:castraPMissionDone(s.mission), txt:"" };
  if(s.kind==="stat"){ const b = castraDqBest(s.stat); return { done:b >= s.min, txt:b+" / "+s.min+" "+s.stat }; }
  if(s.kind==="have"){ const n = (castraWItems()[s.item]||0); return { done:n >= (s.n||1), txt:n+" / "+(s.n||1) }; }
  if(s.kind==="boss") return { done:!!st.b, txt:"" };
  if(s.kind==="talk") return { done:!!st.t, txt:"" };
  if(s.kind==="find") return { done:!!st.fnd, txt:"" };
  return { done:false, txt:"" };
}
// Stappen die voldaan zijn schuiven door (meerdere achter elkaar mogelijk).
function castraDqRedraw(){ try{ if(typeof el==="function" && el("cwWobj") && typeof castraWobjDraw==="function") castraWobjDraw(); if(typeof castraAmbDraw==="function") castraAmbDraw(); if(typeof castraWRefreshHud==="function" && el("cwHud")) castraWRefreshHud(); }catch(e){} }
function castraDqSync(quiet){
  let changed = false;
  castraDqActive().forEach(q=>{
    const st = castraDqState(q.id);
    while(st.s < q.steps.length && castraDqStepInfo(q, st).done){
      st.s++; st.n = 0; st.t = 0; st.b = 0; st.fnd = 0; delete st.fx; delete st.fy; changed = true;
      if(!quiet && typeof toast==="function") toast("📜 Diarium", st.s>=q.steps.length ? q.nm.nl+": klaar, meld je bij de gever!" : q.nm.nl+": volgende stap!");
    }
  });
  if(changed){ castraSave(); castraDqRedraw(); }
  return changed;
}
// Gebeurtenissen: kill (V), catch (V), boss (key).
function castraDqEvent(ev){
  castraDqActive().forEach(q=>{
    const st = castraDqState(q.id), s = q.steps[st.s]; if(!s) return;
    if(ev.kind==="kill" && s.kind==="kill" && (!s.region || s.region===ev.region) && (!s.terrain || s.terrain===ev.terrain)) st.n = (st.n||0)+1;
    else if(ev.kind==="catch" && s.kind==="catch") st.n = (st.n||0)+1;
    else if(ev.kind==="boss" && s.kind==="boss" && s.key===ev.key) st.b = 1;
  });
  castraDqSync();
}
const _castraVFinishDq0 = castraVFinish;
castraVFinish = function(){
  const V = CASTRA_V; _castraVFinishDq0.apply(this, arguments);
  try{
    if(V && V.over==="win"){
      castraDqEvent({ kind:"kill", region:V.region, terrain:V.terrain && V.terrain.id });
      if(V.caught) castraDqEvent({ kind:"catch" });
      if(V.boss && V.boss.key) castraDqEvent({ kind:"boss", key:String(V.boss.key).replace(/^boss_/,"") });
    }
  }catch(e){}
};

/* ---------- gesprekken met de NPC's ---------- */
function castraDqReward(q){
  const r = q.reward || {}, res = {}; ["aes","frumentum","lignum","gloria"].forEach(k=>{ if(r[k]) res[k] = r[k]; });
  const txt = Object.keys(res).length ? castraWGive(res) : "";
  if(r.item){ const it = castraWItems(); it[r.item] = (it[r.item]||0)+1; }
  if(r.mount){ CASTRA.mount = { owned:1, on:1 }; try{ if(typeof el==="function" && el("cwAv")) castraWorldAvatar(); }catch(e){} }
  if(r.pxp && typeof castraPxpAdd==="function") castraPxpAdd(r.pxp, q.nm.nl);
  if(r.token && typeof castraCardToken==="function") castraCardToken(r.token, q.nm.nl);
  return txt + (r.item && typeof CASTRA_ITEMS!=="undefined" && CASTRA_ITEMS[r.item] ? "  "+CASTRA_ITEMS[r.item].icon+" "+CASTRA_ITEMS[r.item].nm : "") + (r.token ? "  🎟️ +"+r.token+" kaarttrekking" : "") + (r.mount ? "  🐎 Equus (knop linksboven in de wereld)" : "");
}
function castraDqTalk(gid){
  const hero = gid.indexOf("hero_")===0 ? castraHero(gid.slice(5)) : null;
  const amb = gid.indexOf("amb:")===0 && typeof CASTRA_AMB!=="undefined" ? CASTRA_AMB.list.find(n=>n.gid===gid) : null;
  const e = hero ? { nm:CASTRA_HERO_DATA[hero.id].nm, look:CASTRA_HERO_DATA[hero.id].look } : amb ? { nm:amb.type.nm, look:amb.look, sheet:amb.sheet } : CASTRA_WENT.find(x=>x.id===gid && x.kind==="npc"); if(!e) return false;
  castraDqSync(true);
  const look = e.look || (typeof castraWLook==="function" ? castraWLook(e) : null), say = (lines, done)=>e.sheet ? castraDlgOpen({ nm:e.nm, look, sheet:e.sheet }, lines, done) : castraLatSay(e.nm || "?", look, lines, done);
  // 1. afgeronde quest bij de gever: beloning
  const ready = castraDqActive().find(q=>q.giver===gid && castraDqState(q.id).s >= q.steps.length);
  if(ready){
    say(ready.done, ()=>{ const st = castraDqState(ready.id); st.d = 1; st.a = 0; const txt = castraDqReward(ready); castraSave(); castraDqRedraw(); toast("📜 "+castraLaText("recte"), ready.nm.nl+(txt?": "+txt:"")); });
    return true;
  }
  // 2. praatstap met deze NPC
  const talkq = castraDqActive().find(q=>{ const s = q.steps[castraDqState(q.id).s]; return s && s.kind==="talk" && s.npc===gid; });
  if(talkq){
    const st = castraDqState(talkq.id), s = talkq.steps[st.s];
    say(s.lines, ()=>{ st.t = 1; castraDqSync(); castraSave(); castraDqRedraw(); });
    return true;
  }
  // 3. nieuwe quest aanbieden
  const offer = CASTRA_QDEFS.find(q=>q.giver===gid && castraDqAvailable(q));
  if(offer){
    say(offer.ask, k=>{ if(k===0){ const st = castraDqState(offer.id); st.a = 1; st.s = 0; st.n = 0; castraSave(); toast("📜 Diarium", "Nieuwe opdracht: "+offer.nm.nl); castraDqSync(true); castraDqRedraw(); } });
    return true;
  }
  // 4. lopende quest van deze gever: korte herinnering, daarna de gewone rol van de NPC
  const mine = castraDqActive().find(q=>q.giver===gid);
  if(mine){ const s = mine.steps[castraDqState(mine.id).s]; if(s && typeof toast==="function") toast("📜 "+mine.nm.nl, s.hud.nl); }
  return false;
}
const _castraNpcTalkDq0 = castraNpcTalk;
castraNpcTalk = function(id){
  const gid = String(id).replace(/^w:/, "");
  if(!CASTRA_DLG){ try{ if(castraDqTalk(gid)) return; }catch(err){ console.error(err); } }
  return _castraNpcTalkDq0.apply(this, arguments);
};

/* ---------- Diarium (menu) ---------- */
function castraDqWhere(q){
  if(String(q.giver).indexOf("amb:")===0){ const p = String(q.giver).slice(4).split("@"), T = CASTRA_AMB_TYPES.find(t=>t.id===p[0]); return (T ? T.nm : "bewoner")+" (loopt rond in "+((CASTRA_WORLDS[p[1]]||{}).nm||p[1])+")"; }
  if(String(q.giver).indexOf("hero_")===0){ const d = CASTRA_HERO_DATA[String(q.giver).slice(5)]; return (d ? d.nm : "held")+" (menu: Heroes)"; }
  const e = CASTRA_WENT.find(x=>x.id===q.giver), w = e && CASTRA_WORLDS[e.region], par = w && w.interior && w.parent ? CASTRA_WORLDS[w.parent] : null;
  return (e ? (e.nm||"?") : "?") + " · " + (par ? par.nm+", "+w.nm : w ? w.nm : "?");
}
function castraDqNpcName(id){ const e = CASTRA_WENT.find(x=>x.id===id); return e ? (e.nm||id) + " (" + ((CASTRA_WORLDS[e.region]||{}).nm||"?") + ")" : id; }
function castraDqRewardText(q){
  const r = q.reward||{}, p = [];
  if(r.aes) p.push("🪙 "+r.aes); if(r.frumentum) p.push("🌾 "+r.frumentum); if(r.gloria) p.push("🏆 "+r.gloria); if(r.pxp) p.push("⭐ "+r.pxp+" XP"); if(r.token) p.push("🎟️"); if(r.item && typeof CASTRA_ITEMS!=="undefined" && CASTRA_ITEMS[r.item]) p.push(CASTRA_ITEMS[r.item].icon);
  return p.join(" · ");
}
function castraDqHTML(){
  castraDqSync(true);
  const row = "padding:7px 0;border-top:1px solid var(--parch-line,#c2a96f)";
  const act = castraDqActive().map(q=>{
    const st = castraDqState(q.id), readyAll = st.s >= q.steps.length;
    const steps = q.steps.map((s,i)=>{ const done = i<st.s || readyAll, cur = i===st.s && !readyAll, info = cur ? castraDqStepInfo(q, st) : null;
      const where = s.kind==="talk" ? ` <small>(${esc(castraDqNpcName(s.npc))})</small>` : "";
      return `<div style="font-size:14px;margin-left:6px;${done?"opacity:.55":""}">${done?"✔":cur?"→":"○"} ${castraLaHTML(s.hud.la, s.hud.nl, "dq_"+q.id+i)}${where}${cur&&info&&info.txt?` <b>${esc(info.txt)}</b>`:""}</div>`; }).join("");
    return `<div style="${row}"><b>${esc(q.nm.la)}</b> <small style="opacity:.7">${esc(q.nm.nl)}</small>${readyAll?` <span style="color:#2a7a32;font-weight:bold">· klaar, meld je!</span>`:""}
      <div style="font-size:12px;opacity:.75">Gever: ${esc(castraDqWhere(q))} · beloning: ${castraDqRewardText(q)}</div>${steps}</div>`; }).join("");
  const avail = CASTRA_QDEFS.filter(castraDqAvailable).map(q=>`<div style="${row}"><b>${esc(q.nm.la)}</b> <small style="opacity:.7">${esc(q.nm.nl)}</small><div style="font-size:12px;opacity:.8">❗ Praat met ${esc(castraDqWhere(q))} · beloning: ${castraDqRewardText(q)}</div></div>`).join("");
  const done = castraDqDone().map(q=>`<span style="display:inline-block;margin:2px 8px 2px 0;font-size:13px;opacity:.7">✔ ${esc(q.nm.nl)}</span>`).join("");
  return `${act ? `<h4 style="margin:8px 0 2px">Lopende opdrachten</h4>${act}` : ""}${avail ? `<h4 style="margin:10px 0 2px">Nieuwe opdrachten</h4>${avail}` : ""}${done ? `<h4 style="margin:10px 0 2px">Afgerond</h4><div>${done}</div>` : ""}${(!act && !avail && !done) ? `<div class="note">Nog geen opdrachten. Praat met mensen in de regio's.</div>` : ""}`;
}
(function(){
  const it = CASTRA_MENU_ITEMS.find(x=>x.id==="opus"); if(it){ it.la = "Diarium"; it.nl = "opdrachten"; }
  const _quest0 = castraMenuQuest;
  castraMenuQuest = function(){
    const legacy = _quest0().replace(/^<h3[^>]*>.*?<\/h3>/, "");
    return `<h3 style="margin:0 0 6px">Diarium <small>opdrachten</small></h3>${castraDqHTML()}<h4 style="margin:10px 0 2px">Lopend in de wereld</h4>${legacy}`;
  };
})();
Object.assign(CASTRA_GLOSS, { "diarium":"dagboek", "ostende":"toon", "habe":"heb", "lupi":"wolven", "dic":"zeg, praat", "eremitae":"aan de kluizenaar", "tuta":"veilig",
  "tutus":"veilig", "matrona":"vrouw des huizes", "misit":"stuurde", "novum":"nieuwe", "celeres":"snelle", "celerem":"snelle", "oraculum":"orakel", "loquitur":"spreekt",
  "poetam":"dichter (4e naamval)", "verum":"waar", "pythia":"Pythia (orakelpriesteres)", "carmen":"lied", "cano":"ik zing", "visio":"visioen", "cassandrae":"aan Cassandra",
  "periculum":"gevaar", "videt":"ziet", "sex":"zes", "video":"ik zie", "firmum":"stevige" });

/* ---------- markeringen op de kaart en opdrachten in het HUD ---------- */
// Per NPC: ❓ een afgeronde opdracht wacht op je, 💬 hier moet je praten (stap van een opdracht), ❗ er is een nieuwe opdracht.
function castraDqMark(gid){
  let best = "";
  CASTRA_QDEFS.forEach(q=>{
    const st = (CASTRA.dq||{})[q.id];
    if(st && st.a && !st.d){
      if(q.giver===gid && st.s >= q.steps.length) best = "ready";
      else { const s = q.steps[st.s]; if(s && s.kind==="talk" && s.npc===gid && best!=="ready") best = "talk"; }
    } else if(q.giver===gid && !best && castraDqAvailable(q)) best = "offer";
  });
  return best;
}
const CASTRA_DQ_MARK = {
  ready:{ ch:"?", bg:"#3f9d52", fg:"#fff", ti:"Opdracht klaar: meld je hier" },
  talk: { ch:"💬", bg:"#4a86c5", fg:"#fff", ti:"Praat hier voor je opdracht" },
  offer:{ ch:"!", bg:"#d4af37", fg:"#2b1d0e", ti:"Hier is een nieuwe opdracht" },
};
function castraDqMarkDiv(x, y, m){
  const M = CASTRA_DQ_MARK[m]; if(!M) return "";
  return `<div title="${esc(M.ti)}" style="position:absolute;left:${x*48+10}px;top:${y*48-34}px;width:28px;height:28px;border-radius:50%;background:${M.bg};color:${M.fg};border:2px solid #fff;box-shadow:0 0 8px rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;font-size:${M.ch.length>1?15:19}px;font-weight:bold;z-index:9;pointer-events:none;animation:castraBlink 1.2s infinite">${M.ch}</div>`;
}
// Een deur naar een binnenruimte krijgt de markering van wat erachter zit (tot drie deuren diep).
function castraDqDoorMark(rid, seen){
  seen = seen || {}; if(seen[rid]) return ""; seen[rid] = 1;
  const rank = { ready:3, talk:2, offer:1, "":0 }; let best = "";
  CASTRA_WENT.filter(e=>e.region===rid && e.kind==="npc").forEach(e=>{ const m = castraDqMark(e.id); if(rank[m] > rank[best]) best = m; });
  const W = CASTRA_WORLDS[rid];
  if(W && W.interior && Object.keys(seen).length < 4) (W.doors||[]).forEach(d=>{ const t = CASTRA_WORLDS[d.to]; if(t && t.interior){ const m = castraDqDoorMark(d.to, seen); if(rank[m] > rank[best]) best = m; } });
  return best;
}
const _castraWobjDrawDq0 = castraWobjDraw;
castraWobjDraw = function(){
  _castraWobjDrawDq0();
  const box = el("cwWobj"); if(!box) return;
  let html = "";
  castraWEnts().filter(e=>e.kind==="npc").forEach(e=>{ const m = castraDqMark(e.id); if(m) html += castraDqMarkDiv(e.x, e.y, m); });
  const W = castraWorldCfg();
  (W.doors||[]).forEach(d=>{ const t = CASTRA_WORLDS[d.to]; if(t && t.interior){ const m = castraDqDoorMark(d.to); if(m) html += castraDqMarkDiv(d.x, d.y, m); } });
  if(html) box.insertAdjacentHTML("beforeend", html);
};
// HUD: lopende opdrachten (maximaal drie), afgeronde eerst.
function castraDqHud(){
  const rows = castraDqActive().map(q=>{
    const st = castraDqState(q.id), ready = st.s >= q.steps.length, s = q.steps[st.s], info = s ? castraDqStepInfo(q, st) : null;
    return { ready, html:`<div class="note" style="text-align:center">${ready?"❓":"📜"} ${esc(q.nm.nl)}: ${ready ? "meld je bij "+esc(castraDqWhere(q)) : castraLaHTML(s.hud.la, s.hud.nl, "dqh_"+q.id+st.s)+(info&&info.txt?" <b>"+esc(info.txt)+"</b>":"")}</div>` };
  }).sort((a,b)=>(b.ready?1:0)-(a.ready?1:0));
  return rows.slice(0,3).map(r=>r.html).join("");
}
const _castraQuestHudDq0 = castraQuestHud;
castraQuestHud = function(){ return _castraQuestHudDq0() + castraDqHud(); };

/* ---------- stap "find": een verloren voorwerp of persoon terugvinden ---------- */
function castraDqFindSpot(q, st, s){
  if(st.fx!==undefined) return { x:st.fx, y:st.fy };
  if(CASTRA_W_REGION!==s.region || typeof castraAmbWalkable!=="function") return null;
  const W = castraWorldCfg(); let h = 2166136261; (q.id+"|"+st.s).split("").forEach(c=>{ h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); });
  const rng = castraRng(h>>>0), start = W.start || { x:Math.floor(W.cols/2), y:Math.floor(W.rows/2) };
  for(let i=0;i<500;i++){
    const x = 3+Math.floor(rng()*(W.cols-6)), y = 3+Math.floor(rng()*(W.rows-6));
    if(!castraAmbWalkable(x,y,W) || Math.abs(x-start.x)+Math.abs(y-start.y) < 10) continue;
    st.fx = x; st.fy = y; castraSave(); return { x, y };
  }
  return null;
}
function castraDqFinds(){
  const out = [];
  castraDqActive().forEach(q=>{ const st = castraDqState(q.id), s = q.steps[st.s]; if(s && s.kind==="find" && s.region===CASTRA_W_REGION){ const p = castraDqFindSpot(q, st, s); if(p) out.push({ q, st, s, x:p.x, y:p.y }); } });
  return out;
}
const _castraWobjDrawDqF0 = castraWobjDraw;
castraWobjDraw = function(){
  _castraWobjDrawDqF0();
  const box = el("cwWobj"); if(!box) return;
  const html = castraDqFinds().map(f=>`<div title="${esc(f.s.nm||"")}" style="position:absolute;left:${f.x*48}px;top:${f.y*48}px;width:48px;height:48px;z-index:3;display:flex;align-items:center;justify-content:center;font-size:30px;pointer-events:none;animation:castraBlink 1.2s infinite;filter:drop-shadow(0 0 6px #f6dd8e)">${f.s.icon||"✨"}</div>`).join("");
  if(html) box.insertAdjacentHTML("beforeend", html);
};
const _castraWPickupCheckDq0 = castraWPickupCheck;
castraWPickupCheck = function(x, y){
  _castraWPickupCheckDq0(x, y);
  try{
    castraDqFinds().forEach(f=>{ if(f.x===x && f.y===y){ f.st.fnd = 1; toast((f.s.icon||"✨")+" "+(f.s.nm||"Gevonden"), "Je hebt het gevonden!"); castraDqSync(true); castraSave(); castraDqRedraw(); } });
  }catch(e){}
};

