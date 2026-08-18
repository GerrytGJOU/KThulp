# Combat Overhaul — voorstel voor Chronica Classica

*Discussiedocument, 2026-08-18. Nog geen masterplan: dit is een menu van
voorstellen om samen door te nemen. Wat we kiezen, verhuist daarna naar
`Chronica.md` §8/§11 (en bij cross-mode-gevolgen naar `BATTLE_MODE.md` /
`BOSS_BATTLE.md`).*

---

## STATUS (bijgewerkt 2026-08-18, ná Gerbens keuze)

**Gebouwd en getest** — Pakket 1 + 2 volledig, plus C en D:

| | Voorstel | Waar |
|---|---|---|
| ✅ | **A** intent-telegrafie + Vigor met narratieve opvang | `spCombatVijandBeurt`, `spCombatOpvang`, `SP_COMBAT_INTENTIES` |
| ✅ | **B** aanvalsvorm = moeilijkheidskeuze | `SP_COMBAT_VORMEN` |
| ✅ | **C** vraagtype-bank (types 1, 2-alleen-MC, 3, 4, 5; **géén etymologie**) | `certamen/combat-questions.js` |
| ✅ | **D** Leitner-mastery + micro-onderwijs | `combat-questions.js`, `SP_STATE.mastery` |
| ✅ | **F** actiekeuze + klassevaardigheid + wapen/harnas/stat-bonussen | `SP_COMBAT_KLASSE`, `SP_COMBAT_WAPEN_FACTOR`, `SP_COMBAT_HARNAS_DEMPING` |
| ✅ | **G** items uit het verhaal | `SP_COMBAT_ITEMS`, `spHookInventory` |
| ✅ | **J** visueel/audio-hergebruik van Battle Mode's FX-laag | `spCombatSpeelFx`, `spCombatHeldHTML` |
| ✅ | **K** combo + eindrang | `spCombatRang` |
| ⬜ | **E** zwaktes per vijand | niet gekozen |
| ⬜ | **H** godengunst (limit break) via RELATION | niet gekozen |
| ⬜ | **I** vijandfases op 50% HP | niet gekozen |

Volledige technische beschrijving: `Chronica.md` §8 punt 1. De §9-tegenspraak
(discussiepunt 5) is opgelost.

**Twee dingen die nog een beslissing van Gerben vragen:**
1. **Hermes' kruid** is gedefinieerd maar nog nergens geplaatst — het is moly
   uit de Odyssee en er is geen Kirke-scène. Eén regel `INVENTORY: hermeskruid`
   in een scène naar keuze volstaat.
2. **Vraagtype 5 (zinsfragment)** heeft nu een startvoorraad van 22 zinnen
   (12 Latijn, 10 Grieks) in `CQ_ZINNEN`. Die zijn door mij geschreven en
   verdienen een redactieronde; uitbreiden is één entry per zin.

Cross-mode (§6) is nog **niet** gebouwd: `combat-questions.js` is al
modus-onafhankelijk geschreven, maar Battle/Boss/Total War gebruiken hem nog
niet.

---

## 1. Wat er nu staat (nulmeting)

De hele engine is ~130 regels in `certamen/singleplayer.js:2827-2993`, met
20 vijanden in `certamen/singleplayer-data.js:3823-3887`.

| Onderdeel | Huidige waarde |
|---|---|
| Start | CNS-scène met `COMBAT: <vijand-id>` → `spStartCombatFromScene` (`singleplayer.js:2852`) |
| Vraag | 1 type: LA/GR-woord → 4 NL-opties, uit `SP_STATE.vocab` (`spCombatNextQuestion:2871`) |
| Goed | +10 vastberadenheid (VB), gecapt op 20 |
| Fout | −5 VB, verder niets |
| Aanval | kost 20 VB → vaste 15 schade (`spCombatAttack:2982`) |
| Vijand | doet **niets**. Geen aanval, geen fase, geen status |
| Verliezen | onmogelijk |
| Visueel | statische PNG + `<div>`-HP-balk + 4 knoppen. Geen animatie, geen geluid, speler niet in beeld |
| Klasse/stats/uitrusting/eretitel | **nul** effect (wel al ontworpen in §8, niet gebouwd) |

