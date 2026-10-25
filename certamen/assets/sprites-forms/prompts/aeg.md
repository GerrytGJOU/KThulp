# Beeldprompts Egyptenaren (volkscode aeg)

Geschreven op 2026-10-23 (nog niet gegenereerd). Anker: `aeg_anker.png` — maak dat eerst met PROMPT 0 hieronder (UPLOAD `gra_anker.png` en `rom_anker.png` alleen als stijlreferentie). Blad A: anker + A van de ouder (Iuvenis Aegyptius A: anker + `rom_tiro_A.png`). Blad B: A van de vorm + `aeg_iuvenisaegyptius_B.png` (Iuvenis Aegyptius B: A + `rom_tiro_B.png`). Vul de `{{...}}` in per vorm; `{{FMT}}` = Iuvenis Aegyptius; `{{SECOND}}` staat per vorm.

## PROMPT 0 (anker)

- GEBRUIK: ChatGPT | UPLOAD: `rom_anker.png`, `gra_anker.png` (alleen stijlreferentie) | OPSLAAN ALS: `aeg_anker.png`
```
Create ONE image: canvas exactly 1024 x 1024 pixels, 16-bit JRPG pixel-art in the style of RPG Maker MV and classic Fire Emblem sprites (match the attached reference images exactly in pixel size, outline, palette saturation and level of detail; do NOT copy their clothing). One standing Egyptian recruit (Iuvenis Aegyptius), three-quarter top-down view from about 30 degrees above, facing the viewer, on one flat solid magenta #FF00FF background without gradient, floor or ground shadow. He wears: a short black wig with a thin gold headband, face clearly visible (deep warm brown skin (clearly darker than Roman or Greek skin), dark eyes outlined with black kohl, a calm look); a bare chest with a plain white linen collar; a short white linen kilt with a gold hem; a plain brown leather belt; a short gold-yellow cloth sash over one shoulder; brown leather sandals; NO armour and NO helmet. In his left hand a small tall wooden shield with a rounded top painted saturated gold-yellow with a dark blue eye emblem and a small bronze boss; in his right hand a plain wooden spear with a short silver-grey leaf-shaped head. Chunky visible pixels, at most 24 colours, one dark-brown 1-pixel outline, flat cel-shading with at most two tones per colour, chibi proportions (head about one third of body height). The figure is at most 56 of 64 pixel blocks tall with at least 4 blocks of magenta margin. NO TEXT of any kind. AVOID: text, labels, logos, watermark, frame, border, second figure, realistic or painterly shading, blurry or anti-aliased edges, gradients, ground shadow, floor, magenta inside the figure.
```

## Sjabloon blad A
```
Use the attached images as the exact reference. The FIRST image is the Egyptian anchor (style, palette, outline, proportions and level of detail). {{SECOND}}

Create ONE sprite sheet: canvas exactly 1536 x 1024 pixels, 16-bit JRPG pixel-art in the style of RPG Maker MV and classic Fire Emblem sprites. Layout: 3 columns by 2 rows of INVISIBLE cells, each cell exactly 512 x 512 pixels, the SAME character in all six cells. Background: one flat solid magenta #FF00FF, no gradient, no floor, no shadow on the ground. No magenta anywhere in the figure. IMPORTANT: the image contains NO TEXT of any kind: no labels, no captions, no pose names, no titles, no numbers and no letters anywhere, neither inside nor outside the cells.

CHARACTER: "{{NAME}}", Egyptian unit (tier {{TIER}}, branch {{BRANCH}}, role {{ROLE}}). {{OUTFIT}}

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

Style reference: match the attached reference sheet exactly in palette and shading. Use bright, saturated colours with strong contrast: metal and jewellery shiny GOLD (not brown), shields saturated gold-yellow with a dark blue eye emblem, blades light SILVER-GREY. Skin and face must stay clearly readable when the sprite is shrunk to 48 pixels (clear dark eyes, deep brown skin tone, mouth visible). Canvas exactly as stated. Do NOT draw any grid lines, borders or separators between the cells; the cells are only an invisible layout.

AVOID: NO TEXT OF ANY KIND (no labels, captions, pose names, titles, numbers or letters above, below or next to the figures); no logos or watermark; no frame, border, grid lines or separator lines drawn between the cells; no second figure; no change of clothing or colours between poses; no difference in scale between cells; no realistic or painterly shading; no blurry or anti-aliased edges; no gradients; no shadow on the ground; no floor; no magenta inside the figure.
```

