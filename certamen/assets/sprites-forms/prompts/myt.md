# Beeldprompts Mythische wezens (volkscode myt)

Geschreven op 2026-10-23 (nog niet gegenereerd). Geen eigen anker: elke vorm gebruikt `gra_anker.png` als eerste bijlage (stijlreferentie). Blad A: `gra_anker.png` + A van de ouder (zonder ouder: + `rom_tiro_A.png`). Blad B: A van de vorm + een al klaar blad B (de eerste: `rom_tiro_B.png`, daarna bij voorkeur `myt_satyrus_B.png`); `{{FMT}}` = die B. Vul de `{{...}}` in per vorm; `{{FMT}}` = Satyrus; `{{SECOND}}` staat per vorm.

## Sjabloon blad A
```
Use the attached images as the exact reference. The FIRST image is the style reference (palette, outline, proportions and level of detail of the sprites). {{SECOND}}

Create ONE sprite sheet: canvas exactly 1536 x 1024 pixels, 16-bit JRPG pixel-art in the style of RPG Maker MV and classic Fire Emblem sprites. Layout: 3 columns by 2 rows of INVISIBLE cells, each cell exactly 512 x 512 pixels, the SAME character in all six cells. Background: one flat solid magenta #FF00FF, no gradient, no floor, no shadow on the ground. No magenta anywhere in the figure. IMPORTANT: the image contains NO TEXT of any kind: no labels, no captions, no pose names, no titles, no numbers and no letters anywhere, neither inside nor outside the cells.

CHARACTER: "{{NAME}}", mythical creature (tier {{TIER}}, branch {{BRANCH}}, role {{ROLE}}). {{OUTFIT}}

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

Style reference: match the attached reference sheet exactly in palette and shading. Use bright, saturated colours with strong contrast: bright, saturated colours with strong contrast; the creature must be clearly readable as a silhouette when shrunk to 48 pixels. Skin and face must stay clearly readable when the sprite is shrunk to 48 pixels (clear dark eyes, tan skin tone, mouth visible). Canvas exactly as stated. Do NOT draw any grid lines, borders or separators between the cells; the cells are only an invisible layout.

AVOID: NO TEXT OF ANY KIND (no labels, captions, pose names, titles, numbers or letters above, below or next to the figures); no logos or watermark; no frame, border, grid lines or separator lines drawn between the cells; no second figure; no change of clothing or colours between poses; no difference in scale between cells; no realistic or painterly shading; no blurry or anti-aliased edges; no gradients; no shadow on the ground; no floor; no magenta inside the figure.
```

## Sjabloon blad B
```
Use the attached images as reference. The FIRST image (the six-cell sprite sheet of {{NAME}}) shows THE SAME character to be redrawn: use it ONLY for the character's appearance and do NOT copy its six-cell layout. The SECOND image (the finished 3-cell sheet of the recruit {{FMT}}: portrait, battle front, battle back) shows the exact FORMAT, style, palette, outline, proportions and level of detail to follow (do NOT copy its clothing). Your output must have the same layout as the second image: ONE row of exactly three cells, never two rows and never six cells.

Create ONE sheet: canvas exactly 1536 x 512 pixels, 16-bit JRPG pixel-art in the style of RPG Maker MV and classic Fire Emblem sprites. Layout: ONE single row of exactly 3 INVISIBLE cells side by side (NOT six cells, NOT two rows), each exactly 512 x 512 pixels, the SAME character in all three. Background: one flat solid magenta #FF00FF, no gradient, no floor, no shadow on the ground. No magenta anywhere in the figure. IMPORTANT: the image contains NO TEXT of any kind: no labels, no captions, no pose names, no titles, no numbers and no letters anywhere, neither inside nor outside the cells.

CHARACTER: "{{NAME}}", mythical creature (tier {{TIER}}, branch {{BRANCH}}, role {{ROLE}}). {{OUTFIT}}

STYLE: chunky visible pixels, at most 24 colours, one dark-brown 1-pixel outline around the whole figure, flat cel-shading with at most two tones per colour, warm saturated fantasy colours, small chibi proportions (head about one third of body height), easy to read at small size.

PIXEL GRID: every cell is its own 64 x 64 pixel grid; every pixel is a block of 8 x 8 image pixels and all pixels in the whole image are exactly the same size. In cells 2 and 3 the figure is at most 56 of the 64 pixels tall with at least 4 blocks of empty magenta margin all around, feet on the same horizontal line in both cells, same size in both cells.

CELLS:
Cell 1, a bust portrait: bust, three-quarter view, looking slightly to the right of the image, a stern but friendly look, more detail in the face than in the sprites; the figure fills about 60 percent of the cell. {{PORT}}
Cell 2, full body seen from the front: full body, ready for battle, straight from the front at eye level, face towards the viewer. {{FRONT}}
Cell 3, full body seen from behind: the same body exactly from behind, with a slight angle from above. {{BACK}}

CONSISTENCY: the equipment stays the same in ALL cells and every part of the figure, including weapons, tools and banners, stays completely inside its own cell, at least 4 pixel blocks from the cell edges, never touching a neighbouring cell. Shield shape and emblem never change between cells.

Style reference: match the attached reference sheet exactly in palette and shading. Use bright, saturated colours with strong contrast: bright, saturated colours with strong contrast; the creature must be clearly readable as a silhouette when shrunk to 48 pixels. Skin and face must stay clearly readable when the sprite is shrunk to 48 pixels (clear dark eyes, tan skin tone, mouth visible). Canvas exactly as stated. Do NOT draw any grid lines, borders or separators between the cells; the cells are only an invisible layout.

AVOID: NO TEXT OF ANY KIND (no labels, captions, pose names, titles, numbers or letters above, below or next to the figures); no logos or watermark; no frame, border, grid lines or separator lines drawn between the cells; no second figure; no change of clothing or colours between cells; no difference in scale between cells 2 and 3; no realistic or painterly shading; no blurry or anti-aliased edges; no gradients; no shadow on the ground; no floor; no magenta inside the figure.
```

## myt_satyrus | Satyrus | tier 1 | Satyrs | ouder: -

- Blad A, bijlagen: `gra_anker.png` en `rom_tiro_A.png` (alleen stijlreferentie; geen eigen anker voor mythische wezens)
- SECOND: The SECOND image is the finished Roman recruit sheet (Tiro): use it ONLY for the sheet format, the pixel size, the outline and the pose layout; do NOT copy its clothing, body or face. This unit is a mythical creature, not a soldier.
- NAME: Satyrus; TIER: 1; BRANCH: Satyrs; ROLE: mythical creature
- OUTFIT: He is a young satyr, a friendly forest creature. He has: the upper body of a young man with warm tan skin, a cheerful grin, pointed ears and two small curved brown horns on top of curly brown hair with a wreath of green ivy leaves, face clearly visible (clear dark eyes); the legs of a goat with shaggy brown fur and dark hooves; a bare chest; a short green leaf-cloth tied at the waist; a small brown pouch. In his right hand a short knobbly wooden club; a golden reed pan-flute hangs on a cord at his belt. MOVEMENT in the walking poses: he trots on his goat legs.
- REST: standing relaxed on his goat legs, facing the viewer, the club resting on his shoulder
- ATTACK: one hop forward, the club swung forward in a wide swing
- HIT: recoiling backwards on his hooves, eyes closed, the club dropping, hand raised
- PORT: Show the curly hair with the ivy wreath, the small horns, the pointed ears and the cheerful grin.
- FRONT: Club held in the right hand, the pan-flute at his belt, the shaggy goat legs planted.
- BACK: Show the curly hair, the small horns, the short furry goat tail, the leaf-cloth and the club.

