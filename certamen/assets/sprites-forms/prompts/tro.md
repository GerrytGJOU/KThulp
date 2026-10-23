# Beeldprompts Trojanen (volkscode tro)

Geschreven op 2026-10-23 (nog niet gegenereerd). Anker: `tro_anker.png` — maak dat eerst met PROMPT 0 hieronder (UPLOAD `gra_anker.png` en `rom_anker.png` alleen als stijlreferentie). Blad A: anker + A van de ouder (Tiro Troianus A: anker + `rom_tiro_A.png`). Blad B: A van de vorm + `tro_tirotroianus_B.png` (Tiro Troianus B: A + `rom_tiro_B.png`). Vul de `{{...}}` in per vorm; `{{FMT}}` = Tiro Troianus; `{{SECOND}}` staat per vorm.

## PROMPT 0 (anker)

- GEBRUIK: ChatGPT | UPLOAD: `rom_anker.png`, `gra_anker.png` (alleen stijlreferentie) | OPSLAAN ALS: `tro_anker.png`
```
Create ONE image: canvas exactly 1024 x 1024 pixels, 16-bit JRPG pixel-art in the style of RPG Maker MV and classic Fire Emblem sprites (match the attached reference images exactly in pixel size, outline, palette saturation and level of detail; do NOT copy their clothing). One standing Trojan recruit (Tiro Troianus), three-quarter top-down view from about 30 degrees above, facing the viewer, on one flat solid magenta #FF00FF background without gradient, floor or ground shadow. He wears: bare head with short brown hair and a thin purple headband, face clearly visible (light skin, clear dark eyes, a determined look); a short plain cream linen tunic with a purple hem; a short bright purple cloak pinned at one shoulder; a brown leather belt; bare knees; brown leather sandals with straps; NO armour and NO helmet. In his left hand a small ROUND wooden shield painted saturated purple with a yellow horse head emblem and a small gold boss; in his right hand a plain wooden spear with a short silver-grey leaf-shaped head. Chunky visible pixels, at most 24 colours, one dark-brown 1-pixel outline, flat cel-shading with at most two tones per colour, chibi proportions (head about one third of body height). The figure is at most 56 of 64 pixel blocks tall with at least 4 blocks of magenta margin. NO TEXT of any kind. AVOID: text, labels, logos, watermark, frame, border, second figure, realistic or painterly shading, blurry or anti-aliased edges, gradients, ground shadow, floor, magenta inside the figure.
```

## Sjabloon blad A
```
Use the attached images as the exact reference. The FIRST image is the Trojan anchor (style, palette, outline, proportions and level of detail). {{SECOND}}

Create ONE sprite sheet: canvas exactly 1536 x 1024 pixels, 16-bit JRPG pixel-art in the style of RPG Maker MV and classic Fire Emblem sprites. Layout: 3 columns by 2 rows of INVISIBLE cells, each cell exactly 512 x 512 pixels, the SAME character in all six cells. Background: one flat solid magenta #FF00FF, no gradient, no floor, no shadow on the ground. No magenta anywhere in the figure. IMPORTANT: the image contains NO TEXT of any kind: no labels, no captions, no pose names, no titles, no numbers and no letters anywhere, neither inside nor outside the cells.

CHARACTER: "{{NAME}}", Trojan unit (tier {{TIER}}, branch {{BRANCH}}, role {{ROLE}}). {{OUTFIT}}

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

Style reference: match the attached reference sheet exactly in palette and shading. Use bright, saturated colours with strong contrast: metal helmets shiny GOLD (not brown), shields saturated purple with a yellow horse-head emblem, mail and blades light SILVER-GREY. Skin and face must stay clearly readable when the sprite is shrunk to 48 pixels (clear dark eyes, light skin tone, mouth visible). Canvas exactly as stated. Do NOT draw any grid lines, borders or separators between the cells; the cells are only an invisible layout.

AVOID: NO TEXT OF ANY KIND (no labels, captions, pose names, titles, numbers or letters above, below or next to the figures); no logos or watermark; no frame, border, grid lines or separator lines drawn between the cells; no second figure; no change of clothing or colours between poses; no difference in scale between cells; no realistic or painterly shading; no blurry or anti-aliased edges; no gradients; no shadow on the ground; no floor; no magenta inside the figure.
```

