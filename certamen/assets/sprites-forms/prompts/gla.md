# Beeldprompts Gladiatoren (volkscode gla)

Geschreven op 2026-10-23 (nog niet gegenereerd). Anker: `gla_anker.png` — maak dat eerst met PROMPT 0 hieronder (UPLOAD `gra_anker.png` en `rom_anker.png` alleen als stijlreferentie). Blad A: anker + A van de ouder (Novicius A: anker + `rom_tiro_A.png`). Blad B: A van de vorm + `gla_novicius_B.png` (Novicius B: A + `rom_tiro_B.png`). Vul de `{{...}}` in per vorm; `{{FMT}}` = Novicius; `{{SECOND}}` staat per vorm.

## PROMPT 0 (anker)

- GEBRUIK: ChatGPT | UPLOAD: `rom_anker.png`, `gra_anker.png` (alleen stijlreferentie) | OPSLAAN ALS: `gla_anker.png`
```
Create ONE image: canvas exactly 1024 x 1024 pixels, 16-bit JRPG pixel-art in the style of RPG Maker MV and classic Fire Emblem sprites (match the attached reference images exactly in pixel size, outline, palette saturation and level of detail; do NOT copy their clothing). One standing gladiator recruit (Novicius), three-quarter top-down view from about 30 degrees above, facing the viewer, on one flat solid magenta #FF00FF background without gradient, floor or ground shadow. He wears: bare head with wild untidy brown hair and a thin orange headband, face clearly visible (olive skin, clear dark eyes, a nervous but determined look); a bare chest with a plain leather strap across it; a short plain cream linen loincloth-tunic with an orange hem; a wide brown leather belt; a short orange sash knotted at the hip; a leather wrap on the right forearm; bare legs with brown leather sandals; NO helmet and NO armour. In his left hand a small round wicker-and-wood practice shield painted orange with a yellow crossed-swords emblem; in his right hand a plain wooden practice sword. Chunky visible pixels, at most 24 colours, one dark-brown 1-pixel outline, flat cel-shading with at most two tones per colour, chibi proportions (head about one third of body height). The figure is at most 56 of 64 pixel blocks tall with at least 4 blocks of magenta margin. NO TEXT of any kind. AVOID: text, labels, logos, watermark, frame, border, second figure, realistic or painterly shading, blurry or anti-aliased edges, gradients, ground shadow, floor, magenta inside the figure.
```

## Sjabloon blad A
```
Use the attached images as the exact reference. The FIRST image is the gladiator anchor (style, palette, outline, proportions and level of detail). {{SECOND}}

Create ONE sprite sheet: canvas exactly 1536 x 1024 pixels, 16-bit JRPG pixel-art in the style of RPG Maker MV and classic Fire Emblem sprites. Layout: 3 columns by 2 rows of INVISIBLE cells, each cell exactly 512 x 512 pixels, the SAME character in all six cells. Background: one flat solid magenta #FF00FF, no gradient, no floor, no shadow on the ground. No magenta anywhere in the figure. IMPORTANT: the image contains NO TEXT of any kind: no labels, no captions, no pose names, no titles, no numbers and no letters anywhere, neither inside nor outside the cells.

CHARACTER: "{{NAME}}", gladiator unit (tier {{TIER}}, branch {{BRANCH}}, role {{ROLE}}). {{OUTFIT}}

STYLE: chunky visible pixels, at most 24 colours, one dark-brown 1-pixel outline around the whole figure, flat cel-shading with at most two tones per colour, warm saturated fantasy colours, small chibi proportions (head about one third of body height), easy to read at small size.

PIXEL GRID: every cell is its own 64 x 64 pixel grid; every pixel is a block of 8 x 8 image pixels and all pixels in the whole image are exactly the same size. The figure is at most 56 of the 64 pixels tall with at least 4 blocks of empty magenta margin all around. Feet on the same horizontal line in every cell. The figure has the same size in every cell.

CAMERA: three-quarter top-down view (about 30 degrees above the figure, slightly in front of him), unless a pose says otherwise. Express viewing direction by camera position ("seen from behind", "facing the viewer"), not by left or right of the figure.

POSES, in this fixed order:
Row 1, cell 1, resting pose: {{REST}}.
Row 1, cell 2, attacking pose: {{ATTACK}}.
Row 1, cell 3, getting-hit pose: {{HIT}}.
Row 2, cell 1, walking-towards-the-camera pose: walking towards the camera, face and chest clearly visible, carrying the same equipment.
Row 2, cell 2, walking-sideways pose: walking to the RIGHT of the image, pure side view in profile, the shield or main item on the far side of the body.
Row 2, cell 3, walking-away pose: walking away from the camera, back, cape and the back of the equipment visible.

CONSISTENCY: the equipment stays the same in ALL cells and every part of the figure, including weapons, tools and banners, stays completely inside its own cell, at least 4 pixel blocks from the cell edges, never touching a neighbouring cell. Shield shape and emblem never change between cells.

Style reference: match the attached reference sheet exactly in palette and shading. Use bright, saturated colours with strong contrast: metal helmets and guards shiny GOLD (not brown), shields saturated orange with a yellow crossed-swords emblem, blades light SILVER-GREY. Skin and face must stay clearly readable when the sprite is shrunk to 48 pixels (clear dark eyes, olive skin tone, mouth visible). Canvas exactly as stated. Do NOT draw any grid lines, borders or separators between the cells; the cells are only an invisible layout.

AVOID: NO TEXT OF ANY KIND (no labels, captions, pose names, titles, numbers or letters above, below or next to the figures); no logos or watermark; no frame, border, grid lines or separator lines drawn between the cells; no second figure; no change of clothing or colours between poses; no difference in scale between cells; no realistic or painterly shading; no blurry or anti-aliased edges; no gradients; no shadow on the ground; no floor; no magenta inside the figure.
```

