# Star Wars RPG (FFG/EDGE) — regeldossier

Versie 0.1 — implementatieconcept. [ONTBREEKT] = niet beschikbaar; [ONZEKER] = nakijken. Voorbeelden zijn eigen voorbeelden, niet officiële pregens. Niet gemarkeerde basisregels zijn samengevat uit systeemkennis; niet alle details zijn tegen de volledige boeken gecontroleerd.

## Bronnen
Edge of the Empire (2013), Age of Rebellion (2014), Force and Destiny (2015). https://www.edge-studio.net/games/star-wars-fad-core-rulebook/ ; https://www.edge-studio.net/games/star-wars-eote-begginer-game/ . Core era Galactic Civil War; Old Republic is settingconversie.

## 1. Identiteit

GM leidt cinematische space opera. Spelers smokkelaars, rebellen, Force users enz.; drie compatibele core books met eigen campaign hooks.

## 2. Kernmechaniek

Ability d8 groen, Proficiency d12 geel, Difficulty d8 paars, Challenge d12 rood, Boost d6 blauw, Setback d6 zwart, Force d12 wit. Positieve pool: max(characteristic, skill rank), upgrade min ervan naar Proficiency. Difficulty 0 Simple, 1 Easy, 2 Average, 3 Hard, 4 Daunting, 5 Formidable. Upgrades vervangen dice; als geen basisdie over, voeg basisdie toe. Cancel Success/Failure en Advantage/Threat onafhankelijk. ≥1 net Success slaagt.

- `[worp: Piloting (Space): 2Y 1G 2P -> 2 Success, 1 Threat = Success]`
- `[worp: Stealth: 2G 1P 1K -> 0 Success, 2 Advantage = Failure]`
- `[worp: Negotiation: 1Y 2G 1R 1P -> 1 Success, 1 Despair = Success + complication]`
Exacte die face arrays [ONTBREEKT].

## 3. Kritieke uitkomsten

Triumph telt ook als Success, Despair als Failure; speciale symbolen blijven na cancellation en kunnen tegelijk voorkomen. Critical Injury vereist hit en weapon Critical Rating in Advantage of Triumph, plus doorgedrongen damage. Rol d100 +10 per bestaande critical; tabel [ONTBREEKT].

## 4. Personagegegevens

Brawn, Agility, Intellect, Cunning, Willpower, Presence; species bepaalt start (meestal 1–3). Max bij creatie 5, normaal max 6 via Dedication. Wound Threshold = species base+Brawn; Strain Threshold = species base+Willpower. Soak=Brawn+armor e.d.; Defense per melee/ranged, cap 4. Skill ranks 0–5, max 2 bij creatie. Force Rating meestal 0 of 1 bij creatie afhankelijk van career. Human: alle characteristics 2, 110 XP, WT 10+Brawn, ST 10+Willpower.

## 5. Skills en vaardigheden

General: Astrogation(Int), Athletics(Br), Charm(Pr), Coercion(Wi), Computers(Int), Cool(Pr), Coordination(Ag), Deception(Cu), Discipline(Wi), Leadership(Pr), Mechanics(Int), Medicine(Int), Negotiation(Pr), Perception(Cu), Piloting (Planetary/Space)(Ag), Resilience(Br), Skulduggery(Cu), Stealth(Ag), Streetwise(Cu), Survival(Cu), Vigilance(Wi). Combat: Brawl(Br), Gunnery(Ag), Melee(Br), Ranged (Light/Heavy)(Ag), Lightsaber(Br; talent kan wijzigen). Knowledge (Int): Core Worlds, Education, Lore, Outer Rim, Underworld, Warfare, Xenology. Geen vaste taalvaardigheden. Career skill kost 5×nieuwe rank XP, non-career +5.

## 6. Personage maken

Kies background, species, career en specialization, gratis skill ranks volgens book, besteed species XP (characteristic verhogen kost 10×nieuwe rating; alleen bij creatie direct), kies Motivations en Obligation/Duty/Morality, koop gear. EotE careers: Bounty Hunter, Colonist, Explorer, Hired Gun, Smuggler, Technician. AoR: Ace, Commander, Diplomat, Engineer, Soldier, Spy. F&D: Consular, Guardian, Mystic, Seeker, Sentinel, Warrior. Core species omvatten Human, Bothan, Droid, Gand, Rodian, Trandoshan, Twi’lek, Wookiee, Duros, Gran, Ithorian, Mon Calamari, Sullustan, Cerean, Kel Dor, Mirialan, Nautolan, Togruta, Zabrak. Volledige specieslijst, 54 specialization trees en career skillpakketten [ONTBREEKT].

