# Battle Mode — Volledig visiondocument

## Kern-idee

Twee teams strijden in realtime om woordkennis. Elk correct antwoord levert **Battle Energy (BE)** op. BE besteed je aan acties: aanvallen, verdedigen of helen. Het team waarvan de **Army Health** als eerste op nul staat, verliest. De docent is host en ziet beide legers op het projectiescherm.

---

## Identiteitssysteem

Leerlingen loggen in met een **klascode** (van de docent) en een **zelf gekozen leerlingcode**. Geen Google- of Apple-account nodig.

- Pad in Firebase RTDB: `/identities/{klascode}/{leerlingcode}`
- Velden: `name`, `coins`, `xp`, `avatar`, `color`, `classHistory`, `achievements`
- Lokaal opgeslagen in `localStorage` onder sleutel `certamen_battle_identity`

### Cross-device sync (ook buiten Battle Mode)

**Principe: opgebouwde progressie (xp, en later coins/andere resources) hoort
online opgeslagen te worden, zodat elk toestel met dezelfde identiteit
hetzelfde laat zien.** Puur lokale (`localStorage`-only) opslag is alleen
acceptabel voor spelers zonder gekoppelde identiteit — zodra er een klascode +
leerlingcode is, is Firebase de bron van waarheid.

Dit is doorgevoerd voor **xp**, ook voor het algemene profiel (`P` in
`core.js`) dat oorspronkelijk puur lokaal was en dus tussen toestellen kon
verschillen:

- `certamen/core.js`: `profileIdentity()` / `profileIsLinked()` hergebruiken
  dezelfde identiteit als Battle Mode (`bmIdentLoad()`) — geen los systeem.
  `addXP(n, skipSync)` roept `syncXpDelta(n)` aan, die de xp-winst zowel lokaal
  (`P.xp`) als in `/identities/{klas}/{lcode}/xp` (via een Firebase
  `transaction()`, dus veilig bij bijna-gelijktijdige schrijfacties vanaf
  meerdere toestellen) bijwerkt. `skipSync=true` wordt gebruikt door
  aanroepers die de identiteit al zelf hebben weggeschreven (bv.
  `bmAwardBattle`), om dubbeltelling te voorkomen.
  `syncProfileFromCloud(rerenderScreen)` haalt de laatste stand op zodat een
  toestel dat al even een tabblad open had staan zichzelf bijwerkt.
- `certamen/games.js`: `SCREENS.collection` ("Mijn profiel", buiten Battle
  Mode) toont een koppel-status en roept `syncProfileFromCloud("collection")`
  aan. Nog geen identiteit? Dan verschijnt "Koppel dit toestel" (hergebruikt
  `bmIdentDoLogin`, dezelfde klascode/leerlingcode-flow als Battle Mode) —
  koppelen is nooit verplicht; zonder koppeling blijft alles lokaal werken
  zoals voorheen.

**Volgende stap (nog niet gedaan):** hetzelfde patroon toepassen op `P.coins`
(en eventuele toekomstige resources) zodra de algemene muntenopbouw dat nodig
heeft — reken niet op `localStorage` als enige opslag zodra iets als
"opgebouwde voortgang" bedoeld is.

---

## Battle Energy (BE)

| Situatie | BE-winst |
|---|---|
| Correct antwoord | +3 BE |
| Correct én snel (> helft tijd resterend) | +4 BE |
| Fout antwoord | 0 BE |
| Hopliet kiest Verdedigen (passief) | +1 extra BE |

BE accumuleert over rondes. Acties kosten BE; als je niet genoeg hebt, kun je die actie niet kiezen.

---

## Klassen (M3: 8 gebouwd · M6: 4 extra facties-klassen gepland, nog niet gebouwd)

Alle balanswaarden staan in `BM_CLASSES`, `BM_SYNERGY` en `BM_COMBOS` in
`certamen/battle-data.js`. Elke klasse heeft 5 abilities (2× basic, 2×
medium, 1× legendary-tier) — de tabel hieronder toont per klasse één
representatief voorbeeld per kolom (Basis/Geavanceerd/Ultiem), niet alle 5.

### Alle 8 klassen

| Klasse | Passief | Basis (BE) | Geavanceerd (BE) | Ultiem (BE) |
|---|---|---|---|---|
| **Hopliet** | +1 BE bij Verdedigen | Schildmuur +4 schild (2) | Formatie team +2 BE (5) | Achilleshiel bypass +6 (9) |
| **Spartaan** | +20% aanvalsschade | Speeraanval +6 dmg (3) | Berserk +9 dmg (5) | Leeuwensprong bypass +14 (10) |
| **Boogschutter** | +1 schade bij aanval | Pijlregen +5 dmg (3) | Zwak punt +7/+17 dmg (5) | Dodenarrow +13 dmg (9) |
| **Cavalerie** | +2 BE bij snel correct | Charge +7 dmg (3) | Flankbeweging +5 dmg +3 schild (5) | Stormloop +13 dmg (9) |
| **Priester** | +1 heling bij helen | Gebed +9 heal (3) | Zegen team +3 BE (5) | Godenvuur +12 heal +4 dmg (9) |
| **Centurio** | +1 BE per ronde (altijd) | Bevel +3 schild (2) | Strijdformatie team +3 BE (4) | Testudo +7 schild + team +2 BE (8) |
| **Genie** | Aanvallen -2 vijandelijk schild | Katapult +5 dmg (3) | Valgreppel -6 vijandelijk schild (4) | Vuurtoren +9 dmg -4 schild (8) |
| **Verkenner** | Basis-abilities -1 BE | Verkenning +4 dmg -2 schild (2) | Sabotage -6 vijandelijk schild (4) | Hinderlaag +10 dmg +3 schild (7) |

### M6-klassen (gepland)

Farao, Druide, Augur, Pontifex (fractieklassen -- zie Facties)

---

## Ability-typen (resolutie-engine)

| Type | Effect |
|---|---|
| `attack` | Schade op vijandelijk team (passieven: atk_flat, atk_bonus) |
| `attack_bypass` | Schade die tegenschild volledig omzeilt |
| `attack_weakspot` | Schade; bonus als vijand <= 30% HP |
| `attack_and_defend` | Schade + schild voor eigen team |
| `attack_and_shld_remove` | Schade + verwijder vijandelijk schild |
| `attack_siege` | Schade + verwijder vijandelijk schild |
| `team_shield` | Schild voor eigen team |
| `heal` | Heling voor eigen team |
| `heal_and_attack` | Heling + schade |
| `team_be` | Bonus BE voor alle teamgenoten |
| `testudo` | Schild + team BE |
| `shield_remove` | Verwijder vijandelijk schild |