## Sjabloon blad B
```
Use the attached images as reference. The FIRST image (the six-cell sprite sheet of {{NAME}}) shows THE SAME character to be redrawn: use it ONLY for the character's appearance and do NOT copy its six-cell layout. The SECOND image (the finished 3-cell sheet of the recruit {{FMT}}: portrait, battle front, battle back) shows the exact FORMAT, style, palette, outline, proportions and level of detail to follow (do NOT copy its clothing). Your output must have the same layout as the second image: ONE row of exactly three cells, never two rows and never six cells.

Create ONE sheet: canvas exactly 1536 x 512 pixels, 16-bit JRPG pixel-art in the style of RPG Maker MV and classic Fire Emblem sprites. Layout: ONE single row of exactly 3 INVISIBLE cells side by side (NOT six cells, NOT two rows), each exactly 512 x 512 pixels, the SAME character in all three. Background: one flat solid magenta #FF00FF, no gradient, no floor, no shadow on the ground. No magenta anywhere in the figure. IMPORTANT: the image contains NO TEXT of any kind: no labels, no captions, no pose names, no titles, no numbers and no letters anywhere, neither inside nor outside the cells.

CHARACTER: "{{NAME}}", Egyptian unit (tier {{TIER}}, branch {{BRANCH}}, role {{ROLE}}). {{OUTFIT}}

STYLE: chunky visible pixels, at most 24 colours, one dark-brown 1-pixel outline around the whole figure, flat cel-shading with at most two tones per colour, warm saturated fantasy colours, small chibi proportions (head about one third of body height), easy to read at small size.

PIXEL GRID: every cell is its own 64 x 64 pixel grid; every pixel is a block of 8 x 8 image pixels and all pixels in the whole image are exactly the same size. In cells 2 and 3 the figure is at most 56 of the 64 pixels tall with at least 4 blocks of empty magenta margin all around, feet on the same horizontal line in both cells, same size in both cells.

CELLS:
Cell 1, a bust portrait: bust, three-quarter view, looking slightly to the right of the image, a stern but friendly look, more detail in the face than in the sprites; the figure fills about 60 percent of the cell. {{PORT}}
Cell 2, full body seen from the front: full body, ready for battle, straight from the front at eye level, face towards the viewer. {{FRONT}}
Cell 3, full body seen from behind: the same body exactly from behind, with a slight angle from above. {{BACK}}

CONSISTENCY: the equipment stays the same in ALL cells and every part of the figure, including weapons, tools and banners, stays completely inside its own cell, at least 4 pixel blocks from the cell edges, never touching a neighbouring cell. Shield shape and emblem never change between cells.

Style reference: match the attached reference sheet exactly in palette and shading. Use bright, saturated colours with strong contrast: metal and jewellery shiny GOLD (not brown), shields saturated gold-yellow with a dark blue eye emblem, blades light SILVER-GREY. Skin and face must stay clearly readable when the sprite is shrunk to 48 pixels (clear dark eyes, deep brown skin tone, mouth visible). Canvas exactly as stated. Do NOT draw any grid lines, borders or separators between the cells; the cells are only an invisible layout.

AVOID: NO TEXT OF ANY KIND (no labels, captions, pose names, titles, numbers or letters above, below or next to the figures); no logos or watermark; no frame, border, grid lines or separator lines drawn between the cells; no second figure; no change of clothing or colours between cells; no difference in scale between cells 2 and 3; no realistic or painterly shading; no blurry or anti-aliased edges; no gradients; no shadow on the ground; no floor; no magenta inside the figure.
```

## aeg_iuvenisaegyptius | Iuvenis Aegyptius | tier 1 | Recruit | ouder: -

