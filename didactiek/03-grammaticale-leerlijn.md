# Fase 3 — Grammaticale leerlijn

Bron: `SP_PUZZLES` (71 entries, actief getoetst) en `SP_CODEX_ENTRIES` met
`cat:"grammatica"` (17 entries, naslag) uit `certamen/singleplayer-data.js`,
plus de grammaticale constructies die in de leesvallen zitten (Fase 1/2,
passief, nooit getoetst). Zelfde methodologische kanttekening als Fase 2:
ik heb geen toegang tot de exacte lesmethode van jouw school — de
"gangbare VWO-volgorde" hieronder is gebaseerd op de gebruikelijke opbouw in
de grote methodes (naamvallen/persoonsvormen jaar 1, meer declinaties +
tijden jaar 2, A.C.I./vergelijkingstrappen/deelwoorden jaar 2-3,
ablativus absolutus/coniunctivus/gerundivum bovenbouw) — **geen ijkpunt tegen
een specifiek methodeboek**. Als je wilt dat ik dit tegen de exacte
leerlijn van jullie methode leg, geef me die leerlijn (inhoudsopgave volstaat).

## 1. Matrix: hoofdstuk × constructie (actief getoetst, uit `SP_PUZZLES`)

| Hfd | Nieuwe constructies (eerste optreden) |
|---|---|
| H1 | Grieks lidwoord (ὁ/ἡ/τό); nominativus/accusativus/vocativus (Latijn + Grieks) |
| H2 | praesens 3e pers. enk. (1e/3e/4e conjugatie); imperativus enk. (3e/4e conj., ook `ire`-samenstelling); *esse*/*posse* onregelmatig |
| H3 | genitivus enk. (1e/2e/3e declinatie); dativus enk. (1e/3e declinatie) + dativus mv.; bijstelling (congruentie in naamval) |
| H4 | infinitivus; vocativus (vervolg, Griekse namen op -eus); ablativus van middel; imperfectum; perfectum |
| H5 | dativus Grieks met iota subscriptum (η-stam); ablativus van middel (tile-swap-vorm); herhaling nom./acc./gen. |
| H6 | praesens 2e conjugatie (-ēre); imperfectum (herhaling); perfectum (typed, 4e conj.); matching perfectum-praesens-stammen; vocativus Grieks (Βάκχος → Βάκχε) |
| H7 | genitivus mv. (2e declinatie); dativus Grieks (καλλίστη-type); accusativus (typed); ablativus van middel; perfectum onregelmatig (*capere* → *cepit*); matching tempora |
| H8 | **aoristus** (Grieks): sigmatisch én thematisch; 3e declinatie medeklinkerstam (Latijn, *senex*/*miles*); aanwijzend voornaamwoord (congruentie, onzijdig mv.); imperfectum (herhaling) |
| H9 | comparativus/superlativus (3e declinatie bijv. nw.); **A.C.I.** (tweemaal, Trojaanse + Griekse kant); 3e declinatie (*urbs*, *navis* i-stam); congruentie bijv. nw. |
| H10 (skelet) | nog geen nieuwe `SP_PUZZLES`-entries (hoofdstuk is nog grotendeels onbebouwd, zie §7.19 in `Chronica.md`) |

**Signalering**: dit is een keurige, oplopende leerlijn qua *type* constructie
(naamvallen → persoonsvormen → tijden → onregelmatige vormen → aoristus/
A.C.I.) en bevat geen zichtbare misplaatsing — er verschijnt geen
bovenbouwconstructie (coniunctivus, gerundivum, ablativus absolutus als
actief getoetste vorm) vroeg in het spel. De aoristus in H8 en de A.C.I. in
H9 liggen op een plek die aansluit bij een gangbare 2e/3e-jaars-volgorde.

## 2. Constructies die uitsluitend passief voorkomen (nooit getoetst) — de unsheltered-grammar-toets

Uit Fase 1/2: de 13 leesvallen bevatten grammaticale verschijnselen die in
`SP_PUZZLES` **niet terugkomen**:

- **Genitivus absolutus** (Grieks, `CH9_GRI_008B`) — nergens in `SP_PUZZLES` als
  actief getoetste vorm.
- **Conditionaliszin met ἐάν + conjunctief** (`CH8_EPI_003`) — nergens actief
  getoetst.
- **Passief aorist-deelwoord** (τῷ ἀδικηθέντι, `CH7_003_EED`) — nergens actief
  getoetst (H8's deelwoord-achtige stof gaat over aoristus-*persoonsvormen*,
  niet over deelwoorden).
- **Prohibitief μή + imperativus** (`CH8_EPI_009`) — de actief getoetste
  imperativus (H2) is alleen bevestigend, nooit een verbodsvorm.