## myt_silenus | Silenus | tier 2 | Satyrs | ouder: Satyrus

- Blad A, bijlagen: `gra_anker.png` en `myt_satyrus_A.png`
- SECOND: The SECOND image is the finished sheet of the parent form (Satyrus): this creature is the next step of the SAME line, so keep the same colours and the same basic design, but bigger, stronger and richer.
- NAME: Silenus; TIER: 2; BRANCH: Satyrs; ROLE: mythical creature
- OUTFIT: He is Silenus, an old, jolly satyr. He has: the round upper body of a fat old man with rosy tan skin, a bald head with a fringe of white hair, a long fluffy white beard, pointed ears and two short curved horns, an ivy-and-grape wreath, face clearly visible (clear dark eyes, a merry smile); a big round belly; the legs of a goat with shaggy white-grey fur and dark hooves; a short purple cloth over one shoulder and a green leaf-cloth at the waist. In his right hand a tall wooden staff (thyrsus) topped with a green pine cone and ivy leaves; in his left hand a round leather wine-skin. MOVEMENT in the walking poses: he waddles on his goat legs.
- REST: standing relaxed on his goat legs, facing the viewer, the staff upright, the wine-skin held at his belly
- ATTACK: one step forward, the staff thrust forward, the wine-skin swinging
- HIT: recoiling backwards, eyes closed, the staff tilting, hand raised
- PORT: Show the bald head with the white fringe, the long white beard, the grape-and-ivy wreath and the merry smile.
- FRONT: Staff with the pine cone in the right hand, the wine-skin in the left hand, the round belly.
- BACK: Show the bald head, the short furry tail, the purple cloth over the shoulder and the staff.

## myt_nympha | Nympha | tier 1 | Nymphs | ouder: -

- Blad A, bijlagen: `gra_anker.png` en `rom_tiro_A.png` (alleen stijlreferentie)
- SECOND: The SECOND image is the finished Roman recruit sheet (Tiro): use it ONLY for the sheet format, the pixel size, the outline and the pose layout; do NOT copy its clothing, body or face. This unit is a mythical creature, not a soldier.
- NAME: Nympha; TIER: 1; BRANCH: Nymphs; ROLE: mythical creature
- OUTFIT: She is a young nymph, a friendly nature spirit. She has: light skin, long flowing light-green hair with small pink and white flowers woven in, pointed ears, bright green eyes, a gentle smile, face clearly visible; a short light-green dress made of overlapping leaves with a flower belt; bare feet with small leaf-ties; a thin gold bracelet. In her right hand a short wooden wand with a pink flower blossom on top that glows softly. MOVEMENT in the walking poses: she walks lightly on tiptoe.
- REST: standing lightly, facing the viewer, the flower wand held in front of her
- ATTACK: one step forward, the wand pointed forward with a small burst of pink petals flying out
- HIT: recoiling backwards, eyes closed, the wand dropping, hand raised, a few petals falling
- PORT: Show the long light-green hair with the flowers, the pointed ears and the green eyes.
- FRONT: Flower wand held in the right hand, the leaf dress and the flower belt.
- BACK: Show the long green hair with the flowers, the leaf dress and the wand.

## myt_dryas | Dryas | tier 2 | Nymphs | ouder: Nympha

- Blad A, bijlagen: `gra_anker.png` en `myt_nympha_A.png`
- SECOND: The SECOND image is the finished sheet of the parent form (Nympha): this creature is the next step of the SAME line, so keep the same colours and the same basic design, but bigger, stronger and richer.
- NAME: Dryas; TIER: 2; BRANCH: Nymphs; ROLE: mythical creature
- OUTFIT: She is a tree nymph, a dryad. She has: light skin with faint brown bark patterns on her arms, long wavy chestnut-brown hair with green oak leaves and small acorns woven in, pointed ears, golden-brown eyes, a calm smile, face clearly visible; a dress of overlapping green and brown oak leaves with a bark-brown belt; thin small branch-twigs growing from her shoulders like a collar; bare feet. In her right hand a tall gnarled wooden staff with a large golden acorn on top that glows softly; small green vines curl around her left hand. MOVEMENT in the walking poses: she walks steadily.
- REST: standing calmly, facing the viewer, the acorn staff upright beside her, the vines curling at her left hand
- ATTACK: one step forward, the staff pointed forward, vines shooting out from her left hand
- HIT: recoiling backwards, eyes closed, the staff tilting, leaves falling
- PORT: Show the chestnut hair with the oak leaves and acorns, the twig collar and the golden-brown eyes.
- FRONT: Acorn staff in the right hand, the vines at the left hand, the oak-leaf dress.
- BACK: Show the long wavy hair with the oak leaves, the twig collar, the leaf dress and the staff.

## myt_naias | Naias | tier 2 | Nymphs | ouder: Nympha

- Blad A, bijlagen: `gra_anker.png` en `myt_nympha_A.png`
- SECOND: The SECOND image is the finished sheet of the parent form (Nympha): this creature is the next step of the SAME line, so keep the same colours and the same basic design, but bigger, stronger and richer.
- NAME: Naias; TIER: 2; BRANCH: Nymphs; ROLE: mythical creature
- OUTFIT: She is a water nymph, a naiad. She has: pale light skin with a faint blue shimmer, long flowing sky-blue hair with white pearls and small shells, delicate fin-shaped ears, bright aqua eyes, a gentle smile, face clearly visible; a light-blue see-through dress with white foam-like trim and a pearl belt; a thin pearl necklace; bare feet. In her right hand a small clay water-jug (amphora) with a ribbon of water pouring out and curling around her like a snake of water. MOVEMENT in the walking poses: she glides lightly.
- REST: standing gracefully, facing the viewer, the water-jug held at her side with a thin stream of water flowing from it
- ATTACK: one step forward, the jug tipped forward and a wave of water rushing out in front of her
- HIT: recoiling backwards, eyes closed, the jug tilting, droplets flying
- PORT: Show the sky-blue hair with the pearls and shells, the fin-shaped ears and the pearl necklace.
- FRONT: Water-jug held in the right hand with the ribbon of water curling around her.
- BACK: Show the long sky-blue hair, the foam-trimmed dress, the pearl belt and the water-jug.

## myt_oreas | Oreas | tier 2 | Nymphs | ouder: Nympha

