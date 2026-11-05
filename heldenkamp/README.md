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

## Woordenboek / herhaallijst
Menu ☰ → "Woordenboek" (sectie "Woordenboek (herhaallijst)" in `overlay/heldenkamp-nl.js`): lijst van de woorden die je
opzocht (`CASTRA.help.words`, zonder functiewoordjes) met Engelse betekenis en aantal keer, plus mini-quiz "Oefen mijn
woorden" (5 vragen, zwaarste/vaakst opgezochte woorden eerst; geleerd na 3 keer goed achter elkaar, `CASTRA.hkRev`; XP eenmaal per dag).

## Engelse hulp aan/uit
Menu ☰ → Instellingen → "Engelse hulp": altijd / alleen bij tikken / uit (opgeslagen als `localStorage "english"`, dus `hk_english`).
De build verzamelt alle Engelse hulpteksten (`enSet` in `build.js`, ± 1800) in `heldenkamp-nl.js`; een MutationObserver zet elke losse
Engelse tekst in `<span class="hk-en">`, CSS verbergt die in "tap" en "off". Uitgesloten: gesprekken (`.cl-s`), quizzen
(`#cwPanel`) en alles met `data-hk-keep` (woordenboek, instellingen). In "off" werken ook woord-tikken en de ⓘ-knop niet.
Beperking: alleen Engelse tekst die als eigen tekstknoop in de HTML staat en exact in `enSet` zit wordt herkend; wil je een
nieuwe plek erbij, zet de Engelse tekst in een catalogus-sleutel met `en::` of voeg hem toe aan de lijst in `heldenkamp-nl.js`.

## Voorzetsel-oefening
`overlay/voorzetsel-a1.json` ([zin met ___, juist, [fout, fout], Engelse vertaling], 44 zinnen, in elke zin past precies één van
de drie opties) + sectie "Oefening Voorzetsels" in `overlay/heldenkamp-nl.js`. Bij de Senator (nu 4 keuzes), 5 vragen,
na elk antwoord de volledige zin met Engelse vertaling, aan het eind een tip over vaste werkwoord+voorzetsel-combinaties,
dagelijkse beloning via `CASTRA_QUIZ_KIND.key = "quiz_vz"`. Nieuwe zinnen: zorg dat de afleiders echt fout zijn.

## Niveaus A1 / A2 / B1 (oplopende moeilijkheid)
Doel van de vriend: verblijfsvergunning/naturalisatie → streven B1 (IND-examen nu meestal A2; zie geheugen/LEERDEEL_ONTWERP.md).
- Oefeninhoud per niveau: `overlay/woordquiz-a1|a2|b1.json`, `dehet-…`, `voorzetsel-…` (de build maakt er `{A1,A2,B1}` van). Nieuw niveau of
  nieuwe lijst: voeg een bestand toe met dezelfde naamvorm.
- Het huidige niveau (`localStorage "nlLevel"`, dus `hk_nlLevel`) telt dubbel in een oefening, het niveau eronder één keer (herhaling).
- Niveautest bij de start (12 vragen uit `overlay/niveautest.json`, 4 per niveau; startniveau = eerste niveau met < 3 goed, max B1);
  overslaan = A1. Opnieuw doen: ☰ → Instellingen → Niveau.
- Automatisch omhoog: gemiddeld ≥ 85% over de laatste 5 rondes op het huidige niveau (`hk_nlStats`). Handmatig wisselen kan altijd.
- Nog te bouwen voor B1: werkwoordsvormen (nu/verleden/voltooid), woordvolgorde, omdat/want/dat-zinnen, leesteksten, luisteren,
  schrijven, KNM-onderwerpen en moeilijkere gesprekken per regio.

## Werkwoorden-oefening
`overlay/werkwoord-a1|a2|b1.json` ([zin met ___, juist, [fout, fout], Engels, regel NL, regel EN]; 30 + 30 + 22 zinnen) + sectie
"Oefening Werkwoorden" in `overlay/heldenkamp-nl.js`. A1 tegenwoordige tijd (stam/stam+t/infinitief, hebben/zijn/willen), A2 verleden
tijd, voltooid (hebben/zijn), scheidbare werkwoorden en modale werkwoorden, B1 bijzin met werkwoord achteraan, passief, voorwaardelijk
en irregulier voltooid deelwoord. Bij elk antwoord staat de volledige zin, de Engelse vertaling en de regel. Telt mee voor het doorstromen.

## Leeshoek (leesteksten)
Menu ☰ → "Leeshoek": `overlay/lezen-a1|a2|b1.json` ({id, t, s:[[zin, Engels]...], q:[{q, qen, o:[3], a:0}]}; 4 + 4 + 5 teksten) + sectie
"Leeshoek" in `overlay/heldenkamp-nl.js`. Elke zin is aantikbaar (woorden) met ⓘ voor de vertaling; drie begripsvragen (opties worden
geschud; juist antwoord staat altijd op index 0 in het bestand); XP eenmaal per dag per tekst bij ≥ 2 goed; telt mee voor het
doorstromen. Nieuwe tekst: voeg toe aan het bestand en draai `node woorden.js`; voeg ontbrekende woorden toe aan een nieuw
`overlay/woordenboek-N.json`. De B1-teksten zijn verzonnen voorbeelden (brief gemeente, vacature, zorgverzekering, advertentie, krant);
feiten daarin zijn illustratief en niet als officiële regel bedoeld.

## Luisterhoek
Menu ☰ → "Luisterhoek": `overlay/luisteren-a1|a2|b1.json` (zelfde vorm als de leesteksten; 4 + 4 + 4 teksten) + sectie "Luisterhoek" in
`overlay/heldenkamp-nl.js`. Het apparaat leest de zinnen voor met de Web Speech API (`speechSynthesis`, een Nederlandse stem:
`nl-NL`, anders elke `nl*`); knoppen Luister / Langzaam / Stop. Heeft het apparaat geen Nederlandse stem, dan valt de oefening terug
op "Toon de tekst" (leesoefening, geen XP). Wie de tekst toont krijgt geen XP. Na afloop staat de tekst er tikbaar onder.
Let op: de stemkwaliteit hangt van het apparaat af; ik kon de klank zelf niet beoordelen (testtoestel had alleen en-GB).
