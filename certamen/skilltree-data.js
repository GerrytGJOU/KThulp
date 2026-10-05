/* ============================================================================
   SKILL-TREES PER KLASSE (pure data) — IN ONTWERP, NOG NIET ACTIEF
   ----------------------------------------------------------------------------
   Nog door geen enkele spelmodus ingeladen: certamen/index.html laadt dit
   bestand (bewust) niet. Alleen certamen/tools/skilltree-preview.html leest
   het, om de bomen te tekenen. Activeren gebeurt later door de beheerder,
   zodra alle acht klassen af zijn.

   Afgesproken kader (ontwerpgesprek 2026-10-05):
   - ★1–4: identiteitskeuzes, per ster één optie A of B.
       3–4× A → pad A · 3–4× B → pad B · 2/2 → hybride pad.
   - ★5: vast meesterpassief (BM_CLASSES.passive.masterVal), geen keuze.
   - ★6–9: padkeuzes, per ster optie a of b. Het hybride pad kiest per ster
       tussen optie a van pad A en optie a van pad B (de b-opties blijven
       voorbehouden aan wie een zuiver pad volgt).
   - ★10: keuze tussen twee varianten van de prestige-vaardigheid
       (vervangt de huidige tier:"prestige"-vaardigheid in BM_CLASSES).
   - De huidige vlakke ★3-bonus (+1 AP per ronde) vervalt zodra de bomen
       actief worden; alles volgt de docent-schakelaar masteryBonuses.
   - Respec: gratis, alleen tussen gevechten (profiel), nooit tijdens een partij.
   - Merkteken (Jager): per doel telt alleen het sterkste merkteken; het
       maximum is een totaal per ronde, geen percentage.
   - "Trefzekerheid" = % goede antwoorden in dít gevecht, min. 4 antwoorden.

   fx-velden zijn een eerste, machine-leesbare beschrijving voor de latere
   engine-koppeling (bmCalcAbilityEffect e.d.) — nog nergens uitgelezen.
   icon: bestandsnaam onder assets/skills/ (nog niet aanwezig → plaatshouder).
   iconSubject: onderwerp voor de beeldprompt (zie SKILLTREE_ICON_PROMPT).
   ============================================================================ */

// Gedeelde stijlopdracht voor alle iconen (pixel-art-tegel, zoals de
// pixel-avatars van Battle Mode). {SUBJECT} en {ACCENT} worden per knooppunt
// ingevuld door skilltree-preview.html.
const SKILLTREE_ICON_PROMPT =
  "Square 1:1 image of a pixel-art game skill icon, drawn as if at 64×64 pixel resolution and then enlarged " +
  "with hard square pixel edges (every pixel clearly visible as a block, no anti-aliasing, no smoothing). " +
  "Composition: one single centred symbol filling about 70% of the tile, seen straight from the front, " +
  "on a flat very dark warm-stone background (#16110c) with a one-pixel gold (#d4af37) border around the tile. " +
  "Subject: {SUBJECT}. " +
  "Colour palette: maximum 8 colours, dominated by {ACCENT}, with gold highlights and dark brown shadows. " +
  "Style: ancient Greek and Roman, 16-bit RPG skill icon, readable at 32×32. " +
  "Avoid: any letters, numbers or text, watermarks, signatures, photorealism, soft gradients, blur, " +
  "glow halos larger than 2 pixels, modern firearms, sci-fi elements, people's faces, more than one symbol, " +
  "drop shadows outside the tile, rounded tile corners.";

