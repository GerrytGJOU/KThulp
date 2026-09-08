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

## Modus-documentatie (certamen/)
De vier grote spelmodi binnen `certamen/` hebben elk een eigen masterplan in de
repo-root. Dat masterplan is telkens de **enige bron van waarheid** voor die
modus en vervangt eerdere schetsen/`.docx`-bestanden. Raadpleeg het bijbehorende
document vóór je aan een modus werkt, en werk het bij na elke wijziging die de
spelregels, features of het datamodel raakt:
- `BATTLE_MODE.md` — klas-vs-klas woordkennis-arena (twee teams, Battle Energy).
- `BOSS_BATTLE.md` — coöperatief PvE: de hele klas tegen één mythologische baas.
- `TOTAL_WAR.md` — doorlopende veldtocht: elke klas is een beschaving en
  verovert samen de kaart van Europa.
- `Chronica.md` — Single Player Mode "Chronica Classica": narratieve,
  offline-first RPG (proloog t/m Hoofdstuk 16 speelbaar, Hoofdstuk 17
  gebouwd maar nog niet gekoppeld; campagne-metadata loopt door tot
  Hoofdstuk 29 + Finale — zie de hoofdstuktabel in Chronica.md §0 voor de
  actuele stand, dit getal wijzigt regelmatig). Gebruikt Battle Mode's
  klasse-, avatar- en profielsysteem; klassekeuze en eretitels werken door
  in de andere modi.

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
  de nieuwe inhoud plakken en publiceren in de Console, of via
  `firebase deploy --only database --project kthulp-certamen` met de Firebase
  CLI — `.firebaserc`/`firebase.json` in de repo-root wijzen al naar dit
  bestand, sinds 2026-09-08. Dit repo deployt nog steeds niet automatisch
  (geen CI-hook); publiceren is en blijft een bewuste, losse actie).
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
  Restpunt inmiddels opgelost: `FBNet.getKlascodes()`/`getKlascodeCounts()`
  (`certamen/net.js`) lezen niet langer de volledige `identities`-tak, maar
  een lichte index `usedKlascodes/{klas}: <aantal>` (`certamen/
  database.rules.json` heeft er een eigen regelsblok voor gekregen). Eenmalig
  self-healing gevuld door `FBNet._ensureUsedKlascodesIndex()` (leest de oude
  volledige boom precies één keer ooit, via `usedKlascodes/_seeded`), daarna
  groeit de index vanzelf mee via een `.transaction()` in `bmIdentCreate()`
  (`certamen/battle.js`) bij elke nieuwe leerling.
- Rollensysteem docent/admin (sinds 2026-09-08): `admins/{uid}: true` wijst de
  globale beheerder(s) aan — geen selfservice-pad, de eerste admin (Gerben)
  wordt eenmalig handmatig in de Firebase Console gezet, daarna kan een admin
  via `teacherStatus/{uid}.status` (`"pending"`/`"approved"`/`"revoked"`)
  andere docenten goedkeuren/intrekken. Nieuwe docenten registreren zelf
  (`FBNet.signupTeacher`, `certamen/net.js`) en komen op `"pending"` te staan;
  ze kunnen dat veld zelf alleen aanmaken (nooit wijzigen) — alleen een admin
  mag de status daarna zetten. `klascodes/{code}.write` en `teachers/{uid}.write`
  eisen naast de bestaande ownerUid-check ook `status === "approved"` (of
  admin), met een legacy-uitzondering voor accounts van vóór dit systeem
  (geen `teacherStatus`-record maar wel al bestaande data) zodat die niet
  ineens worden buitengesloten. Admin krijgt via `teachers/{uid}.read` en de
  al wereld-leesbare `klascodes`-boom een overzicht (`SCREENS.adminOverview`,
  `certamen/games.js`) van wie docent is, hun klassen/leerlingaantallen
  (bestaande `usedKlascodes`-index) en eigen woordenlijsten — bewust alleen
  titels/aantallen, nooit leerlingnamen of woordinhoud. "Laatst actief" per
  klas komt uit het nieuwe `klascodeMeta/{code}/lastActive`
  (best-effort-stempel bij `bmIdentCreate`/`bmAwardBattle` in
  `certamen/battle.js`, zelfde losse-index-patroon als `usedKlascodes`).
  Sinds de site-brede inlog (`assets/site-auth.js`, zie hieronder) heeft dat
  bestand een eigen kopie van `signupTeacher`/`getTeacherStatus`/`isAdmin` die
  dezelfde `admins/`/`teacherStatus/`-paden gebruikt (net als `certamen/net.js`
  al zijn eigen kopie van de docent-login had vóór dit rollensysteem) — het
  hoofdmenu-widgetje en `profiel/index.html` tonen zo ook "wacht op
  goedkeuring"/"ingetrokken" voor docenten buiten Certamen. Werk bij een
  wijziging aan het rollensysteem **beide kopieën** bij.
- Site-brede inlog (`assets/site-auth.js`, sinds commit `727b2b5`,
  2026-09-08): één gedeeld script, met `<script src="…/assets/site-auth.js">`
  in élke Latijn/Grieks-app plus het hoofdmenu en `profiel/index.html`
  ingesloten, hergebruikt bewust dezelfde leerling-identiteit
  (`certamen_battle_identity` in localStorage, `identities/{klas}/{lid}`) en
  dezelfde docent-Firebase Auth als Certamen. Het is een zelfstandige kopie
  van certamen/net.js's inlog-logica (net.js hangt te veel aan de rest van
  Certamen om los in te sluiten), dus login-/rollensysteem-wijzigingen daar
  moeten hier bewust herhaald worden. De 16 losse apps schrijven hun score
  naar `identities/{klas}/{lid}/apps/{appId}` via `KTScores.save()`.