## Sjabloon blad B
```
Use the attached images as reference. The FIRST image (the six-cell sprite sheet of {{NAME}}) shows THE SAME character to be redrawn: use it ONLY for the character's appearance and do NOT copy its six-cell layout. The SECOND image (the finished 3-cell sheet of the recruit {{FMT}}: portrait, battle front, battle back) shows the exact FORMAT, style, palette, outline, proportions and level of detail to follow (do NOT copy its clothing). Your output must have the same layout as the second image: ONE row of exactly three cells, never two rows and never six cells.

Create ONE sheet: canvas exactly 1536 x 512 pixels, 16-bit JRPG pixel-art in the style of RPG Maker MV and classic Fire Emblem sprites. Layout: ONE single row of exactly 3 INVISIBLE cells side by side (NOT six cells, NOT two rows), each exactly 512 x 512 pixels, the SAME character in all three. Background: one flat solid magenta #FF00FF, no gradient, no floor, no shadow on the ground. No magenta anywhere in the figure. IMPORTANT: the image contains NO TEXT of any kind: no labels, no captions, no pose names, no titles, no numbers and no letters anywhere, neither inside nor outside the cells.

CHARACTER: "{{NAME}}", Trojan unit (tier {{TIER}}, branch {{BRANCH}}, role {{ROLE}}). {{OUTFIT}}

STYLE: chunky visible pixels, at most 24 colours, one dark-brown 1-pixel outline around the whole figure, flat cel-shading with at most two tones per colour, warm saturated fantasy colours, small chibi proportions (head about one third of body height), easy to read at small size.

PIXEL GRID: every cell is its own 64 x 64 pixel grid; every pixel is a block of 8 x 8 image pixels and all pixels in the whole image are exactly the same size. In cells 2 and 3 the figure is at most 56 of the 64 pixels tall with at least 4 blocks of empty magenta margin all around, feet on the same horizontal line in both cells, same size in both cells.

CELLS:
Cell 1, a bust portrait: bust, three-quarter view, looking slightly to the right of the image, a stern but friendly look, more detail in the face than in the sprites; the figure fills about 60 percent of the cell. {{PORT}}
Cell 2, full body seen from the front: full body, ready for battle, straight from the front at eye level, face towards the viewer. {{FRONT}}
Cell 3, full body seen from behind: the same body exactly from behind, with a slight angle from above. {{BACK}}

CONSISTENCY: the equipment stays the same in ALL cells and every part of the figure, including weapons, tools and banners, stays completely inside its own cell, at least 4 pixel blocks from the cell edges, never touching a neighbouring cell. Shield shape and emblem never change between cells.

Style reference: match the attached reference sheet exactly in palette and shading. Use bright, saturated colours with strong contrast: metal helmets shiny GOLD (not brown), shields saturated purple with a yellow horse-head emblem, mail and blades light SILVER-GREY. Skin and face must stay clearly readable when the sprite is shrunk to 48 pixels (clear dark eyes, light skin tone, mouth visible). Canvas exactly as stated. Do NOT draw any grid lines, borders or separators between the cells; the cells are only an invisible layout.

AVOID: NO TEXT OF ANY KIND (no labels, captions, pose names, titles, numbers or letters above, below or next to the figures); no logos or watermark; no frame, border, grid lines or separator lines drawn between the cells; no second figure; no change of clothing or colours between cells; no difference in scale between cells 2 and 3; no realistic or painterly shading; no blurry or anti-aliased edges; no gradients; no shadow on the ground; no floor; no magenta inside the figure.
```

## tro_tirotroianus | Tiro Troianus | tier 1 | Recruit | ouder: -

