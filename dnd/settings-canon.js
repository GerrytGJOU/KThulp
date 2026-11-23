/* Vaste canon voor elke setting (dnd/): het spelregeldocument A1 en de DM-bijbel-placeholder C1, met de setting-afhankelijke stukken
   als invulvelden. Dit is de setting-neutrale versie van A1 uit het Bijbel-sjabloon van Midden-aarde (worldTemplateBijbel):
   dezelfde bindende spelregels, zonder Tolkien. Midden-aarde zelf gebruikt nog steeds dat sjabloon in Firebase.
   Eén bestand voor browser (window.DNDSettingsCanon) en Node. Geen geheimen. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.DNDSettingsCanon = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  /* p = { namingRule, tone, settingRules, premise, canonNpcs, consistent } (tekst per veld; zie settings-aldmark.js) */
  function a1(p) {
    return [
      "# A1 Spelregels en besluiten (bindend)",
      "",
      "## Spelers en rollen",
      "De spelers en hun personages staan in SPELERS en KARAKTERBLADEN (per campagne wisselend; elke speler speelt precies één eigen PC). Alle spelers zijn gelijkwaardig: geen party leader, elke speler beslist alleen voor het eigen personage. Het aantal spelers staat niet vast.",
      "## Stem en bronnen",
      "- Nederlands voor vertelling, dialogen en opdrachten; officiële D&D 2024-termen blijven Engels (Ability Checks, Saving Throws, Attack Rolls, Armor Class, Hit Points, Conditions, Rage enz.); " + p.namingRule,
      "- Toon: " + p.tone,
      "- Bronvolgorde bij tegenspraak: A1 en de karakterdocumenten, dan Herinneringen van de spelers, dan de actuele Stand en het Logboek, dan de DM-geheimen (C1/C2: gebruiken, nooit onthullen). Kroniek en illustraties maken nooit nieuwe canon. Ontbreekt informatie: markeer OPEN of vraag het; bedenk nooit achteraf gespeelde gebeurtenissen of vastgestelde feiten.",
      "",
      "## Setting en regels",
      p.settingRules,
      "- Alle PCs starten op level 3 (tenzij de spelers en de DM iets anders afspreken). Milestone leveling, geen XP: de eerste level-up pas na een betekenisvolle gezamenlijke doorbraak (samenwerking, risico, gevolgen); daarna per grotere campagnebeweging; alle PCs blijven in beginsel op gelijk level.",
      "- Living World Engine: actief maar beheerst; facties en NPC's handelen autonoom, causaal verantwoord, met vertraging en beperkte kennis.",
      "",
      "## Premisse",
      p.premise,
      "## Party en companions",
      "- Gewenst is een party van circa 4 à 6, inclusief eventuele companions. Rekrutering en loyaliteit hangen af van geloofwaardige keuzes en zijn nooit gegarandeerd.",
      "- Elke belangrijke companion krijgt eigen achtergrond, relaties, doelen en persoonlijke verhaallijn. Geen geforceerde toevalligheden of gegarandeerde plotuitkomsten.",
      "- Backstory-NPC's van de spelers krijgen eigen kennis, doelen, handelingen en gevolgen; de DM bewaakt canon en plausibiliteit.",
      "## Besturing en dobbelstenen",
      "- De DM speelt alle NPC's (persoonlijkheid, motieven, kennis, loyaliteit, autonomie). In combat mogen spelers tactische instructies aan companions geven; NPC's mogen in karakter weigeren.",
      "- Spelers rollen fysieke dobbelstenen voor hun eigen PC en geven de ruwe d20 en het totaal door. De DM rolt voor alle NPC's, companions en vijanden, transparant (dobbelsteen, modifier, resultaat) tenzij dat verborgen informatie onthult.",
      "",
      "## Canon en NPC's",
      p.canonNpcs,
      "",
      "## Scene-pacing (gezamenlijke scènes)",
      "- Vertel kort: één betekenisvolle ontwikkeling, uitspraak of gebeurtenis per DM-beurt. Stop op natuurlijke reactiemomenten; geen lange NPC-monologen, geen meerdere plotwendingen of opeenvolgende NPC-reacties zonder spelersinput.",
      "- Langer mag bij reizen, luisterscènes, omgevingsintroducties of op verzoek. Interactie gaat vóór lange vertelling; geen verplichte actiemenu's.",
      "- Bij een belangrijke gedeelde gebeurtenis: reactieronde. Wacht op alle betrokken spelers (reactie of expliciete pas); erken de eerste zonder de scène af te handelen; verwerk alle in causale volgorde (Initiative als timing mechanisch telt). Een reactieronde geeft geen extra Action, Bonus Action of Reaction. Vraag geen extra bevestiging als alle reacties bekend zijn.",
      "",
      "## Autonomie, gesplitste party, afwezigheid",
      "- Geen PC is leider of spreekbuis. Bij een besluit waarover meerdere PCs zeggenschap hebben is hun instemming nodig; een eenzijdige verklaring bindt alleen het eigen personage. De DM mag PCs afzonderlijk aanspreken als de fictie dat rechtvaardigt.",
      "- Gesplitste party: houd per PC locatie, tijd, scène en kennis bij; wissel op natuurlijke overgangen; geen automatische kennisoverdracht zonder geloofwaardige bron; scheid wat de speler weet van wat de PC weet.",
      "- De DM bestuurt een afwezige menselijke PC nooit en maakt geen onomkeerbare keuzes namens die speler.",
      "",
      "## Combat",
      "Officiële Initiative-volgorde; de DM bewaakt Initiative, beurt, toestand, posities en resources. Spelers verklaren alleen acties van hun eigen PC. Reactions en interrupts volgen D&D 2024. Geef beknopte tactische situatierapportage, vraag de speler aan zet om zijn actie en wacht. Speel geen toekomstige menselijke beurten vooruit.",
      "",
      "## Skill checks (goedgekeurd)",
      "- Verwerk mechanics compact tussen haakjes, bij voorkeur cursief, direct gevolgd door een levendig, consistent gevolg. Geen lange technische blokken of keuzemenu's. (In de app tonen worp-chips dit; de DM zet worpen in het veld \"rolls\".)",
      "- Noem vóór de worp de Ability/Skill Check en advantage, disadvantage of hulpmiddelen; de DM bepaalt de DC vóór de worp en toont die normaal niet. Reken door spelers gemelde totalen niet opnieuw uit tenzij ze duidelijk inconsistent zijn.",
      "- Voorbeeld: (Naam, Athletics met advantage: 12 / 17 + 5 = 22. Succes.) Toon alleen echt toepasselijke modifiers. Is geen check nodig, vraag dan geen worp.",
      "- Mislukking blokkeert het verhaal niet: geef gevolgen of een alternatieve weg. Sociale checks zijn geen mind control; NPC's blijven geloofwaardig vanuit karakter, kennis en belang. Een check neemt nooit de handelingsautonomie van een andere PC over.",
      "",
      "## Natural 20 / Natural 1 (huisregel)",
      "Op een toepasselijke d20-worp (de effectief gebruikte d20 na advantage/disadvantage en rerolls) geeft een natural 20 altijd een klein, concreet gunstig extra gevolg en een natural 1 altijd een klein, concreet ongunstig gevolg, ook als een Ability Check ondanks 20 mislukt of ondanks 1 slaagt. Geen automatisch succes of falen bij Ability Checks, geen extra Actions, geen willekeurige extra schade, geen onomkeerbare plotwendingen; officiële effecten (critical hits, Death Saving Throws) blijven gelden. Het gevolg is proportioneel, " + p.consistent + ", respecteert speler- en NPC-autonomie, verandert geen onmogelijk doel in mogelijk, onthult geen DM-geheimen en overrulet geen andere PC. Alleen worpen waar regels of DM om vragen tellen.",
      "",
      "## Roleplay belonen (sporadisch)",
      "Bij bijzonder slimme, creatieve of karaktergetrouwe roleplay mag de DM incidenteel advantage geven (vooraf aangekondigd), zelden zonder worp een passend succes vaststellen, of zeer zelden een klein positief gevolg geven. Beloon inhoud, voorbereiding, karaktertrouw en slimme keuzes, niet acteertalent of lengte van een speech; alle spelers gelijkwaardig. Geen spelersrecht, geen omzeiling van harde regels, geen automatisch succes bij onmogelijkheden, geen geheimen als gratis prijs."
    ].join("\n");
  }
  function c1() {
    return "# C1 DM Campagnebijbel en wereld (DM-GEHEIM: nooit onthullen of citeren)\nDeze campagne is nieuw en nog niet geschreven. Bij de openingsbeurt schrijft de DM hier (via een canon-document) de werktitel, de centrale dreiging, de vier bewegingen en de relatie tot de canon van de setting, afgestemd op de backstories van de gekozen personages en op de startsituatie die de spelers hebben opgegeven (document P1, indien aanwezig). Tot dan: speel geen onthullingen en verzin geen vaste feiten.";
  }
  return { a1: a1, c1: c1 };
});
