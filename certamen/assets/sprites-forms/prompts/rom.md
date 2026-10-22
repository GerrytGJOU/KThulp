# Beeldprompts Romeinen (volkscode rom)

Accentkleur cape: rood. Anker: `rom_anker.png` (bestaat al, een Hastatus).
Let op blad B: upload bij elke B (behalve rom_tiro_B zelf) het blad A van dezelfde vorm plus `rom_tiro_B.png` als formaatvoorbeeld, niet het anker (anders maakt het model zes cellen i.p.v. drie). Maak dus eerst `rom_tiro_B.png`.
Werkwijze: open per prompt een nieuw gesprek in het beeldmodel, upload de genoemde bestanden, plak het prompt.
Status: alle 24 Romeinse vormen geschreven (sinds 2026-10-22 alles ChatGPT Plus; de eerste 10 vormen zijn met Gemini gemaakt). Herkansingen Optio A, Centurio A, Signifer A en B, Aquilifer A. Snijd zonder --boost.

---

## rom_tiro | Tiro | tier 1 | rekruut

Ontwerp: kale rekruut zonder helm en zonder pantser. Eenvoudige rode tuniek met korte mouwen, korte rode cape, bruine leren riem met een kleine bronzen gesp, bruine sandalen met riempjes, klein rond rood houten schild met gele bliksemflits, een houten oefenzwaard (rudis). Zelfde lichte huid en korte zwarte haren als het anker, zodat hij herkenbaar de eerste stap van de Hastatus-lijn is.

GEBRUIK: ChatGPT | UPLOAD: rom_anker.png | OPSLAAN ALS: rom_tiro_A.png

```
Use the attached image as the exact reference for style, palette, outline, proportions and level of detail. The character is a DIFFERENT unit of the same folk, as described below.

Create ONE sprite sheet: canvas exactly 1536 x 1024 pixels, 16-bit JRPG pixel-art in the style of RPG Maker MV and classic Fire Emblem sprites. Layout: 3 columns by 2 rows of INVISIBLE cells, each cell exactly 512 x 512 pixels, the SAME character in all six cells. Background: one flat solid magenta #FF00FF, no gradient, no floor, no shadow on the ground. No magenta anywhere in the figure. IMPORTANT: the image contains NO TEXT of any kind: no labels, no captions, no pose names, no titles, no numbers and no letters anywhere, neither inside nor outside the cells.

CHARACTER: "Tiro", a young Roman recruit (tier 1, the simplest unit of the Roman folk). He wears: NO helmet, bare head with short black hair and a clearly visible light-skinned face with clear dark eyes and a visible mouth; a plain bright red short-sleeved tunic reaching the thighs; a short bright red cape on the shoulders; a brown leather belt with a small bronze buckle; bare knees; brown leather sandals with straps; NO armour and NO mail. In his left hand a small ROUND wooden shield painted saturated red with a yellow lightning-bolt emblem and a thin gold rim. In his right hand a plain light-brown wooden training sword (a rudis), no metal blade. Simple, humble equipment.

STYLE: chunky visible pixels, at most 24 colours, one dark-brown 1-pixel outline around the whole figure, flat cel-shading with at most two tones per colour, warm saturated fantasy colours, small chibi proportions (head about one third of body height), easy to read at small size.

PIXEL GRID: every cell is its own 64 x 64 pixel grid; every pixel is a block of 8 x 8 image pixels and all pixels in the whole image are exactly the same size. The figure is at most 56 of the 64 pixels tall with at least 4 blocks of empty magenta margin all around. Feet on the same horizontal line in every cell. The figure has the same size in every cell.

CAMERA: three-quarter top-down view (about 30 degrees above the figure, slightly in front of him), unless a pose says otherwise. Express viewing direction by camera position ("seen from behind", "facing the viewer"), not by left or right of the figure.

POSES, in this fixed order:
Row 1, cell 1, resting pose: standing relaxed, facing the viewer, shield held low at his side, wooden sword hanging.
Row 1, cell 2, attacking pose: one step forward, wooden sword thrust forward, shield raised in front of his chest.
Row 1, cell 3, getting-hit pose: upper body leaning backwards, eyes closed, free hand raised or shield sagging.
Row 2, cell 1, walking-towards-the-camera pose: walking towards the camera, face and chest clearly visible.
Row 2, cell 2, walking-sideways pose: walking to the RIGHT of the image, pure side view in profile, shield on the far side of the body.
Row 2, cell 3, walking-away pose: walking away from the camera, back, red cape and the back of the shield visible.

Style reference: match the attached reference sheet exactly in palette and shading. Use bright, saturated colours with strong contrast: metal helmets shiny GOLD (not brown), shields saturated in the folk colour with a yellow emblem, mail light SILVER-GREY. Skin and face must stay clearly readable when the sprite is shrunk to 48 pixels (clear dark eyes, light skin tone, mouth visible). Canvas exactly as stated. Do NOT draw any grid lines, borders or separators between the cells; the cells are only an invisible layout.

AVOID: NO TEXT OF ANY KIND (no labels, captions, pose names, titles, numbers or letters above, below or next to the figures); no logos or watermark; no frame, border, grid lines or separator lines drawn between the cells; no second figure; no change of clothing or colours between poses; no difference in scale between cells; no realistic or painterly shading; no blurry or anti-aliased edges; no gradients; no shadow on the ground; no floor; no magenta inside the figure.
```

GEBRUIK: ChatGPT | UPLOAD: rom_tiro_A.png en rom_anker.png | OPSLAAN ALS: rom_tiro_B.png

```
Use the attached images as the exact reference: the first (sprite sheet of Tiro) shows THE SAME character to be redrawn; the second (the Roman anchor) shows the style, palette, outline, proportions and level of detail. The character is a DIFFERENT unit than the anchor but the same folk, as described below.

Create ONE sheet: canvas exactly 1536 x 512 pixels, 16-bit JRPG pixel-art in the style of RPG Maker MV and classic Fire Emblem sprites. Layout: ONE single row of exactly 3 INVISIBLE cells side by side (NOT six cells, NOT two rows), each exactly 512 x 512 pixels, the SAME character in all three. Background: one flat solid magenta #FF00FF, no gradient, no floor, no shadow on the ground. No magenta anywhere in the figure. IMPORTANT: the image contains NO TEXT of any kind: no labels, no captions, no pose names, no titles, no numbers and no letters anywhere, neither inside nor outside the cells.

CHARACTER: "Tiro", a young Roman recruit (tier 1). He wears: NO helmet, bare head with short black hair and a clearly visible light-skinned face with clear dark eyes and a visible mouth; a plain bright red short-sleeved tunic reaching the thighs; a short bright red cape on the shoulders; a brown leather belt with a small bronze buckle; bare knees; brown leather sandals with straps; NO armour and NO mail. In his left hand a small ROUND wooden shield painted saturated red with a yellow lightning-bolt emblem and a thin gold rim. In his right hand a plain light-brown wooden training sword (a rudis), no metal blade.

STYLE: chunky visible pixels, at most 24 colours, one dark-brown 1-pixel outline around the whole figure, flat cel-shading with at most two tones per colour, warm saturated fantasy colours, small chibi proportions (head about one third of body height).

PIXEL GRID: every cell is its own 64 x 64 pixel grid; every pixel is a block of 8 x 8 image pixels and all pixels in the whole image are exactly the same size. In cells 2 and 3 the figure is at most 56 of the 64 pixels tall with at least 4 blocks of empty magenta margin all around, feet on the same horizontal line in both cells, same size in both cells.

CELLS:
Cell 1, a bust portrait: bust, three-quarter view, looking slightly to the right of the image, a stern but friendly look, more detail in the face than in the sprites; the figure fills about 60 percent of the cell. Show the red tunic collar, the red cape and the short black hair.
Cell 2, full body seen from the front: full body, ready for battle, straight from the front at eye level, face towards the viewer, shield raised, wooden sword held ready.
Cell 3, full body seen from behind: the same body exactly from behind, with a slight angle from above; back, red cape and the back of the shield and the sword visible.

Style reference: match the attached reference sheet exactly in palette and shading. Use bright, saturated colours with strong contrast: metal helmets shiny GOLD (not brown), shields saturated in the folk colour with a yellow emblem, mail light SILVER-GREY. Skin and face must stay clearly readable when the sprite is shrunk to 48 pixels (clear dark eyes, light skin tone, mouth visible). Canvas exactly as stated. Do NOT draw any grid lines, borders or separators between the cells; the cells are only an invisible layout.

AVOID: NO TEXT OF ANY KIND (no labels, captions, pose names, titles, numbers or letters above, below or next to the figures); no logos or watermark; no frame, border, grid lines or separator lines drawn between the cells; no second figure; no change of clothing or colours between cells; no difference in scale between cells 2 and 3; no realistic or painterly shading; no blurry or anti-aliased edges; no gradients; no shadow on the ground; no floor; no magenta inside the figure.
```

---

## rom_hastatus | Hastatus | tier 2 | infantry

Ontwerp: de maatstaf: precies het ChatGPT-anker (gouden helm met rode kam, lichtzilvergrijs malienhemd, groot rood scutum met bliksemflits, gladius).

GEBRUIK: ChatGPT | UPLOAD: alleen rom_anker.png (niet rom_tiro_A.png, die heeft een ovaal schild) | OPSLAAN ALS: rom_hastatus_A.png

```
Use the attached image as the exact reference for style, palette, outline, proportions and level of detail. It shows the Roman Hastatus; draw the SAME unit as a six-pose sprite sheet, as described below.

Create ONE sprite sheet: canvas exactly 1536 x 1024 pixels, 16-bit JRPG pixel-art in the style of RPG Maker MV and classic Fire Emblem sprites. Layout: 3 columns by 2 rows of INVISIBLE cells, each cell exactly 512 x 512 pixels, the SAME character in all six cells. Background: one flat solid magenta #FF00FF, no gradient, no floor, no shadow on the ground. No magenta anywhere in the figure. IMPORTANT: the image contains NO TEXT of any kind: no labels, no captions, no pose names, no titles, no numbers and no letters anywhere, neither inside nor outside the cells.

CHARACTER: "Hastatus", Roman unit (tier 2, branch Infantry, role infantry). He wears: a shiny GOLD helmet with a tall bright red crest and gold cheek guards, face open and clearly visible (light skin, short black hair, clear dark eyes); a LIGHT SILVER-GREY mail shirt over a bright red tunic whose short red sleeves show at the upper arms; a short bright red cape; a brown leather belt with a bronze buckle; bare knees; brown leather sandals with straps. In his left hand a large rectangular curved scutum shield painted saturated red with a yellow lightning-bolt emblem, a gold rim and a gold central boss. In his right hand a short straight iron sword (gladius) with a silver blade and a gold pommel.

STYLE: chunky visible pixels, at most 24 colours, one dark-brown 1-pixel outline around the whole figure, flat cel-shading with at most two tones per colour, warm saturated fantasy colours, small chibi proportions (head about one third of body height), easy to read at small size.

PIXEL GRID: every cell is its own 64 x 64 pixel grid; every pixel is a block of 8 x 8 image pixels and all pixels in the whole image are exactly the same size. The figure is at most 56 of the 64 pixels tall with at least 4 blocks of empty magenta margin all around. Feet on the same horizontal line in every cell. The figure has the same size in every cell.

CAMERA: three-quarter top-down view (about 30 degrees above the figure, slightly in front of him), unless a pose says otherwise. Express viewing direction by camera position ("seen from behind", "facing the viewer"), not by left or right of the figure.

POSES, in this fixed order:
Row 1, cell 1, resting pose: standing relaxed, facing the viewer, shield held at his side, gladius pointing down.
Row 1, cell 2, attacking pose: one step forward, gladius thrust forward, shield raised in front of his body.
Row 1, cell 3, getting-hit pose: upper body leaning backwards, eyes closed, shield sagging downwards.
Row 2, cell 1, walking-towards-the-camera pose: walking towards the camera, face and chest clearly visible, carrying the same equipment.
Row 2, cell 2, walking-sideways pose: walking to the RIGHT of the image, pure side view in profile, the scutum on the far side of the body, seen edge-on as a narrow curved vertical panel.
Row 2, cell 3, walking-away pose: walking away from the camera, back, cape and the back of the scutum visible as a tall curved rectangle.

CONSISTENCY: the shield is the large RECTANGULAR curved scutum in ALL six cells, in every pose, exactly as in the attached image: saturated red, one single jagged yellow lightning bolt as emblem (NOT a sun, NOT rays, NOT a starburst), gold rim and a gold round boss. NEVER draw a round or oval shield. The gladius stays in his right hand. Everything stays completely inside its own cell.

Style reference: match the attached reference sheet exactly in palette and shading. Use bright, saturated colours with strong contrast: metal helmets shiny GOLD (not brown), shields saturated in the folk colour with a yellow emblem, mail light SILVER-GREY. Skin and face must stay clearly readable when the sprite is shrunk to 48 pixels (clear dark eyes, light skin tone, mouth visible). Canvas exactly as stated. Do NOT draw any grid lines, borders or separators between the cells; the cells are only an invisible layout.

AVOID: NO TEXT OF ANY KIND (no labels, captions, pose names, titles, numbers or letters above, below or next to the figures); no logos or watermark; no frame, border, grid lines or separator lines drawn between the cells; no second figure; no change of clothing or colours between poses; no difference in scale between cells; no realistic or painterly shading; no blurry or anti-aliased edges; no gradients; no shadow on the ground; no floor; no magenta inside the figure.
```

GEBRUIK: ChatGPT | UPLOAD: rom_hastatus_A.png en rom_tiro_B.png (in die volgorde) | OPSLAAN ALS: rom_hastatus_B.png

```
Use the attached images as reference. The FIRST image (the six-cell sprite sheet of Hastatus) shows THE SAME character to be redrawn: use it ONLY for the character's appearance and do NOT copy its six-cell layout. The SECOND image (the finished 3-cell sheet of the Roman recruit Tiro: portrait, battle front, battle back) shows the exact FORMAT, style, palette, outline, proportions and level of detail to follow. Your output must have the same layout as the second image: ONE row of exactly three cells, never two rows and never six cells.

Create ONE sheet: canvas exactly 1536 x 512 pixels, 16-bit JRPG pixel-art in the style of RPG Maker MV and classic Fire Emblem sprites. Layout: ONE single row of exactly 3 INVISIBLE cells side by side (NOT six cells, NOT two rows), each exactly 512 x 512 pixels, the SAME character in all three. Background: one flat solid magenta #FF00FF, no gradient, no floor, no shadow on the ground. No magenta anywhere in the figure. IMPORTANT: the image contains NO TEXT of any kind: no labels, no captions, no pose names, no titles, no numbers and no letters anywhere, neither inside nor outside the cells.

CHARACTER: "Hastatus", Roman unit (tier 2, branch Infantry, role infantry). He wears: a shiny GOLD helmet with a tall bright red crest and gold cheek guards, face open and clearly visible (light skin, short black hair, clear dark eyes); a LIGHT SILVER-GREY mail shirt over a bright red tunic whose short red sleeves show at the upper arms; a short bright red cape; a brown leather belt with a bronze buckle; bare knees; brown leather sandals with straps. In his left hand a large rectangular curved scutum shield painted saturated red with a yellow lightning-bolt emblem, a gold rim and a gold central boss. In his right hand a short straight iron sword (gladius) with a silver blade and a gold pommel.

STYLE: chunky visible pixels, at most 24 colours, one dark-brown 1-pixel outline around the whole figure, flat cel-shading with at most two tones per colour, warm saturated fantasy colours, small chibi proportions (head about one third of body height), easy to read at small size.

PIXEL GRID: every cell is its own 64 x 64 pixel grid; every pixel is a block of 8 x 8 image pixels and all pixels in the whole image are exactly the same size. In cells 2 and 3 the figure is at most 56 of the 64 pixels tall with at least 4 blocks of empty magenta margin all around, feet on the same horizontal line in both cells, same size in both cells.

CELLS:
Cell 1, a bust portrait: bust, three-quarter view, looking slightly to the right of the image, a stern but friendly look, more detail in the face than in the sprites; the figure fills about 60 percent of the cell. Show the gold helmet with red crest, the silver mail collar and the red cape.
Cell 2, full body seen from the front: full body, ready for battle, straight from the front at eye level, face towards the viewer. Shield raised, gladius held ready in the right hand.
Cell 3, full body seen from behind: the same body exactly from behind, with a slight angle from above. Show the back of the scutum on his arm, the red cape, the gold helmet with its crest and the gladius at his side.

Style reference: match the attached reference sheet exactly in palette and shading. Use bright, saturated colours with strong contrast: metal helmets shiny GOLD (not brown), shields saturated in the folk colour with a yellow emblem, mail light SILVER-GREY. Skin and face must stay clearly readable when the sprite is shrunk to 48 pixels (clear dark eyes, light skin tone, mouth visible). Canvas exactly as stated. Do NOT draw any grid lines, borders or separators between the cells; the cells are only an invisible layout.

AVOID: NO TEXT OF ANY KIND (no labels, captions, pose names, titles, numbers or letters above, below or next to the figures); no logos or watermark; no frame, border, grid lines or separator lines drawn between the cells; no second figure; no change of clothing or colours between cells; no difference in scale between cells 2 and 3; no realistic or painterly shading; no blurry or anti-aliased edges; no gradients; no shadow on the ground; no floor; no magenta inside the figure.
```

---

## rom_princeps | Princeps | tier 3 | infantry

Ontwerp: zelfde lijn als Hastatus, maar rijker en met een zware werpspeer (pilum): twee rode veren aan de helm, gouden schouderversieringen, gouden scheenplaten, langere cape. Silhouet: breed schild plus lange, schuin gehouden speer.

GEBRUIK: ChatGPT | UPLOAD: rom_anker.png en rom_hastatus_A.png (in die volgorde) | OPSLAAN ALS: rom_princeps_A.png

```
Use the attached images as the exact reference. The FIRST image is the Roman anchor (style, palette, outline, proportions and level of detail). The SECOND image is the sheet of the previous unit in the same line (Hastatus): the new unit is a DIFFERENT unit of the same folk and the same line, with the same colours and base design but richer or different as described below.

Create ONE sprite sheet: canvas exactly 1536 x 1024 pixels, 16-bit JRPG pixel-art in the style of RPG Maker MV and classic Fire Emblem sprites. Layout: 3 columns by 2 rows of INVISIBLE cells, each cell exactly 512 x 512 pixels, the SAME character in all six cells. Background: one flat solid magenta #FF00FF, no gradient, no floor, no shadow on the ground. No magenta anywhere in the figure. IMPORTANT: the image contains NO TEXT of any kind: no labels, no captions, no pose names, no titles, no numbers and no letters anywhere, neither inside nor outside the cells.

CHARACTER: "Princeps", Roman unit (tier 3, branch Infantry, role infantry). He wears: a shiny GOLD helmet with a taller bright red crest and two upright red feathers at the sides, gold cheek guards, face open and clearly visible (light skin, short black hair, clear dark eyes); a LIGHT SILVER-GREY mail shirt with gold-edged shoulder doublings over a bright red tunic with short red sleeves; a medium-long bright red cape down to the knees; a brown leather belt with a gold buckle; shiny GOLD greaves on both shins; brown leather sandals with straps. In his left hand a large rectangular curved scutum shield painted saturated red with a yellow lightning-bolt emblem, a gold rim and a gold central boss, slightly larger and with a wider gold rim than the Hastatus. In his right hand a long wooden pilum (heavy javelin) with a silver iron head, held diagonally ready to throw. A gladius in a brown scabbard at his left hip.

STYLE: chunky visible pixels, at most 24 colours, one dark-brown 1-pixel outline around the whole figure, flat cel-shading with at most two tones per colour, warm saturated fantasy colours, small chibi proportions (head about one third of body height), easy to read at small size.

PIXEL GRID: every cell is its own 64 x 64 pixel grid; every pixel is a block of 8 x 8 image pixels and all pixels in the whole image are exactly the same size. The figure is at most 56 of the 64 pixels tall with at least 4 blocks of empty magenta margin all around. Feet on the same horizontal line in every cell. The figure has the same size in every cell.

CAMERA: three-quarter top-down view (about 30 degrees above the figure, slightly in front of him), unless a pose says otherwise. Express viewing direction by camera position ("seen from behind", "facing the viewer"), not by left or right of the figure.

POSES, in this fixed order:
Row 1, cell 1, resting pose: standing relaxed, facing the viewer, shield at his side, pilum resting diagonally against his shoulder.
Row 1, cell 2, attacking pose: one step forward, the pilum thrust forward at shoulder height, shield raised in front of his chest.
Row 1, cell 3, getting-hit pose: upper body leaning backwards, eyes closed, shield sagging, pilum tilting.
Row 2, cell 1, walking-towards-the-camera pose: walking towards the camera, face and chest clearly visible, carrying the same equipment.
Row 2, cell 2, walking-sideways pose: walking to the RIGHT of the image, pure side view in profile, the shield or main item on the far side of the body.
Row 2, cell 3, walking-away pose: walking away from the camera, back, cape and the back of the equipment visible.

Style reference: match the attached reference sheet exactly in palette and shading. Use bright, saturated colours with strong contrast: metal helmets shiny GOLD (not brown), shields saturated in the folk colour with a yellow emblem, mail light SILVER-GREY. Skin and face must stay clearly readable when the sprite is shrunk to 48 pixels (clear dark eyes, light skin tone, mouth visible). Canvas exactly as stated. Do NOT draw any grid lines, borders or separators between the cells; the cells are only an invisible layout.

AVOID: NO TEXT OF ANY KIND (no labels, captions, pose names, titles, numbers or letters above, below or next to the figures); no logos or watermark; no frame, border, grid lines or separator lines drawn between the cells; no second figure; no change of clothing or colours between poses; no difference in scale between cells; no realistic or painterly shading; no blurry or anti-aliased edges; no gradients; no shadow on the ground; no floor; no magenta inside the figure.
```

GEBRUIK: ChatGPT | UPLOAD: rom_princeps_A.png en rom_tiro_B.png (in die volgorde) | OPSLAAN ALS: rom_princeps_B.png

```
Use the attached images as reference. The FIRST image (the six-cell sprite sheet of Princeps) shows THE SAME character to be redrawn: use it ONLY for the character's appearance and do NOT copy its six-cell layout. The SECOND image (the finished 3-cell sheet of the Roman recruit Tiro: portrait, battle front, battle back) shows the exact FORMAT, style, palette, outline, proportions and level of detail to follow. Your output must have the same layout as the second image: ONE row of exactly three cells, never two rows and never six cells.

Create ONE sheet: canvas exactly 1536 x 512 pixels, 16-bit JRPG pixel-art in the style of RPG Maker MV and classic Fire Emblem sprites. Layout: ONE single row of exactly 3 INVISIBLE cells side by side (NOT six cells, NOT two rows), each exactly 512 x 512 pixels, the SAME character in all three. Background: one flat solid magenta #FF00FF, no gradient, no floor, no shadow on the ground. No magenta anywhere in the figure. IMPORTANT: the image contains NO TEXT of any kind: no labels, no captions, no pose names, no titles, no numbers and no letters anywhere, neither inside nor outside the cells.

CHARACTER: "Princeps", Roman unit (tier 3, branch Infantry, role infantry). He wears: a shiny GOLD helmet with a taller bright red crest and two upright red feathers at the sides, gold cheek guards, face open and clearly visible (light skin, short black hair, clear dark eyes); a LIGHT SILVER-GREY mail shirt with gold-edged shoulder doublings over a bright red tunic with short red sleeves; a medium-long bright red cape down to the knees; a brown leather belt with a gold buckle; shiny GOLD greaves on both shins; brown leather sandals with straps. In his left hand a large rectangular curved scutum shield painted saturated red with a yellow lightning-bolt emblem, a gold rim and a gold central boss, slightly larger and with a wider gold rim than the Hastatus. In his right hand a long wooden pilum (heavy javelin) with a silver iron head, held diagonally ready to throw. A gladius in a brown scabbard at his left hip.

STYLE: chunky visible pixels, at most 24 colours, one dark-brown 1-pixel outline around the whole figure, flat cel-shading with at most two tones per colour, warm saturated fantasy colours, small chibi proportions (head about one third of body height), easy to read at small size.

PIXEL GRID: every cell is its own 64 x 64 pixel grid; every pixel is a block of 8 x 8 image pixels and all pixels in the whole image are exactly the same size. In cells 2 and 3 the figure is at most 56 of the 64 pixels tall with at least 4 blocks of empty magenta margin all around, feet on the same horizontal line in both cells, same size in both cells.

CELLS:
Cell 1, a bust portrait: bust, three-quarter view, looking slightly to the right of the image, a stern but friendly look, more detail in the face than in the sprites; the figure fills about 60 percent of the cell. Show the gold helmet with the two red feathers, the gold shoulder doublings and the red cape.
Cell 2, full body seen from the front: full body, ready for battle, straight from the front at eye level, face towards the viewer. Shield raised in the left hand, pilum held diagonally ready in the right hand, gladius visible at the hip.
Cell 3, full body seen from behind: the same body exactly from behind, with a slight angle from above. Show the back of the scutum, the long red cape, the helmet crest with the two feathers, the pilum and the scabbard.

Style reference: match the attached reference sheet exactly in palette and shading. Use bright, saturated colours with strong contrast: metal helmets shiny GOLD (not brown), shields saturated in the folk colour with a yellow emblem, mail light SILVER-GREY. Skin and face must stay clearly readable when the sprite is shrunk to 48 pixels (clear dark eyes, light skin tone, mouth visible). Canvas exactly as stated. Do NOT draw any grid lines, borders or separators between the cells; the cells are only an invisible layout.

AVOID: NO TEXT OF ANY KIND (no labels, captions, pose names, titles, numbers or letters above, below or next to the figures); no logos or watermark; no frame, border, grid lines or separator lines drawn between the cells; no second figure; no change of clothing or colours between cells; no difference in scale between cells 2 and 3; no realistic or painterly shading; no blurry or anti-aliased edges; no gradients; no shadow on the ground; no floor; no magenta inside the figure.
```

