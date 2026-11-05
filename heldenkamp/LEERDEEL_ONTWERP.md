# Heldenkamp — ontwerp van het Nederlandse leerdeel

Status: voorstel (2026-11-05), nog niets gebouwd. Vervangt in Heldenkamp het Latijn-leerdeel
(`certamen/castra-latin.js` en de quizzen). Doeltaal Nederlands, hulptaal Engels.

## 1. Uitgangspunt: de motor bestaat al
Castra leert Latijn via één mechaniek, en dat is taalonafhankelijk:

| Onderdeel | Nu (Latijn) | In Heldenkamp |
|---|---|---|
| Alle speltekst | Latijn | Nederlands (al gedaan via de paarregel) |
| Tik op een woord | betekenis in het Nederlands (`CASTRA_GLOSS`) | betekenis in het Engels |
| Tik op ⓘ | vertaling van de hele zin | Engelse vertaling (staat al klaar: de `nl`-helft van elk paar) |
| Begrijpvragen na een gesprek | `q:{la,nl,opts}` | idem: leesbegrip op A2-niveau (al vertaald) |
| Gebruikslog `CASTRA.help` | welke woorden/zinnen je opzocht | idem |

Er is dus geen nieuwe engine nodig; er zijn vier concrete aanpassingen en één nieuwe dataset.

## 2. Wat er gebouwd moet worden

### A. Tikbare woorden voor het Nederlands (klein)
- `castraNorm()` (`castra-latin.js:328`) houdt alleen Latijnse letters over. Voor Nederlands: kleine letters,
  accenten/trema (ë, ï), apostrof en koppelteken behouden.
- `CASTRA_GLOSS` (nu ~800 Latijnse woorden → Nederlands; aangevuld via `Object.assign(CASTRA_GLOSS, …)` in o.a. `castra-roma.js` en `castra-train.js`) wordt een Nederlands → Engels woordenboek,
  `CASTRA_GLOSS_NL` in een eigen bestand. Het bestand wordt als vervangend bestand in de build gezet
  (zoals de catalogus), de bron blijft onaangeroerd.
- Het woordenboek is te maken: in de gebouwde tekst staan ongeveer 2500 verschillende Nederlandse woordvormen.
  Ongeveer 1450 komen maar één keer voor. Ik schrijf de glossen in vier of vijf blokken; samen ± 40 kB.
- Verbuiging: bij Nederlands is dat veel eenvoudiger dan Latijn (alleen meervoud/verkleinwoord/werkwoordsvorm),
  dus een vorm per regel volstaat. De Latijnse uitleg als "(4e naamval)" verdwijnt.

### B. De twee quizzen (middelgroot)
- **Woordenquiz** (Senator in Latium, `castra-latium.js`, nu "Ken jij Latijnse woorden?"): Nederlands woord →
  kies de Engelse betekenis uit drie. Bron: een nieuwe Nederlandse frequentielijst (zie C), niet de Latijnse lijst
  van Certamen (`cxQuizExtras`).
- **Zinnenquiz** (Consul/quizmaster in `castra-roma.js` en `castra-regions.js`, nu "Vertaal Latijnse zinnen"):
  Nederlandse zin → kies de juiste Engelse vertaling. Bron: dezelfde zinnenlijst (`la`/`nl`-paren), dus er is geen
  nieuwe schrijfklus; de verkeerde antwoorden komen uit andere zinnen.
- Beloning en dagelijkse limiet blijven zoals ze zijn.

### C. Nederlandse woordenlijst (nieuw, het grootste stuk)
- Nieuw bestand `assets/vocab/vocab-nl.js` naar het patroon van `vocab-la.js`/`vocab-el.js` (zie README daar):
  ± 1000 woorden met Engelse betekenis, gerangschikt op frequentie en niveau (A1 → B1).
- Eerste uitwerking: de woorden die in het spel al voorkomen (bouwen, jagen, vechten, familie, plaatsen) + de
  hoogfrequente basiswoorden eromheen. Daarna bruikbaar voor de woordenquiz en als herhaallijst (zie E).
- Let op: `vocab-*.js` wordt nu door Ludus/Agora/Verba/Certamen gedeeld; de Nederlandse lijst wordt alleen door
  Heldenkamp geladen, dus de bestaande `?v=`-cachebusters blijven ongemoeid.

### D. Nederlandse oefenvormen in plaats van naamvallen (optioneel, per stuk te kiezen)
De Latijnse grammatica (naamvallen, verbuigingen) komt in Castra alleen voor als bijschrift bij woordglossen
("zinnen (4e naamval)", gecontroleerd in `castra-roma.js`/`castra-train.js`); een aparte naamvallenoefening zit er niet in. Voor Nederlands zijn deze oefenvormen logisch,
gebouwd als nieuwe NPC-quiz of als variant van de zinnenquiz:
1. **de of het?** lidwoord kiezen bij een zelfstandig naamwoord (A1-A2; de lastigste en meest nuttige).
2. **Werkwoordsvorm invullen** (ik loop / hij loopt / wij lopen; verleden tijd vanaf A2).
3. **Woordvolgorde** een zin in de juiste volgorde zetten (bijzin, inversie; A2-B1).
4. **Zinnen aanvullen** met een voorzetsel (in/op/bij/naar), past bij de jacht-terreinen ("in het bos", "op de weg").
Voorstel: begin met 1 en 4 (kleinste omvang), 2 en 3 later.

