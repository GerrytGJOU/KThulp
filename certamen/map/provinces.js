/* ============================================================================
   CAMPAGNEKAART — provincie-helpers
   ----------------------------------------------------------------------------
   Frameworkvrij (classic script, past bij de rest van certamen). Werkt op de
   SVG-provincies (elk element .province met een unieke id, bv. "baetica").

   Eigenaarskleuren staan NIET in de SVG: ze worden hier gezet via de CSS-
   variabele --province-fill, zodat de neutrale basis in provinces.css blijft.

   Gebruik:
     MapAPI.setProvinceOwner("baetica", "#3f7d3a");
     MapAPI.setProvinceDefense("baetica", 60);
     MapAPI.highlightProvince("baetica");
   Optioneel een andere root meegeven (bv. een specifieke SVG):
     MapAPI.setProvinceOwner("baetica", "#3f7d3a", mySvgElement);
   ============================================================================ */

const MapAPI = (function () {
  // Standaardwortel: het hele document. Overschrijfbaar per aanroep.
  function root(r) { return r || document; }

  function province(id, r) {
    if (!id) return null;
    const el = root(r).getElementById(id);
    if (!el || !el.classList.contains("province")) return null;
    return el;
  }

  /* Eigenaar zetten: kleur + data-owner. factionColor = CSS-kleur of null. */
  function setProvinceOwner(id, factionColor, r) {
    const el = province(id, r);
    if (!el) return false;
    if (factionColor) {
      el.style.setProperty("--province-fill", factionColor);
      el.dataset.owner = factionColor; // door de aanroeper te vervangen door faction-id indien gewenst
    } else {
      el.style.removeProperty("--province-fill");
      el.dataset.owner = "neutral";
    }
    return true;
  }

  /* Verdedigingssterkte (0..cap). Alleen data; visualisatie is aan de UI. */
  function setProvinceDefense(id, value, r) {
    const el = province(id, r);
    if (!el) return false;
    const v = Math.max(0, Number(value) || 0);
    el.dataset.defense = String(v);
    return true;
  }

  /* Bonus-omschrijving of -id opslaan op de provincie. */
  function setProvinceBonus(id, value, r) {
    const el = province(id, r);
    if (!el) return false;
    el.dataset.bonus = value == null ? "" : String(value);
    return true;
  }

  /* Tijdelijke nadruk (bv. bij hover in een lijst of bij een aanval). */
  function highlightProvince(id, r) {
    const el = province(id, r);
    if (!el) return false;
    el.classList.add("highlight");
    return true;
  }

  /* Alles terug naar neutraal: kleur weg, klassen weg, data-attrs op default. */
  function resetProvince(id, r) {
    const el = province(id, r);
    if (!el) return false;
    el.style.removeProperty("--province-fill");
    el.classList.remove("selected", "enemy", "ally", "highlight");
    el.dataset.owner = "neutral";
    el.dataset.defense = "0";
    el.dataset.forts = "0";
    el.dataset.bonus = "";
    return true;
  }

  /* Zeeroutes tekenen als blauwe stippellijn tussen de zwaartepunten van twee
     provincies (registry: provinces.json, veld "seaRoutes"). Zwaartepunt =
     getBoundingClientRect() (echte gerenderde positie) teruggerekend naar
     SVG-coördinaten via getScreenCTM() — bewust NIET getBBox(), want
     meerdere provincie-paths hebben een eigen "transform"-attribuut
     (translate/matrix) dat getBBox() niet consistent meerekent, wat een
     zwaartepunt ver buiten de provincie zelf zou opleveren.
     "container" MOET het specifieke kaart-element zijn (bv. #twMapHost) —
     niet document/undefined, want de pagina bevat elders ook kleine
     icoon-<svg>'s (iconSVG()) en document.querySelector("svg") zou zomaar de
     eerste daarvan kunnen pakken i.p.v. de kaart. Robuust en onderhoudsvrij,
     ook als de SVG ooit wijzigt (geen aparte stadsmarkers nodig). De lijnen
     zitten in een eigen <g> met pointer-events:none, dus ze onderscheppen
     nooit een klik op een provincie eronder. Idempotent: een eerdere
     <g id="mapSeaRoutes"> wordt vervangen, niet gestapeld. */
  function drawSeaRoutes(registry, container) {
    if (!container || typeof container.querySelector !== "function") return null;
    const svg = container.querySelector("svg");
    if (!svg || !registry || typeof svg.createSVGPoint !== "function") return null;
    const old = svg.querySelector("#mapSeaRoutes");
    if (old) old.remove();
    const ns = "http://www.w3.org/2000/svg";
    const g = document.createElementNS(ns, "g");
    g.setAttribute("id", "mapSeaRoutes");
    g.setAttribute("style", "pointer-events:none");
    const screenCTM = svg.getScreenCTM();
    const centerOf = (id) => {
      const el = svg.querySelector('[id="' + id + '"], [data-province="' + id + '"]');
      if (!el || !screenCTM) return null;
      try {
        const rect = el.getBoundingClientRect();
        const pt = svg.createSVGPoint();
        pt.x = rect.left + rect.width / 2;
        pt.y = rect.top + rect.height / 2;
        const svgPt = pt.matrixTransform(screenCTM.inverse());
        return { x: svgPt.x, y: svgPt.y };
      } catch (e) { return null; }
    };
    const drawn = new Set();
    Object.keys(registry).forEach((id) => {
      if (id === "_meta") return;
      (registry[id].seaRoutes || []).forEach((otherId) => {
        const key = [id, otherId].sort().join("|");
        if (drawn.has(key)) return;
        drawn.add(key);
        const a = centerOf(id), b = centerOf(otherId);
        if (!a || !b) return;
        const line = document.createElementNS(ns, "line");
        line.setAttribute("x1", a.x); line.setAttribute("y1", a.y);
        line.setAttribute("x2", b.x); line.setAttribute("y2", b.y);
        line.setAttribute("stroke", "#2e6fb0");
        line.setAttribute("stroke-width", "320");
        line.setAttribute("stroke-dasharray", "900,600");
        line.setAttribute("stroke-linecap", "round");
        line.setAttribute("opacity", "0.8");
        g.appendChild(line);
      });
    });
    // Vóór de eerste provincie invoegen (niet appendChild!) zodat de lijnen
    // ONDER de provincies liggen (land verbergt ze) maar BOVEN de blauwe
    // zee-achtergrond die al in de brondata zit (dus zichtbaar op open zee).
    // svg.insertBefore() zou hier stuk lopen: de provincie-paths zitten
    // genest in een legacy-groep (g#Layer_x0020_1), niet direct onder <svg>,
    // dus de invoegreferentie moet een ECHT sibling zijn — vandaar dat we op
    // de eigen parent van de eerste provincie invoegen, niet op svg zelf.
    const firstProvince = svg.querySelector(".province");
    if (firstProvince && firstProvince.parentNode) firstProvince.parentNode.insertBefore(g, firstProvince);
    else svg.appendChild(g);
    return g;
  }

  return {
    setProvinceOwner,
    setProvinceDefense,
    setProvinceBonus,
    highlightProvince,
    resetProvince,
    drawSeaRoutes,
  };
})();
