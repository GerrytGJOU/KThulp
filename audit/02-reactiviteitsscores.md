# Fase 2 — Reactiviteitsscore per hoofdstuk

> Scores 0–3 op zeven punten, streng toegepast. **3 is niet "goed genoeg", 3 is "dit doet wat
> Mass Effect / Dragon Age / Baldur's Gate 3 doet".** Onder die lat is een 2 al een compliment.
> Maximum per hoofdstuk: 21.
>
> Verwijzingen naar `certamen/singleplayer-data.js`, met scène-id.

---

## Twee bevindingen die vóór de rubric uit lopen

Twee dingen gelden voor **alle tien** hoofdstukken en verklaren waarom twee kolommen bijna
volledig leeg zijn. Ik zet ze hier apart, zodat ze niet tien keer herhaald hoeven te worden.

### Falen bestaat niet (punt 6)

- **Puzzels kunnen niet mislukken.** Elk van de zes puzzeltypes reageert op een fout antwoord
  met een hint en "probeer opnieuw" (`spCheckPuzzle`, `spCheckMCPuzzle`, `spCheckTileSwapPuzzle`,
  `spMatchTapRight` in `certamen/singleplayer.js`). Er is geen teller, geen tijdslimiet, geen
  gevolg. De speler kan blind alle knoppen afgaan.
- **Gevechten kunnen niet verloren worden.** In `spStartCombatFromScene()` krijgt alleen de
  *vijand* HP. De speler heeft er geen. Een fout antwoord kost één beurt EP
  (`spCombatAnswer`); daarna komt gewoon de volgende vraag. Elk van de vijftien Combat-bridges
  eindigt onvermijdelijk in winst — de enige variabele is hoe lang je erover doet.
- **De enige plek in het spel waar verkeerd lezen een gevolg heeft** is `CH4_T06B`, de
  links/rechts-splitsing in het labyrint. Het gevolg is een lus van drie scènes terug naar
  hetzelfde keuzemoment.

Punt 6 scoort daarom overal 0, behalve Hoofdstuk 4 (een 1 voor die ene lus).

### De speler heeft geen zichtbaar profiel (punt 4, gedeeltelijk)

Buiten de 68 `[STAT:…]`-knoppen bestaat er geen enkele klasse- of stat-afhankelijke tekst.
`{tendency_address}` — de enige plek waar de opgebouwde Clementia/Severitas-houding
zichtbaar wordt — komt in het hele spel **vier keer** voor, verspreid over Hoofdstuk 3, 4 en 6,
en levert telkens één bijvoeglijk naamwoord op in een aanspreking door Athena of de Boodschapper.
Hoofdstuk 1, 2, 5, 7, 8 en 9 gebruiken hem nul keer. In Hoofdstuk 1 alleen al staan 39
houdingskeuzes die vervolgens nergens in dat hoofdstuk terugkomen.

---

## Proloog — "De Boer van Latium" · **5 / 21**

| # | Punt | Score |
|---|---|---|
| 1 | Herinnert de wereld zich de speler? | **0** |
| 2 | Duurzame gevolgen? | **2** |
| 3 | Echt kantelpunt? | **1** |
| 4 | Reageert het op wie de speler is? | **0** |
| 5 | Eigen mening bij NPC's? | **0** |
| 6 | Is falen interessant? | **0** |
| 7 | Kan de speler het gevolg zien? | **2** |

**1 · 0.** Er is niets om naar terug te verwijzen. Terecht nul, geen verwijt.

**2 · 2.** `PRO_004A/B/C` zet via `REWARD:` de `classId` en het hele statblok. Dat is de meest
duurzame beslissing van het spel: alle 68 latere STAT-gates hangen eraan. Geen 3, omdat er geen
enkele **flag** wordt geschreven — geen NPC kan later zeggen "jij bent de boer die de boog nam",
want dat feit staat nergens in een vorm die de verteltekst kan lezen.

**3 · 1.** De wapenkeuze sluit twee van de drie statprofielen definitief af. Maar `PRO_001`,
`PRO_002` en `PRO_005` zijn alle drie een keuze tussen "nu" en "zo meteen": `PRO_002B` bestaat
letterlijk om te vertellen dat je het toch niet kunt laten rusten. Niemand kan sterven, niets kan
mislukken.

