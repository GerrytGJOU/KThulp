CERTAMEN — Battle Mode sprite-bestanden
========================================

Plaats hier de RPG Maker VX Ace $-sprite sheets (PNG).
Vereist formaat: 96 x 128 px  (3 frames x 4 richtingen, elk 32 x 32 px)

Verwachte bestandsnamen
-----------------------

Lichamen (basis):
  base_licht.png
  base_donker.png

Helm:
  helm_standard.png
  helm_open.png
  helm_fedder.png         (vereist niveau 5)
  helm_kroon.png          (vereist beheersing 3 sterren)

Haar:
  haar_kort.png
  haar_lang.png
  haar_kaal.png
  haar_vlecht.png         (vereist niveau 3)

Gezichtshaar:
  baard_geen.png          (leeg / volledig transparant)
  baard_baard.png
  baard_snor.png

Wapenrusting:
  armor_licht.png
  armor_middel.png
  armor_zwaar.png         (vereist niveau 5)
  armor_ceremonieel.png   (vereist beheersing 5 sterren)

Schild:
  schild_rond.png
  schild_ovaal.png
  schild_vierkant.png
  schild_tower.png        (vereist niveau 7)

Wapen:
  wapen_zwaard.png
  wapen_speer.png
  wapen_boog.png
  wapen_staf.png          (vereist niveau 4)

Cape:
  cape_geen.png           (leeg / volledig transparant)
  cape_kort.png
  cape_lang.png           (vereist niveau 6)

Totaal: 27 bestanden

Laagvolgorde (van onder naar boven)
------------------------------------
  1. base_*.png       Lichaam / huidskleur
  2. cape_*.png       Cape (achter het lichaam, dus vroeg renderen)
  3. armor_*.png      Wapenrusting
  4. schild_*.png     Schild
  5. wapen_*.png      Wapen
  6. haar_*.png       Haar
  7. baard_*.png      Gezichtshaar
  8. helm_*.png       Helm (bovenste laag)

Richtingen in de spritesheet (Y-as)
-------------------------------------
  Rij 0 (y=  0): naar beneden
  Rij 1 (y= 32): naar links   <- Team B gebruikt deze rij
  Rij 2 (y= 64): naar rechts  <- Team A gebruikt deze rij
  Rij 3 (y= 96): naar boven

Activeren
----------
Zet in certamen/battle.js de regel
  const BM_PIXEL_ART = false;
naar
  const BM_PIXEL_ART = true;

Zolang BM_PIXEL_ART = false is, worden de ingebouwde SVG-sprites gebruikt
als fallback. Je kunt ook per bestand testen: zolang een PNG ontbreekt,
slaat de engine die laag automatisch over.
