# KThulp — afspraken voor Claude

## Algemeen
- Alle leerling-gerichte tekst en alle communicatie: in het Nederlands.
- Apps zijn offline-first, één enkel HTML-bestand (HTML/CSS/JS), geen frameworks.
  Externe CDN's alleen waar nodig: Tone.js, SheetJS, Firebase, Gemini.
- Latijn- en Grieks-apps zijn parallelle paren: pas je iets aan in de één,
  stel dezelfde wijziging voor in de ander.

## Conventies
- Naamval-volgorde altijd: nominativus, genitivus, dativus, accusativus,
  (ablativus), vocativus.
- Footer van elke app: "© Gerben de Jong · [jaar]".
  Footer van portalen: "[Portaalnaam] · Gerben de Jong · [jaar]".
- Elke app (geen portaal) krijgt linksboven een "Terug naar portaal"-knop:
  `<a class="portal-back" href="../" aria-label="Terug naar portaal">` met
  pijl-SVG, position:fixed top-left, z-index 9999. Zie frequentie/ of certamen/
  voor de exacte markup en CSS.
- iPad-veilig: zichtbare <label>-bestandskiezers (nooit display:none + .click()),
  viewport met maximum-scale.
- Na elke wijziging aan een scriptblok: `node --check` draaien voordat je oplevert.
- Gemini-aanroepen altijd met thinkingBudget:0.
- In de Battle Mode avatar-editor staan opties altijd gesorteerd: altijd-vrije opties eerst, daarna oplopend op vereist niveau.
- Battle Mode heeft een ingebouwde Handleiding/FAQ (`SCREENS.battleFAQ` in
  certamen/battle.js). De klassen-, combo- en synergiesecties zijn data-gedreven
  (uit BM_CLASSES/BM_COMBOS/BM_SYNERGY) en lopen vanzelf mee; de prozasecties
  (spelverloop, BE, heldenmodus, profiel, docent-instellingen) niet. Werk bij
  elke Battle Mode-wijziging die de spelregels, klassen of features raakt ook
  deze FAQ bij.

## Stijl
- Donkere steen-achtergrond, goud; oxblood-accent voor Latijn,
  Aegeïsch blauw voor Grieks. Palatino in apps.

## Hosting
- GitHub Pages: https://GerrytGJOU.github.io/KThulp/

## Firebase-rules
- Bij elke wijziging aan Firebase-rules (bv. `firestore.rules`, `database.rules.json`):
  geef altijd het volledige nieuwe regelsbestand (oude + nieuwe regels samen),
  zodat het in één keer te kopiëren is. Nooit alleen het toegevoegde fragment
  losstaand tonen.
