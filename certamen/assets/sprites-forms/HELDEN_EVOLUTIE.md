# Helden-evolutie: wat er aan afbeeldingen bij komt (voor het beeldgesprek)

Stand 2026-10-22. Bron voor de gamedesign: `CASTRA_HEROUM.md` (sectie "Evolutie van helden") en `certamen/castra-heroevo.js`.
**Alle 17 helden zijn nu uitgewerkt en gebouwd (Ulixes was de pilot; Medea en Daedalus zijn later toegevoegd om priester, genie en myth te dekken).** De keuzes voor de andere 14 helden hieronder zijn door Gerben bevestigd; de afbeeldingen mogen zo ontworpen worden. De evoluties staan in de code (`certamen/castra-heroevo-all.js`).

## Hoe de evolutie werkt (kort)
- Een held is een soort legendarische soldaat: zelfde stats en moves als een soldaat, maar uniek.
- **Gradus 25:** de held vraagt om een gesprek; zijn persoonlijke quest levert een voorwerp op. Daarmee kiest de speler **één van twee specialisaties** (definitief): een nieuwe klasse, andere stats en een ander uiterlijk.
- **Gradus 40:** een tweede quest, afhankelijk van de gekozen specialisatie, geeft het prestigevoorwerp (Ambrosia). Daarmee wordt de held een **prestigevorm**: sterkere stats, een rijker uiterlijk en een unieke legendarische arte.
- Dus per held 5 vormen: **basis, 2 specialisaties, 2 prestigevormen** (elke prestigevorm hoort bij één specialisatie). Uitzondering: **Ulixes heeft drie takken** (Sagittarius, Insidiator, Machinator), dus 7 vormen.
- In het spel verschijnt het nieuwe uiterlijk nu via de avatar-lagen; met eigen afbeeldingen per vorm vervangen die dat later (zelfde bestandsconventie als de soldaatvormen).

## Vorm-id's en bestandsnamen
- Basis: `hero_<naam>` (bijvoorbeeld `hero_ulixes`).
- Specialisatie: `hero_<naam>_<spec>` (bijvoorbeeld `hero_ulixes_sag`, `hero_ulixes_ins`).
- Prestige: `hero_<naam>_<spec>_pr` (bijvoorbeeld `hero_ulixes_sag_pr`).
- Per vorm dezelfde bladen als bij de soldaatvormen: `[id]_A.png` (zes tower defence-frames), `[id]_B.png` (portret, battle voor, battle achter) en `[id]_P.png` (los portret). Het snijscript is hetzelfde (`castra-sprites-slice.py`).

## Hoeveel afbeeldingen
| Vormen | Aantal vormen | Per vorm | Totaal |
|---|---|---|---|
| Basisheld (17) | 17 | P + A + B = 3 | 51 |
| Specialisaties (35: 2 per held, Ulixes 3) | 35 | P + A + B = 3 | 105 |
| Prestigevormen (35) | 35 | P + A + B = 3 | 105 |
| **Totaal volledig** | **87** | | **261** |

Zuinigere varianten: zonder los portret (P) voor de evolutievormen is het 51 + 70 + 70 = **191**; alleen A en B overal: **174**.
Aanbevolen volgorde: eerst Ulixes (de pilot, code staat klaar: 6 evolutievormen), dan de basisheld en zijn specialisaties per held; de prestigevormen zijn pas zichtbaar vanaf gradus 40 en kunnen het laatst.

## Ontwerpregels voor evolutievormen
- Zelfde persoon: gezicht, huid, haar en (bijna alle) kenmerken van de basisheld blijven; upload het portret van de basisheld als referentie bij elke evolutievorm.
- **Specialisatie:** andere uitrusting en wapen die bij de nieuwe klasse passen (een boogschutter krijgt een boog, een verkenner lichte kleding en een kap, een voorvechter zwaar pantser), de volkskleur van de held blijft aanwezig.
- **Prestige:** rijker en indrukwekkender dan de specialisatie: gouden details, een mooiere cape, een glans of aura; nog steeds herkenbaar als dezelfde held.
- Alles volgens de vaste technische afspraken (pixel-art, magenta achtergrond, blad A met zes poses, blad B met portret en battle voor en achter).

## Pilot: Ulixes (gebouwd)
Basis: olijf huid, kort bruin haar, baard, robe met korte groene cape en standaard helm.
- **Sagittarius** (boogschutter): middelzwaar harnas, lange groene cape, open helm, boog. Prestige **Arcitenens**: ceremonieel harnas, gouden cape; legendarische arte *Sagitta Apollinis*.
- **Insidiator** (verkenner, sluiper): middelzwaar harnas, lange paarse cape, bandana in plaats van helm, dolk of korte boog. Prestige **Callidus**: ceremonieel harnas, paarse cape; legendarische arte *Insidiae Ulixis*.
- **Machinator** (genie, werktuigbouwer, spec-code `mac`): middelzwaar harnas, lange oranje cape, open helm, hamer of knuppel. Prestige **Architectus Equi**: ceremonieel harnas, oranje cape; legendarische arte *Equus Troianus* (het Trojaanse paard).

