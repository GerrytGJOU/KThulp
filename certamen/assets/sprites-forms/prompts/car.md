# Beeldprompts Carthagers (volkscode car)

Geschreven op 2026-10-23 (nog niet gegenereerd). Anker: `car_anker.png` — maak dat eerst met PROMPT 0 hieronder (UPLOAD `gra_anker.png` en `rom_anker.png` alleen als stijlreferentie). Blad A: anker + A van de ouder (Iuvenis Poenus A: anker + `rom_tiro_A.png`). Blad B: A van de vorm + `car_iuvenispoenus_B.png` (Iuvenis Poenus B: A + `rom_tiro_B.png`). Vul de `{{...}}` in per vorm; `{{FMT}}` = Iuvenis Poenus; `{{SECOND}}` staat per vorm.

## PROMPT 0 (anker)

- GEBRUIK: ChatGPT | UPLOAD: `rom_anker.png`, `gra_anker.png` (alleen stijlreferentie) | OPSLAAN ALS: `car_anker.png`
```
Create ONE image: canvas exactly 1024 x 1024 pixels, 16-bit JRPG pixel-art in the style of RPG Maker MV and classic Fire Emblem sprites (match the attached reference images exactly in pixel size, outline, palette saturation and level of detail; do NOT copy their clothing). One standing Carthaginian recruit (Iuvenis Poenus), three-quarter top-down view from about 30 degrees above, facing the viewer, on one flat solid magenta #FF00FF background without gradient, floor or ground shadow. He wears: bare head with short curly black hair, a thin orange headband and a small gold hoop earring, face clearly visible (bronze skin, clear dark eyes, a determined look); a short plain white linen tunic with an orange hem; a short bright orange cloak pinned at one shoulder; a brown leather belt; brown leather sandals with straps; NO armour and NO helmet. In his left hand a small ROUND wooden shield painted saturated orange with a yellow palm tree emblem and a small gold boss; in his right hand a plain wooden spear with a short silver-grey leaf-shaped head. Chunky visible pixels, at most 24 colours, one dark-brown 1-pixel outline, flat cel-shading with at most two tones per colour, chibi proportions (head about one third of body height). The figure is at most 56 of 64 pixel blocks tall with at least 4 blocks of magenta margin. NO TEXT of any kind. AVOID: text, labels, logos, watermark, frame, border, second figure, realistic or painterly shading, blurry or anti-aliased edges, gradients, ground shadow, floor, magenta inside the figure.
```

## Sjabloon blad A
```
Use the attached images as the exact reference. The FIRST image is the Carthaginian anchor (style, palette, outline, proportions and level of detail). {{SECOND}}

Create ONE sprite sheet: canvas exactly 1536 x 1024 pixels, 16-bit JRPG pixel-art in the style of RPG Maker MV and classic Fire Emblem sprites. Layout: 3 columns by 2 rows of INVISIBLE cells, each cell exactly 512 x 512 pixels, the SAME character in all six cells. Background: one flat solid magenta #FF00FF, no gradient, no floor, no shadow on the ground. No magenta anywhere in the figure. IMPORTANT: the image contains NO TEXT of any kind: no labels, no captions, no pose names, no titles, no numbers and no letters anywhere, neither inside nor outside the cells.

CHARACTER: "{{NAME}}", Carthaginian unit (tier {{TIER}}, branch {{BRANCH}}, role {{ROLE}}). {{OUTFIT}}

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

Style reference: match the attached reference sheet exactly in palette and shading. Use bright, saturated colours with strong contrast: metal helmets and jewellery shiny GOLD (not brown), shields saturated orange with a yellow palm-tree emblem, mail and blades light SILVER-GREY. Skin and face must stay clearly readable when the sprite is shrunk to 48 pixels (clear dark eyes, bronze skin tone, mouth visible). Canvas exactly as stated. Do NOT draw any grid lines, borders or separators between the cells; the cells are only an invisible layout.

AVOID: NO TEXT OF ANY KIND (no labels, captions, pose names, titles, numbers or letters above, below or next to the figures); no logos or watermark; no frame, border, grid lines or separator lines drawn between the cells; no second figure; no change of clothing or colours between poses; no difference in scale between cells; no realistic or painterly shading; no blurry or anti-aliased edges; no gradients; no shadow on the ground; no floor; no magenta inside the figure.
```