---

## rom_triarius | Triarius | tier 4 | infantry

Ontwerp: rijkste vorm van de lijn: veteraan met lange hasta, gouden medailles (phalerae) op de borst, twee gouden scheenplaten, zeer lange pluim en cape. Silhouet: hoogste figuur, rechtopstaande speer.

GEBRUIK: ChatGPT | UPLOAD: rom_anker.png en rom_princeps_A.png (in die volgorde) | OPSLAAN ALS: rom_triarius_A.png

```
Use the attached images as the exact reference. The FIRST image is the Roman anchor (style, palette, outline, proportions and level of detail). The SECOND image is the sheet of the previous unit in the same line (Princeps): the new unit is a DIFFERENT unit of the same folk and the same line, with the same colours and base design but richer or different as described below.

Create ONE sprite sheet: canvas exactly 1536 x 1024 pixels, 16-bit JRPG pixel-art in the style of RPG Maker MV and classic Fire Emblem sprites. Layout: 3 columns by 2 rows of INVISIBLE cells, each cell exactly 512 x 512 pixels, the SAME character in all six cells. Background: one flat solid magenta #FF00FF, no gradient, no floor, no shadow on the ground. No magenta anywhere in the figure. IMPORTANT: the image contains NO TEXT of any kind: no labels, no captions, no pose names, no titles, no numbers and no letters anywhere, neither inside nor outside the cells.

CHARACTER: "Triarius", Roman unit (tier 4, branch Infantry, role infantry). He wears: a shiny GOLD helmet with a very tall bright red horsehair plume, a gold ridge and a gold neck guard, face open and clearly visible (light skin, short black hair, clear dark eyes, a stern veteran look); a LIGHT SILVER-GREY mail shirt with gold shoulder doublings over a bright red tunic with short red sleeves; four round shiny gold medals (phalerae) on brown straps across his chest; a long rich bright red cape down to the calves with a round gold clasp; a brown leather belt with a large gold buckle; shiny GOLD greaves on both shins; brown leather sandals with straps. In his left hand a large rectangular curved scutum shield painted saturated red with a yellow lightning-bolt emblem, a gold rim and a gold central boss, with a very wide gold rim and a large ornate gold boss. In his right hand a long hasta (spear) held upright, with a silver leaf-shaped head. A gladius in a brown scabbard at his left hip.

STYLE: chunky visible pixels, at most 24 colours, one dark-brown 1-pixel outline around the whole figure, flat cel-shading with at most two tones per colour, warm saturated fantasy colours, small chibi proportions (head about one third of body height), easy to read at small size.

PIXEL GRID: every cell is its own 64 x 64 pixel grid; every pixel is a block of 8 x 8 image pixels and all pixels in the whole image are exactly the same size. The figure is at most 56 of the 64 pixels tall with at least 4 blocks of empty magenta margin all around. Feet on the same horizontal line in every cell. The figure has the same size in every cell.

CAMERA: three-quarter top-down view (about 30 degrees above the figure, slightly in front of him), unless a pose says otherwise. Express viewing direction by camera position ("seen from behind", "facing the viewer"), not by left or right of the figure.

POSES, in this fixed order:
Row 1, cell 1, resting pose: standing proudly, facing the viewer, hasta held upright beside him, shield at his side.
Row 1, cell 2, attacking pose: one step forward, the hasta thrust forward at chest height, shield raised.
Row 1, cell 3, getting-hit pose: upper body leaning backwards, eyes closed, shield sagging, hasta tilting sideways.
Row 2, cell 1, walking-towards-the-camera pose: walking towards the camera, face and chest clearly visible, carrying the same equipment.
Row 2, cell 2, walking-sideways pose: walking to the RIGHT of the image, pure side view in profile, the shield or main item on the far side of the body.
Row 2, cell 3, walking-away pose: walking away from the camera, back, cape and the back of the equipment visible.

Style reference: match the attached reference sheet exactly in palette and shading. Use bright, saturated colours with strong contrast: metal helmets shiny GOLD (not brown), shields saturated in the folk colour with a yellow emblem, mail light SILVER-GREY. Skin and face must stay clearly readable when the sprite is shrunk to 48 pixels (clear dark eyes, light skin tone, mouth visible). Canvas exactly as stated. Do NOT draw any grid lines, borders or separators between the cells; the cells are only an invisible layout.

AVOID: NO TEXT OF ANY KIND (no labels, captions, pose names, titles, numbers or letters above, below or next to the figures); no logos or watermark; no frame, border, grid lines or separator lines drawn between the cells; no second figure; no change of clothing or colours between poses; no difference in scale between cells; no realistic or painterly shading; no blurry or anti-aliased edges; no gradients; no shadow on the ground; no floor; no magenta inside the figure.
```

GEBRUIK: ChatGPT | UPLOAD: rom_triarius_A.png en rom_tiro_B.png (in die volgorde) | OPSLAAN ALS: rom_triarius_B.png

```
Use the attached images as reference. The FIRST image (the six-cell sprite sheet of Triarius) shows THE SAME character to be redrawn: use it ONLY for the character's appearance and do NOT copy its six-cell layout. The SECOND image (the finished 3-cell sheet of the Roman recruit Tiro: portrait, battle front, battle back) shows the exact FORMAT, style, palette, outline, proportions and level of detail to follow. Your output must have the same layout as the second image: ONE row of exactly three cells, never two rows and never six cells.

Create ONE sheet: canvas exactly 1536 x 512 pixels, 16-bit JRPG pixel-art in the style of RPG Maker MV and classic Fire Emblem sprites. Layout: ONE single row of exactly 3 INVISIBLE cells side by side (NOT six cells, NOT two rows), each exactly 512 x 512 pixels, the SAME character in all three. Background: one flat solid magenta #FF00FF, no gradient, no floor, no shadow on the ground. No magenta anywhere in the figure. IMPORTANT: the image contains NO TEXT of any kind: no labels, no captions, no pose names, no titles, no numbers and no letters anywhere, neither inside nor outside the cells.

CHARACTER: "Triarius", Roman unit (tier 4, branch Infantry, role infantry). He wears: a shiny GOLD helmet with a very tall bright red horsehair plume, a gold ridge and a gold neck guard, face open and clearly visible (light skin, short black hair, clear dark eyes, a stern veteran look); a LIGHT SILVER-GREY mail shirt with gold shoulder doublings over a bright red tunic with short red sleeves; four round shiny gold medals (phalerae) on brown straps across his chest; a long rich bright red cape down to the calves with a round gold clasp; a brown leather belt with a large gold buckle; shiny GOLD greaves on both shins; brown leather sandals with straps. In his left hand a large rectangular curved scutum shield painted saturated red with a yellow lightning-bolt emblem, a gold rim and a gold central boss, with a very wide gold rim and a large ornate gold boss. In his right hand a long hasta (spear) held upright, with a silver leaf-shaped head. A gladius in a brown scabbard at his left hip.

STYLE: chunky visible pixels, at most 24 colours, one dark-brown 1-pixel outline around the whole figure, flat cel-shading with at most two tones per colour, warm saturated fantasy colours, small chibi proportions (head about one third of body height), easy to read at small size.

PIXEL GRID: every cell is its own 64 x 64 pixel grid; every pixel is a block of 8 x 8 image pixels and all pixels in the whole image are exactly the same size. In cells 2 and 3 the figure is at most 56 of the 64 pixels tall with at least 4 blocks of empty magenta margin all around, feet on the same horizontal line in both cells, same size in both cells.

CELLS:
Cell 1, a bust portrait: bust, three-quarter view, looking slightly to the right of the image, a stern but friendly look, more detail in the face than in the sprites; the figure fills about 60 percent of the cell. Show the tall red plume, the gold medals on the mail, the gold clasp of the cape and the stern veteran face.
Cell 2, full body seen from the front: full body, ready for battle, straight from the front at eye level, face towards the viewer. Hasta upright in the right hand, shield held in front of the body.
Cell 3, full body seen from behind: the same body exactly from behind, with a slight angle from above. Show the back of the scutum, the long red cape, the tall plume and the hasta.

Style reference: match the attached reference sheet exactly in palette and shading. Use bright, saturated colours with strong contrast: metal helmets shiny GOLD (not brown), shields saturated in the folk colour with a yellow emblem, mail light SILVER-GREY. Skin and face must stay clearly readable when the sprite is shrunk to 48 pixels (clear dark eyes, light skin tone, mouth visible). Canvas exactly as stated. Do NOT draw any grid lines, borders or separators between the cells; the cells are only an invisible layout.

AVOID: NO TEXT OF ANY KIND (no labels, captions, pose names, titles, numbers or letters above, below or next to the figures); no logos or watermark; no frame, border, grid lines or separator lines drawn between the cells; no second figure; no change of clothing or colours between cells; no difference in scale between cells 2 and 3; no realistic or painterly shading; no blurry or anti-aliased edges; no gradients; no shadow on the ground; no floor; no magenta inside the figure.
```

---

## rom_optio | Optio | tier 3 | infantry

Ontwerp: zelfde lijn als Hastatus, maar een onderofficier: geen groot scutum, wel een klein rond schild, een lange staf (baculum) met gouden knop en een rode sjerp. Duidelijk ander silhouet dan Princeps (geen speer, geen groot schild); dwars geplaatste rode helmkam.

GEBRUIK: ChatGPT | UPLOAD: rom_anker.png en rom_hastatus_A.png (in die volgorde) | OPSLAAN ALS: rom_optio_A.png

```
Use the attached images as the exact reference. The FIRST image is the Roman anchor (style, palette, outline, proportions and level of detail). The SECOND image is the sheet of the previous unit in the same line (Hastatus): the new unit is a DIFFERENT unit of the same folk and the same line, with the same colours and base design but richer or different as described below.

Create ONE sprite sheet: canvas exactly 1536 x 1024 pixels, 16-bit JRPG pixel-art in the style of RPG Maker MV and classic Fire Emblem sprites. Layout: 3 columns by 2 rows of INVISIBLE cells, each cell exactly 512 x 512 pixels, the SAME character in all six cells. Background: one flat solid magenta #FF00FF, no gradient, no floor, no shadow on the ground. No magenta anywhere in the figure. IMPORTANT: the image contains NO TEXT of any kind: no labels, no captions, no pose names, no titles, no numbers and no letters anywhere, neither inside nor outside the cells.

CHARACTER: "Optio", Roman unit (tier 3, branch Infantry, role infantry). He wears: a shiny GOLD helmet with a bright red transverse crest running from side to side over the top, gold cheek guards, face open and clearly visible (light skin, short black hair, clear dark eyes); a LIGHT SILVER-GREY mail shirt over a bright red tunic with short red sleeves; a bright red sash tied around the waist over the brown leather belt with a bronze buckle; a short bright red cape; bare knees; brown leather sandals with straps. On his left forearm a medium ROUND shield painted saturated red with a yellow lightning-bolt emblem and a gold rim. In his right hand a long wooden staff (baculum) with a shiny gold ball on top. A gladius in a brown scabbard at his left hip.

STYLE: chunky visible pixels, at most 24 colours, one dark-brown 1-pixel outline around the whole figure, flat cel-shading with at most two tones per colour, warm saturated fantasy colours, small chibi proportions (head about one third of body height), easy to read at small size.

PIXEL GRID: every cell is its own 64 x 64 pixel grid; every pixel is a block of 8 x 8 image pixels and all pixels in the whole image are exactly the same size. The figure is at most 56 of the 64 pixels tall with at least 4 blocks of empty magenta margin all around. Feet on the same horizontal line in every cell. The figure has the same size in every cell.

CAMERA: three-quarter top-down view (about 30 degrees above the figure, slightly in front of him), unless a pose says otherwise. Express viewing direction by camera position ("seen from behind", "facing the viewer"), not by left or right of the figure.

POSES, in this fixed order:
Row 1, cell 1, resting pose: standing relaxed, facing the viewer, staff planted on the ground beside him, round shield at his side.
Row 1, cell 2, attacking pose: one step forward, the staff pointing forward like a command, round shield raised in front of his chest.
Row 1, cell 3, getting-hit pose: upper body leaning backwards, eyes closed, round shield sagging, staff tilting.
Row 2, cell 1, walking-towards-the-camera pose: walking towards the camera, face and chest clearly visible, carrying the same equipment.
Row 2, cell 2, walking-sideways pose: walking to the RIGHT of the image, pure side view in profile, the shield or main item on the far side of the body.
Row 2, cell 3, walking-away pose: walking away from the camera, back, cape and the back of the equipment visible.

CONSISTENCY: the shield is the medium ROUND red shield on the left forearm in ALL six cells, in every pose including the hit pose, the sideways walk and the walk away. NEVER draw a large rectangular scutum. The staff with the gold ball stays in his right hand in every pose and stays completely inside its own cell.

Style reference: match the attached reference sheet exactly in palette and shading. Use bright, saturated colours with strong contrast: metal helmets shiny GOLD (not brown), shields saturated in the folk colour with a yellow emblem, mail light SILVER-GREY. Skin and face must stay clearly readable when the sprite is shrunk to 48 pixels (clear dark eyes, light skin tone, mouth visible). Canvas exactly as stated. Do NOT draw any grid lines, borders or separators between the cells; the cells are only an invisible layout.

AVOID: NO TEXT OF ANY KIND (no labels, captions, pose names, titles, numbers or letters above, below or next to the figures); no logos or watermark; no frame, border, grid lines or separator lines drawn between the cells; no second figure; no change of clothing or colours between poses; no difference in scale between cells; no realistic or painterly shading; no blurry or anti-aliased edges; no gradients; no shadow on the ground; no floor; no magenta inside the figure.
```

GEBRUIK: ChatGPT | UPLOAD: rom_optio_A.png en rom_tiro_B.png (in die volgorde) | OPSLAAN ALS: rom_optio_B.png

```
Use the attached images as reference. The FIRST image (the six-cell sprite sheet of Optio) shows THE SAME character to be redrawn: use it ONLY for the character's appearance and do NOT copy its six-cell layout. The SECOND image (the finished 3-cell sheet of the Roman recruit Tiro: portrait, battle front, battle back) shows the exact FORMAT, style, palette, outline, proportions and level of detail to follow. Your output must have the same layout as the second image: ONE row of exactly three cells, never two rows and never six cells.

Create ONE sheet: canvas exactly 1536 x 512 pixels, 16-bit JRPG pixel-art in the style of RPG Maker MV and classic Fire Emblem sprites. Layout: ONE single row of exactly 3 INVISIBLE cells side by side (NOT six cells, NOT two rows), each exactly 512 x 512 pixels, the SAME character in all three. Background: one flat solid magenta #FF00FF, no gradient, no floor, no shadow on the ground. No magenta anywhere in the figure. IMPORTANT: the image contains NO TEXT of any kind: no labels, no captions, no pose names, no titles, no numbers and no letters anywhere, neither inside nor outside the cells.

CHARACTER: "Optio", Roman unit (tier 3, branch Infantry, role infantry). He wears: a shiny GOLD helmet with a bright red transverse crest running from side to side over the top, gold cheek guards, face open and clearly visible (light skin, short black hair, clear dark eyes); a LIGHT SILVER-GREY mail shirt over a bright red tunic with short red sleeves; a bright red sash tied around the waist over the brown leather belt with a bronze buckle; a short bright red cape; bare knees; brown leather sandals with straps. On his left forearm a medium ROUND shield painted saturated red with a yellow lightning-bolt emblem and a gold rim. In his right hand a long wooden staff (baculum) with a shiny gold ball on top. A gladius in a brown scabbard at his left hip.

STYLE: chunky visible pixels, at most 24 colours, one dark-brown 1-pixel outline around the whole figure, flat cel-shading with at most two tones per colour, warm saturated fantasy colours, small chibi proportions (head about one third of body height), easy to read at small size.

PIXEL GRID: every cell is its own 64 x 64 pixel grid; every pixel is a block of 8 x 8 image pixels and all pixels in the whole image are exactly the same size. In cells 2 and 3 the figure is at most 56 of the 64 pixels tall with at least 4 blocks of empty magenta margin all around, feet on the same horizontal line in both cells, same size in both cells.

CELLS:
Cell 1, a bust portrait: bust, three-quarter view, looking slightly to the right of the image, a stern but friendly look, more detail in the face than in the sprites; the figure fills about 60 percent of the cell. Show the gold helmet with the red transverse crest, the red sash and the silver mail collar.
Cell 2, full body seen from the front: full body, ready for battle, straight from the front at eye level, face towards the viewer. Round shield raised on the left arm, staff held upright in the right hand.
Cell 3, full body seen from behind: the same body exactly from behind, with a slight angle from above. Show the back of the round shield, the red cape, the red sash, the transverse crest, the staff and the scabbard.

Style reference: match the attached reference sheet exactly in palette and shading. Use bright, saturated colours with strong contrast: metal helmets shiny GOLD (not brown), shields saturated in the folk colour with a yellow emblem, mail light SILVER-GREY. Skin and face must stay clearly readable when the sprite is shrunk to 48 pixels (clear dark eyes, light skin tone, mouth visible). Canvas exactly as stated. Do NOT draw any grid lines, borders or separators between the cells; the cells are only an invisible layout.

AVOID: NO TEXT OF ANY KIND (no labels, captions, pose names, titles, numbers or letters above, below or next to the figures); no logos or watermark; no frame, border, grid lines or separator lines drawn between the cells; no second figure; no change of clothing or colours between cells; no difference in scale between cells 2 and 3; no realistic or painterly shading; no blurry or anti-aliased edges; no gradients; no shadow on the ground; no floor; no magenta inside the figure.
```

---

## rom_centurio | Centurio | tier 4 | infantry

Ontwerp: rijkste vorm van de Optio-lijn: grote dwars geplaatste rode kam, zilveren schubbenpantser met gouden medailles, zilveren scheenplaten, wijnstok-staf (vitis), lange rode cape. Zelfde ronde schild en sjerp als de Optio, maar rijker.

GEBRUIK: ChatGPT | UPLOAD: rom_anker.png en rom_optio_A.png (in die volgorde) | OPSLAAN ALS: rom_centurio_A.png

```
Use the attached images as the exact reference. The FIRST image is the Roman anchor (style, palette, outline, proportions and level of detail). The SECOND image is the sheet of the previous unit in the same line (Optio): the new unit is a DIFFERENT unit of the same folk and the same line, with the same colours and base design but richer or different as described below.

Create ONE sprite sheet: canvas exactly 1536 x 1024 pixels, 16-bit JRPG pixel-art in the style of RPG Maker MV and classic Fire Emblem sprites. Layout: 3 columns by 2 rows of INVISIBLE cells, each cell exactly 512 x 512 pixels, the SAME character in all six cells. Background: one flat solid magenta #FF00FF, no gradient, no floor, no shadow on the ground. No magenta anywhere in the figure. IMPORTANT: the image contains NO TEXT of any kind: no labels, no captions, no pose names, no titles, no numbers and no letters anywhere, neither inside nor outside the cells.

CHARACTER: "Centurio", Roman unit (tier 4, branch Infantry, role infantry). He wears: a shiny GOLD helmet with a large, tall bright red transverse crest running from side to side over the top, gold cheek guards, face open and clearly visible (light skin, short black hair, clear dark eyes, a commanding look); a LIGHT SILVER-GREY scale-and-mail shirt with gold shoulder doublings over a bright red tunic with short red sleeves; three round shiny gold medals (phalerae) on brown straps across the chest; a bright red sash tied around the waist over a brown leather belt with a large gold buckle; a long bright red cape down to the calves with a gold clasp; shiny SILVER greaves on both shins; brown leather sandals with straps. On his left forearm a medium ROUND shield painted saturated red with a yellow lightning-bolt emblem, a wide gold rim and a gold boss. In his right hand a short gnarled light-brown vine staff (vitis) with a gold cap. A gladius in a brown scabbard at his left hip.

STYLE: chunky visible pixels, at most 24 colours, one dark-brown 1-pixel outline around the whole figure, flat cel-shading with at most two tones per colour, warm saturated fantasy colours, small chibi proportions (head about one third of body height), easy to read at small size.

PIXEL GRID: every cell is its own 64 x 64 pixel grid; every pixel is a block of 8 x 8 image pixels and all pixels in the whole image are exactly the same size. The figure is at most 56 of the 64 pixels tall with at least 4 blocks of empty magenta margin all around. Feet on the same horizontal line in every cell. The figure has the same size in every cell.

CAMERA: three-quarter top-down view (about 30 degrees above the figure, slightly in front of him), unless a pose says otherwise. Express viewing direction by camera position ("seen from behind", "facing the viewer"), not by left or right of the figure.

POSES, in this fixed order:
Row 1, cell 1, resting pose: standing proudly, facing the viewer, vine staff held across his body, round shield at his side.
Row 1, cell 2, attacking pose: one step forward, the vine staff pointing forward in command, round shield raised.
Row 1, cell 3, getting-hit pose: upper body leaning backwards, eyes closed, round shield sagging, vine staff tilting.
Row 2, cell 1, walking-towards-the-camera pose: walking towards the camera, face and chest clearly visible, carrying the same equipment.
Row 2, cell 2, walking-sideways pose: walking to the RIGHT of the image, pure side view in profile, the shield or main item on the far side of the body.
Row 2, cell 3, walking-away pose: walking away from the camera, back, cape and the back of the equipment visible.

CONSISTENCY: the shield is the medium ROUND red shield on the left forearm in ALL six cells, in every pose including the hit pose, the sideways walk and the walk away. NEVER draw a large rectangular scutum. The vine staff and its gold cap must stay completely inside their own cell, at least 4 pixel blocks from the cell edge; nothing may cross into a neighbouring cell.

Style reference: match the attached reference sheet exactly in palette and shading. Use bright, saturated colours with strong contrast: metal helmets shiny GOLD (not brown), shields saturated in the folk colour with a yellow emblem, mail light SILVER-GREY. Skin and face must stay clearly readable when the sprite is shrunk to 48 pixels (clear dark eyes, light skin tone, mouth visible). Canvas exactly as stated. Do NOT draw any grid lines, borders or separators between the cells; the cells are only an invisible layout.

AVOID: NO TEXT OF ANY KIND (no labels, captions, pose names, titles, numbers or letters above, below or next to the figures); no logos or watermark; no frame, border, grid lines or separator lines drawn between the cells; no second figure; no change of clothing or colours between poses; no difference in scale between cells; no realistic or painterly shading; no blurry or anti-aliased edges; no gradients; no shadow on the ground; no floor; no magenta inside the figure.
```

GEBRUIK: ChatGPT | UPLOAD: rom_centurio_A.png en rom_tiro_B.png (in die volgorde) | OPSLAAN ALS: rom_centurio_B.png

```
Use the attached images as reference. The FIRST image (the six-cell sprite sheet of Centurio) shows THE SAME character to be redrawn: use it ONLY for the character's appearance and do NOT copy its six-cell layout. The SECOND image (the finished 3-cell sheet of the Roman recruit Tiro: portrait, battle front, battle back) shows the exact FORMAT, style, palette, outline, proportions and level of detail to follow. Your output must have the same layout as the second image: ONE row of exactly three cells, never two rows and never six cells.

Create ONE sheet: canvas exactly 1536 x 512 pixels, 16-bit JRPG pixel-art in the style of RPG Maker MV and classic Fire Emblem sprites. Layout: ONE single row of exactly 3 INVISIBLE cells side by side (NOT six cells, NOT two rows), each exactly 512 x 512 pixels, the SAME character in all three. Background: one flat solid magenta #FF00FF, no gradient, no floor, no shadow on the ground. No magenta anywhere in the figure. IMPORTANT: the image contains NO TEXT of any kind: no labels, no captions, no pose names, no titles, no numbers and no letters anywhere, neither inside nor outside the cells.

CHARACTER: "Centurio", Roman unit (tier 4, branch Infantry, role infantry). He wears: a shiny GOLD helmet with a large, tall bright red transverse crest running from side to side over the top, gold cheek guards, face open and clearly visible (light skin, short black hair, clear dark eyes, a commanding look); a LIGHT SILVER-GREY scale-and-mail shirt with gold shoulder doublings over a bright red tunic with short red sleeves; three round shiny gold medals (phalerae) on brown straps across the chest; a bright red sash tied around the waist over a brown leather belt with a large gold buckle; a long bright red cape down to the calves with a gold clasp; shiny SILVER greaves on both shins; brown leather sandals with straps. On his left forearm a medium ROUND shield painted saturated red with a yellow lightning-bolt emblem, a wide gold rim and a gold boss. In his right hand a short gnarled light-brown vine staff (vitis) with a gold cap. A gladius in a brown scabbard at his left hip.

STYLE: chunky visible pixels, at most 24 colours, one dark-brown 1-pixel outline around the whole figure, flat cel-shading with at most two tones per colour, warm saturated fantasy colours, small chibi proportions (head about one third of body height), easy to read at small size.

PIXEL GRID: every cell is its own 64 x 64 pixel grid; every pixel is a block of 8 x 8 image pixels and all pixels in the whole image are exactly the same size. In cells 2 and 3 the figure is at most 56 of the 64 pixels tall with at least 4 blocks of empty magenta margin all around, feet on the same horizontal line in both cells, same size in both cells.

CELLS:
Cell 1, a bust portrait: bust, three-quarter view, looking slightly to the right of the image, a stern but friendly look, more detail in the face than in the sprites; the figure fills about 60 percent of the cell. Show the large red transverse crest, the gold medals on the mail, the gold clasp and the commanding face.
Cell 2, full body seen from the front: full body, ready for battle, straight from the front at eye level, face towards the viewer. Round shield raised on the left arm, vine staff held ready in the right hand.
Cell 3, full body seen from behind: the same body exactly from behind, with a slight angle from above. Show the back of the round shield, the long red cape, the red sash, the large transverse crest and the scabbard.

Style reference: match the attached reference sheet exactly in palette and shading. Use bright, saturated colours with strong contrast: metal helmets shiny GOLD (not brown), shields saturated in the folk colour with a yellow emblem, mail light SILVER-GREY. Skin and face must stay clearly readable when the sprite is shrunk to 48 pixels (clear dark eyes, light skin tone, mouth visible). Canvas exactly as stated. Do NOT draw any grid lines, borders or separators between the cells; the cells are only an invisible layout.

AVOID: NO TEXT OF ANY KIND (no labels, captions, pose names, titles, numbers or letters above, below or next to the figures); no logos or watermark; no frame, border, grid lines or separator lines drawn between the cells; no second figure; no change of clothing or colours between cells; no difference in scale between cells 2 and 3; no realistic or painterly shading; no blurry or anti-aliased edges; no gradients; no shadow on the ground; no floor; no magenta inside the figure.
```

