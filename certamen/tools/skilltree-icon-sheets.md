# Skill-tree-iconen — Gemini-prompts per klasse

Gegenereerd door `tools/skilltree-icon-sheets.js` uit `skilltree-data.js`
(`iconSubject` en padkleuren). Vier vellen per klasse (8/8/8/4 iconen),
magenta achtergrond. Sla elk resultaat op als
`assets/skills/sheets/<klasse>_<nr>.png` (.jpg mag ook); daarna worden de
iconen uitgesneden, vrijgemaakt en als `assets/skills/<klasse>_<knooppunt>.png`
weggeschreven.

**Stijlvoorbeeld meegeven (belangrijk):** voeg bij elke prompt de afbeelding
`assets/skills/sheets/boogschutter_1.jpg` toe — dat is de vastgestelde stijl
(gekleurde tegels). Werkt in Gemini en ChatGPT. Begin per vel een nieuw gesprek.

---

## Boogschutter

### Vel 1 — identiteit ★1–4 → `assets/skills/sheets/boogschutter_1.png`

```text
Wide 16:9 image: a sprite sheet of exactly 8 separate pixel-art game skill icons, arranged in 2 rows of 4, for an ancient Greek/Roman strategy game (class "Boogschutter").

STYLE REFERENCE: the attached image is the exact style to copy — same square tiles with slightly rounded corners and thin dark border, same tile size and spacing, same pixel size, same shading and same one-colour-per-tile look. Only the subjects and colours listed below are different.

CONTENT (most important rule): draw EXACTLY the 8 subjects listed below, each one literally as described, in this order (left to right, top to bottom). Do not replace a subject with a more generic or different object, do not add weapons, helmets, shields, animals, people or objects that are not in the description, and draw every subject only once.

1. (row 1, column 1) a steady open hand holding a single straight arrow horizontally — dominant colour cool forest green.
2. (row 1, column 2) an arrow stuck in the ground next to a small red hunting pennant — dominant colour burnt bronze-red.
3. (row 1, column 3) a calm closed eye above a horizontal arrow, with a small frost crystal — dominant colour cool forest green.
4. (row 1, column 4) two wolf heads side by side in profile, facing each other — dominant colour burnt bronze-red.
5. (row 2, column 1) a hawk's eye inside a round archery target — dominant colour cool forest green.
6. (row 2, column 2) three arrows falling diagonally in parallel from the top left — dominant colour burnt bronze-red.
7. (row 2, column 3) an arrow piercing straight through a cracked round bronze shield — dominant colour cool forest green.
8. (row 2, column 4) a curved hunting horn made of animal horn with a leather strap — dominant colour burnt bronze-red.

LAYOUT: an invisible grid of 4 columns and 2 rows with equal cells; one icon tile centred in each cell, with clear magenta gaps between the tiles so they never touch each other or the image edge. No grid lines.

BACKGROUND: one flat, uniform pure magenta (#FF00FF) everywhere, no texture, gradient, shadow or noise (it will be removed by chroma key). Never use magenta or pink inside an icon; violet must be clearly bluish.

STYLE (keep exactly the same for every icon): each icon is a square tile with slightly rounded corners and a thin dark border, the whole tile filled with a medium shade of its listed colour (the inside of a tile is never magenta, pink or empty); on it one bold symbol, filling about 75% of the tile, drawn in lighter and darker shades of that same colour with a few small pale highlights (gold only where the list says so). Pixel art drawn as if at 64×64 pixels and enlarged with hard square pixel edges (no anti-aliasing), 16-bit RPG skill-icon style, front view, readable at 32×32; same line weight and top-left lighting for all icons.

AVOID: letters, numbers, words, watermarks; photorealism, soft gradients, blur, glow larger than 2 pixels; drop shadows on the background; round or hexagonal tiles; tiles in a different colour than listed; human figures or faces; crossbows, firearms, sci-fi; any object not named in the list; magenta or pink inside the icons; more or fewer than 8 icons.
```

<details><summary>Indeling</summary>

| Nr | Knooppunt | Bestand |
|---|---|---|
| 1 | Vaste Hand | `boogschutter_vaste_hand.png` |
| 2 | Spoor Zetten | `boogschutter_spoor_zetten.png` |
| 3 | Koelbloedig | `boogschutter_koelbloedig.png` |
| 4 | Roedel | `boogschutter_roedel.png` |
| 5 | Scherp Oog | `boogschutter_scherp_oog.png` |
| 6 | Drijfjacht | `boogschutter_drijfjacht.png` |
| 7 | Pantserbreker | `boogschutter_pantserbreker.png` |
| 8 | Lokroep | `boogschutter_lokroep.png` |

</details>

### Vel 2 — pad A · Scherpschutter → `assets/skills/sheets/boogschutter_2.png`

```text
Wide 16:9 image: a sprite sheet of exactly 8 separate pixel-art game skill icons, arranged in 2 rows of 4, for an ancient Greek/Roman strategy game (class "Boogschutter").

STYLE REFERENCE: the attached image is the exact style to copy — same square tiles with slightly rounded corners and thin dark border, same tile size and spacing, same pixel size, same shading and same one-colour-per-tile look. Only the subjects and colours listed below are different.

CONTENT (most important rule): draw EXACTLY the 8 subjects listed below, each one literally as described, in this order (left to right, top to bottom). Do not replace a subject with a more generic or different object, do not add weapons, helmets, shields, animals, people or objects that are not in the description, and draw every subject only once.

1. (row 1, column 1) a single arrow passing cleanly through the exact centre of a target — dominant colour cool forest green.
2. (row 1, column 2) a falcon head in profile with a sharp focused eye — dominant colour cool forest green.
3. (row 1, column 3) an arrow striking a cracked spot on a bronze breastplate — dominant colour cool forest green.
4. (row 1, column 4) one last arrow in an almost empty leather quiver — dominant colour cool forest green.
5. (row 2, column 1) a star-shaped gold medal with a bow engraved on it — dominant colour cool forest green.
6. (row 2, column 2) an archer's leather bracer with burning arrows flying past it — dominant colour cool forest green.
7. (row 2, column 3) a black arrow with a bone-white arrowhead breaking through a shield — dominant colour cool forest green.
8. (row 2, column 4) a radiant golden sun disc with an arrow through its centre — dominant colour cool forest green.

LAYOUT: an invisible grid of 4 columns and 2 rows with equal cells; one icon tile centred in each cell, with clear magenta gaps between the tiles so they never touch each other or the image edge. No grid lines.

BACKGROUND: one flat, uniform pure magenta (#FF00FF) everywhere, no texture, gradient, shadow or noise (it will be removed by chroma key). Never use magenta or pink inside an icon; violet must be clearly bluish.

STYLE (keep exactly the same for every icon): each icon is a square tile with slightly rounded corners and a thin dark border, the whole tile filled with a medium shade of its listed colour (the inside of a tile is never magenta, pink or empty); on it one bold symbol, filling about 75% of the tile, drawn in lighter and darker shades of that same colour with a few small pale highlights (gold only where the list says so). Pixel art drawn as if at 64×64 pixels and enlarged with hard square pixel edges (no anti-aliasing), 16-bit RPG skill-icon style, front view, readable at 32×32; same line weight and top-left lighting for all icons.

AVOID: letters, numbers, words, watermarks; photorealism, soft gradients, blur, glow larger than 2 pixels; drop shadows on the background; round or hexagonal tiles; tiles in a different colour than listed; human figures or faces; crossbows, firearms, sci-fi; any object not named in the list; magenta or pink inside the icons; more or fewer than 8 icons.
```

<details><summary>Indeling</summary>

| Nr | Knooppunt | Bestand |
|---|---|---|
| 1 | Zuivere Treffer | `boogschutter_zuivere_treffer.png` |
| 2 | Valkenblik | `boogschutter_valkenblik.png` |
| 3 | Genadeloos | `boogschutter_genadeloos.png` |
| 4 | Laatste Pijl | `boogschutter_laatste_pijl.png` |
| 5 | Meesterschutter | `boogschutter_meesterschutter.png` |
| 6 | Kalm onder Vuur | `boogschutter_kalm_onder_vuur.png` |
| 7 | Doodsoordeel | `boogschutter_doodsoordeel.png` |
| 8 | Oog van Apollo | `boogschutter_oog_van_apollo.png` |

</details>

### Vel 3 — pad B · Jager → `assets/skills/sheets/boogschutter_3.png`

```text
Wide 16:9 image: a sprite sheet of exactly 8 separate pixel-art game skill icons, arranged in 2 rows of 4, for an ancient Greek/Roman strategy game (class "Boogschutter").

STYLE REFERENCE: the attached image is the exact style to copy — same square tiles with slightly rounded corners and thin dark border, same tile size and spacing, same pixel size, same shading and same one-colour-per-tile look. Only the subjects and colours listed below are different.

CONTENT (most important rule): draw EXACTLY the 8 subjects listed below, each one literally as described, in this order (left to right, top to bottom). Do not replace a subject with a more generic or different object, do not add weapons, helmets, shields, animals, people or objects that are not in the description, and draw every subject only once.

1. (row 1, column 1) a large stag with wide antlers, seen from the front — dominant colour burnt bronze-red.
2. (row 1, column 2) fresh deer hoof prints in mud leading upward — dominant colour burnt bronze-red.
3. (row 1, column 3) a howling wolf head with a small gold crown above it — dominant colour burnt bronze-red.
4. (row 1, column 4) a fleeing boar with a broken wooden shield behind it — dominant colour burnt bronze-red.
5. (row 2, column 1) a crescent moon above a bow drawn in silhouette — dominant colour burnt bronze-red.
6. (row 2, column 2) a large brass hunting horn blowing visible sound waves — dominant colour burnt bronze-red.
7. (row 2, column 3) a silver crescent moon with a silver arrow resting across it — dominant colour burnt bronze-red.
8. (row 2, column 4) three arrows converging on one point from three directions — dominant colour burnt bronze-red.

LAYOUT: an invisible grid of 4 columns and 2 rows with equal cells; one icon tile centred in each cell, with clear magenta gaps between the tiles so they never touch each other or the image edge. No grid lines.

BACKGROUND: one flat, uniform pure magenta (#FF00FF) everywhere, no texture, gradient, shadow or noise (it will be removed by chroma key). Never use magenta or pink inside an icon; violet must be clearly bluish.

STYLE (keep exactly the same for every icon): each icon is a square tile with slightly rounded corners and a thin dark border, the whole tile filled with a medium shade of its listed colour (the inside of a tile is never magenta, pink or empty); on it one bold symbol, filling about 75% of the tile, drawn in lighter and darker shades of that same colour with a few small pale highlights (gold only where the list says so). Pixel art drawn as if at 64×64 pixels and enlarged with hard square pixel edges (no anti-aliasing), 16-bit RPG skill-icon style, front view, readable at 32×32; same line weight and top-left lighting for all icons.

AVOID: letters, numbers, words, watermarks; photorealism, soft gradients, blur, glow larger than 2 pixels; drop shadows on the background; round or hexagonal tiles; tiles in a different colour than listed; human figures or faces; crossbows, firearms, sci-fi; any object not named in the list; magenta or pink inside the icons; more or fewer than 8 icons.
```

<details><summary>Indeling</summary>

| Nr | Knooppunt | Bestand |
|---|---|---|
| 1 | Grote Prooi | `boogschutter_grote_prooi.png` |
| 2 | Vers Spoor | `boogschutter_vers_spoor.png` |
| 3 | Roedelleider | `boogschutter_roedelleider.png` |
| 4 | Opjagen | `boogschutter_opjagen.png` |
| 5 | Stille Jacht | `boogschutter_stille_jacht.png` |
| 6 | Jachthoorn | `boogschutter_jachthoorn.png` |
| 7 | Artemis' Gunst | `boogschutter_artemis_gunst.png` |
| 8 | Jachtpartij | `boogschutter_jachtpartij.png` |

</details>

### Vel 4 — basis, meester, prestige → `assets/skills/sheets/boogschutter_4.png`

```text
Square 1:1 image: a sprite sheet of exactly 4 separate pixel-art game skill icons, arranged in 2 rows of 2, for an ancient Greek/Roman strategy game (class "Boogschutter").

STYLE REFERENCE: the attached image is the exact style to copy — same square tiles with slightly rounded corners and thin dark border, same tile size and spacing, same pixel size, same shading and same one-colour-per-tile look. Only the subjects and colours listed below are different.

CONTENT (most important rule): draw EXACTLY the 4 subjects listed below, each one literally as described, in this order (left to right, top to bottom). Do not replace a subject with a more generic or different object, do not add weapons, helmets, shields, animals, people or objects that are not in the description, and draw every subject only once.

1. (row 1, column 1) a drawn ancient recurve bow with a nocked arrow pointing upward — dominant colour deep royal blue.
2. (row 1, column 2) a golden laurel wreath around a single upright arrow — dominant colour warm gold.
3. (row 2, column 1) one huge golden arrow of light shot from a radiant sun — dominant colour cool forest green with extra gold.
4. (row 2, column 2) a rain of silver arrows falling from a crescent moon — dominant colour burnt bronze-red with extra gold.

LAYOUT: an invisible grid of 2 columns and 2 rows with equal cells; one icon tile centred in each cell, with clear magenta gaps between the tiles so they never touch each other or the image edge. No grid lines.

BACKGROUND: one flat, uniform pure magenta (#FF00FF) everywhere, no texture, gradient, shadow or noise (it will be removed by chroma key). Never use magenta or pink inside an icon; violet must be clearly bluish.

STYLE (keep exactly the same for every icon): each icon is a square tile with slightly rounded corners and a thin dark border, the whole tile filled with a medium shade of its listed colour (the inside of a tile is never magenta, pink or empty); on it one bold symbol, filling about 75% of the tile, drawn in lighter and darker shades of that same colour with a few small pale highlights (gold only where the list says so). Pixel art drawn as if at 64×64 pixels and enlarged with hard square pixel edges (no anti-aliasing), 16-bit RPG skill-icon style, front view, readable at 32×32; same line weight and top-left lighting for all icons.

AVOID: letters, numbers, words, watermarks; photorealism, soft gradients, blur, glow larger than 2 pixels; drop shadows on the background; round or hexagonal tiles; tiles in a different colour than listed; human figures or faces; crossbows, firearms, sci-fi; any object not named in the list; magenta or pink inside the icons; more or fewer than 4 icons.
```

<details><summary>Indeling</summary>

| Nr | Knooppunt | Bestand |
|---|---|---|
| 1 | Boogschutter | `boogschutter_root.png` |
| 2 | Meester | `boogschutter_meester.png` |
| 3 | Pijl van Apollo | `boogschutter_pijl_van_apollo.png` |
| 4 | Pijlen van Artemis | `boogschutter_pijlen_van_artemis.png` |

