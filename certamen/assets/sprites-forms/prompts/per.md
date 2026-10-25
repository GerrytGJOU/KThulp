# Beeldprompts Perzen (volkscode per)

Geschreven op 2026-10-23 (nog niet gegenereerd). Anker: `per_anker.png` — maak dat eerst met PROMPT 0 hieronder (UPLOAD `gra_anker.png` en `rom_anker.png` alleen als stijlreferentie). Blad A: anker + A van de ouder (Iuvenis Persa A: anker + `rom_tiro_A.png`). Blad B: A van de vorm + `per_iuvenispersa_B.png` (Iuvenis Persa B: A + `rom_tiro_B.png`). Vul de `{{...}}` in per vorm; `{{FMT}}` = Iuvenis Persa; `{{SECOND}}` staat per vorm.

## PROMPT 0 (anker)

- GEBRUIK: ChatGPT | UPLOAD: `rom_anker.png`, `gra_anker.png` (alleen stijlreferentie) | OPSLAAN ALS: `per_anker.png`
```
Create ONE image: canvas exactly 1024 x 1024 pixels, 16-bit JRPG pixel-art in the style of RPG Maker MV and classic Fire Emblem sprites (match the attached reference images exactly in pixel size, outline, palette saturation and level of detail; do NOT copy their clothing). One standing Persian recruit (Iuvenis Persa), three-quarter top-down view from about 30 degrees above, facing the viewer, on one flat solid magenta #FF00FF background without gradient, floor or ground shadow. He wears: a soft pointed felt cap in saturated purple with a yellow band, face clearly visible (warm medium brown skin (a little darker than Roman or Greek skin), short black hair, a thin black moustache, clear dark eyes, a determined look); a long-sleeved cream tunic with a purple-and-yellow patterned hem; long loose purple trousers tucked into brown leather boots; a purple sash at the waist; a short purple cloak; NO armour. In his left hand a small RECTANGULAR wicker shield with a cut-out waist painted saturated purple with a yellow lion emblem; in his right hand a plain wooden spear with a short silver-grey leaf-shaped head. Chunky visible pixels, at most 24 colours, one dark-brown 1-pixel outline, flat cel-shading with at most two tones per colour, chibi proportions (head about one third of body height). The figure is at most 56 of 64 pixel blocks tall with at least 4 blocks of magenta margin. NO TEXT of any kind. AVOID: text, labels, logos, watermark, frame, border, second figure, realistic or painterly shading, blurry or anti-aliased edges, gradients, ground shadow, floor, magenta inside the figure.
```

## Sjabloon blad A
```
Use the attached images as the exact reference. The FIRST image is the Persian anchor (style, palette, outline, proportions and level of detail). {{SECOND}}

Create ONE sprite sheet: canvas exactly 1536 x 1024 pixels, 16-bit JRPG pixel-art in the style of RPG Maker MV and classic Fire Emblem sprites. Layout: 3 columns by 2 rows of INVISIBLE cells, each cell exactly 512 x 512 pixels, the SAME character in all six cells. Background: one flat solid magenta #FF00FF, no gradient, no floor, no shadow on the ground. No magenta anywhere in the figure. IMPORTANT: the image contains NO TEXT of any kind: no labels, no captions, no pose names, no titles, no numbers and no letters anywhere, neither inside nor outside the cells.

CHARACTER: "{{NAME}}", Persian unit (tier {{TIER}}, branch {{BRANCH}}, role {{ROLE}}). {{OUTFIT}}

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

Style reference: match the attached reference sheet exactly in palette and shading. Use bright, saturated colours with strong contrast: metal and jewellery shiny GOLD (not brown), shields saturated purple with a yellow lion emblem, scale armour and blades light SILVER-GREY. Skin and face must stay clearly readable when the sprite is shrunk to 48 pixels (clear dark eyes, warm medium brown skin tone, mouth visible). Canvas exactly as stated. Do NOT draw any grid lines, borders or separators between the cells; the cells are only an invisible layout.

AVOID: NO TEXT OF ANY KIND (no labels, captions, pose names, titles, numbers or letters above, below or next to the figures); no logos or watermark; no frame, border, grid lines or separator lines drawn between the cells; no second figure; no change of clothing or colours between poses; no difference in scale between cells; no realistic or painterly shading; no blurry or anti-aliased edges; no gradients; no shadow on the ground; no floor; no magenta inside the figure.
```