**5 · 0.** Eén NPC (de Boodschapper), die instrueert en niet oordeelt.

**7 · 2.** De sterkste terugkoppeling van het hele spel, en dat is opvallend voor de proloog:
vier eretitels, een toast ("Je pad is bepaald"), en een regel in de Kroniek. De speler voelt
onmiddellijk dat er iets is vastgelegd. Geen 3 omdat het puur systeem-terugkoppeling is —
niemand in de fictie merkt iets op.

---

## Hoofdstuk 1 — "De Namen van de Wereld" · **8 / 21**

| # | Punt | Score |
|---|---|---|
| 1 | Herinnert de wereld zich de speler? | **0** |
| 2 | Duurzame gevolgen? | **2** |
| 3 | Echt kantelpunt? | **2** |
| 4 | Reageert het op wie de speler is? | **1** |
| 5 | Eigen mening bij NPC's? | **1** |
| 6 | Is falen interessant? | **0** |
| 7 | Kan de speler het gevolg zien? | **2** |

**1 · 0.** Streng, maar terecht: de proloog ligt er wél, en er wordt geen enkele keer naar
verwezen. De Boodschapper vraagt niet naar het wapen, de kist of het veld in Latium. De speler
loopt Hellas binnen alsof hij er net is geboren.

**2 · 2.** `ch1_lijn=A/B/C` wordt in `CH1_A10B`/`CH1_B08`/`CH1_C11` gezet en in `CH2_000` door
drie wederzijds exclusieve echo's uitgelezen — één van de twee plekken in het spel waar een keuze
een hoofdstukgrens oversteekt. Ook `ch1_voltooid` ontgrendelt `armor:robe`. Geen 3: de payoff is
één alinea in de eerste scène van het volgende hoofdstuk, daarna nooit meer.

**3 · 2.** De drie lijnen convergeren niet. Wie Midas kiest, ziet de geboorte van Athena en het
vuur van Prometheus **nooit** — twee volledige verhalen van ~20 scènes gaan definitief dicht. Dat
is een echte, onherroepelijke routesluiting, en het is de op één na sterkste van het spel. Geen 3
omdat er geen mens of god iets verliest: de keuze sluit inhoud af, geen relaties of levens.

**4 · 1.** 10 STAT-gates, waarvan 5 exclusief voor de Hopliet, 2 voor de Boogschutter, 1 voor de
Cavalerist. Dat is bruikbaar. Maar er zijn 39 houdingskeuzes in dit hoofdstuk en `tendency_address`
komt er nul keer voor — de speler bouwt hier zijn hele morele profiel op zonder dat het hoofdstuk
er ook maar één keer iets mee doet.

**5 · 1.** `CH1_B06B` is de enige plek in het hele spel waar NPC's een eigen mening over elkáár
hebben: Ares kijkt jaloers naar Athena's speer, Hera berekenend, Hermes verheugd. Dat is precies
het juiste soort scène — maar hij is optioneel, één alinea lang, en verandert niets. Niemand heeft
een mening over de spéler.

**7 · 2.** Drie souvenirs (gouden roos, bronssplinter, kooltje), drie eretitels, en in `CH1_ROBE`
de mantel die zichtbaar in de avatar verschijnt. Dat laatste is het beste moment: iets wat de
speler deed, is nu aan hem te zien.

---

## Hoofdstuk 2 — "De Werken van de Helden" · **11 / 21**

| # | Punt | Score |
|---|---|---|
| 1 | Herinnert de wereld zich de speler? | **2** |
| 2 | Duurzame gevolgen? | **2** |
| 3 | Echt kantelpunt? | **1** |
| 4 | Reageert het op wie de speler is? | **1** |
| 5 | Eigen mening bij NPC's? | **2** |
| 6 | Is falen interessant? | **0** |
| 7 | Kan de speler het gevolg zien? | **3** |

**1 · 2.** Het beste openingsmoment van het spel. `CH2_000` draagt drie wederzijds exclusieve
echo's op `ch1_lijn`, en de Boodschapper spreekt de speler ongevraagd aan op wat hij *zelf* heeft
gezien: *"Midas leerde dat een wens zonder grenzen een vloek is. Onthoud dat, terwijl je Hera's
jaloezie volgt."* Dat is exact de juiste vorm — kort, ongevraagd, en het bindt het vorige verhaal
aan het volgende. Daarnaast `ch2_athena_echo_relatie` op `CH2_ATHENA`. Geen 3 omdat het bij deze
twee momenten blijft: de resterende 61 scènes verwijzen nergens naar de speler.