</details>

---

## Hopliet

### Vel 1 — identiteit ★1–4 → `assets/skills/sheets/hopliet_1.png`

```text
Wide 16:9 image: a sprite sheet of exactly 8 separate pixel-art game skill icons, arranged in 2 rows of 4, for an ancient Greek/Roman strategy game (class "Hopliet").

STYLE REFERENCE: the attached image is the exact style to copy — same square tiles with slightly rounded corners and thin dark border, same tile size and spacing, same pixel size, same shading and same one-colour-per-tile look. Only the subjects and colours listed below are different.

CONTENT (most important rule): draw EXACTLY the 8 subjects listed below, each one literally as described, in this order (left to right, top to bottom). Do not replace a subject with a more generic or different object, do not add weapons, helmets, shields, animals, people or objects that are not in the description, and draw every subject only once.

1. (row 1, column 1) a row of three overlapping round bronze shields seen from the front — dominant colour cool polished steel blue.
2. (row 1, column 2) a spear thrusting out from behind a raised round shield — dominant colour blood red and bronze.
3. (row 1, column 3) a closed wall of interlocking bronze shields with spear tips above it — dominant colour cool polished steel blue.
4. (row 1, column 4) the bronze rim of a shield striking forward with short motion lines — dominant colour blood red and bronze.
5. (row 2, column 1) three rows of small soldier silhouettes standing in perfect formation — dominant colour cool polished steel blue.
6. (row 2, column 2) a dented bronze shield with a sword crossed behind it — dominant colour blood red and bronze.
7. (row 2, column 3) raised hands of soldiers swearing an oath above a round shield — dominant colour cool polished steel blue.
8. (row 2, column 4) a running hoplite's bronze greave and sandal in mid-stride — dominant colour blood red and bronze.

LAYOUT: an invisible grid of 4 columns and 2 rows with equal cells; one icon tile centred in each cell, with clear magenta gaps between the tiles so they never touch each other or the image edge. No grid lines.

BACKGROUND: one flat, uniform pure magenta (#FF00FF) everywhere, no texture, gradient, shadow or noise (it will be removed by chroma key). Never use magenta or pink inside an icon; violet must be clearly bluish.

STYLE (keep exactly the same for every icon): each icon is a square tile with slightly rounded corners and a thin dark border, the whole tile filled with a medium shade of its listed colour (the inside of a tile is never magenta, pink or empty); on it one bold symbol, filling about 75% of the tile, drawn in lighter and darker shades of that same colour with a few small pale highlights (gold only where the list says so). Pixel art drawn as if at 64×64 pixels and enlarged with hard square pixel edges (no anti-aliasing), 16-bit RPG skill-icon style, front view, readable at 32×32; same line weight and top-left lighting for all icons.

AVOID: letters, numbers, words, watermarks; photorealism, soft gradients, blur, glow larger than 2 pixels; drop shadows on the background; round or hexagonal tiles; tiles in a different colour than listed; human figures or faces; crossbows, firearms, sci-fi; any object not named in the list; magenta or pink inside the icons; more or fewer than 8 icons.
```

<details><summary>Indeling</summary>

| Nr | Knooppunt | Bestand |
|---|---|---|
| 1 | Schildenrij | `hopliet_schildenrij.png` |
| 2 | Tegenstoot | `hopliet_tegenstoot.png` |
| 3 | Gesloten Linie | `hopliet_gesloten_linie.png` |
| 4 | Bronzen Rand | `hopliet_bronzen_rand.png` |
| 5 | Gedrilde Rijen | `hopliet_gedrilde_rijen.png` |
| 6 | Wraak van de Linie | `hopliet_wraak_van_de_linie.png` |
| 7 | Eed van de Falanx | `hopliet_eed_van_de_falanx.png` |
| 8 | Dromos | `hopliet_dromos.png` |

</details>

### Vel 2 — pad A · Falanx → `assets/skills/sheets/hopliet_2.png`

```text
Wide 16:9 image: a sprite sheet of exactly 8 separate pixel-art game skill icons, arranged in 2 rows of 4, for an ancient Greek/Roman strategy game (class "Hopliet").

STYLE REFERENCE: the attached image is the exact style to copy — same square tiles with slightly rounded corners and thin dark border, same tile size and spacing, same pixel size, same shading and same one-colour-per-tile look. Only the subjects and colours listed below are different.

CONTENT (most important rule): draw EXACTLY the 8 subjects listed below, each one literally as described, in this order (left to right, top to bottom). Do not replace a subject with a more generic or different object, do not add weapons, helmets, shields, animals, people or objects that are not in the description, and draw every subject only once.

1. (row 1, column 1) a solid wall of bronze shields seen straight from the front — dominant colour cool polished steel blue.
2. (row 1, column 2) a large concave hoplon shield with the arm strap visible on the inside — dominant colour cool polished steel blue.
3. (row 1, column 3) a bronze shield with a crack held together by iron rivets — dominant colour cool polished steel blue.
4. (row 1, column 4) two long rows of shields locking together like a closing gate — dominant colour cool polished steel blue.
5. (row 2, column 1) a long ancient Greek war trumpet (salpinx) sounding above a line of shields — dominant colour cool polished steel blue.
6. (row 2, column 2) a single shield standing upright amid a ruined stone wall — dominant colour cool polished steel blue.
7. (row 2, column 3) a line of shields with golden light shining along their rims — dominant colour cool polished steel blue.
8. (row 2, column 4) a Spartan lambda symbol on a shield standing in a narrow mountain pass — dominant colour cool polished steel blue.

LAYOUT: an invisible grid of 4 columns and 2 rows with equal cells; one icon tile centred in each cell, with clear magenta gaps between the tiles so they never touch each other or the image edge. No grid lines.

BACKGROUND: one flat, uniform pure magenta (#FF00FF) everywhere, no texture, gradient, shadow or noise (it will be removed by chroma key). Never use magenta or pink inside an icon; violet must be clearly bluish.

STYLE (keep exactly the same for every icon): each icon is a square tile with slightly rounded corners and a thin dark border, the whole tile filled with a medium shade of its listed colour (the inside of a tile is never magenta, pink or empty); on it one bold symbol, filling about 75% of the tile, drawn in lighter and darker shades of that same colour with a few small pale highlights (gold only where the list says so). Pixel art drawn as if at 64×64 pixels and enlarged with hard square pixel edges (no anti-aliasing), 16-bit RPG skill-icon style, front view, readable at 32×32; same line weight and top-left lighting for all icons.

AVOID: letters, numbers, words, watermarks; photorealism, soft gradients, blur, glow larger than 2 pixels; drop shadows on the background; round or hexagonal tiles; tiles in a different colour than listed; human figures or faces; crossbows, firearms, sci-fi; any object not named in the list; magenta or pink inside the icons; more or fewer than 8 icons.
```

<details><summary>Indeling</summary>

| Nr | Knooppunt | Bestand |
|---|---|---|
| 1 | Bronzen Muur | `hopliet_bronzen_muur.png` |
| 2 | Hoplon | `hopliet_hoplon.png` |
| 3 | Taai als Brons | `hopliet_taai_als_brons.png` |
| 4 | Linie Vast | `hopliet_linie_vast.png` |
| 5 | Snelle Formatie | `hopliet_snelle_formatie.png` |
| 6 | Laatste Bolwerk | `hopliet_laatste_bolwerk.png` |
| 7 | Gouden Linie | `hopliet_gouden_linie.png` |
| 8 | Geest van de 300 | `hopliet_geest_van_de_300.png` |

</details>

### Vel 3 — pad B · Voorhoede → `assets/skills/sheets/hopliet_3.png`

```text
Wide 16:9 image: a sprite sheet of exactly 8 separate pixel-art game skill icons, arranged in 2 rows of 4, for an ancient Greek/Roman strategy game (class "Hopliet").

STYLE REFERENCE: the attached image is the exact style to copy — same square tiles with slightly rounded corners and thin dark border, same tile size and spacing, same pixel size, same shading and same one-colour-per-tile look. Only the subjects and colours listed below are different.

CONTENT (most important rule): draw EXACTLY the 8 subjects listed below, each one literally as described, in this order (left to right, top to bottom). Do not replace a subject with a more generic or different object, do not add weapons, helmets, shields, animals, people or objects that are not in the description, and draw every subject only once.

1. (row 1, column 1) a sharpened bronze shield rim gleaming along its edge — dominant colour blood red and bronze.
2. (row 1, column 2) one round shield smashing into another round shield, which cracks — dominant colour blood red and bronze.
3. (row 1, column 3) a spear held upright behind a shield, both angled forward — dominant colour blood red and bronze.
4. (row 1, column 4) a bronze shield with dark red stains on its surface — dominant colour blood red and bronze.
5. (row 2, column 1) two curved arrows forming a circle around a shield and a spear — dominant colour blood red and bronze.
6. (row 2, column 2) a spear point punching a hole through a bronze plate — dominant colour blood red and bronze.
7. (row 2, column 3) a crested Greek bronze helmet above a laurel branch — dominant colour blood red and bronze.
8. (row 2, column 4) a charging hoplite shield with two spear tips bursting out from behind it — dominant colour blood red and bronze.

LAYOUT: an invisible grid of 4 columns and 2 rows with equal cells; one icon tile centred in each cell, with clear magenta gaps between the tiles so they never touch each other or the image edge. No grid lines.

BACKGROUND: one flat, uniform pure magenta (#FF00FF) everywhere, no texture, gradient, shadow or noise (it will be removed by chroma key). Never use magenta or pink inside an icon; violet must be clearly bluish.

STYLE (keep exactly the same for every icon): each icon is a square tile with slightly rounded corners and a thin dark border, the whole tile filled with a medium shade of its listed colour (the inside of a tile is never magenta, pink or empty); on it one bold symbol, filling about 75% of the tile, drawn in lighter and darker shades of that same colour with a few small pale highlights (gold only where the list says so). Pixel art drawn as if at 64×64 pixels and enlarged with hard square pixel edges (no anti-aliasing), 16-bit RPG skill-icon style, front view, readable at 32×32; same line weight and top-left lighting for all icons.

AVOID: letters, numbers, words, watermarks; photorealism, soft gradients, blur, glow larger than 2 pixels; drop shadows on the background; round or hexagonal tiles; tiles in a different colour than listed; human figures or faces; crossbows, firearms, sci-fi; any object not named in the list; magenta or pink inside the icons; more or fewer than 8 icons.
```

<details><summary>Indeling</summary>

| Nr | Knooppunt | Bestand |
|---|---|---|
| 1 | Scherpe Rand | `hopliet_scherpe_rand.png` |
| 2 | Schild als Wapen | `hopliet_schild_als_wapen.png` |
| 3 | Pantser en Speer | `hopliet_pantser_en_speer.png` |
| 4 | Bloed op het Brons | `hopliet_bloed_op_het_brons.png` |
| 5 | Opmars | `hopliet_opmars.png` |
| 6 | Breekijzer | `hopliet_breekijzer.png` |
| 7 | Held van Marathon | `hopliet_held_van_marathon.png` |
| 8 | Onstuitbaar | `hopliet_onstuitbaar.png` |

</details>

### Vel 4 — basis, meester, prestige → `assets/skills/sheets/hopliet_4.png`

```text
Square 1:1 image: a sprite sheet of exactly 4 separate pixel-art game skill icons, arranged in 2 rows of 2, for an ancient Greek/Roman strategy game (class "Hopliet").

STYLE REFERENCE: the attached image is the exact style to copy — same square tiles with slightly rounded corners and thin dark border, same tile size and spacing, same pixel size, same shading and same one-colour-per-tile look. Only the subjects and colours listed below are different.

CONTENT (most important rule): draw EXACTLY the 4 subjects listed below, each one literally as described, in this order (left to right, top to bottom). Do not replace a subject with a more generic or different object, do not add weapons, helmets, shields, animals, people or objects that are not in the description, and draw every subject only once.

1. (row 1, column 1) a round bronze hoplite shield (aspis) with a Greek lambda painted on it — dominant colour deep crimson red.
2. (row 1, column 2) a golden laurel wreath around a round bronze shield — dominant colour warm gold.
3. (row 2, column 1) a narrow mountain pass blocked by a wall of shields painted with a lambda — dominant colour cool polished steel blue with extra gold.
4. (row 2, column 2) a single bronze spearhead pointing upward with a laurel branch, above stylised blue sea waves (no people) — dominant colour blood red and bronze with extra gold.

LAYOUT: an invisible grid of 2 columns and 2 rows with equal cells; one icon tile centred in each cell, with clear magenta gaps between the tiles so they never touch each other or the image edge. No grid lines.

BACKGROUND: one flat, uniform pure magenta (#FF00FF) everywhere, no texture, gradient, shadow or noise (it will be removed by chroma key). Never use magenta or pink inside an icon; violet must be clearly bluish.

STYLE (keep exactly the same for every icon): each icon is a square tile with slightly rounded corners and a thin dark border, the whole tile filled with a medium shade of its listed colour (the inside of a tile is never magenta, pink or empty); on it one bold symbol, filling about 75% of the tile, drawn in lighter and darker shades of that same colour with a few small pale highlights (gold only where the list says so). Pixel art drawn as if at 64×64 pixels and enlarged with hard square pixel edges (no anti-aliasing), 16-bit RPG skill-icon style, front view, readable at 32×32; same line weight and top-left lighting for all icons.

AVOID: letters, numbers, words, watermarks; photorealism, soft gradients, blur, glow larger than 2 pixels; drop shadows on the background; round or hexagonal tiles; tiles in a different colour than listed; human figures or faces; crossbows, firearms, sci-fi; any object not named in the list; magenta or pink inside the icons; more or fewer than 4 icons.
```

<details><summary>Indeling</summary>

| Nr | Knooppunt | Bestand |
|---|---|---|
| 1 | Hopliet | `hopliet_root.png` |
| 2 | Meester | `hopliet_meester.png` |
| 3 | Thermopylae | `hopliet_thermopylae.png` |
| 4 | Marathon | `hopliet_marathon.png` |

</details>

---

## Voorvechter

### Vel 1 — identiteit ★1–4 → `assets/skills/sheets/spartaan_1.png`

