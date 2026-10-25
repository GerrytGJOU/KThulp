CASTRA HEROUM — PORTRETTEN VOOR DE DIALOGEN
===========================================

Het gespreksvak toont links een portret van de spreker. Is er geen portret, dan staat daar de avatar (het top-down poppetje).

EIGEN PORTRET (per persoon)
  assets/portraits/<naam>.png          144 x 144 px, transparante of effen achtergrond, pixel-art, kijkt iets naar rechts
  <naam> = de naam in het spel, kleine letters, zonder accenten, spaties en leestekens als _ :
           Matrona -> matrona.png        Venator Graecus -> venator_graecus.png        Pugnator Gallus -> pugnator_gallus.png
  Personen met dezelfde naam delen een portret (alle Fabers, alle Magistrae, alle Venatores). Wil je per volk een eigen, geef
  dan de personen in het spel een eigen naam of laat het weten.
  Helden gebruiken hun id (bv. perseus.png).

RPG MAKER MV GEZICHTENBLAD (kant-en-klaar uit de installatie, RPG Maker MV\NewData\img\faces)
  Zet het blad in deze map (576 x 288 px, 4 x 2 gezichten van 144 x 144), bv. People1.png, en koppel een gezicht aan een persoon in
  castra-tutorial.js:   CASTRA_PORTRAIT_SHEETS.matrona = { file:"assets/portraits/People1.png", i:3 };
  i = nummer van het gezicht (0 t/m 7: linksboven naar rechtsonder, eerst de bovenste rij).
  Een eigen bestand <naam>.png gaat voor op een gezichtenblad.

LICENTIE: zelfde voorbehoud als bij de tilesets (RPG Maker MV-bronnen buiten RPG Maker zelf).

Overzicht van wie nog een portret mist:   node certamen/tools/castra-portraits-manifest.js   (schrijft MANIFEST.md in deze map)