**2 · 2.** `herakles_harnas` (`CH2_H09`) is de sterkste flag van het spel: uitgelezen in `CH3_H01`
(als deur) én in `CH9_002` (als echo), 157 scènes verderop. Bovendien ontgrendelt hij `armor:licht`,
dus de speler *draagt* het gevolg. De vier lijnflags zijn administratie.

**3 · 1.** De fragmenten-gate dwingt af dat alle vier de lijnen worden gespeeld. Er sluit dus
niets — het hoofdstuk is expliciet ontworpen om geen routes af te snijden. Verdedigbaar
(volledigheid boven vertakking), maar op deze rubric kost het punten.

**4 · 1.** 11 gates, redelijk verdeeld (5/4/1), geen `tendency_address`, 24 houdingskeuzes zonder
uitlezing.

**5 · 2.** Twee dingen tillen dit boven de rest uit. `CH2_L07B` is de enige plek vóór Hoofdstuk 8
waar een NPC een score aan de speler koppelt: spreek Delos aan als gelijke, en Athena's gezicht
wordt "iets minder gesloten" — daarna hérinnert ze zich dat in `CH2_ATHENA`. En `CH2_H09` bevat het
vierde-wand-moment waarin Herakles de speler recht aankijkt en hem zijn harnas geeft. Dat is een NPC
die de speler *ziet*. Geen 3: het zijn twee momenten in 63 scènes, en Athena's score kan alleen
groeien via een `[STAT:gratia:13]`-knop, dus in de praktijk alleen bij de Cavalerist.

**7 · 3.** Het enige punt in de hele audit waar ik een 3 geef zonder voorbehoud. Vier
Herinneringsfragmenten met elk een toast, vier souvenirs, vijf eretitels, een zichtbare
hub-voortgang met ✓-vinkjes, een `[REQUIRE:fragments=4]`-knop die pas verschijnt als je alles hebt,
én een harnas dat je daarna aan je avatar ziet. De speler weet op elk moment precies waar hij staat
en dat het is opgeslagen.

---

## Hoofdstuk 3 — "Beloften van Goden en Mensen" · **6 / 21**

| # | Punt | Score |
|---|---|---|
| 1 | Herinnert de wereld zich de speler? | **2** |
| 2 | Duurzame gevolgen? | **0** |
| 3 | Echt kantelpunt? | **0** |
| 4 | Reageert het op wie de speler is? | **1** |
| 5 | Eigen mening bij NPC's? | **1** |
| 6 | Is falen interessant? | **0** |
| 7 | Kan de speler het gevolg zien? | **2** |

**1 · 2.** `CH3_H01` draagt de enige `deur`-payoff van het spel: heb je Herakles' harnas, dan
verschijnt er een **extra keuzeknop** die naar een scène leidt die anders niet bestaat
(`CH3_H01_HARNAS`, de enige payoff-only scène in het spel). Herakles ziet zijn eigen oude brons om
je schouders en glimlacht. Dat is het mechanisme dat het hele spel zou moeten gebruiken, hier
precies één keer toegepast. Dat rechtvaardigt een 2 ondanks een verder kale rest.

**2 · 0.** Hoofdstuk 3 schrijft 17 flags, waarvan er **nul** ooit na dit hoofdstuk worden gelezen.
Vijf van de zes zijn `_route`-flags. De twee lijnflags dienen alleen hun eigen ✓-vinkje.

**3 · 0.** Beide lijnen zijn verplicht (fragmenten-gate op 6). Niets sluit, niemand verandert.
Chiron wordt geraakt door de gifpijl in `CH3_H06` en dat is onafwendbaar; Hippolyte sterft in
`CH3_H17` en dat is onafwendbaar.

**4 · 1.** 9 gates, maar de Boogschutter haalt er **nul exclusief** — `robur` (5×) en `gratia` (3×)
zijn zijn twee zwakste stats. Wel de eerste twee `{tendency_address}`-gebruiken van het spel
(`CH3_ATHENA`). Eén bijvoeglijk naamwoord na drie hoofdstukken opbouwen.