```text
Wide 16:9 image: a sprite sheet of exactly 8 separate pixel-art game skill icons, arranged in 2 rows of 4, for an ancient Greek/Roman strategy game (class "Voorvechter").

STYLE REFERENCE: the attached image is the exact style to copy — same square tiles with slightly rounded corners and thin dark border, same tile size and spacing, same pixel size, same shading and same one-colour-per-tile look. Only the subjects and colours listed below are different.

CONTENT (most important rule): draw EXACTLY the 8 subjects listed below, each one literally as described, in this order (left to right, top to bottom). Do not replace a subject with a more generic or different object, do not add weapons, helmets, shields, animals, people or objects that are not in the description, and draw every subject only once.

1. (row 1, column 1) a flame rising from the top of a bronze helmet — dominant colour fiery orange.
2. (row 1, column 2) a sword blade with a red heart-shaped drop at its tip — dominant colour dark wine red.
3. (row 1, column 3) two crossed short swords surrounded by jagged red rage lines — dominant colour fiery orange.
4. (row 1, column 4) a hand gripping a sword blade with a drop of blood falling into a bowl — dominant colour dark wine red.
5. (row 2, column 1) a broken iron chain falling apart around a clenched fist — dominant colour fiery orange.
6. (row 2, column 2) a spear point with a small red drop glowing on it — dominant colour dark wine red.
7. (row 2, column 3) a furious lion's head with a bronze helmet crest behind it — dominant colour fiery orange.
8. (row 2, column 4) a round shield lying flat with a spear resting across it — dominant colour dark wine red.

LAYOUT: an invisible grid of 4 columns and 2 rows with equal cells; one icon tile centred in each cell, with clear magenta gaps between the tiles so they never touch each other or the image edge. No grid lines.

BACKGROUND: one flat, uniform pure magenta (#FF00FF) everywhere, no texture, gradient, shadow or noise (it will be removed by chroma key). Never use magenta or pink inside an icon; violet must be clearly bluish.

STYLE (keep exactly the same for every icon): each icon is a square tile with slightly rounded corners and a thin dark border, the whole tile filled with a medium shade of its listed colour (the inside of a tile is never magenta, pink or empty); on it one bold symbol, filling about 75% of the tile, drawn in lighter and darker shades of that same colour with a few small pale highlights (gold only where the list says so). Pixel art drawn as if at 64×64 pixels and enlarged with hard square pixel edges (no anti-aliasing), 16-bit RPG skill-icon style, front view, readable at 32×32; same line weight and top-left lighting for all icons.

AVOID: letters, numbers, words, watermarks; photorealism, soft gradients, blur, glow larger than 2 pixels; drop shadows on the background; round or hexagonal tiles; tiles in a different colour than listed; human figures or faces; crossbows, firearms, sci-fi; any object not named in the list; magenta or pink inside the icons; more or fewer than 8 icons.
```

<details><summary>Indeling</summary>

| Nr | Knooppunt | Bestand |
|---|---|---|
| 1 | Menos | `spartaan_menos.png` |
| 2 | Levensroof | `spartaan_levensroof.png` |
| 3 | Razernij | `spartaan_razernij.png` |
| 4 | Bloedeed | `spartaan_bloedeed.png` |
| 5 | Ontketend | `spartaan_ontketend.png` |
| 6 | Krijgersbloed | `spartaan_krijgersbloed.png` |
| 7 | Achilles' Toorn | `spartaan_achilles_toorn.png` |
| 8 | Met je Schild of erop | `spartaan_met_je_schild.png` |

</details>

### Vel 2 — pad A · Aristeia → `assets/skills/sheets/spartaan_2.png`

```text
Wide 16:9 image: a sprite sheet of exactly 8 separate pixel-art game skill icons, arranged in 2 rows of 4, for an ancient Greek/Roman strategy game (class "Voorvechter").

STYLE REFERENCE: the attached image is the exact style to copy — same square tiles with slightly rounded corners and thin dark border, same tile size and spacing, same pixel size, same shading and same one-colour-per-tile look. Only the subjects and colours listed below are different.

CONTENT (most important rule): draw EXACTLY the 8 subjects listed below, each one literally as described, in this order (left to right, top to bottom). Do not replace a subject with a more generic or different object, do not add weapons, helmets, shields, animals, people or objects that are not in the description, and draw every subject only once.

1. (row 1, column 1) a tall flame shaped like a warrior's crest — dominant colour fiery orange.
2. (row 1, column 2) two upward arrows made of fire — dominant colour fiery orange.
3. (row 1, column 3) a spear smashing straight through a wooden shield in a burst of splinters — dominant colour fiery orange.
4. (row 1, column 4) glowing embers in a bronze brazier — dominant colour fiery orange.
5. (row 2, column 1) a lion leaping forward in an explosion of fire — dominant colour fiery orange.
6. (row 2, column 2) three spears flying in parallel toward the upper right — dominant colour fiery orange.
7. (row 2, column 3) a golden victory wreath above a raised spear — dominant colour fiery orange.
8. (row 2, column 4) the helmet of Ares, the war god, with burning red eyes — dominant colour fiery orange.

LAYOUT: an invisible grid of 4 columns and 2 rows with equal cells; one icon tile centred in each cell, with clear magenta gaps between the tiles so they never touch each other or the image edge. No grid lines.

BACKGROUND: one flat, uniform pure magenta (#FF00FF) everywhere, no texture, gradient, shadow or noise (it will be removed by chroma key). Never use magenta or pink inside an icon; violet must be clearly bluish.

STYLE (keep exactly the same for every icon): each icon is a square tile with slightly rounded corners and a thin dark border, the whole tile filled with a medium shade of its listed colour (the inside of a tile is never magenta, pink or empty); on it one bold symbol, filling about 75% of the tile, drawn in lighter and darker shades of that same colour with a few small pale highlights (gold only where the list says so). Pixel art drawn as if at 64×64 pixels and enlarged with hard square pixel edges (no anti-aliasing), 16-bit RPG skill-icon style, front view, readable at 32×32; same line weight and top-left lighting for all icons.

AVOID: letters, numbers, words, watermarks; photorealism, soft gradients, blur, glow larger than 2 pixels; drop shadows on the background; round or hexagonal tiles; tiles in a different colour than listed; human figures or faces; crossbows, firearms, sci-fi; any object not named in the list; magenta or pink inside the icons; more or fewer than 8 icons.
```

<details><summary>Indeling</summary>

| Nr | Knooppunt | Bestand |
|---|---|---|
| 1 | Heldenmoed | `spartaan_heldenmoed.png` |
| 2 | Snelle Woede | `spartaan_snelle_woede.png` |
| 3 | Onstuitbare Kracht | `spartaan_onstuitbare_kracht.png` |
| 4 | Nagloeien | `spartaan_nagloeien.png` |
| 5 | Ontlading | `spartaan_ontlading.png` |
| 6 | Speerregen | `spartaan_speerregen.png` |
| 7 | Kleos | `spartaan_kleos.png` |
| 8 | Woede van Ares | `spartaan_woede_van_ares.png` |

</details>

### Vel 3 — pad B · Bloedroof → `assets/skills/sheets/spartaan_3.png`

```text
Wide 16:9 image: a sprite sheet of exactly 8 separate pixel-art game skill icons, arranged in 2 rows of 4, for an ancient Greek/Roman strategy game (class "Voorvechter").

STYLE REFERENCE: the attached image is the exact style to copy — same square tiles with slightly rounded corners and thin dark border, same tile size and spacing, same pixel size, same shading and same one-colour-per-tile look. Only the subjects and colours listed below are different.

CONTENT (most important rule): draw EXACTLY the 8 subjects listed below, each one literally as described, in this order (left to right, top to bottom). Do not replace a subject with a more generic or different object, do not add weapons, helmets, shields, animals, people or objects that are not in the description, and draw every subject only once.

1. (row 1, column 1) a bronze drinking cup (kylix) filled with dark red liquid — dominant colour dark wine red.
2. (row 1, column 2) a curved sickle-shaped blade with drops of red falling from it — dominant colour dark wine red.
3. (row 1, column 3) a short Greek sword (xiphos) with a glowing red blade — dominant colour dark wine red.
4. (row 1, column 4) a bronze bowl overflowing with red liquid onto a shield below it — dominant colour dark wine red.
5. (row 2, column 1) a muscular arm wrapped in iron bands holding a sword — dominant colour dark wine red.
6. (row 2, column 2) two hands clasped in a warrior's handshake, a red cord tied around them — dominant colour dark wine red.
7. (row 2, column 3) a roaring lion with a red mane made of flames — dominant colour dark wine red.
8. (row 2, column 4) a red sword piercing straight through a bronze shield — dominant colour dark wine red.

LAYOUT: an invisible grid of 4 columns and 2 rows with equal cells; one icon tile centred in each cell, with clear magenta gaps between the tiles so they never touch each other or the image edge. No grid lines.

BACKGROUND: one flat, uniform pure magenta (#FF00FF) everywhere, no texture, gradient, shadow or noise (it will be removed by chroma key). Never use magenta or pink inside an icon; violet must be clearly bluish.

STYLE (keep exactly the same for every icon): each icon is a square tile with slightly rounded corners and a thin dark border, the whole tile filled with a medium shade of its listed colour (the inside of a tile is never magenta, pink or empty); on it one bold symbol, filling about 75% of the tile, drawn in lighter and darker shades of that same colour with a few small pale highlights (gold only where the list says so). Pixel art drawn as if at 64×64 pixels and enlarged with hard square pixel edges (no anti-aliasing), 16-bit RPG skill-icon style, front view, readable at 32×32; same line weight and top-left lighting for all icons.

AVOID: letters, numbers, words, watermarks; photorealism, soft gradients, blur, glow larger than 2 pixels; drop shadows on the background; round or hexagonal tiles; tiles in a different colour than listed; human figures or faces; crossbows, firearms, sci-fi; any object not named in the list; magenta or pink inside the icons; more or fewer than 8 icons.
```

<details><summary>Indeling</summary>

| Nr | Knooppunt | Bestand |
|---|---|---|
| 1 | Dorst | `spartaan_dorst.png` |
| 2 | Wrede Oogst | `spartaan_wrede_oogst.png` |
| 3 | Rode Kling | `spartaan_rode_kling.png` |
| 4 | Overvloeiend Bloed | `spartaan_overvloeiend_bloed.png` |
| 5 | IJzeren Vlees | `spartaan_ijzeren_vlees.png` |
| 6 | Bloedbroeders | `spartaan_bloedbroeders.png` |
| 7 | Onverzadigbaar | `spartaan_onverzadigbaar.png` |
| 8 | Brandend Bloed | `spartaan_brandend_bloed.png` |

</details>

### Vel 4 — basis, meester, prestige → `assets/skills/sheets/spartaan_4.png`

```text
Square 1:1 image: a sprite sheet of exactly 4 separate pixel-art game skill icons, arranged in 2 rows of 2, for an ancient Greek/Roman strategy game (class "Voorvechter").

STYLE REFERENCE: the attached image is the exact style to copy — same square tiles with slightly rounded corners and thin dark border, same tile size and spacing, same pixel size, same shading and same one-colour-per-tile look. Only the subjects and colours listed below are different.

CONTENT (most important rule): draw EXACTLY the 4 subjects listed below, each one literally as described, in this order (left to right, top to bottom). Do not replace a subject with a more generic or different object, do not add weapons, helmets, shields, animals, people or objects that are not in the description, and draw every subject only once.

1. (row 1, column 1) a crested Corinthian bronze helmet with a red horsehair crest, seen from the side — dominant colour dark blood red.
2. (row 1, column 2) a golden laurel wreath around a Corinthian helmet — dominant colour warm gold.
3. (row 2, column 1) a lone Greek hero in bronze armour surrounded by a blazing golden aura — dominant colour fiery orange with extra gold.
4. (row 2, column 2) the war god's bronze spear dripping red, crossed with a laurel branch — dominant colour dark wine red with extra gold.

LAYOUT: an invisible grid of 2 columns and 2 rows with equal cells; one icon tile centred in each cell, with clear magenta gaps between the tiles so they never touch each other or the image edge. No grid lines.

BACKGROUND: one flat, uniform pure magenta (#FF00FF) everywhere, no texture, gradient, shadow or noise (it will be removed by chroma key). Never use magenta or pink inside an icon; violet must be clearly bluish.

STYLE (keep exactly the same for every icon): each icon is a square tile with slightly rounded corners and a thin dark border, the whole tile filled with a medium shade of its listed colour (the inside of a tile is never magenta, pink or empty); on it one bold symbol, filling about 75% of the tile, drawn in lighter and darker shades of that same colour with a few small pale highlights (gold only where the list says so). Pixel art drawn as if at 64×64 pixels and enlarged with hard square pixel edges (no anti-aliasing), 16-bit RPG skill-icon style, front view, readable at 32×32; same line weight and top-left lighting for all icons.

AVOID: letters, numbers, words, watermarks; photorealism, soft gradients, blur, glow larger than 2 pixels; drop shadows on the background; round or hexagonal tiles; tiles in a different colour than listed; human figures or faces; crossbows, firearms, sci-fi; any object not named in the list; magenta or pink inside the icons; more or fewer than 4 icons.
```

<details><summary>Indeling</summary>

| Nr | Knooppunt | Bestand |
|---|---|---|
| 1 | Voorvechter | `spartaan_root.png` |
| 2 | Meester | `spartaan_meester.png` |
| 3 | Aristeia | `spartaan_aristeia.png` |
| 4 | Toorn van Ares | `spartaan_toorn_van_ares.png` |

</details>

---

## Cavalerie

### Vel 1 — identiteit ★1–4 → `assets/skills/sheets/cavalerie_1.png`

