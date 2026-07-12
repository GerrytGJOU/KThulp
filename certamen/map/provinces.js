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
    el.classList.remove("contested"); // kan een eerdere setProvinceContested() overschrijven
    delete el.dataset.attacker;
    if (factionColor) {
      el.style.setProperty("--province-fill", factionColor);
      el.dataset.owner = factionColor; // door de aanroeper te vervangen door faction-id indien gewenst
    } else {
      el.style.removeProperty("--province-fill");
      el.dataset.owner = "neutral";
    }
    return true;
  }

  /* Betwiste provincie (TOTAL_WAR.md §5.3, herdefinitie): een provincie met
     een onderbroken belegering (siege.lastStage gezet, nog niet veroverd) —
     diagonaal gestreept in de kleur van de huidige eigenaar én de aanvaller,
     via een SVG <pattern> (CSS "background" werkt niet op SVG-fill; dat was
     een onnauwkeurigheid in het oorspronkelijke docx-afgeleide plan). Zet
     --province-fill op url(#patroon-id), zodat dit naadloos hergebruikt
     wordt door dezelfde CSS-regel als setProvinceOwner(). Eén pattern-element
     per provincie-id, hergebruikt/bijgewerkt bij een volgende aanroep i.p.v.
     gestapeld. */
  const SVGNS = "http://www.w3.org/2000/svg";
  function setProvinceContested(id, ownerColor, attackerColor, r) {
    const el = province(id, r);
    if (!el) return false;
    const svg = el.closest("svg");
    if (!svg) return false;
    let defs = svg.querySelector("defs");
    if (!defs) {
      defs = document.createElementNS(SVGNS, "defs");
      svg.insertBefore(defs, svg.firstChild);
    }
    const patId = "contested-" + id;
    let pattern = defs.querySelector("#" + patId);
    if (!pattern) {
      pattern = document.createElementNS(SVGNS, "pattern");
      pattern.setAttribute("id", patId);
      pattern.setAttribute("patternUnits", "userSpaceOnUse");
      pattern.setAttribute("width", "2400");
      pattern.setAttribute("height", "2400");
      pattern.setAttribute("patternTransform", "rotate(45)");
      const bg = document.createElementNS(SVGNS, "rect");
      bg.setAttribute("width", "2400"); bg.setAttribute("height", "2400");
      const stripe = document.createElementNS(SVGNS, "rect");
      stripe.setAttribute("width", "1200"); stripe.setAttribute("height", "2400");
      pattern.appendChild(bg);
      pattern.appendChild(stripe);
      defs.appendChild(pattern);
    }
    const rects = pattern.querySelectorAll("rect");
    rects[0].setAttribute("fill", ownerColor || "#dfd5c6");
    rects[1].setAttribute("fill", attackerColor || "#8a4fb0");
    el.style.setProperty("--province-fill", "url(#" + patId + ")");
    el.classList.add("contested");
    el.dataset.owner = ownerColor || "neutral";
    el.dataset.attacker = attackerColor || "";
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
    el.classList.remove("selected", "enemy", "ally", "highlight", "contested");
    el.dataset.owner = "neutral";
    el.dataset.defense = "0";
    el.dataset.forts = "0";
    el.dataset.bonus = "";
    delete el.dataset.attacker;
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
     <g id="mapSeaRoutes"> wordt vervangen, niet gestapeld.

     BELANGRIJKE VALKUIL (opgelost): de provincie-paths zitten geneste in
     legacy-groepen (bv. g#layer3 met transform="translate(...)", daarbinnen
     g#Layer_x0020_1 met wéér een eigen translate). getScreenCTM() van de
     ROOT-<svg> geeft coördinaten in het ROOT-assenstelsel — als je die
     rechtstreeks als x1/y1/x2/y2 op een <line> zet die je vervolgens IN zo'n
     geneste groep invoegt, telt de browser de groepstransform(s) er nog een
     keer overheen, met een grote, systematische verschuiving tot gevolg
     (precies het "zeeroutes staan op de verkeerde plek"-probleem). Fix: eerst
     bepalen WAAR de lijnen komen (vlak vóór de eerste provincie, zie onder),
     en de screenCTM van DIE EXACTE ouder gebruiken — niet van de root-svg —
     zodat de coördinaten kloppen ongeacht hoeveel geneste transforms ertussen
     zitten. */
  function drawSeaRoutes(registry, container) {
    if (!container || typeof container.querySelector !== "function") return null;
    const svg = container.querySelector("svg");
    if (!svg || !registry || typeof svg.createSVGPoint !== "function") return null;
    const old = svg.querySelector("#mapSeaRoutes");
    if (old) old.remove();

    // Invoegpunt eerst bepalen (vlak vóór de eerste provincie = onder land,
    // boven zee) — de CTM van DEZE ouder is de juiste voor de coördinaten.
    const firstProvince = svg.querySelector(".province");
    const insertParent = firstProvince ? firstProvince.parentNode : svg;
    const ctmSource = (insertParent && typeof insertParent.getScreenCTM === "function") ? insertParent : svg;
    const screenCTM = ctmSource.getScreenCTM();

    const ns = "http://www.w3.org/2000/svg";
    const g = document.createElementNS(ns, "g");
    g.setAttribute("id", "mapSeaRoutes");
    g.setAttribute("style", "pointer-events:none");
    const centerOf = (id) => {
      const el = svg.querySelector('[id="' + id + '"], [data-province="' + id + '"]');
      if (!el || !screenCTM) return null;
      try {
        const rect = el.getBoundingClientRect();
        const pt = svg.createSVGPoint(); // createSVGPoint is generiek; alleen matrixTransform() doet ertoe
        pt.x = rect.left + rect.width / 2;
        pt.y = rect.top + rect.height / 2;
        const localPt = pt.matrixTransform(screenCTM.inverse());
        return { x: localPt.x, y: localPt.y };
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
    if (firstProvince) insertParent.insertBefore(g, firstProvince);
    else svg.appendChild(g);
    return g;
  }

  return {
    setProvinceOwner,
    setProvinceContested,
    setProvinceDefense,
    setProvinceBonus,
    highlightProvince,
    resetProvince,
    drawSeaRoutes,
  };
})();
