# Deel 3 — Wat overnemen, per modus

Bron: `certamen-benchmark-gamification.md`, Deel 3.1. Voor elke aanbeveling: aanwezig / gedeeltelijk aanwezig / afwezig, plus de kleinste ingreep om een afwezige aanbeveling toe te voegen, gegeven hoe de modus nu technisch in elkaar zit. Chronica Classica is buiten scope (al apart geaudit) — de aparte paragraaf onderaan bespreekt alleen hoe diens verhaallaag eventueel naar de andere drie modi kan overwaaien.

---

## Kernmodus

| Aanbeveling | Status | Kleinste ingreep |
|---|---|---|
| Gespreide herhaling | **Afwezig** | `core.js`/`games.js`/`freepractice.js` hebben al een lokale `POOL`/`FP_POOL`-array en een simpele `pick()`-random. Houd per sessie een `wrongCount`-map bij (woord → aantal keer fout, in-memory) en vervang `pick(pool)` in `makeQuestion()` (`core.js:84`) door een gewogen trekking (gewicht = 1 + 2×wrongCount). Geen wijziging aan de `makeQuestion(pool)`-signatuur nodig. |
| Klasse-avatars i.p.v. vrije naam | **Gedeeltelijk aanwezig** | Avatar/kleur-keuze bestaat al (`games.js:558-561`, `AVATARS`-data in `core.js:119-129`). Maak de naam-invoer in `joinDetails()`/`doJoin()` optioneel en stel bij leeg veld automatisch een label samen uit avatar+kleur (bv. "Rode Uil") — de weergaveplekken gebruiken toch al `esc(p.name)`, alleen de bron van `p.name` hoeft te veranderen. |
| Mysterie-element | **Afwezig** | Zwaarste van de vijf om klein te houden. Een oppervlakkige stap (willekeurige flavor-zin per X-de vraag) zou geen echt mysterie zijn zonder game-state-koppeling. Een serieuze implementatie vergt eerder aansluiting bij Chronica Classica's bestaande verhaalinfrastructuur dan een lokale patch — zie de aparte paragraaf onderaan. |
| Formatieve tussenstappen | **Afwezig** | `answer()`/`fpAnswer()` houden `curQ` al bij (woord/opties/juist antwoord). Voeg een in-memory `missedWords`-array toe die bij elk fout antwoord het woord+juiste vertaling bewaart, en toon die op een al bestaand natuurlijk pauzemoment: `SCREENS.result` (`games.js:729-742`), als extra paneel "Deze woorden gingen fout". Geen nieuwe databron nodig. |
| Autonomie via keuzevrijheid | **Gedeeltelijk aanwezig** | Afwezig in de gehoste spellen (docent bepaalt alles behalve cosmetiek); aanwezig maar beperkt tot vooraf-instellingen in Vrij Oefenen. Voor de gehoste spellen zou een leerling-niveau-chip (analoog aan `FP_DRAFT`) een grotere ingreep zijn, want `POOL` is nu gedeeld via `Net.getPool(CODE)` — gelijk voor iedereen. Per-speler subfiltering vergt een aanpassing van het net-model. |

---

## Battle Mode

