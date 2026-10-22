/* ============================================================================
   CASTRA HEROUM — EVOLUTIE VAN ALLE HELDEN (data)
   ----------------------------------------------------------------------------
   Vult CASTRA_HERO_EVO (castra-heroevo.js) met de overige 14 helden; Ulixes staat daar zelf (pilot).
   Per held: persoonlijk voorwerp + quest op gradus 25, twee specialisaties, per specialisatie een quest op
   gradus 40 en een prestigevorm met een legendarische arte. Keuzes van Gerben: zie
   certamen/assets/sprites-forms/HELDEN_EVOLUTIE.md.
   De quests worden uit korte bouwstenen opgebouwd (K = vijanden verslaan, C = vangen, F = zoeken, B = baas);
   de Latijnse vraag voor de speler volgt vanzelf uit de stappen. Laadt NA castra-heroevo.js.
   ============================================================================ */

// Archetypen: basisklasse van de artes (castra-skills.js), type voor de tower defence en de stat-vermenigvuldigers.
const CASTRA_HEVO_ARCH = {
  hopliet:     { type:"inf", m:{ vita:1.25, impetus:0.95, tutela:1.3,  celeritas:0.9, ambitus:1.0 }, p:{ vita:1.45, impetus:1.1,  tutela:1.5,  celeritas:1.0, ambitus:1.1 } },
  spartaan:    { type:"inf", m:{ vita:1.1,  impetus:1.3,  tutela:1.0,  celeritas:1.0, ambitus:1.0 }, p:{ vita:1.25, impetus:1.55, tutela:1.1,  celeritas:1.1, ambitus:1.0 } },
  boogschutter:{ type:"rng", m:{ vita:0.9,  impetus:1.25, tutela:0.9,  celeritas:1.1, ambitus:1.6 }, p:{ vita:1.0,  impetus:1.55, tutela:1.0,  celeritas:1.2, ambitus:2.0 } },
  cavalerie:   { type:"cav", m:{ vita:1.0,  impetus:1.15, tutela:0.95, celeritas:1.4, ambitus:1.1 }, p:{ vita:1.15, impetus:1.4,  tutela:1.05, celeritas:1.7, ambitus:1.2 } },
  centurio:    { type:"sup", m:{ vita:1.05, impetus:1.0,  tutela:1.15, celeritas:1.0, ambitus:1.4 }, p:{ vita:1.2,  impetus:1.15, tutela:1.3,  celeritas:1.1, ambitus:1.7 } },
  verkenner:   { type:"sup", m:{ vita:0.95, impetus:1.1,  tutela:0.95, celeritas:1.5, ambitus:1.3 }, p:{ vita:1.1,  impetus:1.35, tutela:1.1,  celeritas:1.9, ambitus:1.5 } },
};
const _HE_TERR = { silva:["in silva","in het bos"], via:["in via","op de weg"], campus:["in campo","op het veld"], tiberis:["ad Tiberim","bij de Tiber"],
  olea:["in olea","in de olijfgaard"], litus:["ad litus","aan de kust"], muros:["ante muros","voor de muren"], scamander:["ad Scamandrum","bij de Scamander"], cuniculus:["in cuniculo","in de tunnel"] };
const _HE_NUM = { 3:"tres", 5:"quinque", 6:"sex", 8:"octo", 10:"decem", 12:"duodecim" };
const _HE_BOSS = { boss_troia:["Cyclopem","de Cycloop","Troje"], boss_graecia:["Dracontem","de draak","Graecia"] };
const _HE_K = (n, region, terr)=>({ kind:"kill", n, region, terrain:terr, hud:{ la:"Vince hostes "+_HE_TERR[terr][0]+"!", nl:"Versla vijanden "+_HE_TERR[terr][1]+"." } });
const _HE_C = (n)=>({ kind:"catch", n, hud:{ la:"Cape "+_HE_NUM[n]+" hostes!", nl:"Vang "+n+" vijanden." } });
const _HE_F = (region, icon, nm, la, nl)=>({ kind:"find", region, icon, nm, hud:{ la, nl } });
const _HE_B = (key)=>({ kind:"boss", key, hud:{ la:"Vince "+_HE_BOSS[key][0]+"!", nl:"Versla "+_HE_BOSS[key][1]+" (de grot in "+_HE_BOSS[key][2]+")." } });
// Een quest: seek = [Latijn (4e naamval), Nederlands]; nom = [Latijn (1e naamval), Nederlands] voor de dankzin.
function _HE_Q(nm, seek, steps, nom, first){
  const ends = s=>s.replace(/!$/, ".");
  return { nm:{ la:nm[0], nl:nm[1] },
    ask:[ first ? { la:"Dux {naam}, tempus advenit. "+seek[0]+" quaero.", nl:"Leider {naam}, de tijd is gekomen. Ik zoek "+seek[1]+"." }
                : { la:"Dux {naam}, via mea clara est. "+seek[0]+" quaero.", nl:"Leider {naam}, mijn weg is duidelijk. Ik zoek "+seek[1]+"." },
          { la:steps.map(s=>ends(s.hud.la)).join(" "), nl:steps.map(s=>s.hud.nl).join(" "), opts:[CASTRA_DQ_YES, CASTRA_DQ_NO] } ],
    steps,
    done:[ { la:nom[0]+"! Gratias tibi ago, dux {naam}.", nl:nom[1]+"! Dank je wel, leider {naam}." },
           first ? { la:"Nunc viam eligere possum.", nl:"Nu kan ik mijn weg kiezen (menu: Heroes, Evolueer)." } : { la:"Ambrosia mihi datur.", nl:"Ik krijg ambrosia." } ] };
}
// Een specialisatie met prestigevorm. a = archetype (sleutel van CASTRA_HEVO_ARCH).
function _HE_S(hid, id, a, nm, nl, desc, look, q2, pr){
  const A = CASTRA_HEVO_ARCH[a];
  return { id, nm, nl, desc, type:A.type, skillBase:a, cls:hid+"_"+id, mult:A.m, look,
    q2:{ ..._HE_Q([q2.nm[0], q2.nm[1]], q2.seek, q2.steps, q2.nom, false), reward:{ item:"evo_"+hid+"_2", pxp:150, gloria:10 } },
    prestige:{ nm:pr.nm, nl:pr.nl, mult:A.p, look:pr.look, legendary:{ id:pr.leg.id, la:pr.leg.la, nl:pr.leg.nl, lvl:40, fx:pr.leg.fx, mv:pr.leg.mv } } };
}
function _HE_H(hid, icon, itemNm, itemNl, q1, specs){
  CASTRA_HERO_EVO[hid] = {
    items:[ { id:"evo_"+hid+"_1", icon, nm:itemNm, nl:itemNl }, { id:"evo_"+hid+"_2", icon:"🍯", nm:"Ambrosia", nl:"Voedsel van de goden" } ],
    q1:{ ..._HE_Q(q1.nm, q1.seek, q1.steps, q1.nom, true), reward:{ item:"evo_"+hid+"_1", pxp:80, gloria:5 } },
    specs };
  castraHeroEvoRegisterClasses(hid); castraHeroEvoRegisterQuests(hid);
}
const _HE_BUFF = { kind:"buff", pp:3, nl:"Je aanval wordt 3 beurten 30% sterker" }, _HE_SHIELD = { kind:"shield", pp:3, nl:"Je verdediging wordt 3 beurten 30% sterker" };
const _HE_LK = (o)=>o;