## Sjabloon blad B
```
Use the attached images as reference. The FIRST image (the six-cell sprite sheet of {{NAME}}) shows THE SAME character to be redrawn: use it ONLY for the character's appearance and do NOT copy its six-cell layout. The SECOND image (the finished 3-cell sheet of the recruit {{FMT}}: portrait, battle front, battle back) shows the exact FORMAT, style, palette, outline, proportions and level of detail to follow (do NOT copy its clothing). Your output must have the same layout as the second image: ONE row of exactly three cells, never two rows and never six cells.

Create ONE sheet: canvas exactly 1536 x 512 pixels, 16-bit JRPG pixel-art in the style of RPG Maker MV and classic Fire Emblem sprites. Layout: ONE single row of exactly 3 INVISIBLE cells side by side (NOT six cells, NOT two rows), each exactly 512 x 512 pixels, the SAME character in all three. Background: one flat solid magenta #FF00FF, no gradient, no floor, no shadow on the ground. No magenta anywhere in the figure. IMPORTANT: the image contains NO TEXT of any kind: no labels, no captions, no pose names, no titles, no numbers and no letters anywhere, neither inside nor outside the cells.

CHARACTER: "{{NAME}}", gladiator unit (tier {{TIER}}, branch {{BRANCH}}, role {{ROLE}}). {{OUTFIT}}

STYLE: chunky visible pixels, at most 24 colours, one dark-brown 1-pixel outline around the whole figure, flat cel-shading with at most two tones per colour, warm saturated fantasy colours, small chibi proportions (head about one third of body height), easy to read at small size.

PIXEL GRID: every cell is its own 64 x 64 pixel grid; every pixel is a block of 8 x 8 image pixels and all pixels in the whole image are exactly the same size. In cells 2 and 3 the figure is at most 56 of the 64 pixels tall with at least 4 blocks of empty magenta margin all around, feet on the same horizontal line in both cells, same size in both cells.

CELLS:
Cell 1, a bust portrait: bust, three-quarter view, looking slightly to the right of the image, a stern but friendly look, more detail in the face than in the sprites; the figure fills about 60 percent of the cell. {{PORT}}
Cell 2, full body seen from the front: full body, ready for battle, straight from the front at eye level, face towards the viewer. {{FRONT}}
Cell 3, full body seen from behind: the same body exactly from behind, with a slight angle from above. {{BACK}}

CONSISTENCY: the equipment stays the same in ALL cells and every part of the figure, including weapons, tools and banners, stays completely inside its own cell, at least 4 pixel blocks from the cell edges, never touching a neighbouring cell. Shield shape and emblem never change between cells.

Style reference: match the attached reference sheet exactly in palette and shading. Use bright, saturated colours with strong contrast: metal helmets and guards shiny GOLD (not brown), shields saturated orange with a yellow crossed-swords emblem, blades light SILVER-GREY. Skin and face must stay clearly readable when the sprite is shrunk to 48 pixels (clear dark eyes, olive skin tone, mouth visible). Canvas exactly as stated. Do NOT draw any grid lines, borders or separators between the cells; the cells are only an invisible layout.

AVOID: NO TEXT OF ANY KIND (no labels, captions, pose names, titles, numbers or letters above, below or next to the figures); no logos or watermark; no frame, border, grid lines or separator lines drawn between the cells; no second figure; no change of clothing or colours between cells; no difference in scale between cells 2 and 3; no realistic or painterly shading; no blurry or anti-aliased edges; no gradients; no shadow on the ground; no floor; no magenta inside the figure.
```

