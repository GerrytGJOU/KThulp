/* ============================================================================
   CASTRA HEROUM — HELDEN (data, loyaliteit, toewijzing, gesprekken)
   ----------------------------------------------------------------------------
   Een held is uniek en evolueert niet: vaste basiswaarden die per level groeien.
   Je vindt hem via een spoor (venatio) of in de wereld, doorloopt zijn
   missieketen (jagen -> proelium winnen -> overtuigen in het Latijn) en hij
   komt in je heroum. Daar:
   - Colloquium: een kort Latijns gesprek + vraag; juist = meer fides (vertrouwen);
     fides verhoogt het maximale level van de held en zijn gebouwbonus.
   - Assigna: een held leidt één gebouw en geeft dat gebouw een bonus (×1,5 op
     zijn lievelingsgebouw).
   - In het proelium vecht hij mee als toren.
   Opslag: CASTRA.heroes = [{ id, lvl, xp, fides, assigned }], CASTRA.talk = { day, n }.
   Ketenvoortgang: CASTRA.quests[heroId] = { step, acc, n } (zie castra-quests.js).
   Teksten: Latijn is voorlopig, ter controle door Gerben. Laadt NA castra-data.js
   en castra-latin.js, VÓÓR castra-quests.js.
   ============================================================================ */

const CASTRA_H = {
  capBase:5, capPerStep:3, fidesStep:25, maxLvl:20, xpPerLvl:30,
  fidesPerTalk:10, talkBase:2,            // gesprekken per dag = talkBase + heroum-level
  bonusBase:20, bonusPerFides:0.2, affinityMult:1.5,
  statGrowthPct:10,                        // +10% per level boven 1
  assignable:["praetorium","lignatio","metallum","campus"],
};