- Blad A, bijlagen: `tro_anker.png` en `rom_tiro_A.png`
- SECOND: The SECOND image is the finished Roman recruit sheet (Tiro): use it ONLY for the sheet format, the pixel size and the pose layout; do NOT copy its clothing, shield or face.
- NAME: Tiro Troianus; TIER: 1; BRANCH: Recruit; ROLE: recruit
- OUTFIT: He is a young Trojan recruit, the simplest unit. He wears: bare head with short brown hair and a thin purple headband, face clearly visible (light skin, clear dark eyes, a determined look); a short plain cream linen tunic with a purple hem; a short bright purple cloak pinned at one shoulder; a brown leather belt; bare knees; plain brown leather sandals with straps; NO armour and NO helmet. In his left hand a small ROUND wooden shield painted saturated purple with a yellow horse head as emblem and a small gold boss. In his right hand a plain wooden spear with a short silver-grey leaf-shaped head.
- REST: standing relaxed, facing the viewer, the spear held upright beside him, the shield at his side
- ATTACK: one step forward, the spear thrust forward, the shield raised in front of his chest
- HIT: upper body leaning backwards, eyes closed, the shield sagging, hand raised
- PORT: Show the purple headband, the short brown hair and the purple cloak pinned at the shoulder.
- FRONT: Spear held ready in the right hand, small round purple shield raised on the left arm.
- BACK: Show the purple cloak, the short brown hair, the back of the round shield and the spear.

## tro_hastifer | Hastifer | tier 2 | Infantry | ouder: Tiro Troianus

- Blad A, bijlagen: `tro_anker.png` en `tro_tirotroianus_A.png`
- SECOND: The SECOND image is the finished sheet of the parent form (Tiro Troianus): this unit is the next step of the SAME Trojan line, so keep the same purple, the same horse-head emblem and the same basic design, but richer and with the new equipment described below.
- NAME: Hastifer; TIER: 2; BRANCH: Infantry; ROLE: infantry
- OUTFIT: He wears: a shiny GOLD conical bronze helmet with a short bright purple plume and a nose guard, face open and clearly visible (light skin, short brown hair, clear dark eyes); a cream linen tunic with a leather cuirass studded with gold, purple hem; a bright purple cloak falling from both shoulders; a brown leather belt with a bronze buckle; shiny GOLD greaves; brown leather sandals. In his left hand a ROUND shield painted saturated purple with a yellow horse head emblem and a gold rim and boss. In his right hand a long wooden spear (hasta) with a silver leaf-shaped head. A short straight sword in a brown scabbard at his left hip.
- REST: standing relaxed, facing the viewer, the spear held upright beside him, the shield at his side
- ATTACK: one step forward, the spear thrust forward over the top of the shield, the shield raised
- HIT: upper body leaning backwards, eyes closed, the shield sagging, the spear tilting
- PORT: Show the gold helmet with the short purple plume, the nose guard and the purple cloak.
- FRONT: Round purple shield raised on the left arm, spear held ready in the right hand.
- BACK: Show the back of the round shield, the purple cloak, the helmet plume and the spear.

## tro_propugnator | Propugnator | tier 3 | Infantry | ouder: Hastifer

- Blad A, bijlagen: `tro_anker.png` en `tro_hastifer_A.png`
- SECOND: The SECOND image is the finished sheet of the parent form (Hastifer): this unit is the next step of the SAME Trojan line, so keep the same purple, the same horse-head emblem and the same basic design, but richer and with the new equipment described below.
- NAME: Propugnator; TIER: 3; BRANCH: Infantry; ROLE: infantry
- OUTFIT: He wears: a shiny GOLD bronze helmet with a taller bright purple plume, a nose guard and gold cheek guards, face open and clearly visible (light skin, short brown hair, a short brown beard, clear dark eyes, a firm look); a shiny GOLD scale cuirass over a cream tunic with a purple skirt of leather strips; a long bright purple cloak with a gold brooch; a brown belt with a gold buckle; shiny GOLD greaves; brown leather sandals. In his left hand a large ROUND shield painted saturated purple with a yellow horse head emblem and a wide gold rim and boss. In his right hand a long wooden spear with a silver leaf-shaped head. A short straight sword at his left hip.
- REST: standing firmly, facing the viewer, the spear held upright beside him, the large shield planted at his side
- ATTACK: one step forward, the spear thrust forward over the top of the shield, the shield raised
- HIT: upper body leaning backwards, eyes closed, the shield sagging, the spear tilting
- PORT: Show the gold helmet with the tall purple plume, the short beard, the gold scale cuirass and the gold brooch.
- FRONT: Large round purple shield raised on the left arm, spear held ready in the right hand.
- BACK: Show the back of the large shield, the long purple cloak, the helmet plume and the spear.

