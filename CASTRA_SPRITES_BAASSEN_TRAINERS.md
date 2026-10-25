# Castra Heroum — sprites voor bazen, trainers en de speler (lijst voor het sprites-gesprek)

Stand 2026-10-25. In Pokémon zie je bij een trainergevecht de trainer zelf (het VS-scherm en de trainer aan de vijandkant voor zijn eerste Pokémon verschijnt), en bij een baas het grote wezen. Bij ons is dat nu zo:

- **Bazen** (10 stuks) gebruiken de vormsprites van hun wezen. Die bestaan al (battle_front/back, portrait, td), met drie punten hieronder.
- **Trainers** (31 stuks) en de **kampioenen** hebben geen eigen sprite: ze worden als top-down paperdoll-avatar getekend (intro-scherm en gesprek). In het beurtgevecht staat alleen de soldaat van de trainer, de trainer zelf niet.
- **De speler** (de dux) heeft in het gevecht alleen een avatar-terugzicht.

Doel: bij elk trainer- en kampioensgevecht een VS-scherm met een groot portret van beide kanten, en de trainer als sprite aan de vijandkant bij het begin van het gevecht (en weer wanneer hij zijn volgende soldaat uitstuurt). Ik koppel dat zodra de eerste bestanden er zijn; zonder bestand valt het spel terug op de avatar, dus ze kunnen één voor één binnenkomen.

## Bestandsnamen en formaten

Zelfde map en dezelfde afspraken als de vormsprites (`certamen/assets/sprites-forms/`, transparante achtergrond, pixel-art, kleuraccent van het volk). De bestaande bestanden zijn groter dan in `README.txt` staat: battle 192×192, portrait 128×128, td 96×96. Trainers volgen dat:

| Bestand | Formaat | Waarvoor |
|---|---|---|
| `trn_<regio>_<soort>_battle_front.png` | 192×192 | de trainer aan de vijandkant (kijkt naar de speler, staat op een platform) |
| `trn_<regio>_<soort>_portrait.png` | 256×256 | het VS-scherm en het gesprek (bovenlijf, expressief, kijkt naar rechts voor de spreker links) |

`<soort>` is `venator`, `miles` of `explorator`; `<regio>` is de regio-id. Mijn koppeling gebruikt de naam als "vorm-id", dus precies deze spelling.

## 1. Trainers (31)

Elke trainer is een soort in een regio. Alleen Latium en Africa hebben er twee (geen explorator). Het uiterlijk volgt het volk van de regio; de soort bepaalt wapen en kleding.

- **venator** (jager): boog of speer, lichte kleding, kap of bandana, buidel met wild.
- **miles** ("miles viae", wegsoldaat): harnas, helm, schild, speer; ziet er professioneel uit.
- **explorator** (verkenner): lichte kleding, mantel, kijker of schriftrol, wandelstok.

| Regio | Volk (uiterlijk) | Soorten | Namen in het spel |
|---|---|---|---|
| latium | Romein | venator, miles | Venator Latinus, Miles viae Latinus |
| roma | Romein | venator, miles, explorator | …Romanus |
| graecia | Griek | venator, miles, explorator | …Graecus |
| laconia | Spartaan | venator, miles, explorator | …Spartiates |
| troia | Trojaan | venator, miles, explorator | …Troianus |
| themiscyra | Amazone | venator, miles, explorator | …Amazon (vrouwelijk) |
| gallia | Galliër | venator, miles, explorator | …Gallus |
| germania | Germaan | venator, miles, explorator | …Germanus |
| persis | Pers | venator, miles, explorator | …Persa |
| aegyptus | Egyptenaar | venator, miles, explorator | …Aegyptius |
| africa | Carthager | venator, miles | …Poenus |

Dat zijn 31 bestandsparen: bijvoorbeeld `trn_graecia_miles_battle_front.png` en `trn_graecia_miles_portrait.png`. Volgorde van voorkeur: eerst de regio's die spelers het eerst bereiken (latium, roma, gallia, germania, graecia, laconia, troia, themiscyra, persis, aegyptus, africa).

## 2. Kampioenen en andere vaste tegenstanders

Dit zijn personen die je uitdaagt of die je dagelijks bevecht. Zelfde twee bestanden, naam `trn_<id>_…`:

- `trn_kampioen_roma`: de dagelijkse kampioen van de Lanista in het Ludus (vorm `gla_primuspalus`, Primus Palus, gladiator, groot en indrukwekkend).
- `trn_champ_<regio>`: de kampioen in het huis/de taberna van elke regio buiten Latium en Roma (id `champ_<regio>`, rol gchamp; de namen staan in `certamen/castra-regions.js` onder `S.houseB.champ.nm`). Ze zijn wat steviger dan de gewone trainers (armor "middel", wapen zwaard) en dragen kleuren van het volk.

## 3. De speler (dux)

- `trn_dux_battle_back.png` (192×192): jouw leider van achteren, links onderin het gevecht, bij een trainergevecht en aan het begin van het VS-scherm. De speler kiest een eigen uiterlijk (de avatar-editor); dit is een neutrale standaard in Romeinse stijl (rode mantel, helm). Later kan het per uiterlijk worden aangepast.
- `trn_dux_portrait.png` (256×256): voor de linkerkant van het VS-scherm.

## 4. Bazen: wat er al is en wat nog mist

| Regio | Baas | Vorm-id | Opmerking |
|---|---|---|---|
| roma (catacumbae II) | Larva | `myt_larva` | klaar |
| gallia | Centaurus sagittarius | `myt_centaurussagitta` | klaar |
| graecia | Draco | `myt_draco` | **deelt zijn sprite met Persis**: graag een eigen draak (Colchis/Hydra-achtig) |
| persis | Draco | `myt_draco` | zie Graecia: eigen draak met Perzische kleuren |
| aegyptus | Mumia | `myt_larva` | **gebruikt nu de sprite van de Larva**: een echte mummie (verbonden, goud en lapis) ontbreekt |
| laconia | Gryps | `myt_gryps` | klaar |
| troia | Cyclops faber | `myt_cyclopsfaber` | klaar |
| germania | Lupus Martius | `myt_lupusmartius` | klaar |
| themiscyra | Equus alatus | `myt_equusalatus` | klaar |
| africa | Serpens | `myt_serpens` | klaar |

Wat Pokémon bij een baas extra doet, en dus een optie is: een grotere versie. Mijn voorstel is `<vorm>_boss_battle_front.png` (256×256) voor de tien bazen, zodat een baas er groter en bedreigender uitziet dan een gewone wilde van dezelfde vorm; ik laad dat bestand vóór het gewone.

## 5. Volgorde

1. Mumia (nieuw vormId, bv. `myt_mumia`) en een tweede draak (bv. `myt_draco2`): ik zet daarna de baas om naar die ID's.
2. De trainers van Latium en Roma (5 stuks) plus de speler (dux): daarmee kan ik de koppeling en het VS-scherm bouwen en testen.
3. De rest van de trainers en de kampioenen, regio voor regio.
4. Optioneel: de grote bazenversies.

## Wat ik doe zodra de eerste bestanden er zijn

- Een VS-scherm in de stijl van Pokémon (twee portretten tegen elkaar, "VS", de namen) voor trainer- en kampioensgevechten.
- De trainer als sprite aan de vijandkant in het beurtgevecht, met fallback op de avatar.
- Boss-intro met het grote wezen.
- Een controle in `tools/` die laat zien welke trainer- en baasbestanden nog ontbreken (zoals `castra-sprites-manifest.js` voor vormen).
