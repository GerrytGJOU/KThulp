# Beeldprompts Amazones (volkscode ama)

Geschreven op 2026-10-23 (nog niet gegenereerd). Anker: `ama_anker.png` — maak dat eerst met PROMPT 0 hieronder (UPLOAD `gra_anker.png` en `rom_anker.png` alleen als stijlreferentie). Blad A: anker + A van de ouder (Virgo Amazon A: anker + `rom_tiro_A.png`). Blad B: A van de vorm + `ama_virgoamazon_B.png` (Virgo Amazon B: A + `rom_tiro_B.png`). Vul de `{{...}}` in per vorm; `{{FMT}}` = Virgo Amazon; `{{SECOND}}` staat per vorm.

## PROMPT 0 (anker)

- GEBRUIK: ChatGPT | UPLOAD: `rom_anker.png`, `gra_anker.png` (alleen stijlreferentie) | OPSLAAN ALS: `ama_anker.png`
```
Create ONE image: canvas exactly 1024 x 1024 pixels, 16-bit JRPG pixel-art in the style of RPG Maker MV and classic Fire Emblem sprites (match the attached reference images exactly in pixel size, outline, palette saturation and level of detail; do NOT copy their clothing). One standing Amazon recruit (Virgo Amazon), three-quarter top-down view from about 30 degrees above, facing the viewer, on one flat solid magenta #FF00FF background without gradient, floor or ground shadow. She wears: bare head with a long red braid over one shoulder and a thin green headband, face clearly visible (light skin, freckles, clear green eyes, a bold look); a short plain cream leather tunic leaving one shoulder bare, with a green hem; a short bright green cloak pinned at the other shoulder; a brown leather belt; bare knees; brown leather boots with straps; NO armour and NO helmet. In her left hand a small crescent-shaped shield (pelta) painted saturated green with a yellow crescent emblem; in her right hand a plain wooden spear with a short silver-grey leaf-shaped head. Chunky visible pixels, at most 24 colours, one dark-brown 1-pixel outline, flat cel-shading with at most two tones per colour, chibi proportions (head about one third of body height). The figure is at most 56 of 64 pixel blocks tall with at least 4 blocks of magenta margin. NO TEXT of any kind. AVOID: text, labels, logos, watermark, frame, border, second figure, realistic or painterly shading, blurry or anti-aliased edges, gradients, ground shadow, floor, magenta inside the figure.
```

## Sjabloon blad A
```
Use the attached images as the exact reference. The FIRST image is the Amazon anchor (style, palette, outline, proportions and level of detail). {{SECOND}}

Create ONE sprite sheet: canvas exactly 1536 x 1024 pixels, 16-bit JRPG pixel-art in the style of RPG Maker MV and classic Fire Emblem sprites. Layout: 3 columns by 2 rows of INVISIBLE cells, each cell exactly 512 x 512 pixels, the SAME character in all six cells. Background: one flat solid magenta #FF00FF, no gradient, no floor, no shadow on the ground. No magenta anywhere in the figure. IMPORTANT: the image contains NO TEXT of any kind: no labels, no captions, no pose names, no titles, no numbers and no letters anywhere, neither inside nor outside the cells.

CHARACTER: "{{NAME}}", Amazon unit (tier {{TIER}}, branch {{BRANCH}}, role {{ROLE}}). {{OUTFIT}}

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

Style reference: match the attached reference sheet exactly in palette and shading. Use bright, saturated colours with strong contrast: metal helmets shiny GOLD (not brown), shields saturated green with a yellow crescent emblem, scale armour and blades light SILVER-GREY. Skin and face must stay clearly readable when the sprite is shrunk to 48 pixels (clear dark eyes, light skin tone, mouth visible). Canvas exactly as stated. Do NOT draw any grid lines, borders or separators between the cells; the cells are only an invisible layout.

AVOID: NO TEXT OF ANY KIND (no labels, captions, pose names, titles, numbers or letters above, below or next to the figures); no logos or watermark; no frame, border, grid lines or separator lines drawn between the cells; no second figure; no change of clothing or colours between poses; no difference in scale between cells; no realistic or painterly shading; no blurry or anti-aliased edges; no gradients; no shadow on the ground; no floor; no magenta inside the figure.
```

