# Fase 3 — Ontbrekende cast en gemiste ontmoetingen

> Gebaseerd op `certamen/assets/chronica/cross_narratieve_figuren.md` (het bestaande
> referentiedocument met cross-narratieve figuren) en op een vergelijking daarvan met
> `SP_CODEX_PERSONS` in `certamen/singleplayer-data.js`. Waar het referentiedocument een figuur
> noemt die (nog) geen codex-entry heeft, geldt dat als "ontbrekend" voor deze fase — ook als de
> naam wél in de verteltekst valt (bv. Eurystheus, Chiron: veelvuldig genoemd, nooit vastgelegd
> als personage). Aanvullingen op het referentiedocument zelf staan aan het eind van elke sectie,
> gemarkeerd als zodanig.

---

## 0. Tijdlijnkeuzes die dit document vastlegt

De opdracht vraagt om bewuste keuzes tussen tegenstrijdige tradities zichtbaar te maken. Dit
zijn de keuzes die *nu al impliciet* zijn gemaakt (door de bestaande tekst) of die *voor deze
fase* expliciet zijn vastgelegd (in overleg, hieronder gemarkeerd).

| # | Kwestie | Tegenstrijdige tradities | Gekozen | Bron / vastlegging |
|---|---|---|---|---|
| 1 | **Waren Castor en Polydeukes nog in leven bij de Eed van Tyndareos?** | Sommige tradities laten hun dodelijke vete met Idas en Lynceus vóór de vrijerij vallen (dan zijn ze dood of al sterrenbeeld); andere laten het pas na de Trojaanse aanloop spelen. | **In leven**, aanwezig als Helena's broers en gastheren. Hun vete met Idas en Lynceus wordt pas later verteld. | Vastgelegd in overleg (2026-07-27), zie §2 hieronder. |
| 2 | **Was Theseus aanwezig bij de vrijerij?** | Chronologisch onmogelijk zonder een keuze: Theseus schaakte Helena als kind (`THESEUS`-cyclus), járen vóór haar huwelijk. Sommige naveringen laten hem toch als vrijer meedoen; de meeste niet. | **Afwezig**, maar met naam genoemd — als de man wiens eerdere schaking de reden is waarom Tyndareos zo gehaast een bindende eed wil. | Vastgelegd in overleg (2026-07-27), zie §2. |
| 3 | **Wie verandert Kallisto in een berin?** | Ovidius (Metamorfosen 2) laat Juno het doen; een andere traditie (Hyginus, sommige weergaven) laat Diana/Artemis het doen uit woede over de geschonden kuisheid. | **Hera/Juno**, direct en zonder tussenkomst van Diana. | Al zo in `CH2_K07` — bevestig ik hier als vastgelegde keuze, geen open punt. |
| 4 | **Wat gebeurde er met Iphigenia in Aulis?** | Werd ze geofferd, of greep Diana in en verving ze haar op het laatste moment door een hinde (Euripides, *Iphigenia in Tauris*)? | **Beide expliciet naast elkaar gelaten** — de tekst zegt letterlijk "sommigen zeggen... anderen zwijgen liever over wat een vader werkelijk heeft gedaan". | Al zo in `CH7_017` — een goed model, zie fase 4 voor het voorstel dit ook mechanisch te vertakken. |
| 5 | **Werd Helena gelokt, verliefd, of ontvoerd?** | De Ilias veronderstelt overwegend haar medeplichtigheid; latere bronnen (en Herodotos' *Historiën* 2.113-120 met de Egypte-variant) ontlasten haar. | **Bewust opengelaten** — "de bronnen vertellen het niet eensluidend". | Al zo in `CH7_012` — zie fase 4. |
| 6 | **Wie doodt Astyanax?** | De Ilias-traditie na Homerus (Kleine Ilias, Euripides' *Trojaanse Vrouwen*) is verdeeld: soms gooit Odysseus hem van de muur, soms Neoptolemus. | **Neoptolemus**, in beide takken van Hoofdstuk 9. | Al zo in `CH9_TRO_014`/`CH9_GRI_015` — bevestig ik als vastgelegde keuze. |
| 7 | **Welke Latijnse hoofdbron gebruikt het spel voor de directe vertaalregels?** | Geen tegenstrijdige tradities, maar wel een impliciete keuze die verderop uitmaakt: elke directe A.C.I./naamval-vertaalzin in de puzzelscènes (bv. `CH1_A06`, `CH1_B05`, `CH1_C08`) is een herschreven regel uit **Ovidius, Metamorfosen**. | Ovidius blijft de Latijnse ruggengraat. | Impliciet in de bestaande puzzelteksten; hier voor het eerst benoemd zodat toekomstige hoofdstukken bewust hetzelfde spoor volgen (of er bewust van afwijken, bv. Vergilius voor Hoofdstuk 10-13). |

**Wat dit oplevert voor de Eed van Tyndareos:** de speler kan bij de vrijerij oprecht zien hoe
levendig Castor en Polydeukes zijn (ze staven straks levend bij de Argonautentocht in Hoofdstuk
5 — al gespeeld, dus geen retroactieve aanpassing nodig) én kan Theseus' naam horen vallen als de
reden waarom Tyndareos zo'n haast heeft: een koning die zijn dochter al één keer bijna kwijt was
aan een schaking, wil het risico voor de rest nooit meer lopen.

---

## 1. Per hoofdstuk: wie kon er plausibel bij zijn en ontbreekt of blijft naamloos?

### Proloog
Geen — een introductiehoofdstuk zonder verzamelmoment. Niets te melden.

### Hoofdstuk 1 — De Namen van de Wereld
| Figuur | Waarom plausibel hier | Keert terug in | Wat de speler nú zou kunnen doen | Werk |
|---|---|---|---|---|
| **Eurystheus** | Wordt in Hoofdstuk 2/3 de vaste antagonist-met-de-bronzen-pot, maar zijn eigen herkomst (achterneef van Herakles, geboren dankzij Hera's list) hoort thematisch bij lijn B (Athena's geboorte, dezelfde Zeus-Hera-spanning). | H2, H3 (zwaar) | Niets nu al — puur een narratieve verwijzing zou volstaan. | Kleine toevoeging |

### Hoofdstuk 2 — De Werken van de Helden
| Figuur | Waarom plausibel | Keert terug in | Wat nu | Werk |
|---|---|---|---|---|
| **Eurystheus** | Al aanwezig als lijdend voorwerp van de bronzen-pot-running gag, maar heeft **geen codex-entry** ondanks tien scènes waarin hij handelt. | H2, H3 | Voeg een `PERSON:eurystheus:intro`-hook toe bij zijn eerste optreden (`CH2_H07`). | Kleine toevoeging (data-only, geen nieuwe scène) |
| **Chiron** | Wordt in Hoofdstuk 3 (`CH3_H04`-`H07`) uitgebreid verteld als leermeester van Herakles én slachtoffer van de gifpijl, en in Hoofdstuk 8 (`CH8_ACH_011`) herinnert Achilles zich hem — maar hij heeft nergens een codex-entry. | H3, H5 (impliciet — hij traint Jason ook), H8 | `PERSON:chiron:intro` bij `CH3_H04`. | Kleine toevoeging |

### Hoofdstuk 3 — Beloften van Goden en Mensen
Zie Chiron hierboven. Verder geen structurele gaten — dit hoofdstuk is al dicht bevolkt.

### Hoofdstuk 4 — Het Labyrint van Herinneringen
| Figuur | Waarom plausibel | Keert terug in | Wat nu | Werk |
|---|---|---|---|---|
| **Phaedra** | Ariadne's zuster; in de bredere Theseus-cyclus wordt zij later zijn vrouw. Niet essentieel voor dít hoofdstuk, maar een naamsvermelding bij Ariadne's afscheid zou een stille aanzet zijn. | Geen huidig hoofdstuk — pure toekomstige haak (Theseus-cyclus, niet in `SP_CAMPAIGN` t/m boek 5 gepland) | Eén bijzin in `CH4_T10`. | Triviaal, kan ook vervallen |
| **Minos** heeft al een codex-entry en is goed uitgewerkt; geen gat hier. | | | | |

### Hoofdstuk 5 — Het Gulden Vlies
**Het rijkste hoofdstuk om aan te vullen — zie ook §2 (verzamelmomenten) hieronder.**

| Figuur | Waarom plausibel | Keert terug in | Wat nu | Werk |
|---|---|---|---|---|
| **Hylas** | Al uitgebreid verteld in `CH5_015` (verdwijnt in de bron, Herakles zoekt hem de hele nacht) maar heeft **geen codex-entry** ondanks een volledige, aangrijpende scène. | Alleen hier | `PERSON:hylas:intro` bij `CH5_015`. | Kleine toevoeging |
| **Phrixus en Helle** | De oorsprong van het Gulden Vlies zelf wordt in het hele hoofdstuk nooit verteld — de speler ziet het Vlies, maar niet waar het vandaan komt (de gouden ram, de vlucht voor de kwade stiefmoeder Ino, Helle die verdrinkt in wat later de Hellespont heet). Dat is een gat in het eigen fundament van het hoofdstuk. | Nergens terug, maar de bron-vertelling zelf is de payoff | Eén korte scène bij aankomst in Colchis (`CH5_023`) waarin een lokale de oorsprong vertelt — geen keuze nodig, puur verdieping. | Kleine tot middelgrote toevoeging |
| **Ino** | Zie Phrixus/Helle — en zie fase 5: zij is dezelfde figuur die later als zeegodin Leucothea Odysseus redt. De mooiste verborgen brug uit het hele referentiedocument, en ze kan hier al geplant worden. | **Odyssee** (toekomstig boek) | Noem haar naam in de Phrixus/Helle-vertelling hierboven; niets mechanisch nodig totdat de Odyssee er is. | Inbegrepen in bovenstaande toevoeging |
| **Neleus** (Pelias' tweelingbroer, vader van Nestor) | Zeer laag rendement — vermeld in het referentiedocument als stille `ARGO`-`HERACLES`-`TROJE`-brug via Nestor, maar voegt op dit moment weinig toe. | — | — | Niet doen |

### Hoofdstuk 6 — De Vloek van Thebe
| Figuur | Waarom plausibel | Keert terug in | Wat nu | Werk |
|---|---|---|---|---|
| **Agave** | Centrale handelende figuur van de slotscène (`CH6_025`, verscheurt haar eigen zoon Pentheus) maar heeft **geen codex-entry** — de enige moeder-die-haar-kind-doodt-figuur in het spel zonder eigen personageblad. | Alleen hier | `PERSON:agave:intro` bij `CH6_022` of `:full` bij `CH6_025`. | Triviale toevoeging |
| **Amphiaraus** | Referentiedocument noemt hem als ideale brug Argonauten↔Zeven-tegen-Thebe: hij is Argonaut én een van de Zeven, en weet vooraf dat de tocht zijn dood wordt. Nu ontbreekt hij volledig uit `CH6_012` (de Zeven worden alleen via Tydeus verteld). | Alleen hier (tenzij Argonauten-vermelding wordt toegevoegd aan H5) | Één naam en één zin bij `CH6_012` ("een ziener onder hen wist al dat hij niet zou terugkeren") — geen nieuwe scène nodig. | Kleine toevoeging |
| **Tiresias** | De blinde ziener loopt door de hele Thebaanse cyclus (Oedipus, de Zeven, Antigone) én is de eerste schim die Odysseus in de onderwereld raadpleegt. Hij ontbreekt volledig uit Hoofdstuk 6, wat opvallend is omdat elke scène waar hij traditioneel bij hoort (`CH6_007` Sfinx, `CH6_010` de Waarheid, `CH6_015` Antigone) nu zonder hem wordt verteld. | H6 zelf, en potentieel **Odyssee** (nekyia) | Voeg hem toe als de stem die de waarheid in `CH6_010` uitspreekt (nu ongenoemd "een orakel"). | Kleine toevoeging, mogelijk grote payoff later |

### Hoofdstuk 7 — De Appel der Tweedracht
**Zie §2 — dit hele hoofdstuk draait om verzamelmomenten (de vrijerij, de bruiloft, Aulis) en
wordt daar volledig behandeld.**

Los daarvan:

| Figuur | Waarom plausibel | Keert terug in | Wat nu | Werk |
|---|---|---|---|---|
| **Clytemnestra** | Wordt nergens genoemd, terwijl haar zuster Helena en haar man Agamemnon beiden centraal staan, en Iphigenia — haar dochter — in `CH7_017` wordt geofferd zonder dat haar moeder ook maar wordt vermeld. Dat is een gemiste dramatische lading: het is Agamemnons eigen vrouw die hem hiervoor uiteindelijk zal doden. | Toekomstig (Oresteia-stof, niet in `SP_CAMPAIGN` t/m boek 5) | Eén zin in `CH7_016`/`CH7_017`: "haar moeder, die het nooit zal vergeven". | Triviale toevoeging, grote ironie |
| **Pelops/Atreus/Thyestes** | De achterliggende vloek die verklaart waaróm Agamemnons familie zo makkelijk naar het uiterste grijpt (het Thyesteïsche maal) wordt nergens genoemd. Puur achtergrond, geen personages die hoeven te verschijnen. | — | Eén zin bij Agamemnons introductie. | Triviaal |

### Hoofdstuk 8 — De Wrok van Achilles
| Figuur | Waarom plausibel | Keert terug in | Wat nu | Werk |
|---|---|---|---|---|
| **De lijkspelen voor Patroklos** (Ilias boek 23) | Dit is geen ontbrekend personage maar een ontbrekend, beroemd verzamelmoment: wagenrennen, boksen, worstelen, met bijna elk overgebleven Grieks personage als deelnemer of toeschouwer (Diomedes, Odysseus, Ajax, Antilochos, Menelaus, Nestor als eerbetoon-ontvanger). Het spel springt van `CH8_EPI_004` (het schild) direct naar `CH8_EPI_005` (de verzoening) en slaat dit hele set-piece over. | Nergens, tenzij toegevoegd | Eén korte scène met 2-3 flavour-keuzes (op wie wed je, wie moedig je aan) — een tweede, kleinere versie van het Cyzicus-everzwijnpatroon uit H5. | Middelgroot — nieuwe scène nodig |

### Hoofdstuk 9 — Ilion in Vlammen
| Figuur | Waarom plausibel | Keert terug in | Wat nu | Werk |
|---|---|---|---|---|
| **Idomeneus** | Kretenzisch aanvoerder voor Troje (referentiedocument: `KRETA`-`TROJE`-`ROMA`-brug), nergens genoemd terwijl Kreta in Hoofdstuk 3/4 (Minos, Ariadne, Daidalos) uitgebreid is opgebouwd. Zijn latere lot (verbannen naar Italië na een noodlottige gelofte) is een directe parallel aan Aeneas. | Toekomstig (Aeneis-strand) | Eén naamsvermelding tussen de Griekse aanvoerders in `CH9_GRI_001` of `CH9_TRO_008`. | Triviaal, met toekomstige payoff |
| **Laomedon / Hesione** | Verklaart waarom Troje al eerder is gevallen (Herakles' eerste verovering) — geeft historische diepte aan een stad die de speler nu alleen kent vanaf Priamus. Hesione is bovendien Telamons vrouw en dus Ajax' moeder — een rechtstreekse verbinding met een personage dat al in Hoofdstuk 5 en 8/9 meespeelt. | Kan al terugverwijzen naar Telamon (H5) | Eén zin bij de introductie van Priamus (`CH7_006` of `CH9_TRO_...`): "zijn eigen vader ontsnapte als kind aan Herakles' eerdere verovering". | Triviaal |

**Toevoeging aan het referentiedocument zelf:** Hylas, Chiron, Eurystheus en Agave verdienen een
regel in Deel 4 van `cross_narratieve_figuren.md` — ze zijn geen cross-narratieve bruggen in de
strikte zin (ze komen maar in één cyclus voor), maar ze zijn wél personages met eigen scènes en
zonder codex-registratie, wat het referentiedocument nu niet signaleert omdat het zich uitsluitend
op meerdere-cycli-figuren richt.

---

## 2. Verzamelmomenten

Verzamelmomenten zijn de goedkoopste plek om tientallen latere payoffs te zaaien: veel personages
tegelijk, één scène, en de speler hoeft alleen te *kiezen wie hij aanspreekt*.

### 2a. De Eed van Tyndareos — volledig uitgewerkt (gekozen: 4-6 scènes, uitgebreid)

**Huidige staat:** `CH7_002` (de vrijerij, 1 puzzel, 1 doorklikknop) → `CH7_003` (de eed zelf,
21 regels, 1 doorklikknop). Geen enkele knop, geen enkele flag. De speler leest over Odysseus'
idee en Tyndareos' keuze; hij doet zelf niets.

**Voorstel:** vervang deze twee scènes door een cluster van vijf: `CH7_002` (ongewijzigd, de
aankomst), `CH7_002B` (de vrijers zelf, met keuze), `CH7_002C` (Odysseus' idee — optioneel
meehelpen), `CH7_003` (de eed, nu met een steunkeuze), `CH7_003B` (korte coda).

**Wie is aanwezig, en wie keert terug** (op basis van het referentiedocument, Deel 2/3, en de
tijdlijnkeuzes in §0):

| Vrijer | Aanwezig als | Keert terug in |
|---|---|---|
| **Menelaus** | Wint Helena (al in het spel) | H7 (rest), H8, H9 |
| **Agamemnon** | Begeleidt zijn broer, al machtig | H7 (rest), H8, H9 |
| **Odysseus** | Bedenker van de eed, vraagt zelf Penelope | H7 (rest), H8, H9, **Odyssee** |
| **Ajax (Telamons zoon)** | Vrijer, komt uit Salamis | H8, H9 |
| **Diomedes** | Jong, komt uit Argos — al bekend uit H6 | H8, H9 |
| **Idomeneus** | Kretenzisch vrijer (zie §1) | Toekomstig (Aeneis) |
| **Castor en Polydeukes** | **Aanwezig, in leven** (zie §0.1) — niet als vrijers maar als Helena's broers/gastheren, die de gang van zaken bewaken | Al gespeeld in H5 als Argonauten |
| **Theseus** | **Afwezig, met naam genoemd** (zie §0.2) als de reden voor Tyndareos' haast | — |

**De vijf scènes:**

1. **`CH7_002` (bestaand, ongewijzigd)** — de aankomst van de vrijers, met de bestaande
   genitivus-puzzel.
2. **`CH7_002B` (nieuw) — "Onder de Vrijers"**. De speler loopt langs de verzamelde mannen en
   kan zich bij één groepje voegen: Menelaus (rustig, plichtsgetrouw), Ajax (recht-voor-zijn-raap,
   fysiek), of Diomedes (jong, ongeduldig — al bekend uit Hoofdstuk 6). Drie keuzes, geen
   `[NEUTRAL]`: elk schrijft `RELATION: <npc>=+1`. Dit is de eerste relatieopbouw met Ajax en
   Diomedes vóór Hoofdstuk 8, en de eerste met Agamemnon/Menelaus vóór dat hoofdstuk begint.
3. **`CH7_002C` (nieuw) — "Odysseus' Idee"**. Odysseus, die zelf kansloos is bij Tyndareos maar
   zijn eigen huwelijk met Penelope wil forceren, denkt hardop na over een oplossing. De speler
   kan zwijgend toekijken, of hem helpen de eed te formuleren
   (`[STAT:ingenium:12]` of `[STAT:gratia:12]` — **de eerste `ingenium`-gate van het hele spel**,
   zie fase 1 §7a). Wie helpt, zet `RELATION: odysseus=+2` in plaats van de standaard +0/+1 die
   de scène anders geeft, en Odysseus zegt het letterlijk: *"Ik onthou wie hier meedacht."*
4. **`CH7_003` (bestaand, uitgebreid)** — de eed zelf. Castor en Polydeukes staan zichtbaar bij
   hun zuster; een bijzin noemt Theseus als de reden voor de haast (zie §0.2). Aan het eind een
   keuze: zweer je zelf mee als omstander (puur ceremonieel, `[CLEMENTIA]`/`[SEVERITAS]`/
   `[NEUTRAL]` op *hoe* je zweert — telt in de bestaande houdingsteller), of blijf je terzijde
   staan als boodschapper die niet gebonden hoeft te zijn.
5. **`CH7_003B` (nieuw) — coda**. Eén korte scène die vastlegt wat er is gebeurd: welke vrijer
   de speler steunde (`ch7_vrijer_gesteund`), of hij Odysseus hielp
   (`ch7_odysseus_geholpen`), en de bestaande relatiescores worden bevestigd in de Kroniek.

**Wat dit schrijft (6-10 flags/relaties, zoals gevraagd):**

| Flag/relatie | Waar gelezen (voorstel) |
|---|---|
| `RELATION: menelaos` (indien gesteund) | Al bestaand relatiesysteem in H8 — telt nu op vóórdat H8 begint |
| `RELATION: aias` (indien gesteund) | `CH8_ACH_008`/`CH8_AGA_008` (al bestaand mechanisme) — steun bij Tyndareos verhoogt de startwaarde vóór de Hoofdstuk 8-verschuivingen |
| `RELATION: diomedes` (indien gesteund) | `CH9_GRI_009` (al bestaand — nu bereikbaar met één moment minder in plaats van twee, zie fase 1 §2) |
| `RELATION: odysseus` (+2 bij hulp) | Nieuw uit te lezen in **Odyssee**-hoofdstukken (fase 5): Odysseus die de speler herkent als "degene die meedacht bij de eed" |
| `ch7_vrijer_gesteund` | Eén regel flavourtekst bij die vrijer, later in H8/H9 |
| `ch7_odysseus_geholpen` | Idem, plus een echo in de Odyssee |
| `ch7_eed_zelf_gezworen` (+approach-tag) | Optioneel: een latere scène waarin de speler zelf aan zijn eigen eed wordt gehouden — puur flavour, geen mechanisch gevolg nodig |

**Kosten:** 3 nieuwe scènes, 1 nieuwe puzzel-of-gate (`ingenium`/`gratia`), geen nieuwe illustratie
nodig (hergebruik `parisoordeel.png`-achtige groepscompositie of een nieuwe "vrijers"-illustratie
naar keuze). Geschat: een halve tot hele dag schrijfwerk plus implementatie — vergelijkbaar met
één cameo-cluster uit Hoofdstuk 5.

### 2b. De Argonauten aan boord (`CH5_002`) — kleiner voorstel

Al genoemd in fase 1/2: veertien benoemde helden, nul relaties. **Niet elk van hen hoeft een
relatiescore** — dat zou het hoofdstuk overladen. Concreet, goedkoop voorstel: geef alleen de
twee met de grootste latere lading een enkele `RELATION:+1`-knop, naar het precedent van
`CH6_018_PRU` (Diomedes):

- Bij `CH5_002` of `CH5_004`: een optionele knop om Telamon te helpen zijn plek aan boord te
  vinden (`RELATION: telamon=+1`) — leesbaar als kleine bonus bij Ajax' relatiescore in H8/H9
  (vader-op-zoon-krediet, net als bij Diomedes/Tydeus).
- Bij `CH5_020` (Nestor/Philoktetes): een optionele knop om Nestor te helpen met de koersbepaling
  (`RELATION: nestor=+1`) — leesbaar in de **Odyssee**, waar hij Telemachus ontvangt.

Kosten: geen nieuwe scènes, twee extra keuzeregels in bestaande scènes. Triviaal.

### 2c. De bruiloft van Peleus en Thetis (`CH7_004`) — al goed, kleine aanvulling

Heeft al een onvoorwaardelijke payoff (Peleus herkend van de Argonautentocht). Ontbreekt: de
gasten zelf worden niet opgesomd — geen enkele andere god of held wordt genoemd, terwijl dit
traditioneel een verzamelmoment van vrijwel het hele pantheon is. Lage prioriteit: de scène
bestaat vooral om naar de appel toe te werken, en te veel namen zouden afleiden. **Geen wijziging
voorgesteld.**

### 2d. Ontbrekend verzamelmoment: de lijkspelen voor Patroklos

Zie §1, Hoofdstuk 8. Dit is het grootste ontbrekende verzamelmoment van het hele spel — een
scène die in de Ilias zelf een heel boek beslaat, met vrijwel de volledige overgebleven Griekse
cast als deelnemer, en die nu volledig ontbreekt. Zie fase 4 voor hoe dit ook als perspectiefkeuze
zou kunnen werken (welke wedstrijd volg je), en fase 11 voor de prioritering.

---

## 3. Samenvatting: wat dit voor de resterende hoofdstukken oplevert

| Toevoeging | Werk | Grootste payoff |
|---|---|---|
| Codex-entries: Eurystheus, Chiron, Hylas, Agave, Tiresias | Triviaal (data-only) | Maakt latere payoffs mogelijk zonder nu al iets te kosten |
| Eed van Tyndareos uitgebreid tot 5 scènes | Middelgroot | Grootste enkele reactiviteitswinst van de audit — voedt H8, H9 én de Odyssee |
| Twee relatieknopen bij de Argo-bemanning (Telamon, Nestor) | Triviaal | Kleine bonus bij bestaande Ajax/Nestor-payoffs |
| Phrixus/Helle/Ino bij aankomst in Colchis | Klein | Plant de mooiste verborgen brug uit het referentiedocument voor de Odyssee |
| Lijkspelen voor Patroklos | Middelgroot (nieuwe scène) | Vult het grootste ontbrekende set-piece van het spel |
| Tijdlijnkeuzes §0 vastgelegd | Geen (documentatie) | Voorkomt dat toekomstige hoofdstukken zichzelf tegenspreken |
