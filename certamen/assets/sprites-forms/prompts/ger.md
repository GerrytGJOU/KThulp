# Beeldprompts Germanen (volkscode ger)

Geschreven op 2026-10-23 (nog niet gegenereerd). Anker: `ger_anker.png` — maak dat eerst met PROMPT 0 hieronder (UPLOAD `gra_anker.png` en `rom_anker.png` alleen als stijlreferentie). Blad A: anker + A van de ouder (Iuvenis Germanus A: anker + `rom_tiro_A.png`). Blad B: A van de vorm + `ger_iuvenisgermanus_B.png` (Iuvenis Germanus B: A + `rom_tiro_B.png`). Vul de `{{...}}` in per vorm; `{{FMT}}` = Iuvenis Germanus; `{{SECOND}}` staat per vorm.

## PROMPT 0 (anker)

- GEBRUIK: ChatGPT | UPLOAD: `rom_anker.png`, `gra_anker.png` (alleen stijlreferentie) | OPSLAAN ALS: `ger_anker.png`
```
Create ONE image: canvas exactly 1024 x 1024 pixels, 16-bit JRPG pixel-art in the style of RPG Maker MV and classic Fire Emblem sprites (match the attached reference images exactly in pixel size, outline, palette saturation and level of detail; do NOT copy their clothing). One standing Germanic recruit (Iuvenis Germanus), three-quarter top-down view from about 30 degrees above, facing the viewer, on one flat solid magenta #FF00FF background without gradient, floor or ground shadow. He wears: bare head with long blond hair tied back with a leather cord and a thin green headband, face clearly visible (very pale skin, clear blue eyes, a determined look); a plain rough cream wool tunic with a fur-trimmed collar and a green hem; a short green cloak pinned with a bone pin; brown leather trousers wrapped with leather straps; a brown leather belt; brown leather boots; NO armour and NO helmet. In his left hand a small ROUND wooden shield painted saturated green with a yellow wolf head emblem and a small iron boss; in his right hand a plain wooden spear with a short silver-grey leaf-shaped head. Chunky visible pixels, at most 24 colours, one dark-brown 1-pixel outline, flat cel-shading with at most two tones per colour, chibi proportions (head about one third of body height). The figure is at most 56 of 64 pixel blocks tall with at least 4 blocks of magenta margin. NO TEXT of any kind. AVOID: text, labels, logos, watermark, frame, border, second figure, realistic or painterly shading, blurry or anti-aliased edges, gradients, ground shadow, floor, magenta inside the figure.
```

## Sjabloon blad A
```
Use the attached images as the exact reference. The FIRST image is the Germanic anchor (style, palette, outline, proportions and level of detail). {{SECOND}}

Create ONE sprite sheet: canvas exactly 1536 x 1024 pixels, 16-bit JRPG pixel-art in the style of RPG Maker MV and classic Fire Emblem sprites. Layout: 3 columns by 2 rows of INVISIBLE cells, each cell exactly 512 x 512 pixels, the SAME character in all six cells. Background: one flat solid magenta #FF00FF, no gradient, no floor, no shadow on the ground. No magenta anywhere in the figure. IMPORTANT: the image contains NO TEXT of any kind: no labels, no captions, no pose names, no titles, no numbers and no letters anywhere, neither inside nor outside the cells.

CHARACTER: "{{NAME}}", Germanic unit (tier {{TIER}}, branch {{BRANCH}}, role {{ROLE}}). {{OUTFIT}}

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

Style reference: match the attached reference sheet exactly in palette and shading. Use bright, saturated colours with strong contrast: metal helmets shiny light SILVER-GREY with GOLD trim (not brown), shields saturated green with a yellow wolf-head emblem, mail and blades light SILVER-GREY. Skin and face must stay clearly readable when the sprite is shrunk to 48 pixels (clear dark eyes, very pale skin tone, mouth visible). Canvas exactly as stated. Do NOT draw any grid lines, borders or separators between the cells; the cells are only an invisible layout.

AVOID: NO TEXT OF ANY KIND (no labels, captions, pose names, titles, numbers or letters above, below or next to the figures); no logos or watermark; no frame, border, grid lines or separator lines drawn between the cells; no second figure; no change of clothing or colours between poses; no difference in scale between cells; no realistic or painterly shading; no blurry or anti-aliased edges; no gradients; no shadow on the ground; no floor; no magenta inside the figure.
```

