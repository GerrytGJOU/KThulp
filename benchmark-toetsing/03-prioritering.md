# Deel 4 — Vergelijkende tabel en prioritering

## Vergelijkende tabel: modus × 7 checklistpunten × 2 risico's

| | Kernmodus | Battle Mode | Boss Battle | Total War |
|---|:-:|:-:|:-:|:-:|
| 1. Gespreide herhaling | 0 | 1 | 1 | 0 |
| 2. Volgorde van feedback | 2 | 2 | 2 | 2 |
| 3. Low-stakes/anoniem | 1 | 1 | 1 | 1 |
| 4. Eigen keuze | 0 | 1 | 2 | 2 |
| 5. Nieuwsgierigheid/verhaal | 0 | 1 | 1 | 2 |
| 6. Tijdsdruk-alternatief | 2 | 0 | 0 | 2 |
| 7. Wisselende inhoud | 1 | 1 | 1 | 1 |
| **Totaal (van 14)** | **6** | **7** | **8** | **10** |
| a) Hanus & Fox-risico | Aanwezig (vooral Snelvuur) | Aanwezig, deels opgevangen | Aanwezig, bewust gedempt | Aanwezig, sterk gedempt |
| b) Blooket-euvel | Effectief aanwezig (Snelvuur) | Afwezig | Afwezig | Afwezig (Training) |
| c) Kahoot-tempo-risico | Vergelijkbaar effect (Snelvuur) | Matig aanwezig | Gedeeltelijk (niet klasgetest) | Afwezig (Training) / aanwezig (Boss Battle-component) |

---

## Geprioriteerde lijst van verbetervoorstellen

Gesorteerd op impact/werk (beide 1-5, hoger impact = grotere leerwinst/motivatie-correctie, hoger werk = meer code/architectuur).

