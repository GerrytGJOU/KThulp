/* Regelsets op basis van d100: Delta Green (dg), Call of Cthulhu 7e (coc) en Cthulhu Dark Ages (cda).
   Bron: de regeldossiers (dnd/tools/PROMPT_REGELSET_BRONMATERIAAL.md); wat daar [ONTBREEKT]/[ONZEKER] was, staat hier als vrij invulveld.
   Elke regelset heeft promptfragmenten (zoals dnd2024) plus een bladschema "sheet" waarmee dnd/gensheet.js een personagenblad tekent. */
(function (root) {
  "use strict";
  const RS = typeof module === "object" && module.exports ? require("./settings-rulesets.js") : root.DNDRulesets;
  const W = (s, n) => String(s).split(/\n/).filter(Boolean).map(l => { const p = l.split("|"); return { k: p[0].trim(), label: p[0].trim(), base: /^\d+$/.test((p[1] || "0").trim()) ? Number(p[1]) : (p[1] || "0").trim() }; });
  const cur = (n, m) => '{"current":' + n + ',"max":' + (m == null ? n : m) + '}';

  /* ---------------- Delta Green ---------------- */
  const DG_SKILLS = W("Accounting|10\nAlertness|20\nAnthropology|0\nArcheology|0\nArt|0\nArtillery|0\nAthletics|30\nBureaucracy|10\nComputer Science|0\nCraft|0\nCriminology|10\nDemolitions|0\nDisguise|10\nDodge|30\nDrive|20\nFirearms|20\nFirst Aid|10\nForeign Language|0\nForensics|0\nHeavy Machinery|10\nHeavy Weapons|0\nHistory|10\nHUMINT|10\nLaw|0\nMedicine|0\nMelee Weapons|30\nMilitary Science|0\nNavigate|10\nOccult|10\nPersuade|20\nPharmacy|0\nPilot|0\nPsychotherapy|10\nRide|10\nScience|0\nSearch|20\nSIGINT|0\nStealth|10\nSurgery|0\nSurvival|10\nSwim|20\nUnarmed Combat|40\nUnnatural|0");
  const dgDmgMod = s => s <= 4 ? -2 : s <= 8 ? -1 : s <= 12 ? 0 : s <= 16 ? 1 : 2;
  RS.register({
    id: "dg", label: "Delta Green", family: "d100", sys: "dg", name: "Delta Green", role: "Handler (spelleider)",
    terms: "Engelse Delta Green-termen (Skills, Bonds, SAN, WP, Breaking Point, Handler, Unnatural)",
    dice: "Spelers rollen zelf (fysiek of met de dobbelknop in de app); hun worp staat in hun actie (\"[worp: ...]\"). Vraag een check via nextTurn.checks (naam → welke skill of stat×5, een eventuele modifier en waarom); rol alleen bij betekenisvol risico en verklap geen modifiers die de speler niet kent.\n- Voor worpen van NPC's/vijanden gebruik je UITSLUITEND de meegegeven voorgegooide dobbelstenen, in volgorde (d100 voor skills en aanvallen, d10/d8/d6/d4 voor schade). Noem de worp kort in de vertelling.",
    pcStats: '"hp":' + cur(12) + ',"wp":' + cur(12) + ',"san":' + cur(60, 99) + ',"breakingPoint":48,"bonds":{"Partner":10},"resources":{},"conditions":[]',
    lootPower: "hoogstens één Unnatural voorwerp per operatie, nooit als beloning maar als gevaarlijke vondst met een prijs en een geheim, tot +20 op één skill",
    rollEx: '{"who":"Cultist 1","what":"Firearms","natural":34,"mod":0,"total":34,"target":50,"result":"Success"}; bij schade {"who","what":"Damage","dice":"1d10","total":6}',
    crit: "Verwerk een Critical Success (01 of een geslaagde double) of een Fumble (100 of een mislukte double) als klein extra gevolg in de vertelling.",
    playerRolls: 'Spelerworpen komen binnen als "[worp: Alertness: 34 vs 50 = Success]" (worp vs doel = uitkomst): de uitkomst is al bepaald met het karakterblad, reken niet opnieuw. Vraag je om een check, benoem dan de skill of stat×5 duidelijk (bv. "Alertness", "POW×5") en noem een eventuele modifier (±20 of ±40 procentpunten).',
    passive: "zijn skillwaarde uit het karakterblad (zonder worp: hoog = het lukt, laag = het lukt niet)",
    preDice: [["d100", 100, 20], ["d10", 10, 8], ["d8", 8, 6], ["d6", 6, 8], ["d4", 4, 6]],
    guide: "- SYSTEEMREGELS Delta Green: een worp is 1d100 ≤ skill (of stat×5); modifiers zijn doorgaans ±20 of ±40 procentpunten. 01 en geslaagde doubles zijn Critical Success, mislukte doubles en 100 Fumble. Rol alleen bij betekenisvol risico; gevolgen zijn hard, geen heldhaftige plot armor, geen D&D death saves.\n- Meld elk SAN-verlies (Violence, Helplessness of Unnatural, bv. 0/1d6) en houd Bonds, WP en Breaking Point bij in de Stand; bij 5 of meer SAN-verlies ineens volgt een tijdelijke insanity-check, bij het Breaking Point een nieuwe disorder (nieuw punt = huidige SAN − POW). Een PC mag SAN-verlies projecteren op een Bond (1d4, betaal WP en Bond-score).\n- Mislukte skill-checks worden aan het einde van de operatie door de speler gemarkeerd (+1d4 per gemarkeerde skill, niet Unnatural). Plan Home scenes tussen operaties.\n- Bewaar Unnatural-statblocks en geheime aanwijzingen achter het scherm (dmNotes).",
    partyMeters: [["hp", "HP"], ["wp", "WP"], ["san", "SAN"]],
    sheet: {
      note: "Delta Green (2016). De volledige professionpakketten staan niet in de app: vul je skills in volgens je Agent's Handbook of de afspraak met je Handler.",
      statLabels: { STR: "Strength", CON: "Constitution", DEX: "Dexterity", INT: "Intelligence", POW: "Power", CHA: "Charisma" },
      stats: ["STR", "CON", "DEX", "INT", "POW", "CHA"], statDice: { STR: "3d6", CON: "3d6", DEX: "3d6", INT: "3d6", POW: "3d6", CHA: "3d6" }, statMult: 5, statHint: "3d6 per stat (of 72 punten verdeeld), elk 3–18; stat×5 is je doel op een stat-check.",
      skills: DG_SKILLS, skillSpecs: "Art, Craft, Science, Foreign Language, Pilot en Military Science hebben specialisaties: zet die als extra skill (bv. Science (Biology) | 40).",
      meters: [
        { k: "hp", label: "HP", max: v => Math.ceil((v.STR + v.CON) / 2) },
        { k: "wp", label: "WP", max: v => v.POW },
        { k: "san", label: "SAN", max: v => Math.max(0, 99 - (v.UNNATURAL || 0)), start: v => v.POW * 5 }
      ],
      derived: [
        { k: "bp", label: "Breaking Point", fn: v => v.POW * 5 - v.POW }, /* start: SAN − POW */
        { k: "dmg", label: "Damage Modifier", fn: v => String(dgDmgMod(v.STR)).replace(/^(\d)/, "+$1") }
      ],
      lists: [{ k: "bonds", label: "Bonds", hint: "Eén per regel: naam | score (start = CHA, of per profession)", startScore: v => v.CHA }],
      professions: ["Anthropologist/Historian", "Computer Scientist/Engineer", "Federal Agent", "Physician", "Scientist", "Special Operator"],
      professionLabel: "Profession", extraText: [["motivation", "Motivatie & werkgever"]],
      budget: (c, base) => "Boven basis: " + base + " skillpunten (profession-pakket + 8 bonusvaardigheden van +20, elk max 80 bij creatie)."
    }
  });

  /* ---------------- Call of Cthulhu 7e ---------------- */
  const COC_SKILLS = W("Accounting|5\nAnthropology|1\nAppraise|5\nArchaeology|1\nCharm|15\nClimb|20\nCredit Rating|0\nCthulhu Mythos|0\nDisguise|5\nDodge|DEX/2\nDrive Auto|20\nElectrical Repair|10\nFast Talk|5\nFighting (Brawl)|25\nFirearms (Handgun)|20\nFirearms (Rifle/Shotgun)|25\nFirst Aid|30\nHistory|5\nIntimidate|15\nJump|20\nLanguage (Other)|1\nLanguage (Own)|EDU\nLibrary Use|20\nListen|20\nLocksmith|1\nMechanical Repair|10\nMedicine|1\nNatural World|10\nNavigate|10\nOccult|5\nOperate Heavy Machinery|1\nPersuade|10\nPsychoanalysis|1\nPsychology|10\nRide|5\nSleight of Hand|10\nSpot Hidden|25\nStealth|20\nSwim|20\nThrow|20\nTrack|10");
  function cocBuild(s) { /* Build en Damage Bonus op STR+SIZ */
    const n = s; if (n <= 64) return ["-2", "-2"]; if (n <= 84) return ["-1", "-1"]; if (n <= 124) return ["0", "0"]; if (n <= 164) return ["1", "+1d4"]; if (n <= 204) return ["2", "+1d6"];
    if (n <= 284) return ["3", "+2d6"]; if (n <= 364) return ["4", "+3d6"]; if (n <= 444) return ["5", "+4d6"]; return ["6", "+5d6"];
  }
  const cocSheet = {
    statLabels: { STR: "Strength", CON: "Constitution", SIZ: "Size", DEX: "Dexterity", APP: "Appearance", INT: "Intelligence", POW: "Power", EDU: "Education" },
    stats: ["STR", "CON", "SIZ", "DEX", "APP", "INT", "POW", "EDU"],
    statDice: { STR: "3d6", CON: "3d6", SIZ: "2d6+6", DEX: "3d6", APP: "3d6", INT: "2d6+6", POW: "3d6", EDU: "2d6+6" }, statMult: 1, statGenMult: 5,
    statHint: "Je kenmerken zijn percentages: STR/CON/DEX/APP/POW = 3d6×5, SIZ/INT/EDU = (2d6+6)×5. Een kenmerk-check rolt tegen de volle waarde.",
    skills: COC_SKILLS, skillSpecs: "Art/Craft, Science, Pilot en Survival hebben specialisaties; Language (Other) per taal: zet die als extra skill (bv. Science (Pharmacy) | 1).",
    meters: [
      { k: "hp", label: "HP", max: v => Math.floor((v.CON + v.SIZ) / 10) },
      { k: "mp", label: "MP", max: v => Math.floor(v.POW / 5) },
      { k: "san", label: "SAN", max: v => Math.max(0, 99 - (v.MYTHOS || 0)), start: v => v.POW },
      { k: "luck", label: "Luck", max: () => 99, start: () => 50, rolled: "3d6" }
    ],
    derived: [
      { k: "build", label: "Build", fn: v => cocBuild(v.STR + v.SIZ)[0] },
      { k: "db", label: "Damage Bonus", fn: v => cocBuild(v.STR + v.SIZ)[1] },
      { k: "mov", label: "MOV", fn: v => (v.STR < v.SIZ && v.DEX < v.SIZ) ? 7 : (v.STR > v.SIZ && v.DEX > v.SIZ) ? 9 : 8 }
    ],
    lists: [], professionLabel: "Occupation", extraText: [["ideology", "Ideology / Beliefs, Significant People, Meaningful Locations, Treasured Possessions, Traits"]],
    budget: (c, base, v) => "Boven basis: " + base + " punten. Beschikbaar: beroep meestal EDU×4 = " + (v.EDU * 4) + " (soms EDU×2 + een andere stat×2), persoonlijk INT×2 = " + (v.INT * 2) + "."
  };
  const cocShared = {
    dice: "Spelers rollen zelf (fysiek of met de dobbelknop in de app); hun worp staat in hun actie (\"[worp: ...]\"). Vraag een check via nextTurn.checks (naam → welke skill of welk kenmerk, bonus- of penaltydobbelstenen en waarom); rol alleen als de uitkomst onzeker is en verklap geen moeilijkheidsniveau.\n- Voor worpen van NPC's/monsters gebruik je UITSLUITEND de meegegeven voorgegooide dobbelstenen, in volgorde (d100 voor skills en aanvallen, d10/d8/d6/d4 voor schade). Noem de worp kort in de vertelling.",
    pcStats: '"hp":' + cur(10) + ',"mp":' + cur(12) + ',"san":' + cur(60, 99) + ',"luck":' + cur(50, 99) + ',"sanAtDayStart":60,"resources":{},"conditions":[]',
    lootPower: "hoogstens één occult voorwerp (tome, relikwie of artefact) per scenario, nooit als beloning maar als gevaarlijke vondst met een prijs in SAN of Mythos-kennis",
    rollEx: '{"who":"Cultist 1","what":"Fighting (Brawl)","natural":34,"mod":0,"total":34,"target":55,"result":"Regular Success"}; bij schade {"who","what":"Damage","dice":"1d3+1","total":3}',
    crit: "Verwerk een Critical Success (01) of Fumble als extra gevolg in de vertelling; een Hard of Extreme Success geeft meer informatie of effect dan een gewoon succes.",
    playerRolls: 'Spelerworpen komen binnen als "[worp: Spot Hidden: 34 vs 55 = Regular Success]" (worp vs doel = uitkomstniveau: Fumble, Failure, Regular, Hard, Extreme of Critical Success; eventueel met bonus-/penalty-tientallen): de uitkomst is al bepaald met het karakterblad, reken niet opnieuw. Vraag je om een check, benoem dan de skill of het kenmerk duidelijk (bv. "Spot Hidden", "POW") en noem het gewenste niveau pas als de speler het weet.',
    passive: "zijn skillwaarde uit het karakterblad (zonder worp: hoog = het lukt, laag = het lukt niet)",
    preDice: [["d100", 100, 20], ["d10", 10, 8], ["d8", 8, 6], ["d6", 6, 8], ["d4", 4, 6]],
    partyMeters: [["hp", "HP"], ["mp", "MP"], ["san", "SAN"], ["luck", "Luck"]]
  };
  const cocGuide = "- SYSTEEMREGELS Call of Cthulhu: een worp is 1d100 ≤ skill: Regular Success; ≤ de helft: Hard; ≤ een vijfde: Extreme; 01 is Critical Success, 100 altijd Fumble (96–100 bij skill onder 50). Bonus-/penaltydobbelstenen: een extra tientallendobbelsteen, beste resp. slechtste telt. Een pushed roll na een mislukking mag alleen met een andere aanpak en een aangekondigd, groter risico, nooit bij gevecht of SAN.\n- Vraag alleen worpen als de uitkomst onzeker is; leg essentiële aanwijzingen niet uitsluitend achter één mislukte worp. Meld elk SAN-verlies (bv. 0/1d6) en houd het dagtotaal bij (sanAtDayStart): 5 of meer verlies ineens vraagt een INT-check voor Temporary Insanity, een vijfde van de SAN in één speldag geeft Indefinite Insanity.\n- Gevechten zijn gevaarlijk; geen D&D death saves. Een Major Wound (schade ≥ de helft van max HP in één klap) vraagt een CON-check tegen bewusteloosheid.";
  RS.register(Object.assign({}, cocShared, {
    id: "coc", label: "Call of Cthulhu 7e", family: "d100", sys: "coc", name: "Call of Cthulhu", role: "Keeper (spelleider)",
    terms: "Engelse Call of Cthulhu-termen (Investigators, Skills, SAN, MP, Luck, Keeper, Mythos)",
    guide: cocGuide + "\n- Laat de Investigators onderzoeken; mysteries onthullen zich door slimme vragen en bronnen, niet door één worp.",
    sheet: Object.assign({}, cocSheet, { note: "Call of Cthulhu 7e. De volledige beroepslijst en de leeftijdscorrecties staan niet in de app: kies je beroep en leeftijd volgens je Investigator Handbook.", professions: ["Antiquarian", "Author", "Doctor of Medicine", "Private Investigator", "Journalist", "Professor", "Police Detective"] })
  }));
  RS.register(Object.assign({}, cocShared, {
    id: "cda", label: "Cthulhu Dark Ages 3e", family: "d100", sys: "coc", name: "Cthulhu Dark Ages", role: "Keeper (spelleider)",
    terms: "Engelse Cthulhu Dark Ages-termen (Investigators, Skills, SAN, MP, Luck, Keeper, Mythos)",
    guide: cocGuide + "\n- Dit is middeleeuws Engeland rond het jaar 1000: geen moderne kennis of uitrusting zonder settinggrond (geen vuurwapens, wel speer, bijl, zwaard, boog, schild en mail). Maak geloof en de lokale gemeenschap relevant en onderscheid volksgeloof van Mythos. Gebruik de basisregels; de optionele Dark Ages-modules (Folk Magic, aangepaste Sanity, mondelinge overlevering, mounted combat) alleen als de spelers die uitdrukkelijk zijn overeengekomen.",
    sheet: Object.assign({}, cocSheet, {
      note: "Cthulhu Dark Ages 3e op de basis van Call of Cthulhu 7e. De Dark Ages-specifieke skills, beroepen en uitrusting staan niet in de app: dit is een werklijst; vul aan met extra skills (bv. Fighting (Sword), Missile (Bow), Folk Magic) volgens je regelboek.",
      skills: COC_SKILLS.filter(s => !/^(Drive Auto|Electrical Repair|Firearms|Operate Heavy Machinery|Psychoanalysis|Language \(Own\)|Credit Rating)/.test(s.k)).concat(W("Language (Own)|EDU\nStatus|0")),
      professions: ["Monnik/non", "Krijger", "Genezer", "Ambachtsman", "Boer", "Koopman", "Priester"], professionLabel: "Beroep (concept)"
    })
  }));
})(typeof self !== "undefined" ? self : this);
