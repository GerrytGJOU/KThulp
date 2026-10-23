# Beeldprompts Galliërs (volkscode gal)

Geschreven op 2026-10-23 (nog niet gegenereerd). Anker: `gal_anker.png` — maak dat eerst met PROMPT 0 hieronder (UPLOAD `gra_anker.png` en `rom_anker.png` alleen als stijlreferentie). Blad A: anker + A van de ouder (Iuvenis Gallus A: anker + `rom_tiro_A.png`). Blad B: A van de vorm + `gal_iuvenisgallus_B.png` (Iuvenis Gallus B: A + `rom_tiro_B.png`). Vul de `{{...}}` in per vorm; `{{FMT}}` = Iuvenis Gallus; `{{SECOND}}` staat per vorm.

## PROMPT 0 (anker)

- GEBRUIK: ChatGPT | UPLOAD: `rom_anker.png`, `gra_anker.png` (alleen stijlreferentie) | OPSLAAN ALS: `gal_anker.png`
```
Create ONE image: canvas exactly 1024 x 1024 pixels, 16-bit JRPG pixel-art in the style of RPG Maker MV and classic Fire Emblem sprites (match the attached reference images exactly in pixel size, outline, palette saturation and level of detail; do NOT copy their clothing). One standing Gallic recruit (Iuvenis Gallus), three-quarter top-down view from about 30 degrees above, facing the viewer, on one flat solid magenta #FF00FF background without gradient, floor or ground shadow. He wears: bare head with wild untidy blond hair and a long drooping blond moustache, face clearly visible (very pale skin, clear blue-grey eyes, a cheerful wild look); a plain cream wool tunic with long sleeves and a green hem; checked green-and-cream trousers; a short bright green cloak pinned at one shoulder; a brown leather belt; brown leather shoes; NO armour and NO helmet. In his left hand a small OVAL wooden shield painted saturated green with a yellow boar emblem and a small gold boss; in his right hand a plain wooden spear with a short silver-grey leaf-shaped head. Chunky visible pixels, at most 24 colours, one dark-brown 1-pixel outline, flat cel-shading with at most two tones per colour, chibi proportions (head about one third of body height). The figure is at most 56 of 64 pixel blocks tall with at least 4 blocks of magenta margin. NO TEXT of any kind. AVOID: text, labels, logos, watermark, frame, border, second figure, realistic or painterly shading, blurry or anti-aliased edges, gradients, ground shadow, floor, magenta inside the figure.
```

## Sjabloon blad A
```
Use the attached images as the exact reference. The FIRST image is the Gallic anchor (style, palette, outline, proportions and level of detail). {{SECOND}}

Create ONE sprite sheet: canvas exactly 1536 x 1024 pixels, 16-bit JRPG pixel-art in the style of RPG Maker MV and classic Fire Emblem sprites. Layout: 3 columns by 2 rows of INVISIBLE cells, each cell exactly 512 x 512 pixels, the SAME character in all six cells. Background: one flat solid magenta #FF00FF, no gradient, no floor, no shadow on the ground. No magenta anywhere in the figure. IMPORTANT: the image contains NO TEXT of any kind: no labels, no captions, no pose names, no titles, no numbers and no letters anywhere, neither inside nor outside the cells.

CHARACTER: "{{NAME}}", Gallic unit (tier {{TIER}}, branch {{BRANCH}}, role {{ROLE}}). {{OUTFIT}}

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

Style reference: match the attached reference sheet exactly in palette and shading. Use bright, saturated colours with strong contrast: metal helmets and torcs shiny GOLD (not brown), shields saturated green with a yellow boar emblem, mail and blades light SILVER-GREY. Skin and face must stay clearly readable when the sprite is shrunk to 48 pixels (clear dark eyes, very pale skin tone, mouth visible). Canvas exactly as stated. Do NOT draw any grid lines, borders or separators between the cells; the cells are only an invisible layout.

AVOID: NO TEXT OF ANY KIND (no labels, captions, pose names, titles, numbers or letters above, below or next to the figures); no logos or watermark; no frame, border, grid lines or separator lines drawn between the cells; no second figure; no change of clothing or colours between poses; no difference in scale between cells; no realistic or painterly shading; no blurry or anti-aliased edges; no gradients; no shadow on the ground; no floor; no magenta inside the figure.
```

