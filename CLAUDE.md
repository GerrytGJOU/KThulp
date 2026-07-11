# KThulp — afspraken voor Claude

## Algemeen
- Alle leerling-gerichte tekst en alle communicatie: in het Nederlands.
- Apps zijn offline-first, één enkel HTML-bestand (HTML/CSS/JS), geen frameworks.
  Externe CDN's alleen waar nodig: Tone.js, SheetJS, Firebase, Gemini.
- Latijn- en Grieks-apps zijn parallelle paren: pas je iets aan in de één,
  stel dezelfde wijziging voor in de ander.
  Uitzondering: certamen/ bedient Latijn én Grieks al binnen één en dezelfde
  codebase (geen aparte Latijn-/Grieks-versie) — daar is dus geen "andere app"
  om de wijziging in te dupliceren.

## Conventies
- Naamval-volgorde altijd: nominativus, genitivus, dativus, accusativus,
  (ablativus), vocativus.
- Footer van elke app: "[Appnaam] · © Gerben de Jong · [jaar]".
  Footer van portalen: "[Portaalnaam] · © Gerben de Jong · [jaar]".
  Gebruik altijd het ©-teken (of `&copy;` als het bestand al `&middot;`-entities
  gebruikt in plaats van het letterlijke "·" teken — volg de stijl die in dat
  bestand al gangbaar is). Controleer bij een nieuwe app of aanpassing altijd
  dat deze regel er staat; ontbreekt hij, voeg 'm toe.
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
- De canonieke, actuele Realtime Database-regels staan in `certamen/database.rules.json`
  (het enige Firebase-project is `kthulp-certamen`, gebruikt door certamen/).
  Dit bestand MOET altijd gelijk zijn aan wat er live staat in Firebase Console
  → Build → Realtime Database → tabblad "Regels". Na elke wijziging in de
  Console: het bestand hier bijwerken (en omgekeerd, na elke wijziging hier:
  de nieuwe inhoud plakken en publiceren in de Console — dit repo deployt niet
  automatisch naar Firebase).
- Bij elke wijziging aan Firebase-rules: geef altijd het volledige nieuwe
  regelsbestand (oude + nieuwe regels samen), zodat het in één keer te
  kopiëren is. Nooit alleen het toegevoegde fragment losstaand tonen.
- Leerlingen loggen in Certamen/Battle Mode NOOIT in via Firebase Auth — alleen
  docenten (e-mail/wachtwoord, tak `teachers/{uid}`). Leerlingdata onder
  `identities/{klas}/{lid}` is dus per ontwerp benaderbaar zonder auth (de
  klascode+leerlingcode werkt als gedeeld toegangswoord); rules kunnen dat
  gegeven niet wegnemen zonder de inlogflow zelf te veranderen. Houd hier
  rekening mee bij elke wijziging aan rules of aan de klascode/identity-flow.
- Per-docent scheiding is inmiddels opgelost (commit `fc16c55`,
  2026-07-06 — de twee punten hierboven uit het gesprek van 2026-07-04
  zijn dus niet meer open): `klascodes/{code}` heeft nu een `ownerUid`
  (`certamen/database.rules.json`), en `identities/{klas}.read` +
  `klascodes/{code}.write` zijn rules-gescoped op die eigenaar (met een
  legacy-uitzondering voor codes van vóór deze wijziging). `createKlascode`
  (`certamen/net.js`) is een transactie geworden i.p.v. een blinde `set()`.
  Kleine, niet-urgente restpunt: `FBNet.getKlascodes()`/
  `getKlascodeCounts()` (`certamen/net.js`) lezen nog steeds de volledige
  `identities`-tak per aanroep (nu veilig — de rules leveren alleen nog de
  eigen klassen terug — maar bij veel docenten/klassen nodeloos veel data
  over de lijn); een lichte index zoals `usedKlascodes/{klas}: true` zou dat
  bandbreedte-technisch verbeteren, is alleen nooit gebouwd.