## Sjabloon blad B
```
Use the attached images as reference. The FIRST image (the six-cell sprite sheet of {{NAME}}) shows THE SAME character to be redrawn: use it ONLY for the character's appearance and do NOT copy its six-cell layout. The SECOND image (the finished 3-cell sheet of the recruit {{FMT}}: portrait, battle front, battle back) shows the exact FORMAT, style, palette, outline, proportions and level of detail to follow (do NOT copy its clothing). Your output must have the same layout as the second image: ONE row of exactly three cells, never two rows and never six cells.

Create ONE sheet: canvas exactly 1536 x 512 pixels, 16-bit JRPG pixel-art in the style of RPG Maker MV and classic Fire Emblem sprites. Layout: ONE single row of exactly 3 INVISIBLE cells side by side (NOT six cells, NOT two rows), each exactly 512 x 512 pixels, the SAME character in all three. Background: one flat solid magenta #FF00FF, no gradient, no floor, no shadow on the ground. No magenta anywhere in the figure. IMPORTANT: the image contains NO TEXT of any kind: no labels, no captions, no pose names, no titles, no numbers and no letters anywhere, neither inside nor outside the cells.

CHARACTER: "{{NAME}}", Germanic unit (tier {{TIER}}, branch {{BRANCH}}, role {{ROLE}}). {{OUTFIT}}

STYLE: chunky visible pixels, at most 24 colours, one dark-brown 1-pixel outline around the whole figure, flat cel-shading with at most two tones per colour, warm saturated fantasy colours, small chibi proportions (head about one third of body height), easy to read at small size.

PIXEL GRID: every cell is its own 64 x 64 pixel grid; every pixel is a block of 8 x 8 image pixels and all pixels in the whole image are exactly the same size. In cells 2 and 3 the figure is at most 56 of the 64 pixels tall with at least 4 blocks of empty magenta margin all around, feet on the same horizontal line in both cells, same size in both cells.

CELLS:
Cell 1, a bust portrait: bust, three-quarter view, looking slightly to the right of the image, a stern but friendly look, more detail in the face than in the sprites; the figure fills about 60 percent of the cell. {{PORT}}
Cell 2, full body seen from the front: full body, ready for battle, straight from the front at eye level, face towards the viewer. {{FRONT}}
Cell 3, full body seen from behind: the same body exactly from behind, with a slight angle from above. {{BACK}}

CONSISTENCY: the equipment stays the same in ALL cells and every part of the figure, including weapons, tools and banners, stays completely inside its own cell, at least 4 pixel blocks from the cell edges, never touching a neighbouring cell. Shield shape and emblem never change between cells.

Style reference: match the attached reference sheet exactly in palette and shading. Use bright, saturated colours with strong contrast: metal helmets shiny light SILVER-GREY with GOLD trim (not brown), shields saturated green with a yellow wolf-head emblem, mail and blades light SILVER-GREY. Skin and face must stay clearly readable when the sprite is shrunk to 48 pixels (clear dark eyes, very pale skin tone, mouth visible). Canvas exactly as stated. Do NOT draw any grid lines, borders or separators between the cells; the cells are only an invisible layout.

AVOID: NO TEXT OF ANY KIND (no labels, captions, pose names, titles, numbers or letters above, below or next to the figures); no logos or watermark; no frame, border, grid lines or separator lines drawn between the cells; no second figure; no change of clothing or colours between cells; no difference in scale between cells 2 and 3; no realistic or painterly shading; no blurry or anti-aliased edges; no gradients; no shadow on the ground; no floor; no magenta inside the figure.
```

## ger_iuvenisgermanus | Iuvenis Germanus | tier 1 | Recruit | ouder: -

- Blad A, bijlagen: `ger_anker.png` en `rom_tiro_A.png`
- SECOND: The SECOND image is the finished Roman recruit sheet (Tiro): use it ONLY for the sheet format, the pixel size and the pose layout; do NOT copy its clothing, shield or face.
- NAME: Iuvenis Germanus; TIER: 1; BRANCH: Recruit; ROLE: recruit
- OUTFIT: He is a young Germanic recruit, the simplest unit. He wears: bare head with long blond hair tied back with a leather cord and a thin green headband, face clearly visible (very pale skin, clear blue eyes, a determined look); a plain rough wool tunic in cream with a fur-trimmed collar and a green hem; a short green cloak pinned with a bone pin; long brown leather trousers wrapped with leather straps; a brown leather belt; brown leather boots; NO armour and NO helmet. In his left hand a small ROUND wooden shield painted saturated green with a yellow wolf head as emblem and a small iron boss. In his right hand a plain wooden spear with a short silver-grey leaf-shaped head.
- REST: standing relaxed, facing the viewer, the spear held upright beside his body, the shield at his side
- ATTACK: one step forward, the spear thrust forward, the shield raised in front of his chest
- HIT: upper body leaning backwards, eyes closed, the shield sagging, the spear tilting
- PORT: Show the long blond hair with the leather cord, the green headband and the fur-trimmed collar.
- FRONT: Spear held ready in the right hand, small round green shield raised on the left arm.
- BACK: Show the green cloak, the long tied blond hair, the strapped trousers and the back of the round shield.