| # | Modus | Wat | Waar in de code | Benchmarkbevinding | Wat de leerling ervaart | Impact | Werk | I/W |
|---|---|---|---|---|---|:-:|:-:|:-:|
| 1 | Kernmodus | Naaminvoer optioneel; auto-label uit avatar+kleur bij leeg veld | `games.js:548-586` (`joinDetails`/`doJoin`) | Checklist 3 (Kahoot-les) | Kan meedoen zonder herkenbare naam in te typen, hoeft er niet over na te denken | 3 | 1 | **3.0** |
| 2 | Battle Mode + Boss Battle | Optie voor klasse+avatar-badge i.p.v. verplichte vrije weergavenaam | `battle.js:1037-1069` (`battleIdentity`), `bmIdentDoLogin()` `1075-1107` | Checklist 3, Deel 3.1 (klasse-avatars) | Kan spelen als "Hopliet #3" i.p.v. eigen naam; minder drempel voor verlegen leerlingen | 3 | 1 | **3.0** |
| 3 | Battle Mode | Default-factie week/maand-gebaseerd laten roteren i.p.v. altijd "Romeinen vs. Galliërs" | `battle-data.js:171` (`BM_FACTIONS`), `battleHostSettings` | Checklist 7, Deel 3.2 (novelty-verval) | Elke paar weken een ander thema zonder dat de docent eraan hoeft te denken | 3 | 1 | **3.0** |
| 4 | Total War | Publieke seizoensrecords tonen leerlingcode/badge i.p.v. voornaam | `totalwar.js:679-699` (`twRecordBattleHighlights`), `training.js:548-556` | Checklist 3 (Kahoot-les) | Kan hoogste scores halen zonder dat de eigen voornaam zonder inloggen zichtbaar wordt voor de hele school | 3 | 1 | **3.0** |
| 5 | Kernmodus | Gewogen herhaling van fout beantwoorde woorden in `makeQuestion()` | `core.js:83-114` (`makeQuestion`, `pick`) | Checklist 1, Deel 3.1 (Gimkit-les) — belangrijkste losse aanbeveling uit het hele document | Woorden die hij net fout had komen vaker terug in dezelfde sessie, i.p.v. puur toeval | 5 | 2 | **2.5** |
| 6 | Kernmodus | Missed-words-paneel op het resultaatscherm | `games.js:729-742` (`SCREENS.result`), `curQ`-object al beschikbaar | Deel 3.1 (formatieve tussenstappen) | Ziet na afloop precies welke woorden fout gingen, niet alleen een score | 4 | 2 | **2.0** |
| 7 | Kernmodus | Snelvuur: kleine BE/score-boete of langere pauze na een fout antwoord (i.p.v. gelijke behandeling aan goed) | `games.js:358-361,693` (`applyAnswer`) | Fase 2a/2b/2c (Hanus & Fox, Blooket-euvel, Kahoot-tempo — alle drie samenkomend in Snelvuur) | Gokken bij Snelvuur wordt merkbaar minder aantrekkelijk dan nu | 4 | 2 | **2.0** |
| 8 | Battle Mode | Vervalteller (`nextDueRound`) op `missed`-entries zodat herhaling pas na N rondes weer optreedt | `battle.js:1729-1740` (`bmPersonalPool`) | Checklist 1 (Gimkit-les) | Merkt een echt spreidingspatroon i.p.v. woorden die soms meteen weer terugkomen | 4 | 2 | **2.0** |
| 9 | Boss Battle | Zelfde vervalteller-ingreep (gedeelde code met Battle Mode) | `battle.js:1729-1740` | Checklist 1 | Zelfde effect als #8 | 4 | 2 | **2.0** |
| 10 | Total War | Korte inhoudelijke hint na een fout antwoord in Training Mode | `training.js:358-361` (`trAnswer`, else-tak) | Deel 3.1 (formatieve tussenstappen) | Leert meteen waarom iets fout was, niet alleen dat het fout was | 2 | 1 | **2.0** |
| 11 | Total War | `TW_SEASON_TITLES` uitbreiden naar `TW_SEASON_THEMES` met korte tekst/effect per seizoen | `totalwar.js:538-541`, `twRenderSeasonBox()` | Checklist 7, Deel 3.2 (novelty-verval), Deel 3.1 (mysterie) | Elk seizoen voelt inhoudelijk anders, niet alleen een nieuwe naam | 3 | 2 | **1.5** |
| 12 | Boss Battle | `phaseDesc` per baas-fase, getoond via bestaande statusregel | `bossbattle.js:39-63` (`BOSS_PRESETS`), `178-196` (`bmBossStatusNote`) | Checklist 5 (meta-analyse-les, mysterie) | Faseovergangen voelen als een verhaalmoment, niet alleen een percentage | 3 | 2 | **1.5** |
| 13 | Total War | Leitner-hergebruik (`combat-questions.js`) koppelen aan Training Mode | `training.js:288` (`trNextQuestion`), nieuw `twMastery`-veld | Checklist 1, Deel 3.1 (Gimkit-les) — geldt voor het grootste deel van de individuele oefentijd in heel Certamen | Woorden die hij structureel fout heeft, blijven over dagen/weken terugkomen — niet alleen binnen één sessie | 5 | 3 | **1.67** |
| 14 | Boss Battle | Rage-mechaniek loskoppelen van niet-schade-acties (heal/schild tellen niet mee als "geen schade") | `bossbattle.js:99-100,162-170` | Fase 2a (Hanus & Fox) | Kiezen voor een ondersteunende rol voelt niet meer als een systeemstraf | 3 | 3 | **1.0** |
| 15 | Battle Mode | Aantal antwoordopties instelbaar (2 vs. 4) als eerste stap richting opdrachttype-autonomie | `battlePlayerLobby`, `core.js:83-112` (`makeQuestion`) | Checklist 4 (SDT-les) | Kan zelf kiezen tussen een makkelijkere of moeilijkere aanpak | 2 | 3 | **0.67** |
| 16 | Kernmodus | Leerling-niveau-instelling in gehoste spellen (persoonlijk moeilijkheidsfilter bovenop de docent-pool) | `games.js:581` (`Net.getPool`), net-model | Checklist 4 (SDT-les) | Kan binnen dezelfde klassikale sessie op eigen niveau spelen | 3 | 4 | **0.75** |
| 17 | Battle Mode + Boss Battle | Tijdsdrukvrije variant (bv. per-speler async-modus) | `battle.js:1266,2907` (timer-instellingen, `bmTick`) | Checklist 6 | Kan Battle Mode/Boss Battle spelen zonder de gedeelde countdown | 4 | 5 | **0.8** |
| 18 | Kernmodus | Mysterie-element (verhaallaag) in de gehoste spellen | `games.js` (hele spelstructuur) | Checklist 5 (meta-analyse-les) | Ervaart nieuwsgierigheid naast score/snelheid | 2 | 4 | **0.5** |

---

## Top vijf — beste verhouding impact/werk

