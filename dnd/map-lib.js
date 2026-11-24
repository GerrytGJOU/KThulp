/* Kaartlaag voor de D&D-app (dnd/): bouwt uit een kaartdefinitie van een setting alles wat de Kaart-tab en de DM-tools nodig hebben
   (plaatsen koppelen aan locatienamen, bezoeken vastleggen, pins per kaart). Ondersteunt meerdere kaarten per setting (bv. wereld > streek > stad),
   met 'zoom' op een plaats naar een detailkaart. Eén bestand voor browser (window.DNDMapLib) en Node. Geen geheimen: alleen publieke kaartgegevens.

   Definitie (setting.map):
     { enabled: true, start: "id", maps: { id: { name, file, w, h, parent? } },
       places: [ { id, name, map, x, y, region?, alias: ["deelstring", ...], zoom?: "kaart-id", also?: { "kaart-id": [x, y] }, fictional? } ],
       regions: { "REG-X": { name, map, x, y, primary? } } }
   Coördinaten zijn pixels van het kaartbestand zoals in maps[id].w/h. Plaats-id's zijn uniek over alle kaarten van de setting;
   een plaats kan met 'also' op andere kaarten ook een pin krijgen. Midden-aarde gebruikt fromLegacy() op de gegevens van map-data.js. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.DNDMapLib = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  const lc = s => String(s == null ? "" : s).toLowerCase();

  function make(def) {
    if (!def || !def.maps || !Object.keys(def.maps).length) return null;
    const maps = {}; Object.keys(def.maps).forEach(k => { const m = def.maps[k]; maps[k] = Object.assign({ id: k, name: k }, m, { id: k }); });
    const mapIds = Object.keys(maps), start = maps[def.start] ? def.start : mapIds[0];
    const PLACES = (def.places || []).filter(p => p && p.id && maps[p.map]).map(p => Object.assign({ alias: [] }, p));
    const byId = {}; PLACES.forEach(p => { byId[p.id] = p; });
    const REGIONS = {}; Object.keys(def.regions || {}).forEach(k => { const r = def.regions[k]; if (r && maps[r.map]) REGIONS[k] = r; });

    /* positie van een plaats op een kaart (eigen kaart of 'also'), anders null */
    function pos(p, mapId) {
      if (!p) return null;
      if (p.map === mapId && typeof p.x === "number") return { x: p.x, y: p.y };
      const a = p.also && p.also[mapId]; return a ? { x: a[0], y: a[1] } : null;
    }
    function placesOn(mapId) { const out = []; PLACES.forEach(p => { const q = pos(p, mapId); if (q) out.push({ place: p, x: q.x, y: q.y }); }); return out; }
    function norm(p, mapId) { const m = maps[mapId || p.map], q = pos(p, m.id); return q ? { x: q.x / m.w, y: q.y / m.h } : null; }

    /* Koppel een plaats aan: een expliciete id, een locatienaam/tekst (alias-deelstring; langste alias wint) of een regio. */
    function resolvePlace(opts) {
      opts = opts || {};
      if (opts.id && byId[opts.id]) return byId[opts.id];
      const texts = [opts.name, opts.text].map(lc).filter(Boolean);
      let best = null, bl = 0;
      texts.forEach(tx => PLACES.forEach(p => (p.alias || []).forEach(a => { a = lc(a); if (a.length > bl && tx.indexOf(a) >= 0) { best = p; bl = a.length; } })));
      if (best) return best;
      if (opts.region && REGIONS[opts.region]) { const r = REGIONS[opts.region]; return { id: "regio:" + opts.region, name: r.name, map: r.map, x: r.x, y: r.y, region: opts.region, alias: [], regionOnly: true }; }
      return null;
    }
    /* Welke plaats hoort bij deze beurt? Eerst de door de DM gekozen id, dan de naam van de nieuwe locatie, dan de locatietekst van de Stand, dan de regio. */
    function determinePlace(o) {
      o = o || {};
      let p = resolvePlace({ id: o.id }); if (p) return p;
      p = resolvePlace({ name: o.locName }); if (p) return p;
      p = resolvePlace({ text: o.sceneText }); if (p) return p;
      return resolvePlace({ region: o.region });
    }
    /* Een bezoek vastleggen: geeft de paden (relatief onder campaigns/<cid>/) en de vorige waarden (voor Terug) terug. mapNow = huidige map-tak of null. */
    function planVisit(mapNow, place, date, locSlug, nowMs) {
      const out = { set: {}, prev: [] }; if (!place) return out;
      const m = mapNow || {}, cur = m.current || null, vis = m.visited || {}, ex = vis[place.id] || null;
      if (place.regionOnly && cur && cur.region === place.region) return out; /* nog in dezelfde streek: blijf op de huidige plaats */
      const get = p => { const k = p.replace(/^map\//, "").split("/"); let c = m; for (const x of k) { if (c == null) return null; c = c[x]; } return c == null ? null : c; };
      const put = (p, v) => { out.prev.push({ p: p, v: get(p) }); out.set[p] = v; };
      const base = "map/visited/" + place.id + "/", arrival = !cur || cur.id !== place.id;
      put("map/current", { id: place.id, name: place.name, region: place.region || null, at: nowMs || null });
      if (!ex) { put(base + "name", place.name); put(base + "region", place.region || null); if (date) put(base + "first", date); }
      if (date) put(base + "last", date);
      if (arrival || !ex) put(base + "n", ((ex && ex.n) || 0) + 1);
      if (locSlug && !(ex && ex.locs && ex.locs[locSlug])) put(base + "locs/" + locSlug, true);
      return out;
    }
    /* de kaart waarop een plaats (of regiopunt) het eerst te zien is */
    const mapOf = p => (p && p.map) || start;
    return { def: def, maps: maps, mapIds: mapIds, start: start, MAP: maps[start], PLACES: PLACES, REGIONS: REGIONS, byId: byId, ids: PLACES.map(p => p.id),
      pos: pos, placesOn: placesOn, norm: norm, mapOf: mapOf, resolvePlace: resolvePlace, determinePlace: determinePlace, planVisit: planVisit };
  }

  /* Midden-aarde: de bestaande gegevens van map-data.js (één kaart) als definitie */
  function fromLegacy(MD) {
    const id = "middenaarde", maps = {}; maps[id] = { name: "Midden-aarde", file: MD.MAP.file, w: MD.MAP.w, h: MD.MAP.h };
    const regions = {}; Object.keys(MD.REGIONS).forEach(k => { regions[k] = Object.assign({ map: id }, MD.REGIONS[k]); });
    return { enabled: true, start: id, maps: maps, regions: regions, places: MD.PLACES.map(p => Object.assign({}, p, { map: id })) };
  }
  /* Controle van een kaartdefinitie (voor de editor en de tests); lijst met meldingen, leeg = goed */
  function validate(def) {
    const e = [], isO = o => o && typeof o === "object" && !Array.isArray(o);
    if (!isO(def)) return ["map: geen object"];
    if (def.enabled === false) return e;
    if (!isO(def.maps) || !Object.keys(def.maps).length) return ["map.maps: minstens één kaart"];
    Object.keys(def.maps).forEach(k => { const m = def.maps[k]; if (!/^[a-z0-9_-]+$/.test(k) || !isO(m) || typeof m.file !== "string" || !/^assets\/[A-Za-z0-9_\/.-]+\.(jpe?g|png|webp)$/.test(m.file) || !(m.w > 0 && m.h > 0) || typeof m.name !== "string") e.push("kaart '" + k + "': id (a-z 0-9 - _), name, file (assets/….jpg|png|webp), w en h"); if (m && m.parent && !def.maps[m.parent]) e.push("kaart '" + k + "': parent bestaat niet"); });
    if (def.start && !def.maps[def.start]) e.push("map.start verwijst naar een onbekende kaart");
    const seen = {};
    (def.places || []).forEach(p => {
      if (!isO(p) || !/^[a-z0-9_-]+$/.test(String(p.id)) || typeof p.name !== "string" || !def.maps[p.map]) { e.push("plaats '" + (p && p.id) + "': id, name en map (bestaande kaart) zijn verplicht"); return; }
      if (seen[p.id]) e.push("plaats-id '" + p.id + "' komt dubbel voor"); seen[p.id] = true;
      const m = def.maps[p.map]; if (!(p.x >= 0 && p.x <= m.w && p.y >= 0 && p.y <= m.h)) e.push("plaats '" + p.id + "': x/y buiten kaart '" + p.map + "' (" + m.w + "x" + m.h + ")");
      if (p.zoom && !def.maps[p.zoom]) e.push("plaats '" + p.id + "': zoom verwijst naar een onbekende kaart");
      Object.keys(p.also || {}).forEach(k => { const a = p.also[k], mm = def.maps[k]; if (!mm || !Array.isArray(a) || !(a[0] >= 0 && a[0] <= mm.w && a[1] >= 0 && a[1] <= mm.h)) e.push("plaats '" + p.id + "': also." + k + " is geen geldige [x, y]"); });
      if (p.alias != null && (!Array.isArray(p.alias) || !p.alias.every(a => typeof a === "string"))) e.push("plaats '" + p.id + "': alias moet een lijst met tekst zijn");
    });
    Object.keys(def.regions || {}).forEach(k => { const r = def.regions[k], m = r && def.maps[r.map]; if (!/^REG-[A-Z]+$/.test(k) || !m || !(r.x >= 0 && r.x <= m.w && r.y >= 0 && r.y <= m.h) || typeof r.name !== "string") e.push("regio '" + k + "': REG-id, name, map en x/y binnen de kaart"); if (r && r.primary && !seen[r.primary]) e.push("regio '" + k + "': primary '" + r.primary + "' is geen plaats"); });
    return e;
  }
  return { make: make, fromLegacy: fromLegacy, validate: validate };
});
