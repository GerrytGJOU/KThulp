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

  return {
    setProvinceOwner,
    setProvinceDefense,
    setProvinceBonus,
    highlightProvince,
    resetProvince,
  };
})();
