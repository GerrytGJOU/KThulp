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

## Placeholders: lege en gebroken stolp (museum in verval)

Sinds 2026-08-18 toont de Herinneringen/Museum-tab, zodra het museum
ontgrendeld is (`museum_mnemosyne_ontgrendeld`), ook een generieke
placeholder-tegel voor élk souvenir dat de speler nog niet heeft gevonden —
zichtbaar verval dat zich vult naarmate de speler verder speelt (Gerbens
verzoek). VIER vaste bestanden, wisselend per voorwerp-id (geen 1-op-1 match
met een specifiek souvenir — bewust anoniem, zodat er niets verklapt wordt
over wélk voorwerp of welke verhaallijn er nog ontbreekt) — vier in plaats
van twee voor visuele variatie in het rooster (Gerbens verzoek, 2026-08-18):
- `museum_leeg.png` — een lege sokkel.
- `museum_gebroken.png` — een gebroken/gebarsten stolp.
- `museum_omgevallen.png` — een omgevallen sokkel.
- `museum_verweerd.png` — een verweerde, overwoekerde sokkel.

Zelfde vaste compositie en huisstijl als hierboven (sokkel/stolp, inkt +
cel-shading, warm steenpalet), maar bewust SOMBERDER en zonder de gouden
gloed — dit zijn de "kapotte" tegels, geen tentoongestelde stukken. Geen
accentkleur (geen Aegeïsch blauw of oxblood) — verval hoort bij geen van
beide taalsporen.

### `museum_leeg.png` — Een Lege Sokkel
> Square (1:1) comic/graphic-novel style illustration, in the established
> Chronica Classica house style (bold clean ink, cel shading, warm stone
> palette), but deliberately dim and melancholic — no golden glow. A single
> small museum-style display: an empty weathered stone pedestal with a small
> dark-red velvet cushion on top, bare and undented, entirely covered by an
> old glass bell jar/dome — the jar is empty, nothing rests on the cushion.
> A faint layer of dust is visible on the cushion and the inside of the
> glass. Camera at eye level with the pedestal, three-quarter lighting,
> background dark and blurred (heavy vignette). No glow, no colour accent on
> the glass. No text, no speech bubbles, no watermark, no modern objects, no
> people, no hands, no faces. 1:1 square format, fills the entire frame.

### `museum_gebroken.png` — Een Gebroken Stolp
> Square (1:1) comic/graphic-novel style illustration, in the established
> Chronica Classica house style (bold clean ink, cel shading, warm stone
> palette), but deliberately dim and melancholic — no golden glow. A single
> small museum-style display: a weathered stone pedestal with a small
> dark-red velvet cushion on top, empty and slightly frayed, its glass bell
> jar/dome visibly cracked and broken — a jagged shard missing from one side,
> a few small glass fragments resting on the cushion beside a thin layer of
> dust. Camera at eye level with the pedestal, three-quarter lighting,
> background dark and blurred (heavy vignette). No glow, no colour accent on
> the glass. No text, no speech bubbles, no watermark, no modern objects, no
> people, no hands, no faces. 1:1 square format, fills the entire frame.

### `museum_omgevallen.png` — Een Omgevallen Sokkel
> Square (1:1) comic/graphic-novel style illustration, in the established
> Chronica Classica house style (bold clean ink, cel shading, warm stone
> palette), but deliberately dim and melancholic — no golden glow. A single
> small museum-style display gone wrong: a weathered stone pedestal has
> toppled onto its side, its small dark-red velvet cushion fallen off and
> lying empty on the floor beside it, and its glass bell jar/dome lying
> nearby, cracked but mostly intact, clearly having rolled a short distance
> away from the pedestal. Nothing rests on the cushion — whatever it once
> held is gone. Camera at eye level with the fallen pedestal, three-quarter
> lighting, background dark and blurred (heavy vignette). No glow, no colour
> accent on the glass. No text, no speech bubbles, no watermark, no modern
> objects, no people, no hands, no faces. 1:1 square format, fills the
> entire frame.

