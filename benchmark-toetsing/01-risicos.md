# Deel 2 — Specifieke risico's uit de benchmark, per modus

Bron: `certamen-benchmark-gamification.md`, Deel 2.2 (Hanus & Fox) en Deel 3.2 (Blooket-euvel, Kahoot-tempo). Per modus getoetst op de code, met concrete vindplaatsen.

---

## Kernmodus (Touwtrekken / Marathon / Snelvuur / Vrij Oefenen)

### a) Hanus & Fox-risico — **aanwezig, vooral in Snelvuur**
Elke correcte klik levert direct munten/XP op zonder controle op reactietijd of pogingen (`answer()`, `games.js:687-689`). In **Snelvuur specifiek** is er géén straf voor een fout antwoord (`applyAnswer()`, `games.js:358-361`) en de pauze vóór de volgende vraag is bij Snelvuur vast (600ms), terwijl die bij Touwtrekken/Marathon juist ná een fout antwoord langer is (900ms vs. 520ms, `games.js:693`). Netto: in Snelvuur is snel-en-blind-klikken strikt dominant over zorgvuldig nadenken — fout kost niets, traag zijn kost score. Touwtrekken/Marathon straffen fout wél functioneel (terugtrekken/terugstappen/bevriezen, docent-instelbaar penalty, `games.js:222-228`).
**Al opgevangen:** de afleider-generator sluit dubbelzinnige afleiders uit (`conflicts()`, `core.js:88-98`); spreidings-eerbewijzen (`week_vol`/`dertig_dagen`) belonen expliciet spreiding over dagen i.p.v. grinden in één sessie, met een toelichting in de code zelf (`core.js:479-482`).

### b) Blooket-euvel — **effectief aanwezig in Snelvuur, niet in Touwtrekken/Marathon**
Geen letterlijke skip-knop nergens in de kernmodus. Maar in Snelvuur is de combinatie van nul-straf-op-fout + vaste 600ms-doorloop (`games.js:358-361,693`) functioneel gelijk aan wegklikken zonder consequentie: een leerling kan gokken, het kost niets, en het woord komt (zoals vastgesteld bij checklistpunt 1) niet gegarandeerd terug. In Touwtrekken/Marathon heeft fout wél een tastbaar gevolg, dus daar gaat dit niet op.

### c) Kahoot-tempo-risico — **geen harde per-vraag-timer, maar structureel vergelijkbaar effect in Snelvuur**
Er is nergens een timer die een individuele vraag afkapt — Snelvuur's tijdsdruk zit op sessieniveau (`STATE.deadline`), niet per vraag. Toch ontstaat in de praktijk een vergelijkbaar gok-boven-begrip-effect door de combinatie van totale-tijdsdruk + nul-straf-op-fout (zie a/b): een rationele leerling optimaliseert door zo snel mogelijk te klikken zonder het woord echt te lezen. Dit specifieke risico (de combinatie, niet de tijdsdruk zelf) is nergens in de code-commentaren benoemd — in tegenstelling tot de wél expliciet becommentarieerde spreidings-maatregel. Touwtrekken/Marathon hebben dit risico niet.

---

## Battle Mode

### a) Hanus & Fox-risico — **structureel aanwezig, deels opgevangen**
Battle Energy, legersterkte, klassekeuze, combo-timing en eerbewijzen vormen een rijke secundaire game-economie los van taalkennis. Het masterplan erkent zelf een eerdere BE-inflatie ("65+ BE terwijl de duurste ability 10 kost", `BATTLE_MODE.md` regel 423-445) puur door systeemstapeling, niet taalvaardigheid. Puur-toeval-eerbewijzen (`trait_exacte_nul`, `trait_drieling`) versterken het patroon dat het spelsysteem zelf iets is om te "hacken". XP voor pure deelname (+5) en rondes beantwoord (+1, los van correct/fout) beloont "meedoen" los van taalprestatie.
**Al opgevangen:** BE-caps (`BM_BE_MAX=15`, `battle-data.js:104-107`); rondebonus alleen na een góéd antwoord de vorige ronde; BE-boete op fout (`BM_WRONG_BE_PENALTY=2`) trekt de systeemlaag terug naar taalprestatie; Scholar-bonus (+8 bij ≥90% correct) zorgt dat taalprestatie het gros van de XP bepaalt; legersterkte schaalt automatisch mee met tegenstandersaantal i.p.v. een docent-gekozen HP-getal.

### b) Blooket-euvel — **niet aanwezig**
Geen skip-knop. `bmAnswer()` (`battle.js:4169-4184`) vergrendelt de keuze zodra geklikt is; fout kost altijd BE en wordt bijgehouden voor analytics én de adaptieve pool. Passief niet-antwoorden tot de deadline is mogelijk (stilzwijgend nul-resultaat) maar dat is geen actieve, aangeboden "sla over"-knop.

### c) Kahoot-tempo-risico — **matig aanwezig**
Kortste timer-instelling is 8s — ruimer dan Kahoot's kortste (tot 5s), maar krap voor een 4-opties-vertaalvraag. Een expliciete snelheidsbonus (+4 i.p.v. +3 BE bij "snel correct", Cavalerie +2 extra) beloont snelheid bovenop correctheid, wat gokgedrag bij tijdsdruk in theorie kan bevorderen.
**Verzachtend:** het verschil snel/gewoon-correct is klein (4 vs. 3 op een schaal tot 15); fout antwoorden kosten altijd −2 BE, dus blind gokken heeft bij 4 opties een negatieve verwachte waarde (25% kans +3/+4 tegen 75% kans −2) — wiskundig onaantrekkelijk als strategie.