**De kern van het probleem, in één zin:** er is per beurt maar één werkwoord
(*antwoord*), en de uitkomst ligt bij de start al vast. Hector = 90 HP = 6
aanvallen = 12 goede antwoorden. Altijd. Er valt niets te kiezen, niets te
verliezen en niets te ontdekken — dus is het een invulformulier met een
leeuw ernaast.

Educatief is het even smal: **één vraagtype** (receptief herkennen uit 4
opties), geen productie, geen morfologie, geen context, geen
foutcorrectie-moment, en geen enkele registratie van *welke* woorden een
leerling niet beheerst. De spaced repetition die er zit (elk `VOCAB:`-woord
uit alle gespeelde hoofdstukken blijft terugkomen) is toevallig goed, maar
volledig uniform random — een woord dat je vijf keer fout deed komt even
vaak terug als een woord dat je blind kent.

### Twee dingen die al klaarliggen en niet gebruikt worden

1. **Battle Mode's FX-laag.** `battle.js` heeft `BattleMotion.play()`,
   `bmFloat()` (zwevende schadegetallen, `battle.js:2208`), `bmProj()`
   (projectielen, `:2221`), `bmGlowFx()` (`:2234`), `renderPixelHero()`
   (`:2109`), plus ~20 keyframes in `index.html:642-700`
   (`bmAtkPixelR`, `bmPixelHit`, `bmHeal`, `bmShld`, `bmCombo`, `bmWin`,
   `weaponAttack`…). Chronica gebruikt hier **niets** van, terwijl de
   speler-avatar in hetzelfde formaat al gerenderd wordt op het
   statscherm (`singleplayer.js:1350`).
2. **Vigor.** `Chronica.md` §11.1 definieert al: *"Vigor (uithouding,
   afgeleid van Robur — loopt terug bij fysieke tegenslag, op nul volgt
   geen game over maar een afgedwongen scène)"*. Dat is exact het
   spanningsmechanisme dat combat mist, en het is al goedgekeurd binnen
   Chronica's toon. Het is nooit gebouwd.

### Op te lossen inconsistentie

`Chronica.md` §9 (regel 4340) zegt *"Combat = Battle Mode-mechaniek … Geen
parallel gevechtssysteem"*, terwijl §8 punt 1 (regel 4214) expliciet
beschrijft dat het juist een **eigen, lokale implementatie** is. §9 is
vermoedelijk een verouderde intentieverklaring. Voorstel: §9 corrigeren naar
*"eigen lus, gedeelde FX- en vraagbank-modules"* — dat is ook precies wat dit
voorstel voorstelt.

---

## 2. Waar we van lenen

| Bron | Wat we ervan overnemen |
|---|---|
| **Pokémon** | Zwaktes ("het is zeer effectief!"), statuseffecten, en het idee dat je een vijand pas goed verslaat als je hem *kent* |
| **Fire Emblem** | Eén betekenisvolle keuze per beurt met zichtbare voorspelling; vijand-intentie vóóraf zichtbaar; verwonding i.p.v. dood |
| **Final Fantasy** | Limit Break (opladende meter → cinematische speciale aanval); elementaire zwaktes; beurtvolgorde als resource |
| **Blooket / Gimkit** | Risico-keuze ("dubbel of niets"), streak-multipliers, power-ups, in-run-economie, en vooral: dezelfde vragenbank in wisselende jasjes |
| **Certamen Boss Mode** | Rage-meter, fases, baas-specifieke mechanieken per baas, schildfase (`bossbattle.js`, `bmBossResolveTick`) |
| **Slay the Spire** | Intent-badge boven de vijand — de goedkoopste spanning die er bestaat |

---

## 3. De nieuwe kernlus

```
BEURT
 ├─ 1. Vijand toont zijn INTENTIE      ("De Hydra spant zich — twee koppen laden op")
 ├─ 2. Speler kiest een AANVALSVORM    (makkelijk/middel/zwaar = risico vs. opbrengst)
 ├─ 3. Vraag → antwoord                (uit de vraagtype-bank van dit hoofdstuk)
 ├─ 4. Speler kiest een ACTIE          (Aanval / Verdedigen / Klassevaardigheid / Item / Bestuderen)
 └─ 5. Vijand voert zijn intentie uit  (kost Vigor, of legt een conditie op)
```