### `museum_verweerd.png` — Een Verweerde, Overwoekerde Sokkel
> Square (1:1) comic/graphic-novel style illustration, in the established
> Chronica Classica house style (bold clean ink, cel shading, warm stone
> palette), but deliberately dim and melancholic — no golden glow. A single
> small museum-style display, long neglected: a weathered stone pedestal
> with a small dark-red velvet cushion on top, the cushion faded and
> moth-eaten, its glass bell jar/dome intact but heavily fogged with grime
> and dust on the inside so the empty interior is barely visible, thin
> tendrils of pale ivy or cobweb creeping up one side of the pedestal and
> across a corner of the glass. Camera at eye level with the pedestal,
> three-quarter lighting, background dark and blurred (heavy vignette). No
> glow, no colour accent on the glass. No text, no speech bubbles, no
> watermark, no modern objects, no people, no hands, no faces. 1:1 square
> format, fills the entire frame.

---

## Klaar-om-te-plakken prompts voor de 20 bestaande voorwerpen

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

### 12. `souvenir_argonauten.png` — Een Schilfer van het Gulden Vlies (Hoofdstuk 5 — Aegean blue)
> Square (1:1) comic/graphic-novel style illustration, in the established
> Chronica Classica house style (bold clean ink, cel shading, warm stone
> palette with gold light accents). A single small museum-style display: a
> small flat scale/flake of gleaming golden fleece — a tiny tuft of curled
> wool rendered as solid gold, glinting — resting on a small dark-red velvet
> cushion atop a small weathered stone pedestal, entirely covered by an old
> glass bell jar/dome, faintly and softly gold-lit from within as if quietly
> magical. Camera at eye level with the pedestal, three-quarter lighting,
> background dark and blurred (heavy vignette), the object in sharp focus. A
> thin Aegean-blue glow glints faintly on the glass. No text, no speech
> bubbles, no watermark, no modern objects, no people, no hands, no faces.
> 1:1 square format, fills the entire frame.

### 13. `souvenir_thebe.png` — Een Verstenen Traan (Hoofdstuk 6 — Aegean blue)
> Square (1:1) comic/graphic-novel style illustration, in the established
> Chronica Classica house style (bold clean ink, cel shading, warm stone
> palette with gold light accents). A single small museum-style display: a
> single small teardrop-shaped droplet of pale grey stone/rock, its surface
> glistening faintly as if still wet despite being solid stone, resting on a
> small dark-red velvet cushion atop a small weathered stone pedestal,
> entirely covered by an old glass bell jar/dome, faintly and softly
> gold-lit from within as if quietly magical. Camera at eye level with the
> pedestal, three-quarter lighting, background dark and blurred (heavy
> vignette), the object in sharp focus. A thin Aegean-blue glow glints
> faintly on the glass. No text, no speech bubbles, no watermark, no modern
> objects, no people, no hands, no faces. 1:1 square format, fills the
> entire frame.

### 14. `souvenir_appel_tweedracht.png` — De Appel der Tweedracht (Hoofdstuk 7 — Aegean blue)
> **Bewuste uitzondering op de "geen tekst"-regel hierboven**: dit voorwerp
> is mythologisch alleen herkenbaar mét zijn inscriptie (τῇ καλλίστῃ, "aan
> de mooiste" — zie ook de datief-puzzel bij CH7_005 in
> `singleplayer-data.js`). Epigrafische hoofdletters, geen moderne
> letterstijl. Gemini rendert niet-Latijns schrift niet altijd foutloos —
> reken op een paar pogingen.
>
> Square (1:1) comic/graphic-novel style illustration, in the established
> Chronica Classica house style (bold clean ink, cel shading, warm stone
> palette with gold light accents). A single small museum-style display: a
> single round apple made of gleaming solid gold, with the ancient Greek
> inscription "ΤΗΙ ΚΑΛΛΙΣΤΗΙ" ("for the fairest") carved in worn, weathered
> epigraphic capital letters near its widest point, the lettering shallow
> and archaic as if engraved long ago, resting directly on a small
> weathered stone pedestal (no cushion — a sturdy object), entirely
> covered by an old glass bell jar/dome, faintly and softly gold-lit from
> within as if quietly magical. Camera at eye level with the pedestal,
> three-quarter lighting, background dark and blurred (heavy vignette),
> the object in sharp focus, the engraved letters legible but weathered. A
> thin Aegean-blue glow glints faintly on the glass. No speech bubbles, no
> logos, no watermark, no modern objects, no people, no hands, no faces.
> 1:1 square format, fills the entire frame.

