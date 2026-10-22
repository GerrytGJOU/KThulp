/* ============================================================================
   CASTRA HEROUM — EVOLUTIE VAN HELDEN (specialisatie en prestige)
   ----------------------------------------------------------------------------
   Een held is een soort legendarische soldaat: dezelfde stats, artes en moves, maar uniek en met een eigen
   evolutie (zoals promoties in Fire Emblem):
     gradus 25   de held vraagt om een gesprek (menu: Heroes). Dat start zijn persoonlijke quest
                 (3 of 4 stappen: vijanden verslaan, iemand zoeken, een baas verslaan). De beloning is een
                 voorwerp; daarmee kies je een specialisatie (twee mogelijkheden, definitief):
                 nieuwe klasse (artes), andere stat-verdeling, ander uiterlijk.
     gradus 40   een tweede quest, afhankelijk van de gekozen specialisatie, geeft het prestigevoorwerp
                 (Ambrosia). Daarmee wordt de held een prestigevorm: sterkere stats en een unieke
                 legendarische arte.
   Een held moet dus eerst zijn fides ophalen (levelplafond 25 vraagt fides 50, 40 vraagt fides 75).
   Opslag: h.evo (0, 1, 2) en h.spec (id van de specialisatie). Quests: CASTRA_QDEFS (castra-diarium.js, giver
   "hero_<id>"). De evolutie past CASTRA_HERO_DATA[id] aan (type, uiterlijk, stats, klasse) zodat alle bestaande
   code (tower defence, jacht, menu) vanzelf meegaat; het origineel staat in d._b. Pilot: Ulixes.
   Laadt NA castra-diarium.js, castra-skills.js, castra-moves.js en castra-heroes.js.
   ============================================================================ */

