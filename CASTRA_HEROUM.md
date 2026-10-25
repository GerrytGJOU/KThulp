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
- **Legio** (`castra-legio.js`, klassenevenement; zie ook "Legio, tweede versie" onderaan): de docent start op de klaspagina (*Castra Heroum — Legio*) een evenement (*Obsidio Troiae*, 6 golven Griekse vijanden); leerlingen melden zich in de **principia** ("Adsum!") en verdedigen samen één kaart (max 2 soldaten per leerling; vijanden en basislevens schalen met het aantal deelnemers). **Deterministic lockstep zonder eigen server:** elke browser draait dezelfde deterministische simulatie uit (missie, seed); alleen de *plaats-acties* gaan via Firebase (`castraLegio/{klas}/actions`, elk met tick = nu + 12, gesorteerd op (tick, Firebase-sleutel)). Klok = servertijd (`.info/serverTimeOffset`) − `startAt`. Komt een actie te laat binnen, dan rekent de client de simulatie opnieuw uit de volledige actielijst (pure functie, enkele ms). Golven starten automatisch (voorbereiding 60 s, daarna 10 s tussen golven). Elke actie wordt overal gelijk gevalideerd (pad, boom, bezet, maximum per speler, stats begrensd). Beloning lokaal en eenmalig per evenement (`CASTRA.legio.claimed`). Getest: twee berekeningen (alles vooraf bekend vs. late actie middenin) geven identiek `tick/levens/kills`; de Firebase-koppeling is getest met een nep-database in het geheugen. **Niet getest met echte clients/Firebase.** Balans (gesimuleerd): ±12 spelers met soldaten Gr.9 of 20 spelers met Gr.6 winnen; 12 spelers met Gr.4 verliezen.
- **Commercium** (`castra-commercium.js`, tabblad in de principia): soldaten ruilen binnen de klas. *Offero* zet een soldaat in de etalage (hij verdwijnt uit je barakken); een klasgenoot kiest *Commuta* en geeft een eigen soldaat; de ruil is atomair via een Firebase-transactie op `castraTrades/{klas}/{tid}` (open → done); de aanbieder krijgt de ruilsoldaat bij zijn volgende bezoek. *Revoca* trekt een aanbod in. Ontvangen soldaten worden gevalideerd (lijn, stadium, level, aanleg) en krijgen een nieuw id; gewonden of trainende soldaten zijn niet ruilbaar. Alleen ingelogde leerlingen.
- **Troepenbomen per volk (M1, 2026-10-29)**: de soldatenlijnen zijn vervangen door bomen met 151 vormen (zie `CASTRA_TROEPENBOMEN.md`): rekruut → keuze van een tak → tier 3 → tier 4, evolueren bij level 16/32/50 met een definitieve keuze, advies van de trainer in het Latijn, kosten 50+25 / 100+50 / 200+100. Levelcap 10 × praetorium (max 50), XP 3 × level. Bestaande saves worden eenmalig gemigreerd. *Stabula*/*Navalia* ontbreken nog (M2).
- Nog niet: meer Legio-evenementen, oppugnatio-/bazengevechten, kaartweergave (nu een lijst), Latijnse knoppen en meldingen in de bestaande kamppanelen (alleen venatio en campus-teksten zijn Latijn), Firebase-regels voor de `castra`-tak (groottelimiet), docentoverzicht van het hulpgebruik, zorgbalk/herstel (valetudinarium), tower defence, helden en missieketens, Legio.

## Bronnen

- [App Store: XP Hero](https://apps.apple.com/us/app/xp-hero/id6740618570)
- [Kingshot beginnersgids](https://kingshot.net/wiki/guides/beginner-guide)

## Wijzigingslog

- 2026-10-19: plan overgenomen; Boss Battle van het hoofdmenu gehaald (nu alleen via Battle Mode), tegel "Castra Heroum" (BETA) met placeholder-scherm toegevoegd.

## Legio, tweede versie (2026-12-12)
Het klassenevenement uit de eerste versie (zie boven, lockstep via `castraLegio/{klas}/actions`) is uitgebreid:
- **Vier evenementen** (`CASTRA_LEGIO_MISSIONS`): *Obsidio Troiae* (eerste versie), en drie die de golven, vijandrollen, missieregels (edicta) en kaartlayout van een bestaande missie overnemen via `from`: *Obsidio Alesiae* (`ga2`, nacht, snelle en zware vijanden), *Ad Rhenum* (`gm2`, regen, schilddragers) en *Persepolis* (`pe2`, genezers). De docent kiest het evenement in een keuzelijst op het klasscherm.
- **Missieregels en rollen werken mee**: `castraLegioBuild` zet `sim.mods` en past de regels toe (`castraEdictApply`), zodat elke browser hetzelfde rekent. Bewust geen evenementen met *Acies angusta* of *Sine donis* (die slaan op solo-regels). De uitlegvensters die het spel pauzeren, staan in Legio uit (lockstep kan niet pauzeren).
- **Schaling met klasgrootte**: aantal vijanden per groep `×round(spelers/3)`, levenspunten `hpMult × 1,48 × (spelers/12)^hpExp` met `CASTRA_LEGIO.hpExp = 1,2`, basislevens `+spelers/2`. Dit maakt grote klassen niet automatisch makkelijker.
- **Eindscherm**: overwinningstekst per evenement, daarnaast een **schadebalk per leerling** (aandeel in de geleverde schade, uit `sim.stat.dmg`) met de opmerking dat het om de legio gaat, plus 40 Castra-XP bij winst.
- **Balans (gesimuleerd, referentieteam van `tools/castra-balance-td.js`, 2 soldaten per leerling)**: bij soldaten op niveau 18 winnen alle vier de evenementen met 6 tot 20 leerlingen (5 tot 14 levens over); op niveau 14 verlies je, op niveau 24 win je ruim. Hulpmiddel: `tools/castra-legio-test.js` (`CLEG.report()`, `CLEG.tune()`, `CLEG.determinism()`).
- **Determinisme getest**: alle acties vooraf bekend versus een te late actie middenin geeft voor alle vier de evenementen identiek `tick/levens/kills/torens/vijanden`.
- **Nog niet getest met echte clients en echte Firebase** (alleen headless en met een nagemaakt eindscherm). Dit moet in de klastest of met twee tabbladen en een docentaccount.

## Latijnse aanwijzingen en beter verslag (2026-12-12, naar het derde ChatGPT-advies)
- **Latijn eerst bij een nieuwe vijand** (`certamen/castra-clue.js`): in het uitlegvenster bij de eerste ontmoeting van een vijandrol (velox, gravis, scutarius, medicus) staat alleen de Latijnse zin met tikbare woorden en ⓘ. De leerling beantwoordt een vraag (drie keuzes) over de betekenis, daarna volgen de Nederlandse uitleg en de tip. *Ik weet het niet, toon de uitleg* slaat de vraag over. Goed gelezen geeft 1 extra energie voor bevelen (alleen waar bevelen aan staan); fout of overslaan kost niets: taal blokkeert nooit. De knop ⓘ in het gevecht blijft altijd volledig Nederlands. Meetpunten (anoniem per klas): `classAnalyticsCastraTD/{klas}/{maand}/clue_<rol>/{ok,bad,help,skip}`, zichtbaar bij de docent als tabel *Latijnse aanwijzingen bij een nieuwe vijand*. Geen nieuwe regels nodig (de `$key/$field`-regel dekt het).
- **Gevechtsrapport** (`castra-report.js`): extra regel *Doorbraken* (per vijandsoort, eerste golf) en, bij een verlies, een observatie als er een rol in de missie zat waar de opstelling niets tegen had (genezers zonder boogschutters, snelle verkenners zonder boogschutters of cavalerie, één soldaat die al het werk doet tegen zware krijgers).
- **Metgezel stelt een woordvraag** (`crossmode2.js`): in het kamp stelt de metgezel hooguit 3 keer per dag, met minstens 20 minuten ertussen, een vraag over een van je lastige woorden (niet tijdens een gevecht, met Later-knop). Goed: `hwNote` goed en 1 profiel-XP (dagplafond); fout: het woord blijft lastig. Geen melding buiten het kamp, geen straf.
- **Legio, herlaad- en laatkomertest (2026-12-12, echte Firebase, klas TEST, daarna opgeruimd)**: een leerling die de pagina herlaadt, verbindt opnieuw en rekent op dezelfde tick exact dezelfde uitkomst uit (`tick/levens/kills/doorgelaten/torens/vijanden/golf`). Een laatkomer gebruikt hetzelfde pad (alle acties komen binnen via `child_added`).

## Beurtgevecht met moves en vangen (2026-12-13)
Het jachtgevecht (`certamen/castra-moves.js`, laadt na `castra-venatio.js`) werkt nu als Pokémon: elke beurt kies je een move, de vijand ook, en een vijand neem je alleen mee door hem te **vangen**. Verslaan laat hem vluchten (de oude "Recipio" na een winst is vervallen).
- **Moves van een eenheid** (soldaat of vijand, dezelfde regels): *Oppugna* (gewone aanval, onbeperkt), een **signatuurmove per type** vanaf gradus 3 (inf *Gravis ictus*, rng *Sagitta* die een kwart van de verdediging negeert, cav *Incursus* die eerst gaat, sup *Cura* die geneest, myth *Terror* die vertraagt), en **elke gekozen arte** als move (maximaal 4). Het effect van de arte bepaalt het soort: schade (kracht 50 + 2×%), zware slag, openingsaanval, dubbele treffer, brede slag, vertragen, doorboren, snelle aanval (gaat eerst), steun (+30% aanval, 3 beurten), verdediging (+30%, 3 beurten) of genezen (30%). Elke move heeft kracht, nauwkeurigheid en PP (hoe vaak per gevecht). *Defende* is een aparte knop (halve schade, niet twee beurten achter elkaar).
- **De vijand heeft dezelfde artes die hij als soldaat zou hebben** (`castraSkillIds`) en een eenvoudige AI: geneest bij weinig levenspunten, gebruikt steun in de eerste beurten, kiest verder de move met de hoogste verwachte schade (25% willekeurig). Bazen vechten ook met moves.
- **Typevoordeel** (inf > cav > rng > inf) blijft gelden en staat als ▲/▼ bij elke move. Voorrang: *Defende* eerst, dan snelle moves, dan de hoogste celeritas (vertraagde eenheden langzamer). Een kleine kans op een voltreffer (6%, ×1,5). Levenspunten in dit gevecht ×2,2 (gevechten duren ±8 beurten), maximaal 16 beurten.
- **Vangen** (*Capere*, max 3 pogingen, kost een beurt): de kans stijgt als de levenspunten van de vijand dalen en wordt als *laag/redelijk/goed* getoond. Hogere tier, een veel hoger level en een ✨ bijzondere vijand verlagen de kans; een vertraagde vijand en een **goed gelezen Latijnse vraag** (optioneel, "wat voor soort vijand is dit?", nooit een straf) verhogen hem. Beginners (minder dan 3 soldaten) hebben minstens 90%, zodat de eerste vangst lukt. **Bazen (`boss_…`) zijn niet te vangen**; kampioenen wel.
- Een gevangen vijand komt direct in het kamp (met zijn eigen aanleg en artes), geeft ook buit, XP en voortgang voor opdrachten. Het resultaatscherm toont zijn portret (`_portrait.png`, met terugval op de battle- en avatar-sprite).
- **Sprites in de tower defence** (`castra-sprites.js`): vormen met zes frames (`_td_idle/attack/hurt/down/side/up.png`) krijgen in het gevecht een rustframe als toren, een kort aanvalsframe bij elke treffer (richting het doelwit) en richtingsframes voor lopende vijanden (zijwaarts kijkt naar rechts en wordt gespiegeld voor links). Eén 404 per vorm zonder sprites: eerst wordt alleen `td_idle` gecontroleerd. Zonder frames blijft de oude losse `td`-sprite of de avatar in gebruik.
- **Balans** (`tools/castra-moves-test.js`, `CMV.report()` en `CMV.catchReport()`): spiegelgevechten op gelijk niveau eindigen na ±8 beurten; wie alleen Oppugna spamt wint 25 tot 36%, wie slim speelt ±47% (de vijand speelt met zijn eigen AI). Vangkans zonder vraag: 14% bij vol leven, 31% bij 70%, 47% bij 40%, 59% bij 20%, 65% bij 8% (tier 2, gelijk level); +20 procentpunt met een goed antwoord.
- Nog niet: statuseffecten buiten vertragen en steun, vangmiddelen of voorwerpen, een eigen portret voor elke held, en de snelheid/volgorde-uitleg in een tutorial.

## Ervaring en levelcurve naar Pokémon (2026-12-13)
`certamen/castra-xp.js` vervangt de oude curve (3 × level, vlak) en de vaste winst per gevecht. Was: een gewonnen jachtgevecht gaf 10 + 1,5 × vijandlevel XP, ongeacht je eigen level (een level 40-soldaat kreeg evenveel voor een level 6-vijand als een beginner, dus farmen op zwakke vijanden werkte altijd).
- **Levelcurve:** "Medium Fast" van Pokémon (kosten van level n naar n+1 = 3n² + 3n + 1, het verschil van n³) maal een schaalfactor 0,12: level 5 kost 11 XP, 10: 40, 20: 151, 30: 335, 40: 591, 49: 882; tot level 50 samen ±15.000 (was ±3.700). Opgeslagen XP blijft geldig. Helden gebruiken dezelfde curve (was 3 × level).
- **Winst per gewonnen jachtgevecht (Pokémon Gen 5+):** (b × vijandlevel / 5) × ((2·vijandlevel + 10) / (vijandlevel + eigen level + 10))^2,5 + 1, met b per tier van de vijand (1: 60, 2: 100, 3: 150, 4: 210), mythisch ×1,15, ✨ ×1,2, kampioenen en bazen ×1,5, daarna maal 0,12. Het levelverschil telt mee (verhouding maximaal 2,2). Voorbeelden: eigen 5 tegen level 5: +7 XP (nodig 11); eigen 20 tegen level 20: +72 (nodig 151); eigen 40 tegen een level 6 Tiro: +1 XP (nodig 591), dus **trainen op zwakke vijanden werkt niet meer**; eigen 10 tegen een level 15 Hastatus: +50 (nodig 40), een sterkere vijand levert veel op.
- **Vangen** geeft 60% van de winst. Alleen de soldaat die vecht krijgt XP (geen Exp. Share); de dux niet.
- **Tower defence, wekelijkse uitdaging en Legio:** de winst van één trainergevecht tegen een vijand van het hoogste missielevel (tier 3, ×1,5) maal 0,25 + 0,05 per golf; ook hier telt het verschil tussen je level en dat van de missie. Voorbeelden: m3 (vijandlevel 14): level 5 +67, level 10 +45, level 20 +24; pe2 (vijandlevel 48): level 35 +162, level 45 +125. Het Colosseum behoudt zijn eigen formule (2 × golf, max. 60).
- **Training in de campus:** een deel van het XP dat je nu nodig hebt, (8% + 2% per campusniveau) van de volgende levelstap.
- **Tempo (tools/castra-xp-test.js):** level 10 na ±11 gevechten in Latium, level 20 na ±196 gevechten in alleen Latium (de wilde vijanden zijn daar laag van level; je moet verder), level 10 naar 30 in Graecia na ±47 gevechten.
- Nog niet: Exp. Share (rustende soldaten ook XP), "Rare Candy"-achtige voorwerpen, een levelplafond-melding in het gevecht.

## Contubernium (Exp. Share), helden op jacht en menu-overzicht (2026-12-13)
- **Contubernium** (`castra-xp.js`, ontgrendeld op Castra-niveau 7, tussen Dona en Artes): een contubernium was de tentgroep van acht legionairs. Soldaten die **niet meevechten** krijgen na een gewonnen of gevangen jachtgevecht, een gewonnen missie en de wekelijkse uitdaging een deel van de ervaring, berekend met hun **eigen** level (wie al ver is krijgt bijna niets, wie achterloopt veel; zo kun je er geen XP mee farmen). Het deel is 25% + 5% per campusniveau (max. 50%), het aantal ontvangers 2 + campusniveau (de laagste levels eerst). Soldaten in training of op hun levelplafond krijgen niets; gewond zijn blokkeert niet. Het resultaatscherm toont wie hoeveel kreeg. Helden delen niet mee (zij leveren hun eigen XP via missies, jacht en gesprekken).
- **Helden gaan op jacht:** bij het verkenningsbericht staan je helden naast de soldaten. Een held vecht met zijn eigen moves (zijn artes en signatuurmove) en krijgt XP volgens dezelfde formule; hij raakt niet gewond.
- **Menu:** bij elke soldaat en held staat nu hoeveel XP er nog nodig is tot het volgende level (of "maximaal level"), en uitgeklapt zie je de **moves in het gevecht** (kracht, nauwkeurigheid, aantal keer, effect, en Defende) en wat hij **in de tower defence** doet (gekozen artes). Boven de soldatenlijst staat de status van het Contubernium (of waarom het nog op slot zit).

## Questmotor en Diarium (2026-12-14)
`certamen/castra-diarium.js` (laadt na `castra-moves.js`) is één motor voor zijquests (en straks de persoonlijke heldenquests). Een quest heeft een **gever** (NPC in de wereld, ook in binnenruimtes), stappen, een beloning en eventueel een vorige quest (`after`). **Stappen:** `kill {n, region, terrain?}` (jacht), `catch {n}`, `boss {key}`, `win {mission}`, `stat {stat, min}` (heb een soldaat of held met minstens zoveel), `have {item, n}` (bezit, niet inleveren), `talk {npc, lines}`. De speler praat met de gever (Latijns gesprek, keuze *Accipio* / *Nunc non*), werkt de stappen af en meldt zich weer bij de gever voor de beloning (resources, gloria, Castra-XP, kaarttrekking, eventueel een voorwerp). Voortgang `CASTRA.dq[id] = { s:stap, n:teller, a:1, d:1 }`; stappen die al voldaan zijn schuiven vanzelf door (`castraDqSync`).
- **Haken:** `castraVFinish` (kill, catch, boss) en `castraNpcTalk` (gesprekken: eerst beloning, dan een praatstap, dan een aanbod, daarna de gewone rol van de NPC; bij een lopende quest van de gever verschijnt een korte herinnering).
- **Diarium** (menu, vervangt *Opus*): lopende opdrachten (stappen met ✔/→/○, voortgang, gever en plek, beloning), nieuwe opdrachten (met waar je ze vindt), afgerond, en onderaan de oude opdrachten uit de wereld.
- **Zeven zijquests:** Latium (Senator *Miles fortis*, Matrona *Lupi in silva*, Faber *Murus novus*), Graecia (Gymnasiarches *Celer miles*, Pythia *Oraculum*), Troje (Vates *Visio Cassandrae*, Servus *Murus Troiae*). Alle Latijnse woorden hebben een glossarium-entry (gecontroleerd). Een quest toevoegen = één blok in `CASTRA_QDEFS`.
- Nog niet: markeringen (❗/❓) op de kaart bij de gever, een quest-volgknop in het HUD, afleverstappen (voorwerp inleveren), en de heldenevolutiequests.

## Evolutie van helden: specialisatie en prestige (2026-12-14, pilot Ulixes)
Een held is een soort legendarische soldaat (zelfde stats, artes en moves) maar uniek, en evolueert op zijn eigen manier (naar het voorbeeld van promoties in Fire Emblem: één keuze, daarna een verbetering). `certamen/castra-heroevo.js`:
- **Gradus 25:** de held vraagt om een gesprek (menu *Heroes*). Dat start zijn persoonlijke quest (3 stappen, in de questmotor van het Diarium). De beloning is een voorwerp; daarmee kies je met *Evolueer* één van twee **specialisaties** (definitief): een andere klasse (andere artes), stat-verdeling en uiterlijk.
- **Gradus 40:** een tweede quest, afhankelijk van de gekozen specialisatie, geeft het prestigevoorwerp (*Ambrosia*). Daarmee wordt de held een **prestigevorm** met sterkere stats, een rijker uiterlijk en een unieke **legendarische arte** (automatisch uitgerust; als move in de jacht en als effect in de tower defence).
- **Fides:** het levelplafond van een held groeit met zijn fides (25 vraagt fides 50, 40 vraagt fides 75), dus de evolutie is ook een beloning voor wie veel met zijn held doet.
- **Techniek:** `h.evo` (0, 1, 2) en `h.spec`; de evolutie past `CASTRA_HERO_DATA[id]` aan (type, uiterlijk, basisstats, klasse; origineel in `d._b`), zodat tower defence, jacht en menu vanzelf meegaan; opnieuw toegepast bij elke `castraLoad`. Legendarische artes zitten in de klasse `ulixes_sag` / `ulixes_ins` (de zes gewone artes plus één), met een eigen move (`mv`) voor de jacht. Een held toevoegen = één blok in `CASTRA_HERO_EVO`.
- **Ulixes:** *Arcus Ulixis* (acht vijanden aan de kust van Troje, Cassandra spreken, de Cycloop verslaan). Specialisaties *Sagittarius* (boogschutter, ambitus ×1,6, impetus ×1,25; prestige *Arcitenens* met *Sagitta Apollinis*, de pijl die de helft van de verdediging negeert) en *Insidiator* (verkenner, celeritas ×1,5, blijft ondersteuner; prestige *Callidus* met *Insidiae Ulixis*, snel en vertragend). Prestigequest: twaalf vijanden bij de Scamander of in de tunnel, drie vangen, en de draak van Graecia verslaan.
- **Alle 20 helden (2026-10-22, aangevuld 2026-10-23):** `certamen/castra-heroevo-all.js` vult de overige 14 helden met bouwstenen (`_HE_H`, `_HE_S`, `_HE_Q`; stappen `_HE_K` verslaan, `_HE_C` vangen, `_HE_F` zoeken, `_HE_B` baas). Elke held heeft een voorwerp en persoonlijke quest op gradus 25, twee specialisaties (door Gerben gekozen, zie `certamen/assets/sprites-forms/HELDEN_EVOLUTIE.md`), per specialisatie een quest op gradus 40 en een prestigevorm met een legendarische arte. Stat-vermenigvuldigers per archetype in `CASTRA_HEVO_ARCH` (hopliet, spartaan, boogschutter, cavalerie, centurio, verkenner); klassen heten `<held>_<spec>`. Quests: `evo_<held>_1` en `evo_<held>_2_<spec>`. Alle negen klassen met artes komen voor: Medea (Graecia, Castra-niveau 35) is priesteres (Sacerdos Hecates) of gifmengster (klasse myth), Daedalus (Graecia, niveau 40) werktuigbouwer (genie) of vlieger (cavalerie); Hector kan Pater Familias (priester) worden in plaats van Dux Troianus; Ulixes heeft als enige drie takken (boogschutter, verkenner, genie). Het evolutiedialoog toont zoveel keuzes als een held takken heeft. Daarna zijn Cassandra (Troia, niveau 31), Prometheus (Graecia, niveau 37) en Circe (Troia, niveau 44) toegevoegd: de klassen staan nu op spartaan 6, cavalerie 6, hopliet 5, verkenner 5, boogschutter 4, centurio 4, priester 4, myth 4, genie 3 (41 specialisaties). Cassandra en Daedalus zijn één persoon met de opdrachtgever in hun grot (`fetch_troia`, `fetch_graecia`): zij hebben geen eigen plek op de kaart (`cave:` in `CASTRA_HERO_DATA`). Is de opdracht van de bewoner klaar, het spoor gevonden en het Castra-niveau hoog genoeg, dan begint haar gesprek in de grot met de heldenketen (`castraCaveHeroOf`, `castraRegFetch`); na het overtuigen verhuist ze naar je heroum. Tot die tijd blijft ze gewoon de opdrachtgever (ook voor de quest van Ulixes). De reservekandidaten staan in `CASTRA_HELDEN_RESERVE.md`.
- **Stat-voordeel en verhaal-arte:** helden zijn sterker dan soldaten (`heroMult` 1,5: een held van level 1 heeft de stats van een tier 4-soldaat). Elke held heeft bovendien vanaf level 1 een eigen verhaal-arte (`CASTRA_HERO_SIG`, bijvoorbeeld Pietas Aeneae, Dolus Ulixis) in de klasse `<held>_base`; die blijft na evolutie het eerste item van de specialisatieklasse. Na evolutie komen de artes van de nieuwe klasse erbij en op gradus 40 de legendarische arte.
- **Helden zijn schaars (2026-10-22):** een held is zo sterk als een tier 4-soldaat, dus (1) verschijnt hij pas in de wereld vanaf een Castra-niveau (`CASTRA_HERO_MINLVL` in `castra-heroes.js`: Aeneas 1, Romulus 6, Horatius 9, Cloelia 12, Mucius 15, Camilla 18, Hercules 20, Perseus 23, Theseus 26, Atalanta 29, Iason 32, Achilles 30, Hector 34, Ulixes 38, Penthesilea 42) en (2) mogen er per gevecht maar `castraHeroFieldCap()` helden tegelijk meedoen: 1 (heroum 1-2), 2 (3-4), 3 (5). De rest van de slagorde zijn soldaten. Geldt niet in het Colosseum en in Legio (eigen eenheden).
- **Nog niet:** eigen portretten per evolutievorm (nu past het uiterlijk aan via avatar-lagen; de beeldopdracht staat in `certamen/assets/sprites-forms/HELDEN_PROMPT.md`), balanscontrole van de 28 specialisatiestats in een klastest, en omscholen (bewust definitief).

## Quest-markeringen en rondlopende bewoners (2026-12-15)
- **Markeringen op de kaart** (`castra-diarium.js`): boven een NPC staat ❗ (gouden cirkel) als hij een nieuwe opdracht heeft, 💬 (blauw) als je hier moet praten voor een stap van een lopende opdracht, en ❓ (groen) als een afgeronde opdracht op je wacht. Een **deur naar een binnenruimte** krijgt de markering van wat erachter zit (tot drie deuren diep), zodat je weet in welk gebouw je moet zijn. Het oude algemene "!" boven elke NPC is een neutrale "…" geworden. Het HUD onderaan de wereld toont tot drie lopende opdrachten met hun huidige stap en voortgang (afgeronde eerst, met de gever). Alles wordt direct bijgewerkt na aannemen, een stap, praten of inleveren.
- **Rondlopende bewoners** (`castra-wanderers.js`): in elke buitenregio lopen 3 tot 7 bewoners (boer, moeder, kind, oude man, koopman, herder), gebouwd uit dezelfde top-down avatar-lagen als de speler maar gekleed in vodden, gewaden of een lichte mantel, met het uiterlijk van het volk van de regio. Ze lopen rustig binnen vier tegels van hun thuisplek, mijden hoog gras, deuren, de uitgang en elkaar, en blokkeren de speler net als andere NPC's. Aanspreken (tik of loop ertegenaan): ze kijken naar je en zeggen een of twee korte Latijnse zinnen (tikbare woorden, vertaling via ⓘ): een zin per type bewoner (18) en een regionale zin per regio (11). De plekken zijn per regio en dag gelijk (geseed) en worden niet opgeslagen; geen gevolgen voor opdrachten of voortgang. Alle woorden staan in het glossarium (gecontroleerd). Meer sprites (gewaden, leren harnassen, kant-en-klare NPC's) kunnen als extra avatar-lagen of als vaste looks worden toegevoegd in `CASTRA_AMB_TYPES`.

## Bomen op de wereldkaarten (2026-12-16)
`tree_b` is een **dichte bostegel** (opaque kruinen, bedoeld om aan te sluiten op buurtegels), geen losse boom. Een losse boom in een bos kreeg daardoor een donker vierkant boven zich. Nu: losse bomen zijn altijd `tree_a` (ook in een dichte zone; de bossen worden dicht door de dichtheid, niet door de tegel), en `tree_b` komt alleen nog in de **rand** van een boskaart voor, waar de tegels aaneensluiten. De rand gebruikt per regio één soort boom (geen palmen en dichte bostegels door elkaar: bij Graecia, Troje, Laconia en Themiscyra is de rand nu een rij palmen). Alle elf buitenkaarten zijn gecontroleerd (geen `tree_b` buiten de rand, geen gemengde randen); de kampkaart en de binnenruimtes hebben geen `tree_b`.

## NPC-sprites uit RPG Maker MV (2026-12-17)
`certamen/assets/npcs/People1.png` t/m `People4.png` (de standaard MV-sheets, 8 personages per sheet, 4 × 2 blokken van 3 × 4 frames van 48 px). De rondlopende bewoners gebruiken nu deze complete personages (`castraSheetHTML` in `castra-wanderers.js`; ook als gespreksportret in het dialoogvenster). Gekozen als passend bij een klassieke wereld: boer (P3-4, P4-2), moeder en dienstmeisje (P1-5, P4-3, P4-5), jongen (P1-0), meisje (P4-1), oude man (P1-6, P4-4), oude vrouw (P1-7), koopman (P1-4, turbaan P4-6), herder (P4-0), priester(es) (P2-2, P4-7). Bewust niet gebruikt (te anime of modern: uniform, nar, konijnenmeisje, ober, blauw- en paarshaar, pak met bril, middeleeuwse platenpantsers); de koning en koningin (P3-0, P3-1) zijn bewaard voor vaste NPC's (Persis, Aegyptus). Per regio loopt elk personage hooguit één keer; zonder sheetbestanden vallen de bewoners terug op de avatar-lagen. Nieuwe typen: meisje (*Puella*), oude vrouw (*Anus*) en priester (*Sacerdos*) met eigen Latijnse zinnen.

## Opdrachten die bij de rol van de gever passen (2026-12-18)
- **Rondlopende bewoners geven opdrachten** (giver `amb:<type>@<regio>` in `castra-sidequests.js`; `castra-wanderers.js` laat in die regio een bewoner van dat type lopen of staan, met een ❗/💬/❓-markering boven zijn hoofd, en het gesprek start de opdracht in het dialoogvenster met zijn sprite als portret). Nieuwe typen die stilstaan: **Custos** (wachter, MV-ridder P3-6) en **Rex** (koning, P3-0).
- **Nieuwe stap `find`:** het gezochte (🐑 🐐 🧒 💍 🍷 📦 🏺) ligt knipperend ergens buiten in de regio (vaste plek per opdracht, uit een seed); loop erheen om het op te pakken.
- **Rol → opdracht:** boer en herder zoeken een verdwaald schaap of een geit (find) en vragen daarna een paar vijanden te verslaan die de dieren bedreigen; een moeder zoekt haar zoon; de koopman zijn gestolen waren (vijanden verslaan en de waren zoeken); de priester een heilig vat; de oude vrouw vraagt na over haar zoon, de gladiator (praat met de lanista, vijanden in de arena); **wachter en koning vragen om gevechten**: vijanden op de weg of voor de muren verslaan, een vijand vangen, een missie winnen (Perzië: acht vijanden en de eerste missie). De bestaande NPC's passen nu ook beter: de matrone zoekt haar ring (find), de bediende in Troje een amfoor wijn (find); senator (sterke soldaat), gymnasiarches (snelle soldaat), pythia (orakel en dichter), vates (Cassandra) en bouwer (muur) bleven.
- Totaal nu 20 opdrachten (7 van vaste NPC's, 10 van rondlopende bewoners, 3 persoonlijke heldenquests van Ulixes). Een opdracht van een bewoner toevoegen = één blok in `castra-sidequests.js`; het gesprek, de markering en de verschijning van de gever volgen vanzelf.

## Dieren, kar met paard en boten (2026-12-19)
Uit `Nature.png` en `Vehicle.png` (RPG Maker MV, in `certamen/assets/npcs/`) komt meer leven in de buitenregio's (`castra-wanderers.js`):
- **Dieren** (hond, kat, kip en paard uit Nature #0 t/m #3): 3 of 4 per regio die rondlopen in een kleinere straal (kippen blijven dichtbij). Aanspreken geeft een Latijnse zin met vertaling (*Canis fidelis est*, *Gallina ova parit*, *Equus herbam edit*). Naast elke wachter (Custos) en koning staat een **paard**.
- **Kar met paard** (Vehicle #4 en #5): op de hoofdweg rijdt een bestelwagen met paard heen en weer (het paard voorop, de kar volgt; aan de uiteinden draaien ze om). Aanspreken: *Carrus mercatoris est*.
- **Boten** (roeiboot #0, vlot #7, en een schip #1 in kustregio's): varen langzaam op en neer op het water langs de rand, tussen de bruggen.
- **Niet gebruikt:** fee en bloemenfee, de blauwharige figuur en de groene wezens (Nature #4 t/m #7), luchtballon, luchtschip en de ijzeren mijnkar (Vehicle #2, #3, #6): te sprookjesachtig of modern voor een klassieke wereld.
- **Mogelijk later:** het paard als rijdier voor de speler (sneller lopen in de wereld, bijvoorbeeld via de Stabula of na een opdracht), een verloren paard als `find`-opdracht, en schepen bij de havens voor een zeereis.

## Het paard: rijden in de wereld (2026-12-20)
- **Verdienen:** de opdracht *Equus perditus* (`castra-sidequests.js`, giver: de koopman van Latium; vanaf **Castra-niveau 10** en na missie 3). Drie stappen die bewust anders zijn dan de gewone: het verdwaalde paard **zoeken** (🐎 knippert ergens buiten in Latium), de **bouwer** spreken (hij repareert het tuig), vijf vijanden op de weg verslaan. Beloning: het paard (plus 150 aes, gloria, XP en een kaarttrekking).
- **Rijden** (`castra-mount.js`): daarna staat linksboven in de wereld een knop 🐎/🚶 (`CASTRA.mount = { owned:1, on:0|1 }`). Te paard ga je **twee keer zo snel** (85 ms per stap in plaats van 170; ook bij tikken-om-te-lopen) en staat het paard onder je avatar (zelfde richting en looptakt; de ruiter iets kleiner en hoger). **Binnen** (huizen, grotten) loop je altijd te voet en verdwijnt de knop. Gevechten en ontmoetingen werken hetzelfde.
- **Techniek:** `CASTRA_W_UI.speedMs` (castra-world.js) bepaalt de staptijd; `castraMountSync` zet ook de overgangstijden van avatar en kaart. De beloning `mount:1` staat in `castraDqReward` (castra-diarium.js), zodat andere opdrachten het paard ook kunnen geven.
- **Nog niet:** een eigen paard-uiterlijk per held of volk, een Stabula-gebouw dat het paard voert of verzorgt, en gevechten te paard.

## Soldaten aan het werk: Labor (2026-10-23)
Soldaten blijven relevant naast de schaarse helden doordat ze het kamp laten draaien. `certamen/castra-opus.js`, menu **Labor** (vanaf Castra-niveau 5):
- Een soldaat bemant Praetorium (frumentum), Lignatio (hout) of Metallum (brons); werkplekken = gebouwlevel (1 tot 5).
- Bonus per werker op de productie: (2 + 0,25 × level + 1,5 × (tier-1)) %, anderhalf keer zoveel in een geschikt gebouw (Praetorium: rekruut en cavalerie; Lignatio: infanterie; Metallum: ondersteuners en schutters). Een held als voorman blijft zijn eigen bonus geven; beide tellen op via `castraBldBonus()` (`castra.js`).
- Afweging: een werker doet niet mee aan gevechten en jacht (`castraBHealthy`, venatio), kan niet trainen of verhandeld worden tot hij wordt teruggeroepen (één tik). Vóór elke wijziging wordt de productie afgerekend (`castraCollect`).
- Opslag: `s.job` (gebouw-id) per soldaat. Latijn: "Hic milites laborant." met uitleg.
- Nog niet getest in een klastest: de bedragen (zie `CASTRA_OPUS`) zijn een eerste inschatting.

## Speelscherm en full-screen (2026-10-23)
`certamen/castra-stage.js`: kamp en wereld vullen het scherm (vaste laag, geen paginascroll); bovenbalk met terugknop, titel, uitleg (?) en de knop **Full-screen**; grondstoffen en opdrachten als strook bovenaan, gebouw- en personeelsinfo als paneel onderin over de kaart. Full-screen (immersief) verbergt de balk en de terugknop van de pagina, zet waar de browser het kan ook echt volledig scherm aan, en laat links drie knoppen zien (⤡ sluiten, ? uitleg, ‹ terug) naast het menu (☰) rechtsboven. De keuze wordt onthouden (`localStorage castra_immersive`). Nog niet: de gevechtsschermen (Proelium, jacht) hebben deze indeling nog niet.

## Heldensprites en balanscontrole (2026-10-23)
- **Sprites:** `certamen/castra-herospr.js`. Elke heldvorm heeft dezelfde set als een soldaatvorm in `assets/sprites-forms/` (`hero_<naam>`, `hero_<naam>_<spec>`, `hero_<naam>_<spec>_pr`; td met zes frames, portrait, battle_front en battle_back). `castraHeroFormId(h)` volgt `h.evo` en `h.spec`; de helden in je heroum worden bij het laden, werven en evolueren gecontroleerd (Image-probe). Getekend in het heldenmenu, de codex, de tower defence (torens hebben nu `spr`) en het jachtgevecht (battle_back). Ontbreekt een bestand, dan valt het spel terug op de avatar-lagen met het uiterlijk van die vorm. 99 van de 102 vormen waren aanwezig, alleen Circe (basis, Herbaria en prestigevormen, plus portret en battle van Maga) ontbrak nog bij het verwerken.
- **Balans (proxy op basis van de torenwaarden):** een held van level 50 doet als prestigevorm gemiddeld 1,4 keer de schade van een tier 4-soldaat (soldaten 8.000 tot 9.500, helden mediaan ±11.700); ondersteuners en verdedigers zitten eronder (±0,8 keer), de zwaarste aanvallers erboven. Bijgesteld: Achilles' basisstats (100/22/15 → 92/18/14) en het prestige-vermenigvuldigingsgetal voor impetus van de spartaanse archetype (1,55 → 1,45), omdat Achilles, Hercules en Penthesilea anders 2,4 keer de schade van de beste soldaat haalden. Cooldown speelt bij level 50 geen rol meer (alle torens zitten op het minimum), dus celeritas telt daar vooral voor lopen en voor de jacht.
- **Niet getest:** de volledige TD-simulatie met helden in het referentieteam (`tools/castra-balance-td.js`) en een klastest.

## Tower defence-kaarten aangekleed en kleine fixes (2026-10-23)
- **Kaarten** (`certamen/castra-tdmap.js`, gebruikt door `castraBBuildMap`): de weg is één vloeiende lijn met afgeronde bochten, een donkere rand, een lichter midden en kiezels (Roma en Troje: kasseien, bergregio's: keien, elders zand); zachte lichte en donkere vlekken in het gras, bioomvlakken per regio (`castra-biomes.js`), bomen volgens het bioom (palmen, dode bomen), niet-blokkerende versieringen (bloemen, planten, varens, stenen) en een zachte rand. Pad, boomcellen en plaatsbare cellen zijn ongewijzigd, dus de balans ook. Het begin en eind van de weg lopen alleen langs de richting van het eerste en laatste stuk door tot buiten de kaart. Alle 22 combinaties van kaart en regio tekenen zonder fouten.
- **Kamp:** de boom voor de oostelijke poort (Porta praetoria) staat nu elders (`castra-map.js`).
- **Menu Milites en Heroes:** tonen de portretfoto (`<vorm>_portrait.png`) in plaats van de battle- of td-sprite; ontbreekt die, dan de td-sprite of de avatar (`castraMenuSprite`).

## Bereik tonen en units verschuiven in de tower defence (2026-10-23)
`certamen/castra-range.js` (alleen de gewone campagne; Colosseum en Legio houden hun eigen regels): met een unit gekozen toont een cirkel zijn bereik (groen = plaatsbaar, rood = niet) onder de muis; bij het neerzetten blijft de cirkel staan. Tik op een eigen unit om hem te selecteren (bereik zichtbaar, ook tijdens een golf); met een geselecteerde unit en zonder lopende golf verplaatst een tik op een lege plek hem daarheen, en nogmaals op hem tikken neemt hem terug. De golf starten maakt alles definitief. Het bereik komt ook als toast bij het kiezen van een unit.
**Wereld:** de rand van bomen gebruikt nu `tree_a` (dezelfde boom als de losse bomen) in plaats van de dichte bostegel `tree_b`.

## Opdrachten accepteren en de handleiding (2026-10-23)
- **Praten:** naast iemand (ook rondlopende bewoners met een ❗) verschijnt rechtsonder de knop **💬 Praat**; Enter, spatie of E doet hetzelfde (`castraWorldNearNpc`, `castraWorldTalkNear` in `castra-stage.js`). Tegen de persoon aan lopen of erop tikken werkt nog steeds. De opdracht neem je aan met *Accipio*.
- **Handleiding** (`certamen/castra-faq.js`, `SCREENS.castraFAQ`, data in `CASTRA_FAQ`): twaalf uitklapbare secties (start, lopen en bediening, kamp, soldaten, helden, jacht, tower defence, opdrachten, Latijn, landen en paard, Legio en Colosseum, opslaan en problemen). Ingangen: Certamen-hoofdmenu → tegel **Handleiding** (`SCREENS.helpHub`, kiest tussen Battle Mode en Castra Heroum; Total War en Chronica volgen), in het spel menu ☰ → Handleiding, en de knop ? → Volledige handleiding. Werk de secties bij als spelregels veranderen.

## Vlaggen bij het Praetorium (2026-10-23)
Het Praetorium (hoofdkwartier) heeft twee vlaggen naast de ingang, in de hoeken van de tent: rood, en goud vanaf Praetorium-level 3 (`castraCampDef` in `castra-map.js`). De vlaggen zijn eigen tekeningen (`certamen/assets/tilesets/Castra_extra.png`, gemaakt met `certamen/tools/gen_castra_flags.py`, sheet "X"), niet-blokkerend (de tent blokkeert al). Idee voor later: gebouwen op hogere levels een ander uiterlijk geven (tent → hut of stenen gebouw), dan voor alle gebouwen, met nieuwe tegelkunst.

## Jachtgevecht als scène, zones, deuren en gesprekken (2026-10-23)
- **Gevechtsscherm** (`certamen/castra-vscene.js`, `castraVSceneHTML`): opgebouwd zoals in Pokémon: vijand rechtsboven op een platform, jouw eenheid (van achteren, groter) links onderin, een naamkaart met levensbalk bij allebei, een tekstvak en daaronder het menu. Achtergrond per terrein (gras, bos, kust, steen, grot). Beweging: binnenschuiven, ademen, springen naar de ander bij een aanval, flitsen en trillen bij een treffer met zwevend schadegetal, zacht leeglopende levensbalk, lichtkring bij steun, wegzakken bij verslaan. Een beurt wordt eerst afgespeeld (`V.fx`, `castraMvFx` in `castra-moves.js`), pas daarna komt het menu of het resultaat. De sprites zijn nu 96 px en worden geschaald; scherper kan met nieuwe battle-sprites van 192 px (`tools/castra-sprites-slice.py`, `SIZES.battle`), het spel schaalt beide formaten mee.
- **Zones** (`certamen/castra-zones.js`): gestippelde rand en naamplaat per zone (bos, weg, veld, ...) op de kaart; bovenaan een chip met de zone waar je staat, met ✔ en een melding als die bij een lopende opdracht hoort, anders de zone die je nodig hebt met een pijl.
- **Deuren:** op of naast een deur staat de knop **🚪 Binnen** (ook Enter); tikken op het huis of de grot zelf loopt naar de deur (`castra-stage.js`).
- **Gesprekken:** een gesprek in de wereld sluit stil zodra je een stap zet (er wordt niets aangenomen) en kan opnieuw beginnen.

## Scherpere sprites (2026-10-23)
- **Weergave** (`certamen/castra-crisp.js`): per afbeelding in `assets/sprites-forms/` kiest het spel hard (`pixelated`, bij opschalen) of zacht tekenen (bij verkleinen), naar de echte weergavegrootte inclusief schaal en scherpte van het scherm. Zo worden grotere bestanden niet gekarteld op een telefoon.
- **Bestandsformaten:** battle_front en battle_back 192×192 (was 96), td-frames 96×96 (was 48; het spel toont ze nog op 48 css-pixels), portretten 128×128. Het spel werkt met zowel de oude als de nieuwe bestanden; nieuwe bestanden komen via `tools/castra-sprites-slice.py` (`SIZES`) en daarna `CASTRA_FSPR.ver` ophogen. De TD-kaart heeft nu ook een eigen speelscherm (zie hieronder).

## Tower defence op het hele scherm (2026-10-23)
`certamen/castra-bstage.js` (zelfde opzet als `castra-stage.js`): de TD-kaart vult het scherm en wordt zo groot mogelijk (tot 2,6 keer, in het midden, zodat de sprites scherper zijn); bovenin een balk met terug, titel, ? en **Full-screen** (in Full-screen verdwijnt de balk en komen er knoppen links); daaronder een smalle strook met levens, golf, aantal eenheden, regels en bevelen; onderin een dok met de knoppen (start, sneller, auto) en je eenheden als horizontale rij kaarten; het resultaat als paneel over de kaart. De bestaande elementen (`cbWrap`, `cbHud`, `cbCmd`, `cbCtl`, `cbCards`, `cbResult`) worden alleen verplaatst, dus Legio en het bereik tonen (`castra-range.js`) blijven werken. Op een staande telefoon blijft de kaart breedte-begrensd (16 tegels breed); de kaart wordt veel groter in Full-screen en liggend.

## Veldacties, versperringen en de terugknop (2026-10-23)
- **Veldacties per klasse** (`certamen/castra-field.js`, plekken in `castra-field-data.js`): net als de HM's in Pokémon heeft elke klasse een taak buiten het gevecht. Hopliet of spartaan breekt een rots (🪨), een genie ruimt een omgevallen boom op (🪵), een priester of mythisch wezen reinigt een vervloekt altaar (🗿, geneest ook je gewonde soldaten), een centurio voert een verlaten legerplaats aan (⛺) en een verkenner of ruiter volgt sporen (👣). Het leger (soldaten en helden) levert de klasse; er wordt de best passende, hoogste eenheid gekozen. Beloning: grondstoffen, soms gloria, en wat Castra-XP.
- **Versperringen en kaartopbouw:** in elke regio zitten nu twee heggen dwars over de kaart (poort 1 op ongeveer twee derde van de hoogte, poort 2 op een derde; Latium alleen poort 2, zodat het tutorial in het midden eindigt), elk met één opening op de weg waar een versperring staat. Zo ontstaan drie stukken: het startgebied met kamp en bouwplaats, het midden met de kruising en de grotten, en het noorden met de uitgang naar een volgend land. De klassen van de versperringen wisselen per regio. Een opgeruimde versperring blijft weg (`CASTRA.wgate`). Heb je de klasse niet, dan kun je arbeiders inhuren voor grondstoffen (`castraFieldHireCost`), zodat niemand vastloopt.
- **Dagelijkse veldacties:** vijf soorten, tien plekken per regio (`CASTRA_FPOS`); ze komen de volgende dag terug (`CASTRA.wfield`).
- **Controle:** voor alle 11 regio's is de bereikbaarheid gecontroleerd (met poorten open is alles bereikbaar: personen, deuren, uitgangen en alle veldacties). De westuitgang van Latium was al niet bereikbaar (door de bestaande blokkade bij Roma) en is niet veranderd.
- **Terugknop:** de ‹ in de kop van elk Castra-scherm (wereld, kamp, jacht, tower defence, campagnekaart, regio's) gaat altijd naar het Certamen-hoofdmenu (`certamen/castra-nav.js`); de knoppen Perge, Iterum en Redi in een resultaat brengen je verder zoals voorheen. Snelle reis naar het kamp: menu ☰ → Castra.

## Dag en nacht (2026-10-23)
`certamen/castra-dayn.js`: naar de lokale klok vier momenten: **Aurora** (06-08), **Dies** (08-18), **Vesper** (18-21) en **Nox** (21-06). Een zachte kleurlaag over kamp en wereld (warm bij Aurora en Vesper, donkerblauw bij Nox), een chipje in de balk, en een donkerder gevechtsachtergrond 's nachts. Vijanden: bij Nox verschijnen ongeveer 40% mythische wezens (overdag ±9%) en zijn wilde vijanden +2 gradus; Vesper ±20% en +1; Aurora een klein beetje (`CASTRA_PHASES`). Testen met `CASTRA_PHASE_FORCE`. Nog niet: andere opdrachten of winkels per tijd van de dag, en tijdgebonden rematches (zie de trainers-ideeën in dit gesprek).

## Trainers, insignia, contubernium en wisselen (2026-10-23)
- **Trainers** (`certamen/castra-train.js`): twee of drie jagers per land langs de weg (één per stuk van de kaart, `CASTRA_TRAIN_POS`). Kom je binnen twee tegels, dan dagen ze je uit: een korte Latijnse vraag (uit de gesprekken van de helden van dat land; goed = 2 gloria, anders 1), dan een jachtgevecht tegen een soldaat van dat land (+2 gradus boven wild, niet te vangen). Winst geeft grondstoffen en gloria; de rematch is de volgende dag (`CASTRA.wday`, sleutel `trainer_<id>`). De Tabellarius meldt in de Hodie-lijst hoeveel jagers in je geopende landen wachten.
- **Insignia:** de kampioen van elk land (het huis, `castraRegChamp`) geeft bij de eerste overwinning de insigne van dat land (`CASTRA.insignia`); alle elf: Imperator (+500 aes, +250 frumentum, +25 gloria). Menu ☰ → Insignia.
- **Contubernium** (`certamen/castra-party.js`): je groep van maximaal 8 soldaten (een contubernium was in het Romeinse leger de kleinste eenheid: acht legionairs in één tent; twee meer dan de zes van Pokémon). Alleen zij kunnen op jacht mee. Beheer in menu ☰ → Contubernium (erin of eruit, vooraan zetten); nieuwe soldaten komen er vanzelf bij zolang er plaats is (`CASTRA.party`, `CASTRA.partyOut`). De soldaten in de barakken krijgen nog steeds ervaring via het Contubernium-effect (`castra-xp.js`).
- **Wisselen in het gevecht:** de knop 🔄 Wissel in het jachtmenu kost je beurt (de vijand slaat toe). Valt je soldaat om en is er een gezonde reserve, dan kies je verplicht een nieuwe (geen beurt kwijt); pas zonder reserve verlies je. Wie omvalt is gewond, wie meevocht en overleefde krijgt de helft van de ervaring (`castraVSwitchPick`, `castraMvReserve`).

## Gevechtsregels naar Pokémon: schade, elementen, statussen, stages (2026-10-24)
Op basis van `CASTRA_POKEMON_ANALYSE.md` (stappen 1-3). Vervangt de beschrijving van schade, buffs en vertraging in "Beurtgevecht met moves en vangen" hierboven.
- **Opslag:** `castra.js` heeft een migratietabel `CASTRA_MIGRATIONS` ({ id, run }); elke stap draait één keer per save (`s.migr[id]`), de formaatversie `v` blijft 1 zodat niets wordt weggegooid. De oude vlaggen `heroV`/`troopsV` tellen mee. Voeg nieuwe stappen altijd onderaan toe. `castraSaveSize()` meldt in de console als de save boven 80% van de 40.000 tekens van de cloud komt.
- **Schade** (`castraMvCalc`, `castra-moves.js`): `dmgK × (kracht/50) × A × clamp(A/D, 0,4..2,5) × wapendriehoek × element × STAB × spreiding (0,85-1)`, met `dmgK` = 0,45 (afgesteld op ±8 beurten per gevecht, spam 23-28% winst, slim 44-54%). Vervangt de aftrekkende formule (hoge tutela maakte aanvallen nutteloos). Geen aparte level-term: het level zit al in de stats. Gelijke snelheid: 50/50 (`V.rng`). Voltreffer 6% ×1,5, een move kan extra `crit` hebben, en negeert negatieve stages van de aanvaller en positieve van de verdediger.
- **Elementen** (`castra-elem.js`): ignis, aqua, terra, aer, umbra, lux; ring aqua > ignis > terra > aer > aqua, lux ↔ umbra. ×1,5 / ×0,75 per element van de verdediger, STAB ×1,25. Alle 34 mythische vormen (`CASTRA_TAK_ELEM`, `CASTRA_FORM_ELEM`) en de 20 helden (`CASTRA_HERO_ELEM`) hebben een element; gewone soldaten niet (wapendriehoek blijft). Signatuur- en arte-moves van zo'n eenheid krijgen een element (om en om bij twee) en de bijwerking van dat element (ignis ustio 20%, aqua celeritas −1 25%, terra tutela −1 20%, aer nauwkeurigheid −1 20%, umbra pavor 20%, lux somnus 12%).
- **Statussen** (`CASTRA_STATUS`): vulnus (−1/16 per beurt), ustio (−1/16, aanval ×0,5), somnus (1-3 beurten niets), pavor (25% beurt kwijt, snelheid ×0,5). Eén tegelijk; alleen in het gevecht (wisselen herstelt, dat is een bewuste vereenvoudiging). Bronnen: *Sagitta* en doorborende artes (vulnus), *Terror* (celeritas −1 en pavor), elementbijwerkingen. Een status maakt vangen makkelijker (somnus +25, pavor +15, vulnus/ustio +8 procentpunt).
- **Stat-stages** (−6..+6, ×(2+n)/2 resp. 2/(2−n); nauwkeurigheid/ontwijken ×(3+n)/3): vervangen de vlakke ×1,3-buffs van 3 beurten. *Vires crescunt* is aanval +1, *Tutela crescit* verdediging +1, vertragen is celeritas −1. Blijven tot wisselen of einde van het gevecht.
- **Event-log:** `castraMvExec` schrijft gebeurtenissen naar `V.ev` (`use, hit, miss, heal, guard, stage, status, skip, wake, dot`); de Latijnse regels (`V.log`) en animaties (`V.fx`, nu ook `status`/`stage`/`dot` in `castra-vscene.js`) komen daar uit. Beurtschade en effecten staan in `castraMvEndOfTurn`.
- **AI:** let op ontbrekende status/stage van de speler bij het kiezen van een move; heeft nog geen wisselgedrag.
- **Tests:** `tools/castra-rules-test.js` (72 regeltests: formule, spreiding, elementen, STAB, statussen, stages, nauwkeurigheid, gelijkspel, event-log, migraties) en `tools/castra-moves-test.js` (balans; de testgevechten sluiten nu de reserve uit, anders eindigden ze nooit). Handleiding: sectie "Het gevecht: elementen, statussen en stages" in `castra-faq.js`.
- Nog niet (uit de analyse): fysiek/speciaal per move (bewust niet), vangmiddelen en inventaris, vangkans per vorm, schudden bij vangen, learnsets, fides voor soldaten.

## Vangkans per vorm en analyse van de wereldkaart (2026-10-24)
- **Vangkans per vorm:** `CASTRA_FORM_CATCH` (`castra-moves.js`, factor per vorm, standaard 1) werkt mee in `castraMvCatchChance`: draco en feniks 0,35, gevleugeld paard 0,55, larva en tier-3-centaur 0,6, enzovoort. Schudden bij het vangen is bewust niet gebouwd (we werven, geen bal). Tests in `tools/castra-rules-test.js`.
- **Wereldkaart:** audit en voorstellen naar het Overworld-dossier in `CASTRA_OVERWORLD_ANALYSE.md` (wereldtest, trainerzicht, verborgen voorwerpen, ontmoetingen als systeem, flags-voorgevel en eventtabel, wereldtoestanden, nundinae). Nog niet gebouwd; wacht op akkoord.

## Wereld, ronde 1: wereldtest, quest-toestanden, verborgen voorwerpen, trainerzicht (2026-10-24)
Uit `CASTRA_OVERWORLD_ANALYSE.md` (W1, W6, W3, W2). Tests (alle in Node, vanuit `certamen/`): `node tools/castra-world-test.js [--verbose]`, `castra-quest-test.js`, `castra-hidden-test.js`, `castra-train-test.js`.
- **W1 Wereldtest** (`tools/castra-world-test.js`, 4124 controles): laadt het spel headless (`castra-colo-node.js`), bouwt alle 49 werelden in een OPEN toestand (alle missies gewonnen, veldpoorten weg, alles ontgrendeld) en een DICHTE (verse save). Controleert: start vrij, entiteiten binnen de kaart en niet op elkaar of op obstakels, alles bereikbaar (BFS), deuren met terugweg en vrije aankomsttegel, poorten symmetrisch, versperringen met oplossing, opdrachten met bestaande gevers/regio's/missies/voorwerpen/bazen, vereiste missies bereikbaar. Waarschuwingen (111, met `--verbose`) zijn objecten achter een veldpoort: bewust. **Gevonden en opgelost:** Penthesilea stond in Troje midden in de zee (nu aan de kust op 7,10); in Persis kwam je uit Troje precies in een toevallig decor-rotsblok terecht (aankomsttegels blijven nu vrij van decor, `castra-geo.js`).
- **W6 Opdrachttoestanden** (`castra-diarium.js`): `castraQuestState(id)` geeft LOCKED / AVAILABLE / ACTIVE / READY / COMPLETED, afgeleid uit `CASTRA.dq` en de voorwaarden (geen migratie); `castraQuestLockReason(id)` zegt waarom een opdracht dicht is. De ❗/❓/💬-markeringen (`castraDqMark`) en het Diarium gebruiken die ene bron; het Diarium toont hoeveel opdrachten nog dicht zijn. Latijnse en Nederlandse namen in `CASTRA_QSTATE`.
- **W3 Verborgen voorwerpen** (`castra-hidden.js`): per wereld en dag 4 (regio), 2 (grot) of 1 (huis) verborgen vondsten op vrije, bereikbare tegels (niet bij start, poort of deur, minstens 5 tegels uit elkaar). Plekken en inhoud volgen uit regio en datum (geen opslag); gevonden staat in `CASTRA.hid = { day, f }` en wordt de volgende dag gewist. Op twee tegels afstand glimt een zwak ✦. Vondsten (muntje, graan, hout, zelden een fibula/gloria) hebben een Latijns bericht; de beloning schaalt mee met het land.
- **W2 Trainerzicht** (`castra-train.js`): een trainer kijkt naar het midden van de kaart (de weg) en ziet je binnen `CASTRA_TRAIN_SIGHT` = 4 tegels in zijn rij, zonder obstakel ertussen, of als je vlak naast hem staat. Dan verschijnt een "!", hij loopt naar je toe en het gesprek (Latijnse vraag, duel) begint. Loop je daarna verder, dan gaat hij terug. Een verslagen trainer (vandaag) ziet je niet. Test: elke trainer heeft een weg binnen zijn zicht.
- Nog te doen: ronde 2 (inventaris met cultureel verantwoorde voorwerpen, ontmoetingen als systeem) en ronde 3 (flags-voorgevel, wereldtoestanden, nundinae).

## Naar aanleiding van de eerste speeltest: zicht, levenspunten, trainers met een leger, terugknop (2026-10-24)
- **Trainerzicht strenger** (`castra-train.js`): een trainer ziet je alleen recht voor zich, in zijn rij, aan de kant waar hij heen kijkt, op maximaal 3 tegels (`CASTRA_TRAIN_SIGHT`) en zonder obstakel ertussen. Naast, schuin of achter hem niet (eerder triggerde ook "vlak naast hem", en was het bereik 4).
- **Levenspunten blijven** (`castra-hp.js`, nieuw): een soldaat of held begint een gevecht met wat hij na het vorige nog had. Opslag `hpf` (fractie van het maximum) + `hpt` (tijdstip) op de soldaat/held, alleen als er iets ontbreekt. Na elke beurt wordt het leven bewaard (ook bij wisselen en omvallen). Omvallen: soldaat gewond zoals eerder, held 5 min buiten gevecht; terugkeer met 25%. Vanzelf herstel 0,5% per minuut (`CASTRA_HP.regenPerMin`). Genezen helemaal bij put, Hospitium, rustplekken (regio's en Roma), altaar (veldactie) en de genezer (`castraHealAll()`, `castraHealOne()`). De dux begint altijd vol; een gevangen vijand neemt zijn leven mee (`castraHpCarry`, min. 5%). De oude regel "winst met meer dan de helft schade = gewond" is vervallen: het verlies aan levenspunten is nu de straf. Balkjes in scoutscherm, Contubernium, soldatenmenu, wisselkeuze en resultaat.
- **Trainers met meerdere soldaten**: twee in Latium, drie in de andere landen (`castraTrainerCount`), de laatste is de sterkste (+1, +2, +3 gradus). Eerst een intro (trainer, Latijnse regel, "… duos/tres milites habet" en een rij schilden, zoals de ballen in Pokémon), dan pas het keuzescherm. Na elke verslagen soldaat: "Adhuc … militem habet" met de schilden (✖ = verslagen) en kies je opnieuw wie je stuurt. Tussentijdse winsten geven gewone XP en buit, de trainerbeloning (20 + 15n aes, 12 + 8n frumentum, gloria) en de dagmarkering komen pas na de laatste. Naast de naam van de vijand staan de soldaten van de trainer (●●○).
- **Terugknop**: de vaste pijl linksboven (index.html) ging via `goBack()` één scherm terug (wereld → kamp, regiokeuze). Voor alle Castra-schermen roept hij nu `castraPortalBack(screen)` aan (`castra-nav.js`), net als de ‹-knop in de kop: naar het hoofdmenu van Certamen. Elke terugweg vraagt eerst: opslaan en terug / terug zonder opslaan / blijf spelen (`castraAskLeave`); het opruimen (wereld loskoppelen, timers) gebeurt pas na de keuze. Colosseum-lobby en handleiding houden hun eigen terugweg.
- Ook gerepareerd: een gevecht dat afliep voordat de sprites geladen waren, kon het resultaat overschrijven met het gevechtsscherm (`castraVFight`, castra-venatio.js).
- **Tests** (Node, vanuit `certamen/`): `castra-hp-test.js` (32), `castra-train-test.js` (125, nu met trainerleger), naast de bestaande.

## Wereld, ronde 2: saccus met Romeinse voorwerpen, ontmoetingen als systeem, vissen (2026-10-24)
Uit `CASTRA_OVERWORLD_ANALYSE.md` (W4 en de inventaris). Tests (Node, vanuit `certamen/`): `castra-bag-test.js` (79), `castra-enc-test.js` (473), plus de bestaande.
- **Saccus** (`castra-bag.js`): voorwerpen die echt bij de Romeinen hoorden, elk met Latijnse naam en een historische toelichting (`CASTRA_GOODS`): *posca* (zure wijn met water, soldatendrank) 30%, *buccellatum* (soldatenbeschuit) 15%, *mulsum* (honingwijn) 60%, *theriaca* (het wondermiddel van Romeinse artsen; zet iemand buiten gevecht op de been met 50%), *suffimentum* (rookwerk: 100 stappen lang geen zwakkere wilde vijanden), *viaticum* (reisgeld van een rekruut, +15% werfkans), *donativum* (geldgeschenk aan soldaten, +30%) en *hamus* (vishaak, blijft in je saccus). Opslag `CASTRA.bag = { id: aantal }` (los van `CASTRA.items`, de opdrachtvoorwerpen) en `CASTRA.repel`. Geen "potions" of Pokéball-taal: we werven, dus er is geen vangbal.
- **Waar je ze krijgt:** kopen bij de mercator in het kamp (menu ☰ → Sacculus; buiten het kamp staat er dat de mercator in het kamp zit), verborgen vondsten (posca, suffimentum, viaticum), een trainer verslaan (posca), een kampioen voor het eerst (mulsum). De nundinae (ronde 3) wordt de plek voor speciale aanbiedingen.
- **Gebruik:** buiten het gevecht in het menu (kies het voorwerp en wie het krijgt, met HP-balkjes); in het jachtgevecht de knop *Saccus* (alleen geneesmiddelen voor je soldaat, kost je beurt, de vijand slaat toe); bij het werven geef je een viaticum of donativum mee (het geschenk is weg, ook als het niet lukt).
- **Ontmoetingen** (`castra-enc.js`): vaste slottabel per terrein met 12 slots en kansen 20/20/10/10/10/10/5/5/4/4/1/1 % (tier 1: 60, tier 2: 30, tier 3: 9, tier 4: 1; voorheen 60/28/10/2). Elke slot heeft een vaste vorm per regio en terrein (seed uit de naam); mythische slots volgen de mythekans van het terrein; het praetorium begrenst nog de tier. `castraWildPick` is opgesplitst in `castraWildTier/castraWildForm/castraWildLevel` (castra-troops.js) en wordt door de tabel overschreven. `castraEncTableView(rid, terrein)` laat de tabel zien. De kans per stap gebruikt de seed van je save (geen `Math.random()` meer), de eerste 3 stappen na het betreden van een kaart of een gevecht zijn veilig, en het suffimentum houdt vijanden met een lager level dan je eerste soldaat weg (de codex blijft schoon).
- **Vissen:** met een hamus loop je tegen het water aan (of tik je erop) en er kan iets bijten (70%, seeded) dat bij het watertreintype van het land hoort: tiberis, litus, scamander, flumen, nilus of palus (niet in Persis en Roma). Een brugtegel is geen water.
- Nog niet: Tabula cerata (leert een move), mercator buiten het kamp, ronde 3 (flags, wereldtoestanden, nundinae).

## Wereld, ronde 3: flags en events, wereldtoestanden, nundinae (2026-10-24)
Uit `CASTRA_OVERWORLD_ANALYSE.md` (W5, W7, W9). Test: `node tools/castra-flags-test.js` (87 controles); de wereldtest controleert nu ook alle nieuwe personen en dat geen twee scripts dezelfde top-level `const` declareren (dat geeft in de browser een SyntaxError).
- **Flags-voorgevel** (`castra-flags.js`): `castraFlag(spec)` leest de toestand die al ergens in de save staat, met één taal: `mission:m3`, `region:roma`, `gate:latium|N`, `quest:id`, `questready:`/`questactive:`, `insignia:`, `item:`, `good:`, `built:`, `hero:`, `visited:`, `phase:nox`, `lvl:10`, `nundinae`, `flag:naam`, gecombineerd met `{not}`, `{all}`, `{any}`. Eigen vlaggen via `castraSetFlag(naam)` in `CASTRA.flags`. Er is niets herschreven; bestaande modules houden hun eigen opslag.
- **Eventtabel** (`CASTRA_EVENTS`): `{ id, map, on: "enter"|"step"|"interact", at, target, if, once: true|"day", block, do:[…] }` met de commando's `say`, `toast`, `give`, `good`, `flag`, `xp`. Haakt in `castraWorldRender` (enter), `castraWorldSavePos` (step) en `castraNpcTalk` (interact). Wat al gebeurd is staat in `CASTRA.ev`. Entiteiten kunnen een voorwaarde `when` krijgen (ze bestaan alleen als die waar is) en met `role:"say"` praten ze met hun `say`-regels.
- **Wereldtoestanden** (`castra-wstate.js`): vier plaatsen reageren op een gewonnen missie: Ardea in Latium (m3, de weg naar Rome), het labyrint van Graecia (g2, de Minotaurus), Alesia in Gallia (ga2) en Thermopylae in Laconia (la1). Voor de missie staat er een bezorgde bewoner, erna een opgeluchte, op dezelfde plek, en bij het weer binnenkomen komt er eenmalig een bericht. Plekken gekozen met een controle op bereikbaarheid in de open én de dichte toestand. Latijn is eenvoudig (laat nakijken: Thermopylarum is genitivus pluralis).
- **Nundinae** (`castra-nund.js`): elke 8e dag (telling vanaf de datum, `castraNundinae()` = `{ on, phase, next }`). Op marktdag: een marktkraam (Mercator nundinarum) bij de reisplek van elk land (`CASTRA_MARKET_POS`) die het menu van de saccus opent met de winkel, 20% korting op grondstoffen (`castraGoodPrice`, omhoog afgerond, gloria niet), **libum** (offerkoek, geneest 40%, alleen op marktdag te koop), twee extra verborgen vondsten per land, de chip 🏺 in de balk en een bericht bij het betreden van een land. Op gewone dagen vertelt de saccus hoeveel dagen het nog duurt.
- Gevonden en opgelost door de wereldtest: de eerste versie van `castra-flags.js` gebruikte dezelfde `const`-namen als `castra-field.js` (`_castraWEntVisibleFl0`, `_castraNpcTalkFl0`); in de browser zou het bestand niet geladen zijn. Ook zette de test de ontgrendeling niet open, waardoor hij veel objecten oversloeg; nu staat het Castra-niveau op maximaal (4807 controles).
- Nog niet: Tabula cerata (leert een move), ledges en schuifbare rotsen (W8), weer (W10), Venatio magna en puzzelhuis (W11).

## Bergpaden, ledges, rotsen, veldeffecten en geluidjes (2026-10-24)
Uit `CASTRA_WERELD_LEVEND.md` (L1 en L2, plus de kleine geluiden van L7). Test: `node tools/castra-berg-test.js` (71 controles); de wereldtest rekent nu met een gerichte graaf en heeft een nieuw hoofdstuk 9.
- **Bergterrein** (`castra-berg.js`): een ASCII-kaart per land (`CASTRA_BERG`) bepaalt terrassen (`.`, steen met ontmoetingen van het bergterrein), hellingen en paden (`p`, zand), klifwand (`#`), ledges (`v ^ > <`) en een rots (`o`). Proefland **Graecia**: de berg linksboven (x 2-25, y 2-17), drie terrassen die je via haarspeldbochten beklimt (ingang aan de oostkant van de voet), een ledge-shortcut van boven naar beneden in drie sprongen, een kist op het hoogste terras en een kist in een nis die met een rots is afgesloten. Hercules staat nu op het hoogste terras, Iason iets zuidelijker, en een kist verhuisde naar de voet (de oude plekken lagen in de klifwand).
- **Klifwand** zelf getekend op het canvas (`castraDrawCliffCell`: lagen in de rots, lichte rand bovenaan, schaduw onderaan, pijltjes bij een ledge), in afwachting van echte klif-tegels (`Outside_A4`). Tilesets zijn niet aangepast. De schaduw onder bomen en palmen komt uit dezelfde tekenstap.
- **Ledge** werkt als `MB_JUMP_*` in pokeemerald: lopen in de springrichting tegen een ledge geeft een sprong van twee tegels (hop-animatie, stof, geluid, daarna eventueel een ontmoeting op de landing); van een andere kant of tegen de richting in is het gewoon een klif. **Rots:** een hopliet of spartaan (zoals bij de veldactie *saxum*) duwt hem één tegel; hij kan nooit op een helling, een ledge, een muur of buiten de kaart, en staat bij het opnieuw betreden van de kaart weer op zijn plek. Verborgen vondsten mijden rotsen.
- **Wereldtest:** een gerichte graaf (ledge = eenrichtingsverkeer), de ledge-takeoff en -landing moeten bereikbaar zijn, **niemand zit vast** (alles wat je bereikt, laat je ook weer terug naar de start), elke rots staat op een terras en kan minstens één kant op, en alles wat niet `optional` is, ligt niet achter een rots (de kist in de nis is `optional`). Ook een controle dat geen twee scripts dezelfde `const` declareren.
- **Veldeffecten** (`castra-fx.js`): grasritseling (bladeren), rimpels naast water, glinsterend water, zandvoetstappen die vervagen, stofwolkjes bij sprong en rots, overdag vlinders in groene landen, 's nachts vuurvliegjes, af en toe een vogel. Alleen lichte overlays; uit bij "minder beweging".
- **Geluid** (`castra-fx.js`, WebAudio, geen bestanden): stappen per ondergrond (gras, zand, steen, brug), sprong, landing, rots, rimpel, vondst, kist, aankoop, genezing en de waarschuwing van een trainer. Aan of uit in het menu ☰ → **Sonus** (standaard aan, zacht; keuze in `localStorage`). **Muziek** is bewust niet gebouwd: Gerben laat die (mogelijk met Suno) zelf maken; als er bestanden zijn, hangen we er een speler aan per land en dagdeel.
- Nog niet: bergen in Persis, Laconia en Themiscyra (hetzelfde recept met een eigen kaart), echte klif-tegels, de volger (L4), bewoners met gedrag (L3), mythische schuilers en groeiende dingen (L5), weer (L6).

## Echte klif-tegels voor de bergen (2026-10-24)
Gerben leverde `Outside_A4` (RPG Maker MV, muren en kliffen); het staat nu in `assets/tilesets/` (README bijgewerkt) en in `CASTRA_TS_FILES` (`castra-map.js`). De tweede afbeelding die hij meestuurde bleek identiek aan onze bestaande `Outside_A5` (pixel voor pixel gecontroleerd).
- **Plateau en klif** (`castraDrawBergA4`, `castra-berg.js`): de terrassen worden getekend als plateau-autotile uit rij 10-12 van het blok (kwartjes van 24 px gekozen uit de buren boven, onder, links en rechts: `castraPlateauQuarters`), met de pebble-rand langs de klif; de klifwand is het middenstuk (48 px) van rij 13 en 14, zodat hij naadloos doorloopt; een band van één tegel krijgt de bovenste helft van rij 13 plus de onderste helft van rij 14. Stijl per berg: `style` in `CASTRA_BERG` (`grass`, `sand`, `sand2`, `snow`; Graecia `sand`). Pijltjes bij een ledge liggen als lichte markering over de wand. Ontbreekt het plaatje, dan valt hij terug op de zelfgetekende klifwand.
- Niet gedaan: hoekstukken waar twee randen een holle hoek vormen (bij een helling in de klif ontbreekt een klein stukje rand) en de binnenste hoeken van het autotile-blok (rij 10). Bij de andere bergen (Persis, Laconia, Themiscyra) kan hetzelfde recept met `style:"grass"` of `"sand2"`.

### Terrassen, kronkelpaden en natuurlijke afsluitingen (2026-10-24)
- **Terrassen** (`certamen/castra-terras.js`, `CASTRA_TERRAS`): plateaus op twee niveaus met wand, rand, binnenhoeken en automatische trappen; Laconia (Sparta) is er mee bergachtig gemaakt. Zie `CASTRA_WERELD_LEVEND.md` §7 voor de RPG-Maker-studie van `Outside_A4`.
- **Landschap** (`certamen/castra-land.js`): de niet-Romeinse landen krijgen een kronkelende weg door ankerpunten, meertjes met A1-oevers en bossen op een rooster; Latium, Roma en Gallia houden rechte wegen.
- **Afsluitingen**: `castraBarrierPlan` vervangt de rechte heg bij elke poort door een kronkelend lint (bosrand van wisselende dikte, of twee meertjes met een doorgang van één tegel); `castra-field.js` valt terug op de oude heg als er geen plan past. Tests: `certamen/tools/castra-land-test.js`, `castra-world-test.js`.
- **Terrassen per land (2026-10-24):** `CASTRA_TERRAS` heeft nu Laconia (zand), Themiscyra (gras, bosberg van de Amazones), Persis (zandsteenmesa's), Aegyptus (tafelbergen langs de Nijl) en Africa (de Atlas). Nog zonder: Graecia (ASCII-berg), Troia, Germania, Gallia, Latium, Roma. De ravijnen zijn de vrije stroken tussen de mesa's; echte ravijntegels (Dungeon-sets, nog niet gebruikt) blijven een idee.
- **Kerkhof van Roma (2026-10-25):** `roma/sepulcretum` (zone x 40-55, y 41-48, graven uit Outside_C in `CASTRA_ROMA_GRAVES`, `castra-roma.js`). Schimmen (Umbra, Lemur, Larva) leven alleen daar en in de catacomben; overal elders uit de tabellen gehaald. Plan voor de overige wezens: `CASTRA_MYTHISCHE_WEZENS.md`.
- **Roma als stad (2026-10-25, `certamen/castra-urbs.js`, `CASTRA_URBS.roma`):** de heggen op de poortrijen (y 18 en 38) zijn een tweerijige zandsteenmuur (Outside_A4; `W.cityWall`), de tenten zijn gebouwen (dak Outside_A3 boven een gevel van wit marmer of tan baksteen, met een deur op de plek van de oude tentdeur), standbeelden en zuilen uit Outside_C, en 70% van de losse bomen binnen de muren is weg. De zuidmuur (y 38) is de buitenmuur: kerkhof, catacomben en start liggen erbuiten. Open: bestrating en meer stedelijke tegels (Gerben zoekt een Grieks-Romeinse tileset).
- **Roma: Colosseum, tempel en triomfbogen (2026-10-25):** grote gebouwen als één plaatje (`CASTRA_URBS.roma.landmarks`, tilesets `Roma_A.png`/`Roma_B.png` van Gerben): het Colosseum (9×13 tegels, x 12-20, y 20-32, ovaal solide, deur op 16,32 voor de lobby) en een tempel (x 57-65, y 1-13, decor). Beide stadspoorten zijn een verkleinde triomfboog met de doorgang op de poortopening (bovenlaag, je loopt eronder door). Wat onder het Colosseum stond, verhuist bij het laden; de dwarsstraat begint bij het Colosseum. Extra sets voor later: `Roma_A2.png`, `Aegyptus_A.png`, `Aegyptus_floor.png`.
- **Deuren en binnenruimtes (2026-10-25):** een deur vóór het vereiste niveau (de meeste: "wereld", Castra-niveau 3) deed stil niets, waardoor de tenten in Latium onbruikbaar leken; nu verschijnt een melding met het niveau (`castraGeoDoor`, `castra-interiors.js`). Nieuw: de tempel in Roma is binnen te gaan (`templum_roma`, deur 61,13): de Pontifex laat je eens per dag offeren (soldaten genezen, +10 ervaring), met een kist. Alle regio's hebben een domus, taberna en caverna; Roma heeft er nu acht (ludus, tabularium, curia, thermae, colosseum, templum, catacomben I en II).
- **Bouwtijden en level 10 (2026-10-25):** alle kampgebouwen (behalve Principia) gaan tot level 10 (`CASTRA_BAL.maxLvl`); een upgrade kost grondstoffen (`costExp` 1,6) en echte tijd: `CASTRA_BAL.buildMin` = 1, 2, 5, 12, 30, 75, 180, 420, 960, 2160 minuten voor level 1 t/m 10 (samen ±64 uur per gebouw). De kosten gaan er meteen af, het level komt erbij als de tijd om is (`CASTRA.b[id].up = {to, end}`, loopt door als je weg bent, `castraLvl` rondt af). Bouwers: 1, een tweede vanaf Praetorium 4, een derde vanaf 8 (`builderStep`). Alle gebouwpanelen gebruiken `castraUpgradeUI`. Ontwikkelaarsstand (`CASTRA.dev`): meteen klaar. De TD-slagorde blijft op 14 (level 6-10 van het Praetorium maakt haar niet groter). Test: `tools/castra-build-test.js`. De tent (herberg) in Latium is vanaf niveau 1 open (`feat:"open"`); de grot blijft dicht tot niveau 3.
- **Kaart Fabri (2026-10-25):** kaart (bijzonder, 3% per ster, tot 15%) die de bouwtijd verkort (`castraBuildMs`, `castra-cards.js`/`castra.js`); geldt voor nieuwe bouwwerken, een lopende bouw houdt zijn eindtijd. Test: `tools/castra-build-test.js` onderdeel 6.
- **Gevechtsscherm (2026-10-25):** Vlucht-knop (`castraVFlee`, `castra-moves.js`): kost een beurt, kans = snelheid/vijandsnelheid (Pokémon-formule, +30/255 per poging, minimaal 25%), mislukt = de vijand valt gratis aan, niet voor een trainer; Capere kostte al een beurt bij een mislukking (3 pogingen) en meldt dat nu duidelijk; blauwe ervaringsbalk onder de HP-balk van je eigen eenheid (`castraVSceneXpBar`, `castra-vscene.js`).
- **FAQ Tabulae (2026-10-25):** sectie "Tabulae: kaarten met bonussen" in `castra-faq.js`: trekken (gratis dagelijks, trekkingen, 5 roem), zeldzaamheden en kansen, medelijden, sterren (1/2/4/7/12), tabel die uit `CASTRA_CARDS` wordt opgebouwd (loopt dus vanzelf mee), en waar ze werken; Aeneas' melding bij niveau 5 verwijst naar menu en handleiding.
- **Pokémon-menu in het jachtgevecht (2026-10-25):** hoofdmenu met vier grote gekleurde knoppen (Pugna, Saccus, Milites, Fuga) en links de vraag "Quid faciet X?"; Pugna opent de aanvallen + Defende (`V.fightOpen`, `castraVFightMenu`), Saccus de voorwerpen + Capere (`castraBagCapere`, `castra-bag.js`), Milites het wisselmenu (`castra-party.js`), Fuga is direct. De losse knopinjecties van zak en wissel zijn vervangen.
- **Fix herberg Latium (2026-10-25):** de herberg was vanaf niveau 1 te betreden, maar de uitgang viel onder dezelfde niveau-3-vergrendeling (spelers zaten vast) en de inhoud (waardin, kist, boek) bleef onzichtbaar terwijl het opdracht-"!" wel zichtbaar was. Nu: naar buiten kan altijd (`castraGeoDoor`: alleen een deur naar binnen is op slot), alles in `villa_latium` is vanaf niveau 1 zichtbaar (`castraWFeat`: "open"), en opdrachtmarkeringen verschijnen alleen bij personen die je kunt zien (`castra-diarium.js`). De handleiding legt !, ? en 💬 uit.
- **Portretten (2026-10-25):** het gespreksvak toont een portret uit `assets/portraits/<naam>.png` (144×144) of een vlak uit een RPG Maker-gezichtenblad (`CASTRA_PORTRAIT_SHEETS`, `castra-tutorial.js`); zonder bestand blijft de avatar. Overzicht: `tools/castra-portraits-manifest.js` → `assets/portraits/MANIFEST.md`. Lijst voor het sprites-gesprek: `CASTRA_SPRITES_BAASSEN_TRAINERS.md`.
