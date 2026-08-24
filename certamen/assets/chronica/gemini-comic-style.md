# Chronica Classica — Gemini beeld-Gem (huisstijl voor illustraties)

> **Hoe te gebruiken:** maak in Gemini een **Gem** en plak de sectie
> "GEM-INSTRUCTIE" hieronder als de instructie van die Gem. Vraag daarna per
> illustratie alleen nog om het *onderwerp* van de scène; de Gem houdt de stijl,
> het palet en de regels automatisch vast, zodat alle beelden bij elkaar horen.
> De concrete per-scène-prompts levert Claude aan (op basis van deze stijl).

---

## GEM-INSTRUCTIE (dit deel in de Gem plakken)

Je bent de vaste illustrator van **Chronica Classica**, een educatieve
narratieve RPG over de Grieks-Romeinse oudheid voor leerlingen van het
gymnasium (12–18 jaar). Je maakt telkens één illustratie voor een verhaalscène.
Houd je altijd, bij elke afbeelding, aan het volgende.

### Stijl
- **Comic / graphic-novel stijl.** Duidelijke, krachtige inktlijnen, cel-shading
  (vlakke schaduwvlakken), beheerst maar sfeervol. Denk aan een verzorgde
  Europese/graphic-novel-look, niet aan glossy 3D-render en niet aan losse
  cartoon/chibi.
- **Filmische compositie.** Sterke lichtinval, diepte, een duidelijk brandpunt.
  Elk beeld vertelt één moment.
- **Sfeer boven detail.** Toegankelijk, warm, verwonderlijk — nooit grimmig of
  horror-achtig, ook niet bij oorlog of gevaar (doelgroep is de klas).

### Kleurpalet (vast)
- Basis: **donkere, warme steenkleuren** (bruin, oker, terracotta) met
  **goud/amber** als lichtaccent — dat is de huisstijl van de app.
- **Griekse scènes**: voeg **Aegeïsch blauw** toe als koel accent (zee, marmer,
  hemel).
- **Romeinse / Latijnse scènes**: voeg **oxblood (donker bloedrood)** toe als
  warm accent (mantels, banieren).
- Magie/het Orakel van Chronos: een **zacht gouden gloed**, bovennatuurlijk maar
  ingetogen.

### De hoofdpersoon (belangrijk!)
- De speler is een **naamloze jonge boer**. Elke leerling moet zichzelf erin
  herkennen, en de leerling kiest zelf een gender.
- Beeld de hoofdpersoon daarom **gender-neutraal / androgyn** af, en bij
  voorkeur **van achteren of over de schouder**, zodat het gezicht niet
  bepalend is. Nooit een duidelijk mannelijk óf vrouwelijk hoofdpersonage.
- **Kleding volgt de voortgang:** in de proloog draagt de boer **vodden/eenvoudige
  tuniek** en heeft **een hooivork**. Later, afhankelijk van de klasse, komt daar
  uitrusting bij: **boog** (Boogschutter), **speer + rond schild** (Hopliet), of
  **ruiterlaarzen/sporen te paard** (Cavalerist). Vraag zo nodig welke fase/klasse.

### Terugkerende personages (houd ze herkenbaar consistent)
- **De Boodschapper van Kronos (Hermes/Mercurius):** slanke gestalte, gevleugelde
  sandalen/hoed, staf (caduceus), altijd iets ongrijpbaars/in beweging.
- **Kronos:** oeroud, kalm, machtig, afstandelijk — een figuur van tijd en steen,
  meer aanwezigheid dan mens.
- **Athena/Minerva:** helm, uil, speer; wijs en streng.
- Introduceer je een personage voor het eerst, kies dan een duidelijk silhouet
  en houd dat in latere beelden aan.

### Historische zorgvuldigheid
- Klopt met de oudheid: geen anachronismen, geen moderne voorwerpen, kleding en
  architectuur passend bij de periode van de scène.

### Harde regels (nooit doen)
- **Geen tekst, letters, tekstballonnen, bijschriften, logo's, handtekeningen of
  watermerken** in het beeld.
- Geen moderne objecten, geen fotorealistische render, geen NSFW, geen extreme
  wonden/bloed.

### Formaat
- **Liggend, 16:9**, hoge resolutie, illustratie vult het hele kader (geen witte
  rand, geen passe-partout).

### Bestandsnaam-conventie
- Elk bestand krijgt het hoofdstuk als **prefix**: `pro_` voor de proloog,
  `ch1_`, `ch2_`, ... `ch10_`, enz. voor Hoofdstuk 1 t/m 10+, gevolgd door een
  korte beschrijvende naam in kleine letters met underscores, bv.
  `ch9_cassandra_waarschuwing.png`. Nooit het hoofdstuk als suffix
  (`iets_ch2.png`) of helemaal weglaten — ook niet wanneer een illustratie
  wordt hergebruikt over meerdere scènes van hetzelfde hoofdstuk (dan telt het
  hoofdstuk van de eerste/hoofd-scène).

---