---

## rom_signifer | Signifer | tier 3 | infantry

Ontwerp: standaarddrager: grijze wolfshuid over helm en schouders, hoge signum-staf met gouden schijven, rode vaan met gele bliksemflits en een zilveren hand bovenop, klein rond schild op de rug, geen groot wapen.

GEBRUIK: ChatGPT | UPLOAD: rom_anker.png en rom_hastatus_A.png (in die volgorde) | OPSLAAN ALS: rom_signifer_A.png

```
Use the attached images as the exact reference. The FIRST image is the Roman anchor (style, palette, outline, proportions and level of detail). The SECOND image is the sheet of the previous unit in the same line (Hastatus): the new unit is a DIFFERENT unit of the same folk and the same line, with the same colours and base design but richer or different as described below.

Create ONE sprite sheet: canvas exactly 1536 x 1024 pixels, 16-bit JRPG pixel-art in the style of RPG Maker MV and classic Fire Emblem sprites. Layout: 3 columns by 2 rows of INVISIBLE cells, each cell exactly 512 x 512 pixels, the SAME character in all six cells. Background: one flat solid magenta #FF00FF, no gradient, no floor, no shadow on the ground. No magenta anywhere in the figure. IMPORTANT: the image contains NO TEXT of any kind: no labels, no captions, no pose names, no titles, no numbers and no letters anywhere, neither inside nor outside the cells.

CHARACTER: "Signifer", Roman unit (tier 3, branch Infantry, role support, standard bearer). He wears: a grey-brown wolf pelt pulled over a plain GOLD helmet with the wolf's head resting on top and the pelt hanging over the shoulders, face open and clearly visible below it (light skin, short black hair, clear dark eyes); a LIGHT SILVER-GREY mail shirt over a bright red tunic with short red sleeves; a short bright red cape under the pelt; a brown leather belt with a bronze buckle; bare knees; brown leather sandals with straps. A small ROUND shield painted saturated red with a yellow lightning bolt is slung on his back. With both hands he carries a tall wooden standard pole (signum): three shiny gold discs along the pole, a square bright red banner with a yellow lightning bolt hanging below the top, and a silver open hand on top. A gladius in a brown scabbard at his left hip.

STYLE: chunky visible pixels, at most 24 colours, one dark-brown 1-pixel outline around the whole figure, flat cel-shading with at most two tones per colour, warm saturated fantasy colours, small chibi proportions (head about one third of body height), easy to read at small size.

PIXEL GRID: every cell is its own 64 x 64 pixel grid; every pixel is a block of 8 x 8 image pixels and all pixels in the whole image are exactly the same size. The figure is at most 56 of the 64 pixels tall with at least 4 blocks of empty magenta margin all around. Feet on the same horizontal line in every cell. The figure has the same size in every cell.

CAMERA: three-quarter top-down view (about 30 degrees above the figure, slightly in front of him), unless a pose says otherwise. Express viewing direction by camera position ("seen from behind", "facing the viewer"), not by left or right of the figure.

POSES, in this fixed order:
Row 1, cell 1, resting pose: standing proudly, facing the viewer, the standard pole held upright in front of him.
Row 1, cell 2, attacking pose: one step forward, the standard pole lowered forward and raised high like a rallying signal, banner flying.
Row 1, cell 3, getting-hit pose: upper body leaning backwards, eyes closed, the standard pole tilting but still held.
Row 2, cell 1, walking-towards-the-camera pose: walking towards the camera, face and chest clearly visible, carrying the same equipment.
Row 2, cell 2, walking-sideways pose: walking to the RIGHT of the image, pure side view in profile, the shield or main item on the far side of the body.
Row 2, cell 3, walking-away pose: walking away from the camera, back, cape and the back of the equipment visible.

CONSISTENCY: the same small ROUND red shield is slung on his back in ALL six cells; he never carries a rectangular scutum. The standard pole with banner and silver hand must stay completely inside its own cell, at least 4 pixel blocks from the top and bottom edge of the cell and never touching the cell above, below or beside it: make the pole shorter if needed.

Style reference: match the attached reference sheet exactly in palette and shading. Use bright, saturated colours with strong contrast: metal helmets shiny GOLD (not brown), shields saturated in the folk colour with a yellow emblem, mail light SILVER-GREY. Skin and face must stay clearly readable when the sprite is shrunk to 48 pixels (clear dark eyes, light skin tone, mouth visible). Canvas exactly as stated. Do NOT draw any grid lines, borders or separators between the cells; the cells are only an invisible layout.

AVOID: NO TEXT OF ANY KIND (no labels, captions, pose names, titles, numbers or letters above, below or next to the figures); no logos or watermark; no frame, border, grid lines or separator lines drawn between the cells; no second figure; no change of clothing or colours between poses; no difference in scale between cells; no realistic or painterly shading; no blurry or anti-aliased edges; no gradients; no shadow on the ground; no floor; no magenta inside the figure.
```

GEBRUIK: ChatGPT | UPLOAD: rom_signifer_A.png en rom_tiro_B.png (in die volgorde) | OPSLAAN ALS: rom_signifer_B.png

```
Use the attached images as reference. The FIRST image (the six-cell sprite sheet of Signifer) shows THE SAME character to be redrawn: use it ONLY for the character's appearance and do NOT copy its six-cell layout. The SECOND image (the finished 3-cell sheet of the Roman recruit Tiro: portrait, battle front, battle back) shows the exact FORMAT, style, palette, outline, proportions and level of detail to follow. Your output must have the same layout as the second image: ONE row of exactly three cells, never two rows and never six cells.

Create ONE sheet: canvas exactly 1536 x 512 pixels, 16-bit JRPG pixel-art in the style of RPG Maker MV and classic Fire Emblem sprites. Layout: ONE single row of exactly 3 INVISIBLE cells side by side (NOT six cells, NOT two rows), each exactly 512 x 512 pixels, the SAME character in all three. Background: one flat solid magenta #FF00FF, no gradient, no floor, no shadow on the ground. No magenta anywhere in the figure. IMPORTANT: the image contains NO TEXT of any kind: no labels, no captions, no pose names, no titles, no numbers and no letters anywhere, neither inside nor outside the cells.

CHARACTER: "Signifer", Roman unit (tier 3, branch Infantry, role support, standard bearer). He wears: a grey-brown wolf pelt pulled over a plain GOLD helmet with the wolf's head resting on top and the pelt hanging over the shoulders, face open and clearly visible below it (light skin, short black hair, clear dark eyes); a LIGHT SILVER-GREY mail shirt over a bright red tunic with short red sleeves; a short bright red cape under the pelt; a brown leather belt with a bronze buckle; bare knees; brown leather sandals with straps. A small ROUND shield painted saturated red with a yellow lightning bolt is slung on his back. With both hands he carries a tall wooden standard pole (signum): three shiny gold discs along the pole, a square bright red banner with a yellow lightning bolt hanging below the top, and a silver open hand on top. A gladius in a brown scabbard at his left hip.

STYLE: chunky visible pixels, at most 24 colours, one dark-brown 1-pixel outline around the whole figure, flat cel-shading with at most two tones per colour, warm saturated fantasy colours, small chibi proportions (head about one third of body height), easy to read at small size.

PIXEL GRID: every cell is its own 64 x 64 pixel grid; every pixel is a block of 8 x 8 image pixels and all pixels in the whole image are exactly the same size. In cells 2 and 3 the figure is at most 56 of the 64 pixels tall with at least 4 blocks of empty magenta margin all around, feet on the same horizontal line in both cells, same size in both cells.

CELLS:
Cell 1, a bust portrait: bust, three-quarter view, looking slightly to the right of the image, a stern but friendly look, more detail in the face than in the sprites; the figure fills about 60 percent of the cell. Show the wolf pelt over the helmet, the top of the standard with the silver hand and the red banner.
Cell 2, full body seen from the front: full body, ready for battle, straight from the front at eye level, face towards the viewer. Standard pole held upright with both hands, banner clearly visible, round shield on his back barely visible.
Cell 3, full body seen from behind: the same body exactly from behind, with a slight angle from above. Show the small round shield on his back, the wolf pelt hanging over his shoulders, the red cape and the back of the standard pole.

CONSISTENCY: ONE row of exactly three cells with the same layout as the second image, each cell about as wide as it is tall. The standard pole, banner and silver hand must stay completely inside their own cell, at least 4 pixel blocks from the cell edges, and never touch the neighbouring cell. Only ONE small ROUND red shield, slung on his back (visible in cell 3 only); no rectangular shield anywhere.

Style reference: match the attached reference sheet exactly in palette and shading. Use bright, saturated colours with strong contrast: metal helmets shiny GOLD (not brown), shields saturated in the folk colour with a yellow emblem, mail light SILVER-GREY. Skin and face must stay clearly readable when the sprite is shrunk to 48 pixels (clear dark eyes, light skin tone, mouth visible). Canvas exactly as stated. Do NOT draw any grid lines, borders or separators between the cells; the cells are only an invisible layout.

AVOID: NO TEXT OF ANY KIND (no labels, captions, pose names, titles, numbers or letters above, below or next to the figures); no logos or watermark; no frame, border, grid lines or separator lines drawn between the cells; no second figure; no change of clothing or colours between cells; no difference in scale between cells 2 and 3; no realistic or painterly shading; no blurry or anti-aliased edges; no gradients; no shadow on the ground; no floor; no magenta inside the figure.
```

---

## rom_aquilifer | Aquilifer | tier 4 | infantry

Ontwerp: rijkste vorm van de Signifer-lijn: gouden leeuwenhuid in plaats van wolf, hoge staf met grote gouden adelaar met gespreide vleugels, gouden medailles en scheenplaten, langere cape.

GEBRUIK: ChatGPT | UPLOAD: rom_anker.png en rom_signifer_A.png (in die volgorde) | OPSLAAN ALS: rom_aquilifer_A.png

```
Use the attached images as the exact reference. The FIRST image is the Roman anchor (style, palette, outline, proportions and level of detail). The SECOND image is the sheet of the previous unit in the same line (Signifer): the new unit is a DIFFERENT unit of the same folk and the same line, with the same colours and base design but richer or different as described below.

Create ONE sprite sheet: canvas exactly 1536 x 1024 pixels, 16-bit JRPG pixel-art in the style of RPG Maker MV and classic Fire Emblem sprites. Layout: 3 columns by 2 rows of INVISIBLE cells, each cell exactly 512 x 512 pixels, the SAME character in all six cells. Background: one flat solid magenta #FF00FF, no gradient, no floor, no shadow on the ground. No magenta anywhere in the figure. IMPORTANT: the image contains NO TEXT of any kind: no labels, no captions, no pose names, no titles, no numbers and no letters anywhere, neither inside nor outside the cells.

CHARACTER: "Aquilifer", Roman unit (tier 4, branch Infantry, role support, standard bearer). He wears: a golden-tan lion pelt pulled over a GOLD helmet with a tall bright red crest, the lion's head resting on top and the pelt hanging over the shoulders, face open and clearly visible below it (light skin, short black hair, clear dark eyes); a LIGHT SILVER-GREY mail shirt with gold shoulder doublings over a bright red tunic with short red sleeves; three round shiny gold medals on brown straps across the chest; a long bright red cape down to the calves; a brown leather belt with a large gold buckle; shiny GOLD greaves on both shins; brown leather sandals with straps. A small ROUND shield painted saturated red with a yellow lightning bolt and a gold rim is slung on his back. With both hands he carries a tall wooden pole topped with a large shiny GOLD eagle with spread wings and a thunderbolt in its claws, below it a gold disc and a short bright red banner. A gladius in a brown scabbard at his left hip.

STYLE: chunky visible pixels, at most 24 colours, one dark-brown 1-pixel outline around the whole figure, flat cel-shading with at most two tones per colour, warm saturated fantasy colours, small chibi proportions (head about one third of body height), easy to read at small size.

PIXEL GRID: every cell is its own 64 x 64 pixel grid; every pixel is a block of 8 x 8 image pixels and all pixels in the whole image are exactly the same size. The figure is at most 56 of the 64 pixels tall with at least 4 blocks of empty magenta margin all around. Feet on the same horizontal line in every cell. The figure has the same size in every cell.

CAMERA: three-quarter top-down view (about 30 degrees above the figure, slightly in front of him), unless a pose says otherwise. Express viewing direction by camera position ("seen from behind", "facing the viewer"), not by left or right of the figure.

POSES, in this fixed order:
Row 1, cell 1, resting pose: standing proudly, facing the viewer, the eagle standard held upright in front of him.
Row 1, cell 2, attacking pose: one step forward, the eagle standard held diagonally forward at chest height with the eagle pointing forward and low, well below the top of the helmet crest, the whole eagle clearly inside the cell.
Row 1, cell 3, getting-hit pose: upper body leaning backwards, eyes closed, the eagle standard tilting but still held.
Row 2, cell 1, walking-towards-the-camera pose: walking towards the camera, face and chest clearly visible, carrying the same equipment.
Row 2, cell 2, walking-sideways pose: walking to the RIGHT of the image, pure side view in profile, the shield or main item on the far side of the body.
Row 2, cell 3, walking-away pose: walking away from the camera, back, cape and the back of the equipment visible.

CONSISTENCY: the same small ROUND red shield with gold rim is slung on his back in ALL six cells. The eagle on top of the pole must stay completely inside its own cell, at least 4 pixel blocks from the top edge and never crossing into the neighbouring cell: make the pole shorter and the eagle smaller if needed, in every pose.

Style reference: match the attached reference sheet exactly in palette and shading. Use bright, saturated colours with strong contrast: metal helmets shiny GOLD (not brown), shields saturated in the folk colour with a yellow emblem, mail light SILVER-GREY. Skin and face must stay clearly readable when the sprite is shrunk to 48 pixels (clear dark eyes, light skin tone, mouth visible). Canvas exactly as stated. Do NOT draw any grid lines, borders or separators between the cells; the cells are only an invisible layout.

AVOID: NO TEXT OF ANY KIND (no labels, captions, pose names, titles, numbers or letters above, below or next to the figures); no logos or watermark; no frame, border, grid lines or separator lines drawn between the cells; no second figure; no change of clothing or colours between poses; no difference in scale between cells; no realistic or painterly shading; no blurry or anti-aliased edges; no gradients; no shadow on the ground; no floor; no magenta inside the figure.
```

GEBRUIK: ChatGPT | UPLOAD: rom_aquilifer_A.png en rom_tiro_B.png (in die volgorde) | OPSLAAN ALS: rom_aquilifer_B.png

```
Use the attached images as reference. The FIRST image (the six-cell sprite sheet of Aquilifer) shows THE SAME character to be redrawn: use it ONLY for the character's appearance and do NOT copy its six-cell layout. The SECOND image (the finished 3-cell sheet of the Roman recruit Tiro: portrait, battle front, battle back) shows the exact FORMAT, style, palette, outline, proportions and level of detail to follow. Your output must have the same layout as the second image: ONE row of exactly three cells, never two rows and never six cells.

Create ONE sheet: canvas exactly 1536 x 512 pixels, 16-bit JRPG pixel-art in the style of RPG Maker MV and classic Fire Emblem sprites. Layout: ONE single row of exactly 3 INVISIBLE cells side by side (NOT six cells, NOT two rows), each exactly 512 x 512 pixels, the SAME character in all three. Background: one flat solid magenta #FF00FF, no gradient, no floor, no shadow on the ground. No magenta anywhere in the figure. IMPORTANT: the image contains NO TEXT of any kind: no labels, no captions, no pose names, no titles, no numbers and no letters anywhere, neither inside nor outside the cells.

CHARACTER: "Aquilifer", Roman unit (tier 4, branch Infantry, role support, standard bearer). He wears: a golden-tan lion pelt pulled over a GOLD helmet with a tall bright red crest, the lion's head resting on top and the pelt hanging over the shoulders, face open and clearly visible below it (light skin, short black hair, clear dark eyes); a LIGHT SILVER-GREY mail shirt with gold shoulder doublings over a bright red tunic with short red sleeves; three round shiny gold medals on brown straps across the chest; a long bright red cape down to the calves; a brown leather belt with a large gold buckle; shiny GOLD greaves on both shins; brown leather sandals with straps. A small ROUND shield painted saturated red with a yellow lightning bolt and a gold rim is slung on his back. With both hands he carries a tall wooden pole topped with a large shiny GOLD eagle with spread wings and a thunderbolt in its claws, below it a gold disc and a short bright red banner. A gladius in a brown scabbard at his left hip.

STYLE: chunky visible pixels, at most 24 colours, one dark-brown 1-pixel outline around the whole figure, flat cel-shading with at most two tones per colour, warm saturated fantasy colours, small chibi proportions (head about one third of body height), easy to read at small size.

PIXEL GRID: every cell is its own 64 x 64 pixel grid; every pixel is a block of 8 x 8 image pixels and all pixels in the whole image are exactly the same size. In cells 2 and 3 the figure is at most 56 of the 64 pixels tall with at least 4 blocks of empty magenta margin all around, feet on the same horizontal line in both cells, same size in both cells.

CELLS:
Cell 1, a bust portrait: bust, three-quarter view, looking slightly to the right of the image, a stern but friendly look, more detail in the face than in the sprites; the figure fills about 60 percent of the cell. Show the lion pelt over the helmet, the gold eagle on top of the pole and the gold medals.
Cell 2, full body seen from the front: full body, ready for battle, straight from the front at eye level, face towards the viewer. Eagle standard held upright with both hands, the golden eagle clearly visible above his head.
Cell 3, full body seen from behind: the same body exactly from behind, with a slight angle from above. Show the small round shield on his back, the lion pelt over his shoulders, the long red cape and the back of the eagle standard.

Style reference: match the attached reference sheet exactly in palette and shading. Use bright, saturated colours with strong contrast: metal helmets shiny GOLD (not brown), shields saturated in the folk colour with a yellow emblem, mail light SILVER-GREY. Skin and face must stay clearly readable when the sprite is shrunk to 48 pixels (clear dark eyes, light skin tone, mouth visible). Canvas exactly as stated. Do NOT draw any grid lines, borders or separators between the cells; the cells are only an invisible layout.

AVOID: NO TEXT OF ANY KIND (no labels, captions, pose names, titles, numbers or letters above, below or next to the figures); no logos or watermark; no frame, border, grid lines or separator lines drawn between the cells; no second figure; no change of clothing or colours between cells; no difference in scale between cells 2 and 3; no realistic or painterly shading; no blurry or anti-aliased edges; no gradients; no shadow on the ground; no floor; no magenta inside the figure.
```

---

## rom_veles | Veles | tier 2 | light and ranged

Ontwerp: lichte werper uit Tiro: wolfsmuts, geen pantser, geen groot schild, bundel werpspiezen. Aanval = werpen.

GEBRUIK: ChatGPT | UPLOAD: rom_anker.png en rom_tiro_A.png (in die volgorde) | OPSLAAN ALS: rom_veles_A.png

```
Use the attached images as the exact reference. The FIRST image is the Roman anchor (style, palette, outline, proportions and level of detail). The SECOND image is the sheet of the previous unit in the same line (Tiro): the new unit is a DIFFERENT unit of the same folk and the same line, with the same colours and base design but richer or different as described below.

Create ONE sprite sheet: canvas exactly 1536 x 1024 pixels, 16-bit JRPG pixel-art in the style of RPG Maker MV and classic Fire Emblem sprites. Layout: 3 columns by 2 rows of INVISIBLE cells, each cell exactly 512 x 512 pixels, the SAME character in all six cells. Background: one flat solid magenta #FF00FF, no gradient, no floor, no shadow on the ground. No magenta anywhere in the figure. IMPORTANT: the image contains NO TEXT of any kind: no labels, no captions, no pose names, no titles, no numbers and no letters anywhere, neither inside nor outside the cells.

CHARACTER: "Veles", Roman unit (tier 2, branch Light and ranged, role ranged, javelin thrower). He wears: a small grey-brown wolf-pelt cap pulled over his head with the wolf's ears showing, face open and clearly visible (light skin, short black hair, clear dark eyes); a plain bright red tunic with short sleeves reaching the thighs; a short bright red cape; a brown leather belt with a bronze buckle; a brown leather pouch at the left hip with three short wooden javelins sticking out; bare knees; brown leather sandals with straps; NO armour and NO big shield. In his right hand a light wooden javelin (hasta velitaris) with a silver head; a small round red wooden buckler with a yellow lightning bolt strapped on his left forearm.

STYLE: chunky visible pixels, at most 24 colours, one dark-brown 1-pixel outline around the whole figure, flat cel-shading with at most two tones per colour, warm saturated fantasy colours, small chibi proportions (head about one third of body height), easy to read at small size.

PIXEL GRID: every cell is its own 64 x 64 pixel grid; every pixel is a block of 8 x 8 image pixels and all pixels in the whole image are exactly the same size. The figure is at most 56 of the 64 pixels tall with at least 4 blocks of empty magenta margin all around. Feet on the same horizontal line in every cell. The figure has the same size in every cell.

CAMERA: three-quarter top-down view (about 30 degrees above the figure, slightly in front of him), unless a pose says otherwise. Express viewing direction by camera position ("seen from behind", "facing the viewer"), not by left or right of the figure.

POSES, in this fixed order:
Row 1, cell 1, resting pose: standing relaxed, facing the viewer, javelin held loosely, light on his feet.
Row 1, cell 2, attacking pose: throwing pose: leaning back then forward, the javelin in the raised right hand, aimed forward, left arm stretched forward.
Row 1, cell 3, getting-hit pose: upper body leaning backwards, eyes closed, javelin dropping, hand raised.
Row 2, cell 1, walking-towards-the-camera pose: walking towards the camera, face and chest clearly visible, carrying the same equipment.
Row 2, cell 2, walking-sideways pose: walking to the RIGHT of the image, pure side view in profile, the shield or main item on the far side of the body.
Row 2, cell 3, walking-away pose: walking away from the camera, back, cape and the back of the equipment visible.

Style reference: match the attached reference sheet exactly in palette and shading. Use bright, saturated colours with strong contrast: metal helmets shiny GOLD (not brown), shields saturated in the folk colour with a yellow emblem, mail light SILVER-GREY. Skin and face must stay clearly readable when the sprite is shrunk to 48 pixels (clear dark eyes, light skin tone, mouth visible). Canvas exactly as stated. Do NOT draw any grid lines, borders or separators between the cells; the cells are only an invisible layout.

AVOID: NO TEXT OF ANY KIND (no labels, captions, pose names, titles, numbers or letters above, below or next to the figures); no logos or watermark; no frame, border, grid lines or separator lines drawn between the cells; no second figure; no change of clothing or colours between poses; no difference in scale between cells; no realistic or painterly shading; no blurry or anti-aliased edges; no gradients; no shadow on the ground; no floor; no magenta inside the figure.
```

GEBRUIK: ChatGPT | UPLOAD: rom_veles_A.png en rom_tiro_B.png (in die volgorde) | OPSLAAN ALS: rom_veles_B.png

```
Use the attached images as reference. The FIRST image (the six-cell sprite sheet of Veles) shows THE SAME character to be redrawn: use it ONLY for the character's appearance and do NOT copy its six-cell layout. The SECOND image (the finished 3-cell sheet of the Roman recruit Tiro: portrait, battle front, battle back) shows the exact FORMAT, style, palette, outline, proportions and level of detail to follow. Your output must have the same layout as the second image: ONE row of exactly three cells, never two rows and never six cells.

Create ONE sheet: canvas exactly 1536 x 512 pixels, 16-bit JRPG pixel-art in the style of RPG Maker MV and classic Fire Emblem sprites. Layout: ONE single row of exactly 3 INVISIBLE cells side by side (NOT six cells, NOT two rows), each exactly 512 x 512 pixels, the SAME character in all three. Background: one flat solid magenta #FF00FF, no gradient, no floor, no shadow on the ground. No magenta anywhere in the figure. IMPORTANT: the image contains NO TEXT of any kind: no labels, no captions, no pose names, no titles, no numbers and no letters anywhere, neither inside nor outside the cells.

CHARACTER: "Veles", Roman unit (tier 2, branch Light and ranged, role ranged, javelin thrower). He wears: a small grey-brown wolf-pelt cap pulled over his head with the wolf's ears showing, face open and clearly visible (light skin, short black hair, clear dark eyes); a plain bright red tunic with short sleeves reaching the thighs; a short bright red cape; a brown leather belt with a bronze buckle; a brown leather pouch at the left hip with three short wooden javelins sticking out; bare knees; brown leather sandals with straps; NO armour and NO big shield. In his right hand a light wooden javelin (hasta velitaris) with a silver head; a small round red wooden buckler with a yellow lightning bolt strapped on his left forearm.

STYLE: chunky visible pixels, at most 24 colours, one dark-brown 1-pixel outline around the whole figure, flat cel-shading with at most two tones per colour, warm saturated fantasy colours, small chibi proportions (head about one third of body height), easy to read at small size.

PIXEL GRID: every cell is its own 64 x 64 pixel grid; every pixel is a block of 8 x 8 image pixels and all pixels in the whole image are exactly the same size. In cells 2 and 3 the figure is at most 56 of the 64 pixels tall with at least 4 blocks of empty magenta margin all around, feet on the same horizontal line in both cells, same size in both cells.

CELLS:
Cell 1, a bust portrait: bust, three-quarter view, looking slightly to the right of the image, a stern but friendly look, more detail in the face than in the sprites; the figure fills about 60 percent of the cell. Show the wolf-pelt cap, the red tunic collar and the red cape.
Cell 2, full body seen from the front: full body, ready for battle, straight from the front at eye level, face towards the viewer. Javelin raised in the right hand ready to throw, the buckler on the left forearm.
Cell 3, full body seen from behind: the same body exactly from behind, with a slight angle from above. Show the wolf-pelt cap from behind, the red cape, the javelin pouch at his hip and the javelin.

Style reference: match the attached reference sheet exactly in palette and shading. Use bright, saturated colours with strong contrast: metal helmets shiny GOLD (not brown), shields saturated in the folk colour with a yellow emblem, mail light SILVER-GREY. Skin and face must stay clearly readable when the sprite is shrunk to 48 pixels (clear dark eyes, light skin tone, mouth visible). Canvas exactly as stated. Do NOT draw any grid lines, borders or separators between the cells; the cells are only an invisible layout.

AVOID: NO TEXT OF ANY KIND (no labels, captions, pose names, titles, numbers or letters above, below or next to the figures); no logos or watermark; no frame, border, grid lines or separator lines drawn between the cells; no second figure; no change of clothing or colours between cells; no difference in scale between cells 2 and 3; no realistic or painterly shading; no blurry or anti-aliased edges; no gradients; no shadow on the ground; no floor; no magenta inside the figure.
```