## Sjabloon blad B
```
Use the attached images as reference. The FIRST image (the six-cell sprite sheet of {{NAME}}) shows THE SAME character to be redrawn: use it ONLY for the character's appearance and do NOT copy its six-cell layout. The SECOND image (the finished 3-cell sheet of the recruit {{FMT}}: portrait, battle front, battle back) shows the exact FORMAT, style, palette, outline, proportions and level of detail to follow (do NOT copy its clothing). Your output must have the same layout as the second image: ONE row of exactly three cells, never two rows and never six cells.

Create ONE sheet: canvas exactly 1536 x 512 pixels, 16-bit JRPG pixel-art in the style of RPG Maker MV and classic Fire Emblem sprites. Layout: ONE single row of exactly 3 INVISIBLE cells side by side (NOT six cells, NOT two rows), each exactly 512 x 512 pixels, the SAME character in all three. Background: one flat solid magenta #FF00FF, no gradient, no floor, no shadow on the ground. No magenta anywhere in the figure. IMPORTANT: the image contains NO TEXT of any kind: no labels, no captions, no pose names, no titles, no numbers and no letters anywhere, neither inside nor outside the cells.

CHARACTER: "{{NAME}}", Amazon unit (tier {{TIER}}, branch {{BRANCH}}, role {{ROLE}}). {{OUTFIT}}

STYLE: chunky visible pixels, at most 24 colours, one dark-brown 1-pixel outline around the whole figure, flat cel-shading with at most two tones per colour, warm saturated fantasy colours, small chibi proportions (head about one third of body height), easy to read at small size.

PIXEL GRID: every cell is its own 64 x 64 pixel grid; every pixel is a block of 8 x 8 image pixels and all pixels in the whole image are exactly the same size. In cells 2 and 3 the figure is at most 56 of the 64 pixels tall with at least 4 blocks of empty magenta margin all around, feet on the same horizontal line in both cells, same size in both cells.

CELLS:
Cell 1, a bust portrait: bust, three-quarter view, looking slightly to the right of the image, a stern but friendly look, more detail in the face than in the sprites; the figure fills about 60 percent of the cell. {{PORT}}
Cell 2, full body seen from the front: full body, ready for battle, straight from the front at eye level, face towards the viewer. {{FRONT}}
Cell 3, full body seen from behind: the same body exactly from behind, with a slight angle from above. {{BACK}}

CONSISTENCY: the equipment stays the same in ALL cells and every part of the figure, including weapons, tools and banners, stays completely inside its own cell, at least 4 pixel blocks from the cell edges, never touching a neighbouring cell. Shield shape and emblem never change between cells.

Style reference: match the attached reference sheet exactly in palette and shading. Use bright, saturated colours with strong contrast: metal helmets shiny GOLD (not brown), shields saturated green with a yellow crescent emblem, scale armour and blades light SILVER-GREY. Skin and face must stay clearly readable when the sprite is shrunk to 48 pixels (clear dark eyes, light skin tone, mouth visible). Canvas exactly as stated. Do NOT draw any grid lines, borders or separators between the cells; the cells are only an invisible layout.

AVOID: NO TEXT OF ANY KIND (no labels, captions, pose names, titles, numbers or letters above, below or next to the figures); no logos or watermark; no frame, border, grid lines or separator lines drawn between the cells; no second figure; no change of clothing or colours between cells; no difference in scale between cells 2 and 3; no realistic or painterly shading; no blurry or anti-aliased edges; no gradients; no shadow on the ground; no floor; no magenta inside the figure.
```

## ama_virgoamazon | Virgo Amazon | tier 1 | Recruit | ouder: -

