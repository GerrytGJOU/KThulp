# Castra Heroum — masterplan (Certamen-heldenspel)

Opgesteld 19 oktober 2026 · Gerben de Jong · status: **fase 1 in aanbouw** — framework staat (begaanbare castra, grondstoffen, gebouwen, soldaten werven); venatio, proelium, helden en Legio zijn nog stubs.

> Dit document is de **enige bron van waarheid** voor Castra Heroum (zie CLAUDE.md). Werk het bij na elke wijziging aan spelregels, features of datamodel. Pokémon-termen zijn alleen referentie; in het spel zelf staat alles in het Latijn.
> Punten gemarkeerd met **Voor Claude Code** zijn technische aanvullingen; zie §Techniek en koppeling (nog in te vullen) en de open vragen onderaan.

## Visie en doel

Werktitel: **Castra Heroum** (op het hoofdmenu van Certamen, BETA). Een uitbreiding van Certamen waarin leerlingen met hun bestaande avatar een eigen kamp leiden. Vanuit dat kamp jagen ze op soldaten en helden en kiezen ze hun volgende gevecht, volledig in eenvoudig Latijn.

- **Didactisch doel:** veel herhaalde, betekenisvolle input in het Latijn. Leerlingen lezen omdat ze moeten weten wat een held kan of wat een missie vraagt, niet omdat het een oefening is.
- **Hergebruik:** de Certamen-avatar is de speler (*dux*). Accounts, klassen en voortgang lopen via Certamen, zodat leerlingen niets nieuws hoeven aan te maken.
- **Speeltijd:** korte sessies van 5 tot 15 minuten, geschikt voor het eind van een les of als huiswerk.
- **Geen verdienmodel:** geen betalingen, geen loot boxes en geen timers die leerlingen 's avonds terugroepen. We lenen de structuur van commerciële games, niet hun verslavingsmechanismen.

## Wat we van elk spel lenen

Elk inspiratiespel levert één laag. De mechaniek nemen we over; namen, figuren en art van die spellen niet.

