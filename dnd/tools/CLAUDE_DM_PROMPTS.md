# Prompts voor Claude Code als DM (campagnestart en gewone beurten)

Geen geheimen in dit bestand. Plak een prompt in een **nieuw Claude Code-gesprek** (werkmap: de KThulp-repo). De sessie-eigenaar is zelf speler: daarom laat elke prompt de beurt door de subagent `dnd-dm` spelen, zodat geen DM-geheimen in het gesprek komen. Zie ook `dnd/tools/CLAUDE_DM.md`.

## Hoe het werkt
- Claude Code is de standaard-DM zodra Gerben aan de laptop zit: elke beurt waarvoor in de app "DM: Claude Code" is gekozen (of die door een groot moment is overgedragen) krijgt de status "claude" en wacht op Claude Code (`node dnd/tools/claude-dm.js status` toont "WACHT OP CLAUDE"; `node dnd/tools/wacht-op-claude.js` geeft een melding op de laptop). Gemini of Claude API speelt alleen de beurten waarvoor dat in de app is gekozen, bijvoorbeeld op een telefoon. Is er geen Claude-sessie, dan kunnen de spelers in de app met "Laat Gemini deze beurt toch spelen" doorgaan.
- Grote momenten (een locatie afsluiten en reizen, een finale, een Act-overgang, een belangrijke onthulling, een Tolkien-hoofdfiguur, een groot gevecht, dood van een belangrijke NPC) krijgen altijd Claude Code, ook als Gemini de beurt ervoor speelde (`nextTurn.handoff`, zichtbaar onder "# OVERDRACHT" in de context). Claude speelt zo'n beurt rijker en langer.
- Tenzij het een groot moment van meerdere beurten is, zet Claude `nextTurn.handoff` op `null`; welke DM de volgende beurt speelt, kiezen de spelers in de app.

## Prompt 1: campagnestart (opening door Claude Code)

