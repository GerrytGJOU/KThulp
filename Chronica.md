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
| **Hoofdstuk 1**: hub + 3 parallelle lijnen (Midas/Athena/Prometheus &amp; Pandora) | `certamen/singleplayer-data.js` (`SP_CH1_CNS`, 30 scènes) | ✅ werkend — getest: alle 3 lijnen volledig doorgespeeld, flags/codex/quest/eretitel kloppen per lijn |
| Meerdere alinea's per scène (`spParagraphsHTML`) | `certamen/singleplayer.js` | ✅ werkend — CNS-tekst splitst op lege regels in aparte `<p>`-elementen (bugfix: smolt eerst visueel samen tot één alinea) |
| Meerkeuze-grammaticapuzzel (naast de Griekse transliteratie-puzzel) | `certamen/singleplayer.js` (`spRenderMCPuzzle`/`spCheckMCPuzzle`), `SP_PUZZLES` (`type:"multiple-choice"`) | ✅ werkend — 9 puzzels (lidwoord/naamval/vocativus × 3 lijnen) |
| **FLAG-hook**: keuzes/lijnkeuze dragen door in `SP_STATE.flags` | `certamen/singleplayer.js` (`spHookFlag`) | ✅ werkend (bv. `ch1_lijn`, `ch1_voltooid`) — conditionele NPC-reacties op flags volgen later |
| Scène-renderer (tekst/dialoog/keuzes) | `certamen/singleplayer.js` (`SCREENS.spPlay`) | ✅ werkend |
| Grieks-alfabet-transcriptiepuzzel (blokkeert voortgang) | `certamen/singleplayer.js` (`spRenderPuzzle`/`spCheckPuzzle`), `SP_PUZZLES`/`SP_GREEK_ALPHABET` | ✅ werkend |
| Klassekeuze → Battle Mode-klasse (REWARD-hook) | `certamen/singleplayer.js` (`spHookReward`), `SP_CLASS_REWARD_MAP` | ✅ werkend |
| Codex Memoriae — 6 tabbladen, oud-perkament-uiterlijk | `certamen/singleplayer.js` (`SCREENS.spCodex` + hooks), `certamen/singleplayer-data.js` (`SP_CODEX_ENTRIES`/`SP_CODEX_PERSONS`/`SP_VOCAB_ENTRIES`) | ✅ werkend — Mythologie/Geschiedenis/Personen/Grammatica/Vocabulaire/Afbeeldingen (§7.2.1); quests hebben nog geen eigen scherm |
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
| **Wereldkaart** — geïllustreerde panelen + onthullende locatie-pins per codex-entry | `certamen/singleplayer.js` (`SCREENS.spWorldMap`), `certamen/singleplayer-data.js` (`SP_MAP_PANELS`/`SP_MAP_LOCATIONS`) | ✅ werkend — 3 panelen, west/midden/oost, schakelbaar via tabblad-rij ("Het Westen"/"Italië en Griekenland"/"Het Oosten", laatste is standaard) |
| **Audio** — `MUSIC:` speelt af, met mute-knop | `certamen/singleplayer.js` (`spPlayMusic`/`spAudioToggleHTML`), `SCREENS.spIntro` (titelscherm met Main Theme) | ✅ werkend — Orakel-epiloog (§7.2) en het titelscherm hebben muziek; overige scènes nog stil |
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
<alinea 1>

<alinea 2 — een lege regel scheidt alinea's, elk wordt een eigen <p>>

CHOICES:
* <keuzetekst> -> <ID van volgende scene>

