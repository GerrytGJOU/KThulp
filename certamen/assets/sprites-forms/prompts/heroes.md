# Beeldprompts helden (hero_*)

Gegenereerd op 2026-10-23 via ChatGPT (zie PROMPT_GENERATOR.md en ../HELDEN_EVOLUTIE.md). Klaar: Ulixes (basis, sag, ins, mac, sag_pr = Arcitenens, ins_pr = Callidus, mac_pr = Architectus Equi), Aeneas (basis, dux, pro, dux_pr = Conditor, pro_pr = Pius) Romulus (basis, rex, bel, rex_pr = Quirinus, bel_pr = Martis filius) Horatius Cocles (basis, cus, pug, cus_pr = Servator Urbis, pug_pr = Heros Tiberis) Cloelia (basis, eq, exp, eq_pr = Domina Equitum, exp_pr = Virgo Fortissima) Mucius Scaevola (basis, ins, for, ins_pr = Sicarius, for_pr = Dextra Ignea) Camilla (basis, sag, eqs, sag_pr = Virgo Volsca, eqs_pr = Regina Camillarum) Hercules (basis, ath, sag, ath_pr = Alcides, sag_pr = Deus) en Perseus (basis, eqa, ven, eqa_pr = Gorgonicida, ven_pr = Medusae Victor). Let op bij het snijden: draai daarna `bars.py`-achtige opschoning (losse dunne streepjes aan de rand van battle_front/back verwijderen). Werkwijze: basis-A met `gra_ephebus_A.png` als formaatvoorbeeld, basis-B met eigen A + `gra_ephebus_B.png`; specialisatie-A met de basis-A, specialisatie-B met eigen A + `<held>_B.png` (basis); prestige-A met de A van de specialisatie, prestige-B met eigen A + B van de specialisatie. Elke volgende held: voeg een vormgegeven toe en vul de `{{...}}` in.

## Sjabloon blad A
```
Use the attached image as reference. {{INTRO}}

Create ONE sprite sheet: canvas exactly 1536 x 1024 pixels, 16-bit JRPG pixel-art in the style of RPG Maker MV and classic Fire Emblem sprites. Layout: 3 columns by 2 rows of INVISIBLE cells, each cell exactly 512 x 512 pixels, the SAME character in all six cells. Background: one flat solid magenta #FF00FF, no gradient, no floor, no shadow on the ground. No magenta anywhere in the figure. IMPORTANT: the image contains NO TEXT of any kind: no labels, no captions, no pose names, no titles, no numbers and no letters anywhere, neither inside nor outside the cells.

CHARACTER: "{{NAME}}", {{ROLE}}. {{OUTFIT}}

STYLE: chunky visible pixels, at most 24 colours, one dark-brown 1-pixel outline around the whole figure, flat cel-shading with at most two tones per colour, warm saturated fantasy colours, small chibi proportions (head about one third of body height), easy to read at small size. This is a LEGENDARY HERO: slightly more detail and a more heroic, distinctive look than an ordinary soldier.

PIXEL GRID: every cell is its own 64 x 64 pixel grid; every pixel is a block of 8 x 8 image pixels and all pixels in the whole image are exactly the same size. The figure is at most 56 of the 64 pixels tall with at least 4 blocks of empty magenta margin all around. Feet on the same horizontal line in every cell. The figure has the same size in every cell.

CAMERA: three-quarter top-down view (about 30 degrees above the figure, slightly in front of him), unless a pose says otherwise. Express viewing direction by camera position ("seen from behind", "facing the viewer"), not by left or right of the figure.

POSES, in this fixed order:
Row 1, cell 1, resting pose: {{REST}}.
Row 1, cell 2, attacking pose: {{ATTACK}}.
Row 1, cell 3, getting-hit pose: {{HIT}}.
Row 2, cell 1, walking-towards-the-camera pose: walking towards the camera, face and chest clearly visible, carrying the same equipment.
Row 2, cell 2, walking-sideways pose: walking to the RIGHT of the image, pure side view in profile, the main weapon or item in the hand on the far side of the body.
Row 2, cell 3, walking-away pose: walking away from the camera, back, cape and the back of the equipment visible.

CONSISTENCY: the equipment stays the same in ALL cells and every part of the figure, including weapons, tools, bow, arrows and cape, stays completely inside its own cell, at least 4 pixel blocks from the cell edges, never touching a neighbouring cell.

Style reference: match the attached reference sheet exactly in pixel size, outline and shading. Use bright, saturated colours with strong contrast: metal shiny GOLD or silver-bronze (not brown), cloth in saturated colours. Skin and face must stay clearly readable when the sprite is shrunk to 48 pixels (clear dark eyes, olive skin tone, mouth visible). Canvas exactly as stated. Do NOT draw any grid lines, borders or separators between the cells; the cells are only an invisible layout.

AVOID: NO TEXT OF ANY KIND (no labels, captions, pose names, titles, numbers or letters above, below or next to the figures); no logos or watermark; no frame, border, grid lines or separator lines drawn between the cells; no second figure; no change of clothing or colours between cells; no difference in scale between cells; no realistic or painterly shading; no blurry or anti-aliased edges; no gradients; no shadow on the ground; no floor; no magenta inside the figure.
```

## Sjabloon blad B
```
Use the attached images as reference. The FIRST image (the six-cell sprite sheet of {{NAME}}) shows THE SAME character to be redrawn: use it ONLY for the character's appearance and do NOT copy its six-cell layout. The SECOND image ({{FMT}}) shows the exact FORMAT, style, pixel size, outline and level of detail to follow (do NOT copy its clothing or face). Your output must have the same layout as the second image: ONE row of exactly three cells, never two rows and never six cells.

Create ONE sheet: canvas exactly 1536 x 512 pixels, 16-bit JRPG pixel-art in the style of RPG Maker MV and classic Fire Emblem sprites. Layout: ONE single row of exactly 3 INVISIBLE cells side by side (NOT six cells, NOT two rows), each exactly 512 x 512 pixels, the SAME character in all three. Background: one flat solid magenta #FF00FF, no gradient, no floor, no shadow on the ground. No magenta anywhere in the figure. IMPORTANT: the image contains NO TEXT of any kind: no labels, no captions, no pose names, no titles, no numbers and no letters anywhere, neither inside nor outside the cells.

CHARACTER: "{{NAME}}", {{ROLE}}. {{OUTFIT}}

STYLE: chunky visible pixels, at most 24 colours, one dark-brown 1-pixel outline around the whole figure, flat cel-shading with at most two tones per colour, warm saturated fantasy colours, small chibi proportions (head about one third of body height), easy to read at small size. This is a LEGENDARY HERO: slightly more detail and a more heroic, distinctive look than an ordinary soldier.

PIXEL GRID: every cell is its own 64 x 64 pixel grid; every pixel is a block of 8 x 8 image pixels and all pixels in the whole image are exactly the same size. In cells 2 and 3 the figure is at most 56 of the 64 pixels tall with at least 4 blocks of empty magenta margin all around, feet on the same horizontal line in both cells, same size in both cells.

CELLS:
Cell 1, a bust portrait: bust, three-quarter view, looking slightly to the right of the image, a clever and friendly look, more detail in the face than in the sprites; the figure fills about 60 percent of the cell. {{PORT}}
Cell 2, full body seen from the front: full body, ready for battle, straight from the front at eye level, face towards the viewer. {{FRONT}}
Cell 3, full body seen from behind: the same body exactly from behind, with a slight angle from above. {{BACK}}

CONSISTENCY: the equipment stays the same in ALL cells and every part of the figure, including weapons, tools, bow, arrows and cape, stays completely inside its own cell, at least 4 pixel blocks from the cell edges, never touching a neighbouring cell.

Style reference: match the attached reference sheet exactly in pixel size, outline and shading. Use bright, saturated colours with strong contrast: metal shiny GOLD or silver-bronze (not brown), cloth in saturated colours. Skin and face must stay clearly readable when the sprite is shrunk to 48 pixels (clear dark eyes, olive skin tone, mouth visible). Canvas exactly as stated. Do NOT draw any grid lines, borders or separators between the cells; the cells are only an invisible layout.

AVOID: NO TEXT OF ANY KIND (no labels, captions, pose names, titles, numbers or letters above, below or next to the figures); no logos or watermark; no frame, border, grid lines or separator lines drawn between the cells; no second figure; no change of clothing or colours between cells; no difference in scale between cells; no realistic or painterly shading; no blurry or anti-aliased edges; no gradients; no shadow on the ground; no floor; no magenta inside the figure.
```

## hero_ulixes | Ulixes

- ROLE: legendary hero, the cunning traveller (support)
- FMT: the finished 3-cell sheet of the Greek recruit Ephebus: portrait, battle front, battle back
- INTRO: The attached image is a six-cell sprite sheet of a Greek soldier: it shows only the required LAYOUT, pose list, pixel size and level of detail. The new character is a legendary hero, NOT a soldier: entirely different clothing, colours and equipment as described below; do NOT copy the soldier's clothing, colours or shield.
- OUTFIT: He wears: a shiny silver-bronze pointed conical helmet (pilos shape) with a thin dark green band and NO crest, face open and clearly visible (olive skin, short curly brown hair, a short brown beard, a thin pale scar on the left cheek, clear dark clever eyes, a half smile); a cream-white linen traveller's tunic reaching the knees with a deep green hem; a short emerald green cape pinned at the right shoulder with a round gold pin; a brown leather belt with a gold buckle; a brown leather satchel at the left hip and a small round water flask; brown leather bracers; brown leather sandal-boots laced to the calf; NO shield and NO armour. In his right hand a straight short sword with a silver blade and a simple gold hilt; in his left hand a plain dark-wood walking staff with a small green cloth tied below the top.
- REST: standing relaxed, facing the viewer, the sword pointing down, the walking staff planted beside him
- ATTACK: one step forward, the sword slashing forward, the staff held back
- HIT: upper body leaning backwards, eyes closed, the sword dropping, one hand raised
- PORT: Show the pointed bronze helmet, the scar on the cheek, the short beard, the green cape with the round gold pin and the cream collar.
- FRONT: Sword held ready in the right hand, walking staff in the left hand, satchel at the left hip.
- BACK: Show the short green cape, the satchel strap, the water flask, the sword and the walking staff.

## hero_ulixes_sag | Ulixes, Sagittarius

- ROLE: the same legendary hero Ulixes, now a master archer (Sagittarius)
- FMT: the finished 3-cell sheet of the same hero Ulixes in his base form: it shows the format; the new form keeps the same man's face but has new equipment
- INTRO: The attached image is the six-cell sprite sheet of the same hero Ulixes in his base form: the new form is THE SAME MAN, with the same face as always: olive skin, short curly brown hair, a short brown beard, a thin pale scar on the left cheek, clear dark clever eyes, but he has changed his equipment and bearing as described below. Use the attached image for the face, build, pixel size, outline, palette style and the six-cell layout, but do NOT copy his clothing, helmet or weapons.
- OUTFIT: He wears: an open bronze helmet with cheek guards, NO crest, a dark green band around it, the face fully open and clearly visible (the same face as always: olive skin, short curly brown hair, a short brown beard, a thin pale scar on the left cheek, clear dark clever eyes, a focused look); a medium armour of dark-brown leather with gold studs and emerald green trim over a cream linen tunic; shiny gold shoulder buckles; a LONG emerald green cape down to the calves pinned at the right shoulder with a round gold pin; a brown leather belt with a gold buckle and a short sword in a brown scabbard at the hip; a brown leather archer's bracer on the left forearm; brown leather boots laced to the knee; NO shield. In his left hand a big dark-wood recurve bow with gold tips and a green string. On his back a brown leather quiver full of arrows with green feathers.
- REST: standing relaxed, facing the viewer, the bow held low in his left hand
- ATTACK: standing with the body turned sideways, the bow drawn with an arrow nocked and aimed forward, the drawn bow kept close to the body and fully inside the cell
- HIT: upper body leaning backwards, eyes closed, the bow tilting, one hand raised
- PORT: Show the open bronze helmet with the green band, the scar on the cheek, the short beard, the gold shoulder buckle and the long green cape with the gold pin.
- FRONT: The recurve bow held ready in the left hand, the quiver with green-feathered arrows visible over his shoulder, the long green cape.
- BACK: Show the long green cape, the quiver full of green-feathered arrows on his back, the scabbard and the bow.

## hero_ulixes_ins | Ulixes, Insidiator

- ROLE: the same legendary hero Ulixes, now a cunning scout and shadow (Insidiator)
- FMT: the finished 3-cell sheet of the same hero Ulixes in his base form: it shows the format; the new form keeps the same man's face but has new equipment
- INTRO: The attached image is the six-cell sprite sheet of the same hero Ulixes in his base form: the new form is THE SAME MAN, with the same face as always: olive skin, short curly brown hair, a short brown beard, a thin pale scar on the left cheek, clear dark clever eyes, but he has changed his equipment and bearing as described below. Use the attached image for the face, build, pixel size, outline, palette style and the six-cell layout, but do NOT copy his clothing, helmet or weapons.
- OUTFIT: He wears: a dark purple bandana tied around his head INSTEAD of a helmet, short curly brown hair sticking out above it, the face fully open and clearly visible (the same face as always: olive skin, short curly brown hair, a short brown beard, a thin pale scar on the left cheek, clear dark clever eyes, a sly half smile); a medium armour of dark-purple and black leather with silver studs over a dark grey tunic; a LONG deep purple cape down to the calves with the hood folded back on his shoulders, pinned with a small silver pin; a black leather belt with a silver buckle, a small pouch and a second dagger in a sheath at the left hip; black leather bracers; dark leather boots; NO shield. In his right hand a straight dagger with a silver blade, held in reverse grip. A short wooden bow and a small quiver of dark arrows are slung across his back.
- REST: standing alert and slightly crouched, facing the viewer, the dagger held low
- ATTACK: one quick step forward, a fast low dagger slash across the body
- HIT: upper body leaning backwards, eyes closed, the dagger tilting, one hand raised
- PORT: Show the purple bandana, the scar on the cheek, the short beard, the silver pin and the folded-back hood of the long purple cape.
- FRONT: The dagger held ready in the right hand in reverse grip, the second dagger at the left hip, the short bow visible behind his shoulder.
- BACK: Show the long purple cape with the folded hood, the short bow and the dark quiver across his back and the sheathed dagger.

## hero_aeneas | Aeneas

- ROLE: legendary hero, the dutiful Trojan prince (infantry)
- FMT: the finished 3-cell sheet of the Greek recruit Ephebus: portrait, battle front, battle back
- INTRO: The attached image is a six-cell sprite sheet of a Greek soldier: it shows only the required LAYOUT, pose list, pixel size and level of detail. The new character is a legendary hero, NOT a soldier: entirely different clothing, colours and equipment as described below; do NOT copy the soldier's clothing, colours or shield.
- OUTFIT: He wears: NO helmet, short brown hair, face clearly visible (tanned skin, a short dark-brown beard, warm dark-brown eyes, a noble and calm look); a small gold pendant of a tiny household-god figure on a thin cord at his neck; a ceremonial shiny GOLD-bronze muscle cuirass with a gold lion-head emblem on the chest, over a white linen tunic with gold trim; a short skirt of dark red leather strips with gold studs; a LONG rich crimson cape down to the calves with a wide gold border, pinned at the right shoulder with a round gold brooch; gold bracers; a brown leather belt with a gold buckle; brown leather sandal-boots laced to the calf; NO shield. In his right hand a straight sword with a silver blade and a gold hilt.
- REST: standing upright and calm, facing the viewer, the sword pointing down in his right hand
- ATTACK: one step forward, the sword thrust forward, the long cape swinging behind him
- HIT: upper body leaning backwards, eyes closed, the sword dropping, one hand raised
- PORT: Show the bare head with short brown hair, the short beard, the gold pendant at the neck, the gold cuirass collar and the crimson cape with the round gold brooch.
- FRONT: Sword held ready in the right hand, the golden cuirass with the lion-head emblem, the long crimson cape.
- BACK: Show the long crimson cape with the gold border, the golden shoulder straps and the sword.

## hero_aeneas_dux | Aeneas, Dux Troianus

- ROLE: the same legendary hero Aeneas, now the Trojan commander (Dux Troianus)
- FMT: the finished 3-cell sheet of the same hero Aeneas in his base form: it shows the format; the new form keeps the same man's face but has new equipment
- INTRO: The attached image is the six-cell sprite sheet of the same hero Aeneas in his base form: the new form is THE SAME MAN, with the same face as always: tanned skin, short brown hair, a short dark-brown beard, warm dark-brown eyes, a small gold pendant of a tiny household-god figure on a thin cord at his neck, but he has changed his equipment and bearing as described below. Use the attached image for the face, build, pixel size, outline, palette style and the six-cell layout, but do NOT copy his clothing or weapons.
- OUTFIT: He wears: a shiny GOLD open-faced helmet with gold cheek guards and a tall bright crimson horsehair crest, the face fully open and clearly visible (the same face as always: tanned skin, short brown hair, a short dark-brown beard, warm dark-brown eyes, a small gold pendant of a tiny household-god figure on a thin cord at his neck, a commanding look); a ceremonial shiny GOLD muscle cuirass with a gold lion-head emblem and gold shoulder plates over a white tunic with gold trim; a crimson officer's sash tied around the waist; a short skirt of crimson leather strips with gold studs; a LONG rich crimson cape down to the calves with a wide gold border, pinned with a round gold brooch; gold greaves on both shins; gold bracers; brown leather sandals; NO shield. In his right hand a straight sword with a silver blade and a gold hilt, raised in command. In his left hand a short gold-tipped commander's staff.
- REST: standing tall and proud, facing the viewer, the sword resting on his shoulder
- ATTACK: one step forward, the sword pointing forward in command, the other hand raised
- HIT: upper body leaning backwards, eyes closed, the sword tilting, one hand raised
- PORT: Show the gold helmet with the tall crimson crest, the gold cheek guard, the short beard, the gold pendant and the crimson cape with the round gold brooch.
- FRONT: Sword raised in the right hand, the gold commander's staff in the left, the tall crimson crest.
- BACK: Show the tall crimson helmet crest, the long crimson cape with the gold border and the raised sword.

## hero_aeneas_pro | Aeneas, Propugnator

- ROLE: the same legendary hero Aeneas, now a heavy shield-bearing defender (Propugnator)
- FMT: the finished 3-cell sheet of the same hero Aeneas in his base form: it shows the format; the new form keeps the same man's face but has new equipment
- INTRO: The attached image is the six-cell sprite sheet of the same hero Aeneas in his base form: the new form is THE SAME MAN, with the same face as always: tanned skin, short brown hair, a short dark-brown beard, warm dark-brown eyes, a small gold pendant of a tiny household-god figure on a thin cord at his neck, but he has changed his equipment and bearing as described below. Use the attached image for the face, build, pixel size, outline, palette style and the six-cell layout, but do NOT copy his clothing or weapons.
- OUTFIT: He wears: a shiny bronze Corinthian-style helmet pushed back so that the face is fully open and clearly visible (the same face as always: tanned skin, short brown hair, a short dark-brown beard, warm dark-brown eyes, a small gold pendant of a tiny household-god figure on a thin cord at his neck, a determined look), with a short dark crimson crest; a heavy armour of overlapping LIGHT SILVER-GREY metal scales with gold shoulder plates over a white tunic with gold trim; a short skirt of crimson leather strips; a crimson cape down to the knees pinned with a round gold brooch; shiny bronze greaves on both shins; a brown leather belt with a gold buckle; brown leather sandals. In his left hand a big ROUND bronze shield with a wide gold rim and a saturated crimson field showing a gold flame as emblem. In his right hand a short thick spear with a silver leaf-shaped head.
- REST: standing firmly, facing the viewer, the big round shield at his left side, the spear held upright beside him
- ATTACK: one step forward, the spear thrust forward over the top of the raised round shield
- HIT: upper body leaning backwards, eyes closed, the shield sagging, the spear tilting
- PORT: Show the bronze helmet pushed back with the short crimson crest, the short beard, the gold pendant, the silver scale armour and the gold shoulder plate.
- FRONT: The big round shield with the gold flame raised on the left arm, the spear held ready in the right hand.
- BACK: Show the back of the big round bronze shield, the crimson cape, the helmet crest and the spear.