- **Futurum** (`CH7_005B`, τὸ τέκνον ἀπολεῖ) — futurum komt in geen enkele
  `SP_PUZZLES`-entry voor.
- **Ablativus comparationis** (`CH6_003B`, Niobe deā potior est) — de actief
  getoetste ablativus (H4/H5/H7) is steeds ablativus van middel, nooit van
  vergelijking.
- **Deelwoordaanhechting/woordvolgorde-subtiliteit** (`CH9_TRO_010`, Timeo
  Danaos et dona ferentes) — dit is een leesvaardigheid (samenhang herkennen),
  geen aparte grammaticale categorie die apart getoetst wordt.

**Beoordeling volgens TPRS/unsheltered-grammar-principe (B.1)**: dit is
precies het gewenste patroon — de leesvallen laten de speler complexere
constructies *herkennen in context* zonder dat hij ze moet kunnen *benoemen
of produceren*. Dit is een van de sterkste punten van het huidige ontwerp,
en verdient het om zichtbaar zo te blijven (niet alsnog "vereenvoudigen" om
de leesvallen makkelijker te maken, en niet alsnog een `PUZZLE:` van maken —
dat zou het principe juist ondermijnen).

## 3. Constructies die uitsluitend actief getoetst worden (nooit in dialoog/passieve laag) — het omgekeerde signaal

Vrijwel alle 71 `SP_PUZZLES`-constructies vallen in deze categorie: van de
grammatica die in H1-H9 wordt getoetst (lidwoord, naamvallen, tijden,
aoristus, A.C.I.), komt **op vier uitzonderingen na** (zie Fase 1: "Iuppiter
fulmen misit" = perfectum, herhaalt `puzzle_ch2s`-vorm; "Mane quadrupes..." =
Sfinxraadsel, herhaalt `puzzle_ch6_sfinx`; "τῇ καλλίστῃ" = dativus, herhaalt
`puzzle_ch7_dativus_grieks`; "Πάτροκλος ἀπέθανεν" = aoristus, spiegelt
H8's aoristusstof) **geen enkele geleerde constructie ooit terug in de
verhaaltekst zelf**. Dat is exact het patroon dat de opdracht vraagt te
signaleren: *"waar grammatica alleen in checks voorkomt en nooit in gewone
dialoog — dat is het teken dat we nog toetsen in plaats van onderdompelen."*

Concreet: de vocativus (H1, H4), imperativus (H2), genitivus/dativus (H3, H5,
H7), infinitivus (H4), 3e-declinatie-medeklinkerstam (H8) en
comparativus/superlativus/congruentie (H9) worden **alleen** in een
multiple-choice/typed/matching-vraag getest — nooit ervaart de speler diezelfde
vorm nog een keer in een NPC-zin, gloss, of leesval. Dit is dezelfde
bevinding als Fase 2 §4 (herhaling stopt), nu bevestigd op grammaticaniveau:
het is niet alleen woordenschat die eenmalig blijft, de grammatica die
er net geleerd is, komt evenmin terug in de doorlopende tekst.

## 4. Waar zit de leerlijn wél goed?

- De **opbouwvolgorde van constructie-type** is intern consistent en volgt
  een gangbare zwaarte-opbouw (zie §1) — geen rode vlag hier.
  Structurele herhaling van eenzelfde constructie **binnen** een hoofdstuk
  (bv. drie lijnen in H1 met elk dezelfde drie constructies in een andere
  mythe) is een sterk punt: dat is precies narrow reading/herhaling-met-
  variatie op woordenschat- én grammatica-niveau, alleen dan bewust beperkt
  tot de puzzel-laag.
- De **matching_tempora**-puzzels (H6, H7) en de **parallelle aoristus-
  paren** (H8, sigmatisch/thematisch in twee spiegelscènes) zijn een goed
  voorbeeld van gespreide herhaling binnen de toetsing zelf (zie ook Fase
  9 se spaced-retrieval-punt in `00-kader.md`).

## 5. Belangrijkste hiaat

De twee systemen — actieve toetsing (`SP_PUZZLES`, blijft de hele game
doorlopen) en passieve blootstelling (leesvallen/gloss, ook doorlopend) —
**delen bijna geen materiaal**. Ze zijn ontworpen als twee aparte lagen
(bewust, zie `Chronica.md` §7.16: "geen `VOCAB:`-hook nodig, puur
herkenning/sfeer") maar het gevolg is dat een geleerde constructie zelden
de kans krijgt zich te settelen via een tweede, andersoortige blootstelling
(eerst *expliciet herkennen in een vraag*, dan *impliciet herkennen in een
verhaal*) — beide systemen bestaan, maar naast elkaar, niet na elkaar.
Zie Fase 10 voor een concreet voorstel om dit te verbinden.