**5 · 1.** Athena stapt hier van toeschouwer naar bondgenoot: in `CH3_H10` brengt ze Hephaistos'
ratel mee. Maar dat gebeurt met of zonder de speler, en er wordt niets vastgelegd.

**7 · 2.** Twee souvenirs, drie eretitels, twee fragmenten — en vooral die extra knop in `CH3_H01`,
die zichtbaar maakt dat een eerdere keuze iets heeft opengezet.

---

## Hoofdstuk 4 — "Het Labyrint van Herinneringen" · **5 / 21**

| # | Punt | Score |
|---|---|---|
| 1 | Herinnert de wereld zich de speler? | **1** |
| 2 | Duurzame gevolgen? | **0** |
| 3 | Echt kantelpunt? | **0** |
| 4 | Reageert het op wie de speler is? | **1** |
| 5 | Eigen mening bij NPC's? | **0** |
| 6 | Is falen interessant? | **1** |
| 7 | Kan de speler het gevolg zien? | **2** |

**1 · 1.** Zes tekstuele terugverwijzingen, allemaal onvoorwaardelijk. `CH4_T10` noemt Bacchus
"de god die je al kent van koning Midas' vloek (Hoofdstuk 1)" — maar dat staat er ook als de
speler lijn B of C deed en Bacchus dus nooit heeft ontmoet. Dat is geen geheugen, dat is een
verteller die aanneemt. (Zie ook fase 8: die expliciete "(Hoofdstuk 1)" is bovendien een
immersiebreuk.)

**2 · 0.** Elf flags geschreven, nul gelezen na dit hoofdstuk.

**3 · 0.** Het hoofdstuk gaat *over* onherroepelijkheid — Aegeus springt, Ikaros valt, Ariadne
blijft achter — en niets daarvan kan de speler beïnvloeden of ook maar registreren. Dat is de
scherpste ironie in de audit: het thema is "een belofte die niemand meer ongedaan kan maken", en
het is het hoofdstuk met de minste vastgelegde gevolgen.

**4 · 1.** 6 gates, opnieuw nul exclusief voor de Boogschutter (alleen `robur` en `gratia`).
Eén `tendency_address` in `CH4_ATHENA`.

**5 · 0.** Geen enkele relatie. Ariadne, Theseus, Daidalos, Sol en Aegeus zijn allemaal
personages met een uitgesproken houding tegenover elkáár, en geen van hen merkt de speler op.

**6 · 1.** Het enige punt in het spel dat hier boven nul komt. `CH4_T06B` is een echte leesval:
Ariadne fluistert "houd links aan", en wie niet leest gaat rechts. Drie scènes lang loopt het
garen op en nadert de Minotaurus — goed geschreven, echt spannend — en dan word je teruggezet
op `CH4_T06B`. Geen ander verhaal, geen litteken, geen NPC die het weet. Een 1, want de aanzet
is er en alleen de afloop ontbreekt.

**7 · 2.** Twee souvenirs, drie eretitels, twee fragmenten.

---

## Hoofdstuk 5 — "Het Gulden Vlies" · **6 / 21**

| # | Punt | Score |
|---|---|---|
| 1 | Herinnert de wereld zich de speler? | **2** |
| 2 | Duurzame gevolgen? | **1** |
| 3 | Echt kantelpunt? | **0** |
| 4 | Reageert het op wie de speler is? | **1** |
| 5 | Eigen mening bij NPC's? | **0** |
| 6 | Is falen interessant? | **0** |
| 7 | Kan de speler het gevolg zien? | **2** |

**1 · 2.** `CH5_003` is inhoudelijk het mooiste terugverwijsmoment van het spel: Theseus loopt de
kade op, *"niet omdat hij opvalt tussen al die andere helden, maar omdat je hem al kent"* — en de
speler weet wat hem met zijn vader gaat gebeuren terwijl Theseus dat nog niet weet. `CH5_025` legt
Medea expliciet naast Ariadne. Beide onvoorwaardelijk, want Hoofdstuk 4 is verplicht. Geen 3: het
is de verteller die zich iets herinnert, niet de wereld.

