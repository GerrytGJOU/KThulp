# Chronica Classica — COMBAT-sprites

Sprite-bestanden voor de COMBAT-gevechten in Chronica Classica (Single Player
Mode). Losse map naast `assets/bosses/` (Boss Battle) zodat die niet
volstroomt met illustraties die niets met Boss Battle te maken hebben.

`img` (en `heads` voor de Hydra) in `SP_COMBAT_ENEMIES` (`singleplayer-data.js`)
wijst naar bestanden hier, relatief aan `certamen/`. Ontbreekt een bestand,
dan valt `SCREENS.spCombat` terug op het `icon`-emoji van die entry — het
spel werkt dus ook zonder art.

## Gedupliceerd vanuit assets/bosses/ (Boss Battle)
- `hydra.png` + `hydrahead1.png`…`hydrahead7.png` — dezelfde Hydra van Lerna,
  ook gebruikt door Boss Battle (`BOSS_PRESETS.hydra`, bossbattle.js).

Alle andere sprites (incl. `cerberus.png` en `nemeische_leeuw.png`) zijn
eigen, met de Gemini-Gem gegenereerde tekeningen — geen Boss Battle-materiaal.

## Status
Alle 28 COMBAT-sprites zijn compleet (2026-08-24) — de oorspronkelijke 16,
`fin_lethe` (Finale-koppeling) en de 11 historische vijanden uit de
post-build audit (Hoofdstuk 18-27, Chronica.md §7.107). Zie
`CH_COMBAT_SPRITES_TODO.md` in de repo-root voor de volledige lijst en de
Gemini-Gem-prompt, te hergebruiken zodra er een nieuw COMBAT-gevecht bijkomt.

## Nieuw sprite-bestand toevoegen
1. Bestand hier plaatsen, exacte naam zoals in `SP_COMBAT_ENEMIES` (`img`-veld,
   `singleplayer-data.js`) — GitHub Pages hostt hoofdlettergevoelig.
2. Klaar — geen aparte versie-constante te verhogen (Chronica cachet
   afbeeldingen niet apart zoals Boss Battle se `SPRITE_VER`).
