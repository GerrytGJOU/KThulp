# Chronica Classica — COMBAT-sprites: generatielijst

> **Bijgewerkt 2026-08-24 (avond): alle 28 compleet.** De laatste vijf
> (`nijlkrokodillen`, `proscriptie_sluipmoordenaars`, `agrippas_vloot`,
> `antonius_vloot`, `visigoten`) zijn aangeleverd en live geverifieerd (elk
> bestand laadt, geen 404's). Dit bestand blijft staan als referentie-Gem en
> als startpunt voor een toekomstig nieuw COMBAT-gevecht.

**Status: 28 van de 28 compleet.** Alle 16 oorspronkelijke entries, `fin_lethe`
(Hoofdstuk 30/Finale) en de 11 historische vijanden uit Hoofdstuk 18-27
hebben nu een bestaand, correct ladend sprite-bestand in
`certamen/assets/chronica/combat/` (zie het README daar) — allemaal in
`SP_COMBAT_ENEMIES` (`certamen/singleplayer-data.js`).

## Alle 16 sprites
| Bestand | Herkomst |
|---|---|
| `nemeische_leeuw.png` | eigen Gemini-Gem-tekening |
| `hydra.png` + `hydrahead1..7.png` | gedupliceerd uit assets/bosses/ (ook Boss Battle) |
| `cerberus.png` | eigen Gemini-Gem-tekening |
| `minotaurus.png` | eigen Gemini-Gem-tekening |
| `centauren.png`, `kretenzische_stier.png`, `merries_van_diomedes.png`, `amazones.png`, `geryon.png` | eigen Gemini-Gem-tekening (Hoofdstuk 3) |
| `amycus.png`, `drakon_vlies.png` | eigen Gemini-Gem-tekening (Hoofdstuk 5) |
| `laodamas.png` | eigen Gemini-Gem-tekening (Hoofdstuk 6) |
| `trojaanse_voorhoede.png`, `hektor.png` | eigen Gemini-Gem-tekening (Hoofdstuk 8) |
| `trojaanse_wachters.png` | eigen Gemini-Gem-tekening (Hoofdstuk 9) |
| `vrijers_ithaka.png` | eigen Gemini-Gem-tekening (Hoofdstuk 12) |

## Nieuw COMBAT-gevecht toevoegen (toekomst)
1. Entry toevoegen aan `SP_COMBAT_ENEMIES` (`certamen/singleplayer-data.js`)
   met een `img`-pad naar `assets/chronica/combat/<naam>.png`.
2. Sprite genereren met de Gem hieronder, bestand met exact die naam in de
   map plaatsen.

## De Gemini-Gem (custom instructie voor de sprite-generator)

Alle 16 sprites zijn hiermee gegenereerd en zien er goed uit: scherp, correct
transparant (geen witte doos rond de figuur), stijl consistent over alle
bestanden. Geen aanpassing nodig.

Enige kanttekening: de Gem negeert de "ongeveer 400×400"-instructie en
levert 1024×1024 of 1408×768 — geen probleem, dat rendert prima (het spel
toont ze op 260×260 via `object-fit:contain`) en is zelfs scherper. Niets aan
veranderen.

```
Je bent een expert 2D Game Artist en visueel ontwerper, gespecialiseerd in het bedenken en genereren van 'boss' sprites voor een game over de Griekse mythologie.

WAARDE EN ROL:
Wanneer de gebruiker jou een naam, wezen, held of groep uit de Griekse mythologie geeft (zoals "Hektor", "Cerberus", "De Vrijers van Penelope"), doe jij direct het volgende:
1. Mythologische Context: Analyseer wie/wat dit is en bepaal de uiterlijke kenmerken, houding, wapens en kleding.
2. Type bepalen: Bepaal of het gaat om een enkel monster, een mythologische held/mens, of een compacte GROEP mensen/wezens.
3. Beeldgeneratie: Genereer direct een kwalitatieve 2D-game-sprite op basis van de onderstaande strikte stijlregels.

STRIKTE VISUELE STIJLREGELS:
- Type: 2D HD cel-shaded game sprite van een boss.
- Achtergrond: Volledig geïsoleerd op een strakke, schone witte achtergrond met enkel een zachte, diffuse slagschaduw direct onder de voeten/basis.
- Lijnen en Kleur: Scherpe, strakke outlines (cel-shading). Gebruik een rijk, zeer verzadigd kleurenpalet met hoog contrast en levendige accentkleuren (bijv. dieppaars, goud, bloedrood, brons).
- Pose: Dynamische, gevechtsklare houding (battle-ready stance) in een driekwart (3/4) perspectief richting de speler. Sterke, indrukwekkende en dreigende uitstraling.
- Textuur en Details: Zeer gedetailleerd gerenderde texturen (spierdefinitie, schubben, vacht, geëtst brons/harnas, geweven tweekleurige tunica's).
- Leesbaarheid: het silhouet moet ook op kleine schaal (het beeld wordt in-game op ca. 140×140 pixels getoond) direct herkenbaar blijven — vermijd details die alleen op volle grootte leesbaar zijn.

HOE OM TE GAAN MET GROEPEN (bijv. "De Vrijers van Penelope"):
- Maak van een groep één geclusterde, gecombineerde boss-sprite.
- Zet de personages dicht bij elkaar in een overlappende, dynamische formatie.
- Geef de figuren binnen de groep variatie in wapens, kleding en gezichtsuitdrukkingen (bijv. arrogante grijnzen, getrokken zwaarden, speren) om er één krachtige 'groeps-boss' van te maken.

OUTPUT FORMAT:
- Genereer altijd direct de afbeelding op basis van deze eisen. Als de gebruiker alleen een naam noemt, bedenk jij zelf de beste visuele uitwerking. Baseer dit op authentieke Griekse of Romeinse bronnen, niet op moderne games of bewerkingen.
- De resolutie van de afbeelding is een vierkant canvas van minimaal 512 bij 512 pixels.
- Geen watermerk of tekst door de afbeelding, zodat deze in-game gebruikt kan worden.
```


---

## Nieuw, nog te genereren (11 sprites, Hoofdstuk 18-27 — 2026-08-23)

Alle elf met dezelfde Gem hierboven te maken. De Gem is op Griekse mythologie
ingesteld; deze elf zijn historisch in plaats van mythologisch, dus geef de
korte beschrijving uit de derde kolom mee in plaats van alleen de naam. Bestand
opslaan onder exact de naam uit kolom 1, in `certamen/assets/chronica/combat/`.

| Bestand | Vijand (`SP_COMBAT_ENEMIES`) | Prompt om aan de Gem te geven |
|---|---|---|
| ~~`naxos_afgescheidenen.png`~~ **KLAAR** | De Afgescheiden Naxiërs (H18, Grieks) | Een compacte groep Griekse eilandhoplieten uit de vijfde eeuw v.Chr., in een gesloten schildmuur voor een stadspoort: ronde hoplitenschilden, bronzen korinthische helmen, korte speren. Geen rijk uitgedoste keurtroepen — gewone eilandbewoners die hun eigen polis verdedigen tegen een vloot die hen ooit kwam beschermen. |
| ~~`senaatsknokploeg.png`~~ **KLAAR** | De Knuppelploeg van Nasica (H18, Latijn) | Een groep Romeinse senatoren in toga’s, 133 v.Chr., met afgebroken houten bankpoten als knuppels in de hand. Geen wapenrusting, geen zwaarden — juist het contrast tussen de deftige toga en het ruwe stuk hout maakt het dreigend. Woedende, vastberaden gezichten. |
| ~~`korinthische_triere.png`~~ **KLAAR** | De Korinthische Trireme (H19, Grieks) | Een Korinthische oorlogstrireme uit de vijfde eeuw v.Chr., schuin van voren gezien: bronzen ram op de waterlijn, geschilderd oog op de boeg, drie rijen riemen, bemanning aan dek met speren. Het schip zelf is de tegenstander, dreigend en groot in beeld. |
| ~~`parthische_boogschutters.png`~~ **KLAAR** | De Parthische Boogschutters (H19, Latijn) | Drie Parthische bereden boogschutters, eerste eeuw v.Chr., in het beroemde “Parthische schot”: paarden in volle galop van de kijker weg, ruiters in het zadel omgedraaid en achterwaarts schietend. Schubbenharnas, puntmutsen, samengestelde bogen, opstuivend woestijnstof. |
| ~~`perzische_onsterfelijken.png`~~ **KLAAR** | De Onsterfelijken van Darius (H20, Grieks) | Een geclusterde groep Perzische Onsterfelijken, keurtroepen van Darius III: rijk versierde lange gewaden, gevlochten baarden, tiara’s, rieten spara-schilden, speren met een gouden appel als tegengewicht. Goud- en purperaccenten, gesloten formatie, de rij lijkt zich achter hen eindeloos voort te zetten. |
| ~~`gallische_ontzettingsmacht.png`~~ **KLAAR** | Het Gallische Ontzettingsleger (H20, Latijn) | Een compacte groep Gallische krijgers, 52 v.Chr. bij Alesia: lange zwaarden, ovale beschilderde schilden, kalkstijve haren, torques om de hals, één krijger met een carnyx-oorlogshoorn met een everskop erop. Aanstormend, vanaf een aarden wal naar beneden. |
| ~~`nijlkrokodillen.png`~~ **KLAAR** | De Krokodillen van de Nijl (H22, Grieks) | Drie grote Nijlkrokodillen in troebel bruin rivierwater, half onder de oppervlakte, ogen en ruggenschilden net zichtbaar; één exemplaar op de voorgrond met opengesperde muil. Rondom drijvend wrakhout en Macedonisch wapentuig. Geen mensen in beeld. |
| ~~`proscriptie_sluipmoordenaars.png`~~ **KLAAR** | De Premiejagers van de Dodenlijst (H22, Latijn) | Drie gewone Romeinse burgers, 43 v.Chr., als premiejagers: eenvoudige tunica’s en mantels met de kap op, korte dolken en één kort zwaard, één met een opgerolde naamlijst in de hand. Nadrukkelijk geen soldaten — buurmannen, met een berekenende blik. Nachtelijke steeg. |
| ~~`agrippas_vloot.png`~~ **KLAAR** | Agrippa’s Blokkade (H23, Grieks) | Twee lichte, wendbare Romeinse liburnen in linie, 31 v.Chr. bij Actium, gezien vanaf een vijandelijk dek: lage romp, snelle riemslag, harpax-enterhaken klaar aan de boeg, brandpijlen op de bogen. Discipline en geduld uitstralend in plaats van woede. |
| ~~`antonius_vloot.png`~~ **KLAAR** | Antonius’ Zware Schepen (H23, Latijn) | Een enkel zwaar Hellenistisch oorlogsschip, 31 v.Chr. bij Actium: hoge boorden, zware bronzen ram, houten gevechtstorens op het dek met boogschutters erin, purperen zeilen half gestreken. Imposant en tegelijk log — te zwaar voor de zee waarop het vandaag beslist wordt. |
| ~~`visigoten.png`~~ **KLAAR** | De Visigoten in de Pas (H27, Latijn) | Drie Visigotische krijgers, begin vijfde eeuw n.Chr., hoog op een besneeuwde bergpas: lange strijdbijlen en speren, ronde schilden, wollen mantels met een fibula, deels Romeins buitgemaakt harnas. Geen “barbaren-karikatuur” — goed uitgeruste, gedisciplineerde mannen die al twee generaties binnen de rijksgrenzen wonen. |

Alle elf klaar (2026-08-24) — de lijst is weer volledig: 28 van de 28 COMBAT-sprites compleet.
