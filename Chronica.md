# Chronica Classica — Masterplan (BETA — proloog + Hoofdstuk 1-6 speelbaar)

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
> `{tendency_address}` (zie §7.3). **Hoofdstuk 4** ("Het Labyrint van
> Herinneringen") is eveneens **volledig speelbaar**: twee hoofdlijnen —
> Theseus (Ariadne, de Minotaurus, met Daidalos & Ikaros erin verweven i.p.v.
> een aparte lijn) en Phaëthon (het Paleis van de Zon, de zonnewagen) — zie
> §7.9. Beide lijnen draaien om dezelfde kern: een belofte die niemand meer
> ongedaan kon maken. **Hoofdstuk 5** ("Het Gulden Vlies") is eveneens
> **volledig speelbaar**, maar met een bewust ANDERE structuur dan Hoofdstuk
> 1-4: geen hub met parallelle lijnen, maar één doorlopend tochtenlogboek
> langs de tocht van de Argo, met negen cameo-clusters van latere helden
> (Theseus, Tydeus, Atalanta & Meleager, Kastor & Polydeukes, Herakles &
> Hylas, Argos, Orpheus, Nestor & Philoktetes) en een nieuw puzzeltype
> (schuifpuzzel/tile-swap) — zie §7.10. **Hoofdstuk 6** ("De Vloek van
> Thebe") is eveneens **volledig speelbaar**: net als Hoofdstuk 5 geen hub
> met lijnen, maar ditmaal bewust NIET-chronologisch verteld —
> "generatiesprongen" volgens het patroon van de vloek zelf (hoogmoed, straf
> die de kinderen treft) in plaats van jaartal. Van Kadmos' stichting van
> Thebe via Niobe, Oedipus & de Sfinx, de Zeven tegen Thebe (met Tydeus,
> bekend uit Hoofdstuk 5) en de Epigonen tien jaar later (met Tydeus' zoon
> Diomedes) naar Antigone, en sluit — bewust terug in de tijd — af met
> Pentheus en de Bacchanten. Nog een nieuw puzzeltype erbij: de koppelpuzzel
> ("matching") — zie §7.11.
> Er zijn 3 saveslots per leerling, een
> aanpasbare Chronica Classica Avatar (de boer, met verhaal-ontgrendeling), en
> een eretitel-systeem dat doorwerkt in de Battle Mode/Boss Battle-lobby. De
> rest van de campagne (Hoofdstuk 7 t/m 28 + Finale) staat als metadata-skelet
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
| **Hoofdstuk 4**: hub + twee lijnen (Theseus/Ariadne/Minotaurus met Daidalos & Ikaros erin verweven, en Phaëthon) | `certamen/singleplayer-data.js` (`SP_CH4_CNS`, 34 scènes) | ✅ werkend — beide lijnen + 1 Combat-bridge-gevecht (Minotaurus) + 5 puzzels (infinitivus/vocativus/ablativus bij Theseus, imperfectum/perfectum bij Phaëthon) + fragmenten-gate (fragments=8) + `{tendency_address}` + alle 5 grammatica-tabellen + een leesvalstrik in het labyrint (`CH4_T06B`, zie §7.1/§7.9) getest (Node-reachability + echte browser-render via `spGoCns()`, zie §7.9) |
| **Hoofdstuk 5**: één doorlopend tochtenlogboek (geen hub/lijnen) — de tocht van de Argo, met negen cameo-clusters van latere helden | `certamen/singleplayer-data.js` (`SP_CH5_CNS`, 33 scènes) | ✅ werkend — herhaling nom. t/m abl. (geen nieuwe grammatica) + 5 puzzels (1 per naamval, over 4 puzzeltypes incl. het nieuwe "tile-swap") + 2 Combat-bridge-gevechten (Amycus, de Draak van Colchis) + één perspectiefkeuze (Atalanta/Meleager, zelfde inhoud vanuit twee invalshoeken) + Medea's wraak in Korinthe als terughoudend verteld slot — Node-reachability + volledige browser-doorloop van alle nieuwe mechanieken via `spGoCns()`, zie §7.10 |
| Meerdere alinea's per scène (`spParagraphsHTML`) | `certamen/singleplayer.js` | ✅ werkend — CNS-tekst splitst op lege regels in aparte `<p>`-elementen (bugfix: smolt eerst visueel samen tot één alinea) |
| Meerkeuze-grammaticapuzzel (naast de Griekse transliteratie-puzzel) | `certamen/singleplayer.js` (`spRenderMCPuzzle`/`spCheckMCPuzzle`), `SP_PUZZLES` (`type:"multiple-choice"`) | ✅ werkend — 9 puzzels (lidwoord/naamval/vocativus × 3 lijnen) |
| **Hoofdstuk 6**: geen hub/lijnen, bewust NIET-chronologisch — "generatiesprongen" volgens het patroon van de vloek | `certamen/singleplayer-data.js` (`SP_CH6_CNS`, 27 scènes) | ✅ werkend — Kadmos/Niobe/Oedipus & de Sfinx/Zeven-tegen-Thebe+Epigonen (Tydeus & Diomedes)/Antigone/Pentheus & Bacchanten + 6 puzzels (praesens/imperfectum/perfectum-herhaling over 4 types, incl. het nieuwe "matching") + 1 Combat-bridge-gevecht (Laodamas) + 3 Clementia/Severitas-keuzemomenten — Node-reachability + volledige browser-doorloop (incl. een bug in de koppelpuzzel-foutmelding, gevonden én gefixt tijdens het testen) via `spGoCns()`, zie §7.11 |
| **Schuifpuzzel** (tegels tikken-om-te-wisselen, iPad-veilig — geen drag) | `certamen/singleplayer.js` (`spRenderTileSwapPuzzle`/`spCheckTileSwapPuzzle`), `SP_PUZZLES` (`type:"tile-swap"`) | ✅ werkend — sinds Hoofdstuk 5 (`puzzle_ch5_ablativus`), zie §7.10 |
| **Koppelpuzzel** (twee kolommen, tik-om-te-koppelen) | `certamen/singleplayer.js` (`spRenderMatchingPuzzle`/`spMatchTapLeft`/`spMatchTapRight`), `SP_PUZZLES` (`type:"matching"`) | ✅ werkend — sinds Hoofdstuk 6 (`puzzle_ch6_matching_tempora`), zie §7.11 |
| **FLAG-hook**: keuzes/lijnkeuze dragen door in `SP_STATE.flags` | `certamen/singleplayer.js` (`spHookFlag`) | ✅ werkend (bv. `ch1_lijn`, `ch1_voltooid`) — conditionele NPC-reacties op flags volgen later |
| Scène-renderer (tekst/dialoog/keuzes) | `certamen/singleplayer.js` (`SCREENS.spPlay`) | ✅ werkend |
| **"Terug naar menu"-knop** op elk verhaalscherm (gewone scènes, alle 6 puzzeltypes, gevecht) | `certamen/singleplayer.js` (`spBackToMenuButtonHTML`, navigeert naar `spRenderLanding()`) | ✅ werkend — vóór 2026-07 kon je een verhaal alleen verlaten door het hoofdstuk af te ronden of de app te sluiten |
| **Voorkomt onbeperkt herhalen van een afgeronde hub-lijn** (en het Clementia/Severitas-punten-stapelen dat daarbij hoorde) | `certamen/singleplayer.js` (`CNSParser.DONE_TAG_RE`, `spChoiceAlreadyDone`) | ✅ werkend — `[DONE:vlagnaam]`-tag op `CH2_000`/`CH3_000`/`CH4_000`, zie §7.6 |
| Grieks-alfabet-transcriptiepuzzel (blokkeert voortgang) | `certamen/singleplayer.js` (`spRenderPuzzle`/`spCheckPuzzle`), `SP_PUZZLES`/`SP_GREEK_ALPHABET` | ✅ werkend |
| Klassekeuze → Battle Mode-klasse (REWARD-hook) | `certamen/singleplayer.js` (`spHookReward`), `SP_CLASS_REWARD_MAP` | ✅ werkend |
| Codex Memoriae — 7 tabbladen, oud-perkament-uiterlijk | `certamen/singleplayer.js` (`SCREENS.spCodex` + hooks), `certamen/singleplayer-data.js` (`SP_CODEX_ENTRIES`/`SP_CODEX_PERSONS`/`SP_VOCAB_ENTRIES`/`SP_SOUVENIRS`) | ✅ werkend — Herinneringen/Mythologie/Geschiedenis/Personen/Grammatica/Vocabulaire/Afbeeldingen (§7.2.1); quests hebben nog geen eigen scherm |
| Eenmalige gender-keuze (voornaamwoorden, géén naam) | `certamen/singleplayer.js` (`spRenderGenderPick`), `SP_PRONOUNS`/`SP_GENDER_OPTIONS` | ✅ werkend |
| **3 saveslots** per leerling | `certamen/singleplayer.js` (`SCREENS.spSlots`), `SP_MAX_SLOTS` | ✅ werkend — beginnen/verdergaan/verwijderen (met bevestiging) |
| **Offline-first opslag** (localStorage primair, Firebase spiegel) | `certamen/singleplayer.js` (`spSaveProgress`/`spLoadAllSlots`) | ✅ werkend — speelbaar zonder inloggen/internet |
| **Chronica Classica Avatar** (de boer: vodden + hooivork), pixel-sprite, verhaal-ontgrendeling | `certamen/singleplayer.js` (`SCREENS.spAvatarEdit`, `spAvatar*`, `spAvatarIsUnlocked`) | ✅ werkend — rendert met `renderPixelHeroPreview`/`_bmPixelLayers` (battle.js), niet `bmAvatarSVG` |
| Chronica-sectie op het masterprofiel ("Mijn profiel"), tegenhanger van Battle Mode | `certamen/games.js` (`SCREENS.collection`) | ✅ werkend — avatar + passieve bonussen, direct na de Battle Mode-sectie |
| **Eretitels** (verdiend via keuzes/voortgang) | `certamen/singleplayer.js` (`spAwardTitle`/`SP_TITLES`), CNS-sectie `EERETITEL:` | ✅ werkend — account-breed, offline-first |
| Eretitels als eigen categorie tussen de eerbewijzen | `certamen/core.js` (`ACH_CATEGORIES.chronica`), `certamen/games.js` (`SCREENS.collection`) | ✅ werkend — meegerenderd door `achGroupsHTML`, net als Algemeen/Klassieke Spellen |
| Eretitel zichtbaar/kiesbaar op profiel + slotscherm | `certamen/singleplayer.js` (`spTitlesSectionHTML`/`spToggleEquipTitle`) | ✅ werkend |
| Gekozen eretitel als pill in Battle Mode/Boss Battle-lobby | `certamen/battle.js` (`bmDoJoin` schrijft `player.title`, `bmRenderHostLobby` toont het) | ✅ werkend |
| Campagnekaart-metadata (Proloog + 28 hfdst + Finale, 5 boeken) + mythencanon | `certamen/singleplayer-data.js` (`SP_CAMPAIGN`, `SP_MYTH_CANON`) | ✅ data — scènes van hfdst 7+ nog niet geschreven |
| **Illustraties** (`IMAGE:`-sectie → beeld boven de scène, mist-veilig) | `certamen/singleplayer.js` (`spSceneImageHTML`) | ✅ werkend — proloog + alle 3 hoofdstuk-1-lijnen (`prologue.png`, `midas.png`, `birth_of_athena.png`, `pandora.png`) én nu ook Hoofdstuk 2 (7 beelden) en Hoofdstuk 3 (7 beelden), zie §7.6/§7.8 |
| Gemini-huisstijl-Gem (stripstijl, scène-illustraties) | `certamen/assets/chronica/gemini-comic-style.md` | ✅ herbruikbare Gem-instructie |
| Gemini-huisstijl-Gem (museumstukken, Herinneringen-tab) | `certamen/assets/chronica/gemini-souvenir-style.md` | ✅ herbruikbare Gem-instructie — vaste sokkel/stolp/kussentje-opstelling, zie §7.2.1 |
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
`REWARD`, `INVENTORY`, `PUZZLE`, `EERETITEL`, `FLAG`, `PERSON`, `VOCAB`,
`FRAGMENT`, `SOUVENIR`.

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

### 5.1 Equip-ontgrendelingen — routekaart voor de resterende hoofdstukken (**vastgelegd, nog te bouwen**)

`BM_AVATAR_PARTS` (battle-data.js) kent meer categorieën/opties dan Chronica
op dit moment kan ontgrendelen. Buiten beschouwing blijven, zoals altijd:
`SP_AVATAR_FREE_PARTS` (geslacht/huid/haar/haarkleur/baard — uiterlijk, geen
gevechtsuitrusting) en de drie in Chronica **verborgen** categorieën
(`SP_AVATAR_HIDDEN_PARTS`: `victoryAnim`/`legendary`/`prestige` — die horen
puur bij Battle Mode se eigen niveau/mastery/coins-progressie, niet bij het
verhaal). Wat overblijft — `armor`/`helm`/`schild`/`wapen`/`cape` — moet,
net als de drie proloog-wapens en de mantel/leeuwenhuid-harnas uit Hoofdstuk
1/2, een eigen verhaalmoment krijgen via `SP_AVATAR_STORY_UNLOCKS`. Onderstaande
routekaart legt vast WELK hoofdstuk WELKE optie oplevert en HOE de held het
in de fictie krijgt — zodat dit niet vergeten wordt zodra die hoofdstukken
daadwerkelijk geschreven worden. Nog niets hiervan is gebouwd behalve de
rijen die al ✅ zijn.

| Hoofdstuk | Equip-optie | Hoe de speler het krijgt (fictie) | Status |
|---|---|---|---|
| Proloog | `wapen:boog`/`speer`/`zwaard` | Klassekeuze bij het Orakel (Boogschutter/Hopliet/Cavalerist) | ✅ gebouwd |
| Hoofdstuk 1 (elke lijn) | `armor:robe` | Het Orakel zelf hult de speler in een mantel, na de eerste lijn | ✅ gebouwd |
| Hoofdstuk 2 (`CH2_H09`) | `armor:licht` | Herakles draagt voortaan de huid van de Nemeïsche Leeuw als mantel en geeft zijn oude harnas aan de speler | ✅ gebouwd |
| **Hoofdstuk 4** (Theseus/Labyrint) | `helm:standard` | Koning Aegeus geeft de speler een eenvoudige bronzen helm mee voor de afdaling in het Labyrint |  |
| **Hoofdstuk 4** (Theseus/Labyrint) | `schild:rond` | Een rond schild, gevonden in het wapenarsenaal van het paleis van Knossos |  |
| Hoofdstuk 5 (Argonauten, `CH5_006`) | `armor:middel` | Standaard reisharnas, uitgedeeld aan de hele bemanning van de Argo bij vertrek | ✅ gebouwd |
| Hoofdstuk 5 (Argonauten, `CH5_006`) | `helm:bandana` | Een eenvoudige hoofddoek tegen zon en zeewind tijdens de lange tocht | ✅ gebouwd |
| **Hoofdstuk 8** (Wrok van Achilles) | `armor:zwaar` | Hephaistos smeedt nieuw, goddelijk harnas voor Achilles nadat Hector Patroklos' (Achilles') oude wapenrusting buitmaakte — de speler krijgt een eigen exemplaar | |
| **Hoofdstuk 8** (Wrok van Achilles) | `schild:ovaal` | Het beroemde Schild van Achilles, in hetzelfde smeedmoment door Hephaistos gemaakt |  |
| **Hoofdstuk 9** (Ilion in Vlammen) | `helm:open` | Een open vechthelm, opgeraapt tijdens de chaos van Troje's val |  |
| **Hoofdstuk 14** (De Stad van Athena) | `cape:kort` | Athena, als mentor, schenkt de speler een korte chlamys als teken van haar bescherming |  |
| **Hoofdstuk 15** (Oorlog en Overwinning — Thermopylae) | `armor:hopliet`, `helm:hopliet`, `schild:vierkant` | Volledige hoplietuitrusting, gedragen aan de zijde van Leonidas' driehonderd |  |
| **Hoofdstuk 17** (De Stem van de Filosofen) | `wapen:staf` | Een filosofenstaf, meegekregen uit Socrates/Aristoteles' school |  |
| **Hoofdstuk 18** (Alexander) | `helm:kroon` | Een eervolle kopie van Alexanders eigen diadeem |  |
| **Hoofdstuk 20** (Verdedigers van de Republiek) | `schild:tower` | Een groot verdedigingsschild, vernoemd naar Horatius Cocles die in zijn eentje de brug verdedigde |  |
| **Hoofdstuk 24** (Augustus en de Pax Romana) | `cape:lang` | Augustus' keizerlijke mantel (paludamentum), bij de vestiging van de Pax Romana |  |
| **Finale** | `armor:ceremonieel` | Ceremonieel harnas, geschonken door Kronos/Athena/Mnemosyne bij het voltooien van heel Chronica Classica |  |

**Kleine bijkomende fix (los van de routekaart hierboven):** `capekleur` heeft
in `BM_AVATAR_PARTS` geen enkele `requires` (alle zes kleuren zijn in Battle
Mode al vanaf het begin vrij) maar staat nog niet in `SP_AVATAR_FREE_PARTS`
— zodra `cape:kort` bij Hoofdstuk 14 wordt gebouwd, moet `capekleur` ook aan
`SP_AVATAR_FREE_PARTS` worden toegevoegd (net als `haarkleur`), anders is er
straks wel een cape maar geen enkele kleur ervoor beschikbaar.

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

### 6.1 Bonus-eretitels — routekaart (**vastgelegd, nog te bouwen**)

Doel: het moet voor een ervaren multiplayer-speler (Battle Mode/Boss Battle/
Total War) ook echt lonen om Chronica te spelen, zonder dat de bonussen
diezelfde speler in multiplayer **overpowered** maken. Daarom NIET elk
hoofdstuk een eigen bonus (28 hoofdstukken + finale zou een enorme stapel
kleine voordelen worden, oncontroleerbaar voor balans) maar **één bonus per
Boek** (5 boeken) plus de al bestaande proloog-bonus — zes bonus-momenten
over de HELE campagne, elk bescheiden en met een plafond, zelfde
`bonus:{scope,type,val,desc}`-vorm als `bewaarder_herinnering`. Net als de
bestaande titel geldt de scope altijd `["battle","boss","totalwar"]` — NOOIT
Chronica zelf, want het punt is juist dat multiplayer-vaardigheid niet nodig
is om deze te verdienen, maar wel profiteert.

| Titel (id, te maken) | Ontgrendeld bij | Bonus (voorstel) | Waarom dit thematisch past |
|---|---|---|---|
| `bewaarder_herinnering` | Proloog voltooid | +1 BE bij een snel juist antwoord | Al **gebouwd** — het bestaande precedent |
| `kroniekschrijver_boek_1` | Boek I compleet (Hoofdstuk 1 t/m 9, "De Ontwaakte Herinnering") | `streak_shield` — één fout antwoord per wedstrijd breekt je combo niet | Letterlijk Hoofdstuk 2's kernboodschap: "heldendom ontstaat niet wanneer het lot je gunstig gezind is, maar wanneer je weigert eraan ten onder te gaan" |
| `kroniekschrijver_boek_2` | Boek II compleet (Hoofdstuk 10 t/m 15, "Helden en Koningen") | `be_head_start` — elke wedstrijd start met +5 BE | Een vliegende start na een lange thuisreis (Odysseus/Aeneas — dit hele boek gaat over thuiskomen) |
| `kroniekschrijver_boek_3` | Boek III compleet (Hoofdstuk 16 t/m 18, "De Wereld van Mensen") | `coin_bonus_pct` (waarde 5) — +5% munten na afloop van een wedstrijd | Kritisch denken en wijsheid (Herodotos/Socrates/Aristoteles) vertaald naar beter beheer van middelen — een economische, geen gevechts-bonus, dus geen effect op win/verlies |
| `kroniekschrijver_boek_4` | Boek IV compleet (Hoofdstuk 19 t/m 25, "Rome Verrijst") | `first_answer_free` — de eerste vraag van elke wedstrijd telt automatisch als goed beantwoord | Rome's fundament leggen — een gegarandeerd sterk begin, eenmalig per wedstrijd |
| `meester_der_herinnering` | Boek V + Finale compleet (Hoofdstuk 26 t/m 28 + Finale — de VOLLEDIGE campagne) | `be_on_correct` (waarde 1) — +1 BE op ELK juist antwoord, niet alleen snelle | De sterkste bonus, bewust gereserveerd voor 100% van Chronica Classica — vereist het voltooien van alle 28 hoofdstukken + finale, dus vanzelf zeldzaam genoeg om niet overpowered te worden op schaal |

**Balansprincipe:** hoe dichter bij het einde van de campagne, hoe sterker de
bonus mag zijn — maar elke bonus blijft een KLEINE, eenmalige of
percentage-gebonden aanpassing (nooit een vermenigvuldiger op alle schade of
een permanente flat-BE-verhoging zonder voorwaarde), en de duurste/sterkste
titel is expres gekoppeld aan de zwaarste eis (de hele campagne, niet één
hoofdstuk). Nieuwe `bonus.type`-waarden (`streak_shield`/`be_head_start`/
`coin_bonus_pct`/`first_answer_free`/`be_on_correct`) bestaan nog nergens in
`battle.js`/`bossbattle.js`/`core.js` — ze moeten, samen met
`bewaarder_herinnering`'s eigen `be_on_fast`, alsnog echt worden ingebouwd in
de Combat-bridge-bouwstap (§8) voor ze iets doen; tot die tijd blijven ze
puur informatief, zoals de bestaande titel dat nu ook al is.

---

## 7. Campagnestructuur (`SP_CAMPAIGN`)

Proloog + 28 hoofdstukken in 5 "Boeken", gesynchroniseerd met Pallas en
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

> **Canon-uitbreiding (2026-07-20 e.v.):** de oorspronkelijke 19 hoofdstukken
> zijn uitgebreid naar 28, in drie rondes — de eerste twee omdat een
> hoofdstuk te veel Pallas-lessen of Minerva-hoofdstukken droeg voor zijn
> eigen verhaal, de derde omdat er een historisch gat zat tussen twee al
> bestaande hoofdstukken.
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
> Hoofdstuk 27 "De Rivier Lethe" (Orpheus verschijnt zo twee keer — jong in
> Hoofdstuk 5, gebroken in Hoofdstuk 27); Narcissus & Echo wordt een spiegel-/
> geluidspuzzel in Hoofdstuk 26 "De Bibliotheek van Mnemosyne", samen met de
> Titanenstrijd, die in de Finale terugkeert als onthulling dat Chronos zelf
> een verslagen Titaan is. Eros & Psyche en Pygmalion horen bij de Latijnse
> literatuur (Hoofdstuk 24-25). Atalanta, de Calydonische ever en Meleager
> vormen samen één vault-vignet; Actaeon (bij Artemis/Diana) en Ganymedes (bij
> het Trojaanse koningshuis) worden korte codex-asides. De Romeinse lijst:
> Sabijnse maagdenroof (Hoofdstuk 13), Horatii & Curiatii en Lucretia
> (Hoofdstuk 19 "Onder de Koningen"), Horatius Cocles/Mucius Scaevola/Cloelia/
> Cincinnatus/Coriolanus/Camillus (Hoofdstuk 20 "Verdedigers van de
> Republiek"), Regulus en Cato (Hoofdstuk 15), Spartacus en Cicero (Hoofdstuk
> 23). Resterende B-tier-restjes (Arion, Hippolytos, Endymion & Selene,
> Midas-uitbreiding) en Neoptolemos blijven vrij inzetbaar vault-materiaal,
> geen vaste plek nodig.
>
> **Ronde 3 — de val van de Republiek.** Tussen de vroege Republiek
> (Hoofdstuk 20) en Caesar ontbrak de aanloop naar de burgeroorlogen die de
> Republiek uiteindelijk breken. Twee nieuwe hoofdstukken vullen dat gat:
> Hoofdstuk 21 **"De Gracchen"** (Tiberius en Gaius Gracchus, landhervorming
> voor arme boeren, allebei vermoord door de senaatspartij — het eerste
> politieke geweld van de late Republiek, met hun moeder Cornelia) en
> Hoofdstuk 22 **"Marius en Sulla"** (Marius' legerhervorming en zeven
> consulschappen, Sulla's mars op Rome — de eerste Romeinse generaal die met
> zijn eigen leger tegen zijn eigen stad optrok — en zijn proscripties en
> dictatuur, het sinistere precedent waar Caesar straks tegen afsteekt). Beide
> hoofdstukken zijn, net als de mythologische bonushoofdstukken uit Ronde 1,
> bewust grammatica-arm (herhaling) — Minerva behandelt deze periode niet
> apart, dus er is geen les om aan te haken. Caesar Schrijft Geschiedenis
> t/m de Finale schuiven hierdoor twee plekken op (was 21-26, is nu 23-28).
>
> **Schrijvers als personages:** waar mogelijk krijgen de klassieke auteurs
> zelf een gezicht in de hoofdstukken die toch al over hun tijd gaan, in
> plaats van een apart hoofdstuk — Plato en Socrates staan al in Hoofdstuk 17,
> Livius in Hoofdstuk 19-20, Ovidius in Hoofdstuk 25. Xenofon (leerling van
> Socrates én geschiedschrijver in Herodotos' voetspoor) sluit aan bij
> Hoofdstuk 16. Verdere auteurs volgen op dezelfde manier zodra hun hoofdstuk
> wordt uitgebouwd.

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
| 21 | IV | De Gracchen | *Herhaling* — bewust grammatica-arm |
| 22 | IV | Marius en Sulla | *Herhaling* — bewust grammatica-arm |
| 23 | IV | Caesar Schrijft Geschiedenis | Gerundium, gerundivum (herhaling) |
| 24 | IV | Augustus en de Pax Romana | Literair Latijn |
| 25 | IV | Keizers en Dichters | Verdieping naamvallen |
| 26 | V | De Bibliotheek van Mnemosyne | Herhaling van alle grammatica |
| 27 | V | De Rivier Lethe | Integratie Grieks & Latijn |
| 28 (Finale) | V | Chronica Classica | Eindtoets van alle grammatica en taalvaardigheid |

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
- **Leesvalstrik** (vastgelegd 2026-07 na een gesprek met de auteur;
  **eerste voorbeeld gebouwd** in Hoofdstuk 4, zie hieronder). Een
  KEUZE-gebaseerde manier om leesaandacht te toetsen, nadrukkelijk GEEN nieuw
  `puzzle.type`: een personage geeft een instructie in de verteltekst (bv.
  "houd in het labyrint altijd links aan"), en de daaropvolgende `CHOICES`
  laat de speler die instructie zelf toepassen. Kiest de speler fout, dan
  volgen 2-3 scènes die de foute afslag steeds onheilspellender laten voelen
  — geen meteen-dood-gotcha, de speler krijgt de kans het zelf te merken —
  tot een doodlopende scène met precies 1 keuze: opnieuw beginnen.
  - **Geen nieuwe engine-code nodig.** Puur `CHOICES`/`FLAG`, geen
    `PUZZLE:`-sectie. De doodlopende scène is niets meer dan
    `* Begin het labyrint opnieuw -> CH#_[checkpoint]`.
  - **Herstartpunt = lokaal checkpoint, NIET het hele hoofdstuk.** De speler
    gaat terug naar het begin van de specifieke reeks (bv. de ingang van het
    labyrint), niet naar `CH#_000`. Bewuste keuze boven "het hele hoofdstuk
    opnieuw" (het oorspronkelijke voorstel): bij een lang hoofdstuk zou dat
    oneerlijk zwaar aanvoelen voor één gemiste zin. Al opgeloste
    puzzels/gevechten/CODEX-items eerder in het hoofdstuk blijven gewoon
    staan — de bestaande dedup-hooks (spHookCodex/spHookVocab/spHookPerson/
    enz.) maken een scène opnieuw bezoeken sowieso al kosteloos.
  - **Auteursregel:** de foute tak mag geen `EERETITEL`/`REWARD` bevatten
    (niet ongedaan te maken bij een herstart). Extra `CODEX`/`PERSON`/`VOCAB`
    op de foute tak is wel onschuldig — bonuslore zonder exploit, dankzij
    dezelfde dedup.
  - **Voorbeeld (Hoofdstuk 4, retrofit 2026-07 in de al gebouwde/geteste
    Theseus-lijn):** `CH4_T06` (het labyrint in, na de ablativus-puzzel)
    wijst nu naar `CH4_T06B` "De Eerste Splitsing" — Ariadne fluistert
    Daidalos' geheim door ("bij elke splitsing, houd links aan"). Links
    (`CH4_T07`) is de originele, ongewijzigde voortzetting naar de
    Minotaurus. Rechts leidt via `CH4_T06R1`→`CH4_T06R2`→`CH4_T06R3` (de
    draad raakt op, de Minotaurus komt dichterbij, geen ontsnapping meer)
    terug naar `CH4_T06B` zelf — het lokale checkpoint. Minimaal invasief
    voor een al live hoofdstuk: alleen het keuze-doel van `CH4_T06` is
    aangepast, de rest van de al geteste Theseus-lijn (puzzel, `CH4_T07`
    e.v.) is ongewijzigd.

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

### 7.2.1 Codex Memoriae — zeven tabbladen, oud-perkament-uiterlijk (**gebouwd**)

`SCREENS.spCodex` (singleplayer.js) is een volwaardig scherm met zeven
tabbladen, elk met een eigen kleine databron en ontgrendel-hook — allemaal
volgens hetzelfde patroon (CNS-meta-sectie → hook zet stil iets in
`SP_STATE` → scherm toont alleen wat al verdiend is, per saveslot):

- **Herinneringen** (eerste tabblad, standaard-tabblad bij het openen van de
  Codex) — het "museum van Mnemosyne"-mechanisme (vastgelegd 2026-07, na
  Hoofdstuk 4): uit elk afgerond verhaal/lijn neemt de speler één tastbaar
  voorwerp mee, opgehaald via een nieuwe `SOUVENIR:`-sectie
  (`spHookSouvenir`, zelfde comma/puntkomma/regel-parsing als `CODEX:`) en
  vastgelegd in `SP_STATE.souvenirs` (array van ids, losstaand van
  `SP_STATE.fragments` — Herinneringsfragmenten zijn een ONZICHTBARE
  hoofdstukgate, souvenirs zijn juist bedoeld om gezien te worden).
  `SP_SOUVENIRS` (singleplayer-data.js) koppelt elke id aan een naam, een
  kort onderschrift en een `icon`-emoji + optioneel `img`
  (`assets/chronica/souvenirs/`, nog geen bestanden op schijf — zelfde
  "pad alvast invullen, terugval op icon bij ontbreken/foutmelding"-patroon
  als `SP_COMBAT_ENEMIES`, via dezelfde `onerror`-truc als
  `spCombatSpriteHTML`). `spCodexSouvenirsHTML()` rendert ze als een grid,
  visueel dezelfde `.codex-gallery`-stijl als het Afbeeldingen-tabblad.
  **Bewust ambigu wie/wat deze voorwerpen verzamelt** — de verteltekst
  schrijft het losjes toe aan "het Orakel", zonder verder uit te leggen wat
  daarmee gebeurt. Die vraag wordt pas een echt "museum" zodra Hoofdstuk 26
  "De Bibliotheek van Mnemosyne" (`SP_CAMPAIGN`) gebouwd wordt — dit
  tabblad is dus een bewuste, vroege setup voor een onthulling die nog ver
  weg ligt. Nu 11 voorwerpen, één per afgeronde lijn t/m Hoofdstuk 4 (proloog
  telt niet mee — dat is het inleidende kader, geen "bezochte mythe"): de
  proloog/Hoofdstuk-1-t/m-4-lijnen kregen elk een kort, nieuw stukje
  verteltekst dat het oppakken/vinden van het voorwerp beschrijft, meestal
  ingevoegd vlak vóór de bestaande `EERETITEL:`-sectie van die lijn. Eén
  uitzondering: Latona's lijn (Hoofdstuk 2) kreeg er een hele nieuwe,
  korte coda-scène bij (`CH2_L08B`, "De Vijver van de Boeren" — het
  klassieke Ovidius-verhaal van Latona en de Lycische boeren die in kikkers
  veranderen) omdat de gekozen souvenir (een waterlelie) niet natuurlijk uit
  de al bestaande scènes voortkwam.
  **Illustraties** (vastgelegd 2026-07, nog geen bestanden op schijf): eigen
  Gemini-Gem, los van de scène-illustraties, in
  `certamen/assets/chronica/gemini-souvenir-style.md` — vaste opstelling
  (stenen sokkel, glazen stolp, klein rood fluwelen kussentje onder kleine/
  fijne voorwerpen), **vierkant (1:1)** i.p.v. de liggende 16:9 van gewone
  scènes (past bij de rastertegels van `spCodexSouvenirsHTML`), met een
  Aegeïsch-blauwe of oxblood-gloed op het glas afhankelijk van de taallijn
  (Grieks/Latijn) waar het voorwerp bij hoort. Bewust een aparte Gem in
  plaats van een uitbreiding op `gemini-comic-style.md`, omdat de compositie
  hier strikt VAST staat (bijna een productfoto) i.p.v. per scène te
  variëren.
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

Nieuwe hoofdstukken breiden dit uit: elke nieuwe
`CODEX:`/`PERSON:`/`VOCAB:`/`SOUVENIR:`-id hoort een entry te krijgen in de
bijbehorende databron (`SP_CODEX_ENTRIES`/`SP_CODEX_PERSONS`/
`SP_VOCAB_ENTRIES`/`SP_SOUVENIRS`, allemaal singleplayer-data.js) — anders
toont de Codex alleen een kale id of niets. Voor `SOUVENIR:` specifiek: elke
hoofdlijn/plotlijn die met een `EERETITEL:` afsluit, hoort ook een eigen
`SOUVENIR:` te krijgen (meestal vlak ervoor), zodat de Herinneringen-tab
gelijke tred houdt met de rest van de campagne.

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

**Een afgeronde lijn opnieuw spelen vanaf de hub (vastgelegd 2026-07, na
gebruikersfeedback):** vóór deze wijziging kon een speler op de hub
onbeperkt dezelfde lijn herstarten (bv. Latona opnieuw en opnieuw kiezen) —
inclusief alle Clementia/Severitas-keuzes daarin, dus ook onbeperkt op één
kant van die schaal blijven stapelen. Een tweede nieuwe keuze-tag lost dit
op: `[DONE:vlagnaam]` (`CNSParser.DONE_TAG_RE`), verwijzend naar dezelfde
`FLAG:` die elke lijn toch al bij afronding zet (bv. `ch2_lijn_latona=true`)
— geen aparte databron nodig. Staat de vlag al op waar, dan toont
`SCREENS.spPlay` de knop met een ✓ en gedimd, en navigeert een klik niet
meer naar de lijn (`spChoiceAlreadyDone()`, singleplayer.js): enkel een
korte, Orakel-achtige herinnering hoeveel lijnen in dit hoofdstuk nog open
staan, berekend uit de andere `[DONE:...]`-keuzes op diezelfde hub-scène.
Toegepast op alle drie de multi-lijn-hubs die terugkeren naar zichzelf
(`CH2_000`, `CH3_000`, `CH4_000`) — `CH1_000` heeft dit niet nodig, want
daar leidt het voltooien van een lijn rechtstreeks door naar de
hoofdstukafsluiting, niet terug naar de hub.

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

**Illustraties** (7, Gemini-huisstijl-Gem, `assets/chronica/images/`): één
per emotioneel hoogtepunt per lijn, plus de mentor-overgang —
`geboorte_apollo_diana.png` (`CH2_L08`), `semele_verteerd.png` (`CH2_S06`),
`geboorte_bacchus.png` (`CH2_S08`), `kallisto_berin.png` (`CH2_K07`),
`kallisto_sterrenbeeld.png` (`CH2_K09`), `herakles_nasleep.png` (`CH2_H06`,
bewust de NASLEEP van de plottwist, nooit de daad zelf — zelfde toon-regel
als hierboven) en `athena_mentor_ch2.png` (`CH2_ATHENA`).

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

### 7.7.1 Puzzeltypes — routekaart voor toekomstige uitbreidingen (**vastgelegd, deels gebouwd**)

Sinds Hoofdstuk 5/6 zijn er twee nieuwe `puzzle.type`-waarden bij gekomen:
`"tile-swap"` (schuifpuzzel — tik twee tegels om ze te wisselen, zie §7.10)
en `"matching"` (koppelpuzzel — tik een woord links, tik daarna zijn paar
rechts, zie §7.11). Naar aanleiding van een brainstorm met de auteur
(2026-07) over verdere puzzelvariatie liggen de volgende types vast als
vervolgstappen. Elk is vooraf beoordeeld op BLOKKEREND (hoort als
`PUZZLE:`-gate, want test echt grammatica) of OPTIONEEL (test vooral
herkenning/logica, hoort dus als niet-voortgangs-blokkerende vault-content) —
zodat die afweging niet opnieuw gemaakt hoeft te worden zodra een hoofdstuk
er daadwerkelijk gebruik van maakt.

**Blokkerend — zelfde knop-tik-paradigma als de bestaande 6 types (geen
per-cel toetsenbord, geen slepen), goedkoop te bouwen, test echte
grammatica:**
- **Sorteerpuzzel** — tik woorden naar het juiste bakje (bv. "welke
  naamval hoort hierbij?").
- **Zin met meerdere hiaten** — rechtstreekse uitbreiding van de bestaande
  `"multiple-choice"`-puzzel: 2-3 losse keuzes in één zin i.p.v. één.
- **"Welke hoort er niet bij"** — 4-5 woorden, tik de uitzondering (verkeerde
  naamval/geslacht/vervoeging). Eén tik, triviaal te bouwen.
- **Volgorde-puzzel** — hergebruikt de tile-swap-mechaniek voor woordvolgorde
  in een zin, bv. voor een latere ablativus-absolutus- of A.c.I.-constructie.

**Optioneel — vault-content, GEEN voortgangsgate. Reserveer voor Hoofdstuk 26
"De Bibliotheek van Mnemosyne", dat al gepland staat als thuisbasis voor
nieuwe mechaniek (de spiegel-/geluidspuzzel bij Narcissus & Echo, zie de
canon-uitbreiding in §7):**
- **Woordzoeker** — geen kruisingsprobleem (i.t.t. een kruiswoordraadsel),
  dus goedkoper om te bouwen. Geschikt voor bv. een lijst bemanningsnamen —
  eigennamen kunnen niet natuurlijk kruisen in een kruiswoordrooster, maar
  passen prima los in een letterraster.
- **Kruiswoordraadsel (vereenvoudigd)** — klein vast rooster (5-7 woorden),
  GEEN per-cel getypte letters (onbetrouwbaar op iPad — popup-toetsenbord per
  vakje), maar een woordenbank waaruit je een woord in het gemarkeerde vak
  tikt. Roosterontwerp blijft per puzzel handwerk (woorden moeten letterlijk
  op de juiste plek overlappen) — duurder dan alle andere types, dus
  spaarzaam inzetten.
- **Sudoku-achtig met Griekse letters** — puur logica, geen grammatica-toets;
  alleen zinvol als losse denk-puzzel naast de taalgerichte content, niet als
  vervanging van een echte grammaticapuzzel.

Geen van deze zes is al gebouwd — dit is een vastgelegde intentie uit een
brainstormgesprek, geen toegewezen hoofdstuk.

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

**Illustraties** (7, Gemini-huisstijl-Gem, `assets/chronica/images/`) — de
Io-lijn krijgt drie beelden omdat die drie los herkenbare mythologische
momenten bevat: `argus_bewaakt_io.png` (`CH3_IO05`), `pauw_ogen_argus.png`
(`CH3_IO10`) en `europa_stier.png` bij de Europa-coda (`CH3_IO14`); de
Herakles-lijn krijgt er drie, bewust gekozen bij de taken ZONDER eigen
Combat-bridge-sprite zodat geen enkel beeld dubbelop staat met een
combat-icoon: `augiasstal.png` (`CH3_H09`), `atlas_hemel.png` (`CH3_H21`) en
`cerberus_voltooid.png` als sluitstuk (`CH3_H25`); plus `athena_mentor_ch3.png`
(`CH3_ATHENA`) als bookend met `athena_mentor_ch2.png`.

**Getest** (browser, gescripte volledige doorloop): beide lijnen volledig
uitgespeeld inclusief alle 9 puzzels en alle 6 gevechten (elke
`spCombatAnswer` gevolgd door `spCombatAttack()` zodra er genoeg EP is — de
Combat-bridge-lus vereist expliciet BEIDE stappen, niet alleen juist
antwoorden), fragmenten/flags/quests/eretitels kloppen, `fragments=6`-gate
opent pas na alle zes fragmenten, en `{tendency_address}`/
`{tendency_address_cap}` resolven correct naar een gender- en
houding-passende aanspreekvorm in zowel de Europa-coda
als `CH3_ATHENA`.

### 7.9 Hoofdstuk 4: "Het Labyrint van Herinneringen" — twee onbreekbare beloften (**gebouwd**)

Twee hoofdlijnen (`SP_CH4_CNS`, singleplayer-data.js, 34 scènes — 30 origineel
+ 4 uit de leesvalstrik-retrofit, zie §7.1), net als Hoofdstuk 3 — beide
draaien om dezelfde kern: een belofte die, eenmaal uitgesproken, niemand meer
ongedaan kon maken.

- **Theseus** (`CH4_T01`-`T16`): Athene betaalt al negen jaar een tol van
  veertien jonge levens aan koning Minos van Kreta — boete voor de dood van
  diens zoon Androgeos. Theseus meldt zich vrijwillig aan, en belooft zijn
  vader Aegeus witte zeilen te hijsen als hij de Minotaurus overleeft. Op
  Kreta valt Ariadne voor hem, verraadt haar vader met Daidalos' garenplan
  (`PUZZLE` ablativus) en helpt Theseus het labyrint in en uit — in ruil voor
  de belofte dat hij haar meeneemt. Bij de eerste splitsing in het labyrint
  (`CH4_T06B`) fluistert Ariadne Daidalos' geheim door — een leesvalstrik
  (§7.1): kiest de speler tegen die instructie in, dan volgt een doodlopende
  route (`CH4_T06R1`-`R3`, de draad raakt op, de Minotaurus komt dichterbij)
  terug naar hetzelfde lokale checkpoint. Na de Combat-bridge-overwinning op de
  Minotaurus (`CH4_T07`, één nieuwe `SP_COMBAT_ENEMIES`-entry) laat Theseus
  Ariadne echter slapend achter op Naxos, waar Bacchus (bekend van Hoofdstuk
  1) haar vindt en onsterfelijk maakt — het enige verhaal in dit hoofdstuk
  dat alsnog goed afloopt (`codex_ariadne_bacchus`). **Daidalos & Ikaros**
  (S-tier, `SP_MYTH_CANON`) zijn bewust IN deze lijn verweven i.p.v. een
  aparte lijn, precies zoals `SP_CAMPAIGN` ch4.zijverhalen al aangaf: Minos
  sluit Daidalos en Ikaros na het verraad zelf in het labyrint op, ze
  ontsnappen op zelfgemaakte vleugels, en Ikaros valt — ondanks zijn vaders
  waarschuwing — als hij te dicht bij de zon vliegt (`PUZZLE` vocativus,
  "Icare!"). Onderwijl vergeet Theseus, met zijn gedachten elders, zijn eigen
  belofte aan zijn vader: het schip keert terug onder het zwarte zeil, Aegeus
  werpt zich van de klip — en de zee draagt sindsdien zijn naam. Levert het
  fragment "Uitweg" 🧵 op en de eretitel `ch4_theseus_labyrint`.
- **Phaëthon** (`CH4_P01`-`P10`): getergd door zijn vriend Epaphus (zoon van
  Jupiter en de uit Hoofdstuk 3 bekende Io) om zijn goddelijke afkomst te
  bewijzen, reist Phaëthon naar het Paleis van de Zon. Zijn vader Sol zweert
  hem onbezonnen een onherroepelijke eed bij de Styx (`PUZZLE` imperfectum,
  Sol se aanhoudende — vergeefse — waarschuwingen) vóór hij de vraag kent, en
  moet hem daarna de zonnewagen laten mennen. Phaëthon verliest de wagen
  bijna onmiddellijk uit controle, verzengt de aarde, en wordt door Jupiters
  bliksem neergehaald om erger te voorkomen (`PUZZLE` perfectum, "misit" —
  één voltooide worp). Zijn zusters, de Heliaden, treuren zich aan zijn graf
  in populieren met amberkleurige tranen; zijn vriend Cycnus wordt een zwaan.
  Levert het fragment "Overmoed" ☀️ op en de eretitel `ch4_phaethon`.

**Naamgevingsregel**: lijn Theseus (Pallas Les 6-7) gebruikt Griekse/
gangbare namen (Theseus, Ariadne, Minos, Daidalos, Ikaros, Aegeus — spelling
consistent met `SP_MYTH_CANON`s "Daidalos & Ikaros"); lijn Phaëthon (Minerva
H5, een Ovidiaans verhaal) gebruikt Latijnse namen (Sol, niet Helios;
Iuppiter in de Latijnse puzzelzinnen, "Jupiter" in de Nederlandse
verteltekst — zelfde conventie als alle eerdere hoofdstukken).

**Combat/grammatica-balans (bewuste keuze)**: lijn Theseus draagt drie van de
vijf grammaticapunten (infinitivus/vocativus/ablativus), lijn Phaëthon de
resterende twee (imperfectum/perfectum) — niet symmetrisch verdeeld, zelfde
flexibiliteit als Hoofdstuk 2 (niet elke lijn hoeft elk grammaticapunt te
dragen). Eén Combat-bridge-gevecht dit hoofdstuk (de Minotaurus) — minder dan
Hoofdstuk 2/3, omdat beide lijnen hier primair op een gebroken belofte draaien
in plaats van op een reeks beproevingen.

**Fragmenten-gate**: zelfde patroon als Hoofdstuk 2/3, met NIEUWE fragment-ids
("theseus", "phaethon"). De hub-keuze naar `CH4_ATHENA` staat op
`[REQUIRE:fragments=8]` (de zes van Hoofdstuk 2/3 + deze twee). Beide lijnen
eindigen terug op `CH4_000`.

**Grammatica**: infinitivus, vocativus (vervolg op Hoofdstuk 1 se
Bacche/Pallas/Prometheu-tabel, nu met Icare/Theseu/Minos), imperfectum,
perfectum, ablativus (van middel) — vijf nieuwe Codex-grammatica-entries
(`codex_grammatica_ch4_*`), **vroeg ontgrendeld** bij `CH4_000`, zelfde regel
als alle eerdere hoofdstukken.

**Bugfix bij het bouwen van dit hoofdstuk**: `CH2_EINDE` en `CH3_EINDE`
bleken, bij het optekenen van dit hoofdstuk, allebei nog een echte
`CHOICES`-loze doodlopende scène te zijn — de vorige hoofdstukken waren wel
geschreven, maar de sluitscène van het hoofdstuk ERVOOR verwees er nooit naar
door (alleen `CH1_EINDE` had destijds al een `-> CH2_000`-keuze gekregen).
Beide missen nu alsnog een `CHOICES: * Stap door de poort -> CH‹volgend›_000`,
zodat de hele campagne van `CH1_000` tot en met `CH4_EINDE` aantoonbaar
(scriptmatig, reachability-check) doorloopt zonder onderbreking.

**Getest**: (1) Node-scriptvalidatie — alle 30 scènes van `SP_CH4_CNS`
bereikbaar vanaf `CH4_000`, elke `CHOICES`-target bestaat, elke `PUZZLE`/
`CODEX`/`PERSON`/`FRAGMENT`/`EERETITEL`/`COMBAT`/`VOCAB`-id heeft een
bijbehorende data-entry, elke `PERSON: id:full` heeft een eerdere `id:intro`
in hetzelfde hoofdstuk, en de volledige keten `CH1_000` → `CH2_000` →
`CH3_000` → `CH4_000` → `CH4_EINDE` is bereikbaar (deze bevestigde ook een
bug in `CH2_EINDE`/`CH3_EINDE`, zie hieronder). (2) Browserdoorloop via
`spGoCns()` in de devtools-console (geen volledige klik-voor-klik sessie,
maar wel echte DOM-render): hub met `[REQUIRE:fragments=8]`-gate (verborgen
bij 6, zichtbaar bij 8), de infinitivus-puzzel inclusief correct/fout-
afhandeling, de Minotaurus-Combat-bridge (65/65 EP, vraag uit de
vocabulairepool), de imperfectum-puzzel, `{tendency_address}` dat oplost naar
een gender-passende aanspreekvorm in `CH4_ATHENA`, en alle vijf nieuwe
grammatica-tabellen die correct renderen in `SCREENS.spCodex`. Nog niet
end-to-end doorgeklikt vanuit de UI zelf (alle 30 scènes na elkaar met de
muis) — dat staat nog open als eventuele vervolgstap.

**Getest (leesvalstrik-retrofit, 2026-07)**: (1) Node-reachability-script
bevestigt alle 34 scènes van `SP_CH4_CNS` nog bereikbaar (incl. de 4 nieuwe)
en de hele keten `PRO_001` → ... → `CH6_EINDE` (237 scènes over alle
hoofdstukken) intact. (2) Browserdoorloop via `spGoCns()`/`spChoosePath()`:
de foute afslag (`CH4_T06B` → `CH4_T06R1` → `CH4_T06R2` → `CH4_T06R3`)
loopt correct terug naar het lokale checkpoint `CH4_T06B`, en de juiste
afslag ("Houd links aan") komt nog steeds ongewijzigd uit bij `CH4_T07`.
Onderweg bleek de browserpreview een stale, gecachete versie van
`singleplayer-data.js`/`singleplayer.js` te tonen — de cache-busting
versiestring in `index.html` was nog `?v=20260720a` terwijl beide bestanden
alweer bijgewerkt waren; bijgewerkt naar `?v=20260722a`. Geen consolefouten.

### 7.10 Hoofdstuk 5: "Het Gulden Vlies" — een tochtenlogboek i.p.v. een hub (**gebouwd**)

Bewust ANDERE structuur dan Hoofdstuk 1-4: geen hub met zelf te kiezen,
parallelle lijnen, maar één doorlopend tochtenlogboek (`SP_CH5_CNS`,
singleplayer-data.js, 33 scènes) dat de Argo van stop tot stop volgt — zie
`SP_CAMPAIGN` ch5.gameplay. Geen Herinneringsfragment-gate (er zijn geen
lijnen om te "voltooien") en geen nieuwe grammatica-entries: dit hoofdstuk is
bewust herhaling (nominativus t/m ablativus).

**Negen cameo-clusters** langs de route, elk met een eigen moment maar
geclusterd waar dat mythologisch al samenkwam (op verzoek van de auteur, i.p.v.
elke naam een volledig aparte scène te geven):
- **Theseus** (`CH5_003`) — een korte herkenning bij vertrek uit Iolcus, bewust
  dramatische ironie i.p.v. foreshadowing: de speler kent zijn Labyrint-verhaal
  al uit Hoofdstuk 4, Theseus zelf nog niet.
- **Tydeus** (`CH5_004`, later opnieuw `CH5_019`) — een kort lont-vignet bij
  vertrek, en een tweede moment samen met **Orpheus** (`CH5_019`) wanneer
  diens muziek een ruzie sust.
- **Atalanta & Meleager** (`CH5_007`-`CH5_010`) — samen bij een zwijnenjacht op
  Cyzicus, met de **eerste "ander perspectief"-keuze** van dit spel (zie
  hieronder): voorecho van hun latere, veel duisterdere Calydonische
  ever-vignet (`SP_MYTH_CANON` A-tier).
- **Kastor & Polydeukes** (`CH5_011`-`CH5_014`) — samen bij de bokswedstrijd
  tegen Amycus (Polydeukes vecht, Kastor staat ernaast), met het tweede
  Combat-bridge-gevecht van dit hoofdstuk.
- **Herakles & Hylas** (`CH5_015`) — het bestaande, canonieke
  Mysië-vertrekmoment (geen nieuwe `PERSON`-entry nodig, Herakles is al
  "full" sinds Hoofdstuk 3).
- **Argos** (`CH5_016`-`CH5_018`) — de Symplegades, met de nieuwe
  schuifpuzzel. Bewust **"Argos" gespeld** (i.p.v. "Argus") op verzoek van de
  auteur, om verwarring met de honderdogige bewaker Argus Panoptes (Hoofdstuk
  3) te vermijden.
- **Nestor & Philoktetes** (`CH5_020`-`CH5_022`) — samen vlak voor Colchis,
  voorecho van hun latere hereniging bij Troje.

**"Ander perspectief, zelfde inhoud"** (`CH5_008`/`CH5_008A`/`CH5_008B`):
bij Cyzicus kiest de speler MET WIE ze meekijken tijdens de jacht (Atalanta of
Meleager) — dit verandert alleen de vertelde invalshoek, niet de uitkomst:
beide keuzes voeren terug naar dezelfde `CH5_009` en de speler ontmoet
linksom of rechtsom sowieso beide personages. Bewust gekozen boven een echte
vertakking (waarbij de speler blijvend content zou missen, met de 3 saveslots
als aanmoediging tot herspelen) — de auteur koos daar expliciet niet voor,
omdat dat het bestaande "je ziet alles binnen één playthrough"-model van
Hoofdstuk 1-4 zou doorbreken. Het hergebruikt gewoon de bestaande
`CHOICES`/tekst-resolver-machinerie, geen nieuwe engine nodig.

**Nieuw puzzeltype "tile-swap"** (schuifpuzzel, `spRenderTileSwapPuzzle`/
`spCheckTileSwapPuzzle` in singleplayer.js, gebruikt bij `puzzle_ch5_ablativus`,
`CH5_017`): GEEN klassieke 15-puzzel met blanco vakje en slepen — dat is op
een iPad onbetrouwbaar (drag-detectie, per ongeluk scrollen) en botst met de
regel "zichtbare labels, nooit display:none+click()". In plaats daarvan: tik
een tegel om 'm te selecteren, tik een tweede tegel om ze te verwisselen —
zelfde soort groot (≥44px), knop-gebaseerd gebaar als de andere vier
puzzeltypes. De vijf puzzels dit hoofdstuk zijn bewust over vier verschillende
types verdeeld (multiple-choice/nominativus, typed-latin/accusativus,
multiple-choice/genitivus, typed-greek/dativus, tile-swap/ablativus) i.p.v.
oplopende moeilijkheid — dit hoofdstuk bouwt geen nieuwe stof op, dus is er
geen "moeilijkheidsladder" om te beklimmen. Overige nieuwe puzzelsoorten
waar de auteur naar vroeg (woordzoeker/kruiswoord/sudoku) zijn bewust NIET
hier toegevoegd: die testen eerder herkenning/logica dan grammatica, en horen
dus beter als optionele, niet-blokkerende vault-content (net als de
Atalanta/Meleager-Calydon-vignet-aanpak) — Hoofdstuk 26 "De Bibliotheek van
Mnemosyne" (al gepland als thuisbasis voor de spiegel-/geluidspuzzel bij
Narcissus & Echo) is daar een logischer thuis voor.

**Twee Combat-bridge-gevechten**: Amycus (`CH5_013`, 55 EP) en de Draak van
Colchis (`CH5_026`, 75 EP, het zwaarste gevecht van het spel tot nu toe). De
draak combineert bewust twee tradities: Medea's gezang sust het beest genoeg
om Jason dichterbij te laten komen (de bekendste versie), maar het schrikt
alsnog wakker voor hij het Vlies kan losmaken — sommige antieke
vaasschilderingen tonen Jason wél in gevecht met de draak, dus dit is geen
verzonnen afwijking.

**Medea's wraak in Korinthe** (`CH5_029`/`CH5_EINDE`): een van de duisterste
verhalen uit de klassieke mythologie (Medea doodt in haar wraak op Jason
uiteindelijk ook hun eigen kinderen). Verteld met dezelfde terughoudendheid
als Aegeus' zelfmoord in Hoofdstuk 4 — het gebeuren wordt nooit ontkend of
vergoelijkt, maar ook nooit grafisch uitgesponnen (zelfde aanpak als het
geplande "duistere drieluik" Niobe/Medea/Pentheus, zie de canon-uitbreiding
hierboven). Geen `PUZZLE`/`COMBAT` op dit moment; het hoofdstuk eindigt, net
als Hoofdstuk 4, op stilte.

**Equip**: `CH5_006` (vertrek uit Iolcus) zet de FLAG
`ch5_bemanning_uitrusting`, die zowel `armor:middel` als `helm:bandana`
ontgrendelt via `SP_AVATAR_STORY_UNLOCKS` — zie de equip-routekaart (§5.1),
nu voor het eerst ook echt gebouwd i.p.v. alleen gepland.

**`CH4_EINDE` → `CH5_000` bugfix**: `CH4_EINDE` miste, net als `CH2_EINDE`/
`CH3_EINDE` destijds (§7.9), een `CHOICES`-sectie naar het volgende hoofdstuk
— logisch zolang Hoofdstuk 5 nog niet bestond, maar nu bij het bouwen van dit
hoofdstuk rechtgezet met `* Stap door de poort -> CH5_000`. (`CH5_EINDE` zelf
kreeg dezelfde behandeling bij het bouwen van Hoofdstuk 6, zie §7.11 —
zolang Hoofdstuk 6 nog niet bestond was het bewust een terechte rand van het
geschreven verhaal, geen bug.)

**Getest**: (1) Node-reachability-script (zie
`validate_ch5.js`-aanpak): alle 33 scènes bereikbaar vanaf `CH5_000` incl.
`CH5_EINDE`, elke `CHOICES`-target bestaat, elke `PUZZLE`-scène en
`COMBAT`-scène heeft precies 1 keuze, en elke `PUZZLE`/`COMBAT`/`CODEX`/
`PERSON`/`EERETITEL`/`SOUVENIR`/`VOCAB`-id heeft een bijbehorende data-entry
(incl. de regel dat een `PERSON:id:full` een eerdere `:intro` heeft, in dit
hoofdstuk of een eerder hoofdstuk). (2) Echte browser-render via `spGoCns()`:
de perspectiefkeuze (`CH5_008`), de schuifpuzzel volledig opgelost via zowel
directe tegel-tap-simulatie als echte muisklikken (tegel selecteren →
highlight → tweede tegel → wissel bevestigd in de DOM), beide
Combat-bridge-gevechten volledig uitgespeeld tot winst, de typed-greek
dativuspuzzel via het Griekse schermtoetsenbord inclusief de
iota-subscriptum-toets, de Codex Personen/Mythologie-tabbladen met de nieuwe
entries, en het `CH5_EINDE`-slot dat correct terugvalt op "Terug naar de
opslagplekken" (geen `CHOICES`, zoals bedoeld). Geen consolefouten
gedurende de hele sessie. Nog niet end-to-end doorgeklikt vanuit de UI zelf
met de muis door alle 33 scènes na elkaar — zelfde openstaande vervolgstap
als bij Hoofdstuk 4.

### 7.11 Hoofdstuk 6: "De Vloek van Thebe" — generatiesprongen i.p.v. chronologie (**gebouwd**)

Net als Hoofdstuk 5 geen hub met lijnen, maar dit keer ook bewust GEEN
chronologische vertelling — het openingsscherm (`CH6_000`) legt dat expliciet
uit aan de speler: het hoofdstuk volgt niet de jaartallen, maar het patroon
van de vloek zelf (hoogmoed, gevolgd door een straf die bijna nooit de
hoogmoedige zelf treft, maar de kinderen). Daardoor kan het hoofdstuk openen
met Niobe (relatief vroeg in Thebe's geschiedenis) en afsluiten met Pentheus
(die chronologisch al vóór Oedipus regeerde) zonder dat dat als een fout
aanvoelt — `CH6_021` benoemt de tijdsprong terug expliciet in de fictie zelf.

**Twee golven "De Zeven tegen Thebe"**, op verzoek van de auteur: de eerste
golf (Eteokles/Polyneikes' broederoorlog, `CH6_012`-`CH6_014`) neemt ook
Tydeus mee — de kortlontige Argonaut uit Hoofdstuk 5, die hier sneuvelt op
een manier die Athena's geplande onsterfelijkheidsgunst doet intrekken
(verteld terughoudend, zie hieronder). Tien jaar later, de Epigonen
("de nakomelingen", `CH6_018`-`CH6_020`), wreken de zonen van de Zeven hun
vaders alsnog — waaronder Diomedes, Tydeus' zoon, die hier voor het eerst in
beeld komt vóór zijn latere rol in de Trojaanse Oorlog. Dezelfde
generatiesprong-structuur als de rest van het hoofdstuk, nu ook binnen dit
ene subverhaal (zie `SP_CAMPAIGN` ch6.gameplay).

**Terugkerende continuïteit met eerdere hoofdstukken**: Kadmos' drakentanden
(`CH6_001`-`CH6_002`) zijn expliciet dezelfde soort tanden als die koning
Aeëtes in Hoofdstuk 5 gebruikte — de speler wordt daar zelf op gewezen.
Niobe's belediging treft Latona (Hoofdstuk 2), gewroken door Apollo en Diana
(ook Hoofdstuk 2). Pentheus is de neef van Bacchus, zoon van Semele
(Hoofdstuk 2). Geen van deze personages kreeg een nieuwe `PERSON:`-tag waar
ze al "full" bekend waren — ze verschijnen puur in de verteltekst, zelfde
conventie als Theseus' cameo in Hoofdstuk 5.

**Nieuw puzzeltype "matching"** (koppelpuzzel, `spRenderMatchingPuzzle`/
`spMatchTapLeft`/`spMatchTapRight` in singleplayer.js, gebruikt bij
`puzzle_ch6_matching_tempora`, `CH6_013`): twee kolommen knoppen, tik links
dan rechts. Matcht op `puzzle.pairs`-INDEX, niet op tekst — links en rechts
worden onafhankelijk geschud voor de weergave, maar de onderliggende
koppeling ligt al vast in de puzzeldata. Bewust NIET het complete Hoofdstuk
5/6-repertoire vervangen door naamval-herhaling: dit hoofdstuk herhaalt
werkwoordstijden (praesens t/m perfectum, zie `SP_CAMPAIGN` ch6.grammatica),
Hoofdstuk 5 herhaalde naamvallen — bewust verschillende invalshoek per
herhalingshoofdstuk.

**Bugfix tijdens het bouwen**: de eerste versie van de koppelpuzzel toonde
een foutmelding bij een fout paar, maar de daaropvolgende volledige
her-render (nodig om de geselecteerde/vergrendelde tegels bij te werken)
overschreef die foutmelding meteen weer met een lege, verborgen versie — de
speler zag dus nooit een hint bij een fout paar. Gevonden tijdens het
browsertesten (de foutmelding kwam leeg terug), opgelost door de
foutmelding als "single-shot" state (`SP_MATCH.error`) door de render heen
te dragen in plaats van rechtstreeks op het DOM-element te zetten (dat
patroon werkt wél bij de andere vier puzzeltypes, omdat die na een fout
antwoord NIET opnieuw het hele scherm renderen).

**Eén Combat-bridge-gevecht** (Laodamas, zoon van Eteokles, de verdediger van
Thebe tegen de Epigonen, `CH6_019`, 60 EP) — de rest van het hoofdstuk drijft
op noodlot en menselijke fouten, geen monsters. De Sfinx (`CH6_007`-`CH6_009`)
wordt bewust met een `PUZZLE`, niet een `COMBAT`, verslagen — ze wordt
verslagen met een raadsel, niet met een zwaard, zelfde principe als Ladon bij
Herakles' werken (Hoofdstuk 3).

**Duister materiaal, terughoudend verteld** — dit hoofdstuk bevat het
zwaarste materiaal van Chronica Classica tot nu toe: kindermoord (Niobe),
vadermoord/incest (Oedipus/Iokaste), broedermoord (Eteokles/Polyneikes),
een wraakzuchtige daad die Athena's gunst doet intrekken (Tydeus), een
gedwongen zelfmoord (Antigone), en een moeder die in goddelijke waanzin haar
eigen zoon doodt (Pentheus/Agave) — samen met Medea (Hoofdstuk 5) en Niobe
zelf het geplande "duistere drieluik" van moeder/kind-tragedies (zie de
canon-uitbreiding in §7). Elk van deze momenten is verteld met dezelfde
terughoudendheid als Aegeus' zelfmoord (Hoofdstuk 4) en Medea's wraak
(Hoofdstuk 5): het gebeuren wordt nooit ontkend of vergoelijkt, maar ook
nooit grafisch uitgesponnen (bv. Tydeus' precieze daad tegenover Melanippos
blijft bewust ongenoemd — alleen Athena's afschuw wordt getoond, niet de
daad zelf). Dit is standaard leerstof binnen het klassieke curriculum
(Sophocles' Oedipus Rex/Antigone, Euripides' Bacchae) en dus passend bij de
doelgroep.

**Drie Clementia/Severitas-keuzemomenten** (`CH6_004`, `CH6_010`, `CH6_017`)
— minder dan sommige eerdere hoofdstukken, bewust: niet elk zwaar moment in
dit hoofdstuk leent zich voor een oordeel van de speler (bv. bij Pentheus'
dood is elke "kies een kant"-vraag misplaatst). Ook één nieuw gebruik van
`{tendency_address}` (`CH6_021`, de Boodschapper spreekt de speler direct
aan bij de tijdsprong).

**`CH5_EINDE` → `CH6_000` bugfix**: zelfde patroon als `CH4_EINDE` → `CH5_000`
bij Hoofdstuk 5 (zie §7.10) — `CH5_EINDE` rechtgezet met
`* Stap door de poort -> CH6_000`. `CH6_EINDE` zelf heeft bewust nog GEEN
`CHOICES` naar Hoofdstuk 7 — dat bestaat nog niet, en dat is de rand van het
geschreven verhaal, geen bug.

**Getest**: (1) Node-reachability-script (`validate_ch6.js`, zelfde aanpak
als Hoofdstuk 5): alle 27 scènes bereikbaar vanaf `CH6_000` incl.
`CH6_EINDE`, elke `CHOICES`-target bestaat, elke `PUZZLE`/`COMBAT`-scène
heeft precies 1 keuze, en elke `PUZZLE`/`COMBAT`/`CODEX`/`PERSON`/
`EERETITEL`/`SOUVENIR`/`VOCAB`-id heeft een bijbehorende data-entry. (2)
Echte browser-render via `spGoCns()`: de koppelpuzzel volledig opgelost via
zowel directe tik-simulatie als echte muisklikken (inclusief het
vergrendelen/uitgrijzen van gematchte tegels), het Combat-bridge-gevecht
tegen Laodamas volledig uitgespeeld tot winst, de typed-greek
vocativuspuzzel (Βάκχε) via het Griekse schermtoetsenbord, `{tendency_address}`
dat correct oplost in `CH6_021`, beide eretitels toegekend, en `CH6_EINDE`
dat correct terugvalt op "Terug naar de opslagplekken". Eén bug gevonden
en gefixt tijdens dit testen (zie hierboven, de koppelpuzzel-foutmelding).
Geen consolefouten gedurende de hele sessie. Nog niet end-to-end
doorgeklikt vanuit de UI zelf met de muis door alle 27 scènes na elkaar —
zelfde openstaande vervolgstap als bij Hoofdstuk 4/5.

### 7.12 "Bewakers van de Herinnering" — karakterbank voor de laatste hoofdstukken (vastgelegd, nog te bouwen)

Uit de oorspronkelijke Character Bible (`Single Player Mode.docx`, zie de
openingsnoot van dit document) resteerden een paar personages die pas in de
laatste hoofdstukken (26-28) een rol krijgen en daarom nog nergens in de
campagne zijn uitgewerkt. Bij een audit (2026-07) van beide brondocumenten —
`Single Player Mode.docx` en `Certamen - Chronica Classica Campaign Map.docx`
— bleek de rest van hun inhoud (Master Timeline v1.0, de volledige
Campaign Map-tabel, de S/A/B-tier mythencanon, de Romeinse-verhalenlijst,
de Gouden Regels/pijlers/schrijfstijl) al 1-op-1 verwerkt te zijn in dit
document (`SP_CAMPAIGN`/`SP_MYTH_CANON`/de canon-uitbreiding hierboven) —
vandaar dat die brondocumenten nu opgeruimd kunnen worden. Onderstaande
personages waren de enige nog niet overgenomen informatie:

- **Lethe** — de eigenlijke hoofdtegenstander van heel Chronica Classica: de
  personificatie van de rivier Lethe (Λήθη) in de onderwereld, en de bron
  van de "vergetelheid" die het spel al vanaf de proloog impliciet drijft
  ("Ooit kende iedereen hun namen. Nu vervagen de goden en helden...",
  `SCREENS.spIntro`). BEWUST GEEN klassieke schurk: Lethe vernietigt niet,
  ze wist uit, en ze gelooft oprecht dat vergeten noodzakelijk is — "alles
  bewaren betekent dat niets meer betekenis heeft." Karakter: stil,
  melancholisch, mysterieus, overtuigend. Centrale vraag die ze de speler
  voorlegt: "Heeft de mens herinneringen nodig om te bestaan?" Hoort bij
  Hoofdstuk 27 "De Rivier Lethe" (`SP_CAMPAIGN`), waar de speler "de ware
  aard van Lethe" ontdekt — tot nu toe staat ze daar alleen als kale
  hoofdstuktitel, nog niet als personage.
- **Mnemosyne** — de tegenhanger van Lethe: Titanide van het geheugen,
  moeder van de negen Muzen, bron van alle verhalen (niet alleen de grote
  gebeurtenissen, ook een lied, een naam, een inscriptie, een
  familietraditie). Karakter: warm, rustig, zorgzaam, wijs. Ziet de speler
  niet als iemand die alleen oude kennis verzamelt, maar als iemand die
  haar opnieuw betekenis geeft. Hoort bij Hoofdstuk 26 "De Bibliotheek van
  Mnemosyne" (`SP_CAMPAIGN`) — nu alleen als locatienaam aanwezig.
- **Kleio** — Muze van de Geschiedenis, geeft vorm aan wat Mnemosyne
  bewaart. Stelt de speler steeds: "Wat vertellen mensen door? Wie wordt
  herinnerd? Waarom?" Karakter: enthousiast, nieuwsgierig, dramatisch, soms
  kritisch. Geplande gameplay-rol: historische context ontsluiten,
  alternatieve bronnen vertellen, verschillen tussen mythen uitleggen —
  natuurlijke gids voor het bestaande Geschiedenis-tabblad van de Codex
  Memoriae (§7.2.1).
- **Hephaistos (Vulcanus) als maker van het Orakel** — nog niet verwerkt in
  `codex_orakel_van_chronos`: Hephaistos smeedde het Orakel van Chronos
  zelf. Karakter in die rol: rustig, creatief, praktisch. Kleine toevoeging
  voor wanneer die codex-entry wordt uitgebreid, of wanneer Hephaistos (al
  bekend uit Hoofdstuk 1, lijn B) een latere scène krijgt.
- **Stemkarakterisering voor de al-geplaatste geschiedschrijvers** (Homeros,
  Herodotos, Livius, Vergilius — al gekoppeld aan hoofdstukken, zie de
  canon-uitbreiding hierboven, maar nog zonder eigen "stem" vastgelegd):
  - **Homeros** (rond de Trojaanse-Oorlog-hoofdstukken): rustig, oud,
    poëtisch, observerend — ziet de speler als een nieuwe zanger die de
    verhalen verder moet dragen.
  - **Herodotos** (Hoofdstuk 16, "De Vader van de Geschiedenis"):
    nieuwsgierig, vriendelijk, geïnteresseerd in vreemde culturen — leert de
    speler bronnen te vergelijken in plaats van alles klakkeloos te geloven.
  - **Livius** (Hoofdstuk 19-20): serieus, trots, moreel gericht — toont hoe
    Rome zichzelf wilde herinneren.
  - **Vergilius** (rond de Aeneas-hoofdstukken): gevoelig, intelligent,
    filosofisch — verbindt Troje met Rome's toekomst.

**Finale-personagelijst** (Hoofdstuk 28 "Chronica Classica"): de Master
Timeline noemde expliciet dat Kronos, Athena, Mnemosyne, Kleio, Homeros,
Herodotos, Livius én Vergilius in de Finale samenkomen — de speler gebruikt
dan alles wat hij, zij of die geleerd heeft om de herinnering aan de
klassieke wereld veilig te stellen. Nog geen uitgewerkte `SP_CAMPAIGN`-entry
voor de Finale met dit detail; hier vastgelegd zodat het niet verloren gaat.

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

   **Equip-bonussen in de Combat-bridge (ontwerp vastgelegd, nog te bouwen)**:
   de speler vroeg zich terecht af of het uitgeruste wapen/harnas ook echt
   iets doet in gevechten, in plaats van puur cosmetisch te zijn. Belangrijke
   constatering vooraf: `SP_COMBAT` heeft op dit moment GEEN speler-HP of
   inkomende schade — het is een pure "vraag → EP → aanval op de vijand"-lus
   (zie hierboven), dus een harnas kan niet letterlijk "schade absorberen"
   zonder eerst een heel nieuw schade-aan-de-speler-mechanisme te bouwen, en
   dat botst met de "nooit grimmig, geen game-over-scherm midden in het
   verhaal"-toon van Chronica (§7.6/gemini-comic-style.md). Daarom **hergebruikt
   het ontwerp bewust de bestaande EP-economie** in plaats van een nieuwe
   HP-laag toe te voegen:
   - **Wapen → schade per aanval** (`SP_COMBAT_DAMAGE_PER_ATTACK`, nu een vaste
     15 voor iedereen): wordt een tabel naar wapen-tier i.p.v. één vaste
     waarde. Tier 1 (`knuppel`/`hooivork`, startwapens): 15 schade
     (ongewijzigd — nulmeting). Tier 2 (`zwaard`/`speer`/`boog`, proloog-
     klassekeuze): 18 schade (+20%). Tier 3 (`staf`, Hoofdstuk 17 — het
     laatst ontgrendelde wapen): 22 schade (+~45%).
   - **Harnas → EP-verlies bij een fout antwoord**: momenteel kost een fout
     antwoord niets (geen EP-winst, geen straf) — dat blijft zo voor wie nog
     op `vodden`/`robe` zit. Vanaf `armor:licht` geldt een nieuwe, bescheiden
     EP-boete bij een fout antwoord die per harnas-tier KLEINER wordt: geen
     harnas-tier verliest ooit meer dan de bestaande situatie (nooit
     "erger" dan nu), maar een beter harnas beschermt je opgebouwde
     voortgang beter bij een misser. Voorgestelde tabel: `vodden`/`robe` = 0
     EP-boete (ongewijzigd), `licht` = -3 EP, `middel` = -2 EP, `hopliet` =
     -1 EP, `zwaar`/`ceremonieel` = 0 EP-boete (volledige bescherming — een
     compleet uitgeruste held maakt zich geen zorgen meer over een
     misstap). Dit maakt fout antwoorden voor het eerst een echt (maar
     nooit hard afstraffend) risico, en geeft harnas een leesbare, eerlijke
     rol: "bescherm je voortgang", niet "voorkom een game over" — er is nog
     steeds geen manier om een Chronica-gevecht te verliezen.
   - Bewust GEEN bonussen op `helm`/`schild`/`cape` — die blijven puur
     cosmetisch, om de balans overzichtelijk te houden (twee bonus-assen,
     wapen en harnas, is genoeg voor een verhaal-RPG die niet primair om
     combat-optimalisatie draait).

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
5. **Hoofdstuk 7 t/m 28 + Finale-content** — scène voor scène in CNS.
   `SP_CAMPAIGN` bepaalt per hoofdstuk de grammatica/personages, `SP_MYTH_CANON`
   levert het zijverhaal-materiaal. Meestal twee tot vier onafhankelijke lijnen
   per hoofdstuk (§7.1); Hoofdstuk 5 doorbrak dat bewust met één doorlopend
   tochtenlogboek i.p.v. een hub (§7.10) — een precedent voor toekomstige
   hoofdstukken die zich ook beter lenen voor één lijn dan voor parallelle
   keuzes. "Meer kruisen" (lijnen die van elkaar weten) is een latere stap.
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
  `[CLEMENTIA]`/`[SEVERITAS]`/`[NEUTRAL]`/`[REQUIRE:...]`/`[DONE:...]`-tags)
  die exact intact moeten blijven. Een .docx-omweg riskeert dat Word's autocorrect die merktekens
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

---

## 11. Stats, Klassen en Skill Checks (D&D-model) — Stap 2 + 3 (basis) gebouwd

Tweede laag bovenop de bestaande delayed-consequences/Latijn-als-skill-check-
opzet (§7.3): waar het bestaande waardensysteem (Pietas/Virtus/Astutia/
Eloquentia, hier "Clementia/Severitas/Neutral" genoemd) bepaalt **hoe** de
wereld op de speler reageert (reputatie, toon), bepalen zes nieuwe stats
**wat de speler kan doen** (capaciteit, toegang). De twee systemen blijven
strikt gescheiden in code en beleving — ze mogen elkaar beïnvloeden, maar
meten nooit hetzelfde. Bij het labelen van bestaande/nieuwe keuzes geldt
daarom: een keuze die puur moreel/karakter is (eerlijkheid, mededogen,
loyaliteit) krijgt NOOIT een stat, ook niet als hij "zwaar" aanvoelt.

### 11.1 De zes stats

| Stat | D&D-equivalent | Domein |
|---|---|---|
| **Vis** | Strength | brute kracht, dragen, forceren, worstelen, wapengeweld van dichtbij |
| **Agilitas** | Dexterity | snelheid, evenwicht, sluipen, boogschieten, vluchten, precisie |
| **Robur** | Constitution | uithoudingsvermogen, honger, kou, gif, wonden, lange marsen |
| **Ingenium** | Intelligence | kennis, talen, tekst en inscripties, strategie, raadsels |
| **Prudentia** | Wisdom | opmerkingsgave, mensenkennis, voortekenen lezen, zelfbeheersing |
| **Gratia** | Charisma | overtuigen, gezag, gastvrijheid winnen, liegen, bezingen |

- Bereik **3 t/m 20**, startwaarden tussen 8 en 15. Rauwe waarden, geen
  modifiers — een drempel is gewoon "Vis 13 of hoger", direct leesbaar.
- 19-20 alleen narratief verdiend (godengeschenk, doorstane beproeving),
  gereserveerd voor het laatste derde deel van het spel.
- Stats kunnen dalen: een verwonding verlaagt Vis, een verraad Gratia,
  uitputting Robur. Tijdelijke verlagingen krijgen een duur (aantal scènes,
  of "tot rust genomen"); permanente verlagingen zijn zeldzaam en altijd
  gevolg van een expliciete keuze.
- Twee afgeleide waarden, bewust minimaal: **Vigor** (uithouding, afgeleid
  van Robur — loopt terug bij fysieke tegenslag, op nul volgt geen game
  over maar een afgedwongen scène) en **Fatum** (kleine voorraad
  herkansingen per hoofdstuk om een gefaalde worp over te doen).

### 11.2 Klassen via de eerste keuze

In de proloog kiest de speler diëgetisch één voorwerp ("wat neem je mee?",
niet "kies je klasse") — dat bepaalt de klasse, startstats en een unieke
vaardigheid; de klassenaam volgt pas ná de keuze, als bevestiging. Elke
klasse claimt precies twee van de zes stats, zodat de zes stats in drie
banen uiteenvallen — elk obstakel kan dan drie routes krijgen, één per
klassepaar.

- **Hoplites** (speer/hasta) — **Vis+Robur**. Houdt stand, draagt, forceert,
  verduurt. Vaardigheid *Stare firmiter*: 1×/hoofdstuk een fysieke check
  automatisch laten slagen door schade aan Vigor te accepteren.
- **Sagittarius** (boog/arcus) — **Agilitas+Prudentia**. Verkenner: ziet
  eerder, beweegt sneller, leest voortekenen en mensen. Vaardigheid
  *Ex longinquo*: 1×/scène van veraf verkennen, krijgt info die andere
  klassen pas achteraf krijgen — sluit aan op het payoff-systeem (vage
  aanwijzing over gevolgen op lange termijn).
- **Eques** (paard/equus et habenae) — **Ingenium+Gratia**. Aristocratische
  leider: bevel, verbonden, strategie, tekst. Vaardigheid *Auctoritas*:
  1×/hoofdstuk een NPC-relatie met 1 verhogen, of een sociale check
  automatisch tot "deels geslaagd" tillen. Sterkste klasse voor
  Latijn-checks (Ingenium verlaagt drempel, Gratia verhoogt opbrengst) —
  bewust gecompenseerd doordat Hoplites/Sagittarius eigen, niet-talige
  manieren krijgen om om een gesloten inscriptie-deur heen te werken.

Alle drie starten met hetzelfde patroon 15/15/12/10/8/8 over de zes stats,
alleen de volgorde verschilt (Hoplites: Vis15/Robur15/Agilitas12/Prudentia10
/Ingenium8/Gratia8; Sagittarius: Agilitas15/Prudentia15/Ingenium12/Robur10/
Vis8/Gratia8; Eques: Ingenium15/Gratia15/Agilitas12/Vis10/Robur8/Prudentia8)
— zelfde totaal (68), geen klasse objectief sterker. Drempelgevoel:
11-12 haalbaar voor twee van de drie bij start, 13-14 alleen na investering
of klasse-sterk, 15+ bij start uitsluitend klasse-exclusief en spaarzaam in
vroege hoofdstukken, 8-stats optrekbaar maar nooit uitblinkend.

Klasse ligt na de proloog vast, maar stats groeien door gedrag — een Eques
die consequent vooropgaat in gevechten kan een hogere Vis krijgen dan een
Hoplites die steeds onderhandelde. Gedrag verslaat afkomst op de lange
termijn.

**Stap 2 — gebouwd (2026-07-24).** De proloog had in `PRO_003` al precies dit
keuzemoment (jachtboog/speer/ruitersporen), inclusief een
`REWARD: class=Boogschutter/Hopliet/Cavalerist; traits=...`-veld en een
eigen eretitel per keuze — geen nieuwe scène nodig geweest. `spHookReward()`
(singleplayer.js) initialiseert nu bij de EERSTE klassekeuze ook
`SP_STATE.stats` uit `SP_CLASS_STATS[classId]` (singleplayer-data.js, keys
`hopliet`/`boogschutter`/`cavalerie` — dezelfde id's als
`SP_CLASS_REWARD_MAP`/`BM_CLASSES`, geen aparte Latijnse klasse-id-ruimte).
Een latere REWARD (komt nu niet voor) overschrijft een al gegroeid statblok
niet. Getest via de browserconsole: Hopliet-keuze → exact
Vis15/Robur15/Agilitas12/Prudentia10/Ingenium8/Gratia8.

### 11.3 Groei via skillpoints

Aan het eind van elk hoofdstuk (niet de proloog) **3 basispunten** plus max.
**2 bonuspunten** uit het hoofdstuk zelf, in-fictie gepresenteerd (nacht bij
het vuur, offer, mentorgesprek) — nooit een levelscherm midden in het
verhaal. Over acht hoofdstukken ~24-40 punten.

Kosten schalen met de huidige waarde: t/m 11 → 1 punt, 12-14 → 2 punten,
15-17 → 3 punten, 18+ → 4 punten. Max. **+2 in dezelfde stat per
hoofdstuk**; harde grens 20, zachte grens 16 t/m hoofdstuk 3 en 18 t/m
hoofdstuk 6. Punten mogen opgespaard worden.

Twee lichte, verhaal-gekoppelde bonusmechanismen: **oefenpunten** (een stat
3+ keer ingezet in een hoofdstuk → 1 bonuspunt, max. 2, niet benoemd welke
stat — "je armen weten nu wat het schild weegt") en **korting op wat je
geoefend hebt** (eerste verhoging in een dat hoofdstuk gebruikte stat kost
1 punt minder, min. 1). Geen automatisch verval — wie niet investeert
blijft vanzelf achter.

Investeringsscherm toont per stat: huidige waarde, kosten van +1, een vage
hint welke drempels in het volgende hoofdstuk in de buurt liggen ("er ligt
zwaar werk voor je"), en het aantal gemiste gated choices per stat zonder
te verklappen wat het was. Elke investering wordt in de Kroniek
opgeslagen.

**Stap 3 (basis) — gebouwd (2026-07-24), bonuspunten nog niet.** Nieuwe
CNS-sectie `STATPOINTS:` (CNSParser/`spHookStatpoints`, singleplayer.js) kent
een vast aantal skillpoints toe en reset tegelijk de per-hoofdstuk
`+2`-teller (`statSpentSinceAward`) — elke `CHx_EINDE`-scène (Hoofdstuk 1
t/m 6) heeft nu `STATPOINTS:` met de basis **3** punten. `SCREENS.spStats`
(singleplayer.js) is het investeringsscherm: toont per stat waarde/kosten/
blokkeerreden, en `spInvestStat()` handhaaft alle drie de caps tegelijk —
harde grens 20, de meeschalende zachte grens (`spStatSoftCap`: 16 t/m
Hoofdstuk 3, 18 t/m Hoofdstuk 6), en max. 2 verhogingen per stat per
hoofdstuk. Elke investering komt in `SP_STATE.statLog` (van/naar/hoofdstuk/
tijdstip) — de Kroniek-weergave daarvan volgt nog. **Nog niet gebouwd**: de
oefenpunten/korting-bonusmechanismen uit 11.3 hierboven — die vereisen dat
er ergens stat-gebruik te tellen valt, en dat bestaat pas zodra Stap 5
gated choices oplevert (zie §11.5). Getest via de browserconsole: award →
investeren → alle drie caps triggeren de juiste blokkeertekst.

### 11.4 Checks en gated choices

Drie soorten: **gated choice** (hoofdmechanisme — drempel, geen dobbelsteen:
je kunt het of niet, altijd zichtbaar getoond, grijs, mét de eis — bv.
*"Zet je schouder tegen de steen. (Vis 14 — jij hebt 11)"* — dat gevoel
("de wereld is groter dan mijn personage") is het belangrijkste
ontwerpprincipe van het hele systeem; uitzondering: klassenvaardigheden en
zeldzame opties mogen wél verborgen blijven), **rolled check** (1-20 + stat
tegen een DC, spaarzaam — 2-3×/hoofdstuk op dramatische hoogtepunten, met
de vierdelige uitkomstenladder volledig/deels/gefaald/kritiek gefaald), en
de bestaande **Latijn-check** (Ingenium verlaagt moeilijkheid, Gratia
verhoogt opbrengst — taalinhoud zelf verandert nooit door stats).

Ontwerpregels: nooit een doodlopende weg (altijd één altijd-beschikbare,
niet-bestrafte optie — vaak de duurdere/ruwere weg); drie routes per
obstakel waar mogelijk, één per klassepaar; vaste drempelniveaus 11/13/15/17
(licht/gemiddeld/zwaar/uitzonderlijk), meeschalend per hoofdstuk; per
hoofdstuk minstens **twee exclusieve momenten per klasse** (auteurscontrole
die gated choices telt per stat/klassepaar).

**Harde regel (2026-07-24): een gated choice toetst ALTIJD de rauwe
statwaarde, nooit `classId`.** "Één per klassepaar" in de vorige alinea is
een schrijfheuristiek (welk stel stats hoort thematisch bij dit obstakel),
geen mechanische klasse-poort — een Sagittarius die zijn Vis heeft
opgetrokken tot 13 moet exact dezelfde zijdeur-route krijgen als een
Hoplites die daar al bij start zit. Klasse bepaalt uitsluitend de
startwaarden (§11.2), nooit de toegang zelf; anders klopt "gedrag verslaat
afkomst op de lange termijn" (§11.2) niet meer. `spStatReqMet()`
(singleplayer.js) toetst dan ook uitsluitend `SP_STATE.stats[key]` — nergens
in de keuzelogica staat een `classId`-vergelijking, en dat moet zo blijven
bij alle toekomstige gated choices. **Beslissing (2026-07-24): de klassenvaardigheden zijn de bewuste
uitzondering.** *Stare firmiter*/*Ex longinquo*/*Auctoritas* (§11.2/item 8
hieronder) blijven wél echt `classId`-exclusief, in tegenstelling tot elke
gated choice. Reden: de vaardigheid is het rechtstreekse gevolg van de
proloog-keuze zelf ("jij koos de speer, dus jij kunt Stare firmiter"), en is
daarmee de enige plek in het systeem waar die keuze permanent voelbaar
blijft, los van hoe de stats zich nadien ontwikkelen — zonder die
uitzondering zou de proloog-keuze op termijn mechanisch betekenisloos
worden. Nog niet gebouwd; wanneer item 8 aan de beurt is, mag de
implementatie dus gerust `classId` toetsen (in tegenstelling tot alle
STAT-tag-gated choices hierboven, die dat nooit mogen doen).

Koppeling met het payoff-systeem: een geslaagde check schrijft een flag weg
die later kan terugkomen (blessure, reputatie); payoffs mogen omgekeerd
stats tijdelijk aanpassen (wie in hoofdstuk 2 een NPC redde, krijgt in
hoofdstuk 5 hulp = tijdelijke bonus).

**Belangrijke afbakening (2026-07, na Stap 1-audit): een gated choice die
puur test of de speler een eerder gegeven aanwijzing goed gelezen/onthouden
heeft, is GEEN stat-check** — dat is een leesbegrip-mechanisme, geen
personagevermogen. Zie de correctie bij CH4_T06B in §11.5.

### 11.4a Toekomstig idee (2026-07-24, Gerben): leestests IN het Latijn/Grieks zelf — latere hoofdstukken

**Nog niet bouwen — dit is een vastgelegd idee voor zodra de leerlingen
genoeg opgebouwde grammatica/vocab hebben, dus pas relevant voorbij
Hoofdstuk 6.** Zodra dat punt bereikt is: eraan herinneren en dan pas
uitwerken.

**Het idee**: in plaats van dat een NPC-hint altijd in het Nederlands staat
(zoals Ariadnes "houd links aan" bij `CH4_T06B`), spreekt een NPC op
gezette momenten in het Latijn of Grieks zelf — ONGEVERTAALD, direct in de
TEXT/DIALOGUE — en moet de speler die tekst zelf begrijpen om de juiste
keuze te herkennen. Geen aparte puzzel-widget ervoor (zoals de bestaande
`PUZZLE:`-typen), maar de doeltaal rechtstreeks in de verhaaltekst, als
een leesbegrip-gate in de trant van `CH4_T06B` (zie de afbakening
hierboven) — alleen dan in het Latijn/Grieks in plaats van het Nederlands.

**Onderscheid met de bestaande, nog te bouwen Latijn-check-koppeling**
(§11.4 hierboven, bouwvolgorde-item 9: Ingenium verlaagt drempel, Gratia
verhoogt opbrengst): dat is een STAT-gemedieerde moeilijkheidsgraad op een
apart puzzelscherm. Dit nieuwe idee is iets anders — een directe
leestest in de lopende verhaaltekst zelf, zonder tussenscherm en zonder
stat-modifier: je begrijpt het Latijn/Grieks, of je begrijpt het niet.

**Waarom dit belangrijker is dan gewone leestest-puzzels (Gerbens eigen
woorden)**: dit dient de taalverwerving directer — authentieke, contextuele
blootstelling aan de doeltaal binnen het verhaal zelf, in plaats van
geïsoleerde oefening in een puzzelscherm. Op termijn wil Gerben dit
uitgebreider inzetten dan losse leestests.

**Wanneer relevant/op te pakken**: pas vanaf het punt in de campagne waar
`SP_CAMPAIGN`'s grammatica-progressie en de opgebouwde `SP_STATE.vocab`
(Codex Memoriae) genoeg dekking geven voor een NPC om een zin te kunnen
zeggen die de speler ook echt kan ontcijferen — dus niet in Hoofdstuk 1-6
(nog te vroeg), wél te overwegen zodra er aan Hoofdstuk 7+ gebouwd wordt,
of zodra bouwvolgorde-item 9 (Latijn-check-koppeling) aan de beurt is —
dat is het natuurlijke moment om dit er meteen bij te pakken.

### 11.5 Retrofit van Proloog t/m Hoofdstuk 6 — Stap 1 (audit) afgerond

**Stap 1 (audit) is uitgevoerd** (2026-07-24): elke bestaande `CHOICES:`-regel
in Proloog t/m Hoofdstuk 6 (`certamen/singleplayer-data.js`, regels
1476-6263, 335 keuze-regels in totaal) is gelabeld met de stat die er
impliciet bij hoort. Volledige tabel per hoofdstuk: zie de audit-agents'
rapportage in de bouwsessie van 2026-07-24 (niet apart gecommit — dit is de
samenvatting die telt).

**Hoofdbevinding**: van de 335 keuze-regels impliceren er slechts **3**
al een stat (plus het klassekeuzemoment zelf, `PRO_003`, dat geen
losse stat maar de klassekeuze ís). De rest is ofwel het bestaande
Clementia/Severitas/Neutral-waardensysteem (~90+ triades, bewust buiten
scope), ofwel een enkelvoudige "kijk verder"-schakel zonder alternatief —
en dat laatste is geen omissie: zuiver narratieve keuzes zonder stat-lading
(links/rechts zonder aanwijzing, wel/niet aanraken) horen te blijven
bestaan naast de gated choices, niet elke keuze hoeft gated te zijn.

Concreet:
- **`PRO_003`** (boog/speer/ruitersporen) — al het klassekeuzemoment zelf,
  zie §11.2.
- **`CH2_L07`** (overtuiging bij het eiland Delos, Latona-lijn) — thematisch
  zuiver **Gratia** ("gastvrijheid winnen"), maar momenteel een
  Clementia/Severitas/Neutral-toonkeuze: alle drie de opties leiden naar
  hetzelfde vervolg, dus nog geen echte mechanische fork. **Besluit
  (2026-07-24): dit wordt de eerste echte Gratia-drempel/-check** — vereist
  een nieuwe extra lijn/uitkomst (bv. een tak die alleen opengaat bij
  voldoende Gratia, of een merkbaar beter resultaat op het eiland),
  uitwerken bij Stap 5.
- **`CH4_T06B`** (links/rechts in het Labyrint van Kreta, Theseus-lijn) —
  **AUDIT-FOUT, GECORRIGEERD (2026-07-24): dit is GEEN Ingenium-drempel.**
  Ariadne geeft de speler eerder de aanwijzing "houd links aan"; deze keuze
  test alleen of de speler die aanwijzing goed gelezen en onthouden heeft.
  Dat is een leesbegrip-mechanisme (zie de afbakening in §11.4), geen
  personagevermogen — blijft dus stat=geen, rol=geen. De bestaande fail-lus
  (`CH4_T06R1`-`R3`, terug naar `CH4_T06B` bij een fout antwoord) is wél
  bruikbaar als structuursjabloon voor hoe een latere, échte gated choice
  met gevolg moet aanvoelen — alleen niet als stat-drempel zelf.

**Praktische consequentie voor Stap 3-5**: Stap 3 (groei aanhaken op
bestaande keuzes) en Stap 4 (drempels toevoegen aan bestaande keuzes)
hebben in Hoofdstuk 1-6 vrijwel niets om op te hangen — na de correctie
van `CH4_T06B` blijft alleen `CH2_L07` over als bruikbare aanknoping, en
die vereist al nieuwe content om een echte fork te worden. Het zwaartepunt
van de retrofit ligt dus zwaarder bij **Stap 5** (nieuwe klasse-exclusieve
content per hoofdstuk) dan de oorspronkelijke spec impliciet aannam: elk
hoofdstuk zal grotendeels nieuwe gated choices nodig hebben, niet slechts
gelabelde bestaande.

### 11.6 Bouwvolgorde

1. **Gebouwd (2026-07-24).** Stats, klassen en statverdeling in de
   wereldstaat; opslaan/laden. `SP_CLASS_STATS`/`SP_STAT_KEYS`/
   `SP_STAT_DEFS`/`spStatpointCost` (singleplayer-data.js);
   `SP_EMPTY_STATE` uitgebreid met `stats`/`skillpoints`/
   `statSpentSinceAward`/`statLog` (singleplayer.js) — loopt gratis mee in
   de bestaande per-saveslot opslag (`spSaveProgress`/`spLoadAllSlots`),
   geen apart opslagmechanisme nodig geweest.
2. **Gebouwd (2026-07-24).** Proloog-voorwerpkeuze mechanisch gekoppeld —
   zie §11.2/§11.5.
3. **Gebouwd (2026-07-24).** Gated choices met zichtbare, grijze
   vergrendeling + getoonde eis. Nieuwe CNS-tag `[STAT:sleutel:getal]` op
   een keuzeregel (`CNSParser.STAT_TAG_RE`, singleplayer.js) — in
   tegenstelling tot `[REQUIRE:...]` wordt deze keuze NOOIT verborgen
   (`spChoiceVisible` raakt hem niet): `SCREENS.spPlay` toont hem altijd,
   en rendert 'm grijs/`disabled` met de eis erbij zodra
   `spStatReqMet()` faalt — exact het `"Vis 14 — jij hebt 11"`-format uit
   Deel 4.2 van de spec. Voldoet de speler eraan, dan wordt de knop gewoon
   goud en klikbaar.

   **Bewijsscène (2026-07-24):** `CH1_A02` (de poort naar Midas' troonzaal,
   Hoofdstuk 1 lijn A) omgezet van één verplichte taalpuzzel naar een echt
   obstakel met drie routes, zoals Deel 4.3 voorschrijft. De taalpuzzel zelf
   verhuisde naar een nieuwe subscène `CH1_A02_PUZZLE` (blijft altijd open,
   Eques' natuurlijke weg — dit MOEST, want een scène met een `PUZZLE:`-
   sectie toont zijn `CHOICES:` nooit, dus de drempel-keuzes konden niet
   naast de puzzel op dezelfde scène staan). Twee nieuwe gated takken erbij,
   beide drempel 13 (Deel 4.3: "gemiddeld"), converging op dezelfde
   `CH1_A03`: `CH1_A02_VIS` (zijdeur forceren, Hoplites) en
   `CH1_A02_SLUIP` (wisseling van de wacht afwachten, Sagittarius — letterlijk
   het voorbeeld uit Deel 4.3 van de spec). Getest met alle drie de
   startklassen: Cavalerist (Vis10/Prudentia8) ziet beide gated takken
   correct grijs/vergrendeld, Hopliet (Vis15) ontgrendelt alleen de
   zijdeur, Boogschutter (Prudentia15) alleen de wachtwisseling; alle drie
   routes navigeren correct door naar `CH1_A03`.

   **Tweede batch (2026-07-24), 10 stuks, na goedkeuring per stuk door
   Gerben (voorstel B2 — het lidwoord-taalpuzzel in Hoofdstuk 1 lijn B —
   bewust NIET aangepast, blijft puur een taalpuzzel):**
   - `CH1_A10` (Pactolus-vlucht): Vis 13 (zijdeur forceren) / Gratia 11
     (poortwacht overtuigen) / altijd open (naast Midas blijven).
   - `CH1_B01C` (laatste helling naar de Olympos): Vis 13 (rotswand) /
     Agilitas 11 (richel) / altijd open (pelgrimspad).
   - `CH1_C03B` (dichter bij de haard van de goden): Agilitas 11
     (meeschaduwen) / Vis 13 (rotsrand) / altijd open (schaduw) — de
     bestaande taalpuzzel (`puzzle_ch1c_lidwoord`) blijft ervóór staan,
     ongewijzigd, als eigen verhaalbeat.
   - `CH1_C09B` (tocht naar Prometheus' rots): Vis 13 (rotswand) /
     Prudentia 11 (vluchtpatroon adelaar lezen) / altijd open (karrenspoor).
   - `CH2_L07` (Delos): **Gratia 13**, extra route náást de drie bestaande
     Clementia/Severitas/Neutral-toonkeuzes (niet vervangen) — geeft een
     merkbaar warmer resultaat (Athena's houding breekt even open). Eerste
     stat-check die een kwalitatief ander resultaat geeft, niet alleen
     andere aankomsttekst.
   - `CH2_L06B` (python-achtervolging): Agilitas 11 (zigzaggen) / Robur 13
     (doorbijten) / altijd open (blindelings rennen).
   - `CH2_S06B` (zoeken in de as na Semele): Vis 13 (door puin breken) /
     Prudentia 11 (sporen lezen) / altijd open (rand van de as) — uitkomst
     blijft identiek (Jupiter vindt het kind sowieso), alleen de zoektocht
     zelf krijgt gewicht.
   - `CH2_K05B` (Kallisto's spoor volgen): Robur 13 (tempo volhouden) /
     Prudentia 11 (kortere route lezen) / altijd open (op afstand volgen).
   - `CH2_H07B` (Nemeïsche leeuw, vóór de bestaande `COMBAT`-scène): Vis 11
     (rotsblok rollen) / Agilitas 13 (stenen stapelen) / altijd open
     (Herakles regelt het zelf) — nieuwe hub-scène vóór `CH2_H08`, het
     `COMBAT`-blok zelf ongewijzigd.
   - `CH2_H10B` (Hera's krab, vóór de Hydra-`COMBAT`-scène): Robur 11
     (beest vertrappen) / Agilitas 13 (krab wegsmijten) / altijd open
     (Iolaos waarschuwen) — nieuwe hub-scène vóór `CH2_H11`, het
     `COMBAT`-blok zelf ongewijzigd.

   **Patroon vastgesteld voor alle nieuwe scènes**: waar een obstakel al
   een `PUZZLE:`- of `COMBAT:`-sectie had (die tonen hun `CHOICES:` pas ná
   afloop, dus konden geen gated routes ernaast hebben), verhuist de nieuwe
   hub naar VÓÓR die sectie (`CH2_H07B`/`CH2_H10B`) of wordt de bestaande
   puzzel de eerste stap gevolgd door de hub (`CH1_C03B` e.a.) — nooit
   ernaast. Elke nieuwe route krijgt een eigen `FLAG: chX_Y_route=<stat>`
   (of `=open`) voor een toekomstige payoff-echo (antwoord op Gerbens vraag
   "krijgt een andere route ook een ander vervolg?": nee, de meeste
   obstakels geven bewust hetzelfde vervolg — Chronica Classica's speler is
   in Hoofdstuk 1-2 getuige/boodschapper, geen actor die de mythe zelf
   ombuigt, dus alleen de weg ernaartoe varieert, niet de uitkomst; de flag
   is het haakje voor een latere, optionele callback). Structurele
   validatie: alle 275 scènes geparsed, geen dubbele scène-ID's, geen
   losse eindjes (`->`-targets die niet bestaan) — geverifieerd met een
   Node-script over het ruwe bestand. Gating zelf getest in de browser met
   een Hopliet-save (Vis15/Robur15/Agilitas12/Prudentia10/Ingenium8/
   Gratia8): elke van de 10 hubs toont exact de verwachte grijze/goud-
   status per route.

   **Balanscontrole (§4.3-norm: minstens 2 exclusieve momenten per klasse
   per hoofdstuk)**: Vis komt in Hoofdstuk 1 vier keer voor als gate, Robur
   geen enkele keer — Hoplites leunt er dus zwaar op zijn Vis-helft, niet
   op Robur. Gratia komt in Hoofdstuk 1 en 2 samen maar twee keer voor als
   gate (A10, L07) — mager voor Eques, al krijgt die klasse elders al een
   structureel voordeel via de altijd-open taalpuzzels (Ingenium-kant) en
   via de nog te bouwen Latijn-check-koppeling (item 9). Ingenium komt in
   geen van de 10 nieuwe gates voor. Geen van deze scheeftrekkingen is
   dwingend genoeg om nu al bij te sturen, maar bij een volgende
   uitbreidingsronde (Hoofdstuk 3+) verdient Robur/Ingenium/Gratia extra
   aandacht t.o.v. Vis/Agilitas/Prudentia.

   **Derde batch (2026-07-24), 8 stuks in Hoofdstuk 3-4, met opzet
   Robur/Gratia-zwaar na de balanscontrole hierboven:**
   - `CH3_IO07B` (Mercurius sust Argus in slaap, tussen IO07 en IO08):
     Robur 13 (urenlang waakzaam blijven) / Gratia 11 (een nieuwsgierige
     voorbijganger wegpraten) / altijd open.
   - `CH3_IO11` (vlucht naar Egypte, herschreven i.p.v. losse hub): Robur 13
     (moordend tempo volhouden) / Gratia 11 (herders/boeren voor je
     winnen) / altijd open.
   - `CH3_H07B` (Erymanthische ever, sneeuwjacht — `CH3_H07` gesplitst in
     `H07`/`H07B`/`H07C` om de Chiron-beat en de jacht te scheiden): Robur 11
     (door de sneeuw) / Vis 13 (dier een kloof in dwingen) / altijd open.
   - `CH3_H13B` (Merries van Diomedes, wachters vóór `COMBAT:
     merries_van_diomedes`): Gratia 13 (als gezant naar binnen praten) /
     Robur 11 (nachtwake volhouden tot de aflossing suf is) / altijd open.
   - `CH3_H23B` (Cerberus, tocht door de onderwereld vóór `COMBAT:
     cerberus`): Robur 15 (alleen door het duister, zwaarste drempel tot nu
     toe — bewust, want laatste/zwaarste taak) / altijd open (Athena en
     Mercurius begeleiden je) — hier bewust maar twee routes, een derde
     voelde geforceerd op een scène die al climactisch genoeg is.
   - `CH4_T08` (vlucht uit Knossos, herschreven): Robur 13 (een uitgeputte
     offerling dragen) / Gratia 11 (een wachter bij de kade wegpraten) /
     altijd open.
   - `CH4_T11B` (was en veren verzamelen, `CH4_T11`/`T12` gesplitst zodat de
     speler nu zelf het materiaal verzamelt i.p.v. Daidalos alleen):
     Robur 13 (urenlang sorteren/smelten) / **Gratia 15** (een bewaker
     omkopen — hoogste drempel tot nu toe buiten Cerberus, want dit is
     stiekem tegen de eigen cipiers ingaan) / altijd open.
   - `CH4_P06` (Tellus' smeekbede): Gratia 13 (doorzien hóe ze Jupiter
     overtuigt) / Robur 11 (zien wát het volhouden haar kostte) / altijd
     open — **belangrijke correctie t.o.v. het oorspronkelijke voorstel**:
     dat had bewust geen ongated route ("beide routes zijn puur
     flavor/inzicht"), maar dat bleek bij het bouwen een echt soft-lock-
     risico: een startende Boogschutter (Robur10/Gratia8) zou dan BEIDE
     routes grijs zien en nergens kunnen klikken. Alsnog een neutrale open
     route toegevoegd — bevestigt waarom de "nooit een doodlopende weg"-
     regel (§11.4) geen stijlkeuze is maar een harde vereiste, ook als een
     voorstel het zelf niet voorstelt.

   Balans na deze batch: Robur nu 7×, Gratia 6×, Vis 2×, Agilitas 0×,
   Prudentia 0×, Ingenium 0× (blijft bij de taalpuzzels) — ruim gecompenseerd
   t.o.v. de eerste twee batches. Structurele validatie herhaald (304
   scènes totaal, geen dubbele ID's, geen losse eindjes) en gating getest
   in de browser met zowel een Boogschutter (Robur10/Gratia8 — bevestigt
   dat overal alleen de open route beschikbaar is, geen soft-locks) als
   een Hopliet (Vis15/Robur15 — ontgrendelt overal de Vis/Robur-routes,
   Gratia blijft correct op slot).
4. **Gebouwd, basisversie (2026-07-24).** Skillpoint-scherm aan het eind
   van elk hoofdstuk — zie §11.3. Bonuspunten (oefenpunten/korting) nog
   niet, wachten op Stap 3 hierboven.
5. **Gebouwd (2026-07-24).** Audit-tabel (Stap 1, zie §11.5) — inclusief de
   auteurscontrole-achtige telling per stat/hoofdstuk die de agents
   opleverden.
6. Retrofit Proloog t/m Hoofdstuk 6 — audit ✅, proloog-klassekeuze ✅,
   basis-skillpoints ✅; groei-aanhaken op *bestaande* keuzes en
   drempels-toevoegen leveren weinig op (grootste deel is nieuwe content
   uit Stap 5 van het oorspronkelijke retrofit-plan, nog te doen).
7. Rolled checks en Vigor/Fatum — nog te bouwen.
8. Klassenvaardigheden (*Stare firmiter*/*Ex longinquo*/*Auctoritas*) —
   nog te bouwen.
9. Koppeling met de Latijn-checks (Ingenium verlaagt drempel, Gratia
   verhoogt opbrengst) — nog te bouwen.
10. **Gebouwd (2026-07-24), hernoemd + uitgebreid (2026-07-24).**
    Statoverzicht voor de speler, **op twee plekken**: `SCREENS.spStats`
    (singleplayer.js, intern nog steeds "spStats" — alleen de
    zichtbare titel is anders), bereikbaar via een "📊 Karakter
    Informatie"-knop naast Kaart/Codex op de Chronica-landingspagina
    (`spRenderLanding`), én via een kaart op het Certamen-profiel
    (`SCREENS.battleProfile`, battle.js) die de meest recent bijgewerkte
    saveslot-met-klasse toont (`spBestStatsSlot`) met een knop
    (`spResumeSlotToStats`) die rechtstreeks naar hetzelfde scherm springt.
    Op Gerbens verzoek heet het scherm nu **"Karakter Informatie"** i.p.v.
    "Statistieken", en toont het bovenaan ook de Chronica Classica Avatar
    (`spAvatarMerge(spAvatarLoadLocal())` + `renderPixelHeroPreview`/
    `bmAvatarSVG`, dezelfde weergave als op het Certamen-profiel) en een
    paneel "Huidige uitrusting" (wapen/wapenrusting/helm/schild/cape, via
    `BM_AVATAR_PARTS`) met een knop rechtstreeks naar
    `SCREENS.spAvatarEdit`. De Kroniek-stijl-weergave van `statLog`
    (§11.3) staat nog open.

Proloog + één bestaand hoofdstuk volledig ombouwen voordat de rest volgt;
pas als één hoofdstuk met alle drie de klassen goed speelt, is het systeem
bewezen.
