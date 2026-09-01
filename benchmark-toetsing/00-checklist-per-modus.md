# Deel 1 — Zeven-punten-checklist per modus

Bron: `certamen-benchmark-gamification.md`, Deel 3.3. Elke modus is gescoord op basis van de daadwerkelijke code en het bijbehorende masterplan (`BATTLE_MODE.md`, `BOSS_BATTLE.md`, `TOTAL_WAR.md`), niet op basis van bestandsnamen of aannames. "Kernmodus" = Touwtrekken, Marathon, Snelvuur (`certamen/games.js`, motor `certamen/core.js`) plus de solo-submodus Vrij Oefenen (`certamen/freepractice.js`). Chronica Classica is buiten scope (al apart geaudit op didactiek/reactiviteit/stijl) — zie wel de opmerking in [02-wat-overnemen.md](02-wat-overnemen.md) over overwaai naar de andere drie modi.

Score 0 = afwezig, 1 = gedeeltelijk/rudimentair, 2 = volledig aanwezig. Waar iets niet zonder livegebruik te beoordelen is, staat dat expliciet vermeld.

---

## 1. Gespreide herhaling (Gimkit-les)

*"Komt een fout beantwoorde vraag/vorm met toenemende tussenpozen terug?"*

| Modus | Score | Vindplaats / motivering |
|---|---|---|
| **Kernmodus** | **0/2** | `makeQuestion(pool)` (`certamen/core.js:83-114`) trekt uniform random via `pick(pool)`. Geen enkele foutenhistorie wordt bijgehouden of meegewogen in `drawQuestion()` (`games.js:655-664`) of `fpNextQuestion()` (`freepractice.js:80-93`). Het bestaande Leitner-systeem in `certamen/combat-questions.js` wordt hier niet aangeroepen. Geen welwillende afronding: aantoonbaar afwezig. |
| **Battle Mode** | **1/2** | `bmPersonalPool()` (`battle.js:1729-1740`) geeft fout beantwoorde woorden tot 3× extra gewicht in de trekpool binnen één gevecht, zichtbaar via `bmAdaptiveHintHTML()` ("🎯 Je oefent nu extra op…", `battle.js:1746-1752`). Dit is *gewogen willekeur*, geen tijd/interval-gestuurde herhaling, en niet persistent tussen gevechten (`missed` leeft alleen in de room-state). `BATTLE_MODE.md` erkent dit zelf expliciet als bekende beperking (regel 980). |
| **Boss Battle** | **1/2** | Zelfde mechanisme en dezelfde functie (`bmPersonalPool()`) als Battle Mode, want Boss Battle hergebruikt de Battle Mode-engine. Zelfde beperking: geen interval-logica, sessie-lokaal, niet persistent. |
| **Total War** | **0/2** | Training Mode (`trNextQuestion()`, `training.js:288`) roept `makeQuestion(TR_POOL)` aan — dezelfde uniforme `pick()` als de kernmodus, geen foutenregister. Boss Battle-belegeringen binnen Total War erven wel de 1/2-score van Boss Battle, maar dat is een ander subsysteem; Training Mode zelf (het gros van de speeltijd) scoort hier 0. Een werkend Leitner-systeem bestaat al elders in de repo (`combat-questions.js`, gebruikt door Chronica/singleplayer) maar wordt niet hergebruikt. |

**Kernbevinding:** geen van de vier modi haalt de volle 2 — het enige dat in de buurt komt (Battle Mode/Boss Battle) is sessie-lokale gewogen willekeur, geen echte spaced repetition. De infrastructuur (Leitner-boxen) bestaat al in de repo, maar is nergens buiten Chronica gekoppeld.

---

## 2. Volgorde van feedback (Hanus & Fox-les)

*"Ziet de leerling eerst zijn eigen resultaat, en pas daarna, optioneel, zijn positie t.o.v. anderen?"*

