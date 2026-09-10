# Persistent Total War — Masterplan (BETA — live voor leerlingen)

> **Status: Beta, live in het hoofdmenu.** Training Mode (§3) bestaat en werkt:
> leerlingen loggen in met hun bestaande profiel, oefenen thuis en bouwen
> daarmee direct mee aan het garnizoen/muur/toren van een provincie van hun
> beschaving (`certamen/training.js`). Er is ook een alleen-lezen, publiek
> toegankelijke veldtochtkaart voor leerlingen (`SCREENS.totalWarMap`,
> `certamen/totalwar.js`) met een legenda van welke klas welke beschaving
> speelt en een paar seizoensrecords (grootste rijk, meeste veroveringen,
> bloedigste veldslag, sterkste solo-speler, grootste bouwer). De veldtocht
> loopt als een genummerd, betiteld **seizoen** (`/totalwar/season`) dat de
> docent via de docentenweergave kan resetten voor een nieuw seizoen. Docenten
> hebben daarnaast een **echte, blijvende** veldtochtkaart (Firebase-schema,
> §4): klas↔beschaving-koppeling in het docentenportaal (§7.1), een live kaart
> i.p.v. een demo, en een "Val aan"-knop die een echt
> [Boss Battle](BOSS_BATTLE.md)-gevecht start met de garnizoenssterkte van de
> verdedigende provincie verrekend (§5.4/BOSS_BATTLE.md "Garnizoensformule").
> Zelf een belegering starten als leerling bestaat nog niet — dat bereidt de
> docent voor via de docentenweergave. Zie [§0](#0-wat-is-er-al-gebouwd-nu) voor
> de volledige, actuele stand.
>
> **Sinds 2026-09-09: multi-tenant.** Er is niet langer één gedeelde
> veldtocht — elke goedgekeurde docent kan zijn **eigen, onafhankelijke**
> Total War starten met eigen kaart, eigen klas↔beschaving-koppelingen, eigen
> seizoenen en eigen Hall of Fame. Overal hieronder waar nog "de" of "één
> gedeelde" veldtocht/kaart staat (§1, §4, §7.1, §7.3, §9.3, §9.5), lees:
> "de campagne van de betreffende docent" — zie [§9.7](#97-multi-tenant-elke-docent-zijn-eigen-campagne)
> voor het bijgewerkte datamodel en de precieze regels.
>
> **Wat NIET gebouwd is, ondanks dat §3/§5/§6/§9.2 hieronder het als een
> werkend systeem beschrijven**: Trainingspunten (TP) als een **besteedbare**
> valuta voor garnizoensupgrades. In werkelijkheid schrijft elk goed antwoord
> in Training Mode rechtstreeks (via `twAwardStructurePoints()`,
> `certamen/training.js`) naar `militiaPoints`/`wallPoints`/`towerPoints` op de
> provincie — geen los `trainingPoints`-saldo om te "kopen" mee, geen
> aankoopscherm, geen kostentabel. Garnizoenstiers volgen automatisch uit die
> puntentotalen (`twStructureTier()`, `certamen/totalwar.js`). Zie §3.2/§5.2
> voor het (nooit gebouwde) oorspronkelijke ontwerp.
>
> Dit document is de **enige bron van waarheid** voor Total War en vervangt
> alle eerdere schetsen (inclusief `Total War Plans.docx`, die nu verouderd en
> deels tegenstrijdig is met wat er al gebouwd is — zie
> [§0 Wat is er al gebouwd](#0-wat-is-er-al-gebouwd-nu) en
> [§9 Beslissingen die dit document vastlegt](#9-beslissingen-die-dit-document-vastlegt-en-waarom)).
> Zie ook [BOSS_BATTLE.md](BOSS_BATTLE.md) — het losstaande coöperatieve
> gevechtssysteem dat Total War gebruikt om aanvallen op te lossen, en
> [BATTLE_MODE.md](BATTLE_MODE.md) — de bestaande, ongewijzigde klas-vs-klas-modus.

---

## 0. Wat is er al gebouwd (nu)

Dit is niet aspiratief — dit bestaat vandaag in de repo en werkt:

| Onderdeel | Bestand | Status |
|---|---|---|
| Menutegel "🗺️ Total War" (BETA-badge) | `certamen/games.js` (`SCREENS.home`) | ✅ werkend — niet langer "Binnenkort" |
| **Training Mode** (thuis oefenen, §3) | `certamen/training.js` (`SCREENS.trainingMode`) | ✅ werkend — leerlingen oefenen woordjes, bouwen automatisch mee aan het garnizoen (zie de TP-waarschuwing hierboven voor het verschil met het oorspronkelijke §3.2-ontwerp) |
| **Formatieve hint bij een fout antwoord** | `certamen/training.js` (`trShowMissHint()`, aangeroepen vanuit `trAnswer()`) | ✅ werkend — toont naast de gemarkeerde juiste-antwoordknop ook de volledige vertaling (alle betekenissen uit `TR_POOL`, niet alleen de eerste die als keuzeoptie diende); zie `benchmark-toetsing/02-wat-overnemen.md` |
| **Publieke leerling-veldtochtkaart** (alleen-lezen) | `certamen/totalwar.js` (`SCREENS.totalWarMap`, `twStartLiveReadOnly`) | ✅ werkend — legenda klas↔beschaving + seizoensrecords |
| **Seizoenen + Hall of Fame** | `certamen/totalwar.js` (`/totalwar/season`, `TW_SEASON_TITLES`, `twStartNewSeason`, `SCREENS.totalWarHallOfFame`, §11) | ✅ werkend — docent kan een nieuw seizoen starten via de docentenweergave; het seizoensnummer bij zo'n reset is sinds 2026-09-07 een bewerkbaar promptveld (voorgesteld = huidig+1) i.p.v. altijd blind +1, zodat een verkeerd genummerd testseizoen bij de volgende reset gecorrigeerd kan worden. Elke reset archiveert het afgesloten seizoen sindsdien eerst naar `/totalwar/history/{nummer}` (eindkaart, winnaar, hoogtepunten) — publiek te bekijken via de nieuwe Hall of Fame (§11), niets gaat meer verloren |
| Publiek uitlegscherm — **live** kaart (niet langer een demo) | `certamen/totalwar.js` (`SCREENS.totalWar`) | ✅ werkend — toont sinds 2026-09-07 de echte, live veldtochtkaart van het huidige seizoen (`twLoadMap(true,true,false)`, alleen-lezen net als `SCREENS.totalWarMap`) met seizoensnaam/-nummer erboven (`#twSeasonBox`, `twLoadSeasonAndStats()`), i.p.v. de statische `TW_DEMO_OWN`/`TW_DEMO_DEF`-voorbeeldstand die dit scherm eerder toonde |
| Docent-kaart: **echte, blijvende veldtocht** i.p.v. demo-voorbeeld | `certamen/totalwar.js` (`SCREENS.totalWarPreview`, `twStartLive`, `twApplyLive`) | ✅ werkend — live Firebase-listener op `/totalwar/provinces`, geen hardcoded stand meer |
| **Echte, geometrisch accurate SVG-kaart van het Romeinse Rijk (Trajanus)** | `certamen/map/provinces.svg` | ✅ werkend — **46 aanklikbare provincies**, elk met stabiele `id` (bv. `italia`, `baetica`, `gallia_belgica`) |
| Provincieregister (naam, steden+tags, buren, zeeroutes, bonus) | `certamen/map/provinces.json` | ✅ werkend — alle 46 provincies hebben 1-3 historische steden (met sfeertag) én een `bonus`-veld (§3.4 afgerond, zie §3.5 hieronder voor het mechanisme) |
| **Echte mechanische provinciebonus** | `certamen/training.js` (`trProvinceBonusMult`) | ✅ werkend — bezit je een provincie, dan bouwt Training Mode er één specifiek spoor 20-25% sneller (zie §3.5) |
| **Zeeroutes zichtbaar op de kaart** | `certamen/map/provinces.js` (`MapAPI.drawSeaRoutes`) | ✅ werkend — blauwe stippellijn tussen de zwaartepunten van elk `seaRoutes`-paar, berekend via `getScreenCTM()` (niet `getBBox()`, want meerdere provincie-paths hebben een eigen `transform`-attribuut) |
| Provincie-CSS (neutraal/hover/selected/enemy/ally) | `certamen/map/provinces.css` | ✅ werkend |
| JS-helper om provincies te kleuren/muteren | `certamen/map/provinces.js` (`MapAPI`) | ✅ werkend: `setProvinceOwner`, `setProvinceDefense`, `setProvinceBonus`, `highlightProvince`, `resetProvince`, `drawSeaRoutes` |
| **Firebase-schema + eenmalige campagne-seed** | `certamen/totalwar.js` (`twEnsureCampaignSeeded`) | ✅ werkend — `/totalwar/provinces/{id}` + `/totalwar/civs/{civId}`, idempotent (zie §4, met de `klasCivs`-omkering uit §9.5) |
| **Klas↔beschaving-koppeling (docentenportaal + Total War zelf)** | `certamen/games.js` (`tpAssignKlasCiv`/`tpLoadKlasCivs`, paneel in `SCREENS.teacherPortal` én in `SCREENS.totalWarPreview`, `certamen/totalwar.js`) | ✅ werkend — schrijft naar `/totalwar/klasCivs/{klascode}`, gevalideerd tegen bestaande Battle Mode-klascodes. Sinds 2026-09-07 staat exact hetzelfde koppelpaneel ook op de docent-veldtochtkaart zelf (niet langer alleen in het docentenportaal) |
| **Aanvalsflow + garnizoensformule** | `certamen/totalwar.js` (`twStartAttack`) + `certamen/battle.js` (`bmStartBossGame`, `bmResolve`/`twResolveSiege`) | ✅ werkend — "Val aan"-knop op de kaart start een Boss Battle met muren/torens als extra boss-HP en slijtageschade per spoor (`siege.stageDamage.{militia,walls,towers}`, zie §5.4 — **niet** het platte `damageTaken`-veld dat §4/§5.4 hieronder nog beschrijven); winst/verlies schrijft terug naar de provincie. Garnizoens-HP schaalt sinds 2026-09-09 mee met het aantal aanvallende spelers, net als een gewone Boss Battle (§5.4.1) |
| **Slijtageslag-reparatie** | `certamen/training.js` (`twRepairStageDamage`, aangeroepen vanuit `trAnswer()`) | ✅ werkend — trainen op het doorbroken spoor verlaagt `siege.stageDamage` automatisch mee, zie §5.4 |
| **8**-facties-tabel + thuislanden (seed-data) | `certamen/totalwar.js` (`TW_CIVS`, `TW_HOME_PROVINCES`) | ✅ werkend — **niet** 7: naast de 7 uit §2 bestaat ook `britanni` (Britten, thuisprovincie `britannia`) al in de seed-data, zie de correctie bij §2 hieronder |
| Voorbeeld-eigendom/verdediging voor de **publieke** demo-kaart | `certamen/totalwar.js` (`TW_DEMO_OWN`, `TW_DEMO_DEF`) | ✅ blijft bestaan, uitsluitend voor `SCREENS.totalWar` (niet-docenten) — inclusief één "betwist"-voorbeeld (`TW_DEMO_CONTESTED`, Raetia) |
| **Stadsmarkers** (110 steden, geometrisch geverifieerd) | `certamen/map/provinces.js` (`MapAPI.drawCityMarkers`) + `provinces.json` (`cities[].x`/`y`) | ✅ werkend — zie §5.3 voor hoe de coördinaten tot stand kwamen; nog geen eigendom per stad |
| **Historisch lesje per stad**, ontgrendeld bij verovering | `certamen/training.js` (`trProvinceOverviewHTML`, "Bekijk je gebied") + `provinces.json` (`cities[].history`) | ✅ werkend — alle 110 steden, alleen zichtbaar voor provincies die de eigen beschaving bezit |

**Belangrijk over de kaart:** dit is de **echte** Romeinse-provinciekaart (zie
de projectgeschiedenis: de originele Wikimedia-SVG is schoongemaakt en elke
provincie is met de bestaande geometrie 1-op-1 geïdentificeerd — er is niets
herontworpen of vereenvoudigd). De kaart toont **uitsluitend het grondgebied
van het Trajaanse Romeinse Rijk** — gebieden als Germania Magna, Perzië/Parthia
en Sarmatia bestaan op de kaart als niet-klikbare achtergrond (cream), *niet*
als eigen provincies. Dit heeft directe gevolgen voor de factie-indeling in §2
— zie de expliciete beslissing daarover in §9.1.

Twee kleine, technisch bekende bijzonderheden (niet blokkerend):
- De drie kleinste Alpenprovincies (`alpes_poeninae`, `alpes_cottiae`,
  `alpes_maritimae`) liggen visueel onder Italia in de brondata, maar staan
  ook ná Italia in de SVG-documentvolgorde — getest (2026-07-07) en een klik
  op elk van de drie selecteert daadwerkelijk zichzelf, niet Italia. Het
  eerder genoemde probleem is dus niet (meer) reproduceerbaar; geen fix nodig.
- `cyprus` bestaat uit twee samenvallende SVG-paden (`cyprus`/`cyprus_2`),
  al correct als één provincie behandeld door `MapAPI`.

---

## 1. Kernidee

Een **derde spelmodus** naast Battle Mode (klas-vs-klas, één les) en de losse
oefenspellen. Total War is een **doorlopende veldtocht** over weken/maanden:

- Elke klas hoort blijvend bij één **beschaving** (bv. G3A → Grieken,
  V4 Latijn → Galliërs). De koppeling klas↔beschaving wordt door de docent
  gemaakt (zie §7.4) en verandert nooit vanzelf.
- Alle beschavingen strijden op **één gedeelde kaart** (§0), niet op aparte
  instanties.
- Beschavingen breiden uit door **provincies** te veroveren en te verdedigen.
  Niets reset na een les.
- Een aanval wordt **in de les, geleid door de docent** opgelost als een
  coöperatief [Boss Battle](BOSS_BATTLE.md)-gevecht tegen het AI-garnizoen van
  de tegenstander — nooit als live PvP tussen twee klassen tegelijk (dat kan
  roostertechnisch niet).
- Tussen lessen door **trainen leerlingen thuis solo** (§3): dat oefenen
  versterkt het garnizoen van hun beschaving én levert persoonlijke XP op.

### 1.1 De twee lagen, samengevat

```
┌─────────────────────────────────────────────────────────────┐
│  THUIS (solo, asynchroon)          IN DE LES (docent-geleid) │
│  ────────────────────────          ─────────────────────────│
│  Training Mode (§3)          →     Boss Battle (BOSS_BATTLE.md)│
│  = quiz + avatar valt          =   klas vs AI-garnizoen van   │
│    trainingspop/bouwt muur         een aangrenzende provincie │
│  = geeft Trainingspunten (TP)      = wint → provincie/stad    │
│    aan het garnizoen van de klas     verovert, of muren breken│
│  = geeft ook persoonlijke XP         (zie §5, "slijtageslag") │
│    (zelfde gedeelde profiel-xp                                │
│    als de rest van de app)                                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Facties & thuislanden

**8 facties** (dit document begon als een 7-facties-plan, zie §9.1 — `britanni`
is er ná dat plan alsnog bijgekomen en staat al in de echte seed-data,
`TW_CIVS`/`TW_HOME_PROVINCES` in `certamen/totalwar.js`), elk met een
thuisland dat **volledig binnen de bestaande 46-provinciekaart** ligt (zie
§9.1 voor waarom dat een bewuste, afgedwongen keuze is t.o.v. het originele
docx-plan).

> ⚠️ **Balanswijziging (2026-09-07, op verzoek, bij het starten van het
> echte Seizoen 1).** Elke factie startte oorspronkelijk met 1–5 thuis­
> provincies (tabel hieronder toonde dat als "Thuisprovincie(s)"). Dat gaf
> grotere thuislanden (Rome, Perzen) een structurele voorsprong t.o.v.
> kleinere (Britten, die toen al maar 1 hadden). Nu start **elke factie met
> precies 1 basisprovincie** — altijd haar eigen vlaggenschip/hoofdstad
> (§3.7, `twHomeFlagshipOf()`) — en bouwt de rest van haar rijk net als
> ieder ander zelf op vanaf de neutrale kaart. `TW_HOME_PROVINCES`
> (`certamen/totalwar.js`) is hierop aangepast; zowel de eenmalige
> campagne-seed (`twEnsureCampaignSeeded()`) als elke latere
> seizoensreset (`twStartNewSeason()`) gebruiken deze ene bron, dus beide
> zijn automatisch meeveranderd.

| Factie (`civId`) | Kleur | Basisprovincie op de echte kaart |
|---|---|---|
| `roma` (Romeinen) | `#a8261a` | `italia` |
| `gallii` (Galliërs) | `#3f7d3a` | `gallia_lugdunensis` |
| `germani` (Germanen) *(nieuw t.o.v. huidige demo)* | `#4a2c11` | `germania_inferior` |
| `athenae` (Grieken) | `#2e6fb0` | `achaea` |
| `persae` (Perzen) | `#8a4fb0` | `syria` |
| `carthago` (Carthagers) *(nieuw)* | `#550088` | `africa_proconsularis` |
| `aegyptii` (Egyptenaren) *(nieuw)* | `#e67e22` | `aegyptus` |
| `britanni` (Britten) | `#1f8a8a` | `britannia` |
| `neutral` | `#dfd5c6` (perkament) | de rest — zie §2.1 |

Elke basisprovincie hierboven is toevallig ook precies het vlaggenschip/
hoofdstad van die factie (§3.7) — dat was al zo bij het origineel-ontworpen
thuisland en is dus geen nieuwe koppeling, alleen zijn de vier andere
thuisprovincies van bv. Rome (Sicilia/Sardinia/Corsica/Dalmatia) nu gewoon
onderdeel van de neutrale bufferzone (§2.1) geworden.

### 2.1 Neutrale bufferprovincies (bij campagnestart)

Alle overige **38** provincies starten **neutraal** (AI-bezet, zwak) en zijn
de eerste veroveringsdoelen:

`alpes_cottiae`, `alpes_maritimae`, `alpes_poeninae`, `arabia`, `armenia`,
`asia`, `baetica`, `baleares`, `bithynia_et_pontus`, `cappadocia`, `cilicia`,
`corsica`, `creta_et_cyrene`, `cyprus`, `dacia`, `dalmatia`, `galatia`,
`gallia_aquitania`, `gallia_belgica`, `gallia_narbonensis`,
`germania_superior`, `judea`, `lusitania`, `lycia_et_pamphylia`,
`macedonia`, `mauretania_caesariensis`, `mauretania_tingitana`,
`mesopotamia`, `moesia_inferior`, `moesia_superior`, `noricum`,
`pannonia_inferior`, `pannonia_superior`, `raetia`, `sardinia`, `sicilia`,
`tarraconensis`, `thracia`.

Dit geeft elke factie meerdere direct aangrenzende neutrale provincies om
vroeg in het schooljaar te veroveren zonder meteen buurfacties te raken —
hetzelfde "bufferzone"-principe uit het originele docx-plan, nu toegepast op
de echte geometrie, maar met een grotere buffer dan het eerdere ontwerp (elke
oorspronkelijke "extra" thuisprovincie is nu zelf ook gewoon buffergebied).

---

## 3. Training Mode (thuis oefenen)

Een nieuw, solo scherm — **geen klascode nodig om te starten**, wel gekoppeld
aan het bestaande gedeelde profiel (zie §6) zodra de leerling die heeft.

### 3.1 Wat het is

- Woordjes-quiz (hergebruikt de bestaande vocab-poolopbouw uit `core.js`,
  dezelfde aanpak als Snelvuur in `games.js`), maar met de eigen SV-avatar
  zichtbaar in beeld.
- Bij elk **goed antwoord**: de avatar speelt een aanvalsmotion af
  (`BattleMotion.play(el, "swing")` — **hergebruik de motion state machine uit
  `certamen/battle-motion.js`**, niet een losse CSS-classtoggle zoals het
  originele docx-voorbeeld suggereerde; die machine bestaat inmiddels en is
  precies hiervoor generiek/herbruikbaar gebouwd).
- Twee visuele varianten (docent- of leerling-instelbaar, of willekeurig):
  1. **Gevechtstraining** — avatar slaat een trainingspop (`training_dummy.png`,
     staat al in `certamen/assets/sprites/`).
  2. **Bouwanimatie** — avatar "bouwt" (hamer-motion; kan `"swing"` hergebruiken
     met een ander wapen-sprite) de verdedigingswerken van de eigen provincie
     op, in stadia die oplopen met `walls` (§4/§5.2): eerst een fort
     (`assets/bosses/fort.png`), dan verschijnt daarvoor een palissade
     (`assets/bosses/Palissade.png`), die bij een hoger `walls`-niveau overgaat
     in een stenen muur (`assets/bosses/wall.png`) — alle drie de sprites zijn
     al aanwezig. Puur visueel, geen eigen
     opslag nodig — de trap wordt afgeleid van de al bestaande `walls`-waarde.
- Fout antwoord: geen Trainingspunten, gewoon door naar de volgende vraag
  (geen bestraffing, consistent met de rest van de app se toon).

### 3.2 Beloning: Trainingspunten (TP) — een NIEUW, apart, collectief veld

> ⚠️ **Ontwerp, niet (zo) gebouwd.** De echte implementatie heeft geen los
> `trainingPoints`-saldo dat je apart "verdient" en later "besteedt" — elk
> goed antwoord schrijft direct door naar `militiaPoints`/`wallPoints`/
> `towerPoints` op de provincie (`twAwardStructurePoints()`, `certamen/
> training.js`), en de garnizoenstier volgt automatisch uit dat lopende
> totaal (`twStructureTier()`, `certamen/totalwar.js`) — geen aankoopstap,
> geen §5.2-kostentabel. Het `civs/{civId}.trainingPoints`-veld uit §4/§9.5
> bestaat nog wel in het schema maar staat er als `// legacy, ongebruikt`
> (zie code-commentaar in `twEnsureCampaignSeeded()`). De rest van deze
> sectie (het **collectief**-principe, geen streak-multipliers, gescheiden
> van coins/XP) klopt nog wel als *bedoeling* — alleen het
> "besteedbaar-aan-upgrades"-deel is niet gebouwd.

Dit is een bewuste, expliciete architectuurbeslissing (zie §9.2 voor de
volledige motivatie): **TP is géén synoniem voor coins of XP.** TP:

- wordt toegekend **per goed antwoord** in Training Mode (bv. **+5 TP**,
  zonder de "steeds sneller oplopen"-val die we al eerder in Battle Mode
  hebben gecorrigeerd voor munten — houd het bewust laag en vlak, geen
  streak-vermenigvuldigers die de economie laten exploderen);
- gaat **niet** naar het persoonlijke leerling-profiel, maar direct naar het
  **garnizoen van de beschaving van de leerling se klas** (§4) — TP is een
  *collectief* budget, geen persoonlijk bezit;
- wordt **uitsluitend** besteed aan garnizoensupgrades (§5.2), nooit aan
  avatar-cosmetica (dat blijft `coins`/denarii/drachmae, ongewijzigd).

### 3.3 Wat WEL hetzelfde blijft (bestaand systeem, ongewijzigd)

- **XP**: elk goed antwoord in Training Mode geeft ook gewoon `addXP(n)` —
  dezelfde gedeelde, cross-device-gesynchroniseerde profiel-XP als de rest van
  de app (zie `certamen/core.js`: `syncXpDelta`/`syncProfileFromCloud`,
  gebouwd en geverifieerd eerder deze sessie). Geen nieuwe synclogica nodig.
- **Mastery**: Training Mode raakt `classHistory`/mastery **niet** aan. Dat
  blijft, exact zoals het nu al werkt, uitsluitend opgebouwd via echte Battle
  Mode-gevechten (`bmAwardBattle` in `battle.js`). Dit was al zo — het docx-
  principe "mastery alleen in de klas" is dus al een bestaande invariant, geen
  nieuw te bouwen regel.

### 3.4 Stedencatalogus (afgerond 2026-07-07)

`provinces.json` heeft nu voor alle 46 provincies 1-3 historisch onderbouwde
steden (`cities: [{name, tag}]`), bv. Capua → `italia`, Carthago Nova →
`tarraconensis`, Byzantium → `thracia` (niet `bithynia_et_pontus` — Byzantium
lag historisch aan de Europese/Thracische kant van de Bosporus), Memphis/Thebae
→ `aegyptus`, Antiochia/Palmyra/Damascus → `syria`, Caesarea Maritima/Hierosolyma
→ `judea`. `tag` is puur sfeer/informatief (geen eigen mechanisch effect — er is
geen eigendom per stad, zie §5.3), zichtbaar in het provincie-infopaneel
(`twProvinceInfo()` in `totalwar.js`).

### 3.5 Echte mechanische provinciebonus (nieuw, 2026-07-07)

Elke provincie heeft nu ook een `bonus: {track, pct, label}`-veld — GEEN
sfeertekst maar een écht spelmechanisch effect: zolang een beschaving deze
provincie bezit, telt Training Mode punten voor het genoemde spoor
(`militia`/`walls`/`towers`) met `pct`% extra (standaard 20%, Aegyptus als
uitzondering 25% — "Graanschuur van het Rijk"), toegepast in `trAnswer()`
(`training.js`, via `trProvinceBonusMult()`) vóórdat de punten zowel naar
Firebase (`twAwardStructurePoints`) als naar de persoonlijke bijdrage
(`trTrackContribution`) geschreven worden — dus wat de leerling op het scherm
ziet, wat er in de provincie belandt, en wat er aan de leerling wordt
toegeschreven, zijn altijd hetzelfde (bonus-inclusieve) getal.

Het spoor per provincie is gekozen op basis van de historische specialiteit
(bv. legioensfortprovincies → `militia`, mijnbouw-/steengroeveprovincies →
`walls`, handels-/graanprovincies → `towers`) — zie `certamen/map/provinces.json`
voor de volledige tabel. Dit is bewust **provincie-niveau**, niet stad-niveau:
er bestaat geen eigendom per stad in het gebouwde systeem (zie §5.3), dus een
mechanisch effect per stad zou een nieuwe, grotere architectuurwijziging
vereisen (Firebase-schema voor stad-eigendom, SVG-stadsmarkers, "contested"-
visualisatie) — expliciet niet gebouwd, zie de open vraag daarover in §5.3.

`twEnsureRegistry()` (`totalwar.js`) haalt het register (incl. bonussen) op en
cachet het in `_twRegistry` — gedeeld door alle kaartschermen én door Training
Mode (dat zelf geen kaart laadt, maar de bonus wel moet kennen).

### 3.6 Provinciebonus telt ook mee tijdens de belegering zelf (nieuw, 2026-07-07)

Eerste uitbreiding van §3.5 richting "Rome: Total War"-achtige provincie-
specialisaties (RTS-inspiratie, expliciet gevraagd): de bonus is niet meer
uitsluitend een Training Mode-effect. `twStageMaxHP(gp, stageKey, N)`
(`totalwar.js`) berekent de boss-HP voor één belegeringsstage en verhoogt die
met hetzelfde `pct` als de bonus toevallig dát spoor betreft — dus een
provincie met een muur-bonus is niet alleen sneller te versterken, maar heeft
tijdens een aanval ook een `pct`% dikkere muur om doorheen te breken. Deze
functie vervangt de eerdere losse `TW_STAGE_HP[tier]||TW_STAGE_HP[1]`-opzoek
op **beide** plekken waar dat gebeurde: de aanvalsstart
(`bmStartBossGame()`) én de overgang naar de volgende stage
(`bmResolve()`) — bewust op één plek gehouden, anders zou een van de twee
per ongeluk zonder bonus kunnen komen te zitten.

> ⚠️ **`N`-parameter toegevoegd (2026-09-09), zie §5.4.1** — de bonus is nog
> steeds een percentage, maar dat percentage werkt sindsdien op een
> klasgrootte-geschaalde basis-HP in plaats van een vast getal.

### 3.7 Vlaggenschipprovincies — rijksbrede, niet-stapelende beloning (nieuw, 2026-07-07)

De Crusader Kings-route uit §3.6 (unieke-gebouw-achtige rijksbrede bonus) is
alsnog gebouwd, maar bewust **niet** als extra bouw-/siegekracht — dat zou
grote rijken alleen maar onverslaanbaar maken (expliciet besproken:
"anders blijven we alleen maar bonussen stacken en kunnen grote rijken nooit
meer verslagen worden"). In plaats daarvan geven de 11 **vlaggenschip­
provincies** (`provinces.json`: `"flagship":{title,history}`) — de 8
hoofdsteden (Italia/Rome, Gallia Lugdunensis/Lugdunum, Germania Inferior/
Colonia, Achaea/Athene, Syria/Antiochië, Africa Proconsularis/Carthago,
Aegyptus/Alexandrië, Britannia/Londinium) plus drie extra historisch cruciale
provincies (Dacia, Asia/Ephesus, Judea/Jeruzalem) — een vaste, **niet-
stapelende** beloning zodra een beschaving er minstens één **veroverd** (niet:
zomaar bezit) exemplaar van heeft:

- **+1 XP** per goed antwoord in Training Mode bovenop de normale 2
  (`TW_FLAGSHIP_XP_BONUS`, `totalwar.js`).
- Een **hogere dagcap** — 35 i.p.v. 25 volledige-snelheid-antwoorden per dag
  (`TW_FLAGSHIP_DAILY_CAP`).

Bezit van meerdere vlaggenschepen stapelt dit **niet** verder op (boolean
"heeft er minstens één", geen optelsom) — precies om het stapel-/snowball-
risico te vermijden. Geïmplementeerd in `trCivHasFlagship()`/`trAnswer()`
(`training.js`).

**Belangrijke correctie (2026-07-08, ná eerste implementatie):** de 8
hoofdstad-vlaggenschepen zijn tegelijk elke beschaving se eigen
`TW_HOME_PROVINCES`-startprovincie — zonder correctie zou dus élke
beschaving deze beloning al vanaf campagnestart hebben, zonder ooit iets
veroverd te hebben. Fix: `twHomeFlagshipOf(civId)` (`totalwar.js`) bepaalt
welk vlaggenschip een beschaving se EIGEN hoofdstad is, en die ene provincie
telt bewust **niet mee** — noch voor de XP-/dagcap-beloning
(`trCivHasFlagship()`), noch voor de twee eerbewijzen hieronder
(`trCheckFlagshipAchievements()`). Verlies je je eigen hoofdstad en verover
je die later terug, telt hij nog steeds niet mee (het blijft "je eigen
plek", geen prestatie). Elk ánder vlaggenschip — van een tegenstander, of een
van de drie neutrale Dacia/Asia/Judea — telt wél volledig, ook voor de
beschaving die het origineel bezat als het door iemand anders veroverd wordt
(bv. Italia telt gewoon mee voor de Galliërs, want dat is niet hún hoofdstad).

Daarnaast twee eenmalige eerbewijzen per (echt veroverd) vlaggenschip,
gedeeld door alle leerlingen van de beschaving (zelfde patroon als de
bestaande TW-eerbewijzen):
1. **Verovering** (`flagship_conquest_{id}`) — zodra de beschaving de
   provincie bezit (m.u.v. de eigen hoofdstad, zie boven).
2. **Legacy** (`flagship_legacy_{id}`) — zodra dat bezit `TW_FLAGSHIP_LEGACY_
   WEEKS` (4) weken **ononderbroken** heeft standgehouden. Gebaseerd op een
   nieuw Firebase-veld `totalwar/provinces/{id}/ownerSince`, gereset bij elke
   eigendomswissel (`twResolveSiege()`) en geïnitialiseerd bij het seeden van
   een (nieuw) seizoen (`twEnsureCampaignSeeded()`/`twStartNewSeason()` —
   inclusief backfill voor een veldtocht die al vóór dit veld bestond).
   Lazy check bij elke `trLoadOwnedProvinces()`-ververing
   (`trCheckFlagshipAchievements()`), zelfde patroon als
   `trCheckTWAchievements()`.

Elk vlaggenschip heeft ook een korte, echte **geschiedenisanekdote**
(`flagship.history`, 2-3 zinnen), altijd zichtbaar in het provincie-
infopaneel (`twProvinceInfo()`) — niet gekoppeld aan verovering, dus ook
bruikbaar als lesmateriaal bij het gewoon verkennen van de kaart.

`ACHIEVEMENTS_DEF` (core.js) kreeg er 22 items bij (11× verovering, 11×
Legacy), allemaal `cat:"totalwar"` — dat betekent dat de bestaande
"Legioensglans"-categoriebonus (§6, `achCategoryComplete()`) voor die
categorie nu automatisch al deze 22 nieuwe items meetelt, dus veel zwaarder
is geworden om te voltooien. Geen aparte code nodig, puur een gevolg van het
generieke, data-gedreven categoriesysteem.

Bewust (nog) **niet** gebouwd: cosmetische items (unieke sieraden/avatar-
onderdelen) gekoppeld aan vlaggenschipbezit — de gesprekspartner gaf aan dat
er nog geen geschikte sprites voor bestaan; latere uitbreiding.

### 3.8 Gespreide herhaling in Training Mode (nieuw, 2026-09-09)

**✅ Gebouwd, op verzoek — leerlingfeedback: hetzelfde woord kwam vaak
meteen achter elkaar terug.** Oorzaak: `trNextQuestion()` (`certamen/
training.js`) riep tot dan `makeQuestion(TR_POOL)` zónder gewicht aan —
puur uniform-random, in tegenstelling tot Vrij Oefenen (`certamen/
freepractice.js`), dat al langer `makeQuestion(FP_POOL, w=>2*(FP_WRONG_
COUNTS[w.la]||0))` gebruikt om fout beantwoorde woorden vaker terug te laten
komen.

Training Mode kreeg dezelfde behandeling, plus een tweede maatregel:

- **`TR_WRONG_COUNTS`** — zelfde gewichtsformule als Vrij Oefenen (2× het
  aantal keer fout, als extra gewicht bovenop elk woord se standaardkans),
  bijgehouden in `trAnswer()`.
- **`TR_RECENT_WORDS`** (nieuw t.o.v. het Vrij-Oefenen-patroon) — de laatste
  `TR_RECENT_WINDOW` (6) gevraagde woorden worden EERST uit de pool
  gefilterd (`trPersonalPool()`), vóórdat `makeQuestion()` een gewogen keus
  maakt. Dit lost specifiek het "twee keer meteen achter elkaar"-probleem
  op, wat een weightFn alleen niet kan: `pickWeighted()` (`core.js`) se
  gewicht is altijd minstens 1 (`1+Math.max(0,weightFn(w))`), dus een
  weightFn kan een woord nooit volledig uitsluiten — enkel vaker/minder vaak
  maken. Valt terug op de volle pool zodra uitsluiten 'm te klein zou maken,
  zodat een korte woordenlijst nooit vastloopt.

Beide zijn sessie-lokaal (gereset in `trStart()`), net als `FP_WRONG_
COUNTS` in Vrij Oefenen — geen Firebase-veld nodig, dit is puur
kortetermijnspreiding binnen één oefensessie, geen langetermijn-Leitner-
systeem (dat bestaat al wel, maar los, voor Boss Battle/Battle Mode:
`bmPersonalPool()` in `battle.js`, met een `due`-vervolgronde).

Bewust **niet** aangepast: de werkwoordsvormen-submodus
(`TR_DRAFT.source==="verbforms"`, `vfqMakeQuestion()`/`vfqMakeOntleedQuestion()`/
`vfqMakeTypedQuestion()`) heeft een eigen, apart poolsysteem — buiten scope
van deze fix, die zich richt op de gewone woordenschat-quiz (freq-lijst/
eigen lijst), waar de leerlingfeedback over ging.

---

## 4. Datamodel (Firebase RTDB) — vervangt `TW_DEMO_OWN`/`TW_DEMO_DEF`

Volgt exact de bestaande projectconventie (klein, plat, per-node
`.transaction()`/`.update()`, geen generieke "patch"-laag — zie
[BOSS_BATTLE.md §Technische correcties](BOSS_BATTLE.md#technische-correcties-tov-het-oorspronkelijke-docx-plan)
voor waarom dat afwijkt van het oorspronkelijke docx-voorstel).

> **Let op — dit schema-blok is het oorspronkelijke, aspiratieve ontwerp en
> deels achterhaald.** De echte, gebouwde velden staan in `twEnsureCampaignSeeded()`
> (`totalwar.js`): `militiaPoints`/`wallPoints`/`towerPoints` zijn continue
> puntentellers (geen 0-5/0-3-schaal), `ownerSince` (§3.7, nieuw) staat er ook
> bij, en er is **geen** `cities/{cityId}`-subboom — steden hebben geen eigen
> Firebase-eigendom (zie §5.3/§3.4). Dit blok hieronder laten we staan als
> historisch overzicht van het oorspronkelijke plan.

```
/totalwar/
  provinces/{provinceId}/
    owner            "neutral" | civId
    walls            1-5           // vervangt het huidige platte "defense"-getal
    towers           0-3
    militia           0-N
    damageTaken       0             // "slijtageslag": schade die blijft staan tussen twee siege-pogingen
    lastChanged       <timestamp>
    cities/{cityId}/
      owner           civId | null  // null = nog niet individueel veroverd (zie §5.3)
      bonus           <string, referentie naar bonus-catalogus>

  civs/{civId}/
    klascode          <verwijst naar de bestaande /klascodes/{klas}-namespace
                        die Battle Mode al gebruikt — NIET de docent-eigen
                        classId uit /teachers/{uid}/classes/, dat is een
                        ander, los systeem, zie §9.3>
    trainingPoints    <huidig collectief TP-saldo, alleen op te hogen door
                        Training Mode, alleen te verlagen door garnizoensaankopen>
    bonusesUnlocked   [ "pax_romana", ... ]   // afgeleide/vaste bonuslijst uit veroverde steden
```

`provinces.json` (statisch, bundel-bestand) blijft de **read-only** bron voor
naam/steden/bonus-tekst/buren; `/totalwar/provinces/{id}` in Firebase wordt de
**live, muteerbare** eigendoms-/verdedigingsstatus. `MapAPI.setProvinceOwner`
etc. (al gebouwd) blijven de aangewezen manier om de SVG te updaten zodra een
Firebase-listener een wijziging binnenkrijgt.

---

## 5. Veroveren & verdedigen

### 5.1 Neutraal gebied veroveren

Een klas valt een aangrenzende neutrale of vijandelijke provincie aan via een
[Boss Battle](BOSS_BATTLE.md) tegen het (zwakke, want ongetraind) AI-garnizoen.
Winst → provincie kleurt in de beschaving van de klas.

### 5.2 Garnizoen upgraden (met TP)

> ⚠️ **Ontwerp, niet gebouwd** — zie de waarschuwing bij §3.2. Er is geen
> aankoopscherm en geen kostentabel; `militiaPoints`/`wallPoints`/
> `towerPoints` lopen automatisch op met elk Training Mode-antwoord, zonder
> tussenstap. Onderstaande tabel was het oorspronkelijke ontwerp.

In het docent-/klas-dashboard van een eigen provincie kan het collectieve
TP-budget besteed worden aan, bijvoorbeeld:

| Upgrade | Kosten (TP, richtwaarde) | Effect |
|---|---|---|
| Muur-niveau +1 (max 5) | 100 | `+X` effectieve boss-HP bij verdediging, zie §5.4 |
| Toren bouwen (max 3) | 250 | `+X` boss-schild bij verdediging |
| Militie aanwerven | 60 | `+X` boss-HP, kleinere stap dan een muur |

Exacte getallen zijn een **balansvraag voor de implementatiesessie**, niet nu
al vastgelegd — de structuur (walls/towers/militia, elk met een plafond) ligt
wel vast, overgenomen uit het docx-garnizoensplan.

### 5.3 Provincie vs. stad-eigendom

> ⚠️ **"Contested" is inmiddels ANDERS gedefinieerd en gebouwd dan hieronder
> beschreven.** Het oorspronkelijke docx-plan bedoelde met "contested" een
> provincie met **gemengd stedenbezit** (steden verdeeld over ≥2 facties) —
> dat vereist stad-niveau-eigendom en is nog steeds **niet gebouwd** (zie
> onder). In de praktijk bleek een andere, simpelere definitie nuttiger en
> sloot bovendien al aan op bestaande data: **een provincie is "betwist"
> zodra een belegering er schade heeft achtergelaten zonder de provincie te
> veroveren** (`siege.lastStage`/`siege.stageDamage`, zie §5.4) — verzwakt,
> maar niet (meer) van de verdediger afgepakt. Volledig gerepareerd
> (`stageDamage` terug op 0, zie de slijtageslag-reparatie in §5.4) betekent
> niet meer betwist.
>
> **✅ Gebouwd** (deze herdefinitie): `twResolveSiege()` (`certamen/
> totalwar.js`) schrijft er `siege/attackerCivId` bij zodra een aanval faalt.
> `twApplyLive()` kiest per provincie tussen `MapAPI.setProvinceOwner()`
> (effen kleur) en het nieuwe `MapAPI.setProvinceContested(id, ownerColor,
> attackerColor)` (`certamen/map/provinces.js`) — een diagonaal gestreept SVG
> `<pattern>` in de kleuren van eigenaar én aanvaller, gezet via dezelfde
> `--province-fill`-CSS-variabele als een normale eigenaarskleur (een losse
> `.contested`-klasse geeft er bovendien een goudkleurige randnadruk aan,
> `certamen/map/provinces.css`). **Correctie op het origineel-voorgestelde
> "CSS `repeating-linear-gradient` als `background`"**: dat werkt niet op een
> SVG-`<path>`'s `fill` — een `<pattern>`-element in `<defs>` met
> `fill="url(#...)"` is de juiste SVG-techniek. `twProvinceInfo()` en
> `twLegend()` tonen de betwiste status ook in tekst (wie doorbrak, hoeveel
> schade, en een teller "⚔ N betwist gebieden").

Een provincie is pas **volledig** veroverd (en geeft de volle
provinciebonus) als **alle steden erin** zijn ingenomen — **stad-niveau-
eigendom zelf is nog steeds niet gebouwd** (geen los aanklikbare/kleurbare
steden, geen "gemengd bezit"-logica). Wel gebouwd, als eerste bouwsteen
daarvoor:

- **✅ Stadsmarkers (visueel, zonder eigendom).** Alle 110 steden uit
  `provinces.json` (`cities[].name`/`tag`) hebben nu een `x`/`y`-coördinaat
  gekregen en worden getoond als kleine stipjes op de kaart, met de stadsnaam
  als hover-tooltip. Nieuwe `MapAPI.drawCityMarkers(registry, container)`
  (`certamen/map/provinces.js`), aangeroepen vanuit `twLoadMap()` (`certamen/
  totalwar.js`) op precies dezelfde plek als de bestaande
  `MapAPI.drawSeaRoutes()` — dus automatisch op alle drie de kaartschermen
  (docentkaart, publieke leerlingkaart, uitlegdemo).
  **Hoe de coördinaten tot stand kwamen** (belangrijk voor toekomstig
  onderhoud, bv. bij nieuwe steden): eerst een schatting per stad op basis van
  historische/geografische kennis (kust vs. binnenland, noord/zuid/oost/west
  binnen de provincie) t.o.v. elke provincie se gerenderde bounding box —
  daarna **objectief geverifieerd** met `SVGGeometryElement.isPointInFill()`
  tegen de echte, onregelmatige provincievorm (niet alleen de rechthoekige
  bounding box). Bij de eerste doorloop viel 43% van de steden (47/110)
  buiten de werkelijke kustlijn/grens — vooral kuststeden, want een
  rechthoekige bounding box dekt een grillige kustlijn slecht. Elk gemist
  punt is daarna automatisch verschoven naar het dichtstbijzijnde punt dat wél
  binnen de echte vorm valt (rasterzoektocht), met een tweede volledige
  verificatieronde erna: alle 110 steden liggen nu bevestigd binnen hun
  provincie. Een paar provincies (`germania_superior`, `raetia`, `dacia`, e.a.)
  bleken een eigen SVG-`transform`-matrix te hebben (brondata-artefact) — de
  eerste verificatiepoging hield daar geen rekening mee en faalde daardoor
  systematisch; opgelost door bij `isPointInFill()` eerst de inverse van de
  eigen transform van het path toe te passen.
  **Update — 36 steden gecorrigeerd tegen de originele cartografie.**
  `provinces.svg` bleek zelf al 41 stadslabels te bevatten (de bronkaart,
  "Wikimedia Roman provinces Trajan", had per provincie al de hoofdstad
  gelabeld) — dat was bij het bouwen niet opgemerkt. Voor 36 daarvan kon een
  eenduidige naam-match gevonden worden met `provinces.json` (5 hadden een
  afwijkende spelling in de bronkaart, bv. "Mogantiacum" i.p.v.
  "Mogontiacum" — opgevangen met een alias-tabel; "Caesarea"/"Carthago" waren
  dubbelzinnig — 2 provincies delen die naam — en bewust overgeslagen).
  Vergelijking met mijn eigen schattingen gaf een gemiddelde afwijking van
  ~6.500 eenheden (op een provincie-breedte van 10.000–30.000), met
  uitschieters tot 17.000 (Thessalonica) — allemaal nog wel binnen de juiste
  provincie (dat werd al geverifieerd), maar duidelijk niet altijd op de
  juiste plek daarbinnen. De bronkaart-positie is overgenomen als de
  betrouwbaardere bron. **Kanttekening bij de tekstlabel-positie zelf**: een
  cartografisch label staat vaak verschoven naast het eigenlijke punt (voor
  leesbaarheid) — rechtstreeks overnemen zette 23 van de 36 juist weer
  *buiten* de provincievorm. Eindoplossing: de labelpositie als richting
  gebruikt, gesnapt naar het dichtstbijzijnde punt binnen de echte vorm
  (dezelfde rastertechniek als bij de eerste plaatsingsronde). Na deze
  correctieronde: alle 110 opnieuw volledig geverifieerd met
  `isPointInFill()`.
  **Overgebleven kanttekening**: voor de andere 74 steden (geen label in de
  bronkaart) blijft de plaatsing een geometrisch geverifieerde, maar niet
  op-een-screenshot-gecontroleerde schatting — zie het gewoon zelf op de
  kaart en meld afwijkingen; de coördinaten staan gewoon als `x`/`y` per stad
  in `provinces.json` en zijn vrij aan te passen.
- **✅ Historisch lesje per stad, ontgrendeld bij verovering.** Elke stad
  heeft nu ook een `history`-veld (2 zinnen, Nederlands) in `provinces.json`.
  Zichtbaar in **"Bekijk je gebied"** (`SCREENS.trainingGarrison`,
  `trProvinceOverviewHTML()` in `certamen/training.js`) — een inklapbaar
  "📜 Geschiedenis"-blok per provinciekaart, met naam/sfeertag/lesje per stad.
  Bewust **niet** op de publieke kaart (`twProvinceInfo()`, waar iedereen elke
  provincie kan bekijken): "Bekijk je gebied" toont uitsluitend
  `TR_OWNED_PROVINCES` (provincies van de eigen beschaving), dus de
  geschiedenis is impliciet — zonder extra ontgrendel-logica — pas leesbaar
  zodra de klas de provincie daadwerkelijk bezit. Geen aparte eigendomsstatus
  per stad nodig: de bestaande provincie-eigendom is de ontgrendel-voorwaarde.
- **Bewust beslist (2026-07-12, niet gebouwd): geen eigendom of mechanische
  bonussen per stad.** Individuele steden los aanklikbaar/kleurbaar maken met
  eigen eigendom (het oorspronkelijke stad-eigendomsconcept) én stadsbonussen
  bovenop de bestaande provinciebonus zijn overwogen en afgewezen — de
  historische lesjes per stad (hierboven) zijn genoeg, de mechanische bonus
  blijft op provincieniveau (§3.5). Dit is dus geen openstaand vervolgpunt
  meer maar een gesloten beslissing; alleen heropenen bij een expliciete
  nieuwe vraag daarover.
- **✅ Percentage-weergave per garnizoensspoor (nieuw, 2026-09-09).**
  `twProvinceInfo()` toonde per spoor (Fort/Muur/Garnizoen) alleen het kale
  tierlabel ("—"/"basis"/"volledig") — op verzoek, zodat andere klassen,
  leerlingen én de docent in één oogopslag zien welke provincies fanatiek
  verdedigd worden, laat `twTrackProgressLabel()` (`certamen/totalwar.js`,
  vlak vóór `twProvinceInfo()`) er nu twee losse percentages bij zien, allebei
  optioneel: (a) bouwvoortgang naar de eerstvolgende tier zolang een spoor nog
  niet "volledig" is (bv. `basis (50% naar volledig)`), en (b) resterend-HP%
  als dit precies het spoor is waar de laatste belegering strandde
  (`siege.lastStage`), bv. `basis (8% naar volledig) · ⚔ 13% HP`. Het
  resterend-HP% rekent tegen de HP bij de REFERENTIEklasgrootte
  (`TW_STAGE_HP_REF_N`/`TW_STAGE_HP`, §5.4.1) — niet tegen de toevallige
  klasgrootte van de laatste aanvaller, die dit informatieve paneel buiten
  een lopend gevecht om toch niet kent. Gedeeld door zowel de docentenkaart
  als de publieke/leerlingkaart (beide roepen dezelfde `twProvinceInfo()`
  aan), dus meteen overal zichtbaar.
- **✅ Garnizoensvisual uitvergroten met een klik (nieuw, 2026-09-10).**
  `twGarrisonVisualHTML()` (`certamen/totalwar.js`) accepteert nu een
  optionele `size`-parameter (default 128); de standaard, kleine versie is
  klikbaar (`cursor:zoom-in`) en opent via `twShowGarrisonZoom()` een 320px-
  versie in het generieke `#overlay`/`.modal`-mechanisme dat elders in de
  app al bestaat (zie `closeOverlay()`, `certamen/core.js`) — klikken op de
  vergrote afbeelding zelf sluit 'm weer. De vergrote versie roept
  `twGarrisonVisualHTML()` zelf aan met een expliciete `size`, en is
  daardoor bewust NIET zelf nogmaals klikbaar (`clickable = size<=128`) —
  anders zou dat een oneindige zoom-in-zoom-lus kunnen geven. Gedeeld door
  dezelfde twee plekken als de percentage-weergave hierboven
  (`twProvinceInfo()` én `SCREENS.trainingGarrison`, `training.js`), dus ook
  hier automatisch overal.
  **Aanvulling (2026-09-10):** een klik ERNAAST (overal op de donkere
  overlay, niet alleen op de afbeelding/tekst zelf) sluit 'm nu ook —
  `twShowGarrisonZoom()` zet daarvoor `ov.onclick` (op `#overlay` zelf, niet
  alleen op een innerlijke wrapper-div). `closeOverlay()` (`certamen/
  core.js`) is aangepast om die handler bij het sluiten weer op `null` te
  zetten, zodat een latere, ANDERE `#overlay`-gebruiker (bv. het marathon-
  podium in `games.js`, dat eigen knoppen heeft) dit klik-ernaast-gedrag
  niet per ongeluk overerft.
- **✅ Terreinachtergrond achter de garnizoensvisual (nieuw, 2026-09-10).**
  De visual had een effen witte achtergrond; op verzoek staat er nu een
  terreinafbeelding achter de sprites — `Grassland1.png` of `Desert1.png`
  (`certamen/assets/battlebacks/`, hergebruikt van de bestaande Boss
  Battle-veldslagdecors, zie `BATTLE_BACKGROUNDS` in `battle.js`), gekozen
  per provincie via een nieuw `"terrain"`-veld in `provinces.json` ("desert"
  op de 11 aride/woestijnprovincies — Aegyptus, Arabia, Africa
  Proconsularis, beide Mauretanies, Judea, Syria, Mesopotamia, Creta et
  Cyrene, Cappadocia, Galatia — ontbreekt het veld, dan "grassland", de
  overige 35). `twTerrainBg(provinceId)`/`twGarrisonVisualHTML()`
  (`certamen/totalwar.js`) lezen dit uit `_twRegistry`; `provinceId` is
  daarom als vierde, optionele parameter toegevoegd aan
  `twGarrisonVisualHTML()` (en doorgegeven aan `twShowGarrisonZoom()` voor
  de vergrote versie hierboven) — ontbreekt hij, dan blijft de originele
  effen witte achtergrond gelden. De interne cache-busting-versie op de
  `provinces.json`-fetch in `twEnsureRegistry()` moest hierbij ook omhoog
  (`?v=20260910a`) — anders zou een al bezocht toestel het nieuwe
  `terrain`-veld niet zien, los van de gewone script-cache-busting in
  `index.html`.
- **✅ Sprite-schaalcorrectie per tier (nieuw, 2026-09-10).** De boerderij
  (tier0-toren, `farm.png`) heeft van zichzelf weinig lege ruimte rondom het
  gebouw en oogde daardoor GROTER dan de wachttoren (tier1, `watchtower.png`)
  — terwijl die laatste juist de upgrade is, wat de progressie in de
  visual tegensprak. `TW_SPRITE_SCALE` (`certamen/totalwar.js`, naast
  `TW_STRUCTURES`) past dit puur cosmetisch aan via de inset in
  `twGarrisonVisualHTML()` (boerderij ×0,8, wachttoren ×1,15) — geen
  wijziging aan de bronafbeeldingen zelf nodig, en schaalt automatisch mee
  met elke `size` (dus ook de 320px-vergrote versie). Ontbrekende sprites in
  de tabel vallen terug op schaal 1 (ongewijzigd) — alleen deze twee sprites
  hadden dit probleem, geen algemene herschaling van alle garnizoensplaatjes.

### 5.4 De "slijtageslag" (meerdere-fasen-belegering)

> ⚠️ **Gebouwd, incl. reparatie — op één punt anders dan hieronder beschreven.**
> Het echte veld is `siege:{lastStage, stageDamage:{militia,walls,towers}}`
> (per spoor, niet één plat `damageTaken`-getal), geschreven met
> `Math.max(vorigeSchade, nieuweSchade)` in `twResolveSiege()` (`certamen/
> totalwar.js`) — schade stapelt dus op tussen pogingen (de eerste helft van
> "de twist" hieronder klopt). **Reparatie is inmiddels gebouwd**, maar
> automatisch i.p.v. via een aparte TP-besteding (consistent met de
> TP-filosofie hierboven — geen aankoopstap, zie §3.2/§9.2): `twRepairStageDamage()`
> (`certamen/training.js`) verlaagt `stageDamage[track]` met precies dezelfde
> puntenhoeveelheid als een goed antwoord normaal aan bouwpunten zou geven,
> zodra een leerling in Training Mode traint op exact het spoor dat
> `siege.lastStage` is — aangeroepen vanuit `trAnswer()`, direct naast de
> bestaande `twAwardStructurePoints()`-aanroep. Zichtbaar voor leerlingen via
> een melding in "Bekijk je gebied" (`trProvinceOverviewHTML()`) en op het
> trainingsscherm zelf (`trRenderModeBody()`, met een knop die direct naar het
> juiste spoor schakelt).

Een zwaar versterkte provincie (hoog `walls`/`towers`) mag nooit praktisch
onneembaar worden. Daarom:

- Boven een bepaalde garnizoenssterkte-drempel vereist verovering **twee
  aparte Boss Battle-pogingen** (twee losse lessen).
- **Poging 1** breekt de muren/toren af: schrijf de toegebrachte schade weg
  naar `damageTaken` op de provincie, ook bij niet-winnen.
- **Poging 2** (een volgende les) start met een boss-HP die al verlaagd is met
  `damageTaken` — nu wél te verslaan.
- **De twist (✅ gebouwd, zie waarschuwing hierboven voor het verschil met dit
  origineel-ontworpen mechanisme):** tussen de twee pogingen door kan de
  verdedigende klas via Training Mode `stageDamage` weer gedeeltelijk
  repareren — niet via een aparte TP-besteding met een vast bedrag per N TP,
  maar automatisch: elk goed antwoord op het doorbroken spoor repareert met
  dezelfde puntenhoeveelheid als het normaal aan bouwpunten zou opleveren.
  Dit is de bedoelde spanningsboog uit het oorspronkelijke plan, nu werkend.

De exacte boss-HP-formule die dit alles combineert met de bestaande
Boss Battle-schaling staat in
[BOSS_BATTLE.md §Garnizoensformule voor Total War-belegeringen](BOSS_BATTLE.md#garnizoensformule-voor-total-war-belegeringen)
— **let op**, die sectie beschrijft zelf ook al een verouderde tussenstap
(`walls*50+towers*20`, zie de eigen §9.6-waarschuwing daar); de écht actuele
formule staat hieronder in §5.4.1.

#### 5.4.1 Garnizoens-HP schaalt sinds 2026-09-09 mee met de aanvallende klasgrootte

**✅ Gebouwd, op verzoek — bug/gat t.o.v. Boss Battle gedicht.** Buiten een
belegering om schaalt een gewone Boss Battle altijd met het aantal
deelnemers (`bmStartBossGame()`: `bossMaxHP = N × 15 × 8 × Md`, zie
BOSS_BATTLE.md §2) — een klas van 4 heeft het net zo zwaar als een klas van
30, want beide vechten tegen een boss die in verhouding tot hun eigen
`klasMaxHP` (ook `N×100`) even sterk is. **Voor een Total War-belegering gold
dit tot 2026-09-09 niet:** `twStageMaxHP()` gaf een vast, absoluut getal
terug (`TW_STAGE_HP[tier]`, ongeacht wie er aanviel), terwijl de aanvallende
klas se eigen HP-balk (`klasMaxHP=N×100`) wél gewoon meeschaalde. Een kleine
klas kreeg zo een dubbel nadeel (kleinere eigen HP-balk tegen een even grote
garnizoens-HP als een grote klas), precies omgekeerd aan de bedoeling van
§7.4 hieronder.

Fix: `twStageMaxHP(gp, stageKey, N)` (`certamen/totalwar.js`) neemt nu ook
`N` (aantal spelers in de kamer op dat moment) en herschaalt de tier-HP
ernaar:

```
baseHp(tier)        = TW_STAGE_HP[tier]            // 300/800/1800, getuned voor TW_STAGE_HP_REF_N (20) spelers
schaaldeHp(tier, N)  = round(baseHp(tier) × N / TW_STAGE_HP_REF_N)
stageMaxHP           = schaaldeHp(tier, N) × (1 + bonus.pct/100)   // bonus ONVERANDERD, zie §3.6
```

Bij `N = TW_STAGE_HP_REF_N` (20) is dit exact hetzelfde getal als vóór de
oorspronkelijke N-schalingsfix — geen herbalancering voor een "gemiddelde"
klas, alleen voor klassen die daarvan afwijken. De provinciebonus (§3.6)
blijft precies zoals gevraagd een percentage van deze (nu variabele) basis
— geen los absoluut bedrag — en de verhouding tussen de tiers (dus
+166%/+125% per tier omhoog) blijft ook bij elke klasgrootte gelijk, want
die zit in `TW_STAGE_HP` zelf, niet in de N-schaling.

> ⚠️ **`TW_STAGE_HP` verdubbeld (2026-09-09, ná live-testen van de
> rondelimiet hierboven).** De oorspronkelijke waarden (150/400/900) waren,
> ook mét de rondelimiet, nog te laag: een onbewaakte provincie was in de
> praktijk in nog geen twee minuten veroverd. Op expliciet verzoek zijn
> **alle** tiers proportioneel opgeschaald — `TW_STAGE_HP = {0:300, 1:800,
> 2:1800}`, de verhouding (1 : 2,67 : 6) is bewust ongewijzigd. Richtwaarde,
> makkelijk verder bij te stellen; de rondelimiet (`TW_SIEGE_MAX_ROUNDS`,
> nog 20) is hierbij bewust niet meeverhoogd — een volledig gefortificeerde
> provincie (alle 3 sporen tier 2, dus 3×90=270 HP/speler bij N=20) triggert
> daardoor nu vaker een terugtrekking i.p.v. in één les te vallen, precies
> de bedoeling.

Beide aanroeppunten geven `N` mee: `bmStartBossGame()` (`certamen/battle.js`)
gebruikt `pids.length` bij de aanvalsstart, `bmResolve()` gebruikt
`Object.keys(players).length` bij de overgang naar de volgende
belegeringsstage (§5.4) — beide tellen dus de spelers die op dát moment in
de kamer zitten, niet een vast getal bij het begin van de hele belegering
(een late joiner tijdens stage 1 verhoogt dus ook de HP van stage 2/3, net
zoals een gewone Boss Battle evengoed door blijft schalen).

**Bewust ongewijzigd:** de moeilijkheidsgraad-multiplier `Md`
(`BM_META.bossDifficulty`, door `twStartAttack()` afgeleid uit de
garnizoenstiers) speelt al vóór deze fix geen rol in de belegerings-HP —
die wordt volledig vervangen door `twStageMaxHP()`, `Md` gold alleen voor de
generieke niet-belegerings-basisformule. Dat blijft zo; deze fix raakt alleen
de `N`-schaling, niet die bestaande asymmetrie (een apart, kleiner punt, niet
wat hier gevraagd was).

#### 5.4.2 Rondelimiet: een zwaar versterkte provincie moet écht meerdere lessen kosten

**✅ Gebouwd, op verzoek — het eigenlijke gat achter de vraag "is een
belegering wel moeilijk genoeg?".** Zelfs met §5.4.1's eerlijke HP-schaling
kon een klas een willekeurig zwaar versterkte provincie in principe toch in
één les stukbeuken: omdat alle spelers **tegelijk** (niet na elkaar)
antwoorden, hangt het aantal BENODIGDE rondes nauwelijks af van de
klasgrootte — alleen van hoeveel sporen (militie/muur/toren) verdedigd zijn.
Met genoeg rondes in één lange zitting viel dus, zonder externe begrenzing,
uiteindelijk elke provincie — precies tegengesteld aan wat §5.4 al beschreef
("mag nooit praktisch onneembaar worden", maar ook nooit *triviaal* in één
les).

Fix: `TW_SIEGE_MAX_ROUNDS` (`certamen/totalwar.js`, richtwaarde **20**, na
live testen bij te stellen) begrenst hoeveel rondes één belegeringspoging
mag duren. Wordt die limiet bereikt zonder dat de HUIDIGE stage gevallen is,
dan trekt de klas zich terug (`bmResolve()`, `certamen/battle.js`):

- **Geen overwinning**, maar ook bewust **geen nederlaag-framing** — de
  gebruiker wees expliciet "telt als verlies" af ten gunste van
  "terugtrekking, voortgang blijft staan". Mechanisch hergebruikt dit toch
  hetzelfde pad als een gewoon verlies (`winner:"B"` → `twResolveSiege()`'s
  bestaande else-tak, dus de tot dan toegebrachte schade blijft via de
  bestaande slijtageslag-reparatie (§5.4) gewoon staan) — alleen de
  WEERGAVE is anders: `state.timedOut:true` laat `SCREENS.battleResult`
  (leerling) en `bmNextAward()` (docent-award-ceremonie) een neutrale "⏳ De
  tijd is om — terugtrekking!" tonen in plaats van "Het Garnizoen wint!".
  `state.timedOut` wordt op het leerling-toestel apart opgehaald naast
  `state.winner` (zelfde smalle per-veld-ophaalpatroon dat `exactTie` al
  had — dat veld was al nooit op leerling-toestellen beschikbaar).
- **Zichtbaar tijdens het gevecht**: `bmBossStatusNote()`
  (`certamen/bossbattle.js`, docent-scherm/projectiescherm, net als de
  Cycloop-countdown) toont "⏳ Ronde N/20", met een waarschuwing in de
  laatste 5 rondes — zodat de klas de tijdsdruk voelt aankomen in plaats van
  verrast te worden door een plotselinge terugtrekking.
- **Alleen bij een belegering** (`BM_META.garrisonProvince` gezet) — een
  gewone, losse Boss Battle (mythologische baas) heeft geen rondelimiet en
  blijft ongewijzigd.

Bewust **niet** gebouwd: een instelbare limiet per provincie/docent — één
vaste constante is voorlopig genoeg, en makkelijk aan te passen zodra live
spelen laat zien dat 20 te streng of te soepel is.

**Live getest (2026-09-09) met een enkele, goedspelende aanvaller**, om de
rondelimiet te kalibreren tegen de verdubbelde `TW_STAGE_HP` (§5.4.1
hierboven):

| Scenario | Verloop | Uitkomst |
|---|---|---|
| Onbewaakt (tier 0 overal) | 4 rondes | Veroverd |
| Matig verdedigd (tier 1 overal, "normal") | stage 1 klaar ronde 8, stage 2 klaar ronde 17 | **Rondelimiet sloeg toe** bij ronde 20, midden in stage 3 — precies het scenario waar de limiet voor gebouwd is |
| Volledig verdedigd (tier 2 overal, "hard") | stage 1 nog niet eens klaar | **Klas verloor** (eigen HP op 0) bij ronde 16 — de rondelimiet kwam er niet eens aan te pas |

Conclusie: 20 hoeft niet aangepast — bij een gemiddeld verdedigde provincie
is dat precies het omslagpunt, bij een zwaar verdedigde grijpt het gewone
verlies-mechanisme al eerder in. Dat een volledig verdedigde provincie voor
één klas in de praktijk (bijna) onneembaar is, is bevestigd **bewust zo
gewenst** — "dat is precies de bedoeling", een echte topverdediging hoort
niet zomaar in één keer te vallen.

#### 5.4.3 Synergie-/brede-deelname-bonus proportioneel aan klasgrootte (nieuw, 2026-09-09)

**✅ Gebouwd, op verzoek — nog een klasgrootte-scheefheid ná de HP-fix.** Los
van de garnizoens-HP (§5.4.1) bleken twee bestaande Battle Mode-mechanics
zelf óók een structureel voordeel te geven aan grotere aanvallende klassen,
via VASTE koppentallen i.p.v. een percentage:

- **Synergiebonus** (`BM_SYNERGY`, `certamen/battle-data.js`,
  `bmCalcSynergy()` in `battle.js`): +2/+4/+6 BE per speler per ronde zodra
  het team ≥3/≥5/≥7 *unieke klassen* (Hopliet, Boogschutter, …) vertegen­
  woordigt. Een team van 4 spelers kan de tiers ≥5/≥7 nooit bereiken, hoe
  goed ze ook spelen — een harde plafond voor kleine klassen.
- **Brede-deelname-bonus** (`BM_CHAIN_BONUS`, `bmResolve()` in `battle.js`):
  een vlakke bonus van +3/+6 op de totale ronde-schade zodra ≥3/≥5
  *verschillende spelers* die ronde schade toebrachten. Ook dit is een
  absoluut koppental, geen percentage.

Beide drempels zijn eerlijk in gewoon Team-vs-Team Battle Mode (beide teams
komen uit dezelfde klas, profiteren dus evenveel) én in een gewone Boss
Battle (geen vergelijking met een kleinere/grotere tegenstander relevant).
Bij een Total War-belegering (klas vs NPC-garnizoen) is er echter geen
tegenteam dat evenredig meeprofiteert, dus gaven ze daar een ongevraagd
extra voordeel aan grotere klassen, bovenop de al bestaande lineaire
HP-schaling.

Fix: `twSiegeScaledThreshold(origMin, N)` (`certamen/totalwar.js`, vlak na
`twStageMaxHP()`) herschaalt zo'n drempel naar de daadwerkelijke teamgrootte
N met dezelfde `N/TW_STAGE_HP_REF_N`-regel als de garnizoens-HP — bij de
referentieklasgrootte (20) dus exact hetzelfde als voorheen. Alleen
toegepast wanneer `BM_META.garrisonProvince` gezet is (`bmCalcSynergy()`/de
brede-deelname-bonus in `bmResolve()`); gewoon Boss Battle/Team-vs-Team
gebruikt nog altijd de vaste tabelwaarden. Voor de synergiebonus is de
herschaalde drempel bovendien geklemd op maximaal 8 (`Math.min(8,…)`) — er
bestaan maar 8 klassen (`BM_CLASSES`), dus zonder die klem zou de hoogste
tier voor een GROTE klas juist andersom onbereikbaar worden (bij bv. N=40
zou de ongeklemde drempel 14 zijn).

Geverifieerd met een losstaande berekening: bij N=20 exact 3/5/7 en 5/3
(ongewijzigd); bij N=4 vallen alle drie synergietiers samen op drempel 1
(voor zo'n kleine klas is een gelaagde diversiteitsladder toch niet
zinvol te onderscheiden); bij N=40 blijft de synergiedrempel geklemd op
maximaal 8.

### 5.5 PvP alleen via gedeelde grenzen, altijd asynchroon

Ongewijzigd t.o.v. het eerdere ontwerp: een klas kan alleen een provincie
aanvallen die **grenst** aan een provincie die ze al bezitten (of via een
zeeweg verbonden is, zie §5.6). Omdat klassen nooit gelijktijdig spelen, is
elke aanval een Boss Battle tegen de *opgeslagen staat* van het garnizoen —
nooit een live wedstrijd tegen de andere klas.

### 5.6 Zeestraten (nieuw t.o.v. de vorige versie van dit document)

Uit het docx-plan overgenomen: sommige provincies zijn alleen via een
aangrenzende havenprovincie over zee bereikbaar (bv. Britannia is alleen vanuit
Gallië aan te vallen). Dit is een **eenvoudige aanvulling op de buren-lijst**
per provincie in `provinces.json` (een `seaRoutes: [...]`-array naast de
gewone, geometrisch-aangrenzende buren) — geen nieuwe systeemlaag.

Sinds 2026-07-07 ook **zichtbaar** op de kaart: `MapAPI.drawSeaRoutes()`
(`certamen/map/provinces.js`) tekent een blauwe stippellijn tussen elk
`seaRoutes`-paar, zodat een zee-verbinding niet langer alleen een onzichtbaar
databaseveld is. Bij die gelegenheid zijn ook twee ontbrekende, geografisch
voor de hand liggende routes toegevoegd: `gallia_narbonensis` ↔ `italia`
(Massilia-Ostia, langs de kust in plaats van over de Alpen) en `judea` ↔
`aegyptus` (Caesarea Maritima-Alexandria).

### 5.7 Rebellen: een volledig uitgeroeide beschaving verdwijnt niet (nieuw, 2026-07-08)

Verliest een beschaving écht al haar provincies (elke provincie is door
anderen veroverd), dan raakt ze niet uit het spel — ze wordt "rebellen" en
krijgt precies één weg terug: een **opstand** op haar eigen vlaggenschip­
provincie (haar oude hoofdstad, zie §3.7/`twHomeFlagshipOf()`), ongeacht wie
die nu bezet.

**Hergebruikt sinds 2026-09-07 voor ongebruikte volkeren, mét live
koppelen/ontkoppelen (niet pas bij de volgende seizoensreset).** Een volk
zonder gekoppelde klas (nog geen entry in `/totalwar/klasCivs`, zie §7.1)
krijgt bij het seeden/resetten (`twEnsureCampaignSeeded()`/
`twStartNewSeason()`) zijn basisprovincie helemaal niet toegewezen — die
blijft gewoon neutraal, precies zoals de rest van de kaart. Dat volk bezit
dus vanaf dag 1 al 0 provincies en is daarmee al "rebellen" in de zin van
dit hoofdstuk, zonder aparte "onbespeeld volk"-vlag.

Twee acties in het docentenportaal/de docent-veldtochtkaart (`tpAssignKlasCiv()`/
`tpUnassignKlasCiv()`, `certamen/games.js`) grijpen sindsdien ook **meteen**
in op de provincie-eigendom, in plaats van te wachten tot de volgende
seizoensreset:

- **Ontkoppelen** (`tpUnassignKlasCiv()` → `twReleaseCivIfUnassigned()`,
  `certamen/totalwar.js`): was dit de laatste klas van dat volk, dan gaan
  ALLE provincies die het volk op dat moment bezit terug naar neutraal —
  een onbespeeld volk mag nooit stilzwijgend gebied blijven vasthouden.
  Blijft er nog een andere klas aan hetzelfde volk gekoppeld, dan gebeurt
  er niets (dat volk speelt nog gewoon mee).
- **(Opnieuw) koppelen** (`tpAssignKlasCiv()` → `twGrantFreshFlagshipIfUnowned()`):
  staat de basisprovincie van dat volk nog **neutraal**, dan krijgt de klas
  'm meteen — geen opstand nodig, er is niemand om iets van terug te
  veroveren. Is die basisprovincie inmiddels door een **ander** volk
  veroverd (kan, want een niet-gekoppeld volk se basisprovincie is verder
  gewoon een normale neutrale provincie die een actieve buur kan innemen),
  dan grijpt dit expliciet **niet** in: de nieuwe klas begint dan als
  "verslagen" (0 provincies) en moet de bestaande opstandsflow hierboven
  gebruiken om haar eigen basisprovincie te heroveren — precies zoals elk
  ander tijdens de veldtocht uitgeroeid volk.

Bewust **geen nieuw Firebase-veld**: `twCivIsWiped(civId)` (`totalwar.js`)
leidt "uitgeroeid" puur af uit de live eigendomsstand (`_twLiveProvinces`) —
nul provincies bezitten = rebellen. Zodra de opstand slaagt en de beschaving
weer ergens eigenaar van is, is dit vanzelf weer `false`, zonder aparte
"reviveer"-logica.

Praktisch, in `twAttackButtonHTML()`:
- Voor een uitgeroeide aanvaller vervalt de normale grens-eis (§5.5) — logisch,
  want ze bezitten nergens een aangrenzende provincie om vanuit aan te vallen.
- Maar de "Val aan"-knop verschijnt dan **uitsluitend** op hun eigen
  vlaggenschip, nergens anders — geen wildgroei-heropstanding via het eerste
  het beste buurland.
- De belegering zelf is verder een gewone, ongewijzigde `twStartAttack()` —
  dezelfde garnizoensformule, dezelfde stages, tegen wie de provincie op dat
  moment ook bezet.

Docentenkaart: `twLegend()` toont een 💀 "verslagen"-label naast elke
beschaving met 0 gebieden, zodat direct zichtbaar is wie een opstand nodig
heeft. Leerlingenkant: `SCREENS.trainingMode` toont voor een uitgeroeide
beschaving een uitleg i.p.v. de generieke "geen provincies"-melding, met de
naam van het eigen vlaggenschip erbij — Training Mode is niet bruikbaar
zolang de rebellenstatus duurt (er is immers geen eigen provincie om punten
aan toe te kennen).

**✅ Gebouwd**: het comeback-eerbewijs "Wederopstanding" (`tw_wederopstanding`,
`ACHIEVEMENTS_DEF` in `certamen/core.js`). Detectie op beschavingsniveau, niet
per leerling: `twDetectWipedCivs()` (`certamen/totalwar.js`) schrijft
`totalwar/civs/{civId}/wasWiped:true` als bijwerking van de bestaande
live-listeners (`twStartLive()`/`twStartLiveReadOnly()`) zodra een beschaving
0 provincies bezit. `trCheckComebackAchievement()` (`certamen/training.js`,
aangeroepen vanuit `trLoadOwnedProvinces()`) is een lazy per-leerling-check
naar het patroon van `trCheckFlagshipAchievements()`: zodra een leerling van
die beschaving weer ≥1 provincie ziet én `wasWiped` nog `true` staat, krijgt
die (en elke andere leerling die het daarna ook tegenkomt) het eerbewijs, en
wordt de vlag teruggezet. Geen Firebase-rules-wijziging nodig (`totalwar/civs`
had al `.write:true`).

---

## 6. Progressie & economie — drie gescheiden potjes

| Pot | Wie bezit het | Waarvoor | Waar vandaan | Bestaand of nieuw |
|---|---|---|---|---|
| **XP** | persoonlijk (leerling) | account-niveau/rang (`calcLevel`) | alle spelmodi, inclusief Training Mode | ✅ bestaand, cross-device gesynchroniseerd (`core.js`) |
| **Coins** (denarii/drachmae) | persoonlijk (leerling) | avatar-cosmetica (Battle Mode) | Battle Mode deelname+winst | ✅ bestaand, ongewijzigd |
| **Mastery** | persoonlijk (leerling), per klasse | ontgrendelt niks nieuws, is een prestatie-indicator | **uitsluitend** live Battle Mode-gevechten | ✅ bestaand, ongewijzigd — Training Mode raakt dit expliciet niet aan |
| **Trainingspunten (TP)** | **collectief** (de beschaving/klas) | Bouwt automatisch mee aan `militiaPoints`/`wallPoints`/`towerPoints` | Training Mode | ⚠️ **anders dan gepland** — geen los, besteedbaar TP-saldo, zie de waarschuwing bij §3.2 |

Deze scheiding is een **harde regel**, letterlijk overgenomen uit het
docx-plan: "Ervaring (XP) krijg je door te trainen, maar echte Mastery verdien
je alleen op het slagveld in de klas." — nu aangevuld met TP als vierde,
strikt-gescheiden dimensie.

---

## 7. Docent- en klasbeheer

### 7.1 Klas ↔ beschaving-koppeling

> ⚠️ Het `civId`-doelveld hieronder is verouderd t.o.v. §9.5: er wordt
> geschreven naar `/totalwar/klasCivs/{klascode}` (many-to-one), niet naar
> `/totalwar/civs/{civId}/klascode`.

Sectie in het docentenportaal (`SCREENS.teacherPortal`, `certamen/games.js`):
een dropdown per klascode om een `civId` toe te wijzen. Eén klascode = één
beschaving, permanent (wijzigen kan, maar reset niet automatisch de kaart).

**Sinds 2026-09-07 staat exact hetzelfde koppelpaneel ook direct op de
docent-veldtochtkaart** (`SCREENS.totalWarPreview`, `certamen/totalwar.js`,
`twRenderTeacherPreview()`) — de docent hoeft niet meer terug naar het
portaal om tijdens het bekijken van de kaart een nieuwe klas te koppelen.
Beide plekken hergebruiken dezelfde `tpAssignKlasCiv()`/`tpLoadKlasCivs()`/
`tpLoadClasses()`-functies (`games.js`) en dezelfde `#tpTwKlas`/`#tpTwCiv`/
`#twKlasCivList`-ID's; omdat maar één scherm tegelijk gerenderd is, is dat
veilig.

Bij die gelegenheid is ook een auth-race gefikst: `SCREENS.totalWarPreview`
is (anders dan `SCREENS.teacherPortal`) rechtstreeks bereikbaar vanaf de
publieke `SCREENS.totalWar`-uitleg, zonder eerst via `SCREENS.teacherLogin`
te gaan. Een synchrone `isTeacherLoggedIn()`-check faalde daardoor soms ten
onrechte vlak na een page-load, terwijl Firebase de "onthouden"-sessie nog
aan het herstellen was (`firebase.auth().currentUser` is dan nog even
`null`, ook al staat `remember` op `LOCAL`-persistentie). `totalWarPreview`
wacht nu, net als `teacherLogin` al deed, eerst op `authReady()` voordat het
een docent linksom terugstuurt naar de login.

### 7.2 Aanval starten (in de les)

De docent ziet, op de kaart van de eigen beschaving, welke aangrenzende
provincies aanvalbaar zijn (§5.5) en start daar met één knop een Boss Battle
(zie [BOSS_BATTLE.md §7 Docent Dashboard](BOSS_BATTLE.md#7-docent-dashboard--controls)
voor de volledige configuratie-UI).

### 7.3 Live kaart als centraal overzicht

De kaart (`SCREENS.totalWarPreview`, straks ook een niet-docent-variant voor
leerlingen zodra de modus uit "Binnenkort" komt) toont te allen tijde:
eigenaar per provincie/stad (§5.3), muur-/torenniveau, en welke bonussen een
beschaving heeft ontgrendeld.

### 7.4 Klasgrootte-compensatie

✅ **Gebouwd, exact zoals hier voorgesteld.** Een klas van 30 mag niet
automatisch meer bouwpunten genereren dan een klas van 6: `certamen/
training.js` schaalt `basePts` per leerling met `5/Math.sqrt(TR_CLASS_SIZE||1)`
— precies de voorgestelde `1/√klasgrootte`-afvlakking, hetzelfde principe als
de Boss Battle-moeilijkheidsschaling
([BOSS_BATTLE.md §2](BOSS_BATTLE.md#2-moeilijkheidsgraden--het-schalingsmodel)).
Dit gaat over hoe snel garnizoenspunten opgebouwd worden (thuis, Training
Mode); zie §5.4.1 voor de aparte, later toegevoegde fix die ervoor zorgt dat
de garnizoens-HP tíjdens de belegering zelf ook eerlijk meeschaalt met de
grootte van de **aanvallende** klas.

---

## 8. Fasering / gameplay-loop (uit het docx-plan, ongewijzigd bruikbaar)

1. **Expansie** — bij campagnestart zijn de 27 neutrale provincies (§2.1) zwak
   AI-bezet. Facties veroveren hun directe buren.
2. **Thuis fortificeren** — zodra een provincie veroverd is, trainen
   leerlingen thuis om TP te verdienen en het garnizoen te versterken.
3. **Clash of Titans** — zodra twee facties aan elkaar grenzen, start de
   eerste echte PvP-achtige belegering (§5.4/§5.5) tussen twee klassen.

---

## 9. Beslissingen die dit document vastlegt (en waarom)

Dit zijn de plekken waar het docx-plan aangepast is om te kloppen met de
bestaande code. Als je het er niet mee eens bent: dit zijn precies de punten
om in de implementatiesessie opnieuw open te gooien.

### 9.1 Facties blijven binnen de bestaande 46-provinciekaart

Het docx-plan liet Perzen in "Persis/Parthia" en Germanen in "Magna Germania"
starten — **beide liggen buiten het Trajaanse Rijk en bestaan niet als
klikbare provincies** op de al gebouwde, geometrisch-accurate SVG-kaart (zie
§0). Twee opties waren mogelijk: (a) de kaart uitbreiden met niet-Romeins
grondgebied — nieuw brongebied nodig, een niet-triviale kaart-uitbreiding, of
(b) elke factie een thuisland geven dat al op de kaart bestaat. Dit document
kiest **(b)**: Perzen zitten al (in de huidige demo-data) op `cappadocia`
e.o. — logisch, want dat is exact de historische Romeins-Perzische
grenszone. Voor Germanen is er nieuw voor gekozen: `germania_superior`/
`germania_inferior` (de Romeinse grensprovincies mét die naam) worden hun
thuisland, afgesnoept van de Galliërs. Optie (a) blijft mogelijk als
toekomstige uitbreiding, maar is een apart, groter project (nieuwe
brongeometrie zoeken/verwerken) en dus expliciet **niet** onderdeel van dit plan.

### 9.2 Trainingspunten zijn nieuw en collectief, geen hernoemde coins

Het docx-plan noemt XP, Mastery én Trainingspunten alsof het vanzelfsprekend
drie dingen zijn, maar zegt niet expliciet of TP persoonlijk of collectief is.
Gekozen is voor **collectief** (eigendom van de beschaving/klas, niet van de
leerling), omdat anders elke individuele leerling zijn eigen forten zou
"bezitten" — dat past niet bij "de hele klas is één beschaving". Coins
(persoonlijk, avatar-cosmetica) blijven strikt gescheiden: die zijn al
recent gecorrigeerd naar "alleen deelname+winst" in Battle Mode (zie
BATTLE_MODE.md) juist om te snelle opbouw te voorkomen — TP moet dezelfde les
toepassen (vlakke, lage beloning per antwoord, geen streak-multipliers).

### 9.3 "Klas" betekent hier de Battle Mode-klascode, niet de docent-eigen classId

De app heeft **twee gescheiden klas-concepten** die niet met elkaar praten:
Battle Mode se publieke `klascode` (waarmee leerlingen zelf inloggen, valide
tegen `/klascodes/{klas}`) en de docent-eigen `classId` in
`/teachers/{uid}/classes/{classId}` (gebruikt voor leerlingbeheer/resultaten
van Touwtrekken/Marathon/Snelvuur). Total War hangt de beschaving op aan de
**eerste** (`klascode`), omdat dat al de sleutel is waarop leerling-identiteiten
(`/identities/{klascode}/{leerlingcode}`) en dus XP/coins draaien. Dit moet
expliciet zo gekozen worden — het is geen toeval dat beide systemen los staan,
en een implementatiesessie moet dit niet per ongeluk door elkaar halen.

### 9.4 Boss Battle is een eigen, herbruikbaar subsysteem — niet Total War-specifieke code

Het docx-plan voor Boss Battle bevat pseudocode die ervan uitgaat dat er een
generieke `net.setState(CODE, patch)`-laag bestaat. Die bestaat niet: de
bestaande architectuur (zie `battle.js`) schrijft direct naar
`fbDB.ref("rooms/"+BM_CODE+"/...")` met `.update()`/`.transaction()`, en
gebruikt de globale namen `BM_STATE`/`BM_PLAYERS`/`BM_CODE`/`BM_META`, niet de
generieke `STATE`/`PLAYERS`/`CODE` uit het docx-voorbeeld. Dit is volledig
uitgewerkt en gecorrigeerd in [BOSS_BATTLE.md](BOSS_BATTLE.md), dat bovendien
aanraadt om de bestaande lobby/identiteit/rejoin-infrastructuur van Battle
Mode te hergebruiken in plaats van een parallel systeem te bouwen.

Inmiddels ook waar: Boss Battle bleek geen los systeem te worden, maar een
compacte uitbreiding bovenop Battle Mode se **bestaande** Team A/B-engine
(`certamen/bossbattle.js`, `BM_META.mode==="boss"`) — team B is de baas i.p.v.
een menselijk team, en dezelfde `bmResolve()`/`bmCalcAbilityEffect()`-pijplijn
rekent de klassen/combo's/synergie al automatisch af tegen de baas-HP. Geen
apart room-schema nodig.

### 9.5 `klasCivs`-omkering i.p.v. één `klascode`-string per civ

§4 schreef één `klascode`-veld onder `civs/{civId}`, maar §1 illustreert zelf al
dat meerdere klassen bij dezelfde beschaving horen ("G3A → Atheners"; een
tweede Griekse klas zou ook Atheners moeten zijn). Geïmplementeerd is daarom
`/totalwar/klasCivs/{KLASCODE} = civId` (many-to-one, snelle lookup vanuit een
specifieke klascode) i.p.v. het omgekeerde. `civs/{civId}` bevat nu alleen nog
`trainingPoints`/`bonusesUnlocked`.

### 9.6 Garnizoensbonus voorlopig één HP-getal, nog geen apart schild

Boss Battle heeft (nog) geen schild-mechanic (zie `BOSS_PRESETS`-commentaar in
`bossbattle.js`: bewust nog niet gebouwd). De garnizoensformule uit
[BOSS_BATTLE.md](BOSS_BATTLE.md#garnizoensformule-voor-total-war-belegeringen)
is daarom vereenvoudigd geïmplementeerd: `walls*50 + towers*20` telt volledig
op bij `bossMaxHP` (geen apart `garrisonShield`-veld). Zodra Boss Battle zelf
een schildlaag krijgt, kan `towers` daaraan gekoppeld worden.

### 9.7 Multi-tenant: elke docent zijn eigen campagne

Sinds 2026-09-09 (op verzoek) is Total War niet langer één wereldwijd gedeelde
veldtocht. Elke goedgekeurde docent (of admin) kan zijn **eigen, onafhankelijke**
campagne starten — eigen kaart, eigen klas↔beschaving-koppelingen (§9.5), eigen
seizoenen, eigen Hall of Fame (§11) — zichtbaar en speelbaar door **zijn eigen**
klassen, los van elke andere docent.

**Datamodel** — alle §4-paden verhuisd van plat `/totalwar/{provinces,civs,
klasCivs,season,stats,history,klasSize,meta}` naar
`/totalwar/campaigns/{ownerUid}/{...zelfde subvorm...}`. `{ownerUid}` (de
Firebase Auth-uid van de docent) ís de campagnesleutel — één actieve campagne
per docent, geen apart `campaignId` nodig. Nieuw: `/totalwar/showcaseUid`
wijst de docent-uid aan wiens campagne als publiek **uithangbord** dient voor
niet-ingelogde bezoekers en leerlingen zonder eigen-docent-campagne. Voorlopig
altijd Gerbens eigen uid — een latere stap (bewust uitgesteld) is om ook die
showcase-campagne af te schermen voor leerlingen van andere docenten.

**Welke campagne zie je?** (`certamen/totalwar.js`: `twResolveViewerCampaign()`/
`twResolveHofOwner()`, `_twOwner`)
- Ingelogde, goedgekeurde docent/admin op zijn eigen beheerscherm
  (`SCREENS.totalWarPreview`) → altijd zijn eigen `campaigns/{eigen uid}`.
  Heeft hij er nog geen, dan toont het scherm een expliciete **"Start eigen
  Total War"**-knop (`twRenderStartCampaign()`/`twStartOwnCampaign()`) —
  bewust geen impliciete seed meer bij het eerste bezoek.
- Leerling met identiteit (`BM_IDENT.klascode`, Training Mode/publieke kaart)
  → `klascodes/{klas}/ownerUid` (al bestaand, publiek leesbaar veld, zie
  CLAUDE.md § Firebase-rules) wijst zijn docent aan; bestaat diens campagne
  nog niet, dan zie je een lege staat ("je docent heeft nog geen eigen Total
  War gestart") — nooit stilzwijgend een andere docent se kaart.
- Niemand van bovenstaande (niet-ingelogde bezoeker, of leerling van een
  docent zonder eigen campagne) → `totalwar/showcaseUid`.
- Hall of Fame is een uitzondering: een ingelogde, goedgekeurde docent/admin
  ziet daar altijd zíjn EIGEN geschiedenis (met beheerknoppen), ook als hij
  toevallig op de kaart van een andere docent aan het kijken was.

**Rules** (`certamen/database.rules.json`) mirroren het bestaande
`klascodes/{code}/ownerUid`-patroon: `totalwar/campaigns/$ownerUid` is
publiek leesbaar (zelfde afweging als klascodes/identities — zie CLAUDE.md §
Firebase-rules), maar `klasCivs`/`season`/`history`/`meta` zijn alleen
schrijfbaar door `auth.uid === $ownerUid` én een goedgekeurde docent/admin —
dus nooit door een collega-docent (dat kon vóór deze migratie per ongeluk
wél, via de oude platte `.write:"auth != null"`). `provinces/$id`, `civs/$id`,
`klasSize/.../$lid` en `stats/topBuilder` blijven wereld-schrijfbaar zoals
altijd — leerling-gameplay heeft geen auth.

De aanvalsflow (`twStartAttack()` → Boss Battle → `bmResolve()` →
`twResolveSiege()`) draagt de campagne-eigenaar mee als `BM_META.campaignOwner`
(gezet bij het starten van de aanval, meegekopieerd in de room-state zodat
elke deelnemer 'm kent) zodat het gevechtsresultaat naar de juiste campagne
teruggeschreven wordt.

---

## 10. Roadmap (volgorde-suggestie voor de implementatiesessie)

1. ✅ **Data**: `provinces.json` uitgebreid met de volledige stedenlijst +
   een echte, mechanische provinciebonus per provincie (§3.4/§3.5), en
   zeeroutes zijn nu ook zichtbaar op de kaart als blauwe stippellijn (§5.6).
2. ✅ **Firebase-schema**: `/totalwar/provinces/{id}` en `/totalwar/civs/{id}`
   opgezet (§4, met de `klasCivs`-omkering uit §9.5), `MapAPI` gekoppeld aan een
   live Firebase-listener i.p.v. de vroegere hardcoded `TW_DEMO_OWN`/`TW_DEMO_DEF`
   (die nu uitsluitend nog de publieke, niet-live uitlegkaart voeden).
3. ✅ **Docentenportaal**: klas↔beschaving-koppeling (§7.1).
4. ✅ **Training Mode**: scherm + puntentoekenning gebouwd
   (`SCREENS.trainingMode`, `certamen/training.js`), hergebruikt
   `BattleMotion` en de bestaande vocab-poollogica — **anders dan hier
   gepland**: geen los TP-saldo, punten gaan direct in `militiaPoints`/
   `wallPoints`/`towerPoints` (zie de waarschuwing bij §3.2).
5. ✅ **Boss Battle**: bleek al te bestaan als uitbreiding op Battle Mode se
   Team A/B-engine (zie §9.4-addendum); gekoppeld aan Total War via de
   garnizoensformule (§5.4/§9.6) in `bmStartBossGame()`/`bmResolve()`.
6. **Kaart-UI**: gestreepte "betwist"-provincies (§5.3, herdefinitie op
   belegeringsschade i.p.v. stad-eigendom) is ✅ gebouwd, net als de
   geometrisch geverifieerde stadsmarkers en de historische lesjes per stad
   (110 steden, zie §5.3). Eigendom/mechanische bonussen per stad zelf (het
   oorspronkelijke stad-eigendomsconcept) is **bewust afgesloten, niet
   gebouwd** (zie de beslissing bij §5.3) — geen openstaand punt meer. De
   "Val aan"-knop in het docentendashboard (§7.2) is al gebouwd.
7. **Balans-pas**: klasgrootte-compensatie is ✅ al gebouwd (§7.4). Slijtageslag-
   reparatie is inmiddels ✅ ook gebouwd (§5.4, automatisch via Training Mode
   op het doorbroken spoor). TP-kosten (§5.2) blijven moot — er is geen
   aankoopmechanisme om te beprijzen, zie de waarschuwing bij §3.2.
8. ✅ **Comeback-eerbewijs "Wederopstanding"** (§5.7): beschavingsniveau-
   detectie (`twDetectWipedCivs()`) + lazy per-leerling-toekenning
   (`trCheckComebackAchievement()`).

---

## 11. Hall of Fame (seizoensarchief)

**✅ Gebouwd (2026-09-07, op verzoek).** Een seizoensreset (`twStartNewSeason()`,
`certamen/totalwar.js`) wist niet langer stilzwijgend de hoogtepunten van het
afgesloten seizoen — vlak vóór de reset zelf schrijft dezelfde functie een
onveranderlijk archiefrecord naar `/totalwar/history/{seizoensnummer}`:

```
/totalwar/history/{nummer}/
  number, title, startedAt, endedAt
  finalOwner        { provincieId: civId }   // eindstand van de kaart, alle 46 provincies
  klasCivs          { klascode: civId }      // wie welke beschaving speelde dat seizoen
  winnerCivId       civId | null             // grootste rijk bij het einde (null = geen enkel volk actief)
  winnerProvinces   aantal gebieden van de winnaar
  stats             de /totalwar/stats-hoogtepunten van dat seizoen (zie hieronder), of
                     null als er nog niets was
  hidden            true | (afwezig) — docent-only "verbergen", zie de beheersectie onderaan
```

Geen aparte Firebase-rules nodig: `/totalwar` heeft al `.read: true` /
`.write: "auth != null"` op het topniveau, en `history` heeft geen eigen
`.validate`-regels die dit in de weg zouden zitten.

**Nieuw publiek scherm** `SCREENS.totalWarHallOfFame` (`certamen/totalwar.js`,
bereikbaar via een knop op `SCREENS.totalWar` en `SCREENS.totalWarMap`, geen
docentenlogin nodig — net als de rest van de leerling-/publiekskant) toont elk
afgesloten seizoen als een kaart, nieuwste eerst:

- Seizoensnummer, titel en periode (`twFormatSeasonSpan()`).
- 👑 Winnaar (kleur + naam + welke klas(sen) die beschaving speelden) en het
  aantal gebieden waarmee gewonnen werd — of een nette melding als er geen
  winnaar was (volledig ongebruikt seizoen).
- Eindstand-legenda per volk (`twLegendFromOwnership()`) — een losstaande,
  eenvoudigere variant van de live `twLegend()`: geen "verslagen"/"betwist"-
  begrippen, want die zijn op een bevroren archiefrecord niet meer van
  toepassing.
- Dezelfde hoogtepunt-regels als de live kaart, nu gelezen uit het
  gearchiveerde `stats`-veld i.p.v. de live `/totalwar/stats`:
  - 👑 **Grootste rijk ooit** (`totalwar/stats/biggestEmpire`, herzien
    2026-09-10 op verzoek) — vóór deze wijziging toonde "grootste rijk" de
    HUIDIGE eigendomsstand op het moment van bekijken, dus een volk dat zijn
    piek alweer kwijtgeraakt was kreeg daar geen credit meer voor. Nu een
    écht bijgehouden record: `twMaybeRecordBiggestEmpire(owner, civId)`
    (`certamen/totalwar.js`) telt na elke gebeurtenis die een volk se
    gebiedental kan VERHOGEN (verovering in `twResolveSiege()`, vers
    vlaggenschip in `twGrantFreshFlagshipIfUnowned()`) het actuele totaal
    voor dat volk en bewaart het hoogste ooit — nooit aangeroepen bij
    verlies, want dat kan per definitie geen nieuw record zijn.
  - ⚔️ Meeste veroveringen (`totalwar/stats/conquests`, ongewijzigd)
  - 🛡️ **Beste verdediger** (nieuw, 2026-09-10) — `totalwar/stats/defenses`,
    per volk hoe vaak het een volledige belegeringspoging heeft afgeslagen
    (verlies van de aanvaller óf een rondelimiet-terugtrekking, zie §5.4.2 —
    `twResolveSiege()`'s `else`-tak wordt namelijk hoe dan ook maar één keer
    per hele poging aangeroepen, nooit bij een tussenstage-overgang, dus
    iedere keer dat die tak draait is de belegering echt voorbij). Alleen
    geteld als `defenderCivId` een echt volk is (geen klas op een neutrale
    provincie om te belonen) — directe tegenhanger van "meeste
    veroveringen", bedoeld om verdedigen net zo motiverend te maken als
    aanvallen.
  - 🔥 **Grootste comeback** (nieuw, 2026-09-10) — `totalwar/stats/biggestComeback`,
    het hoogste aantal gebieden dat een volk ooit weer opbouwde NADAT het
    volledig van de kaart was geveegd. Gebruikt een eigen
    `civs/{civId}/comebackWiped`-vlag (`twDetectWipedCivs()` zet 'm
    onvoorwaardelijk zodra een volk wordt weggevaagd), bewust GESCHEIDEN van
    de bestaande `wasWiped`-vlag van het leerling-prestatiesysteem
    (`trCheckComebackAchievement()`, `certamen/training.js`): die twee
    vlaggen hebben een ander levenscyclus-doel (per-leerling-prestatie vs.
    seizoensrecord) en zouden elkaar in de weg zitten als ze gedeeld werden.
    `twMaybeRecordBiggestEmpire(owner, civId)` telt na elke gebiedswinst het
    actuele totaal en werkt, als `comebackWiped` waar is, ook meteen
    `biggestComeback` bij (zelfde transactie-patroon: alleen bijwerken als
    het nieuwe aantal het record verslaat). `comebackWiped` wordt bij elke
    `twStartNewSeason()` teruggezet naar `null` voor alle volken (de
    `wasWiped`-vlag van het prestatiesysteem blijft daarbij bewust
    ongemoeid).
  - 🏃 **Meest actieve klas** (nieuw, 2026-09-10) — niet het klas met de
    meeste goede antwoorden absoluut (dat bevoordeelt structureel grote
    klassen), maar het hoogste gemiddelde per leerling:
    `twComputeMostActiveKlas(klasActivity, klasSize)` (`certamen/
    totalwar.js`) deelt `stats/klasActivity/{klascode}` (opgehoogd via
    `ServerValue.increment(1)` bij elk goed antwoord, `trScoreAnswer()` in
    `certamen/training.js`) door het aantal leerlingen in die klas en pakt
    de klas met het hoogste quotiënt. Voor de live hoogtepunten-weergave
    (`twRenderHighlights()`, nu async) wordt de actuele `klasSize`-boom
    gebruikt (`twFetchKlasSizeMap()`); voor het Hall of Fame-archief wordt in
    plaats daarvan een bevroren momentopname `klasSizeAtEnd` gebruikt die
    `twStartNewSeason()` bij het afsluiten van het seizoen mee archiveert —
    de live `klasSize`-boom blijft na een seizoenswissel doorlopen (leerlingen
    komen en gaan), dus zonder die bevroren snapshot zou een oud seizoen met
    de VERKEERDE, huidige klasgroottes herberekend worden.
  - 🩸 Bloedigste veldslag (meeste schade in één belegeringsstage)
  - ⚔️ **Grootste veldslag** (nieuw, 2026-09-07) — het gevecht met de meeste
    échte deelnemers (`totalwar/stats/biggestBattle`), ongeacht win/verlies:
    het gaat om de opkomst, niet de uitkomst
  - ⏳ **Langste veldtocht** (nieuw, 2026-09-07) — de provincie die het langst
    (in echte tijd) standhield tussen de EERSTE mislukte aanval in een
    belegeringsreeks en de uiteindelijke val (`totalwar/stats/longestSiege`,
    `twFormatDurationMs()`). Vereist een nieuw `siege/startedAt`-veld
    (`twResolveSiege()`, `certamen/totalwar.js`): gezet bij de eerste
    mislukte aanval in een reeks, nooit overschreven door een volgende
    mislukking in dezelfde reeks, en impliciet gewist zodra de provincie
    alsnog valt (de hele `siege`-tak wordt dan vervangen). Een provincie die
    in één keer valt heeft dus geen "veldtocht-duur" — logisch, er was geen
    reeks om te meten.
  - 🌟 Sterkste solo-speler, 🏗️ Grootste bouwer (ongewijzigd)

  **Bewust een ander concept dan de "Winnaar" hierboven**: die blijft
  gebaseerd op de eigendomsstand bij het EINDE van het seizoen (§9.7/de
  archiveringsstap in `twStartNewSeason()`) — wie de veldtocht als geheel
  wint, is terecht een ander gegeven dan wie ooit de grootste piek had.
- **"🗺️ Bekijk eindkaart"**: rendert pas bij klikken (lazy, om niet meteen
  meerdere volledige SVG-kaarten tegelijk te laden) de echte provinciekaart
  met de bevroren `finalOwner`-stand in een eigen host per seizoen
  (`twToggleHistoryMap()`). Hergebruikt de gecachete SVG/registry
  (`_twSvgCache`/`_twRegistry`) van de live kaartschermen.
  **Technische correctie t.o.v. hoe de live kaart dit doet:** `MapAPI.
  setProvinceOwner()`/`province()` (`certamen/map/provinces.js`) zoeken een
  provincie op met `root(r).getElementById(id)` — dat vereist een object dat
  `getElementById` ondersteunt (een `Document`, of legacy een `SVGSVGElement`
  zelf), **niet** een gewone wrapper-`<div>`. De live kaart merkt dit nooit
  omdat ze zonder `r`-argument aanroept en dus altijd op het globale
  `document` werkt (er is toch maar één kaart tegelijk in beeld). Een
  Hall-of-Fame-kaart leeft naast andere content in dezelfde pagina, dus moet
  wél expliciet scopen — `twToggleHistoryMap()` geeft daarom het `<svg>`-
  element zelf mee als root (`MapAPI.setProvinceOwner(id, kleur, svgEl)`),
  niet de omhullende hostdiv.

### 11.1 Docent-beheer (verbergen/verwijderen)

**✅ Gebouwd (2026-09-07, op verzoek — "voor het geval een seizoen niet loopt
zoals gepland").** `SCREENS.totalWarHallOfFame` bepaalt bij het laden de
docentstatus (`teacherNet().isTeacherLoggedIn()`, met dezelfde `authReady()`-
naverificatie als `SCREENS.totalWarPreview` voor een "onthouden" sessie die
nog aan het herstellen is) en toont **alleen aan een ingelogde docent** drie
extra acties, allemaal direct op `/totalwar/history` (geen aparte rules
nodig — zelfde `auth != null`-schrijfregel als de rest van `/totalwar`):

- **🙈 Verbergen / 👁️ Weer tonen** (`twHofSetHidden()`) — zet/wist
  `history/{nummer}/hidden`. Omkeerbaar: het seizoen blijft volledig bewaard
  en blijft zichtbaar voor de docent zelf (met een "Verborgen"-label), maar
  verdwijnt uit `twRenderHallOfFame()` voor iedereen die niet is ingelogd.
- **🗑️ Verwijderen** (`twHofDeleteSeason()`) — verwijdert het hele
  `history/{nummer}`-record permanent, met dezelfde typ-bevestiging
  ("VERWIJDEREN") als `twStartNewSeason()`'s reset-bevestiging.
- **✕ per naam** (`twHofRemoveStat()`) — verwijdert precies één individuele
  vermelding (`stats/topSolo` of `stats/topBuilder`) uit een seizoen, voor
  als een leerlingnaam bijvoorbeeld verkeerd gespeld is of niet met naam op
  een openbaar scherm zou moeten staan, zonder de rest van dat seizoen aan
  te tasten. Niet toegepast op "bloedigste veldslag"/"grootste veldslag"/
  "langste veldtocht": die noemen alleen volken, geen individuele leerling.

**Kanttekening (geen beveiligingsgrens, wel eerlijk te vermelden):** `hidden`
filtert alleen aan de cliëntkant (`twRenderHallOfFame()`) — `/totalwar` is
`.read: true` voor iedereen, dus een verborgen seizoen is in theorie nog via
een directe Firebase-call op te vragen. Voor een klassikale tool is dat
voldoende (zelfde soort soft-hide als elders in de app, bv. niet-goedgekeurde
klascodes); een harde leesblokkade zou een aparte, strengere rule per record
vereisen en is hier bewust niet gebouwd.

Bewust **niet** gebouwd: een geaggregeerd "seizoen-overzicht" (bv. een grafiek
van winnaars over meerdere seizoenen) — met nog maar één afgesloten seizoen
tegelijk is dat te vroeg om zinvol te ontwerpen; de ruwe data staat er wel al
(elk record heeft `number`/`winnerCivId`), dus dat kan later alsnog bovenop
gebouwd worden zonder het datamodel te wijzigen.

---

*Total War · Gerben de Jong · 2026*