## Sjabloon blad B
```
Use the attached images as reference. The FIRST image (the six-cell sprite sheet of {{NAME}}) shows THE SAME character to be redrawn: use it ONLY for the character's appearance and do NOT copy its six-cell layout. The SECOND image (the finished 3-cell sheet of the recruit {{FMT}}: portrait, battle front, battle back) shows the exact FORMAT, style, palette, outline, proportions and level of detail to follow (do NOT copy its clothing). Your output must have the same layout as the second image: ONE row of exactly three cells, never two rows and never six cells.

Create ONE sheet: canvas exactly 1536 x 512 pixels, 16-bit JRPG pixel-art in the style of RPG Maker MV and classic Fire Emblem sprites. Layout: ONE single row of exactly 3 INVISIBLE cells side by side (NOT six cells, NOT two rows), each exactly 512 x 512 pixels, the SAME character in all three. Background: one flat solid magenta #FF00FF, no gradient, no floor, no shadow on the ground. No magenta anywhere in the figure. IMPORTANT: the image contains NO TEXT of any kind: no labels, no captions, no pose names, no titles, no numbers and no letters anywhere, neither inside nor outside the cells.

CHARACTER: "{{NAME}}", Persian unit (tier {{TIER}}, branch {{BRANCH}}, role {{ROLE}}). {{OUTFIT}}

STYLE: chunky visible pixels, at most 24 colours, one dark-brown 1-pixel outline around the whole figure, flat cel-shading with at most two tones per colour, warm saturated fantasy colours, small chibi proportions (head about one third of body height), easy to read at small size.

PIXEL GRID: every cell is its own 64 x 64 pixel grid; every pixel is a block of 8 x 8 image pixels and all pixels in the whole image are exactly the same size. In cells 2 and 3 the figure is at most 56 of the 64 pixels tall with at least 4 blocks of empty magenta margin all around, feet on the same horizontal line in both cells, same size in both cells.

CELLS:
Cell 1, a bust portrait: bust, three-quarter view, looking slightly to the right of the image, a stern but friendly look, more detail in the face than in the sprites; the figure fills about 60 percent of the cell. {{PORT}}
Cell 2, full body seen from the front: full body, ready for battle, straight from the front at eye level, face towards the viewer. {{FRONT}}
Cell 3, full body seen from behind: the same body exactly from behind, with a slight angle from above. {{BACK}}

CONSISTENCY: the equipment stays the same in ALL cells and every part of the figure, including weapons, tools and banners, stays completely inside its own cell, at least 4 pixel blocks from the cell edges, never touching a neighbouring cell. Shield shape and emblem never change between cells.

Style reference: match the attached reference sheet exactly in palette and shading. Use bright, saturated colours with strong contrast: metal and jewellery shiny GOLD (not brown), shields saturated purple with a yellow lion emblem, scale armour and blades light SILVER-GREY. Skin and face must stay clearly readable when the sprite is shrunk to 48 pixels (clear dark eyes, warm medium brown skin tone, mouth visible). Canvas exactly as stated. Do NOT draw any grid lines, borders or separators between the cells; the cells are only an invisible layout.

AVOID: NO TEXT OF ANY KIND (no labels, captions, pose names, titles, numbers or letters above, below or next to the figures); no logos or watermark; no frame, border, grid lines or separator lines drawn between the cells; no second figure; no change of clothing or colours between cells; no difference in scale between cells 2 and 3; no realistic or painterly shading; no blurry or anti-aliased edges; no gradients; no shadow on the ground; no floor; no magenta inside the figure.
```

## per_iuvenispersa | Iuvenis Persa | tier 1 | Recruit | ouder: -

