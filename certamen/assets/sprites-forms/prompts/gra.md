# Beeldprompts Grieken (volkscode gra)

Gegenereerd op 2026-10-22 via ChatGPT (zie PROMPT_GENERATOR.md); alle 12 vormen hebben blad A en B. Anker: `gra_anker.png` (Ephebus, gemaakt met `rom_anker.png` als stijlreferentie). Blad A: anker + A van de ouder (Ephebus A: anker + `rom_tiro_A.png` als formaatvoorbeeld). Blad B: A van de vorm + `gra_ephebus_B.png` (Ephebus B: A + `rom_tiro_B.png`). Hieronder de vormgegevens en de twee sjablonen; vul de `{{...}}` in per vorm. Het tweede-beeld-zinnetje (`{{SECOND}}`): "The SECOND image is the sheet of the previous unit in the same line (<ouder>): the new unit is a DIFFERENT unit of the same folk and the same line, with the same colours and base design but richer or different as described below." `{{FMT}}` = Ephebus.

## Sjabloon blad A
```
Use the attached images as the exact reference. The FIRST image is the Greek anchor (style, palette, outline, proportions and level of detail). {{SECOND}}

Create ONE sprite sheet: canvas exactly 1536 x 1024 pixels, 16-bit JRPG pixel-art in the style of RPG Maker MV and classic Fire Emblem sprites. Layout: 3 columns by 2 rows of INVISIBLE cells, each cell exactly 512 x 512 pixels, the SAME character in all six cells. Background: one flat solid magenta #FF00FF, no gradient, no floor, no shadow on the ground. No magenta anywhere in the figure. IMPORTANT: the image contains NO TEXT of any kind: no labels, no captions, no pose names, no titles, no numbers and no letters anywhere, neither inside nor outside the cells.

CHARACTER: "{{NAME}}", Greek unit (tier {{TIER}}, branch {{BRANCH}}, role {{ROLE}}). {{OUTFIT}}

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

CHARACTER: "{{NAME}}", Greek unit (tier {{TIER}}, branch {{BRANCH}}, role {{ROLE}}). {{OUTFIT}}

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

## gra_ephebus | Ephebus | tier 1 | Recruit | ouder: -

- Blad A, bijlagen: `gra_anker.png` en `rom_tiro_A.png`
- NAME: Ephebus; TIER: 1; BRANCH: Recruit; ROLE: recruit
- OUTFIT: He is a young Greek recruit, the simplest unit. He wears: bare head with medium-brown wavy hair and a thin blue headband, face clearly visible (tanned skin, clear dark eyes); a short cream-white linen chiton with a blue hem reaching the thighs; a short bright blue cloak (chlamys) pinned at the right shoulder with a small gold brooch; a brown leather belt; bare knees; brown leather sandals with straps; NO armour and NO helmet. In his left hand a small ROUND wooden shield painted saturated blue with a yellow Greek-key (meander) ring and a small gold boss. In his right hand a plain wooden spear with a short silver-grey leaf-shaped head.
- REST: standing relaxed, facing the viewer, the spear held upright beside him, the shield at his side
- ATTACK: one step forward, the spear thrust forward, the shield raised in front of his chest
- HIT: upper body leaning backwards, eyes closed, the shield sagging, hand raised
- PORT: Show the blue headband, the blue cloak with the gold brooch and the cream chiton collar.
- FRONT: Spear held ready in the right hand, small round shield raised on the left arm.
- BACK: Show the blue cloak, the back of the round shield and the spear.

## gra_hoplites | Hoplites | tier 2 | Infantry | ouder: Ephebus

- Blad A, bijlagen: `gra_anker.png` en `gra_ephebus_A.png`
- NAME: Hoplites; TIER: 2; BRANCH: Infantry; ROLE: infantry
- OUTFIT: He wears: a shiny GOLD Corinthian-style helmet with a tall bright blue horsehair crest, the face open and clearly visible below the raised brow (tanned skin, medium-brown hair, clear dark eyes); a cream-white linen cuirass with blue-edged shoulder flaps and a blue-edged skirt of leather strips; a short bright blue cloak; a brown leather belt with a bronze buckle; shiny GOLD greaves on both shins; brown leather sandals with straps. In his left hand a ROUND shield (hoplon) painted saturated blue with a yellow Greek-key (meander) ring and a gold boss. In his right hand a long wooden spear (dory) with a silver leaf-shaped head. A short straight sword (xiphos) in a brown scabbard at his left hip.
- REST: standing relaxed, facing the viewer, the spear held upright beside him, the shield at his side
- ATTACK: one step forward, the spear thrust forward over the top of the shield, the shield raised
- HIT: upper body leaning backwards, eyes closed, the shield sagging, the spear tilting
- PORT: Show the gold helmet with the blue crest, the cream cuirass collar with blue edge and the blue cloak.
- FRONT: Round shield raised on the left arm, spear held ready in the right hand.
- BACK: Show the back of the round shield, the blue cloak, the helmet crest and the spear.

## gra_epilectus | Epilectus | tier 3 | Infantry | ouder: Hoplites

- Blad A, bijlagen: `gra_anker.png` en `gra_hoplites_A.png`
- NAME: Epilectus; TIER: 3; BRANCH: Infantry; ROLE: infantry
- OUTFIT: He wears: a shiny GOLD Corinthian-style helmet with a taller bright blue horsehair crest and two upright blue feathers at the sides, face open and clearly visible (tanned skin, medium-brown hair, clear dark eyes); a shiny GOLD bell-shaped cuirass over a cream-white tunic with blue sleeves and a blue-edged skirt of leather strips; a longer bright blue cloak with a gold brooch; a brown leather belt with a gold buckle; shiny GOLD greaves on both shins; brown leather sandals with straps. In his left hand a ROUND shield (hoplon) painted saturated blue with a yellow Greek-key (meander) ring and a gold boss, with a wider gold rim than the Hoplites. In his right hand a long wooden spear (dory) with a silver leaf-shaped head. A short straight sword (xiphos) in a brown scabbard at his left hip.
- REST: standing relaxed, facing the viewer, the spear held upright beside him, the shield at his side
- ATTACK: one step forward, the spear thrust forward over the top of the shield, the shield raised
- HIT: upper body leaning backwards, eyes closed, the shield sagging, the spear tilting
- PORT: Show the gold helmet with the blue crest and feathers, the gold cuirass and the blue cloak with the gold brooch.
- FRONT: Round shield raised on the left arm, spear held ready in the right hand.
- BACK: Show the back of the round shield, the long blue cloak, the helmet crest and the spear.

## gra_lochagus | Lochagus | tier 4 | Infantry | ouder: Epilectus

- Blad A, bijlagen: `gra_anker.png` en `gra_epilectus_A.png`
- NAME: Lochagus; TIER: 4; BRANCH: Infantry; ROLE: infantry
- OUTFIT: He wears: a shiny GOLD Attic-style helmet with a large, tall bright blue horsehair crest running from side to side over the top, gold cheek guards, face open and clearly visible (tanned skin, medium-brown hair, a short dark beard, clear dark eyes, a commanding look); a shiny GOLD muscle cuirass with gold shoulder straps over a cream-white tunic with blue sleeves and a blue skirt of leather strips with gold studs; a bright blue sash tied around the waist; a long rich bright blue cloak down to the calves with a round gold clasp; shiny GOLD greaves on both shins; brown leather sandals with straps. In his left hand a ROUND shield (hoplon) painted saturated blue with a yellow Greek-key (meander) ring and a gold boss, with a very wide gold rim. In his right hand a straight sword with a silver blade and a gold hilt, raised in command.
- REST: standing proudly, facing the viewer, the sword resting on his shoulder, the shield at his side
- ATTACK: one step forward, the sword thrust forward in command, the shield raised
- HIT: upper body leaning backwards, eyes closed, the shield sagging, the sword tilting
- PORT: Show the gold helmet with the large blue transverse crest, the short dark beard, the gold cuirass and the gold clasp of the cloak.
- FRONT: Round shield raised on the left arm, sword raised in the right hand.
- BACK: Show the back of the round shield, the long blue cloak, the transverse crest and the sword.

## gra_psilus | Psilus | tier 2 | Light and ranged | ouder: Ephebus

- Blad A, bijlagen: `gra_anker.png` en `gra_ephebus_A.png`
- NAME: Psilus; TIER: 2; BRANCH: Light and ranged; ROLE: ranged, javelin thrower
- OUTFIT: He wears: a flat-brimmed brown straw hat (petasos) with a blue band, hanging on his back by a cord or worn on his head with the face clearly visible (tanned skin, medium-brown hair, clear dark eyes); a short cream-white linen chiton with a blue hem; a short bright blue cloak knotted at the shoulder; a brown leather belt with a small stone pouch at the left hip; bare knees; brown leather sandals with straps; NO armour and NO shield. In his right hand a light wooden javelin with a silver head; a bundle of two more javelins is tied across his back.
- REST: standing relaxed, facing the viewer, the javelin held loosely, light on his feet
- ATTACK: throwing pose: leaning back then forward, the javelin in the raised right hand aimed forward, left arm stretched forward
- HIT: upper body leaning backwards, eyes closed, the javelin dropping, hand raised
- PORT: Show the petasos hat with the blue band, the blue cloak knot and the cream chiton collar.
- FRONT: Javelin raised in the right hand ready to throw, the javelin bundle visible above his shoulder.
- BACK: Show the blue cloak, the bundle of javelins across his back and the stone pouch.

## gra_peltasta | Peltasta | tier 3 | Light and ranged | ouder: Psilus

- Blad A, bijlagen: `gra_anker.png` en `gra_psilus_A.png`
- NAME: Peltasta; TIER: 3; BRANCH: Light and ranged; ROLE: ranged, peltast with javelins
- OUTFIT: He wears: a pointed Phrygian-style felt cap in saturated blue with a gold band, face clearly visible (tanned skin, medium-brown hair, clear dark eyes); a cream-white tunic with long blue-striped sleeves under a short brown leather jerkin with gold studs; a short bright blue cloak; a brown leather belt with a gold buckle and a short curved sword (kopis) in a scabbard; brown leather boots laced to the calf. In his left hand a light crescent-shaped wicker shield (pelte) painted saturated blue with a yellow crescent rim. In his right hand a light javelin with a silver head; two more javelins in a bundle on his back.
- REST: standing relaxed, facing the viewer, the javelin held loosely, the crescent shield at his side
- ATTACK: throwing pose: leaning back then forward, the javelin in the raised right hand aimed forward, the crescent shield held forward
- HIT: upper body leaning backwards, eyes closed, the shield sagging, the javelin dropping
- PORT: Show the blue felt cap with the gold band, the leather jerkin collar and the blue cloak.
- FRONT: Javelin raised ready to throw, the crescent shield on the left arm.
- BACK: Show the blue cloak, the bundle of javelins on his back and the back of the crescent shield.

## gra_toxota | Toxota | tier 3 | Light and ranged | ouder: Psilus

- Blad A, bijlagen: `gra_anker.png` en `gra_psilus_A.png`
- NAME: Toxota; TIER: 3; BRANCH: Light and ranged; ROLE: ranged, archer
- OUTFIT: He wears: a soft leather cap with a blue cloth wrapped around it, face clearly visible (tanned skin, medium-brown hair, clear dark eyes); a cream-white long-sleeved tunic with a blue hem; a short bright blue cloak; a brown leather belt with a bronze buckle; a leather bracer on the left forearm; brown leather boots laced to the calf; NO armour and NO shield. In his left hand a large curved wooden composite bow with a pale string. On his back a brown leather quiver full of arrows with blue feathers.
- REST: standing relaxed, facing the viewer, the bow held low in his left hand
- ATTACK: one step forward, the bow drawn with an arrow aimed forward, right hand pulling the string to his cheek
- HIT: upper body leaning backwards, eyes closed, the bow dropping, hand raised
- PORT: Show the leather cap with the blue cloth, the blue cloak and the quiver over the shoulder.
- FRONT: The bow held ready with an arrow nocked, the quiver visible over his shoulder.
- BACK: Show the quiver with blue-feathered arrows on his back, the blue cloak and the bow.

## gra_toxotacretensis | Toxota Cretensis | tier 4 | Light and ranged | ouder: Toxota

- Blad A, bijlagen: `gra_anker.png` en `gra_toxota_A.png`
- NAME: Toxota Cretensis; TIER: 4; BRANCH: Light and ranged; ROLE: ranged, Cretan archer
- OUTFIT: He wears: a shiny GOLD pointed conical helmet with a small bright blue plume, gold cheek guards, face open and clearly visible (tanned skin, medium-brown hair, a short dark beard, clear dark eyes); a short blue leather cuirass with gold studs over a cream-white long-sleeved tunic; a bright blue cloak with a gold clasp; a brown leather belt with a gold buckle; gold bracers on both forearms; brown leather boots laced to the calf; NO shield. In his left hand a very large curved wooden composite bow with gold tips and a pale string. On his back a large brown leather quiver full of arrows with blue feathers, and a short sword at his hip.
- REST: standing proudly, facing the viewer, the large bow held low in his left hand
- ATTACK: one step forward, the large bow drawn with an arrow aimed forward, right hand pulling the string to his cheek
- HIT: upper body leaning backwards, eyes closed, the bow dropping, hand raised
- PORT: Show the gold pointed helmet with the blue plume, the short beard and the blue cloak with the gold clasp.
- FRONT: The large bow held ready with an arrow nocked, the big quiver visible over his shoulder.
- BACK: Show the large quiver with blue-feathered arrows, the blue cloak and the bow.

## gra_hippeus | Hippeus | tier 2 | Cavalry | ouder: Ephebus

- Blad A, bijlagen: `gra_anker.png` en `gra_ephebus_A.png`
- NAME: Hippeus; TIER: 2; BRANCH: Cavalry; ROLE: cavalry, mounted rider
- OUTFIT: The figure is a rider on a horse, drawn as ONE whole. The horse is light grey with a darker grey mane and tail, a bright blue saddle cloth with a yellow Greek-key border and brown leather harness with bronze buckles. The rider wears: a shiny GOLD Boeotian-style helmet with a small bright blue plume, face open and clearly visible (tanned skin, medium-brown hair, clear dark eyes); a cream-white short tunic with a thin cream linen cuirass; a bright blue cloak flowing behind him; brown leather boots. In his left hand a small ROUND shield painted saturated blue with a yellow Greek-key ring. In his right hand a long wooden spear (xyston) with a silver leaf-shaped head. The horse is part of the figure and fills the cell, but the margin requirement still holds.
- REST: the horse standing still, the rider upright in the saddle facing the viewer, the spear held upright, the shield at his side
- ATTACK: the horse taking a step forward, the rider leaning forward and thrusting the spear forward, shield raised
- HIT: the horse stepping back and tossing its head, the rider leaning backwards with eyes closed, shield sagging
- PORT: Show the gold helmet with the small blue plume, the blue cloak and the horse's head beside him.
- FRONT: The horse seen from the front with the rider upright, the spear raised, the shield on the left arm.
- BACK: Show the horse from behind with its tail and the blue saddle cloth, the rider's back, the blue cloak and the back of the shield.

## gra_prodromus | Prodromus | tier 3 | Cavalry | ouder: Hippeus

- Blad A, bijlagen: `gra_anker.png` en `gra_hippeus_A.png`
- NAME: Prodromus; TIER: 3; BRANCH: Cavalry; ROLE: cavalry, light scout rider
- OUTFIT: The figure is a rider on a horse, drawn as ONE whole. The horse is light grey with a darker grey mane and tail, a bright blue saddle cloth with a yellow Greek-key border and brown leather harness with shiny gold studs. The rider wears: a flat-brimmed brown straw hat (petasos) with a blue band, face clearly visible (tanned skin, medium-brown hair, clear dark eyes); a cream-white short tunic under a brown leather jerkin; a bright blue cloak flowing behind him; brown leather boots; NO shield and NO helmet. In his right hand a light javelin with a silver head; two more javelins are held in a bundle at his saddle. The horse is part of the figure and fills the cell, but the margin requirement still holds.
- REST: the horse standing still, the rider upright in the saddle facing the viewer, the javelin held upright
- ATTACK: the horse taking a step forward, the rider leaning back with the javelin raised in his right hand, about to throw it forward
- HIT: the horse stepping back and tossing its head, the rider leaning backwards with eyes closed, the javelin tilting
- PORT: Show the petasos hat with the blue band, the blue cloak and the horse's head beside him.
- FRONT: The horse seen from the front with the rider upright, the javelin raised, the javelin bundle at the saddle.
- BACK: Show the horse from behind with its tail and the blue saddle cloth, the rider's back, the blue cloak and the javelin bundle.

## gra_hetairus | Hetairus | tier 4 | Cavalry | ouder: Prodromus

- Blad A, bijlagen: `gra_anker.png` en `gra_prodromus_A.png`
- NAME: Hetairus; TIER: 4; BRANCH: Cavalry; ROLE: cavalry, companion cavalry
- OUTFIT: The figure is a rider on a horse, drawn as ONE whole. The horse is a strong light grey with a white blaze on its face, a darker grey mane and tail, a rich bright blue saddle cloth with a wide gold border and gold fringe, and brown leather harness with many shiny gold discs. The rider wears: a shiny GOLD Boeotian-style helmet with a tall bright blue horsehair plume, face open and clearly visible (tanned skin, medium-brown hair, a short dark beard, clear dark eyes, a commanding look); a shiny GOLD muscle cuirass over a cream-white tunic with blue sleeves; a long rich bright blue cloak flowing behind him with a round gold clasp; shiny gold greaves; brown leather boots. In his left hand a medium ROUND shield saturated blue with a yellow Greek-key ring and a wide gold rim. In his right hand a very long wooden lance (sarissa) with a silver leaf-shaped head and a small blue pennant. The horse is part of the figure and fills the cell, but the margin requirement still holds.
- REST: the horse standing proudly, the rider upright in the saddle facing the viewer, the long lance held upright, the shield at his side
- ATTACK: the horse taking a step forward, the rider leaning forward with the lance levelled forward, pennant flying, shield raised
- HIT: the horse stepping back and tossing its head, the rider leaning backwards with eyes closed, lance tilting
- PORT: Show the tall blue plume, the gold cuirass, the short dark beard and the gold clasp of the cloak.
- FRONT: The horse seen from the front with its white blaze, the rider upright with the lance raised and the shield on the left arm.
- BACK: Show the horse from behind, the rider's back with the long blue cloak, the pennant and the back of the round shield.

## gra_hippotoxota | Hippotoxota | tier 3 | Cavalry | ouder: Hippeus

- Blad A, bijlagen: `gra_anker.png` en `gra_hippeus_A.png`
- NAME: Hippotoxota; TIER: 3; BRANCH: Cavalry; ROLE: cavalry, mounted archer
- OUTFIT: The figure is a rider on a horse, drawn as ONE whole. The horse is light grey with a darker grey mane and tail, a bright blue saddle cloth with a yellow Greek-key border and brown leather harness with bronze buckles. The rider wears: a soft leather cap with a blue cloth wrapped around it, face clearly visible (tanned skin, medium-brown hair, clear dark eyes); a cream-white long-sleeved tunic; a short bright blue cloak flowing behind him; a leather bracer on the left forearm; brown leather boots; NO shield and NO helmet. In his left hand a large curved wooden composite bow. A brown leather quiver full of arrows with blue feathers hangs at his hip. The horse is part of the figure and fills the cell, but the margin requirement still holds.
- REST: the horse standing still, the rider upright in the saddle facing the viewer, the bow held low in his left hand
- ATTACK: the horse taking a step forward, the rider drawing the bow with an arrow aimed forward, right hand pulling the string to his cheek
- HIT: the horse stepping back and tossing its head, the rider leaning backwards with eyes closed, the bow dropping
- PORT: Show the leather cap with the blue cloth, the blue cloak and the horse's head beside him.
- FRONT: The horse seen from the front with the rider upright, the bow held ready, the quiver at his hip.
- BACK: Show the horse from behind with its tail and the blue saddle cloth, the rider's back, the blue cloak and the quiver.