## Sjabloon blad B
```
Use the attached images as reference. The FIRST image (the six-cell sprite sheet of {{NAME}}) shows THE SAME character to be redrawn: use it ONLY for the character's appearance and do NOT copy its six-cell layout. The SECOND image (the finished 3-cell sheet of the recruit {{FMT}}: portrait, battle front, battle back) shows the exact FORMAT, style, palette, outline, proportions and level of detail to follow (do NOT copy its clothing). Your output must have the same layout as the second image: ONE row of exactly three cells, never two rows and never six cells.

Create ONE sheet: canvas exactly 1536 x 512 pixels, 16-bit JRPG pixel-art in the style of RPG Maker MV and classic Fire Emblem sprites. Layout: ONE single row of exactly 3 INVISIBLE cells side by side (NOT six cells, NOT two rows), each exactly 512 x 512 pixels, the SAME character in all three. Background: one flat solid magenta #FF00FF, no gradient, no floor, no shadow on the ground. No magenta anywhere in the figure. IMPORTANT: the image contains NO TEXT of any kind: no labels, no captions, no pose names, no titles, no numbers and no letters anywhere, neither inside nor outside the cells.

CHARACTER: "{{NAME}}", Gallic unit (tier {{TIER}}, branch {{BRANCH}}, role {{ROLE}}). {{OUTFIT}}

STYLE: chunky visible pixels, at most 24 colours, one dark-brown 1-pixel outline around the whole figure, flat cel-shading with at most two tones per colour, warm saturated fantasy colours, small chibi proportions (head about one third of body height), easy to read at small size.

PIXEL GRID: every cell is its own 64 x 64 pixel grid; every pixel is a block of 8 x 8 image pixels and all pixels in the whole image are exactly the same size. In cells 2 and 3 the figure is at most 56 of the 64 pixels tall with at least 4 blocks of empty magenta margin all around, feet on the same horizontal line in both cells, same size in both cells.

CELLS:
Cell 1, a bust portrait: bust, three-quarter view, looking slightly to the right of the image, a stern but friendly look, more detail in the face than in the sprites; the figure fills about 60 percent of the cell. {{PORT}}
Cell 2, full body seen from the front: full body, ready for battle, straight from the front at eye level, face towards the viewer. {{FRONT}}
Cell 3, full body seen from behind: the same body exactly from behind, with a slight angle from above. {{BACK}}

CONSISTENCY: the equipment stays the same in ALL cells and every part of the figure, including weapons, tools and banners, stays completely inside its own cell, at least 4 pixel blocks from the cell edges, never touching a neighbouring cell. Shield shape and emblem never change between cells.

Style reference: match the attached reference sheet exactly in palette and shading. Use bright, saturated colours with strong contrast: metal helmets and torcs shiny GOLD (not brown), shields saturated green with a yellow boar emblem, mail and blades light SILVER-GREY. Skin and face must stay clearly readable when the sprite is shrunk to 48 pixels (clear dark eyes, very pale skin tone, mouth visible). Canvas exactly as stated. Do NOT draw any grid lines, borders or separators between the cells; the cells are only an invisible layout.

AVOID: NO TEXT OF ANY KIND (no labels, captions, pose names, titles, numbers or letters above, below or next to the figures); no logos or watermark; no frame, border, grid lines or separator lines drawn between the cells; no second figure; no change of clothing or colours between cells; no difference in scale between cells 2 and 3; no realistic or painterly shading; no blurry or anti-aliased edges; no gradients; no shadow on the ground; no floor; no magenta inside the figure.
```

## gal_iuvenisgallus | Iuvenis Gallus | tier 1 | Recruit | ouder: -

