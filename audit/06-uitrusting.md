# Fase 6 — Uitrusting en unlocks

> Bronnen: `SP_AVATAR_STORY_UNLOCKS`/`SP_AVATAR_FREE_PARTS` (`certamen/singleplayer-data.js`),
> `SP_AVATAR_HIDDEN_PARTS` (`certamen/singleplayer.js:121`), `BM_AVATAR_PARTS`
> (`certamen/battle-data.js`), en de routekaart in `Chronica.md` §5.1.

## Uitrustingsregister

| id | Verworven in | Voorwaarde | Mechanisch effect | Verwezen na verwerving? |
|---|---|---|---|---|
| `wapen:boog` | `PRO_004A` | Titel `boogschutter_orakel` | Puur cosmetisch (avatarlaag) | Nee — geen enkele latere scène noemt het wapen |
| `wapen:speer` | `PRO_004B` | Titel `hopliet_orakel` | Puur cosmetisch | Nee |
| `wapen:zwaard` | `PRO_004C` | Titel `cavalerist_orakel` | Puur cosmetisch | Nee |
| `armor:robe` | `CH1_ROBE` | Flag `ch1_voltooid` | Puur cosmetisch | Nee — geen enkele latere scène noemt de mantel |
| `armor:licht` | `CH2_H09` | Flag `herakles_harnas` | Puur cosmetisch, maar narratief het rijkst verankerd | Ja — tweemaal (`CH3_H01_HARNAS`, `CH9_002`) |
| `armor:middel` | `CH5_006` | Flag `ch5_bemanning_uitrusting` | Puur cosmetisch | Nee |
| `helm:bandana` | `CH5_006` | Flag `ch5_bemanning_uitrusting` | Puur cosmetisch | Nee |
| `helm:standard` (H4) | **Gepland, niet gebouwd** | — | — | — |
| `schild:rond` (H4) | **Gepland, niet gebouwd** | — | — | — |
| `armor:zwaar` (H8) | **Gepland, niet gebouwd — maar de scène bestaat al** (`CH8_EPI_004`, Vulcanus smeedt nieuw harnas) | — | — | — |
| `schild:ovaal` (H8) | Idem, zelfde scène | — | — | — |
| `helm:open` (H9) | **Gepland, niet gebouwd** | — | — | — |
| `cape:kort` (H14+) | Toekomstig boek | — | — | — |

**Alle zeven categorieën die niet in `SP_AVATAR_FREE_PARTS` vallen** (`armor`, `helm`, `schild`,
`wapen`, `cape`) zijn bedoeld om via het verhaal te ontgrendelen. Vier zijn gebouwd, drie staan
alleen als routekaart-rij in `Chronica.md` §5.1.

---

## Bevindingen

### 1. Timing

De vier gebouwde unlocks komen precies op het moment dat ze narratief kloppen: de klassewapens bij
de proloog-keuze zelf, de mantel bij het afsluiten van Hoofdstuk 1, het harnas op het moment dat
Herakles het letterlijk aan de speler geeft, het reisharnas bij het vertrek van de Argo. Geen
timing-probleem in wat er staat.

