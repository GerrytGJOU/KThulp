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
(Plaats de bestanden hier; namen moeten exact kloppen.)

Tweelaags (vloer = Battleback1, muur = Battleback2):
  grasland    : Grassland1.png  + Grassland2.png
  woestijn    : Desert1.png     + Desert2.png
  tempel      : Temple1.png     + Temple2.png      <- Grieks/Romeinse tempel
  ruines      : Ruins1.png      + Ruins2.png
  fort        : Fort1.png       + Fort2.png
  stad        : Town1.png       + Town2.png
  haven       : Port1.png       + Port2.png
  wolken      : Clouds1.png     + Clouds2.png
  hemel       : Sky1.png        + Sky2.png
  onderwereld : Underworld1.png + Underworld2.png

Enkellaags (één afbeelding, bv. een foto/JPG):
  olympus     : Olympus.jpg     (smooth = niet gepixeld geschaald)

"Standaard (thema-landschap)" gebruikt geen afbeeldingen maar het
ingebouwde CSS-landschap dat bij de gekozen factie/thema hoort.

Een set toevoegen of hernoemen
------------------------------
Pas de BATTLE_BACKGROUNDS-registry boven in certamen/battle.js aan.
Tweelaags: { nm, floor, wall }. Enkellaags: { nm, single, smooth:true }
(smooth voorkomt blokkerig schalen bij foto's i.p.v. pixel-art).
De dropdown bij de docent-instellingen loopt automatisch mee.

Aanbevolen formaat
------------------
RPG Maker MV battlebacks zijn doorgaans 1000 x 740 px. Grotere of
kleinere afbeeldingen werken ook; ze worden met 'cover' geschaald.
