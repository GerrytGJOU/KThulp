# Fase 2 — Woordenschatdekking

Bron: zelfde extractie als [`01-taalregister/register.json`](01-taalregister/register.json),
aangevuld met tellingen over `SP_VOCAB_ENTRIES` (93 entries, het spel se eigen
"getaught"-woordenlijst) en `VOCAB_LA`/`VOCAB_EL` uit `certamen/vocab.js`
(twee frequentielijsten van ~1000 lemma's elk, gebruikt door Training/Vrij
Oefenen). Cijfers zijn gemeten, niet geschat — de methode en de beperkingen
ervan staan hieronder expliciet genoemd.

## 0. Methodologische beperking — lees dit eerst

Er is **geen lemmatizer** beschikbaar in dit project. `VOCAB_LA`/`VOCAB_EL`
bevatten woordenboekvormen (lemma's, bv. *sum*, *rex*); de speler ziet in de
verhaaltekst vervoegde/verbogen vormen (bv. *est*, *regis*). Een woord-voor-
woord match tussen tekstvorm en frequentielijst mist dus vrijwel elke
vervoeging/verbuiging, en de "dekking tegen de frequentielijst" die dat
oplevert is een **ondergrens**, geen echte dekkingsgraad. Ik heb dit daarom
niet als hoofdmaat gebruikt (zie §1 voor wat het wél laat zien). De
maat die ik wél als hard en zinvol beschouw, is: **is dit woord al eerder aan
de speler getoond**, via `SP_VOCAB_ENTRIES` (het spel z'n eigen curriculum,
mét vervoegde vormen tussen haakjes, bv. `"errare (errat)"`) of via eerdere
verhaaltekst zelf (§2). Dat is exact meetbaar, en is de kernmeting hieronder.

Wat níet gemeten kon worden: dekking tegen wat de leerling *uit de reguliere
lesmethode* al kent (Fabula Discit, Bingham, of welke methode dan ook) — dat
vereist een lijst uit die methode, die niet in deze repo aanwezig is. Als je
wilt dat ik dat ook meet, geef me de woordenlijst (bv. als bestand of Excel)
van de methode die jouw leerlingen gebruiken.

## 1. Ruwe frequentielijst-check (ondergrens, zie beperking hierboven)

Exacte-vorm-match van elk woordvorm in de 39 passieve/leesval-fragmenten
tegen `VOCAB_LA`/`VOCAB_EL` (rang 1 = meest frequent):

| Hoofdstuk | % woordvormen met exacte match in frequentielijst |
|---|---:|
| CH1 | 100% (n=3, "Ecce" x3) |
| CH2 | 14% |
| CH3 | 17% |
| CH4 | 29% |
| CH5 | 40% |
| CH6 | 25% |
| CH7 | 17% |
| CH8 | 9% |
| CH9 | 33% |
| CH10 | 17% |

Dit getal is dus zwak (zie §0) maar niet nutteloos: het bevestigt dat de
leesval- en passieve-laagzinnen bewust **niet uit de kern-hoogfrequente
woordenschat** komen (in tegenstelling tot wat je bij i+1-comprehensible-input
zou verwachten) — logisch voor leesvallen (die moeten net een complexe
constructie bevatten om een val te zijn), maar de moeite van het checken waard
voor de "sfeer/passieve laag"-fragmenten die wél voor breed begrip bedoeld
zijn.

## 2. Kernmeting: is het woord al eerder getoond aan de speler?

Voor elk van de 39 fragmenten (in hoofdstukvolgorde), het percentage
woordvormen dat de speler op dát punt al kent — via `SP_VOCAB_ENTRIES`
(expliciet getoond in Codex Memoriae) **of** via een eerder fragment in deze
laag zelf (incidentele herhaling):

| Fragment | Hfd | Taal | Woorden | % al bekend | Onder 95%? |
|---|---|---|---:|---:|---|
| CH1_A11/B09/C12 ("Ecce") | H1 | LA | 1 | 0→100% | 1e keer nee, daarna ja |
| CH2_L02C (leesval "Iunonis oculi ubique") | H2 | LA | 3 | 33% | **ja** |
| CH2_S06 ("Iuppiter fulmen misit") | H2 | LA | 3 | 67% | **ja** |
| CH3_H23 (leesval "Οὐδεὶς ὅπλα φέρει") | H3 | EL | 3 | 0% | **ja** |
| CH3_IO14/H25 ("Χαῖρε"/"Νικῶ") | H3 | EL | 1 elk | 0% | **ja** |
| CH4_T06B (leesval "Ad omne bivium...") | H4 | LA | 5 | 0% | **ja** |
| CH4_T13 ("Icare") | H4 | LA | 1 | 0% | **ja** |
| CH5_022B / CH5_027 (leesvallen) | H5 | EL | 5 / 2 | 0% / 0% | **ja** |
| CH5_026 ("ὕπνε, ἐλθέ") | H5 | EL | 2 | 0% | **ja** |
| CH6_003B (leesval "Niobe deā potior est") | H6 | LA | 4 | 25% | **ja** |
| CH6_011B (leesval "Polynices nondum venit") | H6 | LA | 3 | 0% | **ja** |
| CH6_008 (Sfinxraadsel, 7 woorden) | H6 | LA | 7 | 14% | **ja** |
| CH7_003_EED / CH7_005B (leesvallen) | H7 | EL | 4 / 5 | 0% / 0% | **ja** |
| CH7_005 ("τῇ καλλίστῃ") | H7 | EL | 2 | 50% | **ja** |
| CH8_EPI_003 / _009 (leesvallen) | H8 | EL | 6 / 2 | 0% / 0% | **ja** |
| CH8_EPI_001 ("Πάτροκλος ἀπέθανεν") | H8 | EL | 2 | 0% | **ja** |
| CH9_TRO_010 (leesval "Timeo Danaos...") | H9 | LA | 5 | 0% | **ja** |
| CH9_GRI_008B (leesval genitivus absolutus) | H9 | EL | 5 | 20% | **ja** |
| CH9_TRO_009 ("λέγει Ἀχαιοὺς ἀπελθεῖν") | H9 | EL | 3 | 0% | **ja** |
| CH10 fragmenten (4, skelet) | H10 | gemengd | 1-6 | 0-17% | **ja** (3 van 4) |
| Alle "Ecce"/orakel-terugkerende fragmenten (14x) | alle | LA | 1 | 100% na de 1e keer | nee |

**Resultaat: 26 van de 39 fragmenten (67%) zitten onder de 95%-drempel voor
vloeiend lezen — en de meeste daarvan zitten op 0%: geen enkel woord in de
zin is de speler ooit eerder getoond.** Zie het volledige overzicht in
[`01-taalregister/register.json`](01-taalregister/register.json) (elk
fragment met token- en dekkingscijfer zit ook in de ruwe scriptoutput,
opvraagbaar).

### Dit is genuanceerder dan het klinkt — twee categorieën, niet één

1. **De 13 leesvallen zijn met opzet moeilijk.** Een leesval bestaat bij de
   gratie van een verborgen valkuil (verborgen naamval, gemiste ontkenning,
   genitivus absolutus...) — een leesval die voor 95%+ uit bekende woorden
   bestaat zou vaak ook geen echte val meer zijn. Een lage dekkingsgraad is
   hier dus **niet automatisch een gebrek**, het is inherent aan het
   ontwerp-doel (zie Fase 7 voor de eigen toetsing hiervan). Wat wél een
   probleem is: als 100% van de leesvallen laag scoort, oefent de speler
   nooit het *gemakkelijke* geval (bijna alles bekend, één addertje) — alleen
   het moeilijke. Zie de aanbeveling hieronder.
2. **De 13 "Laag 2"-gloss-fragmenten** (`Chronica.md` §7.16, de "korte zinnen
   op het geleerde grammaticaniveau") zijn wél expliciet bedoeld als
   *leerbare* zin, met een gloss als vangnet. Voor déze categorie is een lage
   dekking wél een echt punt van zorg: ze zouden júist grotendeels uit al
   bekende bouwstenen moeten bestaan, met één nieuw element als leerdoel — nu
   scoren ze net zo laag als de leesvallen (0-67%). Zonder de gloss zou geen
   van deze zinnen voor een leerling zonder hulp haalbaar zijn.
3. De **"Ecce"/"Χαῖρε"-sfeerlaag** (Laag 1) is de enige categorie die het
   principe van herhaalde, incidentele verwerving daadwerkelijk toepast:
   "Ecce" komt 14 keer voor en is na de eerste keer altijd "bekend". Dit is
   het enige woord in het hele spel waarvoor een dekkingscurve zoals
   comprehensible-input-theorie die voorschrijft, ook echt bestaat.

## 3. Herhalingsspreiding — eenmalige woorden vs. goed gespreide woorden

Van de **86 unieke woorden** in de passieve laag + leesvallen samen:

- **Goed gespreid (verwerving waarschijnlijk):** 1 woord — *ecce* (14
  voorkomens, verspreid over 9 van de 10 hoofdstukken, dus met ruime afstand
  tussen herhalingen — precies het spaced-repetition-patroon dat B.1 als
  basis voor verwerving noemt).
- **Eenmalig (verwerving onwaarschijnlijk binnen deze laag):** **85 van de 86
  woorden** — dus 99% van de woordenschat in de passieve/leesval-laag komt
  precies één keer voor in het hele gebouwde spel (Proloog–Hoofdstuk 10).
  Volledige lijst in [`01-taalregister/register.json`](01-taalregister/register.json).

Dit is de scherpste bevinding van deze audit-fase: **de passieve taallaag en
de leesvallen zijn, qua herhaling, het tegenovergestelde van narrow reading.**
Elk fragment introduceert nieuwe woorden die daarna nooit meer terugkomen.
Vergelijk dit met `SP_VOCAB_ENTRIES` zelf (§4): dat systeem hergebruikt
bewust dezelfde woorden in meerdere puzzels binnen één hoofdstuk (bv.
*aperit* in zowel de Midas- als de Pandora-puzzel) — het narratieve-tekst-
niveau (leesvallen/passieve laag) doet dat vrijwel niet.

## 4. Sheltered vocabulary — hoe streng is de woordenschat in de rest van het spel?

`SP_VOCAB_ENTRIES` (het spel z'n eigen curriculum, gekoppeld aan
`SP_PUZZLES` via `VOCAB:`-hooks) is een aparte, tweede laag met een heel
ander patroon:

- **93 woorden totaal**, verdeeld over Hoofdstuk 1 t/m 6 (zie tabel in
  [`01-taalregister/SAMENVATTING.md`](01-taalregister/SAMENVATTING.md)) — 12,
  17, 10, 16, 10, 7 nieuwe woorden per hoofdstuk. Dat is een redelijk
  sheltered tempo (10-17 nieuwe woorden per hoofdstuk is behapbaar), **mits**
  Hoofdstuk 7-10 ooit hetzelfde tempo krijgen.
- **Kritiek punt: de `VOCAB:`-hook (en dus de groei van deze woordenlijst)
  stopt volledig na Hoofdstuk 6.** Hoofdstuk 7, 8, 9 en het Hoofdstuk-10-
  skelet voegen geen enkel nieuw woord toe aan `SP_VOCAB_ENTRIES`/Codex
  Memoriae, terwijl er wel degelijk nieuwe puzzels en nieuwe Latijnse/Griekse
  fragmenten (leesvallen, gloss) in die hoofdstukken staan. Met andere
  woorden: vanaf Hoofdstuk 7 groeit de zichtbare, expliciet aangeboden
  woordenschat van het spel niet meer mee met de rest van de inhoud.
- Dit is **niet hetzelfde probleem** als punt 2/3 hierboven (de gloss-
  fragmenten en leesvallen), maar versterkt het: als `SP_VOCAB_ENTRIES` was
  blijven groeien in H7-H9, hadden de leesvallen/gloss-zinnen in die
  hoofdstukken een eerlijke kans gehad om uit al aangeboden bouwstenen te
  putten. Nu ontbreekt dat fundament juist in de hoofdstukken waar de
  taalcomplexiteit (genitivus absolutus, A.C.I., voorwaardelijke zinnen) het
  hoogst is.

## 5. Eerste, voorlopige conclusie (wordt in latere fases verder uitgewerkt)

Met de cijfers van deze twee fases op tafel: het spel heeft een **werkend,
consistent mechanisme** (passieve laag + leesvallen) maar op een **schaal die
extensive reading/narrow reading niet ondersteunt** — 99 woordvormen in tien
hoofdstukken, 99% daarvan eenmalig, en de enige aanvullende
woordenschatbron (`SP_VOCAB_ENTRIES`) stopt bij Hoofdstuk 6. Dat is
consistent met wat Fase 1 al liet zien (10 fragmenten per hoofdstuk
gemiddeld) en betekent dat op dit moment de meeste didactische waarde van dit
systeem zit in **motivatie/sfeer/onderdompelingsgevoel** (waarde op zich,
zie B.2), niet in meetbare woordenschatverwerving via herhaling — die
laatste claim zou pas overeind blijven als de herhalingsdichtheid en het
groeitempo van `SP_VOCAB_ENTRIES` allebei omhoog gaan.

Dit is precies de "als de cijfers slecht zijn, verandert de rest van de audit
van karakter"-situatie die vooraf was aangekondigd. Voordat ik verderga naar
Fase 3-10: wil je dat ik doorga zoals gepland, of eerst met jou bespreek of
de prioriteit moet verschuiven naar het ophogen van herhaling/spreiding
(bv. `SP_VOCAB_ENTRIES` weer laten doorgroeien in H7-H10, en bestaande
Laag-2-woorden vaker laten terugkomen) vóór de rest van de audit?

## 6. Naschrift (2026-07-29) — de frequentielijst daadwerkelijk gebruikt

Na Gerbens verzoek is `SP_VOCAB_ENTRIES` gekruist tegen `VOCAB_LA`/`VOCAB_EL`
(lemma-matching met een voorzichtige werkwoord-stam-fallback voor
infinitief-vs-1e-persoon-citeervormen, ambigue stam-matches genegeerd).

**Taalverdeling was schever dan het per-hoofdstuk-aantal liet vermoeden**:
van de 93 woorden waren er 83 Latijn en slechts 10 Grieks — ook in
hoofdstukken die zelf Grieks-verteld heten. Frequentiedekking: 37 van de
top-500 Latijnse woorden gedekt (7%), maar slechts 4 van de top-500 Griekse
(0,8%).

**Meteen gerepareerd, zonder nieuwe verhaaltekst** (zelfde "gratis"-methode
als bij `10-voorstellen.md` #2 — woorden die al in bestaande `SP_PUZZLES`
staan maar nooit een `SP_VOCAB_ENTRIES`-entry + hook kregen): `liberi`
(rang 324, H6, al in `puzzle_ch6_praesens` over Niobe's kinderen),
`πέμπω`/`φεύγω`/`λύω`/`βάλλω` (rang 261-409, H8, al in de aoristuspuzzels),
`fortis`/`discedere`/`maestus` (rang 298-992, H9, al in de
comparativus/A.C.I./congruentie-puzzels). Nu **101 woorden, 87 Latijn/14
Grieks**. Volledig verslag: `Chronica.md` §7.26.

Gerben heeft bevestigd dat ook de allerhoogste-frequentie functiewoorden
(et, sum, qui, καί, οὐ...) gebruikt mogen worden, ook al passen die minder
natuurlijk in verhaaltekst — ze zijn juist waardevol voor leesvallen en
Combat-bridge-herhaling.

**Vervolg, na goedkeuring**: Hoofdstuk 7 kreeg 4 nieuwe Latijnse woorden.
Gerbens eigen naamgevingsregel (Griekse godennaam → Grieks-verteld,
Latijnse naam → Latijns-verteld) toegepast op de code (tellingen van
Zeus/Hera/Athena vs. Iuppiter/Iuno/Minerva/Diana per hoofdstuk/lijn) legde
bloot dat niet alleen Hoofdstuk 3 maar óók Hoofdstuk 5 Grieks-verteld is
(0× Latijnse godennamen), en dat Hoofdstuk 2 zijn eigen 2-om-2-mix had
(L/Latona, S/Semele = Latijn; K/Kallisto, H/Herakles = Grieks) zonder dat
de Griekse helft ooit eigen vocab kreeg. Aangevuld: 5 Griekse woorden op de
Griekse lijnen van H2, 5 op H3, 5 op H5 — allemaal uit de frequentielijst.
**Eindstand: 120 woorden, 91 Latijn/29 Grieks (was 93, 83/10)** — van 10,8%
naar 24,2% Grieks. Volledig verslag: `Chronica.md` §7.26.