## Sjabloon blad B
```
Use the attached images as reference. The FIRST image (the six-cell sprite sheet of {{NAME}}) shows THE SAME character to be redrawn: use it ONLY for the character's appearance and do NOT copy its six-cell layout. The SECOND image (the finished 3-cell sheet of the recruit {{FMT}}: portrait, battle front, battle back) shows the exact FORMAT, style, palette, outline, proportions and level of detail to follow (do NOT copy its clothing). Your output must have the same layout as the second image: ONE row of exactly three cells, never two rows and never six cells.

Create ONE sheet: canvas exactly 1536 x 512 pixels, 16-bit JRPG pixel-art in the style of RPG Maker MV and classic Fire Emblem sprites. Layout: ONE single row of exactly 3 INVISIBLE cells side by side (NOT six cells, NOT two rows), each exactly 512 x 512 pixels, the SAME character in all three. Background: one flat solid magenta #FF00FF, no gradient, no floor, no shadow on the ground. No magenta anywhere in the figure. IMPORTANT: the image contains NO TEXT of any kind: no labels, no captions, no pose names, no titles, no numbers and no letters anywhere, neither inside nor outside the cells.

CHARACTER: "{{NAME}}", Carthaginian unit (tier {{TIER}}, branch {{BRANCH}}, role {{ROLE}}). {{OUTFIT}}

STYLE: chunky visible pixels, at most 24 colours, one dark-brown 1-pixel outline around the whole figure, flat cel-shading with at most two tones per colour, warm saturated fantasy colours, small chibi proportions (head about one third of body height), easy to read at small size.

PIXEL GRID: every cell is its own 64 x 64 pixel grid; every pixel is a block of 8 x 8 image pixels and all pixels in the whole image are exactly the same size. In cells 2 and 3 the figure is at most 56 of the 64 pixels tall with at least 4 blocks of empty magenta margin all around, feet on the same horizontal line in both cells, same size in both cells.

CELLS:
Cell 1, a bust portrait: bust, three-quarter view, looking slightly to the right of the image, a stern but friendly look, more detail in the face than in the sprites; the figure fills about 60 percent of the cell. {{PORT}}
Cell 2, full body seen from the front: full body, ready for battle, straight from the front at eye level, face towards the viewer. {{FRONT}}
Cell 3, full body seen from behind: the same body exactly from behind, with a slight angle from above. {{BACK}}

CONSISTENCY: the equipment stays the same in ALL cells and every part of the figure, including weapons, tools and banners, stays completely inside its own cell, at least 4 pixel blocks from the cell edges, never touching a neighbouring cell. Shield shape and emblem never change between cells.

Style reference: match the attached reference sheet exactly in palette and shading. Use bright, saturated colours with strong contrast: metal helmets and jewellery shiny GOLD (not brown), shields saturated orange with a yellow palm-tree emblem, mail and blades light SILVER-GREY. Skin and face must stay clearly readable when the sprite is shrunk to 48 pixels (clear dark eyes, bronze skin tone, mouth visible). Canvas exactly as stated. Do NOT draw any grid lines, borders or separators between the cells; the cells are only an invisible layout.

AVOID: NO TEXT OF ANY KIND (no labels, captions, pose names, titles, numbers or letters above, below or next to the figures); no logos or watermark; no frame, border, grid lines or separator lines drawn between the cells; no second figure; no change of clothing or colours between cells; no difference in scale between cells 2 and 3; no realistic or painterly shading; no blurry or anti-aliased edges; no gradients; no shadow on the ground; no floor; no magenta inside the figure.
```

## car_iuvenispoenus | Iuvenis Poenus | tier 1 | Recruit | ouder: -

- Blad A, bijlagen: `car_anker.png` en `rom_tiro_A.png`
- SECOND: The SECOND image is the finished Roman recruit sheet (Tiro): use it ONLY for the sheet format, the pixel size and the pose layout; do NOT copy its clothing, shield or face.
- NAME: Iuvenis Poenus; TIER: 1; BRANCH: Recruit; ROLE: recruit
- OUTFIT: He is a young Carthaginian recruit, the simplest unit. He wears: bare head with short curly black hair, a thin orange headband and a small gold hoop earring, face clearly visible (bronze skin, a short black beard shadow, clear dark eyes, a determined look); a short plain white linen tunic with an orange hem; a short bright orange cloak pinned at one shoulder; a brown leather belt; brown leather sandals with straps; NO armour and NO helmet. In his left hand a small ROUND wooden shield painted saturated orange with a yellow palm tree as emblem and a small gold boss. In his right hand a plain wooden spear with a short silver-grey leaf-shaped head.
- REST: standing relaxed, facing the viewer, the spear held upright beside his body, the shield at his side
- ATTACK: one step forward, the spear thrust forward, the shield raised in front of his chest
- HIT: upper body leaning backwards, eyes closed, the shield sagging, the spear tilting
- PORT: Show the orange headband, the gold earring, the short curly black hair and the orange cloak pinned at the shoulder.
- FRONT: Spear held ready in the right hand, small round orange shield raised on the left arm.
- BACK: Show the orange cloak, the short curly black hair, the back of the round shield and the spear.

