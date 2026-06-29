CERTAMEN — Battle Mode sprite-bestanden
========================================

Formaat: RPG Maker MV SIDEVIEW BATTLER sheets.
  Karakter/cosmetic sheets : 576 x 384 px  (9 kolommen x 6 rijen, frame = 64 x 64)
  Wapen-strips             : 288 x 64 px   (3 aanvalsframes, elk 96 x 64)

De engine toont rij 0, frames 0-2 als idle-cyclus. De avatars kijken van
nature naar links; Team A wordt gespiegeld (kijkt naar rechts), Team B niet.

Verwachte bestandsnamen
-----------------------

Lichamen (basis):
  base_light.png
  base_dark.png
  base_light_female.png
  base_dark_female.png

Helm:           (optie "Geen helm" = geen bestand, lege laag)
  helm_standaard.png
  helm_open.png
  helm_hopliet.png        (vereist niveau 5)
  helm_kroon.png          (vereist beheersing 3 sterren)

Haar:
  haar_kort.png
  haar_lang.png
  haar_kaal.png           (leeg / transparant)
  haar_vlecht.png         (vereist niveau 3)
  Haarkleur wordt via CSS-filter gegenereerd (sprites zijn blond).

Gezichtshaar:   ("Baard en snor" stapelt baard_baard + baard_snor)
  baard_geen.png          (leeg / transparant)
  baard_baard.png
  baard_snor.png

Wapenrusting:
  armor_licht.png
  armor_middel.png
  armor_hopliet.png       (vereist niveau 3)
  armor_zwaar.png         (vereist niveau 5)
  armor_ceremonieel.png   (vereist beheersing 5 sterren)

Schild:         (optie "Geen schild" = geen bestand, lege laag)
  schild_rond.png         (Rond)
  schild_ovaal.png        (Puntig)
  schild_vierkant.png     (Metaal Rond)
  schild_tower.png        (Metaal Puntig, vereist niveau 7)

Wapen:
  wapen_zwaard.png
  wapen_speer.png
  wapen_boog.png
  wapen_staf.png          (vereist niveau 4)

Cape:           (capekleur via CSS-filter; basis is goud/geel)
  cape_geen.png           (leeg / transparant)
  cape_kort.png
  cape_lang.png           (vereist niveau 6)

Z-index laagvolgorde (van achter naar voren)
---------------------------------------------
  1. cape_*.png       Cape (achterste laag)
  2. wapen_*.png      Wapen (achterste hand, áchter het lichaam)
  3. base_*.png       Lichaam
  4. baard_*.png      Gezichtshaar
  5. haar_*.png       Haar
  6. armor_*.png      Wapenrusting
  7. schild_*.png     Schild (vóór het pantser)
  8. helm_*.png       Helm (bovenste laag)

Wapen-animatie
--------------
wapen_*.png bevat 3 AANVALSframes (geen ademhaling). In rust staat het
wapen statisch op het laatste frame (houd-stand). Tijdens een aanval
speelt de 3-frame zwaai en eindigt weer op het laatste frame.

Activeren / cache
-----------------
BM_PIXEL_ART = true in certamen/battle.js zet pixel art aan (anders SVG-
fallback). Na het vervangen van een PNG: verhoog SPRITE_VER in battle.js
zodat browsers de nieuwe afbeelding laden.
