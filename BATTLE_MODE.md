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

## Klassen (M1: 3 · M3: 8 · M6: 12)

### M1-klassen

| Klasse | Passief | Basis-actie (M3) | Geavanceerd (M3) | Ultiem (M5) |
|---|---|---|---|---|
| **Hopliet** | +1 BE bij Verdedigen | Schildmuur (groeps-schild) | Formatie (teambonus) | Achilleshiel (bypass schild) |
| **Boogschutter** | +1 schade bij Aanval | Pijlregen (AOE-schade) | Zwak punt (dubbele schade op laag HP) | Dodenarrow (instant uitschakeling) |
| **Priester** | +1 heling bij Heel | Zegen (bonus-BE voor team) | Wederopstanding (teamlid terug na knock-out M5) | Godenvuur (massale schade + heling) |

### M3-klassen (gepland)

Spartaan, Cavalerie, Centurio, Genie, Verkenner

### M6-klassen (gepland)

Farao, Druïde, Augur, Pontifex (fractieklassen — zie §Facties)

---

## Acties (M1: 3 · M3+: meer)

| Actie | Kosten | Effect M1 |
|---|---|---|
| **Aanval** | 3 BE | 5 schade (Boogschutter: +1) |
| **Verdedig** | 2 BE | 3 schild dit ronde (Hopliet: +1, passief: +1 BE) |
| **Heel** | 3 BE | 8 heling (Priester: +1) |

Schild absorbeert _inkomende_ schade van dat ronde. Niet bestede BE blijft behouden.

---

## Synergie (M3)

Als een team genoeg verschillende klassen heeft, krijgt het een team-BE-bonus aan het begin van elke ronde:

| Unieke klassen | Team-BE-bonus |
|---|---|
| ≥ 3 | +5 % |
| ≥ 5 | +10 % |
| ≥ 7 | +15 % |

---

## Combo-abilities (M3)

Twee spelers van specifieke klassecombinaties kunnen een gecombineerde actie uitvoeren:

- Hopliet + Boogschutter → **Schildmuur met Schieten** (schild + pijlregen)
- Priester + Spartaan → **Strijdszegen** (massale BE + moreel)
- *(Volledige lijst in M3-sprint)*

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
| M3 | +5 klassen · synergie · combo's · klasse-specifieke acties · moreel | — |
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
