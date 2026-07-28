# Fase 7 — Didactiek: taalverwerving in het spel

## 0. Onderzoek: wat kunnen we gebruiken?

| Model | In één zin: wat we ermee kunnen |
|---|---|
| **Comprehensible input / i+1 (Krashen)** | Taal die net iets boven het niveau van de speler ligt maar door context begrijpelijk blijft, bevordert verwerving zonder expliciete regeldrilling — precies het principe achter een passieve laag met NPC-zinnen naast Nederlandse verteltekst. |
| **Extensive vs. narrow reading** | Herhaald lezen binnen één thema/cyclus (narrow reading) bouwt sneller woordenschat op dan breed maar oppervlakkig lezen — Chronica's hoofdstuk-per-mythecyclus-structuur is van nature al "narrow reading", wat een pedagogisch voordeel is dat het spel nu niet bewust uitbuit. |
| **Incidentele woordverwerving via context** | Herhaalde blootstelling aan een woord in een informatieve context (niet alleen frequentie, ook contextrijkdom) verklaart een groot deel van vocabulaireverwerving bij lezen — pleit voor woorden die in meerdere, betekenisvol verschillende zinnen terugkeren in plaats van één keer geïntroduceerd en losgelaten. |
| **Glossen: in-tekst versus marginaal versus geen** | In-tekstglossen (direct naast het woord) verlagen cognitieve belasting en verbeteren begrip sterker dan marginale glossen door het "split-attention"-effect te vermijden — relevant voor het glosbeleid in §5. |
| **Spaced retrieval / gespreide herhaling** | Herhaald ophalen van een woord met tussenpozen (in plaats van massed practice) verbetert onthouden aantoonbaar, met leerwinsten die oplopen tot decennia aan onderzoek — precies het mechanisme dat Chronica's Combat-bridge al *toevallig* gebruikt (zie §2) en bewust zou moeten uitbreiden. |
| **Ørberg / Lingua Latina per se illustrata** | De inductieve, contextuele "natuurlijke methode" — grammatica wordt niet uitgelegd maar afgeleid uit doorlopende, begrijpelijke tekst, ondersteund door marginale aantekeningen — is qua filosofie al de leidraad achter Chronica's puzzelontwerp (grammatica landt in het verhaal, niet ervoor); het verschil is dat Ørberg dit voor élke zin doet en Chronica alleen op puzzelmomenten. |
| **Athenaze** | Combineert onmiddellijk doorlopend Grieks lezen met systematisch geordende grammatica-uitleg erna — een expliciet middenmodel tussen puur inductief en puur regelgestuurd, bruikbaar als sjabloon voor hoe Chronica's Griekse spoor (zie §6) grammatica zou kunnen aanbieden zodra dat spoor apart gaat lopen. |

