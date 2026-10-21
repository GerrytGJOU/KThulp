# Castra Heronum — klastest: checklist, bekende gaten, testkit

Voor Gerben · opgesteld 2026-10-25 · hoort bij `CASTRA_HERONUM.md` (ontwerp en bouwstand) en `CASTRA_LEERLINGTEST.md` (script voor de leerlingen).

**Stand in één alinea:** Castra Heronum is speelbaar van kamp tot Troje (kamp, jacht in drie regio's, campus, tower defence met 7 missies, heldenzaal met 15 helden, troepenbomen met 151 vormen, stabula en navalia). De Legio (klassenevenementen) en het valetudinarium bestaan nog niet. Alles is lokaal getest (browser, gesimuleerde aanraking, gesimuleerde gevechten); **niets is nog op een echte iPad of telefoon of met een echte klas gespeeld.**

---

## 1. Push-checklist

Er staan **20 commits lokaal op `main` die nog niet gepusht zijn** (alles van Castra Heronum, incl. de aangepaste hoofdmenu-tegel). GitHub Pages serveert `main`, dus pas na de push zien leerlingen iets.

Vóór je pusht:

- [ ] `git status`: alleen de ongevolgde `certamen/tools/skilltree-balance-result*.json` mogen nog los staan (dat zijn oude simulatie-uitvoerbestanden, niet van dit project).
- [ ] **Firebase-regels staan live** (laatst gepubliceerd op 2026-10-27, incl. Legio en Commercium; eerder 2026-10-22, met `firebase deploy --only database --project kthulp-certamen`). Controle: Console → Realtime Database → Regels moet `classAnalyticsCastra` en `castra` onder `identities/$klas/$lid` bevatten. Zo niet: opnieuw publiceren vanuit `certamen/database.rules.json`.
- [ ] Besluit bewust over de **RPG Maker MV-tilesets** (`certamen/assets/tilesets/`, 1,3 MB). Je gaf toestemming om ze in de repo te laten; de licentie voor gebruik buiten RPG Maker zelf is niet uitgezocht (zie README in die map).
- [ ] Besluit over de **sprites van derden** in `certamen/assets/sprites-topdown/` (hiddenone-packs uit je Downloads). Zelfde vraag: mogen ze op een openbare site?

Pushen:

```bash
git push origin main
```

Na het pushen:

- [ ] Wacht 1–3 minuten op de Pages-build (Repository → Actions → "pages build and deployment" groen).
- [ ] Open `https://GerrytGJOU.github.io/KThulp/certamen/` op **een iPad** en doe een harde verversing (Safari: pagina sluiten en opnieuw openen). De cachebusters (`?v=`) in `certamen/index.html` zijn bij elke wijziging opgehoogd, dus een gewone herlaad hoort ook te werken.
- [ ] Rooktest (10 minuten, zie §4): kamp → jacht → winnen → soldaat opnemen → campus → proelium m1.
- [ ] Controleer op de docentpagina van een klas dat het blok *Castra Heronum — vertaalhulp deze maand* verschijnt zodra een ingelogde leerling een woord heeft aangetikt.

Terugdraaien als het misgaat: de modus zit achter één tegel (`certamen/games.js`, `go('castraHome')`). Snelste noodrem: die tegel verwijderen en pushen, of `git revert` van de Castra-commits (de eerste is `8d83c21`). Er is **geen** aan/uit-schakelaar in Firebase zoals bij de skill-trees.

---

## 2. Bekende gaten

### 2a. Sprites ontbreken (top-down)
Niet elk avatar-onderdeel bestaat al als top-down sprite. **Regel (sinds 2026-10-28):** zijn *alle* door de leerling gekozen onderdelen (huid, ogen, haar, baard, harnas, helm, cape, schild, extra, legendarisch) als top-down sprite aanwezig, dan ziet hij zijn avatar in top-down; ontbreekt er één, dan toont Castra de Battle Mode-avatar (zijaanzicht) in zijn geheel (`castra-avatar.js`, `castraTdComplete`). Wapens tellen niet mee. Zodra je sprites toevoegt, wordt dit vanzelf beter; de lijst hieronder kan dus verouderd zijn (controle: README in `assets/sprites-topdown/`). Voorheen ontbrekende onderdelen kregen een terugval per laag; dat is vervangen door dit alles-of-niets-principe:

| Ontbreekt | Gevolg voor de leerling |
| --- | --- |
| `armor_licht`, `armor_zwaar`, `armor_hopliet` (en dus ook *Kampioen*) | Battle Mode-avatar (zijaanzicht) |
| `helm_hopliet`, `helm_kroon` (kroon inmiddels aangeleverd) | Battle Mode-avatar |
| 4 schilden (`rond`, `ovaal`, `vierkant`, `tower`) | Battle Mode-avatar als een schild is gekozen |
| 4 legendarische helden (Achilles, Aeneas, Ajax, Odysseus) | Battle Mode-avatar |
| `extra_blush`, `extra_warstripes`, `borstband` | Battle Mode-avatar als die gekozen is |
| wapens (bewust, niet nodig) | geen wapen in de top-down weergave |

In de profieleditor (Battle Mode) blijft alles gewoon zichtbaar; het gaat alleen om Castra Heronum. Je ziet het verschil pas als een leerling zo'n onderdeel gekozen heeft.

### 2b. Inhoud
- **Alle Latijnse teksten zijn een concept van mij** (kamp, gesprekken, 15 heldenketens, 45 gesprekjes, missieberichten) en nog niet door jou nagelopen. Let op naamvallen en bijzonderheden (bv. *ex castris* = "uit het kamp", *Hoc non convenit*).
- **Het glossarium (~700 woorden)** is ook van mij; een controle in de browser bevestigt dat elk Latijns woord dat in het spel staat een vertaling heeft, maar de betekenissen zelf zijn niet gecontroleerd. Nieuwe woorden toevoegen: `CASTRA_GLOSS` in `certamen/castra-latin.js`.
- De mythologische details zijn vereenvoudigd (bv. Perseus' Gorgonen "bij de kust"). Geen bronverwijzing per held.
- Grammatica volgt nog **niet** de woordenlijsten/hoofdstukken van de methode (het plan noemt dat als wens; `Latium` gebruikt wel alleen presens en eenvoudige zinnen).

### 2c. Spelbalans (alleen gesimuleerd)
- Gevechten zijn met een deterministische simulatie doorgerekend (`castraPRunHeadless`), niet door mensen gespeeld. De waarden per missie staan in `CASTRA_P_MISSIONS` (`hpMult`). Verwacht dat m1 en g1 te makkelijk/te moeilijk blijken en pas na de klastest goed afgesteld kunnen worden.
- **Soldaten werven** kan via jagen (verslagen vijand opnemen) of de **Dilectus** (40 frumentum + 20 aes; de beoordeling is Latijn). Is de Dilectus te goedkoop of te duur: `CASTRA_MED.hireCost` in `castra-medical.js`.
- **Gewonden:** na een proelium raken soldaten van de voorste linie gewond (bij doorbraken) of allemaal (bij verlies); herstel duurt 4–10 minuten, korter met een hoger valetudinarium. Geen verlies van grondstoffen bij verlies.
- Er zijn geen oppugnatio- of baasgevechten, alleen verdediging.
- Het proelium gaat uit van torens die niet kunnen sneuvelen; ruiters en boogschutters "vliegen" niet over het pad.

### 2d. Techniek en risico's
- **Opslag:** voortgang staat lokaal (`localStorage`, per klas+leerlingcode of "gast") en wordt best-effort naar Firebase gesynchroniseerd (4 s na de laatste wijziging). Bij wisselen van apparaat wint de **nieuwste** save; speel je tegelijk op twee apparaten, dan overschrijft de laatste de ander. Een zware save (34 soldaten, 15 helden, 550 opgezochte woorden) is 16 KB, ruim onder de 40 KB-grens in de regels.
- **Legio en Commercium zijn alleen getest met een nep-database**, niet met meerdere echte apparaten. Test het evenement eerst met 2–3 devices in jouw eigen klas voordat de hele klas meedoet; let op of alle deelnemers dezelfde vijanden op dezelfde plek zien (zo niet: lockstep-fout, meld het). Het commercium en de Legio werken alleen voor ingelogde leerlingen; ruilen is wereld-schrijfbaar zoals de rest van Certamen (geen bescherming tegen een leerling die bewust andermans aanbod wist).
- **Gastspelers** (niet ingelogd) hebben geen cloudopslag en komen niet in het docentoverzicht.
- **Docentoverzicht** toont alleen woorden/zinnen die ingelogde leerlingen opzochten (per klas/maand, nooit per leerling). Er is nog geen overzicht van voortgang (welke helden, welke missies).
- **Geen anti-valsspelen:** de analysebomen zijn wereld-schrijfbaar zonder auth (zelfde afweging als de rest van Certamen). Een leerling kan zijn eigen save in de console aanpassen.
- **iPad/telefoon niet echt getest.** De duimbesturing (`castra-stick.js`) is getest met gesimuleerde pointer-events. Let in de klas op: joystickgevoeligheid, scrollen buiten de kaart, tikken op gebouwen, tikken op de kleine tegels in het proelium.
- **Telefoon:** het kamp en de wereld zijn leesbaar (wereld toont op smalle schermen een staande uitsnede van 10×13 tegels, labels schalen mee). In het **proelium zijn de tegels op een telefoon ±21 px**: te klein om comfortabel te plaatsen. Advies: laat het proelium op iPad of laptop doen.
- **Prestaties:** 32×24-tegelkaarten en tot ±30 eenheden in een gevecht zijn getest op een desktopbrowser, niet op een oudere iPad.
- Bij het openen van Castra Heronum worden eenmalig 58 sprite-bestanden "gescand"; de 18 ontbrekende (de 6 wapens worden niet gescand) geven **404-meldingen in de browserconsole**. Dat is verwacht en onschadelijk.
- Het hoofdmenu heeft nu de tegel *Castra Heronum* (BETA) op de plek van Boss Battle; Boss Battle zit alleen nog in Battle Mode (via de speltype-keuze). De Battle Mode-FAQ is hierop **niet** aangepast.

### 2e. Bewust nog niet gebouwd
forum/templum/ludus/fabrica/navalia/stabula/bibliotheca/murus, oppugnatio en baasgevechten, kaartweergave van het proelium, een Griekse modus, geluid/muziek, Latijnse knoppen in de **bestaande Certamen-schermen** (alleen Castra zelf is Latijn).

---

## 3. Docent-testkit (voor demo en eigen test)

Open eerst Castra Heronum (zodat het spel geladen is), open daarna de browserconsole en plak één van onderstaande blokken. Het werkt alleen op jouw apparaat/save.

**Kit A — halverwege (alles level 3, 6 rekruten op level 20 — klaar om te evolueren zodra de campus op niveau 2 staat —, veel grondstoffen):**

```js
(()=>{ const C=CASTRA; C.res={frumentum:500,lignum:600,aes:600,gloria:10};
  Object.keys(C.b).forEach(k=>{ if(k!=="principia") C.b[k].lvl=3; });
  ["rom_tiro","rom_tiro","rom_tiro","rom_tiro","rom_tiro","rom_tiro"].forEach(l=>{ const s=castraRollSoldier(l); s.lvl=20; C.soldiers.push(s); });
  C.introSeen=true; castraSave(); go("castraHome"); })()
```

**Kit B — Graecia en Troia direct open (missies m1–g1 gedaan):**

```js
(()=>{ CASTRA.proelium={done:{m1:true,m2:true,m3:true,g1:true}}; castraSave(); go("castraRegions"); })()
```

**Kit C — alle helden in de heldenzaal (loyaliteit 50):**

```js
(()=>{ Object.keys(CASTRA_HERO_DATA).forEach(id=>{ castraHeroRecruit(id); castraHero(id).fides=50; }); castraSave(); go("castraHome"); })()
```

**Alles wissen en opnieuw beginnen (gast):**

```js
localStorage.removeItem("castra_save_v1_gast"); location.reload();
```

(Voor een ingelogde leerling heet de sleutel `castra_save_v1_<klascode>_<leerlingcode>`.)

---

## 4. Rooktest (10 minuten, jij of een collega)

1. Hoofdmenu → *Castra Heronum*: de Latijnse inleiding verschijnt, tik "Intellego."
2. Loop met je duim door het kamp; tik een gebouw: paneel opent in het Latijn, ⓘ en woord-tikken geven vertalingen.
3. Verzamel bij het *metallum* na even wachten (of gebruik Kit A); verbeter het praetorium.
4. Poort bovenaan → regiokeuze → Latium → loop in het donkere gras tot een ontmoeting begint → lees het bericht → kies een soldaat (of de dux) → win.
5. Neem de verslagen soldaat op ("Recipio."); open de *campus*: laat hem trainen, kijk naar de evolutie-eis. Open ook de *Dilectus* (kantoor rechtsboven, naast de houthakker): kies een rekruut op basis van de Latijnse beoordeling.
6. Praat met Aeneas (in Latium, links boven het kruispunt van de twee wegen), accepteer de opdracht.
7. Poort rechts in het kamp → *Proelium* → missie 1 → plaats torens → "Incipe!" → win.
8. Open de *heldenzaal* en kijk of Aeneas na zijn keten (jagen → m1 → overtuigen) is aangekomen.
9. Herlaad de pagina: voortgang moet er nog zijn.
10. Kijk in de browserconsole: geen rode foutmeldingen anders dan 404's voor ontbrekende sprites.

---

## 5. Klastest tower defence (nieuwe functies, 2026-12)

Hoort bij `CASTRA_TROEPENBOMEN.md` §25–§27. Doel van deze test is niet bewijzen dat het spel werkt, maar ontdekken wat nog niet werkt. De leerlingen mogen zelf beginnen zonder uitleg: kijk of de uitlegvensters genoeg zijn.

### 5a. Vooraf klaarzetten

- [x] **Firebase-regels voor de meetpunten staan live** (gepubliceerd 2026-12-08; de tak `classAnalyticsCastraTD` accepteert een getal en weigert een tekst). Het bestand `certamen/database.rules.json` is gelijk aan wat live staat.
- [ ] Controleer op de docentpagina van de klas (Castra-blok) dat de tabel *tower defence deze maand* na één gevecht van een ingelogde leerling gevuld raakt.
- [ ] **Privacy:** de meetpunten bevatten alleen tellers per klas en maand (geen namen, geen leerlingcode, geen tekst van leerlingen). Controle: in de Firebase Console onder `classAnalyticsCastraTD/<klascode>/<maand>` staan alleen sleutels als `m_<missie>`, `e_<regel>`, `ret_d1`, met getallen.
- [ ] Ververs de pagina hard op elk testapparaat (cachebusters staan in `certamen/index.html`).
- [ ] Test één keer zonder netwerk: het gevecht moet gewoon werken; een mislukte synchronisatie mag niets laten zien.
- [ ] Zet een eigen testsave klaar met **Kit D** (hieronder) voor leerlingen die nog niet ver zijn.
- [ ] Print het observatieblad (§5d).

**Kit D — klaar voor de testmissie *Silva Gallica* (missie ga1: snelle verkenners en zware krijgers, twee banen, geen zware regels):**

```js
(()=>{ const C=CASTRA; C.proelium={done:{m1:true,m2:true,m3:true,ro1:true,ro2:true}}; C.seenTD={}; C.pxp=Math.max(C.pxp||0,1500);
  C.soldiers=C.soldiers||[]; ["rom_hastatus","rom_hastatus","rom_veles","rom_veles","rom_eques","rom_eques","rom_faber","rom_princeps"].forEach((l,i)=>{ const s=castraRollSoldier(l); s.lvl=20; C.soldiers.push(s); });
  C.res={frumentum:500,lignum:600,aes:600,gloria:10}; C.introSeen=true; castraSave(); go("castraProelium"); })()
```

### 5b. Les van 50 minuten

| Tijd | Wat |
|---|---|
| 0–5 | Introductie en nulmeting: dit is een test van het spel, niet van hen. Wie heeft eerder tower defence of monsterverzamelspellen gespeeld? Ze loggen in met hun eigen account. |
| 5–15 | Vrij spelen: leerlingen kiezen zelf de eerste beschikbare missie. Help alleen als ze vastlopen. Noteer of ze de uitlegvensters lezen, de gouden lijnen van synergieën opmerken en bevelen gebruiken. |
| 15–27 | Gerichte opdracht: iedereen speelt *Silva Gallica* (Kit D voor wie er nog niet is). Laat ze vooraf voorspellen welke opstelling werkt, dan spelen, dan één keer opnieuw met een aanpassing. |
| 27–37 | Experimenteren: één bewuste verandering (een ondersteuner vervangen, een andere synergie proberen, een bevel op een ander moment). Vraag wat ze verwachten dat er verandert. |
| 37–45 | Reflectie, individueel: wat was leuk, wat was onduidelijk, wat wil je als eerste opnieuw proberen, speel je thuis uit jezelf verder en waarom? |
| 45–50 | Vrije keuze: nieuwe missie, de wereld verkennen, een codexvermelding bekijken of de wekelijkse uitdaging. Observeer wat ze kiezen, zonder beloning. |

Duurt inloggen te lang (meer dan 10 minuten), laat dan de eerste missie en de reflectie voorgaan.

### 5c. Wat zit er in de meetpunten (docentpagina, blok *Castra Heronum — tower defence deze maand*)

| Meting | Wat je ermee ziet | Let op |
|---|---|---|
| Gestart / gewonnen / afgebroken per missie | Waar leerlingen vastlopen of afhaken | Veel afbreken op één missie wijst op moeilijkheid of onduidelijkheid |
| Duur (gem.) | Past een gevecht in de les? | Alleen het gemiddelde; uitschieters ontbreken |
| Ander team dan vorige poging | Of ze experimenteren | Veel wissels kan nieuwsgierigheid of wanhoop zijn |
| Waarom een missie moeilijk was | Optionele vraag na een verlies (te moeilijk, onduidelijk, opstelling, te lang, anders) | Alleen wie antwoordt telt mee |
| Per rol en regel: gevechten en winst | Welke combinaties te zwaar zijn | Vergelijk alleen met voldoende pogingen |
| Opstelling per soldatensoort | Dominante keuzes | Eén dominante keuze kan bij de missie passen |
| Synergieën actief, bevelen gegeven | Of ze die gebruiken | "Actief" is niet "opgemerkt": vraag het ook |
| Wanneer bevelen worden gegeven (levens, afstand, golf) | Of het een routine is of een keuze | Alleen opgeteld, geen tijdlijn |
| Schooltijd of daarbuiten, sessielengte en activiteiten | Wie thuis speelt en wat er dan gebeurt | De categorie volgt uit het tijdstip (ma–vr 8–17 u), niet uit een bevestiging |
| Spelers per dag en terugkeer | Vroege signalen of leerlingen terugkomen | Eén klas en een korte periode: geen bewijs van retentie |
| Wekelijkse uitdaging | Verschijnt als missie "Wekelijkse uitdaging" in dezelfde tabel | |

### 5d. Observatieblad (print of noteer in een tabel)

| Leerling (initialen) | Begreep hoe je start | Las de uitlegvensters | Zag de synergielijnen | Gebruikte bevelen (wanneer) | Wisselde team na verlies | Zei zelf "nog een keer" | Opvallende verwarring of vraag |
|---|---|---|---|---|---|---|---|
| | | | | | | | |

Noteer ook: hoeveel leerlingen na de les uit zichzelf een nieuwe missie kozen, en of iemand klaagde dat een gevecht "oneerlijk" voelde.

### 5e. Wanneer zeg je: dit werkt (voorlopige beslisregels, geen normen)

**Groen — doorbouwen:** de meeste leerlingen starten en voltooien zonder hulp een missie; ze kunnen minstens één tactische keuze uitleggen; na een verlies proberen meerdere leerlingen bewust iets anders; bevelen en synergieën worden zonder aanwijzen gebruikt; ze noemen concrete dingen die ze opnieuw willen proberen.

**Oranje — gericht aanpassen:** leerlingen kijken vooral naar de hoogste statistieken; synergieën zijn vaak actief maar worden niet opgemerkt; bevelen worden bijna altijd op hetzelfde moment gebruikt; leerlingen winnen maar begrijpen niet waarom; één missieregel of vijandrol zorgt telkens voor onverwachte nederlagen.

**Rood — eerst de kern repareren:** veel leerlingen begrijpen zonder hulp niet hoe ze een gevecht starten of plaatsen; verliezen voelen willekeurig; de nieuwe systemen worden niet herkend, zelfs niet na uitleg; gevechten duren zo lang dat er geen tijd is voor een tweede poging.

Kijk bij een kleine klas naar individuele patronen en niet naar percentages. Na één week (thuisgebruik) kijk je opnieuw: wie speelde uit zichzelf? Trek pas na meerdere weken conclusies over retentie.
