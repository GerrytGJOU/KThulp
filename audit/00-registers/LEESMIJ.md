# Fase 0 — Registers: leesbare samenvatting

> Machineleesbare bronbestanden in deze map: `scenes.json`/`.csv`, `keuzes.json`/`.csv`,
> `npcs.json`/`.csv`, `flags.json`/`.csv`, plus `_diagnostiek.json` (kapotte verwijzingen,
> onbereikbare scènes, stat-gates, payoff-index) en `_digest/` (per hoofdstuk een leesbare
> dump van elke scène, gebruikt om de samenvattingen te schrijven).
>
> Alles is mechanisch afgeleid uit `certamen/singleplayer-data.js` met exact dezelfde
> `CNSParser` als het spel zelf gebruikt, plus een scan van `singleplayer.js`, `games.js`,
> `battle.js` en `core.js` op flag-lezingen. Er is geen enkele regel spelcode gewijzigd.

## Omvang

| | Totaal |
|---|---|
| Scènes | 476 |
| Keuzeregels | 669 |
| …waarvan doorklikknoppen (enige knop in de scène) | 372 (56%) |
| …waarvan echte keuzes (≥2 knoppen) | 297 (44%) |
| Scènes met een echte keuze | 103 (22%) |
| Onderscheiden flags | 45 |
| Sprekende/genoemde NPC-ingangen | 83 |
| Payoffs (SP_PAYOFFS) | 13 |
| Puzzels in scènes | 71 |
| Combat-bridges | 15 |
| STAT-gated keuzes | 68 |

## Per hoofdstuk

| Hoofdstuk | Scènes | Keuze-scènes | Doorklik | Echte keuzes | Flags geschr. | Relaties geschr. | Payoffs | Puzzels | Combat | STAT-gates | Beelden | Souvenirs | Eretitels |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Proloog | 14 | 4 | 10 | 9 | 0 | 0 | 0 | 1 | 0 | 0 | 3 | 0 | 4 |
| H1 De Namen van de Wereld | 61 | 24 | 37 | 67 | 18 | 0 | 0 | 9 | 0 | 10 | 6 | 3 | 3 |
| H2 De Werken van de Helden | 63 | 14 | 49 | 45 | 20 | 1 | 4 | 12 | 2 | 11 | 7 | 4 | 5 |
| H3 Beloften van Goden en Mensen | 63 | 10 | 53 | 29 | 17 | 0 | 1 | 9 | 6 | 9 | 7 | 2 | 3 |
| H4 Het Labyrint van Herinneringen | 44 | 11 | 33 | 32 | 11 | 0 | 0 | 5 | 1 | 6 | 7 | 2 | 3 |
| H5 Het Gulden Vlies | 55 | 10 | 45 | 29 | 19 | 0 | 0 | 5 | 2 | 12 | 7 | 1 | 2 |
| H6 De Vloek van Thebe | 50 | 9 | 41 | 26 | 17 | 1 | 0 | 6 | 1 | 11 | 7 | 1 | 2 |
| H7 De Appel der Tweedracht | 27 | 5 | 22 | 15 | 0 | 0 | 2 | 6 | 0 | 2 | 7 | 1 | 4 |
| H8 De Wrok van Achilles | 48 | 6 | 42 | 17 | 2 | 9 | 2 | 10 | 2 | 4 | 8 | 1 | 6 |
| H9 Ilion in Vlammen | 51 | 10 | 40 | 28 | 0 | 0 | 4 | 8 | 1 | 3 | 0 | 1 | 7 |

## Gevolg-classificatie van elke keuzeregel

Definities zoals gevraagd, met één toevoeging: **doorklik** is afgesplitst van cosmetisch,
omdat een scène met één knop geen keuze ís en anders 372 valse "cosmetische keuzes" oplevert.

- **doorklik** — enige knop in de scène; de speler kan niets anders doen.
- **schijnkeuze** — meerdere knoppen, allemaal naar dezelfde scène, en er wordt niets weggeschreven.
- **lokaal** — verandert deze of de volgende scène, maar niets dat later wordt uitgelezen.
- **duurzaam-houding** — draagt `[CLEMENTIA]`/`[SEVERITAS]`; telt op in `SP_STATE.approach`,
  dat wél wordt uitgelezen via `{tendency_address}` (8 plekken). Diffuus, maar niet niets.