| Modus | Score | Vindplaats / motivering |
|---|---|---|
| **Kernmodus** | **2/2** | `answer()` (`games.js:676-695`) geeft direct, uitsluitend eigen feedback (`.correct`/`.wrong`-klassen). `SCREENS.result` (`games.js:698-747`) toont eerst eigen medaille/score/XP, daarna pas één ondergeschikte winnaarsregel. Het volledige klassement/podium (`showResultHost()`, `games.js:468-499`) staat alleen op het **docent-projectiescherm**, niet op het device van de leerling. |
| **Battle Mode** | **2/2** | `bmAnswer()` (`battle.js:4169-4184`) + `SCREENS.battlePlayerGame`-banner (`battle.js:4030-4052`) geven direct eigen resultaat. Geen individueel klassement is ooit zichtbaar voor leerlingen tijdens het spel. De zes awards en klas-analytics (`SCREENS.battleHostAwards`, `battle.js:3647` e.v.) zijn host/projector-only; het eigen toestel toont na afloop alleen eigen XP-winst (`bmRenderXpGain()`). |
| **Boss Battle** | **2/2** | Zelfde patroon en zelfde code (`bmAnswer()`) als Battle Mode. Rangschikking (`_bmRankMap`, `battle.js:2670-2692`) bepaalt alleen visuele slagveldpositie op het hostscherm, geen zichtbaar leerling-scorebord. Erepodium pas na afloop, gezamenlijk, coöperatief geframed. |
| **Total War** | **2/2** | `trAnswer()` (`training.js:303-364`) toont direct en uitsluitend eigen resultaat; geen ranking tijdens het spelen. Klasvergelijking (kaart, seizoensrecords) staat volledig los op een apart, zelf op te zoeken scherm (`SCREENS.totalWarMap`), nooit automatisch na een beurt getoond. |

**Kernbevinding:** dit is het sterkste punt van Certamen als geheel — alle vier de modi scoren hier vol. De Hanus & Fox-regel (eigen feedback eerst, klassement optioneel en later) is consequent doorgevoerd, mede doordat drie van de vier modi een fysieke scheiding hebben tussen eigen device en docent-projectiescherm.

---

## 3. Low-stakes en anoniem (Kahoot-les)

*"Is er een manier om mee te doen zonder herkenbare of ongepaste naaminvoer?"*

| Modus | Score | Vindplaats / motivering |
|---|---|---|
| **Kernmodus** | **1/2** | Vrij Oefenen is volledig anoniem (geen naam/code nodig, `freepractice.js`). Touwtrekken/Marathon/Snelvuur vereisen echter een vrij ingetypte naam (`SCREENS.joinDetails`, `games.js:548-567`, `maxlength="16"`) die klasbreed zichtbaar wordt (lobby, projectiescherm, podium) — géén contentfilter, alleen "niet leeg" (`doJoin()`, `games.js:569-586,573`). Kleur/avatarkeuze bestaat, maar vervangt de naam niet. |
| **Battle Mode** | **1/2** | Login via klascode + zelfgekozen leerlingcode (pseudoniem, `bmIdentDoLogin()`, `battle.js:1075-1107`) — dat deel is echt low-stakes. Maar `SCREENS.battleIdentity` (`battle.js:1037-1069`) vraagt daarnaast een vrije-tekst "Weergavenaam" die klasgenoten en docent daadwerkelijk zien (bevestigd in `bmRenameSelf()`, `battle.js:4456-4477`: "dit is de naam die je klasgenoten en de docent zien"). Geen serverfilter; alleen achteraf-correctie mogelijk. |
| **Boss Battle** | **1/2** | Zelfde identiteitsscherm en dezelfde code als Battle Mode (`SCREENS.battleIdentity`). Systeem *kán* pseudoniem zijn, maar stuurt er niet actief op aan — het is een persistente, klasgebonden identiteit bedoeld om herkenbaar te blijven over sessies (vandaar placeholder "Marcus"). |
| **Total War** | **1/2** | Inloggen zelf vereist geen herkenbare naam (leerlingcode volstaat als schuilnaam). Maar het optionele `bmNaam`-veld (gedeeld met Battle Mode) lekt door naar **publiek zichtbare, geen-inlog-nodig** seizoensrecords: `topSolo`/`topBuilder` tonen voornaam + klas aan iedereen (`twRenderHighlights()`, `totalwar.js:767`; `trMaybeUpdateTopBuilder()`, `training.js:548-556`). Dit is een breder lek dan bij Battle Mode zelf, omdat het zonder inloggen zichtbaar is. |