## tro_custospergami | Custos Pergami | tier 4 | Infantry | ouder: Propugnator

- Blad A, bijlagen: `tro_anker.png` en `tro_propugnator_A.png`
- SECOND: The SECOND image is the finished sheet of the parent form (Propugnator): this unit is the next step of the SAME Trojan line, so keep the same purple, the same horse-head emblem and the same basic design, but richer and with the new equipment described below.
- NAME: Custos Pergami; TIER: 4; BRANCH: Infantry; ROLE: infantry
- OUTFIT: He is the guardian of the citadel Pergamum. He wears: a shiny GOLD bronze helmet with a very tall bright purple plume running from front to back, gold cheek guards and a gold laurel band, face open and clearly visible (light skin, short brown hair, a brown beard with grey streaks, clear dark eyes, a commanding look); a shiny GOLD muscle cuirass with gold shoulder straps over a cream tunic with a purple skirt of leather strips with gold studs; a rich bright purple cloak down to the calves with a round gold clasp; a purple sash at the waist; shiny GOLD greaves; brown leather sandals. In his left hand a tall oval tower shield painted saturated purple with a large yellow horse head emblem and a wide gold rim. In his right hand a long wooden spear with a silver leaf-shaped head and a gold ring below the head.
- REST: standing proudly, facing the viewer, the spear upright beside him, the tall shield planted at his side
- ATTACK: one step forward, the spear thrust forward past the edge of the tall shield, the shield raised
- HIT: upper body leaning backwards, eyes closed, the tall shield sagging, the spear tilting
- PORT: Show the gold helmet with the very tall purple plume, the laurel band, the grey-streaked beard and the gold clasp of the cloak.
- FRONT: Tall oval purple shield on the left arm, spear held ready in the right hand.
- BACK: Show the back of the tall shield, the long purple cloak, the helmet plume and the spear.

## tro_custosportae | Custos portae | tier 3 | Infantry | ouder: Hastifer

- Blad A, bijlagen: `tro_anker.png` en `tro_hastifer_A.png`
- SECOND: The SECOND image is the finished sheet of the parent form (Hastifer): this unit is the next step of the SAME Trojan line, so keep the same purple, the same horse-head emblem and the same basic design, but richer and with the new equipment described below.
- NAME: Custos portae; TIER: 3; BRANCH: Infantry; ROLE: infantry (gate guard)
- OUTFIT: He is a gate guard of Troy. He wears: a shiny GOLD bronze helmet with a broad nose guard and a short, low purple crest, face open and clearly visible (light skin, short brown hair, a stubbly beard, clear dark eyes, a watchful look); a heavy shiny GOLD scale cuirass with short sleeves over a cream tunic with a purple hem; a short purple cloak; a thick brown leather belt with a large gold gate key hanging from it; shiny GOLD greaves; brown leather boots. In his left hand a large tall shield painted saturated purple with a yellow horse head emblem and a gold rim shaped like an arched gate. In his right hand a short stout spear with a broad silver blade, held like a gate pike. A short sword at his left hip.
- REST: standing on guard, facing the viewer, the tall shield planted in front of him, the short spear upright beside him
- ATTACK: one step forward, the short spear thrust forward from behind the shield, the shield raised
- HIT: upper body leaning backwards, eyes closed, the shield sagging, the spear tilting
- PORT: Show the gold helmet with the nose guard and low purple crest, the stubbly beard and the gold gate key on the belt.
- FRONT: Tall purple shield with the arched gold rim on the left arm, short stout spear in the right hand.
- BACK: Show the back of the tall shield, the short purple cloak, the gold gate key and the spear.