```text
Wide 16:9 image: a sprite sheet of exactly 8 separate pixel-art game skill icons, arranged in 2 rows of 4, for an ancient Greek/Roman strategy game (class "Cavalerie").

STYLE REFERENCE: the attached image is the exact style to copy — same square tiles with slightly rounded corners and thin dark border, same tile size and spacing, same pixel size, same shading and same one-colour-per-tile look. Only the subjects and colours listed below are different.

CONTENT (most important rule): draw EXACTLY the 8 subjects listed below, each one literally as described, in this order (left to right, top to bottom). Do not replace a subject with a more generic or different object, do not add weapons, helmets, shields, animals, people or objects that are not in the description, and draw every subject only once.

1. (row 1, column 1) a horse lowering its head before a gallop, dust rising behind its hooves — dominant colour rusty copper orange.
2. (row 1, column 2) a curved arrow sweeping around the side of a small block of soldiers — dominant colour wind teal.
3. (row 1, column 3) a long heavy cavalry lance pointing forward horizontally — dominant colour rusty copper orange.
4. (row 1, column 4) a horse galloping away while its rider looks back over his shoulder — dominant colour wind teal.
5. (row 2, column 1) a horse's armoured chest smashing into a wooden barricade — dominant colour rusty copper orange.
6. (row 2, column 2) a rider swerving aside while an arrow flies past him — dominant colour wind teal.
7. (row 2, column 3) a war trumpet sounding with a horse charging out from behind it — dominant colour rusty copper orange.
8. (row 2, column 4) a column of small horse silhouettes riding in a fast diagonal line — dominant colour wind teal.

LAYOUT: an invisible grid of 4 columns and 2 rows with equal cells; one icon tile centred in each cell, with clear magenta gaps between the tiles so they never touch each other or the image edge. No grid lines.

BACKGROUND: one flat, uniform pure magenta (#FF00FF) everywhere, no texture, gradient, shadow or noise (it will be removed by chroma key). Never use magenta or pink inside an icon; violet must be clearly bluish.

STYLE (keep exactly the same for every icon): each icon is a square tile with slightly rounded corners and a thin dark border, the whole tile filled with a medium shade of its listed colour (the inside of a tile is never magenta, pink or empty); on it one bold symbol, filling about 75% of the tile, drawn in lighter and darker shades of that same colour with a few small pale highlights (gold only where the list says so). Pixel art drawn as if at 64×64 pixels and enlarged with hard square pixel edges (no anti-aliasing), 16-bit RPG skill-icon style, front view, readable at 32×32; same line weight and top-left lighting for all icons.

AVOID: letters, numbers, words, watermarks; photorealism, soft gradients, blur, glow larger than 2 pixels; drop shadows on the background; round or hexagonal tiles; tiles in a different colour than listed; human figures or faces; crossbows, firearms, sci-fi; any object not named in the list; magenta or pink inside the icons; more or fewer than 8 icons.
```

<details><summary>Indeling</summary>

| Nr | Knooppunt | Bestand |
|---|---|---|
| 1 | Aanloop | `cavalerie_aanloop.png` |
| 2 | Op de Flank | `cavalerie_op_de_flank.png` |
| 3 | Zware Lansen | `cavalerie_zware_lansen.png` |
| 4 | Toeslaan en Wegwezen | `cavalerie_hit_and_run.png` |
| 5 | Ramkoers | `cavalerie_ramkoers.png` |
| 6 | Ontwijken | `cavalerie_ontwijken.png` |
| 7 | Eerste Inslag | `cavalerie_eerste_inslag.png` |
| 8 | Vliegende Colonne | `cavalerie_vliegende_colonne.png` |

</details>

### Vel 2 — pad A · Schokcavalerie → `assets/skills/sheets/cavalerie_2.png`

```text
Wide 16:9 image: a sprite sheet of exactly 8 separate pixel-art game skill icons, arranged in 2 rows of 4, for an ancient Greek/Roman strategy game (class "Cavalerie").

STYLE REFERENCE: the attached image is the exact style to copy — same square tiles with slightly rounded corners and thin dark border, same tile size and spacing, same pixel size, same shading and same one-colour-per-tile look. Only the subjects and colours listed below are different.

CONTENT (most important rule): draw EXACTLY the 8 subjects listed below, each one literally as described, in this order (left to right, top to bottom). Do not replace a subject with a more generic or different object, do not add weapons, helmets, shields, animals, people or objects that are not in the description, and draw every subject only once.

1. (row 1, column 1) a long trail of hoofprints leading toward a single charging horse — dominant colour rusty copper orange.
2. (row 1, column 2) a horse bursting through a broken line of wooden shields — dominant colour rusty copper orange.
3. (row 1, column 3) four horse hooves striking the ground with lightning-shaped cracks — dominant colour rusty copper orange.
4. (row 1, column 4) a wedge-shaped formation of riders seen from above — dominant colour rusty copper orange.
5. (row 2, column 1) a horse fully covered in scale armour, seen from the side — dominant colour rusty copper orange.
6. (row 2, column 2) a heavy horse hoof crushing a bronze helmet — dominant colour rusty copper orange.
7. (row 2, column 3) a hammer striking down onto an anvil shaped like a round shield — dominant colour rusty copper orange.
8. (row 2, column 4) a black war horse with a white star on its forehead, rearing up — dominant colour rusty copper orange.

LAYOUT: an invisible grid of 4 columns and 2 rows with equal cells; one icon tile centred in each cell, with clear magenta gaps between the tiles so they never touch each other or the image edge. No grid lines.

BACKGROUND: one flat, uniform pure magenta (#FF00FF) everywhere, no texture, gradient, shadow or noise (it will be removed by chroma key). Never use magenta or pink inside an icon; violet must be clearly bluish.

STYLE (keep exactly the same for every icon): each icon is a square tile with slightly rounded corners and a thin dark border, the whole tile filled with a medium shade of its listed colour (the inside of a tile is never magenta, pink or empty); on it one bold symbol, filling about 75% of the tile, drawn in lighter and darker shades of that same colour with a few small pale highlights (gold only where the list says so). Pixel art drawn as if at 64×64 pixels and enlarged with hard square pixel edges (no anti-aliasing), 16-bit RPG skill-icon style, front view, readable at 32×32; same line weight and top-left lighting for all icons.

AVOID: letters, numbers, words, watermarks; photorealism, soft gradients, blur, glow larger than 2 pixels; drop shadows on the background; round or hexagonal tiles; tiles in a different colour than listed; human figures or faces; crossbows, firearms, sci-fi; any object not named in the list; magenta or pink inside the icons; more or fewer than 8 icons.
```

<details><summary>Indeling</summary>

| Nr | Knooppunt | Bestand |
|---|---|---|
| 1 | Lange Aanloop | `cavalerie_lange_aanloop.png` |
| 2 | Doorbraak | `cavalerie_doorbraak.png` |
| 3 | Donderende Hoeven | `cavalerie_donderende_hoeven.png` |
| 4 | Wig | `cavalerie_wig.png` |
| 5 | Kataphrakt | `cavalerie_kataphrakt.png` |
| 6 | Verpletteren | `cavalerie_verpletteren.png` |
| 7 | Hamer en Aambeeld | `cavalerie_hamer_en_aambeeld.png` |
| 8 | Bucephalus | `cavalerie_bucephalus.png` |

</details>

### Vel 3 — pad B · Lichte Ruiterij → `assets/skills/sheets/cavalerie_3.png`

```text
Wide 16:9 image: a sprite sheet of exactly 8 separate pixel-art game skill icons, arranged in 2 rows of 4, for an ancient Greek/Roman strategy game (class "Cavalerie").

STYLE REFERENCE: the attached image is the exact style to copy — same square tiles with slightly rounded corners and thin dark border, same tile size and spacing, same pixel size, same shading and same one-colour-per-tile look. Only the subjects and colours listed below are different.

CONTENT (most important rule): draw EXACTLY the 8 subjects listed below, each one literally as described, in this order (left to right, top to bottom). Do not replace a subject with a more generic or different object, do not add weapons, helmets, shields, animals, people or objects that are not in the description, and draw every subject only once.

1. (row 1, column 1) a horse galloping with wind lines streaming from its mane — dominant colour wind teal.
2. (row 1, column 2) a horse galloping to the right while its rider twists backwards in the saddle and shoots an arrow to the LEFT, behind him — dominant colour wind teal.
3. (row 1, column 3) an hourglass with a horseshoe hanging in front of it — dominant colour wind teal.
4. (row 1, column 4) two horseshoes side by side with small motion lines between them — dominant colour wind teal.
5. (row 2, column 1) a light rider on a small horse without a saddle, holding a javelin — dominant colour wind teal.
6. (row 2, column 2) several javelins flying in a fan shape from the side — dominant colour wind teal.
7. (row 2, column 3) three riders in three directions around a small shield in the centre — dominant colour wind teal.
8. (row 2, column 4) a horse spinning in a circle of dust and wind — dominant colour wind teal.

LAYOUT: an invisible grid of 4 columns and 2 rows with equal cells; one icon tile centred in each cell, with clear magenta gaps between the tiles so they never touch each other or the image edge. No grid lines.

BACKGROUND: one flat, uniform pure magenta (#FF00FF) everywhere, no texture, gradient, shadow or noise (it will be removed by chroma key). Never use magenta or pink inside an icon; violet must be clearly bluish.

STYLE (keep exactly the same for every icon): each icon is a square tile with slightly rounded corners and a thin dark border, the whole tile filled with a medium shade of its listed colour (the inside of a tile is never magenta, pink or empty); on it one bold symbol, filling about 75% of the tile, drawn in lighter and darker shades of that same colour with a few small pale highlights (gold only where the list says so). Pixel art drawn as if at 64×64 pixels and enlarged with hard square pixel edges (no anti-aliasing), 16-bit RPG skill-icon style, front view, readable at 32×32; same line weight and top-left lighting for all icons.

AVOID: letters, numbers, words, watermarks; photorealism, soft gradients, blur, glow larger than 2 pixels; drop shadows on the background; round or hexagonal tiles; tiles in a different colour than listed; human figures or faces; crossbows, firearms, sci-fi; any object not named in the list; magenta or pink inside the icons; more or fewer than 8 icons.
```

<details><summary>Indeling</summary>

| Nr | Knooppunt | Bestand |
|---|---|---|
| 1 | Windruiter | `cavalerie_windruiter.png` |
| 2 | Parthisch Schot | `cavalerie_parthisch_schot.png` |
| 3 | Ruitervaardigheid | `cavalerie_ruitervaardigheid.png` |
| 4 | Ritme | `cavalerie_ritme.png` |
| 5 | Numidische Ruiters | `cavalerie_numidische_ruiters.png` |
| 6 | Speervuur | `cavalerie_speervuur.png` |
| 7 | Overal Tegelijk | `cavalerie_overal_tegelijk.png` |
| 8 | Wervelwind | `cavalerie_wervelwind.png` |

</details>

### Vel 4 — basis, meester, prestige → `assets/skills/sheets/cavalerie_4.png`

```text
Square 1:1 image: a sprite sheet of exactly 4 separate pixel-art game skill icons, arranged in 2 rows of 2, for an ancient Greek/Roman strategy game (class "Cavalerie").

STYLE REFERENCE: the attached image is the exact style to copy — same square tiles with slightly rounded corners and thin dark border, same tile size and spacing, same pixel size, same shading and same one-colour-per-tile look. Only the subjects and colours listed below are different.

CONTENT (most important rule): draw EXACTLY the 4 subjects listed below, each one literally as described, in this order (left to right, top to bottom). Do not replace a subject with a more generic or different object, do not add weapons, helmets, shields, animals, people or objects that are not in the description, and draw every subject only once.

1. (row 1, column 1) a rearing horse's head and neck in profile with a bronze bridle — dominant colour dark ochre brown.
2. (row 1, column 2) a golden laurel wreath around a horseshoe — dominant colour warm gold.
3. (row 2, column 1) the head and neck of a black war horse in profile with a bronze face plate, a cavalry spear pointing forward past it (no rider, no other horses) — dominant colour rusty copper orange with extra gold.
4. (row 2, column 2) a swirling whirlwind spiral with three javelins flying outward from it (no people, no horses) — dominant colour wind teal with extra gold.

LAYOUT: an invisible grid of 2 columns and 2 rows with equal cells; one icon tile centred in each cell, with clear magenta gaps between the tiles so they never touch each other or the image edge. No grid lines.

BACKGROUND: one flat, uniform pure magenta (#FF00FF) everywhere, no texture, gradient, shadow or noise (it will be removed by chroma key). Never use magenta or pink inside an icon; violet must be clearly bluish.

STYLE (keep exactly the same for every icon): each icon is a square tile with slightly rounded corners and a thin dark border, the whole tile filled with a medium shade of its listed colour (the inside of a tile is never magenta, pink or empty); on it one bold symbol, filling about 75% of the tile, drawn in lighter and darker shades of that same colour with a few small pale highlights (gold only where the list says so). Pixel art drawn as if at 64×64 pixels and enlarged with hard square pixel edges (no anti-aliasing), 16-bit RPG skill-icon style, front view, readable at 32×32; same line weight and top-left lighting for all icons.

AVOID: letters, numbers, words, watermarks; photorealism, soft gradients, blur, glow larger than 2 pixels; drop shadows on the background; round or hexagonal tiles; tiles in a different colour than listed; human figures or faces; crossbows, firearms, sci-fi; any object not named in the list; magenta or pink inside the icons; more or fewer than 4 icons.
```

<details><summary>Indeling</summary>

| Nr | Knooppunt | Bestand |
|---|---|---|
| 1 | Cavalerie | `cavalerie_root.png` |
| 2 | Meester | `cavalerie_meester.png` |
| 3 | Charge van Alexander | `cavalerie_charge_van_alexander.png` |
| 4 | Numidische Storm | `cavalerie_numidische_storm.png` |

</details>

---

## Priester

### Vel 1 — identiteit ★1–4 → `assets/skills/sheets/priester_1.png`

```text
Wide 16:9 image: a sprite sheet of exactly 8 separate pixel-art game skill icons, arranged in 2 rows of 4, for an ancient Greek/Roman strategy game (class "Priester").

STYLE REFERENCE: the attached image is the exact style to copy — same square tiles with slightly rounded corners and thin dark border, same tile size and spacing, same pixel size, same shading and same one-colour-per-tile look. Only the subjects and colours listed below are different.

CONTENT (most important rule): draw EXACTLY the 8 subjects listed below, each one literally as described, in this order (left to right, top to bottom). Do not replace a subject with a more generic or different object, do not add weapons, helmets, shields, animals, people or objects that are not in the description, and draw every subject only once.

1. (row 1, column 1) a hand pressing a glowing green herb onto a bandaged wound — dominant colour soft healing green.
2. (row 1, column 2) a dark purple cloud with a single downward bolt above a broken spear — dominant colour mystic violet.
3. (row 1, column 3) a sacred spring pouring clear water from a stone lion's mouth — dominant colour soft healing green.
4. (row 1, column 4) the inscription stone of Delphi with a small glowing eye above it — dominant colour mystic violet.
5. (row 2, column 1) a shallow bowl with a snake drinking from it, bathed in soft light — dominant colour soft healing green.
6. (row 2, column 2) a single staring painted eye on a dark clay amulet — dominant colour mystic violet.
7. (row 2, column 3) a wooden staff with a single snake coiled around it — dominant colour soft healing green.
8. (row 2, column 4) a purple flame burning in a bronze tripod — dominant colour mystic violet.

LAYOUT: an invisible grid of 4 columns and 2 rows with equal cells; one icon tile centred in each cell, with clear magenta gaps between the tiles so they never touch each other or the image edge. No grid lines.

BACKGROUND: one flat, uniform pure magenta (#FF00FF) everywhere, no texture, gradient, shadow or noise (it will be removed by chroma key). Never use magenta or pink inside an icon; violet must be clearly bluish.

STYLE (keep exactly the same for every icon): each icon is a square tile with slightly rounded corners and a thin dark border, the whole tile filled with a medium shade of its listed colour (the inside of a tile is never magenta, pink or empty); on it one bold symbol, filling about 75% of the tile, drawn in lighter and darker shades of that same colour with a few small pale highlights (gold only where the list says so). Pixel art drawn as if at 64×64 pixels and enlarged with hard square pixel edges (no anti-aliasing), 16-bit RPG skill-icon style, front view, readable at 32×32; same line weight and top-left lighting for all icons.

AVOID: letters, numbers, words, watermarks; photorealism, soft gradients, blur, glow larger than 2 pixels; drop shadows on the background; round or hexagonal tiles; tiles in a different colour than listed; human figures or faces; crossbows, firearms, sci-fi; any object not named in the list; magenta or pink inside the icons; more or fewer than 8 icons.
```

