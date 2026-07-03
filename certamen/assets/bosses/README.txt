CERTAMEN — Boss Battle sprite-bestanden
========================================

Bazen zijn ENKELVOUDIGE statische illustraties (geen RPG Maker MV sideview-
battler motion-sheet zoals de spelersfiguren) — bmBossSpriteHTML() in
bossbattle.js toont ze via object-fit:contain, ongeacht de brondimensies.

Per baas (BOSS_PRESETS in bossbattle.js) is er een `img`-veld met het pad
naar de rompillustratie. Ontbreekt dat veld, dan toont het spel een emoji-
placeholder (zie Cycloop hieronder) — het spel werkt dus ook zonder art.

Hydra: romp + 7 losse koppen
-----------------------------
  hydra.png        — de romp, MET de kale nekstompjes al ingetekend
  hydrahead1.png … hydrahead7.png — elke kop los, als transparante laag
                     precies op zijn eigen stomp gepositioneerd

Alle 8 bestanden hebben hetzelfde canvasformaat en worden simpelweg
absoluut op elkaar gestapeld (geen offsets nodig). Boss Battle bepaalt
hoeveel koppen nog "leven" op basis van het resterende HP-percentage
(gelijk verdeeld over de 7 koppen — bmBossAliveHeads() in bossbattle.js) en
toont alleen die kop-lagen; een verslagen kop verdwijnt gewoon, waardoor de
stomp op hydra.png zichtbaar wordt.

Andere bazen: één bestand
--------------------------
  Minotaur.png     — De Minotaurus (let op de hoofdletter, exact zo
                     gerefereerd in BOSS_PRESETS — GitHub Pages hostt
                     hoofdlettergevoelig)
  (nog geen bestand voor Cycloop — valt terug op emoji 👁️)

Extra materiaal (nog niet aan een baas gekoppeld)
--------------------------------------------------
  Cerberus.png, Chimera.png, Lamia.png, Succubus.png — liggen al klaar voor
  eventuele toekomstige bazen; nog geen BOSS_PRESETS-entry.

Nieuwe baas-art toevoegen
--------------------------
1. Bestand in deze map plaatsen.
2. In bossbattle.js het `img`-veld van de bijbehorende BOSS_PRESETS-entry
   invullen (pad relatief aan certamen/, dus "assets/bosses/naam.png").
3. SPRITE_VER (in battle.js) ophogen zodat browsers de nieuwe afbeelding
   laden i.p.v. een gecachete oude versie.