- Blad A, bijlagen: `gra_anker.png` en `myt_nympha_A.png`
- SECOND: The SECOND image is the finished sheet of the parent form (Nympha): this creature is the next step of the SAME line, so keep the same colours and the same basic design, but bigger, stronger and richer.
- NAME: Oreas; TIER: 2; BRANCH: Nymphs; ROLE: mythical creature
- OUTFIT: She is a mountain nymph, an oread. She has: light skin with rosy cheeks, long straight silver-white hair in one thick braid with small pale blue crystals woven in, pointed ears, ice-blue eyes, a determined smile, face clearly visible; a short slate-blue tunic with white fur trim; a thick white fur cloak with a silver clasp; grey leather boots with fur tops; silver bracers. In her right hand a tall light wooden spear with a glittering pale blue crystal as the spearhead. MOVEMENT in the walking poses: she climbs and strides sure-footed.
- REST: standing firmly, facing the viewer, the crystal spear held upright beside her
- ATTACK: one step forward, the crystal spear thrust forward, a few icy sparkles flying
- HIT: recoiling backwards, eyes closed, the spear tilting, hand raised
- PORT: Show the silver-white braid with the crystals, the ice-blue eyes and the white fur cloak with the silver clasp.
- FRONT: Crystal spear held in the right hand, the fur-trimmed tunic and boots.
- BACK: Show the thick silver braid, the white fur cloak, the boots and the crystal spear.

## myt_nereis | Nereis | tier 2 | Nymphs | ouder: Nympha

- Blad A, bijlagen: `gra_anker.png` en `myt_nympha_A.png`
- SECOND: The SECOND image is the finished sheet of the parent form (Nympha): this creature is the next step of the SAME line, so keep the same colours and the same basic design, but bigger, stronger and richer.
- NAME: Nereis; TIER: 2; BRANCH: Nymphs; ROLE: mythical creature
- OUTFIT: She is a sea nymph, a nereid. She has: light skin with a faint teal shimmer, long wavy teal-green hair with small pink corals and white shells, small fin-shaped ears, warm sea-green eyes, a bright smile, face clearly visible; a coral-pink dress with a scale pattern in teal and a wide shell belt; a necklace of shells and a pearl; bare feet. In her right hand a slim silver trident-staff with a large glowing white pearl between the prongs. MOVEMENT in the walking poses: she glides lightly with a rolling wave motion.
- REST: standing gracefully, facing the viewer, the pearl trident upright beside her
- ATTACK: one step forward, the trident thrust forward, a small wave rising in front of it
- HIT: recoiling backwards, eyes closed, the trident tilting, spray flying
- PORT: Show the teal hair with the corals and shells, the fin-shaped ears and the shell necklace with the pearl.
- FRONT: Pearl trident held in the right hand, the coral-pink scaled dress and the shell belt.
- BACK: Show the long teal hair with the corals, the scaled dress, the shell belt and the trident.

## myt_pulluscentauri | Pullus centauri | tier 1 | Centaurs | ouder: -

- Blad A, bijlagen: `gra_anker.png` en `rom_tiro_A.png` (alleen stijlreferentie)
- SECOND: The SECOND image is the finished Roman recruit sheet (Tiro): use it ONLY for the sheet format, the pixel size, the outline and the pose layout; do NOT copy its clothing, body or face. This unit is a mythical creature, not a soldier.
- NAME: Pullus centauri; TIER: 1; BRANCH: Centaurs; ROLE: mythical creature
- OUTFIT: He is a young centaur, a foal. He has: the upper body of a boy with tan skin, a tousled brown mane of hair and a cheerful face, face clearly visible (clear dark eyes, a cheeky grin) on a small chestnut-brown horse body with four slim legs, light hooves and a short brown tail; a thin brown leather strap across his chest; a small green cloth around his neck. In his right hand a short wooden practice spear with a small silver tip. The whole creature (horse body and boy) is ONE figure that fits inside the 56-pixel limit. MOVEMENT in the walking poses: he trots on four legs.
- REST: standing on four legs, facing the viewer, the practice spear held upright
- ATTACK: rearing slightly on the hind legs, the spear thrust forward
- HIT: recoiling backwards on his hind legs, eyes closed, the spear dropping
- PORT: Show the tousled brown hair, the cheeky grin, the green neck-cloth and the leather strap.
- FRONT: Practice spear in the right hand, the chestnut horse body with four legs seen from the front.
- BACK: Show the chestnut horse body from behind, the short tail, the boy's back with the leather strap and the spear.

## myt_centaurus | Centaurus | tier 2 | Centaurs | ouder: Pullus centauri

- Blad A, bijlagen: `gra_anker.png` en `myt_pulluscentauri_A.png`
- SECOND: The SECOND image is the finished sheet of the parent form (Pullus centauri): this creature is the next step of the SAME line, so keep the same colours and the same basic design, but bigger, stronger and richer.
- NAME: Centaurus; TIER: 2; BRANCH: Centaurs; ROLE: mythical creature
- OUTFIT: He is an adult centaur warrior. He has: the strong upper body of a man with tan skin, long wavy dark-brown hair and a short dark beard, face clearly visible (clear dark eyes, a firm look) on a large chestnut-brown horse body with four strong legs, dark hooves and a long dark tail; a broad brown leather strap across his chest with a bronze buckle; bronze arm guards; a short green cloak around his shoulders. In his right hand a long wooden spear with a silver leaf-shaped head; in his left hand a small round bronze-and-green shield. The whole creature fits inside the 56-pixel limit. MOVEMENT in the walking poses: he walks on four legs.
- REST: standing on four legs, facing the viewer, the spear upright, the shield on his arm
- ATTACK: rearing slightly on the hind legs, the spear thrust forward over the shield
- HIT: recoiling backwards on his hind legs, eyes closed, the shield sagging
- PORT: Show the long dark hair, the short beard, the bronze arm guards and the green cloak.
- FRONT: Spear in the right hand, round shield on the left arm, the large chestnut horse body seen from the front.
- BACK: Show the chestnut horse body from behind, the long dark tail, the green cloak and the spear.

## myt_centaurussagitta | Centaurus sagittarius | tier 3 | Centaurs | ouder: Centaurus

- Blad A, bijlagen: `gra_anker.png` en `myt_centaurus_A.png`
- SECOND: The SECOND image is the finished sheet of the parent form (Centaurus): this creature is the next step of the SAME line, so keep the same colours and the same basic design, but bigger, stronger and richer.
- NAME: Centaurus sagittarius; TIER: 3; BRANCH: Centaurs; ROLE: mythical creature
- OUTFIT: He is a centaur archer. He has: the strong upper body of a man with tan skin, long wavy dark-brown hair with a gold headband and a short dark beard, face clearly visible (clear dark eyes, a focused look) on a large dark-brown horse body with four strong legs, golden hooves and a long black tail; a broad leather strap across his chest with a gold buckle; gold arm bands; a short bright green cloak streaming behind; a large leather quiver with green-feathered arrows on his back. In his left hand a large curved composite bow with gold tips; in his right hand an arrow. The whole creature fits inside the 56-pixel limit. MOVEMENT in the walking poses: he walks on four legs.
- REST: standing on four legs, facing the viewer, the bow held at his side, an arrow in the right hand
- ATTACK: rearing slightly on the hind legs, drawing the bow and aiming forward
- HIT: recoiling backwards on his hind legs, eyes closed, the bow dropping
- PORT: Show the long dark hair with the gold headband, the short beard, the gold arm bands and the bow.
- FRONT: Large bow in the left hand, an arrow ready in the right hand, the dark horse body seen from the front.
- BACK: Show the dark horse body from behind, the long black tail, the quiver with the green-feathered arrows and the green cloak.

