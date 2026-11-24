/* Vaste settings voor de d100-regelsets (dnd/): Delta Green (heden), Call of Cthulhu (Nieuw-Engeland, 1925) en Cthulhu Dark Ages (Engeland, rond 1000).
   Compacte builder (zoals settings-spec.js voor D&D) die een volledige setting met `ruleset` oplevert. Alleen publieke wereldtekst in eigen woorden; geen geheimen.
   Registreert zichzelf bij DNDSettings. De regels zelf staan in settings-rulesets-d100.js en settings-ruleref.js (R1). */
(function (root) {
  "use strict";
  const D = typeof module === "object" && module.exports ? require("./settings-data.js") : root.DNDSettings;
  const NL = String.fromCharCode(10);
  function build(sp) {
    const REG = sp.regions, TR = sp.travel, regName = id => (REG.find(r => r[0] === id) || [])[1];
    const conns = id => Object.keys(TR).filter(k => k.split("|").indexOf(id) >= 0).map(k => { const p = k.split("|"), o = p[0] === id ? p[1] : p[0]; return o + " (" + TR[k] + " dagen)"; }).join(", ");
    const cut = d => { const i = d.indexOf(";"); return i >= 0 ? d.slice(0, i) : d.replace(/\.$/, ""); };
    const dt = sp.startDate;
    const S1 = ["# S1 De wereld", "", "## 1. Uitgangspunt", sp.blurb, "", "Bronhiërarchie: " + sp.source + ". " + sp.limits, "", "## 2. Regio’s en plaatsen",
      REG.map(r => "### " + r[0] + " — " + r[1] + NL + r[2] + NL + "Reisverbindingen: " + conns(r[0])).join(NL + NL), "",
      "## 3. Facties", sp.factions.map(f => "- **" + f[0] + "** — " + f[1]).join(NL), "",
      "## 4. Tijd, taal en economie", "App-start: " + dt + ". " + sp.economy, "",
      "## 5. Reizen en dagelijks leven", sp.travelNote, "",
      "## 6. Campagnehaakjes [N]", REG.map(r => "- " + r[1] + ": een lokale aanleiding rond " + cut(r[2]) + ". Bepaal betrokken partijen en minstens twee mogelijke uitkomsten; geen vooraf vastgelegde schuldige.").join(NL)].join(NL);
    const S2 = ["# S2 Het onnatuurlijke en zijn grenzen", "", sp.unnatural, "", "## Grenzen", sp.limits].join(NL);
    return {
      id: sp.id, name: sp.name, version: 1, blurb: sp.blurb, ruleset: sp.ruleset, world: { travel: TR, anchors: [] }, map: { enabled: false }, ui: { name: sp.name },
      prompt: {
        world: sp.name + "; " + sp.blurb,
        naming: sp.naming, noOvershadow: sp.noOvershadow, bigFigure: sp.bigFigure,
        geoCheck: REG.map(r => r[0] + " = " + r[1] + ": " + r[2]).join("; "),
        exInGame: "{\"inGame\": {\"date\": \"" + dt + "\", \"timeOfDay\": \"ochtend\", \"location\": \"" + regName(sp.exRegA) + ", " + sp.exPlaceName + "\"},",
        exPlace: "'" + regName(sp.exRegA) + ", " + sp.exPlaceName + "'", exYear: String(sp.year), exRegA: sp.exRegA, exRegB: sp.exRegB,
        lootTone: sp.loot, lootNo: sp.lootNo,
        bookFigures: "Volg " + sp.source + "; verzin geen bekende historische of fictieve figuren zonder grond in S1.",
        idLegend: "FIG- vaste figuren uit de canon", noCreateFig: "Vaste figuren (FIG-) maak je niet aan", canonName: "een afwijking van de broncanon registreer je"
      },
      style: { base: sp.styleBase, avoid: sp.styleAvoid, portraitNote: "Follow written age, scars, hair, clothing and equipment; consistent character design, no actor likenesses.", locNote: "Follow region geography, period architecture and materials; no anachronisms." },
      canonParts: {
        namingRule: sp.naming,
        tone: sp.blurb + " Vertel in het Nederlands, met Engelse spelterminologie. " + sp.toneNote,
        settingRules: ["- Regelsysteem: " + sp.rulesLabel + " (zie R1). Personages worden gemaakt met het generieke personagenblad van de app.", "- " + sp.unnatural, "- " + sp.limits, "- " + sp.economy,
          "- Reistijden zijn geschatte dagen tussen regiohubs, symmetrisch; vervoer, route en omstandigheden wijzigen ze.", "- Vertelling Nederlands, termen Engels; eindig met de situatie zonder keuzemenu. Vragen tussen haakjes kort buiten spel beantwoorden."].join(NL),
        premise: sp.premise, canonNpcs: ["- Respecteer vaste figuren en kennisgrenzen; zij lossen geen missies voor de spelers op.", "- Geef belangrijke NPC’s een wil, een angst en een geheim; bijfiguren hebben grenzen.", "- [C] broncanon, [I] interpretatie, [N] nieuwe inhoud. Leg afwijkingen vast met datum, oorzaak en gevolgen."].join(NL),
        consistent: sp.name + "; " + sp.source
      },
      canon: { s1_wereld: { title: "S1 De wereld", text: S1 }, s2_machten: { title: "S2 Het onnatuurlijke en zijn grenzen", text: S2 } }
    };
  }

  D.register(build({
    id: "deltagreen", ruleset: "dg", rulesLabel: "Delta Green", year: 2024, startDate: "12 oktober 2024", name: "Delta Green — Het Programma",
    blurb: "Geheime operaties tegen het Unnatural in het hedendaagse Amerika; agenten sluiten de zaak, houden hun dekmantel intact en dragen de gevolgen mee naar huis.",
    source: "Delta Green (Arc Dream Publishing); alleen publiek bekende lore, geen geheimen uit boeken",
    limits: "Het Unnatural is zeldzaam, onbegrepen en kost altijd iets: SAN, relaties of dekmantel. Agenten zijn mensen met een baan, een gezin en een bureaucratie in hun rug; er is geen heldenplot-armor en geen magie als gereedschap.",
    unnatural: "Het Unnatural is alles wat niet in de wetenschap past: wezens, rituelen, artefacten en ideeën die wie ze begrijpt beschadigen. De spelleider onthult weinig, toont vooral gevolgen en laat de agenten zelf conclusies trekken.",
    economy: "Geen gouden munten: gebruik euro/dollar-schaal in verhalen, requisition voor uitrusting (aanvraag, dekmantel, toestemming) en persoonlijke middelen. De agenten werken voor een gewone werkgever (FBI, leger, ziekenhuis, universiteit) en hebben een dagelijks leven.",
    travelNote: "Reizen gaat per auto, trein of vliegtuig; reisdagen zijn globaal. Elke reis laat sporen na (declaraties, camera’s, getuigen). Operaties worden onderbroken door Home scenes.",
    naming: "Gebruik Amerikaanse en internationale namen passend bij de regio; behoud spelling in worldDelta, location en newNpcs.",
    noOvershadow: "Vaste instanties (FBI, Pentagon, MAJESTIC-12) lossen de zaak niet voor de agenten op; ze hebben eigen doelen en beperkte beschikbaarheid.",
    bigFigure: "een confrontatie met een Unnatural entiteit of een hoge functionaris", loot: "informatie, contacten, bewijs, requisitieformulieren, geld uit eigen zak",
    lootNo: "geen wapens of voertuigen buiten wat requisition of eigen bezit toelaat",
    styleBase: "gedempte fotografische noir, fluorescerend kantoorlicht, regenachtige parkeerplaatsen, bureaucratisch grijs, korrelig, realistisch; monsters nooit volledig in beeld",
    styleAvoid: "Avoid: fantasy elements, gore posters, anime or cartoon look, oversaturated colors, text, captions, watermarks, logos, borders.",
    toneNote: "Houd het sober en onheilspellend; toon gevolgen in plaats van monsters, en laat bureaucratie en dekmantels spanning geven.",
    premise: ["- Nieuwe campagne; de Handler kiest een eerste operatie op basis van de backstories en de motivaties van de agenten en legt die vast in C1 en de Stand.", "- Elke agent heeft Bonds en een leven buiten de operatie; Home scenes zijn onderdeel van het spel.", "- Een zaak kent een onderzoeksfase, een confrontatie en een nasleep; gevolgen blijven bestaan."].join(NL),
    exRegA: "REG-WASHINGTON", exRegB: "REG-NOORDOOST", exPlaceName: "een kantoor aan het eind van de dag",
    regions: [
      ["REG-WASHINGTON", "Washington D.C. en omgeving", "Federale agentschappen, het Pentagon en Langley; bureaucratie, dekmantels en geheime vergaderingen."],
      ["REG-NOORDOOST", "Noordoost (New England en New York)", "Oude havensteden, universiteiten en kleine stadjes met lange geheimen."],
      ["REG-ZUID", "Zuidoost en Golfkust", "Moerassen, havens, congregaties en smokkelroutes."],
      ["REG-MIDWEST", "Midwesten en Grote Vlakten", "Eindeloze wegen, kleine politiekorpsen en militaire basissen."],
      ["REG-WEST", "Westkust en Zuidwesten", "Woestijnbases, grote steden, grensstreek en testgebieden."],
      ["REG-OVERZEE", "Overzee", "Buitenlandse operaties, ambassades en verre bases."]
    ],
    travel: { "REG-WASHINGTON|REG-NOORDOOST": 1, "REG-WASHINGTON|REG-ZUID": 1, "REG-WASHINGTON|REG-MIDWEST": 1, "REG-WASHINGTON|REG-WEST": 1, "REG-WASHINGTON|REG-OVERZEE": 2, "REG-NOORDOOST|REG-MIDWEST": 1, "REG-NOORDOOST|REG-ZUID": 2, "REG-NOORDOOST|REG-OVERZEE": 2, "REG-ZUID|REG-MIDWEST": 1, "REG-MIDWEST|REG-WEST": 1, "REG-ZUID|REG-WEST": 2 },
    factions: [["Delta Green", "Het geheime Program (en de Outlaws die zonder machtiging doorwerken); agenten met gewone banen die het Unnatural bestrijden."], ["Federale agentschappen", "FBI, DHS, het leger en de inlichtingendiensten; bureaucratisch en wantrouwend."], ["MAJESTIC-12", "Een schaduwbureaucratie rond het Unnatural, voor Delta Green een rivaal en gevaar."], ["Unnatural-netwerken", "Cultisten, verzamelaars en bezetenen die het Unnatural zoeken."], ["Lokale politie en burgers", "Sheriffs, agenten en gewone mensen die vragen stellen."]]
  }));

  D.register(build({
    id: "coc1920", ruleset: "coc", rulesLabel: "Call of Cthulhu 7e", year: 1925, startDate: "14 oktober 1925", name: "Call of Cthulhu — Nieuw-Engeland, 1925",
    blurb: "Investigators in de jaren twintig onderzoeken vreemde gebeurtenissen in Nieuw-Engeland; kennis is gevaarlijk en gezond verstand kost wat het oplevert.",
    source: "Call of Cthulhu (Chaosium) en het werk van H.P. Lovecraft; plaatsen en figuren alleen voor zover publiek bekend",
    limits: "De Mythos is groot, onverschillig en ontoegankelijk; kennis ervan kost SAN. Investigators zijn gewone mensen met een beroep, geen vechters. Gevechten zijn gevaarlijk en vluchten is een geldige keuze.",
    unnatural: "De Mythos omvat wezens, boeken, rituelen en geheimen die de menselijke geest overstijgen. De Keeper toont aanwijzingen, geen uitleg; ontmoetingen met het bovennatuurlijke zijn zeldzaam en kosten SAN.",
    economy: "Dollars en centen (jaren twintig); Credit Rating bepaalt levensstijl en contanten. Reizen en onderzoek kosten geld en tijd.",
    travelNote: "Reizen gaat per trein, auto, bus of schip; reisdagen zijn globaal. Archieven, bibliotheken en krantenredacties zijn de belangrijkste bronnen.",
    naming: "Gebruik namen passend bij Nieuw-Engeland in de jaren twintig; behoud spelling in worldDelta, location en newNpcs.",
    noOvershadow: "Vaste instellingen (universiteit, politie, kerk) lossen het mysterie niet op; ze hebben eigen belangen en beperkte kennis.",
    bigFigure: "een confrontatie met een wezen van de Mythos of een cultleider", loot: "aanwijzingen, brieven, bibliotheekkaarten, geld, geheime kennis",
    lootNo: "geen wapens of voorwerpen die het gevaar van de Mythos wegnemen",
    styleBase: "sepia en donkere olieverf, interieurs uit de jaren twintig, gaslicht en regen, kranten en vergeelde foto’s; monsters alleen gesuggereerd",
    styleAvoid: "Avoid: modern objects, gore posters, anime or cartoon look, fully visible monsters, text, captions, watermarks, logos, borders.",
    toneNote: "Bouw dreiging op; toon gevolgen en aanwijzingen vóór monsters, en laat kennis zwaar wegen.",
    premise: ["- Nieuwe campagne; de Keeper kiest een eerste mysterie op basis van de backstories van de Investigators en legt het vast in C1 en de Stand.", "- Een mysterie heeft aanwijzingen, getuigen en een gevolg; essentiële aanwijzingen zitten nooit achter één mislukte worp.", "- SAN-verlies en gevolgen blijven bestaan."].join(NL),
    exRegA: "REG-ARKHAM", exRegB: "REG-KINGSPORT", exPlaceName: "de Miskatonic-bibliotheek",
    regions: [
      ["REG-ARKHAM", "Arkham", "Miskatonic University, oude huizen en een krant; een stad met lange schaduwen."],
      ["REG-KINGSPORT", "Kingsport", "Oude havenstad op de rotsen; mist, gambrel-daken en oude families."],
      ["REG-INNSMOUTH", "Innsmouth", "Vervallen havenstadje met een slechte reputatie en weinig bezoekers."],
      ["REG-DUNWICH", "Dunwich", "Afgelegen heuvels, vervallen boerderijen en zwijgzame inwoners."],
      ["REG-BOSTON", "Boston", "Grote stad met musea, archieven, ziekenhuizen en een onderwereld."],
      ["REG-OVERZEE", "Overzee", "Europa, Egypte, het hoge noorden en andere verre plaatsen."]
    ],
    travel: { "REG-ARKHAM|REG-KINGSPORT": 1, "REG-ARKHAM|REG-INNSMOUTH": 1, "REG-ARKHAM|REG-DUNWICH": 1, "REG-ARKHAM|REG-BOSTON": 1, "REG-KINGSPORT|REG-INNSMOUTH": 1, "REG-KINGSPORT|REG-BOSTON": 1, "REG-BOSTON|REG-DUNWICH": 2, "REG-BOSTON|REG-OVERZEE": 12, "REG-ARKHAM|REG-OVERZEE": 13 },
    factions: [["Miskatonic University", "Universiteit met een belangrijke bibliotheek en eigen geheimen."], ["De politie en het gerecht", "Lokale agenten en rechters; wantrouwend tegenover vreemden."], ["Cultisten en geheime orden", "Genootschappen die de Mythos dienen of zoeken."], ["De pers", "Kranten en journalisten die verhalen willen."], ["Kerken en gemeenschappen", "Gelovigen en pastoors met eigen kennis."]]
  }));

  D.register(build({
    id: "cda1000", ruleset: "cda", rulesLabel: "Cthulhu Dark Ages 3e", year: 1001, startDate: "1 september 1001", name: "Cthulhu Dark Ages — Engeland, rond het jaar 1000",
    blurb: "Een wereld van geloof, volksverhalen en gevaar: in Engeland rond het jaar 1000 onderzoeken gewone mensen vreemde gebeurtenissen die kerk en overlevering niet verklaren.",
    source: "Cthulhu Dark Ages (Chaosium); historische context van Angelsaksisch Engeland rond 1000",
    limits: "De Mythos verschijnt als vreemde geluiden, tekenen en wezens die men in geloof en volksverhalen probeert te vatten. Moderne kennis en uitrusting bestaan niet; mensen leven van landbouw, ambacht en gemeenschap.",
    unnatural: "Geloof en volkswijsheid kleuren hoe mensen het onverklaarbare duiden (heilige, duivel, elf of oud geest); onderscheid dat van de Mythos zelf, die onverschillig en ouder is dan al die verhalen.",
    economy: "Geld is zeldzaam: ruilhandel, zilverpenningen, voedsel, onderdak en gunsten tellen; status en verplichtingen bepalen wat iemand krijgt. Wapens en pantser zijn eenvoudig (speer, bijl, zwaard, boog, schild, mail).",
    travelNote: "Reizen gaat te voet, te paard of per rivier; reisdagen zijn globaal. Wegen zijn slecht, weer en seizoen tellen, en onderdak vraagt gastvrijheid of een wederdienst.",
    naming: "Gebruik Oudengelse en Keltische namen en plaatsnamen passend bij het gebied; behoud spelling in worldDelta, location en newNpcs.",
    noOvershadow: "Koningen, bisschoppen en heren lossen het mysterie niet op; ze hebben eigen belangen en beperkte kennis.",
    bigFigure: "een confrontatie met een wezen van de Mythos of een bisschop of heer", loot: "voedsel, onderdak, zilverpenningen, relikwieën, gunsten en kennis",
    lootNo: "geen wapens of relikwieën die het gevaar van de Mythos wegnemen",
    styleBase: "middeleeuwse manuscriptverlichting en donkere olieverf, houtsnede-sfeer, vuur- en kaarslicht, modder en rook; monsters alleen gesuggereerd",
    styleAvoid: "Avoid: modern objects or clothing, gore posters, anime or cartoon look, fantasy armor, text, captions, watermarks, logos, borders.",
    toneNote: "Maak geloof en de lokale gemeenschap relevant; laat het onverklaarbare via overlevering en bijgeloof binnenkomen.",
    premise: ["- Nieuwe campagne; de Keeper kiest een eerste mysterie op basis van de backstories en legt het vast in C1 en de Stand.", "- Het dorp Totburh in de Severn Valley is een mogelijke basis (zie S1); verhalen en gezag zijn lokaal.", "- Optionele Dark Ages-modules (Folk Magic e.d.) alleen als de spelers dat afspreken."].join(NL),
    exRegA: "REG-TOTBURH", exRegB: "REG-SEVERN", exPlaceName: "de grote hal",
    regions: [
      ["REG-TOTBURH", "Totburh", "Versterkt dorp in de Severn Valley; een heer, een kerk en een markt."],
      ["REG-SEVERN", "De Severn Valley", "Rivierdal met boerderijen, aanlegplaatsen en kerkdorpen."],
      ["REG-WORCESTER", "Worcester", "Bisschopsstad aan de rivier, met een kathedraal en markten."],
      ["REG-GLOUCESTER", "Gloucester", "Stad aan de Severn met een abdij en een koninklijke hal."],
      ["REG-DEAN", "Het Forest of Dean", "Oud woud met houtskoolbranders, ijzerwerkers en volksverhalen."],
      ["REG-MARCH", "De Welsh Marches", "Grensland met Wales; burchten, vetes en zwervers."]
    ],
    travel: { "REG-TOTBURH|REG-SEVERN": 1, "REG-TOTBURH|REG-WORCESTER": 3, "REG-TOTBURH|REG-GLOUCESTER": 3, "REG-TOTBURH|REG-DEAN": 2, "REG-TOTBURH|REG-MARCH": 3, "REG-SEVERN|REG-WORCESTER": 2, "REG-SEVERN|REG-GLOUCESTER": 2, "REG-GLOUCESTER|REG-DEAN": 1, "REG-GLOUCESTER|REG-WORCESTER": 3, "REG-DEAN|REG-MARCH": 2 },
    factions: [["De heer en zijn huis", "De lokale heer, zijn krijgers en zijn verplichtingen."], ["De kerk", "Priesters, monniken en nonnen; bewaarders van kennis en geloof."], ["Het gewone volk", "Boeren, ambachtslieden en kooplieden met volksverhalen."], ["De oude gebruiken", "Wijze vrouwen, genezers en overgeleverde riten."], ["Vreemde machten", "Wat aan geloof en gebruik voorbijgaat."]]
  }));
})(typeof self !== "undefined" ? self : this);
