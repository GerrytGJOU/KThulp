# Castra Heroum — waar leven de mythische wezens? (stand 2026-10-25)

Mythische wezens komen voor via de **tak** (`taks`) van een terrein: een terrein met `myth:{ p, taks }` geeft die kans op een wezen uit die takken. Dit is de lijst per tak, met waar ze nu leven en een voorstel voor verstopte, specifieke plekken. Doel (Gerben): goed verstopt, niet te snel; elk wezen bij zijn mythe.

**Al gedaan:** Schimmen (Umbra → Lemur → Larva) leven alleen nog op het kerkhof (`roma/sepulcretum`, zone ten zuiden van de catacombentrap) en in de catacomben (`roma/catacumbae`); overal elders zijn ze uit de tabellen gehaald (test in `tools/castra-enc-test.js`, onderdeel 5).

| Tak | Vormen | Nu te vinden | Voorstel (specifiek, verstopt) |
|---|---|---|---|
| Schimmen | Umbra, Lemur, Larva | Roma: kerkhof en catacomben | **Klaar.** Eventueel later alleen 's nachts op het kerkhof. |
| Saters | Satyrus, Silenus | Latium silva en specus, Gallia silva, Graecia olea en mons, Germania silva | Graecia: een **Bacchus-lichting** in de olijfgaard (Dionysos); Latium: de **Lupercal** (grot, Faunus). Silenus alleen bij de Graecia-lichting. Uit Gallia en Germania halen. |
| Nimfen | Nympha → Dryas, Naias, Oreas, Nereis | Latium silva en Tiber, Graecia olea, Troia Scamander, Gallia silva en Rijn, Aegyptus Nilus, Laconia Eurotas, Germania palus en Rijn, Themiscyra silva | Specifiek per soort: **Dryas** in een bosje met één oude eik (Themiscyra of Latium silva); **Naias** bij een bron/meer (de meertjes in Graecia, Troia en Germania); **Oreas** op de berg (Graecia mons); **Nereis** aan de kust (Troia litus). Nympha zelf op alle vier de plekken, evolueert bij de plek. |
| Centauren | Pullus centauri → Centaurus → Centaurus sagittarius | Graecia mons, Troia campus, Laconia mons en campus, Themiscyra silva en campus, Taygetus | **Pelion** (Graecia mons, noordwestelijke terras van de berg), **Taygetos** (Laconia, de grot) en een **open vlakte** in Themiscyra. Niet meer op de gewone velden. |
| Harpijen | Harpyia | Graecia kust, Troia kust, Africa kust, Themiscyra mons en kust, Antrum Martis | **Phineus' kust** (Graecia litus, zuidpunt) en de **kliffen van Themiscyra** (mons). Verder niet. |
| Grijpvogels | Pullus grypis → Gryps | Graecia mons, Laconia mons, Persis mons, Themiscyra mons, Taygetus | **Persis mons** (goud bewaken: de Greypen van het Oosten) en de **top van de Graecia-berg**. Uit Laconia en Themiscyra halen. |
| Sirenen | Siren | Graecia kust, Troia kust, Africa kust, Themiscyra kust | **Anthemoessa** (een klein eiland-schiereiland, Graecia litus) en een rif voor Africa. Alleen 's nachts mogelijk. |
| Cyclopen | Cyclops pastor → Cyclops faber | Troia muren, Cuniculus (Troje) | **Cyclopenmuren van Troje** (Troia muros, een afgesloten hoek) en de **smidse** in een grot (Latium specus: Vulcanus' smid, Faber-vorm). |
| Zeepaarden | Hippocampus | Graecia kust, Troia Scamander, Gallia Rijn, Africa kust | **Poseidons baai** (Graecia litus, noordelijk) en de **monding van de Scamander**. Niet in rivieren elders. |
| Myrmidonen | Formica → Myrmido | Graecia urbs | Aegina: een **mierenheuvel** op een verlaten veld in Graecia (urbs, achterhoek). Dit is al heel specifiek: laten staan. |
| Gezaaide mannen | Dens draconis → Spartus | Graecia urbs, Laconia urbs | **Thebe/het zaaiveld** (Graecia urbs, een akker) en Sparta zelf (Laconia urbs, een hoek). Kans laag houden. |
| Draken | Anguis → Serpens → Draco | Aegyptus woestijn, Persis bergen, Africa woestijn, Labyrinthus, Hercynia, Sepulcrum, Hannibals grot, Germania silva | **Colchis-draak** (Graecia, een rotsspleet in de berg), **Hercynia** (Germania, de grot, Fafnir-achtig), **Labyrinthus**. Uit woestijnen halen, behalve één **gecijferde zandspleet** in Persis. |
| Gevleugelde paarden | Pullus alatus → Equus alatus | Persis campus, Themiscyra campus | **Pegasus' bron** (Graecia mons, een hoogvlakte met een bron, Hippocrene) en een weide in Themiscyra. Uit Persis halen. |
| Feniks | Phoenix | Aegyptus stad en woestijn, Persis stad, Africa woestijn, piramide, Sepulcrum, Hannibals grot | **Heliopolis** (Aegyptus urbs, een tempelplein; eens per dag, laagste kans) en het **koningsgraf** in Persis. Niet meer in woestijnen. |
| Wolven van Mars | Lupus → Lupus Martius | Latium silva, campus en specus, Gallia silva en oppidum, Roma arena en kamp en Via, Germania silva en dorp, Antrum, Hercynia, Martis | **Lupercal** (Latium specus), **Mars-akker** (Roma castra, een hoek, Campus Martius), **Antrum Martis** (Themiscyra). Niet in alle bossen. |
| Adelaars van Jupiter | Aquila → Aquila Iovis | Latium weg, Gallia campus, Persis weg, Roma forum en Via, Germania Rijn, Africa stad en veld | **Capitolium** (Roma forum, een hoek), **de Via Appia** (Roma via), en een **Persische koningsweg**. Alleen overdag. |

## Bouwstenen om dit uit te voeren
- Een nieuw terrein per plek (zoals `sepulcretum`): zone op de kaart, eigen tabel, `taks` met één of twee takken. Zones zijn al tikbare gebieden (`castra-zones.js`).
- Dag/nacht: `CASTRA_PHASE`/`castra-dayn.js` kent al een nachtlaag; "alleen 's nachts" (Lemur, Sirenen) en "alleen overdag" (Adelaars) is daar een kleine uitbreiding.
- Zeldzaamheid: `myth.p` per terrein (nu 0.03–0.40) plus de kans op een ontmoeting in de regio. Voorstel: één plek per wezen op 0.25–0.35, en de rest van de kaart op 0 voor die tak.
- Om ze te vinden: een bord of persoon die erheen wijst (zoals de catacomben-Custos), liefst met een Latijnse hint.