---

## rom_funditor | Funditor | tier 3 | light and ranged

Ontwerp: slingeraar uit Veles: zelfde wolfsmuts en rode tuniek, nu met bruin leren vest, leren armbeschermer, slinger en stenenzak. Aanval = slinger boven het hoofd.

GEBRUIK: ChatGPT | UPLOAD: rom_anker.png en rom_veles_A.png (in die volgorde) | OPSLAAN ALS: rom_funditor_A.png

```
Use the attached images as the exact reference. The FIRST image is the Roman anchor (style, palette, outline, proportions and level of detail). The SECOND image is the sheet of the previous unit in the same line (Veles): the new unit is a DIFFERENT unit of the same folk and the same line, with the same colours and base design but richer or different as described below.

Create ONE sprite sheet: canvas exactly 1536 x 1024 pixels, 16-bit JRPG pixel-art in the style of RPG Maker MV and classic Fire Emblem sprites. Layout: 3 columns by 2 rows of INVISIBLE cells, each cell exactly 512 x 512 pixels, the SAME character in all six cells. Background: one flat solid magenta #FF00FF, no gradient, no floor, no shadow on the ground. No magenta anywhere in the figure. IMPORTANT: the image contains NO TEXT of any kind: no labels, no captions, no pose names, no titles, no numbers and no letters anywhere, neither inside nor outside the cells.

CHARACTER: "Funditor", Roman unit (tier 3, branch Light and ranged, role ranged, slinger). He wears: a small grey-brown wolf-pelt cap with the wolf's ears showing, face open and clearly visible (light skin, short black hair, clear dark eyes); a bright red short-sleeved tunic under a sleeveless brown leather vest with bronze studs; a short bright red cape; a brown leather belt with a bronze buckle; a brown leather bracer on the right forearm; bare knees; brown leather sandals with straps; NO mail and NO shield. In his right hand a long leather sling with a stone in its pouch. A brown leather bag full of round grey stones hangs at his left hip.

STYLE: chunky visible pixels, at most 24 colours, one dark-brown 1-pixel outline around the whole figure, flat cel-shading with at most two tones per colour, warm saturated fantasy colours, small chibi proportions (head about one third of body height), easy to read at small size.

PIXEL GRID: every cell is its own 64 x 64 pixel grid; every pixel is a block of 8 x 8 image pixels and all pixels in the whole image are exactly the same size. The figure is at most 56 of the 64 pixels tall with at least 4 blocks of empty magenta margin all around. Feet on the same horizontal line in every cell. The figure has the same size in every cell.

CAMERA: three-quarter top-down view (about 30 degrees above the figure, slightly in front of him), unless a pose says otherwise. Express viewing direction by camera position ("seen from behind", "facing the viewer"), not by left or right of the figure.

POSES, in this fixed order:
Row 1, cell 1, resting pose: standing relaxed, facing the viewer, the sling hanging from his right hand, one hand resting on the stone bag.
Row 1, cell 2, attacking pose: one step forward, the sling whirling above his head, the other arm stretched forward.
Row 1, cell 3, getting-hit pose: upper body leaning backwards, eyes closed, the sling dropping, hand raised.
Row 2, cell 1, walking-towards-the-camera pose: walking towards the camera, face and chest clearly visible, carrying the same equipment.
Row 2, cell 2, walking-sideways pose: walking to the RIGHT of the image, pure side view in profile, the shield or main item on the far side of the body.
Row 2, cell 3, walking-away pose: walking away from the camera, back, cape and the back of the equipment visible.

Style reference: match the attached reference sheet exactly in palette and shading. Use bright, saturated colours with strong contrast: metal helmets shiny GOLD (not brown), shields saturated in the folk colour with a yellow emblem, mail light SILVER-GREY. Skin and face must stay clearly readable when the sprite is shrunk to 48 pixels (clear dark eyes, light skin tone, mouth visible). Canvas exactly as stated. Do NOT draw any grid lines, borders or separators between the cells; the cells are only an invisible layout.

AVOID: NO TEXT OF ANY KIND (no labels, captions, pose names, titles, numbers or letters above, below or next to the figures); no logos or watermark; no frame, border, grid lines or separator lines drawn between the cells; no second figure; no change of clothing or colours between poses; no difference in scale between cells; no realistic or painterly shading; no blurry or anti-aliased edges; no gradients; no shadow on the ground; no floor; no magenta inside the figure.
```

GEBRUIK: ChatGPT | UPLOAD: rom_funditor_A.png en rom_tiro_B.png (in die volgorde) | OPSLAAN ALS: rom_funditor_B.png

```
Use the attached images as reference. The FIRST image (the six-cell sprite sheet of Funditor) shows THE SAME character to be redrawn: use it ONLY for the character's appearance and do NOT copy its six-cell layout. The SECOND image (the finished 3-cell sheet of the Roman recruit Tiro: portrait, battle front, battle back) shows the exact FORMAT, style, palette, outline, proportions and level of detail to follow. Your output must have the same layout as the second image: ONE row of exactly three cells, never two rows and never six cells.

Create ONE sheet: canvas exactly 1536 x 512 pixels, 16-bit JRPG pixel-art in the style of RPG Maker MV and classic Fire Emblem sprites. Layout: ONE single row of exactly 3 INVISIBLE cells side by side (NOT six cells, NOT two rows), each exactly 512 x 512 pixels, the SAME character in all three. Background: one flat solid magenta #FF00FF, no gradient, no floor, no shadow on the ground. No magenta anywhere in the figure. IMPORTANT: the image contains NO TEXT of any kind: no labels, no captions, no pose names, no titles, no numbers and no letters anywhere, neither inside nor outside the cells.

CHARACTER: "Funditor", Roman unit (tier 3, branch Light and ranged, role ranged, slinger). He wears: a small grey-brown wolf-pelt cap with the wolf's ears showing, face open and clearly visible (light skin, short black hair, clear dark eyes); a bright red short-sleeved tunic under a sleeveless brown leather vest with bronze studs; a short bright red cape; a brown leather belt with a bronze buckle; a brown leather bracer on the right forearm; bare knees; brown leather sandals with straps; NO mail and NO shield. In his right hand a long leather sling with a stone in its pouch. A brown leather bag full of round grey stones hangs at his left hip.

STYLE: chunky visible pixels, at most 24 colours, one dark-brown 1-pixel outline around the whole figure, flat cel-shading with at most two tones per colour, warm saturated fantasy colours, small chibi proportions (head about one third of body height), easy to read at small size.

PIXEL GRID: every cell is its own 64 x 64 pixel grid; every pixel is a block of 8 x 8 image pixels and all pixels in the whole image are exactly the same size. In cells 2 and 3 the figure is at most 56 of the 64 pixels tall with at least 4 blocks of empty magenta margin all around, feet on the same horizontal line in both cells, same size in both cells.

CELLS:
Cell 1, a bust portrait: bust, three-quarter view, looking slightly to the right of the image, a stern but friendly look, more detail in the face than in the sprites; the figure fills about 60 percent of the cell. Show the wolf-pelt cap, the brown leather vest collar and the red cape.
Cell 2, full body seen from the front: full body, ready for battle, straight from the front at eye level, face towards the viewer. The sling swinging in a circle beside his head, the stone bag at his hip.
Cell 3, full body seen from behind: the same body exactly from behind, with a slight angle from above. Show the wolf-pelt cap from behind, the red cape, the stone bag and the sling.

Style reference: match the attached reference sheet exactly in palette and shading. Use bright, saturated colours with strong contrast: metal helmets shiny GOLD (not brown), shields saturated in the folk colour with a yellow emblem, mail light SILVER-GREY. Skin and face must stay clearly readable when the sprite is shrunk to 48 pixels (clear dark eyes, light skin tone, mouth visible). Canvas exactly as stated. Do NOT draw any grid lines, borders or separators between the cells; the cells are only an invisible layout.

AVOID: NO TEXT OF ANY KIND (no labels, captions, pose names, titles, numbers or letters above, below or next to the figures); no logos or watermark; no frame, border, grid lines or separator lines drawn between the cells; no second figure; no change of clothing or colours between cells; no difference in scale between cells 2 and 3; no realistic or painterly shading; no blurry or anti-aliased edges; no gradients; no shadow on the ground; no floor; no magenta inside the figure.
```

---

## rom_sagittarius | Sagittarius | tier 4 | light and ranged

Ontwerp: boogschutter, rijkste vorm van de Veles-lijn: gouden spitse helm, grijze wolfshuid over de schouders, zilveren maliën, grote boog en pijlenkoker.

GEBRUIK: ChatGPT | UPLOAD: rom_anker.png en rom_funditor_A.png (in die volgorde) | OPSLAAN ALS: rom_sagittarius_A.png

```
Use the attached images as the exact reference. The FIRST image is the Roman anchor (style, palette, outline, proportions and level of detail). The SECOND image is the sheet of the previous unit in the same line (Funditor): the new unit is a DIFFERENT unit of the same folk and the same line, with the same colours and base design but richer or different as described below.

Create ONE sprite sheet: canvas exactly 1536 x 1024 pixels, 16-bit JRPG pixel-art in the style of RPG Maker MV and classic Fire Emblem sprites. Layout: 3 columns by 2 rows of INVISIBLE cells, each cell exactly 512 x 512 pixels, the SAME character in all six cells. Background: one flat solid magenta #FF00FF, no gradient, no floor, no shadow on the ground. No magenta anywhere in the figure. IMPORTANT: the image contains NO TEXT of any kind: no labels, no captions, no pose names, no titles, no numbers and no letters anywhere, neither inside nor outside the cells.

CHARACTER: "Sagittarius", Roman unit (tier 4, branch Light and ranged, role ranged, archer). He wears: a shiny GOLD pointed conical helmet with a small bright red plume, gold cheek guards, face open and clearly visible (light skin, short black hair, clear dark eyes); a grey-brown wolf pelt over his shoulders; a short LIGHT SILVER-GREY mail shirt over a bright red long-sleeved tunic; a bright red cape; a brown leather belt with a gold buckle; gold bracers on both forearms; brown leather boots; NO shield. In his left hand a large curved wooden composite bow with a pale string. On his back a brown leather quiver full of arrows with bright red feathers.

STYLE: chunky visible pixels, at most 24 colours, one dark-brown 1-pixel outline around the whole figure, flat cel-shading with at most two tones per colour, warm saturated fantasy colours, small chibi proportions (head about one third of body height), easy to read at small size.

PIXEL GRID: every cell is its own 64 x 64 pixel grid; every pixel is a block of 8 x 8 image pixels and all pixels in the whole image are exactly the same size. The figure is at most 56 of the 64 pixels tall with at least 4 blocks of empty magenta margin all around. Feet on the same horizontal line in every cell. The figure has the same size in every cell.

CAMERA: three-quarter top-down view (about 30 degrees above the figure, slightly in front of him), unless a pose says otherwise. Express viewing direction by camera position ("seen from behind", "facing the viewer"), not by left or right of the figure.

POSES, in this fixed order:
Row 1, cell 1, resting pose: standing relaxed, facing the viewer, the bow held low in his left hand.
Row 1, cell 2, attacking pose: one step forward, the bow drawn with an arrow aimed forward, right hand pulling the string to his cheek.
Row 1, cell 3, getting-hit pose: upper body leaning backwards, eyes closed, the bow dropping, hand raised.
Row 2, cell 1, walking-towards-the-camera pose: walking towards the camera, face and chest clearly visible, carrying the same equipment.
Row 2, cell 2, walking-sideways pose: walking to the RIGHT of the image, pure side view in profile, the shield or main item on the far side of the body.
Row 2, cell 3, walking-away pose: walking away from the camera, back, cape and the back of the equipment visible.

Style reference: match the attached reference sheet exactly in palette and shading. Use bright, saturated colours with strong contrast: metal helmets shiny GOLD (not brown), shields saturated in the folk colour with a yellow emblem, mail light SILVER-GREY. Skin and face must stay clearly readable when the sprite is shrunk to 48 pixels (clear dark eyes, light skin tone, mouth visible). Canvas exactly as stated. Do NOT draw any grid lines, borders or separators between the cells; the cells are only an invisible layout.

AVOID: NO TEXT OF ANY KIND (no labels, captions, pose names, titles, numbers or letters above, below or next to the figures); no logos or watermark; no frame, border, grid lines or separator lines drawn between the cells; no second figure; no change of clothing or colours between poses; no difference in scale between cells; no realistic or painterly shading; no blurry or anti-aliased edges; no gradients; no shadow on the ground; no floor; no magenta inside the figure.
```

GEBRUIK: ChatGPT | UPLOAD: rom_sagittarius_A.png en rom_tiro_B.png (in die volgorde) | OPSLAAN ALS: rom_sagittarius_B.png

```
Use the attached images as reference. The FIRST image (the six-cell sprite sheet of Sagittarius) shows THE SAME character to be redrawn: use it ONLY for the character's appearance and do NOT copy its six-cell layout. The SECOND image (the finished 3-cell sheet of the Roman recruit Tiro: portrait, battle front, battle back) shows the exact FORMAT, style, palette, outline, proportions and level of detail to follow. Your output must have the same layout as the second image: ONE row of exactly three cells, never two rows and never six cells.

Create ONE sheet: canvas exactly 1536 x 512 pixels, 16-bit JRPG pixel-art in the style of RPG Maker MV and classic Fire Emblem sprites. Layout: ONE single row of exactly 3 INVISIBLE cells side by side (NOT six cells, NOT two rows), each exactly 512 x 512 pixels, the SAME character in all three. Background: one flat solid magenta #FF00FF, no gradient, no floor, no shadow on the ground. No magenta anywhere in the figure. IMPORTANT: the image contains NO TEXT of any kind: no labels, no captions, no pose names, no titles, no numbers and no letters anywhere, neither inside nor outside the cells.

CHARACTER: "Sagittarius", Roman unit (tier 4, branch Light and ranged, role ranged, archer). He wears: a shiny GOLD pointed conical helmet with a small bright red plume, gold cheek guards, face open and clearly visible (light skin, short black hair, clear dark eyes); a grey-brown wolf pelt over his shoulders; a short LIGHT SILVER-GREY mail shirt over a bright red long-sleeved tunic; a bright red cape; a brown leather belt with a gold buckle; gold bracers on both forearms; brown leather boots; NO shield. In his left hand a large curved wooden composite bow with a pale string. On his back a brown leather quiver full of arrows with bright red feathers.

STYLE: chunky visible pixels, at most 24 colours, one dark-brown 1-pixel outline around the whole figure, flat cel-shading with at most two tones per colour, warm saturated fantasy colours, small chibi proportions (head about one third of body height), easy to read at small size.

PIXEL GRID: every cell is its own 64 x 64 pixel grid; every pixel is a block of 8 x 8 image pixels and all pixels in the whole image are exactly the same size. In cells 2 and 3 the figure is at most 56 of the 64 pixels tall with at least 4 blocks of empty magenta margin all around, feet on the same horizontal line in both cells, same size in both cells.

CELLS:
Cell 1, a bust portrait: bust, three-quarter view, looking slightly to the right of the image, a stern but friendly look, more detail in the face than in the sprites; the figure fills about 60 percent of the cell. Show the gold pointed helmet with red plume, the wolf pelt and the red cape.
Cell 2, full body seen from the front: full body, ready for battle, straight from the front at eye level, face towards the viewer. The bow held ready with an arrow nocked, the quiver visible over his shoulder.
Cell 3, full body seen from behind: the same body exactly from behind, with a slight angle from above. Show the quiver with red-feathered arrows on his back, the red cape, the wolf pelt and the bow.

Style reference: match the attached reference sheet exactly in palette and shading. Use bright, saturated colours with strong contrast: metal helmets shiny GOLD (not brown), shields saturated in the folk colour with a yellow emblem, mail light SILVER-GREY. Skin and face must stay clearly readable when the sprite is shrunk to 48 pixels (clear dark eyes, light skin tone, mouth visible). Canvas exactly as stated. Do NOT draw any grid lines, borders or separators between the cells; the cells are only an invisible layout.

AVOID: NO TEXT OF ANY KIND (no labels, captions, pose names, titles, numbers or letters above, below or next to the figures); no logos or watermark; no frame, border, grid lines or separator lines drawn between the cells; no second figure; no change of clothing or colours between cells; no difference in scale between cells 2 and 3; no realistic or painterly shading; no blurry or anti-aliased edges; no gradients; no shadow on the ground; no floor; no magenta inside the figure.
```

---

## rom_explorator | Explorator | tier 3 | light and ranged

Ontwerp: verkenner uit Veles: rode capuchon-cape (capuchon naar achteren, gezicht vrij), bruin leren wambuis, speren op de rug, signaalhoorn aan de riem.

GEBRUIK: ChatGPT | UPLOAD: rom_anker.png en rom_veles_A.png (in die volgorde) | OPSLAAN ALS: rom_explorator_A.png

```
Use the attached images as the exact reference. The FIRST image is the Roman anchor (style, palette, outline, proportions and level of detail). The SECOND image is the sheet of the previous unit in the same line (Veles): the new unit is a DIFFERENT unit of the same folk and the same line, with the same colours and base design but richer or different as described below.

Create ONE sprite sheet: canvas exactly 1536 x 1024 pixels, 16-bit JRPG pixel-art in the style of RPG Maker MV and classic Fire Emblem sprites. Layout: 3 columns by 2 rows of INVISIBLE cells, each cell exactly 512 x 512 pixels, the SAME character in all six cells. Background: one flat solid magenta #FF00FF, no gradient, no floor, no shadow on the ground. No magenta anywhere in the figure. IMPORTANT: the image contains NO TEXT of any kind: no labels, no captions, no pose names, no titles, no numbers and no letters anywhere, neither inside nor outside the cells.

CHARACTER: "Explorator", Roman unit (tier 3, branch Light and ranged, role ranged, scout with javelins). He wears: a bright red hooded cape with the hood pushed back so the face stays clearly visible (light skin, short black hair, clear dark eyes); a brown leather jerkin over a bright red tunic with short sleeves; a brown leather belt with a bronze buckle and a curved cream-coloured signal horn hanging from it; brown leather boots laced to the calf; NO helmet, NO mail, NO shield. In his right hand a short light spear with a silver head. A bundle of three javelins is tied across his back.

STYLE: chunky visible pixels, at most 24 colours, one dark-brown 1-pixel outline around the whole figure, flat cel-shading with at most two tones per colour, warm saturated fantasy colours, small chibi proportions (head about one third of body height), easy to read at small size.

PIXEL GRID: every cell is its own 64 x 64 pixel grid; every pixel is a block of 8 x 8 image pixels and all pixels in the whole image are exactly the same size. The figure is at most 56 of the 64 pixels tall with at least 4 blocks of empty magenta margin all around. Feet on the same horizontal line in every cell. The figure has the same size in every cell.

CAMERA: three-quarter top-down view (about 30 degrees above the figure, slightly in front of him), unless a pose says otherwise. Express viewing direction by camera position ("seen from behind", "facing the viewer"), not by left or right of the figure.

POSES, in this fixed order:
Row 1, cell 1, resting pose: standing relaxed, facing the viewer, the spear held loosely, looking alert.
Row 1, cell 2, attacking pose: one step forward, the spear thrown forward from the raised right hand, left arm stretched forward.
Row 1, cell 3, getting-hit pose: upper body leaning backwards, eyes closed, the spear dropping, hand raised.
Row 2, cell 1, walking-towards-the-camera pose: walking towards the camera, face and chest clearly visible, carrying the same equipment.
Row 2, cell 2, walking-sideways pose: walking to the RIGHT of the image, pure side view in profile, the shield or main item on the far side of the body.
Row 2, cell 3, walking-away pose: walking away from the camera, back, cape and the back of the equipment visible.

Style reference: match the attached reference sheet exactly in palette and shading. Use bright, saturated colours with strong contrast: metal helmets shiny GOLD (not brown), shields saturated in the folk colour with a yellow emblem, mail light SILVER-GREY. Skin and face must stay clearly readable when the sprite is shrunk to 48 pixels (clear dark eyes, light skin tone, mouth visible). Canvas exactly as stated. Do NOT draw any grid lines, borders or separators between the cells; the cells are only an invisible layout.

AVOID: NO TEXT OF ANY KIND (no labels, captions, pose names, titles, numbers or letters above, below or next to the figures); no logos or watermark; no frame, border, grid lines or separator lines drawn between the cells; no second figure; no change of clothing or colours between poses; no difference in scale between cells; no realistic or painterly shading; no blurry or anti-aliased edges; no gradients; no shadow on the ground; no floor; no magenta inside the figure.
```

GEBRUIK: ChatGPT | UPLOAD: rom_explorator_A.png en rom_tiro_B.png (in die volgorde) | OPSLAAN ALS: rom_explorator_B.png

```
Use the attached images as reference. The FIRST image (the six-cell sprite sheet of Explorator) shows THE SAME character to be redrawn: use it ONLY for the character's appearance and do NOT copy its six-cell layout. The SECOND image (the finished 3-cell sheet of the Roman recruit Tiro: portrait, battle front, battle back) shows the exact FORMAT, style, palette, outline, proportions and level of detail to follow. Your output must have the same layout as the second image: ONE row of exactly three cells, never two rows and never six cells.

Create ONE sheet: canvas exactly 1536 x 512 pixels, 16-bit JRPG pixel-art in the style of RPG Maker MV and classic Fire Emblem sprites. Layout: ONE single row of exactly 3 INVISIBLE cells side by side (NOT six cells, NOT two rows), each exactly 512 x 512 pixels, the SAME character in all three. Background: one flat solid magenta #FF00FF, no gradient, no floor, no shadow on the ground. No magenta anywhere in the figure. IMPORTANT: the image contains NO TEXT of any kind: no labels, no captions, no pose names, no titles, no numbers and no letters anywhere, neither inside nor outside the cells.

CHARACTER: "Explorator", Roman unit (tier 3, branch Light and ranged, role ranged, scout with javelins). He wears: a bright red hooded cape with the hood pushed back so the face stays clearly visible (light skin, short black hair, clear dark eyes); a brown leather jerkin over a bright red tunic with short sleeves; a brown leather belt with a bronze buckle and a curved cream-coloured signal horn hanging from it; brown leather boots laced to the calf; NO helmet, NO mail, NO shield. In his right hand a short light spear with a silver head. A bundle of three javelins is tied across his back.

STYLE: chunky visible pixels, at most 24 colours, one dark-brown 1-pixel outline around the whole figure, flat cel-shading with at most two tones per colour, warm saturated fantasy colours, small chibi proportions (head about one third of body height), easy to read at small size.

PIXEL GRID: every cell is its own 64 x 64 pixel grid; every pixel is a block of 8 x 8 image pixels and all pixels in the whole image are exactly the same size. In cells 2 and 3 the figure is at most 56 of the 64 pixels tall with at least 4 blocks of empty magenta margin all around, feet on the same horizontal line in both cells, same size in both cells.

CELLS:
Cell 1, a bust portrait: bust, three-quarter view, looking slightly to the right of the image, a stern but friendly look, more detail in the face than in the sprites; the figure fills about 60 percent of the cell. Show the red hood pushed back, the leather jerkin collar and the signal horn.
Cell 2, full body seen from the front: full body, ready for battle, straight from the front at eye level, face towards the viewer. The spear held ready in the right hand, the javelin bundle visible above his shoulder.
Cell 3, full body seen from behind: the same body exactly from behind, with a slight angle from above. Show the red hood hanging down, the bundle of javelins across his back and the red cape.

Style reference: match the attached reference sheet exactly in palette and shading. Use bright, saturated colours with strong contrast: metal helmets shiny GOLD (not brown), shields saturated in the folk colour with a yellow emblem, mail light SILVER-GREY. Skin and face must stay clearly readable when the sprite is shrunk to 48 pixels (clear dark eyes, light skin tone, mouth visible). Canvas exactly as stated. Do NOT draw any grid lines, borders or separators between the cells; the cells are only an invisible layout.

AVOID: NO TEXT OF ANY KIND (no labels, captions, pose names, titles, numbers or letters above, below or next to the figures); no logos or watermark; no frame, border, grid lines or separator lines drawn between the cells; no second figure; no change of clothing or colours between cells; no difference in scale between cells 2 and 3; no realistic or painterly shading; no blurry or anti-aliased edges; no gradients; no shadow on the ground; no floor; no magenta inside the figure.
```

---

## rom_speculator | Speculator | tier 4 | light and ranged