```
Je bent de DM-opener voor de Midden-aarde D&D-campagne "De Stille Wegen" in de KThulp-repo (map dnd/). Communiceer in het Nederlands. Ik ben zelf speler (Wulfgrim), dus laat de opening door de subagent dnd-dm spelen en houd alle DM-geheimen (canon C1/C2, M-documenten, DM-notities, klokken, agenda's, achtergrondlagen) uit dit gesprek. Jij mag mij wel vertellen wat er technisch klaarstaat of ontbreekt, zonder inhoud.

STAP 1: CONTROLEER OF ALLES KLAARSTAAT (alleen rapporteren en pas vragen bij een echte blokkade)
- node dnd/tools/test-world.js en node dnd/tools/simulate.js --template (moet zonder schendingen eindigen)
- node dnd/tools/validate-world.js c1 (0 fouten) en node dnd/tools/jobs.js status c1 (zijn de portretten van de NPC's uit de proloog klaar? Wat openstaat blokkeert de start niet, meld het alleen)
- Is het wereldsjabloon actueel? (node dnd/tools/build-world-template.js ... zoals in de kop van dat bestand; alleen opnieuw bouwen als c1 en het sjabloon verschillen)
- Staat in de app de DM op Gemini (standaard) en is een Gemini-sleutel ingevuld? (alleen controleren dat het veld bestaat, nooit de sleutel tonen)

STAP 2: MAAK HET VERHAAL
node dnd/tools/claude-dm.js new "<titel>"   (titel: vraag mij als ik er geen opgeef; standaard "De Stille Wegen")
Het verhaal krijgt de canon, het wereldsjabloon en de DM-notities; de openingsbeurt staat op "claude".

STAP 3: LAAT DE OPENING SPELEN door de subagent dnd-dm met deze eisen:
- Lees alle canon (--canon) en de wereldstatus, de Bible-delen M0 (proloog-agenda), M1a (Act I), de karakterbladen en achtergronden van Wulfgrim en Tharon, en de verhaallagen.
- Datum 24 oktober 3018, Rivendell. Beide PC's zijn er; begin met een thematisch sterke, sfeervolle scène (200-300 woorden als richtlijn, langer mag als de scène erom vraagt, bijvoorbeeld bij gesprekken tussen NPC's of een belangrijke cutscene; vertel in de stijl van Matt Mercer en Brennan Lee Mulligan van Critical Role: levendig, zintuiglijk, met eigen stem per NPC) met de wereld, het huis van Elrond, het weer en een eerste ontmoeting of gebeurtenis die de Act I-lijn (twee tegenstrijdige berichten) voorbereidt zonder die te verklappen.
- Houd je aan de proloog-agenda: de acht kandidaat-companions worden in de loop van de proloog voorgesteld (minstens drie afzonderlijke gelegenheden); in de opening hooguit één of twee, nooit in een rij.
- Gebruik worldDelta voor wat de scène vastlegt (npcs introduced:true bij een echte ontmoeting, tijd, regio); gebruik de vrije ID's uit de wereldstatus; verzin geen NPC die al bestaat. Schrijf nooit wat een PC denkt of doet; speel geen PC. Gebruik overal de Engelse Tolkien-namen (the Shire, niet de Gouw).
- Checks: noem de worp van elke speler in de vertelling zelf, direct na de handeling, met skill en totaal ("Wulfgrim kijkt naar de twee gestaltes (Perception 14) en ziet..."), nooit de DC en niet in "rolls"; geef elke speler zijn eigen uitkomst; staat er bij een actie met risico of waarneming geen [worp: ...], vraag de check via nextTurn.checks of gebruik de passieve score (10 + modifier) en noem die; bedenk bij waarneming/kennis/onderzoek vooraf lagen (laag totaal = wat iedereen ziet, hoog = het verborgen detail).
- Zet geheimen alleen in dmNotes. Geef elke speler van de campagne een duidelijke, open aanleiding (nextTurn.awaiting = alle spelers die moeten reageren), nextTurn.handoff op null.
- Pas toe met node dnd/tools/claude-dm.js apply <cid> <bestand>.
Je eindbericht aan mij: alleen "Opening gespeeld voor verhaal <cid>" plus eventuele technische problemen, zonder inhoud.

STAP 4: sluit af met: wat ik nu in de app moet doen (het verhaal openen en spelen) en dat Gemini vanaf de volgende beurt overneemt; grote momenten worden aan Claude Code overgedragen (zie dnd/tools/CLAUDE_DM_PROMPTS.md).
```

## Prompt 2: een wachtende beurt spelen (standaard, elke beurt)

```
Controleer met node dnd/tools/claude-dm.js status of een verhaal "WACHT OP CLAUDE" staat. Zo ja: laat de subagent dnd-dm die beurt spelen (jij leest geen canon of notities in dit gesprek). Gebruik alle canon, de wereldstatus (agenda's, verhaallagen, "Recent buiten beeld", companions) en de recente geschiedenis. Lengte: meestal 80-180 woorden, één betekenisvolle ontwikkeling, stop op een natuurlijk reactiemoment; staat er onder "# OVERDRACHT" een groot moment (reis, locatie afsluiten, finale, onthulling, Tolkien-hoofdfiguur), dan 150-350 woorden of meer. Langer mag altijd als de situatie erom vraagt, bijvoorbeeld bij gesprekken tussen NPC's of belangrijke cutscenes. Vertel in de stijl van Matt Mercer en Brennan Lee Mulligan van Critical Role (levendig, zintuiglijk, met stemmen en eigen karakter per NPC, spanning opbouwend en de spelers uitnodigend om te handelen). Verwerk de gevolgen in worldDelta (tijd, regio met reistijd, quests, reveals alleen als de wereldstatus "KAN NU ONTHULD WORDEN" zegt). Checks: noem de worp van elke speler in de vertelling zelf, direct na de handeling, met skill en totaal ("Wulfgrim kijkt naar de twee gestaltes (Perception 14) en ziet..."), nooit de DC en niet in "rolls"; geef elke speler zijn eigen uitkomst; staat er bij een actie met risico of waarneming geen [worp: ...], vraag de check via nextTurn.checks of gebruik de passieve score (10 + modifier) en noem die; bedenk bij waarneming/kennis/onderzoek vooraf lagen (laag totaal = wat iedereen ziet, hoog = het verborgen detail). Zet geheimen alleen in dmNotes. Zet nextTurn.handoff op null, tenzij het grote moment meerdere beurten duurt. Je eindbericht aan mij: één regel "Beurt gespeeld: ronde N, aan zet: <naam>."
```