## myt_harpyia | Harpyia | tier 1 | Harpies | ouder: -

- Blad A, bijlagen: `gra_anker.png` en `rom_tiro_A.png` (alleen stijlreferentie)
- SECOND: The SECOND image is the finished Roman recruit sheet (Tiro): use it ONLY for the sheet format, the pixel size, the outline and the pose layout; do NOT copy its clothing, body or face. This unit is a mythical creature, not a soldier.
- NAME: Harpyia; TIER: 1; BRANCH: Harpies; ROLE: mythical creature
- OUTFIT: She is a harpy, a wild bird-woman. She has: the head and upper body of a woman with pale grey skin, wild untidy dark-purple hair, sharp golden eyes and a fierce grin, face clearly visible; large wings in place of arms, with dark purple and grey feathers; a body covered with grey-purple feathers from the waist down; strong yellow bird legs with big curved talons; a small gold ring in one ear. NO weapons. MOVEMENT in the walking poses: she hovers just above the ground with slow wing beats (feet still visible), instead of walking.
- REST: hovering just above the ground, facing the viewer, the wings half spread
- ATTACK: swooping one step forward, the talons thrust forward, the wings spread wide
- HIT: recoiling backwards, eyes closed, the wings folding in, feathers flying
- PORT: Show the wild dark-purple hair, the sharp golden eyes, the fierce grin and the gold earring.
- FRONT: Wings half spread, the feathered body and the yellow talons seen from the front.
- BACK: Show the wild hair, the wings seen from behind with the dark feathers and the tail feathers.

## myt_pullusgrypis | Pullus grypis | tier 1 | Griffins | ouder: -

- Blad A, bijlagen: `gra_anker.png` en `rom_tiro_A.png` (alleen stijlreferentie)
- SECOND: The SECOND image is the finished Roman recruit sheet (Tiro): use it ONLY for the sheet format, the pixel size, the outline and the pose layout; do NOT copy its clothing, body or face. This unit is a mythical creature, not a soldier.
- NAME: Pullus grypis; TIER: 1; BRANCH: Griffins; ROLE: mythical creature
- OUTFIT: It is a griffin chick: a small, fluffy creature with the head of an eagle chick with a yellow hooked beak, big round amber eyes and a tuft of white-gold down on the head, the body of a young lion cub with soft tawny fur, large paws with small claws, a tufted tail, and two tiny golden wing buds on its back. Cute but fierce. MOVEMENT in the walking poses: it waddles on four paws.
- REST: standing on four legs, facing the viewer, the tiny wings fluffed up, the tail swishing
- ATTACK: pouncing one step forward, the beak snapping forward and a front paw swiping
- HIT: recoiling backwards, eyes closed, the down feathers puffing out
- PORT: Show the eagle-chick head with the yellow beak, the big amber eyes and the white-gold down tuft.
- FRONT: The fluffy griffin chick seen from the front with the paws planted and the tiny wings.
- BACK: Show the tiny golden wings, the tawny back and the tufted tail.

## myt_gryps | Gryps | tier 2 | Griffins | ouder: Pullus grypis

- Blad A, bijlagen: `gra_anker.png` en `myt_pullusgrypis_A.png`
- SECOND: The SECOND image is the finished sheet of the parent form (Pullus grypis): this creature is the next step of the SAME line, so keep the same colours and the same basic design, but bigger, stronger and richer.
- NAME: Gryps; TIER: 2; BRANCH: Griffins; ROLE: mythical creature
- OUTFIT: It is a full-grown griffin: the head of a great eagle with a sharp yellow hooked beak, fierce amber eyes and a white-gold crest, a muscular tawny lion body, powerful front legs with eagle talons, lion hind legs, a tufted lion tail, and two large wings with golden-brown and white feathers. It stands proud and fierce. MOVEMENT in the walking poses: it strides on four legs with its wings folded.
- REST: standing proudly on four legs, facing the viewer, the wings half raised
- ATTACK: leaping one step forward, the wings spread wide, the beak and the front talons thrust forward
- HIT: recoiling backwards, eyes closed, the wings folding, feathers flying
- PORT: Show the great eagle head with the sharp beak, the amber eyes and the white-gold crest.
- FRONT: The griffin seen from the front with the wings half raised and the talons planted.
- BACK: Show the wings seen from behind with the golden-brown feathers, the tawny back and the tufted tail.

## myt_siren | Siren | tier 1 | Sirens | ouder: -

- Blad A, bijlagen: `gra_anker.png` en `rom_tiro_A.png` (alleen stijlreferentie)
- SECOND: The SECOND image is the finished Roman recruit sheet (Tiro): use it ONLY for the sheet format, the pixel size, the outline and the pose layout; do NOT copy its clothing, body or face. This unit is a mythical creature, not a soldier.
- NAME: Siren; TIER: 1; BRANCH: Sirens; ROLE: mythical creature
- OUTFIT: She is a siren, a bird-woman with a beautiful voice. She has: the head and upper body of a woman with light skin, very long flowing teal hair, bright blue eyes and an open singing mouth, face clearly visible; wings in place of arms, with blue-green and white feathers; a body covered with blue-green feathers from the waist down with a long tail of feathers; strong pale yellow bird legs with small talons; a gold circlet with a small blue gem. NO weapons. Pale blue ring-shaped sound waves ripple around her when she sings. MOVEMENT in the walking poses: she hovers just above the ground with slow wing beats (feet still visible), instead of walking.
- REST: hovering just above the ground, facing the viewer, the wings half spread, mouth open in a soft song
- ATTACK: swooping one step forward, wings spread wide, the mouth wide open and pale blue sound rings spreading forward
- HIT: recoiling backwards, eyes closed, the wings folding in, the sound rings breaking
- PORT: Show the long teal hair, the gold circlet with the blue gem, the blue eyes and the singing mouth.
- FRONT: Wings half spread, the feathered body and the sound rings around her seen from the front.
- BACK: Show the long teal hair flowing, the wings seen from behind and the long tail feathers.

## myt_cyclopspastor | Cyclops pastor | tier 1 | Cyclopes | ouder: -