Ontwerp: elite-verkenner: gouden helm met korte rode pluim, zilveren maliën, rode capuchon-cape met gouden rand, dolk, werpspiezen en een rolkoker met berichten.

GEBRUIK: ChatGPT | UPLOAD: rom_anker.png en rom_explorator_A.png (in die volgorde) | OPSLAAN ALS: rom_speculator_A.png

```
Use the attached images as the exact reference. The FIRST image is the Roman anchor (style, palette, outline, proportions and level of detail). The SECOND image is the sheet of the previous unit in the same line (Explorator): the new unit is a DIFFERENT unit of the same folk and the same line, with the same colours and base design but richer or different as described below.

Create ONE sprite sheet: canvas exactly 1536 x 1024 pixels, 16-bit JRPG pixel-art in the style of RPG Maker MV and classic Fire Emblem sprites. Layout: 3 columns by 2 rows of INVISIBLE cells, each cell exactly 512 x 512 pixels, the SAME character in all six cells. Background: one flat solid magenta #FF00FF, no gradient, no floor, no shadow on the ground. No magenta anywhere in the figure. IMPORTANT: the image contains NO TEXT of any kind: no labels, no captions, no pose names, no titles, no numbers and no letters anywhere, neither inside nor outside the cells.

CHARACTER: "Speculator", Roman unit (tier 4, branch Light and ranged, role ranged, elite scout). He wears: a shiny GOLD close-fitting helmet with a short bright red plume, face open and clearly visible (light skin, short black hair, clear dark eyes); a LIGHT SILVER-GREY mail shirt over a bright red tunic with short sleeves; a bright red hooded cape with a gold border, the hood pushed back; a brown leather belt with a gold buckle, a dagger (pugio) in a brown sheath and a brown leather scroll case at the hip; brown leather boots laced to the calf with gold buckles; NO shield. In his right hand a javelin with a silver head; two more javelins across his back.

STYLE: chunky visible pixels, at most 24 colours, one dark-brown 1-pixel outline around the whole figure, flat cel-shading with at most two tones per colour, warm saturated fantasy colours, small chibi proportions (head about one third of body height), easy to read at small size.

PIXEL GRID: every cell is its own 64 x 64 pixel grid; every pixel is a block of 8 x 8 image pixels and all pixels in the whole image are exactly the same size. The figure is at most 56 of the 64 pixels tall with at least 4 blocks of empty magenta margin all around. Feet on the same horizontal line in every cell. The figure has the same size in every cell.

CAMERA: three-quarter top-down view (about 30 degrees above the figure, slightly in front of him), unless a pose says otherwise. Express viewing direction by camera position ("seen from behind", "facing the viewer"), not by left or right of the figure.

POSES, in this fixed order:
Row 1, cell 1, resting pose: standing relaxed, facing the viewer, the javelin held loosely, looking alert.
Row 1, cell 2, attacking pose: one step forward, the javelin thrown forward from the raised right hand, left arm stretched forward.
Row 1, cell 3, getting-hit pose: upper body leaning backwards, eyes closed, the javelin dropping, hand raised.
Row 2, cell 1, walking-towards-the-camera pose: walking towards the camera, face and chest clearly visible, carrying the same equipment.
Row 2, cell 2, walking-sideways pose: walking to the RIGHT of the image, pure side view in profile, the shield or main item on the far side of the body.
Row 2, cell 3, walking-away pose: walking away from the camera, back, cape and the back of the equipment visible.

Style reference: match the attached reference sheet exactly in palette and shading. Use bright, saturated colours with strong contrast: metal helmets shiny GOLD (not brown), shields saturated in the folk colour with a yellow emblem, mail light SILVER-GREY. Skin and face must stay clearly readable when the sprite is shrunk to 48 pixels (clear dark eyes, light skin tone, mouth visible). Canvas exactly as stated. Do NOT draw any grid lines, borders or separators between the cells; the cells are only an invisible layout.

AVOID: NO TEXT OF ANY KIND (no labels, captions, pose names, titles, numbers or letters above, below or next to the figures); no logos or watermark; no frame, border, grid lines or separator lines drawn between the cells; no second figure; no change of clothing or colours between poses; no difference in scale between cells; no realistic or painterly shading; no blurry or anti-aliased edges; no gradients; no shadow on the ground; no floor; no magenta inside the figure.
```

GEBRUIK: ChatGPT | UPLOAD: rom_speculator_A.png en rom_tiro_B.png (in die volgorde) | OPSLAAN ALS: rom_speculator_B.png

```
Use the attached images as reference. The FIRST image (the six-cell sprite sheet of Speculator) shows THE SAME character to be redrawn: use it ONLY for the character's appearance and do NOT copy its six-cell layout. The SECOND image (the finished 3-cell sheet of the Roman recruit Tiro: portrait, battle front, battle back) shows the exact FORMAT, style, palette, outline, proportions and level of detail to follow. Your output must have the same layout as the second image: ONE row of exactly three cells, never two rows and never six cells.

Create ONE sheet: canvas exactly 1536 x 512 pixels, 16-bit JRPG pixel-art in the style of RPG Maker MV and classic Fire Emblem sprites. Layout: ONE single row of exactly 3 INVISIBLE cells side by side (NOT six cells, NOT two rows), each exactly 512 x 512 pixels, the SAME character in all three. Background: one flat solid magenta #FF00FF, no gradient, no floor, no shadow on the ground. No magenta anywhere in the figure. IMPORTANT: the image contains NO TEXT of any kind: no labels, no captions, no pose names, no titles, no numbers and no letters anywhere, neither inside nor outside the cells.

CHARACTER: "Speculator", Roman unit (tier 4, branch Light and ranged, role ranged, elite scout). He wears: a shiny GOLD close-fitting helmet with a short bright red plume, face open and clearly visible (light skin, short black hair, clear dark eyes); a LIGHT SILVER-GREY mail shirt over a bright red tunic with short sleeves; a bright red hooded cape with a gold border, the hood pushed back; a brown leather belt with a gold buckle, a dagger (pugio) in a brown sheath and a brown leather scroll case at the hip; brown leather boots laced to the calf with gold buckles; NO shield. In his right hand a javelin with a silver head; two more javelins across his back.

STYLE: chunky visible pixels, at most 24 colours, one dark-brown 1-pixel outline around the whole figure, flat cel-shading with at most two tones per colour, warm saturated fantasy colours, small chibi proportions (head about one third of body height), easy to read at small size.

PIXEL GRID: every cell is its own 64 x 64 pixel grid; every pixel is a block of 8 x 8 image pixels and all pixels in the whole image are exactly the same size. In cells 2 and 3 the figure is at most 56 of the 64 pixels tall with at least 4 blocks of empty magenta margin all around, feet on the same horizontal line in both cells, same size in both cells.

CELLS:
Cell 1, a bust portrait: bust, three-quarter view, looking slightly to the right of the image, a stern but friendly look, more detail in the face than in the sprites; the figure fills about 60 percent of the cell. Show the gold helmet with the short red plume, the mail collar and the gold-bordered red cape.
Cell 2, full body seen from the front: full body, ready for battle, straight from the front at eye level, face towards the viewer. The javelin held ready in the right hand, the dagger and scroll case visible at the hip.
Cell 3, full body seen from behind: the same body exactly from behind, with a slight angle from above. Show the red hooded cape with gold border, the two javelins across his back and the scroll case.

Style reference: match the attached reference sheet exactly in palette and shading. Use bright, saturated colours with strong contrast: metal helmets shiny GOLD (not brown), shields saturated in the folk colour with a yellow emblem, mail light SILVER-GREY. Skin and face must stay clearly readable when the sprite is shrunk to 48 pixels (clear dark eyes, light skin tone, mouth visible). Canvas exactly as stated. Do NOT draw any grid lines, borders or separators between the cells; the cells are only an invisible layout.

AVOID: NO TEXT OF ANY KIND (no labels, captions, pose names, titles, numbers or letters above, below or next to the figures); no logos or watermark; no frame, border, grid lines or separator lines drawn between the cells; no second figure; no change of clothing or colours between cells; no difference in scale between cells 2 and 3; no realistic or painterly shading; no blurry or anti-aliased edges; no gradients; no shadow on the ground; no floor; no magenta inside the figure.
```

---

## rom_eques | Eques | tier 2 | cavalry

Ontwerp: ruiter te paard uit Tiro: kastanjebruin paard met rode zadeldeken, ruiter met gouden helm met kleine rode kam, zilvergrijs maliën, ovaal rood schild en lang zwaard (spatha).

GEBRUIK: ChatGPT | UPLOAD: rom_anker.png en rom_tiro_A.png (in die volgorde) | OPSLAAN ALS: rom_eques_A.png

```
Use the attached images as the exact reference. The FIRST image is the Roman anchor (style, palette, outline, proportions and level of detail). The SECOND image is the sheet of the previous unit in the same line (Tiro): the new unit is a DIFFERENT unit of the same folk and the same line, with the same colours and base design but richer or different as described below.

Create ONE sprite sheet: canvas exactly 1536 x 1024 pixels, 16-bit JRPG pixel-art in the style of RPG Maker MV and classic Fire Emblem sprites. Layout: 3 columns by 2 rows of INVISIBLE cells, each cell exactly 512 x 512 pixels, the SAME character in all six cells. Background: one flat solid magenta #FF00FF, no gradient, no floor, no shadow on the ground. No magenta anywhere in the figure. IMPORTANT: the image contains NO TEXT of any kind: no labels, no captions, no pose names, no titles, no numbers and no letters anywhere, neither inside nor outside the cells.

CHARACTER: "Eques", Roman unit (tier 2, branch Cavalry, role cavalry, mounted rider). The figure is a rider on a horse, drawn as ONE whole. The horse is chestnut brown with a darker mane and tail, a bright red saddle blanket with a gold border and brown leather harness with bronze buckles. The rider wears: a shiny GOLD helmet with a small bright red crest, face open and clearly visible (light skin, short black hair, clear dark eyes); a LIGHT SILVER-GREY mail shirt over a bright red tunic; a bright red cape flowing behind him; brown leather boots. In his left hand an OVAL shield painted saturated red with a yellow lightning-bolt emblem and a gold rim. In his right hand a long straight sword (spatha) with a silver blade. The horse is part of the figure and fills the cell, but the margin requirement still holds.

STYLE: chunky visible pixels, at most 24 colours, one dark-brown 1-pixel outline around the whole figure, flat cel-shading with at most two tones per colour, warm saturated fantasy colours, small chibi proportions (head about one third of body height), easy to read at small size.

PIXEL GRID: every cell is its own 64 x 64 pixel grid; every pixel is a block of 8 x 8 image pixels and all pixels in the whole image are exactly the same size. The figure is at most 56 of the 64 pixels tall with at least 4 blocks of empty magenta margin all around. Feet on the same horizontal line in every cell. The figure has the same size in every cell.

CAMERA: three-quarter top-down view (about 30 degrees above the figure, slightly in front of him), unless a pose says otherwise. Express viewing direction by camera position ("seen from behind", "facing the viewer"), not by left or right of the figure.

POSES, in this fixed order:
Row 1, cell 1, resting pose: the horse standing still, the rider upright in the saddle facing the viewer, the spatha resting on his shoulder, the shield at his side.
Row 1, cell 2, attacking pose: the horse taking a step forward, the rider leaning forward and thrusting the spatha forward, shield raised.
Row 1, cell 3, getting-hit pose: the horse stepping back and tossing its head, the rider leaning backwards with eyes closed, shield sagging.
Row 2, cell 1, walking-towards-the-camera pose: walking towards the camera, face and chest clearly visible, carrying the same equipment.
Row 2, cell 2, walking-sideways pose: walking to the RIGHT of the image, pure side view in profile, the shield or main item on the far side of the body.
Row 2, cell 3, walking-away pose: walking away from the camera, back, cape and the back of the equipment visible.

Style reference: match the attached reference sheet exactly in palette and shading. Use bright, saturated colours with strong contrast: metal helmets shiny GOLD (not brown), shields saturated in the folk colour with a yellow emblem, mail light SILVER-GREY. Skin and face must stay clearly readable when the sprite is shrunk to 48 pixels (clear dark eyes, light skin tone, mouth visible). Canvas exactly as stated. Do NOT draw any grid lines, borders or separators between the cells; the cells are only an invisible layout.

AVOID: NO TEXT OF ANY KIND (no labels, captions, pose names, titles, numbers or letters above, below or next to the figures); no logos or watermark; no frame, border, grid lines or separator lines drawn between the cells; no second figure; no change of clothing or colours between poses; no difference in scale between cells; no realistic or painterly shading; no blurry or anti-aliased edges; no gradients; no shadow on the ground; no floor; no magenta inside the figure.
```

GEBRUIK: ChatGPT | UPLOAD: rom_eques_A.png en rom_tiro_B.png (in die volgorde) | OPSLAAN ALS: rom_eques_B.png

```
Use the attached images as reference. The FIRST image (the six-cell sprite sheet of Eques) shows THE SAME character to be redrawn: use it ONLY for the character's appearance and do NOT copy its six-cell layout. The SECOND image (the finished 3-cell sheet of the Roman recruit Tiro: portrait, battle front, battle back) shows the exact FORMAT, style, palette, outline, proportions and level of detail to follow. Your output must have the same layout as the second image: ONE row of exactly three cells, never two rows and never six cells.

Create ONE sheet: canvas exactly 1536 x 512 pixels, 16-bit JRPG pixel-art in the style of RPG Maker MV and classic Fire Emblem sprites. Layout: ONE single row of exactly 3 INVISIBLE cells side by side (NOT six cells, NOT two rows), each exactly 512 x 512 pixels, the SAME character in all three. Background: one flat solid magenta #FF00FF, no gradient, no floor, no shadow on the ground. No magenta anywhere in the figure. IMPORTANT: the image contains NO TEXT of any kind: no labels, no captions, no pose names, no titles, no numbers and no letters anywhere, neither inside nor outside the cells.

CHARACTER: "Eques", Roman unit (tier 2, branch Cavalry, role cavalry, mounted rider). The figure is a rider on a horse, drawn as ONE whole. The horse is chestnut brown with a darker mane and tail, a bright red saddle blanket with a gold border and brown leather harness with bronze buckles. The rider wears: a shiny GOLD helmet with a small bright red crest, face open and clearly visible (light skin, short black hair, clear dark eyes); a LIGHT SILVER-GREY mail shirt over a bright red tunic; a bright red cape flowing behind him; brown leather boots. In his left hand an OVAL shield painted saturated red with a yellow lightning-bolt emblem and a gold rim. In his right hand a long straight sword (spatha) with a silver blade. The horse is part of the figure and fills the cell, but the margin requirement still holds.

STYLE: chunky visible pixels, at most 24 colours, one dark-brown 1-pixel outline around the whole figure, flat cel-shading with at most two tones per colour, warm saturated fantasy colours, small chibi proportions (head about one third of body height), easy to read at small size.

PIXEL GRID: every cell is its own 64 x 64 pixel grid; every pixel is a block of 8 x 8 image pixels and all pixels in the whole image are exactly the same size. In cells 2 and 3 the figure is at most 56 of the 64 pixels tall with at least 4 blocks of empty magenta margin all around, feet on the same horizontal line in both cells, same size in both cells.

CELLS:
Cell 1, a bust portrait: bust, three-quarter view, looking slightly to the right of the image, a stern but friendly look, more detail in the face than in the sprites; the figure fills about 60 percent of the cell. Show the gold helmet with the red crest, the silver mail collar, the red cape and the horse's head beside him.
Cell 2, full body seen from the front: full body, ready for battle, straight from the front at eye level, face towards the viewer. The horse seen from the front with the rider upright, spatha raised, shield on the left arm.
Cell 3, full body seen from behind: the same body exactly from behind, with a slight angle from above. Show the horse from behind with its tail and the red saddle blanket, the rider's back, the red cape and the back of the oval shield.

Style reference: match the attached reference sheet exactly in palette and shading. Use bright, saturated colours with strong contrast: metal helmets shiny GOLD (not brown), shields saturated in the folk colour with a yellow emblem, mail light SILVER-GREY. Skin and face must stay clearly readable when the sprite is shrunk to 48 pixels (clear dark eyes, light skin tone, mouth visible). Canvas exactly as stated. Do NOT draw any grid lines, borders or separators between the cells; the cells are only an invisible layout.

AVOID: NO TEXT OF ANY KIND (no labels, captions, pose names, titles, numbers or letters above, below or next to the figures); no logos or watermark; no frame, border, grid lines or separator lines drawn between the cells; no second figure; no change of clothing or colours between cells; no difference in scale between cells 2 and 3; no realistic or painterly shading; no blurry or anti-aliased edges; no gradients; no shadow on the ground; no floor; no magenta inside the figure.
```

---

## rom_decurio | Decurio | tier 3 | cavalry

Ontwerp: ruiter-aanvoerder uit Eques: hogere kam met twee rode veren, gouden schouderversieringen, lans met rode wimpel, rijker paardentuig met gouden studs.

GEBRUIK: ChatGPT | UPLOAD: rom_anker.png en rom_eques_A.png (in die volgorde) | OPSLAAN ALS: rom_decurio_A.png

```
Use the attached images as the exact reference. The FIRST image is the Roman anchor (style, palette, outline, proportions and level of detail). The SECOND image is the sheet of the previous unit in the same line (Eques): the new unit is a DIFFERENT unit of the same folk and the same line, with the same colours and base design but richer or different as described below.

Create ONE sprite sheet: canvas exactly 1536 x 1024 pixels, 16-bit JRPG pixel-art in the style of RPG Maker MV and classic Fire Emblem sprites. Layout: 3 columns by 2 rows of INVISIBLE cells, each cell exactly 512 x 512 pixels, the SAME character in all six cells. Background: one flat solid magenta #FF00FF, no gradient, no floor, no shadow on the ground. No magenta anywhere in the figure. IMPORTANT: the image contains NO TEXT of any kind: no labels, no captions, no pose names, no titles, no numbers and no letters anywhere, neither inside nor outside the cells.

CHARACTER: "Decurio", Roman unit (tier 3, branch Cavalry, role cavalry, mounted officer). The figure is a rider on a horse, drawn as ONE whole. The horse is chestnut brown with a darker mane and tail, a bright red saddle blanket with a gold border wider than the Eques', and brown leather harness with shiny gold studs. The rider wears: a shiny GOLD helmet with a taller bright red crest and two upright red feathers, face open and clearly visible (light skin, short black hair, clear dark eyes); a LIGHT SILVER-GREY mail shirt with gold-edged shoulder doublings over a bright red tunic; a longer bright red cape flowing behind him; shiny gold greaves; brown leather boots. In his left hand an OVAL shield saturated red with a yellow lightning bolt and a wider gold rim. In his right hand a long lance with a silver head and a small bright red pennant. A spatha in a brown scabbard at his hip. The horse is part of the figure and fills the cell, but the margin requirement still holds.

STYLE: chunky visible pixels, at most 24 colours, one dark-brown 1-pixel outline around the whole figure, flat cel-shading with at most two tones per colour, warm saturated fantasy colours, small chibi proportions (head about one third of body height), easy to read at small size.

PIXEL GRID: every cell is its own 64 x 64 pixel grid; every pixel is a block of 8 x 8 image pixels and all pixels in the whole image are exactly the same size. The figure is at most 56 of the 64 pixels tall with at least 4 blocks of empty magenta margin all around. Feet on the same horizontal line in every cell. The figure has the same size in every cell.

CAMERA: three-quarter top-down view (about 30 degrees above the figure, slightly in front of him), unless a pose says otherwise. Express viewing direction by camera position ("seen from behind", "facing the viewer"), not by left or right of the figure.

POSES, in this fixed order:
Row 1, cell 1, resting pose: the horse standing still, the rider upright in the saddle facing the viewer, the lance held upright, the shield at his side.
Row 1, cell 2, attacking pose: the horse taking a step forward, the rider leaning forward with the lance levelled forward, pennant flying, shield raised.
Row 1, cell 3, getting-hit pose: the horse stepping back and tossing its head, the rider leaning backwards with eyes closed, lance tilting.
Row 2, cell 1, walking-towards-the-camera pose: walking towards the camera, face and chest clearly visible, carrying the same equipment.
Row 2, cell 2, walking-sideways pose: walking to the RIGHT of the image, pure side view in profile, the shield or main item on the far side of the body.
Row 2, cell 3, walking-away pose: walking away from the camera, back, cape and the back of the equipment visible.

Style reference: match the attached reference sheet exactly in palette and shading. Use bright, saturated colours with strong contrast: metal helmets shiny GOLD (not brown), shields saturated in the folk colour with a yellow emblem, mail light SILVER-GREY. Skin and face must stay clearly readable when the sprite is shrunk to 48 pixels (clear dark eyes, light skin tone, mouth visible). Canvas exactly as stated. Do NOT draw any grid lines, borders or separators between the cells; the cells are only an invisible layout.

AVOID: NO TEXT OF ANY KIND (no labels, captions, pose names, titles, numbers or letters above, below or next to the figures); no logos or watermark; no frame, border, grid lines or separator lines drawn between the cells; no second figure; no change of clothing or colours between poses; no difference in scale between cells; no realistic or painterly shading; no blurry or anti-aliased edges; no gradients; no shadow on the ground; no floor; no magenta inside the figure.
```

GEBRUIK: ChatGPT | UPLOAD: rom_decurio_A.png en rom_tiro_B.png (in die volgorde) | OPSLAAN ALS: rom_decurio_B.png

```
Use the attached images as reference. The FIRST image (the six-cell sprite sheet of Decurio) shows THE SAME character to be redrawn: use it ONLY for the character's appearance and do NOT copy its six-cell layout. The SECOND image (the finished 3-cell sheet of the Roman recruit Tiro: portrait, battle front, battle back) shows the exact FORMAT, style, palette, outline, proportions and level of detail to follow. Your output must have the same layout as the second image: ONE row of exactly three cells, never two rows and never six cells.

Create ONE sheet: canvas exactly 1536 x 512 pixels, 16-bit JRPG pixel-art in the style of RPG Maker MV and classic Fire Emblem sprites. Layout: ONE single row of exactly 3 INVISIBLE cells side by side (NOT six cells, NOT two rows), each exactly 512 x 512 pixels, the SAME character in all three. Background: one flat solid magenta #FF00FF, no gradient, no floor, no shadow on the ground. No magenta anywhere in the figure. IMPORTANT: the image contains NO TEXT of any kind: no labels, no captions, no pose names, no titles, no numbers and no letters anywhere, neither inside nor outside the cells.

CHARACTER: "Decurio", Roman unit (tier 3, branch Cavalry, role cavalry, mounted officer). The figure is a rider on a horse, drawn as ONE whole. The horse is chestnut brown with a darker mane and tail, a bright red saddle blanket with a gold border wider than the Eques', and brown leather harness with shiny gold studs. The rider wears: a shiny GOLD helmet with a taller bright red crest and two upright red feathers, face open and clearly visible (light skin, short black hair, clear dark eyes); a LIGHT SILVER-GREY mail shirt with gold-edged shoulder doublings over a bright red tunic; a longer bright red cape flowing behind him; shiny gold greaves; brown leather boots. In his left hand an OVAL shield saturated red with a yellow lightning bolt and a wider gold rim. In his right hand a long lance with a silver head and a small bright red pennant. A spatha in a brown scabbard at his hip. The horse is part of the figure and fills the cell, but the margin requirement still holds.

STYLE: chunky visible pixels, at most 24 colours, one dark-brown 1-pixel outline around the whole figure, flat cel-shading with at most two tones per colour, warm saturated fantasy colours, small chibi proportions (head about one third of body height), easy to read at small size.

PIXEL GRID: every cell is its own 64 x 64 pixel grid; every pixel is a block of 8 x 8 image pixels and all pixels in the whole image are exactly the same size. In cells 2 and 3 the figure is at most 56 of the 64 pixels tall with at least 4 blocks of empty magenta margin all around, feet on the same horizontal line in both cells, same size in both cells.

CELLS:
Cell 1, a bust portrait: bust, three-quarter view, looking slightly to the right of the image, a stern but friendly look, more detail in the face than in the sprites; the figure fills about 60 percent of the cell. Show the gold helmet with the two red feathers, the gold shoulder doublings and the red cape.
Cell 2, full body seen from the front: full body, ready for battle, straight from the front at eye level, face towards the viewer. The horse seen from the front, the rider upright with the lance raised and the shield on the left arm.
Cell 3, full body seen from behind: the same body exactly from behind, with a slight angle from above. Show the horse from behind, the rider's back, the long red cape, the pennant and the back of the oval shield.

Style reference: match the attached reference sheet exactly in palette and shading. Use bright, saturated colours with strong contrast: metal helmets shiny GOLD (not brown), shields saturated in the folk colour with a yellow emblem, mail light SILVER-GREY. Skin and face must stay clearly readable when the sprite is shrunk to 48 pixels (clear dark eyes, light skin tone, mouth visible). Canvas exactly as stated. Do NOT draw any grid lines, borders or separators between the cells; the cells are only an invisible layout.

AVOID: NO TEXT OF ANY KIND (no labels, captions, pose names, titles, numbers or letters above, below or next to the figures); no logos or watermark; no frame, border, grid lines or separator lines drawn between the cells; no second figure; no change of clothing or colours between cells; no difference in scale between cells 2 and 3; no realistic or painterly shading; no blurry or anti-aliased edges; no gradients; no shadow on the ground; no floor; no magenta inside the figure.
```

---

## rom_praefectusalae | Praefectus alae | tier 4 | cavalry

Ontwerp: commandant van de ruiterij, rijkste vorm van de lijn: gouden borstharnas, lange pluim, lans met rode vaan, paard met witte bles en gouden tuig.

GEBRUIK: ChatGPT | UPLOAD: rom_anker.png en rom_decurio_A.png (in die volgorde) | OPSLAAN ALS: rom_praefectusalae_A.png