## car_libyus | Libyus | tier 2 | Infantry | ouder: Iuvenis Poenus

- Blad A, bijlagen: `car_anker.png` en `car_iuvenispoenus_A.png`
- SECOND: The SECOND image is the finished sheet of the parent form (Iuvenis Poenus): this unit is the next step of the SAME Carthaginian line, so keep the same saturated orange, the same deep warm brown North African skin with short black hair and gold earrings, the same white-and-orange clothing and the same yellow palm-tree emblem, but richer and with the new equipment described below.
- NAME: Libyus; TIER: 2; BRANCH: Infantry; ROLE: infantry
- OUTFIT: He is a Libyan spearman. He wears: a shiny GOLD Greek-style helmet with a short bright orange plume, face open and clearly visible (deep warm brown North African skin (clearly darker than the Carthaginian recruit), short curly black hair, gold hoop earrings, a short black beard, clear dark eyes); a white linen cuirass (linothorax) with gold studs and orange shoulder flaps over a short white tunic; a bright orange cloak with a gold brooch; a brown leather belt with a bronze buckle; shiny GOLD greaves; brown leather sandals. In his left hand a ROUND shield painted saturated orange with a yellow palm tree emblem and a gold rim and boss. In his right hand a long wooden spear with a silver leaf-shaped head; a short straight sword at his left hip.
- REST: standing relaxed, facing the viewer, the long spear held upright beside his body, the shield at his side
- ATTACK: one step forward, the long spear thrust forward, the shield raised in front of his chest
- HIT: upper body leaning backwards, eyes closed, the shield sagging, the long spear tilting
- PORT: Show the gold helmet with the short orange plume, the gold earrings, the white cuirass with the orange flaps and the orange cloak.
- FRONT: Round orange shield on the left arm, long spear held ready in the right hand.
- BACK: Show the back of the round shield, the orange cloak, the helmet plume and the spear.

## car_veteranuslibyus | Veteranus Libyus | tier 3 | Infantry | ouder: Libyus

- Blad A, bijlagen: `car_anker.png` en `car_libyus_A.png`
- SECOND: The SECOND image is the finished sheet of the parent form (Libyus): this unit is the next step of the SAME Carthaginian line, so keep the same saturated orange, the same deep warm brown North African skin with short black hair and gold earrings, the same white-and-orange clothing and the same yellow palm-tree emblem, but richer and with the new equipment described below.
- NAME: Veteranus Libyus; TIER: 3; BRANCH: Infantry; ROLE: infantry
- OUTFIT: He is a veteran Libyan soldier. He wears: a shiny GOLD helmet with a taller bright orange plume, gold cheek guards and a nose guard, face open and clearly visible (deep warm brown North African skin (clearly darker than the Carthaginian recruit), short curly black hair, a black beard with a few grey streaks, gold hoop earrings, clear dark eyes, a firm look); a light SILVER-GREY mail shirt with short sleeves over a white tunic with an orange hem; a long bright orange cloak with a gold brooch; a brown belt with a gold buckle; shiny GOLD greaves; brown leather boots. In his left hand a large ROUND shield painted saturated orange with a yellow palm tree and a wide gold rim. In his right hand a long wooden spear with a silver head; a long straight sword at his left hip.
- REST: standing relaxed, facing the viewer, the long spear held upright beside his body, the shield at his side
- ATTACK: one step forward, the long spear thrust forward, the shield raised in front of his chest
- HIT: upper body leaning backwards, eyes closed, the shield sagging, the long spear tilting
- PORT: Show the gold helmet with the tall orange plume, the grey-streaked beard, the mail shirt and the gold brooch.
- FRONT: Large round orange shield on the left arm, long spear held ready in the right hand.
- BACK: Show the back of the large shield, the long orange cloak, the helmet plume and the spear.

## car_milessacer | Miles sacer | tier 4 | Infantry | ouder: Veteranus Libyus

