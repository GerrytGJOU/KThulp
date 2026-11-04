/* ============================================================================
   KTVocab — gedeelde woordenlijst-kern voor ALLE Latijn-/Grieks-apps.
   ----------------------------------------------------------------------------
   Eén bron per taal (assets/vocab/vocab-la.js, vocab-el.js: de frequentielijst
   van ±1000 woorden, Pallas/Minerva) i.p.v. een eigen kopie in elke app. Elke
   app vraagt hier zijn eigen "weergave" op, in precies de vorm die hij al
   gebruikte:

     KTVocab.ludus()       Latijn  → [{f,la,ex,co,nl,pos,vw}]            (latijn/ludus)
     KTVocab.verbaLA()     Latijn  → [{id,freq,latijn,latijn_base,…}]    (latijn/verba)
     KTVocab.certamenLA()  Latijn  → [{f,la,nl,pos}]                     (certamen)
     KTVocab.agora()       Grieks  → [{f,gr,tr,ex,ge,nl,pos,vw}]         (grieks/agora)
     KTVocab.verbaEL()     Grieks  → [{id,freq,grieks,extra,…}]          (grieks/verba)
     KTVocab.certamenEL()  Grieks  → [{f,la(=Grieks lemma),nl,pos}]      (certamen)

   Elke aanroep geeft verse objecten terug (een app mag ze dus muteren).

   Opslag per woord (rij in KTVocab.data.la / .el): de kernvelden van
   Ludus/Agora, plus optioneel
     s   "acv" = in welke weergaven de rij voorkomt (a=Ludus/Agora, c=Certamen,
         v=Verba); ontbreekt = overal
     c / v   afwijking voor Certamen resp. Verba:
         object  → wordt over de standaard-projectie (zie DEF) heen gelegd
         array   → die rijen, letterlijk (gesplitste lemma's: "ut (+ind.)", …;
                    [] = het woord komt in die weergave niet voor)
   Een afwijking is dus een bewuste, zichtbare uitzondering: dezelfde vertaling
   in alle apps = de uitzondering verwijderen.
   ============================================================================ */
(function (root) {
  "use strict";
  const store = { la: [], el: [] };

  // Verba's categorieën: pos-regels zonder punt/toelichting ("adj. (indecl.)" → "adj")
  function cats(pos, greek) {
    return String(pos || "").split("\n").map(function (p) {
      p = p.replace(/\s*\(.*$/, "").trim();
      return greek ? p.replace(/\.$/, "") : p.replace(/\..*$/, "");
    }).filter(Boolean);
  }

  const DEF = {
    c_la: function (b) { return { f: b.f, la: b.la, nl: b.nl, pos: b.pos }; },
    c_el: function (b) { return { f: b.f, la: b.gr, nl: b.nl, pos: b.pos }; },
    v_la: function (b) {
      return { freq: b.f, latijn: b.la, latijn_base: b.la, extra: b.ex, vertaling: b.nl, categorieen: cats(b.pos, false) };
    },
    v_el: function (b) {
      return { freq: b.f, grieks: b.gr, extra: b.ex, woordsoort: b.pos, vertaling: b.nl, categorieen: cats(b.pos, true), bron: "frequentielijst" };
    }
  };

  function strip(r) {
    const o = {};
    for (const k in r) if (k !== "c" && k !== "v" && k !== "s") o[k] = r[k];
    return o;
  }

  function expand(rows, view, def) {
    const out = [];
    rows.forEach(function (r) {
      if (r.s && r.s.indexOf(view) < 0) return;
      if (view === "a") { out.push(strip(r)); return; }
      const ov = r[view];
      if (Array.isArray(ov)) { ov.forEach(function (x) { out.push(Object.assign({}, x)); }); return; }
      out.push(Object.assign(def(strip(r)), ov || {}));
    });
    if (view === "v") out.forEach(function (x, i) { x.id = i + 1; });
    return out;
  }

  root.KTVocab = {
    data: store,
    ludus: function () { return expand(store.la, "a"); },
    certamenLA: function () { return expand(store.la, "c", DEF.c_la); },
    verbaLA: function () { return expand(store.la, "v", DEF.v_la); },
    agora: function () { return expand(store.el, "a"); },
    certamenEL: function () { return expand(store.el, "c", DEF.c_el); },
    verbaEL: function () { return expand(store.el, "v", DEF.v_el); },
    _DEF: DEF
  };
  if (typeof module !== "undefined" && module.exports) module.exports = root.KTVocab;
})(typeof window !== "undefined" ? window : globalThis);
