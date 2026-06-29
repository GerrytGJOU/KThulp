CERTAMEN — Battle Mode slagveld-achtergronden (Battleback)
============================================================

RPG Maker MV bouwt een gevechtsachtergrond uit TWEE lagen:
  - Battleback1 = de VLOER / grond (onderste laag)
  - Battleback2 = de MUUR / horizon / achterwand (bovenste laag)

In KThulp leggen we deze via inline CSS over elkaar op het slagveld
(#bmField): de muur wordt eerst genoemd (bovenop), de vloer eronder.
Beide worden geschaald met background-size:cover, uitgelijnd op
"center bottom", en scherp gehouden met image-rendering:pixelated.

De docent kiest een set bij Battle — Instellingen > Slagveld-achtergrond.

Verwachte sets en bestandsnamen
-------------------------------
(Plaats de PNG's hier; namen moeten exact kloppen.)

  grasland : Grassland1.png  (vloer) + Grassland2.png (muur)
  woestijn : Desert1.png     (vloer) + Desert2.png    (muur)
  tempel   : Paved1.png      (vloer) + Temple2.png    (muur)   <- Grieks/Romeinse tempel
  fort     : Fort1.png       (vloer) + Fort2.png      (muur)

"Standaard (thema-landschap)" gebruikt geen afbeeldingen maar het
ingebouwde CSS-landschap dat bij de gekozen factie/thema hoort.

Een set toevoegen of hernoemen
------------------------------
Pas de BATTLE_BACKGROUNDS-registry boven in certamen/battle.js aan
(sleutel, weergavenaam, floor- en wall-pad). De dropdown bij de
docent-instellingen loopt automatisch mee.

Aanbevolen formaat
------------------
RPG Maker MV battlebacks zijn doorgaans 1000 x 740 px. Grotere of
kleinere afbeeldingen werken ook; ze worden met 'cover' geschaald.
