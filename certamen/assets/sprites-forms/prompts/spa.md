# Beeldprompts Spartanen (volkscode spa)

Gegenereerd op 2026-10-22 via ChatGPT (zie PROMPT_GENERATOR.md); alle 6 vormen hebben blad A en B. Anker: `spa_anker.png` (gemaakt met `gra_anker.png`/`rom_anker.png` als stijlreferentie). Blad A: anker + A van de ouder (Puer Laco A: anker + `rom_tiro_A.png`). Blad B: A van de vorm + `spa_puerlaco_B.png` (Puer Laco B: A + `rom_tiro_B.png`). Vul de `{{...}}` in per vorm; `{{FMT}}` = Puer Laco.

## Sjabloon blad A
```
Use the attached images as the exact reference. The FIRST image is the Spartan anchor (style, palette, outline, proportions and level of detail). {{SECOND}}

Create ONE sprite sheet: canvas exactly 1536 x 1024 pixels, 16-bit JRPG pixel-art in the style of RPG Maker MV and classic Fire Emblem sprites. Layout: 3 columns by 2 rows of INVISIBLE cells, each cell exactly 512 x 512 pixels, the SAME character in all six cells. Background: one flat solid magenta #FF00FF, no gradient, no floor, no shadow on the ground. No magenta anywhere in the figure. IMPORTANT: the image contains NO TEXT of any kind: no labels, no captions, no pose names, no titles, no numbers and no letters anywhere, neither inside nor outside the cells.

CHARACTER: "{{NAME}}", Spartan unit (tier {{TIER}}, branch {{BRANCH}}, role {{ROLE}}). {{OUTFIT}}

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

Style reference: match the attached reference sheet exactly in palette and shading. Use bright, saturated colours with strong contrast: metal helmets shiny GOLD (not brown), shields saturated in the folk colour with a yellow emblem, mail light SILVER-GREY. Skin and face must stay clearly readable when the sprite is shrunk to 48 pixels (clear dark eyes, tanned skin tone, mouth visible). Canvas exactly as stated. Do NOT draw any grid lines, borders or separators between the cells; the cells are only an invisible layout.

AVOID: NO TEXT OF ANY KIND (no labels, captions, pose names, titles, numbers or letters above, below or next to the figures); no logos or watermark; no frame, border, grid lines or separator lines drawn between the cells; no second figure; no change of clothing or colours between poses; no difference in scale between cells; no realistic or painterly shading; no blurry or anti-aliased edges; no gradients; no shadow on the ground; no floor; no magenta inside the figure.
```

## Sjabloon blad B
```
Use the attached images as reference. The FIRST image (the six-cell sprite sheet of {{NAME}}) shows THE SAME character to be redrawn: use it ONLY for the character's appearance and do NOT copy its six-cell layout. The SECOND image (the finished 3-cell sheet of the recruit {{FMT}}: portrait, battle front, battle back) shows the exact FORMAT, style, palette, outline, proportions and level of detail to follow (do NOT copy its clothing). Your output must have the same layout as the second image: ONE row of exactly three cells, never two rows and never six cells.

Create ONE sheet: canvas exactly 1536 x 512 pixels, 16-bit JRPG pixel-art in the style of RPG Maker MV and classic Fire Emblem sprites. Layout: ONE single row of exactly 3 INVISIBLE cells side by side (NOT six cells, NOT two rows), each exactly 512 x 512 pixels, the SAME character in all three. Background: one flat solid magenta #FF00FF, no gradient, no floor, no shadow on the ground. No magenta anywhere in the figure. IMPORTANT: the image contains NO TEXT of any kind: no labels, no captions, no pose names, no titles, no numbers and no letters anywhere, neither inside nor outside the cells.

CHARACTER: "{{NAME}}", Spartan unit (tier {{TIER}}, branch {{BRANCH}}, role {{ROLE}}). {{OUTFIT}}

STYLE: chunky visible pixels, at most 24 colours, one dark-brown 1-pixel outline around the whole figure, flat cel-shading with at most two tones per colour, warm saturated fantasy colours, small chibi proportions (head about one third of body height), easy to read at small size.

PIXEL GRID: every cell is its own 64 x 64 pixel grid; every pixel is a block of 8 x 8 image pixels and all pixels in the whole image are exactly the same size. In cells 2 and 3 the figure is at most 56 of the 64 pixels tall with at least 4 blocks of empty magenta margin all around, feet on the same horizontal line in both cells, same size in both cells.

CELLS:
Cell 1, a bust portrait: bust, three-quarter view, looking slightly to the right of the image, a stern but friendly look, more detail in the face than in the sprites; the figure fills about 60 percent of the cell. {{PORT}}
Cell 2, full body seen from the front: full body, ready for battle, straight from the front at eye level, face towards the viewer. {{FRONT}}
Cell 3, full body seen from behind: the same body exactly from behind, with a slight angle from above. {{BACK}}

CONSISTENCY: the equipment stays the same in ALL cells and every part of the figure, including weapons, tools and banners, stays completely inside its own cell, at least 4 pixel blocks from the cell edges, never touching a neighbouring cell. Shield shape and emblem never change between cells.

Style reference: match the attached reference sheet exactly in palette and shading. Use bright, saturated colours with strong contrast: metal helmets shiny GOLD (not brown), shields saturated in the folk colour with a yellow emblem, mail light SILVER-GREY. Skin and face must stay clearly readable when the sprite is shrunk to 48 pixels (clear dark eyes, tanned skin tone, mouth visible). Canvas exactly as stated. Do NOT draw any grid lines, borders or separators between the cells; the cells are only an invisible layout.

AVOID: NO TEXT OF ANY KIND (no labels, captions, pose names, titles, numbers or letters above, below or next to the figures); no logos or watermark; no frame, border, grid lines or separator lines drawn between the cells; no second figure; no change of clothing or colours between cells; no difference in scale between cells 2 and 3; no realistic or painterly shading; no blurry or anti-aliased edges; no gradients; no shadow on the ground; no floor; no magenta inside the figure.
```

