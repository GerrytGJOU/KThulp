# Call of Cthulhu 7e — regeldossier

Versie 0.1 — implementatieconcept. [ONTBREEKT] = niet beschikbaar; [ONZEKER] = nakijken. Voorbeelden zijn eigen voorbeelden, niet officiële pregens. Niet gemarkeerde basisregels zijn samengevat uit systeemkennis; niet alle details zijn tegen de volledige boeken gecontroleerd.

## Bronnen
Keeper Rulebook; Investigator Handbook; https://www.chaosium.com/cthulhu-quickstart/ ; https://www.chaosium.com/resources/

## 1. Identiteit

Chaosium, 7th Edition (2014). Keeper beschrijft mysteries, Investigators verzamelen aanwijzingen en proberen te overleven. Standaard jaren 1920, ook moderne tijd.

## 2. Kernmechaniek

Roll 1d100 ≤ skill: Regular; ≤ floor(skill/2): Hard; ≤ floor(skill/5): Extreme. Bonus/Penalty dice: extra tientallen-dobbelsteen, behoud beste/slechtste totaal; tegengestelde heffen elkaar op. Opposed: hoogste success level, bij gelijk niveau hoogste skill. Pushed roll na mislukking mag met andere aanpak en groter risico, niet voor combat of SAN.

- `[worp: Spot Hidden: 34 vs 55 = Regular Success]`
- `[worp: Library Use: 19 vs 60 = Hard Success]`
- `[worp: Stealth: 08 vs 50 = Extreme Success]`

## 3. Kritieke uitkomsten

01 Critical Success; 100 altijd Fumble; 96–100 Fumble als effectieve skill <50. Extreme damage bij aanval afhankelijk van wapen (impaling of niet).

## 4. Personagegegevens

STR, CON, DEX, APP, POW = 3d6×5; SIZ, INT, EDU = (2d6+6)×5. HP=floor((CON+SIZ)/10); MP=POW/5; SAN start POW, max 99−Cthulhu Mythos; Luck=3d6×5. MOV 7 als STR en DEX beide <SIZ; 9 als beide >SIZ; anders 8, leeftijdscorrecties. Build/DB op STR+SIZ: 2–64 −2/−2; 65–84 −1/−1; 85–124 0/0; 125–164 1/+1d4; 165–204 2/+1d6; hogere tabel [ONTBREEKT]. Leeftijd 15–89 heeft aanpassingen [ONTBREEKT].

## 5. Skills en vaardigheden

Basisvaardigheden (%): Accounting 5, Anthropology 1, Appraise 5, Archaeology 1, Charm 15, Climb 20, Credit Rating 0, Cthulhu Mythos 0, Disguise 5, Dodge DEX/2, Drive Auto 20, Electrical Repair 10, Fast Talk 5, First Aid 30, History 5, Intimidate 15, Jump 20, Library Use 20, Listen 20, Locksmith 1, Mechanical Repair 10, Medicine 1, Natural World 10, Navigate 10, Occult 5, Operate Heavy Machinery 1, Persuade 10, Psychology 10, Psychoanalysis 1, Ride 5, Sleight of Hand 10, Spot Hidden 25, Stealth 20, Swim 20, Throw 20, Track 10, Language (Own) EDU, Language (Other) 1, Fighting (Brawl) 25, Firearms (Handgun) 20, Firearms (Rifle/Shotgun) 25. Art/Craft 5, Science 1, Pilot 1, Survival 10 per specialisatie. Volledige subskillcatalogus [ONTBREEKT].

## 6. Personage maken

Rol stats, kies leeftijd en pas stats aan, bereken afgeleide waarden, kies occupation en verdeel occupational skill points (vaak EDU×4, soms EDU×2 + andere stat×2), verdeel INT×2 personal interest points, kies Credit Rating binnen beroep, backstory en gear. Beroepen o.a. Antiquarian, Author, Doctor, Detective, Journalist, Professor, Police Officer; volledige pakketten [ONTBREEKT]. Quickstart alternatief gebruikt 40,50,50,50,60,60,70,80 voor stats en vaste skillverdeling [ONZEKER].

## 7. Uitrusting en economie