/* ketenstappen: kill (n vijanden in terrein), win (proelium-missie), persuade (keuzevraag) */
const CASTRA_HERO_DATA = {
  aeneas: {
    nm:"Aeneas", type:"inf", affinity:"praetorium", always:true, world:{ x:13, y:11, dir:"right" },
    base:{ vita:64, impetus:13, tutela:12, celeritas:6, ambitus:3 },
    look:{ huid:"getint", haar:"kort", haarkleur:"bruin", baard:"baard", armor:"ceremonieel", cape:"lang", capekleur:"rood", helm:"geen", schild:"geen", wapen:"zwaard" },
    chain:[
      { kind:"kill", terrain:"silva", need:3,
        ask:{ la:"Salve, hospes! Aeneas sum. Hostes in silva vexant. Tres hostes in silva vince, et auxilium meum habebis.", nl:"Gegroet, gast! Ik ben Aeneas. Vijanden in het bos zijn lastig. Versla drie vijanden in het bos, en je krijgt mijn hulp." },
        hud:{ la:"Hostes in silva vince!", nl:"Versla vijanden in het bos!" },
        done:{ la:"Optime! Tres hostes vicisti.", nl:"Uitstekend! Je hebt drie vijanden verslagen." } },
      { kind:"win", mission:"m1",
        ask:{ la:"Bene! Nunc castra defende. Proelium primum vince.", nl:"Goed! Verdedig nu het kamp. Win het eerste gevecht." },
        hud:{ la:"Proelium primum vince!", nl:"Win het eerste gevecht!" },
        done:{ la:"Castra defendisti! Gratias tibi ago.", nl:"Je hebt het kamp verdedigd! Ik dank je." } },
      { kind:"persuade",
        ask:{ la:"Cur tecum veniam, dux?", nl:"Waarom zou ik met je meegaan, leider?" },
        opts:[ { la:"Quia amicos servo et castra defendo.", nl:"Omdat ik vrienden bescherm en het kamp verdedig.", ok:true },
               { la:"Quia pecuniam amo.", nl:"Omdat ik van geld houd." },
               { la:"Quia pugnare nolo.", nl:"Omdat ik niet wil vechten." } ],
        join:{ la:"Tecum venio, dux!", nl:"Ik ga met je mee, leider!" } },
    ],
    talks:[
      { la:"Troia cecidit. Novam patriam quaero.", nl:"Troje is gevallen. Ik zoek een nieuw vaderland.",
        q:{ la:"Quid Aeneas quaerit?", nl:"Wat zoekt Aeneas?", opts:[ {la:"Novam patriam.",nl:"Een nieuw vaderland.",ok:true}, {la:"Aurum.",nl:"Goud."}, {la:"Cibum.",nl:"Eten."} ] } },
      { la:"Pater meus senex est. Eum in umeris porto.", nl:"Mijn vader is oud. Ik draag hem op mijn schouders.",
        q:{ la:"Quem Aeneas portat?", nl:"Wie draagt Aeneas?", opts:[ {la:"Patrem.",nl:"Zijn vader.",ok:true}, {la:"Filium.",nl:"Zijn zoon."}, {la:"Equum.",nl:"Een paard."} ] } },
      { la:"Dei me iuvant. Ad Italiam navigo.", nl:"De goden helpen mij. Ik zeil naar Italië.",
        q:{ la:"Quo Aeneas navigat?", nl:"Waarheen zeilt Aeneas?", opts:[ {la:"Ad Italiam.",nl:"Naar Italië.",ok:true}, {la:"Ad Graeciam.",nl:"Naar Griekenland."}, {la:"Ad Aegyptum.",nl:"Naar Egypte."} ] } },
    ],
  },
  romulus: {
    nm:"Romulus", type:"inf", affinity:"contubernia", world:{ x:14, y:5, dir:"right" },
    base:{ vita:58, impetus:15, tutela:10, celeritas:7, ambitus:3 },
    look:{ huid:"licht", haar:"wild", haarkleur:"zwart", baard:"geen", armor:"ceremonieel", cape:"kort", capekleur:"rood", helm:"geen", schild:"geen", wapen:"zwaard" },
    chain:[
      { kind:"kill", terrain:"campus", need:4,
        ask:{ la:"Salve! Romulus sum. Urbem novam condo. Quattuor hostes in campo vince, et mihi auxilio eris.", nl:"Gegroet! Ik ben Romulus. Ik sticht een nieuwe stad. Versla vier vijanden op het veld en je zult mij helpen." },
        hud:{ la:"Hostes in campo vince!", nl:"Versla vijanden op het veld!" },
        done:{ la:"Optime! Quattuor hostes vicisti.", nl:"Uitstekend! Je hebt vier vijanden verslagen." } },
      { kind:"win", mission:"m2",
        ask:{ la:"Bene! Nunc viam Latinam defende. Proelium secundum vince.", nl:"Goed! Verdedig nu de Latijnse weg. Win het tweede gevecht." },
        hud:{ la:"Proelium secundum vince!", nl:"Win het tweede gevecht!" },
        done:{ la:"Viam defendisti! Gratias tibi ago.", nl:"Je hebt de weg verdedigd! Ik dank je." } },
      { kind:"persuade",
        ask:{ la:"Roma urbs magna erit. Quid pro urbe facis?", nl:"Rome zal een grote stad worden. Wat doe jij voor de stad?" },
        opts:[ { la:"Muros aedifico et milites duco.", nl:"Ik bouw muren en leid soldaten.", ok:true },
               { la:"Domum meam relinquo.", nl:"Ik verlaat mijn huis." },
               { la:"Nihil facio.", nl:"Ik doe niets." } ],
        join:{ la:"Tecum venio, dux!", nl:"Ik ga met je mee, leider!" } },
    ],
    talks:[
      { la:"Lupa me nutrivit. Fratrem Remum habeo.", nl:"Een wolvin heeft mij gevoed. Ik heb een broer, Remus.",
        q:{ la:"Quis Romulum nutrivit?", nl:"Wie voedde Romulus?", opts:[ {la:"Lupa.",nl:"Een wolvin.",ok:true}, {la:"Regina.",nl:"Een koningin."}, {la:"Dea.",nl:"Een godin."} ] } },
      { la:"Urbem in colle Palatino condo.", nl:"Ik sticht de stad op de Palatijn.",
        q:{ la:"Ubi Romulus urbem condit?", nl:"Waar sticht Romulus de stad?", opts:[ {la:"In colle.",nl:"Op een heuvel.",ok:true}, {la:"In mari.",nl:"In de zee."}, {la:"In silva.",nl:"In het bos."} ] } },
      { la:"Urbs mea Roma vocatur.", nl:"Mijn stad heet Rome.",
        q:{ la:"Quomodo urbs vocatur?", nl:"Hoe heet de stad?", opts:[ {la:"Roma.",nl:"Rome.",ok:true}, {la:"Troia.",nl:"Troje."}, {la:"Athenae.",nl:"Athene."} ] } },
    ],
  },
  horatius: {
    nm:"Horatius Cocles", type:"inf", affinity:"campus", world:{ x:26, y:11, dir:"down" },
    base:{ vita:70, impetus:12, tutela:15, celeritas:5, ambitus:2 },
    look:{ huid:"olijf", haar:"kort", haarkleur:"zwart", baard:"snor", armor:"middel", cape:"kort", capekleur:"rood", helm:"open", schild:"geen", wapen:"zwaard" },
    chain:[
      { kind:"kill", terrain:"tiberis", need:3,
        ask:{ la:"Salve! Horatius sum. Hostes ad Tiberim veniunt. Tres hostes ad Tiberim vince.", nl:"Gegroet! Ik ben Horatius. Vijanden komen naar de Tiber. Versla drie vijanden bij de Tiber." },
        hud:{ la:"Hostes ad Tiberim vince!", nl:"Versla vijanden bij de Tiber!" },
        done:{ la:"Optime! Pontem servavisti.", nl:"Uitstekend! Je hebt de brug gered." } },
      { kind:"win", mission:"m2",
        ask:{ la:"Bene! Nunc viam defende. Proelium secundum vince.", nl:"Goed! Verdedig nu de weg. Win het tweede gevecht." },
        hud:{ la:"Proelium secundum vince!", nl:"Win het tweede gevecht!" },
        done:{ la:"Viam defendisti! Gratias tibi ago.", nl:"Je hebt de weg verdedigd! Ik dank je." } },
      { kind:"persuade",
        ask:{ la:"Pontem defendo. Tu quoque pontem defendis?", nl:"Ik verdedig de brug. Verdedig jij de brug ook?" },
        opts:[ { la:"Etiam amicos nostros defendo.", nl:"Ik verdedig ook onze vrienden.", ok:true },
               { la:"Fugio.", nl:"Ik vlucht." },
               { la:"Pontem relinquo.", nl:"Ik verlaat de brug." } ],
        join:{ la:"Tecum venio, dux!", nl:"Ik ga met je mee, leider!" } },
    ],
    talks:[
      { la:"Pons Sublicius in Tiberi est. Hostes veniunt.", nl:"De Sublicische brug ligt over de Tiber. Vijanden komen.",
        q:{ la:"Quid in Tiberi est?", nl:"Wat ligt over de Tiber?", opts:[ {la:"Pons.",nl:"Een brug.",ok:true}, {la:"Navis.",nl:"Een schip."}, {la:"Murus.",nl:"Een muur."} ] } },
      { la:"Solus pontem defendo. Amici pontem delent.", nl:"Alleen verdedig ik de brug. Mijn vrienden slopen de brug.",
        q:{ la:"Quis pontem defendit?", nl:"Wie verdedigt de brug?", opts:[ {la:"Horatius solus.",nl:"Horatius alleen.",ok:true}, {la:"Omnes milites.",nl:"Alle soldaten."}, {la:"Nemo.",nl:"Niemand."} ] } },
      { la:"In Tiberim salio. Ad ripam nato.", nl:"Ik spring in de Tiber. Ik zwem naar de oever.",
        q:{ la:"Quo Horatius salit?", nl:"Waarin springt Horatius?", opts:[ {la:"In Tiberim.",nl:"In de Tiber.",ok:true}, {la:"In silvam.",nl:"In het bos."}, {la:"In montem.",nl:"Op de berg."} ] } },
    ],
  },
};

