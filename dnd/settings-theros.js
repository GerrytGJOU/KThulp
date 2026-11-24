/* Setting "Theros": een Grieks-mythologische wereld van goden, helden, poleis en Nyx, vrij naar Theros (Magic: The Gathering / Mythic Odysseys of Theros).
   Eigen samenvatting en vrije interpretatie (geen overname van uitgegeven tekst). Registreert zichzelf bij DNDSettings. Geen DM-geheimen. */
(function (root) {
  "use strict";
  const D = typeof module === "object" && module.exports ? require("./settings-data.js") : root.DNDSettings;
  const F = typeof module === "object" && module.exports ? require("./settings-factory.js") : root.DNDSettingsFactory;
  const N = "Theros";

  D.register(F.build({
    id: "theros", name: N,
    blurb: "Theros: een Grieks-mythologische wereld van goden, helden, stadstaten (poleis), monsters en de sterrenhemel Nyx. Naar Mythic Odysseys of Theros, vrij ingevuld. Zonder kaart.",
    world: "Theros (een Grieks-mythologische wereld van goden, helden en poleis)",
    exYear: 412, exRegA: "REG-MELETIS", exRegB: "REG-AKROS",
    /* reistijden in dagen te voet, te paard of per schip; schattingen */
    travel: {
      "REG-MELETIS|REG-AKROS": 8, "REG-MELETIS|REG-SETESSA": 7, "REG-MELETIS|REG-SKOPHOS": 8, "REG-AKROS|REG-SETESSA": 6, "REG-AKROS|REG-SKOPHOS": 4,
      "REG-SETESSA|REG-SKOPHOS": 9, "REG-MELETIS|REG-ZEE": 1, "REG-AKROS|REG-ZEE": 1, "REG-SETESSA|REG-ZEE": 2, "REG-SKOPHOS|REG-ZEE": 2,
      "REG-ZEE|REG-ONDERWERELD": 3, "REG-ONDERWERELD|REG-MELETIS": 3
    },
    prompt: {
      naming: "Gebruik voor alle eigennamen (goden, plaatsen, volken, personen, voorwerpen, titels) de Griekse of Grieks klinkende vorm uit de campagnecanon (Heliod, Thassa, Erebos, Meletis, Akros enz.) en vertaal ze niet; verzin nieuwe namen in dezelfde stijl en gebruik ze daarna consequent. Dat geldt ook voor namen in worldDelta, location en newNpcs.",
      geoCheck: "Controleer geografie met de regio's uit de canon (Meletis, Akros, Setessa, Skophos, de Zee, de Onderwereld) en de verwijzingen naar Nyx.",
      exInGame: "{\"inGame\":{\"date\":\"7 september 412\",\"timeOfDay\":\"ochtend\",\"location\":\"Meletis, de Agora\"},",
      exPlace: "'Meletis, de Agora'",
      lootTone: "Theros (goddelijke gunsten, zegeningen en vloeken; offers, kransen en wapens met een verhaal)",
      lootNo: "geen wapens of relieken van een god zelf en geen unieke legendarische voorwerpen uit de canon"
    },
    style: "Mythic ancient-Greek-inspired fantasy illustration, painterly, marble and bronze, golden Mediterranean sunlight, dramatic skies with subtle starry Nyx accents, believable anatomy, period-accurate costume and architecture.",
    creator: {
      magicWorld: "goddelijke magie in Theros (gunsten en vloeken van de goden)",
      intro: "Dit is een nieuw personage in Theros, een Grieks-mythologische wereld (D&amp;D 2024 als regelsysteem). Goden bemoeien zich met sterfelijken; helden worden vereerd, hoogmoed wordt gestraft. Kies een god of een patroon die je volgt of verzaakt.",
      langsTip: "Je spreekt Common (Grieks klinkend) plus twee Standard Languages naar keuze. In Theros horen daar o.a. Celestial (de taal van de sterren en goden), Sylvan (de taal van satyrs en natuur) en Primordial (zee en vuur) bij.",
      commonLang: "Common (de taal van de poleis)",
      species: {
        Human: { tolk: "Mensen uit een polis: soldaten, kooplieden, geleerden of gebrandmerkte helden." },
        Centaur: { label: "Centaur", speed: 40, size: "Medium", tolk: "Centauren van de vlakten en de bergen; snelle jagers en krijgers. Eigen species; DM-goedkeuring.",
          traits: [["Fey", "Je telt als een Fey en Humanoid."], ["Charge", "Na minstens 30 ft lopen in een rechte lijn: een extra aanval met je hoeven (bijv. 1d6 bludgeoning)."], ["Equine Build", "Je telt als een grootte groter voor dragen; klimmen kost extra beweging."], ["Survivor", "Proficiency in een skill uit Animal Handling, Medicine, Nature of Survival."]] },
        Leonin: { label: "Leonin", speed: 35, size: "Medium", tolk: "Leonin van de steppen en de poleis; trotse, leeuwachtige krijgers en jagers. Eigen species; DM-goedkeuring.",
          traits: [["Darkvision", "60 ft."], ["Claws", "Unarmed strike met klauwen (1d4 slashing)."], ["Hunter's Instincts", "Proficiency in een skill uit Athletics, Intimidation, Perception of Survival."], ["Daunting Roar", "Bonus Action: wezens in 10 ft moeten een Wisdom save doen of worden frightened (PB keer per Long Rest)."]] },
        Minotaur: { label: "Minotaur", speed: 30, size: "Medium", tolk: "Minotauren, vaak gebrandmerkt door een oude erfenis; sterk en meedogenloos of juist rustig en eerlijk. Eigen species; DM-goedkeuring.",
          traits: [["Horns", "Unarmed strike met hoorns (1d6 piercing)."], ["Goring Rush", "Na Dash: een extra hoornaanval als Bonus Action."], ["Hammering Horns", "Na een melee-aanval: duw het doelwit tot 10 ft weg (Strength save)."], ["Imposing Presence", "Proficiency in Intimidation of Persuasion."]] },
        Satyr: { label: "Satyr", speed: 35, size: "Medium", tolk: "Satyrs van bossen en feesten; vrolijk, luidruchtig, soms gevaarlijk. Eigen species; DM-goedkeuring.",
          traits: [["Fey", "Je telt als een Fey en Humanoid."], ["Ram", "Hoorns (1d4 bludgeoning) als unarmed strike."], ["Magic Resistance", "Advantage op saves tegen spells en andere magische effecten."], ["Mirthful Leaps", "Springen met een d8-bonus (PB keer per Long Rest)."], ["Reveler", "Proficiency in Performance en Persuasion; een instrument."]] },
        Triton: { label: "Triton", speed: 30, size: "Medium", tolk: "Tritons van de zee en de kusten; zeebewoners met een eigen cultuur. Eigen species; DM-goedkeuring.",
          traits: [["Amphibious", "Je kunt lucht en water ademen."], ["Control Air and Water", "Cantrips en spells met water of wind (PB keer per Long Rest)."], ["Emissary of the Sea", "Je kunt met dieren in de zee praten."], ["Guardians of the Depths", "Resistance tegen Cold damage; Swim 30 ft."]] }
      },
      lineage: {},
      langs: ["Celestial", "Sylvan", "Primordial", "Elvish", "Giant", "Draconic", "Common Sign Language"],
      inspiration: [
        "A · Atleet van Akros — Human/Leonin · Fighter/Barbarian: draagt de eer van zijn polis",
        "B · Geleerde uit Meletis — Human/Satyr · Wizard/Bard: zoekt kennis over de goden",
        "C · Jager van Setessa — Centaur/Human · Ranger/Druid: dient Nylea en de natuur",
        "D · Dienaar van een god — Human/Minotaur · Cleric/Paladin: priester of heilige krijger van Heliod, Erebos of een andere god",
        "E · Zeevaarder en verhalenverteller — Triton/Human · Bard/Rogue: kent de zee en haar geheimen",
        "F · Gebrandmerkt door een godenvloek of -zegen — Human/Satyr · Warlock/Sorcerer (vraagt DM-goedkeuring)"
      ],
      speciesTip: "Standaard toegestaan: Human, Centaur, Leonin, Minotaur, Satyr en Triton (eigen species, DM-goedkeuring). Andere species alleen als voorstel via de DM.",
      aanleiding: "Aanleiding / startsituatie (bv. welke god heeft je een teken gegeven, welke polis heeft je uitgezonden, of waarom ben je op reis?)",
      classTolk: {
        Barbarian: "Past bij krijgers van de steppe of de bergen, of een held met goddelijke razernij: geschikt.",
        Bard: "Past bij rapsoden en dichters die de daden van helden bezingen: zeer geschikt.",
        Cleric: "Past zeer goed: priester van een god (Heliod, Thassa, Erebos, Purphoros, Nylea, Phenax, Iroas, Mogis, Karametra, Keranos, Ephara, Kruphix, Pharika); je domein volgt je god.",
        Druid: "Past bij Nylea en de natuur, of bij de zee of de wind; DM-goedkeuring voor de keuze van patroon.",
        Fighter: "Past zeer eenvoudig: hoplite, atleet of held.",
        Monk: "Past bij atleten en asceten (bijv. een volgeling van een god van strijd of wijsheid); DM-goedkeuring.",
        Paladin: "Past goed: heilige eed aan een god of een polis; de god bepaalt de eed.",
        Ranger: "Past zeer eenvoudig: jager of zwerver, vaak bij Nylea.",
        Rogue: "Past zeer eenvoudig: dief, spion of rondtrekkende handelaar, soms met Phenax.",
        Sorcerer: "Past bij een afstammeling van een god of een gebrandmerkt wezen; DM-goedkeuring.",
        Warlock: "Past goed: een pact met een god, een Titan of een wezen uit Nyx; DM-goedkeuring.",
        Wizard: "Past bij een geleerde uit Meletis die de geheimen van de goden bestudeert."
      }
    },
    canonParts: {
      tone: "mythische fantasy: heldendom, hoogmoed en straf, goden die zich met sterfelijken bemoeien, offers, lotsbestemming; met ruimte voor humor, wijn en kleine menselijke momenten.",
      settingRules: "- Theros (zie S1): D&D 5e 2024 als mechanische basis met een mythische toon. Alle species uit de lijst en alle classes zijn mogelijk; de DM past goddelijke gunst en straf toe. De goden zijn echt, maar spreken zelden rechtstreeks; hun tekens, offers en vloeken sturen de verhalen. Class- en spell-mechanieken blijven ongewijzigd tenzij expliciet goedgekeurd.",
      premise: F.premiseCanon(N, "Een held wordt gemaakt door daden, goddelijke gunst en offers; hoogmoed (hubris) trekt de aandacht van de goden."),
      canonNpcs: F.npcCanon("De goden en grote helden spreken zelden rechtstreeks; hun wil blijkt uit tekens, orakels en gevolgen."),
      consistent: "passend bij Theros"
    },
    canon: {
      s1_wereld_theros: {
        title: "S1 Theros: de wereld (publiek voor spelers en DM)",
        text: [
          "# S1 Theros: de wereld",
          "Theros is een wereld waar goden, helden en monsters naast elkaar bestaan. Boven de wereld ligt Nyx, de sterrenhemel, waar de goden wonen en waar sterfelijken die de goden behagen tot sterren worden. Onder de wereld ligt de Onderwereld, waar de doden naartoe gaan. Zee, vuur, wijsheid, oorlog en jacht hebben allemaal hun god. Offers, kransen en tempels zijn dagelijkse praktijk. Helden mogen goddelijke gunst verwerven; hoogmoed wordt gestraft.",
          "",
          "## Kalender",
          "Tijdrekening in Theros is een eigen interpretatie: jaren worden geteld sinds de stichting van de eerste polis. Standaard begint de campagne in het jaar 412. We gebruiken gewone maanden (januari t/m december); schrijf datums als \"7 september 412\".",
          "",
          "## Regio's (REG-id's)",
          "- REG-MELETIS: de stad van geleerden, filosofen, magiërs en kooplieden; wijsheid, boeken en discussie; Heliod en de Kring der Denkers zijn er sterk.",
          "- REG-AKROS: de krijgerspolis, zeer militaristisch; dienst aan Iroas en Mogis; atleten, soldaten en goedgekeurde rivaliteit.",
          "- REG-SETESSA: de polis van jagers, boogschutters en natuurvolgers; Nylea wordt hier vereerd; weinig muren, veel bossen en een sterke band met dieren.",
          "- REG-SKOPHOS: de polis van smeden en vuur in het noorden, aan de rand van de Ashlands onder de rokende berg Vesios; smeden, mijnwerkers en pottenbakkers, ovens die dag en nacht branden. Purphoros is er de god en zijn tempel de trots van de stad.",
          "- REG-ZEE: de zee en de kustwateren, met tritons, zeemonsters en eilanden; Thassa, godin van de zee, beschermt en bedreigt.",
          "- REG-ONDERWERELD: het rijk van Erebos, god van de doden; de zielen worden daar vastgehouden; sterfelijken die er komen betalen met aanzien of bloed.",
          "- Nyx (de sterrenhemel) is geen regio op de kaart; teken ervan zijn dromen, orakels, sterren en goddelijke zegeningen. Gebruik Nyx in de vertelling, niet als reisbestemming.",
          "",
          "## De goden (kort)",
          "- Heliod: god van de zon en van recht en orde; patroon van priesters en rechters.",
          "- Thassa: godin van de zee, beweging en geheim.",
          "- Erebos: god van de doden en de Onderwereld; hij sluit contracten.",
          "- Purphoros: god van smeden en vuur; maker van wonderbare werktuigen.",
          "- Nylea: godin van jacht, bossen en dieren.",
          "- Phenax: god van bedrog, geheimen en fluisteringen.",
          "- Iroas: god van overwinning en moed in de strijd; Mogis: god van wreedheid en slachting.",
          "- Karametra: godin van de oogst en het huishouden; Ephara: godin van de polis en handel; Keranos: god van onweer en inzicht; Kruphix: god van sterren en toeval; Pharika: godin van gif en genezing.",
          "",
          "## Wezens en gevaren",
          "Zeemonsters, harpijen, hydra's, gorgonen, cyclopen en titanen komen voor. Oorlogen tussen poleis, de macht van tempels en de wil van de goden zorgen voor politiek. Een gebrandmerkt of vervloekt personage valt op.",
          "",
          "(De dreiging, geheime plannen en de hoofdplot schrijft de DM zelf in C1; dit document is alleen de gedeelde wereldbasis. Dit is een vrije interpretatie op basis van Theros; de DM mag aanvullen en moet consequent blijven.)"
        ].join("\n")
      }
    }
  }));
})(typeof self !== "undefined" ? self : this);