### E. Persoonlijke herhaallijst (nieuw, past bij "immersive")
`CASTRA.help.words` houdt al bij welke woorden de speler opzocht. In Heldenkamp wordt dat zijn eigen herhaallijst:
- menu "Woordenboek": woorden die je opzocht, met Engelse betekenis en aantal keer;
- dagelijkse mini-quiz uit je eigen opgezochte woorden (de beste herhaling, want het zijn zijn eigen hiaten);
- geen docentoverzicht nodig, dus `castraHelpSync` (Firebase) vervalt in de variant.

### F. Engelse hulp aan/uit (klein tot middelgroot)
- Instelling "Engelse hulp: altijd / alleen bij tikken / uit". "Alleen bij tikken" is de standaard en werkt al:
  woordglos en ⓘ zijn op verzoek.
- De vaste Engelse ondertitels in menu's en paneeltjes (`<small>…</small>`) worden bij het bouwen in een
  `<span class="hk-en">` gezet, zodat één CSS-regel ze kan verbergen. Dat moet per bestand getest worden, omdat niet elke
  Engelse tekst als HTML wordt weergegeven (sommige komen in `title=`-attributen).

## 3. Niveauopbouw (aanbevolen, voor je vriend)
Het spel heeft regio's met oplopende moeilijkheid. Voorstel voor de leeropbouw, zonder de spelregels te raken:

| Regio/niveau | Taalniveau | Nadruk |
|---|---|---|
| Latium (start) | A1 | tegenwoordige tijd, korte zinnen, de/het, voorzetsels van plaats |
| Graecia, Troia | A1-A2 | verleden tijd, ontkenning, vragen, familie en werk |
| Gallia, Aegyptus | A2 | bijzinnen met omdat/als, bezittelijk, vergelijkingen |
| Persia en verder | A2-B1 | woordvolgorde, verleden voltooid, lange verhalen |

De bestaande verhaal- en gesprekstekst (`la`/`nl`-paren) is al eenvoudig; er hoeft niets herschreven te worden,
alleen een niveau-label per regio voor de quizzen.

## 4. Wat verdwijnt of wordt aangepast in Heldenkamp
- `castra-latin.js`: Latijns glossarium, `castraNorm`, `CASTRA_TYPE_LA` (Latijnse typenamen), `(4e naamval)`-glossen.
- `cxQuizExtras` (Certamen-woordenlijst voor de quiz), `cxLatin…`-koppelingen en klascodelijsten.
- `castraHelpSync` / `classAnalyticsCastra` (Firebase, alleen voor docenten van Gerben).
- Alle verwijzingen naar "Latijn leren" in de FAQ en tutorial (de sessie "overige bestanden" past dat al aan).

## 5. Volgorde en omvang
| Stap | Wat | Omvang |
|---|---|---|
| 1 | Tikbare Nederlandse woorden (A) + woordenboek-blok 1 (±800 meest voorkomende woorden) | ½ dag |
| 2 | Zinnenquiz (B2) op de bestaande paren | ½ dag |
| 3 | Woordenlijst `vocab-nl.js` (C) + woordenquiz (B1) | 1 dag |
| 4 | Rest van het woordenboek (A) | ½ dag |
| 5 | Herhaallijst (E) | ½ dag |
| 6 | Oefenvormen de/het + voorzetsel (D1, D4) | 1 dag |
| 7 | Engelse hulp aan/uit (F) | ½ dag |
| 8 | Oefenvormen werkwoord + woordvolgorde (D2, D3) | 1 dag |

Elke stap is los te testen en mag al online (Heldenkamp werkt altijd, ook half-af).

## 6. Beslissingen die ik van Gerben nodig heb
1. Welk startniveau heeft je vriend (A0/A1/A2)? Dat bepaalt de eerste woordenlijst en de standaardhulp.
2. Wil hij de Engelse hulp standaard uit, alleen op tik, of altijd zichtbaar?
3. Welke oefenvormen uit D wil je (de/het is mijn advies als eerste)?
4. Eenheidsnamen (Tiro, Hastatus …): Latijn laten (sfeer) of Nederlandse namen? (raakt de zoek-sleutels in de code,
   dus een aparte, voorzichtige ingreep).
5. Mag ik de woordenlijst zelf opstellen (frequentie-/niveaugebaseerd uit mijn eigen kennis), of heb je een
   voorkeursbron (bijv. een bestaande A1-B1-lijst)?
