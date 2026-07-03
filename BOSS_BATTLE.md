# Boss Battle — coöperatief gevechtssysteem (GEBOUWD, unieke bazen-mechanics volgen)

> **Status: werkend.** Boss Battle is gebouwd — niet als het losstaande
> room-schema dat dit document oorspronkelijk voorstelde, maar als een compacte
> uitbreiding **bovenop Battle Mode se bestaande Team A/B-engine**
> (`certamen/bossbattle.js` + `BM_META.mode==="boss"` in `certamen/battle.js`):
> team B is de baas i.p.v. een menselijk team, en de bestaande
> `bmResolve()`/`bmCalcAbilityEffect()`-pijplijn rekent klassen/combo's/synergie
> al automatisch tegen de baas-HP af. Geïmplementeerd: moeilijkheidsgraden,
> bazenkeuze (Hydra/Cycloop/Minotaurus met basisillustratie), fase 1-2-3,
> rage/tegenaanval, en de [garnizoenskoppeling met Total War](#garnizoensformule-voor-total-war-belegeringen).
> **Nog niet gebouwd** (bewust, zie `BOSS_PRESETS`-commentaar in
> `bossbattle.js`): de unieke bazen-mechanics per baas (Hydra-koppen als
> speelmechaniek i.p.v. alleen visueel, Cycloop-countdown, Minotaurus-schild),
> de Combo Chain/anti-carry-systemen van §5, minions, en het scorebord van §8.
> De **spelregels/balans** hieronder zijn wat het docx-plan voorstelde; waar de
> werkelijke implementatie een lichtere/eenvoudigere versie koos staat dat
> vermeld bij de betreffende sectie. Zie ook
> [Technische correcties](#technische-correcties-tov-het-oorspronkelijke-docx-plan)
> onderaan voor de architectuurcorrecties t.o.v. het originele docx-plan.
>
> Boss Battle is een **losstaand, herbruikbaar subsysteem** — géén
> Total-War-specifieke code. Het is bruikbaar als (a) een vrijstaande
> coöperatieve klasactiviteit ("vecht tegen de Hydra", door de docent los
> gestart) én (b) de manier waarop [TOTAL_WAR.md](TOTAL_WAR.md) een aanval op
> een provincie oplost (met garnizoensstats als extra input — zie
> [Garnizoensformule voor Total War-belegeringen](#garnizoensformule-voor-total-war-belegeringen)).

---

## 1. Algemeen concept & klaslokaal-dynamiek

De hele klas vecht **coöperatief** tegen één AI-baas, in plaats van team-tegen-
team (Battle Mode) of solo (Training Mode). Het projectorscherm (host) toont
de baas, zijn status/schild/countdown-aanvallen, en de **gezamenlijke
gezondheidsbalk van de klas**. Spelers gebruiken hun eigen toestel om via
goede antwoorden aan te vallen, te schilden of te genezen.

Kernfilosofie (ongewijzigd uit het docx-plan):
- **De projector is de baas** — animaties, timers en gevaren gebeuren
  centraal op het bord.
- **Geen individuele eliminatie** — verliest de klas, dan verliest iedereen
  samen. Niemand valt persoonlijk af.
- **Simultane chaos beheersbaar** — individuele acties worden geaggregeerd
  naar één globale staat, zodat 40 gelijktijdige klikken de host niet
  overbelasten.

---

## 2. Moeilijkheidsgraden & het schalingsmodel

Om even spannend te zijn met 2 als met 40 spelers, schaalt alles procentueel
mee met het aantal spelers `N`.

**Moeilijkheidsgraad-multiplier (`Md`)**

| Graad | Multiplier |
|---|---|
| Easy | 0.5 |
| Normal | 1.0 |
| Hard | 1.5 |
| Heroic | 2.2 |
| Legendary | 3.5 |

**Kernformules**

```
Boss Max HP   = N × baseHpPerPlayer(1500) × Md
Klas Max HP   = N × 100          // één gedeelde balk voor de hele klas
Boss basisschade per aanval = Klas Max HP × 5% × Md   // altijd 5% van de balk, ongeacht klasgrootte
```

Voorbeeld (20 spelers, Normal): Boss HP = 30.000. Voorbeeld (2 spelers,
Normal): Boss HP = 3.000. Beide voelen relatief even zwaar aan.

---

## 3. Vraag- en antwoordmechanica

- **Correct antwoord:**
  - directe schade aan de baas (of het actieve doelwit-minion);
  - `+1` aan de globale Combo-meter van de klas (zie §5.1);
  - persoonlijke munten/punten voor de speler.

  ⚠️ **Balanswaarschuwing (geleerd in deze codebase, niet in het
  oorspronkelijke docx-plan):** we hebben Battle Mode se muntformule eerder al
  moeten corrigeren omdat "munten per goed antwoord" te snel opliep (zie
  BATTLE_MODE.md — nu alleen deelname+winst geven munten). Geef Boss Battle
  **dezelfde behandeling**: laat individuele correcte antwoorden vooral
  bijdragen aan het gedeelde gevecht (schade/combo), en reserveer persoonlijke
  munten voor **deelname aan het gevecht + de eindoverwinning**, niet een vast
  bedrag per losse vraag. Dit is een bewuste aanpassing t.o.v. het docx-plan.

- **Fout antwoord:** geen schade. Vult wel de **Rage-balk** van de baas met
  een vaste waarde. Bij 100% Rage: directe Counter-Attack buiten de normale
  aanvalstimer om. Dit maakt fouten gevaarlijk voor de groep, zonder een
  individuele leerling persoonlijk af te straffen.

---

## 4. Baas-mechanics & patronen

Drie startbazen, elk met een uniek patroon (Grieks-Romeinse mythologie):

| Baas | Kernmechanic | Beschrijving |
|---|---|---|
| **De Hydra van Lerna** | Regeneratie & koppen | Start met 3 koppen. Elke 25% HP-verlies groeit er een kop bij; elke actieve kop verkort de aanvalstimer met 10%. |
| **Polyfemus de Cycloop** | Gefocuste countdown | Elke 45s een "oogstraal-countdown" van 12s. De klas moet gezamenlijk `X` correcte antwoorden geven om te verblinden, anders een zware AoE (25% klas-HP). |
| **De Minotaurus** | Labyrinth-schild & enrage | Bij 50% HP: schild dat alle schade blokkeert; 5 "Labyrinth-woorden" verschijnen die specifiek opgelost moeten worden om het te slopen. Bij 15% HP: Enrage (dubbele aanvalssnelheid). |

**Generieke mechanics (alle bazen):**
- **Schildfase** — blauwe bar boven de HP-balk; schade gaat eerst van het
  schild af. Sommige Battle Mode-klassenpassieven (bv. Spartaan/Achilleshiel,
  al gedefinieerd in `BM_CLASSES` in `battle-data.js`) omzeilen schilden — dat
  gedrag kan **rechtstreeks hergebruikt** worden, zie
  [Hergebruik van bestaande systemen](#hergebruik-van-bestaande-systemen).
- **Minion Summon** — de baas roept 2-4 handlangers op die 50% van
  binnenkomende schade opvangen zolang ze leven; spelers moeten hun doelwit
  actief wisselen naar de minions.

---

## 5. Teamplay & anti-carry-systemen

Voorkomt dat de sterkste leerling alleen het gevecht wint terwijl de rest
toekijkt.

### 5.1 De Combo Chain

Geven 3 verschillende spelers achter elkaar (binnen 4s) een correct antwoord,
dan activeert een Class Combo: het 3e/4e/5e antwoord in de keten krijgt een
schademultiplier (max ×2.5, `1.0 + count×0.2`). Blijft één speler spammen, dan
breekt de keten — dit dwingt spreiding over de klas af.

### 5.2 Klasse-specifieke rollen (aansluiting op `BM_CLASSES`)

Hergebruikt de bestaande 8/12 Battle Mode-klassen (`battle-data.js`) in plaats
van een nieuw rollensysteem te verzinnen:
- **Hoplieten/Spartanen** → correcte antwoorden bouwen een Klasse-Schild op
  voor de hele klas (absorbeert de volgende bossaanval).
- **Priesters/Verkenners** → correcte antwoorden genezen de Klas-HP-balk of
  leveren extra BE voor de rest.

### 5.3 Inspiratie-buff (catch-up)

Na 3 opeenvolgende foute antwoorden krijgt een leerling "Inspiratie van
Athena": het volgende correcte antwoord doet verhoogde schade. Geeft
leerlingen die moeite hebben een groot succesmoment.

---

## 6. Spanning & variatie

**Drie fases**, gekoppeld aan boss-HP%:

1. **Fase 1 (100–66%)** — introductie, alleen basisaanvallen, klas kan
   opwarmen en combo's opbouwen.
2. **Fase 2 (66–33%)** — "de breuk": baas verandert van vorm, roept minions
   op of activeert zijn unieke mechanic. Achtergrond op de projector
   verandert visueel.
3. **Fase 3 (33–0%)** — "execute fase": geen normale aanvallen meer, baas tikt
   elke 3s voor 2% schade — een race tegen de klok.

**Random events** (elke 60s, optioneel via docent-toggle): bv. "Gunst van
Zeus" (5s dubbele schade voor iedereen) of "Woede van Poseidon" (countdowns
20% sneller gedurende 1 minuut).

---

## 7. Docent Dashboard & controls

Vóór de start, één configuratiescherm:
- **Kies de baas:** Hydra / Cycloop / Minotaurus (uitbreidbaar, zie
  [Uitbreidbaarheid](#uitbreidbaarheid)).
- **Moeilijkheidsgraad:** Easy / Normal / Hard / Heroic / Legendary.
- **Tijdslimiet (Enrage-timer):** 2 / 3 / 5 min / geen limiet.
- **Mechanics-toggles:** baas mag genezen · random events aan/uit · minions
  toestaan in fase 2.
- **Klas-HP-slider:** 50%–200% (voor extreem sterke of zwakke klassen).

Wanneer aangeroepen **vanuit Total War** (provincie-aanval), worden
baas-keuze en een deel van de moeilijkheidsgraad **automatisch** ingevuld op
basis van het aangevallen garnizoen (zie
[Garnizoensformule](#garnizoensformule-voor-total-war-belegeringen)) — de
docent kan dit overrulen.

---

## 8. Beloningen & post-game statistieken

Na afloop (winst of verlies) een motiverend scorebord, geen negatieve
schaming:

- **De Sloper (MVP)** — meeste schade aan de baas.
- **De Onsterfelijke** — langste foutloze streak.
- **Minion Opruimer** — meeste schade aan handlangers.
- **Medic van het Legioen** — meeste healing/klas-HP gered.
- **Combo Koning** — vaakst de 3e/4e schakel in een Class Combo.
- **Geluksbrenger** — de genadeklap uitgedeeld.

Iedereen verdient munten op basis van individuele score (deelname + bijdrage,
**niet** per losse vraag — zie de balanswaarschuwing in §3), besteedbaar in
`SCREENS.collection` net als de rest van de app-economie.

---

## 9. Software-architectuur & datastructuren

### Room-state (Firebase RTDB) — volgt het bestaande Battle Mode-schema

**Niet** een generieke geneste `room.state.boss...`-structuur zoals het
docx-plan voorstelde, maar de exacte vorm die `battle.js` al gebruikt voor
Battle Mode-kamers (`rooms/{code}/meta`, `/state`, `/players/{pid}`), zodat
lobby/join/rejoin-code hergebruikt kan worden:

```
/rooms/{code}/
  meta/          game:"boss_battle", bossId, difficulty, ...
  state/
    phase              1 | 2 | 3
    classHP             <getal>
    classMaxHP           <getal>
    boss/
      id                 "hydra" | "cyclops" | "minotaur"
      hp / maxHP
      shield
      rage
      countdown/          { active, value, requiredAnswers, currentAnswers }
    minions[]              [{ id, hp, maxHp }]
    globalCombo/           { count, lastPlayerId, multiplier, ts }
    activeEvent             null | { id, endsAt }
    resolvedRound            <laatst-verwerkte antwoord-id, voor idempotentie —
                              zelfde patroon als bmResolve()'s resolvedRound-guard>
  players/{pid}/
    name, avatar, class, be, damage, healing, correct, wrong, ...
    (zelfde velden als Battle Mode se player-record, zie battle.js)
```

### Core managers (concept, geen letterlijke klassen nodig)

- **Boss-presets** (`BOSS_PRESETS`, `BOSS_DIFFICULTIES`) — statische
  configuratie, naar het patroon van `BM_CLASSES`/`BM_LEVELS` in
  `battle-data.js`.
- **Antwoordverwerking** (`bossHandleAnswer`) — analoog aan `bmResolve()` in
  `battle.js`: leest de huidige `state`, berekent het effect, schrijft terug
  met `.update()` of (waar concurrency een risico is, zoals xp/coins ooit was)
  een `.transaction()`.
- **Aanvalstimer** (`bossAttackTicker`) — host-only `setTimeout`-lus, exact
  zoals `bmHostStartTimer()` in `battle.js` dat al doet voor ronde-timers.
- **Fase-overgangen** — puur een afgeleide van `boss.hp / boss.maxHP`, geen
  aparte opslag nodig (zelfde aanpak als `bmBuildBattlefield()`'s
  kritieke-HP-check).
- **Beloningsberekening** (post-game) — analoog aan `bmComputeAwards()` in
  `battle.js`, die al exact dit soort MVP/streak/combo-categorieën berekent
  voor Battle Mode. Hergebruik die functie-vorm, niet een nieuw systeem.

---

## Hergebruik van bestaande systemen

Boss Battle hoeft weinig from scratch te bouwen. Concreet te hergebruiken:

| Wat | Uit | Hoe |
|---|---|---|
| Lobby/join/identiteit/rejoin | `battle.js`: `bmCreateRoom`, `bmDoJoin`, `bmRejoin`, `BM_IDENT`/`bmIdentDoLogin` | Boss Battle is qua netwerk-skelet een tweede "spelmodus" bovenop dezelfde room/identity-infrastructuur, geen parallel systeem. |
| Avatar-rendering + animaties | `battle.js`: `renderPixelHero`/`_bmPixelLayers`; `certamen/battle-motion.js`: `BattleMotion` | Spelers-avatars in de Boss Battle-UI gebruiken dezelfde sprite-lagen en dezelfde motion state machine (`"swing"` bij aanval, `"damage"` bij een klap van de baas, `"victory"`/`"dead"` bij afloop) — geen nieuwe animatie-engine nodig. |
| Klasse-passieven (schild/heal-rollen, §5.2) | `battle-data.js`: `BM_CLASSES` | Rechtstreeks dezelfde databron; geen dubbele klasse-definitie. |
| Award-/scoreboardpatroon | `battle.js`: `bmComputeAwards()` | Zelfde categorie-aanpak (sorteer spelers op een metric, top-1 wint de titel), nieuwe categorieën toevoegen aan hetzelfde patroon. |
| Idempotente state-writes | `battle.js`: `bmResolve()`'s `resolvedRound`-guard, `bmAwardBattle()`'s `.transaction()` | Zelfde voorzichtigheid nodig: meerdere spelers kunnen bijna gelijktijdig antwoorden, dus race-gevoelige schrijfacties (schade, combo-teller) horen een transaction of een answer-id-guard te hebben, niet een kaal `once()+update()`. |
| Commandant-achtige presence-visual voor de baas | `battle.js`: `CommanderSpectre` | De baas zelf kan als een grote, sfeervolle achtergrond-illustratie op het projectorscherm getoond worden met exact hetzelfde mechanisme als de Commander Spectres nu al gebruiken (geen eigen animatie nodig — verschijnen op het juiste moment volstaat, zoals al vastgesteld voor Spectres). |

---

## Uitbreidbaarheid

Nieuwe bazen toevoegen = één nieuwe entry in `BOSS_PRESETS` (id, naam, icon,
kleur, beschrijving, `mechanics`-object) — geen wijziging aan de engine nodig,
zelfde ontwerpprincipe als `BM_AVATAR_PARTS`/`BM_LEVELS` elders in de
codebase. Suggesties voor latere uitbreiding (niet nu bouwen): Cerberus
(3-fase multi-target), Charybdis (omgevings-gevaar i.p.v. directe aanval),
Chimera (elementaire zwakke plekken per klasse-type).

Van dit principe is inmiddels ook gebruikgemaakt voor een **verborgen** preset:
`garrison` ("Het Garnizoen") vertegenwoordigt de muren/torens van een
belegerde provincie in plaats van een mythologische tegenstander. Bewust
**niet** opgenomen in `BOSS_PRESET_ORDER`, dus nooit los kiesbaar in het
normale Boss Battle-menu — alleen `twStartAttack()` in `totalwar.js` zet
`BM_META.bossId="garrison"`, en `battleHostSettings` in `battle.js` vervangt
in dat geval de speltype-/baaskeuze door vaste, niet-aanpasbare tekst. De
visuele laag (`assets/bosses/fort.png`/`Palissade.png`/`wall.png`) is aanwezig;
zie TOTAL_WAR.md §3.1 voor de bedoelde koppeling met de `walls`-waarde.

---

## Garnizoensformule voor Total War-belegeringen

Wanneer Boss Battle **niet** los gestart wordt maar door
[TOTAL_WAR.md §5](TOTAL_WAR.md#5-veroveren--verdedigen) wordt aangeroepen om
een provincie-aanval op te lossen, worden de generieke formules uit §2
**gecombineerd** met de garnizoensstats van de verdedigende provincie
(`/totalwar/provinces/{id}`, zie TOTAL_WAR.md §4). Dit is een reconciliatie
tussen de twee originele docx-plannen, die elk een eigen, onderling
afwijkende boss-HP-formule voorstelden — dit is de ene, samengevoegde,
autoritatieve versie:

```
garrisonBonusHP     = province.walls  × 50          // 1-5 niveaus
garrisonShield      = province.towers × 20           // 0-3 torens
effectiveBossMaxHP  = (N × 1500 × Md) + garrisonBonusHP
effectiveBossStartHP = effectiveBossMaxHP − province.damageTaken   // slijtageslag, zie TOTAL_WAR.md §5.4
effectiveBossShield  = garrisonShield
```

- `N`/`Md` zoals in §2 (aantal aanvallende spelers × gekozen/afgeleide
  moeilijkheidsgraad).
- `province.militia` beïnvloedt niet de baas-HP zelf, maar het aantal/de
  sterkte van de minions (§4) die de baas oproept — een sterk bewapende
  provincie spawnt zwaardere handlangers.
- Bij winst: reset `damageTaken` naar 0 en zet `owner` naar de aanvallende
  factie. Bij verlies boven de slijtagedrempel (TOTAL_WAR.md §5.4): schrijf de
  toegebrachte schade weg naar `damageTaken` in plaats van te resetten.

**Geïmplementeerd** in `bmStartBossGame()` (`battle.js`) en `twResolveSiege()`
(`totalwar.js`), met twee bewuste vereenvoudigingen t.o.v. de pseudocode hierboven:
- de generieke basisformule is niet `N×1500×Md` maar de al bestaande, echte
  Boss Battle-constante `N×15×8×Md` (zie het commentaar bij `bmStartBossGame()`
  — 1500 was een docx-aanname die niet matchte met de werkelijke 4-14-schade
  van `BM_CLASSES`-abilities);
- `garrisonShield` bestaat nog niet als apart veld — `towers×20` telt gewoon op
  bij `garrisonBonusHP` (zie TOTAL_WAR.md §9.6), omdat Boss Battle zelf nog geen
  schild-mechanic heeft.

---

## 10. Pseudocode (gecorrigeerd naar echte projectconventies)

Onderstaande vervangt de docx-versie 1-op-1, maar met de juiste globale namen
en schrijfpatronen (zie
[Technische correcties](#technische-correcties-tov-het-oorspronkelijke-docx-plan)).

```js
// battle-data.js of een nieuw boss-data.js — zelfde plek/patroon als BM_CLASSES
const BOSS_DIFFICULTIES = {
  easy:      { nm:"Easy",      m:0.5 },
  normal:    { nm:"Normal",    m:1.0 },
  hard:      { nm:"Hard",      m:1.5 },
  heroic:    { nm:"Heroic",    m:2.2 },
  legendary: { nm:"Legendary", m:3.5 },
};

const BOSS_PRESETS = {
  hydra:    { id:"hydra",    nm:"De Hydra van Lerna",   icon:"dragon", color:"#2e7d32",
              desc:"Groeit extra koppen naarmate hij HP verliest.",
              mechanics:{ baseAttackInterval:5000, healOnPhase:true } },
  cyclops:  { id:"cyclops",  nm:"Polyfemus de Cycloop", icon:"eye",    color:"#ef6c00",
              desc:"Triggert een oogstraal-countdown die de klas moet stoppen.",
              mechanics:{ baseAttackInterval:6000, hasCountdownAttack:true } },
  minotaur: { id:"minotaur", nm:"De Minotaurus",        icon:"skull",  color:"#c62828",
              desc:"Verstopt zich achter een Labyrinth-schild bij 50% HP.",
              mechanics:{ baseAttackInterval:4000, shieldAtHalf:true } },
};

// Host-only: init (aanroepbaar los, of vanuit Total War met garrisonProvince meegegeven)
async function initBossBattle(bossId, difficultyKey, garrisonProvince){
  const N = Object.keys(BM_PLAYERS).length || 1;      // BM_PLAYERS, niet PLAYERS
  const diff = BOSS_DIFFICULTIES[difficultyKey] || BOSS_DIFFICULTIES.normal;
  const preset = BOSS_PRESETS[bossId];
  if(!preset) return;

  let bossMaxHP = Math.round(N * 1500 * diff.m);
  let shield = 0, startHP = bossMaxHP;
  if(garrisonProvince){                                 // zie "Garnizoensformule" hierboven
    bossMaxHP += garrisonProvince.walls * 50;
    shield = garrisonProvince.towers * 20;
    startHP = bossMaxHP - (garrisonProvince.damageTaken||0);
  }

  const state = {
    phase:1, classHP: N*100, classMaxHP: N*100, difficulty: difficultyKey,
    boss:{ id:bossId, hp:startHP, maxHP:bossMaxHP, shield, rage:0,
           countdown:{active:false,value:0,requiredAnswers:0,currentAnswers:0} },
    minions:[], globalCombo:{count:0,lastPlayerId:"",multiplier:1.0,ts:0},
    activeEvent:null, resolvedRound:-1,
  };
  // Zelfde schrijfpatroon als bmCreateRoom() in battle.js: direct op de room-ref.
  await fbDB.ref("rooms/"+BM_CODE+"/state").set(state);
  bossAttackTicker(); // host-only lus, zie bmHostStartTimer() als voorbeeld
}

// Verwerkt één antwoord — analoog aan bmResolve(), met dezelfde
// resolvedRound/transaction-voorzichtigheid tegen races bij simultane spelers.
async function bossHandleAnswer(pid, isCorrect, target){
  const snap = await fbDB.ref("rooms/"+BM_CODE+"/state").once("value");
  const s = snap.val(); if(!s) return;
  const diff = BOSS_DIFFICULTIES[s.difficulty] || BOSS_DIFFICULTIES.normal;
  const upd = {};

  if(isCorrect){
    const now = Date.now();
    if(s.globalCombo.lastPlayerId!==pid && (now - s.globalCombo.ts) < 4000){
      upd["globalCombo/count"] = s.globalCombo.count+1;
      upd["globalCombo/multiplier"] = Math.min(2.5, 1.0 + (s.globalCombo.count+1)*0.2);
    } else {
      upd["globalCombo/count"] = 1; upd["globalCombo/multiplier"] = 1.0;
    }
    upd["globalCombo/lastPlayerId"] = pid; upd["globalCombo/ts"] = now;

    const dmg = Math.round(100 * (upd["globalCombo/multiplier"] ?? s.globalCombo.multiplier));
    if(target==="minion" && s.minions.length){
      // minion-array-mutatie: lees-wijzig-schrijf op het hele array-veld
      const minions=[...s.minions]; minions[0]={...minions[0], hp:minions[0].hp-dmg};
      upd.minions = minions.filter(m=>m.hp>0);
    } else if(s.boss.shield>0){
      upd["boss/shield"] = Math.max(0, s.boss.shield-dmg);
    } else {
      upd["boss/hp"] = Math.max(0, s.boss.hp-dmg);
      const hpPerc = upd["boss/hp"]/s.boss.maxHP;
      if(s.phase===1 && hpPerc<=0.66) upd.phase=2;
      else if(s.phase===2 && hpPerc<=0.33) upd.phase=3;
      if(upd["boss/hp"]<=0){ /* winst-afhandeling */ }
    }
  } else {
    const newRage = s.boss.rage + 5*diff.m;
    if(newRage>=100){
      upd["boss/rage"]=0;
      upd["classHP"]=Math.max(0, s.classHP - Math.round(s.classMaxHP*0.08*diff.m));
    } else upd["boss/rage"]=newRage;
  }
  await fbDB.ref("rooms/"+BM_CODE+"/state").update(upd);
}
```

### Technische correcties t.o.v. het oorspronkelijke docx-plan

| Docx-aanname | Klopt niet met | Correctie |
|---|---|---|
| Globale `STATE`, `PLAYERS`, `CODE` | Bestaat niet — `battle.js` gebruikt `BM_STATE`, `BM_PLAYERS`, `BM_CODE`, `BM_META`, `BM_TEAMS` | Gebruik de `BM_`-namen consequent. |
| `net.setState(CODE, patch)` als generieke schrijf-helper | `net.js` bevat alleen `FBNet`/`DemoNet` voor docent-klasbeheer (`getClasses`, `saveClass`, `moveStudent`, ...) — géén generieke room-state-writer | Schrijf direct via `fbDB.ref("rooms/"+BM_CODE+"/state").update(...)`, zoals de rest van `battle.js` al doet. |
| Geneste `room.state.type/phase/classHP/...`-vorm | Wijkt af van het platte `rooms/{code}/meta` + `/state` + `/players/{pid}`-schema dat Battle Mode al gebruikt | Volg het bestaande schema (zie §9 hierboven) zodat lobby/join/rejoin-code herbruikbaar is. |
| `_registerTimer()` voor cleanup | Bestaat niet met die naam | `battle.js` gebruikt `BM_UNSUBS` (array van cleanup-functies, geleegd in `cleanup()`) — hang de timer daaraan op. |

---

## 11. Implementatieplan

1. **Data & config** — `BOSS_DIFFICULTIES`/`BOSS_PRESETS` in een nieuw
   `boss-data.js` (naar het patroon van `battle-data.js`).
2. **State & engine** — `initBossBattle`/`bossHandleAnswer`/
   `bossAttackTicker` in een nieuw `boss.js`, met de room/identity-
   infrastructuur van Battle Mode hergebruikt (zie
   [Hergebruik van bestaande systemen](#hergebruik-van-bestaande-systemen)).
3. **Host-UI** — `SCREENS.bossHost`: grote baas, klas-HP-balk, boss-HP-balk,
   schild/minion-indicators. Baas-visual via `CommanderSpectre`-patroon.
4. **Player-UI** — `SCREENS.bossPlayer`: vraag + doelwit-switch (baas/minion),
   eigen klasse-rol-indicator, globale combo-weergave.
5. **Resolutie & tickers** — `bossHandleAnswer` + `bossAttackTicker`,
   winst/verlies-detectie.
6. **Special mechanics & events** — Cycloop-countdown, Minotaurus-schild,
   random events.
7. **Scoreboard** — `bossComputeAwards()` naar het patroon van
   `bmComputeAwards()`.
8. **Total War-koppeling** — `garrisonProvince`-parameter (zie
   [Garnizoensformule](#garnizoensformule-voor-total-war-belegeringen)),
   aanroepbaar vanuit het docentendashboard in TOTAL_WAR.md §7.2.

---

*Boss Battle · Gerben de Jong · 2026*