/* ----- Latium ----- */
_HE_H("aeneas", "🛡️", "Clipeus Aeneae", "Het schild van Aeneas",
  { nm:["Clipeus Aeneae","Het schild van Aeneas"], seek:["Clipeum meum","mijn schild"], nom:["Clipeus meus","Mijn schild"],
    steps:[ _HE_K(8,"latium","silva"), _HE_F("latium","🛡️","verloren schild","Quaere clipeum!","Zoek het schild in Latium."), _HE_B("boss_troia") ] },
  [ _HE_S("aeneas","dux","centurio","Dux Troianus","Bevelvoerder","Aeneas wordt een leider: hij versterkt de torens om zich heen en ziet ver.",
      { armor:"ceremonieel", cape:"lang", capekleur:"rood", helm:"open" },
      { nm:["Signum Troianum","Het Trojaanse veldteken"], seek:["Signum Troianum","het Trojaanse veldteken"], nom:["Signum Troianum","Het veldteken"],
        steps:[ _HE_K(12,"latium","campus"), _HE_C(3), _HE_B("boss_troia") ] },
      { nm:"Conditor", nl:"Stichter", look:{ armor:"ceremonieel", capekleur:"goud", helm:"kroon" },
        leg:{ id:"imperium_sine_fine", la:"Imperium sine fine", nl:"Heerschappij zonder einde: alle torens +8% schade", fx:{ global:8 }, mv:_HE_BUFF } }),
    _HE_S("aeneas","pro","hopliet","Propugnator","Verdediger","Aeneas wordt een standvastige verdediger met een groot schild: veel levenspunten en verdediging.",
      { armor:"hopliet", cape:"kort", capekleur:"rood", helm:"hopliet", schild:"rond" },
      { nm:["Scutum novum","Een nieuw schild"], seek:["Scutum novum","een nieuw schild"], nom:["Scutum novum","Het nieuwe schild"],
        steps:[ _HE_K(12,"latium","via"), _HE_C(3), _HE_B("boss_graecia") ] },
      { nm:"Pius", nl:"De plichtsgetrouwe", look:{ armor:"ceremonieel", capekleur:"goud", schild:"tower" },
        leg:{ id:"scutum_pii", la:"Scutum pii", nl:"Schild van de plichtsgetrouwe: +1 leven na elke golf en torens dichtbij +10% schade", fx:{ regen:1, aura:{ dmg:10, radius:1500 } }, mv:_HE_SHIELD } }) ]);

_HE_H("romulus", "🪄", "Lituus Romuli", "De augurstaf van Romulus",
  { nm:["Lituus Romuli","De augurstaf van Romulus"], seek:["Lituum meum","mijn augurstaf"], nom:["Lituus meus","Mijn augurstaf"],
    steps:[ _HE_K(8,"latium","campus"), _HE_F("latium","🪄","verloren augurstaf","Quaere lituum!","Zoek de augurstaf in Latium."), _HE_B("boss_graecia") ] },
  [ _HE_S("romulus","rex","centurio","Rex","Koning","Romulus wordt koning: hij versterkt de torens om zich heen en verhoogt de beloning.",
      { armor:"ceremonieel", cape:"lang", capekleur:"paars", helm:"kroon" },
      { nm:["Corona laureae","De laurierkroon"], seek:["Coronam laureae","de laurierkroon"], nom:["Corona laureae","De laurierkroon"],
        steps:[ _HE_K(12,"latium","via"), _HE_C(3), _HE_B("boss_troia") ] },
      { nm:"Quirinus", nl:"De vergoddelijkte", look:{ armor:"ceremonieel", cape:"lang", capekleur:"goud", helm:"kroon" },
        leg:{ id:"auspicium_quirini", la:"Auspicium Quirini", nl:"Voorteken van Quirinus: alle torens +6% schade en +10% beloning", fx:{ global:6, reward:10 }, mv:_HE_BUFF } }),
    _HE_S("romulus","bel","spartaan","Bellator","Krijger","Romulus wordt een felle krijger met veel aanvalskracht.",
      { armor:"zwaar", cape:"kort", capekleur:"rood", helm:"open" },
      { nm:["Hasta Martis","De speer van Mars"], seek:["Hastam Martis","de speer van Mars"], nom:["Hasta Martis","De speer van Mars"],
        steps:[ _HE_K(12,"latium","campus"), _HE_C(3), _HE_B("boss_graecia") ] },
      { nm:"Martis Filius", nl:"Zoon van Mars", look:{ armor:"kampioen", capekleur:"oranje", helm:"open" },
        leg:{ id:"hasta_martis", la:"Hasta Martis", nl:"De speer van Mars: elke 3e treffer doet dubbele schade, +30% schade", fx:{ dmg:30, nth:{ n:3, mult:2 } }, mv:{ kind:"dmg", power:130, acc:90, pp:3, nl:"Speer van Mars (zware slag)" } } }) ]);

