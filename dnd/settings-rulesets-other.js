/* Regelsets met een eigen worpsoort: Avatar Legends (2d6 + stat, "2d6") en Star Wars RPG van Fantasy Flight/Edge (dobbelpool met symbolen, "pool").
   Bron: de regeldossiers in dnd/tools/dossiers/; wat daar [ONTBREEKT]/[ONZEKER] was, is een vrij invulveld op het blad. */
(function (root) {
  "use strict";
  const isNode = typeof module === "object" && module.exports;
  const RS = isNode ? require("./settings-rulesets.js") : root.DNDRulesets, Dice = isNode ? require("./dobbel.js") : root.DNDDice;
  const cur = (n, m) => '{"current":' + n + ',"max":' + m + '}';
  const M = (label, stat, group) => ({ k: label, label, stat, group });

  /* ---------------- Avatar Legends ---------------- */
  RS.register({
    id: "avatar", label: "Avatar Legends", family: "2d6", sys: "2d6", name: "Avatar Legends", role: "GM (spelleider)",
    terms: "Engelse Avatar Legends-termen (Moves, Playbooks, Balance, Fatigue, Conditions, Techniques, Growth)",
    dice: "Spelers rollen 2d6 + stat wanneer de fictie een Move triggert (fysiek of met de dobbelknop in de app); hun worp staat in hun actie (\"[worp: ...]\"). De GM rolt normaal niet. Vraag een Move via nextTurn.checks (naam → welke Move en waarom) alleen als de fictie hem triggert.\n- Voor eventuele willekeur van NPC's gebruik je UITSLUITEND de meegegeven voorgegooide d6's, in volgorde. Noem de uitkomst kort in de vertelling.",
    pcStats: '"fatigue":' + cur(0, 5) + ',"balance":' + cur(0, 3) + ',"center":0,"conditions":{"Afraid":false,"Angry":false,"Guilty":false,"Insecure":false,"Troubled":false},"statuses":[],"growth":0,"resources":{}',
    lootPower: "geen vaste buit: uitrusting is fictieve toegang, hoogstens één bijzonder voorwerp met een verhaal per arc",
    rollEx: '{"who":"Wachter","what":"Strike","natural":7,"mod":0,"total":7,"result":"weak hit"}; Avatar Legends kent geen schadedobbelstenen: gevolgen lopen via Fatigue, Conditions, Balance en Statuses',
    crit: "Er zijn geen natuurlijke criticals: een strong hit (10+) is een volledig succes, een weak hit (7-9) een succes met een prijs of keuze, een miss (6 of minder) een GM-move die de fictie verandert.",
    playerRolls: 'Spelerworpen komen binnen als "[worp: Assess a Situation: 2d6(4,5)+1 = 10, strong hit]" (twee dobbelstenen, stat-bonus, totaal en niveau): de uitkomst is al bepaald, reken niet opnieuw. Vraag je om een Move, benoem dan de Move duidelijk (bv. "Assess a Situation", "Advance and Attack") en laat de speler de gevolgen van strong hit, weak hit of miss kiezen volgens de Move.',
    passive: "geen passieve scores: laat de fictie beslissen en vraag een Move alleen als hij getriggerd wordt",
    preDice: [["d6", 6, 12]],
    guide: "- SYSTEEMREGELS Avatar Legends: de fictie triggert een Move; de speler rolt 2d6 + de bijbehorende stat (Creativity, Focus, Harmony, Passion). 10+ is een strong hit, 7-9 een weak hit met een eigen prijs of keuze (geen generiek half succes), 6 of minder een miss: dan maakt de GM een move en verandert de fictie. De GM rolt normaal niet.\n- Houd Fatigue (0-5), Balance en center, Conditions (Afraid, Angry, Guilty, Insecure, Troubled: elk -2 op specifieke Moves) en Growth afzonderlijk bij in de Stand. Geen HP, levels of spell slots introduceren.\n- Gebruik Combat Exchanges alleen bij betekenisvolle conflicten (approach: Defend and Maneuver, Advance and Attack, Evade and Observe); laat relaties, principes en Balance centraal staan. Techniques en hun effecten staan op het blad van de speler; verzin geen regels die er niet staan.",
    partyMeters: [["fatigue", "Fatigue"], ["balance", "Balance"]],
    sheet: {
      kind: "2d6", note: "Avatar Legends (Magpie Games). De playbook-sheets, startstats, technieken en alle Move-triggers staan niet in de app: vul je stats, principles en technieken in volgens je playbook en het boek. Evade and Observe gebruikt Creativity of Harmony (kies), daarom twee regels.",
      statLabels: { Creativity: "Creativity", Focus: "Focus", Harmony: "Harmony", Passion: "Passion" }, stats: ["Creativity", "Focus", "Harmony", "Passion"], statDefault: 0,
      statHint: "Stats liggen meestal tussen −1 en +3; een worp is 2d6 + stat.",
      skillsTitle: "Moves", skills: [
        M("Rely on Your Skills and Training", "Focus", "Basic moves"), M("Push Your Luck", "Passion", "Basic moves"), M("Assess a Situation", "Creativity", "Basic moves"), M("Guide and Comfort", "Harmony", "Basic moves"),
        M("Trick", "Creativity", "Basic moves"), M("Intimidate", "Passion", "Basic moves"), M("Plead", "Harmony", "Basic moves"),
        M("Defend and Maneuver", "Focus", "Combat approach"), M("Advance and Attack", "Passion", "Combat approach"), M("Evade and Observe (Creativity)", "Creativity", "Combat approach"), M("Evade and Observe (Harmony)", "Harmony", "Combat approach")
      ],
      meters: [{ k: "fatigue", label: "Fatigue", max: () => 5, start: () => 0 }, { k: "balance", label: "Balance", max: () => 3, start: () => 0 }],
      derived: [],
      lists: [{ k: "principles", label: "Principles", hint: "Eén per regel: naam | positie op de Balance-track (−3 … +3)" }],
      professions: ["Adamant", "Bold", "Guardian", "Hammer", "Icon", "Idealist", "Pillar", "Prodigy", "Rogue", "Successor"], professionLabel: "Playbook", noAge: true,
      extraText: [["training", "Training en technieken"], ["conditions", "Conditions en statussen"], ["growth", "Growth en groepsdoel"]],
      skillSpecs: "Voeg eigen Moves (playbook-moves) en technieken toe als extra move: naam | Stat (bv. Rooted Stance | Focus)."
    }
  });

  /* ---------------- Star Wars RPG (FFG/Edge) ---------------- */
  const faceList = k => Dice.SW_FACES[k].map((f, i) => (i + 1) + "=" + (f === "" ? "blanco" : f.replace(/s/g, "S").replace(/f/g, "F").replace(/a/g, "A").replace(/t/g, "T").replace(/r/g, "Triumph").replace(/d/g, "Despair"))).join(", ");
  const SK = (label, ch, group) => ({ k: label, label, ch, group });
  RS.register({
    id: "sw", label: "Star Wars RPG (FFG/Edge)", family: "pool", sys: "pool", name: "Star Wars RPG", role: "Game Master",
    terms: "Engelse Star Wars-termen (Characteristics, Skills, Career, Specialization, Wounds, Strain, Soak, Defense, Force Rating, Obligation/Duty/Morality)",
    dice: "Spelers rollen zelf hun dobbelpool (fysiek of met de dobbelknop in de app) en melden de symbolen; hun worp staat in hun actie (\"[worp: ...]\"). Vraag een check via nextTurn.checks (naam → welke skill of characteristic, de Difficulty (Simple 0 t/m Formidable 5), eventuele Boost/Setback en waarom).\n- Voor worpen van NPC's/vijanden gebruik je UITSLUITEND de meegegeven voorgegooide dobbelstenen, in volgorde: d8 voor Ability of Difficulty, d12 voor Proficiency of Challenge, d6 voor Boost of Setback. Gezichten Ability d8: " + faceList("G") + "; Proficiency d12: " + faceList("Y") + "; Difficulty d8: " + faceList("P") + "; Challenge d12: " + faceList("R") + "; Boost d6: " + faceList("B") + "; Setback d6: " + faceList("K") + ". Noem de uitkomst kort in de vertelling.",
    pcStats: '"wounds":' + cur(0, 12) + ',"strain":' + cur(0, 12) + ',"criticalInjuries":[],"forceRating":0,"resources":{},"conditions":[]',
    lootPower: "hoogstens één ongewoon voorwerp (een aangepast wapen, een zeldzaam onderdeel of een kristal) per missie, altijd met een verhaal en een nadeel",
    rollEx: '{"who":"Stormtrooper 1","what":"Ranged (Light)","dice":"1G 1Y 2P","total":2,"result":"2 Success, 1 Advantage"}; bij schade {"who","what":"Damage","dice":"blaster 6 + 2 net Success","total":8}',
    crit: "Verwerk Triumph (telt ook als Success) en Despair (telt ook als Failure) als extra gevolg; Advantage en Threat werken onafhankelijk van succes of falen en worden concreet ingevuld.",
    playerRolls: 'Spelerworpen komen binnen als "[worp: Piloting (Space): 2Y 1G 2P -> 2 Success, 1 Threat = Success]" (pool -> netto uitkomst na annuleren): de uitkomst is al bepaald, reken niet opnieuw. Vraag je om een check, benoem dan de skill of characteristic duidelijk (bv. "Piloting (Space)", "Cool") en de Difficulty.',
    passive: "zijn characteristic en skill rank als vaste uitkomst (zonder worp: een Easy taak slaagt bijna altijd)",
    preDice: [["d8", 8, 12], ["d12", 12, 8], ["d6", 6, 10]],
    guide: "- SYSTEEMREGELS Star Wars (Edge-systeem): de pool bestaat uit Ability (groen d8) en Proficiency (geel d12) voor de speler, Difficulty (paars d8) en Challenge (rood d12) tegen hem, plus Boost (blauw d6) en Setback (zwart d6). Succes en Failure heffen elkaar op, Advantage en Threat ook, onafhankelijk van elkaar; minstens één netto Success slaagt. Triumph telt ook als Success, Despair ook als Failure en blijven bestaan na het annuleren.\n- Laat Advantage/Threat altijd iets betekenen (ook bij falen resp. slagen). Gebruik initiative-slots in plaats van een vaste individuele volgorde en range bands in plaats van een grid.\n- Wounds en Strain zijn oplopende tellers (boven de threshold: incapacitated; Wounds ook een Critical Injury). Houd ook de Destiny Pool bij in de Stand (statePatch.destinyPool {light, dark}), Obligation/Duty/Morality en conflicten.\n- Dit is de Galactic Civil War-era (Edge of the Empire, Age of Rebellion, Force and Destiny); een Old Republic-setting is een conversie en geen onderdeel van de core books.",
    partyMeters: [["wounds", "Wounds"], ["strain", "Strain"]],
    sheet: {
      kind: "pool", note: "Star Wars RPG (Fantasy Flight/Edge). Species, Career, Specialization, talents en Force powers vul je in volgens je boek (die tabellen staan niet in de app). Wound/Strain Threshold: species-basis + Brawn resp. Willpower (Human 10); pas de max aan als je species anders is.",
      statLabels: { Brawn: "Brawn", Agility: "Agility", Intellect: "Intellect", Cunning: "Cunning", Willpower: "Willpower", Presence: "Presence" }, stats: ["Brawn", "Agility", "Intellect", "Cunning", "Willpower", "Presence"], statDefault: 2,
      statHint: "Characteristics liggen meestal tussen 1 en 5 bij creatie (Human: allemaal 2).",
      skillsTitle: "Skills (ranks 0–5)", skills: [
        SK("Astrogation", "Intellect", "General"), SK("Athletics", "Brawn", "General"), SK("Charm", "Presence", "General"), SK("Coercion", "Willpower", "General"), SK("Computers", "Intellect", "General"), SK("Cool", "Presence", "General"),
        SK("Coordination", "Agility", "General"), SK("Deception", "Cunning", "General"), SK("Discipline", "Willpower", "General"), SK("Leadership", "Presence", "General"), SK("Mechanics", "Intellect", "General"), SK("Medicine", "Intellect", "General"),
        SK("Negotiation", "Presence", "General"), SK("Perception", "Cunning", "General"), SK("Piloting (Planetary)", "Agility", "General"), SK("Piloting (Space)", "Agility", "General"), SK("Resilience", "Brawn", "General"),
        SK("Skulduggery", "Cunning", "General"), SK("Stealth", "Agility", "General"), SK("Streetwise", "Cunning", "General"), SK("Survival", "Cunning", "General"), SK("Vigilance", "Willpower", "General"),
        SK("Brawl", "Brawn", "Combat"), SK("Gunnery", "Agility", "Combat"), SK("Melee", "Brawn", "Combat"), SK("Ranged (Light)", "Agility", "Combat"), SK("Ranged (Heavy)", "Agility", "Combat"), SK("Lightsaber", "Brawn", "Combat"),
        SK("Knowledge (Core Worlds)", "Intellect", "Knowledge"), SK("Knowledge (Education)", "Intellect", "Knowledge"), SK("Knowledge (Lore)", "Intellect", "Knowledge"), SK("Knowledge (Outer Rim)", "Intellect", "Knowledge"),
        SK("Knowledge (Underworld)", "Intellect", "Knowledge"), SK("Knowledge (Warfare)", "Intellect", "Knowledge"), SK("Knowledge (Xenology)", "Intellect", "Knowledge")
      ],
      meters: [{ k: "wounds", label: "Wounds", max: v => 10 + v.Brawn, start: () => 0 }, { k: "strain", label: "Strain", max: v => 10 + v.Willpower, start: () => 0 }],
      derived: [{ k: "soak", label: "Soak", fn: v => v.Brawn }],
      lists: [], professions: ["Bounty Hunter", "Colonist", "Explorer", "Hired Gun", "Smuggler", "Technician", "Ace", "Commander", "Diplomat", "Engineer", "Soldier", "Spy", "Consular", "Guardian", "Mystic", "Seeker", "Sentinel", "Warrior"],
      professionLabel: "Species, Career en Specialization", noAge: true,
      extraText: [["talents", "Talents en Specialization"], ["force", "Force Rating en Force powers"], ["duty", "Obligation, Duty, Morality en Motivation"], ["armor", "Armor, Soak en Defense"]],
      skillSpecs: "Extra skills (bv. een species-eigen skill): naam | rank | characteristic."
    }
  });

  /* ---------------- Old-School Essentials (B/X) ---------------- */
  const oseMod = n => n <= 3 ? -3 : n <= 5 ? -2 : n <= 8 ? -1 : n <= 12 ? 0 : n <= 15 ? 1 : n <= 17 ? 2 : 3;
  const OS = (label, base, group, x6) => ({ k: label, label, base, group, x6: !!x6 });
  RS.register({
    id: "ose", label: "Old-School Essentials", family: "d20", sys: "ose", name: "Old-School Essentials", role: "Referee",
    terms: "Engelse OSE-termen (Referee, THAC0/AC, Saving Throws, Hit Dice, Dungeon turn, Morale, Reaction, Retainers)",
    dice: "Spelers rollen zelf (fysiek of met de dobbelknop in de app); hun worp staat in hun actie (\"[worp: ...]\"). Vraag een worp via nextTurn.checks (naam → welke worp: attack, save vs ..., ability check of een x-in-6-kans, en waarom) en noem de AC van een tegenstander niet tenzij de speler die kan zien.\n- Voor worpen van NPC's/monsters gebruik je UITSLUITEND de meegegeven voorgegooide dobbelstenen, in volgorde (d20 voor attacks en saves, d6 voor schade, exploratie, reaction en morale (2d6 = twee d6's), d8/d10/d12/d4 voor schade, d100 voor thief skills). Noem de worp kort in de vertelling.",
    pcStats: '"hp":{"current":7,"max":7,"temp":0},"xp":0,"gp":20,"resources":{"Light":"6 turns"},"conditions":[]',
    lootPower: "hoogstens één magisch voorwerp per personage per dungeon, nooit als vaste beloning maar bewaakt in een schat of een gevaarlijke plek, met een prijs",
    rollEx: '{"who":"Goblin 1","what":"Attack","natural":14,"mod":0,"total":14,"result":"vs AC 6: hit"}; bij schade {"who","what":"Damage","dice":"1d6","total":4}',
    crit: "Een natural 20 raakt altijd en een natural 1 mist altijd; er is geen extra critical damage. Beloon slimme oplossingen en gebruik rulings over rules.",
    playerRolls: 'Spelerworpen komen binnen als "[worp: Attack (melee): 14 +1 = 15]" (d20 + attack bonus: jij vergelijkt het totaal met de AC van het doel), "[worp: Save vs Spells: 16 vs 15 = Success]", "[worp: Open Doors: 2 on 1d6 vs 2-in-6 = Success]" of "[worp: Climb Sheer Surfaces: 34 vs 87 = Success]": het totaal of de uitkomst is al bepaald met het karakterblad, reken niet opnieuw. Vraag je om een worp, benoem dan duidelijk welke (attack, save, ability check of exploratie).',
    passive: "zijn exploratiekans of vaardigheidswaarde (zonder worp: een hoge kans slaagt, een lage mislukt)",
    preDice: [["d20", 20, 20], ["d12", 12, 4], ["d10", 10, 6], ["d8", 8, 8], ["d6", 6, 14], ["d4", 4, 6], ["d100", 100, 4]],
    guide: "- SYSTEEMREGELS Old-School Essentials (B/X): een attack is d20 + modifiers tegen de AC van het doel (THAC0 of ascending AC: kies één conventie per campagne); een saving throw is d20 ≥ het saving-throw-doel; ability checks zijn optioneel (d20 ≤ de ability); veel exploratie is een x-in-6-kans op 1d6; thief skills zijn percentages (Hear Noise is x-in-6). Geen reactions, bonus actions, skills-lijst of death saves: 0 HP is dood.\n- Houd tijd en middelen bij: een dungeon turn is 10 minuten, een combat round 10 seconden; wandering monsters (doorgaans elke 2 turns 1-in-6), licht, rations, encumbrance en gold. Rol reaction (2d6: 2 vijandig, 3-5 onvriendelijk, 6-8 onzeker, 9-11 vriendelijk, 12 zeer vriendelijk) en morale (2d6 > morale: vlucht of overgave, doorgaans bij de eerste dode en bij een half verloren groep) waar relevant.\n- Initiative is per kant (1d6 per ronde, hoogste eerst): declareer eerst spells en vertrek, dan morale, beweging, schieten, magie en melee. Telegrafeer gevaar, beloon slimme oplossingen en wees terughoudend met automatische wapens-tegen-lijf.\n- XP komt vooral uit schatten (1 xp per gp teruggebrachte niet-magische schat) en monsters; verdeel die over de overlevenden en retainers volgens de regels. Er zijn geen milestones.",
    sheet: {
      kind: "ose", note: "Old-School Essentials (Necrotic Gnome), basis B/X. De klassen- en XP-tabellen, spells, Turn Undead en de Advanced-opties staan niet in de app: vul AC, attack bonus, saves en thief skills in volgens je klasse en niveau. Kies één AC-conventie per campagne (descending AC of ascending AAC) en gebruik die consequent.",
      statLabels: { STR: "Strength", INT: "Intelligence", WIS: "Wisdom", DEX: "Dexterity", CON: "Constitution", CHA: "Charisma" }, stats: ["STR", "INT", "WIS", "DEX", "CON", "CHA"], statDefault: 10,
      statDice: { STR: "3d6", INT: "3d6", WIS: "3d6", DEX: "3d6", CON: "3d6", CHA: "3d6" }, statHint: "3d6 per ability (3–18). Modifier: 3 → −3, 4–5 → −2, 6–8 → −1, 9–12 → 0, 13–15 → +1, 16–17 → +2, 18 → +3.",
      mod: oseMod, numbersTitle: "AC, attack, saves en voortgang",
      numbers: [
        { k: "ac", label: "AC (descending)", def: 9 }, { k: "aac", label: "AAC (ascending)", def: 10 }, { k: "ab", label: "Attack bonus", def: 0 }, { k: "level", label: "Level", def: 1 }, { k: "xp", label: "XP", def: 0 }, { k: "gp", label: "GP", def: 0 },
        { k: "sv_death", label: "Save: Death/Poison", def: 12, hide: true }, { k: "sv_wands", label: "Save: Wands", def: 13, hide: true }, { k: "sv_para", label: "Save: Paralysis/Petrify", def: 14, hide: true },
        { k: "sv_breath", label: "Save: Breath Attacks", def: 15, hide: true }, { k: "sv_spells", label: "Save: Spells/Rods/Staves", def: 16, hide: true }
      ],
      saves: [["death", "Death/Poison"], ["wands", "Wands"], ["para", "Paralysis/Petrify"], ["breath", "Breath Attacks"], ["spells", "Spells/Rods/Staves"]],
      skillsTitle: "Exploratie en thief skills",
      skills: [
        OS("Open Doors", 2, "Exploratie (x-in-6)", true), OS("Listen at Doors", 1, "Exploratie (x-in-6)", true), OS("Find Secret Doors", 1, "Exploratie (x-in-6)", true), OS("Find Room Traps", 1, "Exploratie (x-in-6)", true),
        OS("Climb Sheer Surfaces", 0, "Thief skills", false), OS("Find or Remove Treasure Traps", 0, "Thief skills", false), OS("Hear Noise", 0, "Thief skills", true), OS("Hide in Shadows", 0, "Thief skills", false),
        OS("Move Silently", 0, "Thief skills", false), OS("Open Locks", 0, "Thief skills", false), OS("Pick Pockets", 0, "Thief skills", false)
      ],
      skillSpecs: "Open Doors, Listen, Search en Find Traps: pas de x-in-6 aan op STR, ras en klasse. Thief skills: vul in volgens de thief-tabel van je level (0 = niet van toepassing).",
      meters: [{ k: "hp", label: "HP", max: v => Math.max(1, 4 + oseMod(v.CON)) }],
      derived: [{ k: "melee", label: "Melee mod", fn: v => { const m = oseMod(v.STR); return m > 0 ? "+" + m : String(m); } }, { k: "missile", label: "Missile mod", fn: v => { const m = oseMod(v.DEX); return m > 0 ? "+" + m : String(m); } }, { k: "conhp", label: "CON HP/level", fn: v => { const m = oseMod(v.CON); return m > 0 ? "+" + m : String(m); } }],
      lists: [], professions: ["Cleric", "Fighter", "Magic-User", "Thief", "Dwarf", "Elf", "Halfling", "Acrobat", "Assassin", "Barbarian", "Bard", "Druid", "Illusionist", "Knight", "Paladin", "Ranger"], professionLabel: "Class", noAge: true,
      extraText: [["alignment", "Alignment en talen"], ["spells", "Spells en memorized"]]
    }
  });
})(typeof self !== "undefined" ? self : this);
