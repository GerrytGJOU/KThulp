/* Editor voor settings (dnd/): bewerk of maak een setting in de app. Alleen browser. Gebruikt DNDSettings (validate) en geeft de gevalideerde setting
   terug aan de aanroeper (die kiest waar hij wordt opgeslagen: dnd/settings/{id} of de snapshot van een campagne).
   Gebruik: SettingsEditor.open(element, { setting, isNew, lockId, title, onSave(s), onCancel() }). Geen frameworks; iPad-veilig (gewone velden). */
(function (root) {
  "use strict";
  const esc = s => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const clone = o => JSON.parse(JSON.stringify(o));
  const getP = (o, p) => p.split(".").reduce((x, k) => (x == null ? undefined : x[k]), o);
  const setP = (o, p, v) => { const a = p.split("."), l = a.pop(); const t = a.reduce((x, k) => { if (!x[k] || typeof x[k] !== "object") x[k] = {}; return x[k]; }, o); t[l] = v; };

  /* [pad, label, soort, hint]; soorten: text, area, lines (een item per regel), json, travel (REG-A|REG-B = dagen per regel) */
  const SECTIONS = [
    { t: "Basis", f: [
      ["id", "ID (kleine letters, cijfers, - en _; niet meer te wijzigen na opslaan)", "text"],
      ["name", "Naam", "text"], ["blurb", "Korte omschrijving (voor de keuzelijst bij een nieuw verhaal)", "area"],
      ["prompt.world", "Wereld in de DM-prompt (komt in de zin \"campagne in …\")", "text"], ["ui.name", "Naam in titel, kop en meldingen", "text"]] },
    { t: "DM-prompt", f: [
      ["prompt.naming", "Regel voor eigennamen", "area"], ["prompt.noOvershadow", "Regel: vaste figuren overschaduwen de PC's niet", "text"],
      ["prompt.bigFigure", "Wanneer een groot moment naar Claude Code gaat (\"een ontmoeting met …\")", "text"], ["prompt.geoCheck", "Geografiecontrole (noem de regio's)", "area"],
      ["prompt.exInGame", "Voorbeeld van de Stand (JSON-begin met datum en locatie)", "area"], ["prompt.exPlace", "Voorbeeld van een plaatsnaam bij een side-quest (tussen enkele aanhalingstekens)", "text"],
      ["prompt.exYear", "Voorbeeldjaar (1 t/m 9999; dit is ook het jaar waarin de campagne begint)", "text"], ["prompt.exRegA", "Voorbeeldregio A (REG- en hoofdletters)", "text"], ["prompt.exRegB", "Voorbeeldregio B", "text"],
      ["prompt.lootTone", "Sfeer van de buit (\"passend bij …\")", "text"], ["prompt.lootNo", "Wat nooit als buit voorkomt", "text"],
      ["prompt.bookFigures", "Regel voor vaste figuren uit de canon (beschrijving)", "text"], ["prompt.idLegend", "Uitleg van het ID-voorvoegsel voor vaste figuren", "text"],
      ["prompt.noCreateFig", "Regel: vaste figuren maak je niet aan", "text"], ["prompt.canonName", "Zin over afwijkingen van de canon", "text"]] },
    { t: "Beeldstijl", f: [
      ["style.base", "Beeldstijl (Engels, voor portretten en locaties)", "area"], ["style.portraitNote", "Notitie bij portretten (Engels)", "text"],
      ["style.locNote", "Notitie bij locaties (Engels)", "text"], ["style.avoid", "Wat je vermijdt (begin met \"Avoid:\")", "area"]] },
    { t: "Wereld (reistijden)", f: [
      ["world.travel", "Reistijden in dagen, één per regel: REG-A|REG-B = dagen. Laat leeg voor vrij reizen. Elke regio moet minstens één verbinding hebben om gecontroleerd te worden.", "travel"]] },
    { t: "Creator (personages maken)", f: [
      ["creator.magicWorld", "Hoe magie heet in deze wereld (\"…(magie in X)\")", "text"], ["creator.intro", "Introtekst bij Wie wil je spelen?", "area"],
      ["creator.langsTip", "Tip bij talen", "area"], ["creator.commonLang", "Naam van de gemene taal", "text"], ["creator.bgNote", "Tip bij de background", "text"],
      ["creator.spellTip", "Tip bij spells", "text"], ["creator.magicTip", "Tip bij magische keuzes", "text"], ["creator.speciesTip", "Tip bij species", "text"],
      ["creator.aanleiding", "Vraag naar de aanleiding of startsituatie", "text"], ["creator.helperSys", "Prompt van de schrijfhulp (Gemini)", "area"],
      ["creator.langs", "Talen (één per regel)", "lines"], ["creator.inspiration", "Inspiratie voor personages (één per regel)", "lines"],
      ["creator.species", "Species (JSON: { \"Naam\": { \"label\", \"speed\", \"size\", \"tolk\", \"traits\": [[\"naam\", \"uitleg\"]] } })", "json"],
      ["creator.lineage", "Elf-lineages (JSON: { \"High Elf\": \"tekst\" }, mag leeg)", "json"],
      ["creator.classTolk", "Opmerking per class (JSON: { \"Wizard\": \"tekst\" }, mag leeg)", "json"]] },
    { t: "Canon", f: [
      ["canonParts.tone", "Toon van de campagne", "area"], ["canonParts.namingRule", "Regel voor eigennamen in het spelregeldocument (A1)", "area"],
      ["canonParts.settingRules", "Setting en regels (A1; regels beginnen met \"- \")", "area"], ["canonParts.premise", "Premisse (A1)", "area"],
      ["canonParts.canonNpcs", "Canon en vaste figuren (A1)", "area"], ["canonParts.consistent", "Zin bij Natural 20/1 (\"proportioneel, … \")", "text"],
      ["canon", "Canondocumenten van de setting (JSON: { \"s1_wereld\": { \"title\": \"…\", \"text\": \"…\" } })", "json"]] }
  ];

  function fieldHtml(s, f) {
    const [p, label, kind] = f; let v = getP(s, p), h = "";
    if (kind === "lines") v = Array.isArray(v) ? v.join("\n") : "";
    else if (kind === "json") v = JSON.stringify(v == null ? {} : v, null, 1);
    else if (kind === "travel") v = Object.entries(v || {}).map(([k, d]) => k + " = " + d).join("\n");
    else v = v == null ? "" : String(v);
    const big = kind === "area" || kind === "lines" || kind === "travel" || kind === "json";
    const rows = kind === "json" ? 10 : kind === "area" ? 3 : 5;
    h = big ? '<textarea data-p="' + esc(p) + '" data-k="' + kind + '" rows="' + rows + '" spellcheck="false"' + (kind === "json" ? ' style="font-family:monospace;font-size:12px"' : "") + ">" + esc(v) + "</textarea>"
            : '<input type="text" data-p="' + esc(p) + '" data-k="' + kind + '" value="' + esc(v) + '">';
    return '<label style="display:block;margin:8px 0"><small>' + esc(label) + "</small>" + h + "</label>";
  }

  function collect(box, base) {
    const s = clone(base), errs = [];
    box.querySelectorAll("[data-p]").forEach(el => {
      const p = el.dataset.p, kind = el.dataset.k; let v = el.value;
      if (kind === "lines") v = v.split("\n").map(x => x.trim()).filter(Boolean);
      else if (kind === "json") { try { v = JSON.parse(v.trim() || "{}"); } catch (e) { errs.push(p + ": geen geldige JSON (" + e.message + ")"); return; } }
      else if (kind === "travel") {
        const o = {}; v.split("\n").map(x => x.trim()).filter(Boolean).forEach(l => { const m = l.match(/^(REG-[A-Z]+\|REG-[A-Z]+)\s*=\s*(\d+)$/); if (m) o[m[1]] = Number(m[2]); else errs.push("reistijd-regel '" + l + "': gebruik REG-A|REG-B = dagen"); });
        v = o;
      } else v = v.trim();
      setP(s, p, v);
    });
    s.map = { enabled: false };
    if (!s.world) s.world = {}; if (!Array.isArray(s.world.anchors)) s.world.anchors = [];
    if (!s.ui || !s.ui.name) setP(s, "ui.name", s.name);
    return { s: s, errs: errs };
  }

  /* opdracht voor een AI-chat (Claude/ChatGPT): levert JSON op die je weer kunt importeren */
  function aiPrompt(brief, current) {
    return [
      "Je helpt me een setting te maken voor een D&D 5e (2024)-app (Nederlandstalig, spelers zien Nederlands; D&D-termen blijven Engels).",
      "Geef ALLEEN één geldig JSON-object terug (geen uitleg, geen codeblok) met exact dezelfde structuur en velden als het voorbeeld hieronder. Vul elk veld in en schrijf alle spelerzichtbare tekst in het Nederlands, de beeldstijl-velden (style.*) in het Engels.",
      "Regels: gebruik eigen samenvattingen in eigen woorden (geen letterlijke overname van uitgegeven tekst). Regio's zijn REG- gevolgd door hoofdletters zonder cijfers of streepjes (bv. REG-NOORD). world.travel bevat sleutels als \"REG-A|REG-B\" met een geheel aantal dagen reistijd; elke regio uit de canon moet erin voorkomen en alles moet verbonden zijn. prompt.exYear is een jaar van 1 t/m 9999 als tekst. Gebruik gewone maanden (januari t/m december) voor de kalender en leg in canon S1 uit hoe de tijdrekening van de wereld daarop past. De canondocumenten onder \"canon\" (sleutel in kleine letters/underscore) zijn publiek: geen DM-geheimen. creator.species heeft per species label, speed, size, tolk en traits (lijst van [naam, uitleg]); gebruik alleen species die in deze wereld passen. Laat id en map ongewijzigd.",
      "Mijn idee voor de setting: " + (brief || "(vul hier in)"),
      "Voorbeeld van de structuur (pas alles aan op mijn idee):",
      JSON.stringify(current)
    ].join("\n\n");
  }

  function open(box, opt) {
    const base = clone(opt.setting);
    box.innerHTML =
      '<div class="card"><b>' + esc(opt.title || "Setting bewerken") + '</b><div id="seerr" style="color:#e07a6b;font-size:13px;margin:6px 0;white-space:pre-wrap"></div>' +
      SECTIONS.map((sec, i) => '<details' + (i === 0 ? " open" : "") + ' style="margin:6px 0"><summary><b>' + esc(sec.t) + "</b></summary>" + sec.f.map(f => fieldHtml(base, f)).join("") + "</details>").join("") +
      '<details style="margin:6px 0"><summary><b>Delen, importeren en AI-hulp</b></summary>' +
      '<label style="display:block;margin:8px 0"><small>Wat voor setting wil je? (voor de AI-opdracht)</small><textarea id="sebrief" rows="3" placeholder="Bv. een piratenwereld met een gezonken tempelstad, laag-magisch, 1700-achtige sfeer"></textarea></label>' +
      '<div class="row"><button class="b alt sm" id="seai" type="button">🤖 Kopieer AI-opdracht</button><button class="b alt sm" id="seexp" type="button">⎘ Toon JSON</button><button class="b alt sm" id="seimp" type="button">⤓ Importeer JSON</button></div>' +
      '<textarea id="sejson" rows="8" spellcheck="false" style="font-family:monospace;font-size:12px;margin-top:6px" placeholder="Plak hier de JSON van een AI-chat of van een andere setting en kies Importeer JSON"></textarea></details>' +
      '<div class="row" style="margin-top:10px"><button class="b" id="sesave" type="button">✔ Opslaan</button><button class="b alt" id="secancel" type="button">Annuleren</button></div></div>';
    const q = s => box.querySelector(s), show = m => { q("#seerr").textContent = m || ""; };
    if (opt.lockId) { const i = box.querySelector('[data-p="id"]'); if (i) { i.disabled = true; } }
    const get = () => { const r = collect(box, base); if (opt.lockId) r.s.id = base.id; return r; };
    q("#sesave").onclick = () => {
      const r = get(), D = root.DNDSettings; const errs = r.errs.concat(r.errs.length ? [] : D.validate(r.s));
      if (opt.isNew && D.isBuiltin(r.s.id)) errs.push("id: deze id is van een ingebouwde setting");
      if (errs.length) { show("Nog niet opgeslagen:\n• " + errs.join("\n• ")); box.scrollIntoView(); return; }
      show(""); opt.onSave(r.s);
    };
    q("#secancel").onclick = () => opt.onCancel && opt.onCancel();
    q("#seai").onclick = async () => {
      const r = get(), text = aiPrompt(q("#sebrief").value.trim(), r.s); q("#sejson").value = text;
      try { await navigator.clipboard.writeText(text); show("AI-opdracht gekopieerd (ook in het veld hieronder). Plak hem in een AI-chat en importeer het resultaat."); }
      catch (e) { q("#sejson").select(); show("Kopiëren lukte niet automatisch: de opdracht staat in het veld hieronder, selecteer en kopieer hem."); }
    };
    q("#seexp").onclick = () => { q("#sejson").value = JSON.stringify(get().s, null, 1); show("JSON staat in het veld hieronder."); };
    q("#seimp").onclick = () => {
      let o; try { o = JSON.parse(q("#sejson").value.trim().replace(/^```(?:json)?\s*|\s*```$/g, "")); } catch (e) { show("Import mislukt: geen geldige JSON (" + e.message + ")"); return; }
      if (!o || typeof o !== "object" || Array.isArray(o)) { show("Import mislukt: verwacht een JSON-object."); return; }
      const keepId = opt.lockId ? base.id : (o.id || base.id); o.id = keepId; open(box, Object.assign({}, opt, { setting: Object.assign(clone(base), o) }));
      const m = box.querySelector("#seerr"); if (m) m.textContent = "Geïmporteerd: controleer de velden en kies Opslaan.";
    };
  }
  root.SettingsEditor = { open: open, aiPrompt: aiPrompt, SECTIONS: SECTIONS };
})(typeof self !== "undefined" ? self : this);