### 15. `souvenir_schild_achilles.png` — Een Schilfer van het Schild van Achilles (Hoofdstuk 8 — Aegean blue)
> Square (1:1) comic/graphic-novel style illustration, in the established
> Chronica Classica house style (bold clean ink, cel shading, warm stone
> palette with gold light accents). A single small museum-style display: a
> small broken-off fragment of ornately worked bronze, its curved edge
> suggesting it once belonged to something much larger, with a tiny,
> barely-visible fragment of a finely etched dancing figure still
> discernible on its surface, resting on a small dark-red velvet cushion
> atop a small weathered stone pedestal, entirely covered by an old glass
> bell jar/dome, faintly and softly gold-lit from within as if quietly
> magical. Camera at eye level with the pedestal, three-quarter lighting,
> background dark and blurred (heavy vignette), the object in sharp focus. A
> thin Aegean-blue glow glints faintly on the glass. No text, no speech
> bubbles, no watermark, no modern objects, no people, no hands, no faces.
> 1:1 square format, fills the entire frame.

### 16. `souvenir_trojaans_paard.png` — Een Splinter van het Trojaanse Paard (Hoofdstuk 9 — Aegean blue)
> Square (1:1) comic/graphic-novel style illustration, in the established
> Chronica Classica house style (bold clean ink, cel shading, warm stone
> palette with gold light accents). A single small museum-style display: a
> small splinter of charred, blackened wood, its grain still faintly
> visible beneath the char, one edge still showing a hint of pale
> untouched timber, resting on a small dark-red velvet cushion atop a
> small weathered stone pedestal, entirely covered by an old glass bell
> jar/dome, faintly and softly gold-lit from within as if quietly magical.
> Camera at eye level with the pedestal, three-quarter lighting,
> background dark and blurred (heavy vignette), the object in sharp focus.
> A thin Aegean-blue glow glints faintly on the glass. No text, no speech
> bubbles, no watermark, no modern objects, no people, no hands, no faces.
> 1:1 square format, fills the entire frame.

### 17. `souvenir_twee_zeeen.png` — Een Fles Water uit Twee Zeeën (Hoofdstuk 10 — beide talen)
> Square (1:1) comic/graphic-novel style illustration, in the established
> Chronica Classica house style (bold clean ink, cel shading, warm stone
> palette with gold light accents). A single small museum-style display: a
> small old glass vial/bottle filled with seawater that never seems to
> evaporate, faint tiny bubbles suspended motionless inside, resting on a
> small dark-red velvet cushion atop a small weathered stone pedestal,
> entirely covered by an old glass bell jar/dome, faintly and softly
> gold-lit from within as if quietly magical. Camera at eye level with the
> pedestal, three-quarter lighting, background dark and blurred (heavy
> vignette), the object in sharp focus. This souvenir belongs to both
> storylines at once — the glow on the glass is a soft blend of Aegean blue
> and oxblood dark red intertwining, neither colour dominant. No text, no
> speech bubbles, no watermark, no modern objects, no people, no hands, no
> faces. 1:1 square format, fills the entire frame.

### 18. `souvenir_twee_deuren.png` — Een Buidel Aarde en As (Hoofdstuk 11 — beide talen)
> Square (1:1) comic/graphic-novel style illustration, in the established
> Chronica Classica house style (bold clean ink, cel shading, warm stone
> palette with gold light accents). A single small museum-style display: a
> small drawstring pouch made of worn leather, loosely closed, with a faint
> wisp of pale ash and dark earth visible spilling slightly from its
> half-open top, resting directly on a small weathered stone pedestal (no
> cushion — a sturdy object), entirely covered by an old glass bell
> jar/dome, faintly and softly gold-lit from within as if quietly magical.
> Camera at eye level with the pedestal, three-quarter lighting, background
> dark and blurred (heavy vignette), the object in sharp focus. This
> souvenir belongs to both storylines at once — the glow on the glass is a
> soft blend of Aegean blue and oxblood dark red intertwining, neither
> colour dominant. No text, no speech bubbles, no watermark, no modern
> objects, no people, no hands, no faces. 1:1 square format, fills the
> entire frame.