**2 · 1.** Alleen `ch5_bemanning_uitrusting` (`CH5_006`), en die is onvoorwaardelijk — iedereen
krijgt hem. Hij ontgrendelt wel twee avataronderdelen, dus er is iets dat na dit hoofdstuk rendert.
De overige 18 flags zijn `_route`-flags.

**3 · 0.** Geen. Herakles blijft achter in `CH5_015` en dat is onafwendbaar. Medea's wraak in
`CH5_029` is onafwendbaar. Zelfs `CH5_008` — de perspectiefkeuze Atalanta/Meleager — is één scène
lang en komt daarna meteen weer samen.

**4 · 1.** De meeste gates van het spel (12), en de Cavalerist haalt er **nul exclusief**.
`gratia` komt in dit hoofdstuk niet meer voor. Geen `tendency_address`.

**5 · 0.** Dit is het pijnlijkste nulpunt van de hele audit. `CH5_002` en de negen cameo-clusters
zetten in één hoofdstuk **veertien** benoemde helden op één schip: Peleus, Telamon, Laertes, Argos,
Theseus, Tydeus, Atalanta, Meleager, Kastor, Polydeukes, Orpheus, Nestor, Philoktetes, Jason.
Onder hen de vaders van Achilles, Ajax en Odysseus. Er wordt over geen van hen ook maar één bit
bewaard. Dit is de goedkoopste plek in het hele spel om tientallen latere payoffs te zaaien, en
hij staat volledig leeg. (Uitgewerkt in fase 3 en fase 5.)

**7 · 2.** Eén souvenir, twee eretitels, en de uitrusting bij `CH5_006` die zichtbaar in de avatar
verschijnt.

---

## Hoofdstuk 6 — "De Vloek van Thebe" · **8 / 21**

| # | Punt | Score |
|---|---|---|
| 1 | Herinnert de wereld zich de speler? | **2** |
| 2 | Duurzame gevolgen? | **2** |
| 3 | Echt kantelpunt? | **0** |
| 4 | Reageert het op wie de speler is? | **1** |
| 5 | Eigen mening bij NPC's? | **1** |
| 6 | Is falen interessant? | **0** |
| 7 | Kan de speler het gevolg zien? | **2** |

**1 · 2.** De dichtste concentratie terugverwijzingen van het spel: negen scènes. `CH6_002` is
de sterkste — de drakentanden van Kadmos zijn dezelfde soort als die van Aeëtes in Colchis, en
Athena zegt er iets over dat het patroon van het hele hoofdstuk blootlegt. Daarnaast Tydeus uit
Hoofdstuk 5 (`CH6_012`), Latona uit 2 (`CH6_003`), Europa uit 3. Allemaal onvoorwaardelijk.

**2 · 2.** `CH6_018_PRU` zet `RELATION: diomedes=+1`, dat drie hoofdstukken later in
`CH9_GRI_009` wordt uitgelezen. De op één na langste boog van het spel. Geen 3: het is één
optionele knop, `[STAT:prudentia:12]`, en dus bij startwaarden alleen voor de Boogschutter.

**3 · 0.** Geen. `ch6_diomedes_epigonen` wordt onvoorwaardelijk gezet en nooit gelezen.

**4 · 1.** 11 gates, maar de Cavalerist haalt er nul exclusief — geen `gratia`, geen `ingenium`.
Eén `tendency_address` in `CH6_021`.

**5 · 1.** `CH6_018_PRU` is een goed moment: geen woorden, alleen de riemen van zijn vaders
wapenrusting vastmaken, en *"hij knikt kort, dankbaarder dan hij laat blijken."* Precies de juiste
toon. Het is er één, in vijftig scènes.

**7 · 2.** Eén souvenir, twee eretitels, en de onthulling van het Museum van Mnemosyne — waar de
verzamelde souvenirs onder stolpen staan tussen duizenden lege sokkels. Dat beeld doet meer voor
"mijn keuzes worden bewaard" dan welke toast ook.

---

## Hoofdstuk 7 — "De Appel der Tweedracht" · **3 / 21**

| # | Punt | Score |
|---|---|---|
| 1 | Herinnert de wereld zich de speler? | **1** |
| 2 | Duurzame gevolgen? | **0** |
| 3 | Echt kantelpunt? | **0** |
| 4 | Reageert het op wie de speler is? | **0** |
| 5 | Eigen mening bij NPC's? | **0** |
| 6 | Is falen interessant? | **0** |
| 7 | Kan de speler het gevolg zien? | **2** |

