# Fase 5 — Toetsing aan Goed Gelezen! (strategie, overdracht, differentiatie)

## 1. Is er een herkenbare, terugkerende aanpak om een onbekende zin te lijf te gaan?

**Nee, niet als expliciet gemodelleerde strategie.** Ik heb gezocht naar een
mentorfiguur die hardop een vaste ontleedstap voordoet (bv. "zoek eerst de
persoonsvorm, dan het onderwerp, dan..."), zoals Goed Gelezen! voorschrijft.
Wat wél bestaat:

- **Athena als narratieve mentor** (`Chronica.md` §7.6-7.7, vanaf `CH2_ATHENA`)
  — een verhalende mentorrol (bescherming, aanmoediging, eretitel
  `ch2_athena_mentor`), geen taalkundige rol. Ze modelleert geen leesstrategie.
- **Elke `SP_PUZZLES`-entry heeft een `hint`-veld** (70 van 71 entries) dat
  wél een taalkundige aanwijzing geeft (bv. "De accusativus ondergaat de
  handeling — wat wordt er aangeraakt?"). Dit is de facto de enige
  strategie-achtige steun in het spel, maar het is **per puzzel losstaand
  advies, geen consistent stappenplan** dat de speler zelf leert toepassen
  op een compleet nieuwe zin. De ene keer wijst de hint op naamval, de andere
  keer op werkwoordsvorm, weer een andere keer op vergelijkbare vormen elders
  — er zit geen vast "stap 1, stap 2, stap 3" achter, dus niets om als
  overdraagbare vaardigheid te internaliseren.

**Conclusie**: er is procedurele hulp per vraag, maar geen strategie in de zin
van Goed Gelezen! — een vaste, benoembare aanpak die de speler kan
onthouden en op een geheel nieuwe zin toepassen zonder hulp.

## 2. Is er geleidelijke overdracht (neemt hulp meetbaar af)?

**Gemeten, en het antwoord is nee — het tegenovergestelde gebeurt.**

| Hoofdstuk | Puzzels met hint | Gem. lengte hint (tekens) |
|---|---:|---:|
| H1 | 9/9 | 59 |
| H2 | 12/12 | 84 |
| H3 | 9/9 | 84 |
| H4 | 5/5 | 99 |
| H5 | 5/5 | 80 |
| H6 | 6/6 | 102 |
| H7 | 6/6 | 85 |
| H8 | 10/10 | 95 |
| H9 | 8/8 | 107 |

**100% van alle 70 puzzels (H1 t/m H9) heeft een hint** — er is geen enkele
puzzel waarbij de hulp is weggenomen. Sterker nog, de **gemiddelde
hintlengte groeit** van 59 tekens in H1 naar 95-107 tekens in H8/H9 — logisch
omdat de constructies complexer worden (aoristus, A.C.I.), maar het betekent
dat de *hoeveelheid* hulp evenredig meegroeit met de moeilijkheidsgraad in
plaats van geleidelijk te verdwijnen. Er bestaat, voor zover in de data
zichtbaar, geen enkel moment waarop de speler een variant van een eerder
geziene constructie zonder hint krijgt voorgelegd om te tonen dat hij het nu
zelf kan — precies het narratieve/didactische boogje dat Goed Gelezen!
vraagt ("in de eerste hoofdstukken doet de mentor het hardop voor, daarna
steeds minder").

**Update (2026-07-29) — gerepareerd, gebaseerd op `SP_CAMPAIGN.grammatica`**:
`SP_CAMPAIGN` (`certamen/singleplayer-data.js`, regel 174-410) legt per
hoofdstuk al vast welke grammatica NIEUW is en welke bewust pure herhaling
("geen nieuwe grammatica"): Hoofdstuk 5, 6 en 7 zijn expliciet zo
gelabeld. Op die exacte basis (niet arbitrair) is `puzzle.hint` verwijderd
bij 14 van de 17 puzzels in die drie hoofdstukken — alleen de
Sfinx-inhoudsaanwijzing en de twee matching-type procedure-hints bleven
staan (die leggen geen herhaalde grammaticaregel uit). Bij een fout antwoord
ziet de speler nu de generieke, per-puzzeltype-passende terugvaltekst
(`spCheckMCPuzzle` e.a., singleplayer.js) in plaats van de volledige
uitleg die hij bij de eerste keer (H1-H4) al kreeg. Volledig verslag:
`Chronica.md` §7.27. H8/H9 (opnieuw echt nieuwe grammatica, zie
`SP_CAMPAIGN`) behielden hun volledige hints — terecht, want daar geldt
juist weer "de mentor doet het voor".

Dit is de meest concrete, makkelijk te repareren bevinding van deze fase
(zie Fase 10, voorbeeldscène #3, voor hoe zo'n hint-loos herhalingsmoment
eruit zou kunnen zien).

## 3. Is er differentiatie (kan een zwakke lezer hetzelfde verhaal beleven)?

**Gedeeltelijk, en niet op taalniveau.** Het spel heeft wél
differentiatiemechanismen, maar die zitten op het niveau van
*verhaalkeuzes* (CLEMENTIA/SEVERITAS/NEUTRAL, `Chronica.md` §7.3) en
*klasse/stat-gated keuzes*, niet op het niveau van *taalbegrip*. Concreet:

- Een leerling die een `SP_PUZZLES`-vraag fout beantwoordt, komt (voor zover
  zichtbaar in de scène-structuur) niet in een makkelijkere variant terecht
  — het verhaal loopt door, de puzzel blijft staan zoals hij is, met dezelfde
  hint voor iedereen.
- De 13 leesvallen bieden geen "makkelijke modus" — elke speler ziet exact
  dezelfde, ongeglosde Latijnse/Griekse zin, ongeacht taalniveau. Dat is
  overigens **wél in lijn met Goed Gelezen!'s eigen differentiatie-ideaal**
  ("hetzelfde verhaal, geen aparte tekst") — het verhaal verandert inderdaad
  niet voor een zwakke lezer, alleen het leesvaltype (GOED/FOUT) bepaalt een
  kleurverschil in de sfeertekst, geen aparte moeilijkheidsgraad.
- Er is dus feitelijk al een vorm van differentiatie-zonder-verhaalverschil
  aanwezig in de leesvallen (iedereen doorloopt dezelfde scène, het verschil
  zit in interpretatie, niet in aparte content) — maar dat is toeval van het
  leesval-ontwerp, niet een bewust ingebouwd differentiatiesysteem voor
  taalbegrip.

**Conclusie**: op verhaalniveau bestaat differentiatie al (en werkt die
goed); op taalbegripniveau bestaat ze niet.

## 4. Wordt woordenschat structureel aangeboden en herhaald, of incidenteel?

Beide systemen bestaan naast elkaar, met een scherp verschil (bevestigt en
verscherpt Fase 2 §3-4):

- **Structureel**: `SP_VOCAB_ENTRIES` + `VOCAB:`-hook — expliciet toegevoegd
  aan de Codex Memoriae, gekoppeld aan puzzels die het woord binnen hetzelfde
  hoofdstuk vaker gebruiken (bv. *aperit* in zowel de Midas- als de
  Pandora-puzzel, H1). Dit werkt zoals bedoeld, **zolang het loopt** — en
  het stopt na H6 (zie Fase 2 §4).
- **Incidenteel**: de passieve laag/leesvallen — 99% eenmalig (Fase 2 §3),
  geen enkele structurele herhaling.

Met andere woorden: het spel heeft één systeem dat woordenschat *wél*
structureel en herhaald aanbiedt (en dat systeem werkt aantoonbaar, zie de
`aperit`-/Sfinx-voorbeelden), maar dat systeem bestrijkt nog maar 6 van de
(uiteindelijk gepland) 28 hoofdstukken, en raakt het verhaal-lezen zelf
nauwelijks (het zit in aparte puzzelvragen, niet in de doorlopende tekst).
