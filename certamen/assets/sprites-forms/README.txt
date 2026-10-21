CASTRA HERONUM — SPRITES PER VORM
================================
Per vorm (151 stuks, zie MANIFEST.md voor de ID's) drie optionele afbeeldingen:

  [vorm-id]_battle_front.png   96 x 96   vijand in het beurtgevecht (kijkt naar je toe)
  [vorm-id]_battle_back.png    96 x 96   jouw soldaat in het beurtgevecht (kijkt van je af)
  [vorm-id]_td.png             48 x 48   tower defence en codex (driekwart bovenaanzicht,
                                          kleuraccent per volk)

Transparante achtergrond, pixel-art. Vorm-ID = volk_naam in kleine letters zonder spaties
of leestekens, max. 16 tekens na de underscore (bv. rom_hastatus, tro_bellatorcurru).

Zonder bestand valt het spel terug op de avatar-lagen (top-down), dus uploaden mag per vorm.
Het spel controleert elk bestand één keer per sessie; na het vervangen van een PNG:
CASTRA_FSPR.ver ophogen in castra-sprites.js.

Overzicht van wat nog mist:  node certamen/tools/castra-sprites-manifest.js  (schrijft MANIFEST.md)