## gla_novicius | Novicius | tier 1 | Recruit | ouder: -

- Blad A, bijlagen: `gla_anker.png` en `rom_tiro_A.png`
- SECOND: The SECOND image is the finished Roman recruit sheet (Tiro): use it ONLY for the sheet format, the pixel size and the pose layout; do NOT copy its clothing, shield or face.
- NAME: Novicius; TIER: 1; BRANCH: Recruit; ROLE: recruit
- OUTFIT: He is a young gladiator recruit, the simplest unit. He wears: bare head with wild untidy brown hair and a thin orange headband, face clearly visible (olive skin, clear dark eyes, a nervous but determined look); a bare chest with a plain leather strap across it; a short plain cream linen loincloth-tunic (subligaculum) with an orange hem; a wide brown leather belt; a short orange sash knotted at the hip; a leather wrap on the right forearm; bare legs with brown leather sandals; NO helmet and NO armour. In his left hand a small round wicker-and-wood practice shield painted orange with a yellow crossed-swords emblem. In his right hand a plain wooden practice sword (rudis).
- REST: standing relaxed, facing the viewer, the wooden practice sword held upright beside his body, the shield at his side
- ATTACK: one step forward, the wooden practice sword thrust forward, the shield raised in front of his chest
- HIT: upper body leaning backwards, eyes closed, the shield sagging, the wooden practice sword tilting
- PORT: Show the orange headband, the wild brown hair, the leather chest strap and the orange sash.
- FRONT: Wooden practice sword in the right hand, small round orange shield raised on the left arm.
- BACK: Show the wild brown hair, the leather strap across the back, the orange sash and the back of the round shield.

## gla_murmillo | Murmillo | tier 2 | Heavy | ouder: Novicius

- Blad A, bijlagen: `gla_anker.png` en `gla_novicius_A.png`
- SECOND: The SECOND image is the finished sheet of the parent form (Novicius): this unit is the next step of the SAME gladiator line, so keep the same saturated orange, the same olive skin and wild brown hair and the same orange arena sash, but richer and with the new equipment described below.
- NAME: Murmillo; TIER: 2; BRANCH: Heavy; ROLE: infantry (heavy gladiator)
- OUTFIT: He wears: a shiny GOLD heavy gladiator helmet with a wide brim, a tall fish-shaped crest in bright orange, and a raised visor so the face is open and clearly visible (olive skin, wild brown hair under the helmet, clear dark eyes, a grim look); a bare chest; a thick leather and metal guard (manica) on the right arm; a shiny GOLD greave on the left leg; a short cream loincloth with an orange hem and a wide brown belt with a gold buckle; brown leather sandals. In his left hand a big rectangular curved scutum painted saturated orange with a yellow crossed-swords emblem and a gold rim. In his right hand a short straight sword (gladius) with a silver blade.
- REST: standing relaxed, facing the viewer, the short sword held upright beside his body, the shield at his side
- ATTACK: one step forward, the short sword thrust forward, the shield raised in front of his chest
- HIT: upper body leaning backwards, eyes closed, the shield sagging, the short sword tilting
- PORT: Show the gold helmet with the tall orange fish crest, the raised visor and the arm guard.
- FRONT: Big rectangular orange shield on the left arm, short sword in the right hand.
- BACK: Show the fish crest, the back of the big shield, the arm guard and the wide belt.

## gla_secutor | Secutor | tier 2 | Heavy | ouder: Novicius