- Blad A, bijlagen: `gra_anker.png` en `rom_tiro_A.png` (alleen stijlreferentie)
- SECOND: The SECOND image is the finished Roman recruit sheet (Tiro): use it ONLY for the sheet format, the pixel size, the outline and the pose layout; do NOT copy its clothing, body or face. This unit is a mythical creature, not a soldier.
- NAME: Cyclops pastor; TIER: 1; BRANCH: Cyclopes; ROLE: mythical creature
- OUTFIT: He is a cyclops shepherd, a big friendly one-eyed giant. He has: a large round head with ONE big round eye in the middle of the forehead (bright yellow iris, black pupil), shaggy dark-brown hair, a rough brown beard, a big nose and a wide goofy smile, face clearly visible; rough tan skin; a broad bare chest; a sheepskin tunic in cream and grey with a rope belt; bare legs with thick leather sandals. In his right hand a huge wooden shepherd's staff with a curled top; in his left hand a wooden milk pail. Chibi proportions: the head about one third of the body height. MOVEMENT in the walking poses: he stomps heavily.
- REST: standing heavily, facing the viewer, the shepherd's staff planted beside him, the milk pail held at his side
- ATTACK: one big step forward, the staff swung forward in a wide sweep
- HIT: recoiling backwards, the big eye squeezed shut, the pail dropping, hand raised
- PORT: Show the single big yellow eye, the shaggy hair, the rough beard and the goofy smile.
- FRONT: Staff held in the right hand, the milk pail in the left hand, the sheepskin tunic.
- BACK: Show the shaggy hair, the sheepskin tunic with the rope belt and the shepherd's staff.

## myt_cyclopsfaber | Cyclops faber | tier 2 | Cyclopes | ouder: Cyclops pastor

- Blad A, bijlagen: `gra_anker.png` en `myt_cyclopspastor_A.png`
- SECOND: The SECOND image is the finished sheet of the parent form (Cyclops pastor): this creature is the next step of the SAME line, so keep the same colours and the same basic design, but bigger, stronger and richer.
- NAME: Cyclops faber; TIER: 2; BRANCH: Cyclopes; ROLE: mythical creature
- OUTFIT: He is a cyclops smith, a big one-eyed blacksmith. He has: a large round head with ONE big round eye in the middle of the forehead (bright orange iris, black pupil), a bald head with a dark topknot, a thick black beard, a big nose and a gruff smile, face clearly visible; dark tan skin with soot smudges; a broad bare muscular chest; a thick brown leather apron with a rope belt and small tools hanging; bare muscular arms with thick leather wristbands; thick leather boots. In his right hand a huge hammer with a dark iron head; in his left hand long tongs holding a glowing orange-red piece of iron. Chibi proportions: the head about one third of the body height. MOVEMENT in the walking poses: he stomps heavily.
- REST: standing heavily, facing the viewer, the huge hammer resting on his shoulder, the glowing iron held in the tongs
- ATTACK: one big step forward, the huge hammer swung down in front of him with sparks flying
- HIT: recoiling backwards, the big eye squeezed shut, the hammer sagging, sparks flying
- PORT: Show the single big orange eye, the topknot, the thick black beard and the soot smudges.
- FRONT: Huge hammer in the right hand, the glowing iron in the tongs in the left hand, the leather apron.
- BACK: Show the topknot, the leather apron strings, the muscular back and the huge hammer.

## myt_hippocampus | Hippocampus | tier 1 | Sea-horses | ouder: -

- Blad A, bijlagen: `gra_anker.png` en `rom_tiro_A.png` (alleen stijlreferentie)
- SECOND: The SECOND image is the finished Roman recruit sheet (Tiro): use it ONLY for the sheet format, the pixel size, the outline and the pose layout; do NOT copy its clothing, body or face. This unit is a mythical creature, not a soldier.
- NAME: Hippocampus; TIER: 1; BRANCH: Sea-horses; ROLE: mythical creature
- OUTFIT: It is a hippocampus, a sea-horse: the front half of a white-and-pale-blue horse with a flowing mane made of sea-green fins, bright aqua eyes, two small fin ears and two front legs ending in webbed fins, and the back half of a long coiling blue-green fish tail with scales and a wide tail fin. It rests on a small low swirl of white foam. NO rider and NO tack. MOVEMENT in the walking poses: it swims and glides forward, riding on the foam, instead of walking.
- REST: floating on the low foam, facing the viewer, the fin mane flowing, the tail curled
- ATTACK: surging one step forward, the head thrust forward, the tail whipping and a small wave rising
- HIT: recoiling backwards, eyes closed, the fin mane drooping, spray flying
- PORT: Show the horse head with the sea-green fin mane, the aqua eyes and the fin ears.
- FRONT: The sea-horse seen from the front with the webbed front fins and the curled fish tail below.
- BACK: Show the fin mane from behind, the long scaled fish tail and the wide tail fin.

## myt_umbra | Umbra | tier 1 | Shades | ouder: -

- Blad A, bijlagen: `gra_anker.png` en `rom_tiro_A.png` (alleen stijlreferentie)
- SECOND: The SECOND image is the finished Roman recruit sheet (Tiro): use it ONLY for the sheet format, the pixel size, the outline and the pose layout; do NOT copy its clothing, body or face. This unit is a mythical creature, not a soldier.
- NAME: Umbra; TIER: 1; BRANCH: Shades; ROLE: mythical creature
- OUTFIT: It is an umbra, a shade of the underworld: a friendly translucent ghost in the shape of a hooded person, with a pale grey-blue body that fades into wisps of mist at the bottom, a dark grey hood, two large round softly glowing pale-blue eyes and a small gentle mouth, small ghostly hands. NO legs: the lower body is a ragged tail of mist. Draw it with the same dark-brown outline as everyone else, slightly semi-transparent colours but solid pixels (no gradients). In its right hand a small hovering pale blue wisp of light. MOVEMENT in the walking poses: it drifts forward, hovering just above the ground.
- REST: hovering gently, facing the viewer, the wisp of light floating above its hand
- ATTACK: drifting one step forward, the arms stretched forward and the wisp of light flying forward
- HIT: recoiling backwards, eyes squeezed shut, the mist tail scattering
- PORT: Show the dark grey hood, the two big pale-blue eyes and the small gentle mouth.
- FRONT: The hooded shade seen from the front, the hands and the wisp of light, the ragged mist tail.
- BACK: Show the back of the dark hood, the ragged mist tail and the hand with the wisp.

## myt_lemur | Lemur | tier 2 | Shades | ouder: Umbra

- Blad A, bijlagen: `gra_anker.png` en `myt_umbra_A.png`
- SECOND: The SECOND image is the finished sheet of the parent form (Umbra): this creature is the next step of the SAME line, so keep the same colours and the same basic design, but bigger, stronger and richer.
- NAME: Lemur; TIER: 2; BRANCH: Shades; ROLE: mythical creature
- OUTFIT: It is a lemur, a restless ghost of the dead: a translucent ghost in the shape of a tall thin person in a torn pale-grey burial shroud with a dark purple hood, a pale grey face with two glowing pale green eyes and a long, worried mouth, long thin ghostly arms, and a ragged tail of mist instead of legs; a few broken gold chain links hang from its wrists. Solid pixels, no gradients, same dark-brown outline. In its right hand a small old lantern with a pale green flame. MOVEMENT in the walking poses: it drifts forward, hovering just above the ground.
- REST: hovering gently, facing the viewer, the lantern held at its side with the green flame flickering
- ATTACK: drifting one step forward, the long arms stretched forward and the lantern swung forward with a spray of green sparks
- HIT: recoiling backwards, eyes squeezed shut, the shroud fluttering, the lantern swinging
- PORT: Show the dark purple hood, the pale grey face with the glowing green eyes and the broken chain links.
- FRONT: The tall thin ghost seen from the front, the lantern in the right hand, the torn shroud.
- BACK: Show the back of the dark hood, the torn shroud and the ragged mist tail.

