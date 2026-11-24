# Old-School Essentials — regeldossier

Versie 0.1 — implementatieconcept. [ONTBREEKT] = niet beschikbaar; [ONZEKER] = nakijken. Voorbeelden zijn eigen voorbeelden, niet officiële pregens. Niet gemarkeerde basisregels zijn samengevat uit systeemkennis; niet alle details zijn tegen de volledige boeken gecontroleerd.

## Bronnen
Necrotic Gnome, Classic Fantasy Rules Tome, Advanced Fantasy Player’s/Referee’s Tome; 2026 update: https://necroticgnome.com/pages/about-old-school-essentials ; https://necroticgnome.com/blogs/news/new-ose-2026-pdfs-new-store-new-adventures . Basis hieronder is B/X, geen volledige 2026-conversie.

## 1. Identiteit

Referee presenteert gevaarlijke omgeving, spelers verkennen, plannen en zoeken schatten. Klassieke fantasy zonder verplichte wereld. Rulings over rules; geen gegarandeerde encounterbalans.

## 2. Kernmechaniek

Attack: 1d20 + modifiers ≥ THAC0−descending AC; optioneel ascending AC: d20+attack bonus ≥ AAC. Saving throws: d20 ≥ save target. Ability checks (optioneel) d20 ≤ ability. Veel exploratiechecks 1d6.

- `[worp: attack: 14+1 vs AAC 13 = hit]`
- `[worp: Save vs Spells: 16 vs 15 = Success]`
- `[worp: Open Doors: 2 on 1d6 vs 2-in-6 = Success]`

## 3. Kritieke uitkomsten

Natural 20 raakt, natural 1 mist bij attacks; geen standaard extra critical damage. Saving throws exacte uitzonderingen [ONZEKER].

## 4. Personagegegevens

STR INT WIS DEX CON CHA elk 3d6 (3–18). Algemene modifiers 3:−3; 4–5:−2; 6–8:−1; 9–12:0; 13–15:+1; 16–17:+2; 18:+3. Niet elke stat gebruikt dezelfde tabel: INT talen/literacy, CHA retainers/reaction/loyalty. HP = class Hit Die + CON modifier per level (minimum 1). AC zonder armor 9 [10 ascending]; DEX wijzigt AC. Saving throws: Death/Poison, Wands, Paralysis/Petrify, Breath, Spells/Rods/Staves. Class/level tabellen bepalen waarden. Max HP variabel per level.

## 5. Skills en vaardigheden

Geen universele skilllijst. Thief skills: Climb Sheer Surfaces, Find or Remove Treasure Traps, Hear Noise, Hide in Shadows, Move Silently, Open Locks, Pick Pockets. Hear Noise d6, overige d100. Level 1: 87,10,1-in-6,10,20,15,20 [ONZEKER: Hear Noise doorgaans 1–2-in-6]. Basis zoeken naar secret doors 1-in-6, elves 2-in-6. Talen: Common, alignment language en species/INT-afhankelijke talen.

## 6. Personage maken

Rol stats, kies class, pas toegestane prime requisite-uitruil toe, rol HP, kies alignment Lawful/Neutral/Chaotic, rol 3d6×10 gp, koop gear, bereken AC/saves. Classic classes:

| Class | HD | Max level | Kenmerk | XP level 2 |
|---|---|---:|---|---:|
| Cleric | d6 |14| Turn Undead, spells vanaf level 2 |1500|
| Fighter | d8 |14| alle wapens/armor |2000|
| Magic-User | d4 |14| arcane spells, geen armor |2500|
| Thief | d4 |14| thief skills, backstab |1200|
| Dwarf | d8 |12| infravision, detection |2200|
| Elf | d6 |10| arcane spells en martial |4000|
| Halfling | d6 |8| stealth, missile bonus |2000|

