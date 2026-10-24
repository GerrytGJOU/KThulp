# Castra Heroum × Pokémon: de wereldkaart (2026-10-24)

Aanleiding: `Aanvullend_Dossier_Pokemon_Overworld_Claude_Code.docx` en het ChatGPT-gesprek `Onderzoek Pokémoncode (1).pdf`.
Dit is de audit van onze overworld naast dat dossier, met voorstellen. Vervolg op `CASTRA_POKEMON_ANALYSE.md` (het gevecht).
**Er is in dit document niets aan de overworld veranderd.** Pokémon-details komen uit mijn kennis van pokeemerald (map.json, mapjson.cpp, overworld.c),
niet uit een verse lezing van die bestanden: eerst verifiëren vóór ze in code komen.

## 1. Wat we hebben (feiten uit de code)

| Onderdeel | Hoe het bij ons zit | Waar |
|---|---|---|
| Wereldgraaf | 11 buitenregio's en 38 binnenruimtes = 49 "werelden"; buren via `links` (N/S/E/W) en poorten op vaste plekken (rand, 2 tegels breed); snelreizen via haven/caravan | `castra-geo.js` (`CASTRA_GEO`), `castra-world.js` (`CASTRA_WORLDS`) |
| Kaart | tegelraster 64×48 (Latium en andere grote regio's), ondergrond + objecten, solide tegels, hoge objecten die over de avatar vallen | `castra-map.js`, `castra-world.js` |
| Entiteiten | 511 objecten van ±25 soorten in één lijst (`CASTRA_WENT`): npc, kist, pickup, boek, bord, deur-hub, baas, trainer, veldactie, blokkade | `castra-wobj.js` en elke regiomodule |
| Warps | deuren (`doors`) naar binnenruimtes met eigen kaart, terugweg naar de moederregio | `castra-interiors.js`, `castra-geo.js` |
| Verbindingen | geen offsets nodig: poorten liggen vast; een gesloten regio heeft een versperring met verhaal | `castra-gates.js` |
| Versperringen (HM's) | saxum/arbor/ara/tentorium per klasse in je leger, anders arbeiders huren; blijvend open (`CASTRA.wgate`) | `castra-field.js` |
| Vijanden | per stap in hoog gras vaste kans (0,14 buiten, 0,2 in grotten) met `Math.random()`; tier 60/28/10/2, volk uit de regio | `castra-world.js:292`, `castra-troops.js` |
| Trainers | 31 trainers langs de weg; je moet dichtbij komen (geen zichtlijn), Latijnse vraag, rematch per dag | `castra-train.js` |
| Quests | één questmotor (`CASTRA_QDEFS`, 79 opdrachten) + Diarium; voortgang `CASTRA.dq[id] = {s,n,a,d}`; heldenketens `CASTRA.quests`; zoekopdrachten `CASTRA.wq` | `castra-diarium.js`, `castra-sidequests.js`, `castra-quests.js` |
| Wereld verandert | gate-slotscènes, `wbuilt` (gebouwen die de speler laat bouwen), dagelijkse kisten/veldacties, dag/nacht, rondlopende bewoners per dag | `castra-wobj.js`, `castra-dayn.js`, `castra-wanderers.js` |
| Hoofdroute | `CASTRA_REGION_NEEDS`: elke regio vraagt een gewonnen missie; met een tak (Latium → Roma óf Gallia → Germania) en snelreizen terug | `castra-world.js:89` |
| Sidequests | wekelijkse uitdaging, Colosseum, Latijnse puzzels, kampioenen, insignia, zijquests per bewonerstype | `castra-weekly.js`, `castra-colosseum.js`, `castra-train.js` |
| Opslag | positie per regio, bezocht, items, flags: verspreid over 15+ sleutels in één JSON (`wq`, `quests`, `gateSeen`, `wgate`, `wday`, `wchest`, `wbuilt`, `insignia`, `dq`, ...) | `castra.js`, nu met migraties |
| Tests | alleen het Colosseum heeft een eigen wereldtest (BFS naar Praeco/borden); de rest is met de hand in de browser gecontroleerd | `tools/castra-colo-world-test.js` |

## 2. Gap-analyse naast het dossier

| Dossier-onderdeel | Oordeel | Opmerking |
|---|---|---|
| Netwerk van maps met warps en connections | **Bestaat** | Zelfde model; onze verbindingen zijn eenvoudiger (vaste poorten). Een offset-systeem is niet nodig. |
| Object / warp / background events | **Bestaat, deels** | Object en warp ja; borden, boeken, kisten en pickups zijn de "background events". Verborgen voorwerpen ontbreken: alles is zichtbaar. |
| Coordinate events (staptriggers) | **Uitbreiden** | Er zijn losse triggers (uitgang, deur, zone-chip, trainer-nabijheid) maar geen algemene "stap op tegel X met flag Y → doe Z". |
| Map scripts bij laden/betreden/terugkeer | **Uitbreiden** | Nu monkey-patching: elk bestand wikkelt `castraWFeat`, `castraNpcTalk` enz. en de laadvolgorde bepaalt het resultaat. Werkt, maar elke nieuwe module vergroot dat risico. |
| Story-flags en variabelen (StoryState) | **Nieuw bouwen (dun)** | Geen centrale flagtabel; flags staan verspreid. Een dunne voorzijde `castraFlag(id)` is genoeg, geen herschrijving. |
| Questjournal en state machine | **Bestaat, impliciet** | Diarium en `dq` doen het werk; de toestanden LOCKED/AVAILABLE/ACTIVE/READY/COMPLETED zijn af te leiden maar niet benoemd. |
| Wereldveranderingen na voortgang | **Uitbreiden** | Gates, gebouwen en dagwissels bestaan. Wat ontbreekt: plaatsen die beschadigd en hersteld worden en NPC's met een andere dialoog na een gebeurtenis (alleen deels). |
| Trainerzichtlijnen | **Nieuw bouwen** (klein) | Nu moet je dichtbij komen; Pokémon laat trainers kijken, "!" tonen en naar je toe lopen. |
| Gras-, water- en grotontmoetingen | **Uitbreiden** | Gras en grot ja; geen water (vissen/varen), geen vaste slottabellen, geen zeldzame slot, geen repel. |
| Veldvaardigheden | **Bestaat** | Eigen variant per klasse. Nog niet: hoogteverschillen (ledges) en schuifbare rotsen. |
| Winkels, genezing | **Bestaat** | Commercium, put, Hospitium, rustplekken. |
| Puzzels | **Bestaat, Latijns** | Latijnse puzzels via NPC's. Geen vloer-/rotspuzzels. |
| Tijd/weekdag-gebeurtenissen | **Uitbreiden** | Dag/nacht-fases bestaan; weekdagen en markt-/feestdagen niet. |
| Deterministisch testen, softlocks | **Nieuw bouwen** | Ontmoetingen gebruiken `Math.random()`; er is geen vaste wereldtest voor bereikbaarheid en softlocks. |
| Semi-open structuur, kritieke route met lussen | **Bestaat** | Latium→Roma óf Gallia, optionele grotten, kampioen per land, snelreizen. |
| Sidequests zonder verplichte quiz | **Bestaat** | Alles optioneel en leesgericht, niets is een toets. |

## 3. Voorstellen, per onderdeel

Omvang: S = ≤ 1 sessie, M = 1-3, L = meerdere. Volgorde in §4.

**W1. Wereldtest en validator (S-M, hoogste prioriteit).** `tools/castra-world-test.js` die per regio en binnenruimte controleert: alle deuren hebben een
terugweg, alle bereikbare plekken liggen binnen de kaart, geen entiteiten op solide tegels of op elkaar, elke regio is bereikbaar vanuit het kamp via poorten,
elke versperring heeft een oplossing (klasse óf arbeiders), geen quest vraagt een voorwerp of NPC dat niet bestaat, geen deur leidt naar een niet-bestaande
wereld. Draait met `node` zonder browser als de kaartgenerator zonder DOM werkt, anders in de browser zoals de andere tests. Voorkomt softlocks (dossier §10)
en vervangt het handmatige BFS-controleren. Voordeel: elke nieuwe regio of quest wordt direct gecontroleerd.

**W2. Trainerzicht (S-M).** Trainer kijkt in een richting; komt de speler in een rechte lijn tot N tegels (zonder obstakel), dan verschijnt een "!", de trainer
loopt naar je toe en het gesprek start (zoals nu, met de Latijnse vraag). Alleen als hij nog niet verslagen is. Past in `castra-train.js`; geen nieuwe assets
(de bestaande pijl/uitroepteken uit de quest-markeringen volstaat). Maakt de wereld levendiger en zorgt dat leerlingen trainers niet "per ongeluk" missen.

**W3. Verborgen voorwerpen (S).** Tegels met een onzichtbaar voorwerp (per dag, zoals de kisten, via de dagzaad-rng): een kort "iets glinstert" bij
oplopen of bij het aantikken van een boom, rots of boekenkast; kleine beloning (grondstof, XP, een Latijns woord uit het Diarium). Eenvoudig data-veld
`hidden:true` in `CASTRA_WENT`. Beloont verkennen, de kernreden van Pokémon-routes.

**W4. Ontmoetingen als systeem (M).**
- Seeded rng i.p.v. `Math.random()` (`castraRng` bestaat), zodat ontmoetingen testbaar en terug te spelen zijn.
- Vaste slottabellen per terrein (bv. 20/20/10/10/10/10/5/5/4/4/1/1 zoals Pokémon) met een zeldzaam slot, in plaats van tier-gewogen trekking. De huidige 60/28/10/2 blijft de uitkomst, maar wordt een zichtbare, aanpasbare tabel.
- **Repel** (`Odor saeptum`): een voorwerp dat N stappen ontmoetingen met lagere level blokkeert (alleen als er voorwerpen zijn, zie W7).
- Water-ontmoetingen op de bestaande waterzones (`tiberis`, `litus`, `scamander`, `nilus`): een boot of vissen levert vijanden met water-element (gebruikt de nieuwe elementen).
Vangkans per vorm is al gebouwd (§5).

**W5. Map-hooks en centrale flags, dun (M, daarna groeiend).** Twee kleine stukken, geen herschrijving:
1. `castraFlag(id)`, `castraSetFlag(id, v)`, `castraFlagsAll()` als voorgevel over de bestaande sleutels (`wgate`, `wq`, `dq`, `gateSeen`, `wbuilt` ...) plus een tabel voor nieuwe flags. Zo kunnen events voorwaarden stellen zonder te weten waar het ergens staat.
2. Een declaratieve eventtabel `CASTRA_EVENTS = [{ map, on:"enter"|"step"|"interact", at:[x,y], if:{ flag }, do:[...] }]` met een minimale scriptrunner (`say`, `giveItem`, `setFlag`, `openGate`, `spawnNpc`, `warp`, `battle`). Nieuwe content gebruikt dit; bestaande modules blijven ongemoeid. Dat vermindert het wikkelen van functies en maakt W6-W8 goedkoop.
Het dossier noemt de hooks onBeforeLoad / onEnter / onReady / onStep / onInteract / onResume / onExit: `castraWorldDef` (laden), `castraGeoDoor`/`castraGeoExit` (betreden) en `castraWStep` (stap) zijn de natuurlijke aanhaakpunten.

**W6. Quest-toestanden benoemen (S).** Een functie `castraQuestState(id)` die uit `dq` en de voorwaarden `LOCKED | AVAILABLE | ACTIVE | READY | COMPLETED` afleidt (geen datamigratie). Het Diarium en de ❗/❓/💬-markeringen gebruiken die ene bron. Maakt de questlog uit het dossier expliciet en testbaar.

**W7. Wereldtoestanden en reagerende NPC's (M).** Een kleine reeks vaste wereldtoestanden per plaats, afhankelijk van flags (geen simulatie): bijv. *Ardea belegerd* → *verdedigd* (bij het winnen van missie m3: andere NPC's, andere tekst, hersteld dorp), een door een monster verwoest dorp dat na de baas hersteld wordt. Techniek: overlay-laag die `castraWorldDef` per flag toepast, zoals de poorten nu al doen. Dit levert wat het dossier "world state changes" noemt en veel verhaalgevoel voor weinig werk, en geeft de Latijnse dialoog een natuurlijke plek (*Ardea defensa est!*).

**W8. Hoogteverschillen en schuifbare rotsen (M).** *Ledges*: eenrichtingstegels waar je naar beneden kunt springen maar niet terug (korte routes en lussen zonder poort). *Schuifbare rotsen* (Strength) als nieuwe veldactie voor een klasse (hopliet/spartaan) met eenvoudige rotspuzzels in grotten. Beide geven de "optionele lussen en shortcuts" uit het dossier. Vereist W1 (softlock-test) voordat puzzels gebouwd worden.

**W9. Tijd- en dagevents (S-M).** Dag/nacht heeft effect op ontmoetingen; voeg toe: NPC's die alleen 's nachts of op marktdag verschijnen, en de Romeinse **nundinae** (de marktdag, elke achtste dag) als terugkerende gebeurtenis: handelaar met speciale aanbiedingen, extra rustplek of bijzondere trainer. Past bij Pokémon Gold/Silver (weekdagen) en is op zichzelf Latijn-cultuur. De gegevens komen uit `castraDay()` (bestaat).

**W10. Weer (L, optioneel).** Per regio regen of mist (visueel en een kleine aqua/aer-bonus in het gevecht, gekoppeld aan de nieuwe elementen). Alleen als er behoefte is.

**W11. Sidequest-vormen uit het dossier (M, optioneel).** *Mercator amissus* is er al in de vorm van de zijquests (verloren schaap, zoon, waren). Nieuw te overwegen: een **Venatio magna** (een tijdelijk speciaal gebied met eigen regels en zeldzame ontmoetingen, zoals de Safari Zone) en een herhaalbaar puzzelhuis (Trick House) voor Latijnse puzzels. Eerst W5/W8.

**Niet doen:** één aaneengesloten wereldkaart zonder maps (ons netwerk van regio's werkt), een offset-systeem voor verbindingen, of het herschrijven van de bestaande modules naar een nieuwe engine. Het dossier adviseert zelf een netwerk van maps met warps.

## 4. Aanbevolen volgorde

1. **W1** wereldtest en validator (onzichtbaar, voorkomt softlocks).
2. **W6** quest-toestanden (klein) en **W3** verborgen voorwerpen (klein, direct merkbaar).
3. **W2** trainerzicht.
4. **W4** ontmoetingen als systeem (seeded rng, slottabellen, water), nu met de nieuwe elementen.
5. **W5** flags-voorgevel en eventtabel, daarna **W7** wereldtoestanden en **W9** nundinae.
6. **W8** ledges en rotspuzzels; **W10**, **W11** alleen op verzoek.

## 5. Gebouwd bij dit verzoek: vangkans per vorm

Zoals gevraagd is schudden bij het vangen niet gebouwd (we werven, er is geen bal). De vangkans per vorm is wel ingebouwd:
- `CASTRA_FORM_CATCH` in `castra-moves.js` (factor per vorm, 1 = gewoon) werkt als een extra factor in `castraMvCatchChance`, naast de bestaande tier-, level- en insignis-regels. Zeldzame wezens zijn lastiger te werven: draco en feniks 0,35, gevleugeld paard 0,55, larva en tier-3-centaur 0,6, wolf van Mars (tier 2) en gryps 0,7, enzovoort; alle andere vormen 1.
- De beginnersbonus (minstens 90% bij minder dan 3 soldaten) blijft. Een slapende of bange vijand is makkelijker te vangen (zie de gevechtsregels).
- Test: `tools/castra-rules-test.js` (draak moeilijker dan sater; alle factoren verwijzen naar bestaande vormen).

## 6. Beslissingen die ik van Gerben nodig heb

1. **Volgorde:** akkoord met W1 eerst (wereldtest) en dan W6 + W3, of liever eerst iets wat leerlingen direct merken (W2 trainerzicht, W3 verborgen voorwerpen)?
2. **Flags:** akkoord met een dunne voorgevel (`castraFlag`) en een eventtabel voor nieuwe content, zonder bestaande modules te herschrijven?
3. **Ontmoetingen:** akkoord om `Math.random()` door de seeded rng te vervangen (zelfde gevoel, testbaar), en met een zichtbare slottabel per terrein?
4. **Voorwerpen:** wil je een eenvoudige inventaris (repel, genezing) in de wereld, of blijven grondstoffen het enige? Dit bepaalt W4's repel en elk vangmiddel.
5. **Nundinae:** vind je de Romeinse marktdag (elke 8e dag) een goed terugkerend evenement, of liever een kalenderdag/weekdag?