- Blad A, bijlagen: `gla_anker.png` en `gla_novicius_A.png`
- SECOND: The SECOND image is the finished sheet of the parent form (Novicius): this unit is the next step of the SAME gladiator line, so keep the same saturated orange, the same olive skin and wild brown hair and the same orange arena sash, but richer and with the new equipment described below.
- NAME: Secutor; TIER: 2; BRANCH: Heavy; ROLE: infantry (heavy gladiator)
- OUTFIT: He wears: a smooth egg-shaped shiny GOLD helmet with a small low orange crest and two round eye holes, the visor pushed up so that the face is clearly visible above it (olive skin, wild brown hair, clear dark eyes, a focused look); a bare chest; a leather and metal guard (manica) on the right arm; a tall shiny GOLD greave on the left leg and a padded orange wrap on the right knee; a short cream loincloth with an orange hem and a wide brown belt; brown leather sandals. In his left hand a tall curved rectangular shield painted saturated orange with a yellow crossed-swords emblem. In his right hand a short straight sword with a silver blade.
- REST: standing relaxed, facing the viewer, the short sword held upright beside his body, the shield at his side
- ATTACK: one step forward, the short sword thrust forward, the shield raised in front of his chest
- HIT: upper body leaning backwards, eyes closed, the shield sagging, the short sword tilting
- PORT: Show the smooth gold helmet with the pushed-up visor and the low orange crest.
- FRONT: Tall curved orange shield on the left arm, short sword in the right hand.
- BACK: Show the smooth helmet from behind, the back of the tall shield and the arm guard.

## gla_hoplomachus | Hoplomachus | tier 2 | Heavy | ouder: Novicius

- Blad A, bijlagen: `gla_anker.png` en `gla_novicius_A.png`
- SECOND: The SECOND image is the finished sheet of the parent form (Novicius): this unit is the next step of the SAME gladiator line, so keep the same saturated orange, the same olive skin and wild brown hair and the same orange arena sash, but richer and with the new equipment described below.
- NAME: Hoplomachus; TIER: 2; BRANCH: Heavy; ROLE: infantry (heavy gladiator)
- OUTFIT: He wears: a shiny GOLD helmet with a wide brim, a tall orange feather plume on a gold crest and a raised visor with the face clearly visible (olive skin, wild brown hair, short dark stubble, clear dark eyes); a bare chest with a leather strap; quilted orange wraps on both thighs and shiny GOLD greaves; a leather arm guard on the right arm; a short cream loincloth with an orange hem and a brown belt with a gold buckle; brown leather sandals. In his left hand a small ROUND bronze-gold shield with an orange rim and a yellow crossed-swords emblem. In his right hand a long spear with a silver leaf-shaped head, and a short dagger at his belt.
- REST: standing relaxed, facing the viewer, the long spear held upright beside his body, the shield at his side
- ATTACK: one step forward, the long spear thrust forward, the shield raised in front of his chest
- HIT: upper body leaning backwards, eyes closed, the shield sagging, the long spear tilting
- PORT: Show the gold helmet with the tall orange feather plume, the stubble and the leather strap.
- FRONT: Small round gold shield on the left arm, long spear in the right hand.
- BACK: Show the orange plume, the back of the small round shield, the quilted thigh wraps and the spear.

## gla_retiarius | Retiarius | tier 2 | Light | ouder: Novicius

- Blad A, bijlagen: `gla_anker.png` en `gla_novicius_A.png`
- SECOND: The SECOND image is the finished sheet of the parent form (Novicius): this unit is the next step of the SAME gladiator line, so keep the same saturated orange, the same olive skin and wild brown hair and the same orange arena sash, but richer and with the new equipment described below.
- NAME: Retiarius; TIER: 2; BRANCH: Light; ROLE: ranged, net and trident thrower
- OUTFIT: He wears: NO helmet; wild brown hair and a thin orange headband, face clearly visible (olive skin, a short beard, clear dark eyes, a cunning look); a big shiny GOLD shoulder guard (galerus) with an orange fin rising above the left shoulder; a bare chest with leather straps; a leather guard on the left arm; a short cream loincloth with an orange hem and a brown belt; bare legs with brown leather sandals; NO shield. In his right hand a three-pronged silver trident; in his left hand a coiled brown rope net with small gold weights, ready to throw.
- REST: standing relaxed, facing the viewer, the net and the trident held loosely, light on his feet
- ATTACK: firing or throwing pose: leaning back then forward, the net and the trident aimed forward with the free arm stretched forward
- HIT: upper body leaning backwards, eyes closed, the net and the trident dropping, hand raised
- PORT: Show the gold shoulder guard with the orange fin, the headband, the short beard and the rope net.
- FRONT: Trident held in the right hand, coiled net ready in the left hand.
- BACK: Show the shoulder guard with the orange fin, the leather straps, the net and the trident.