**Kernbevinding:** alle drie de klasgebonden modi (kernmodus-gehost, Battle Mode, Boss Battle, Total War) delen hetzelfde lek: een optioneel vrij-tekst naamveld dat in de praktijk het primaire zichtbare label wordt, zonder contentfilter. Alleen Vrij Oefenen is echt volledig anoniem. Total War heeft het scherpste risico omdat de naam ook zonder inloggen publiek zichtbaar wordt.

---

## 4. Eigen keuze (SDT-les)

*"Heeft de leerling ergens een keuze in rol, opdrachttype of aanpak, of is score de enige as?"*

| Modus | Score | Vindplaats / motivering |
|---|---|---|
| **Kernmodus** | **0/2** | In Touwtrekken/Marathon/Snelvuur bepaalt uitsluitend de docent bron/bereik/woordsoort/instellingen (`SCREENS.hostSource`, `games.js:88-142`; `SCREENS.hostSettings`, `games.js:201-232`); leerling kiest alleen cosmetisch kleur/avatar. Vrij Oefenen geeft wel keuze in taal/bereik/woordsoort **vooraf** (`freepractice.js:19-52`), maar niet in aanpak/opdrachttype tíjdens het spelen (altijd 4-optie meerkeuze). Voor de klassikale hoofdspellen is score letterlijk de enige as — geen welwillende afronding naar 1. |
| **Battle Mode** | **1/2** | Sterk op **rol**: 8 klassen × 5 abilities, vrije BE-spaarstrategie, combo's, klassekeuze zelfs halverwege wisselbaar (`BM_CLASSES`, `battle-data.js:16-89`). Maar nul keuze in **opdrachttype**: altijd hetzelfde vaste 4-opties-vertaalformat (`makeQuestion()`, `core.js:83-112`). Variatie zit uitsluitend in de strategische laag, niet in de leerinhoud-interactie. |
| **Boss Battle** | **2/2** | Klassekeuze, doelwitkeuze (baas vs. handlanger, `bmSetTarget()`, `battle.js:4264`), combo's-vs-solo, spaar-vs-besteed-tactiek, en gratis basisacties als vangnet (`BM_BASIC_ACTIONS`, `battle-data.js:119-122`). Ondersteunende rollen (healer/schild) worden expliciet even zwaar erkend in het scorebord als aanvallers ("Medic van het Legioen") — score is hier aantoonbaar niet de enige as. |
| **Total War** | **2/2** | Meerdere onafhankelijke keuze-assen: spoor (militie/muur/toren), provincie, taal, frequentiebereik, woordsoort (`trRenderModeBody()`, `training.js:160-190`), plus strategische aanvalskeuze op kaartniveau. Breedste autonomie van de vier modi. |

**Kernbevinding:** grootste spreiding van alle zeven punten (0 t/m 2). De docent-gehoste kernspellen bieden feitelijk geen leerlingautonomie; Total War en Boss Battle bieden de meeste. Battle Mode heeft rol-autonomie maar mist opdrachttype-variatie — dat laatste geldt overigens voor alle vier de modi (zie ook Fase 2a).

---

## 5. Nieuwsgierigheid/verhaal (meta-analyse-les)

*"Zit er een element van mysterie of verhaal in naast punten en snelheid?"*