## spa_puerlaco | Puer Laco | tier 1 | Recruit | ouder: -

- Blad A, bijlagen: `spa_anker.png` en `rom_tiro_A.png`
- NAME: Puer Laco; TIER: 1; BRANCH: Recruit; ROLE: recruit
- OUTFIT: He is a young Spartan recruit, the simplest unit. He wears: bare head with long black hair tied back in a ponytail and a thin red headband, face clearly visible (tanned skin, clear dark eyes, a stern look); a short plain brown-red wool tunic (exomis) leaving one shoulder bare, with a red hem; a short bright red cloak pinned at one shoulder; a brown leather belt; bare knees; plain brown leather sandals with straps; NO armour and NO helmet. In his left hand a small ROUND wooden shield painted saturated red with a yellow upward-pointing chevron (an inverted V) and a small gold boss. In his right hand a plain wooden spear with a short silver-grey leaf-shaped head.
- REST: standing relaxed, facing the viewer, the spear held upright beside him, the shield at his side
- ATTACK: one step forward, the spear thrust forward, the shield raised in front of his chest
- HIT: upper body leaning backwards, eyes closed, the shield sagging, hand raised
- PORT: Show the red headband, the long black ponytail and the red cloak pinned at the shoulder.
- FRONT: Spear held ready in the right hand, small round shield raised on the left arm.
- BACK: Show the red cloak, the black ponytail, the back of the round shield and the spear.

## spa_spartiates | Spartiates | tier 2 | Infantry | ouder: Puer Laco

- Blad A, bijlagen: `spa_anker.png` en `spa_puerlaco_A.png`
- NAME: Spartiates; TIER: 2; BRANCH: Infantry; ROLE: infantry
- OUTFIT: He wears: a shiny GOLD Corinthian-style helmet with a tall bright red horsehair crest, the face open and clearly visible below the raised brow (tanned skin, long black hair hanging out below the helmet, clear dark eyes); a short bright red tunic with a thin leather cuirass; a bright red cloak (phoinikis) falling from both shoulders; a brown leather belt with a bronze buckle; shiny GOLD greaves on both shins; brown leather sandals with straps. In his left hand a ROUND shield (aspis) painted saturated red with a yellow upward-pointing chevron (an inverted V) as emblem and a gold rim and boss. In his right hand a long wooden spear (dory) with a silver leaf-shaped head. A short straight sword (xiphos) in a brown scabbard at his left hip.
- REST: standing relaxed, facing the viewer, the spear held upright beside him, the shield at his side
- ATTACK: one step forward, the spear thrust forward over the top of the shield, the shield raised
- HIT: upper body leaning backwards, eyes closed, the shield sagging, the spear tilting
- PORT: Show the gold helmet with the red crest, the long black hair and the red cloak.
- FRONT: Round shield raised on the left arm, spear held ready in the right hand.
- BACK: Show the back of the round shield, the long red cloak, the helmet crest and the spear.

## spa_trecentus | Trecentus | tier 3 | Infantry | ouder: Spartiates

- Blad A, bijlagen: `spa_anker.png` en `spa_spartiates_A.png`
- NAME: Trecentus; TIER: 3; BRANCH: Infantry; ROLE: infantry
- OUTFIT: He wears: a shiny GOLD Corinthian-style helmet with a taller bright red horsehair crest and gold cheek guards, face open and clearly visible (tanned skin, long black hair, a short black beard, clear dark eyes, a fierce look); a shiny GOLD bell-shaped cuirass over a short bright red tunic with a red skirt of leather strips; a long bright red cloak with a gold brooch; a brown leather belt with a gold buckle; shiny GOLD greaves on both shins; brown leather sandals with straps. In his left hand a ROUND shield (aspis) painted saturated red with a yellow upward-pointing chevron (an inverted V) as emblem and a gold rim and boss, with a wider gold rim than the Spartiates. In his right hand a long wooden spear (dory) with a silver leaf-shaped head. A short straight sword (xiphos) in a brown scabbard at his left hip.
- REST: standing relaxed, facing the viewer, the spear held upright beside him, the shield at his side
- ATTACK: one step forward, the spear thrust forward over the top of the shield, the shield raised
- HIT: upper body leaning backwards, eyes closed, the shield sagging, the spear tilting
- PORT: Show the gold helmet with the tall red crest, the short black beard, the gold cuirass and the red cloak with the gold brooch.
- FRONT: Round shield raised on the left arm, spear held ready in the right hand.
- BACK: Show the back of the round shield, the long red cloak, the helmet crest and the spear.

