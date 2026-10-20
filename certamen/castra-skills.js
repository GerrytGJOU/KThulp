/* ============================================================================
   CASTRA HEROUM — VAARDIGHEDEN (ARTES) PER KLASSE EN LEVEL
   ----------------------------------------------------------------------------
   Net als bij Pokémon leert een soldaat of held nieuwe vaardigheden als hij in
   level stijgt. De vaardigheden hangen aan de Certamen-klasse van zijn huidige
   vorm (zie castraFormClassId in castra-troops.js): evolueer je naar een andere
   klasse, dan horen daar andere vaardigheden bij. Monsters hebben eigen artes;
   rekruten hebben er nog geen.

   Alle vaardigheden werken automatisch in de tower defence (geen keuzemenu) en
   zijn deterministisch (tellers, geen toeval), dus ook veilig in de Legio-lockstep.
   Effecten (fx):
     dmg %        extra schade                  cd %      sneller schieten
     rng %        extra bereik                  pierce %  negeert dit deel van de tutela
     nth {n,mult} elke n-de treffer × mult      charge {hits,mult}  eerste hits van elke golf × mult
     double {every}  elke n-de schot raakt ook een tweede vijand
     splash {pct,radius}  vijanden naast het doelwit krijgen pct % schade
     slow {pct,ticks,every}  elke n-de treffer vertraagt het doelwit
     aura {dmg,radius}  torens in de buurt +dmg %      global %  alle torens +%
     regen n      na elke golf +n leven voor het kamp (tot het maximum)
     reward %     extra beloning na de missie
   Laadt NA castra-troops.js en castra-heroes.js.
   ============================================================================ */

const CASTRA_SKILLS = {
  hopliet:[
    { id:"percussio",   lvl:8,  la:"Percussio",   nl:"Elke 3e treffer vertraagt de vijand 40% (2 s)", fx:{ slow:{ pct:40, ticks:40, every:3 } } },
    { id:"testudo",     lvl:20, la:"Testudo",     nl:"Torens in de buurt +10% schade",                fx:{ aura:{ dmg:10, radius:1500 } } },
    { id:"hasta_longa", lvl:35, la:"Hasta longa", nl:"+20% bereik",                                   fx:{ rng:20 } },
  ],
  spartaan:[
    { id:"ictus_gravis", lvl:8,  la:"Ictus gravis", nl:"Elke 4e treffer doet dubbele schade", fx:{ nth:{ n:4, mult:2 } } },
    { id:"furor",        lvl:22, la:"Furor",        nl:"+15% schade",                         fx:{ dmg:15 } },
    { id:"lacedaemon",   lvl:38, la:"Lacedaemon",   nl:"+25% schade",                         fx:{ dmg:25 } },
  ],
  boogschutter:[
    { id:"sagitta_acuta",  lvl:8,  la:"Sagitta acuta",  nl:"Pijlen negeren de helft van de verdediging", fx:{ pierce:50 } },
    { id:"sagitta_duplex", lvl:20, la:"Sagitta duplex", nl:"Elk 3e schot raakt ook een tweede vijand",   fx:{ double:{ every:3 } } },
    { id:"imber",          lvl:35, la:"Imber sagittarum", nl:"+25% schiettempo",                         fx:{ cd:25 } },
  ],
  cavalerie:[
    { id:"impetus",   lvl:8,  la:"Impetus equitum", nl:"De eerste 3 treffers van elke golf doen dubbele schade", fx:{ charge:{ hits:3, mult:2 } } },
    { id:"velocitas", lvl:22, la:"Velocitas",       nl:"+15% schiettempo",                                        fx:{ cd:15 } },
    { id:"cuneus",    lvl:36, la:"Cuneus",          nl:"+20% schade",                                             fx:{ dmg:20 } },
  ],
  priester:[
    { id:"benedictio", lvl:8,  la:"Benedictio",  nl:"Torens in de buurt +10% schade (naast de gewone steun)", fx:{ aura:{ dmg:10, radius:2000 } } },
    { id:"sanatio",    lvl:20, la:"Sanatio",     nl:"Na elke golf +1 leven voor het kamp",                    fx:{ regen:1 } },
    { id:"ira_deorum", lvl:35, la:"Ira deorum",  nl:"Treffers doen ook 50% schade aan vijanden ernaast",       fx:{ splash:{ pct:50, radius:1200 } } },
  ],
  centurio:[
    { id:"imperium",   lvl:8,  la:"Imperium",   nl:"Torens in de buurt +10% schade",  fx:{ aura:{ dmg:10, radius:1500 } } },
    { id:"signum",     lvl:22, la:"Signum",     nl:"Groter bereik voor je bevel (+10% schade in een grotere kring)", fx:{ aura:{ dmg:10, radius:2500 } } },
    { id:"disciplina", lvl:38, la:"Disciplina", nl:"Alle torens +5% schade",           fx:{ global:5 } },
  ],
  genie:[
    { id:"ballista",  lvl:8,  la:"Ballista",  nl:"+30% bereik",                                        fx:{ rng:30 } },
    { id:"machina",   lvl:22, la:"Machina",   nl:"Schoten negeren de helft van de verdediging",        fx:{ pierce:50 } },
    { id:"tormentum", lvl:36, la:"Tormentum", nl:"Treffers doen ook 50% schade aan vijanden ernaast",  fx:{ splash:{ pct:50, radius:1000 } } },
  ],
  verkenner:[
    { id:"explorare", lvl:8,  la:"Explorare", nl:"+15% bereik",                                   fx:{ rng:15 } },
    { id:"insidiae",  lvl:22, la:"Insidiae",  nl:"Elke 2e treffer vertraagt de vijand 25% (2 s)", fx:{ slow:{ pct:25, ticks:40, every:2 } } },
    { id:"praeda",    lvl:36, la:"Praeda",    nl:"+10% beloning na de missie",                    fx:{ reward:10 } },
  ],
  myth:[
    { id:"terror", lvl:10, la:"Terror", nl:"Elke 3e treffer vertraagt de vijand 30% (1,5 s)", fx:{ slow:{ pct:30, ticks:30, every:3 } } },
    { id:"ignis",  lvl:25, la:"Ignis",  nl:"Treffers doen ook 50% schade aan vijanden ernaast", fx:{ splash:{ pct:50, radius:1000 } } },
    { id:"furia",  lvl:40, la:"Furia",  nl:"+20% schade",                                       fx:{ dmg:20 } },
  ],
};
// Helden volgen de klasse van hun type (inf = hopliet, rng = boogschutter, cav = cavalerie, sup = bevelvoerder).
const CASTRA_HERO_CLASS = { inf:"hopliet", rng:"boogschutter", cav:"cavalerie", sup:"centurio", myth:"myth" };