- Blad A, bijlagen: `gal_anker.png` en `rom_tiro_A.png`
- SECOND: The SECOND image is the finished Roman recruit sheet (Tiro): use it ONLY for the sheet format, the pixel size and the pose layout; do NOT copy its clothing, shield or face.
- NAME: Iuvenis Gallus; TIER: 1; BRANCH: Recruit; ROLE: recruit
- OUTFIT: He is a young Gallic recruit, the simplest unit. He wears: bare head with wild untidy blond hair and a long drooping blond moustache, face clearly visible (very pale skin, clear blue-grey eyes, a cheerful wild look); a plain cream wool tunic with long sleeves and a green hem; checked green-and-cream trousers (bracae); a short bright green cloak pinned at one shoulder with a plain brooch; a brown leather belt; brown leather shoes; NO armour and NO helmet. In his left hand a small OVAL wooden shield painted saturated green with a yellow boar as emblem and a small gold boss. In his right hand a plain wooden spear with a short silver-grey leaf-shaped head.
- REST: standing relaxed, facing the viewer, the spear held upright beside his body, the shield at his side
- ATTACK: one step forward, the spear thrust forward, the shield raised in front of his chest
- HIT: upper body leaning backwards, eyes closed, the shield sagging, the spear tilting
- PORT: Show the wild blond hair, the drooping moustache and the green cloak with the brooch.
- FRONT: Spear held ready in the right hand, small oval green shield raised on the left arm.
- BACK: Show the green cloak, the wild blond hair, the checked trousers and the back of the oval shield.

## gal_gaesatus | Gaesatus | tier 2 | Infantry | ouder: Iuvenis Gallus

- Blad A, bijlagen: `gal_anker.png` en `gal_iuvenisgallus_A.png`
- SECOND: The SECOND image is the finished sheet of the parent form (Iuvenis Gallus): this unit is the next step of the SAME Gallic line, so keep the same saturated green, the same very pale skin with wild blond hair and drooping moustache, the same gold torc and the same yellow boar emblem, but richer and with the new equipment described below.
- NAME: Gaesatus; TIER: 2; BRANCH: Infantry; ROLE: infantry
- OUTFIT: He is a wild Gallic javelin warrior. He wears: bare head with wild spiky blond hair stiffened with lime and a long moustache, face clearly visible (very pale skin, blue woad spirals painted on one cheek, clear blue-grey eyes, a fierce look); a bare chest with blue woad spirals painted on it; a thick GOLD torc (neck ring) and gold arm rings; checked green-and-cream trousers (bracae); a wide brown belt with a sheathed short sword; a short green cloak thrown over one shoulder; brown leather shoes; NO helmet and NO body armour. In his left hand a long OVAL shield painted saturated green with a yellow boar emblem and a gold boss. In his right hand a heavy javelin (gaesum) with a long silver head, with two more javelins in a bundle at his back.
- REST: standing relaxed, facing the viewer, the javelin held upright beside his body, the shield at his side
- ATTACK: one step forward, the javelin thrust forward, the shield raised in front of his chest
- HIT: upper body leaning backwards, eyes closed, the shield sagging, the javelin tilting
- PORT: Show the spiky blond hair, the woad spirals, the long moustache and the gold torc.
- FRONT: Long oval green shield on the left arm, javelin raised in the right hand.
- BACK: Show the green cloak, the spiral woad on the back, the bundle of javelins and the back of the oval shield.

## gal_bellatorgallus | Bellator Gallus | tier 3 | Infantry | ouder: Gaesatus

