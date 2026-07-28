# Fase 1 — Hardheidsanalyse

> Alle bevindingen verwijzen naar `certamen/singleplayer-data.js` met scène-id en regelnummer.
> Niets in deze fase is gewijzigd. Regelnummers gelden voor de werkkopie zoals gelezen op 2026-07-27.

## De kern in zeven regels

1. **99 van de 103 keuze-scènes schrijven niets duurzaams weg.** Vier scènes in het hele spel doen dat wel.
2. **31 van de 45 flags zijn dood**, en 29 daarvan komen uit één enkel, mechanisch herhaald patroon.
3. **Alle 46 `[NEUTRAL]`-opties zijn strikte no-ops** — ze leiden naar dezelfde scène en leggen zelfs niet vast dát de speler weigerde te oordelen.
4. **`ingenium` wordt in het hele spel nul keer als drempel gebruikt** — terwijl het de stat van taal, tekst en raadsels is, en de hoogste stat van de Cavalerist.
5. **`gratia` bestaat alleen in Hoofdstuk 1 t/m 4.** Daarna is de Cavalerist mechanisch onzichtbaar: 0 haalbare gates in H7, H8 én H9.
6. **Van de 46 personages die in ≥2 hoofdstukken voorkomen, hebben er 41 geen enkel geheugen.**
7. **Er zijn geen wezen-payoffs** — maar drie van de dertien payoffs zitten achter zo'n stapel voorwaarden dat de meeste spelers ze nooit zien.

## 1. Dode flags

31 flags worden geschreven en nooit gelezen. Ze vallen in twee groepen.

### 1a. Het `_route`-patroon — 29 gevallen, één oorzaak

Dit is geen verzameling losse slordigheden maar één ontwerpbeslissing die 29 keer is herhaald.
Elke STAT-gated splitsing in het spel heeft dezelfde vorm: een opzetscène met 2–3 knoppen
(één gratis, één of twee met `[STAT:…]`), drie korte gevolgscènes die elk `chX_YYY_route=<aanpak>`
wegschrijven, en dan komen ze binnen één klik weer samen. De flag wordt nergens gelezen.

Wat de speler ervaart: hij kiest — soms met een knop die alleen zijn eigen klasse kan indrukken —
om Midas overeind te houden in plaats van een poort open te beuken, leest drie regels bevestiging,
en dan is het weg. Het spel weet vijf hoofdstukken later niet meer dat hij het type is dat mensen
overeind houdt. Dat is de duurste categorie in deze hele audit, niet omdat elk geval groot is,
maar omdat het er 29 zijn en de speler er telkens iets van zichzelf in heeft gestopt.

Gesorteerd op hoe zwaar de keuze aanvoelde (aantal knoppen, aantal `[STAT:]`-gates, hoeveelheid
tekst die eraan voorafging):