## myt_larva | Larva | tier 3 | Shades | ouder: Lemur

- Blad A, bijlagen: `gra_anker.png` en `myt_lemur_A.png`
- SECOND: The SECOND image is the finished sheet of the parent form (Lemur): this creature is the next step of the SAME line, so keep the same colours and the same basic design, but bigger, stronger and richer.
- NAME: Larva; TIER: 3; BRANCH: Shades; ROLE: mythical creature
- OUTFIT: It is a larva, a masked spirit of the underworld: a tall hovering ghost in a long dark purple robe with silver trim that fades into mist at the bottom, long thin arms with pale hands, wearing a big smooth white theatre mask with a wide sad smile and black round eye holes in which two glowing pale green points shine; a thin silver crown above the mask. NO legs. Solid pixels, no gradients, same dark-brown outline. In its right hand a black torch with a cold blue flame; in its left hand a small silver bell. MOVEMENT in the walking poses: it drifts forward, hovering just above the ground.
- REST: hovering gently, facing the viewer, the torch held up beside it, the bell in the other hand
- ATTACK: drifting one step forward, the torch thrust forward with a spray of blue sparks
- HIT: recoiling backwards, the mask tilting, the robe fluttering, the torch swinging
- PORT: Show the big white mask with the sad smile, the glowing green points in the eye holes and the thin silver crown.
- FRONT: The tall masked spirit seen from the front, the blue-flame torch in the right hand, the silver bell in the left hand.
- BACK: Show the back of the silver crown, the long dark purple robe with the silver trim and the mist tail.

## myt_formica | Formica | tier 1 | Myrmidons | ouder: -

- Blad A, bijlagen: `gra_anker.png` en `rom_tiro_A.png` (alleen stijlreferentie)
- SECOND: The SECOND image is the finished Roman recruit sheet (Tiro): use it ONLY for the sheet format, the pixel size, the outline and the pose layout; do NOT copy its clothing, body or face. This unit is a mythical creature, not a soldier.
- NAME: Formica; TIER: 1; BRANCH: Myrmidons; ROLE: mythical creature
- OUTFIT: It is a giant ant, a friendly soldier ant the size of a small dog. It has: a reddish-brown shiny body with three segments (head, middle, round back), big round black eyes with a white highlight, two long thin curved antennae, two curved pincer jaws, six thin legs (two front legs raised like arms), and a small round bronze helmet on its head. NO weapons. MOVEMENT in the walking poses: it scuttles on its legs.
- REST: standing on its hind legs, facing the viewer, the two front legs raised like arms, the antennae wiggling
- ATTACK: scuttling one step forward, the jaws snapping forward and the front legs thrust forward
- HIT: recoiling backwards, eyes squeezed shut, the antennae drooping
- PORT: Show the round bronze helmet, the big black eyes, the antennae and the pincer jaws.
- FRONT: The giant ant seen from the front with the pincer jaws, the raised front legs and the round back.
- BACK: Show the round shiny back, the six legs and the antennae from behind.

## myt_myrmido | Myrmido | tier 2 | Myrmidons | ouder: Formica

- Blad A, bijlagen: `gra_anker.png` en `myt_formica_A.png`
- SECOND: The SECOND image is the finished sheet of the parent form (Formica): this creature is the next step of the SAME line, so keep the same colours and the same basic design, but bigger, stronger and richer.
- NAME: Myrmido; TIER: 2; BRANCH: Myrmidons; ROLE: mythical creature
- OUTFIT: He is a myrmidon, an ant-warrior: a tall humanoid with a reddish-brown shiny ant head with big round black eyes, long curved antennae and curved pincer jaws, a human-shaped body in reddish-brown carapace armour with a gold collar, two arms and two legs, a short crimson cloak and a bronze helmet crest on the head. In his right hand a long spear with a silver leaf-shaped head; in his left hand a small round bronze shield with a yellow ant emblem. MOVEMENT in the walking poses: he marches upright.
- REST: standing at attention, facing the viewer, the spear upright, the shield at his side
- ATTACK: one step forward, the spear thrust forward over the shield, the antennae streaming back
- HIT: recoiling backwards, eyes squeezed shut, the shield sagging
- PORT: Show the ant head with the big black eyes, the antennae, the pincer jaws and the bronze crest.
- FRONT: Spear in the right hand, round shield on the left arm, the reddish-brown carapace armour.
- BACK: Show the bronze helmet crest, the crimson cloak, the carapace back and the spear.

## myt_densdraconis | Dens draconis | tier 1 | Sown men | ouder: -

- Blad A, bijlagen: `gra_anker.png` en `rom_tiro_A.png` (alleen stijlreferentie)
- SECOND: The SECOND image is the finished Roman recruit sheet (Tiro): use it ONLY for the sheet format, the pixel size, the outline and the pose layout; do NOT copy its clothing, body or face. This unit is a mythical creature, not a soldier.
- NAME: Dens draconis; TIER: 1; BRANCH: Sown men; ROLE: mythical creature
- OUTFIT: It is a dragon's tooth that has just been sown: a large pointed white-ivory tooth about the size of a child, standing upright in a small mound of dark brown soil with a few tiny green sprouts, with two small round dark eyes and a small crooked mouth in the front of the tooth, two thin root-like arms and two small root feet, and a small curl of green sprout on top. Cute and a little spooky. NO weapons. MOVEMENT in the walking poses: it hops and shuffles on its root feet, trailing a little soil.
- REST: standing in the soil mound, facing the viewer, the root arms hanging, the green sprout on top swaying
- ATTACK: hopping one step forward, the root arms swinging forward and the pointed top thrust forward
- HIT: recoiling backwards, eyes squeezed shut, soil flying
- PORT: Show the small round dark eyes, the crooked mouth, the ivory tooth shape and the green sprout.
- FRONT: The tooth creature seen from the front with the root arms and the soil mound.
- BACK: Show the back of the ivory tooth, the green sprout on top and the root feet.

## myt_spartus | Spartus | tier 2 | Sown men | ouder: Dens draconis

- Blad A, bijlagen: `gra_anker.png` en `myt_densdraconis_A.png`
- SECOND: The SECOND image is the finished sheet of the parent form (Dens draconis): this creature is the next step of the SAME line, so keep the same colours and the same basic design, but bigger, stronger and richer.
- NAME: Spartus; TIER: 2; BRANCH: Sown men; ROLE: mythical creature
- OUTFIT: He is a Spartus, a sown man who has sprung from the earth: a stocky warrior with earth-brown skin with small pale cracks and a few tufts of grass on his shoulders, bald with grey-green eyes and a grim look, face clearly visible; a shiny bronze helmet with a short dark red crest and a white tooth on the front; a short brown leather tunic; bronze greaves; brown boots with soil on them. In his right hand a short spear with a silver head; in his left hand a round bronze shield painted dark red with a white tooth emblem. MOVEMENT in the walking poses: he marches heavily with small clods of soil falling off.
- REST: standing at attention, facing the viewer, the spear upright, the shield at his side, a few soil crumbs falling
- ATTACK: one step forward, the spear thrust forward over the shield
- HIT: recoiling backwards, eyes closed, the shield sagging, soil crumbs flying
- PORT: Show the bronze helmet with the white tooth, the earth-brown skin with the cracks and the grass tufts.
- FRONT: Spear in the right hand, round red shield with the white tooth on the left arm.
- BACK: Show the bronze helmet crest, the grass tufts on the shoulders, the back of the shield and the spear.