- Blad A, bijlagen: `gal_anker.png` en `gal_gaesatus_A.png`
- SECOND: The SECOND image is the finished sheet of the parent form (Gaesatus): this unit is the next step of the SAME Gallic line, so keep the same saturated green, the same very pale skin with wild blond hair and drooping moustache, the same gold torc and the same yellow boar emblem, but richer and with the new equipment described below.
- NAME: Bellator Gallus; TIER: 3; BRANCH: Infantry; ROLE: infantry
- OUTFIT: He wears: a shiny GOLD round Coolus helmet with a small green plume and gold cheek guards, face open and clearly visible (very pale skin, blond hair under the helmet, a long blond moustache, clear blue-grey eyes, a firm look); a light SILVER-GREY mail shirt (lorica hamata) with short sleeves over a green tunic; a thick GOLD torc; a bright green cloak with a gold brooch; checked green-and-cream trousers; a wide brown belt with a gold chain; brown leather boots. In his left hand a long OVAL shield painted saturated green with a yellow boar emblem, a gold rim and a gold spine boss. In his right hand a long straight Celtic sword with a silver blade and a gold hilt.
- REST: standing relaxed, facing the viewer, the long sword held upright beside his body, the shield at his side
- ATTACK: one step forward, the long sword thrust forward, the shield raised in front of his chest
- HIT: upper body leaning backwards, eyes closed, the shield sagging, the long sword tilting
- PORT: Show the gold helmet with the green plume, the long moustache, the gold torc and the mail shirt.
- FRONT: Long oval green shield on the left arm, long sword in the right hand.
- BACK: Show the back of the long oval shield, the green cloak, the helmet plume and the sword.

## gal_soldurius | Soldurius | tier 4 | Infantry | ouder: Bellator Gallus

- Blad A, bijlagen: `gal_anker.png` en `gal_bellatorgallus_A.png`
- SECOND: The SECOND image is the finished sheet of the parent form (Bellator Gallus): this unit is the next step of the SAME Gallic line, so keep the same saturated green, the same very pale skin with wild blond hair and drooping moustache, the same gold torc and the same yellow boar emblem, but richer and with the new equipment described below.
- NAME: Soldurius; TIER: 4; BRANCH: Infantry; ROLE: infantry
- OUTFIT: He is a chieftain's sworn companion. He wears: a shiny GOLD helmet crowned with a tall gold boar crest and small gold wings on both sides, gold cheek guards, face open and clearly visible (very pale skin, long blond hair and moustache, a braided blond beard, clear blue-grey eyes, a proud look); a shiny GOLD scale cuirass over a light SILVER-GREY mail shirt; a very thick GOLD torc and gold arm rings; a rich long bright green cloak with a gold border and a round gold clasp; a green sash; checked green-and-cream trousers; brown leather boots with gold studs. In his left hand a long OVAL shield painted saturated green with a large yellow boar emblem and a wide gold rim. In his right hand a long straight Celtic sword with a silver blade and a gold hilt.
- REST: standing relaxed, facing the viewer, the long sword held upright beside his body, the shield at his side
- ATTACK: one step forward, the long sword thrust forward, the shield raised in front of his chest
- HIT: upper body leaning backwards, eyes closed, the shield sagging, the long sword tilting
- PORT: Show the gold helmet with the boar crest and wings, the braided beard, the gold torc and the gold clasp.
- FRONT: Long oval green shield on the left arm, sword held ready in the right hand.
- BACK: Show the boar crest, the long green cloak with the gold border, the back of the oval shield and the sword.

## gal_equesgallus | Eques Gallus | tier 2 | Cavalry | ouder: Iuvenis Gallus

