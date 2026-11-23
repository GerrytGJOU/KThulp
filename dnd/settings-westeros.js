/* Setting "Westeros": de wereld van A Song of Ice and Fire / Game of Thrones: de Zeven Koninkrijken, de Muur en het oosten over de Smalle Zee.
   Eigen samenvatting (geen overname van uitgegeven tekst). Registreert zichzelf bij DNDSettings. Geen DM-geheimen. */
(function (root) {
  "use strict";
  const D = typeof module === "object" && module.exports ? require("./settings-data.js") : root.DNDSettings;
  const F = typeof module === "object" && module.exports ? require("./settings-factory.js") : root.DNDSettingsFactory;
  const N = "Westeros";

  D.register(F.build({
    id: "westeros", name: N,
    blurb: "Westeros (Game of Thrones): de Zeven Koninkrijken, huizen, intriges en een wereld waarin magie bijna vergeten is. Alleen mensen; politiek en overleven staan voorop. Zonder kaart.",
    world: "Westeros (de wereld van A Song of Ice and Fire, laag-magisch)",
    exYear: 298, exRegA: "REG-KROONLANDEN", exRegB: "REG-NOORDEN",
    /* reistijden in dagen te paard of per schip over de koningsweg; schattingen */
    travel: {
      "REG-DEMUUR|REG-NOORDEN": 12, "REG-NOORDEN|REG-RIVIERLANDEN": 22, "REG-NOORDEN|REG-KROONLANDEN": 35, "REG-RIVIERLANDEN|REG-KROONLANDEN": 10,
      "REG-RIVIERLANDEN|REG-VALE": 10, "REG-VALE|REG-KROONLANDEN": 12, "REG-RIVIERLANDEN|REG-WESTERLANDEN": 8, "REG-WESTERLANDEN|REG-KROONLANDEN": 10,
      "REG-KROONLANDEN|REG-STORMLANDEN": 5, "REG-KROONLANDEN|REG-REACH": 14, "REG-WESTERLANDEN|REG-REACH": 10, "REG-REACH|REG-DORNE": 14,
      "REG-STORMLANDEN|REG-DORNE": 12, "REG-IJZEREILANDEN|REG-WESTERLANDEN": 5, "REG-IJZEREILANDEN|REG-RIVIERLANDEN": 6, "REG-KROONLANDEN|REG-ESSOS": 20
    },
    prompt: {
      geoCheck: "Controleer geografie met de regio's uit de canon (Noorden, Muur, Rivierlanden, Vale, IJzereilanden, Westerlanden, Kroonlanden, Stormlanden, Reach, Dorne, Essos).",
      exInGame: "{\"inGame\":{\"date\":\"3 mei 298\",\"timeOfDay\":\"ochtend\",\"location\":\"King's Landing, de Rode Burcht\"},",
      exPlace: "'King's Landing, de Vlooienbak'",
      lootTone: "Westeros (laag-magisch: wapens, harnassen, geld, gunsten en brieven; zelden iets echt magisch)",
      lootNo: "geen draken of drakeneieren, geen Valyrisch staal van de oude kwaliteit en geen unieke legendarische voorwerpen uit de canon"
    },
    style: "Gritty medieval political-fantasy illustration, painterly, muted cold palette, realistic armor, heraldry and stonework, overcast or firelit atmosphere, believable anatomy.",
    creator: {
      magicWorld: "magie in Westeros (zeldzaam en vaak gevaarlijk)",
      intro: "Dit is een nieuw personage in Westeros, de wereld van A Song of Ice and Fire (D&amp;D 2024 als regelsysteem). Er zijn alleen mensen; magie is zeldzaam en vaak gevaarlijk, draken zijn uitgestorven. Eer, afkomst en politiek wegen zwaarder dan krachten.",
      langsTip: "Je spreekt Common Tongue plus twee talen naar keuze. De talen hieronder zijn de gangbare keuzes in Westeros: o.a. de Oude Taal (wildlings), High Valyrian (Essos en oude huizen), Dothraki en Braavosi. In de lijst staat Sign Language voor stille talen.",
      commonLang: "Common Tongue",
      species: { Human: { tolk: "Mensen uit een van de Zeven Koninkrijken (of van over de Smalle Zee): ridder, bastaard, boer, maester of vrijbuiter." } },
      lineage: {},
      langs: ["High Valyrian", "Dothraki", "Old Tongue", "Braavosi", "Ghiscari", "Sign Language"],
      inspiration: [
        "A · Bastaard van een groot huis — Human · Fighter/Rogue: nooit helemaal erkend, altijd beoordeeld",
        "B · Jongere zoon van een ridderhuis — Human · Fighter/Paladin: zoekt een eigen plek in de wereld",
        "C · Maester-leerling of geheime kennis — Human · Wizard/Cleric (vraagt DM-goedkeuring)",
        "D · Zwaardhuurling uit de Vrije Steden — Human · Fighter/Rogue/Bard: wil goud, maar heeft een code",
        "E · Wachter van de Muur — Human · Ranger/Fighter: koud, trouw en vergeten door de wereld",
        "F · Gebrandmerkt door een oud bloed of een verboden geloof — Human · Warlock/Druid/Sorcerer (vraagt DM-goedkeuring)"
      ],
      speciesTip: "In Westeros zijn alleen mensen speelbaar (Human). Andere volken (Children of the Forest, reuzen, Others) zijn legendes of vijanden van de DM.",
      aanleiding: "Aanleiding / startsituatie (bv. voor welk huis of welke zaak reis je naar King's Landing, of waarom ben je naar de Muur gestuurd?)",
      classTolk: {
        Barbarian: "Past bij wildlings, IJzergeboren of krijgers uit de bergen: zeer geschikt.",
        Bard: "Past bij zangers, hofnarren en spionnen; een sterke keuze in een wereld vol geruchten.",
        Cleric: "Vraagt interpretatie: septon of septa van de Faith of the Seven, priester van R'hllor of de Verdronken God; DM-goedkeuring voor krachten.",
        Druid: "Zeer zeldzaam: de Old Gods in het Noorden (weirwoods) of een groene man; DM-goedkeuring vereist.",
        Fighter: "Past zeer eenvoudig: ridder, soldaat, zwaardhuurling.",
        Monk: "Vraagt een goede reden (Faceless Men-training, vechtkunst uit Essos); DM-goedkeuring.",
        Paladin: "Vraagt interpretatie: Kingsguard, orde van de Zeven of een persoonlijke eed; krachten zijn vooral eer.",
        Ranger: "Past zeer eenvoudig: Night's Watch-verkenner, jager of woudloper.",
        Rogue: "Past zeer eenvoudig: spion, dief, boodschapper of moordenaar.",
        Sorcerer: "Zeer zeldzaam en gevaarlijk: bloedlijn met oud bloed (Valyrisch?); DM-goedkeuring vereist.",
        Warlock: "Zeer zeldzaam: een pact met een duistere macht, een god of een Faceless Man; DM-goedkeuring vereist.",
        Wizard: "Vraagt interpretatie: maester van de Citadel of een Qartheense warlock; magie blijft zeldzaam en DM-gestuurd."
      }
    },
    canonParts: {
      tone: "politieke, harde fantasy: macht, eer, verraad en gevolgen; zelden goed of kwaad zonder grijs; met ruimte voor humor, loyaliteit en kleine menselijke momenten.",
      settingRules: "- Westeros (zie S1): D&D 5e 2024 als mechanische basis, maar laag-magisch. Alleen mensen zijn speelbaar. Magie en bovennatuurlijke wezens zijn zeldzaam en gevaarlijk; de DM beslist per class, spell en voorwerp over beschikbaarheid en past de sfeer aan. Class- en spell-mechanieken blijven ongewijzigd tenzij expliciet goedgekeurd.",
      premise: F.premiseCanon(N, "Het speelveld is vooral politiek, sociaal en militair; magie is zeldzaam en een gebeurtenis."),
      canonNpcs: F.npcCanon("Grote namen (de koning, de Hand, de heren van de huizen) zijn niet zomaar voor PCs bereikbaar; hun bevelen en rangen worden gerespecteerd."),
      consistent: "passend bij Westeros"
    },
    canon: {
      s1_wereld_westeros: {
        title: "S1 Westeros: de wereld (publiek voor spelers en DM)",
        text: [
          "# S1 Westeros: de wereld",
          "Westeros is een continent met zeven koninkrijken, één Ijzeren Troon en een lange geschiedenis van oorlogen. Drie eeuwen geleden veroverde Aegon Targaryen met zijn drie draken het land. Zijn dynastie regeerde tot de opstand van Robert Baratheon; sindsdien zit hij op de troon. Winters en zomers duren jaren. Magie is bijna vergeten, de draken zijn dood, maar ver in het noorden en oosten ligt nog iets dat lang geslapen heeft.",
          "",
          "## Tijdperk en kalender",
          "Standaard speelt de campagne rond 298 AC (After Aegon), rond de tijd dat de Hand van de Koning sterft. Andere tijdperken zijn mogelijk als de spelers dat in de startsituatie vragen (bv. de Dans van de Draken rond 129 AC, de opstand van Robert rond 282 AC). In de app tellen we gewone maanden (januari t/m december); schrijf datums als \"3 mei 298\" (jaartelling AC).",
          "",
          "## Regio's (REG-id's)",
          "- REG-NOORDEN: het grote koude Noorden met Winterfell, een dun bevolkt, trots en vrij land onder Huis Stark; de Old Gods worden er nog vereerd.",
          "- REG-DEMUUR: de Muur, een ijsmuur van zeven honderd voet hoog, bewaakt door de Night's Watch tegen wat erachter leeft: de wildlingen en erger.",
          "- REG-RIVIERLANDEN: het hart van het land met de Drietand; Huis Tully in Riverrun. Veel strijd, veel doorreizigers.",
          "- REG-VALE: de bergvallei van Huis Arryn: de Eyrie, bijna onneembaar, hoog en koud.",
          "- REG-IJZEREILANDEN: zee, rots en rovers; Huis Greyjoy en de Verdronken God; de IJzergeboren leven van plundering en eer.",
          "- REG-WESTERLANDEN: rijk aan goud en mijnen; Huis Lannister in Casterly Rock.",
          "- REG-KROONLANDEN: het gebied rond King's Landing, de hoofdstad met de Rode Burcht, de Ijzeren Troon en de Kingsguard; vol hovelingen, spionnen en straatrovers.",
          "- REG-STORMLANDEN: het land van Huis Baratheon, Storm's End; wind, rotsen en zee.",
          "- REG-REACH: het vruchtbare en rijke zuidwesten; Huis Tyrell in Highgarden; ridders, bloemen en de Citadel van de maesters in Oldtown.",
          "- REG-DORNE: het zonnige, woestijnachtige zuiden; Huis Martell in Sunspear; eigen gewoonten en oude trots.",
          "- REG-ESSOS: het oosten over de Smalle Zee: de Vrije Steden (Braavos, Pentos, Volantis), de Dothraki-zee, Slavenbaai en de oude Valyrische ruïnes.",
          "",
          "## Machten en instellingen",
          "- De Ijzeren Troon: de koning, zijn Raad (Hand, Meester van de Fluisteraars, Meester van het Geld, Meester van de Wet en anderen) en de Kingsguard.",
          "- De Night's Watch: bewakers van de Muur en recruten uit alle lagen van de bevolking, inclusief veroordeelden.",
          "- De Citadel: maesters, geleerden en genezers; ze dragen een keten met schakels voor elke tak van kennis.",
          "- De Faith of the Seven: de grote kerk van de Zeven; ook de oude Old Gods, de Verdronken God van de IJzereilanden en R'hllor de Heer van het Licht uit Essos hebben aanhangers.",
          "- De Faceless Men van Braavos: een mysterieuze moordenaarsorde.",
          "- De grote huizen: Stark, Lannister, Baratheon, Tully, Arryn, Greyjoy, Tyrell en Martell, met vazallen en vijanden; huizen die Targaryen steunden zijn getekend door de oorlog.",
          "",
          "## Magie en gevaar",
          "Magie is zeldzaam. Wat bestaat is meestal subtiel, oud of gevaarlijk (visioenen, pyromantie, bloedmagie, vloeken, wargs). Wie in dit land magie bedrijft, trekt aandacht. De Others en de wildlingen vormen de ver-weg dreiging uit het noorden; politieke oorlog is dichtbij.",
          "",
          "(De dreiging, geheime plannen en de hoofdplot schrijft de DM zelf in C1; dit document is alleen de gedeelde wereldbasis. Details uit de canon zijn een samenvatting; de DM mag ze aanvullen en moet ze consequent houden.)"
        ].join("\n")
      }
    }
  }));
})(typeof self !== "undefined" ? self : this);