- **duurzaam** — de doelscène schrijft een flag of relatie die ergens anders daadwerkelijk wordt gelezen.

| Hoofdstuk | doorklik | schijnkeuze | lokaal | duurzaam-houding | duurzaam |
|---|---|---|---|---|---|
| Proloog | 10 | 0 | 9 | 0 | 0 |
| H1 De Namen van de Wereld | 37 | 11 | 29 | 24 | 3 |
| H2 De Werken van de Helden | 49 | 5 | 22 | 14 | 4 |
| H3 Beloften van Goden en Mensen | 53 | 4 | 17 | 8 | 0 |
| H4 Het Labyrint van Herinneringen | 33 | 6 | 14 | 12 | 0 |
| H5 Het Gulden Vlies | 45 | 3 | 20 | 6 | 0 |
| H6 De Vloek van Thebe | 41 | 3 | 16 | 6 | 1 |
| H7 De Appel der Tweedracht | 22 | 4 | 3 | 8 | 0 |
| H8 De Wrok van Achilles | 42 | 3 | 6 | 6 | 2 |
| H9 Ilion in Vlammen | 40 | 7 | 7 | 14 | 0 |
| **Totaal** | **372** | **46** | **143** | **98** | **10** |

Van de 669 keuzeregels zijn er **10** waarvan het gevolg ergens anders in het spel
daadwerkelijk wordt uitgelezen: 1%.

## Flags

45 flags: **31 dood** (geschreven, nooit gelezen), 14 levend, 0 wees-payoff.

### Levende flags

| Flag | Geschreven in | Gelezen (aantal) | Afstand in hoofdstukken |
|---|---|---|---|
| `ch1_lijn` | CH1_A10B, CH1_B08, CH1_C11 | 3 | 1 |
| `herakles_harnas` | CH2_H09 | 3 | 1 |
| `ch2_lijn_herakles` | CH2_H12 | 1 | 0 |
| `ch2_lijn_kallisto` | CH2_K09 | 1 | 0 |
| `ch2_lijn_latona` | CH2_L08 | 1 | 0 |
| `ch2_lijn_semele` | CH2_S08 | 1 | 0 |
| `ch3_lijn_herakles` | CH3_H25 | 1 | 0 |
| `ch3_lijn_io` | CH3_IO13 | 1 | 0 |
| `ch4_lijn_phaethon` | CH4_P10 | 1 | 0 |
| `ch4_lijn_theseus` | CH4_T16 | 1 | 0 |
| `ch8_zijde` | CH8_ACH_001, CH8_AGA_001 | 2 | 0 |
| `ch1_voltooid` | CH1_A10B, CH1_B08, CH1_C11 | 1 | n.v.t. (code/UI) |
| `ch5_bemanning_uitrusting` | CH5_006 | 2 | n.v.t. (code/UI) |
| `museum_mnemosyne_ontgrendeld` | CH6_MUSEUM_00 | 1 | n.v.t. (code/UI) |

### Dode flags

31 dode flags, waarvan **29** het systematische `chX_YYY_route`-patroon volgen:
elke STAT-gated routesplitsing schrijft vast welke aanpak de speler koos, en niets leest het ooit terug.