- Blad A, bijlagen: `gal_anker.png` en `gal_iuvenisgallus_A.png`
- SECOND: The SECOND image is the finished sheet of the parent form (Iuvenis Gallus): this unit is the next step of the SAME Gallic line, so keep the same saturated green, the same very pale skin with wild blond hair and drooping moustache, the same gold torc and the same yellow boar emblem, but richer and with the new equipment described below.
- NAME: Eques Gallus; TIER: 2; BRANCH: Cavalry; ROLE: cavalry, rider
- OUTFIT: The unit is the horse and its rider together as ONE whole in the cell: a sturdy brown horse with a green saddle-cloth with a yellow boar and simple brown leather harness. The rider wears: a shiny GOLD round helmet with a small green plume, face open and clearly visible (very pale skin, blond hair, a long moustache, clear blue-grey eyes); a cream tunic with green hems; checked green-and-cream trousers; a short green cloak; a gold torc; brown leather boots. In his left hand a small OVAL green shield with a yellow boar; in his right hand a long spear with a silver leaf-shaped head. The whole horse and rider fit inside the 56-pixel limit and the margins.
- REST: sitting on the standing horse, facing the viewer, the spear held upright, the shield on his arm
- ATTACK: the horse taking one step forward, the spear thrust forward over the horse's head, the shield raised
- HIT: the horse shying back, the rider leaning backwards with eyes closed, the shield sagging
- PORT: Show the gold helmet with the small green plume, the long moustache and the gold torc.
- FRONT: The horse with its rider seen from the front, the rider holding the spear and the shield.
- BACK: Show the back of the horse with the green saddle-cloth, the rider's green cloak and the spear.

## gal_equesnobilis | Eques nobilis | tier 3 | Cavalry | ouder: Eques Gallus

- Blad A, bijlagen: `gal_anker.png` en `gal_equesgallus_A.png`
- SECOND: The SECOND image is the finished sheet of the parent form (Eques Gallus): this unit is the next step of the SAME Gallic line, so keep the same saturated green, the same very pale skin with wild blond hair and drooping moustache, the same gold torc and the same yellow boar emblem, but richer and with the new equipment described below.
- NAME: Eques nobilis; TIER: 3; BRANCH: Cavalry; ROLE: cavalry, noble rider
- OUTFIT: The unit is the horse and its rider together as ONE whole in the cell: a tall WHITE horse with a rich green saddle-cloth with a gold border and a yellow boar, green plumes on its head and gold-studded harness. The noble rider wears: a shiny GOLD helmet with a tall gold boar crest and green plume, gold cheek guards, face open and clearly visible (very pale skin, long blond hair and moustache, clear blue-grey eyes, a proud look); a light SILVER-GREY mail shirt over a green tunic; a very thick GOLD torc and gold arm rings; a long bright green cloak with a gold clasp streaming behind; checked trousers; brown leather boots with gold spurs. In his left hand a long OVAL green shield with a yellow boar and a gold rim; in his right hand a long Celtic sword with a gold hilt. The whole horse and rider fit inside the 56-pixel limit and the margins.
- REST: sitting on the standing white horse, facing the viewer, the sword raised, the shield on his arm
- ATTACK: the horse rearing slightly, the sword swung forward over the horse's head, the shield raised
- HIT: the horse shying back, the rider leaning backwards with eyes closed, the shield sagging
- PORT: Show the gold helmet with the boar crest and green plume, the long moustache and the gold torc.
- FRONT: The white horse with its noble rider seen from the front, the rider holding the sword and the shield.
- BACK: Show the back of the white horse with the gold-bordered green saddle-cloth, the long green cloak and the sword.

## gal_bardus | Bardus | tier 2 | Druids | ouder: Iuvenis Gallus

- Blad A, bijlagen: `gal_anker.png` en `gal_iuvenisgallus_A.png`
- SECOND: The SECOND image is the finished sheet of the parent form (Iuvenis Gallus): this unit is the next step of the SAME Gallic line, so keep the same saturated green, the same very pale skin with wild blond hair and drooping moustache, the same gold torc and the same yellow boar emblem, but richer and with the new equipment described below.
- NAME: Bardus; TIER: 2; BRANCH: Druids; ROLE: support, bard
- OUTFIT: He is a young bard. He wears: bare head with long wavy blond hair and a thin green headband, face clearly visible (very pale skin, a short blond beard, clear blue-grey eyes, a cheerful look); a long cream wool tunic with a wide green border; a green shoulder cape with a plain bronze brooch; a brown leather belt with a pouch; brown leather shoes; NO armour, NO weapons and NO shield. In his left arm a small golden Celtic harp with green strings; in his right hand a small bronze bell staff with a yellow boar head on top.
- REST: standing calmly, facing the viewer, the small golden harp and the bell staff
- ATTACK: stepping forward, raising the small golden harp and the bell staff so that it flashes, the other hand held out
- HIT: upper body leaning backwards, eyes closed, the held items tilting, hand raised
- PORT: Show the green headband, the long wavy hair, the short beard and the golden harp.
- FRONT: Small golden harp held in the left arm, bell staff in the right hand.
- BACK: Show the green shoulder cape, the long wavy hair, the belt pouch and the staff.