_HE_H("horatius", "⚔️", "Gladius Horatii", "Het zwaard van Horatius",
  { nm:["Gladius Horatii","Het zwaard van Horatius"], seek:["Gladium meum","mijn zwaard"], nom:["Gladius meus","Mijn zwaard"],
    steps:[ _HE_K(8,"latium","tiberis"), _HE_F("latium","⚔️","verloren zwaard","Quaere gladium!","Zoek het zwaard in Latium."), _HE_B("boss_troia") ] },
  [ _HE_S("horatius","cus","hopliet","Custos Pontis","Brugwachter","Horatius wordt de onwrikbare brugwachter: veel levenspunten en verdediging.",
      { armor:"hopliet", cape:"kort", capekleur:"rood", helm:"hopliet", schild:"rond" },
      { nm:["Pons novus","Een nieuwe brug"], seek:["Pontem novum","een nieuwe brug"], nom:["Pons novus","De nieuwe brug"],
        steps:[ _HE_K(12,"latium","tiberis"), _HE_C(3), _HE_B("boss_graecia") ] },
      { nm:"Servator Urbis", nl:"Redder van de stad", look:{ armor:"ceremonieel", capekleur:"goud", schild:"tower" },
        leg:{ id:"pons_defensus", la:"Pons defensus", nl:"De brug verdedigd: torens dichtbij +12% schade en +15% schade", fx:{ dmg:15, aura:{ dmg:12, radius:1800 } }, mv:_HE_SHIELD } }),
    _HE_S("horatius","pug","spartaan","Pugnator","Vechter","Horatius vecht met beide handen: veel aanvalskracht.",
      { armor:"zwaar", cape:"kort", capekleur:"rood", helm:"open", wapen:"zwaard" },
      { nm:["Ictus fortis","Een sterke slag"], seek:["Ictum fortem","een sterke slag"], nom:["Ictus fortis","Een sterke slag"],
        steps:[ _HE_K(12,"latium","via"), _HE_C(3), _HE_B("boss_troia") ] },
      { nm:"Heros Tiberis", nl:"Held van de Tiber", look:{ armor:"kampioen", capekleur:"blauw" },
        leg:{ id:"ictus_tiberis", la:"Ictus Tiberis", nl:"Slag van de Tiber: negeert de helft van de verdediging, +25% schade", fx:{ pierce:50, dmg:25 }, mv:{ kind:"dmg", power:125, acc:90, pp:3, pierce:50, nl:"Zware slag die de helft van de verdediging negeert" } } }) ]);

_HE_H("cloelia", "🐴", "Frenum Cloeliae", "De teugel van Cloelia",
  { nm:["Frenum Cloeliae","De teugel van Cloelia"], seek:["Frenum meum","mijn teugel"], nom:["Frenum meum","Mijn teugel"],
    steps:[ _HE_K(8,"latium","tiberis"), _HE_F("latium","🐴","verloren teugel","Quaere frenum!","Zoek de teugel in Latium."), _HE_B("boss_graecia") ] },
  [ _HE_S("cloelia","eq","cavalerie","Equitissa","Ruiteres","Cloelia wordt een ruiteres: zeer snel en sterk bij de eerste treffers.",
      { armor:"middel", cape:"lang", capekleur:"blauw", helm:"open" },
      { nm:["Equus celer","Een snel paard"], seek:["Equum celerem","een snel paard"], nom:["Equus celer","Het snelle paard"],
        steps:[ _HE_K(12,"latium","via"), _HE_C(3), _HE_B("boss_troia") ] },
      { nm:"Domina Equitum", nl:"Meesteres der ruiters", look:{ armor:"ceremonieel", capekleur:"goud" },
        leg:{ id:"cursus_cloeliae", la:"Cursus Cloeliae", nl:"De ren van Cloelia: de eerste 3 treffers van elke golf doen driedubbele schade, +30% schiettempo", fx:{ cd:30, charge:{ hits:3, mult:3 } }, mv:{ kind:"dmg", power:100, acc:95, pp:4, prio:1, nl:"Razendsnelle uitval (gaat eerst)" } } }),
    _HE_S("cloelia","exp","verkenner","Explorata","Verkenster","Cloelia wordt een sluwe verkenster: zeer snel, vertraagt vijanden en ziet ver.",
      { armor:"licht", cape:"lang", capekleur:"groen", helm:"bandana" },
      { nm:["Via secreta","Een geheime weg"], seek:["Viam secretam","een geheime weg"], nom:["Via secreta","De geheime weg"],
        steps:[ _HE_K(12,"latium","tiberis"), _HE_C(3), _HE_B("boss_graecia") ] },
      { nm:"Virgo Fortissima", nl:"De dapperste maagd", look:{ armor:"ceremonieel", capekleur:"goud" },
        leg:{ id:"natatio_cloeliae", la:"Natatio Cloeliae", nl:"De zwemtocht van Cloelia: elke 2e treffer vertraagt 40%, +25% bereik", fx:{ slow:{ pct:40, ticks:40, every:2 }, rng:25 }, mv:{ kind:"dmg", power:80, acc:100, pp:5, prio:1, slow:35, nl:"Snelle aanval die de vijand vertraagt (gaat eerst)" } } }) ]);

_HE_H("mucius", "🔥", "Ignis Muci", "Het vuur van Mucius",
  { nm:["Ignis Muci","Het vuur van Mucius"], seek:["Ignem sacrum","het heilige vuur"], nom:["Ignis sacer","Het heilige vuur"],
    steps:[ _HE_K(8,"latium","silva"), _HE_F("latium","🔥","heilig vuur","Quaere ignem!","Zoek het vuur in Latium."), _HE_B("boss_troia") ] },
  [ _HE_S("mucius","ins","verkenner","Insidiator","Sluipmoordenaar","Mucius wordt een sluipmoordenaar: zeer snel, vertraagt vijanden en slaat precies.",
      { armor:"licht", cape:"lang", capekleur:"paars", helm:"bandana" },
      { nm:["Pugio umbrae","De dolk van de schaduw"], seek:["Pugionem umbrae","de dolk van de schaduw"], nom:["Pugio umbrae","De dolk van de schaduw"],
        steps:[ _HE_K(12,"latium","silva"), _HE_C(3), _HE_B("boss_graecia") ] },
      { nm:"Sicarius", nl:"Meester-sluiper", look:{ armor:"middel", capekleur:"paars", helm:"bandana" },
        leg:{ id:"pugio_umbrae", la:"Pugio umbrae", nl:"De dolk van de schaduw: negeert de helft van de verdediging, +30% schade", fx:{ dmg:30, pierce:50 }, mv:{ kind:"dmg", power:120, acc:95, pp:3, pierce:50, nl:"Dolksteek door het pantser" } } }),
    _HE_S("mucius","for","spartaan","Fortis","De Standvastige","Mucius wordt een onverschrokken krijger met veel aanvalskracht.",
      { armor:"zwaar", cape:"kort", capekleur:"oranje", helm:"open" },
      { nm:["Ignis novus","Nieuw vuur"], seek:["Ignem novum","nieuw vuur"], nom:["Ignis novus","Het nieuwe vuur"],
        steps:[ _HE_K(12,"latium","campus"), _HE_C(3), _HE_B("boss_troia") ] },
      { nm:"Dextra Ignea", nl:"De vurige hand", look:{ armor:"kampioen", capekleur:"oranje" },
        leg:{ id:"dextra_ignea", la:"Dextra ignea", nl:"De vurige hand: treffers raken ook vijanden ernaast (60%), +25% schade", fx:{ splash:{ pct:60, radius:1200 }, dmg:25 }, mv:{ kind:"dmg", power:125, acc:90, pp:3, nl:"Vurige slag" } } }) ]);

