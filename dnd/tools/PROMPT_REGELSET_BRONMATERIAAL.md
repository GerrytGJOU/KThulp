# Prompt: bronmateriaal voor een regelset ophalen

Plak onderstaande prompt in een gesprek of bij een andere AI die de regels van het gewenste rollenspelsysteem kent (of de regelboeken heeft). Vervang `[SYSTEEM]` door bijvoorbeeld: Delta Green, Old School Essentials, Call of Cthulhu 7e / Cthulhu Dark Ages, Star Wars RPG (Edge of the Empire / Age of Rebellion / Force and Destiny / FFG of d20) of Avatar Legends. Plak het resultaat daarna terug in het gesprek met Claude Code.

---

Ik bouw een webapp waarin een AI de spelleider (DM) is van een doorlopende campagne met 2 tot 6 spelers. De app moet het rollenspelsysteem **[SYSTEEM]** kunnen draaien. Ik heb van jou een compact, feitelijk **regeldossier** nodig waarmee ik dat systeem als "regelset" in de app kan bouwen. Alles wat je schrijft is voor mijn eigen gebruik.

**Regels voor je antwoord**
- Schrijf in het Nederlands, maar laat spelregeltermen, skillnamen, statistieken en dobbelnotatie in het Engels (de originele term), met een korte Nederlandse uitleg erbij.
- Parafraseer in eigen woorden en wees compact. Geef geen lange letterlijke passages uit regelboeken, wel exacte getallen, DC's, formules, tabellen met waarden en namen.
- Verzin niets. Weet je iets niet zeker, zet er `[ONZEKER]` achter; ontbreekt het, zet `[ONTBREEKT]`. Noem de edities of boeken waar het op gebaseerd is.
- Houd het praktisch: alleen wat een DM en een personagenblad nodig hebben om een sessie te draaien.
- Lever het antwoord als genummerde secties (1 t/m 12 hieronder), met tabellen waar dat helpt.

**Gevraagde secties**

1. **Identiteit.** Naam en editie, uitgever, genre en toon, hoe een sessie speelt (rol van de spelleider, wat de spelers doen). Welke settings horen er standaard bij.

2. **Kernmechaniek.** Hoe wordt een uitkomst bepaald? Welke dobbelstenen (d20, d100, dobbelpoel, kaarten, enz.), hoe wordt een totaal berekend, wat is slagen/falen, wie rolt (spelers en/of DM), hoe werken moeilijkheidsgraad, bonussen en nadelen (advantage, bonus/penalty dice, boosts, enz.). Geef minstens drie uitgewerkte rolvoorbeelden, elk met de exacte notatie zoals een speler die zou opschrijven (bv. `[worp: Spot Hidden: 34 vs 55 = Success]`).

3. **Kritieke uitkomsten en bijzondere resultaten.** Wat gebeurt er bij extreme successen en mislukkingen (nat 20, 01, 100, fumbles, Triumph/Despair, enz.), met de exacte drempels.

4. **Personagegegevens.** Alle eigenschappen/attributen met bereik en hoe ze ontstaan (rollen of verdelen). Alle **afgeleide waarden** met formule (hit points, Sanity, Willpower, Luck, Defense, Armor, Wounds, Stress, Balance, Fatigue, enz.). Geef bij elke waarde de startwaarde en het maximum.

5. **Skills en vaardigheden.** Volledige lijst met per skill de basiswaarde of de koppeling aan een eigenschap. Zijn er talen, specialisaties of speciale skills (Mythos, Force, bending-technieken, enz.)? Hoe stijgen skills?

6. **Personage maken, stap voor stap.** De exacte volgorde van de creatie. Welke keuzes (klasse, beroep/profession, afkomst/species, speelboek/playbook, career, archetype, background) en wat elke keuze geeft. Geef de **volledige lijst** van opties (alle beroepen, klassen, playbooks, specialisaties, species) met per optie in 1 tot 3 regels wat het geeft: skills, startuitrusting, bijzondere vermogens. Noem puntbudgetten en beperkingen. Zijn er bindingen, relaties of motivaties die bij creatie horen (Bonds, Motivations, Duty/Obligation, Balance)?

7. **Uitrusting en economie.** Startuitrusting, valuta of resourcesysteem (gold, Credits, Assets, Cash), wapens en pantser met hun waarden (schade, bereik, ammo, eigenschappen) in een tabel. Hoe wordt buit en beloning in dit systeem gedaan, en wat is de toon daarvan (zeldzaam magisch, schaarse middelen, enz.)?

8. **Gevecht en conflict.** Initiatief of beurtvolgorde, wat je per beurt kunt doen, aanvallen en verdedigen, schade, genezing, dood en bijna-dood, dekking en afstand. Bij niet-fysieke conflicten (sociaal, mentaal, Avatar Legends-technieken, ruimtegevechten of voertuigen): ook die. Geef een uitgewerkt voorbeeld van één gevechtsronde.

9. **Specialistische subsystemen.** Alles wat dit systeem uniek maakt en wat de DM moet bijhouden: Sanity en Bonds (Delta Green, Call of Cthulhu), Luck, Force Points en Destiny Points, Balance en Fatigue/Conditions, Stress, Strain, Hope, Inspiratie, Corruptie, magie of psi, achtervolgingen, wondes, moraal. Geef regels met getallen.

10. **Vooruitgang.** Hoe verbeteren personages (XP, milestones, sessie-einde-checks, skill-verbetering na falen, Advancement/Growth)? Wat is een gebruikelijke tempo/schaal?

11. **Conditions en statuseffecten.** Lijst met korte werking per conditie.

12. **Voorbeeld van een personagenblad.** Een volledig ingevuld voorbeeldpersonage in plain tekst/JSON, met precies de velden zoals een speler ze nodig heeft op zijn blad, plus een voorbeeld van het bijbehorende "state"-fragment dat een DM bijhoudt tijdens het spel (bv. `{"hp":{"current":11,"max":11},"sanity":{"current":60,"max":60},"luck":50,"conditions":[]}`).

**Extra: korte DM-aanwijzingen voor de AI-spelleider** (maximaal 15 regels, als opsomming):
- Welke dingen mag de DM nooit vergeten bij dit systeem (bv. altijd Sanity-verlies melden, Bonds laten meewegen).
- Welke worpen vraagt de DM aan spelers en welke doet de DM zelf, en welke informatie blijft geheim voor spelers (DC's, tegenstanderswaarden).
- Hoe lang en wat voor stijl past bij dit systeem (ritme van scènes, hoe gevaarlijk is het).
- Veelgemaakte fouten van AI-spelleiders in dit systeem.

Als je klaar bent: geef onderaan een lijst met **open vragen of onzekerheden**, zodat ik die kan nalopen in het regelboek.
