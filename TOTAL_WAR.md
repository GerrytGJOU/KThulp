# Persistent Total War — visiondocument (ONTWERPFASE)

> **Status: concept.** Nog niet speelbaar. In de hoofdmenu staat de modus als
> **"Binnenkort"**. Docenten kunnen een statisch voorbeeld van de veldtochtkaart
> bekijken (achter de docentenlogin); leerlingen kunnen de modus nog niet
> binnengaan. Dit document legt het beoogde ontwerp en datamodel vast vóór de
> implementatie. Code-scaffolding staat in [`certamen/totalwar.js`](certamen/totalwar.js).

## Kern-idee

Een **tweede spelmodus naast Battle Mode**. Waar Battle Mode één klas in twee
teams splitst voor één live gevecht per les, is Total War een **doorlopende
veldtocht** over weken/maanden:

- Elke klas hoort blijvend bij één **beschaving** (bijv. G3A → Atheners,
  V4 Latijn → Galliërs).
- Alle beschavingen bestaan op één gedeelde **kaart van Europa**.
- Klassen breiden hun beschaving uit door **gebieden** te veroveren en te
  verdedigen. Niets reset na een les.

Battle Mode blijft ongewijzigd bestaan; zie [BATTLE_MODE.md](BATTLE_MODE.md).

---

## Kaart: gebieden bestaan uit steden

De kaart bestaat uit veroverbare **gebieden** (Hispania, Gallia, Italia,
Graecia, Asia, Aegyptus, …). Elk gebied bevat meerdere **steden** (Graecia →
Athene, Sparta, Korinthe). Gebieden zijn dus geen lege regio's maar bundels van
steden.

De voorbeeldkaart in `totalwar.js` is bewust een **schematische
knooppuntkaart** (geen geografie): ze maakt de kernregel *"gedeelde grens ⇒
aanvalbaar"* meteen zichtbaar via verbindingslijnen tussen buren. Een
geografisch nettere kaart kan later.

### Live kaartstand

De kaart toont altijd de actuele oorlog:

- Kleur van elk gebied = eigenaar-beschaving (Galliërs groen, Atheners blauw, …).
- Welke steden nog in bezit zijn.
- Welke forten/verdedigingswerken nog staan.
- Opgebouwde bonussen per beschaving en per gebied/stad.

---

## Datamodel (voorlopig — zie `certamen/totalwar.js`)

```
TW_CIVS[civId] = { nm, color, soft }          // beschavingen (kleuren)
TW_DEFENSE_CAP = 100                           // verdediging kan nooit hoger

TW_MAP[] = {
  id, nm,                  // gebied
  x, y,                    // positie op schematische kaart
  owner,                   // civId of "neutral"
  defense,                 // 0..TW_DEFENSE_CAP
  bonus,                   // gebiedsbonus (tekst, nog te balanceren)
  cities[],                // steden (krijgen later eigen bonussen)
  neighbors[]              // aangrenzende gebied-id's → bepalen PvP
}
```

Beoogde uitbreiding bij implementatie:
- **Persistente opslag** in Firebase RTDB, bijv. `/totalwar/map/{territoryId}`
  met `owner`, `defense`, `forts`, `lastChanged`; en
  `/totalwar/civs/{civId}` met `classId`, `bonuses`.
- **Klas→beschaving-koppeling** beheerd door de docent in het docentenportaal.
- Steden als sub-objecten met eigen `owner` en `bonus`.

---

## Mechanieken (nog te ontwerpen / balanceren)

### Neutraal gebied veroveren
Een neutraal gebied verover je niet tegen een andere klas, maar via een
**AI-bazengevecht**. Winst → gebied kleurt in jouw beschaving. Bazenmoeilijkheid
nog te bepalen.

### Gebiedsbeloningen
Elk veroverd gebied geeft een **bonus**; steden kunnen eigen unieke bonussen
geven. Bezit van gebied/steden = voordeel voor de beschaving. Exacte bonussen
nog onbeslist.

### PvP via gedeelde grenzen (asynchroon)
Zodra twee beschavingen **aangrenzende** gebieden bezitten, kunnen ze elkaar
aanvallen. Omdat klassen niet tegelijk spelen, is PvP **asynchroon**: de
aanvallende klas speelt tijdens haar eigen les; de verdediger hoeft niet online
te zijn. Dit is een essentieel ontwerpprincipe.

### Verdediging door te oefenen
Telkens als leerlingen **oefenen** (woordjes e.d.), dragen ze bij aan de
verdediging van hun beschaving — conceptueel het bouwen van muren/forten. Meer
oefenen = sterker gebied. Oefenen is dus niet langer alleen persoonlijke
progressie, maar beschermt de hele klas.

### Verdedigingsplafond
Verdediging groeit nooit oneindig: er is een **maximum** (`TW_DEFENSE_CAP`).
Zo blijven gebieden altijd veroverbaar, worden actieve klassen beloond, en
houden minder actieve klassen een reële kans.

### Compensatie voor klasgrootte
Een klas van 30 mag niet automatisch méér voortgang maken dan een klas van 6.
De bijdrage per leerling **schaalt met de klasgrootte**: kleine klassen tellen
per leerling zwaarder, grote klassen lichter. Doel: een actieve kleine klas is
even sterk als een actieve grote klas. Formule nog te ontwerpen, maar
klasgrootte-compensatie is een kern-balansmechaniek.

---

## Beoogd klaslokaaleffect

Leerlingen worden gemotiveerd om te oefenen om twee redenen: **nieuw gebied
veroveren** én **eigen gebied verdedigen**. Daardoor oefenen ze zowel in de les
als thuis, omdat hun oefening de beschaving versterkt. De veldtocht groeit
geleidelijk uit tot een doorlopende "Total War"-strijd tussen alle deelnemende
klassen.

---

## Wat er nu (ontwerpfase) gebouwd is

- Menu-tegel **"🗺️ Total War — Binnenkort"** in `SCREENS.home` ([games.js](certamen/games.js)).
- Publiek uitlegscherm `SCREENS.totalWar` (concept; leerlingen kunnen niets starten).
- Docent-voorbeeld `SCREENS.totalWarPreview`, **achter de docentenlogin**
  (`teacherNet().isTeacherLoggedIn()`), met een statische schematische
  veldtochtkaart, legenda en gebieds-/stedenlijst — geen echte opslag of logica.
- Link naar het voorbeeld in het docentenportaal (`SCREENS.teacherPortal`).
- Datamodel-aanzet `TW_CIVS` / `TW_MAP` in [`certamen/totalwar.js`](certamen/totalwar.js).

## Open vragen voor de implementatiefase

- Definitieve gebieden, steden en bonuswaarden.
- Exacte verdedigingsopbouw per oefenactie + de klasgrootte-formule.
- AI-bazenmoeilijkheid per gebied.
- Firebase-datastructuur en schrijfregels (wie mag wat muteren?).
- Hoe een aanval verloopt zonder live tegenstander (AI bestuurt de verdediging
  o.b.v. de opgebouwde `defense`/forten?).
- Koppeling klas → beschaving in het docentenportaal.

---

*Total War · Gerben de Jong · 2026*