### 19. `souvenir_ara_maxima.png` — Een Steen van het Ara Maxima (Hoofdstuk 12, Latijnse lijn — oxblood)
> Square (1:1) comic/graphic-novel style illustration, in the established
> Chronica Classica house style (bold clean ink, cel shading, warm stone
> palette with gold light accents). A single small museum-style display: a
> rough fragment of ancient altar stone, one weathered face still bearing a
> trace of carved tooling marks, resting directly on a small weathered
> stone pedestal (no cushion — a sturdy object), entirely covered by an old
> glass bell jar/dome, faintly and softly gold-lit from within as if quietly
> magical. Camera at eye level with the pedestal, three-quarter lighting,
> background dark and blurred (heavy vignette), the object in sharp focus. A
> thin oxblood dark-red glow glints faintly on the glass. No text, no speech
> bubbles, no watermark, no modern objects, no people, no hands, no faces.
> 1:1 square format, fills the entire frame.

### 20. `souvenir_athena_helm.png` — Een Twijgje van de Eerste Olijfboom (Hoofdstuk 13, Griekse lijn — Aegean blue)
> Square (1:1) comic/graphic-novel style illustration, in the established
> Chronica Classica house style (bold clean ink, cel shading, warm stone
> palette with gold light accents). A single small museum-style display: a
> small dried, slightly curled olive twig with two or three shriveled
> silvery-green leaves still attached, resting on a small dark-red velvet
> cushion atop a small weathered stone pedestal, entirely covered by an old
> glass bell jar/dome, faintly and softly gold-lit from within as if quietly
> magical. Camera at eye level with the pedestal, three-quarter lighting,
> background dark and blurred (heavy vignette), the object in sharp focus. A
> thin Aegean-blue glow glints faintly on the glass. No text, no speech
> bubbles, no watermark, no modern objects, no people, no hands, no faces.
> 1:1 square format, fills the entire frame.

### 21. `souvenir_onder_de_vulkaan.png` — Verstarde Puimsteen en een Bronzen Driehoek (Hoofdstuk 25 — beide talen)
> Square (1:1) comic/graphic-novel style illustration, in the established
> Chronica Classica house style (bold clean ink, cel shading, warm stone
> palette with gold light accents). A single small museum-style display: two
> small objects placed side by side — a small porous, irregularly-shaped
> lump of pale grey solidified pumice stone, and a tiny bronze model of an
> equilateral triangle resting flat beside it — both resting directly on a
> small weathered stone pedestal (no cushion — sturdy objects), entirely
> covered by an old glass bell jar/dome, faintly and softly gold-lit from
> within as if quietly magical. Camera at eye level with the pedestal,
> three-quarter lighting, background dark and blurred (heavy vignette), both
> objects in sharp focus. This souvenir belongs to both storylines at once —
> the glow on the glass is a soft blend of Aegean blue and oxblood dark red
> intertwining, neither colour dominant. No text, no speech bubbles, no
> watermark, no modern objects, no people, no hands, no faces. 1:1 square
> format, fills the entire frame.


## Resterende souvenirs (audit 2026-08-21)

Vier souvenirs uit `SP_SOUVENIRS` (singleplayer-data.js) hadden nog geen
bestand op schijf — de rest van de campagne (proloog t/m Finale) is compleet.

