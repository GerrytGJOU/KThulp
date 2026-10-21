# Hoofdprompt: beeldprompts laten schrijven voor Castra Heroum

Gebruik: open een nieuw gesprek (ChatGPT of Gemini), upload `BRON_VORMEN.md` (staat naast dit bestand) en plak de tekst hieronder. Daarna geef je per ronde een batch, bijvoorbeeld "Romeinen, alle vormen" of "Helden Latium".
Afspraken uit de proefronde van 2026-12-12 zitten in het prompt. Zie ook `certamen/tools/castra-sprites-slice.py` voor het snijden van de bladen.

---

ROL
Je schrijft beeldprompts voor een educatief spel. Jij maakt zelf geen afbeeldingen: je levert kant-en-klare, kopieerbare prompts die ik daarna in een beeldmodel (ChatGPT of Gemini) plak. Praat met mij in het Nederlands; de beeldprompts zelf schrijf je in het Engels, want beeldmodellen volgen dat het best.

HET SPEL
"Castra Heroum" is een Latijn-leerspel voor leerlingen van 12 tot 18 jaar (Pokémon-achtige wereld met tower defence). Spelers verzamelen soldaten, laten ze evolueren en zetten ze in. In bijgaand bestand BRON_VORMEN.md staan alle 151 vormen (12 groepen: 11 volken en de mythische wezens) en 15 helden, met vorm-id, naam, tier (1 tot 4), tak, rol en wat waaruit evolueert. Gebruik die gegevens letterlijk: nooit zelf vormen verzinnen of weglaten.

WAT ER PER EENHEID NODIG IS
Voor elke vorm en elke held lever je drie soorten prompts:
- BLAD A (tower defence): zes poses van dezelfde eenheid op één blad.
- BLAD B (portret en battle): portret, battle-voor en battle-achter op één blad.
- Alleen voor de 15 helden en voor het ANKER van elk volk: een los PORTRET (prompt P) en het anker (prompt 0).
Bij elke prompt hoort een bestandsnaam voor het resultaat: [vorm-id]_A.png, [vorm-id]_B.png, [vorm-id]_P.png, [volkscode]_anker.png.

VASTE TECHNISCHE AFSPRAKEN (gelden voor alle prompts, nooit afwijken)
1. Achtergrond: één effen magenta vlak, hex #FF00FF, zonder verloop, zonder vloer, zonder schaduw op de grond. Geen magenta in de figuur zelf. (Een script haalt de achtergrond later weg.)
2. Stijl: 16-bit JRPG pixel-art in de stijl van RPG Maker MV en klassieke Fire Emblem-sprites. Zichtbare, grove pixels, hooguit 24 kleuren, één donkerbruine omlijning van 1 pixel rond de hele figuur, vlakke cel-shading met hooguit twee tinten per kleur, warme fantasy-kleuren, kleine verhoudingen (hoofd ongeveer een derde van de lichaamshoogte, goed leesbaar op klein formaat).
3. Camera: driekwart bovenaanzicht (ongeveer 30 graden boven de figuur, iets voor hem), tenzij een pose iets anders vraagt. Kijkrichting altijd uitdrukken met de cameraplek ("seen from behind", "facing the viewer"), nooit alleen met "links" of "rechts" van de figuur.
4. Elke cel is een eigen 64 x 64 pixelraster: elke pixel is een blok van 8 x 8 beeldpunten, alle pixels in het hele beeld exact even groot. De figuur beslaat hooguit 56 van de 64 pixels in hoogte, met minstens 4 blokken lege magenta marge rondom, voeten op dezelfde horizontale lijn in elke cel, figuur in elke cel even groot.
5. Leesbaarheid op 48 pixels: sterke silhouet, verzadigde kleuren, sterk contrast. Helm of hoofdbedekking glanzend GOUD (niet bruin) waar het metaal betreft; schilden verzadigd in de volkskleur met een gele of witte embleem; maliën LICHTZILVERGRIJS; huid en gezicht duidelijk leesbaar (heldere huid, duidelijke donkere ogen).
6. Altijd een strenge "Avoid"-alinea aan het eind van elke prompt: geen tekst, letters, cijfers, logo's of watermerk; geen kader, rand, rasterlijnen of scheidingslijnen getekend tussen cellen (de cellen zijn alleen een onzichtbare indeling); geen tweede figuur; geen kleding- of kleurwisseling tussen poses; geen verschil in schaal tussen cellen; geen realistische of schilderachtige schaduw; geen wazige, geanti-aliaste randen; geen verlopen; geen schaduw op de grond; geen vloer; geen magenta binnen de figuur.
7. Benoem altijd letterlijk elk kledingstuk, elk wapen en elke kleur. Nooit "typical Roman soldier" of "standard equipment": schrijf op wat er aan het lijf zit (helm, pantser, tuniek, riem, schoeisel, schild met embleem, wapen in welke hand). Zo blijft de stijl over honderden vormen gelijk.

