/* Setting "Tamriel — De Vierde Era" (id tamriel): Elder Scrolls, 4E 201, vóór de gebeurtenissen bij Helgen. Aangeleverd als JSON door Gerben; hier ingebouwd via
   settings-spec.js. Afwijkingen t.o.v. de JSON: creator.lineage ingevuld (nodig voor Elf), S3 als DM-document gemarkeerd (secret), trefwoorden op S2/S3 voor Gemini.
   Registreert zichzelf bij DNDSettings. */
(function (root) {
  "use strict";
  const D = typeof module === "object" && module.exports ? require("./settings-data.js") : root.DNDSettings;
  const Spec = typeof module === "object" && module.exports ? require("./settings-spec.js") : root.DNDSettingsSpec;
  D.register(Spec.build({
    id: "tamriel", name: "Tamriel — De Vierde Era", year: 201, exRegA: "REG-WHITERUN", exRegB: "REG-EASTMARCH",
    blurb: "In 4E 201 splijt burgeroorlog Skyrim, terwijl draken terugkeren en het Aldmeri Dominion zijn invloed uitbreidt.",
    source: "Elder Scrolls-spellen en in-game teksten tot 4E 201; tegenstrijdige bronnen blijven perspectieven",
    magic: "Aedra, Daedra, Magnus, Hist en lokale tradities; spell schools zijn flavor voor D&D. Dragonborn als ziel van een draak is geen species en niet standaard beschikbaar. Argonian breath weapon is een expliciete niet-canon mechanische abstractie; alternatief Human met aangepaste flavor alleen na DM-akkoord.",
    limits: "Start vóór de gebeurtenissen bij Helgen; de Last Dragonborn is geen verplichte NPC. Geen fast travel zonder fictieve route; Oblivion en Sovngarde hebben geen gewone verbinding. Daedric artifacts zijn unieke plotobjecten.",
    loot: "septims, soul gems, alchemie, dwemeronderdelen, betoverde uitrusting", common: "Cyrodilic (Common)",
    styleBase: "handgeschilderde epische fantasy, ruige bergen, Nord-houtbouw, Ayleidsteen, Dwemerbrons en regionale architectuur",
    langs: ["Nordic", "Dunmeris", "Altmeris", "Jel", "Ta’agra", "Orcish", "Dovahzul", "Daedric", "Common Sign Language"],
    regions: [
      ["REG-WHITERUN", "Whiterun Hold", "Whiterun, Riverwood en vlakten; Balgruuf."], ["REG-EASTMARCH", "Eastmarch", "Windhelm, warmwaterbronnen en Stormcloaks."],
      ["REG-HAAFINGAR", "Haafingar", "Solitude, keizerlijke troepen en hof."], ["REG-REACH", "The Reach", "Markarth, Dwemerruïnes en Forsworn."],
      ["REG-RIFT", "The Rift", "Riften, meren en Thieves Guild."], ["REG-FALKREATH", "Falkreath", "Bossen, grafvelden en zuidelijke grens."],
      ["REG-HJAALMARCH", "Hjaalmarch", "Morthal en moerassen."], ["REG-PALE", "The Pale", "Dawnstar en noordelijke kust."],
      ["REG-WINTERHOLD", "Winterhold", "College en ruïnes van de stad."], ["REG-CYRODIIL", "Cyrodiil", "Imperial City, Heartland en provinciale steden."],
      ["REG-HIGHROCK", "High Rock", "Bretonse koninkrijken en ridderorden."], ["REG-HAMMERFELL", "Hammerfell", "Onafhankelijke Redguard-steden en Alik’r."],
      ["REG-MORROWIND", "Morrowind", "Dunmer, Great Houses en nasleep van Red Year."], ["REG-SOLSTHEIM", "Solstheim", "Raven Rock, Skaal en aslanden."],
      ["REG-BLACKMARSH", "Black Marsh", "Argonian-gemeenschappen, Hist en moerassen."], ["REG-ELSWEYR", "Elsweyr", "Anequina en Pellitine, Khajiit en Dominion-invloed."],
      ["REG-VALENWOOD", "Valenwood", "Bosmer, Green Pact en levende wouden."], ["REG-SUMMERSET", "Summerset", "Alinor, Altmer en Thalmor."],
      ["REG-ORSINIUM", "Orsinium", "Orsimer-gemeenschappen in westelijke bergen; precieze locatie onzeker."], ["REG-OBLIVION", "Oblivion", "Daedric realms; geen gewone geografische reis."],
      ["REG-SOVNGARDE", "Sovngarde", "Nordse heldenwereld; alleen bijzondere toegang."]
    ],
    travel: {
      "REG-WHITERUN|REG-EASTMARCH": 3, "REG-WHITERUN|REG-REACH": 4, "REG-WHITERUN|REG-RIFT": 4, "REG-WHITERUN|REG-FALKREATH": 3, "REG-WHITERUN|REG-HJAALMARCH": 3, "REG-WHITERUN|REG-PALE": 3,
      "REG-EASTMARCH|REG-RIFT": 3, "REG-EASTMARCH|REG-WINTERHOLD": 3, "REG-EASTMARCH|REG-MORROWIND": 8, "REG-HAAFINGAR|REG-REACH": 4, "REG-HAAFINGAR|REG-HJAALMARCH": 2, "REG-HAAFINGAR|REG-HIGHROCK": 10,
      "REG-REACH|REG-FALKREATH": 4, "REG-REACH|REG-HIGHROCK": 8, "REG-REACH|REG-HAMMERFELL": 9, "REG-RIFT|REG-CYRODIIL": 9, "REG-FALKREATH|REG-CYRODIIL": 7, "REG-HJAALMARCH|REG-PALE": 3, "REG-PALE|REG-WINTERHOLD": 3,
      "REG-WINTERHOLD|REG-SOLSTHEIM": 5, "REG-CYRODIIL|REG-HAMMERFELL": 10, "REG-CYRODIIL|REG-MORROWIND": 12, "REG-CYRODIIL|REG-BLACKMARSH": 12, "REG-CYRODIIL|REG-ELSWEYR": 10, "REG-CYRODIIL|REG-VALENWOOD": 12,
      "REG-HIGHROCK|REG-HAMMERFELL": 8, "REG-HIGHROCK|REG-ORSINIUM": 5, "REG-HAMMERFELL|REG-ORSINIUM": 5, "REG-MORROWIND|REG-SOLSTHEIM": 4, "REG-MORROWIND|REG-BLACKMARSH": 10, "REG-BLACKMARSH|REG-ELSWEYR": 12,
      "REG-ELSWEYR|REG-VALENWOOD": 7, "REG-VALENWOOD|REG-SUMMERSET": 8
    },
    factions: [["Imperial Legion", "Behoud van Empire en orde; White-Gold Concordat beperkt beleid."], ["Stormcloaks", "Onafhankelijk Skyrim en Talosverering; interne spanningen."], ["Thalmor", "Politieke macht van het Dominion; handhaaft verbod op Talos."],
      ["Companions", "Krijgersbroederschap in Jorrvaskr; innerlijke geheimen."], ["College of Winterhold", "Magische studie; wantrouwen van omwonenden."], ["Thieves Guild", "Criminele netwerken in Riften."],
      ["Dark Brotherhood", "Geheime moordenaarscultus; geen verplichte PC-route."], ["Forsworn", "Reach-verzet, verschillende cellen en doelen."], ["Great Houses", "Politieke en culturele Dunmer-instituties."], ["Psijic Order", "Afgelegen magische orde; zelden direct betrokken."]],
    species: {
      Human: { label: "Nord, Imperial, Breton of Redguard", speed: 30, size: "Medium of Small", traits: [["Resourceful", "Heroic Inspiration na Long Rest."], ["Skillful", "Eén extra skill proficiency."], ["Versatile", "Extra Origin Feat."]] },
      Elf: { label: "Altmer, Bosmer of Dunmer", speed: 30, size: "Medium", traits: [["Darkvision", "60 ft."], ["Elven Lineage", "Kies de officiële 2024-lineage met bijbehorende spells."], ["Fey Ancestry", "Advantage tegen charmed."], ["Keen Senses", "Insight, Perception of Survival proficiency."], ["Trance", "Long Rest via 4 uur meditatie."]] },
      Orc: { label: "Orsimer", speed: 30, size: "Medium", traits: [["Adrenaline Rush", "Bonus Action Dash en PB temporary HP; PB× per Short of Long Rest."], ["Darkvision", "120 ft."], ["Relentless Endurance", "Bij 0 HP zonder directe dood naar 1 HP; 1× per Long Rest."]] },
      Dragonborn: { label: "Argonian (mechanische herinterpretatie)", speed: 30, size: "Medium", extra: "Argonian is een expliciete reskin, geen letterlijke drakenafstamming; vlucht en ademwapen zijn niet canoniek.",
        traits: [["Draconic Ancestry", "Kies acid, cold, fire, lightning of poison."], ["Breath Weapon", "Vervangt aanval; 15-ft cone of 30-ft line, DEX save DC 8 + CON + PB; 1d10, schaalt op 5/11/17; PB× per Long Rest."], ["Damage Resistance", "Ancestry damage type."], ["Darkvision", "60 ft."], ["Draconic Flight", "Level 5: Bonus Action, 10 minuten fly speed, 1× per Long Rest."]] },
      Tabaxi: { label: "Khajiit", speed: 30, size: "Medium of Small", traits: [["Darkvision", "60 ft."], ["Feline Agility", "Verdubbel speed tijdens beurt; herlaad na beurt zonder beweging."], ["Cat’s Claws", "Climb speed gelijk aan walking speed; claws 1d6 + STR slashing."], ["Cat’s Talent", "Perception en Stealth proficiency."]] }
    },
    classes: { Barbarian: "Nordse krijger", Bard: "Bard van solitude", Cleric: "Priester van de divines", Druid: "Skaal of natuurmagiër", Fighter: "Legionair of huurling", Monk: "Martial artist uit een tempel", Paladin: "Vigilant of stendarr", Ranger: "Jager", Rogue: "Thieves guild-agent", Sorcerer: "Aangeboren magiër", Warlock: "Daedric pactdrager", Wizard: "College-magiër" },
    inspiration: [["A", "Legionair of huurling", "Human", "Fighter", "REG-WHITERUN"], ["B", "Bard van solitude", "Elf", "Bard", "REG-EASTMARCH"], ["C", "Priester van de divines", "Orc", "Cleric", "REG-HAAFINGAR"], ["D", "Jager", "Dragonborn", "Ranger", "REG-REACH"], ["E", "Thieves guild-agent", "Tabaxi", "Rogue", "REG-RIFT"], ["F", "College-magiër", "Human", "Wizard", "REG-FALKREATH"]],
    figures: [["Ulfric Stormcloak", "Jarl van Windhelm; leidt opstand tegen het Empire."], ["General Tullius", "Keizerlijk bevelhebber in Skyrim."], ["Balgruuf the Greater", "Jarl van Whiterun; probeert zijn hold te beschermen."], ["Elisif the Fair", "Weduwe van Torygg, jarl van Solitude."], ["Delphine", "Overlevende Blade; wantrouwt Thalmor en draken."], ["Esbern", "Blade en geleerde; verblijfplaats is geen publieke kennis."], ["Arngeir", "Greybeard op High Hrothgar; terughoudend met de Voice."], ["Paarthurnax", "Verborgen draak; identiteit en locatie zijn geheim."], ["Alduin", "Teruggekeerde draak; geen gewone tegenstander voor lage levels."], ["Maven Black-Briar", "Invloedrijke zakenpersoon in Riften."], ["Savos Aren", "Arch-Mage van het College bij aanvang."], ["Kodlak Whitemane", "Harbinger van de Companions."], ["Neloth", "Telvanni-meester op Solstheim."], ["Titus Mede II", "Keizer; zijn latere lot is niet vooraf bepaald."]],
    kwS2: "magie,magiër,spell,daedra,aedra,divines,talos,hist,magnus,priester,tempel,schrijn,dood,sterf,resurrection,geloof,vloek,soul gem,thalmor,college",
    kwS3: "ulfric,tullius,balgruuf,elisif,delphine,esbern,arngeir,paarthurnax,alduin,maven,savos,kodlak,neloth,titus,nord,imperial,breton,redguard,altmer,bosmer,dunmer,orsimer,argonian,khajiit,species,volk,jarl,keizer,draak,dragonborn"
  }));
})(typeof self !== "undefined" ? self : this);