```
Use the attached images as the exact reference. The FIRST image is the Roman anchor (style, palette, outline, proportions and level of detail). The SECOND image is the sheet of the previous unit in the same line (Decurio): the new unit is a DIFFERENT unit of the same folk and the same line, with the same colours and base design but richer or different as described below.

Create ONE sprite sheet: canvas exactly 1536 x 1024 pixels, 16-bit JRPG pixel-art in the style of RPG Maker MV and classic Fire Emblem sprites. Layout: 3 columns by 2 rows of INVISIBLE cells, each cell exactly 512 x 512 pixels, the SAME character in all six cells. Background: one flat solid magenta #FF00FF, no gradient, no floor, no shadow on the ground. No magenta anywhere in the figure. IMPORTANT: the image contains NO TEXT of any kind: no labels, no captions, no pose names, no titles, no numbers and no letters anywhere, neither inside nor outside the cells.

CHARACTER: "Praefectus alae", Roman unit (tier 4, branch Cavalry, role cavalry, commander). The figure is a rider on a horse, drawn as ONE whole. The horse is chestnut brown with a white blaze on its face, a darker mane and tail, a rich bright red saddle blanket with a wide gold border and gold fringe, and brown leather harness with many shiny gold discs. The rider wears: a shiny GOLD helmet with a very tall bright red horsehair plume, face open and clearly visible (light skin, short black hair, clear dark eyes, a commanding look); a shiny GOLD muscle cuirass over a bright red tunic with LIGHT SILVER-GREY mail sleeves; a long rich bright red cape flowing behind him with a round gold clasp; shiny gold greaves; brown leather boots. In his left hand a large OVAL shield saturated red with a yellow lightning bolt, a very wide gold rim and a gold boss. In his right hand a long lance with a silver head and a square bright red banner. A spatha in a brown scabbard at his hip. The horse is part of the figure and fills the cell, but the margin requirement still holds.

STYLE: chunky visible pixels, at most 24 colours, one dark-brown 1-pixel outline around the whole figure, flat cel-shading with at most two tones per colour, warm saturated fantasy colours, small chibi proportions (head about one third of body height), easy to read at small size.

PIXEL GRID: every cell is its own 64 x 64 pixel grid; every pixel is a block of 8 x 8 image pixels and all pixels in the whole image are exactly the same size. The figure is at most 56 of the 64 pixels tall with at least 4 blocks of empty magenta margin all around. Feet on the same horizontal line in every cell. The figure has the same size in every cell.

CAMERA: three-quarter top-down view (about 30 degrees above the figure, slightly in front of him), unless a pose says otherwise. Express viewing direction by camera position ("seen from behind", "facing the viewer"), not by left or right of the figure.

POSES, in this fixed order:
Row 1, cell 1, resting pose: the horse standing proudly, the rider upright in the saddle facing the viewer, the lance held upright, the shield at his side.
Row 1, cell 2, attacking pose: the horse taking a step forward, the rider leaning forward with the lance levelled forward, banner flying, shield raised.
Row 1, cell 3, getting-hit pose: the horse stepping back and tossing its head, the rider leaning backwards with eyes closed, lance tilting.
Row 2, cell 1, walking-towards-the-camera pose: walking towards the camera, face and chest clearly visible, carrying the same equipment.
Row 2, cell 2, walking-sideways pose: walking to the RIGHT of the image, pure side view in profile, the shield or main item on the far side of the body.
Row 2, cell 3, walking-away pose: walking away from the camera, back, cape and the back of the equipment visible.

Style reference: match the attached reference sheet exactly in palette and shading. Use bright, saturated colours with strong contrast: metal helmets shiny GOLD (not brown), shields saturated in the folk colour with a yellow emblem, mail light SILVER-GREY. Skin and face must stay clearly readable when the sprite is shrunk to 48 pixels (clear dark eyes, light skin tone, mouth visible). Canvas exactly as stated. Do NOT draw any grid lines, borders or separators between the cells; the cells are only an invisible layout.

AVOID: NO TEXT OF ANY KIND (no labels, captions, pose names, titles, numbers or letters above, below or next to the figures); no logos or watermark; no frame, border, grid lines or separator lines drawn between the cells; no second figure; no change of clothing or colours between poses; no difference in scale between cells; no realistic or painterly shading; no blurry or anti-aliased edges; no gradients; no shadow on the ground; no floor; no magenta inside the figure.
```

GEBRUIK: ChatGPT | UPLOAD: rom_praefectusalae_A.png en rom_tiro_B.png (in die volgorde) | OPSLAAN ALS: rom_praefectusalae_B.png

```
Use the attached images as reference. The FIRST image (the six-cell sprite sheet of Praefectus alae) shows THE SAME character to be redrawn: use it ONLY for the character's appearance and do NOT copy its six-cell layout. The SECOND image (the finished 3-cell sheet of the Roman recruit Tiro: portrait, battle front, battle back) shows the exact FORMAT, style, palette, outline, proportions and level of detail to follow. Your output must have the same layout as the second image: ONE row of exactly three cells, never two rows and never six cells.

Create ONE sheet: canvas exactly 1536 x 512 pixels, 16-bit JRPG pixel-art in the style of RPG Maker MV and classic Fire Emblem sprites. Layout: ONE single row of exactly 3 INVISIBLE cells side by side (NOT six cells, NOT two rows), each exactly 512 x 512 pixels, the SAME character in all three. Background: one flat solid magenta #FF00FF, no gradient, no floor, no shadow on the ground. No magenta anywhere in the figure. IMPORTANT: the image contains NO TEXT of any kind: no labels, no captions, no pose names, no titles, no numbers and no letters anywhere, neither inside nor outside the cells.

CHARACTER: "Praefectus alae", Roman unit (tier 4, branch Cavalry, role cavalry, commander). The figure is a rider on a horse, drawn as ONE whole. The horse is chestnut brown with a white blaze on its face, a darker mane and tail, a rich bright red saddle blanket with a wide gold border and gold fringe, and brown leather harness with many shiny gold discs. The rider wears: a shiny GOLD helmet with a very tall bright red horsehair plume, face open and clearly visible (light skin, short black hair, clear dark eyes, a commanding look); a shiny GOLD muscle cuirass over a bright red tunic with LIGHT SILVER-GREY mail sleeves; a long rich bright red cape flowing behind him with a round gold clasp; shiny gold greaves; brown leather boots. In his left hand a large OVAL shield saturated red with a yellow lightning bolt, a very wide gold rim and a gold boss. In his right hand a long lance with a silver head and a square bright red banner. A spatha in a brown scabbard at his hip. The horse is part of the figure and fills the cell, but the margin requirement still holds.

STYLE: chunky visible pixels, at most 24 colours, one dark-brown 1-pixel outline around the whole figure, flat cel-shading with at most two tones per colour, warm saturated fantasy colours, small chibi proportions (head about one third of body height), easy to read at small size.

PIXEL GRID: every cell is its own 64 x 64 pixel grid; every pixel is a block of 8 x 8 image pixels and all pixels in the whole image are exactly the same size. In cells 2 and 3 the figure is at most 56 of the 64 pixels tall with at least 4 blocks of empty magenta margin all around, feet on the same horizontal line in both cells, same size in both cells.

CELLS:
Cell 1, a bust portrait: bust, three-quarter view, looking slightly to the right of the image, a stern but friendly look, more detail in the face than in the sprites; the figure fills about 60 percent of the cell. Show the tall red plume, the gold cuirass, the gold clasp of the cape and the commanding face.
Cell 2, full body seen from the front: full body, ready for battle, straight from the front at eye level, face towards the viewer. The horse seen from the front with its white blaze, the rider upright with the lance raised and the shield on the left arm.
Cell 3, full body seen from behind: the same body exactly from behind, with a slight angle from above. Show the horse from behind, the rider's back with the long red cape, the banner and the back of the oval shield.

Style reference: match the attached reference sheet exactly in palette and shading. Use bright, saturated colours with strong contrast: metal helmets shiny GOLD (not brown), shields saturated in the folk colour with a yellow emblem, mail light SILVER-GREY. Skin and face must stay clearly readable when the sprite is shrunk to 48 pixels (clear dark eyes, light skin tone, mouth visible). Canvas exactly as stated. Do NOT draw any grid lines, borders or separators between the cells; the cells are only an invisible layout.

AVOID: NO TEXT OF ANY KIND (no labels, captions, pose names, titles, numbers or letters above, below or next to the figures); no logos or watermark; no frame, border, grid lines or separator lines drawn between the cells; no second figure; no change of clothing or colours between cells; no difference in scale between cells 2 and 3; no realistic or painterly shading; no blurry or anti-aliased edges; no gradients; no shadow on the ground; no floor; no magenta inside the figure.
```

---

## rom_faber | Faber | tier 2 | technical

Ontwerp: ingenieur uit Tiro: rode hoofdband, bruin leren schort over rode tuniek, hamer, zaag in de gereedschapstas. Geen wapen, geen schild.

GEBRUIK: ChatGPT | UPLOAD: rom_anker.png en rom_tiro_A.png (in die volgorde) | OPSLAAN ALS: rom_faber_A.png

```
Use the attached images as the exact reference. The FIRST image is the Roman anchor (style, palette, outline, proportions and level of detail). The SECOND image is the sheet of the previous unit in the same line (Tiro): the new unit is a DIFFERENT unit of the same folk and the same line, with the same colours and base design but richer or different as described below.

Create ONE sprite sheet: canvas exactly 1536 x 1024 pixels, 16-bit JRPG pixel-art in the style of RPG Maker MV and classic Fire Emblem sprites. Layout: 3 columns by 2 rows of INVISIBLE cells, each cell exactly 512 x 512 pixels, the SAME character in all six cells. Background: one flat solid magenta #FF00FF, no gradient, no floor, no shadow on the ground. No magenta anywhere in the figure. IMPORTANT: the image contains NO TEXT of any kind: no labels, no captions, no pose names, no titles, no numbers and no letters anywhere, neither inside nor outside the cells.

CHARACTER: "Faber", Roman unit (tier 2, branch Technical, role support, engineer). He wears: NO helmet, a bright red headband over short black hair, face clearly visible (light skin, clear dark eyes, a cheerful look); a bright red short-sleeved tunic under a long brown leather apron; a short bright red cape; a brown leather belt with a bronze buckle and a brown leather tool bag at the left hip with the handle of a saw sticking out; leather wristbands; brown leather sandals with straps; NO armour and NO shield. In his right hand a large hammer with a silver-grey head and a light-brown wooden handle.

STYLE: chunky visible pixels, at most 24 colours, one dark-brown 1-pixel outline around the whole figure, flat cel-shading with at most two tones per colour, warm saturated fantasy colours, small chibi proportions (head about one third of body height), easy to read at small size.

PIXEL GRID: every cell is its own 64 x 64 pixel grid; every pixel is a block of 8 x 8 image pixels and all pixels in the whole image are exactly the same size. The figure is at most 56 of the 64 pixels tall with at least 4 blocks of empty magenta margin all around. Feet on the same horizontal line in every cell. The figure has the same size in every cell.

CAMERA: three-quarter top-down view (about 30 degrees above the figure, slightly in front of him), unless a pose says otherwise. Express viewing direction by camera position ("seen from behind", "facing the viewer"), not by left or right of the figure.

POSES, in this fixed order:
Row 1, cell 1, resting pose: standing relaxed, facing the viewer, the hammer resting on his shoulder.
Row 1, cell 2, attacking pose: one step forward, the hammer swung forward and down in both hands.
Row 1, cell 3, getting-hit pose: upper body leaning backwards, eyes closed, the hammer dropping, hand raised.
Row 2, cell 1, walking-towards-the-camera pose: walking towards the camera, face and chest clearly visible, carrying the same equipment.
Row 2, cell 2, walking-sideways pose: walking to the RIGHT of the image, pure side view in profile, the shield or main item on the far side of the body.
Row 2, cell 3, walking-away pose: walking away from the camera, back, cape and the back of the equipment visible.

Style reference: match the attached reference sheet exactly in palette and shading. Use bright, saturated colours with strong contrast: metal helmets shiny GOLD (not brown), shields saturated in the folk colour with a yellow emblem, mail light SILVER-GREY. Skin and face must stay clearly readable when the sprite is shrunk to 48 pixels (clear dark eyes, light skin tone, mouth visible). Canvas exactly as stated. Do NOT draw any grid lines, borders or separators between the cells; the cells are only an invisible layout.

AVOID: NO TEXT OF ANY KIND (no labels, captions, pose names, titles, numbers or letters above, below or next to the figures); no logos or watermark; no frame, border, grid lines or separator lines drawn between the cells; no second figure; no change of clothing or colours between poses; no difference in scale between cells; no realistic or painterly shading; no blurry or anti-aliased edges; no gradients; no shadow on the ground; no floor; no magenta inside the figure.
```

GEBRUIK: ChatGPT | UPLOAD: rom_faber_A.png en rom_tiro_B.png (in die volgorde) | OPSLAAN ALS: rom_faber_B.png

```
Use the attached images as reference. The FIRST image (the six-cell sprite sheet of Faber) shows THE SAME character to be redrawn: use it ONLY for the character's appearance and do NOT copy its six-cell layout. The SECOND image (the finished 3-cell sheet of the Roman recruit Tiro: portrait, battle front, battle back) shows the exact FORMAT, style, palette, outline, proportions and level of detail to follow. Your output must have the same layout as the second image: ONE row of exactly three cells, never two rows and never six cells.

Create ONE sheet: canvas exactly 1536 x 512 pixels, 16-bit JRPG pixel-art in the style of RPG Maker MV and classic Fire Emblem sprites. Layout: ONE single row of exactly 3 INVISIBLE cells side by side (NOT six cells, NOT two rows), each exactly 512 x 512 pixels, the SAME character in all three. Background: one flat solid magenta #FF00FF, no gradient, no floor, no shadow on the ground. No magenta anywhere in the figure. IMPORTANT: the image contains NO TEXT of any kind: no labels, no captions, no pose names, no titles, no numbers and no letters anywhere, neither inside nor outside the cells.

CHARACTER: "Faber", Roman unit (tier 2, branch Technical, role support, engineer). He wears: NO helmet, a bright red headband over short black hair, face clearly visible (light skin, clear dark eyes, a cheerful look); a bright red short-sleeved tunic under a long brown leather apron; a short bright red cape; a brown leather belt with a bronze buckle and a brown leather tool bag at the left hip with the handle of a saw sticking out; leather wristbands; brown leather sandals with straps; NO armour and NO shield. In his right hand a large hammer with a silver-grey head and a light-brown wooden handle.

STYLE: chunky visible pixels, at most 24 colours, one dark-brown 1-pixel outline around the whole figure, flat cel-shading with at most two tones per colour, warm saturated fantasy colours, small chibi proportions (head about one third of body height), easy to read at small size.

PIXEL GRID: every cell is its own 64 x 64 pixel grid; every pixel is a block of 8 x 8 image pixels and all pixels in the whole image are exactly the same size. In cells 2 and 3 the figure is at most 56 of the 64 pixels tall with at least 4 blocks of empty magenta margin all around, feet on the same horizontal line in both cells, same size in both cells.

CELLS:
Cell 1, a bust portrait: bust, three-quarter view, looking slightly to the right of the image, a stern but friendly look, more detail in the face than in the sprites; the figure fills about 60 percent of the cell. Show the red headband, the leather apron strap and the red cape.
Cell 2, full body seen from the front: full body, ready for battle, straight from the front at eye level, face towards the viewer. The hammer held ready in his right hand, the tool bag at his hip.
Cell 3, full body seen from behind: the same body exactly from behind, with a slight angle from above. Show the red cape, the tie of the leather apron, the tool bag with the saw handle and the hammer.

Style reference: match the attached reference sheet exactly in palette and shading. Use bright, saturated colours with strong contrast: metal helmets shiny GOLD (not brown), shields saturated in the folk colour with a yellow emblem, mail light SILVER-GREY. Skin and face must stay clearly readable when the sprite is shrunk to 48 pixels (clear dark eyes, light skin tone, mouth visible). Canvas exactly as stated. Do NOT draw any grid lines, borders or separators between the cells; the cells are only an invisible layout.

AVOID: NO TEXT OF ANY KIND (no labels, captions, pose names, titles, numbers or letters above, below or next to the figures); no logos or watermark; no frame, border, grid lines or separator lines drawn between the cells; no second figure; no change of clothing or colours between cells; no difference in scale between cells 2 and 3; no realistic or painterly shading; no blurry or anti-aliased edges; no gradients; no shadow on the ground; no floor; no magenta inside the figure.
```

---

## rom_ballistarius | Ballistarius | tier 3 | technical

Ontwerp: artillerist uit Faber: gouden kaphelm zonder kam met rode band, leren borstlap, handballista (manuballista) in beide handen, pijlenkoker met korte bouten op de rug, gereedschapstas blijft.

GEBRUIK: ChatGPT | UPLOAD: rom_anker.png en rom_faber_A.png (in die volgorde) | OPSLAAN ALS: rom_ballistarius_A.png

```
Use the attached images as the exact reference. The FIRST image is the Roman anchor (style, palette, outline, proportions and level of detail). The SECOND image is the sheet of the previous unit in the same line (Faber): the new unit is a DIFFERENT unit of the same folk and the same line, with the same colours and base design but richer or different as described below.

Create ONE sprite sheet: canvas exactly 1536 x 1024 pixels, 16-bit JRPG pixel-art in the style of RPG Maker MV and classic Fire Emblem sprites. Layout: 3 columns by 2 rows of INVISIBLE cells, each cell exactly 512 x 512 pixels, the SAME character in all six cells. Background: one flat solid magenta #FF00FF, no gradient, no floor, no shadow on the ground. No magenta anywhere in the figure. IMPORTANT: the image contains NO TEXT of any kind: no labels, no captions, no pose names, no titles, no numbers and no letters anywhere, neither inside nor outside the cells.

CHARACTER: "Ballistarius", Roman unit (tier 3, branch Technical, role ranged, bolt-thrower operator). He wears: a plain shiny GOLD round-topped helmet without a crest, a bright red band around its lower edge, face open and clearly visible (light skin, short black hair, clear dark eyes, a focused look); a bright red short-sleeved tunic under a brown leather chest guard with bronze studs; a short bright red cape; a brown leather belt with a bronze buckle and the brown leather tool bag at the left hip; leather wristbands; brown leather sandals with straps; NO shield. In both hands a large wooden hand-held bolt-thrower (manuballista, like a big crossbow) with a silver-grey iron stirrup and a loaded short bolt. On his back a brown leather quiver full of short bolts with red feathers.

STYLE: chunky visible pixels, at most 24 colours, one dark-brown 1-pixel outline around the whole figure, flat cel-shading with at most two tones per colour, warm saturated fantasy colours, small chibi proportions (head about one third of body height), easy to read at small size.

PIXEL GRID: every cell is its own 64 x 64 pixel grid; every pixel is a block of 8 x 8 image pixels and all pixels in the whole image are exactly the same size. The figure is at most 56 of the 64 pixels tall with at least 4 blocks of empty magenta margin all around. Feet on the same horizontal line in every cell. The figure has the same size in every cell.

CAMERA: three-quarter top-down view (about 30 degrees above the figure, slightly in front of him), unless a pose says otherwise. Express viewing direction by camera position ("seen from behind", "facing the viewer"), not by left or right of the figure.

POSES, in this fixed order:
Row 1, cell 1, resting pose: standing relaxed, facing the viewer, the bolt-thrower held low across his body.
Row 1, cell 2, attacking pose: one step forward, the bolt-thrower raised to his shoulder and aimed forward, one eye narrowed.
Row 1, cell 3, getting-hit pose: upper body leaning backwards, eyes closed, the bolt-thrower dropping, hand raised.
Row 2, cell 1, walking-towards-the-camera pose: walking towards the camera, face and chest clearly visible, carrying the same equipment.
Row 2, cell 2, walking-sideways pose: walking to the RIGHT of the image, pure side view in profile, the shield or main item on the far side of the body.
Row 2, cell 3, walking-away pose: walking away from the camera, back, cape and the back of the equipment visible.

CONSISTENCY: the equipment stays the same in ALL six cells and every part of the figure, including weapons, tools and banners, stays completely inside its own cell, at least 4 pixel blocks from the cell edges, never touching a neighbouring cell.

Style reference: match the attached reference sheet exactly in palette and shading. Use bright, saturated colours with strong contrast: metal helmets shiny GOLD (not brown), shields saturated in the folk colour with a yellow emblem, mail light SILVER-GREY. Skin and face must stay clearly readable when the sprite is shrunk to 48 pixels (clear dark eyes, light skin tone, mouth visible). Canvas exactly as stated. Do NOT draw any grid lines, borders or separators between the cells; the cells are only an invisible layout.

AVOID: NO TEXT OF ANY KIND (no labels, captions, pose names, titles, numbers or letters above, below or next to the figures); no logos or watermark; no frame, border, grid lines or separator lines drawn between the cells; no second figure; no change of clothing or colours between poses; no difference in scale between cells; no realistic or painterly shading; no blurry or anti-aliased edges; no gradients; no shadow on the ground; no floor; no magenta inside the figure.
```

GEBRUIK: ChatGPT | UPLOAD: rom_ballistarius_A.png en rom_tiro_B.png (in die volgorde) | OPSLAAN ALS: rom_ballistarius_B.png

```
Use the attached images as reference. The FIRST image (the six-cell sprite sheet of Ballistarius) shows THE SAME character to be redrawn: use it ONLY for the character's appearance and do NOT copy its six-cell layout. The SECOND image (the finished 3-cell sheet of the Roman recruit Tiro: portrait, battle front, battle back) shows the exact FORMAT, style, palette, outline, proportions and level of detail to follow. Your output must have the same layout as the second image: ONE row of exactly three cells, never two rows and never six cells.

Create ONE sheet: canvas exactly 1536 x 512 pixels, 16-bit JRPG pixel-art in the style of RPG Maker MV and classic Fire Emblem sprites. Layout: ONE single row of exactly 3 INVISIBLE cells side by side (NOT six cells, NOT two rows), each exactly 512 x 512 pixels, the SAME character in all three. Background: one flat solid magenta #FF00FF, no gradient, no floor, no shadow on the ground. No magenta anywhere in the figure. IMPORTANT: the image contains NO TEXT of any kind: no labels, no captions, no pose names, no titles, no numbers and no letters anywhere, neither inside nor outside the cells.

CHARACTER: "Ballistarius", Roman unit (tier 3, branch Technical, role ranged, bolt-thrower operator). He wears: a plain shiny GOLD round-topped helmet without a crest, a bright red band around its lower edge, face open and clearly visible (light skin, short black hair, clear dark eyes, a focused look); a bright red short-sleeved tunic under a brown leather chest guard with bronze studs; a short bright red cape; a brown leather belt with a bronze buckle and the brown leather tool bag at the left hip; leather wristbands; brown leather sandals with straps; NO shield. In both hands a large wooden hand-held bolt-thrower (manuballista, like a big crossbow) with a silver-grey iron stirrup and a loaded short bolt. On his back a brown leather quiver full of short bolts with red feathers.

STYLE: chunky visible pixels, at most 24 colours, one dark-brown 1-pixel outline around the whole figure, flat cel-shading with at most two tones per colour, warm saturated fantasy colours, small chibi proportions (head about one third of body height), easy to read at small size.

PIXEL GRID: every cell is its own 64 x 64 pixel grid; every pixel is a block of 8 x 8 image pixels and all pixels in the whole image are exactly the same size. In cells 2 and 3 the figure is at most 56 of the 64 pixels tall with at least 4 blocks of empty magenta margin all around, feet on the same horizontal line in both cells, same size in both cells.

CELLS:
Cell 1, a bust portrait: bust, three-quarter view, looking slightly to the right of the image, a stern but friendly look, more detail in the face than in the sprites; the figure fills about 60 percent of the cell. Show the gold helmet with the red band, the leather chest guard collar and the red cape.
Cell 2, full body seen from the front: full body, ready for battle, straight from the front at eye level, face towards the viewer. The bolt-thrower held ready in both hands, the bolt quiver visible over his shoulder.
Cell 3, full body seen from behind: the same body exactly from behind, with a slight angle from above. Show the quiver of short bolts on his back, the red cape, the tool bag and the bolt-thrower.

CONSISTENCY: the equipment stays the same in ALL six cells and every part of the figure, including weapons, tools and banners, stays completely inside its own cell, at least 4 pixel blocks from the cell edges, never touching a neighbouring cell.

Style reference: match the attached reference sheet exactly in palette and shading. Use bright, saturated colours with strong contrast: metal helmets shiny GOLD (not brown), shields saturated in the folk colour with a yellow emblem, mail light SILVER-GREY. Skin and face must stay clearly readable when the sprite is shrunk to 48 pixels (clear dark eyes, light skin tone, mouth visible). Canvas exactly as stated. Do NOT draw any grid lines, borders or separators between the cells; the cells are only an invisible layout.

AVOID: NO TEXT OF ANY KIND (no labels, captions, pose names, titles, numbers or letters above, below or next to the figures); no logos or watermark; no frame, border, grid lines or separator lines drawn between the cells; no second figure; no change of clothing or colours between cells; no difference in scale between cells 2 and 3; no realistic or painterly shading; no blurry or anti-aliased edges; no gradients; no shadow on the ground; no floor; no magenta inside the figure.
```

---

## rom_architectus | Architectus | tier 4 | technical

Ontwerp: rijkste vorm van de artillerie-lijn: gouden helm met rode kam, zilveren maliën, lange cape, grote met goud beslagen handballista, plannenrol op de rug en winkelhaak aan de riem.

GEBRUIK: ChatGPT | UPLOAD: rom_anker.png en rom_ballistarius_A.png (in die volgorde) | OPSLAAN ALS: rom_architectus_A.png

