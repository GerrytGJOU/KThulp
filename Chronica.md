# Chronica Classica — Masterplan (BETA — proloog + Hoofdstuk 1-3 speelbaar)

> **Status: Beta, live in het hoofdmenu.** De **proloog** ("De Boer van
> Latium" / "Het Orakel van Chronos") is volledig speelbaar: intro →
> gender-keuze → verhaal met keuzes → Grieks-alfabet-puzzel → klassekeuze →
> eerste eretitel. **Hoofdstuk 1** ("De Namen van de Wereld") is ook
> speelbaar: een hub-scène waarna de speler kiest tussen **drie parallelle,
> niet-convergerende plotlijnen** — A "Het Goud van Midas", B "De Geboorte
> van Athena", C "Prometheus en Pandora" — die elk de volledige hoofdstuk-1-
> grammatica behandelen (zie §7.1). **Hoofdstuk 2** ("De Werken van de
> Helden") is **volledig speelbaar**: alle vier lijnen staan er — L "Latona",
> S "Semele", K "Kallisto" (alle drie volledig afgerond) en H "Herakles"
> (bewust gedeeltelijk — zijn eerste twee werken, de rest volgt in Hoofdstuk
> 3, zie §7.6). Dit hoofdstuk introduceert ook de Combat-bridge (§8), voor
> het eerst gebruikt in H's gevechten tegen de Nemeïsche Leeuw en de Hydra.
> **Hoofdstuk 3** ("Beloften van Goden en Mensen") is eveneens **volledig
> speelbaar**: twee hoofdlijnen — Io (met Argus Panoptes en Mercurius als
> climax van diezelfde lijn, en een Europa-coda erin verweven als
> NPC-commentaar) en Herakles, die hier al zijn resterende tien werken
> afrondt (zie §7.8). Vanaf dit hoofdstuk reageren NPC's ook voor het eerst
> op de stil opgebouwde Clementia/Severitas-houding van de speler, via
> `{tendency_address}` (zie §7.3).
> Er zijn 3 saveslots per leerling, een
> aanpasbare Chronica Classica Avatar (de boer, met verhaal-ontgrendeling), en
> een eretitel-systeem dat doorwerkt in de Battle Mode/Boss Battle-lobby. De
> rest van de campagne (Hoofdstuk 4 t/m 26 + Finale) staat als metadata-skelet
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
| **Hoofdstuk 2**: hub + alle vier lijnen (L/S/K afgerond, H gedeeltelijk) | `certamen/singleplayer-data.js` (`SP_CH2_CNS`) | ✅ werkend — alle vier lijnen + fragmenten-gate + Athena-mentor + Combat-bridge getest, incl. beide gevechten (Leeuw/Hydra) volledig uitgespeeld (zie §7.6) |
| **Hoofdstuk 3**: hub + twee lijnen (Io incl. Argus/Mercurius/Europa-coda, Herakles' laatste tien werken) | `certamen/singleplayer-data.js` (`SP_CH3_CNS`, 43 scènes) | ✅ werkend — beide lijnen + 6 Combat-bridge-gevechten + 9 puzzels (bewuste combat/puzzel-balans, zie §7.8) + fragmenten-gate (fragments=6) + `{tendency_address}` NPC-reacties volledig getest |
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
| Campagnekaart-metadata (Proloog + 26 hfdst + Finale, 5 boeken) + mythencanon | `certamen/singleplayer-data.js` (`SP_CAMPAIGN`, `SP_MYTH_CANON`) | ✅ data — scènes van hfdst 4+ nog niet geschreven |
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
  koppelt elke ontgrendelbare optie aan een verdiende eretitel of flag. De
  drie wapens die de proloog's klassekeuze letterlijk oplevert
  (`wapen:boog`↔`boogschutter_orakel`, `wapen:speer`↔`hopliet_orakel`,
  `wapen:zwaard`↔`cavalerist_orakel` — cavalerist heeft geen eigen
  ruitersporen-sprite, vandaar het zwaard), de mantel uit Hoofdstuk 1
  (`armor:robe`↔flag `ch1_voltooid`, zie §7.2), en sinds Hoofdstuk 2 ook
  `armor:licht`↔flag `herakles_harnas`: zodra Herakles bij `CH2_H09` de huid
  van de Nemeïsche Leeuw als eigen mantel gaat dragen, heeft hij zijn oude
  harnas niet meer nodig en geeft het — met een korte vierde-wand-doorbrekende
  blik naar de speler, hetzelfde soort moment als Athena's "onzichtbaar voor
  iedereen behalve jou" — rechtstreeks aan de (voor de rest van het verhaal
  onzichtbare) boodschapper. Alles zonder eigen entry blijft op slot
  ("ontgrendelt later in het verhaal") tot een volgend hoofdstuk het
  narratief oplevert.
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

Proloog + 26 hoofdstukken in 5 "Boeken", gesynchroniseerd met Pallas en
Minerva (klas 2 t/m 6 gymnasium). Elk hoofdstuk legt vast: periode, verhaal,
de bijbehorende Pallas/Minerva-les, de **grammatica die de puzzels voedt**,
gameplay, hoofdpersonages, de (stripstijl-)illustratie en (waar toepasselijk)
`zijverhalen` — suggesties uit `SP_MYTH_CANON` (zie hieronder) die goed bij
dat hoofdstuk passen. Niet elk hoofdstuk hoeft nieuwe grammatica te
introduceren: een aantal is bewust een herhalings-/verrijkingshoofdstuk (zie
de canon-uitbreiding hieronder), net zoals Pallas zelf grammatica-loze lessen
kent (Les 2, Les 14) en Minerva (H1, H13).

> **Samensmelting (2026-07):** deze structuur combineert twee bronnen — de
> eerdere, compactere "11 hoofdstukken + Finale"-indeling (rijker aan
> gameplay/personages/thema, uit een eerder gesprek) en de latere,
> gedetailleerdere "Certamen – Chronica Classica Campaign Map"-docx (5 Boeken,
> 19 hoofdstukken, exacte Pallas/Minerva-lesnummers, plus een S/A/B-tier
> mythencanon). De docx-indeling is leidend voor de structuur; de rijkere
> velden van de oudere bron zijn overgenomen waar hoofdstukken overeenkomen.
> Beide brondocumenten zijn hiermee vervangen — dit is de enige, actuele
> campagnekaart.

> **Canon-uitbreiding (2026-07-20):** de oorspronkelijke 19 hoofdstukken zijn
> uitgebreid naar 26, in twee rondes — telkens omdat een hoofdstuk te veel
> Pallas-lessen of Minerva-hoofdstukken droeg voor zijn eigen verhaal.
>
> **Ronde 1 — de aanloop naar en de val van Troje.** Het oude Hoofdstuk 5
> ("Ilion in Vlammen", zeven Pallas-lessen + vier Minerva-hoofdstukken) is
> gesplitst op de eigen breekpunten van het verhaal: Hoofdstuk 7 **"De Appel
> der Tweedracht"** (Peleus & Thetis, het Oordeel van Paris, Leda en de Zwaan,
> Tyndareos' eed — bewust grammatica-arm, een adempauze), Hoofdstuk 8 **"De
> Wrok van Achilles"** (Pallas Les 8-11; Chiron als Achilles' leermeester,
> Minerva H8 "Onderwijs") en Hoofdstuk 9 **"Ilion in Vlammen"** (Pallas Les
> 12-14, incl. de vertakking Trojaans/Grieks/Neutraal; de gevangen Trojaanse
> vrouwen als menselijke prijs van de overwinning, Minerva H7 "Slavernij").
> Ervoor zijn twee nieuwe hoofdstukken ingevoegd die de generatie vóór Troje
> introduceren — bewust vóór de Appel der Tweedracht, zodat personages als
> Peleus al bestaan wanneer ze daar trouwen: Hoofdstuk 5 **"Het Gulden Vlies"**
> (Jason & de Argonauten, met Peleus/Telamon/Laertes als latere vaders van
> Achilles/Ajax/Odysseus, een cameo van Herakles en Orpheus; sluit af met
> Medea's wraak in Korinthe) en Hoofdstuk 6 **"De Vloek van Thebe"** (Kadmos,
> Oedipus & de Sfinx, De Zeven tegen Thebe, Antigone; opent met Niobe en sluit
> af met Pentheus — samen met Medea een duister drieluik van
> moeder/kind-tragedies, telkens net apart genoeg om niet op elkaar te
> stapelen). Beide nieuwe hoofdstukken zijn bewust grammatica-arm (herhaling)
> — ze vallen buiten Pallas' eigen lesnummering, dus Pallas Les 8 begint nog
> steeds precies in Hoofdstuk 8.
>
> **Ronde 2 — Odysseus en Aeneas als parallelle vluchtelingen.** Beide helden
> ontvluchten dezelfde brandende stad, en de Aeneis is voor het eerste deel
> bewust als Odyssee-echo gebouwd, tot en met een eigen onderwereldbezoek.
> Daarom lopen ze niet na elkaar maar **naast elkaar**, als twee lijnen binnen
> twee gedeelde hoofdstukken (zelfde principe als Hoofdstuk 3's Io/Herakles):
> Hoofdstuk 10 **"Vluchten uit Troje"** — geopend met het lot van de andere
> thuiskerende strijders (de Kleine Ajax, die Poseidon en Athena straffen voor
> zijn heiligschennis tegen Cassandra, en anderen), waarna Odysseus bij de
> Kykloop belandt en Aeneas' vroege omzwervingen volgen (de Harpijen, Sicilië,
> de dood van Anchises), met Baucis & Philemon en Arachne als onderweg-
> vignetten — en Hoofdstuk 11 **"Tussen Liefde en Lot"** (Kirke, die Odysseus
> naar de onderwereld stuurt, tegenover Dido, die Aeneas van zijn missie
> probeert af te houden — gevolgd door beider onderwereldbezoek en aankomst).
> De Trojaanse vrouwen zijn al verwerkt in Hoofdstuk 9; de dood van Agamemnon
> keert terug in Hoofdstuk 12; het lot van Neoptolemos blijft vooralsnog open.
> Na aankomst splitsen de lijnen zich weer: Hoofdstuk 12 **"Odysseus' Wraak"**
> (Ithaka, de vrijers, de dood van Agamemnon als contrasterende thuiskomst,
> met Hippodameia/Pelops' vloek als achtergrond) en Hoofdstuk 13 **"Het Begin
> van Rome"** (Romulus & Remus, de Sabijnse maagdenroof als direct vervolg,
> Tirannen en vrienden). Hoofdstuk 14 "De Stad van Athena" blijft daarnaast
> apart gesplitst — negen Pallas-lessen (19-27) waren te veel voor één
> hoofdstuk: Perseus & Medusa en Bellerophon & Chimaira als
> door-anderen-verteld bewijs van Athena's mentorschap, democratie, Atalanta
> bij de Spelen.
>
> **Overige `SP_MYTH_CANON`-plaatsing:** de onderwereld-zondaars (Tantalos,
> Sisyphos, Ixion, Danaïden) horen bij Odysseus' Hades-bezoek in Hoofdstuk 11,
> samen met Kirke/Dido; Orpheus & Eurydice en Persephone & Demeter horen bij
> Hoofdstuk 25 "De Rivier Lethe" (Orpheus verschijnt zo twee keer — jong in
> Hoofdstuk 5, gebroken in Hoofdstuk 25); Narcissus & Echo wordt een spiegel-/
> geluidspuzzel in Hoofdstuk 24 "De Bibliotheek van Mnemosyne", samen met de
> Titanenstrijd, die in de Finale terugkeert als onthulling dat Chronos zelf
> een verslagen Titaan is. Eros & Psyche en Pygmalion horen bij de Latijnse
> literatuur (Hoofdstuk 22-23). Atalanta, de Calydonische ever en Meleager
> vormen samen één vault-vignet; Actaeon (bij Artemis/Diana) en Ganymedes (bij
> het Trojaanse koningshuis) worden korte codex-asides. De Romeinse lijst:
> Sabijnse maagdenroof (Hoofdstuk 13), Horatii & Curiatii en Lucretia
> (Hoofdstuk 19 "Onder de Koningen"), Horatius Cocles/Mucius Scaevola/Cloelia/
> Cincinnatus/Coriolanus/Camillus (Hoofdstuk 20 "Verdedigers van de
> Republiek"), Regulus en Cato (Hoofdstuk 15), Spartacus en Cicero (Hoofdstuk
> 21). Resterende B-tier-restjes (Arion, Hippolytos, Endymion & Selene,
> Midas-uitbreiding) en Neoptolemos blijven vrij inzetbaar vault-materiaal,
> geen vaste plek nodig.

| # | Boek | Hoofdstuk | Grammatica (basis voor puzzels) |
|---|---|---|---|
| Proloog | — | Het Orakel van Chronos | Grieks alfabet, taalbewustzijn, eerste Latijnse woorden |
| 1 | I | De Namen van de Wereld | Zn, bn (alleen groep 1/2), lidwoord, nom./acc./voc. |
| 2 | I | De Werken van de Helden | Praesens, werkwoordstammen, imperativus, esse/posse |
| 3 | I | Beloften van Goden en Mensen | Genitivus, dativus, bijstelling |
| 4 | I | Het Labyrint van Herinneringen | Inf., voc., imperfectum, perfectum, ablativus |
| 5 | I | Het Gulden Vlies | *Herhaling* (nom. t/m ablativus) — geen nieuwe grammatica |
| 6 | I | De Vloek van Thebe | *Herhaling* (praesens t/m perfectum) — geen nieuwe grammatica |
| 7 | I | De Appel der Tweedracht | *Herhaling* — bewust grammatica-arm |
| 8 | I | De Wrok van Achilles | Imperf., sigmatische/thematische aoristus, znw medeklinkergroep, aanwijzende/pers. vnw |
| 9 | I | Ilion in Vlammen | Comparativus/superlativus, A.C.I., znw groep 3, congruentie — **vertakking Trojaans/Grieks/Neutraal** |
| 10 | II | Vluchten uit Troje | Medium, passief, aoristus passief; *Minerva H9:* plusquamperfectum, conjunctivus in bijzin |
| 11 | II | Tussen Liefde en Lot | Participium, genitivus absolutus; *Minerva H10:* A.c.I. |
| 12 | II | Odysseus' Wraak | Betrekkelijk vnw, conjunctivus, alpha-werkwoorden |
| 13 | II | Het Begin van Rome | Passief, ppp, deponentia, betrekkelijk voornaamwoord |
| 14 | II | De Stad van Athena | Futurum, optativus, mi-werkwoorden, stamaoristus, N.C.I. |
| 15 | II | Oorlog en Overwinning | Perf., fut., fut. exactum, ablativus absolutus |
| 16 | III | De Vader van de Geschiedenis | Historische taal, bronanalyse; conjunctivus praesens/perfectum |
| 17 | III | De Stem van de Filosofen | Complexe zinsbouw, argumentatie; gerundium, genitivus subj./obj. |
| 18 | III | Alexander en de Grenzen van de Wereld | Complexe werkwoorden, participia; gerundivum |
| 19 | IV | Onder de Koningen | Verdieping naamvallen; conjunctivus |
| 20 | IV | Verdedigers van de Republiek | Verdieping naamvallen; N.C.I., semi-deponentia |
| 21 | IV | Caesar Schrijft Geschiedenis | Gerundium, gerundivum (herhaling) |
| 22 | IV | Augustus en de Pax Romana | Literair Latijn |
| 23 | IV | Keizers en Dichters | Verdieping naamvallen |
| 24 | V | De Bibliotheek van Mnemosyne | Herhaling van alle grammatica |
| 25 | V | De Rivier Lethe | Integratie Grieks & Latijn |
| 26 (Finale) | V | Chronica Classica | Eindtoets van alle grammatica en taalvaardigheid |

**`SP_MYTH_CANON`** — de S/A/B-tier-mythenlijst + de Romeinse verhalen uit de
docx, bewaard als los naslagwerk. Het grootste deel is inmiddels toegewezen —
zie de canon-uitbreiding hierboven voor de volledige verdeling; wat daar niet
genoemd is, blijft vrij inzetbaar naarmate hoofdstukken worden gebouwd.

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

### 7.3 Clementia/Severitas — stil "Paragon/Renegade"-systeem (**gebouwd**)

Losjes geïnspireerd op Mass Effects Paragon/Renegade: bij (bijna) elke keuze
met interpersoonlijke lading krijgt de speler drie smaken van dezelfde
reactie — een meelevende/geduldige ("Clementia"), een nuchtere/daadkrachtige
("Severitas") en een twijfelende, neutrale derde optie — **ook wanneer alle
drie naar exact dezelfde volgende scène leiden**. Het punt is niet vertakking
maar **het gevoel van karakterkeuze**, stil bijgehouden en NERGENS aan de
speler getoond (geen HUD, geen scherm, geen melding) — precies zoals de Mass
Effect-balkjes zelf ondubbelzinnig zichtbaar zijn, maar hier bewust
omgekeerd: onzichtbaar, zodat het voelt als "wie ben ik" in plaats van "welk
getal moet ik maximaliseren". De neutrale optie bestaat specifiek voor
twijfelende spelers die zich niet in een van beide uitersten herkennen.

**Mechaniek:**
- Een keuzeregel in `CHOICES:` mag eindigen op `[CLEMENTIA]`, `[SEVERITAS]`
  of `[NEUTRAL]` vóór de `->`, bv. `* Blijf eerst naast hem zitten
  [CLEMENTIA] -> CH1_A08B`. De tag wordt door `CNSParser.parseChoices`
  (singleplayer.js) uit het zichtbare label gesloopt — de speler ziet nooit
  `[CLEMENTIA]`/`[SEVERITAS]`/`[NEUTRAL]` op een knop.
- Bij een klik roept de knop `spChoosePath(target, approach)` aan (i.p.v.
  rechtstreeks `spGoCns`); die telt eerst stil op via `spHookApproach()` en
  navigeert dan pas door. `spHookApproach()` telt alleen `CLEMENTIA`/
  `SEVERITAS` mee — `NEUTRAL` levert bewust GEEN verschuiving op de schaal
  op (de functie herkent het label niet en doet dan simpelweg niets).
  `SP_STATE.approach = {clementia, severitas}` (per saveslot, net als
  codex/flags).
- **Volgorde wordt geschud**: `SCREENS.spPlay` (singleplayer.js) shuffelt de
  zichtbare keuzes bij elk bezoek opnieuw (`shuffle()`, core.js) zodra minstens
  één keuze een `approach`-tag draagt — dus Clementia/Neutraal/Severitas staan
  nooit in een vaste, raadbare volgorde, en de brontekst zelf verraadt niet
  welke knop welke kant op telt.
- **Puzzel-scènes zijn uitgesloten**: `spRenderPuzzle()` gebruikt
  `scene.choices[0].target` rechtstreeks en roept `spGoCns` aan, niet
  `spChoosePath` — een `[TAG]` op een puzzelscène-keuze zou dus nooit vuren.
  Tag daarom alleen keuzes op scènes ZONDER `PUZZLE:`-sectie.
- `spApproachTendency(state)` levert `"clementia"`/`"severitas"`/`"neutraal"`
  (bij een gelijke stand of nog geen enkele getagde keuze) op. Sinds
  Hoofdstuk 3 gebruiken NPC's dit ook echt: `{tendency_address}`/
  `{tendency_address_cap}` (`SpTextResolver`, singleplayer.js) resolven naar
  een willekeurige, gender-passende aanspreekvorm uit `SP_TENDENCY_PHRASES`
  (singleplayer-data.js — 4 varianten per houding, met %NOUN% vervangen door
  `SP_TENDENCY_NOUN[state.gender]`), zomaar in te voegen middenin een TEXT/
  DIALOGUE-zin (bv. "en jij, {tendency_address}, hebt inmiddels gemerkt..." —
  zie `CH3_IO14`/`CH3_ATHENA` in `SP_CH3_CNS`). Dit is bewust een lichtgewicht
  oplossing: het varieert alleen HOE een NPC je aanspreekt, niet WAT er
  gebeurt. Een echt vertakkend `CONDITION`-mechanisme (andere scène-inhoud of
  -keuzes afhankelijk van de houding) staat nog open, zie §8.
- Hoofdstuk 1 heeft 13 getagde keuzedrietallen verspreid over de drie lijnen
  (zie `SP_CH1_CNS`), Hoofdstuk 2 nog eens 8 (zie `SP_CH2_CNS`) en Hoofdstuk 3
  nog eens 4 (zie `SP_CH3_CNS`) — steeds op
  momenten met echte emotionele lading (bv. troosten vs. doorpakken bij Midas'
  ineenstorting, medelijden vs. nuchterheid bij Zeus' zwangerschap, meeleven
  vs. nieuwsgierigheid bij de geketende Prometheus) — niet letterlijk op elke
  overgang, want een gedwongen dilemma bij bv. "trek de mantel aan -> ga
  verder" voegt niets toe. Nieuwe hoofdstukken volgen hetzelfde principe: tag
  waar de keuze een karakterkant laat zien (altijd met een neutrale derde
  optie erbij), sla over waar het puur een leesknop is.
- Bij een enkel getagd paar dat structureel UITEENLOOPT (bv. `CH1_A08`:
  Clementia -> `CH1_A08B` een extra tussenscène, Severitas -> direct
  `CH1_A09`) kiest de neutrale optie altijd één van beide bestaande paden —
  nooit een nieuw, vierde vervolg — en wordt de tekst zo geschreven dat dat
  natuurlijk aanvoelt (zie bv. `CH2_L02`/`CH2_S02` in `SP_CH2_CNS`).

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

### 7.6 Hoofdstuk 2: "De Werken van de Helden" — Hera's vier gezichten (**gebouwd**)

Thema: Hera (Juno) toont zich in dit hoofdstuk achtereenvolgens als
**achtervolger** (Latona), **vervloeker** (Kallisto), **manipulator**
(Semele) en **onverzoenlijke vijand** (Herakles) — vier verschillende
gedaanten van dezelfde jaloezie. Vier parallelle lijnen (`SP_CH2_CNS`,
singleplayer-data.js) i.p.v. Hoofdstuk 1's drie:

- **L — Latona** (`CH2_L01`-`L08`): rondt in dit hoofdstuk volledig af. **Geschreven.**
- **S — Semele** (`CH2_S01`-`S08`): grijpt terug naar Bacchus uit Hoofdstuk 1
  lijn A (zijn eigen bio in `SP_CODEX_PERSONS.bacchus` is bijgewerkt met deze
  geboorte). Rondt volledig af. **Geschreven.**
- **K — Kallisto** (`CH2_K01`-`K09`): introduceert Artemis (Codex-id blijft `diana`,
  net als Latona's lijn — één persoon-id per godheid ongeacht welke naam een
  lijn gebruikt, nu met een `full`-tekst over haar jachtband). Rondt volledig
  af. **Geschreven.**
- **H — Herakles** (`CH2_H01`-`H12`): **bewust onvolledig, en de langste lijn van
  de vier** — dekt zijn geboorte (inclusief de slangen-in-de-wieg-episode),
  zijn huwelijk met Megara, de grote plottwist (Hera's waanzin drijft hem
  ertoe zijn eigen vrouw en kinderen te doden — bewust NOOIT expliciet in
  beeld gebracht, zie hieronder), zijn boetedoening bij het orakel van
  Delphi, en de eerste twee van zijn twaalf werken (Nemeïsche Leeuw + Hydra
  van Lerna, **Chronica's eerste gebruik van de Combat-bridge**, §8). Vlak na
  de Leeuw (`CH2_H09`) geeft Herakles, die voortaan de leeuwenhuid zelf als
  mantel draagt, zijn nu overbodige harnas rechtstreeks aan de speler —
  Chronica's eerste equip-ontgrendeling na de proloog (`armor:licht`, zie §5).
  De rest van de twaalf werken volgt in Hoofdstuk 3 (`SP_CAMPAIGN` ch3:
  "Apotheose van Herakles"). Zijn Hoofdstuk-2-segment levert wél al zijn eigen
  fragment op (zie hieronder), en een eigen eretitel
  (`ch2_herakles_eerste_taken`) — alleen zijn volledige verhaal is nog niet
  af. **Geschreven.**

  **Behandeling van de plottwist** (`CH2_H06`, "De Daad die Niet Ongedaan Kan
  Worden"): de kindermoord zelf staat NERGENS op de pagina — de scène knipt
  van het moment waarop de waanzin hem overweldigt naar de stilte erna, en
  legt alle nadruk op zijn ontzetting en verdriet bij het besef, niet op de
  daad zelf. Dat is bewust dezelfde aanpak als de klassieke bronnen zelf
  (Euripides' `Herakles` toont de moord ook niet op het toneel, enkel het
  resultaat) — én de enige manier om zo'n zwaar thema serieus te nemen zonder
  in strijd te komen met de "nooit grimmig of horror-achtig, ook niet bij
  oorlog of gevaar"-regel uit `gemini-comic-style.md` (die geldt voor
  illustraties, maar de onderliggende toon-eis geldt hier net zo goed voor
  de verteltekst zelf).

#### Herinneringsfragmenten (Fragmentum Memoriae) — het nieuwe hoofdstukgate

Anders dan Hoofdstuk 1 ("één lijn voltooien = door") moet de speler hier
**alle vier de lijnen afronden**. Elke lijn geeft bij afsluiting geen
klassieke beloning maar een **Herinneringsfragment** (`FRAGMENT:`-sectie,
bare id, `spHookFragment` in singleplayer.js — zelfde patroon als `CODEX:`),
met naam + icoon uit `SP_FRAGMENTS` (singleplayer-data.js):

| Lijn | Fragment | Icoon |
|---|---|---|
| Latona | Volharding | 🍃 |
| Kallisto | Onschuld | 🐻 |
| Semele | Waarheid | ⚡ |
| Herakles | Moed | 🦁 |

Elke lijn eindigt terug op de hub (`CH2_000`) in plaats van rechtstreeks naar
een epiloog — zo kan de speler in dezelfde saveslot alle vier na elkaar
spelen. Zodra `SP_STATE.fragments` alle vier bevat, verschijnt op de hub een
extra keuze ("Spreek het Orakel aan…") die naar `CH2_ATHENA` leidt. Dat werkt
via een nieuwe, generieke keuze-tag: een regel in `CHOICES:` mag eindigen op
`[REQUIRE:sleutel=getal]` (`CNSParser.REQUIRE_TAG_RE`, geparst net als
`[CLEMENTIA]`/`[SEVERITAS]`); `spChoiceVisible()` verbergt de keuze tenzij aan de
voorwaarde is voldaan. Nu alleen `fragments=4` in gebruik, maar generiek
genoeg voor latere vergelijkbare gates.

#### Athena: zwijgende getuige, dan mentor

Athena kijkt tijdens alle vier de verhalen alleen toe — een korte cameo in
lijn L (`CH2_L07`, `PERSON: athena:intro`) legt dit al vast, en dezelfde
regie geldt voor S/K/H zodra die geschreven zijn: ze grijpt nooit in, ze
observeert. Pas in `CH2_ATHENA` (bereikt nadat alle 4 fragmenten binnen zijn)
treedt ze voor het eerst naar voren als actieve mentor, met de vaste
kernboodschap: *"Heldendom ontstaat niet wanneer het lot je gunstig gezind
is, maar wanneer je weigert eraan ten onder te gaan."* Dit zet `PERSON:
athena:full` en de eretitel `ch2_athena_mentor`, en leidt door naar
`CH2_ORAKEL` (generieke afsluiting, noemt alle vier lijnen) → `CH2_EINDE`.

**L/S-kruisverwijzing (gebouwd)**: het idee dat Latona en Semele elkaars
geboorte-climax terloops vermelden staat er nu — als een korte alinea IN elke
lijns eigen slotscène, niet als aparte tussenscène (`CH2_BIRTHS` bestaat
bewust niet, want elke lijn eindigt terug op de hub, niet naar een gedeeld
epiloog). `CH2_L08` vermeldt vaag dat "elders, in Thebe, een ander verhaal
zich ontvouwt"; `CH2_S08` vermeldt, zonder namen te noemen, dat de speler
Bacchus al eerder heeft zien helpen "bij het opheffen van een vloek over
gouden vingers" — een knipoog naar Hoofdstuk 1 lijn A voor wie die al
speelde, zonder de andere lijn te spoilen voor wie dat nog niet deed.

**Naamgevingsregel** (uitbreiding van Hoofdstuk 1's Latijn/Grieks-regel, §7.1):
L en S gebruiken overal **Romeinse** namen (Latona, Jupiter, Juno, Apollo,
Diana, Bacchus, Neptunus); K en H gebruiken overal **Griekse** namen (Zeus,
Hera, Artemis, Herakles). Elke god/godin heeft nog steeds maar één Codex-
persoon-id (bv. `hera`, niet ook een aparte `juno`) met `nm`: "Primaire naam
(secundaire naam)" — ongeacht welke naam de verteltekst van een specifieke
lijn gebruikt. Latijnse grammatica-oefenzinnen (in puzzels/grammatica-tabellen)
blijven altijd Latijn, ook binnen een Grieks-verteld personage (zie de
Vulcanus/Hephaistos-precedent uit Hoofdstuk 1).

**Grammatica**: praesens (persoonsuitgangen -o/-s/-t/-mus/-tis/-nt op een
werkwoordstam), imperativus (kale stam/stam+e, meervoud +te), en de
onregelmatige esse/posse — drie nieuwe Codex-grammatica-entries
(`codex_grammatica_ch2_*`), elk met een paradigma-tabel, **vroeg ontgrendeld**
bij `CH2_000` (zelfde les als Hoofdstuk 1: een leerling moet een mislukte
puzzel meteen kunnen opzoeken, niet pas na afloop).

### 7.7 Puzzel-moeilijkheidsopbouw: meerkeuze → zelf typen (**gebouwd**)

Vastgelegde regel: puzzels mogen per hoofdstuk geleidelijk moeilijker worden
— van meerkeuze naar zelf typen. Twee nieuwe `puzzle.type`-waarden naast de
bestaande `"multiple-choice"`/`"greek-transliteration"` (`SP_PUZZLES`,
singleplayer-data.js; renderers in singleplayer.js):

- **`"typed-latin"`** — de speler typt het Latijnse antwoord zelf, met het
  gewone systeemtoetsenbord (`spRenderTypedLatinPuzzle`/
  `spCheckTypedLatinPuzzle`) — hoofdletter-/spatiëring-ongevoelig vergeleken.
  Latijn gebruikt hier geen tekens buiten een normaal toetsenbord, dus geen
  bijzondere behandeling nodig.
- **`"typed-greek"`** — de speler typt zelf Grieks, via een **eigen
  schermtoetsenbord** (`spGreekKeyboardHTML`) i.p.v. het systeemtoetsenbord.
  Het antwoordveld (`#spPuzzleInput`) staat op `readonly` + `inputmode="none"`
  — dezelfde truc die andere apps met een eigen invoermechanisme gebruiken om
  te voorkomen dat het systeemtoetsenbord van iPad/iOS vanzelf verschijnt.
  Het schermtoetsenbord heeft naast de 24 kleine letters ook drie
  modifier-toetsen die op de LAATST getypte letter inwerken
  (`spGreekApplyModifier`): spiritus lenis (᾿), spiritus asper (῾), en iota
  subscriptum (op α/η/ω). Deze drie tellen bewust als LETTERS, niet als
  versiering, en worden dus nooit weggefilterd bij het nakijken.
  **Nakijken** (`spNormalizeGreek`): NFD-decompose, verwijder alleen de echte
  accenttekens (acuut/gravis/circumflex/macron/brevis — niet relevant voor
  het antwoord), laat spiritus en iota subscriptum staan, normaliseer
  eind-sigma (ς) naar gewone sigma (σ), hoofdletter- en
  spatiëring-ongevoelig. Nog niet op echte iPad-hardware getest of
  `readonly`/`inputmode="none"` het systeemtoetsenbord in alle iOS-versies
  betrouwbaar onderdrukt — waarschijnlijk wel (staand patroon), maar een
  praktijktest is aan te raden zodra er een device beschikbaar is.

Nog geen bestaande puzzel is retroactief omgezet naar een getypte variant —
de nieuwe types zijn er klaar voor zodra een hoofdstuk ze nodig heeft (bv.
vanaf Hoofdstuk 3, of later in Hoofdstuk 2 bij Semele/Kallisto/Herakles).
Hoofdstuk 3 zelf gebruikt uiteindelijk nog `"multiple-choice"`, net als
Hoofdstuk 1/2 — de eerste getypte puzzel blijft dus open voor een later
hoofdstuk.

### 7.8 Hoofdstuk 3: "Beloften van Goden en Mensen" — twee vormen van vrijheid (**gebouwd**)

Anders dan Hoofdstuk 2's vier parallelle lijnen: twee hoofdlijnen
(`SP_CH3_CNS`, singleplayer-data.js, 43 scènes), gekozen omdat Argus Panoptes
en Mercurius geen zelfstandig verhaal zijn maar de climax van Io's eigen lijn,
en Europa's verhaal bewust GEEN eigen lijn kreeg maar een kort, ingeweven
NPC-commentaar (zie hieronder) — precies zoals in het gesprek vastgelegd.

- **Io** (`CH3_IO01`-`IO14`): Jupiter verhult zijn affaire eerst met een wolk,
  dan door Io in een witte vaars te veranderen zodra Juno argwaan krijgt.
  Juno eist de vaars op en stelt de honderdogige Argus Panoptes aan als
  wachter (`PERSON: argus`) — de climax van dezelfde lijn, niet een aparte
  keuze op de hub. Mercurius (`PERSON: hermes`) sust Argus met verhalen en
  fluitspel in slaap en doodt hem; Juno plaatst zijn honderd ogen op de
  pauwenstaart (`codex_io_argus`). Een steekvlieg jaagt Io vervolgens de
  wereld rond tot ze in Egypte haar menselijke gedaante terugkrijgt.
  Levert het fragment "Vrijheid" 🕊️ op en de eretitel `ch3_io`. **Geschreven.**

  **Europa-coda** (`CH3_IO14`, direct ná het fragment, vóór terugkeer naar de
  hub): Athena — sinds Hoofdstuk 2 actieve mentor, dus geen zwijgende
  toeschouwer meer — trekt zelf de vergelijking met Europa: bij Io wordt de
  vrouw een dier om de affaire te verbergen, bij Europa wordt Jupiter zelf
  een dier (een tamme witte stier) om de affaire te beginnen. Dit is de
  letterlijke "NPC-commentaar op de andere kant van Jupiter/Io" die is
  gevraagd, en meteen de eerste plek waar `{tendency_address}` wordt gebruikt
  (zie §7.3). Europa krijgt een eigen `PERSON:intro`/`codex_europa`-entry,
  maar bewust geen eigen scène-lijn of fragment — haar functie is
  contrastief, niet narratief zelfstandig.

- **Herakles** (`CH3_H01`-`H25`): rondt alle tien resterende werken af (na de
  Nemeïsche Leeuw + Hydra uit Hoofdstuk 2): de Cerynitische Hinde (gevangen
  zonder een wond, na een jaar achtervolging), de Erymanthische Ever (met een
  tragisch neveneffect — een vergiftigde pijl treft zijn eigen leermeester
  Chiron, `codex_chiron`, die zijn onsterfelijkheid ooit aan Prometheus zal
  afstaan), de Augiasstal (rivieren omgeleid, door Eurystheus afgekeurd op
  een technisch punt — een bewuste echo van de Hydra-episode uit Hoofdstuk 2),
  de Stymfalische Vogels (met Minerva's bronzen ratel — Athena's eerste
  actieve hulp als mentor, **opgelost met een puzzel, niet met combat**: eens
  uit het riet gejaagd is verder geen gevecht meer nodig), de Kretenzische
  Stier (losgelaten bij Marathon, een vooruitwijzing naar een latere held), de
  Merries van Diomedes (poëtische gerechtigheid: de koning gevoerd aan zijn
  eigen mensenetende paarden), de Gordel van Hippolyte (Juno's laatste,
  dodelijke list — weer een onschuldig slachtoffer van haar wraak, net als in
  Hoofdstuk 2), het vee van Geryon (met de Zuilen van Herakles als
  etiologische bijvangst), de Appels van de Hesperiden (**eveneens een
  puzzel i.p.v. combat**: Herakles herkent het Argus-patroon in Ladons nooit
  volledig slapende koppen en past dezelfde geduld-aanpak toe als bij de
  Cerynitische Hinde, in plaats van te vechten) en tot slot Cerberus, met
  blote handen overmeesterd. Levert het fragment "Volbrenging" ⚔️ op en de
  eretitel `ch3_herakles_labores`. **Geschreven.**

  **Combat/puzzel-balans (bewuste keuze, na gebruikersfeedback)**: van de tien
  werken zijn er drie al puur narratief/puzzel-opgelost qua aard van de mythe
  zelf (Hind, Augiasstal, Atlas-list) — de Stymfalische Vogels en Ladon zijn
  DAARBOVENOP bewust van combat naar puzzel omgezet, zodat de lijn niet
  overwegend uit gevechten bestaat. Overgebleven combat: centauren (Chiron-
  aanloop), Kretenzische Stier, Merries van Diomedes, Amazones, Geryon,
  Cerberus — zes stuks, tegenover negen puzzels in de hele lijn.

  **Combat-bridge**: zes nieuwe `SP_COMBAT_ENEMIES` (centauren,
  kretenzische_stier, merries_van_diomedes, amazones, geryon, cerberus) — nog
  zonder eigen tekeningen (net als de Nemeïsche Leeuw vóór Hoofdstuk 2),
  `img`-pad alvast ingevuld, valt terug op `icon`-emoji. Cerberus hergebruikt
  bewust het bestaande Boss Battle-bestand (`assets/bosses/Cerberus.png`) als
  enkelvoudige illustratie — geen losse koppen-bestanden beschikbaar, dus geen
  Hydra-achtige koppenstapeling.

**Fragmenten-gate**: zelfde patroon als Hoofdstuk 2, maar met NIEUWE fragment-
ids ("io", "labores" — bewust ANDERS dan Hoofdstuk 2's "herakles", want
`SP_STATE.fragments` is één doorlopende array over alle hoofdstukken heen).
De hub-keuze naar `CH3_ATHENA` staat daarom op `[REQUIRE:fragments=6]`
(Hoofdstuk 2's vier + deze twee) i.p.v. `fragments=2`. Beide lijnen eindigen
terug op `CH3_000`, precies als in Hoofdstuk 2.

**Grammatica**: genitivus, dativus, bijstelling (appositie) — drie nieuwe
Codex-grammatica-entries (`codex_grammatica_ch3_*`), **vroeg ontgrendeld** bij
`CH3_000`, zelfde regel als Hoofdstuk 1/2.

**Getest** (browser, gescripte volledige doorloop): beide lijnen volledig
uitgespeeld inclusief alle 7 puzzels en alle 8 gevechten (elke `spCombatAnswer`
gevolgd door `spCombatAttack()` zodra er genoeg EP is — de Combat-bridge-lus
vereist expliciet BEIDE stappen, niet alleen juist antwoorden), fragmenten/
flags/quests/eretitels kloppen, `fragments=6`-gate opent pas na alle zes
fragmenten, en `{tendency_address}`/`{tendency_address_cap}` resolven correct
naar een gender- en houding-passende aanspreekvorm in zowel de Europa-coda
als `CH3_ATHENA`.

---

## 8. Wat (nog) niet gebouwd is

In afgesproken bouwvolgorde:

1. **Combat-bridge (gebouwd, sinds Hoofdstuk 2)** — een EIGEN, lokale
   implementatie (vraag → EP → aanval), NIET Battle Mode's eigen lus
   hergebruikt (die is te sterk gekoppeld aan Firebase-multiplayer-state
   — zie `bmAnswer`/`bmTick`/`bmResolve` in battle.js). Verschil met Battle
   Mode: geen kunstmatige wachttijd tussen vraag en actie, want singleplayer
   heeft geen andere spelers om op te wachten — zodra je genoeg EP hebt, kun
   je meteen aanvallen. `COMBAT:`-sectie (bare vijand-id uit
   `SP_COMBAT_ENEMIES`, singleplayer-data.js) start het gevecht
   (`spStartCombatFromScene`/`SCREENS.spCombat`); vragen komen uit de al
   geleerde vocabulaire (`SP_STATE.vocab`). Beide voorbereide vijanden
   (`nemeische_leeuw`, `hydra`) worden inmiddels ook echt gebruikt: Herakles'
   Hoofdstuk-2-lijn (`CH2_H08`/`CH2_H10`-`H11`) is Chronica's eerste scène die
   de Combat-bridge daadwerkelijk inzet, met beide gevechten volledig
   uitgespeeld getest. Vijand-sprite via
   `spCombatSpriteHTML()`: romp (`img`) + bij de Hydra ook de losse
   `heads`-laag erbovenop, exact dezelfde absolute-stapel-truc en
   `ceil((hp/maxHp)*7)`-formule als Boss Battle se `bmBossSpriteHTML`/
   `bmBossAliveHeads` (bossbattle.js) — zonder die laag zou je alleen de romp
   met kale nekstompjes zien, nooit de koppen. Getest: 7/4/1/0 koppen bij
   100/50/~2/0% HP. De eretitel-`bonus` (§6) écht in de berekening verwerken
   staat nog open.
2. **`CONDITION`-mechanisme** — de kaart zelf is gebouwd (§7,
   `SCREENS.spWorldMap`), alle drie panelen zijn getekend en schakelbaar. Sinds
   Hoofdstuk 3 bestaat er al een LICHTGEWICHT vorm van reageren op
   `spApproachTendency()`: `{tendency_address}`/`{tendency_address_cap}` (§7.3)
   laat NPC's je aanspreken naar aanleiding van je Clementia/Severitas-houding,
   rechtstreeks ingebouwd in TEXT/DIALOGUE via `SpTextResolver` — geen nieuwe
   CNS-sectie nodig. Wat daar nog niet mee kan: een NPC of scène die
   afhankelijk van `flags`/`spApproachTendency()` andere KEUZES aanbiedt of
   een compleet ANDERE tekstvariant toont (bv. een personage dat expliciet
   verwijst naar welke Hoofdstuk-1-lijn je koos) — dat vereist een echt
   vertakkend `CONDITION`-mechanisme, dat nog niet bestaat.
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

**Vaste regel (vastgelegd 2026-07): `Chronica_Verhaalteksten.txt` (repo-root)
wordt bij elke wijziging aan verhaaltekst opnieuw gegenereerd en meegecommit.**
Reden: Gerben is zelf ook schrijver en wil zelf woorden/zinnen kunnen
aanpassen zonder steeds de volledige tekst heen-en-weer te hoeven sturen.
- **Genereren**: `node certamen/tools/export_verhaalteksten.js` (leest
  rechtstreeks uit `singleplayer-data.js`, dus altijd in sync — geen los
  bijgehouden kopie die kan verouderen). Ontdekt automatisch elk
  `SP_..._CNS`-blok, geen handmatige lijst om bij te werken bij een nieuw
  hoofdstuk.
- **Formaat: platte tekst (.txt), bewust geen .docx.** Het CNS-formaat is al
  leesbare platte tekst met structurele merktekens (scène-ID's, `->`-pijlen,
  `[CLEMENTIA]`/`[SEVERITAS]`/`[NEUTRAL]`/`[REQUIRE:...]`-tags) die exact intact moeten
  blijven. Een .docx-omweg riskeert dat Word's autocorrect die merktekens
  ongemerkt corrumpeert (rechte aanhalingstekens → krultekens, `->` → een
  en-dash) — bij .txt is er geen vertaalslag, wat Gerben bewerkt IS het
  bronformaat.
- **Inhoud per hoofdstuk**: een STROOMSCHEMA (ingesprongen boomstructuur van
  scènes + keuzes, alleen inspringend bij een echt vertakkingspunt, met
  "(zie hierboven)" bij convergentie en "(volgend hoofdstuk)" bij de grens
  naar het volgende hoofdstuk) gevolgd door de VOLLEDIGE ruwe CNS-tekst.
- **Workflow**: Gerben bewerkt (een kopie van) het bestand en stuurt het (of
  de aangepaste alinea's) terug; Claude verwerkt de wijzigingen in
  `singleplayer-data.js`, regenereert het bestand, commit + pusht beide.