| Aanbeveling | Status | Kleinste ingreep |
|---|---|---|
| Gespreide herhaling | **Gedeeltelijk aanwezig** | `bmPersonalPool()` (`battle.js:1729-1740`) bestaat al en schrijft/leest `BM_PLAYERS[pid].missed`, al gesynchroniseerd via Firebase. Voeg een `nextDueRound`-veld toe aan elk `missed`-entry zodat een woord pas na een oplopend aantal rondes weer extra gewicht krijgt (Leitner-achtig: 1, dan 3, dan 6 rondes later) — alleen een aanpassing binnen `bmPersonalPool()`, geen nieuwe Firebase-paden. Persistentie over gevechten heen (echte lange-termijn spaced repetition) is een grotere stap, maar kan het bestaande cross-device-syncpatroon (`syncXpDelta`/`syncCoinsDelta`) hergebruiken. |
| Klasse-avatars i.p.v. vrije naam | **Gedeeltelijk aanwezig** | Uitgebreide avatar-editor bestaat al (16 onderdelen, `BM_AVATAR_PARTS`), maar is decoratief bovenop een vrije-tekst weergavenaam (`battle.js:1057-1060`), niet een vervanging ervoor — dat is niet hetzelfde als wat de benchmark bedoelt (voorkomen van herkenbare/ongepaste identificatie). Voeg in `SCREENS.battleIdentity` een keuze toe voor een gegenereerde/gekozen bijnaam (bv. Latijnse/Griekse strijdersnaam uit een vaste lijst, of de leerlingcode zelf) i.p.v. verplicht vrije tekst. Hergebruikt hetzelfde databasepad (`identities/{klas}/{lcode}/name`) en `bmRenameSelf()`-logica. |
| Mysterie-element / verhaal | **Gedeeltelijk aanwezig** | Factiewisseling is al volledig data-gedreven (`BM_FACTIONS`; "nieuwe factie = één entry toevoegen", `BATTLE_MODE.md` regel 185-187), maar de default is altijd "Romeinen vs. Galliërs" (`default:true`, `battle-data.js:171`) en moet handmatig gewisseld worden. Laat de default-factie in `battleHostSettings` afhangen van een week/maand-gebaseerde rotatie-index (`BM_FACTIONS[weekNumber % BM_FACTIONS.length]`) i.p.v. altijd dezelfde default — de docent kan nog steeds overschrijven. Enkele regels, geen wijziging aan `BM_FACTIONS`/`bmApplyTheme()` zelf. |
| Formatieve tussenstappen | **Aanwezig** | Onmiddellijke feedback per vraag, zichtbare BE-consequentie, adaptieve hint, live participatiebalk voor de docent, analytics na afloop met top-5 gemiste woorden. Geen ingreep nodig. |
| Autonomie via keuzevrijheid | **Gedeeltelijk aanwezig** | Rol/klasse-autonomie is rijk (zie checklistpunt 4); opdrachttype-autonomie ontbreekt volledig (altijd 4-opties-meerkeuze). Kleinste stap: maak het aantal opties instelbaar (2 vs. 4, makkelijker/moeilijker) via een toggle in `battlePlayerLobby`, zonder de resolutie-engine (BE/schade/schild) aan te passen. Een volwaardig alternatief vraagtype (bv. zin-context) zou een grotere ingreep zijn — de afleider-conflictlogica (`core.js:88-98`) gaat uit van los-woord-meerkeuze. |

---

## Boss Battle

| Aanbeveling | Status | Kleinste ingreep |
|---|---|---|
| Gespreide herhaling | **Gedeeltelijk aanwezig** | Zelfde `bmPersonalPool()`-mechanisme en zelfde beperking als Battle Mode. Kleinste ingreep: identiek — een `lastMissedRound`-veld op `missed/{wordKey}`, gelezen in `bmPersonalPool()` om een minimale wachttijd (2-3 rondes, oplopend) af te dwingen vóór een woord weer extra gewicht krijgt. Sluit direct aan op de bestaande `adaptive`-toggle in `battleHostSettings` (`battle.js:1296-1299`). |
| Klasse-avatars i.p.v. vrije naam | **Gedeeltelijk aanwezig** | Zelfde identiteitsscherm als Battle Mode — zelfde ingreep is hier direct van toepassing (gedeelde code). |
| Mysterie-element / verhaal | **Gedeeltelijk aanwezig, licht uitgewerkt** | Drie bazen met eigen mechanic + illustratie + held-spectre bestaan al (`BOSS_PRESETS`, `bossbattle.js:39-63`), maar zonder flavourtekst per fase of visuele fase-overgang. `BOSS_PRESETS`-entries hebben al een `desc`-veld; voeg een `phaseDesc:{1:"…",2:"…",3:"…"}` toe per baas en toon die in `bmBossStatusNote()` (`bossbattle.js:178-196`, al de aangewezen host-only statusregel-functie) zodra de fase wisselt. Geen nieuwe infrastructuur. |
| Formatieve tussenstappen | **Aanwezig** | Elk antwoord toont onmiddellijk goed/fout mét het juiste antwoord, plus de adaptieve hint welke woorden extra geoefend worden. Geen ingreep nodig. |
| Autonomie via keuzevrijheid | **Aanwezig** | Klassekeuze, doelwitkeuze, combo's-vs-solo, spaar-vs-besteed-tactiek, gratis basisacties als vangnet — sterk uitgewerkt via bestaande Battle Mode-infrastructuur. Geen ingreep nodig. |

---

## Total War