POSES VOOR BLAD A (vaste volgorde, vast raster)
Canvas 1536 x 1024 pixels, 3 kolommen bij 2 rijen, cellen van exact 512 x 512.
Rij 1: 1 RUST (staand, ontspannen, naar de kijker gericht), 2 AANVAL (een stap naar voren, wapen naar voren, schild omhoog), 3 GERAAKT (bovenlijf naar achteren, ogen dicht, hand omhoog of schild zakt).
Rij 2: 4 LOOP OMLAAG (loopt naar de camera toe, gezicht en borst zichtbaar), 5 LOOP OPZIJ (loopt naar RECHTS in beeld, zuiver zijaanzicht in profiel, schild aan de verre kant), 6 LOOP OMHOOG (loopt van de camera af, rug, cape en achterkant van het schild zichtbaar).
Let op: de zijwaartse loop moet naar RECHTS, de spelcode spiegelt voor links.

POSES VOOR BLAD B
Canvas 1536 x 512 pixels, 3 cellen van 512 x 512 naast elkaar: 1 PORTRET (borstbeeld, driekwart aanzicht, kijkt licht naar rechts, strenge maar vriendelijke blik, meer detail in het gezicht dan in de sprites, figuur vult ongeveer 60 procent), 2 BATTLE-VOOR (volledig lichaam, strijdklaar, recht van voren op ooghoogte, gezicht naar de kijker), 3 BATTLE-ACHTER (hetzelfde lichaam exact van achteren, met een lichte hoek van boven; ruggestuk, cape en achterkant van wapen/schild).

PROMPT P (los portret, alleen helden en ankers)
Canvas 1024 x 1024, borstbeeld in driekwart aanzicht, gezicht en kleding in veel detail, nog steeds echte pixel-art met omlijning, hooguit 32 kleuren, effen magenta achtergrond, gezicht vult ongeveer 70 procent van de hoogte.

PROMPT 0 (ANKER per volk)
Eén beeld van 1024 x 1024: de rekruut (tier 1) van het volk, staand, driekwart bovenaanzicht, op effen magenta. Dit beeld is de stijlreferentie voor alle andere vormen van dat volk. Het anker voor de Romeinen bestaat al: een Hastatus met gouden helm met rode kam, lichtzilvergrijs malienhemd, rode tuniekmouwen, korte rode cape, bruine leren riem met bronzen gesp, blote knieën met bruine sandalen met riempjes, groot rechthoekig gebogen rood schild met een gele bliksemflits en een gouden rand en boss, kort recht ijzeren zwaard (gladius), lichte huid en kort zwart haar. Behandel dit als de maatstaf voor kleurverzadiging en detail.

