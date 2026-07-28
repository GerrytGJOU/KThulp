# Fase 10 — Technische audit en opschoning

> Scope: `certamen/singleplayer.js`, `certamen/singleplayer-data.js`, en de Chronica-relevante
> delen van `certamen/games.js`/`certamen/battle.js`/`certamen/core.js` (avatar, titels,
> Codex-integratie). De andere spelmodi (Battle Mode, Boss Battle, Total War) vallen buiten de
> scope van deze Chronica-audit en zijn niet doorzocht.

## Analyse

### Dode code

**Geconcludeerd: geen gevonden in de Chronica-laag.** Elke `sp*`-functie in `singleplayer.js`
(102 stuks) en elke `SP_*`-constante in `singleplayer-data.js` (35 stuks) is mechanisch getoetst
op daadwerkelijk gebruik elders in de codebase. Resultaat: **0 ongebruikte functies, 0 ongebruikte
constanten.** Eén schijnbare uitzondering (`spMatchTapLeft`, leek op het eerste gezicht ongebruikt
omdat de aanroep dynamisch wordt opgebouwd — `onclick="spMatchTap${side==="left"?"Left":"Right"}(…)"`
in `singleplayer.js:1767`) bleek bij nader onderzoek gewoon actief: de functienaam wordt tijdens
het renderen samengesteld, niet letterlijk uitgeschreven, waardoor een simpele tekstzoekopdracht
hem mist. Geen actie nodig — dit is geen dode code, alleen een blinde vlek in statische analyse.

### Restanten (TODO/FIXME, oude experimenten, dubbele implementaties)

**Geen gevonden.** Geen `TODO`/`FIXME`/`XXX`/`HACK`-markeringen in `singleplayer.js` of
`singleplayer-data.js`. Geen uitgecommentarieerde codeblokken — de `//`-regels die ik aantrof zijn
uitsluitend proza-documentatie (uitleg bij een ontwerpkeuze), geen gedeactiveerde code.

### Duplicatie

Geen dubbele implementaties van dezelfde logica gevonden binnen de Chronica-laag zelf. Twee
puzzeltypes (`spRenderMCPuzzle`/`spRenderTypedLatinPuzzle` enz.) delen bewust *niet* dezelfde
functie, maar dat is verdedigbaar: elk van de zes puzzeltypes heeft een eigen invoermodel
(meerkeuze, typen, tegels-swap, koppelen) dat generalisatie zou compliceren zonder duidelijke
winst. Geen wijziging voorgesteld.

### Consistentie van namen

- **Flags:** doorgaans `snake_case`, consistent. Eén conventie-afwijking, al door de auteur zelf
  gedocumenteerd en bewust: `Argos` (de scheepsbouwer, Hoofdstuk 5) is met opzet anders gespeld
  dan `Argus` (de honderdogige wachter, Hoofdstuk 3) om verwarring te vermijden — dit is dus geen
  inconsistentie maar precies het tegenovergestelde, en hoort in deze fase vermeld te worden als
  goed voorbeeld, niet als bevinding om te herstellen.
- **Scène-ids:** consistent `PRO_###`/`CH<n>_###`, met logische subprefixen per lijn
  (`CH2_L##`/`CH2_S##`/`CH2_K##`/`CH2_H##` voor Latona/Semele/Kallisto/Herakles). Geen
  afwijkingen gevonden.
- **NPC-ids in `SP_CODEX_PERSONS`:** consistent, inclusief bewuste disambiguatie
  (`aias` vs. `aias_oileus`, `kastor_polydeukes` als gecombineerde entry). Geen dubbele namen voor
  hetzelfde ding, geen dezelfde naam voor twee dingen.
- **Statnamen:** consistent doorheen `SP_STAT_KEYS`/`SP_STAT_DEFS`/`SP_CLASS_STATS`.

**Conclusie: geen naamgevingsproblemen gevonden die actie vereisen.**

### Datavaliditeit

Zie het nieuwe validatiescript (`certamen/tools/validate_chronica.js`, hieronder) voor de volledige,
herhaalbare toetsing. Samengevat, over 476 scènes en 13 payoffs:

| Controle | Resultaat |
|---|---|
| Kapotte scèneverwijzingen | 0 |
| Dubbele scène-ids | 0 |
| Onbereikbare scènes (buiten de bewust payoff-only `CH3_H01_HARNAS`) | 0 |
| Wees-payoffs (conditie verwijst naar nooit-geschreven flag) | 0 |
| Ontbrekende `PUZZLE`/`COMBAT`/`SOUVENIR`/`CODEX`/`VOCAB`/`FRAGMENT`/`EERETITEL`/`PERSON`-referenties | 0 |
| Dode flags (informatief, geen fout) | 31 — zie fase 1 §1 voor de volledige analyse |
| Terminale scènes (informatief) | 1 (`CH9_MUSEUM_00`, de huidige laatste scène van het gebouwde spel) |

**De datalaag van Chronica Classica is technisch schoon.** Alles wat deze audit als probleem
aanmerkt (fase 1-9) is een ontwerpkwestie — te weinig wordt teruggelezen — niet een technisch
mankement. Geen enkele verwijzing wijst naar iets dat niet bestaat.

### Scheiding van inhoud en code

Goed gescheiden: alle verhaalinhoud staat in `SP_*_CNS`-stringconstanten
(`singleplayer-data.js`), alle renderlogica in `singleplayer.js`. Ik heb geen hardgecodeerde
verhaalzinnen in `singleplayer.js` zelf gevonden — de UI-strings die daar wél voorkomen (toasts,
knoplabels) zijn systeemmicrocopy, geen verhaalinhoud, en horen dus terecht in de codelaag. Zie
fase 8 §2c voor een inhoudelijke (niet technische) beoordeling van de toon van die microcopy.

