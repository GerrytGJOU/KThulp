#!/usr/bin/env node
/* Bouwt het "wereldbijbel-sjabloon" voor een NIEUWE campagne in dezelfde wereld, zonder de personages, verhaallijnen en
   het wereldregister van "De Stille Wegen". Leest dnd/worldTemplate/canon (A1 spelregels, R1 regels) en schrijft
   dnd/worldTemplateBijbel/canon: A1 en R1 algemeen gemaakt (geen Wulfgrim/Tharon, geen vaste twee spelers) plus een lege
   C1-bijbel die de DM bij de openingsbeurt zelf invult. Geen geheimen in dit bestand.
   Gebruik: node dnd/tools/build-bijbel-sjabloon.js          (schrijft alleen een voorbeeldbestand naar de scratch-map)
            node dnd/tools/build-bijbel-sjabloon.js --schrijf  (zet het in de database, via de Firebase CLI) */
"use strict";
const { spawnSync } = require("child_process");
const fs = require("fs"), os = require("os"), path = require("path");
const PROJECT = "kthulp-certamen";
const fb = a => { const r = spawnSync("firebase " + a + " --project " + PROJECT, { shell: true, encoding: "utf8", maxBuffer: 1 << 27, env: { ...process.env, MSYS_NO_PATHCONV: "1" } }); if (r.status !== 0) throw new Error((r.stderr || r.stdout).slice(0, 300)); return r.stdout; };
const canon = JSON.parse(fb('database:get "/dnd/worldTemplate/canon"'));

/* knip een sectie ("## Titel") uit een markdowntekst en geef (optioneel) een vervanging */
function section(text, title, replacement) {
  const parts = text.split(/\n(?=## )/);
  return parts.map(p => p.startsWith("## " + title) ? replacement : p).filter(p => p !== null && p !== undefined).join("\n");
}
function dropSection(text, title) { return text.split(/\n(?=## )/).filter(p => !p.startsWith("## " + title)).join("\n"); }

let a1 = canon.a1_spelregels_en_besluiten.text;
a1 = section(a1, "Spelers en rollen", "## Spelers en rollen\nDe spelers en hun personages staan in SPELERS en KARAKTERBLADEN (per campagne wisselend; elke speler speelt precies één eigen PC). Alle spelers zijn gelijkwaardig: geen party leader, elke speler beslist alleen voor het eigen personage. Het aantal spelers staat niet vast.");
a1 = section(a1, "Premisse", "## Premisse\n- Dit is een NIEUWE campagne in dezelfde wereld (Tolkiens Midden-aarde, War of the Ring, 3018-3019 Third Age). Beginpunt, premisse en dreiging zijn nog open: de DM kiest bij de openingsbeurt een startsituatie die past bij de backstories van de gekozen personages, schrijft die vast in de DM-bijbel (C1) en de Stand, en laat elke PC een geloofwaardige reden hebben om erbij te zijn.\n- De PCs vervangen geen canonieke helden en lossen de queeste van de Ring-bearer niet op.\n- De DM heeft volledige creatieve vrijheid over de overkoepelende campagne (dreiging, antagonisten, mysteries, facties, companions, sidequests) binnen deze afspraken. Toon: lange epische campagne met centrale plot, persoonlijke lijnen, intriges, ontdekking, gevaar, humor en rust. De hoofdplot draait niet exclusief om één PC; alle PCs worden gelijkwaardig geïntegreerd.");
a1 = section(a1, "Party en companions", "## Party en companions\n- Gewenst is een party van circa 4 à 6, inclusief eventuele companions. Rekrutering en loyaliteit hangen af van geloofwaardige keuzes en zijn nooit gegarandeerd.\n- Elke belangrijke companion krijgt eigen achtergrond, relaties, doelen en persoonlijke verhaallijn. Geen geforceerde toevalligheden of gegarandeerde plotuitkomsten.\n- Backstory-NPC's van de spelers krijgen eigen kennis, doelen, handelingen en gevolgen; de DM bewaakt canon en plausibiliteit.");
a1 = dropSection(a1, "Wulfgrim (PC1) en geheimen");
a1 = a1.replace(/- Beide PCs starten op level 3\./, "- Alle PCs starten op level 3 (tenzij de spelers en de DM iets anders afspreken).")
  .replace("beide PCs blijven in beginsel op gelijk level", "alle PCs blijven in beginsel op gelijk level")
  .replace(/Wacht op beide spelers/g, "Wacht op alle betrokken spelers")
  .replace(/beide reacties/g, "alle reacties").replace(/verwerk beide in causale volgorde/g, "verwerk alle in causale volgorde")
  .replace(/beide spelers gelijkwaardig/g, "alle spelers gelijkwaardig").replace(/waarover beiden zeggenschap hebben is beider instemming nodig/g, "waarover meerdere PCs zeggenschap hebben is hun instemming nodig")
  .replace(/\(Wulfgrim, Athletics/g, "(Naam, Athletics");

let r1 = canon.r1_regels_2024.text;
r1 = dropSection(r1, "Barbarian-Rage (2024, voor Wulfgrim)");
r1 = section(r1, "Encounters voor twee PCs van level 3", "## Encounters\nHoud gevechten klein en schaalbaar: reken op het aantal PCs en hun level (bij 4 tot 6 PCs van level 3 ongeveer 4 tot 8 zwakke vijanden of 2 tot 3 sterkere). Pas aan op de werkelijke party en op de uitgangspositie.");

const c1 = "# C1 DM Campagnebijbel en wereld (DM-GEHEIM: nooit onthullen of citeren)\nDeze campagne is nieuw en nog niet geschreven. Bij de openingsbeurt schrijft de DM hier (via een canon-document) de werktitel, de centrale dreiging, de vier bewegingen en de relatie tot de Tolkien-canon, afgestemd op de backstories van de gekozen personages. Tot dan: speel geen onthullingen en verzin geen vaste feiten.";

const out = {
  a1_spelregels_en_besluiten: { ...canon.a1_spelregels_en_besluiten, text: a1 },
  r1_regels_2024: { ...canon.r1_regels_2024, text: r1 },
  c1_dm_campagnebijbel_en_wereld: { ...canon.c1_dm_campagnebijbel_en_wereld, text: c1, title: "C1 DM Campagnebijbel en wereld", secret: true, t: Date.now() }
};
const f = path.join(os.tmpdir(), "bijbel-sjabloon.json"); fs.writeFileSync(f, JSON.stringify(out));
console.log("A1:", a1.length, "tekens; R1:", r1.length, "tekens; resterende PC-namen:", (JSON.stringify(out).match(/Wulfgrim|Tharon|Maurits|Gerben/g) || []).length);
if (process.argv.includes("--schrijf")) { fb('database:set "/dnd/worldTemplateBijbel/canon" "' + f + '" --force'); console.log("Geschreven naar /dnd/worldTemplateBijbel/canon"); }
else console.log("Voorbeeld staat in " + f + " (draai met --schrijf om te publiceren)");