Twee dingen veranderen fundamenteel: er is **elke beurt iets te kiezen**, en
de vijand **doet iets terug**. De rest van dit document zijn de losse
modules die je in of uit kunt zetten.

---

## 4. De voorstellen

Elk voorstel: **wat**, **waarom**, **kosten** (S/M/L), en **educatieve
opbrengst**.

### A. Vijand-intentie + Vigor als inzet — `M`

De vijand krijgt per beurt een telegrafeerde intentie, zichtbaar als badge
boven de sprite: `⚔ Beet (−6 Vigor)`, `🛡 Verschanst zich (schade halveert)`,
`🔥 Laadt op — 2 beurten`. Bij het uitvoeren verlies je **Vigor**, niet HP.

Vigor op 0 is **geen game over** — dat blijft de harde grens uit §7.6. In
plaats daarvan: een afgedwongen scène (§11.1 beschrijft dit al). Concreet
drie varianten, per gevecht in de data gekozen:
- *Een metgezel vangt de klap op* → NPC-RELATION −1, gevecht gaat door
- *Je wijkt terug* → gevecht gaat door, maar de vijand heelt 20% en je
  eindrang zakt naar één ster
- *Je wordt gered* → verhaalflag `gered_door_X`, betaalt later terug in de
  payoff-laag (Finale)

**Waarom.** Dit is het enige voorstel dat écht spanning toevoegt, en het
enige dat een reden geeft om te *verdedigen*. Zonder dit blijft elke andere
toevoeging cosmetisch.

**Bonus:** hiermee krijgt **harnas** eindelijk zijn logische taak (Vigor-
schade dempen) — natuurlijker dan de EP-boete-tabel die nu in §8 staat.

**Waarschuwing:** dit is het voorstel met het grootste toonrisico. Advies:
Vigor-verlies altijd klein en zichtbaar aankondigen, geen enkel gevecht mag
op Vigor 0 eindigen zonder narratieve opvang, en de docent moet het uit
kunnen zetten (`SP_SETTINGS.combatDruk = "zacht" | "normaal"`).

### B. Aanvalsvorm = moeilijkheidskeuze — `M` ★ *sterkste enkele idee*

Vóór elke vraag kiest de speler zelf hoe zwaar hij het zichzelf maakt:

| Keuze | Vraag | Opbrengst | Fout |
|---|---|---|---|
| **Snelle uitval** | 4-keuze betekenis (huidig) | +10 VB | −5 VB |
| **Gerichte slag** | vormvraag ("welke naamval is *urbem*?") | +15 VB | −5 VB |
| **Genadeslag** | typ de vorm / typ de vertaling | +25 VB | 0 VB, geen straf |

**Waarom dit het beste voorstel is.** Het lost in één mechaniek drie
problemen tegelijk op:
1. **Differentiatie binnen één klas** — de sterke leerling gaat sneller
   *door harder te werken*, de zwakke leerling komt er ook, alleen langzamer.
   Geen apart "makkelijke modus"-menu, geen stigma.
2. **Variabele gevechtslengte** — Hector is niet meer altijd 12 antwoorden.
3. **Productieve toetsing wordt aantrekkelijk** in plaats van opgelegd — je
   *kiest* zelf om te typen, omdat het loont.

De typed-input-machinerie bestaat al (`spCheckTypedLatinPuzzle:2609`,
`spCheckTypedGreekPuzzle:2698`, inclusief Grieks toetsenbord).

### C. Vraagtype-bank — `L` ★ *grootste educatieve winst*

Nu: 1 vraagtype. Voorstel: 6, als losse module (`combat-questions.js`) die
**ook Battle/Boss/Total War kunnen gebruiken**:

1. **Betekenis** LA/GR → NL (bestaand)
2. **Productie** NL → LA/GR (4 opties of getypt)
3. **Vormherkenning** — "*ἔλυσε*: welke tijd?" / "*urbem*: welke naamval?"
4. **Vormproductie** — "genitivus meervoud van *urbs*?" (getypt)
5. **Zinsfragment** — kies de juiste vertaling van een kort zinnetje;
   koppelt rechtstreeks aan de bestaande leesvallen-laag