| Gewicht | Hfst | Flag | Scènes die hem schrijven | Regels | STAT-gates |
|---|---|---|---|---|---|
| 12 | H1 | `ch1_a10_route` | `CH1_A10_OPEN`, `CH1_A10_VIS`, `CH1_A10_GRATIA` | 2561, 2578, 2595 | 2 |
| 12 | H5 | `ch5_019_route` | `CH5_019_OPEN`, `CH5_019_VIS`, `CH5_019_PRU` | 7447, 7464, 7481 | 2 |
| 11 | H1 | `ch1_b01_route` | `CH1_B01_PAD`, `CH1_B01_VIS`, `CH1_B01_AGI` | 2728, 2745, 2762 | 2 |
| 11 | H1 | `ch1_c03_route` | `CH1_C03_OPEN`, `CH1_C03_AGI`, `CH1_C03_VIS` | 3063, 3080, 3097 | 2 |
| 11 | H1 | `ch1_c09_route` | `CH1_C09_PAD`, `CH1_C09_VIS`, `CH1_C09_PRU` | 3266, 3283, 3300 | 2 |
| 11 | H2 | `ch2_k05_route` | `CH2_K05_OPEN`, `CH2_K05_ROB`, `CH2_K05_PRU` | 4146, 4163, 4180 | 2 |
| 11 | H2 | `ch2_l06_route` | `CH2_L06_OPEN`, `CH2_L06_AGI`, `CH2_L06_ROB` | 3641, 3658, 3675 | 2 |
| 11 | H2 | `ch2_s06_route` | `CH2_S06_OPEN`, `CH2_S06_VIS`, `CH2_S06_PRU` | 3936, 3953, 3970 | 2 |
| 11 | H3 | `ch3_h07_route` | `CH3_H07_OPEN`, `CH3_H07_ROB`, `CH3_H07_VIS` | 5303, 5320, 5337 | 2 |
| 11 | H3 | `ch3_h13_route` | `CH3_H13_OPEN`, `CH3_H13_GRA`, `CH3_H13_ROB` | 5499, 5516, 5533 | 2 |
| 11 | H3 | `ch3_io07_route` | `CH3_IO07_OPEN`, `CH3_IO07_ROB`, `CH3_IO07_GRA` | 4890, 4907, 4924 | 2 |
| 11 | H3 | `ch3_io11_route` | `CH3_IO11_OPEN`, `CH3_IO11_ROB`, `CH3_IO11_GRA` | 5016, 5033, 5050 | 2 |
| 11 | H4 | `ch4_p06_route` | `CH4_P06_OPEN`, `CH4_P06_GRA`, `CH4_P06_ROB` | 6575, 6592, 6609 | 2 |
| 11 | H4 | `ch4_t08_route` | `CH4_T08_OPEN`, `CH4_T08_ROB`, `CH4_T08_GRA` | 6167, 6184, 6201 | 2 |
| 11 | H4 | `ch4_t11_route` | `CH4_T11_OPEN`, `CH4_T11_ROB`, `CH4_T11_GRA` | 6294, 6311, 6328 | 2 |
| 11 | H5 | `ch5_004_route` | `CH5_004_OPEN`, `CH5_004_VIS`, `CH5_004_PRU` | 6951, 6968, 6985 | 2 |
| 11 | H5 | `ch5_008_route` | `CH5_008_OPEN`, `CH5_008_AGI`, `CH5_008_VIS` | 7120, 7137, 7154 | 2 |
| 11 | H5 | `ch5_016_route` | `CH5_016_OPEN`, `CH5_016_AGI`, `CH5_016_VIS` | 7338, 7355, 7372 | 2 |
| 11 | H5 | `ch5_024_route` | `CH5_024_OPEN`, `CH5_024_VIS`, `CH5_024_AGI` | 7591, 7608, 7625 | 2 |
| 11 | H5 | `ch5_025_route` | `CH5_025_OPEN`, `CH5_025_AGI`, `CH5_025_PRU` | 7676, 7693, 7710 | 2 |
| 11 | H6 | `ch6_001_route` | `CH6_001_OPEN`, `CH6_001_VIS`, `CH6_001_AGI` | 7899, 7916, 7933 | 2 |
| 11 | H6 | `ch6_007_route` | `CH6_007_OPEN`, `CH6_007_PRU`, `CH6_007_AGI` | 8080, 8097, 8114 | 2 |
| 11 | H6 | `ch6_012_route` | `CH6_012_OPEN`, `CH6_012_VIS`, `CH6_012_AGI` | 8243, 8260, 8277 | 2 |
| 11 | H6 | `ch6_015_route` | `CH6_015_OPEN`, `CH6_015_PRU`, `CH6_015_AGI` | 8365, 8382, 8399 | 2 |
| 11 | H6 | `ch6_023_route` | `CH6_023_OPEN`, `CH6_023_AGI`, `CH6_023_PRU` | 8592, 8609, 8626 | 2 |
| 9 | H2 | `ch2_h07_route` | `CH2_H07_VIS`, `CH2_H07_AGI` | 4438, 4455 | 2 |
| 9 | H2 | `ch2_h10_route` | `CH2_H10_ROB`, `CH2_H10_AGI` | 4545, 4562 | 2 |
| 6 | H2 | `ch2_l07_route` | `CH2_L07B` | 3714 | 1 |
| 6 | H3 | `ch3_h23_route` | `CH3_H23_OPEN`, `CH3_H23_ROB` | 5749, 5766 | 1 |

Eén afwijkend geval binnen deze groep: `ch2_l07_route` wordt maar door één scène geschreven,
`CH2_L07B` (certamen/singleplayer-data.js:3714). Dat is de enige `_route`-splitsing die naar een écht andere scène leidt
in plaats van naar een variant van dezelfde — en het is ook de enige die daarnaast een `RELATION:`
zet (`athena=+1`), die wél wordt uitgelezen. De flag zelf blijft niettemin dood.

### 1b. Twee losse dode flags

| Flag | Geschreven in | Waarom dit pijn doet |
|---|---|---|
| `ch6_diomedes_epigonen` | `CH6_020` (certamen/singleplayer-data.js:8512) | Wordt gezet op het moment dat Diomedes tussen de puinhopen van Thebe staat — en dus precies het feit vastlegt dat de speler erbij was toen Diomedes zijn vader wreekte. Nergens gelezen. De Diomedes-payoff in Hoofdstuk 9 gebruikt in plaats daarvan de relatiescore, die alleen via de optionele Prudentia-knop `CH6_018_PRU` (certamen/singleplayer-data.js:8478) groeit. De onvoorwaardelijke flag ligt er dus wel, maar wordt genegeerd. |
| `herakles_taken_voltooid` | `CH2_H12` (certamen/singleplayer-data.js:4596) (=2) en `CH3_H25` (certamen/singleplayer-data.js:5802) (=12) | De enige numerieke voortgangsflag in het spel, twee keer netjes bijgewerkt, nul keer uitgelezen. Herakles komt in Hoofdstuk 5 (Hylas/Mysië), 7 (zijn boog bij Philoktetes) en 9 (opnieuw die boog) nog terug zonder dat het spel weet hoe ver de speler hem heeft zien komen. |

## 2. Wezen-payoffs

**Geen.** Alle dertien payoffs in `SP_PAYOFFS` verwijzen naar flags die daadwerkelijk ergens
geschreven worden, met waarden die daadwerkelijk voorkomen, en naar relatiedrempels die
bereikbaar zijn. Ik heb elke conditie mechanisch getoetst tegen alle schrijfplekken.

Wat er wél is: drie payoffs die technisch kunnen vuren maar praktisch achter een stapel
voorwaarden zitten. Dat is geen fout, maar het is wel de reden dat het spel *aanvoelt* alsof
er niets wordt onthouden, terwijl er op papier dertien payoffs staan.