<details><summary>Indeling</summary>

| Nr | Knooppunt | Bestand |
|---|---|---|
| 1 | Noodhulp | `priester_noodhulp.png` |
| 2 | Vloek der Goden | `priester_vloek_der_goden.png` |
| 3 | Heilige Bron | `priester_heilige_bron.png` |
| 4 | Les van Delphi | `priester_les_van_delphi.png` |
| 5 | Zegen van Hygieia | `priester_zegen_van_hygieia.png` |
| 6 | Boze Oog | `priester_boze_oog.png` |
| 7 | Staf van Asklepios | `priester_staf_van_asklepios.png` |
| 8 | Gewijd Vuur | `priester_gewijd_vuur.png` |

</details>

### Vel 2 — pad A · Heler → `assets/skills/sheets/priester_2.png`

```text
Wide 16:9 image: a sprite sheet of exactly 8 separate pixel-art game skill icons, arranged in 2 rows of 4, for an ancient Greek/Roman strategy game (class "Priester").

STYLE REFERENCE: the attached image is the exact style to copy — same square tiles with slightly rounded corners and thin dark border, same tile size and spacing, same pixel size, same shading and same one-colour-per-tile look. Only the subjects and colours listed below are different.

CONTENT (most important rule): draw EXACTLY the 8 subjects listed below, each one literally as described, in this order (left to right, top to bottom). Do not replace a subject with a more generic or different object, do not add weapons, helmets, shields, animals, people or objects that are not in the description, and draw every subject only once.

1. (row 1, column 1) a running figure carrying a bowl of glowing green ointment — dominant colour soft healing green.
2. (row 1, column 2) a bundle of dried healing herbs tied with string — dominant colour soft healing green.
3. (row 1, column 3) a golden bowl with a snake coiled around its base, glowing liquid inside — dominant colour soft healing green.
4. (row 1, column 4) a sleeping figure on a temple bench under a crescent moon — dominant colour soft healing green.
5. (row 2, column 1) a small round Greek stone theatre with stepped semicircular seats, seen from the front, simple and bold (no sky, no landscape) — dominant colour soft healing green.
6. (row 2, column 2) a green temple snake coiled in a spiral on a stone floor — dominant colour soft healing green.
7. (row 2, column 3) a small glass vial of glowing golden medicine — dominant colour soft healing green.
8. (row 2, column 4) a beam of golden light falling onto an open hand — dominant colour soft healing green.

LAYOUT: an invisible grid of 4 columns and 2 rows with equal cells; one icon tile centred in each cell, with clear magenta gaps between the tiles so they never touch each other or the image edge. No grid lines.

BACKGROUND: one flat, uniform pure magenta (#FF00FF) everywhere, no texture, gradient, shadow or noise (it will be removed by chroma key). Never use magenta or pink inside an icon; violet must be clearly bluish.

STYLE (keep exactly the same for every icon): each icon is a square tile with slightly rounded corners and a thin dark border, the whole tile filled with a medium shade of its listed colour (the inside of a tile is never magenta, pink or empty); on it one bold symbol, filling about 75% of the tile, drawn in lighter and darker shades of that same colour with a few small pale highlights (gold only where the list says so). Pixel art drawn as if at 64×64 pixels and enlarged with hard square pixel edges (no anti-aliasing), 16-bit RPG skill-icon style, front view, readable at 32×32; same line weight and top-left lighting for all icons.

AVOID: letters, numbers, words, watermarks; photorealism, soft gradients, blur, glow larger than 2 pixels; drop shadows on the background; round or hexagonal tiles; tiles in a different colour than listed; human figures or faces; crossbows, firearms, sci-fi; any object not named in the list; magenta or pink inside the icons; more or fewer than 8 icons.
```

<details><summary>Indeling</summary>

| Nr | Knooppunt | Bestand |
|---|---|---|
| 1 | Snelle Hulp | `priester_snelle_hulp.png` |
| 2 | Kruiden | `priester_kruiden.png` |
| 3 | Schaal van Hygieia | `priester_schaal_van_hygieia.png` |
| 4 | Tempelslaap | `priester_tempelslaap.png` |
| 5 | Epidauros | `priester_epidauros.png` |
| 6 | Heilige Slang | `priester_heilige_slang.png` |
| 7 | Panakeia | `priester_panakeia.png` |
| 8 | Wonderheling | `priester_wonderheling.png` |

</details>

### Vel 3 — pad B · Orakel → `assets/skills/sheets/priester_3.png`

```text
Wide 16:9 image: a sprite sheet of exactly 8 separate pixel-art game skill icons, arranged in 2 rows of 4, for an ancient Greek/Roman strategy game (class "Priester").

STYLE REFERENCE: the attached image is the exact style to copy — same square tiles with slightly rounded corners and thin dark border, same tile size and spacing, same pixel size, same shading and same one-colour-per-tile look. Only the subjects and colours listed below are different.

CONTENT (most important rule): draw EXACTLY the 8 subjects listed below, each one literally as described, in this order (left to right, top to bottom). Do not replace a subject with a more generic or different object, do not add weapons, helmets, shields, animals, people or objects that are not in the description, and draw every subject only once.

1. (row 1, column 1) a heavy dark iron chain wrapped around a sword hilt — dominant colour mystic violet.
2. (row 1, column 2) a black sun partly covered by a dark moon (eclipse) — dominant colour mystic violet.
3. (row 1, column 3) a rolled papyrus scroll glowing with purple writing — dominant colour mystic violet.
4. (row 1, column 4) a Greek sphinx seated on a rock, seen from the side: lion body, eagle wings and a woman's head, with a question-mark-shaped curl of smoke above it (Greek, NOT Egyptian: no pharaoh headdress) — dominant colour mystic violet.
5. (row 2, column 1) a bronze balance scale with a lightning bolt on one side — dominant colour mystic violet.
6. (row 2, column 2) three ancient scrolls tied together with a purple ribbon — dominant colour mystic violet.
7. (row 2, column 3) a winged female figure holding a sword and a measuring rod — dominant colour mystic violet.
8. (row 2, column 4) a young priestess with wide eyes and a laurel band, seen from the side — dominant colour mystic violet.

LAYOUT: an invisible grid of 4 columns and 2 rows with equal cells; one icon tile centred in each cell, with clear magenta gaps between the tiles so they never touch each other or the image edge. No grid lines.

BACKGROUND: one flat, uniform pure magenta (#FF00FF) everywhere, no texture, gradient, shadow or noise (it will be removed by chroma key). Never use magenta or pink inside an icon; violet must be clearly bluish.

STYLE (keep exactly the same for every icon): each icon is a square tile with slightly rounded corners and a thin dark border, the whole tile filled with a medium shade of its listed colour (the inside of a tile is never magenta, pink or empty); on it one bold symbol, filling about 75% of the tile, drawn in lighter and darker shades of that same colour with a few small pale highlights (gold only where the list says so). Pixel art drawn as if at 64×64 pixels and enlarged with hard square pixel edges (no anti-aliasing), 16-bit RPG skill-icon style, front view, readable at 32×32; same line weight and top-left lighting for all icons.

AVOID: letters, numbers, words, watermarks; photorealism, soft gradients, blur, glow larger than 2 pixels; drop shadows on the background; round or hexagonal tiles; tiles in a different colour than listed; human figures or faces; crossbows, firearms, sci-fi; any object not named in the list; magenta or pink inside the icons; more or fewer than 8 icons.
```

<details><summary>Indeling</summary>

| Nr | Knooppunt | Bestand |
|---|---|---|
| 1 | Zware Vloek | `priester_zware_vloek.png` |
| 2 | Onheilsdag | `priester_onheilsdag.png` |
| 3 | Duistere Taal | `priester_duistere_taal.png` |
| 4 | Raadselspreuk | `priester_raadselspreuk.png` |
| 5 | Godsoordeel | `priester_godsoordeel.png` |
| 6 | Sibyllijnse Boeken | `priester_sibyllijnse_boeken.png` |
| 7 | Nemesis | `priester_nemesis.png` |
| 8 | Cassandra | `priester_cassandra.png` |

</details>

### Vel 4 — basis, meester, prestige → `assets/skills/sheets/priester_4.png`

```text
Square 1:1 image: a sprite sheet of exactly 4 separate pixel-art game skill icons, arranged in 2 rows of 2, for an ancient Greek/Roman strategy game (class "Priester").

STYLE REFERENCE: the attached image is the exact style to copy — same square tiles with slightly rounded corners and thin dark border, same tile size and spacing, same pixel size, same shading and same one-colour-per-tile look. Only the subjects and colours listed below are different.

CONTENT (most important rule): draw EXACTLY the 4 subjects listed below, each one literally as described, in this order (left to right, top to bottom). Do not replace a subject with a more generic or different object, do not add weapons, helmets, shields, animals, people or objects that are not in the description, and draw every subject only once.

1. (row 1, column 1) a burning bronze altar bowl with smoke curling upward — dominant colour temple green.
2. (row 1, column 2) a golden laurel wreath around a small burning altar — dominant colour warm gold.
3. (row 2, column 1) a glowing open hand in front of the rod of Asclepius: one plain wooden staff with exactly one snake coiled around it (NOT a caduceus: no wings, not two snakes) — dominant colour soft healing green with extra gold.
4. (row 2, column 2) the Pythia seated on a bronze tripod above a crack with rising purple vapour — dominant colour mystic violet with extra gold.

LAYOUT: an invisible grid of 2 columns and 2 rows with equal cells; one icon tile centred in each cell, with clear magenta gaps between the tiles so they never touch each other or the image edge. No grid lines.

BACKGROUND: one flat, uniform pure magenta (#FF00FF) everywhere, no texture, gradient, shadow or noise (it will be removed by chroma key). Never use magenta or pink inside an icon; violet must be clearly bluish.

STYLE (keep exactly the same for every icon): each icon is a square tile with slightly rounded corners and a thin dark border, the whole tile filled with a medium shade of its listed colour (the inside of a tile is never magenta, pink or empty); on it one bold symbol, filling about 75% of the tile, drawn in lighter and darker shades of that same colour with a few small pale highlights (gold only where the list says so). Pixel art drawn as if at 64×64 pixels and enlarged with hard square pixel edges (no anti-aliasing), 16-bit RPG skill-icon style, front view, readable at 32×32; same line weight and top-left lighting for all icons.

AVOID: letters, numbers, words, watermarks; photorealism, soft gradients, blur, glow larger than 2 pixels; drop shadows on the background; round or hexagonal tiles; tiles in a different colour than listed; human figures or faces; crossbows, firearms, sci-fi; any object not named in the list; magenta or pink inside the icons; more or fewer than 4 icons.
```

<details><summary>Indeling</summary>

| Nr | Knooppunt | Bestand |
|---|---|---|
| 1 | Priester | `priester_root.png` |
| 2 | Meester | `priester_meester.png` |
| 3 | Hand van Asklepios | `priester_hand_van_asklepios.png` |
| 4 | Orakel van Delphi | `priester_orakel_van_delphi.png` |

</details>

---

## Bevelvoerder

### Vel 1 — identiteit ★1–4 → `assets/skills/sheets/centurio_1.png`

```text
Wide 16:9 image: a sprite sheet of exactly 8 separate pixel-art game skill icons, arranged in 2 rows of 4, for an ancient Greek/Roman strategy game (class "Bevelvoerder").

STYLE REFERENCE: the attached image is the exact style to copy — same square tiles with slightly rounded corners and thin dark border, same tile size and spacing, same pixel size, same shading and same one-colour-per-tile look. Only the subjects and colours listed below are different.

CONTENT (most important rule): draw EXACTLY the 8 subjects listed below, each one literally as described, in this order (left to right, top to bottom). Do not replace a subject with a more generic or different object, do not add weapons, helmets, shields, animals, people or objects that are not in the description, and draw every subject only once.

1. (row 1, column 1) a stack of grain sacks and an amphora on a small wooden cart — dominant colour supply teal.
2. (row 1, column 2) a Roman legion standard with a raised eagle and red banner — dominant colour imperial violet.
3. (row 1, column 3) a running Roman messenger carrying a small sack over his shoulder — dominant colour supply teal.
4. (row 1, column 4) a Roman standard-bearer's pole with round metal discs (phalerae) — dominant colour imperial violet.
5. (row 2, column 1) two hands catching a falling bronze helmet — dominant colour supply teal.
6. (row 2, column 2) a commander's eye looking over a small field camp with tents — dominant colour imperial violet.
7. (row 2, column 3) a wax writing tablet with neat rows of tally marks and a stylus — dominant colour supply teal.
8. (row 2, column 4) a golden Roman legion eagle with spread wings on top of a pole — dominant colour imperial violet.

LAYOUT: an invisible grid of 4 columns and 2 rows with equal cells; one icon tile centred in each cell, with clear magenta gaps between the tiles so they never touch each other or the image edge. No grid lines.

BACKGROUND: one flat, uniform pure magenta (#FF00FF) everywhere, no texture, gradient, shadow or noise (it will be removed by chroma key). Never use magenta or pink inside an icon; violet must be clearly bluish.

STYLE (keep exactly the same for every icon): each icon is a square tile with slightly rounded corners and a thin dark border, the whole tile filled with a medium shade of its listed colour (the inside of a tile is never magenta, pink or empty); on it one bold symbol, filling about 75% of the tile, drawn in lighter and darker shades of that same colour with a few small pale highlights (gold only where the list says so). Pixel art drawn as if at 64×64 pixels and enlarged with hard square pixel edges (no anti-aliasing), 16-bit RPG skill-icon style, front view, readable at 32×32; same line weight and top-left lighting for all icons.

AVOID: letters, numbers, words, watermarks; photorealism, soft gradients, blur, glow larger than 2 pixels; drop shadows on the background; round or hexagonal tiles; tiles in a different colour than listed; human figures or faces; crossbows, firearms, sci-fi; any object not named in the list; magenta or pink inside the icons; more or fewer than 8 icons.
```