const CASTRA_HEVO_LVL = [25, 40];
// Verhaal-arte van elke held (castra-heroevo-all.js): zit vanaf level 1 in de basisklasse en blijft na elke evolutie.
const CASTRA_HERO_SIG = {};
const CASTRA_HERO_EVO = {
  ulixes: {
    items:[ { id:"evo_ulixes_1", icon:"🏹", nm:"Arcus Ulixis", nl:"De boog van Odysseus" }, { id:"evo_ulixes_2", icon:"🍯", nm:"Ambrosia", nl:"Voedsel van de goden" } ],
    q1:{ nm:{ la:"Arcus Ulixis", nl:"De boog van Odysseus" },
      ask:[ { la:"Dux {naam}, tempus advenit. Arcum meum quaero.", nl:"Leider {naam}, de tijd is gekomen. Ik zoek mijn boog." },
            { la:"Vince octo hostes ad litus, quaere Cassandram et vince Cyclopem.", nl:"Versla acht vijanden aan de kust, zoek Cassandra op en versla de Cycloop.", opts:[CASTRA_DQ_YES, CASTRA_DQ_NO] } ],
      steps:[ { kind:"kill", n:8, region:"troia", terrain:"litus", hud:{ la:"Vince hostes ad litus!", nl:"Versla vijanden aan de kust van Troje." } },
              { kind:"talk", npc:"fetch_troia", hud:{ la:"Quaere Cassandram!", nl:"Praat met Cassandra (de grot in Troje)." },
                lines:[ { la:"Ulixes arcum quaerit? Cyclops eum habet!", nl:"Zoekt Odysseus zijn boog? De Cycloop heeft hem!" } ] },
              { kind:"boss", key:"boss_troia", hud:{ la:"Vince Cyclopem!", nl:"Versla de Cycloop (de grot in Troje)." } } ],
      done:[ { la:"Arcus meus! Gratias tibi ago, dux {naam}.", nl:"Mijn boog! Dank je wel, leider {naam}." },
             { la:"Nunc viam eligere possum.", nl:"Nu kan ik mijn weg kiezen (menu: Heroes, Evolueer)." } ],
      reward:{ item:"evo_ulixes_1", pxp:80, gloria:5 } },
    specs:[
      { id:"sag", nm:"Sagittarius", nl:"Boogschutter", desc:"Odysseus wordt een meesterschutter: veel meer bereik en aanvalskracht, iets minder levenspunten.",
        type:"rng", cls:"ulixes_sag", mult:{ vita:0.9, impetus:1.25, tutela:0.9, celeritas:1.1, ambitus:1.6 },
        look:{ armor:"middel", cape:"lang", capekleur:"groen", helm:"open" },
        q2:{ nm:{ la:"Sagitta Apollinis", nl:"De pijl van Apollo" },
          ask:[ { la:"Dux {naam}, sagittarius sum. Sagittam Apollinis quaero.", nl:"Leider {naam}, ik ben een boogschutter. Ik zoek de pijl van Apollo." },
                { la:"Vince duodecim hostes ad Scamandrum, cape tres hostes et vince Dracontem.", nl:"Versla twaalf vijanden bij de Scamander, vang drie vijanden en versla de draak (de grot in Graecia).", opts:[CASTRA_DQ_YES, CASTRA_DQ_NO] } ],
          steps:[ { kind:"kill", n:12, region:"troia", terrain:"scamander", hud:{ la:"Vince hostes ad Scamandrum!", nl:"Versla vijanden bij de Scamander." } },
                  { kind:"catch", n:3, hud:{ la:"Cape tres hostes!", nl:"Vang drie vijanden." } },
                  { kind:"boss", key:"boss_graecia", hud:{ la:"Vince Dracontem!", nl:"Versla de draak (de grot in Graecia)." } } ],
          done:[ { la:"Sagitta Apollinis! Ambrosia mihi datur.", nl:"De pijl van Apollo! Ik krijg ambrosia." } ],
          reward:{ item:"evo_ulixes_2", pxp:150, gloria:10 } },
        prestige:{ nm:"Arcitenens", nl:"Pijlenmeester", mult:{ vita:1.0, impetus:1.55, tutela:1.0, celeritas:1.2, ambitus:2.0 }, look:{ armor:"ceremonieel", capekleur:"goud" },
          legendary:{ id:"sagitta_apollinis", la:"Sagitta Apollinis", nl:"De pijl van Apollo: schiet door pantser en doet 30% extra schade", lvl:40, fx:{ pierce:60, dmg:30 },
                      mv:{ kind:"dmg", power:125, acc:95, pp:3, pierce:50, nl:"Pijl door het pantser (negeert de helft van de verdediging)" } } } },
      { id:"ins", nm:"Insidiator", nl:"Sluipschutter", desc:"Odysseus wordt de sluwe verkenner: veel sneller, vertraagt vijanden en schiet eerst. Blijft een ondersteuner.",
        type:"sup", cls:"ulixes_ins", mult:{ vita:0.95, impetus:1.1, tutela:0.95, celeritas:1.5, ambitus:1.3 },
        look:{ armor:"middel", cape:"lang", capekleur:"paars", helm:"bandana" },
        q2:{ nm:{ la:"Insidiae Ulixis", nl:"De listen van Odysseus" },
          ask:[ { la:"Dux {naam}, insidiator sum. Insidias novas quaero.", nl:"Leider {naam}, ik ben een sluiper. Ik zoek nieuwe listen." },
                { la:"Vince duodecim hostes in cuniculo, cape tres hostes et vince Dracontem.", nl:"Versla twaalf vijanden in de tunnel, vang drie vijanden en versla de draak (de grot in Graecia).", opts:[CASTRA_DQ_YES, CASTRA_DQ_NO] } ],
          steps:[ { kind:"kill", n:12, region:"troia", terrain:"cuniculus", hud:{ la:"Vince hostes in cuniculo!", nl:"Versla vijanden in de tunnel." } },
                  { kind:"catch", n:3, hud:{ la:"Cape tres hostes!", nl:"Vang drie vijanden." } },
                  { kind:"boss", key:"boss_graecia", hud:{ la:"Vince Dracontem!", nl:"Versla de draak (de grot in Graecia)." } } ],
          done:[ { la:"Insidiae meae vicerunt! Ambrosia mihi datur.", nl:"Mijn listen hebben gewonnen! Ik krijg ambrosia." } ],
          reward:{ item:"evo_ulixes_2", pxp:150, gloria:10 } },
        prestige:{ nm:"Callidus", nl:"De sluwe", mult:{ vita:1.1, impetus:1.35, tutela:1.1, celeritas:1.9, ambitus:1.5 }, look:{ armor:"ceremonieel", capekleur:"paars" },
          legendary:{ id:"insidiae_ulixis", la:"Insidiae Ulixis", nl:"De listen van Odysseus: elke tweede treffer vertraagt 40% en doet extra schade", lvl:40, fx:{ slow:{ pct:40, ticks:40, every:2 }, dmg:20 },
                      mv:{ kind:"dmg", power:90, acc:100, pp:5, prio:1, slow:40, nl:"Snelle list die de vijand vertraagt (gaat eerst)" } } } },
    ],
  },
};