/* ---------- helden in het spel ---------- */
function castraHero(id){ return (CASTRA.heroes||[]).find(h=>h.id===id) || null; }
function castraHeroCap(h){ return Math.min(CASTRA_H.maxLvl, CASTRA_H.capBase + CASTRA_H.capPerStep*Math.floor((h.fides||0)/CASTRA_H.fidesStep)); }
function castraHeroStats(h){
  const b = CASTRA_HERO_DATA[h.id].base, m = 100 + CASTRA_H.statGrowthPct*((h.lvl||1)-1), o = {};
  Object.keys(b).forEach(k=>{ o[k] = Math.round(b[k]*m/100); }); return o;
}
function castraHeroLevelUp(h){
  let up = false;
  while(h.lvl < castraHeroCap(h) && h.xp >= CASTRA_H.xpPerLvl*h.lvl){ h.xp -= CASTRA_H.xpPerLvl*h.lvl; h.lvl++; up = true; }
  return up;
}
function castraHeroRecruit(id){
  const list = CASTRA.heroes || (CASTRA.heroes = []);
  if(!list.some(h=>h.id===id)) list.push({ id, lvl:1, xp:0, fides:10, assigned:null });
  castraSave();
}
// Bonus (in procenten) die een gebouw krijgt van de held die het leidt.
function castraHeroBonus(buildingId){
  const h = (CASTRA.heroes||[]).find(x=>x.assigned===buildingId); if(!h) return 0;
  const d = CASTRA_HERO_DATA[h.id];
  let pct = CASTRA_H.bonusBase + Math.floor((h.fides||0)*CASTRA_H.bonusPerFides);
  if(d.affinity===buildingId) pct = Math.floor(pct*CASTRA_H.affinityMult);
  return pct;
}
function castraHeroAssign(id, buildingId){
  const heroes = CASTRA.heroes||[];
  heroes.forEach(x=>{ if(x.assigned===buildingId) x.assigned = null; });   // één held per gebouw
  const h = heroes.find(x=>x.id===id); if(h) h.assigned = buildingId || null;
  castraSave();
}
// Held als "soldaat" voor het proelium
function castraHeroAsUnit(h){ return { id:"hero_"+h.id, hero:true, h, lvl:h.lvl, line:null, stage:0 }; }

