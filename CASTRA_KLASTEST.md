# Castra Heroum — klastest: checklist, bekende gaten, testkit

Voor Gerben · opgesteld 2026-10-25 · hoort bij `CASTRA_HEROUM.md` (ontwerp en bouwstand) en `CASTRA_LEERLINGTEST.md` (script voor de leerlingen).

**Stand in één alinea:** Castra Heroum is speelbaar van kamp tot Troje (kamp, jacht in drie regio's, campus, tower defence met 7 missies, heroum met 15 helden). De Legio (klassenevenementen) en het valetudinarium bestaan nog niet. Alles is lokaal getest (browser, gesimuleerde aanraking, gesimuleerde gevechten); **niets is nog op een echte iPad of telefoon of met een echte klas gespeeld.**

---

## 1. Push-checklist

Er staan **20 commits lokaal op `main` die nog niet gepusht zijn** (alles van Castra Heroum, incl. de aangepaste hoofdmenu-tegel). GitHub Pages serveert `main`, dus pas na de push zien leerlingen iets.

Vóór je pusht:

- [ ] `git status`: alleen de ongevolgde `certamen/tools/skilltree-balance-result*.json` mogen nog los staan (dat zijn oude simulatie-uitvoerbestanden, niet van dit project).
- [ ] **LET OP: de nieuwe regels voor Legio en Commercium (2026-10-27) zijn nog NIET gepubliceerd.** Zonder die regels geven `castraLegio/…` en `castraTrades/…` "permission denied": het evenement starten en ruilen werken dan niet (de rest van het spel wel). Publiceren: `firebase deploy --only database --project kthulp-certamen`.
- [ ] **Firebase-regels staan live** (gepubliceerd op 2026-10-22 met `firebase deploy --only database --project kthulp-certamen`). Controle: Console → Realtime Database → Regels moet `classAnalyticsCastra` en `castra` onder `identities/$klas/$lid` bevatten. Zo niet: opnieuw publiceren vanuit `certamen/database.rules.json`.
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
- [ ] Controleer op de docentpagina van een klas dat het blok *Castra Heroum — vertaalhulp deze maand* verschijnt zodra een ingelogde leerling een woord heeft aangetikt.

Terugdraaien als het misgaat: de modus zit achter één tegel (`certamen/games.js`, `go('castraHome')`). Snelste noodrem: die tegel verwijderen en pushen, of `git revert` van de Castra-commits (de eerste is `8d83c21`). Er is **geen** aan/uit-schakelaar in Firebase zoals bij de skill-trees.

---

## 2. Bekende gaten

### 2a. Sprites ontbreken (top-down)
Van de 64 avatar-bestanden zijn 24 nog niet als top-down sprite aangeleverd. De avatar valt daarvoor automatisch terug, zodat niemand onzichtbaar of kaal rondloopt (`castra-avatar.js`):

| Ontbreekt | Gevolg voor de leerling |
| --- | --- |
| `armor_licht`, `armor_zwaar`, `armor_hopliet` (en dus ook *Kampioen*) | toont het harnas *middel* (anders *vodden*) |
| `helm_hopliet`, `helm_kroon` | geen helm zichtbaar |
| 4 schilden (`rond`, `ovaal`, `vierkant`, `tower`) | geen schild zichtbaar |
| 4 legendarische helden (Achilles, Aeneas, Ajax, Odysseus) | normale avatar i.p.v. de held |
| `extra_blush`, `extra_warstripes`, `borstband` | die extra's/borstband zie je niet |
| wapens (bewust, niet nodig) | geen wapen in de top-down weergave |

In de profieleditor (Battle Mode) blijft alles gewoon zichtbaar; het gaat alleen om Castra Heroum. Je ziet het verschil pas als een leerling zo'n onderdeel gekozen heeft.

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
- Bij het openen van Castra Heroum worden eenmalig 58 sprite-bestanden "gescand"; de 18 ontbrekende (de 6 wapens worden niet gescand) geven **404-meldingen in de browserconsole**. Dat is verwacht en onschadelijk.
- Het hoofdmenu heeft nu de tegel *Castra Heroum* (BETA) op de plek van Boss Battle; Boss Battle zit alleen nog in Battle Mode (via de speltype-keuze). De Battle Mode-FAQ is hierop **niet** aangepast.

### 2e. Bewust nog niet gebouwd
forum/templum/ludus/fabrica/navalia/stabula/bibliotheca/murus, oppugnatio en baasgevechten, kaartweergave van het proelium, een Griekse modus, geluid/muziek, Latijnse knoppen in de **bestaande Certamen-schermen** (alleen Castra zelf is Latijn).

---

## 3. Docent-testkit (voor demo en eigen test)

Open eerst Castra Heroum (zodat het spel geladen is), open daarna de browserconsole en plak één van onderstaande blokken. Het werkt alleen op jouw apparaat/save.

**Kit A — halverwege (alles level 3, 6 soldaten Gr. 6, veel grondstoffen):**

```js
(()=>{ const C=CASTRA; C.res={frumentum:500,lignum:600,aes:600,gloria:10};
  Object.keys(C.b).forEach(k=>{ if(k!=="principia") C.b[k].lvl=3; });
  ["legioen","rangen","licht","ruiterij","legioen","licht"].forEach(l=>{ const s=castraRollSoldier(l,0); s.lvl=6; C.soldiers.push(s); });
  C.introSeen=true; castraSave(); go("castraHome"); })()
```

**Kit B — Graecia en Troia direct open (missies m1–g1 gedaan):**

```js
(()=>{ CASTRA.proelium={done:{m1:true,m2:true,m3:true,g1:true}}; castraSave(); go("castraRegions"); })()
```

**Kit C — alle helden in het heroum (loyaliteit 50):**

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

1. Hoofdmenu → *Castra Heroum*: de Latijnse inleiding verschijnt, tik "Intellego."
2. Loop met je duim door het kamp; tik een gebouw: paneel opent in het Latijn, ⓘ en woord-tikken geven vertalingen.
3. Verzamel bij het *metallum* na even wachten (of gebruik Kit A); verbeter het praetorium.
4. Poort bovenaan → regiokeuze → Latium → loop in het donkere gras tot een ontmoeting begint → lees het bericht → kies een soldaat (of de dux) → win.
5. Neem de verslagen soldaat op ("Recipio."); open de *campus*: laat hem trainen, kijk naar de evolutie-eis. Open ook de *Dilectus* (kantoor rechtsboven, naast de houthakker): kies een rekruut op basis van de Latijnse beoordeling.
6. Praat met Aeneas (in Latium, links boven het kruispunt van de twee wegen), accepteer de opdracht.
7. Poort rechts in het kamp → *Proelium* → missie 1 → plaats torens → "Incipe!" → win.
8. Open het *heroum* en kijk of Aeneas na zijn keten (jagen → m1 → overtuigen) is aangekomen.
9. Herlaad de pagina: voortgang moet er nog zijn.
10. Kijk in de browserconsole: geen rode foutmeldingen anders dan 404's voor ontbrekende sprites.