_HE_H("camilla", "🏹", "Arcus Camillae", "De boog van Camilla",
  { nm:["Arcus Camillae","De boog van Camilla"], seek:["Arcum meum","mijn boog"], nom:["Arcus meus","Mijn boog"],
    steps:[ _HE_K(8,"latium","silva"), _HE_F("latium","🏹","verloren boog","Quaere arcum!","Zoek de boog in Latium."), _HE_B("boss_graecia") ] },
  [ _HE_S("camilla","sag","boogschutter","Sagittaria","Boogschutster","Camilla wordt een meesterschutter: veel bereik en aanvalskracht.",
      { armor:"licht", cape:"lang", capekleur:"groen", helm:"bandana", wapen:"boog" },
      { nm:["Sagittae novae","Nieuwe pijlen"], seek:["Sagittas novas","nieuwe pijlen"], nom:["Sagittae novae","De nieuwe pijlen"],
        steps:[ _HE_K(12,"latium","silva"), _HE_C(3), _HE_B("boss_troia") ] },
      { nm:"Virgo Volsca", nl:"Volscische maagd", look:{ armor:"middel", capekleur:"goud", wapen:"boog" },
        leg:{ id:"sagitta_volsca", la:"Sagitta Volsca", nl:"Twee pijlen tegelijk: elk 2e schot raakt ook een tweede vijand, +20% schiettempo", fx:{ double:{ every:2 }, cd:20 }, mv:{ kind:"dmg", hits:2, power:65, acc:90, pp:4, nl:"Twee pijlen achter elkaar" } } }),
    _HE_S("camilla","eqs","cavalerie","Equestris","Ruiteres","Camilla schiet te paard: zeer snel en sterk bij de eerste treffers.",
      { armor:"middel", cape:"lang", capekleur:"groen", helm:"open", wapen:"boog" },
      { nm:["Equus bellicus","Een strijdros"], seek:["Equum bellicum","een strijdros"], nom:["Equus bellicus","Het strijdros"],
        steps:[ _HE_K(12,"latium","via"), _HE_C(3), _HE_B("boss_graecia") ] },
      { nm:"Regina Camillarum", nl:"Koningin der strijdsters", look:{ armor:"ceremonieel", capekleur:"goud" },
        leg:{ id:"cursus_camillae", la:"Cursus Camillae", nl:"De ren van Camilla: +30% schiettempo en +20% schade", fx:{ cd:30, dmg:20 }, mv:{ kind:"dmg", power:100, acc:95, pp:4, prio:1, nl:"Snelle schot te paard (gaat eerst)" } } }) ]);

/* ----- Graecia ----- */
_HE_H("hercules", "🦁", "Pellis Leonis", "De leeuwenhuid",
  { nm:["Pellis Leonis","De leeuwenhuid"], seek:["Pellem leonis","de leeuwenhuid"], nom:["Pellis leonis","De leeuwenhuid"],
    steps:[ _HE_K(8,"graecia","olea"), _HE_F("graecia","🦁","leeuwenhuid","Quaere pellem!","Zoek de leeuwenhuid in Graecia."), _HE_B("boss_graecia") ] },
  [ _HE_S("hercules","ath","spartaan","Athleta","Worstelaar","Hercules wordt een geweldenaar met een knots: enorme aanvalskracht.",
      { armor:"zwaar", cape:"kort", capekleur:"oranje", wapen:"knuppel" },
      { nm:["Clava nova","Een nieuwe knots"], seek:["Clavam novam","een nieuwe knots"], nom:["Clava nova","De nieuwe knots"],
        steps:[ _HE_K(12,"graecia","litus"), _HE_C(3), _HE_B("boss_graecia") ] },
      { nm:"Alcides", nl:"Telg van Alceus", look:{ armor:"kampioen", capekleur:"goud" },
        leg:{ id:"clava_herculis", la:"Clava Herculis", nl:"De knots van Hercules: elke 3e treffer doet driedubbele schade, +35% schade", fx:{ dmg:35, nth:{ n:3, mult:3 } }, mv:{ kind:"dmg", power:140, acc:85, pp:3, nl:"Knots van Hercules (zeer zware slag)" } } }),
    _HE_S("hercules","sag","boogschutter","Sagittarius Herculis","Boogschutter van Hercules","Hercules schiet met Hydra-pijlen: veel bereik en aanvalskracht.",
      { armor:"middel", cape:"lang", capekleur:"oranje", helm:"geen", wapen:"boog" },
      { nm:["Sagittae Hydrae","De Hydra-pijlen"], seek:["Sagittas Hydrae","de Hydra-pijlen"], nom:["Sagittae Hydrae","De Hydra-pijlen"],
        steps:[ _HE_K(12,"graecia","olea"), _HE_C(3), _HE_B("boss_graecia") ] },
      { nm:"Deus", nl:"God", look:{ armor:"ceremonieel", cape:"engelenvleugels", capekleur:"goud" },
        leg:{ id:"sagitta_hydrae", la:"Sagitta Hydrae", nl:"De Hydra-pijl: gaat door het pantser, raakt ook vijanden ernaast (40%)", fx:{ pierce:60, splash:{ pct:40, radius:900 } }, mv:{ kind:"dmg", power:120, acc:95, pp:3, pierce:50, nl:"Hydra-pijl door het pantser" } } }) ]);

