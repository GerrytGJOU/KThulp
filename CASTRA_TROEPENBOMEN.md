# Castra Heroum — troepenbomen per volk (151 vormen)

Wijzigingsverzoek van Gerben, 2026-10-20 · status: **M1–M3 gebouwd (M3: 2026-10-31), wacht op goedkeuring voor M4** · hoort bij `CASTRA_HEROUM.md`.
Dit document is de bron van waarheid voor de troepenbomen; het vervangt de huidige losse evolutielijnen (`CASTRA_LINES` in `certamen/castra-data.js`). De 15 helden (`CASTRA_HERO_DATA`) blijven ongewijzigd.

## 1. Idee en regels

Mount & Blade-stijl: elk volk heeft één **rekruut** (tier 1); bij de eerste evolutie **kies je een tak** (infanterie, afstand, ruiterij, …), daarna evolueert de soldaat verder, soms met nog een keuze. Een Trojaanse rekruut wordt nooit een Romeinse triarius.

- **Tiers:** rekruut = 1, eerste tak = 2, daarboven 3 en 4 (niet elke tak heeft vier tiers). **Keuze is definitief.**
- **Voorwaarden:** XP (rekruten weinig, hogere tiers steeds meer; vechten levert veel meer op dan bijtrainen), het juiste *campus*-niveau, grondstoffen, en gebouwen: ruiterij, strijdwagens en olifanten vragen *stabula*; de vloot vraagt *navalia*.
- **Advies in het Latijn:** de trainer in de campus adviseert op basis van de IV's, bv. *"Hic tiro celer est; bonus sagittarius fiet."*
- **Typevoordelen** per rol: infanterie > ruiterij > afstand > infanterie. Strijdwagens en olifanten tellen als ruiterij. Rekruten, ondersteuners en mythische wezens: geen typevoordeel.
- **Wild:** kans per tier ≈ 60% (1) / 28% (2) / 10% (3) / 2% (4, alleen in latere regio's of speciale gebieden); het volk hangt af van de regio, af en toe een zeldzame vreemdeling; gevonden hogere tiers krijgen een passend level, willekeurige IV's en karakter. Mythische wezens: eerste vorm algemeen, latere zeldzaam. Kansen zijn een startpunt, bijstellen na een klastest.
- **Unieke wezens** (Minotaurus, Medusa, Cerberus, Scylla) zijn geen verzamelbare vormen maar bazen.

## 2. Volken, regio's en aantallen

| Volk | Rekruut | Regio | Vormen |
| --- | --- | --- | --- |
| Romeinen | Tiro | Latium | 24 |
| Grieken | Ephebus | Graecia | 12 |
| Spartanen | Puer Laco | Laconia (deel van Graecia) | 6 |
| Trojanen | Tiro Troianus | Troia | 12 |
| Gladiatoren | Novicius | Roma (rond de ludus) | 10 |
| Galliërs | Iuvenis Gallus | Gallia | 9 |
| Germanen | Iuvenis Germanus | Germania | 8 |
| Egyptenaren | Iuvenis Aegyptius | Aegyptus | 10 |
| Perzen | Iuvenis Persa | Persis | 11 |
| Carthagers | Iuvenis Poenus | Africa (Carthago) | 10 |
| Amazones | Virgo Amazon | Themiscyra | 5 |
| Mythische wezens | geen rekruut | verspreid; schimmen in de Onderwereld | 34 |
| **Totaal** | | | **151** |

(Telling nagerekend op de bomen hieronder: 24 + 12 + 6 + 12 + 10 + 9 + 8 + 10 + 11 + 10 + 5 + 34 = 151.) Nieuwe regio's (Gallia, Germania, Aegyptus, Persis, Africa, Themiscyra, Roma, Laconia) volgen gefaseerd; tot dan verschijnen die volken als zeldzame vreemdelingen in bestaande regio's. Tijdperken worden bewust gemengd (spelkeuze, geen historische claim). Namen zijn een voorstel, door Gerben te controleren.

## 3. De bomen

Een lege cel = de tak stopt. "(keuze)" = de speler kiest.

**Romeinen (24)** — *Tiro*
| Tak | Tier 2 | Tier 3 | Tier 4 |
| --- | --- | --- | --- |
| Infanterie | Hastatus | Princeps | Triarius |
| | | Optio | Centurio |
| | | Signifer | Aquilifer |
| Licht en afstand | Veles | Funditor | Sagittarius |
| | | Explorator | Speculator |
| Ruiterij (*stabula*) | Eques | Decurio | Praefectus alae |
| Technisch | Faber | Ballistarius | Architectus |
| | | Capsarius | Medicus |
| Vloot (*navalia*) | Remex | Classiarius | Navarchus |

**Grieken (12)** — *Ephebus*
| Tak | Tier 2 | Tier 3 | Tier 4 |
| --- | --- | --- | --- |
| Infanterie | Hoplites | Epilectus | Lochagus |
| Licht en afstand | Psilus | Peltasta | |
| | | Toxota | Toxota Cretensis |
| Ruiterij (*stabula*) | Hippeus | Prodromus | Hetairus |
| | | Hippotoxota | |

**Spartanen (6)** — *Puer Laco*: Spartiates → Trecentus → Polemarchus · Perioecus → Sciritas.

**Trojanen (12)** — *Tiro Troianus*: Hastifer → Propugnator → Custos Pergami (+ Custos portae op tier 3) · Sagittarius Troianus → Sagittarius Lycius · Auriga (*stabula*) → Bellator curru · Minister templi → Sacerdos Apollinis → Vates.

**Gladiatoren (10)** — *Novicius*: tier 2 zwaar = Murmillo / Secutor / Hoplomachus (keuze); tier 2 licht = Retiarius / Thraex / Dimachaerus (keuze); beide leiden naar **Primus palus** (één vorm, tier 3); Rudiarius (ondersteuning, tier 3, vanuit elke tier-2 gladiator); Essedarius (wagen, *stabula*, tier 2).

**Galliërs (9)** — *Iuvenis Gallus*: Gaesatus → Bellator Gallus → Soldurius · Eques Gallus (*stabula*) → Eques nobilis · Bardus → Druida → Summus druida.

**Germanen (8)** — *Iuvenis Germanus*: Frameatus → Centenus → Comes · Eques Germanus (*stabula*) → Batavus · Saga → Vates Germana.

**Egyptenaren (10)** — *Iuvenis Aegyptius*: Machimus → Satelles → Custos Pharaonis · Sagittarius Aegyptius → Sagittarius Nubius · Auriga Aegyptius (*stabula*) → Bellator curru Aegyptius · Scriba → Sacerdos Isidis.

**Perzen (11)** — *Iuvenis Persa*: Sparabara → Immortalis → Melophorus · Sagittarius Persa → Sagittarius Scytha · Eques Persa (*stabula*) → Cataphractus → Clibanarius · Magus → Archimagus.

**Carthagers (10)** — *Iuvenis Poenus*: Libyus → Veteranus Libyus → Miles sacer · Funditor Balearicus · Eques Numida (*stabula*) → Numida nobilis · Rector elephanti (*stabula*) → Elephantus bellicus → Elephantus turritus.

**Amazones (5)** — *Virgo Amazon*: Sagittaria → Sagittaria equestris · Peltasta Amazon → Securifera.

**Mythische wezens (34, geen rekruut)**: Satyrus → Silenus · Nympha → Dryas / Naias / Oreas / Nereis (keuze) · Pullus centauri → Centaurus → Centaurus sagittarius · Harpyia · Pullus grypis → Gryps · Siren · Cyclops pastor → Cyclops faber · Hippocampus · Umbra → Lemur → Larva (schimmen, Onderwereld) · Formica → Myrmido · Dens draconis → Spartus · Anguis → Serpens → Draco · Pullus alatus → Equus alatus · Phoenix · Lupus → Lupus Martius · Aquila → Aquila Iovis. Bij Myrmido (Aeacus), Spartus (Cadmus/Iason) en Lupus Martius (Romulus en Remus) komt een korte Latijnse mythesamenvatting in de codex.

## 4. Sprites per vorm (alle 151 + 15 helden)

Drie afbeeldingen per vorm (498 in totaal), gemaakt met ChatGPT volgens de stijlgids: **battle-voor** 96×96, **battle-achter** 96×96, **tower defence** 48×48 (driekwart bovenaanzicht, kleuraccent per volk). Bestandsnamen: `[vorm-id]_battle_front.png`, `[vorm-id]_battle_back.png`, `[vorm-id]_td.png`. Werkwijze: eerst battle-voor als referentie, dan de rest; per volk en tak werken; hogere tiers zichtbaar beter uitgerust; animatie in code. Claude houdt bij welke vormen nog sprites missen en gebruikt tot die tijd een placeholder (nu: de top-down avatar-lagen via `castraPLook`). Loopsprites komen apart uit de RPG Maker Character Generator.

## 5. Gevolgen voor de bestaande app (nagekeken in de code)

- **Data:** `CASTRA_LINES` (18 lijnen met `stages`/`branch`) wordt vervangen door een vormencatalogus (id, volk, tier, tak, rol, volgende vormen, vereiste gebouwen, Latijnse naam, codextekst). `castraStats`, `castraSoldierName`, `castraEvoInfo`/`castraEvolve` (castra-campus.js), `CASTRA_P_LOOK`, de spawntabellen in `CASTRA_VENATIO` (castra-latin.js) en de gewogen werving in de Dilectus (castra-medical.js) lezen die lijnen en moeten mee.
- **Soldaatobject:** nu `{line, stage, branch, lvl, xp, indoles, ingenium, insignis}`; wordt `{form, lvl, xp, indoles, ingenium, insignis}`. Ook trade-JSON (Commercium), Legio-acties (`line` in de actie) en lockstep-validatie gebruiken `line`.
- **Migratie (bestaande saves):** huidige lijn+stadium+tak → nieuwe vorm-id, met behoud van IV's, karakter, level en XP. Het voorstel uit het verzoek: Miles → Tiro; Tubicen → Signifer; oude gladiator-Tiro → Novicius; Optio, Centurio, Hippotoxota, Hetairus, Lochagus en alle overige vormen op hun nieuwe plek. De volledige tabel (18 lijnen × stadia) maak ik in M1 en leg ik voor.
- **Nieuwe gebouwen:** *Stabula* en *Navalia* bestaan nog niet (staan als `phase:9` in `CASTRA_BUILDINGS`); ze worden voorwaarden voor tak-keuze.
- **Codex:** nieuw scherm (boomweergave per volk, 151 vormen + 15 helden apart); het gebouw *Bibliotheca* bestaat nog niet.
- **Regio's:** `CASTRA_WORLDS` heeft Latium/Graecia/Troia; elk nieuw volk vraagt een eigen wereld, terreinen en missies (gefaseerd).
- **Latijn:** nieuwe vormnamen, adviesregels en mythesamenvattingen vragen veel glossarium-woorden (`CASTRA_GLOSS`).

## 6. Aansluiten op Certamen en KThulp

- **Klassen gelijktrekken:** elke rol in de bomen koppelen aan een van de Certamen-klassen (`BM_CLASSES`, `certamen/battle-data.js`), met hun namen en iconen, zodat leerlingen één systeem kennen. De mapping moet worden vastgelegd (zie §7).
- **iPad eerst:** plaatsen door te tikken (eenheid, dan plek), tikvlakken ≥ 44 px, Safari-veilig (nu al zo, behalve de tegels in het proelium op een telefoon).
- **Digibord bij de Legio:** gedeeld slagveld op het bord, leerlingen spelen op hun iPad (aansluiten op de geplande Certamen-slagveldweergave).
- **Eén spelersprofiel:** aanhaken op het geplande samengevoegde profiel (localStorage + Firebase-identiteit).
- **Werkwijze:** bouwen in mijlpalen met een stop na elke mijlpaal voor goedkeuring; `node --check` na elke JS-wijziging.
- **Huisstijl:** Nederlandse UI met speltekst in het Latijn, footer "© Gerben de Jong · 2026".

## 7a. Besluiten (Gerben, 2026-10-29) en wat M1 daarvan gemaakt heeft

| Punt | Besluit | In M1 |
| --- | --- | --- |
| 1 Kosten per evolutie | *Duurder* | tier 2: 50 frumentum + 25 aes · tier 3: 100 + 50 · tier 4: 200 + 100 (`CASTRA_EVO.cost`) |
| 2 Levels | "Meer zoals Pokémon: rond level 16, 32, 50, afhankelijk van type en tier" | evolueren bij level **16 / 32 / 50** (rekruut en infanterie), ruiterij 18/34/50, afstand 14/30/46, ondersteuning 14/28/44, mythisch 12/26/42 (`CASTRA_EVO.lvl`) |
| 2b Level-schaal | *Cap 10 × praetorium* | levelcap = 10 × praetorium-level (max 50); XP naar het volgende level = 3 × level (`castraXpToNext`); +2,5% stats per level; tier-vermenigvuldiger 1 / 1,6 / 2,4 / 3,2. Oude levels ×3,2 bij migratie (max 50). |
| 3 Stabula/Navalia | *Zichtbaar, niet kiesbaar* tot M2 | opties met `needs` tonen "Stabula deest" en zijn uitgeschakeld |
| 4 Certamen-klassen | *In M5* | nog niet gedaan |
| 5 Stijl | *Huidige stijl houden* | ongewijzigd (Palatino) |
| 6 Sprites | *Avatar-lagen per rol/volk* | `castraFormLook`: uiterlijk per volk, rol en tier uit bestaande top-down lagen |

**Gebouwd in M1** (`certamen/castra-troops.js`, aanpassingen in castra.js, castra-campus.js, castra-venatio.js, castra-medical.js, castra-proelium.js, castra-legio.js, castra-commercium.js, castra-latin.js):
- Vormencatalogus met alle **151 vormen** (volk, tier, tak, type, ouders, gebouweis; id ≤ 20 tekens voor de Legio-regels). Gecontroleerd: aantallen per volk kloppen met §2, elke vorm vanaf tier 2 heeft een ouder, *Primus palus* en *Rudiarius* hebben alle 6 tier-2-gladiatoren als ouder, *Nympha* heeft 4 keuzes. Een soldaat blijft `{line, lvl, xp, indoles, ingenium, insignis}`; `line` is nu het vorm-id.
- **Evolutiescherm** in de campus: bij voldoende level en campus-niveau toont elke soldaat het Latijnse advies van de trainer (*Hic tiro robustus est; bonus hastatus fiet.*, op basis van de beste aanleg) en per optie tak, rol en stats; de keuze is definitief en kost grondstoffen.
- **Migratie** van bestaande saves (eenmalig, `troopsV`): oude lijn + stadium + tak → nieuwe vorm. Miles → Tiro; Tubicen → Signifer; oude Tiro (arena) → Novicius; arena-keuze → Murmillo/Retiarius/Secutor; Optio, Centurio, Hippotoxota, Hetairus, Lochagus en de overige vormen ongewijzigd. IV's, karakter, insignis en uitrusting blijven; XP wordt 0; levels ×3,2. Ook ontvangen ruilsoldaten en cloud-saves worden gemigreerd.
- **Wild** (basis van M3): tier 60 / 28 / 10 / 2%, **maar begrensd door het praetorium-level** (tier 2 vanaf praetorium 2, tier 3 vanaf 4, tier 4 vanaf 5) zodat vroege spelers niet tegen veel te sterke wilde soldaten komen; volk uit de regio (Latium: 94% Romeinen, 4% Galliërs, 2% Germanen; Graecia en Troia met eigen mengsels), vorm gewogen op het terrein, mythische wezens per terrein; hogere tiers beginnen op hun evolutiedrempel (tier 2 vanaf 12–19, tier 3 28–36, tier 4 46–50). Gemeten verdeling (2000 trekkingen, praetorium 5): 61 / 28 / 9 / 2%.
- **Werving (Dilectus)** biedt rekruten van de geopende volken aan (Romeinen; Grieken en Spartanen vanaf Graecia; Trojanen vanaf Troia).
- **Missies en Legio** gebruiken nu vormen uit de bomen (tier en level groeien mee met de regio) en zijn opnieuw afgesteld met de gesimuleerde proef (`hpMult` m1 0,6 · m2 3,9 · m3 3,4 · g1 3,4 · g2 5,8 · t1 4,7 · t2 5,6 · Legio 4,5): winnen met ±4–6 levens bij de bedoelde opstelling, verliezen bij 70% van dat level, comfortabel winnen bij 130%.
- Uiterlijk van eenheden in het proelium en bij de NPC's: avatar-lagen volgens `castraFormLook` (volk, rol, tier).

**M2 — Stabula en Navalia (gebouwd 2026-10-30):**
- Twee nieuwe gebouwen op het kamp: *Stabula* (🐎, ontgrendelt ruiterij, strijdwagens en olifanten) en *Navalia* (⚓, ontgrendelt de vloot). Ze **starten op niveau 0 (nog te bouwen)**: een bouwplaats met kisten en blokken, bouwknop *Aedifica* (stabula 90 lignum + 60 aes, navalia 120 + 80; hogere niveaus volgen de gewone upgradekosten en blijven begrensd door het praetorium).
- **Gebouweis per tier:** een vorm van tier t vraagt het gebouw op niveau max(1, t−1): tier 2 stabula/navalia 1, tier 3 niveau 2, tier 4 niveau 3 (`castraNeedLvl`). In het evolutiescherm staat bij een geblokkeerde optie bv. "Stabula Gradus 2 deest". Het gebouwpaneel toont per niveau welke vormen het opent.
- Het kamp is **3 rijen hoger** (16×15 tegels; startplek (8,13); weg tot de onderste muur) om ruimte te maken; alle gebouwen blijven bereikbaar (gecontroleerd met de padzoeker).
- Getest: bouwen kost het juiste bedrag; Eques is vóór de stabula niet te kiezen en erna wel; Decurio vraagt stabula niveau 2 en bij level 34 + stabula 2 + campus 4 lukt de evolutie; bouwplaats blokkeert zijn voetafdruk; alle Latijnse teksten hebben een glossarium-entry.
- Niet gedaan: een extra bonus van het gebouwniveau op de stats (alleen de ontgrendeling), en navalia geeft nog geen toegang tot waterregio's.

**M3 (2026-10-31):** wildmengsels per regio met zeldzame vreemdelingen (Latium: 80% Romeinen, rest Gladiatoren/Galliërs/Germanen/Grieken/Carthagers/Egyptenaren/Perzen; Graecia 66% Grieken; Troia 72% Trojanen), tierplafond per regio (Latium/Graecia 3, Troia 4), vreemdelingen krijgen de melding *Hostis peregrinus est*. Dilectus werft per volk en tier: tier 2 vanaf Dilectus 3 + praetorium 2 (25%), tier 3 vanaf Dilectus 5 + praetorium 4 (10%), hogere tiers komen op hun evolutiedrempel-level, geen vlootvormen/stallen-vormen in het aanbod, kosten tier 1/2/3 = 40+20 / 100+50 / 200+100.

**Nog niet (volgende mijlpalen):** M4 codex, M5 Certamen-klassen, M6 sprites-pijplijn, M7 nieuwe regio's. Buiten dit verzoek: de **helden** zijn niet meegeschaald (vaste stats, cap level 20), waardoor ze op hoge soldatenlevels relatief zwakker worden; een mogelijke volgende afstemming.

## 7. Voorstel mijlpalen en open punten (oorspronkelijk)

| Mijlpaal | Inhoud | Stop voor goedkeuring |
| --- | --- | --- |
| **M1** Vormen en evolutie | Vormencatalogus (alle 151 als data, met rol, tier, tak, volgende, gebouweis, Latijnse naam), nieuwe stats per rol en tier, migratie van bestaande saves, evolutiescherm met keuze (rol, stats, advies van de trainer in het Latijn), campus-eisen per tier | ja |
| **M2** Stabula en Navalia | Twee nieuwe gebouwen (kaartplek, kunst, levels) als voorwaarde voor de ruiter-, wagen-, olifant- en vlootvormen | ja |
| **M3** Wild en werving | Spawntabellen per regio met tierkansen (60/28/10/2), zeldzame vreemdelingen, mythische wezens, Dilectus-aanbod per volk, passend level bij tier | ja |
| **M4** Codex | Scherm met de bomen per volk, 151 vormen + helden, mythesamenvattingen | ja |
| **M5** Certamen-klassen | Mapping rol → 8 klassen, namen en iconen uit Certamen | ja |
| **M6** Sprites-pijplijn | Bestandsnaamconventie, manifest van ontbrekende sprites, placeholders, battle-sprites in het beurtgevecht, tower defence-sprites | ja |
| **M7** Nieuwe regio's | Per volk een wereld (Roma/Laconia, Gallia, Germania, Aegyptus, Persis, Africa, Themiscyra) met terreinen, missies en vijanden | per regio |

Open punten (voor jou, vóór M1):
1. **Kosten per evolutie:** voorstel frumentum + aes, oplopend per tier (bijv. tier 2: 30+15, tier 3: 60+30, tier 4: 120+60). Akkoord of andere waarden?
2. **XP per tier** (voorstel: rekruut → tier 2 op level 3, → tier 3 op level 7, → tier 4 op level 12) en dat de huidige 4×praetorium-levelcap blijft gelden.
3. **Stabula/Navalia** pas in M2: tot dan zijn ruiterij-, wagen-, olifant- en vlootvormen in M1 wel zichtbaar maar niet te kiezen. Goed?
4. **Mapping naar de 8 Certamen-klassen** (hopliet, voorvechter, boogschutter, cavalerie, priester, bevelvoerder en twee andere) moet ik uit `battle-data.js` afleiden; voorstel in M5.
5. **Stijl:** de bestaande Castra-schermen volgen de huisstijl van Certamen (Palatino, goud op steen); in het verzoek staan Cinzel en EB Garamond. Wil je dat Castra overstapt, of blijft het bij de huidige stijl?
6. **Sprites:** tot er sprites zijn blijft het tower defence-uiterlijk een avatar-laagcombinatie per rol/volk; battle-sprites (voor/achter) worden pas in M6 gebruikt omdat het beurtgevecht nu zonder sprites werkt.