## 7. Uitrusting en economie

Credits, standaard 500 voor gear. Voorbeelden: blaster pistol damage 6, crit 3, Medium, Enc 1; blaster rifle damage 9, crit 3, Long, Enc 4; lightsaber damage 10, crit 1, Engaged, Breach 1 [ONZEKER: base EotE/AoR profiel wijkt af van F&D]. Heavy clothing soak 1, padded armor soak 2. Exacte kosten/qualities, vehicle data [ONTBREEKT].

## 8. Gevecht en conflict

Initiative Cool indien voorbereid, anders Vigilance; sorteer Success dan Advantage; slots PC/NPC, spelers kiezen wie slot gebruikt. Eén action, één maneuver, incidental; tweede maneuver doorgaans 2 Strain, max 2. Ranged difficulty Short 1, Medium 2, Long 3, Extreme 4; Engaged afhankelijk wapen; melee 2. Damage = base+net Success−Soak. Wounds > threshold incapacitated + Critical Injury; Strain > threshold incapacitated. Voorbeeld: Medium pistol attack 2 net Success: 8 damage, soak 3 -> 5 Wounds; 1 Advantage kan Strain herstellen. Vehicles: silhouette, speed, handling, hull trauma, system strain, defense/armor, planetary scale damage ×10 t.o.v. personal [ONZEKER: conversie-uitzonderingen].

## 9. Specialistische subsystemen

Destiny pool: ieder speler rolt Force die aan sessiestart; light/dark pips vormen pool. Speler flip light naar dark voor upgrade; GM omgekeerd. Force powers rollen Force Dice = Force Rating; dark pips gebruiken door light-side PC kost Destiny flip, Strain en Conflict volgens regels. Obligation en Duty bepalen hooks; Morality start doorgaans 50, sessie-einde 1d10−Conflict verandert score. Exacte thresholds en creation groepsbudgetten [ONTBREEKT].

## 10. Vooruitgang

XP per sessie, vaak 10–20 als richtlijn. Koop skill ranks, talents (5/10/15/20/25 per tree row), specializations en Force powers. Career specialization prijs 10×aantal inclusief nieuwe; non-career +10. Geen levels.

## 11. Conditions en statuseffecten

Incapacitated, Staggered (geen actions), Immobilized (geen maneuvers), Disoriented (Setback op checks), Critical Injuries (individuele duur/werking), prone. Healing en critical recovery tabellen [ONTBREEKT].

## 12. Voorbeeld personageblad en state



```json
{
  "name": "Venn",
  "species": "Human",
  "career": "Smuggler",
  "specialization": "Pilot",
  "characteristics": {
    "Brawn": 2,
    "Agility": 3,
    "Intellect": 2,
    "Cunning": 3,
    "Willpower": 2,
    "Presence": 2
  },
  "skills": {
    "Piloting (Space)": 1,
    "Cool": 1
  },
  "woundThreshold": 12,
  "strainThreshold": 12,
  "soak": 2,
  "note": "Partieel; XP en gratis ranks niet volledig verdeeld."
}
```

State (appvoorstel):

```json
{
  "wounds": 0,
  "strain": 0,
  "criticalInjuries": [],
  "conditions": [],
  "forceRating": 0,
  "destinyPool": {
    "light": 2,
    "dark": 2
  }
}
```

## AI-spelleider

- Laat Advantage/Threat onafhankelijk van succes doorwerken.
- Bewaar Triumph/Despair ook na cancellation.
- Gebruik initiative slots, geen vaste individuele volgorde.
- Volg Wounds en Strain als oplopende tellers.
- Gebruik range bands, geen D&D grid als standaard.

## Open vragen

- Exacte dobbelsteenvlakken, alle species/careers/trees, gear, critical chart, Force powers, vehicle combat, healing.
- Old Republic aanpassing is niet officieel onderdeel van de drie core books.