**Wél een timing-gat:** `CH8_EPI_004` (Vulcanus smeedt Achilles' nieuwe wapenrusting én schild)
is **al geschreven en gespeeld** — de scène bestaat, heeft een souvenir (`souvenir_schild_achilles`)
en een puzzel — maar schrijft **geen enkele flag**. De routekaart in `Chronica.md` §5.1 plant
`armor:zwaar`/`schild:ovaal` expliciet op dit moment, met de status-kolom leeg. Dit is dus geen
toekomstig werk maar een vergeten hook in bestaande, al opgeleverde content — de goedkoopste fix
in deze hele fase: één `FLAG:`-regel toevoegen aan een scène die al bestaat.

### 2. Bereikbaarheid per klasse

Met uitzondering van de startwapens (bewust klasse-gebonden — dat ís het hele punt van de
proloog-keuze) is **geen enkele** uitrusting klasse-afhankelijk. Mantel, harnas en reisuitrusting
gaan naar elke speler, ongeacht klasse. Er is dus geen hoofdstuk waarin een specifieke klasse
zonder bruikbare uitrusting achterblijft — maar dat komt doordat er sowieso geen enkele
klasse-exclusieve uitrusting bestaat buiten de openingskeuze. Vergelijk fase 1 §7: de
STAT-gates zorgen wél voor klasseblindheid in de vórm van de reis; de uitrusting zelf niet.

### 3. Narratieve verankering

**Alle vier gebouwde unlocks zijn narratief verankerd** — geen enkele verschijnt stilletjes in de
inventaris. Dat is een compliment waard: dit is precies het patroon dat de rest van het spel
mist. Herakles geeft zijn harnas met een blik naar de speler; Argos deelt de reisuitrusting
persoonlijk uit; het Orakel vouwt de mantel zelf om de schouders van de speler. Nul voorwerpen
"vallen zomaar" in de inventaris.

### 4. Verwijzingen na verwerving

Hier zit het echte gat. Van de vier gebouwde unlocks wordt er precies **één** ooit nog genoemd
nadat de speler hem heeft gekregen: `armor:licht` (het Herakles-harnas), tweemaal — als optionele
`deur`-payoff in `CH3_H01_HARNAS` en als echo in `CH9_002`. De mantel (`CH1_ROBE`) en de
reisuitrusting (`CH5_006`) verdwijnen na hun eigen scène volledig uit de tekst. Geen enkele NPC
herkent de mantel die het Orakel zelf gaf; niemand aan boord van de Argo merkt ooit meer op dat de
hele bemanning hetzelfde reisharnas draagt.

Dat is precies het patroon dat de opdracht als "essentieel" markeert voor herkenbare erfstukken —
en het harnas bewijst dat het spel het kán. Het is alleen driekwart van de tijd niet gedaan.

### 5. Verlies en overdracht

**Geen enkel mechanisme.** `SP_AVATAR_STORY_UNLOCKS` kent alleen toevoegen, nooit verwijderen —
er bestaat geen functie die een ontgrendelde optie weer op slot zet. De speler kan dus nooit iets
verliezen, weggeven of buitmaken. Dat is een structurele beperking, geen incident: het hele
avatarsysteem is opt-in-only.

### 6. Consistentie met de tekst

Ik heb geen scène gevonden waar de vertelling ervan uitgaat dat de speler iets bezit (of juist
niet bezit) zonder dat te controleren. Dat is deels omdat er zo weinig mechanisch gewicht op
uitrusting rust: bijna niets in de tekst verwíjst naar uitrusting, dus er is ook weinig gelegenheid
voor een foute aanname. Geen harde fout gevonden, maar dat is eerder afwezigheid van risico dan
bewijs van zorgvuldigheid.

### 7. Ongebruikte voorwerpen

**Alle vier gebouwde unlocks zijn "ongebruikt" in de zin die de opdracht bedoelt: geen van hen
opent ooit een deur of beïnvloedt ooit een check.** Ze zijn zuiver cosmetisch — een laag op de
Battle Mode-avatar, geen gameplay-object. Dat geldt niet alleen voor uitrusting maar voor élk
`SOUVENIR:`-item in het spel (zie fase 5 §3): niets in Chronica Classica is een functioneel
voorwerp in de spelmechanische zin (een sleutel, een wapen met een eigen effect, een vereiste voor
een latere keuze). Het dichtstbijzijnde dat er is, is `herakles_harnas`, en zelfs die opent alleen
een **payoff-tekstblok**, geen mechanisch andere uitkomst.

### 8. Een architecturale ontdekking: titels zijn niet uitleesbaar door payoffs

Bij het bouwen van het register bleek dat de drie klassewapens getrackt worden via **titels**
(`boogschutter_orakel` e.d.), niet via flags. Dat werkt voor het avatarsysteem
(`spAvatarIsUnlocked` leest titels apart in), maar **`spPayoffConditionMet()` — het hele
payoff-systeem — leest uitsluitend `SP_STATE.flags` en `SP_STATE.relations`**
(`certamen/singleplayer.js`, zie fase 1). Titels staan niet eens in `SP_EMPTY_STATE`.

**Concreet gevolg:** er bestaat geen enkele manier waarop een `SP_PAYOFFS`-conditie of een
`[REQUIRE:...]`-keuzegate kan testen welk wapen de speler in de proloog koos, want dat feit leeft
alleen als titel. Wil een toekomstig hoofdstuk een NPC laten zeggen "ik zie dat je nog altijd de
boog draagt die je uit die kist nam", dan moet er alsnog een aparte flag bijkomen — de titel
alleen volstaat niet. Dit is dezelfde onderliggende bevinding als fase 1's opmerking over
`PRO_003`, nu vanuit de architectuur bevestigd.

### 9. De `capekleur`-bug (uit `Chronica.md` bevestigd, niet zelf ontdekt)

`Chronica.md` §5.1 signaleert zelf al dat `capekleur` in `BM_AVATAR_PARTS`
(`certamen/battle-data.js:292`) geen `requires` heeft — dus in Battle Mode al vanaf het begin
vrij is — maar nog niet in `SP_AVATAR_FREE_PARTS` (`certamen/singleplayer-data.js:1966`) staat.
Ik bevestig dat dit klopt: `SP_AVATAR_FREE_PARTS` bevat alleen
`["geslacht","huid","haar","haarkleur","baard"]`. Zodra `cape:kort` in een toekomstig hoofdstuk
wordt gebouwd, moet `capekleur` er ook bij — anders is er een cape zonder enige kleur ervoor
beschikbaar. Geen actie nodig vóór Hoofdstuk 14, maar hier herbevestigd zodat het niet vergeten
wordt.

---

## Voorstellen, samengevat

| Bevinding | Voorstel | Werk |
|---|---|---|
| `CH8_EPI_004` mist zijn geplande unlock-hook | Voeg `FLAG: armor_zwaar_schild_ovaal=true` toe en registreer `armor:zwaar`/`schild:ovaal` in `SP_AVATAR_STORY_UNLOCKS` | Triviaal — bestaande scène, twee regels code |
| Mantel en reisuitrusting worden nooit meer genoemd | Eén korte NPC-regel per stuk op een toepasselijk later moment (bv. Athena merkt de mantel op in `CH2_ATHENA`; een latere Argonaut noemt het reisharnas) | Triviaal |
| Titels onleesbaar voor payoffs | Voor de klassewapens: voeg naast de titel ook een lichte flag toe (`FLAG: wapen_gekozen=boog/speer/zwaard` in `spHookReward`) zodat toekomstige payoffs er wél op kunnen conditioneren | Klein — één aanpassing in `spHookReward()` |
| Geen enkel voorwerp heeft mechanisch gewicht | Buiten scope voor nu — dit raakt het ontwerp van het hele systeem (zie fase 9, "mechanismen"); geen concrete singleknop-fix | — |
| Verlies/overdracht ontbreekt volledig | Geen actie voorgesteld — past niet bij een spel waarin uitrusting bewust nooit een straf is; alleen signaleren, niet oplossen | — |
