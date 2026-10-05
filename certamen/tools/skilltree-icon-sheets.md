# Skill-tree-iconen — Gemini-prompts per klasse

Gegenereerd door `tools/skilltree-icon-sheets.js` uit `skilltree-data.js`
(`iconSubject` en padkleuren). Eén vel per klasse, 8 × 4 raster, magenta
achtergrond. Sla het resultaat op als `assets/skills/sheets/<klasse>.png`;
daarna worden de iconen uitgesneden, vrijgemaakt en als
`assets/skills/<klasse>_<knooppunt>.png` weggeschreven.

Rij 1 = identiteitskeuzes ★1–4 (A/B om en om), rij 2 = pad A ★6–9 (a/b),
rij 3 = pad B ★6–9 (a/b), rij 4 = basis, meester, de twee prestige-varianten.

---

## Boogschutter → `assets/skills/sheets/boogschutter.png`

```text
Wide 16:9 image: a sprite sheet of 28 separate pixel-art game skill icons for an ancient Greek/Roman strategy game, class "Boogschutter" (deep royal blue).

LAYOUT (strict): an invisible grid of 8 columns and 4 rows, all cells equal size. Exactly one icon centred in each cell, filling about 70% of the cell, with generous empty space between icons so they never touch or overlap. Rows 1-3 have 8 icons each; row 4 has icons only in cells 1-4 — cells 5-8 of row 4 stay completely empty. No grid lines, no frames, no tiles, no borders around the icons.

BACKGROUND: the entire image background is one flat, uniform pure magenta (#FF00FF), with no texture, gradient, shadow, vignette or noise — it will be removed by chroma key. Never use magenta, pink or hot pink inside any icon; violet and purple must be clearly bluish.

STYLE: every icon drawn as if at 64×64 pixel resolution and enlarged with hard square pixel edges (no anti-aliasing, no smoothing), 16-bit RPG skill-icon style, seen straight from the front, readable at 32×32. Each icon is one single bold symbol with a 1-pixel dark brown outline, max. 8 colours, dominated by its own colour given below, with gold (#d4af37) highlights and dark brown shadows. All 28 icons share the same style, line weight and lighting (light from top-left), but each subject is clearly different from the others.

ICONS (left to right, top to bottom):
Row 1, cell 1: a steady open hand holding a single straight arrow horizontally — dominant colour cool forest green.
Row 1, cell 2: an arrow stuck in the ground next to a small red hunting pennant — dominant colour burnt bronze-red.
Row 1, cell 3: a calm closed eye above a horizontal arrow, with a small frost crystal — dominant colour cool forest green.
Row 1, cell 4: two wolf heads side by side in profile, facing each other — dominant colour burnt bronze-red.
Row 1, cell 5: a hawk's eye inside a round archery target — dominant colour cool forest green.
Row 1, cell 6: three arrows falling diagonally in parallel from the top left — dominant colour burnt bronze-red.
Row 1, cell 7: an arrow piercing straight through a cracked round bronze shield — dominant colour cool forest green.
Row 1, cell 8: a curved hunting horn made of animal horn with a leather strap — dominant colour burnt bronze-red.
Row 2, cell 1: a single arrow passing cleanly through the exact centre of a target — dominant colour cool forest green.
Row 2, cell 2: a falcon head in profile with a sharp focused eye — dominant colour cool forest green.
Row 2, cell 3: an arrow striking a cracked spot on a bronze breastplate — dominant colour cool forest green.
Row 2, cell 4: one last arrow in an almost empty leather quiver — dominant colour cool forest green.
Row 2, cell 5: a star-shaped gold medal with a bow engraved on it — dominant colour cool forest green.
Row 2, cell 6: an archer's leather bracer with burning arrows flying past it — dominant colour cool forest green.
Row 2, cell 7: a black arrow with a bone-white arrowhead breaking through a shield — dominant colour cool forest green.
Row 2, cell 8: a radiant golden sun disc with an arrow through its centre — dominant colour cool forest green.
Row 3, cell 1: a large stag with wide antlers, seen from the front — dominant colour burnt bronze-red.
Row 3, cell 2: fresh deer hoof prints in mud leading upward — dominant colour burnt bronze-red.
Row 3, cell 3: a howling wolf head with a small gold crown above it — dominant colour burnt bronze-red.
Row 3, cell 4: a fleeing boar with a broken wooden shield behind it — dominant colour burnt bronze-red.
Row 3, cell 5: a crescent moon above a bow drawn in silhouette — dominant colour burnt bronze-red.
Row 3, cell 6: a large brass hunting horn blowing visible sound waves — dominant colour burnt bronze-red.
Row 3, cell 7: a silver crescent moon with a silver arrow resting across it — dominant colour burnt bronze-red.
Row 3, cell 8: three arrows converging on one point from three directions — dominant colour burnt bronze-red.
Row 4, cell 1: a drawn ancient recurve bow with a nocked arrow pointing upward — dominant colour deep royal blue.
Row 4, cell 2: a golden laurel wreath around a single upright arrow — dominant colour warm gold.
Row 4, cell 3: one huge golden arrow of light shot from a radiant sun — dominant colour cool forest green with extra gold.
Row 4, cell 4: a rain of silver arrows falling from a crescent moon — dominant colour burnt bronze-red with extra gold.

AVOID: any letters, numbers, words or labels; watermarks or signatures; photorealism; soft gradients, blur or glow halos larger than 2 pixels; drop shadows on the background; tiles, frames, borders or grid lines; modern firearms or sci-fi elements; detailed human faces; magenta or pink inside the icons; icons touching each other or the image edge; duplicated icons; extra icons in row 4 cells 5-8.
```

<details><summary>Rasterindeling</summary>

| Rij | Cel | Knooppunt | Bestand |
|---|---|---|---|
| 1 | 1 | Vaste Hand | `boogschutter_vaste_hand.png` |
| 1 | 2 | Spoor Zetten | `boogschutter_spoor_zetten.png` |
| 1 | 3 | Koelbloedig | `boogschutter_koelbloedig.png` |
| 1 | 4 | Roedel | `boogschutter_roedel.png` |
| 1 | 5 | Scherp Oog | `boogschutter_scherp_oog.png` |
| 1 | 6 | Drijfjacht | `boogschutter_drijfjacht.png` |
| 1 | 7 | Pantserbreker | `boogschutter_pantserbreker.png` |
| 1 | 8 | Lokroep | `boogschutter_lokroep.png` |
| 2 | 1 | Zuivere Treffer | `boogschutter_zuivere_treffer.png` |
| 2 | 2 | Valkenblik | `boogschutter_valkenblik.png` |
| 2 | 3 | Genadeloos | `boogschutter_genadeloos.png` |
| 2 | 4 | Laatste Pijl | `boogschutter_laatste_pijl.png` |
| 2 | 5 | Meesterschutter | `boogschutter_meesterschutter.png` |
| 2 | 6 | Kalm onder Vuur | `boogschutter_kalm_onder_vuur.png` |
| 2 | 7 | Doodsoordeel | `boogschutter_doodsoordeel.png` |
| 2 | 8 | Oog van Apollo | `boogschutter_oog_van_apollo.png` |
| 3 | 1 | Grote Prooi | `boogschutter_grote_prooi.png` |
| 3 | 2 | Vers Spoor | `boogschutter_vers_spoor.png` |
| 3 | 3 | Roedelleider | `boogschutter_roedelleider.png` |
| 3 | 4 | Opjagen | `boogschutter_opjagen.png` |
| 3 | 5 | Stille Jacht | `boogschutter_stille_jacht.png` |
| 3 | 6 | Jachthoorn | `boogschutter_jachthoorn.png` |
| 3 | 7 | Artemis' Gunst | `boogschutter_artemis_gunst.png` |
| 3 | 8 | Jachtpartij | `boogschutter_jachtpartij.png` |
| 4 | 1 | Boogschutter | `boogschutter_root.png` |
| 4 | 2 | Meester | `boogschutter_meester.png` |
| 4 | 3 | Pijl van Apollo | `boogschutter_pijl_van_apollo.png` |
| 4 | 4 | Pijlen van Artemis | `boogschutter_pijlen_van_artemis.png` |

