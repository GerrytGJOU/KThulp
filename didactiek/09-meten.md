# Fase 9 — Meten en bewijzen

## 0. Wat er al staat (niet opnieuw uitvinden)

`Chronica.md` §12.3-stap-3 documenteert een al **gebouwde** Kroniek-log
(`SP_STATE.kroniek`, gevuld door `spKroniekLog()`): klassekeuze,
STAT-gated keuzes, lijnkeuzes (`[DONE:...]`), skillpunt-investeringen, en
payoff-triggers. Dit is bewust NIET bedoeld als docentrapportage (het is een
speler-gerichte, verhalende log, "geschreven als annalen, niet als menu") en
bevat nul taalkundige data (geen gloss-taps, geen puzzelpogingen, geen
leesval-uitkomsten). Voor Fase 9 is dit dus een goed precedent voor *hoe* je
iets logt (declaratief, gegroepeerd, geen spreadsheet-gevoel), maar geen
vervanging voor wat hieronder wordt voorgesteld.

## 1. Wat zou het spel moeten loggen om leerwinst aannemelijk te maken?

| Gebeurtenis | Waarom relevant | Privacygevoeligheid |
|---|---|---|
| Gloss geopend/getapt (welke `[[..\|..]]`, hoe vaak, op welke scène) | Toont opzoekgedrag — cf. §0-kader (glossen lokken opzoekgedrag uit, ook als begripswinst niet gegarandeerd is) | Laag — geen persoonsgegevens, alleen woordid + timestamp |
| Tijd op een scène met TEXT/DIALOGUE (vóór een keuze) | Ruwe proxy voor leesinspanning; een scène die iedereen in 1 seconde wegklikt, wordt niet gelezen | Laag |
| Puzzelpoging: welk antwoord gekozen (juist of welke afleider), poging-nummer | Direct bewijs van welke misvatting (naamval/tijd/vorm) een leerling maakt — zie Fase 3/7 se foutopties-analyse | Laag, mits niet gekoppeld aan een naam (zie §privacy) |
| Leesval-uitkomst: GOED/FOUT-route gekozen | Directe leerwinst-indicator per leesval-type (zie Fase 7) | Laag |
| Woorden die herhaald fout gelezen worden (dezelfde afleider 2x+) | Signaleert een hardnekkige misvatting — precies waar een docent op zou willen interveniëren | Laag |
| `VOCAB:`-hook eerste keer getoond (al aanwezig als mechanisme, nu niet gelogd met timestamp) | Voedt de dekkingscijfers uit Fase 2 automatisch i.p.v. handmatig per audit | Laag |

**Wat NIET loggen**: individuele identificeerbare gegevens buiten de al
bestaande klascode/leerlingcode-structuur (zie `CLAUDE.md`'s Firebase-regels:
leerlingen loggen al nooit in via Firebase Auth, alleen via
klascode+leerlingcode als gedeeld toegangswoord). Elke nieuwe logging moet
onder hetzelfde principe vallen: **aggregeerbaar per klas, niet gericht op
individuele beoordeling van een leerling**. Een school mag procesdata
verzamelen (hoe vaak wordt een gloss gebruikt) zonder AVG-plichtigheid zolang
dit niet herleidbaar is tot een individuele, geïdentificeerde leerling buiten
de klascontext — dit is dezelfde grondhouding als de bestaande
`klascodes/{code}`-structuur in `certamen/database.rules.json` (per-docent
scheiding, geen naam-koppeling). **Concreet voorstel**: sla puzzelpogingen/
gloss-taps/leesval-uitkomsten op onder `identities/{klas}/{lid}/taalstats`
(dezelfde tak als de bestaande identity-structuur, dus geen nieuw
privacy-regime nodig) en aggregeer per klas in een docentscherm (§2) —
nooit een lijst "leerling X koos 3x fout" zonder klasgemiddelde ernaast.

## 2. Docentrapportage — een concreet scherm

Een nieuw tabblad in het bestaande docentenmodel (Battle Mode heeft al een
precedent voor docent-ingestelde numerieke drempels via klascode-sessie, zie
`Chronica.md` §12.1 — hergebruiken, niet opnieuw ontwerpen). Voorstel voor
de inhoud van het scherm, per klas:

```
┌─ Chronica Classica — Klasrapport: 4A ──────────────────────────┐
│ Hoofdstuk 6 (23 van 26 leerlingen hier al geweest)              │
│                                                                  │
│ Woordenschat                                                    │
│  ▸ Meest foutgelezen woord deze week: "nondum" (11× fout, 13× goed) │
│  ▸ Minst geopende gloss: "Νικῶ" (2× geopend van 23 leerlingen)  │
│                                                                  │
│ Leesvallen                                                      │
│  ▸ CH6_003B (ablativus comparationis): 14/23 goed gelezen        │
│  ▸ CH6_011B (nondum): 9/23 goed gelezen ⚠ laagste van dit hfst   │
│                                                                  │
│ Puzzels                                                         │
│  ▸ puzzle_ch6_perfectum: gem. 2,3 pogingen per leerling          │
│  ▸ puzzle_ch6_vocativus_grieks: 3 leerlingen nog niet gehaald    │
│                                                                  │
│ [Exporteer als CSV]  [Bekijk vorige hoofdstukken]               │
└──────────────────────────────────────────────────────────────────┘
```

Kernprincipe: **altijd geaggregeerd per klas/hoofdstuk, nooit een individuele
leerlingnaam gekoppeld aan een fout** in het standaardscherm — een docent die
wél op leerlingniveau wil kijken (bv. voor een rapportgesprek) kan
doorklikken naar een leerling-specifieke Kroniek (die al bestaat), maar het
taalstatistiekenscherm zelf is klasgericht, zodat het gebruikt wordt om
lesstof bij te sturen ("nondum leren we blijkbaar nog een keer"), niet om
leerlingen individueel te beoordelen.

## 3. Opzet voor een kleine klassikale toetsing

Een uitvoerbare opzet voor één docent, één klas, zonder onderzoeksapparaat:

1. **Voormeting** (10 minuten, papier of Forms): een lijst van 15-20 woorden
   die in het spel voorkomen (bv. de 17 `VOCAB:`-woorden van het hoofdstuk dat
   de klas gaat spelen) + 15-20 controlewoorden van vergelijkbare frequentie/
   moeilijkheid die NIET in het spel voorkomen (uit de reguliere methode of
   een frequentielijst). Leerlingen vertalen naar het Nederlands, "weet ik
   niet" is een geldig antwoord.
2. **Interventie**: de klas speelt het betreffende hoofdstuk (bv. één
   lesuur), zoals nu al gepland.
2b. **Controle binnen dezelfde klas** (geen aparte controlegroep nodig):
   omdat de voormeting al spel-woorden én controlewoorden bevat, is de klas
   zijn eigen controlegroep — vergelijk de vooruitgang op spel-woorden met de
   vooruitgang op controlewoorden bij dezelfde leerlingen.
3. **Nameting**, direct na de sessie (dezelfde 30-40 woorden, geschud).
4. **Nameting 2**, twee weken later (retentie i.p.v. alleen kortetermijneffect
   — belangrijk gezien de spaced-retrieval-bevindingen in `00-kader.md`).
5. **Analyse**: vergelijk de score-toename (nameting − voormeting) voor
   spel-woorden versus controlewoorden. Als spel-woorden een grotere toename
   laten zien dan controlewoorden, is dat een eerlijke, uitvoerbare aanwijzing
   dat het spel iets oplevert bovenop de methode — mét het besef dat één klas,
   één keer, geen hard bewijs is, alleen een eerste signaal.

**Wat dit niet is**: een gecontroleerd experiment met randomisatie — dat is
voor één docent niet haalbaar en ook niet nodig om een eerste, eerlijke
indicatie te krijgen.

## 4. Meetbare streefwaarden (op basis van Fase 1-8's bevindingen)

| Maat | Huidige waarde (Fase 1/2) | Voorgestelde streefwaarde |
|---|---:|---|
| % woorden herhaald (niet eenmalig) in passieve laag/leesvallen | 1% (1 van 86) | Minstens 30% van de woorden komt 2×+ voor binnen 3 hoofdstukken |
| Gem. herhalingsafstand (hoofdstukken tussen 1e en 2e voorkomen) | n.v.t. (bijna niets herhaalt) | Onder de 3 hoofdstukken, cf. spaced-retrieval-onderzoek (`00-kader.md`) |
| Aandeel fragmenten ≥95% dekking (extensive-reading-drempel) | 33% (13 van 39) | Minstens 60% voor de "sfeer"+"leerbare zin"-lagen (leesvallen mogen bewust lager blijven, zie Fase 7) |
| Nieuwe `VOCAB:`-woorden per hoofdstuk | 0 sinds H7 | Minstens 8-12 per hoofdstuk, doorlopend t/m het laatst gebouwde hoofdstuk |
| % leessandwich-momenten met score ≥4/6 | 33% (13 van 39, uitsluitend leesvallen) | Minstens 50%, door Laag 2 een "na" te geven (Fase 4 §5) |
| Hint-aanwezigheid per puzzel (Fase 5) | 100%, constant | Laat in latere hoofdstukken bewust een deel zonder hint (bv. 20% vanaf H5, oplopend) |
| Taalspoor-filter actief vanaf | Hoofdstuk 10 | Vanaf Hoofdstuk 1 (Fase 8) |
