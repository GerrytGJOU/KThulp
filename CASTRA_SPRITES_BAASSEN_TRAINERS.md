# Castra Heroum — sprites en portretten voor trainers, bazen en NPC's (opdracht voor het sprites-gesprek)

Repo: `KThulp`, map `certamen/`. Stand 2026-10-25. Alle afbeeldingen zijn pixel-art met transparante achtergrond, in dezelfde stijl en kleurtoon als de bestaande vormsprites in `certamen/assets/sprites-forms/`. Eerst de bestaande `myt_*`-sprites erbij pakken voor de stijl.

## Wat er moet komen

In Pokémon zie je bij een trainer een grote pose in het gevecht en een portret in het gesprek. Dat doen we ook, maar **per persoon maar twee dingen**: één pose voor het beurtgevecht en één portret voor de dialoog. Geen loop- of aanvalsanimaties.

1. **Trainers (31)**: gevechtspose + portret.
2. **Kampioenen** (de Lanista-kampioen in Roma en de regiokampioenen): gevechtspose + portret.
3. **De speler (dux)**: één standaard gevechtspose en een portret.
4. **Alle NPC's**: alleen een portret (zie punt B).
5. **Bazen (10)**: hun wezensprites bestaan al; drie gaten (zie punt 4).

## Formaten en bestandsnamen

| Wat | Bestand | Formaat | Opmerking |
|---|---|---|---|
| Gevechtspose van een trainer, kampioen of de dux | `certamen/assets/sprites-forms/trn_<regio>_<soort>_battle_front.png` | 192×192 | staat op een platform, kijkt naar de speler; de dux: `trn_dux_battle_back.png` (kijkt van de speler af) |
| Portret (trainer, kampioen, dux, NPC, held) | `certamen/assets/portraits/<naam>.png` | 144×144 | kijkt iets naar rechts; bovenlijf; ook gebruikt voor het VS-scherm |

`<naam>` = de naam zoals in het spel, kleine letters, zonder accenten, spaties en leestekens als `_` (bv. `Matrona` → `matrona.png`, `Venator Graecus` → `venator_graecus.png`). Personen met dezelfde naam delen een portret (alle Fabers, alle Magistrae). Het volledige overzicht met de exacte bestandsnamen en wat er al is staat in `certamen/assets/portraits/MANIFEST.md` (opnieuw genereren: `node certamen/tools/castra-portraits-manifest.js`, vanuit `certamen/`).

**Uit RPG Maker MV halen kan voor de NPC-portretten:** zet een gezichtenblad uit `RPG Maker MV\NewData\img\faces` (576×288, 4×2 gezichten van 144 px, bv. `People1.png`) in `certamen/assets/portraits/` en koppel een gezicht aan een naam in `certamen/castra-tutorial.js`:
`CASTRA_PORTRAIT_SHEETS.matrona = { file:"assets/portraits/People1.png", i:3 };` (i = 0 t/m 7, linksboven naar rechtsonder). Een eigen `<naam>.png` gaat voor op een gezichtenblad. De NPC-spritesheets (overworld) kunnen op dezelfde manier uit MV komen, zie `certamen/assets/npcs/README.txt`. Zonder bestand valt het spel terug op de avatar; ze kunnen dus één voor één binnenkomen.

## A. Trainers (31), gevechtspose en portret

Per trainer: `trn_<regio>_<soort>_battle_front.png` én `<naam>.png` met de naam uit de laatste kolom (`<naam>` = naam in kleine letters met `_`).

Soorten (zelfde uiterlijk per volk, andere kleding en wapen):
- **venator** (jager): boog of speer, lichte kleding, kap of bandana, buidel met wild.
- **miles** ("miles viae", wegsoldaat): harnas, helm, schild, speer; professioneel.
- **explorator** (verkenner): lichte kleding, mantel, kijker of schriftrol, wandelstok.

| Regio | Volk | Soorten | Namen (portretbestanden) |
|---|---|---|---|
| latium | Romein | venator, miles | Venator Latinus, Miles viae Latinus |
| roma | Romein | venator, miles, explorator | Venator Romanus, Miles viae Romanus, Explorator Romanus |
| graecia | Griek | venator, miles, explorator | Venator Graecus, Miles viae Graecus, Explorator Graecus |
| laconia | Spartaan | venator, miles, explorator | Venator Spartiates, Miles viae Spartiates, Explorator Spartiates |
| troia | Trojaan | venator, miles, explorator | Venator Troianus, Miles viae Troianus, Explorator Troianus |
| themiscyra | Amazone (vrouwelijk) | venator, miles, explorator | Venator Amazon, Miles viae Amazon, Explorator Amazon |
| gallia | Galliër | venator, miles, explorator | Venator Gallus, Miles viae Gallus, Explorator Gallus |
| germania | Germaan | venator, miles, explorator | Venator Germanus, Miles viae Germanus, Explorator Germanus |
| persis | Pers | venator, miles, explorator | Venator Persa, Miles viae Persa, Explorator Persa |
| aegyptus | Egyptenaar | venator, miles, explorator | Venator Aegyptius, Miles viae Aegyptius, Explorator Aegyptius |
| africa | Carthager | venator, miles | Venator Poenus, Miles viae Poenus |