| Bron | Wat het spel is | Wat wij overnemen | Wat we bewust weglaten |
| --- | --- | --- | --- |
| Pokémon | Wezens verzamelen, teams bouwen, beurtgevechten met typevoordelen | Soldaten verzamelen en laten evolueren, helden als unieke legendarische vondsten, typevoordelen | Pokémon-namen en -ontwerpen, het ball-concept |
| Tower defence | Golven vijanden lopen een pad af; jij plaatst verdedigers | Elk gevecht vanuit de hub is een tower defence-missie met je eigen soldaten en helden | Eindeloze modi zonder leerdoel |
| [XP Hero](https://apps.apple.com/us/app/xp-hero/id6740618570) | Snelle actie-RPG: één held vecht door kamers vol monsters, upgradet wapens, verslaat bazen | Bazengevechten waarin de avatar zelf meevecht met gekozen uitrusting | Advertenties, grind-muren |
| [Kingshot](https://kingshot.net/wiki/guides/beginner-guide) | Strategiespel: stad bouwen, helden rekruteren, allianties | De castra als basis en hub, een hoofdgebouw dat de rest ontgrendelt, de klas als alliantie | Betaalde versnellingen, PvP om middelen, FOMO-evenementen |

## Kern-gameloop

Alles begint en eindigt in de castra: je kiest daar een activiteit, en wat je buitmaakt maakt je kamp en je troepen sterker.

```
                 ┌──────────────┐                      ┌──────────────┐
                 │   Venatio    │                      │   Proelium   │
                 │ jagen op     │                      │ tower defence│
                 │ soldaten en  │                      │ -gevecht op  │
                 │ helden       │                      │ de kaart     │
                 └──────┬───────┘                      └──────┬───────┘
     nieuwe soldaten    │                                     │  grondstoffen, XP,
     en heldensporen    │        ┌──────────────────┐         │  nieuwe regio's
                        └──────► │      CASTRA      │ ◄───────┘
                                 │ bouwen, troepen  │
                                 │ opstellen,       │
                                 │ laten evolueren  │
                                 └────────┬─────────┘
                                          │  gezamenlijke beloningen
                                 ┌────────┴─────────┐
                                 │      Legio       │
                                 │ klassenevenement │
                                 │ en ruilen        │
                                 └──────────────────┘
```

Een sterkere castra ontgrendelt nieuwe regio's en zwaardere gevechten, zodat de kringloop steeds een stap verder gaat.

## Eén ervaring: de castra als hub

Het spel is één doorlopende ervaring. De castra werkt zoals Pallet Town in Pokémon: een dorp waar je met je avatar rondloopt, gebouwen bouwt en mensen spreekt. Zodra je de poort uit loopt, het wild in, kom je in een spelmodus terecht.

### De castra (basis en hub)

- Elk gebouw heeft een eigen functie en wordt sterker als je het upgradet; zie *Gebouwen in de castra*.
- Het *praetorium* bepaalt het maximale niveau van de andere gebouwen. Hogere niveaus ontgrendelen nieuwe regio's en zwaardere gevechten.
- Grondstoffen: *frumentum*, *lignum*, *aes*, *gloria*. De mijn en de houthakker lopen in realtime vol en je verzamelt door erop te klikken. De opslag is binnen een paar uur vol en er is geen straf als je later komt, zodat leerlingen niet 's avonds terug hoeven.
- Je loopt vrij rond in de castra (bovenaanzicht, zoals in RPG Maker). Elk gebouw open je door er naar binnen te lopen, en bewoners geven in het Latijn missies en tips. Wie via een poort naar buiten loopt, kiest daarmee een activiteit, en na afloop sta je weer in het kamp.
- De poorten volgen een echt Romeins legerkamp: via de *porta decumana* ga je op venatio, via de *porta praetoria* naar de campagnekaart voor een proelium. Klassenevenementen start je in de *principia*, midden in het kamp.

### Gebouwen in de castra

Het *praetorium* bepaalt hoeveel gebouwen je mag hebben en tot welk niveau ze kunnen, zoals het Town Hall in Clash of Clans. Elk ander gebouw versterkt één kant van je leger.

| Gebouw | Functie | Wat upgraden doet | Inspiratie |
| --- | --- | --- | --- |
| *Praetorium* | Hoofdgebouw | Verhoogt het maximale level van soldaten en het maximale niveau en aantal van andere gebouwen | Clash of Clans |
| *Contubernia* | Barakken | Meer soldaten die je tegelijk kunt hebben | Clash of Clans (legerkampen) |
| *Campus* | Trainen en evolueren | Meer trainingsplekken, hogere evolutiestadia mogelijk (trainen blijft altijd minder opleveren dan vechten) | — |
| *Ludus* | Soldaten leren nieuwe aanvallen | Hogere aanvalsniveaus, lagere kosten | Darkest Dungeon (gilde) |
| *Fabrica* | Smederij: uitrusting en statbonussen voor soldaten | Betere uitrusting, lagere kosten | Darkest Dungeon (smid) |
| *Heroum* | Heldenzaal: hier wonen je helden | Meer heldenmissies en gespreksonderwerpen | Fire Emblem, Suikoden |
| *Valetudinarium* | Gewonde soldaten herstellen na gevechten | Sneller herstel, meer bedden | Darkest Dungeon (abdij, taverne) |
| *Dilectus* | Wervingskantoor met elke week nieuwe rekruten | Meer keuze, grotere kans op goede IV's | Darkest Dungeon (stage coach) |
| *Metallum* | Mijn: levert *aes* | Hogere opbrengst, grotere opslag | Clash of Clans, Palworld |
| *Lignatio* | Houthakker: levert *lignum* | Hogere opbrengst, grotere opslag | Clash of Clans, Palworld |
| *Horreum* | Opslag | Hoger opslagmaximum | Clash of Clans |
| *Templum* | Kies per dag de zegen van één god, bijv. Mars (aanval) of Mercurius (sneller verzamelen) | Sterkere zegens, meer goden | — |
| *Forum* | Grondstoffen ruilen tegen een vaste koers | Betere koers | — |
| *Navalia* | Scheepswerf | Ontgrendelt de vlootlijn en waterregio's | — |
| *Stabula* | Stallen | Ontgrendelt en versterkt de ruiterijlijnen | — |
| *Bibliotheca* | Codex (Pokédex) | Meer informatie per eenheid | — |
| *Murus* | Verdediging van je kamp bij *defensio* | Sterkere muren | — |
| *Arcus triumphalis* | Decoratie per verslagen baas | — | — |

- **Soldaten aan het werk:** soldaten die niet in je gevechtsteam zitten, kun je laten werken in de mijn of bij de houthakker. Hun stats bepalen de opbrengst, zoals in Palworld en Fallout Shelter. Zo blijven dubbele soldaten met minder goede IV's nuttig.
- **Helden leiden gebouwen:** een held die je aan een gebouw toewijst, geeft daar een bonus, zoals de personages die in Suikoden het hoofdkwartier runnen. Bijvoorbeeld Hercules in de *campus* (sneller trainen), Ulixes op het *forum* (betere koers), Aeneas in het *templum* (sterkere zegen).
- **Gesprekken in de heroum:** korte Latijnse gesprekken met helden verhogen hun loyaliteit, en daarmee hun bonus. Dit is ook een sterk leesmoment.
- **Herstel na gevechten:** gewonde soldaten kunnen niet direct weer vechten. Wie vaak wil vechten, moet roteren met een grotere selectie.
- **Voor Claude Code:** realtime opbrengst berekenen op basis van tijdstempels (laatste keer verzameld), niet met een draaiende timer; het opslagmaximum begrenst de opbrengst.

### Venatio (jagen)

- Je trekt met je avatar een regio in (Latium, Graecia, Troia, de Onderwereld, en later meer) om nieuwe soldaten te werven.
- Gewone soldaten werf je na een kort beurtgevecht. Helden vind je alleen op speciale plekken en via missies, en je moet ze in het Latijn overtuigen om zich bij je aan te sluiten.
- Buit: nieuwe soldaten, en soms een spoor naar een held.

### Proelium (gevecht kiezen)

- Op een campagnekaart kies je je volgende gevecht. Elk gevecht is een tower defence-missie: golven vijanden, jij plaatst soldaten en helden langs het pad.
- Typen gevechten: *defensio* (je eigen kamp verdedigen), *oppugnatio* (een vijandelijke stad aanvallen) en bazengevechten waarin je avatar zelf meevecht (de XP Hero-laag).
- Voor elk gevecht verschijnt een Latijns verkenningsbericht over wat er aankomt. Wie het begrijpt, stelt beter op.
- Buit: grondstoffen, XP voor je soldaten en toegang tot nieuwe regio's.

### Legio (met de klas)

- De klas is een alliantie. Bij klassenevenementen (bijv. *Obsidio Troiae*) vecht iedereen mee tegen één gezamenlijke baas. Dat maakt het coöperatief, niet competitief.
- Leerlingen kunnen soldaten ruilen binnen de klas, via een korte Latijnse transactie.

### Multiplayer-aanpak (voor Claude Code)

Coöperatieve tower defence kan via de bestaande Firebase-koppeling van Certamen, zonder eigen server. We synchroniseren alleen acties van spelers, niet de spelwereld zelf.

- **Deterministic lockstep:** elke browser draait dezelfde simulatie (zelfde kaart, golven en random seed). Via Firebase gaan alleen acties, bijv. "speler 3 plaatst een triarius op vak (12,7) bij tick 450". Acties worden een halve seconde vooruit ingepland, zodat ze bij iedereen op tijd binnen zijn.
- **Determinisme bewaken:** rekenen met gehele getallen of fixed-point in plaats van floats, een vaste tick-snelheid en een eigen seeded randomgenerator.
- **Realtime Database, niet Firestore:** sneller en goedkoper voor veel kleine, snelle berichten.
- **Opnieuw aansluiten:** wie wegvalt, sluit weer aan door de actielijst opnieuw af te spelen.
- **Limieten:** controleer het maximum aantal gelijktijdige verbindingen van het Firebase-plan. Eén klas past waarschijnlijk ruim, een hele jaarlaag tegelijk misschien niet.
- **Valsspelen:** in een coöperatief klassenspel weinig relevant. Wil je toch controle, laat dan een Firebase Cloud Function achteraf de uitslag nagaan.
- **Geen lockstep voor snelle actie:** bazengevechten waarin de avatar zelf meevecht blijven singleplayer, of delen alleen een gezamenlijke levensbalk van de baas via Firebase.
- **Wanneer wél een server:** alleen bij competitief PvP in realtime, en dat valt buiten dit plan.

## Verzamelen: soldaten en helden

Twee soorten eenheden. Soldaten verzamel je in aantallen en laat je evolueren; helden zijn zeldzaam, uniek en evolueren niet, net als legendarische Pokémon.

### Soldaten (evolueren)

Een soldaat evolueert in de *campus* zodra hij genoeg XP heeft en het gebouw hoog genoeg is. De stadia volgen de spellogica en zijn niet altijd historisch exact. Eerste voorstel: 18 lijnen, ongeveer 45 vormen.

| Lijn | Stadium 1 | Stadium 2 | Stadium 3 | Rol in gevecht |
| --- | --- | --- | --- | --- |
| Legioen | Hastatus | Princeps | Triarius | Zware infanterie, blokkeert het pad |
| Rangen | Miles | Optio | Centurio | Leider, versterkt soldaten om zich heen |
| Licht | Veles | Funditor | Sagittarius | Afstand |
| Ruiterij | Eques | Decurio | Praefectus alae | Snel, valt flanken aan |
| Vaandel | Tubicen | Signifer | Aquilifer | Ondersteuning, verhoogt moreel |
| Zorg | Capsarius | Medicus | | Genezer |
| Beleg | Faber | Ballistarius | Architectus | Schade op een gebied |
| Verkenning | Explorator | Speculator | | Onthult verborgen vijanden |
| Vloot | Remex | Classiarius | Navarchus | Sterk bij water en havens |
| Arena | Tiro | Murmillo, Retiarius of Secutor | | Duellist; vertakt in drie richtingen |
| Phalanx | Ephebus | Hoplites | Lochagus | Grieks, blokkeert in formatie |
| Lichte Grieken | Psilus | Peltasta | | Grieks, snel op afstand |
| Kreta | Toxota | Hippotoxota | | Grieks, boogschutter te paard |
| Macedonië | Hippeus | Hetairus | | Grieks, zware ruiterij |
| Saters | Satyrus | Silenus | | Mythisch, verwart vijanden |
| Nimfen | Nympha | Dryas of Naias | | Mythisch, geneest; vertakt |
| Harpijen | Harpyia | | | Mythisch, vliegt over obstakels |
| Grijpvogels | Gryps | | | Mythisch, sterke vlieger |

Typevoordelen houden we eenvoudig: infanterie wint van ruiterij, ruiterij van afstand, afstand van infanterie. Mythische wezens en helden vallen daarbuiten.

### Geen twee soldaten gelijk

Twee soldaten van hetzelfde type verschillen altijd een beetje, net als bij Pokémon. Daarom loont het om meerdere exemplaren te werven en alleen de beste te trainen.

| Kenmerk | Pokémon-equivalent | Wat het is | Variatie |
| --- | --- | --- | --- |
| Basiswaarden | Base stats | Vaste waarden per type: *vita* (levenspunten), *impetus* (aanval), *tutela* (verdediging), *celeritas* (snelheid), *ambitus* (bereik) | Gelijk voor elke soldaat van dat type |
| *Indoles* (aanleg) | IV's | Een verborgen extra per waarde, bij het werven willekeurig bepaald | 0 tot 15 punten per waarde; een hastatus met hoge impetus slaat merkbaar harder |
| *Ingenium* (karakter) | Nature | Eén eigenschap die een waarde iets verhoogt en een andere iets verlaagt, bijv. *ferox* (+impetus, −tutela), *cautus* (+tutela, −celeritas), *celer* (+celeritas, −vita) | Ongeveer 10 karakters, elk +10% / −10% |
| *Insignis* (uitzonderlijk) | Shiny | Een zeldzame variant met een andere kleur en een kleine bonus op alle aanleg | Ongeveer 1 op de 200 |

**Stat-namen (besloten):** de Latijnse namen hierboven blijven staan en worden gekoppeld aan Battle Mode (vita = HP, impetus = schade, tutela = schild); zie §Techniek en koppeling.

- **Aanleg lezen in het Latijn:** de trainer in de *campus* beoordeelt je soldaten in korte zinnen, bijv. *"Hic miles impetu excellit, sed tardus est."* Wie de beoordeling begrijpt, weet wie hij moet trainen.
- **Overbodige soldaten:** met *missio honesta* (eervol ontslag) ontsla je dubbele soldaten. Je krijgt dan grondstoffen terug, zodat verzamelen nooit verspilling is.
- **Helden** hebben vaste waarden en geen aanleg of karakter. Elke Achilles is gelijk; het verschil zit alleen in zijn level.

### Helden (legendarisch, evolueren niet)

- Elke held is uniek en sterk, en evolueert niet. Helden krijgen XP uit gevechten, net als soldaten, maar volgen een tragere XP-curve.
- Je vindt een held via een spoor uit de venatio of een campagnegevecht, en je moet hem in het Latijn overtuigen.
- Elke regio heeft één of twee helden. Eerste voorstel:
    - **Latium en Roma:** Aeneas, Romulus, Horatius Cocles, Cloelia, Mucius Scaevola, Camilla
    - **Graecia:** Hercules, Perseus, Theseus, Atalanta, Iason
    - **Troia:** Achilles, Hector, Ulixes, Penthesilea
- Namen staan in hun Latijnse vorm, zodat leerlingen de vormen leren die ze in teksten tegenkomen.

### Compleet maken: alles te vinden, niets cadeau

Elke leerling kan in zijn eentje alle 45 soldatenvormen en alle 15 helden verzamelen. Elke held is uniek per leerling. Net als bij Pokémon kost dat tijd en moeite.

- **Zeldzaamheid:** sommige soldaten komen alleen in één regio voor, alleen in bepaald terrein (water, bos, ruïnes), of maar zelden. Je moet dus gericht zoeken.
- **Helden vinden:** elke held vraagt een keten van missies in zijn eigen regio. Die eindigt met een Latijns gesprek waarin je hem moet overtuigen, en vaak met een gevecht om je waardig te tonen.
- **Trainen:** soldaten winnen XP vooral door te vechten. Bijtrainen in de campus werkt als de Day Care in Pokémon: het gaat vanzelf, maar levert duidelijk minder op (richtlijn: hooguit een kwart van wat vechten in dezelfde tijd oplevert), kost grondstoffen en heeft een maximum per dag. Evolueren vraagt genoeg XP, een *campus* van het juiste niveau en soms een voorwerp uit een specifieke regio.
- **Helden laten groeien:** helden stijgen langzaam in level. Hun eigen heldenmissies verhogen telkens het maximale level, dus wie zijn held wil maxen, moet die missies doen.
- **Codex** (Pokédex): in de *bibliotheca* staat een overzicht van alle vormen en helden, met per gevonden eenheid een korte Latijnse beschrijving. Ontbrekende staan erin als silhouet.
- **Ruilen blijft optioneel:** omdat alles solo te vinden is, is ruilen in de Legio een handigheid, geen voorwaarde.

## Latijn in het spel

Alle speltekst is Latijn. Moeilijkheid stijgt mee met de regio's, en vertaalhulp is altijd één tik weg.

- **Taalniveaus per regio:** Latium gebruikt korte zinnen in de praesens, met woorden uit de eerste hoofdstukken van de methode. Latere regio's voegen perfectum, bijzinnen en participia toe.
- **Vertaalhulp:** tik op een woord voor de betekenis, en op de zin voor een vertaling. Hulp kost niets, maar wordt per woord gelogd voor de docent.
- **Herhaling:** een vaste kern van zo'n 150 tot 200 spelwoorden (*pugnare, vincere, castra, hostis, miles*) komt steeds terug in menu's en meldingen.
- **Taal als mechaniek:** helden rekruteren, verkenningsberichten lezen, aanleg beoordelen, ruilen en missies accepteren werken alleen goed als je de tekst begrijpt. De taal is nooit decoratie.
- **Authentieke verhalen:** missieteksten zijn vereenvoudigde versies van Hyginus, Apollodorus en Ovidius.
- **Grieks:** het systeem is meertalig opgezet, zodat er later een Griekse regio of modus bij kan.
- Alle Latijnse teksten en vertalingen staan in losse databestanden, zodat de docent ze kan aanpassen zonder code te raken.

## Fasering

We bouwen eerst de castra en daarna één activiteit tegelijk, en testen elke stap in de klas voordat de volgende begint. Fase 1 levert al een speelbaar spel op.

| Fase | Inhoud | Gate (klastest) voordat de volgende fase begint |
| --- | --- | --- |
| 0 · Ontwerp | Verzamellijst van soldaten en helden, art-stijl en verhaal per regio vastleggen | Lijst en art-stijl akkoord, techniek aangevuld door Claude Code |
| 1 · Castra en Venatio | Begaanbaar kamp met eerste gebouwen, jagen in Latium, eerste soldatenlijnen en evolutie | Klastest laat zien dat leerlingen het Latijn echt lezen |
| 2 · Proelium | Campagnekaart en tower defence-gevechten met je eigen soldaten | Jagen en vechten samen leuk én leerzaam in de klastest |
| 3 · Helden | Legendarische helden vinden en overtuigen, bazengevechten met de avatar | Leerlingen blijven een week lang uit zichzelf spelen |
| 4 · Legio | Klassenevenementen, ruilen, docentoverzicht, koppeling met Certamen | Alles werkt met echte Certamen-accounts |
| Pilot en uitbreiding | Pilot in meerdere klassen, daarna nieuwe regio's, soldatenlijnen en een Griekse modus | — |

Duur per fase hangt vooral af van hoe snel de sprites er zijn; de code is zelden de bottleneck.

## Wat Gerben aanlevert

De grootste klus is art voor de soldaten, helden en gebouwen. De rest kan uit Certamen komen of door Claude worden gemaakt.

- [ ] Akkoord op of aanpassing van de lijst soldatenlijnen en helden
- [ ] Sprites per soldatenvorm (ongeveer 45): een loopsprite, een gevechtssprite en een kleine versie als toren
- [ ] Sprites per held (15): dezelfde drie varianten, met iets meer detail
- [ ] Sprites van vijanden (mythische wezens), plus enkele bazen
- [ ] Een tileset voor de castra als begaanbaar dorp, met gebouwen in 2 of 3 upgradeniveaus
- [ ] Een mediterrane tileset voor de regio's en de tower defence-paden (of hergebruik uit Certamen)
- [ ] Woordenlijsten per fase uit de methode
- [ ] Keuze welke mythen per regio worden verteld

De UI, iconen, Latijnse teksten (ter controle door Gerben) en alle code maakt Claude.

## Sprites maken met ChatGPT

Sprites die niet uit RPG Maker komen, worden met ChatGPT gemaakt, met een vaste stijlgids, vaste prompts en een korte nabewerking.

### Wat waar vandaan komt

| Soort sprite | Bron |
| --- | --- |
| Loopsprites van soldaten en helden (in de castra en in het wild) | De Character Generator van RPG Maker MV, zodat ze naast de Certamen-avatars passen |
| Gevechtssprites (voor- en achteraanzicht) | ChatGPT |
| Torenversies voor tower defence | ChatGPT, of verkleinde gevechtssprites |
| Vijanden en bazen | ChatGPT |
| Gebouwen in de castra, per upgradeniveau | ChatGPT |
| Uitzonderlijke (shiny) varianten | Geen nieuwe sprites: het spel kleurt de gewone sprite om (palette swap) |

### Stijlgids (eerst vaststellen)

- **Referentie:** 3 tot 5 screenshots uit Certamen plus enkele RPG Maker MV-sprites, bij elke prompt als voorbeeldafbeelding.
- **Stijl:** pixel art in 16-bit JRPG-stijl, donkere contourlijnen, zachte cel-shading, maximaal 32 kleuren per sprite. Definitieve beschrijving volgt uit de screenshots.
- **Formaten:** gevechtssprites 96×96 px, torens en loopsprites 48×48 px (tilegrootte RPG Maker MV), gebouwen in veelvouden van 48 px.
- **Achtergrond:** altijd transparant, één figuur in het midden, geen tekst, geen schaduw op de grond.
- **Historie:** uitrusting zo kloppend als het spel toelaat (bijv. een Montefortino-helm voor hastati). Gerben controleert dit.

### Prompts (sjablonen)

Prompts in het Engels; het stijlblok staat vooraan in elke prompt.

```
STYLE: Pixel art game sprite in 16-bit JRPG style, matching the attached reference images (RPG Maker MV look). Clean dark outlines, soft cel shading, max 32 colors, no anti-aliasing, no dithering noise. Transparent background, single figure centered, full body, no text, no ground shadow.
```

```
[STYLE] Battle sprite, 96x96 pixels. A Roman hastatus (Republican era, 3rd century BC): bronze chest plate, bronze Montefortino helmet with tall purple and black feathers, large oval shield, short sword, two javelins. Three-quarter front view, battle-ready pose.
```

```
[STYLE] The exact same character as in the attached image, now seen from behind (three-quarter back view). Keep proportions, colors and equipment identical.
```

```
[STYLE] One sheet with three evolution stages side by side, same scale: 1) hastatus [description], 2) princeps [description], 3) triarius with long thrusting spear [description]. Each stage looks clearly more experienced and better equipped than the one before.
```

```
[STYLE] Legendary hero battle sprite, 96x96 pixels, more detail and gold accents than regular soldiers: Achilles [description of armor, shield, weapon, pose].
```

```
[STYLE] Top-down three-quarter view building for an RPG Maker MV map, 144x144 pixels (3x3 tiles of 48 px): a Roman praetorium, upgrade level [1/2/3]. Level 1: [simple wooden version]. Level 3: [stone version with columns].
```

Vaste werkwijze: genereer een hele evolutielijn in één afbeelding, zodat de stadia bij elkaar passen, en gebruik een geslaagde sprite als referentie voor de volgende.

### Nabewerking

1. Verkleinen naar het doelformaat met nearest neighbour (geen vervaging).
2. Kleurenpalet terugbrengen naar het afgesproken palet.
3. Achtergrond en losse pixels controleren en opschonen (Aseprite of Piskel).
4. Naast de bestaande Certamen-sprites leggen om stijl en formaat te vergelijken.

**Voor Claude Code:** automatiseer stap 1 en 2 met een script, zodat alleen de laatste controle handwerk blijft.

## Valkuilen en open vragen

- **Scope:** de castra plus drie activiteiten is veel. Per fase één activiteit afbouwen en in de klas testen.
- **Leerwinst lekt weg:** als je kunt winnen zonder te lezen, slaan leerlingen het Latijn over. Elk onderdeel moet minstens één beslissing hebben die van de tekst afhangt.
- **Ongelijkheid tussen leerlingen:** fanatieke spelers lopen ver voor. Klassenevenementen moeten coöperatief zijn, en de beloningen moeten bij een bepaald niveau afvlakken.
- **Art-productie:** zonder consistente sprites ziet het er rommelig uit. Spreek vooraf één stijl en één formaat af.

Open vragen:

- [ ] Techniek en koppeling met Certamen: aan te vullen door Claude Code (zie §Techniek en koppeling)
- [x] Stat-systeem → **Latijnse namen, gekoppeld aan HP/schade/schild van Battle Mode** (2026-10-19, zie §Techniek)
- [x] Losse app of modus? → **Modus binnen Certamen** (tegel op het hoofdmenu, 2026-10-19)
- [ ] Speelt de klas samen in de les, thuis, of allebei?
- [ ] Welke werktitel? (voorlopig: **Castra Heroum**)

## Techniek en koppeling

Inventarisatie van de Certamen-code, 2026-10-19 (nog géén besluiten; dit is wat er ligt):

**Stats: er is geen per-eenheid-statsysteem om over te nemen.** Battle Mode rekent op *team*-niveau met `BM_CLASSES` (`certamen/battle-data.js`): per klasse één passief + vaardigheden met `dmg` (schade), `shld` (schild), `heal` (heling), `cost` (Actiepunten, AP), plus HP per leger en skill-trees (`skilltree-data.js`). De Latijnse stat-namen uit het plan (*vita, impetus, tutela, celeritas, ambitus*) zijn dus **nieuw** en botsen niet. Voorstel om één vocabulaire te houden: *vita* = HP, *impetus* = `dmg`, *tutela* = `shld`/verdediging, plus de nieuwe *celeritas* en *ambitus* (alleen tower defence). **Besloten 2026-10-19:** de Latijnse namen worden gebruikt, gekoppeld aan Battle Mode: *vita* = HP, *impetus* = schade (`dmg`), *tutela* = schild/verdediging (`shld`), *celeritas* en *ambitus* nieuw (snelheid en bereik, alleen tower defence). Leerlingen zien in de Battle Mode-FAQ en in Castra Heroum dezelfde koppeling (HP ≙ vita, enz.) uitgelegd.

**Identiteit/avatar:** leerling = `certamen_battle_identity` (localStorage) + `identities/{klas}/{lid}` in Realtime Database (naam, xp, level, coins, avatar, `apps/{appId}/{score,detail,updatedAt}`). Leerlingen loggen niet in via Firebase Auth (zie CLAUDE.md); de avatar wordt gerenderd met `renderPixelHeroIcon()` (`battle.js`). Castra Heroum hergebruikt dit zonder wijziging.

**Avatar als top-down sprite (besloten 2026-10-19, gebouwd):** geen eigen avatarsysteem. De avatar uit de Certamen-profieleditor (`BM_IDENT.avatar`) wordt in Castra Heroum getoond met top-down loopsprites uit `certamen/assets/sprites-topdown/`. Die map spiegelt `assets/sprites/` met **exact dezelfde bestandsnamen** (lijst en formaat: `assets/sprites-topdown/README.txt`; RPG Maker MV-loopsheet 144×192, frame 48×48, rijen onder/links/rechts/boven). `certamen/castra-avatar.js` leidt de paden af uit `PIXEL_ASSETS` (battle.js) en hergebruikt `bmAvatarMerge`, `bmZichtbaarHaar` en alle kleurfilters, dus elke nieuwe avatar-optie werkt vanzelf mee zodra het bestand bestaat. `castraAvatarHTML(av, dir, frame, sizePx)` rendert de lagen; ontbreekt de top-down base-sprite nog, dan valt het terug op de battler-avatar (stap-voor-stap uploaden kan). Wijzig je de laagvolgorde of een filter in `_bmPixelLayers` (battle.js), pas dan ook `castraAvatarHTML` aan.

**Opslag Castra-voortgang (voorstel):**
- Primair lokaal (offline-first, zoals Chronica), met sync naar `identities/{klas}/{lid}/castra` als één compacte JSON-tak (de bestaande regels leggen geen beperking op onbekende kinderen, maar er is een eigen `.validate` met groottelimiet nodig).
- Grondstoffen/opbrengst via tijdstempels (`lastCollected`), geen timers.
- Docentoverzicht (hulpgebruik per woord, voortgang) volgt het `classAnalyticsChronica`-patroon in `database.rules.json`.

**Multiplayer (fase 4):** `rooms/{code}` is open lees/schrijfbaar en wordt al voor realtime gevechten gebruikt; actie-lockstep past daar in. Eerst een prototype met één klas meten voordat dit vastligt.

**Bestandsindeling (voorstel, fase 1):** `certamen/castra.js` (scherm + spel), `castra-data.js` (soldaten, helden, gebouwen, Latijnse teksten als pure data), eigen `?v=`-cachebuster in `certamen/index.html`. Bij Firebase-wijzigingen geldt de regel uit CLAUDE.md: altijd het volledige regelsbestand tonen.

## Stand van de bouw (framework, 2026-10-19)

- `certamen/castra-data.js`: pure data (grondstoffen, stats, 19 gebouwen waarvan 7 geplaatst, 18 soldatenlijnen, 15 helden, regio's, balans, kaartindeling).
- `certamen/castra.js`: staat + opslag (localStorage per klas/leerling, gast als terugval; best-effort sync naar `identities/{klas}/{lid}/castra`, nog zonder eigen Firebase-regel), grondstoffen via tijdstempels, upgrades (begrensd door praetorium-level), soldaten werven met seeded RNG (aanleg, karakter, insignis), en `SCREENS.castraHome`: top-down kamp 16×12 tegels met lopen (pijltjes/WASD, D-pad, tik-om-te-lopen met BFS), gebouwpanelen, poorten.
- Gebouwen nu speelbaar: praetorium (levert frumentum), contubernia (soldatenlijst, testwerving), lignatio, metallum, horreum (opslagmaximum), campus en principia (stub).
- Poorten (`porta decumana` → venatio, `porta praetoria` → proelium) en de principia (Legio) tonen nog alleen een melding.
- Ontwerpkeuze, nog te bevestigen: het praetorium levert *frumentum* (de plannen noemen geen producent voor graan).
- **Venatio** (`certamen/castra-venatio.js`, poort *porta decumana*): regio Latium (andere regio's op slot), 4 terreinen met eigen soldatenlijnen (saters alleen in het bos, nimfen en vloot bij de Tiber). Loop: Latijns verkenningsbericht noemt het vijandtype (*pedites/equites/sagittarii/auxilia/monstra*) → je kiest welke soldaat je stuurt (driehoek infanterie > ruiterij > afstand > infanterie, ×1,5 / ×0,75) → beurtgevecht *Oppugna!* / *Defende!* → buit, XP, level-up (max 4 × praetorium-level), 8% kans op een heldenspoor (alleen opgeslagen in `CASTRA.traces`, missies volgen in fase 3) → de verslagen vijand mag je opnemen (behoudt zijn eigen aanleg/karakter/insignis). Zonder soldaat vecht de dux zelf (vaste stats, geen blessure). Verlies = soldaat 10 min gewond.
- Balans (gesimuleerd, 600 jachten): dux ≈ 50% winst; soldaat die het type níet leest ≈ 44%; soldaat die het juiste type kiest ≈ 99% — lezen loont dus sterk. Waarden in `CASTRA_V_BAL`.
- **Latijnse laag** (`certamen/castra-latin.js`): vaste zinnen in `CASTRA_LA`, glossarium in `CASTRA_GLOSS`; tik op een woord = betekenis, tik op ⓘ = zinsvertaling, beide gratis. Gebruik wordt gelogd in `CASTRA.help` (`words`/`sentences`) voor het toekomstige docentoverzicht.
- **Campus** (`certamen/castra-campus.js`): bijtrainen (20 min, kost frumentum, max 5 per dag, oefenplekken = campus-level, +5 +2/level XP; vechten levert meer op), evolueren (stadium 1→2: soldaat Lv 5 + campus Lv 2; 2→3: Lv 10 + campus Lv 4; vertakkingen Arena/Nimfen kiest de speler) en *missio honesta* (eervol ontslag in de contubernia: frumentum + aes terug). Het soldaat-level is begrensd door het praetorium (4 × level), dus evolueren dwingt het hele kamp mee te groeien. Waarden in `CASTRA_BAL` (`evo`, `train`, `releaseRefund`).
- **Tegelkaarten** (`certamen/castra-map.js`, tilesets `assets/tilesets/`): RPG Maker MV-tegels van 48 px (zelfde stijl en maat als de avatar-sprites). Het kamp is nu een echte tegelkaart (tenten, palissade, kratten, bomen); hoge objecten hebben een bovenrij die óver de avatar valt. Gebouwen krijgen hun uiterlijk uit `CASTRA_BUILDING_ART`. De RTP-tilesets blijven in de repo (bevestigd door Gerben, 2026-10-20; zie README in de map).
- **De wereld van Latium** (`certamen/castra-world.js`): porta decumana leidt naar een scrollende kaart van 32×24 tegels met vier zones (silva, via, campus, Tiber-oever). Hoog gras (donkergroen met bladpollen) start met 14% kans per stap een ontmoeting met het terrein van die zone; daarna het Latijnse verkenningsbericht, gevecht en *Perge!* terug naar de kaart. Terug naar het kamp via de uitgang onderaan. Nog geen water (Tiber) en geen NPC's/gebouwen in de wereld.
- **Tegelkaarten** (`certamen/castra-map.js`, tilesets `assets/tilesets/`): RPG Maker MV-tegels van 48 px (zelfde stijl en maat als de avatar-sprites). Het kamp is nu een echte tegelkaart (tenten, palissade, kratten, bomen); hoge objecten hebben een bovenrij die óver de avatar valt. Gebouwen krijgen hun uiterlijk uit `CASTRA_BUILDING_ART`. **Licentie van de RTP-tilesets nog te controleren** (zie README in de map).
- **De wereld van Latium** (`certamen/castra-world.js`): de porta decumana leidt naar een scrollende kaart van 32×24 tegels met vier zones (silva, via, campus, Tiber-oever). Hoog gras (donkergroen met bladpollen) start met 14% kans per stap een ontmoeting met het terrein van die zone; daarna het Latijnse verkenningsbericht, gevecht en *Perge!* terug naar de kaart. Terug naar het kamp via de uitgang onderaan. Nog geen water (Tiber), NPC's of gebouwen in de wereld.
- **Duimbesturing** (`certamen/castra-stick.js`): raak je de kaart aan en sleep je, dan verschijnt een drijvende joystick op de plek van je duim (zoals Kingshot); het personage loopt door zolang je vasthoudt, in 4 richtingen. Een korte tik (zonder slepen) loopt naar die tegel of opent een gebouw. Werkt met aanraking, pen en muis; de pijltjesknoppen verdwijnen op aanraakschermen (`pointer:coarse`), pijltjes/WASD blijven op toetsenborden. Alleen getest met gesimuleerde pointer-events, nog niet op een echte iPad/telefoon.
- **Opdrachten en personen** (`certamen/castra-quests.js`): in Latium staat Aeneas (getekend met dezelfde top-down avatar-lagen als de speler). Hij geeft in het Latijn een opdracht (*Tres hostes in silva vince*): wie leest, weet hoeveel en in welk gras. Voortgang telt alleen bij winst in dat terrein; afronden geeft 5 gloria en Aeneas als held (`CASTRA.heroes`, zichtbaar in de contubernia; het heroum volgt in fase 3). Praten: tegen hem aan lopen of op hem tikken. Opdrachtstatus in `CASTRA.quests`.
- **Regio's** (`castra-world.js`, `CASTRA_WORLDS`): porta decumana → *regiokeuze* (kaart) → Latium, Graecia (opent na m2) of Troia (opent na g1). Elke regio heeft een eigen vaste, gegenereerde wereld (ondergrond, wegen, water/zee, zones met eigen terreinen, bomenset) en eigen soldatenlijnen per terrein (zie `CASTRA_VENATIO` in `castra-latin.js`; Griekse lijnen en mythische wezens in Graecia/Troia). Proelium-missies per regio: Latium m1–m3, Graecia g1–g2 (*Labor primus*, *Labyrinthus*), Troia t1–t2 (*Muri Troiae*, *Equus ligneus*). Balans gesimuleerd: g1 ≈ 6 soldaten Gr.6, g2 ≈ Gr.8, t1 ≈ Gr.10, t2 ≈ Gr.12; alleen één type verliest steeds.
- **De Tiber** is nu water (Outside_A1, rechte oevers, geen autotile-randen) met een brug op de weg; alleen de brug is begaanbaar. Zone *tiberis* ligt op de westoever.
- **Proelium** (`castra-proelium.js` simulatie, `castra-battle.js` schermen): porta praetoria → campagnelijst (3 missies in Latium, elk ontgrendelt de volgende) → tower defence. Je soldaten zijn de torens (max 4 + 2 × praetorium-level): bereik uit ambitus, schade uit impetus, tempo uit celeritas; infanterie > ruiterij > afstand > infanterie (×1,5 / ×0,75); *sup*-soldaten geven buren +25%. Het Latijnse verkenningsbericht noemt per golf (*ala*) het vijandtype. Zonder soldaat verdedigt de dux. Winst: grondstoffen, gloria, XP voor de ingezette soldaten.
- **De simulatie is deterministisch** (vaste tick van 50 ms, gehele getallen in duizendste tegels, alleen de seeded missie-RNG; `castraPRunHeadless()` voor tests) — twee runs met dezelfde plaatsing geven identieke uitkomsten. Dat is de voorbereiding op de coöperatieve lockstep-modus (Legio).
- Balans (gesimuleerd, `hpMult` per missie): m1 4 soldaten Gr.1 → winst met ±5 levens, dux alleen verliest; m2 vraagt ±6 soldaten Gr.3; m3 vraagt ±6 soldaten Gr.5 en goede typekeuze (alleen infanterie verliest).
- **Heroum en helden** (`castra-heroes.js` data/logica/paneel, `castra-quests.js` ketenengine): het *heroum* (tent, naast de principia) is een echt gebouw. Een held heeft vaste basiswaarden die +10% per level groeien (cap 5, +3 per 25 *fides*, max 20; XP-curve 30 × level). Missieketen per held: *kill* (n vijanden in een terrein) → *win* (een proelium-missie) → *persuade* (Latijnse keuzevraag; fout = opnieuw). Daarna komt hij in het heroum. **Alle 15 helden zijn uitgewerkt** (`CASTRA_HERO_DATA`: stats, uiterlijk, lievelingsgebouw, plek in de wereld, keten, 3 gesprekken). Latium: Aeneas (altijd te vinden, silva → m1), Romulus (campus → m2), Horatius (Tiber → m2), Cloelia (Tiber → m3), Mucius (via → m3), Camilla (silva → m3). Graecia: Hercules (mons → g1), Perseus (litus → g1), Atalanta (olea → g1), Theseus (urbs → g2), Iason (litus → g2). Troia: Achilles (campus → t1), Hector (muros → t1), Ulixes (litus → t2), Penthesilea (scamander → t2). Op Aeneas na verschijnt elke held pas na een spoor uit de venatio (`CASTRA.traces`; 15% kans per winst, gegarandeerd na 5 winsten zonder spoor). De antwoordopties van gesprekken en overtuigvragen staan in vaste, per vraag geschudde volgorde (`castraOptOrder`), zodat het goede antwoord niet altijd vooraan staat; een nieuwe held toevoegen = één blok in `CASTRA_HERO_DATA` (stats, look, ketenstappen, gesprekken) plus eventueel glossarium-woorden (controle: alle Latijnse woorden hebben een glossarium-entry, zie de test in de sessie 2026-10-23).
- **Colloquium** (loyaliteit): kort Latijns gesprek + vraag; juist = +10 fides en +6 XP. Max 2 + heroum-level gesprekken per dag (alle helden samen). **Assigna**: één held per gebouw (praetorium, lignatio, metallum, campus) geeft +20% + 0,2% per fides (×1,5 op zijn lievelingsgebouw, ★): meer opbrengst of meer trainings-XP. **In het proelium** vecht een held mee als toren (eerst in de lijst); hij krijgt XP na winst.
- **Valetudinarium en gewonden** (`castra-medical.js`): in het proelium raakt per doorgebroken vijand één soldaat van de voorste linie gewond (4 min), bij verlies alle ingezette soldaten (10 min); helden en de dux niet. Gewond = kan niet vechten. Het valetudinarium herstelt 15% sneller per level (max 75%); *Cura* (10 aes) geneest meteen.
- **Dilectus** (zelfde bestand): wisselend aanbod (elke 8 uur, 2 + level kandidaten, hoger level = betere aanleg: gemiddelde aanleg-som 38 → 44 → 46 voor level 1 → 3 → 5), werving kost 40 frumentum + 20 aes. De trainer beoordeelt elke rekruut in een Latijnse zin over beste en zwakste waarde (*Hic eques impetu excellit, sed tardus est.*): lezen = beter kiezen. Vervangt de testwerving in de contubernia; vanaf Graecia/Troia komen ook Griekse lijnen en mythische wezens in het aanbod.
- Nog niet: oppugnatio-/bazengevechten, kaartweergave (nu een lijst), Latijnse knoppen en meldingen in de bestaande kamppanelen (alleen venatio en campus-teksten zijn Latijn), Firebase-regels voor de `castra`-tak (groottelimiet), docentoverzicht van het hulpgebruik, zorgbalk/herstel (valetudinarium), tower defence, helden en missieketens, Legio.

## Bronnen

- [App Store: XP Hero](https://apps.apple.com/us/app/xp-hero/id6740618570)
- [Kingshot beginnersgids](https://kingshot.net/wiki/guides/beginner-guide)

## Wijzigingslog

- 2026-10-19: plan overgenomen; Boss Battle van het hoofdmenu gehaald (nu alleen via Battle Mode), tegel "Castra Heroum" (BETA) met placeholder-scherm toegevoegd.