/* ---------- gesprekken (loyaliteit) ---------- */
function castraTalkQuota(){
  const t = CASTRA.talk || (CASTRA.talk = { day:castraDay(), n:0 });
  if(t.day!==castraDay()){ t.day = castraDay(); t.n = 0; }
  return { used:t.n, max: CASTRA_H.talkBase + castraLvl("heroum") };
}
let CASTRA_HT = null;   // lopend gesprek: { hid, i, answered }
function castraHeroumTalk(hid){
  const q = castraTalkQuota(); if(q.used >= q.max){ castraToastLa("satis_colloquia"); return; }
  const h = castraHero(hid), d = CASTRA_HERO_DATA[hid];
  h.talkIdx = ((h.talkIdx||0)) % d.talks.length;
  CASTRA_HT = { hid, i:h.talkIdx, answered:null };
  castraHeroumOpen();
}
function castraHeroumAnswer(k){
  const T = CASTRA_HT; if(!T || T.answered!==null) return;
  const h = castraHero(T.hid), d = CASTRA_HERO_DATA[T.hid], opt = d.talks[T.i].q.opts[k];
  T.answered = k;
  const t = CASTRA.talk; t.n++; h.talkIdx = (h.talkIdx||0)+1;
  if(opt.ok){
    h.fides = Math.min(100, (h.fides||0)+CASTRA_H.fidesPerTalk); h.xp += 6; castraHeroLevelUp(h);
    castraToastLa("recte", d.nm+" · "+CASTRA_LA.fides.la+" +"+CASTRA_H.fidesPerTalk);
  } else castraToastLa("non_recte");
  castraSave(); castraHeroumOpen();
}
function castraHeroumEndTalk(){ CASTRA_HT = null; castraHeroumOpen(); }

