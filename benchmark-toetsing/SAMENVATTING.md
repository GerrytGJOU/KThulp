# Samenvatting — Benchmark-toetsing Certamen-modi

Volledige onderbouwing: [00-checklist-per-modus.md](00-checklist-per-modus.md), [01-risicos.md](01-risicos.md), [02-wat-overnemen.md](02-wat-overnemen.md), [03-prioritering.md](03-prioritering.md). Analysefase — geen code gewijzigd.

## Vergelijkende tabel

| | Kernmodus | Battle Mode | Boss Battle | Total War |
|---|:-:|:-:|:-:|:-:|
| 1. Gespreide herhaling | 0 | 1 | 1 | 0 |
| 2. Volgorde van feedback | 2 | 2 | 2 | 2 |
| 3. Low-stakes/anoniem | 1 | 1 | 1 | 1 |
| 4. Eigen keuze | 0 | 1 | 2 | 2 |
| 5. Nieuwsgierigheid/verhaal | 0 | 1 | 1 | 2 |
| 6. Tijdsdruk-alternatief | 2 | 0 | 0 | 2 |
| 7. Wisselende inhoud | 1 | 1 | 1 | 1 |
| **Totaal (van 14)** | **6** | **7** | **8** | **10** |
| a) Hanus & Fox | Aanwezig (vooral Snelvuur) | Deels opgevangen | Bewust gedempt | Sterk gedempt |
| b) Blooket-euvel | Effectief aanwezig (Snelvuur) | Afwezig | Afwezig | Afwezig (Training) |
| c) Kahoot-tempo | Vergelijkbaar effect (Snelvuur) | Matig aanwezig | Gedeeltelijk | Afwezig / aanwezig in Boss Battle-component |

## Top vijf verbetervoorstellen (impact/werk)

1. **Naaminvoer optioneel in de kernmodus**, auto-label uit avatar+kleur (`games.js:548-586`) — 3.0
2. **Klasse+avatar-badge i.p.v. verplichte naam** in Battle Mode/Boss Battle (`battle.js:1037-1069`) — 3.0
3. **Seizoensgebonden rotatie van de default-factie** in Battle Mode (`battle-data.js:171`) — 3.0
4. **Leerlingcode i.p.v. naam** in Total War's publieke seizoensrecords (`totalwar.js:679-699`) — 3.0
5. **Gewogen herhaling van fout beantwoorde woorden** in de kernmodus (`core.js:83-114`) — 2.5

Volledige lijst (18 voorstellen) met code-vindplaats, benchmarkbevinding en werk-schatting: [03-prioritering.md](03-prioritering.md).

## Sterkste en zwakste modus

**Total War (10/14)** is het sterkst: enige modus met een structureel tijdsdrukvrij hoofdmoment (Training Mode, thuis), de breedste leerlingautonomie, en een verhaallaag met echt mechanisch effect (rebellenscenario). Dat wordt overeind gehouden door bewuste balansmaatregelen tegen Hanus & Fox (klasgrootte-normalisatie, dagcap, harde scheiding Training-XP/Mastery) — zonder die maatregelen zou juist déze modus het scherpst tegen dat risico aanlopen.

**De kernmodus (6/14)** is het zwakst: de meest gespeelde, meest laagdrempelige modus van Certamen scoort een kale 0 op drie van de zeven punten (herhaling, keuze, verhaal) — niet uit gebrek aan ambitie, maar omdat de bewust minimalistische opzet van Touwtrekken/Marathon/Snelvuur de infrastructuur mist die de andere modi via hun grotere datamodel al hebben. Battle Mode (7/14) heeft een ander probleem: de rijkste spelmechaniek van de vier, maar als enige een harde 0 op tijdsdruk-alternatief en geen leerling-autonomie in opdrachttype — veel vrijheid in de strategische laag compenseert niet voor nul vrijheid in de vraag zelf.
