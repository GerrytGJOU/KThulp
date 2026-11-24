# Cthulhu Dark Ages 3e — regeldossier

Versie 0.1 — implementatieconcept. [ONTBREEKT] = niet beschikbaar; [ONZEKER] = nakijken. Voorbeelden zijn eigen voorbeelden, niet officiële pregens. Niet gemarkeerde basisregels zijn samengevat uit systeemkennis; niet alle details zijn tegen de volledige boeken gecontroleerd.

## Bronnen
https://www.chaosium.com/cthulhu-dark-ages-3rd-edition-pdf/ ; https://www.chaosium.com/cthulhu-quickstart/ — supplementtekst niet integraal geraadpleegd.

## 1. Identiteit

Chaosium, Cthulhu Dark Ages 3rd Edition (2020), supplement voor CoC 7e. Engeland rond 1000, Totburh in Severn Valley; Keeper leidt onderzoek in een wereld van geloof, volksverhalen en gevaar. Hieronder staat de CoC-basis; supplementafwijkingen zijn niet volledig beschikbaar.

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

Gebruik de CoC 7e skillmechaniek. Periodevaardigheden omvatten Ride, Fighting, Natural World, Track, First Aid, Occult en Language. Moderne Firearms, Drive Auto en Electrical Repair zijn niet passend. Exacte Dark Ages skillnamen, basiswaarden en specialisaties [ONTBREEKT]. Zie officiële Dark Ages character sheet.

## 6. Personage maken

Kies middeleeuws beroep en sociale positie, bijvoorbeeld monnik, krijger, genezer of ambachtsman (illustratieve concepten, geen geverifieerde officiële lijst). Overige creatie volgens CoC 7e tenzij supplement afwijkt. Exacte occupations, budgetten, Status en startbezit [ONTBREEKT].

## 7. Uitrusting en economie

Middeleeuws bezit, sociale verplichtingen en toegang tot voedsel, onderdak en paarden. Speer, bijl, zwaard, boog, schild en mail: exacte waarden en monetaire tabel [ONTBREEKT]. Geen moderne vuurwapens.

## 8. Gevecht en conflict

DEX aflopend; klaar vuurwapen +50 DEX voor volgorde. Melee: verdediger Dodge (gelijke success level wint verdediger) of Fight Back (gelijke success level wint aanvaller). Ranged: afstand en omstandigheden bepalen difficulty/penalty; dive for cover mogelijk. HP 0 unconscious; Major Wound bij één hit ≥ helft max HP; bij Major Wound CON check tegen unconsciousness, HP 0 dying. Schade ≥ max HP in één hit dood. Voorbeeld: Brawl 55 roll 24 Hard; Dodge 40 roll 25 Regular; aanvaller raakt, 1d3=2 plus DB 0, doel verliest 2 HP. First Aid +1 HP; Medicine +1d3 HP volgens timing. Natuurlijk herstel zonder Major Wound 1 HP/dag; met Major Wound wekelijkse CON-check.

## 9. Specialistische subsystemen

SAN roll d100 tegen huidige SAN; verlies op succes/falen volgens bron, bv. 0/1d6. ≥5 verlies bij één gebeurtenis: INT check, succes leidt tot Temporary Insanity. ≥1/5 SAN in een speldag: Indefinite Insanity. SAN 0 permanent insanity. Luck spending optioneel: 1 punt per 1 verschil, niet voor SAN, Luck of damage en niet op pushed rolls; overige uitzonderingen [ONZEKER]. MP voor spells, kosten en castingtijd per spell. Chase: MOV, speed rolls, movement actions per deelnemer; exacte procedures [ONTBREEKT].

Dark Ages bevat optionele aangepaste Sanity, Folk Magic, mondelinge overlevering en mounted combat. Exacte drempels, kosten en regels [ONTBREEKT]; schakel deze modules niet in totdat ze zijn ingevoerd.

## 10. Vooruitgang

Markeer succesvolle skill checks bij betekenisvol gebruik. Development phase: roll d100 > huidige skill, of >95, dan +1d10. Geen Cthulhu Mythos via normale verbetering. SAN-beloning bij oplossen zaken; exact per scenario.

## 11. Conditions en statuseffecten

Major Wound, Unconscious, Dying, Dead, Temporary Insanity, Indefinite Insanity, Permanent Insanity, bouts of madness. Temporary Insanity duurt 1d10 uur; boutduur hangt van aanwezigheid van andere spelers af. Exacte bouttabellen [ONTBREEKT].

## 12. Voorbeeld personageblad en state



```json
{
  "name": "Aelfwyn",
  "occupation": "Genezer (concept)",
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
    "Ride": 20,
    "First Aid": 50,
    "Natural World": 50
  },
  "build": 0,
  "damageBonus": 0,
  "mov": 8,
  "note": "Ongevalideerd basis-CoC voorbeeld; Dark Ages occupation en skillbases ontbreken."
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

- Gebruik CoC-basis zolang supplementregels niet geconfigureerd zijn.
- Maak geloof en lokale gemeenschap relevant.
- Geen moderne kennis of uitrusting zonder settinggrond.
- Meld SAN loss; onderscheid volksgeloof van Mythos.

## Open vragen

- Alle Dark Ages-specifieke skills, occupations, Status, gear en Folk Magic.
- Optionele Sanity, oral tradition en mounted combat exact controleren.