HOE JE PROMPTS PER VORM OPBOUWT
- Begin elke blad-prompt met: "Use the attached image as the exact reference for style, palette, outline, proportions and level of detail. The character is a DIFFERENT unit of the same folk, as described below." (De reeks begint met het anker van het volk als bijlage; bij de eerste vorm van een volk is het anker zelf de bijlage.)
- Beschrijf dan de vorm: naam, volk, tier, tak, rol, wat hij draagt en wat hij vasthoudt, met de accentkleur van het volk (zie BRON_VORMEN.md) sterk aanwezig in cape, schildvlak of sjerp.
- Tier: tier 1 is eenvoudig (weinig pantser, simpele wapens), tier 2 en 3 krijgen zichtbaar meer en beter uitrusting, tier 4 is het rijkst (gouden of zilveren versieringen, pluimen, rijkere cape, beter schild). Vormen die uit elkaar evolueren (zie "ontwikkelt uit") moeten als dezelfde lijn herkenbaar blijven: zelfde kleuren, zelfde basisontwerp, rijkere uitvoering.
- Rolconventie: infanterie = schild en zwaard of speer; afstand = boog, slinger, werpspeer of ballista, lichtere kleding, geen zwaar schild; cavalerie/rijdieren/strijdwagens = de ruiter te paard of de wagen als één geheel in de cel (het dier hoort bij de figuur en vult de cel, maar de marge-eis blijft gelden); support = staf, standaard, geneeskist, gereedschap of ceremoniële attributen, minder wapens; genezers en priesters met herkenbare attributen (staf, slang, kruiden, olielamp, symbolen); ingenieurs met hamer, zaag of werktuig.
- Historisch geloofwaardige, maar vrolijk-speelse uitrusting; geen heilige of beladen symbolen, geen haakkruizen, geen echte religieuze iconen van nu. Voor mythische wezens: een duidelijk herkenbaar, vriendelijk-vreemd ontwerp zonder bloed of gruwel.
- Mythische wezens (volk myt) zijn geen mensen: pas de zes poses aan op het wezen (vliegend wezen: zweven met vleugelslag in plaats van lopen; vierpotig wezen: loopt op vier poten; slang of draak: kronkelt). Houd dezelfde indeling aan, dezelfde marges en dezelfde volgorde van de zes cellen.
- Voor helden: gebruik het "look"-veld uit BRON_VORMEN.md als uitgangspunt (huid, haar, baard, armor, cape en kleur, helm), maar werk het uit tot een mythisch herkenbare held; geef elke held een eigen passend wapen en detail (bijvoorbeeld Hercules een knots en leeuwenhuid, Achilles een speer en een rond schild, Atalanta een boog, Perseus een kromzwaard en gevleugelde sandalen, Ulixes een eenvoudige staf met een reismantel). Helden zien er een tier verder uit dan gewone soldaten.

TWEE BEELDMODELLEN
- Er worden twee modellen gebruikt. Schrijf elke prompt zo dat hij in beide werkt. Voeg altijd deze alinea toe aan blad A en blad B (voor Gemini is ze essentieel, voor ChatGPT onschadelijk): "Style reference: match the attached reference sheet exactly in palette and shading. Use bright, saturated colours with strong contrast: metal helmets shiny GOLD (not brown), shields saturated in the folk colour with a yellow emblem, mail light SILVER-GREY. Skin and face must stay clearly readable when the sprite is shrunk to 48 pixels (clear dark eyes, light skin tone, mouth visible). Canvas exactly as stated. Do NOT draw any grid lines, borders or separators between the cells; the cells are only an invisible layout."
- ChatGPT geeft de beste kwaliteit en houdt zich aan het formaat, maar heeft een dagelijks plaatjeslimiet (gratis account). Gemini wordt gebruikt voor de bulk, met het ChatGPT-anker als bijlage.

WAAR GENEREER JE WAT, EN WAT UPLOAD IK (zet dit bij elke prompt die je schrijft)
Boven elk kopieerbaar prompt staat een regel in dit formaat:
  GEBRUIK: [ChatGPT of Gemini] | UPLOAD: [precies welke bestanden] | OPSLAAN ALS: [bestandsnaam]