## gal_druida | Druida | tier 3 | Druids | ouder: Bardus

- Blad A, bijlagen: `gal_anker.png` en `gal_bardus_A.png`
- SECOND: The SECOND image is the finished sheet of the parent form (Bardus): this unit is the next step of the SAME Gallic line, so keep the same saturated green, the same very pale skin with wild blond hair and drooping moustache, the same gold torc and the same yellow boar emblem, but richer and with the new equipment described below.
- NAME: Druida; TIER: 3; BRANCH: Druids; ROLE: support, healer, druid
- OUTFIT: He is a druid, a healer. He wears: a wreath of green oak leaves with small gold acorns on long white-blond hair, face clearly visible (very pale skin, a long blond-grey beard, clear blue-grey eyes, a wise look); a long white wool robe with a wide green border and gold oak-leaf embroidery; a green hooded cloak thrown back on his shoulders, pinned with a gold crescent brooch; a gold torc; a brown leather belt with a herb pouch; brown leather shoes; NO armour and NO shield. In his right hand a tall wooden staff with a bunch of white mistletoe berries and green leaves tied to the top; in his left hand a small golden sickle.
- REST: standing calmly, facing the viewer, the mistletoe staff and the golden sickle
- ATTACK: stepping forward, raising the mistletoe staff and the golden sickle so that it flashes, the other hand held out
- HIT: upper body leaning backwards, eyes closed, the held items tilting, hand raised
- PORT: Show the oak-leaf wreath, the long beard, the gold crescent brooch and the green hood.
- FRONT: Mistletoe staff in the right hand, golden sickle in the left hand.
- BACK: Show the green hooded cloak, the white robe with the green border and the staff with the mistletoe.

## gal_summusdruida | Summus druida | tier 4 | Druids | ouder: Druida

- Blad A, bijlagen: `gal_anker.png` en `gal_druida_A.png`
- SECOND: The SECOND image is the finished sheet of the parent form (Druida): this unit is the next step of the SAME Gallic line, so keep the same saturated green, the same very pale skin with wild blond hair and drooping moustache, the same gold torc and the same yellow boar emblem, but richer and with the new equipment described below.
- NAME: Summus druida; TIER: 4; BRANCH: Druids; ROLE: support, high druid
- OUTFIT: He is the high druid. He wears: a golden oak-leaf crown with a large gold crescent on the brow on long white hair, face clearly visible (very pale skin, a very long white beard, clear pale blue eyes, a calm powerful look); a long white wool robe richly embroidered with gold oak leaves, with a very wide green border and gold hems; a long rich green mantle down to the ground with a round gold clasp; a very thick gold torc and gold arm rings; brown leather shoes with gold buckles; NO armour and NO shield. In his right hand a tall carved oak staff topped with a large gold crescent holding a green gem; in his left hand a golden sickle.
- REST: standing calmly, facing the viewer, the oak staff with the gold crescent and the golden sickle
- ATTACK: stepping forward, raising the oak staff with the gold crescent and the golden sickle so that it flashes, the other hand held out
- HIT: upper body leaning backwards, eyes closed, the held items tilting, hand raised
- PORT: Show the golden oak-leaf crown with the crescent, the very long white beard, the gold torc and the gold clasp.
- FRONT: Oak staff with the large gold crescent in the right hand, golden sickle in the left hand.
- BACK: Show the long green mantle, the gold-embroidered white robe and the staff with the crescent.

