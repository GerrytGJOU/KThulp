/* Laadt alle vaste settings voor Node (de DM-tools). In de browser staan de losse scripts in index.html (zelfde volgorde). */
"use strict";
require("./settings-rulesets.js"); require("./settings-rulesets-d100.js"); require("./settings-rulesets-other.js"); require("./settings-ruleref.js");
const D = require("./settings-data.js");
["./settings-aldmark.js", "./settings-faerun.js", "./settings-westeros.js", "./settings-thedas.js", "./settings-theros.js", "./settings-grieks.js", "./settings-witcher.js", "./settings-tamriel.js", "./settings-discworld.js", "./settings-d100.js", "./settings-swtor.js", "./settings-avatar.js", "./settings-harrypotter.js"].forEach(f => require(f));
require("./settings-maps.js"); /* kaarten van de vaste settings */
module.exports = D;