6. **Etymologie** — "welk Nederlands woord komt van *tangere*?"

Elke vijand (of elk hoofdstuk) declareert waaruit hij put:
`vraagtypes:["betekenis","vorm_herkenning"]`. Zo wordt combat de
**retrieval practice van het hoofdstuk zelf** in plaats van een generieke
woordendrill — de Minotaurus toetst wat H4 leerde, Lethe toetst alles.

Type 3-4 kunnen grotendeels **automatisch gegenereerd** worden uit de
bestaande grammatica-tabellen; type 5 en 6 vragen handwerk per hoofdstuk.
Voorstel: bouw 1, 2, 3 en 6 eerst (die zijn genereerbaar), 4 en 5 gefaseerd.

### D. Leitner-mastery + micro-onderwijs bij fout — `M` ★ *onzichtbaar, maar didactisch het belangrijkst*

Twee kleine ingrepen met groot effect:

1. **Per woord een mastery-box (0-5)** in `SP_STATE.mastery`. Selectie
   weegt naar zwakke woorden i.p.v. `pick()` uniform random. Fout →
   box terug naar 0 én **hetzelfde woord komt binnen dezelfde beurtenreeks
   nog één keer terug** (directe hertoetsing is een van de best onderbouwde
   retrieval-effecten die er zijn).
2. **Micro-onderwijs bij een fout antwoord.** Nu: *"Het juiste antwoord was
   X."* Voorstel: één regel context erbij — *"tangere — aanraken; vgl. NL
   tangens, intact, contact."* Van een straf naar een leermoment, en het
   maakt fout antwoorden minder frustrerend terwijl ze zwaarder gaan wegen.

Levert bovendien gratis een **docentrapport** op: welke woorden/vormen
struikelt deze leerling (of deze klas) structureel over. Dat is misschien
wel de meest verkoopbare feature van de hele lijst.

### E. Zwaktes ontdekken — `M`

Elke vijand krijgt een `zwakte`: een vraagcategorie die **+50% schade** doet.
De Hydra is zwak voor **werkwoordsvormen** (koppen die terugkomen ↔ tijden);
de Sfinx voor **etymologie/raadsels**; de Bataven voor **zinsfragmenten**
(ze vechten op een slagveld dat geen handboek beschrijft — dus lees het
terrein). Narratief te verantwoorden per vijand.

Ontdekken kan op drie manieren, en dát is de clou:
- de **Codex** raadplegen vóór het gevecht (eindelijk een spelreden om te
  lezen wat je verzamelde)
- de actie **Bestuderen** (kost een beurt, onthult de zwakte)
- **automatisch** bij hoge *Prudentia*, of via de Sagittarius-vaardigheid
  *Ex longinquo* (§11.2)

### F. Actiekeuze + klassevaardigheid — `M`

De ene knop "⚔️ Aanval" wordt een rij:

| Actie | Kosten | Effect |
|---|---|---|
| **Aanval** | 20 VB | schade naar wapen-tier (§8: 15/18/22) |
| **Verdedigen** | 10 VB | halveert de volgende vijand-intentie (Hopliet: +1 VB extra, bestaande passive) |
| **Klassevaardigheid** | 30 VB | 1× per gevecht, per klasse verschillend |
| **Item** | 0 VB | verbruikt een verhaal-item (zie G) |
| **Bestuderen** | 0 VB, kost de beurt | onthult zwakte + intentie van de hele fase |

De drie Chronica-klassen hebben in `battle-data.js:17-52` al passives en
vaardigheden liggen; hergebruik de namen zodat het één wereld blijft:
- **Hopliet** → *Schildmuur*: negeer de volgende twee intenties
- **Boogschutter** → *Zwak Punt*: dubbele schade als vijand ≤30% HP
- **Cavalerie** → *Stormloop*: aanval zonder VB-kosten, maar volgende vraag
  telt dubbel bij fout

En hiermee gaan **stats** (§11) eindelijk iets doen in combat: Vis → +schade,
Robur → +max Vigor, Ingenium → hint bij getypte vragen, Prudentia →
zwakte automatisch zichtbaar, Gratia → godengunst laadt sneller (zie H).

### G. Items uit het verhaal — `S`