- Blad A, bijlagen: `per_anker.png` en `rom_tiro_A.png`
- SECOND: The SECOND image is the finished Roman recruit sheet (Tiro): use it ONLY for the sheet format, the pixel size and the pose layout; do NOT copy its clothing, shield or face.
- NAME: Iuvenis Persa; TIER: 1; BRANCH: Recruit; ROLE: recruit
- OUTFIT: He is a young Persian recruit, the simplest unit. He wears: a soft pointed felt cap (kyrbasia) in saturated purple with a yellow band, face clearly visible (warm medium brown skin (a little darker than Roman or Greek skin), short black hair, a thin black moustache, clear dark eyes, a determined look); a long-sleeved cream tunic with a purple-and-yellow patterned hem; long loose purple trousers tucked into brown leather boots; a purple sash at the waist; a short purple cloak hanging from his shoulders; NO armour. In his left hand a small RECTANGULAR wicker shield with a cut-out waist painted saturated purple with a yellow lion emblem. In his right hand a plain wooden spear with a short silver-grey leaf-shaped head.
- REST: standing relaxed, facing the viewer, the spear held upright beside his body, the shield at his side
- ATTACK: one step forward, the spear thrust forward, the shield raised in front of his chest
- HIT: upper body leaning backwards, eyes closed, the shield sagging, the spear tilting
- PORT: Show the purple felt cap with the yellow band, the thin moustache and the patterned tunic hem.
- FRONT: Spear held ready in the right hand, small purple wicker shield with the yellow lion raised on the left arm.
- BACK: Show the purple cap, the purple cloak, the patterned trousers and the back of the wicker shield.

## per_sparabara | Sparabara | tier 2 | Infantry | ouder: Iuvenis Persa

- Blad A, bijlagen: `per_anker.png` en `per_iuvenispersa_A.png`
- SECOND: The SECOND image is the finished sheet of the parent form (Iuvenis Persa): this unit is the next step of the SAME Persian line, so keep the same saturated purple, the same warm medium brown skin (a little darker than Roman or Greek skin) with short black hair and a short black beard, the same colourful patterned clothing and the same yellow lion emblem, but richer and with the new equipment described below.
- NAME: Sparabara; TIER: 2; BRANCH: Infantry; ROLE: infantry (shield-wall spearman)
- OUTFIT: He is a shield-wall spearman. He wears: a soft felt cap in saturated purple with a gold band, face clearly visible (warm medium brown skin (a little darker than Roman or Greek skin), short black hair, a short black beard, clear dark eyes, a steady look); a colourful quilted tunic with purple and yellow stripes and long sleeves; purple trousers; a wide purple sash with a gold buckle; brown leather boots; a short purple cloak. In his left hand a tall RECTANGULAR wicker shield (spara) with a cut-out waist painted saturated purple with a large yellow lion and a gold rim, planted in front of him. In his right hand a long spear with a silver leaf-shaped head; a short dagger at his belt.
- REST: standing relaxed, facing the viewer, the long spear held upright beside his body, the shield at his side
- ATTACK: one step forward, the long spear thrust forward, the shield raised in front of his chest
- HIT: upper body leaning backwards, eyes closed, the shield sagging, the long spear tilting
- PORT: Show the purple felt cap with the gold band, the short beard and the striped quilted tunic.
- FRONT: Tall purple wicker shield with the yellow lion held in front of the body, long spear in the right hand.
- BACK: Show the back of the tall wicker shield, the purple cloak, the striped tunic and the spear.

## per_immortalis | Immortalis | tier 3 | Infantry | ouder: Sparabara

