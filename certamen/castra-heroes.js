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
  capBase:10, capPerStep:10, fidesStep:25, maxLvl:50, xpPerLvl:3,   // zelfde levelschaal als soldaten; cap groeit met fides (10 → 50)
  fidesPerTalk:10, talkBase:2,            // gesprekken per dag = talkBase + heroum-level
  bonusBase:20, bonusPerFides:0.2, affinityMult:1.5,
  statGrowthPct:2.5, heroMult:1.5,         // +2,5% per level (zoals soldaten); heroMult: een held is een unieke topeenheid (op level 50 ≈ tier 4)
  assignable:["praetorium","lignatio","metallum","campus"],
};

/* ketenstappen: kill (n vijanden in terrein), win (proelium-missie), persuade (keuzevraag) */
const CASTRA_HERO_DATA = {
  aeneas: {
    nm:"Aeneas", region:"latium", type:"inf", affinity:"praetorium", always:true, world:{ x:26, y:22, dir:"right" },
    base:{ vita:64, impetus:13, tutela:12, celeritas:6, ambitus:3 },
    look:{ huid:"getint", haar:"kort", haarkleur:"bruin", baard:"baard", armor:"ceremonieel", cape:"lang", capekleur:"rood", helm:"geen", schild:"geen", wapen:"zwaard" },
    chain:[
      { kind:"kill", terrain:"silva", need:3,
        ask:{ la:"Salve, hospes {naam}! Aeneas sum. Hostes in silva vexant. Tres hostes in silva vince, et auxilium meum habebis.", nl:"Gegroet, gast {naam}! Ik ben Aeneas. Vijanden in het bos zijn lastig. Versla drie vijanden in het bos, en je krijgt mijn hulp." },
        hud:{ la:"Hostes in silva vince!", nl:"Versla vijanden in het bos!" },
        done:{ la:"Optime! Tres hostes vicisti.", nl:"Uitstekend! Je hebt drie vijanden verslagen." } },
      { kind:"win", mission:"m1",
        ask:{ la:"Bene! Nunc castra defende. Proelium primum vince.", nl:"Goed! Verdedig nu het kamp. Win het eerste gevecht." },
        hud:{ la:"Proelium primum vince!", nl:"Win het eerste gevecht!" },
        done:{ la:"Castra defendisti! Gratias tibi ago.", nl:"Je hebt het kamp verdedigd! Ik dank je." } },
      { kind:"persuade",
        ask:{ la:"Cur tecum veniam, dux {naam}?", nl:"Waarom zou ik met je meegaan, leider {naam}?" },
        opts:[ { la:"Quia amicos servo et castra defendo.", nl:"Omdat ik vrienden bescherm en het kamp verdedig.", ok:true },
               { la:"Quia pecuniam amo.", nl:"Omdat ik van geld houd." },
               { la:"Quia pugnare nolo.", nl:"Omdat ik niet wil vechten." } ],
        join:{ la:"Tecum venio, dux {naam}!", nl:"Ik ga met je mee, leider {naam}!" } },
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
    nm:"Romulus", region:"latium", type:"inf", affinity:"praetorium", world:{ x:28, y:10, dir:"right" },
    base:{ vita:58, impetus:15, tutela:10, celeritas:7, ambitus:3 },
    look:{ huid:"licht", haar:"wild", haarkleur:"zwart", baard:"geen", armor:"ceremonieel", cape:"kort", capekleur:"rood", helm:"geen", schild:"geen", wapen:"zwaard" },
    chain:[
      { kind:"kill", terrain:"campus", need:4,
        ask:{ la:"Salve, dux {naam}! Romulus sum. Urbem novam condo. Quattuor hostes in campo vince, et mihi auxilio eris.", nl:"Gegroet, leider {naam}! Ik ben Romulus. Ik sticht een nieuwe stad. Versla vier vijanden op het veld en je zult mij helpen." },
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
        join:{ la:"Tecum venio, dux {naam}!", nl:"Ik ga met je mee, leider {naam}!" } },
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
    nm:"Horatius Cocles", region:"latium", type:"inf", affinity:"campus", world:{ x:52, y:22, dir:"down" },
    base:{ vita:70, impetus:12, tutela:15, celeritas:5, ambitus:2 },
    look:{ huid:"olijf", haar:"kort", haarkleur:"zwart", baard:"snor", armor:"middel", cape:"kort", capekleur:"rood", helm:"open", schild:"geen", wapen:"zwaard" },
    chain:[
      { kind:"kill", terrain:"tiberis", need:3,
        ask:{ la:"Salve, dux {naam}! Horatius sum. Hostes ad Tiberim veniunt. Tres hostes ad Tiberim vince.", nl:"Gegroet, leider {naam}! Ik ben Horatius. Vijanden komen naar de Tiber. Versla drie vijanden bij de Tiber." },
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
        join:{ la:"Tecum venio, dux {naam}!", nl:"Ik ga met je mee, leider {naam}!" } },
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


/* ---------- compacte bouwstenen voor de overige helden ---------- */
const _K = (region,terrain,need,ask,hud,done)=>({ kind:"kill", region, terrain, need, ask:{la:ask[0],nl:ask[1]}, hud:{la:hud[0],nl:hud[1]}, done:{la:done[0],nl:done[1]} });
const _W = (mission,ask,hud,done)=>({ kind:"win", mission, ask:{la:ask[0],nl:ask[1]}, hud:{la:hud[0],nl:hud[1]}, done:{la:done[0],nl:done[1]} });
const _P = (ask,good,b1,b2)=>({ kind:"persuade", ask:{la:ask[0],nl:ask[1]},
  opts:[ {la:good[0],nl:good[1],ok:true}, {la:b1[0],nl:b1[1]}, {la:b2[0],nl:b2[1]} ], join:{ la:"Tecum venio, dux {naam}!", nl:"Ik ga met je mee, leider {naam}!" } });
const _T = (t,q,good,b1,b2)=>({ la:t[0], nl:t[1], q:{ la:q[0], nl:q[1], opts:[ {la:good[0],nl:good[1],ok:true}, {la:b1[0],nl:b1[1]}, {la:b2[0],nl:b2[1]} ] } });
const _look = (o)=>({ huid:"licht", haar:"kort", haarkleur:"bruin", baard:"geen", armor:"middel", cape:"geen", capekleur:"rood", helm:"geen", schild:"geen", wapen:"zwaard", ...o });
const _WIN_M1 = ["Proelium primum vince.","Win het eerste gevecht."];

Object.assign(CASTRA_HERO_DATA, {
  /* ----- Latium ----- */
  cloelia: { nm:"Cloelia", region:"latium", type:"cav", affinity:"lignatio", world:{ x:48, y:32, dir:"left" },
    base:{ vita:48, impetus:14, tutela:7, celeritas:11, ambitus:3 },
    look:_look({ huid:"licht", haar:"vlecht", haarkleur:"bruin", armor:"robe", cape:"kort", capekleur:"blauw" }),
    chain:[
      _K("latium","tiberis",3, ["Salve, dux {naam}! Cloelia sum. Obses fui, sed ex castris fugi. Tres hostes ad Tiberim vince.","Gegroet, leider {naam}! Ik ben Cloelia. Ik was gijzelaar, maar ik ben uit het kamp gevlucht. Versla drie vijanden bij de Tiber."], ["Hostes ad Tiberim vince!","Versla vijanden bij de Tiber!"], ["Optime! Tiberim defendisti.","Uitstekend! Je hebt de Tiber verdedigd."]),
      _W("m3", ["Bene! Nunc Ardeam oppugna. Proelium tertium vince.","Goed! Val nu Ardea aan. Win het derde gevecht."], ["Proelium tertium vince!","Win het derde gevecht!"], ["Ardeam vicisti! Gratias tibi ago.","Je hebt Ardea verslagen! Ik dank je."]),
      _P(["Per Tiberim equo transeo. Tu quoque audax es?","Ik steek de Tiber te paard over. Ben jij ook dapper?"], ["Ita, nihil timeo.","Ja, ik ben nergens bang voor."], ["Non, omnia timeo.","Nee, ik ben overal bang voor."], ["Domi maneo.","Ik blijf thuis."]),
    ],
    talks:[
      _T(["Obses apud hostes eram. Nocte fugio.","Ik was gijzelaar bij de vijanden. 's Nachts vlucht ik."], ["Quando Cloelia fugit?","Wanneer vlucht Cloelia?"], ["Nocte.","'s Nachts."], ["Mane.","'s Ochtends."], ["Vespere.","'s Avonds."]),
      _T(["Equum capio et Tiberim transeo.","Ik pak een paard en steek de Tiber over."], ["Quid Cloelia capit?","Wat pakt Cloelia?"], ["Equum.","Een paard."], ["Gladium.","Een zwaard."], ["Navem.","Een schip."]),
      _T(["Romani me laudant. Statua mea in via est.","De Romeinen prijzen mij. Mijn standbeeld staat aan de weg."], ["Quis Cloeliam laudat?","Wie prijst Cloelia?"], ["Romani.","De Romeinen."], ["Hostes.","De vijanden."], ["Nemo.","Niemand."]),
    ] },
  mucius: { nm:"Mucius Scaevola", region:"latium", type:"inf", affinity:"metallum", world:{ x:40, y:14, dir:"down" },
    base:{ vita:62, impetus:15, tutela:11, celeritas:6, ambitus:2 },
    look:_look({ huid:"getint", haar:"kort", haarkleur:"zwart", baard:"sikensnor", armor:"middel", cape:"lang", capekleur:"groen", helm:"bandana" }),
    chain:[
      _K("latium","via",3, ["Salve, dux {naam}! Mucius sum. Hostes in via sunt. Tres hostes in via vince.","Gegroet, leider {naam}! Ik ben Mucius. Er zijn vijanden op de weg. Versla drie vijanden op de weg."], ["Hostes in via vince!","Versla vijanden op de weg!"], ["Optime! Viam purgavisti.","Uitstekend! Je hebt de weg schoongemaakt."]),
      _W("m3", ["Bene! Nunc Ardeam oppugna. Proelium tertium vince.","Goed! Val nu Ardea aan. Win het derde gevecht."], ["Proelium tertium vince!","Win het derde gevecht!"], ["Ardeam vicisti! Gratias tibi ago.","Je hebt Ardea verslagen! Ik dank je."]),
      _P(["Dextram in igne teneo. Num dolorem timeo?","Ik houd mijn rechterhand in het vuur. Ben ik soms bang voor pijn?"], ["Non timeo, nam patriam amo.","Nee, want ik hou van mijn vaderland."], ["Ita, dolorem timeo.","Ja, ik ben bang voor pijn."], ["Ignem amo.","Ik hou van vuur."]),
    ],
    talks:[
      _T(["Ad regem hostium eo. Eum necare volo.","Ik ga naar de koning van de vijand. Ik wil hem doden."], ["Ad quem Mucius it?","Naar wie gaat Mucius?"], ["Ad regem.","Naar de koning."], ["Ad matrem.","Naar zijn moeder."], ["Ad amicum.","Naar een vriend."]),
      _T(["Dextram in ignem pono.","Ik leg mijn rechterhand in het vuur."], ["Quid Mucius in ignem ponit?","Wat legt Mucius in het vuur?"], ["Dextram.","Zijn rechterhand."], ["Librum.","Een boek."], ["Pedem.","Zijn voet."]),
      _T(["Rex me dimittit. Nomen meum Scaevola est.","De koning laat mij gaan. Mijn naam is Scaevola."], ["Quis Mucium dimittit?","Wie laat Mucius gaan?"], ["Rex.","De koning."], ["Mater.","Zijn moeder."], ["Dux.","De leider."]),
    ] },
  camilla: { nm:"Camilla", region:"latium", type:"rng", affinity:"lignatio", world:{ x:12, y:18, dir:"right" },
    base:{ vita:44, impetus:15, tutela:6, celeritas:12, ambitus:7 },
    look:_look({ huid:"olijf", haar:"lang", haarkleur:"zwart", armor:"vodden", cape:"lang", capekleur:"groen", helm:"bandana" }),
    chain:[
      _K("latium","silva",4, ["Salve, dux {naam}! Camilla sum. In silva habito. Quattuor hostes in silva vince.","Gegroet, leider {naam}! Ik ben Camilla. Ik woon in het bos. Versla vier vijanden in het bos."], ["Hostes in silva vince!","Versla vijanden in het bos!"], ["Optime! Silvam servavisti.","Uitstekend! Je hebt het bos gered."]),
      _W("m3", ["Bene! Nunc Ardeam oppugna. Proelium tertium vince.","Goed! Val nu Ardea aan. Win het derde gevecht."], ["Proelium tertium vince!","Win het derde gevecht!"], ["Ardeam vicisti! Gratias tibi ago.","Je hebt Ardea verslagen! Ik dank je."]),
      _P(["Celeriter curro et sagittas mitto. Quid tu facis?","Ik ren snel en schiet pijlen. Wat doe jij?"], ["Celeriter curro et hostes pugno.","Ik ren snel en vecht tegen de vijanden."], ["Lente ambulo.","Ik loop langzaam."], ["In casa dormio.","Ik slaap in een huisje."]),
    ],
    talks:[
      _T(["Silvas amo. Cum equis curro.","Ik hou van de bossen. Ik ren met de paarden."], ["Quid Camilla amat?","Waar houdt Camilla van?"], ["Silvas.","Van de bossen."], ["Naves.","Van schepen."], ["Urbem.","Van de stad."]),
      _T(["Sagittas mitto et hostes vinco.","Ik schiet pijlen en versla de vijanden."], ["Quid Camilla mittit?","Wat schiet Camilla?"], ["Sagittas.","Pijlen."], ["Libros.","Boeken."], ["Aquam.","Water."]),
      _T(["Pater me in silva nutrivit.","Mijn vader heeft mij in het bos grootgebracht."], ["Ubi pater Camillam nutrivit?","Waar bracht de vader Camilla groot?"], ["In silva.","In het bos."], ["In urbe.","In de stad."], ["In mari.","In de zee."]),
    ] },

  /* ----- Graecia ----- */
  hercules: { nm:"Hercules", region:"graecia", type:"inf", affinity:"campus", world:{ x:16, y:4, dir:"down" },
    base:{ vita:90, impetus:19, tutela:14, celeritas:6, ambitus:2 },
    look:_look({ huid:"brons", haar:"wild", haarkleur:"bruin", baard:"baard", armor:"vodden", cape:"lang", capekleur:"oranje" }),
    chain:[
      _K("graecia","mons",4, ["Salve, dux {naam}! Hercules sum. Leones in monte sunt. Quattuor hostes in monte vince.","Gegroet, leider {naam}! Ik ben Hercules. Er zijn leeuwen op de berg. Versla vier vijanden op de berg."], ["Hostes in monte vince!","Versla vijanden op de berg!"], ["Optime! Montem purgavisti.","Uitstekend! Je hebt de berg schoongemaakt."]),
      _W("g1", ["Bene! Nunc primum laborem facimus. Proelium vince.","Goed! Nu doen we de eerste labor. Win het gevecht."], ["Laborem primum vince!","Win de eerste labor!"], ["Laborem confecisti! Gratias tibi ago.","Je hebt de labor volbracht! Ik dank je."]),
      _P(["Labores multos facio. Tu quoque laboras?","Ik doe veel opdrachten. Werk jij ook hard?"], ["Ita, fortiter laboro.","Ja, ik werk dapper."], ["Non, otium amo.","Nee, ik hou van rust."], ["Numquam laboro.","Ik werk nooit."]),
    ],
    talks:[
      _T(["Leonem Nemeaeum vinco. Pellis eius me tegit.","Ik versla de Nemeïsche leeuw. Zijn huid bedekt mij."], ["Quid Hercules vincit?","Wat verslaat Hercules?"], ["Leonem.","Een leeuw."], ["Navem.","Een schip."], ["Murum.","Een muur."]),
      _T(["Duodecim labores facio.","Ik voer twaalf opdrachten uit."], ["Quot labores Hercules facit?","Hoeveel opdrachten voert Hercules uit?"], ["Duodecim.","Twaalf."], ["Tres.","Drie."], ["Centum.","Honderd."]),
      _T(["Hydram in palude vinco.","Ik versla de Hydra in het moeras."], ["Ubi est Hydra?","Waar is de Hydra?"], ["In palude.","In het moeras."], ["In caelo.","In de lucht."], ["In urbe.","In de stad."]),
    ] },
  perseus: { nm:"Perseus", region:"graecia", type:"cav", affinity:"metallum", world:{ x:24, y:12, dir:"left" },
    base:{ vita:56, impetus:18, tutela:8, celeritas:13, ambitus:4 },
    look:_look({ huid:"licht", haar:"hanekam", haarkleur:"blond", armor:"ceremonieel", cape:"engelenvleugels", helm:"geen" }),
    chain:[
      _K("graecia","litus",3, ["Salve, dux {naam}! Perseus sum. Gorgones prope litus habitant. Tres hostes ad litus vince.","Gegroet, leider {naam}! Ik ben Perseus. De Gorgonen wonen bij de kust. Versla drie vijanden bij de kust."], ["Hostes ad litus vince!","Versla vijanden bij de kust!"], ["Optime! Litus servavisti.","Uitstekend! Je hebt de kust gered."]),
      _W("g1", ["Bene! Nunc Medusam oppugnamus. Proelium primum vince.","Goed! Nu gaan we Medusa aanvallen. Win het eerste gevecht."], ["Proelium vince!","Win het gevecht!"], ["Proelium vicisti! Gratias tibi ago.","Je hebt het gevecht gewonnen! Ik dank je."]),
      _P(["Caput Medusae portare possum. Tu me iuvas?","Ik kan het hoofd van Medusa dragen. Help jij mij?"], ["Ita, te libenter iuvo.","Ja, ik help je graag."], ["Non, Medusam timeo!","Nee, ik ben bang voor Medusa!"], ["Nihil audio.","Ik hoor niets."]),
    ],
    talks:[
      _T(["Medusa serpentes in capite habet.","Medusa heeft slangen op haar hoofd."], ["Quid Medusa in capite habet?","Wat heeft Medusa op haar hoofd?"], ["Serpentes.","Slangen."], ["Flores.","Bloemen."], ["Aurum.","Goud."]),
      _T(["Talaria alata habeo. Per aerem volo.","Ik heb gevleugelde sandalen. Ik vlieg door de lucht."], ["Quid Perseus habet?","Wat heeft Perseus?"], ["Talaria alata.","Gevleugelde sandalen."], ["Navem magnam.","Een groot schip."], ["Equum album.","Een wit paard."]),
      _T(["Andromedam servo et Medusam vinco.","Ik red Andromeda en versla Medusa."], ["Quam Perseus servat?","Wie redt Perseus?"], ["Andromedam.","Andromeda."], ["Helenam.","Helena."], ["Cloeliam.","Cloelia."]),
    ] },
  theseus: { nm:"Theseus", region:"graecia", type:"inf", affinity:"praetorium", world:{ x:19, y:12, dir:"down" },
    base:{ vita:72, impetus:16, tutela:12, celeritas:8, ambitus:3 },
    look:_look({ huid:"licht", haar:"middel", haarkleur:"bruin", baard:"geen", armor:"ceremonieel", cape:"kort", capekleur:"blauw", helm:"geen" }),
    chain:[
      _K("graecia","urbs",4, ["Salve, dux {naam}! Theseus sum. Minotaurus in labyrintho est. Quattuor hostes in urbe vince.","Gegroet, leider {naam}! Ik ben Theseus. De Minotaurus zit in het labyrint. Versla vier vijanden in de stad."], ["Hostes in urbe vince!","Versla vijanden in de stad!"], ["Optime! Urbem servavisti.","Uitstekend! Je hebt de stad gered."]),
      _W("g2", ["Bene! Nunc labyrinthum intramus. Proelium secundum vince.","Goed! Nu gaan we het labyrint in. Win het tweede gevecht."], ["Proelium secundum vince!","Win het tweede gevecht!"], ["Labyrinthum vicisti! Gratias tibi ago.","Je hebt het labyrint verslagen! Ik dank je."]),
      _P(["Minotaurum in labyrintho quaero. Tu mecum venis?","Ik zoek de Minotaurus in het labyrint. Ga jij met mij mee?"], ["Ita, te sequor et fratres servo.","Ja, ik volg je en ik red de broers."], ["Non, labyrinthum timeo.","Nee, ik ben bang voor het labyrint."], ["Minotaurus amicus meus est.","De Minotaurus is mijn vriend."]),
    ],
    talks:[
      _T(["Minotaurus in labyrintho habitat.","De Minotaurus woont in het labyrint."], ["Ubi Minotaurus habitat?","Waar woont de Minotaurus?"], ["In labyrintho.","In het labyrint."], ["In silva.","In het bos."], ["In mari.","In de zee."]),
      _T(["Ariadna mihi filum dat.","Ariadne geeft mij een draad."], ["Quid Ariadna dat?","Wat geeft Ariadne?"], ["Filum.","Een draad."], ["Gladium.","Een zwaard."], ["Pecuniam.","Geld."]),
      _T(["Minotaurum vinco et ex labyrintho exeo.","Ik versla de Minotaurus en ga uit het labyrint."], ["Quem Theseus vincit?","Wie verslaat Theseus?"], ["Minotaurum.","De Minotaurus."], ["Leonem.","De leeuw."], ["Hydram.","De Hydra."]),
    ] },
  atalanta: { nm:"Atalanta", region:"graecia", type:"rng", affinity:"lignatio", world:{ x:7, y:15, dir:"right" },
    base:{ vita:46, impetus:17, tutela:6, celeritas:14, ambitus:7 },
    look:_look({ huid:"olijf", haar:"vlecht", haarkleur:"bruin", armor:"vodden", cape:"kort", capekleur:"groen", helm:"bandana" }),
    chain:[
      _K("graecia","olea",4, ["Salve, dux {naam}! Atalanta sum. In oleis venor. Quattuor hostes in oleis vince.","Gegroet, leider {naam}! Ik ben Atalanta. Ik jaag in de olijfgaarden. Versla vier vijanden in de olijfgaarden."], ["Hostes in oleis vince!","Versla vijanden in de olijfgaarden!"], ["Optime! Olea servavisti.","Uitstekend! Je hebt de olijfgaarden gered."]),
      _W("g1", ["Bene! Nunc aprum quaerimus. Proelium vince.","Goed! Nu zoeken we het everzwijn. Win het gevecht."], ["Proelium vince!","Win het gevecht!"], ["Proelium vicisti! Gratias tibi ago.","Je hebt het gevecht gewonnen! Ik dank je."]),
      _P(["Celerrima sum. Tu celeriter curris?","Ik ben de snelste. Ren jij snel?"], ["Celeriter curro, sed te non vinco.","Ik ren snel, maar ik verslaag jou niet."], ["Numquam curro.","Ik ren nooit."], ["Lente curro et dormio.","Ik ren langzaam en slaap."]),
    ],
    talks:[
      _T(["Aprum Calydonium sagittis vinco.","Ik versla het Calydonische everzwijn met pijlen."], ["Quid Atalanta vincit?","Wat verslaat Atalanta?"], ["Aprum.","Een everzwijn."], ["Leonem.","Een leeuw."], ["Draconem.","Een draak."]),
      _T(["In cursu omnes viros vinco.","In het hardlopen versla ik alle mannen."], ["Quis celerrima est?","Wie is de snelste?"], ["Atalanta.","Atalanta."], ["Hercules.","Hercules."], ["Iason.","Jason."]),
      _T(["Mala aurea me tardant.","Gouden appels houden mij op."], ["Quid Atalantam tardat?","Wat houdt Atalanta op?"], ["Mala aurea.","Gouden appels."], ["Aqua.","Water."], ["Nix.","Sneeuw."]),
    ] },
  iason: { nm:"Iason", region:"graecia", type:"inf", affinity:"lignatio", world:{ x:23, y:19, dir:"up" },
    base:{ vita:66, impetus:15, tutela:11, celeritas:8, ambitus:3 },
    look:_look({ huid:"getint", haar:"kort", haarkleur:"blond", baard:"geen", armor:"middel", cape:"kort", capekleur:"goud", helm:"open" }),
    chain:[
      _K("graecia","litus",3, ["Salve, dux {naam}! Iason sum. Navem Argo aedifico. Tres hostes ad litus vince.","Gegroet, leider {naam}! Ik ben Jason. Ik bouw het schip Argo. Versla drie vijanden bij de kust."], ["Hostes ad litus vince!","Versla vijanden bij de kust!"], ["Optime! Litus liberavisti.","Uitstekend! Je hebt de kust bevrijd."]),
      _W("g2", ["Bene! Nunc vellus aureum quaerimus. Proelium secundum vince.","Goed! Nu zoeken we het gouden vlies. Win het tweede gevecht."], ["Proelium secundum vince!","Win het tweede gevecht!"], ["Proelium vicisti! Gratias tibi ago.","Je hebt het gevecht gewonnen! Ik dank je."]),
      _P(["Velleris aurei causa navigo. Habesne navem?","Ik zeil voor het gouden vlies. Heb jij een schip?"], ["Habeo navem et nautas fortes.","Ik heb een schip en dappere zeelieden."], ["Navem non habeo, sed timeo.","Ik heb geen schip, maar ik ben bang."], ["Aurum non amo.","Ik hou niet van goud."]),
    ],
    talks:[
      _T(["Navem Argo aedifico.","Ik bouw het schip Argo."], ["Quam navem Iason aedificat?","Welk schip bouwt Jason?"], ["Argo.","De Argo."], ["Aquilam.","De Adelaar."], ["Lunam.","De Maan."]),
      _T(["Vellus aureum in Colchide est.","Het gouden vlies is in Colchis."], ["Quid in Colchide est?","Wat is er in Colchis?"], ["Vellus aureum.","Het gouden vlies."], ["Urbs magna.","Een grote stad."], ["Murus altus.","Een hoge muur."]),
      _T(["Medea me iuvat. Draconem dormire facit.","Medea helpt mij. Ze laat de draak slapen."], ["Quis Iasonem iuvat?","Wie helpt Jason?"], ["Medea.","Medea."], ["Circe.","Circe."], ["Hera.","Hera."]),
    ] },

  medea: { nm:"Medea", region:"graecia", type:"sup", affinity:"praetorium", world:{ x:36, y:13, dir:"down" },
    base:{ vita:52, impetus:12, tutela:9, celeritas:9, ambitus:6 },
    look:_look({ huid:"olijf", haar:"lang", haarkleur:"zwart", armor:"robe", cape:"lang", capekleur:"paars", helm:"geen", wapen:"staf" }),
    chain:[
      _K("graecia","olea",3, ["Salve, dux {naam}! Medea sum. Herbas quaero. Tres hostes in olea vince.","Gegroet, leider {naam}! Ik ben Medea. Ik zoek kruiden. Versla drie vijanden in de olijfgaard."], ["Hostes in olea vince!","Versla vijanden in de olijfgaard!"], ["Optime! Olea libera est.","Uitstekend! De olijfgaard is vrij."]),
      _W("g2", ["Bene! Nunc Iasoni auxilium do. Proelium secundum vince.","Goed! Nu help ik Jason. Win het tweede gevecht."], ["Proelium secundum vince!","Win het tweede gevecht!"], ["Proelium vicisti! Gratias tibi ago.","Je hebt het gevecht gewonnen! Ik dank je."]),
      _P(["Cur tecum veniam, dux {naam}?","Waarom zou ik met je meegaan, leider {naam}?"], ["Quia amicos servo.","Omdat ik vrienden bescherm."], ["Quia venena amo.","Omdat ik van gif houd."], ["Quia fugere volo.","Omdat ik wil vluchten."]),
    ],
    talks:[
      _T(["Herbas in silva lego.","Ik verzamel kruiden in het bos."], ["Quid Medea legit?","Wat verzamelt Medea?"], ["Herbas.","Kruiden."], ["Saxa.","Stenen."], ["Flores.","Bloemen."]),
      _T(["Hecate dea mea est.","Hecate is mijn godin."], ["Quae dea Medeae est?","Wie is de godin van Medea?"], ["Hecate.","Hecate."], ["Venus.","Venus."], ["Minerva.","Minerva."]),
      _T(["Draconem dormire facio. Iason vellus capit.","Ik laat de draak slapen. Jason pakt het vlies."], ["Quis draconem dormire facit?","Wie laat de draak slapen?"], ["Medea.","Medea."], ["Iason.","Jason."], ["Hercules.","Hercules."]),
    ] },
  daedalus: { nm:"Daedalus", region:"graecia", type:"rng", affinity:"metallum", cave:"fetch_graecia",   // dezelfde persoon als de bewoner van het labyrint
    base:{ vita:54, impetus:14, tutela:8, celeritas:7, ambitus:7 },
    look:_look({ huid:"getint", haar:"kort", haarkleur:"bruin", baard:"baard", armor:"licht", cape:"kort", capekleur:"oranje", helm:"geen", wapen:"knuppel" }),
    chain:[
      _K("graecia","litus",3, ["Salve, dux {naam}! Daedalus sum. Machinas aedifico. Tres hostes ad litus vince.","Gegroet, leider {naam}! Ik ben Daedalus. Ik bouw machines. Versla drie vijanden bij de kust."], ["Hostes ad litus vince!","Versla vijanden bij de kust!"], ["Optime! Litus liberavisti.","Uitstekend! Je hebt de kust bevrijd."]),
      _W("g1", ["Bene! Nunc labyrinthum aedifico. Proelium primum vince.","Goed! Nu bouw ik het labyrint. Win het eerste gevecht."], ["Proelium primum vince!","Win het eerste gevecht!"], ["Proelium vicisti! Gratias tibi ago.","Je hebt het gevecht gewonnen! Ik dank je."]),
      _P(["Cur tecum veniam, dux {naam}?","Waarom zou ik met je meegaan, leider {naam}?"], ["Quia ingenium tuum magnum est.","Omdat je vernuft groot is."], ["Quia carcerem amo.","Omdat ik van de gevangenis houd."], ["Quia machinas timeo.","Omdat ik bang ben voor machines."]),
    ],
    talks:[
      _T(["Labyrinthum Minoi aedifico.","Ik bouw het labyrint voor Minos."], ["Quis labyrinthum aedificat?","Wie bouwt het labyrint?"], ["Daedalus.","Daedalus."], ["Theseus.","Theseus."], ["Minos.","Minos."]),
      _T(["Filium meum, Icarum, amo.","Ik hou van mijn zoon Icarus."], ["Quem Daedalus amat?","Van wie houdt Daedalus?"], ["Icarum.","Icarus."], ["Minotaurum.","De Minotaurus."], ["Minoem.","Minos."]),
      _T(["Alas ex pennis et cera facio.","Ik maak vleugels van veren en was."], ["Ex qua re alae sunt?","Waarvan zijn de vleugels gemaakt?"], ["Ex pennis et cera.","Van veren en was."], ["Ex ferro.","Van ijzer."], ["Ex ligno.","Van hout."]),
    ] },

  prometheus: { nm:"Prometheus", region:"graecia", type:"inf", affinity:"metallum", world:{ x:50, y:28, dir:"left" },
    base:{ vita:86, impetus:17, tutela:13, celeritas:6, ambitus:3 },
    look:_look({ huid:"brons", haar:"wild", haarkleur:"zwart", baard:"baard", armor:"vodden", cape:"geen", wapen:"knuppel" }),
    chain:[
      _K("graecia","litus",3, ["Salve, dux {naam}! Prometheus sum. Ignem hominibus dedi. Tres hostes ad litus vince.","Gegroet, leider {naam}! Ik ben Prometheus. Ik gaf de mensen het vuur. Versla drie vijanden bij de kust."], ["Hostes ad litus vince!","Versla vijanden bij de kust!"], ["Optime! Litus liberavisti.","Uitstekend! Je hebt de kust bevrijd."]),
      _W("g1", ["Bene! Nunc Iovi resisto. Proelium primum vince.","Goed! Nu verzet ik me tegen Jupiter. Win het eerste gevecht."], ["Proelium primum vince!","Win het eerste gevecht!"], ["Proelium vicisti! Gratias tibi ago.","Je hebt het gevecht gewonnen! Ik dank je."]),
      _P(["Iuppiter me punit. Cur tecum veniam?","Jupiter straft mij. Waarom zou ik met je meegaan?"], ["Quia homines iuvo.","Omdat ik mensen help."], ["Quia Iovem timeo.","Omdat ik bang ben voor Jupiter."], ["Quia ignem odi.","Omdat ik het vuur haat."]),
    ],
    talks:[
      _T(["Ignem de caelo furatus sum.","Ik heb het vuur uit de hemel gestolen."], ["Quid Prometheus furatus est?","Wat heeft Prometheus gestolen?"], ["Ignem.","Het vuur."], ["Aurum.","Goud."], ["Equum.","Een paard."]),
      _T(["Homines ex luto feci.","Ik heb de mensen van klei gemaakt."], ["Ex qua re homines sunt?","Waarvan zijn de mensen gemaakt?"], ["Ex luto.","Van klei."], ["Ex auro.","Van goud."], ["Ex aqua.","Van water."]),
      _T(["Aquila iecur meum edit. Hercules me liberat.","Een adelaar eet mijn lever. Hercules bevrijdt mij."], ["Quis Prometheum liberat?","Wie bevrijdt Prometheus?"], ["Hercules.","Hercules."], ["Iason.","Jason."], ["Achilles.","Achilles."]),
    ] },

  /* ----- Troia ----- */
  achilles: { nm:"Achilles", region:"troia", type:"inf", affinity:"campus", world:{ x:20, y:18, dir:"up" },
    base:{ vita:92, impetus:18, tutela:14, celeritas:9, ambitus:3 },   // was 100/22/15: als prestigevorm schade van 2,4x een tier 4-soldaat, nu ±1,7x (mediaan van de helden ±1,4x)
    look:_look({ huid:"licht", haar:"middel", haarkleur:"blond", baard:"geen", armor:"ceremonieel", cape:"kort", capekleur:"rood", helm:"open" }),
    chain:[
      _K("troia","campus",4, ["Salve, dux {naam}! Achilles sum. Troiani ante muros pugnant. Quattuor hostes in campo vince.","Gegroet, leider {naam}! Ik ben Achilles. De Trojanen vechten voor de muren. Versla vier vijanden op het veld."], ["Hostes in campo vince!","Versla vijanden op het veld!"], ["Optime! Campum purgavisti.","Uitstekend! Je hebt het veld schoongemaakt."]),
      _W("t1", ["Bene! Nunc muros Troiae oppugna. Proelium vince.","Goed! Val nu de muren van Troje aan. Win het gevecht."], ["Proelium vince!","Win het gevecht!"], ["Muros vicisti! Gratias tibi ago.","Je hebt de muren verslagen! Ik dank je."]),
      _P(["Ira mea magna est. Cur pugnas?","Mijn woede is groot. Waarom vecht jij?"], ["Pro amicis pugno.","Ik vecht voor mijn vrienden."], ["Pro pecunia pugno.","Ik vecht voor geld."], ["Non pugno.","Ik vecht niet."]),
    ],
    talks:[
      _T(["Mater mea dea est. Thetis vocatur.","Mijn moeder is een godin. Ze heet Thetis."], ["Quae dea mater Achillis est?","Welke godin is de moeder van Achilles?"], ["Thetis.","Thetis."], ["Athena.","Athena."], ["Venus.","Venus."]),
      _T(["Talus meus infirmus est.","Mijn hiel is zwak."], ["Quid in Achille infirmum est?","Wat is er zwak aan Achilles?"], ["Talus.","De hiel."], ["Caput.","Het hoofd."], ["Manus.","De hand."]),
      _T(["Patroclus amicus meus erat.","Patroclus was mijn vriend."], ["Quis Achillis amicus est?","Wie is de vriend van Achilles?"], ["Patroclus.","Patroclus."], ["Hector.","Hector."], ["Priamus.","Priamus."]),
    ] },
  hector: { nm:"Hector", region:"troia", type:"inf", affinity:"praetorium", world:{ x:20, y:6, dir:"down" },
    base:{ vita:88, impetus:19, tutela:16, celeritas:8, ambitus:3 },
    look:_look({ huid:"getint", haar:"kort", haarkleur:"zwart", baard:"baard", armor:"middel", cape:"lang", capekleur:"blauw", helm:"open" }),
    chain:[
      _K("troia","muros",4, ["Salve, dux {naam}! Hector sum. Troiam defendo. Quattuor hostes ante muros vince.","Gegroet, leider {naam}! Ik ben Hector. Ik verdedig Troje. Versla vier vijanden voor de muren."], ["Hostes ante muros vince!","Versla vijanden voor de muren!"], ["Optime! Muros servavisti.","Uitstekend! Je hebt de muren gered."]),
      _W("t1", ["Bene! Nunc muros Troiae defende. Proelium vince.","Goed! Verdedig nu de muren van Troje. Win het gevecht."], ["Proelium vince!","Win het gevecht!"], ["Muros defendisti! Gratias tibi ago.","Je hebt de muren verdedigd! Ik dank je."]),
      _P(["Pro patria pugno. Tu quoque patriam amas?","Ik vecht voor mijn vaderland. Hou jij ook van jouw vaderland?"], ["Ita, patriam et familiam amo.","Ja, ik hou van mijn vaderland en mijn familie."], ["Non, patriam odi.","Nee, ik haat mijn vaderland."], ["Patria mihi nihil est.","Mijn vaderland betekent niets voor mij."]),
    ],
    talks:[
      _T(["Priamus pater meus est. Troiae rex est.","Priamus is mijn vader. Hij is de koning van Troje."], ["Quis Troiae rex est?","Wie is de koning van Troje?"], ["Priamus.","Priamus."], ["Agamemnon.","Agamemnon."], ["Achilles.","Achilles."]),
      _T(["Andromacha uxor mea est.","Andromache is mijn vrouw."], ["Quae uxor Hectoris est?","Wie is de vrouw van Hector?"], ["Andromacha.","Andromache."], ["Helena.","Helena."], ["Cassandra.","Cassandra."]),
      _T(["Ante muros cum Achille pugno.","Voor de muren vecht ik met Achilles."], ["Cum quo Hector pugnat?","Met wie vecht Hector?"], ["Cum Achille.","Met Achilles."], ["Cum Paride.","Met Paris."], ["Cum equo.","Met een paard."]),
    ] },
  ulixes: { nm:"Ulixes", region:"troia", type:"sup", affinity:"metallum", world:{ x:26, y:10, dir:"left" },
    base:{ vita:60, impetus:11, tutela:10, celeritas:9, ambitus:6 },
    look:_look({ huid:"olijf", haar:"kort", haarkleur:"bruin", baard:"baard", armor:"robe", cape:"kort", capekleur:"groen", helm:"standard" }),
    chain:[
      _K("troia","litus",3, ["Salve, dux {naam}! Ulixes sum. Naves Graecorum ad litus sunt. Tres hostes ad litus vince.","Gegroet, leider {naam}! Ik ben Odysseus. De schepen van de Grieken liggen aan de kust. Versla drie vijanden bij de kust."], ["Hostes ad litus vince!","Versla vijanden bij de kust!"], ["Optime! Naves servavisti.","Uitstekend! Je hebt de schepen gered."]),
      _W("t2", ["Bene! Nunc equum ligneum aedificamus. Proelium secundum vince.","Goed! Nu bouwen we het houten paard. Win het tweede gevecht."], ["Proelium secundum vince!","Win het tweede gevecht!"], ["Equum aedificavisti! Gratias tibi ago.","Je hebt het paard gebouwd! Ik dank je."]),
      _P(["Callidus sum. Consilium capio. Quis tecum consilium capit?","Ik ben sluw. Ik maak plannen. Wie maakt plannen met jou?"], ["Ego tecum consilium capio.","Ik maak met jou plannen."], ["Nemo mihi consilium dat.","Niemand geeft mij een plan."], ["Equum timeo.","Ik ben bang voor het paard."]),
    ],
    talks:[
      _T(["Equum ligneum aedifico. Milites in equo latent.","Ik bouw het houten paard. Soldaten verbergen zich in het paard."], ["Quid Ulixes aedificat?","Wat bouwt Odysseus?"], ["Equum ligneum.","Een houten paard."], ["Murum altum.","Een hoge muur."], ["Navem magnam.","Een groot schip."]),
      _T(["Domum redire volo. Penelope me exspectat.","Ik wil naar huis terugkeren. Penelope wacht op mij."], ["Quis Ulixem exspectat?","Wie wacht op Odysseus?"], ["Penelope.","Penelope."], ["Circe.","Circe."], ["Calypso.","Calypso."]),
      _T(["Polyphemus unum oculum habet.","Polyphemus heeft één oog."], ["Quot oculos Polyphemus habet?","Hoeveel ogen heeft Polyphemus?"], ["Unum.","Eén."], ["Duos.","Twee."], ["Tres.","Drie."]),
    ] },
  penthesilea: { nm:"Penthesilea", region:"troia", type:"rng", affinity:"campus", world:{ x:7, y:10, dir:"left" },
    base:{ vita:54, impetus:19, tutela:8, celeritas:12, ambitus:7 },
    look:_look({ huid:"licht", haar:"lang", haarkleur:"rood", armor:"middel", cape:"lang", capekleur:"paars", helm:"geen" }),
    chain:[
      _K("troia","scamander",3, ["Salve, dux {naam}! Penthesilea sum. Ad Scamandrum pugno. Tres hostes ad Scamandrum vince.","Gegroet, leider {naam}! Ik ben Penthesilea. Ik vecht bij de Scamander. Versla drie vijanden bij de Scamander."], ["Hostes ad Scamandrum vince!","Versla vijanden bij de Scamander!"], ["Optime! Scamandrum servavisti.","Uitstekend! Je hebt de Scamander gered."]),
      _W("t2", ["Bene! Nunc Troiam iuvamus. Proelium secundum vince.","Goed! Nu helpen we Troje. Win het tweede gevecht."], ["Proelium secundum vince!","Win het tweede gevecht!"], ["Troiam iuvisti! Gratias tibi ago.","Je hebt Troje geholpen! Ik dank je."]),
      _P(["Amazonum regina sum. Tu pro Troia pugnas?","Ik ben de koningin van de Amazones. Vecht jij voor Troje?"], ["Ita, pro Troia pugno.","Ja, ik vecht voor Troje."], ["Non, pro hostibus pugno.","Nee, ik vecht voor de vijanden."], ["Domum eo.","Ik ga naar huis."]),
    ],
    talks:[
      _T(["Amazones feminae fortes sunt.","De Amazones zijn dappere vrouwen."], ["Quae sunt Amazones?","Wie zijn de Amazones?"], ["Feminae fortes.","Dappere vrouwen."], ["Viri pigri.","Luie mannen."], ["Pueri parvi.","Kleine jongens."]),
      _T(["Arcum et sagittas habeo.","Ik heb een boog en pijlen."], ["Quid Penthesilea habet?","Wat heeft Penthesilea?"], ["Arcum.","Een boog."], ["Librum.","Een boek."], ["Lyram.","Een lier."]),
      _T(["Cum Achille pugno, sed vincor.","Ik vecht met Achilles, maar ik word verslagen."], ["Quis Penthesileam vincit?","Wie verslaat Penthesilea?"], ["Achilles.","Achilles."], ["Hector.","Hector."], ["Ulixes.","Odysseus."]),
    ] },

  cassandra: { nm:"Cassandra", region:"troia", type:"sup", affinity:"campus", cave:"fetch_troia",   // dezelfde persoon als de bewoner van de grot (geen eigen plek op de kaart)
    base:{ vita:50, impetus:10, tutela:9, celeritas:9, ambitus:6 },
    look:_look({ huid:"licht", haar:"lang", haarkleur:"bruin", armor:"robe", cape:"lang", capekleur:"blauw", helm:"geen", wapen:"staf" }),
    chain:[
      _K("troia","muros",3, ["Salve, dux {naam}! Cassandra sum. Periculum video. Tres hostes ante muros vince.","Gegroet, leider {naam}! Ik ben Cassandra. Ik zie gevaar. Versla drie vijanden voor de muren."], ["Hostes ante muros vince!","Versla vijanden voor de muren!"], ["Optime! Muri tuti sunt.","Uitstekend! De muren zijn veilig."]),
      _W("t1", ["Bene! Nunc Troiam servo. Proelium primum vince.","Goed! Nu red ik Troje. Win het eerste gevecht."], ["Proelium primum vince!","Win het eerste gevecht!"], ["Proelium vicisti! Gratias tibi ago.","Je hebt het gevecht gewonnen! Ik dank je."]),
      _P(["Nemo mihi credit. Credisne tu mihi?","Niemand gelooft mij. Geloof jij mij?"], ["Credo tibi, Cassandra.","Ik geloof je, Cassandra."], ["Non credo tibi.","Ik geloof je niet."], ["Rideo.","Ik lach."]),
    ],
    talks:[
      _T(["Equum ligneum video. Periculum est!","Ik zie het houten paard. Er is gevaar!"], ["Quid Cassandra videt?","Wat ziet Cassandra?"], ["Equum ligneum.","Het houten paard."], ["Navem magnam.","Een groot schip."], ["Montem altum.","Een hoge berg."]),
      _T(["Apollo mihi donum dedit, sed nemo mihi credit.","Apollo gaf mij een gave, maar niemand gelooft mij."], ["Quis Cassandrae donum dedit?","Wie gaf Cassandra een gave?"], ["Apollo.","Apollo."], ["Venus.","Venus."], ["Mars.","Mars."]),
      _T(["Pater meus rex est. Priamus est.","Mijn vader is koning. Hij heet Priamus."], ["Quis pater Cassandrae est?","Wie is de vader van Cassandra?"], ["Priamus.","Priamus."], ["Hector.","Hector."], ["Paris.","Paris."]),
    ] },
  circe: { nm:"Circe", region:"troia", type:"sup", affinity:"lignatio", world:{ x:45, y:34, dir:"left" },
    base:{ vita:50, impetus:13, tutela:8, celeritas:9, ambitus:6 },
    look:_look({ huid:"olijf", haar:"lang", haarkleur:"rood", armor:"robe", cape:"kort", capekleur:"groen", helm:"geen", wapen:"staf" }),
    chain:[
      _K("troia","litus",3, ["Salve, dux {naam}! Circe sum. Herbas et lupos amo. Tres hostes ad litus vince.","Gegroet, leider {naam}! Ik ben Circe. Ik hou van kruiden en wolven. Versla drie vijanden bij de kust."], ["Hostes ad litus vince!","Versla vijanden bij de kust!"], ["Optime! Litus liberum est.","Uitstekend! De kust is vrij."]),
      _W("t2", ["Bene! Nunc Ulixem iuvo. Proelium secundum vince.","Goed! Nu help ik Odysseus. Win het tweede gevecht."], ["Proelium secundum vince!","Win het tweede gevecht!"], ["Proelium vicisti! Gratias tibi ago.","Je hebt het gevecht gewonnen! Ik dank je."]),
      _P(["Homines in sues muto. Cur tecum veniam?","Ik verander mensen in zwijnen. Waarom zou ik met je meegaan?"], ["Quia amicos servo.","Omdat ik vrienden bescherm."], ["Quia sues amo.","Omdat ik van zwijnen houd."], ["Quia fugere volo.","Omdat ik wil vluchten."]),
    ],
    talks:[
      _T(["In insula Aeaea habito.","Ik woon op het eiland Aeaea."], ["Ubi Circe habitat?","Waar woont Circe?"], ["In insula.","Op een eiland."], ["In urbe.","In een stad."], ["In monte.","Op een berg."]),
      _T(["Socios Ulixis in sues muto.","Ik verander de maten van Odysseus in zwijnen."], ["Quos Circe in sues mutat?","Wie verandert Circe in zwijnen?"], ["Socios Ulixis.","De maten van Odysseus."], ["Matres.","De moeders."], ["Pueros.","De jongens."]),
      _T(["Herbas habeo. Ulixes me non timet.","Ik heb kruiden. Odysseus is niet bang voor mij."], ["Quid Circe habet?","Wat heeft Circe?"], ["Herbas.","Kruiden."], ["Naves.","Schepen."], ["Arma.","Wapens."]),
    ] },
});

/* Antwoordvolgorde schudden (deterministisch per vraag), zodat het goede antwoord niet altijd vooraan staat. */
function castraOptOrder(n, seedStr){
  let h = 2166136261>>>0; for(let i=0;i<seedStr.length;i++){ h ^= seedStr.charCodeAt(i); h = Math.imul(h, 16777619)>>>0; }
  const r = castraMapRng(h), a = Array.from({length:n},(_,i)=>i);
  for(let i=n-1;i>0;i--){ const j = Math.floor(r()*(i+1)); [a[i],a[j]] = [a[j],a[i]]; }
  return a;
}

/* ---------- helden in het spel ---------- */
function castraHero(id){ return (CASTRA.heroes||[]).find(h=>h.id===id) || null; }
function castraHeroCap(h){ return Math.min(CASTRA_H.maxLvl, CASTRA_H.capBase + CASTRA_H.capPerStep*Math.floor((h.fides||0)/CASTRA_H.fidesStep)); }
function castraHeroStats(h){
  const b = CASTRA_HERO_DATA[h.id].base, m = (100 + CASTRA_H.statGrowthPct*((h.lvl||1)-1))/100*CASTRA_H.heroMult, o = {};
  Object.keys(b).forEach(k=>{ o[k] = Math.round(b[k]*m); }); return o;
}
function castraHeroLevelUp(h){
  let up = false; const lvl0 = h.lvl;
  while(h.lvl < castraHeroCap(h) && h.xp >= castraXpToNext(h.lvl)){ h.xp -= castraXpToNext(h.lvl); h.lvl++; up = true; }
  if(up && typeof castraSkillLearned==="function") castraSkillLearned({ hero:true, h }, lvl0, h.lvl);
  return up;
}
function castraHeroRecruit(id){
  const list = CASTRA.heroes || (CASTRA.heroes = []);
  const isNew = !list.some(h=>h.id===id);
  if(isNew) list.push({ id, lvl:1, xp:0, fides:10, assigned:null });
  castraSave();
  if(isNew){ if(typeof castraPxpAdd==="function") castraPxpAdd(60, "Nieuwe held"); if(typeof castraCardToken==="function") castraCardToken(2, "nieuwe held"); }
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
/* ---------- helden zijn schaars: Castra-niveau om ze te ontmoeten, en een maximum per gevecht ----------
   Een held is zo sterk als een tier 4-soldaat; zonder rem zou een speler met zes helden geen soldaten meer nodig hebben.
   Daarom (1) verschijnt een held pas in de wereld vanaf een bepaald Castra-niveau (de volgorde per regio staat hier,
   Aeneas is er vanaf het begin), en (2) mogen er per gevecht maar weinig helden tegelijk meedoen, afhankelijk van het
   heroum-niveau: 1 held (heroum 1-2), 2 (3-4), 3 (5). De rest van de slagorde bestaat uit soldaten. */
const CASTRA_HERO_MINLVL = { aeneas:1, romulus:6, horatius:9, cloelia:12, mucius:15, camilla:18,
  hercules:20, perseus:23, theseus:26, atalanta:29, iason:32, medea:35, daedalus:40, cassandra:31, prometheus:37, circe:44, achilles:30, hector:34, ulixes:38, penthesilea:42 };
function castraHeroMinLvl(id){ return CASTRA_HERO_MINLVL[id] || 1; }
function castraHeroFieldCap(){ return 1 + Math.floor(Math.max(0, castraLvl("heroum")-1)/2); }
/* ---------- helden die in een grot wonen ----------
   Cassandra (grot van Troje) en Daedalus (labyrint van Graecia) zijn al opdrachtgever in hun grot (castra-regions.js).
   Ze zijn één persoon met de held: zolang er geen opdracht loopt en het spoor gevonden is (en het Castra-niveau
   hoog genoeg), begint hun gesprek in de grot met de heldenketen; na het overtuigen verhuist de bewoner naar je heroum. */
function castraCaveHeroOf(npcId){
  const id = Object.keys(CASTRA_HERO_DATA).find(k=>CASTRA_HERO_DATA[k].cave===npcId); if(!id) return null;
  if(castraHero(id)) return null;
  if(typeof castraPLevel==="function" && castraPLevel() < castraHeroMinLvl(id)) return null;
  return (CASTRA.traces && CASTRA.traces[id]) ? id : null;
}
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
    h.fides = Math.min(100, (h.fides||0)+CASTRA_H.fidesPerTalk); h.xp += 10; castraHeroLevelUp(h);
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
    const bar = `<div style="height:8px;background:#1b150e;border:1px solid #4a3d2c;border-radius:4px;overflow:hidden;width:120px"><div style="width:${h.fides||0}%;height:100%;background:var(--hi,#d4af37)"></div></div>`;
    const assign = CASTRA_H.assignable.map(bid=>{
      const on = h.assigned===bid, aff = d.affinity===bid;
      return `<button class="btn ${on?"btn-gold":""}" style="padding:2px 8px;font-size:12px" onclick="castraDoAssign('${h.id}','${on?"":bid}')">${esc(castraBuilding(bid).nm)}${aff?" ★":""}</button>`;
    }).join(" ");
    let talk = "";
    if(T && T.hid===h.id){
      const tk = d.talks[T.i];
      talk = `<div style="margin-top:8px;padding:8px;border:1px solid var(--hi-dim,#8a6d2f);border-radius:8px;background:rgba(0,0,0,.2)">
        <div style="font-size:16px">${castraLaHTML(castraSay(tk.la), castraSay(tk.nl), "talk_"+h.id+T.i)}</div>
        <div style="margin:8px 0 4px;font-size:16px">${castraLaHTML(tk.q.la, tk.q.nl, "tq_"+h.id+T.i)}</div>
        ${castraOptOrder(tk.q.opts.length, h.id+T.i).map(k=>{ const o = tk.q.opts[k]; return `<button class="btn ${T.answered===k?(o.ok?"btn-gold":""):""}" ${T.answered!==null?"disabled":""} style="margin:2px 4px 2px 0" onclick="castraHeroumAnswer(${k})">${esc(o.la)}</button>`; }).join("")}
        ${T.answered!==null?`<div style="margin-top:6px"><button class="btn" onclick="castraHeroumEndTalk()">${castraLaText("claude")}</button></div>`:""}</div>`;
    }
    return `<div style="padding:8px 0;border-top:1px solid #4a3d2c"><div style="display:flex;gap:10px">
      <div style="flex-shrink:0;text-align:center">${portrait}</div>
      <div style="flex:1"><b>${esc(d.nm)}</b> · ${castraLaText("gradus")} ${h.lvl} / ${cap} <small>(XP ${h.xp}/${castraXpToNext(h.lvl)})</small>
        <div style="margin:4px 0">${castraLaText("fides")}: ${bar}</div>
        <small>${CASTRA_STATS.map(x=>x.nm.slice(0,3)+" "+st[x.id]).join(" · ")}</small>
        <div style="margin-top:6px"><small>${castraLaText("assigna")}:</small> ${assign} ${h.assigned?`<small>+${castraHeroBonus(h.assigned)}%</small>`:""}</div>
        <div style="margin-top:6px"><button class="btn btn-gold" ${q.used>=q.max||(T&&T.hid===h.id)?"disabled":""} onclick="castraHeroumTalk('${h.id}')">${castraLaText("colloquium")}</button></div>
      </div></div>${talk}</div>`;
  }).join("") || `<div class="note">${castraLa("heroes_nulli")}</div>`;
  const hints = Object.keys(CASTRA.traces||{}).filter(id=>CASTRA_HERO_DATA[id] && !castraHero(id)).map(id=>`<div class="note">👣 ${castraLa("vestigia")} <b>${esc(CASTRA_HERO_DATA[id].nm)}</b>. ${castraLa("vestigia_quaere")}${CASTRA_HERO_DATA[id].cave ? " <small>(in de grot)</small>" : ""}</div>`).join("");
  const up = lvl>=maxL ? `<div class="note">${castraLa(lvl>=b.maxLvl?"gradus_max":"praetorium_prius")}</div>`
    : castraUpgradeUI('heroum', cost, costTxt, lvl);
  castraOpenPanel(`<div class="panel"><h3>${b.icon} ${esc(b.nm)} <small>${castraLaText("gradus")} ${lvl}</small></h3>
    <div style="font-style:italic;margin-bottom:6px">${castraLaHTML(b.lat||"", b.desc||"", "bld_heroum")}</div>
    <div class="note">${castraLaText("colloquia_hodie")}: ${q.used} / ${q.max}</div>${cards}${hints}
    <div style="margin-top:8px">${up}</div>
    <div style="margin-top:8px"><button class="btn" onclick="CASTRA_HT=null;castraClosePanel()">${castraLaText("claude")}</button></div></div>`);
}
function castraDoAssign(hid, bid){ castraHeroAssign(hid, bid); castraRenderMap(); castraHeroumOpen(); }