<details><summary>Indeling</summary>

| Nr | Knooppunt | Bestand |
|---|---|---|
| 1 | Bevoorrading | `centurio_bevoorrading.png` |
| 2 | Moreel | `centurio_moreel.png` |
| 3 | Snelle Bevoorrading | `centurio_snelle_bevoorrading.png` |
| 4 | Signifer | `centurio_signifer.png` |
| 5 | Opvangen | `centurio_opvangen.png` |
| 6 | Veldheersblik | `centurio_veldheersblik.png` |
| 7 | Logistiek | `centurio_logistiek.png` |
| 8 | Aquila | `centurio_aquila.png` |

</details>

### Vel 2 — pad A · Kwartiermeester → `assets/skills/sheets/centurio_2.png`

```text
Wide 16:9 image: a sprite sheet of exactly 8 separate pixel-art game skill icons, arranged in 2 rows of 4, for an ancient Greek/Roman strategy game (class "Bevelvoerder").

STYLE REFERENCE: the attached image is the exact style to copy — same square tiles with slightly rounded corners and thin dark border, same tile size and spacing, same pixel size, same shading and same one-colour-per-tile look. Only the subjects and colours listed below are different.

CONTENT (most important rule): draw EXACTLY the 8 subjects listed below, each one literally as described, in this order (left to right, top to bottom). Do not replace a subject with a more generic or different object, do not add weapons, helmets, shields, animals, people or objects that are not in the description, and draw every subject only once.

1. (row 1, column 1) a Roman granary building with open doors full of grain — dominant colour supply teal.
2. (row 1, column 2) a leather marching pack with a bread loaf and a water flask — dominant colour supply teal.
3. (row 1, column 3) a bronze cooking pot steaming over a small camp fire — dominant colour supply teal.
4. (row 1, column 4) a rope net stretched between two wooden posts — dominant colour supply teal.
5. (row 2, column 1) a mule carrying packs and a pickaxe on its back — dominant colour supply teal.
6. (row 2, column 2) a battered old Roman helmet with many dents and a scar-like scratch — dominant colour supply teal.
7. (row 2, column 3) a Roman legionary carrying a heavy pack on a forked pole over his shoulder — dominant colour supply teal.
8. (row 2, column 4) four forearms seen from above, each hand gripping the wrist of the next, together forming a closed square — dominant colour supply teal.

LAYOUT: an invisible grid of 4 columns and 2 rows with equal cells; one icon tile centred in each cell, with clear magenta gaps between the tiles so they never touch each other or the image edge. No grid lines.

BACKGROUND: one flat, uniform pure magenta (#FF00FF) everywhere, no texture, gradient, shadow or noise (it will be removed by chroma key). Never use magenta or pink inside an icon; violet must be clearly bluish.

STYLE (keep exactly the same for every icon): each icon is a square tile with slightly rounded corners and a thin dark border, the whole tile filled with a medium shade of its listed colour (the inside of a tile is never magenta, pink or empty); on it one bold symbol, filling about 75% of the tile, drawn in lighter and darker shades of that same colour with a few small pale highlights (gold only where the list says so). Pixel art drawn as if at 64×64 pixels and enlarged with hard square pixel edges (no anti-aliasing), 16-bit RPG skill-icon style, front view, readable at 32×32; same line weight and top-left lighting for all icons.

AVOID: letters, numbers, words, watermarks; photorealism, soft gradients, blur, glow larger than 2 pixels; drop shadows on the background; round or hexagonal tiles; tiles in a different colour than listed; human figures or faces; crossbows, firearms, sci-fi; any object not named in the list; magenta or pink inside the icons; more or fewer than 8 icons.
```

<details><summary>Indeling</summary>

| Nr | Knooppunt | Bestand |
|---|---|---|
| 1 | Volle Schuren | `centurio_volle_schuren.png` |
| 2 | Marsrantsoen | `centurio_marsrantsoen.png` |
| 3 | Veldkeuken | `centurio_veldkeuken.png` |
| 4 | Vangnet | `centurio_vangnet.png` |
| 5 | Bagagetrein | `centurio_bagagetrein.png` |
| 6 | Taaie Veteraan | `centurio_taaie_veteraan.png` |
| 7 | Muilezels van Marius | `centurio_muilezels_van_marius.png` |
| 8 | Niemand Valt | `centurio_niemand_valt.png` |

</details>

### Vel 3 — pad B · Aanvoerder → `assets/skills/sheets/centurio_3.png`

```text
Wide 16:9 image: a sprite sheet of exactly 8 separate pixel-art game skill icons, arranged in 2 rows of 4, for an ancient Greek/Roman strategy game (class "Bevelvoerder").

STYLE REFERENCE: the attached image is the exact style to copy — same square tiles with slightly rounded corners and thin dark border, same tile size and spacing, same pixel size, same shading and same one-colour-per-tile look. Only the subjects and colours listed below are different.

CONTENT (most important rule): draw EXACTLY the 8 subjects listed below, each one literally as described, in this order (left to right, top to bottom). Do not replace a subject with a more generic or different object, do not add weapons, helmets, shields, animals, people or objects that are not in the description, and draw every subject only once.

1. (row 1, column 1) a centurion's vine staff raised high with a golden ribbon — dominant colour imperial violet.
2. (row 1, column 2) an open-mouthed Roman helmet with sound waves coming out — dominant colour imperial violet.
3. (row 1, column 3) a tribune's narrow purple-striped cloak draped over a chair — dominant colour imperial violet.
4. (row 1, column 4) a perfect square formation of shields seen from above (testudo) — dominant colour imperial violet.
5. (row 2, column 1) a square red military banner (vexillum) hanging from a crossbar — dominant colour imperial violet.
6. (row 2, column 2) a kneeling veteran soldier with a long spear braced against the ground — dominant colour imperial violet.
7. (row 2, column 3) a bundle of rods with an axe (fasces) tied with red leather straps — dominant colour imperial violet.
8. (row 2, column 4) a golden eagle surrounded by shining rays of light — dominant colour imperial violet.

LAYOUT: an invisible grid of 4 columns and 2 rows with equal cells; one icon tile centred in each cell, with clear magenta gaps between the tiles so they never touch each other or the image edge. No grid lines.

BACKGROUND: one flat, uniform pure magenta (#FF00FF) everywhere, no texture, gradient, shadow or noise (it will be removed by chroma key). Never use magenta or pink inside an icon; violet must be clearly bluish.

STYLE (keep exactly the same for every icon): each icon is a square tile with slightly rounded corners and a thin dark border, the whole tile filled with a medium shade of its listed colour (the inside of a tile is never magenta, pink or empty); on it one bold symbol, filling about 75% of the tile, drawn in lighter and darker shades of that same colour with a few small pale highlights (gold only where the list says so). Pixel art drawn as if at 64×64 pixels and enlarged with hard square pixel edges (no anti-aliasing), 16-bit RPG skill-icon style, front view, readable at 32×32; same line weight and top-left lighting for all icons.

AVOID: letters, numbers, words, watermarks; photorealism, soft gradients, blur, glow larger than 2 pixels; drop shadows on the background; round or hexagonal tiles; tiles in a different colour than listed; human figures or faces; crossbows, firearms, sci-fi; any object not named in the list; magenta or pink inside the icons; more or fewer than 8 icons.
```

<details><summary>Indeling</summary>

| Nr | Knooppunt | Bestand |
|---|---|---|
| 1 | Optimus | `centurio_optimus.png` |
| 2 | Strijdkreet | `centurio_strijdkreet.png` |
| 3 | Tribunus | `centurio_tribunus.png` |
| 4 | Disciplina | `centurio_disciplina.png` |
| 5 | Signum | `centurio_signum.png` |
| 6 | Triarii | `centurio_triarii.png` |
| 7 | Imperium | `centurio_imperium.png` |
| 8 | Gloria | `centurio_gloria.png` |

</details>

### Vel 4 — basis, meester, prestige → `assets/skills/sheets/centurio_4.png`

```text
Square 1:1 image: a sprite sheet of exactly 4 separate pixel-art game skill icons, arranged in 2 rows of 2, for an ancient Greek/Roman strategy game (class "Bevelvoerder").

STYLE REFERENCE: the attached image is the exact style to copy — same square tiles with slightly rounded corners and thin dark border, same tile size and spacing, same pixel size, same shading and same one-colour-per-tile look. Only the subjects and colours listed below are different.

CONTENT (most important rule): draw EXACTLY the 4 subjects listed below, each one literally as described, in this order (left to right, top to bottom). Do not replace a subject with a more generic or different object, do not add weapons, helmets, shields, animals, people or objects that are not in the description, and draw every subject only once.

1. (row 1, column 1) a Roman centurion's helmet with a sideways red crest, seen from the front — dominant colour imperial purple.
2. (row 1, column 2) a golden laurel wreath around a centurion's vine staff (vitis) — dominant colour warm gold.
3. (row 2, column 1) a cargo ship full of grain sacks with a sheaf of wheat on its sail — dominant colour supply teal with extra gold.
4. (row 2, column 2) a golden four-horse triumphal chariot seen from the front, a laurel wreath above it — dominant colour imperial violet with extra gold.

LAYOUT: an invisible grid of 2 columns and 2 rows with equal cells; one icon tile centred in each cell, with clear magenta gaps between the tiles so they never touch each other or the image edge. No grid lines.

BACKGROUND: one flat, uniform pure magenta (#FF00FF) everywhere, no texture, gradient, shadow or noise (it will be removed by chroma key). Never use magenta or pink inside an icon; violet must be clearly bluish.

STYLE (keep exactly the same for every icon): each icon is a square tile with slightly rounded corners and a thin dark border, the whole tile filled with a medium shade of its listed colour (the inside of a tile is never magenta, pink or empty); on it one bold symbol, filling about 75% of the tile, drawn in lighter and darker shades of that same colour with a few small pale highlights (gold only where the list says so). Pixel art drawn as if at 64×64 pixels and enlarged with hard square pixel edges (no anti-aliasing), 16-bit RPG skill-icon style, front view, readable at 32×32; same line weight and top-left lighting for all icons.

AVOID: letters, numbers, words, watermarks; photorealism, soft gradients, blur, glow larger than 2 pixels; drop shadows on the background; round or hexagonal tiles; tiles in a different colour than listed; human figures or faces; crossbows, firearms, sci-fi; any object not named in the list; magenta or pink inside the icons; more or fewer than 4 icons.
```

<details><summary>Indeling</summary>

| Nr | Knooppunt | Bestand |
|---|---|---|
| 1 | Bevelvoerder | `centurio_root.png` |
| 2 | Meester | `centurio_meester.png` |
| 3 | Annona | `centurio_annona.png` |
| 4 | Triumphus | `centurio_triumphus.png` |

</details>

---

## Genie

### Vel 1 — identiteit ★1–4 → `assets/skills/sheets/genie_1.png`

```text
Wide 16:9 image: a sprite sheet of exactly 8 separate pixel-art game skill icons, arranged in 2 rows of 4, for an ancient Greek/Roman strategy game (class "Genie").

STYLE REFERENCE: the attached image is the exact style to copy — same square tiles with slightly rounded corners and thin dark border, same tile size and spacing, same pixel size, same shading and same one-colour-per-tile look. Only the subjects and colours listed below are different.

CONTENT (most important rule): draw EXACTLY the 8 subjects listed below, each one literally as described, in this order (left to right, top to bottom). Do not replace a subject with a more generic or different object, do not add weapons, helmets, shields, animals, people or objects that are not in the description, and draw every subject only once.

1. (row 1, column 1) a small wooden catapult (onager) with its throwing arm pulled back — dominant colour fiery siege orange.
2. (row 1, column 2) a row of sharpened wooden stakes forming a palisade wall — dominant colour sage stone grey-green.
3. (row 1, column 3) a cracked shield turning into a burst of flying stone fragments — dominant colour fiery siege orange.
4. (row 1, column 4) a freshly dug defensive ditch with a pile of earth behind it — dominant colour sage stone grey-green.
5. (row 2, column 1) a scroll with a drawn plan of a fortress wall and a pointing stylus — dominant colour fiery siege orange.
6. (row 2, column 2) large square foundation stones stacked in a solid base — dominant colour sage stone grey-green.
7. (row 2, column 3) a clay pot with burning oil flying through the air — dominant colour fiery siege orange.
8. (row 2, column 4) a covered pit trap with sharpened stakes visible at the bottom — dominant colour sage stone grey-green.

LAYOUT: an invisible grid of 4 columns and 2 rows with equal cells; one icon tile centred in each cell, with clear magenta gaps between the tiles so they never touch each other or the image edge. No grid lines.

BACKGROUND: one flat, uniform pure magenta (#FF00FF) everywhere, no texture, gradient, shadow or noise (it will be removed by chroma key). Never use magenta or pink inside an icon; violet must be clearly bluish.

STYLE (keep exactly the same for every icon): each icon is a square tile with slightly rounded corners and a thin dark border, the whole tile filled with a medium shade of its listed colour (the inside of a tile is never magenta, pink or empty); on it one bold symbol, filling about 75% of the tile, drawn in lighter and darker shades of that same colour with a few small pale highlights (gold only where the list says so). Pixel art drawn as if at 64×64 pixels and enlarged with hard square pixel edges (no anti-aliasing), 16-bit RPG skill-icon style, front view, readable at 32×32; same line weight and top-left lighting for all icons.

AVOID: letters, numbers, words, watermarks; photorealism, soft gradients, blur, glow larger than 2 pixels; drop shadows on the background; round or hexagonal tiles; tiles in a different colour than listed; human figures or faces; crossbows, firearms, sci-fi; any object not named in the list; magenta or pink inside the icons; more or fewer than 8 icons.
```

<details><summary>Indeling</summary>

| Nr | Knooppunt | Bestand |
|---|---|---|
| 1 | Katapult Bouwen | `genie_katapult_bouwen.png` |
| 2 | Palissade | `genie_palissade.png` |
| 3 | Omslaan | `genie_omslaan.png` |
| 4 | Gegraven Greppel | `genie_gegraven_greppel.png` |
| 5 | Belegeringskunde | `genie_belegeringskunde.png` |
| 6 | Stevige Fundering | `genie_stevige_fundering.png` |
| 7 | Vuurpotten | `genie_vuurpotten.png` |
| 8 | Valkuil | `genie_valkuil.png` |

</details>

### Vel 2 — pad A · Belegeraar → `assets/skills/sheets/genie_2.png`

