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

## Andere opdrachten
- `summary <cid> <totRonde> <bestand>`: bewaar een samenvatting (maak er een na ongeveer 15 rondes).
- `canon-put <cid> <id> "<titel>" <bestand> [--opening] [--keywords=a,b]`: canon-document toevoegen of vervangen.
- `memory-add <cid> "<tekst>"`: een Herinnering toevoegen (bindend voor de DM).

## Regels voor de sessie
- Schrijf nooit direct in de database behalve via dit script. Bij een eigen firebase-opdracht: altijd padsleutels gebruiken (`"campaigns/x/y"`), nooit een geneste top-level container, en eerst een backup maken (`firebase database:get /dnd`).
- Speel nooit een PC. Spelers rollen zelf; NPC-worpen komen uit de meegegeven voorgegooide dobbelstenen.
- Zet geheimen alleen in `dmNotes`, nooit in de Stand, het logboek of de vertelling vooruit.
- Houd de vertelling kort (80 tot 180 woorden), één ontwikkeling per beurt, stop op een reactiemoment.
- Geen spoilers in het gesprek zelf: beperk wat je in je chattekst zegt tot "beurt gespeeld" en de publieke vertelling.
