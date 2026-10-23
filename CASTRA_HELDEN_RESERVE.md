# Castra Heroum: reservelijst helden voor een latere update

Stand 2026-10-23. Dit zijn helden die we hebben overwogen maar (nog) niet hebben gebouwd. Gekozen voor de 20 (17 + Cassandra, Prometheus, Circe): zie `CASTRA_HEROUM.md` en `certamen/assets/sprites-forms/HELDEN_EVOLUTIE.md`.
Bouwen gaat zoals bij de rest: een blok in `CASTRA_HERO_DATA` (`certamen/castra-heroes.js`), een blok `_HE_H(...)` in `certamen/castra-heroevo-all.js`, een verhaal-arte in `CASTRA_HERO_SIG`, een Castra-niveau in `CASTRA_HERO_MINLVL` en de held in de `traces`-lijst van zijn regio (`certamen/castra-latin.js`).

## Stand van de klassen na 20 helden (specialisaties)
Spartaan 6, cavalerie 6, hopliet 5, verkenner 5, boogschutter 4, centurio 4, priester 4, myth 4, genie 3. Boogschutter, centurio en genie zijn dus nog de dunste; kies daar eerst uit bij een volgende ronde.

## Kandidaten uit de laatste ronde
| Held | Regio | Tak A | Tak B | Effect op de klassen |
|---|---|---|---|---|
| Archimedes | Syracuse (Graecia) | Ballistarius (genie, oorlogsmachines) → Radii Solis (brandspiegels) | Geometra (centurio, steun) → Sapiens Syracusarum | genie +1, centurio +1 |
| Orpheus | Graecia | Citharoedus (priester, het lied heelt) → Vates Orphicus | Cantor Umbrarum (myth, onderwereld) → Dominus Umbrarum | priester +1, myth +1 |
| Philoctetes | Troia | Sagittarius (boogschutter, de boog van Hercules) → Heres Herculis | Veneficus (myth, giftige pijlen die vertragen) → Dominus Veneni | boogschutter +1, myth +1 |
| Cleopatra | Aegyptus (nieuwe regio voor helden) | Regina (centurio) → Isis Nova | Sacerdos Isidis (priester) → Isis Incarnata | centurio +1, priester +1 |

## Verdere ideeën (nog niet uitgewerkt)
- **Hannibal** (Africa): cavalerie (Numidische ruiters) of centurio (strateeg); regio Africa heeft nog geen helden.
- **Vercingetorix** (Gallia): centurio (leider van de stammen) of spartaan.
- **Spartacus** (Roma): spartaan of verkenner (gladiator, opstandeling).
- **Rhea Silvia** (Latium): priester (Vestaalse maagd); moeder van Romulus.
- **Teucer** (Troia): boogschutter (broer van Ajax).
- **Paris** (Troia): boogschutter, de pijl die Achilles' hiel raakte.
- **Diana/Artemis**: boogschutter en myth (jageres), overlapt wel met Atalanta en Camilla.
- **Leonidas** (Laconia): hopliet of spartaan, maar die klassen zitten al vol.
- **Hephaestus**: genie (smid van de goden).
- **Imhotep** (Aegyptus): genie en priester.
- Heel andere regio's (Gallia, Germania, Persis, Aegyptus, Africa, Roma, Laconia, Themiscyra) hebben nog geen helden: een toekomstige ronde kan daar helden plaatsen, wat de wereld rijker maakt maar meer werk is (sporenlijst van die regio's, NPC-plekken per kaart en opgeleverde sprites).