Voorbeeld: `trn_graecia_miles_battle_front.png` en `miles_viae_graecus.png`.

## B. Portretten voor alle NPC's (alleen portret, 144×144)

Het volledige actuele overzicht (107 personen, ook helden) staat in `certamen/assets/portraits/MANIFEST.md`. In groepen:

- **Per land (11 landen):** Faber (bouwer), Magistra (lerares), Venator (jachtmeester), Mercator nundinarum (marktkoopman), de opdrachtgever (Agricola in Latium, Poeta in Graecia, Custos in Troia, Mercator in Gallia, Scriba in Aegyptus, Magus in Persis, enzovoort).
- **Binnenruimtes (9 landen met een domus, taberna en caverna):** de wijze in het huis (Bardus, Pythia, Sacerdos, Geron, Vates), de waard in de taberna (Caupo, Gymnasiarches, Hortulanus, Coquus, Servus), de kampioen in de taberna (Pugnator Gallus, Athleta, Custos Pharaonis, Spartiata, Custos portae, Pugnator Germanus) en de zoeker in de grot (Druida, Daedalus, Sacerdos senex, Pastor, Cassandra, Venator senex).
- **Roma en Latium (uniek):** Eremita, Matrona (waardin), Senator, Consul, Balneator, Lanista, Custos (catacomben), Praeco (Colosseum), Pontifex (tempel), Fugitivus, Civis Ardeae.
- **Rondlopende bewoners:** moeder (anxia, laeta), Gallus (defessus, pacatus), enzovoort (zie het manifest).
- **Helden (18):** hebben hun eigen sprites; een portret in dezelfde stijl is mooi, maar niet nodig.

## C. De speler (dux)

- `trn_dux_battle_back.png` (192×192): jouw leider van achteren, in neutrale Romeinse stijl (rode mantel, helm).
- `dux.png` in `portraits/` (144×144): voor de linkerkant van het VS-scherm.

## D. Bazen: wat er al is en wat nog mist

| Regio | Baas | Vorm-id | Opmerking |
|---|---|---|---|
| roma (catacumbae II) | Larva | `myt_larva` | klaar |
| gallia | Centaurus sagittarius | `myt_centaurussagitta` | klaar |
| graecia | Draco | `myt_draco` | **deelt zijn sprite met Persis**: graag een eigen draak |
| persis | Draco | `myt_draco` | zie Graecia: eigen draak met Perzische kleuren |
| aegyptus | Mumia | `myt_larva` | **gebruikt nu de Larva**: een echte mummie (verbonden, goud, lapis) ontbreekt |
| laconia | Gryps | `myt_gryps` | klaar |
| troia | Cyclops faber | `myt_cyclopsfaber` | klaar |
| germania | Lupus Martius | `myt_lupusmartius` | klaar |
| themiscyra | Equus alatus | `myt_equusalatus` | klaar |
| africa | Serpens | `myt_serpens` | klaar |

Nieuwe vorm-id's voor de gaten (bv. `myt_mumia`, `myt_draco2`) met de gebruikelijke vier bestanden; geef de ID's door, dan zet ik de bazen om. Optioneel: een grotere bazenversie `<vorm>_boss_battle_front.png` (256×256) voor de tien bazen.

## Volgorde

1. Mumia en een tweede draak.
2. De dux, en de trainers van Latium en Roma (5): daarmee bouw en test ik de koppeling en het VS-scherm.
3. Portretten van de NPC's die spelers het eerst tegenkomen (Latium, Roma, Faber, Magistra, Venator, Mercator).
4. De rest, regio voor regio, in de volgorde waarin de regio's opengaan: latium, roma, gallia, germania, graecia, laconia, troia, themiscyra, persis, aegyptus, africa.

## Wat ik doe zodra de eerste bestanden er zijn

- Portretten in het gespreksvak: **klaar** (zonder bestand de avatar; met bestand of gezichtenblad het portret).
- Een VS-scherm in Pokémon-stijl (twee portretten tegen elkaar, "VS", de namen) voor trainer- en kampioensgevechten.
- De trainer als sprite aan de vijandkant in het beurtgevecht, met fallback op de avatar.
- Een boss-intro met het grote wezen.
- Een controle in `tools/` voor ontbrekende trainerbestanden (zoals `castra-sprites-manifest.js` voor de vormen).
