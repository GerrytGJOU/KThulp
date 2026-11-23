/* Padkeuze voor de NPC-/locatietabellen (portretten en locatiebeelden) van een campagne.
   Oude campagnes delen de globale tabellen (npcs, locations); een campagne met ownTables:true in campaignIndex heeft ze onder
   campaigns/{cid}/npcs en campaigns/{cid}/locations (zie dnd/index.html tblPath()). Geeft paden RELATIEF aan /dnd terug.
   Gebruik: const T = require("./tables.js")(get);  T(cid, "npcs") -> "npcs" of "campaigns/<cid>/npcs"
   `get` is de lees-functie van de aanroepende tool (neemt een pad als "/dnd/...", geeft JSON of null). */
"use strict";
module.exports = function (get) {
  const cache = {};
  return function (cid, kind) {
    if (kind !== "npcs" && kind !== "locations") throw new Error("Onbekende tabel: " + kind);
    if (!(cid in cache)) { let v = null; try { v = get("/dnd/campaignIndex/" + cid + "/ownTables"); } catch (e) { v = null; } cache[cid] = v === true; }
    return cache[cid] ? "campaigns/" + cid + "/" + kind : kind;
  };
};
