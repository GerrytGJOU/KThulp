CASTRA HEROUM — TOP-DOWN-SPRITES (loopsprites van de avatar)
=========================================================

Hier komen dezelfde avatar-onderdelen als in ../sprites/ (de battler-sprites van
Battle Mode), maar dan als top-down loopsprite voor Castra Heroum.

BESTANDSNAMEN
  Exact dezelfde naam als in ../sprites/ (zie de lijst hieronder). Zo werkt elke
  keuze uit de Certamen-avatareditor vanzelf ook in Castra Heroum: huid, ogen,
  haar, baard, armor, helm, cape, schild, wapen, extra, legendarische helden.

FORMAAT (RPG Maker MV character sheet, één personage per bestand)
  144 x 192 px: 3 kolommen x 4 rijen, frame = 48 x 48 px, transparante achtergrond.
  Rijen van boven naar beneden: 0 = naar beneden (naar je toe), 1 = links,
  2 = rechts, 3 = omhoog. Kolommen: 0 = linkervoet, 1 = staand, 2 = rechtervoet.
  Alle lagen van één avatar moeten exact dezelfde afmetingen en uitlijning hebben
  (net als bij de battler-sprites), anders passen ze niet op elkaar.

KLEUREN
  Haar- en capekleur, de goudglans van prestige-onderdelen en het gouden
  Kampioensharnas worden door het spel zelf met filters over de lagen gelegd
  (zelfde filters als Battle Mode). Maak haar dus blond en de cape goud, zoals de
  battler-sprites.
  Het Kampioensharnas hergebruikt armor_zwaar.png (net als in Battle Mode).

GEGENEREERD (niet met de hand maken)
  base_<huidtint>.png (6x) en ogen_<kleur>.png (6x) komen uit TV_Body_p01.png via
  tools/gen_sprites_topdown.py (zelfde paletten als tools/gen_sprites.js).
  TV_Body_p01.png is de bron: laat die staan. Na een wijziging het script draaien.

HAAR
  De MV-generator levert per stijl twee bestanden: RearHair2 (voor- en zijkant) en
  RearHair1 (achterkant, alleen de rij 'omhoog'). Die zijn samengevoegd tot één
  haar_<stijl>.png met alle vier de richtingen, zodat het één laag blijft zoals bij
  de battler. Stijlen: wild, lang, middel, kort, knot, vlecht, hanekam (+ kaal = leeg).
  Levert de generator een nieuwe stijl: beide bestanden aanleveren, dan samenvoegen.

WAPENS
  Er zijn bewust geen top-down wapensprites; Castra Heroum toont geen wapen.

CAPES EN VLEUGELS
  Capes (kort/lang) bestaan alleen als rij 'omhoog'; vleugels hebben ook voor- en
  zijrijen. Het spel tekent ze van voren achter het lichaam en bij 'omhoog' over
  lichaam en harnas.
  De top-down versies van de engelen-, duivels- en vlindervleugels komen als
  cape_engelenvleugels.png, cape_duivelsvleugels.png en cape_vlindervleugels.png
  (SV-bronnen: SV_Wing_p01 / p03 / p05 in _bron/, pixelgelijk aan de battler-capes).
  Wing1 (achterkant) en Wing2 (voor/zij) zijn samengevoegd, net als bij het haar.

GEKLEURDE HARNASSEN
  armor_middel.png, armor_ceremonieel.png en armor_robe.png zijn in de battler-versie herkleurd
  (grijs, resp. blauwgrijs/bruin). De top-down versies zijn naar dezelfde kleuren
  omgezet met een pixel-voor-pixel koppeling tussen de ongekleurde en gekleurde
  side view (_bron/SV_Clothing2_p01, _p22 en _p19). Komt er een
  nieuw herkleurd harnas bij: lever ook de ongekleurde side view in _bron/ aan.

ZOLANG BESTANDEN ONTBREKEN
  Heeft Castra Heroum nog geen base_<huidtint>.png voor een avatar, dan toont het
  spel de battler-avatar als vervanging. Je kunt dus stap voor stap uploaden.
  Na het vervangen van een PNG: SPRITE_VER in castra-avatar.js ophogen.

VERWACHTE BESTANDEN (64)
  armor_ceremonieel.png
  armor_hopliet.png
  armor_licht.png
  armor_middel.png
  armor_robe.png
  armor_vodden.png
  armor_zwaar.png
  baard_baard.png
  baard_geen.png
  baard_sik en snor.png
  baard_snor.png
  base_brons.png
  base_donker.png
  base_getint.png
  base_licht.png
  base_olijf.png
  base_zeerlicht.png
  borstband.png
  cape_duivelsvleugels.png
  cape_engelenvleugels.png
  cape_geen.png
  cape_kort.png
  cape_lang.png
  cape_vlindervleugels.png
  extra_blush.png
  extra_clown.png
  extra_dark eyes.png
  extra_litteken.png
  extra_ooglapje.png
  extra_oorbel.png
  extra_warstripes.png
  haar_hanekam.png
  haar_kaal.png
  haar_knot.png
  haar_kort.png
  haar_lang.png
  haar_middel.png
  haar_vlecht.png
  haar_wild.png
  helm_bandana.png
  helm_hopliet.png
  helm_kroon.png
  helm_open.png
  helm_standaard.png
  legendary_Achilles.png
  legendary_Aeneas.png
  legendary_Ajax de Grote.png
  legendary_Odysseus.png
  ogen_amber.png
  ogen_blauw.png
  ogen_bruin.png
  ogen_donkerbruin.png
  ogen_grijs.png
  ogen_groen.png
  schild_ovaal.png
  schild_rond.png
  schild_tower.png
  schild_vierkant.png
  wapen_boog.png
  wapen_hooivork.png
  wapen_knuppel.png
  wapen_speer.png
  wapen_staf.png
  wapen_zwaard.png