| Flag | Geschreven in |
|---|---|
| `ch1_a10_route` | CH1/CH1_A10_OPEN=open, CH1/CH1_A10_VIS=vis, CH1/CH1_A10_GRATIA=gratia |
| `ch1_b01_route` | CH1/CH1_B01_PAD=pad, CH1/CH1_B01_VIS=vis, CH1/CH1_B01_AGI=agilitas |
| `ch1_c03_route` | CH1/CH1_C03_OPEN=open, CH1/CH1_C03_AGI=agilitas, CH1/CH1_C03_VIS=vis |
| `ch1_c09_route` | CH1/CH1_C09_PAD=open, CH1/CH1_C09_VIS=vis, CH1/CH1_C09_PRU=prudentia |
| `ch2_h07_route` | CH2/CH2_H07_VIS=vis, CH2/CH2_H07_AGI=agilitas |
| `ch2_h10_route` | CH2/CH2_H10_ROB=robur, CH2/CH2_H10_AGI=agilitas |
| `ch2_k05_route` | CH2/CH2_K05_OPEN=open, CH2/CH2_K05_ROB=robur, CH2/CH2_K05_PRU=prudentia |
| `ch2_l06_route` | CH2/CH2_L06_OPEN=open, CH2/CH2_L06_AGI=agilitas, CH2/CH2_L06_ROB=robur |
| `ch2_l07_route` | CH2/CH2_L07B=gratia |
| `ch2_s06_route` | CH2/CH2_S06_OPEN=open, CH2/CH2_S06_VIS=vis, CH2/CH2_S06_PRU=prudentia |
| `ch3_h07_route` | CH3/CH3_H07_OPEN=open, CH3/CH3_H07_ROB=robur, CH3/CH3_H07_VIS=vis |
| `ch3_h13_route` | CH3/CH3_H13_OPEN=open, CH3/CH3_H13_GRA=gratia, CH3/CH3_H13_ROB=robur |
| `ch3_h23_route` | CH3/CH3_H23_OPEN=open, CH3/CH3_H23_ROB=robur |
| `ch3_io07_route` | CH3/CH3_IO07_OPEN=open, CH3/CH3_IO07_ROB=robur, CH3/CH3_IO07_GRA=gratia |
| `ch3_io11_route` | CH3/CH3_IO11_OPEN=open, CH3/CH3_IO11_ROB=robur, CH3/CH3_IO11_GRA=gratia |
| `ch4_p06_route` | CH4/CH4_P06_OPEN=open, CH4/CH4_P06_GRA=gratia, CH4/CH4_P06_ROB=robur |
| `ch4_t08_route` | CH4/CH4_T08_OPEN=open, CH4/CH4_T08_ROB=robur, CH4/CH4_T08_GRA=gratia |
| `ch4_t11_route` | CH4/CH4_T11_OPEN=open, CH4/CH4_T11_ROB=robur, CH4/CH4_T11_GRA=gratia |
| `ch5_004_route` | CH5/CH5_004_OPEN=open, CH5/CH5_004_VIS=vis, CH5/CH5_004_PRU=prudentia |
| `ch5_008_route` | CH5/CH5_008_OPEN=open, CH5/CH5_008_AGI=agilitas, CH5/CH5_008_VIS=vis |
| `ch5_016_route` | CH5/CH5_016_OPEN=open, CH5/CH5_016_AGI=agilitas, CH5/CH5_016_VIS=vis |
| `ch5_019_route` | CH5/CH5_019_OPEN=open, CH5/CH5_019_VIS=vis, CH5/CH5_019_PRU=prudentia |
| `ch5_024_route` | CH5/CH5_024_OPEN=open, CH5/CH5_024_VIS=vis, CH5/CH5_024_AGI=agilitas |
| `ch5_025_route` | CH5/CH5_025_OPEN=open, CH5/CH5_025_AGI=agilitas, CH5/CH5_025_PRU=prudentia |
| `ch6_001_route` | CH6/CH6_001_OPEN=open, CH6/CH6_001_VIS=vis, CH6/CH6_001_AGI=agilitas |
| `ch6_007_route` | CH6/CH6_007_OPEN=open, CH6/CH6_007_PRU=prudentia, CH6/CH6_007_AGI=agilitas |
| `ch6_012_route` | CH6/CH6_012_OPEN=open, CH6/CH6_012_VIS=vis, CH6/CH6_012_AGI=agilitas |
| `ch6_015_route` | CH6/CH6_015_OPEN=open, CH6/CH6_015_PRU=prudentia, CH6/CH6_015_AGI=agilitas |
| `ch6_023_route` | CH6/CH6_023_OPEN=open, CH6/CH6_023_AGI=agilitas, CH6/CH6_023_PRU=prudentia |
| `ch6_diomedes_epigonen` | CH6/CH6_020=true |
| `herakles_taken_voltooid` | CH2/CH2_H12=2, CH3/CH3_H25=12 |

