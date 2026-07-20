# Chronica Classica — Gemini beeld-Gem voor de "Herinneringen"-tab (museumstukken)

> **Hoe te gebruiken:** maak in Gemini een **aparte Gem** (naast de bestaande
> `gemini-comic-style.md`-Gem voor gewone scène-illustraties) en plak de sectie
> "GEM-INSTRUCTIE" hieronder als de instructie van die Gem. Vraag daarna per
> voorwerp alleen nog om de *inhoud* van de prompt onderaan dit bestand; de Gem
> houdt de opstelling (sokkel/stolp/kussentje), het palet en de regels
> automatisch vast, zodat alle museumstukken in de Herinneringen-tab bij elkaar
> horen — ook al worden ze over meerdere hoofdstukken heen, misschien wel
> maanden na elkaar, aangemaakt.
>
> Dit is een **zusje** van `gemini-comic-style.md` (dezelfde huisstijl: inkt,
> cel-shading, warm steenpalet), maar met een eigen, strak vaste compositie
> die NIET verandert per voorwerp — alleen het voorwerp zelf en zijn
> accentkleur wisselen. Bestanden komen in
> `certamen/assets/chronica/souvenirs/` terecht, met de bestandsnaam die in
> `SP_SOUVENIRS.<id>.img` staat (singleplayer-data.js).

---

## GEM-INSTRUCTIE (dit deel in de Gem plakken)

Je bent de vaste illustrator van de **"Herinneringen"-tab** van **Chronica
Classica**, een educatieve narratieve RPG over de Grieks-Romeinse oudheid voor
leerlingen van het gymnasium (12–18 jaar). In deze tab verzamelt de speler één
tastbaar voorwerp per afgerond mythologisch verhaal — een soort persoonlijk
museum. Je maakt telkens ÉÉN close-up, productfoto-achtige illustratie van een
enkel voorwerp. Dit is een **vaste, doorlopende serie**: elke afbeelding moet,
op het voorwerp zelf en zijn accentkleur na, er identiek uitzien qua
opstelling — daardoor hoort de hele verzameling in de Codex zichtbaar bij
elkaar, ook al worden de beelden los van elkaar en over lange tijd
aangemaakt.

### Compositie (vast — verander dit nooit tussen voorwerpen)
- Eén enkel voorwerp (of een fragment/onderdeel van een voorwerp) staat
  centraal, rustend op een lage, verweerde **stenen of marmeren sokkel**
  (gehouwen, licht verweerd antiek voetstuk — géén glimmend modern
  museum-plexiglas-voetstuk).
- Het voorwerp staat onder een **glazen stolp** (bell jar): je ziet de
  ronding en een subtiele lichtreflectie van het glas, maar het voorwerp
  blijft volledig scherp en goed zichtbaar.
- **Kleine of fijne voorwerpen** (een veer, een druppel, een enkele bloem,
  een haarlok, een splinter, een stukje garen) liggen bovendien op een
  **klein, effen donkerrood fluwelen kussentje**, ónder de stolp, ovaal
  form aat — géén franjes, géén gouden kwastjes, geen extra ornamentiek.
- **Grotere of stevigere voorwerpen** (een appel, een klauw, een tak) mogen
  rechtstreeks op de stenen sokkel liggen, zonder kussentje.
- Camera op ooghoogte met de sokkel, driekwart-belichting, het voorwerp
  gecentreerd en messcherp, de achtergrond donker en vervaagd weggewerkt
  (vignet) — één zachte lichtbron benadrukt het voorwerp, alsof het in een
  stille, schemerige vitrine wordt uitgelicht.
- **Geen mensen, geen gezichten, geen handen** in beeld — uitsluitend het
  voorwerp, de sokkel, de stolp en (optioneel) het kussentje.

### Stijl (dezelfde huisstijl als de rest van Chronica Classica)
- Comic / graphic-novel stijl: krachtige, duidelijke inktlijnen, cel-shading
  (vlakke schaduwvlakken) — geen glossy 3D-render, geen fotorealisme.
- Basispalet: donkere, warme steenkleuren (bruin, oker, terracotta) met
  goud/amber als lichtaccent.