---

## Boss Battle

### a) Hanus & Fox-risico — **bewust gedempt, met concrete restrisico's**
`BOSS_BATTLE.md` §3 benoemt expliciet de les uit Battle Mode's muntformule-correctie en kiest bewust voor coöperatieve, niet-schaming-beloningscategorieën (`bmComputeBossAwards()`, `battle.js:3410-3435`: "De Sloper", "Medic van het Legioen", "Combo Koning").
**Restrisico's in de code:** de BE-straf op fout (−2) is een directe spelsysteem-consequentie die los kan komen te staan van taalbegrip bij een twijfelende leerling. De `noDamageAnswerCount`/Rage-mechaniek (`bossbattle.js:99-100,162-170`) is een expliciet zelf-becommentarieerde "proxy voor een gemist/fout antwoord" — maar geldt ook voor een speler die wél correct antwoordde maar een niet-schade-actie koos (heal/schild). Dat kan strategisch spelgedrag uitlokken (bv. "kies nooit heal") los van de vertaalopgave. De Inspiratie-buff na 3 fouten (`battle.js:4223-4235`) werkt juist als positief tegenwicht: beloont herstel i.p.v. straf-op-straf.

### b) Blooket-euvel — **niet aanwezig**
Geen wegklik-mogelijkheid voor leerlingen. `bmSkipRound()` (`battle.js:1767`) is een host-only knop op het projectorscherm, niet toegankelijk voor leerlingen. Het juiste antwoord wordt bij fout altijd getoond.

### c) Kahoot-tempo-risico — **gedeeltelijk, niet zonder klastest te kwantificeren**
Zelfde 8-15s-timer als Battle Mode, plus een "Clutch"-bonus voor correct antwoorden in de laatste 5 seconden en een "fast"-bonus voor de eerste helft van de tijd — beide belonen snelheid bovenop correctheid, wat het gok-risico bij de kortste instelling (8s) versterkt. Geen ondergrens-bescherming (geen extra tijd voor leesondersteuning, geen vraaglengte-afhankelijke timer). **Expliciet niet volledig te beoordelen zonder het spel te laten spelen.**

---

## Total War

### a) Hanus & Fox-risico — **structureel aanwezig (verover-de-kaart-spel), sterk gedempt door balansmaatregelen**
`basePts=5/√klasgrootte` (`training.js:325`) en een dagcap van 25 volledige-snelheid-antwoorden (`TR_DAILY_CAP`, regel 41) zijn een puur kwantitatief puntensysteem: elk correct antwoord levert dezelfde basispunten op, ongeacht moeilijkheidsgraad — een leerling kan theoretisch makkelijke/lage-frequentiewoorden kiezen om sneller te scoren. Publieke seizoensrecords (grootste rijk, meeste veroveringen, sterkste solo-speler) zijn expliciete klassementen tussen klassen.
**Al opgevangen (expliciet becommentarieerd in het masterplan):** geen streak-multipliers ("geen combo-vermenigvuldigers die de economie laten exploderen", §3.2/§9.2); klasgrootte-compensatie (1/√N) voorkomt dat een grote klas automatisch wint; dagcap remt thuisgrind af; **Mastery blijft strikt gescheiden van Training Mode-punten** ("Ervaring krijg je door te trainen, maar échte Mastery verdien je alleen op het slagveld in de klas", §6) — de belangrijkste correctie, want puntengrind kan zo geen taalbeheersings-indicator vervalsen; vlaggenschepen stapelen bewust niet (voorkomt sneeuwbaleffect voor grote rijken).

### b) Blooket-euvel — **niet aanwezig**
`trAnswer()` (`training.js:303-313`) schakelt bij elk klik-moment alle vier de keuzeknoppen direct uit, geen "volgende vraag"-knop, geen skip-optie — de leerling moet altijd op een van de vier opties klikken. Boss Battle-belegeringen binnen Total War erven de "niet aanwezig"-score van Boss Battle.

### c) Kahoot-tempo-risico — **afwezig in Training Mode, aanwezig in de Boss Battle-component**
Training Mode heeft geen timer — dit risico bestaat hier structureel niet, en dat is het gros van de individuele oefentijd. De synchrone belegeringscomponent (Boss Battle, 8-15s, default 10s) draagt hetzelfde risico als Boss Battle hierboven beschreven.

---

## Samenvattend — aanwezig / gedeeltelijk / afwezig per risico

| Modus | a) Hanus & Fox | b) Blooket-euvel | c) Kahoot-tempo |
|---|---|---|---|
| Kernmodus | Aanwezig (vooral Snelvuur) | Effectief aanwezig (Snelvuur) | Structureel vergelijkbaar effect (Snelvuur) |
| Battle Mode | Aanwezig, deels opgevangen | Afwezig | Matig aanwezig |
| Boss Battle | Aanwezig, bewust gedempt | Afwezig | Gedeeltelijk (niet te kwantificeren zonder klastest) |
| Total War | Aanwezig, sterk gedempt | Afwezig | Afwezig (Training) / aanwezig (Boss Battle-component) |

Zie [03-prioritering.md](03-prioritering.md) voor hoe deze risico's meewegen in de geprioriteerde verbeterlijst.