## tro_sagittariustroia | Sagittarius Troianus | tier 2 | Ranged | ouder: Tiro Troianus

- Blad A, bijlagen: `tro_anker.png` en `tro_tirotroianus_A.png`
- SECOND: The SECOND image is the finished sheet of the parent form (Tiro Troianus): this unit is the next step of the SAME Trojan line, so keep the same purple, the same horse-head emblem and the same basic design, but richer and with the new equipment described below.
- NAME: Sagittarius Troianus; TIER: 2; BRANCH: Ranged; ROLE: ranged, archer
- OUTFIT: He wears: a soft pointed Phrygian cap in saturated purple with a yellow band, face clearly visible (light skin, short brown hair, clear dark eyes); a cream linen tunic with long sleeves and a purple hem; a bright purple scarf-cloak knotted at the throat; a brown leather belt with a small pouch; brown leather boots; NO armour and NO shield. In his left hand a short curved composite bow in dark wood with a yellow string-wrap; a brown leather quiver with purple-feathered arrows hangs on his back.
- REST: standing relaxed, facing the viewer, the bow held loosely in the left hand, an arrow in the right
- ATTACK: drawing the bow: one foot forward, the bowstring pulled back with an arrow aimed forward, the left arm stretched forward
- HIT: upper body leaning backwards, eyes closed, the bow dropping, hand raised
- PORT: Show the purple Phrygian cap with the yellow band, the purple scarf and the bow over his shoulder.
- FRONT: Bow held in the left hand, an arrow ready in the right hand, the quiver visible over his shoulder.
- BACK: Show the purple scarf-cloak, the quiver with purple-feathered arrows and the bow.

## tro_sagittariuslyciu | Sagittarius Lycius | tier 3 | Ranged | ouder: Sagittarius Troianus

- Blad A, bijlagen: `tro_anker.png` en `tro_sagittariustroia_A.png`
- SECOND: The SECOND image is the finished sheet of the parent form (Sagittarius Troianus): this unit is the next step of the SAME Trojan line, so keep the same purple, the same horse-head emblem and the same basic design, but richer and with the new equipment described below.
- NAME: Sagittarius Lycius; TIER: 3; BRANCH: Ranged; ROLE: ranged, archer
- OUTFIT: He is a Lycian archer allied to Troy. He wears: a purple Phrygian cap with a gold edge and a long yellow feather, face clearly visible (light skin, short brown hair, a short brown beard, clear dark eyes, a sharp look); a leather jerkin with gold studs over a cream long-sleeved tunic with a purple hem; a grey wolf pelt draped over one shoulder; a purple sash across the chest; gold bracers; a brown leather belt with a pouch; brown leather boots; NO shield. In his left hand a long recurve composite bow in dark wood with gold tips; a large brown leather quiver with purple-feathered arrows on his back.
- REST: standing relaxed, facing the viewer, the bow held loosely in the left hand, an arrow in the right
- ATTACK: drawing the long bow: one foot forward, the bowstring pulled back with an arrow aimed forward, the left arm stretched forward
- HIT: upper body leaning backwards, eyes closed, the bow dropping, hand raised
- PORT: Show the purple cap with the long yellow feather, the short beard, the wolf pelt and the purple sash.
- FRONT: Long recurve bow held in the left hand, an arrow ready in the right hand, the wolf pelt on the shoulder.
- BACK: Show the wolf pelt, the purple sash, the large quiver with purple-feathered arrows and the bow.

## tro_auriga | Auriga | tier 2 | Chariots | ouder: Tiro Troianus

