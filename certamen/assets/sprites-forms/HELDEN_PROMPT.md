# Opdracht voor het beeldgesprek: heldenevolutie (Castra Heroum)

Stand 2026-10-23. Plak het blok onder "Prompt" in het gesprek dat de afbeeldingen maakt, of laat dat gesprek dit bestand en `HELDEN_EVOLUTIE.md` (zelfde map) lezen.
`HELDEN_EVOLUTIE.md` bevat de volledige tabel met alle 17 helden, hun specialisaties en prestigevormen (door Gerben gekozen en in de code gebouwd, `certamen/castra-heroevo-all.js`).

## Prompt

```
Nieuw onderdeel voor de afbeeldingen van Castra Heroum: de evolutie van de 17 helden.

Een held is een legendarische soldaat met eigen verhaal. Op gradus 25 kiest de speler één van twee specialisaties (definitief), op gradus 40 wordt de held een prestigevorm. Per held zijn er dus 5 vormen: basis, specialisatie A, specialisatie B, prestige A en prestige B. Prestige A hoort bij specialisatie A, prestige B bij specialisatie B. Ulixes heeft drie takken (7 vormen). In totaal 87 vormen.

Lees eerst de map certamen/assets/sprites-forms/ in de repository, met name HELDEN_EVOLUTIE.md (alle vormen met naam, klasse en beschrijving) en de bestaande afspraken voor de soldaatvormen (PROMPT_GENERATOR.md, BRON_VORMEN.md).

Wat je per vorm maakt (zelfde als bij de soldaatvormen):
- blad A: zes tower defence-frames (3x2, 1536x1024)
- blad B: portret, battle voor en battle achter (1536x512)
- een los portret P
Dat is 3 afbeeldingen per vorm, 261 in totaal. Met alleen A en B is het 174.

Bestandsnamen:
- basis: hero_<naam>_A.png en hero_<naam>_B.png
- specialisatie: hero_<naam>_<spec>_A.png en _B.png
- prestige: hero_<naam>_<spec>_pr_A.png en _B.png
De spec-codes staan in HELDEN_EVOLUTIE.md en in castra-heroevo-all.js (bijvoorbeeld dux, pro, rex, bel, cus, pug, eq, exp, ins, for, sag, eqs, ath, eqa, ven, vic, cur, dra, arg, myr, aur, def, bip, pat, sac, mac, vol). Ulixes: sag, ins en mac. Medea en Daedalus zijn de nieuwe helden (Medea: priesteres met staf en robe, Daedalus: bouwer met hamer, later vleugels van was).

Ontwerpregels:
- Het is dezelfde persoon: gezicht, huid, haar en baard blijven gelijk. Gebruik het portret van de basisheld als referentie bij elke evolutievorm.
- Een specialisatie heeft andere uitrusting en wapen die bij de klasse passen (boogschutter: boog; verkenner: lichte kleding en kap; voorvechter: zwaar pantser en wapen; bevelvoerder: ceremonieel pantser en cape; ruiter: middelzwaar pantser). De volkskleur van de held blijft zichtbaar.
- Een prestigevorm is rijker dan de specialisatie (gouden details, mooiere cape, een glans of aura) maar blijft herkenbaar.
- Technisch blijft alles gelijk: 16-bit JRPG pixel-art, effen magenta achtergrond (#FF00FF), loop opzij naar rechts.

Volgorde:
1. Ulixes (de pilot): basis, Sagittarius, Insidiator en Machinator. Laat de afbeeldingen zien en wacht op mijn akkoord.
2. Per held eerst de basis en de twee specialisaties, dan de twee prestigevormen.
Doe niet alle helden achter elkaar zonder tussentijds akkoord.
```

## Wat het beeldgesprek ook mag weten
- De basisvormen van de 17 helden bestaan al als avatar (lagen); de bladen A en B ervan vervangen die later.
- Elke held heeft in het spel een eigen verhaal-arte vanaf het begin (bijvoorbeeld Pietas bij Aeneas, Dolus bij Ulixes); dat vraagt geen extra afbeelding.
- Of de code de bestanden gebruikt, regelt het andere gesprek niet: leg de gesneden sprites in `certamen/assets/sprites-forms/` en meld het; het inpassen in het spel gebeurt in het bouwgesprek.
