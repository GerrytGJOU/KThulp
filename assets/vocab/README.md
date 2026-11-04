# Gedeelde woordenlijsten (KTVocab)

Sinds 2026-11-04 staat de frequentielijst (±1000 woorden per taal, Pallas/Minerva)
op één plek. Voorheen had elke app zijn eigen kopie.

| Bestand | Inhoud |
|---|---|
| `vocab-core.js` | `KTVocab`: weergaven per app + uitleg van het formaat |
| `vocab-la.js` | `KTVocab.data.la` — Latijnse lijst |
| `vocab-el.js` | `KTVocab.data.el` — Griekse lijst |

| Weergave | Gebruikt door |
|---|---|
| `KTVocab.ludus()` / `.agora()` | `latijn/ludus`, `grieks/agora` |
| `KTVocab.verbaLA()` / `.verbaEL()` | `latijn/verba`, `grieks/verba` |
| `KTVocab.certamenLA()` / `.certamenEL()` | `certamen/vocab.js` (`VOCAB_LA`, `VOCAB_EL`) |

Elke weergave levert exact de vorm die de app al had (bij de migratie is per
lijst gecontroleerd dat de uitvoer identiek was aan de oude kopie).

## Een woord toevoegen of corrigeren
Pas de rij aan in `vocab-la.js` of `vocab-el.js`. Een rij heeft de kernvelden van
Ludus/Agora; Certamen en Verba leiden daar hun eigen velden uit af.

## Uitzonderingen (`c`, `v`, `s`)
Waar een app bewust of per ongeluk iets anders had, staat dat als uitzondering
op de rij (zie de kop van `vocab-core.js`):
- `c` / `v`: andere vertaling of lemma voor Certamen resp. Verba, of (array) een
  gesplitst lemma zoals `ut (+ind.)` / `ut (+conj.) fin.`.
- `s`: rij komt alleen in bepaalde weergaven voor (Grieks ὑγιής: alleen Certamen en Verba).

**Alle apps dezelfde vertaling geven = de `c`/`v`-uitzondering verwijderen.**
Ruim 150 Latijnse en ruim 900 Griekse rijen hebben nu zo'n uitzondering
(vooral kortere vertalingen voor de meerkeuzevragen van Certamen).

## Nieuwe app met woordenlijst
```html
<script src="../../assets/vocab/vocab-core.js?v=…"></script>
<script src="../../assets/vocab/vocab-la.js?v=…"></script>
```
en dan `KTVocab.ludus()` (of een andere weergave; ontbreekt die, voeg er één toe
in `vocab-core.js`). Verhoog bij elke wijziging aan deze bestanden de `?v=`-
cachebuster in alle pagina's die ze laden (`grep -rn "assets/vocab" --include=index.html`).

## Let op
- De oude `certamen/vocab.js` werd gegenereerd uit externe Excel-bronnen. Een
  nieuwe Excel-run schrijft niet meer naar de apps; werk de data hier bij.
- Typefouten in de oude Verba-kopie ("magistatus", "aufere", "ante") zijn bij de
  migratie hersteld naar "magistratus", "aufero", "antea".
