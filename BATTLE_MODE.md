# Battle Mode — Volledig visiondocument

## Kern-idee

Twee teams strijden in realtime om woordkennis. Elk correct antwoord levert **Battle Energy (BE)** op. BE besteed je aan acties: aanvallen, verdedigen of helen. Het team waarvan de **Army Health** als eerste op nul staat, verliest. De docent is host en ziet beide legers op het projectiescherm.

---

## Identiteitssysteem

Leerlingen loggen in met een **klascode** (van de docent) en een **zelf gekozen leerlingcode**. Geen Google- of Apple-account nodig.

- Pad in Firebase RTDB: `/identities/{klascode}/{leerlingcode}`
- Velden: `name`, `coins`, `xp`, `avatar`, `color`, `classHistory`, `achievements`
- Lokaal opgeslagen in `localStorage` onder sleutel `certamen_battle_identity`

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

## Klassen (M3: 8 · M6: 12)

Alle balanswaarden staan in `BM_CLASSES`, `BM_SYNERGY` en `BM_COMBOS` in `certamen/index.html`.

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

Waarden in `BM_COMBOS` in de code (aanpasbaar).

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

## Facties (M6 — persistent)

Langdurige groepen waartoe leerlingen behoren, ongeacht het actuele gevecht. Elke factie heeft een eigen identiteit en faction-klasse:

| Factie | Sfeer | Exclusieve klasse |
|---|---|---|
| Legio Romani | Orde, discipline | Centurio |
| Agora Athenai | Kennis, list | Redenaar |
| Sparta Kryptos | Kracht, geheimhouding | Spartaan |
| Memphis Papyri | Magie, herstel | Farao |

Faction-XP en -rang zijn persistent (blijven over gevechtssessies heen).

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

Dit zijn alle getallen die je kunt bijstellen zonder in de logica te hoeven zitten. Alles staat in de drie configuratietabellen bovenaan het `<script>`-blok in `certamen/index.html`.

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
| **M6** | Avatar-aanpassing · XP/niveau 1–20 · class mastery ★–★★★★★ · achievements | ✅ Gebouwd |
| **M7** | Snel setup-scherm · Live dashboard (avatar-kaarten, participatiebalk, pauze/sla over/herstart) · Award-ceremony · Analytics (HP-chart, top 5 gemiste woorden, leerlingentabel) · CSV-export | ✅ Gebouwd |
| **M8** | Modularisering (core.js / net.js / games.js / battle.js) · War Mode-hooks gedocumenteerd · Analytics BATTLE_MODE.md bijgewerkt | ✅ Gebouwd |
| M8 | Campaign builder voor docenten | — |

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

Elke leerling heeft een vectoravatar opgebouwd uit 9 onderdelen:

| Onderdeel | Standaard opties | Vereist ontgrendeling |
|---|---|---|
| Helm | Standaard, Open | Federhelm (Niv. 5), Kroon (Mastery ★★★+) |
| Haar | Kort, Lang, Kaal | Vlecht (Niv. 3) |
| Gezichtshaar | Geen, Baard, Snor | — |
| Wapenrusting | Licht, Middel | Zwaar (Niv. 5), Ceremonieel (Mastery ★★★★★) |
| Schild | Rond, Ovaal, Vierkant | Toren (Niv. 7) |
| Wapen | Zwaard, Speer, Boog | Staf (Niv. 4) |
| Cape | Geen, Kort | Lang (Niv. 6) |
| Banierkleur | 12 kleuren | — |
| Overwinningsanimatie | Juichen | Zwaard heffen (Niv. 5) |

De avatar wordt gerenderd als inline SVG via `bmAvatarSVG(av, size)`. Backward-compat: pre-M6 string-avatars worden via `bmAvatarMerge()` omgezet naar het nieuwe objectformaat.

Opgeslagen in `/identities/{klas}/{code}/avatar` (object).

### XP en niveaus (1–20)

XP-winst per gevecht:

| Situatie | XP |
|---|---|
| Per correct antwoord | +10 |
| Per ronde actief meegedaan | +5 |
| Gewonnen als team | +25 |
| Scholar (≥90% correct, min. 3 vragen) | +10 |

Niveaus en titels staan in `BM_LEVELS` (aanpasbaar). Bij niveau-omhoog worden cosmetics ontgrendeld; alle ontgrendeling-checks via `bmIsUnlocked(opt, ident)`.

### Class Mastery (0–5 sterren)

Score per klasse = `rounds * 5 + damage + healing`. Drempelwaarden in `BM_MASTERY_TIERS`.

- **★★★+**: +1 starting BE (minimale spelbonus; geschreven als `masteryBonus` op het player-node bij klassewissel)
- **★★★★★**: cosmetic unlock (`ceremonieel`-wapenrusting)

Mastery-voortgang staat in `/identities/{klas}/{code}/classHistory/{cls}`.

### Achievements (13 stuks)

Gecontroleerd na elk gevecht in `bmCheckAchievements()`. Opgeslagen als array van id-strings in `/identities/{klas}/{code}/achievements`.

Categorieën: `first_blood`, `scholar`, `unbreakable`, `versatile`, `veteran` + één per klasse voor mastery ★★★★★.

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

```
certamen/
  index.html    HTML-skelet, CSS, Firebase-config, CDN-tags, init-script (486 regels)
  core.js       Vocab, helpers, CATS, profiel, iconen, geluid, toast, router  (250 regels)
  net.js        Firebase-init, FBNet, DemoNet, Net=null                        (53 regels)
  games.js      Touwtrekken, Marathon, Snelvuur — alle host- en speler-schermen (611 regels)
  battle.js     Battle Mode volledig — config, logic, schermen, War Mode-hooks  (2020+ regels)
```

Laadvolgorde in index.html: `Firebase CDN → core.js → net.js → games.js → battle.js → init`.

Alle globale variabelen zijn gedefinieerd in core.js (SCREENS, go, cleanup, DRAFT, P, etc.) en zijn beschikbaar in alle modules die daarna laden.

### Overzicht configuratietabellen (battle.js)

| Tabel | Variabele | Inhoud |
|---|---|---|
| Klassen | `BM_CLASSES` | 8 klassen, elk met passive + 3 abilities |
| Synergieën | `BM_SYNERGY` | Teambonus bij specifieke klassencombinatie |
| Combo-abilities | `BM_COMBOS` | 3 combo's: vereisen 2 klassen + teamgenoot |
| Facties/Thema's | `BM_FACTIONS` | 3 facties: Romein, Grieks, Vikingen + CSS-vars |
| Avatar-onderdelen | `BM_AVATAR_PARTS` | 7 secties, ontgrendelbaar via niveau/mastery |
| Niveaudrempels | `BM_LEVELS` | 20 niveaus, XP-drempel + titel per niveau |
| Mastery-tiers | `BM_MASTERY_TIERS` | 6 tiers (score → 0–5 sterren) |
| Achievements | `BM_ACHIEVEMENTS` | 13 achievements (id, naam, omschrijving) |

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

*© Gerben de Jong · 2026*