**De laagste score van het spel, en uitgerekend in het hoofdstuk dat zichzelf aankondigt met
"Het echte werk begint nu."**

**1 · 1.** Twee payoffs (`ch7_peleus_bruiloft_echo` op `CH7_004`, `ch7_philoktetes_lemnos_echo`
op `CH7_018`), allebei **onvoorwaardelijk** — ze staan er hoe dan ook, want Hoofdstuk 5 is
verplicht. Ze zijn goed geschreven en ze werken, maar ze meten niets. Elke speler krijgt exact
dezelfde tekst.

**2 · 0.** **Nul flags. Nul relaties.** 27 scènes, de complete aanloop naar de Trojaanse Oorlog,
en het hoofdstuk legt letterlijk niets vast.

**3 · 0.** Geen enkele. Iphigenia's offer, de schaking van Helena, Philoktetes op Lemnos — de
speler kijkt overal toe.

**4 · 0.** Twee STAT-gates in 27 scènes, en de Cavalerist haalt er geen van beide. Beide leiden
naar flavourtekst die zichzelf ontkracht: `CH7_008_VIS` zegt letterlijk *"niemand merkt het, en
niemand zal het zich later herinneren"*. Dat is eerlijk, maar het is ook de definitie van een
lege keuze. Geen `tendency_address` na twaalf houdingskeuzes.

**5 · 0.** Geen enkele relatie, in het hoofdstuk waarin de speler Odysseus, Achilles, Agamemnon,
Menelaus, Paris, Helena, Priamus, Hecuba en Calchas voor het eerst ontmoet — allemaal figuren die
in Hoofdstuk 8, 9 en de hele Odyssee terugkomen.

**3 · 0 en 5 · 0 samen wijzen naar één scène.** `CH7_003`, de Eed van Tyndareos, is 21 regels
lang, heeft **één doorklikknop**, en vat het bindende bondgenootschap dat de hele oorlog aandrijft
samen in verteltekst. Odysseus bedenkt de eed; de speler kijkt toe. Er wordt niet vastgelegd wie de
vrijers waren, wie de speler steunde, of hij Odysseus hielp. Van alle enkele scènes in dit spel is
dit de grootste gemiste kans, en fase 3 werkt hem volledig uit.

**7 · 2.** Vier eretitels, een souvenir (de gouden appel), veertien codex-scènes, en de nieuwe
Museum-stolp die zich vult in `CH7_MUSEUM_00`. De terugkoppeling is prima — er is alleen niets
inhoudelijks om terug te koppelen.

---

## Hoofdstuk 8 — "De Wrok van Achilles" · **13 / 21**

| # | Punt | Score |
|---|---|---|
| 1 | Herinnert de wereld zich de speler? | **2** |
| 2 | Duurzame gevolgen? | **3** |
| 3 | Echt kantelpunt? | **2** |
| 4 | Reageert het op wie de speler is? | **0** |
| 5 | Eigen mening bij NPC's? | **3** |
| 6 | Is falen interessant? | **0** |
| 7 | Kan de speler het gevolg zien? | **3** |

**Het beste hoofdstuk van het spel, met ruime afstand. Dit is het model.**

**1 · 2.** `CH8_EPI_005` draagt twee wederzijds exclusieve echo's op `ch8_zijde`. Agamemnon:
*"Jij bent gebleven, toen anderen dat niet deden. Dat vergeet ik niet."* Achilles: een blik die
*"net iets langer dan nodig"* op je rust. Precies goed — kort, ongevraagd, en het beloont iets
wat zestien scènes eerder gebeurde. Geen 3 omdat er verder in 48 scènes niets naar de speler
verwijst, en omdat Hoofdstuk 8 zelf niets terugzegt over Hoofdstuk 1–7.

**2 · 3.** Het enige hoofdstuk dat verdient wat het krijgt. Negen `RELATION:`-verschuivingen over
zeven NPC's, plus `ch8_zijde`. Van die negen worden `aias` (twee kanten) en `diomedes` in
Hoofdstuk 9 daadwerkelijk uitgelezen. Dit hoofdstuk schrijft bewust vooruit, en het masterplan
zegt dat ook met zoveel woorden.