</details>

---

## Hopliet → `assets/skills/sheets/hopliet.png`

```text
Wide 16:9 image: a sprite sheet of 28 separate pixel-art game skill icons for an ancient Greek/Roman strategy game, class "Hopliet" (deep crimson red).

LAYOUT (strict): an invisible grid of 8 columns and 4 rows, all cells equal size. Exactly one icon centred in each cell, filling about 70% of the cell, with generous empty space between icons so they never touch or overlap. Rows 1-3 have 8 icons each; row 4 has icons only in cells 1-4 — cells 5-8 of row 4 stay completely empty. No grid lines, no frames, no tiles, no borders around the icons.

BACKGROUND: the entire image background is one flat, uniform pure magenta (#FF00FF), with no texture, gradient, shadow, vignette or noise — it will be removed by chroma key. Never use magenta, pink or hot pink inside any icon; violet and purple must be clearly bluish.

STYLE: every icon drawn as if at 64×64 pixel resolution and enlarged with hard square pixel edges (no anti-aliasing, no smoothing), 16-bit RPG skill-icon style, seen straight from the front, readable at 32×32. Each icon is one single bold symbol with a 1-pixel dark brown outline, max. 8 colours, dominated by its own colour given below, with gold (#d4af37) highlights and dark brown shadows. All 28 icons share the same style, line weight and lighting (light from top-left), but each subject is clearly different from the others.

ICONS (left to right, top to bottom):
Row 1, cell 1: a row of three overlapping round bronze shields seen from the front — dominant colour cool polished steel blue.
Row 1, cell 2: a spear thrusting out from behind a raised round shield — dominant colour blood red and bronze.
Row 1, cell 3: a closed wall of interlocking bronze shields with spear tips above it — dominant colour cool polished steel blue.
Row 1, cell 4: the bronze rim of a shield striking forward with short motion lines — dominant colour blood red and bronze.
Row 1, cell 5: three rows of small soldier silhouettes standing in perfect formation — dominant colour cool polished steel blue.
Row 1, cell 6: a dented bronze shield with a sword crossed behind it — dominant colour blood red and bronze.
Row 1, cell 7: raised hands of soldiers swearing an oath above a round shield — dominant colour cool polished steel blue.
Row 1, cell 8: a running hoplite's bronze greave and sandal in mid-stride — dominant colour blood red and bronze.
Row 2, cell 1: a solid wall of bronze shields seen straight from the front — dominant colour cool polished steel blue.
Row 2, cell 2: a large concave hoplon shield with the arm strap visible on the inside — dominant colour cool polished steel blue.
Row 2, cell 3: a bronze shield with a crack held together by iron rivets — dominant colour cool polished steel blue.
Row 2, cell 4: two long rows of shields locking together like a closing gate — dominant colour cool polished steel blue.
Row 2, cell 5: a long ancient Greek war trumpet (salpinx) sounding above a line of shields — dominant colour cool polished steel blue.
Row 2, cell 6: a single shield standing upright amid a ruined stone wall — dominant colour cool polished steel blue.
Row 2, cell 7: a line of shields with golden light shining along their rims — dominant colour cool polished steel blue.
Row 2, cell 8: a Spartan lambda symbol on a shield standing in a narrow mountain pass — dominant colour cool polished steel blue.
Row 3, cell 1: a sharpened bronze shield rim gleaming along its edge — dominant colour blood red and bronze.
Row 3, cell 2: one round shield smashing into another round shield, which cracks — dominant colour blood red and bronze.
Row 3, cell 3: a spear held upright behind a shield, both angled forward — dominant colour blood red and bronze.
Row 3, cell 4: a bronze shield with dark red stains on its surface — dominant colour blood red and bronze.
Row 3, cell 5: two curved arrows forming a circle around a shield and a spear — dominant colour blood red and bronze.
Row 3, cell 6: a spear point punching a hole through a bronze plate — dominant colour blood red and bronze.
Row 3, cell 7: a crested Greek bronze helmet above a laurel branch — dominant colour blood red and bronze.
Row 3, cell 8: a charging hoplite shield with two spear tips bursting out from behind it — dominant colour blood red and bronze.
Row 4, cell 1: a round bronze hoplite shield (aspis) with a Greek lambda painted on it — dominant colour deep crimson red.
Row 4, cell 2: a golden laurel wreath around a round bronze shield — dominant colour warm gold.
Row 4, cell 3: a narrow mountain pass blocked by a wall of shields painted with a lambda — dominant colour cool polished steel blue with extra gold.
Row 4, cell 4: a line of hoplites running forward with lowered spears on a plain beside the sea — dominant colour blood red and bronze with extra gold.

AVOID: any letters, numbers, words or labels; watermarks or signatures; photorealism; soft gradients, blur or glow halos larger than 2 pixels; drop shadows on the background; tiles, frames, borders or grid lines; modern firearms or sci-fi elements; detailed human faces; magenta or pink inside the icons; icons touching each other or the image edge; duplicated icons; extra icons in row 4 cells 5-8.
```

<details><summary>Rasterindeling</summary>

| Rij | Cel | Knooppunt | Bestand |
|---|---|---|---|
| 1 | 1 | Schildenrij | `hopliet_schildenrij.png` |
| 1 | 2 | Tegenstoot | `hopliet_tegenstoot.png` |
| 1 | 3 | Gesloten Linie | `hopliet_gesloten_linie.png` |
| 1 | 4 | Bronzen Rand | `hopliet_bronzen_rand.png` |
| 1 | 5 | Gedrilde Rijen | `hopliet_gedrilde_rijen.png` |
| 1 | 6 | Wraak van de Linie | `hopliet_wraak_van_de_linie.png` |
| 1 | 7 | Eed van de Falanx | `hopliet_eed_van_de_falanx.png` |
| 1 | 8 | Dromos | `hopliet_dromos.png` |
| 2 | 1 | Bronzen Muur | `hopliet_bronzen_muur.png` |
| 2 | 2 | Hoplon | `hopliet_hoplon.png` |
| 2 | 3 | Taai als Brons | `hopliet_taai_als_brons.png` |
| 2 | 4 | Linie Vast | `hopliet_linie_vast.png` |
| 2 | 5 | Snelle Formatie | `hopliet_snelle_formatie.png` |
| 2 | 6 | Laatste Bolwerk | `hopliet_laatste_bolwerk.png` |
| 2 | 7 | Gouden Linie | `hopliet_gouden_linie.png` |
| 2 | 8 | Geest van de 300 | `hopliet_geest_van_de_300.png` |
| 3 | 1 | Scherpe Rand | `hopliet_scherpe_rand.png` |
| 3 | 2 | Schild als Wapen | `hopliet_schild_als_wapen.png` |
| 3 | 3 | Pantser en Speer | `hopliet_pantser_en_speer.png` |
| 3 | 4 | Bloed op het Brons | `hopliet_bloed_op_het_brons.png` |
| 3 | 5 | Opmars | `hopliet_opmars.png` |
| 3 | 6 | Breekijzer | `hopliet_breekijzer.png` |
| 3 | 7 | Held van Marathon | `hopliet_held_van_marathon.png` |
| 3 | 8 | Onstuitbaar | `hopliet_onstuitbaar.png` |
| 4 | 1 | Hopliet | `hopliet_root.png` |
| 4 | 2 | Meester | `hopliet_meester.png` |
| 4 | 3 | Thermopylae | `hopliet_thermopylae.png` |
| 4 | 4 | Marathon | `hopliet_marathon.png` |

