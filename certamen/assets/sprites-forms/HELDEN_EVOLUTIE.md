# Helden-evolutie: wat er aan afbeeldingen bij komt (voor het beeldgesprek)

Stand 2026-12-20. Bron voor de gamedesign: `CASTRA_HEROUM.md` (sectie "Evolutie van helden") en `certamen/castra-heroevo.js`.
**Alleen Ulixes is volledig uitgewerkt en gebouwd (pilot).** De keuzes voor de andere 14 helden hieronder zijn door Gerben bevestigd; de afbeeldingen mogen zo ontworpen worden. De code volgt nog.

## Hoe de evolutie werkt (kort)
- Een held is een soort legendarische soldaat: zelfde stats en moves als een soldaat, maar uniek.
- **Gradus 25:** de held vraagt om een gesprek; zijn persoonlijke quest levert een voorwerp op. Daarmee kiest de speler **één van twee specialisaties** (definitief): een nieuwe klasse, andere stats en een ander uiterlijk.
- **Gradus 40:** een tweede quest, afhankelijk van de gekozen specialisatie, geeft het prestigevoorwerp (Ambrosia). Daarmee wordt de held een **prestigevorm**: sterkere stats, een rijker uiterlijk en een unieke legendarische arte.
- Dus per held 5 vormen: **basis, 2 specialisaties, 2 prestigevormen** (elke prestigevorm hoort bij één specialisatie).
- In het spel verschijnt het nieuwe uiterlijk nu via de avatar-lagen; met eigen afbeeldingen per vorm vervangen die dat later (zelfde bestandsconventie als de soldaatvormen).

## Vorm-id's en bestandsnamen
- Basis: `hero_<naam>` (bijvoorbeeld `hero_ulixes`).
- Specialisatie: `hero_<naam>_<spec>` (bijvoorbeeld `hero_ulixes_sag`, `hero_ulixes_ins`).
- Prestige: `hero_<naam>_<spec>_pr` (bijvoorbeeld `hero_ulixes_sag_pr`).
- Per vorm dezelfde bladen als bij de soldaatvormen: `[id]_A.png` (zes tower defence-frames), `[id]_B.png` (portret, battle voor, battle achter) en `[id]_P.png` (los portret). Het snijscript is hetzelfde (`castra-sprites-slice.py`).

## Hoeveel afbeeldingen
| Vormen | Aantal vormen | Per vorm | Totaal |
|---|---|---|---|
| Basisheld (15, al gepland) | 15 | P + A + B = 3 | 45 |
| Specialisaties (2 per held) | 30 | P + A + B = 3 | 90 |
| Prestigevormen (2 per held) | 30 | P + A + B = 3 | 90 |
| **Totaal volledig** | **75** | | **225** |

Zuinigere varianten: zonder los portret (P) voor de evolutievormen (het portret in blad B volstaat) is het 45 + 60 + 60 = **165**; alleen A en B overal: **150**.
Aanbevolen volgorde: eerst Ulixes (de pilot, code staat klaar: 4 evolutievormen), dan de basisheld en zijn twee specialisaties per held; de prestigevormen zijn pas zichtbaar vanaf gradus 40 en kunnen het laatst.

## Ontwerpregels voor evolutievormen
- Zelfde persoon: gezicht, huid, haar en (bijna alle) kenmerken van de basisheld blijven; upload het portret van de basisheld als referentie bij elke evolutievorm.
- **Specialisatie:** andere uitrusting en wapen die bij de nieuwe klasse passen (een boogschutter krijgt een boog, een verkenner lichte kleding en een kap, een voorvechter zwaar pantser), de volkskleur van de held blijft aanwezig.
- **Prestige:** rijker en indrukwekkender dan de specialisatie: gouden details, een mooiere cape, een glans of aura; nog steeds herkenbaar als dezelfde held.
- Alles volgens de vaste technische afspraken (pixel-art, magenta achtergrond, blad A met zes poses, blad B met portret en battle voor en achter).

## Pilot: Ulixes (gebouwd)
Basis: olijf huid, kort bruin haar, baard, robe met korte groene cape en standaard helm.
- **Sagittarius** (boogschutter): middelzwaar harnas, lange groene cape, open helm, boog. Prestige **Arcitenens**: ceremonieel harnas, gouden cape; legendarische arte *Sagitta Apollinis*.
- **Insidiator** (verkenner, sluiper): middelzwaar harnas, lange paarse cape, bandana in plaats van helm, dolk of korte boog. Prestige **Callidus**: ceremonieel harnas, paarse cape; legendarische arte *Insidiae Ulixis*.

## Overige 14 helden: door Gerben gekozen (2026-10-22), nog niet in de code
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
| Hector | Defensor Troiae (hopliet, verdediger) | Murus Troiae (de muur van Troje) | Dux Troianus (centurio, bevelvoerder) | Princeps Troianorum (prins van Troje, purper) |
| Penthesilea | Bipennifera (spartaan, dubbele bijl) | Regina Amazonum (koningin der Amazones) | Amazon Equestris (cavalerie, paard en boog) | Martis Filia (dochter van Mars) |
| *Ulixes (gebouwd)* | Sagittarius → Arcitenens | | Insidiator → Callidus | |