## myt_anguis | Anguis | tier 1 | Dragons | ouder: -

- Blad A, bijlagen: `gra_anker.png` en `rom_tiro_A.png` (alleen stijlreferentie)
- SECOND: The SECOND image is the finished Roman recruit sheet (Tiro): use it ONLY for the sheet format, the pixel size, the outline and the pose layout; do NOT copy its clothing, body or face. This unit is a mythical creature, not a soldier.
- NAME: Anguis; TIER: 1; BRANCH: Dragons; ROLE: mythical creature
- OUTFIT: It is a small friendly snake: a round coiled body in bright green with a yellow belly and a pattern of small dark green diamonds, a raised head with big round amber eyes with black slit pupils, a tiny forked red tongue, and a small gold-yellow stripe along its back. MOVEMENT in the walking poses: it slithers forward in a wave.
- REST: coiled up with the head raised, facing the viewer, the tongue flicking
- ATTACK: lunging one body-length forward, the head striking forward with the mouth open
- HIT: recoiling backwards, eyes squeezed shut, the coils loosening
- PORT: Show the raised snake head with the amber eyes, the forked tongue and the diamond pattern.
- FRONT: The coiled snake seen from the front with the raised head and the yellow belly.
- BACK: Show the coils from behind, the green back with the diamond pattern and the tail tip.

## myt_serpens | Serpens | tier 2 | Dragons | ouder: Anguis

- Blad A, bijlagen: `gra_anker.png` en `myt_anguis_A.png`
- SECOND: The SECOND image is the finished sheet of the parent form (Anguis): this creature is the next step of the SAME line, so keep the same colours and the same basic design, but bigger, stronger and richer.
- NAME: Serpens; TIER: 2; BRANCH: Dragons; ROLE: mythical creature
- OUTFIT: It is a great serpent: a thick long body in dark green with a gold stripe along its back and large dark diamonds, a big flat head with a flared hood, fierce amber eyes with black slit pupils, two small white fangs and a long forked red tongue, and a golden belly with horizontal plates. MOVEMENT in the walking poses: it slithers forward in big waves.
- REST: coiled up with the head and hood raised high, facing the viewer, the tongue flicking
- ATTACK: lunging forward, the hood flared wide and the head striking forward with the fangs bared
- HIT: recoiling backwards, eyes squeezed shut, the hood sagging, the coils loosening
- PORT: Show the flared hood, the amber eyes, the fangs and the forked tongue.
- FRONT: The great serpent seen from the front, the raised head with the hood and the golden belly.
- BACK: Show the thick coils from behind, the gold stripe along the back and the tail tip.

## myt_draco | Draco | tier 3 | Dragons | ouder: Serpens

- Blad A, bijlagen: `gra_anker.png` en `myt_serpens_A.png`
- SECOND: The SECOND image is the finished sheet of the parent form (Serpens): this creature is the next step of the SAME line, so keep the same colours and the same basic design, but bigger, stronger and richer.
- NAME: Draco; TIER: 3; BRANCH: Dragons; ROLE: mythical creature
- OUTFIT: It is a dragon: a large dark green creature with a long neck and a horned head with two curved ivory horns, fierce amber eyes, a toothy mouth with a few small flames licking out, a golden belly with plates, a strong body on four legs with sharp claws, large bat-like wings with dark green skin and gold-orange membranes, and a long spiked tail. Fierce but not gory. MOVEMENT in the walking poses: it stalks on four legs with the wings folded.
- REST: standing proudly on four legs, facing the viewer, the wings half raised, a small flame flickering from the mouth
- ATTACK: rearing one step forward, the wings spread wide and a bright fire breath streaming forward from the open mouth
- HIT: recoiling backwards, eyes squeezed shut, the wings folding, smoke puffing
- PORT: Show the horned head with the amber eyes, the toothy mouth and the small flames.
- FRONT: The dragon seen from the front with the wings half raised, the golden belly and the clawed legs.
- BACK: Show the wings seen from behind with the gold-orange membranes, the spiked back and the long tail.

## myt_pullusalatus | Pullus alatus | tier 1 | Winged horses | ouder: -

- Blad A, bijlagen: `gra_anker.png` en `rom_tiro_A.png` (alleen stijlreferentie)
- SECOND: The SECOND image is the finished Roman recruit sheet (Tiro): use it ONLY for the sheet format, the pixel size, the outline and the pose layout; do NOT copy its clothing, body or face. This unit is a mythical creature, not a soldier.
- NAME: Pullus alatus; TIER: 1; BRANCH: Winged horses; ROLE: mythical creature
- OUTFIT: It is a winged foal: a small white foal with a fluffy light-grey mane and tail, big dark friendly eyes, slim legs with small golden hooves and two small white wings with soft feathers on its back. NO tack. MOVEMENT in the walking poses: it trots on four legs, the small wings fluttering.
- REST: standing on four legs, facing the viewer, the small wings folded
- ATTACK: hopping one step forward, the small wings flapping and the front hooves lifted
- HIT: recoiling backwards, eyes squeezed shut, feathers flying
- PORT: Show the foal's head with the fluffy mane, the big dark eyes and the small white wings.
- FRONT: The winged foal seen from the front with the small wings and the golden hooves.
- BACK: Show the small white wings from behind, the white back and the fluffy tail.

## myt_equusalatus | Equus alatus | tier 2 | Winged horses | ouder: Pullus alatus

- Blad A, bijlagen: `gra_anker.png` en `myt_pullusalatus_A.png`
- SECOND: The SECOND image is the finished sheet of the parent form (Pullus alatus): this creature is the next step of the SAME line, so keep the same colours and the same basic design, but bigger, stronger and richer.
- NAME: Equus alatus; TIER: 2; BRANCH: Winged horses; ROLE: mythical creature
- OUTFIT: It is a winged horse, like Pegasus: a tall, strong white horse with a long flowing silver mane and tail, noble dark eyes, golden hooves and a small gold circlet with a blue gem on its forehead, and two large white feathered wings with silver tips. NO rider and NO saddle. MOVEMENT in the walking poses: it trots on four legs with its wings folded.
- REST: standing proudly on four legs, facing the viewer, the wings half raised
- ATTACK: rearing up on the hind legs, the wings spread wide and the front hooves lashing forward
- HIT: recoiling backwards, eyes squeezed shut, the wings folding, feathers flying
- PORT: Show the noble horse head with the silver mane, the gold circlet with the blue gem and the dark eyes.
- FRONT: The white winged horse seen from the front with the wings half raised and the golden hooves.
- BACK: Show the large white wings seen from behind, the flowing silver tail and the white back.