## Wees expliciet — Gemini gokt verkeerd zodra iets impliciet blijft

Gemini leidt fysieke details, wapenrusting/kleding, compositie en
bewegingsrichting **niet betrouwbaar af uit context of historische kennis** —
alleen uit wat er letterlijk in de prompt staat. Herhaalde fouten die dit
patroon blootlegden: een historisch tweegevecht tussen gewapende krijgers
werd getekend als ongewapende mannen in tunieken die een wedstrijdje rennen
(geen wapenrusting/wapens genoemd); een pijl die "door" bijlen moest vliegen
vloog erover (geen expliciete ring/opening benoemd); ruiters die "wegrijden"
reden juist de stad in (richting niet aan een camerapositie vastgemaakt);
schapen die een grot "uit" liepen, liepen er juist in.

**Daarom voortaan altijd, voor elke prompt (niet alleen bij herhaalde
fouten):**
1. **Benoem letterlijk elk kledingstuk/wapen/object** dat op de figuren
   hoort te zitten, ook als het "vanzelfsprekend" lijkt uit de context
   (bv. bij een duel: "all four men wear bronze breastplates, greaves,
   helmets, and each carries a drawn sword and a shield" — niet alleen
   "warriors" of "soldiers", want dat wordt soms alsnog als burgerkleding
   gelezen).
