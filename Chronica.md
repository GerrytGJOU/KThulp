# Chronica Classica — Masterplan (BETA — proloog + Hoofdstuk 1 speelbaar)

> **Status: Beta, live in het hoofdmenu.** De **proloog** ("De Boer van
> Latium" / "Het Orakel van Chronos") is volledig speelbaar: intro →
> gender-keuze → verhaal met keuzes → Grieks-alfabet-puzzel → klassekeuze →
> eerste eretitel. **Hoofdstuk 1** ("De Namen van de Wereld") is ook
> speelbaar: een hub-scène waarna de speler kiest tussen **drie parallelle,
> niet-convergerende plotlijnen** — A "Het Goud van Midas", B "De Geboorte
> van Athena", C "Prometheus en Pandora" — die elk de volledige hoofdstuk-1-
> grammatica behandelen (zie §7.1). Er zijn 3 saveslots per leerling, een
> aanpasbare Chronica Classica Avatar (de boer, met verhaal-ontgrendeling), en
> een eretitel-systeem dat doorwerkt in de Battle Mode/Boss Battle-lobby. De
> rest van de campagne (Hoofdstuk 2 t/m 19 + Finale) staat als metadata-skelet
> klaar (`SP_CAMPAIGN`), maar de scènes zijn nog niet geschreven.
>
> **Dit document is de enige bron van waarheid voor Chronica Classica** en
> vervangt alle eerdere schetsen: `Single Player Mode.docx` (de oorspronkelijke
> Game Bible / Character Bible / Master Timeline), het aangeleverde
> `chronica-classica-architectuur.md`, het prototype
> `chronica-narrative-engine.html` en de campagnekaart-tabel. Waar die
> onderling of met de gebouwde code tegenstrijdig zijn, wint wat hieronder
> staat — zie [§9 Beslissingen die dit document vastlegt](#9-beslissingen).
>
> Zie ook [BATTLE_MODE.md](BATTLE_MODE.md) (het klas-vs-klas-gevechtssysteem
> dat Chronica hergebruikt voor combat, avatar en profiel),
> [BOSS_BATTLE.md](BOSS_BATTLE.md) en [TOTAL_WAR.md](TOTAL_WAR.md) (de andere
> modi waarin de eretitel-bonussen straks moeten meetellen).

---

## 0. Wat is er al gebouwd (nu)

Dit is niet aspiratief — dit bestaat vandaag in de repo en werkt (getest in de
browser):

| Onderdeel | Bestand | Status |
|---|---|---|
| Menutegel "📜 Chronica Classica" (BETA-badge) | `certamen/games.js` (`SCREENS.home`) | ✅ werkend |
| CNS-parser + tekst/voornaamwoord-resolver | `certamen/singleplayer.js` (`CNSParser`, `SpTextResolver`) | ✅ werkend |
| Proloog-content in CNS-formaat | `certamen/singleplayer-data.js` (`SP_PROLOOG_CNS`, 14 scènes) | ✅ werkend |
| **Hoofdstuk 1**: hub + 3 parallelle lijnen (Midas/Athena/Prometheus &amp; Pandora) | `certamen/singleplayer-data.js` (`SP_CH1_CNS`, 27 scènes) | ✅ werkend — getest: alle 3 lijnen volledig doorgespeeld, flags/codex/quest/eretitel kloppen per lijn |
| Meerkeuze-grammaticapuzzel (naast de Griekse transliteratie-puzzel) | `certamen/singleplayer.js` (`spRenderMCPuzzle`/`spCheckMCPuzzle`), `SP_PUZZLES` (`type:"multiple-choice"`) | ✅ werkend — 9 puzzels (lidwoord/naamval/vocativus × 3 lijnen) |
| **FLAG-hook**: keuzes/lijnkeuze dragen door in `SP_STATE.flags` | `certamen/singleplayer.js` (`spHookFlag`) | ✅ werkend (bv. `ch1_lijn`, `ch1_voltooid`) — conditionele NPC-reacties op flags volgen later |
| Scène-renderer (tekst/dialoog/keuzes) | `certamen/singleplayer.js` (`SCREENS.spPlay`) | ✅ werkend |
| Grieks-alfabet-transcriptiepuzzel (blokkeert voortgang) | `certamen/singleplayer.js` (`spRenderPuzzle`/`spCheckPuzzle`), `SP_PUZZLES`/`SP_GREEK_ALPHABET` | ✅ werkend |
| Klassekeuze → Battle Mode-klasse (REWARD-hook) | `certamen/singleplayer.js` (`spHookReward`), `SP_CLASS_REWARD_MAP` | ✅ werkend |
| Codex-/quest-registratie (nog zonder eigen scherm) | `certamen/singleplayer.js` (`spHookCodex`/`spHookQuest`) | ✅ data wordt bewaard, geen overzichtsscherm |
| Eenmalige gender-keuze (voornaamwoorden, géén naam) | `certamen/singleplayer.js` (`spRenderGenderPick`), `SP_PRONOUNS`/`SP_GENDER_OPTIONS` | ✅ werkend |
| **3 saveslots** per leerling | `certamen/singleplayer.js` (`SCREENS.spSlots`), `SP_MAX_SLOTS` | ✅ werkend — beginnen/verdergaan/verwijderen (met bevestiging) |
| **Offline-first opslag** (localStorage primair, Firebase spiegel) | `certamen/singleplayer.js` (`spSaveProgress`/`spLoadAllSlots`) | ✅ werkend — speelbaar zonder inloggen/internet |
| **Chronica Classica Avatar** (de boer: vodden + hooivork), pixel-sprite, verhaal-ontgrendeling | `certamen/singleplayer.js` (`SCREENS.spAvatarEdit`, `spAvatar*`, `spAvatarIsUnlocked`) | ✅ werkend — rendert met `renderPixelHeroPreview`/`_bmPixelLayers` (battle.js), niet `bmAvatarSVG` |
| Chronica-sectie op het masterprofiel ("Mijn profiel"), tegenhanger van Battle Mode | `certamen/games.js` (`SCREENS.collection`) | ✅ werkend — avatar + passieve bonussen, direct na de Battle Mode-sectie |
| **Eretitels** (verdiend via keuzes/voortgang) | `certamen/singleplayer.js` (`spAwardTitle`/`SP_TITLES`), CNS-sectie `EERETITEL:` | ✅ werkend — account-breed, offline-first |
| Eretitels als eigen categorie tussen de eerbewijzen | `certamen/core.js` (`ACH_CATEGORIES.chronica`), `certamen/games.js` (`SCREENS.collection`) | ✅ werkend — meegerenderd door `achGroupsHTML`, net als Algemeen/Klassieke Spellen |
| Eretitel zichtbaar/kiesbaar op profiel + slotscherm | `certamen/singleplayer.js` (`spTitlesSectionHTML`/`spToggleEquipTitle`) | ✅ werkend |
| Gekozen eretitel als pill in Battle Mode/Boss Battle-lobby | `certamen/battle.js` (`bmDoJoin` schrijft `player.title`, `bmRenderHostLobby` toont het) | ✅ werkend |
| Campagnekaart-metadata (Proloog + 19 hfdst + Finale, 5 boeken) + mythencanon | `certamen/singleplayer-data.js` (`SP_CAMPAIGN`, `SP_MYTH_CANON`) | ✅ data — scènes van hfdst 2+ nog niet geschreven |
| **Illustraties** (`IMAGE:`-sectie → beeld boven de scène, mist-veilig) | `certamen/singleplayer.js` (`spSceneImageHTML`) | ✅ werkend — proloog + alle 3 hoofdstuk-1-lijnen hebben er een (`prologue.png`, `midas.png`, `birth_of_athena.png`, `pandora.png`) |
| Gemini-huisstijl-Gem (stripstijl) | `certamen/assets/chronica/gemini-comic-style.md` | ✅ herbruikbare Gem-instructie |
| Audio-assetmappen | `certamen/assets/chronica/music/`, `certamen/assets/chronica/sfx/` | ✅ mappen bestaan (music met 1e Suno-track) |

---

## 1. Wat Chronica Classica is

Een **narratieve, offline-first singleplayer-RPG** binnen Certamen. De speler is
een **naamloze boer** die via het Orakel van Chronos door de klassieke oudheid
reist en de wereld helpt haar herinnering te bewaren tegen "de Vergetelheid".

**De drie zuilen (uit de Game Bible):**
1. **Educatieve poortwachters** — puzzels/opdrachten die op taal (alfabet,
   naamvallen, werkwoordsvormen) draaien. Ze zijn de basis van de gameplay,
   maar het verhaal staat voorop.
2. **RPG-klasse & stat-integratie** — de wapenkeuze in de proloog bepaalt de
   klasse (Boogschutter/Hopliet/Cavalerist), die 1-op-1 een bestaande Battle
   Mode-klasse is en dus in Battle Mode meetelt.
3. **Keuzes die ertoe doen** — keuzes uit vroege hoofdstukken mogen in latere
   hoofdstukken/boeken terugkomen (via `flags`/`reputatie`, zie §7).

**De gouden regel (Game Bible):** *verhaal gaat vóór grammatica; de speler
voelt zich een reiziger, geen leerling.* De lesstof volgt impliciet ongeveer de
volgorde van **Pallas** (Grieks) en **Minerva** (Latijn) — vastgelegd per
hoofdstuk in `SP_CAMPAIGN`.

---

## 2. CNS — Chronica Narrative Script

Scènes worden geschreven in **CNS**, een plat tekstformaat dat een niet-
programmeur kan schrijven en reviewen. Eén `.cns`-blok (nu inline als string in
`SP_CH1_CNS`) bestaat uit scènes:

```
=== SCENE: <UNIEKE_ID> ===

TITLE:
<titel>

TEXT:
<verteltekst, mag {voornaamwoorden} bevatten>

CHOICES:
* <keuzetekst> -> <ID van volgende scene>

END
```

**Ondersteunde secties** (`CNSParser.KNOWN_SECTIONS`): `TITLE`, `TEXT`,
`DIALOGUE`, `CHOICES`, `IMAGE`, `MUSIC`, `SFX`, `CODEX`, `QUEST`, `COMBAT`,
`REWARD`, `INVENTORY`, `PUZZLE`, `EERETITEL`.

- `TITLE`/`TEXT`/`DIALOGUE`/`CHOICES` worden direct gerenderd.
- `REWARD`/`CODEX`/`QUEST`/`EERETITEL` vuren stil een hook af bij binnenkomst
  (`spRunMetaHooks`).
- `PUZZLE` **blokkeert** de scène tot de puzzel is opgelost, en gaat dan naar
  het doel van de (enige) keuze.
- `IMAGE` **is actief**: toont de illustratie (bestandsnaam relatief aan
  `assets/chronica/images/`) boven de verteltekst; ontbreekt het bestand, dan
  verbergt de `<img>` zich stil (`onerror`), zodat je alvast naar nog-te-maken
  illustraties kunt verwijzen.
- `MUSIC`/`SFX`/`COMBAT`/`INVENTORY` worden herkend en opgeslagen in
  `scene.meta`, maar zijn **nog niet actief** (no-op) — zie §8.

**Scène-ID-conventie:** de proloog gebruikt het prefix `PRO_###`, hoofdstukken
`CH1_###`, `CH2_###`, enz. (De proloog heette eerder óók `CH1_`; dat botste met
het echte hoofdstuk 1 en is hernoemd.) Een save die naar een verdwenen id
verwijst, valt via een vangnet in `spResumeSlot` netjes terug op de eerste
scène.

> **Bewuste keuze:** CNS is dit eenvoudige tekstformaat, **niet** het
> YAML-dialect uit `chronica-classica-architectuur.md`. Het geteste prototype
> (`chronica-narrative-engine.html`) gebruikte dit formaat; dat is leidend.

**Vertelperspectief = tweede persoon.** De verteltekst spreekt de speler
rechtstreeks aan met **"je"/"jij"** — de speler is letterlijk de hoofdpersoon,
wat immersiever is dan een hij/zij-verteller. In narration staan dus **geen**
voornaamwoord-templates.

**Voornaamwoord-templates** (`SpTextResolver`): `{subject}`/`{object}`/
`{possessive}` + de hoofdletter-varianten `{subject_cap}` enz., opgelost via
`SP_PRONOUNS` op basis van de gekozen gender. Deze zijn er **alleen voor
dialoog**: wanneer een personage in de derde persoon óver de speler praat
("ik zie dat {subject} moe is" → hij/zij/die). De speler kiest die gender één
keer vóór het verhaal; in de proloog heeft het nog geen zichtbaar effect (geen
enkele NPC verwijst er nog in de derde persoon naar de speler). **Géén
`{player.name}`** — de speler is naamloos (Game Bible).

---

## 3. Opslag — offline-first

**Chronica Classica moet volledig offline speelbaar zijn.** Er is dus **geen
inlog-verplichting**.

- **localStorage is de bron van waarheid.** Keys: `certamen_chronica_slots`
  (de 3 saveslots), `certamen_chronica_avatar` (Chronica Classica Avatar),
  `certamen_chronica_titles` (behaalde eretitels),
  `certamen_chronica_equipped_title` (gekozen eretitel).
- **Firebase is alleen een best-effort spiegel**, en alleen als er is ingelogd
  (`BM_IDENT`). Pad: `identities/{klas}/{lcode}/singleplayer/` met daaronder
  `slots/{1|2|3}`, `avatar`, `titles`, `equippedTitle`. Schrijven is
  fire-and-forget — gameplay wacht nooit op het netwerk.
- **Merge bij laden:** per slot wint de nieuwste `updatedAt`; titels worden
  verenigd (gaan nooit verloren). De lokale cache wordt daarna bijgewerkt.

**Waarom óók Firebase (als je inlogt):** cross-device spelen, én de klassekeuze
moet doorwerken in het Battle Mode-profiel — dat loopt sowieso via `BM_IDENT`.

---

## 4. Saveslots

Elke leerling heeft **`SP_MAX_SLOTS` = 3** losse opslagplekken, zodat het
verhaal met alle drie de klassen kan worden uitgespeeld voordat een save gewist
moet worden. Per slot: `{ node, gender, classId, traits, codex, quests }`.

`SCREENS.spSlots` is het laadscherm: lege slots → "Begin een nieuw verhaal";
gevulde slots tonen klasse + huidige scène + "Verdergaan"/"Verwijderen".
Verwijderen is bevestiging-gated (`confirm()`). `SP_ACTIVE_SLOT` onthoudt de
actieve slot; `spSaveProgress` schrijft alleen daarnaartoe.

---

## 5. Chronica Classica Avatar & profiel

- De Chronica Classica Avatar is een **apart** avatar-object, los van
  `BM_IDENT.avatar`, maar rendert met Battle Mode se ECHTE combat-weergave:
  de gelaagde **pixel-sprite** (PNG-lagen uit `assets/sprites/`, samengesteld
  door `_bmPixelLayers()`/`renderPixelHeroPreview()`/`renderPixelHeroIcon()` in
  `battle.js`) — niet de oudere procedurele `bmAvatarSVG()`-paperdoll (die is
  in Battle Mode zelf al vervangen; zie de toelichting bij
  `renderPixelHeroIcon()`). `BM_AVATAR_PARTS` (labels/iconen/sprite-keys) wordt
  hergebruikt, maar de **ontgrendellogica is volledig anders**: geen
  niveau/mastery/munten, maar **verhaal**.
- **Altijd vrij te kiezen** (`SP_AVATAR_FREE_PARTS`): geslacht, huidskleur,
  haar, haarkleur, gezichtshaar — puur uiterlijk, geen gevechtsuitrusting.
- **Startuitrusting = de boer:** `spAvatarDefaults()` = `bmAvatarDefaults()`
  met `wapen:"hooivork"` (armor `"vodden"` komt al uit de default) — deze twee
  zijn altijd beschikbaar, ongeacht voortgang.
- **Overige uitrusting (harnas, helm, schild, wapen, cape, …) ontgrendelt via
  het verhaal**, niet via Battle Mode-niveau/munten: `SP_AVATAR_STORY_UNLOCKS`
  koppelt elke ontgrendelbare optie aan een verdiende eretitel (later ook:
  flags). Nu alleen de drie wapens die de proloog's klassekeuze letterlijk
  oplevert (`wapen:boog`↔`boogschutter_orakel`, `wapen:speer`↔
  `hopliet_orakel`, `wapen:zwaard`↔`cavalerist_orakel` — cavalerist heeft geen
  eigen ruitersporen-sprite, vandaar het zwaard). Alles zonder eigen entry
  blijft op slot ("ontgrendelt later in het verhaal") tot een volgend
  hoofdstuk het narratief oplevert.
- Editor `SCREENS.spAvatarEdit` werkt offline; de hoofdvoorbeeld-render is de
  pixel-sprite (`renderPixelHeroPreview(av,true)`), per-optie-thumbnails zijn
  de kleine SVG-preview (zelfde patroon als `SCREENS.battleAvatarEdit`).
- **Alleen zichtbaar tijdens Chronica-gevechten en op het masterprofiel** —
  bewust NIET op het slotscherm (`SCREENS.spSlots`), dat is geen combat-context.
- **Het masterprofiel is `SCREENS.collection`** (`games.js`, de "Mijn
  profiel"-tegel vanuit het hoofdmenu) — NIET `SCREENS.battleProfile`
  (`battle.js`), dat is een apart, Battle-Mode-intern scherm. De Chronica-
  sectie ("📜 Chronica Classica": avatar + passieve bonussen + "Avatar
  aanpassen") staat daar direct ná de "⚔️ Battle Mode"-sectie — zo zie je in
  één oogopslag hoe je in Battle Mode/Boss Battle/Total War verschijnt én hoe
  je Chronica-avatar nog moet groeien.
- **Passieve bonussen** van verdiende eretitels worden in die Chronica-sectie
  samengevat (⚡-regel per titel met een `bonus`); de volledige eretitel-lijst
  (óók de nog niet verdiende) staat verderop, meegerenderd in de eerbewijzen
  (zie §6).

---

## 6. Eretitels (Titles)

- **Account-breed** (niet per saveslot): een titel die je in slot 2 behaalt,
  zie je ook als je in slot 1 speelt.
- Toegekend via een `EERETITEL: <id>`-sectie in een CNS-scène (`spAwardTitle`).
- Zichtbaar op het slotscherm (`spTitlesSectionHTML`, tikbaar om te
  equippen) én op het masterprofiel; **één** titel is kiesbaar ("equipped") en
  verschijnt als pill in de **Battle Mode/Boss Battle-lobby**.
- **Op het masterprofiel (`SCREENS.collection`) lopen SP_TITLES gewoon mee in
  het bestaande eerbewijzen-systeem**: elk item heeft dezelfde vorm als een
  `ACHIEVEMENTS_DEF`-entry (`ds`/`icon`/`cat:"chronica"`, zie
  singleplayer-data.js) en wordt door dezelfde `achGroupsHTML()` gegroepeerd
  als "Chronica Classica (X/Y)" — een eigen categorie naast "Algemeen" en
  "Klassieke Spellen" (`ACH_CATEGORIES.chronica`, core.js), niet een los,
  afwijkend paneel.
- **`SP_TITLES`** (nu 7): `boogschutter_orakel`, `hopliet_orakel`,
  `cavalerist_orakel` (klassekeuze in de proloog), `bewaarder_herinnering`
  (proloog voltooid, met een `bonus`-veld: +1 BE bij snel antwoord, scope
  battle/boss/totalwar), en `ch1_a_midas`/`ch1_b_athena`/`ch1_c_prometheus`
  (welke lijn van Hoofdstuk 1 je voltooide — bewust zonder bonus, bonussen
  blijven voorbehouden aan grotere mijlpalen). Alle titels hebben
  `secret:true`: niet-behaalde titels tonen "???"/"Geheim eerbewijs" op het
  profiel, om geen verhaalspoilers weg te geven.
- **Belangrijke beperking:** de `bonus` is nu **puur informatief** — getoond,
  maar nog **niet verrekend** in het gevecht. De passieve-bonus-logica van
  Battle Mode zit verspreid over meerdere plekken in `battle.js`; het
  daadwerkelijk toepassen hoort bij de Combat-bridge-bouwstap (§8).

---

## 7. Campagnestructuur (`SP_CAMPAIGN`)

Proloog + 19 hoofdstukken in 5 "Boeken", gesynchroniseerd met Pallas en
Minerva (klas 2 t/m 6 gymnasium). Elk hoofdstuk legt vast: periode, verhaal,
de bijbehorende Pallas/Minerva-les, de **grammatica die de puzzels voedt**,
gameplay, hoofdpersonages, de (stripstijl-)illustratie en (waar toepasselijk)
`zijverhalen` — suggesties uit `SP_MYTH_CANON` (zie hieronder) die goed bij
dat hoofdstuk passen.

> **Samensmelting (2026-07):** deze structuur combineert twee bronnen — de
> eerdere, compactere "11 hoofdstukken + Finale"-indeling (rijker aan
> gameplay/personages/thema, uit een eerder gesprek) en de latere,
> gedetailleerdere "Certamen – Chronica Classica Campaign Map"-docx (5 Boeken,
> 19 hoofdstukken, exacte Pallas/Minerva-lesnummers, plus een S/A/B-tier
> mythencanon). De docx-indeling is leidend voor de structuur; de rijkere
> velden van de oudere bron zijn overgenomen waar hoofdstukken overeenkomen.
> Beide brondocumenten zijn hiermee vervangen — dit is de enige, actuele
> campagnekaart.

| # | Boek | Hoofdstuk | Grammatica (basis voor puzzels) |
|---|---|---|---|
| Proloog | — | Het Orakel van Chronos | Grieks alfabet, taalbewustzijn, eerste Latijnse woorden |
| 1 | I | De Namen van de Wereld | Zn, bn (alleen groep 1/2), lidwoord, nom./acc./voc. |
| 2 | I | De Werken van de Helden | Praesens, werkwoordstammen, imperativus, esse/posse |
| 3 | I | Beloften van Goden en Mensen | Genitivus, dativus, bijstelling |
| 4 | I | Het Labyrint van Herinneringen | Inf., voc., imperfectum, perfectum, ablativus |
| 5 | I | Ilion in Vlammen | Imperf., aoristus, participia, A.C.I., betr. bijzinnen — **vertakking Trojaans/Grieks/Neutraal** |
| 6 | II | De Zoon van Troje | Passief, ppp, deponentia |
| 7 | II | Mensen Achter de Mythen | Medium, passief, participium, voornaamwoorden |
| 8 | II | De Stad van Athena | Futurum, conjunctivus, comparativus, vraagzinnen |
| 9 | II | Oorlog en Overwinning | Perf., fut., fut. exactum, ablativus absolutus |
| 10 | III | De Vader van de Geschiedenis | Historische taal, bronanalyse |
| 11 | III | De Stem van de Filosofen | Complexe zinsbouw, argumentatie |
| 12 | III | Alexander en de Grenzen van de Wereld | Complexe werkwoorden, participia |
| 13 | IV | De Eeuwige Stad | Conjunctivus, N.C.I., semi-deponentia |
| 14 | IV | Caesar Schrijft Geschiedenis | Gerundium, gerundivum |
| 15 | IV | Augustus en de Pax Romana | Literair Latijn |
| 16 | IV | Keizers en Dichters | Verdieping naamvallen |
| 17 | V | De Bibliotheek van Mnemosyne | Herhaling van alle grammatica |
| 18 | V | De Rivier Lethe | Integratie Grieks & Latijn |
| 19 (Finale) | V | Chronica Classica | Eindtoets van alle grammatica en taalvaardigheid |

**`SP_MYTH_CANON`** — de S/A/B-tier-mythenlijst + de ontbrekende Romeinse
verhalen uit de docx, bewaard als los naslagwerk (niet uitputtend toegewezen).
Elk hoofdstuk hierboven met een `zijverhalen`-veld heeft er al een paar aan
gekoppeld (bv. Hoofdstuk 1: Prometheus + Pandora, al in gebruik als de
plotlijnen B/C hieronder; Hoofdstuk 4: Daidalos & Ikaros; Hoofdstuk 6: Romulus
& Remus). De rest blijft vrij te plaatsen naarmate hoofdstukken worden gebouwd.

De **wereldkaart** opent mee met de voortgang (nieuwe locaties verschijnen pas
na bezoek); dezelfde locatie kan in verschillende tijdlagen terugkomen. Keuzes
uit vroege hoofdstukken mogen later terugkomen via een `flags`-systeem
(`spHookFlag`, **gebouwd** — zie §7.1); de kaart zelf en NPC-reacties op flags
(`CONDITION`-mechanisme) staan nog open, zie §8.

### 7.1 Vertakking binnen een hoofdstuk (vastgelegd bij Hoofdstuk 1)

Een hoofdstuk kan uit **meerdere parallelle plotlijnen** bestaan die *niet*
convergeren. Hoofdstuk 1, drie lijnen (elk leert de volledige hoofdstuk-1-
grammatica, in een ander mythisch jasje — zie ook `zijverhalen` bij Hoofdstuk 1
in §7):
- **A — "Het Goud van Midas"** (Minerva H2), Latijn-zwaartepunt.
- **B — "De Geboorte van Athena"** (Grieks-zwaartepunt).
- **C — "Prometheus en Pandora"** (S-tier mythen uit `SP_MYTH_CANON`), begin
  van de mensheid.

De regels:

- **Educatieve gate boven alles:** je komt een volgend hoofdstuk pas in wanneer
  je álle grammatica van het huidige hoofdstuk hebt verwerkt. Geen progressie
  zonder de lesstof.
- **Daarom leert elke plotlijn de vólledige grammatica van het hoofdstuk** (in
  Hoofdstuk 1: zn/bn/lidwoord + nom./acc./voc.), telkens in een ander mythisch
  jasje. Eén plotlijn voltooien = alle stof gehad = **door naar het volgende
  hoofdstuk**. De andere lijnen zijn optioneel (rijkere wereld + replay met de
  3 saveslots; ideaal om ook de andere klassen te spelen).
- **Keuzes werken door.** De gemaakte keuzes én wélke plotlijn je koos worden
  als **flags** bewaard (`FLAG:`-sectie, `spHookFlag`, **gebouwd** — Hoofdstuk
  1 zet al `ch1_lijn`/`ch1_voltooid`); latere hoofdstukken/NPC's kunnen erop
  reageren zodra hoofdstuk 2+ bestaat. NPC's die er conditioneel op reageren
  vragen daarnaast een `CONDITION`-mechanisme — een volgende stap, zie §8.
- Dit is de bewuste keuze i.p.v. "alle drie de lijnen verplicht": het houdt
  echte branching + een korte kritische route voor casual spelers, zonder de
  educatieve gate los te laten.

---

## 8. Wat (nog) niet gebouwd is

In afgesproken bouwvolgorde:

1. **Combat-bridge** — een gevecht dat exact werkt als Battle Mode (vraag → EP →
   actie), met één verschil: de 10-seconden-wachttijd mag worden **onderbroken**
   zodra de speler zijn keuze heeft gemaakt (het is singleplayer). Gekoppeld via
   de `COMBAT:`-sectie. Dit is óók het moment om de eretitel-`bonus` (§6) écht in
   de berekening te verwerken.
2. **Wereldkaart + `CONDITION`-mechanisme** — kaart die meegroeit met de
   voortgang, en NPC's/scènes die conditioneel reageren op de al-gebouwde
   `flags` (bv. een personage dat later verwijst naar welke Hoofdstuk-1-lijn
   je koos).
3. **Audio-hook** — `MUSIC:`/`SFX:` daadwerkelijk afspelen (mp3, uit Suno) met de
   iPad-eis dat geluid pas ná een gebruikersactie mag starten. Mappen staan
   klaar in `certamen/assets/chronica/`.
4. **Codex/Quest-overzichtsschermen** — data wordt al bewaard; een eigen
   ontdekkingsboek-scherm volgt zodra er meer inhoud is dan proloog + hoofdstuk 1.
5. **Hoofdstuk 2 t/m 19 + Finale-content** — scène voor scène in CNS.
   `SP_CAMPAIGN` bepaalt per hoofdstuk de grammatica/personages, `SP_MYTH_CANON`
   levert het zijverhaal-materiaal. Nu drie onafhankelijke lijnen per hoofdstuk
   (§7.1); "meer kruisen" (lijnen die van elkaar weten) is een latere stap.
6. **Illustraties** — `IMAGE:` is **actief** (rendert het bestand uit
   `assets/chronica/images/`). De eerste illustratie hangt aan PRO_005 ("De
   Bronzen Schijf": de ontdekking van het Orakel, `prologue.png`). Resterend
   werk is puur content: per illustratie-moment een Gemini-prompt (op basis van
   `assets/chronica/gemini-comic-style.md`) en het beeld in de map zetten.

---

## 9. Beslissingen die dit document vastlegt

Bewuste keuzes, met de reden erbij, zodat ze niet per ongeluk worden
teruggedraaid:

- **Naamloze speler, tweede persoon, wél gender-voor-dialoog.** De Game Bible
  wil een naamloze boer ("juist daardoor kan iedere leerling zichzelf in hem
  herkennen"). De **verteltekst spreekt de speler direct aan met "je"/"jij"**
  (immersiever — de speler ís de hoofdpersoon). De gender-keuze (hij/zij/die)
  blijft bestaan maar dient **alleen voor dialoog**, wanneer personages in de
  derde persoon óver de speler praten. Dit wijkt bewust af van het aangeleverde
  testscenario, dat `{player.name}` + een naaminvoer + een hij/zij-verteller
  gebruikte.
- **Geïntegreerd in de bestaande app, geen losse sub-app.** Chronica draait in
  `certamen/index.html` naast Battle Mode/Total War, gebruikt hetzelfde
  `BM_IDENT`-profiel en dezelfde core-helpers. Dit wijkt bewust af van de
  `certamen/chronica/`-mini-app met ES-modules uit
  `chronica-classica-architectuur.md` — een los profiel zou het
  "klassekeuze werkt door in Battle Mode"-vereiste breken.
- **CNS = het eenvoudige tekstformaat, niet YAML** (zie §2).
- **Offline-first: localStorage primair, Firebase spiegel** (zie §3). Inloggen
  is een aanbod (cross-device + Battle Mode-koppeling), geen eis.
- **`SP_CAMPAIGN` (Proloog + 11 + Finale) is leidend**, niet de "13 boeken"-
  Master Timeline uit de Game Bible. De campagnekaart is fijnmaziger en 1-op-1
  aan Pallas/Minerva gekoppeld.
- **Combat = Battle Mode-mechaniek**, met als enige verschil de onderbreekbare
  timer (singleplayer). Geen parallel gevechtssysteem.
- **Eretitel-bonussen bestaan als data, maar worden pas toegepast bij de
  Combat-bridge** — bewust niet halfslachtig op één plek in `battle.js` gepatcht.

---

## 10. Rolverdeling bij contentbouw

- **Claude (Code) = primaire schrijver.** Naast architectuur, engine,
  puzzelmechanieken, combat-koppeling en kaart/codex/profiel schrijft Claude óók
  de scèneteksten en NPC-dialoog **rechtstreeks in de CNS-bestanden**. Reden:
  goede scènes moeten tegelijk de Game Bible-regels, de karakterstemmen, de
  grammaticaprogressie (Pallas/Minerva), de branching/flags én het CNS-formaat
  respecteren — en consistent blijven met alle eerdere scènes. Die volledige
  context zit in de bouwsessie; direct-naar-CNS schrijven voorkomt
  overschrijf-rondes en drift tussen scènes.
- **ChatGPT:** optionele **tweede pas** — een scène een andere flavour geven of
  als second opinion. Niet langer de primaire schrijver (bewuste wijziging
  t.o.v. de oorspronkelijke werkafspraak).
- **Gemini:** illustraties in **stripstijl**, spaarzaam ingezet, alleen op
  emotioneel/narratief belangrijke momenten. De vaste huisstijl staat als
  herbruikbaar Gem-instructiebestand in
  `certamen/assets/chronica/gemini-comic-style.md`; per illustratie levert
  Claude een concrete prompt die daarop voortbouwt (personages moeten er
  scène-op-scène hetzelfde uitzien; de naamloze speler blijft androgyn / van
  achteren in beeld zodat de art voor elke gender werkt).
- **Suno:** achtergrondmuziek (mp3), in `certamen/assets/chronica/music/`.

Contentcadans: **scène voor scène** — Claude schrijft de scène direct in CNS,
Gerben leest mee/stuurt bij, Claude bouwt door.
