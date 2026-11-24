/* Emblemen voor de tegels op het Settings-scherm. Eigen, eenvoudige lijntekeningen (48x48), bewust geen officiële logo's.
   Een kopie van een ingebouwde setting (id "<basis>-kopie-xxxx") erft het embleem; andere eigen settings krijgen het kompas. */
window.DNDSettingIcons = (function () {
  "use strict";
  const dot = function (x, y, r) { return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="currentColor" stroke="none"/>'; };
  const ICONS = {
    /* ring */
    middenaarde: ["#d9b24c", '<ellipse cx="24" cy="25" rx="18" ry="13"/><ellipse cx="24" cy="23" rx="13" ry="8"/>' + dot(24, 7, 1.6) + dot(10, 10, 1) + dot(38, 10, 1)],
    /* ruïnetoren */
    aldmark: ["#a9b7c6", '<path d="M14 42V16l4 3 3-7 4 5 4-4 5 6v23M8 42h32M21 42v-8a3 3 0 0 1 6 0v8M20 24h2M27 24h2"/>'],
    /* twintigvlakkige dobbelsteen */
    faerun: ["#d0705a", '<path d="M24 4l17 10v20L24 44 7 34V14zM24 13l11 19H13zM24 4v9M7 14l6 18M41 14l-6 18M13 32l11 12 11-12M7 14l17-1 17 1"/>'],
    /* kroon */
    westeros: ["#c9c2b0", '<path d="M8 36l-3-22 11 9 8-15 8 15 11-9-3 22zM9 42h30"/>' + dot(5, 12, 2) + dot(24, 6, 2) + dot(43, 12, 2)],
    /* vlammende zon */
    thedas: ["#cf6a4a", '<circle cx="24" cy="24" r="9"/><path d="M24 3v8M24 37v8M3 24h8M37 24h8M9 9l6 6M33 33l6 6M39 9l-6 6M15 33l-6 6M24 19c4 4 4 8 0 10-4-2-4-6 0-10z"/>'],
    /* sterrenbeeld */
    theros: ["#8fb8e8", '<path d="M9 36l8-17 12 5 10-15M29 24l5 16-25-4"/>' + dot(9, 36, 3) + dot(17, 19, 2.5) + dot(29, 24, 3) + dot(39, 9, 3) + dot(34, 40, 2.5) + dot(12, 9, 1.2) + dot(41, 28, 1.2)],
    /* tempel */
    "grieks-mythisch": ["#6fb6d6", '<path d="M5 17L24 6l19 11zM8 21h32M11 21v17M19 21v17M29 21v17M37 21v17M8 38h32M5 43h38"/>'],
    /* gekruiste zwaarden */
    witcher: ["#c4c9cf", '<path d="M8 8l24 24M40 8L16 32M8 8l1 6M8 8l6 1M40 8l-1 6M40 8l-6 1M26 36l10-10M22 36L12 26M33 35l7 7M15 35l-7 7"/>'],
    /* twee manen boven bergen */
    tamriel: ["#d6a96a", '<circle cx="15" cy="14" r="7"/><circle cx="33" cy="10" r="4"/><path d="M3 41l13-18 8 10 7-8 14 16z"/>'],
    /* wereldschildpad */
    discworld: ["#7fbf8f", '<ellipse cx="24" cy="13" rx="19" ry="6"/><path d="M13 19v5M24 20v4M35 19v5M10 34c0-8 6-11 14-11s14 3 14 11zM38 31c5-3 8 0 6 3-2 2-4 1-6 0M13 34l-3 6M34 34l3 6M10 31l-5 3"/>'],
    /* driehoek met oog */
    deltagreen: ["#6fae6a", '<path d="M24 5L44 41H4zM13 30c6-9 16-9 22 0-6 8-16 8-22 0z"/>' + dot(24, 30, 3)],
    /* tentakels */
    coc1920: ["#5fb5a0", '<path d="M14 20a10 11 0 0 1 20 0c0 5-3 7-3 9M14 20c0 5 3 7 3 9M17 29c0 8-3 11-8 11-4 0-5-5-1-6M22 30c0 7 0 10-3 13M26 30c0 7 0 10 3 13M31 29c0 8 3 11 8 11 4 0 5-5 1-6"/>' + dot(20, 19, 2) + dot(28, 19, 2)],
    /* kaars */
    cda1000: ["#e0b060", '<path d="M24 5c6 7 5 13 0 14-5-1-6-7 0-14zM24 19v4M18 23h12v17H18zM18 28c3 0 2 6 5 6M10 43h28"/>'],
    /* fakkel */
    "ose-grensmarken": ["#e08a45", '<path d="M24 4c9 9 12 17 0 21-12-4-8-12-4-14 0 4 2 5 4 5 2-4 0-8 0-12zM16 27h16M19 27l3 17h4l3-17"/>'],
    /* planeet met ring */
    "star-wars-old-republic": ["#7aa6f0", '<circle cx="24" cy="24" r="11"/><path d="M14 20C6 23 2 28 5 31c4 4 17 1 28-5s14-12 9-13c-2-1-5 0-8 1"/>' + dot(8, 9, 1.6) + dot(39, 39, 1.6) + dot(19, 5, 1)],
    /* vier elementen in een cirkel */
    "avatar-tla": ["#62c3d8", '<circle cx="24" cy="24" r="20"/><path d="M24 4v40M4 24h40M10 17c3-5 6 1 9-4M29 17l5-8 5 8zM9 31c3-3 5 3 10 0M9 36c3-3 5 3 10 0M29 32c8-6 12 6 4 6-3 0-3-4 0-4"/>'],
    /* toverstaf met vonken */
    "harry-potter": ["#c59be8", '<path d="M7 42l23-23M12 41l-4-4M33 7v8M29 11h8M41 18v6M38 21h6M20 6v5M17.5 8.5h5M41 34v4M39 36h4"/>'],
    /* kompas: eigen settings */
    eigen: ["#c8a24a", '<circle cx="24" cy="24" r="19"/><path d="M31 17l-5 12-9 3 5-12zM24 5v4M24 39v4M5 24h4M39 24h4"/>']
  };
  ICONS["star-wars-old-republic-edge"] = ICONS["star-wars-old-republic"];
  ICONS["avatar-tla-legends"] = ICONS["avatar-tla"];
  function key(id) {
    let k = String(id || "").replace(/-kopie-[a-z0-9]+$/, "");
    return Object.prototype.hasOwnProperty.call(ICONS, k) ? k : "eigen";
  }
  function svg(id) {
    const i = ICONS[key(id)];
    return '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="color:' + i[0] + '" aria-hidden="true">' + i[1] + "</svg>";
  }
  return { svg: svg, key: key };
})();