END
```

**Lengte-conventie (vastgelegd 2026-07, geldt vanaf Hoofdstuk 1):** elke
scène vóór een `CHOICES`-vertakking krijgt **minimaal 2-3 alinea's**
beschrijvende/verhalende tekst — niet één summiere zin. Dat geeft ruimte voor
historische/mythologische diepgang én voor de grammatica/vocabulaire om
ergens natuurlijk te landen. Dit betekent ook vaker **meer, kleinere nodes**
per lijn (één beat per node) in plaats van meerdere beats samengeperst in één
node. Uitzondering: scènes die direct een `PUZZLE` inleiden mogen korter
(1 alinea volstaat als opzet naar de puzzel). De proloog zelf blijft bewust
korter — een introductie, geen vol hoofdstuk.

**Ondersteunde secties** (`CNSParser.KNOWN_SECTIONS`): `TITLE`, `TEXT`,
`DIALOGUE`, `CHOICES`, `IMAGE`, `MUSIC`, `SFX`, `CODEX`, `QUEST`, `COMBAT`,
`REWARD`, `INVENTORY`, `PUZZLE`, `EERETITEL`, `FLAG`.

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

De **wereldkaart** (`SCREENS.spWorldMap`, **gebouwd**) opent mee met de
voortgang: een locatie-pin verschijnt zodra de bijbehorende codex-entry al in
`SP_STATE.codex` zit (hergebruikt de bestaande codex-hook, geen nieuw
trackingsysteem) — dus pas na bezoek, per saveslot (elke slot speelt zijn
eigen route). De kaart bestaat uit **geïllustreerde panelen** (Gemini,
stripstijl "antieke atlas", `SP_MAP_PANELS`/`SP_MAP_LOCATIONS` in
singleplayer-data.js) — de volledige wereld (Britannia tot India) is
verdeeld in panelen zodat elk leesbaar blijft. Alle drie panelen zijn nu
getekend en met een tabblad-rij (boven de kaart in `SCREENS.spWorldMap`)
schakelbaar, in deze volgorde — **west, midden, oost** — zodat het middelste
paneel het vertrouwde "thuis"-paneel is waar de speler op landt
(`SP_MAP_CURRENT_PANEL` staat standaard op `"aegean"`):
- **"western"** (links) — knoplabel "Het Westen" (`panel2_western.png`,
  Sicilië/Carthago/Gades/Hesperiden/Alpen/Gallië — hoofdstukken nog te
  bouwen, dus nog geen pins).
- **"aegean"** (midden, standaard) — knoplabel "Italië en Griekenland"
  (`panel1_aegean.png`, dekt Proloog + Hoofdstuk 1: Latium, Olympos, Sardis).
- **"eastern"** (rechts) — knoplabel "Het Oosten" (`panel3_eastern.png`,
  Kaukasus/Perzië/Egypte/India). Heeft al één pin (Kaukasus, ontgrendeld door
  `codex_doos_van_pandora` uit Hoofdstuk 1 lijn C).

De interne panel-id's (`aegean`/`western`/`eastern`, gebruikt door
`SP_MAP_LOCATIONS[].panel`) zijn ongewijzigd gebleven — alleen de
`nm`-weergavenaam en de volgorde van de object-keys in `SP_MAP_PANELS`
veranderden. Het knoplabel is het stuk vóór " — " in `nm` (bv. "Het Westen —
Sicilië, Carthago, Gades & de Alpen"); de rest van `nm` blijft zichtbaar als
beschrijving onder de tabbladen. Twee CC-gelicenseerde referentiekaarten (Aeneas- en
Odysseus-reis, resp. CC BY 3.0/Rcsprinter123 en CC BY-SA 4.0/Giulia
Zoccarato) zijn als geografisch naslagwerk gebruikt bij het ontwerpen — niet
overgenomen, dus geen attributieplicht.

Keuzes uit vroege hoofdstukken mogen later terugkomen via een `flags`-systeem
(`spHookFlag`, **gebouwd** — zie §7.1); NPC-reacties op flags
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
- **Vertakkingen binnen een lijn (voor het gevoel van keuzevrijheid).** Naast
  de grote lijnkeuze op de hub-node mag elke lijn zelf ook kleinere,
  reconvergerende zijpaadjes hebben: een keuze die naar een extra node met
  eigen sfeertekst leidt en daarna simpelweg weer aansluit op het hoofdpad. Dit
  is puur voor het spelgevoel (geen aparte grammatica/eindpunt) en dus geen
  uitzondering op de "één plotlijn = alle stof" regel. Hoofdstuk 1 heeft dit al:
  lijn A/Midas 1 vertakking (`CH1_A01B` markt-geruchten, `CH1_A08B` troost
  bieden voor je Bacchus aanroept), lijn B/Athena 2 vertakkingen (`CH1_B01B`
  herder over Kronos/Zeus, `CH1_B06B` reacties van Ares/Hera/Hermes op de
  geboorte), lijn C/Prometheus 2 vertakkingen (`CH1_C02B` wachten op het
  duister voor de vuurdiefstal, `CH1_C07B` Epimetheus' afleidingspoging voor
  Pandora de doos opent).
- Dit is de bewuste keuze i.p.v. "alle drie de lijnen verplicht": het houdt
  echte branching + een korte kritische route voor casual spelers, zonder de
  educatieve gate los te laten.

### 7.2 Hoofdstuk-afsluiting: het Orakel, de mantel en de Codex Memoriae (**gebouwd**)

Elke lijn (A/B/C) sluit **niet** direct af met de laatste verhaalscène, maar
loopt door naar een gedeelde afsluitreeks:

1. **Een lijn-specifieke Orakel-scène** (`CH1_A11`/`CH1_B09`/`CH1_C12`): de
   bronzen schijf gloeit weer op, en de Boodschapper van Kronos (dezelfde stem
   als in de proloog) feliciteert je — met tekst die verwijst naar wát je
   precies hebt teruggevonden, dus per lijn anders.
2. **`CH1_ROBE`** (gedeeld knooppunt): de Boodschapper merkt op dat je nog
   altijd de vodden van de proloog draagt en overhandigt je een mantel.
   Mechanisch simpel: `SP_AVATAR_STORY_UNLOCKS["armor:robe"] = { flag:
   "ch1_voltooid" }` (singleplayer-data.js) — de flag staat al sinds de
   laatste verhaalscène van elke lijn, dus dit is puur een narratieve
   bevestiging, geen nieuw ontgrendelmechanisme. Zet ook meteen
   `CODEX: codex_grammatica_ch1_overzicht` (een samenvattende afsluiter — de
   twee losse grammatica-entries staan er dan al lang, zie §7.2.1) en
   `VOCAB:` met de volledige Hoofdstuk-1-woordenlijst.
3. **`CH1_CODEX_UITLEG`** (gedeeld): een korte, in-fictie uitleg van het
   Codex-mechanisme zelf (de Boodschapper legt uit dat namen/grammatica die je
   tegenkomt automatisch worden vastgelegd).
4. **`CH1_EINDE`** (gedeeld): nette afsluiting die expliciet benoemt dat
   Hoofdstuk 2 nog moet worden geschreven — voorkomt een "Terug naar de
   opslagplekken"-doodlopend eind zonder verhaalkader.

### 7.2.1 Codex Memoriae — zes tabbladen, oud-perkament-uiterlijk (**gebouwd**)

`SCREENS.spCodex` (singleplayer.js) is een volwaardig scherm met zes
tabbladen, elk met een eigen kleine databron en ontgrendel-hook — allemaal
volgens hetzelfde patroon (CNS-meta-sectie → hook zet stil iets in
`SP_STATE` → scherm toont alleen wat al verdiend is, per saveslot):

- **Mythologie** / **Geschiedenis** — `SP_CODEX_ENTRIES` (`cat:"mythologie"`/
  `"geschiedenis"`), ontgrendeld via de bestaande `CODEX:`-sectie
  (`spHookCodex`, ondersteunt nu meerdere id's per sectie,
  `,`/`;`/regel-gescheiden). Geschiedenis is in Hoofdstuk 1 bewust leeg —
  dat hoofdstuk is puur mythologie; het tabblad is er alvast klaar voor
  latere, historische hoofdstukken.
- **Personen** — `SP_CODEX_PERSONS`, **tweetraps onthuld** via een nieuwe
  `PERSON:`-sectie (`spHookPerson`, id:niveau-paren, niveau is `intro` of
  `full`, alleen upgrades tellen). Een personage krijgt een spoilervrije
  `intro`-tekst zodra je hem/haar voor het eerst ontmoet, en wordt pas
  aangevuld met de rijkere `full`-tekst zodra zíjn/haar verhaal is afgerond
  (bv. Athena heet in de Codex letterlijk "???" met epithet "Nog onbekend"
  tot haar geboorteverhaal is voltooid — dan verschijnt haar echte naam en
  epithet, met een "✦ later bijgewerkt"-vouwlijn in de UI). Niet elk
  personage krijgt een `full` — bijfiguren zonder eigen afgerond verhaal in
  dit hoofdstuk (Zeus, Hephaistos, Epimetheus) blijven op `intro` staan.
  **Naamgevingsregel**: lijn A (Latijn-zwaartepunt) gebruikt Romeinse namen
  (Bacchus, niet Dionysus); lijn B/C (Grieks-zwaartepunt) gebruiken overal
  Griekse namen (Zeus, Athena, Hephaistos — niet Jupiter/Minerva/Vulcanus) in
  de VERTELTEKST. De Latijnse naamval-puzzels (bv. "Vulcanus caput aperit")
  blijven wél Latijn, want dat is een Latijnse grammatica-oefenzin, geen
  personagenaam — de Codex-grammaticatabel (§7.2.1) toont daarom bewust
  "Vulcanus" naast "Hephaistos" in `SP_CODEX_PERSONS`. Elke persoon-entry mag
  zijn Latijnse/Griekse tegenhanger noemen (Zeus (Jupiter), Pallas Athena
  (Minerva), Hephaistos (Vulcanus)) — puur informatief, wijzigt de
  verteltekst niet.
  Sommige bio's zijn gebaseerd op de "Certamen Character Bible" (Single
  Player Mode.docx) — niet meer de bron van waarheid sinds Chronica.md
  bestaat, maar de personagebeschrijvingen daarin waren te goed om te laten
  liggen.
- **Grammatica** — ook `SP_CODEX_ENTRIES` (`cat:"grammatica"`), maar met een
  optioneel `table`-veld (headers + rows) dat `SCREENS.spCodex` als een
  echte `<table>` rendert — de Griekse-lidwoordtabel en de
  nominativus/accusativus/vocativus-tabel met de exacte woorden uit de
  Hoofdstuk-1-puzzels. **Bewust vroeg ontgrendeld**: `CH1_000` (de hub, vóór
  de keuze tussen de drie lijnen) zet beide entries al, zodat een leerling
  die een puzzel verkeerd beantwoordt meteen naar de Codex kan om het
  antwoord + de uitleg terug te vinden — niet pas na afloop van het
  hoofdstuk. `CH1_ROBE` voegt daarna nog een samenvattend "overzicht" toe.
- **Vocabulaire** — `SP_VOCAB_ENTRIES` (Grieks + Latijn, per woord
  taal/getranscribeerd-vorm/betekenis), via een nieuwe `VOCAB:`-sectie
  (`spHookVocab`, comma/regel-gescheiden id's, één toast per batch i.p.v.
  per woord). Bewust compacter dan de frequentielijst van de andere
  Certamen-modi (die blijft relevanter voor Training/Vrij Oefenen) — dit is
  de pool waaruit een toekomstig Chronica-gevecht (Combat-bridge, §8, nog te
  bouwen) zijn vragen kan putten. Groeit per hoofdstuk.
- **Afbeeldingen** — `SP_STATE.seenImages`, automatisch bijgehouden door
  `spHookSeenImage()` zodra een scène met een `IMAGE:`-sectie wordt bezocht
  (geen aparte auteurs-actie nodig, dedup op scène-id). Toont een
  thumbnail-grid van alle illustraties die de speler al heeft gezien.

**Uiterlijk**: perkament-look (sepia-gradient, sepia tekstkleur) met een
CSS-ezelsoor rechtsonder (`::after`, clip via border-triangle-truc — geen
afbeelding nodig) en "sierlijk maar leesbaar" via cursief/letter-spacing op
de bestaande Palatino-stack (index.html, `.codex-*`-klassen) — **bewust geen
extra lettertype-CDN**, dat zou de offline-first-eis van de app breken.
Bereikbaar via een knop op de landingspagina (naast 🗺️ Wereldkaart) zodra je
verder bent dan het allereerste scherm.

Nieuwe hoofdstukken breiden dit uit: elke nieuwe `CODEX:`/`PERSON:`/`VOCAB:`-
id hoort een entry te krijgen in de bijbehorende databron
(`SP_CODEX_ENTRIES`/`SP_CODEX_PERSONS`/`SP_VOCAB_ENTRIES`, allemaal
singleplayer-data.js) — anders toont de Codex alleen een kale id of niets.

### 7.3 Pietas/Virtus — stil "Paragon/Renegade"-systeem (**gebouwd**)

Losjes geïnspireerd op Mass Effects Paragon/Renegade: bij (bijna) elke keuze
met interpersoonlijke lading krijgt de speler twee smaken van dezelfde
reactie — een meelevende/geduldige ("Pietas") en een nuchtere/daadkrachtige
("Virtus") — **ook wanneer beide naar exact dezelfde volgende scène leiden**.
Het punt is niet vertakking maar **het gevoel van karakterkeuze**, stil
bijgehouden en NERGENS aan de speler getoond (geen HUD, geen scherm, geen
melding) — precies zoals de Mass Effect-balkjes zelf ondubbelzinnig zichtbaar
zijn, maar hier bewust omgekeerd: onzichtbaar, zodat het voelt als "wie ben
ik" in plaats van "welk getal moet ik maximaliseren".

**Mechaniek:**
- Een keuzeregel in `CHOICES:` mag eindigen op `[PIETAS]` of `[VIRTUS]` vóór
  de `->`, bv. `* Blijf eerst naast hem zitten [PIETAS] -> CH1_A08B`. De tag
  wordt door `CNSParser.parseChoices` (singleplayer.js) uit het zichtbare
  label gesloopt — de speler ziet nooit `[PIETAS]`/`[VIRTUS]` op een knop.
- Bij een klik roept de knop `spChoosePath(target, approach)` aan (i.p.v.
  rechtstreeks `spGoCns`); die telt eerst stil op via `spHookApproach()` en
  navigeert dan pas door. `SP_STATE.approach = {pietas, virtus}` (per
  saveslot, net als codex/flags).
- **Puzzel-scènes zijn uitgesloten**: `spRenderPuzzle()` gebruikt
  `scene.choices[0].target` rechtstreeks en roept `spGoCns` aan, niet
  `spChoosePath` — een `[TAG]` op een puzzelscène-keuze zou dus nooit vuren.
  Tag daarom alleen keuzes op scènes ZONDER `PUZZLE:`-sectie.
- `spApproachTendency()` levert `"pietas"`/`"virtus"`/`"neutraal"` (bij een
  gelijke stand of nog geen enkele getagde keuze) — bedoeld voor NPC's/scènes
  die later conditioneel reageren op de opgebouwde houding. Dat vereist wel
  eerst het `CONDITION`-mechanisme (§8) — de teller zelf werkt al, het
  *gebruik ervan* in dialoog is de volgende stap.
- Hoofdstuk 1 heeft 13 getagde keuzeparen verspreid over de drie lijnen (zie
  `SP_CH1_CNS`) op momenten met echte emotionele lading (bv. troosten vs.
  doorpakken bij Midas' ineenstorting, medelijden vs. nuchterheid bij Zeus'
  zwangerschap, meeleven vs. nieuwsgierigheid bij de geketende Prometheus) —
  niet letterlijk op elke overgang, want een gedwongen dilemma bij bv. "trek
  de mantel aan -> ga verder" voegt niets toe. Nieuwe hoofdstukken volgen
  hetzelfde principe: tag waar de keuze een karakterkant laat zien, sla over
  waar het puur een leesknop is.

### 7.4 Titelscherm + audio (**gebouwd**)

`SCREENS.spIntro` (singleplayer.js) is het nieuwe instappunt van Chronica
Classica (`SCREENS.singlePlayer` stuurt er nu naartoe, i.p.v. rechtstreeks
naar `spSlots`): een korte, sfeervolle "startpagina" met de Main Theme
(`main_theme.mp3`) die meteen begint te spelen zodra het scherm opent — dit
is een bewust lichtgewicht **substituut voor een echte openingscinematic**
(zie de aanbeveling aan de auteur hieronder). Verschijnt elke keer opnieuw
bij het openen vanuit het portaal, niet eenmalig — het is een titelscherm,
geen tutorial.

**Audio-mechaniek** (herbruikbaar voor elke toekomstige scène):
- `spPlayMusic(bestandsnaam)` speelt een mp3 uit `assets/chronica/music/` af
  via één gedeeld, lussend `<audio>`-element; vraagt hetzelfde bestand
  opnieuw aan (bv. drie opeenvolgende scènes met dezelfde `MUSIC:`-regel),
  dan herstart het NIET — cruciaal voor de Orakel-epiloog (§7.2), die over
  drie scènes hetzelfde nummer laat doorlopen.
- Start altijd binnen dezelfde synchrone klik-afhandeling (via
  `spRunMetaHooks`, die alleen binnen `SCREENS.spPlay()` draait, of
  rechtstreeks in `SCREENS.spIntro()` na een klik op de portaal-tegel) —
  voldoet zo aan de iPad-eis dat geluid pas ná een gebruikersactie mag
  starten. Een geblokkeerde autoplay (bv. bij het automatisch hervatten van
  een save) wordt stil genegeerd; de mute-knop laat het geluid dan alsnog
  handmatig aanzetten.
- **Mute-knop** (`spAudioToggleHTML()`) rechtsboven op elk Chronica-scherm
  (titelscherm, verhaal, puzzels) — schrijft naar `localStorage`
  (`certamen_chronica_muted`), dus blijft de voorkeur van de speler over
  sessies heen bewaard. Geen aparte instelling nodig; het is gewoon altijd
  zichtbaar en direct bruikbaar.
- `spStopMusic()` wordt aangeroepen bij het verlaten van Chronica Classica
  terug naar het hoofdportaal (de "terug"-knop op het slotoverzicht) — zo
  blijft er geen muziek doorspelen op schermen buiten Chronica.

**Echte openingscinematic** (nog niet gebouwd — de auteur monteert dit zelf
in Sony Vegas Movie Studio Platinum en levert het als los videobestand,
buiten deze codebase om). Gekozen aanpak: de Main Theme op de achtergrond,
Ken Burns-stijl pan/zoom over Gemini-stills (huisstijl, zie
`gemini-comic-style.md`), met regel-voor-regel verschijnende profetie-tekst
("Een reiziger verschijnt", "Wanneer herinnering verdwijnt", …), eindigend op
een zoom-in naar Latium waar Hoofdstuk 1 begint.

**Exportspecificaties** (zodat het bestand overal soepel afspeelt, ook op
iPad, zonder plugins):
- **Container/codec**: MP4, video H.264, audio AAC — universeel ondersteund
  door alle browsers en iPads, en het standaard exportprofiel in zowat elke
  editor inclusief Vegas Movie Studio.
- **Beeldverhouding**: 16:9 (zelfde als alle Gemini-illustraties in de app).
- **Resolutie**: 1920×1080 als het bestand niet te zwaar wordt; anders
  1280×720 — dit is een schoolapp op vaak beperkte wifi, dus liever een
  kleiner bestand dan de hoogste resolutie.
- **Framerate**: 30 fps (veilige standaard, geen hokkerigheid); 24 fps kan
  ook voor een filmisch gevoel, dan render Vegas dat probleemloos.
- **Bitrate/bestandsgrootte**: richt op ~4-6 Mbps bij 1080p (of ~2-3 Mbps bij
  720p) — een clip van 30-45s blijft dan ruim onder de 20 MB.
- **Duur**: 30-45 seconden totaal is de soete plek — genoeg regels voor de
  profetie plus de zoom-in naar Latium, niet zo lang dat het spelen vertraagt
  bij elke herstart.
- **Audio**: bak de Main Theme (`main_theme.mp3`, al in
  `assets/chronica/music/`) direct in de video's audiospoor — dan hoeft de
  app geen aparte muziek te starten/synchroniseren naast de video.
- **Bestandslocatie**: `certamen/assets/chronica/video/opening.mp4` (nieuwe
  map, naast `images/`/`music/`/`maps/`). Zodra het bestand er staat, is de
  code-kant simpel: een `<video>`-tag i.p.v. de huidige tekst in
  `SCREENS.spIntro`, met de bestaande mute-knop (`spAudioToggleHTML`) ook
  toepasbaar op het videogeluid.

**Profetie-strofen** (voorstel, regel-voor-regel te onthullen — vrij aan te
passen/aan te vullen):

> Er was een wereld, groots en fel,
> vol goden, helden, eeuwenoud.
> Nu vervaagt zij, naam voor naam,
> in stilte die haar langzaam rooft.
>
> Wanneer herinnering verdwijnt,
> verschijnt een reiziger, ongezien —
> geen koning, held of god gezant,
> slechts iemand die nog weten wil.
>
> Het Orakel wacht al eeuwen stil
> op wie de namen redden kan,
> niet met kracht, maar met geduld,
> met elke naam die hij nog vangt.
>
> Ver van hier, in een korenveld,
> ligt het begin van wat vergat.
> Daar wacht een ploeg. Een stille grond.
> Daar begint het — in Latium.

Zolang de video er niet is, blijft `SCREENS.spIntro` de facto de "opening"
van het spel.

---

## 8. Wat (nog) niet gebouwd is

In afgesproken bouwvolgorde:

1. **Combat-bridge** — een gevecht dat exact werkt als Battle Mode (vraag → EP →
   actie), met één verschil: de 10-seconden-wachttijd mag worden **onderbroken**
   zodra de speler zijn keuze heeft gemaakt (het is singleplayer). Gekoppeld via
   de `COMBAT:`-sectie. Dit is óók het moment om de eretitel-`bonus` (§6) écht in
   de berekening te verwerken.
2. **`CONDITION`-mechanisme** — de kaart zelf is gebouwd (§7,
   `SCREENS.spWorldMap`), alle drie panelen zijn getekend en schakelbaar; nog
   open: NPC's/scènes die conditioneel reageren op de al-gebouwde `flags` (bv.
   een personage dat later verwijst naar welke Hoofdstuk-1-lijn je koos) én op
   `spApproachTendency()` (§7.3, Pietas/Virtus) — de teller zelf werkt en
   bouwt al op, alleen het *reageren* erop in latere hoofdstukken ontbreekt nog.
3. **Audio-hook (deels gebouwd)** — `MUSIC:` speelt nu echt af via
   `spPlayMusic()` (singleplayer.js), met een mute-knop (`spAudioToggleHTML`,
   rechtsboven op elk Chronica-scherm) die de speler zelf kan bedienen —
   voldoet aan de iPad-eis omdat het altijd binnen dezelfde gebruikersactie
   (een klik) start. Tot nu toe alleen gekoppeld aan de Orakel-epiloog (§7.2,
   `the_oracle_awakens.mp3`) en het nieuwe titelscherm (`SCREENS.spIntro`,
   `main_theme.mp3` — zie §7.4). Nieuwe scènes met eigen sfeermuziek hoeven
   alleen een `MUSIC:`-sectie toe te voegen; `SFX:` (korte geluidseffecten)
   bestaat nog niet.
4. **Quest-overzichtsscherm** — data wordt al bewaard (`spHookQuest`); de
   Codex heeft inmiddels wél een eigen scherm (§7.2, `SCREENS.spCodex`), een
   vergelijkbaar overzicht voor quests ontbreekt nog.
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
