/* Laadt alle vaste settings voor Node (de DM-tools). In de browser staan de losse scripts in index.html (zelfde volgorde). */
"use strict";
const D = require("./settings-data.js");
["./settings-aldmark.js", "./settings-faerun.js", "./settings-westeros.js", "./settings-thedas.js", "./settings-theros.js", "./settings-grieks.js"].forEach(f => require(f));
require("./settings-maps.js"); /* kaarten van de vaste settings */
module.exports = D;