Credit Rating bepaalt Cash, Assets, Spending Level; tabellen per tijdperk [ONTBREEKT]. Voorbeeld wapens: unarmed 1d3+DB, knife 1d4+DB (klein), .38 revolver 1d10 [ONZEKER: specifiek profiel]. Volledige bereik-, ammo-, prijs- en armorwaarden [ONTBREEKT]. Beloningen zijn informatie, toegang, SAN-herstel en geld; geen standaard loot progression.

## 8. Gevecht en conflict

DEX aflopend; klaar vuurwapen +50 DEX voor volgorde. Melee: verdediger Dodge (gelijke success level wint verdediger) of Fight Back (gelijke success level wint aanvaller). Ranged: afstand en omstandigheden bepalen difficulty/penalty; dive for cover mogelijk. HP 0 unconscious; Major Wound bij één hit ≥ helft max HP; bij Major Wound CON check tegen unconsciousness, HP 0 dying. Schade ≥ max HP in één hit dood. Voorbeeld: Brawl 55 roll 24 Hard; Dodge 40 roll 25 Regular; aanvaller raakt, 1d3=2 plus DB 0, doel verliest 2 HP. First Aid +1 HP; Medicine +1d3 HP volgens timing. Natuurlijk herstel zonder Major Wound 1 HP/dag; met Major Wound wekelijkse CON-check.

## 9. Specialistische subsystemen

SAN roll d100 tegen huidige SAN; verlies op succes/falen volgens bron, bv. 0/1d6. ≥5 verlies bij één gebeurtenis: INT check, succes leidt tot Temporary Insanity. ≥1/5 SAN in een speldag: Indefinite Insanity. SAN 0 permanent insanity. Luck spending optioneel: 1 punt per 1 verschil, niet voor SAN, Luck of damage en niet op pushed rolls; overige uitzonderingen [ONZEKER]. MP voor spells, kosten en castingtijd per spell. Chase: MOV, speed rolls, movement actions per deelnemer; exacte procedures [ONTBREEKT].

## 10. Vooruitgang

Markeer succesvolle skill checks bij betekenisvol gebruik. Development phase: roll d100 > huidige skill, of >95, dan +1d10. Geen Cthulhu Mythos via normale verbetering. SAN-beloning bij oplossen zaken; exact per scenario.

## 11. Conditions en statuseffecten

Major Wound, Unconscious, Dying, Dead, Temporary Insanity, Indefinite Insanity, Permanent Insanity, bouts of madness. Temporary Insanity duurt 1d10 uur; boutduur hangt van aanwezigheid van andere spelers af. Exacte bouttabellen [ONTBREEKT].

## 12. Voorbeeld personageblad en state



```json
{
  "name": "Clara Hayes",
  "occupation": "Journalist",
  "STR": 45,
  "CON": 55,
  "SIZ": 50,
  "DEX": 65,
  "APP": 60,
  "INT": 75,
  "POW": 60,
  "EDU": 70,
  "Luck": 50,
  "skills": {
    "Spot Hidden": 55,
    "Library Use": 60,
    "Stealth": 50,
    "Dodge": 32,
    "Language (Own)": 70
  },
  "build": 0,
  "damageBonus": 0,
  "mov": 8,
  "note": "Partieel voorbeeld; occupationbudget niet volledig uitgewerkt."
}
```

State (appvoorstel):

```json
{
  "hp": {
    "current": 10,
    "max": 10
  },
  "mp": {
    "current": 12,
    "max": 12
  },
  "san": 60,
  "sanMax": 99,
  "luck": 50,
  "conditions": [],
  "skillChecks": [],
  "sanAtDayStart": 60
}
```

## AI-spelleider

- Vraag alleen rolls als uitkomst onzeker is.
- Geef essentiële clues niet uitsluitend achter één mislukte roll.
- Meld SAN loss en houd dagtotaal bij.
- Laat combat gevaarlijk zijn; geen D&D death saves.
- Pushed roll vereist andere aanpak en aangekondigd risico.

## Open vragen

- Volledige occupations, leeftijdstabel, gear, chase, auto fire en spellcatalogus.
- Controleer Luck spending uitzonderingen en genezingstiming.