De `INVENTORY:`-sectie wordt al geparsed (`Chronica.md` regel 252) maar doet
niets. Voorstel: een handvol eenmalige gevechtsitems die je **in het verhaal
vindt** — Hermes' kruid (herstel Vigor), een fakkel (voorkomt Hydra-
regeneratie, precies zoals de mythe), een wijnzak (centauren slaan een beurt
over). Verhaal → gevecht → verhaal, met minimale techniek.

### H. Godengunst (Limit Break) — `M` ★ *sluit aan op de payoff-laag*

Een tweede meter die over het hele gevecht vult bij goede antwoorden. Vol =
één cinematische, verhalende ingreep. **Welke god ingrijpt hangt af van je
RELATION-flags** — Athena als je haar mentorschap volgde, Apollo als je in
H-lijn X koos, niemand als je iedereen tegen je in het harnas joeg (en dan
is het een *menselijke* metgezel).

Dit is de goedkoopste manier om Gerbens "echte Mass Effect-idee" ook *in
combat* te laten landen, in plaats van alleen in dialoog en de Finale. Het
leest de bestaande RELATION-data; er hoeft geen nieuwe administratie bij.

### I. Fases en vijand-eigen mechanieken — `M`

Boss Mode's precedent (`bmBossResolveTick`) naar Chronica halen, maar dan
solo. Op 50% HP verandert de vijand:
- **Hydra** — laat een kop teruggroeien (+10 HP) tenzij je de fakkel hebt of
  in die beurt een Genadeslag deed. De koppen-sprite ondersteunt dit al
  volledig (`spCombatAliveHeads:2909`).
- **Minotaurus** — razernij: intenties worden zwaarder, maar zijn schade
  gaat omhoog én zijn HP-verlies ook (risico/beloning)
- **Hector** — weigert nog langer te vluchten: alleen Genadeslagen doen nog
  volle schade (Fire Emblem-achtige duel-fase)
- **Lethe** (Finale) — wist per fase één van je verworven bonussen; je moet
  het gevecht "opnieuw leren"

Alleen voor de ~6 belangrijkste vijanden; de andere 14 blijven simpel. Dat
houdt het bouwbaar én zorgt dat een bossfight *voelt* als een bossfight.

### J. Visueel + audio — `S` ★ *beste verhouding effect/moeite*

Puur hergebruik van wat er al staat in `battle.js` en `index.html`:

- **Zet de speler in beeld.** Zijn pixel-held links, vijand rechts
  (`renderPixelHero`, `singleplayer.js:1350` doet dit al op het statscherm).
  Nu kijk je naar een monster zonder jezelf te zien — dat is de helft van
  het probleem van "saai".
- **Zwevende schadegetallen** — `bmFloat("-18","#e05555")`, bestaat al
- **Uitval-animatie + treffer-flits** — `bmAtkPixelR` / `bmPixelHit`,
  bestaan al
- **Projectiel voor de Boogschutter** — `bmProj("🏹","A")`, bestaat al
- **Combo-flits** bij 3 goed op rij — `bmCombo` + `bmGlowFx`, bestaan al
- **Kritieke HP-balk** (rood, pulserend) — `.bm-crit`, bestaat al
- **Schermschud** bij een vijand-intentie — `bmBad`, bestaat al
- **SFX** — `assets/chronica/sfx/` is momenteel **leeg**; ~6 geluiden
  (treffer, misser, combo, godengunst, overwinning, vijand-intentie)
- **Intro-kaart** bij de start van een gevecht: naam + `intro`-tekst
  (staat al in de data!) + sprite die in beeld schuift. Nu wordt die mooie
  `intro`-tekst nergens getoond tijdens het gevecht zelf.
- **Uit-schakelaar**, zoals `BM_META.animations` in Battle Mode — iPad,
  prikkelgevoeligheid, en docenten die tempo willen.

### K. Combo-meter en eindrang — `S`

- **Combo**: 3 goed op rij = +25% schade tot je een fout maakt. Blooket-
  gevoel, één regel code, direct merkbaar.
- **Eindrang** in plaats van "gewonnen": ⭐ *Victoria* / ⭐⭐ *Victoria clara*
  / ⭐⭐⭐ *Victoria splendida*, op basis van accuratesse, beurten en
  Vigor-verlies. Voedt de Kroniek, eventueel munten en een skillpoint-bonus.
  Geeft eindelijk een reden om een gevecht *goed* te doen in plaats van
  alleen te doorstaan — zonder ooit een faalstaat te introduceren.