</details>

---

## Voorvechter → `assets/skills/sheets/spartaan.png`

```text
Wide 16:9 image: a sprite sheet of 28 separate pixel-art game skill icons for an ancient Greek/Roman strategy game, class "Voorvechter" (dark blood red).

LAYOUT (strict): an invisible grid of 8 columns and 4 rows, all cells equal size. Exactly one icon centred in each cell, filling about 70% of the cell, with generous empty space between icons so they never touch or overlap. Rows 1-3 have 8 icons each; row 4 has icons only in cells 1-4 — cells 5-8 of row 4 stay completely empty. No grid lines, no frames, no tiles, no borders around the icons.

BACKGROUND: the entire image background is one flat, uniform pure magenta (#FF00FF), with no texture, gradient, shadow, vignette or noise — it will be removed by chroma key. Never use magenta, pink or hot pink inside any icon; violet and purple must be clearly bluish.

STYLE: every icon drawn as if at 64×64 pixel resolution and enlarged with hard square pixel edges (no anti-aliasing, no smoothing), 16-bit RPG skill-icon style, seen straight from the front, readable at 32×32. Each icon is one single bold symbol with a 1-pixel dark brown outline, max. 8 colours, dominated by its own colour given below, with gold (#d4af37) highlights and dark brown shadows. All 28 icons share the same style, line weight and lighting (light from top-left), but each subject is clearly different from the others.

ICONS (left to right, top to bottom):
Row 1, cell 1: a flame rising from the top of a bronze helmet — dominant colour fiery orange.
Row 1, cell 2: a sword blade with a red heart-shaped drop at its tip — dominant colour dark wine red.
Row 1, cell 3: two crossed short swords surrounded by jagged red rage lines — dominant colour fiery orange.
Row 1, cell 4: a hand gripping a sword blade with a drop of blood falling into a bowl — dominant colour dark wine red.
Row 1, cell 5: a broken iron chain falling apart around a clenched fist — dominant colour fiery orange.
Row 1, cell 6: a spear point with a small red drop glowing on it — dominant colour dark wine red.
Row 1, cell 7: a furious lion's head with a bronze helmet crest behind it — dominant colour fiery orange.
Row 1, cell 8: a round shield lying flat with a spear resting across it — dominant colour dark wine red.
Row 2, cell 1: a tall flame shaped like a warrior's crest — dominant colour fiery orange.
Row 2, cell 2: two upward arrows made of fire — dominant colour fiery orange.
Row 2, cell 3: a spear smashing straight through a wooden shield in a burst of splinters — dominant colour fiery orange.
Row 2, cell 4: glowing embers in a bronze brazier — dominant colour fiery orange.
Row 2, cell 5: a lion leaping forward in an explosion of fire — dominant colour fiery orange.
Row 2, cell 6: three spears flying in parallel toward the upper right — dominant colour fiery orange.
Row 2, cell 7: a golden victory wreath above a raised spear — dominant colour fiery orange.
Row 2, cell 8: the helmet of Ares, the war god, with burning red eyes — dominant colour fiery orange.
Row 3, cell 1: a bronze drinking cup (kylix) filled with dark red liquid — dominant colour dark wine red.
Row 3, cell 2: a curved sickle-shaped blade with drops of red falling from it — dominant colour dark wine red.
Row 3, cell 3: a short Greek sword (xiphos) with a glowing red blade — dominant colour dark wine red.
Row 3, cell 4: a bronze bowl overflowing with red liquid onto a shield below it — dominant colour dark wine red.
Row 3, cell 5: a muscular arm wrapped in iron bands holding a sword — dominant colour dark wine red.
Row 3, cell 6: two hands clasped in a warrior's handshake, a red cord tied around them — dominant colour dark wine red.
Row 3, cell 7: a roaring lion with a red mane made of flames — dominant colour dark wine red.
Row 3, cell 8: a red sword piercing straight through a bronze shield — dominant colour dark wine red.
Row 4, cell 1: a crested Corinthian bronze helmet with a red horsehair crest, seen from the side — dominant colour dark blood red.
Row 4, cell 2: a golden laurel wreath around a Corinthian helmet — dominant colour warm gold.
Row 4, cell 3: a lone Greek hero in bronze armour surrounded by a blazing golden aura — dominant colour fiery orange with extra gold.
Row 4, cell 4: the war god's bronze spear dripping red, crossed with a laurel branch — dominant colour dark wine red with extra gold.

AVOID: any letters, numbers, words or labels; watermarks or signatures; photorealism; soft gradients, blur or glow halos larger than 2 pixels; drop shadows on the background; tiles, frames, borders or grid lines; modern firearms or sci-fi elements; detailed human faces; magenta or pink inside the icons; icons touching each other or the image edge; duplicated icons; extra icons in row 4 cells 5-8.
```

<details><summary>Rasterindeling</summary>

| Rij | Cel | Knooppunt | Bestand |
|---|---|---|---|
| 1 | 1 | Menos | `spartaan_menos.png` |
| 1 | 2 | Levensroof | `spartaan_levensroof.png` |
| 1 | 3 | Razernij | `spartaan_razernij.png` |
| 1 | 4 | Bloedeed | `spartaan_bloedeed.png` |
| 1 | 5 | Ontketend | `spartaan_ontketend.png` |
| 1 | 6 | Krijgersbloed | `spartaan_krijgersbloed.png` |
| 1 | 7 | Achilles' Toorn | `spartaan_achilles_toorn.png` |
| 1 | 8 | Met je Schild of erop | `spartaan_met_je_schild.png` |
| 2 | 1 | Heldenmoed | `spartaan_heldenmoed.png` |
| 2 | 2 | Snelle Woede | `spartaan_snelle_woede.png` |
| 2 | 3 | Onstuitbare Kracht | `spartaan_onstuitbare_kracht.png` |
| 2 | 4 | Nagloeien | `spartaan_nagloeien.png` |
| 2 | 5 | Ontlading | `spartaan_ontlading.png` |
| 2 | 6 | Speerregen | `spartaan_speerregen.png` |
| 2 | 7 | Kleos | `spartaan_kleos.png` |
| 2 | 8 | Woede van Ares | `spartaan_woede_van_ares.png` |
| 3 | 1 | Dorst | `spartaan_dorst.png` |
| 3 | 2 | Wrede Oogst | `spartaan_wrede_oogst.png` |
| 3 | 3 | Rode Kling | `spartaan_rode_kling.png` |
| 3 | 4 | Overvloeiend Bloed | `spartaan_overvloeiend_bloed.png` |
| 3 | 5 | IJzeren Vlees | `spartaan_ijzeren_vlees.png` |
| 3 | 6 | Bloedbroeders | `spartaan_bloedbroeders.png` |
| 3 | 7 | Onverzadigbaar | `spartaan_onverzadigbaar.png` |
| 3 | 8 | Brandend Bloed | `spartaan_brandend_bloed.png` |
| 4 | 1 | Voorvechter | `spartaan_root.png` |
| 4 | 2 | Meester | `spartaan_meester.png` |
| 4 | 3 | Aristeia | `spartaan_aristeia.png` |
| 4 | 4 | Toorn van Ares | `spartaan_toorn_van_ares.png` |

