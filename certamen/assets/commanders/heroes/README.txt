CERTAMEN — Boss Battle commander-sprites ("held tegen baas")
================================================================

In Team vs Team krijgt elk team een "Commander Spectre" (semi-transparante
geest, zie BM_COMMANDERS in battle-data.js en CommanderSpectre in battle.js).
In Boss Battle heeft de baas geen commandant (er is geen tegenstander-team),
maar team A (de klas) krijgt in plaats van een factie-commandant de
mythologische held die traditioneel tegen die specifieke baas streed.

Koppeling (BOSS_PRESETS[id].hero in certamen/bossbattle.js):

  hydra     → Herakles   (versloeg de Hydra van Lerna)
  cyclops   → Odysseus   (verblindde Polyfemus de Cycloop)
  minotaur  → Theseus    (versloeg de Minotaurus in het Labyrinth)

Verwachte bestandsnamen (zelfde stijl/formaat als de bestaande commandanten
in assets/commanders/<factie>/*.png — een semi-transparante "geest"-
afbeelding, geen spritesheet):

  herakles.png
  odysseus.png
  theseus.png

Nieuwe held-art toevoegen
--------------------------
1. Bestand in deze map plaatsen.
2. In bossbattle.js het `hero.img`-veld van de bijbehorende BOSS_PRESETS-
   entry invullen/controleren (pad relatief aan certamen/, dus
   "assets/commanders/heroes/naam.png").