```text
Wide 16:9 image: a sprite sheet of exactly 8 separate pixel-art game skill icons, arranged in 2 rows of 4, for an ancient Greek/Roman strategy game (class "Genie").

STYLE REFERENCE: the attached image is the exact style to copy — same square tiles with slightly rounded corners and thin dark border, same tile size and spacing, same pixel size, same shading and same one-colour-per-tile look. Only the subjects and colours listed below are different.

CONTENT (most important rule): draw EXACTLY the 8 subjects listed below, each one literally as described, in this order (left to right, top to bottom). Do not replace a subject with a more generic or different object, do not add weapons, helmets, shields, animals, people or objects that are not in the description, and draw every subject only once.

1. (row 1, column 1) a covered battering ram with a bronze ram's head on a wheeled frame — dominant colour fiery siege orange.
2. (row 1, column 2) an hourglass standing next to a small wooden siege engine — dominant colour fiery siege orange.
3. (row 1, column 3) a tall wooden siege tower on wheels with a drawbridge at the top — dominant colour fiery siege orange.
4. (row 1, column 4) a large round stone ball resting in the cup of a catapult arm — dominant colour fiery siege orange.
5. (row 2, column 1) a large crossbow-like ballista loaded with a heavy bolt — dominant colour fiery siege orange.
6. (row 2, column 2) three burning arrows striking a wooden wall — dominant colour fiery siege orange.
7. (row 2, column 3) a crowned helmet above a row of three small siege engines — dominant colour fiery siege orange.
8. (row 2, column 4) a stone wall with a large hole smashed through its centre — dominant colour fiery siege orange.

LAYOUT: an invisible grid of 4 columns and 2 rows with equal cells; one icon tile centred in each cell, with clear magenta gaps between the tiles so they never touch each other or the image edge. No grid lines.

BACKGROUND: one flat, uniform pure magenta (#FF00FF) everywhere, no texture, gradient, shadow or noise (it will be removed by chroma key). Never use magenta or pink inside an icon; violet must be clearly bluish.

STYLE (keep exactly the same for every icon): each icon is a square tile with slightly rounded corners and a thin dark border, the whole tile filled with a medium shade of its listed colour (the inside of a tile is never magenta, pink or empty); on it one bold symbol, filling about 75% of the tile, drawn in lighter and darker shades of that same colour with a few small pale highlights (gold only where the list says so). Pixel art drawn as if at 64×64 pixels and enlarged with hard square pixel edges (no anti-aliasing), 16-bit RPG skill-icon style, front view, readable at 32×32; same line weight and top-left lighting for all icons.

AVOID: letters, numbers, words, watermarks; photorealism, soft gradients, blur, glow larger than 2 pixels; drop shadows on the background; round or hexagonal tiles; tiles in a different colour than listed; human figures or faces; crossbows, firearms, sci-fi; any object not named in the list; magenta or pink inside the icons; more or fewer than 8 icons.
```

<details><summary>Indeling</summary>

| Nr | Knooppunt | Bestand |
|---|---|---|
| 1 | Stormram | `genie_stormram.png` |
| 2 | Lange Belegering | `genie_lange_belegering.png` |
| 3 | Belegeringstoren | `genie_belegeringstoren.png` |
| 4 | Zware Stenen | `genie_zware_stenen.png` |
| 5 | Ballista | `genie_ballista.png` |
| 6 | Brandpijlen | `genie_brandpijlen.png` |
| 7 | Poliorketes | `genie_poliorketes.png` |
| 8 | Muurbreker | `genie_muurbreker.png` |

</details>

### Vel 3 — pad B · Vestingbouwer → `assets/skills/sheets/genie_3.png`

```text
Wide 16:9 image: a sprite sheet of exactly 8 separate pixel-art game skill icons, arranged in 2 rows of 4, for an ancient Greek/Roman strategy game (class "Genie").

STYLE REFERENCE: the attached image is the exact style to copy — same square tiles with slightly rounded corners and thin dark border, same tile size and spacing, same pixel size, same shading and same one-colour-per-tile look. Only the subjects and colours listed below are different.

CONTENT (most important rule): draw EXACTLY the 8 subjects listed below, each one literally as described, in this order (left to right, top to bottom). Do not replace a subject with a more generic or different object, do not add weapons, helmets, shields, animals, people or objects that are not in the description, and draw every subject only once.

1. (row 1, column 1) a solid wall of cut stone blocks with a walkway on top — dominant colour sage stone grey-green.
2. (row 1, column 2) a hammer and a roll of bandage lying on a wooden plank — dominant colour sage stone grey-green.
3. (row 1, column 3) a wooden watchtower with a small roof and a lookout platform — dominant colour sage stone grey-green.
4. (row 1, column 4) a builder's hammer striking a wooden beam with motion lines — dominant colour sage stone grey-green.
5. (row 2, column 1) a small square stone fort with four corner towers seen from above — dominant colour sage stone grey-green.
6. (row 2, column 2) two parallel water-filled ditches in front of an earth wall — dominant colour sage stone grey-green.
7. (row 2, column 3) a rectangular Roman army camp with a wooden palisade and four gates, seen from above — dominant colour sage stone grey-green.
8. (row 2, column 4) a long stone wall winding over green hills — dominant colour sage stone grey-green.

LAYOUT: an invisible grid of 4 columns and 2 rows with equal cells; one icon tile centred in each cell, with clear magenta gaps between the tiles so they never touch each other or the image edge. No grid lines.

BACKGROUND: one flat, uniform pure magenta (#FF00FF) everywhere, no texture, gradient, shadow or noise (it will be removed by chroma key). Never use magenta or pink inside an icon; violet must be clearly bluish.

STYLE (keep exactly the same for every icon): each icon is a square tile with slightly rounded corners and a thin dark border, the whole tile filled with a medium shade of its listed colour (the inside of a tile is never magenta, pink or empty); on it one bold symbol, filling about 75% of the tile, drawn in lighter and darker shades of that same colour with a few small pale highlights (gold only where the list says so). Pixel art drawn as if at 64×64 pixels and enlarged with hard square pixel edges (no anti-aliasing), 16-bit RPG skill-icon style, front view, readable at 32×32; same line weight and top-left lighting for all icons.

AVOID: letters, numbers, words, watermarks; photorealism, soft gradients, blur, glow larger than 2 pixels; drop shadows on the background; round or hexagonal tiles; tiles in a different colour than listed; human figures or faces; crossbows, firearms, sci-fi; any object not named in the list; magenta or pink inside the icons; more or fewer than 8 icons.
```

<details><summary>Indeling</summary>

| Nr | Knooppunt | Bestand |
|---|---|---|
| 1 | Stenen Muur | `genie_stenen_muur.png` |
| 2 | Veldherstel | `genie_veldherstel.png` |
| 3 | Wachttoren | `genie_wachttoren.png` |
| 4 | Snelbouw | `genie_snelbouw.png` |
| 5 | Vesting | `genie_vesting.png` |
| 6 | Dubbele Gracht | `genie_dubbele_gracht.png` |
| 7 | Castra | `genie_castra.png` |
| 8 | Muur van Hadrianus | `genie_muur_van_hadrianus.png` |

</details>

### Vel 4 — basis, meester, prestige → `assets/skills/sheets/genie_4.png`

```text
Square 1:1 image: a sprite sheet of exactly 4 separate pixel-art game skill icons, arranged in 2 rows of 2, for an ancient Greek/Roman strategy game (class "Genie").

STYLE REFERENCE: the attached image is the exact style to copy — same square tiles with slightly rounded corners and thin dark border, same tile size and spacing, same pixel size, same shading and same one-colour-per-tile look. Only the subjects and colours listed below are different.

CONTENT (most important rule): draw EXACTLY the 4 subjects listed below, each one literally as described, in this order (left to right, top to bottom). Do not replace a subject with a more generic or different object, do not add weapons, helmets, shields, animals, people or objects that are not in the description, and draw every subject only once.

1. (row 1, column 1) a bronze gear wheel with a wooden builder's hammer lying diagonally across it (no compass, no square, no triangle) — dominant colour burnt copper.
2. (row 1, column 2) a golden laurel wreath around a bronze gear wheel — dominant colour warm gold.
3. (row 2, column 1) large curved bronze mirrors focusing a beam of sunlight onto a burning ship — dominant colour fiery siege orange with extra gold.
4. (row 2, column 2) high stone city walls above the sea with strange wooden cranes on top — dominant colour sage stone grey-green with extra gold.

LAYOUT: an invisible grid of 2 columns and 2 rows with equal cells; one icon tile centred in each cell, with clear magenta gaps between the tiles so they never touch each other or the image edge. No grid lines.

BACKGROUND: one flat, uniform pure magenta (#FF00FF) everywhere, no texture, gradient, shadow or noise (it will be removed by chroma key). Never use magenta or pink inside an icon; violet must be clearly bluish.

STYLE (keep exactly the same for every icon): each icon is a square tile with slightly rounded corners and a thin dark border, the whole tile filled with a medium shade of its listed colour (the inside of a tile is never magenta, pink or empty); on it one bold symbol, filling about 75% of the tile, drawn in lighter and darker shades of that same colour with a few small pale highlights (gold only where the list says so). Pixel art drawn as if at 64×64 pixels and enlarged with hard square pixel edges (no anti-aliasing), 16-bit RPG skill-icon style, front view, readable at 32×32; same line weight and top-left lighting for all icons.

AVOID: letters, numbers, words, watermarks; photorealism, soft gradients, blur, glow larger than 2 pixels; drop shadows on the background; round or hexagonal tiles; tiles in a different colour than listed; human figures or faces; crossbows, firearms, sci-fi; any object not named in the list; magenta or pink inside the icons; more or fewer than 4 icons.
```

<details><summary>Indeling</summary>

| Nr | Knooppunt | Bestand |
|---|---|---|
| 1 | Genie | `genie_root.png` |
| 2 | Meester | `genie_meester.png` |
| 3 | Spiegels van Archimedes | `genie_archimedes.png` |
| 4 | Muren van Syracuse | `genie_muren_van_syracuse.png` |

</details>

---

## Verkenner

### Vel 1 — identiteit ★1–4 → `assets/skills/sheets/verkenner_1.png`

```text
Wide 16:9 image: a sprite sheet of exactly 8 separate pixel-art game skill icons, arranged in 2 rows of 4, for an ancient Greek/Roman strategy game (class "Verkenner").

STYLE REFERENCE: the attached image is the exact style to copy — same square tiles with slightly rounded corners and thin dark border, same tile size and spacing, same pixel size, same shading and same one-colour-per-tile look. Only the subjects and colours listed below are different.

CONTENT (most important rule): draw EXACTLY the 8 subjects listed below, each one literally as described, in this order (left to right, top to bottom). Do not replace a subject with a more generic or different object, do not add weapons, helmets, shields, animals, people or objects that are not in the description, and draw every subject only once.

1. (row 1, column 1) a small shovel digging a tunnel underneath a stone wall — dominant colour smouldering ember red.
2. (row 1, column 2) a spear point sticking out from dense dark green bushes — dominant colour deep forest green.
3. (row 1, column 3) a burning torch held against a wooden palisade — dominant colour smouldering ember red.
4. (row 1, column 4) a light leather satchel and a short dagger lying on the ground — dominant colour deep forest green.
5. (row 2, column 1) a pickaxe stuck in the cracked foundation stones of a wall — dominant colour smouldering ember red.
6. (row 2, column 2) a pair of watchful eyes glowing between dark leaves — dominant colour deep forest green.
7. (row 2, column 3) a knife cutting through the leather strap of a shield — dominant colour smouldering ember red.
8. (row 2, column 4) a narrow hidden path winding between tall dark forest trees — dominant colour deep forest green.

LAYOUT: an invisible grid of 4 columns and 2 rows with equal cells; one icon tile centred in each cell, with clear magenta gaps between the tiles so they never touch each other or the image edge. No grid lines.

BACKGROUND: one flat, uniform pure magenta (#FF00FF) everywhere, no texture, gradient, shadow or noise (it will be removed by chroma key). Never use magenta or pink inside an icon; violet must be clearly bluish.

STYLE (keep exactly the same for every icon): each icon is a square tile with slightly rounded corners and a thin dark border, the whole tile filled with a medium shade of its listed colour (the inside of a tile is never magenta, pink or empty); on it one bold symbol, filling about 75% of the tile, drawn in lighter and darker shades of that same colour with a few small pale highlights (gold only where the list says so). Pixel art drawn as if at 64×64 pixels and enlarged with hard square pixel edges (no anti-aliasing), 16-bit RPG skill-icon style, front view, readable at 32×32; same line weight and top-left lighting for all icons.

AVOID: letters, numbers, words, watermarks; photorealism, soft gradients, blur, glow larger than 2 pixels; drop shadows on the background; round or hexagonal tiles; tiles in a different colour than listed; human figures or faces; crossbows, firearms, sci-fi; any object not named in the list; magenta or pink inside the icons; more or fewer than 8 icons.
```

<details><summary>Indeling</summary>

| Nr | Knooppunt | Bestand |
|---|---|---|
| 1 | Ondermijnen | `verkenner_ondermijnen.png` |
| 2 | Hinderlaagtactiek | `verkenner_hinderlaagtactiek.png` |
| 3 | Brandstichter | `verkenner_brandstichter.png` |
| 4 | Lichtbepakt | `verkenner_lichtbepakt.png` |
| 5 | Ondergraven | `verkenner_ondergraven.png` |
| 6 | Op de Loer | `verkenner_op_de_loer.png` |
| 7 | Doorgesneden Riemen | `verkenner_doorgesneden_riemen.png` |
| 8 | Woudkennis | `verkenner_woudkennis.png` |

</details>

### Vel 2 — pad A · Saboteur → `assets/skills/sheets/verkenner_2.png`

