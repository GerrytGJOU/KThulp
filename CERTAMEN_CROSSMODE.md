# Certamen — synergie tussen de modi (cross-mode)

Status 2026-12-12 · alle code staat in `certamen/crossmode.js` (laadt na `singleplayer.js`) en `certamen/crossmode2.js` (laadt als laatste, §8-§12), met haken in `battle.js`, `battle-data.js`, `games.js` en een paar Castra-bestanden. Dit document is de bron van waarheid voor wat modi met elkaar delen; werk het bij bij elke wijziging.

## Wat de modi delen (het fundament)
Het gedeelde profiel `P` (XP, niveau, munten, eerbewijzen) en de identiteit `identities/{klas}/{leerling}` (zie CLAUDE.md), de avatar, de eretitels, de lijst met moeilijke woorden (`hwMap`/`hwNote` in `core.js`) en de klaskeuze. Welke modus voedt wat:

| Modus | Gedeeld profiel (XP/munten) | Eerbewijzen | Eretitel/avatar | Moeilijke woorden |
|---|---|---|---|---|
| Battle Mode, Boss Battle, Total War-beleg | ja | ja | ja | ja |
| Training, Vrij oefenen | ja | ja | – | ja |
| Chronica Classica | – | ja (eretitels) | ja | – |
| Castra Heronum | **alleen Latijn-acties** (zie §3) | ja | cosmetisch (§4) | ja (§6) |