- Blad A, bijlagen: `car_anker.png` en `car_veteranuslibyus_A.png`
- SECOND: The SECOND image is the finished sheet of the parent form (Veteranus Libyus): this unit is the next step of the SAME Carthaginian line, so keep the same saturated orange, the same deep warm brown North African skin with short black hair and gold earrings, the same white-and-orange clothing and the same yellow palm-tree emblem, but richer and with the new equipment described below.
- NAME: Miles sacer; TIER: 4; BRANCH: Infantry; ROLE: infantry (elite, Sacred Band)
- OUTFIT: He is a soldier of the Sacred Band, the elite of Carthage. He wears: a shiny GOLD Greek-style helmet with a very tall bright orange crest running from front to back, gold cheek guards and a gold band, face open and clearly visible (deep warm brown North African skin (clearly darker than the Carthaginian recruit), short curly black hair, a neat short black beard, large gold hoop earrings, clear dark eyes, a proud look); a shiny GOLD muscle cuirass with gold shoulder straps over a white tunic with a wide orange hem and a skirt of orange leather strips with gold studs; a long rich bright orange cloak with a gold border and a round gold clasp; a white-and-orange sash; shiny GOLD greaves; brown leather sandals with gold studs. In his left hand a large ROUND shield painted saturated orange with a big yellow palm tree and a very wide gold rim. In his right hand a long spear with a silver head and a gold ring; a straight sword with a gold hilt at his hip.
- REST: standing relaxed, facing the viewer, the long spear held upright beside his body, the shield at his side
- ATTACK: one step forward, the long spear thrust forward, the shield raised in front of his chest
- HIT: upper body leaning backwards, eyes closed, the shield sagging, the long spear tilting
- PORT: Show the gold helmet with the very tall orange crest, the large gold earrings, the gold cuirass and the gold clasp.
- FRONT: Large round orange shield on the left arm, long spear held ready in the right hand.
- BACK: Show the very tall crest, the long orange cloak with the gold border, the back of the large shield and the spear.

## car_funditorbalearic | Funditor Balearicus | tier 2 | Ranged | ouder: Iuvenis Poenus

- Blad A, bijlagen: `car_anker.png` en `car_iuvenispoenus_A.png`
- SECOND: The SECOND image is the finished sheet of the parent form (Iuvenis Poenus): this unit is the next step of the SAME Carthaginian line, so keep the same saturated orange, the same bronze skin with short black hair and gold earrings, the same white-and-orange clothing and the same yellow palm-tree emblem, but richer and with the new equipment described below.
- NAME: Funditor Balearicus; TIER: 2; BRANCH: Ranged; ROLE: ranged, slinger
- OUTFIT: He is a slinger from the Balearic islands. He wears: bare head with short curly black hair and a thin orange headband, face clearly visible (bronze skin, clear dark eyes, a cheeky look); a short light tunic in cream with an orange hem; a wide brown leather belt with a pouch full of round sling stones; an orange sash across the chest; a rope belt around his waist with a second spare sling; brown leather sandals; NO armour, NO helmet and NO shield. In his right hand a long leather sling with a stone in the pouch, swung ready; in his left hand a few more round stones.
- REST: standing relaxed, facing the viewer, the sling held loosely, light on his feet
- ATTACK: firing or throwing pose: leaning back then forward, the sling aimed forward with the free arm stretched forward
- HIT: upper body leaning backwards, eyes closed, the sling dropping, hand raised
- PORT: Show the orange headband, the short curly black hair, the orange sash and the pouch of sling stones.
- FRONT: Sling swinging in the right hand, a few stones in the left hand.
- BACK: Show the orange sash, the rope belt with the spare sling and the pouch of stones.

## car_equesnumida | Eques Numida | tier 2 | Cavalry | ouder: Iuvenis Poenus