- Blad A, bijlagen: `tro_anker.png` en `tro_tirotroianus_A.png`
- SECOND: The SECOND image is the finished sheet of the parent form (Tiro Troianus): this unit is the next step of the SAME Trojan line, so keep the same purple, the same horse-head emblem and the same basic design, but richer and with the new equipment described below.
- NAME: Auriga; TIER: 2; BRANCH: Chariots; ROLE: cavalry, chariot driver
- OUTFIT: He is a chariot driver. The unit is the chariot and its driver together as ONE whole in the cell: a light two-wheeled wooden chariot with bronze-gold rim bands and a purple side panel with a yellow horse head, drawn by TWO brown horses with purple plumes on their heads and purple harness straps. The driver stands in the chariot and wears: a shiny GOLD conical helmet with a short purple plume, face clearly visible (light skin, clear dark eyes); a cream tunic with a purple hem; a short purple cloak; brown leather boots; NO shield. In his hands the long reins and a short whip. The whole chariot with horses fits inside the 56-pixel limit and the margins.
- REST: standing in the chariot, the horses standing still, facing the viewer, the reins held in both hands
- ATTACK: the chariot surging one step forward, the horses rearing slightly, the driver cracking the whip forward
- HIT: the horses shying back, the driver leaning backwards with eyes closed, the reins loosening
- PORT: Show the gold helmet with the purple plume, the reins in his hands and the purple-plumed head of one horse.
- FRONT: The chariot with the two horses seen from the front, the driver holding the reins.
- BACK: Show the back of the chariot with the purple panel, the driver's purple cloak and the hindquarters of the two horses.

## tro_bellatorcurru | Bellator curru | tier 3 | Chariots | ouder: Auriga

- Blad A, bijlagen: `tro_anker.png` en `tro_auriga_A.png`
- SECOND: The SECOND image is the finished sheet of the parent form (Auriga): this unit is the next step of the SAME Trojan line, so keep the same purple, the same horse-head emblem and the same basic design, but richer and with the new equipment described below.
- NAME: Bellator curru; TIER: 3; BRANCH: Chariots; ROLE: cavalry, chariot warrior
- OUTFIT: He is a warrior on a chariot. The unit is the chariot and its warrior together as ONE whole in the cell: a sturdy two-wheeled chariot with gold-trimmed rails, a tall purple side panel with a large yellow horse head, and a purple pennant on a short pole, drawn by TWO white horses with tall purple plumes and gold harness. The warrior stands in the chariot and wears: a shiny GOLD bronze helmet with a tall bright purple plume and gold cheek guards, face open and clearly visible (light skin, short brown hair, a short brown beard, clear dark eyes, a fierce look); a shiny GOLD scale cuirass over a cream tunic; a long bright purple cloak streaming behind; shiny GOLD greaves. In his left hand a ROUND purple shield with a yellow horse head and gold rim; in his right hand a long spear with a silver leaf-shaped head. The whole chariot with horses fits inside the 56-pixel limit and the margins.
- REST: standing in the chariot, the horses standing still, facing the viewer, the spear upright, the shield on his arm
- ATTACK: the chariot surging one step forward, the horses rearing slightly, the spear thrust forward over the shield
- HIT: the horses shying back, the warrior leaning backwards with eyes closed, the shield sagging
- PORT: Show the gold helmet with the tall purple plume, the short beard and the shield with the horse head.
- FRONT: The chariot with the two white horses seen from the front, the warrior with spear and shield.
- BACK: Show the back of the chariot with the purple panel and pennant, the purple cloak and the hindquarters of the two white horses.

## tro_ministertempli | Minister templi | tier 2 | Priests | ouder: Tiro Troianus

- Blad A, bijlagen: `tro_anker.png` en `tro_tirotroianus_A.png`
- SECOND: The SECOND image is the finished sheet of the parent form (Tiro Troianus): this unit is the next step of the SAME Trojan line, so keep the same purple, the same horse-head emblem and the same basic design, but richer and with the new equipment described below.
- NAME: Minister templi; TIER: 2; BRANCH: Priests; ROLE: support, temple servant
- OUTFIT: He is a young temple servant of Apollo. He wears: bare head with short brown hair and a white headband with a purple stripe, face clearly visible (light skin, clear dark eyes, a gentle look); a long plain white linen robe down to the ankles with a purple border and a rope belt; a short purple shoulder cape; brown leather sandals; NO armour, NO weapons and NO shield. In his right hand a plain wooden staff with a small gold sun disc on top; in his left hand a small bronze incense bowl with a thin curl of smoke.
- REST: standing calmly, facing the viewer, the staff upright beside him, the incense bowl held in front of him
- ATTACK: stepping forward, raising the staff so that the gold sun disc flashes, the incense bowl held out
- HIT: upper body leaning backwards, eyes closed, the incense bowl tilting, hand raised
- PORT: Show the white headband with the purple stripe, the white robe with the purple border and the staff with the sun disc.
- FRONT: Staff with the gold sun disc in the right hand, the incense bowl in the left hand.
- BACK: Show the purple shoulder cape, the white robe with the rope belt and the staff with the sun disc.