| Aanbeveling | Status | Kleinste ingreep |
|---|---|---|
| Gespreide herhaling | **Afwezig** (in Training Mode zelf) | Een werkend Leitner-systeem bestaat al elders in dezelfde repo (`certamen/singleplayer-data.js`/`combat-questions.js`, box 0-5, `noteerAntwoord()`), maar wordt niet door Total War gebruikt. Voeg een `twMastery`-veld toe aan het per-leerling Firebase-profiel (analoog aan het bestaande `twContrib`-patroon, `training.js:525-542`), roep in `trAnswer()` een `noteerAntwoord()`-achtige functie aan, en vervang `pick(pool)` in `makeQuestion()`-aanroepen vanuit Training Mode door een gewogen keuze op basis van Leitner-box. Relatief kleine ingreep omdat het patroon al letterlijk in de repo bestaat. |
| Klasse-avatars i.p.v. vrije naam | **Gedeeltelijk aanwezig** | Inloggen zelf vereist geen vrije naam (leerlingcode volstaat), maar het optionele `bmNaam`-veld lekt naar publiek zichtbare (geen-inlog) seizoensrecords. Vervang in `twRecordBattleHighlights()` (`totalwar.js:679-699`) en `trMaybeUpdateTopBuilder()` (`training.js:548-556`) `top.name`/`BM_IDENT.name` door `BM_IDENT.leerlingcode` (of een afgeleide avatar-badge) in de twee Firebase-transacties — geen schema-wijziging, alleen welk veld geschreven wordt. |
| Mysterie-element / verhaal | **Gedeeltelijk aanwezig** | Verhaal scoort hoog (checklistpunt 5), maar het seizoenssysteem zelf is structureel statisch (dezelfde kaart/facties elk seizoen, alleen een nieuwe titel). Breid `TW_SEASON_TITLES` uit naar `TW_SEASON_THEMES` met een korte tekst/effect per seizoen, opgeslagen in `/totalwar/season/theme` en uitgelezen in `twRenderSeasonBox()`/`twProvinceInfo()`. Hergebruikt de al werkende seizoensinfrastructuur — geen kaartuitbreiding nodig (die is expliciet uitgesloten in het masterplan, §9.1). |
| Formatieve tussenstappen | **Aanwezig, met kanttekening** | Directe feedback + voortgangsbalken + provincie-overzicht zijn er al. Wat ontbreekt is inhoudelijke feedback ná een fout antwoord (nu alleen de gemarkeerde juiste-antwoordknop). Voeg in `trAnswer()` (regel 358-361, de `else`-tak) een korte inhoudelijke hint toe — puur een UI-toevoeging aan een bestaand feedbackmoment. |
| Autonomie via keuzevrijheid | **Aanwezig** | Spoor-, provincie-, taal-, bereik- en woordsoortkeuze zijn alle vrij instelbaar. Sterkste punt van Total War, geen ingreep nodig. |

---

## Chronica Classica — hoe de payoff-laag kan overwaaien

Chronica Classica scoort op checklistpunt 5 (nieuwsgierigheid/verhaal) als enige van de vier structureel vol — de payoff-laag en delayed consequences zíjn precies de "Regels/Doelen + Uitdaging + Mysterie"-combinatie die de sterkste meta-analyse (Deel 2.5 van het benchmarkdocument) als meest effectief aanwijst. Dat wil niet zeggen dat de andere drie modi verhalen moeten worden — dat zou hun kernidentiteit (snelle, klassikale, competitieve energie) juist ondermijnen. Wat wél overdraagbaar is, zonder de andere modi in Chronica te veranderen:

- **Een terugkerend seizoensthema in plaats van een eenmalig statisch systeem** is de directe brug: Total War heeft al een seizoenssysteem (`TW_SEASON_TITLES`), Battle Mode heeft al een factiesysteem dat net zo goed kan roteren, en Boss Battle heeft al drie bazen die een seizoensgebonden "toernooi-volgorde" zouden kunnen krijgen. Dit is precies checklistpunt 7 (wisselende inhoud) en Deel 3.2's "novelty-verval"-aanbeveling, en het is de vorm van verhaal die het minst ingrijpt: geen personages of plot nodig, alleen een naam/thema/lichte flavourtekst die per periode wisselt — zoals hierboven al als kleinste ingreep per modus is uitgewerkt (`TW_SEASON_THEMES`, factierotatie, `phaseDesc` per baas).
- **Geen gedeelde canon nodig.** Chronica's personages/plot hoeven niet over te lopen naar Battle Mode/Boss Battle/Total War — dat zou de scope van deze drie modi (klassikaal, snel, competitief) ondermijnen en past niet bij hun ontwerp. Wat overdraagbaar is, is het *principe* (herhaalde nieuwsgierigheid door verandering-over-tijd), niet de *inhoud*.
- **Boss Battle leent zich het makkelijkst voor een lichte narratieve laag** omdat de bazen al mythologische identiteit en een gekoppelde held-spectre hebben — de kleinste ingreep hierboven (`phaseDesc` per fase) is in feite al een miniatuurversie van wat Chronica op grotere schaal doet: een kort tekstmoment op een spelbepalend keerpunt.

Dit is geen pleidooi om de drie modi narratief te maken zoals Chronica; het is een concrete, kleine overname van één specifiek principe (seizoensgebonden wisseling i.p.v. statisch systeem) dat toevallig zowel de novelty-verval-aanbeveling als het mysterie-criterium raakt.