- Blad A, bijlagen: `aeg_anker.png` en `rom_tiro_A.png`
- SECOND: The SECOND image is the finished Roman recruit sheet (Tiro): use it ONLY for the sheet format, the pixel size and the pose layout; do NOT copy its clothing, shield or face.
- NAME: Iuvenis Aegyptius; TIER: 1; BRANCH: Recruit; ROLE: recruit
- OUTFIT: He is a young Egyptian recruit, the simplest unit. He wears: a short black wig with a thin gold headband, face clearly visible (deep warm brown skin (clearly darker than Roman or Greek skin), dark eyes outlined with black kohl, a calm look); a bare chest with a plain white linen collar; a short white linen kilt (shendyt) with a gold hem; a plain brown leather belt; a short gold-yellow cloth sash over one shoulder; plain brown leather sandals; NO armour and NO helmet. In his left hand a small tall wooden shield with a rounded top painted saturated gold-yellow with a dark blue eye emblem and a small bronze boss. In his right hand a plain wooden spear with a short silver-grey leaf-shaped head.
- REST: standing relaxed, facing the viewer, the spear held upright beside his body, the shield at his side
- ATTACK: one step forward, the spear thrust forward, the shield raised in front of his chest
- HIT: upper body leaning backwards, eyes closed, the shield sagging, the spear tilting
- PORT: Show the black wig with the gold headband, the kohl-outlined eyes and the white collar.
- FRONT: Spear held ready in the right hand, small gold-yellow shield with the blue eye raised on the left arm.
- BACK: Show the black wig, the gold-yellow sash, the white kilt and the back of the small shield.

## aeg_machimus | Machimus | tier 2 | Infantry | ouder: Iuvenis Aegyptius

- Blad A, bijlagen: `aeg_anker.png` en `aeg_iuvenisaegyptius_A.png`
- SECOND: The SECOND image is the finished sheet of the parent form (Iuvenis Aegyptius): this unit is the next step of the SAME Egyptian line, so keep the same saturated gold and white, the same deep warm brown skin with short black hair, the same gold collar and the same blue eye emblem, but richer and with the new equipment described below.
- NAME: Machimus; TIER: 2; BRANCH: Infantry; ROLE: infantry
- OUTFIT: He is a professional Egyptian soldier. He wears: a short black wig under a shiny GOLD leather-and-bronze cap with a short gold-yellow band, face clearly visible (deep warm brown skin (clearly darker than Roman or Greek skin), kohl-outlined dark eyes, a firm look); a broad white linen collar with gold beads; a padded white linen tunic with gold-studded leather straps crossed over the chest; a white linen kilt with a gold apron panel; a wide brown belt with a gold buckle; leather wristbands; brown leather sandals. In his left hand a tall shield with a rounded top painted saturated gold-yellow with a dark blue eye emblem and a gold rim. In his right hand a curved sickle-sword (khopesh) with a silver blade; a short spear is tucked behind the shield.
- REST: standing relaxed, facing the viewer, the curved khopesh sword held upright beside his body, the shield at his side
- ATTACK: one step forward, the curved khopesh sword thrust forward, the shield raised in front of his chest
- HIT: upper body leaning backwards, eyes closed, the shield sagging, the curved khopesh sword tilting
- PORT: Show the gold cap over the black wig, the broad collar and the crossed leather straps.
- FRONT: Tall gold-yellow shield with the blue eye on the left arm, khopesh in the right hand.
- BACK: Show the back of the tall shield, the crossed straps, the white kilt and the khopesh.

## aeg_satelles | Satelles | tier 3 | Infantry | ouder: Machimus

- Blad A, bijlagen: `aeg_anker.png` en `aeg_machimus_A.png`
- SECOND: The SECOND image is the finished sheet of the parent form (Machimus): this unit is the next step of the SAME Egyptian line, so keep the same saturated gold and white, the same deep warm brown skin with short black hair, the same gold collar and the same blue eye emblem, but richer and with the new equipment described below.
- NAME: Satelles; TIER: 3; BRANCH: Infantry; ROLE: infantry
- OUTFIT: He is a royal guard. He wears: a shiny GOLD and dark blue striped headcloth (nemes-style) with a small gold cobra on the brow, face open and clearly visible (deep warm brown skin (clearly darker than Roman or Greek skin), kohl-outlined dark eyes, a stern look); a wide shiny GOLD collar with blue beads; a light linen-and-bronze scale cuirass in light SILVER-GREY over a white tunic; a white kilt with a gold apron panel; gold armbands; a gold belt; brown leather sandals with gold straps. In his left hand a tall shield with a rounded top painted saturated gold-yellow with a large dark blue eye and a wide gold rim. In his right hand a khopesh with a silver blade and a gold hilt; a long spear in a leather loop on his back.
- REST: standing relaxed, facing the viewer, the khopesh sword held upright beside his body, the shield at his side
- ATTACK: one step forward, the khopesh sword thrust forward, the shield raised in front of his chest
- HIT: upper body leaning backwards, eyes closed, the shield sagging, the khopesh sword tilting
- PORT: Show the gold-and-blue striped headcloth with the small cobra, the wide gold collar and the scale cuirass.
- FRONT: Tall gold-yellow shield with the blue eye on the left arm, khopesh in the right hand.
- BACK: Show the striped headcloth hanging down the back, the back of the tall shield, the spear across the back and the gold armbands.

