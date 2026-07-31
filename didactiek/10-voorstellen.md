# Fase 10 — Verbetervoorstellen

Geen enkele wijziging is doorgevoerd in de code — dit zijn voorstellen,
gesorteerd op impact/werk. "Impact" en "werk" zijn schattingen (1-5), niet
gemeten; ze zijn bedoeld om een prioriteitsvolgorde te onderbouwen, niet als
harde getallen.

## Geprioriteerde lijst

**Voorstel #1 ingetrokken (2026-07-29, na overleg met Gerben)**: het
taalspoor-filter is met opzet pas actief vanaf Hoofdstuk 10 — de onderbouw
(H1-9) is bewust tweetalig (leerlingen volgen dan zowel Latijn als Grieks),
pas in de bovenbouw wordt gekozen, en "beide" blijft daarna een geldige
optie. Zie de correctie bovenaan `08-taalspoor.md`. De tabel hieronder is
bijgewerkt; nummering van de overige voorstellen is ongewijzigd gelaten
zodat verwijzingen elders blijven kloppen.

| # | Wat | Waar | Model | Wat de speler ervaart | Verwacht meetbaar effect | Impact | Werk | I/W |
|---|---|---|---|---|---|---:|---:|---:|
| 2 | ✅ **VOLTOOID (2026-07-29)** — Laat `VOCAB:`-hooks weer doorgroeien in H7-H9 (8-12 nieuwe woorden per hoofdstuk, zelfde patroon als H1-H6) | H7, H8, H9 | Fase 2 §4, Fase 5 §4 — sheltered vocabulary/structurele herhaling | Codex Memoriae groeit weer mee; Combat-bridge krijgt weer nieuwe stof | Nieuwe-woorden-per-hoofdstuk-cijfer (Fase 9 streefwaarde) gaat van 0 naar 7/9/5 | 5 | 2 | 2,5 |
| 3 | ✅ **VOLTOOID (2026-07-29)** — Hints weggelaten bij herhaalde grammatica, gebaseerd op `SP_CAMPAIGN.grammatica` (niet arbitrair) | H5, H6, H7 | Fase 5 §2 — geleidelijke overdracht | Bij een fout antwoord op herhaalde stof: generieke terugvaltekst i.p.v. volledige uitleg | 14 van 17 puzzels in H5-H7 (de drie hoofdstukken die `SP_CAMPAIGN` zelf "geen nieuwe grammatica" noemt) verloren hun hint | 3 | 2 | 1,5 |
| 4 | ✅ **VOLTOOID (2026-07-29)** — 6 Laag-2-gloss-fragmenten kregen een "na"-echo via de bestaande `SP_PAYOFFS`-engine (geen nieuwe scènes nodig) | CH2_S08, CH4_T14, CH5_027, CH7_009, CH8_EPI_008, CH9_TRO_011 | Fase 4 §5 — leessandwich, "na"-laag | Later in dezelfde lijn herkent de speler de eerder gehoorde Latijnse/Griekse zin terug, met een korte duiding waarom die nu pas alles verklaart | 6 van de 7 niet-Sfinx-Laag-2-fragmenten hebben nu een "na" (was 0) | 3 | 2 | 1,5 |
| 5 | ✅ **VOLTOOID (2026-07-30)** — 3 woorden uit de leesval/passieve laag bewust laten terugkomen: "timeo" (CH7_017, vóór CH9_TRO_010), "Οὐδείς" (CH8_ACH_008, herhaalt CH3_H23), "Nondum venit" (CH8_AGA_010, herhaalt CH6_011B) | H7, H8 | Fase 2 §3, `00-kader.md` spaced retrieval | Een woord dat je al kende, kom je herkenbaar weer tegen | 3 van de 85 eenmalige woorden herhalen nu — eerste, bescheiden stap | 5 | 4 | 1,25 |
| 6 | ✅ **VOLTOOID (2026-07-30)** — Docentscherm "Chronica-taalstatistieken" gebouwd, hergebruikt het Battle Mode-precedent (`classAnalytics` → `classAnalyticsChronica`) | `SCREENS.teacherClass` (games.js) | Fase 8 §3, Fase 9 §2 | Docent ziet welke leesval/puzzel de klas moeilijk vindt, per klas/maand | Fase 9's streefwaarden nu zichtbaar zonder handmatige audit — **let op: nog niet in browser getest met echte klascode-login, zie Chronica.md §7.31** | 4 | 5 | 0,8 |
| 7 | ✅ **VOLTOOID (2026-07-30)** — 3 constructies uit `SP_PUZZLES` letterlijk laten terugkomen in de verhaaltekst: "Abi!" (CH8_001), "Fuge!" (CH9_TRO_013), "Νικῶ" (CH8_EPI_008) | H8, H9 | Fase 3 §3/§5 — verbind actief en passief systeem | Een net geleerde vorm duikt "in het echie" op | 3 constructies die eerst alleen in `SP_PUZZLES` bestonden, komen nu ook in de verhaaltekst voor | 4 | 4 | 1,0 |
| 8 | ✅ **VOLTOOID (2026-07-30)** — derde afleider toegevoegd aan LV-10 (Thetis) en LV-12 (Laocoön), elk een taalkundige val die mythekennis niet wegneemt | CH8_EPI_003, CH9_TRO_010 | Fase 7 §3a | Iets moeilijker om op reputatie/cultuurkennis te gokken | 2 van de 6 "mythe-gokbare" leesvallen verstevigd | 2 | 2 | 1,0 |
| 9 | ✅ **VOLTOOID (2026-07-30), met correctie** — "Aiax-lijn" bleek niet te bestaan als aparte tak (H8 splitst in Achilles/Agamemnon, `FLAG ch8_zijde`; Ajax is een personage binnen de Achilles-lijn); bij nader onderzoek bleken de bestaande 2 leesvallen (CH8_EPI_003/009) allebei in de GEDEELDE epiloog te zitten, dus geen van beide takken had een eigen leesval. Nieuwe leesval toegevoegd op de Agamemnon-lijn (CH8_AGA_003B) | CH8_AGA_003/004 | Fase 7 §3b | Evenwichtiger taalaanbod — de Agamemnon-lijn krijgt nu een eigen taalmoment | Agamemnon-lijn: 0 → 1 branch-exclusieve leesval | 2 | 2 | 1,0 |
| 10 | ✅ **VOLTOOID (2026-07-29)** — `SP_CODEX_ENTRIES` grammatica-tabellen aangevuld voor H8/H9 (H5-H7 bewust overgeslagen — `SP_CAMPAIGN` noemt die expliciet "geen nieuwe grammatica", dus geen nieuwe tabel nodig) | H8, H9 | Fase 3, Fase 5 §4 | Codex-tabblad heeft nu ook naslagtabellen voor aoristus/3e-declinatie/voornaamwoorden (H8) en comparativus/A.C.I./i-stammen/congruentie (H9) | Grammatica-codex-entries: 0 → 4+1(overzicht) per hoofdstuk voor H8 en H9 | 2 | 2 | 1,0 |
| 11 | ❌ **INGETROKKEN (2026-07-29, op verzoek van Gerben)** — voorgesproken audio voor Latijn/Grieks is niet haalbaar en niet relevant voor dit project. Fase 6 §5 blijft staan als bevinding (uitspraak/klank ontbreekt), maar zonder vervolgvoorstel. | — | — | — | — | — | — | — |
| 12 | ❌ **INGETROKKEN (2026-07-30, op verzoek van Gerben)** — geen docent-instelbaar niveauplafond nodig. (1) Hint-fading zoals gebouwd (#3) is prima voor elke klas — leerlingen spelen mogelijk met hun schrift ernaast. (2) Het taalspoor is bewust pas vanaf Hoofdstuk 10 gesplitst (zie `08-taalspoor.md`); tot dan volgt elke leerling toch al beide talen, dus geen "ik ken deze taal niet"-vangnet nodig. | — | — | — | — | — | — | — |

**Update (2026-07-29)**: voorstel #2 bleek nog goedkoper dan geschat — alle 21
benodigde woorden bestonden al als ongebruikte `SP_VOCAB_ENTRIES` (nooit een
`VOCAB:`-hook gekregen), precies passend bij wat `SP_PUZZLES` in H7-H9 al
gebruikt. Er waren dus geen nieuwe woorden te verzinnen, alleen de hook
toe te voegen aan `CH7_000`/`CH8_000`/`CH9_005`. Hoofdstuk 10 blijft bewust
zonder nieuwe VOCAB-entries zolang dat hoofdstuk een skelet is.

**Tweede update, zelfde dag**: op Gerbens verzoek de ingebouwde
frequentielijst (`VOCAB_LA`/`VOCAB_EL`) daadwerkelijk gebruikt om de
woordkeuze te toetsen — zie het bijgewerkte `02-woordenschat.md` §6. Nog
eens 8 "gratis" woorden gevonden (al in `SP_PUZZLES` aanwezig, nooit
gehookt) en toegevoegd: `liberi` (H6), `πέμπω/φεύγω/λύω/βάλλω` (H8),
`fortis/discedere/maestus` (H9). Totaal 101 woorden, 87 Latijn/14 Grieks (was 93, 83/10).

**Derde update, zelfde dag, na goedkeuring**: Hoofdstuk 7 kreeg 4 nieuwe
Latijnse woorden; Gerbens naamgevingsregel (Griekse naam → Grieks-verteld)
toegepast op de code bracht aan het licht dat Hoofdstuk 5 óók Grieks-verteld
is (net als Hoofdstuk 3) en dat Hoofdstuk 2 2-om-2 gemengd is (L/Latona,
S/Semele = Latijn; K/Kallisto, H/Herakles = Grieks) — met alle bestaande
vocab op de Latijnse helft. Aangevuld: 5 Griekse woorden in H2 (de
Griekse lijnen), 5 in H3, 5 in H5, allemaal frequentie-getoetst.
**Eindstand: 120 woorden, 91 Latijn/29 Grieks** (10,8% → 24,2% Grieks).
Volledig verslag: `Chronica.md` §7.26.

**Advies**: ga nu verder met #3 (samen 3 werk-eenheden, 2 van de grootste
structurele hiaten uit de hele audit) voordat je aan de duurdere,
hoger-impact-maar-duurdere items (#5, #6) begint.

---

## Drie uitgewerkte voorbeeldscènes

Onderstaande scènes zijn **illustratief**, geschreven in de bestaande
CNS-notatie zodat je meteen ziet hoe het zou aanvoelen — geen van deze IDs
bestaat nu in `singleplayer-data.js`; ze zouden bij implementatie op een
logische plek worden ingevoegd (aangegeven per voorbeeld).

### Voorbeeld 1 — pure passieve input (geen keuze, betekenis via context + herhaling)

Uitbreiding van de bestaande Athena-"Χαῖρε" (nu maar 1 voorkomen, zie Fase 1/4)
naar drie voorkomens verspreid over Hoofdstuk 3, zodat het woord net als
"Ecce" een echt herhalingspatroon krijgt. Geen van de drie momenten heeft een
keuze die aan het woord hangt — de speler hoeft niets, de betekenis (een
groet) wordt puur door herhaling + context duidelijk.

```
=== SCENE: CH3_H03B ===
TEXT:
Athena kruist je pad bij de bron waar Herakles zich even wast na de
Nemeïsche leeuw. Ze knikt kort, meer een erkenning dan een gesprek:
"Χαῖρε." Dan is ze weer verdwenen tussen de bomen.
CHOICES:
* Ga verder naar het volgende deel van de queeste -> CH3_H04
END

=== SCENE: CH3_H18B ===
TEXT:
Bij de tuin van de Hesperiden zie je haar weer, deze keer met Atlas'
last nog vers in je geheugen. Ze buigt lichtjes het hoofd: "Χαῖρε," zegt
ze, en voegt er nu, voor het eerst, iets aan toe in het Nederlands — "je
doet het goed."
CHOICES:
* Bedank haar en ga verder -> CH3_H19
END
```

(Het derde, al bestaande voorkomen is `CH3_IO14`.) Na drie keer heeft de
speler "Χαῖρε" in drie totaal verschillende, maar steeds herkenbare situaties
gezien (aankomst, waardering, afscheid) — precies het "incidentele
woordverwerving door herhaalde ontmoeting in betekenisvolle context"-principe
uit `00-kader.md` §1, zonder dat er ooit een vraag over wordt gesteld.

### Voorbeeld 2 — volledige leessandwich, gevolg vervangt de controlevraag

Nieuwe scène in het Hoofdstuk-10-skelet (Odysseus-lijn, tussen de Kikonen
en de aankomst bij de Kykloop — een goede plek, want de Lotoseters-episode
gaat letterlijk over "vergeten door iets te proeven/begrijpen", een thema
dat zich uitstekend leent voor een taalkeuze met een echt gevolg in plaats
van een simpel goed/fout).

```
=== SCENE: CH10_ODY_003B ===
TITLE:
De Lotoseters

TEXT:
Op het strand van de Lotoseters komt een van je mannen terug met een tak
vol vreemde, honingzoete vruchten. Een van de eilandbewoners, glimlachend,
zegt je iets voor je hem tegenhoudt: "Εἰ τοῦτο φάγῃς, οὐκέτι μνησθήσῃ." Je
man kijkt je aan, de tak nog in zijn hand.

CHOICES:
* Hoor er een voorwaarde in — "als je dit eet, zul je je niet meer herinneren" — en sla de tak uit zijn hand -> CH10_ODY_003_GOED
* Hoor er twee aparte uitspraken in — "je eet dit niet meer; je herinnert het je" — en laat hem proeven, gerustgesteld -> CH10_ODY_003_FOUT
END

=== SCENE: CH10_ODY_003_GOED ===
TEXT:
Je grijpt zijn pols net op tijd. Hij protesteert, maar een uur later, terug
aan boord, is hij je dankbaar — en jij weet nu waarom de eilandbewoners zo
weinig haast leken te hebben. De reis naar huis blijft, voor hem, een doel
dat hij zich nog herinnert.
CHOICES:
* Vaar verder, waakzamer dan daarvoor -> CH10_ODY_004
END

=== SCENE: CH10_ODY_003_FOUT ===
TEXT:
Je knikt geruststellend en laat hem eten. Tegen de avond moet je hem
letterlijk terugslepen naar het schip — hij weet niet meer waarom hij ooit
weg wilde van dit eiland, en twee anderen die ook geproefd hebben, moet je
vastbinden tot het over is. Geen van drieën spreekt nog over "naar huis"
zonder een lege blik.
CHOICES:
* Vaar verder, met drie mannen die het je nog dagenlang kwalijk lijken te nemen -> CH10_ODY_004
END
```

Waarom dit de leessandwich compleet maakt: **vóór** — de scène bouwt een
concrete keuze op (grijp je in of niet) vlak vóórdat de zin valt, niet erna;
**tijdens** — de speler interpreteert een echte voorwaardelijke constructie
(εἰ + conjunctief, een niet eerder in een leesval gebruikte constructie, dus
nieuw materiaal — zie Fase 3 se unsheltered-grammar-punt); **na** — het
gevolg is geen simpel "goed"/"fout"-label maar een echt (kleine) verschil in
hoe de rest van het fragment aanvoelt (een dankbare vs. een geïrriteerde
bemanning) — precies "het verhaal verandert" i.p.v. een controlevraag, en
beide paden reconvergeren netjes naar `CH10_ODY_004` (geen strafscherm, zelfde
principe als de bestaande leesvallen).

### Voorbeeld 3 — geleidelijke overdracht (zelfde constructie, nu zonder de hulp van eerder)

`CH8_EPI_009` (bestaand, Fase 1/7) is een prohibitief (μή + imperativus,
"μὴ ἔξελθε") maar de scène *verklapt de betekenis al* door de context
("een wachter grijpt hem bij de arm en schreeuwt" — zie Fase 7 §1, Groep B).
Een latere scène met dezelfde constructie, maar zonder die verklappende
enscenering, laat zien dat de speler de vorm nu ook zelfstandig herkent —
het narratieve en didactische "de mentor doet het niet meer voor"-moment
ineen. Plek: Hoofdstuk 10, Aeneas-lijn (Latijnse tegenhanger zou ook kunnen,
maar de Griekse vorm hertoetsen is hier bewust, want H8's versie was Grieks).

```
=== SCENE: CH10_ODY_002B ===
TITLE:
Een Stem in de Nacht bij de Kikonen

TEXT:
Je manschappen plunderen de kust van de Kikonen sneller dan je lief is.
Een oude vrouw, half verscholen bij de tempeldeur, zegt niets meer dan dit
tegen niemand in het bijzonder — geen dreiging in haar stem, eerder
vermoeidheid: "μὴ μένε." Ze draait zich om en verdwijnt naar binnen.

CHOICES:
* Begrijp het als een waarschuwing om niet te blijven — geef het bevel om terug naar de schepen te gaan -> CH10_ODY_002_GOED
* Begrijp het als een simpele constatering dat zij niet blijft, en negeer het -> CH10_ODY_002_FOUT
END
```

Het verschil met `CH8_EPI_009` is precies wat Goed Gelezen! vraagt: geen
fysieke actie die het antwoord al weggeeft, geen wachter die "schreeuwt" —
alleen de kale zin en een neutrale enscenering. Als de speler hem nu, zonder
scaffolding, goed leest (dezelfde μή-prohibitief die hij in Hoofdstuk 8 met
hulp leerde herkennen), is dat de aantoonbare, narratief ingebedde vorm van
"ik kan dit nu zelf" — het exacte boogje dat Fase 5 §2 als ontbrekend
signaleerde.