Schild absorbeert inkomende schade voor berekening. Bypass-schade telt apart. Niet bestede BE blijft behouden.

---

## Synergie (M3)

Flat BE-bonus per speler per ronde op basis van klassendiversiteit in het team:

| Unieke klassen in team | BE-bonus per speler per ronde |
|---|---|
| >= 3 | +2 BE |
| >= 5 | +4 BE |
| >= 7 | +6 BE |

Waarden in `BM_SYNERGY` in de code (aanpasbaar).

---

## Combo-abilities (M3)

Beide spelers kiezen "Combo" in dezelfde ronde; de host detecteert het bij resolutie.

| Combo | Klassen | Kosten | Effect |
|---|---|---|---|
| Schildmuur met Schieten | Hopliet + Boogschutter | 4 BE elk | +6 schild + +6 dmg |
| Strijdszegen | Priester + Spartaan | 4 BE elk | Heel team +5 BE |
| Vuursalvo | Genie + Boogschutter | 4 BE elk | +12 dmg |
| Testudo-formatie | Centurio + Hopliet | 4 BE elk | +10 schild voor team |
| Hinderlaag & Aanval | Verkenner + Cavalerie | 4 BE elk | +13 dmg + -3 vijandelijk schild |
| Genezende Vesting | Priester + Genie | 4 BE elk | +10 heal + -4 vijandelijk schild |
| Verkende Aanval | Verkenner + Boogschutter | 4 BE elk | +10 dmg + -4 vijandelijk schild |

Waarden in `BM_COMBOS` (`certamen/battle-data.js`) in de code (aanpasbaar).

---

## Facties / Thema's (M4)

De docent kiest vóór het gevecht een **factie**. Dit herthemert de volledige presentatie — teamnamen, kleuren, iconen, slagvelduitstraling — terwijl de spellogica identiek blijft.

### Startfacties (`BM_FACTIONS` in de code)

| Id | Naam | Team A | Team B |
|---|---|---|---|
| `rome_gaul` | Romeinen vs Galliërs *(standaard)* | Legio Romani (rood) | Gallische Stam (groen) |
| `athene_sparta` | Athene vs Sparta | Atheners (blauw) | Spartanen (donkerrood) |
| `grieken_perzen` | Grieken vs Perzen | Hellenen (blauw) | Perzen (paars) |
| `rome_carthago` | Romeinen vs Carthago | Legio Romani (rood) | Carthago (goud) |
| `grieken_trojanen` | Grieken vs Trojanen | Grieken (blauw) | Trojanen (goud) |
| `goden_titanen` | Goden vs Titanen | Olympiërs (goud) | Titanen (dieppaars) |

### CSS-themasysteem

Elke factie overschrijft CSS-variabelen op `:root`:
- `--teamA`, `--glowA`: kleur en glow van team A
- `--teamB`, `--glowB`: kleur en glow van team B
- Optioneel: `--stone`/`--stone2`/`--stone3`/`--stone4` (bijv. Goden vs Titanen gebruikt een paars steenpalet)

`bmApplyTheme(id)` slaat de huidige waarden op en overschrijft ze. `bmClearTheme()` zet ze terug (aangeroepen door `bmLeave()`). Alle M1–M3-schermen pikken de theming automatisch op via de CSS-variabelen.

### Klasse-labeloverschrijvingen

Facties kunnen optioneel weergavenamen van klassen aanpassen (`classLabels`), bijv. `priester → Orakel` bij Goden vs Titanen. De onderliggende class-id's blijven ongewijzigd.

### Opslag

De geselecteerde factie wordt opgeslagen als `meta.theme` in de Firebase-kamer (host-gestuurd). Leerlingen ontvangen de theming automatisch via hun bestaande `meta`-abonnement.

### Nieuwe factie toevoegen

Voeg één entry toe aan `BM_FACTIONS` — geen andere code wijzigen.

---

## Slagveld-animaties (M5)

### Architectuur

Animaties draaien volledig **client-side**. De enige Firebase-sync is het log-event dat de host schrijft na resolutie (`rooms/{code}/log`). Clients abonneren via `.limitToLast(1).on("child_added")` en triggeren lokaal `bmPlayAnimations(entry)`. Geen enkele animatietoestand wordt gesynchroniseerd.

### Formatie-indeling (host-scherm)

```
[ Achter (ranged) | Midden (support) | Voor (tanks) ]  vs  [ Voor (tanks) | Midden (support) | Achter (ranged) ]
  Boogschutter        Priester           Hopliet              Hopliet          Priester          Boogschutter
  Cavalerie           Genie              Spartaan             Spartaan         Genie             Cavalerie
  Verkenner                              Centurio             Centurio                           Verkenner
```

Team A staat links (front rechts, richting vijand), Team B staat rechts (front links, richting vijand).

### Animatie-overzicht

| Type | CSS-keyframe | Trigger |
|---|---|---|
| Idle | `bmIdle` — 2px op-neer (staggered per avatar) | Altijd actief tussen rondes |
| Correct antwoord | `bmOk` — schaal + sprong | `bmAnswer()` op spelerscherm |
| Fout antwoord | `bmBad` — schud horizontaal | `bmAnswer()` op spelerscherm |
| Aanval (melee) | `bmAtkR`/`bmAtkL` — 20px naar vijand | Log-event `anim:"attack"` |
| Charge (Cavalerie) | `bmChgR`/`bmChgL` — 32px, terugstoot | Log-event, klasse `cavalerie` |
| Geraakt | `bmHit` — schuiven + opacity flash | Na aanval-animatie (+320ms) |
| Heling | `bmHeal` — schaal + groene kleurshift | Log-event `anim:"heal"` |
| Schild | `bmShld` — blauwe glow ring | Log-event `anim:"shield"` |
| Combo flash | `bmCombo` — schaal + brightness burst | Log-event `type:"combo"` |
| Overwinning | `bmWin` — springen (3×) | Na `winner` in log |
| Nederlaag | `bmLose` — zakken + fade out | Na `winner` in log (verliezend team) |
| Kritieke health (<25%) | `bmCrit` — health-balk pulseert rood | `bmBuildBattlefield()` |