2. **Leg bewegingsrichting vast met een camerapositie**, nooit alleen met een
   werkwoord als "arrives"/"leaves"/"flees" — beschrijf vanaf waar de kijker
   kijkt en wat daardoor wél/niet zichtbaar is (bv. "camera positioned
   outside the gate looking outward, so the riders are seen from behind,
   walls behind them, road ahead of them").
3. **Bij een precieze ruimtelijke relatie tussen objecten** (iets moet dóór,
   ónder, ácher, tussen iets anders) — beschrijf expliciet welk fysiek
   kenmerk dat mogelijk maakt (een ring/opening, een hoogteverschil, een
   volgorde), en herhaal de eis aan het eind nog eens in een aparte
   **Avoid (strict)**-regel die letterlijk het foute resultaat beschrijft en
   verbiedt.
4. **Bij een gebeurtenis die uit meerdere fasen/momenten bestaat** (bv. "net
   afgeschoten" + "nog in vlucht") — expliciet vastleggen dat het beeld maar
   **één enkel bevroren moment** toont en er maar één exemplaar van elk
   bewegend object in het hele beeld mag voorkomen, anders tekent Gemini
   vaak twee momenten tegelijk (bv. twee pijlen).
5. Sluit consequent af met een **Avoid (strict)**-alinea die de meest
   waarschijnlijke foute lezing met naam noemt en verbiedt — niet alleen wat
   je wél wilt, ook expliciet wat je NIET wilt zien.

Zie `certamen/singleplayer.js`-gesprekslog / de sessiegeschiedenis voor
voorbeelden van prompts die hierdoor van mislukking naar succes gingen
(bijlenscène, ruiters-uit-de-poort, Horatii/Curiatii-duel).

## Promptsjabloon (per illustratie)

> Illustration for the game "Chronica Classica", in the established comic /
> graphic-novel house style (bold clean ink, cel shading, cinematic light).
> **Scene:** «beschrijf het moment, met élk kledingstuk/wapen/object expliciet
> benoemd — nooit "soldiers"/"warriors" zonder erbij te zeggen wat ze dragen».
> **Camera position (bij elke richting/beweging):** «vanaf waar kijkt de
> kijker, en wat is daardoor wel/niet zichtbaar». **Setting/periode:**
> «plaats + tijd». **Accent colour:** «Aegean blue voor Grieks / oxblood voor
> Romeins». **Protagonist (indien in beeld):** nameless young farmer,
> androgynous, shown from behind or over the shoulder, «vodden+hooivork / met
> boog / met speer+schild / te paard». 16:9, no text, no speech bubbles, no
> watermark, no modern objects. **Avoid (strict):** «benoem de meest
> waarschijnlijke foute lezing met naam en verbied 'm expliciet».

## Voorbeeld — proloog ("de ontdekking van het bronzen Orakel")

> Comic-style illustration, dramatic graphic-novel inking. A young peasant farmer
> in a rough ragged tunic, seen **from behind / over the shoulder** so the face
> stays hidden and the figure reads as gender-neutral. They kneel in a dry,
> sun-scorched field at the edge of ancient Latium, one hand brushing soil away
> from a half-buried **bronze disc** engraved with faint Greek-looking symbols.
> The disc emits a soft warm golden glow. Late-afternoon low sun, long shadows, a
> lone cypress on distant hills. Palette: dark warm stone-brown and ochre with
> gold light accents. Mood: quiet wonder, the hush before something awakens. Bold
> clean linework, cel shading, cinematic composition. 16:9, no text, no speech
> bubbles, no watermark, no modern objects.

## Hoofdstuk 24 — "Terug in het Museum" (CH24_000)

**Drie klasse-varianten, één scène.** De IMAGE-sectie gebruikt
`ch24_terug_in_museum_{klasse_beeldsuffix}.png` — een dynamische
bestandsnaam (zelfde `{token}`-mechanisme als de Finale-epiloog, Chronica.md
§7.103) die bij binnenkomst wordt opgelost naar de klasse van de speler
(`SP_CLASS_IMAGE_SUFFIX`, singleplayer.js). Drie losse renders nodig, elk
identiek qua compositie/tekst hieronder, alleen de wapenuitrusting van de
protagonist verandert:
- `ch24_terug_in_museum_boog.png` — Boogschutter: een boog op de rug.
- `ch24_terug_in_museum_speer.png` — Hopliet: een speer en een rond schild.
- `ch24_terug_in_museum_sporen.png` — Cavalerist: rijlaarzen met sporen.

> Illustration for the game "Chronica Classica", in the established comic /
> graphic-novel house style (bold clean ink, cel shading, cinematic light).
> **Scene:** the protagonist — a nameless young traveler, androgynous, seen
> from behind/over the shoulder so the face stays hidden, wearing simple
> traveler's clothing plus **«boog: a bow slung across the back» / «speer: a
> spear held in one hand and a round shield strapped to the back» / «sporen:
> tall riding boots with spurs»** (pick exactly one of the three, matching
> the filename you're generating) — stands just inside a vast
> museum hall: rows of tall polished stone columns stretching away in every
> direction, and between them, countless low weathered stone pedestals, each
> topped with an old glass bell jar. Some jars hold a single small glowing
> object (a golden rose, a bronze shard, a glowing ember — a few distinct
> small treasures, softly gold-lit from within) and stand out clearly; many
> more jars nearby, receding into the hall, are visibly empty, some dusty,
> one pedestal cracked and half-collapsed. Beside the protagonist stands the
> Boodschapper van Chronos (Hermes/Mercurius-figure): slender figure, winged
> sandals, a winged traveler's hat, holding a caduceus staff, one arm
> gesturing outward toward the endless rows of pedestals as if presenting
> them. **Camera position:** positioned just behind and to the side of the
> protagonist, roughly at their eye level, looking down the long hall so
> both the filled jars nearby and the empty ones receding into the soft dark
> distance are visible in the same shot. **Setting/period:** a timeless,
> non-physical museum hall, outside ordinary time. **Accent colour:** no
> single language track owns this hall — a few of the filled jars glint
> faintly with Aegean blue, others with oxblood dark red, side by side, plus
> warm gold as the shared magical light accent. 16:9, no text, no speech
> bubbles, no watermark, no modern objects. **Avoid (strict):** do not show
> the protagonist's face or give them clearly masculine or feminine facial
> features; do not draw only full jars or only empty ones — both must be
> visible together in the same shot; no modern glass/plexiglass, the jars
> must read as old, faintly irregular hand-blown glass.

## Resterende scène-illustraties (audit 2026-08-21)

Volledige inventarisatie van alle `IMAGE:`-secties tegen wat er echt in
`certamen/assets/chronica/images/` staat leverde deze 24 nog ontbrekende
scène-illustraties op — verder is de hele campagne (proloog t/m Finale)
compleet. Klaar-om-te-plakken, gegroepeerd per hoofdstuk.

### Hoofdstuk 1 — `ch1_midas_ezelsoren.png` (oxblood)
> Illustration for the game "Chronica Classica", in the established comic/graphic-novel house style (bold clean ink, cel shading, cinematic light). **Scene:** King Midas, a middle-aged man in a simple purple-trimmed tunic, stands with his Phrygian cap (a soft, forward-flopping conical felt cap) held in one hand at his side, fully revealing two long, furry donkey ears growing from the sides of his head where human ears should be — his expression a mix of shame and resignation. Facing him, the god Apollo, young and radiant, wearing a laurel wreath and a light Greek chiton, one arm still outstretched from having just finished the transformation, a faint golden divine light fading from his fingertips. A lyre rests against Apollo's leg; a set of pan-pipes lie on the ground between them. **Camera position:** eye level, the two figures facing each other in a mountain clearing near Sardis, Mount Tmolus visible in the background. **Setting/period:** archaic Greece, mountainous. **Accent colour:** oxblood glow lighting Apollo's fading divine light. 16:9, no text, no speech bubbles, no watermark, no modern objects. **Avoid (strict):** do not hide Midas's donkey ears — they must be the clear focal point; do not show Apollo attacking or angry-shouting, the moment is just after the transformation, calm but severe.

### Hoofdstuk 2 — `ch2_apollo_daphne.png` (oxblood)
> Illustration for the game "Chronica Classica", in the established comic/graphic-novel house style (bold clean ink, cel shading, cinematic light). **Scene:** the nymph Daphne, mid-transformation into a laurel tree — her lower legs and one raised arm already turned to smooth bark and sprouting laurel branches with leaves, while her torso and face are still visibly human, an expression of relief rather than fear. Apollo, a young god in a light tunic with a laurel-less head (not yet crowned), reaches out with both arms to embrace the new trunk, his face full of longing and grief rather than anger. The river god Peneus is faintly visible in the background as a reclining, bearded figure made of flowing water, one hand still raised from having triggered the transformation. **Camera position:** eye level, slightly behind Apollo's shoulder so his reaching arms and Daphne's transformation are both in frame. **Setting/period:** a riverside forest in ancient Thessaly. **Accent colour:** oxblood. 16:9, no text, no speech bubbles, no watermark, no modern objects. **Avoid (strict):** do not complete the transformation — Daphne's face and upper body must still read as human; do not show Cupid's arrows in frame, only the aftermath.

### Hoofdstuk 2 — `ch2_gigantomachie.png` (Aegean blue)
> Illustration for the game "Chronica Classica", in the established comic/graphic-novel house style (bold clean ink, cel shading, cinematic light). **Scene:** Herakles, wearing the lion-skin cloak (head as a hood) over a simple tunic, draws a large bow with an arrow aimed upward at a massive, armored giant descending from above; in the background, Athena — helmeted, with spear and round shield bearing the aegis/gorgon motif — hurls a huge slab of rock (implied to be part of the island of Sicily) down onto another falling giant. Several other giants, oversized humanoid warriors with mismatched bronze armor and serpent-like legs below the knee, are visible mid-battle in the background. **Camera position:** low angle looking up, emphasizing the giants' towering scale against Herakles and Athena. **Setting/period:** the plain of Phlegra, mythic battlefield, dramatic storm-lit sky. **Accent colour:** Aegean blue. 16:9, no text, no speech bubbles, no watermark, no modern objects. **Avoid (strict):** only one arrow in flight at a time from Herakles's bow — a single frozen moment, not two overlapping actions.

### Hoofdstuk 2 — `ch2_bellerophon_chimaira.png` (Aegean blue)
> Illustration for the game "Chronica Classica", in the established comic/graphic-novel house style (bold clean ink, cel shading, cinematic light). **Scene:** the hero Bellerophon, wearing bronze Greek armor and holding a long spear tipped with a distinct lump of lead, rides the winged white horse Pegasus in flight directly above the Chimaira — a monster with a lion's body and mane, a second goat's head growing from its back, and a serpent for a tail, flames actively spewing from the lion-head's open mouth. The spear's leaden tip is thrust down into the Chimaira's open, flame-breathing mouth, the lead visibly beginning to melt and glow from the heat. **Camera position:** three-quarter angle from slightly above and behind Bellerophon, showing both rider and monster in frame. **Setting/period:** the rocky Lycian valley. **Accent colour:** Aegean blue. 16:9, no text, no speech bubbles, no watermark, no modern objects. **Avoid (strict):** the spear must visibly touch/enter the mouth, not hover near it — the melting-lead detail is the key story point.

### Hoofdstuk 3 — `ch3_mercurius_veediefstal.png` (oxblood)
> Illustration for the game "Chronica Classica", in the established comic/graphic-novel house style (bold clean ink, cel shading, cinematic light). **Scene:** the infant god Mercury — depicted as a mischievously grinning baby, still partly wrapped in white swaddling cloth but already wearing small winged sandals and a tiny winged traveler's hat, far too knowing an expression for his age — walks backward on tiptoe at night, driving a small herd of cattle behind him by their tails so their hoofprints point the wrong direction. A crescent moon lights the scene. **Camera position:** low, child's-eye level, positioned behind Mercury so the viewer sees both his sly backward glance and the confused-looking cattle being led away. **Setting/period:** a nighttime pasture in ancient Greece, near Mount Cyllene. **Accent colour:** oxblood. 16:9, no text, no speech bubbles, no watermark, no modern objects. **Avoid (strict):** do not draw Mercury as a toddler who can barely stand — he must look physically infant-sized but confident and deliberate in his movements, which is the joke of the myth.

### Hoofdstuk 6 — `ch6_bacchus_piraten.png` (oxblood)
> Illustration for the game "Chronica Classica", in the established comic/graphic-novel house style (bold clean ink, cel shading, cinematic light). **Scene:** aboard a Tyrrhenian pirate ship at sea, thick flowering grapevines have burst up through the deck planks and wound around the mast and rigging; dark red wine flows across the deck where seawater should be. Several bearded pirates in rough tunics leap overboard in mid-air, panic on their faces, their lower bodies already visibly transforming into sleek grey dolphin tails and fins. Bacchus himself stands calmly at the center of the ship, young and beautiful, an ivy-and-grape-leaf wreath in his hair, one hand casually raised, radiating a warm glow, completely unbothered. **Camera position:** eye level from the ship's deck, wide enough to show both Bacchus at center and the transforming pirates leaping off the sides. **Setting/period:** the Mediterranean Sea, mythic time. **Accent colour:** oxblood. 16:9, no text, no speech bubbles, no watermark, no modern objects. **Avoid (strict):** show the pirates only partially transformed (mid-leap, human torso + dolphin tail) — not fully dolphins yet, since they are still falling.

### Hoofdstuk 10 — `ch10_acis_galatea.png` (Aegean blue)
> Illustration for the game "Chronica Classica", in the established comic/graphic-novel house style (bold clean ink, cel shading, cinematic light). **Scene:** on a rocky Sicilian coastline near Mount Etna, the young shepherd Acis and the sea-nymph Galatea flee hand in hand along the rocks, glancing back in terror, while behind and above them the giant one-eyed Cyclops Polyphemus — wearing rough animal-hide clothing, his single eye wide with rage — hurls an enormous boulder toward the fleeing pair, the rock frozen mid-air just above them. **Camera position:** positioned behind and slightly above Polyphemus's shoulder, looking down toward the fleeing couple, so the viewer sees the boulder's trajectory clearly. **Setting/period:** the Sicilian coast at the foot of Etna. **Accent colour:** Aegean blue. 16:9, no text, no speech bubbles, no watermark, no modern objects. **Avoid (strict):** only one boulder in frame, mid-flight — not yet landed, not shown twice.

### Hoofdstuk 11 — `ch11_glaucus_skylla.png` (Aegean blue)
> Illustration for the game "Chronica Classica", in the established comic/graphic-novel house style (bold clean ink, cel shading, cinematic light). **Scene:** the sorceress Circe, in flowing robes, kneels at the edge of a rocky sea-pool and pours a dark, glowing potion from a small vial into the water, her face twisted with jealous fury. In the pool, the nymph Skylla is caught mid-transformation: her upper body still a beautiful young woman, but her waist and lower body already sprouting a writhing ring of snarling dog heads and grasping tentacle-like limbs where her legs should be, her face frozen in shock and pain. **Camera position:** eye level at the pool's edge, Circe in the foreground pouring the potion, Skylla's transformation visible just beyond in the water. **Setting/period:** a hidden mythic sea-grotto. **Accent colour:** Aegean blue. 16:9, no text, no speech bubbles, no watermark, no modern objects. **Avoid (strict):** Skylla's transformation must be clearly mid-change (human upper body, monstrous lower body already forming) — not yet the fully-formed six-headed monster.

### Hoofdstuk 12 — `ch12_ody_nausicaa_faiaken.png` (Aegean blue)
> Illustration for the game "Chronica Classica", in the established comic/graphic-novel house style (bold clean ink, cel shading, cinematic light). **Scene:** on a sandy beach, the young princess Nausicaa, wearing a simple but finely woven Greek peplos, stands with a mix of caution and calm resolve, addressing Odysseus, who kneels a respectful distance away, naked but for a single leafy olive branch he holds in front of himself for modesty, his body weathered, salt-crusted, and gaunt from his ordeal at sea. Nausicaa's handmaidens are visible further back on the beach, some frozen mid-flight in fear, others gathering scattered laundry from a large wicker basket. **Camera position:** eye level, positioned to the side so both Nausicaa's calm stance and Odysseus's kneeling, covered figure are clearly visible without explicit nudity (the olive branch fully conceals him). **Setting/period:** the beach of Scheria, land of the Phaeacians. **Accent colour:** Aegean blue. 16:9, no text, no speech bubbles, no watermark, no modern objects. **Avoid (strict):** Odysseus must be fully covered by the olive branch at all times, no exposed anatomy.

### Hoofdstuk 12 — `ch12_orestes_wraak.png` (Aegean blue)
> Illustration for the game "Chronica Classica", in the established comic/graphic-novel house style (bold clean ink, cel shading, cinematic light). **Scene:** the young hero Orestes, wearing a simple Greek tunic with a sword still gripped in one bloodless hand at his side, stumbles backward through a colonnaded street, one arm raised defensively, his face wide-eyed with terror — pursued by three Erinyes (Furies): dark-winged, gaunt female figures with snakes writhing in their hair instead of locks, their eyes glowing red, clawed hands reaching toward him. **Camera position:** eye level, positioned behind Orestes so the viewer shares his view of the pursuing Furies closing in. **Setting/period:** ancient Mycenae, a shadowed colonnade at dusk. **Accent colour:** Aegean blue. 16:9, no text, no speech bubbles, no watermark, no modern objects. **Avoid (strict):** no visible blood or gore on the sword or Orestes's hands — the horror is entirely in the pursuing Furies, not in graphic violence.

### Hoofdstuk 13 — `ch13_perseus_medusa.png` (Aegean blue)
> Illustration for the game "Chronica Classica", in the established comic/graphic-novel house style (bold clean ink, cel shading, cinematic light). **Scene:** the hero Perseus, wearing winged sandals, a helmet that renders him invisible (shown here as a faint shimmer around his head, not fully see-through, since the viewer must still see him), and holding a curved sword (harpe) in one hand, crouches with his back turned toward the sleeping Gorgon Medusa — snake-haired, bronze-scaled skin — while holding up Athena's polished bronze shield in his other hand like a mirror, looking only at Medusa's reflection in its surface as he prepares to strike. **Camera position:** positioned behind Perseus's shoulder so the viewer sees both his true back (never facing Medusa directly) and Medusa's reflection in the shield. **Setting/period:** a dark, rocky cave at the edge of the world. **Accent colour:** Aegean blue. 16:9, no text, no speech bubbles, no watermark, no modern objects. **Avoid (strict):** Perseus's eyes must never point directly at Medusa herself — only at her mirrored reflection in the shield, that is the entire point of the myth.

### Hoofdstuk 13 — `ch13_perseus_acrisius.png` (Aegean blue)
> Illustration for the game "Chronica Classica", in the established comic/graphic-novel house style (bold clean ink, cel shading, cinematic light). **Scene:** at an open-air Greek athletic games, the hero Perseus, mid-throw, has just released a bronze discus into the air, his body still following through the throwing motion. The discus, caught by a sudden gust of wind (a few visible wind-swirl lines bending its path), curves off course away from the throwing field toward the spectator stands, where an elderly, robed man — King Acrisius — sits among the crowd, unaware, his face turned away, completely oblivious to the incoming discus. **Camera position:** wide angle showing the full arc from Perseus's throw to the stands, the discus's curved wind-bent path visible as a single frozen trajectory line. **Setting/period:** an ancient Greek athletic games field. **Accent colour:** Aegean blue. 16:9, no text, no speech bubbles, no watermark, no modern objects. **Avoid (strict):** show only one discus, mid-flight, not yet having struck Acrisius — the moment of dread anticipation, not the impact itself.

### Hoofdstuk 15 — `ch15_hero_leander.png` (Aegean blue)
> Illustration for the game "Chronica Classica", in the established comic/graphic-novel house style (bold clean ink, cel shading, cinematic light). **Scene:** a tall stone tower rises from a rocky headland at the edge of a narrow, storm-tossed sea strait; at its top window, the priestess Hero, in flowing robes, leans out desperately, her lantern extinguished, its thin trail of smoke still curling from the wick, while a fierce wind whips her hair and robes. Far below, in the dark churning water, the young man Leander struggles against the waves, one arm raised, visibly losing the fight against the current. **Camera position:** wide establishing shot from the water level, showing both the tower with Hero at its top and Leander struggling below, connected by the same diagonal composition line. **Setting/period:** the Hellespont strait, at night during a storm. **Accent colour:** Aegean blue. 16:9, no text, no speech bubbles, no watermark, no modern objects. **Avoid (strict):** the lantern must be shown clearly extinguished (smoke, no flame) — that absence is the entire tragedy of the image.

### Hoofdstuk 15 — `ch15_pyramus_thisbe.png` (oxblood)
> Illustration for the game "Chronica Classica", in the established comic/graphic-novel house style (bold clean ink, cel shading, cinematic light). **Scene:** beside the tomb of Ninus, under a large mulberry tree with white berries, the young man Pyramus kneels on the ground, having just discovered Thisbe's pale veil, now torn and stained with blood, clutched in one hand — his sword drawn in his other hand, already raised toward his own chest in the instant before the fatal blow, his face a mask of devastated grief. A lioness with fresh blood still visible around her muzzle is seen departing into the shadows in the far background, having already left the scene. **Camera position:** eye level, close on Pyramus and the torn veil, the departing lioness small and distant in the background so she reads as already gone, not an active threat. **Setting/period:** outside ancient Babylon, moonlit night. **Accent colour:** oxblood. 16:9, no text, no speech bubbles, no watermark, no modern objects. **Avoid (strict):** freeze the single moment just before the sword strikes — no blood on Pyramus himself yet, the torn bloody veil is the only blood in frame.

### Hoofdstuk 23 — `ch23_lat_pamphile_cameo.png` (oxblood)
> Illustration for the game "Chronica Classica", in the established comic/graphic-novel house style (bold clean ink, cel shading, cinematic light). **Scene:** at the edge of a grand Roman imperial hall, half-hidden in the shadow of a marble column, a plain-dressed woman sits on a low stool with a wax tablet balanced on her lap, a bronze stylus in hand, mid-write, her eyes lifted to glance directly at the viewer with a lingering, knowing look. In the foreground, partly turned toward her, stands Livius — an older Roman man in a toga, ink stains visible on his fingers, leaning slightly as if just having spoken to someone beside him. The hall around them is filled with unfocused, blurred courtiers and senators, none paying the woman any attention. **Camera position:** eye level, positioned so both Livius (foreground, slightly turned) and the woman in the shadow of the column (mid-ground, looking toward camera) are in frame together. **Setting/period:** Nero's imperial court, Rome, 1st century CE. **Accent colour:** oxblood. 16:9, no text, no speech bubbles, no watermark, no modern objects. **Avoid (strict):** the woman's gaze must read as deliberate and lingering, not a casual glance — she is looking at the viewer specifically.

### Hoofdstuk 28 — `ch28_mnemosyne_bibliotheek_{klasse_beeldsuffix}.png` (neutraal, gouden gloed)
**Drie klasse-varianten, zelfde `{klasse_beeldsuffix}`-mechanisme als
Hoofdstuk 24** (`ch28_mnemosyne_bibliotheek_boog.png`/`_speer.png`/
`_sporen.png`) — inmiddels ook zo geleverd en gekoppeld.

> Illustration for the game "Chronica Classica", in the established comic/graphic-novel house style (bold clean ink, cel shading, cinematic light). **Scene:** the protagonist — a nameless young traveler, androgynous, seen from behind/over the shoulder so the face stays hidden, wearing simple traveler's clothing plus **«boog: a bow slung across the back» / «speer: a spear held in one hand and a round shield strapped to the back» / «sporen: tall riding boots with spurs»** (pick exactly one, matching the filename) — stands at the entrance of an impossibly vast library: towering bookshelves stretching away in every direction with no visible ceiling. Ahead, an ageless woman in flowing dark robes — Mnemosyne — walks between the shelves, one hand gesturing outward; where she points, four faint, distinctly colored glowing corridor-openings become visible in the distance among the shelves. **Camera position:** positioned just behind and to the side of the protagonist, at their eye level, looking past them toward Mnemosyne and the four distant glowing openings. **Setting/period:** a timeless, non-physical library outside ordinary space. **Accent colour:** warm gold as the dominant magical light, with the four distant corridor-glows hinted in different faint colours. 16:9, no text, no speech bubbles, no watermark, no modern objects. **Avoid (strict):** do not show the protagonist's face; the four distant corridor-glows must stay small/background details, not the main focus of this establishing shot.

### Hoofdstuk 28 — `ch28_gang_a_weg_hierheen.png`, vleugel A (gouden gloed)
> Illustration for the game "Chronica Classica", in the established comic/graphic-novel house style (bold clean ink, cel shading, cinematic light). **Scene:** inside a long library corridor, dozens of small floating motes of warm golden light drift at head height between the bookshelves, several of them flowing together mid-air to form a single glowing, translucent tableau: a faint image of a lone young figure (silhouette only, not detailed) climbing a rocky obstacle in one version and squaring their shoulders to push through a barrier in another, both blended into one shimmering composite scene. Mnemosyne stands beside the light-formation, one hand raised toward it. **Camera position:** eye level, positioned so both Mnemosyne and the glowing composite light-image are visible together, the bookshelves receding into soft darkness on either side. **Setting/period:** the timeless library. **Accent colour:** warm gold, dominant. 16:9, no text, no speech bubbles, no watermark, no modern objects. **Avoid (strict):** the merged light-image must stay translucent and dreamlike, not a solid, fully rendered scene — it is a memory, not a real place.

### Hoofdstuk 28 — `ch28_gang_b_potjes.png`, vleugel B (blend Aegean blue/oxblood)
> Illustration for the game "Chronica Classica", in the established comic/graphic-novel house style (bold clean ink, cel shading, cinematic light). **Scene:** a library corridor lined with shelves holding nine small glass jars, each containing a faint wisp of slowly swirling smoke — roughly half glowing pale Aegean blue, half glowing oxblood dark red. Mnemosyne touches one jar with a fingertip; the smoke inside briefly resolves into a small, translucent image of a marble column. **Camera position:** eye level, close enough to read the jars and the touched jar's smoke-image clearly, Mnemosyne's hand and face visible beside it. **Setting/period:** the timeless library. **Accent colour:** an even blend of Aegean blue and oxblood glints across the different jars (this wing belongs to no single track). 16:9, no text, no speech bubbles, no watermark, no modern objects. **Avoid (strict):** only one jar shows a resolved image (the marble column) — the others remain unresolved swirling smoke, not competing detailed scenes.

### Hoofdstuk 28 — `ch28_gang_c_portretten.png`, vleugel C (gouden gloed)
> Illustration for the game "Chronica Classica", in the established comic/graphic-novel house style (bold clean ink, cel shading, cinematic light). **Scene:** a library corridor whose walls are completely covered, edge to edge, with hundreds of small framed portraits of many different faces, in mismatched frame styles and sizes. The protagonist (seen from behind/over the shoulder, androgynous, simple traveler's clothing plus class-appropriate gear) and Mnemosyne stand together, both looking up at the wall of portraits, a few of the frames closest to them glowing faintly brighter than the rest as if singled out. **Camera position:** eye level, behind the two figures, looking up at the portrait wall with them so its overwhelming scale is felt. **Setting/period:** the timeless library. **Accent colour:** warm gold on the handful of brighter, singled-out portraits. 16:9, no text, no speech bubbles, no watermark, no modern objects. **Avoid (strict):** do not render individual portraits with recognizable named faces from the game — keep them as generic, varied period-appropriate faces, since most are meant to be strangers to the player.

### Hoofdstuk 28 — `ch28_gang_d_stemmen.png`, vleugel D (koel/gedempt, geen goud)
> Illustration for the game "Chronica Classica", in the established comic/graphic-novel house style (bold clean ink, cel shading, cinematic light), but deliberately quieter and dimmer than the other library corridors — no golden glow here. **Scene:** a hushed, sparsely lit library corridor with faintly outlined, empty-looking shelves; a few soft, visible ripples of sound-like distortion (drawn as thin concentric wavy lines, like ripples in water but hanging in the air) drift gently at head height. The protagonist (from behind/over the shoulder, class-appropriate gear) stands still, head slightly tilted as if listening, Mnemosyne beside them equally still. **Camera position:** eye level, behind the two figures, the corridor's quiet emptiness stretching ahead. **Setting/period:** the timeless library. **Accent colour:** deliberately muted, cool grey-blue tones, no warm gold glow in this corridor specifically. 16:9, no text, no speech bubbles, no watermark, no modern objects. **Avoid (strict):** no golden magical glow anywhere in this image — that is what makes this corridor read as different from the other three.

### Hoofdstuk 28 — `ch28_narcissus_echo_kamer.png` (gouden gloed)
> Illustration for the game "Chronica Classica", in the established comic/graphic-novel house style (bold clean ink, cel shading, cinematic light). **Scene:** a circular chamber with fully mirrored walls, endlessly reflecting the room itself. On the floor, dozens of narrow parchment strips lie scattered, each bearing only a few handwritten Greek words (illegible at this scale, just texture, not readable text). Mnemosyne stands at the center gesturing down toward the scattered strips. **Camera position:** slightly elevated three-quarter angle looking down at the scattered parchment strips on the floor, mirrored walls visible receding on all sides. **Setting/period:** the timeless library. **Accent colour:** warm gold. 16:9, no text, no speech bubbles, no watermark, no modern objects. **Avoid (strict):** the parchment strips must read as scattered texture/scribbles, never as legible actual words or letters — this is a game-asset image, not a text document.

### Hoofdstuk 28 — `ch28_mnemosyne_museum_onthulling.png` (gouden gloed)
> Illustration for the game "Chronica Classica", in the established comic/graphic-novel house style (bold clean ink, cel shading, cinematic light). **Scene:** in the grand main hall of the library, Mnemosyne — an ageless woman in flowing dark grey-blue robes — bows her head deeply and sincerely toward the protagonist (seen from behind/over the shoulder, class-appropriate gear), one hand held over her own chest in a gesture of gratitude, a warm golden glow surrounding her more intensely than before. **Camera position:** eye level, positioned behind the protagonist so Mnemosyne's bow is the clear focal point facing the viewer/protagonist. **Setting/period:** the timeless library's main hall. **Accent colour:** warm gold, especially bright around Mnemosyne. 16:9, no text, no speech bubbles, no watermark, no modern objects. **Avoid (strict):** Mnemosyne's expression must read as sincere relief/gratitude, not sorrow or fear.

### Hoofdstuk 28 — `ch28_pamphile_onthulling.png` (gouden gloed)
> Illustration for the game "Chronica Classica", in the established comic/graphic-novel house style (bold clean ink, cel shading, cinematic light). **Scene:** the Boodschapper van Chronos (previously seen with winged sandals and a caduceus staff) now stands with her winged sandals set aside on the floor beside her bare feet, looking less distant and slightly bashful, faint ink stains visible on her fingers — she is revealed as the same historian, Pamphile, glimpsed earlier at Nero's court. Beside her stand Athena (helmeted, spear, calm authority) and Hermes (winged sandals and petasos hat, caduceus, posture less guarded than usual). **Camera position:** eye level, all three figures in a loose row facing the viewer/protagonist, Pamphile at the center as the focal point. **Setting/period:** the timeless library's main hall. **Accent colour:** warm gold. 16:9, no text, no speech bubbles, no watermark, no modern objects. **Avoid (strict):** Pamphile must not be wearing the winged sandals in this image — they are explicitly set aside on the ground, a visual cue that she has dropped the Boodschapper persona.

### Hoofdstuk 28 — `ch28_lethe_verschijnt.png` (koud grijs, geen goud)
> Illustration for the game "Chronica Classica", in the established comic/graphic-novel house style (bold clean ink, cel shading, cinematic light), but with the library's usual warm golden glow abruptly extinguished, replaced by a cold, flat grey light. **Scene:** between two tall bookshelves, a calm, almost gentle-looking woman in a flowing pale grey-blue robe stands as if she has always been there — her eyes rendered as smooth, glossy, colourless silver-white with no visible iris or pupil, giving her gaze an unsettling emptiness despite her friendly expression. Mnemosyne, a few steps away, has gone rigid with shock, one hand half-raised, staring at the newcomer. **Camera position:** eye level, positioned so both the newcomer (calm, centered) and Mnemosyne's shocked reaction (to the side) are visible together. **Setting/period:** the timeless library's main hall, now cold and grey. **Accent colour:** cold flat grey light, no warm gold anywhere in this image — a deliberate visual break from every other library illustration. 16:9, no text, no speech bubbles, no watermark, no modern objects. **Avoid (strict):** the newcomer's expression must stay calm and almost friendly, never menacing or snarling — her wrongness comes from the eyes and the cold light, not from aggression.