## ger_frameatus | Frameatus | tier 2 | Infantry | ouder: Iuvenis Germanus

- Blad A, bijlagen: `ger_anker.png` en `ger_iuvenisgermanus_A.png`
- SECOND: The SECOND image is the finished sheet of the parent form (Iuvenis Germanus): this unit is the next step of the SAME Germanic line, so keep the same saturated green, the same very pale skin with long blond hair, the same fur trimmings and the same yellow wolf-head emblem, but richer and with the new equipment described below.
- NAME: Frameatus; TIER: 2; BRANCH: Infantry; ROLE: infantry
- OUTFIT: He is a Germanic spear warrior. He wears: a grey wolf pelt worn over his head and shoulders like a hood, the face open and clearly visible below the wolf's snout (very pale skin, long blond hair, a short blond beard, clear blue eyes, a fierce look); a brown leather jerkin over a rough cream tunic with a green hem; a green cloak pinned with a bone pin; leather arm wraps; brown leather trousers with leather straps; brown leather boots; NO helmet and NO metal armour. In his left hand a ROUND wooden shield painted saturated green with a yellow wolf head and an iron boss. In his right hand a slim spear (framea) with a short, narrow silver head. A short axe at his belt.
- REST: standing relaxed, facing the viewer, the framea spear held upright beside his body, the shield at his side
- ATTACK: one step forward, the framea spear thrust forward, the shield raised in front of his chest
- HIT: upper body leaning backwards, eyes closed, the shield sagging, the framea spear tilting
- PORT: Show the grey wolf pelt hood, the short beard, the leather jerkin and the green cloak.
- FRONT: Round green shield on the left arm, framea spear held ready in the right hand.
- BACK: Show the wolf pelt hanging down his back, the green cloak, the back of the round shield and the spear.

## ger_centenus | Centenus | tier 3 | Infantry | ouder: Frameatus

- Blad A, bijlagen: `ger_anker.png` en `ger_frameatus_A.png`
- SECOND: The SECOND image is the finished sheet of the parent form (Frameatus): this unit is the next step of the SAME Germanic line, so keep the same saturated green, the same very pale skin with long blond hair, the same fur trimmings and the same yellow wolf-head emblem, but richer and with the new equipment described below.
- NAME: Centenus; TIER: 3; BRANCH: Infantry; ROLE: infantry
- OUTFIT: He wears: a simple iron helmet in light SILVER-GREY with a gold band and a small gold boar on top, face open and clearly visible (very pale skin, long blond hair, a long blond beard braided in two plaits, clear blue eyes, a firm look); a light SILVER-GREY mail shirt over a green tunic; a grey wolf pelt over the left shoulder; a green cloak with a gold brooch; a brown belt with a gold buckle; leather-strapped trousers; brown leather boots. In his left hand a large ROUND shield painted saturated green with a yellow wolf head emblem, a gold rim and an iron boss. In his right hand a slim spear (framea) with a silver head; a long straight sword with a gold pommel at his left hip.
- REST: standing relaxed, facing the viewer, the framea spear held upright beside his body, the shield at his side
- ATTACK: one step forward, the framea spear thrust forward, the shield raised in front of his chest
- HIT: upper body leaning backwards, eyes closed, the shield sagging, the framea spear tilting
- PORT: Show the iron helmet with the gold band and boar, the braided beard, the mail shirt and the wolf pelt.
- FRONT: Large round green shield on the left arm, framea spear held ready in the right hand.
- BACK: Show the back of the large round shield, the green cloak, the wolf pelt and the spear.

## ger_comes | Comes | tier 4 | Infantry | ouder: Centenus