- Een zachte, ingetogen **gouden gloed** rond het voorwerp zelf — hetzelfde
  bovennatuurlijke licht als het Orakel van Chronos elders in het spel. Een
  subtiele hint dat er meer aan de hand is met deze verzameling dan een
  gewone vitrine, zonder dat verder uit te leggen (het "museum" wordt pas
  veel later in het verhaal echt onthuld).
- Eén extra accentkleur, afhankelijk van welke taallijn het voorwerp
  toebehoort — ik geef die kleur telkens apart aan per voorwerp:
  - **Aegeïsch blauw**: een dunne gloed/rand op het glas van de stolp, voor
    voorwerpen uit een Griekse verteltraditie.
  - **Oxblood (donker bloedrood)**: dezelfde dunne gloed/rand, voor
    voorwerpen uit een Romeinse/Latijnse verteltraditie.

### Historische zorgvuldigheid
- Het voorwerp zelf moet passen bij de oudheid: geen anachronismen, geen
  moderne vormen, materialen of bewerkingen.

### Harde regels (nooit doen)
- Geen tekst, letters, bijschriften, logo's, handtekeningen of watermerken.
- Geen mensen, gezichten of handen in beeld.
- Geen modern ogend glas/plexiglas — het moet aanvoelen als oud, licht
  onregelmatig handgemaakt glas, passend bij een antiek museumstuk.

### Formaat
- **Vierkant (1:1)**, hoge resolutie, vult het hele kader (geen witte rand,
  geen passe-partout). Dit wijkt bewust af van de liggende 16:9-scène-
  illustraties elders in het spel — deze beelden verschijnen als kleine
  tegels naast elkaar in een rooster.

---

## Promptsjabloon (per voorwerp)

> Square (1:1) comic/graphic-novel style illustration, in the established
> Chronica Classica house style (bold clean ink, cel shading, warm stone
> palette with gold light accents). A single small museum-style display:
> **«beschrijf het voorwerp»**, resting «on a small weathered stone
> pedestal» / «on a small dark-red velvet cushion atop a small weathered
> stone pedestal», entirely covered by an old glass bell jar/dome, faintly
> and softly gold-lit from within as if quietly magical. Camera at eye level
> with the pedestal, three-quarter lighting, background dark and blurred
> (heavy vignette), the object in sharp focus. A thin **«Aegean blue» /
> «oxblood dark red»** glow glints faintly on the glass. No text, no speech
> bubbles, no watermark, no modern objects, no people, no hands, no faces.
> 1:1 square format, fills the entire frame.

---

## Klaar-om-te-plakken prompts voor de 11 bestaande voorwerpen

Bestandsnamen zoals verwacht door `SP_SOUVENIRS` (singleplayer-data.js) —
zet elk resultaat onder die naam in `certamen/assets/chronica/souvenirs/`.

### 1. `souvenir_midas.png` — Een Gouden Roos (Hoofdstuk 1, lijn A — oxblood)
> Square (1:1) comic/graphic-novel style illustration, in the established
> Chronica Classica house style (bold clean ink, cel shading, warm stone
> palette with gold light accents). A single small museum-style display: a
> single rose entirely transformed to solid gold, petals still delicately
> detailed and slightly curled, resting on a small dark-red velvet cushion
> atop a small weathered stone pedestal, entirely covered by an old glass
> bell jar/dome, faintly and softly gold-lit from within as if quietly
> magical. Camera at eye level with the pedestal, three-quarter lighting,
> background dark and blurred (heavy vignette), the object in sharp focus. A
> thin oxblood dark-red glow glints faintly on the glass. No text, no speech
> bubbles, no watermark, no modern objects, no people, no hands, no faces.
> 1:1 square format, fills the entire frame.

### 2. `souvenir_athena_geboorte.png` — Een Bronzen Splinter (Hoofdstuk 1, lijn B — Aegean blue)
> Square (1:1) comic/graphic-novel style illustration, in the established
> Chronica Classica house style (bold clean ink, cel shading, warm stone
> palette with gold light accents). A single small museum-style display: a
> small jagged splinter of ancient bronze, dark green-bronze patina with one
> bright freshly-broken edge catching the light, resting on a small
> dark-red velvet cushion atop a small weathered stone pedestal, entirely
> covered by an old glass bell jar/dome, faintly and softly gold-lit from
> within as if quietly magical. Camera at eye level with the pedestal,
> three-quarter lighting, background dark and blurred (heavy vignette), the
> object in sharp focus. A thin Aegean-blue glow glints faintly on the
> glass. No text, no speech bubbles, no watermark, no modern objects, no
> people, no hands, no faces. 1:1 square format, fills the entire frame.