_HE_H("perseus", "🪞", "Speculum Persei", "Het spiegelschild van Perseus",
  { nm:["Speculum Persei","Het spiegelschild van Perseus"], seek:["Speculum meum","mijn spiegelschild"], nom:["Speculum meum","Mijn spiegelschild"],
    steps:[ _HE_K(8,"graecia","litus"), _HE_F("graecia","🪞","verloren spiegelschild","Quaere speculum!","Zoek het spiegelschild in Graecia."), _HE_B("boss_graecia") ] },
  [ _HE_S("perseus","eqa","cavalerie","Eques Alatus","Gevleugelde ruiter","Perseus vliegt met gevleugelde sandalen: zeer snel en sterk bij de eerste treffers.",
      { armor:"middel", cape:"engelenvleugels", helm:"open" },
      { nm:["Alae novae","Nieuwe vleugels"], seek:["Alas novas","nieuwe vleugels"], nom:["Alae novae","De nieuwe vleugels"],
        steps:[ _HE_K(12,"graecia","litus"), _HE_C(3), _HE_B("boss_troia") ] },
      { nm:"Gorgonicida", nl:"Medusa-overwinnaar", look:{ armor:"ceremonieel", cape:"engelenvleugels", capekleur:"goud", schild:"rond" },
        leg:{ id:"ictus_alatus", la:"Ictus alatus", nl:"Gevleugelde slag: de eerste 2 treffers doen driedubbele schade, negeert 40% verdediging", fx:{ cd:25, pierce:40, charge:{ hits:2, mult:3 } }, mv:{ kind:"dmg", power:110, acc:95, pp:4, prio:1, nl:"Duikaanval (gaat eerst)" } } }),
    _HE_S("perseus","ven","verkenner","Venator Monstrorum","Monsterjager","Perseus jaagt met een spiegelschild: snel, vertraagt vijanden en ziet ver.",
      { armor:"licht", cape:"lang", capekleur:"groen", helm:"bandana", schild:"rond" },
      { nm:["Caput Medusae","De kop van Medusa"], seek:["Caput Medusae","de kop van Medusa"], nom:["Caput Medusae","De kop van Medusa"],
        steps:[ _HE_K(12,"graecia","olea"), _HE_C(3), _HE_B("boss_graecia") ] },
      { nm:"Medusae Victor", nl:"Overwinnaar van Medusa", look:{ armor:"ceremonieel", capekleur:"goud", schild:"rond" },
        leg:{ id:"aspectus_medusae", la:"Aspectus Medusae", nl:"De blik van Medusa: elke 2e treffer vertraagt 50%, +20% schade", fx:{ slow:{ pct:50, ticks:40, every:2 }, dmg:20 }, mv:{ kind:"dmg", power:90, acc:100, pp:4, slow:50, nl:"Blik die de vijand versteent (vertraagt)" } } }) ]);

_HE_H("theseus", "🧵", "Filum Ariadnae", "De draad van Ariadne",
  { nm:["Filum Ariadnae","De draad van Ariadne"], seek:["Filum Ariadnae","de draad van Ariadne"], nom:["Filum Ariadnae","De draad van Ariadne"],
    steps:[ _HE_K(8,"graecia","olea"), _HE_F("graecia","🧵","draad van Ariadne","Quaere filum!","Zoek de draad in Graecia."), _HE_B("boss_graecia") ] },
  [ _HE_S("theseus","vic","hopliet","Victor Labyrinthi","Overwinnaar van het labyrint","Theseus wordt een zware verdediger: veel levenspunten en verdediging.",
      { armor:"hopliet", cape:"kort", capekleur:"blauw", helm:"hopliet", schild:"rond" },
      { nm:["Cornu Minotauri","De hoorn van de Minotaurus"], seek:["Cornu Minotauri","de hoorn van de Minotaurus"], nom:["Cornu Minotauri","De hoorn van de Minotaurus"],
        steps:[ _HE_K(12,"graecia","olea"), _HE_C(3), _HE_B("boss_graecia") ] },
      { nm:"Minotauri Victor", nl:"Minotaurusdoder", look:{ armor:"ceremonieel", capekleur:"goud", helm:"hopliet", schild:"tower" },
        leg:{ id:"cornu_minotauri", la:"Cornu Minotauri", nl:"De hoorn van de Minotaurus: torens dichtbij +10% schade, +25% schade", fx:{ dmg:25, aura:{ dmg:10, radius:1500 } }, mv:{ kind:"dmg", power:120, acc:90, pp:3, nl:"Hoornstoot (zware slag)" } } }),
    _HE_S("theseus","rex","centurio","Rex Atheniensis","Atheense koning","Theseus wordt koning van Athene: hij versterkt de torens om zich heen.",
      { armor:"ceremonieel", cape:"lang", capekleur:"paars", helm:"open" },
      { nm:["Sceptrum regis","De scepter van de koning"], seek:["Sceptrum regis","de scepter van de koning"], nom:["Sceptrum regis","De scepter"],
        steps:[ _HE_K(12,"graecia","litus"), _HE_C(3), _HE_B("boss_troia") ] },
      { nm:"Rex Athenarum", nl:"Heer van Athene", look:{ armor:"ceremonieel", capekleur:"goud", helm:"kroon" },
        leg:{ id:"filum_ariadnae", la:"Filum Ariadnae", nl:"De draad van Ariadne: alle torens +7% schade en torens dichtbij +10%", fx:{ global:7, aura:{ dmg:10, radius:2500 } }, mv:_HE_BUFF } }) ]);

_HE_H("atalanta", "🍎", "Pomum Aureum", "De gouden appel",
  { nm:["Pomum aureum","De gouden appel"], seek:["Pomum aureum","de gouden appel"], nom:["Pomum aureum","De gouden appel"],
    steps:[ _HE_K(8,"graecia","olea"), _HE_F("graecia","🍎","gouden appel","Quaere pomum!","Zoek de gouden appel in Graecia."), _HE_B("boss_graecia") ] },
  [ _HE_S("atalanta","sag","boogschutter","Sagittaria","Boogschutster","Atalanta wordt een meesterschutter: veel bereik en aanvalskracht.",
      { armor:"licht", cape:"kort", capekleur:"groen", helm:"bandana", wapen:"boog" },
      { nm:["Sagitta Dianae","De pijl van Diana"], seek:["Sagittam Dianae","de pijl van Diana"], nom:["Sagitta Dianae","De pijl van Diana"],
        steps:[ _HE_K(12,"graecia","olea"), _HE_C(3), _HE_B("boss_troia") ] },
      { nm:"Venatrix Dianae", nl:"Jageres van Diana", look:{ armor:"middel", capekleur:"goud", wapen:"boog" },
        leg:{ id:"sagitta_dianae", la:"Sagitta Dianae", nl:"De pijl van Diana: elk 2e schot raakt ook een tweede vijand, negeert de helft van de verdediging", fx:{ double:{ every:2 }, pierce:50 }, mv:{ kind:"dmg", hits:2, power:62, acc:95, pp:4, pierce:40, nl:"Twee pijlen door het pantser" } } }),
    _HE_S("atalanta","cur","verkenner","Cursor","Loopster","Atalanta wordt de snelste loopster: zeer snel en vertraagt vijanden.",
      { armor:"vodden", cape:"geen", helm:"bandana" },
      { nm:["Calcei celeres","Snelle sandalen"], seek:["Calceos celeres","snelle sandalen"], nom:["Calcei celeres","De snelle sandalen"],
        steps:[ _HE_K(12,"graecia","litus"), _HE_C(3), _HE_B("boss_graecia") ] },
      { nm:"Velocissima", nl:"De snelste", look:{ armor:"licht", capekleur:"goud" },
        leg:{ id:"pomum_aureum", la:"Pomum aureum", nl:"De gouden appel: elke 2e treffer vertraagt 50%, +25% schiettempo", fx:{ slow:{ pct:50, ticks:40, every:2 }, cd:25 }, mv:{ kind:"dmg", power:70, acc:100, pp:5, prio:1, slow:50, nl:"Gouden appel: de vijand vertraagt (gaat eerst)" } } }) ]);