## Overige helden: door Gerben gekozen en gebouwd (2026-10-22, aangevuld 2026-10-23)
Klasse tussen haakjes: hopliet (zware infanterie), spartaan (voorvechter), boogschutter, cavalerie, centurio (bevelvoerder), verkenner (sluiper), priester (genezer).

| Held | Specialisatie A | Prestige A | Specialisatie B | Prestige B |
|---|---|---|---|---|
| Aeneas | Dux Troianus (centurio, bevelvoerder) | Conditor (stichter, gouden harnas) | Propugnator (hopliet, schild) | Pius (de plichtsgetrouwe, glanzend schild) |
| Romulus | Rex (centurio, kroon van laurier) | Quirinus (vergoddelijkt, wit en goud) | Bellator (spartaan, zware slag) | Martis filius (zoon van Mars, rood en brons) |
| Horatius Cocles | Custos Pontis (hopliet, brugwachter) | Servator Urbis (redder van de stad) | Pugnator (spartaan, tweehandig) | Heros Tiberis (held van de Tiber) |
| Cloelia | Equitissa (cavalerie, ruiter) | Domina Equitum (meesteres der ruiters) | Explorata (verkenner, zwemster en verkenster) | Virgo Fortissima (de dapperste maagd) |
| Mucius Scaevola | Insidiator (verkenner, sluipmoordenaar) | Sicarius (meester-sluiper, donker) | Fortis (spartaan, de brandende hand) | Dextra Ignea (de vurige hand, vlammen) |
| Camilla | Sagittaria (boogschutter) | Virgo Volsca (Volscische maagd, boog en pijlkoker) | Equestris (cavalerie, boog te paard) | Regina Camillarum (koningin der strijdsters) |
| Hercules | Athleta (spartaan, knots en leeuwenhuid) | Alcides (halfgod, gouden leeuwenhuid) | Sagittarius Herculis (boogschutter, Hydra-pijlen) | Deus (apotheose, stralend) |
| Perseus | Eques Alatus (cavalerie, gevleugelde sandalen) | Gorgonicida (Medusa-overwinnaar, schild met Medusa) | Venator Monstrorum (verkenner, spiegelschild) | Medusae Victor (Perseus de glorieuze) |
| Theseus | Victor Labyrinthi (hopliet) | Minotauri Victor (met hoornhelm als trofee) | Rex Atheniensis (centurio, koning van Athene) | Rex Athenarum (kroon en purperen mantel) |
| Atalanta | Sagittaria (boogschutter) | Venatrix Dianae (jageres van Diana) | Cursor (verkenner, de snelle loopster) | Velocissima (lichte gouden sandalen) |
| Iason | Draconis Victor (hopliet, drakendoder) | Aurei Velleris Dominus (heer van het gouden vlies) | Argonauta (centurio, bevelvoerder van de Argo) | Dux Argonautarum (leider der Argonauten) |
| Achilles | Heros Myrmidonum (spartaan) | Pelides (zoon van Peleus, gouden pantser) | Auriga Heros (cavalerie, strijdwagen) | Invictus (onoverwinnelijk, enige zwakke hiel) |
| Hector | Defensor Troiae (hopliet, verdediger) | Murus Troiae (de muur van Troje) | Pater Familias (priester, `pat`, gezinshoofd; robe en open helm) | Princeps Troianorum (prins van Troje, purper, kroon) |
| Penthesilea | Bipennifera (spartaan, dubbele bijl) | Regina Amazonum (koningin der Amazones) | Amazon Equestris (cavalerie, paard en boog) | Martis Filia (dochter van Mars) |
| *Ulixes (gebouwd, drie takken)* | Sagittarius → Arcitenens | | Insidiator → Callidus; Machinator (`mac`) → Architectus Equi | |
| *Medea (nieuw, Graecia)* | Sacerdos Hecates (priester, `sac`, robe, staf, paars) → Domina Hecates (goud) | | Venefica (myth, `ven`, robe, staf, groen) → Maga Colchica | |
| *Daedalus (nieuw, Graecia)* | Machinator (genie, `mac`, licht harnas, oranje cape, hamer) → Architectus Labyrinthi | | Volator (cavalerie, `vol`, vleugels van was, goud) → Dominus Aeris | |