### 3. `souvenir_prometheus.png` — Een Nooit Dovend Kooltje (Hoofdstuk 1, lijn C — Aegean blue)
> Square (1:1) comic/graphic-novel style illustration, in the established
> Chronica Classica house style (bold clean ink, cel shading, warm stone
> palette with gold light accents). A single small museum-style display: a
> single small glowing ember/coal, faint warm orange-red light pulsing
> softly from within it as if it has never gone out, resting on a small
> dark-red velvet cushion atop a small weathered stone pedestal, entirely
> covered by an old glass bell jar/dome. Camera at eye level with the
> pedestal, three-quarter lighting, background dark and blurred (heavy
> vignette), the object in sharp focus, its ember-glow the brightest point
> in the frame. A thin Aegean-blue glow glints faintly on the glass. No
> text, no speech bubbles, no watermark, no modern objects, no people, no
> hands, no faces. 1:1 square format, fills the entire frame.

### 4. `souvenir_latona.png` — Een Waterlelie (Hoofdstuk 2, lijn L — oxblood)
> Square (1:1) comic/graphic-novel style illustration, in the established
> Chronica Classica house style (bold clean ink, cel shading, warm stone
> palette with gold light accents). A single small museum-style display: a
> single white water lily flower with one wet, glistening lily-pad leaf,
> resting on a small dark-red velvet cushion atop a small weathered stone
> pedestal, entirely covered by an old glass bell jar/dome, faintly and
> softly gold-lit from within as if quietly magical. Camera at eye level
> with the pedestal, three-quarter lighting, background dark and blurred
> (heavy vignette), the object in sharp focus. A thin oxblood dark-red glow
> glints faintly on the glass. No text, no speech bubbles, no watermark, no
> modern objects, no people, no hands, no faces. 1:1 square format, fills
> the entire frame.

### 5. `souvenir_semele.png` — Een Wijnrank die Nooit Verwelkt (Hoofdstuk 2, lijn S — oxblood)
> Square (1:1) comic/graphic-novel style illustration, in the established
> Chronica Classica house style (bold clean ink, cel shading, warm stone
> palette with gold light accents). A single small museum-style display: a
> short coiled sprig of grapevine, still vividly green and alive-looking
> with a few small grape clusters and leaves, resting on a small dark-red
> velvet cushion atop a small weathered stone pedestal, entirely covered by
> an old glass bell jar/dome, faintly and softly gold-lit from within as if
> quietly magical. Camera at eye level with the pedestal, three-quarter
> lighting, background dark and blurred (heavy vignette), the object in
> sharp focus. A thin oxblood dark-red glow glints faintly on the glass. No
> text, no speech bubbles, no watermark, no modern objects, no people, no
> hands, no faces. 1:1 square format, fills the entire frame.

### 6. `souvenir_kallisto.png` — Een Zilverglanzende Haarlok (Hoofdstuk 2, lijn K — Aegean blue)
> Square (1:1) comic/graphic-novel style illustration, in the established
> Chronica Classica house style (bold clean ink, cel shading, warm stone
> palette with gold light accents). A single small museum-style display: a
> small tuft/lock of thick bear fur, dark brown but faintly shimmering
> silvery, as though catching starlight, resting on a small dark-red velvet
> cushion atop a small weathered stone pedestal, entirely covered by an old
> glass bell jar/dome. Camera at eye level with the pedestal, three-quarter
> lighting, background dark and blurred (heavy vignette), the object in
> sharp focus. A thin Aegean-blue glow glints faintly on the glass. No text,
> no speech bubbles, no watermark, no modern objects, no people, no hands,
> no faces. 1:1 square format, fills the entire frame.

