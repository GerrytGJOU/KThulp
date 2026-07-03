# Persistent Total War — Masterplan (FUNDAMENT GEBOUWD)

> **Status: fundament werkend, nog niet vrijgegeven voor leerlingen.** In het
> hoofdmenu staat de modus nog als **"Binnenkort"** (leerlingen kunnen niet
> binnen, want Training Mode/§3 bestaat nog niet). Docenten hebben nu wél een
> **echte, blijvende** veldtochtkaart (Firebase-schema, §4): klas↔beschaving-
> koppeling in het docentenportaal (§7.1), een live kaart i.p.v. een demo, en
> een "Val aan"-knop die een echt [Boss Battle](BOSS_BATTLE.md)-gevecht start
> met de garnizoenssterkte van de verdedigende provincie verrekend (§5.4/
> BOSS_BATTLE.md "Garnizoensformule"). Zie [§0](#0-wat-is-er-al-gebouwd-nu) voor
> de volledige, actuele stand.
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
| Menutegel "🗺️ Total War — Binnenkort" | `certamen/games.js` (`SCREENS.home`) | ✅ werkend |
| Publiek uitlegscherm (alleen-lezen demo-kaart) | `certamen/totalwar.js` (`SCREENS.totalWar`) | ✅ werkend, ongewijzigd (blijft demo, want puur illustratief voor niet-ingelogde bezoekers) |
| Docent-kaart: **echte, blijvende veldtocht** i.p.v. demo-voorbeeld | `certamen/totalwar.js` (`SCREENS.totalWarPreview`, `twStartLive`, `twApplyLive`) | ✅ werkend — live Firebase-listener op `/totalwar/provinces`, geen hardcoded stand meer |
| **Echte, geometrisch accurate SVG-kaart van het Romeinse Rijk (Trajanus)** | `certamen/map/provinces.svg` | ✅ werkend — **46 aanklikbare provincies**, elk met stabiele `id` (bv. `italia`, `baetica`, `gallia_belgica`) |
| Provincieregister (naam, steden, buren, zeeroutes, bonus) | `certamen/map/provinces.json` | ✅ werkend — inclusief `neighbors`/`seaRoutes` per provincie (symmetrisch, zie §5.5/§5.6); stedencatalogus nog beperkt (§3.4 open) |
| Provincie-CSS (neutraal/hover/selected/enemy/ally) | `certamen/map/provinces.css` | ✅ werkend |
| JS-helper om provincies te kleuren/muteren | `certamen/map/provinces.js` (`MapAPI`) | ✅ werkend: `setProvinceOwner`, `setProvinceDefense`, `setProvinceBonus`, `highlightProvince`, `resetProvince` |
| **Firebase-schema + eenmalige campagne-seed** | `certamen/totalwar.js` (`twEnsureCampaignSeeded`) | ✅ werkend — `/totalwar/provinces/{id}` + `/totalwar/civs/{civId}`, idempotent (zie §4, met de `klasCivs`-omkering uit §9.5) |
| **Klas↔beschaving-koppeling (docentenportaal)** | `certamen/games.js` (`tpAssignKlasCiv`/`tpLoadKlasCivs`, paneel in `SCREENS.teacherPortal`) | ✅ werkend — schrijft naar `/totalwar/klasCivs/{klascode}`, gevalideerd tegen bestaande Battle Mode-klascodes |
| **Aanvalsflow + garnizoensformule** | `certamen/totalwar.js` (`twStartAttack`) + `certamen/battle.js` (`bmStartBossGame`, `bmResolve`/`twResolveSiege`) | ✅ werkend — "Val aan"-knop op de kaart start een Boss Battle met muren/torens als extra boss-HP en slijtageslag (`damageTaken`); winst/verlies schrijft terug naar de provincie |
| 7-facties-tabel + thuislanden (seed-data) | `certamen/totalwar.js` (`TW_CIVS`, `TW_HOME_PROVINCES`) | ✅ werkend, exact §2 |
| Voorbeeld-eigendom/verdediging voor de **publieke** demo-kaart | `certamen/totalwar.js` (`TW_DEMO_OWN`, `TW_DEMO_DEF`) | ✅ blijft bestaan, uitsluitend voor `SCREENS.totalWar` (niet-docenten) |

**Belangrijk over de kaart:** dit is de **echte** Romeinse-provinciekaart (zie
de projectgeschiedenis: de originele Wikimedia-SVG is schoongemaakt en elke
provincie is met de bestaande geometrie 1-op-1 geïdentificeerd — er is niets
herontworpen of vereenvoudigd). De kaart toont **uitsluitend het grondgebied
van het Trajaanse Romeinse Rijk** — gebieden als Germania Magna, Perzië/Parthia
en Sarmatia bestaan op de kaart als niet-klikbare achtergrond (cream), *niet*
als eigen provincies. Dit heeft directe gevolgen voor de factie-indeling in §2
— zie de expliciete beslissing daarover in §9.1.

Drie kleine, technisch bekende beperkingen (uit eerdere sessies, niet blokkerend):
- De drie kleinste Alpenprovincies (`alpes_poeninae`, `alpes_cottiae`,
  `alpes_maritimae`) liggen visueel onder Italia; een klik daar selecteert nu
  Italia. Oplosbaar met een DOM-herordening, nog niet gedaan.
- `cyprus` bestaat uit twee samenvallende SVG-paden (`cyprus`/`cyprus_2`),
  al correct als één provincie behandeld door `MapAPI`.
- Sommige provincies hebben nog maar 0 of 1 stad geregistreerd (zie §3.4).

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

**7 facties**, elk met een thuisland dat **volledig binnen de bestaande
46-provinciekaart** ligt (zie §9.1 voor waarom dit een bewuste, afgedwongen
keuze is t.o.v. het originele docx-plan):

| Factie (`civId`) | Kleur | Thuisprovincie(s) op de echte kaart |
|---|---|---|
| `roma` (Romeinen) | `#a8261a` | `italia`, `sicilia`, `sardinia`, `corsica`, `dalmatia` |
| `gallii` (Galliërs) | `#3f7d3a` | `gallia_lugdunensis`, `gallia_aquitania`, `gallia_belgica`, `gallia_narbonensis` |
| `germani` (Germanen) *(nieuw t.o.v. huidige demo)* | `#4a2c11` | `germania_superior`, `germania_inferior` |
| `athenae` (Grieken) | `#2e6fb0` | `achaea`, `macedonia`, `thracia` |
| `persae` (Perzen) | `#8a4fb0` | `cappadocia`, `galatia`, `syria`, `armenia`, `mesopotamia` |
| `carthago` (Carthagers) *(nieuw)* | `#550088` | `africa_proconsularis`, `mauretania_caesariensis`, `mauretania_tingitana` |
| `aegyptii` (Egyptenaren) *(nieuw)* | `#e67e22` | `aegyptus`, `arabia`, `creta_et_cyrene` |
| `neutral` | `#dfd5c6` (perkament) | de rest — zie §2.1 |

Let op: `gallii` verliest in dit plan `germania_superior`/`germania_inferior`
(die nu in `TW_DEMO_OWN` nog aan de Galliërs hangen) aan de nieuwe Germaanse
factie — logischer thematisch (het zijn letterlijk de "Germania"-provincies)
én het maakt een 7-facties-kaart mogelijk zonder één vierkante centimeter aan
de bestaande SVG te hoeven wijzigen. Zie §9.1.

### 2.1 Neutrale bufferprovincies (bij campagnestart)

Alle overige 27 provincies starten **neutraal** (AI-bezet, zwak) en zijn de
eerste veroveringsdoelen:

`britannia`, `tarraconensis`, `lusitania`, `baetica`, `baleares`, `raetia`,
`noricum`, `alpes_poeninae`, `alpes_cottiae`, `alpes_maritimae`,
`pannonia_superior`, `pannonia_inferior`, `moesia_superior`, `moesia_inferior`,
`dacia`, `asia`, `bithynia_et_pontus`, `lycia_et_pamphylia`, `cilicia`,
`cyprus`, `judea`.

Dit geeft elke factie 2–5 direct aangrenzende neutrale provincies om vroeg in
het schooljaar te veroveren zonder meteen buurfacties te raken — precies het
"bufferzone"-principe uit het originele docx-plan, nu toegepast op de echte
geometrie.

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
     met een ander wapen-sprite) een palissade/muur die per goed antwoord een
     stukje hoger wordt getekend (simpele CSS `height`/`clip-path`-groei op een
     laag-overlay, geen nieuwe asset-pijplijn nodig).