## aeg_custospharaonis | Custos Pharaonis | tier 4 | Infantry | ouder: Satelles

- Blad A, bijlagen: `aeg_anker.png` en `aeg_satelles_A.png`
- SECOND: The SECOND image is the finished sheet of the parent form (Satelles): this unit is the next step of the SAME Egyptian line, so keep the same saturated gold and white, the same deep warm brown skin with short black hair, the same gold collar and the same blue eye emblem, but richer and with the new equipment described below.
- NAME: Custos Pharaonis; TIER: 4; BRANCH: Infantry; ROLE: infantry
- OUTFIT: He is the bodyguard of the pharaoh. He wears: a shiny GOLD and royal blue striped headdress with a tall gold cobra and a gold falcon on the brow, face open and clearly visible (deep warm brown skin (clearly darker than Roman or Greek skin), kohl-outlined dark eyes, a noble commanding look, a thin false chin beard in blue and gold); a huge shiny GOLD broad collar with blue and red inlay; a shiny GOLD scale cuirass over a white pleated tunic; a white pleated kilt with a rich gold apron with a blue cobra; thick gold arm and wrist bands; a white-and-gold sash; gold-strapped sandals; a short white cloak with a gold border. In his left hand a tall shield with a rounded top painted saturated gold-yellow with a large dark blue eye and a very wide gold rim. In his right hand a long spear with a gold shaft ring and silver head; a khopesh with a gold hilt at his belt.
- REST: standing relaxed, facing the viewer, the long spear held upright beside his body, the shield at his side
- ATTACK: one step forward, the long spear thrust forward, the shield raised in front of his chest
- HIT: upper body leaning backwards, eyes closed, the shield sagging, the long spear tilting
- PORT: Show the gold-and-blue headdress with the cobra and falcon, the false beard and the huge gold collar.
- FRONT: Tall gold-yellow shield with the blue eye on the left arm, long spear in the right hand.
- BACK: Show the headdress hanging down the back, the white cloak with the gold border, the back of the tall shield and the spear.

## aeg_sagittariusaegyp | Sagittarius Aegyptius | tier 2 | Ranged | ouder: Iuvenis Aegyptius

- Blad A, bijlagen: `aeg_anker.png` en `aeg_iuvenisaegyptius_A.png`
- SECOND: The SECOND image is the finished sheet of the parent form (Iuvenis Aegyptius): this unit is the next step of the SAME Egyptian line, so keep the same saturated gold and white, the same deep warm brown skin with short black hair, the same gold collar and the same blue eye emblem, but richer and with the new equipment described below.
- NAME: Sagittarius Aegyptius; TIER: 2; BRANCH: Ranged; ROLE: ranged, archer
- OUTFIT: He wears: a short black wig with a white linen headcloth tied with a gold band, face clearly visible (deep warm brown skin (clearly darker than Roman or Greek skin), kohl-outlined dark eyes, a focused look); a white linen collar; a short white linen kilt with a gold hem; a gold-yellow shoulder sash; leather wristguard on the left arm; brown leather sandals; NO armour and NO shield. In his left hand a curved composite bow in dark wood with gold tips; a brown leather quiver with gold-yellow-feathered arrows at his hip.
- REST: standing relaxed, facing the viewer, the composite bow held loosely, light on his feet
- ATTACK: firing or throwing pose: leaning back then forward, the composite bow aimed forward with the free arm stretched forward
- HIT: upper body leaning backwards, eyes closed, the composite bow dropping, hand raised
- PORT: Show the white headcloth with the gold band, the kohl-outlined eyes and the white collar.
- FRONT: Composite bow held in the left hand, an arrow ready in the right hand, the quiver at his hip.
- BACK: Show the headcloth, the gold-yellow sash, the quiver with arrows and the bow.

## aeg_sagittariusnubiu | Sagittarius Nubius | tier 3 | Ranged | ouder: Sagittarius Aegyptius

