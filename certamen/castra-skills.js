/* ============================================================================
   CASTRA HEROUM — VAARDIGHEDEN (ARTES) PER KLASSE EN LEVEL, MET KEUZE (MAX 4)
   ----------------------------------------------------------------------------
   Net als bij Pokémon leert een soldaat of held nieuwe vaardigheden als hij in
   level stijgt, maar hij kan er maar 4 tegelijk gebruiken. Elke klasse heeft er
   6 (leerlevels 8 t/m ±44), dus je moet kiezen en kunt specialiseren: twee
   soldaten van dezelfde vorm kunnen een andere set dragen. Omzetten kan altijd
   (menu → Milites/Heroes → tik op de soldaat), behalve tijdens een gevecht.

   De vaardigheden hangen aan de Certamen-klasse van de huidige vorm (castraFormClassId
   in castra-troops.js): evolueer je naar een andere klasse, dan vervallen de gekozen
   artes van de oude klasse en worden vrije plaatsen weer gevuld.
   Monsters hebben eigen artes; rekruten hebben er nog geen.

   Keuze: s.skills = [ids] (soldaat) of h.skills (held); s.skManual = true zodra de speler
   zelf gekozen heeft. Zolang niemand gekozen heeft vult het spel de vrije plaatsen
   automatisch met de eerst geleerde artes (zoals Pokémon). Gekozen artes werken in de
   tower defence, deterministisch (tellers, geen toeval), dus ook in de Legio-lockstep.

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

const CASTRA_SKILL_MAX = 4;
const CASTRA_SKILLS = {
  hopliet:[
    { id:"percussio",      lvl:8,  la:"Percussio",      nl:"Elke 3e treffer vertraagt de vijand 40% (2 s)", fx:{ slow:{ pct:40, ticks:40, every:3 } } },
    { id:"phalanx",        lvl:14, la:"Phalanx",        nl:"Torens in een grote kring +5% schade",           fx:{ aura:{ dmg:5, radius:2500 } } },
    { id:"testudo",        lvl:20, la:"Testudo",        nl:"Torens dichtbij +10% schade",                    fx:{ aura:{ dmg:10, radius:1500 } } },
    { id:"hastae_densae",  lvl:28, la:"Hastae densae",  nl:"+12% schade",                                    fx:{ dmg:12 } },
    { id:"hasta_longa",    lvl:35, la:"Hasta longa",    nl:"+20% bereik",                                    fx:{ rng:20 } },
    { id:"invictus",       lvl:42, la:"Invictus",       nl:"Na elke golf +1 leven voor het kamp",            fx:{ regen:1 } },
  ],
  spartaan:[
    { id:"ictus_gravis",   lvl:8,  la:"Ictus gravis",   nl:"Elke 4e treffer doet dubbele schade",            fx:{ nth:{ n:4, mult:2 } } },
    { id:"caedes",         lvl:14, la:"Caedes",         nl:"+8% schade",                                     fx:{ dmg:8 } },
    { id:"furor",          lvl:22, la:"Furor",          nl:"+15% schade",                                    fx:{ dmg:15 } },
    { id:"sanguis",        lvl:30, la:"Sanguis",        nl:"Slagen negeren 30% van de verdediging",          fx:{ pierce:30 } },
    { id:"lacedaemon",     lvl:38, la:"Lacedaemon",     nl:"+25% schade",                                    fx:{ dmg:25 } },
    { id:"thermopylae",    lvl:44, la:"Thermopylae",    nl:"De eerste 2 treffers van elke golf doen driedubbele schade", fx:{ charge:{ hits:2, mult:3 } } },
  ],
  boogschutter:[
    { id:"sagitta_acuta",  lvl:8,  la:"Sagitta acuta",  nl:"Pijlen negeren de helft van de verdediging",     fx:{ pierce:50 } },
    { id:"celeres",        lvl:14, la:"Celeres",        nl:"+10% schiettempo",                               fx:{ cd:10 } },
    { id:"sagitta_duplex", lvl:20, la:"Sagitta duplex", nl:"Elk 3e schot raakt ook een tweede vijand",       fx:{ double:{ every:3 } } },
    { id:"scythica",       lvl:28, la:"Scythica",       nl:"+15% bereik",                                    fx:{ rng:15 } },
    { id:"imber",          lvl:35, la:"Imber sagittarum", nl:"+25% schiettempo",                             fx:{ cd:25 } },
    { id:"sagitta_ignea",  lvl:42, la:"Sagitta ignea",  nl:"Treffers doen ook 40% schade aan vijanden ernaast", fx:{ splash:{ pct:40, radius:800 } } },
  ],
  cavalerie:[
    { id:"impetus",        lvl:8,  la:"Impetus equitum", nl:"De eerste 3 treffers van elke golf doen dubbele schade", fx:{ charge:{ hits:3, mult:2 } } },
    { id:"cursus",         lvl:14, la:"Cursus",         nl:"+8% schiettempo",                                fx:{ cd:8 } },
    { id:"velocitas",      lvl:22, la:"Velocitas",      nl:"+15% schiettempo",                               fx:{ cd:15 } },
    { id:"hasta_equitum",  lvl:29, la:"Hasta equitum",  nl:"Slagen negeren 40% van de verdediging",          fx:{ pierce:40 } },
    { id:"cuneus",         lvl:36, la:"Cuneus",         nl:"+20% schade",                                    fx:{ dmg:20 } },
    { id:"triumphus",      lvl:44, la:"Triumphus",      nl:"Elke 5e treffer doet driedubbele schade",        fx:{ nth:{ n:5, mult:3 } } },
  ],
  priester:[
    { id:"benedictio",     lvl:8,  la:"Benedictio",     nl:"Torens dichtbij +10% schade (naast de gewone steun)", fx:{ aura:{ dmg:10, radius:2000 } } },
    { id:"preces",         lvl:14, la:"Preces",         nl:"Alle torens +2% schade",                         fx:{ global:2 } },
    { id:"sanatio",        lvl:20, la:"Sanatio",        nl:"Na elke golf +1 leven voor het kamp",            fx:{ regen:1 } },
    { id:"pietas",         lvl:28, la:"Pietas",         nl:"+8% beloning na de missie",                      fx:{ reward:8 } },
    { id:"ira_deorum",     lvl:35, la:"Ira deorum",     nl:"Treffers doen ook 50% schade aan vijanden ernaast", fx:{ splash:{ pct:50, radius:1200 } } },
    { id:"miraculum",      lvl:42, la:"Miraculum",      nl:"Alle torens +4% schade",                         fx:{ global:4 } },
  ],
  centurio:[
    { id:"imperium",       lvl:8,  la:"Imperium",       nl:"Torens dichtbij +10% schade",                    fx:{ aura:{ dmg:10, radius:1500 } } },
    { id:"tuba",           lvl:14, la:"Tuba",           nl:"Torens in een grote kring +5% schade",           fx:{ aura:{ dmg:5, radius:3000 } } },
    { id:"signum",         lvl:22, la:"Signum",         nl:"Torens in een kring +10% schade",                fx:{ aura:{ dmg:10, radius:2500 } } },
    { id:"praemium",       lvl:30, la:"Praemium",       nl:"+8% beloning na de missie",                      fx:{ reward:8 } },
    { id:"disciplina",     lvl:38, la:"Disciplina",     nl:"Alle torens +5% schade",                         fx:{ global:5 } },
    { id:"legatus",        lvl:44, la:"Legatus",        nl:"Torens in een zeer grote kring +8% schade",      fx:{ aura:{ dmg:8, radius:3500 } } },
  ],
  genie:[
    { id:"ballista",       lvl:8,  la:"Ballista",       nl:"+30% bereik",                                    fx:{ rng:30 } },
    { id:"catapulta",      lvl:14, la:"Catapulta",      nl:"+8% schade",                                     fx:{ dmg:8 } },
    { id:"machina",        lvl:22, la:"Machina",        nl:"Schoten negeren de helft van de verdediging",    fx:{ pierce:50 } },
    { id:"onager",         lvl:29, la:"Onager",         nl:"+15% bereik",                                    fx:{ rng:15 } },
    { id:"tormentum",      lvl:36, la:"Tormentum",      nl:"Treffers doen ook 50% schade aan vijanden ernaast", fx:{ splash:{ pct:50, radius:1000 } } },
    { id:"arx",            lvl:43, la:"Arx",            nl:"Elke 3e treffer doet dubbele schade",            fx:{ nth:{ n:3, mult:2 } } },
  ],
  verkenner:[
    { id:"explorare",      lvl:8,  la:"Explorare",      nl:"+15% bereik",                                    fx:{ rng:15 } },
    { id:"sagax",          lvl:14, la:"Sagax",          nl:"+8% schiettempo",                                fx:{ cd:8 } },
    { id:"insidiae",       lvl:22, la:"Insidiae",       nl:"Elke 2e treffer vertraagt de vijand 25% (2 s)",  fx:{ slow:{ pct:25, ticks:40, every:2 } } },
    { id:"vestigia",       lvl:29, la:"Vestigia",       nl:"Schoten negeren 25% van de verdediging",         fx:{ pierce:25 } },
    { id:"praeda",         lvl:36, la:"Praeda",         nl:"+10% beloning na de missie",                     fx:{ reward:10 } },
    { id:"umbra",          lvl:43, la:"Umbra",          nl:"+15% schade",                                    fx:{ dmg:15 } },
  ],
  myth:[
    { id:"terror",         lvl:10, la:"Terror",         nl:"Elke 3e treffer vertraagt de vijand 30% (1,5 s)", fx:{ slow:{ pct:30, ticks:30, every:3 } } },
    { id:"ungues",         lvl:16, la:"Ungues",         nl:"+8% schade",                                     fx:{ dmg:8 } },
    { id:"ignis",          lvl:25, la:"Ignis",          nl:"Treffers doen ook 50% schade aan vijanden ernaast", fx:{ splash:{ pct:50, radius:1000 } } },
    { id:"anima",          lvl:32, la:"Anima",          nl:"Na elke golf +1 leven voor het kamp",            fx:{ regen:1 } },
    { id:"furia",          lvl:40, la:"Furia",          nl:"+20% schade",                                    fx:{ dmg:20 } },
    { id:"caelum",         lvl:46, la:"Caelum",         nl:"Alle torens +3% schade",                         fx:{ global:3 } },
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
function castraSkillLvl(s){ return s.hero ? s.h.lvl : (s.lvl||1); }
// Waar de gekozen artes bewaard worden (soldaat of held).
function castraSkillHolder(s){ return s.hero ? s.h : s; }
// Geleerde artes van de huidige klasse, in leervolgorde.
function castraSkillKnown(s){
  const lvl = castraSkillLvl(s);
  return castraSkillList(castraSkillClassOf(s)).filter(k=>lvl>=k.lvl);
}
// Gekozen artes (max 4): ongeldige eruit (andere klasse of nog niet geleerd); zolang de speler niet zelf
// gekozen heeft worden vrije plaatsen automatisch gevuld met de eerst geleerde.
function castraSkillIds(s){
  if(s.dux || (!s.hero && !s.line)) return [];
  const H = castraSkillHolder(s), known = castraSkillKnown(s).map(k=>k.id);
  let eq = (H.skills || []).filter(id=>known.includes(id));
  if(!H.skManual) known.forEach(id=>{ if(eq.length < CASTRA_SKILL_MAX && !eq.includes(id)) eq.push(id); });
  eq = eq.slice(0, CASTRA_SKILL_MAX);
  H.skills = eq;
  return eq;
}
// Alle artes van de klasse met status: known / equipped.
function castraSkillsOf(s){
  const eq = castraSkillIds(s), lvl = castraSkillLvl(s);
  return castraSkillList(castraSkillClassOf(s)).map(k=>({ ...k, known: lvl>=k.lvl, equipped: eq.includes(k.id) }));
}
function castraHeroSkillIds(h){ return castraSkillIds({ hero:true, h }); }
function castraSkillById(id){ for(const c in CASTRA_SKILLS){ const k = CASTRA_SKILLS[c].find(x=>x.id===id); if(k) return k; } return null; }
// Aan/uit zetten (menu). Retourneert null bij succes, anders een foutcode.
function castraSkillToggle(s, skillId){
  if(typeof CASTRA_B!=="undefined" && CASTRA_B && !CASTRA_B.finished && document.getElementById("cbMap")) return "gevecht";
  const H = castraSkillHolder(s), k = castraSkillById(skillId);
  if(!k || !castraSkillKnown(s).some(x=>x.id===skillId)) return "onbekend";
  let eq = castraSkillIds(s).slice();
  if(eq.includes(skillId)) eq = eq.filter(x=>x!==skillId);
  else { if(eq.length >= CASTRA_SKILL_MAX) return "vol"; eq.push(skillId); }
  H.skills = eq; H.skManual = true; castraSave();
  return null;
}

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

// Pokémon-stijl melding bij het bereiken van een level met een nieuwe vaardigheid.
function castraSkillLearned(s, oldLvl, newLvl){
  const cls = castraSkillClassOf(s); if(!cls) return [];
  const nm = s.hero ? CASTRA_HERO_DATA[s.h.id].nm : castraSoldierName(s);
  const got = castraSkillList(cls).filter(k=>k.lvl>oldLvl && k.lvl<=newLvl);
  if(!got.length) return got;
  const eq = castraSkillIds(s);
  got.forEach((k,i)=>setTimeout(()=>{ if(typeof toast==="function") toast("🎓 "+nm+" leert "+k.la+"!", k.nl+(eq.includes(k.id)?"":" · Je hebt al 4 artes: kies in het menu welke je gebruikt.")); }, 600+i*1800));
  return got;
}
// HTML-editor voor menu: tik op een geleerde arte om hem aan/uit te zetten (max 4). kind = "s" (soldaat) of "h" (held).
function castraSkillsHTML(s, kind, id){
  const list = castraSkillsOf(s); if(!list.length) return "";
  const eqN = list.filter(k=>k.equipped).length;
  return `<div style="margin-top:6px;font-size:13px"><div style="font-weight:bold;margin-bottom:2px">🎓 Artes <span style="opacity:.7">${eqN} / ${CASTRA_SKILL_MAX} in gebruik — tik om te kiezen</span></div>`
    + list.map(k=>k.known
      ? `<div role="button" onclick="event.stopPropagation();castraMenuSkill('${kind}','${id}','${k.id}')" style="padding:4px 6px;margin:2px 0;border:1px solid ${k.equipped?"#8a6d2f":"#c2a96f"};border-radius:6px;background:${k.equipped?"rgba(212,175,55,.28)":"transparent"};cursor:pointer;min-height:32px">${k.equipped?"✅":"⬜"} <b>${esc(k.la)}</b> <small>${esc(k.nl)}</small></div>`
      : `<div style="padding:2px 6px;opacity:.5">🔒 Lv ${k.lvl} <b>${esc(k.la)}</b> <small>${esc(k.nl)}</small></div>`).join("") + `</div>`;
}