## gla_thraex | Thraex | tier 2 | Light | ouder: Novicius

- Blad A, bijlagen: `gla_anker.png` en `gla_novicius_A.png`
- SECOND: The SECOND image is the finished sheet of the parent form (Novicius): this unit is the next step of the SAME gladiator line, so keep the same saturated orange, the same olive skin and wild brown hair and the same orange arena sash, but richer and with the new equipment described below.
- NAME: Thraex; TIER: 2; BRANCH: Light; ROLE: infantry (light gladiator)
- OUTFIT: He wears: a shiny GOLD helmet with a wide brim, a tall curved griffin crest in orange and a raised visor with the face clearly visible (olive skin, wild brown hair, clear dark eyes, a fierce look); a bare chest with a leather strap; tall shiny GOLD greaves on both legs; a quilted orange wrap on the right arm; a short cream loincloth with an orange hem and a wide brown belt; brown leather sandals. In his left hand a small square shield painted saturated orange with a yellow crossed-swords emblem. In his right hand a short curved sword (sica) with a silver blade.
- REST: standing relaxed, facing the viewer, the curved short sword held upright beside his body, the shield at his side
- ATTACK: one step forward, the curved short sword thrust forward, the shield raised in front of his chest
- HIT: upper body leaning backwards, eyes closed, the shield sagging, the curved short sword tilting
- PORT: Show the gold helmet with the curved orange griffin crest, the raised visor and the strap across the chest.
- FRONT: Small square orange shield on the left arm, curved sword in the right hand.
- BACK: Show the griffin crest, the back of the small square shield and the greaves.

## gla_dimachaerus | Dimachaerus | tier 2 | Light | ouder: Novicius

- Blad A, bijlagen: `gla_anker.png` en `gla_novicius_A.png`
- SECOND: The SECOND image is the finished sheet of the parent form (Novicius): this unit is the next step of the SAME gladiator line, so keep the same saturated orange, the same olive skin and wild brown hair and the same orange arena sash, but richer and with the new equipment described below.
- NAME: Dimachaerus; TIER: 2; BRANCH: Light; ROLE: infantry (light gladiator, two swords)
- OUTFIT: He wears: a light open GOLD helmet with a small orange crest, the face fully open and clearly visible (olive skin, wild brown hair, clear dark eyes, a wild grin); a bare chest with crossed leather straps; leather arm guards on both arms; a short cream loincloth with an orange hem and a brown belt; light shiny GOLD greaves; brown leather sandals; NO shield. In EACH hand one short curved sword with a silver blade: two swords.
- REST: standing relaxed, facing the viewer, the two swords held ready
- ATTACK: one step forward, the two swords striking forward
- HIT: upper body leaning backwards, eyes closed, the two swords dropping, hand raised
- PORT: Show the open gold helmet with the small orange crest, the crossed leather straps and both sword hilts.
- FRONT: A short sword in each hand, crossed in front of his chest.
- BACK: Show the crossed leather straps, the open helmet crest and the two swords held at his sides.

## gla_primuspalus | Primus palus | tier 3 | Heavy and light | ouder: Murmillo, Secutor, Hoplomachus, Retiarius, Thraex or Dimachaerus

- Blad A, bijlagen: `gla_anker.png` en `gla_murmillo_A.png`
- SECOND: The SECOND image is the finished sheet of the parent form (Murmillo, Secutor, Hoplomachus, Retiarius, Thraex or Dimachaerus): this unit is the next step of the SAME gladiator line, so keep the same saturated orange, the same olive skin and wild brown hair and the same orange arena sash, but richer and with the new equipment described below.
- NAME: Primus palus; TIER: 3; BRANCH: Heavy and light; ROLE: infantry (champion)
- OUTFIT: He is the champion of the arena, the best fighter of the school. He wears: a shiny GOLD ornate helmet with a wide brim, a very tall bright orange crest with gold feathers and a raised visor, face clearly visible (olive skin, wild brown hair under a gold laurel wreath, a short dark beard, clear dark eyes, a proud look); a shiny GOLD chest plate with an orange lion embossed on it over a bare upper arm; leather and gold arm guards on both arms; an orange sash across the chest with gold tassels; a short cream loincloth with a wide orange hem and a brown belt with a big gold buckle; shiny GOLD greaves; brown leather sandals. In his left hand a big rectangular curved shield painted saturated orange with a yellow crossed-swords emblem and a wide gold rim. In his right hand a short straight sword with a silver blade and a gold hilt, raised in salute.
- REST: standing relaxed, facing the viewer, the sword held upright beside his body, the shield at his side
- ATTACK: one step forward, the sword thrust forward, the shield raised in front of his chest
- HIT: upper body leaning backwards, eyes closed, the shield sagging, the sword tilting
- PORT: Show the gold laurel wreath, the tall orange helmet crest, the short beard and the gold chest plate with the orange lion.
- FRONT: Big orange shield on the left arm, sword raised in the right hand.
- BACK: Show the tall helmet crest, the orange sash with the gold tassels and the back of the big shield.

