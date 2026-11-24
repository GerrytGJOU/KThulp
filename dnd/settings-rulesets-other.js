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

  /* ---------------- Companion- en NPC-statblocks per regelset (tools/statblock.js, tools/jobs.js, world.js) ----------------
     noHp: het systeem kent geen HP; de meters staan dan in resources (zero = teller vanaf 0 die bij rust op 0 komt).
     Zonder R.companion (D&D 2024) gelden de oorspronkelijke eisen: hp 5-200, ac 8-22, hulpbronnen met rest short|long. */
  const MT = (k, label, max, rest, extra) => Object.assign({ k, label, max, rest }, extra || {});
  const COMP_D100 = { noHp: false, hp: [3, 30], ac: null, text: "text bevat: kenmerken, belangrijkste skills met percentages, wapens en schade, pantser, bijzonderheden en wat de NPC weet (geen geheimen over canonieke NPC's)." };
  RS.get("dg").companion = Object.assign({}, COMP_D100, {
    meters: [MT("wp", "Willpower", [1, 20], "long", { required: true }), MT("san", "Sanity", [10, 99], "none", { required: true })],
    focus: "Delta Green-NPC: STR/CON/DEX/INT/POW/CHA, HP, WP, SAN (en Breaking Point), skills als percentages, wapens met schade (Lethality% bij dodelijke wapens), Armor, Bonds. Unnatural-wezens krijgen Lethality, Armor en het SAN-verlies bij ontmoeting."
  });
  const COMP_COC = Object.assign({}, COMP_D100, {
    meters: [MT("mp", "Magic Points", [1, 30], "long"), MT("san", "Sanity", [10, 99], "none", { required: true }), MT("luck", "Luck", [10, 99], "none")],
    focus: "Call of Cthulhu-NPC: STR/CON/SIZ/DEX/APP/INT/POW/EDU, HP, MP, SAN, Luck, Build en Damage Bonus, skills en aanvallen als percentages (Regular/Hard/Extreme), pantser."
  });
  RS.get("coc").companion = COMP_COC;
  RS.get("cda").companion = Object.assign({}, COMP_COC, { focus: COMP_COC.focus + " Middeleeuws: geen vuurwapens; speer, bijl, zwaard, boog, schild en mail." });
  RS.get("ose").companion = {
    noHp: false, hp: [1, 100], ac: [-3, 19], meters: [], text: "",
    focus: "Old-School Essentials-monster of NPC: Hit Dice en HP, AC (gebruik de AC-conventie van de campagne: descending of ascending), attack bonus of THAC0, aantal aanvallen en schade, Saves (als een klasse en niveau), Morale (2-12), Movement, XP en een alignment; spells als memorized-lijst in de text."
  };
  RS.get("avatar").companion = {
    noHp: true, hp: null, ac: null,
    meters: [MT("fatigue", "Fatigue", [3, 6], "long", { zero: true })],
    focus: "Avatar Legends-NPC (geen HP of AC): stats (Creativity, Focus, Harmony, Passion), principles, training en technieken met mastery (learned, practiced, mastered), gevechtsstijl, zwakke plek en hoe ze reageren op Moves. Fatigue telt van 0 omhoog tot de max. Conditions (Afraid, Angry, Guilty, Insecure, Troubled) houd je bij in conditions."
  };
  RS.get("sw").companion = {
    noHp: true, hp: null, ac: null,
    meters: [MT("wounds", "Wounds", [5, 30], "none", { zero: true, required: true }), MT("strain", "Strain", [5, 30], "short", { zero: true })],
    focus: "Star Wars-NPC (geen HP of AC): type (Minion, Rival of Nemesis), characteristics, skills met ranks, Soak, Defense, Wound en Strain Threshold (de max van de meters), wapens (damage, crit, range), talents en Force Rating. Wounds en Strain tellen van 0 omhoog tot de threshold."
  };
  /* de DM-aanwijzing over companions komt bij de systeemregels */
  RS.get("avatar").guide += "\n- Companions hebben geen HP: houd hun Fatigue bij in companions.<id>.resources.fatigue ({cur, max}) en hun Conditions in companions.<id>.conditions.";
  RS.get("sw").guide += "\n- Companions hebben geen HP: houd hun Wounds en Strain bij in companions.<id>.resources.wounds en .strain ({cur, max}: een teller van 0 omhoog tot de threshold).";
  ["dg", "coc", "cda"].forEach(id => { RS.get(id).guide += "\n- Companions: HP staat in hp, WP/MP/SAN/Luck in companions.<id>.resources ({cur, max}); SAN en Luck herstellen niet door rust."; });

  /* ---------------- Wands & Wizards (Harry Potter; 5e 2014) ---------------- */
  const WW_SLOTS = [[2], [3], [4, 2], [4, 3], [4, 3, 2], [4, 3, 3], [4, 3, 3, 1], [4, 3, 3, 2], [4, 3, 3, 3, 1], [4, 3, 3, 3, 2], [4, 3, 3, 3, 2, 1], [4, 3, 3, 3, 2, 1], [4, 3, 3, 3, 2, 1, 1], [4, 3, 3, 3, 2, 1, 1], [4, 3, 3, 3, 2, 1, 1, 1], [4, 3, 3, 3, 2, 1, 1, 1], [4, 3, 3, 3, 2, 1, 1, 1, 1], [4, 3, 3, 3, 3, 1, 1, 1, 1], [4, 3, 3, 3, 3, 2, 1, 1, 1], [4, 3, 3, 3, 3, 2, 2, 1, 1]];
  const WW_SP = { Willpower: [0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], Technique: [0, 3, 4, 5, 7, 8, 9, 10, 12, 13, 14, 15, 17, 18, 19, 20, 22, 23, 24, 25] };
  const wwLv = n => Math.max(1, Math.min(20, Math.floor(n) || 1));
  const wwMod = n => Math.floor((n - 10) / 2);
  const wwPb = L => { L = wwLv(L); return L <= 4 ? 2 : L <= 8 ? 3 : L <= 12 ? 4 : L <= 16 ? 5 : 6; };
  const WW_STYLES = { Willpower: { ability: "CHA", hd: 10, fixed: 6, saves: ["CON", "CHA"] }, Technique: { ability: "WIS", hd: 6, fixed: 4, saves: ["WIS", "INT"] }, Intellect: { ability: "INT", hd: 8, fixed: 5, saves: ["DEX", "INT"] } };
  const WS = (label, stat) => ({ k: label, label, base: 0, stat, group: { STR: "Strength", DEX: "Dexterity", INT: "Intelligence", WIS: "Wisdom", CHA: "Charisma" }[stat] });
  const sgnS = n => (n >= 0 ? "+" : "−") + Math.abs(n);
  RS.register({
    id: "ww", label: "Wands & Wizards (5e 2014)", family: "d20", sys: "ww", name: "Wands & Wizards", role: "Game Master (HM)",
    terms: "Engelse Wands & Wizards-termen (5e 2014: Houses, Casting Styles, Schools of Magic, spell slots, Sorcery Points, Corruption)",
    dice: "Spelers rollen zelf een d20 (fysiek of met de dobbelknop in de app); hun worp staat in hun actie (\"[worp: ...]\"). Vraag een check via nextTurn.checks (naam → welke check, advantage of disadvantage en waarom); verklap DC's niet. Dit zijn de 5e 2014-regels, geen 2024.\n- Voor worpen van NPC's/vijanden gebruik je UITSLUITEND de meegegeven voorgegooide dobbelstenen, in volgorde (d20 voor aanvallen/checks/saves, d6/d8/d10/d12 voor schade). Noem de worp kort in de vertelling.",
    pcStats: '"hp":{"current":9,"max":9,"temp":0},"spellSlots":{"1":{"current":2,"max":2}},"sorceryPoints":0,"corruption":0,"concentration":null,"dedication":null,"resources":{},"conditions":[]',
    lootPower: "hoogstens één bijzonder magisch voorwerp met een verhaal per schooljaar, nooit als gewone buit en nooit een unieke plotzaak (Horcrux, Deathly Hallow)",
    rollEx: '{"who":"Troll","what":"Attack Roll","natural":14,"mod":5,"total":19,"result":"Hit"}; bij schade {"who","what":"Damage","dice":"2d6+4","total":11}',
    crit: "Een natural 20 op een attack raakt en verdubbelt de damage dice; een natural 1 mist. Gewone checks hebben geen automatische critical; verwerk een nat 20 of nat 1 als klein extra gevolg in de vertelling (huisregel).",
    playerRolls: 'Spelerworpen komen binnen als "[worp: Magical Theory: 12 +5 = 17]" (d20 + modifier + proficiency, dus het totaal) of "[worp: Stealth: disadvantage (16,7) +2 = 9]": het totaal is al uitgerekend met het karakterblad, reken niet opnieuw. Vraag je om een check, benoem dan de skill of save duidelijk (bv. "Magical Theory", "Dexterity Saving Throw") en noem advantage of disadvantage als die gelden.',
    passive: "zijn passieve score (10 + modifier + proficiency als hij proficient is)",
    preDice: [["d20", 20, 20], ["d12", 12, 6], ["d10", 10, 6], ["d8", 8, 8], ["d6", 6, 10], ["d4", 4, 6]],
    guide: "- SYSTEEMREGELS Wands & Wizards (Harry Potter): 5e 2014 met Houses, Casting Styles (Willpower, Technique, Intellect) en Schools of Magic; gebruik nooit stilzwijgend de 2024-regels. Een check is d20 + modifier + proficiency tegen een DC; advantage is de hoogste van 2d20, disadvantage de laagste, en ze heffen elkaar op. Een attack met natural 20 raakt en verdubbelt de schade; death saves volgens 2014, behalve bij niet-dodelijke spreuken.\n- Houd bij in de Stand: HP, spell slots per level (spellSlots), Sorcery Points, Corruption, concentration en dedication, en reactions. Concentration-save: CON, DC = max(10, helft van de schade). Controleer de Dark-tag en de resourcekosten van elke spreuk; gewone spreuken zijn niet dodelijk.\n- Ontbrekende mechanica (spellcatalogus, House-traits, feats, potions, apparition, Corruption-effecten) verzin je niet: vraag de speler het bronrecord aan te leveren of beslis met een vooraf aangekondigde ruling.\n- Laat onderzoek niet stranden op één worp en gebruik canonfiguren (Dumbledore e.a.) niet als automatische redding. Magie lost niet alles op; geen automatische magische loot.\n- Companions en NPC's: HP en AC in hp en ac; spell slots en Sorcery Points in companions.<id>.resources ({cur, max}, herstel bij long rest).",
    partyMeters: [["sorceryPoints", "SP"], ["corruption", "Corruption"]],
    companion: {
      noHp: false, hp: [4, 150], ac: [8, 22],
      meters: [MT("slots", "Spell slots", [1, 20], "long"), MT("sorcery", "Sorcery Points", [1, 25], "long")],
      focus: "Wands & Wizards-NPC (5e 2014): ability scores, HP, AC, speed, proficiency bonus, saves, skills, aanvallen en spreuken met schade (gebruik uitsluitend bekende spreuken; Dark-spreuken alleen met reden), en bijzondere eigenschappen. Geen D&D 2024-features."
    },
    sheet: {
      kind: "d20", note: "Wands & Wizards v1.4 (fanmateriaal, 5e 2014). House-traits, School-features, feats, achtergronden en de spellcatalogus staan niet in de app: noteer ze in de tekstvelden en laat ze controleren met je regelboek. Kies een Casting Style bij 'Casting Style' om saves, hit points, spell DC en spell attack te laten berekenen.",
      statLabels: { STR: "Strength", DEX: "Dexterity", CON: "Constitution", INT: "Intelligence", WIS: "Wisdom", CHA: "Charisma" }, stats: ["STR", "DEX", "CON", "INT", "WIS", "CHA"], statDefault: 10,
      statHint: "Standard array 15, 14, 13, 12, 10, 8 of 27 point buy (8–15, kosten 8:0, 9:1, 10:2, 11:3, 12:4, 13:5, 14:7, 15:9), plus de ability-verhogingen van je House. Normaal maximum 20.",
      d20: { mod: wwMod, pb: wwPb, styles: WW_STYLES },
      numbersTitle: "Level, AC en snelheid",
      numbers: [{ k: "level", label: "Level", def: 1 }, { k: "ac", label: "AC", def: 10 }, { k: "speed", label: "Speed (ft)", def: 30 }],
      skillsTitle: "Skills (0 = niet, 1 = proficient, 2 = expertise)",
      skills: [WS("Athletics", "STR"), WS("Acrobatics", "DEX"), WS("Sleight of Hand", "DEX"), WS("Stealth", "DEX"), WS("Herbology", "INT"), WS("Investigation", "INT"), WS("Magical Theory", "INT"), WS("Muggle Studies", "INT"),
        WS("Magical Creatures", "WIS"), WS("Insight", "WIS"), WS("Medicine", "WIS"), WS("Perception", "WIS"), WS("Potion-Making", "WIS"), WS("Survival", "WIS"), WS("Deception", "CHA"), WS("Intimidation", "CHA"), WS("Performance", "CHA"), WS("Persuasion", "CHA")],
      skillSpecs: "Extra skills of House-bonussen als regel: naam | rank 0-2 | ability (bv. Parseltongue | 1 | CHA).",
      meters: [{ k: "hp", label: "HP", max: v => { const st = WW_STYLES[v.PROFESSION] || { hd: 8, fixed: 5 }, L = wwLv(v.N.level), cm = wwMod(v.CON); return Math.max(1, st.hd + cm + (L - 1) * (st.fixed + cm)); } }],
      derived: [
        { k: "pb", label: "Proficiency", fn: v => "+" + wwPb(v.N.level) },
        { k: "dc", label: "Spell DC", fn: v => { const st = WW_STYLES[v.PROFESSION]; return st ? 8 + wwPb(v.N.level) + wwMod(v[st.ability]) : "—"; } },
        { k: "satk", label: "Spell attack", fn: v => { const st = WW_STYLES[v.PROFESSION]; return st ? sgnS(wwPb(v.N.level) + wwMod(v[st.ability])) : "—"; } },
        { k: "slots", label: "Spell slots", fn: v => WW_SLOTS[wwLv(v.N.level) - 1].map((n, i) => (i + 1) + ":" + n).join(" ") },
        { k: "sp", label: "Sorcery Points", fn: v => { const t = WW_SP[v.PROFESSION]; return t ? t[wwLv(v.N.level) - 1] : "—"; } }
      ],
      lists: [], professions: ["Willpower", "Technique", "Intellect"], professionLabel: "Casting Style", noAge: true,
      extraText: [["house", "House en school"], ["magicschool", "School of Magic"], ["wand", "Wand en achtergrond"], ["feats", "Feat en House-traits"], ["spells", "Spells en bekende spreuken"]]
    }
  });
})(typeof self !== "undefined" ? self : this);