/* ---------- toepassen op de heldendata ---------- */
function castraHeroEvoOf(id){ return CASTRA_HERO_EVO[id] || null; }
function castraHeroSpec(h){ const E = castraHeroEvoOf(h.id); return E && h.spec ? E.specs.find(s=>s.id===h.spec) || null : null; }
function castraHeroEvoApply(h){
  const d = CASTRA_HERO_DATA[h.id]; if(!d) return;
  if(!d._b) d._b = { type:d.type, look:{ ...d.look }, base:{ ...d.base }, nm:d.nm };
  let type = d._b.type, look = { ...d._b.look }, mult = null, cls = CASTRA_SKILLS[h.id+"_base"] ? h.id+"_base" : null;
  const sp = (h.evo||0) >= 1 ? castraHeroSpec(h) : null;
  if(sp){
    type = sp.type || type; Object.assign(look, sp.look||{}); mult = sp.mult; cls = sp.cls;
    if(h.evo >= 2){ Object.assign(look, sp.prestige.look||{}); mult = sp.prestige.mult; }
  }
  d.type = type; d.look = look; d.cls = cls; d.base = {};
  Object.keys(d._b.base).forEach(k=>{ d.base[k] = Math.max(1, Math.round(d._b.base[k]*(mult ? (mult[k]||1) : 1))); });
}
function castraHeroEvoApplyAll(){ (CASTRA && CASTRA.heroes || []).forEach(castraHeroEvoApply); }
function castraHeroForm(h){ const sp = castraHeroSpec(h); return !sp ? null : (h.evo>=2 ? sp.prestige.nm : sp.nm); }
// Klassen met een legendarische arte erbij (de zes gewone artes blijven; maximaal vier tegelijk).
function castraHeroEvoRegisterClasses(id){
  const E = CASTRA_HERO_EVO[id]; if(!E) return;
  E.specs.forEach(sp=>{
    const base = sp.skillBase || (sp.cls==="ulixes_sag" ? "boogschutter" : sp.cls==="ulixes_ins" ? "verkenner" : null); if(!base) return;
    const sig = CASTRA_HERO_SIG[id] ? [ { ...CASTRA_HERO_SIG[id], signature:true } ] : [];
    CASTRA_SKILLS[sp.cls] = sig.concat(CASTRA_SKILLS[base], [ { ...sp.prestige.legendary, legendary:true, prestige:true } ]);
  });
  E.items.forEach(it=>{ CASTRA_ITEMS[it.id] = { nm:it.nm, icon:it.icon, nl:it.nl }; });
}
Object.keys(CASTRA_HERO_EVO).forEach(castraHeroEvoRegisterClasses);
const _castraLoadHevo0 = castraLoad;
castraLoad = function(){ const r = _castraLoadHevo0.apply(this, arguments); try{ castraHeroEvoApplyAll(); }catch(e){} return r; };

/* ---------- persoonlijke quests in de questmotor ---------- */
function castraHeroEvoRegisterQuests(id){
  const E = CASTRA_HERO_EVO[id], hh = ()=>castraHero(id); if(!E) return;
  CASTRA_QDEFS.push({ id:"evo_"+id+"_1", giver:"hero_"+id, region:null, hero:id, ...E.q1,
    can:()=>{ const h = hh(); return !!h && (h.evo||0)===0 && (h.lvl||1) >= CASTRA_HEVO_LVL[0]; } });
  E.specs.forEach(sp=>CASTRA_QDEFS.push({ id:"evo_"+id+"_2_"+sp.id, giver:"hero_"+id, region:null, hero:id, ...sp.q2,
    can:()=>{ const h = hh(); return !!h && h.evo===1 && h.spec===sp.id && (h.lvl||1) >= CASTRA_HEVO_LVL[1]; } }));
}
Object.keys(CASTRA_HERO_EVO).forEach(castraHeroEvoRegisterQuests);