### Foutafhandeling

**Sterker dan verwacht — een compliment waard.**
- `spSlotsLoadLocal()` vangt corrupte JSON af (`try/catch`, valt terug op `{}`).
- `spResumeSlot()` heeft een expliciet vangnet: verwijst een save naar een scène-id die niet
  meer bestaat (bijvoorbeeld na een hernoeming), dan valt de speler terug op de eerste scène in
  plaats van vast te lopen (`singleplayer.js:542`, met een verklarende comment die dit ook zo
  benoemt).
- Onbekende flags veroorzaken geen fout: `SP_STATE.flags` is een open, ongetypeerd object — een
  flag die niets meer betekent, ligt er inert bij zonder iets te breken.

Geen zwakke plek gevonden in de foutafhandeling van de Chronica-laag.

### Savecompatibiliteit

**Impliciet, en effectief opgelost.** `spResumeSlot()` doet
`Object.assign(SP_EMPTY_STATE(), slots[n]||{})` — elk veld dat in een oude save ontbreekt (bv.
`relations`, toegevoegd nadat het relatiesysteem in Hoofdstuk 6/8 werd gebouwd) krijgt automatisch
zijn lege standaardwaarde uit `SP_EMPTY_STATE()`. Er is dus geen apart migratiescript nodig
geweest, en dat blijft ook voor toekomstige nieuwe velden zo werken, zolang nieuwe velden altijd
eerst in `SP_EMPTY_STATE()` worden toegevoegd. Enige aandachtspunt voor de toekomst: dit patroon
werkt alleen voor *nieuwe* velden, niet voor *hernoemde* velden — een toekomstige hernoeming van
een bestaand `SP_STATE`-veld zou wél een handmatige migratie vragen. Nu niet relevant, wel te
onthouden.

### Testdekking

**Dit was, vóór deze fase, het enige echte gat.** `certamen/tools/` bevatte één script
(`export_verhaalteksten.js`, voor het exporteren van leesbare verhaalteksten) en geen enkel
validatiescript. `Chronica.md` §11.5 verwijst meermaals naar "reachability-scripts" die tijdens
eerdere bouwsessies zijn gedraaid, maar die zijn nooit gecommit ("niet apart gecommit — dit is de
samenvatting die telt") — elke keer opnieuw ad hoc geschreven, nooit herbruikbaar gemaakt.

**Opgelost in deze fase:** zie hieronder.

---

## Opgeleverd: `certamen/tools/validate_chronica.js`

Een nieuw, blijvend validatiescript dat de hele scènegraaf doorloopt en alle bovengenoemde
datafouten meldt — precies wat de opdracht als minimum vraagt. Leest de CNS-data met een eigen
kopie van dezelfde parser als `singleplayer.js` gebruikt (een los Node-script heeft geen toegang
tot browser-modules, dus overname was nodig; een toekomstige wijziging aan `CNSParser` in
`singleplayer.js` moet dus ook hier worden doorgevoerd — dat staat er ook zo in een commentaar bij).

Controleert: kapotte scèneverwijzingen, dubbele scène-ids, onbereikbare scènes (met uitzondering
van bewuste payoff-only scènes), wees-payoffs, dode flags, en ontbrekende cross-referenties naar
`PUZZLE`/`COMBAT`/`SOUVENIR`/`CODEX`/`VOCAB`/`FRAGMENT`/`EERETITEL`/`PERSON`. Geeft exit code 1 bij
harde fouten (bruikbaar in een CI-check), 0 bij hooguit waarschuwingen.

**Gebruik:**

```bash
node certamen/tools/validate_chronica.js
```

**Resultaat op de huidige inhoud:** 0 fouten, 32 waarschuwingen (31 dode flags + 1 terminale
scène) — consistent met fase 1's handmatige telling, wat het script zelf ook meteen valideert.

---

## Opruimverslag

**Wat is weggehaald:** niets. Er is geen dode code, geen restant en geen duplicatie gevonden die
veilig te verwijderen was — de Chronica-laag bleek bij onderzoek schoner dan verwacht.

**Wat is toegevoegd:** `certamen/tools/validate_chronica.js` (234 regels, puur leesonly, wijzigt
geen spelgedrag).

**Waar:** op een aparte branch, `chronica-audit-fase10-opschoning`, met één losse commit
(`4146c04`, "Chronica: datavalidatiescript toegevoegd (fase 10 audit)"). Deze branch bevat
**uitsluitend** het nieuwe bestand — de al vóór deze audit aanwezige, niet-gecommitte wijzigingen
aan `Chronica.md`/`certamen/index.html`/`certamen/singleplayer-data.js`/`certamen/singleplayer.js`
zijn niet aangeraakt en staan nog steeds, ongewijzigd, klaar op `main`. Ik ben na de commit
teruggekeerd naar `main`; de nieuwe branch wacht op een bewuste merge-beslissing van jou.

**Wat ik bewust heb laten staan:** de 31 dode `_route`-flags en de terminale scène
`CH9_MUSEUM_00` — dat zijn geen technische fouten maar verhaalkeuzes (fase 1/2), en vallen dus
buiten wat deze fase mag aanraken ("geen verhaalinhoud aantasten, geen spelgedrag veranderen").
Ze staan nu, dankzij het validatiescript, voor het eerst structureel gedocumenteerd in plaats van
alleen in deze audit.