**3 · 2.** `CH8_005` sluit veertien scènes definitief af. Wie in de tent blijft, ziet Diomedes
nooit tegen Mars vechten; wie meetrekt, ziet Patroklos zich nooit in de wapenrusting hijsen.
De helft van het hoofdstuk gaat dicht. Geen 3: er sterft niemand door toedoen van de speler, en
de takken komen bij `CH8_EPI_001` weer samen, dus het gevolg is wat je zág, niet wat er gebeurde.

**4 · 0.** Vier STAT-gates in 48 scènes, waarvan de Cavalerist er nul haalt. Geen
`tendency_address` na acht hoofdstukken opbouwen. De grootste keuze van het spel — `CH8_005` —
kent geen enkele klasse- of statvariant: een Hopliet en een Cavalerist krijgen exact dezelfde
twee knoppen en exact dezelfde tekst.

**5 · 3.** Hier zit het spel het dichtst bij het genre. Negen relatieverschuivingen over zeven
personages, in twee vormen. `CH8_ACH_008`: Ajax breekt door Achilles' pantser waar Odysseus'
retoriek faalt (`achilles +1, aias +1, phoenix +1`). `CH8_AGA_008`: dezelfde scène van buiten,
waar Ajax langsloopt, iets bitters mompelt over trots die levens kost, en zijn blik *"heel even,
op jou"* laat rusten (`agamemnon +1, aias −1, odysseus +1`). Dezelfde gebeurtenis, twee NPC's
met een tegengestelde mening, en de speler zit aan één van beide kanten. Dat is Dragon Age.

**7 · 3.** Zes eretitels, een souvenir, en vooral: `CH8_EPI_005` is de **enige** plek in het spel
waar de speler binnen de fictie voelt dat iets is vastgelegd. Geen toast, geen icoon — een
personage dat zich iets herinnert. Dat is precies hoe het hoort.

---

## Hoofdstuk 9 — "Ilion in Vlammen" · **6 / 21**

| # | Punt | Score |
|---|---|---|
| 1 | Herinnert de wereld zich de speler? | **2** |
| 2 | Duurzame gevolgen? | **0** |
| 3 | Echt kantelpunt? | **2** |
| 4 | Reageert het op wie de speler is? | **0** |
| 5 | Eigen mening bij NPC's? | **0** |
| 6 | Is falen interessant? | **0** |
| 7 | Kan de speler het gevolg zien? | **2** |

**1 · 2.** Vier voorwaardelijke payoffs — het hoogste aantal van het spel — en ze zijn goed.
`CH9_002` herkent na 157 scènes nog het harnas dat Herakles je gaf. `CH9_GRI_005` geeft twee
volledig verschillende reacties op Ajax' dood, afhankelijk van welke kant je in Hoofdstuk 8 koos.
`CH9_GRI_009` beloont een geschiedenis met Diomedes die over drie hoofdstukken loopt.

Toch geen 3, om een harde reden: **drie van die vier staan uitsluitend in de Griekse tak.**
Een speler die bij `CH9_005` voor de muren kiest, krijgt in 22 scènes precies één terugverwijzing.
Wie de emotioneel zwaarste helft van het hoofdstuk kiest, krijgt de kaalste.

**2 · 0.** **Nul flags. Nul relaties.** Het laatste geschreven hoofdstuk, de val van Troje, en
er wordt niets vastgelegd — ook niet welke kant de speler koos. Met de Odyssee en de Aeneis als
eerstvolgende boeken is dat de duurste nul van de hele audit: er komt een heel boek over
thuisreizen aan, en het spel weet straks niet of de speler Troje van binnen heeft zien branden.

**3 · 2.** De sterkste routesluiting van het spel: de twee takken bij `CH9_005` komen **nooit**
meer samen. 22 tegen 21 scènes, twee volledig verschillende belevingen van dezelfde nacht. Geen 3
omdat de speler het gevolg alleen ondergaat en nergens beïnvloedt: Priamus, Astyanax en Aias
sterven in beide takken, en welke kant hij koos wordt niet onthouden.

