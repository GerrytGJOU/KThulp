# Avatar Legends — regeldossier

Versie 0.1 — implementatieconcept. [ONTBREEKT] = niet beschikbaar; [ONZEKER] = nakijken. Voorbeelden zijn eigen voorbeelden, niet officiële pregens. Niet gemarkeerde basisregels zijn samengevat uit systeemkennis; niet alle details zijn tegen de volledige boeken gecontroleerd.

## Bronnen
Magpie Games, Avatar Legends: The Roleplaying Game Core Book (2022); https://magpiegames.com/products/quickstart-avatar-legends . Volledige boektekst niet geraadpleegd.

## 1. Identiteit

GM en companions creëren avonturen in Avatar-universum. Eras: Kyoshi, Roku, Hundred Year War, Aang, Korra. Narratieve problemen, persoonlijke groei, balance en gemeenschap; geen levels.

## 2. Kernmechaniek

Wanneer fiction een Move triggert, roll 2d6 + relevante stat. 10+ strong hit, 7–9 weak hit, 6− miss; specifieke Move bepaalt gevolgen. GM rolt normaal niet.

- `[worp: Assess a Situation: 2d6(4,5)+1 = 10, strong hit]`
- `[worp: Trick: 2d6(3,4)+0 = 7, weak hit]`
- `[worp: Rely on Skills and Training: 2d6(2,2)+1 = 5, miss]`

## 3. Kritieke uitkomsten

Geen natural criticals. 12+ kan bijzondere uitkomst geven bij specifieke moves [ONZEKER]. Miss leidt tot GM move en veranderde fictie, niet noodzakelijk simpel falen.

## 4. Personagegegevens

Creativity, Focus, Harmony, Passion. Startprofiel per playbook met één +1 keuze [ONZEKER]. Gebruikelijk startbereik −1 tot +2; stat advancements doorgaans max +3. Fatigue 0–5, vijf Conditions (afzonderlijke flags). Balance: twee principles op tegengestelde uiteinden van −3…+3, center start 0. Geen HP, AC of Mana. Exacte playbook startstats [ONTBREEKT].

## 5. Skills en vaardigheden

Geen skill percentages. Basic moves: Rely on Your Skills and Training (Focus), Push Your Luck (Passion), Assess a Situation (Creativity), Guide and Comfort (Harmony), Trick (Creativity), Intimidate (Passion), Plead (Harmony). Balance moves: Live Up to Your Principle, Call Someone Out, Resist Shifting Your Balance, Lose Your Balance, Deny a Callout [ONZEKER: naam/trigger]. Training: Air/Water/Earth/Firebending, Weapons, Technology; technique mastery Learned/Practiced/Mastered. Volledige triggers en resultaten [ONTBREEKT].

## 6. Personage maken

Kies era, groepsdoel, playbook, appearance, demeanor, background, training, stats, principles, moves, connections, fighting style/technique. Core playbooks: Adamant (vastberaden), Bold (erkenning), Guardian (bescherming), Hammer (kracht), Icon (erfenis), Idealist (idealen), Pillar (team), Prodigy (talent), Rogue (vrijheid), Successor (familie). Exacte playbook stats, principles, moves, keuzeaantallen en starting techniques [ONTBREEKT]. Geen standaard specieskeuze; mensen uit verschillende naties. Avatar niet standaard PC.

## 7. Uitrusting en economie

Gear voornamelijk fictieve toegang, niet een vaste damage/armor/price ladder. Wapens en bending technieken hebben specifieke effecten op fatigue, conditions, balance, positioning. Geen universele damage dice, ammo of gold. Exacte techniekcatalogus [ONTBREEKT].

## 8. Gevecht en conflict

Combat Exchange wanneer betekenisvol, niet voor ieder gevecht. Kies approach: Defend and Maneuver (Focus), Advance and Attack (Passion), Evade and Observe (Creativity/Harmony keuze [ONZEKER: standaard Harmony]). Resolutie in die volgorde; PCs roll stance move, NPCs kiezen technieken op basis van regels. 10+ één mastered, twee practiced of drie basic techniques; 7–9 één basic of mastered [ONZEKER: exacte stance opties]; miss gevolgen via move. Voorbeeld: PC kiest Advance and Attack, roll 2d6+Passion=10, gebruikt basic Strike (effect en kosten per kaart); NPC Defend and Maneuver resolveert eerder. Geen D&D initiative of HP damage. Exacte technique effecten en NPC quota [ONTBREEKT].

## 9. Specialistische subsystemen

Fatigue betalen voor technieken en moves; bij onvoldoende ruimte conditions markeren waar regel dit toestaat. Balance verschuift door fiction en moves; buiten track Lose Your Balance, speler kiest gevolgen uit move. Center verandert via groei en balance loss. Conditions beïnvloeden moves; herstel via fiction-specifieke acties en Guide and Comfort. Training/mastery vereist leraren, tijd en beproeving; exacte procedure [ONTBREEKT].

## 10. Vooruitgang

Growth aan sessie-einde via vragen en playbook triggers; bij vier Growth markeringen advancement [ONZEKER]. Advancements: nieuwe moves, stat increases, balance-ontwikkeling, playbook switch volgens sheet. Geen XP per monster.

## 11. Conditions en statuseffecten

Afraid, Angry, Guilty, Insecure, Troubled: elk −2 op specifieke moves; exacte mapping en clearing acties [ONTBREEKT]. Combat statuses o.a. Empowered, Favored, Inspired, Prepared, Doomed, Impaired, Trapped, Stunned [ONZEKER: volledige lijst/effecten].

## 12. Voorbeeld personageblad en state



```json
{
  "name": "Mei",
  "playbook": "Guardian",
  "training": "Earthbending",
  "stats": {
    "Creativity": 0,
    "Focus": 1,
    "Harmony": 1,
    "Passion": 0
  },
  "principles": [
    "Protection",
    "Trust"
  ],
  "note": "Illustratief, niet gevalideerd tegen Guardian sheet."
}
```

State (appvoorstel):

```json
{
  "fatigue": 0,
  "fatigueMax": 5,
  "balance": 0,
  "center": 0,
  "conditions": {
    "Afraid": false,
    "Angry": false,
    "Guilty": false,
    "Insecure": false,
    "Troubled": false
  },
  "statuses": [],
  "growth": 0
}
```

## AI-spelleider

- Laat fiction de Move triggeren; GM rolt normaal niet.
- 7–9 heeft eigen gevolgen, niet generiek half succes.
- Volg Fatigue, Balance, center en Conditions afzonderlijk.
- Gebruik exchanges alleen bij relevante conflicten.
- Laat relaties en principes centraal staan.
- Geen HP, levels of spell slots introduceren.

## Open vragen

- Alle playbook sheets, exacte move triggers/resultaten, condition penalties/clearing, stance move, NPC technique quota, status effects, growth vragen en mastery.
- Voorbeeldblad is niet volledig of gevalideerd.