- Blad A, bijlagen: `ger_anker.png` en `ger_centenus_A.png`
- SECOND: The SECOND image is the finished sheet of the parent form (Centenus): this unit is the next step of the SAME Germanic line, so keep the same saturated green, the same very pale skin with long blond hair, the same fur trimmings and the same yellow wolf-head emblem, but richer and with the new equipment described below.
- NAME: Comes; TIER: 4; BRANCH: Infantry; ROLE: infantry
- OUTFIT: He is a war-band leader, a sworn follower of the chieftain. He wears: a shiny GOLD-trimmed iron helmet with two large gold raven wings spread on both sides and a gold nose guard, face open and clearly visible (very pale skin, long blond hair, a long blond beard with gold beads, clear blue eyes, a commanding look); a light SILVER-GREY mail shirt with gold scale shoulder guards over a green tunic; a thick grey fur mantle over both shoulders; a long green cloak with a gold border and a round gold clasp; thick gold arm rings; a wide brown belt with a big gold buckle; brown leather boots with gold studs. In his left hand a large ROUND shield painted saturated green with a big yellow wolf head emblem and a wide gold rim. In his right hand a long straight sword with a silver blade and a gold hilt, raised.
- REST: standing relaxed, facing the viewer, the long sword held upright beside his body, the shield at his side
- ATTACK: one step forward, the long sword thrust forward, the shield raised in front of his chest
- HIT: upper body leaning backwards, eyes closed, the shield sagging, the long sword tilting
- PORT: Show the gold-trimmed helmet with the raven wings, the long beard with gold beads, the fur mantle and the gold clasp.
- FRONT: Large round green shield on the left arm, long sword raised in the right hand.
- BACK: Show the raven wings on the helmet, the long green cloak with the gold border, the fur mantle and the back of the round shield.

## ger_equesgermanus | Eques Germanus | tier 2 | Cavalry | ouder: Iuvenis Germanus

- Blad A, bijlagen: `ger_anker.png` en `ger_iuvenisgermanus_A.png`
- SECOND: The SECOND image is the finished sheet of the parent form (Iuvenis Germanus): this unit is the next step of the SAME Germanic line, so keep the same saturated green, the same very pale skin with long blond hair, the same fur trimmings and the same yellow wolf-head emblem, but richer and with the new equipment described below.
- NAME: Eques Germanus; TIER: 2; BRANCH: Cavalry; ROLE: cavalry, rider
- OUTFIT: The unit is the horse and its rider together as ONE whole in the cell: a small shaggy brown horse with a green saddle blanket with a yellow wolf head and simple brown leather harness. The rider wears: bare head with long blond hair tied back, face clearly visible (very pale skin, a short blond beard, clear blue eyes); a rough cream tunic with a fur-trimmed collar and a green hem; a short green cloak; leather-strapped trousers; brown leather boots; NO helmet. In his left hand a small ROUND green shield with a yellow wolf head; in his right hand a slim spear (framea). The whole horse and rider fit inside the 56-pixel limit and the margins.
- REST: sitting on the standing horse, facing the viewer, the spear held upright, the shield on his arm
- ATTACK: the horse taking one step forward, the spear thrust forward over the horse's head, the shield raised
- HIT: the horse shying back, the rider leaning backwards with eyes closed, the shield sagging
- PORT: Show the long tied blond hair, the short beard and the fur-trimmed collar.
- FRONT: The shaggy horse with its rider seen from the front, the rider holding the spear and the shield.
- BACK: Show the back of the horse with the green saddle blanket, the rider's green cloak and the spear.

## ger_batavus | Batavus | tier 3 | Cavalry | ouder: Eques Germanus