**4 · 0.** Drie STAT-gates in 51 scènes, **alle drie exclusief voor de Boogschutter**
(`prudentia:15` ×2, `agilitas:14`). De Hopliet en de Cavalerist drukken in het hele slothoofdstuk
geen enkele knop in die een ander niet ook had kunnen indrukken. Eenentwintig houdingskeuzes,
nul `tendency_address`.

**5 · 0.** Geen enkele relatie, in het hoofdstuk waarin Aias sterft, Odysseus wint, Neoptolemus
arriveert, Helenus overloopt en Aeneas ontsnapt.

**7 · 2.** Zeven eretitels (het meeste van het spel), een souvenir, 28 codex-scènes, en een
derde stolp in het Museum. Maar op het enige moment waarop het ertoe doet — na `CH9_005`, de
onherroepelijke keuze — gebeurt er niets dat de speler laat voelen dat het is vastgelegd. Want
dat is ook zo.

---

## Eindtabel

| Hoofdstuk | 1 Wereld<br>herinnert | 2 Duurzaam<br>gevolg | 3 Kantel-<br>punt | 4 Wie ben<br>je | 5 NPC-<br>mening | 6 Falen<br>boeit | 7 Gevolg<br>zichtbaar | **Totaal** |
|---|---|---|---|---|---|---|---|---|
| Proloog | 0 | 2 | 1 | 0 | 0 | 0 | 2 | **5** |
| H1 De Namen van de Wereld | 0 | 2 | 2 | 1 | 1 | 0 | 2 | **8** |
| H2 De Werken van de Helden | 2 | 2 | 1 | 1 | 2 | 0 | 3 | **11** |
| H3 Beloften van Goden en Mensen | 2 | 0 | 0 | 1 | 1 | 0 | 2 | **6** |
| H4 Het Labyrint van Herinneringen | 1 | 0 | 0 | 1 | 0 | 1 | 2 | **5** |
| H5 Het Gulden Vlies | 2 | 1 | 0 | 1 | 0 | 0 | 2 | **6** |
| H6 De Vloek van Thebe | 2 | 2 | 0 | 1 | 1 | 0 | 2 | **8** |
| H7 De Appel der Tweedracht | 1 | 0 | 0 | 0 | 0 | 0 | 2 | **3** |
| H8 De Wrok van Achilles | 2 | 3 | 2 | 0 | 3 | 0 | 3 | **13** |
| H9 Ilion in Vlammen | 2 | 0 | 2 | 0 | 0 | 0 | 2 | **6** |
| **Gemiddeld** | **1,4** | **1,2** | **0,8** | **0,6** | **0,8** | **0,1** | **2,2** | **7,1 / 21** |

### Wat de tabel laat zien

**De zwakste kolommen zijn 6 (falen), 4 (wie ben je) en 5 (NPC-mening).** Punt 6 is één
technische ingreep — er is geen faalstaat in het spel, in geen enkele vorm. Punt 4 en 5 zijn
inhoudelijk werk, maar ze zijn ook waar het genre zit dat je noemt: Mass Effect en Dragon Age
draaien voor het overgrote deel op precies die twee.

**De sterkste kolom is 7 (gevolg zichtbaar), met 2,2.** Dat is belangrijk en gunstig: het
terugkoppelapparaat — toasts, eretitels, souvenirs, het Museum, de avatar — werkt al goed en is
al gebouwd. Er is alleen bijna niets inhoudelijks om erdoorheen te sturen. Je hebt een
etalage zonder voorraad, niet andersom.

**De curve loopt de verkeerde kant op.** Hoofdstuk 2 scoort 11, Hoofdstuk 7 scoort 3. De
hoofdstukken werden gaandeweg groter, mooier geschreven en beter geïllustreerd, terwijl de
reactiviteit terugliep — met Hoofdstuk 8 als opvallende, en blijkbaar bewuste, uitzondering.

**Hoofdstuk 8 is geen toeval en het is het antwoord.** Het scoort meer dan het dubbele van het
gemiddelde omdat het drie dingen doet die geen ander hoofdstuk doet: een keuze die een flag
schrijft, negen relatieverschuivingen die een houding vastleggen, en een scène waarin een
personage daar zestien scènes later ongevraagd op terugkomt. Alle drie die dingen bestaan al in
de engine. Ze zijn negen keer niet gebruikt.