## tro_sacerdosapollini | Sacerdos Apollinis | tier 3 | Priests | ouder: Minister templi

- Blad A, bijlagen: `tro_anker.png` en `tro_ministertempli_A.png`
- SECOND: The SECOND image is the finished sheet of the parent form (Minister templi): this unit is the next step of the SAME Trojan line, so keep the same purple, the same horse-head emblem and the same basic design, but richer and with the new equipment described below.
- NAME: Sacerdos Apollinis; TIER: 3; BRANCH: Priests; ROLE: support, healer, priest
- OUTFIT: He is a priest of Apollo, a healer. He wears: a green and gold laurel wreath on short brown hair, face clearly visible (light skin, a short brown beard, clear dark eyes, a kind look); a long white linen robe with gold sun embroidery on the chest and a wide purple border; a purple mantle over one shoulder pinned with a gold brooch; a purple sash; gold bangles; brown leather sandals; NO armour and NO shield. In his right hand a tall wooden staff topped with a larger gold sun disc with rays; in his left hand a small pouch of healing herbs tied with a purple ribbon and a green laurel branch.
- REST: standing calmly, facing the viewer, the staff upright beside him, the herb pouch and laurel branch in the left hand
- ATTACK: stepping forward, raising the staff so that the golden rays flash, the laurel branch held out in blessing
- HIT: upper body leaning backwards, eyes closed, the staff tilting, hand raised
- PORT: Show the laurel wreath, the short beard, the gold sun embroidery and the purple mantle with the gold brooch.
- FRONT: Staff with the large gold sun disc in the right hand, the laurel branch and herb pouch in the left hand.
- BACK: Show the purple mantle, the white robe with the purple sash and the staff with the sun disc.

## tro_vates | Vates | tier 4 | Priests | ouder: Sacerdos Apollinis

- Blad A, bijlagen: `tro_anker.png` en `tro_sacerdosapollini_A.png`
- SECOND: The SECOND image is the finished sheet of the parent form (Sacerdos Apollinis): this unit is the next step of the SAME Trojan line, so keep the same purple, the same horse-head emblem and the same basic design, but richer and with the new equipment described below.
- NAME: Vates; TIER: 4; BRANCH: Priests; ROLE: support, seer
- OUTFIT: He is the seer of Troy. He wears: a gold laurel crown with a small gold sun on the brow on long grey-streaked brown hair, face clearly visible (light skin, a long brown beard with grey streaks, clear dark eyes, a wise look); a long white robe richly embroidered with gold suns and stars, a very wide purple border and gold hems; a long bright purple mantle down to the ground with a round gold clasp; a gold collar; gold bangles; brown leather sandals; NO armour and NO shield. In his right hand a tall golden staff topped with a gold sun disc with long rays; in his left hand a small golden lyre.
- REST: standing calmly, facing the viewer, the golden staff upright beside him, the lyre held at his side
- ATTACK: stepping forward, raising the golden staff so that the rays flash, the other hand strumming the lyre
- HIT: upper body leaning backwards, eyes closed, the staff tilting, hand raised
- PORT: Show the gold laurel crown, the long grey-streaked beard, the gold collar and the gold clasp of the purple mantle.
- FRONT: Golden staff with the large sun disc in the right hand, the golden lyre in the left hand.
- BACK: Show the long purple mantle, the gold-embroidered white robe and the golden staff.

