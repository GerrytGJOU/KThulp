/* Bouwt een volledige setting uit een compacte "spec" (voor de settings die als JSON zijn aangeleverd met veel herhalende stukken: regio-overzicht met
   reisverbindingen, campagnehaakjes, species- en class-lijsten, instellingen, geoCheck, inspiratie). Alle herhalende teksten komen uit dezelfde gegevens,
   zodat ze nooit uit de pas lopen. Eén bestand voor browser (window.DNDSettingsSpec) en Node. Geen geheimen. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory(require("./settings-factory.js"));
  else root.DNDSettingsSpec = factory(root.DNDSettingsFactory);
})(typeof self !== "undefined" ? self : this, function (F) {
  "use strict";
  const NL = String.fromCharCode(10);
  function build(sp) {
    const NAME = sp.name, BLURB = sp.blurb, SRC = sp.source, MAGIC = sp.magic, LIMITS = sp.limits, REG = sp.regions, TR = sp.travel;
    const regName = id => (REG.find(r => r[0] === id) || [])[1];
    const cut = d => { const i = d.indexOf(";"); return i >= 0 ? d.slice(0, i) : d.replace(/\.$/, ""); };
    const conns = id => Object.keys(TR).filter(k => k.split("|").indexOf(id) >= 0).map(k => { const p = k.split("|"), o = p[0] === id ? p[1] : p[0]; return o + " (" + TR[k] + " dagen)"; }).join(", ");
    const speciesTxt = (label, key) => label + " is een speelbare interpretatie in " + NAME + ". Kies een concrete herkomst, familie of gemeenschap; uiterlijk en maatschappelijke positie volgen de lokale lore. De mechanische species is " + key + "; afwijkende lore verandert geen regels zonder DM-akkoord.";
    const classTxt = role => role + ". Gebruik de officiële class features en spells; beschrijf hun werking in de cultuur en magische tradities van " + NAME + ". De achtergrond bepaalt opleiding, relaties en reputatie; de class alleen verleent geen rang of toegang tot een factie.";
    const species = {}; Object.keys(sp.species).forEach(k => { const s = sp.species[k]; species[k] = { label: s.label, speed: s.speed, size: s.size, traits: s.traits, tolk: speciesTxt(s.label, k) + (s.extra ? " " + s.extra : "") }; });
    const classTolk = {}; Object.keys(sp.classes).forEach(k => { classTolk[k] = classTxt(sp.classes[k]); });
    const insp = sp.inspiration.map(x => x[0] + " · " + x[1] + " — " + x[2] + " · " + x[3] + ": afkomstig uit " + regName(x[4]) + ", met een oude verplichting aan een lokale gemeenschap en een reden om nu te vertrekken.");
    const dt = "1 september " + sp.year;
    const S1 = ["# S1 De wereld", "", "## 1. Uitgangspunt", BLURB, "", "Bronhiërarchie: " + SRC + ". " + LIMITS, "", "## 2. Regio’s en plaatsen",
      REG.map(r => "### " + r[0] + " — " + r[1] + NL + r[2] + NL + "Reisverbindingen: " + conns(r[0])).join(NL + NL), "",
      "## 3. Facties", sp.factions.map(f => "- **" + f[0] + "** — " + f[1]).join(NL), "",
      "## 4. Tijd, taal en economie",
      "App-start: " + dt + ". App gebruikt gewone maandnamen; dit is een technische kalenderconventie. Common: " + sp.common + ". Andere talen: " + sp.langs.join(", ") + ". Beloningen: " + sp.loot + ". Mechanisch blijven gp/sp/cp gelden; lokale muntnamen zijn flavor tenzij anders afgesproken.", "",
      "## 5. Reizen en dagelijks leven", "Reis via wegen, havens en passen; voedsel, onderdak, tol, weer en grenscontrole kunnen relevant zijn. Een route is geen garantie op toegang. Laat lokale ambachten, voedsel en sociale gewoonten uit de regio blijken.", "",
      "## 6. Campagnehaakjes [N]",
      REG.map(r => "- " + r[1] + ": een lokale opdrachtgever zoekt hulp bij een conflict rond " + cut(r[2]) + ". Bepaal betrokken partijen en minstens twee mogelijke oplossingen; geen vooraf vastgelegde schuldige.").join(NL)].join(NL);
    const S2 = ["# S2 Magie, machten en geloof", "", "## 1. Bronnen", MAGIC, "", "## 2. Grenzen", LIMITS, "",
      "## 3. Spelmechaniek", "Gebruik spell slots, components, concentration en officiële spell effects. Flavor verandert geen damage, bereik of action economy. Geen automatische toegang tot unieke artefacten, goddelijke gunsten of extra spells. Religieuze en politieke reputatie wordt narratief gelogd; geen piety-mechaniek tenzij expliciet afgesproken.", "",
      "## 4. Instellingen en toegang", sp.factions.map(f => "- " + f[0] + ": " + f[1] + " Toegang tot hulp vereist een geloofwaardige relatie, afspraak of wederdienst.").join(NL), "",
      "## 5. Dood en herstel", "Gebruik officiële regels voor death saves en resurrection; de DM bepaalt vooraf of een zeldzame dienst in de fictie beschikbaar is. Geen gratis terugkeer door canonfiguren. Geheimen over het hiernamaals zijn niet automatisch PC-kennis."].join(NL);
    const S3 = ["# S3 Volken, classes en vaste figuren", "", "## 1. Species", Object.keys(species).map(k => "- " + k + ": " + species[k].label + ". " + species[k].tolk).join(NL), "",
      "## 2. Classes", Object.keys(classTolk).map(k => "- " + k + ": " + classTolk[k]).join(NL), "",
      "## 3. Vaste figuren", sp.figures.map(f => "- **" + f[0] + "** — " + f[1]).join(NL), "",
      "## 4. Kennisgrenzen", "Deze lijst is een DM-referentie; verborgen informatie is niet automatisch bekend bij spelers. Controleer datum en bron vóór een ontmoeting. Maak geen duplicaten van vaste figuren."].join(NL);
    return {
      id: sp.id, name: NAME, version: 1, blurb: BLURB, world: { travel: TR, anchors: [] }, map: { enabled: false }, ui: { name: NAME },
      prompt: {
        world: NAME + "; " + BLURB,
        naming: "Gebruik originele eigennamen volgens " + SRC + ". Nieuwe namen passen bij lokale taal en cultuur; behoud spelling in worldDelta, location en newNpcs.",
        noOvershadow: "Vaste helden, goden en heersers lossen de missie niet op; ze hebben eigen doelen en beperkte beschikbaarheid.",
        bigFigure: "een ontmoeting met een vaste held, god of heerser",
        geoCheck: REG.map(r => r[0] + " = " + r[1] + ": " + r[2]).join("; "),
        exInGame: "{\"inGame\": {\"date\": \"" + dt + "\", \"timeOfDay\": \"ochtend\", \"location\": \"" + regName(sp.exRegA) + ", de hoofdstraat\"},",
        exPlace: "'" + regName(sp.exRegA) + ", de hoofdstraat'", exYear: String(sp.year), exRegA: sp.exRegA, exRegB: sp.exRegB,
        lootTone: sp.loot, lootNo: "Geen unieke wereldveranderende artefacten als willekeurige buit, geen gratis goddelijke macht of onsterfelijkheid.",
        bookFigures: "Volg " + SRC + "; respecteer de vaste figuren in S3 en hun kennisgrenzen.",
        idLegend: "FIG- vaste figuren uit de canon", noCreateFig: "Vaste figuren (FIG-) maak je niet aan", canonName: "een afwijking van de broncanon registreer je"
      },
      style: { base: sp.styleBase, portraitNote: "Follow written age, scars, hair, clothing and equipment; consistent character design, no actor likenesses.", locNote: "Follow region geography, period architecture and materials; no anachronisms.", avoid: "Avoid photorealism, cartoon, anime, 3D render, modern objects, text, captions, watermarks, logos, borders." },
      creator: {
        magicWorld: MAGIC, intro: "Nieuw personage in " + NAME + ". " + BLURB + " Start level 3, point buy 27, achtergrond volgens 2024. " + LIMITS,
        langsTip: "Je spreekt " + sp.common + " plus twee passende talen naar keuze.",
        bgNote: "Kies een concrete regio, beroep, relatie en reden om te reizen. Veranker je achtergrond in S1; een factielidmaatschap geeft geen automatische macht.",
        spellTip: MAGIC + " Gebruik officiële spells zonder mechanische wijziging.", magicTip: MAGIC, commonLang: sp.common,
        helperSys: "Je bent schrijfhulp voor D&D 2024 in " + NAME + ". Schrijf Nederlands met Engelse D&D-termen. Volg S1–S3 en " + SRC + ". Verzin geen spelregels; wijzig geen spelerfeiten; markeer aanvullingen met (voorstel).",
        species: species, lineage: { "High Elf": F.LINEAGE_STD["High Elf"], "Wood Elf": F.LINEAGE_STD["Wood Elf"], "Drow": F.LINEAGE_STD["Drow"] },
        langs: sp.langs.concat(["Common Sign Language"]).filter((x, i, a) => a.indexOf(x) === i), inspiration: insp,
        speciesTip: "Toegestaan: " + Object.keys(species).map(k => species[k].label).join(", ") + ". Oudere species volgens officiële versie met 2024-achtergrond; andere opties alleen na DM-akkoord.",
        aanleiding: "Aanleiding / startsituatie: welke plaats, opdracht, relatie of gebeurtenis brengt je bij de groep?", classTolk: classTolk
      },
      canonParts: {
        namingRule: "Gebruik originele eigennamen volgens " + SRC + ". Nieuwe namen passen bij lokale taal en cultuur; behoud spelling in worldDelta, location en newNpcs.",
        tone: BLURB + " Vertel in het Nederlands, met Engelse spelterminologie. Geef grote momenten ruimte, routine kort; humor komt uit personages. Telegrafeer gevaar en respecteer spelersagency.",
        settingRules: ["- D&D 5e 2024 (PHB, DMG, MM) is de mechanische basis. Oudere species alleen met DM-goedkeuring en ability scores uit achtergrond. Raadpleeg officiële volledige traits bij twijfel; samenvattingen zijn geen vervanging.",
          "- Start level 3, point buy 27, milestones; sociale en slimme oplossingen tellen even zwaar.", "- " + MAGIC, "- " + LIMITS,
          "- Spelers rollen zelf; DM toont bonus en echte NPC-worpen. Vraag type worp zonder DC tenzij inschatbaar. Huisregel: natural 20 geeft iets extra, natural 1 een complicatie, niet automatisch dood.",
          "- Geen retcons om PC's te redden; gevolgen loggen. Heroic Inspiration voor sterk rollenspel of slimme keuzes.",
          "- Beloningen: " + sp.loot + "; ook bij vermeden combat. Gebruik standaard 5e prijzen als mechanische referentie.",
          "- Reistijden zijn geschatte dagen tussen regiohubs, symmetrisch; weer, route, vervoer en grenzen wijzigen ze. Bijzondere toegang blijft vereist.",
          "- Vertelling Nederlands, termen Engels; eindig met situatie zonder keuzemenu. Vragen tussen haakjes kort buiten spel beantwoorden."].join(NL),
        premise: ["- Nieuwe campagne; DM kiest start op basis van alle backstories en legt deze vast in C1 en Stand. Geen verplichte hoofdplot uit bronmateriaal.",
          "- Elke PC krijgt gelijkwaardige persoonlijke verankering; facties handelen ook buiten beeld.",
          "- Grote obstakels hebben waar geloofwaardig een sociale, slimme en gewelddadige route. Log gevolgen en veranderende relaties.",
          "- Gebruik onderstaande facties als bronnen van conflicten, niet als vooraf vastgelegde vijanden."].join(NL),
        canonNpcs: ["- Respecteer vaste figuren, chronologie, locatie en kennisgrenzen. Zij lossen geen PC-missies op.", "- Geef belangrijke NPC’s een wil, waarde, angst en geheim; companions hebben grenzen.",
          "- [C] broncanon, [I] interpretatie, [N] nieuwe inhoud. Leg afwijkingen vast met datum, oorzaak en gevolgen. Campagneconventies zijn [I], niet broncanon."].join(NL),
        consistent: NAME + "; " + SRC
      },
      canon: {
        s1_wereld: { title: "S1 De wereld (publiek voor spelers en DM)", text: S1 },
        s2_goden: { title: "S2 Magie, machten en geloof (publiek voor spelers en DM)", text: S2, keywords: sp.kwS2 },
        s3_volken_en_helden: { title: "S3 Volken en vaste figuren (DM; publieke informatie selecteren)", text: S3, secret: true, keywords: sp.kwS3 }
      }
    };
  }
  return { build: build };
});
