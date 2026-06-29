CERTAMEN — Battle Mode sprite-bestanden
========================================

Plaats hier de RPG Maker VX Ace $-sprite sheets (PNG).
Vereist formaat: 96 × 128 px  (3 frames × 4 richtingen, elk 32 × 32 px)

Verwachte bestandsnamen
-----------------------
Lichamen (basis):
  base_light.png        — lichte huidskleur
  base_dark.png         — donkere huidskleur

Klassenpantsers:
  armor_hopliet.png
  armor_spartaan.png
  armor_centurio.png
  armor_boogschutter.png
  armor_cavalerie.png
  armor_priester.png
  armor_genie.png
  armor_verkenner.png

Helmen / accessoires:
  helm_standard.png
  helm_ceremonieel.png

Activeren
---------
Zet in certamen/battle.js de regel
  const BM_PIXEL_ART = false;
naar
  const BM_PIXEL_ART = true;

Zolang BM_PIXEL_ART = false is, worden de ingebouwde SVG-sprites gebruikt
als fallback. Je kunt ook per klasse activeren: laat die klasse gewoon
ontbreken in PIXEL_ASSETS.classes, dan blijft die SVG.
