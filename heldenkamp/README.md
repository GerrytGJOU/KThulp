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
Gebouwd: extractie, bouw, workflow, paarregel. Vertaald: alle Latijn/Nederlands-paren met Engelse hulptekst
(helden, quests, NPC's, uitleg in het kamp, jacht, proelium: ~1000 fragmenten). Nog open (`node extract.js`): ~4200 losse
fragmenten, o.a. castra-heroevo-all.js, castra-latin.js, castra-regions.js, castra-troops.js, castra-data.js.
Nog niet gedaan: herontwerp Latijn-leerdeel (castra-latin.js: vertaalhulp, "Vertaal Latijnse zinnen"-opdrachten,
naamvallen), Engelse aan/uit-schakelaar, portaalknop/Firebase/online onderdelen weglaten.