- Blad A, bijlagen: `ger_anker.png` en `ger_equesgermanus_A.png`
- SECOND: The SECOND image is the finished sheet of the parent form (Eques Germanus): this unit is the next step of the SAME Germanic line, so keep the same saturated green, the same very pale skin with long blond hair, the same fur trimmings and the same yellow wolf-head emblem, but richer and with the new equipment described below.
- NAME: Batavus; TIER: 3; BRANCH: Cavalry; ROLE: cavalry, Batavian horseman
- OUTFIT: He is a Batavian horseman, famed as a swimmer and rider. The unit is the horse and its rider together as ONE whole in the cell: a strong dark brown horse with a green saddle-cloth with a gold border and a yellow wolf head, plain iron-and-brown harness. The rider wears: a round iron helmet in light SILVER-GREY with a gold band and a short green plume, face open and clearly visible (very pale skin, long blond hair, a long moustache, clear blue eyes, a fierce look); a light SILVER-GREY mail shirt over a green tunic; a green cloak with a gold brooch; brown leather trousers and boots. In his left hand a long OVAL green shield with a yellow wolf head and a gold rim; in his right hand a long cavalry lance with a silver head. The whole horse and rider fit inside the 56-pixel limit and the margins.
- REST: sitting on the standing horse, facing the viewer, the lance upright, the shield on his arm
- ATTACK: the horse taking one step forward, the lance levelled forward over the horse's head, the shield raised
- HIT: the horse shying back, the rider leaning backwards with eyes closed, the shield sagging
- PORT: Show the round iron helmet with the gold band and green plume, the moustache and the mail shirt.
- FRONT: The dark horse with its rider seen from the front, the rider holding the lance and the shield.
- BACK: Show the back of the horse with the green saddle-cloth, the rider's green cloak and the lance.

## ger_saga | Saga | tier 2 | Seeresses | ouder: Iuvenis Germanus

- Blad A, bijlagen: `ger_anker.png` en `ger_iuvenisgermanus_A.png`
- SECOND: The SECOND image is the finished sheet of the parent form (Iuvenis Germanus): this unit is the next step of the SAME Germanic line, so keep the same saturated green, the same very pale skin with long blond hair, the same fur trimmings and the same yellow wolf-head emblem, but richer and with the new equipment described below.
- NAME: Saga; TIER: 2; BRANCH: Seeresses; ROLE: support, seeress
- OUTFIT: She is a young seeress. She wears: bare head with very long blond hair in two thin braids, a thin green headband with one small black raven feather, face clearly visible (very pale skin, clear pale blue eyes, a quiet watchful look); a long cream wool dress with a wide green border and a rope belt; a grey wolf-fur shawl on her shoulders pinned with a bone pin; a small leather pouch of carved rune stones at her belt; brown leather boots; NO armour, NO weapons and NO shield. In her right hand a plain wooden staff with three small black raven feathers and a small gold ring at the top; in her left hand a small wooden bowl with a few glowing blue herbs.
- REST: standing calmly, facing the viewer, the feather staff and the herb bowl
- ATTACK: stepping forward, raising the feather staff and the herb bowl so that it flashes, the other hand held out
- HIT: upper body leaning backwards, eyes closed, the held items tilting, hand raised
- PORT: Show the long braided blond hair, the green headband with the raven feather and the wolf-fur shawl.
- FRONT: Feather staff with the gold ring in the right hand, the herb bowl in the left hand.
- BACK: Show the long braids, the wolf-fur shawl, the green-bordered dress and the staff with the feathers.

## ger_vatesgermana | Vates Germana | tier 3 | Seeresses | ouder: Saga

- Blad A, bijlagen: `ger_anker.png` en `ger_saga_A.png`
- SECOND: The SECOND image is the finished sheet of the parent form (Saga): this unit is the next step of the SAME Germanic line, so keep the same saturated green, the same very pale skin with long blond hair, the same fur trimmings and the same yellow wolf-head emblem, but richer and with the new equipment described below.
- NAME: Vates Germana; TIER: 3; BRANCH: Seeresses; ROLE: support, healer, seeress
- OUTFIT: She is a wise seeress and healer. She wears: a circlet of silver oak leaves with a small gold raven on the brow on very long white-blond hair in two braids with gold beads, face clearly visible (very pale skin, clear pale blue eyes, a calm wise look); a long cream wool dress with a very wide green border and gold rune embroidery; a thick grey fur mantle over a long dark green cloak with a round gold clasp; a gold necklace; gold arm rings; a leather pouch of rune stones at her belt; brown leather boots; NO armour and NO shield. In her right hand a tall carved wooden staff topped with a gold raven with spread wings; in her left hand a small golden cup of glowing blue healing drink.
- REST: standing calmly, facing the viewer, the raven staff and the golden cup
- ATTACK: stepping forward, raising the raven staff and the golden cup so that it flashes, the other hand held out
- HIT: upper body leaning backwards, eyes closed, the held items tilting, hand raised
- PORT: Show the silver oak-leaf circlet with the small gold raven, the white-blond braids with gold beads and the gold necklace.
- FRONT: Raven staff in the right hand, the golden cup in the left hand.
- BACK: Show the long braids with the gold beads, the fur mantle, the dark green cloak and the staff with the gold raven.