```
Use the attached images as the exact reference. The FIRST image is the Roman anchor (style, palette, outline, proportions and level of detail). The SECOND image is the sheet of the previous unit in the same line (Ballistarius): the new unit is a DIFFERENT unit of the same folk and the same line, with the same colours and base design but richer or different as described below.

Create ONE sprite sheet: canvas exactly 1536 x 1024 pixels, 16-bit JRPG pixel-art in the style of RPG Maker MV and classic Fire Emblem sprites. Layout: 3 columns by 2 rows of INVISIBLE cells, each cell exactly 512 x 512 pixels, the SAME character in all six cells. Background: one flat solid magenta #FF00FF, no gradient, no floor, no shadow on the ground. No magenta anywhere in the figure. IMPORTANT: the image contains NO TEXT of any kind: no labels, no captions, no pose names, no titles, no numbers and no letters anywhere, neither inside nor outside the cells.

CHARACTER: "Architectus", Roman unit (tier 4, branch Technical, role ranged, siege engineer). He wears: a shiny GOLD helmet with a bright red crest and gold cheek guards, face open and clearly visible (light skin, short black hair, clear dark eyes, a clever look); a LIGHT SILVER-GREY mail shirt over a bright red tunic with short sleeves; a long rich bright red cape down to the calves with a round gold clasp; a brown leather belt with a large gold buckle, a small gold set-square tool and the brown leather tool bag at the hip; shiny gold bracers; brown leather sandals with straps; NO shield. In both hands a very large wooden hand-held bolt-thrower (manuballista) with gold fittings and a loaded long bolt. A rolled cream-coloured plan scroll with a red ribbon is tied across his back.

STYLE: chunky visible pixels, at most 24 colours, one dark-brown 1-pixel outline around the whole figure, flat cel-shading with at most two tones per colour, warm saturated fantasy colours, small chibi proportions (head about one third of body height), easy to read at small size.

PIXEL GRID: every cell is its own 64 x 64 pixel grid; every pixel is a block of 8 x 8 image pixels and all pixels in the whole image are exactly the same size. The figure is at most 56 of the 64 pixels tall with at least 4 blocks of empty magenta margin all around. Feet on the same horizontal line in every cell. The figure has the same size in every cell.

CAMERA: three-quarter top-down view (about 30 degrees above the figure, slightly in front of him), unless a pose says otherwise. Express viewing direction by camera position ("seen from behind", "facing the viewer"), not by left or right of the figure.

POSES, in this fixed order:
Row 1, cell 1, resting pose: standing proudly, facing the viewer, the big bolt-thrower held low across his body.
Row 1, cell 2, attacking pose: one step forward, the big bolt-thrower raised to his shoulder and aimed forward.
Row 1, cell 3, getting-hit pose: upper body leaning backwards, eyes closed, the bolt-thrower tilting, hand raised.
Row 2, cell 1, walking-towards-the-camera pose: walking towards the camera, face and chest clearly visible, carrying the same equipment.
Row 2, cell 2, walking-sideways pose: walking to the RIGHT of the image, pure side view in profile, the shield or main item on the far side of the body.
Row 2, cell 3, walking-away pose: walking away from the camera, back, cape and the back of the equipment visible.

CONSISTENCY: the equipment stays the same in ALL six cells and every part of the figure, including weapons, tools and banners, stays completely inside its own cell, at least 4 pixel blocks from the cell edges, never touching a neighbouring cell.

Style reference: match the attached reference sheet exactly in palette and shading. Use bright, saturated colours with strong contrast: metal helmets shiny GOLD (not brown), shields saturated in the folk colour with a yellow emblem, mail light SILVER-GREY. Skin and face must stay clearly readable when the sprite is shrunk to 48 pixels (clear dark eyes, light skin tone, mouth visible). Canvas exactly as stated. Do NOT draw any grid lines, borders or separators between the cells; the cells are only an invisible layout.

AVOID: NO TEXT OF ANY KIND (no labels, captions, pose names, titles, numbers or letters above, below or next to the figures); no logos or watermark; no frame, border, grid lines or separator lines drawn between the cells; no second figure; no change of clothing or colours between poses; no difference in scale between cells; no realistic or painterly shading; no blurry or anti-aliased edges; no gradients; no shadow on the ground; no floor; no magenta inside the figure.
```

GEBRUIK: ChatGPT | UPLOAD: rom_architectus_A.png en rom_tiro_B.png (in die volgorde) | OPSLAAN ALS: rom_architectus_B.png

```
Use the attached images as reference. The FIRST image (the six-cell sprite sheet of Architectus) shows THE SAME character to be redrawn: use it ONLY for the character's appearance and do NOT copy its six-cell layout. The SECOND image (the finished 3-cell sheet of the Roman recruit Tiro: portrait, battle front, battle back) shows the exact FORMAT, style, palette, outline, proportions and level of detail to follow. Your output must have the same layout as the second image: ONE row of exactly three cells, never two rows and never six cells.

Create ONE sheet: canvas exactly 1536 x 512 pixels, 16-bit JRPG pixel-art in the style of RPG Maker MV and classic Fire Emblem sprites. Layout: ONE single row of exactly 3 INVISIBLE cells side by side (NOT six cells, NOT two rows), each exactly 512 x 512 pixels, the SAME character in all three. Background: one flat solid magenta #FF00FF, no gradient, no floor, no shadow on the ground. No magenta anywhere in the figure. IMPORTANT: the image contains NO TEXT of any kind: no labels, no captions, no pose names, no titles, no numbers and no letters anywhere, neither inside nor outside the cells.

CHARACTER: "Architectus", Roman unit (tier 4, branch Technical, role ranged, siege engineer). He wears: a shiny GOLD helmet with a bright red crest and gold cheek guards, face open and clearly visible (light skin, short black hair, clear dark eyes, a clever look); a LIGHT SILVER-GREY mail shirt over a bright red tunic with short sleeves; a long rich bright red cape down to the calves with a round gold clasp; a brown leather belt with a large gold buckle, a small gold set-square tool and the brown leather tool bag at the hip; shiny gold bracers; brown leather sandals with straps; NO shield. In both hands a very large wooden hand-held bolt-thrower (manuballista) with gold fittings and a loaded long bolt. A rolled cream-coloured plan scroll with a red ribbon is tied across his back.

STYLE: chunky visible pixels, at most 24 colours, one dark-brown 1-pixel outline around the whole figure, flat cel-shading with at most two tones per colour, warm saturated fantasy colours, small chibi proportions (head about one third of body height), easy to read at small size.

PIXEL GRID: every cell is its own 64 x 64 pixel grid; every pixel is a block of 8 x 8 image pixels and all pixels in the whole image are exactly the same size. In cells 2 and 3 the figure is at most 56 of the 64 pixels tall with at least 4 blocks of empty magenta margin all around, feet on the same horizontal line in both cells, same size in both cells.

CELLS:
Cell 1, a bust portrait: bust, three-quarter view, looking slightly to the right of the image, a stern but friendly look, more detail in the face than in the sprites; the figure fills about 60 percent of the cell. Show the gold helmet with the red crest, the gold clasp of the cape and the silver mail collar.
Cell 2, full body seen from the front: full body, ready for battle, straight from the front at eye level, face towards the viewer. The big gold-fitted bolt-thrower held ready in both hands, the plan scroll visible above his shoulder.
Cell 3, full body seen from behind: the same body exactly from behind, with a slight angle from above. Show the long red cape, the plan scroll across his back, the tool bag and the bolt-thrower.

CONSISTENCY: the equipment stays the same in ALL six cells and every part of the figure, including weapons, tools and banners, stays completely inside its own cell, at least 4 pixel blocks from the cell edges, never touching a neighbouring cell.

Style reference: match the attached reference sheet exactly in palette and shading. Use bright, saturated colours with strong contrast: metal helmets shiny GOLD (not brown), shields saturated in the folk colour with a yellow emblem, mail light SILVER-GREY. Skin and face must stay clearly readable when the sprite is shrunk to 48 pixels (clear dark eyes, light skin tone, mouth visible). Canvas exactly as stated. Do NOT draw any grid lines, borders or separators between the cells; the cells are only an invisible layout.

AVOID: NO TEXT OF ANY KIND (no labels, captions, pose names, titles, numbers or letters above, below or next to the figures); no logos or watermark; no frame, border, grid lines or separator lines drawn between the cells; no second figure; no change of clothing or colours between cells; no difference in scale between cells 2 and 3; no realistic or painterly shading; no blurry or anti-aliased edges; no gradients; no shadow on the ground; no floor; no magenta inside the figure.
```

---

## rom_capsarius | Capsarius | tier 3 | technical

Ontwerp: verbandsoldaat uit Faber: rode hoofdband, leren verbandtas met een gele bladsymbool (geen kruis), wit linnen verband over de schouder, kleine kruikjes, staf met kruidenbundel. Geen wapen.

GEBRUIK: ChatGPT | UPLOAD: rom_anker.png en rom_faber_A.png (in die volgorde) | OPSLAAN ALS: rom_capsarius_A.png

```
Use the attached images as the exact reference. The FIRST image is the Roman anchor (style, palette, outline, proportions and level of detail). The SECOND image is the sheet of the previous unit in the same line (Faber): the new unit is a DIFFERENT unit of the same folk and the same line, with the same colours and base design but richer or different as described below.

Create ONE sprite sheet: canvas exactly 1536 x 1024 pixels, 16-bit JRPG pixel-art in the style of RPG Maker MV and classic Fire Emblem sprites. Layout: 3 columns by 2 rows of INVISIBLE cells, each cell exactly 512 x 512 pixels, the SAME character in all six cells. Background: one flat solid magenta #FF00FF, no gradient, no floor, no shadow on the ground. No magenta anywhere in the figure. IMPORTANT: the image contains NO TEXT of any kind: no labels, no captions, no pose names, no titles, no numbers and no letters anywhere, neither inside nor outside the cells.

CHARACTER: "Capsarius", Roman unit (tier 3, branch Technical, role support, healer). He wears: NO helmet, a bright red headband over short black hair, face clearly visible (light skin, clear dark eyes, a kind look); a bright red short-sleeved tunic; a white linen bandage roll worn diagonally across his chest like a sash; a short bright red cape; a brown leather belt with a bronze buckle; a brown leather medicine satchel on his left hip with a yellow leaf emblem and a small clay jar hanging next to it; brown leather sandals with straps; NO armour, NO shield, NO weapon. In his right hand a light-brown wooden staff with a bundle of green herbs tied near the top.

STYLE: chunky visible pixels, at most 24 colours, one dark-brown 1-pixel outline around the whole figure, flat cel-shading with at most two tones per colour, warm saturated fantasy colours, small chibi proportions (head about one third of body height), easy to read at small size.

PIXEL GRID: every cell is its own 64 x 64 pixel grid; every pixel is a block of 8 x 8 image pixels and all pixels in the whole image are exactly the same size. The figure is at most 56 of the 64 pixels tall with at least 4 blocks of empty magenta margin all around. Feet on the same horizontal line in every cell. The figure has the same size in every cell.

CAMERA: three-quarter top-down view (about 30 degrees above the figure, slightly in front of him), unless a pose says otherwise. Express viewing direction by camera position ("seen from behind", "facing the viewer"), not by left or right of the figure.

POSES, in this fixed order:
Row 1, cell 1, resting pose: standing relaxed, facing the viewer, the herb staff planted beside him.
Row 1, cell 2, attacking pose: one step forward, the herb staff swung forward in a wide arc to push enemies back.
Row 1, cell 3, getting-hit pose: upper body leaning backwards, eyes closed, the staff tilting, hand raised.
Row 2, cell 1, walking-towards-the-camera pose: walking towards the camera, face and chest clearly visible, carrying the same equipment.
Row 2, cell 2, walking-sideways pose: walking to the RIGHT of the image, pure side view in profile, the shield or main item on the far side of the body.
Row 2, cell 3, walking-away pose: walking away from the camera, back, cape and the back of the equipment visible.

CONSISTENCY: the equipment stays the same in ALL six cells and every part of the figure, including weapons, tools and banners, stays completely inside its own cell, at least 4 pixel blocks from the cell edges, never touching a neighbouring cell.

Style reference: match the attached reference sheet exactly in palette and shading. Use bright, saturated colours with strong contrast: metal helmets shiny GOLD (not brown), shields saturated in the folk colour with a yellow emblem, mail light SILVER-GREY. Skin and face must stay clearly readable when the sprite is shrunk to 48 pixels (clear dark eyes, light skin tone, mouth visible). Canvas exactly as stated. Do NOT draw any grid lines, borders or separators between the cells; the cells are only an invisible layout.

AVOID: NO TEXT OF ANY KIND (no labels, captions, pose names, titles, numbers or letters above, below or next to the figures); no logos or watermark; no frame, border, grid lines or separator lines drawn between the cells; no second figure; no change of clothing or colours between poses; no difference in scale between cells; no realistic or painterly shading; no blurry or anti-aliased edges; no gradients; no shadow on the ground; no floor; no magenta inside the figure.
```

GEBRUIK: ChatGPT | UPLOAD: rom_capsarius_A.png en rom_tiro_B.png (in die volgorde) | OPSLAAN ALS: rom_capsarius_B.png

```
Use the attached images as reference. The FIRST image (the six-cell sprite sheet of Capsarius) shows THE SAME character to be redrawn: use it ONLY for the character's appearance and do NOT copy its six-cell layout. The SECOND image (the finished 3-cell sheet of the Roman recruit Tiro: portrait, battle front, battle back) shows the exact FORMAT, style, palette, outline, proportions and level of detail to follow. Your output must have the same layout as the second image: ONE row of exactly three cells, never two rows and never six cells.

Create ONE sheet: canvas exactly 1536 x 512 pixels, 16-bit JRPG pixel-art in the style of RPG Maker MV and classic Fire Emblem sprites. Layout: ONE single row of exactly 3 INVISIBLE cells side by side (NOT six cells, NOT two rows), each exactly 512 x 512 pixels, the SAME character in all three. Background: one flat solid magenta #FF00FF, no gradient, no floor, no shadow on the ground. No magenta anywhere in the figure. IMPORTANT: the image contains NO TEXT of any kind: no labels, no captions, no pose names, no titles, no numbers and no letters anywhere, neither inside nor outside the cells.

CHARACTER: "Capsarius", Roman unit (tier 3, branch Technical, role support, healer). He wears: NO helmet, a bright red headband over short black hair, face clearly visible (light skin, clear dark eyes, a kind look); a bright red short-sleeved tunic; a white linen bandage roll worn diagonally across his chest like a sash; a short bright red cape; a brown leather belt with a bronze buckle; a brown leather medicine satchel on his left hip with a yellow leaf emblem and a small clay jar hanging next to it; brown leather sandals with straps; NO armour, NO shield, NO weapon. In his right hand a light-brown wooden staff with a bundle of green herbs tied near the top.

STYLE: chunky visible pixels, at most 24 colours, one dark-brown 1-pixel outline around the whole figure, flat cel-shading with at most two tones per colour, warm saturated fantasy colours, small chibi proportions (head about one third of body height), easy to read at small size.

PIXEL GRID: every cell is its own 64 x 64 pixel grid; every pixel is a block of 8 x 8 image pixels and all pixels in the whole image are exactly the same size. In cells 2 and 3 the figure is at most 56 of the 64 pixels tall with at least 4 blocks of empty magenta margin all around, feet on the same horizontal line in both cells, same size in both cells.

CELLS:
Cell 1, a bust portrait: bust, three-quarter view, looking slightly to the right of the image, a stern but friendly look, more detail in the face than in the sprites; the figure fills about 60 percent of the cell. Show the red headband, the white bandage across the chest and the red cape.
Cell 2, full body seen from the front: full body, ready for battle, straight from the front at eye level, face towards the viewer. The herb staff held upright in the right hand, the satchel and clay jar at his left hip.
Cell 3, full body seen from behind: the same body exactly from behind, with a slight angle from above. Show the red cape, the medicine satchel strap, the clay jar and the herb staff.

CONSISTENCY: the equipment stays the same in ALL six cells and every part of the figure, including weapons, tools and banners, stays completely inside its own cell, at least 4 pixel blocks from the cell edges, never touching a neighbouring cell.

Style reference: match the attached reference sheet exactly in palette and shading. Use bright, saturated colours with strong contrast: metal helmets shiny GOLD (not brown), shields saturated in the folk colour with a yellow emblem, mail light SILVER-GREY. Skin and face must stay clearly readable when the sprite is shrunk to 48 pixels (clear dark eyes, light skin tone, mouth visible). Canvas exactly as stated. Do NOT draw any grid lines, borders or separators between the cells; the cells are only an invisible layout.

AVOID: NO TEXT OF ANY KIND (no labels, captions, pose names, titles, numbers or letters above, below or next to the figures); no logos or watermark; no frame, border, grid lines or separator lines drawn between the cells; no second figure; no change of clothing or colours between cells; no difference in scale between cells 2 and 3; no realistic or painterly shading; no blurry or anti-aliased edges; no gradients; no shadow on the ground; no floor; no magenta inside the figure.
```

---

## rom_medicus | Medicus | tier 4 | technical

Ontwerp: rijkste vorm van de heler-lijn: rode hoofdband met gouden rand, korte baard, wit linnen gewaad onder een lange rode cape met gouden rand, gouden gesp, staf met een gouden slang (Asclepius), gouden beslag op de tas.

GEBRUIK: ChatGPT | UPLOAD: rom_anker.png en rom_capsarius_A.png (in die volgorde) | OPSLAAN ALS: rom_medicus_A.png

```
Use the attached images as the exact reference. The FIRST image is the Roman anchor (style, palette, outline, proportions and level of detail). The SECOND image is the sheet of the previous unit in the same line (Capsarius): the new unit is a DIFFERENT unit of the same folk and the same line, with the same colours and base design but richer or different as described below.

Create ONE sprite sheet: canvas exactly 1536 x 1024 pixels, 16-bit JRPG pixel-art in the style of RPG Maker MV and classic Fire Emblem sprites. Layout: 3 columns by 2 rows of INVISIBLE cells, each cell exactly 512 x 512 pixels, the SAME character in all six cells. Background: one flat solid magenta #FF00FF, no gradient, no floor, no shadow on the ground. No magenta anywhere in the figure. IMPORTANT: the image contains NO TEXT of any kind: no labels, no captions, no pose names, no titles, no numbers and no letters anywhere, neither inside nor outside the cells.

CHARACTER: "Medicus", Roman unit (tier 4, branch Technical, role support, healer). He wears: NO helmet, a bright red headband with a thin gold edge over short black-and-grey hair, a short neat grey-black beard, face clearly visible (light skin, clear dark eyes, a wise look); a long cream-white linen robe reaching the knees with a bright red hem and red sleeves; a long bright red cape down to the calves with a gold border and a round gold clasp; a brown leather belt with a gold buckle; a brown leather medicine satchel at his left hip with gold clasps and a yellow leaf emblem, a small bronze instrument case and a clay jar hanging next to it; brown leather sandals with straps; NO armour, NO shield, NO weapon. In his right hand a light-brown wooden staff with a single shiny gold snake coiled around it.

STYLE: chunky visible pixels, at most 24 colours, one dark-brown 1-pixel outline around the whole figure, flat cel-shading with at most two tones per colour, warm saturated fantasy colours, small chibi proportions (head about one third of body height), easy to read at small size.

PIXEL GRID: every cell is its own 64 x 64 pixel grid; every pixel is a block of 8 x 8 image pixels and all pixels in the whole image are exactly the same size. The figure is at most 56 of the 64 pixels tall with at least 4 blocks of empty magenta margin all around. Feet on the same horizontal line in every cell. The figure has the same size in every cell.

CAMERA: three-quarter top-down view (about 30 degrees above the figure, slightly in front of him), unless a pose says otherwise. Express viewing direction by camera position ("seen from behind", "facing the viewer"), not by left or right of the figure.

POSES, in this fixed order:
Row 1, cell 1, resting pose: standing calmly, facing the viewer, the snake staff planted beside him.
Row 1, cell 2, attacking pose: one step forward, the snake staff swung forward in a wide arc.
Row 1, cell 3, getting-hit pose: upper body leaning backwards, eyes closed, the staff tilting, hand raised.
Row 2, cell 1, walking-towards-the-camera pose: walking towards the camera, face and chest clearly visible, carrying the same equipment.
Row 2, cell 2, walking-sideways pose: walking to the RIGHT of the image, pure side view in profile, the shield or main item on the far side of the body.
Row 2, cell 3, walking-away pose: walking away from the camera, back, cape and the back of the equipment visible.

CONSISTENCY: the equipment stays the same in ALL six cells and every part of the figure, including weapons, tools and banners, stays completely inside its own cell, at least 4 pixel blocks from the cell edges, never touching a neighbouring cell.

Style reference: match the attached reference sheet exactly in palette and shading. Use bright, saturated colours with strong contrast: metal helmets shiny GOLD (not brown), shields saturated in the folk colour with a yellow emblem, mail light SILVER-GREY. Skin and face must stay clearly readable when the sprite is shrunk to 48 pixels (clear dark eyes, light skin tone, mouth visible). Canvas exactly as stated. Do NOT draw any grid lines, borders or separators between the cells; the cells are only an invisible layout.

AVOID: NO TEXT OF ANY KIND (no labels, captions, pose names, titles, numbers or letters above, below or next to the figures); no logos or watermark; no frame, border, grid lines or separator lines drawn between the cells; no second figure; no change of clothing or colours between poses; no difference in scale between cells; no realistic or painterly shading; no blurry or anti-aliased edges; no gradients; no shadow on the ground; no floor; no magenta inside the figure.
```

GEBRUIK: ChatGPT | UPLOAD: rom_medicus_A.png en rom_tiro_B.png (in die volgorde) | OPSLAAN ALS: rom_medicus_B.png

```
Use the attached images as reference. The FIRST image (the six-cell sprite sheet of Medicus) shows THE SAME character to be redrawn: use it ONLY for the character's appearance and do NOT copy its six-cell layout. The SECOND image (the finished 3-cell sheet of the Roman recruit Tiro: portrait, battle front, battle back) shows the exact FORMAT, style, palette, outline, proportions and level of detail to follow. Your output must have the same layout as the second image: ONE row of exactly three cells, never two rows and never six cells.

Create ONE sheet: canvas exactly 1536 x 512 pixels, 16-bit JRPG pixel-art in the style of RPG Maker MV and classic Fire Emblem sprites. Layout: ONE single row of exactly 3 INVISIBLE cells side by side (NOT six cells, NOT two rows), each exactly 512 x 512 pixels, the SAME character in all three. Background: one flat solid magenta #FF00FF, no gradient, no floor, no shadow on the ground. No magenta anywhere in the figure. IMPORTANT: the image contains NO TEXT of any kind: no labels, no captions, no pose names, no titles, no numbers and no letters anywhere, neither inside nor outside the cells.

CHARACTER: "Medicus", Roman unit (tier 4, branch Technical, role support, healer). He wears: NO helmet, a bright red headband with a thin gold edge over short black-and-grey hair, a short neat grey-black beard, face clearly visible (light skin, clear dark eyes, a wise look); a long cream-white linen robe reaching the knees with a bright red hem and red sleeves; a long bright red cape down to the calves with a gold border and a round gold clasp; a brown leather belt with a gold buckle; a brown leather medicine satchel at his left hip with gold clasps and a yellow leaf emblem, a small bronze instrument case and a clay jar hanging next to it; brown leather sandals with straps; NO armour, NO shield, NO weapon. In his right hand a light-brown wooden staff with a single shiny gold snake coiled around it.

STYLE: chunky visible pixels, at most 24 colours, one dark-brown 1-pixel outline around the whole figure, flat cel-shading with at most two tones per colour, warm saturated fantasy colours, small chibi proportions (head about one third of body height), easy to read at small size.

PIXEL GRID: every cell is its own 64 x 64 pixel grid; every pixel is a block of 8 x 8 image pixels and all pixels in the whole image are exactly the same size. In cells 2 and 3 the figure is at most 56 of the 64 pixels tall with at least 4 blocks of empty magenta margin all around, feet on the same horizontal line in both cells, same size in both cells.

CELLS:
Cell 1, a bust portrait: bust, three-quarter view, looking slightly to the right of the image, a stern but friendly look, more detail in the face than in the sprites; the figure fills about 60 percent of the cell. Show the red headband with the gold edge, the grey-black beard, the gold clasp of the cape and the white robe collar.
Cell 2, full body seen from the front: full body, ready for battle, straight from the front at eye level, face towards the viewer. The snake staff held upright in the right hand, the satchel and instrument case at his hip.
Cell 3, full body seen from behind: the same body exactly from behind, with a slight angle from above. Show the long red cape with the gold border, the satchel strap and the snake staff.

CONSISTENCY: the equipment stays the same in ALL six cells and every part of the figure, including weapons, tools and banners, stays completely inside its own cell, at least 4 pixel blocks from the cell edges, never touching a neighbouring cell.

Style reference: match the attached reference sheet exactly in palette and shading. Use bright, saturated colours with strong contrast: metal helmets shiny GOLD (not brown), shields saturated in the folk colour with a yellow emblem, mail light SILVER-GREY. Skin and face must stay clearly readable when the sprite is shrunk to 48 pixels (clear dark eyes, light skin tone, mouth visible). Canvas exactly as stated. Do NOT draw any grid lines, borders or separators between the cells; the cells are only an invisible layout.

AVOID: NO TEXT OF ANY KIND (no labels, captions, pose names, titles, numbers or letters above, below or next to the figures); no logos or watermark; no frame, border, grid lines or separator lines drawn between the cells; no second figure; no change of clothing or colours between cells; no difference in scale between cells 2 and 3; no realistic or painterly shading; no blurry or anti-aliased edges; no gradients; no shadow on the ground; no floor; no magenta inside the figure.
```

---

## rom_remex | Remex | tier 2 | fleet

Ontwerp: roeier-matroos uit Tiro: simpele gouden ronde helm, rode mouwloze tuniek, touwrol over de schouder, kleine roeiriem op de rug, klein rond rood schild, gladius.

GEBRUIK: ChatGPT | UPLOAD: rom_anker.png en rom_tiro_A.png (in die volgorde) | OPSLAAN ALS: rom_remex_A.png