- Blad A, bijlagen: `per_anker.png` en `per_sparabara_A.png`
- SECOND: The SECOND image is the finished sheet of the parent form (Sparabara): this unit is the next step of the SAME Persian line, so keep the same saturated purple, the same warm medium brown skin (a little darker than Roman or Greek skin) with short black hair and a short black beard, the same colourful patterned clothing and the same yellow lion emblem, but richer and with the new equipment described below.
- NAME: Immortalis; TIER: 3; BRANCH: Infantry; ROLE: infantry (elite)
- OUTFIT: He is one of the Immortals, the elite guard. He wears: a tall shiny GOLD-banded felt tiara in saturated purple, face clearly visible (warm medium brown skin (a little darker than Roman or Greek skin), short black hair, a neat curled black beard, large gold earrings, clear dark eyes, a proud look); a long-sleeved robe richly patterned in purple, white and yellow with a hem of gold embroidery over hidden scale armour; a shiny GOLD necklace and gold arm bracelets; purple trousers; a wide purple sash with a gold buckle; brown leather boots. In his left hand a RECTANGULAR wicker shield with a cut-out waist painted saturated purple with a yellow lion and a gold rim. In his right hand a long spear with a silver head; a short bow in a case on his back.
- REST: standing relaxed, facing the viewer, the long spear held upright beside his body, the shield at his side
- ATTACK: one step forward, the long spear thrust forward, the shield raised in front of his chest
- HIT: upper body leaning backwards, eyes closed, the shield sagging, the long spear tilting
- PORT: Show the gold-banded purple tiara, the curled beard, the gold earrings and the gold necklace.
- FRONT: Purple wicker shield with the yellow lion on the left arm, long spear in the right hand.
- BACK: Show the bow case on the back, the patterned robe, the back of the wicker shield and the spear.

## per_melophorus | Melophorus | tier 4 | Infantry | ouder: Immortalis

- Blad A, bijlagen: `per_anker.png` en `per_immortalis_A.png`
- SECOND: The SECOND image is the finished sheet of the parent form (Immortalis): this unit is the next step of the SAME Persian line, so keep the same saturated purple, the same warm medium brown skin (a little darker than Roman or Greek skin) with short black hair and a short black beard, the same colourful patterned clothing and the same yellow lion emblem, but richer and with the new equipment described below.
- NAME: Melophorus; TIER: 4; BRANCH: Infantry; ROLE: infantry (elite apple-bearer)
- OUTFIT: He is an apple-bearer, the king's most splendid guard. He wears: a very tall shiny GOLD tiara with purple felt and small gold lion heads, face clearly visible (warm medium brown skin (a little darker than Roman or Greek skin), short black hair, a long curled black beard, large gold earrings, clear dark eyes, a noble look); a long-sleeved robe richly patterned in purple and gold with wide gold embroidery over shiny GOLD scale armour; a thick GOLD collar and gold arm rings; a long purple cloak with a round gold clasp; purple trousers; gold-trimmed brown boots. In his left hand a RECTANGULAR wicker shield with a cut-out waist painted saturated purple with a big yellow lion and a wide gold rim. In his right hand a tall spear with a silver head whose lower end carries a large golden apple as a counterweight.
- REST: standing relaxed, facing the viewer, the spear with the golden apple held upright beside his body, the shield at his side
- ATTACK: one step forward, the spear with the golden apple thrust forward, the shield raised in front of his chest
- HIT: upper body leaning backwards, eyes closed, the shield sagging, the spear with the golden apple tilting
- PORT: Show the very tall gold tiara with the lion heads, the curled beard, the gold collar and the gold clasp.
- FRONT: Purple wicker shield with the big yellow lion on the left arm, spear with the golden apple in the right hand.
- BACK: Show the long purple cloak with the gold clasp, the back of the wicker shield and the golden apple at the spear end.

## per_sagittariuspersa | Sagittarius Persa | tier 2 | Ranged | ouder: Iuvenis Persa

