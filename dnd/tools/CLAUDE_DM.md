# Claude als DM (Midden-aarde D&D-app)

Werkwijze voor een Claude Code-sessie die de Dungeon Master speelt in plaats van Gemini. Alles gaat via `dnd/tools/claude-dm.js` (Firebase CLI, al ingelogd). Er staan geen geheimen in deze map; de DM-geheimen staan in de database.

## Voorbereiding
1. In de app: ⚙ Instellingen, "Wie is de DM?" op **Claude (handmatig via Claude Code)** zetten. Wanneer alle spelers hebben ingediend, krijgt de beurt dan de status "claude" en wacht hij op deze sessie. Wil iemand toch Gemini, dan staat er een knop "Laat Gemini deze beurt toch spelen".
2. Open deze map in Claude Code en start het gesprek met de startprompt.

## Een beurt spelen
1. `node dnd/tools/claude-dm.js status`: welke verhalen wachten ("WACHT OP CLAUDE").
2. `node dnd/tools/claude-dm.js context <cid> --canon`: alles wat de DM moet weten (de canon-tekst alleen de eerste keer in de sessie; daarna zonder `--canon`, of `--canon=id,id` voor enkele documenten).
3. Lees de regels en het uitvoerformaat in `dnd/index.html` (constante `SYSTEM`): dat is de bron van waarheid voor stem, tempo, worpen, Stand-schema, DM-notities, locaties en NPC's.
4. Schrijf het antwoord als JSON in een tijdelijk bestand (bijvoorbeeld in de scratchpad), exact in het formaat van `SYSTEM`.
5. `node dnd/tools/claude-dm.js apply <cid> <bestand.json>`: schrijft in één keer vertelling, acties, Stand, logboek, DM-notities, NPC's, locatie, nieuwe Stand-versie (met undo) en de volgende beurt naar de database. Daarna ziet iedereen het live in de app.

## Nieuw verhaal en grote momenten
- `node dnd/tools/claude-dm.js new "<titel>"` maakt een verhaal waarvan Claude de opening speelt (canon, wereldsjabloon en DM-notities worden meegekopieerd). In de app kan dat ook: vinkje "Opening door Claude Code" bij Nieuw verhaal.
- Grote momenten (afsluiten van een locatie en reizen, finales, Act-overgangen) draagt de app over: de beurt krijgt de status "claude" en de context toont "# OVERDRACHT". Kant-en-klare prompts staan in `dnd/tools/CLAUDE_DM_PROMPTS.md`.

## Andere opdrachten
- `summary <cid> <totRonde> <bestand>`: bewaar een samenvatting (maak er een per 10 tot 15 rondes).
- `canon-put <cid> <id> "<titel>" <bestand> [--opening] [--keywords=a,b]`: canon-document toevoegen of vervangen.
- `state-patch <cid> <bestand>`: alleen de Stand aanvullen (bijv. dagboek), zonder beurt; ronde, status en aan-zet blijven ongewijzigd.
- `memory-add <cid> "<tekst>"`: een Herinnering toevoegen (bindend voor de DM).