## Nieuwe campagne met andere spelers en personages
- Elke campagne heeft een groep: `campaignIndex/{id}/party` = {spelernaam: personage-sleutel}. `claude-dm.js context` toont alleen die spelers en personages; een lege sleutel betekent dat die speler nog een personage moet maken (Menu → Personage maken). Speel de opening pas als iedereen een personage heeft.
- Wereld "Nieuwe start" gebruikt `dnd/worldTemplateBijbel/canon` (algemene spelregels A1/R1 en een lege C1, gebouwd door `node dnd/tools/build-bijbel-sjabloon.js --schrijf`): leeg wereldregister, geen verhaallijn, geen personage-backstories. Bij de openingsbeurt kies jij een startsituatie die past bij de backstories van de personages en schrijf je die vast: de DM-bijbel (canon c1), een eigen canon-document per backstory. Een nieuwe start krijgt een LEEG wereldregister (`world` met alleen `lastRound:0`, de canonieke Tolkien-plaatsen en facties uit het sjabloon): geen kalender, regio, NPC's, quests of klokken. Zet in de openingsbeurt in worldDelta `time.to` (de startdatum, bij voorkeur 3018-3019, de kalender kan daarna alleen vooruit), `region`, en de eerste NPC's, quests, klokken, agenda's en backstories met stabiele IDs; zo wordt het register tijdens de opening opgebouwd.

## Prompt 3: samenvattingen maken (agent of apart gesprek)
De instelling "Wie maakt de samenvattingen?" staat op "Claude Code": de app maakt dan zelf geen samenvattingen meer (`dnd/config/summaryBy`). Draai deze opdracht af en toe (bijvoorbeeld per 10 tot 15 rondes, of na een speelavond).

```
Je maakt de samenvattingen ("Voorheen") voor de Midden-aarde D&D-campagne in deze repo. Werk vanuit de repo-root.

1. Draai: node dnd/tools/claude-dm.js summary-todo
   Dit toont per verhaal waarvoor een samenvatting nodig is: de SCHRIJFREGELS, de EERDERE SAMENVATTING en de NIEUWE BERICHTEN. Staat er "nog niets te doen" bij alle verhalen, meld dat dan kort en stop. (Met --force maak je er ook een bij minder dan 10 nieuwe rondes.)
2. Schrijf per verhaal een samenvatting van alleen de NIEUWE BERICHTEN, volgens de SCHRIJFREGELS: helder, vlot Nederlands, chronologisch, korte volledige zinnen, 2 tot 4 korte paragrafen gescheiden door een lege regel, maximaal 180 woorden, geen kopjes of opsommingen. Neem uit de eerdere samenvatting alleen over wat nog relevant is en herhaal niets wat is afgehandeld. Gebruik uitsluitend wat de spelers in de berichten konden lezen: nooit DM-geheimen, dmNotes of canon die nog niet in het spel naar voren kwam. Verzin niets.
3. Schrijf de tekst naar een tijdelijk bestand (in de scratchpad of tmp-map, niet in de repo) en sla op met: node dnd/tools/claude-dm.js summary <cid> <totRonde> <bestand> (het exacte commando staat onder OPSLAAN in de uitvoer).
4. Meld per verhaal in één regel welke rondes zijn samengevat. Commit niets: de samenvattingen staan alleen in de database.
```
