# REGELS (vaste regels voor alle bladen)

Alles hieronder geldt voor elk blad. Het model vult de twee sjablonen onderaan in met de tekst van een vorm uit `VORMEN_ROM_OPEN.md`.

## Vaste onderdelen (letterlijk overnemen)

STYLE: chunky visible pixels, at most 24 colours, one dark-brown 1-pixel outline around the whole figure, flat cel-shading with at most two tones per colour, warm saturated fantasy colours, small chibi proportions (head about one third of body height), easy to read at small size.

PIXEL GRID (sheet A): every cell is its own 64 x 64 pixel grid; every pixel is a block of 8 x 8 image pixels and all pixels in the whole image are exactly the same size. The figure is at most 56 of the 64 pixels tall with at least 4 blocks of empty magenta margin all around. Feet on the same horizontal line in every cell. The figure has the same size in every cell.

PIXEL GRID (sheet B): every cell is its own 64 x 64 pixel grid; every pixel is a block of 8 x 8 image pixels and all pixels in the whole image are exactly the same size. In cells 2 and 3 the figure is at most 56 of the 64 pixels tall with at least 4 blocks of empty magenta margin all around, feet on the same horizontal line in both cells, same size in both cells.

CAMERA: three-quarter top-down view (about 30 degrees above the figure, slightly in front of him), unless a pose says otherwise. Express viewing direction by camera position ("seen from behind", "facing the viewer"), not by left or right of the figure.

CONSISTENCY: the equipment stays the same in ALL cells and every part of the figure, including weapons, tools and banners, stays completely inside its own cell, at least 4 pixel blocks from the cell edges, never touching a neighbouring cell. Shield shape and emblem never change between cells.

STYLE REFERENCE: match the attached reference sheet exactly in palette and shading. Use bright, saturated colours with strong contrast: metal helmets shiny GOLD (not brown), shields saturated in the folk colour with a yellow emblem, mail light SILVER-GREY. Skin and face must stay clearly readable when the sprite is shrunk to 48 pixels (clear dark eyes, light skin tone, mouth visible). Canvas exactly as stated. Do NOT draw any grid lines, borders or separators between the cells; the cells are only an invisible layout.

AVOID (sheet A): no text, letters, numbers, logos or watermark; no frame, border, grid lines or separator lines drawn between the cells; no second figure; no change of clothing or colours between poses; no difference in scale between cells; no realistic or painterly shading; no blurry or anti-aliased edges; no gradients; no shadow on the ground; no floor; no magenta inside the figure.

AVOID (sheet B): no text, letters, numbers, logos or watermark; no frame, border, grid lines or separator lines drawn between the cells; no second figure; no change of clothing or colours between cells; no difference in scale between cells 2 and 3; no realistic or painterly shading; no blurry or anti-aliased edges; no gradients; no shadow on the ground; no floor; no magenta inside the figure.

## Sjabloon blad A (zes poses, 1536 x 1024)

Bijlagen: [1] het anker van het volk (`rom_anker.png`), [2] blad A van de ouder-vorm (staat bij de vorm).

```
Use the attached images as the exact reference. The FIRST image is the Roman anchor (style, palette, outline, proportions and level of detail). The SECOND image is the sheet of the previous unit in the same line (<PARENT>): the new unit is a DIFFERENT unit of the same folk and the same line, with the same colours and base design but richer or different as described below.

Create ONE sprite sheet: canvas exactly 1536 x 1024 pixels, 16-bit JRPG pixel-art in the style of RPG Maker MV and classic Fire Emblem sprites. Layout: 3 columns by 2 rows of INVISIBLE cells, each cell exactly 512 x 512 pixels, the SAME character in all six cells. Background: one flat solid magenta #FF00FF, no gradient, no floor, no shadow on the ground. No magenta anywhere in the figure. IMPORTANT: the image contains NO TEXT of any kind: no labels, no captions, no pose names, no titles, no numbers and no letters anywhere, neither inside nor outside the cells.

CHARACTER: "<NAME>", Roman unit (tier <TIER>, branch <BRANCH>, role <ROLE>). <OUTFIT>

<STYLE>

<PIXEL GRID (sheet A)>

<CAMERA>

POSES, in this fixed order:
Row 1, cell 1, resting pose: <REST>.
Row 1, cell 2, attacking pose: <ATTACK>.
Row 1, cell 3, getting-hit pose: <HIT>.
Row 2, cell 1, walking-towards-the-camera pose: walking towards the camera, face and chest clearly visible, carrying the same equipment.
Row 2, cell 2, walking-sideways pose: walking to the RIGHT of the image, pure side view in profile, the shield or main item on the far side of the body.
Row 2, cell 3, walking-away pose: walking away from the camera, back, cape and the back of the equipment visible.

<CONSISTENCY>

Style reference: <STYLE REFERENCE>

AVOID: <AVOID (sheet A)>
```

## Sjabloon blad B (portret en twee battle-posities, 1536 x 512)

Bijlagen: [1] blad A van dezelfde vorm, [2] `rom_tiro_B.png` (formaatvoorbeeld, niet het anker).

```
Use the attached images as reference. The FIRST image (the six-cell sprite sheet of <NAME>) shows THE SAME character to be redrawn: use it ONLY for the character's appearance and do NOT copy its six-cell layout. The SECOND image (the finished 3-cell sheet of the Roman recruit Tiro: portrait, battle front, battle back) shows the exact FORMAT, style, palette, outline, proportions and level of detail to follow. Your output must have the same layout as the second image: ONE row of exactly three cells, never two rows and never six cells.

Create ONE sheet: canvas exactly 1536 x 512 pixels, 16-bit JRPG pixel-art in the style of RPG Maker MV and classic Fire Emblem sprites. Layout: ONE single row of exactly 3 INVISIBLE cells side by side (NOT six cells, NOT two rows), each exactly 512 x 512 pixels, the SAME character in all three. Background: one flat solid magenta #FF00FF, no gradient, no floor, no shadow on the ground. No magenta anywhere in the figure. IMPORTANT: the image contains NO TEXT of any kind: no labels, no captions, no pose names, no titles, no numbers and no letters anywhere, neither inside nor outside the cells.

CHARACTER: "<NAME>", Roman unit (tier <TIER>, branch <BRANCH>, role <ROLE>). <OUTFIT>

<STYLE>

<PIXEL GRID (sheet B)>

CELLS:
Cell 1, a bust portrait: bust, three-quarter view, looking slightly to the right of the image, a stern but friendly look, more detail in the face than in the sprites; the figure fills about 60 percent of the cell. <PORTRAIT>
Cell 2, full body seen from the front: full body, ready for battle, straight from the front at eye level, face towards the viewer. <FRONT>
Cell 3, full body seen from behind: the same body exactly from behind, with a slight angle from above. <BACK>

<CONSISTENCY>

Style reference: <STYLE REFERENCE>

AVOID: <AVOID (sheet B)>
```
