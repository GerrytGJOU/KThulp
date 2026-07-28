# Fase 8 — Stijl, toon en immersie

> Immersie is een harde eis: de speler mag nergens herinnerd worden dat hij een spel speelt.
> Deze fase doorzoekt alle spelertekst — inclusief knoppen, toasts, en het combat-scherm — op
> systeemtaal. Regelnummers verwijzen naar `certamen/singleplayer-data.js` tenzij anders vermeld.

## 1. Register, vaart, uitleggerigheid, leesniveau, herhaling, vertelvorm

**Register: consistent en goed gemikt.** Ik heb geen scènes gevonden die te schools of te
academisch aanvoelen, en geen scènes waar humor een tragisch moment ondermijnt — de humor zit
vrijwel uitsluitend bij Eurystheus' bronzen pot (een terugkerende running gag die bewust licht
blijft) en breekt nergens door in de zware scènes (Megara's dood, Priamus' smeekbede, Astyanax).
Dat is een compliment: de toon houdt zich consequent aan de gevraagde Harry Potter/Hobbit/Percy
Jackson-band tussen vaart en ernst.

**Vaart: sterk, met één systematische kanttekening.** De lengte-conventie uit `Chronica.md`
("elke scène vóór een keuze krijgt minimaal 2-3 alinea's") is consequent toegepast — dat is
precies waarom Hoofdstuk 1 e.v. voller aanvoelen dan een eerste, snellere versie zou zijn geweest.
De kanttekening: bij de STAT-gated route-splitsingen (fase 1 §1a, 29 gevallen) is er relatief veel
tekst voor relatief weinig gevolg — de speler leest drie volle scènes over een keuze die daarna
nergens meer toe doet. Dat is geen vaartprobleem in de klassieke zin (te lange alinea's) maar een
verhouding-probleem: veel tekst, klein resultaat.

**Uitleggerigheid: laag, met twee concrete uitzonderingen.**
- `CH1_A03` laat een hoveling het hele Silenus-verhaal navertellen aan een publiek dat het al kent
  — functioneel (de speler moet het horen) maar het personage vertelt iets wat hij zelf al weet,
  puur om de speler te informeren.
- `CH4_T04` laat de verteller (niet een personage) de hele oorsprong van de Minotaurus in één
  alinea droog opsommen, los van een scène of dialoog — meer een encyclopedie-inschuifsel dan
  handeling. Voorstel: verdeel dit over een korte dialoog tussen Theseus en een ingewijde
  (bijvoorbeeld een havenwerker of Ariadnes eigen introductie), zodat het uit een mond komt in
  plaats van uit de lucht.

**Leesniveau: passend bij bovenbouw VWO.** Rijke, beeldende zinnen ("de zon vangt op een manier
die geen gewoon water zou moeten doen") zonder onnodig zware woordkeuze. Geen aanpassing nodig.

**Herhaling: één terugkerend patroon, verdedigbaar maar tellend.** Vrijwel elke scène na een
gedeelde-emotie-moment gebruikt de drieslag "Kijk toe... / Weet niet goed... / Voel..." als
opzet voor de Clementia/Severitas-keuze (letterlijk zichtbaar in bijna elke digest: "Blijf
nuchter" / "Kijk toe, niet goed wetend..." / "Voel medelijden..."). Dat is een sjabloon, geen
cliché in de literaire zin — het is bewust herhaald omdat het de keuzestructuur zelf is — maar het
zorgt er wel voor dat scènes qua *ritme* op elkaar gaan lijken, vooral in H2 (39 houdingskeuzes)
en H9 (21). Geen wijziging nodig, wel iets om bewust te variëren in latere hoofdstukken (bv. soms
de derde optie fysiek maken in plaats van "kijk toe" te herhalen).

**Vertelvorm: consistent tweede persoon, geen enkele wisseling gevonden.** Ik heb systematisch op
insluipende derde-persoon-vormen ("hij rent", "zij ziet") aan het begin van zinnen gezocht — geen
treffers. Dit is schoon.

---

## 2. Immersie — de vervangingslijst

### 2a. Verwijzingen naar hoofdstukken (spelertekst, niet auteurscommentaar)

Acht scènes waarin een personage of de verteller het woord "Hoofdstuk" uitspreekt als
structuurbegrip. Auteurscommentaar in `/* ... */`-blokken (bv. regel 7839, 10345) is uitgesloten —
dat is nooit zichtbaar voor de speler.

| Vindplaats | Huidige tekst | Voorstel |
|---|---|---|
| `CH1_EINDE:3438` | *"Hoofdstuk 2 wacht al ergens verderop," zegt de stem.* | *"Er wacht alweer een nieuwe naam die dreigt te verdwijnen," zegt de stem.* |
| `CH2_EINDE:4691` | *"Hoofdstuk 3 wacht al ergens verderop," zegt de stem, "en met hem de rest van Herakles' beproevingen."* | *"Er wacht je alweer een nieuw verhaal," zegt de stem, "en met hem de rest van Herakles' beproevingen."* |
| `CH3_IO14:5128` | *"...zoals ze dat sinds Hoofdstuk 2 wel vaker doet..."* | *"...zoals ze dat sinds Hera's slachtoffers wel vaker doet..."* |
| `CH3_EINDE:5898` | *"Hoofdstuk 4 wacht al ergens verderop," zegt de stem, "waar een ander soort labyrint op je wacht."* | *"Er wacht een ander soort labyrint op je," zegt de stem, "niet van steen deze keer."* |
| `CH4_T10:6242` | *"Bacchus, de god die je al kent van koning Midas' vloek (Hoofdstuk 1)..."* | *"Bacchus, de god die je al kent van koning Midas' vloek..."* (verwijzing volstaat zonder het haakje) |
| `CH4_EINDE:6766` | *"Hoofdstuk 5 wacht al ergens verderop," zegt de stem, "waar geen labyrint meer op je wacht, maar een schip vol helden."* | *"Er wacht geen labyrint meer op je," zegt de stem, "maar een schip vol helden."* |
| `CH6_001:7881` | *"...geeft die zoektocht op advies van het orakel... op — je kent haar verhaal al uit Hoofdstuk 3..."* | *"...je kent haar verhaal al, van de wolk die ooit over Argos hing..."* |
| `CH6_MUSEUM_EINDE:8773` | *"Hoofdstuk 7 wacht al ergens verderop," zegt de Boodschapper.* | *"Er wacht je een nieuw verhaal," zegt de Boodschapper.* |

**Patroon:** zeven van de acht volgen exact dezelfde formule ("Hoofdstuk N wacht al ergens
verderop") — dit is dus, net als de `_route`-flags in fase 1, één herhaald sjabloon met acht
toepassingen, geen acht losse problemen. Eén vervangingszin ("Er wacht je een nieuw verhaal...")
dekt zeven van de acht gevallen.

### 2b. Scènetitels die "Hoofdstuk N" gebruiken

Negen `TITLE:`-secties luiden letterlijk "Het Einde van Hoofdstuk N" — zichtbaar gerenderd als
`<h2>`-kop boven de scène (`SCREENS.spPlay`). Minder ernstig dan directe spraak (het is een
sectiekop, geen personage dat het zegt), maar wel expliciet gevraagd om te vervangen.

| Scène | Huidige titel | Voorstel |
|---|---|---|
| `CH1_EINDE` | "Het Einde van Hoofdstuk 1" | "Een Mantel voor de Reiziger" |
| `CH2_EINDE` | "Het Einde van Hoofdstuk 2" | "Vier Gezichten van Eén Jaloezie" |
| `CH3_EINDE` | "Het Einde van Hoofdstuk 3" | "Twee Soorten Vrijheid" |
| `CH4_EINDE` | "Het Einde van Hoofdstuk 4" | "Beloften die Niemand Ongedaan Maakt" |
| `CH5_EINDE` | "Het Einde van Hoofdstuk 5" | "Wat het Vlies Heeft Gekost" |
| `CH6_EINDE` | "Het Einde van Hoofdstuk 6" | "Een Vloek die Nooit Hardop Wordt Uitgesproken" |
| `CH7_EINDE` | "Het Einde van Hoofdstuk 7" | "Het Gewicht van een Gouden Appel" |
| `CH8_EINDE` | "Het Einde van Hoofdstuk 8" | "Wat Oorlog Werkelijk Kost" |
| `CH9_EINDE` | "Het Einde van Hoofdstuk 9" | "Niemand Ziet het Hele Verhaal" |

### 2c. Systeemwoorden in de vertelling

| Vindplaats | Huidige tekst | Probleem | Voorstel |
|---|---|---|---|
| `spHookReward` toast, `singleplayer.js:1424-1426` | *"Je pad is bepaald — dit werkt ook door in Battle Mode."* | Noemt een andere spelmodus bij naam — de speler wordt als speler aangesproken, niet als reiziger. | *"Je pad is bepaald. Dit wapen zal je overal vergezellen waar je nog terechtkomt."* (de Battle Mode-koppeling blijft functioneel bestaan, alleen de mededeling erover verdwijnt uit de fictie) |
| `spHookCodex` toast, `singleplayer.js:1439` | *"Codex-item ontgrendeld!"* | "Ontgrendeld" is het letterlijke systeemwoord `unlock` in vertaling. | *"Er is een nieuwe bladzijde toegevoegd aan de Codex Memoriae."* (de bestaande tweede regel volstaat al als titel) |
| `spHookStatpoints` toast, `singleplayer.js:1451` | *"Je bent gegroeid — Je hebt 3 statpunten verdiend — investeer ze bij je Karakter Informatie."* | "Statpunten" en "investeer" zijn RPG-systeemtaal, terwijl "Karakter Informatie" er al wél diegetisch uitziet. | *"Je bent gegroeid. Je voelt drie nieuwe krachten in jezelf ontwaken — verdeel ze bij je Karakter Informatie."* |
| Combat-scherm kop, `singleplayer.js:1883` | `<h2>Gevecht</h2>` | Neutraal, geen personage — laagste prioriteit, maar wel een systeemscherm-titel in plaats van bv. de vijandsnaam. | `<h2>${enemy.nm}</h2>` — de vijand zelf als kop, geen generiek label |
| Combat-scherm statusregel, `singleplayer.js:1890` | *"${hp} / ${maxHp} levenspunten van de vijand — jouw EP: ${ep}"* | "Levenspunten" en vooral de kale afkorting "EP" zijn zuivere spelsysteemtaal, zonder enige diegetische verpakking. | *"${enemy.nm} is nog niet verslagen — jouw vastberadenheid groeit: ${ep}/${SP_COMBAT_ACTION_COST}"* (of een vergelijkbare, in-fictie parafrase van hetzelfde getal — zie ook de kanttekening hieronder) |
| Combat-scherm knop, `singleplayer.js:1897` | *"⚔️ Aanval (kost 20 EP)"* | "EP" opnieuw. | *"⚔️ Aanval"* (het getal 20 hoeft niet zichtbaar — de knop is toch pas actief als `canAttack` waar is) |

**Kanttekening bij het combat-scherm:** dit is het enige scherm in het hele spel waar spelsysteem-
taal geconcentreerd voorkomt (fase 2 signaleerde het al vanuit reactiviteitsoogpunt: gevechten
kunnen niet verloren worden). Drie van de zes vervangingen hierboven zitten in dit ene scherm.
Vergeleken met de rest van het spel — waar ik verder nergens onverpakte systeemtaal vond — is dit
duidelijk een scherm dat vroeg is gebouwd (COMBAT was aanvankelijk "nog niet actief", zie
`Chronica.md` §2) en nooit is nabewerkt op toon, terwijl de rest van het spel dat wel consequent
kreeg.

### 2d. Getallen en mechaniek die onnodig zichtbaar zijn

Buiten de bewust-zichtbare drempels bij vergrendelde keuzes (bv. "Vis 14 — jij hebt 11", die de
opdracht zelf als toegestane uitzondering noemt) is het bovenstaande combat-scherm de enige plek
waar kale getallen (HP, EP-kosten) zonder enige framing verschijnen. Verder geen treffers.

### 2e. Aansprekingen die de speler uit de fictie halen

**Geen gevonden.** Ik heb specifiek gezocht op "welkom terug", "je voortgang is opgeslagen",
"klik hier" en vergelijkbare formuleringen — nul treffers. Het opslagsysteem (`spSaveProgress`)
kondigt zichzelf nergens aan; er is geen "Voortgang opgeslagen"-melding. Dit is een schone
bevinding, het is de moeite waard te vermelden zodat toekomstige schrijvers weten dat dit al goed
staat en zo moet blijven.

### 2f. Anachronismen en moderne begrippen

**Geen gevonden.** Geen verwijzingen naar internet, telefoons, computers of andere moderne
begrippen in de verteltekst.

---

## 3. Stijlgids (voor de Odyssee- en Aeneis-hoofdstukken)

**Vertelvorm.** Tweede persoon, doorlopend. De speler is nooit toeschouwer van zichzelf — "je
loopt", nooit "hij loopt". Dialoog mag wél de gender-templates (`{subject}`/`{object}`/
`{possessive}`) gebruiken wanneer een personage in de derde persoon óver de speler praat.

**Toon.** Meeslepend, licht van toon waar de stof het toelaat, in staat om zonder aankondiging
serieus te worden waar de mythe dat vraagt (Priamus' smeekbede, Astyanax) — zonder dat de humor
ooit een tragisch moment relativeert. Humor hoort bij terugkerende, bewust lichte figuren
(Eurystheus' bronzen pot); nooit bij een sterfscène.

**Vaart.** Minimaal 2-3 alinea's vóór een keuzemoment (bestaande conventie, `Chronica.md`), korter
mag alleen direct vóór een puzzel. Bewaak de verhouding tekst-tot-gevolg: een scène die drie
alinea's kost, moet ook drie alinea's aan gevolg waard zijn — zie fase 1 voor wat er misgaat als
dat niet zo is.

**Uitleggerigheid.** Achtergrondinformatie hoort in dialoog of handeling, nooit in een pure
vertellersalinea die een personage "eigenlijk allang weet". Toets: zou dit personage dit ooit
hardop zeggen tegen iemand die het al weet? Zo nee, herschrijf als iets dat de speler zelf ziet
gebeuren, of laat een ánder personage (dat het inderdaad niet weet) het vragen.

**Namen introduceren.** Mythologische namen komen bij hun eerste optreden altijd met een korte,
functionele omschrijving in dezelfde zin ("Nestor — nog een van de jongste aan boord, maar nu al
opvallend kalm en verstandig") in plaats van een aparte uitlegzin erna.

**Tijd en plaats aanduiden.** Nooit "Hoofdstuk N", nooit "eerder in dit verhaal", nooit "zoals je
las". Wel: "toen je bij de jacht op het everzwijn stond", "sinds de nacht in Aulis", "de dag dat
Hera's jaloezie voor het eerst een sterveling trof". Elke tijdsaanduiding wortelt in een
gebeurtenis, nooit in de structuur van het spel.

**Systeemtaal.** Geen "unlock", "stat", "flag", "level", "quest", "save", "punten" — ook niet in
vertaling ("statpunt", "ontgrendeld"). Getallen mogen zichtbaar zijn uitsluitend bij vergrendelde
keuzedrempels; nergens anders, en zeker niet in combat- of puzzelschermen.

**Geweld en tragiek.** Het spel toont het gevolg, niet de gruwelijkheid zelf in detail (vergelijk
hoe `CH2_H06`, Herakles' waanzin, bewust "buiten beeld" blijft — de speler ziet de stilte erna,
niet de daad). Volg dit patroon: het gewicht zit in de nasleep, niet in de choreografie.

**Aanspreking van de speler.** Nooit "welkom terug", nooit een systeemmelding die de vierde wand
doorbreekt. Toasts en UI-teksten mogen kort en functioneel zijn, maar altijd in een woordkeuze die
ook een personage zou kunnen gebruiken (vergelijk de bestaande, goede voorbeelden: "Codex
bijgewerkt", "Nieuwe herinnering verzameld" — geen "Save successful" of "Unlocked").
