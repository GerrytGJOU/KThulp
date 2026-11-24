# Delta Green (2016) — regeldossier

Versie 0.1 — implementatieconcept. [ONTBREEKT] = niet beschikbaar; [ONZEKER] = nakijken. Voorbeelden zijn eigen voorbeelden, niet officiële pregens. Niet gemarkeerde basisregels zijn samengevat uit systeemkennis; niet alle details zijn tegen de volledige boeken gecontroleerd.

## Bronnen
Arc Dream Publishing: Agent’s Handbook, Handler’s Guide, Need to Know. Officiële toegang: https://www.delta-green.com/start-here/ ; https://www.delta-green.com/delta-green-handlers-screen-back-in-print/ 

## 1. Identiteit

Handler leidt geheime operaties tegen het Unnatural; Agents onderzoeken, beperken schade en dragen gevolgen naar huis. Moderne aarde, Program of Outlaws. Geen levels.

## 2. Kernmechaniek

Roll 1d100 ≤ Skill of Stat×5. Alleen rollen bij risico en onzekerheid. Modifiers doorgaans ±20 procentpunten of ±40 bij uitzonderlijke omstandigheden. Opposed checks: succesvolle hoogste worp wint; critical verslaat normaal succes.

- `[worp: Alertness: 34 vs 50 = Success]`
- `[worp: Search: 71 vs 60 = Failure]`
- `[worp: STR×5: 42 vs 60 = Success]`

## 3. Kritieke uitkomsten

01 en succesvolle doubles (11,22,…,99) zijn Critical Success; mislukte doubles en 00 (100) Fumble. 01 altijd succes, 100 altijd fumble.

## 4. Personagegegevens

STR, CON, DEX, INT, POW, CHA: 3d6 elk of 72 punten, elk 3–18. HP = ceil((STR+CON)/2), WP = POW, SAN start = POW×5, Breaking Point = SAN−POW, maximum SAN = 99−Unnatural. Bond start = CHA; max CHA [ONZEKER]. Damage modifier STR 3–4 −2, 5–8 −1, 9–12 0, 13–16 +1, 17–18 +2.

## 5. Skills en vaardigheden

Basispercentages (controleer sheet): Accounting 10, Alertness 20, Anthropology 0, Archeology 0, Art 0, Artillery 0, Athletics 30, Bureaucracy 10, Computer Science 0, Craft 0, Criminology 10, Demolitions 0, Disguise 10, Dodge 30, Drive 20, Firearms 20, First Aid 10, Foreign Language 0, Forensics 0, Heavy Machinery 10, Heavy Weapons 0, History 10, HUMINT 10, Law 0, Medicine 0, Melee Weapons 30, Military Science 0, Navigate 10, Occult 10, Persuade 20, Pharmacy 0, Pilot 0, Psychotherapy 10, Ride 10, Science 0, Search 20, SIGINT 0, Stealth 10, Surgery 0, Survival 10, Swim 20, Unarmed Combat 40, Unnatural 0. Art/Craft/Science/Language/Pilot/Military Science hebben specialisaties. Markeer mislukte skills; na operatie +1d4 per gemarkeerde skill (niet Unnatural).

## 6. Personage maken

1. Verdeel/rol stats. 2. Kies profession, neem skillprofiel en aantal Bonds. 3. Kies acht bonusvaardigheden (+20 elk, herhaling mogelijk, cap 80 bij creatie), geen Unnatural. 4. Bereken waarden en benoem Bonds. 5. Beschrijf motivatie, werkgever en achtergrond. Voorbeelden professions: Anthropologist/Historian, Computer Scientist/Engineer, Federal Agent, Physician, Scientist, Special Operator. Aanvullende professions en exacte pakketten [ONTBREEKT]. Bonds zijn concrete belangrijke relaties; aantal verschilt per beroep.

## 7. Uitrusting en economie

Geen vaste gold-economie. Requisition, persoonlijke middelen en toestemming bepalen toegang. Voorbeeldwaarden: unarmed 1d4−1, knife 1d4, pistol 1d10, rifle 1d12 [ONZEKER: profiel per model]. Armor trekt schade af; Lethality-wapens hebben afzonderlijk percentage. Volledige wapentabel, bereik, ammo en prijsniveaus [ONTBREEKT].

## 8. Gevecht en conflict

Volg DEX aflopend; één actie per turn. Attack met relevante skill, Dodge of Fight Back voor verdediging volgens situatie. Damage minus Armor, minimaal 0; HP 0 dood. Lethality: roll d100 ≤ Lethality% betekent doorgaans dood; anders tel beide dobbelcijfers op (0 telt als 10). Voorbeeld: Agent DEX 13 schiet (Firearms 50, roll 32), schade 7, armor 3, doel verliest 4 HP; tegenstander handelt daarna. First Aid herstelt 1d4 [ONZEKER: beperkingen].

## 9. Specialistische subsystemen

SAN check tegen huidige SAN; verlies volgens bron, bijvoorbeeld 0/1d6. Violence, Helplessness en Unnatural onderscheiden. Bij ≥5 SAN verlies ineens tijdelijke insanity; bij Breaking Point nieuwe disorder en nieuwe BP = huidige SAN−POW. Project SAN loss onto Bond: roll 1d4, betaal WP en Bond-verlies, verminder SAN-verlies met die waarde (minimum 0). Adaptation na drie relevante successieve incidenten zonder insanity [ONZEKER: exacte markers/prijs]. Home scenes: relaties, therapie, trainen; volledige effecten [ONTBREEKT].

## 10. Vooruitgang

Geen XP. Mislukte skills markeren, na operatie 1d4 toevoegen, doorgaans max 99. Home pursuits bieden extra ontwikkeling ten koste van relaties of tijd.

## 11. Conditions en statuseffecten

Temporary Insanity, Disorders, Adapted (Violence/Helplessness), Exhaustion, Unconsciousness, Dead. WP 0 betekent instorten; exacte vermoeidheidsdrempels [ONTBREEKT].

## 12. Voorbeeld personageblad en state



```json
{
  "name": "Eva Reed",
  "profession": "Federal Agent",
  "STR": 12,
  "CON": 12,
  "DEX": 13,
  "INT": 13,
  "POW": 12,
  "CHA": 10,
  "skills": {
    "Firearms": 50,
    "Alertness": 50,
    "Search": 60
  },
  "bonds": [
    {
      "name": "Partner",
      "score": 10
    }
  ],
  "note": "Partieel voorbeeld; volledige professionverdeling ontbreekt."
}
```

State (appvoorstel):

```json
{
  "hp": {
    "current": 12,
    "max": 12
  },
  "wp": {
    "current": 12,
    "max": 12
  },
  "san": 60,
  "sanMax": 99,
  "breakingPoint": 48,
  "failedSkills": [],
  "conditions": []
}
```

## AI-spelleider

- Rol alleen bij betekenisvol risico.
- Meld SAN-verlies en houd Bonds en WP bij.
- Bewaar Unnatural-statblocks en geheime aanwijzingen achter het scherm.
- Plan Home scenes tussen operaties; geen heroïsche plot armor.

## Open vragen

- Volledige professionpakketten, uitrustingsprofielen, adaptation en Home pursuits controleren in Agent’s Handbook.
- Voorbeeldblad is niet volledig gevalideerd.