```text
Wide 16:9 image: a sprite sheet of exactly 8 separate pixel-art game skill icons, arranged in 2 rows of 4, for an ancient Greek/Roman strategy game (class "Verkenner").

STYLE REFERENCE: the attached image is the exact style to copy — same square tiles with slightly rounded corners and thin dark border, same tile size and spacing, same pixel size, same shading and same one-colour-per-tile look. Only the subjects and colours listed below are different.

CONTENT (most important rule): draw EXACTLY the 8 subjects listed below, each one literally as described, in this order (left to right, top to bottom). Do not replace a subject with a more generic or different object, do not add weapons, helmets, shields, animals, people or objects that are not in the description, and draw every subject only once.

1. (row 1, column 1) a burning wooden siege engine wheel with small flames — dominant colour smouldering ember red.
2. (row 1, column 2) a long burning fuse cord snaking toward a small clay pot — dominant colour smouldering ember red.
3. (row 1, column 3) a wooden palisade with a large burnt hole through it — dominant colour smouldering ember red.
4. (row 1, column 4) hands lifting the cover off a pit trap with sharpened stakes — dominant colour smouldering ember red.
5. (row 2, column 1) a hawk's eye looking through a gap in a wooden wall — dominant colour smouldering ember red.
6. (row 2, column 2) a hooded figure slipping through an open gate at night — dominant colour smouldering ember red.
7. (row 2, column 3) scorched black earth with smoking remains of wooden stakes — dominant colour smouldering ember red.
8. (row 2, column 4) a two-faced mask, one side smiling and one side frowning — dominant colour smouldering ember red.

LAYOUT: an invisible grid of 4 columns and 2 rows with equal cells; one icon tile centred in each cell, with clear magenta gaps between the tiles so they never touch each other or the image edge. No grid lines.

BACKGROUND: one flat, uniform pure magenta (#FF00FF) everywhere, no texture, gradient, shadow or noise (it will be removed by chroma key). Never use magenta or pink inside an icon; violet must be clearly bluish.

STYLE (keep exactly the same for every icon): each icon is a square tile with slightly rounded corners and a thin dark border, the whole tile filled with a medium shade of its listed colour (the inside of a tile is never magenta, pink or empty); on it one bold symbol, filling about 75% of the tile, drawn in lighter and darker shades of that same colour with a few small pale highlights (gold only where the list says so). Pixel art drawn as if at 64×64 pixels and enlarged with hard square pixel edges (no anti-aliasing), 16-bit RPG skill-icon style, front view, readable at 32×32; same line weight and top-left lighting for all icons.

AVOID: letters, numbers, words, watermarks; photorealism, soft gradients, blur, glow larger than 2 pixels; drop shadows on the background; round or hexagonal tiles; tiles in a different colour than listed; human figures or faces; crossbows, firearms, sci-fi; any object not named in the list; magenta or pink inside the icons; more or fewer than 8 icons.
```

<details><summary>Indeling</summary>

| Nr | Knooppunt | Bestand |
|---|---|---|
| 1 | Vuur in de Voorraad | `verkenner_vuur_in_de_voorraad.png` |
| 2 | Lange Lont | `verkenner_lange_lont.png` |
| 3 | Gaten in de Muur | `verkenner_gaten_in_de_muur.png` |
| 4 | Valstrikken Ontmantelen | `verkenner_valstrikken_ontmantelen.png` |
| 5 | Scherpe Ogen | `verkenner_scherpe_ogen.png` |
| 6 | Infiltrant | `verkenner_infiltrant.png` |
| 7 | Verschroeide Aarde | `verkenner_verschroeide_aarde.png` |
| 8 | Dubbelspel | `verkenner_dubbelspel.png` |

</details>

### Vel 3 — pad B · Guerrillastrijder → `assets/skills/sheets/verkenner_3.png`

```text
Wide 16:9 image: a sprite sheet of exactly 8 separate pixel-art game skill icons, arranged in 2 rows of 4, for an ancient Greek/Roman strategy game (class "Verkenner").

STYLE REFERENCE: the attached image is the exact style to copy — same square tiles with slightly rounded corners and thin dark border, same tile size and spacing, same pixel size, same shading and same one-colour-per-tile look. Only the subjects and colours listed below are different.

CONTENT (most important rule): draw EXACTLY the 8 subjects listed below, each one literally as described, in this order (left to right, top to bottom). Do not replace a subject with a more generic or different object, do not add weapons, helmets, shields, animals, people or objects that are not in the description, and draw every subject only once.

1. (row 1, column 1) several spear points bursting out of thick bushes at once — dominant colour deep forest green.
2. (row 1, column 2) a small rolled message with a wax seal tied to an arrow — dominant colour deep forest green.
3. (row 1, column 3) a cloaked figure vanishing into fog between trees — dominant colour deep forest green.
4. (row 1, column 4) a coiled snake hiding under a rock, ready to strike — dominant colour deep forest green.
5. (row 2, column 1) a Germanic chieftain's iron helmet with two curved horns resting on a round wooden shield (no Roman objects, no people) — dominant colour deep forest green.
6. (row 2, column 2) three small daggers stuck point-first side by side in a vertical wooden post — dominant colour deep forest green.
7. (row 2, column 3) a ghostly mask made of green leaves with two hollow glowing eyes, alone (no trees, no fog) — dominant colour deep forest green.
8. (row 2, column 4) a golden Roman eagle standard fallen sideways in brown mud, its wooden pole broken in two — dominant colour deep forest green.

LAYOUT: an invisible grid of 4 columns and 2 rows with equal cells; one icon tile centred in each cell, with clear magenta gaps between the tiles so they never touch each other or the image edge. No grid lines.

BACKGROUND: one flat, uniform pure magenta (#FF00FF) everywhere, no texture, gradient, shadow or noise (it will be removed by chroma key). Never use magenta or pink inside an icon; violet must be clearly bluish.

STYLE (keep exactly the same for every icon): each icon is a square tile with slightly rounded corners and a thin dark border, the whole tile filled with a medium shade of its listed colour (the inside of a tile is never magenta, pink or empty); on it one bold symbol, filling about 75% of the tile, drawn in lighter and darker shades of that same colour with a few small pale highlights (gold only where the list says so). Pixel art drawn as if at 64×64 pixels and enlarged with hard square pixel edges (no anti-aliasing), 16-bit RPG skill-icon style, front view, readable at 32×32; same line weight and top-left lighting for all icons.

AVOID: letters, numbers, words, watermarks; photorealism, soft gradients, blur, glow larger than 2 pixels; drop shadows on the background; round or hexagonal tiles; tiles in a different colour than listed; human figures or faces; crossbows, firearms, sci-fi; any object not named in the list; magenta or pink inside the icons; more or fewer than 8 icons.
```

<details><summary>Indeling</summary>

| Nr | Knooppunt | Bestand |
|---|---|---|
| 1 | Uit het Struikgewas | `verkenner_uit_het_struikgewas.png` |
| 2 | Verkenningsrapport | `verkenner_verkenningsrapport.png` |
| 3 | Toeslaan en Verdwijnen | `verkenner_toeslaan_en_verdwijnen.png` |
| 4 | Opgespaarde Woede | `verkenner_opgespaarde_woede.png` |
| 5 | Arminius | `verkenner_arminius.png` |
| 6 | Kleine Steken | `verkenner_kleine_steken.png` |
| 7 | Woudgeest | `verkenner_woudgeest.png` |
| 8 | Varus' Ondergang | `verkenner_varus_ondergang.png` |

</details>

### Vel 4 — basis, meester, prestige → `assets/skills/sheets/verkenner_4.png`

```text
Square 1:1 image: a sprite sheet of exactly 4 separate pixel-art game skill icons, arranged in 2 rows of 2, for an ancient Greek/Roman strategy game (class "Verkenner").

STYLE REFERENCE: the attached image is the exact style to copy — same square tiles with slightly rounded corners and thin dark border, same tile size and spacing, same pixel size, same shading and same one-colour-per-tile look. Only the subjects and colours listed below are different.

CONTENT (most important rule): draw EXACTLY the 4 subjects listed below, each one literally as described, in this order (left to right, top to bottom). Do not replace a subject with a more generic or different object, do not add weapons, helmets, shields, animals, people or objects that are not in the description, and draw every subject only once.

1. (row 1, column 1) a hooded scout's eye peering through tall grass, seen from the front — dominant colour deep forest teal.
2. (row 1, column 2) a golden laurel wreath around a scout's hooded cloak clasp — dominant colour warm gold.
3. (row 2, column 1) a collapsing burning wooden palisade with a lone hooded figure walking away — dominant colour smouldering ember red with extra gold.
4. (row 2, column 2) a dark dense forest with many spear points hidden among the trees, a Roman eagle in the foreground — dominant colour deep forest green with extra gold.

LAYOUT: an invisible grid of 2 columns and 2 rows with equal cells; one icon tile centred in each cell, with clear magenta gaps between the tiles so they never touch each other or the image edge. No grid lines.

BACKGROUND: one flat, uniform pure magenta (#FF00FF) everywhere, no texture, gradient, shadow or noise (it will be removed by chroma key). Never use magenta or pink inside an icon; violet must be clearly bluish.

STYLE (keep exactly the same for every icon): each icon is a square tile with slightly rounded corners and a thin dark border, the whole tile filled with a medium shade of its listed colour (the inside of a tile is never magenta, pink or empty); on it one bold symbol, filling about 75% of the tile, drawn in lighter and darker shades of that same colour with a few small pale highlights (gold only where the list says so). Pixel art drawn as if at 64×64 pixels and enlarged with hard square pixel edges (no anti-aliasing), 16-bit RPG skill-icon style, front view, readable at 32×32; same line weight and top-left lighting for all icons.

AVOID: letters, numbers, words, watermarks; photorealism, soft gradients, blur, glow larger than 2 pixels; drop shadows on the background; round or hexagonal tiles; tiles in a different colour than listed; human figures or faces; crossbows, firearms, sci-fi; any object not named in the list; magenta or pink inside the icons; more or fewer than 4 icons.
```

<details><summary>Indeling</summary>

| Nr | Knooppunt | Bestand |
|---|---|---|
| 1 | Verkenner | `verkenner_root.png` |
| 2 | Meester | `verkenner_meester.png` |
| 3 | Grote Sabotage | `verkenner_grote_sabotage.png` |
| 4 | Teutoburgerwoud | `verkenner_teutoburgerwoud.png` |

</details>

---

## Verbetervel → `assets/skills/sheets/fix_1.png`

Iconen die bij de eerste ronde misgingen of beter konden; de nieuwe onderwerpen staan al in `skilltree-data.js`.

```text
Landscape 4:3 image: a sprite sheet of exactly 12 separate pixel-art game skill icons, arranged in 3 rows of 4, for an ancient Greek/Roman strategy game (mixed icons from several classes).

STYLE REFERENCE: the attached image is the exact style to copy — same square tiles with slightly rounded corners and thin dark border, same tile size and spacing, same pixel size, same shading and same one-colour-per-tile look. Only the subjects and colours listed below are different.

CONTENT (most important rule): draw EXACTLY the 12 subjects listed below, each one literally as described, in this order (left to right, top to bottom). Do not replace a subject with a more generic or different object, do not add weapons, helmets, shields, animals, people or objects that are not in the description, and draw every subject only once.

1. (row 1, column 1) a bronze gear wheel with a wooden builder's hammer lying diagonally across it (no compass, no square, no triangle) — dominant colour burnt copper.
2. (row 1, column 2) a single bronze spearhead pointing upward with a laurel branch, above stylised blue sea waves (no people) — dominant colour blood red and bronze with extra gold.
3. (row 1, column 3) the head and neck of a black war horse in profile with a bronze face plate, a cavalry spear pointing forward past it (no rider, no other horses) — dominant colour rusty copper orange with extra gold.
4. (row 1, column 4) a swirling whirlwind spiral with three javelins flying outward from it (no people, no horses) — dominant colour wind teal with extra gold.
5. (row 2, column 1) a Germanic chieftain's iron helmet with two curved horns resting on a round wooden shield (no Roman objects, no people) — dominant colour deep forest green.
6. (row 2, column 2) three small daggers stuck point-first side by side in a vertical wooden post — dominant colour deep forest green.
7. (row 2, column 3) a ghostly mask made of green leaves with two hollow glowing eyes, alone (no trees, no fog) — dominant colour deep forest green.
8. (row 2, column 4) a golden Roman eagle standard fallen sideways in brown mud, its wooden pole broken in two — dominant colour deep forest green.
9. (row 3, column 1) a Greek sphinx seated on a rock, seen from the side: lion body, eagle wings and a woman's head, with a question-mark-shaped curl of smoke above it (Greek, NOT Egyptian: no pharaoh headdress) — dominant colour mystic violet.
10. (row 3, column 2) a horse galloping to the right while its rider twists backwards in the saddle and shoots an arrow to the LEFT, behind him — dominant colour wind teal.
11. (row 3, column 3) four forearms seen from above, each hand gripping the wrist of the next, together forming a closed square — dominant colour supply teal.
12. (row 3, column 4) a small round Greek stone theatre with stepped semicircular seats, seen from the front, simple and bold (no sky, no landscape) — dominant colour soft healing green.

LAYOUT: an invisible grid of 4 columns and 3 rows with equal cells; one icon tile centred in each cell, with clear magenta gaps between the tiles so they never touch each other or the image edge. No grid lines.

BACKGROUND: one flat, uniform pure magenta (#FF00FF) everywhere, no texture, gradient, shadow or noise (it will be removed by chroma key). Never use magenta or pink inside an icon; violet must be clearly bluish.

STYLE (keep exactly the same for every icon): each icon is a square tile with slightly rounded corners and a thin dark border, the whole tile filled with a medium shade of its listed colour (the inside of a tile is never magenta, pink or empty); on it one bold symbol, filling about 75% of the tile, drawn in lighter and darker shades of that same colour with a few small pale highlights (gold only where the list says so). Pixel art drawn as if at 64×64 pixels and enlarged with hard square pixel edges (no anti-aliasing), 16-bit RPG skill-icon style, front view, readable at 32×32; same line weight and top-left lighting for all icons.

AVOID: letters, numbers, words, watermarks; photorealism, soft gradients, blur, glow larger than 2 pixels; drop shadows on the background; round or hexagonal tiles; tiles in a different colour than listed; human figures or faces, except the rider in icon 10 and the sphinx head in icon 9; crossbows, firearms, sci-fi; any object not named in the list; magenta or pink inside the icons; more or fewer than 12 icons.
```

<details><summary>Indeling</summary>

| Nr | Klasse | Knooppunt | Bestand |
|---|---|---|---|
| 1 | Genie | Genie | `genie_root.png` |
| 2 | Hopliet | Marathon | `hopliet_marathon.png` |
| 3 | Cavalerie | Charge van Alexander | `cavalerie_charge_van_alexander.png` |
| 4 | Cavalerie | Numidische Storm | `cavalerie_numidische_storm.png` |
| 5 | Verkenner | Arminius | `verkenner_arminius.png` |
| 6 | Verkenner | Kleine Steken | `verkenner_kleine_steken.png` |
| 7 | Verkenner | Woudgeest | `verkenner_woudgeest.png` |
| 8 | Verkenner | Varus' Ondergang | `verkenner_varus_ondergang.png` |
| 9 | Priester | Raadselspreuk | `priester_raadselspreuk.png` |
| 10 | Cavalerie | Parthisch Schot | `cavalerie_parthisch_schot.png` |
| 11 | Bevelvoerder | Niemand Valt | `centurio_niemand_valt.png` |
| 12 | Priester | Epidauros | `priester_epidauros.png` |

</details>
