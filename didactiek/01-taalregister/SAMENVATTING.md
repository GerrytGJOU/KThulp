# Fase 1 — Talige inventarisatie: samenvatting

Bron: live code (`certamen/singleplayer-data.js`, `certamen/vocab.js`), geëxtraheerd
en geteld met een script op 2026-07-29. Machineleesbaar register:
[`register.json`](register.json). Gedekt: Proloog t/m Hoofdstuk 10 (Hoofdstuk 10
is een bewust onvolledig skelet — zie onder).

## Wat "Latijnse/Griekse taal in het spel" concreet is

Het spel heeft **twee soorten ongeglosde/ongefilterde taalblootstelling in de
verhaaltekst zelf**, plus twee soorten taal die apart getoetst wordt (puzzels,
Codex). Voor de leessandwich/onderdompeling-vraag (Fase 4/6) tellen vooral de
eerste twee:

1. **Passieve taallaag** (B23, `Chronica.md` §7.16) — een NPC zegt/schrijft iets
   in het Latijn of Grieks, optioneel met `[[brontekst|vertaling]]`-gloss.
   **26 fragmenten**, Proloog–Hoofdstuk 10.
2. **Leesvallen** (B21/B29, §7.17/§7.23) — een ongeglosde Latijnse/Griekse zin
   met een verborgen leesvalkuil; twee niet-gelabelde keuzes (correcte lezing
   vs. plausibele misreading). **13 fragmenten**, Hoofdstuk 2–9.
3. **Puzzelvragen** (`SP_PUZZLES`, 71 entries) — Latijn/Grieks als toetsmateriaal
   in een multiple-choice-vraag (bv. "Rex aurum tangit — welk woord is de
   accusativus?"). Dit is *expliciete grammaticatoetsing*, geen onderdompeling;
   apart geteld, niet in de leessandwich-analyse van Fase 4.
4. **Codex/VOCAB** (`SP_VOCAB_ENTRIES`, 93 entries; `SP_CODEX_ENTRIES`, 107
   entries) — het spel z'n eigen curriculum: expliciet aangeboden lemma +
   Nederlandse betekenis, buiten de verhaaltekst (naslag, geen leesmoment).

## Harde cijfers

| Hoofdstuk | Scènes | Leesvallen | Gloss-fragmenten | VOCAB-hooks (nieuwe woorden getoond) |
|---|---:|---:|---:|---:|
| Proloog | 14 | 0 | 0 | 0 |
| H1 | 65 | 0 | 3 | 12 |
| H2 | 72 | 1 | 2 | 17 |
| H3 | 72 | 1 | 3 | 10 |
| H4 | 48 | 1 | 2 | 16 |
| H5 | 66 | 2 | 2 | 10 |
| H6 | 57 | 2 | 3 | 7 |
| H7 | 46 | 2 | 2 | **0** |
| H8 | 74 | 2 | 2 | **0** |
| H9 | 80 | 2 | 3 | **0** |
| H10 (skelet) | 13 | 0 | 4 | **0** |
| **Totaal** | 607 | **13** | **26** | **72** |

**Signalering, geen mening**: de `VOCAB:`-hook (het mechanisme dat een woord
toevoegt aan de Codex Memoriae van de speler) stopt hard na Hoofdstuk 6. Vanaf
Hoofdstuk 7 groeit de expliciete woordenschatpool van het spel niet meer,
terwijl er nog vier hoofdstukken (7–10) verhaaltekst bij komen. Zie
[`02-woordenschat.md`](../02-woordenschat.md) voor wat dat betekent voor dekking.

## Type/token-telling (alleen laag 1+2: passieve laag + leesvallen)

Geteld over de 39 fragmenten (26 gloss + 13 leesval), whitespace/leestekens-
tokenisatie, diacritics genormaliseerd voor Grieks:

- **Totaal aantal woordvormen (tokens): 99**
- **Aantal unieke woorden (types): 86**
- **Type-token-ratio: 0,87** — extreem hoog. Ter vergelijking: lopende,
  natuurlijke tekst zit doorgaans rond 0,4–0,5 TTR; een TTR die de 0,9 nadert
  betekent vrijwel geen enkel woord komt twee keer voor. Dat is precies wat
  hieronder blijkt.
- **Herhaling**: van de 86 unieke woorden komt er **exact één** (*ecce*, 14x)
  meer dan één keer voor. **De overige 85 woorden komen precies ÉÉN keer voor**
  in het hele gebouwde spel (Proloog–Hoofdstuk 10).
- **Latijn vs. Grieks** (laag 1+2, tokens): Latijn 52, Grieks 47 — redelijk in
  balans, al is dat vooral toeval van welke hoofdstukken Latijns- resp.
  Grieks-verteld zijn (zie `Chronica.md` §7.16 voor de lijn-per-hoofdstuk-
  toewijzing).

**Duiding (voorlopig, wordt in Fase 2 verder uitgewerkt):** met een narratief
dat draait om "narrow reading" (B.1: weinig woorden, vaak terugkerend) is een
TTR van 0,87 een rode vlag. 99 woordvormen verspreid over tien hoofdstukken
betekent gemiddeld ~10 woordvormen ongeglosde/leesval-Latijn-Grieks per
hoofdstuk — en op één woord na (*ecce*) wordt geen enkel woord ooit herhaald,
dus geen enkele kans op incidentele verwerving door herhaalde blootstelling
binnen deze laag. Dit is de kernbevinding waar Fase 2 op voortbouwt.

## Volledigheid en beperkingen van deze telling

- Namen van personages (Romeinse/Griekse eigennamen als "Bacchus", "Icarus")
  zijn NIET meegeteld als "Latijn/Grieks" — dat is een aparte, terechte
  ontwerpkeuze (`Chronica.md` §7.2.1) en geen taalverwervingsmoment.
- `SP_PUZZLES` (71 entries) en `SP_CODEX_ENTRIES` (107 entries) zijn wél
  geïnventariseerd (aantallen hierboven) maar NIET in de tokentelling
  meegenomen — dat is expliciete oefenstof/naslag, geen doorlopende tekst, en
  hoort in Fase 3 (grammaticale leerlijn) en Fase 5 (Goed Gelezen!) thuis, niet
  in een leessandwich/extensive-reading-telling.
- Dit is een telling van wat een speler ONVERTAALD ziet in de verhaaltekst.
  Het is dus een ondergrens van "taal in het spel", geen totaaltelling van
  het Nederlandstalige verhaal zelf (dat is vele malen groter, maar niet
  relevant voor Latijn/Grieks-verwerving).