</details>

---

## Cavalerie → `assets/skills/sheets/cavalerie.png`

```text
Wide 16:9 image: a sprite sheet of 28 separate pixel-art game skill icons for an ancient Greek/Roman strategy game, class "Cavalerie" (dark ochre brown).

LAYOUT (strict): an invisible grid of 8 columns and 4 rows, all cells equal size. Exactly one icon centred in each cell, filling about 70% of the cell, with generous empty space between icons so they never touch or overlap. Rows 1-3 have 8 icons each; row 4 has icons only in cells 1-4 — cells 5-8 of row 4 stay completely empty. No grid lines, no frames, no tiles, no borders around the icons.

BACKGROUND: the entire image background is one flat, uniform pure magenta (#FF00FF), with no texture, gradient, shadow, vignette or noise — it will be removed by chroma key. Never use magenta, pink or hot pink inside any icon; violet and purple must be clearly bluish.

STYLE: every icon drawn as if at 64×64 pixel resolution and enlarged with hard square pixel edges (no anti-aliasing, no smoothing), 16-bit RPG skill-icon style, seen straight from the front, readable at 32×32. Each icon is one single bold symbol with a 1-pixel dark brown outline, max. 8 colours, dominated by its own colour given below, with gold (#d4af37) highlights and dark brown shadows. All 28 icons share the same style, line weight and lighting (light from top-left), but each subject is clearly different from the others.

ICONS (left to right, top to bottom):
Row 1, cell 1: a horse lowering its head before a gallop, dust rising behind its hooves — dominant colour rusty copper orange.
Row 1, cell 2: a curved arrow sweeping around the side of a small block of soldiers — dominant colour wind teal.
Row 1, cell 3: a long heavy cavalry lance pointing forward horizontally — dominant colour rusty copper orange.
Row 1, cell 4: a horse galloping away while its rider looks back over his shoulder — dominant colour wind teal.
Row 1, cell 5: a horse's armoured chest smashing into a wooden barricade — dominant colour rusty copper orange.
Row 1, cell 6: a rider swerving aside while an arrow flies past him — dominant colour wind teal.
Row 1, cell 7: a war trumpet sounding with a horse charging out from behind it — dominant colour rusty copper orange.
Row 1, cell 8: a column of small horse silhouettes riding in a fast diagonal line — dominant colour wind teal.
Row 2, cell 1: a long trail of hoofprints leading toward a single charging horse — dominant colour rusty copper orange.
Row 2, cell 2: a horse bursting through a broken line of wooden shields — dominant colour rusty copper orange.
Row 2, cell 3: four horse hooves striking the ground with lightning-shaped cracks — dominant colour rusty copper orange.
Row 2, cell 4: a wedge-shaped formation of riders seen from above — dominant colour rusty copper orange.
Row 2, cell 5: a horse fully covered in scale armour, seen from the side — dominant colour rusty copper orange.
Row 2, cell 6: a heavy horse hoof crushing a bronze helmet — dominant colour rusty copper orange.
Row 2, cell 7: a hammer striking down onto an anvil shaped like a round shield — dominant colour rusty copper orange.
Row 2, cell 8: a black war horse with a white star on its forehead, rearing up — dominant colour rusty copper orange.
Row 3, cell 1: a horse galloping with wind lines streaming from its mane — dominant colour wind teal.
Row 3, cell 2: a mounted archer turning backwards in the saddle to shoot an arrow — dominant colour wind teal.
Row 3, cell 3: an hourglass with a horseshoe hanging in front of it — dominant colour wind teal.
Row 3, cell 4: two horseshoes side by side with small motion lines between them — dominant colour wind teal.
Row 3, cell 5: a light rider on a small horse without a saddle, holding a javelin — dominant colour wind teal.
Row 3, cell 6: several javelins flying in a fan shape from the side — dominant colour wind teal.
Row 3, cell 7: three riders in three directions around a small shield in the centre — dominant colour wind teal.
Row 3, cell 8: a horse spinning in a circle of dust and wind — dominant colour wind teal.
Row 4, cell 1: a rearing horse's head and neck in profile with a bronze bridle — dominant colour dark ochre brown.
Row 4, cell 2: a golden laurel wreath around a horseshoe — dominant colour warm gold.
Row 4, cell 3: a rider on a black horse leading a wedge of cavalry, spear raised — dominant colour rusty copper orange with extra gold.
Row 4, cell 4: a swirling storm of light riders throwing javelins around an enemy — dominant colour wind teal with extra gold.

AVOID: any letters, numbers, words or labels; watermarks or signatures; photorealism; soft gradients, blur or glow halos larger than 2 pixels; drop shadows on the background; tiles, frames, borders or grid lines; modern firearms or sci-fi elements; detailed human faces; magenta or pink inside the icons; icons touching each other or the image edge; duplicated icons; extra icons in row 4 cells 5-8.
```

<details><summary>Rasterindeling</summary>

| Rij | Cel | Knooppunt | Bestand |
|---|---|---|---|
| 1 | 1 | Aanloop | `cavalerie_aanloop.png` |
| 1 | 2 | Op de Flank | `cavalerie_op_de_flank.png` |
| 1 | 3 | Zware Lansen | `cavalerie_zware_lansen.png` |
| 1 | 4 | Toeslaan en Wegwezen | `cavalerie_hit_and_run.png` |
| 1 | 5 | Ramkoers | `cavalerie_ramkoers.png` |
| 1 | 6 | Ontwijken | `cavalerie_ontwijken.png` |
| 1 | 7 | Eerste Inslag | `cavalerie_eerste_inslag.png` |
| 1 | 8 | Vliegende Colonne | `cavalerie_vliegende_colonne.png` |
| 2 | 1 | Lange Aanloop | `cavalerie_lange_aanloop.png` |
| 2 | 2 | Doorbraak | `cavalerie_doorbraak.png` |
| 2 | 3 | Donderende Hoeven | `cavalerie_donderende_hoeven.png` |
| 2 | 4 | Wig | `cavalerie_wig.png` |
| 2 | 5 | Kataphrakt | `cavalerie_kataphrakt.png` |
| 2 | 6 | Verpletteren | `cavalerie_verpletteren.png` |
| 2 | 7 | Hamer en Aambeeld | `cavalerie_hamer_en_aambeeld.png` |
| 2 | 8 | Bucephalus | `cavalerie_bucephalus.png` |
| 3 | 1 | Windruiter | `cavalerie_windruiter.png` |
| 3 | 2 | Parthisch Schot | `cavalerie_parthisch_schot.png` |
| 3 | 3 | Ruitervaardigheid | `cavalerie_ruitervaardigheid.png` |
| 3 | 4 | Ritme | `cavalerie_ritme.png` |
| 3 | 5 | Numidische Ruiters | `cavalerie_numidische_ruiters.png` |
| 3 | 6 | Speervuur | `cavalerie_speervuur.png` |
| 3 | 7 | Overal Tegelijk | `cavalerie_overal_tegelijk.png` |
| 3 | 8 | Wervelwind | `cavalerie_wervelwind.png` |
| 4 | 1 | Cavalerie | `cavalerie_root.png` |
| 4 | 2 | Meester | `cavalerie_meester.png` |
| 4 | 3 | Charge van Alexander | `cavalerie_charge_van_alexander.png` |
| 4 | 4 | Numidische Storm | `cavalerie_numidische_storm.png` |