1. **Naaminvoer optioneel in de kernmodus, met auto-label uit avatar+kleur** (`games.js:548-586`) — 1 regel-schaal ingreep, direct effect op checklistpunt 3.
2. **Klasse+avatar-badge als alternatief voor de vrije weergavenaam in Battle Mode/Boss Battle** (`battle.js:1037-1069`) — hergebruikt bestaande avatar-infrastructuur volledig, raakt twee modi tegelijk.
3. **Seizoensgebonden rotatie van de default-factie in Battle Mode** (`battle-data.js:171`) — enkele regels, directe aanpak van het novelty-verval-risico zonder nieuwe content te hoeven bouwen.
4. **Leerlingnaam vervangen door leerlingcode in Total War's publieke seizoensrecords** (`totalwar.js:679-699`, `training.js:548-556`) — dicht het scherpste privacylek van de vier modi (zichtbaar zonder inloggen) met een eenregelige wijziging.
5. **Gewogen herhaling van fout beantwoorde woorden in `makeQuestion()`** (`core.js:83-114`) — de belangrijkste losse aanbeveling uit het hele benchmarkdocument (Deel 3.1), en de kernmodus is de plek waar dit nu volledig ontbreekt terwijl de ingreep klein is (een gewicht toevoegen aan een bestaande random-pick).

---

## Welke modus scoort het sterkst, welke het zwakst — en waarom

**Total War scoort het sterkst (10/14)**, en dat is niet toeval: het is de enige modus met een structureel tijdsdrukvrij hoofdmoment (Training Mode, thuis, geen timer), de breedste leerlingautonomie (spoor/provincie/taal/bereik/woordsoort allemaal vrij instelbaar) en de enige met een verhaallaag die ook mechanisch effect heeft (het rebellenscenario, niet alleen sfeer). De prijs die daarvoor betaald wordt, is zichtbaar in de risico's: het puntensysteem is kwantiteit-gedreven en leunt structureel op een verover-de-kaart-metafoor — dat wordt alleen overeind gehouden door een reeks bewuste, expliciet gedocumenteerde balansmaatregelen (klasgrootte-normalisatie, dagcap, en vooral de harde scheiding tussen Training-XP en Mastery). Zonder die maatregelen zou Total War juist het scherpst tegen Hanus & Fox aanlopen, precies omdát het de rijkste secundaire game-economie heeft.

**De kernmodus scoort het zwakst van de vier (6/14)**, en dat is precies het soort bevinding dat verdwijnt als je de rapporten los leest in plaats van naast elkaar: het is de meest gespeelde, meest laagdrempelige modus van Certamen (elke les inzetbaar, geen setup) en toch de enige die op drie van de zeven punten een kale 0 scoort — geen gespreide herhaling, geen leerlingkeuze buiten cosmetiek, geen verhaalelement. De reden is niet gebrek aan ambitie maar schaal: de drie klassieke spellen (Touwtrekken/Marathon/Snelvuur) zijn bewust minimalistisch gehouden, en juist daardoor ontbreekt de infrastructuur (foutenregister, keuzemenu's, verhaallaag) die de andere modi via hun grotere datamodel wél hebben opgebouwd. Battle Mode scoort weliswaar hoger in totaal (7/14) maar vertoont een interessant ander patroon: het heeft de rijkste spelmechaniek van de vier (8 klassen, 7 combo's, synergie, eerbewijzen) én toch als enige een harde 0 op tijdsdruk-alternatief (de hele resolutie draait op een gedeelde deadline) en geen leerling-autonomie in opdrachttype (altijd hetzelfde 4-opties-format, ondanks alle rol-keuzevrijheid). Dat is het duidelijkste voorbeeld in deze toetsing van een patroon dat alleen zichtbaar wordt door de vier naast elkaar te leggen: **veel spelmechaniek bovenop de vraag compenseert niet voor weinig vrijheid ín de vraag** — Boss Battle en Total War, die dezelfde onderliggende vraag-engine gebruiken, bieden allebei wél reële eigen-keuze op dat vlak (doelwit/rol resp. spoor/strategie), terwijl Battle Mode die vrijheid nooit doortrekt tot wat een leerling elke ronde daadwerkelijk doet: op een van vier vaste knoppen klikken, binnen een vaste klok, zonder alternatief.

**Total War scoort het sterkst (10/14) en de kernmodus het zwakst (6/14)** is dus het eenregelige antwoord — maar de meer bruikbare les is dat de zwakte van de kernmodus (geen enkele infrastructuur voor herhaling/keuze/verhaal) en de zwakte van Battle Mode (rijke infrastructuur die niet doorwerkt naar timing/opdrachttype) twee volledig verschillende problemen zijn, die dus ook twee verschillende soorten ingrepen vragen — zie de prioriteitenlijst hierboven.