- Blad A, bijlagen: `car_anker.png` en `car_iuvenispoenus_A.png`
- SECOND: The SECOND image is the finished sheet of the parent form (Iuvenis Poenus): use it for the saturated orange, the palm-tree emblem, the pixel style and the sheet format, BUT this unit is a Numidian from North Africa: draw him with clearly DEEPER, darker warm brown skin than the recruit (a rich brown, not light tan), tight dark curls, strong dark brown eyes and North African facial features, with gold earrings and the white-and-orange clothing.
- NAME: Eques Numida; TIER: 2; BRANCH: Cavalry; ROLE: cavalry, light rider
- OUTFIT: He is a Numidian light horseman. The unit is the horse and its rider together as ONE whole in the cell: a small lean brown horse with NO saddle, only an orange blanket with a yellow palm tree and a plain rope bridle. The rider wears: bare head with short curly black hair and an orange headband, gold hoop earrings, face clearly visible (deep dark warm brown skin, noticeably darker than the Carthaginian recruit, clear dark eyes, a quick look); a short cream tunic with an orange hem; a short orange cloak; bare feet in simple sandals; NO armour. In his left hand a small ROUND shield in orange with a yellow palm tree; in his right hand a light javelin with a silver head, with two more javelins in a bundle on his back. The whole horse and rider fit inside the 56-pixel limit and the margins.
- REST: sitting on the standing horse, facing the viewer, the javelin held upright, the shield on his arm
- ATTACK: the horse taking one step forward, the javelin thrown forward over the horse's head, the shield raised
- HIT: the horse shying back, the rider leaning backwards with eyes closed, the shield sagging
- PORT: Show the orange headband, the gold earring and the short curly black hair.
- FRONT: The small horse with its rider seen from the front, the rider holding the javelin and the shield.
- BACK: Show the back of the horse with the orange blanket, the rider's orange cloak and the bundle of javelins.

## car_numidanobilis | Numida nobilis | tier 3 | Cavalry | ouder: Eques Numida

- Blad A, bijlagen: `car_anker.png` en `car_equesnumida_A.png`
- SECOND: The SECOND image is the finished sheet of the parent form (Eques Numida): this unit is the next step of the SAME Numidian line, so keep the same DEEP, DARK warm brown North African skin, tight dark curls, strong dark brown eyes and North African facial features, the same saturated orange and the same yellow palm-tree emblem, but richer and with the new equipment described below.
- NAME: Numida nobilis; TIER: 3; BRANCH: Cavalry; ROLE: cavalry, noble rider
- OUTFIT: He is a Numidian noble, a prince of the horsemen. The unit is the horse and its rider together as ONE whole in the cell: a fine light-grey horse with a clearly visible yellow-and-brown spotted leopard-skin saddle blanket edged in orange, a gold-studded bridle and orange tassels. The rider wears: a gold band with a short orange feather on short curly black hair, large gold hoop earrings, face clearly visible (deep dark warm brown skin, noticeably darker than the Carthaginian recruit, a short black beard, clear dark eyes, a proud look); a rich cream tunic with a wide orange border and gold embroidery; a long bright orange cloak with a gold clasp; thick gold arm rings; brown leather boots with gold studs. In his left hand a small ROUND shield painted orange with a yellow palm tree and a gold rim; in his right hand a light javelin with a silver head and a gold ring. The whole horse and rider fit inside the 56-pixel limit and the margins.
- REST: sitting on the standing horse, facing the viewer, the javelin held upright, the shield on his arm
- ATTACK: the horse rearing slightly, the javelin thrown forward over the horse's head, the shield raised
- HIT: the horse shying back, the rider leaning backwards with eyes closed, the shield sagging
- PORT: Show the gold band with the orange feather, the large gold earrings, the short beard and the gold clasp.
- FRONT: The grey horse with its noble rider seen from the front, the rider holding the javelin and the shield.
- BACK: Show the back of the horse with the leopard-skin blanket, the long orange cloak and the javelin.

## car_rectorelephanti | Rector elephanti | tier 2 | Elephants | ouder: Iuvenis Poenus

- Blad A, bijlagen: `car_anker.png` en `car_iuvenispoenus_A.png`
- SECOND: The SECOND image is the finished sheet of the parent form (Iuvenis Poenus): this unit is the next step of the SAME Carthaginian line, so keep the same saturated orange, the same bronze skin with short black hair and gold earrings, the same white-and-orange clothing and the same yellow palm-tree emblem, but richer and with the new equipment described below.
- NAME: Rector elephanti; TIER: 2; BRANCH: Elephants; ROLE: cavalry, elephant driver
- OUTFIT: He is an elephant driver. The unit is the elephant and its driver together as ONE whole in the cell: a young grey African forest elephant (smaller, with short tusks) with a plain orange saddle blanket with a yellow palm tree and a brown leather harness with small gold bells. The driver sits on its neck and wears: bare head with short curly black hair and an orange headband, gold hoop earrings, face clearly visible (bronze skin, clear dark eyes); a short cream tunic with an orange hem; a short orange cloak; NO armour and NO shield. In his right hand a long wooden elephant goad with a small silver hook. The whole elephant with its driver fits inside the 56-pixel limit and the margins.
- REST: the elephant standing still, facing the viewer, the trunk hanging, the driver sitting upright with the goad
- ATTACK: the elephant stepping forward with its trunk raised and swinging, the driver pointing the goad forward
- HIT: the elephant shying back with its trunk raised, the riders leaning backwards, the banners tilting
- PORT: Show the orange headband, the gold earring and the elephant's head with the harness bells.
- FRONT: The young elephant with its driver seen from the front, the driver holding the goad.
- BACK: Show the back of the elephant with the orange saddle blanket, the driver's orange cloak and the goad.