| Modus | Score | Vindplaats / motivering |
|---|---|---|
| **Kernmodus** | **0/2** | Geen narratief element. Drie pure score-race-metaforen (touw/baan/klok) zonder personages, plot of onthulling. Vergelijk expliciet met de Chronica-tegel op hetzelfde homescherm (`games.js:29-34`), die wél een verhaalbeschrijving heeft — de kernmodus mist dit volledig. Zelfs de vraagpresentatie is kaal (woord + 4 opties, geen context). |
| **Battle Mode** | **1/2** | Thematisch laagje: 6 facties met Commander Spectres (historische veldheren als geest-overlay bij combo's/ultimates, `BM_COMMANDERS`, `battle-data.js:202-227`) en M9-verborgen-traits (mysterie via "🔒 ???" tot ontgrendeld). Maar dit is een eenmalige, docent-gekozen skin per gevecht zonder progressie of doorlopend verhaal — geen "wat gebeurt hierna"-element binnen één gevecht. |
| **Boss Battle** | **1/2** | Drie mythologisch onderscheiden bazen met unieke, thematisch passende mechanics (Hydra/Cycloop/Minotaurus) en een gekoppelde mythologische held die als spectre verschijnt (`CommanderSpectre.show`, `battle.js:42`). Maar geen verhalende laag erboven: fase-labels tonen kaal "Fase X · Rage Y%" (`bmBossSpriteHTML()`, `bossbattle.js:267`), geen flavourtekst per fase, geen visuele fase-overgang (ondanks dat het masterplan dit wél beschrijft — niet gebouwd). |
| **Total War** | **2/2** | Sterk en mechanisch verankerd: historische geschiedenislesjes per veroverde stad (110 steden, `trProvinceOverviewHTML()`, `training.js:407-449`), vlaggenschipprovincies met eigen anekdote, seizoenstitels (`TW_SEASON_TITLES`, `totalwar.js:538-541`), en een narratief "rebellen"-mechanisme voor volledig verslagen beschavingen i.p.v. gewoon "verloren". |

**Kernbevinding:** Total War scoort hier het hoogst van de drie score-gedreven modi (naast Chronica, buiten scope) — het enige waar verhaal ook mechanisch effect heeft (rebellen-scenario), niet alleen sfeer. De kernmodus mist dit volledig; Battle Mode en Boss Battle hebben wel thematische elementen maar geen doorlopend verhaal.

---

## 6. Tijdsdruk-alternatief

*"Bestaat er, naast elke variant met harde tijdsdruk, ook een variant zonder?"*

| Modus | Score | Vindplaats / motivering |
|---|---|---|
| **Kernmodus** | **2/2** | Snelvuur heeft een sessiedeadline (`META.deadline`, `games.js:211`); Touwtrekken/Marathon hebben géén tijdslimiet (doelgericht, geen per-vraag-timer). Vrij Oefenen is ook tijdloos. Bewuste ontwerpkeuze, expliciet zo benoemd in de UI-tekst. |
| **Battle Mode** | **0/2** | Antwoordtimer is altijd aanwezig: 8/10/12/15s, hardcoded als enige opties (`battle.js:1266`), plus een vaste, niet-instelbare 10s actiefase (`bmTick()`, `battle.js:2907`). Geen "geen limiet"-instelling bestaat in `battleHostSettings`. Fundamentele ontwerpkeuze (gedeelde deadline nodig voor gelijktijdige resolutie), maar dat verandert niets aan de score: er is geen tijdloze variant binnen deze modus. |
| **Boss Battle** | **0/2** | Zelfde `battleHostSettings`-timer-UI als Battle Mode (8/10/12/15s, `battle.js:1266`) — geen "geen limiet"-optie. `BOSS_BATTLE.md` §7 beschrijft wel een "Enrage-timer 2/3/5 min/geen limiet"-instelling, maar die is **niet gebouwd** — puur docx-ontwerp, niet in de werkelijke `battleHostSettings`-UI terug te vinden. |
| **Total War** | **2/2** | Training Mode (het gros van de individuele speeltijd, thuis) heeft **geen** timer-logica in `trNextQuestion()`/`trAnswer()`. Alleen de synchrone Boss Battle-belegering binnen Total War hergebruikt de Battle Mode-timer. Omdat de dominante, individuele leermodus tijdsdrukvrij is, scoort dit vol. |

**Kernbevinding:** scherp contrast. De kernmodus en Total War (via Training Mode) bieden allebei een reëel tijdsdrukvrij alternatief; Battle Mode en Boss Battle bieden dat structureel niet — geen enkele instelling laat de timer uitzetten, ook al suggereert het Boss Battle-masterplan van wel.

---

## 7. Wisselende inhoud (novelty-verval)

*"Verandert de inhoud vaak genoeg om novelty-verval te voorkomen?"*

| Modus | Score | Vindplaats / motivering |
|---|---|---|
| **Kernmodus** | **1/2** | Drie spelvormen met eigen visuals, willekeurige woordselectie per vraag. Maar binnen een sessie: geen oplopende moeilijkheid, geen wisselende vraagtypes (altijd hetzelfde 4-opties-format, `core.js:83-114`), geen visuele progressie buiten de voortgangsbalk. Bij herhaald klassikaal gebruik (elke les hetzelfde touw/dezelfde baan) reëel novelty-verval-risico. |
| **Battle Mode** | **1/2** | Reële variatie beschikbaar: 6 facties, 8 klassen × 5 abilities, 7 combo's, synergie, Boss Battle, Total War-koppeling. Maar geen automatische rotatie: default factie is altijd "Romeinen vs. Galliërs" (`default:true`, `battle-data.js:171`), moet elke sessie handmatig door de docent gewisseld worden. Uitgebreidingen (M6 fractieklassen) staan expliciet als "ontwerp, nog niet gebouwd". Zonder actief docent-ingrijpen speelt een klas keer op keer dezelfde default-content. |
| **Boss Battle** | **1/2** | 3 bazen met écht verschillende mechanics + 5 moeilijkheidsgraden geven herhaalbaarheid. Maar de vraagpool zelf is onafhankelijk van welke baas gekozen wordt (dezelfde woorden ongeacht Hydra/Cycloop/Minotaurus), en random events ("Gunst van Zeus" e.d.) zijn expliciet **niet gebouwd** (het masterplan zegt dit letterlijk). Binnen dezelfde baas/moeilijkheid verloopt een gevecht mechanisch zeer voorspelbaar; novelty valt snel plat na de eerste paar potjes met alle drie bazen. |
| **Total War** | **1/2** | Seizoenen geven periodieke vernieuwing van de veroveringsstand met wisselende titels (`TW_SEASON_TITLES`), plus vlaggenschip- en "betwist"-mechanismen. Maar dit is **handmatig door de docent** geïnitieerd, niet automatisch, en reset altijd naar dezelfde 46-provinciekaart met dezelfde 8 vaste beschavingen/thuislanden (`TW_CIVS`, hardcoded). Uitbreiding buiten het Romeinse Rijk is expliciet uitgesloten in het masterplan (§9.1) — de kaart zelf is en blijft structureel statisch. |

**Kernbevinding:** geen enkele modus haalt hier de volle 2 — dit is het punt waarop alle drie de niet-kernmodi (Battle Mode, Boss Battle, Total War) hetzelfde patroon vertonen: losse content-bouwstenen bestaan, maar niets rouleert automatisch. De benchmark-aanbeveling "wisselend seizoensthema i.p.v. statisch systeem" (Deel 3.2) is dus voor alle drie relevant, niet alleen voor Battle Mode.

---

## Vergelijkende tabel — Fase 1 totaalscores

| # | Criterium | Kernmodus | Battle Mode | Boss Battle | Total War |
|---|---|:-:|:-:|:-:|:-:|
| 1 | Gespreide herhaling | 0 | 1 | 1 | 0 |
| 2 | Volgorde van feedback | 2 | 2 | 2 | 2 |
| 3 | Low-stakes/anoniem | 1 | 1 | 1 | 1 |
| 4 | Eigen keuze | 0 | 1 | 2 | 2 |
| 5 | Nieuwsgierigheid/verhaal | 0 | 1 | 1 | 2 |
| 6 | Tijdsdruk-alternatief | 2 | 0 | 0 | 2 |
| 7 | Wisselende inhoud | 1 | 1 | 1 | 1 |
| **Totaal (van 14)** | | **6** | **7** | **8** | **10** |

Zie [03-prioritering.md](03-prioritering.md) voor de gecombineerde tabel met de Fase 2-risico's en de geprioriteerde verbeterlijst.