```
Use the attached images as the exact reference. The FIRST image is the Roman anchor (style, palette, outline, proportions and level of detail). The SECOND image is the sheet of the previous unit in the same line (Tiro): the new unit is a DIFFERENT unit of the same folk and the same line, with the same colours and base design but richer or different as described below.

Create ONE sprite sheet: canvas exactly 1536 x 1024 pixels, 16-bit JRPG pixel-art in the style of RPG Maker MV and classic Fire Emblem sprites. Layout: 3 columns by 2 rows of INVISIBLE cells, each cell exactly 512 x 512 pixels, the SAME character in all six cells. Background: one flat solid magenta #FF00FF, no gradient, no floor, no shadow on the ground. No magenta anywhere in the figure. IMPORTANT: the image contains NO TEXT of any kind: no labels, no captions, no pose names, no titles, no numbers and no letters anywhere, neither inside nor outside the cells.

CHARACTER: "Remex", Roman unit (tier 2, branch Fleet, role infantry, oarsman and marine). He wears: a plain shiny GOLD round helmet without a crest, face open and clearly visible (light skin, short black hair, clear dark eyes); a bright red sleeveless tunic reaching the thighs; a short bright red cape; a brown leather belt with a bronze buckle; a coil of thick tan rope over his right shoulder; a short wooden oar with a flat blade tied across his back; bare knees; brown leather sandals with straps; NO mail. In his left hand a small ROUND shield painted saturated red with a yellow lightning-bolt emblem and a thin gold rim. In his right hand a short straight iron sword (gladius) with a silver blade.

STYLE: chunky visible pixels, at most 24 colours, one dark-brown 1-pixel outline around the whole figure, flat cel-shading with at most two tones per colour, warm saturated fantasy colours, small chibi proportions (head about one third of body height), easy to read at small size.

PIXEL GRID: every cell is its own 64 x 64 pixel grid; every pixel is a block of 8 x 8 image pixels and all pixels in the whole image are exactly the same size. The figure is at most 56 of the 64 pixels tall with at least 4 blocks of empty magenta margin all around. Feet on the same horizontal line in every cell. The figure has the same size in every cell.

CAMERA: three-quarter top-down view (about 30 degrees above the figure, slightly in front of him), unless a pose says otherwise. Express viewing direction by camera position ("seen from behind", "facing the viewer"), not by left or right of the figure.

POSES, in this fixed order:
Row 1, cell 1, resting pose: standing relaxed, facing the viewer, the shield at his side, the gladius pointing down.
Row 1, cell 2, attacking pose: one step forward, the gladius thrust forward, the round shield raised.
Row 1, cell 3, getting-hit pose: upper body leaning backwards, eyes closed, the shield sagging.
Row 2, cell 1, walking-towards-the-camera pose: walking towards the camera, face and chest clearly visible, carrying the same equipment.
Row 2, cell 2, walking-sideways pose: walking to the RIGHT of the image, pure side view in profile, the shield or main item on the far side of the body.
Row 2, cell 3, walking-away pose: walking away from the camera, back, cape and the back of the equipment visible.

CONSISTENCY: the equipment stays the same in ALL six cells and every part of the figure, including weapons, tools and banners, stays completely inside its own cell, at least 4 pixel blocks from the cell edges, never touching a neighbouring cell.

Style reference: match the attached reference sheet exactly in palette and shading. Use bright, saturated colours with strong contrast: metal helmets shiny GOLD (not brown), shields saturated in the folk colour with a yellow emblem, mail light SILVER-GREY. Skin and face must stay clearly readable when the sprite is shrunk to 48 pixels (clear dark eyes, light skin tone, mouth visible). Canvas exactly as stated. Do NOT draw any grid lines, borders or separators between the cells; the cells are only an invisible layout.

AVOID: NO TEXT OF ANY KIND (no labels, captions, pose names, titles, numbers or letters above, below or next to the figures); no logos or watermark; no frame, border, grid lines or separator lines drawn between the cells; no second figure; no change of clothing or colours between poses; no difference in scale between cells; no realistic or painterly shading; no blurry or anti-aliased edges; no gradients; no shadow on the ground; no floor; no magenta inside the figure.
```

GEBRUIK: ChatGPT | UPLOAD: rom_remex_A.png en rom_tiro_B.png (in die volgorde) | OPSLAAN ALS: rom_remex_B.png

```
Use the attached images as reference. The FIRST image (the six-cell sprite sheet of Remex) shows THE SAME character to be redrawn: use it ONLY for the character's appearance and do NOT copy its six-cell layout. The SECOND image (the finished 3-cell sheet of the Roman recruit Tiro: portrait, battle front, battle back) shows the exact FORMAT, style, palette, outline, proportions and level of detail to follow. Your output must have the same layout as the second image: ONE row of exactly three cells, never two rows and never six cells.

Create ONE sheet: canvas exactly 1536 x 512 pixels, 16-bit JRPG pixel-art in the style of RPG Maker MV and classic Fire Emblem sprites. Layout: ONE single row of exactly 3 INVISIBLE cells side by side (NOT six cells, NOT two rows), each exactly 512 x 512 pixels, the SAME character in all three. Background: one flat solid magenta #FF00FF, no gradient, no floor, no shadow on the ground. No magenta anywhere in the figure. IMPORTANT: the image contains NO TEXT of any kind: no labels, no captions, no pose names, no titles, no numbers and no letters anywhere, neither inside nor outside the cells.

CHARACTER: "Remex", Roman unit (tier 2, branch Fleet, role infantry, oarsman and marine). He wears: a plain shiny GOLD round helmet without a crest, face open and clearly visible (light skin, short black hair, clear dark eyes); a bright red sleeveless tunic reaching the thighs; a short bright red cape; a brown leather belt with a bronze buckle; a coil of thick tan rope over his right shoulder; a short wooden oar with a flat blade tied across his back; bare knees; brown leather sandals with straps; NO mail. In his left hand a small ROUND shield painted saturated red with a yellow lightning-bolt emblem and a thin gold rim. In his right hand a short straight iron sword (gladius) with a silver blade.

STYLE: chunky visible pixels, at most 24 colours, one dark-brown 1-pixel outline around the whole figure, flat cel-shading with at most two tones per colour, warm saturated fantasy colours, small chibi proportions (head about one third of body height), easy to read at small size.

PIXEL GRID: every cell is its own 64 x 64 pixel grid; every pixel is a block of 8 x 8 image pixels and all pixels in the whole image are exactly the same size. In cells 2 and 3 the figure is at most 56 of the 64 pixels tall with at least 4 blocks of empty magenta margin all around, feet on the same horizontal line in both cells, same size in both cells.

CELLS:
Cell 1, a bust portrait: bust, three-quarter view, looking slightly to the right of the image, a stern but friendly look, more detail in the face than in the sprites; the figure fills about 60 percent of the cell. Show the plain gold helmet, the rope coil on the shoulder and the red cape.
Cell 2, full body seen from the front: full body, ready for battle, straight from the front at eye level, face towards the viewer. Round shield raised, gladius ready, the oar visible behind his shoulder.
Cell 3, full body seen from behind: the same body exactly from behind, with a slight angle from above. Show the oar tied across his back, the rope coil, the red cape and the back of the round shield.

CONSISTENCY: the equipment stays the same in ALL six cells and every part of the figure, including weapons, tools and banners, stays completely inside its own cell, at least 4 pixel blocks from the cell edges, never touching a neighbouring cell.

Style reference: match the attached reference sheet exactly in palette and shading. Use bright, saturated colours with strong contrast: metal helmets shiny GOLD (not brown), shields saturated in the folk colour with a yellow emblem, mail light SILVER-GREY. Skin and face must stay clearly readable when the sprite is shrunk to 48 pixels (clear dark eyes, light skin tone, mouth visible). Canvas exactly as stated. Do NOT draw any grid lines, borders or separators between the cells; the cells are only an invisible layout.

AVOID: NO TEXT OF ANY KIND (no labels, captions, pose names, titles, numbers or letters above, below or next to the figures); no logos or watermark; no frame, border, grid lines or separator lines drawn between the cells; no second figure; no change of clothing or colours between cells; no difference in scale between cells 2 and 3; no realistic or painterly shading; no blurry or anti-aliased edges; no gradients; no shadow on the ground; no floor; no magenta inside the figure.
```

---

## rom_classiarius | Classiarius | tier 3 | fleet

Ontwerp: marinier uit Remex: gouden helm met korte rode kam, zilveren maliën, rond schild met gouden rand, enterbijl in plaats van roeiriem.

GEBRUIK: ChatGPT | UPLOAD: rom_anker.png en rom_remex_A.png (in die volgorde) | OPSLAAN ALS: rom_classiarius_A.png

```
Use the attached images as the exact reference. The FIRST image is the Roman anchor (style, palette, outline, proportions and level of detail). The SECOND image is the sheet of the previous unit in the same line (Remex): the new unit is a DIFFERENT unit of the same folk and the same line, with the same colours and base design but richer or different as described below.

Create ONE sprite sheet: canvas exactly 1536 x 1024 pixels, 16-bit JRPG pixel-art in the style of RPG Maker MV and classic Fire Emblem sprites. Layout: 3 columns by 2 rows of INVISIBLE cells, each cell exactly 512 x 512 pixels, the SAME character in all six cells. Background: one flat solid magenta #FF00FF, no gradient, no floor, no shadow on the ground. No magenta anywhere in the figure. IMPORTANT: the image contains NO TEXT of any kind: no labels, no captions, no pose names, no titles, no numbers and no letters anywhere, neither inside nor outside the cells.

CHARACTER: "Classiarius", Roman unit (tier 3, branch Fleet, role infantry, marine). He wears: a shiny GOLD helmet with a short bright red crest and gold cheek guards, face open and clearly visible (light skin, short black hair, clear dark eyes); a LIGHT SILVER-GREY mail shirt over a bright red tunic with short sleeves; a short bright red cape; a brown leather belt with a gold buckle and a small coil of tan rope; a gladius in a brown scabbard at his left hip; bare knees; brown leather sandals with straps. In his left hand a medium ROUND shield saturated red with a yellow lightning bolt, a wide gold rim and a gold boss. In his right hand a short boarding axe with a silver-grey blade and a light-brown handle.

STYLE: chunky visible pixels, at most 24 colours, one dark-brown 1-pixel outline around the whole figure, flat cel-shading with at most two tones per colour, warm saturated fantasy colours, small chibi proportions (head about one third of body height), easy to read at small size.

PIXEL GRID: every cell is its own 64 x 64 pixel grid; every pixel is a block of 8 x 8 image pixels and all pixels in the whole image are exactly the same size. The figure is at most 56 of the 64 pixels tall with at least 4 blocks of empty magenta margin all around. Feet on the same horizontal line in every cell. The figure has the same size in every cell.

CAMERA: three-quarter top-down view (about 30 degrees above the figure, slightly in front of him), unless a pose says otherwise. Express viewing direction by camera position ("seen from behind", "facing the viewer"), not by left or right of the figure.

POSES, in this fixed order:
Row 1, cell 1, resting pose: standing relaxed, facing the viewer, the shield at his side, the axe hanging.
Row 1, cell 2, attacking pose: one step forward, the boarding axe swung forward and down, the round shield raised.
Row 1, cell 3, getting-hit pose: upper body leaning backwards, eyes closed, the shield sagging, the axe tilting.
Row 2, cell 1, walking-towards-the-camera pose: walking towards the camera, face and chest clearly visible, carrying the same equipment.
Row 2, cell 2, walking-sideways pose: walking to the RIGHT of the image, pure side view in profile, the shield or main item on the far side of the body.
Row 2, cell 3, walking-away pose: walking away from the camera, back, cape and the back of the equipment visible.

CONSISTENCY: the equipment stays the same in ALL six cells and every part of the figure, including weapons, tools and banners, stays completely inside its own cell, at least 4 pixel blocks from the cell edges, never touching a neighbouring cell.

Style reference: match the attached reference sheet exactly in palette and shading. Use bright, saturated colours with strong contrast: metal helmets shiny GOLD (not brown), shields saturated in the folk colour with a yellow emblem, mail light SILVER-GREY. Skin and face must stay clearly readable when the sprite is shrunk to 48 pixels (clear dark eyes, light skin tone, mouth visible). Canvas exactly as stated. Do NOT draw any grid lines, borders or separators between the cells; the cells are only an invisible layout.

AVOID: NO TEXT OF ANY KIND (no labels, captions, pose names, titles, numbers or letters above, below or next to the figures); no logos or watermark; no frame, border, grid lines or separator lines drawn between the cells; no second figure; no change of clothing or colours between poses; no difference in scale between cells; no realistic or painterly shading; no blurry or anti-aliased edges; no gradients; no shadow on the ground; no floor; no magenta inside the figure.
```

GEBRUIK: ChatGPT | UPLOAD: rom_classiarius_A.png en rom_tiro_B.png (in die volgorde) | OPSLAAN ALS: rom_classiarius_B.png

```
Use the attached images as reference. The FIRST image (the six-cell sprite sheet of Classiarius) shows THE SAME character to be redrawn: use it ONLY for the character's appearance and do NOT copy its six-cell layout. The SECOND image (the finished 3-cell sheet of the Roman recruit Tiro: portrait, battle front, battle back) shows the exact FORMAT, style, palette, outline, proportions and level of detail to follow. Your output must have the same layout as the second image: ONE row of exactly three cells, never two rows and never six cells.

Create ONE sheet: canvas exactly 1536 x 512 pixels, 16-bit JRPG pixel-art in the style of RPG Maker MV and classic Fire Emblem sprites. Layout: ONE single row of exactly 3 INVISIBLE cells side by side (NOT six cells, NOT two rows), each exactly 512 x 512 pixels, the SAME character in all three. Background: one flat solid magenta #FF00FF, no gradient, no floor, no shadow on the ground. No magenta anywhere in the figure. IMPORTANT: the image contains NO TEXT of any kind: no labels, no captions, no pose names, no titles, no numbers and no letters anywhere, neither inside nor outside the cells.

CHARACTER: "Classiarius", Roman unit (tier 3, branch Fleet, role infantry, marine). He wears: a shiny GOLD helmet with a short bright red crest and gold cheek guards, face open and clearly visible (light skin, short black hair, clear dark eyes); a LIGHT SILVER-GREY mail shirt over a bright red tunic with short sleeves; a short bright red cape; a brown leather belt with a gold buckle and a small coil of tan rope; a gladius in a brown scabbard at his left hip; bare knees; brown leather sandals with straps. In his left hand a medium ROUND shield saturated red with a yellow lightning bolt, a wide gold rim and a gold boss. In his right hand a short boarding axe with a silver-grey blade and a light-brown handle.

STYLE: chunky visible pixels, at most 24 colours, one dark-brown 1-pixel outline around the whole figure, flat cel-shading with at most two tones per colour, warm saturated fantasy colours, small chibi proportions (head about one third of body height), easy to read at small size.

PIXEL GRID: every cell is its own 64 x 64 pixel grid; every pixel is a block of 8 x 8 image pixels and all pixels in the whole image are exactly the same size. In cells 2 and 3 the figure is at most 56 of the 64 pixels tall with at least 4 blocks of empty magenta margin all around, feet on the same horizontal line in both cells, same size in both cells.

CELLS:
Cell 1, a bust portrait: bust, three-quarter view, looking slightly to the right of the image, a stern but friendly look, more detail in the face than in the sprites; the figure fills about 60 percent of the cell. Show the gold helmet with the short red crest, the silver mail collar and the red cape.
Cell 2, full body seen from the front: full body, ready for battle, straight from the front at eye level, face towards the viewer. Round shield raised on the left arm, boarding axe held ready in the right hand.
Cell 3, full body seen from behind: the same body exactly from behind, with a slight angle from above. Show the back of the round shield, the red cape, the gold helmet crest, the scabbard and the axe.

CONSISTENCY: the equipment stays the same in ALL six cells and every part of the figure, including weapons, tools and banners, stays completely inside its own cell, at least 4 pixel blocks from the cell edges, never touching a neighbouring cell.

Style reference: match the attached reference sheet exactly in palette and shading. Use bright, saturated colours with strong contrast: metal helmets shiny GOLD (not brown), shields saturated in the folk colour with a yellow emblem, mail light SILVER-GREY. Skin and face must stay clearly readable when the sprite is shrunk to 48 pixels (clear dark eyes, light skin tone, mouth visible). Canvas exactly as stated. Do NOT draw any grid lines, borders or separators between the cells; the cells are only an invisible layout.

AVOID: NO TEXT OF ANY KIND (no labels, captions, pose names, titles, numbers or letters above, below or next to the figures); no logos or watermark; no frame, border, grid lines or separator lines drawn between the cells; no second figure; no change of clothing or colours between cells; no difference in scale between cells 2 and 3; no realistic or painterly shading; no blurry or anti-aliased edges; no gradients; no shadow on the ground; no floor; no magenta inside the figure.
```

---

## rom_navarchus | Navarchus | tier 4 | fleet

Ontwerp: rijkste vorm van de vloot-lijn: gouden helm met een gouden scheepssteven als sieraad en rode kam, zilveren maliën met gouden medailles, lange rode cape met gouden rand, rond schild met gouden scheepssteven, gouden zwaard.

GEBRUIK: ChatGPT | UPLOAD: rom_anker.png en rom_classiarius_A.png (in die volgorde) | OPSLAAN ALS: rom_navarchus_A.png

```
Use the attached images as the exact reference. The FIRST image is the Roman anchor (style, palette, outline, proportions and level of detail). The SECOND image is the sheet of the previous unit in the same line (Classiarius): the new unit is a DIFFERENT unit of the same folk and the same line, with the same colours and base design but richer or different as described below.

Create ONE sprite sheet: canvas exactly 1536 x 1024 pixels, 16-bit JRPG pixel-art in the style of RPG Maker MV and classic Fire Emblem sprites. Layout: 3 columns by 2 rows of INVISIBLE cells, each cell exactly 512 x 512 pixels, the SAME character in all six cells. Background: one flat solid magenta #FF00FF, no gradient, no floor, no shadow on the ground. No magenta anywhere in the figure. IMPORTANT: the image contains NO TEXT of any kind: no labels, no captions, no pose names, no titles, no numbers and no letters anywhere, neither inside nor outside the cells.

CHARACTER: "Navarchus", Roman unit (tier 4, branch Fleet, role infantry, ship captain). He wears: a shiny GOLD helmet with a bright red crest and a small shiny gold ship's prow ornament at the front of the crest, gold cheek guards, face open and clearly visible (light skin, short black hair, clear dark eyes, a commanding look); a LIGHT SILVER-GREY mail shirt with gold shoulder doublings over a bright red tunic with short sleeves; three round shiny gold medals on brown straps across the chest; a long rich bright red cape down to the calves with a gold border and a round gold clasp; a brown leather belt with a large gold buckle; shiny gold greaves on both shins; brown leather sandals with straps. In his left hand a medium ROUND shield saturated red with a yellow lightning bolt, a wide gold rim, a gold boss and a small gold ship's prow above the boss. In his right hand a straight sword with a silver blade and a gold hilt, raised in command.

STYLE: chunky visible pixels, at most 24 colours, one dark-brown 1-pixel outline around the whole figure, flat cel-shading with at most two tones per colour, warm saturated fantasy colours, small chibi proportions (head about one third of body height), easy to read at small size.

PIXEL GRID: every cell is its own 64 x 64 pixel grid; every pixel is a block of 8 x 8 image pixels and all pixels in the whole image are exactly the same size. The figure is at most 56 of the 64 pixels tall with at least 4 blocks of empty magenta margin all around. Feet on the same horizontal line in every cell. The figure has the same size in every cell.

CAMERA: three-quarter top-down view (about 30 degrees above the figure, slightly in front of him), unless a pose says otherwise. Express viewing direction by camera position ("seen from behind", "facing the viewer"), not by left or right of the figure.

POSES, in this fixed order:
Row 1, cell 1, resting pose: standing proudly, facing the viewer, the sword resting on his shoulder, the shield at his side.
Row 1, cell 2, attacking pose: one step forward, the sword thrust forward in command, the round shield raised.
Row 1, cell 3, getting-hit pose: upper body leaning backwards, eyes closed, the shield sagging, the sword tilting.
Row 2, cell 1, walking-towards-the-camera pose: walking towards the camera, face and chest clearly visible, carrying the same equipment.
Row 2, cell 2, walking-sideways pose: walking to the RIGHT of the image, pure side view in profile, the shield or main item on the far side of the body.
Row 2, cell 3, walking-away pose: walking away from the camera, back, cape and the back of the equipment visible.

CONSISTENCY: the equipment stays the same in ALL six cells and every part of the figure, including weapons, tools and banners, stays completely inside its own cell, at least 4 pixel blocks from the cell edges, never touching a neighbouring cell.

Style reference: match the attached reference sheet exactly in palette and shading. Use bright, saturated colours with strong contrast: metal helmets shiny GOLD (not brown), shields saturated in the folk colour with a yellow emblem, mail light SILVER-GREY. Skin and face must stay clearly readable when the sprite is shrunk to 48 pixels (clear dark eyes, light skin tone, mouth visible). Canvas exactly as stated. Do NOT draw any grid lines, borders or separators between the cells; the cells are only an invisible layout.

AVOID: NO TEXT OF ANY KIND (no labels, captions, pose names, titles, numbers or letters above, below or next to the figures); no logos or watermark; no frame, border, grid lines or separator lines drawn between the cells; no second figure; no change of clothing or colours between poses; no difference in scale between cells; no realistic or painterly shading; no blurry or anti-aliased edges; no gradients; no shadow on the ground; no floor; no magenta inside the figure.
```

GEBRUIK: ChatGPT | UPLOAD: rom_navarchus_A.png en rom_tiro_B.png (in die volgorde) | OPSLAAN ALS: rom_navarchus_B.png

```
Use the attached images as reference. The FIRST image (the six-cell sprite sheet of Navarchus) shows THE SAME character to be redrawn: use it ONLY for the character's appearance and do NOT copy its six-cell layout. The SECOND image (the finished 3-cell sheet of the Roman recruit Tiro: portrait, battle front, battle back) shows the exact FORMAT, style, palette, outline, proportions and level of detail to follow. Your output must have the same layout as the second image: ONE row of exactly three cells, never two rows and never six cells.

Create ONE sheet: canvas exactly 1536 x 512 pixels, 16-bit JRPG pixel-art in the style of RPG Maker MV and classic Fire Emblem sprites. Layout: ONE single row of exactly 3 INVISIBLE cells side by side (NOT six cells, NOT two rows), each exactly 512 x 512 pixels, the SAME character in all three. Background: one flat solid magenta #FF00FF, no gradient, no floor, no shadow on the ground. No magenta anywhere in the figure. IMPORTANT: the image contains NO TEXT of any kind: no labels, no captions, no pose names, no titles, no numbers and no letters anywhere, neither inside nor outside the cells.

CHARACTER: "Navarchus", Roman unit (tier 4, branch Fleet, role infantry, ship captain). He wears: a shiny GOLD helmet with a bright red crest and a small shiny gold ship's prow ornament at the front of the crest, gold cheek guards, face open and clearly visible (light skin, short black hair, clear dark eyes, a commanding look); a LIGHT SILVER-GREY mail shirt with gold shoulder doublings over a bright red tunic with short sleeves; three round shiny gold medals on brown straps across the chest; a long rich bright red cape down to the calves with a gold border and a round gold clasp; a brown leather belt with a large gold buckle; shiny gold greaves on both shins; brown leather sandals with straps. In his left hand a medium ROUND shield saturated red with a yellow lightning bolt, a wide gold rim, a gold boss and a small gold ship's prow above the boss. In his right hand a straight sword with a silver blade and a gold hilt, raised in command.

STYLE: chunky visible pixels, at most 24 colours, one dark-brown 1-pixel outline around the whole figure, flat cel-shading with at most two tones per colour, warm saturated fantasy colours, small chibi proportions (head about one third of body height), easy to read at small size.

PIXEL GRID: every cell is its own 64 x 64 pixel grid; every pixel is a block of 8 x 8 image pixels and all pixels in the whole image are exactly the same size. In cells 2 and 3 the figure is at most 56 of the 64 pixels tall with at least 4 blocks of empty magenta margin all around, feet on the same horizontal line in both cells, same size in both cells.

CELLS:
Cell 1, a bust portrait: bust, three-quarter view, looking slightly to the right of the image, a stern but friendly look, more detail in the face than in the sprites; the figure fills about 60 percent of the cell. Show the gold helmet with the ship's prow ornament and red crest, the gold medals and the gold clasp of the cape.
Cell 2, full body seen from the front: full body, ready for battle, straight from the front at eye level, face towards the viewer. Round shield raised on the left arm, sword raised in the right hand.
Cell 3, full body seen from behind: the same body exactly from behind, with a slight angle from above. Show the back of the round shield, the long red cape with the gold border, the helmet crest and the sword.

CONSISTENCY: the equipment stays the same in ALL six cells and every part of the figure, including weapons, tools and banners, stays completely inside its own cell, at least 4 pixel blocks from the cell edges, never touching a neighbouring cell.

Style reference: match the attached reference sheet exactly in palette and shading. Use bright, saturated colours with strong contrast: metal helmets shiny GOLD (not brown), shields saturated in the folk colour with a yellow emblem, mail light SILVER-GREY. Skin and face must stay clearly readable when the sprite is shrunk to 48 pixels (clear dark eyes, light skin tone, mouth visible). Canvas exactly as stated. Do NOT draw any grid lines, borders or separators between the cells; the cells are only an invisible layout.

AVOID: NO TEXT OF ANY KIND (no labels, captions, pose names, titles, numbers or letters above, below or next to the figures); no logos or watermark; no frame, border, grid lines or separator lines drawn between the cells; no second figure; no change of clothing or colours between cells; no difference in scale between cells 2 and 3; no realistic or painterly shading; no blurry or anti-aliased edges; no gradients; no shadow on the ground; no floor; no magenta inside the figure.
```

---
