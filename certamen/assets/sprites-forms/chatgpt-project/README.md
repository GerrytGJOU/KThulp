# ChatGPT-project "Castra Heroum sprites" (opzet)

Doel: de vaste regels één keer in een ChatGPT-project zetten, zodat je per blad alleen nog `A rom_faber` of `B rom_faber` typt, zonder elke keer de lange prompt te plakken en op te schonen.

**Let op: onbeproefd.** Ik kan ChatGPT niet bedienen, dus doe eerst de pilot hieronder voordat je alles hierop zet.

## Wat erin hoort

| Onderdeel | Waar |
|---|---|
| Instructies (in het veld "Instructions") | `INSTRUCTIES.md`, het codeblok |
| Projectbestand 1 | `REGELS.md` (vaste regels en de twee sjablonen) |
| Projectbestand 2 | `VORMEN_ROM_OPEN.md` (14 Romeinse vormen met uitrusting, poses en bijlagen) |
| Referentieplaatjes | `rom_anker.png`, `rom_tiro_A.png`, `rom_tiro_B.png`, `rom_funditor_A.jpg`, `rom_veles_A.jpg` |

Alles staat klaar in één map om te slepen: `_sprites-bron/project-upload/` (lokaal, niet in git).

## Opzetten

1. ChatGPT, zijbalk, **Projects**, **Nieuw project**, naam bijvoorbeeld "Castra Heroum sprites".
2. Plak het codeblok uit `INSTRUCTIES.md` in het veld met projectinstructies. Is het veld te klein, zet dan alleen de eerste alinea erin en laat de rest uit `REGELS.md` komen.
3. Voeg de bestanden uit `_sprites-bron/project-upload/` toe als projectbestanden.
4. Open binnen het project een **nieuw gesprek per blad**, bijvoorbeeld "Faber A".

## Gebruik per blad

1. Nieuw gesprek in het project.
2. Voeg de bijlagen toe die bij de vorm staan (bijvoorbeeld voor `A rom_faber`: `rom_anker.png` en `rom_tiro_A.png`). Voeg ze ook in het gesprek zelf toe: projectbestanden worden niet altijd als beeldreferentie voor een nieuwe afbeelding gebruikt.
3. Typ `A rom_faber` (of `B rom_faber`).
4. Bij een fout in het resultaat: zeg het in hetzelfde gesprek ("de schildvorm wisselt in cel 4, houd het rechthoekig") in plaats van opnieuw te beginnen.
5. Sla het resultaat op in `_sprites-bron/` met de bestandsnaam uit de vormregel.

Een nieuw gesprek per blad blijft verstandig: zo glijdt de stijl niet weg, en je hoeft de regels niet te plakken omdat het project ze al kent.

## Pilot (doe dit eerst)

Maak Faber A twee keer met een nieuw gesprek en vergelijk:

- **a)** buiten het project, met de volledige prompt uit `prompts/rom.md`;
- **b)** in het project, met `A rom_faber` en dezelfde twee bijlagen.

Is (b) minstens zo goed (marges, geen tekst, hetzelfde schild in alle cellen), gebruik dan het project. Is (b) slechter, omdat ChatGPT de regels uit de bestanden korter samenvat dan de volledige prompt, blijf dan de volledige prompts uit rom.md gebruiken. Die staan er nog en werken los van het project.

## Onderhoud

- Is een vorm klaar, dan haal ik hem uit `VORMEN_ROM_OPEN.md` en moet je dat bestand opnieuw uploaden.
- Voor een nieuw volk (Grieken, enzovoort) maak ik een eigen catalogusbestand en een eigen anker; de regels in `REGELS.md` blijven gelijk.
- Wijzig je een regel in `REGELS.md`, werk dan ook `prompts/rom.md` en `PROMPT_GENERATOR.md` bij, anders lopen ze uiteen.