_HE_H("iason", "⚓", "Ancora Argus", "Het anker van de Argo",
  { nm:["Ancora Argus","Het anker van de Argo"], seek:["Ancoram Argus","het anker van de Argo"], nom:["Ancora Argus","Het anker van de Argo"],
    steps:[ _HE_K(8,"graecia","litus"), _HE_F("graecia","⚓","anker van de Argo","Quaere ancoram!","Zoek het anker in Graecia."), _HE_B("boss_graecia") ] },
  [ _HE_S("iason","dra","hopliet","Draconis Victor","Drakendoder","Iason wordt een zware strijder: veel levenspunten en verdediging.",
      { armor:"hopliet", cape:"kort", capekleur:"goud", helm:"hopliet", schild:"rond" },
      { nm:["Vellus aureum","Het gouden vlies"], seek:["Vellus aureum","het gouden vlies"], nom:["Vellus aureum","Het gouden vlies"],
        steps:[ _HE_K(12,"graecia","olea"), _HE_C(3), _HE_B("boss_graecia") ] },
      { nm:"Aurei Velleris Dominus", nl:"Heer van het gouden vlies", look:{ armor:"ceremonieel", capekleur:"goud", schild:"tower" },
        leg:{ id:"vellus_aureum", la:"Vellus aureum", nl:"Het gouden vlies: +30% schade en +1 leven na elke golf", fx:{ dmg:30, regen:1 }, mv:{ kind:"dmg", power:125, acc:90, pp:3, nl:"Slag met het gouden vlies" } } }),
    _HE_S("iason","arg","centurio","Argonauta","Argonaut","Iason wordt leider van de Argonauten: hij versterkt de torens om zich heen.",
      { armor:"middel", cape:"lang", capekleur:"blauw", helm:"open" },
      { nm:["Navis nova","Een nieuw schip"], seek:["Navem novam","een nieuw schip"], nom:["Navis nova","Het nieuwe schip"],
        steps:[ _HE_K(12,"graecia","litus"), _HE_C(3), _HE_B("boss_troia") ] },
      { nm:"Dux Argonautarum", nl:"Leider der Argonauten", look:{ armor:"ceremonieel", capekleur:"goud", helm:"kroon" },
        leg:{ id:"remi_argus", la:"Remi Argus", nl:"De riemen van de Argo: alle torens +8% schade en torens dichtbij +10%", fx:{ global:8, aura:{ dmg:10, radius:2500 } }, mv:_HE_BUFF } }) ]);

/* ----- Troia ----- */
_HE_H("achilles", "⚔️", "Arma Vulcani", "De wapens van Vulcanus",
  { nm:["Arma Vulcani","De wapens van Vulcanus"], seek:["Arma nova","nieuwe wapens"], nom:["Arma nova","De nieuwe wapens"],
    steps:[ _HE_K(8,"troia","muros"), _HE_F("troia","⚔️","nieuwe wapens","Quaere arma!","Zoek de wapens in Troje."), _HE_B("boss_troia") ] },
  [ _HE_S("achilles","myr","spartaan","Heros Myrmidonum","Held van de Myrmidonen","Achilles wordt een geweldige krijger: enorme aanvalskracht.",
      { armor:"zwaar", cape:"kort", capekleur:"rood", helm:"open", wapen:"speer" },
      { nm:["Hasta Pelii","De speer van Peleus"], seek:["Hastam Pelii","de speer van Peleus"], nom:["Hasta Pelii","De speer van Peleus"],
        steps:[ _HE_K(12,"troia","muros"), _HE_C(3), _HE_B("boss_troia") ] },
      { nm:"Pelides", nl:"Zoon van Peleus", look:{ armor:"kampioen", capekleur:"goud", helm:"open", wapen:"speer" },
        leg:{ id:"ira_achillis", la:"Ira Achillis", nl:"De woede van Achilles: elke 4e treffer doet driedubbele schade, +35% schade", fx:{ dmg:35, nth:{ n:4, mult:3 } }, mv:{ kind:"dmg", power:145, acc:85, pp:3, nl:"Woede van Achilles (zeer zware slag)" } } }),
    _HE_S("achilles","aur","cavalerie","Auriga Heros","Wagenmenner","Achilles rijdt in zijn strijdwagen: zeer snel en sterk bij de eerste treffers.",
      { armor:"middel", cape:"lang", capekleur:"rood", helm:"open" },
      { nm:["Currus Achillis","De strijdwagen van Achilles"], seek:["Currum","een strijdwagen"], nom:["Currus noster","De strijdwagen"],
        steps:[ _HE_K(12,"troia","scamander"), _HE_C(3), _HE_B("boss_graecia") ] },
      { nm:"Invictus", nl:"Onoverwinnelijke", look:{ armor:"ceremonieel", capekleur:"goud" },
        leg:{ id:"currus_achillis", la:"Currus Achillis", nl:"De strijdwagen van Achilles: de eerste 3 treffers doen driedubbele schade, +30% schiettempo", fx:{ cd:30, charge:{ hits:3, mult:3 } }, mv:{ kind:"dmg", power:110, acc:95, pp:4, prio:1, nl:"Aanval met de strijdwagen (gaat eerst)" } } }) ]);