Advanced opties omvatten Acrobat, Assassin, Barbarian, Bard, Druid, Illusionist, Knight, Paladin, Ranger, Drow, Duergar, Gnome, Half-Elf, Half-Orc, Svirfneblin. Exacte vereisten, profielen en separate race/class variant [ONTBREEKT].

## 7. Uitrusting en economie

Valuta gp/sp/cp; 1 gp=10 sp=100 cp. Start 3d6×10 gp. Voorbeeld B/X: dagger 3 gp/1d4, sword 10 gp/1d8, spear 3 gp/1d6, short bow 25 gp/1d6, leather 20 gp AC7[12], chainmail 40 gp AC5[14], plate 60 gp AC3[16], shield 10 gp verbetert AC 1. Variable weapon damage optioneel; standaard 1d6. Bereik/ammo/encumbrance volledige tabel [ONTBREEKT].

## 8. Gevecht en conflict

Side initiative 1d6 per ronde, hoogste eerst; declareer spells en retreat vooraf. Volgorde morale, movement, missile, magic, melee. Geen reactions/bonus actions uit D&D 2024. HP 0 dood standaard. Healing rust 1d3 HP per volledige dag [ONZEKER]. Voorbeeld: groep rolt 5 vs monsters 2; fighter attack 15 tegen AC5 met THAC0 19, raakt (15≥14), sword damage 6; monster overleeft en valt daarna aan. Morale check 2d6 > morale betekent vlucht/overgave; doorgaans bij eerste dode en halve groep verloren.

## 9. Specialistische subsystemen

Dungeon turn 10 minuten; combat round 10 seconden. Wandering monster check doorgaans elke 2 turns, 1-in-6. Rust 1 turn per uur exploratie. Lichtbron, rations, encumbrance en movement bijhouden. Spell slots per class/level; memoriseer vooraf, cast verbruikt spell. Reaction 2d6: 2 vijandig, 3–5 onvriendelijk, 6–8 onzeker, 9–11 vriendelijk, 12 zeer vriendelijk. Volledige spell- en Turn Undead-tabellen [ONTBREEKT].

## 10. Vooruitgang

XP vooral 1 per gp waarde van teruggebrachte niet-magische schat, plus monster-XP. Prime requisite modifier op XP. Level thresholds per class; doorgaans verdelen over overlevenden en retainers volgens regels. Geen milestones standaard.

## 11. Conditions en statuseffecten

Dead, Poisoned, Paralysed, Petrified, Blind, Charmed, Afraid, encumbered; werking hangt af van effect. Geen uniforme gestandaardiseerde conditioncatalogus.

## 12. Voorbeeld personageblad en state



```json
{
  "name": "Borin",
  "class": "Fighter",
  "level": 1,
  "xp": 0,
  "STR": 13,
  "INT": 10,
  "WIS": 10,
  "DEX": 12,
  "CON": 13,
  "CHA": 10,
  "alignment": "Neutral",
  "hpMax": 7,
  "ac": 4,
  "aac": 15,
  "thac0": 19,
  "saves": {
    "Death": 12,
    "Wands": 13,
    "Paralysis": 14,
    "Breath": 15,
    "Spells": 16
  },
  "gear": [
    "chainmail",
    "shield",
    "sword"
  ],
  "gp": 20
}
```

State (appvoorstel):

```json
{
  "hp": {
    "current": 7,
    "max": 7
  },
  "turn": 0,
  "round": 0,
  "conditions": [],
  "lightTurnsRemaining": 6
}
```

## AI-spelleider

- Houd dungeon turns en licht bij.
- Rol reaction en morale waar relevant.
- Telegrapheer gevaar; beloon slimme oplossingen.
- Geen automatische Perception skill of death saves.
- Kies één AC-conventie per campagne.

## Open vragen

- Advanced class/race tabellen, saves en XP per level, spells, encumbrance, 2026 wijzigingen.
- Controleer voorbeeldwaarden en thief-tabel.