## 1. Chronica → Battle/Boss/Total War: bonus-eretitels
Eén bescheiden bonus per voltooid Boek (`CX_BOOKS`, plan in `Chronica.md` §6.1). Een Boek telt als voltooid zodra de hoogste voortgang in je opgeslagen slots het eerste hoofdstuk van het volgende Boek heeft bereikt (Boek VI: de Finale). Titels worden automatisch en met terugwerkende kracht toegekend (`cxSyncBookTitles`, bij het openen van de hoofdmenu's, het profiel, Castra en na elke Chronica-save).

| Titel | Bonus (scope: battle, boss, totalwar) |
|---|---|
| Bewaarder van de Herinnering (proloog) | +1 AP bij een snel juist antwoord (`be_on_fast`) |
| Kroniekschrijver Boek I | één fout antwoord per wedstrijd breekt je reeks niet (`streak_shield`) |
| Kroniekschrijver Boek II | elke wedstrijd +5 AP bij het kiezen van je klasse (`be_head_start`, eenmalig per wedstrijd) |
| Kroniekschrijver Boek III | +5% munten (`coin_bonus_pct`) |
| Kroniekschrijver Boek IV | je eerste antwoord telt voor AP altijd als goed (`first_answer_free`; analytics blijven eerlijk) |
| Kroniekschrijver Boek V | +5% munten (samen met Boek III maximaal +10%) |
| Meester der Herinnering (Finale) | +1 AP op elk juist antwoord (`be_on_correct`) |

Plafond per bonussoort, nooit stapelend binnen een soort behalve munten (max. 10%). De haken staan in `bmFinishAnswer`, `bmPickClass`/`bmApplyHeadStart` en `bmAwardBattle` (`battle.js`); `spBonusVal(type, scope)` en `bmBonusScope()` zijn de enige leesplekken. Eerder waren deze bonussen alleen zichtbaar op het profiel, niet verrekend.

## 2. Chronica → Castra
Elk voltooid Boek (en de Finale) geeft eenmalig 1 kaarttrekking in Castra (`cxCastraBookTokens`, bijgehouden in `CASTRA.cxPaid`).

## 3. Castra → profiel: XP en munten alleen voor Latijn
`castraMasterXp(xp, munten, reden)`: dagplafond 30 XP en 12 munten. Bronnen: woordenquiz (2 XP per goed antwoord vanaf 3 goed, plus munten), de optionele woordvraag van de wekelijkse uitdaging, en opgezochte woorden (1 XP per nieuw woord per dag, max. 5). Gevechten, jacht en quests geven bewust geen profiel-XP: XP blijft aan het leerdoel gekoppeld (zelfde principe als Total War §6: mastery alleen op het slagveld).

## 4. Castra → Battle Mode (cosmetisch)
Avatar-onderdeel *Castra Goud* (alle Castra-eerbewijzen; `battle-data.js`, categorie Legioensglans) en, als je geen Chronica-titel hebt gekozen, je Castra-titel (Tiro … Imperator) als label in de Battle Mode-lobby (`cxCastraTitleLabel`). Geen invloed op gevechten.

## 5. Battle Mode → Castra: klasse-affiniteit
Per mastery-ster in een klasse +2% XP voor Castra-soldaten van die klasse (max. +10%; klassen zijn dezelfde als in Battle Mode, `castraFormClassId`). Toegepast bij jachtwinst (`castra-venatio.js`) en na elk gevecht of weekuitdaging (`castra-report.js`); heroes uitgezonderd. Zichtbaar in de Castra-sectie van het profiel.

## 6. Woordenbrug
Castra → rest: een opgezocht woord dat een grondwoord uit de frequentielijst is (`VOCAB_LA`), telt eenmaal per dag als lastig (`hwNote`) en komt dan vaker terug in Battle, Training en Vrij oefenen. Beperking: alleen woorden die als grondwoord bestaan (niet elke verbogen vorm).
Rest → Castra: de woordenquiz bij de Senator krijgt tot 2 moeilijke woorden van de speler en tot 2 woorden uit de gedeelde docentlijsten van de klas (`klascodes/{KLAS}/wordlists`, Latijn, lokaal gecachet als `castra_tlists_v1`). Scherm *Mijn lastige woorden* (`SCREENS.myHardWords`, vanuit het profiel) met een knop die Vrij oefenen start met die woorden.

## 7. Profiel
Castra-sectie in "Mijn profiel" (niveau, titel, soldaten, helden, codex, missies, wekelijks record, klasse-affiniteit), kaart *Mijn lastige woorden*, eerbewijs *Grote Reis* (Battle Mode, Chronica, Castra en Training allemaal geprobeerd).

## Stijl
Perkamentkleuren van Castra staan als variabelen (`--parch`, `--parch2`, `--parch-ink`, `--parch-edge`, `--parch-gold`, `--parch-line`; `index.html`, met een blauwe variant voor `body.greek`). Castra-schermen gebruiken `var(--hi)`, `var(--hi-dim)` en `var(--cream)` voor goud en crème. Wereldschermen in Griekse regio's (Graecia, Laconia, Troia, Themiscyra) schakelen het Griekse thema in (`castra-ui.js`). Het resultaatrapport gebruikt de Battle Mode-klassen (`bm-gain`, `bm-xpbar`).

## 8. Verder spelen
Het hoofdmenu toont bovenaan een knop naar de laatst geopende modus (Castra, Chronica, Battle Mode, Total War, Vrij oefenen), onthouden in `cx_last_mode_v1` (alleen op dit apparaat). Geen reeks, geen verplichting.

## 9. Metgezel
In het Castra-menu (Milites/Heroes, tik een eenheid open) kies je 🐾 een soldaat of held als metgezel. Opgeslagen in `CASTRA.companion` (meegaand met de save) en `cx_companion_v1` (voor schermen buiten Castra). Zichtbaar in de Castra-sectie van het profiel en naast de avatar op de Battle Mode-tegel "Mijn profiel". Puur cosmetisch. Verdwijnt als de soldaat niet meer bestaat.

De metgezel stelt in het kamp hooguit 3 keer per dag (minimaal 20 minuten tussen twee vragen) een vraag over een lastig woord, met een Later-knop; goed geeft `hwNote` goed en 1 profiel-XP (dagplafond), fout laat het woord lastig. Geen melding buiten het kamp.

## 10. Schola (Castra-menu)
Menu-onderdeel *Schola*: 8 vragen (tot 6 eigen lastige woorden, aangevuld met nieuwe woorden uit de quizlijst). Goed = `hwNote(…, true)` (woord wordt minder lastig, in alle modi), fout = `hwNote(…, false)`. Vanaf 5 goed: profiel-XP volgens het dagplafond van §3 (`castraMasterXp`) plus Castra-XP.

## 11. Quaestio (wekelijkse uitdaging)
Tussen de golven (niet na de laatste) verschijnt een optionele woordvraag (eigen lastig woord, anders uit de quizlijst). Goed: +1 leven voor het kamp en 1 profiel-XP (dagplafond). Fout: geen straf, het woord komt terug. Overslaan mag. Alleen in de wekelijkse uitdaging.

## 12. Eerbewijzen en docentoverzicht
Eerbewijzen (categorie algemeen): *Weer gewoon* (10 lastige woorden weer gewoon, in welke modus ook; teller `P.stats.hwCleared`, via een wrapper om `hwNote`), *Geheugenmeester* (50), *Vlijtige leerling* (10 Schola-rondes), *Quaestor* (10 Quaestio goed), *Trouwe metgezel*, *Alleskunner* (Grote Reis + 10 woorden + een foutloze Schola-ronde).
Docent: op het klasscherm een tabel *Lastige woorden van de klas* (top 15, aantal leerlingen en gemiddelde moeilijkheid, geen namen), berekend uit de al geladen leerlingprofielen (`identities/{klas}/{lid}/hardWords`). Knop *Maak een woordenlijst*: gedeelde docentlijst van de lastigste 20 Latijnse woorden (zichtbaar in Castra-woordenquiz en Ludus). Geen nieuwe Firebase-gegevens of regels.

## Nog niet gebouwd (ideeën)
Chronica-helden in Castra, een hoofdmenu-brede "Hodie" en een wekelijks thema over alle modi, Woord van de dag over alle modi, gedeeld resultaatblok. (Total War ↔ Castra bewust niet: leerlingen kiezen daar zelf geen volk.)