_HE_H("hector", "⛑️", "Galea Hectoris", "De helm van Hector",
  { nm:["Galea Hectoris","De helm van Hector"], seek:["Galeam meam","mijn helm"], nom:["Galea mea","Mijn helm"],
    steps:[ _HE_K(8,"troia","muros"), _HE_F("troia","⛑️","verloren helm","Quaere galeam!","Zoek de helm in Troje."), _HE_B("boss_troia") ] },
  [ _HE_S("hector","def","hopliet","Defensor Troiae","Verdediger van Troje","Hector wordt de verdediger van de stad: veel levenspunten en verdediging.",
      { armor:"hopliet", cape:"lang", capekleur:"blauw", helm:"hopliet", schild:"ovaal" },
      { nm:["Murus novus","Een nieuwe muur"], seek:["Murum novum","een nieuwe muur"], nom:["Murus novus","De nieuwe muur"],
        steps:[ _HE_K(12,"troia","muros"), _HE_C(3), _HE_B("boss_troia") ] },
      { nm:"Murus Troiae", nl:"De muur van Troje", look:{ armor:"ceremonieel", capekleur:"goud", schild:"tower" },
        leg:{ id:"murus_troiae", la:"Murus Troiae", nl:"De muur van Troje: +1 leven na elke golf, torens dichtbij +12% schade en +10% schade", fx:{ regen:1, aura:{ dmg:12, radius:2000 }, dmg:10 }, mv:_HE_SHIELD } }),
    _HE_S("hector","dux","centurio","Dux Troianus","Trojaanse bevelhebber","Hector wordt bevelhebber: hij versterkt de torens om zich heen.",
      { armor:"ceremonieel", cape:"lang", capekleur:"blauw", helm:"open" },
      { nm:["Exercitus meus","Mijn leger"], seek:["Exercitum meum","mijn leger"], nom:["Exercitus meus","Mijn leger"],
        steps:[ _HE_K(12,"troia","scamander"), _HE_C(3), _HE_B("boss_graecia") ] },
      { nm:"Princeps Troianorum", nl:"Prins van Troje", look:{ armor:"ceremonieel", capekleur:"paars", helm:"kroon" },
        leg:{ id:"hortatio_hectoris", la:"Hortatio Hectoris", nl:"De aanmoediging van Hector: alle torens +8% schade en +8% beloning", fx:{ global:8, reward:8 }, mv:_HE_BUFF } }) ]);

_HE_H("penthesilea", "🪓", "Bipennis Martis", "De strijdbijl van Mars",
  { nm:["Bipennis Martis","De strijdbijl van Mars"], seek:["Bipennem meam","mijn strijdbijl"], nom:["Bipennis mea","Mijn strijdbijl"],
    steps:[ _HE_K(8,"troia","scamander"), _HE_F("troia","🪓","verloren strijdbijl","Quaere bipennem!","Zoek de strijdbijl in Troje."), _HE_B("boss_troia") ] },
  [ _HE_S("penthesilea","bip","spartaan","Bipennifera","Bijldraagster","Penthesilea zwaait een dubbele bijl: enorme aanvalskracht.",
      { armor:"zwaar", cape:"lang", capekleur:"paars", helm:"open", wapen:"zwaard" },
      { nm:["Securis nova","Een nieuwe bijl"], seek:["Securim novam","een nieuwe bijl"], nom:["Securis nova","De nieuwe bijl"],
        steps:[ _HE_K(12,"troia","muros"), _HE_C(3), _HE_B("boss_troia") ] },
      { nm:"Regina Amazonum", nl:"Koningin der Amazones", look:{ armor:"kampioen", capekleur:"goud", helm:"kroon" },
        leg:{ id:"securis_reginae", la:"Securis reginae", nl:"De bijl van de koningin: negeert 40% van de verdediging, +30% schade", fx:{ dmg:30, pierce:40 }, mv:{ kind:"dmg", power:130, acc:90, pp:3, pierce:40, nl:"Slag met de dubbele bijl" } } }),
    _HE_S("penthesilea","eqa","cavalerie","Amazon Equestris","Amazone te paard","Penthesilea rijdt en schiet: zeer snel en sterk bij de eerste treffers.",
      { armor:"middel", cape:"lang", capekleur:"paars", helm:"open", wapen:"boog" },
      { nm:["Equus albus","Een wit paard"], seek:["Equum album","een wit paard"], nom:["Equus albus","Het witte paard"],
        steps:[ _HE_K(12,"troia","scamander"), _HE_C(3), _HE_B("boss_graecia") ] },
      { nm:"Martis Filia", nl:"Dochter van Mars", look:{ armor:"ceremonieel", capekleur:"goud" },
        leg:{ id:"furor_amazonum", la:"Furor Amazonum", nl:"De woede van de Amazones: +30% schiettempo en +25% schade", fx:{ cd:30, dmg:25 }, mv:{ kind:"dmg", power:115, acc:95, pp:4, prio:1, nl:"Razende aanval te paard (gaat eerst)" } } }) ]);

