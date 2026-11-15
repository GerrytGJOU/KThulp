/* Kaartgegevens voor de Kaart-tab van de D&D-app (dnd/): plaatsen met pixelcoördinaten op dnd/assets/middle-earth-map.jpg
   (2000 x 1091), alias-namen om een locatienaam uit het spel aan een plaats te koppelen, en regio-middelpunten als terugval.
   Geen geheimen: alleen Tolkien-geografie en de (voorgestelde) campagneplaatsen. Eén bestand voor browser (window.DNDMap) en Node.
   Coördinaten zijn gecontroleerd met een raster-overlay (dnd/tools/map-overlay.js); wijzig ze nooit op gevoel. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.DNDMap = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  const MAP = { file: "assets/middle-earth-map.jpg", w: 2000, h: 1091 };
  /* id, naam, [x, y], regio, aliassen (kleine letters, deelstring-match), optioneel: fictional (campagne-eigen plaats) */
  const P = (id, name, x, y, region, alias, extra) => Object.assign({ id: id, name: name, x: x, y: y, region: region, alias: alias || [] }, extra || {});
  const PLACES = [
    P("rivendell", "Rivendell (Imladris)", 985, 295, "REG-RIVENDELL", ["rivendell", "imladris", "last homely house", "gastvrije huis", "laatste gastvrije"]),
    P("bree", "Bree", 757, 313, "REG-ERIADOR", ["bree", "prancing pony", "dansende pony"]),
    P("hobbiton", "De Shire (Hobbiton)", 655, 330, "REG-SHIRE", ["shire", "hobbiton", "bag end", "hobbitstee", "bij de waterkant"]),
    P("grey_havens", "Grey Havens (Mithlond)", 530, 293, "REG-ERIADOR", ["grey havens", "mithlond", "grijze havens"]),
    P("weathertop", "Weathertop (Amon Sûl)", 845, 285, "REG-ERIADOR", ["weathertop", "amon sul", "amon sûl", "windbergen"]),
    P("fornost", "Fornost", 735, 232, "REG-ERIADOR", ["fornost", "norbury"]),
    P("tharbad", "Tharbad", 770, 445, "REG-ERIADOR", ["tharbad"]),
    P("midgewater", "Midgewater-moeras", 778, 293, "REG-ERIADOR", ["midgewater", "muggenmoeras"]),
    P("trollshaws", "De Trollshaws", 940, 290, "REG-ERIADOR", ["trollshaws", "trollenbossen", "east bridge", "last bridge", "laatste brug"]),
    P("drie_elzen", "Huis van de Drie Elzen (contactpunt)", 805, 322, "REG-ERIADOR", ["drie elzen", "three elms", "huis van de drie"], { fictional: true }),
    P("hoge_pas", "De Hoge Pas", 1050, 268, "REG-MISTY", ["hoge pas", "high pass", "bergpas"]),
    P("gundabad", "Mount Gundabad", 1000, 128, "REG-MISTY", ["gundabad"]),
    P("moria", "Moria (Khazad-dûm)", 925, 432, "REG-MISTY", ["moria", "khazad", "dimrill", "nimrodel"]),
    P("dimrill", "Dimrill Dale", 1030, 415, "REG-MISTY", ["dimrill dale", "azanulbizar"]),
    P("carrock", "De Carrock", 1095, 258, "REG-ANDUIN", ["carrock", "beorns", "beorn"]),
    P("anduin_vales", "De Vales van Anduin", 1068, 340, "REG-ANDUIN", ["vales of anduin", "vales van anduin", "anduin", "oude voorde", "old ford", "overtocht"]),
    P("gladden", "Gladden Fields", 1122, 372, "REG-ANDUIN", ["gladden", "loeg ningloron", "irisbloem"]),
    P("lorien", "Lothlórien", 1028, 490, "REG-ANDUIN", ["lorien", "lórien", "lothlorien", "lothlórien", "caras galadhon"]),
    P("mirkwood", "Mirkwood (Greenwood the Great)", 1180, 262, "REG-MIRKWOOD", ["mirkwood", "greenwood", "demsterwoud", "boswachters van", "woudland"]),
    P("dol_guldur", "Dol Guldur", 1152, 458, "REG-MIRKWOOD", ["dol guldur", "emyn duir", "necromancer", "buitenpost"]),
    P("eryn_thurin", "Eryn Thurin (Silvan-gemeenschap)", 1112, 440, "REG-MIRKWOOD", ["eryn thurin", "tawarwaith"], { fictional: true }),
    P("erebor", "Erebor (de Lonely Mountain)", 1257, 182, "REG-EREBOR", ["erebor", "lonely mountain", "eenzame berg", "dale", "dwergenrijk"]),
    P("esgaroth", "Esgaroth (Laketown)", 1268, 214, "REG-EREBOR", ["esgaroth", "laketown", "meerstad"]),
    P("iron_hills", "De Iron Hills", 1455, 168, "REG-EREBOR", ["iron hills", "ijzerheuvels"]),
    P("isengard", "Isengard (Orthanc)", 890, 592, "REG-ROHAN", ["isengard", "orthanc", "nan curunir"]),
    P("fangorn", "Fangorn", 990, 612, "REG-ROHAN", ["fangorn", "entwoud"]),
    P("dunland", "Dunland", 880, 530, "REG-ROHAN", ["dunland"]),
    P("helms_deep", "Helm's Deep", 942, 672, "REG-ROHAN", ["helm's deep", "helms deep", "helmsdiepte", "hoornburg", "hornburg"]),
    P("edoras", "Edoras", 958, 708, "REG-ROHAN", ["edoras", "meduseld", "rohan"]),
    P("minas_tirith", "Minas Tirith", 1215, 760, "REG-GONDOR", ["minas tirith", "witte stad", "pelennor"]),
    P("osgiliath", "Osgiliath", 1232, 805, "REG-GONDOR", ["osgiliath"]),
    P("pelargir", "Pelargir", 1190, 862, "REG-GONDOR", ["pelargir"]),
    P("dol_amroth", "Dol Amroth", 975, 878, "REG-GONDOR", ["dol amroth"]),
    P("minas_morgul", "Minas Morgul", 1262, 768, "REG-GONDOR", ["minas morgul", "morgul"]),
    P("mount_doom", "Orodruin (de Doemberg)", 1310, 748, "REG-GONDOR", ["orodruin", "doemberg", "mount doom"]),
    P("barad_dur", "Barad-dûr", 1385, 752, "REG-GONDOR", ["barad-dûr", "barad-dur", "mordor"])
  ];
  /* middelpunten van de regio's in het wereldregister (terugval als een plaats niet bekend is) */
  const REGIONS = {
    "REG-RIVENDELL": { name: "Rivendell", x: 985, y: 295, primary: "rivendell" }, "REG-ERIADOR": { name: "Eriador", x: 780, y: 340, primary: "bree" }, "REG-SHIRE": { name: "De Shire", x: 655, y: 330, primary: "hobbiton" },
    "REG-MISTY": { name: "De Misty Mountains", x: 1010, y: 380, primary: "hoge_pas" }, "REG-ANDUIN": { name: "De Vales van Anduin", x: 1068, y: 340, primary: "anduin_vales" }, "REG-MIRKWOOD": { name: "Mirkwood", x: 1180, y: 262, primary: "mirkwood" },
    "REG-EREBOR": { name: "Erebor en Dale", x: 1257, y: 190, primary: "erebor" }, "REG-ROHAN": { name: "Rohan", x: 1000, y: 650, primary: "edoras" }, "REG-GONDOR": { name: "Gondor", x: 1200, y: 790, primary: "minas_tirith" }
  };
  const byId = {}; PLACES.forEach(p => { byId[p.id] = p; });
  const lc = s => String(s == null ? "" : s).toLowerCase();

  /* Koppel een plaats aan: een expliciete id, een locatienaam/tekst (alias-deelstring; langste alias wint) of een regio. */
  function resolvePlace(opts) {
    opts = opts || {};
    if (opts.id && byId[opts.id]) return byId[opts.id];
    const texts = [opts.name, opts.text].map(lc).filter(Boolean);
    let best = null, bl = 0;
    texts.forEach(tx => PLACES.forEach(p => p.alias.forEach(a => { if (a.length > bl && tx.indexOf(a) >= 0) { best = p; bl = a.length; } })));
    if (best) return best;
    if (opts.region && REGIONS[opts.region]) { const r = REGIONS[opts.region]; return { id: "regio:" + opts.region, name: r.name, x: r.x, y: r.y, region: opts.region, alias: [], regionOnly: true }; }
    return null;
  }
  /* Welke plaats hoort bij deze beurt? Eerst de door de DM gekozen id, dan de naam van de nieuwe locatie, dan de locatietekst van de Stand, dan de regio. */
  function determinePlace(o) {
    o = o || {};
    let p = resolvePlace({ id: o.id });
    if (p) return p;
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
    const base = "map/visited/" + place.id + "/";
    const arrival = !cur || cur.id !== place.id;
    put("map/current", { id: place.id, name: place.name, region: place.region || null, at: nowMs || null });
    if (!ex) { put(base + "name", place.name); put(base + "region", place.region || null); if (date) put(base + "first", date); }
    if (date) put(base + "last", date);
    if (arrival || !ex) put(base + "n", ((ex && ex.n) || 0) + 1);
    if (locSlug && !(ex && ex.locs && ex.locs[locSlug])) put(base + "locs/" + locSlug, true);
    return out;
  }
  const norm = p => ({ x: p.x / MAP.w, y: p.y / MAP.h });
  return { MAP: MAP, PLACES: PLACES, REGIONS: REGIONS, byId: byId, resolvePlace: resolvePlace, determinePlace: determinePlace, planVisit: planVisit, norm: norm, ids: PLACES.map(p => p.id) };
});