- Blad A, bijlagen: `ama_anker.png` en `rom_tiro_A.png`
- SECOND: The SECOND image is the finished Roman recruit sheet (Tiro): use it ONLY for the sheet format, the pixel size and the pose layout; do NOT copy its clothing, shield or face.
- NAME: Virgo Amazon; TIER: 1; BRANCH: Recruit; ROLE: recruit
- OUTFIT: She is a young Amazon recruit, the simplest unit. She wears: bare head with a long red braid over one shoulder and a thin green headband, face clearly visible (light skin, freckles, clear green eyes, a bold look); a short plain cream leather tunic leaving one shoulder bare, with a green hem; a short bright green cloak pinned at the other shoulder; a brown leather belt; bare knees; brown leather boots with straps; NO armour and NO helmet. In her left hand a small crescent-shaped shield (pelta) painted saturated green with a yellow crescent emblem. In her right hand a plain wooden spear with a short silver-grey leaf-shaped head.
- REST: standing relaxed, facing the viewer, the spear held upright beside her body, the shield at her side
- ATTACK: one step forward, the spear thrust forward, the shield raised in front of her chest
- HIT: upper body leaning backwards, eyes closed, the shield sagging, the spear tilting
- PORT: Show the long red braid, the green headband, the freckles and the green cloak pinned at the shoulder.
- FRONT: Spear held ready in the right hand, small green crescent shield raised on the left arm.
- BACK: Show the long red braid, the green cloak, the leather tunic and the back of the crescent shield.

## ama_sagittaria | Sagittaria | tier 2 | Ranged | ouder: Virgo Amazon

- Blad A, bijlagen: `ama_anker.png` en `ama_virgoamazon_A.png`
- SECOND: The SECOND image is the finished sheet of the parent form (Virgo Amazon): this unit is the next step of the SAME Amazon line, so keep the same saturated green, the same light skin with a long red braid, the same short leather tunic and the same yellow crescent emblem, but richer and with the new equipment described below.
- NAME: Sagittaria; TIER: 2; BRANCH: Ranged; ROLE: ranged, archer
- OUTFIT: She wears: a soft pointed Phrygian cap in saturated green with a yellow band, a long red braid hanging down, face clearly visible (light skin, freckles, clear green eyes, a focused look); a short fitted brown leather tunic with green trim; tight green trousers tucked into brown leather boots; a green sash; a leather wristguard; NO armour and NO shield. In her left hand a curved composite bow in dark wood with yellow tips; a brown leather quiver with green-feathered arrows on her back.
- REST: standing relaxed, facing the viewer, the composite bow held loosely, light on her feet
- ATTACK: firing or throwing pose: leaning back then forward, the composite bow aimed forward with the free arm stretched forward
- HIT: upper body leaning backwards, eyes closed, the composite bow dropping, hand raised
- PORT: Show the green Phrygian cap, the long red braid and the freckles.
- FRONT: Composite bow held in the left hand, an arrow ready in the right hand, the quiver visible over her shoulder.
- BACK: Show the long red braid, the green sash, the quiver with the green-feathered arrows and the bow.

## ama_sagittariaequest | Sagittaria equestris | tier 3 | Ranged | ouder: Sagittaria

- Blad A, bijlagen: `ama_anker.png` en `ama_sagittaria_A.png`
- SECOND: The SECOND image is the finished sheet of the parent form (Sagittaria): this unit is the next step of the SAME Amazon line, so keep the same saturated green, the same light skin with a long red braid, the same short leather tunic and the same yellow crescent emblem, but richer and with the new equipment described below.
- NAME: Sagittaria equestris; TIER: 3; BRANCH: Ranged; ROLE: cavalry, horse archer
- OUTFIT: The unit is the horse and its rider together as ONE whole in the cell: a lean chestnut horse with a green saddle-cloth with a yellow crescent and a light brown leather harness with green tassels. The rider wears: a shiny GOLD Phrygian-style cap with a green plume and a long red braid hanging down, face clearly visible (light skin, freckles, clear green eyes, a fierce look); a fitted brown leather tunic with gold studs and green trim; tight green trousers tucked into brown boots; a short green cloak streaming behind; gold bracers; NO shield. In her left hand a large curved composite bow with gold tips; in her right hand an arrow ready to fire; a quiver with green-feathered arrows at her hip. The whole horse and rider fit inside the 56-pixel limit and the margins.
- REST: sitting on the standing horse, facing the viewer, the bow held at her side
- ATTACK: the horse taking one step forward, the rider drawing the bow and aiming forward
- HIT: the horse shying back, the rider leaning backwards with eyes closed, the bow sagging
- PORT: Show the gold cap with the green plume, the long red braid, the freckles and the bow.
- FRONT: The chestnut horse with its rider seen from the front, the rider holding the bow with an arrow.
- BACK: Show the back of the horse with the green saddle-cloth, the long red braid, the streaming green cloak and the quiver.