---

## 5. Voorgestelde fasering

**Pakket 1 — "het voelt als een gevecht"** (J + K + A-light)
Geen curriculum-wijziging, geen datamigratie, bijna alles hergebruik.
Speler in beeld, animaties, schadegetallen, geluid, combo, eindrang, en de
intent-badge (eerst nog zonder Vigor-gevolgen). *Dit alleen al haalt de
grootste klacht weg.*

**Pakket 2 — "er valt iets te kiezen"** (B + F + A-volledig + G)
Moeilijkheidskeuze, actiekeuze, klassevaardigheid, Vigor, items, en de
wapen/harnas/stat-bonussen uit §8 die toch al op de rol stonden.

**Pakket 3 — "het leert echt beter"** (C + D + E + I + H)
Vraagtype-bank, Leitner-mastery, micro-onderwijs, zwaktes, fases,
godengunst, docentrapport.

Alle nieuwe velden op `SP_COMBAT_ENEMIES` (`zwakte`, `fases`, `intenties`,
`vraagtypes`) worden **optioneel** — de 20 bestaande vijanden blijven
zonder aanpassing werken en krijgen gaandeweg verrijking.

---

## 6. Wat dit oplevert voor Certamen (Battle / Boss / Total War)

Dit is geen bijvangst; drie voorstellen zijn in Certamen mogelijk *meer*
waard dan in Chronica:

| Voorstel | Waarde voor Certamen |
|---|---|
| **C. Vraagtype-bank** | Battle/Boss/Total War toetsen nu ook alleen meerkeuze-vocabulaire. Eén gedeelde module tilt de didactische waarde van álle modi tegelijk op. |
| **B. Moeilijkheidskeuze** | Lost het lastigste probleem van een klas-vs-klas-spel op: differentiatie binnen één team, zonder dat iemand "de makkelijke knop" krijgt toegewezen. |
| **D. Leitner + docentrapport** | Per-leerling zwakke-woordenlijst uit echte speeldata. Dit is een feature die op zichzelf al reden is om Certamen te gebruiken. |
| **E. Zwaktes** | In Boss Mode wordt dit coöperatief: "de baas is nu zwak voor genitivus" dwingt de klas om te overleggen — precies wat Boss Mode wil zijn. |
| **H. Godengunst** | Boss Mode-team-ultimate bij volle klas-combo. |
| **A. Intent-telegrafie** | Boss Mode heeft Rage al; expliciete intentie erbij maakt de dreiging leesbaar in plaats van plotseling. |

En andersom: Chronica leent Boss Mode's fase-engine en Battle Mode's
FX-laag. Voorstel om dat te formaliseren als **twee gedeelde modules** —
`combat-fx.js` (animatie/geluid, nu opgesloten in `battle.js`) en
`combat-questions.js` (vraaggeneratie, nu drie keer apart geïmplementeerd:
`spCombatNextQuestion`, `spRaceNextQuestion` en Battle Mode's eigen lus).

---

## 7. Discussiepunten voor ons gesprek

1. **Hoe hard mag Vigor bijten?** Dit is de enige echte toonvraag. Mijn
   voorstel houdt "geen game over" volledig overeind, maar het is de eerste
   keer dat een gevecht slecht kan aflopen. Wil je dat?
2. **Duur.** Een rijkere beurt mag een gevecht niet twee keer zo lang maken.
   Voorstel: hou het aantal beurten gelijk (~8-12) en maak elke beurt rijker,
   niet langer.
3. **Voorstel B eerst?** Als je maar één ding uit dit document zou bouwen,
   is de moeilijkheidskeuze de meest verantwoorde keuze — maar Pakket 1 is
   sneller zichtbaar. We kunnen ook B *in* Pakket 1 trekken.
4. **Vraagtype 5 en 6** (zinsfragment, etymologie) kosten redactiewerk per
   hoofdstuk. Is dat werk dat je wilt doen, of houden we het bij wat
   generatie kan?
5. **§9 corrigeren** — de tegenspraak met §8 opruimen zolang we er toch zijn.