## Relaties

Van de 83 NPC-ingangen hebben er **8** een relatiescore.

| NPC | Verschuivingen | Uitgelezen door |
|---|---|---|
| athena | CH2_L07B +1 | ch2_athena_echo_relatie |
| diomedes | CH6_018_PRU +1, CH8_AGA_001 +1 | ch9_gri009_echo_diomedes_geschiedenis |
| achilles | CH8_ACH_008 +1 | **nergens** |
| agamemnon | CH8_AGA_008 +1 | **nergens** |
| menelaos | CH8_ACH_001 -1, CH8_AGA_001 +1 | **nergens** |
| odysseus | CH8_AGA_008 +1 | **nergens** |
| aias | CH8_ACH_008 +1, CH8_AGA_008 -1 | ch9_gri005_echo_aias_sympathiek, ch9_gri005_echo_aias_afstandelijk |
| phoenix | CH8_ACH_008 +1 | **nergens** |

## NPCs over meerdere hoofdstukken, zonder geheugen

Personages die in ≥2 hoofdstukken voorkomen en géén relatiescore hebben:

| NPC | Hoofdstukken | Codex-persoon |
|---|---|---|
| priamus | CH7, CH8, CH9 | priamus |
| andromache | CH8, CH9 | andromache |
| bacchus | CH1, CH2 | bacchus |
| hektor | CH8, CH9 | hektor |
| hephaistos | CH1, CH8 | hephaistos |
| hera | CH2, CH3 | hera |
| herakles | CH2, CH3 | herakles |
| zeus | CH1, CH2 | zeus |

## STAT-gates: haalbaarheid per klasse (bij startwaarden)

Startwaarden: Hopliet vis 15 / robur 15 / agilitas 12 / prudentia 10 / ingenium 8 / gratia 8 ·
Boogschutter agilitas 15 / prudentia 15 / ingenium 12 / robur 10 / vis 8 / gratia 8 ·
Cavalerist ingenium 15 / gratia 15 / agilitas 12 / vis 10 / robur 8 / prudentia 8.
Skillpoints kunnen dit later verschuiven; dit is de nulmeting.

| Hoofdstuk | STAT-gates | Hopliet haalt | Boogschutter haalt | Cavalerist haalt |
|---|---|---|---|---|
| Proloog | 0 | — | — | — |
| H1 De Namen van de Wereld | 10 | 7 | 4 | 3 |
| H2 De Werken van de Helden | 11 | 6 | 5 | 2 |
| H3 Beloften van Goden en Mensen | 9 | 6 | 0 | 3 |
| H4 Het Labyrint van Herinneringen | 6 | 3 | 0 | 3 |
| H5 Het Gulden Vlies | 12 | 6 | 7 | 1 |
| H6 De Vloek van Thebe | 11 | 5 | 9 | 3 |
| H7 De Appel der Tweedracht | 2 | 1 | 1 | 0 |
| H8 De Wrok van Achilles | 4 | 2 | 2 | 0 |
| H9 Ilion in Vlammen | 3 | 0 | 3 | 0 |
| **Totaal** | **68** | **36** | **31** | **15** |

## Datavaliditeit (bijlage, hoort formeel bij fase 10)

- Keuzes met een niet-bestaand doel: **0**
- Dubbele scène-id's: **0**
- Onbereikbare scènes vanaf enig hoofdstukbegin: **1** — `CH3_H01_HARNAS` (Een Herinnering in Brons).
  Dit is **geen fout**: de scène is bewust alleen bereikbaar via de `deur`-payoff
  `ch3_h01_deur_herakles_harnas`, die de keuzeknop pas toevoegt als de speler `herakles_harnas` heeft.
  Het is de enige payoff-only scène in het spel, en daarmee ook het enige bestaande voorbeeld
  van het "deur"-mechanisme in werking.
- Terminale scènes (geen enkele keuze): **1** — `CH9_MUSEUM_00`. Dit is de huidige eindscène van
  het gebouwde spel; de renderer vangt dat op met een terugval naar de opslagplekken.