/* ----- verhaal-arte per held (vanaf level 1, blijft na evolutie) ----- */
Object.assign(CASTRA_HERO_SIG, {
  aeneas:     { id:"pietas_aeneae", la:"Pietas Aeneae", nl:"Pietas: +1 leven na elke golf, torens dichtbij +6% schade", lvl:1, fx:{ regen:1, aura:{ dmg:6, radius:1500 } }, mv:_HE_SHIELD },
  romulus:    { id:"lupae_auxilium", la:"Lupae auxilium", nl:"Hulp van de wolvin: +10% schade", lvl:1, fx:{ dmg:10 }, mv:_HE_BUFF },
  horatius:   { id:"pons_sublicius", la:"Pons Sublicius", nl:"Hij houdt de brug: elke 3e treffer vertraagt 30%, torens dichtbij +8%", lvl:1, fx:{ slow:{ pct:30, ticks:30, every:3 }, aura:{ dmg:8, radius:1500 } }, mv:{ kind:"dmg", power:55, acc:100, pp:6, slow:30, nl:"Slag die de vijand tegenhoudt (vertraagt)" } },
  cloelia:    { id:"fuga_cloeliae", la:"Fuga Cloeliae", nl:"De vlucht van Cloelia: +10% schiettempo, elke 3e treffer vertraagt 25%", lvl:1, fx:{ cd:10, slow:{ pct:25, ticks:30, every:3 } }, mv:{ kind:"dmg", power:50, acc:100, pp:6, prio:1, nl:"Snelle uitval (gaat eerst)" } },
  mucius:     { id:"dextra_constans", la:"Dextra constans", nl:"De standvastige hand: +10% schade, elke 4e treffer dubbele schade", lvl:1, fx:{ dmg:10, nth:{ n:4, mult:2 } }, mv:{ kind:"dmg", power:75, acc:90, pp:5, nl:"Onverschrokken slag" } },
  camilla:    { id:"pes_levis", la:"Pes levis", nl:"De lichte voet: +10% schiettempo", lvl:1, fx:{ cd:10 }, mv:{ kind:"dmg", power:50, acc:100, pp:6, prio:1, nl:"Snel schot (gaat eerst)" } },
  hercules:   { id:"labor_primus", la:"Labor primus", nl:"De eerste arbeid: +12% schade", lvl:1, fx:{ dmg:12 }, mv:{ kind:"dmg", power:78, acc:90, pp:5, nl:"Arbeid van Hercules (zware slag)" } },
  perseus:    { id:"talaria", la:"Talaria", nl:"Gevleugelde sandalen: +10% schiettempo, de eerste 2 treffers doen dubbele schade", lvl:1, fx:{ cd:10, charge:{ hits:2, mult:2 } }, mv:{ kind:"dmg", power:62, acc:95, pp:5, prio:1, nl:"Duikvlucht (gaat eerst)" } },
  theseus:    { id:"labyrinthus", la:"Labyrinthus", nl:"Het labyrint: elke 3e treffer vertraagt 30%", lvl:1, fx:{ slow:{ pct:30, ticks:30, every:3 } }, mv:{ kind:"dmg", power:55, acc:100, pp:6, slow:30, nl:"Aanval die de vijand laat verdwalen (vertraagt)" } },
  atalanta:   { id:"cursus_atalantae", la:"Cursus Atalantae", nl:"Snelle loopster: +10% schiettempo en +10% bereik", lvl:1, fx:{ cd:10, rng:10 }, mv:{ kind:"dmg", power:52, acc:100, pp:6, prio:1, nl:"Snel schot (gaat eerst)" } },
  iason:      { id:"argonautae", la:"Argonautae", nl:"De Argonauten helpen: alle torens +3% schade", lvl:1, fx:{ global:3 }, mv:_HE_BUFF },
  ulixes:     { id:"dolus_ulixis", la:"Dolus Ulixis", nl:"De list van Odysseus: elke 2e treffer vertraagt 25%", lvl:1, fx:{ slow:{ pct:25, ticks:30, every:2 } }, mv:{ kind:"dmg", power:50, acc:100, pp:6, prio:1, slow:25, nl:"List die de vijand vertraagt (gaat eerst)" } },
  achilles:   { id:"furor_pelidae", la:"Furor Pelidae", nl:"De woede van Achilles: +12% schade, elke 4e treffer dubbele schade", lvl:1, fx:{ dmg:12, nth:{ n:4, mult:2 } }, mv:{ kind:"dmg", power:80, acc:90, pp:5, nl:"Woede (zware slag)" } },
  hector:     { id:"defensor_patriae", la:"Defensor patriae", nl:"Verdediger van het vaderland: +1 leven na elke golf", lvl:1, fx:{ regen:1 }, mv:_HE_SHIELD },
  penthesilea:{ id:"sagitta_amazonum", la:"Sagitta Amazonum", nl:"Amazonepijl: negeert 30% van de verdediging, +10% schiettempo", lvl:1, fx:{ pierce:30, cd:10 }, mv:{ kind:"dmg", power:68, acc:95, pp:6, pierce:30, nl:"Pijl die het pantser deels negeert" } },
});
// Basisklasse per held: de verhaal-arte + de zes gewone artes van het type. Daarna opnieuw de evolutieklassen bouwen (met de verhaal-arte erin).
Object.keys(CASTRA_HERO_SIG).forEach(id=>{
  const d = CASTRA_HERO_DATA[id]; if(!d) return;
  const base = CASTRA_SKILLS[CASTRA_HERO_CLASS[(d._b||d).type]] || [];
  CASTRA_SKILLS[id+"_base"] = [ { ...CASTRA_HERO_SIG[id], signature:true } ].concat(base);
  d.cls = id+"_base";
  castraHeroEvoRegisterClasses(id);
});
// Woordenboekje voor de nieuwe quests (alleen woorden die nog niet in CASTRA_GLOSS staan).
(function(add){ Object.keys(add).forEach(k=>{ if(!CASTRA_GLOSS[k]) CASTRA_GLOSS[k] = add[k]; }); })({
  "alae":"vleugels", "alas":"vleugels (4e naamval)", "albus":"wit", "album":"wit", "ancora":"anker", "ancoram":"anker (4e naamval)", "argus":"de Argo", "ariadnae":"van Ariadne", "arma":"wapens",
  "bellicum":"van de oorlog, strijd-", "bellicus":"van de oorlog, strijd-", "bipennem":"strijdbijl (4e naamval)", "bipennis":"strijdbijl", "calcei":"sandalen", "calceos":"sandalen (4e naamval)",
  "clara":"duidelijk", "clava":"knots", "clavam":"knots (4e naamval)", "currum":"strijdwagen (4e naamval)", "dianae":"van Diana", "exercitum":"leger (4e naamval)", "exercitus":"leger",
  "hasta":"speer", "hastam":"speer (4e naamval)", "hydrae":"van de Hydra", "ictum":"slag (4e naamval)", "laureae":"van laurier", "leonis":"van de leeuw", "lituum":"augurstaf (4e naamval)",
  "lituus":"augurstaf", "minotauri":"van de Minotaurus", "novae":"nieuwe", "pelii":"van Peleus", "pellem":"huid (4e naamval)", "pomum":"appel", "pugio":"dolk", "pugionem":"dolk (4e naamval)",
  "regis":"van de koning", "sceptrum":"scepter", "scutum":"schild", "secreta":"geheime", "secretam":"geheime", "securim":"bijl (4e naamval)", "securis":"bijl", "signum":"veldteken",
  "speculum":"spiegel", "troianum":"Trojaans", "umbrae":"van de schaduw" });

// Heldenmenu en evolutie gebruiken de heldendata, dus meteen opnieuw toepassen op reeds geladen helden.
try{ if(typeof castraHeroEvoApplyAll==="function") castraHeroEvoApplyAll(); }catch(e){}