## hero_ulixes_sag_pr | Ulixes, Arcitenens

- ROLE: the same legendary hero Ulixes, now the prestige archer Arcitenens (the bow-bearer, favoured by Apollo)
- FMT: the finished 3-cell sheet of the same hero Ulixes in his specialisation form: it shows the format; the new prestige form keeps the same man's face but has richer equipment
- INTRO: The attached image is the six-cell sprite sheet of the same hero Ulixes in his specialisation form: the new form is THE SAME MAN, with the same face as always: olive skin, short curly brown hair, a short brown beard, a thin pale scar on the left cheek, clear dark clever eyes, now at the height of his legend (prestige form): richer and more impressive than before, with finer gold or silver details, a more splendid cape and a faint glow around him, as described below. Use the attached image for the face, build, pixel size, outline, palette style and the six-cell layout, but do NOT copy his old clothing or weapons.
- OUTFIT: He wears: a tall shiny GOLD open-faced helmet with gold cheek guards and a crest of two tall emerald-green feathers, the face fully open and clearly visible (the same face as always: olive skin, short curly brown hair, a short brown beard, a thin pale scar on the left cheek, clear dark clever eyes, a calm, confident look); a ceremonial armour of shiny GOLD plates with emerald green enamel inlays and a small sun emblem on the chest, over a cream tunic with gold trim; gold shoulder plates; a LONG, rich, shimmering GOLDEN cape down to the ground with an emerald green lining and a wide gold border, pinned with a large round gold sun brooch; gold bracers; a brown leather belt with a gold buckle and a short sword in a gold-trimmed scabbard; gold-trimmed brown leather boots laced to the knee; NO shield. In his left hand a magnificent recurve bow of golden wood with gold tips and a glowing gold string. On his back a gold-trimmed quiver full of arrows with golden feathers. Around the figure a faint glow: a few tiny sparkle pixels, kept close to the body and completely inside the cell.
- REST: standing tall and calm, facing the viewer, the golden bow held low in his left hand
- ATTACK: standing with the body turned sideways, the golden bow drawn with a glowing golden arrow nocked and aimed forward, the drawn bow kept close to the body and fully inside the cell
- HIT: upper body leaning backwards, eyes closed, the bow tilting, one hand raised
- PORT: Show the tall gold helmet with the two green feathers, the scar on the cheek, the short beard, the gold plates with the sun emblem and the golden cape with the large gold sun brooch.
- FRONT: The golden bow held ready in the left hand, the gold quiver visible over his shoulder, the long golden cape.
- BACK: Show the long golden cape with the green lining, the gold quiver full of golden-feathered arrows, the scabbard and the bow.

## hero_ulixes_ins_pr | Ulixes, Callidus

- ROLE: the same legendary hero Ulixes, now the prestige scout Callidus (the master of cunning)
- FMT: the finished 3-cell sheet of the same hero Ulixes in his specialisation form: it shows the format; the new prestige form keeps the same man's face but has richer equipment
- INTRO: The attached image is the six-cell sprite sheet of the same hero Ulixes in his specialisation form: the new form is THE SAME MAN, with the same face as always: olive skin, short curly brown hair, a short brown beard, a thin pale scar on the left cheek, clear dark clever eyes, now at the height of his legend (prestige form): richer and more impressive than before, with finer gold or silver details, a more splendid cape and a faint glow around him, as described below. Use the attached image for the face, build, pixel size, outline, palette style and the six-cell layout, but do NOT copy his old clothing or weapons.
- OUTFIT: He wears: a dark purple silk headband with a small silver ornament over his forehead INSTEAD of a helmet, short curly brown hair sticking out above it, the face fully open and clearly visible (the same face as always: olive skin, short curly brown hair, a short brown beard, a thin pale scar on the left cheek, clear dark clever eyes, a sly knowing smile); a ceremonial armour of black and deep-purple plates with polished silver trim, silver studs and a silver crescent emblem on the chest, over a dark grey tunic; silver shoulder plates; a LONG, rich, deep PURPLE cape down to the calves with a violet star-patterned lining and a silver border, the hood folded back on his shoulders, pinned with a large round silver brooch; a black leather belt with a silver buckle and a pouch; silver-trimmed black bracers; dark leather boots with silver trim; NO shield. In his right hand a long straight dagger with a polished silver blade and a violet gem in the hilt, held in reverse grip; a second matching dagger at the left hip. A short elegant bow with silver tips and a small quiver of dark arrows are slung across his back. Around the figure a faint glow: a few tiny sparkle pixels, kept close to the body and completely inside the cell.
- REST: standing alert and slightly crouched, facing the viewer, the silver dagger held low
- ATTACK: one quick step forward, a fast low slash of the silver dagger across the body
- HIT: upper body leaning backwards, eyes closed, the dagger tilting, one hand raised
- PORT: Show the purple headband with the silver ornament, the scar on the cheek, the short beard, the silver plates with the crescent emblem and the purple cape with the large silver brooch.
- FRONT: The silver dagger held ready in the right hand in reverse grip, the second dagger at the left hip, the silver-tipped bow visible behind his shoulder.
- BACK: Show the long purple cape with the folded hood and the star-patterned lining, the silver-tipped bow and the dark quiver across his back.

## hero_aeneas_dux_pr | Aeneas, Conditor

- ROLE: the same legendary hero Aeneas, now the prestige commander Conditor (the founder, bringer of the household gods)
- FMT: the finished 3-cell sheet of the same hero Aeneas in his specialisation form: it shows the format; the new prestige form keeps the same man's face but has richer equipment
- INTRO: The attached image is the six-cell sprite sheet of the same hero Aeneas in his specialisation form: the new form is THE SAME MAN, with the same face as always: tanned skin, short brown hair, a short dark-brown beard, warm dark-brown eyes, a small gold pendant of a tiny household-god figure on a thin cord at his neck, now at the height of his legend (prestige form): richer and more impressive than before, with finer gold or silver details, a more splendid cape and a faint glow around him, as described below. Use the attached image for the face, build, pixel size, outline, palette style and the six-cell layout, but do NOT copy his old clothing or weapons.
- OUTFIT: He wears: a shiny GOLD laurel wreath on his short brown hair INSTEAD of a helmet, the face fully open and clearly visible (the same face as always: tanned skin, short brown hair, a short dark-brown beard, warm dark-brown eyes, a small gold pendant of a tiny household-god figure on a thin cord at his neck, a noble and wise look); a full ceremonial armour of shiny GOLD with engraved city walls and a large gold lion-head emblem on the chest, over a white tunic with gold embroidery; large gold shoulder plates; a crimson officer's sash with gold fringe; a skirt of crimson leather strips with gold studs; a LONG, very rich crimson cape down to the ground with a white lining, wide gold embroidery and a large round gold brooch; gold greaves and gold bracers; gold-trimmed brown sandals; NO shield. In his right hand a straight sword with a polished silver blade and an ornate gold hilt, raised high. In his left hand a small shining gold statuette of a household god, held up like a sacred light. Around the figure a faint glow: a few tiny sparkle pixels, kept close to the body and completely inside the cell.
- REST: standing tall and noble, facing the viewer, the sword resting on his shoulder, the golden statuette held at his side
- ATTACK: one step forward, the sword pointing forward in command, the golden statuette held up in the other hand
- HIT: upper body leaning backwards, eyes closed, the sword tilting, one hand raised
- PORT: Show the gold laurel wreath, the short brown hair, the short beard, the gold pendant, the large gold shoulder plates and the crimson cape with the large gold brooch.
- FRONT: Sword raised in the right hand, the small gold household-god statuette held up in the left, the gold armour with the lion-head emblem.
- BACK: Show the long crimson cape with the gold embroidery, the gold laurel wreath and the raised sword.

## hero_aeneas_pro_pr | Aeneas, Pius