### Projectielen

| Klasse | Emoji | Animatie |
|---|---|---|
| Boogschutter | 🏹 | Lineaire vlucht (`bmProjR`/`bmProjL`) |
| Genie | 🪨 | Boog-traject (`bmArcR`/`bmArcL`) |
| Verkenner | ⚡ | Lineaire vlucht (sneller) |
| Combo | ✨ | Lineaire vlucht |

### Prestaties — Chromebook-overwegingen

- **Geen layout-reflow**: alle animaties gebruiken uitsluitend `transform` en `opacity` (GPU-pad).
- **`will-change: transform`** op `.bm-av .avc` voor pre-compositing.
- **Stagger**: idle-animaties hebben per avatar een versprongen `animation-delay` (0–2.1 s) zodat ze niet synchroon lopen.
- **30 spelers**: 30 avatar-elementen × 1 idle-keyframe per 2,6 s. Meetbaar verwaarloosbaar op moderne Chromebooks (2021+). Op Chromebook gen. 1 (2013–2015) wordt `meta.animations=false` aanbevolen.
- **Animaties uit**: klasse `.bm-noanim` op `#bmField` onderdrukt alle keyframes en verbergt projectielen/gloed. Instelling `meta.animations=false` in de host-instellingen; doorgegeven via Firebase-meta.
- **Floating text**: maximaal 4 gelijktijdige `bm-float`-elementen; ze verwijderen zichzelf na 1,4 s.
- **Log-backfill**: `bmSubscribeLog` slaat de initiële Firebase-`child_added` over (backfill-guard) zodat geen animaties afspelen bij herverbinding.

### Log-entry structuur (na M5)

```
/rooms/{code}/log/{pushId}/
  round     — rondenummer
  events[]  — per speler: { pid, abilityId, team, dmg, heal, shld, cls, anim }
              per combo:  { type:"combo", comboId, team }
  efA, efB  — effectieve schade op team A resp. B
  healA, healB — totale heling per team
  newHA, newHB — nieuwe HP na ronde
```

`cls` en `anim` zijn M5-toevoegingen zodat clients de juiste animatie kunnen kiezen zonder `BM_PLAYERS` te kennen.

### `meta.animations` schakelaar

Instelbaar in de host-instellingen vóór het aanmaken van de kamer. Standaard: `true`. Bij `false`:
- Klasse `.bm-noanim` onderdrukt alle CSS-keyframes via `animation:none!important`
- Projectielen en gloed-effecten krijgen `display:none!important`
- Drijvende getallen worden niet aangemaakt

---

## Facties (M6 — persistent, ONTWERP, nog niet gebouwd)

> **Status: alleen ontwerp.** Niets hieronder bestaat in de code — geen
> faction-XP-veld, geen van de vier klassen (Farao/Druide/Augur/Pontifex,
> zie ["M6-klassen (gepland)"](#m6-klassen-gepland) hierboven, waarmee deze
> tabel nu consistent is gehouden). Niet te verwarren met `BM_FACTIONS`
> (`certamen/battle-data.js`) — dat is een **volledig ander, wél gebouwd**
> systeem: puur cosmetische thema's/kleuren voor één los gevecht (zie
> "Facties/Thema's (M4)" hierboven), geen persistente leerlinggroep.

Langdurige groepen waartoe leerlingen behoren, ongeacht het actuele gevecht. Elke factie heeft een eigen identiteit en faction-klasse:

| Factie | Sfeer | Exclusieve klasse |
|---|---|---|
| Legio Romani | Orde, discipline | Centurio (bestaande klasse) |
| Agora Athenai | Kennis, list | Augur (uit "M6-klassen (gepland)") |
| Sparta Kryptos | Kracht, geheimhouding | Spartaan (bestaande klasse) |
| Memphis Papyri | Magie, herstel | Farao (uit "M6-klassen (gepland)") |

Faction-XP en -rang zouden persistent moeten zijn (blijven over gevechtssessies heen) — ook dat is nog niet gebouwd.

---

## Rondelus

```
[Vraagfase]       Elke speler krijgt eigen vraag. Timer: instelbaar (8–15 s).
     ↓
[Actiefase]       Elke speler kiest een actie (max 10 s). Geen keuze = sparen.
     ↓
[Resolutie]       Host berekent schade/heling/schild. Schrijft teams.health naar RTDB.
     ↓
[Volgende ronde]  Host verdeelt nieuwe vragen (adaptief). Timer herstart.
```

**Host-autoritair**: alleen de host schrijft `teams.A.health` en `teams.B.health`. Nooit clientside.

---

## RTDB-datamodel

```
/rooms/{code}/
  meta/       game:"battle", lang, armyHealth, answerTimer, adaptive, theme, status
  pool/       [array van woordobjecten]
  state/      status, round:{ n, phase, deadline }, winner
  teams/      A:{ health, maxHealth }  B:{ health, maxHealth }
  players/{pid}/
              name, color, avatar, team, class
              be, correct, wrong, damage, healing
              answeredRound, lockedAction, currentQ, online
              identityKey  ("{klascode}:{leerlingcode}")
  log/{pushId}/  round, events[], dmgA, dmgB, healA, healB, newHA, newHB

/identities/{klascode}/{leerlingcode}/
              name, coins, xp, avatar, color, classHistory, achievements
```

---

## Balansgetallen — overzicht voor de docent