- Blad A, bijlagen: `per_anker.png` en `per_iuvenispersa_A.png`
- SECOND: The SECOND image is the finished sheet of the parent form (Iuvenis Persa): this unit is the next step of the SAME Persian line, so keep the same saturated purple, the same warm medium brown skin (a little darker than Roman or Greek skin) with short black hair and a short black beard, the same colourful patterned clothing and the same yellow lion emblem, but richer and with the new equipment described below.
- NAME: Sagittarius Persa; TIER: 2; BRANCH: Ranged; ROLE: ranged, archer
- OUTFIT: He wears: a soft pointed felt cap in saturated purple with a yellow band, face clearly visible (warm medium brown skin (a little darker than Roman or Greek skin), short black hair, a thin black moustache, clear dark eyes, a focused look); a long-sleeved cream tunic with a purple-and-yellow patterned hem; purple trousers tucked into brown leather boots; a purple sash; NO armour and NO shield. In his left hand a short curved composite bow in dark wood with yellow tips; a brown leather bow-and-arrow case (gorytos) with purple-feathered arrows at his hip.
- REST: standing relaxed, facing the viewer, the composite bow held loosely, light on his feet
- ATTACK: firing or throwing pose: leaning back then forward, the composite bow aimed forward with the free arm stretched forward
- HIT: upper body leaning backwards, eyes closed, the composite bow dropping, hand raised
- PORT: Show the purple felt cap with the yellow band, the thin moustache and the patterned tunic hem.
- FRONT: Composite bow held in the left hand, an arrow ready in the right hand, the arrow case at his hip.
- BACK: Show the purple cap, the purple sash, the arrow case with the purple-feathered arrows and the bow.

## per_sagittariusscyth | Sagittarius Scytha | tier 3 | Ranged | ouder: Sagittarius Persa

- Blad A, bijlagen: `per_anker.png` en `per_sagittariuspersa_A.png`
- SECOND: The SECOND image is the finished sheet of the parent form (Sagittarius Persa): this unit is the next step of the SAME Persian line, so keep the same saturated purple, the same warm medium brown skin (a little darker than Roman or Greek skin) with short black hair and a short black beard, the same colourful patterned clothing and the same yellow lion emblem, but richer and with the new equipment described below.
- NAME: Sagittarius Scytha; TIER: 3; BRANCH: Ranged; ROLE: ranged, archer
- OUTFIT: He is a Scythian archer in Persian service. He wears: a tall pointed leather hood with long side flaps and a purple band, face clearly visible (warm medium brown skin (a little darker than Roman or Greek skin), a black moustache and short beard, clear dark eyes, a sharp look); a long-sleeved leather jacket with purple trim and yellow studs over a cream tunic; tight purple trousers tucked into brown leather boots; a wide brown belt with a gold buckle; a purple sash; NO shield. In his left hand a large recurve composite bow in dark wood with gold tips; a large patterned leather arrow case (gorytos) with purple-feathered arrows on his hip; a short axe at his belt.
- REST: standing relaxed, facing the viewer, the large recurve bow held loosely, light on his feet
- ATTACK: firing or throwing pose: leaning back then forward, the large recurve bow aimed forward with the free arm stretched forward
- HIT: upper body leaning backwards, eyes closed, the large recurve bow dropping, hand raised
- PORT: Show the tall pointed hood with the side flaps, the short beard and the studded leather jacket.
- FRONT: Large recurve bow held in the left hand, an arrow ready in the right hand, the arrow case at his hip.
- BACK: Show the pointed hood with the long flaps, the purple sash, the arrow case and the bow.

## per_equespersa | Eques Persa | tier 2 | Cavalry | ouder: Iuvenis Persa

- Blad A, bijlagen: `per_anker.png` en `per_iuvenispersa_A.png`
- SECOND: The SECOND image is the finished sheet of the parent form (Iuvenis Persa): this unit is the next step of the SAME Persian line, so keep the same saturated purple, the same warm medium brown skin (a little darker than Roman or Greek skin) with short black hair and a short black beard, the same colourful patterned clothing and the same yellow lion emblem, but richer and with the new equipment described below.
- NAME: Eques Persa; TIER: 2; BRANCH: Cavalry; ROLE: cavalry, rider
- OUTFIT: The unit is the horse and its rider together as ONE whole in the cell: a brown horse with a purple saddle-cloth with a yellow lion and simple brown leather harness with a purple tassel. The rider wears: a soft pointed felt cap in saturated purple with a yellow band, face clearly visible (warm medium brown skin (a little darker than Roman or Greek skin), short black hair, a thin black moustache, clear dark eyes); a long-sleeved patterned tunic; purple trousers tucked into brown boots; a short purple cloak; NO armour. In his left hand a small round wicker shield in purple with a yellow lion; in his right hand a light javelin with a silver head. The whole horse and rider fit inside the 56-pixel limit and the margins.
- REST: sitting on the standing horse, facing the viewer, the javelin held upright, the shield on his arm
- ATTACK: the horse taking one step forward, the javelin thrown forward over the horse's head, the shield raised
- HIT: the horse shying back, the rider leaning backwards with eyes closed, the shield or lance sagging
- PORT: Show the purple felt cap, the thin moustache and the patterned tunic.
- FRONT: The horse with its rider seen from the front, the rider holding the javelin and the shield.
- BACK: Show the back of the horse with the purple saddle-cloth, the rider's purple cloak and the javelin.

