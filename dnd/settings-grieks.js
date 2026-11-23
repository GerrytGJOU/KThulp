/* Setting "Oikoumenè (Mors Vincta)": het mythische Griekenland van het eenentwintigste jaar na de val van Ilion (id grieks-mythisch).
   Afkomstig uit de DM-campagne "Mors Vincta" van Gerben; de tekst is zijn eigen wereldbeschrijving (publiek: geen DM-geheimen, geen spelerpersonages).
   Registreert zichzelf bij DNDSettings. Ingebouwde aanpassing t.o.v. de aangeleverde JSON: creator.lineage is ingevuld (de creator heeft die nodig voor Elf). */
(function (root) {
  "use strict";
  const D = typeof module === "object" && module.exports ? require("./settings-data.js") : root.DNDSettings;
  const S = {
  "id": "grieks-mythisch",
  "name": "Oikoumenè (Mors Vincta)",
  "version": 1,
  "blurb": "Het mythische Griekenland van het eenentwintigste jaar na de val van Ilion: de grote helden zijn dood, oud of thuisgekomen, de goden handelen alleen via stervelingen, en rond de Binnenzee groeien nieuwe machten uit het westen, het noorden, het zuiden en het oosten.",
  "world": {
    "travel": {
      "REG-KORINTHIA|REG-ATTIKA": 2,
      "REG-KORINTHIA|REG-SARONISCHEGOLF": 1,
      "REG-ATTIKA|REG-SARONISCHEGOLF": 1,
      "REG-KORINTHIA|REG-ARGOLIS": 1,
      "REG-KORINTHIA|REG-ARKADIA": 2,
      "REG-KORINTHIA|REG-BOIOTIA": 2,
      "REG-KORINTHIA|REG-PHOKIS": 2,
      "REG-KORINTHIA|REG-IONISCHEEILANDEN": 3,
      "REG-ATTIKA|REG-BOIOTIA": 2,
      "REG-ATTIKA|REG-AIGAIOS": 2,
      "REG-SARONISCHEGOLF|REG-AIGAIOS": 2,
      "REG-SARONISCHEGOLF|REG-ARGOLIS": 1,
      "REG-BOIOTIA|REG-PHOKIS": 2,
      "REG-BOIOTIA|REG-THESSALIA": 3,
      "REG-PHOKIS|REG-THESSALIA": 3,
      "REG-ARGOLIS|REG-ARKADIA": 2,
      "REG-ARGOLIS|REG-LAKONIA": 3,
      "REG-ARKADIA|REG-LAKONIA": 2,
      "REG-LAKONIA|REG-KRETA": 3,
      "REG-LAKONIA|REG-ONDERWERELD": 1,
      "REG-THESSALIA|REG-EPEIROS": 4,
      "REG-THESSALIA|REG-LEMNOS": 3,
      "REG-THESSALIA|REG-THRAKIA": 5,
      "REG-IONISCHEEILANDEN|REG-EPEIROS": 2,
      "REG-IONISCHEEILANDEN|REG-HESPERIA": 8,
      "REG-IONISCHEEILANDEN|REG-AIAIA": 7,
      "REG-HESPERIA|REG-AIAIA": 2,
      "REG-AIGAIOS|REG-KRETA": 2,
      "REG-AIGAIOS|REG-LEMNOS": 3,
      "REG-AIGAIOS|REG-TROAS": 3,
      "REG-LEMNOS|REG-TROAS": 1,
      "REG-LEMNOS|REG-THRAKIA": 1,
      "REG-TROAS|REG-THRAKIA": 2,
      "REG-TROAS|REG-KAUKASOS": 15,
      "REG-KRETA|REG-KEMET": 4,
      "REG-KRETA|REG-OOSTEN": 6,
      "REG-KEMET|REG-OOSTEN": 5,
      "REG-OOSTEN|REG-KAUKASOS": 25,
      "REG-THRAKIA|REG-THULE": 35,
      "REG-HESPERIA|REG-THULE": 40
    },
    "anchors": []
  },
  "map": { "enabled": false },
  "ui": { "name": "Oikoumenè (Mors Vincta)" },
  "prompt": {
    "world": "de Oikoumenè van Mors Vincta (het mythische Griekenland en de Binnenzee, 21 jaar na de val van Ilion; goden en stervelingen leven naast elkaar, maar de goden handelen alleen via stervelingen)",
    "naming": "Gebruik voor alle eigennamen (plaatsen, volken, personen, goden, voorwerpen, titels) exact de Griekse schrijfwijze uit de campagnecanon (Ephyra, Athenai, Thebai, Delphoi, Mykenai, Ilion, Odysseus, Athena, Apollon, Hephaistos) en vertaal of verlatijns ze niet; Latijnen gebruiken hun eigen namen (Iuppiter, Mars, Saturnus, Alba Longa). Verzin nieuwe namen in dezelfde stijl (Griekse namen met patroniem of herkomst: 'Hagnon van Sikyon', 'zoon van Phainippos') en gebruik ze daarna consequent. Dat geldt ook voor namen in worldDelta, location en newNpcs.",
    "noOvershadow": "Goden, oude helden en koningen uit de canon overschaduwen de PC's niet: ze handelen via stervelingen, lossen de missie niet op, zijn niet altijd beschikbaar en vragen iets terug.",
    "bigFigure": "een ontmoeting met een god, een oude held of een koning uit de canon",
    "geoCheck": "Controleer geografie met de regio's uit de canon (REG-KORINTHIA, REG-ATTIKA, REG-SARONISCHEGOLF, REG-ARGOLIS, REG-ARKADIA, REG-LAKONIA, REG-BOIOTIA, REG-PHOKIS, REG-THESSALIA, REG-EPEIROS, REG-IONISCHEEILANDEN, REG-AIGAIOS, REG-KRETA, REG-LEMNOS, REG-TROAS, REG-THRAKIA, REG-HESPERIA, REG-AIAIA, REG-THULE, REG-KEMET, REG-OOSTEN, REG-KAUKASOS, REG-ONDERWERELD) en de vaste ligging: Melitta ligt aan de zuidkust van de Korinthische Golf, ± 40 km ten westen van Ephyra, voorbij Sikyon; de haven van Melitta ligt aan de noordkant; Akrokorinthos rijst ten zuiden van Ephyra; Lechaion ligt aan de Korinthische Golf, Kenchreai aan de Saronische Golf.",
    "exInGame": "{\"inGame\":{\"date\":\"1 september 21\",\"timeOfDay\":\"ochtend\",\"location\":\"Melitta, de agora\"},",
    "exPlace": "'Melitta, de agora'",
    "exYear": "21",
    "exRegA": "REG-KORINTHIA",
    "exRegB": "REG-ATTIKA",
    "lootTone": "de Homerische wereld na Ilion (brons en vroeg ijzer, gastgeschenken, erfstukken van gevallen helden, tempelgaven, handelswaar als wijn, olijfolie, natron, purper en zilver; magische voorwerpen zijn godengeschenken of erfstukken met een verhaal)",
    "lootNo": "geen artefacten die de hele wereld kunnen veranderen (geen wapens of attributen van de Olympiërs zelf, geen onsterfelijkheid, niets wat het Verdrag van Mekone opheft); geen grafgiften als 'gratis' buit, want grafroof is een misdaad tegen de goden",
    "bookFigures": "Voor goden, helden en koningen uit de canon: beschrijf ze zoals in de canon (S1–S3) is vastgelegd, met hun geschiedenis, leeftijd in het jaar 21 n.I. en hun bekende karakter; geen voorkennis van latere gebeurtenissen.",
    "idLegend": "FIG- vaste figuren uit de canon (goden, helden, koningen)",
    "noCreateFig": "Vaste figuren (FIG-) maak je niet aan",
    "canonName": "een afwijking van de canon (of van de bekende mythe) registreer je"
  },
  "style": {
    "base": "Realistic Renaissance oil painting in the manner of Titian, Caravaggio and Raphael, rich chiaroscuro, warm Mediterranean light, believable anatomy and weathered faces, mythic Late Bronze Age Greece after the Trojan War: bronze armour, linen chitons, woollen himations, boar's-tusk helmets, painted pottery, megaron halls, cyclopean walls, olive groves and wine-dark sea.",
    "portraitNote": "Follow the written description exactly (age, scars, hair, clothing, equipment); keep each character consistent across images; no famous actor likenesses.",
    "locNote": "Follow the written description of the place and its geography; Bronze Age architecture (no classical marble Parthenon, no Roman arches outside Latium).",
    "avoid": "Avoid: photorealism, cartoon or anime look, 3D game render, modern objects, anachronistic Roman or medieval armour on Greeks, text, captions, watermarks, logos, borders."
  },
  "creator": {
    "magicWorld": "goddelijke, chthonische en oude magie in de Oikoumenè",
    "intro": "Dit is een nieuw personage in de Oikoumenè van Mors Vincta (D&D 2024 als regelsysteem): het mythische Griekenland in het eenentwintigste jaar na de val van Ilion. De grote helden zijn dood, oud of thuisgekomen; de goden leven en luisteren, maar sinds het Verdrag van Mekone grijpen ze niet rechtstreeks in en handelen ze via priesters, orakels, voortekens, eden en helden. Gastrecht (xenia) is heilig, de doden moeten begraven worden, en hoogmoed (hybris) wordt gestraft. Je mag je toewijden aan één god (piety, zie S2). Je begint op level 3 met point buy (27 punten) en een achtergrond volgens de 2024-regels.",
    "langsTip": "Je spreekt Achaïsch (Common) plus twee talen naar keuze: een taal van de mensen (Latijn, Kemetisch, Noords, Fenicisch) of, als je afkomst het verklaart, een taal van nimfen, reuzen of onderwereldwezens.",
    "bgNote": "Kies wat geloofwaardig is in de Oikoumenè: een veteraan van Ilion, een aoidos, een priester of tempeldienaar, een handelaar of zeeman, een atleet van de spelen, een herder uit Arkadia, een slaaf of vrijgelatene, een balling uit Alba Longa, Kemet of het Noorden. Geef je personage een stad (polis) of volk en een band met een plaats uit S1.",
    "spellTip": "Beschrijf spells in de sfeer van de Oikoumenè: als gebed en offer (Cleric, Paladin, Druid), als gunst of vloek van een machtig wezen (Warlock), als geleerde kunst van Kirke, de heka van Kemet of de runen van het Noorden (Wizard), of als goddelijk bloed (Sorcerer). Bespreek twijfelgevallen met de DM.",
    "magicTip": "Magie bestaat, maar is nooit neutraal: ze komt van goden, geesten, bloed of oude kennis, en de bron heeft een wil. Geef bij elke magische gave een verklaring die past bij de wereld en overleg met de DM.",
    "commonLang": "Achaïsch (Common)",
    "helperSys": "Je bent een schrijfhulp voor een D&D 5e (2024)-personage in een campagne in de Oikoumenè van Mors Vincta (het mythische Griekenland en de Binnenzee, 21 jaar na de val van Ilion; goden en stervelingen leven naast elkaar, maar de goden handelen alleen via stervelingen). Schrijf in het Nederlands, gebruik Engelse D&D-termen en de Griekse schrijfwijze van eigennamen. Wees trouw aan de canon van de setting (S1–S3), maar met speelruimte; verzin geen spelregels. Wat de speler zelf heeft vastgesteld mag je niet veranderen; eigen aanvullingen markeer je met \"(voorstel)\".",
    "species": {
      "Human": {
        "label": "Human (Achaiërs, Latijnen, Noordmannen, Kemeti, Oosterlingen)",
        "speed": 30,
        "size": "Medium of Small",
        "traits": [
          ["Resourceful", "Heroic Inspiration na elke Long Rest."],
          ["Skillful", "Proficiency in één extra skill naar keuze."],
          ["Versatile", "Een extra Origin Feat naar keuze."]
        ],
        "tolk": "De meerderheid van de Oikoumenè. Je cultuur bepaalt veel: Achaiërs (polis, gastrecht, eer), Latijnen (pietas, discipline, recht), Noordmannen (eer, een dood met het wapen in de hand), Kemeti (Ma'at, balseming, schrift) of Oosterlingen (handel, havens, de Gemeenschap van het Woord)."
      },
      "Aasimar": {
        "label": "Hemitheos (halfgod, Aasimar)",
        "speed": 30,
        "size": "Medium of Small",
        "traits": [
          ["Celestial Resistance", "Resistance tegen necrotic en radiant damage."],
          ["Darkvision", "60 ft."],
          ["Healing Hands", "Magic action: heel een wezen dat je aanraakt met een aantal d4 gelijk aan je Proficiency Bonus; 1× per Long Rest."],
          ["Light Bearer", "Je kent de cantrip Light."],
          ["Celestial Revelation", "Vanaf level 3, Bonus Action, 1 minuut, 1× per Long Rest: Heavenly Wings, Inner Radiance of Necrotic Shroud, met extra schade gelijk aan je Proficiency Bonus."]
        ],
        "tolk": "Een god zit in je stamboom, een paar generaties terug. Kies welke god: dat kleurt je gave (Heavenly Wings past bij Zeus of Hermes, Inner Radiance bij Apollon of Helios, Necrotic Shroud bij Hades of Hekate). Mensen aanbidden en wantrouwen je tegelijk."
      },
      "Dragonborn": {
        "label": "Spartos (Dragonborn)",
        "speed": 30,
        "size": "Medium",
        "traits": [
          ["Draconic Ancestry", "Kies een damage type (acid, cold, fire, lightning of poison); dat bepaalt je Breath Weapon en je resistance."],
          ["Breath Weapon", "Vervangt één aanval: 15-ft cone of 30-ft line, Dexterity save (DC 8 + Constitution + PB), 1d10 (2d10 op 5, 3d10 op 11, 4d10 op 17); PB× per Long Rest."],
          ["Damage Resistance", "Resistance tegen het damage type van je ancestry."],
          ["Darkvision", "60 ft."],
          ["Draconic Flight", "Vanaf level 5, Bonus Action: 10 minuten een fly speed gelijk aan je speed; 1× per Long Rest."]
        ],
        "tolk": "Nazaten van de mannen die Kadmos uit drakentanden zaaide bij Thebai. Geschubd, trots en krijgshaftig; vaak in dienst als wachters en soldaten. De drakenvleugels verschijnen als schimmen van de draak van Ares."
      },
      "Dwarf": {
        "label": "Kabeiros of Dvergr (Dwarf)",
        "speed": 30,
        "size": "Medium",
        "traits": [
          ["Darkvision", "120 ft."],
          ["Dwarven Resilience", "Resistance tegen poison damage; advantage op saves om de condition poisoned te vermijden of te beëindigen."],
          ["Dwarven Toughness", "Je Hit Point maximum stijgt met 1, en met 1 extra bij elke level."],
          ["Stonecunning", "Bonus Action: 10 minuten tremorsense 60 ft op of in steen; PB× per Long Rest."]
        ],
        "tolk": "Kabeiroi: de smeden van Lemnos die Hephaistos dienen. Dvergar: de smeden uit het Noorden, die volgens de verhalen de boeien van Fenrir smeedden. Beiden zijn gezocht om hun metaalwerk."
      },
      "Elf": {
        "label": "Nymphogeen (nimfgeboren, Elf)",
        "speed": 30,
        "size": "Medium",
        "traits": [
          ["Darkvision", "60 ft (120 ft voor Kinderen van Nyx)."],
          ["Elven Lineage", "Hesperidenbloed = High Elf, dryadenbloed = Wood Elf, Kind van Nyx = Drow; met de bijbehorende cantrip en spells op level 3 en 5."],
          ["Fey Ancestry", "Advantage op saves om de condition charmed te vermijden of te beëindigen."],
          ["Keen Senses", "Proficiency in Insight, Perception of Survival."],
          ["Trance", "Je hoeft niet te slapen; een Long Rest kost je 4 uur meditatie."]
        ],
        "tolk": "Kinderen van een nimf en een sterveling, of verder terug. Ze voelen de wildernis, de bronnen en de nacht. Ze leven lang en worden in steden met argwaan en verlangen bekeken."
      },
      "Gnome": {
        "label": "Daktylos (Gnome)",
        "speed": 30,
        "size": "Small",
        "traits": [
          ["Darkvision", "60 ft."],
          ["Gnomish Cunning", "Advantage op Intelligence, Wisdom en Charisma saving throws."],
          ["Gnomish Lineage", "Forest Gnome of Rock Gnome, met de bijbehorende cantrips en gaven."]
        ],
        "tolk": "Kleine smid-tovenaars van de berg Ida, uitvinders van het metaalwerk. Rock Gnome past bij werkplaats en mechaniek, Forest Gnome bij de wouden van Ida."
      },
      "Goliath": {
        "label": "Gigantenbloed of Jötunbloed (Goliath)",
        "speed": 35,
        "size": "Medium",
        "traits": [
          ["Giant Ancestry", "Kies een reuzenlijn (Cloud, Fire, Frost, Hill, Stone of Storm) met de bijbehorende gave; PB× per Long Rest."],
          ["Large Form", "Vanaf level 5, Bonus Action: 10 minuten Large, advantage op Strength-checks en +10 ft speed; 1× per Long Rest."],
          ["Powerful Build", "Advantage op checks om de condition grappled te beëindigen; je telt als één maat groter voor draagvermogen."]
        ],
        "tolk": "Verre nazaten van de Giganten die tegen de Olympiërs vochten, of van de Jötnar van het Noorden. Groot, sterk en vaak gewantrouwd door priesters."
      },
      "Halfling": {
        "label": "Pygmaios (Halfling)",
        "speed": 30,
        "size": "Small",
        "traits": [
          ["Brave", "Advantage op saves om de condition frightened te vermijden of te beëindigen."],
          ["Halfling Nimbleness", "Je kunt door de ruimte van een wezen dat groter is dan jij bewegen."],
          ["Luck", "Rol je een 1 op een d20 Test, dan mag je opnieuw rollen en moet je het nieuwe resultaat gebruiken."],
          ["Naturally Stealthy", "Je kunt de Hide action nemen als je achter een wezen staat dat groter is dan jij."]
        ],
        "tolk": "Een klein volk uit het zuiden, aan de rand van Kemet, beroemd om hun eeuwige oorlog met de kraanvogels. Taai, nuchter en moeilijk bang te maken."
      },
      "Orc": {
        "label": "Kyklopide (Orc)",
        "speed": 30,
        "size": "Medium",
        "traits": [
          ["Adrenaline Rush", "Bonus Action: Dash en Temporary Hit Points gelijk aan je Proficiency Bonus; PB× per Short of Long Rest."],
          ["Darkvision", "120 ft."],
          ["Relentless Endurance", "Ga je naar 0 HP maar sterf je niet, dan ga je in plaats daarvan naar 1 HP; 1× per Long Rest."]
        ],
        "tolk": "Verre verwanten van de Kyklopen, de smeden en herders van de oude tijd. Sterk en taai; ze dragen soms één groot oog als familieteken op schild of huid."
      },
      "Tiefling": {
        "label": "Chthonios (Tiefling)",
        "speed": 30,
        "size": "Medium of Small",
        "traits": [
          ["Darkvision", "60 ft."],
          ["Fiendish Legacy", "Erinyenbloed = Abyssal, Onderwereldbloed = Chthonic, Tartarosbloed = Infernal; met de bijbehorende resistance, cantrip en spells op level 3 en 5."],
          ["Otherworldly Presence", "Je kent de cantrip Thaumaturgy."]
        ],
        "tolk": "Iets uit de diepte zit in je bloed: de wraakgodinnen, de Onderwereld of Tartaros. Mensen spugen op de grond als je langskomt, en sommige priesters weigeren je offer."
      },
      "Satyr": {
        "label": "Satyr",
        "speed": 35,
        "size": "Medium",
        "traits": [
          ["Fey", "Je creature type is Fey."],
          ["Ram", "Unarmed strike met je hoorns: 1d6 + Strength bludgeoning."],
          ["Magic Resistance", "Advantage op saving throws tegen spells."],
          ["Mirthful Leaps", "Bij een long of high jump tel je 1d8 ft extra op."],
          ["Reveler", "Proficiency in Performance en Persuasion, en met één muziekinstrument."]
        ],
        "tolk": "Volgelingen van Dionysos uit wouden en wijngaarden: feest, muziek en grenzen overschrijden. Ability scores komen uit je achtergrond (2024)."
      },
      "Centaur": {
        "label": "Kentauros (Centaur)",
        "speed": 40,
        "size": "Medium",
        "traits": [
          ["Fey", "Je creature type is Fey."],
          ["Charge", "Beweeg je minstens 30 ft recht naar een doel en raak je met een melee weapon attack, dan mag je als Bonus Action een Hooves-aanval doen."],
          ["Equine Build", "Je telt als één maat groter voor draagvermogen; klimmen kost je 4 ft per ft."],
          ["Hooves", "Unarmed strike: 1d6 + Strength bludgeoning."],
          ["Natural Affinity", "Proficiency in Animal Handling, Medicine, Nature of Survival."]
        ],
        "tolk": "Kentauren van de Pelion in Thessalia, sommigen gevormd in de traditie van de wijze Chiron (die zijn onsterfelijkheid opgaf), anderen wild en twistziek. Ability scores uit je achtergrond."
      },
      "Minotaur": {
        "label": "Asterionide (Minotaur)",
        "speed": 30,
        "size": "Medium",
        "traits": [
          ["Horns", "Unarmed strike: 1d6 + Strength piercing."],
          ["Goring Rush", "Neem je de Dash action en beweeg je minstens 20 ft, dan mag je als Bonus Action een Horns-aanval doen."],
          ["Hammering Horns", "Na een melee attack met de Attack action mag je als Bonus Action een wezen tot één maat groter 10 ft wegduwen (Strength save, DC 8 + Strength + PB)."],
          ["Labyrinthine Recall", "Je weet altijd welke kant het noorden is, en je hebt advantage op checks om een weg te vinden."]
        ],
        "tolk": "De vervloekte Kretenzische lijn van Asterion. Gevreesd en gemeden, maar wie hen kent, weet dat de vloek bij Minos lag, niet bij hen. Ability scores uit je achtergrond."
      },
      "Triton": {
        "label": "Triton",
        "speed": 30,
        "size": "Medium",
        "traits": [
          ["Amphibious", "Je kunt lucht en water ademen; swim speed 30 ft."],
          ["Control Air and Water", "Fog Cloud; vanaf level 3 Gust of Wind, vanaf level 5 Water Walk; elk 1× per Long Rest zonder slot."],
          ["Darkvision", "60 ft."],
          ["Emissary of the Sea", "Je kunt eenvoudige ideeën overbrengen aan zeedieren."],
          ["Guardians of the Depths", "Resistance tegen cold damage."]
        ],
        "tolk": "Het volk van Poseidon, uit de diepten van de Binnenzee. Ze komen zelden aan land, meestal als gezant of als ze iets zoeken. Ability scores uit je achtergrond."
      },
      "Leonin": {
        "label": "Leonin",
        "speed": 35,
        "size": "Medium",
        "traits": [
          ["Darkvision", "60 ft."],
          ["Claws", "Unarmed strike: 1d4 + Strength slashing."],
          ["Hunter's Instincts", "Proficiency in Athletics, Intimidation, Perception of Survival."],
          ["Daunting Roar", "Bonus Action: wezens naar keuze binnen 10 ft maken een Wisdom save (DC 8 + Constitution + PB) of zijn frightened tot het einde van je volgende beurt; 1× per Short of Long Rest."]
        ],
        "tolk": "De leeuwenvolken van Kemet, kinderen van Sekhmet. Ze dienen als tempelwachters en jagers aan de grote rivier. Ability scores uit je achtergrond."
      }
    },
    "lineage": {
      "High Elf": "Hesperidenbloed: cantrip Prestidigitation (INT, WIS of CHA); level 3: Detect Magic; level 5: Misty Step.",
      "Wood Elf": "Dryadenbloed: Speed 35 ft; cantrip Druidcraft; level 3: Longstrider; level 5: Pass without Trace.",
      "Drow": "Kind van Nyx: Darkvision 120 ft; cantrip Dancing Lights; level 3: Faerie Fire; level 5: Darkness."
    },
    "langs": [
      "Latijn",
      "Kemetisch",
      "Noords",
      "Fenicisch",
      "Sylvan",
      "Giant",
      "Draconic",
      "Abyssal",
      "Infernal",
      "Celestial",
      "Primordial",
      "Common Sign Language"
    ],
    "inspiration": [
      "A · Veteraan van Ilion — Human · Fighter/Monk: een oude soldaat die tien jaar voor de muren van Ilion stond, nu ziet hoe de wereld zonder helden verder moet, en een eed draagt die hij aan een gevallen vriend deed.",
      "B · Aoidos op zoek naar een epos — Human of Satyr · Bard: een zanger die de oude helden heeft bezongen en nu een nieuw lied zoekt, liefst met een held die nog leeft.",
      "C · Kleinkind van een god — Aasimar (Hemitheos) · Sorcerer/Paladin: de stamboom loopt terug naar Apollon, Hermes of Poseidon; je wordt aanbeden en gewantrouwd, en je weet niet of je god je opmerkt.",
      "D · Balling uit het westen — Human (Latijn) · Fighter/Rogue: weggelopen uit Alba Longa, gedisciplineerd en zwijgzaam, met een verleden dat je liever niet in Achaia uitlegt.",
      "E · Leerling van Kirke — Elf (Nymphogeen) of Human · Wizard/Warlock: je leerde op Aiaia kruiden, gedaanteverandering en de prijs van macht, en je bent niet helemaal vrijwillig vertrokken.",
      "F · Kentaur van de Pelion — Centaur · Ranger/Druid: gevormd in de traditie van Chiron, bot en eerlijk, een spoorzoeker die de steden van de mensen te luid vindt."
    ],
    "speciesTip": "Standaard toegestaan: de species uit het Player's Handbook 2024 in hun vorm in deze wereld (Human, Hemitheos/Aasimar, Spartos/Dragonborn, Kabeiros of Dvergr/Dwarf, Nymphogeen/Elf, Daktylos/Gnome, Gigantenbloed/Goliath, Pygmaios/Halfling, Kyklopide/Orc, Chthonios/Tiefling), plus Satyr, Centaur, Minotaur, Triton en Leonin uit Mythic Odysseys of Theros (ability scores uit je achtergrond, volgens 2024). Andere species alleen als voorstel via de DM.",
    "aanleiding": "Aanleiding / startsituatie (bv. waarom ben je in deze stad: lijkspelen, een pelgrimstocht naar een orakel, een handelsreis, een eed, een vlucht, een opdracht van een tempel of koning?)",
    "classTolk": {
      "Barbarian": "Krijgers in de greep van een god of een woede: volgelingen van Ares, maenaden van Dionysos, berserkers van Odin, of nazaten van de Giganten. Hun razernij wordt gezien als goddelijke bezetenheid.",
      "Bard": "Aoidoi die de epen van Ilion zingen, sofisten met een gouden tong, toneelspelers van Dionysos of skalden uit het Noorden. Hun magie is de kracht van het woord en het lied, geschonken door de Muzen of Apollon.",
      "Cleric": "Priesters van één god (of van het Woord), met een domein dat bij die god past: Hades of Anubis (Grave), Apollon (Life of Light), Athena (Knowledge), Ares of Mars (War), Hermes (Trickery), Zeus of Poseidon (Tempest), Demeter (Life of Nature), Hephaistos (Forge). Hun wonderen zijn de manier waarop goden via stervelingen werken.",
      "Druid": "Priesters van Demeter of Artemis, de eikenpriesters van Dodona, of vrouwen en mannen van de nimfen en de bronnen. Hun magie komt uit de aarde, de seizoenen en de wildernis.",
      "Fighter": "Hoplieten, wagenstrijders, veteranen van Ilion, Latijnse legionairs, Noordse huurlingen, Kemetische tempelwachters. Gewoon helemaal raak; magie is hier zeldzaam en komt meestal van een god of een geschenk.",
      "Monk": "Pankratiasten en worstelaars uit de traditie van de spelen in Olympia, Pythagoreërs met hun discipline en zwijgen, of asceten van een god. Hun ki is zelfbeheersing, adem en lichaam als offer.",
      "Paladin": "Krijgers die een eed aan een god hebben gezworen (aan Zeus, Athena, Ares, Hades of het Woord). De eed is heilig: breken trekt de toorn van de god en vaak de Erinyen aan.",
      "Ranger": "Jagers van Artemis, spoorzoekers van Arkadia en de Pelion, verkenners en grenswachters. Hun spells zijn gebeden aan Artemis, Apollon of de nimfen van het land.",
      "Rogue": "Dieven onder de bescherming van Hermes, havenratten van Peiraieus, spionnen van koningen, oplichters en sofisten. Hermes houdt van listigheid, maar haat wie liegt tegen een vriend.",
      "Sorcerer": "Wie goddelijk bloed heeft (een Hemitheos), door een god is aangeraakt, of een vloek draagt. Hun magie is aangeboren en wild; de god in hun bloed kan er een mening over hebben.",
      "Warlock": "Wie een verbond sloot met een machtig wezen: Hekate van de kruispunten, een geboeide Titaan, de Erinyen, Hel uit het Noorden, een nimf of een gevangen daimon. Patronen hebben eigen doelen; wees voorzichtig met wat je belooft.",
      "Wizard": "Geleerde magie: de school van Kirke op Aiaia, de heka-schrijvers van Kemet met hun papyri, of de runenkunst van het Noorden. Zeldzaam in Achaia, gewantrouwd door priesters, en altijd met een prijs."
    }
  },
  "canonParts": {
    "namingRule": "eigennamen in de Griekse vorm uit de canon (Ephyra, Athenai, Thebai, Delphoi, Odysseus, Athena, Apollon, Hephaistos), Latijnse namen alleen voor Latijnen (Iuppiter, Mars, Saturnus), en consequent gebruikt.",
    "tone": "episch-klassiek en ingetogen: het mythische Griekenland na Ilion, waarin de helden verdwijnen en de wereld kleiner, harder en menselijker wordt. Avontuur, wonder en gevaar, met tragiek en eer; humor komt van NPC's, niet van de verteller. Weinig maar betekenisvol combat; gevaar wordt in de fictie getelegrafeerd (sporen, geruchten, zichtbare overmacht) voordat het dodelijk wordt. Grote momenten krijgen ruimte, reizen en routine een paar zinnen.",
    "settingRules": "- De Oikoumenè (zie S1–S3): D&D 5e 2024 (PHB, DMG, MM 2024) als mechanische basis; Xanathar's, Tasha's en Mythic Odysseys of Theros mogen, aangepast aan 2024. Bij twijfel geldt de 2024-tekst.\n- Personages starten op level 3 (point buy, 27 punten), achtergrond volgens 2024; species volgens S3; classes volgens de classTolk. Levelen met milestones: een gevecht vermijden door slim te denken levert evenveel op als het winnen.\n- Goden: het Verdrag van Mekone geldt. Goden grijpen niet rechtstreeks in; ze werken via priesters, orakels, voortekens, dromen, dieren, eden en helden. Een god verschijnt hooguit vermomd (een reiziger met een brede hoed, een oude vrouw, een geur van cipressen) of in een droom, spreekt in raadsels, geeft informatie of een kleine gunst, nooit de oplossing, en verwacht altijd iets terug.\n- Hybris en straf: hoogmoed tegenover goden, gasten of doden heeft altijd gevolgen, vaak langzaam en ironisch, zoals in de tragedie. Xenia is heilig: gastschennis kost −5 piety (Zeus of de eigen god) en trekt binnen 1d4 dagen een Erinys aan. Een lijk onbegraven laten, grafroof en meineed zijn schande voor de goden.\n- Piety (S2): één god per personage; start op 1; +1 voor een significante daad die de god dient, −1 (of meer) voor een daad die de god haat; drempels 3, 10 en 25 met gunsten.\n- Magie is nooit neutraal: ze komt van goden, geesten, bloed of oude kennis. Arcane magie is zeldzaam en gewantrouwd in Achaia.\n- Dobbelstenen: spelers rollen hun eigen worpen en geven meestal de kale d20; de DM telt de bonus erbij en toont dat. De DM vraagt om een worp met alleen het type worp, noemt geen DC's vooraf (tenzij het personage die kan inschatten), en rolt echt en zichtbaar voor NPC's, monsters en companions. Een natural 20 levert altijd iets extra's op (ook bij ability checks en saves); een natural 1 geeft een mislukking plus een echte complicatie, nooit meteen dodelijk.\n- Dodelijkheid is echt: de DM redt niemand achteraf en draait niets terug omdat het slecht uitkomt. Keuzes hebben gevolgen en worden gelogd.\n- Heroic Inspiration voor sterk rollenspel, een slim plan of een keuze die het personage iets kost.\n- Beloningen komen uit het verhaal, niet alleen uit lijken: xenia-gastgeschenken, loon, prijzen van spelen, tempelgaven, erfstukken, en de kist van een vijand die werd omgepraat. Een speler die gevechten vermijdt, wordt daar niet armer van.\n- Taal aan tafel: vertelling en dialoog in het Nederlands; spelterminologie (ability scores, skills, conditions, acties, spells, classes, feats) in het Engels. Elke beurt eindigt met de situatie, zonder keuzemenu. Vragen tussen haakjes beantwoordt de DM kort, buiten het spel; de DM vertelt wat het personage weet, niet wat het zou moeten doen.",
    "premise": "- Dit is een NIEUWE campagne in de Oikoumenè, in of rond het jaar 21 na Ilion. Beginpunt, premisse en dreiging staan nog open (tenzij de spelers een startsituatie hebben opgegeven in document P1): de DM kiest bij de openingsbeurt een startsituatie die past bij de backstories van de gekozen personages, schrijft die vast in de DM-bijbel (C1) en de Stand, en laat elke PC een geloofwaardige reden hebben om erbij te zijn.\n- De DM heeft volledige creatieve vrijheid over de overkoepelende campagne (dreiging, antagonisten, mysteries, facties, companions, sidequests) binnen deze afspraken. Het thema mag groot zijn (een god, een vloek, de dood, de grenzen tussen mensen en goden), maar de DM velt geen eigen moreel oordeel: dat oordeel is aan de spelers.\n- De hoofdplot draait niet exclusief om één PC; alle PC's worden gelijkwaardig geïntegreerd. Backstories worden verankerd in de wereld (een persoon, plek, voorwerp of geheim), zodat het verleden van de personages een bron van lore wordt.\n- De wereld beweegt: tijd verstrijkt, facties en NPC's voeren hun plannen uit, ook als de PC's er niet zijn. Elk groot obstakel heeft een gewelddadige, een sociale en een slimme oplossing.",
    "canonNpcs": "- Vaste figuren uit de canon (S1–S3: goden, Odysseus, Menelaos, Demophon, Ascanius en anderen) leven en handelen waar de chronologie het toelaat. Respecteer hun geschiedenis, karakter, relaties, vermogens, locatie en kennisgrenzen; geen voorkennis van latere gebeurtenissen. Grote figuren overschaduwen de PC's niet en lossen hun missie niet op; ze zijn niet altijd beschikbaar.\n- Elke belangrijke NPC heeft een wil, een waarde, een angst en een geheim, en reageert op wat de spelers doen, niet op wat het plot nodig heeft. NPC's spreken in hun eigen stem: Achaiërs plechtig en Homerisch (patroniemen, eden bij de goden, gastrecht, verwijzingen naar oude verhalen), Latijnen kort en juridisch met pietas, Noordmannen nuchter en trots, Kemeti beleefd en rituieel; gewone mensen mogen plat en grappig zijn. Vrienden en companions hebben hun eigen grenzen en zijn geen marionetten.\n- Onderscheid [C] expliciete canon, [I] interpretatie, [N] nieuwe campagne-inhoud. Canon (en daarna de bekende mythe) is de baseline; leg elke door spelers veroorzaakte afwijking vast met datum, oorzaak en gevolgen. Originele NPC's vullen de tussenruimte.",
    "consistent": "passend bij de Oikoumenè: het mythische Griekenland van de Bronstijd na de val van Ilion"
  },
  "canon": {
    "s1_wereld": {
      "title": "S1 De Oikoumenè: de wereld (publiek voor spelers en DM)",
      "text": "# S1 De Oikoumenè: de wereld\n\n## 1. De wereld in het kort\nHet is het **eenentwintigste jaar na de val van Ilion** (21 n.I.). De grote helden zijn dood, oud of thuisgekomen: Achilleus en Aias liggen begraven aan de kust van de Troas, Agamemnon werd thuis vermoord en zijn huis is uitgemoord, Menelaos is oud, en Odysseus bereikte vorig jaar eindelijk Ithaka. Het tijdperk van de heroën loopt ten einde, en de wereld wordt kleiner, harder en menselijker.\n\nRond de Binnenzee groeien nieuwe machten. In het westen bouwen de nazaten van Aeneas een jonge, gedisciplineerde macht op in Latium. Uit het noorden komen bleke krijgers met vreemde goden, als huurlingen en handelaren. In het zuiden weegt het oeroude Kemet de harten van zijn doden. En in de havens en slavenkwartieren van het oosten fluistert men over een nieuwe leer: één God, één Woord, en de belofte dat de dood niet het einde is.\n\nGoden en stervelingen leven naast elkaar. De goden zijn echt, ze luisteren en ze hebben hun lievelingen en hun haat, maar sinds Mekone grijpen ze niet rechtstreeks in. Ze hebben stervelingen nodig: priesters, orakels, helden. Daarom doet vroomheid ertoe, en daarom is er nog steeds plaats voor helden.\n\n## 2. Het Verdrag van Mekone\nIedereen leert het als kind. Bij **Mekone** verdeelden goden en stervelingen de wereld, en Prometheus bedroog Zeus bij het eerste offer: de mensen kregen het vlees, de goden de botten in glanzend vet. Sindsdien grijpen de goden **niet rechtstreeks** in. Ze handelen via stervelingen: via priesters, orakels, voortekens, dromen, dieren, eden en helden. Een god die zelf de wereld in stapt, doet dat vermomd, kort, en zelden zonder prijs. Prometheus werd daarvoor aan de Kaukasos geklonken, tot Herakles hem bevrijdde; de kentaur Chiron gaf daarvoor zijn onsterfelijkheid op.\n\n## 3. Magie, offers, orakels en goddelijke gunst\n- **Offers** zijn het gesprek tussen mensen en goden. Een plengoffer van wijn, melk of honing; een dierenoffer bij het altaar, waarvan de mensen het vlees eten en de goden de rook ontvangen; wierook, koeken, een lok haar, een gewijd voorwerp. Wie een gunst vraagt, belooft iets terug (*do ut des*), en wie zijn belofte breekt, krijgt de god tegen zich.\n- **Orakels:** Delphoi (Apollon, de Pythia op haar drievoet), Dodona (Zeus, het ruisen van de heilige eik), en de Mysteriën van Eleusis (Demeter en Persephone). Orakels spreken in raadsels; een antwoord is nooit gratis en zelden eenduidig.\n- **Voortekens:** vogelvlucht, donder van links of rechts, dromen, een niesbui op het juiste moment, de lever van een offerdier. Zieners lezen ze; iedereen let erop.\n- **Eden** worden gezworen bij de goden, vaak bij de Styx. Meineed is een van de zwaarste misdaden.\n- **Goddelijke gunst (piety):** wie zich aan één god toewijdt en diens idealen dient, kan gunsten ontvangen (zie S2). Wie de god beledigt, verliest die gunst.\n- **Magie** bestaat, maar is nooit neutraal. Priesters doen wonderen namens hun god; heksen en geleerden putten uit Hekate, Kirke, de heka van Kemet of de runen van het Noorden; anderen dragen goddelijk bloed of een verbond met een machtig wezen. Arcane magie is zeldzaam in Achaia en wordt door priesters gewantrouwd.\n\n## 4. Xenia: het gastrecht\nDe heiligste wet van Achaia, beschermd door **Zeus Xenios**. Een gastheer beschermt zijn gast en geeft hem eten, een bad en een slaapplaats, vaak voordat hij zelfs naar diens naam vraagt; bij vertrek krijgt een geëerde gast een geschenk. Een gast schaadt zijn gastheer niet. Wie gastvriendschap (xenia) sluit, bindt ook zijn nakomelingen. Wie dit breekt, haalt zich goddelijke toorn op de hals: de Erinyen komen. Dat is mechanisch merkbaar (zie S2).\n\n## 5. De dood\n- **Achaiërs:** Thanatos, de zoon van de Nacht, scheidt de ziel zacht van het lichaam; de Keren halen wie gewelddadig sterft. Hermes leidt de zielen naar de Styx, waar Charon ze overzet voor een obool onder de tong. Wie niet begraven wordt (aarde op het lichaam, een obool, een klaagzang, een plengoffer), dwaalt honderd jaar aan de oever. Een lijk onbegraven laten is een schande voor de goden; denk aan Antigone. De dode wordt opgebaard (*prothesis*) en op de derde dag vóór zonsopgang uitgedragen (*ekphora*). Voor grote doden houdt men lijkspelen.\n- **Latijnen:** dezelfde gedachte, met grote nadruk op de *Manes* (de vergoddelijkte voorouders) en op de familie die de riten verzorgt.\n- **Noordmannen:** wie met het wapen in de hand sterft, wordt door de Walkuren naar Valhalla of Fólkvangr gedragen. Wie in bed sterft (een strodode) gaat naar Hel. Een slecht begraven dode kan terugkomen als *draugr*.\n- **Kemeti:** het lichaam wordt gebalsemd met natron, want de ziel heeft het nodig. Anubis leidt de dode naar de Weegzaal, waar het hart wordt gewogen tegen de veer van Ma'at. Een zwaar hart wordt verslonden door Ammit.\n- **Het Woord:** de dood is een slaap. Op de dag van het Woord staan de doden op.\n\n## 6. Tijd, kalender en geld\n**Jaartelling:** jaren *na Ilion* (n.I.). Het huidige jaar is **21 n.I.**; een nieuwe campagne begint standaard in dit jaar.\n\n**De Attische kalender:** 12 maanden van 30 dagen; het jaar begint na de zomerzonnewende. De app rekent met januari t/m december; zo verhouden ze zich:\n\n| App-maand | Attische maand | Seizoen | Feesten |\n|---|---|---|---|\n| juli | Hekatombaion | hoogzomer | Nieuwjaar, Panathenaia |\n| augustus | Metageitnion | zomer | |\n| september | Boedromion | vroege herfst | Mysteriën van Eleusis (15–22) |\n| oktober | Pyanepsion | herfst | Thesmophoria |\n| november | Maimakterion | late herfst | |\n| december | Poseideon | winter | |\n| januari | Gamelion | winter | |\n| februari | Anthesterion | vroege lente | Anthesteria (11–13): de doden lopen rond |\n| maart | Elaphebolion | lente | Grote Dionysia |\n| april | Mounichion | lente | |\n| mei | Thargelion | vroege zomer | |\n| juni | Skirophorion | zomer | Zonnewende |\n\n**Jaartal in de app:** het jaar in de wereld begint op 1 Hekatombaion (= 1 juli), het jaar in de app op 1 januari. Daarom: juli t/m december van app-jaar X = Hekatombaion t/m Poseideon van **X n.I.**; januari t/m juni van app-jaar X = Gamelion t/m Skirophorion van **(X − 1) n.I.** Voorbeelden: 1 september 21 = 1 Boedromion 21 n.I.; 12 februari 22 = 12 Anthesterion 21 n.I.; 1 juli 22 = 1 Hekatombaion 22 n.I. (nieuwjaar). Het dagnummer blijft gelijk; de 31e van een app-maand geldt als de 30e van de Attische maand.\n\n**Munten** (vertaling naar 5E): 1 goudstater = 1 gp; 1 drachme (zilver) = 1 sp; 1 obool (brons) = 1 cp. Een obool onder de tong van een dode is de tol voor Charon. Veel handel gaat in natura: wijn, olijfolie, graan, natron, purper, zilver uit Laurion.\n\n**Talen:** Achaïsch (= Common), Latijn, Kemetisch, Noords, Fenicisch, plus de talen van nimfen, reuzen, goden en onderwereldwezens. Soms vind je opschriften in echt Oudgrieks of Latijn.\n\n## 7. Regio's en plaatsen\nVaste ligging (canon van de kaarten): Melitta ligt aan de zuidkust van de Korinthische Golf, ± 40 km ten westen van Ephyra, net voorbij Sikyon; de haven van Melitta ligt aan de noordkant. Akrokorinthos rijst ten zuiden van Ephyra. Lechaion ligt aan de Korinthische Golf, Kenchreai aan de Saronische Golf.\n\n### Achaia (het Griekse kernland)\nBergen, olijven en ruzie: onafhankelijke poleis, elk met eigen goden, tirannen, koningen of raden.\n\n**REG-KORINTHIA** — de Isthmos en de zuidkust van de Korinthische Golf.\n- **Ephyra** (Korinthe): rijke handelsstad op de landengte, met twee havens, **Lechaion** (Korinthische Golf) en **Kenchreai** (Saronische Golf), en daartussen een geplaveid sleeppad waarover schepen over land worden getrokken. Ten zuiden rijst de rotsburcht **Akrokorinthos**, met een tempel van Aphrodite en haar hierodouloi op de top. Aan de voet van de rots ontspringt de bron **Peirene**. De oude koningslijn van Sisyphos regeerde hier ooit; nu regeert koning Thersandros. De stad heeft een heiligdom van Hades.\n- **Melitta:** kleine ommuurde havenstad aan de Golf, geregeerd door de tiran Lykos vanaf zijn burcht boven de stad. De **Limen** (haven) ligt aan de noordkant; daarboven de **Agora** met een zuilengang en een put, het **Hieron van Hermes**, en de herberg *De Twee Dolfijnen* aan de haven. De **Oostpoort** met de **Nekropolis** ligt aan de weg naar Sikyon en Ephyra; de **Westpoort** met het **Stadion** (renbaan, hellingen voor toeschouwers en een platform voor de brandstapel) aan de weg naar Aigion.\n- **Sikyon:** stad tussen Melitta en Ephyra, met worstelscholen voor het pankration.\n- **Aigion:** havenstad verder westwaarts langs de Golf.\n- **Kleonai:** boerenstadje in de heuvels op de weg naar Argos.\n- **Kromna:** dorp ten zuiden van Ephyra, met een oude kalkoven op de helling.\n- **De Oneia-pas:** de weg door de heuvels ten zuidoosten van Ephyra, berucht om rovers.\n\n**REG-SARONISCHEGOLF** — de binnenzee tussen de Isthmos en Attika, met de eilanden **Salamis** (het eiland van Telamon en zijn zonen Aias en Teukros) en **Aigina**. Druk vaarwater tussen Kenchreai en Peiraieus.\n\n**REG-ATTIKA** — het land van Athena.\n- **Megara:** stad op de weg van de Isthmos naar Eleusis.\n- **Eleusis:** heiligdom van Demeter en Persephone, met het Telesterion. Hier worden in Boedromion de **Mysteriën** gevierd; wie ingewijd wordt, zwijgt erover op straffe van de toorn van de godinnen.\n- **Athenai:** stad van Athena, met de Akropolis, de Areopagos en een Raad van aanzienlijke burgers. De pottenbakkers wonen in de **Kerameikos**, de rijken in wijken als **Melite**. Lange wegen lopen naar de havens van **Peiraieus** (de grote handelshaven **Kantharos** en de oorlogs- en werfhaven **Zea**).\n- **Laurion:** de zilvermijnen aan de zuidpunt van Attika, gedolven door duizenden slaven.\n\n**REG-ARGOLIS** — **Argos** en **Mykenai**: oude macht in verval. Agamemnons huis in Mykenai is uitgemoord; de cyclopische muren staan er nog.\n\n**REG-ARKADIA** — de bergen in het hart van de Peloponnesos: herders, Pan, en volken die ouder zijn dan de steden.\n\n**REG-LAKONIA** — **Sparta**, waar de oude Menelaos met Helena regeert. Aan de zuidelijkste kaap ligt **Tainaron**, met een grot waarvan men zegt dat hij naar de Onderwereld leidt.\n\n**REG-BOIOTIA** — **Thebai**, de stad van Kadmos, gebouwd door de Spartoi, mannen gezaaid uit drakentanden. Een stad met een vervloekte geschiedenis (Oidipous, de Zeven, Antigone). Ten zuiden ligt de berg **Kithairon**, waar Dionysos' maenaden ronddolen.\n\n**REG-PHOKIS** — **Delphoi**, de navel van de wereld, hoog op de hellingen van de **Parnassos**: het orakel van Apollon en de Pythia.\n\n**REG-THESSALIA** — vlakten met paarden en de berg **Pelion**, het land van de kentauren; in het noorden de **Olympos**, de berg van de goden.\n\n**REG-EPEIROS** — het ruige noordwesten met het eikenorakel van **Dodona**, waar Zeus spreekt door het ruisen van de bladeren.\n\n**REG-IONISCHEEILANDEN** — de eilanden in de westzee: **Ithaka**, waar Odysseus na twintig jaar weer regeert, en verder noordelijk **Kerkyra**.\n\n### De Eilanden van de Aigaios\n**REG-AIGAIOS** — de Aigaiische Zee met de Kykladen: **Delos** (het geboorte-eiland van Apollon en Artemis) en **Naxos** (het eiland van Dionysos, met zijn wijnranken en theater) en honderd andere eilanden.\n\n**REG-KRETA** — het grote eiland in het zuiden, met de ruïnes van **Knossos** en het **Labyrint** van Minos.\n\n**REG-LEMNOS** — het eiland van Hephaistos in het noorden, met een rokende berg en de smidse van de Kabeiroi.\n\n**REG-TROAS** — de kust in het noordoosten, met de ruïnes van **Ilion** en de grafheuvels van Achilleus, Patroklos en Aias.\n\n**REG-THRAKIA** — de wilde noordkust, met paardenvolken en de wegen naar het noorden.\n\n### De verre landen\n**REG-HESPERIA** — het westen: de lange schiereilanden van Hesperia, met de streek **Latium** en de stad **Alba Longa**, gesticht door Ascanius, de zoon van Aeneas. De Latijnen zijn gedisciplineerd, juridisch en vroom (*pietas*), vechten in legioenen en noemen de goden bij andere namen. Ze zijn ambitieus; de Achaiërs vertrouwen ze niet.\n\n**REG-AIAIA** — het eiland van de tovenares **Kirke**, in de westzee voor de kust van Hesperia, waar men kruiden, gedaanteverandering en oude magie leert.\n\n**REG-THULE** — het Noorden, achter de **Rhipaeïsche bergen**: koude wouden en fjorden. De **Noordmannen** komen als huurlingen en handelaren naar het zuiden en vereren Odin, Thor en Freyja.\n\n**REG-KEMET** — het zuiden, aan de grote rivier: een oeroud rijk van priesters, schrijvers en balsemers, met tempels, piramiden en een delta vol riet. Bron van natron, papyrus en graan.\n\n**REG-OOSTEN** — Fenicische havens en woestijnsteden: purper, cederhout, schepen en het schrift. Hier ontstond de **Gemeenschap van het Woord**.\n\n**REG-KAUKASOS** — de besneeuwde bergen tussen twee zeeën in het uiterste noordoosten, aan het eind van de wereld, waar Prometheus ooit geketend was.\n\n**REG-ONDERWERELD** — het rijk van Hades en Persephone, onder de aarde: de Styx en de Acheron met de veerman Charon, de Asphodelosweide, het Elysion en diep daaronder **Tartaros**, waar de Titanen geboeid liggen. Geen gewone reis: de bekendste ingang is de grot van **Tainaron**; levenden komen er alleen met hulp van goden, riten of een held die de weg kent, en wie er eet, komt niet zomaar terug.\n\n## 8. De machten\n### Goden\nDe Olympiërs, de goden van de aarde en de diepte, en de goden van de andere volken: zie **S2**.\n\n### Rijken en steden\n- **De poleis van Achaia:** Ephyra (koning Thersandros), Athenai (een Raad, waarin Demophon, zoon van Theseus, een zware stem heeft), Sparta (koning Menelaos), Ithaka (koning Odysseus), Thebai, Argos, Mykenai, Melitta (tiran Lykos). Ze sluiten verbonden, voeren kleine oorlogen en wantrouwen elkaar.\n- **Alba Longa:** de jonge Latijnse macht in het westen, met legioenen, priesters (flamines) en ambitie.\n- **Kemet:** het oude rijk van de farao en de priesters, met eigen goden, schrift en geneeskunst.\n- **De Fenicische havensteden:** handelaren met de beste schepen van de Binnenzee.\n- **De Noordmannen:** geen rijk, maar jarls met hun mannen, die hun zwaard verhuren.\n\n### Orden en priesterschappen\n- **Priesters** dienen één god in één heiligdom: priesters van Hermes begraven vergeten doden, priesters van Hades zijn weinig en gevreesd, de Pythia spreekt voor Apollon, de hierodouloi dienen Aphrodite op Akrokorinthos, de eikenpriesters van Dodona luisteren naar Zeus.\n- **De Mysteriën van Eleusis:** ingewijden van Demeter en Persephone, met een gelofte van stilte.\n- **De Saturnus-priesters van Alba Longa:** zij prediken de terugkeer van de Gouden Eeuw, toen de oude, milde boerengod over de wereld heerste.\n- **De Kemetische tempels:** balsemers, schrijvers en hogepriesters van Anubis, Thoth en anderen; leonin dienen als tempelwachters.\n- **De Gemeenschap van het Woord:** gelovigen van één God zonder beeld; populair onder slaven en armen, gewantrouwd door de poleis, die hen *atheoi* (goddelozen) noemen. Hun priesters genezen zieken.\n- **De worstelscholen en spelen:** atleten van het pankration, de worstelaars van Sikyon en Olympia; lijkspelen zijn een eer voor de dode en een podium voor de levenden.\n\n### Vaste figuren\nZie **S3** voor de helden, koningen en andere vaste figuren die in het jaar 21 n.I. leven.\n\n## 9. Volken\nZie **S3**: welke volken spelbaar zijn en hoe ze in deze wereld heten."
    },
    "s2_goden": {
      "title": "S2 De goden en de piety (publiek voor spelers en DM)",
      "keywords": "god,goden,godin,godheid,zeus,hera,athena,apollon,artemis,ares,aphrodite,hermes,hephaistos,poseidon,demeter,dionysos,hades,persephone,hekate,nyx,moiren,erinys,erinyen,charon,anubis,ma'at,odin,thor,freyja,het woord,piety,gunst,offer,altaar,tempel,heiligdom,orakel,pythia,priester,priesteres,voorteken,droom,meineed,zweer,xenia,gastrecht,hybris,gebed,bidden,vloek,zegen,saturnus,iuppiter,mars",
      "text": "# S2 De goden en de piety\n\n## 1. Hoe goden optreden\nDe goden zijn echt en aanwezig: in hun tempels, op hun bergen, in de zee en onder de aarde. Maar sinds het Verdrag van Mekone grijpen ze niet rechtstreeks in. Ze werken via stervelingen. Een god spreekt via een priester of orakel, stuurt een droom, een dier of een voorteken, verschijnt hooguit vermomd en kort, en geeft informatie of een kleine gunst, nooit de oplossing. Goden hebben lievelingen en vijanden, ruziën onderling, en vergeten een belediging niet. Wie iets vraagt, moet iets geven.\n\n## 2. De Olympiërs en anderen\n| God | Domein | Waardeert | Haat |\n|---|---|---|---|\n| **Zeus** | hemel, eden, gezag, xenia | eden houden, gastrecht, leiderschap | meineed, gastschennis |\n| **Hera** | huwelijk, familie, trots | trouw, familie beschermen | ontrouw, vernedering |\n| **Athena** | wijsheid, strategie, ambacht | een slim plan, zelfbeheersing | domme roekeloosheid |\n| **Apollon** | licht, profetie, genezing, pest, muziek | waarheid, kunst, genezen | leugens, hybris |\n| **Artemis** | wildernis, jacht, maagden | de wildernis beschermen, jagen met eer | onnodige wreedheid tegen het wild |\n| **Ares** | oorlog, woede, moed | strijd zoeken, nooit wijken | lafheid |\n| **Aphrodite** | liefde, schoonheid, verlangen | passie volgen, schoonheid eren | liefde versmaden |\n| **Hermes** | reizigers, dieven, handel, boodschappen, zielengeleider | listigheid, reizen, doden begraven | traagheid, liegen tegen een vriend |\n| **Hephaistos** | vuur, smeedkunst | maken en herstellen | spot met gebreken |\n| **Poseidon** | zee, aardbevingen, paarden | offers voor de zeereis, kracht | hem vergeten |\n| **Demeter** | oogst, aarde | gastvrijheid aan hongerigen, landbouw | verspilling |\n| **Dionysos** | wijn, extase, theater, waanzin | grenzen overschrijden, feest, toneel | rigide ontkenning |\n| **Hades** | de Onderwereld, rijkdom van de aarde | de doden eren, rituelen voltooien | wie de dood bedriegt |\n| **Persephone** | lente, de doden, mysteriën | de Mysteriën, de cyclus | ze is moeilijk te doorgronden |\n| **Hekate** | kruispunten, magie, geesten, de nacht | keuzes maken, magie respecteren | twijfel op het kruispunt |\n\n**Oudere en kleinere machten:** **Nyx**, de Nacht, moeder van Hypnos (Slaap) en Thanatos (Dood); **de Moiren**, die de levensdraad spinnen, afmeten en knippen, en aan wie zelfs Zeus gebonden is; **de Erinyen**, de wraakgodinnen van meineed, verwantenmoord en gastschennis; **Charon**, de veerman; **Kronos** en de Titanen, die na de Titanomachie in Tartaros geboeid liggen; nimfen van bronnen, bomen en bergen; riviergoden; de Muzen; Pan in Arkadia.\n\n**Interpretatio Latina:** de Latijnen zeggen dat hun Iuppiter Zeus is, hun Mars Ares en hun Saturnus Kronos, *maar zoals hij werkelijk is: een milde boerengod van de Gouden Eeuw*. Achaische priesters vinden dat aanmatigend. Voor piety geldt de Latijnse naam als dezelfde god.\n\n**Andere goden:**\n- **Kemet:** Anubis (de doden, balseming), Ma'at (waarheid, orde), Osiris (stierf, herrees en regeert over het hiernamaals), Thoth (kennis, schrift), Sekhmet (oorlog, pest; moeder van de leonin).\n- **Het Noorden:** Odin (wijsheid, de gevallenen), Thor (bescherming, storm), Freyja (liefde, strijd, de helft van de gevallenen), Hel (de strododen). De Walkuren dragen de dapperen naar Valhalla.\n- **Het Woord:** de Gemeenschap aanbidt één God zonder beeld, het Woord dat *de dood zal overwinnen*. Hun priesters doen wonderen zoals andere priesters; wat het Woord werkelijk is, zegt niemand met zekerheid.\n\n## 3. Huisregel: Piety (gebaseerd op Theros)\nJe mag je toewijden aan **één** god (niet verplicht). Je begint met **piety 1**.\n- **+1** bij een significante daad die de idealen van je god dient (DM bepaalt; wordt gelogd).\n- **−1** bij een daad die je god haat. Bij grove schending gaat er meer af en krijg je goddelijk ongenoegen.\n- Van god wisselen zet je piety terug op 0.\n- **Xenia:** gastschennis kost **−5 piety** (bij Zeus, of bij de eigen god als die xenia eert) en trekt binnen 1d4 dagen een **Erinys** aan (tegen lagere levels een schaduw-Erinys met de helft van de HP). Ook een gastheer is aan xenia gebonden.\n\n| Drempel | Titel | Effect |\n|---|---|---|\n| 3 | Toegewijde | Eerste gunst |\n| 10 | Begunstigde | Tweede gunst |\n| 25 | Uitverkorene | Een unieke gunst, in het spel bepaald |\n\n**Gunsten** (alle 1× gelden per Long Rest; spells zonder spell slot gebruiken je hoogste spellcasting ability of anders Wisdom):\n\n| God | Piety 3 | Piety 10 |\n|---|---|---|\n| Zeus | Advantage op één Charisma-check waarin je een eed of xenia aanroept (1×) | Bij een weapon attack die raakt: +2d8 thunder damage (1×) |\n| Hera | Advantage op Insight over trouw of verraad (1×) | Reaction: een bondgenoot binnen 9 m krijgt +3 AC tegen één aanval (1×) |\n| Athena | Advantage op één Intelligence-check (1×) | Aan het begin van een gevecht rollen jij en je groep Initiative met advantage (1×) |\n| Apollon | Advantage op Medicine of Performance (1×) | Cure Wounds (level 1) zonder slot (1×) |\n| Artemis | Advantage op Survival om te sporen (1×) | Hunter's Mark zonder slot (1×) |\n| Ares | Bij een treffer: extra schade gelijk aan je Proficiency Bonus (1×) | Als je naar 0 HP gaat maar niet sterft: in plaats daarvan 1 HP (1×) |\n| Aphrodite | Advantage op Persuasion bij iemand die je bewondert (1×) | Charm Person zonder slot (1×) |\n| Hermes | Bonus Action: Dash of Disengage (1×) | Misty Step zonder slot (1×); advantage op checks voor begrafenisriten |\n| Hephaistos | Proficiency met Smith's Tools; repareer een niet-magisch voorwerp in 10 minuten | Magic Weapon zonder slot (1×) |\n| Poseidon | Swim speed gelijk aan je walking speed | Thunderwave zonder slot (1×); je kunt onder water ademen |\n| Demeter | Elke ochtend 1d4 Goodberry-bessen | Resistance tegen poison damage |\n| Dionysos | Advantage op saves tegen charmed en poisoned (1×) | Tasha's Hideous Laughter zonder slot (1×) |\n| Hades | Advantage op saves tegen frightened | Speak with Dead zonder slot (1×) |\n| Persephone | Je weet altijd of een lijk minder dan 24 uur oud is, en hoe het stierf | Lesser Restoration zonder slot (1×) |\n| Hekate | Darkvision 18 m (of +9 m als je die al hebt) | Misty Step of Bane zonder slot (1×) |\n| Anubis/Ma'at | Advantage op Insight om een leugen te zien (1×) | Zone of Truth zonder slot (1×) |\n| Odin | Advantage op History of Arcana (1×) | Augury zonder slot (1×) |\n| Thor | +1 AC tegen aanvallen op afstand | Bij een weapon attack die raakt: +2d8 lightning damage (1×) |\n| Het Woord | Advantage op saves tegen charmed (1×) | Bless zonder slot (1×) |\n\n## 4. Cultussen en heiligdommen (selectie)\n- **Zeus:** Dodona, de Olympos; elke gastheer is zijn priester aan de haard.\n- **Athena:** de Akropolis van Athenai; de Panathenaia in Hekatombaion.\n- **Apollon:** Delphoi en Delos; zangers, genezers en zieners.\n- **Artemis:** heiligdommen in bossen en aan de rand van de wildernis.\n- **Hermes:** hermen op kruispunten en wegen; kleine hiera in havensteden zoals Melitta. Zijn priesters zorgen dat vreemdelingen en vergeten doden begraven worden.\n- **Hephaistos:** Lemnos, met de Kabeiroi; smidsen overal.\n- **Poseidon:** de Isthmos, kapen en havens; vóór elke zeereis een offer.\n- **Demeter en Persephone:** Eleusis en de Mysteriën; de Thesmophoria in Pyanepsion.\n- **Dionysos:** Naxos, de Kithairon, de theaters; de Grote Dionysia in Elaphebolion; de Anthesteria in Anthesterion, wanneer volgens oud gebruik de doden rondlopen.\n- **Aphrodite:** de tempel op Akrokorinthos met haar hierodouloi.\n- **Hades:** weinig tempels, gesloten heiligdommen; men noemt hem liever *Plouton* of *de Heer van velen*. Offers aan hem gaan in een kuil in de aarde, met het gezicht afgewend.\n- **Hekate:** drievoudige beelden op kruispunten; offers bij nieuwe maan.\n- **Saturnus:** de tempels van Alba Longa en de Saturnalia in de winter."
    },
    "s3_volken_en_helden": {
      "title": "S3 Volken en vaste figuren (publiek voor spelers en DM)",
      "keywords": "hemitheos,halfgod,spartos,spartoi,kabeiros,kabeiroi,dvergr,dvergar,nymphogeen,nimf,daktylos,gigantenbloed,jötun,pygmaios,kyklopide,chthonios,satyr,kentaur,centaur,minotaur,triton,leonin,species,volk,odysseus,penelope,telemachos,menelaos,helena,demophon,thersandros,lykos,ascanius,teukros,kirke,achilleus,patroklos,aias,agamemnon,hektor,sisyphos,prometheus,chiron,herakles,theseus,minos,held,helden,koning,tiran,walkure,farao",
      "text": "# S3 Volken en vaste figuren\n\n## 1. Volken (species volgens de 2024-regels)\nGebruik de species uit het Player's Handbook 2024. In deze wereld zien ze er zo uit:\n\n| 5E-species | In deze wereld | Korte beschrijving |\n|---|---|---|\n| Human | Achaiërs, Latijnen, Noordmannen, Kemeti, Oosterlingen | De meerderheid. Je cultuur bepaalt veel. |\n| Aasimar | **Hemitheoi** (halfgoden) | Een god in je stamboom, een paar generaties terug. Je wordt aanbeden én gewantrouwd. |\n| Dragonborn | **Spartoi** | Nazaten van de drakentandmannen van Thebai. Geschubd, trots, krijgshaftig. |\n| Dwarf | **Kabeiroi** (Lemnos) of **Dvergar** (Noorden) | Smeden. De Kabeiroi dienen Hephaistos, de Dvergar smeedden de boeien van Fenrir. |\n| Elf | **Nymphogenen** (nimfgeboren) | High Elf = Hesperidenbloed, Wood Elf = dryadenbloed, Drow = Kinderen van Nyx. |\n| Gnome | **Daktyloi** | Kleine smid-tovenaars van de berg Ida. Uitvinders van het metaalwerk. |\n| Goliath | **Gigantenbloed / Jötunbloed** | Verre nazaten van de reuzen die tegen de goden vochten. |\n| Halfling | **Pygmaioi** | Klein volk uit het zuiden, beroemd om hun eeuwige oorlog met de kraanvogels. |\n| Orc | **Kyklopiden** | Verre verwanten van de Kyklopen-smeden en -herders. Sterk en taai. |\n| Tiefling | **Chthonioi** | Erinyenbloed (Abyssal), Onderwereldbloed (Chthonic) of Tartarosbloed (Infernal). Men spuugt naar je. |\n\nOok toegestaan (uit Mythic Odysseys of Theros; ability scores uit je achtergrond, volgens 2024): **Satyr** (volgelingen van Dionysos), **Centaur** (de kentauren van de Pelion), **Minotaur** (de vervloekte Kretenzische lijn van Asterion), **Triton** (volk van Poseidon) en **Leonin** (de leeuwenvolken van Kemet, kinderen van Sekhmet).\n\n## 2. Classes in deze wereld (flavor, geen beperking)\n- **Cleric / Paladin:** kies een god (of het Woord). Je eed of domein past bij je god.\n- **Warlock:** patronen zoals Hekate, een Titaan, de Erinyen, Hel of een gevangen daimon. Wees voorzichtig.\n- **Wizard:** de school van Kirke op Aiaia, de heka-schrijvers van Kemet, of de runenkunst van het Noorden.\n- **Sorcerer:** goddelijk bloed, een vloek, of je bent door een god aangeraakt.\n- **Druid:** priesters van Demeter of Artemis, of de eikenpriesters van Dodona.\n- **Bard:** aoidoi (zangers van epen), sofisten, toneelspelers van Dionysos, skalden.\n- **Ranger, Rogue, Fighter, Barbarian, Monk:** gewoon helemaal raak. Een monk kan een Pythagoreeër zijn, of een worstelaar uit Olympia (pankration).\n\n## 3. Vaste figuren in het jaar 21 n.I.\n*Openlijk bekend; wat men over hen zegt, is niet altijd de hele waarheid.*\n\n**Helden en koningen**\n- **Odysseus, zoon van Laërtes**, koning van Ithaka: de sluwste man van Hellas. Hij kwam vorig jaar na twintig jaar thuis, nu oud en vol verhalen, met zijn vrouw **Penelope** en zoon **Telemachos**. Sommigen fluisteren dat niet Laërtes maar Sisyphos zijn echte vader was.\n- **Menelaos, zoon van Atreus**, koning van Sparta: oud geworden, met **Helena** weer aan zijn zijde.\n- **Demophon, zoon van Theseus**: een zware stem in de Raad van Athenai; eerlijk en overbelast.\n- **Thersandros**: koning van Ephyra, uit een zwakke, late lijn.\n- **Lykos**: tiran van Melitta, kleinzielig en bang voor opstand.\n- **Ascanius, zoon van Aeneas**: stichter en heer van Alba Longa in Latium.\n- **Teukros, zoon van Telamon**: de boogschutter van Ilion, door zijn vader verbannen omdat hij zonder zijn broer Aias thuiskwam; hij zwerft over zee.\n- **Kirke**: de tovenares van Aiaia, dochter van Helios.\n\n**De gevallenen en de gestraften** (zij leven voort in verhalen, graven en de Onderwereld)\n- **Achilleus, Patroklos en Aias, zoon van Telamon**: begraven aan de kust van de Troas. Aias stierf door zijn eigen zwaard na de strijd om de wapens van Achilleus.\n- **Agamemnon**: bij zijn thuiskomst vermoord; zijn huis in Mykenai is uitgemoord.\n- **Hektor** en het huis van Priamos: gevallen met Ilion.\n- **Sisyphos, zoon van Aiolos**: de oude koning van Ephyra die de dood twee keer bedroog. Hij duwt in Tartaros eeuwig een steen een heuvel op. Zijn vrouw **Merope** was een van de Pleiaden; zijn zoon **Glaukos** werd op lijkspelen door zijn eigen merries verscheurd, zijn kleinzoon **Bellerophon** door Zeus van Pegasos geworpen.\n- **Prometheus**: de Titaan die het vuur stal; door Herakles van de Kaukasos bevrijd.\n- **Chiron**: de wijze kentaur van de Pelion, leraar van helden; hij gaf zijn onsterfelijkheid op voor Prometheus.\n- **Herakles**: vergoddelijkt en op de Olympos.\n- **Theseus**: dood; zijn zonen leven in Athenai.\n- **Minos** en de **Minotauros**: het Labyrint op Kreta staat leeg sinds Theseus.\n\n**Bekende instellingen en figuren van de goden**\n- **De Pythia** van Delphoi, die op de drievoet voor Apollon spreekt.\n- **Charon**, de veerman van de Styx, die een obool vraagt.\n- **De Walkuren** van Odin, die de dapperen van het slagveld halen.\n- **Anubis en de Weegzaal** van Kemet."
    }
  }
  };
  D.register(S);
})(typeof self !== "undefined" ? self : this);