| Payoff | Vuurt in | Wat de speler ervoor moet hebben gedaan | Praktisch bereik |
|---|---|---|---|
| `ch9_gri009_echo_diomedes_geschiedenis` | `CH9_GRI_009` (certamen/singleplayer-data.js:11088) | **Drie dingen tegelijk:** (1) in Hoofdstuk 6 de optionele knop bij `CH6_018` (certamen/singleplayer-data.js:8458) nemen — die is `[STAT:prudentia:12]` en dus bij startwaarden **alleen voor de Boogschutter** haalbaar (Hopliet heeft 10, Cavalerist 8); (2) in Hoofdstuk 8 de Agamemnon-kant kiezen; (3) in Hoofdstuk 9 de Griekse kant kiezen. De drempel is `relationMin: {diomedes: 2}` en er zijn precies twee positieve momenten — er is geen enkele speling. | Zeer klein |
| `ch9_gri005_echo_aias_sympathiek` / `…_afstandelijk` | `CH9_GRI_005` (certamen/singleplayer-data.js:10973) | Precies één van beide vuurt altijd — mits de speler in Hoofdstuk 9 de **Griekse** kant kiest. Kiest hij de muren, dan vuurt geen van beide. | Halve spelerbasis |
| `ch3_h01_deur_herakles_harnas` | `CH3_H01` (certamen/singleplayer-data.js:5149) | Vereist `herakles_harnas` uit `CH2_H09` (certamen/singleplayer-data.js:4491), dus de Herakles-lijn van Hoofdstuk 2. Hoofdstuk 2 dwingt alle vier de lijnen af via de fragmenten-gate, dus dit vuurt uiteindelijk voor iedereen. | Volledig |

### 2a. Het echte probleem in Hoofdstuk 9: de vertakking sluit payoffs uit

Hoofdstuk 9 heeft vier payoffs. Eén ervan (`ch9_002_echo_herakles_harnas`) staat in de gedeelde
proloog bij `CH9_002` (certamen/singleplayer-data.js:10390). De andere drie staan **allemaal in de Griekse tak**.
De Trojaanse tak — 18 scènes, `CH9_TRO_001` t/m `CH9_TRO_018` — bevat er nul.