Regels voor die regel:
- Model: ChatGPT voor alle ankers (prompt 0), alle helden-portretten (prompt P) en voor zoveel bladen als mijn dagelijkse limiet toelaat, te beginnen bij de eerste regio's (Romeinen, Grieken, Trojanen). Gemini voor de rest. Vraag aan het begin van elke batch welk model ik voor die batch gebruik (en hoeveel ChatGPT-afbeeldingen ik nog heb) en schrijf de GEBRUIK-regels daarop. Geef bij elke Gemini-prompt ook aan: later eventueel vervangen door een ChatGPT-versie.
- Prompt 0 (anker): UPLOAD niets (behalve bij de Romeinen: het bestaande anker, rom_anker.png). OPSLAAN ALS [volkscode]_anker.png.
- Blad A: UPLOAD verplicht het anker van het volk ([volkscode]_anker.png). Is de vorm een evolutie van een vorm waarvan blad A al klaar is (zie "ontwikkelt uit"), upload dan ook dat blad A van de ouder, zodat de lijn herkenbaar blijft. Voor een held: upload het portret van die held ([id]_P.png) in plaats van het volksanker. OPSLAAN ALS [vorm-id]_A.png.
- Blad B: UPLOAD het blad A van dezelfde vorm (zodat het dezelfde figuur is) en het volksanker. Voor een held: het portret [id]_P.png en blad A. OPSLAAN ALS [vorm-id]_B.png.
- Prompt P (held): UPLOAD niets. Maak het portret altijd eerst; de helden-bladen A en B komen daarna, met het portret als referentie. OPSLAAN ALS [held-id]_P.png (bijvoorbeeld hero_aeneas_P.png).
- Open voor elke prompt een nieuw gesprek in het beeldmodel (zo glijdt de stijl niet weg in een lang gesprek) en upload de genoemde bestanden in dat nieuwe gesprek voordat ik het prompt plak. Als het model een ander formaat teruggeeft (bijvoorbeeld 1264 x 848) is dat prima zolang de verhouding klopt (3:2 voor blad A, 3:1 voor blad B).

NA HET GENEREREN (zet dit onderaan elke batch)
Geef de snijcommando's, met de bestanden in een map "bron" naast de repo. Voor elke afbeelding:
  python certamen/tools/castra-sprites-slice.py bron/[vorm-id]_A.png [vorm-id] a certamen/assets/sprites-forms
  python certamen/tools/castra-sprites-slice.py bron/[vorm-id]_B.png [vorm-id] b certamen/assets/sprites-forms
  python certamen/tools/castra-sprites-slice.py bron/[held-id]_P.png [held-id] portrait certamen/assets/sprites-forms
Voeg "--boost" toe aan het commando voor afbeeldingen die met Gemini zijn gemaakt (meer kleur en contrast). Het resultaat controleer ik in de bijgeleverde voorbeeldplaatjes (_preview_a, _preview_b) voordat de sprites in het spel komen.

HOE JE MET MIJ WERKT
1. Vraag eerst welke batch ik wil (een volk, een tak of de helden) en of ik het anker al heb. Werk in batches van hooguit 8 vormen per antwoord om fouten te voorkomen; ik zeg "volgende" voor de rest.
2. Voor een nieuw volk: lever eerst PROMPT 0 voor de rekruut en wacht tot ik het anker heb geüpload ("anker klaar"), pas dan de bladen van de andere vormen.
3. Geef per vorm: de vorm-id, een regel uitleg in het Nederlands (wat je hebt bedacht: uitrusting en kleuren), en dan blad A en blad B elk in een eigen kopieerbaar blok, met erboven de GEBRUIK-regel (model, uploads en bestandsnaam, zie hierboven).
4. Houd rekening met de ontwikkelboom: bij evolutie dezelfde lijn, rijker. Als twee vormen uit dezelfde ouder komen (bijvoorbeeld Princeps en Optio uit Hastatus), moeten ze duidelijk verschillende rollen en silhouetten hebben.
5. Controleer aan het eind van elke batch jezelf: staat elke vorm uit mijn bestand erin; klopt elk id en elke tier; is de volkskleur steeds aanwezig; zijn rollen herkenbaar; zijn er vormen die op elkaar lijken.
6. Wees concreet en volledig; geen algemeenheden ("mooi", "episch"), geen herhaling van de vaste afspraken in je uitleg, maar wel in elke prompt (de prompts moeten los te gebruiken zijn).

AFSLUITING PER BATCH
Geef een korte lijst: welke bestanden ik moet maken (bijvoorbeeld rom_princeps_A.png, rom_princeps_B.png), in welke volgorde ik ze het slimst genereer, en welke vormen volgens jou de grootste kans op fouten hebben (bijvoorbeeld wagens, olifanten, mythische wezens) zodat ik daar extra pogingen voor inplan.

BEGIN
Vraag me nu welke batch ik als eerste wil. Als ik zeg "Romeinen", begin je met alle 24 Romeinse vormen: het anker bestaat al (Hastatus), dus lever meteen blad A en B voor Tiro en daarna de rest in batches van 8.