### 22. `souvenir_bondgenoten_verscheurd.png` — Een Gebroken Lans en een Senaatsdolk (Hoofdstuk 19 — beide talen)
> Square (1:1) comic/graphic-novel style illustration, in the established
> Chronica Classica house style (bold clean ink, cel shading, warm stone
> palette with gold light accents). A single small museum-style display: two
> small objects placed side by side — a bronze spearhead, snapped cleanly in
> two, its broken edges facing each other, and a small, unused ceremonial
> dagger with a plain hilt — both resting directly on a small weathered
> stone pedestal (no cushion — sturdy objects), entirely covered by an old
> glass bell jar/dome, faintly and softly gold-lit from within as if quietly
> magical. Camera at eye level with the pedestal, three-quarter lighting,
> background dark and blurred (heavy vignette), both objects in sharp focus.
> This souvenir belongs to both storylines at once — the glow on the glass
> is a soft blend of Aegean blue and oxblood dark red intertwining, neither
> colour dominant. No text, no speech bubbles, no watermark, no modern
> objects, no people, no hands, no faces. 1:1 square format, fills the
> entire frame.

### 23. `souvenir_rijk_in_crisis.png` — Een Stukje Amfitheater-Marmer en een Verweerde Muntenrand (Hoofdstuk 26 — oxblood)
> Square (1:1) comic/graphic-novel style illustration, in the established
> Chronica Classica house style (bold clean ink, cel shading, warm stone
> palette with gold light accents). A single small museum-style display: two
> small objects placed side by side — a small chipped fragment of gleaming
> white marble with one smoothly curved edge (as if broken from a
> monumental arched structure), and a small, bent and heavily worn coin rim
> with no legible face, resting directly on a small weathered stone
> pedestal (no cushion — sturdy objects), entirely covered by an old glass
> bell jar/dome, faintly and softly gold-lit from within as if quietly
> magical. Camera at eye level with the pedestal, three-quarter lighting,
> background dark and blurred (heavy vignette), both objects in sharp
> focus. A thin oxblood dark-red glow glints faintly on the glass. No text,
> no speech bubbles, no watermark, no modern objects, no people, no hands,
> no faces. 1:1 square format, fills the entire frame.

### 24. `souvenir_bibliotheek_mnemosyne.png` — Een Glazen Potje met Rook en een Spiegelfragment (Hoofdstuk 28 — beide talen)
> Square (1:1) comic/graphic-novel style illustration, in the established
> Chronica Classica house style (bold clean ink, cel shading, warm stone
> palette with gold light accents). A single small museum-style display: two
> small objects placed side by side — a small old glass jar containing a
> faint wisp of slowly swirling smoke, and a tiny fragment of silvered
> mirror glass propped upright beside it, catching a faint reflection of the
> golden glow around it — both resting on a small dark-red velvet cushion
> atop a small weathered stone pedestal, entirely covered by an old glass
> bell jar/dome, faintly and softly gold-lit from within as if quietly
> magical. Camera at eye level with the pedestal, three-quarter lighting,
> background dark and blurred (heavy vignette), both objects in sharp
> focus. This souvenir belongs to both storylines at once — the glow on the
> outer glass is a soft blend of Aegean blue and oxblood dark red
> intertwining, neither colour dominant. No text, no speech bubbles, no
> watermark, no modern objects, no people, no hands, no faces. 1:1 square
> format, fills the entire frame.

### 25. `souvenir_rivier_lethe.png` — Een Leeg Flesje en een Lier-snaar (Hoofdstuk 29 — koud grijs, geen accentkleur)
> Square (1:1) comic/graphic-novel style illustration, in the established
> Chronica Classica house style (bold clean ink, cel shading, warm stone
> palette), but deliberately without the usual warm golden glow — this
> souvenir belongs to Lethe, goddess of forgetting, not to Mnemosyne's
> collection of what was kept. A single small museum-style display: two
> small objects placed side by side — a small, completely empty glass vial
> with its stopper beside it, and a single weathered, slightly frayed lyre
> string coiled loosely next to it — both resting on a small dark-red
> velvet cushion atop a small weathered stone pedestal, entirely covered by
> an old glass bell jar/dome. Camera at eye level with the pedestal,
> three-quarter lighting, background dark and blurred (heavy vignette), both
> objects in sharp focus. Instead of a gold glow, a faint, cold pale-silver/
> grey light glints on the glass — no Aegean blue, no oxblood, this souvenir
> belongs to neither language track. No text, no speech bubbles, no
> watermark, no modern objects, no people, no hands, no faces. 1:1 square
> format, fills the entire frame.