**Bronnen:**
- [Language Acquisition Theory — Krashen (Montgomery County Public Schools)](https://www.montgomeryschoolsmd.org/siteassets/district/curriculum/esol/cpd/module2/docs/krashenFINALtext.pdf)
- [Extensive Reading, Narrow Reading and second language learners (Australian Library Journal)](https://www.tandfonline.com/doi/abs/10.1080/00049670.2011.10722583)
- [The effects of context and word exposure frequency on incidental vocabulary acquisition (Language Learning Journal)](https://www.tandfonline.com/doi/abs/10.1080/09571736.2016.1244217)
- [Unraveling Contradictions: Which Glosses Facilitate Reading Comprehension (Journal of Language Teaching and Research)](https://jltr.academypublication.com/index.php/jltr/article/download/2030/1682/6583)
- [The Effects of Spaced Practice on Second Language Learning: A Meta-Analysis (Language Learning, Kim 2022)](https://onlinelibrary.wiley.com/doi/abs/10.1111/lang.12479)
- [Lingua Latina per se illustrata — Wikipedia](https://en.wikipedia.org/wiki/Lingua_Latina_per_se_illustrata) en [Schola Latina, "Latine discere aude"](https://scholalatina.it/en/latine-discere-aude-our-method/)
- [Athenaze: An Introduction to Ancient Greek — Oxford University Press](https://global.oup.com/ushe/product/athenaze-book-i-an-introduction-to-ancient-greek-9780190607661) en [Schola Latina, "Graece discere aude"](https://scholalatina.it/en/graece-discere-aude-our-method/)

---

## 1. Grammaticale opbouw

Uit `SP_CAMPAIGN[n].grammatica` (`certamen/singleplayer-data.js`):

| Hoofdstuk | Nieuwe grammatica |
|---|---|
| Proloog | Grieks alfabet, taalbewustzijn, eerste Latijnse woorden |
| H1 | Znw., bnw. (groep 1/2), lidwoord, nominativus, accusativus, vocativus |
| H2 | Praesens, werkwoordstammen, imperativus, *esse*, *posse* |
| H3 | Genitivus, dativus, bijstelling |
| H4 | Infinitivus, vocativus (herhaald), imperfectum, perfectum, ablativus |
| H5 | Herhaling nom. t/m abl. — geen nieuwe stof |
| H6 | Herhaling praesens t/m perfectum — geen nieuwe stof |
| H7 | Cumulatieve herhaling van H5+H6 samen — geen nieuwe stof |
| H8 | Sigmatische/thematische aoristus (Grieks); 3e-declinatie medeklinkerstammen + aanwijzend/persoonlijk voornaamwoord (Latijn) |
| H9 | Comparativus/superlativus, A.C.I., 3e-declinatie i-stammen, congruentie |

**Oordeel: de opbouw loopt op en bevat geen sprongen.** Elke naamval/werkwoordsvorm die
geïntroduceerd wordt, komt in een later hoofdstuk terug als herhaling vóór er iets nieuws
bovenop komt (H5-7 zijn expliciet herhalingshoofdstukken). Er is één welbewuste dubbeling —
vocativus in zowel H1 als H4 — maar dat is spreiding, geen fout: H1 introduceert hem licht (drie
losse puzzels), H4 herhaalt hem in een zwaardere context (`CH4_T13`, de val van Ikaros).

**Eén echt gat, geen sprong maar een stilstand:** na H4 introduceert het spel drie hoofdstukken
lang (H5, H6, H7 — 145 scènes, bijna een derde van het hele spel) geen enkele nieuwe
grammaticale vorm. Dat is verdedigbaar als geconsolideerde herhaling, maar het betekent ook dat
een leerling die Hoofdstuk 4 goed beheerst, drie hoofdstukken lang niets nieuws leert voor hij bij
Hoofdstuk 8 de aoristus/3e declinatie tegenkomt. Vergelijk dit met fase 2's bevinding dat
dezelfde drie hoofdstukken ook de laagste reactiviteitsscores hebben (H5: 6, H6: 8, H7: 3) — de
grammaticale stilstand en de verhalende stilstand vallen op dezelfde plek samen.

**H8/H9 splitsen de nieuwe stof per taal** (Grieks krijgt aoristus, Latijn krijgt 3e declinatie +
voornaamwoorden in H8; beide talen delen comparativus/A.C.I./3e-declinatie-i-stam/congruentie in
H9). Dat is een zinnige aanpak zolang beide talen samen worden gespeeld (zie §6), maar het
betekent wel dat een leerling die alléén Grieks doet, in H8 de hele Latijnse 3e-declinatie/
voornaamwoorden-stof gewoon overslaat zonder dat het spel dat merkt of compenseert.

---

## 2. Woordenschat

`SP_VOCAB_ENTRIES` bevat **93 woorden: 83 Latijn, 10 Grieks** — een verhouding van ruim 8:1.

### 2a. De scheve verdeling is geen instapfout, maar wordt structureel erger

| Hoofdstuk | Nieuwe Latijnse woorden | Nieuwe Griekse woorden |
|---|---|---|
| Proloog + H1 | 9 | 3 |
| H2 | 17 | 0 |
| H3 | 10 | 0 |
| H4 | 16 | 0 |
| H5 | 9 | 1 |
| H6 | 6 | 1 |
| H7, H8, H9 | **0** | **0** |

Na Hoofdstuk 1 daalt de instroom van Grieks woordenschat naar vrijwel nul (1 woord in H5, 1 in
H6), en vanaf Hoofdstuk 7 stopt de Codex-vocabulaire — beide talen — volledig, ook al voegen H8
en H9 juist hun zwaarste nieuwe grammatica toe (aoristus, 3e declinatie, A.C.I.). De puzzels zelf
gebruiken in die hoofdstukken wél nieuwe woorden (zie de puzzelteksten), maar die woorden worden
nooit met een `VOCAB:`-hook aan `SP_STATE.vocab` toegevoegd, en komen dus **nooit terug in de
Codex, en nooit terug in een Combat-bridge-quiz** (zie 2b).

### 2b. Een verborgen sterk punt — en een verborgen fout die het ondermijnt

**Sterk punt, niet eerder benoemd in deze audit:** `spCombatNextQuestion()`
(`certamen/singleplayer.js:1837-1838`) trekt zijn meerkeuzevraag uit **alle** woorden die de
speler ooit heeft geleerd (`SP_STATE.vocab`), niet alleen de nieuwste. Met 15 Combat-bridges
verspreid over het spel is dit, waarschijnlijk onbedoeld, al een werkend **spaced-retrieval-
mechanisme**: een woord uit Hoofdstuk 1 kan in een gevecht in Hoofdstuk 6 zomaar terugkomen. Dat
is precies het soort gespreide herhaling dat de onderzoeksliteratuur aanraadt (zie §0), en het
gebeurt al, zonder dat er ooit over is nagedacht als didactisch instrument.

**De fout die dit ondermijnt:** deze pool wordt **niet gefilterd op taal**. Een speler die alleen
Grieks doet, krijgt in een Combat-bridge een willekeurige vraag uit een pool van 83 Latijnse en 10
Griekse woorden — dus in ruim 89% van de gevallen een Latijns woord dat hij nooit heeft gehad.
Omgekeerd geldt hetzelfde voor een Latijn-only speler bij het kleine aandeel Griekse vragen. Zie
§6 voor hoe dit zich verhoudt tot het voorgestelde taalspoor: zolang beide talen gezamenlijk
worden gespeeld is dit geen probleem (iedereen heeft toch beide talen gehad), maar zodra een
instelbaar taalspoor bestaat, moet `spCombatNextQuestion()` filteren op het gekozen spoor — anders
wordt precies het mechanisme dat nu de sterkste didactische verborgen kwaliteit van het spel is,
de plek waar een eentalige leerling voortdurend op onbekende stof wordt getoetst.

### 2c. Terugkeerfrequentie: weinig woorden vaak, of veel woorden zelden?

Zonder een externe frequentielijst raadpleegbaar binnen deze audit, is het antwoord kwalitatief
maar duidelijk: de meeste van de 93 woorden zijn **mythologie-specifiek en laagfrequent** in het
klassieke corpus als geheel (*labyrinthus*, *quadrupes*, *vellus*, *crotala*), niet de
hoogfrequente kernwoorden die een leerling in doorlopende Latijnse of Griekse tekst het vaakst
tegenkomt (*facere*, *dicere*, *videre*, *magnus*). Enkele echte kernwoorden zitten er wel tussen
(*rex*, *terra*, *bellum*, *miles*, *ira*, *mare*) — vooral in de latere, oorlog-gethematiseerde
hoofdstukken. Dat is verdedigbaar (het spel is een verhaal, geen frequentiedrill), maar het
betekent wel dat de vocabulaire van Chronica Classica een ander doel dient dan een klassieke
frequentielijst-methode: het is **verhaalvocabulaire**, geen **examenvocabulaire**. Voor het doel
van dit spel (sfeer, herkenning, motivatie) is dat geen probleem — voor een docent die hoopt dat
de Combat-bridges ook examenwoordenschat automatiseren, wél een verwachting om bij te stellen.

---

## 3. Verhouding passief en actief

Ruwe maat: tekstlengte (passief, met of zonder gloss) tegenover het aantal puzzels + STAT-gates +
Combat-bridges (actief, waar de speler iets moet *doen* met de taal) per hoofdstuk.

| Hoofdstuk | Tekst (chars, ruw) | Puzzels | STAT-gates | Combat | Verhouding (ruw) |
|---|---|---|---|---|---|
| Proloog | ~5.700 | 1 | 0 | 0 | vrijwel zuiver passief |
| H1 | ~45.000 | 9 | 10 | 0 | passief, met veel gate-momenten |
| H2 | ~37.600 | 12 | 11 | 2 | het meest actieve hoofdstuk |
| H3 | ~37.000 | 9 | 9 | 6 | actief, veel gevechten |
| H4 | ~28.100 | 5 | 6 | 1 | overwegend passief |
| H5 | ~29.700 | 5 | 12 | 2 | passief verhaal, actieve gates |
| H6 | ~26.300 | 6 | 11 | 1 | gebalanceerd |
| H7 | ~20.000 | 6 | 2 | 0 | **vrijwel zuiver passief** |
| H8 | ~28.000 | 10 | 4 | 2 | gebalanceerd |
| H9 | ~29.000 | 8 | 3 | 1 | overwegend passief |

**Bevinding:** er is een reële, bestaande passieve laag — de verteltekst zelf, die de speler
áltijd leest, ook buiten puzzels om. Dat is precies wat "passief zonder gloss" in de opdracht
bedoelt, en het bestaat al in de vorm van goed geschreven Nederlandse narratie. Wat ontbreekt is
een **vreemdtalige** passieve laag daarbovenop (Griekse/Latijnse NPC-zinnen tussen de Nederlandse
tekst) — zie §5 voor het voorstel. Hoofdstuk 7 springt eruit als het minst actieve hoofdstuk (2
STAT-gates op 20.000 tekens tekst), wat aansluit bij fase 2's bevinding dat het ook het minst
reactieve hoofdstuk is.

---

## 4. Is het leuk, of voelt het als een toets?

**Op zijn best (sfeer en beloning):** de puzzels die direct in de verteltekst landen, zonder
scèneovergang. `CH1_A06`: *"Precies zoals in de zin die je net ontrafelde raakt Rex — de koning —
aurum aan: het goud... flavum buigt mee met aurum, allebei in de accusativus."* De grammatica
wordt hier letterlijk in dezelfde zin verteld als het verhaal zelf gebeurt — geen "even een vraag
tussendoor", maar taal die het verhaal ís. Dit gebeurt consistent bij elke naamval-puzzel-oplossing
door het hele spel heen (vergelijkbare constructies in `CH1_B05`, `CH1_C08`, enz.) en is het
sterkste didactische ontwerpprincipe dat het spel al toepast.

**Op zijn minst (toets die het verhaal onderbreekt):** de Combat-bridge. Het scherm springt naar
`SCREENS.spCombat` — een aparte kop ("Gevecht"), een HP-balk, een letterlijke meerkeuzevraag
"Wat betekent *woord*?" met vier losstaande knoppen, zonder enige narratieve inbedding van de
vraag zelf. Vergeleken met de vloeiende puzzel-in-verhaal-aanpak hierboven is dit een cognitieve
knip: eerst lees je een meeslepend gevecht met Herakles tegen de Hydra, dan verschijnt er een
schoolse vocabulairetoets, dan ga je terug naar het verhaal. Zie ook fase 8 voor de bredere
immersie-implicaties van dit scherm (systeemtaal als "Gevecht"/"levenspunten"/"EP").

---

## 5. Voorstellen voor de passieve laag

### 5a. Opbouw in moeilijkheid

Gekoppeld aan de al bestaande grammaticale opbouw uit §1:

| Fase | Hoofdstukken | Niveau van de NPC-zinnen |
|---|---|---|
| 1 | Proloog - H1 | Losse formules, groeten, eigennamen: *"Salve"*, *"Ave, rex"*, *"χαῖρε"* |
| 2 | H2 - H4 | Korte hoofdzinnen met het al geleerde praesens/naamvalsysteem: *"Deus te videt"* |
| 3 | H5 - H7 | Langere zinnen die de herhalingshoofdstukken benutten — dit vult meteen het in §1
  gesignaleerde grammaticale stilstandsgat op met een taalkúndige (niet verhalende) uitdaging |
| 4 | H8 - H9 | Zinnen met participia/bijzinnen, aansluitend op de nieuwe A.C.I./congruentie-stof |

### 5b. Leesvallen

Het spel heeft er al één, per ongeluk goed: `CH4_T06B` (fase 1/2/4), waar de speler een
labyrint-splitsing verkeerd om kan nemen als hij niet goed leest. Voorstel: pas hetzelfde
principe toe op taalniveau. Voorbeelden van een echte leesval:
- Een naamval die op het eerste gezicht een andere rol lijkt te spelen (een genitivus die er als
  een nominativus uitziet in woordvolgorde, met een zin die pas bij nauwkeurig lezen de juiste
  betekenis oplevert).
- Een woord dat op een Nederlands woord lijkt maar iets anders betekent (**vals verwant** —
  bijvoorbeeld Latijn *arma* dat niet "arm" betekent).
- Een ontkenning die makkelijk over het hoofd wordt gezien (*nemo*, *nihil*) in een verder
  gunstig klinkende zin.

Net als bij `CH4_T06B`: wie goed leest, doorziet het; wie gokt, kiest verkeerd — en dat leidt tot
een **ander verhaal**, geen strafscherm (zie ook fase 4 §4.2, fase 9).

### 5c. Glosbeleid

Op basis van het onderzoek in §0 (in-tekstglossen verlagen cognitieve belasting sterker dan
marginale glossen): geen woordenlijst in de kantlijn, maar een **optioneel, aanklikbaar
in-tekstwoord** (bijvoorbeeld onderstreept, tikken toont de vertaling inline) — beschikbaar op
aanvraag, niet standaard zichtbaar. Dat is ook direct in lijn met de bestaande stijl van het spel:
niets wordt opgedrongen, de speler kiest zelf wanneer hij hulp wil.

### 5d. Herhaling met spreiding

Formaliseer wat `spCombatNextQuestion()` al per ongeluk doet (§2b): een vast schema waarin een
kernwoord/kernconstructie na 2, 5 en 10 hoofdstukken terugkeert — niet alleen in Combat-bridges,
maar ook als korte NPC-zin in de nieuwe passieve laag. Het `SP_STATE.vocab`-array bestaat al en
onthoudt precies wanneer een woord voor het eerst is geleerd; er is geen nieuw mechanisme nodig,
alleen een schema om het gericht te gebruiken in plaats van willekeurig.

### 5e. Karakteristieke taal per NPC

Vaste personages krijgen een eigen formule die telkens terugkeert (bijvoorbeeld Athena die altijd
met dezelfde Griekse aanhef spreekt, de Boodschapper met een vast Latijns afscheidswoord). Dit
kost niets extra's aan mechaniek — het is een schrijfrichtlijn — en het laat herkenning van de
persoon en herkenning van de taal samenvallen, precies zoals de opdracht vraagt.

---

## 6. Eén taal versus twee: het instelbare spoor

**Voorstel van de gebruiker, geverifieerd tegen de bestaande campagnedata:** beide talen tot en
met de onderbouw (rond Pallas les 14 / Minerva hoofdstuk 13), daarna een keuze.

**Wat de data zelf al laat zien:** `SP_CAMPAIGN` bevestigt dit patroon *zonder dat het ooit als
zodanig is uitgesproken*. Hoofdstuk 12 ("Odysseus' Wraak") heeft in de bestaande metadata
`minerva: "—"` (geen Latijnse koppeling meer — puur Odysseus/Grieks), en Hoofdstuk 13 ("Het Begin
van Rome") heeft `pallas: "—"` (geen Griekse koppeling meer — puur Aeneas/Latijn). Dat is het
punt waarop de twee taalsporen in de eigen ontwerpdata van het spel al uit elkaar lopen, ruim
voordat er ooit over een instelbaar taalspoor is nagedacht. Concreet: Pallas les 12-14 (de val van
Troje) valt binnen het al gebouwde Hoofdstuk 9, en de eerste harde knip in de data zit bij
Hoofdstuk 12/13 — de campagnedata bevestigt dus het voorgestelde omslagpunt "na de Trojaanse
Oorlog", eerder nog iets later (na de Odyssee, bij het begin van de Aeneis) dan ervoor.

**Voorstel:** implementeer het instelbare spoor (Latijn/Grieks/beide) vanaf Hoofdstuk 10, niet
eerder. Tot en met Hoofdstuk 9 (het bestaande, gespeelde materiaal) blijven beide talen zoals nu
gecombineerd — dat vraagt geen enkele wijziging aan bestaande content. Vanaf Hoofdstuk 10 kiest de
speler (of de docent, per klascode) een spoor; het verhaal blijft identiek, alleen de puzzels, de
Combat-bridge-vocabulairepool (met de taalfilter uit §2b) en de nieuwe passieve laag (§5) volgen
het gekozen spoor.

**Kosten:** geen wijziging aan Hoofdstuk 1-9. Voor Hoofdstuk 10+: een spoorkeuze in het
saveslot-object (`SP_STATE.taalspoor`, analoog aan `gender`), en de taalfilter in
`spCombatNextQuestion()` die sowieso al voorgesteld wordt in §2b.

---

## 7. Taalmatrix

| Hoofdstuk | Nieuwe constructies | Nieuwe woorden (Lat/Gr) | Terugkeermomenten (Combat-bridges met oudere stof) |
|---|---|---|---|
| Proloog | Grieks alfabet, taalbewustzijn | 3 / 0* | — |
| H1 | Znw./bnw. groep 1-2, lidwoord, nom., acc., voc. | 6 / 3 | — (geen Combat dit hoofdstuk) |
| H2 | Praesens, werkwoordstammen, imperativus, *esse*, *posse* | 17 / 0 | 2 (Leeuw, Hydra — vocab uit H1) |
| H3 | Genitivus, dativus, bijstelling | 10 / 0 | 6 (herhaalt H1+H2-vocab) |
| H4 | Infinitivus, vocativus (herh.), imperfectum, perfectum, ablativus | 16 / 0 | 1 |
| H5 | — (herhaling nom.-abl.) | 9 / 1 | 2 |
| H6 | — (herhaling praes.-perf.) | 6 / 1 | 1 |
| H7 | — (cumulatieve herhaling) | 0 / 0 | 0 (geen Combat dit hoofdstuk) |
| H8 | Aoristus (Gr.); 3e declinatie + voornaamwoorden (Lat.) | 0 / 0 | 2 |
| H9 | Comparativus/superlativus, A.C.I., 3e-declinatie i-stam, congruentie | 0 / 0 | 1 |

\* De proloog-puzzel is een Grieks-transliteratiepuzzel zonder eigen `VOCAB:`-hook.

**Wat een docent hieruit direct kan aflezen:** de vocabulaire-instroom stopt na Hoofdstuk 6
(zie §2a) terwijl de grammaticale zwaarte in H8/H9 juist toeneemt — een klas die dit spel als
aanvulling gebruikt, kan tot en met Hoofdstuk 6 op nieuwe woordenschat rekenen, maar moet die
laatste twee hoofdstukken zelf van vocabulaire voorzien als dat doel is.