## per_cataphractus | Cataphractus | tier 3 | Cavalry | ouder: Eques Persa

- Blad A, bijlagen: `per_anker.png` en `per_equespersa_A.png`
- SECOND: The SECOND image is the finished sheet of the parent form (Eques Persa): this unit is the next step of the SAME Persian line, so keep the same saturated purple, the same warm medium brown skin (a little darker than Roman or Greek skin) with short black hair and a short black beard, the same colourful patterned clothing and the same yellow lion emblem, but richer and with the new equipment described below.
- NAME: Cataphractus; TIER: 3; BRANCH: Cavalry; ROLE: cavalry, armoured rider
- OUTFIT: The unit is the horse and its armoured rider together as ONE whole in the cell: a strong brown horse with a light SILVER-GREY scale blanket over its chest and flanks edged in purple and a purple plume on its head. The rider wears: a shiny GOLD pointed helmet with a purple plume and a mail neck guard, face open and clearly visible (warm medium brown skin (a little darker than Roman or Greek skin), a short black beard, clear dark eyes, a stern look); a SILVER-GREY scale cuirass with long scale sleeves over a purple robe; gold arm bands; purple trousers; a purple sash; brown boots. In his right hand a long lance with a silver head and a purple pennant; a short sword at his belt; NO shield. The whole horse and rider fit inside the 56-pixel limit and the margins.
- REST: sitting on the standing horse, facing the viewer, the lance held upright
- ATTACK: the horse taking one step forward, the lance levelled forward over the horse's head
- HIT: the horse shying back, the rider leaning backwards with eyes closed, the shield or lance sagging
- PORT: Show the gold helmet with the purple plume, the mail neck guard, the short beard and the scale armour.
- FRONT: The armoured horse with its rider seen from the front, the rider holding the lance with the pennant.
- BACK: Show the back of the horse with the scale blanket, the rider's purple sash and the lance with the pennant.

## per_clibanarius | Clibanarius | tier 4 | Cavalry | ouder: Cataphractus

- Blad A, bijlagen: `per_anker.png` en `per_cataphractus_A.png`
- SECOND: The SECOND image is the finished sheet of the parent form (Cataphractus): this unit is the next step of the SAME Persian line, so keep the same saturated purple, the same warm medium brown skin (a little darker than Roman or Greek skin) with short black hair and a short black beard, the same colourful patterned clothing and the same yellow lion emblem, but richer and with the new equipment described below.
- NAME: Clibanarius; TIER: 4; BRANCH: Cavalry; ROLE: cavalry, heavy armoured rider
- OUTFIT: He is a fully armoured heavy rider. The unit is the horse and its rider together as ONE whole in the cell: a large strong horse covered from head to hoof in light SILVER-GREY scale armour with gold fittings, a gold face plate with a purple plume and a long purple saddle-cloth with a yellow lion. The rider is covered in light SILVER-GREY scale armour from neck to boots with gold edges and wears: a shiny GOLD helmet with a tall purple plume and the visor raised so that the face is clearly visible (warm medium brown skin (a little darker than Roman or Greek skin), a short black beard, clear dark eyes, a commanding look); a purple cloak with a gold clasp streaming behind. In his hands a very long heavy lance with a silver head and a purple pennant; a long sword with a gold hilt at his belt; NO shield. The whole horse and rider fit inside the 56-pixel limit and the margins.
- REST: sitting on the standing armoured horse, facing the viewer, the heavy lance held upright
- ATTACK: the horse taking one step forward, the heavy lance levelled forward over the horse's head
- HIT: the horse shying back, the rider leaning backwards with eyes closed, the shield or lance sagging
- PORT: Show the gold helmet with the tall purple plume and the raised visor, the short beard and the gold clasp.
- FRONT: The fully armoured horse with its rider seen from the front, the rider holding the very long lance.
- BACK: Show the back of the armoured horse, the purple saddle-cloth, the streaming purple cloak and the lance.

