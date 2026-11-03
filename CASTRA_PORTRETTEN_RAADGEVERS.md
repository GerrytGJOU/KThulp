# Portretten van de raadgevers (11), prompts voor het sprites-gesprek

De elf raadgevers (`raad_<regio>` in `certamen/castra-mythos.js`) hebben nog geen portret. Per persoon één bestand: `certamen/assets/portraits/<naam>.png`, 144×144, naam in kleine letters met `_` (zie `certamen/assets/portraits/MANIFEST.md`). Hieronder een gemeenschappelijk sjabloon en per persoon de invulling. Gebruik gerust de bestaande generator en referentiebladen (de portretten van de andere NPC's) voor de stijl; pas het sjabloon aan als jullie een ander formaat gebruiken.

| Bestand | Naam in het spel | Regio |
|---|---|---|
| `pastor_latinus.png` | Pastor Latinus | Latium |
| `augur.png` | Augur | Roma |
| `bardus_senex.png` | Bardus senex | Gallia |
| `venator_hercynius.png` | Venator Hercynius | Germania |
| `rhapsodos.png` | Rhapsodos | Graecia |
| `hilotes.png` | Hilotes | Laconia |
| `pastor_idaeus.png` | Pastor Idaeus | Troia |
| `venatrix_amazon.png` | Venatrix Amazon | Themiscyra |
| `senex_persa.png` | Senex Persa | Persis |
| `augur_solis.png` | Augur Solis | Aegyptus |
| `nauta_poenus.png` | Nauta Poenus | Africa |

## Sjabloon (voor elke persoon invullen)

````
Use the attached images as reference: the FIRST image is the style reference (palette, outline, proportions and level of detail of the existing NPC portraits of this game).

Create ONE portrait: canvas exactly 512 x 512 pixels (it will be reduced to 144 x 144), 16-bit JRPG pixel-art in the style of RPG Maker MV and classic Fire Emblem portraits. A bust portrait, three-quarter view, the face turned slightly towards the right side of the image, the eyes looking a little past the viewer. The figure fills about 70 percent of the canvas, head and shoulders and the upper chest, centred, on a plain flat parchment-beige background (one single colour, no scenery).

CHARACTER: "{NAME}", {ROLE}. {LOOK} SKIN COLOUR: {SKIN} MOOD: {MOOD}

STYLE: chunky visible pixels, at most 24 colours, one dark-brown 1-pixel outline around the whole figure, flat cel-shading with at most two tones per colour, warm saturated colours, a clearly readable face with more detail in the eyes, brows and mouth than in the clothes. Every pixel is a block of 8 x 8 image pixels and all pixels in the image are exactly the same size.

AVOID: NO TEXT OF ANY KIND (no labels, captions, names or letters anywhere); no logo or watermark; no frame or border; no second person; no scenery, no ground, no platform; no modern items; no glossy or airbrushed shading, no gradients, no blur, no anti-aliasing; no horns or helmets with horns; no change of clothing colours between versions.
````

## Invulling per persoon

**1. Pastor Latinus** (`pastor_latinus`), Latium, een herder
- NAME: Pastor Latinus. ROLE: an old shepherd of early Latium who knows the local legends (the she-wolf and the fauns).
- LOOK: A weathered old man with a short grey beard and deep smile lines. He wears a wide-brimmed straw hat (a petasus) tilted back, a rough undyed wool tunic with a brown sheepskin vest over it, and a rolled-up russet woollen cloak over one shoulder. His right hand holds a tall wooden shepherd's crook that reaches above his head at the edge of the picture.
- SKIN: sun-browned olive-tan Mediterranean skin. MOOD: kindly and knowing, a small smile.

**2. Augur** (`augur`), Roma, een Romeinse vogelkijker
- NAME: Augur. ROLE: a Roman priest who reads the flight of birds.
- LOOK: A dignified man of about sixty with short grey hair and a clean-shaven, stern face. A fold of his white toga (with a wide purple border stripe) is pulled over the back of his head as a veil. In his right hand, next to his shoulder, he holds the lituus: a slender wooden staff with a curled end like a shepherd's crook, pointing up. A small bronze fibula holds the toga at his shoulder.
- SKIN: olive-tan Mediterranean skin. MOOD: calm, watchful, a slightly raised eyebrow.

**3. Bardus senex** (`bardus_senex`), Gallia, een oude Keltische barde
- NAME: Bardus senex. ROLE: an old Gallic bard who sings the ancient songs.
- LOOK: A very old man with long white hair and a long white moustache, both braided with a few thin plaits. He wears a green-blue tunic with a small red-and-yellow checked pattern at the collar, a thick twisted bronze torc around his neck and a brown fur-trimmed cloak. At the bottom edge of the picture the top of a small wooden lyre is visible in his hands.
- SKIN: pale fair skin with a few freckles and ruddy cheeks. MOOD: warm and dreamy, half-closed singing eyes.

**4. Venator Hercynius** (`venator_hercynius`), Germania, een jager uit het Hercynische woud
- NAME: Venator Hercynius. ROLE: a Germanic hunter from the dense Hercynian forest.
- LOOK: A broad-shouldered man with a thick reddish-blond beard in two braids and long hair tied back. He wears a grey wolf-pelt cloak over one shoulder fastened with a bone pin, a rough brown wool tunic, and a plain leather cap. Behind his right shoulder the iron tip of a hunting spear sticks up.
- SKIN: pale fair skin, weathered and wind-reddened. MOOD: serious and cautious, slightly narrowed eyes.

**5. Rhapsodos** (`rhapsodos`), Graecia, een Griekse zanger
- NAME: Rhapsodos. ROLE: a Greek rhapsode, a travelling singer of epic poems.
- LOOK: A young man with wavy dark-brown hair, a thin dark beard and a green laurel wreath on his head. He wears a white chiton with a blue Greek-key border at the neckline and a sky-blue cloak pinned at one shoulder with a gold brooch. In his right hand he holds a smooth wooden staff (a rhabdos) with a leather grip, rising beside his head.
- SKIN: olive-tan Mediterranean skin. MOOD: dreamy and inspired, a half-open mouth as if about to recite.

**6. Hilotes** (`hilotes`), Laconia, een Spartaanse heloot
- NAME: Hilotes. ROLE: a helot, a poor serf of Sparta who works the land and knows the mountain.
- LOOK: A lean, tired man with short dark curly hair and a stubbly chin. He wears a simple brown sleeveless tunic (an exomis) that leaves one shoulder bare, and a rough cap of dark dog-fur. A coil of rope and a worn wooden walking staff are over his shoulder. No armour, no weapons.
- SKIN: sun-darkened olive-brown skin. MOOD: wary and humble, eyes looking slightly to the side.

**7. Pastor Idaeus** (`pastor_idaeus`), Troia, een herder van de Ida
- NAME: Pastor Idaeus. ROLE: a young shepherd from Mount Ida near Troy.
- LOOK: A friendly young man with curly dark hair. He wears a red Phrygian cap with the soft peak folded forward, a short blue tunic with a yellow trim, and a brown goatskin over his shoulders. A wooden shepherd's staff stands next to him, its curved top visible beside his head, and a small reed flute hangs on a cord at his chest.
- SKIN: olive-tan Mediterranean skin. MOOD: open and friendly, a relaxed smile.

**8. Venatrix Amazon** (`venatrix_amazon`), Themiscyra, een Amazone-jageres
- NAME: Venatrix Amazon. ROLE: an Amazon huntress who knows the sacred places of the forest and the mountains.
- LOOK: A woman with a strong jaw and long dark braided hair under a red leather headband. She wears a light tan leather tunic that leaves one shoulder bare, a bronze pin shaped like a crescent moon, and leather wrist guards. The top of a recurved horn bow rises behind her shoulder, and a few arrow feathers show at the other shoulder. Red and black accents on the clothes.
- SKIN: warm tanned skin. MOOD: alert and a little fierce, a confident half-smile.

**9. Senex Persa** (`senex_persa`), Persis, een oude Pers
- NAME: Senex Persa. ROLE: an old Persian sage of the royal road who knows the red mountains.
- LOOK: An old man with a long curled grey beard and calm dark eyes. He wears a tall soft felt cap with a rounded top (a Persian kyrbasia) in deep blue with a gold band, a long-sleeved tunic with gold embroidery on the shoulders in blue and gold, and a single gold earring. A thin gold chain hangs around his neck.
- SKIN: medium olive-brown skin. MOOD: calm and wise, serene, a slight smile.

**10. Augur Solis** (`augur_solis`), Aegyptus, een zonnepriester
- NAME: Augur Solis. ROLE: an Egyptian priest of the sun god who watches the sunrise and the sacred phoenix.
- LOOK: A man with a completely shaved head and kohl-lined eyes. He wears a wide gold-and-blue collar (a usekh) over a white linen garment, a round gold sun-disc pendant on his chest, and a thin gold band around his forehead. His hands, together at the bottom edge of the picture, hold a short golden staff with a small sun-disc at the top.
- SKIN: medium-dark warm brown skin. MOOD: solemn and attentive, the eyes looking up and to the right as if watching the sky.

**11. Nauta Poenus** (`nauta_poenus`), Africa, een Carthaagse zeeman
- NAME: Nauta Poenus. ROLE: a Carthaginian sailor who knows the coast and the song of the Sirens.
- LOOK: A weathered man with a dark curly beard, a gold hoop earring and a purple-dyed head cloth tied at the side. He wears a striped tunic in cream and dark red, a coil of rope over one shoulder, and a small bronze amulet shaped like a crescent moon with a disc on a cord at his neck.
- SKIN: olive-brown skin, sun-weathered. MOOD: wary and wise, a raised eyebrow, with a half-smile.

## Daarna
Zodra de bestanden in `certamen/assets/portraits/` staan, hoog ik `CASTRA_PORTRAIT_VER` op en lopen de portretten vanzelf mee in de gesprekken. Het overzicht van wie nog mist: `node certamen/tools/castra-portraits-manifest.js` (vanuit `certamen/`).
