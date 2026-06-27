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

## Facties (M6)

Langdurige groepen waartoe leerlingen behoren, ongeacht het actuele gevecht. Elke factie heeft een eigen identiteit en faction-klasse:

| Factie | Sfeer | Exclusieve klasse |
|---|---|---|
| Legio Romani | Orde, discipline | Centurio |
| Agora Athenai | Kennis, list | Farao (nee, Redenaar) |
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
  meta/       game:"battle", lang, armyHealth, answerTimer, adaptive, status
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
// function bmRanked(){}              // M7: competitief seizoensysteem
```

---

## Mijlpalenplan

| M | Inhoud | Status |
|---|---|---|
| **M1** | Identiteit · 3 klassen · 3 acties · rondelus · host panel · eindscherm | ✅ Gebouwd |
| **M2** | Klaslokaal-bestendig: harde deadlines · idempotente resolutie · reconnect · late join · scoped listeners · Chromebook-perf | ✅ Gebouwd |
| **M3** | 8 klassen · data-gedreven abilities · synergie · combo's · class mastery | ✅ Gebouwd |
| M4 | Kasteelmuren · voorraden · burchtstorm-einddoel | — |
| M5 | Eigen HP · doelkeuze · respawn · doelpunten op kaart | — |
| M6 | Facties · campagne · fog of war | — |
| M7 | Ranked seizoen · leaderboard | — |
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

- Screens: `battleHome`, `battleIdentity`, `battleJoin`, `battleHostSettings`, `battleHostLobby`, `battleHostGame`, `battlePlayerLobby`, `battlePlayerGame`, `battleResult`
- Alle leerling-gerichte tekst: Nederlands
- Code-identificatoren: Engels
- Firebase SDK: compat v10.12.5 (RTDB, geen Firestore)
- `node --check` na elke wijziging aan scriptblok
- Geen M2 beginnen zonder goedkeuring

---

*© Gerben de Jong · 2026*