### 7. `souvenir_herakles_leeuw.png` — Een Klauw van de Nemeïsche Leeuw (Hoofdstuk 2, lijn H — Aegean blue)
> Square (1:1) comic/graphic-novel style illustration, in the established
> Chronica Classica house style (bold clean ink, cel shading, warm stone
> palette with gold light accents). A single small museum-style display: a
> single large curved lion's claw, pale ivory-bone colour, resting directly
> on a small weathered stone pedestal (no cushion — a sturdy object),
> entirely covered by an old glass bell jar/dome, faintly and softly
> gold-lit from within as if quietly magical. Camera at eye level with the
> pedestal, three-quarter lighting, background dark and blurred (heavy
> vignette), the object in sharp focus. A thin Aegean-blue glow glints
> faintly on the glass. No text, no speech bubbles, no watermark, no modern
> objects, no people, no hands, no faces. 1:1 square format, fills the
> entire frame.

### 8. `souvenir_io.png` — Een Pauwenveer met een Oog (Hoofdstuk 3, lijn Io — oxblood)
> Square (1:1) comic/graphic-novel style illustration, in the established
> Chronica Classica house style (bold clean ink, cel shading, warm stone
> palette with gold light accents). A single small museum-style display: a
> single iridescent peacock tail feather with one clear eye-shaped marking,
> deep blue-green with gold highlights, resting on a small dark-red velvet
> cushion atop a small weathered stone pedestal, entirely covered by an old
> glass bell jar/dome, faintly and softly gold-lit from within as if quietly
> magical. Camera at eye level with the pedestal, three-quarter lighting,
> background dark and blurred (heavy vignette), the object in sharp focus. A
> thin oxblood dark-red glow glints faintly on the glass. No text, no speech
> bubbles, no watermark, no modern objects, no people, no hands, no faces.
> 1:1 square format, fills the entire frame.

### 9. `souvenir_herakles_labores.png` — Een Gouden Appel van de Hesperiden (Hoofdstuk 3, lijn Herakles — Aegean blue)
> Square (1:1) comic/graphic-novel style illustration, in the established
> Chronica Classica house style (bold clean ink, cel shading, warm stone
> palette with gold light accents). A single small museum-style display: a
> single round apple made of gleaming solid gold, resting directly on a
> small weathered stone pedestal (no cushion — a sturdy object), entirely
> covered by an old glass bell jar/dome, faintly and softly gold-lit from
> within as if quietly magical. Camera at eye level with the pedestal,
> three-quarter lighting, background dark and blurred (heavy vignette), the
> object in sharp focus. A thin Aegean-blue glow glints faintly on the
> glass. No text, no speech bubbles, no watermark, no modern objects, no
> people, no hands, no faces. 1:1 square format, fills the entire frame.

### 10. `souvenir_theseus.png` — Een Restje van Ariadne's Garen (Hoofdstuk 4, lijn Theseus — Aegean blue)
> Square (1:1) comic/graphic-novel style illustration, in the established
> Chronica Classica house style (bold clean ink, cel shading, warm stone
> palette with gold light accents). A single small museum-style display: a
> short, loosely coiled scrap of plain woven thread/yarn, resting on a small
> dark-red velvet cushion atop a small weathered stone pedestal, entirely
> covered by an old glass bell jar/dome, faintly and softly gold-lit from
> within as if quietly magical. Camera at eye level with the pedestal,
> three-quarter lighting, background dark and blurred (heavy vignette), the
> object in sharp focus. A thin Aegean-blue glow glints faintly on the
> glass. No text, no speech bubbles, no watermark, no modern objects, no
> people, no hands, no faces. 1:1 square format, fills the entire frame.

### 11. `souvenir_phaethon.png` — Een Druppel Amber (Hoofdstuk 4, lijn Phaëthon — oxblood)
> Square (1:1) comic/graphic-novel style illustration, in the established
> Chronica Classica house style (bold clean ink, cel shading, warm stone
> palette with gold light accents). A single small museum-style display: a
> single teardrop-shaped piece of warm honey-orange amber, translucent and
> glossy, resting on a small dark-red velvet cushion atop a small weathered
> stone pedestal, entirely covered by an old glass bell jar/dome, faintly
> and softly gold-lit from within as if quietly magical. Camera at eye level
> with the pedestal, three-quarter lighting, background dark and blurred
> (heavy vignette), the object in sharp focus. A thin oxblood dark-red glow
> glints faintly on the glass. No text, no speech bubbles, no watermark, no
> modern objects, no people, no hands, no faces. 1:1 square format, fills
> the entire frame.
