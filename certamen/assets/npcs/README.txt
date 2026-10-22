CASTRA HEROUM — KANT-EN-KLARE NPC-SPRITES (RPG Maker MV)
========================================================

Hier komen complete NPC-sprites (niet de losse avatar-lagen): boeren, kooplui, kinderen, wachters, enzovoort.
Ze worden gebruikt voor de rondlopende bewoners en later ook voor vaste NPC's in de regio's.

FORMAAT (RPG Maker MV character sheet)
  Eén personage per bestand:  144 x 192 px, 3 kolommen x 4 rijen, frame = 48 x 48 px, transparante achtergrond.
  Rijen van boven naar beneden: 0 = naar beneden (naar je toe), 1 = links, 2 = rechts, 3 = omhoog.
  Kolommen: 0 = linkervoet, 1 = staand, 2 = rechtervoet.
  Dit is hetzelfde formaat als de top-down avatar (zie ../sprites-topdown/README.txt).

  Een sheet met acht personages (576 x 384 px, 12 x 8 frames, de standaard van MV) kan ook; geef dan door welk
  personage (0 t/m 7, linksboven naar rechtsonder) bij welke bewoner hoort.

BESTANDSNAMEN
  Kleine letters, zonder spaties: boer_1.png, koopman_2.png, kind_1.png, oudeman_1.png ...
  Bij een volk-specifieke sprite het volk ervoor: gal_druide.png, aeg_scriba.png (volkscodes zoals in de rest van het spel:
  rom, gra, spa, tro, gla, gal, ger, aeg, per, car, ama).

GEBRUIK
  Zodra er bestanden staan, koppel ik ze in castra-wanderers.js aan de typen bewoners (sheet:"boer_1.png"); zonder bestand
  blijft de bewoner uit de avatar-lagen gebouwd. Uploaden mag dus per stuk.
