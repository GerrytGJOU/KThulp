# Castra Heroum × Pokémon: analyse en verbetervoorstellen (2026-10-24)

Aanleiding: `Dossier_Pokemon_Mythologische_RPG_Claude_Code.docx` (ChatGPT-onderzoek, 23-10-2026).
Het dossier vraagt om audit → gap-analyse → architectuur → akkoord, en pas daarna bouwen. Dit document is de audit en gap-analyse
van de bestaande code. **Er is niets aan de code veranderd.**

**Eerlijk over de bronnen:** de Pokémon-details hieronder komen uit mijn kennis van de pret-decompilaties (pokered, pokeemerald) en Showdown, niet uit
een verse lezing van die repo's. Formules en percentages die ik noem zijn dus eerst te verifiëren voordat ze in code komen (dossier §10B). Er wordt geen
Pokémon-code, -data of -asset overgenomen; alleen de regels (mechanica) worden nagebouwd in onze eigen stijl.

## 1. Wat het dossier vraagt en wat wij al hebben

| Dossier-domein | Stand in Castra Heroum | Oordeel |
|---|---|---|
| Overworld: tilemaps, collision, warps, NPC's | `castra-world/map/wobj`, deuren, zones, binnenruimtes, rondlopende NPC's, paard, veldacties (HM-achtig) | **Bestaat** |
| Dialoog, flags, quests | `castra-dlg`, questmotor + Diarium (`castra-diarium.js`); geen centrale flagtabel, zie `CASTRA_OVERWORLD_ANALYSE.md` | **Bestaat** |
| Dag/nacht | `castra-dayn.js` (echte klok, 4 fasen, meer mythische vijanden 's nachts) | **Bestaat** (alleen effect op encounters) |
| Wezens: soort, stats, individu | 151 vormen (`castra-troops.js`), soldaat = individu met `indoles` (0-15), `ingenium` (±10%), `insignis` (1/200) | **Bestaat**, maar zie §2 |
| Gevecht: beurtvolgorde, PP, accuracy, damage, type, AI | `castra-moves.js` | **Bestaat, simpel** (kern van dit document) |
| Status-effecten | alleen vertraging + steun/schild | **Uitbreiden** |
| Progressie: XP, levels, team van zes | Gen 5-XP-formule + Medium Fast-curve (`castra-xp.js`), Contubernium van 8, wisselen, Exp. Share | **Bestaat** (beter dan de baseline) |
| Verzamelen: encounters, vangen, encyclopedie, opslag | wilde tabellen per regio/terrein, Capere, codex, barakken-cap | **Bestaat**, vangen uitbreidbaar |
| Economie: inventaris, winkels | gebouwen, aes/frumentum, buit; geen voorwerpen | **Nieuw bouwen** (klein) |
| Persistentie | één JSON per leerling (localStorage + Firebase, max 40.000 tekens), saveKey `castra_save_v1_…` | **Uitbreiden** (migraties) |
| Content-pipeline | vormen/artes/helden zijn data-objecten in JS, moves staan deels in code | **Uitbreiden** |
| Deterministische tests | `tools/castra-moves-test.js`, `castra-xp-test.js`, geïnjecteerde seed (`V.rng`) | **Bestaat**, uitbreiden |
| Latijn en leren | `castraLaHTML`, Latijnse gevechtsregels, vangvraag, woordenlijst/hulp | **Bestaat** (sterker dan het dossier) |
| Dubbelgevechten, weer, held items, eieren/breeding | niets | **Later / optioneel** |

Open beslissingen van het dossier (§11) die de code al beantwoordt: JavaScript, browser (ook iPad), wezens worden **gevangen of gerekruteerd** (Capere),
doelgroep onder- en bovenbouw, Pokémon wordt niet letterlijk gevolgd maar als inspiratie (eigen driehoek, eigen stats).

## 2. Wat mist er in het gevecht, naast Pokémon gelegd

Dit zijn de verschillen die het gevecht merkbaar vlakker maken dan Pokémon. Gesorteerd van groot naar klein effect.

1. **Schadeformule is aftrekkend.** `castraMvCalc` (castra-moves.js:142): `d = impetus × (kracht/50) × typefactor − tutela × 0,4`.
   Een hoge tutela maakt aanvallen onbruikbaar (valt terug op minimum 1) en level doet alleen mee via +2,5% stats per level. Pokémon rekent met een
   **verhouding**: `((2·L/5 + 2) · kracht · A/D)/50 + 2`, daarna modifiers. Dat schaalt stabiel met level en voorkomt "muren".
2. **Geen willekeurige schadespreiding.** Pokémon vermenigvuldigt met een factor 0,85-1,00. Wij doen dat niet, dus hetzelfde duel geeft elke keer dezelfde
   getallen (behalve voltreffer/misser). Het gevecht voelt rekensom-achtig.
3. **Type zit op de eenheid, niet op de move.** Alle moves van een soldaat hebben het type van de soldaat. Daardoor bestaan er geen STAB (zelfde-type-bonus),
   geen dekking ("coverage") en geen keuze "welke move tegen deze vijand". Alleen de driehoek inf > cav > rng > inf (×1,5 / ×0,75) en sup/myth
   zijn altijd neutraal. Er zijn geen immuniteiten, geen dubbele typen. Dit is het grootste gat in strategische diepte.
4. **Geen statusaandoeningen.** Alleen vertraging (`slow`) en tijdelijke buffs. Pokémon heeft brand, vergif, slaap, verlamming, bevriezing, verwarring.
   Het levert tegelijk de rijkste Latijnse woordenschat op (zie §3).
5. **Statuswijzigingen zijn vlak en tijdelijk.** Pokémon: stat stages −6…+6 (factor `(2+n)/2`), die blijven tot wisselen. Wij: ×1,3 voor 3 beurten.
6. **Geen accuracy/evasion-stages.** Nauwkeurigheid is een vast percentage per move.
7. **Voorrang bij gelijke snelheid is niet willekeurig.** Gelijk celeritas = speler eerst (`castraMvRound`). Pokémon: 50/50.
8. **Voltreffer is vlak** (6% ×1,5). Pokémon heeft per move een voltreffer-trap (hoge-crit-moves) en negeert bij een voltreffer nadelige stages.
9. **Vijand-AI** kiest 25% willekeurig en anders de hoogste verwachte schade; wisselt nooit, mikt niet op status. Pokémon-trainer-AI scoort moves
   (genezen bij laag, status eerst, niet dubbel dezelfde status, wisselen bij typenadeel).
10. **Eind-van-de-beurt-fase ontbreekt.** Er is wel een opruimlus (`buff--`, `slow--`), maar geen plek voor beurtschade (vergif, brand), weer, regeneratie.
11. **Gevecht en weergave zitten door elkaar.** `castraMvExec` bouwt Latijnse HTML-regels en past tegelijk de toestand aan. `V.fx` is een goed begin
    (event-log voor animaties), maar het dossier wil `BattleEventLog` als enige uitvoer, met tekst en animatie als aparte lezers.

## 3. Voorstellen, per onderdeel

Elke regel: wat, waarom (didactisch/speelplezier), omvang, afhankelijkheden. Omvang: S = ≤ 1 sessie, M = 1-3, L = meerdere.

### A. Gevechtskern (grootste winst)

**A1. Verhoudingsformule + spreiding + gelijkspel-willekeur (S).** Vervang de aftrekkende schade door een verhoudingsformule met level en een factor 0,85-1,00;
speed-ties 50/50 via `V.rng`. Alle getallen schalen mee, dus `castra-moves-test.js` (winstpercentages) en de TD-balans moeten opnieuw getest worden.
Veilig omdat alles via één functie gaat (`castraMvCalc`). Geen datamigratie.

**A2. Fysiek/speciaal per move (S).** Dossier-advies (Gen 4). Wij hebben `impetus`/`tutela` maar niet de twee Pokémon-assen. Voorstel: een move krijgt
`cat:"vis"` (impetus/tutela) of `cat:"ars"` (nieuwe stat `ingenium` bestaat al als karakter, dus nieuwe naam nodig: bv. `mens`/`sensus`). Alleen doen
**als** we tot 2 extra statwaarden bereid zijn; anders overslaan, want het maakt de 151 vormen en alle helden herbalanceren.
Mijn advies: *niet nu*. Eerst A3, want die geeft veel meer diepte voor minder werk.

**A3. Elementtype op de move + STAB + dubbel type voor mythische wezens (M).** Het dossier stelt zelf `terra/vis`, `umbra/ignis`, `aer/ventus` voor. Voorstel:
- Houd de **driehoek** als "wapenklasse" (soldaat-type, bestaat al) en voeg een tweede as toe: **element** op de move (ignis, aqua, terra, aer, umbra, lux).
- Soldaten/helden hebben meestal alleen wapenklasse; mythische wezens en helden krijgen daarnaast 1-2 elementen.
- STAB ×1,25-1,5 als het element of de wapenklasse van de move bij de gebruiker past; typetabel met ×2 / ×0,5 / ×0 voor elementen (klein: 6×6).
- Een data-veld `el` per arte-/signatuurmove. Moves zonder `el` blijven werken.
Didactisch: de uitleg van elementen sluit aan op mythologie (Cerberus is umbra/ignis, Harpyia aer) en op Latijnse woorden.

**A4. Statusaandoeningen met Latijnse namen (M).** Voorstel (alle met lichte, leerlingvriendelijke regels):
| Latijn | Wat | Pokémon-analogie |
|---|---|---|
| `vulnus` (wond) | −1/16 levenspunten per beurt | vergif |
| `ustio` (brandwond) | −1/16 en aanval ×0,5 | brandwond |
| `somnus` (slaap) | 1-3 beurten niets doen | slaap |
| `pavor` (schrik) | 25-30% kans dat je beurt vervalt | verlamming/schrik |
| `tardior` (trager) | bestaat al (vertraging) | verlamming (speed) |
Eén `status`-veld per `side`, eind-van-beurt-fase voor schade. Vangkans krijgt statusbonus (slaap/schrik helpen vangen), dat past bij Capere.

**A5. Stat stages (±6) i.p.v. vlakke buffs (S-M).** `buffImp`/`buffTut` worden `stages.imp`, `stages.tut`, `stages.cel`, `stages.acc` met de gewone
`(2+n)/(2)`-tabel. Blijft tot wisselen. Maakt "Furor" en verdedigingsarte's veel strategischer.

**A6. Prioriteit, voltreffer-trap, accuracy/evasion (S).** `prio` bestaat al. Voeg `crit` (extra voltreffer-trap per move) en `acc` met stages toe.

**A7. Betere AI (S-M).** Score-gebaseerd: genezen onder 35%, status alleen als de vijand er geen heeft, wissel bij typenadeel, bij laag leven aanval met
hoogste verwachte schade (nu al), speel niet twee keer dezelfde buff. Houd een "lat" per moeilijkheid (zwak bij Latium, scherp bij bazen).

**A8. Eind-van-de-beurt en weer (M, optioneel).** Eén fase na beide acties voor status/regeneratie. Weer (regen, hitte, mist) kan op dag/nacht en regio
aansluiten (`castra-dayn.js` heeft al de plek).

**A9. Scheiding regels en weergave (M).** Maak van `castraMvExec` een pure functie die events teruggeeft (`{k:"hit", w:"me", n, mult, crit}`). De Latijnse
tekst en de animaties lezen dezelfde events (`V.fx` bestaat al). Voordeel: tests zonder DOM, makkelijkere uitbreiding, replay.

### B. Vangen en verzamelen

**B1. Vangkans per vorm en statusbonus (S).** Pokémon heeft een `catchRate` per soort (0-255) in plaats van één formule voor iedereen. Wij gebruiken nu
tier/level/insignis. Voeg `catch` toe aan `CASTRA_FORMS` (standaard 100-255 voor tier 1, lager hogerop, 3 voor bazen-achtigen). Statusbonus komt uit A4.

**B2. Vangmiddelen als voorwerpen (M).** Nu: één soort touw (`funis`), 3 pogingen per gevecht. Pokémon-model: verschillende middelen (Funis ×1, Rete ×1,5,
Laqueus ×2, Meester ×255), koop/buit/ambacht. Past bij Labor/Faber. Vereist een eenvoudige **inventaris** (§D).

**B3. Schudden/spanning bij het vangen (S).** Pokémon controleert 3-4 keer; de speler ziet de "schudden". Voor ons: touw schudt 1-3 keer (animatie in `castra-vscene.js`),
dat maakt de uitkomst zichtbaar spannend en ondersteunt de Latijnse uitroep (`Funis tenet!`).

**B4. Wilde-tabellen met vaste slotkansen en "repel" (S).** Pokémon kiest per gras-stap slot 0-11 met vaste percentages (20/20/10/10/10/10/5/5/4/4/1/1) en
een Repel-item stopt ontmoetingen met lagere levels. Ons `castraWildPick` is nu tier-gewogen (60/28/10/2) en dat werkt, maar vaste slottabellen per terrein
maken het **voorspelbaar en testbaar** en geven plek voor "zeldzame ontmoeting" (1%) en rondzwervende wezens (`castra-wanderers.js` doet dat deels al). Een
`Odor saeptum` (repel) is in de wereld een mooie item. Voorstel: eerst alleen repel + zeldzame slot, vaste tabellen later.

### C. Progressie

**C1. Vriendschap/fides (M).** Gen 2+: vriendschap stijgt door samen vechten, rusten, niet omvallen; beïnvloedt evolutie, een voltreffer-overleving en een
"terugkeer"-aanval. Hier past "fides" (trouw) goed: soldaten die lang meevochten evolueren eerder, helden hebben een band-niveau. Kan de bestaande
evolutieketens in `CASTRA_FORMS` (evoLevel) aanvullen met "evolueert bij fides ≥ X" en "evolueert 's nachts" (dayn bestaat).

**C2. EV-achtige training ("exercitatio") (M).** `indoles` zijn nu vast bij geboorte (0-15, zoals IV). Pokémon heeft daarnaast EV's: elke overwonnen vijand
geeft stat-punten in de stat waar hij goed in is. Past bij de campus (training bestaat al). Risico: balans en uitleg. Alleen doen als leerlingen ver komen.

**C3. Learnsets (M).** Pokémon: elke soort leert moves op vaste levels. Wij: type-signatuur op gradus 3 + gekozen artes. Voor de 151 vormen een
level-learnset (2-4 moves, gedeeld per tak/volk) maakt vormen onderscheidend en is datagedreven. Vereist A3 voor betekenis.

**C4. Tabulae (TM's) en tutors (M).** Eenmalige of herbruikbare "tabula" die een move leert. Past bij de bestaande skill-boom (`castra-skills.js`) en kan
verdiend worden via quests.

**C5. Eieren/breeding (L, later).** Alleen als er een sterk verhaal bij past (bv. mythologische wezens in een "nidus"). Niet voor nu.

### D. Wereld en content

**D1. Trainers met zichtlijn (S-M).** In Pokémon lopen trainers naar je toe zodra je in hun zichtlijn komt ("!"). Wij hebben trainers op de weg met
Latijnse vraag (`castra-train.js`). Zichtlijn en wandelend-naar-je-toe is goedkoop (tiles, geen nieuwe assets) en geeft sfeer.

**D2. Inventaris en eenvoudige winkel (M).** `CASTRA.items = { id: n }`, een winkel in het kamp, en gebruiksitems (genezing, vangmiddel, repel). Dit is
voorwaarde voor B2/B4/C4. Past bij het bestaande economie-systeem (aes/frumentum).

**D3. Dag/nacht uitbreiden (S).** Naast meer mythische vijanden 's nachts: evolutie bij nacht (C1), shop-openingstijden, specifieke wezens per fase.

**D4. Content-pipeline (M).** Dossier fase 4: JSON-schema en validatie. Wij hebben `tools/castra-sprites-manifest.js` en `gen_castra_flags.py`. Voorstel:
`tools/castra-validate.js` dat `CASTRA_FORMS`, moves, artes en helden controleert (verwijzingen bestaan, evolutieketens sluiten, geen dubbele ids,
vangkansen binnen bereik, sprites aanwezig). Eén vlag-test na elke wijziging, net als `node --check`.

### E. Opslag en tests

**E1. Versienummer en migraties (S).** `castra_save_v1_…` is alleen de sleutel. Voeg `CASTRA.ver` toe en een `CASTRA_MIGRATIONS[ver]`-tabel, zodat een nieuw
veld (status, element, fides) geen oude saves breekt. Nu migreert elke uitbreiding ad hoc (`CASTRA_LINES_LEGACY` bestaat al). **Aanbevolen vóór A3-C1.**

**E2. Groottebewaking (S).** De cloudopslag is 40.000 tekens. Met een contubernium van 8, barakken, helden en nieuwe velden (fides, EV's) kan dat dichtbij
komen. Voeg een `castraSaveSize()`-controle toe (waarschuw bij >80%) en comprimeer indien nodig (korte sleutels, geen afgeleide velden).

**E3. Gevechtstests uitbreiden (S).** Gebruik de dossier-lijst als testmatrix: speed ties, prioriteit, 0 PP, accuracy, stages, status, recoil, multi-hit,
afronden. Pokémon-referentie-uitkomsten alleen waar wij de formule bewust overnemen (A1).

## 4. Aanbevolen volgorde

> **Stand (2026-10-24):** stap 1-3 gebouwd (save-versie en tests, schadeformule met spreiding, gelijkspel en event-log, elementen, statussen en stages). Zie `CASTRA_HEROUM.md`, sectie "Gevechtsregels naar Pokémon". Stap 4 en verder zijn nog open.

1. **E1** (save-versie) + **E3-basis** (tests), onzichtbaar, voorkomt schade later.
2. **A1 + A9** (formule, spreiding, ties, event-log): het gevecht voelt meteen levendiger; alles blijft binnen `castra-moves.js`.
3. **A3 + A4 + A5** (element/STAB, status, stages): de echte strategische diepte. Hierbij hoort een nieuwe handleidingssectie in `castra-faq.js`
   en bijwerken van `CASTRA_HEROUM.md`.
4. **B1 + B3** (vangkans per vorm, schudden): klein, direct merkbaar bij het vangen.
5. **D2 + B2 + B4** (inventaris, vangmiddelen, repel): economie en veldgevoel.
6. **C1 + C3 + D1 + D3** (fides, learnsets, trainerzicht, dag/nacht): inhoudelijke uitbreiding.
7. Laat **A2** (fysiek/speciaal), **C2** (EV), **C5** (eieren) en dubbelgevechten liggen tot er een duidelijke vraag naar is.

## 5. Beslissingen die ik van Gerben nodig heb (dossier §10F)

1. **Hoe diep mag het gevecht worden?** Alleen "voelt levendiger" (stap 2), of ook elementen/status/stages (stap 3)? Dat bepaalt of de leerling-FAQ en de
   handleiding fors groeien en of de bovenbouw/onderbouw het nog snapt.
2. **Elementen: ja of nee?** Mijn advies ja, met 6 elementen en dubbel type alleen voor mythische wezens en helden; de driehoek blijft als wapenklasse.
3. **Statusnamen:** zijn `vulnus/ustio/somnus/pavor` de woorden die je in de les wilt zien?
4. **Mag de nieuwe schadeformule de bestaande balans verschuiven?** Dan herijken we `castra-moves-test.js` en de TD-balans opnieuw.
5. **Voorwerpen (inventaris + winkel)**, ja of liever niet, omdat Castra al aes/frumentum en gebouwen heeft?

## 6. Wat expliciet niet wordt overgenomen

Geen Pokémon-namen, -sprites, -muziek, -kaarten of -tekst; geen letterlijke code uit de pret-repo's of Showdown; geen Mega/Z/Dynamax/Tera. We nemen alleen
**spelregels** (formules, volgorde, statusbegrippen) als inspiratie en schrijven ze in onze eigen vorm en tekst.