/* ---------- heroum-paneel ---------- */
function castraHeroumOpen(){
  CASTRA_UI.panel = "heroum";
  const b = castraBuilding("heroum"), lvl = castraLvl("heroum"), maxL = castraMaxLvl("heroum"), cost = castraUpgradeCost("heroum");
  const costTxt = Object.keys(cost).map(r=>`${castraRes(r).icon} ${cost[r]}`).join("  ");
  const q = castraTalkQuota(), heroes = CASTRA.heroes||[];
  const T = CASTRA_HT;
  const cards = heroes.map(h=>{
    const d = CASTRA_HERO_DATA[h.id], st = castraHeroStats(h), cap = castraHeroCap(h);
    const portrait = castraAvatarHTML(d.look, "down", 1, 64);
    const bar = `<div style="height:8px;background:#1b150e;border:1px solid #4a3d2c;border-radius:4px;overflow:hidden;width:120px"><div style="width:${h.fides||0}%;height:100%;background:#d4af37"></div></div>`;
    const assign = CASTRA_H.assignable.map(bid=>{
      const on = h.assigned===bid, aff = d.affinity===bid;
      return `<button class="btn ${on?"btn-gold":""}" style="padding:2px 8px;font-size:12px" onclick="castraDoAssign('${h.id}','${on?"":bid}')">${esc(castraBuilding(bid).nm)}${aff?" ★":""}</button>`;
    }).join(" ");
    let talk = "";
    if(T && T.hid===h.id){
      const tk = d.talks[T.i];
      talk = `<div style="margin-top:8px;padding:8px;border:1px solid #8a6d2f;border-radius:8px;background:rgba(0,0,0,.2)">
        <div style="font-size:16px">${castraLaHTML(tk.la, tk.nl, "talk_"+h.id+T.i)}</div>
        <div style="margin:8px 0 4px;font-size:16px">${castraLaHTML(tk.q.la, tk.q.nl, "tq_"+h.id+T.i)}</div>
        ${tk.q.opts.map((o,k)=>`<button class="btn ${T.answered===k?(o.ok?"btn-gold":""):""}" ${T.answered!==null?"disabled":""} style="margin:2px 4px 2px 0" onclick="castraHeroumAnswer(${k})">${esc(o.la)}</button>`).join("")}
        ${T.answered!==null?`<div style="margin-top:6px"><button class="btn" onclick="castraHeroumEndTalk()">${castraLaText("claude")}</button></div>`:""}</div>`;
    }
    return `<div style="padding:8px 0;border-top:1px solid #4a3d2c"><div style="display:flex;gap:10px">
      <div style="flex-shrink:0;text-align:center">${portrait}</div>
      <div style="flex:1"><b>${esc(d.nm)}</b> · ${castraLaText("gradus")} ${h.lvl} / ${cap} <small>(XP ${h.xp}/${CASTRA_H.xpPerLvl*h.lvl})</small>
        <div style="margin:4px 0">${castraLaText("fides")}: ${bar}</div>
        <small>${CASTRA_STATS.map(x=>x.nm.slice(0,3)+" "+st[x.id]).join(" · ")}</small>
        <div style="margin-top:6px"><small>${castraLaText("assigna")}:</small> ${assign} ${h.assigned?`<small>+${castraHeroBonus(h.assigned)}%</small>`:""}</div>
        <div style="margin-top:6px"><button class="btn btn-gold" ${q.used>=q.max||(T&&T.hid===h.id)?"disabled":""} onclick="castraHeroumTalk('${h.id}')">${castraLaText("colloquium")}</button></div>
      </div></div>${talk}</div>`;
  }).join("") || `<div class="note">${castraLa("heroes_nulli")}</div>`;
  const hints = Object.keys(CASTRA.traces||{}).filter(id=>CASTRA_HERO_DATA[id] && !castraHero(id)).map(id=>`<div class="note">👣 ${castraLa("vestigia")} <b>${esc(CASTRA_HERO_DATA[id].nm)}</b>. ${castraLa("vestigia_quaere")}</div>`).join("");
  const up = lvl>=maxL ? `<div class="note">${castraLa(lvl>=b.maxLvl?"gradus_max":"praetorium_prius")}</div>`
    : `<button class="btn" ${castraCanPay(cost)?"":"disabled"} onclick="castraDoUpgrade('heroum')">${castraLaText("meliora")} → ${castraLaText("gradus")} ${lvl+1} — ${costTxt}</button>`;
  castraOpenPanel(`<div class="panel"><h3>${b.icon} ${esc(b.nm)} <small>${castraLaText("gradus")} ${lvl}</small></h3>
    <div style="font-style:italic;margin-bottom:6px">${castraLaHTML(b.lat||"", b.desc||"", "bld_heroum")}</div>
    <div class="note">${castraLaText("colloquia_hodie")}: ${q.used} / ${q.max}</div>${cards}${hints}
    <div style="margin-top:8px">${up}</div>
    <div style="margin-top:8px"><button class="btn" onclick="CASTRA_HT=null;castraClosePanel()">${castraLaText("claude")}</button></div></div>`);
}
function castraDoAssign(hid, bid){ castraHeroAssign(hid, bid); castraRenderMap(); castraHeroumOpen(); }
