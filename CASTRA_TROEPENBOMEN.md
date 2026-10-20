# Castra Heroum — troepenbomen per volk (151 vormen)

Wijzigingsverzoek van Gerben, 2026-10-20 · status: **voorstel, nog niets gebouwd** · hoort bij `CASTRA_HEROUM.md`.
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

## 7. Voorstel mijlpalen en open punten

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
