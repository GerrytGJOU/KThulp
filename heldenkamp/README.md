# Heldenkamp — Nederlandse variant van Castra Heroum

Doeltaal Nederlands, hulptaal Engels. Dezelfde spelcode als `certamen/castra*.js`;
alleen de tekst wordt bij het bouwen vervangen. Niets in `certamen/` hoeft aangepast.

## Werkwijze
- `node extract.js [deel-van-bestandsnaam]` — schrijft `todo.json` met alle tekstfragmenten zonder vertaling.
- `nl.json` — de catalogus. Sleutel = origineel fragment (exacte tekst, zonder omringende spaties),
  waarde = vertaling. `"bestand.js::tekst"` geldt alleen in dat bestand en wint van `"tekst"`.
  Markup in een fragment (`<small>`, `<b>`) moet in de vertaling behouden blijven.
  Een fragment dat ook als logica wordt gebruikt (bv. `"Escape"`) nooit vertalen.
- `node build.js` — bouwt `dist/`; fragmenten zonder vertaling blijven origineel (het spel werkt altijd).
- Voorbeeld lokaal bekijken: preview `heldenkamp` in `.claude/launch.json`, daarna `/certamen/index.html`.

## Nieuwe tekst in Castra
Na een wijziging in `certamen/castra*.js` draait `node extract.js`; wat nog open staat krijgt in een
volgende ronde een vertaling in `nl.json`.

## Publiceren
`.github/workflows/heldenkamp.yml` bouwt bij elke push en zet het resultaat in het repo
`GerrytGJOU/Heldenkamp` (Pages: *Deploy from a branch*, branch `main`, map `/`).
Geheim `HELDENKAMP_TOKEN` (fine-grained token, alleen *Contents: write* op Heldenkamp) is nodig.

## Paren Latijn/Nederlands (automatisch)
Waar de code `{la:"Latijnse zin.", nl:"Nederlandse vertaling."}` of `_K/_W/_T(["Latijn.","Nederlands."])` gebruikt
(Latijn eindigt op leesteken), wordt het Latijn vervangen door de Nederlandse tekst en het Nederlands door de
Engelse hulptekst. Die Engelse tekst staat in `nl.json` onder de sleutel `"en::<nederlandse zin>"`
(`vertalingen/*.json` + `node merge.js _batch.json <bestand> "en::"` voegt een rijtje toe). Namen en losse woorden
(zonder leesteken) vertaal je met een gewone sleutel.

## Stand (2026-11-05)
Gebouwd: extractie, bouw, workflow, paarregel. Vertaald: alle Latijn/Nederlands-paren (ook naam+uitleg-paren met korte uitleg, `{la|nm, nl}`) met Engelse hulptekst
(helden, quests, NPC's, uitleg in het kamp, jacht, proelium: ~1000 fragmenten). Nog open (`node extract.js`): ~3900 losse
fragmenten, o.a. castra-heroevo-all.js, castra-latin.js, castra-regions.js, castra-troops.js, castra-data.js.
Nog niet gedaan: herontwerp Latijn-leerdeel (castra-latin.js: vertaalhulp, "Vertaal Latijnse zinnen"-opdrachten,
naamvallen), Engelse aan/uit-schakelaar, portaalknop/Firebase/online onderdelen weglaten.

## Nederlandse woordhulp (stap 1 van LEERDEEL_ONTWERP.md)
`overlay/heldenkamp-nl.js` (sjabloon) + `overlay/woordenboek*.json` (Nederlands -> Engels) worden bij het bouwen
tot `dist/certamen/heldenkamp-nl.js` en na het laatste castra-script in `index.html` geladen. Het vervangt
`castraNorm`, `castraTapWord` en leegt het Latijnse `CASTRA_GLOSS`. Nieuwe tikbare woorden: `node woorden.js`
(schrijft `woorden-open.json` met woorden zonder glos) en voeg ze toe aan een nieuw `overlay/woordenboek-N.json`.

## Zelfstandig spel (direct in Castra)
`overlay/heldenkamp-nl.js` (sectie "Zelfstandig spel") en `build.js` zorgen dat Heldenkamp zonder Certamen werkt:
- `go("home")` leidt naar Castra; eerste keer eerst `SCREENS.hkStart` (naam) en de avatar-editor.
- Lokale speler (`BM_IDENT` zonder klascode): Castra synchroniseert dan nooit; `initFirebase` is uitgezet.
- Avatar-uitrusting wordt vrijgespeeld met het Castra-niveau (`castraPLevel()`): niveau L → 2L, munten C → C/40+3,
  beheersing 14, prestige 25, Chronica-finale 22, eerbewijzen 20. Menu: ☰ → "Uiterlijk".
- Opslag krijgt het voorvoegsel `hk_` (Heldenkamp en de Latijnsite delen het domein github.io): shim in `index.html`.
- Portaalknop weg, "Afsluiten" weg, titel en footer "Heldenkamp · © Gerben de Jong · 2026".

## De/het-oefening
`overlay/dehet-a1.json` ([woord, "de"|"het"], ± 160 gewone A1-woorden) + sectie "Oefening De of het?" in
`overlay/heldenkamp-nl.js`: de Senator (Latium) biedt "Woorden" of "De of het?" aan; 5 vragen (2 het, 3 de), dagelijkse
beloning via de bestaande quiz-engine (`CASTRA_QUIZ_KIND.key = "quiz_dehet"`). Controleer bij nieuwe woorden zorgvuldig
het lidwoord. Ook uitgezet: Certamen-profiel-XP bij quizzen (`castraMasterXp`) en de Schola.