## spa_polemarchus | Polemarchus | tier 4 | Infantry | ouder: Trecentus

- Blad A, bijlagen: `spa_anker.png` en `spa_trecentus_A.png`
- NAME: Polemarchus; TIER: 4; BRANCH: Infantry; ROLE: infantry
- OUTFIT: He wears: a shiny GOLD Attic-style helmet with a large, tall bright red horsehair crest running from side to side over the top, gold cheek guards, face open and clearly visible (tanned skin, long black hair, a black beard, clear dark eyes, a commanding look); a shiny GOLD muscle cuirass with gold shoulder straps over a short bright red tunic with a red skirt of leather strips with gold studs; a bright red sash tied around the waist; a long rich bright red cloak down to the calves with a round gold clasp; shiny GOLD greaves on both shins; brown leather sandals with straps. In his left hand a ROUND shield (aspis) painted saturated red with a yellow upward-pointing chevron (an inverted V) as emblem and a gold rim and boss, with a very wide gold rim. In his right hand a straight sword with a silver blade and a gold hilt, raised in command.
- REST: standing proudly, facing the viewer, the sword resting on his shoulder, the shield at his side
- ATTACK: one step forward, the sword thrust forward in command, the shield raised
- HIT: upper body leaning backwards, eyes closed, the shield sagging, the sword tilting
- PORT: Show the gold helmet with the large red transverse crest, the black beard, the gold cuirass and the gold clasp of the cloak.
- FRONT: Round shield raised on the left arm, sword raised in the right hand.
- BACK: Show the back of the round shield, the long red cloak, the transverse crest and the sword.

## spa_perioecus | Perioecus | tier 2 | Light and scouting | ouder: Puer Laco

- Blad A, bijlagen: `spa_anker.png` en `spa_puerlaco_A.png`
- NAME: Perioecus; TIER: 2; BRANCH: Light and scouting; ROLE: ranged, scout with javelins
- OUTFIT: He wears: a conical felt cap (pilos) in saturated red, face clearly visible (tanned skin, black hair, clear dark eyes); a short brown-red wool tunic with a red hem; a short bright red cloak knotted at the shoulder; a brown leather belt with a small stone pouch at the left hip; bare knees; brown leather sandals with straps; NO armour and NO shield. In his right hand a light wooden javelin with a silver head; a bundle of two more javelins is tied across his back.
- REST: standing relaxed, facing the viewer, the javelin held loosely, light on his feet
- ATTACK: throwing pose: leaning back then forward, the javelin in the raised right hand aimed forward, left arm stretched forward
- HIT: upper body leaning backwards, eyes closed, the javelin dropping, hand raised
- PORT: Show the red felt cap, the red cloak knot and the tunic collar.
- FRONT: Javelin raised in the right hand ready to throw, the javelin bundle visible above his shoulder.
- BACK: Show the red cloak, the bundle of javelins across his back and the stone pouch.

## spa_sciritas | Sciritas | tier 3 | Light and scouting | ouder: Perioecus

- Blad A, bijlagen: `spa_anker.png` en `spa_perioecus_A.png`
- NAME: Sciritas; TIER: 3; BRANCH: Light and scouting; ROLE: ranged, elite scout with javelins
- OUTFIT: He wears: a shiny GOLD conical helmet (pilos shape) with a short bright red plume, face open and clearly visible (tanned skin, long black hair, a short black beard, clear dark eyes); a brown leather jerkin with gold studs and red trim over a short red tunic; a short bright red cloak with a gold clasp; a brown leather belt with a gold buckle and a short curved sword (kopis) in a brown scabbard; shiny gold bracers; brown leather boots laced to the calf; NO shield. In his right hand a javelin with a silver head; two more javelins in a bundle on his back.
- REST: standing relaxed, facing the viewer, the javelin held loosely, looking alert
- ATTACK: one step forward, the javelin thrown forward from the raised right hand, left arm stretched forward
- HIT: upper body leaning backwards, eyes closed, the javelin dropping, hand raised
- PORT: Show the gold helmet with the short red plume, the short beard and the red cloak with the gold clasp.
- FRONT: The javelin held ready in the right hand, the curved sword at the hip, the javelin bundle behind his shoulder.
- BACK: Show the red cloak with the gold clasp, the javelin bundle across his back and the curved sword.