</details>

---

## Priester → `assets/skills/sheets/priester.png`

```text
Wide 16:9 image: a sprite sheet of 28 separate pixel-art game skill icons for an ancient Greek/Roman strategy game, class "Priester" (temple green).

LAYOUT (strict): an invisible grid of 8 columns and 4 rows, all cells equal size. Exactly one icon centred in each cell, filling about 70% of the cell, with generous empty space between icons so they never touch or overlap. Rows 1-3 have 8 icons each; row 4 has icons only in cells 1-4 — cells 5-8 of row 4 stay completely empty. No grid lines, no frames, no tiles, no borders around the icons.

BACKGROUND: the entire image background is one flat, uniform pure magenta (#FF00FF), with no texture, gradient, shadow, vignette or noise — it will be removed by chroma key. Never use magenta, pink or hot pink inside any icon; violet and purple must be clearly bluish.

STYLE: every icon drawn as if at 64×64 pixel resolution and enlarged with hard square pixel edges (no anti-aliasing, no smoothing), 16-bit RPG skill-icon style, seen straight from the front, readable at 32×32. Each icon is one single bold symbol with a 1-pixel dark brown outline, max. 8 colours, dominated by its own colour given below, with gold (#d4af37) highlights and dark brown shadows. All 28 icons share the same style, line weight and lighting (light from top-left), but each subject is clearly different from the others.

ICONS (left to right, top to bottom):
Row 1, cell 1: a hand pressing a glowing green herb onto a bandaged wound — dominant colour soft healing green.
Row 1, cell 2: a dark purple cloud with a single downward bolt above a broken spear — dominant colour mystic violet.
Row 1, cell 3: a sacred spring pouring clear water from a stone lion's mouth — dominant colour soft healing green.
Row 1, cell 4: the inscription stone of Delphi with a small glowing eye above it — dominant colour mystic violet.
Row 1, cell 5: a shallow bowl with a snake drinking from it, bathed in soft light — dominant colour soft healing green.
Row 1, cell 6: a single staring painted eye on a dark clay amulet — dominant colour mystic violet.
Row 1, cell 7: a wooden staff with a single snake coiled around it — dominant colour soft healing green.
Row 1, cell 8: a purple flame burning in a bronze tripod — dominant colour mystic violet.
Row 2, cell 1: a running figure carrying a bowl of glowing green ointment — dominant colour soft healing green.
Row 2, cell 2: a bundle of dried healing herbs tied with string — dominant colour soft healing green.
Row 2, cell 3: a golden bowl with a snake coiled around its base, glowing liquid inside — dominant colour soft healing green.
Row 2, cell 4: a sleeping figure on a temple bench under a crescent moon — dominant colour soft healing green.
Row 2, cell 5: the round stone theatre of Epidauros seen from above at dusk — dominant colour soft healing green.
Row 2, cell 6: a green temple snake coiled in a spiral on a stone floor — dominant colour soft healing green.
Row 2, cell 7: a small glass vial of glowing golden medicine — dominant colour soft healing green.
Row 2, cell 8: a beam of golden light falling onto an open hand — dominant colour soft healing green.
Row 3, cell 1: a heavy dark iron chain wrapped around a sword hilt — dominant colour mystic violet.
Row 3, cell 2: a black sun partly covered by a dark moon (eclipse) — dominant colour mystic violet.
Row 3, cell 3: a rolled papyrus scroll glowing with purple writing — dominant colour mystic violet.
Row 3, cell 4: a sphinx head in profile with a question-shaped curl of smoke — dominant colour mystic violet.
Row 3, cell 5: a bronze balance scale with a lightning bolt on one side — dominant colour mystic violet.
Row 3, cell 6: three ancient scrolls tied together with a purple ribbon — dominant colour mystic violet.
Row 3, cell 7: a winged female figure holding a sword and a measuring rod — dominant colour mystic violet.
Row 3, cell 8: a young priestess with wide eyes and a laurel band, seen from the side — dominant colour mystic violet.
Row 4, cell 1: a burning bronze altar bowl with smoke curling upward — dominant colour temple green.
Row 4, cell 2: a golden laurel wreath around a small burning altar — dominant colour warm gold.
Row 4, cell 3: a glowing open hand with a snake-entwined staff behind it — dominant colour soft healing green with extra gold.
Row 4, cell 4: the Pythia seated on a bronze tripod above a crack with rising purple vapour — dominant colour mystic violet with extra gold.

AVOID: any letters, numbers, words or labels; watermarks or signatures; photorealism; soft gradients, blur or glow halos larger than 2 pixels; drop shadows on the background; tiles, frames, borders or grid lines; modern firearms or sci-fi elements; detailed human faces; magenta or pink inside the icons; icons touching each other or the image edge; duplicated icons; extra icons in row 4 cells 5-8.
```

<details><summary>Rasterindeling</summary>

| Rij | Cel | Knooppunt | Bestand |
|---|---|---|---|
| 1 | 1 | Noodhulp | `priester_noodhulp.png` |
| 1 | 2 | Vloek der Goden | `priester_vloek_der_goden.png` |
| 1 | 3 | Heilige Bron | `priester_heilige_bron.png` |
| 1 | 4 | Les van Delphi | `priester_les_van_delphi.png` |
| 1 | 5 | Zegen van Hygieia | `priester_zegen_van_hygieia.png` |
| 1 | 6 | Boze Oog | `priester_boze_oog.png` |
| 1 | 7 | Staf van Asklepios | `priester_staf_van_asklepios.png` |
| 1 | 8 | Gewijd Vuur | `priester_gewijd_vuur.png` |
| 2 | 1 | Snelle Hulp | `priester_snelle_hulp.png` |
| 2 | 2 | Kruiden | `priester_kruiden.png` |
| 2 | 3 | Schaal van Hygieia | `priester_schaal_van_hygieia.png` |
| 2 | 4 | Tempelslaap | `priester_tempelslaap.png` |
| 2 | 5 | Epidauros | `priester_epidauros.png` |
| 2 | 6 | Heilige Slang | `priester_heilige_slang.png` |
| 2 | 7 | Panakeia | `priester_panakeia.png` |
| 2 | 8 | Wonderheling | `priester_wonderheling.png` |
| 3 | 1 | Zware Vloek | `priester_zware_vloek.png` |
| 3 | 2 | Onheilsdag | `priester_onheilsdag.png` |
| 3 | 3 | Duistere Taal | `priester_duistere_taal.png` |
| 3 | 4 | Raadselspreuk | `priester_raadselspreuk.png` |
| 3 | 5 | Godsoordeel | `priester_godsoordeel.png` |
| 3 | 6 | Sibyllijnse Boeken | `priester_sibyllijnse_boeken.png` |
| 3 | 7 | Nemesis | `priester_nemesis.png` |
| 3 | 8 | Cassandra | `priester_cassandra.png` |
| 4 | 1 | Priester | `priester_root.png` |
| 4 | 2 | Meester | `priester_meester.png` |
| 4 | 3 | Hand van Asklepios | `priester_hand_van_asklepios.png` |
| 4 | 4 | Orakel van Delphi | `priester_orakel_van_delphi.png` |