- ROLE: the same legendary hero Aeneas, now the prestige defender Pius (the dutiful one, carrying his father and his city's hope)
- FMT: the finished 3-cell sheet of the same hero Aeneas in his specialisation form: it shows the format; the new prestige form keeps the same man's face but has richer equipment
- INTRO: The attached image is the six-cell sprite sheet of the same hero Aeneas in his specialisation form: the new form is THE SAME MAN, with the same face as always: tanned skin, short brown hair, a short dark-brown beard, warm dark-brown eyes, a small gold pendant of a tiny household-god figure on a thin cord at his neck, now at the height of his legend (prestige form): richer and more impressive than before, with finer gold or silver details, a more splendid cape and a faint glow around him, as described below. Use the attached image for the face, build, pixel size, outline, palette style and the six-cell layout, but do NOT copy his old clothing or weapons.
- OUTFIT: He wears: a tall shiny GOLD open-faced helmet with gold cheek guards and a tall white-and-crimson horsehair crest, the face fully open and clearly visible (the same face as always: tanned skin, short brown hair, a short dark-brown beard, warm dark-brown eyes, a small gold pendant of a tiny household-god figure on a thin cord at his neck, a determined and devout look); a magnificent armour of overlapping polished SILVER-WHITE scales with gold trim and large gold shoulder plates over a white tunic with gold embroidery; a skirt of crimson leather strips with gold studs; a crimson cape down to the calves with a wide gold border, pinned with a large round gold brooch; gold greaves; gold-trimmed sandals. In his left hand a huge ROUND, mirror-polished silver-gold shield with a wide ornate gold rim and a glowing gold flame emblem in the centre with short gold rays around it. In his right hand a spear with a long polished silver head and a gold-banded shaft. Around the figure a faint glow: a few tiny sparkle pixels, kept close to the body and completely inside the cell.
- REST: standing firmly, facing the viewer, the huge shining shield at his left side, the spear held upright beside him
- ATTACK: one step forward, the spear thrust forward over the top of the raised shining shield
- HIT: upper body leaning backwards, eyes closed, the shield sagging, the spear tilting
- PORT: Show the tall gold helmet with the white-and-crimson crest, the short beard, the gold pendant, the silver scale armour and the large gold shoulder plate.
- FRONT: The huge shining round shield with the glowing gold flame raised on the left arm, the spear held ready in the right hand.
- BACK: Show the back of the huge round shield with its gold rim, the crimson cape, the tall crest and the spear.

## hero_romulus | Romulus

- ROLE: legendary hero, the founder of Rome, raised by a she-wolf (infantry)
- FMT: the finished 3-cell sheet of the Greek recruit Ephebus: portrait, battle front, battle back
- INTRO: The attached image is a six-cell sprite sheet of a Greek soldier: it shows only the required LAYOUT, pose list, pixel size and level of detail. The new character is a legendary hero, NOT a soldier: entirely different clothing, colours and equipment as described below; do NOT copy the soldier's clothing, colours or shield.
- OUTFIT: He wears: NO helmet, wild untidy jet-black hair, a clean-shaven youthful face clearly visible (fair skin, sharp dark eyes, a fierce and proud look); a grey wolf-pelt draped over his left shoulder with the wolf's head resting on his chest; a ceremonial dark-bronze breastplate with a gold wolf-head emblem over a rust-orange tunic; a skirt of dark-brown leather strips with bronze studs; a SHORT bright red cape pinned at the right shoulder with a round bronze brooch; bronze bracers; a brown leather belt with a bronze buckle; brown leather sandal-boots laced to the calf; NO shield. In his right hand a straight sword with a silver blade and a bronze hilt.
- REST: standing upright and proud, facing the viewer, the sword pointing down in his right hand
- ATTACK: one step forward, the sword thrust forward, the short red cape swinging behind him
- HIT: upper body leaning backwards, eyes closed, the sword dropping, one hand raised
- PORT: Show the wild black hair, the clean-shaven face, the grey wolf-pelt on the shoulder with the wolf's head, the bronze breastplate collar and the short red cape with the round bronze brooch.
- FRONT: Sword held ready in the right hand, the bronze breastplate with the gold wolf-head emblem, the wolf-pelt on his left shoulder.
- BACK: Show the short red cape, the grey wolf-pelt over the shoulder and the sword.

## hero_romulus_rex | Romulus, Rex

- ROLE: the same legendary hero Romulus, now the king and commander (Rex)
- FMT: the finished 3-cell sheet of the same hero Romulus in his base form: it shows the format; the new form keeps the same man's face but has new equipment
- INTRO: The attached image is the six-cell sprite sheet of the same hero Romulus in his base form: the new form is THE SAME MAN, with the same face as always: fair skin, wild untidy jet-black hair, a clean-shaven youthful face, sharp dark eyes, a grey wolf-pelt draped over his left shoulder with the wolf's head resting on his chest, but he has changed his equipment and bearing as described below. Use the attached image for the face, build, pixel size, outline, palette style and the six-cell layout, but do NOT copy his old clothing or weapons.
- OUTFIT: He wears: a wreath of green laurel leaves with a small gold clasp on his wild jet-black hair INSTEAD of a helmet, the face fully open and clearly visible (the same face as always: fair skin, wild untidy jet-black hair, a clean-shaven youthful face, sharp dark eyes, a grey wolf-pelt draped over his left shoulder with the wolf's head resting on his chest, a regal look); a shiny GOLD muscle cuirass with a wolf-head emblem over a white tunic with a broad purple stripe; gold shoulder plates; a purple officer's sash around the waist; a skirt of white leather strips with gold studs; a LONG deep red cape down to the calves with a purple lining and a gold border, pinned with a round gold brooch; gold bracers; gold-trimmed sandals; NO shield. In his right hand a straight sword with a silver blade and a gold hilt, raised in command. In his left hand an ivory royal sceptre topped with a small gold eagle.
- REST: standing tall and regal, facing the viewer, the sword resting on his shoulder, the sceptre at his side
- ATTACK: one step forward, the sword pointing forward in command, the sceptre raised in the other hand
- HIT: upper body leaning backwards, eyes closed, the sword tilting, one hand raised
- PORT: Show the green laurel wreath, the wild black hair, the wolf-pelt on the shoulder, the gold cuirass collar and the red cape with the round gold brooch.
- FRONT: Sword raised in the right hand, the ivory sceptre with the gold eagle in the left, the wolf-pelt on his shoulder.
- BACK: Show the long red cape with the purple lining, the laurel wreath, the wolf-pelt and the raised sword.

## hero_romulus_bel | Romulus, Bellator

- ROLE: the same legendary hero Romulus, now a heavy warrior who strikes mighty blows (Bellator)
- FMT: the finished 3-cell sheet of the same hero Romulus in his base form: it shows the format; the new form keeps the same man's face but has new equipment
- INTRO: The attached image is the six-cell sprite sheet of the same hero Romulus in his base form: the new form is THE SAME MAN, with the same face as always: fair skin, wild untidy jet-black hair, a clean-shaven youthful face, sharp dark eyes, a grey wolf-pelt draped over his left shoulder with the wolf's head resting on his chest, but he has changed his equipment and bearing as described below. Use the attached image for the face, build, pixel size, outline, palette style and the six-cell layout, but do NOT copy his old clothing or weapons.
- OUTFIT: He wears: the head of the grey wolf-pelt pulled over his wild jet-black hair like a hood with its ears up, the face fully open and clearly visible (the same face as always: fair skin, wild untidy jet-black hair, a clean-shaven youthful face, sharp dark eyes, a grey wolf-pelt draped over his left shoulder with the wolf's head resting on his chest, a ferocious look); a heavy dark-bronze cuirass with large bronze shoulder plates, bare muscular arms with heavy bronze bracers; the grey wolf-pelt cape over his shoulders; a thick red leather war-belt with a bronze buckle; a skirt of heavy brown leather strips with iron studs; a SHORT torn red sash hanging from the belt; bronze greaves and heavy leather boots; NO shield. In both hands a huge two-handed greatsword with a wide silver blade and a bronze crossguard.
- REST: standing wide-legged and powerful, facing the viewer, the huge greatsword resting on his shoulder
- ATTACK: a heavy overhead swing of the greatsword, the blade high above his head and coming down, kept fully inside the cell
- HIT: upper body leaning backwards, eyes closed, the greatsword dropping, one hand raised
- PORT: Show the wolf-head hood over the wild black hair, the ferocious face, the heavy bronze shoulder plates and the wolf-pelt.
- FRONT: The huge greatsword held in both hands in front of him, the heavy bronze armour, the wolf-pelt over his shoulders.
- BACK: Show the grey wolf-pelt cape, the heavy bronze shoulder plates and the huge greatsword held at his side.

## hero_romulus_rex_pr | Romulus, Quirinus

- ROLE: the same legendary hero Romulus, now the prestige form Quirinus (the deified king, taken up among the gods)
- FMT: the finished 3-cell sheet of the same hero Romulus in his specialisation form: it shows the format; the new prestige form keeps the same man's face but has richer equipment
- INTRO: The attached image is the six-cell sprite sheet of the same hero Romulus in his specialisation form: the new form is THE SAME MAN, with the same face as always: fair skin, wild untidy jet-black hair, a clean-shaven youthful face, sharp dark eyes, a grey wolf-pelt draped over his left shoulder with the wolf's head resting on his chest, now at the height of his legend (prestige form): richer and more impressive than before, with finer details, a more splendid cape and a glow around him, as described below. Use the attached image for the face, build, pixel size, outline, palette style and the six-cell layout, but do NOT copy his old clothing or weapons.
- OUTFIT: He wears: a wreath of shining golden laurel leaves on his wild jet-black hair, the face fully open and clearly visible (the same face as always: fair skin, wild untidy jet-black hair, a clean-shaven youthful face, sharp dark eyes, a grey wolf-pelt draped over his left shoulder with the wolf's head resting on his chest, a serene godlike look); a magnificent armour of polished WHITE and GOLD plates with a gold wolf-head emblem and a small gold star on the chest, over a white tunic with gold embroidery; large gold shoulder plates; a LONG, rich, shimmering WHITE cape down to the ground with a wide gold border, a gold lining and a large round gold brooch; a white wolf-pelt over his left shoulder; gold bracers and gold greaves; gold-trimmed white sandals; NO shield. In his right hand a long golden spear with a white-gold leaf-shaped head, held upright. A soft white-gold glow shines around him. Around the figure a faint glow: a few tiny sparkle pixels, kept close to the body and completely inside the cell.
- REST: standing tall and serene, facing the viewer, the golden spear held upright beside him
- ATTACK: one step forward, the golden spear thrust forward, the long white cape swinging behind him
- HIT: upper body leaning backwards, eyes closed, the spear tilting, one hand raised
- PORT: Show the golden laurel wreath, the wild black hair, the white wolf-pelt, the white-and-gold armour collar with the small star and the white cape with the large gold brooch.
- FRONT: The golden spear held upright in the right hand, the white-and-gold armour with the wolf-head emblem, the white cape.
- BACK: Show the long white cape with the gold border, the golden laurel wreath, the white wolf-pelt and the golden spear.

## hero_romulus_bel_pr | Romulus, Martis filius

- ROLE: the same legendary hero Romulus, now the prestige form Martis filius (the son of Mars, god of war)
- FMT: the finished 3-cell sheet of the same hero Romulus in his specialisation form: it shows the format; the new prestige form keeps the same man's face but has richer equipment
- INTRO: The attached image is the six-cell sprite sheet of the same hero Romulus in his specialisation form: the new form is THE SAME MAN, with the same face as always: fair skin, wild untidy jet-black hair, a clean-shaven youthful face, sharp dark eyes, a grey wolf-pelt draped over his left shoulder with the wolf's head resting on his chest, now at the height of his legend (prestige form): richer and more impressive than before, with finer details, a more splendid cape and a glow around him, as described below. Use the attached image for the face, build, pixel size, outline, palette style and the six-cell layout, but do NOT copy his old clothing or weapons.
- OUTFIT: He wears: a bronze helmet shaped like a wolf's head, pushed up so that the face is fully open and clearly visible (the same face as always: fair skin, wild untidy jet-black hair, a clean-shaven youthful face, sharp dark eyes, a grey wolf-pelt draped over his left shoulder with the wolf's head resting on his chest, a burning, fearless look), with a tall crest of flame-red horsehair; a heavy armour of polished BRONZE and blood-RED plates with large spiked bronze shoulder plates and a glowing gold wolf-head emblem on the chest; the grey wolf-pelt over his left shoulder; a LONG blood-red cape down to the calves with a bronze border and a round bronze brooch; bronze bracers with red gems; bronze greaves; heavy bronze-studded boots; NO shield. In both hands a huge two-handed greatsword with a wide silver blade that glows red-hot along its edge and a bronze crossguard. Faint red embers and sparks float around him. Around the figure a faint glow: a few tiny sparkle pixels, kept close to the body and completely inside the cell.
- REST: standing wide-legged and fearsome, facing the viewer, the glowing greatsword resting on his shoulder
- ATTACK: a heavy overhead swing of the glowing greatsword, the blade high above his head and coming down, kept fully inside the cell
- HIT: upper body leaning backwards, eyes closed, the greatsword dropping, one hand raised
- PORT: Show the bronze wolf-head helmet with the flame-red crest, the fearless face, the spiked bronze shoulder plates and the wolf-pelt.
- FRONT: The huge glowing greatsword held in both hands in front of him, the bronze-and-red armour with the glowing wolf-head emblem, the long red cape.
- BACK: Show the long blood-red cape with the bronze border, the red-crested wolf helmet, the wolf-pelt and the glowing greatsword.

## hero_horatius | Horatius Cocles

- ROLE: legendary hero, the one-eyed defender of the bridge (infantry)
- FMT: the finished 3-cell sheet of the Greek recruit Ephebus: portrait, battle front, battle back
- INTRO: The attached image is a six-cell sprite sheet of a Greek soldier: it shows only the required LAYOUT, pose list, pixel size and level of detail. The new character is a legendary hero, NOT a soldier: entirely different clothing, colours and equipment as described below; do NOT copy the soldier's clothing, colours or shield.
- OUTFIT: He wears: an open iron-grey helmet with cheek guards and a short crest of black horsehair, the face open and clearly visible (olive skin, a thick black moustache, a black leather eyepatch over his LEFT eye, a stern weathered face with a strong jaw, one dark eye clearly visible); a medium armour of an iron-grey steel chest plate over a dark-brown leather jerkin with steel studs; a SHORT bright red cape pinned at the right shoulder with a round iron brooch; a skirt of dark-brown leather strips; steel bracers; a brown leather belt with an iron buckle; dark leather boots laced to the calf; NO shield. In his right hand a straight sword with a silver blade and an iron hilt.
- REST: standing firmly, facing the viewer, the sword pointing down in his right hand
- ATTACK: one step forward, the sword thrust forward, the short red cape swinging behind him
- HIT: upper body leaning backwards, eyes closed, the sword dropping, one hand raised
- PORT: Show the iron helmet with the black crest, the black eyepatch over the left eye, the thick black moustache, the steel chest plate collar and the short red cape with the iron brooch.
- FRONT: Sword held ready in the right hand, the iron-grey chest plate, the eyepatch clearly visible.
- BACK: Show the short red cape, the iron helmet crest and the sword.

## hero_horatius_cus | Horatius, Custos Pontis

- ROLE: the same legendary hero Horatius Cocles, now the heavy bridge guardian (Custos Pontis)
- FMT: the finished 3-cell sheet of the same hero Horatius Cocles in his base form: it shows the format; the new form keeps the same man's face but has new equipment
- INTRO: The attached image is the six-cell sprite sheet of the same hero Horatius Cocles in his base form: the new form is THE SAME MAN, with the same face as always: olive skin, short black hair, a thick black moustache, a black leather eyepatch over his LEFT eye, a stern weathered face with a strong jaw, but he has changed his equipment and bearing as described below. Use the attached image for the face, build, pixel size, outline, palette style and the six-cell layout, but do NOT copy his old clothing or weapons.
- OUTFIT: He wears: a heavy iron-grey Corinthian-style helmet pushed back so the face is fully open and clearly visible (the same face as always: olive skin, short black hair, a thick black moustache, a black leather eyepatch over his LEFT eye, a stern weathered face with a strong jaw, a grim and unmoving look), with a tall black horsehair crest; a heavy armour of overlapping iron-grey steel scales with large steel shoulder plates over a dark-blue tunic; a short bright red cape pinned with an iron brooch; steel greaves and heavy steel bracers; heavy dark leather boots. In his left hand a big ROUND iron-rimmed shield painted deep blue with a golden arched bridge as emblem. In his right hand a strong spear with a silver leaf-shaped head.
- REST: standing like an immovable wall, facing the viewer, the big round shield at his left side, the spear held upright beside him
- ATTACK: one step forward, the spear thrust forward over the top of the raised shield
- HIT: upper body leaning backwards, eyes closed, the shield sagging, the spear tilting
- PORT: Show the iron helmet with the black crest, the black eyepatch, the thick moustache, the steel scale armour and the heavy shoulder plate.
- FRONT: The big round blue shield with the golden bridge raised on the left arm, the spear held ready in the right hand.
- BACK: Show the back of the big round iron-rimmed shield, the short red cape, the black helmet crest and the spear.

## hero_horatius_pug | Horatius, Pugnator

- ROLE: the same legendary hero Horatius Cocles, now a fierce two-handed fighter who cuts the bridge down (Pugnator)
- FMT: the finished 3-cell sheet of the same hero Horatius Cocles in his base form: it shows the format; the new form keeps the same man's face but has new equipment
- INTRO: The attached image is the six-cell sprite sheet of the same hero Horatius Cocles in his base form: the new form is THE SAME MAN, with the same face as always: olive skin, short black hair, a thick black moustache, a black leather eyepatch over his LEFT eye, a stern weathered face with a strong jaw, but he has changed his equipment and bearing as described below. Use the attached image for the face, build, pixel size, outline, palette style and the six-cell layout, but do NOT copy his old clothing or weapons.
- OUTFIT: He wears: NO helmet, a wide red headband over his short black hair, the face fully open and clearly visible (the same face as always: olive skin, short black hair, a thick black moustache, a black leather eyepatch over his LEFT eye, a stern weathered face with a strong jaw, a fierce, roaring look); an iron-grey steel chest plate strapped over a bare muscular torso, one large steel shoulder plate on the right shoulder, bare muscular arms with heavy steel bracers; a thick brown leather war-belt with an iron buckle; a skirt of dark-brown leather strips; a SHORT torn red sash hanging from the belt; steel greaves and dark leather boots; NO shield. In both hands a huge two-handed woodcutter's battle-axe with a long dark wooden handle and a broad, wide steel blade.
- REST: standing wide-legged and powerful, facing the viewer, the huge battle-axe resting on his shoulder
- ATTACK: a heavy overhead chop of the battle-axe, the axe high above his head and coming down, kept fully inside the cell
- HIT: upper body leaning backwards, eyes closed, the axe dropping, one hand raised
- PORT: Show the red headband, the black eyepatch, the thick moustache, the roaring face, the steel shoulder plate and the steel chest plate.
- FRONT: The huge battle-axe held in both hands in front of him, the steel chest plate, the bare muscular arms.
- BACK: Show the steel shoulder plate, the torn red sash and the huge battle-axe held at his side.

## hero_horatius_cus_pr | Horatius, Servator Urbis

- ROLE: the same legendary hero Horatius Cocles, now the prestige guardian Servator Urbis (the saviour of the city)
- FMT: the finished 3-cell sheet of the same hero Horatius Cocles in his specialisation form: it shows the format; the new prestige form keeps the same man's face but has richer equipment
- INTRO: The attached image is the six-cell sprite sheet of the same hero Horatius Cocles in his specialisation form: the new form is THE SAME MAN, with the same face as always: olive skin, short black hair, a thick black moustache, a black leather eyepatch over his LEFT eye, a stern weathered face with a strong jaw, now at the height of his legend (prestige form): richer and more impressive than before, with finer details, a more splendid cape and a glow around him, as described below. Use the attached image for the face, build, pixel size, outline, palette style and the six-cell layout, but do NOT copy his old clothing or weapons.
- OUTFIT: He wears: a tall polished SILVER-STEEL Corinthian helmet pushed back so the face is fully open and clearly visible (the same face as always: olive skin, short black hair, a thick black moustache, a black leather eyepatch over his LEFT eye, a stern weathered face with a strong jaw, a calm and unbreakable look), with a very tall crest of white and black horsehair; a magnificent armour of polished silver-steel scales with gold trim and large gold-edged shoulder plates over a deep blue tunic with gold embroidery; a LONG, rich bright red cape down to the calves with a gold border and a large round gold brooch; silver-steel greaves and gold-trimmed bracers. In his left hand a huge ROUND mirror-polished steel shield with a wide gold rim and a glowing golden arched bridge in front of a golden city wall as emblem. In his right hand a long spear with a polished silver head and a gold-banded shaft. Around the figure a faint glow: a few tiny sparkle pixels, kept close to the body and completely inside the cell.
- REST: standing like an immovable wall, facing the viewer, the huge shining shield at his left side, the spear held upright beside him
- ATTACK: one step forward, the spear thrust forward over the top of the raised shining shield
- HIT: upper body leaning backwards, eyes closed, the shield sagging, the spear tilting
- PORT: Show the tall silver helmet with the white-and-black crest, the black eyepatch, the thick moustache, the silver scale armour and the gold-edged shoulder plate.
- FRONT: The huge shining round shield with the golden bridge and city wall raised on the left arm, the spear held ready in the right hand.
- BACK: Show the back of the huge round shield with its gold rim, the long red cape with the gold border, the tall crest and the spear.

## hero_horatius_pug_pr | Horatius, Heros Tiberis

- ROLE: the same legendary hero Horatius Cocles, now the prestige form Heros Tiberis (the hero of the river Tiber, who swam through the flood)
- FMT: the finished 3-cell sheet of the same hero Horatius Cocles in his specialisation form: it shows the format; the new prestige form keeps the same man's face but has richer equipment
- INTRO: The attached image is the six-cell sprite sheet of the same hero Horatius Cocles in his specialisation form: the new form is THE SAME MAN, with the same face as always: olive skin, short black hair, a thick black moustache, a black leather eyepatch over his LEFT eye, a stern weathered face with a strong jaw, now at the height of his legend (prestige form): richer and more impressive than before, with finer details, a more splendid cape and a glow around him, as described below. Use the attached image for the face, build, pixel size, outline, palette style and the six-cell layout, but do NOT copy his old clothing or weapons.
- OUTFIT: He wears: a wide deep-blue headband with a small silver wave ornament over his short black hair, the face fully open and clearly visible (the same face as always: olive skin, short black hair, a thick black moustache, a black leather eyepatch over his LEFT eye, a stern weathered face with a strong jaw, a triumphant roaring look); a heavy armour of polished steel and teal-blue plates with an engraved wave pattern and a silver wave emblem on the chest, large steel shoulder plates with blue gems; a LONG teal-blue cape down to the calves with a white foam-pattern border, pinned with a round silver brooch; a thick blue-and-silver war-belt; steel greaves and bracers with blue gems. In both hands a huge two-handed battle-axe with a long dark wooden handle and a broad steel blade whose edge shimmers with flowing blue water. Small blue water drops and sparks float around him. Around the figure a faint glow: a few tiny sparkle pixels, kept close to the body and completely inside the cell.
- REST: standing wide-legged and powerful, facing the viewer, the huge battle-axe resting on his shoulder
- ATTACK: a heavy overhead chop of the battle-axe, the axe high above his head and coming down, kept fully inside the cell
- HIT: upper body leaning backwards, eyes closed, the axe dropping, one hand raised
- PORT: Show the blue headband with the wave ornament, the black eyepatch, the thick moustache, the triumphant face, the engraved teal armour and the steel shoulder plate with the blue gem.
- FRONT: The huge battle-axe with the shimmering blue edge held in both hands in front of him, the teal-and-steel armour with the silver wave emblem.
- BACK: Show the long teal-blue cape with the foam border, the steel shoulder plates and the battle-axe held at his side.

## hero_cloelia | Cloelia

- ROLE: legendary hero, the brave Roman maiden who escaped the enemy camp on horseback (cavalry rider)
- FMT: the finished 3-cell sheet of the Greek recruit Ephebus: portrait, battle front, battle back
- INTRO: The attached image is a six-cell sprite sheet of a Greek soldier: it shows only the required LAYOUT, pose list, pixel size and level of detail. The new character is a legendary hero, a young woman and NOT a soldier: entirely different clothing, colours and equipment as described below; do NOT copy the soldier's clothing, colours or shield.
- OUTFIT: She wears: NO helmet, a long thick brown braid with a small blue ribbon at its end hanging over her right shoulder, the face clearly visible (fair skin, bright hazel eyes, a determined, youthful and fearless look); a cream-white linen tunic-robe reaching the knees with a sky-blue hem and short sleeves; a SHORT bright sky-blue cape pinned at the left shoulder with a small round bronze brooch; a brown leather belt with a bronze buckle; light brown leather bracers; brown leather sandal-boots laced to the calf; NO armour and NO shield. In her right hand a slim straight sword with a silver blade and a bronze hilt.
- REST: standing upright and alert, facing the viewer, the sword pointing down in her right hand
- ATTACK: one step forward, the sword thrust forward, the short blue cape swinging behind her
- HIT: upper body leaning backwards, eyes closed, the sword dropping, one hand raised
- PORT: Show the long brown braid with the blue ribbon, the determined young face, the cream robe collar and the short sky-blue cape with the round bronze brooch.
- FRONT: Sword held ready in the right hand, the brown braid over her right shoulder, the sky-blue cape.
- BACK: Show the long brown braid hanging down her back, the short sky-blue cape and the sword.

## hero_cloelia_eq | Cloelia, Equitissa

- ROLE: the same legendary hero Cloelia, now a mounted rider (Equitissa), cavalry
- FMT: the finished 3-cell sheet of the same hero Cloelia in her base form: it shows the format; the new form keeps the same young woman's face but has new equipment
- INTRO: The attached image is the six-cell sprite sheet of the same hero Cloelia in her base form: the new form is THE SAME YOUNG WOMAN, with the same face as always: fair skin, a long thick brown braid with a small blue ribbon at its end, bright hazel eyes, a determined, youthful and fearless young woman's face, but she has changed her equipment and bearing as described below. Use the attached image for the face, build, pixel size, outline, palette style and the six-cell layout, but do NOT copy her old clothing or weapons.
- OUTFIT: She is a rider on a horse. The rider and the horse are drawn as ONE whole figure; the horse fills the cell, but the margin requirement still holds. The horse is snow-white with a flowing light-grey mane and tail, a sky-blue saddle blanket with a gold border and brown leather harness with bronze buckles. The rider wears: an open bronze helmet with cheek guards and a short sky-blue crest, the braid hanging out at the back, the face fully open and clearly visible (the same face as always: fair skin, a long thick brown braid with a small blue ribbon at its end, bright hazel eyes, a determined, youthful and fearless young woman's face, a bold look); a medium armour of light-brown leather with bronze studs and blue trim over a cream tunic; a short sky-blue cape flowing behind her; bronze bracers; brown leather riding boots. In her left hand a small ROUND shield painted sky-blue with a white wing as emblem and a bronze rim. In her right hand a slim lance with a silver head and a small blue pennant.
- REST: the horse standing still, the rider upright in the saddle facing the viewer, the lance held upright at her side
- ATTACK: the horse taking a step forward, the rider leaning forward and thrusting the lance forward, shield raised
- HIT: the horse stepping back and tossing its head, the rider leaning backwards with eyes closed, shield sagging
- PORT: Show the open bronze helmet with the sky-blue crest, the braid, the bold young face and the short blue cape.
- FRONT: Horse and rider facing the viewer, the lance upright in her right hand, the round blue shield on her left arm.
- BACK: Show the horse from behind with its tail, the rider's short blue cape, the braid and the lance.

## hero_cloelia_exp | Cloelia, Explorata

- ROLE: the same legendary hero Cloelia, now a swimming scout and pathfinder (Explorata)
- FMT: the finished 3-cell sheet of the same hero Cloelia in her base form: it shows the format; the new form keeps the same young woman's face but has new equipment
- INTRO: The attached image is the six-cell sprite sheet of the same hero Cloelia in her base form: the new form is THE SAME YOUNG WOMAN, with the same face as always: fair skin, a long thick brown braid with a small blue ribbon at its end, bright hazel eyes, a determined, youthful and fearless young woman's face, but she has changed her equipment and bearing as described below. Use the attached image for the face, build, pixel size, outline, palette style and the six-cell layout, but do NOT copy her old clothing or weapons.
- OUTFIT: She wears: a light sky-blue hooded cloak with the hood folded back on her shoulders, the long brown braid hanging over her shoulder, the face fully open and clearly visible (the same face as always: fair skin, a long thick brown braid with a small blue ribbon at its end, bright hazel eyes, a determined, youthful and fearless young woman's face, a cunning, quick look); a light leather scout's vest in pale brown with blue stitching over a short cream tunic; lightweight leather bracers; a brown leather belt with a small waterproof pouch and a coil of thin rope; short soft leather boots; NO shield and NO heavy armour. In her right hand a short curved knife with a silver blade held low; on her back a small round water-proof leather bag.
- REST: standing light and ready, facing the viewer, slightly crouched, the knife held low
- ATTACK: a quick forward lunge, the knife slashing forward, the light cloak swinging behind her
- HIT: upper body leaning backwards, eyes closed, the knife dropping, one hand raised
- PORT: Show the folded-back hood of the sky-blue cloak, the brown braid, the quick clever young face and the light leather vest.
- FRONT: The knife held ready in the right hand, the coil of rope and pouch at the belt, the light cloak.
- BACK: Show the sky-blue cloak with the folded hood, the long brown braid and the small leather bag on her back.

## hero_cloelia_eq_pr | Cloelia, Domina Equitum

- ROLE: the same legendary hero Cloelia, now the prestige rider Domina Equitum (the mistress of horsemen)
- FMT: the finished 3-cell sheet of the same hero Cloelia in her specialisation form: it shows the format; the new prestige form keeps the same young woman's face but has richer equipment
- INTRO: The attached image is the six-cell sprite sheet of the same hero Cloelia in her specialisation form: the new form is THE SAME YOUNG WOMAN, with the same face as always: fair skin, a long thick brown braid with a small blue ribbon at its end, bright hazel eyes, a determined, youthful and fearless young woman's face, now at the height of her legend (prestige form): richer and more impressive than before, with finer details, a more splendid cape and a glow around her, as described below. Use the attached image for the face, build, pixel size, outline, palette style and the six-cell layout, but do NOT copy her old clothing or weapons.
- OUTFIT: She is a rider on a horse. The rider and the horse are drawn as ONE whole figure; the horse fills the cell, but the margin requirement still holds. The horse is a magnificent snow-white war-horse with a flowing silver-white mane and tail, gold barding plates on its chest and head, a sky-blue saddle blanket with a wide gold border and gold-studded harness. The rider wears: a polished GOLD helmet with gold cheek guards and a tall crest of white and sky-blue feathers, the braid flowing out at the back, the face fully open and clearly visible (the same face as always: fair skin, a long thick brown braid with a small blue ribbon at its end, bright hazel eyes, a determined, youthful and fearless young woman's face, a regal, commanding look); a magnificent armour of polished silver and gold plates with a white wing emblem on the chest over a cream tunic with blue embroidery; gold shoulder plates; a LONG, rich sky-blue cape flowing behind her with a white lining and a gold border, pinned with a large gold brooch; gold bracers; gold-trimmed white riding boots. In her left hand a ROUND mirror-polished shield with a gold rim and a glowing white wing in the centre. In her right hand a long lance with a polished silver head, a gold-banded shaft and a blue-and-gold pennant. Around the figure a faint glow: a few tiny sparkle pixels, kept close to the body and completely inside the cell.
- REST: the horse standing proudly, the rider upright in the saddle facing the viewer, the lance held upright at her side
- ATTACK: the horse taking a step forward, the rider leaning forward and thrusting the lance forward, shield raised
- HIT: the horse stepping back and tossing its head, the rider leaning backwards with eyes closed, shield sagging
- PORT: Show the gold helmet with the white-and-blue feather crest, the braid, the commanding young face, the gold shoulder plate and the long blue cape with the gold brooch.
- FRONT: Horse and rider facing the viewer, the lance upright in her right hand, the shining shield with the white wing on her left arm, the golden barding on the horse.
- BACK: Show the horse from behind with its silver-white tail, the rider's long blue cape with the gold border, the braid and the lance.

## hero_cloelia_exp_pr | Cloelia, Virgo Fortissima

- ROLE: the same legendary hero Cloelia, now the prestige form Virgo Fortissima (the bravest maiden, who swam the river Tiber to freedom)
- FMT: the finished 3-cell sheet of the same hero Cloelia in her specialisation form: it shows the format; the new prestige form keeps the same young woman's face but has richer equipment
- INTRO: The attached image is the six-cell sprite sheet of the same hero Cloelia in her specialisation form: the new form is THE SAME YOUNG WOMAN, with the same face as always: fair skin, a long thick brown braid with a small blue ribbon at its end, bright hazel eyes, a determined, youthful and fearless young woman's face, now at the height of her legend (prestige form): richer and more impressive than before, with finer details, a more splendid cape and a glow around her, as described below. Use the attached image for the face, build, pixel size, outline, palette style and the six-cell layout, but do NOT copy her old clothing or weapons.
- OUTFIT: She wears: a thin gold circlet with a small blue gem across her forehead, the long brown braid with a gold-and-blue ribbon hanging over her shoulder, the face fully open and clearly visible (the same face as always: fair skin, a long thick brown braid with a small blue ribbon at its end, bright hazel eyes, a determined, youthful and fearless young woman's face, a proud and triumphant look); a light but splendid armour of white-and-sky-blue leather scales with silver trim and a silver wave emblem on the chest over a short cream tunic with gold embroidery; silver shoulder guards; a LONG, flowing, rich sky-blue cloak down to the calves with a white foam-pattern lining and a gold border, pinned with a large silver brooch, the hood folded back; silver-trimmed bracers; a belt with a silver buckle and a rope coil; light white-and-gold boots. In her right hand a slim sword with a polished silver blade and a gold hilt, raised high in victory. In her left hand a short silver knife. Small sparkling water drops float around her. Around the figure a faint glow: a few tiny sparkle pixels, kept close to the body and completely inside the cell.
- REST: standing proud and light, facing the viewer, the sword resting on her shoulder
- ATTACK: a quick forward lunge, the sword thrust forward, the flowing cloak swinging behind her
- HIT: upper body leaning backwards, eyes closed, the sword tilting, one hand raised
- PORT: Show the gold circlet with the blue gem, the braid with the gold-and-blue ribbon, the triumphant young face, the silver shoulder guard and the blue cloak with the large silver brooch.
- FRONT: The sword raised in the right hand, the short silver knife in the left, the splendid light armour with the silver wave emblem.
- BACK: Show the long flowing sky-blue cloak with the foam lining, the braid and the raised sword.

## hero_mucius | Mucius Scaevola

- ROLE: legendary hero, the fearless Roman who held his right hand in the fire (infantry)
- FMT: the finished 3-cell sheet of the Greek recruit Ephebus: portrait, battle front, battle back
- INTRO: The attached image is a six-cell sprite sheet of a Greek soldier: it shows only the required LAYOUT, pose list, pixel size and level of detail. The new character is a legendary hero, NOT a soldier: entirely different clothing, colours and equipment as described below; do NOT copy the soldier's clothing, colours or shield.
- OUTFIT: He wears: a dark rust-red bandana tied around his head INSTEAD of a helmet, short black hair above it, the face clearly visible (tanned skin, a short black pointed goatee with a thin moustache, a stern, fearless look); a medium armour of tan-brown leather with dark iron studs and a dark iron chest plate; a LONG dark olive-green cape down to the calves, pinned at the left shoulder with a plain iron brooch; a skirt of dark-brown leather strips; a brown leather belt with an iron buckle; a leather bracer on the left forearm; his RIGHT hand and forearm bare, severely burnt and scarred with dark red-black burn scars; dark leather boots; NO shield. In his LEFT hand a straight sword with a silver blade and an iron hilt.
- REST: standing firmly, facing the viewer, the sword pointing down in his left hand, the burnt right hand held open at his side
- ATTACK: one step forward, the sword thrust forward with his left hand, the long olive cape swinging behind him
- HIT: upper body leaning backwards, eyes closed, the sword dropping, the burnt right hand raised
- PORT: Show the rust-red bandana, the pointed goatee, the stern face, the iron chest plate collar and the long olive-green cape with the iron brooch.
- FRONT: Sword held ready in the left hand, the burnt scarred right hand clearly visible, the long olive cape.
- BACK: Show the long olive-green cape, the knotted bandana and the sword held in the left hand.

## hero_mucius_ins | Mucius, Insidiator

- ROLE: the same legendary hero Mucius Scaevola, now a silent assassin (Insidiator)
- FMT: the finished 3-cell sheet of the same hero Mucius Scaevola in his base form: it shows the format; the new form keeps the same man's face but has new equipment
- INTRO: The attached image is the six-cell sprite sheet of the same hero Mucius Scaevola in his base form: the new form is THE SAME MAN, with the same face as always: tanned skin, short black hair, a short black pointed goatee with a thin moustache, a stern, fearless look, a severely burnt, scarred RIGHT hand with dark red-black burn scars, but he has changed his equipment and bearing as described below. Use the attached image for the face, build, pixel size, outline, palette style and the six-cell layout, but do NOT copy his old clothing or weapons.
- OUTFIT: He wears: a black bandana tied around his head, a dark cloth mask pulled down below his chin so the face stays fully open and clearly visible (the same face as always: tanned skin, short black hair, a short black pointed goatee with a thin moustache, a stern, fearless look, a severely burnt, scarred RIGHT hand with dark red-black burn scars, a cold, calm look); a light armour of dark charcoal-grey leather with black straps and small dark steel studs; a LONG dark forest-green hooded cloak down to the calves with the hood folded back on his shoulders; a black belt with several small throwing knives and a small pouch; black leather bracers on both forearms except the burnt right hand which stays bare and scarred; soft dark boots; NO shield and NO heavy armour. In his LEFT hand a short curved dagger with a dark silver blade held in reverse grip; a second dagger sheathed at his hip.
- REST: standing alert and slightly crouched, facing the viewer, the dagger held low in his left hand, the burnt right hand open
- ATTACK: a quick low lunge, the dagger slashing across the body, the dark cloak swinging behind him
- HIT: upper body leaning backwards, eyes closed, the dagger dropping, the burnt right hand raised
- PORT: Show the black bandana, the cloth mask pulled down, the pointed goatee, the cold face and the dark green hood folded back on the shoulders.
- FRONT: The dagger held in reverse grip in the left hand, the burnt right hand bare, the throwing knives on the belt, the dark green cloak.
- BACK: Show the long dark green hooded cloak with the folded hood, the knotted black bandana and the sheathed dagger.

## hero_mucius_for | Mucius, Fortis

- ROLE: the same legendary hero Mucius Scaevola, now a heavy warrior of unbreakable will (Fortis)
- FMT: the finished 3-cell sheet of the same hero Mucius Scaevola in his base form: it shows the format; the new form keeps the same man's face but has new equipment
- INTRO: The attached image is the six-cell sprite sheet of the same hero Mucius Scaevola in his base form: the new form is THE SAME MAN, with the same face as always: tanned skin, short black hair, a short black pointed goatee with a thin moustache, a stern, fearless look, a severely burnt, scarred RIGHT hand with dark red-black burn scars, but he has changed his equipment and bearing as described below. Use the attached image for the face, build, pixel size, outline, palette style and the six-cell layout, but do NOT copy his old clothing or weapons.
- OUTFIT: He wears: NO helmet, a dark rust-red bandana over his short black hair, the face fully open and clearly visible (the same face as always: tanned skin, short black hair, a short black pointed goatee with a thin moustache, a stern, fearless look, a severely burnt, scarred RIGHT hand with dark red-black burn scars, a grim, unyielding look); a heavy armour of dark iron plates: a thick iron breastplate, a large iron pauldron on the left shoulder, iron-plated bracer on the left arm; the RIGHT arm bare, with the severely burnt, scarred right hand clenched in a fist, glowing faintly dull red like embers between the burn scars; a short dark olive-green cloak over his shoulders; a heavy brown leather belt with an iron buckle; a skirt of heavy brown leather strips; iron greaves and heavy boots; NO shield. In his LEFT hand a heavy broad iron sword with a wide silver blade.
- REST: standing wide-legged and unmoving, facing the viewer, the heavy sword resting on his left shoulder, the burnt right hand clenched in a fist
- ATTACK: one step forward, a heavy overhead slash of the broad sword with his left hand, the clenched burnt fist drawn back
- HIT: upper body leaning backwards, eyes closed, the sword dropping, the burnt right hand raised
- PORT: Show the rust-red bandana, the pointed goatee, the grim face, the heavy iron pauldron and the iron breastplate.
- FRONT: The heavy sword held in the left hand, the burnt right hand clenched in a fist with the dull red glow, the heavy iron armour.
- BACK: Show the short dark olive cloak, the iron pauldron and the heavy sword at his side.

## hero_mucius_ins_pr | Mucius, Sicarius

- ROLE: the same legendary hero Mucius Scaevola, now the prestige master assassin Sicarius (the master of shadows)
- FMT: the finished 3-cell sheet of the same hero Mucius Scaevola in his specialisation form: it shows the format; the new prestige form keeps the same man's face but has richer equipment
- INTRO: The attached image is the six-cell sprite sheet of the same hero Mucius Scaevola in his specialisation form: the new form is THE SAME MAN, with the same face as always: tanned skin, short black hair, a short black pointed goatee with a thin moustache, a stern, fearless look, a severely burnt, scarred RIGHT hand with dark red-black burn scars, now at the height of his legend (prestige form): richer and more impressive than before, with finer details, a more splendid cloak and a glow around him, as described below. Use the attached image for the face, build, pixel size, outline, palette style and the six-cell layout, but do NOT copy his old clothing or weapons.
- OUTFIT: He wears: a black silk bandana with a small dark-red gem on the forehead, a black cloth mask pulled down below his chin so the face stays fully open and clearly visible (the same face as always: tanned skin, short black hair, a short black pointed goatee with a thin moustache, a stern, fearless look, a severely burnt, scarred RIGHT hand with dark red-black burn scars, a cold, deadly calm look); a refined armour of black and dark-green plates with fine silver edging, dark steel shoulder plates and a thin red line on the chest; a LONG, rich, black-and-forest-green hooded cloak down to the ground with a crimson lining and silver trim, hood folded back, pinned with a small silver brooch; a black belt with many silver throwing knives; black bracers with silver trim, the burnt right hand bare and scarred; dark boots with silver trim; NO shield. In his LEFT hand a long dagger with a polished silver blade and a dark-red gem in the hilt, held in reverse grip; a second matching dagger at his hip. Wisps of dark purple-black shadow smoke curl around him. Around the figure a faint glow: a few tiny sparkle pixels, kept close to the body and completely inside the cell.
- REST: standing alert and slightly crouched, facing the viewer, the silver dagger held low, the burnt right hand open
- ATTACK: a quick low lunge, the silver dagger slashing across the body, the long dark cloak swinging behind him
- HIT: upper body leaning backwards, eyes closed, the dagger tilting, the burnt right hand raised
- PORT: Show the black bandana with the red gem, the cloth mask pulled down, the pointed goatee, the deadly calm face and the black-and-green hood folded back.
- FRONT: The silver dagger held in reverse grip in the left hand, the burnt right hand bare, the silver throwing knives on the belt, the long dark cloak with the crimson lining.
- BACK: Show the long black-and-green hooded cloak with the crimson lining, the folded hood and the second dagger.

## hero_mucius_for_pr | Mucius, Dextra Ignea

- ROLE: the same legendary hero Mucius Scaevola, now the prestige form Dextra Ignea (the fiery right hand)
- FMT: the finished 3-cell sheet of the same hero Mucius Scaevola in his specialisation form: it shows the format; the new prestige form keeps the same man's face but has richer equipment
- INTRO: The attached image is the six-cell sprite sheet of the same hero Mucius Scaevola in his specialisation form: the new form is THE SAME MAN, with the same face as always: tanned skin, short black hair, a short black pointed goatee with a thin moustache, a stern, fearless look, a severely burnt, scarred RIGHT hand with dark red-black burn scars, now at the height of his legend (prestige form): richer and more impressive than before, with finer details, a more splendid cloak and a glow around him, as described below. Use the attached image for the face, build, pixel size, outline, palette style and the six-cell layout, but do NOT copy his old clothing or weapons.
- OUTFIT: He wears: a dark rust-red bandana with a small gold flame ornament over his short black hair, the face fully open and clearly visible (the same face as always: tanned skin, short black hair, a short black pointed goatee with a thin moustache, a stern, fearless look, a severely burnt, scarred RIGHT hand with dark red-black burn scars, a blazing, fearless look); a magnificent heavy armour of charcoal-black iron plates with glowing orange-red cracks like cooling lava, a gold flame emblem on the chest, large black iron pauldrons with gold edges; a LONG dark olive-green cape down to the calves with an ember-orange lining, its edge burning with small flames, pinned with a gold brooch; gold-edged iron greaves and bracers. His RIGHT hand is raised and wrapped in bright orange-and-yellow flames, burning but unhurt. In his LEFT hand a broad iron sword with a silver blade glowing with orange fire along its edge. Small embers and sparks float around him. Around the figure a faint glow: a few tiny sparkle pixels, kept close to the body and completely inside the cell.
- REST: standing wide-legged and unmoving, facing the viewer, the flaming sword resting on his left shoulder, the flaming right hand held at his side
- ATTACK: one step forward, a heavy overhead slash of the flaming sword with his left hand, the flaming right fist drawn back
- HIT: upper body leaning backwards, eyes closed, the sword dropping, the flaming right hand raised
- PORT: Show the rust-red bandana with the gold flame ornament, the pointed goatee, the blazing face, the black iron pauldron with the glowing cracks and the small flames of the cape.
- FRONT: The flaming sword held in the left hand, the right hand wrapped in bright flames, the black armour with the glowing orange cracks and gold flame emblem.
- BACK: Show the long olive-green cape with the burning edge, the black iron pauldrons with the glowing cracks and the flaming sword at his side.

## hero_camilla | Camilla

- ROLE: legendary hero, the swift Volscian warrior maiden (ranged hunter)
- FMT: the finished 3-cell sheet of the Greek recruit Ephebus: portrait, battle front, battle back
- INTRO: The attached image is a six-cell sprite sheet of a Greek soldier: it shows only the required LAYOUT, pose list, pixel size and level of detail. The new character is a legendary hero, a young woman and NOT a soldier: entirely different clothing, colours and equipment as described below; do NOT copy the soldier's clothing, colours or shield.
- OUTFIT: She wears: NO helmet, a wide ochre-yellow bandana across her forehead with a small white feather tucked into it, long loose jet-black hair falling over her shoulders, the face clearly visible (olive skin, two thin red paint stripes under each eye, fierce dark eyes, a wild and proud look); ragged armour made of tan animal hides and torn brown leather straps over a tattered cream tunic with ripped hems; fur-trimmed leather bracers; a LONG ragged sage-green cape down to the calves with torn edges, pinned at the right shoulder with a bone clasp; a brown leather belt with a bone buckle; soft brown leather boots wrapped with straps; NO shield. In her right hand a straight sword with a silver blade and a bone-wrapped hilt. On her back a short hunting bow and a small quiver with white-feathered arrows.
- REST: standing light and alert, facing the viewer, the sword pointing down in her right hand
- ATTACK: one fast step forward, the sword slashing forward, the long ragged green cape swinging behind her
- HIT: upper body leaning backwards, eyes closed, the sword dropping, one hand raised
- PORT: Show the ochre bandana with the white feather, the long black hair, the red paint stripes under the eyes, the hide armour collar and the ragged green cape with the bone clasp.
- FRONT: Sword held ready in the right hand, the short bow and quiver visible over her shoulder, the ragged hide armour.
- BACK: Show the long ragged green cape, the short bow and the quiver with white-feathered arrows on her back, the long black hair.

## hero_camilla_sag | Camilla, Sagittaria

- ROLE: the same legendary hero Camilla, now a master archer (Sagittaria)
- FMT: the finished 3-cell sheet of the same hero Camilla in her base form: it shows the format; the new form keeps the same young woman's face but has new equipment
- INTRO: The attached image is the six-cell sprite sheet of the same hero Camilla in her base form: the new form is THE SAME YOUNG WOMAN, with the same face as always: olive skin, long loose jet-black hair, two thin red paint stripes under each eye, fierce dark eyes, a wild and proud young woman's face, a small white feather tucked into her headband, but she has changed her equipment and bearing as described below. Use the attached image for the face, build, pixel size, outline, palette style and the six-cell layout, but do NOT copy her old clothing or weapons.
- OUTFIT: She wears: an ochre-yellow bandana with a white feather, the long black hair tied back in a high ponytail that falls down her back, the face fully open and clearly visible (the same face as always: olive skin, long loose jet-black hair, two thin red paint stripes under each eye, fierce dark eyes, a wild and proud young woman's face, a small white feather tucked into her headband, a focused look); a light armour of dark-brown leather scales over a tan hide tunic, with white feather trim on the shoulders; a leather archer's bracer on the left forearm and a leather glove on the right hand; a LONG sage-green cape down to the calves, neat but with a feathered edge, pinned with a bone clasp; a belt with a small hunting knife; soft knee-high brown leather boots; NO shield. In her left hand a tall dark-wood longbow with a bone-white grip. On her back a big leather quiver full of arrows with white feathers.
- REST: standing tall and calm, facing the viewer, the longbow held low in her left hand
- ATTACK: standing with the body turned sideways, the longbow fully drawn with an arrow nocked and aimed forward, the bow kept close to the body and fully inside the cell
- HIT: upper body leaning backwards, eyes closed, the bow tilting, one hand raised
- PORT: Show the ochre bandana with the white feather, the ponytail, the red paint stripes, the feather-trimmed leather scale shoulder and the long green cape.
- FRONT: The longbow held ready in the left hand, the quiver full of white-feathered arrows over her shoulder, the long green cape.
- BACK: Show the long ponytail, the big quiver full of white-feathered arrows on her back, the long green cape and the longbow.

## hero_camilla_eqs | Camilla, Equestris

- ROLE: the same legendary hero Camilla, now a mounted archer (Equestris), cavalry
- FMT: the finished 3-cell sheet of the same hero Camilla in her base form: it shows the format; the new form keeps the same young woman's face but has new equipment
- INTRO: The attached image is the six-cell sprite sheet of the same hero Camilla in her base form: the new form is THE SAME YOUNG WOMAN, with the same face as always: olive skin, long loose jet-black hair, two thin red paint stripes under each eye, fierce dark eyes, a wild and proud young woman's face, a small white feather tucked into her headband, but she has changed her equipment and bearing as described below. Use the attached image for the face, build, pixel size, outline, palette style and the six-cell layout, but do NOT copy her old clothing or weapons.
- OUTFIT: She is a rider on a horse. The rider and the horse are drawn as ONE whole figure; the horse fills the cell, but the margin requirement still holds. The horse is a swift dark-bay brown horse with a black mane and tail, a sage-green saddle blanket with an ochre border and a simple brown leather harness with bone beads. The rider wears: an ochre-yellow bandana with a white feather, the long black hair flowing behind her, the face fully open and clearly visible (the same face as always: olive skin, long loose jet-black hair, two thin red paint stripes under each eye, fierce dark eyes, a wild and proud young woman's face, a small white feather tucked into her headband, a thrilled, wild look); a light armour of tan hides and brown leather straps over a cream tunic; leather bracers; a short sage-green cape streaming behind her; brown leather riding boots; NO shield. In her left hand a short recurve bow with a bone-white grip. At her saddle a leather quiver full of white-feathered arrows.
- REST: the horse standing still, the rider upright in the saddle facing the viewer, the short bow held low at her side
- ATTACK: the horse taking a step forward, the rider turned sideways in the saddle with the short bow drawn and an arrow aimed forward, kept close to the body and fully inside the cell
- HIT: the horse stepping back and tossing its head, the rider leaning backwards with eyes closed, bow lowered
- PORT: Show the ochre bandana with the white feather, the long black hair blowing, the red paint stripes, the wild thrilled face and the light hide armour.
- FRONT: Horse and rider facing the viewer, the short bow in her left hand, the quiver at the saddle, the dark-bay horse with the green saddle blanket.
- BACK: Show the horse from behind with its black tail, the rider's short green cape, the long black hair and the quiver.

## hero_camilla_sag_pr | Camilla, Virgo Volsca

- ROLE: the same legendary hero Camilla, now the prestige archer Virgo Volsca (the Volscian maiden, swifter than the wind)
- FMT: the finished 3-cell sheet of the same hero Camilla in her specialisation form: it shows the format; the new prestige form keeps the same young woman's face but has richer equipment
- INTRO: The attached image is the six-cell sprite sheet of the same hero Camilla in her specialisation form: the new form is THE SAME YOUNG WOMAN, with the same face as always: olive skin, long loose jet-black hair, two thin red paint stripes under each eye, fierce dark eyes, a wild and proud young woman's face, a small white feather tucked into her headband, now at the height of her legend (prestige form): richer and more impressive than before, with finer details, a more splendid cape and a glow around her, as described below. Use the attached image for the face, build, pixel size, outline, palette style and the six-cell layout, but do NOT copy her old clothing or weapons.
- OUTFIT: She wears: a golden headband with a tall crest of white and green feathers, the long black hair in a high ponytail with gold rings, the face fully open and clearly visible (the same face as always: olive skin, long loose jet-black hair, two thin red paint stripes under each eye, fierce dark eyes, a wild and proud young woman's face, a small white feather tucked into her headband, a proud, fearless look); a splendid armour of dark-brown leather scales with gold plates on the shoulders and chest, a small gold feather emblem on the chest, over a tan tunic with gold trim; gold bracers with white feather trim; a LONG, rich sage-green cape down to the ground with a white-feather edge, a gold border and a gold clasp; gold-trimmed knee-high boots; NO shield. In her left hand a magnificent tall longbow of dark wood with gold tips and a glowing green-gold string. On her back a gold-trimmed quiver full of arrows with white and golden feathers. Faint green-gold wind swirls curl around her. Around the figure a faint glow: a few tiny sparkle pixels, kept close to the body and completely inside the cell.
- REST: standing tall and proud, facing the viewer, the golden longbow held low in her left hand
- ATTACK: standing with the body turned sideways, the golden longbow fully drawn with a glowing arrow nocked and aimed forward, the bow kept close to the body and fully inside the cell
- HIT: upper body leaning backwards, eyes closed, the bow tilting, one hand raised
- PORT: Show the golden headband with the tall white-and-green feather crest, the ponytail with gold rings, the red paint stripes, the gold shoulder plate and the green cape with the gold clasp.
- FRONT: The golden longbow held ready in the left hand, the gold-trimmed quiver over her shoulder, the long green cape with the white-feather edge.
- BACK: Show the long ponytail with the gold rings, the gold-trimmed quiver full of feathered arrows, the long green cape and the longbow.

## hero_camilla_eqs_pr | Camilla, Regina Camillarum

- ROLE: the same legendary hero Camilla, now the prestige rider Regina Camillarum (the queen of warrior maidens)
- FMT: the finished 3-cell sheet of the same hero Camilla in her specialisation form: it shows the format; the new prestige form keeps the same young woman's face but has richer equipment
- INTRO: The attached image is the six-cell sprite sheet of the same hero Camilla in her specialisation form: the new form is THE SAME YOUNG WOMAN, with the same face as always: olive skin, long loose jet-black hair, two thin red paint stripes under each eye, fierce dark eyes, a wild and proud young woman's face, a small white feather tucked into her headband, now at the height of her legend (prestige form): richer and more impressive than before, with finer details, a more splendid cape and a glow around her, as described below. Use the attached image for the face, build, pixel size, outline, palette style and the six-cell layout, but do NOT copy her old clothing or weapons.
- OUTFIT: She is a rider on a horse. The rider and the horse are drawn as ONE whole figure; the horse fills the cell, but the margin requirement still holds. The horse is a magnificent black war-horse with a flowing black mane and tail, gold barding plates on its chest and head, a sage-green saddle blanket with a wide gold border and a gold-studded harness with white feather plumes. The rider wears: a golden crown of upright white and gold feathers over her long black hair that flows behind her, the face fully open and clearly visible (the same face as always: olive skin, long loose jet-black hair, two thin red paint stripes under each eye, fierce dark eyes, a wild and proud young woman's face, a small white feather tucked into her headband, a regal, thrilled look); a splendid armour of polished gold plates over dark leather with a gold feather emblem on the chest, over a cream tunic with green embroidery; gold shoulder plates; a LONG, rich sage-green cape streaming behind her with a white lining and a gold border; gold bracers; gold-trimmed riding boots; NO shield. In her left hand a golden recurve bow with a glowing green-gold string. At her saddle a gold-trimmed quiver full of white-and-gold feathered arrows. Around the figure a faint glow: a few tiny sparkle pixels, kept close to the body and completely inside the cell.
- REST: the horse standing proudly, the rider upright in the saddle facing the viewer, the golden bow held low at her side
- ATTACK: the horse taking a step forward, the rider turned sideways in the saddle with the golden bow drawn and a glowing arrow aimed forward, kept close to the body and fully inside the cell
- HIT: the horse stepping back and tossing its head, the rider leaning backwards with eyes closed, bow lowered
- PORT: Show the golden feather crown, the long black hair blowing, the red paint stripes, the regal thrilled face, the gold shoulder plate and the long green cape.
- FRONT: Horse and rider facing the viewer, the golden bow in her left hand, the quiver at the saddle, the black war-horse with the gold barding.
- BACK: Show the black war-horse from behind with its black tail, the rider's long green cape with the gold border, the golden feather crown and the quiver.

## hero_ulixes_mac | Ulixes, Machinator

- ROLE: the same legendary hero Ulixes, now a clever engineer and machine builder (Machinator)
- FMT: the finished 3-cell sheet of the same hero Ulixes in his base form: it shows the format; the new form keeps the same man's face but has new equipment
- INTRO: The attached image is the six-cell sprite sheet of the same hero Ulixes in his base form: the new form is THE SAME MAN, with the same face as always: olive skin, short curly brown hair, a short brown beard, a thin pale scar on the left cheek, clear dark clever eyes, but he has changed his equipment and bearing as described below. Use the attached image for the face, build, pixel size, outline, palette style and the six-cell layout, but do NOT copy his clothing, helmet or weapons.
- OUTFIT: He wears: an open bronze helmet with cheek guards, NO crest, a bright orange band around it, the face fully open and clearly visible (the same face as always: olive skin, short curly brown hair, a short brown beard, a thin pale scar on the left cheek, clear dark clever eyes, a clever, tinkering look); a medium armour of dark-brown leather with bronze studs and orange trim over a cream linen tunic; bronze shoulder buckles; a LONG bright orange cape down to the calves pinned at the right shoulder with a round bronze gear-shaped brooch; a wide brown leather tool belt with a small mallet, chisels, a set-square and a coil of rope; leather bracers; brown leather boots laced to the knee; NO shield. In both hands a big wooden war-mallet with a heavy iron head and an orange cloth tied to the handle.
- REST: standing relaxed, facing the viewer, the big mallet resting on his shoulder
- ATTACK: one step forward, a heavy overhead swing of the mallet, the mallet kept fully inside the cell
- HIT: upper body leaning backwards, eyes closed, the mallet dropping, one hand raised
- PORT: Show the open bronze helmet with the orange band, the scar on the cheek, the short beard, the bronze buckle and the long orange cape with the gear-shaped brooch.
- FRONT: The big mallet held in both hands in front of him, the tool belt with the set-square, the long orange cape.
- BACK: Show the long orange cape, the wide tool belt with the coil of rope and the big mallet over his shoulder.

## hero_ulixes_mac_pr | Ulixes, Architectus Equi

- ROLE: the same legendary hero Ulixes, now the prestige master builder Architectus Equi (the builder of the great wooden horse)
- FMT: the finished 3-cell sheet of the same hero Ulixes in his specialisation form: it shows the format; the new prestige form keeps the same man's face but has richer equipment
- INTRO: The attached image is the six-cell sprite sheet of the same hero Ulixes in his specialisation form: the new form is THE SAME MAN, with the same face as always: olive skin, short curly brown hair, a short brown beard, a thin pale scar on the left cheek, clear dark clever eyes, now at the height of his legend (prestige form): richer and more impressive than before, with finer gold details, a more splendid cape and a faint glow around him, as described below. Use the attached image for the face, build, pixel size, outline, palette style and the six-cell layout, but do NOT copy his old clothing or weapons.
- OUTFIT: He wears: a tall shiny GOLD open-faced helmet with gold cheek guards and a crest shaped like a small wooden horse's head in gold, an orange band around it, the face fully open and clearly visible (the same face as always: olive skin, short curly brown hair, a short brown beard, a thin pale scar on the left cheek, clear dark clever eyes, a triumphant, cunning look); a ceremonial armour of shiny GOLD plates with orange enamel inlays and a small gold horse emblem on the chest, over a cream tunic with gold trim; gold shoulder plates shaped like gears; a LONG, rich, shimmering ORANGE-and-gold cape down to the ground with a wide gold border, pinned with a large round gold gear brooch; a gold-studded tool belt with golden tools; gold bracers; gold-trimmed brown leather boots laced to the knee; NO shield. In both hands a magnificent golden war-mallet with a heavy head engraved with a horse and a glowing orange handle. Small golden cogs and sparks float around him. Around the figure a faint glow: a few tiny sparkle pixels, kept close to the body and completely inside the cell.
- REST: standing tall and proud, facing the viewer, the golden mallet resting on his shoulder
- ATTACK: one step forward, a heavy overhead swing of the golden mallet, the mallet kept fully inside the cell
- HIT: upper body leaning backwards, eyes closed, the mallet dropping, one hand raised
- PORT: Show the tall gold helmet with the little golden horse crest, the scar on the cheek, the short beard, the gear-shaped gold shoulder plate and the orange cape with the large gold brooch.
- FRONT: The golden mallet held in both hands in front of him, the gold armour with the horse emblem, the long orange-and-gold cape.
- BACK: Show the long orange-and-gold cape with the gold border, the golden tool belt and the golden mallet over his shoulder.

## hero_hercules | Hercules

- ROLE: legendary hero, the mighty strongman who performed twelve labours (infantry)
- FMT: the finished 3-cell sheet of the Greek recruit Ephebus: portrait, battle front, battle back
- INTRO: The attached image is a six-cell sprite sheet of a Greek soldier: it shows only the required LAYOUT, pose list, pixel size and level of detail. The new character is a legendary hero, NOT a soldier: entirely different clothing, colours and equipment as described below; do NOT copy the soldier's clothing, colours or shield.
- OUTFIT: He wears: NO helmet, wild untidy chestnut-brown hair, a thick full brown beard, the face clearly visible (bronze-tanned skin, a heavy brow, powerful warm brown eyes, a fearless grin); a very broad, muscular, bare chest with three long pale claw scars across it; a tawny lion pelt draped over his left shoulder with the lion's paw hanging down; a ragged dark-brown loincloth skirt of torn leather strips with a thick rope belt; heavy bronze arm-rings on both forearms; a LONG ragged burnt-orange cape down to the calves tied at the right shoulder; worn brown leather sandals; NO shield. In his right hand a heavy straight sword with a wide silver blade and a plain iron hilt.
- REST: standing wide-legged and broad, facing the viewer, the sword resting on his shoulder
- ATTACK: one big step forward, a mighty overhead slash of the sword, the long ragged orange cape swinging behind him
- HIT: upper body leaning backwards, eyes closed, the sword dropping, one hand raised
- PORT: Show the wild brown hair, the thick beard, the claw scars on the broad chest, the tawny lion pelt on the shoulder and the burnt-orange cape.
- FRONT: Sword held ready in the right hand, the broad bare chest with the claw scars, the lion pelt on his left shoulder.
- BACK: Show the long ragged orange cape, the tawny lion pelt over the shoulder and the sword.

## hero_hercules_ath | Hercules, Athleta

- ROLE: the same legendary hero Hercules, now a mighty wrestler with a great club (Athleta)
- FMT: the finished 3-cell sheet of the same hero Hercules in his base form: it shows the format; the new form keeps the same man's face but has new equipment
- INTRO: The attached image is the six-cell sprite sheet of the same hero Hercules in his base form: the new form is THE SAME MAN, with the same face as always: bronze-tanned skin, wild untidy chestnut-brown hair, a thick full brown beard, a heavy brow, powerful warm brown eyes, three long pale claw scars across the chest, but he has changed his equipment and bearing as described below. Use the attached image for the face, build, pixel size, outline, palette style and the six-cell layout, but do NOT copy his old clothing or weapons.
- OUTFIT: He wears: the head of the tawny lion-skin pulled over his wild hair like a hood, the lion's open jaws and mane framing his forehead, the face fully open and clearly visible (the same face as always: bronze-tanned skin, wild untidy chestnut-brown hair, a thick full brown beard, a heavy brow, powerful warm brown eyes, three long pale claw scars across the chest, a roaring grin); the tawny lion pelt covering his shoulders and back like a cloak with the paws knotted across his chest; a bare muscular chest with the claw scars visible; heavy bronze arm-rings and a heavy bronze wrestler's belt; a short skirt of dark-brown leather strips; bare strong legs with leather wraps and heavy sandals; NO shield. In both hands a huge gnarled wooden club with iron studs at its thick end.
- REST: standing wide-legged and powerful, facing the viewer, the huge club resting on his shoulder
- ATTACK: a mighty overhead smash of the club, the club high above his head and coming down, kept fully inside the cell
- HIT: upper body leaning backwards, eyes closed, the club dropping, one hand raised
- PORT: Show the lion-head hood over the wild hair, the thick beard, the roaring grin, the claw scars and the lion pelt over the shoulders.
- FRONT: The huge studded club held in both hands in front of him, the lion pelt cloak with the knotted paws, the bare chest with the claw scars.
- BACK: Show the lion pelt covering his back with the tail, the bronze belt and the huge club held at his side.

## hero_hercules_sag | Hercules, Sagittarius Herculis

- ROLE: the same legendary hero Hercules, now an archer with the poisoned arrows of the Hydra (Sagittarius Herculis)
- FMT: the finished 3-cell sheet of the same hero Hercules in his base form: it shows the format; the new form keeps the same man's face but has new equipment
- INTRO: The attached image is the six-cell sprite sheet of the same hero Hercules in his base form: the new form is THE SAME MAN, with the same face as always: bronze-tanned skin, wild untidy chestnut-brown hair, a thick full brown beard, a heavy brow, powerful warm brown eyes, three long pale claw scars across the chest, but he has changed his equipment and bearing as described below. Use the attached image for the face, build, pixel size, outline, palette style and the six-cell layout, but do NOT copy his old clothing or weapons.
- OUTFIT: He wears: a wide leather headband over his wild chestnut-brown hair, the face fully open and clearly visible (the same face as always: bronze-tanned skin, wild untidy chestnut-brown hair, a thick full brown beard, a heavy brow, powerful warm brown eyes, three long pale claw scars across the chest, a focused, fearless look); a light armour of tawny lion-skin straps and dark leather across a bare muscular chest with the claw scars visible; a tawny lion pelt over his left shoulder; a leather archer's bracer on the left forearm and a leather glove on the right hand; a LONG ragged burnt-orange cape down to the calves; a thick rope belt with a short knife; sturdy brown boots; NO shield. In his left hand a huge dark-wood bow with bronze tips. On his back a big leather quiver full of arrows with sickly-green feathers and glowing green poisoned tips.
- REST: standing wide-legged, facing the viewer, the huge bow held low in his left hand
- ATTACK: standing with the body turned sideways, the huge bow fully drawn with a green-tipped poisoned arrow nocked and aimed forward, the bow kept close to the body and fully inside the cell
- HIT: upper body leaning backwards, eyes closed, the bow tilting, one hand raised
- PORT: Show the leather headband, the wild hair, the thick beard, the claw scars, the lion pelt on the shoulder and the quiver with the green-feathered poisoned arrows.
- FRONT: The huge bow held ready in the left hand, the quiver with green-feathered arrows over his shoulder, the lion pelt.
- BACK: Show the long ragged orange cape, the big quiver full of green-feathered poisoned arrows on his back and the huge bow.

## hero_hercules_ath_pr | Hercules, Alcides

- ROLE: the same legendary hero Hercules, now the prestige half-god Alcides (the strong one, descendant of Alcaeus)
- FMT: the finished 3-cell sheet of the same hero Hercules in his specialisation form: it shows the format; the new prestige form keeps the same man's face but has richer equipment
- INTRO: The attached image is the six-cell sprite sheet of the same hero Hercules in his specialisation form: the new form is THE SAME MAN, with the same face as always: bronze-tanned skin, wild untidy chestnut-brown hair, a thick full brown beard, a heavy brow, powerful warm brown eyes, three long pale claw scars across the chest, now at the height of his legend (prestige form): richer and more impressive than before, with finer details, a more splendid cape and a glow around him, as described below. Use the attached image for the face, build, pixel size, outline, palette style and the six-cell layout, but do NOT copy his old clothing or weapons.
- OUTFIT: He wears: the head of a GOLDEN lion-skin pulled over his wild hair like a hood, its golden mane framing his forehead, the face fully open and clearly visible (the same face as always: bronze-tanned skin, wild untidy chestnut-brown hair, a thick full brown beard, a heavy brow, powerful warm brown eyes, three long pale claw scars across the chest, a proud, godlike roaring grin); a shining GOLDEN lion pelt covering his shoulders and back like a cloak with the paws knotted across his chest, golden eyes and claws; a bare muscular chest with the claw scars and a broad gold collar; heavy gold arm-rings and a heavy gold belt with a lion-head buckle; a short skirt of leather strips with gold studs; gold-trimmed sandals; NO shield. In both hands a colossal club of dark wood bound with gold bands and gold studs, glowing at its thick end. Golden sparks float around him. Around the figure a faint glow: a few tiny sparkle pixels, kept close to the body and completely inside the cell.
- REST: standing wide-legged and mighty, facing the viewer, the huge golden club resting on his shoulder
- ATTACK: a mighty overhead smash of the golden club, the club high above his head and coming down, kept fully inside the cell
- HIT: upper body leaning backwards, eyes closed, the club dropping, one hand raised
- PORT: Show the golden lion-head hood, the thick beard, the roaring grin, the claw scars, the gold collar and the golden lion pelt.
- FRONT: The colossal golden-banded club held in both hands in front of him, the golden lion pelt cloak, the broad gold collar and belt.
- BACK: Show the golden lion pelt covering his back with the tail, the gold belt and the colossal club held at his side.

## hero_hercules_sag_pr | Hercules, Deus

- ROLE: the same legendary hero Hercules, now the prestige form Deus (the hero raised to the gods, apotheosis)
- FMT: the finished 3-cell sheet of the same hero Hercules in his specialisation form: it shows the format; the new prestige form keeps the same man's face but has richer equipment
- INTRO: The attached image is the six-cell sprite sheet of the same hero Hercules in his specialisation form: the new form is THE SAME MAN, with the same face as always: bronze-tanned skin, wild untidy chestnut-brown hair, a thick full brown beard, a heavy brow, powerful warm brown eyes, three long pale claw scars across the chest, now at the height of his legend (prestige form): richer and more impressive than before, with finer details, a more splendid cape and a glow around him, as described below. Use the attached image for the face, build, pixel size, outline, palette style and the six-cell layout, but do NOT copy his old clothing or weapons.
- OUTFIT: He wears: a shining wreath of golden olive leaves on his wild chestnut-brown hair, the face fully open and clearly visible (the same face as always: bronze-tanned skin, wild untidy chestnut-brown hair, a thick full brown beard, a heavy brow, powerful warm brown eyes, three long pale claw scars across the chest, a serene, godlike look); a bare muscular chest with the claw scars glowing softly gold; a radiant WHITE-and-GOLD lion pelt over his left shoulder; a gold collar and gold arm-rings with white gems; a belt of white cloth with a gold buckle; a LONG, flowing, shimmering WHITE-and-GOLD cape down to the ground with a wide gold border, pinned with a gold star brooch; gold-trimmed white sandals; NO shield. In his left hand a magnificent golden bow glowing with white light. On his back a golden quiver full of arrows with white-gold feathers and blazing star-shaped tips. A bright white-gold halo of light and tiny stars shines around him. Around the figure a faint glow: a few tiny sparkle pixels, kept close to the body and completely inside the cell.
- REST: standing tall and radiant, facing the viewer, the golden bow held low in his left hand
- ATTACK: standing with the body turned sideways, the golden bow fully drawn with a blazing white-gold arrow nocked and aimed forward, the bow kept close to the body and fully inside the cell
- HIT: upper body leaning backwards, eyes closed, the bow tilting, one hand raised
- PORT: Show the golden olive wreath, the thick beard, the serene godlike face, the glowing claw scars, the white-and-gold lion pelt and the gold star brooch.
- FRONT: The glowing golden bow held ready in the left hand, the golden quiver with star-tipped arrows over his shoulder, the long white-and-gold cape.
- BACK: Show the long white-and-gold cape with the gold border, the golden quiver with the star-tipped arrows and the golden bow.

## hero_perseus | Perseus

- ROLE: legendary hero, the young demigod with the winged sandals (cavalry)
- FMT: the finished 3-cell sheet of the Greek recruit Ephebus: portrait, battle front, battle back
- INTRO: The attached image is a six-cell sprite sheet of a Greek soldier: it shows only the required LAYOUT, pose list, pixel size and level of detail. The new character is a legendary hero, NOT a soldier: entirely different clothing, colours and equipment as described below; do NOT copy the soldier's clothing, colours or shield.
- OUTFIT: He wears: NO helmet, a tall spiky blond hair crest like a cockscomb running from forehead to nape with the sides closely shaved, the face clearly visible (fair skin, a clean-shaven youthful face, bright sky-blue eyes, a confident smirk); a ceremonial shiny gold-and-bronze cuirass with a small gold wing emblem on the chest over a sky-blue tunic with a white hem; gold shoulder plates; gold bracers; a short skirt of sky-blue leather strips with gold studs; a bright crimson cape that ends in a large wing of white feathers at the back, pinned with a round gold brooch; shiny gold sandals with small white feathered wings on the ankles; NO shield. In his right hand a curved sword (harpe) with a silver blade and a gold hilt.
- REST: standing light and confident, facing the viewer, the curved sword pointing down in his right hand
- ATTACK: one quick leap forward, the curved sword slashing forward, the crimson wing cape swinging behind him
- HIT: upper body leaning backwards, eyes closed, the sword dropping, one hand raised
- PORT: Show the tall blond cockscomb crest, the youthful smirk, the gold wing emblem, the gold shoulder plate and the crimson cape with the gold brooch.
- FRONT: The curved sword held ready in the right hand, the winged sandals clearly visible, the gold-and-bronze cuirass with the wing emblem.
- BACK: Show the crimson cape ending in the large white wing of feathers, the blond crest and the curved sword.

## hero_perseus_eqa | Perseus, Eques Alatus

- ROLE: the same legendary hero Perseus, now the winged rider on the flying horse Pegasus (Eques Alatus), cavalry
- FMT: the finished 3-cell sheet of the same hero Perseus in his base form: it shows the format; the new form keeps the same young man's face but has new equipment
- INTRO: The attached image is the six-cell sprite sheet of the same hero Perseus in his base form: the new form is THE SAME YOUNG MAN, with the same face as always: fair skin, a tall spiky blond hair crest like a cockscomb running from forehead to nape with the sides closely shaved, a clean-shaven youthful face, bright sky-blue eyes, a confident smirk, but he has changed his equipment and bearing as described below. Use the attached image for the face, build, pixel size, outline, palette style and the six-cell layout, but do NOT copy his old clothing or weapons.
- OUTFIT: He is a rider on a flying horse. The rider and the horse are drawn as ONE whole figure; the horse fills the cell, but the margin requirement still holds. The horse is a snow-white winged horse (Pegasus) with a pair of big feathered white wings spread from its shoulders, a flowing silver-white mane and tail, a sky-blue saddle blanket with a gold border and a simple gold-studded harness. The rider wears: an open bronze helmet with cheek guards and a tall blond horsehair crest copying his cockscomb, the face fully open and clearly visible (the same face as always: fair skin, a tall spiky blond hair crest like a cockscomb running from forehead to nape with the sides closely shaved, a clean-shaven youthful face, bright sky-blue eyes, a confident smirk, a joyful, daring look); a medium armour of silver-bronze plates over a sky-blue tunic; a crimson cape streaming behind him like a wing; gold bracers; gold sandals with small white wings. In his right hand a long gold-tipped lance with a crimson pennant; on his left arm a small ROUND shield painted sky-blue with a gold wing emblem.
- REST: the winged horse standing with its wings half folded, the rider upright in the saddle facing the viewer, the lance held upright at his side
- ATTACK: the winged horse taking a step forward with its wings spread, the rider leaning forward and thrusting the lance forward, shield raised
- HIT: the winged horse stepping back and tossing its head, the rider leaning backwards with eyes closed, shield sagging
- PORT: Show the bronze helmet with the tall blond crest, the youthful daring face, the gold-and-silver armour collar and the crimson cape.
- FRONT: Winged horse and rider facing the viewer with the white wings spread, the lance upright in the right hand, the round sky-blue shield on the left arm.
- BACK: Show the white winged horse from behind with its spread wings and tail, the rider's crimson cape, the blond crest and the lance.

## hero_perseus_ven | Perseus, Venator Monstrorum

- ROLE: the same legendary hero Perseus, now a cunning monster hunter with a mirror shield (Venator Monstrorum), scout
- FMT: the finished 3-cell sheet of the same hero Perseus in his base form: it shows the format; the new form keeps the same young man's face but has new equipment
- INTRO: The attached image is the six-cell sprite sheet of the same hero Perseus in his base form: the new form is THE SAME YOUNG MAN, with the same face as always: fair skin, a tall spiky blond hair crest like a cockscomb running from forehead to nape with the sides closely shaved, a clean-shaven youthful face, bright sky-blue eyes, a confident smirk, but he has changed his equipment and bearing as described below. Use the attached image for the face, build, pixel size, outline, palette style and the six-cell layout, but do NOT copy his old clothing or weapons.
- OUTFIT: He wears: a dark-blue hooded travelling cloak with the hood folded back, a long crimson-lined edge, over his tall blond cockscomb crest, the face fully open and clearly visible (the same face as always: fair skin, a tall spiky blond hair crest like a cockscomb running from forehead to nape with the sides closely shaved, a clean-shaven youthful face, bright sky-blue eyes, a confident smirk, a cool, watchful look); a light armour of dark-blue leather with silver studs over a short sky-blue tunic; leather bracers; a belt with a small leather satchel and a coiled rope; gold sandals with small white wings on the ankles; NO heavy armour. In his left hand a big ROUND mirror-polished silver shield showing a faint bright reflection, with a plain silver rim. In his right hand a curved sword (harpe) with a silver blade and a gold hilt.
- REST: standing alert and slightly crouched, facing the viewer, the mirror shield held at his left side, the curved sword low
- ATTACK: one quick lunge, the curved sword slashing forward over the top of the raised mirror shield
- HIT: upper body leaning backwards, eyes closed, the shield sagging, the sword tilting
- PORT: Show the folded-back dark-blue hood, the tall blond crest, the cool watchful face and the silver mirror shield edge.
- FRONT: The big polished mirror shield raised on the left arm, the curved sword in the right hand, the winged sandals.
- BACK: Show the dark-blue hooded cloak with the crimson lining, the blond crest, the back of the round shield and the curved sword.

## hero_perseus_eqa_pr | Perseus, Gorgonicida

- ROLE: the same legendary hero Perseus, now the prestige rider Gorgonicida (the slayer of the Gorgon), on his flying horse
- FMT: the finished 3-cell sheet of the same hero Perseus in his specialisation form: it shows the format; the new prestige form keeps the same young man's face but has richer equipment
- INTRO: The attached image is the six-cell sprite sheet of the same hero Perseus in his specialisation form: the new form is THE SAME YOUNG MAN, with the same face as always: fair skin, a tall spiky blond hair crest like a cockscomb running from forehead to nape with the sides closely shaved, a clean-shaven youthful face, bright sky-blue eyes, a confident smirk, now at the height of his legend (prestige form): richer and more impressive than before, with finer details, a more splendid cape and a glow around him, as described below. Use the attached image for the face, build, pixel size, outline, palette style and the six-cell layout, but do NOT copy his old clothing or weapons.
- OUTFIT: He is a rider on a flying horse. The rider and the horse are drawn as ONE whole figure; the horse fills the cell, but the margin requirement still holds. The horse is a magnificent snow-white winged horse (Pegasus) with huge feathered white-and-gold wings spread wide, a flowing silver-white mane and tail, gold barding plates on its chest and head, a sky-blue saddle blanket with a wide gold border. The rider wears: a polished GOLD winged helmet with gold cheek guards and a tall blond crest, the face fully open and clearly visible (the same face as always: fair skin, a tall spiky blond hair crest like a cockscomb running from forehead to nape with the sides closely shaved, a clean-shaven youthful face, bright sky-blue eyes, a confident smirk, a victorious look); a splendid armour of polished gold and silver plates with a gold wing emblem on the chest over a sky-blue tunic with gold embroidery; gold shoulder plates; a LONG crimson cape streaming behind him with a white-feather wing edge and a gold border; gold bracers; gold sandals with white wings. In his right hand a long lance with a polished silver head and a crimson-and-gold pennant. On his left arm a big ROUND gold-rimmed shield showing a stone-grey relief of Medusa's head with snakes for hair, mouth shut and eyes closed. Around the figure a faint glow: a few tiny sparkle pixels, kept close to the body and completely inside the cell.
- REST: the winged horse standing proudly with its wings half folded, the rider upright in the saddle facing the viewer, the lance held upright at his side
- ATTACK: the winged horse taking a step forward with its wings spread, the rider leaning forward and thrusting the lance forward, the Medusa shield raised
- HIT: the winged horse stepping back and tossing its head, the rider leaning backwards with eyes closed, shield sagging
- PORT: Show the gold winged helmet with the tall blond crest, the victorious face, the gold shoulder plate and the crimson cape.
- FRONT: Winged horse and rider facing the viewer with the golden wings spread, the lance upright in the right hand, the round gold shield with the Medusa relief on the left arm.
- BACK: Show the white-and-gold winged horse from behind with its spread wings, the rider's long crimson cape with the feather edge, the golden helmet crest and the lance.

## hero_perseus_ven_pr | Perseus, Medusae Victor

- ROLE: the same legendary hero Perseus, now the prestige form Medusae Victor (the glorious victor over Medusa)
- FMT: the finished 3-cell sheet of the same hero Perseus in his specialisation form: it shows the format; the new prestige form keeps the same young man's face but has richer equipment
- INTRO: The attached image is the six-cell sprite sheet of the same hero Perseus in his specialisation form: the new form is THE SAME YOUNG MAN, with the same face as always: fair skin, a tall spiky blond hair crest like a cockscomb running from forehead to nape with the sides closely shaved, a clean-shaven youthful face, bright sky-blue eyes, a confident smirk, now at the height of his legend (prestige form): richer and more impressive than before, with finer details, a more splendid cape and a glow around him, as described below. Use the attached image for the face, build, pixel size, outline, palette style and the six-cell layout, but do NOT copy his old clothing or weapons.
- OUTFIT: He wears: a shining GOLD winged helmet with small white wings at the sides and a tall blond crest, the face fully open and clearly visible (the same face as always: fair skin, a tall spiky blond hair crest like a cockscomb running from forehead to nape with the sides closely shaved, a clean-shaven youthful face, bright sky-blue eyes, a confident smirk, a triumphant, radiant look); a splendid armour of polished silver and gold plates with a gold wing emblem on the chest over a sky-blue tunic with gold embroidery; gold shoulder plates; a LONG, rich crimson cape ending in a huge wing of white-and-gold feathers, pinned with a large gold brooch; gold bracers; gold sandals with large white wings on the ankles; NO other shield. In his left hand a big ROUND mirror-polished silver shield in a gold rim, its surface glowing with a bright white-blue light and showing a reflection of a stone-grey Medusa head. In his right hand a curved sword (harpe) with a glowing silver blade and a gold hilt. Small white feathers and sparks drift around him. Around the figure a faint glow: a few tiny sparkle pixels, kept close to the body and completely inside the cell.
- REST: standing tall and radiant, facing the viewer, the shining mirror shield at his left side, the curved sword low
- ATTACK: one quick lunge, the glowing curved sword slashing forward over the top of the raised mirror shield
- HIT: upper body leaning backwards, eyes closed, the shield sagging, the sword tilting
- PORT: Show the gold winged helmet with the tall blond crest, the triumphant face, the gold shoulder plate and the edge of the glowing mirror shield.
- FRONT: The shining mirror shield raised on the left arm, the glowing curved sword in the right hand, the gold-and-silver armour with the wing emblem, the large white-feathered wings on the sandals.
- BACK: Show the long crimson cape ending in the huge white-and-gold wing, the golden helmet crest, the back of the round shield and the curved sword.

## hero_theseus | Theseus

- ROLE: legendary hero, the king-prince of Athens who slew the Minotaur (infantry)
- FMT: the finished 3-cell sheet of the Greek recruit Ephebus: portrait, battle front, battle back
- INTRO: The attached image is a six-cell sprite sheet of a Greek soldier: it shows only the required LAYOUT, pose list, pixel size and level of detail. The new character is a legendary hero, NOT a soldier: entirely different clothing, colours and equipment as described below; do NOT copy the soldier's clothing, colours or shield.
- OUTFIT: He wears: NO helmet, short wavy medium-brown hair, a short neat stubble beard, the face clearly visible (fair skin, grey-green eyes, a strong jaw, a calm heroic look); a gold spiral (labyrinth) pendant on a cord at his neck; a ceremonial polished bronze cuirass with a small gold owl emblem on the chest over a white tunic with a deep-blue hem; gold shoulder plates; a short skirt of white leather strips with gold studs; a SHORT deep royal-blue cape pinned at the right shoulder with a round gold brooch; gold bracers; a brown leather belt with a gold buckle and a small coil of bright RED thread hanging from it; brown leather sandals laced to the calf; NO shield. In his right hand a straight sword with a silver blade and a gold hilt.
- REST: standing upright and calm, facing the viewer, the sword pointing down in his right hand
- ATTACK: one step forward, the sword thrust forward, the short blue cape swinging behind him
- HIT: upper body leaning backwards, eyes closed, the sword dropping, one hand raised
- PORT: Show the short wavy brown hair, the stubble beard, the gold spiral pendant, the bronze cuirass collar and the short royal-blue cape with the gold brooch.
- FRONT: Sword held ready in the right hand, the coil of red thread at the belt, the bronze cuirass with the gold owl emblem.
- BACK: Show the short royal-blue cape, the coil of red thread at the belt and the sword.

## hero_theseus_vic | Theseus, Victor Labyrinthi

- ROLE: the same legendary hero Theseus, now the heavy conqueror of the labyrinth (Victor Labyrinthi), hoplite
- FMT: the finished 3-cell sheet of the same hero Theseus in his base form: it shows the format; the new form keeps the same man's face but has new equipment
- INTRO: The attached image is the six-cell sprite sheet of the same hero Theseus in his base form: the new form is THE SAME MAN, with the same face as always: fair skin, short wavy medium-brown hair, a short neat stubble beard, grey-green eyes, a strong jaw, a calm heroic look, a gold spiral pendant (a labyrinth) on a cord at his neck, but he has changed his equipment and bearing as described below. Use the attached image for the face, build, pixel size, outline, palette style and the six-cell layout, but do NOT copy his old clothing or weapons.
- OUTFIT: He wears: a heavy bronze Corinthian helmet pushed back so the face is fully open and clearly visible (the same face as always: fair skin, short wavy medium-brown hair, a short neat stubble beard, grey-green eyes, a strong jaw, a calm heroic look, a gold spiral pendant (a labyrinth) on a cord at his neck, a steady, unmoving look), with a short deep-blue horsehair crest; a heavy armour of overlapping bronze scales with large bronze shoulder plates over a white tunic with a deep-blue hem; a short deep royal-blue cape; bronze greaves; the small coil of bright red thread at his belt. In his left hand a big ROUND bronze shield with a wide gold rim and a gold spiral labyrinth pattern as emblem. In his right hand a strong spear with a silver leaf-shaped head.
- REST: standing firmly, facing the viewer, the big round shield at his left side, the spear held upright beside him
- ATTACK: one step forward, the spear thrust forward over the top of the raised shield
- HIT: upper body leaning backwards, eyes closed, the shield sagging, the spear tilting
- PORT: Show the bronze helmet pushed back with the blue crest, the stubble beard, the gold spiral pendant and the bronze scale armour.
- FRONT: The big round shield with the gold spiral raised on the left arm, the spear held ready in the right hand, the red thread coil at the belt.
- BACK: Show the back of the big round bronze shield, the short blue cape, the helmet crest and the spear.

## hero_theseus_rex | Theseus, Rex Atheniensis

- ROLE: the same legendary hero Theseus, now the king of Athens (Rex Atheniensis), commander
- FMT: the finished 3-cell sheet of the same hero Theseus in his base form: it shows the format; the new form keeps the same man's face but has new equipment
- INTRO: The attached image is the six-cell sprite sheet of the same hero Theseus in his base form: the new form is THE SAME MAN, with the same face as always: fair skin, short wavy medium-brown hair, a short neat stubble beard, grey-green eyes, a strong jaw, a calm heroic look, a gold spiral pendant (a labyrinth) on a cord at his neck, but he has changed his equipment and bearing as described below. Use the attached image for the face, build, pixel size, outline, palette style and the six-cell layout, but do NOT copy his old clothing or weapons.
- OUTFIT: He wears: a thin gold circlet with a small owl ornament on his short wavy brown hair INSTEAD of a helmet, the face fully open and clearly visible (the same face as always: fair skin, short wavy medium-brown hair, a short neat stubble beard, grey-green eyes, a strong jaw, a calm heroic look, a gold spiral pendant (a labyrinth) on a cord at his neck, a regal look); a ceremonial polished bronze-and-gold cuirass with a gold owl emblem and gold shoulder plates over a white tunic with gold embroidery; a deep-blue officer's sash around the waist; a LONG royal-blue cape down to the calves with a white lining and a gold border, pinned with a round gold brooch; gold bracers; gold greaves; the small coil of bright red thread at his belt. NO shield. In his right hand a straight sword with a silver blade and a gold hilt, raised in command. In his left hand a short gold royal sceptre topped with a small gold owl.
- REST: standing tall and regal, facing the viewer, the sword resting on his shoulder, the sceptre at his side
- ATTACK: one step forward, the sword pointing forward in command, the sceptre raised in the other hand
- HIT: upper body leaning backwards, eyes closed, the sword tilting, one hand raised
- PORT: Show the gold circlet with the owl, the stubble beard, the gold spiral pendant, the gold shoulder plate and the royal-blue cape with the gold brooch.
- FRONT: Sword raised in the right hand, the gold sceptre with the little owl in the left, the red thread coil at the belt.
- BACK: Show the long royal-blue cape with the white lining and gold border, the gold circlet and the raised sword.

## hero_theseus_vic_pr | Theseus, Minotauri Victor

- ROLE: the same legendary hero Theseus, now the prestige form Minotauri Victor (the slayer of the Minotaur)
- FMT: the finished 3-cell sheet of the same hero Theseus in his specialisation form: it shows the format; the new prestige form keeps the same man's face but has richer equipment
- INTRO: The attached image is the six-cell sprite sheet of the same hero Theseus in his specialisation form: the new form is THE SAME MAN, with the same face as always: fair skin, short wavy medium-brown hair, a short neat stubble beard, grey-green eyes, a strong jaw, a calm heroic look, a gold spiral pendant (a labyrinth) on a cord at his neck, now at the height of his legend (prestige form): richer and more impressive than before, with finer details, a more splendid cape and a glow around him, as described below. Use the attached image for the face, build, pixel size, outline, palette style and the six-cell layout, but do NOT copy his old clothing or weapons.
- OUTFIT: He wears: a magnificent heavy bronze-and-gold Corinthian helmet pushed back so the face is fully open and clearly visible (the same face as always: fair skin, short wavy medium-brown hair, a short neat stubble beard, grey-green eyes, a strong jaw, a calm heroic look, a gold spiral pendant (a labyrinth) on a cord at his neck, a proud, victorious look), crowned with a pair of big curved bull horns taken from the Minotaur as a trophy and a tall deep-blue crest; a splendid heavy armour of polished bronze and gold scales with large gold shoulder plates over a white tunic with gold embroidery; a LONG royal-blue cape down to the calves with a gold border, pinned with a large round gold brooch; gold greaves; the coil of bright red thread at his belt. In his left hand a huge ROUND gold-rimmed bronze shield with a glowing gold spiral labyrinth and a small bull head in the centre. In his right hand a strong spear with a long polished silver head and a gold-banded shaft. Around the figure a faint glow: a few tiny sparkle pixels, kept close to the body and completely inside the cell.
- REST: standing firmly, facing the viewer, the huge shining shield at his left side, the spear held upright beside him
- ATTACK: one step forward, the spear thrust forward over the top of the raised shield
- HIT: upper body leaning backwards, eyes closed, the shield sagging, the spear tilting
- PORT: Show the horned bronze-and-gold helmet with the blue crest, the stubble beard, the gold spiral pendant and the gold shoulder plate.
- FRONT: The huge shining shield with the golden labyrinth raised on the left arm, the spear held ready in the right hand, the bull horns on the helmet.
- BACK: Show the back of the huge round shield with its gold rim, the long blue cape with the gold border, the horned helmet and the spear.

## hero_theseus_rex_pr | Theseus, Rex Athenarum

- ROLE: the same legendary hero Theseus, now the prestige form Rex Athenarum (the king of the Athenians, founder of the city)
- FMT: the finished 3-cell sheet of the same hero Theseus in his specialisation form: it shows the format; the new prestige form keeps the same man's face but has richer equipment
- INTRO: The attached image is the six-cell sprite sheet of the same hero Theseus in his specialisation form: the new form is THE SAME MAN, with the same face as always: fair skin, short wavy medium-brown hair, a short neat stubble beard, grey-green eyes, a strong jaw, a calm heroic look, a gold spiral pendant (a labyrinth) on a cord at his neck, now at the height of his legend (prestige form): richer and more impressive than before, with finer details, a more splendid cape and a glow around him, as described below. Use the attached image for the face, build, pixel size, outline, palette style and the six-cell layout, but do NOT copy his old clothing or weapons.
- OUTFIT: He wears: a splendid GOLD crown with an owl in the centre and tall gold points on his short wavy brown hair, the face fully open and clearly visible (the same face as always: fair skin, short wavy medium-brown hair, a short neat stubble beard, grey-green eyes, a strong jaw, a calm heroic look, a gold spiral pendant (a labyrinth) on a cord at his neck, a wise and noble look); a magnificent ceremonial armour of polished white-and-gold plates with a gold owl emblem on the chest and large gold shoulder plates over a white tunic with gold embroidery; a LONG, rich, shimmering royal PURPLE mantle down to the ground with a white-ermine collar, a wide gold border and a large round gold brooch; gold bracers and gold greaves; a gold-studded belt with the coil of bright red thread. NO shield. In his right hand a straight sword with a polished silver blade and an ornate gold hilt, raised high. In his left hand a tall golden sceptre topped with a shining golden owl. Around the figure a faint glow: a few tiny sparkle pixels, kept close to the body and completely inside the cell.
- REST: standing tall and noble, facing the viewer, the sword resting on his shoulder, the golden sceptre at his side
- ATTACK: one step forward, the sword pointing forward in command, the golden sceptre raised in the other hand
- HIT: upper body leaning backwards, eyes closed, the sword tilting, one hand raised
- PORT: Show the golden crown with the owl, the stubble beard, the gold spiral pendant, the large gold shoulder plate and the purple mantle with the white collar.
- FRONT: Sword raised in the right hand, the tall golden owl sceptre in the left, the white-and-gold armour with the owl emblem.
- BACK: Show the long purple mantle with the gold border, the golden crown and the raised sword.

## hero_atalanta | Atalanta

- ROLE: legendary hero, the swift huntress of Greece who outran every suitor (ranged)
- FMT: the finished 3-cell sheet of the Greek recruit Ephebus: portrait, battle front, battle back
- INTRO: The attached image is a six-cell sprite sheet of a Greek soldier: it shows only the required LAYOUT, pose list, pixel size and level of detail. The new character is a legendary hero, NOT a soldier: entirely different clothing, colours and equipment as described below; do NOT copy the soldier's clothing, colours or shield.
- OUTFIT: She wears: a green cloth bandana tied around her forehead, NO helmet, the face clearly visible (olive skin, bright amber eyes, a lively determined look) with a long thick dark-brown braid hanging over her right shoulder tied with a green ribbon; a small gold apple pendant on a thin cord at her neck; a sleeveless tunic of patched tan leather over a short cream chiton, a brown leather belt with a hunting knife, a SHORT forest-green cape pinned at the left shoulder with a small bronze brooch, brown leather bracers, leather-wrapped boots laced to the calf; NO shield. In her left hand a short wooden hunting bow, over her back a brown leather quiver with green-feathered arrows.
- REST: standing light and alert, facing the viewer, the short bow held low in her left hand
- ATTACK: one step forward, the bow drawn with an arrow aimed forward, the short green cape swinging behind her
- HIT: upper body leaning backwards, eyes closed, the bow dropping, one hand raised
- PORT: Show the green bandana, the long dark-brown braid with the green ribbon, the alert amber eyes, the gold apple pendant and the short green cape with the bronze brooch.
- FRONT: The short bow held ready in the left hand, the quiver with green-feathered arrows visible over her shoulder, the hunting knife at the belt.
- BACK: Show the long braid down her back, the short green cape, the quiver with its green-feathered arrows and the bow.

## hero_atalanta_sag | Atalanta, Sagittaria

- ROLE: the same legendary hero Atalanta, now the master markswoman (Sagittaria), archer
- FMT: the finished 3-cell sheet of the same hero Atalanta in her base form: it shows the format; the new form keeps the same woman's face but has new equipment
- INTRO: The attached image is the six-cell sprite sheet of the same hero Atalanta in her base form: the new form is THE SAME WOMAN, with the same face as always: olive skin, a long thick dark-brown braid hanging over her right shoulder tied with a green ribbon, bright amber eyes, a lively determined look, a small gold apple pendant on a thin cord at her neck, but she has changed her equipment and bearing as described below. Use the attached image for the face, build, pixel size, outline, palette style and the six-cell layout, but do NOT copy her old clothing or weapons.
- OUTFIT: She wears: a green cloth bandana with a small gold leaf at the brow, NO helmet, the face fully open and clearly visible (the same face as always: olive skin, a long thick dark-brown braid hanging over her right shoulder tied with a green ribbon, bright amber eyes, a lively determined look, a small gold apple pendant on a thin cord at her neck); a fitted light armour of dark-green leather with bronze studs and small bronze shoulder guards over a short cream chiton; a SHORT forest-green cape; a broad brown leather belt with a gold buckle; brown leather bracers with bronze plates; leather boots laced to the calf. NO shield. In both hands a long recurve bow of dark polished wood with gold tips and a green string; on her back a big brown leather quiver full of green-feathered arrows.
- REST: standing tall and steady, facing the viewer, the long recurve bow held low in her left hand
- ATTACK: one step forward, the long bow fully drawn with an arrow aimed forward, the short green cape swinging behind her
- HIT: upper body leaning backwards, eyes closed, the bow tilting, one hand raised
- PORT: Show the green bandana with the gold leaf, the long braid with the green ribbon, the gold apple pendant, the bronze shoulder guard and the green cape.
- FRONT: The long recurve bow held ready in the left hand, an arrow in the right, the big quiver with green-feathered arrows over her shoulder, the dark-green leather armour.
- BACK: Show the long braid, the short green cape, the big quiver full of arrows and the long bow.

## hero_atalanta_sag_pr | Atalanta, Venatrix Dianae

- ROLE: the same legendary hero Atalanta, now the prestige form Venatrix Dianae (the huntress of Diana)
- FMT: the finished 3-cell sheet of the same hero Atalanta in her specialisation form: it shows the format; the new prestige form keeps the same woman's face but has richer equipment
- INTRO: The attached image is the six-cell sprite sheet of the same hero Atalanta in her specialisation form: the new form is THE SAME WOMAN, with the same face as always: olive skin, a long thick dark-brown braid hanging over her right shoulder tied with a green ribbon, bright amber eyes, a lively determined look, a small gold apple pendant on a thin cord at her neck, now at the height of her legend (prestige form): richer and more impressive than before, with finer details, a more splendid cape and a glow around her, as described below. Use the attached image for the face, build, pixel size, outline, palette style and the six-cell layout, but do NOT copy her old clothing or weapons.
- OUTFIT: She wears: a thin silver-and-gold circlet with a small silver crescent moon at the brow instead of a bandana, the face fully open and clearly visible (the same face as always: olive skin, a long thick dark-brown braid hanging over her right shoulder tied with a green ribbon, bright amber eyes, a lively determined look, a small gold apple pendant on a thin cord at her neck); a splendid fitted armour of white-and-gold leather with gold plates and silver crescent-moon ornaments on the shoulders over a short white chiton with gold embroidery; a LONG, rich, flowing GOLD cape with a forest-green lining and a gold border, pinned with a round gold brooch; a gold-buckled belt; gold bracers; gold-trimmed boots. NO shield. In her hands a magnificent long recurve bow of white wood with a gold crescent at each end and a glowing silver string, an arrow with a bright glowing silver tip aimed forward; on her back a golden quiver with white-and-gold feathered arrows. Around the figure a faint glow: a few tiny sparkle pixels, kept close to the body and completely inside the cell.
- REST: standing tall and radiant, facing the viewer, the long glowing bow held low in her left hand
- ATTACK: one step forward, the long bow fully drawn with a glowing arrow aimed forward, the long gold cape swinging behind her
- HIT: upper body leaning backwards, eyes closed, the bow tilting, one hand raised
- PORT: Show the silver crescent circlet, the long braid with the green ribbon, the gold apple pendant, the gold-and-silver shoulder plate and the gold cape with the green lining.
- FRONT: The long glowing bow held ready in the left hand, the glowing arrow in the right, the golden quiver over her shoulder, the white-and-gold armour with crescent moons.
- BACK: Show the long braid, the long gold cape with its green lining and gold border, the golden quiver and the glowing bow.

## hero_atalanta_cur | Atalanta, Cursor

- ROLE: the same legendary hero Atalanta, now the swiftest runner of Greece (Cursor), scout
- FMT: the finished 3-cell sheet of the same hero Atalanta in her base form: it shows the format; the new form keeps the same woman's face but has new equipment
- INTRO: The attached image is the six-cell sprite sheet of the same hero Atalanta in her base form: the new form is THE SAME WOMAN, with the same face as always: olive skin, a long thick dark-brown braid hanging over her right shoulder tied with a green ribbon, bright amber eyes, a lively determined look, a small gold apple pendant on a thin cord at her neck, but she has changed her equipment and bearing as described below. Use the attached image for the face, build, pixel size, outline, palette style and the six-cell layout, but do NOT copy her old clothing or weapons.
- OUTFIT: She wears: a red cloth bandana tied around her forehead with the ends fluttering behind her, NO helmet, the face fully open and clearly visible (the same face as always: olive skin, a long thick dark-brown braid hanging over her right shoulder tied with a green ribbon, bright amber eyes, a lively determined look, a small gold apple pendant on a thin cord at her neck); the braid swinging free; a very light sleeveless short tunic of pale tan cloth with a bare midriff and a thin brown leather harness across the chest, NO cape; a narrow leather belt with a small pouch; bare arms with thin leather wrist wraps; light leather sandals laced high around the calf. NO shield. In her right hand a slim light throwing javelin with a leaf-shaped bronze tip, in her left hand a second shorter javelin.
- REST: standing on the balls of her feet, facing the viewer, one javelin held low in each hand, ready to sprint
- ATTACK: a long running lunge forward, the right javelin thrust forward, the braid and the bandana ends flying behind her
- HIT: upper body leaning backwards, eyes closed, the javelins dropping, one hand raised
- PORT: Show the red bandana with the fluttering ends, the long braid, the sharp amber eyes, the gold apple pendant and the brown leather harness.
- FRONT: A javelin in each hand held ready, the light tan tunic, the leather harness and the light sandals, no cape.
- BACK: Show the long braid flying, the red bandana ends, the leather harness straps and the javelins.

## hero_atalanta_cur_pr | Atalanta, Velocissima

- ROLE: the same legendary hero Atalanta, now the prestige form Velocissima (the swiftest of all)
- FMT: the finished 3-cell sheet of the same hero Atalanta in her specialisation form: it shows the format; the new prestige form keeps the same woman's face but has richer equipment
- INTRO: The attached image is the six-cell sprite sheet of the same hero Atalanta in her specialisation form: the new form is THE SAME WOMAN, with the same face as always: olive skin, a long thick dark-brown braid hanging over her right shoulder tied with a green ribbon, bright amber eyes, a lively determined look, a small gold apple pendant on a thin cord at her neck, now at the height of her legend (prestige form): richer and more impressive than before, with finer details, a more splendid cape and a glow around her, as described below. Use the attached image for the face, build, pixel size, outline, palette style and the six-cell layout, but do NOT copy her old clothing or weapons.
- OUTFIT: She wears: a golden headband with two small white wings at the temples instead of a bandana, the face fully open and clearly visible (the same face as always: olive skin, a long thick dark-brown braid hanging over her right shoulder tied with a green ribbon, bright amber eyes, a lively determined look, a small gold apple pendant on a thin cord at her neck); the braid tied with a gold ribbon; a light tunic of white-and-gold cloth with gold embroidery and a gold-studded leather harness; a SHORT flowing GOLD cape that streams behind her like wind; gold bracers; light golden sandals with small white wings at the ankles. NO shield. In her right hand a slim polished javelin with a gold shaft and a shining silver tip; in her left hand a shining golden apple that glows with a warm light. Around the figure a faint glow: a few tiny sparkle pixels and small white speed lines, kept close to the body and completely inside the cell.
- REST: standing on the balls of her feet, facing the viewer, the javelin low in her right hand, the glowing golden apple held up in her left
- ATTACK: a long running lunge forward, the golden javelin thrust forward, the gold cape and the braid streaming behind her
- HIT: upper body leaning backwards, eyes closed, the javelin dropping, one hand raised
- PORT: Show the winged golden headband, the long braid with the gold ribbon, the glowing golden apple pendant, the gold shoulder strap and the gold cape.
- FRONT: The golden javelin held ready in the right hand, the glowing golden apple in the left, the white-and-gold tunic, the winged golden sandals.
- BACK: Show the long braid with the gold ribbon, the short gold cape streaming like wind, the winged sandals and the javelin.

## hero_iason | Iason

- ROLE: legendary hero, the leader of the Argonauts who sailed for the Golden Fleece (infantry)
- FMT: the finished 3-cell sheet of the Greek recruit Ephebus: portrait, battle front, battle back
- INTRO: The attached image is a six-cell sprite sheet of a Greek soldier: it shows only the required LAYOUT, pose list, pixel size and level of detail. The new character is a legendary hero, NOT a soldier: entirely different clothing, colours and equipment as described below; do NOT copy the soldier's clothing, colours or shield.
- OUTFIT: He wears: a plain bronze open-faced helmet with cheek guards and NO crest, the face fully visible (tanned skin, short tousled blond hair showing under the helmet, clean-shaven, bright blue eyes, a confident boyish smile); a small gold anchor pendant on a cord at his neck; a bronze breastplate over a deep-blue sea-coloured tunic; a SHORT golden-yellow cape pinned at the right shoulder with a round bronze brooch; a brown leather belt with a bronze buckle; bronze bracers; brown leather sandals laced to the calf; NO shield. In his right hand a straight sword with a silver blade and a bronze hilt.
- REST: standing upright and confident, facing the viewer, the sword pointing down in his right hand
- ATTACK: one step forward, the sword thrust forward, the short golden cape swinging behind him
- HIT: upper body leaning backwards, eyes closed, the sword dropping, one hand raised
- PORT: Show the bronze open helmet, the blond hair, the confident smile, the gold anchor pendant, the bronze breastplate collar and the short golden cape with the bronze brooch.
- FRONT: Sword held ready in the right hand, the bronze breastplate over the deep-blue tunic, the short golden cape.
- BACK: Show the short golden cape, the back of the open bronze helmet with the blond hair, and the sword.

## hero_iason_dra | Iason, Draconis Victor

- ROLE: the same legendary hero Iason, now the dragon slayer (Draconis Victor), hoplite
- FMT: the finished 3-cell sheet of the same hero Iason in his base form: it shows the format; the new form keeps the same man's face but has new equipment
- INTRO: The attached image is the six-cell sprite sheet of the same hero Iason in his base form: the new form is THE SAME MAN, with the same face as always: tanned skin, short tousled blond hair, clean-shaven, bright blue eyes, a confident boyish smile, a small gold anchor pendant on a cord at his neck, but he has changed his equipment and bearing as described below. Use the attached image for the face, build, pixel size, outline, palette style and the six-cell layout, but do NOT copy his old clothing or weapons.
- OUTFIT: He wears: a heavy bronze Corinthian helmet pushed back so the face is fully open and clearly visible (the same face as always: tanned skin, short tousled blond hair, clean-shaven, bright blue eyes, a confident boyish smile, a small gold anchor pendant on a cord at his neck), with a tall crest of dark-green dragon scales; a heavy bronze scale armour with a dragon-tooth trophy on the chest and large bronze shoulder plates over a deep-blue tunic; a short golden-yellow cape; bronze greaves; the small gold anchor pendant. In his left hand a big ROUND dark-green-and-bronze shield covered in a dragon-scale pattern with a gold rim. In his right hand a strong spear with a silver leaf-shaped head.
- REST: standing firmly, facing the viewer, the big round dragon-scale shield at his left side, the spear held upright beside him
- ATTACK: one step forward, the spear thrust forward over the top of the raised shield
- HIT: upper body leaning backwards, eyes closed, the shield sagging, the spear tilting
- PORT: Show the bronze helmet pushed back with the green dragon-scale crest, the blond hair, the confident smile, the gold anchor pendant and the bronze scale armour.
- FRONT: The big round dragon-scale shield raised on the left arm, the spear held ready in the right hand, the dragon-tooth trophy on the chest.
- BACK: Show the back of the big round green shield, the short golden cape, the green dragon-scale crest and the spear.

## hero_iason_dra_pr | Iason, Aurei Velleris Dominus

- ROLE: the same legendary hero Iason, now the prestige form Aurei Velleris Dominus (the lord of the Golden Fleece)
- FMT: the finished 3-cell sheet of the same hero Iason in his specialisation form: it shows the format; the new prestige form keeps the same man's face but has richer equipment
- INTRO: The attached image is the six-cell sprite sheet of the same hero Iason in his specialisation form: the new form is THE SAME MAN, with the same face as always: tanned skin, short tousled blond hair, clean-shaven, bright blue eyes, a confident boyish smile, a small gold anchor pendant on a cord at his neck, now at the height of his legend (prestige form): richer and more impressive than before, with finer details, a more splendid cape and a glow around him, as described below. Use the attached image for the face, build, pixel size, outline, palette style and the six-cell layout, but do NOT copy his old clothing or weapons.
- OUTFIT: He wears: a magnificent heavy gold-and-bronze Corinthian helmet pushed back so the face is fully open and clearly visible (the same face as always: tanned skin, short tousled blond hair, clean-shaven, bright blue eyes, a confident boyish smile, a small gold anchor pendant on a cord at his neck), with a tall crest of shining gold; a splendid ceremonial gold armour with gold shoulder plates over a white tunic with gold embroidery; the shimmering GOLDEN FLEECE, a thick curly golden sheepskin, draped over his shoulders like a cape with a large round gold brooch; gold greaves; the small gold anchor pendant. In his left hand a huge gold TOWER shield with a golden ram's head as emblem. In his right hand a strong spear with a long polished silver head and a gold-banded shaft. Around the figure a faint glow: a few tiny sparkle pixels, kept close to the body and completely inside the cell.
- REST: standing firmly and radiant, facing the viewer, the huge gold tower shield at his left side, the spear held upright beside him
- ATTACK: one step forward, the spear thrust forward over the top of the raised tower shield
- HIT: upper body leaning backwards, eyes closed, the shield sagging, the spear tilting
- PORT: Show the gold helmet pushed back with the tall gold crest, the blond hair, the confident smile, the gold anchor pendant, the gold shoulder plate and the curly golden fleece on his shoulders.
- FRONT: The huge gold tower shield with the ram's head raised on the left arm, the spear held ready in the right hand, the golden fleece on his shoulders.
- BACK: Show the back of the huge gold shield, the golden fleece hanging down his back, the gold crest and the spear.

## hero_iason_arg | Iason, Argonauta

- ROLE: the same legendary hero Iason, now the captain of the Argo (Argonauta), commander
- FMT: the finished 3-cell sheet of the same hero Iason in his base form: it shows the format; the new form keeps the same man's face but has new equipment
- INTRO: The attached image is the six-cell sprite sheet of the same hero Iason in his base form: the new form is THE SAME MAN, with the same face as always: tanned skin, short tousled blond hair, clean-shaven, bright blue eyes, a confident boyish smile, a small gold anchor pendant on a cord at his neck, but he has changed his equipment and bearing as described below. Use the attached image for the face, build, pixel size, outline, palette style and the six-cell layout, but do NOT copy his old clothing or weapons.
- OUTFIT: He wears: a bronze open-faced helmet with a small blue plume on top, the face fully open and clearly visible (the same face as always: tanned skin, short tousled blond hair, clean-shaven, bright blue eyes, a confident boyish smile, a small gold anchor pendant on a cord at his neck); a polished bronze cuirass with a gold anchor emblem on the chest and gold shoulder plates over a deep-blue tunic; a LONG royal-blue cape down to the calves with a white lining, pinned with a round gold brooch; a coil of brown ship's rope and a small rolled sea chart hanging from his belt; bronze bracers and greaves. NO shield. In his right hand a straight sword with a silver blade and a gold hilt, raised in command.
- REST: standing tall and commanding, facing the viewer, the sword resting on his shoulder
- ATTACK: one step forward, the sword pointing forward in command, the long blue cape swinging behind him
- HIT: upper body leaning backwards, eyes closed, the sword tilting, one hand raised
- PORT: Show the bronze helmet with the blue plume, the blond hair, the confident smile, the gold anchor pendant, the gold shoulder plate and the long blue cape with the brooch.
- FRONT: Sword raised in the right hand, the gold anchor emblem on the cuirass, the coil of rope and the sea chart at the belt.
- BACK: Show the long royal-blue cape with the white lining, the blue plume on the helmet and the raised sword.

## hero_iason_arg_pr | Iason, Dux Argonautarum

- ROLE: the same legendary hero Iason, now the prestige form Dux Argonautarum (the leader of the Argonauts)
- FMT: the finished 3-cell sheet of the same hero Iason in his specialisation form: it shows the format; the new prestige form keeps the same man's face but has richer equipment
- INTRO: The attached image is the six-cell sprite sheet of the same hero Iason in his specialisation form: the new form is THE SAME MAN, with the same face as always: tanned skin, short tousled blond hair, clean-shaven, bright blue eyes, a confident boyish smile, a small gold anchor pendant on a cord at his neck, now at the height of his legend (prestige form): richer and more impressive than before, with finer details, a more splendid cape and a glow around him, as described below. Use the attached image for the face, build, pixel size, outline, palette style and the six-cell layout, but do NOT copy his old clothing or weapons.
- OUTFIT: He wears: a gold laurel crown on his short blond hair instead of a helmet, the face fully open and clearly visible (the same face as always: tanned skin, short tousled blond hair, clean-shaven, bright blue eyes, a confident boyish smile, a small gold anchor pendant on a cord at his neck); a magnificent ceremonial armour of polished white-and-gold plates with a gold anchor emblem on the chest and large gold shoulder plates over a white tunic with gold embroidery; a LONG, rich, shimmering golden-yellow mantle down to the ground with a deep-blue lining, a wide gold border and a large round gold brooch; gold bracers and gold greaves. NO shield. In his right hand a straight sword with a polished silver blade and an ornate gold hilt, raised high. In his left hand a tall golden standard topped with a golden ship's prow (the prow of the Argo) with a small blue banner. Around the figure a faint glow: a few tiny sparkle pixels, kept close to the body and completely inside the cell.
- REST: standing tall and noble, facing the viewer, the sword resting on his shoulder, the golden standard at his side
- ATTACK: one step forward, the sword pointing forward in command, the golden standard raised in the other hand
- HIT: upper body leaning backwards, eyes closed, the sword tilting, one hand raised
- PORT: Show the gold laurel crown, the blond hair, the confident smile, the gold anchor pendant, the large gold shoulder plate and the golden mantle with the blue lining.
- FRONT: Sword raised in the right hand, the tall golden standard with the ship's prow in the left, the white-and-gold armour with the anchor emblem.
- BACK: Show the long golden mantle with the blue lining and gold border, the gold laurel crown and the raised sword.

## hero_achilles | Achilles

- ROLE: legendary hero, the greatest warrior of the Greeks before Troy (infantry)
- FMT: the finished 3-cell sheet of the Greek recruit Ephebus: portrait, battle front, battle back
- INTRO: The attached image is a six-cell sprite sheet of a Greek soldier: it shows only the required LAYOUT, pose list, pixel size and level of detail. The new character is a legendary hero, NOT a soldier: entirely different clothing, colours and equipment as described below; do NOT copy the soldier's clothing, colours or shield.
- OUTFIT: He wears: a plain gold-bronze open-faced helmet with a short red horsehair crest, the face fully visible (fair skin, shoulder-length wavy golden-blond hair flowing from under the helmet, steel-grey eyes, proud sharp features); a gold armband with a small red gem on his left upper arm; a ceremonial polished gold-bronze muscle cuirass over a short deep-red tunic; gold shoulder plates; a SHORT crimson cape pinned at the right shoulder with a round gold brooch; a brown leather belt with a gold buckle; gold bracers; gold greaves and brown sandals; NO shield. In his right hand a straight sword with a silver blade and a gold hilt.
- REST: standing proud and upright, facing the viewer, the sword pointing down in his right hand
- ATTACK: one step forward, the sword thrust forward, the short crimson cape swinging behind him
- HIT: upper body leaning backwards, eyes closed, the sword dropping, one hand raised
- PORT: Show the open gold helmet with the red crest, the flowing blond hair, the proud look, the gold shoulder plate, the cuirass collar and the short crimson cape with the brooch.
- FRONT: Sword held ready in the right hand, the gold muscle cuirass, the gold armband with the red gem, the short crimson cape.
- BACK: Show the short crimson cape, the red helmet crest with the flowing blond hair and the sword.

## hero_achilles_myr | Achilles, Heros Myrmidonum

- ROLE: the same legendary hero Achilles, now the champion of the Myrmidons (Heros Myrmidonum), brute fighter
- FMT: the finished 3-cell sheet of the same hero Achilles in his base form: it shows the format; the new form keeps the same man's face but has new equipment
- INTRO: The attached image is the six-cell sprite sheet of the same hero Achilles in his base form: the new form is THE SAME MAN, with the same face as always: fair skin, shoulder-length wavy golden-blond hair, steel-grey eyes, proud sharp features, a gold armband with a small red gem on his left upper arm, but he has changed his equipment and bearing as described below. Use the attached image for the face, build, pixel size, outline, palette style and the six-cell layout, but do NOT copy his old clothing or weapons.
- OUTFIT: He wears: NO helmet, the face fully open and clearly visible (the same face as always: fair skin, shoulder-length wavy golden-blond hair, steel-grey eyes, proud sharp features, a gold armband with a small red gem on his left upper arm), the golden-blond hair wild and flowing, a fierce battle-cry look; a broad bare muscular chest crossed by two thick brown leather straps with a gold disc, a huge bronze pauldron on his right shoulder only; a short tattered deep-red tunic; a ragged crimson war cloak tied at the neck; thick gold-studded leather bracers on both forearms; heavy bronze greaves. NO shield. In BOTH hands a huge long ash-wood spear (the Pelian spear) with a big leaf-shaped bronze head and a red tassel, held two-handed.
- REST: standing wide and menacing, facing the viewer, the huge spear held upright in both hands in front of him
- ATTACK: a big lunge forward, the huge spear thrust forward in both hands, the crimson war cloak swinging behind him
- HIT: upper body leaning backwards, eyes closed, the spear tilting, one hand raised
- PORT: Show the wild flowing blond hair, the fierce look, the bare chest with the leather straps and the gold disc, the big bronze pauldron and the red cloak.
- FRONT: The huge Pelian spear held ready in both hands, the bare muscular chest with the crossed straps, the bronze pauldron, the gold-studded bracers.
- BACK: Show the long wild blond hair, the ragged crimson war cloak, the crossed straps and the huge spear.

## hero_achilles_myr_pr | Achilles, Pelides

- ROLE: the same legendary hero Achilles, now the prestige form Pelides (the son of Peleus, in the divine armour of Hephaestus)
- FMT: the finished 3-cell sheet of the same hero Achilles in his specialisation form: it shows the format; the new prestige form keeps the same man's face but has richer equipment
- INTRO: The attached image is the six-cell sprite sheet of the same hero Achilles in his specialisation form: the new form is THE SAME MAN, with the same face as always: fair skin, shoulder-length wavy golden-blond hair, steel-grey eyes, proud sharp features, a gold armband with a small red gem on his left upper arm, now at the height of his legend (prestige form): richer and more impressive than before, with finer details, a more splendid cape and a glow around him, as described below. Use the attached image for the face, build, pixel size, outline, palette style and the six-cell layout, but do NOT copy his old clothing or weapons.
- OUTFIT: He wears: a splendid gold open-faced crested helmet with a tall flowing crimson-and-gold crest, the face fully open and clearly visible (the same face as always: fair skin, shoulder-length wavy golden-blond hair, steel-grey eyes, proud sharp features, a gold armband with a small red gem on his left upper arm); the shining divine armour of Hephaestus, a full polished gold-and-white muscle cuirass engraved with fine patterns, huge gold shoulder plates, over a deep-red tunic; a LONG rich crimson cloak with a gold border and a large round gold brooch; gold bracers and gold greaves. In his left hand the great round golden Shield of Achilles with many concentric rings of tiny engraved scenes and a bright shining rim. In his right hand a huge long ash-wood spear with a big shining silver head and a gold-banded shaft. Around the figure a faint glow: a few tiny sparkle pixels, kept close to the body and completely inside the cell.
- REST: standing tall and radiant, facing the viewer, the great golden shield at his left side, the spear held upright beside him
- ATTACK: a big step forward, the spear thrust forward over the top of the raised golden shield, the cloak swinging behind him
- HIT: upper body leaning backwards, eyes closed, the shield sagging, the spear tilting
- PORT: Show the gold crested helmet with the flowing red-and-gold crest, the blond hair, the proud look, the huge gold shoulder plate and the crimson cloak.
- FRONT: The great round golden shield raised on the left arm, the huge spear held ready in the right hand, the gold-and-white divine armour.
- BACK: Show the back of the great golden shield, the long crimson cloak with its gold border, the flowing helmet crest and the spear.

## hero_achilles_aur | Achilles, Auriga Heros

- ROLE: the same legendary hero Achilles, now the hero of the war chariot (Auriga Heros), cavalry
- FMT: the finished 3-cell sheet of the same hero Achilles in his base form: it shows the format; the new form keeps the same man's face but has new equipment
- INTRO: The attached image is the six-cell sprite sheet of the same hero Achilles in his base form: the new form is THE SAME MAN, with the same face as always: fair skin, shoulder-length wavy golden-blond hair, steel-grey eyes, proud sharp features, a gold armband with a small red gem on his left upper arm, but he has changed his equipment and bearing as described below. Use the attached image for the face, build, pixel size, outline, palette style and the six-cell layout, but do NOT copy his old clothing or weapons.
- OUTFIT: He wears: an open-faced gold-bronze helmet with a tall red horsehair crest, the face fully open and clearly visible (the same face as always: fair skin, shoulder-length wavy golden-blond hair, steel-grey eyes, proud sharp features, a gold armband with a small red gem on his left upper arm); a gold-bronze muscle cuirass over a short deep-red tunic with gold shoulder plates; a short crimson cape; gold bracers. He stands in a light war CHARIOT with two golden wheels, a curved bronze front rail and a red-and-gold pennant, drawn by TWO galloping white horses with red plumes and bronze harness. In his left hand the leather reins, in his right hand a long spear with a silver head. The whole chariot with both horses is drawn as ONE complete figure, fully inside its cell with at least 4 pixel blocks of margin on every side.
- REST: standing in the halted chariot, facing the viewer, the two white horses standing side by side, the spear held upright in his right hand
- ATTACK: the chariot charging forward, the horses galloping, Achilles leaning forward with the spear couched forward in his right hand
- HIT: upper body leaning backwards, eyes closed, the horses rearing, the spear tilting
- PORT: Show the open gold helmet with the red crest, the flowing blond hair, the proud look, the gold shoulder plate and the short crimson cape.
- FRONT: Achilles standing in the golden chariot seen from the front, the two white horses in front of the chariot, the spear held upright, the reins in his left hand.
- BACK: Show the chariot seen from behind, the back of the golden wheels, Achilles standing in it with his crimson cape and the red helmet crest, the two white horses beyond it.

## hero_achilles_aur_pr | Achilles, Invictus

- ROLE: the same legendary hero Achilles, now the prestige form Invictus (the unconquered)
- FMT: the finished 3-cell sheet of the same hero Achilles in his specialisation form: it shows the format; the new prestige form keeps the same man's face but has richer equipment
- INTRO: The attached image is the six-cell sprite sheet of the same hero Achilles in his specialisation form: the new form is THE SAME MAN, with the same face as always: fair skin, shoulder-length wavy golden-blond hair, steel-grey eyes, proud sharp features, a gold armband with a small red gem on his left upper arm, now at the height of his legend (prestige form): richer and more impressive than before, with finer details, a more splendid cape and a glow around him, as described below. Use the attached image for the face, build, pixel size, outline, palette style and the six-cell layout, but do NOT copy his old clothing or weapons.
- OUTFIT: He wears: a splendid gold open-faced crested helmet with a tall flowing crimson-and-gold crest, the face fully open and clearly visible (the same face as always: fair skin, shoulder-length wavy golden-blond hair, steel-grey eyes, proud sharp features, a gold armband with a small red gem on his left upper arm); the shining divine armour of Hephaestus, a polished gold-and-white muscle cuirass with huge gold shoulder plates over a deep-red tunic; a LONG rich crimson cloak with a gold border; gold greaves, one small bright red glowing mark on the heel of the right greave. He stands in a magnificent golden war CHARIOT with great golden wheels with small white wings on the hubs, a carved gold front rail and a long red-and-gold banner, drawn by TWO galloping white horses with golden harness, golden plumes and glowing manes. In his left hand the golden reins, in his right hand a long spear with a shining silver head and a gold-banded shaft. Around the figure a faint glow: a few tiny sparkle pixels, kept close to the body and completely inside the cell. The whole chariot with both horses is drawn as ONE complete figure, fully inside its cell with at least 4 pixel blocks of margin on every side.
- REST: standing tall and radiant in the halted chariot, facing the viewer, the two white horses standing side by side, the spear held upright in his right hand
- ATTACK: the chariot charging forward, the horses galloping, Achilles leaning forward with the golden spear couched forward in his right hand, the cloak streaming behind him
- HIT: upper body leaning backwards, eyes closed, the horses rearing, the spear tilting
- PORT: Show the gold crested helmet with the flowing red-and-gold crest, the blond hair, the proud look, the huge gold shoulder plate and the crimson cloak.
- FRONT: Achilles standing in the golden chariot seen from the front, the two white horses with golden harness in front of the chariot, the spear held upright, the reins in his left hand.
- BACK: Show the chariot seen from behind, the golden winged wheels, Achilles standing in it with his long crimson cloak and the flowing helmet crest, the two white horses beyond it.
