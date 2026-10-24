# Castra Heroum: de wereld levend maken (2026-10-24)

Aanleiding: Gerben vindt ledges en rotsen in een bergachtig gebied interessant ("meer afwisseling, meer te volgen paden, niet alleen grote vlakken") en vroeg om nog eens naar het ChatGPT-advies en de Pokémon-code te kijken voor een zo levend mogelijke wereld.
Dit document is onderzoek en voorstel. **Er is niets in de code veranderd.** Vervolg op `CASTRA_OVERWORLD_ANALYSE.md`.

## 1. Wat de Pokémon-code laat zien (pret/pokeemerald, gelezen op 2026-10-24)

Bronnen: [field_player_avatar.c](https://github.com/pret/pokeemerald/blob/master/src/field_player_avatar.c), [event_object_movement.h](https://github.com/pret/pokeemerald/blob/master/include/constants/event_object_movement.h), [metatile_behaviors.h](https://github.com/pret/pokeemerald/blob/master/include/constants/metatile_behaviors.h), [field_effects.h](https://github.com/pret/pokeemerald/blob/master/include/constants/field_effects.h), [field_weather.c](https://github.com/pret/pokeemerald/blob/master/src/field_weather.c), [event_object_movement.c](https://github.com/pret/pokeemerald/blob/master/src/event_object_movement.c). Alles hieronder komt uit **uittreksels** van die bestanden (de webtool kapte lange bestanden af); wat ik niet kon zien is niet verzonnen maar weggelaten. Voor de ontwerpredenen steunt het op [Bulbapedia: Ledge](https://bulbapedia.bulbagarden.net/wiki/Ledge) (via zoekresultaat; de pagina zelf gaf een 403) en één [fananalyse van de eerste routes](https://fantendo.fandom.com/wiki/User_blog:Shadow_Inferno/A_short_analysis_of_the_first_Routes_in_Pokemon_Games_(Gen_I-IV)) (een mening, geen bron).

**Ledges.** Een ledge is geen aparte regel maar een *tegelgedrag*: `MB_JUMP_EAST/WEST/NORTH/SOUTH` en vier diagonalen. Het lopen controleert eerst de botsing (`CheckForPlayerAvatarCollision` → `CheckForObjectEventCollision`), en `ShouldJumpLedge()` vraagt `GetLedgeJumpDirection(x, y, richting)`. Is die richting gelijk aan de richting waarin je loopt, dan volgt `COLLISION_LEDGE_JUMP`: geluid, sprongaanimatie (`PlayerJumpLedge`) en je landt twee tegels verder. De ledgecontrole staat vóór het duwen van rotsen en wordt níet tegengehouden door een hoogteverschil: daarom werkt een ledge ook tussen twee niveaus. Je kunt er nooit tegenin omhoog.
**Ontwerprol** (Bulbapedia): eenrichtingsobstakels die je laten terugspringen naar eerdere gebieden zonder dat latere gebieden te vroeg open gaan; voorwerpen op of bij ledges sturen je langs langere, verborgen paden; Route 5 heeft een echte keuze (via de ledges omlaag of eromheen). Fananalyse: zigzag-routes met ledges in elke bocht laten een route langer voelen zonder hem langer te maken.
**Rotsen:** `COLLISION_OBJECT_EVENT` valt na de ledgecontrole in `TryPushBoulder()` als Strength actief is; anders is het gewoon een obstakel.

**Bewoners.** `event_object_movement.h` kent ±80 bewegingstypen in families: stilstaan, rondkijken (`LOOK_AROUND`), *willekeurig dwalen* (`WANDER_AROUND` en gerichte varianten op/neer, links/rechts) **met een bereik** (`movementRangeX/Y` rond de beginplek), vaste kijkrichting, ronddraaien, heen-en-weer lopen, vaste looppatronen van vier stappen, de speler nadoen (`COPY_PLAYER`), en lopen of joggen ter plekke. Er zijn drie pauzetabellen (32-128 ticks). Er is een schuilend type: `TREE_DISGUISE` en `MOUNTAIN_DISGUISE` (een "boom" of "rots" die een wezen is) en `BERRY_TREE_GROWTH` (planten die in echte tijd groeien). Objecten worden alleen geladen binnen een rechthoek rond de camera (x ±2 tegels, y 0..+2) en verdwijnen erbuiten (`TrySpawnObjectEvents`, `RemoveObjectEventIfOutsideView`): er zijn er maar een beperkt aantal tegelijk.

**Veldeffecten** (`field_effects.h`): grassprong en grasritseling (kort, hoog en lang gras), rimpels en spatten in water, zandvoetstappen (en diepe zand), stof, as, zandzuilen, schaduwen onder objecten, reflecties in water, glinsteringen (`SPARKLE`), bubbels en stoom bij warme bronnen. Ze maken de wereld niet inhoudelijk anders maar laten hem *reageren* op elke stap.

**Terrein** (`metatile_behaviors.h`): hoog, lang en kort gras, as, zand en diep zand, voetafdrukken, ijs (dun, gebarsten), water in soorten (diep, vijver, ondiep, plas, waterval, warme bron), stromingen (oost, west, noord, zuid), glij- en looptegels (gedwongen beweging), gebarsten vloer, bruggen op meerdere hoogten, modderige en hobbelige hellingen, "niet rennen". Elke tegel dus een gedrag dat de regels van het lopen verandert.

**Weer** (`field_weather.c`): 15 weertypen (zon met wolken, zon, regen, stortbui, onweer, sneeuw, mist horizontaal en diagonaal, vulkaanas, zandstorm, schaduw, droogte, onderwater, bubbels). Weer wordt gezet door een map- of tegelgebeurtenis (`SetFieldWeather`), wisselt via een taak met fade (`SetNextWeather`), en werkt vooral via kleurtabellen (palet verdonkeren, contrast bij onweer, droogte als pulserend palet) en regengeluid.

## 2. Wat het ChatGPT-advies hierover zegt

(`Aanvullend_Dossier_Pokemon_Overworld_Claude_Code.docx` en het gesprek, §6 en §7.) Een wereld die verandert door voortgang (NPC's, tegels, scripts) maar *geen volledige simulatie*: "een beperkt aantal duidelijke wereldtoestanden kan al veel effect hebben". Gesprekken die veranderen na een voltooide opdracht, een stad die beschadigd en hersteld wordt, trainerzichtlijnen, optionele zijpaden en shortcuts, wederkerende gebeurtenissen (tijd/weekdag). Dat is in ronde 1-3 bijna allemaal gebouwd. Het advies noemt geen weer, geluid of dierenleven: dat komt uit de Pokémon-code zelf.

## 3. Hoe levend is onze wereld nu?

Al aanwezig: rondlopende bewoners per dag (`castra-wanderers.js`), dag/nacht met kleurlaag en meer mythische wezens 's nachts, trainers die je zien en naar je toe lopen, verborgen vondsten met glimmertjes, wereldtoestanden na missies, marktdag met kramen, veldacties en poorten, paard en boten, animatie van de avatar, het "!" en "?" boven mensen.
**Wat ontbreekt:**

| Gebied | Pokémon heeft | Wij hebben |
|---|---|---|
| Landschap | ledges, hellingen, hoogteniveaus, stromingen, bruggen op meerdere hoogten, smalle paden | platte vlakken met een kruis van wegen, zones als rechthoeken; alleen water met bruggen en een bomenrand |
| Rotsen | duwbare rotsen (Strength), gebarsten vloer | alleen vaste, niet te bewegen rotsen (en de veldactie *saxum*, die ze breekt) |
| Bewoners | ±80 bewegingstypen: rondkijken, heen-en-weer, draaien | bewoners dwalen rond hun plek; alle andere personen staan stil |
| Wezens | schuilende wezens (boom, rots), plantjes die groeien | wezens verschijnen alleen via een onzichtbare kans in het gras |
| Reactie op je stap | gras ritselt, water rimpelt, zandvoetstappen, stof, schaduw, reflectie | de avatar loopt; de omgeving doet niets |
| Weer | 15 soorten, per kaart | geen |
| Geluid | wind, regen, voetstappen, sprong, muziek per kaart | helemaal geen geluid in Castra (`castra-*.js` heeft geen audio) |
| Gezelschap | in Yellow en HeartGold/SoulSilver loopt je eerste Pokémon achter je aan | je soldaten verdwijnen als je op pad gaat |
| Dag en nacht | gebeurtenissen en personen per dagdeel | een kleurlaag en andere vijanden; de personen blijven dezelfde |

## 4. Voorstellen

Omvang: S = ≤ 1 sessie, M = 1-3, L = meerdere.

**L1. Bergpaden: ledges, kliffen en rotsen (M-L).** Wat Gerben interessant vindt, en wat het meeste afwisseling geeft. De vier `mons`-zones zijn de plekken (Graecia 2,2 24×12; Persis 2,2 22×17; Laconia 6,2 22×17; Themiscyra 36,2 22×17); nu rechthoeken hoog gras.
- *Terrasbergen:* een berggebied krijgt platforms met kliffen (solide rotswand), een of twee **smalle paden** (2 tegels breed, met bochten) en 1-3 **ledges**. Een ledge is een tegel in de rotsrand waar je van boven af overheen springt en twee tegels lager landt (zoals `MB_JUMP_SOUTH`); je kunt er niet tegenin klimmen. Eerst vier richtingen (noord, zuid, oost, west); diagonalen (Pokémon heeft ze ook) laten we liggen.
- *Gebruik als in Pokémon:* een **shortcut terug** naar het begin van de berg zonder het lange pad, **vondsten bovenop** een terras (een kist of verborgen voorwerp) die je alleen bereikt via een omweg of een ledge, een **echte keuze** (omlaag springen of het pad volgen), en zigzagpaden die de berg langer laten voelen zonder hem groter te maken.
- *Rotsen:* **schuifbare rotsen** (een hopliet of spartaan in je leger, zoals bij de veldactie *saxum*): je duwt ze één tegel; ze vullen een kuil, blokkeren een pad of maken een shortcut vrij. Ze zijn niet in elke kaart nodig; één of twee puzzels per berg.
- *Techniek en veiligheid:* een ledge is eenrichtingsverkeer, dus de wereldtest (`tools/castra-world-test.js`) moet met een **gerichte graaf** rekenen: elke vondst en elke deur moet bereikbaar zijn, en je mag nergens vast komen te zitten (elke ledge-landing moet weer een weg terug hebben). Dat staat al in het dossier ("tests voor gates, herhaalbare interacties en softlocks"). De rots mag niet in een hoek geduwd kunnen worden die het pad voorgoed afsluit: een "reset" door de kaart te verlaten.
- *Uiterlijk:* onze tilesets (`Outside_A1/A5/B`) hebben geen klif-tegels. Twee opties: (a) de klifwand zelf tekenen op het canvas uit bestaande steentegels met schaduw en een lichte rand (geen nieuwe assets, ruwer), of (b) jij levert RPG Maker MV `Outside_A4` (wanden) mee, dan kan het er veel mooier uitzien. Mijn advies: eerst (a), later eventueel (b).

**L2. Veldeffecten: de omgeving reageert op je stap (S-M).** Gras ritselt bij elke stap in hoog gras (korte animatie), rimpels bij water, zandvoetstappen die vervagen, een stofwolkje bij een sprong, schaduwen onder bomen en NPC's, glinsterende water, wapperende vlaggen en een rookpluim bij het kamp, fladderende vlinders en vogels (kleine lagen), vuurvliegjes 's nachts. Alles lichte overlays op het canvas; geen assets nodig. De wereld voelt er direct levend van, en de ledgesprong (L1) krijgt een stofwolkje.

**L3. Bewoners met gedrag (S-M).** Naast het huidige dwalen: *rondkijken* (draait af en toe), *heen-en-weer lopen* (een wachter op patrouille), *ronddraaien*, en 's nachts andere dingen: boeren gaan "naar huis" (verdwijnen), wachters met een fakkel, uilen. Per bewonerstype een bewegingstype in de tabel (`CASTRA_AMB_TYPES`), met een bereik zoals Pokémon. Dit is data, weinig code.

**L4. Volger: je eerste soldaat loopt achter je (M).** Zoals in Pokémon Yellow en HeartGold/SoulSilver. Eerste soldaat uit je contubernium loopt één tegel achter je aan (de top-down TD-sprites `td_up/down/side` bestaan al voor veel vormen); tikken geeft een Latijnse opmerking en zijn HP-balkje. Past bij het Contubernium en maakt de HP-balk zichtbaar op de kaart.

**L5. Schuilende wezens en groeiende dingen, op zijn mythologisch (M).** De Pokémon-types `TREE_DISGUISE` en `MOUNTAIN_DISGUISE` (een boom of rots die een wezen is) en `BERRY_TREE_GROWTH` (planten die groeien) hebben een mythisch equivalent: een **Dryas in een boom** (een boom die je blokkeert tot je een Latijnse vraag goed hebt of ze verslaat), een **gigas als rots** in de bergen, en **horti**: olijfboom, wijnrank en graanveld die in echte tijd groeien en je dagelijks voorwerpen geven (olijf voor de lampen, druif voor de posca, honing voor het mulsum). Dat koppelt aan de saccus uit ronde 2.

**L6. Weer (M, optioneel, was W10).** Per land per dag (seed uit regio en datum): Germania regen en mist, Aegyptus en Africa zandstorm en hitte, Graecia en Laconia helder, bergen wind en later sneeuw op de hoogste terrassen. Uitvoering als bij Pokémon: een kleurlaag plus deeltjes (canvas), een kleine speleffect (regen: aqua-aanvallen +10%, zandstorm: nauwkeurigheid −1 voor lucht), en een meldingschip. Eerst alleen visueel.

**L7. Geluid (M, apart te beslissen).** Nu is Castra stil. Met WebAudio (zonder bestanden) kunnen stappen op gras en zand, de sprong, water, wind en een marktgeroezemoes worden gemaakt, met een aan/uit-knop. Muziek per land vraagt bestanden; de Chronica-tracks (`assets/chronica/music`) staan er al: moeten die hier mogen? Dat is jouw keuze (rechten en passendheid).

**L8. Kleine dingen die veel doen (S).** Een tegelgedrag-tabel naar het model van `metatile_behaviors.h` (zand: voetstappen, modder: langzamer, glad: glijden, stroming: duwt je) zodat landschap per tegel andere regels heeft (en de wereldtest die kent); een objectlimiet en cullen buiten beeld zodat een drukke kaart niet traag wordt (Pokémon laadt alleen rond de camera).

## 5. Aanbevolen volgorde

> **Stand (2026-10-24):** L1 (proef in Graecia), L2 en de kleine geluiden van L7 zijn gebouwd, zie `CASTRA_HEROUM.md`. Muziek laat Gerben zelf maken (Suno). Open: L3 tot en met L6, L8 en bergen in de andere landen.

1. **L1 Bergpaden** in één land als proef (Graecia of Laconia): terras, pad, ledge, shortcut, vondst bovenop; wereldtest met gerichte graaf. Daarna uitrollen naar Persis en Themiscyra.
2. **L2 Veldeffecten** (kleinste inspanning, grootste indruk) en meteen de ledgesprong erin.
3. **L4 Volger** (laat het contubernium zien).
4. **L3 Bewoners met gedrag**, daarna **L5** (Dryas, gigas, horti).
5. **L6 Weer** en **L7 Geluid** zodra je er iets over beslist hebt.

## 6. Beslissingen van Gerben

1. Akkoord met L1 als eerste, met één proefland (welk: Graecia of Laconia)?
2. Klifwand: eerst zelf tekenen uit bestaande tegels (mijn advies), of lever je zelf `Outside_A4`-tegels mee?
3. Volger (L4): ja?
4. Geluid (L7): alleen kleine synth-geluiden, of ook muziek (zo ja welke tracks)?
5. Welke van L5, L6 en L8 wil je zeker, welke mag later?