## car_elephantusbellic | Elephantus bellicus | tier 3 | Elephants | ouder: Rector elephanti

- Blad A, bijlagen: `car_anker.png` en `car_rectorelephanti_A.png`
- SECOND: The SECOND image is the finished sheet of the parent form (Rector elephanti): this unit is the next step of the SAME Carthaginian line, so keep the same saturated orange, the same bronze skin with short black hair and gold earrings, the same white-and-orange clothing and the same yellow palm-tree emblem, but richer and with the new equipment described below.
- NAME: Elephantus bellicus; TIER: 3; BRANCH: Elephants; ROLE: cavalry, war elephant
- OUTFIT: He is a war elephant. The unit is the elephant and its crew together as ONE whole in the cell: a large grey African elephant with a gold-and-orange armoured plate on its forehead, long ivory tusks with gold-capped tips, a bright orange saddle blanket with a gold border and a yellow palm tree, and a brown leather harness with gold studs. The driver sits on its neck wearing a shiny GOLD helmet with a small orange plume (face clearly visible, bronze skin, short black beard, clear dark eyes), a short white tunic and an orange cloak, holding a goad. Behind him on its back sits a javelin thrower in a light SILVER-GREY mail shirt with an orange sash and a gold helmet, holding a javelin with a silver head. The whole elephant with its crew fits inside the 56-pixel limit and the margins.
- REST: the elephant standing still, facing the viewer, the trunk hanging, the javelin thrower holding the javelin upright
- ATTACK: the elephant stepping forward with its trunk raised, the javelin thrown forward
- HIT: the elephant shying back with its trunk raised, the riders leaning backwards, the banners tilting
- PORT: Show the elephant's head with the armoured plate and the gold-capped tusks, and the driver with the gold helmet and short beard.
- FRONT: The war elephant with its two riders seen from the front, the javelin thrower raising the javelin.
- BACK: Show the back of the elephant with the orange blanket, the two riders from behind and the javelin.

## car_elephantusturrit | Elephantus turritus | tier 4 | Elephants | ouder: Elephantus bellicus

- Blad A, bijlagen: `car_anker.png` en `car_elephantusbellic_A.png`
- SECOND: The SECOND image is the finished sheet of the parent form (Elephantus bellicus): this unit is the next step of the SAME Carthaginian line, so keep the same saturated orange, the same bronze skin with short black hair and gold earrings, the same white-and-orange clothing and the same yellow palm-tree emblem, but richer and with the new equipment described below.
- NAME: Elephantus turritus; TIER: 4; BRANCH: Elephants; ROLE: cavalry, tower elephant
- OUTFIT: He is the greatest war elephant, carrying a tower. The unit is the elephant and its crew together as ONE whole in the cell: a huge grey African elephant with a gold-and-orange armoured plate and a gold crest on its forehead, long ivory tusks with gold caps and small silver blades, a rich orange blanket with a gold border and yellow palm trees reaching to its knees, and gold-studded harness. On its back stands a small wooden tower with orange walls, a gold rim and a yellow palm tree, with two orange banners on poles, in which two soldiers in shiny GOLD helmets with orange plumes stand: one with a long spear, one with a bow. The driver sits on its neck in a shiny GOLD helmet with a taller orange plume (face clearly visible, bronze skin, short black beard, clear dark eyes) and an orange cloak with a gold clasp. The whole elephant with its tower and crew fits inside the 56-pixel limit and the margins.
- REST: the elephant standing still, facing the viewer, the trunk hanging, the soldiers in the tower standing ready
- ATTACK: the elephant stepping forward with its trunk raised, the spearman in the tower thrusting forward and the archer shooting forward
- HIT: the elephant shying back with its trunk raised, the riders leaning backwards, the banners tilting
- PORT: Show the elephant's head with the gold crest and the armoured plate, the gold-capped tusks, the driver with the gold helmet and the top of the tower with its banners.
- FRONT: The tower elephant seen from the front, the two soldiers in the tower and the driver on its neck.
- BACK: Show the back of the elephant with the orange blanket, the back of the tower with the banners and the soldiers.