## myt_phoenix | Phoenix | tier 1 | Phoenix | ouder: -

- Blad A, bijlagen: `gra_anker.png` en `rom_tiro_A.png` (alleen stijlreferentie)
- SECOND: The SECOND image is the finished Roman recruit sheet (Tiro): use it ONLY for the sheet format, the pixel size, the outline and the pose layout; do NOT copy its clothing, body or face. This unit is a mythical creature, not a soldier.
- NAME: Phoenix; TIER: 1; BRANCH: Phoenix; ROLE: mythical creature
- OUTFIT: It is a phoenix: a proud firebird with a red-orange body, golden-yellow wing and tail feathers that look like flames, a golden crest on its head, a sharp golden beak, bright orange eyes, strong golden legs with talons, and a long fan of fiery tail feathers. Small flame sparks float around it. MOVEMENT in the walking poses: it hops and glides just above the ground with slow wing beats (feet still visible).
- REST: standing proudly, facing the viewer, the wings half spread, the tail feathers fanned out behind
- ATTACK: leaping one step forward, the wings spread wide, the beak and the front talons thrust forward and a burst of flame sparks
- HIT: recoiling backwards, eyes squeezed shut, the wings folding, flame sparks scattering
- PORT: Show the golden crest, the sharp golden beak and the bright orange eyes.
- FRONT: The firebird seen from the front with the wings half spread and the golden talons.
- BACK: Show the wings from behind and the long fan of fiery tail feathers.

## myt_lupus | Lupus | tier 1 | Wolves of Mars | ouder: -

- Blad A, bijlagen: `gra_anker.png` en `rom_tiro_A.png` (alleen stijlreferentie)
- SECOND: The SECOND image is the finished Roman recruit sheet (Tiro): use it ONLY for the sheet format, the pixel size, the outline and the pose layout; do NOT copy its clothing, body or face. This unit is a mythical creature, not a soldier.
- NAME: Lupus; TIER: 1; BRANCH: Wolves of Mars; ROLE: mythical creature
- OUTFIT: It is a wolf: a grey wolf with thick grey-and-white fur, a white chest and belly, pointed ears, amber eyes, a black nose, a bushy tail, strong legs with dark claws, and a small red cloth tied around its neck. Alert and a little fierce. MOVEMENT in the walking poses: it trots on four legs.
- REST: standing alert on four legs, facing the viewer, the ears up, the tail hanging
- ATTACK: leaping one step forward, the jaws open and the front paws thrust forward
- HIT: recoiling backwards, eyes squeezed shut, the ears flat, fur ruffled
- PORT: Show the wolf head with the pointed ears, the amber eyes and the red neck cloth.
- FRONT: The grey wolf seen from the front with the white chest and the red neck cloth.
- BACK: Show the grey back, the bushy tail and the red cloth knot.

## myt_lupusmartius | Lupus Martius | tier 2 | Wolves of Mars | ouder: Lupus

- Blad A, bijlagen: `gra_anker.png` en `myt_lupus_A.png`
- SECOND: The SECOND image is the finished sheet of the parent form (Lupus): this creature is the next step of the SAME line, so keep the same colours and the same basic design, but bigger, stronger and richer.
- NAME: Lupus Martius; TIER: 2; BRANCH: Wolves of Mars; ROLE: mythical creature
- OUTFIT: It is a wolf of Mars, a large war wolf: thick dark grey fur with a silver mane around its neck, red war-paint stripes on its face and legs, glowing red-orange eyes, a heavy silver collar with sharp gold spikes, a short crimson cloth tied around its chest, large strong legs with silver claw caps, and a bushy tail. Fierce. MOVEMENT in the walking poses: it prowls on four legs.
- REST: standing fiercely on four legs, facing the viewer, the head lowered, the silver mane bristling
- ATTACK: leaping one step forward, the jaws wide open and the front claws thrust forward
- HIT: recoiling backwards, eyes squeezed shut, the mane flattened
- PORT: Show the wolf head with the red war-paint, the glowing red-orange eyes and the spiked silver collar.
- FRONT: The war wolf seen from the front with the silver mane, the red cloth and the claw caps.
- BACK: Show the dark grey back, the silver mane, the bushy tail and the red cloth.

## myt_aquila | Aquila | tier 1 | Eagles of Jupiter | ouder: -

- Blad A, bijlagen: `gra_anker.png` en `rom_tiro_A.png` (alleen stijlreferentie)
- SECOND: The SECOND image is the finished Roman recruit sheet (Tiro): use it ONLY for the sheet format, the pixel size, the outline and the pose layout; do NOT copy its clothing, body or face. This unit is a mythical creature, not a soldier.
- NAME: Aquila; TIER: 1; BRANCH: Eagles of Jupiter; ROLE: mythical creature
- OUTFIT: It is an eagle: a brown eagle with dark chocolate-brown body feathers, a white head and white tail feathers, a sharp yellow hooked beak, fierce yellow eyes, strong yellow legs with big black talons, and large broad wings. MOVEMENT in the walking poses: it hops and glides just above the ground with slow wing beats (feet still visible).
- REST: perched on the ground, facing the viewer, the wings half spread
- ATTACK: leaping one step forward, the wings spread wide and the talons thrust forward
- HIT: recoiling backwards, eyes squeezed shut, the wings folding, feathers flying
- PORT: Show the white head with the yellow hooked beak and the fierce yellow eyes.
- FRONT: The brown eagle seen from the front with the wings half spread and the yellow talons.
- BACK: Show the broad brown wings from behind and the white tail feathers.

## myt_aquilaiovis | Aquila Iovis | tier 2 | Eagles of Jupiter | ouder: Aquila

- Blad A, bijlagen: `gra_anker.png` en `myt_aquila_A.png`
- SECOND: The SECOND image is the finished sheet of the parent form (Aquila): this creature is the next step of the SAME line, so keep the same colours and the same basic design, but bigger, stronger and richer.
- NAME: Aquila Iovis; TIER: 2; BRANCH: Eagles of Jupiter; ROLE: mythical creature
- OUTFIT: It is the eagle of Jupiter: a large golden eagle with shining golden-white feathers, a crown of white feathers on its head, a sharp golden beak, bright blue eyes, strong golden legs with big talons holding a golden lightning bolt, and very large wings with golden tips; pale blue lightning sparks crackle around its wings. MOVEMENT in the walking poses: it hops and glides just above the ground with slow wing beats (feet still visible).
- REST: perched proudly on the ground, facing the viewer, the wings half spread, the lightning bolt in its talons
- ATTACK: leaping one step forward, the wings spread wide and the lightning bolt thrust forward with a burst of blue sparks
- HIT: recoiling backwards, eyes squeezed shut, the wings folding, sparks scattering
- PORT: Show the white crown feathers, the sharp golden beak and the bright blue eyes.
- FRONT: The golden eagle seen from the front with the wings half spread and the golden lightning bolt in its talons.
- BACK: Show the very large golden wings from behind, the white tail feathers and the blue sparks.