</details>

---

## Bevelvoerder → `assets/skills/sheets/centurio.png`

```text
Wide 16:9 image: a sprite sheet of 28 separate pixel-art game skill icons for an ancient Greek/Roman strategy game, class "Bevelvoerder" (imperial purple).

LAYOUT (strict): an invisible grid of 8 columns and 4 rows, all cells equal size. Exactly one icon centred in each cell, filling about 70% of the cell, with generous empty space between icons so they never touch or overlap. Rows 1-3 have 8 icons each; row 4 has icons only in cells 1-4 — cells 5-8 of row 4 stay completely empty. No grid lines, no frames, no tiles, no borders around the icons.

BACKGROUND: the entire image background is one flat, uniform pure magenta (#FF00FF), with no texture, gradient, shadow, vignette or noise — it will be removed by chroma key. Never use magenta, pink or hot pink inside any icon; violet and purple must be clearly bluish.

STYLE: every icon drawn as if at 64×64 pixel resolution and enlarged with hard square pixel edges (no anti-aliasing, no smoothing), 16-bit RPG skill-icon style, seen straight from the front, readable at 32×32. Each icon is one single bold symbol with a 1-pixel dark brown outline, max. 8 colours, dominated by its own colour given below, with gold (#d4af37) highlights and dark brown shadows. All 28 icons share the same style, line weight and lighting (light from top-left), but each subject is clearly different from the others.

ICONS (left to right, top to bottom):
Row 1, cell 1: a stack of grain sacks and an amphora on a small wooden cart — dominant colour supply teal.
Row 1, cell 2: a Roman legion standard with a raised eagle and red banner — dominant colour imperial violet.
Row 1, cell 3: a running Roman messenger carrying a small sack over his shoulder — dominant colour supply teal.
Row 1, cell 4: a Roman standard-bearer's pole with round metal discs (phalerae) — dominant colour imperial violet.
Row 1, cell 5: two hands catching a falling bronze helmet — dominant colour supply teal.
Row 1, cell 6: a commander's eye looking over a small field camp with tents — dominant colour imperial violet.
Row 1, cell 7: a wax writing tablet with neat rows of tally marks and a stylus — dominant colour supply teal.
Row 1, cell 8: a golden Roman legion eagle with spread wings on top of a pole — dominant colour imperial violet.
Row 2, cell 1: a Roman granary building with open doors full of grain — dominant colour supply teal.
Row 2, cell 2: a leather marching pack with a bread loaf and a water flask — dominant colour supply teal.
Row 2, cell 3: a bronze cooking pot steaming over a small camp fire — dominant colour supply teal.
Row 2, cell 4: a rope net stretched between two wooden posts — dominant colour supply teal.
Row 2, cell 5: a mule carrying packs and a pickaxe on its back — dominant colour supply teal.
Row 2, cell 6: a battered old Roman helmet with many dents and a scar-like scratch — dominant colour supply teal.
Row 2, cell 7: a Roman legionary carrying a heavy pack on a forked pole over his shoulder — dominant colour supply teal.
Row 2, cell 8: a closed circle of linked hands seen from above — dominant colour supply teal.
Row 3, cell 1: a centurion's vine staff raised high with a golden ribbon — dominant colour imperial violet.
Row 3, cell 2: an open-mouthed Roman helmet with sound waves coming out — dominant colour imperial violet.
Row 3, cell 3: a tribune's narrow purple-striped cloak draped over a chair — dominant colour imperial violet.
Row 3, cell 4: a perfect square formation of shields seen from above (testudo) — dominant colour imperial violet.
Row 3, cell 5: a square red military banner (vexillum) hanging from a crossbar — dominant colour imperial violet.
Row 3, cell 6: a kneeling veteran soldier with a long spear braced against the ground — dominant colour imperial violet.
Row 3, cell 7: a bundle of rods with an axe (fasces) tied with red leather straps — dominant colour imperial violet.
Row 3, cell 8: a golden eagle surrounded by shining rays of light — dominant colour imperial violet.
Row 4, cell 1: a Roman centurion's helmet with a sideways red crest, seen from the front — dominant colour imperial purple.
Row 4, cell 2: a golden laurel wreath around a centurion's vine staff (vitis) — dominant colour warm gold.
Row 4, cell 3: a cargo ship full of grain sacks with a sheaf of wheat on its sail — dominant colour supply teal with extra gold.
Row 4, cell 4: a golden four-horse triumphal chariot seen from the front, a laurel wreath above it — dominant colour imperial violet with extra gold.

AVOID: any letters, numbers, words or labels; watermarks or signatures; photorealism; soft gradients, blur or glow halos larger than 2 pixels; drop shadows on the background; tiles, frames, borders or grid lines; modern firearms or sci-fi elements; detailed human faces; magenta or pink inside the icons; icons touching each other or the image edge; duplicated icons; extra icons in row 4 cells 5-8.
```

<details><summary>Rasterindeling</summary>

| Rij | Cel | Knooppunt | Bestand |
|---|---|---|---|
| 1 | 1 | Bevoorrading | `centurio_bevoorrading.png` |
| 1 | 2 | Moreel | `centurio_moreel.png` |
| 1 | 3 | Snelle Bevoorrading | `centurio_snelle_bevoorrading.png` |
| 1 | 4 | Signifer | `centurio_signifer.png` |
| 1 | 5 | Opvangen | `centurio_opvangen.png` |
| 1 | 6 | Veldheersblik | `centurio_veldheersblik.png` |
| 1 | 7 | Logistiek | `centurio_logistiek.png` |
| 1 | 8 | Aquila | `centurio_aquila.png` |
| 2 | 1 | Volle Schuren | `centurio_volle_schuren.png` |
| 2 | 2 | Marsrantsoen | `centurio_marsrantsoen.png` |
| 2 | 3 | Veldkeuken | `centurio_veldkeuken.png` |
| 2 | 4 | Vangnet | `centurio_vangnet.png` |
| 2 | 5 | Bagagetrein | `centurio_bagagetrein.png` |
| 2 | 6 | Taaie Veteraan | `centurio_taaie_veteraan.png` |
| 2 | 7 | Muilezels van Marius | `centurio_muilezels_van_marius.png` |
| 2 | 8 | Niemand Valt | `centurio_niemand_valt.png` |
| 3 | 1 | Optimus | `centurio_optimus.png` |
| 3 | 2 | Strijdkreet | `centurio_strijdkreet.png` |
| 3 | 3 | Tribunus | `centurio_tribunus.png` |
| 3 | 4 | Disciplina | `centurio_disciplina.png` |
| 3 | 5 | Signum | `centurio_signum.png` |
| 3 | 6 | Triarii | `centurio_triarii.png` |
| 3 | 7 | Imperium | `centurio_imperium.png` |
| 3 | 8 | Gloria | `centurio_gloria.png` |
| 4 | 1 | Bevelvoerder | `centurio_root.png` |
| 4 | 2 | Meester | `centurio_meester.png` |
| 4 | 3 | Annona | `centurio_annona.png` |
| 4 | 4 | Triumphus | `centurio_triumphus.png` |

