# Chronica Classica — COMBAT-sprites: generatielijst

Bron van waarheid voor welke tegenstander-sprites nog gegenereerd moeten
worden voor de COMBAT-gevechten in Chronica Classica (Single Player Mode).
Sprites komen in `certamen/assets/chronica/combat/` (zie het README daar),
niet in `certamen/assets/bosses/` (dat is voor Boss Battle). Bestandsnaam
moet exact overeenkomen met het `img`-veld van de betreffende entry in
`SP_COMBAT_ENEMIES` (`certamen/singleplayer-data.js`) — GitHub Pages hostt
hoofdlettergevoelig.

## Al aanwezig
| Bestand | Herkomst |
|---|---|
| `nemeische_leeuw.png` | eigen Gemini-Gem-tekening |
| `hydra.png` + `hydrahead1..7.png` | gedupliceerd uit assets/bosses/ (ook Boss Battle) |
| `cerberus.png` | eigen Gemini-Gem-tekening |
| `minotaurus.png` | eigen Gemini-Gem-tekening |
| `centauren.png`, `kretenzische_stier.png`, `merries_van_diomedes.png`, `amazones.png`, `geryon.png` | eigen Gemini-Gem-tekening (Hoofdstuk 3) |
| `amycus.png`, `drakon_vlies.png` | eigen Gemini-Gem-tekening (Hoofdstuk 5) |
| `laodamas.png` | eigen Gemini-Gem-tekening (Hoofdstuk 6) |
| `hektor.png` | eigen Gemini-Gem-tekening (Hoofdstuk 8) |
| `vrijers_ithaka.png` | eigen Gemini-Gem-tekening (Hoofdstuk 12) |

## Nog te genereren (2 sprites)

### Hoofdstuk 8 — De Wrok van Achilles
| Bestand | Naam in-game | Context voor de Gem |
|---|---|---|
| `trojaanse_voorhoede.png` | De Trojaanse Voorhoede | Trojaanse strijders bij de Griekse schepen met fakkels in de hand. **Groep.** |

### Hoofdstuk 9 — Ilion in Vlammen
| Bestand | Naam in-game | Context voor de Gem |
|---|---|---|
| `trojaanse_wachters.png` | De Laatste Wachters van Troje | Handvol dronken, half-wakkere verdedigers bij de poort, de nacht dat Troje valt. **Groep.** |

## De Gemini-Gem (custom instructie voor de sprite-generator)

De eerste 14 sprites zijn hiermee gegenereerd en zien er goed uit: scherp,
correct transparant (geen witte doos rond de figuur), stijl consistent over
alle bestanden. Geen aanpassing nodig — gebruik dezelfde Gem voor de laatste 2.

Enige kanttekening: de Gem negeert de "ongeveer 400×400"-instructie en
levert 1024×1024 of 1408×768 — geen probleem, dat rendert prima (het spel
toont ze op 140×140 via `object-fit:contain`) en is zelfs scherper. Niets aan
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