Dit zijn alle getallen die je kunt bijstellen zonder in de logica te hoeven zitten. Alles staat in de configuratietabellen in `certamen/battle-data.js` (zie [Overzicht configuratietabellen](#overzicht-configuratietabellen-battle-datajs)).

### BE-economie (antwoordfase)
| Situatie | BE |
|---|---|
| Correct antwoord | +3 |
| Correct én snel (> helft tijd resterend) | +4 (standaard) |
| Cavalerie: correct én snel | +5 (passief be_on_fast: +2) |
| Fout antwoord | 0 |

### Ability-kosten en -effecten per klasse
Zie tabel in §Klassen hierboven. Aanpassen: zoek de klasse in `BM_CLASSES` en wijzig `cost`, `dmg`, `heal`, `shld` of `teamBE`.

### Passief-waarden
| Klasse | Passief-type | Huidige waarde | Wat het doet |
|---|---|---|---|
| Hopliet | be_on_defend | 1 | Extra BE wanneer team_shield-ability gekozen |
| Spartaan | atk_bonus | 0.20 | Vermenigvuldigt aanvalsschade met (1 + val) |
| Boogschutter | atk_flat | 1 | Telt op bij elke aanval |
| Cavalerie | be_on_fast | 2 | Extra BE bovenop de standaard snelheidsbonus |
| Priester | heal_flat | 1 | Telt op bij elke healing-ability |
| Centurio | be_passive | 1 | Elke ronde gratis BE (ook zonder actie) |
| Genie | shld_pierce | 2 | Elke aanval verwijdert ook vijandelijk schild |
| Verkenner | cost_reduce | 1 | Verlaagt kosten van basic-tier abilities (min. 1) |

### Synergiebonus
In `BM_SYNERGY`: `{ minClasses, beBonus }`. Huidige waarden: 3 klassen → +2 BE, 5 → +4 BE, 7 → +6 BE per speler per ronde.

### Combo-kosten en -effecten
In `BM_COMBOS`: elke combo heeft `cost` (per speler), en effect-velden `dmg`, `shld`, `heal`, `teamBE`, `shldRemove`. Huidige standaard: 4 BE per speler.

### Legersterktes (instelbaar via host-settings)
50 / 100 / 150 / 200 HP. Aanpassen: `battleHostSettings`-scherm of de chips in de code.

### Antwoordtimer
8 / 10 / 12 / 15 seconden. De "snelheidsbonus" treedt in werking als meer dan de helft van de tijd over is.

---

## Architectuurhaken (leeg gelaten in M1, uitbreidpunten in code)

```javascript
// function bmCalcMorale(team){}      // M3: moreel geeft BE-bonus bij overwinning
// function bmCalcMomentum(round){}   // M3: correcte reeks geeft multiplicator
// function bmCalcSupply(round){}     // M4: voorraden beperken acties per ronde
// function bmCalcFortifications(){}  // M4: kasteelmuren als HP-buffer
// function bmHeroHealth(pid){}       // M5: eigen HP naast legersterkte
// function bmTargetSelection(){}     // M5: speler kiest doelwit
// function bmRespawn(pid){}          // M5: terugkomen na uitschakeling
// function bmCastleSiege(){}         // M4: burchtstorm als einddoel
// function bmObjectives(){}          // M5: neutrale doelpunten op de kaart
// function bmFogOfWar(pid){}         // M6: beperkt zichtveld per factie
// function bmCampaign(){}            // M6: meerdere gevechten, één campagne
// function bmGuilds(){}              // M6: permanente gilden / facties
// function bmRanked(){}              // toekomstig: competitief seizoensysteem
```

---

## Mijlpalenplan

| M | Inhoud | Status |
|---|---|---|
| **M1** | Identiteit · 3 klassen · 3 acties · rondelus · host panel · eindscherm | ✅ Gebouwd |
| **M2** | Klaslokaal-bestendig: harde deadlines · idempotente resolutie · reconnect · late join · scoped listeners · Chromebook-perf | ✅ Gebouwd |
| **M3** | 8 klassen · data-gedreven abilities · synergie · combo's · class mastery | ✅ Gebouwd |
| **M4** | Factie/thema-systeem · 6 startfacties · CSS-variabelen theming · docentkeuze via dropdown | ✅ Gebouwd |
| **M5** | Slagveld-animaties · formatie-layout · log-gestuurde client-side animaties · `meta.animations` schakelaar | ✅ Gebouwd |
| **M6** | Avatar-aanpassing (15 onderdelen) · XP/niveau 1–10 + Legioenster-prestige · class mastery ★–★★★★★ · achievements | ✅ Gebouwd — **behalve** de persistente facties-laag (Legio Romani/Agora Athenai/e.a., §"Facties (M6 — persistent)" hierboven): die bestaat alleen als ontwerp, geen code |
| **M7** | Snel setup-scherm · Live dashboard (avatar-kaarten, participatiebalk, pauze/sla over/herstart) · Award-ceremony · Analytics (HP-chart, top 5 gemiste woorden, leerlingentabel) · CSV-export | ✅ Gebouwd |
| **M8** | Modularisering (inmiddels 8 bestanden, zie [Definitieve bestandsstructuur](#definitieve-bestandsstructuur)) · War Mode-hooks gedocumenteerd | ✅ Gebouwd |
| **M9** | Verborgen traits (92 eerbewijzen totaal, 20 `cat:"geheim"`) · eerbewijs-ontgrendel-pop-up met lichtgloed | ✅ Gebouwd |
| *(toekomstig)* | Campaign builder voor docenten | — |

---

## Firebase verbindingslimiet (Spark-plan)

Het gratis Firebase Spark-plan staat **100 gelijktijdige verbindingen** toe per database.

| Scenario | Verbindingen |
|---|---|
| 1 host | 1 |
| 30 leerlingen | 30 |
| 50 leerlingen | 50 |
| **Totaal (50 leerlingen)** | **51** ✅ ruim binnen de limiet |

Elke browsertab telt als één verbinding. Bij 50 leerlingen + 1 host = 51 verbindingen — ruim onder de grens van 100. Pas bij ~90 leerlingen wordt upgraden naar Blaze relevant. Op Blaze geldt $0,06 per GB download en geen verbindingslimiet.

**Scoped listeners (M2):** spelers luisteren uitsluitend naar `state/round`, `state/status`, eigen `players/{pid}` en `teams`. Niet naar het volledige `players`-object (dat doet alleen de host). Dit beperkt ook de bandbreedte bij grote klassen.

---

## Technische conventies

- Screens: `battleHome`, `battleIdentity`, `battleJoin`, `battleHostSettings`, `battleHostLobby`, `battleHostGame`, `battlePlayerLobby`, `battlePlayerGame`, `battleResult`, `battleProfile`, `battleAvatarEdit`
- Alle leerling-gerichte tekst: Nederlands
- Code-identificatoren: Engels
- Firebase SDK: compat v10.12.5 (RTDB, geen Firestore)
- `node --check` na elke wijziging aan scriptblok
- Geen M2 beginnen zonder goedkeuring

---

## M6 — Avatar & Progressiesysteem ✅

### Avatar

Elke leerling heeft een vectoravatar opgebouwd uit **15 onderdelen**
(`BM_AVATAR_PARTS`, `certamen/battle-data.js`) — vier ontgrendel-types door
elkaar (niveau, mastery, Legioenster-prestige, munten):

| Onderdeel | Basisopties (geen ontgrendeling) | Vereist ontgrendeling |
|---|---|---|
| `geslacht` | Man, Vrouw | — |
| `huid` | Licht, Donker | — |
| `armor` (Wapenrusting) | Vodden, Mantel | Licht (Niv. 2), Middel (Niv. 5), Hopliet (Niv. 7), Zwaar (Niv. 9), Ceremonieel (Mastery ★★★★★) |
| `helm` | Geen, Bandana | Standaard (Niv. 2), Open (Niv. 4), Hopliet (Niv. 8), Kroon (Niv. 10) |
| `schild` | Geen | Rond (Niv. 3), Puntig (Niv. 3), Metaal Rond (Niv. 6), Metaal Puntig (Niv. 6) |
| `wapen` | Knuppel, Hooivork | Zwaard (Niv. 2), Speer (Niv. 2), Boog (Niv. 4), Staf (Niv. 4) |
| `haar` | Kort, Lang, Kaal | Wild (Niv. 5), Vlecht/Middel (Niv. 6), Knot/Hanekam (Niv. 7) |
| `haarkleur` | Blond, Bruin, Zwart, Rood | Blauw, Groen (beide Niv. 8) |
| `baard` (Gezichtshaar) | Geen, Snor, Baard, Baard en snor | Sik en snor (Niv. 7) |
| `cape` | Geen | Kort (Niv. 5), Lang (Niv. 7), Engelen-/Duivels-/Vlindervleugels (elk Legioenster ★1) |
| `capekleur` | 6 kleuren | — |
| `victoryAnim` (Overwinningsanimatie) | Juichen | Zwaard heffen (Niv. 5) |
| `extra` | Geen | 7 cosmetische opties, elk met munten (60–200) |
| `legendary` (Legendarische strijder) | Geen | Achilles/Ajax (500 munten), Odysseus/Aeneas (600 munten) — zie [M8: Legendarische bonussen](#overzicht-configuratietabellen-battle-datajs) |
| `prestige` (Legioensglans) | Geen | 7 gouden herkleuringen, elk bij het voltooien van één volledige eerbewijs-categorie (`achCategory`) |

De avatar wordt gerenderd als inline SVG via `bmAvatarSVG(av, size)`. Backward-compat: pre-M6 string-avatars worden via `bmAvatarMerge()` omgezet naar het nieuwe objectformaat.

Opgeslagen in `/identities/{klas}/{code}/avatar` (object).

### XP en niveaus (1–10)

XP-winst per gevecht (`bmAwardBattle()`, `certamen/battle.js`):

| Situatie | XP |
|---|---|
| Per correct antwoord | +2 |
| Deelname (vast, ongeacht resultaat) | +5 |
| Per beantwoorde ronde | +1 |
| Gewonnen als team | +15 |
| Scholar (≥90% correct, min. 5 vragen) | +8 |

Niveaus en titels staan in `BM_LEVELS` (`certamen/battle-data.js`) — **10
niveaus** (Tiro → Imperator), niet 20. Bij niveau-omhoog worden cosmetics
ontgrendeld; alle ontgrendeling-checks via `bmIsUnlocked(opt, ident)`. Voorbij
niveau 10 loopt XP door als Legioenster-prestige (★, zie `calcPrestige()`/
`xpBarInfo()` in `certamen/core.js`) — dat systeem ontgrendelt onder meer de
drie vleugel-capes hierboven.

### Class Mastery (0–5 sterren)

Score per klasse = `rounds * 5 + damage + healing`. Drempelwaarden in `BM_MASTERY_TIERS`.

- **★★★+**: +1 starting BE (minimale spelbonus; geschreven als `masteryBonus` op het player-node bij klassewissel)
- **★★★★★**: cosmetic unlock (`ceremonieel`-wapenrusting)

Mastery-voortgang staat in `/identities/{klas}/{code}/classHistory/{cls}`.

### Achievements (92 stuks, 74 daarvan Battle Mode-specifiek)

Alle eerbewijzen staan in één gedeelde `ACHIEVEMENTS_DEF` (`certamen/core.js`)
voor de hele app, niet alleen Battle Mode — verdeeld over de categorieën
(`cat:`) `algemeen` (8), `klassiek` (7), `battle` (8), `mastery` (17,
klasse-mastery ★3/★5 × 8 klassen + grootmeester), `boss` (5), `totalwar` (27,
inclusief de 22 vlaggenschip-eerbewijzen, zie TOTAL_WAR.md §3.7) en `geheim`
(20 verborgen traits, zie [M9](#m9--verborgen-traits-crusader-kings-stijl)).
Battle Mode-specifieke items (`mode:"battle"` — dus zichtbaar op
`battleProfile`) worden gecontroleerd na elk gevecht in
`bmCheckAchievements()`; de rest via het algemene `checkAch()` (core.js),
vanuit elke spelmodus. Opgeslagen als array van id-strings, ofwel
`/identities/{klas}/{code}/achievements` (Battle Mode, cross-device) ofwel
lokaal in `P.achievements` (overige modi, zie M9's architectuurregel).

### Nieuwe schermen

- **`battleProfile`** — niveau, XP-balk, class mastery per klasse, achievement-overzicht
- **`battleAvatarEdit`** — live SVG-preview per onderdeel, vergrendelde opties zichtbaar maar disabled

---

## M7 — Docent-dashboard & Analytics ✅

### Setup-scherm (< 30 sec)

Twee zones:
1. **Snelle instellingen** (altijd zichtbaar): factie/thema, antwoordtijd, knop "Gevecht aanmaken"
2. **Geavanceerde instellingen** (inklapbaar via `BM_ADV_OPEN`): legersterkte, adaptief leren, combo's, mastery-bonussen, animaties, geluidseffecten

### Live dashboard (`battleHostGame`)

- **Avatar-kaarten** (`.bm-pcard`): inline SVG-avatar + naam + klasse per speler
- **Statuspunt** (`.bm-pdot`): groen = antwoord gegeven · goud = actie vergrendeld · grijs = wacht
- **Participatiebalk**: visuele voortgangsbalk + "X/Y (Z%)" teller
- **Controlepaneel** (host-only):
  - ⏸ Pauzeer / ▶ Hervatten — bevriest deadline in Firebase, herstelt resterende tijd
  - ⏭ Sla ronde over — roept `bmDistributeQs(n+1)` aan
  - 🔄 Vervang vraag — nieuwe vraagdistributie voor dezelfde rondenummering
  - ↩ Herstart ronde — reset `answeredRound` + `lockedAction` van alle spelers, nieuwe deadline
  - ✕ Beëindig gevecht

### Award-ceremony (`battleHostAwards`)

Sequentieel onthullen (~3,5s per kaart) met `bmNextAward()`:
1. Winnaar-overlay (animatie)
2. Zes awards berekend via `bmComputeAwards(players, log)`:
   - ⚔️ Meeste Schade — hoogste `damage`
   - 🛡️ Beste Verdediger — meeste schild-events in log
   - 💚 Beste Support — hoogste `healing`
   - 📚 Scholar — hoogste correctheid (min. 3 vragen)
   - ⚡ Snelste Denker — laagste gemiddelde responstijd (min. 2 rondes)
   - 🤝 Beste Teamspeler — meeste combo-participaties (via `pids` in log-events)
3. Doorsturen naar Analytics

Data-flow: `BM_PLAYERS` wordt bewaard als `BM_AWARD_DATA` vóór `cleanup()`. Log wordt async opgehaald uit `/rooms/{code}/log`.

### Analytics (`battleHostAnalytics`)

**Klas-tab:**
- SVG lijndiagram HP-verloop per ronde (`bmHPChart`) — geen externe libraries
- Gemiddelde accuratesse klasse
- Top 5 gemiste woorden (opgeteld over alle spelers, uit `player.missed`)

**Leerlingen-tab:**
- Tabel gesorteerd op accuratesse; klikbaar voor detailpopup
- Detailpopup: avatar, accuratesse, gem. responstijd, schade, healing, top-5 gemiste woorden

**CSV-export** via `bmExportCSV()` (SheetJS) — kolommen: Naam, Klas, Klasse, Goed%, Goed, Fout, Gemiste woorden, Schade, Healing, Rondes actief.

### Datamodel-uitbreidingen (M7)

Nieuw per player-node in Firebase:
- `missed/{wordKey}/c` — aantal keer fout
- `missed/{wordKey}/p` — originele Latijnse/Griekse vorm
- `missed/{wordKey}/a` — correct antwoord
- `totalResponseMs` — cumulatieve responstijd in ms
- `respondCount` — aantal rondes beantwoord

Nieuw per log-entry:
- `participants` — aantal spelers dat de ronde beantwoordde
- `events[].pids` — array van PIDs bij combo-events

---

## M8 — Modularisering & Architectuurhaken ✅

### Definitieve bestandsstructuur

Sindsdien verder gesplitst — dit is de actuele structuur (regelaantallen zijn
momentopnames, groeien mee; `certamen/vocab.js` en de Total War-bestanden
staan hier niet in, zie het bestandsoverzicht in [CLAUDE.md](CLAUDE.md) resp.
TOTAL_WAR.md voor die):

```
certamen/
  index.html      HTML-skelet, CSS (incl. eerbewijs-pop-up), Firebase-config, CDN-tags, init-script (774 regels)
  core.js         Helpers, ACHIEVEMENTS_DEF, profiel (P), iconen, geluid, toast/eerbewijs-pop-up, router (637 regels)
  net.js          Firebase-init, FBNet, DemoNet, Net=null                                              (429 regels)
  games.js        Touwtrekken, Marathon, Snelvuur, docentenportaal — host- en speler-schermen           (1377 regels)
  battle-data.js  Battle Mode-configuratietabellen (zie hieronder) — puur data, geen logica              (365 regels)
  bossbattle.js   Boss Battle-presets + scripted baas-resolutie (bmBossResolveTick, zie BOSS_BATTLE.md) (263 regels)
  battle-motion.js BattleMotion state machine (avatar-aanvalsanimaties, hergebruikt door Training Mode)  (201 regels)
  battle.js       Battle Mode/Boss Battle-logica + alle schermen, War Mode-hooks                        (3634 regels)
```

Laadvolgorde in index.html: `Firebase CDN → core.js → net.js → games.js → battle-data.js → bossbattle.js → battle-motion.js → battle.js → map/provinces.js → totalwar.js → training.js → freepractice.js → init`.

Alle globale variabelen zijn gedefinieerd in core.js (SCREENS, go, cleanup, DRAFT, P, etc.) en zijn beschikbaar in alle modules die daarna laden.

### Overzicht configuratietabellen (battle-data.js)

| Tabel | Variabele | Inhoud |
|---|---|---|
| Klassen | `BM_CLASSES` | 8 klassen, elk met passive + 5 abilities |
| Synergieën | `BM_SYNERGY` | Teambonus bij specifieke klassencombinatie |
| Combo-abilities | `BM_COMBOS` | 7 combo's: vereisen 2 klassen + teamgenoot |
| Facties/Thema's | `BM_FACTIONS` | 6 facties (zie §Facties hierboven) + CSS-vars |
| Avatar-onderdelen | `BM_AVATAR_PARTS` | 15 secties, ontgrendelbaar via niveau/mastery/prestige/munten (zie M6) |
| Legendarische bonussen | `BM_LEGENDARY_BONUS` | 4 legendarische strijders, elk met een vaste %-gevechtsbonus |
| Eenmalige trait-munten | `TRAIT_COIN_BONUS` | Munten-bonus bij het ontgrendelen van bepaalde M9-traits |
| Niveaudrempels | `BM_LEVELS` | 10 niveaus (Tiro–Imperator), XP-drempel + titel per niveau |
| Mastery-tiers | `BM_MASTERY_TIERS` | 6 tiers (score → 0–5 sterren) |

Eerbewijzen (`ACHIEVEMENTS_DEF`, 92 stuks) staan **niet** in battle-data.js
maar in `certamen/core.js` — gedeeld met alle spelmodi, zie M6/M9 hierboven.

### War Mode — toekomstige systemen

Alle aansluitpunten staan als gedocumenteerde hooks onderaan `battle.js`. Naamconventie: `// WAR MODE HOOK: naam(params)` gevolgd door een `//`-beschrijving en het aansluitpunt in bestaande code.

| Hook | Signatuur | Omschrijving | Aansluitpunt |
|---|---|---|---|
| morale | `morale(teamId, delta)` | Moreel beïnvloedt BE-winst per ronde | `bmResolve()` — na correcte antwoorden-reeks |
| momentum | `momentum(teamId, delta)` | Hoog momentum → tijdelijke schade-bonus | `bmResolve()` — na streak |
| supplyCheck | `supplyCheck(teamId)` | Geeft false als acties beperkt zijn door gebrek aan voorraden | `bmDistributeQs()` — vóór ability-uitdeling |
| fortificationApply | `fortificationApply(teamId, type)` | Voeg versterking toe als HP-buffer | `bmResolve()` — action-fase, Fortify-ability |
| heroHealthUpdate | `heroHealthUpdate(pid, delta)` | Eigen HP per speler; bij 0 → respawn | `bmResolve()` — na teamHP-update |
| objectiveCaptured | `objectiveCaptured(objId, teamId)` | Registreer verovering van doelpunt | `bmResolve()` — als capture-conditie voldaan |
| fogOfWarUpdate | `fogOfWarUpdate(state)` | Herbereken zichtbaarheid per speler | `bmHostUpdatePlayers()` + `bmPlayerRender()` |

### Bekende beperkingen

- **Battle Mode vereist Firebase.** De drie bestaande modi werken ook in oefenmodus (DemoNet).
- **Host-autoritair patroon.** Alle HP-mutaties gaan via de hostbrowser. Bij host-disconnect stopt het gevecht.
- **Adaptief leren is rudimentair.** Gemiste woorden komen vaker terug via gewicht in `bmPersonalPool()`, maar er is geen volledige spaced-repetition-logica.
- **Maximale schaalgrootte niet getest boven 50 spelers.** Firebase-listeners zijn per room, maar rendering in `bmHostUpdatePlayers()` vervangt de volledige grid bij elke update.
- **Geen persistentie van Analytics.** Alle analytics worden client-side berekend uit het Firebase-log. Als de host de sessie afsluit vóór de analytics-pagina, is het log niet meer beschikbaar.

---

## M9 — Verborgen Traits (Crusader Kings-stijl)

Alle `cat:"geheim"`-eerbewijzen (`ACHIEVEMENTS_DEF`, core.js) hebben een
verborgen, complexe voorwaarde én een kleine **vlakke, niet-stapelende**
spelbonus zodra ze ontgrendeld zijn (op `geheim_rij` na — algemeen/cross-mode
en dus zonder gameplay-hook, zie tabel). Bewust géén %-multipliers (past niet
bij de bestaande anti-snowball-lijn, zie TOTAL_WAR.md §3.7 "vlaggenschipbonus
is bewust niet-stapelend"): dezelfde schaal als de bestaande `masteryBonus`
(★★★+ mastery → vlak +1 startBE).

**Onthulling**: `nm`/`ds` in `ACHIEVEMENTS_DEF` bevatten nu de echte naam/
voorwaarde (niet langer permanent `"???"`) — verborgen blijft alleen wát
ze zijn vóór ontgrendelen (`a.secret&&!got` in de renderfuncties toont dan
`🔒 ???`); ná ontgrendelen tonen profielscherm én de nieuwe pop-up (zie
onderaan) de echte tekst.

| Trait (id) | Voorwaarde | Bonus | Waar |
|---|---|---|---|
| `geheim_rij` ("Onfeilbare Reeks") | 20 vragen op rij goed, in élke spelmodus (`s.bestStreak`) | Eenmalig +15 munten (geen passief effect — algemeen, geen Battle Mode-economie om aan te haken) | `checkAch()`, core.js |
| `geheim_groot` ("Massale Slag") | Meegevochten in een Battle Mode-gevecht met ≥12 spelers (`totalPlayers`) | Vlak +1 BE per ronde | `bmDistributeQs()`, via `p.traitGroot` |
| `geheim_heal` ("Levensbron") | ≥40 HP genezen in één gevecht (`BM_MY_HEAL`) | Vlak +1 heling bij elke heal-ability | `bmCalcAbilityEffect()`, via `p.traitHeal` |
| `geheim_norage` ("IJzeren Kalmte") | Boss Battle gewonnen zonder dat de baas se rage-meter ooit vol liep (`rageMaxed`, sticky) | Vlak +1 BE per ronde | `bmDistributeQs()`, via `p.traitNorage` |
| `trait_ciceronianus` ("Ciceronianus") | 5 opeenvolgende antwoorden correct én binnen de laatste 5 sec. van de timer, in één gevecht (`BM_MY_CLUTCH_STREAK`/`BM_MY_CLUTCH_BEST`) | +1 extra BE bij elk snel-correct antwoord | `bmAnswer()` (client-side; de speler kent zijn eigen `BM_IDENT.achievements` al) |
| `trait_laconisch` ("Laconische Breviteit") | Gevecht gewonnen als Voorvechter (`spartaan`) zonder ooit een ability/combo te kiezen (`BM_MY_ABILITIES_USED===0`) | Vlak +1 schild bij elke `team_shield`/`testudo`-ability | `bmCalcAbilityEffect()`, via `p.traitLaconisch` |
| `trait_feniks` ("Feniks") | Minstens 1x herrezen in Heldenmodus (`p.timesRevived`, zie `bmRespawnProgress()`) én die speler eindigt als MVP (hoogste `damage`) van het winnende team | 1 herrijzing eerder nodig (`respawnRequired-1`, min. 1) | Uniek: **host-granted**, niet player-side. `bmCheckHostTraits()` draait direct na `bmComputeAwards()` in `battleHostAwards` en schrijft het eerbewijs rechtstreeks naar `identities/{klas}/{lcode}/achievements` via het player-node se `identityKey` — de speler hoeft dit zelf niet te kunnen detecteren of uitlezen (spelers zien elkaars stats nooit live, zie M2 "scoped listeners") |

Alle Battle Mode-trait-vlaggen (`traitLaconisch`/`traitFeniks`/`traitHeal`/
`traitGroot`/`traitNorage`/`traitPacifist`) worden op het player-node
geschreven in `bmPickClass()`, uitgelezen uit `BM_IDENT.achievements` —
zelfde reden als `masteryBonus`: `bmCalcAbilityEffect()`/`bmDistributeQs()`/
`bmRespawnProgress()` draaien host-side op het Firebase player-record, dat
geen `achievements`-array bevat. `geheim_groot`/`geheim_heal` waren vóór deze
sessie **nooit te behalen** (hun oude voorwaarde, `ctx.largeGame`/
`ctx.healOnly` in `checkAch()`, werd nergens ooit gezet) — nu verplaatst naar
`bmCheckAchievements()` met echte matchdata.

### Batch 2 — 13 extra traits (bewust soms "vreemd/onlogisch")

Puur-toeval-eerbewijzen naast de gebruikelijke skill-gebaseerde. Architectuur-
regel: alles wat uit een Battle Mode-gevecht komt hoort in de Firebase-
identity-pipeline (`mode:"battle"`, `bmCheckAchievements()`), **niet** in het
lokale `checkAch()`/`P.achievements` — dat blijft voorbehouden aan traits die
uitsluitend vanuit Training Mode ontstaan (`trait_zondagsrust`,
`trait_eenzame_bouwer`, die zelfs vereist dat er *nooit* Battle Mode gespeeld
is).

| Trait (id) | Voorwaarde | Bonus | Waar |
|---|---|---|---|
| `trait_exacte_nul` ("Exacte Nul") | Gevecht gewonnen met precies 0 BE over (`BM_MY_BE`) | Geen (badge) | `bmCheckAchievements()` |
| `trait_drieling` ("Drieling") | 3 gevechten op rij gewonnen met exact dezelfde eigen restant-HP (`P.stats.lastWinMargins`, lokaal, cap 3, reset bij verlies) | Eenmalig +10 munten | `bmAwardBattle()` |
| `trait_balans` ("Perfect in Balans") | Echt gelijktijdige dubbele-KO (`newHA<=0&&newHB<=0` in `bmResolve()`, nieuw veld `state.exactTie`) | Eenmalig +10 munten | **Host-granted**, voor alle spelers in de kamer, via `bmCheckHostTraits()` |
| `trait_stijlvol_verlies` ("Verlies met Stijl") | Hoogste schade van het hele gevecht (beide teams), maar op het verliezende team | Eenmalig +5 munten (troostprijs) | **Host-granted**, via `bmCheckHostTraits()` |
| `trait_stille_kracht` ("Stille Kracht") | Gevecht gewonnen met 0 eigen correcte antwoorden | Geen | `bmCheckAchievements()` |
| `trait_middelmatig` ("Bewust Middelmatig") | Alle 8 klassen gespeeld, nooit boven 1★ mastery (spiegelbeeld van `grootmeester`) | Geen | `bmCheckAchievements()` |
| `trait_pacifist` ("Pacifistische Priester") | Gevecht gewonnen als Priester zonder ooit een ability met een schade-`type` (`BM_DMG_TYPES`) te kiezen | Vlak +1 schild bij `team_shield`/`testudo` (`p.traitPacifist`) | `bmChooseAbility()` (tracking) + `bmCalcAbilityEffect()` (bonus) |
| `trait_nachtwacht` ("Nachtwacht") | Gevecht afgerond tussen 00:00–05:00 systeemtijd | Eenmalig +10 munten | `bmAwardBattle()` |
| `trait_marathonzitting` ("Marathonzitting") | 3 afgeronde gevechten binnen 1 uur (`P.stats.recentBattleTimestamps`, lokaal, geprund tot laatste uur) | Eenmalig +15 munten | `bmAwardBattle()` |
| `trait_draaideur` ("Draaideur") | ≥6 klassewissels in de lobby vóór het gevecht start (`BM_MY_CLASS_PICKS`) | Geen | `bmPickClass()` (tracking) |
| `trait_volledige_cirkel` ("De Volledige Cirkel") | Alle 8 klassen ooit voor het eerst gespeeld, in exact alfabetische volgorde van hun klasse-id (`ident.classPlayOrder`, Firebase, bijgewerkt in de `identRef.transaction()` van `bmAwardBattle()`) | Eenmalig +30 munten (grootste, want zeldzaamst) | `bmCheckAchievements()` |
| `trait_zondagsrust` ("Zondagsrust Doorbroken") | Trainingspunten verdiend op een zondag (`new Date().getDay()===0`) | Eenmalig +10 munten | `checkAch()`, vanuit `trAnswer()` (training.js) |
| `trait_eenzame_bouwer` ("Eenzame Bouwer") | ≥5 verschillende trainingsdagen (`P.stats.trainingPlayDates`, los van de algemene `playDates`) én nog nooit een Battle Mode-gevecht gespeeld (`battlesPlayed===0`) | Eenmalig +15 munten | `checkAch()`, vanuit `trAnswer()` |

Eenmalige munten-bonussen staan in `TRAIT_COIN_BONUS` (battle-data.js, naast
`BM_LEGENDARY_BONUS`) en worden na `bmCheckAchievements()`/
`bmCheckHostTraits()` toegepast via een losse `coins`-transaction — dus altijd
ná de gewone deelname/winst-munten, nooit dubbel bij een reeds ontgrendeld
trait.

### Eerbewijs-ontgrendel-pop-up

`toastAch(a)` (core.js) toont niet langer alleen de kleine `.toast`-balk
onderin, maar een prominente, gecentreerde pop-up (`#achpopBg`/`.achpop` in
index.html): medaillon met een pulserende lichtgloed erachter
(`.achpop-glow::before`, radial-gradient + `@keyframes achGlowPulse`), naam en
voorwaarde. Een wachtrij (`_achPopQueue`) toont meerdere gelijktijdig
ontgrendelde eerbewijzen na elkaar (3,2s zichtbaar, tikken op de pop-up
dismisst direct). Dit is dezelfde functie die al overal werd aangeroepen
(`checkAch()` voor alle spelmodi, nu óók `bmAwardBattle()`/
`bmCheckAchievements()` voor Battle Mode/traits) — geen aparte notificatie-
route per spelmodus nodig.

---

*© Gerben de Jong · 2026*