/* ---------- evolueren (menu) ---------- */
function castraHeroEvoState(h){
  const E = castraHeroEvoOf(h.id); if(!E) return { kind:"none" };
  const evo = h.evo||0, lv = h.lvl||1;
  if(evo>=2) return { kind:"max" };
  const need = CASTRA_HEVO_LVL[evo], item = E.items[evo].id, have = !!(castraWItems()[item]);
  const qid = evo===0 ? "evo_"+h.id+"_1" : "evo_"+h.id+"_2_"+h.spec, qs = (CASTRA.dq||{})[qid] || {};
  if(lv < need) return { kind:"low", need };
  if(have) return { kind:"ready", item };
  if(qs.a && !qs.d) return { kind:"quest", qid };
  return { kind:"talk", qid };
}
function castraHeroEvoMenuHTML(h){
  const E = castraHeroEvoOf(h.id), form = castraHeroForm(h);
  const hd = `<div style="font-weight:bold;margin-top:8px">🌟 Evolutie${form?` <span style="font-weight:normal">· nu: <b>${esc(form)}</b> (${esc(castraHeroSpec(h).nl)})</span>`:""}</div>`;
  if(!E) return hd+`<div style="font-size:13px;opacity:.7">Deze held evolueert (nog) niet.</div>`;
  const S = castraHeroEvoState(h), btn = "margin-top:4px;min-height:40px;padding:4px 12px;font-size:14px;font-family:inherit;cursor:pointer;background:#e8c96a;color:var(--parch-ink,#2b1d0e);border:2px solid var(--parch-edge,#4a3416);border-radius:8px";
  let body = "";
  if(S.kind==="max") body = "Hoogste vorm bereikt.";
  else if(S.kind==="low") body = `Op gradus ${S.need} vraagt ${esc(CASTRA_HERO_DATA[h.id].nm)} om een gesprek (persoonlijke quest). ${(h.fides||0) < (S.need===25?50:75) ? "Het levelplafond groeit met zijn fides." : ""}`;
  else if(S.kind==="talk") body = `${esc(CASTRA_HERO_DATA[h.id].nm)} wil je spreken.<br><button style="${btn}" onclick="event.stopPropagation();castraDqTalk('hero_${h.id}')">💬 Praat met ${esc(CASTRA_HERO_DATA[h.id].nm)}</button>`;
  else if(S.kind==="quest") body = `📜 Persoonlijke quest bezig, zie het Diarium.<br><button style="${btn}" onclick="event.stopPropagation();castraDqTalk('hero_${h.id}')">💬 Praat met ${esc(CASTRA_HERO_DATA[h.id].nm)}</button>`;
  else if(S.kind==="ready"){ const it = castraWItems()[S.item] ? CASTRA_ITEMS[S.item] : null;
    body = `${it?it.icon+" <b>"+esc(it.nm)+"</b> ":""}is gevonden!<br><button style="${btn}" onclick="event.stopPropagation();castraHeroEvolve('${h.id}')">✨ Evolueer</button>`; }
  let specs = "";
  if((h.evo||0)===0) specs = E.specs.map(sp=>`<div style="font-size:12px;opacity:.85;margin-top:3px"><b>${esc(sp.nm)}</b> (${esc(sp.nl)}): ${esc(sp.desc)} <i>Prestige: ${esc(sp.prestige.nm)}, met de legendarische arte ${esc(sp.prestige.legendary.la)}.</i></div>`).join("");
  return `${hd}<div style="font-size:13px">${body}</div>${specs}`;
}
function castraHeroEvolve(id){
  const h = castraHero(id), E = castraHeroEvoOf(id); if(!h || !E || CASTRA_DLG) return;
  const S = castraHeroEvoState(h); if(S.kind!=="ready") return;
  const d = CASTRA_HERO_DATA[id], look = d.look;
  const finish = sp=>{
    if(sp){ h.spec = sp.id; h.evo = 1; } else h.evo = 2;
    const items = castraWItems(); items[S.item] = Math.max(0, (items[S.item]||0)-1);
    h.skManual = false; h.skills = (h.evo===2 ? [castraHeroSpec(h).prestige.legendary.id] : []); castraHeroEvoApply(h); castraSkillIds({ hero:true, h });
    castraSave(); if(typeof castraPxpAdd==="function") castraPxpAdd(h.evo===1 ? 60 : 120, d.nm+" evolueert");
    toast("🌟 "+castraLaText("recte"), d.nm+" is nu "+castraHeroForm(h));
    if(typeof castraMenuRender==="function" && CASTRA_MENU.open) castraMenuRender();
  };
  if((h.evo||0)===0){
    castraLatSay(d.nm, look, [ { la:"Duas vias video. Quam viam eligis?", nl:"Ik zie twee wegen. Welke weg kies je? (Definitief!)" },
      { la:E.specs[0].nm+" an "+E.specs[1].nm+"?", nl:E.specs[0].nm+" ("+E.specs[0].nl+") of "+E.specs[1].nm+" ("+E.specs[1].nl+")?", opts:[ { la:E.specs[0].nm, nl:E.specs[0].nl }, { la:E.specs[1].nm, nl:E.specs[1].nl }, CASTRA_DQ_NO ] } ],
      k=>{ if(k===0||k===1) finish(E.specs[k]); });
  } else {
    const sp = castraHeroSpec(h);
    castraLatSay(d.nm, look, [ { la:"Ambrosia! Nunc "+sp.prestige.nm+" fio.", nl:"Ambrosia! Nu word ik "+sp.prestige.nm+" ("+sp.prestige.nl+")." }, { la:"Paratus es?", nl:"Ben je er klaar voor?", opts:[ CASTRA_DQ_YES, CASTRA_DQ_NO ] } ], k=>{ if(k===0) finish(null); });
  }
}
(function(add){ Object.keys(add).forEach(k=>{ if(!CASTRA_GLOSS[k]) CASTRA_GLOSS[k] = add[k]; }); })({ "tempus":"tijd", "advenit":"komt eraan", "arcum":"boog (4e naamval)", "arcus":"boog", "octo":"acht", "cassandram":"Cassandra (4e naamval)", "cyclopem":"de Cycloop (4e naamval)",
  "cyclops":"de Cycloop", "ulixes":"Odysseus", "quaerit":"zoekt", "habet":"heeft", "viam":"weg (4e naamval)", "eligere":"kiezen", "possum":"ik kan", "duas":"twee", "vias":"wegen", "quam":"welke", "eligis":"kies je",
  "an":"of", "paratus":"klaar", "fio":"ik word", "ambrosia":"ambrosia (voedsel van de goden)", "sagitta":"pijl", "sagittam":"pijl (4e naamval)", "apollinis":"van Apollo", "sagittarius":"boogschutter",
  "sagittarii":"boogschutters", "duodecim":"twaalf", "scamandrum":"de Scamander (4e naamval)", "tres":"drie", "dracontem":"draak (4e naamval)", "mihi":"aan mij", "insidiator":"sluiper",
  "insidias":"listen (4e naamval)", "insidiae":"listen", "novas":"nieuwe", "cuniculo":"in de tunnel", "vicerunt":"hebben gewonnen", "meae":"mijn", "meus":"mijn", "meum":"mijn", "ulixis":"van Odysseus",
  "datur":"wordt gegeven", "sum":"ik ben", "nunc":"nu", "video":"ik zie", "arcitenens":"pijlenmeester", "callidus":"de sluwe", "dux":"leider", "et":"en", "quaere":"zoek", "vince":"versla", "cape":"vang",
  "hostes":"vijanden", "ad":"naar, bij", "litus":"kust", "gratias":"dank", "tibi":"aan jou", "ago":"ik doe", "vinci":"overwint" });