## per_magus | Magus | tier 2 | Scholars | ouder: Iuvenis Persa

- Blad A, bijlagen: `per_anker.png` en `per_iuvenispersa_A.png`
- SECOND: The SECOND image is the finished sheet of the parent form (Iuvenis Persa): this unit is the next step of the SAME Persian line, so keep the same saturated purple, the same warm medium brown skin (a little darker than Roman or Greek skin) with short black hair and a short black beard, the same colourful patterned clothing and the same yellow lion emblem, but richer and with the new equipment described below.
- NAME: Magus; TIER: 2; BRANCH: Scholars; ROLE: support, scholar-priest
- OUTFIT: He is a scholar-priest and star-watcher. He wears: a tall soft white felt hat with a purple band and side flaps, face clearly visible (warm medium brown skin (a little darker than Roman or Greek skin), a short curled black beard, clear dark eyes, a thoughtful look); a long white robe with a purple border and small yellow star patterns; a purple sash; a short purple mantle; brown leather shoes; NO armour, NO weapons and NO shield. In his right hand a slim wooden staff with a small gold star on top; in his left hand a small brass astrolabe (a round disc with markings) on a chain.
- REST: standing calmly, facing the viewer, the star staff and the astrolabe
- ATTACK: stepping forward, raising the star staff and the astrolabe so that it flashes, the other hand held out
- HIT: upper body leaning backwards, eyes closed, the held items tilting, hand raised
- PORT: Show the tall white felt hat with the purple band, the curled beard and the white robe with the yellow stars.
- FRONT: Star staff in the right hand, the brass astrolabe in the left hand.
- BACK: Show the tall hat, the purple mantle, the white robe with the star patterns and the staff.

## per_archimagus | Archimagus | tier 3 | Scholars | ouder: Magus

- Blad A, bijlagen: `per_anker.png` en `per_magus_A.png`
- SECOND: The SECOND image is the finished sheet of the parent form (Magus): this unit is the next step of the SAME Persian line, so keep the same saturated purple, the same warm medium brown skin (a little darker than Roman or Greek skin) with short black hair and a short black beard, the same colourful patterned clothing and the same yellow lion emblem, but richer and with the new equipment described below.
- NAME: Archimagus; TIER: 3; BRANCH: Scholars; ROLE: support, healer, high scholar-priest
- OUTFIT: He is the chief scholar-priest. He wears: a tall white felt hat with a gold band, a purple jewel and long purple side flaps, face clearly visible (warm medium brown skin (a little darker than Roman or Greek skin), a long curled grey-black beard, clear dark eyes, a wise look); a long white robe richly embroidered in gold with stars and small suns, with a wide purple border and wide sleeves; a long rich purple mantle with a round gold clasp; a thick gold collar; gold rings; gold-trimmed shoes; NO armour and NO shield. In his right hand a tall golden staff topped with a gold sphere ringed with small stars; in his left hand a small crystal sphere on a gold stand with a faint purple glow.
- REST: standing calmly, facing the viewer, the golden star staff and the crystal sphere
- ATTACK: stepping forward, raising the golden star staff and the crystal sphere so that it flashes, the other hand held out
- HIT: upper body leaning backwards, eyes closed, the held items tilting, hand raised
- PORT: Show the tall white hat with the gold band and purple jewel, the long curled beard and the thick gold collar.
- FRONT: Golden staff with the star sphere in the right hand, the crystal sphere in the left hand.
- BACK: Show the long purple mantle with the gold clasp, the gold-embroidered white robe and the golden staff.