</details>

---

## Genie → `assets/skills/sheets/genie.png`

```text
Wide 16:9 image: a sprite sheet of 28 separate pixel-art game skill icons for an ancient Greek/Roman strategy game, class "Genie" (burnt copper).

LAYOUT (strict): an invisible grid of 8 columns and 4 rows, all cells equal size. Exactly one icon centred in each cell, filling about 70% of the cell, with generous empty space between icons so they never touch or overlap. Rows 1-3 have 8 icons each; row 4 has icons only in cells 1-4 — cells 5-8 of row 4 stay completely empty. No grid lines, no frames, no tiles, no borders around the icons.

BACKGROUND: the entire image background is one flat, uniform pure magenta (#FF00FF), with no texture, gradient, shadow, vignette or noise — it will be removed by chroma key. Never use magenta, pink or hot pink inside any icon; violet and purple must be clearly bluish.

STYLE: every icon drawn as if at 64×64 pixel resolution and enlarged with hard square pixel edges (no anti-aliasing, no smoothing), 16-bit RPG skill-icon style, seen straight from the front, readable at 32×32. Each icon is one single bold symbol with a 1-pixel dark brown outline, max. 8 colours, dominated by its own colour given below, with gold (#d4af37) highlights and dark brown shadows. All 28 icons share the same style, line weight and lighting (light from top-left), but each subject is clearly different from the others.

ICONS (left to right, top to bottom):
Row 1, cell 1: a small wooden catapult (onager) with its throwing arm pulled back — dominant colour fiery siege orange.
Row 1, cell 2: a row of sharpened wooden stakes forming a palisade wall — dominant colour sage stone grey-green.
Row 1, cell 3: a cracked shield turning into a burst of flying stone fragments — dominant colour fiery siege orange.
Row 1, cell 4: a freshly dug defensive ditch with a pile of earth behind it — dominant colour sage stone grey-green.
Row 1, cell 5: a scroll with a drawn plan of a fortress wall and a pointing stylus — dominant colour fiery siege orange.
Row 1, cell 6: large square foundation stones stacked in a solid base — dominant colour sage stone grey-green.
Row 1, cell 7: a clay pot with burning oil flying through the air — dominant colour fiery siege orange.
Row 1, cell 8: a covered pit trap with sharpened stakes visible at the bottom — dominant colour sage stone grey-green.
Row 2, cell 1: a covered battering ram with a bronze ram's head on a wheeled frame — dominant colour fiery siege orange.
Row 2, cell 2: an hourglass standing next to a small wooden siege engine — dominant colour fiery siege orange.
Row 2, cell 3: a tall wooden siege tower on wheels with a drawbridge at the top — dominant colour fiery siege orange.
Row 2, cell 4: a large round stone ball resting in the cup of a catapult arm — dominant colour fiery siege orange.
Row 2, cell 5: a large crossbow-like ballista loaded with a heavy bolt — dominant colour fiery siege orange.
Row 2, cell 6: three burning arrows striking a wooden wall — dominant colour fiery siege orange.
Row 2, cell 7: a crowned helmet above a row of three small siege engines — dominant colour fiery siege orange.
Row 2, cell 8: a stone wall with a large hole smashed through its centre — dominant colour fiery siege orange.
Row 3, cell 1: a solid wall of cut stone blocks with a walkway on top — dominant colour sage stone grey-green.
Row 3, cell 2: a hammer and a roll of bandage lying on a wooden plank — dominant colour sage stone grey-green.
Row 3, cell 3: a wooden watchtower with a small roof and a lookout platform — dominant colour sage stone grey-green.
Row 3, cell 4: a builder's hammer striking a wooden beam with motion lines — dominant colour sage stone grey-green.
Row 3, cell 5: a small square stone fort with four corner towers seen from above — dominant colour sage stone grey-green.
Row 3, cell 6: two parallel water-filled ditches in front of an earth wall — dominant colour sage stone grey-green.
Row 3, cell 7: a rectangular Roman army camp with a wooden palisade and four gates, seen from above — dominant colour sage stone grey-green.
Row 3, cell 8: a long stone wall winding over green hills — dominant colour sage stone grey-green.
Row 4, cell 1: a bronze gear wheel with a compass and a builder's square crossed over it — dominant colour burnt copper.
Row 4, cell 2: a golden laurel wreath around a bronze gear wheel — dominant colour warm gold.
Row 4, cell 3: large curved bronze mirrors focusing a beam of sunlight onto a burning ship — dominant colour fiery siege orange with extra gold.
Row 4, cell 4: high stone city walls above the sea with strange wooden cranes on top — dominant colour sage stone grey-green with extra gold.

AVOID: any letters, numbers, words or labels; watermarks or signatures; photorealism; soft gradients, blur or glow halos larger than 2 pixels; drop shadows on the background; tiles, frames, borders or grid lines; modern firearms or sci-fi elements; detailed human faces; magenta or pink inside the icons; icons touching each other or the image edge; duplicated icons; extra icons in row 4 cells 5-8.
```

<details><summary>Rasterindeling</summary>

| Rij | Cel | Knooppunt | Bestand |
|---|---|---|---|
| 1 | 1 | Katapult Bouwen | `genie_katapult_bouwen.png` |
| 1 | 2 | Palissade | `genie_palissade.png` |
| 1 | 3 | Omslaan | `genie_omslaan.png` |
| 1 | 4 | Gegraven Greppel | `genie_gegraven_greppel.png` |
| 1 | 5 | Belegeringskunde | `genie_belegeringskunde.png` |
| 1 | 6 | Stevige Fundering | `genie_stevige_fundering.png` |
| 1 | 7 | Vuurpotten | `genie_vuurpotten.png` |
| 1 | 8 | Valkuil | `genie_valkuil.png` |
| 2 | 1 | Stormram | `genie_stormram.png` |
| 2 | 2 | Lange Belegering | `genie_lange_belegering.png` |
| 2 | 3 | Belegeringstoren | `genie_belegeringstoren.png` |
| 2 | 4 | Zware Stenen | `genie_zware_stenen.png` |
| 2 | 5 | Ballista | `genie_ballista.png` |
| 2 | 6 | Brandpijlen | `genie_brandpijlen.png` |
| 2 | 7 | Poliorketes | `genie_poliorketes.png` |
| 2 | 8 | Muurbreker | `genie_muurbreker.png` |
| 3 | 1 | Stenen Muur | `genie_stenen_muur.png` |
| 3 | 2 | Veldherstel | `genie_veldherstel.png` |
| 3 | 3 | Wachttoren | `genie_wachttoren.png` |
| 3 | 4 | Snelbouw | `genie_snelbouw.png` |
| 3 | 5 | Vesting | `genie_vesting.png` |
| 3 | 6 | Dubbele Gracht | `genie_dubbele_gracht.png` |
| 3 | 7 | Castra | `genie_castra.png` |
| 3 | 8 | Muur van Hadrianus | `genie_muur_van_hadrianus.png` |
| 4 | 1 | Genie | `genie_root.png` |
| 4 | 2 | Meester | `genie_meester.png` |
| 4 | 3 | Spiegels van Archimedes | `genie_archimedes.png` |
| 4 | 4 | Muren van Syracuse | `genie_muren_van_syracuse.png` |

</details>

---

## Verkenner → `assets/skills/sheets/verkenner.png`

