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

## Stand (2026-11-05)
Proef: `castra-menu.js` voor een deel vertaald (32 van 84 fragmenten). Nog niet gedaan: de overige
bestanden, het herontwerp van het Latijn-leerdeel (`castra-latin.js`), de Engelse aan/uit-schakelaar,
en het weglaten van portaalknop, Firebase en de online onderdelen (Colosseum, Legio) in de variant.