## gla_essedarius | Essedarius | tier 2 | Chariot | ouder: Novicius

- Blad A, bijlagen: `gla_anker.png` en `gla_novicius_A.png`
- SECOND: The SECOND image is the finished sheet of the parent form (Novicius): this unit is the next step of the SAME gladiator line, so keep the same saturated orange, the same olive skin and wild brown hair and the same orange arena sash, but richer and with the new equipment described below.
- NAME: Essedarius; TIER: 2; BRANCH: Chariot; ROLE: cavalry, chariot gladiator
- OUTFIT: He fights from a light British-style chariot. The unit is the chariot and its gladiator together as ONE whole in the cell: a small open two-wheeled wooden chariot with orange painted side panels and a yellow crossed-swords emblem, drawn by TWO small shaggy brown ponies with orange plumes and brown harness. The gladiator stands in the chariot and wears: a light open shiny GOLD helmet with a small orange crest, the face open and clearly visible (olive skin, wild brown hair, clear dark eyes, a wild grin); a bare chest with leather straps; a short cream loincloth with an orange hem; a short orange cloak; leather arm guards; NO shield. In his right hand a javelin with a silver head, in his left hand the reins. The whole chariot with ponies fits inside the 56-pixel limit and the margins.
- REST: standing in the chariot, the ponies standing still, facing the viewer, the javelin raised in one hand, the reins in the other
- ATTACK: the chariot surging one step forward, the ponies rearing slightly, the javelin thrown forward
- HIT: the ponies shying back, the gladiator leaning backwards with eyes closed, the reins loosening
- PORT: Show the open gold helmet with the orange crest, the reins and the head of one pony with an orange plume.
- FRONT: The small chariot with the two ponies seen from the front, the gladiator holding the javelin and the reins.
- BACK: Show the back of the chariot with the orange panel, the gladiator's orange cloak and the hindquarters of the two ponies.

## gla_rudiarius | Rudiarius | tier 3 | Veteran | ouder: Murmillo, Secutor, Hoplomachus, Retiarius, Thraex or Dimachaerus

- Blad A, bijlagen: `gla_anker.png` en `gla_murmillo_A.png`
- SECOND: The SECOND image is the finished sheet of the parent form (Murmillo, Secutor, Hoplomachus, Retiarius, Thraex or Dimachaerus): this unit is the next step of the SAME gladiator line, so keep the same saturated orange, the same olive skin and wild brown hair and the same orange arena sash, but richer and with the new equipment described below.
- NAME: Rudiarius; TIER: 3; BRANCH: Veteran; ROLE: support, veteran trainer
- OUTFIT: He is a retired veteran who trains the school. He wears: bare head with short grey-brown hair and a faded orange headband, face clearly visible (olive skin, a short grey beard, a scar across one cheek, clear dark eyes, a stern but kind look); a plain cream wool tunic with orange hems and a leather chest strap; a thick brown leather belt with a gold buckle; a short orange cloak on one shoulder; a golden wooden-sword badge on the strap; brown leather boots; NO helmet and NO armour. In his right hand a wooden practice sword (rudis) with a gold-wrapped grip, the sign of freedom; in his left hand a wax writing tablet with an orange cover.
- REST: standing calmly, facing the viewer, the wooden rudis and the writing tablet
- ATTACK: stepping forward, raising the wooden rudis and the writing tablet so that it flashes, the other hand held out
- HIT: upper body leaning backwards, eyes closed, the held items tilting, hand raised
- PORT: Show the orange headband, the grey beard with the scar, the golden badge and the orange cloak.
- FRONT: Wooden rudis with the gold-wrapped grip in the right hand, the orange writing tablet in the left hand.
- BACK: Show the short orange cloak, the leather strap, the thick belt and the rudis.