Een speler die bij `CH9_005` "Kijk mee vanaf de muren" kiest, krijgt dus in het hele slothoofdstuk
exact één moment waarop het spel iets terugzegt over wat hij eerder deed. Dat de Trojaanse kant
juist de emotioneel zwaardere is (Priamus, Astyanax, Cassandra, Aeneas' vlucht) maakt dat scherper,
niet zachter.

## 3. Onmiddellijke payoffs

Zes uitlezingen liggen op afstand 1 in de scènegraaf — de flag wordt geschreven en in de
direct volgende scène al gelezen. Alle zes zijn `[DONE:…]`-tags op de hub van hun eigen hoofdstuk.

Dat is administratie, geen reactiviteit: de tag zorgt ervoor dat een afgeronde lijn een ✓ krijgt en
niet opnieuw begint. Nuttig, maar het is niet "de wereld herinnert zich je" — het is "de menukaart
weet welk gerecht je al op hebt".

| Flag | Geschreven in | Gelezen in | Afstand | Wat het doet |
|---|---|---|---|---|
| `ch2_lijn_herakles` | `CH2_H12` (certamen/singleplayer-data.js:4596) | `CH2_000` (certamen/singleplayer-data.js:3484) | 1 | `[DONE]`-vinkje op de hub |
| `ch2_lijn_kallisto` | `CH2_K09` (certamen/singleplayer-data.js:4254) | `CH2_000` (certamen/singleplayer-data.js:3484) | 1 | `[DONE]`-vinkje op de hub |
| `ch2_lijn_semele` | `CH2_S08` (certamen/singleplayer-data.js:4003) | `CH2_000` (certamen/singleplayer-data.js:3484) | 1 | `[DONE]`-vinkje op de hub |
| `ch3_lijn_herakles` | `CH3_H25` (certamen/singleplayer-data.js:5802) | `CH3_000` (certamen/singleplayer-data.js:4719) | 1 | `[DONE]`-vinkje op de hub |
| `ch4_lijn_phaethon` | `CH4_P10` (certamen/singleplayer-data.js:6687) | `CH4_000` (certamen/singleplayer-data.js:5929) | 1 | `[DONE]`-vinkje op de hub |
| `ch4_lijn_theseus` | `CH4_T16` (certamen/singleplayer-data.js:6423) | `CH4_000` (certamen/singleplayer-data.js:5929) | 1 | `[DONE]`-vinkje op de hub |

**Kandidaten voor een tweede, latere uitlezing.** Deze zes flags leggen iets vast dat de moeite
waard is en dat nu alleen als vinkje bestaat: welke van Hera's vier slachtoffers de speler het
eerst opzocht, of hij Io koos boven Herakles, of Theseus boven Phaëthon. Dat zijn smaakuitspraken
over wat de speler belangrijk vindt, en ze staan al in de save.

Ter vergelijking, de flags die wél op afstand liggen:

| Flag | Van | Naar | Afstand (scènes) |
|---|---|---|---|
| `herakles_harnas` | `CH2_H09` | `CH9_002` | 157 |
| `diomedes` | `CH6_018_PRU`, `CH8_AGA_001` | `CH9_GRI_009` | 42 |
| `aias` | `CH8_ACH_008`, `CH8_AGA_008` | `CH9_GRI_005` | 29 |
| `aias` | `CH8_ACH_008`, `CH8_AGA_008` | `CH9_GRI_005` | 29 |
| `ch8_zijde` | `CH8_ACH_001`, `CH8_AGA_001` | `CH8_EPI_005` | 16 |
| `ch8_zijde` | `CH8_ACH_001`, `CH8_AGA_001` | `CH8_EPI_005` | 16 |
| `herakles_harnas` | `CH2_H09` | `CH3_H01` | 10 |
| `ch1_lijn` | `CH1_A10B`, `CH1_B08`, `CH1_C11` | `CH2_000` | 5 |
| `ch1_lijn` | `CH1_A10B`, `CH1_B08`, `CH1_C11` | `CH2_000` | 5 |
| `ch1_lijn` | `CH1_A10B`, `CH1_B08`, `CH1_C11` | `CH2_000` | 5 |
| `athena` | `CH2_L07B` | `CH2_ATHENA` | 4 |

`herakles_harnas` op afstand 157 is met afstand de sterkste reactiviteit in het spel, en het is
geen toeval dat dat precies het moment is waarop Chronica het meest als een RPG voelt.

## 4. Cosmetische keuzes

**Dit is de belangrijkste lijst van het rapport.**

Van de 103 scènes met een echte keuze (≥2 knoppen) schrijven er **99** niets weg
dat later wordt uitgelezen. De vier uitzonderingen staan onderaan deze paragraaf.

De 99 vallen uiteen in drie soorten, die elk een ander gesprek verdienen:

- **49 houdingsscènes** — de drieslag Clementia / Neutraal / Severitas. Deze tellen op in
  `SP_STATE.approach` en worden acht keer uitgelezen via `{tendency_address}`. Ze zijn dus niet leeg,
  maar het effect is één bijvoeglijk naamwoord in een aanspreking. Zie §5 voor het gat erin.
- **34 routescènes** — de `_route`-splitsingen uit §1a. Deze zijn wél echt leeg.
- **16 scènes met een gewone, ongetagde keuze** die niets vastlegt. Dit zijn de opvallendste,
  want hier verwacht de speler het meest.

### 4a. De 16 gewone keuzes die niets vastleggen

| Hfst | Scène | Regel | Knoppen | Wat de speler denkt te kiezen |
|---|---|---|---|---|
| Proloog | `PRO_001` | 2001 | 2 | Meteen graven of eerst voorzichtig zijn — de allereerste keuze van het spel. |
| Proloog | `PRO_002` | 2033 | 2 | De kist openen of laten liggen. |
| Proloog | `PRO_003` | 2062 | 3 | **De klassekeuze.** Zie de kanttekening hieronder. |
| Proloog | `PRO_005` | 2138 | 2 | De bronzen schijf aanraken of terugtrekken. |
| H1 | `CH1_000` | 2271 | 3 | **Welke van de drie verhalen van Hoofdstuk 1 hij gaat beleven.** De lijnkeuze zelf legt niets vast; pas de eindscène van de lijn schrijft `ch1_lijn`. |
| H1 | `CH1_A01` | 2292 | 2 | Doorlopen naar Sardis of eerst een koopman uithoren. |
| H1 | `CH1_B01` | 2672 | 2 | Doorklimmen of de herder doorvragen over Kronos. |
| H1 | `CH1_B06` | 2858 | 2 | Naar Zeus kijken of naar hoe Ares, Hera en Hermes op Athena reageren. |
| H1 | `CH1_C02` | 2995 | 2 | Prometheus meteen volgen of wachten tot het donker is. |
| H1 | `CH1_C07` | 3169 | 2 | Toekijken hoe Pandora de doos opent, of hoe Epimetheus haar afleidt. |
| H2 | `CH2_000` | 3484 | 5 | **De volgorde waarin hij Hera's vier slachtoffers opzoekt.** Alleen het vinkje wordt onthouden, niet de volgorde. |
| H3 | `CH3_000` | 4719 | 3 | Io of Herakles eerst. |
| H4 | `CH4_000` | 5929 | 3 | Theseus of Phaëthon eerst. |
| H4 | `CH4_T06B` | 6068 | 2 | **Links of rechts in het labyrint** — de enige echte leesval van het spel. Zie de kanttekening hieronder. |
| H5 | `CH5_008` | 7057 | 2 | Met Atalanta meejagen of met Meleager — de enige perspectiefkeuze in Hoofdstuk 5. |
| H9 | `CH9_005` | 10449 | 2 | **Vanaf welke kant hij de val van Troje meemaakt.** Zie de kanttekening hieronder. |

Drie daarvan verdienen een aparte behandeling:

**`PRO_003` (certamen/singleplayer-data.js:2062) — de klassekeuze.** Deze is in mijn classificatie "niets", en dat is
technisch juist maar praktisch misleidend. De keuze loopt via `REWARD:` naar `classId` en `stats`,
en daarmee hangt elk van de 68 STAT-gates in het spel eraan. Het is de meest duurzame keuze die
er is. Ik heb hem niet stilletjes opgewaardeerd omdat het onderscheid tussen het flag-mechanisme
en het REWARD-mechanisme er juist toe doet: **er is geen enkele flag die vastlegt welk wapen de
speler uit de kist haalde**, dus geen enkele NPC kan er ooit iets over zeggen zonder `classId`
rechtstreeks te lezen, en dat gebeurt nergens in de verteltekst.

**`CH4_T06B` (certamen/singleplayer-data.js:6068) — de leesval in het labyrint.** Ariadne fluistert "houd links aan".
Wie rechts gaat, krijgt drie scènes (`CH4_T06R1`, `_R2`, `_R3`) waarin het garen opraakt en de
Minotaurus nadert — en wordt dan teruggezet op `CH4_T06B` om het opnieuw te doen. Dit is de enige
plek in het spel waar slecht lezen wordt afgestraft, en de straf is een herhaling. Het spel
onthoudt niet dat de speler verdwaald is geweest; Theseus, Ariadne en de Minotaurus reageren er
nooit op. Dat maakt het geen faalpad maar een omweg. (Uitgewerkt in fase 4 en fase 7.)

**`CH9_005` (certamen/singleplayer-data.js:10449) — muren of strand.** De enige onherroepelijke vertakking in het spel: de
twee takken komen nooit meer samen. Er wordt geen flag, geen relatie en geen eretitel geschreven
die vastlegt welke kant de speler koos. Vergelijk dat met `CH8_005`, dat exact hetzelfde soort
keuze is en wél `ch8_zijde` + drie relatieverschuivingen schrijft. Hoofdstuk 8 doet het goed en
Hoofdstuk 9 doet daarna hetzelfde ding zonder enige boekhouding — met de Odyssee en de Aeneis
als eerstvolgende hoofdstukken, waarin het uitmaakt of de speler Troje van binnen heeft gezien.

### 4b. Zwaarste houdings- en routescènes

Gesorteerd op gewicht (aantal knoppen, STAT-gates, hoeveelheid tekst ervoor, aanwezige NPC's, illustratie):

| Hfst | Scène | Regel | Titel | Knoppen | Soort |
|---|---|---|---|---|---|
| H6 | `CH6_001` | 7875 | De Stichting van Thebe | 3 | route |
| H1 | `CH1_A10B` | 2612 | Het Water Neemt het Goud | 3 | houding |
| H1 | `CH1_A02` | 2330 | Het Paleis van Sardis | 3 | route |
| H1 | `CH1_C01` | 2972 | De Titaan die Mensen Vormde | 3 | houding |
| H4 | `CH4_T01` | 5950 | Een Belofte in Athene | 3 | houding |
| H6 | `CH6_010` | 8170 | De Waarheid | 3 | houding |
| H7 | `CH7_006` | 8939 | Hecuba's Visioen | 3 | houding |
| H7 | `CH7_020` | 9311 | Chryseis en Briseis | 3 | houding |
| H4 | `CH4_T08` | 6148 | Terug langs de Draad | 3 | route |
| H5 | `CH5_024` | 7573 | De Beproevingen van Aeëtes | 3 | route |
| H1 | `CH1_B08` | 2912 | Wijsheid Neemt Haar Plaats In | 3 | houding |
| H4 | `CH4_T13` | 6361 | De Val van Ikaros | 3 | houding |
| H8 | `CH8_EPI_011` | 10250 | Priamus' Smeekbede | 3 | houding |
| H1 | `CH1_A10` | 2543 | De Rivier de Pactolus | 3 | route |
| H4 | `CH4_P06` | 6556 | Tellus Smeekt om Hulp | 3 | route |
| H5 | `CH5_019` | 7428 | Gespannen Riemen | 3 | route |
| H1 | `CH1_C08` | 3208 | Wat uit de Doos Ontsnapt | 3 | houding |
| H1 | `CH1_C09` | 3229 | Wat Achterblijft | 3 | houding |

### 4c. De vier scènes die het wél doen

| Hfst | Scène | Regel | Wat er wordt vastgelegd |
|---|---|---|---|
| H1 | `CH1_B07` | 2894 | Alle drie de knoppen leiden naar `CH1_B08`, dat `ch1_lijn=B` zet — gelezen door de drie echo's op `CH2_000`. Het is dus de lijn die telt, niet de knop. |
| H2 | `CH2_L07` | 3692 | De vierde, `[STAT:gratia:13]`-knop leidt naar `CH2_L07B`, dat `RELATION: athena=+1` zet — uitgelezen door `ch2_athena_echo_relatie` op `CH2_ATHENA`. De enige relatieopbouw vóór Hoofdstuk 6. |
| H6 | `CH6_018` | 8458 | De optionele `[STAT:prudentia:12]`-knop zet `RELATION: diomedes=+1`. Boogschutter-exclusief bij startwaarden. |
| H8 | `CH8_005` | 9495 | `ch8_zijde` + drie relatieverschuivingen. Het enige moment in het spel dat doet wat het hele spel zou moeten doen. |

## 5. Schijnkeuzes

Er is geen enkele scène waarin álle knoppen naar hetzelfde punt leiden zonder dat er íéts wordt
geteld. Maar er is wel een systematische schijnkeuze binnen die scènes, en het zijn er 46:

**Elke `[NEUTRAL]`-optie is een strikte no-op.** `spHookApproach()` (`certamen/singleplayer.js`)
verhoogt alleen `clementia` of `severitas`; `[NEUTRAL]` valt door beide `if`-takken heen en
verandert niets. De knop leidt bovendien altijd naar dezelfde scène als zijn twee buren.

Dat is niet per se fout — het is de bedoelde "derde, twijfelende optie" (zie de toelichting bij
`CNSParser.APPROACH_TAG_RE`). Maar het gevolg is dat de speler die consequent weigert te oordelen
— een volstrekt legitieme rol, en juist de rol die bij een *toeschouwende boodschapper* past —
aan het eind van negen hoofdstukken een leeg profiel heeft. `spApproachTendency()` geeft dan
"neutraal", precies hetzelfde antwoord als een speler die nog nooit een keuze heeft gemaakt.
Het spel kan die twee niet uit elkaar houden.

| Hfst | Aantal `[NEUTRAL]`-opties |
|---|---|
| H1 | 13 |
| H2 | 8 |
| H3 | 4 |
| H4 | 6 |
| H5 | 3 |
| H6 | 3 |
| H7 | 4 |
| H8 | 3 |
| H9 | 7 |
| **Totaal** | **51** |

Een tweede, kleinere schijnkeuze: bij de zes hub-scènes (`CH1_000` … `CH4_000`) is de *volgorde*
waarin de speler de lijnen doet volledig vrij en volledig vergeten. Alleen "gedaan/niet gedaan"
wordt bijgehouden.

## 6. NPCs zonder geheugen

Ik heb de naam van elk personage uit `SP_CODEX_PERSONS` gezocht in de verteltekst van alle 476
scènes (alleen binnen het scèneblok tot `END`, zodat auteurscommentaar tussen de hoofdstukken
niet meetelt). Resultaat: **46 personages komen in twee of meer hoofdstukken voor.**
Vijf daarvan hebben een relatiescore. De overige 41 hebben niets.

### 6a. De vijf mét geheugen

| Personage | Hoofdstukken | Relatie opgebouwd in | Uitgelezen |
|---|---|---|---|
| Pallas Athena (Minerva) | H1, H2, H3, H4, H5, H6, H7, H8, H9 | `CH2_L07B` (+1) | `ch2_athena_echo_relatie` |
| Diomedes | H3, H6, H8, H9 | `CH6_018_PRU` (+1), `CH8_AGA_001` (+1) | `ch9_gri009_echo_diomedes_geschiedenis` |
| Achilles | H7, H8, H9 | `CH8_ACH_008` (+1) | **nergens** |
| Odysseus | H7, H8, H9 | `CH8_AGA_008` (+1) | **nergens** |
| Agamemnon | H7, H8 | `CH8_AGA_008` (+1) | **nergens** |

Drie van de vijf worden nooit uitgelezen. Daarnaast bestaan er relatiescores voor `menelaos`,
`aias` en `phoenix`, die in mijn tekstscan niet als terugkerend uitkwamen omdat hun naam maar in
één hoofdstuk valt — `aias` wordt wél uitgelezen (in de Griekse tak van Hoofdstuk 9),
`menelaos` en `phoenix` niet. Volledige stand: **acht relatiescores, drie uitgelezen, vijf dood.**

### 6b. De 41 zonder geheugen, op omvang

| Personage | Hoofdstukken | Scènes | Waarom dit een gemiste kans is |
|---|---|---|---|
| Herakles (Hercules) | H2, H3, H4, H5, H7, H9 | 62 | Het meest terugkerende sterfelijke personage van het spel. Geeft de speler in `CH2_H09` persoonlijk zijn harnas en in `CH3_H25` een gouden appel, en herkent hem in `CH3_H01_HARNAS` — maar er is geen score die meegroeit. |
| Apollo | H2, H6, H7, H8, H9 | 9 | Straft in `CH8_001` het hele Griekse kamp en stuurt in `CH9` de pijl die Achilles doodt. Nooit een houding tegenover de speler. |
| Bacchus (Dionysus) | H1, H2, H4, H6 | 12 | Verschijnt in vier hoofdstukken als de god die vloeken zowel geeft als opheft; redt Ariadne. Geen enkel geheugen aan de speler. |
| Thetis | H1, H7, H8, H9 | 8 | Loopt van Hephaistos' redding (H1) via haar eigen bruiloft (H7) naar haar zoons dood (H8/H9). Vier hoofdstukken, nul opbouw. |
| Diana (Artemis) | H2, H3, H6, H7 | 6 | Verstoot Kallisto, spaart Herakles' hinde, eist Iphigenia. Drie morele momenten waarop de speler naast haar staat. |
| Paris | H7, H8, H9 | 16 | 16 scènes over drie hoofdstukken, van herdersjongen tot de man die Achilles doodt. De speler ziet zijn hele boog en kan nergens iets van hem vinden. |
| Helena | H7, H8, H9 | 15 | 15 scènes. Keert in de Odyssee terug als gastvrouw van Telemachus — er is nu niets om op terug te grijpen. |
| Priamus | H7, H8, H9 | 15 | 15 scènes, inclusief de smeekbede die de Ilias afsluit. Sterft in Hoofdstuk 9 zonder dat het spel weet of de speler bij die nacht in de tent was. |
| Hecuba | H7, H8, H9 | 9 | Valt in `CH9_GRI_016` toe aan Odysseus — een van de sterkste beelden van het slothoofdstuk. |
| Philoktetes | H5, H7, H9 | 6 | Argonaut (H5), achtergelaten (H7), teruggehaald (H9). Precies het profiel van een personage met een wrok jegens de mensen die hem lieten liggen — en de speler stond erbij. |
| Europa | H3, H6, H7 | 3 | Alleen als verteld verhaal aanwezig; laag rendement. |
| Calchas | H7, H8, H9 | 3 | Spreekt drie keer de waarheid die niemand wil horen, in drie hoofdstukken. |
| Zeus (Jupiter) | H1, H2 | 24 | 24 scènes in twee hoofdstukken, uitsluitend als handelend god, nooit als iemand die de speler opmerkt. |
| Prometheus | H1, H3 | 20 | De speler kan hem in `CH1_C11` recht aankijken op zijn rots; Chiron staat zijn onsterfelijkheid aan hem af in `CH3_H07`. Twee hoofdstukken, geen verbinding. |
| Midas | H1, H4 | 18 | 18 scènes; wordt in `CH2_000` genoemd door de boodschapper als de speler lijn A deed. |
| Theseus | H4, H5 | 17 | Loopt in `CH5_003` letterlijk langs de speler heen, jaren vóór het verhaal dat de speler al kende. Uitgelezen kans voor een score. |
| Latona (Leto) | H2, H6 | 15 | Haar wraak in `CH6_003` (Niobe) is direct gevolg van wat de speler in H2 zag. |
| Jason | H5, H6 | 14 | Hoofdpersoon van een heel hoofdstuk. Geen enkele relatie. |
| Patroklos | H8, H9 | 14 | De speler kan hem in `CH8_ACH_006_PRU` helpen de gewonden te verzorgen — en hij glimlacht voor het eerst sinds de ruzie. Dat wordt niet vastgelegd, en hij sterft twee scènes later. |
| Hera (Juno) | H1, H2 | 12 | De antagonist van twee hele hoofdstukken. Geen houding jegens de speler mogelijk. |
| Ariadne | H4, H5 | 11 | Verraadt haar vader (H4) en wordt in `CH5_025` expliciet naast Medea gelegd. |
| Argos | H3, H5 | 11 | De scheepsbouwer die de Argo door de Symplegades loodst; de speler kan hem in `CH5_016_AGI` helpen. |
| Tydeus | H5, H6 | 11 | Drie confrontaties met zijn korte lont (H5), dan zijn dood (H6), dan zijn zoon. De speler kan hem in `CH5_019_VIS` fysiek tegenhouden. |
| Hector | H8, H9 | 11 | 11 scènes over twee hoofdstukken, en in Hoofdstuk 9 beleeft de speler zijn dood van de andere kant. |
| Semele | H2, H6 | 9 | Haar zoon Bacchus en haar neef Pentheus dragen het gevolg in H6. |
| Minos | H3, H4 | 9 | Zijn stier in H3, zijn labyrint in H4. |
| Andromache | H8, H9 | 7 | Van de muur in H8 naar oorlogsbuit in H9. Sterkste tragische boog van het slothoofdstuk. |
| Hephaistos (Vulcanus) | H1, H3 | 5 | Splijt Zeus' hoofd (H1), smeedt Achilles' schild (H8). De speler raapt in `CH1_B08` een splinter van zijn bijl op. |
| Kadmos | H6, H7 | 5 | Sticht Thebe (H6), grootvader van Semele en Pentheus. |
| Astyanax | H8, H9 | 5 | Opgetild op de muur (H8), van de muur geworpen (H9). Vijf scènes, maximale lading. |
| Nestor | H5, H8 | 4 | Argonaut (H5), raadgever die aandringt op verzoening (H8), en zijn zoon Antilochos sterft in H9. Keert terug in de Odyssee. |
| Niobe | H6, H7 | 4 | Haar hoogmoed (H6) staat model voor het patroon dat H7 opent. |
| Megara | H2, H3 | 3 | Alleen als slachtoffer aanwezig. |
| Aeëtes | H5, H6 | 3 | Zijn drakentanden verbinden H5 expliciet met H6. |
| Telamon | H5, H8 | 3 | Argonaut in `CH5_002`, en zijn zoon Aias is in H8/H9 een van de belangrijkste figuren. De tekst wijst er twee keer zelf op. |
| Chryseis | H7, H8 | 3 | Aanleiding van de hele Ilias-plot. |
| Briseis | H7, H8 | 3 | Idem; wordt in `CH8_EPI_005` teruggegeven zonder dat iemand haar iets vraagt. |
| Epaphus | H3, H4 | 2 | Zoon van Io (H3), spotter van Phaëthon (H4) — een nette generatiebrug. |
| Peleus | H5, H7 | 2 | Argonaut (H5), bruidegom (H7), vader van Achilles. Krijgt al een onvoorwaardelijke echo; een score zou meer kunnen. |
| Antilochos | H8, H9 | 2 | Brengt het ergste nieuws (H8), sterft zelf (H9). |
| Aeneas | H8, H9 | 2 | Gered door Venus in `CH8_AGA_004`, vlucht in `CH9_TRO_017`. **Hoofdpersoon van de Aeneis.** |

Twee namen uit die lijst springen eruit omdat de volgende hoofdstukken over hen gaan:
**Aeneas** en **Nestor**. Beiden lopen nu door het spel zonder dat er ook maar één bit over hen
wordt bewaard. Dat werk ik uit in fase 5.

## 7. Klasse- en statblindheid

Een klasse-exclusief moment definieer ik als een `[STAT:…]`-keuze die bij **startwaarden**
precies één van de drie klassen kan indrukken. Skillpoints kunnen dat later verschuiven, maar
de startwaarden zijn wat het hoofdstuk-voor-hoofdstuk-ontwerp aanstuurt.

| Hoofdstuk | Gates | Hopliet haalbaar / exclusief | Boogschutter | Cavalerist |
|---|---|---|---|---|
| Proloog | 0 | **0 / 0** ⚠ | **0 / 0** ⚠ | **0 / 0** ⚠ |
| H1 De Namen van de Wereld | 10 | 7 / 5 | 4 / 2 | **3 / 1** ⚠ |
| H2 De Werken van de Helden | 11 | 6 / 5 | 5 / 4 | **2 / 1** ⚠ |
| H3 Beloften van Goden en Mensen | 9 | 6 / 6 | **0 / 0** ⚠ | 3 / 3 |
| H4 Het Labyrint van Herinneringen | 6 | 3 / 3 | **0 / 0** ⚠ | 3 / 3 |
| H5 Het Gulden Vlies | 12 | 6 / 5 | 7 / 6 | **1 / 0** ⚠ |
| H6 De Vloek van Thebe | 11 | 5 / 2 | 9 / 6 | **3 / 0** ⚠ |
| H7 De Appel der Tweedracht | 2 | **1 / 1** ⚠ | **1 / 1** ⚠ | **0 / 0** ⚠ |
| H8 De Wrok van Achilles | 4 | 2 / 2 | 2 / 2 | **0 / 0** ⚠ |
| H9 Ilion in Vlammen | 3 | **0 / 0** ⚠ | 3 / 3 | **0 / 0** ⚠ |

⚠ = onder de twee exclusieve momenten in dit hoofdstuk.

Dat levert deze markeringen op:

| Klasse | Hoofdstukken onder de twee exclusieve momenten |
|---|---|
| Hopliet | H7, H9 |
| Boogschutter | H3, H4, H7 |
| Cavalerist | H1, H2, H5, H6, H7, H8, H9 |

### 7a. `ingenium` bestaat niet

Van de 68 STAT-gates in het spel gebruiken er **nul** `ingenium`. Verdeling:

| Stat | Gates | Domein volgens `SP_STAT_DEFS` |
|---|---|---|
| `vis` | 18 | Brute kracht, dragen, forceren, wapengeweld van dichtbij |
| `agilitas` | 16 | Snelheid, evenwicht, sluipen, boogschieten, precisie |
| `prudentia` | 15 | Opmerkingsgave, mensenkennis, voortekenen lezen |
| `robur` | 11 | Uithoudingsvermogen, honger, kou, gif, wonden |
| `gratia` | 8 | Overtuigen, gezag, gastvrijheid winnen, bezingen |
| `ingenium` | 0 ⚠ | Kennis, talen, tekst en inscripties, strategie, raadsels |

Dit is de scherpste bevinding van de hele fase. `ingenium` is gedefinieerd als *"kennis, talen,
tekst en inscripties, strategie, raadsels"* — de letterlijke kern van wat Chronica Classica als
lesmiddel doet. Het spel bevat 71 puzzelscènes over naamvallen, werkwoordstijden en Griekse
transliteratie, en er is geen enkele plek waar een hoge `ingenium` daar iets aan verandert:
geen makkelijker variant, geen extra hint, geen keuze die alleen opengaat als je de inscriptie
kunt lezen. De stat die het onderwerp van het spel ís, is de enige die niets doet.

Bovendien is `ingenium` de **hoogste startstat van de Cavalerist** (15). Zijn tweede stat,
`gratia`, komt acht keer voor — allemaal in Hoofdstuk 1 t/m 4, en daarna nooit meer.

### 7b. De Cavalerist verdwijnt na Hoofdstuk 4

| Hoofdstuk | Gates | Waarvan de Cavalerist er haalt |
|---|---|---|
| H1 De Namen van de Wereld | 10 | 3 |
| H2 De Werken van de Helden | 11 | 2 |
| H3 Beloften van Goden en Mensen | 9 | 3 |
| H4 Het Labyrint van Herinneringen | 6 | 3 |
| H5 Het Gulden Vlies | 12 | 1 |
| H6 De Vloek van Thebe | 11 | 3 |
| H7 De Appel der Tweedracht | 2 | 0 |
| H8 De Wrok van Achilles | 4 | 0 |
| H9 Ilion in Vlammen | 3 | 0 |

In Hoofdstuk 7, 8 en 9 samen — negen gates, en de drie hoofdstukken die het masterplan zelf
"het echte werk" noemt — haalt de Cavalerist er **nul**. Een leerling die in de proloog de
ruitersporen koos, drukt in de hele Trojaanse Oorlog geen enkele knop in die een ander niet
ook had kunnen indrukken.

### 7c. Wat klasse-blindheid hier precies betekent

Buiten de 68 STAT-gates is er **geen enkele plek** waar de drie klassen een andere ervaring
krijgen. Concreet:

- Geen enkele scène heeft een klasse-afhankelijke tekstvariant. `SpTextResolver` kent wel
  `{eigen_wapen}` (gebruikt in `CH9_002`), maar dat is één woord in één scène.
- Geen enkele NPC spreekt de speler aan op zijn wapen, zijn klasse of zijn manier van vechten.
- Geen enkele payoff heeft een klasse in zijn conditie.
- De Combat-bridges (15 stuks) gebruiken de Battle Mode-klasse, maar de omringende verteltekst
  is identiek.

De klassekeuze uit de proloog bepaalt dus welke 15 tot 36 van de 68 knoppen indrukbaar zijn,
en verder niets. Voor een systeem dat het masterplan als een van de drie zuilen benoemt
("RPG-klasse & stat-integratie"), is dat een smalle basis.