const BM_SKILLTREES = {
  boogschutter: {
    classId: "boogschutter",
    nm: "Boogschutter", color:"#2e6fb0", colorNm:"deep royal blue",
    paths: {
      A:   { nm:"Scherpschutter", accent:"#6db862", accentNm:"cool forest green", desc:"Eén doel, maximale precisie: door schild heen en afmaken." },
      H:   { nm:"Woudschutter",   accent:"#d4af37", accentNm:"warm gold",         desc:"Hybride: kiest per ster tussen het beste van beide paden." },
      B:   { nm:"Jager",          accent:"#d0703a", accentNm:"burnt bronze-red",  desc:"Markeert de prooi, zodat het hele team harder raakt." },
    },
    root: { nm:"Boogschutter", desc:"Passief: +1 schade bij elke aanval.", glyph:"➶",
            iconSubject:"a drawn ancient recurve bow with a nocked arrow pointing upward",
            icon:"boogschutter_root.png" },
    master: { star:5, nm:"Meester", desc:"Meesterpassief: +2 schade bij elke aanval (in plaats van +1).", glyph:"✦",
              iconSubject:"a golden laurel wreath around a single upright arrow",
              icon:"boogschutter_meester.png" },

    // ★1–4: per ster één A- en één B-optie
    identity: [
      { star:1,
        A:{ id:"vaste_hand", nm:"Vaste Hand", desc:"Aanvallen op één doel doen +1 schade.", glyph:"✋",
            fx:{ type:"single_target_dmg", val:1 },
            iconSubject:"a steady open hand holding a single straight arrow horizontally", icon:"boogschutter_vaste_hand.png" },
        B:{ id:"spoor_zetten", nm:"Spoor Zetten", desc:"Je aanval markeert het doel: elke aanval van een teamgenoot op dat doel doet deze ronde +1 (samen max. +2).", glyph:"⚑",
            fx:{ type:"mark", perHit:1, max:2 },
            iconSubject:"an arrow stuck in the ground next to a small red hunting pennant", icon:"boogschutter_spoor_zetten.png" } },
      { star:2,
        A:{ id:"koelbloedig", nm:"Koelbloedig", desc:"Bij trefzekerheid ≥80% in dit gevecht doen al je aanvallen +1.", glyph:"❄",
            fx:{ type:"accuracy_dmg", minAcc:0.80, val:1 },
            iconSubject:"a calm closed eye above a horizontal arrow, with a small frost crystal", icon:"boogschutter_koelbloedig.png" },
        B:{ id:"roedel", nm:"Roedel", desc:"Combo's kosten jou 3 AP in plaats van 4.", glyph:"⁂",
            fx:{ type:"combo_cost", val:-1 },
            iconSubject:"two wolf heads side by side in profile, facing each other", icon:"boogschutter_roedel.png" } },
      { star:3,
        A:{ id:"scherp_oog", nm:"Scherp Oog", desc:"De afmaakdrempel van Zwak Punt gaat van ≤30% naar ≤40% HP.", glyph:"◎",
            fx:{ type:"weakspot_threshold", val:0.40 },
            iconSubject:"a hawk's eye inside a round archery target", icon:"boogschutter_scherp_oog.png" },
        B:{ id:"drijfjacht", nm:"Drijfjacht", desc:"Pijlregen kost 2 AP in plaats van 3 en markeert alle doelen.", glyph:"⇶",
            fx:{ type:"ability_mod", ability:"pijlregen", cost:-1, marks:true },
            iconSubject:"three arrows falling diagonally in parallel from the top left", icon:"boogschutter_drijfjacht.png" } },
      { star:4,
        A:{ id:"pantserbreker", nm:"Pantserbreker", desc:"Gericht Schot haalt −4 vijandelijk schild weg in plaats van −2.", glyph:"⛨",
            fx:{ type:"ability_mod", ability:"gericht_schot", shldRemove:2 },
            iconSubject:"an arrow piercing straight through a cracked round bronze shield", icon:"boogschutter_pantserbreker.png" },
        B:{ id:"lokroep", nm:"Lokroep", desc:"Haalt je merkteken deze ronde het maximum, dan krijg je zelf +1 AP (binnen het rondeplafond van 4).", glyph:"♪",
            fx:{ type:"mark_full_self_be", val:1 },
            iconSubject:"a curved hunting horn made of animal horn with a leather strap", icon:"boogschutter_lokroep.png" } },
    ],

    // ★6–9: per pad een a- en b-optie. Het hybride pad kiest tussen A.a en B.a.
    pathNodes: {
      A: [
        { star:6,
          a:{ id:"zuivere_treffer", nm:"Zuivere Treffer", desc:"Doorborend Schot +2 schade.", glyph:"➹",
              fx:{ type:"ability_mod", ability:"doorborend", dmg:2 },
              iconSubject:"a single arrow passing cleanly through the exact centre of a target", icon:"boogschutter_zuivere_treffer.png" },
          b:{ id:"valkenblik", nm:"Valkenblik", desc:"Gericht Schot +2 schade.", glyph:"◈",
              fx:{ type:"ability_mod", ability:"gericht_schot", dmg:2 },
              iconSubject:"a falcon head in profile with a sharp focused eye", icon:"boogschutter_valkenblik.png" } },
        { star:7,
          a:{ id:"genadeloos", nm:"Genadeloos", desc:"De extra schade van Zwak Punt gaat van +10 naar +12.", glyph:"☠",
              fx:{ type:"ability_mod", ability:"zwakpunt", bonusDmg:2 },
              iconSubject:"an arrow striking a cracked spot on a bronze breastplate", icon:"boogschutter_genadeloos.png" },
          b:{ id:"laatste_pijl", nm:"Laatste Pijl", desc:"Heeft de vijand ≤15% HP, dan gaan al je aanvallen door schild heen.", glyph:"⌛",
              fx:{ type:"low_hp_bypass", threshold:0.15 },
              iconSubject:"one last arrow in an almost empty leather quiver", icon:"boogschutter_laatste_pijl.png" } },
        { star:8,
          a:{ id:"meesterschutter", nm:"Meesterschutter", desc:"Bij trefzekerheid ≥90% kost Dodenarrow 8 AP in plaats van 9.", glyph:"✪",
              fx:{ type:"accuracy_cost", minAcc:0.90, ability:"dodenarrow", cost:-1 },
              iconSubject:"a star-shaped gold medal with a bow engraved on it", icon:"boogschutter_meesterschutter.png" },
          b:{ id:"kalm_onder_vuur", nm:"Kalm onder Vuur", desc:"De drempel van Koelbloedig zakt naar 70%.", glyph:"☯",
              fx:{ type:"accuracy_threshold", node:"koelbloedig", minAcc:0.70 },
              iconSubject:"an archer's leather bracer with burning arrows flying past it", icon:"boogschutter_kalm_onder_vuur.png" } },
        { star:9,
          a:{ id:"doodsoordeel", nm:"Doodsoordeel", desc:"Dodenarrow gaat door schild heen.", glyph:"⚔",
              fx:{ type:"ability_mod", ability:"dodenarrow", bypass:true },
              iconSubject:"a black arrow with a bone-white arrowhead breaking through a shield", icon:"boogschutter_doodsoordeel.png" },
          b:{ id:"oog_van_apollo", nm:"Oog van Apollo", desc:"Dodenarrow +3 schade als de vijand ≤30% HP heeft.", glyph:"☀",
              fx:{ type:"ability_mod", ability:"dodenarrow", lowHpDmg:3, threshold:0.30 },
              iconSubject:"a radiant golden sun disc with an arrow through its centre", icon:"boogschutter_oog_van_apollo.png" } },
      ],
      B: [
        { star:6,
          a:{ id:"grote_prooi", nm:"Grote Prooi", desc:"Het maximum van je merkteken gaat van +2 naar +3.", glyph:"Ψ",
              fx:{ type:"mark_max", val:3 },
              iconSubject:"a large stag with wide antlers, seen from the front", icon:"boogschutter_grote_prooi.png" },
          b:{ id:"vers_spoor", nm:"Vers Spoor", desc:"Je merkteken werkt ook de volgende ronde nog (max. +2).", glyph:"∴",
              fx:{ type:"mark_linger", rounds:1, max:2 },
              iconSubject:"fresh deer hoof prints in mud leading upward", icon:"boogschutter_vers_spoor.png" } },
        { star:7,
          a:{ id:"roedelleider", nm:"Roedelleider", desc:"Combo's waar jij in zit krijgen +2 op hun hoofdeffect (schade, schild of heling).", glyph:"♛",
              fx:{ type:"combo_main", val:2 },
              iconSubject:"a howling wolf head with a small gold crown above it", icon:"boogschutter_roedelleider.png" },
          b:{ id:"opjagen", nm:"Opjagen", desc:"Een gemarkeerd doel verliest 2 schild.", glyph:"⚡",
              fx:{ type:"mark_shld_remove", val:2 },
              iconSubject:"a fleeing boar with a broken wooden shield behind it", icon:"boogschutter_opjagen.png" } },
        { star:8,
          a:{ id:"stille_jacht", nm:"Stille Jacht", desc:"Gericht Schot kost 2 AP in plaats van 3.", glyph:"☾",
              fx:{ type:"ability_mod", ability:"gericht_schot", cost:-1 },
              iconSubject:"a crescent moon above a bow drawn in silhouette", icon:"boogschutter_stille_jacht.png" },
          b:{ id:"jachthoorn", nm:"Jachthoorn", desc:"Haalt je merkteken het maximum, dan krijgt ook de teamgenoot met de minste AP +1 AP (binnen het team-AP-plafond).", glyph:"♫",
              fx:{ type:"mark_full_team_be", val:1 },
              iconSubject:"a large brass hunting horn blowing visible sound waves", icon:"boogschutter_jachthoorn.png" } },
        { star:9,
          a:{ id:"artemis_gunst", nm:"Artemis' Gunst", desc:"Dodenarrow markeert met een maximum van +6.", glyph:"☽",
              fx:{ type:"ability_mod", ability:"dodenarrow", marks:true, markMax:6 },
              iconSubject:"a silver crescent moon with a silver arrow resting across it", icon:"boogschutter_artemis_gunst.png" },
          b:{ id:"jachtpartij", nm:"Jachtpartij", desc:"Raakten ≥3 teamgenoten je gemarkeerde doel, dan doet je volgende aanval +2.", glyph:"⚜",
              fx:{ type:"mark_followup_dmg", minHits:3, val:2 },
              iconSubject:"three arrows converging on one point from three directions", icon:"boogschutter_jachtpartij.png" } },
      ],
    },

    // ★10: twee varianten van de prestige-vaardigheid, open voor elk pad.
    prestige: [
      { id:"pijl_van_apollo", nm:"Pijl van Apollo", cost:13, path:"A",
        desc:"Eén schot op één doel: +22, door schild heen; +6 extra als het doel ≤30% HP heeft.", glyph:"☀",
        fx:{ type:"attack_bypass", dmg:22, lowHpDmg:6, threshold:0.30 },
        iconSubject:"one huge golden arrow of light shot from a radiant sun", icon:"boogschutter_pijl_van_apollo.png" },
      { id:"pijlen_van_artemis", nm:"Pijlen van Artemis", cost:13, path:"B",
        desc:"Op alle doelen +11, door schild heen; markeert alle doelen (max. +6 per doel).", glyph:"☽",
        fx:{ type:"attack_bypass", dmg:11, aoe:true, marks:true, markMax:6 },
        iconSubject:"a rain of silver arrows falling from a crescent moon", icon:"boogschutter_pijlen_van_artemis.png" },
    ],
  },

  // ---- HOPLIET: Falanx (het team groot beschermen, nú) vs Voorhoede (verdedigen om terug te slaan) ----
  // Blijvend schild hoort bewust NIET bij de Falanx maar bij de Vestingbouwer (Genie).
  hopliet: {
    classId: "hopliet",
    nm: "Hopliet", color:"#c8392a", colorNm:"deep crimson red",
    paths: {
      A: { nm:"Falanx",      accent:"#7fa7c9", accentNm:"cool polished steel blue", desc:"De muur van het team: schild dat groeit als de linie samen staat." },
      H: { nm:"Schildwacht", accent:"#d4af37", accentNm:"warm gold",                desc:"Hybride: beschermt én slaat terug, beide met mate." },
      B: { nm:"Voorhoede",   accent:"#d0503a", accentNm:"blood red and bronze",     desc:"Verdedigen is het wapen: elke ronde achter het schild maakt de volgende stoot harder." },
    },
    root: { nm:"Hopliet", desc:"Passief: +1 AP bij een schildactie (Verdedigen).", glyph:"⛨",
            iconSubject:"a round bronze hoplite shield (aspis) with a Greek lambda painted on it",
            icon:"hopliet_root.png" },
    master: { star:5, nm:"Meester", desc:"Meesterpassief: +2 AP bij een schildactie (in plaats van +1).", glyph:"✦",
              iconSubject:"a golden laurel wreath around a round bronze shield",
              icon:"hopliet_meester.png" },

    identity: [
      { star:1,
        A:{ id:"schildenrij", nm:"Schildenrij", desc:"Je schildacties geven +1 schild per teamgenoot die deze ronde ook een schildactie kiest (max. +2).", glyph:"☷",
            fx:{ type:"shield_per_ally_shield", perAlly:1, max:2 },
            iconSubject:"a row of three overlapping round bronze shields seen from the front", icon:"hopliet_schildenrij.png" },
        B:{ id:"tegenstoot", nm:"Tegenstoot", desc:"Na een ronde met een schildactie (van jou, of van een teamgenoot) doet je volgende aanval +3.", glyph:"↯",
            fx:{ type:"attack_after_shield", val:3 },
            iconSubject:"a spear thrusting out from behind a raised round shield", icon:"hopliet_tegenstoot.png" } },
      { star:2,
        A:{ id:"gesloten_linie", nm:"Gesloten Linie", desc:"Na ≥3 goede antwoorden op rij doen je schildacties +3 schild. Eén fout breekt de reeks.", glyph:"▦",
            fx:{ type:"streak_shield", minStreak:3, val:3 },
            iconSubject:"a closed wall of interlocking bronze shields with spear tips above it", icon:"hopliet_gesloten_linie.png" },
        B:{ id:"bronzen_rand", nm:"Bronzen Rand", desc:"Schildslag +3 schade (4 → 7).", glyph:"◐",
            fx:{ type:"ability_mod", ability:"schildslag", dmg:3 },
            iconSubject:"the bronze rim of a shield striking forward with short motion lines", icon:"hopliet_bronzen_rand.png" } },
      { star:3,
        A:{ id:"gedrilde_rijen", nm:"Gedrilde Rijen", desc:"Linie Sluiten kost 4 AP in plaats van 5, en ook Dekking zoeken en Schild heffen van teamgenoten tellen mee voor Schildenrij.", glyph:"⁞",
            fx:{ type:"shield_per_ally_counts_basic", val:true, ability:"linie_sluiten", cost:-1 },
            iconSubject:"three rows of small soldier silhouettes standing in perfect formation", icon:"hopliet_gedrilde_rijen.png" },
        B:{ id:"wraak_van_de_linie", nm:"Wraak van de Linie", desc:"Ving het schild van je team vorige ronde ≥5 schade op, dan doet je volgende aanval +2.", glyph:"⚔",
            fx:{ type:"attack_after_blocked", minBlocked:5, val:2 },
            iconSubject:"a dented bronze shield with a sword crossed behind it", icon:"hopliet_wraak_van_de_linie.png" } },
      { star:4,
        A:{ id:"eed_van_de_falanx", nm:"Eed van de Falanx", desc:"Formatie geeft je team naast +2 AP ook +3 schild.", glyph:"✋",
            fx:{ type:"ability_mod", ability:"formatie", shld:3 },
            iconSubject:"raised hands of soldiers swearing an oath above a round shield", icon:"hopliet_eed_van_de_falanx.png" },
        B:{ id:"dromos", nm:"Dromos", desc:"Achilleshiel kost 8 AP in plaats van 9 (de looppas van Marathon).", glyph:"»",
            fx:{ type:"ability_mod", ability:"achilleshiel", cost:-1 },
            iconSubject:"a running hoplite's bronze greave and sandal in mid-stride", icon:"hopliet_dromos.png" } },
    ],

    pathNodes: {
      A: [
        { star:6,
          a:{ id:"bronzen_muur", nm:"Bronzen Muur", desc:"Schildmuur +2 schild (4 → 6).", glyph:"▣",
              fx:{ type:"ability_mod", ability:"schildmuur", shld:2 },
              iconSubject:"a solid wall of bronze shields seen straight from the front", icon:"hopliet_bronzen_muur.png" },
          b:{ id:"hoplon", nm:"Hoplon", desc:"Het maximum van Schildenrij gaat van +2 naar +4.", glyph:"◎",
              fx:{ type:"shield_per_ally_max", max:4 },
              iconSubject:"a large concave hoplon shield with the arm strap visible on the inside", icon:"hopliet_hoplon.png" } },
        { star:7,
          a:{ id:"taai_als_brons", nm:"Taai als Brons", desc:"Eén fout breekt Gesloten Linie niet meer; pas twee fouten op rij.", glyph:"⛓",
              fx:{ type:"streak_forgive", wrongAllowed:1, node:"gesloten_linie" },
              iconSubject:"a bronze shield with a crack held together by iron rivets", icon:"hopliet_taai_als_brons.png" },
          b:{ id:"linie_vast", nm:"Linie Vast", desc:"Linie Sluiten +2 schild (7 → 9).", glyph:"═",
              fx:{ type:"ability_mod", ability:"linie_sluiten", shld:2 },
              iconSubject:"two long rows of shields locking together like a closing gate", icon:"hopliet_linie_vast.png" } },
        { star:8,
          a:{ id:"snelle_formatie", nm:"Snelle Formatie", desc:"Formatie kost 4 AP in plaats van 5.", glyph:"⇉",
              fx:{ type:"ability_mod", ability:"formatie", cost:-1 },
              iconSubject:"a long ancient Greek war trumpet (salpinx) sounding above a line of shields", icon:"hopliet_snelle_formatie.png" },
          b:{ id:"laatste_bolwerk", nm:"Laatste Bolwerk", desc:"Staat je eigen leger op ≤30% HP, dan doen je schildacties +3 schild.", glyph:"♜",
              fx:{ type:"low_own_hp_shield", threshold:0.30, val:3 },
              iconSubject:"a single shield standing upright amid a ruined stone wall", icon:"hopliet_laatste_bolwerk.png" } },
        { star:9,
          a:{ id:"gouden_linie", nm:"Gouden Linie", desc:"De bonus van Gesloten Linie gaat van +3 naar +4 schild.", glyph:"✶",
              fx:{ type:"streak_shield_val", val:4, node:"gesloten_linie" },
              iconSubject:"a line of shields with golden light shining along their rims", icon:"hopliet_gouden_linie.png" },
          b:{ id:"geest_van_de_300", nm:"Geest van de 300", desc:"Ving het schild van je team deze ronde álle vijandelijke schade op, dan krijg je +2 AP (binnen het rondeplafond).", glyph:"Λ",
              fx:{ type:"full_block_self_be", val:2 },
              iconSubject:"a Spartan lambda symbol on a shield standing in a narrow mountain pass", icon:"hopliet_geest_van_de_300.png" } },
      ],
      B: [
        { star:6,
          a:{ id:"scherpe_rand", nm:"Scherpe Rand", desc:"De bonus van Tegenstoot gaat van +3 naar +4.", glyph:"⟋",
              fx:{ type:"attack_after_shield_val", val:4, node:"tegenstoot" },
              iconSubject:"a sharpened bronze shield rim gleaming along its edge", icon:"hopliet_scherpe_rand.png" },
          b:{ id:"schild_als_wapen", nm:"Schild als Wapen", desc:"Schildslag haalt ook −2 vijandelijk schild weg.", glyph:"⊘",
              fx:{ type:"ability_mod", ability:"schildslag", shldRemove:2 },
              iconSubject:"one round shield smashing into another round shield, which cracks", icon:"hopliet_schild_als_wapen.png" } },
        { star:7,
          a:{ id:"pantser_en_speer", nm:"Pantser en Speer", desc:"Linie Sluiten doet ook een aanval van +3.", glyph:"⟟",
              fx:{ type:"ability_mod", ability:"linie_sluiten", dmg:3 },
              iconSubject:"a spear held upright behind a shield, both angled forward", icon:"hopliet_pantser_en_speer.png" },
          b:{ id:"bloed_op_het_brons", nm:"Bloed op het Brons", desc:"De drempel van Wraak van de Linie zakt van 5 naar 3 opgevangen schade.", glyph:"◈",
              fx:{ type:"attack_after_blocked_min", minBlocked:3, node:"wraak_van_de_linie" },
              iconSubject:"a bronze shield with dark red stains on its surface", icon:"hopliet_bloed_op_het_brons.png" } },
        { star:8,
          a:{ id:"opmars", nm:"Opmars", desc:"Na een ronde met een aanval doet je volgende schildactie +2 schild (het ritme werkt nu ook andersom).", glyph:"⇄",
              fx:{ type:"shield_after_attack", val:2 },
              iconSubject:"two curved arrows forming a circle around a shield and a spear", icon:"hopliet_opmars.png" },
          b:{ id:"breekijzer", nm:"Breekijzer", desc:"Achilleshiel haalt ook −4 vijandelijk schild weg (voor je teamgenoten).", glyph:"⚒",
              fx:{ type:"ability_mod", ability:"achilleshiel", shldRemove:4 },
              iconSubject:"a spear point punching a hole through a bronze plate", icon:"hopliet_breekijzer.png" } },
        { star:9,
          a:{ id:"held_van_marathon", nm:"Held van Marathon", desc:"Achilleshiel +2 schade na een ronde met een schildactie.", glyph:"♞",
              fx:{ type:"ability_mod", ability:"achilleshiel", afterShieldDmg:2 },
              iconSubject:"a crested Greek bronze helmet above a laurel branch", icon:"hopliet_held_van_marathon.png" },
          b:{ id:"onstuitbaar", nm:"Onstuitbaar", desc:"Tegenstoot geldt voor je volgende twee aanvallen in plaats van één.", glyph:"⇶",
              fx:{ type:"attack_after_shield_charges", charges:2, node:"tegenstoot" },
              iconSubject:"a charging hoplite shield with two spear tips bursting out from behind it", icon:"hopliet_onstuitbaar.png" } },
      ],
    },

    prestige: [
      { id:"thermopylae", nm:"Thermopylae", cost:13, path:"A",
        desc:"Onbreekbare falanx: schild +20 voor je team, plus +1 per teamgenoot die deze ronde ook een schildactie kiest (max. +4).", glyph:"Λ",
        fx:{ type:"team_shield", shld:20, perAllyShield:1, perAllyMax:4 },
        iconSubject:"a narrow mountain pass blocked by a wall of shields painted with a lambda", icon:"hopliet_thermopylae.png" },
      { id:"marathon", nm:"Marathon", cost:13, path:"B",
        desc:"Stormloop vanachter het schild: aanval +16 die schild omzeilt, én schild +8 voor je team.", glyph:"♞",
        fx:{ type:"attack_and_defend", dmg:16, bypass:true, shld:8 },
        iconSubject:"a line of hoplites running forward with lowered spears on a plain beside the sea", icon:"hopliet_marathon.png" },
    ],
  },

  // ---- VOORVECHTER: Aristeia (opbouwende razernij: aanval na aanval) vs Bloedroof (schade wordt heling) ----
  // Afmaken hoort bij de Scherpschutter, niet hier. "Menos" = de Homerische strijdkracht
  // die een held in zijn aristeia vervult; opgebouwd door rondes achter elkaar aan te vallen.
  spartaan: {
    classId: "spartaan",
    nm: "Voorvechter", color:"#8B1A1A", colorNm:"dark blood red",
    paths: {
      A: { nm:"Aristeia",  accent:"#e8853a", accentNm:"fiery orange",       desc:"Opbouwende razernij: elke ronde waarin je aanvalt, wordt de volgende klap harder." },
      H: { nm:"Myrmidoon", accent:"#d4af37", accentNm:"warm gold",          desc:"Hybride: bouwt op én heelt mee, beide met mate." },
      B: { nm:"Bloedroof", accent:"#b8405a", accentNm:"dark wine red",      desc:"Vechten om overeind te blijven: elke klap geeft het leger iets terug." },
    },
    root: { nm:"Voorvechter", desc:"Passief: +20% aanvalsschade.", glyph:"⚔",
            iconSubject:"a crested Corinthian bronze helmet with a red horsehair crest, seen from the side",
            icon:"spartaan_root.png" },
    master: { star:5, nm:"Meester", desc:"Meesterpassief: +30% aanvalsschade (in plaats van +20%).", glyph:"✦",
              iconSubject:"a golden laurel wreath around a Corinthian helmet",
              icon:"spartaan_meester.png" },

    identity: [
      { star:1,
        A:{ id:"menos", nm:"Menos", desc:"Elke ronde achter elkaar waarin je aanvalt geeft je volgende aanval +1 (max. +2). Een ronde zonder aanval zet het terug op 0.", glyph:"♨",
            fx:{ type:"attack_streak_dmg", perRound:1, max:2 },
            iconSubject:"a flame rising from the top of a bronze helmet", icon:"spartaan_menos.png" },
        B:{ id:"levensroof", nm:"Levensroof", desc:"Elke aanval die je doet heelt je leger ook +1.", glyph:"♥",
            fx:{ type:"attack_heal", val:1 },
            iconSubject:"a sword blade with a red heart-shaped drop at its tip", icon:"spartaan_levensroof.png" } },
      { star:2,
        A:{ id:"razernij", nm:"Razernij", desc:"Berserk kost 4 AP in plaats van 5.", glyph:"✺",
            fx:{ type:"ability_mod", ability:"berserk", cost:-1 },
            iconSubject:"two crossed short swords surrounded by jagged red rage lines", icon:"spartaan_razernij.png" },
        B:{ id:"bloedeed", nm:"Bloedeed", desc:"Bloedroof heelt +2 meer (5 → 7).", glyph:"✚",
            fx:{ type:"ability_mod", ability:"bloedroof", heal:2 },
            iconSubject:"a hand gripping a sword blade with a drop of blood falling into a bowl", icon:"spartaan_bloedeed.png" } },
      { star:3,
        A:{ id:"ontketend", nm:"Ontketend", desc:"Staat Menos op het maximum, dan doen Berserk en Leeuwensprong +2.", glyph:"⛓",
            fx:{ type:"attack_streak_full_bonus", abilities:["berserk","leeuwensprong"], val:2 },
            iconSubject:"a broken iron chain falling apart around a clenched fist", icon:"spartaan_ontketend.png" },
        B:{ id:"krijgersbloed", nm:"Krijgersbloed", desc:"Speerstoot heelt je leger ook +2.", glyph:"↟",
            fx:{ type:"ability_mod", ability:"speer", heal:2 },
            iconSubject:"a spear point with a small red drop glowing on it", icon:"spartaan_krijgersbloed.png" } },
      { star:4,
        A:{ id:"achilles_toorn", nm:"Achilles' Toorn", desc:"Leeuwensprong kost 9 AP in plaats van 10.", glyph:"⚡",
            fx:{ type:"ability_mod", ability:"leeuwensprong", cost:-1 },
            iconSubject:"a furious lion's head with a bronze helmet crest behind it", icon:"spartaan_achilles_toorn.png" },
        B:{ id:"met_je_schild", nm:"Met je Schild of erop", desc:"Staat je leger er (in %) slechter voor dan de vijand, dan helen je aanvallen +1 extra.", glyph:"⛨",
            fx:{ type:"attack_heal_when_behind", val:1 },
            iconSubject:"a round shield lying flat with a spear resting across it", icon:"spartaan_met_je_schild.png" } },
    ],

    pathNodes: {
      A: [
        { star:6,
          a:{ id:"heldenmoed", nm:"Heldenmoed", desc:"Het maximum van Menos gaat van +2 naar +3.", glyph:"♨",
              fx:{ type:"attack_streak_max", max:3, node:"menos" },
              iconSubject:"a tall flame shaped like a warrior's crest", icon:"spartaan_heldenmoed.png" },
          b:{ id:"snelle_woede", nm:"Snelle Woede", desc:"Menos groeit +2 per ronde in plaats van +1.", glyph:"⏫",
              fx:{ type:"attack_streak_step", perRound:2, node:"menos" },
              iconSubject:"two upward arrows made of fire", icon:"spartaan_snelle_woede.png" } },
        { star:7,
          a:{ id:"onstuitbare_kracht", nm:"Onstuitbare Kracht", desc:"Staat Menos op het maximum, dan gaan al je aanvallen door schild heen.", glyph:"⇛",
              fx:{ type:"attack_streak_full_bypass" },
              iconSubject:"a spear smashing straight through a wooden shield in a burst of splinters", icon:"spartaan_onstuitbare_kracht.png" },
          b:{ id:"nagloeien", nm:"Nagloeien", desc:"Een ronde zonder aanval halveert Menos in plaats van het naar 0 te zetten.", glyph:"◒",
              fx:{ type:"attack_streak_decay", mode:"half" },
              iconSubject:"glowing embers in a bronze brazier", icon:"spartaan_nagloeien.png" } },
        { star:8,
          a:{ id:"ontlading", nm:"Ontlading", desc:"Leeuwensprong telt de bonus van Menos dubbel; daarna gaat Menos naar 0.", glyph:"✸",
              fx:{ type:"ability_mod", ability:"leeuwensprong", streakMult:2, streakReset:true },
              iconSubject:"a lion leaping forward in an explosion of fire", icon:"spartaan_ontlading.png" },
          b:{ id:"speerregen", nm:"Speerregen", desc:"Speerstoot +2 schade.", glyph:"⇈",
              fx:{ type:"ability_mod", ability:"speer", dmg:2 },
              iconSubject:"three spears flying in parallel toward the upper right", icon:"spartaan_speerregen.png" } },
        { star:9,
          a:{ id:"kleos", nm:"Kleos", desc:"Na een Leeuwensprong krijg je +2 AP (binnen het rondeplafond).", glyph:"✪",
              fx:{ type:"after_ability_self_be", ability:"leeuwensprong", val:2 },
              iconSubject:"a golden victory wreath above a raised spear", icon:"spartaan_kleos.png" },
          b:{ id:"woede_van_ares", nm:"Woede van Ares", desc:"Berserk +3 schade.", glyph:"♂",
              fx:{ type:"ability_mod", ability:"berserk", dmg:3 },
              iconSubject:"the helmet of Ares, the war god, with burning red eyes", icon:"spartaan_woede_van_ares.png" } },
      ],
      B: [
        { star:6,
          a:{ id:"dorst", nm:"Dorst", desc:"Levensroof heelt +2 per aanval in plaats van +1.", glyph:"♥",
              fx:{ type:"attack_heal_val", val:2, node:"levensroof" },
              iconSubject:"a bronze drinking cup (kylix) filled with dark red liquid", icon:"spartaan_dorst.png" },
          b:{ id:"wrede_oogst", nm:"Wrede Oogst", desc:"Genadeslag heelt je leger ook +3.", glyph:"☾",
              fx:{ type:"ability_mod", ability:"genadeslag", heal:3 },
              iconSubject:"a curved sickle-shaped blade with drops of red falling from it", icon:"spartaan_wrede_oogst.png" } },
        { star:7,
          a:{ id:"rode_kling", nm:"Rode Kling", desc:"Bloedroof +2 schade (6 → 8).", glyph:"†",
              fx:{ type:"ability_mod", ability:"bloedroof", dmg:2 },
              iconSubject:"a short Greek sword (xiphos) with a glowing red blade", icon:"spartaan_rode_kling.png" },
          b:{ id:"overvloeiend_bloed", nm:"Overvloeiend Bloed", desc:"Heling die boven de maximale HP uitkomt, wordt schild voor je team (max. +3).", glyph:"⛲",
              fx:{ type:"overheal_to_shield", max:3 },
              iconSubject:"a bronze bowl overflowing with red liquid onto a shield below it", icon:"spartaan_overvloeiend_bloed.png" } },
        { star:8,
          a:{ id:"ijzeren_vlees", nm:"IJzeren Vlees", desc:"Berserk heelt je leger ook +3.", glyph:"✚",
              fx:{ type:"ability_mod", ability:"berserk", heal:3 },
              iconSubject:"a muscular arm wrapped in iron bands holding a sword", icon:"spartaan_ijzeren_vlees.png" },
          b:{ id:"bloedbroeders", nm:"Bloedbroeders", desc:"Combo Strijdszegen (met een Priester) heelt je leger ook +5.", glyph:"⚭",
              fx:{ type:"combo_mod", combo:"strijdszegen", heal:5 },
              iconSubject:"two hands clasped in a warrior's handshake, a red cord tied around them", icon:"spartaan_bloedbroeders.png" } },
        { star:9,
          a:{ id:"onverzadigbaar", nm:"Onverzadigbaar", desc:"Leeuwensprong heelt je leger ook +6.", glyph:"♌",
              fx:{ type:"ability_mod", ability:"leeuwensprong", heal:6 },
              iconSubject:"a roaring lion with a red mane made of flames", icon:"spartaan_onverzadigbaar.png" },
          b:{ id:"brandend_bloed", nm:"Brandend Bloed", desc:"Bloedroof gaat door schild heen.", glyph:"✹",
              fx:{ type:"ability_mod", ability:"bloedroof", bypass:true },
              iconSubject:"a red sword piercing straight through a bronze shield", icon:"spartaan_brandend_bloed.png" } },
      ],
    },

    prestige: [
      { id:"aristeia", nm:"Aristeia", cost:13, path:"A",
        desc:"Heldenmoment: aanval +20 die door schild heen gaat, plus +2 per punt Menos.", glyph:"☀",
        fx:{ type:"attack_bypass", dmg:20, perStreak:2 },
        iconSubject:"a lone Greek hero in bronze armour surrounded by a blazing golden aura", icon:"spartaan_aristeia.png" },
      { id:"toorn_van_ares", nm:"Toorn van Ares", cost:13, path:"B",
        desc:"Aanval +14 die door schild heen gaat, én je leger heelt +10.", glyph:"♂",
        fx:{ type:"heal_and_attack", dmg:14, bypass:true, heal:10 },
        iconSubject:"the war god's bronze spear dripping red, crossed with a laurel branch", icon:"spartaan_toorn_van_ares.png" },
    ],
  },

  // ---- CAVALERIE: Schokcavalerie (aanloop nemen, dan inslag) vs Lichte Ruiterij (tempo uit snelheid) ----
  // Aanloop = spiegelbeeld van de Aristeia (die beloont juist aanval-na-aanval).
  // Verschil met Tegenstoot (Hopliet): Aanloop vraagt géén schildactie, elke
  // ronde zonder aanval telt (ook sparen of een basisactie als Dekking zoeken).
  // Lichte Ruiterij wint uit snelheid, niet uit lagere kosten (dat is de Verkenner).
  // "Snel" = goed binnen het eerste kwart van de timer (BM_FAST_FRACTION, live sinds 2026-10-05).
  cavalerie: {
    classId: "cavalerie",
    nm: "Cavalerie", color:"#9B6914", colorNm:"dark ochre brown",
    paths: {
      A: { nm:"Schokcavalerie", accent:"#c0673a", accentNm:"rusty copper orange", desc:"Aanloop nemen, dan inslaan: wie even wacht, raakt veel harder." },
      H: { nm:"Hetairos",       accent:"#d4af37", accentNm:"warm gold",           desc:"Hybride: de ruiterij van Alexander, snel én zwaar, beide met mate." },
      B: { nm:"Lichte Ruiterij", accent:"#4fb3a8", accentNm:"wind teal",          desc:"Tempo: snel én goed antwoorden zet je om in constante druk langs de flank." },
    },
    root: { nm:"Cavalerie", desc:"Passief: +2 AP bij een snel én goed antwoord.", glyph:"♞",
            iconSubject:"a rearing horse's head and neck in profile with a bronze bridle",
            icon:"cavalerie_root.png" },
    master: { star:5, nm:"Meester", desc:"Meesterpassief: +3 AP bij een snel én goed antwoord (in plaats van +2).", glyph:"✦",
              iconSubject:"a golden laurel wreath around a horseshoe",
              icon:"cavalerie_meester.png" },

    identity: [
      { star:1,
        A:{ id:"aanloop", nm:"Aanloop", desc:"Na een ronde waarin je níét aanviel, doet je volgende aanval +3.", glyph:"⇢",
            fx:{ type:"attack_after_idle", val:3 },
            iconSubject:"a horse lowering its head before a gallop, dust rising behind its hooves", icon:"cavalerie_aanloop.png" },
        B:{ id:"op_de_flank", nm:"Op de Flank", desc:"Antwoordde je deze ronde snel én goed, dan doet je aanval +2.", glyph:"⤴",
            fx:{ type:"fast_answer_attack", val:2 },
            iconSubject:"a curved arrow sweeping around the side of a small block of soldiers", icon:"cavalerie_op_de_flank.png" } },
      { star:2,
        A:{ id:"zware_lansen", nm:"Zware Lansen", desc:"Charge +2 schade (7 → 9).", glyph:"⟶",
            fx:{ type:"ability_mod", ability:"charge", dmg:2 },
            iconSubject:"a long heavy cavalry lance pointing forward horizontally", icon:"cavalerie_zware_lansen.png" },
        B:{ id:"hit_and_run", nm:"Toeslaan en Wegwezen", desc:"Snelle Uitval +2 schade (3 → 5).", glyph:"⇆",
            fx:{ type:"ability_mod", ability:"snelle_uitval", dmg:2 },
            iconSubject:"a horse galloping away while its rider looks back over his shoulder", icon:"cavalerie_hit_and_run.png" } },
      { star:3,
        A:{ id:"ramkoers", nm:"Ramkoers", desc:"Stormram haalt −6 vijandelijk schild weg in plaats van −4.", glyph:"⊳",
            fx:{ type:"ability_mod", ability:"stormram", shldRemove:2 },
            iconSubject:"a horse's armoured chest smashing into a wooden barricade", icon:"cavalerie_ramkoers.png" },
        B:{ id:"ontwijken", nm:"Ontwijken", desc:"Antwoordde je deze ronde snel én goed, dan geeft je aanval je team ook +2 schild.", glyph:"↶",
            fx:{ type:"fast_answer_team_shield", val:2 },
            iconSubject:"a rider swerving aside while an arrow flies past him", icon:"cavalerie_ontwijken.png" } },
      { star:4,
        A:{ id:"eerste_inslag", nm:"Eerste Inslag", desc:"Je allereerste aanval van het gevecht doet +4.", glyph:"①",
            fx:{ type:"first_attack_dmg", val:4 },
            iconSubject:"a war trumpet sounding with a horse charging out from behind it", icon:"cavalerie_eerste_inslag.png" },
        B:{ id:"vliegende_colonne", nm:"Vliegende Colonne", desc:"Flankbeweging geeft +3 schild extra (3 → 6) bij een snel én goed antwoord.", glyph:"⇶",
            fx:{ type:"ability_mod", ability:"flankbeweging", fastShld:3 },
            iconSubject:"a column of small horse silhouettes riding in a fast diagonal line", icon:"cavalerie_vliegende_colonne.png" } },
    ],

    pathNodes: {
      A: [
        { star:6,
          a:{ id:"lange_aanloop", nm:"Lange Aanloop", desc:"Aanloop stapelt over twee rondes zonder aanval (max. +6).", glyph:"⇉",
              fx:{ type:"attack_after_idle_stack", maxRounds:2, node:"aanloop" },
              iconSubject:"a long trail of hoofprints leading toward a single charging horse", icon:"cavalerie_lange_aanloop.png" },
          b:{ id:"doorbraak", nm:"Doorbraak", desc:"Een aanval met Aanloop-bonus gaat door schild heen.", glyph:"⇥",
              fx:{ type:"attack_after_idle_bypass", node:"aanloop" },
              iconSubject:"a horse bursting through a broken line of wooden shields", icon:"cavalerie_doorbraak.png" } },
        { star:7,
          a:{ id:"donderende_hoeven", nm:"Donderende Hoeven", desc:"Stormloop +3 schade.", glyph:"ϟ",
              fx:{ type:"ability_mod", ability:"stormloop", dmg:3 },
              iconSubject:"four horse hooves striking the ground with lightning-shaped cracks", icon:"cavalerie_donderende_hoeven.png" },
          b:{ id:"wig", nm:"Wig", desc:"Charge haalt ook −3 vijandelijk schild weg.", glyph:"◣",
              fx:{ type:"ability_mod", ability:"charge", shldRemove:3 },
              iconSubject:"a wedge-shaped formation of riders seen from above", icon:"cavalerie_wig.png" } },
        { star:8,
          a:{ id:"kataphrakt", nm:"Kataphrakt", desc:"Stormloop kost 8 AP in plaats van 9.", glyph:"⛨",
              fx:{ type:"ability_mod", ability:"stormloop", cost:-1 },
              iconSubject:"a horse fully covered in scale armour, seen from the side", icon:"cavalerie_kataphrakt.png" },
          b:{ id:"verpletteren", nm:"Verpletteren", desc:"Stormram +3 schade.", glyph:"✹",
              fx:{ type:"ability_mod", ability:"stormram", dmg:3 },
              iconSubject:"a heavy horse hoof crushing a bronze helmet", icon:"cavalerie_verpletteren.png" } },
        { star:9,
          a:{ id:"hamer_en_aambeeld", nm:"Hamer en Aambeeld", desc:"Koos een teamgenoot deze ronde een schildactie, dan doet je Aanloop-bonus +2 extra.", glyph:"⚒",
              fx:{ type:"attack_after_idle_ally_shield", val:2, node:"aanloop" },
              iconSubject:"a hammer striking down onto an anvil shaped like a round shield", icon:"cavalerie_hamer_en_aambeeld.png" },
          b:{ id:"bucephalus", nm:"Bucephalus", desc:"Stormloop gaat door schild heen.", glyph:"♘",
              fx:{ type:"ability_mod", ability:"stormloop", bypass:true },
              iconSubject:"a black war horse with a white star on its forehead, rearing up", icon:"cavalerie_bucephalus.png" } },
      ],
      B: [
        { star:6,
          a:{ id:"windruiter", nm:"Windruiter", desc:"De bonus van Op de Flank gaat van +2 naar +3.", glyph:"≋",
              fx:{ type:"fast_answer_attack_val", val:3, node:"op_de_flank" },
              iconSubject:"a horse galloping with wind lines streaming from its mane", icon:"cavalerie_windruiter.png" },
          b:{ id:"parthisch_schot", nm:"Parthisch Schot", desc:"Snelle Uitval geeft je team ook +2 schild.", glyph:"↺",
              fx:{ type:"ability_mod", ability:"snelle_uitval", shld:2 },
              iconSubject:"a mounted archer turning backwards in the saddle to shoot an arrow", icon:"cavalerie_parthisch_schot.png" } },
        { star:7,
          a:{ id:"ruitervaardigheid", nm:"Ruitervaardigheid", desc:"Voor jou telt een antwoord al als snel binnen de eerste 35% van de tijd (in plaats van 25%).", glyph:"⏱",
              fx:{ type:"fast_threshold", frac:0.35 },
              iconSubject:"an hourglass with a horseshoe hanging in front of it", icon:"cavalerie_ruitervaardigheid.png" },
          b:{ id:"ritme", nm:"Ritme", desc:"Na twee snelle goede antwoorden op rij doet je volgende aanval +1.", glyph:"♪",
              fx:{ type:"fast_streak_attack", minStreak:2, val:1 },
              iconSubject:"two horseshoes side by side with small motion lines between them", icon:"cavalerie_ritme.png" } },
        { star:8,
          a:{ id:"numidische_ruiters", nm:"Numidische Ruiters", desc:"Antwoordde je deze ronde snel én goed, dan kost je aanval 1 AP minder (min. 1).", glyph:"☼",
              fx:{ type:"fast_answer_cost", val:-1 },
              iconSubject:"a light rider on a small horse without a saddle, holding a javelin", icon:"cavalerie_numidische_ruiters.png" },
          b:{ id:"speervuur", nm:"Speervuur", desc:"Flankbeweging +2 schade.", glyph:"⇈",
              fx:{ type:"ability_mod", ability:"flankbeweging", dmg:2 },
              iconSubject:"several javelins flying in a fan shape from the side", icon:"cavalerie_speervuur.png" } },
        { star:9,
          a:{ id:"overal_tegelijk", nm:"Overal Tegelijk", desc:"Ontwijken geeft ook bij een goed (niet snel) antwoord +1 schild.", glyph:"⁂",
              fx:{ type:"ontwijken_slow", val:1, node:"ontwijken" },
              iconSubject:"three riders in three directions around a small shield in the centre", icon:"cavalerie_overal_tegelijk.png" },
          b:{ id:"wervelwind", nm:"Wervelwind", desc:"Op de Flank geldt ook bij een goed (niet snel) antwoord, voor de helft (+1).", glyph:"✺",
              fx:{ type:"fast_answer_attack_slow", val:1, node:"op_de_flank" },
              iconSubject:"a horse spinning in a circle of dust and wind", icon:"cavalerie_wervelwind.png" } },
      ],
    },

    prestige: [
      { id:"charge_van_alexander", nm:"Charge van Alexander", cost:13, path:"A",
        desc:"Doorbraak: aanval +16 én vijandelijk schild −6; je Aanloop-bonus telt hier dubbel.", glyph:"♞",
        fx:{ type:"attack_and_shld_remove", dmg:16, shldRemove:6, idleMult:2 },
        iconSubject:"a rider on a black horse leading a wedge of cavalry, spear raised", icon:"cavalerie_charge_van_alexander.png" },
      { id:"numidische_storm", nm:"Numidische Storm", cost:13, path:"B",
        desc:"Aanval +12 die door schild heen gaat, en je team krijgt +4 schild. Snel én goed geantwoord: je krijgt 3 AP terug.", glyph:"≋",
        fx:{ type:"attack_and_defend", dmg:12, bypass:true, shld:4, fastRefund:3 },
        iconSubject:"a swirling storm of light riders throwing javelins around an enemy", icon:"cavalerie_numidische_storm.png" },
    ],
  },

  // ---- PRIESTER: Heler (noodhulp: heelt slimmer, niet alleen meer) vs Orakel (de vijand vervloeken) ----
  // Team-AP als kern hoort bij de Bevelvoerder, niet hier.
  // Vloek-regels (nieuw mechanisme): een vervloekte vijand doet de volgende ronde
  // X schade minder (totaal, vlak). Vloeken stapelen NIET: per vijand telt alleen
  // de sterkste. Tegen een baas/garnizoen werkt een vloek als PERCENTAGE: 10% minder
  // baasklap per vloekpunt (een baasklap groeit met de klasgrootte, een vast getal
  // niet — balanstest 2026-10-05). Een vloek raakt nooit de speciale aanvallen
  // (Cycloop-maaltijd, Minotaurus-Enrage) — die zijn bedoeld om samen schild te heffen —
  // en ook niet het extra van aangegroeide Hydra-koppen (boss_attack.headExtra): dat is
  // de straf voor een mislukte gezamenlijke klap (balanstest ronde 5).
  // "Moeilijk woord" (Les van Delphi): een woord uit je hardWords (alleen als
  // Adaptief leren aanstaat), of anders een woord dat je dít gevecht al eens fout had.
  priester: {
    classId: "priester",
    nm: "Priester", color:"#3f9d52", colorNm:"temple green",
    paths: {
      A: { nm:"Heler",       accent:"#6fcf8a", accentNm:"soft healing green", desc:"De school van Asklepios: heelt het hardst als het leger het het hardst nodig heeft." },
      H: { nm:"Hogepriester", accent:"#d4af37", accentNm:"warm gold",         desc:"Hybride: heelt én vervloekt, beide met mate." },
      B: { nm:"Orakel",      accent:"#9a7be0", accentNm:"mystic violet",      desc:"De vloek van de goden: de vijand slaat minder hard, nog vóór de klap valt." },
    },
    root: { nm:"Priester", desc:"Passief: +1 heling bij elke heling.", glyph:"☤",
            iconSubject:"a burning bronze altar bowl with smoke curling upward",
            icon:"priester_root.png" },
    master: { star:5, nm:"Meester", desc:"Meesterpassief: +2 heling bij elke heling (in plaats van +1).", glyph:"✦",
              iconSubject:"a golden laurel wreath around a small burning altar",
              icon:"priester_meester.png" },

    identity: [
      { star:1,
        A:{ id:"noodhulp", nm:"Noodhulp", desc:"Je helingen doen +1 per kwart HP dat je leger mist (max. +3).", glyph:"✚",
            fx:{ type:"heal_by_missing_hp", perQuarter:1, max:3 },
            iconSubject:"a hand pressing a glowing green herb onto a bandaged wound", icon:"priester_noodhulp.png" },
        B:{ id:"vloek_der_goden", nm:"Vloek der Goden", desc:"Vloek vervloekt het doel: de volgende ronde doet die vijand 2 schade minder.", glyph:"☋",
            fx:{ type:"ability_mod", ability:"vloek", curse:2 },
            iconSubject:"a dark purple cloud with a single downward bolt above a broken spear", icon:"priester_vloek_der_goden.png" } },
      { star:2,
        A:{ id:"heilige_bron", nm:"Heilige Bron", desc:"Gebed heelt +2 meer (7 → 9).", glyph:"♒",
            fx:{ type:"ability_mod", ability:"gebed", heal:2 },
            iconSubject:"a sacred spring pouring clear water from a stone lion's mouth", icon:"priester_heilige_bron.png" },
        B:{ id:"les_van_delphi", nm:"Les van Delphi", desc:"Beantwoord je een van je moeilijke woorden goed, dan doet je Vloek deze ronde +3 schade en vervloekt hij 1 extra.", glyph:"Δ",
            fx:{ type:"hard_word_curse_bonus", dmg:3, curse:1 },
            iconSubject:"the inscription stone of Delphi with a small glowing eye above it", icon:"priester_les_van_delphi.png" } },
      { star:3,
        A:{ id:"zegen_van_hygieia", nm:"Zegen van Hygieia", desc:"Reinigend Licht heelt +3 meer (7 → 10).", glyph:"☼",
            fx:{ type:"ability_mod", ability:"reinigend_licht", heal:3 },
            iconSubject:"a shallow bowl with a snake drinking from it, bathed in soft light", icon:"priester_zegen_van_hygieia.png" },
        B:{ id:"boze_oog", nm:"Boze Oog", desc:"Vloek +2 schade (5 → 7).", glyph:"◉",
            fx:{ type:"ability_mod", ability:"vloek", dmg:2 },
            iconSubject:"a single staring painted eye on a dark clay amulet", icon:"priester_boze_oog.png" } },
      { star:4,
        A:{ id:"staf_van_asklepios", nm:"Staf van Asklepios", desc:"Godenvuur kost 8 AP in plaats van 9.", glyph:"⚕",
            fx:{ type:"ability_mod", ability:"godenvuur", cost:-1 },
            iconSubject:"a wooden staff with a single snake coiled around it", icon:"priester_staf_van_asklepios.png" },
        B:{ id:"gewijd_vuur", nm:"Gewijd Vuur", desc:"Ook Reinigend Licht en Godenvuur vervloeken het doel (1 schade minder).", glyph:"♆",
            fx:{ type:"ability_mod", abilities:["reinigend_licht","godenvuur"], curse:1 },
            iconSubject:"a purple flame burning in a bronze tripod", icon:"priester_gewijd_vuur.png" } },
    ],

    pathNodes: {
      A: [
        { star:6,
          a:{ id:"snelle_hulp", nm:"Snelle Hulp", desc:"Het maximum van Noodhulp gaat van +3 naar +4.", glyph:"✚",
              fx:{ type:"heal_by_missing_hp_max", max:4, node:"noodhulp" },
              iconSubject:"a running figure carrying a bowl of glowing green ointment", icon:"priester_snelle_hulp.png" },
          b:{ id:"kruiden", nm:"Kruiden", desc:"Gebed kost 2 AP in plaats van 3.", glyph:"❦",
              fx:{ type:"ability_mod", ability:"gebed", cost:-1 },
              iconSubject:"a bundle of dried healing herbs tied with string", icon:"priester_kruiden.png" } },
        { star:7,
          a:{ id:"schaal_van_hygieia", nm:"Schaal van Hygieia", desc:"Godenvuur heelt +4 meer (12 → 16).", glyph:"◡",
              fx:{ type:"ability_mod", ability:"godenvuur", heal:4 },
              iconSubject:"a golden bowl with a snake coiled around its base, glowing liquid inside", icon:"priester_schaal_van_hygieia.png" },
          b:{ id:"tempelslaap", nm:"Tempelslaap", desc:"Zegen heelt je leger ook +1.", glyph:"☾",
              fx:{ type:"ability_mod", ability:"zegen", heal:1 },
              iconSubject:"a sleeping figure on a temple bench under a crescent moon", icon:"priester_tempelslaap.png" } },
        { star:8,
          a:{ id:"epidauros", nm:"Epidauros", desc:"Al je helingen +1.", glyph:"Ω",
              fx:{ type:"heal_flat", val:1 },
              iconSubject:"the round stone theatre of Epidauros seen from above at dusk", icon:"priester_epidauros.png" },
          b:{ id:"heilige_slang", nm:"Heilige Slang", desc:"Gebed heelt de ronde erna nog eens +3.", glyph:"∿",
              fx:{ type:"ability_mod", ability:"gebed", healNextRound:3 },
              iconSubject:"a green temple snake coiled in a spiral on a stone floor", icon:"priester_heilige_slang.png" } },
        { star:9,
          a:{ id:"panakeia", nm:"Panakeia", desc:"Reinigend Licht kost 5 AP in plaats van 6.", glyph:"✺",
              fx:{ type:"ability_mod", ability:"reinigend_licht", cost:-1 },
              iconSubject:"a small glass vial of glowing golden medicine", icon:"priester_panakeia.png" },
          b:{ id:"wonderheling", nm:"Wonderheling", desc:"Eén keer per gevecht: zakt je leger onder 20% HP, dan heelt je volgende Gebed dubbel.", glyph:"✧",
              fx:{ type:"once_low_hp_double_heal", threshold:0.20, ability:"gebed" },
              iconSubject:"a beam of golden light falling onto an open hand", icon:"priester_wonderheling.png" } },
      ],
      B: [
        { star:6,
          a:{ id:"zware_vloek", nm:"Zware Vloek", desc:"Je vloeken doen 1 schade minder extra (Vloek: 2 → 3).", glyph:"☋",
              fx:{ type:"curse_val", add:1 },
              iconSubject:"a heavy dark iron chain wrapped around a sword hilt", icon:"priester_zware_vloek.png" },
          b:{ id:"onheilsdag", nm:"Onheilsdag", desc:"Je vloek werkt ook nog een tweede ronde (met 1 schade minder).", glyph:"☍",
              fx:{ type:"curse_linger", rounds:1, val:1 },
              iconSubject:"a black sun partly covered by a dark moon (eclipse)", icon:"priester_onheilsdag.png" } },
        { star:7,
          a:{ id:"duistere_taal", nm:"Duistere Taal", desc:"Vloek doet +2 schade tegen een doel dat al vervloekt is.", glyph:"ϟ",
              fx:{ type:"ability_mod", ability:"vloek", cursedDmg:2 },
              iconSubject:"a rolled papyrus scroll glowing with purple writing", icon:"priester_duistere_taal.png" },
          b:{ id:"raadselspreuk", nm:"Raadselspreuk", desc:"Een vervloekte vijand verliest ook 2 schild.", glyph:"?",
              fx:{ type:"curse_shld_remove", val:2 },
              iconSubject:"a sphinx head in profile with a question-shaped curl of smoke", icon:"priester_raadselspreuk.png" } },
        { star:8,
          a:{ id:"godsoordeel", nm:"Godsoordeel", desc:"Godenvuur doet +3 schade tegen een vervloekt doel.", glyph:"⚖",
              fx:{ type:"ability_mod", ability:"godenvuur", cursedDmg:3 },
              iconSubject:"a bronze balance scale with a lightning bolt on one side", icon:"priester_godsoordeel.png" },
          b:{ id:"sibyllijnse_boeken", nm:"Sibyllijnse Boeken", desc:"De bonus van Les van Delphi gaat van +3 naar +5 schade.", glyph:"▤",
              fx:{ type:"hard_word_curse_bonus_val", dmg:5, node:"les_van_delphi" },
              iconSubject:"three ancient scrolls tied together with a purple ribbon", icon:"priester_sibyllijnse_boeken.png" } },
        { star:9,
          a:{ id:"nemesis", nm:"Nemesis", desc:"Doet een vervloekte vijand toch schade, dan krijgt hij er 4 van terug.", glyph:"⚔",
              fx:{ type:"curse_thorns", val:4 },
              iconSubject:"a winged female figure holding a sword and a measuring rod", icon:"priester_nemesis.png" },
          b:{ id:"cassandra", nm:"Cassandra", desc:"Tegen bazen en garnizoenen haalt elk vloekpunt 15% van de baasklap weg in plaats van 10% (speciale aanvallen blijven buiten schot).", glyph:"☉",
              fx:{ type:"curse_vs_boss_pct", pct:0.15 },
              iconSubject:"a young priestess with wide eyes and a laurel band, seen from the side", icon:"priester_cassandra.png" } },
      ],
    },

    prestige: [
      { id:"hand_van_asklepios", nm:"Hand van Asklepios", cost:13, path:"A",
        desc:"Heelt je leger +22 en doet +4 schade; Noodhulp telt hier dubbel.", glyph:"⚕",
        fx:{ type:"heal_and_attack", heal:22, dmg:4, missingHpMult:2 },
        iconSubject:"a glowing open hand in front of the rod of Asclepius: one plain wooden staff with exactly one snake coiled around it (NOT a caduceus: no wings, not two snakes)", icon:"priester_hand_van_asklepios.png" },
      { id:"orakel_van_delphi", nm:"Orakel van Delphi", cost:13, path:"B",
        desc:"Aanval +12, heling +6, en een zware vloek: de vijand doet twee rondes lang 4 schade minder.", glyph:"Δ",
        fx:{ type:"heal_and_attack", dmg:12, heal:6, curse:4, curseRounds:2 },
        iconSubject:"the Pythia seated on a bronze tripod above a crack with rising purple vapour", icon:"priester_orakel_van_delphi.png" },
    ],
  },

  // ---- BEVELVOERDER: Kwartiermeester (niemand blijft achter) vs Aanvoerder (sterk als eenheid) ----
  // Alles wat team-AP geeft blijft binnen BM_TEAMBE_ROUND_CAP (4 per teamgenoot per ronde).
  // Kwartiermeester: AP gaat eerst naar wie het minst heeft. "Opvangen" geeft bewust
  // ook iets aan wie fout antwoordde — maar altijd minder dan de foutboete (2), zodat
  // expres fout antwoorden nooit loont (bewuste uitzondering op "passieve bonus alleen
  // na een goed antwoord").
  // Aanvoerder: schaalt met het PERCENTAGE van het team dat vorige ronde goed
  // antwoordde (nooit met het aantal, anders scheef bij klasgrootte). Moreel-ladder:
  // ≥50% → +2, ≥75% → +3, ≥95% → +4 (drempels bewust een uitdaging, besluit 2026-10-05).
  centurio: {
    classId: "centurio",
    nm: "Bevelvoerder", color:"#6B2D8B", colorNm:"imperial purple",
    paths: {
      A: { nm:"Kwartiermeester", accent:"#62b6a5", accentNm:"supply teal",       desc:"De logistiek van het legioen: AP gaat eerst naar wie het het hardst nodig heeft." },
      H: { nm:"Centurio",        accent:"#d4af37", accentNm:"warm gold",         desc:"Hybride: zorgt voor iedereen én trekt het team omhoog, beide met mate." },
      B: { nm:"Aanvoerder",      accent:"#b07be0", accentNm:"imperial violet",   desc:"Zo sterk als je troepen: hoe beter het team antwoordt, hoe harder je bevelen werken." },
    },
    root: { nm:"Bevelvoerder", desc:"Passief: +1 AP per ronde, altijd.", glyph:"⚜",
            iconSubject:"a Roman centurion's helmet with a sideways red crest, seen from the front",
            icon:"centurio_root.png" },
    master: { star:5, nm:"Meester", desc:"Meesterpassief: +2 AP per ronde, altijd (in plaats van +1).", glyph:"✦",
              iconSubject:"a golden laurel wreath around a centurion's vine staff (vitis)",
              icon:"centurio_meester.png" },

    identity: [
      { star:1,
        A:{ id:"bevoorrading", nm:"Bevoorrading", desc:"Je team-AP-acties geven de teamgenoten met de minste AP (onderste kwart van het team, min. 1) +1 extra.", glyph:"⚖",
            fx:{ type:"team_be_to_lowest", val:1, share:0.25 },
            iconSubject:"a stack of grain sacks and an amphora on a small wooden cart", icon:"centurio_bevoorrading.png" },
        B:{ id:"moreel", nm:"Moreel", desc:"Bevel en Testudo geven extra schild naar hoeveel van je team vorige ronde goed antwoordde: ≥50% +2, ≥75% +3, ≥95% +4.", glyph:"▲",
            fx:{ type:"team_accuracy_shield", abilities:["bevel","testudo"], ladder:[[0.5,2],[0.75,3],[0.95,4]] },
            iconSubject:"a Roman legion standard with a raised eagle and red banner", icon:"centurio_moreel.png" } },
      { star:2,
        A:{ id:"snelle_bevoorrading", nm:"Snelle Bevoorrading", desc:"Aanmoediging kost 1 AP in plaats van 2.", glyph:"⇢",
            fx:{ type:"ability_mod", ability:"aanmoediging", cost:-1 },
            iconSubject:"a running Roman messenger carrying a small sack over his shoulder", icon:"centurio_snelle_bevoorrading.png" },
        B:{ id:"signifer", nm:"Signifer", desc:"Antwoordde ≥60% van je team vorige ronde goed, dan krijg je +2 AP (binnen het rondeplafond).", glyph:"⚑",
            fx:{ type:"team_accuracy_self_be", minAcc:0.60, val:2 },
            iconSubject:"a Roman standard-bearer's pole with round metal discs (phalerae)", icon:"centurio_signifer.png" } },
      { star:3,
        A:{ id:"opvangen", nm:"Opvangen", desc:"Teamgenoten die vorige ronde fout antwoordden, krijgen van je team-AP-acties +1 extra (altijd minder dan de foutboete).", glyph:"⤓",
            fx:{ type:"team_be_to_wrong", val:1 },
            iconSubject:"two hands catching a falling bronze helmet", icon:"centurio_opvangen.png" },
        B:{ id:"veldheersblik", nm:"Veldheersblik", desc:"Veldverzorging heelt extra volgens de Moreel-ladder: ≥50% +2, ≥75% +3, ≥95% +4.", glyph:"◉",
            fx:{ type:"team_accuracy_heal", ability:"veldverzorging", ladder:[[0.5,2],[0.75,3],[0.95,4]] },
            iconSubject:"a commander's eye looking over a small field camp with tents", icon:"centurio_veldheersblik.png" } },
      { star:4,
        A:{ id:"logistiek", nm:"Logistiek", desc:"Strijdformatie kost 3 AP in plaats van 4.", glyph:"☰",
            fx:{ type:"ability_mod", ability:"strijdformatie", cost:-1 },
            iconSubject:"a wax writing tablet with neat rows of tally marks and a stylus", icon:"centurio_logistiek.png" },
        B:{ id:"aquila", nm:"Aquila", desc:"Antwoordde je héle team vorige ronde goed, dan krijgt iedereen +1 AP (binnen het team-AP-plafond).", glyph:"☖",
            fx:{ type:"team_full_accuracy_team_be", val:1 },
            iconSubject:"a golden Roman legion eagle with spread wings on top of a pole", icon:"centurio_aquila.png" } },
    ],

    pathNodes: {
      A: [
        { star:6,
          a:{ id:"volle_schuren", nm:"Volle Schuren", desc:"Bevoorrading geeft +2 extra in plaats van +1.", glyph:"⌂",
              fx:{ type:"team_be_to_lowest_val", val:2, node:"bevoorrading" },
              iconSubject:"a Roman granary building with open doors full of grain", icon:"centurio_volle_schuren.png" },
          b:{ id:"marsrantsoen", nm:"Marsrantsoen", desc:"Aanmoediging geeft je team ook +2 schild.", glyph:"◫",
              fx:{ type:"ability_mod", ability:"aanmoediging", shld:2 },
              iconSubject:"a leather marching pack with a bread loaf and a water flask", icon:"centurio_marsrantsoen.png" } },
        { star:7,
          a:{ id:"veldkeuken", nm:"Veldkeuken", desc:"Veldverzorging heelt +3 meer (9 → 12).", glyph:"♨",
              fx:{ type:"ability_mod", ability:"veldverzorging", heal:3 },
              iconSubject:"a bronze cooking pot steaming over a small camp fire", icon:"centurio_veldkeuken.png" },
          b:{ id:"vangnet", nm:"Vangnet", desc:"Opvangen geldt ook voor teamgenoten met 0 AP, ook als ze goed antwoordden.", glyph:"⌣",
              fx:{ type:"team_be_to_zero", val:1, node:"opvangen" },
              iconSubject:"a rope net stretched between two wooden posts", icon:"centurio_vangnet.png" } },
        { star:8,
          a:{ id:"bagagetrein", nm:"Bagagetrein", desc:"Testudo kost 7 AP in plaats van 8.", glyph:"⛟",
              fx:{ type:"ability_mod", ability:"testudo", cost:-1 },
              iconSubject:"a mule carrying packs and a pickaxe on its back", icon:"centurio_bagagetrein.png" },
          b:{ id:"taaie_veteraan", nm:"Taaie Veteraan", desc:"Een fout antwoord kost jou maar 1 AP in plaats van 2.", glyph:"⛉",
              fx:{ type:"wrong_penalty_self", val:1 },
              iconSubject:"a battered old Roman helmet with many dents and a scar-like scratch", icon:"centurio_taaie_veteraan.png" } },
        { star:9,
          a:{ id:"muilezels_van_marius", nm:"Muilezels van Marius", desc:"Je passieve AP per ronde gaat naar de teamgenoot met de minste AP, en wordt daar 1 meer.", glyph:"♘",
              fx:{ type:"passive_to_lowest", bonus:1 },
              iconSubject:"a Roman legionary carrying a heavy pack on a forked pole over his shoulder", icon:"centurio_muilezels_van_marius.png" },
          b:{ id:"niemand_valt", nm:"Niemand Valt", desc:"Kon deze ronde iedereen in je team een actie betalen, dan krijg je +4 AP (binnen het rondeplafond).", glyph:"◯",
              fx:{ type:"team_all_afford_self_be", val:4 },
              iconSubject:"a closed circle of linked hands seen from above", icon:"centurio_niemand_valt.png" } },
      ],
      B: [
        { star:6,
          a:{ id:"optimus", nm:"Optimus", desc:"De Moreel-ladder gaat één trede hoger: ≥50% +3, ≥75% +4, ≥95% +5.", glyph:"⇑",
              fx:{ type:"team_accuracy_ladder_add", add:1 },
              iconSubject:"a centurion's vine staff raised high with a golden ribbon", icon:"centurio_optimus.png" },
          b:{ id:"strijdkreet", nm:"Strijdkreet", desc:"Bevel +2 schild (3 → 5).", glyph:"!",
              fx:{ type:"ability_mod", ability:"bevel", shld:2 },
              iconSubject:"an open-mouthed Roman helmet with sound waves coming out", icon:"centurio_strijdkreet.png" } },
        { star:7,
          a:{ id:"tribunus", nm:"Tribunus", desc:"Antwoordde ≥60% van je team vorige ronde goed, dan geeft Strijdformatie iedereen +1 AP extra.", glyph:"⚑",
              fx:{ type:"team_accuracy_ability_be", ability:"strijdformatie", minAcc:0.60, val:1 },
              iconSubject:"a tribune's narrow purple-striped cloak draped over a chair", icon:"centurio_tribunus.png" },
          b:{ id:"disciplina", nm:"Disciplina", desc:"Testudo heelt +3 meer (3 → 6) en geeft +2 schild extra.", glyph:"▦",
              fx:{ type:"ability_mod", ability:"testudo", heal:3, shld:2 },
              iconSubject:"a perfect square formation of shields seen from above (testudo)", icon:"centurio_disciplina.png" } },
        { star:8,
          a:{ id:"signum", nm:"Signum", desc:"De drempel van Signifer en Tribunus zakt van 60% naar 50%.", glyph:"⚐",
              fx:{ type:"team_accuracy_threshold", minAcc:0.50, nodes:["signifer","tribunus"] },
              iconSubject:"a square red military banner (vexillum) hanging from a crossbar", icon:"centurio_signum.png" },
          b:{ id:"triarii", nm:"Triarii", desc:"Antwoordde minder dan de helft van je team vorige ronde goed, dan doet je actie deze ronde +2 (het laatste bolwerk houdt stand).", glyph:"⛨",
              fx:{ type:"team_low_accuracy_bonus", maxAcc:0.5, val:2 },
              iconSubject:"a kneeling veteran soldier with a long spear braced against the ground", icon:"centurio_triarii.png" } },
        { star:9,
          a:{ id:"imperium", nm:"Imperium", desc:"Al je Moreel-bonussen (schild en heling) +1.", glyph:"♛",
              fx:{ type:"team_accuracy_bonus_add", add:1 },
              iconSubject:"a bundle of rods with an axe (fasces) tied with red leather straps", icon:"centurio_imperium.png" },
          b:{ id:"gloria", nm:"Gloria", desc:"Aquila geldt al als ≥90% van je team goed antwoordde.", glyph:"✶",
              fx:{ type:"team_full_accuracy_threshold", minAcc:0.90, node:"aquila" },
              iconSubject:"a golden eagle surrounded by shining rays of light", icon:"centurio_gloria.png" } },
      ],
    },

    prestige: [
      { id:"annona", nm:"Annona", cost:13, path:"A",
        desc:"Graanvoorziening van Rome: iedereen in je team +3 AP, de teamgenoten met de minste AP +2 extra, en je leger heelt +6.", glyph:"⌂",
        fx:{ type:"team_be_heal", teamBE:3, lowestExtra:2, heal:6 },
        iconSubject:"a cargo ship full of grain sacks with a sheaf of wheat on its sail", icon:"centurio_annona.png" },
      { id:"triumphus", nm:"Triumphus", cost:13, path:"B",
        desc:"Schild +10, heling +6 en team +3 AP; schild en heling krijgen +1 per 10% van het team boven 50% dat vorige ronde goed antwoordde (max. +5).", glyph:"♛",
        fx:{ type:"testudo", shld:10, heal:6, teamBE:3, accuracyBonusPer10:1, accuracyBonusMax:5 },
        iconSubject:"a golden four-horse triumphal chariot seen from the front, a laurel wreath above it", icon:"centurio_triumphus.png" },
    ],
  },

  // ---- GENIE: Belegeraar (werktuigen die blijven vuren) vs Vestingbouwer (verdediging die blijft staan) ----
  // Probleem dat beide paden oplossen: schild geldt in de engine maar één ronde, en
  // schild weghalen werkt alleen op het schild dat de tegenstander in dezelfde ronde
  // zet. Tegen een baas/garnizoen (geen schildveld) deed de Genie-kern dus niets.
  // Nieuwe mechanismen (state die over rondes meegaat, zoals het Labyrinth-schild):
  // - WERKTUIG: max. 1 per speler tegelijk (een nieuw vervangt het oude); vuurt
  //   alleen in rondes waarin de Genie zelf goed antwoordde.
  // - MUUR (besluit 2026-10-05, na balanstest): GEEN schild maar een eigen HP-balk
  //   (steenkleur; blauw blijft voor echt schild). Volgorde: rondeschild → muur →
  //   leger. Vangt ook baasklappen en de Cycloop-maaltijd op (schild kan dat niet),
  //   maar telt NIET mee voor het schild dat nodig is tegen de Cycloop-maaltijd of
  //   de Minotaurus-Enrage — zet dat in de melding ("jullie muur telt niet mee:
  //   die vangt alleen klappen op"). Brokkelt niet vanzelf af: verliest alleen HP
  //   door klappen en door SABOTAGE van een vijandelijke Saboteur (Verkenner,
  //   knoop Ondermijnen) — gewone schildsloop van andere klassen raakt alleen het
  //   schild van die ronde, niet de muur of werktuigen. Plafond per team: 12 HP.
  //   Palissade-sprite-stadia volgen de muur-balk (zie hieronder).
  // sprite: bestaande Total War-sprite (assets/bosses/), klein achter het eigen leger.
  // WAL IN BEELD (besluit 2026-10-05): geen palissade achter het leger, maar een
  //   palissade die van achter naar voren TUSSEN de legers loopt (nieuwe sprite,
  //   assets/bosses/palissade_midden_1.png (heel), _2 (beschadigd), _3 (bijna verwoest); prompts in het ontwerpgesprek).
  //   - Beide teams kunnen een muur hebben → dan staan er twee in beeld: elk iets
  //     naar het eigen team toe geschoven, die van team B horizontaal gespiegeld.
  //   - Afbrokkelen zichtbaar via drie sprites (heel / beschadigd / bijna
  //     verwoest), gekozen op de huidige muur-HP t.o.v. de hoogste stand die deze muur
  //     dit gevecht had: >2/3 heel, 1/3–2/3 beschadigd, <1/3 bijna verwoest,
  //     0 → weg. Gerben laat de twee extra stadia maken zodra de basis-sprite goed is.
  //   - Plaatsing (goedgekeurd in het nagebootste gevechtsscherm): hoogte ±36% van
  //     #bmField, onderkant op 2,5% van de veldhoogte, midden op ±22% van de
  //     ruimte tussen de twee opstellingen (vanaf het midden, naar het eigen team).
  //   - Werktuigen (catapult/ram/siegetower) en forten blijven klein achter het
  //     eigen leger, zoals getoond in het nagebootste gevechtsscherm.
  //   - Kijkrichting van de sprites: catapult.png gooit naar LINKS (moet voor team
  //     A gespiegeld worden); ram.png en siegetower.png kijken al naar RECHTS.
  //     Voor team B dus andersom.
  //   - Tijdens een Total War-belegering staat #bmSiegeWeapon al links achter de
  //     klas: Genie-objecten wijken daar uit.
  genie: {
    classId: "genie",
    nm: "Genie", color:"#C87533", colorNm:"burnt copper",
    paths: {
      A: { nm:"Belegeraar",    accent:"#e2783a", accentNm:"fiery siege orange", desc:"Bouwt werktuigen die rondes lang blijven vuren, en breekt elke vesting." },
      H: { nm:"Architect",     accent:"#d4af37", accentNm:"warm gold",          desc:"Hybride: bouwt aan beide kanten van de muur, beide met mate." },
      B: { nm:"Vestingbouwer", accent:"#9fb7a0", accentNm:"sage stone grey-green", desc:"Bouwt een muur met eigen HP die klappen opvangt, en vallen voor wie hem wil bestormen." },
    },
    root: { nm:"Genie", desc:"Passief: je aanvallen halen ook 2 vijandelijk schild weg.", glyph:"⚙",
            iconSubject:"a bronze gear wheel with a compass and a builder's square crossed over it",
            icon:"genie_root.png" },
    master: { star:5, nm:"Meester", desc:"Meesterpassief: je aanvallen halen 3 vijandelijk schild weg (in plaats van 2).", glyph:"✦",
              iconSubject:"a golden laurel wreath around a bronze gear wheel",
              icon:"genie_meester.png" },

    identity: [
      { star:1,
        A:{ id:"katapult_bouwen", nm:"Katapult Bouwen", desc:"Katapult zet ook een katapult neer: die doet de 2 rondes erna elk +2 schade, in rondes waarin jij goed antwoordt.", glyph:"⚒",
            fx:{ type:"ability_mod", ability:"katapult", engine:{ dmg:2, rounds:2, sprite:"assets/bosses/catapult.png" } },
            iconSubject:"a small wooden catapult (onager) with its throwing arm pulled back", icon:"genie_katapult_bouwen.png" },
        B:{ id:"palissade", nm:"Palissade", desc:"Veldreparatie bouwt ook een muur van +3 HP die klappen opvangt (eigen HP-balk, telt niet als schild).", glyph:"⩚",
            fx:{ type:"ability_mod", ability:"veldreparatie", wall:{ shld:3, sprite:"assets/bosses/Palissade.png" } },
            iconSubject:"a row of sharpened wooden stakes forming a palisade wall", icon:"genie_palissade.png" } },
      { star:2,
        A:{ id:"omslaan", nm:"Omslaan", desc:"Haalt een vaardigheid van jou schild weg terwijl de vijand geen schild heeft, dan wordt de helft daarvan schade (niet bij je passief).", glyph:"⇄",
            fx:{ type:"shld_remove_to_dmg", frac:0.5 },
            iconSubject:"a cracked shield turning into a burst of flying stone fragments", icon:"genie_omslaan.png" },
        B:{ id:"gegraven_greppel", nm:"Gegraven Greppel", desc:"Valgreppel bouwt ook +2 muur-HP voor je team.", glyph:"⌴",
            fx:{ type:"ability_mod", ability:"valgreppel", wall:{ shld:2 } },
            iconSubject:"a freshly dug defensive ditch with a pile of earth behind it", icon:"genie_gegraven_greppel.png" } },
      { star:3,
        A:{ id:"belegeringskunde", nm:"Belegeringskunde", desc:"Je aanvallen doen +2 tegen vestingen: het Labyrinth-schild, een Total War-garnizoen of een vijandelijke muur.", glyph:"♜",
            fx:{ type:"vs_fortification_dmg", val:2 },
            iconSubject:"a scroll with a drawn plan of a fortress wall and a pointing stylus", icon:"genie_belegeringskunde.png" },
        B:{ id:"stevige_fundering", nm:"Stevige Fundering", desc:"Veldreparatie herstelt ook 2 HP van je muur.", glyph:"▭",
            fx:{ type:"wall_repair_ability", ability:"veldreparatie", val:2 },
            iconSubject:"large square foundation stones stacked in a solid base", icon:"genie_stevige_fundering.png" } },
      { star:4,
        A:{ id:"vuurpotten", nm:"Vuurpotten", desc:"Vuurtoren +2 schade per doel (9 → 11).", glyph:"♨",
            fx:{ type:"ability_mod", ability:"vuurtoren", dmg:2 },
            iconSubject:"a clay pot with burning oil flying through the air", icon:"genie_vuurpotten.png" },
        B:{ id:"valkuil", nm:"Valkuil", desc:"Valstrik zet ook een val: de eerste 3 schade van de volgende vijandelijke aanval op je team worden opgevangen.", glyph:"⊔",
            fx:{ type:"ability_mod", ability:"valstrik", trap:3 },
            iconSubject:"a covered pit trap with sharpened stakes visible at the bottom", icon:"genie_valkuil.png" } },
    ],

    pathNodes: {
      A: [
        { star:6,
          a:{ id:"stormram", nm:"Stormram", desc:"Je werktuig haalt elke ronde ook 2 vijandelijk schild weg.", glyph:"⊳",
              fx:{ type:"engine_shld_remove", val:2, sprite:"assets/bosses/ram.png" },
              iconSubject:"a covered battering ram with a bronze ram's head on a wheeled frame", icon:"genie_stormram.png" },
          b:{ id:"lange_belegering", nm:"Lange Belegering", desc:"Je werktuig blijft 3 rondes staan in plaats van 2.", glyph:"⌛",
              fx:{ type:"engine_rounds", rounds:3 },
              iconSubject:"an hourglass standing next to a small wooden siege engine", icon:"genie_lange_belegering.png" } },
        { star:7,
          a:{ id:"belegeringstoren", nm:"Belegeringstoren", desc:"Zolang je werktuig staat, doen je eigen aanvallen +1.", glyph:"♖",
              fx:{ type:"engine_attack_bonus", val:1, sprite:"assets/bosses/siegetower.png" },
              iconSubject:"a tall wooden siege tower on wheels with a drawbridge at the top", icon:"genie_belegeringstoren.png" },
          b:{ id:"zware_stenen", nm:"Zware Stenen", desc:"Je werktuig doet +3 per ronde in plaats van +2.", glyph:"●",
              fx:{ type:"engine_dmg", dmg:3 },
              iconSubject:"a large round stone ball resting in the cup of a catapult arm", icon:"genie_zware_stenen.png" } },
        { star:8,
          a:{ id:"ballista", nm:"Ballista", desc:"Katapult +2 schade (5 → 7).", glyph:"➶",
              fx:{ type:"ability_mod", ability:"katapult", dmg:2 },
              iconSubject:"a large crossbow-like ballista loaded with a heavy bolt", icon:"genie_ballista.png" },
          b:{ id:"brandpijlen", nm:"Brandpijlen", desc:"Omslaan zet 75% van het weggehaalde schild om in schade (in plaats van de helft).", glyph:"⇢",
              fx:{ type:"shld_remove_to_dmg_frac", frac:0.75, node:"omslaan" },
              iconSubject:"three burning arrows striking a wooden wall", icon:"genie_brandpijlen.png" } },
        { star:9,
          a:{ id:"poliorketes", nm:"Poliorketes", desc:"Ook Vuurtoren zet een werktuig neer (vervangt je huidige).", glyph:"♛",
              fx:{ type:"ability_mod", ability:"vuurtoren", engine:{ dmg:2, rounds:2 } },
              iconSubject:"a crowned helmet above a row of three small siege engines", icon:"genie_poliorketes.png" },
          b:{ id:"muurbreker", nm:"Muurbreker", desc:"Belegeringskunde doet +4 in plaats van +2.", glyph:"⚒",
              fx:{ type:"vs_fortification_dmg_val", val:4, node:"belegeringskunde" },
              iconSubject:"a stone wall with a large hole smashed through its centre", icon:"genie_muurbreker.png" } },
      ],
      B: [
        { star:6,
          a:{ id:"stenen_muur", nm:"Stenen Muur", desc:"Palissade bouwt +5 muur-HP in plaats van +3.", glyph:"▦",
              fx:{ type:"wall_val", node:"palissade", shld:5, sprite:"assets/bosses/wall.png" },
              iconSubject:"a solid wall of cut stone blocks with a walkway on top", icon:"genie_stenen_muur.png" },
          b:{ id:"veldherstel", nm:"Veldherstel", desc:"Veldreparatie heelt +2 meer (3 → 5).", glyph:"✚",
              fx:{ type:"ability_mod", ability:"veldreparatie", heal:2 },
              iconSubject:"a hammer and a roll of bandage lying on a wooden plank", icon:"genie_veldherstel.png" } },
        { star:7,
          a:{ id:"wachttoren", nm:"Wachttoren", desc:"Vijandelijke schildsloop raakt je muur maar half.", glyph:"♖",
              fx:{ type:"wall_shld_remove_resist", frac:0.5, sprite:"assets/bosses/watchtower.png" },
              iconSubject:"a wooden watchtower with a small roof and a lookout platform", icon:"genie_wachttoren.png" },
          b:{ id:"snelbouw", nm:"Snelbouw", desc:"Veldreparatie kost 3 AP in plaats van 4.", glyph:"⚡",
              fx:{ type:"ability_mod", ability:"veldreparatie", cost:-1 },
              iconSubject:"a builder's hammer striking a wooden beam with motion lines", icon:"genie_snelbouw.png" } },
        { star:8,
          a:{ id:"vesting", nm:"Vesting", desc:"Je muur herstelt 1 HP in elke ronde waarin jij goed antwoordt.", glyph:"⛫",
              fx:{ type:"wall_regen_on_correct", val:1 },
              iconSubject:"a small square stone fort with four corner towers seen from above", icon:"genie_vesting.png" },
          b:{ id:"dubbele_gracht", nm:"Dubbele Gracht", desc:"Valkuil vangt 5 schade op in plaats van 3.", glyph:"≡",
              fx:{ type:"trap_val", val:5, node:"valkuil" },
              iconSubject:"two parallel water-filled ditches in front of an earth wall", icon:"genie_dubbele_gracht.png" } },
        { star:9,
          a:{ id:"castra", nm:"Castra", desc:"Het muur-plafond van je team gaat van 12 naar 16 HP.", glyph:"⌂",
              fx:{ type:"wall_team_cap", cap:16 },
              iconSubject:"a rectangular Roman army camp with a wooden palisade and four gates, seen from above", icon:"genie_castra.png" },
          b:{ id:"muur_van_hadrianus", nm:"Muur van Hadrianus", desc:"Ving je muur deze ronde alle vijandelijke schade op, dan herstelt hij 2 HP.", glyph:"▬",
              fx:{ type:"wall_repair_on_full_block", val:2 },
              iconSubject:"a long stone wall winding over green hills", icon:"genie_muur_van_hadrianus.png" } },
      ],
    },

    prestige: [
      { id:"archimedes", nm:"Spiegels van Archimedes", cost:13, path:"A",
        desc:"Brandende stralen op alle doelen: +14 elk en schild −8; het vuur brandt nog 2 rondes door (+4 per ronde per doel).", glyph:"☀",
        fx:{ type:"attack_siege", dmg:14, shldRemove:8, aoe:true, burn:{ dmg:4, rounds:2 } },
        iconSubject:"large curved bronze mirrors focusing a beam of sunlight onto a burning ship", icon:"genie_archimedes.png" },
      { id:"muren_van_syracuse", nm:"Muren van Syracuse", cost:13, path:"B",
        desc:"Schild +8 voor je team, én +10 muur-HP; je leger heelt +4.", glyph:"⛫",
        fx:{ type:"shield_and_heal", shld:8, heal:4, wall:{ shld:10, sprite:"assets/bosses/wall.png" } },
        iconSubject:"high stone city walls above the sea with strange wooden cranes on top", icon:"genie_muren_van_syracuse.png" },
    ],
  },

  // ---- VERKENNER: Saboteur (afbreken wat blijft staan) vs Guerrillastrijder (sterker bij achterstand) ----
  // Saboteur ≠ Genie: zijn sabotage WERKT DOOR naar de volgende ronde (Ondermijnen),
  // zodat hij ook iets doet tegen een tegenstander zonder blijvende verdediging.
  // Achterstand = relatief (eigen leger-% t.o.v. vijand-%; in Boss Battle klas-HP%
  // t.o.v. baas-HP%), net als Met je Schild of erop — altijd met een harde bovengrens.
  // Verkenningsrapport (hint in de vraag) werkt alleen als de docent dat hulpmiddel
  // aanzet; anders levert het +1 AP op.
  verkenner: {
    classId: "verkenner",
    nm: "Verkenner", color:"#2D8B7A", colorNm:"deep forest teal",
    paths: {
      A: { nm:"Saboteur",          accent:"#d0603e", accentNm:"smouldering ember red", desc:"Breekt af wat blijft staan: muren, vallen, werktuigen en vestingen." },
      H: { nm:"Speculator",        accent:"#d4af37", accentNm:"warm gold",             desc:"Hybride: de Romeinse verkenner en spion, ondermijnt én valt aan, beide met mate." },
      B: { nm:"Guerrillastrijder", accent:"#5e9e4f", accentNm:"deep forest green",     desc:"Het Teutoburgerwoud: hoe groter de achterstand, hoe harder de hinderlaag." },
    },
    root: { nm:"Verkenner", desc:"Passief: basisvaardigheden kosten 1 AP minder (min. 1).", glyph:"⌖",
            iconSubject:"a hooded scout's eye peering through tall grass, seen from the front",
            icon:"verkenner_root.png" },
    master: { star:5, nm:"Meester", desc:"Meesterpassief: ook mediumvaardigheden kosten 1 AP minder.", glyph:"✦",
              iconSubject:"a golden laurel wreath around a scout's hooded cloak clasp",
              icon:"verkenner_meester.png" },

    identity: [
      { star:1,
        A:{ id:"ondermijnen", nm:"Ondermijnen", desc:"Je sabotage werkt in lagen door: eerst op het schild van de tegenstander, dan op zijn muur, dan op zijn werktuigen (elke 3 punten = 1 ronde korter); wat overblijft werkt de volgende ronde nog. Verkenning, Sabotage en Ontwapenen doen +3 schade, en Sabotage kost 3 AP.", glyph:"⤵",
            fx:{ type:"sabotage_layers", linger:1, enginePer:3, sabotageDmg:3, sabotageAbilities:["verkenning","sabotage","ontwapenen"], sabotageCost:-1 },
            iconSubject:"a small shovel digging a tunnel underneath a stone wall", icon:"verkenner_ondermijnen.png" },
        B:{ id:"hinderlaagtactiek", nm:"Hinderlaagtactiek", desc:"Staat je leger er (in %) slechter voor dan de vijand, dan doen je aanvallen +1 per 15% achterstand (max. +4), en krijg je +1 AP per ronde (binnen het rondeplafond).", glyph:"♣",
            fx:{ type:"behind_attack_bonus", per:0.15, val:1, max:4, behindSelfBE:1 },
            iconSubject:"a spear point sticking out from dense dark green bushes", icon:"verkenner_hinderlaagtactiek.png" } },
      { star:2,
        A:{ id:"brandstichter", nm:"Brandstichter", desc:"+3 tegen alles wat blijft staan: muur, werktuig, val, Labyrinth-schild of garnizoen.", glyph:"♨",
            fx:{ type:"vs_persistent_dmg", val:3 },
            iconSubject:"a burning torch held against a wooden palisade", icon:"verkenner_brandstichter.png" },
        B:{ id:"lichtbepakt", nm:"Lichtbepakt", desc:"Sluipaanval +3 schade.", glyph:"↗",
            fx:{ type:"ability_mod", ability:"sluipaanval", dmg:3 },
            iconSubject:"a light leather satchel and a short dagger lying on the ground", icon:"verkenner_lichtbepakt.png" } },
      { star:3,
        A:{ id:"ondergraven", nm:"Ondergraven", desc:"Sabotage haalt 8 schild weg in plaats van 6.", glyph:"⛏",
            fx:{ type:"ability_mod", ability:"sabotage", shldRemove:2 },
            iconSubject:"a pickaxe stuck in the cracked foundation stones of a wall", icon:"verkenner_ondergraven.png" },
        B:{ id:"op_de_loer", nm:"Op de Loer", desc:"Een ronde waarin je geen AP uitgeeft, levert +2 AP extra op (max. 2 rondes achter elkaar, binnen het rondeplafond).", glyph:"◔",
            fx:{ type:"idle_self_be", val:2, maxRounds:2 },
            iconSubject:"a pair of watchful eyes glowing between dark leaves", icon:"verkenner_op_de_loer.png" } },
      { star:4,
        A:{ id:"doorgesneden_riemen", nm:"Doorgesneden Riemen", desc:"Ontwapenen +2 schade tegen een doel zonder schild.", glyph:"✂",
            fx:{ type:"ability_mod", ability:"ontwapenen", noShieldDmg:2 },
            iconSubject:"a knife cutting through the leather strap of a shield", icon:"verkenner_doorgesneden_riemen.png" },
        B:{ id:"woudkennis", nm:"Woudkennis", desc:"Hinderlaag kost 5 AP in plaats van 7, en breekt je reeks van Op de Loer niet (sparen én toeslaan).", glyph:"♠",
            fx:{ type:"ability_mod", ability:"hinderlaag", cost:-2, keepIdleStreak:true },
            iconSubject:"a narrow hidden path winding between tall dark forest trees", icon:"verkenner_woudkennis.png" } },
    ],

    pathNodes: {
      A: [
        { star:6,
          a:{ id:"vuur_in_de_voorraad", nm:"Vuur in de Voorraad", desc:"Een vijandelijk werktuig dat je sabotage bereikt, is meteen vernietigd.", glyph:"✹",
              fx:{ type:"sabotage_engine_destroy" },
              iconSubject:"a burning wooden siege engine wheel with small flames", icon:"verkenner_vuur_in_de_voorraad.png" },
          b:{ id:"lange_lont", nm:"Lange Lont", desc:"Ondermijnen werkt twee rondes door in plaats van één.", glyph:"〰",
              fx:{ type:"shld_remove_linger_rounds", rounds:2, node:"ondermijnen" },
              iconSubject:"a long burning fuse cord snaking toward a small clay pot", icon:"verkenner_lange_lont.png" } },
        { star:7,
          a:{ id:"gaten_in_de_muur", nm:"Gaten in de Muur", desc:"Brandstichter doet +5 in plaats van +3.", glyph:"▥",
              fx:{ type:"vs_persistent_dmg_val", val:5, node:"brandstichter" },
              iconSubject:"a wooden palisade with a large burnt hole through it", icon:"verkenner_gaten_in_de_muur.png" },
          b:{ id:"valstrikken_ontmantelen", nm:"Valstrikken Ontmantelen", desc:"Een vijandelijke val die jij raakt, verdwijnt meteen, en je aanval doet +2.", glyph:"⊗",
              fx:{ type:"vs_trap_disarm", dmg:2 },
              iconSubject:"hands lifting the cover off a pit trap with sharpened stakes", icon:"verkenner_valstrikken_ontmantelen.png" } },
        { star:8,
          a:{ id:"scherpe_ogen", nm:"Scherpe Ogen", desc:"Verkenning haalt 4 schild weg in plaats van 2.", glyph:"◉",
              fx:{ type:"ability_mod", ability:"verkenning", shldRemove:2 },
              iconSubject:"a hawk's eye looking through a gap in a wooden wall", icon:"verkenner_scherpe_ogen.png" },
          b:{ id:"infiltrant", nm:"Infiltrant", desc:"Sabotage doet ook +3 schade.", glyph:"☍",
              fx:{ type:"ability_mod", ability:"sabotage", dmg:3 },
              iconSubject:"a hooded figure slipping through an open gate at night", icon:"verkenner_infiltrant.png" } },
        { star:9,
          a:{ id:"verschroeide_aarde", nm:"Verschroeide Aarde", desc:"Jouw aanvallen doen dubbele schade aan een vijandelijke muur.", glyph:"♒",
              fx:{ type:"vs_wall_dmg_mult", mult:2 },
              iconSubject:"scorched black earth with smoking remains of wooden stakes", icon:"verkenner_verschroeide_aarde.png" },
          b:{ id:"dubbelspel", nm:"Dubbelspel", desc:"Saboteer je terwijl de vijand deze ronde schild zet, dan krijg je +2 AP (binnen het rondeplafond).", glyph:"⚇",
              fx:{ type:"sabotage_vs_shield_self_be", val:2 },
              iconSubject:"a two-faced mask, one side smiling and one side frowning", icon:"verkenner_dubbelspel.png" } },
      ],
      B: [
        { star:6,
          a:{ id:"uit_het_struikgewas", nm:"Uit het Struikgewas", desc:"Het maximum van Hinderlaagtactiek gaat van +4 naar +6.", glyph:"♣",
              fx:{ type:"behind_attack_max", max:6, node:"hinderlaagtactiek" },
              iconSubject:"several spear points bursting out of thick bushes at once", icon:"verkenner_uit_het_struikgewas.png" },
          b:{ id:"verkenningsrapport", nm:"Verkenningsrapport", desc:"Eén keer per gevecht valt in je vraag één fout antwoord af (als de docent dit hulpmiddel aanzet; anders +1 AP).", glyph:"✉",
              fx:{ type:"once_remove_wrong_option", teacherToggle:true, fallbackSelfBE:1 },
              iconSubject:"a small rolled message with a wax seal tied to an arrow", icon:"verkenner_verkenningsrapport.png" } },
        { star:7,
          a:{ id:"toeslaan_en_verdwijnen", nm:"Toeslaan en Verdwijnen", desc:"Na een Hinderlaag krijgt je team de ronde erna +2 schild.", glyph:"↶",
              fx:{ type:"after_ability_team_shield", ability:"hinderlaag", shld:2, rounds:1 },
              iconSubject:"a cloaked figure vanishing into fog between trees", icon:"verkenner_toeslaan_en_verdwijnen.png" },
          b:{ id:"opgespaarde_woede", nm:"Opgespaarde Woede", desc:"Op de Loer telt tot 3 rondes achter elkaar.", glyph:"◕",
              fx:{ type:"idle_self_be_max", maxRounds:3, node:"op_de_loer" },
              iconSubject:"a coiled snake hiding under a rock, ready to strike", icon:"verkenner_opgespaarde_woede.png" } },
        { star:8,
          a:{ id:"arminius", nm:"Arminius", desc:"Hinderlaag +3 schade.", glyph:"♚",
              fx:{ type:"ability_mod", ability:"hinderlaag", dmg:3 },
              iconSubject:"a Germanic chieftain's horned helmet resting on a round wooden shield", icon:"verkenner_arminius.png" },
          b:{ id:"kleine_steken", nm:"Kleine Steken", desc:"Verkenning +2 schade.", glyph:"⋰",
              fx:{ type:"ability_mod", ability:"verkenning", dmg:2 },
              iconSubject:"three small daggers stuck in a wooden post", icon:"verkenner_kleine_steken.png" } },
        { star:9,
          a:{ id:"woudgeest", nm:"Woudgeest", desc:"Sta je achter, dan kost Hinderlaag 1 AP minder (min. 5).", glyph:"☘",
              fx:{ type:"behind_ability_cost", ability:"hinderlaag", cost:-1, min:5 },
              iconSubject:"a ghostly green mask made of leaves floating in a dark forest", icon:"verkenner_woudgeest.png" },
          b:{ id:"varus_ondergang", nm:"Varus' Ondergang", desc:"Sta je achter en vallen ≥2 teamgenoten deze ronde ook aan, dan Hinderlaag +4.", glyph:"⚑",
              fx:{ type:"behind_ally_attack_bonus", ability:"hinderlaag", minAllies:2, dmg:4 },
              iconSubject:"a fallen Roman eagle standard lying in the mud of a forest", icon:"verkenner_varus_ondergang.png" } },
      ],
    },

    prestige: [
      { id:"grote_sabotage", nm:"Grote Sabotage", cost:12, path:"A",
        desc:"Vernietigt alle muren, vallen en werktuigen van de vijand; aanval +10 en schild −10, dat de ronde erna nog doorwerkt.", glyph:"✹",
        fx:{ type:"attack_and_shld_remove", dmg:10, shldRemove:10, lingerRounds:1, destroyPersistent:true },
        iconSubject:"a collapsing burning wooden palisade with a lone hooded figure walking away", icon:"verkenner_grote_sabotage.png" },
      { id:"teutoburgerwoud", nm:"Teutoburgerwoud", cost:12, path:"B",
        desc:"Vernietigende hinderlaag: aanval +15 en schild +5 voor je team; de bonus van Hinderlaagtactiek telt hier dubbel.", glyph:"♣",
        fx:{ type:"attack_and_defend", dmg:15, shld:5, behindMult:2 },
        iconSubject:"a dark dense forest with many spear points hidden among the trees, a Roman eagle in the foreground", icon:"verkenner_teutoburgerwoud.png" },
    ],
  },
};

// Pad bepalen uit de vier identiteitskeuzes ({1:"A",2:"B",...}).
// null zolang niet alle vier gekozen zijn.
function skilltreePathOf(picks){
  const v=[1,2,3,4].map(s=>picks&&picks[s]);
  if(v.some(x=>x!=="A"&&x!=="B")) return null;
  const a=v.filter(x=>x==="A").length;
  return a>=3?"A":a<=1?"B":"H";
}

// Opties per ster van ★6–9 voor een gegeven pad.
function skilltreeOptionsFor(tree,path,star){
  const row=p=>tree.pathNodes[p].find(r=>r.star===star);
  if(path==="A"||path==="B"){ const r=row(path); return r?[r.a,r.b]:[]; }
  if(path==="H"){ const ra=row("A"), rb=row("B"); return [ra&&ra.a, rb&&rb.a].filter(Boolean); }
  return [];
}