```text
Wide 16:9 image: a sprite sheet of 28 separate pixel-art game skill icons for an ancient Greek/Roman strategy game, class "Verkenner" (deep forest teal).

LAYOUT (strict): an invisible grid of 8 columns and 4 rows, all cells equal size. Exactly one icon centred in each cell, filling about 70% of the cell, with generous empty space between icons so they never touch or overlap. Rows 1-3 have 8 icons each; row 4 has icons only in cells 1-4 — cells 5-8 of row 4 stay completely empty. No grid lines, no frames, no tiles, no borders around the icons.

BACKGROUND: the entire image background is one flat, uniform pure magenta (#FF00FF), with no texture, gradient, shadow, vignette or noise — it will be removed by chroma key. Never use magenta, pink or hot pink inside any icon; violet and purple must be clearly bluish.

STYLE: every icon drawn as if at 64×64 pixel resolution and enlarged with hard square pixel edges (no anti-aliasing, no smoothing), 16-bit RPG skill-icon style, seen straight from the front, readable at 32×32. Each icon is one single bold symbol with a 1-pixel dark brown outline, max. 8 colours, dominated by its own colour given below, with gold (#d4af37) highlights and dark brown shadows. All 28 icons share the same style, line weight and lighting (light from top-left), but each subject is clearly different from the others.

ICONS (left to right, top to bottom):
Row 1, cell 1: a small shovel digging a tunnel underneath a stone wall — dominant colour smouldering ember red.
Row 1, cell 2: a spear point sticking out from dense dark green bushes — dominant colour deep forest green.
Row 1, cell 3: a burning torch held against a wooden palisade — dominant colour smouldering ember red.
Row 1, cell 4: a light leather satchel and a short dagger lying on the ground — dominant colour deep forest green.
Row 1, cell 5: a pickaxe stuck in the cracked foundation stones of a wall — dominant colour smouldering ember red.
Row 1, cell 6: a pair of watchful eyes glowing between dark leaves — dominant colour deep forest green.
Row 1, cell 7: a knife cutting through the leather strap of a shield — dominant colour smouldering ember red.
Row 1, cell 8: a narrow hidden path winding between tall dark forest trees — dominant colour deep forest green.
Row 2, cell 1: a burning wooden siege engine wheel with small flames — dominant colour smouldering ember red.
Row 2, cell 2: a long burning fuse cord snaking toward a small clay pot — dominant colour smouldering ember red.
Row 2, cell 3: a wooden palisade with a large burnt hole through it — dominant colour smouldering ember red.
Row 2, cell 4: hands lifting the cover off a pit trap with sharpened stakes — dominant colour smouldering ember red.
Row 2, cell 5: a hawk's eye looking through a gap in a wooden wall — dominant colour smouldering ember red.
Row 2, cell 6: a hooded figure slipping through an open gate at night — dominant colour smouldering ember red.
Row 2, cell 7: scorched black earth with smoking remains of wooden stakes — dominant colour smouldering ember red.
Row 2, cell 8: a two-faced mask, one side smiling and one side frowning — dominant colour smouldering ember red.
Row 3, cell 1: several spear points bursting out of thick bushes at once — dominant colour deep forest green.
Row 3, cell 2: a small rolled message with a wax seal tied to an arrow — dominant colour deep forest green.
Row 3, cell 3: a cloaked figure vanishing into fog between trees — dominant colour deep forest green.
Row 3, cell 4: a coiled snake hiding under a rock, ready to strike — dominant colour deep forest green.
Row 3, cell 5: a Germanic chieftain's horned helmet resting on a round wooden shield — dominant colour deep forest green.
Row 3, cell 6: three small daggers stuck in a wooden post — dominant colour deep forest green.
Row 3, cell 7: a ghostly green mask made of leaves floating in a dark forest — dominant colour deep forest green.
Row 3, cell 8: a fallen Roman eagle standard lying in the mud of a forest — dominant colour deep forest green.
Row 4, cell 1: a hooded scout's eye peering through tall grass, seen from the front — dominant colour deep forest teal.
Row 4, cell 2: a golden laurel wreath around a scout's hooded cloak clasp — dominant colour warm gold.
Row 4, cell 3: a collapsing burning wooden palisade with a lone hooded figure walking away — dominant colour smouldering ember red with extra gold.
Row 4, cell 4: a dark dense forest with many spear points hidden among the trees, a Roman eagle in the foreground — dominant colour deep forest green with extra gold.

AVOID: any letters, numbers, words or labels; watermarks or signatures; photorealism; soft gradients, blur or glow halos larger than 2 pixels; drop shadows on the background; tiles, frames, borders or grid lines; modern firearms or sci-fi elements; detailed human faces; magenta or pink inside the icons; icons touching each other or the image edge; duplicated icons; extra icons in row 4 cells 5-8.
```

<details><summary>Rasterindeling</summary>

| Rij | Cel | Knooppunt | Bestand |
|---|---|---|---|
| 1 | 1 | Ondermijnen | `verkenner_ondermijnen.png` |
| 1 | 2 | Hinderlaagtactiek | `verkenner_hinderlaagtactiek.png` |
| 1 | 3 | Brandstichter | `verkenner_brandstichter.png` |
| 1 | 4 | Lichtbepakt | `verkenner_lichtbepakt.png` |
| 1 | 5 | Ondergraven | `verkenner_ondergraven.png` |
| 1 | 6 | Op de Loer | `verkenner_op_de_loer.png` |
| 1 | 7 | Doorgesneden Riemen | `verkenner_doorgesneden_riemen.png` |
| 1 | 8 | Woudkennis | `verkenner_woudkennis.png` |
| 2 | 1 | Vuur in de Voorraad | `verkenner_vuur_in_de_voorraad.png` |
| 2 | 2 | Lange Lont | `verkenner_lange_lont.png` |
| 2 | 3 | Gaten in de Muur | `verkenner_gaten_in_de_muur.png` |
| 2 | 4 | Valstrikken Ontmantelen | `verkenner_valstrikken_ontmantelen.png` |
| 2 | 5 | Scherpe Ogen | `verkenner_scherpe_ogen.png` |
| 2 | 6 | Infiltrant | `verkenner_infiltrant.png` |
| 2 | 7 | Verschroeide Aarde | `verkenner_verschroeide_aarde.png` |
| 2 | 8 | Dubbelspel | `verkenner_dubbelspel.png` |
| 3 | 1 | Uit het Struikgewas | `verkenner_uit_het_struikgewas.png` |
| 3 | 2 | Verkenningsrapport | `verkenner_verkenningsrapport.png` |
| 3 | 3 | Toeslaan en Verdwijnen | `verkenner_toeslaan_en_verdwijnen.png` |
| 3 | 4 | Opgespaarde Woede | `verkenner_opgespaarde_woede.png` |
| 3 | 5 | Arminius | `verkenner_arminius.png` |
| 3 | 6 | Kleine Steken | `verkenner_kleine_steken.png` |
| 3 | 7 | Woudgeest | `verkenner_woudgeest.png` |
| 3 | 8 | Varus' Ondergang | `verkenner_varus_ondergang.png` |
| 4 | 1 | Verkenner | `verkenner_root.png` |
| 4 | 2 | Meester | `verkenner_meester.png` |
| 4 | 3 | Grote Sabotage | `verkenner_grote_sabotage.png` |
| 4 | 4 | Teutoburgerwoud | `verkenner_teutoburgerwoud.png` |

</details>