## ama_peltastaamazon | Peltasta Amazon | tier 2 | Infantry | ouder: Virgo Amazon

- Blad A, bijlagen: `ama_anker.png` en `ama_virgoamazon_A.png`
- SECOND: The SECOND image is the finished sheet of the parent form (Virgo Amazon): this unit is the next step of the SAME Amazon line, so keep the same saturated green, the same light skin with a long red braid, the same short leather tunic and the same yellow crescent emblem, but richer and with the new equipment described below.
- NAME: Peltasta Amazon; TIER: 2; BRANCH: Infantry; ROLE: ranged, javelin thrower
- OUTFIT: She wears: a shiny GOLD open helmet with a short green plume and a long red braid hanging out at the back, face open and clearly visible (light skin, freckles, clear green eyes, a bold look); a short fitted brown leather tunic with a green hem, leaving one shoulder bare; a short green cloak; a brown belt with a gold buckle; brown leather boots with straps and light shiny GOLD greaves. In her left hand a crescent-shaped shield (pelta) painted saturated green with a yellow crescent and a gold rim. In her right hand a light javelin with a silver head; two more javelins in a bundle on her back.
- REST: standing relaxed, facing the viewer, the javelin held upright beside her body, the shield at her side
- ATTACK: one step forward, the javelin thrust forward, the shield raised in front of her chest
- HIT: upper body leaning backwards, eyes closed, the shield sagging, the javelin tilting
- PORT: Show the gold open helmet with the green plume, the long red braid and the freckles.
- FRONT: Green crescent shield on the left arm, javelin raised in the right hand.
- BACK: Show the long red braid, the green cloak, the bundle of javelins and the back of the crescent shield.

## ama_securifera | Securifera | tier 3 | Infantry | ouder: Peltasta Amazon

- Blad A, bijlagen: `ama_anker.png` en `ama_peltastaamazon_A.png`
- SECOND: The SECOND image is the finished sheet of the parent form (Peltasta Amazon): this unit is the next step of the SAME Amazon line, so keep the same saturated green, the same light skin with a long red braid, the same short leather tunic and the same yellow crescent emblem, but richer and with the new equipment described below.
- NAME: Securifera; TIER: 3; BRANCH: Infantry; ROLE: infantry (axe-bearer)
- OUTFIT: She is an axe-bearer. She wears: a shiny GOLD helmet with a tall green crest and gold cheek guards, a long red braid hanging out at the back, face open and clearly visible (light skin, freckles, clear green eyes, a fierce look); a fitted SILVER-GREY scale cuirass with gold edges over a brown leather tunic with a green skirt of leather strips, leaving one shoulder armoured with a gold shoulder plate; a long bright green cloak with a gold brooch; a brown belt with a gold buckle; shiny GOLD greaves; brown leather boots. In her left hand a crescent-shaped shield (pelta) painted saturated green with a big yellow crescent and a wide gold rim. In her right hand a COMPACT double-headed battle axe with a short wooden shaft and two silver blades, both blades clearly visible and small enough to stay within about 20 pixel blocks of her body.
- REST: standing relaxed, facing the viewer, the double-headed axe held upright beside her body, the shield at her side
- ATTACK: one step forward, the double-headed axe thrust forward, the shield raised in front of her chest
- HIT: upper body leaning backwards, eyes closed, the shield sagging, the double-headed axe tilting
- PORT: Show the gold helmet with the tall green crest, the long red braid, the freckles and the gold shoulder plate.
- FRONT: Green crescent shield on the left arm, compact double-headed axe held ready in the right hand, both blades visible.
- BACK: Show the long red braid, the long green cloak, the back of the crescent shield and the compact double-headed axe.

