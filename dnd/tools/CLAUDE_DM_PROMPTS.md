# Prompts voor Claude Code als DM (campagnestart en grote momenten)

Geen geheimen in dit bestand. Plak een prompt in een **nieuw Claude Code-gesprek** (werkmap: de KThulp-repo). De sessie-eigenaar is zelf speler: daarom laat elke prompt de beurt door de subagent `dnd-dm` spelen, zodat geen DM-geheimen in het gesprek komen. Zie ook `dnd/tools/CLAUDE_DM.md`.

## Hoe grote momenten werken
- Gemini speelt de gewone scènes. Zet Gemini `nextTurn.handoff` (zijn eigen keuze bij het afsluiten van een locatie, reizen naar een nieuwe, een finale, een Act-overgang, een belangrijke onthulling, een ontmoeting met een Tolkien-hoofdfiguur of een groot gevecht), of detecteert de wereldcontrole een groot moment (reis, Act-quest, diepste laag van een NPC, wisseling van een companion, dood van een belangrijke NPC), dan krijgt de volgende beurt de status "claude" en staat er in de app "Groot moment: ...".
- Wanneer alle wachtende spelers hebben ingediend, wacht de beurt op Claude Code (`node dnd/tools/claude-dm.js status` toont "WACHT OP CLAUDE"). Is er geen Claude-sessie, dan kunnen de spelers in de app met "Laat Gemini deze beurt toch spelen" doorgaan.
- Claude speelt de beurt rijker en langer dan gewoonlijk, zet daarna `nextTurn.handoff` op `null` (terug naar Gemini), tenzij het grote moment meerdere beurten beslaat.

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
- Datum 24 oktober 3018, Rivendell. Beide PC's zijn er; begin met een thematisch sterke, sfeervolle scène (200-300 woorden toegestaan) met de wereld, het huis van Elrond, het weer en een eerste ontmoeting of gebeurtenis die de Act I-lijn (twee tegenstrijdige berichten) voorbereidt zonder die te verklappen.
- Houd je aan de proloog-agenda: de acht kandidaat-companions worden in de loop van de proloog voorgesteld (minstens drie afzonderlijke gelegenheden); in de opening hooguit één of twee, nooit in een rij.
- Gebruik worldDelta voor wat de scène vastlegt (npcs introduced:true bij een echte ontmoeting, tijd, regio); gebruik de vrije ID's uit de wereldstatus; verzin geen NPC die al bestaat. Schrijf nooit wat een PC denkt of doet; speel geen PC.
- Zet geheimen alleen in dmNotes. Geef beide spelers een duidelijke, open aanleiding (nextTurn.awaiting = beide), nextTurn.handoff op null.
- Pas toe met node dnd/tools/claude-dm.js apply <cid> <bestand>.
Je eindbericht aan mij: alleen "Opening gespeeld voor verhaal <cid>" plus eventuele technische problemen, zonder inhoud.

STAP 4: sluit af met: wat ik nu in de app moet doen (het verhaal openen en spelen) en dat Gemini vanaf de volgende beurt overneemt; grote momenten worden aan Claude Code overgedragen (zie dnd/tools/CLAUDE_DM_PROMPTS.md).
```

## Prompt 2: grote momenten spelen (per wachtende beurt)

```
Controleer met node dnd/tools/claude-dm.js status of een verhaal "WACHT OP CLAUDE" staat. Zo ja: laat de subagent dnd-dm die beurt spelen (jij leest geen canon of notities in dit gesprek). Het is een groot moment (reden staat onder "# OVERDRACHT" in de context): bijvoorbeeld het afsluiten van een locatie en reizen naar een nieuwe, een finale of een belangrijke onthulling. Eisen aan de beurt: gebruik alle canon, de wereldstatus (agenda's, verhaallagen, "Recent buiten beeld", companions) en de recente geschiedenis; maak de overgang of scène rijk en thematisch (150-350 woorden toegestaan); verwerk de gevolgen in worldDelta (tijd, regio met reistijd, quests, reveals alleen als de wereldstatus "KAN NU ONTHULD WORDEN" zegt); zet geheimen alleen in dmNotes; zet nextTurn.handoff op null zodat Gemini weer overneemt, tenzij dit grote moment meerdere beurten duurt. Je eindbericht aan mij: één regel "Beurt gespeeld: ronde N, aan zet: <naam>."
```