function castraSkillClassOf(s){
  if(s.hero) return CASTRA_HERO_CLASS[CASTRA_HERO_DATA[s.h.id].type] || null;
  if(s.dux || !s.line) return null;
  const f = castraLine(s.line);
  if(f.type==="myth") return "myth";
  return castraFormClassId(f);
}
function castraSkillList(cls){ return CASTRA_SKILLS[cls] || []; }
// Alle vaardigheden die bij deze klasse horen, met of ze al geleerd zijn.
function castraSkillsOf(s){
  const cls = castraSkillClassOf(s), lvl = s.hero ? s.h.lvl : (s.lvl||1);
  return castraSkillList(cls).map(k=>({ ...k, known: lvl>=k.lvl }));
}
function castraSkillIds(s){ return castraSkillsOf(s).filter(k=>k.known).map(k=>k.id); }
function castraHeroSkillIds(h){ return castraSkillIds({ hero:true, h }); }
function castraSkillById(id){ for(const c in CASTRA_SKILLS){ const k = CASTRA_SKILLS[c].find(x=>x.id===id); if(k) return k; } return null; }

// Combineer de effecten van een lijst vaardigheden tot één record voor de simulatie.
function castraSkillAgg(ids){
  const a = { dmg:0, cd:0, rng:0, pierce:0, nth:null, charge:null, doubleEvery:0, splash:null, slow:null, auraDmg:0, auraRadius:0, global:0, regen:0, reward:0 };
  (ids||[]).forEach(id=>{
    const k = castraSkillById(id); if(!k) return; const f = k.fx;
    a.dmg += f.dmg||0; a.cd += f.cd||0; a.rng += f.rng||0; a.global += f.global||0; a.regen += f.regen||0; a.reward += f.reward||0;
    a.pierce = Math.max(a.pierce, f.pierce||0);
    if(f.nth) a.nth = f.nth; if(f.charge) a.charge = f.charge; if(f.double) a.doubleEvery = f.double.every;
    if(f.splash) a.splash = f.splash; if(f.slow && (!a.slow || f.slow.pct > a.slow.pct)) a.slow = f.slow;
    if(f.aura){ a.auraDmg += f.aura.dmg; a.auraRadius = Math.max(a.auraRadius, f.aura.radius); }
  });
  return a;
}

// Pokémon-stijl melding: "X leert Y!" bij het bereiken van een level met een nieuwe vaardigheid.
function castraSkillLearned(s, oldLvl, newLvl){
  const cls = castraSkillClassOf(s); if(!cls) return [];
  const nm = s.hero ? CASTRA_HERO_DATA[s.h.id].nm : castraSoldierName(s);
  const got = castraSkillList(cls).filter(k=>k.lvl>oldLvl && k.lvl<=newLvl);
  got.forEach((k,i)=>setTimeout(()=>{ if(typeof toast==="function") toast("🎓 "+nm+" leert "+k.la+"!", k.nl); }, 600+i*1800));
  return got;
}
// HTML voor menu/codex: geleerde en nog te leren vaardigheden.
function castraSkillsHTML(s, light){
  const list = castraSkillsOf(s); if(!list.length) return "";
  return `<div style="margin-top:4px;font-size:13px">${list.map(k=>`<div style="${k.known?"":"opacity:.55"}">${k.known?"🎓":"🔒 Lv "+k.lvl} <b>${esc(k.la)}</b> <small>${esc(k.nl)}</small></div>`).join("")}</div>`;
}