- Blad A, bijlagen: `aeg_anker.png` en `aeg_sagittariusaegyp_A.png`
- SECOND: The SECOND image is the finished sheet of the parent form (Sagittarius Aegyptius): this unit is the next step of the SAME Egyptian line, so keep the same saturated gold and white, the same deep warm brown skin with short black hair, the same gold collar and the same blue eye emblem, but richer and with the new equipment described below.
- NAME: Sagittarius Nubius; TIER: 3; BRANCH: Ranged; ROLE: ranged, archer
- OUTFIT: He is a Nubian archer in Egyptian service. He wears: short curly black hair with a gold-yellow headband and a tall white ostrich feather, face clearly visible (deep dark brown skin, large gold hoop earrings, clear dark eyes, a proud look); a spotted leopard-skin sash across the bare chest; a wide gold collar; a short white-and-gold-yellow kilt; gold arm rings; a leather wristguard; brown leather sandals; NO armour and NO shield. In his left hand a tall dark wooden longbow with gold tips; a large brown leather quiver with gold-yellow-feathered arrows on his back.
- REST: standing relaxed, facing the viewer, the tall longbow held loosely, light on his feet
- ATTACK: firing or throwing pose: leaning back then forward, the tall longbow aimed forward with the free arm stretched forward
- HIT: upper body leaning backwards, eyes closed, the tall longbow dropping, hand raised
- PORT: Show the white ostrich feather, the gold hoop earrings, the leopard-skin sash and the wide gold collar.
- FRONT: Tall longbow held in the left hand, an arrow ready in the right hand.
- BACK: Show the ostrich feather, the leopard-skin sash, the large quiver and the longbow.

## aeg_aurigaaegyptius | Auriga Aegyptius | tier 2 | Chariots | ouder: Iuvenis Aegyptius

- Blad A, bijlagen: `aeg_anker.png` en `aeg_iuvenisaegyptius_A.png`
- SECOND: The SECOND image is the finished sheet of the parent form (Iuvenis Aegyptius): this unit is the next step of the SAME Egyptian line, so keep the same saturated gold and white, the same deep warm brown skin with short black hair, the same gold collar and the same blue eye emblem, but richer and with the new equipment described below.
- NAME: Auriga Aegyptius; TIER: 2; BRANCH: Chariots; ROLE: cavalry, chariot driver
- OUTFIT: He is a chariot driver. The unit is the chariot and its driver together as ONE whole in the cell: a light two-wheeled wooden chariot with gold-yellow side panels with a blue eye emblem and a gold rail, drawn by TWO brown horses with tall gold-yellow and blue plumes on their heads and blue-and-gold harness. The driver stands in the chariot and wears: a short black wig with a gold headband, face clearly visible (deep warm brown skin (clearly darker than Roman or Greek skin), kohl-outlined dark eyes); a white linen collar; a short white kilt with a gold hem; a gold-yellow sash; leather wristbands; NO shield. In his hands the long reins and a short whip. The whole chariot with horses fits inside the 56-pixel limit and the margins.
- REST: standing in the chariot, the horses standing still, facing the viewer, the reins held in both hands
- ATTACK: the chariot surging one step forward, the horses rearing slightly, the driver cracking the whip forward
- HIT: the horses shying back, the driver leaning backwards with eyes closed, the reins loosening
- PORT: Show the black wig with the gold headband, the reins in his hands and the head of one horse with its tall plume.
- FRONT: The chariot with the two horses seen from the front, the driver holding the reins.
- BACK: Show the back of the chariot with the gold-yellow panel, the driver's sash and the hindquarters of the two horses.

## aeg_bellatorcurruaeg | Bellator curru Aegyptius | tier 3 | Chariots | ouder: Auriga Aegyptius

- Blad A, bijlagen: `aeg_anker.png` en `aeg_aurigaaegyptius_A.png`
- SECOND: The SECOND image is the finished sheet of the parent form (Auriga Aegyptius): this unit is the next step of the SAME Egyptian line, so keep the same saturated gold and white, the same deep warm brown skin with short black hair, the same gold collar and the same blue eye emblem, but richer and with the new equipment described below.
- NAME: Bellator curru Aegyptius; TIER: 3; BRANCH: Chariots; ROLE: cavalry, chariot archer
- OUTFIT: He is a warrior on a chariot. The unit is the chariot and its warrior together as ONE whole in the cell: a sturdy two-wheeled chariot with gold-covered side panels with a large dark blue eye, a quiver holder on the side and a gold-yellow banner on a pole, drawn by TWO white horses with tall gold and blue plumes and rich blue-and-gold harness. The warrior stands in the chariot and wears: a shiny GOLD and royal blue crown-helmet (khepresh-style) with a small gold cobra, face open and clearly visible (deep warm brown skin (clearly darker than Roman or Greek skin), kohl-outlined dark eyes, a fierce look); a shiny GOLD scale corselet over a white tunic with a wide gold collar; gold armbands; a white kilt. In his left hand a large curved composite bow with gold tips; in his right hand an arrow ready to fire. The whole chariot with horses fits inside the 56-pixel limit and the margins.
- REST: standing in the chariot, the horses standing still, facing the viewer, the bow held at his side
- ATTACK: the chariot surging one step forward, the horses rearing slightly, the warrior drawing the bow and aiming forward
- HIT: the horses shying back, the driver leaning backwards with eyes closed, the reins loosening
- PORT: Show the gold-and-blue crown-helmet with the cobra, the wide gold collar and the bow.
- FRONT: The chariot with the two white horses seen from the front, the warrior holding the bow with an arrow.
- BACK: Show the back of the chariot with the gold panel and banner, the quiver holder and the hindquarters of the two white horses.