- Fout antwoord: geen Trainingspunten, gewoon door naar de volgende vraag
  (geen bestraffing, consistent met de rest van de app se toon).

### 3.2 Beloning: Trainingspunten (TP) — een NIEUW, apart, collectief veld

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

### 3.4 Openstaande data-taak: meer steden per provincie

`provinces.json` heeft nu vaak maar 1 stad per provincie (soms 0). Het
docx-plan beschrijft rijke 1-3-steden-per-provincie-bonussen met historische
namen die vaak al keurig binnen bestaande provincies vallen (bv. Capua →
`italia`, Numantia/Carthago Nova → `tarraconensis`, Byzantium →
`bithynia_et_pontus`, Memphis/Thebe → `aegyptus`, Antiochia/Jerusalem →
`syria`/`judea`). Dit is **pure data-invoer, geen geometriewerk** — een
volgende sessie kan `provinces.json` uitbreiden met een `cities: [{naam,
bonus}]`-array per provincie op basis van de docx-catalogus, gefilterd tot
provincies die daadwerkelijk op de kaart bestaan.

---

## 4. Datamodel (Firebase RTDB) — vervangt `TW_DEMO_OWN`/`TW_DEMO_DEF`

Volgt exact de bestaande projectconventie (klein, plat, per-node
`.transaction()`/`.update()`, geen generieke "patch"-laag — zie
[BOSS_BATTLE.md §Technische correcties](BOSS_BATTLE.md#technische-correcties-tov-het-oorspronkelijke-docx-plan)
voor waarom dat afwijkt van het oorspronkelijke docx-voorstel).

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

Een provincie is pas **volledig** veroverd (en geeft de volle
provinciebonus) als **alle steden erin** zijn ingenomen. Een provincie met
gemengd stedenbezit is **"contested"**:

- **Kaartvisualisatie:** volledig bezit → effen kleur van de eigenaar. Betwist
  (steden verdeeld over ≥2 facties) → diagonaal gestreept in de kleuren van de
  betrokken facties, via CSS `repeating-linear-gradient` als `background`
  op het provincie-`<path>` (dit werkt prima naast de bestaande
  `--province-fill`-mechaniek in `provinces.css` — voor "contested" gebruik je
  een losse CSS-klasse i.p.v. de custom property, zie de code-aanzet in het
  oorspronkelijke docx-plan, sectie "Visuele Logica").
- Individuele steden blijven **los aanklikbaar/kleurbaar** — dit vraagt een
  uitbreiding van `provinces.svg`/`MapAPI`: steden bestaan nu conceptueel
  (namen in `provinces.json`) maar zijn geen eigen SVG-elementen. Toevoegen
  van `<circle>`-stadsmarkers per provincie (op basis van elk stad se
  historische positie) is nieuw werk, geometrisch onafhankelijk van de
  bestaande provincie-`<path>`s dus **zonder risico** voor de bestaande kaart.

### 5.4 De "slijtageslag" (meerdere-fasen-belegering)

Een zwaar versterkte provincie (hoog `walls`/`towers`) mag nooit praktisch
onneembaar worden. Daarom:

- Boven een bepaalde garnizoenssterkte-drempel vereist verovering **twee
  aparte Boss Battle-pogingen** (twee losse lessen).
- **Poging 1** breekt de muren/toren af: schrijf de toegebrachte schade weg
  naar `damageTaken` op de provincie, ook bij niet-winnen.
- **Poging 2** (een volgende les) start met een boss-HP die al verlaagd is met
  `damageTaken` — nu wél te verslaan.
- **De twist:** tussen de twee pogingen door kan de verdedigende klas via
  Training Mode `damageTaken` weer gedeeltelijk repareren (bv. elke N TP
  besteed aan reparatie verlaagt `damageTaken` met een vast bedrag). Dit is
  precies de spanningsboog die het oorspronkelijke plan beoogde.

De exacte boss-HP-formule die dit alles combineert met de bestaande
Boss Battle-schaling staat in
[BOSS_BATTLE.md §Garnizoensformule voor Total War-belegeringen](BOSS_BATTLE.md#garnizoensformule-voor-total-war-belegeringen).

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

---

## 6. Progressie & economie — drie gescheiden potjes

| Pot | Wie bezit het | Waarvoor | Waar vandaan | Bestaand of nieuw |
|---|---|---|---|---|
| **XP** | persoonlijk (leerling) | account-niveau/rang (`calcLevel`) | alle spelmodi, inclusief Training Mode | ✅ bestaand, cross-device gesynchroniseerd (`core.js`) |
| **Coins** (denarii/drachmae) | persoonlijk (leerling) | avatar-cosmetica (Battle Mode) | Battle Mode deelname+winst | ✅ bestaand, ongewijzigd |
| **Mastery** | persoonlijk (leerling), per klasse | ontgrendelt niks nieuws, is een prestatie-indicator | **uitsluitend** live Battle Mode-gevechten | ✅ bestaand, ongewijzigd — Training Mode raakt dit expliciet niet aan |
| **Trainingspunten (TP)** | **collectief** (de beschaving/klas) | garnizoensupgrades (§5.2) | Training Mode | 🆕 nieuw, zie §3.2 en §9.2 |

Deze scheiding is een **harde regel**, letterlijk overgenomen uit het
docx-plan: "Ervaring (XP) krijg je door te trainen, maar echte Mastery verdien
je alleen op het slagveld in de klas." — nu aangevuld met TP als vierde,
strikt-gescheiden dimensie.

---

## 7. Docent- en klasbeheer

### 7.1 Klas ↔ beschaving-koppeling

Nieuw scherm/sectie in het docentenportaal (`SCREENS.teacherPortal`,
`certamen/games.js`): een dropdown per klascode om een `civId` toe te wijzen,
weggeschreven naar `/totalwar/civs/{civId}/klascode`. Eén klascode = één
beschaving, permanent (wijzigen kan, maar reset niet automatisch de kaart).

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

Een klas van 30 mag niet automatisch meer TP/voortgang genereren dan een klas
van 6. Voorstel: TP-winst per leerling schaalt met `1 / sqrt(klasgrootte)` of
een vergelijkbare afvlakkende functie (exacte formule: balansvraag voor de
implementatiesessie, net als de Boss Battle-moeilijkheidsschaling waar
hetzelfde principe al wél is uitgewerkt — zie
[BOSS_BATTLE.md §2](BOSS_BATTLE.md#2-moeilijkheidsgraden--het-schalingsmodel)).

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

---

## 10. Roadmap (volgorde-suggestie voor de implementatiesessie)

1. **Data**: `provinces.json` uitbreiden met de volledige stedenlijst +
   bonusteksten (§3.4) — pure data-invoer, geen risico voor de bestaande kaart.
   *(nog open — `neighbors`/`seaRoutes` zijn wel al toegevoegd, de
   1-3-steden-per-provincie-bonuscatalogus nog niet)*
2. ✅ **Firebase-schema**: `/totalwar/provinces/{id}` en `/totalwar/civs/{id}`
   opgezet (§4, met de `klasCivs`-omkering uit §9.5), `MapAPI` gekoppeld aan een
   live Firebase-listener i.p.v. de vroegere hardcoded `TW_DEMO_OWN`/`TW_DEMO_DEF`
   (die nu uitsluitend nog de publieke, niet-live uitlegkaart voeden).
3. ✅ **Docentenportaal**: klas↔beschaving-koppeling (§7.1).
4. **Training Mode**: nieuw scherm + TP-toekenning (§3), hergebruikt
   `BattleMotion` en de bestaande vocab-poollogica. *(nog open)*
5. ✅ **Boss Battle**: bleek al te bestaan als uitbreiding op Battle Mode se
   Team A/B-engine (zie §9.4-addendum); gekoppeld aan Total War via de
   garnizoensformule (§5.4/§9.6) in `bmStartBossGame()`/`bmResolve()`.
6. **Kaart-UI**: contested/gestreepte provincies (§5.3), stad-markers zijn nog
   open; de "Val aan"-knop in het docentendashboard (§7.2) is wel al gebouwd.
7. **Balans-pas**: klasgrootte-compensatie (§7.4), TP-kosten (§5.2),
   slijtageslag-drempels (§5.4) — allemaal met echte klasgroottes testen.

---

*Total War · Gerben de Jong · 2026*