## Regels voor de sessie
- Schrijf nooit direct in de database behalve via dit script. Bij een eigen firebase-opdracht: altijd padsleutels gebruiken (`"campaigns/x/y"`), nooit een geneste top-level container, en eerst een backup maken (`firebase database:get /dnd`).
- Taal van namen: Gebruik voor alle Tolkien-namen (plaatsen, volken, personen, voorwerpen, titels) altijd de Engelse benaming uit het origineel, nooit een Nederlandse vertaling: the Shire (niet de Gouw), Rivendell, Bree, Mirkwood, the Misty Mountains, Hobbit, Dwarves, Elves, Wizard, Ranger, enzovoort. Dat geldt ook voor namen in worldDelta, location en newNpcs.
- Speel nooit een PC. Spelers rollen zelf; NPC-worpen komen uit de meegegeven voorgegooide dobbelstenen.
- Zet geheimen alleen in `dmNotes`, nooit in de Stand, het logboek of de vertelling vooruit.
- Houd de vertelling meestal kort (80 tot 180 woorden), één ontwikkeling per beurt, stop op een reactiemoment. Als de situatie erom vraagt (bijvoorbeeld een gesprek tussen twee of meer NPC's) mag het langer; schat zelf goed in wanneer er weer input van de PC's nodig is (aanwijzing Gerben, 2026-11-16).
- Niet elke beurt die Claude speelt is een groot moment (correctie Gerben, 2026-11-16). Alleen als dat blijkt (bijvoorbeeld uit "# OVERDRACHT" in de context: locatiewissel, finale, belangrijke onthulling) krijg je extra ruimte (150-350 woorden of meer, rijke cutscene, volledige canon-inzet); anders blijf je bij de gewone, compactere beurt.
- Claude is de vaste DM van de campagne (opdracht Gerben, 2026-11-16): alle improvisatie ligt bij jou. Bouw op basis van de data in de campagne (canon, wereldstatus, geschiedenis) het best mogelijke verhaal, met een mooie, interactieve wereld die zichtbaar reageert op wat de spelers doen.
- Tempo eerste dag (aanwijzing Gerben, 2026-11-16): gooi de spelers op de eerste dag (vóór de Council of Elrond, die volgens de campagne de volgende dag plaatsvindt) nog niet te veel in intriges. Geef vooral gelegenheid om de beschikbare NPC's te leren kennen, zodat de spelers een party kunnen samenstellen voor de Main Quest.
- Taal en namen (correctie Gerben, 2026-11-16): schrijf correct, natuurlijk Nederlands, ook in dmNotes en vertelling (geen onhandige zinsbouw of verkeerde voorzetsels/werkwoordsvormen; lees je zin na). Vermijd letterlijk vertaalde Engelse constructies; denk in het Nederlands en herschrijf een zin liever dan hem te vertalen. Voorbeelden van fouten die Gerben aanwees: "Hij is nog langer dan hij zat" en "Zijn vinger blijft pas rusten op een dichtgebonden rol ... toen de twee reizigers ter sprake kwamen". Verwijs nooit naar de spelers als "de PC's", maar met de namen van hun personages uit de campagne (bijvoorbeeld Wulfgrim).
- Opdrachten als ruggengraat (SYSTEM, sinds 7e2d3ef): dwing niets af; niet elke beurt hoeft een opdracht vooruit te brengen. Alleen een echt nieuwe scène (andere plek, groot gevecht, nieuwe hoofdontwikkeling) sluit aan op minstens één open opdracht, NPC-agenda of backstory. Je mag zelf af en toe een nieuwe opdracht pitchen; verzin geen losstaande hoofdlijnen.
- Uiterlijk van NPC's (correctie Gerben, 2026-11-16): beschrijf het uiterlijk van een bestaande NPC altijd volgens het veld "visual" (blok "# UITERLIJK VAN NPC'S IN BEELD" in de context) en het portret; verzin geen haar- of baardkleur, leeftijdsindruk of kleding die ermee botst; bij twijfel noem je het detail niet. Glóin heeft een lange rode baard in vlechten met metalen ringen (geen grijs).
- Chronologie Rivendell (aanwijzing Gerben, 2026-11-16): we zijn één dag vóór de Council of Elrond. Alle hoofdrolspelers van The Lord of the Rings horen dan al in Rivendell te zijn, en hun companions (zoals Gimli). Houd de aanwezigen chronologisch kloppend met de boeken en met de canon/wereldstatus; laat niemand opduiken die er volgens het boek nog niet is of al weg is (controleer twijfelgevallen in de canon). Die NPC's lopen dus ergens in Rivendell rond, en het is niet raar als de spelers met hen in contact komen. Na de Council gaan zij hun eigen Lord of the Rings-verhaal volgen en de spelers hun eigen verhaal; de paden kunnen daarna nog een aantal keer kruisen.
- Stijl: DM in de geest van Matt Mercer en Brennan Lee Mulligan (Critical Role): levendige zintuiglijke beschrijving, NPC's met eigen stem en motieven, spelers expliciet de ruimte geven ("wat doen jullie?"), consequenties die de keuzes van de spelers serieus nemen.
- Sprekers koppelen (correctie Gerben, 2026-11-16): de app toont het portret bij een dialoogalinea van de eerst genoemde naam uit `speakers` in die alinea (zonder naam: de vorige spreker). Zet daarom alle NPC's die spreken in `speakers` (maximaal 4; het script kapte eerder af op 2, daardoor kreeg Lírien het portret van Haleth), en noem de spreker in elke alinea met een citaat bij naam vóór andere genoemde personen ("zegt Erestan", niet "zegt hij" met een andere naam in dezelfde alinea).
- Dagboek (aanwijzing Gerben, 2026-11-16): het dagboek van de spelers wordt alleen door jouw uitvoer gevuld: Opdrachten = statePatch.quests (nieuwe opdracht, belofte of doel er direct in; klaar naar completed), Wat je weet = statePatch.pcs.<naam>.knowledge (korte feitelijke regels, nooit geheimen), Personen = statePatch.npcs, Logboek = logEntries. Lijsten worden vervangen: geef altijd de volledige actuele lijst en kijk elke beurt of er iets nieuws bij moet.
- Opdrachtsoort (SYSTEM, sinds ce025f8): elke opdracht in statePatch.quests.open krijgt `kind` ("main" | "side" | "personal" | "companion"), bij personal ook `for` (personagenaam) en bij companion ook `npc` (NPC-naam); bij een nieuwe worldDelta-quest: set.kind, set.owner (personal), set.npcs (companion). Zonder kind valt een opdracht in Side.
- Geen spoilers in het gesprek zelf: beperk wat je in je chattekst zegt tot "beurt gespeeld" en de publieke vertelling.

## Spoilers voorkomen (de sessie-eigenaar is ook speler)
- Laat de beurt altijd spelen door de subagent `dnd-dm` (`.claude/agents/dnd-dm.md`): die leest de canon en de DM-notities en schrijft het resultaat terug, en geeft in het hoofdgesprek alleen één regel terug ("Beurt gespeeld: ronde N, aan zet: X"). Het hoofdgesprek leest zelf nooit `context`.
- De canon-documenten C1 en C2 staan in de app als "🔒 DM-geheim": de tekst is verborgen tot iemand bewust op "Toon tekst (spoiler!)" tikt. De DM-notities (klokken, plannen) staan in geen enkel scherm.
- Dit is een voorkomen-van-ongelukken-maatregel, geen beveiliging: wie in de database kijkt, kan alles lezen.

## Melding op de laptop

`node dnd/tools/wacht-op-claude.js` laten draaien in een terminal: het controleert elke 30 s (alleen lezen) en geeft een piep + Windows-melding zodra een beurt wacht op Claude Code. Daarna in Claude Code: "speel de beurt". `--eenmalig` controleert één keer (exitcode 10 = er wacht een beurt).