## aeg_scriba | Scriba | tier 2 | Priests | ouder: Iuvenis Aegyptius

- Blad A, bijlagen: `aeg_anker.png` en `aeg_iuvenisaegyptius_A.png`
- SECOND: The SECOND image is the finished sheet of the parent form (Iuvenis Aegyptius): this unit is the next step of the SAME Egyptian line, so keep the same saturated gold and white, the same deep warm brown skin with short black hair, the same gold collar and the same blue eye emblem, but richer and with the new equipment described below.
- NAME: Scriba; TIER: 2; BRANCH: Priests; ROLE: support, scribe
- OUTFIT: He is a scribe. He wears: a short black wig with a thin gold headband, face clearly visible (deep warm brown skin (clearly darker than Roman or Greek skin), kohl-outlined dark eyes, a clever look); a broad white linen collar; a long white linen kilt down to the knees with a gold hem; a gold-yellow sash over one shoulder; a brown leather belt with a small ink pouch; brown leather sandals; NO armour, NO weapons and NO shield. In his right hand a long papyrus scroll with a gold-yellow ribbon; in his left hand a wooden scribe's palette with two small ink cakes and a reed pen tucked behind his ear.
- REST: standing calmly, facing the viewer, the papyrus scroll and the scribe's palette
- ATTACK: stepping forward, raising the papyrus scroll and the scribe's palette so that it flashes, the other hand held out
- HIT: upper body leaning backwards, eyes closed, the held items tilting, hand raised
- PORT: Show the black wig with the gold headband, the white collar and the reed pen behind the ear.
- FRONT: Papyrus scroll in the right hand, the scribe's palette in the left hand.
- BACK: Show the black wig, the gold-yellow sash, the ink pouch on the belt and the scroll.

## aeg_sacerdosisidis | Sacerdos Isidis | tier 3 | Priests | ouder: Scriba

- Blad A, bijlagen: `aeg_anker.png` en `aeg_scriba_A.png`
- SECOND: The SECOND image is the finished sheet of the parent form (Scriba): this unit is the next step of the SAME Egyptian line, so keep the same saturated gold and white, the same deep warm brown skin with short black hair, the same gold collar and the same blue eye emblem, but richer and with the new equipment described below.
- NAME: Sacerdos Isidis; TIER: 3; BRANCH: Priests; ROLE: support, healer, priestess
- OUTFIT: She is a priestess and healer. She wears: a shiny GOLD headband with a dark blue lotus flower on the brow over a long black wig with gold beads, face clearly visible (deep warm brown skin (clearly darker than Roman or Greek skin), kohl-outlined dark eyes, a gentle look); a long white pleated linen gown with a wide gold-yellow border and a gold belt; a wide GOLD and blue broad collar; gold armbands; a short transparent white shoulder cape; gold sandals; NO armour and NO shield. In her right hand a gold sistrum (a rattle with a curved frame and small gold discs); in her left hand a small blue ointment jar and a long stem with a blue lotus flower.
- REST: standing calmly, facing the viewer, the gold sistrum and the lotus stem
- ATTACK: stepping forward, raising the gold sistrum and the lotus stem so that it flashes, the other hand held out
- HIT: upper body leaning backwards, eyes closed, the held items tilting, hand raised
- PORT: Show the gold headband with the blue lotus, the long black wig with the gold beads and the broad collar.
- FRONT: Gold sistrum in the right hand, the blue lotus stem and the ointment jar in the left hand.
- BACK: Show the long black wig with the gold beads, the white pleated gown, the gold belt and the sistrum.

